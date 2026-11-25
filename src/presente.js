// 25.11 : supports de présentation, dans l'app elle-même (demande de l'enseignant : « à destination élève et parent »,
// le format le plus dynamique). Deux pages publiques, sans rien enregistrer :
//   …/#decouvrir : présentation aux élèves (projetable en classe), avec une vraie question à essayer ;
//   …/#parents   : « Je suis parent » (ce que l'app apporte, Résoudre ensemble en direct, mise en route en 3 étapes).
// Bouton « ▶ Présenter » : une diapositive par écran, flèches / espace / clic pour avancer (réunion de parents, classe).
// Rien n'est envoyé depuis ces pages (voir canSend et ping dans app.js).

const PZ = {
  url() { return location.origin + location.pathname; },
  qr(u) { try { return typeof QR !== "undefined" ? QR.svg(u) : ""; } catch (e) { return ""; } },
  grade: null,
  on: false,
};

function presentRoute() {
  if (location.hash === "#decouvrir") { screenDecouvrir(); return true; }
  if (location.hash === "#parents") { screenParents(); return true; }
  return false;
}

const pzExit = () => { pzStop(); history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };

function pzStop() { PZ.on = false; document.body.classList.remove("pz-on"); }
window.addEventListener("hashchange", () => { if (!/^#(decouvrir|parents)$/.test(location.hash)) pzStop(); });

// Mode présentation : chaque section .pz-s occupe un écran ; navigation au clavier et au clic.
function pzBind(root) {
  const secs = () => Array.from(root.querySelectorAll(".pz-s"));
  const cur = () => { const y = window.scrollY + window.innerHeight * 0.35; let k = 0; secs().forEach((s, i) => { if (s.offsetTop <= y) k = i; }); return k; };
  const goto = (k) => { const S = secs(); k = Math.max(0, Math.min(S.length - 1, k)); S[k].scrollIntoView({ behavior: "smooth", block: "start" }); };
  root.querySelectorAll(".pz-play").forEach((b) => (b.onclick = () => {
    PZ.on = !PZ.on; document.body.classList.toggle("pz-on", PZ.on);
    root.querySelectorAll(".pz-play").forEach((x) => (x.textContent = PZ.on ? "■ Quitter la présentation" : "▶ Présenter"));
    if (PZ.on) { goto(0); if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); }
    else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }));
  root.querySelectorAll(".pz-next").forEach((b) => (b.onclick = () => goto(cur() + 1)));
  document.onkeydown = (e) => {
    if (!PZ.on || !/^#(decouvrir|parents)$/.test(location.hash)) return;
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); goto(cur() + 1); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goto(cur() - 1); }
    else if (e.key === "Escape") { PZ.on = false; document.body.classList.remove("pz-on"); root.querySelectorAll(".pz-play").forEach((x) => (x.textContent = "▶ Présenter")); }
  };
  root.querySelectorAll(".pz-exit").forEach((b) => (b.onclick = pzExit));
  root.querySelectorAll(".pz-anim").forEach((el) => el.classList.add("pz-wait"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pz-wait"); io.unobserve(en.target); } }), { threshold: 0.25 });
    root.querySelectorAll(".pz-anim").forEach((el) => io.observe(el));
  } else root.querySelectorAll(".pz-anim").forEach((el) => el.classList.remove("pz-wait"));
}

const pzGrades = (id) => `<div class="seg pz-grades" id="${id}">${[[9, "9e"], [10, "10e"], [11, "11e"], [12, "Collège / MP"]].map(([g, l]) => `<button type="button" aria-pressed="${g === PZ.grade}" data-v="${g}">${l}</button>`).join("")}</div>`;

function pzQuestion() {
  const keep = demoGrade; demoGrade = PZ.grade || null;
  let q; try { q = demoQuestion(); } finally { demoGrade = keep; }
  return q;
}

// Une vraie question à essayer (même mécanique que l'accueil de bienvenue : clavier, vérification, aide pas à pas).
function pzTry(box) {
  const q = pzQuestion(), n = NOTIONS.find((x) => x.id === q.id), fine = window.matchMedia("(pointer: fine)").matches;
  const spec = q.spec.kind === "value" && !q.spec.sci && (Math.abs(q.spec.value) >= 1e-3 || q.spec.value === 0) && Math.abs(q.spec.value) < 1e7 ? { ...q.spec, final: true } : q.spec;
  box.innerHTML = `<div class="card tilt pz-q"><div class="qmeta"><span class="chip">${n ? esc(n.label) : "Question"}</span><button type="button" class="btn-ghost small" id="pzother">Une autre ↻</button></div>
    <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    <div class="answer"><input class="ans" id="pzans" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
    <div class="preview" id="pzprev"></div>${keypadHtml(spec)}<div class="actions"><button class="btn-primary" id="pzok">Vérifier</button></div></div>
    <div id="pzfb"></div></div>`;
  typeset(box);
  const inp = document.getElementById("pzans"), prev = document.getElementById("pzprev"), fb = document.getElementById("pzfb");
  const show = () => previewOf(inp, prev, q.spec);
  inp.oninput = show; bindKeypad(() => inp, show);
  const close = () => { inp.disabled = true; const kp = box.querySelector("#kp"); if (kp) kp.remove(); const ok = document.getElementById("pzok"); if (ok) ok.remove(); prev.remove(); };
  const go = () => {
    const v = inp.value.trim(); if (!v) return;
    const r = checkAnswer(q.spec, v);
    if (r.status === "correct") { close(); fb.innerHTML = `<div class="fb ok pop">✓ Juste ! Demain, une question un peu plus loin.</div><details class="par-fold"><summary>Voir la correction</summary><div class="sol">${q.sol}</div></details>`; typeset(fb); return; }
    if (r.status === "invalid" || r.status === "form") { fb.innerHTML = `<div class="fb hint pop">${escT(r.message || "Écris un nombre.")}</div>`; typeset(fb); return; }
    const d = diagnose(q, v);
    fb.innerHTML = `<div class="fb hint pop">${d ? escT(d) : r.status === "close" ? escT(r.message || "Presque !") : "Pas tout à fait."}</div>
      <div class="actions"><button class="btn-primary" id="pzg">On le fait ensemble</button><button class="btn-ghost" id="pzs">Voir la solution</button></div><div id="pzgb"></div>`;
    typeset(fb);
    document.getElementById("pzs").onclick = () => { close(); fb.innerHTML = `<div class="sol">${q.sol}</div>`; typeset(fb); };
    document.getElementById("pzg").onclick = () => { close(); fb.querySelector(".actions").remove(); runGuide(q, document.getElementById("pzgb"), () => {}); };
  };
  document.getElementById("pzok").onclick = go;
  inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
  document.getElementById("pzother").onclick = () => pzTry(box);
}

const pzInstall = (who) => {
  const u = PZ.url(), qr = PZ.qr(u);
  return `<div class="pz-install">${qr ? `<div class="pz-qr" aria-label="QR code de l'application">${qr}</div>` : ""}
    <div class="stack"><p class="pz-url"><b>${esc(u.replace(/^https?:\/\//, ""))}</b></p>
    <ol class="small pz-steps"><li>Ouvrir le lien ${who === "parent" ? "sur le téléphone de votre enfant" : "sur ton téléphone"} (ou scanner le QR code).</li>
    <li><b>Android</b> : menu ⋮ → « Ajouter à l'écran d'accueil ». <b>iPhone</b> : bouton Partager → « Sur l'écran d'accueil ».</li>
    <li>${who === "parent" ? "Choisir ensemble sa classe et le chapitre en cours : c'est prêt." : "Choisis ta classe et le chapitre en cours : c'est parti."}</li></ol></div></div>`;
};

function screenDecouvrir() {
  h(`<div class="pz" id="pz">
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">Pour les élèves · 9e à 4e, Collège et MP</div>
    <h1 class="pz-big">Chaque jour, <span class="mark">5 minutes</span> de maths.<br>Juste à ton niveau.</h1>
    <p class="muted">Une question choisie pour toi, une correction tout de suite, et l'app t'aide étape par étape quand tu bloques.</p>
    <div class="pz-chips pz-anim"><span>📱 sur ton téléphone</span><span>🙈 sans compte, sans nom</span><span>🆓 gratuit, sans pub</span><span>📚 plan d'études genevois</span></div>
    <button type="button" class="btn-primary pz-next">Essayer tout de suite ↓</button>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🎯 À toi</div><h2>Une vraie question, maintenant</h2>
    <p class="small muted">Choisis ta classe. Réponds, ou demande « On le fait ensemble ».</p>
    ${pzGrades("pzg1")}
    <div id="pztry"></div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">⚙️ Comment ça marche</div><h2>L'app s'adapte à toi</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🎯 Question du jour</b><p class="small">Ni trop facile, ni impossible : ton <b>Mathélo</b> monte quand tu progresses, et les questions suivent.</p></div>
      <div class="card flat"><b>🪜 Pas à pas</b><p class="small">Une erreur ? L'app repère le piège (« tu as pris l'angle extérieur ? ») et te guide, une étape à la fois.</p></div>
      <div class="card flat"><b>📕 Carnet d'erreurs</b><p class="small">Chaque question ratée y attend sa revanche : réussis-la deux fois de suite, elle s'efface.</p></div>
      <div class="card flat"><b>📝 Ton évaluation</b><p class="small">Donne la date et les notions : chaque jour, juste ce qu'il faut réviser, plus un sujet de préparation corrigé.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔥 Et pour aller plus loin</div><h2>Pas seulement des exercices</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🔍 Problème de la semaine</b><p class="small">Un vrai défi en plusieurs étapes, avec des indices si tu bloques.</p></div>
      <div class="card flat"><b>🎲 Questions curieuses</b><p class="small">Parie d'abord, calcule ensuite : les maths cachées dans la vie de tous les jours.</p></div>
      <div class="card flat"><b>📜 Histoires des maths</b><p class="small">Zénon, Kepler, Marie Curie, John Snow… et un défi expert pour les plus motivés.</p></div>
      <div class="card flat"><b>🔥 Ta série</b><p class="small">Un jour, deux jours, dix jours d'affilée : 5 minutes suffisent pour la garder.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔒 Ta vie privée</div><h2>Ta progression reste chez toi</h2>
    <ul class="plain pz-list pz-anim"><li>✅ Pas de compte, pas de nom, pas d'adresse mail.</li><li>✅ Tout est enregistré sur ton téléphone ; un code de sauvegarde pour changer d'appareil.</li>
    <li>✅ Des statistiques anonymes seulement si tu es d'accord.</li><li>✅ Tes parents ne voient ta semaine que si <b>toi</b> tu leur envoies (et tu vois exactement ce qu'ils verront).</li></ul>
  </section>

  <section class="pz-s pz-end">
    <div class="eyebrow">📲 Installe-la</div><h2>30 secondes, et c'est parti</h2>
    ${pzInstall("eleve")}
    <button type="button" class="btn-primary btn-big pz-exit">Commencer</button>
  </section>
  </div>`);
  const root = document.getElementById("pz"), box = document.getElementById("pztry");
  pzBind(root);
  root.querySelectorAll("#pzg1 button").forEach((b) => (b.onclick = () => { PZ.grade = +b.dataset.v; root.querySelectorAll("#pzg1 button").forEach((x) => x.setAttribute("aria-pressed", x === b)); pzTry(box); }));
  pzTry(box);
}

// « Résoudre ensemble » en direct : un vrai problème, les questions à poser, les indices un par un, la solution repliée.
function pzSolve(box) {
  const q = pzQuestion(), n = NOTIONS.find((x) => x.id === q.id), G = (q.guide || []).filter((g) => g && g.ask);
  const trap = q.traps && q.traps[0] && q.traps[0].m ? q.traps[0].m : "";
  box.innerHTML = `<div class="card stack par-pb pz-q"><div class="qmeta"><span class="chip">${n ? esc(n.label) : "Problème"}</span><button type="button" class="btn-ghost small" id="pzother2">Un autre ↻</button></div>
    <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    <div class="par-step"><b>1. Commencez par lui demander</b><ul class="plain par-list small"><li>« Qu'est-ce qu'on cherche ? »</li><li>« Qu'est-ce que tu sais déjà, dans l'énoncé ? »</li><li>« Tu peux m'expliquer ce que tu as essayé ? »</li></ul></div>
    ${G.length ? `<div class="par-step"><b>2. Des indices, un à la fois</b><span class="small muted">Dévoilez une étape seulement si votre enfant bloque.</span><div id="pzhints" class="stack"></div><button type="button" class="btn-sec small" id="pzhint">Dévoiler l'indice 1 / ${G.length}</button></div>` : ""}
    ${trap ? `<div class="par-diag"><b>🔎 Un piège fréquent</b><div class="small">${escT(trap)}</div></div>` : ""}
    <details class="par-fold par-sol"><summary>🔑 La solution complète (pour vous)</summary><div class="sol">${q.sol}</div></details></div>`;
  typeset(box);
  let k = 0;
  const bt = document.getElementById("pzhint");
  if (bt) bt.onclick = () => {
    const g = G[k++], d = document.createElement("div");
    d.className = "pz-hint pop small";
    d.innerHTML = `<div>${g.ask}</div>${g.sol ? `<details class="par-fold"><summary class="small">Réponse de cette étape</summary><div class="small">${g.sol}</div></details>` : ""}`;
    document.getElementById("pzhints").appendChild(d); typeset(d);
    if (k >= G.length) bt.remove(); else bt.textContent = `Dévoiler l'indice ${k + 1} / ${G.length}`;
  };
  document.getElementById("pzother2").onclick = () => pzSolve(box);
}

function screenParents() {
  const JR = ["L", "M", "M", "J", "V", "S", "D"], ON = [1, 1, 0, 1, 0, 1, 0];
  h(`<div class="pz" id="pz">
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">👪 Je suis parent</div>
    <h1 class="pz-big">Accompagner son enfant en maths,<br><span class="mark">2 minutes</span> par semaine.</h1>
    <p class="muted">Votre enfant s'entraîne 5 minutes par jour, à son niveau, sur le programme de sa classe. Vous, vous l'encouragez, et vous pouvez résoudre un problème avec lui, même sans être fort en maths.</p>
    <div class="pz-chips pz-anim"><span>🤝 accompagner, pas surveiller</span><span>🆓 gratuit, sans compte</span><span>📚 plan d'études genevois, 9e → 4e, Collège et MP</span></div>
    <button type="button" class="btn-primary pz-next">Voir comment ↓</button>
  </section>

  <section class="pz-s">
    <div class="eyebrow">📱 Côté enfant</div><h2>5 minutes par jour, juste à son niveau</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🎯 Adapté</b><p class="small">Chaque question est choisie selon ses réussites : ni trop facile, ni décourageante.</p></div>
      <div class="card flat"><b>🏫 Relié à la classe</b><p class="small">Il indique le chapitre en cours et la date de sa prochaine évaluation : l'app le prépare jour après jour.</p></div>
      <div class="card flat"><b>🪜 Jamais seul face à l'erreur</b><p class="small">L'app repère l'erreur et le guide étape par étape, sans donner la réponse d'emblée.</p></div>
      <div class="card flat"><b>📕 Il revient sur ses erreurs</b><p class="small">Un carnet garde ses questions ratées ; il les retente avec d'autres nombres jusqu'à les réussir.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">📅 Côté parent</div><h2>Sa semaine, en un coup d'œil</h2>
    <p class="small muted">Quand votre enfant vous envoie son lien (WhatsApp, SMS), vous voyez :</p>
    <div class="card stack par-week pz-anim"><div class="eyebrow">📅 Exemple</div>
      <div class="par-days">${JR.map((d, i) => `<span class="${ON[i] ? "on" : ""}">${d}</span>`).join("")}</div>
      <p><b>4 jours de pratique sur 7.</b> Belle régularité !</p>
      <div><b>Ce qui a été travaillé</b><ul class="plain par-list small"><li>• Équations du 1er degré</li><li>• Théorème de Pythagore</li></ul></div>
      <div class="par-fete"><span>🏅</span><div><b>À fêter</b><div class="small">Une erreur du carnet réussie deux fois de suite : effacée !</div></div></div></div>
    <p class="small"><b>Ce que vous ne verrez pas</b> : ni notes, ni score, ni heures de connexion, ni liste de fautes. L'effort et les progrès, c'est tout.</p>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🤝 Résoudre ensemble</div><h2>Un problème qui lui a résisté ? Faites-le à deux.</h2>
    <p class="small muted">Pas besoin de vous souvenir du cours : l'app vous donne les questions à poser, les indices un par un, le piège fréquent, et la solution pour vous seul. Essayez :</p>
    ${pzGrades("pzg2")}
    <div id="pzsolve"></div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">💡 Pour l'accompagner</div><h2>Trois gestes qui comptent</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>👏 Valoriser l'effort</b><p class="small">« Tu t'es entraîné 4 jours cette semaine, bravo » plutôt que « combien tu as eu ? ».</p></div>
      <div class="card flat"><b>🗣️ Le laisser expliquer</b><p class="small">C'est en expliquant qu'on comprend. Faites l'élève, il fait le prof.</p></div>
      <div class="card flat"><b>🤐 Ne pas donner la réponse</b><p class="small">Un indice, une question, puis on attend. La réponse trouvée seul vaut dix réponses données.</p></div>
      <div class="card flat"><b>🎲 Un moment partagé</b><p class="small">Chaque semaine, une question curieuse à parier en famille et une histoire des maths à raconter.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🚀 Mise en route</div><h2>Trois étapes, une seule fois</h2>
    <ol class="pz-list pz-anim"><li><b>Installez l'app sur son téléphone</b> (QR code ci-dessous).</li>
    <li><b>Choisissez ensemble</b> sa classe, le chapitre en cours et la date de la prochaine évaluation.</li>
    <li><b>Chaque semaine</b>, il vous envoie son lien : dans l'app, Progrès → « 👪 Envoyer à mes parents ». Il voit exactement ce que vous verrez.</li></ol>
    <p class="small muted">Plusieurs enfants ? Leurs liens se rangent côte à côte, sur votre téléphone seulement.</p>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔒 Confidentialité</div><h2>Rien ne quitte son téléphone sans lui</h2>
    <ul class="plain pz-list pz-anim"><li>✅ Pas de compte, pas de nom, pas d'adresse mail, pas de publicité.</li><li>✅ La progression est enregistrée sur l'appareil ; le lien qu'il vous envoie est une « photo » de sa semaine, lue sur votre téléphone sans passer par un serveur.</li>
    <li>✅ Des statistiques anonymes d'utilisation seulement avec son accord.</li></ul>
  </section>

  <section class="pz-s pz-end">
    <div class="eyebrow">📲 Pour commencer</div><h2>L'app, sur le téléphone de votre enfant</h2>
    ${pzInstall("parent")}
    <div class="actions"><button type="button" class="btn-sec" id="pzgot">J'ai reçu un lien de mon enfant</button><button type="button" class="btn-ghost pz-exit">Retour à l'app</button></div>
  </section>
  </div>`);
  const root = document.getElementById("pz"), box = document.getElementById("pzsolve");
  pzBind(root);
  root.querySelectorAll("#pzg2 button").forEach((b) => (b.onclick = () => { PZ.grade = +b.dataset.v; root.querySelectorAll("#pzg2 button").forEach((x) => x.setAttribute("aria-pressed", x === b)); pzSolve(box); }));
  document.getElementById("pzgot").onclick = () => { pzStop(); location.hash = "#parent"; };
  pzSolve(box);
}
