






const mockSeed = () => Math.floor(Math.random() * 46655) + 1;


const MOCK_LV = {
facile: { label: "Facile", A: 1, B: (n) => [1, 2], vf: 1, prob: false },
standard: { label: "Standard", A: 1, B: (n) => (n <= 2 ? [1, 2, 3] : [2, 3]), vf: 2, prob: true },
exigeant: { label: "Exigeant", A: 2, B: (n) => (n <= 2 ? [2, 3, 4] : [3, 4]), vf: 3, prob: true },
};






const richFRCat = {};
function richOkFR(f, profile) {
if (!profile || profile.system !== "FR") return true;
const g = profile.grade, cat = (richFRCat[g] = richFRCat[g] || new Set(Engine.catalog({ system: "FR", grade: g, track: "college", minutes: 5 }).map((n) => n.id)));
for (const sd of [1, 2, 3]) { R.seed(sd); let x; try { x = f(); } catch (e) { return false; } if (!cat.has(x.id) || horsFRTexte(g, qTextAll(x))) return false; }
return true;
}
function richPlan(ch, ids, level) {
const C = RICH[ch], items = [], mine = C.ids.filter((id) => ids.includes(id));
const prof = typeof state !== "undefined" && state && state.profile;

const dA = ({ facile: [1, 1, 1, 1], standard: [1, 2, 1, 2], exigeant: [2, 2, 3, 2] }[level] || [1, 2, 1, 2]).map((d) => Math.max(d, C.minA || 1));

R.seed(mockSeed()); const pickA = mine.length > dA.length ? shuffle(mine.slice()).slice(0, dA.length).sort((a, b) => mine.indexOf(a) - mine.indexOf(b)) : mine;
dA.forEach((d, k) => items.push({ part: "A", id: pickA[k % pickA.length], d, seed: mockSeed() }));
const lvOk = { facile: (l) => l <= 2, standard: () => true, exigeant: (l) => l >= 2 }[level] || (() => true);



const probe = (arr, kind) => arr.map((f, k) => { R.seed(1); const x = f(); return { k, id: x.id, lv: x.lv, kind, ok: ids.includes(x.id) && richOkFR(f, prof) }; }).filter((x) => x.ok);
let ex = probe(C.ex, "ex");
if (ex.filter((x) => lvOk(x.lv)).length >= Math.min(3, ex.length)) ex = ex.filter((x) => lvOk(x.lv));
R.seed(mockSeed());

const scOf = (x) => { try { R.seed(1); return sceneKey(C.ex[x.k]()); } catch (e) { return null; } };
const shuf = shuffle(ex), fresh = shuf.filter((x) => !sceneStale(typeof state !== "undefined" ? state : null, scOf(x))), exB = [];
R.seed(mockSeed());
for (const x of fresh.concat(shuf.filter((y) => !fresh.includes(y)))) { const k = scOf(x); if (exB.length < 3 && !(k && exB.some((y) => scOf(y) === k))) exB.push(x); }
exB.forEach((x, j) => items.push({ part: "B", ex: j, rich: ch, kind: "ex", k: x.k, id: x.id, d: 3, seed: mockSeed() }));
const used = new Set(exB.map((x) => x.id)), rest = ids.filter((id) => !used.has(id)).concat(ids.filter((id) => used.has(id)));
for (let j = exB.length, r = 0; j < 3 && r < rest.length; j++, r++) [2, 3].forEach((d) => items.push({ part: "B", ex: j, id: rest[r], d, seed: mockSeed() }));
const rs = shuffle(probe(C.raison, "raison")).slice(0, 2);
rs.forEach((x) => items.push({ part: "C", rich: ch, kind: "raison", k: x.k, id: x.id, d: 3, seed: mockSeed() }));
if (!rs.length) ids.slice(0, 2).forEach((id) => items.push({ part: "C", id, d: 2, seed: mockSeed(), vf: true }));
return items;
}
function mockPlan(ids, level = "standard") {
const ch = typeof richChapter === "function" && richChapter(ids);
if (ch) return richPlan(ch, ids, level);
const L = MOCK_LV[level] || MOCK_LV.standard, items = [], n = ids.length;

ids.slice(0, 5).forEach((id) => items.push({ part: "A", id, d: L.A, seed: mockSeed() }));

ids.slice(0, 4).forEach((id, ex) => L.B(n).forEach((d) => items.push({ part: "B", ex, id, d: d === 4 && typeof hasProb === "function" && hasProb(id) ? 3 : d, seed: mockSeed() })));

ids.slice(0, n >= 3 ? 2 : 1).forEach((id, k) => items.push({ part: "C", id: ids[(k + 1) % n], d: L.vf, seed: mockSeed(), vf: true }));
const pid = L.prob && ids.find((id) => typeof hasProb === "function" && hasProb(id));
if (pid) items.push({ part: "C", id: pid, d: 4, seed: mockSeed() });
return items;
}


function mockShow(v) {
if (!isFinite(v)) return null;
if (Math.abs(v * 1e6 - Math.round(v * 1e6)) < 1e-6) return dec(+v.toFixed(6));
for (let d = 2; d <= 60; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return frac(n, d); }
return null;
}

function mockVF(it, q) {
const sp = q.spec || {};
if (sp.kind !== "value" || sp.round || mockShow(sp.value) === null || q.ctx === "erreur" || /Trouve l.erreur/.test(q.q || "")) return null;
const v = sp.value, isTrue = it.seed % 2 === 0;
let w = v;
if (!isTrue) {
const t = (q.traps || []).find((x) => mockShow(x.v) !== null && Math.abs(x.v - v) > 1e-9);
if (t) w = t.v;
else { const k = (it.seed % 3) + 1; w = Number.isInteger(v) ? v + (it.seed % 4 < 2 ? k : -k) : +(v + (it.seed % 4 < 2 ? 1 : -1) * k * 10 ** -Math.min(3, String(v).split(".")[1].length)).toFixed(6); }
if (w === v || mockShow(w) === null) w = v + 2;
}
const who = ["Léa", "Noé", "Lina", "Sam", "Yanis", "Inès"][it.seed % 6];
return { ...q, vfTrue: w === v,
q: q.q + "<br>" + who + " répond " + M(mockShow(w)) + ". <b>A-t-" + (["Léa", "Lina", "Inès"].includes(who) ? "elle" : "il") + " raison ? Justifie.</b>",
sol: "<b>" + (w === v ? "Vrai" : "Faux, la bonne réponse est " + M(mockShow(v))) + ".</b> " + (q.sol || "") };
}

const mockTitle = (x) => (x.q.parts ? "Problème" : x.vf ? "Vrai ou faux ?" : /Trouve l.erreur/.test(x.q.q || "") ? "Trouve l'erreur" : "Question");
function mockQuestions() {
return state.mock.items.map((it) => {
if (it.rich && RICH[it.rich]) { R.seed(it.seed); const q = moneyQ(RICH[it.rich][it.kind === "raison" ? "raison" : "ex"][it.k]()); return { ...it, id: q.id, q, pts: q.pts }; }
let q = Engine.make(state, it.id, it.d, it.seed);
if (it.vf) { const f = mockVF(it, q); if (f) q = f; else it = { ...it, vf: false }; }
return { ...it, q, pts: q.parts ? 2 * q.parts.length : it.vf ? 2 : it.part === "A" ? it.d : Math.min(it.d, 4) };
});
}




function mockDistinct(items) {
const seen = new Set(), scenes = new Set();
for (const it of items) if (it.rich && RICH[it.rich]) { try { R.seed(it.seed); const k = sceneKey(RICH[it.rich][it.kind === "raison" ? "raison" : "ex"][it.k]()); if (k) scenes.add(k); } catch (e) {  } }
const res = items.map((it) => {
if (it.rich || !it.id) return it;
for (let t = 0; t < 15; t++) {
let f = "", hors = false, sk = null; try { const q = Engine.make(state, it.id, it.d, it.seed); f = it.id + "|" + (q.ctx || qForm(q)); hors = !!(Engine.horsCO && Engine.horsCO(state, it.id, q)); sk = sceneKey(q); } catch (e) { return it; }
const vu = sk && (scenes.has(sk) || (t < 10 && sceneStale(state, sk)));
if (!seen.has(f) && ((!hors && !vu) || t === 14)) { seen.add(f); if (sk) scenes.add(sk); return it; }
it = { ...it, seed: mockSeed() };
}
return it;
});
scenes.forEach((k) => sceneNote(state, k));
return res;
}
function mockNew(level) {
level = level || (state.mock && state.mock.level) || "standard";
state.mock = { date: day(), ids: state.prep.ids.slice(), level, items: mockDistinct(mockPlan(state.prep.ids, level)), done: null };
save();
}
const ptsTxt = (p) => p + " pt" + (p > 1 ? "s" : "");

function screenMock() {
if (!Engine.prepActive(state)) return screenHome();
if (!state.mock || state.mock.ids.join() !== state.prep.ids.join()) mockNew();
const qs = mockQuestions(), total = qs.reduce((s, x) => s + x.pts, 0), minutes = state.mock.items.some((it) => it.rich) ? 45 : Math.max(15, Math.round((total * 1.5) / 5) * 5);
let num = 0;
const qHtml = (x, label) => `<div class="mock-q"><div class="spread"><b>${label}</b></div>
    <div>${x.q.q}</div>${x.q.fig ? `<div class="figwrap">${x.q.fig}</div>` : ""}
    ${x.q.parts ? `<ol type="a" class="mock-parts">${x.q.parts.map((p) => `<li>${p.label}<div class="mock-space"></div></li>`).join("")}</ol>` : '<div class="mock-space"></div>'}</div>`;
const A = qs.filter((x) => x.part === "A"), B = qs.filter((x) => x.part === "B"), C = qs.filter((x) => x.part === "C");
const exs = [...new Set(B.map((x) => x.ex))];
h(`<div class="mock-head">${brand}<div class="eyebrow">Sujet de préparation · environ ${minutes} min</div>
  <h2>Je m'entraîne pour mon évaluation</h2><p class="small muted">${state.prep.ids.map(nLabel).join(" · ")} · niveau ${MOCK_LV[state.mock.level || "standard"].label.toLowerCase()}</p></div>
  <div class="seg no-print" id="mlv">${Object.entries(MOCK_LV).map(([k, v]) => `<button type="button" data-lv="${k}" aria-pressed="${(state.mock.level || "standard") === k}">${v.label}</button>`).join("")}</div>
  <div class="card flat"><p class="small">Pour t'entraîner avant ton évaluation. <b>Rien n'est noté</b> : il n'y a pas de note, et personne d'autre que toi ne voit le résultat. Fais-le sur une feuille, sans regarder tes cours, puis corrige-toi avec le corrigé.</p></div>
  <section class="mock-part"><h3>A. Automatismes</h3>${A.map((x) => qHtml(x, "Question " + ++num)).join("")}</section>
  <section class="mock-part"><h3>B. Exercices</h3>${exs.map((e, k) => { const L = B.filter((x) => x.ex === e); num++; return `<div class="mock-ex"><h4>Exercice ${k + 1} · ${L[0].q.titre || nLabel(L[0].id)}</h4>${L.map((x, j) => qHtml(x, x.q.titre ? "" : String.fromCharCode(97 + j) + ")")).join("")}</div>`; }).join("")}</section>
  ${C.length ? `<section class="mock-part"><h3>C. Raisonnement</h3>${C.map((x) => qHtml(x, x.q.titre || (x.q.parts ? "Problème" : mockTitle(x)))).join("")}</section>` : ""}
  <div class="stack no-print">
    <button class="btn-primary btn-big" id="corr">J'ai fini : voir le corrigé</button>
    <div class="row"><button class="btn-primary" id="print">🖨 Imprimer / PDF</button><button class="btn-ghost" id="again">Un autre sujet</button><button class="btn-ghost" id="back">Retour</button></div>
  </div>`);
app.querySelectorAll("#mlv button").forEach((b) => (b.onclick = () => { if (b.dataset.lv !== (state.mock.level || "standard")) { mockNew(b.dataset.lv); screenMock(); } }));
document.getElementById("corr").onclick = screenMockCorr;
document.getElementById("print").onclick = () => window.print();
document.getElementById("again").onclick = () => { mockNew(); screenMock(); };
document.getElementById("back").onclick = () => { homeTab = "test"; screenHome(); };
}

function screenMockCorr() {
const qs = mockQuestions(), marks = qs.map(() => null);
const partName = { A: "A. Automatismes", B: "B. Exercices", C: "C. Raisonnement" };
h(`${brand}<div class="eyebrow">Sujet de préparation · corrigé</div><h2>Corrige-toi</h2>
  <p class="small muted">Compare avec ta feuille et coche honnêtement, question par question. Pour « Vrai ou faux », la justification compte : sans justification juste, coche « en partie ».</p>
  <div class="mock-list">${qs.map((x, i) => `${i === 0 || qs[i - 1].part !== x.part ? `<h3>${partName[x.part]}</h3>` : ""}<div class="mock-q card flat"><div class="spread"><b>${x.q.titre ? x.q.titre : x.part === "B" ? "Exercice · " + nLabel(x.id) : x.vf || x.part === "C" ? mockTitle(x) : x.q.parts ? "Problème" : "Question"}</b></div>
    <div class="small">${x.q.q}</div>
    <div class="rule"><b>Corrigé</b> · ${x.q.sol || ""}</div>
    <div class="seg mock-mark" data-i="${i}"><button type="button" data-v="1">✓ Juste</button><button type="button" data-v="0.5">½ En partie</button><button type="button" data-v="0">✗ Faux</button></div></div>`).join("")}</div>
  <p class="small muted" id="merr"></p>
  <button class="btn-primary btn-big" id="valid">Valider ma correction</button>
  <button class="btn-ghost" id="back">Revenir au sujet</button>`);
app.querySelectorAll(".mock-mark").forEach((g) => g.querySelectorAll("button").forEach((b) => (b.onclick = () => {
marks[+g.dataset.i] = +b.dataset.v; g.querySelectorAll("button").forEach((y) => y.setAttribute("aria-pressed", y === b));
})));
document.getElementById("back").onclick = screenMock;
document.getElementById("valid").onclick = () => {
const miss = marks.findIndex((m) => m === null);
if (miss >= 0) { document.getElementById("merr").textContent = "Il te reste " + marks.filter((m) => m === null).length + " question(s) à cocher."; app.querySelectorAll(".mock-mark")[miss].scrollIntoView({ behavior: "smooth", block: "center" }); return; }
qs.forEach((x, i) => Engine.recordComp(state, x.id, x.d, marks[i]));
const total = qs.reduce((s, x) => s + x.pts, 0), pts = qs.reduce((s, x, i) => s + x.pts * marks[i], 0);
const byId = {}; qs.forEach((x, i) => { (byId[x.id] = byId[x.id] || []).push(marks[i]); });
const ok = Object.keys(byId).filter((id) => byId[id].every((m) => m === 1)), weak = Object.keys(byId).filter((id) => byId[id].some((m) => m < 1));
const cnt = { juste: marks.filter((m) => m === 1).length, partie: marks.filter((m) => m === 0.5).length, faux: marks.filter((m) => m === 0).length };
state.mock.done = { date: day(), pts, total, ...cnt, n: marks.length };
if (typeof prepMark === "function") prepMark("mock");
Badges.check(state); save();
screenMockResult(cnt, marks.length, ok, weak);
};
}


function screenMockResult(cnt, n, ok, weak) {
h(`${brand}<div class="eyebrow">Sujet de préparation · bilan</div><h2>Où tu en es</h2>
  <div class="card stack"><p><b>${cnt.juste}</b> question${cnt.juste > 1 ? "s" : ""} juste${cnt.juste > 1 ? "s" : ""} sur ${n}${cnt.partie ? ` · <b>${cnt.partie}</b> en partie` : ""}${cnt.faux ? ` · <b>${cnt.faux}</b> à revoir` : ""}</p><p class="small muted">Ce n'est pas une note : c'est pour savoir quoi travailler d'ici ton évaluation.</p></div>
  ${ok.length ? `<div class="card flat"><h3>✓ Acquis</h3><ul>${ok.map((id) => `<li>${nLabel(id)}</li>`).join("")}</ul></div>` : ""}
  ${weak.length ? `<div class="card flat stack"><h3>À retravailler</h3><ul>${weak.map((id) => `<li>${nLabel(id)}</li>`).join("")}</ul>
    <button class="btn-primary" id="rev">Réviser ces notions maintenant</button></div>` : '<div class="card flat"><p>Tout est juste : bravo ! Une séance de révision par jour suffit jusqu\'à l\'évaluation.</p></div>'}
  <div class="row"><button class="btn-primary" id="again">Un autre sujet</button><button class="btn-ghost" id="home">Retour à l'accueil</button></div>`);
if (cnt.juste >= 0.8 * n) burst();
if (document.getElementById("rev")) document.getElementById("rev").onclick = () => {
session = { plan: weak.flatMap((id) => [id + "|2", id + "|3"]), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true };
nextQuestion();
};
document.getElementById("again").onclick = () => { mockNew(); screenMock(); };
document.getElementById("home").onclick = () => { homeTab = "test"; screenHome(); };
}








const AT_MAX = 8;


function qcmFmt(v, spec, text) {
const thou = (n) => { const s = String(Math.abs(n)); return (n < 0 ? "-" : "") + (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : s); };
const ratio = (x, maxD = 60) => { for (let d = 1; d <= maxD; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; };
const fr = ([n, d]) => (d === 1 ? thou(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}");

if (spec.sci && v !== 0) { const e = Math.floor(Math.log10(Math.abs(v)) + 1e-12), a = +(v / 10 ** e).toPrecision(10); return (Math.abs(v) >= 1 && Math.abs(v) < 10) ? String(+v.toPrecision(10)).replace(".", "{,}") : String(a).replace(".", "{,}") + " \\cdot 10^{" + e + "}"; }
if (Number.isInteger(v) || Math.abs(v - Math.round(v)) < 1e-9) return thou(Math.round(v));
if (spec.round) { const k = Math.max(0, Math.round(-Math.log10(spec.round))); return String((+v.toFixed(k))).replace(".", "{,}"); }
const wantFrac = /sous forme (de|d'une) fraction|fraction irréductible|en fraction|\(fraction/i.test(text || "");

if (!wantFrac && Math.abs(v - +v.toFixed(6)) < 1e-9) return String(+v.toFixed(6)).replace(".", "{,}");
const q = ratio(v, wantFrac ? 1000 : 60);
const term = q && ((d) => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; })(q[1]);
if (q && (wantFrac || !term)) return fr(q);
if (term) return String(+v.toFixed(6)).replace(".", "{,}");
const p = ratio(v / Math.PI, 12);
if (p) return (p[0] === 1 && p[1] === 1 ? "" : p[1] === 1 ? thou(p[0]) : fr(p)) + "\\pi";

const sqf = (n) => { for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false; return true; };
for (let b = 2; b <= 300; b++) {
if (!sqf(b)) continue;
const a = ratio(v / Math.sqrt(b), 24); if (!a || Math.abs(a[0]) > 200) continue;
const [n, d] = a, sg = n < 0 ? "-" : "", num = (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\sqrt{" + b + "}";
return sg + (d === 1 ? num : "\\frac{" + num + "}{" + d + "}");
}
return "\\approx " + String(+v.toFixed(2)).replace(".", "{,}");
}



function qcmLike(v, good, q) {
const f = qcmFmt(v, q.spec, q.q), plain = /^-?[\d']+(\{,\}\d+)?$/;

if (/^\\approx/.test(good)) return /^\\approx/.test(f) ? f : "\\approx " + String(+v.toFixed(2)).replace(".", "{,}");
if (plain.test(good) && !plain.test(f)) return String(Math.abs(v) >= 1 ? +v.toFixed(2) : +v.toPrecision(3)).replace(".", "{,}");
if (/\\frac/.test(good) && !/sqrt|pi/.test(good) && plain.test(f) && !Number.isInteger(v)) {
for (let d = 2; d <= 60; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; }
}
return f;
}



function qcmPlausible(v, g, spec) {
if (!isFinite(v)) return false;
if (g === 0) return Math.abs(v) <= 10 && v !== 0;
if (v === 0) return Math.abs(g) <= 3;
if (spec.sci) return Math.abs(Math.floor(Math.log10(Math.abs(v))) - Math.floor(Math.log10(Math.abs(g)))) <= 2;
const r = Math.abs(v / g);
return r >= 1 / 10.5 && r <= 10.5;
}


const qcmNegOk = (q, g) => g < 0 || /[-−]\s*[\d(]|[\d)]\s*[-−]/.test(String(q.q).replace(/<[^>]+>/g, ""));
function qcmNear(g, good, q) {
const neg = qcmNegOk(q, g), out = [];
const ratio = (x, maxD = 60) => { for (let d = 1; d <= maxD; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; };
const sq = /\\sqrt\{(\d+)\}/.exec(good);
if (/\\pi/.test(good)) { const k = g / Math.PI; [k + 1, k - 1, 2 * k, k / 2, k + 2].forEach((x) => out.push(x * Math.PI)); }
else if (sq) { const r = Math.sqrt(+sq[1]), a = g / r; [a + 1, a - 1, 2 * a, a + 2].forEach((x) => out.push(x * r)); }
else if (/\\cdot 10\^/.test(good)) { const e = Math.floor(Math.log10(Math.abs(g)) + 1e-12), m = g / 10 ** e; [m * 10 ** (e + 1), m * 10 ** (e - 1), (m + 1) * 10 ** e, m * 10 ** (e + 2)].forEach((x) => out.push(x)); }
else if (/\\frac/.test(good)) { const f = ratio(g); if (f) { const [n, d] = f; [[n + 1, d], [n - 1, d], [n, d + 1], [d, n], [n + d, d], [n, d - 1]].forEach(([x, y]) => y && out.push(x / y)); } }
else {
const dec = /\{,\}(\d+)/.exec(good), u = dec ? 10 ** -dec[1].length : Math.max(1, 10 ** (Math.floor(Math.log10(Math.abs(g) || 1)) - 1));
[g + u, g - u, g + 2 * u, g - 2 * u, g + 10 * u, g - 10 * u, g + 3 * u].forEach((x) => out.push(+x.toFixed(10)));
}
if (neg && g !== 0) out.push(-g);
return shuffle(out.filter((x) => isFinite(x) && (neg || x >= 0 || g < 0)));
}


function qcmMake(id, d) {
for (let t = 0; t < 30; t++) {
let q; try { q = Engine.build(id, d, 1 + Math.floor(Math.random() * 46655)); q = Engine.finalize(state, id, q); } catch (e) { continue; }
if (Engine.horsCO && Engine.horsCO(state, id, q)) continue;
if (!q || q.parts || !q.spec || q.spec.kind !== "value" || !isFinite(q.spec.value)) continue;
const g = q.spec.value, good = qcmFmt(g, q.spec, q.q), seen = new Set([good]), wrong = [];
const tol = Math.max(q.spec.round ? q.spec.round : 0, 1e-9 * Math.max(1, Math.abs(g)));
const negOk = qcmNegOk(q, g);
const take = (v, m) => { if (wrong.length >= 3 || !qcmPlausible(v, g, q.spec) || !qcmPlausible(+(+v).toFixed(2), g, q.spec)  || Math.abs(v - g) <= tol || (v < 0 && !negOk)) return; const f = qcmLike(v, good, q); if (seen.has(f) || /NaN|undefined|Infinity/.test(f) || (/approx/.test(f) && !/approx/.test(good))) return; seen.add(f); wrong.push({ f, m }); };
for (const tr of q.traps || []) take(tr.v, tr.m);
if (!wrong.length) continue;
for (const v of qcmNear(g, good, q)) take(v, "");
if (wrong.length < 3) continue;
const choices = shuffle([{ f: good, ok: true }, ...wrong]);
return { id, d, q, choices };
}
return null;
}






function atTypedOk(id, lv) {
for (let t = 0; t < 6; t++) { try { const q = Engine.build(id, lv, 1 + Math.floor(Math.random() * 46655)); if (q && q.spec && !q.parts) return true; } catch (e) {} }
return false;
}
function atRows(ids) {
const per = ids.map((id) => compsOf(id).map((c) => ({ cid: c.cid, id, lv: c.i + 1, label: c.label })));
const out = [], has = (c) => out.some((o) => o.cid === c.cid), max = Math.max(AT_MAX, ids.length);
const add = (c) => {
if (!c || has(c) || out.length >= max) return false;
if (qcmMake(c.id, c.lv)) { out.push({ ...c, mode: "qcm" }); return true; }
if (atTypedOk(c.id, c.lv)) { out.push({ ...c, mode: "tape" }); return true; }
return false;
};

per.forEach((L) => { for (const c of L.slice().sort((x, y) => x.lv - y.lv)) if (add(c)) break; });

per.forEach((L) => { const top = L.slice().sort((x, y) => y.lv - x.lv).find((c) => c.lv >= 2 && !has(c)); if (top) add(top); });

per.forEach((L) => L.forEach(add));
return out.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id) || a.lv - b.lv);
}
function atState() {
const key = state.prep.ids.join();
if (!state.autotest || state.autotest.key !== key) state.autotest = { key, rows: atRows(state.prep.ids), avant: {}, runs: [] };

if (!Array.isArray(state.autotest.rows)) state.autotest.rows = atRows(state.prep.ids);
return state.autotest;
}
const AT_SYM = { 2: "✓", 1: "~", 0: "✗" };
const atCell = (v) => (v === undefined || v === null ? '<span class="muted">·</span>' : `<span class="at-s at-${v}">${AT_SYM[v]}</span>`);

function screenQcm() {
if (!Engine.prepActive(state)) return screenHome();
const A = atState();
if (A.rows.length < 2) {
h(`${brand}<div class="eyebrow">Autoévaluation</div><h2>Pas de test rapide pour ces notions</h2>
    <p class="muted">Les notions de ton évaluation se prêtent mal aux questions à choix. Fais plutôt le sujet de préparation ou une révision ciblée.</p>
    <button class="btn-primary btn-big" id="back">Retour</button>`);
document.getElementById("back").onclick = () => { homeTab = "test"; screenHome(); };
return;
}
if (A.runs.length) return atGrid();
const all = () => A.rows.every((r) => A.avant[r.cid] !== undefined);
h(`${brand}<div class="eyebrow">Je prépare mon évaluation · étape 1 sur 2</div><h2>Autoévaluation</h2>
  <p class="small muted">Pour chaque ligne, sois honnête : ✓ je sais faire, ~ à peu près, ✗ pas encore. Ensuite, un test rapide (une question par ligne) te dira si tu avais raison.</p>
  <div class="card flat at-grid"><div class="at-row at-head"><span class="at-l">Je sais…</span><span class="at-c" style="width:auto">✓ oui · ~ à peu près · ✗ pas encore</span></div>${A.rows.map((r) => `<div class="at-row"><span class="at-l">${r.label}</span>
    <div class="seg at-seg" data-cid="${r.cid}">${[2, 1, 0].map((v) => `<button type="button" data-v="${v}" aria-pressed="${A.avant[r.cid] === v}" aria-label="${["pas encore", "à peu près", "je sais faire"][v]}">${AT_SYM[v]}</button>`).join("")}</div></div>`).join("")}</div>
  <p class="small muted" id="aterr"></p>
  <button class="btn-primary btn-big" id="atgo">Commencer le test rapide (${A.rows.length} questions)</button>
  <button class="btn-ghost" id="back">Retour</button>`);
app.querySelectorAll(".at-seg").forEach((g) => g.querySelectorAll("button").forEach((b) => (b.onclick = () => {
A.avant[g.dataset.cid] = +b.dataset.v; save(); g.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
})));
document.getElementById("back").onclick = () => { homeTab = "test"; screenHome(); };
document.getElementById("atgo").onclick = () => {
if (!all()) { const n = A.rows.filter((r) => A.avant[r.cid] === undefined).length; document.getElementById("aterr").textContent = "Il te reste " + n + " ligne" + (n > 1 ? "s" : "") + " à cocher."; return; }
atTest();
};
}


function atTest() {
const A = atState(), items = A.rows.map((r) => ({ row: r, it: r.mode === "tape" ? null : qcmMake(r.id, r.lv) })), res = {};
const head = (i, lab = "") => `${A.runs.length ? "Test rapide · après" : "Je prépare mon évaluation · étape 2 sur 2"} · ${i + 1} sur ${items.length}${lab ? " · " + esc(lab) : ""}<span class="pbar" aria-hidden="true"><i style="width:${Math.round((i / items.length) * 100)}%"></i></span>`;
const show = (i) => {
if (i >= items.length) { A.runs.push({ date: day(), r: res }); A.runs = A.runs.slice(-6); if (typeof prepMark === "function") { prepMark("autoeval"); prepMark("apres"); } Badges.check(state); save(); return atGrid(true); }

if (!items[i].it) {
const row = items[i].row; let q = null;
for (let t = 0; t < 8 && !(q && q.spec && !q.parts); t++) { try { q = Engine.make(state, row.id, row.lv); } catch (e) { q = null; } }
if (!q) { i++; return show(i); }
return renderQuestion(q, { eyebrow: head(i, row.label), single: true, track: "autotest",
onDone: (r) => { res[row.cid] = r.solved ? 1 : 0; Engine.recordComp(state, row.id, q.d, res[row.cid]); save(); },
onNext: () => show(i + 1) });
}
const { row, it } = items[i], q = it.q, pct = Math.round((i / items.length) * 100);
h(`${brand}<div class="eyebrow">${A.runs.length ? "Test rapide · après" : "Je prépare mon évaluation · étape 2 sur 2"} · ${i + 1} sur ${items.length}<span class="pbar" aria-hidden="true"><i style="width:${pct}%"></i></span></div>
    <div class="card pop"><div class="qmeta"><span class="chip">${row.label}</span></div>
    <div class="qtext">${boldData(q.q)}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    ${scratchHtml()}
    <p class="small muted">Une seule réponse est juste. Calcule d'abord, puis choisis.</p>
    <div class="qcm-choices">${it.choices.map((c, k) => `<button type="button" class="qcm-c" data-k="${k}"><span class="qcm-l">${"ABCD"[k]}</span><span>\\(${c.f}\\)</span></button>`).join("")}</div>
    <div id="fb" aria-live="polite"></div></div>`);
const S = typeof sigOpen === "function" ? sigOpen({ ev: "q", code: q.code, d: it.d, kind: "qcm", fmt: "autotest" }) : null;
bindScratch(S);
app.querySelectorAll(".qcm-c").forEach((b) => (b.onclick = () => {
const c = it.choices[+b.dataset.k];
app.querySelectorAll(".qcm-c").forEach((x) => { x.disabled = true; if (it.choices[+x.dataset.k].ok) x.classList.add("qcm-good"); });
if (!c.ok) b.classList.add("qcm-bad");
res[row.cid] = c.ok ? 1 : 0;
if (S) { S.issue = c.ok ? "ok1" : "faux"; S.essais = 1; S.sec = sigSec(S); if (!c.ok) S.rep1 = c.f.slice(0, 20); }
Engine.recordComp(state, row.id, it.d, res[row.cid]); save();
if (typeof buzz === "function") buzz(c.ok);
if (c.ok) burst();
const fb = document.getElementById("fb");
fb.innerHTML = `<div class="fb ${c.ok ? "ok" : "bad"} pop"><b>${c.ok ? "✓ Juste !" : "✗ Ce n'est pas ça."}</b>${c.ok ? "" : `<div class="diag">🔎 ${escT(c.m || "Refais le calcul étape par étape : la correction ci-dessous montre la méthode.")}</div>`}
        <details class="solfull"${c.ok ? "" : " open"}><summary>La correction</summary><div class="sol">${q.sol}</div></details></div>
        <div class="actions"><button class="btn-primary" id="nx">${i + 1 < items.length ? "Question suivante" : "Voir ma grille"}</button></div>`;
typeset(fb);
document.getElementById("nx").onclick = () => show(i + 1);
document.getElementById("nx").focus();
}));
};
show(0);
}


function atGrid(fresh) {
const A = atState(), first = A.runs[0], last = A.runs.length > 1 ? A.runs[A.runs.length - 1] : null, cur = (last || first).r;
const msg = (r) => {
const av = A.avant[r.cid], v = cur[r.cid];
if (v === undefined) return "";
if (v === 0 && av === 2) return '<span class="at-m warn">⚠️ Tu pensais savoir : à revoir en priorité</span>';
if (v === 0) return '<span class="at-m">À travailler</span>';
if (last && first.r[r.cid] === 0) return '<span class="at-m good">📈 Réussi cette fois</span>';
if (av === 0) return '<span class="at-m good">👍 Tu sais mieux que tu ne le crois</span>';
return "";
};
const weak = A.rows.filter((r) => cur[r.cid] === 0), ok = A.rows.filter((r) => cur[r.cid] === 1).length, n = A.rows.filter((r) => cur[r.cid] !== undefined).length;
const surprise = A.rows.filter((r) => cur[r.cid] === 0 && A.avant[r.cid] === 2).length;
h(`${brand}<div class="eyebrow">Autoévaluation · ${last ? "avant / après" : "ta grille"}</div><h2>${fresh ? (ok === n ? "Tout juste !" : ok >= n / 2 ? "Ta grille est remplie" : "Tu sais maintenant quoi réviser") : "Ta grille"}</h2>
  <div class="card flat at-grid at-res"><div class="at-row at-head"><span class="at-l">Je sais…</span><span class="at-c">Avant</span><span class="at-c">${last ? "1er test" : "Test"}</span>${last ? '<span class="at-c">Après</span>' : ""}</div>
  ${A.rows.map((r) => `<div class="at-row"><span class="at-l">${r.label}${msg(r)}</span><span class="at-c">${atCell(A.avant[r.cid])}</span><span class="at-c">${atCell(first.r[r.cid] === 1 ? 2 : first.r[r.cid] === 0 ? 0 : undefined)}</span>${last ? `<span class="at-c">${atCell(last.r[r.cid] === 1 ? 2 : last.r[r.cid] === 0 ? 0 : undefined)}</span>` : ""}</div>`).join("")}</div>
  <div class="card stack"><p><b>${ok}</b> juste${ok > 1 ? "s" : ""} sur ${n}${surprise ? ` · <b>${surprise}</b> surprise${surprise > 1 ? "s" : ""} (tu pensais savoir)` : ""}</p>
  <p class="small muted">Ce n'est pas une note. ${last ? "Compare tes colonnes : c'est ton progrès depuis le " + first.date.slice(8, 10) + "." + first.date.slice(5, 7) + "." : (typeof prepLeft === "function" && Engine.prepActive(state) && prepLeft(state.prep.date) <= 1 ? "Ton évaluation est toute proche : relis d'abord les compétences à revoir." : "Refais le test rapide dans quelques jours, juste avant l'évaluation : ta colonne « Après » se remplira.")}</p></div>
  ${weak.length ? `<div class="card flat stack"><h3>À revoir${surprise ? " (en priorité les ⚠️)" : ""}</h3>${[...new Set(weak.map((r) => r.id))].map((id) => `<div class="spread"><span class="small">${nLabel(id)}</span>${LESSONS[id] ? `<button type="button" class="btn-ghost small atles" data-id="${id}">📖 Leçon</button>` : ""}</div>`).join("")}
    <button class="btn-primary" id="rev">Réviser ces compétences maintenant</button></div>` : ""}
  <div class="row"><button class="btn-primary" id="again">Refaire le test rapide</button><button class="btn-ghost" id="home">Retour</button></div>
  <button class="btn-ghost small" id="reset">Recommencer l'autoévaluation (nouvelle colonne Avant)</button>`);
if (fresh && ok === n) burst();
app.querySelectorAll(".atles").forEach((b) => (b.onclick = () => screenLesson(b.dataset.id, () => atGrid(), true)));
const rv = document.getElementById("rev");
if (rv) rv.onclick = () => {
const pri = weak.filter((r) => A.avant[r.cid] === 2).concat(weak.filter((r) => A.avant[r.cid] !== 2));
session = { plan: pri.flatMap((r) => [r.id + "|" + r.lv, r.id + "|" + r.lv]), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true };
nextQuestion();
};
document.getElementById("again").onclick = atTest;
document.getElementById("home").onclick = () => { homeTab = "test"; screenHome(); };
document.getElementById("reset").onclick = () => { state.autotest = null; save(); screenQcm(); };
}


const FREE_READY = ["utemps", "ucomp", "vitesse", "gquot", "litelab", "valnum", "reduire", "monomes", "parenth", "distrib", "idrem", "factor",
"eq1", "eqfrac", "eqspec", "formule", "probeq", "eq2fact", "eq2", "eq2disc", "probeq2", "eq3", "bicarre", "eqirr", "sys2", "sysprob", "sysgraph", "sys3", "affine", "affzero", "sysineq",
"prio", "fracadd", "fracmul", "fracconv", "puiss", "sci", "scicalc", "pyth", "pythfig", "pythrec", "vol", "volcone", "airepyr", "volcomp", "volmanq", "angles", "cercthales", "thales", "thalesrec", "simil", "repere", "tabval"];



const HINTS = {
prio: "D'abord les parenthèses, puis les puissances, puis × et :, enfin + et −.",
rel: "Moins par moins donne plus. Et attention : −3² = −9, alors que (−3)² = 9.",
fracadd: "Mets les fractions au même dénominateur avant d'additionner les numérateurs.",
fracmul: "Multiplie les numérateurs entre eux et les dénominateurs entre eux. Diviser, c'est multiplier par l'inverse.",
pct: "p % de N, c'est p/100 × N. Une hausse de p % multiplie par (1 + p/100).",
puiss: "aᵐ · aⁿ = aᵐ⁺ⁿ et (aᵐ)ⁿ = aᵐⁿ. Une puissance négative est un inverse.",
sci: "Notation scientifique : a · 10ⁿ avec 1 ≤ a < 10. Compte de combien de rangs la virgule se déplace.",
rac: "Cherche le plus grand carré qui divise le nombre : √72 = √(36 · 2) = 6√2.",
valnum: "Remplace la lettre par le nombre entre parenthèses, puis respecte les priorités.",
reduire: "Regroupe les termes de même nature : les x², les x, les nombres.",
distrib: "Chaque terme de la première parenthèse multiplie chaque terme de la seconde.",
idrem: "(a + b)² = a² + 2ab + b² : n'oublie pas le double produit 2ab.",
factor: "Cherche d'abord un facteur commun, puis une identité remarquable.",
eq1: "Fais la même opération des deux côtés pour isoler x.",
eq2: "Un produit est nul si l'un de ses facteurs est nul : résous chaque facteur = 0.",
prop: "Calcule d'abord pour 1 (passage à l'unité), puis multiplie.",
vitesse: "v = d / t. Attention aux unités : 1 h = 60 min, et 1 m/s = 3,6 km/h.",
echelle: "Longueurs × k, aires × k², volumes × k³.",
aires: "Triangle : b·h/2 ; trapèze : (B + b)·h/2 ; disque : π·r².",
pyth: "Hypoténuse² = somme des carrés des deux autres côtés.",
vol: "Prisme : base × hauteur ; pyramide et cône : base × hauteur / 3.",
thales: "Écris les trois rapports égaux AD/AB = AE/AC = DE/BC, puis utilise les deux utiles.",
affine: "f(x) = ax + b : a est la pente, b l'ordonnée à l'origine.",
eq3: "Mets x en évidence, puis factorise ce qui reste.",
eq2disc: "Δ = b² − 4ac ; si Δ > 0, x = (−b ± √Δ) / 2a ; si Δ < 0, aucune solution.",
sys2: "Additionne ou soustrais les équations pour éliminer une inconnue, ou isole-la et remplace.",
fimg: "Image : remplace x par le nombre. Préimage : résous f(x) = valeur.",
f2: "Sommet : x = −b / 2a, puis calcule f en ce point. Zéros : f(x) = 0.",
inter: "Les graphes se coupent là où f(x) = g(x) : mets tout d'un côté et résous.",
angles: "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc.",
euclide: "Hauteur : h² = p · q. Euclide : cathète² = projection · hypoténuse.",
trigo: "SOH CAH TOA : sin = opposé/hypoténuse, cos = adjacent/hypoténuse, tan = opposé/adjacent.",
cart: "Distance : √((xB − xA)² + (yB − yA)²). Milieu : moyenne des coordonnées. Pente : Δy / Δx.",
recip: "(f ∘ g)(x) = f(g(x)) : calcule d'abord g. Réciproque : résous y = f(x) pour x.",
sinlaw: "Sinus : a / sin α = b / sin β. Cosinus : c² = a² + b² − 2ab·cos γ.",
expo: "Écris les deux membres comme puissances de la même base, puis égale les exposants.",
log: "log_b(x) = y signifie b^y = x. Pour résoudre b^x = c : x = ln c / ln b.",
absval: "|A| = b (b ≥ 0) donne A = b ou A = −b. Une valeur absolue n'est jamais négative.",
ineq: "Comme une équation, mais on retourne le signe en multipliant ou divisant par un négatif.",
trigcercle: "180° = π rad. Sur le cercle trigonométrique, le point a pour coordonnées (cos α ; sin α).",
trigeq: "Sur [0° ; 360°[ : sin x = s donne x et 180° − x ; cos x = c donne x et 360° − x.",
stats: "Moyenne : somme / effectif. Médiane : valeur du milieu de la série triée. Écart-type : √(moyenne des carrés des écarts).",
};
if (typeof HINTS_EXTRA !== "undefined") Object.assign(HINTS, HINTS_EXTRA);


const STATE_V = 2;
const Store = {
key: "5m2m.v1",
load() { try { return JSON.parse(localStorage.getItem(this.key)) || null; } catch (e) { return null; } },
save(s) { try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {} },
clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

const day = (d = new Date()) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return day(d); };
const INTERVALS = [0, 1, 3, 7, 14, 30];

const FR_DOMAINS = { NC: "Nombres et calculs", OGD: "Organisation et gestion de données, fonctions", GM: "Grandeurs et mesures", EG: "Espace et géométrie", AP: "Algorithmique et programmation" };
function frDomain(id) {
const n = NOTIONS.find((x) => x.id === id) || {}, L = n.label || "";
if (/algorithm|programm/i.test(L)) return "AP";
if (/diagramme|moyenne|médiane|statist|probab|proportion|pourcentage|fonction|graphique|tableau|échelle|vitesse|débit|grandeurs quotients/i.test(L)) return "OGD";
return { no: "NC", fa: "NC", gm: "GM", es: "EG" }[n.theme] || "NC";
}
const TARGET = { drill: -300, app: -100, defi: 80, defi4: 80, rev: -150 };





const ADAPT = { win: 16, min: 8, low: 0.55, aim: 0.7, high: 0.85, down: 20, up: 10, lo: -300, hi: 120, floor: -150 };


const PREV_PEN = 2;
const KIND_LABEL = { drill: "⚡ Automatisme", app: "🧩 Application", defi: "🏔 Défi", rev: "🧠 Révision", rem: "🧱 Une base à consolider" };

const PREREQ = { eq1: ["rel", "valnum"], eq2: ["factor", "eq1"], eq2disc: ["eq2fact", "rel"], eq2fact: ["factor"], fracadd: ["fracsimp", "arith"], fracmul: ["fracsimp"],
fracops: ["fracadd", "fracmul", "rel"], pyth: ["carres", "rac"], pythfig: ["pyth"], pythrec: ["pyth"], thales: ["prop"], affine: ["valnum", "rel"], factor: ["distrib"],
idrem: ["distrib"], sys2: ["eq1"], trigo: ["prop"], pct: ["prop"], pctvar: ["pct"], ineq: ["eq1"], domaine: ["eq1"], f2: ["eq2"], probeq: ["eq1"], eqfrac: ["fracadd", "eq1"],
reduire: ["rel"], distrib: ["rel"], sci: ["puiss"], scicalc: ["sci"], monomes: ["puiss"], racenc: ["rac"], valnum: ["prio", "rel"], rel: ["prio"], fracsimp: ["arith"],
sysineq: ["ineq"], ineqfrac: ["ineq"], eqirr: ["eq2disc"], absval: ["eq1"], trinfact: ["eq2disc"], vol: ["aire2"], echelle: ["prop"],

tauxvar: ["fimg"], nbderive: ["tauxvar"], derivref: ["puiss"], derivregles: ["derivref"], derivprodquot: ["derivregles"], derivcomp: ["derivregles", "compo"],
tangente: ["nbderive", "droites"], variations: ["derivregles", "ineq2"], optimderiv: ["variations"],

ineqpoly: ["polyfact", "ineqfrac"],

vect3d: ["vecteurs"], colin: ["vect3d"], droite3d: ["vect3d"], plans: ["droite3d"], posrel: ["plans"], pscal3d: ["vect3d"], distances: ["pscal3d", "plans"], sphere: ["plans", "pscal3d"],

limites: ["fracrat", "factor"], limitinf: ["limites"], asymptotes: ["limitinf", "fracrat"], continuite: ["limites", "morceaux"],
derivseconde: ["derivregles"], etudefct: ["variations", "asymptotes"], combi: ["denombr"], probaxiomes: ["proba"], probarbre: ["probaxiomes"],

primitives: ["derivregles"], integrale: ["primitives"], aireint: ["integrale"], volrev: ["integrale"], lnexp: ["log", "derivcomp"], croissance: ["expo", "log"],
condbayes: ["proba"], varalea: ["proba"], binomiale: ["varalea"],

derivth: ["continuite", "nbderive"], pvect: ["pscal3d"], syslin: ["matrices"], bases: ["matrices", "vect3d"], bayes: ["condbayes"],

geoesp: ["pythfig", "trigo"], densite: ["integrale", "varalea"], approxnorm: ["binomiale", "normale"], graphefct: ["fimg"], ineqgraph: ["ineqpoly", "inter"],

isom: ["symetries"], ensco: ["relrep", "fracconv"], numer: ["decread"], fctlec: ["repere", "proptab"], litconv: ["valnum", "distrib"],
repere3d: ["pythfig", "vol"], cercle6: ["disque"], bissec6: ["angtri"], filtre6: ["diagr"], tabform5: ["valnum"], hauteurs5: ["aire1"],
cplxalg: ["eq2disc"], cplxtrig: ["cplxalg", "trigexact"], cplxeq: ["cplxtrig", "eq2disc"], suitegeom: ["expo", "log"], serie: ["suitegeom", "limitinf"],
intparties: ["integrale", "derivprodquot"], intsubst: ["integrale", "derivcomp"], etudelnexp: ["lnexp", "variations"], eqdiff: ["croissance", "primitives"],

tradalg: ["tradexpr", "valnum"], contrex: ["divcrit", "premiers"], demoalg: ["tradalg", "distrib"], implication: ["contrex", "divcrit"], ratden: ["rac", "idrem"], racprop: ["rac"], fracper: ["fracops"],

eqabs: ["eq1"], eqbic: ["eq2disc"], eqirrmp: ["eq2disc"], eqratmp: ["fracrat", "eq2disc"], puisrat: ["puiss", "rac"], logdef: ["puiss"], logprop: ["logdef"],
eqexp: ["logdef"], eqlog: ["logprop"], croissexp: ["eqexp"], volmp: ["pyth"], similmp: ["volmp"],
coordmp: ["pyth"], vectmp: ["coordmp"], scalmp: ["vectmp"], droiteparam: ["vectmp"], ineqmp: ["eq1", "eq2disc"], fctmp: ["fimg"], polymp: ["factor", "eq2disc"],
sinusmp: ["trigfn"], explogfn: ["eqexp", "logdef"],

projmp: ["scalmp"], pvectmp: ["scalmp"], posdroites: ["droiteparam"], fratmp: ["fracrat", "ineqmp"], matrices: ["sys2"], translin: ["matrices"], appllin: ["translin"], normale: ["varalea", "statdesc"], statdesc: ["varalea"], stats: ["diagr"], quartiles: ["diagr"] };

const UPC = ["droitesinter",  "arith", "rel", "fracops", "puiss", "sci", "racprop", "tabval", "eq1", "eqfrac", "formule", "probeq", "affine", "ineq", "sysprob",
"reduire", "monomes", "parenth", "distrib", "idrem", "factor", "eq2", "simil", "thales", "pyth", "pythfig", "pythrec", "geocomb", "angles", "angtri", "cercthales"];
const UPC_MIN = { fracper: 3 };




const HORS_MA1 = { asymptotes: [/oblique/i], etudefct: [/oblique/i] };



const HORS_MP = { droitesrem: ["inscrit", "orthocentre"] };
const HORS_CO = {


9: {
prio: ["rel", "puiss", "carre", "frac"],
valnum: ["frac", /=\s*-/],
fracadd: ["negatif", "parmoins", "rel3", (q) => !!(q.spec && q.spec.kind === "value" && q.spec.value < 0)],
angtri: ["polygone", "nb-cotes", /polygone régulier/],
litelab: ["perim", "magie", "age", "taxi"],
fracconv: ["per2", "permixte"],
fracper: [/seul le \d se répète|\{,\}(\d)(?!\1)(\d)\1\2/],
quadri: [/axes? de symétrie/],

pct: [(q) => /^succ-/.test(String(q.ctx || ""))],
},


10: {
distrib: ["double", "double2", "degre3", "difference", /on retire un carré/],
reduire: ["fractions-binomes"],
eq1: ["identites", "carres-elimines", "lit-a", "lit-b", "lit-c", "lit-d", "lit-e"],
affine: ["f-sup-g-droites"],
pythfig: ["conehaut", "conegen"],
echelle: [/\baires?\b|volume|cube|m³|dm³/],
vitesse: [/aller de|aller-retour|, puis [^.]*km\/h/],
},
};






const HORS_FR_TXT = [
[/équation (?:cartésienne )?(?:du|d'un|de ce) cercle|cercle (?:circonscrit )?d'équation|\\left\(x\s*[-+][^)]*\\right\)\^\{?2\}?\s*\+\s*\\left\(y|\(x\s*[-+−][^()]*\)\^\{?2\}?\s*\+\s*\(y\s*[-+−]|\(x\s*[-+−][^()]*\)²\s*\+\s*\(y|x\^\{?2\}?\s*\+\s*y\^\{?2\}?|x²\s*\+\s*y²/, 11, "équation de cercle"],
[/perpendiculaire[^.?!;]{0,160}(?:pente|coefficient directeur|y\s*=|équation)|(?:pente|coefficient directeur|y\s*=|équation)[^.?!;]{0,160}perpendiculaire|produit des pentes/, 11, "orthogonalité de droites (repère)"],
[/produit scalaire|vecteur normal|orthogona/, 11, "produit scalaire, orthogonalité"],

[/différence de (?:deux )?carrés|a\^\{?2\}?\s*-\s*b\^\{?2\}?|a²\s*[−-]\s*b²/, 9, "différence de deux carrés"],

[/[Qq]uartile|\bQ_?\{?[13]\}?(?!\d)|[Mm]oustache/, 10, "quartiles"],
[/(?:médiatrice|hauteur issue)[^.?!;]{0,120}(?:équation|y\s*=)|(?:équation|y\s*=)[^.?!;]{0,120}(?:médiatrice|hauteur issue)/, 11, "médiatrice, hauteur en repère"],
];
const qTextAll = (q) => [q.q, q.sol, ...(q.parts || []).map((x) => x.label), ...(q.guide || []).flatMap((g) => [g.ask, g.sol])].map((t) => String(t || "")).join(" ");

function horsFRTexte(grade, t) { for (const [r, g, lab] of HORS_FR_TXT) if (grade < g && r.test(t)) return lab; return null; }




const SCENES = [
[/parc[^.?!]{0,90}diagonale|diagonale[^.?!]{0,90}parc|coin au coin opposé|coupe en diagonale/i, "parc-diagonale"],
[/table ronde/i, "table-ronde"], [/pizza[^.?!]{0,60}(?:diamètre|ronde|rayon)|(?:diamètre|rayon)[^.?!]{0,60}pizza/i, "pizza"], [/tapis rond/i, "tapis-rond"],
[/échelle[^.?!]{0,90}(?:mur|façade)|(?:mur|façade)[^.?!]{0,90}échelle/i, "echelle-mur"],
[/carrel/i, "carrelage"], [/enclos/i, "enclos"], [/cerf-volant/i, "cerf-volant"],


[/robinet/i, "robinet"], [/viennent (?:à|en) vélo/i, "velo-eleves"],
];
function sceneKey(q) { const t = q ? String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ") : ""; for (const [r, k] of SCENES) if (r.test(t)) return k; return null; }

function sceneStale(state, k) { const c = state && state.ctxDay; return !!(k && c && c["s:" + k] && c["s:" + k] >= addDays(day(), -6)); }
function sceneNote(state, k) { if (k && state) (state.ctxDay = state.ctxDay || {})["s:" + k] = day(); }
function horsCO(state, id, q) {
const p = state && state.profile;

if (q && (q.co || q.mp) && p && !(p.system === "CH" && (p.track === "mp" ? (q.mp || []) : (q.co || [])).includes(p.grade))) return true;


if (q && p && p.system === "FR") { const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ") + " " + (q.guide || []).map((g) => g.ask || "").join(" "); if (/\bEUR\b|Suisse|suisse|CHF[\s\S]*(€|\beuros?\b)|(€|\beuros?\b)[\s\S]*CHF/.test(t)) return true; }



if (q && q.fr && p && !(p.system === "FR" && q.fr.includes(p.grade))) return true;
if (q && p && p.system === "FR" && p.grade && horsFRTexte(p.grade, qTextAll(q))) return true;
if (q && p && p.system === "FR" && typeof HORS_FR !== "undefined" && HORS_FR[id]) {
const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
if (HORS_FR[id].some(([r, g]) => p.grade < g && (typeof r === "string" ? q.ctx === r || (r.endsWith("*") && String(q.ctx || "").startsWith(r.slice(0, -1))) : r instanceof RegExp ? r.test(t) : r(q)))) return true;
}
if (q && p && p.system === "CH" && p.track === "mp" && HORS_MP[id] && HORS_MP[id].includes(q.ctx)) return true;
if (!q || !p || p.system !== "CH" || p.track === "mp") return false;


if (p.grade >= 14 && p.niv !== "R" && HORS_MA1[id]) { const t = String(q.ctx || "") + " " + String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" "); if (HORS_MA1[id].some((r) => r.test(t))) return true; }
const L = HORS_CO[p.grade] && HORS_CO[p.grade][id];
if (!L) return false;
const txt = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
return L.some((r) => (typeof r === "string" ? q.ctx === r : r instanceof RegExp ? r.test(txt) : r(q)));
}


function racineCO(q) {
const un = (sp) => { if (sp && sp.radical) delete sp.radical; };
un(q.spec); (q.guide || []).forEach((g) => { un(g.spec); if (g.ask) g.ask = g.ask.replace(" : simplifie", ""); }); (q.parts || []).forEach((x) => un(x.spec));
if (q.q) q.q = q.q.replace(/écris par exemple \\\(3\\sqrt\{5\}\\\)/g, "écris par exemple \\(\\sqrt{13}\\)");
return q;
}













const CALC_THEME = { no: false, gm: true, es: true, fa: true };
const CALC_NON = [
"ulong", "uaire", "uvol", "utemps", "ucomp",
"trigcercle", "trigassoc", "trigrel",
"valnum", "eq1", "eqfrac", "probeq", "eqverif", "eqspec", "structexpr", "fimg", "progcalc", "log", "logbase", "expo",
];
const CALC_OUI = [
"diagr", "pct", "denombr", "stats", "statfreq", "quartiles", "statdesc", "combi", "probaxiomes", "probarbre", "condbayes",
"varalea", "binomiale", "normale", "proba2", "tauxevol", "probcond", "probtot", "vaesp", "binom", "bayes",
];

const CALC_LIBRE = ["sci", "scicalc"];
const CALC_SANS = /sans calculatrice|mentalement|de tête|calcul mental/i, CALC_AVEC = /à la calculatrice|avec (la|une|ta) calculatrice|valeur exacte avec ln/i;
const CALC_POW = /forme d'une (seule )?puissance|comme une (seule )?puissance|puissance de 10/i;

function calcNotion(id) {
if (CALC_LIBRE.includes(id)) return null;
if (CALC_NON.includes(id)) return false;
if (CALC_OUI.includes(id)) return true;
const n = typeof NOTIONS !== "undefined" && NOTIONS.find((x) => x.id === id);
return n && n.theme in CALC_THEME ? CALC_THEME[n.theme] : true;
}

function calcPermis(id, txt, spec, own) {
if (own === "oui" || own === "non") return own === "oui";
if (CALC_SANS.test(txt)) return false;
if (CALC_AVEC.test(txt) || (spec && spec.round)) return true;
return calcNotion(id);
}

const polyLike = (n) => {
if (!n) return true;
if (n.t === "par" || n.t === "neg") return polyLike(n.a);
if (n.t === "num" || n.t === "var") return true;
if (["add", "sub", "mul"].includes(n.t)) return polyLike(n.a) && polyLike(n.b);
if (n.t === "div") return polyLike(n.a) && Expr.vars(n.b).size === 0 && !/const|fn/.test(JSON.stringify(n.b));
if (n.t === "pow") { const e = Expr.unpar(n.b); return polyLike(n.a) && e.t === "num" && Number.isInteger(e.v) && e.v >= 0; }
return false;
};
const exprForm = (sp, txt) => {
if (!sp || sp.kind !== "expr" || sp.form || typeof Expr === "undefined") return;
const f = /factoris/i.test(txt), d = /développ|réduis|réduire|réduite|simplifi|supprime les parenthèses|^\s*calcule/i.test(txt);
if (f === d) return;
let t; try { t = Expr.parse(sp.expr); } catch (e) { return; }
if (f && Expr.isProduct(t)) sp.form = "product";
else if (d && polyLike(t)) sp.form = "reduced";
};


const DRILL_OK = {};

const NO_DRILL = ["probeq", "probeq2", "sysprob", "probrat", "decprob"];
const FORMATS = {
defi: { label: "🏔 Défi du jour", slots: ["defi4"], text: "Un seul problème, prends ton temps." },

auto: { label: "⚡ Série d'automatismes", slots: ["drill", "drill", "drill", "drill", "drill", "drill"], text: "6 calculs rapides, enchaînés." },
app: { label: "🧩 Applications", slots: ["app", "app", "app"], text: "Trois questions de fond." },
mixte: { label: "⚖️ Mixte", slots: ["drill", "app", "defi"], text: "Automatisme, application, défi." },
revision: { label: "🧠 Révision", slots: ["rev", "rev", "rev", "rev"], text: "Tes notions à revoir aujourd'hui." },
};
const WEEK = { defi: 2, auto: 2, app: 1, mixte: 1, revision: 1 };



const harmos = (system, grade) => (system === "FR" ? grade + 2 : grade);

function itemRating(profile, id, d) {
const n = NOTIONS.find((x) => x.id === id);


const pl = placeOf(n, profile) || n.CH || n.MP || n.FR, base = profile.system === "CH" && n.CH ? Math.min(n.CH[0], pl[0]) : pl[0];
const g = base + Math.max(0, pl[0] - base) / 2;
return 700 + (harmos(profile.system, g) - 8) * 150 + 40 + (d - 1) * 130;
}

const ELO_REF = [[8, 850], [9, 1000], [10, 1150], [11, 1300], [12, 1450], [13, 1600], [14, 1750], [15, 1900]];
function eloLabel(profile, r) {
const sys = SYSTEMS[profile.system] || (typeof SYSTEMS_HIDDEN !== "undefined" && SYSTEMS_HIDDEN[profile.system]) || { grades: [] };
const name = (h) => { const g = sys.grades.find(([gg]) => harmos(profile.system, gg) === h); return g ? g[1] : h === 12 ? (profile.system === "FR" ? "2nde" : "1re du Collège") : h === 13 ? (profile.system === "FR" ? "1re" : "2e du Collège") : h === 14 || h === 15 ? (h - 11) + "e du Collège" : h + "e"; };
let lvl = ELO_REF[0];
for (const ref of ELO_REF) if (r >= ref[1] - 75) lvl = ref;
const h = lvl[0], gap = r - lvl[1];
const adj = gap >= 60 ? "solide" : gap <= -40 ? "en route vers la fin" : "typique de fin";
return r < ELO_REF[0][1] - 75 ? "En route vers la fin de " + name(8) : "Niveau " + adj + (adj === "solide" ? " de " : " de ") + name(h);
}




function splitSol(html) {
const t = String(html || ""), cut = (re) => {
const parts = []; let depth = 0, tag = false, last = 0;
for (let i = 0; i < t.length; i++) {
const c = t[i];
if (t.startsWith("\\(", i)) depth++; else if (t.startsWith("\\)", i)) depth = Math.max(0, depth - 1);
else if (c === "<") tag = true; else if (c === ">") tag = false;
if (depth || tag) continue;
const m = re.exec(t.slice(i, i + 8));
if (m && m.index === 0) { const end = i + m[1].length; parts.push(t.slice(last, end).trim()); last = end; i = end - 1; }
}
parts.push(t.slice(last).trim());
return parts.filter((p) => p.replace(/<[^>]+>/g, "").trim().length > 1);
};
let p = cut(/^([.;] )(?=[A-ZÀ-Ý(\\<]|[a-zà-ÿ])/);
if (p.length < 2) p = cut(/^(,)(?= (donc|soit|puis|d'où) )/);
if (p.length >= 2 && p.length <= 6) return p;

let best = null;
for (const m of t.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
const cuts = []; let dep = 0;
for (let i = 0; i < m[1].length; i++) {
const c = m[1][i]; if (c === "{") dep++; else if (c === "}") dep--;
if (dep) continue;
if (c === "=" && m[1][i - 1] !== "\\" && m[1][i + 1] !== "=") cuts.push(i);
else if (m[1].startsWith("\\iff", i)) cuts.push(i);
}
if (cuts.length >= 2 && (!best || cuts.length > best.cuts.length)) best = { m, cuts };
}
if (!best) return null;
const { m, cuts } = best, before = t.slice(0, m.index), after = t.slice(m.index + m[0].length);
const steps = cuts.slice(1).map((c) => before + "\\(" + m[1].slice(0, c).trim() + "\\)");
steps.push(t);
return steps.length <= 6 ? steps : [...steps.slice(0, 4), t];
}





function trivialQ(q, k) {
const raw = String(q.q || "").replace(/<[^>]+>/g, " ");
if (/(^|[^\d.,{}])[+-]\s*0(?![\d.,{])/.test(raw)) return "terme nul";
if (/\\cdot\s*1(?![\d.,{])|×\s*1(?![\d.,{])|\^\s*\{?\s*1\s*\}?(?![\d.,{])/.test(raw)) return "facteur ou exposant 1";
const sp = q.spec || {};
if (sp.kind !== "value" || typeof sp.value !== "number") return "";
const nums = (raw.replace(/\{,\}/g, ".").replace(/[\^_]\s*(\{[^}]*\}|-?\d)/g, " ").replace(/\\[a-zA-Z]+/g, " ").match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
if (!q.shownOk && nums.includes(sp.value) && new Set(nums).size < nums.length) return "réponse dans l'énoncé, données égales";

if (k < 2 && !q.choix && (sp.value === 0 || Math.abs(sp.value) === 1)) return "réponse 0 ou ±1";
return "";
}



function answerShown(q) {
const sp = q.spec || {}, raw = String(q.q || "").replace(/<[^>]+>/g, " ");

if (q.shownOk || q.choix || sp.kind !== "value" || !Number.isInteger(sp.value) || Math.abs(sp.value) < 2 || /ces nombres|parmi|lequel|laquelle/i.test(raw)) return false;
const nums = (raw.replace(/\{,\}/g, ".").replace(/\\[a-zA-Z]+/g, " ").match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
return nums.includes(sp.value) || nums.includes(-sp.value);
}


const qForm = (q) => String(q.q || "").replace(/\d+(?:[.,]\d+|\{,\}\d+)?/g, "#").replace(/\s+/g, " ");

const Engine = {
newState(profile) {
const h = harmos(profile.system, profile.grade);
const start = 700 + (h - 8) * 150 + 100;
return { v: STATE_V, profile, notions: {}, streak: { count: 0, last: null }, history: [], created: day(), elo: { r: Math.round(start), n: 0, log: [] } };
},



catalog(profile) {


const ma1 = profile.system === "CH" && profile.track !== "mp" && profile.grade >= 14 && profile.niv !== "R";

return NOTIONS.filter((n) => { const pl = placeOf(n, profile); return pl && pl[0] <= profile.grade && !(ma1 && n.niv === "R") && !n.prim; }).map((n) => {
const [g] = placeOf(n, profile);



const yr = "M" + (profile.grade - 11), sesa = profile.system === "CH" && profile.track !== "mp" && profile.grade >= 12 && typeof ORDRE_THEME !== "undefined" &&
[(ORDRE_THEME.MATU || {})[n.id], (ORDRE_THEME.MATU_ALT || {})[n.id], (ORDRE_THEME.MATU_REP || {})[n.id]].some((k) => (k || "").startsWith(yr));


const coYear = this.coChap(profile, n.id, true);


const again = sesa || coYear || (profile.track !== "mp" && ((profile.system === "FR" ? n.againFR : n.again) || []).includes(profile.grade));
const label = profile.system === "FR" && n.labelFR && profile.grade < n.labelFR[0] ? n.labelFR[1] : n.label;
return { ...n, label, theme: this.themeKey(profile, n.id), defaultStatus: g < profile.grade ? "vu" : "avenir", current: g === profile.grade || again, again };
});
},

refOf(profile) { return profile.system === "FR" ? "FR" : profile.track === "mp" ? "MP" : profile.grade >= 12 ? "MATU" : "CO"; },



coChap(profile, id, onlyThisYear = false) {
if (profile.system !== "CH" || profile.grade > 11 || typeof ORDRE_THEME === "undefined") return null;
const by = (ORDRE_THEME.CO_BY || {})[id];
if (!by) return null;
if (by[profile.grade]) return by[profile.grade];
if (onlyThisYear) return null;
const ys = Object.keys(by).map(Number).sort((a, b) => a - b), y = ys.filter((v) => v <= profile.grade).pop() ?? ys[0];
return by[y];
},
themeKey(profile, id) {
const co = this.coChap(profile, id);
if (co) return "CO." + co;
const ref = this.refOf(profile), alt = ref === "MATU" && typeof ORDRE_THEME !== "undefined" && ([(ORDRE_THEME.MATU_REP || {})[id], (ORDRE_THEME.MATU_ALT || {})[id]].find((k) => (k || "").startsWith("M" + (profile.grade - 11))) || (ORDRE_THEME.MATU_ALT || {})[id]);

const k = alt && alt.startsWith("M" + (profile.grade - 11)) ? alt : ref !== "CO" && typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME[ref] || {})[id];




if (ref === "FR" && (!k || profile.grade <= 9)) return "FRD." + frDomain(id);
if (k) return ref + "." + k;
const by = typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME.CO_BY || {})[id];
if (ref !== "CO" && by) { const ys = Object.keys(by).map(Number).sort((a, b) => a - b); return "CO." + by[ys[ys.length - 1]]; }
return NOTIONS.find((n) => n.id === id).theme;
},

themeLabel(key, profile) {
const [ref, k] = key.split(".");
if (!k) return THEMES[key];
if (ref === "FRD") return (profile && profile.grade >= 10 ? "Collège · " : "") + FR_DOMAINS[k];

const fy = ref === "FR" && k !== "2AU" && { 2: [10, "2nde"], 1: [11, "1re"], T: [12, "Tle"] }[k[0]];
if (fy && profile && fy[0] !== profile.grade) return fy[1] + " · " + THEME_LABEL.FR[k];
const y = ref === "CO" && k.split("C")[0], coElsewhere = profile && this.refOf(profile) !== "CO";
return (y && profile && +y !== profile.grade ? (coElsewhere ? "CO " : "") + y + "e · " : "") + THEME_LABEL[ref][k];
},


themeOrder(list, profile) {
const keys = [...new Set(list.map((c) => c.theme))], pos = (k) => {
const [ref, t] = k.split(".");
if (!t) return 1000 + Object.keys(THEMES).indexOf(k);
if (ref === "FRD") return (profile && profile.grade >= 10 ? 600 : 0) + Object.keys(FR_DOMAINS).indexOf(t);
return Object.keys(THEME_LABEL[ref]).indexOf(t) + (ref === "CO" && profile && +t.split("C")[0] !== profile.grade ? 500 : 0);
};
return keys.sort((a, b) => pos(a) - pos(b));
},

rank(profile, id) {

if (profile.system === "FR" && profile.grade <= 9 && ORDRE.FR_COL && ORDRE.FR_COL[id] !== undefined) return ORDRE.FR_COL[id];
const ref = this.refOf(profile);
const r = (ORDRE[ref] || {})[id] ?? ORDRE.CO[id];
return r ?? 1000 + NOTIONS.findIndex((n) => n.id === id);
},
newNotion(status) {
return { status, m: status === "vu" ? 0.55 : status === "encours" ? 0.4 : 0, box: status === "vu" ? 1 : 0, due: day(), seen: 0, ok: 0 };
},
autoInit(state) {
this.initNotions(state, Object.fromEntries(this.catalog(state.profile).map((c) => [c.id, c.defaultStatus])));
this.unlock(state);
},



unlock(state, date = new Date()) {
const today = day(date), p = state.profile;
const cur = Object.keys(state.notions).filter((id) => { const pl = placeOf(NOTIONS.find((n) => n.id === id), p); return pl && pl[0] === p.grade; })
.sort((a, b) => this.rank(p, a) - this.rank(p, b));
for (const id of cur) { const s = state.notions[id]; if (s.status === "nonvu" && (!s.retry || s.retry <= today)) s.status = "avenir"; }
const open = () => cur.filter((id) => ["encours", "vu"].includes(state.notions[id].status));
const active = () => open().filter((id) => { const s = state.notions[id]; return !(s.ok >= 2 && s.m >= 0.6); }).length;
const minOpen = Math.ceil((cur.length * schoolMonth(date)) / 10);
let changed = false;
while (active() < 3 || open().length < minOpen) {
const next = cur.find((id) => state.notions[id].status === "avenir");
if (!next) break;
Object.assign(state.notions[next], { status: "encours", m: Math.max(0.4, state.notions[next].m), due: today });
changed = true;
}
return changed;
},

notYet(state, id) {
const s = state.notions[id];
if (!s) return;
s.status = "nonvu"; s.retry = addDays(day(), 21); s.due = s.retry;
this.unlock(state);
},






snap(state, today = day()) {
if (!state || !state.notions) return;
const S = Array.isArray(state.snaps) ? state.snaps : [];
if (S.length && S[S.length - 1] && S[S.length - 1].d === today) return;
const c = {};
for (const [cid, rec] of Object.entries(state.comps || {})) { const n = compNote(rec); if (n !== null) c[cid] = Math.round(n * 2); }
const k = Object.keys(state.notions).filter((id) => { const s = state.notions[id]; return s && s.seen > 0 && s.m >= 0.7; });
const lim = addDays(today, -6);
state.snaps = [...S.filter((x) => x && x.d >= lim && x.d < today), { d: today, c, k }];
},


snapPlaced(state, today = day()) {
if (!state || !state.notions) return;
this.snap(state, today);
const x = state.snaps[state.snaps.length - 1];
if (x && x.d === today) x.k = Object.keys(state.notions).filter((id) => { const s = state.notions[id]; return s && s.seen > 0 && s.m >= 0.7; });
},




week(state, today = day()) {
const lim = addDays(today, -6), S = (Array.isArray(state.snaps) ? state.snaps : []).filter((x) => x && x.d >= lim && x.d <= today);
const ref = S[0] || null, H = (state.history || []).filter((x) => x && x.date >= lim && x.date <= today && x.n > 0);
const out = { ups: [], first: [], cons: [], fixed: 0, days: H.length, n: H.reduce((a, x) => a + (x.n || 0), 0), since: null };
out.fixed = (Array.isArray(state.carnetOut) ? state.carnetOut : []).filter((d) => d >= lim && d <= today).length;
if (!ref) return out;

if (H.some((x) => x.date < ref.d)) out.since = ref.d;
const lab = (cid) => { const [id, i] = cid.split(":"), L = COMPS[id]; return (L && L[+i]) || (NOTIONS.find((x) => x.id === id) || {}).label || id; };
for (const [cid, rec] of Object.entries(state.comps || {})) {
const a = compNote(rec);
if (a === null) continue;
const b = ref.c && ref.c[cid] != null ? ref.c[cid] / 2 : null;
if (b === null) out.first.push({ cid, label: lab(cid), a });
else if (a > b) out.ups.push({ cid, label: lab(cid), b, a });
}
out.ups.sort((x, y) => y.a - y.b - (x.a - x.b) || y.a - x.a);
const had = new Set(ref.k || []);
out.cons = Object.keys(state.notions || {}).filter((id) => { const s = state.notions[id]; return s && s.status !== "prim"  && s.seen > 0 && s.m >= 0.7 && !had.has(id); });
return out;
},

recordComp(state, id, d, score) {
this.snap(state);
state.comps = state.comps || {};
const cid = compOf(id, d), rec = (state.comps[cid] = state.comps[cid] || { r: [], n: 0 }), before = compNote(rec);
rec.r.push(score); rec.r = rec.r.slice(-8); rec.n++; rec.last = day();
if (d >= 2 || +cid.split(":")[1] > 0) rec.hi = true;
if (typeof Badges !== "undefined") Badges.onComp(state, cid, before, compNote(rec));
},





upgrade(state) {
let ch = false;
const set = (o, k, v) => { o[k] = v; ch = true; }, num = (x) => typeof x === "number" && isFinite(x);
const p = state.profile;
if (!num(p.grade)) set(p, "grade", +p.grade || 9);
if (p.system === "CH" && p.track !== "mp" && p.track !== "college") set(p, "track", "college");
if (!num(p.minutes)) set(p, "minutes", 5);
if (!state.notions || typeof state.notions !== "object" || Array.isArray(state.notions)) set(state, "notions", {});
const ST = ["vu", "encours", "avenir", "nonvu"];
for (const [id, n] of Object.entries(state.notions)) {
if (!n || typeof n !== "object") { state.notions[id] = this.newNotion("avenir"); ch = true; continue; }
if (!ST.includes(n.status)) set(n, "status", "vu");
for (const k of ["m", "box", "seen", "ok"]) if (!num(n[k])) set(n, k, k === "m" ? (n.status === "vu" ? 0.55 : 0) : 0);
if (typeof n.due !== "string") set(n, "due", day());
}
if (!state.streak || typeof state.streak !== "object") set(state, "streak", { count: 0, last: null });
else if (!num(state.streak.count)) set(state.streak, "count", 0);
if (!Array.isArray(state.history)) set(state, "history", []);
else if (state.history.some((x) => !x || typeof x.date !== "string" || !num(x.n))) set(state, "history", state.history.filter((x) => x && typeof x.date === "string" && num(x.n)));
if (!state.elo || !num(state.elo.r)) set(state, "elo", { ...(state.elo || {}), r: this.newState(p).elo.r });
if (!num(state.elo.n)) set(state.elo, "n", 0);
if (!Array.isArray(state.elo.log)) set(state.elo, "log", []);
if (typeof state.created !== "string") set(state, "created", (state.history[0] && state.history[0].date) || day());
if (state.carnet !== undefined && !Array.isArray(state.carnet)) set(state, "carnet", []);
if (Array.isArray(state.carnet) && state.carnet.some((x) => !x || !x.id || !x.d)) set(state, "carnet", state.carnet.filter((x) => x && x.id && x.d));
if (state.comps && typeof state.comps === "object") for (const [cid, r] of Object.entries(state.comps)) if (!r || !Array.isArray(r.r)) { delete state.comps[cid]; ch = true; }
if (state.v !== STATE_V) set(state, "v", STATE_V);
return ch;
},


migrate(state) {
let changed = false;
for (const c of this.catalog(state.profile)) if (!state.notions[c.id]) { state.notions[c.id] = this.newNotion(c.defaultStatus); changed = true; }

for (const s of Object.values(state.notions)) if (s.status === "nonvu" && !s.retry) { s.status = "avenir"; changed = true; }


for (const s of Object.values(state.notions)) if (s.placed && !s.seen && !s.lessonSeen && s.box >= 2) { s.seen = 1; s.lessonSeen = true; changed = true; }

for (const [cid, rec] of Object.entries(state.comps || {})) if (rec && !rec.hi && +cid.split(":")[1] > 0) { rec.hi = true; changed = true; }
for (const id of Object.keys(state.notions)) { const n = NOTIONS.find((x) => x.id === id); if (!n || !placeOf(n, state.profile)) { delete state.notions[id]; changed = true; } }
if (this.unlock(state)) changed = true;
return changed;
},

initNotions(state, statuses) {
state.notions = {};
for (const [id, status] of Object.entries(statuses)) {
state.notions[id] = this.newNotion(status);
}
},









freePlan(state, scope, n = 6) {
const theme = (id) => (NOTIONS.find((x) => x.id === id) || {}).theme || "";




const yearSet = new Set(this.catalog(state.profile).filter((c) => c.current).map((c) => c.id)), need = this.remob(state, yearSet);
const all = Object.keys(state.notions).filter((id) => GEN[id]), yr = all.filter((id) => yearSet.has(id));
const pool = yr.length >= n ? yr.concat(all.filter((id) => !yearSet.has(id) && need.has(id))) : all;
const inYear = (id) => yr.length < n || yearSet.has(id);
const s = (id) => state.notions[id], ok = (id) => !state.notions[id] || (s(id).seen > 0 && s(id).m >= 0.7);
const seen = pool.filter((id) => s(id).seen > 0), L = seen.length ? seen.reduce((t, id) => t + s(id).m, 0) / seen.length : 0.6;
const tier = seen.length < 3 ? "mid" : L >= 0.75 ? "fort" : L < 0.55 ? "fragile" : "mid";
const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rk = (id) => this.rank(state.profile, id);


const recent = (state.freeRecent || []).flat(), rec = (id) => recent.filter((x) => x === id).length;
const byRecent = (a) => a.map((id, i) => [id, i]).sort((x, y) => rec(x[0]) - rec(y[0]) || x[1] - y[1]).map((x) => x[0]);
const strong = byRecent(sh(pool.filter((id) => inYear(id) && s(id).seen > 0 && s(id).m >= 0.7)));

let weak = pool.filter((id) => s(id).seen > 0 && s(id).m < 0.7).sort((a, b) => s(a).m + 0.3 * rec(a) - s(b).m - 0.3 * rec(b) + (Math.random() - 0.5) * 0.1);
if (tier === "fragile") weak = [...new Set(weak.flatMap((id) => [...(PREREQ[id] || []).filter((p) => all.includes(p) && !ok(p)), id]))];


let fresh = pool.filter((id) => inYear(id) && !s(id).seen).sort((a, b) => rk(a) - rk(b));
if (tier === "fragile") fresh = fresh.filter((id) => (PREREQ[id] || []).every(ok));
const win = tier === "fort" ? fresh.slice(Math.min(4, Math.max(0, fresh.length - 8)), Math.min(4, Math.max(0, fresh.length - 8)) + 20) : fresh.slice(0, tier === "fragile" ? 10 : 20);
fresh = byRecent(sh(win.length ? win : fresh));
const want = tier === "fort" ? [1, 1, n - 2] : tier === "fragile" ? [1, n - 2, 1] : [Math.round(n / 3), Math.round(n / 3), n - 2 * Math.round(n / 3)];
const groups = [strong, weak, fresh], out = [], used = new Set();


const fam = (id) => { try { return this.themeKey(state.profile, id) || theme(id); } catch (e) { return theme(id); } };
const famN = (id) => out.filter((x) => fam(x) === fam(id)).length;
const take = (g, cap = true) => { const last = out.length ? theme(out[out.length - 1]) : "", free = (id) => !used.has(id) && (!cap || famN(id) < 2); let k = g.findIndex((id) => free(id) && theme(id) !== last); if (k < 0) k = g.findIndex(free); if (k < 0) return false; used.add(g[k]); out.push(g[k]); return true; };
for (let round = 0; out.length < n && round < 3 * n; round++) { const gi = [1, 2, 0][round % 3]; if (want[gi] > 0 && take(groups[gi])) want[gi]--; else if (want.every((w, i) => w <= 0 || !groups[i].some((id) => !used.has(id) && famN(id) < 2))) { if (!groups.some((g) => take(g))) break; } }
while (out.length < n && (groups.some((g) => take(g)) || groups.some((g) => take(g, false)))) {}
const cap = difficultyCap(state.profile);
state.freeRecent = [...(state.freeRecent || []), out.slice()].slice(-2);
return out.map((id) => { let d = this.difficulty(state, id); if (tier === "fort" && s(id).seen > 0 && s(id).m >= 0.85) d = Math.min(cap, d + 1); return id + "|" + d; });
},




remob(state, year) {
const need = new Set(), coince = (s) => !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
for (const [id, s] of Object.entries(state.notions)) {
if (!year.has(id)) { if (coince(s)) need.add(id); continue; }
if (s.seen >= 2 && coince(s)) for (const p of PREREQ[id] || []) if (state.notions[p] && !year.has(p)) need.add(p);
}
if (this.eloDrop(state)) for (const [id, s] of Object.entries(state.notions)) if (!year.has(id) && s.seen > 0) need.add(id);
return need;
},
eligible(state) {
return Object.entries(state.notions).filter(([, s]) => s.status === "vu" || s.status === "encours").map(([id]) => id);
},


difficulty(state, id) {
const cap = difficultyCap(state.profile), m = state.notions[id].m;
let best = 1, bestGap = Infinity;
for (let d = 1; d <= cap; d++) {
const gap = Math.abs(itemRating(state.profile, id, d) - (state.elo.r - 150 + (state.tadj || 0)));
if (gap < bestGap) { bestGap = gap; best = d; }
}
if (m < 0.3) best = Math.max(1, best - 1);
if (m > 0.8) best = Math.min(cap, best + 1);

if (hasProb(id) && m >= 0.7 && state.elo.r >= itemRating(state.profile, id, 4) - 250 && Math.random() < 0.35) return 4;
return best;
},



eloRefund(state, delta) {
if (!(delta < 0)) return 0;
const back = Math.round(-delta / 2), e = state.elo; e.r += back;
const last = e.log[e.log.length - 1]; if (last && last[0] === day()) last[1] = e.r;
return back;
},

updateElo(state, id, d, score, weight = 1) {
this.snap(state);
const e = state.elo, q = itemRating(state.profile, id, d);
const expected = 1 / (1 + Math.pow(10, (q - e.r) / 400));
const K = (e.n < 20 ? 48 : e.n < 60 ? 32 : 20) * weight;
let delta = Math.round(K * (score - expected));



if (e.n < 20 && d <= 1 && delta < -15) delta = -15;
e.r = Math.max(400, e.r + delta);
e.n++;
const today = day(), last = e.log[e.log.length - 1];
if (last && last[0] === today) last[1] = e.r; else e.log.push([today, e.r]);
e.log = e.log.slice(-90);
return delta;
},



finalize(state, id, q) {
const p = state && state.profile;
if (q && p && p.system === "CH" && p.track !== "mp" && p.grade <= 10) racineCO(q);
if (!q) return q;
const txt0 = String(q.q || "");
const mark = (sp, txt, own, step) => {
if (!sp) return;
if (!step) exprForm(sp, txt);


if (sp.kind === "value" && !sp.round && /valeur exacte/i.test(txt) && !/approch|arrondi/i.test(txt)) sp.exact = true;

if (!step && sp.kind === "value" && !sp.round && isFinite(sp.value) && !Number.isInteger(sp.value) && /fraction irréductible|sous forme (?:de|d'une) fraction/i.test(txt)) sp.frac = true;
if (sp.kind !== "value" || sp.sci || sp.final) return;
if (calcPermis(id, txt, sp, own) === false) { sp.final = true; if (CALC_POW.test(txt)) sp.pow = true; }
};
mark(q.spec, txt0, q.calcul);
(q.parts || []).forEach((x) => mark(x.spec, txt0 + " " + (x.label || ""), x.calcul || q.calcul));
(q.guide || []).forEach((g) => mark(g.spec, txt0 + " " + (g.ask || ""), g.calcul || q.calcul, true));



if (p && p.system === "FR" && typeof FR_NOTES === "function") { const r = FR_NOTES(id, q); if (r) q = r; }


if (p && p.system === "FR" && p.grade) {
if (q.traps) q = { ...q, traps: q.traps.filter((t) => !horsFRTexte(p.grade, String(t.m || ""))) };
if (q.hints) q = { ...q, hints: q.hints.filter((h) => !horsFRTexte(p.grade, String(h || ""))) };
if (q.hint && horsFRTexte(p.grade, String(q.hint))) q = { ...q, hint: plainTeX(typeof HINTS_FR_COL !== "undefined" && HINTS_FR_COL[id] && !horsFRTexte(p.grade, HINTS_FR_COL[id]) ? HINTS_FR_COL[id] : HINTS[id] && !horsFRTexte(p.grade, HINTS[id]) ? HINTS[id] : "Relis l'énoncé et fais un calcul à la fois.") };
}
if (p && p.system === "FR" && typeof frLocal === "function") {
const SKIP = new Set(["spec", "canon", "code", "id", "ctx", "e", "expr", "values", "value"]);

const loc = (v, d) => typeof v === "string" ? (typeof frIdTxt === "function" && !/^\s*<svg/.test(v) ? frIdTxt(id, frLocalQ(v), p.grade) : frLocalQ(v)) : d > 6 || !v || typeof v !== "object" ? v : Array.isArray(v) ? v.map((x) => loc(x, d + 1))
: Object.getPrototypeOf(v) !== Object.prototype ? v : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SKIP.has(k) ? x : loc(x, d + 1)]));
q = loc(q, 0);
}
return q;
},
make(state, id, d, seed, vary) {
let level = d || this.difficulty(state, id);
const asked = level;
const keep = (q) => { if (q && typeof q === "object" && q.d && q.d !== 4 && asked !== 4) q.d = asked; return q; };





const UP11 = ["prio", "fracadd", "fracconv", "fracmul", "fracops", "puiss", "sci", "scicalc", "rac", "carres", "pyth", "pythfig", "vol",
"vitesse", "valnum", "litelab", "reduire", "monomes", "distrib", "eq1", "eqfrac", "probeq", "affine", "repere", "tabval", "pctvar"];
if (level === 1 && UP11.includes(id) && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 11) level = 2;







const UPMP = {
12: ["prio", "rel", "arith", "fracadd", "fracmul", "fracsimp", "fracconv", "fracops", "puiss", "rac", "premiers", "divcrit", "pctvar",
"monomes", "distrib", "parenth", "formule", "eq1", "eqfrac", "probeq", "eq2", "eq2fact", "sys2", "sysprob", "pyth", "pythfig", "pythrec",
"thales", "angles", "cercthales", "geocomb"],
13: ["affine", "modaff", "affzero", "droitesinter"],
};
if (level === 1 && state && state.profile && state.profile.system === "CH" && state.profile.track === "mp" && (UPMP[state.profile.grade] || []).includes(id)) level = 2;



const UP9 = ["decread", "deccomp", "perim", "aire1", "solides", "quadri"];
if (level === 1 && UP9.includes(id) && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 9) level = 2;


const UP2 = { rel: 11 };
if (level === 2 && UP2[id] && state && state.profile && state.profile.grade >= UP2[id]) level = 3;



if (level < 3 && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade >= 12) {
if (UPC_MIN[id]) level = Math.max(level, UPC_MIN[id]); else if (UPC.includes(id)) level += 1;
}



if (level < 3 && state && state.profile && state.profile.system === "FR" && typeof UPFR !== "undefined" && UPFR[state.profile.grade] && UPFR[state.profile.grade][id]) level = Math.max(level, UPFR[state.profile.grade][id]);

if (seed && state && state.profile && state.profile.system === "FR") { let q = this.build(id, level, seed); for (let k = 1; k <= 40 && horsCO(state, id, q); k++) q = this.build(id, level, seed + k * 977);

if (horsCO(state, id, q) && level > 1) return this.make(state, id, level - 1, seed);
return keep(this.finalize(state, id, q)); }

if (seed) { let q = this.build(id, level, seed); for (let k = 1; k <= 12 && q && q.fr && horsCO(state, id, q); k++) q = this.build(id, level, seed + k * 977); return keep(this.finalize(state, id, q)); }
const rec = ((state.recentQ = state.recentQ || {})[id] = (state.recentQ[id] || []));
const key = (q) => { let h = 0; for (const c of String(q.q) + JSON.stringify(q.spec)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; };
let q;

const ctxs = ((state.recentCtx = state.recentCtx || {})[id] = (state.recentCtx[id] || []));


const forms = ((state.recentForm = state.recentForm || {})[id] = (state.recentForm[id] || []));



const pKey = (x) => x && x.spec && x.spec.kind === "multi" ? "p:" + (x.ctx || String(x.q).replace(/\\\(.*?\\\)|<[^>]*>/g, " ").replace(/[^A-Za-zÀ-ÿ' ]/g, " ").trim().split(/\s+/).slice(0, 4).join(" ").toLowerCase()) : null;
const cday = (state.ctxDay = state.ctxDay || {}), lim = addDays(day(), -6), stale = (x) => { const k = pKey(x); return !!(k && cday[k] && cday[k] >= lim) || sceneStale(state, sceneKey(x)); };
let found = false, fresh1 = null, lastOk = null, lv = level;


for (let k = 0, t = 0; k < 16 && !found && t < 60; t++) {
if (t && t % 15 === 0 && !lastOk && lv > 1) lv -= 1;
q = this.build(id, lv);
if (horsCO(state, id, q)) continue;
k++; lastOk = q;
const fresh = !rec.includes(key(q)) && !(q.ctx && ctxs.includes(q.ctx)) && !stale(q);
if (fresh && !forms.includes(qForm(q))) found = true;
else if (fresh && !fresh1) fresh1 = q;
}
if (!found && fresh1) q = fresh1;
else if (!found && lastOk) q = lastOk;
if (vary && stale(q) && level === 4) return this.make(state, id, 3);
if (pKey(q)) { for (const k in cday) if (cday[k] < lim) delete cday[k]; cday[pKey(q)] = day(); }
sceneNote(state, sceneKey(q));
rec.push(key(q)); state.recentQ[id] = rec.slice(-15);
if (q.ctx) state.recentCtx[id] = [...ctxs, q.ctx].slice(-2);
state.recentForm[id] = [...forms, qForm(q)].slice(-2);
return keep(this.finalize(state, id, q));
},

build(id, level, seed) {
seed = seed || Math.floor(Math.random() * 46655) + 1;
R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0));
const code = id + "-" + level + "-" + seed.toString(36);


const tidy = (t) => typeof t !== "string" ? t : t.replace(/([(=+\-\s{]|\\\()(-?)1([a-z])(?![a-z{])/g, "$1$2$3").replace(/([(=+\s{]|\\\()-1([A-Z])(?![a-zA-Z{])/g, "$1-$2").replace(/\+\s*-\s*(?=[\da-z(\\])/g, "- ").replace(/-\s*-\s*(?=[\da-z(\\])/g, "+ ")

.replace(/(^|[^\w)}'′\\])(-?(?:\d+|[ak])?)((?:\([^()]*\)){2,})/g, (m, b, c, g) => { const fs = g.match(/\([^()]*\)/g); if (fs.filter((f) => f === "(x)").length !== 1 || fs.length < 2 || /\\|∘/.test(g)) return m; return b + c + "x" + fs.filter((f) => f !== "(x)").join(""); });

if (level === 4 && hasProb(id)) { const p = moneyQ(R.pick(probList(id).concat((typeof PROBX !== "undefined" && PROBX[id]) || []))());
const P = { ...p, q: tidy(plainTeX(p.q)), sol: tidy(plainTeX(p.sol)), hints: (p.hints || []).map(plainTeX) }; if (p.parts) P.parts = p.parts.map((x) => ({ ...x, label: plainTeX(x.label) }));
return { ...P, id, d: 4, seed, code, spec: { kind: "multi" }, hint: P.hints[0] }; }


let q, keep = null;
for (let k = 0; k < 6; k++) {
if (k) R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0) + k * 15485863);


const vs = [].concat((typeof VAR !== "undefined" && VAR[id] && VAR[id][level]) || [], (typeof VARX !== "undefined" && VARX[id] && VARX[id][level]) || []), vk = vs.length ? Math.floor(R.rand() * (vs.length + 1)) : 0;
q = vk ? vs[vk - 1]() : GEN[id](level);
q.q = tidy(q.q); q.sol = tidy(q.sol);
if (trivialQ(q, k)) continue;
if (!answerShown(q)) { keep = null; break; }
if (!keep) keep = q;
}
if (keep) q = keep;
q = moneyQ(q);
if (q.guide) q.guide = q.guide.map((g) => ({ ...g, ask: colonBreak(tidy(g.ask)), sol: colonBreak(tidy(g.sol)) }));
q.q = colonBreak(q.q); q.sol = colonBreak(q.sol);
if (q.traps) q.traps = q.traps.map((t) => ({ ...t, m: colonBreak(t.m) }));
if (q.hints) q.hints = q.hints.map(colonBreak);
if (q.traps && q.spec && q.spec.kind === "value") q.traps = q.traps.filter((t) => isFinite(t.v) && Math.abs(t.v - q.spec.value) > Math.max(q.spec.round || 0, 1e-6 * (Math.abs(q.spec.value) >= 1 ? Math.abs(q.spec.value) : Math.max(Math.abs(q.spec.value), 1e-300))));
if (q.parts) q.parts = q.parts.map((p) => ({ ...p, label: colonBreak(tidy(p.label)) }));

if (q.spec && q.spec.kind === "value" && /notation scientifique/.test(q.q) && !/^Calcule : /.test(q.q)) {
q.spec = { ...q.spec, sci: true };
if (!q.canon) { const e = Math.floor(Math.log10(Math.abs(q.spec.value)) + 1e-9), a = +(q.spec.value / 10 ** e).toFixed(8); q.canon = String(a).replace(".", ",") + "*10^" + e; }
}
return { ...q, id, d: level, seed, code, hint: plainTeX(q.hint || HINTS[id]) };
},

horsCO(state, id, q) { return horsCO(state, id, q); },

fromCode(code) {
const m = /^([a-z0-9]+)-([1-4])-([a-z0-9]+)$/.exec(String(code).trim().toLowerCase());
if (!m || !GEN[m[1]] || (m[2] === "4" && !hasProb(m[1]))) return null;
return this.build(m[1], +m[2], parseInt(m[3], 36));
},


placementPlan(state) {
const all = this.eligible(state), recent = all.filter((id) => this.isRecent(state, id));
const ids = recent.length >= 3 ? recent : all;
const byTheme = {};
for (const id of ids) {
const n = NOTIONS.find((x) => x.id === id);
(byTheme[n.theme] = byTheme[n.theme] || []).push(n);
}
const pl = (n) => placeOf(n, state.profile);
Object.values(byTheme).forEach((arr) => arr.sort((a, b) => pl(b)[0] - pl(a)[0] || pl(b)[1] - pl(a)[1]));
const plan = [];
while (plan.length < 5 && Object.values(byTheme).some((a) => a.length)) {
for (const arr of Object.values(byTheme)) if (arr.length && plan.length < 5) plan.push(arr.shift().id);
}
return plan;
},



placementLevel(state, i) { return i === 0 ? 1 : Math.min(2, difficultyCap(state.profile)); },

placementResult(state, id, ok, d = 2) {
this.updateElo(state, id, d, ok === true ? 1 : 0);
this.recordComp(state, id, d, ok === true ? 1 : 0);
const s = state.notions[id];


if (ok === true) Object.assign(s, { m: 0.75, box: 2, due: addDays(day(), 3), seen: Math.max(1, s.seen || 0), lessonSeen: true });
else if (ok === false) Object.assign(s, { m: 0.3, box: 0, due: day() });
else Object.assign(s, { m: 0.2, box: 0, due: day() });
s.placed = true;
},





oldNeed(state) {
const el = this.eligible(state), old = el.filter((id) => !this.isRecent(state, id)), need = new Set();
const coince = (s) => s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
for (const id of old) if (coince(state.notions[id])) need.add(id);
for (const id of el) if (!old.includes(id) && state.notions[id].seen >= 2 && coince(state.notions[id])) for (const p of PREREQ[id] || []) if (old.includes(p)) need.add(p);
if (this.eloDrop(state)) old.forEach((id) => need.add(id));
return need;
},
eloDrop(state) { const lim = addDays(day(), -30), peak = Math.max(state.elo.r, ...((state.elo.log || []).filter((x) => x[0] >= lim).map((x) => x[1]))); return peak - state.elo.r >= 120; },

isRecent(state, id) {
const pl = placeOf(NOTIONS.find((n) => n.id === id), state.profile);
const n = NOTIONS.find((x) => x.id === id);
if (n && n.prim) return false;
return pl && (pl[0] >= state.profile.grade - 1 || (state.profile.track !== "mp" && (n.again || []).includes(state.profile.grade)));
},



prevPenalty(state) {
const g = state.profile.grade, el = this.eligible(state), out = new Set(), keep = new Set();
const coince = (s) => !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
const yearOf = (id) => { const n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, state.profile); return !pl ? null : pl[0] === g || (state.profile.track !== "mp" && (n.again || []).includes(g)) ? 0 : pl[0] === g - 1 ? -1 : -2; };
for (const id of el) if (yearOf(id) === 0 && state.notions[id].seen >= 2 && coince(state.notions[id])) for (const p of PREREQ[id] || []) keep.add(p);
for (const id of el) if (yearOf(id) === -1 && !coince(state.notions[id]) && !keep.has(id)) out.add(id);
return out;
},

pool(state, kind) {
return this.eligible(state);
},


oldLevels(state, id, levels, target) {
const s = state.notions[id], weak = s.m < 0.45 || this.eloDrop(state);

if (this.underFloor(state)) return levels.filter((d) => itemRating(state.profile, id, d) >= state.elo.r - 350);
return levels.filter((d) => weak ? d >= 2 : d >= 3 && itemRating(state.profile, id, d) >= target - 150);
},

recentRate(state) { const L = state.last1 || []; return L.length >= ADAPT.min ? L.reduce((a, b) => a + b, 0) / L.length : null; },
adapt(state, ok1) {
state.last1 = [...(state.last1 || []), ok1 ? 1 : 0].slice(-ADAPT.win);
const r = this.recentRate(state); if (r === null) return;
let a = state.tadj || 0;
if (r < ADAPT.low || (a < 0 && r < ADAPT.aim - 0.05) || (a > 0 && r < ADAPT.aim)) a -= ADAPT.down;
else if (r > ADAPT.high || (a < 0 && r > ADAPT.aim + 0.05)) a += ADAPT.up;
state.tadj = Math.max(ADAPT.lo, Math.min(ADAPT.hi, a));
},
underFloor(state) { const r = this.recentRate(state); return (state.tadj || 0) <= ADAPT.floor && r !== null && r < ADAPT.aim - 0.05; },


chooseFormat(state, exclude = [], today = day()) {
const since = addDays(today, -7), log = (state.formats || []).filter((f) => f.date >= since && f.date < today);
const recentRev = log.some((x) => x.f === "revision" && x.date >= addDays(today, -3));
const yesterday = (state.formats || []).filter((f) => f.date < today).slice(-1)[0];
const due = this.eligible(state).filter((id) => state.notions[id].due <= today).length;
let best = null;
for (const f of Object.keys(FORMATS)) {
if (exclude.includes(f)) continue;
let sc = WEEK[f] - log.filter((x) => x.f === f).length;
if (yesterday && yesterday.f === f) sc -= 3;
if (f === "revision") sc += due >= 4 && !recentRev ? 1 : due >= 4 ? 0 : -1;
if (f === "defi" && !this.eligible(state).some((id) => hasProb(id) && this.isRecent(state, id))) sc -= 0.5;

if (f === "defi" && this.underFloor(state)) sc -= 1.5;


if (f === "defi" && this.struggling(state)) continue;

if (f === "defi" && state.placedOn === today) continue;
sc += Math.random() * 0.4;
if (!best || sc > best.sc) best = { f, sc };
}
return best ? best.f : "mixte";
},






lessonDue(state, id) {
const s = state.notions[id];
return !!(s && typeof LESSONS !== "undefined" && LESSONS[id] && !s.lessonSeen && (s.status === "encours" || s.m < 0.4));
},





nowHas(state, id) { return this.nowActive(state) && state.now.ids.includes(id); },
lessonFirst(state, id) { const s = state.notions[id]; return this.lessonDue(state, id) && (!s.seen || s.status === "encours") && !this.nowHas(state, id); },






lessonHold(state) {
if (!this.struggling(state)) return false;
let last = null;
for (const s of Object.values(state.notions)) if (s && s.lessonDay && (!last || s.lessonDay > last.lessonDay)) last = s;
if (!last) return false;
return (last.ok || 0) <= (last.lessonOk0 || 0) && (last.seen || 0) - (last.lessonN0 || 0) < 4 && last.lessonDay >= addDays(day(), -7);
},
lessonPick(state, ids) {
const now = this.nowActive(state) ? state.now.ids : [], s = (id) => state.notions[id];
const key = (id) => (now.includes(id) ? 0 : s(id).status === "encours" ? 1 : 2) * 1e5 + (s(id).status === "encours" || now.includes(id) ? this.rank(state.profile, id) : Math.round(s(id).m * 1000));
return [...ids].sort((a, b) => key(a) - key(b))[0] || null;
},




struggling(state) { const L = state.last1 || [], r = L.length ? L.reduce((a, b) => a + b, 0) / L.length : 1;

return this.underFloor(state) || (L.length >= 5 && r < ADAPT.low) || (L.length < 5 && state.elo.n < 20 && (state.placeMiss || 0) >= 3 && r < 0.75); },




firstDayN(state) { return 2; },
firstDayCap(state, plan) {
if (!plan || state.placedOn !== day()) return plan;
const out = plan.slice(0, this.firstDayN(state)).map((e) => { const x = String(e).split("|"); if (!/^PROB:/.test(x[0]) && +x[1] > 2) x[1] = "2"; return x.join("|"); });
return Object.assign(out, plan.noLesson ? { noLesson: true } : {});
},



belowClass(state) {
const h = harmos(state.profile.system, state.profile.grade), r0 = 700 + (h - 8) * 150 + 100, L = state.last1 || [];
return state.elo.r + (state.tadj || 0) < r0 || (L.length >= 5 && L.reduce((a, b) => a + b, 0) / L.length < ADAPT.aim);
},
autoN(state) { return state.placedOn === day() ? this.firstDayN(state) : this.struggling(state) || this.belowClass(state) ? 4 : FORMATS.auto.slots.length; },
fmtText(state, f) { const n = f === "auto" ? this.autoN(state) : 0; return n && n < FORMATS.auto.slots.length ? n + " calculs rapides, enchaînés." : FORMATS[f].text; },
planSession(state, format) { return this.firstDayCap(state, this.ownYear(state, this.planSession0(state, format), format)); },








ownYear(state, plan, format) {
if (!Array.isArray(plan) || plan.length < 3 || this.nowActive(state) || this.struggling(state) || this.eloDrop(state) || state.placedOn === day()) return plan;
const g = state.profile.grade, idOf = (e) => String(e).split("|")[0];
const own = (id) => { const n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, state.profile); return !!pl && pl[0] === g && !n.prim; };
if (plan.some((e) => own(idOf(e)))) return plan;
const coince = (id) => { const s = state.notions[id]; return !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2); };

let at = -1;
for (const j of [...Array(plan.length).keys()].slice(1, -1).concat(plan.length - 1)) if (at < 0 && !String(plan[j]).startsWith("PROB:") && !coince(idOf(plan[j])) && !this.lessonDue(state, idOf(plan[j]))) at = j;
if (at < 0) return plan;
const kind = String(plan[at]).split("|")[2] || "app", inPlan = new Set(plan.map(idOf));
const ex = new Set(this.eligible(state).filter((id) => !own(id) || inPlan.has(id)));
const b = this.planSlots(state, [kind], { exclude: ex })[0];
if (!b) return plan;
const x = b.split("|"), les = this.lessonDue(state, x[0]);

if (les && !plan.noLesson && format !== "auto" && (format || this.todayFormat(state)) !== "auto") return plan;
if (les) x[1] = "1";
plan[at] = x.join("|");
return plan;
},
planSession0(state, format) {

const f = format || this.todayFormat(state), slots = f === "auto" ? FORMATS.auto.slots.slice(0, this.autoN(state)) : FORMATS[f].slots.slice(0, state.placedOn === day() ? this.firstDayN(state) : this.struggling(state) ? 3 : 9);
const el = this.eligible(state), pend = el.filter((id) => this.lessonFirst(state, id));


const nowLes = el.filter((id) => this.nowHas(state, id) && this.lessonDue(state, id));
const noLes = (p) => Object.assign(p, { noLesson: true });
if (!pend.length && !nowLes.length) return this.planSlots(state, slots);
const exclude = new Set(pend);

if (f !== "auto" && this.lessonHold(state)) { const p = this.planSlots(state, slots, { exclude }); if (new Set(p.map((e) => String(e).split("|")[0])).size >= Math.min(2, p.length) && p.length) return noLes(p); }
if (f === "revision" || f === "defi") { const p = this.planSlots(state, slots, { exclude }); if (p.length) return noLes(p); }


if (f === "auto") { const p = this.planSlots(state, slots, { exclude }); return p.length ? p : this.planSlots(state, slots); }
const keep = this.lessonPick(state, [...pend, ...nowLes]);
exclude.add(keep);
const rest = slots.length >= 3 ? slots.slice(1, -1) : slots.slice(1);
const k0 = slots[0] === "defi4" ? "defi" : slots[0];
const out = [keep + "|1|" + k0, ...this.planSlots(state, rest, { exclude })];


while (slots.length >= 3 && out.length < slots.length - 1) out.push(keep + "|" + Math.min(2, out.length) + "|" + (rest[0] === "defi4" ? "defi" : rest[0] || "app"));
return out;
},

oneLesson(state, plan, n) {
const idOf = (e) => String(e).split("|")[0], pend = plan.map(idOf).filter((id) => state.notions[id] && this.lessonDue(state, id));
if (!pend.length) return plan.slice(0, n);

if (this.lessonHold(state)) { const r = plan.filter((e) => !pend.includes(idOf(e))); if (r.length) return r.slice(0, n); }
const keep = this.lessonPick(state, pend), e0 = plan.find((e) => idOf(e) === keep).split("|");
const rest = plan.filter((e) => !pend.includes(idOf(e)));
return [[keep, 1, ...e0.slice(2)].join("|"), ...rest].slice(0, Math.max(1, n - 1));
},

todayFormat(state) {
const today = day();

if (!state.today || state.today.date !== today) state.today = { date: today, f: state.tomorrow && state.tomorrow.date === today && FORMATS[state.tomorrow.f] && !(state.tomorrow.f === "defi" && this.struggling(state))  ? state.tomorrow.f : this.chooseFormat(state) };

if (state.today.f === "defi" && state.placedOn === today) state.today.f = this.chooseFormat(state, ["defi"]);
return state.today.f;
},

tomorrowFormat(state) {
const tm = addDays(day(), 1);
if (!state.tomorrow || state.tomorrow.date !== tm) state.tomorrow = { date: tm, f: this.chooseFormat(state, [], tm) };
return state.tomorrow.f;
},

otherFormat(state) {
const cur = this.todayFormat(state), order = Object.keys(FORMATS);
state.today = { date: day(), f: order[(order.indexOf(cur) + 1) % order.length] };
return state.today.f;
},

logFormat(state, f) {
const today = day();
state.formats = (state.formats || []).filter((x) => x.date >= addDays(today, -30));
if (!state.formats.some((x) => x.date === today && x.f === f)) state.formats.push({ date: today, f });
},


planSlots(state, slots, opts = {}) {
const today = day(), elo = state.elo.r + (state.tadj || 0) , cap = difficultyCap(state.profile), used = new Set(), plan = [], ex = opts.exclude || new Set();
const under = slots.length >= 3 && this.underFloor(state), maxOld = slots.includes("rev") || under ? 2 : 1;
let old = 0;




const need = [...this.oldNeed(state)];
const wantRappel = slots.length > 1 && need.length > 0;
const rappelAt = wantRappel ? slots.length - 1 - Math.floor(Math.random() * Math.min(2, slots.length)) : -1;

const rappel2 = wantRappel && under ? (rappelAt === slots.length - 1 ? slots.length - 2 : slots.length - 1) : -1;

const nowIds = this.nowActive(state) ? state.now.ids.filter((id) => state.notions[id] && ["vu", "encours"].includes(state.notions[id].status)) : [];
const nowK = nowIds.length ? (slots.length === 1 ? 1 : Math.round((slots.length * 2) / 3)) : 0;




const prevPen = !this.nowActive(state) && !this.struggling(state) && !this.eloDrop(state) ? this.prevPenalty(state) : null;
const usedPair = new Set(), cnt = new Map();



const choose = (kind, base, rappel, only, isNow, free) => {
let best = null, pool = only || this.pool(state, base);
if (kind === "rev" && !only) { const due = pool.filter((id) => state.notions[id].due <= today || state.notions[id].m < 0.5); if (due.length) pool = due; }
for (const id of pool) {
if (ex.has(id)) continue;
if (!free && (cnt.get(id) || 0) >= 2) continue;
const s = state.notions[id], recent = this.isRecent(state, id), target = elo + TARGET[kind] + (s.easy || 0) * 120;


if (!isNow && (rappel ? recent : !recent)) continue;
if (kind === "drill" && !this.drillable(state, id)) continue;
let levels = [1, 2, 3].filter((d) => d <= cap && (base !== "defi" || d >= 2) && (kind !== "drill" || d === 1));
if ((kind === "defi4" || kind === "defi") && hasProb(id)) levels.push(4);
if (!recent) levels = this.oldLevels(state, id, levels, target);





if (kind !== "drill" && levels.some((d) => d >= 2) && this.minLevel(state, id) >= 2) levels = levels.filter((d) => d >= 2);
for (const d of levels) {
let sc = Math.abs(itemRating(state.profile, id, d) - target) / 100;
if (rappel) sc = (s.m < 0.45 ? -1 : 0) + Math.max(0, itemRating(state.profile, id, d) - target) / 200;
if (s.due <= today && base !== "defi") sc -= 0.6;
if (kind === "app" || kind === "rev") sc -= (1 - s.m) * 0.8;
if (s.status === "encours") sc -= 0.4;
if (this.prepActive(state) && state.prep.ids.includes(id)) sc -= 1.2;
if (used.has(id)) sc += only ? 0.5 : 2;
if (usedPair.has(id + "|" + d)) sc += 1;
if (d === 4) sc -= kind === "defi4" ? 3 : 0.3;
if (prevPen && !rappel && !isNow && prevPen.has(id)) sc += PREV_PEN;




if (isNow && s.last && s.last < today && s.last >= addDays(today, -2) && (s.box || 0) >= 1) sc += s.last === addDays(today, -1) ? 0.8 : 0.4;
sc += Math.random() * 0.5;
if (!best || sc < best.sc) best = { id, d, sc };
}
}
return best;
};
const nowPart = [];
for (const [si, kind] of slots.entries()) {
const base = kind === "defi4" ? "defi" : kind;
if (si < nowK && si !== rappelAt && si !== rappel2) {
const b = choose(kind, base, false, nowIds, true);
if (b) { used.add(b.id); usedPair.add(b.id + "|" + b.d); cnt.set(b.id, (cnt.get(b.id) || 0) + 1); nowPart.push(b.id + "|" + b.d + "|" + base); continue; }
}
let best = (si === rappelAt || si === rappel2) && old < maxOld ? choose(kind, base, true, need) : null;
if (best) old++; else best = choose(kind, base, false);
if (!best) best = choose(kind, base, true);
if (!best) best = choose(kind, base, false, null, false, true) || choose(kind, base, true, null, false, true);
if (!best) continue;
used.add(best.id); cnt.set(best.id, (cnt.get(best.id) || 0) + 1);
plan.push(best.id + "|" + best.d + "|" + base);
}

return [...nowPart.sort((x, y) => +x.split("|")[1] - +y.split("|")[1]), ...plan];
},



tooEasy(state, id, d, kind) {
this.snap(state);
const s = state.notions[id];
s.easy = Math.min(3, (s.easy || 0) + 1);
s.m = Math.min(1, s.m + (1 - s.m) * 0.25);
s.box = Math.min(5, s.box + 1);
s.due = addDays(day(), INTERVALS[s.box]);
if (s.status === "encours" && s.m > 0.7) s.status = "vu";
const delta = this.updateElo(state, id, d, 1, 0.5);
this.recordComp(state, id, d, 1);

const cap = difficultyCap(state.profile), top = hasProb(id) && kind !== "drill" ? 4 : Math.min(3, cap);
return { delta, next: d < top && d < 4 ? id + "|" + (d + 1) + "|" + (kind === "drill" ? "app" : kind || "app") : null };
},


record(state, id, d, tries, solved, partial) {
this.snap(state);
const s = state.notions[id];
s.fails = (partial !== undefined ? partial < 0.5 : !solved) ? (s.fails || 0) + 1 : solved && tries === 1 ? 0 : s.fails || 0;
if (typeof Badges !== "undefined") Badges.onAnswer(state, id, d, tries, solved, partial);
if (partial !== undefined) {
this.recordComp(state, id, d, partial);
s.seen++;
s.m = Math.min(1, Math.max(0, s.m + (partial - 0.5) * 0.2));
if (partial >= 0.99) { s.box = Math.min(5, s.box + 1); s.ok++; } else if (partial < 0.5) s.box = 0;
s.due = addDays(day(), partial >= 0.99 ? INTERVALS[s.box] : 1);
this.adapt(state, partial >= 0.99 && tries <= 1);
return partial;
}
const today = day();

if (s.lessonSeen && !s.lessonDay) { s.lessonDay = today; s.lessonOk0 = s.ok || 0; s.lessonN0 = s.seen || 0; }
s.seen++;
s.last = today;
if (solved && tries === 1) {
s.m = Math.min(1, s.m + (1 - s.m) * (0.18 + 0.06 * d));
s.box = Math.min(5, s.box + 1);
s.ok++;
} else if (solved) {
s.m = Math.min(1, s.m + (1 - s.m) * 0.06);
} else {
s.m = s.m * 0.6;
s.box = 0;
if (s.easy) s.easy--;
}
s.due = addDays(today, solved && tries === 1 ? INTERVALS[s.box] : 1);
if (s.status === "encours" && s.m > 0.7) s.status = "vu";
const sc = solved ? (tries === 1 ? 1 : 0.5) : 0;
this.adapt(state, sc === 1);
this.recordComp(state, id, d, sc);
this.unlock(state);
return sc;
},

finishDay(state, answered, score) {
const today = day();
if (answered > 0) {
if (typeof Badges !== "undefined") Badges.onDay(state, today);

let joker = false;
if (state.streak.last !== today) {
const wk = this.weekOf(today);
if (state.streak.last === addDays(today, -1)) state.streak.count++;
else if (state.streak.count && state.streak.last === addDays(today, -2) && state.streak.jokerWk !== wk) { state.streak.count++; state.streak.jokerWk = wk; joker = true; }
else state.streak.count = 1;
}
state.streak.last = today;
state.streak.best = Math.max(state.streak.best || 0, state.streak.count);
const h = state.history.find((x) => x.date === today);
if (h) { h.n += answered; h.score += score; } else state.history.push({ date: today, n: answered, score });
state.history = state.history.slice(-120);
return joker ? "joker" : "";
}
return "";
},

weekOf(d) { const x = new Date(d + "T12:00:00"); return addDays(d, -((x.getDay() + 6) % 7)); },

jokerFree(state, today = day()) { return state.streak.jokerWk !== this.weekOf(today); },








isDrill(q) {
if (!q || q.parts || !q.spec || q.fig || q.figure || q.ctx === "erreur" || q.spec.round || q.spec.radical) return false;


if (NO_DRILL.includes(q.id)) return false;
const t = String(q.q || "").replace(/<[^>]+>/g, " ").replace(/\\[()]/g, "").replace(/\s+/g, " ").trim();


if (t.length > 170 || /mets? (?:le problème )?en équation|l'âge|ans de plus|ans de moins|(?:double|triple|quadruple) de (?:l'âge|celui|celle)|arrondi|au dixième|au centième|au millième|à l'unité|près\b|(?<!sans )calculatrice|\\approx|≈|Trouve l'erreur/i.test(t)) return false;
const v = q.spec.value;
const simple = (x) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6 || [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20].some((d) => Math.abs(x * d - Math.round(x * d)) < 1e-9);
if (q.spec.kind === "value" && typeof v === "number" && !simple(v)) return false;
return true;
},
makeDrill(state, id) {
for (let k = 0; k < 15; k++) { let q = null; try { q = this.make(state, id, 1, undefined, true); } catch (e) { return null; } if (this.isDrill(q)) return q; }
return null;
},

drillable(state, id) {
const key = (state.profile.system || "") + (state.profile.track || "") + state.profile.grade + "|" + id;

if (!(key in DRILL_OK)) { let n = 0; for (let k = 1; k <= 8; k++) { let q = null; try { q = this.make(state, id, 1, k * 101); } catch (e) {} if (this.isDrill(q)) n++; } DRILL_OK[key] = n >= 4; }
return DRILL_OK[key];
},
swapLesson(state, plan, i) {
const idOf = (e) => String(e).split("|")[0], k = String(plan[i]).split("|")[2], kind = TARGET[k] !== undefined ? k : "app";
const ex = new Set([...plan.map(idOf), ...this.eligible(state).filter((id) => this.lessonDue(state, id) || !state.notions[id].seen)]);
return this.planSlots(state, [kind], { exclude: ex })[0] || null;
},




easeNext(state, plan, i, id, d) {
const nx = String(plan[i + 1] || "").split("|");
if (!state.notions[nx[0]] || nx[2] === "rem" || String(plan[i + 1]).startsWith("PROB:")) return null;
const feel = (x, dd) => itemRating(state.profile, x, dd) - 200 * ((state.notions[x] || {}).m || 0);
const bar = feel(id, d), kind = nx[2] === "drill" ? "drill" : nx[2] || "app";
if (feel(nx[0], +nx[1] || 1) < bar - 50) return null;
const ok = (x, dd) => GEN[x] && state.notions[x] && ["vu", "encours"].includes(state.notions[x].status) && !this.lessonFirst(state, x) && (kind !== "drill" || (dd === 1 && this.drillable(state, x)));
if (d > 1 && d !== 4 && ok(id, d - 1)) return id + "|" + (d - 1) + "|" + (kind === "drill" ? "app" : kind);
if (d === 4 && ok(id, 2)) return id + "|2|" + kind;
const pre = (PREREQ[id] || []).filter((p) => ok(p, 1) && feel(p, 1) < bar).sort((a, b) => state.notions[a].m - state.notions[b].m)[0];
if (pre) return pre + "|1|rem";
const inPlan = new Set(plan.map((e) => String(e).split("|")[0]));
const best = this.eligible(state).filter((x) => x !== id && !inPlan.has(x) && this.isRecent(state, x) && state.notions[x].seen > 0 && ok(x, 1) && feel(x, 1) < bar - 50)
.sort((a, b) => feel(a, 1) - feel(b, 1))[0];
return best ? best + "|1|" + kind : null;
},










lessonShows(state, plan, j, sess) {
const nid = String(plan[j] || "").split("|")[0];
if (!nid || String(plan[j]).startsWith("PROB:") || !state.notions[nid] || !this.lessonDue(state, nid)) return false;
const S = sess || {};
if (S.noLesson || plan.noLesson || S.fmt === "auto") return false;
return !S.lessonDone && (S.lessonAt == null || S.lessonAt === j);
},
replayNext(state, plan, i, id, d, kind, sess) {
if (!this.struggling(state) || i + 1 >= plan.length || kind === "drill" || !(d >= 1 && d < 4) || !GEN[id] || !state.notions[id]) return null;
const nx = String(plan[i + 1]), nid = nx.split("|")[0];
if (nx.startsWith("PROB:") || (nid !== id && this.lessonShows(state, plan, i + 1, sess))) return null;
return id + "|" + Math.max(1, d - 1) + "|" + (kind === "rem" || kind === "carnet" || !kind ? "app" : kind);
},
remediation(state, id) {
const s = state.notions[id];
if (!s || (s.fails || 0) < 2) return null;
const cands = (PREREQ[id] || []).filter((p) => state.notions[p] && GEN[p]);
if (!cands.length) return null;
s.fails = 0;
return cands.sort((a, b) => state.notions[a].m - state.notions[b].m)[0];
},



nowActive(state) { return !!(state.now && state.now.ids && state.now.ids.length); },

nowStale(state, today = day()) { return this.nowActive(state) && addDays(state.now.since, 7) <= today; },
setNow(state, ids) {
state.now = ids.length ? { ids, since: day() } : null;
for (const id of ids) { const n = state.notions[id]; if (n && n.status !== "vu" && n.status !== "encours") { Object.assign(n, { status: "encours", m: Math.max(0.4, n.m), due: day() }); delete n.retry; } }
},

nowSuggest(state, n = 6) {
const p = state.profile, cur = this.catalog(p).filter((c) => c.current && state.notions[c.id]).sort((a, b) => this.rank(p, a.id) - this.rank(p, b.id));
const open = cur.filter((c) => ["vu", "encours"].includes(state.notions[c.id].status) && !(state.notions[c.id].m >= 0.75 && state.notions[c.id].ok >= 3));
const next = cur.filter((c) => ["avenir", "nonvu"].includes(state.notions[c.id].status));
return [...open.slice(-4), ...next.slice(0, n)].slice(0, n).map((c) => c.id);
},
prepActive(state) { return !!(state.prep && state.prep.ids.length && state.prep.date >= day()); },




minLevel(state, id) {
const s = state.notions[id]; if (!s || this.underFloor(state)) return 1;



return (s.m >= 0.45 || (!s.seen && !s.placed)) && state.elo.r + (state.tadj || 0) >= itemRating(state.profile, id, 2) ? 2 : 1;
},
planPrep(state) {
const ids = state.prep.ids.filter((id) => state.notions[id]);
const order = [...ids].sort((a, b) => state.notions[a].m - state.notions[b].m);
const plan = [];
for (let i = 0; order.length && plan.length < 4; i++) { const id = order[i % order.length]; plan.push(id + "|" + Math.min(3, Math.max(this.difficulty(state, id), this.minLevel(state, id)))); }
return plan;
},




weeklyProblem(state) {
const d = new Date(), week = d.getFullYear() + "-" + Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5);


const worked = (id) => { const s = state.notions[id]; return this.nowHas(state, id) || (s && s.seen > 0 && s.m > 0); };
const ids = this.eligible(state).filter((id) => hasProb(id) && worked(id));
if (!ids.length) return null;


const nowSig = this.nowActive(state) ? state.now.ids.join(",") : "", done = typeof weekKey === "function" && state.weeklyDone === weekKey();
if (state.weeklyPick && state.weeklyPick.week === week && state.weeklyPick.v === 4 && ids.includes(state.weeklyPick.id) && (done || (state.weeklyPick.now || "") === nowSig)) return state.weeklyPick.id;
const r = state.elo.r, m = (id) => (state.notions[id] || {}).m || 0;


const g = state.profile.grade, yr = (id) => { try { const p = placeOf(NOTIONS.find((n) => n.id === id), state.profile); return p ? p[0] : g; } catch (e) { return g; } };


const yearSet = new Set(this.catalog(state.profile).filter((c) => c.current).map((c) => c.id));




const tier = (id) => { const own = yr(id) === g, ch = this.nowHas(state, id); return own && ch ? 0 : own ? 1 : ch ? 2 : yearSet.has(id) ? 3 : 4; };
const score = (id) => { const it = itemRating(state.profile, id, 4), gap = g - yr(id);
return Math.abs(it - (r + 150)) + (it < r ? 150 : 0) + (gap >= 1 ? 250 * gap : 0) + (m(id) < 0.3 ? 400 : 0); };



const real = (id) => { for (let k = 1; k <= 12; k++) { try { const q = this.build(id, 4, k); if (q && q.d === 4 && Array.isArray(q.parts) && q.parts.length >= 2 && !horsCO(state, id, q)) return true; } catch (e) { return false; } } return false; };
let best = [];
for (let t = 0; t <= 4 && !best.length; t++)
for (const id of ids.filter((x) => tier(x) === t).sort((a, b) => score(a) - score(b))) { if (real(id)) best.push(id); if (best.length >= 3) break; }
if (!best.length) return null;
const n = +week.split("-")[1], id = best[n % best.length];
state.weeklyPick = { week, id, v: 4, now: nowSig };
return id;
},

isProvisional(state) { return state.elo.n < 20; },

themeLevels(state) {
const out = {};
for (const [id, s] of Object.entries(state.notions)) {
if (s.status !== "vu" && s.status !== "encours") continue;
const th = NOTIONS.find((n) => n.id === id).theme;
(out[th] = out[th] || []).push(s.m);
}
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length]));
},
};


if (typeof LESSONS !== "undefined") for (const L of Object.values(LESSONS)) if (L && typeof L === "object") { for (const k of ["intro", "regle", "piege"]) if (typeof L[k] === "string") L[k] = colonBreak(L[k]); if (Array.isArray(L.exemple)) L.exemple = L.exemple.map(colonBreak); }
if (typeof ACTIVE !== "undefined") for (const A of Object.values(ACTIVE)) if (A && A.predict) A.predict.why = colonBreak(A.predict.why);





(function () {
const plan0 = Engine.planSession, one0 = Engine.oneLesson, P = () => (typeof PRIM !== "undefined" ? PRIM : null);


Engine.planSession = function (state, format) { const p = plan0.call(this, state, format), X = P(); if (X) X.note(state); return X ? (state.placedOn === day() ? X.strip(p) : X.inject(state, X.vary(state, X.strip(p)))) : p; };
Engine.oneLesson = function (state, plan, n) { const X = P(); return X ? X.inject(state, X.vary(state, one0.call(this, state, X.strip(plan), n))) : one0.call(this, state, plan, n); };
})();









const Parents = {
KEY: "m2m-parents",
OLD: 10,
cur: null,
load() {
try { const x = JSON.parse(localStorage.getItem(this.KEY) || "null"); if (x && Array.isArray(x.kids)) return x; } catch (e) {}
return { kids: [], last: null };
},
store(x) { try { localStorage.setItem(this.KEY, JSON.stringify(x)); return true; } catch (e) { return false; } },
url(code) { return location.origin + location.pathname + "#parent=" + code; },
newId() { return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); },
fmt(d) { return d.slice(8, 10) + "." + d.slice(5, 7) + "." + d.slice(0, 4); },


async open(code) {
const raw = await Backup.read(code);
if (!raw || raw.v !== 1 || !raw.p) throw new Error("code");
if (typeof window.ensurePacks === "function") { try { await window.ensurePacks(raw.p); } catch (e) {} }
return { raw, s: Backup.unpack(raw, raw.t || day()) };
},
label(id) { const n = typeof NOTIONS !== "undefined" && NOTIONS.find((x) => x.id === id); return (n && n.label) || ""; },

problem(code) {
let q = null;
try { q = Engine.fromCode(code); } catch (e) { q = null; }
if (!q) return null;
const n = NOTIONS.find((x) => x.id === q.id), y = (n && n.CH && n.CH[0]) || 12;
q = Engine.finalize({ profile: { system: "CH", grade: y } }, q.id, q);
return q;
},

week(s, t) {
const w = Engine.week(s, t), lim = addDays(t, -6);
const dates = new Set((s.history || []).filter((x) => x && x.n > 0 && x.date >= lim && x.date <= t).map((x) => x.date));
const days = [...Array(7)].map((_, i) => addDays(t, i - 6)).map((d) => ({ d, on: dates.has(d) }));
const ids = [];
for (const [cid, r] of Object.entries(s.comps || {})) { const id = cid.split(":")[0]; if (r && r.last && r.last >= lim && r.last <= t && !ids.includes(id) && this.label(id)) ids.push(id); }
const now = (s.now && Array.isArray(s.now.ids) ? s.now.ids : []).filter((id) => this.label(id));
let fete = null;
if (w.cons.length) fete = { ic: "🏅", txt: "Une notion maîtrisée : <b>" + esc(this.label(w.cons[0]) || "") + "</b>" + (w.cons.length > 1 ? " (et " + (w.cons.length - 1) + " autre" + (w.cons.length > 2 ? "s" : "") + ")" : "") + "." };
else if (w.fixed) fete = { ic: "📕", txt: w.fixed + " erreur" + (w.fixed > 1 ? "s" : "") + " de son carnet " + (w.fixed > 1 ? "effacées" : "effacée") + " : réussie" + (w.fixed > 1 ? "s" : "") + " à nouveau du premier coup." };
else if (w.ups.length) fete = { ic: "📈", txt: "Un progrès en <b>" + esc(w.ups[0].label) + "</b>." };
else if (w.days) fete = { ic: "💪", txt: w.days + " jour" + (w.days > 1 ? "s" : "") + " de pratique : c'est l'effort qui compte." };
return { days, n: w.days, ids: ids.slice(0, 4), more: Math.max(0, ids.length - 4), now: now.slice(0, 3), fete };
},

curious(s, t) {
if (typeof Curieux === "undefined") return null;
const av = Curieux.available(s); if (!av.length) return null;
const wk = Math.floor(new Date(t + "T12:00:00") / 6048e5);
return Curieux.build(av[wk % av.length].key, (wk % 9000) + 1);
},
story(t, s) {
if (typeof HISTOIRE === "undefined" || !HISTOIRE.length) return null;
const L = typeof Histoire !== "undefined" ? HISTOIRE.filter((H) => Histoire.ok(H, s)) : HISTOIRE;
return L.length ? L[Math.floor(new Date(t + "T12:00:00") / 6048e5) % L.length] : null;
},
};


function parentCard() {
return `<div class="card flat stack par-card"><div class="eyebrow">👪 Mes parents</div>
    <p class="small muted">Montre ta semaine à tes parents, et propose-leur de résoudre avec toi un problème qui t'a résisté.</p>
    <button type="button" class="btn-sec" id="parentgo">👪 Envoyer à mes parents</button></div>`;
}
document.addEventListener("click", (e) => { if (e.target && e.target.closest && e.target.closest("#parentgo")) screenParentShare(); });
async function screenParentShare() {
const back = () => { homeTab = "prog"; screenHome(); };
if (!state) return;
if (!state.pid) { state.pid = Parents.newId(); save(); }
h(`${brand}<h2>Envoyer à <span class="mark">mes parents</span></h2><p class="muted">Préparation du lien…</p>`);
let code = null;
try { code = await Backup.encode(state); } catch (e) { code = null; }
if (!code) { h(`${brand}<div class="card flat"><p>Impossible de créer le lien sur ce navigateur.</p></div><button class="btn-primary btn-big" id="pback">Retour</button>`); document.getElementById("pback").onclick = back; return; }
const url = Parents.url(code), qr = url.length <= 2000 && typeof QR !== "undefined" ? QR.svg(url) : "";
const nC = Math.min(3, (state.carnet || []).length);
h(`${brand}<h2>Envoyer à <span class="mark">mes parents</span></h2>
  <p class="muted">Tes parents recevront un lien. Il s'ouvre sur leur téléphone, sans compte. Rien n'est gardé sur un serveur : tout est dans le lien.</p>
  <div class="card flat stack par-see"><b>👀 Ce qu'ils verront</b><ul class="plain par-list">
    <li>✅ Combien de jours tu t'es entraîné·e cette semaine</li>
    <li>✅ Les notions que tu as travaillées (leur nom, pas tes résultats)</li>
    <li>✅ Une réussite à fêter</li>
    <li>✅ ${nC ? (nC > 1 ? nC + " problèmes de ton carnet d'erreurs, pour les résoudre" : "1 problème de ton carnet d'erreurs, pour le résoudre") + " avec toi (avec des indices, pas la réponse d'abord)" : "Ton carnet d'erreurs est vide : pas de problème à résoudre ensemble"}</li>
    <li>✅ Une question curieuse à faire en famille, et des conseils pour t'aider</li></ul>
    <b>🙈 Ce qu'ils ne verront pas</b><ul class="plain par-list">
    <li>✖ Ton Mathélo ni tes notes de compétences</li>
    <li>✖ La liste de toutes tes erreurs, ni tes réponses</li>
    <li>✖ Les heures où tu t'entraînes</li></ul>
    <p class="small muted">Ils ne peuvent rien changer à ta progression. Le lien montre ta semaine d'aujourd'hui : renvoie-en un nouveau la semaine prochaine.</p></div>
  <div class="row par-row">${navigator.share ? '<button class="btn-primary" id="pshare">📤 Envoyer le lien</button>' : ""}<button class="${navigator.share ? "btn-sec" : "btn-primary"}" id="pcopy">Copier le lien</button></div>
  <span class="small muted" id="pmsg"></span>
  ${qr ? `<details class="card flat par-qr"><summary>Montrer un QR code</summary><p class="small muted">Ton parent le scanne avec l'appareil photo de son téléphone.</p><div class="qrwrap">${qr}</div></details>` : ""}
  <button class="btn-ghost" id="ppreview">Voir la page de mes parents</button>
  <button class="btn-primary btn-big" id="pback">Retour</button>`);
const $ = (x) => document.getElementById(x), msg = $("pmsg");
if ($("pshare")) $("pshare").onclick = () => navigator.share({ title: "Ma semaine de maths", text: "Ma semaine sur " + APP_NAME + " (ouvre ce lien) :", url }).catch(() => {});
$("pcopy").onclick = async () => { try { await navigator.clipboard.writeText(url); msg.textContent = "Lien copié : colle-le dans un message à tes parents."; } catch (e) { msg.textContent = "Copie impossible ici : utilise le QR code."; } };
$("ppreview").onclick = () => screenParentView(null, { code, preview: true, back: () => screenParentShare() });
$("pback").onclick = back;
}



function parentRoute() {
const m = /^#parent(?:=(.+))?$/.exec(location.hash);
if (!m) return false;
if (m[1]) parentImport(m[1]); else screenParentView(null);
return true;
}
const parExit = () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };
async function parentImport(code) {
h(`${brand}<div class="eyebrow">👪 Espace parent</div><p class="muted">Ouverture…</p>`);
let o;
try { o = await Parents.open(code); } catch (e) {
h(`${brand}<div class="eyebrow">👪 Espace parent</div><div class="card flat stack"><h3>Ce lien est incomplet</h3><p class="small muted">Il a peut-être été coupé en le copiant. Demandez à votre enfant de vous le renvoyer depuis l'app : Progrès → « 👪 Envoyer à mes parents ».</p></div><button class="btn-primary btn-big" id="pxback">Retour</button>`);
document.getElementById("pxback").onclick = () => (Parents.load().kids.length ? (history.replaceState(null, "", "#parent"), screenParentView(null)) : parExit());
return;
}
code = String(code).trim().replace(/^.*#(r|parent)=/, "").replace(/\s+/g, "");
const L = Parents.load(), t = o.raw.t || day(), pid = o.raw.pid || null;
const known = pid && L.kids.find((k) => k.pid === pid);
const done = (kid, msg) => { history.replaceState(null, "", "#parent"); L.last = kid.id; Parents.store(L); screenParentView(kid.id); if (msg) toast(msg, 3500); };
if (known) {
if (known.t && known.t > t) return done(known, "Vous aviez déjà une photo plus récente de " + known.nick + " : elle est gardée.");
Object.assign(known, { code, t, got: day() });
return done(known, "Semaine de " + known.nick + " mise à jour.");
}

const others = L.kids.filter((k) => !pid || !k.pid);
h(`${brand}<div class="eyebrow">👪 Espace parent</div><h2>La semaine de <span class="mark">votre enfant</span></h2>
  <div class="card flat stack"><label for="pnick"><b>Comment l'appelez-vous ?</b></label>
    <span class="small muted">Un prénom ou un surnom. Il reste sur ce téléphone et n'est envoyé nulle part.</span>
    <input id="pnick" class="par-input" maxlength="24" autocomplete="off" placeholder="Prénom ou surnom">
    <button class="btn-primary" id="pnew">Voir sa semaine</button></div>
  ${others.length ? `<div class="card flat stack"><b>C'est un enfant déjà enregistré ?</b><span class="small muted">Ce nouveau lien remplacera son ancienne photo.</span><div class="row par-kids">${others.map((k) => `<button type="button" class="btn-sec" data-kid="${k.id}">${esc(k.nick)}</button>`).join("")}</div></div>` : ""}`);
const nick = document.getElementById("pnick");
const add = () => { const v = nick.value.trim().slice(0, 24) || "Mon enfant"; const kid = { id: Parents.newId(), pid, nick: v, code, t, got: day() }; L.kids.push(kid); done(kid); };
document.getElementById("pnew").onclick = add;
nick.onkeydown = (e) => { if (e.key === "Enter") add(); };
app.querySelectorAll("[data-kid]").forEach((b) => (b.onclick = () => { const k = L.kids.find((x) => x.id === b.dataset.kid); if (k.t && k.t > t) return done(k, "Vous aviez déjà une photo plus récente : elle est gardée."); Object.assign(k, { code, t, got: day(), pid: pid || k.pid || null }); done(k, "Semaine de " + k.nick + " mise à jour."); }));
}

async function screenParentView(id, opt = {}) {
const L = Parents.load();
let kid = null, code = opt.code;
if (!opt.preview) {
kid = L.kids.find((k) => k.id === id) || L.kids.find((k) => k.id === L.last) || L.kids[0];
if (!kid) return screenParentEmpty();
code = kid.code;
if (L.last !== kid.id) { L.last = kid.id; Parents.store(L); }
}
h(`${brand}<div class="eyebrow">👪 Espace parent</div><p class="muted">Ouverture…</p>`);
let o;
try { o = await Parents.open(code); } catch (e) { o = null; }
if (!o) { h(`${brand}<div class="card flat"><p>Ce code ne se lit plus. Demandez un nouveau lien à votre enfant.</p></div><button class="btn-primary btn-big" id="pxback">Retour</button>`); document.getElementById("pxback").onclick = opt.back || parExit; return; }
const { raw, s } = o, t = raw.t || day(), nick = opt.preview ? "votre enfant" : kid.nick, N = esc(opt.preview ? "votre enfant" : kid.nick);
const age = daysBetween(t, day()), W = Parents.week(s, t);
const JR = ["D", "L", "M", "M", "J", "V", "S"];
const reg = W.n >= 4 ? "Belle régularité !" : W.n ? "Un bon début : quelques minutes par jour suffisent." : "Pas de séance cette semaine-là. Proposez-lui le défi du jour ensemble ?";
const pbs = (s.carnet || []).slice().reverse().map((x) => ({ x, q: Parents.problem(x.code) })).filter((p) => p.q).slice(0, 3);
const cur = Parents.curious(s, t), H = Parents.story(t, s);
const tabs = !opt.preview && L.kids.length > 1 ? `<div class="row par-kids" role="tablist">${L.kids.map((k) => `<button type="button" class="${k.id === kid.id ? "btn-primary" : "btn-sec"} small" data-kid="${k.id}" aria-pressed="${k.id === kid.id}">${esc(k.nick)}</button>`).join("")}</div>` : "";
const lessonOf = (qid) => {
const Ls = typeof LESSONS !== "undefined" && LESSONS[qid];
if (!Ls || !Ls.regle) return "";
const ex = Array.isArray(Ls.exemple) ? Ls.exemple[0] : Ls.exemple;
return `<details class="par-fold"><summary>📘 Rappel de cours : ${Ls.titre}</summary><div class="small"><p>${Ls.intro || ""}</p><p>${Ls.regle}</p>${ex ? `<p class="muted">Exemple : ${ex}</p>` : ""}</div></details>`;
};
const STEPS = pbs.map((p) => (p.q.guide && p.q.guide.length ? p.q.guide.map((g) => `<div>${g.ask}</div>${g.sol ? `<details class="par-fold"><summary class="small">Réponse de cette étape</summary><div class="small">${g.sol}</div></details>` : ""}`) : (splitSol(p.q.sol) || []).map((t2) => `<div>${t2}</div>`)));
const pbHtml = (p, i) => {
const q = p.q, x = p.x, lab = Parents.label(q.id);
const steps = STEPS[i];
const trap = x.m ? `<div class="par-diag"><b>🔎 Ce que l'app a repéré</b><div class="small">${escT(x.m)}</div></div>` : (q.traps && q.traps[0] && q.traps[0].m ? `<div class="par-diag"><b>🔎 Un piège fréquent ici</b><div class="small">${escT(q.traps[0].m)}</div></div>` : "");
return `<details class="card flat stack par-pb" ${i === 0 ? "open" : ""}><summary><b>Problème ${i + 1}</b>${lab ? ` · <span class="small">${esc(lab)}</span>` : ""}</summary>
      <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
      ${q.parts ? `<ol class="small">${q.parts.map((pp) => `<li>${pp.label}</li>`).join("")}</ol>` : ""}
      <div class="par-step"><b>1. Commencez par lui demander</b><ul class="plain par-list small"><li>« Qu'est-ce qu'on cherche ? »</li><li>« Qu'est-ce que tu sais déjà, dans l'énoncé ? »</li><li>« Tu peux m'expliquer comment tu t'y es pris·e ? »</li></ul></div>
      ${steps.length ? `<div class="par-step"><b>2. Des indices, un à la fois</b><span class="small muted">Dévoilez une étape seulement si ${N} bloque.</span><div class="par-hints" data-n="0"></div><button type="button" class="btn-sec small par-next" data-pb="${i}">Indice suivant (1 sur ${steps.length})</button></div>` : ""}
      ${trap}
      ${lessonOf(q.id)}
      <details class="par-fold par-sol"><summary>🔑 La solution complète (pour vous)</summary><div class="sol">${q.sol}</div></details>
      <p class="small muted">Ensuite, ${N} refait ce problème dans l'app, avec d'autres nombres (Carnet d'erreurs) : deux réussites de suite l'effacent.</p></details>`;
};
h(`${brand}<div class="eyebrow">👪 Espace parent${opt.preview ? " · aperçu" : ""}</div>${tabs}
  <h2>La semaine de <span class="mark">${N}</span></h2>
  <p class="small muted">Photo du ${Parents.fmt(t)}${s.profile && SYSTEMS[s.profile.system] ? " · " + esc(gradeName(s.profile)) : ""} · lecture seule</p>
  ${age > Parents.OLD ? `<div class="card flat par-old"><b>⏳ Cette photo date de ${age} jours.</b><p class="small">Demandez à ${N} de vous renvoyer un lien : dans l'app, Progrès → « 👪 Envoyer à mes parents ».</p></div>` : ""}
  ${opt.preview ? `<div class="card flat par-old"><b>Aperçu</b><p class="small">Voici exactement ce que verront tes parents.</p></div>` : ""}
  <div class="card stack par-week"><div class="eyebrow">📅 Sa semaine</div>
    <div class="par-days" aria-label="${W.n} jours de pratique sur 7">${W.days.map((d) => `<span class="${d.on ? "on" : ""}" title="${Parents.fmt(d.d)}">${JR[new Date(d.d + "T12:00:00").getDay()]}</span>`).join("")}</div>
    <p><b>${W.n} jour${W.n > 1 ? "s" : ""} de pratique sur 7.</b> ${reg}</p>
    ${W.ids.length ? `<div><b>Ce qui a été travaillé</b><ul class="plain par-list small">${W.ids.map((x) => `<li>• ${esc(Parents.label(x))}</li>`).join("")}${W.more ? `<li class="muted">et ${W.more} autre${W.more > 1 ? "s" : ""}</li>` : ""}</ul></div>` : ""}
    ${W.now.length ? `<p class="small">📚 En classe en ce moment : ${W.now.map((x) => esc(Parents.label(x))).join(" · ")}</p>` : ""}
    ${W.fete ? `<div class="par-fete"><span>${W.fete.ic}</span><div><b>À fêter</b><div class="small">${W.fete.txt}</div></div></div>` : ""}
  </div>
  <div class="stack par-solve"><div class="eyebrow">🤝 Résoudre ensemble</div>
    ${pbs.length ? `<p class="small muted">${pbs.length > 1 ? "Des problèmes" : "Un problème"} qui ${pbs.length > 1 ? "ont" : "a"} résisté à ${N}. Pas besoin d'être fort en maths : posez des questions, laissez expliquer, les indices sont là.</p>${pbs.map(pbHtml).join("")}`
: `<div class="card flat"><p class="small">Son carnet d'erreurs est vide : bravo ! Rien à résoudre ensemble cette semaine.</p></div>`}
  </div>
  ${cur || H ? `<div class="card stack par-fun"><div class="eyebrow">🎲 À faire ensemble</div>
    ${cur ? `<h3>${cur.titre}</h3><div class="qtext">${cur.q}</div>${cur.fig ? `<div class="figwrap">${cur.fig}</div>` : ""}<p><b>Chacun parie :</b> ${cur.bet.q}</p><div class="par-bets">${cur.bet.choices.map((c) => `<span>${c}</span>`).join("")}</div>
      <details class="par-fold"><summary>Le fin mot (après les paris)</summary><div class="sol">${cur.reveal}</div></details>` : ""}
    ${H ? `<details class="par-fold"><summary>📜 Une histoire à lui raconter : ${H.titre}</summary><div class="small"><p>${H.txt}</p></div></details>` : ""}
  </div>` : ""}
  <div class="card flat stack par-tips"><div class="eyebrow">💡 Pour l'accompagner</div><ul class="plain par-list small">
    <li><b>Valorisez l'effort</b>, pas le résultat : « Tu t'es entraîné·e 4 jours, bravo. »</li>
    <li><b>Laissez ${N} expliquer</b> : c'est en expliquant qu'on comprend.</li>
    <li><b>Ne donnez pas la réponse</b> : un indice, une question, puis on attend.</li></ul></div>
  ${opt.preview ? `<button class="btn-primary btn-big" id="pxback">Retour</button>` : `<div class="card flat stack par-manage"><b>Sur ce téléphone</b>
    <span class="small muted">Rien n'est envoyé sur Internet : la page lit le lien reçu. Chaque semaine, ${N} peut vous renvoyer un nouveau lien depuis l'app (Progrès → « 👪 Envoyer à mes parents »).</span>
    <details class="par-fold"><summary>Coller un lien reçu</summary><textarea class="code-box" id="ppaste" rows="3" placeholder="https://…#parent=…"></textarea><button type="button" class="btn-sec small" id="ppgo">Ouvrir</button></details>
    <div class="row par-row"><button type="button" class="btn-ghost small" id="pren">Renommer</button><button type="button" class="btn-ghost small" id="pdel">Retirer ${N} de ce téléphone</button></div></div>
    <button class="btn-primary btn-big" id="pxback">Quitter l'espace parent</button>`}`);
pageQ = "page-parent";
const $ = (x) => document.getElementById(x);
app.querySelectorAll(".par-next").forEach((b) => (b.onclick = () => {
const i = +b.dataset.pb, box = b.parentNode.querySelector(".par-hints"), n = +box.dataset.n, S = STEPS[i];
if (n >= S.length) return;
box.insertAdjacentHTML("beforeend", `<div class="par-hint pop"><span class="small muted">Étape ${n + 1}</span>${S[n]}</div>`);
box.dataset.n = n + 1; typeset(box.lastElementChild);
if (n + 1 >= S.length) b.remove(); else b.textContent = "Indice suivant (" + (n + 2) + " sur " + S.length + ")";
}));
app.querySelectorAll(".par-kids [data-kid]").forEach((b) => (b.onclick = () => screenParentView(b.dataset.kid)));
$("pxback").onclick = opt.back || parExit;
if (opt.preview) return;
$("ppgo").onclick = () => { const v = $("ppaste").value.trim(); if (v) parentImport(v); };
$("pren").onclick = () => { const v = (prompt("Nouveau surnom :", kid.nick) || "").trim().slice(0, 24); if (!v) return; const L2 = Parents.load(), k = L2.kids.find((x) => x.id === kid.id); if (k) { k.nick = v; Parents.store(L2); } screenParentView(kid.id); };
$("pdel").onclick = () => { if (!confirm("Retirer " + nick + " de ce téléphone ? (Rien ne change dans l'app de votre enfant.)")) return; const L2 = Parents.load(); L2.kids = L2.kids.filter((x) => x.id !== kid.id); if (L2.last === kid.id) L2.last = null; Parents.store(L2); screenParentView(null); };
}
function screenParentEmpty() {
h(`${brand}<div class="eyebrow">👪 Espace parent</div><h2>Accompagner <span class="mark">sans surveiller</span></h2>
  <div class="card flat stack"><p>Votre enfant vous envoie un lien depuis l'app : Progrès → « 👪 Envoyer à mes parents ». En l'ouvrant, vous voyez sa semaine, un problème à résoudre ensemble et une activité à faire en famille.</p>
  <p class="small muted">Pas de compte, rien n'est envoyé sur Internet : tout est dans le lien, et reste sur ce téléphone.</p>
  <label for="ppaste"><b>Vous avez reçu un lien ?</b></label><textarea class="code-box" id="ppaste" rows="3" placeholder="https://…#parent=…"></textarea><button type="button" class="btn-primary" id="ppgo">Ouvrir</button></div>
  <button class="btn-ghost" id="pxback">Retour</button>`);
document.getElementById("ppgo").onclick = () => { const v = document.getElementById("ppaste").value.trim(); if (v) parentImport(v); };
document.getElementById("pxback").onclick = parExit;
}

