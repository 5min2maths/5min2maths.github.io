// Leçons actives (14.11, demande de l'utilisateur : « l'élève doit être actif ») : trois temps.
// 1. Devine : une question à toucher avant toute règle. 2. Manipule : des défis à réussir avec les doigts.
// 3. Retiens : la règle, les exemples et le piège arrivent après. Prototype : fractout, prio.
// ACTIVE[id] = { predict: { q, choices, good, why }, defis: [texte…], play(box, onWin) }.
// play dessine la manipulation dans box et appelle onWin(i) quand le défi i est réussi (dans l'ordre).
// Pas de TeX dans ce qui est redessiné à chaque geste (pas de MathJax à relancer).

const ACTIVE = {
  fractout: {
    predict: { q: "Les trois quarts de 20, ça fait combien ?", choices: ["5", "15", "23"], good: 1,
      why: "On partage 20 en 4 parts égales de 5, et on en prend 3 : 15." },
    defis: ["Colorie les 2/3 de 24.", "Trouve une fraction de 24 qui vaut 18."],
    play(box, onWin) {
      const n = 24, Bs = [2, 3, 4, 6, 8];
      let b = 4, sel = new Set(), step = 0;
      const draw = () => {
        const W = 320, x0 = 10, w = 300, cw = w / b, part = n / b, a = sel.size;
        let g = '<path d="M' + x0 + ",34 q0,-8 8,-8 L" + (x0 + w / 2 - 8) + ",26 q8,0 8,-8 q0,8 8,8 L" + (x0 + w - 8) + ",26 q8,0 8,8" + '" class="f-line" fill="none" stroke-width="1.6"/>';
        g += '<text x="' + (x0 + w / 2) + '" y="12" class="f-txt" text-anchor="middle" font-size="14">24</text>';
        for (let k = 0; k < b; k++) {
          const on = sel.has(k);
          g += '<g class="act-part" data-k="' + k + '" style="cursor:pointer"><rect x="' + (x0 + k * cw) + '" y="40" width="' + cw + '" height="44" class="' + (on ? "f-fill" : "f-soft") + '" stroke="var(--ink)" stroke-width="1.5"/>';
          g += '<text x="' + (x0 + k * cw + cw / 2) + '" y="67" class="' + (on ? "f-on" : "f-txt") + '" text-anchor="middle" font-size="14">' + part + "</text></g>";
        }
        box.innerHTML = `<div class="small muted">Découpe 24 en</div>
          <div class="seg act-b">${Bs.map((v) => `<button type="button" data-b="${v}" aria-pressed="${v === b}">${v} parts</button>`).join("")}</div>
          <svg class="fig" viewBox="0 0 ${W} 92" role="img" aria-label="barre de 24 découpée en ${b} parts">${g}</svg>
          <div class="act-out"><b>${a}/${b}</b> de 24 = <b>${a} · ${part} = ${a * part}</b> <span class="small muted">· touche les parts pour les prendre</span></div>`;
        box.querySelectorAll(".act-b button").forEach((el) => (el.onclick = () => { b = +el.dataset.b; sel = new Set(); draw(); }));
        box.querySelectorAll(".act-part").forEach((el) => (el.onclick = () => { const k = +el.dataset.k; sel.has(k) ? sel.delete(k) : sel.add(k); draw(); check(); }));
      };
      const check = () => {
        const a = sel.size, val = (a * n) / b;
        if (step === 0 && a * 3 === 2 * b) { onWin(0, b === 3 ? "Bravo : 3 parts de 8, tu en prends 2, ça fait 16." : "Bravo : " + a + "/" + b + " = 2/3, ça fait bien 16."); step = 1; }
        else if (step === 1 && val === 18) { onWin(1, a + "/" + b + " de 24 = 18. " + (b === 4 ? "Avec 8 parts, 6/8 marche aussi !" : "Avec 4 parts, 3/4 marche aussi !")); step = 2; }
      };
      draw();
    },
  },

  prio: {
    predict: { q: "Combien fait 2 + 3 · 4 ?", choices: ["20", "14"], good: 1,
      why: "La multiplication passe avant l'addition : 3 · 4 = 12, puis 2 + 12 = 14." },
    defis: ["Sans parenthèses, 2 + 3 · 4 − 1 vaut 13. Place des parenthèses pour obtenir 19.", "Et maintenant pour obtenir 11."],
    play(box, onWin) {
      const nums = [2, 3, 4, 1], ops = ["+", "·", "−"];
      let open = null, close = null, pend = null, step = 0;
      const expr = (js) => nums.map((v, i) => (open === i ? "(" : "") + v + (close === i ? ")" : "") + (i < ops.length ? (js ? { "+": "+", "·": "*", "−": "-" }[ops[i]] : " " + ops[i] + " ") : "")).join("");
      const value = () => Function("return " + expr(true))();
      const draw = () => {
        const toks = nums.map((v, i) => `${open === i ? '<span class="act-par">(</span>' : ""}<button type="button" class="act-num${pend === i ? " on" : ""}" data-i="${i}">${v}</button>${close === i ? '<span class="act-par">)</span>' : ""}${i < ops.length ? `<span class="act-op">${ops[i]}</span>` : ""}`).join("");
        const v = value();
        box.innerHTML = `<div class="act-expr">${toks}<span class="act-op">=</span><b class="act-val">${v}</b></div>
          <div class="small muted">${pend !== null ? "Touche le nombre où la parenthèse se ferme." : "Touche le nombre où la parenthèse s'ouvre, puis celui où elle se ferme."}</div>
          ${open !== null ? '<button type="button" class="btn-ghost small act-reset">Enlever les parenthèses</button>' : ""}`;
        box.querySelectorAll(".act-num").forEach((el) => (el.onclick = () => {
          const i = +el.dataset.i;
          if (pend === null) { pend = i; open = close = null; }
          else if (i === pend) pend = null;
          else { open = Math.min(pend, i); close = Math.max(pend, i); pend = null; if (open === 0 && close === nums.length - 1) open = close = null; }
          draw(); check();
        }));
        const r = box.querySelector(".act-reset"); if (r) r.onclick = () => { open = close = pend = null; draw(); };
      };
      const check = () => {
        if (open === null) return;
        const v = value();
        if (step === 0 && v === 19) { onWin(0, expr(false) + " : la parenthèse se calcule d'abord, 5 · 4 = 20, puis 20 − 1 = 19."); step = 1; }
        else if (step === 1 && v === 11) { onWin(1, expr(false) + " : 4 − 1 = 3, puis 3 · 3 = 9, puis 2 + 9 = 11."); step = 2; }
      };
      draw();
    },
  },
};

// Écran de leçon active. cont : suite de la séance.
function activeLesson(id, L, cont) {
  const A = ACTIVE[id], P = A.predict;
  const ss = sentences(L.regle);
  const rule = ss.length > 1 ? "<ul>" + ss.map((x) => "<li>" + x + "</li>").join("") + "</ul>" : " · " + L.regle;
  const tail = lessonBody(id), fb = tail.slice(tail.indexOf('<div class="lfb"'));
  h(`${brand}<div class="eyebrow">Nouvelle notion · à toi de jouer</div>
  <div class="card pop lesson-card stack"><h2>${L.titre}</h2>
    <div class="act-step"><div class="act-h"><span class="act-n">1</span> Devine</div><p>${P.q}</p>
      <div class="seg" id="pc">${P.choices.map((c, i) => `<button type="button" data-i="${i}">${c}</button>`).join("")}</div><div id="pfb"></div></div>
    <div class="act-step" id="s2" hidden><div class="act-h"><span class="act-n">2</span> Manipule</div>
      <p class="act-goal" id="goal"></p><div id="play" class="stack"></div><div id="gfb"></div>
      <button type="button" class="btn-ghost small" id="skip">Passer les défis</button></div>
    <div class="act-step" id="s3" hidden><div class="act-h"><span class="act-n">3</span> Retiens</div>
      <div class="rule"><b>À retenir</b>${rule}</div>
      <div class="ex-list">${L.exemple.map((e) => `<div>${e}</div>`).join("")}</div>
      <div class="trap"><b>Piège</b> · ${L.piege}</div>${fb}</div>
  </div>
  <button class="btn-primary btn-big" id="go" hidden>J'ai compris, à moi !</button>`);
  const $ = (s) => document.getElementById(s);
  const reveal = (el) => { el.hidden = false; el.classList.add("pop"); setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60); };
  const finish = () => { $("skip").hidden = true; reveal($("s3")); typeset($("s3")); $("go").hidden = false; };
  let started = false;
  app.querySelectorAll("#pc button").forEach((b) => (b.onclick = () => {
    const i = +b.dataset.i, ok = i === P.good;
    app.querySelectorAll("#pc button").forEach((x) => { x.disabled = true; if (+x.dataset.i === P.good) x.setAttribute("aria-pressed", "true"); });
    if (!ok) b.classList.add("act-wrong");
    $("pfb").innerHTML = `<div class="fb ${ok ? "ok" : "hint"}">${ok ? "Exact !" : "Pas tout à fait."} ${P.why}</div>`;
    if (started) return; started = true;
    $("goal").textContent = "Défi 1 · " + A.defis[0];
    reveal($("s2"));
    A.play($("play"), (k, msg) => {
      $("gfb").innerHTML = `<div class="fb ok">✓ ${msg}</div>`;
      if (k + 1 < A.defis.length) $("goal").textContent = "Défi " + (k + 2) + " · " + A.defis[k + 1];
      else { $("goal").textContent = "Défis réussis !"; burst(); finish(); }
    });
  }));
  $("skip").onclick = finish;
  $("go").onclick = cont;
}
