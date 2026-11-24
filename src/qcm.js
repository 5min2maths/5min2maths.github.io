// Autoévaluation + test rapide (21.11) : reprise de la page « Autoévaluation » des champs d'évaluation de l'utilisateur.
// 1. Grille « Je sais… » : une ligne par compétence du test (au plus 8), l'élève coche ✓ / ~ / ✗ (colonne Avant).
// 2. Test rapide : une question à choix par compétence ; les mauvaises réponses sont les erreurs typiques des
//    générateurs (q.traps), et l'app dit laquelle l'élève a faite.
// 3. Grille finale : Avant et Résultat côte à côte ; « tu pensais savoir » → à revoir en priorité.
// 4. Avant / Après : la grille est gardée (state.autotest) ; refaire le test remplit la colonne Après.
// Ce n'est pas une note ; les compétences sont mises à jour (juste = 1, faux = 0).
const AT_MAX = 8; // au plus 8 lignes, sauf si le test compte plus de 8 notions (une ligne chacune)

// Écriture d'une valeur proposée : comme l'élève l'écrirait (entier, décimal, fraction, multiple de π, racine).
function qcmFmt(v, spec, text) {
  const thou = (n) => { const s = String(Math.abs(n)); return (n < 0 ? "-" : "") + (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : s); };
  const ratio = (x, maxD = 60) => { for (let d = 1; d <= maxD; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; };
  const fr = ([n, d]) => (d === 1 ? thou(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}");
  // Notation scientifique exigée : a · 10^n avec 1 ≤ a < 10.
  if (spec.sci && v !== 0) { const e = Math.floor(Math.log10(Math.abs(v)) + 1e-12), a = +(v / 10 ** e).toPrecision(10); return (Math.abs(v) >= 1 && Math.abs(v) < 10) ? String(+v.toPrecision(10)).replace(".", "{,}") : String(a).replace(".", "{,}") + " \\cdot 10^{" + e + "}"; }
  if (Number.isInteger(v) || Math.abs(v - Math.round(v)) < 1e-9) return thou(Math.round(v));
  if (spec.round) { const k = Math.max(0, Math.round(-Math.log10(spec.round))); return String((+v.toFixed(k))).replace(".", "{,}"); }
  const wantFrac = /sous forme (de|d'une) fraction|fraction irréductible|en fraction|\(fraction/i.test(text || "");
  // Décimal fini (jusqu'à 4 décimales) : écrit en décimal, sauf si l'énoncé demande une fraction.
  if (!wantFrac && Math.abs(v - +v.toFixed(6)) < 1e-9) return String(+v.toFixed(6)).replace(".", "{,}");
  const q = ratio(v, wantFrac ? 1000 : 60);
  const term = q && ((d) => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; })(q[1]);
  if (q && (wantFrac || !term)) return fr(q);
  if (term) return String(+v.toFixed(6)).replace(".", "{,}");
  const p = ratio(v / Math.PI, 12);
  if (p) return (p[0] === 1 && p[1] === 1 ? "" : p[1] === 1 ? thou(p[0]) : fr(p)) + "\\pi";
  // a√b (b sans facteur carré), écrit \frac{a√b}{c} quand il y a un dénominateur.
  const sqf = (n) => { for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false; return true; };
  for (let b = 2; b <= 300; b++) {
    if (!sqf(b)) continue;
    const a = ratio(v / Math.sqrt(b), 24); if (!a || Math.abs(a[0]) > 200) continue;
    const [n, d] = a, sg = n < 0 ? "-" : "", num = (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\sqrt{" + b + "}";
    return sg + (d === 1 ? num : "\\frac{" + num + "}{" + d + "}");
  }
  return "\\approx " + String(+v.toFixed(2)).replace(".", "{,}");
}

// Un piège s'écrit sous la même forme que la bonne réponse (commentaire de relecture du 21.11 : « 3√34/10 » à côté
// de « 1,2 » se repère sans calculer) : décimal arrondi au centième si la réponse est décimale, fraction si elle est une fraction.
function qcmLike(v, good, q) {
  const f = qcmFmt(v, q.spec, q.q), plain = /^-?[\d']+(\{,\}\d+)?$/;
  // Valeur approchée : tous les choix en « ≈ » au centième, sinon le seul « ≈ » (ou le seul sans) se repère.
  if (/^\\approx/.test(good)) return /^\\approx/.test(f) ? f : "\\approx " + String(+v.toFixed(2)).replace(".", "{,}");
  if (plain.test(good) && !plain.test(f)) return String(Math.abs(v) >= 1 ? +v.toFixed(2) : +v.toPrecision(3)).replace(".", "{,}"); // 0,0327 et pas 0,03
  if (/\\frac/.test(good) && !/sqrt|pi/.test(good) && plain.test(f) && !Number.isInteger(v)) {
    for (let d = 2; d <= 60; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; }
  }
  return f;
}

// Plausibilité (21.11, remarque de l'utilisateur : « des valeurs délirantes font qu'il est très facile de déduire la bonne ») :
// un choix faux reste dans le même ordre de grandeur que la bonne réponse (facteur 10 au plus ; deux puissances de 10 en notation scientifique).
function qcmPlausible(v, g, spec) {
  if (!isFinite(v)) return false;
  if (g === 0) return Math.abs(v) <= 10 && v !== 0;
  if (v === 0) return Math.abs(g) <= 3;
  if (spec.sci) return Math.abs(Math.floor(Math.log10(Math.abs(v))) - Math.floor(Math.log10(Math.abs(g)))) <= 2;
  const r = Math.abs(v / g);
  return r >= 1 / 10.5 && r <= 10.5;
}
// Valeurs voisines, sous la même forme que la bonne réponse, pour compléter à 4 choix quand il manque des pièges plausibles.
// Un choix négatif n'est plausible que si l'énoncé contient un signe moins (soustraction ou nombre négatif) ou si la réponse est négative.
const qcmNegOk = (q, g) => g < 0 || /[-−]\s*[\d(]|[\d)]\s*[-−]/.test(String(q.q).replace(/<[^>]+>/g, "")); // pas les mots composés (demi-tour)
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

// Une question QCM : la bonne valeur, des erreurs typiques plausibles, complétées par des valeurs voisines : 4 choix distincts à l'écrit.
function qcmMake(id, d) {
  for (let t = 0; t < 30; t++) {
    let q; try { q = Engine.build(id, d, 1 + Math.floor(Math.random() * 46655)); q = Engine.finalize(state, id, q); } catch (e) { continue; }
    if (Engine.horsCO && Engine.horsCO(state, id, q)) continue; /* 25.11 : forme hors programme de la classe (9e–10e) */
    if (!q || q.parts || !q.spec || q.spec.kind !== "value" || !isFinite(q.spec.value)) continue;
    const g = q.spec.value, good = qcmFmt(g, q.spec, q.q), seen = new Set([good]), wrong = [];
    const tol = Math.max(q.spec.round ? q.spec.round : 0, 1e-9 * Math.max(1, Math.abs(g)));
    const negOk = qcmNegOk(q, g);
    const take = (v, m) => { if (wrong.length >= 3 || !qcmPlausible(v, g, q.spec) || !qcmPlausible(+(+v).toFixed(2), g, q.spec) /* 24.11 : à la limite, l arrondi affiché doit rester plausible */ || Math.abs(v - g) <= tol || (v < 0 && !negOk)) return; const f = qcmLike(v, good, q); if (seen.has(f) || /NaN|undefined|Infinity/.test(f) || (/approx/.test(f) && !/approx/.test(good))) return; seen.add(f); wrong.push({ f, m }); };
    for (const tr of q.traps || []) take(tr.v, tr.m);
    if (!wrong.length) continue; // au moins une vraie erreur typique, avec son diagnostic
    for (const v of qcmNear(g, good, q)) take(v, "");
    if (wrong.length < 3) continue;
    const choices = shuffle([{ f: good, ok: true }, ...wrong]);
    return { id, d, q, choices };
  }
  return null;
}

// Lignes de la grille (21.11, demande de l'utilisateur) :
// 1. au moins une ligne par notion du test : sa compétence de base (niveau 1) ;
// 2. s'il reste de la place, une ligne de niveau 3 par notion (la plus exigeante), plutôt qu'un 2e niveau de base ;
// 3. puis les niveaux 2.
// Chaque ligne est testée par une question à choix si possible (mode « qcm »), sinon par une question à réponse tapée (« tape »).
function atTypedOk(id, lv) {
  for (let t = 0; t < 6; t++) { try { const q = Engine.build(id, lv, 1 + Math.floor(Math.random() * 46655)); if (q && q.spec && !q.parts) return true; } catch (e) {} }
  return false;
}
function atRows(ids) {
  const per = ids.map((id) => compsOf(id).map((c) => ({ cid: c.cid, id, lv: c.i + 1, label: c.label })));
  const out = [], has = (c) => out.some((o) => o.cid === c.cid), max = Math.max(AT_MAX, ids.length); // jamais une notion du test sans ligne
  const add = (c) => {
    if (!c || has(c) || out.length >= max) return false;
    if (qcmMake(c.id, c.lv)) { out.push({ ...c, mode: "qcm" }); return true; }
    if (atTypedOk(c.id, c.lv)) { out.push({ ...c, mode: "tape" }); return true; }
    return false;
  };
  // 1. une ligne par notion : la plus basse qui marche
  per.forEach((L) => { for (const c of L.slice().sort((x, y) => x.lv - y.lv)) if (add(c)) break; });
  // 2. le niveau le plus exigeant de chaque notion (3, sinon 2)
  per.forEach((L) => { const top = L.slice().sort((x, y) => y.lv - x.lv).find((c) => c.lv >= 2 && !has(c)); if (top) add(top); });
  // 3. ce qui reste
  per.forEach((L) => L.forEach(add));
  return out.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id) || a.lv - b.lv);
}
function atState() {
  const key = state.prep.ids.join();
  if (!state.autotest || state.autotest.key !== key) state.autotest = { key, rows: atRows(state.prep.ids), avant: {}, runs: [] };
  return state.autotest;
}
const AT_SYM = { 2: "✓", 1: "~", 0: "✗" };
const atCell = (v) => (v === undefined || v === null ? '<span class="muted">·</span>' : `<span class="at-s at-${v}">${AT_SYM[v]}</span>`);

function screenQcm() {
  if (!Engine.prepActive(state)) return screenHome();
  const A = atState();
  if (A.rows.length < 2) {
    h(`${brand}<div class="eyebrow">Autoévaluation</div><h2>Pas de test rapide pour ces notions</h2>
    <p class="muted">Les notions de ton test se prêtent mal aux questions à choix. Fais plutôt le sujet de préparation ou une révision ciblée.</p>
    <button class="btn-primary btn-big" id="back">Retour</button>`);
    document.getElementById("back").onclick = () => { homeTab = "test"; screenHome(); };
    return;
  }
  if (A.runs.length) return atGrid();
  const all = () => A.rows.every((r) => A.avant[r.cid] !== undefined);
  h(`${brand}<div class="eyebrow">Je prépare mon test · étape 1 sur 2</div><h2>Autoévaluation</h2>
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

// Test rapide : une question à choix par ligne de la grille.
function atTest() {
  const A = atState(), items = A.rows.map((r) => ({ row: r, it: r.mode === "tape" ? null : qcmMake(r.id, r.lv) })), res = {};
  const head = (i, lab = "") => `${A.runs.length ? "Test rapide · après" : "Je prépare mon test · étape 2 sur 2"} · ${i + 1} sur ${items.length}${lab ? " · " + esc(lab) : ""}<span class="pbar" aria-hidden="true"><i style="width:${Math.round((i / items.length) * 100)}%"></i></span>`;
  const show = (i) => {
    if (i >= items.length) { A.runs.push({ date: day(), r: res }); A.runs = A.runs.slice(-6); if (typeof prepMark === "function") { prepMark("autoeval"); prepMark("apres"); } Badges.check(state); save(); return atGrid(true); }
    // Ligne sans question à choix : question à réponse tapée, un seul essai, correction affichée.
    if (!items[i].it) {
      const row = items[i].row; let q = null;
      for (let t = 0; t < 8 && !(q && q.spec && !q.parts); t++) { try { q = Engine.make(state, row.id, row.lv); } catch (e) { q = null; } }
      if (!q) { i++; return show(i); }
      return renderQuestion(q, { eyebrow: head(i, row.label), single: true, track: "autotest",
        onDone: (r) => { res[row.cid] = r.solved ? 1 : 0; Engine.recordComp(state, row.id, q.d, res[row.cid]); save(); },
        onNext: () => show(i + 1) });
    }
    const { row, it } = items[i], q = it.q, pct = Math.round((i / items.length) * 100);
    h(`${brand}<div class="eyebrow">${A.runs.length ? "Test rapide · après" : "Je prépare mon test · étape 2 sur 2"} · ${i + 1} sur ${items.length}<span class="pbar" aria-hidden="true"><i style="width:${pct}%"></i></span></div>
    <div class="card pop"><div class="qmeta"><span class="chip">${row.label}</span></div>
    <div class="qtext">${boldData(q.q)}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    ${scratchHtml()}
    <p class="small muted">Une seule réponse est juste. Calcule d'abord, puis choisis.</p>
    <div class="qcm-choices">${it.choices.map((c, k) => `<button type="button" class="qcm-c" data-k="${k}"><span class="qcm-l">${"ABCD"[k]}</span><span>\\(${c.f}\\)</span></button>`).join("")}</div>
    <div id="fb"></div></div>`);
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

// Grille finale : Avant (ce que je pensais), 1er test, Après (dernier test), et le message de chaque ligne.
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
  <p class="small muted">Ce n'est pas une note. ${last ? "Compare tes colonnes : c'est ton progrès depuis le " + first.date.slice(8, 10) + "." + first.date.slice(5, 7) + "." : "Refais le test rapide dans quelques jours, juste avant le test : ta colonne « Après » se remplira."}</p></div>
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
