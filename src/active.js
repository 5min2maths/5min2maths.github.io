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

// ---- 9e · 4. Arithmétique (14.11) ----
// Petit compteur − valeur + (réutilisé par plusieurs manipulations).
const actStepper = (label, v, id) => `<div class="act-stepper"><span class="small muted">${label}</span><button type="button" data-st="${id}" data-d="-1" aria-label="moins">−</button><b>${v}</b><button type="button" data-st="${id}" data-d="1" aria-label="plus">+</button></div>`;
const actBindStepper = (box, id, get, set, min, max) => box.querySelectorAll('[data-st="' + id + '"]').forEach((b) => (b.onclick = () => set(Math.max(min, Math.min(max, get() + +b.dataset.d)))));

Object.assign(ACTIVE, {
  multdiv: {
    predict: { q: "7 est-il un diviseur de 84 ?", choices: ["Oui", "Non"], good: 0, why: "84 = 7 · 12 : la division de 84 par 7 tombe juste, donc 7 divise 84." },
    defis: ["Range 12 jetons en rectangle de toutes les façons possibles.", "Même jeu avec 18 jetons : trouve tous ses diviseurs."],
    play(box, onWin) {
      let n = 12, r = 3, found = new Set(), step = 0;
      const draw = () => {
        const c = Math.ceil(n / r), full = n % r === 0, sz = Math.min(26, 300 / c, 200 / r), W = 320, H = r * sz + 8;
        let g = "";
        for (let k = 0; k < n; k++) { const i = Math.floor(k / c), j = k % c; g += '<circle cx="' + (10 + j * sz + sz / 2).toFixed(1) + '" cy="' + (4 + i * sz + sz / 2).toFixed(1) + '" r="' + (sz * 0.38).toFixed(1) + '" class="' + (full ? "f-fill" : i === r - 1 && n % c ? "f-dot" : "f-fill2") + '"/>'; }
        const divs = [...found].sort((a, b) => a - b);
        box.innerHTML = actStepper("Rangées", r, "r") + `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${n} jetons en ${r} rangées">${g}</svg>
          <div class="act-out">${full ? `<b>${r} rangées de ${n / r}</b> : ${n} = ${r} · ${n / r} ✓` : `${r} rangées : il reste un trou, ${r} ne divise pas ${n}.`}</div>
          <div class="small">Diviseurs de ${n} trouvés : ${divs.length ? divs.map((d) => `<b>${d}</b>`).join(", ") : "aucun pour l'instant"}</div>`;
        actBindStepper(box, "r", () => r, (v) => { r = v; if (n % r === 0) found.add(r).add(n / r); draw(); check(); }, 1, n);
      };
      const check = () => {
        const all = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
        if (all.every((d) => found.has(d))) {
          if (step === 0) { onWin(0, "Les diviseurs de 12 : 1, 2, 3, 4, 6, 12. Ils vont par paires : 1 · 12, 2 · 6, 3 · 4."); step = 1; n = 18; r = 2; found = new Set([2, 9]); draw(); }
          else if (step === 1) { onWin(1, "Diviseurs de 18 : 1, 2, 3, 6, 9, 18 (paires 1 · 18, 2 · 9, 3 · 6)."); step = 2; }
        }
      };
      found.add(3).add(4); draw();
    },
  },

  divcrit: {
    predict: { q: "471 est-il divisible par 3 ?", choices: ["Oui", "Non"], good: 0, why: "4 + 7 + 1 = 12, et 12 est divisible par 3 : 471 = 3 · 157." },
    defis: ["Change un seul chiffre de 472 pour qu'il devienne divisible par 9.", "Fabrique un nombre divisible à la fois par 2, 3 et 5."],
    play(box, onWin) {
      const start = [4, 7, 2];
      let d = start.slice(), step = 0;
      const draw = () => {
        const n = +d.join(""), s = d.reduce((a, b) => a + b, 0);
        const tests = [[2, "dernier chiffre pair"], [3, "somme divisible par 3"], [5, "finit par 0 ou 5"], [9, "somme divisible par 9"], [10, "finit par 0"]];
        box.innerHTML = `<div class="act-expr">${d.map((v, i) => `<button type="button" class="act-num" data-i="${i}">${v}</button>`).join("")}</div>
          <div class="small muted" style="text-align:center">Touche un chiffre pour l'augmenter de 1.</div>
          <div class="act-out" style="text-align:center">Somme des chiffres : ${d.join(" + ")} = <b>${s}</b></div>
          <div class="act-lamps">${tests.map(([k, why]) => `<span class="act-lamp${n % k === 0 ? " on" : ""}" title="${why}">÷${k}</span>`).join("")}</div>`;
        box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; d[i] = (d[i] + 1) % 10; if (i === 0 && d[0] === 0) d[0] = 1; draw(); check(); }));
      };
      const check = () => {
        const n = +d.join(""), diff = d.filter((v, i) => v !== start[i]).length;
        if (step === 0) {
          if (n % 9 === 0 && diff <= 1) { onWin(0, n + " : somme " + d.reduce((a, b) => a + b, 0) + ", divisible par 9. Remarque : il est aussi divisible par 3 !"); step = 1; }
          else if (diff > 1) $hint(box, "Un seul chiffre doit changer : remets les autres comme dans 472.");
        } else if (step === 1 && n % 30 === 0) { onWin(1, n + " : il finit par 0 (donc ÷2 et ÷5) et la somme de ses chiffres est divisible par 3."); step = 2; }
      };
      draw();
    },
  },

  premiers: {
    predict: { q: "91 est-il un nombre premier ?", choices: ["Oui", "Non"], good: 1, why: "91 = 7 · 13 : il a d'autres diviseurs que 1 et lui-même." },
    defis: ["Casse 84 en nombres premiers.", "À toi : casse 90."],
    play(box, onWin) {
      const isP = (x) => x > 1 && Array.from({ length: Math.floor(Math.sqrt(x)) - 1 }, (_, i) => i + 2).every((k) => x % k);
      let n = 84, leaves = [84], hist = [], pick = null, msg = "", step = 0;
      const pow = (ls) => { const c = {}; ls.forEach((x) => (c[x] = (c[x] || 0) + 1)); return Object.keys(c).map(Number).sort((a, b) => a - b).map((p) => p + (c[p] > 1 ? "<sup>" + c[p] + "</sup>" : "")).join(" · "); };
      const draw = () => {
        const done = leaves.every(isP);
        box.innerHTML = `<div class="act-ladder">${hist.map((h, i) => `<div>${i ? "=" : n + " ="} ${h}</div>`).join("")}</div>
          <div class="act-expr">${hist.length ? "=" : n + " ="} ${leaves.map((x, i) => isP(x) ? `<span class="act-prime">${x}</span>` : `<button type="button" class="act-num${pick === i ? " on" : ""}" data-i="${i}">${x}</button>`).join('<span class="act-op">·</span>')}</div>
          ${pick !== null ? `<div class="seg" style="justify-content:center">${[2, 3, 5, 7].map((p) => `<button type="button" data-p="${p}">÷ ${p}</button>`).join("")}</div>` : `<div class="small muted" style="text-align:center">${done ? "Que des nombres premiers : " + n + " = " + pow(leaves) : "Touche un nombre bleu pour le casser."}</div>`}
          <div class="small" style="text-align:center">${msg}</div>`;
        box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { pick = +b.dataset.i; msg = ""; draw(); }));
        box.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => {
          const p = +b.dataset.p, x = leaves[pick];
          if (x % p) { msg = x + " n'est pas divisible par " + p + " : essaie un autre nombre premier."; pick = null; draw(); return; }
          if (leaves.length > 1) hist.push(leaves.join(" · "));
          leaves.splice(pick, 1, p, x / p); leaves.sort((a, b) => (isP(b) - isP(a)) || a - b); pick = null; msg = ""; draw(); check();
        }));
      };
      const check = () => {
        if (!leaves.every(isP)) return;
        if (step === 0) { onWin(0, "84 = 2 · 2 · 3 · 7 = 2² · 3 · 7. Quel que soit l'ordre, on arrive toujours au même résultat."); step = 1; setTimeout(() => { n = 90; leaves = [90]; hist = []; draw(); }, 1600); }
        else if (step === 1) { onWin(1, "90 = 2 · 3² · 5."); step = 2; }
      };
      draw();
    },
  },

  arith: {
    predict: { q: "Un bus passe toutes les 6 min, un autre toutes les 8 min. Ils partent ensemble. Ils se retrouvent après…", choices: ["14 min", "24 min", "48 min"], good: 1,
      why: "Il faut un multiple commun de 6 et de 8, le plus petit : 24 (le PPMC)." },
    defis: ["Fais atterrir les deux grenouilles sur la même case (pas 0).", "Pave un rectangle 12 × 18 avec les plus grands carrés possibles."],
    play(box, onWin) {
      let a = 0, b = 0, s = 2, step = 0;
      const drawFrogs = () => {
        const W = 330, X = (v) => 12 + v * 6.1;
        let g = '<line x1="' + X(0) + '" y1="60" x2="' + X(50) + '" y2="60" class="f-line"/>';
        for (let v = 0; v <= 50; v += 2) g += '<line x1="' + X(v) + '" y1="' + (v % 10 ? 56 : 52) + '" x2="' + X(v) + '" y2="64" class="f-line"/>' + (v % 10 === 0 ? '<text x="' + X(v) + '" y="80" class="f-txt" text-anchor="middle" font-size="11">' + v + "</text>" : "");
        for (let v = 6; v <= a; v += 6) g += '<path d="M' + X(v - 6) + ",52 Q" + X(v - 3) + ",28 " + X(v) + ',52" class="f-line" fill="none" stroke-dasharray="3 3"/>';
        for (let v = 8; v <= b; v += 8) g += '<path d="M' + X(v - 8) + ",68 Q" + X(v - 4) + ",96 " + X(v) + ',68" class="f-accent" fill="none" stroke-dasharray="3 3"/>';
        g += '<circle cx="' + X(a) + '" cy="46" r="7" class="f-fill"/><circle cx="' + X(b) + '" cy="74" r="7" class="f-dot"/>';
        box.innerHTML = `<svg class="fig" viewBox="0 0 ${W} 100" role="img" aria-label="deux grenouilles sur une droite graduée">${g}</svg>
          <div class="seg" style="justify-content:center"><button type="button" id="ja">🔵 saute de 6</button><button type="button" id="jb">🔴 saute de 8</button><button type="button" class="btn-ghost" id="j0">Recommencer</button></div>
          <div class="act-out" style="text-align:center">🔵 sur <b>${a}</b> · 🔴 sur <b>${b}</b></div>`;
        box.querySelector("#ja").onclick = () => { if (a + 6 <= 50) a += 6; drawFrogs(); check(); };
        box.querySelector("#jb").onclick = () => { if (b + 8 <= 50) b += 8; drawFrogs(); check(); };
        box.querySelector("#j0").onclick = () => { a = b = 0; drawFrogs(); };
      };
      const drawTiles = () => {
        const L = 18, H = 12, k = 15, W = 330, nx = Math.ceil(L / s), ny = Math.ceil(H / s), ok = L % s === 0 && H % s === 0;
        let g = '<rect x="10" y="6" width="' + L * k + '" height="' + H * k + '" class="f-soft"/>';
        for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
          const x = 10 + j * s * k, y = 6 + i * s * k, out = (j + 1) * s > L || (i + 1) * s > H;
          g += '<rect x="' + x + '" y="' + y + '" width="' + s * k + '" height="' + s * k + '" class="' + (out ? "act-over" : "f-fill2") + '"/>';
        }
        g += '<rect x="10" y="6" width="' + L * k + '" height="' + H * k + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
        box.innerHTML = actStepper("Côté du carré", s, "s") + `<svg class="fig" viewBox="0 0 ${W} ${H * k + 12}" role="img" aria-label="rectangle 18 sur 12 pavé de carrés de côté ${s}">${g}</svg>
          <div class="act-out">${ok ? `Carrés de ${s} : ça tombe juste (${L} = ${L / s} · ${s} et ${H} = ${H / s} · ${s}).${s < 6 ? " Mais il y a plus grand !" : ""}` : `Carrés de ${s} : ça dépasse, ${s} ne divise pas ${L % s ? L : H}.`}</div>`;
        actBindStepper(box, "s", () => s, (v) => { s = v; drawTiles(); check(); }, 1, 12);
      };
      const check = () => {
        if (step === 0 && a && a === b) { onWin(0, "Les deux sur " + a + " : c'est un multiple de 6 et de 8. Le premier, 24, est le PPMC." + (a > 24 ? " (Tu as trouvé " + a + ", mais 24 vient avant.)" : "")); step = 1; setTimeout(drawTiles, 1600); }
        else if (step === 1 && s === 6) { onWin(1, "6 divise 12 et 18, et aucun carré plus grand ne tombe juste : 6 est le PGDC de 12 et 18."); step = 2; }
      };
      drawFrogs();
    },
  },
});
// ---- 2e · Cercles et tangentes (14.11, retour testeur « Je ne comprends pas la pente ») ----
Object.assign(ACTIVE, {
  cercletan: {
    predict: { q: "Cercle de centre O(0 ; 0), point T(3 ; 4). De O à T, on avance de 3 et on monte de 4. La tangente en T…", choices: ["monte", "descend", "est horizontale"], good: 1,
      why: "Elle est perpendiculaire au rayon : un quart de tour change « avancer de 3, monter de 4 » en « avancer de 4, descendre de 3 ». Sa pente est −3/4." },
    defis: ["Déplace T pour que la tangente soit horizontale.", "Déplace T pour que la tangente ait une pente de 3/4."],
    play(box, onWin) {
      // points entiers du cercle de rayon 5, dans l'ordre du tour
      const P = [[5, 0], [4, 3], [3, 4], [0, 5], [-3, 4], [-4, 3], [-5, 0], [-4, -3], [-3, -4], [0, -5], [3, -4], [4, -3]];
      let i = 2, step = 0;
      const fr = (a, b) => { if (b === 0) return null; const g = (u, v) => (v ? g(v, u % v) : Math.abs(u)); const k = g(a, b) * Math.sign(b); const n = a / k, d = b / k; return d === 1 ? String(n) : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; };
      const draw = () => {
        const [x, y] = P[i], W = 330, H = 300, X = (u) => 165 + u * 14, Y = (v) => 150 - v * 14;
        let g = '<line x1="' + X(-10.5) + '" y1="' + Y(0) + '" x2="' + X(10.5) + '" y2="' + Y(0) + '" class="f-grid"/><line x1="' + X(0) + '" y1="' + Y(-10.5) + '" x2="' + X(0) + '" y2="' + Y(10.5) + '" class="f-grid"/>';
        g += '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="70" class="f-soft"/>';
        // rayon et son triangle de pente (avancer de x, monter de y)
        g += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(x) + '" y2="' + Y(y) + '" class="f-line" stroke-width="2.5"/>';
        if (x && y) g += '<path d="M' + X(0) + "," + Y(0) + " L" + X(x) + "," + Y(0) + " L" + X(x) + "," + Y(y) + '" class="f-line" fill="none" stroke-dasharray="4 3"/>' +
          '<text x="' + X(x / 2) + '" y="' + (Y(0) + (y > 0 ? 15 : -6)) + '" class="f-txt" text-anchor="middle" font-size="12">' + (x > 0 ? "+" : "−") + Math.abs(x) + "</text>" +
          '<text x="' + (X(x) + (x > 0 ? 5 : -5)) + '" y="' + Y(y / 2) + '" class="f-txt" text-anchor="' + (x > 0 ? "start" : "end") + '" font-size="12">' + (y > 0 ? "+" : "−") + Math.abs(y) + "</text>";
        // tangente : direction (y ; −x), triangle de pente depuis T
        const tx = y, ty = -x, L = 1.9;
        g += '<line x1="' + X(x - tx * L) + '" y1="' + Y(y - ty * L) + '" x2="' + X(x + tx * L) + '" y2="' + Y(y + ty * L) + '" class="f-accent" stroke-width="2.5"/>';
        if (tx && ty) { const s = tx > 0 ? 1 : -1, ax = s * tx, ay = s * ty; // on avance vers la droite
          g += '<path d="M' + X(x) + "," + Y(y) + " L" + X(x + ax) + "," + Y(y) + " L" + X(x + ax) + "," + Y(y + ay) + '" class="f-accent" fill="none" stroke-dasharray="4 3"/>' +
            '<text x="' + X(x + ax / 2) + '" y="' + (Y(y) + (ay > 0 ? 15 : -6)) + '" class="f-accent f-txt" text-anchor="middle" font-size="12">+' + ax + "</text>" +
            '<text x="' + (X(x + ax) + 5) + '" y="' + Y(y + ay / 2) + '" class="f-accent f-txt" font-size="12">' + (ay > 0 ? "+" : "−") + Math.abs(ay) + "</text>"; }
        g += '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="3.5" class="f-dot"/><text x="' + (X(0) + (x < 0 ? 7 : -7)) + '" y="' + (Y(0) + (y > 0 ? 16 : -7)) + '" class="f-txt" text-anchor="' + (x < 0 ? "start" : "end") + '" font-size="13">O</text>';
        g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="6" class="f-dot"/><text x="' + (X(x) + (x >= 0 ? 10 : -10)) + '" y="' + (Y(y) + (y >= 0 ? -8 : 18)) + '" class="f-txt" text-anchor="' + (x >= 0 ? "start" : "end") + '" font-size="13">T(' + x + " ; " + y + ")</text>";
        const mr = fr(y, x), mt = fr(-x, y);
        box.innerHTML = `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="cercle, rayon OT et tangente en T(${x} ; ${y})">${g}</svg>
          <label class="dyn-ctl"><input type="range" min="0" max="${P.length - 1}" step="1" value="${i}" aria-label="déplacer T sur le cercle"><span class="small muted">Fais glisser pour déplacer T sur le cercle.</span></label>
          <div class="act-out">Rayon [OT] : pente ${mr === null ? "aucune (vertical)" : `Δy/Δx = ${y < 0 ? "−" + -y : y}/${x < 0 ? "(−" + -x + ")" : x}${mr === y + "/" + x || mr === String(y / x) && Math.abs(x) === 1 ? "" : " = <b>" + mr + "</b>"}`}<br><span style="color:var(--margin)">Tangente : pente ${mt === null ? "aucune (verticale)" : `<b>${mt}</b>`}</span>${mr !== null && mt !== null && x && y ? `<br><span class="small">Produit des pentes : ${mr} · (${mt}) = <b>−1</b></span>` : ""}</div>`;
        const inp = box.querySelector("input");
        inp.oninput = () => { i = +inp.value; draw(); box.querySelector("input").focus(); check(); };
      };
      const check = () => {
        const [x, y] = P[i];
        if (step === 0 && x === 0) { onWin(0, "En T(0 ; " + y + "), le rayon est vertical, donc la tangente est horizontale (pente 0)."); step = 1; }
        else if (step === 1 && y !== 0 && -x * 4 === 3 * y) { onWin(1, "En T(" + x + " ; " + y + "), le rayon a pour pente " + fr(y, x) + " ; on inverse et on change le signe : 3/4."); step = 2; }
      };
      draw();
    },
  },
});

// Message d'aide sous une manipulation (sans valider le défi).
function $hint(box, t) { let el = box.querySelector(".act-hint"); if (!el) { el = document.createElement("div"); el.className = "small act-hint"; box.appendChild(el); } el.textContent = t; }

// Écran de leçon active. cont : suite de la séance.
function activeLesson(id, L, cont, review) {
  const A = ACTIVE[id], P = A.predict;
  const ss = sentences(L.regle);
  const rule = ss.length > 1 ? "<ul>" + ss.map((x) => "<li>" + x + "</li>").join("") + "</ul>" : " · " + L.regle;
  const tail = lessonBody(id), fb = tail.slice(tail.indexOf('<div class="lfb"'));
  h(`${brand}<div class="eyebrow">${review ? "Leçon" : "Nouvelle notion"} · à toi de jouer</div>
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
  <button class="btn-primary btn-big" id="go" hidden>${review ? "Retour à mes compétences" : "J'ai compris, à moi !"}</button>`);
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
