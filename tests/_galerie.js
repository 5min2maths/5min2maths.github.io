// Galerie des figures (24.11, chantier Q, demande de l'auteur : « parcourir d'un coup d'œil toutes les figures de l'app
// pour repérer ce qui est mal dessiné »). Page tests/_galerie.html (hors batterie de tests : préfixe _).
// Pour chaque notion qui a des figures et chaque niveau (1 à 4) : N tirages avec figure (Engine.build, codes
// reproductibles), puis les figures des leçons (LESSON_FIGS, manipulations des leçons actives, figures à curseur),
// les questions curieuses et l'histoire des maths. Regroupement : classe (première classe où la notion est au
// programme de l'année), puis chapitre. Les notions hors des classes suisses (France…) vont dans « Autres ».
// Paramètres (hash) : #seed=20261124 (tirages du jour par défaut) & n=2 (tirages par niveau) & codes=a-1-x,b-2-y
// (questions signalées par le robot, ajoutées en tête). tools/galerie.py lit le DOM et en fait un fichier autonome.
(function () {
  const P = new URLSearchParams(location.hash.slice(1));
  const SEED = +(P.get("seed") || new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const NT = Math.max(1, +(P.get("n") || 2));
  const ONLY = (P.get("only") || "").split(",").filter(Boolean); /* only=id1,id2,histoire : galerie restreinte (contrôle ciblé) */
  const keep = (id) => !ONLY.length || ONLY.includes(id);
  const FLAG = (P.get("codes") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const PROFILES = [["9e", { system: "CH", grade: 9, track: "college" }], ["10e", { system: "CH", grade: 10, track: "college" }], ["11e", { system: "CH", grade: 11, track: "college" }],
    ["1re", { system: "CH", grade: 12, track: "college" }], ["2e", { system: "CH", grade: 13, track: "college" }], ["MP 1re", { system: "CH", grade: 12, track: "mp" }], ["MP 2e", { system: "CH", grade: 13, track: "mp" }]];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  // Énoncé lisible sans MathJax : délimiteurs retirés, quelques commandes TeX courantes traduites.
  const TEX = [[/\\\(|\\\)|\\\[|\\\]/g, ""], [/\{,\}/g, ","], [/\\text\{'\}/g, "'"], [/\\(?:text|mathrm|textbf|mathbf|operatorname)\{([^{}]*)\}/g, "$1"],
    [/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)"], [/\\sqrt\{([^{}]*)\}/g, "√($1)"], [/\^\{?2\}?/g, "²"], [/\^\{?3\}?/g, "³"], [/\\cdot/g, "·"], [/\\times/g, "×"], [/\\div/g, "÷"],
    [/\\(?:,|;|:|!|quad|qquad)|\\ /g, " "], [/\\(?:left|right)/g, ""], [/\\(alpha|beta|gamma|pi|Delta|theta)/g, (m, g) => ({ alpha: "α", beta: "β", gamma: "γ", pi: "π", Delta: "Δ", theta: "θ" })[g]], [/\\le(q)?\b/g, "≤"], [/\\ge(q)?\b/g, "≥"], [/\\approx/g, "≈"], [/\\widehat\{([^{}]*)\}/g, "∠$1"], [/\\overline\{([^{}]*)\}/g, "non-$1"], [/\\vec\{([^{}]*)\}/g, "$1⃗"], [/\\in\b/g, "∈"], [/\\parallel/g, "∥"], [/\\cap/g, "∩"], [/\\cup/g, "∪"], [/\\ne(q)?\b/g, "≠"], [/\\infty/g, "∞"], [/_\{([^{}]*)\}/g, "_$1"], [/\\%/g, "%"], [/\\circ/g, "°"]];
  const plain = (s) => TEX.reduce((t, [a, b]) => t.replace(a, b), String(s || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")).replace(/\s+/g, " ").trim();
  const errs = [];
  // Figures d'un fragment HTML déjà inséré : les SVG, sauf ceux des boutons et du clavier.
  const svgsOf = (root) => [...root.querySelectorAll("svg")].filter((s) => !s.closest("button, .keypad, .lfb, .cmt, .actions")).map((s) => s.outerHTML).join("");
  const figOf = (q) => { let f = q.fig || ""; if (q.parts) for (const p of q.parts) if (p && p.fig) f += p.fig; return f; };
  const seedOf = (d, k) => 1 + (((SEED % 1000003) * 7919 + d * 104729 + k * 1299709) % 46000000);

  // 1. Classe et chapitre de chaque notion.
  const place = {}, also = {}, chapOrder = {};
  for (const [name, p] of PROFILES) {
    let cat; try { cat = Engine.catalog(p).filter((c) => c.current); } catch (e) { errs.push("catalogue " + name + " : " + e); continue; }
    const order = Engine.themeOrder(cat, p);
    chapOrder[name] = order.map((th) => Engine.themeLabel(th, p));
    for (const th of order) cat.filter((c) => c.theme === th).sort((a, b) => Engine.rank(p, a.id) - Engine.rank(p, b.id)).forEach((c) => {
      if (!place[c.id]) place[c.id] = [name, Engine.themeLabel(th, p)]; else (also[c.id] = also[c.id] || []).push(name);
    });
  }
  const NAMES = PROFILES.map(([n]) => n).concat(["Autres"]);
  const groups = {}; // classe → chapitre → [cartes]
  const add = (cl, ch, card) => { ((groups[cl] = groups[cl] || {})[ch] = groups[cl][ch] || []).push(card); };
  const card = (o) => `<div class="gcard" data-code="${esc(o.code)}"><span class="kind">${esc(o.kind)}</span><div class="code">${esc(o.code)}</div><div class="small">${esc(o.label || "")}</div>` +
    `<div class="figs"><div class="figwrap">${o.fig}</div></div><div class="enonce">${esc(plain(o.q).slice(0, 260))}</div></div>`;
  let nQ = 0, nL = 0, nO = 0;

  // 2. Questions : N tirages avec figure par niveau.
  for (const n of NOTIONS) {
    if (!keep(n.id)) continue;
    const [cl, ch] = place[n.id] || ["Autres", THEMES[n.theme] || n.theme || "Divers"];
    const lab = n.label + (also[n.id] ? " · aussi " + also[n.id].join(", ") : "");
    for (let d = 1; d <= 4; d++) {
      let got = 0;
      for (let k = 0; k < 4 * NT + 4 && got < NT; k++) {
        let q; try { q = Engine.build(n.id, d, seedOf(d, k)); } catch (e) { if (k === 0) errs.push(n.id + "-" + d + " : " + String(e).slice(0, 80)); break; }
        if (!q) break;
        const f = figOf(q); if (!f) { if (k >= 3 && !got) break; continue; }
        got++; nQ++;
        add(cl, ch, card({ code: q.code, kind: "niveau " + d, label: lab, fig: f, q: q.q || (q.parts || []).map((p) => p.q).join(" ") }));
      }
    }
    // 3. Leçon (rappel de cours) : figure fixe, manipulation de la leçon active, figure à curseur.
    const hasL = typeof LESSON_FIGS !== "undefined" && LESSON_FIGS[n.id], hasA = typeof ACTIVE !== "undefined" && ACTIVE[n.id];
    if (hasL || hasA) {
      const box = document.createElement("div"); document.body.appendChild(box);
      try {
        // Leçon active : la manipulation remplace la figure dans le rappel (lessonBody) ; la figure fixe est montrée à part.
        if (hasL && hasA) { const fb = document.createElement("div"); fb.innerHTML = LESSON_FIGS[n.id](); const f0 = fb.querySelector(".figstack") ? fb.innerHTML : svgsOf(fb); /* 24.11 : figures empilées gardées en colonne (sinon côte à côte, minuscules) */ if (f0) { nL++; add(cl, ch, card({ code: "lecon-" + n.id, kind: "figure de leçon", label: lab, fig: f0, q: LESSONS[n.id] ? LESSONS[n.id].intro : "" })); } }
        box.innerHTML = LESSONS[n.id] ? lessonBody(n.id) : `<div class="figwrap">${LESSON_FIGS[n.id]()}</div>`;
        try { startInlineAct(box); } catch (e) { errs.push("leçon active " + n.id + " : " + String(e).slice(0, 80)); }
        try { if (typeof bindDyn === "function") bindDyn(box); } catch (e) {}
        const f = svgsOf(box);
        if (f) { nL++; add(cl, ch, card({ code: "lecon-" + n.id, kind: hasA ? "leçon active" : "rappel de cours", label: lab, fig: f, q: LESSONS[n.id] ? LESSONS[n.id].intro : "" })); }
      } catch (e) { errs.push("leçon " + n.id + " : " + String(e).slice(0, 80)); }
      box.remove();
    }
  }
  // 4. Questions curieuses et histoire des maths.
  if (typeof CURIEUX !== "undefined" && keep("curieux")) CURIEUX.forEach((c) => { try { const q = c.make(); if (q && q.fig) { nO++; add("Autres", "Questions curieuses", card({ code: "curieux-" + c.key, kind: c.fam, label: q.titre, fig: q.fig, q: q.q })); } } catch (e) { errs.push("curieux " + c.key + " : " + String(e).slice(0, 80)); } });
  if (typeof Histoire !== "undefined" && keep("histoire")) for (let k = 0; k < 200; k++) {
    let h; try { h = Histoire.card(k, false); } catch (e) { break; }
    const box = document.createElement("div"); box.innerHTML = h; const f = svgsOf(box), t = box.querySelector("h3");
    if (f) { nO++; add("Autres", "Histoire des maths", card({ code: "histoire-" + k, kind: "histoire", label: t ? t.textContent : "", fig: f, q: "" })); }
  }
  // 5. Questions signalées par le robot (codes reproductibles).
  const flagged = [];
  for (const c of FLAG) { try { const q = Engine.fromCode(c); if (q && figOf(q)) flagged.push(card({ code: q.code, kind: "robot", label: (NOTIONS.find((n) => n.id === q.id) || {}).label || "", fig: figOf(q), q: q.q || "" })); } catch (e) {} }

  // 6. Mise en page : sommaire puis sections.
  const slug = (s) => "s-" + s.replace(/[^a-z0-9]+/gi, "-");
  const total = nQ + nL + nO;
  let toc = "", body = "";
  if (flagged.length) { toc += `<div><b><a href="#s-robot">Signalées par le robot (${flagged.length})</a></b></div>`; body += `<h2 id="s-robot">Signalées par le robot</h2><div class="grid">${flagged.join("")}</div>`; }
  for (const cl of NAMES) {
    const G = groups[cl]; if (!G) continue;
    const chs = Object.keys(G).sort((a, b) => { const o = chapOrder[cl] || []; const ia = o.indexOf(a), ib = o.indexOf(b); return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b); });
    const cnt = chs.reduce((s, c) => s + G[c].length, 0);
    toc += `<div><b><a href="#${slug(cl)}">${esc(cl)} (${cnt})</a></b>` + chs.map((c) => `<a href="#${slug(cl + "-" + c)}">${esc(c)}</a> (${G[c].length})`).join("<br>") + "</div>";
    body += `<h2 id="${slug(cl)}">${esc(cl)}</h2>` + chs.map((c) => `<h3 id="${slug(cl + "-" + c)}">${esc(c)}</h3><div class="grid">${G[c].join("")}</div>`).join("");
  }
  document.getElementById("gal").innerHTML = `<h1>Galerie des figures</h1><p class="muted">Tirages du ${SEED} · ${NT} par niveau · ${total} figures (${nQ} questions, ${nL} leçons, ${nO} autres)` +
    (errs.length ? ` · ${errs.length} erreurs : ${esc(errs.slice(0, 8).join(" ; "))}` : "") + `</p><nav class="toc">${toc}</nav>${body}`;
  document.getElementById("out").textContent = JSON.stringify({ total, questions: nQ, lecons: nL, autres: nO, robot: flagged.length, erreurs: errs });
})();
