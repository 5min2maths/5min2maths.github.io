// QCM de préparation (21.11, idée du 19.11, « en plus du sujet de préparation ») : dans l'onglet Test, 10 questions
// à choix sur les notions du test. Les mauvaises réponses proposées sont les erreurs typiques des générateurs
// (q.traps) : quand l'élève en choisit une, on lui dit quelle erreur il vient de faire. Correction immédiate,
// bilan par notion à la fin. Ce n'est pas une note ; les compétences sont mises à jour (juste = 1, faux = 0).

const QCM_N = 10;
const QCM_D = [1, 1, 2, 2, 2, 2, 3, 3, 2, 3];

// Écriture d'une valeur proposée : comme l'élève l'écrirait (entier, décimal, fraction, multiple de π, racine).
function qcmFmt(v, spec, text) {
  const thou = (n) => { const s = String(Math.abs(n)); return (n < 0 ? "-" : "") + (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : s); };
  const ratio = (x, maxD = 60) => { for (let d = 1; d <= maxD; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; };
  const fr = ([n, d]) => (d === 1 ? thou(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}");
  // Notation scientifique exigée : a · 10^n avec 1 ≤ a < 10.
  if (spec.sci && v !== 0) { const e = Math.floor(Math.log10(Math.abs(v)) + 1e-12), a = +(v / 10 ** e).toPrecision(10); return (Math.abs(v) >= 1 && Math.abs(v) < 10) ? String(+v.toPrecision(10)).replace(".", "{,}") : String(a).replace(".", "{,}") + " \\cdot 10^{" + e + "}"; }
  if (Number.isInteger(v) || Math.abs(v - Math.round(v)) < 1e-9) return thou(Math.round(v));
  if (spec.round) { const k = Math.max(0, Math.round(-Math.log10(spec.round))); return String((+v.toFixed(k))).replace(".", "{,}"); }
  const wantFrac = /sous forme (de|d'une) fraction|fraction irréductible|en fraction/i.test(text || "");
  const q = ratio(v);
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
  if (plain.test(good) && !plain.test(f)) return String(+v.toFixed(2)).replace(".", "{,}");
  if (/\\frac/.test(good) && !/sqrt|pi/.test(good) && plain.test(f) && !Number.isInteger(v)) {
    for (let d = 2; d <= 60; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; }
  }
  return f;
}

// Une question QCM : la question du générateur, la bonne valeur et 2 ou 3 erreurs typiques, toutes distinctes à l'écrit.
function qcmMake(id, d) {
  for (let t = 0; t < 30; t++) {
    let q; try { q = Engine.build(id, d, 1 + Math.floor(Math.random() * 46655)); q = Engine.finalize(state, id, q); } catch (e) { continue; }
    if (!q || q.parts || !q.spec || q.spec.kind !== "value" || !isFinite(q.spec.value)) continue;
    const good = qcmFmt(q.spec.value, q.spec, q.q), seen = new Set([good]), wrong = [];
    for (const tr of q.traps || []) { if (!isFinite(tr.v) || (Math.abs(tr.v) < 1e-12 && q.spec.value !== 0)) continue; const f = qcmLike(tr.v, good, q); if (seen.has(f)) continue; seen.add(f); wrong.push({ f, m: tr.m }); if (wrong.length === 3) break; }
    if (wrong.length < 2) continue;
    const choices = shuffle([{ f: good, ok: true }, ...wrong]);
    return { id, d, q, choices };
  }
  return null;
}

function qcmNew() {
  const ids = shuffle(state.prep.ids.slice()), items = [];
  for (let k = 0, guard = 0; items.length < QCM_N && guard < 60; guard++, k++) {
    const id = ids[k % ids.length], it = qcmMake(id, QCM_D[items.length % QCM_D.length]) || qcmMake(id, 1);
    if (it) items.push(it);
    if (guard > 3 * ids.length && !items.length) break; // aucune notion compatible
  }
  return items;
}

function screenQcm() {
  if (!Engine.prepActive(state)) return screenHome();
  const items = qcmNew();
  if (items.length < 3) {
    h(`${brand}<div class="eyebrow">QCM de préparation</div><h2>Pas assez de questions à choix</h2>
    <p class="muted">Les notions de ton test se prêtent mal au QCM. Fais plutôt le sujet de préparation ou une révision ciblée.</p>
    <button class="btn-primary btn-big" id="back">Retour</button>`);
    document.getElementById("back").onclick = () => { homeTab = "test"; screenHome(); };
    return;
  }
  const res = [];
  const show = (i) => {
    if (i >= items.length) return qcmResult(items, res);
    const it = items[i], q = it.q, pct = Math.round((i / items.length) * 100);
    h(`${brand}<div class="eyebrow">✅ QCM de préparation · ${i + 1} sur ${items.length}<span class="pbar" aria-hidden="true"><i style="width:${pct}%"></i></span></div>
    <div class="card pop"><div class="qmeta"><span class="chip">${nLabel(it.id)}</span><span class="dots" title="difficulté">${[1, 2, 3].map((k) => `<i class="${k <= it.d ? "on" : ""}"></i>`).join("")}</span></div>
    <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    <p class="small muted">Une seule réponse est juste. Calcule d'abord, puis choisis.</p>
    <div class="qcm-choices">${it.choices.map((c, k) => `<button type="button" class="qcm-c" data-k="${k}"><span class="qcm-l">${"ABCD"[k]}</span><span>\\(${c.f}\\)</span></button>`).join("")}</div>
    <div id="fb"></div></div>`);
    const S = typeof sigOpen === "function" ? sigOpen({ ev: "q", code: q.code, d: it.d, kind: "qcm", fmt: "qcm" }) : null;
    app.querySelectorAll(".qcm-c").forEach((b) => (b.onclick = () => {
      const c = it.choices[+b.dataset.k];
      app.querySelectorAll(".qcm-c").forEach((x) => { x.disabled = true; if (it.choices[+x.dataset.k].ok) x.classList.add("qcm-good"); });
      if (!c.ok) b.classList.add("qcm-bad");
      res[i] = c.ok ? 1 : 0;
      if (S) { S.issue = c.ok ? "ok1" : "faux"; S.essais = 1; S.sec = sigSec(S); if (!c.ok) S.rep1 = c.f.slice(0, 20); }
      Engine.recordComp(state, it.id, it.d, res[i]); save();
      if (typeof buzz === "function") buzz(c.ok);
      if (c.ok) burst();
      const fb = document.getElementById("fb");
      fb.innerHTML = `<div class="fb ${c.ok ? "ok" : "bad"} pop"><b>${c.ok ? "✓ Juste !" : "✗ Ce n'est pas ça."}</b>${c.ok ? "" : `<div class="diag">🔎 ${escT(c.m || "C'est une erreur fréquente.")}</div>`}
        <details class="solfull"${c.ok ? "" : " open"}><summary>La correction</summary><div class="sol">${q.sol}</div></details></div>
        <div class="actions"><button class="btn-primary" id="nx">${i + 1 < items.length ? "Question suivante" : "Voir mon bilan"}</button></div>`;
      typeset(fb);
      document.getElementById("nx").onclick = () => show(i + 1);
      document.getElementById("nx").focus();
    }));
  };
  show(0);
}

function qcmResult(items, res) {
  const n = items.length, ok = res.filter((x) => x === 1).length, by = {};
  items.forEach((it, i) => (by[it.id] = by[it.id] || []).push(res[i]));
  const good = Object.keys(by).filter((id) => by[id].every((x) => x === 1)), weak = Object.keys(by).filter((id) => by[id].some((x) => x !== 1));
  state.qcm = { date: day(), ok, n, ids: state.prep.ids.slice() }; Badges.check(state); save();
  h(`${brand}<div class="eyebrow">QCM de préparation · bilan</div><h2>${ok >= 0.8 * n ? "Très bien !" : ok >= 0.5 * n ? "Pas mal." : "Il reste du travail, et tu sais où."}</h2>
  <div class="card stack"><p><b>${ok}</b> juste${ok > 1 ? "s" : ""} sur ${n}</p><p class="small muted">Ce n'est pas une note. Au vrai test, il faudra écrire tes calculs : le QCM sert à repérer tes erreurs.</p></div>
  ${good.length ? `<div class="card flat"><h3>✓ Acquis</h3><ul>${good.map((id) => `<li>${nLabel(id)}</li>`).join("")}</ul></div>` : ""}
  ${weak.length ? `<div class="card flat stack"><h3>À retravailler</h3><ul>${weak.map((id) => `<li>${nLabel(id)}</li>`).join("")}</ul><button class="btn-primary" id="rev">Réviser ces notions maintenant</button></div>` : ""}
  <div class="row"><button id="again">Un autre QCM</button><button class="btn-ghost" id="home">Retour</button></div>`);
  if (ok >= 0.8 * n) burst();
  const rv = document.getElementById("rev");
  if (rv) rv.onclick = () => { session = { plan: weak.flatMap((id) => [id + "|2", id + "|3"]), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true }; nextQuestion(); };
  document.getElementById("again").onclick = screenQcm;
  document.getElementById("home").onclick = () => { homeTab = "test"; screenHome(); };
}
