// 25.11 : supports de présentation, dans l'app elle-même (demande de l'enseignant : « à destination élève et parent »,
// le format le plus dynamique). Deux pages publiques, sans rien enregistrer :
//   …/#decouvrir : présentation aux élèves (projetable en classe), avec une vraie question à essayer ;
//   …/#parents   : « Je suis parent » (ce que l'app apporte, Résoudre ensemble en direct, mise en route en 3 étapes).
//   …/#enseignants : présentation aux collègues (25.11, « deux publics distincts : professionnels et parents ») :
//   principes, démonstration, couverture des plans d'études calculée en direct, différenciation, qualité, données, limites.
// Bouton « ▶ Présenter » : une diapositive par écran, flèches / espace / clic pour avancer (réunion de parents, classe).
// Rien n'est envoyé depuis ces pages (voir canSend et ping dans app.js).

const PZ = {
  url() { return location.origin + location.pathname; },
  qr(u) { try { return typeof QR !== "undefined" ? QR.svg(u) : ""; } catch (e) { return ""; } },
  grade: null,
  on: false,
  /* 25.11 soir (séparation complète France / romand) : un profil France voit des présentations françaises. */
  fr() { return !!(typeof state !== "undefined" && state && state.profile && state.profile.system === "FR"); },
};

function presentRoute() {
  if (location.hash === "#decouvrir") { screenDecouvrir(); return true; }
  if (location.hash === "#parents") { screenParents(); return true; }
  if (location.hash === "#enseignants") { screenEnseignants(); return true; }
  return false;
}

const pzExit = () => { pzStop(); history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };

function pzStop() { PZ.on = false; document.body.classList.remove("pz-on"); }
window.addEventListener("hashchange", () => { if (!/^#(decouvrir|parents|enseignants)$/.test(location.hash)) pzStop(); });

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
    if (!PZ.on || !/^#(decouvrir|parents|enseignants)$/.test(location.hash)) return;
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

const pzGrades = (id) => `<div class="seg pz-grades" id="${id}">${(PZ.fr() ? [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"], [12, "Tle"]] : [[9, "9e"], [10, "10e"], [11, "11e"], [12, "Collège / MP"]]).map(([g, l]) => `<button type="button" aria-pressed="${g === PZ.grade}" data-v="${g}">${l}</button>`).join("")}</div>`;

function pzQuestion() {
  if (PZ.fr()) return pzQuestionFR();
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

/* Question de démonstration d'un profil France : une notion ouverte de la classe choisie (catalogue français). */
function pzQuestionFR() {
  const g = PZ.grade || state.profile.grade, st = Engine.newState({ system: "FR", grade: g, track: "college", minutes: 5 });
  Engine.autoInit(st);
  const pool = Object.keys(st.notions).filter((id) => ["vu", "encours"].includes(st.notions[id].status) && GEN[id]);
  for (let k = 0; k < 40 && pool.length; k++) {
    const id = pool[Math.floor(Math.random() * pool.length)];
    let q; try { q = Engine.build(id, 1, 1 + Math.floor(Math.random() * 46655)); } catch (e) { continue; }
    if (q && q.spec && q.spec.kind === "value" && !q.parts && q.guide && q.guide.length) return Engine.finalize(st, id, q);
  }
  return Engine.finalize(st, "prio", Engine.build("prio", 1, 7));
}

const pzInstall = (who) => {
  const u = PZ.url(), qr = PZ.qr(u);
  return `<div class="pz-install">${qr ? `<div class="pz-qr" aria-label="QR code de l'application">${qr}</div>` : ""}
    <div class="stack"><p class="pz-url"><b>${esc(u.replace(/^https?:\/\//, ""))}</b></p>
    <ol class="small pz-steps"><li>Ouvrir le lien ${who === "parent" ? "sur le téléphone de votre enfant" : who === "prof" ? "sur votre téléphone" : "sur ton téléphone"} (ou scanner le QR code).</li>
    <li><b>Android</b> : menu ⋮ → « Ajouter à l'écran d'accueil ». <b>iPhone</b> : bouton Partager → « Sur l'écran d'accueil ».</li>
    <li>${who === "parent" ? "Choisir ensemble sa classe et le chapitre en cours : c'est prêt." : who === "prof" ? "Choisir une classe : vous voyez exactement ce que voient vos élèves." : "Choisis ta classe et le chapitre en cours : c'est parti."}</li></ol></div></div>`;
};

function screenDecouvrir() {
  h(`<div class="pz" id="pz" data-noloc>
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">${PZ.fr() ? "Pour les élèves · de la 6e à la terminale" : "Pour les élèves · 9e à 4e, Collège et MP"}</div>
    <h1 class="pz-big">Chaque jour, <span class="mark">5 minutes</span> de maths.<br>Juste à ton niveau.</h1>
    <p class="muted">Une question choisie pour toi, une correction tout de suite, et l'app t'aide étape par étape quand tu bloques.</p>
    <div class="pz-chips pz-anim"><span>📱 sur ton téléphone</span><span>🙈 sans compte, sans nom</span><span>🆓 gratuit, sans pub</span><span>📚 ${PZ.fr() ? "programmes officiels" : "plan d'études genevois"}</span></div>
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
  h(`<div class="pz" id="pz" data-noloc>
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">👪 Je suis parent</div>
    <h1 class="pz-big">Accompagner son enfant en maths,<br><span class="mark">2 minutes</span> par semaine.</h1>
    <p class="muted">Votre enfant s'entraîne 5 minutes par jour, à son niveau, sur le programme de sa classe. Vous, vous l'encouragez, et vous pouvez résoudre un problème avec lui, même sans être fort en maths.</p>
    <div class="pz-chips pz-anim"><span>🤝 accompagner, pas surveiller</span><span>🆓 gratuit, sans compte</span><span>📚 ${PZ.fr() ? "programmes officiels, de la 6e à la terminale" : "plan d'études genevois, 9e → 4e, Collège et MP"}</span></div>
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

// ---------------- Présentation aux enseignants (25.11) ----------------
/* Nombre de notions travaillées dans l'année, par classe (calculé sur le référentiel, jamais écrit à la main). */
function pzCoverage() {
  const P = PZ.fr() ? [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"], [12, "Terminale"]].map(([g, l]) => [l, { system: "FR", grade: g, track: "college" }]) : [["9e", { system: "CH", grade: 9, track: "college" }], ["10e", { system: "CH", grade: 10, track: "college" }], ["11e", { system: "CH", grade: 11, track: "college" }],
    ["1re Collège", { system: "CH", grade: 12, track: "college" }], ["2e Collège", { system: "CH", grade: 13, track: "college" }], ["3e Collège", { system: "CH", grade: 14, track: "college" }], ["4e Collège", { system: "CH", grade: 15, track: "college" }],
    ["MP 1re", { system: "CH", grade: 12, track: "mp" }], ["MP 2e", { system: "CH", grade: 13, track: "mp" }], ["MP 3e", { system: "CH", grade: 14, track: "mp" }], ["MP 4e", { system: "CH", grade: 15, track: "mp" }]];
  return P.map(([l, p]) => { let n = 0, ch = 0; try { const c = Engine.catalog(p).filter((x) => x.current); n = c.length; ch = new Set(c.map((x) => x.theme)).size; } catch (e) {} return [l, n, ch]; }).filter(([, n]) => n > 0);
}
/* La boucle d'une séance, en schéma (SVG, couleurs du thème). */
function pzLoop() {
  const N = [["🎯", "Question", "à son niveau"], ["✍️", "Réponse", "résultat, pas le calcul"], ["🔎", "Diagnostic", "le piège repéré"], ["🪜", "Pas à pas", "une étape à la fois"], ["📕", "Carnet", "revient plus tard"]];
  const R = 112, cx = 170, cy = 150;
  const pos = N.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N.length; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
  const arcs = pos.map(([x, y], i) => { const [x2, y2] = pos[(i + 1) % N.length], mx = (x + x2) / 2, my = (y + y2) / 2, k = 1.18; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} Q${(cx + (mx - cx) * k).toFixed(0)} ${(cy + (my - cy) * k).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}" class="pz-loop-arc"/>`; }).join("");
  const nodes = pos.map(([x, y], i) => `<g class="pz-loop-n" style="--d:${i * 0.15}s"><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="33"/><text x="${x.toFixed(0)}" y="${(y - 6).toFixed(0)}" text-anchor="middle" font-size="18">${N[i][0]}</text><text x="${x.toFixed(0)}" y="${(y + 14).toFixed(0)}" text-anchor="middle" font-size="11" font-weight="700">${N[i][1]}</text></g>`).join("");
  const legend = N.map((n) => `<li><b>${n[0]} ${n[1]}</b> : ${n[2]}</li>`).join("");
  return `<div class="pz-loop pz-anim"><svg viewBox="0 0 340 300" role="img" aria-label="Boucle d'une séance : question, réponse, diagnostic, pas à pas, carnet d'erreurs">${arcs}${nodes}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" font-weight="800" class="pz-loop-c">5 minutes</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="11" class="pz-loop-c">chaque jour</text></svg><ul class="plain small pz-loop-l">${legend}</ul></div>`;
}
/* Compteurs qui montent quand la section arrive à l'écran. */
function pzCount(root) {
  const run = (el) => { const to = +el.dataset.to, t0 = performance.now(), D = 900; const f = (t) => { const k = Math.min(1, (t - t0) / D); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString("fr-CH"); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const els = root.querySelectorAll(".pz-num[data-to]");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => (e.textContent = (+e.dataset.to).toLocaleString("fr-CH"))); return; }
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: 0.4 });
  els.forEach((e) => io.observe(e));
}
const PZ_COV_PROFILES_FR = [6, 7, 8, 9, 10, 11, 12].map((g) => ({ system: "FR", grade: g, track: "college" }));
const PZ_COV_PROFILES = [9, 10, 11, 12, 13, 14, 15].map((g) => ({ system: "CH", grade: g, track: "college" })).concat([12, 13, 14, 15].map((g) => ({ system: "CH", grade: g, track: "mp" })));
const pzCovHtml = (cov) => { const maxN = Math.max(1, ...cov.map(([, n]) => n)); return cov.map(([l, n, ch]) => `<div class="pz-cov-r"><span>${esc(l)}</span><span class="pz-cov-b"><i style="width:${Math.round((n / maxN) * 100)}%"></i></span><span class="small">${n} notions · ${ch} chap.</span></div>`).join(""); };
const pzNotionCount = () => {
  if (!PZ.fr()) return NOTIONS.filter((n) => n.CH || n.MP).length;
  const ids = new Set(); PZ_COV_PROFILES_FR.forEach((p) => { try { Engine.catalog(p).filter((c) => c.current).forEach((c) => ids.add(c.id)); } catch (e) {} }); return ids.size;
};
function screenEnseignants() {
  const cov = pzCoverage(), nNotions = pzNotionCount(), nClasses = PZ.fr() ? 7 : 11;
  h(`<div class="pz" id="pz" data-noloc>
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">👩‍🏫 ${PZ.fr() ? "Pour les enseignant·es · collège et lycée" : "Pour les enseignant·es · secondaire I et II"}</div>
    <h1 class="pz-big">Un entraînement quotidien,<br><span class="mark">aligné sur votre programme</span>,<br>que vos élèves font vraiment.</h1>
    <p class="muted">5 minutes par jour sur le téléphone : des questions au niveau de chaque élève, une correction immédiate et une aide pas à pas. Pour vous, aucune préparation ni correction, et aucune donnée d'élève à gérer.</p>
    <div class="pz-nums pz-anim"><div><span class="pz-num" id="pznn" data-to="${nNotions}">${nNotions}</span><small>notions</small></div><div><span class="pz-num" data-to="${nClasses}">${nClasses}</span><small>${PZ.fr() ? "classes, de la 6e à la terminale" : "classes, de la 9e à la 4e (CO, Collège, MP)"}</small></div><div><span class="pz-num" data-to="0">0</span><small>compte à créer</small></div></div>
    <button type="button" class="btn-primary pz-next">Découvrir ↓</button>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🧠 Les principes</div><h2>Ce que la recherche recommande, en 5 minutes</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🔁 Récupérer en mémoire</b><p class="small">Répondre à une question fixe mieux que relire. Chaque séance est faite de questions, pas de lecture.</p></div>
      <div class="card flat"><b>📆 Espacer</b><p class="small">Une notion revient plusieurs jours plus tard, au moment où elle risque de s'oublier. Les notions des années précédentes reviennent quand c'est utile.</p></div>
      <div class="card flat"><b>🔀 Alterner</b><p class="small">Les notions sont mélangées dans une séance : l'élève doit reconnaître la méthode, pas seulement l'appliquer.</p></div>
      <div class="card flat"><b>⚡ Corriger tout de suite</b><p class="small">La correction est immédiate et ciblée : l'app repère l'erreur typique et la nomme.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔄 Une séance</div><h2>La boucle d'une séance</h2>
    ${pzLoop()}
  </section>

  <section class="pz-s">
    <div class="eyebrow">🎯 Démonstration</div><h2>Essayez comme un élève</h2>
    <p class="small muted">Choisissez une classe et répondez. Faites exprès une erreur classique pour voir le diagnostic, puis « On le fait ensemble ».</p>
    ${pzGrades("pzg3")}
    <div id="pztry"></div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">📚 Votre programme</div><h2>${PZ.fr() ? "Les programmes, classe par classe" : "Le plan d'études, classe par classe"}</h2>
    <p class="small muted">${PZ.fr() ? "Programmes officiels : cycle 3 (2025), cycle 4 (2026 en 5e ; 2019 en 4e et 3e), lycée (2026). Notions travaillées dans l'année :" : "Plan d'études romand (CO), plans du Collège de Genève et de la maturité professionnelle. Notions travaillées dans l'année :"}</p>
    <div class="pz-cov pz-anim" id="pzcov">${pzCovHtml(cov)}</div>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🏫 « En ce moment en classe »</b><p class="small">L'élève reconnaît son chapitre à un exercice typique : environ 2 questions sur 3 portent alors dessus.</p></div>
      <div class="card flat"><b>📝 « Mon évaluation »</b><p class="small">Il donne la date et les notions de votre évaluation : révision jour après jour, puis un sujet de préparation corrigé.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🪜 Différenciation</div><h2>Chaque élève à son niveau, sans rien régler</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>📈 Quatre niveaux par notion</b><p class="small">De l'automatisme au défi. Le Mathélo de l'élève monte ou descend selon ses réponses, et les questions suivent.</p></div>
      <div class="card flat"><b>🧩 Élève en difficulté</b><p class="small">Le diagnostic, puis le pas à pas, le rappel de cours et une leçon active à manipuler. Il retente avec d'autres nombres.</p></div>
      <div class="card flat"><b>🚀 Élève rapide</b><p class="small">Des défis de niveau 4, le problème de la semaine, des questions curieuses et des histoires des maths.</p></div>
      <div class="card flat"><b>🧮 Le résultat, pas le calcul</b><p class="small">Quand c'est le calcul qu'on évalue, l'élève tape le résultat sur un clavier sans opérations : la calculatrice ne fait pas le travail à sa place.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">✅ Qualité</div><h2>Des questions vérifiées, jamais deux fois les mêmes</h2>
    <ul class="plain pz-list pz-anim"><li>🎲 <b>Valeurs tirées au hasard</b> dans des plages choisies : jamais de cas trivial (0, 1, réponse déjà dans l'énoncé).</li>
    <li>📏 <b>Niveau calé sur les vraies évaluations</b> de chaque classe, notion par notion.</li>
    <li>🤖 <b>Des tests automatiques</b> avant chaque mise à jour, et un élève-robot qui parcourt toutes les classes : textes, figures, réponses acceptées, affichage sur téléphone.</li>
    <li>👍 <b>Les élèves jugent</b> : un pouce et un commentaire sur chaque question, lus et traités.</li></ul>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔒 Données</div><h2>Rien à déclarer, rien à gérer</h2>
    <ul class="plain pz-list pz-anim"><li>✅ Ni compte, ni nom, ni adresse mail. La progression reste sur le téléphone de l'élève.</li>
    <li>✅ Des statistiques anonymes d'usage, seulement avec l'accord de l'élève, qu'il peut couper.</li>
    <li>✅ Pas de publicité, pas de service tiers. Les polices et les formules sont servies par le site de l'app.</li>
    <li>✅ Les parents ne voient la semaine de l'enfant que s'il la leur envoie.</li></ul>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🧭 Honnêtement</div><h2>Ce que l'app ne fait pas</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>Remplacer le cours</b><p class="small">Elle entraîne ce qui a été vu en classe ; elle n'introduit pas une notion à votre place.</p></div>
      <div class="card flat"><b>Noter vos élèves</b><p class="small">Pas de note ni de classement. Le Mathélo est un repère pour l'élève, pas une évaluation.</p></div>
      <div class="card flat"><b>Suivre une classe</b><p class="small">Il n'y a pas de tableau de bord enseignant : sans compte, aucune donnée nominative ne remonte.</p></div>
      <div class="card flat"><b>Tout évaluer</b><p class="small">Constructions, raisonnements rédigés et démonstrations restent l'affaire de la classe.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🚀 En classe</div><h2>Lancer l'app avec une classe</h2>
    <ol class="pz-list pz-anim"><li><b>Présentez-la</b> avec la page élèves, projetable avec son QR code : <a href="#decouvrir">…/#decouvrir</a>.</li>
    <li><b>Installez-la ensemble</b> en 5 minutes : classe, chapitre en cours, date de la prochaine évaluation.</li>
    <li><b>Rappelez-la</b> au début d'un chapitre et une semaine avant chaque évaluation.</li>
    <li><b>Informez les familles</b> avec la page parents : <a href="#parents">…/#parents</a>.</li></ol>
  </section>

  <section class="pz-s pz-end">
    <div class="eyebrow">📲 Pour l'essayer</div><h2>Ouvrez-la sur votre téléphone</h2>
    ${pzInstall("prof")}
    <div class="actions"><button type="button" class="btn-primary pz-exit">Essayer l'app</button></div>
  </section>
  </div>`);
  const root = document.getElementById("pz"), box = document.getElementById("pztry");
  pzBind(root); pzCount(root);
  /* Les notions de 3e–4e Collège et de MP 3e–4e sont dans des paquets chargés à la demande : on les charge, puis on recompte. */
  if (typeof window.ensurePacks === "function") (PZ.fr() ? PZ_COV_PROFILES_FR : PZ_COV_PROFILES).reduce((pr, p) => pr.then(() => window.ensurePacks(p)).catch(() => {}), Promise.resolve()).then(() => {
    if (location.hash !== "#enseignants") return;
    const el = document.getElementById("pzcov"); if (el) el.innerHTML = pzCovHtml(pzCoverage());
    const nn = document.getElementById("pznn"); if (nn) { nn.dataset.to = pzNotionCount(); nn.textContent = (+nn.dataset.to).toLocaleString("fr-CH"); }
  });
  root.querySelectorAll("#pzg3 button").forEach((b) => (b.onclick = () => { PZ.grade = +b.dataset.v; root.querySelectorAll("#pzg3 button").forEach((x) => x.setAttribute("aria-pressed", x === b)); pzTry(box); }));
  pzTry(box);
}
