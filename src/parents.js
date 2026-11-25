// Espace parent (24.11, vision de l'enseignant : tools/parents.md). Accompagner, pas surveiller.
// Côté enfant : dans Progrès, « 👪 Envoyer à mes parents » : le code de sauvegarde (src/backup.js) part dans un lien
// …/#parent=<code> (partage natif, copie, QR). Un écran dit à l'enfant exactement ce que verra son parent.
// Côté parent : la page #parent=<code> lit le code en LECTURE SEULE (la progression de l'appareil n'est jamais
// touchée), et montre : sa semaine (régularité, ce qui a été travaillé, une réussite à fêter), « Résoudre ensemble »
// (1 à 3 problèmes du carnet d'erreurs, régénérés à l'identique par Engine.fromCode), une activité à faire ensemble
// et 3 conseils. Les codes reçus restent sur l'appareil du parent (clé m2m-parents), un par enfant, sous un surnom.
// Rien n'est envoyé à un serveur depuis cette page (ping et rapport d'erreurs coupés dans app.js pour #parent).
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
  /* Code → { raw, s } : objet compact et progression reconstruite au jour de la photo (raw.t). Les paquets du niveau
     de l'enfant sont chargés d'abord (docs/ : chargement par niveau), sinon ses notions seraient inconnues. */
  async open(code) {
    const raw = await Backup.read(code);
    if (!raw || raw.v !== 1 || !raw.p) throw new Error("code");
    if (typeof window.ensurePacks === "function") { try { await window.ensurePacks(raw.p); } catch (e) {} }
    return { raw, s: Backup.unpack(raw, raw.t || day()) };
  },
  label(id) { const n = typeof NOTIONS !== "undefined" && NOTIONS.find((x) => x.id === id); return (n && n.label) || ""; },
  /* Question du carnet, telle que l'enfant l'a vue (même exigence qu'en séance au CO, comme showCode). */
  problem(code) {
    let q = null;
    try { q = Engine.fromCode(code); } catch (e) { q = null; }
    if (!q) return null;
    const n = NOTIONS.find((x) => x.id === q.id), y = (n && n.CH && n.CH[0]) || 12;
    q = Engine.finalize({ profile: { system: "CH", grade: y } }, q.id, q); /* 25.11 : tous niveaux (règle de la calculatrice) */
    return q;
  },
  /* Résumé de la semaine (7 jours jusqu'à la photo), sans Mathélo, sans heures, sans liste d'erreurs. */
  week(s, t) {
    const w = Engine.week(s, t), lim = addDays(t, -6);
    const dates = new Set((s.history || []).filter((x) => x && x.n > 0 && x.date >= lim && x.date <= t).map((x) => x.date));
    const days = [...Array(7)].map((_, i) => addDays(t, i - 6)).map((d) => ({ d, on: dates.has(d) }));
    const ids = [];
    for (const [cid, r] of Object.entries(s.comps || {})) { const id = cid.split(":")[0]; if (r && r.last && r.last >= lim && r.last <= t && !ids.includes(id) && this.label(id)) ids.push(id); }
    const now = (s.now && Array.isArray(s.now.ids) ? s.now.ids : []).filter((id) => this.label(id));
    let fete = null;
    if (w.cons.length) fete = { ic: "🏅", txt: "Une notion maîtrisée : <b>" + esc(this.label(w.cons[0]) || "") + "</b>" + (w.cons.length > 1 ? " (et " + (w.cons.length - 1) + " autre" + (w.cons.length > 2 ? "s" : "") + ")" : "") + "." };
    else if (w.fixed) fete = { ic: "📕", txt: w.fixed + " erreur" + (w.fixed > 1 ? "s" : "") + " de son carnet " + (w.fixed > 1 ? "effacées" : "effacée") + " : il faut la réussir deux fois de suite pour l'effacer." };
    else if (w.ups.length) fete = { ic: "📈", txt: "Un progrès en <b>" + esc(w.ups[0].label) + "</b>." };
    else if (w.days) fete = { ic: "💪", txt: w.days + " jour" + (w.days > 1 ? "s" : "") + " de pratique : c'est l'effort qui compte." };
    return { days, n: w.days, ids: ids.slice(0, 4), more: Math.max(0, ids.length - 4), now: now.slice(0, 3), fete };
  },
  /* Activité de la semaine : une question curieuse accessible à l'enfant (la même toute la semaine de la photo). */
  curious(s, t) {
    if (typeof Curieux === "undefined") return null;
    const av = Curieux.available(s); if (!av.length) return null;
    const wk = Math.floor(new Date(t + "T12:00:00") / 6048e5);
    return Curieux.build(av[wk % av.length].key, (wk % 9000) + 1);
  },
  story(t) {
    if (typeof HISTOIRE === "undefined" || !HISTOIRE.length) return null;
    const k = Math.floor(new Date(t + "T12:00:00") / 6048e5) % HISTOIRE.length;
    return HISTOIRE[k];
  },
};

// ---------------- Côté enfant ----------------
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
  if ($("pshare")) $("pshare").onclick = () => navigator.share({ title: "Ma semaine de maths", text: "Ma semaine sur 5 minutes de maths (ouvre ce lien) :", url }).catch(() => {});
  $("pcopy").onclick = async () => { try { await navigator.clipboard.writeText(url); msg.textContent = "Lien copié : colle-le dans un message à tes parents."; } catch (e) { msg.textContent = "Copie impossible ici : utilise le QR code."; } };
  $("ppreview").onclick = () => screenParentView(null, { code, preview: true, back: () => screenParentShare() });
  $("pback").onclick = back;
}

// ---------------- Côté parent ----------------
// Route : …/#parent=<code> (nouveau code reçu) ou …/#parent (mes enfants). Appelée par showCode() (app.js).
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
  /* Nouvel enfant (ou ancien code sans identifiant) : surnom, ou mise à jour d'un enfant déjà enregistré. */
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
// Page parent. id : enfant enregistré (null : le dernier vu) ; opt.preview : aperçu côté enfant (rien n'est enregistré).
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
  const cur = Parents.curious(s, t), H = Parents.story(t);
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
