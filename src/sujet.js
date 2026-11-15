// Sujet de préparation (14.11, demande de l'utilisateur) : dans l'onglet Test, un sujet pour s'entraîner avant
// un test — ce n'est PAS une évaluation (pas de note, l'enseignant ne voit rien). Structure proche d'une vraie
// évaluation : A. automatismes, B. exercices progressifs (a, b, c) par notion, C. raisonnement (problème et
// « Vrai ou faux ? Justifie »). Imprimable (ou PDF). Puis un corrigé où l'élève se corrige lui-même : chaque
// question cochée juste / à moitié / faux met à jour ses compétences ; le bilan dit quoi retravailler.
// Reproductible : state.mock = { date, ids, items: [{ part, ex, id, d, seed, vf }], done }.

const mockSeed = () => Math.floor(Math.random() * 46655) + 1;

// Niveaux du sujet (14.11) : facile, standard, exigeant.
const MOCK_LV = {
  facile: { label: "Facile", A: 1, B: (n) => [1, 2], vf: 1, prob: false },
  standard: { label: "Standard", A: 1, B: (n) => (n <= 2 ? [1, 2, 3] : [2, 3]), vf: 2, prob: true },
  exigeant: { label: "Exigeant", A: 2, B: (n) => (n <= 2 ? [2, 3, 4] : [3, 4]), vf: 3, prob: true },
};
// Sujet de qualité (15.11, « pas seulement du drill ») : si le chapitre révisé a sa banque d'exercices riches
// (riche.js), le sujet ressemble à un vrai test : A. automatismes courts, B. trois exercices en situation
// (questions liées, donnée inutile, estimation, interprétation), C. raisonnement (trouve l'erreur, vrai ou faux, deux méthodes).
function richPlan(ch, ids, level) {
  const C = RICH[ch], items = [], mine = C.ids.filter((id) => ids.includes(id));
  const dA = { facile: [1, 1, 1, 1], standard: [1, 2, 1, 2], exigeant: [2, 2, 3, 2] }[level] || [1, 2, 1, 2];
  dA.forEach((d, k) => items.push({ part: "A", id: mine[k % mine.length], d, seed: mockSeed() }));
  const lvOk = { facile: (l) => l <= 2, standard: () => true, exigeant: (l) => l >= 2 }[level] || (() => true);
  const probe = (arr, kind) => arr.map((f, k) => { R.seed(1); const x = f(); return { k, id: x.id, lv: x.lv, kind }; });
  let ex = probe(C.ex, "ex").filter((x) => lvOk(x.lv));
  R.seed(mockSeed()); // tirage des exercices : un sujet différent à chaque fois
  const inIds = ex.filter((x) => ids.includes(x.id));
  if (inIds.length >= 3) ex = inIds;
  shuffle(ex).slice(0, 3).forEach((x, j) => items.push({ part: "B", ex: j, rich: ch, kind: "ex", k: x.k, id: x.id, d: 3, seed: mockSeed() }));
  shuffle(probe(C.raison, "raison")).slice(0, 2).forEach((x) => items.push({ part: "C", rich: ch, kind: "raison", k: x.k, id: x.id, d: 3, seed: mockSeed() }));
  return items;
}
function mockPlan(ids, level = "standard") {
  const ch = typeof richChapter === "function" && richChapter(ids);
  if (ch) return richPlan(ch, ids, level);
  const L = MOCK_LV[level] || MOCK_LV.standard, items = [], n = ids.length;
  // A. Automatismes : une question courte par notion, 5 au plus.
  ids.slice(0, 5).forEach((id) => items.push({ part: "A", id, d: L.A, seed: mockSeed() }));
  // B. Exercices : un par notion (4 au plus), sous-questions de difficulté croissante (4 = défi).
  ids.slice(0, 4).forEach((id, ex) => L.B(n).forEach((d) => items.push({ part: "B", ex, id, d: d === 4 && typeof hasProb === "function" && hasProb(id) ? 3 : d, seed: mockSeed() })));
  // C. Raisonnement : « Vrai ou faux ? Justifie » (1 ou 2) et un problème en plusieurs étapes si la notion en a un.
  ids.slice(0, n >= 3 ? 2 : 1).forEach((id, k) => items.push({ part: "C", id: ids[(k + 1) % n], d: L.vf, seed: mockSeed(), vf: true }));
  const pid = L.prob && ids.find((id) => typeof hasProb === "function" && hasProb(id));
  if (pid) items.push({ part: "C", id: pid, d: 4, seed: mockSeed() });
  return items;
}

// Valeur affichable (entier, décimal, fraction) ; null si la réponse n'est pas un nombre simple.
function mockShow(v) {
  if (!isFinite(v)) return null;
  if (Math.abs(v * 1e6 - Math.round(v * 1e6)) < 1e-6) return dec(+v.toFixed(6));
  for (let d = 2; d <= 60; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return frac(n, d); }
  return null;
}
// « Vrai ou faux ? » : la valeur annoncée est juste une fois sur deux (selon la graine), sinon une erreur plausible.
function mockVF(it, q) {
  const sp = q.spec || {};
  if (sp.kind !== "value" || sp.round || mockShow(sp.value) === null) return null;
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
function mockQuestions() {
  return state.mock.items.map((it) => {
    if (it.rich && RICH[it.rich]) { R.seed(it.seed); const q = RICH[it.rich][it.kind === "raison" ? "raison" : "ex"][it.k](); return { ...it, id: q.id, q, pts: q.pts }; }
    let q = Engine.make(state, it.id, it.d, it.seed);
    if (it.vf) { const f = mockVF(it, q); if (f) q = f; else it = { ...it, vf: false }; }
    return { ...it, q, pts: q.parts ? 2 * q.parts.length : it.vf ? 2 : it.part === "A" ? it.d : Math.min(it.d, 4) };
  });
}
function mockNew(level) {
  level = level || (state.mock && state.mock.level) || "standard";
  state.mock = { date: day(), ids: state.prep.ids.slice(), level, items: mockPlan(state.prep.ids, level), done: null };
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
  <h2>Je m'entraîne pour mon test</h2><p class="small muted">${state.prep.ids.map(nLabel).join(" · ")} · niveau ${MOCK_LV[state.mock.level || "standard"].label.toLowerCase()}</p></div>
  <div class="seg no-print" id="mlv">${Object.entries(MOCK_LV).map(([k, v]) => `<button type="button" data-lv="${k}" aria-pressed="${(state.mock.level || "standard") === k}">${v.label}</button>`).join("")}</div>
  <div class="card flat"><p class="small">Pour t'entraîner avant ton test. <b>Ce n'est pas une évaluation</b> : il n'y a pas de note, et personne d'autre que toi ne voit le résultat. Fais-le sur une feuille, sans regarder tes cours, puis corrige-toi avec le corrigé.</p></div>
  <section class="mock-part"><h3>A. Automatismes</h3>${A.map((x) => qHtml(x, "Question " + ++num)).join("")}</section>
  <section class="mock-part"><h3>B. Exercices</h3>${exs.map((e, k) => { const L = B.filter((x) => x.ex === e); num++; return `<div class="mock-ex"><h4>Exercice ${k + 1} · ${L[0].q.titre || nLabel(L[0].id)}</h4>${L.map((x, j) => qHtml(x, x.q.titre ? "" : String.fromCharCode(97 + j) + ")")).join("")}</div>`; }).join("")}</section>
  ${C.length ? `<section class="mock-part"><h3>C. Raisonnement</h3>${C.map((x) => qHtml(x, x.q.titre || (x.q.parts ? "Problème" : "Vrai ou faux ?"))).join("")}</section>` : ""}
  <div class="stack no-print">
    <button class="btn-primary btn-big" id="corr">J'ai fini : voir le corrigé</button>
    <div class="row"><button id="print">🖨 Imprimer / PDF</button><button class="btn-ghost" id="again">Un autre sujet</button><button class="btn-ghost" id="back">Retour</button></div>
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
  <div class="mock-list">${qs.map((x, i) => `${i === 0 || qs[i - 1].part !== x.part ? `<h3>${partName[x.part]}</h3>` : ""}<div class="mock-q card flat"><div class="spread"><b>${x.q.titre ? x.q.titre : x.part === "B" ? "Exercice · " + nLabel(x.id) : x.vf ? "Vrai ou faux ?" : x.q.parts ? "Problème" : "Question"}</b></div>
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
    Badges.check(state); save();
    screenMockResult(cnt, marks.length, ok, weak);
  };
}

// Pas de points (15.11) : un barème donnerait une fausse idée de l'importance des notions ; on compte les questions.
function screenMockResult(cnt, n, ok, weak) {
  h(`${brand}<div class="eyebrow">Sujet de préparation · bilan</div><h2>Où tu en es</h2>
  <div class="card stack"><p><b>${cnt.juste}</b> question${cnt.juste > 1 ? "s" : ""} juste${cnt.juste > 1 ? "s" : ""} sur ${n}${cnt.partie ? ` · <b>${cnt.partie}</b> en partie` : ""}${cnt.faux ? ` · <b>${cnt.faux}</b> à revoir` : ""}</p><p class="small muted">Ce n'est pas une note : c'est pour savoir quoi travailler d'ici ton test.</p></div>
  ${ok.length ? `<div class="card flat"><h3>✓ Acquis</h3><ul>${ok.map((id) => `<li>${nLabel(id)}</li>`).join("")}</ul></div>` : ""}
  ${weak.length ? `<div class="card flat stack"><h3>À retravailler</h3><ul>${weak.map((id) => `<li>${nLabel(id)}</li>`).join("")}</ul>
    <button class="btn-primary" id="rev">Réviser ces notions maintenant</button></div>` : '<div class="card flat"><p>Tout est juste : bravo ! Une séance de révision par jour suffit jusqu\'au test.</p></div>'}
  <div class="row"><button id="again">Un autre sujet</button><button class="btn-ghost" id="home">Retour à l'accueil</button></div>`);
  if (cnt.juste >= 0.8 * n) burst();
  if (document.getElementById("rev")) document.getElementById("rev").onclick = () => {
    session = { plan: weak.flatMap((id) => [id + "|2", id + "|3"]), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true };
    nextQuestion();
  };
  document.getElementById("again").onclick = () => { mockNew(); screenMock(); };
  document.getElementById("home").onclick = () => { homeTab = "test"; screenHome(); };
}
