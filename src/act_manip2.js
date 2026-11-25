// Manipulations refaites (23.11, « la manipulation est un point faible ») : de vrais gestes sur les objets
// mathématiques, avec la bibliothèque src/manip.js (manipLesson). Diagnostic et principes : tools/manipulation.md.
// Remplace la partie « Manipule » (predict, defis, play) des leçons : reduire, distrib, idrem, factor (tuiles
// algébriques), eq1 (balance), fracadd (barres de fractions), rel (flèches sur la droite graduée), thales (parallèle
// qu'on glisse), simil (homothétie), angles (sécante qu'on fait tourner), angtri (triangle déformable), diagr (barres et
// moyenne), vol (pavé de cubes), sys2 (point à placer sur deux droites), utemps (barre d'une heure à double échelle).
// 24.11 : cercthales (C glisse sur le cercle), proba (urne qu'on remplit), modaff (droite réglée par deux poignées),
// f2formes (parabole dont on tire le sommet), pente (bout de la route qu'on tire). Le rappel de cours (LESSONS) ne change pas. Chargé après act_manip.js.
(function () {
  if (typeof manipLesson === "undefined" || typeof ACTIVE === "undefined") return;
  const M = MANIP, nb = M.nb, esc = M.esc, clamp = M.clamp;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const T = (x, y, s, a = "middle", sz = 12, ex = "") => (ex = ex.replace(/ fill="([^"]+)"/, ' style="fill:$1"'), `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="f-txt" text-anchor="${a}" font-size="${sz}"${ex}>${s}</text>`);
  const term = (c, l, first) => { const s = c < 0 ? (first ? "−" : " − ") : first ? "" : " + "; const a = Math.abs(c); return s + (l ? (a === 1 ? "" : a) + l : a); };
  const poly = (ts) => { const f = ts.filter(([c]) => c !== 0); return f.length ? f.map(([c, l], i) => term(c, l, i === 0)).join("") : "0"; };
  // 24.11 (chargement par niveau) : les paquets de niveau peuvent être chargés après ce fichier et feraient
  // Object.assign(ACTIVE, …) sur ces leçons : l'accesseur garde la version « manipulation » et ignore l'écriture.
  const set = (id, o) => { Object.defineProperty(ACTIVE, id, { get: () => o, set: () => {}, enumerable: true, configurable: true }); };

  // ---------- tuiles algébriques ----------
  // x² : grand carré, x : barre, 1 : petit carré. Positif : bleu plein ; négatif : rouge clair en pointillé.
  const TS = { x2: [40, 40], x: [40, 14], 1: [14, 14] }, LAB = { x2: "x²", x: "x", 1: "" };
  const tile = (t, s, w, h, lab) => { const [W, H] = w ? [w, h] : TS[t], neg = s < 0, L = lab != null ? lab : LAB[t];
    return `<rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="2" fill="${neg ? "var(--bad-soft)" : "var(--blue)"}" stroke="${neg ? "var(--bad)" : "var(--ink)"}" stroke-width="1.2"${neg ? ' stroke-dasharray="3 2"' : ""}/>` +
      (L || neg ? `<text y="${Math.min(H / 2 - 1, 4)}" text-anchor="middle" font-size="${H < 14 ? 10 : 12}" font-weight="700" fill="${neg ? "var(--bad)" : "#fff"}" style="pointer-events:none">${neg ? "−" : ""}${H < 14 && W < 14 ? "" : L}</text>` : ""); };

  // ===================== Réduire : trier les tuiles dans trois bacs =====================
  {
    const E = [
      { e: [[3, "x"], [4, "1"], [-1, "x"], [-2, "1"]], txt: "3x + 4 − x − 2" },
      { e: [[2, "x2"], [3, "x"], [-1, "x2"], [-1, "x"], [-3, "1"]], txt: "2x² + 3x − x² − x − 3" },
      { e: [[-1, "x2"], [2, "x"], [2, "x2"], [-3, "x"], [1, "1"]], txt: "−x² + 2x + 2x² − 3x + 1" }];
    const BINS = [{ x: 4, y: 150, w: 108, h: 118, t: "x2", lab: "carrés x²" }, { x: 116, y: 150, w: 104, h: 118, t: "x", lab: "barres x" }, { x: 224, y: 150, w: 92, h: 118, t: "1", lab: "unités" }];
    const lit = { x2: "x²", x: "x", 1: "" };
    const homes = (e) => { const out = [], labs = []; let x = 8, y = 26;
      e.forEach(([c, t]) => { const [w, h] = TS[t], n = Math.abs(c), gw = n * (w + 4) - 4; if (x + gw > 312) { x = 8; y += 62; }
        labs.push({ x: x + gw / 2, y, s: (c < 0 ? "− " : out.length ? "+ " : "") + (n === 1 && t !== "1" ? "" : n) + lit[t] });
        for (let i = 0; i < n; i++) out.push({ t, s: Math.sign(c), hx: x + i * (w + 4) + w / 2, hy: y + 10 + h / 2 + 4 });
        x += gw + 18; });
      return { tiles: out, labs }; };
    const layout = (st) => BINS.forEach((B, b) => { let x = B.x + 6, y = B.y + 26, rowH = 0;
      st.tiles.forEach((T0) => { if (T0.bin !== b || T0.gone) return; const [w, h] = TS[T0.t]; if (x + w > B.x + B.w - 4) { x = B.x + 6; y += rowH + 4; rowH = 0; } T0.x = x + w / 2; T0.y = y + h / 2; x += w + 4; rowH = Math.max(rowH, h); }); });
    const place = (st, i, b) => { const T0 = st.tiles[i];
      if (BINS[b].t !== T0.t) { T0.bin = -1; T0.x = T0.hx; T0.y = T0.hy; st.msg = { x2: "Un carré x²", x: "Une barre x", 1: "Une unité" }[T0.t] + " ne va pas avec les " + BINS[b].lab + " : ce ne sont pas des termes semblables."; return; }
      T0.bin = b; st.msg = "";
      const j = st.tiles.findIndex((U, k) => k !== i && U.bin === b && !U.gone && U.s === -T0.s);
      if (j >= 0) { T0.gone = st.tiles[j].gone = true; st.msg = "+" + (lit[T0.t] || "1") + " et −" + (lit[T0.t] || "1") + " s'annulent : une paire nulle, on l'enlève."; }
      layout(st); };
    const sums = (st) => { const s = { x2: 0, x: 0, 1: 0 }; st.tiles.forEach((U) => { if (U.bin >= 0 && !U.gone) s[U.t] += U.s; }); return s; };
    const want = (step) => { const s = { x2: 0, x: 0, 1: 0 }; E[step].e.forEach(([c, t]) => (s[t] += c)); return s; };
    const res = (s) => poly([[s.x2, "x²"], [s.x, "x"], [s[1], ""]]);
    set("reduire", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(3x + 4 - x - 2 = 2x + 2\\).", "\\(2x^2 + 3x - x^2 - x - 3 = x^2 + 2x - 3\\).", "\\(-x^2 + 2x + 2x^2 - 3x + 1 = x^2 - x + 1\\)."] },
      predict: { q: "3x + 2x² se réduit en…", choices: ["5x³", "5x²", "on ne peut pas réduire"], good: 2, why: "x et x² ne sont pas semblables (comme des carrés et des barres de tailles différentes) : on ne peut pas les additionner." },
      defis: ["Range les tuiles de 3x + 4 − x − 2 dans les bacs : chaque tuile avec celles de même forme.", "Range celles de 2x² + 3x − x² − x − 3.", "Et celles de −x² + 2x + 2x² − 3x + 1."],
      play: manipLesson({ W: 320, H: 276, aria: "tuiles algébriques à ranger dans trois bacs",
        note: "Glisse chaque tuile dans le bac de sa forme (ou touche une tuile, puis un bac). Une tuile rouge et une bleue de même forme s'annulent.",
        init: (step) => { const h = homes(E[step].e); return { tiles: h.tiles.map((U) => Object.assign(U, { x: U.hx, y: U.hy, bin: -1, gone: false })), labs: h.labs, sel: -1, msg: "" }; },
        handles: (st) => BINS.map((B, b) => ({ x: B.x, y: B.y, label: "bac des " + B.lab, svg: `<rect width="${B.w}" height="${B.h}" rx="8" class="m-zone${st.sel >= 0 ? " m-zone-on" : ""}"/>` + T(B.w / 2, 17, B.lab, "middle", 12, ' font-weight="700"'), hit: { x: 0, y: 0, w: B.w, h: B.h } }))
          .concat(st.tiles.map((U, i) => ({ x: U.x, y: U.y, off: U.gone, sel: st.sel === i, label: (U.s < 0 ? "tuile négative " : "tuile ") + { x2: "x²", x: "x", 1: "1" }[U.t], svg: tile(U.t, U.s), hit: { x: -TS[U.t][0] / 2 - 6, y: -TS[U.t][1] / 2 - 7, w: TS[U.t][0] + 12, h: TS[U.t][1] + 14 } }))),
        grab: (st) => { st.msg = ""; },
        move: (st, k, p) => { if (k < 3) return; const U = st.tiles[k - 3]; U.x = clamp(p.x, 6, 314); U.y = clamp(p.y, 6, 270); },
        drop: (st, k, p) => { if (k < 3) return; const i = k - 3, b = M.zoneAt(BINS, p, 4); st.sel = -1; if (b >= 0) place(st, i, b); else { const U = st.tiles[i]; U.bin = -1; U.x = U.hx; U.y = U.hy; layout(st); } },
        tap: (st, k) => { if (k < 3) { if (st.sel >= 0) { place(st, st.sel, k); st.sel = -1; } else st.msg = "Touche d'abord une tuile, puis son bac."; return; } st.sel = st.sel === k - 3 ? -1 : k - 3; },
        draw: (st, step) => T(160, 14, E[step].txt, "middle", 14, ' font-weight="700"') + st.labs.map((l) => T(l.x, l.y + 4, l.s, "middle", 11, ' fill="var(--ink-soft)"')).join(""),
        out: (st) => { const left = st.tiles.filter((U) => U.bin < 0 && !U.gone).length; return left ? `Dans les bacs : <b>${res(sums(st))}</b> <span class="small muted">· ${left} tuile${left > 1 ? "s" : ""} à ranger</span>` : `Forme réduite : <b>${res(sums(st))}</b>`; },
        hint: (st) => st.msg,
        goal: [0, 1, 2].map((s) => (st) => (st.tiles.every((U) => U.bin >= 0 || U.gone) ? E[s].txt + " = " + res(want(s)) + " : on a regroupé les tuiles de même forme, et les paires +/− se sont annulées." : "")),
      }),
    });
  }

  // ===================== Développer : remplir le rectangle avec des tuiles =====================
  // Le rectangle a pour côtés les deux facteurs ; chaque case est le produit de sa ligne et de sa colonne.
  {
    const SX = 62, SU = 26, RX = 36, RY = 38;
    const sz = (p) => (p === "x" ? SX : SU);
    const SRC = [{ t: "x2", x: 258, y: 72, w: SX, h: SX }, { t: "x", x: 258, y: 136, w: SX, h: SU }, { t: "1", x: 258, y: 180, w: SU, h: SU }];
    const NAME = { x2: "un carré x²", x: "une barre x", 1: "une unité" };
    const cells = (D) => { const out = []; let y = RY; D.left.forEach((a) => { let x = RX; D.top.forEach((b) => { const t = a === "x" && b === "x" ? "x2" : a === "x" || b === "x" ? "x" : "1"; out.push({ x, y, w: sz(b), h: sz(a), t, a, b }); x += sz(b); }); y += sz(a); }); return out; };
    const sideTxt = (ps) => { const n = ps.filter((p) => p === "x").length, u = ps.length - n; return n && u ? (n === 1 ? "" : n) + "x + " + u : n ? (n === 1 ? "" : n) + "x" : String(u); };
    const area = (D) => { const s = { x2: 0, x: 0, 1: 0 }; cells(D).forEach((c) => s[c.t]++); return poly([[s.x2, "x²"], [s.x, "x"], [s[1], ""]]); };
    const mk = (DEF, ASK) => manipLesson({ W: 320, H: (s) => Math.max(206, RY + DEF[s].left.reduce((a, p) => a + sz(p), 0) + 16), aria: "rectangle à remplir de tuiles",
      note: "Glisse une tuile de droite dans une case du rectangle. Ensuite, touche simplement les autres cases : la dernière tuile choisie s'y pose. Touche une case pleine pour la vider.",
      init: (step) => ({ cells: cells(DEF[step]).map((c) => Object.assign(c, { on: false })), sel: null, drag: null, msg: "" }),
      handles: (st) => st.cells.map((c, i) => ({ x: c.x, y: c.y, label: "case " + (i + 1) + (c.on ? " (pleine)" : " (vide)"),
        svg: c.on ? `<g transform="translate(${c.w / 2} ${c.h / 2})">${tile(c.t, 1, c.w - 2, c.h - 2, c.t === "x2" ? "x²" : c.t === "x" ? "x" : "")}</g>` : `<rect x="1" y="1" width="${c.w - 2}" height="${c.h - 2}" fill="var(--paper)" stroke="var(--line)" stroke-dasharray="3 3"/>`,
        hit: { x: 0, y: 0, w: c.w, h: c.h } }))
        .concat(SRC.map((S) => { const d = st.drag === S.t; return { x: d ? st.dx : S.x, y: d ? st.dy : S.y, sel: st.sel === S.t, label: "pièce " + { x2: "x²", x: "x", 1: "1" }[S.t] + (st.sel === S.t ? " (choisie)" : ""),
          svg: tile(S.t, 1, S.w, S.h), hit: { x: -Math.max(S.w, 40) / 2 - 2, y: -Math.max(S.h, 34) / 2 - 2, w: Math.max(S.w, 40) + 4, h: Math.max(S.h, 34) + 4 } }; })),
      grab: (st, k) => { st.msg = ""; const n = st.cells.length; if (k >= n) { st.drag = SRC[k - n].t; st.dx = SRC[k - n].x; st.dy = SRC[k - n].y; } },
      move: (st, k, p) => { if (k >= st.cells.length) { st.dx = clamp(p.x, 10, 310); st.dy = clamp(p.y, 10, 260); } },
      drop: (st, k, p) => { const n = st.cells.length; st.drag = null; if (k < n) return; const t = SRC[k - n].t; st.sel = t;
        let i = M.zoneAt(st.cells, p, 0); if (i < 0) i = M.zoneAt(st.cells, p, 10); if (i >= 0) fill(st, i, t); },
      tap: (st, k) => { const n = st.cells.length; st.drag = null; if (k >= n) { const t = SRC[k - n].t; st.sel = st.sel === t ? null : t; st.msg = st.sel ? "Touche maintenant les cases où va " + NAME[t] + "." : ""; return; }
        const c = st.cells[k]; if (c.on) { c.on = false; st.msg = ""; return; } if (!st.sel) { st.msg = "Choisis d'abord une tuile à droite : glisse-la ou touche-la."; return; } fill(st, k, st.sel); },
      draw: (st, step) => { const D = DEF[step]; let g = "", x = RX, y = RY;
        D.top.forEach((p) => { g += T(x + sz(p) / 2, RY - 8, p, "middle", 13, ' font-weight="700" fill="var(--margin)"'); x += sz(p); });
        D.left.forEach((p) => { g += T(RX - 8, y + sz(p) / 2 + 5, p, "end", 13, ' font-weight="700" fill="var(--margin)"'); y += sz(p); });
        g += `<rect x="${RX}" y="${RY}" width="${x - RX}" height="${y - RY}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
        g += T(RX, 16, D.txt, "start", 14, ' font-weight="700"') + SRC.map((S) => T(S.x + (S.t === "1" ? 20 : 37), S.y + 4, { x2: "x²", x: "x", 1: "1" }[S.t], "start", 12, ' fill="var(--ink-soft)"')).join("");
        return g; },
      out: (st) => { const s = { x2: 0, x: 0, 1: 0 }; st.cells.forEach((c) => c.on && s[c.t]++); const left = st.cells.filter((c) => !c.on).length;
        return `Aire posée : <b>${poly([[s.x2, "x²"], [s.x, "x"], [s[1], ""]])}</b>${left ? ` <span class="small muted">· ${left} case${left > 1 ? "s" : ""} vide${left > 1 ? "s" : ""}</span>` : ""}`; },
      hint: (st) => st.msg,
      goal: DEF.map((D) => (st) => (st.cells.every((c) => c.on) ? D.txt + " = " + area(D) + ". " + D.msg : "")),
      ask: ASK });
    function fill(st, i, t) { const c = st.cells[i];
      if (c.on) { st.msg = "Cette case est déjà pleine."; return; }
      if (c.t !== t) { st.msg = "Cette case mesure " + c.b + " sur " + c.a + " : il y faut " + NAME[c.t] + ", pas " + NAME[t] + "."; return; }
      c.on = true; st.msg = ""; }
    const D1 = [{ top: ["x", "1", "1"], left: ["1", "1", "1"], txt: "3(x + 2)", msg: "Le 3 multiplie le x ET le 2 : 3 barres x et 6 unités." },
      { top: ["x", "1", "1", "1"], left: ["x", "1", "1"], txt: "(x + 2)(x + 3)", msg: "Quatre morceaux : x², 3x, 2x et 6, qu'on réduit en x² + 5x + 6." },
      { top: ["x", "1", "1", "1"], left: ["x", "x"], txt: "2x(x + 3)", msg: "2x · x = 2x² et 2x · 3 = 6x." }];
    set("distrib", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(3(x + 2) = 3x + 6\\).", "\\((x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6\\).", "\\(2x(x + 3) = 2x^2 + 6x\\)."], piege: "Dans \\((x + 2)(x + 3)\\), il y a 4 produits (4 morceaux du rectangle) : n'oublie pas les produits « croisés »." },
      predict: { q: "3(2x + 5) = ?", choices: ["6x + 5", "6x + 15", "5x + 8"], good: 1, why: "Le 3 multiplie les deux termes : 3 · 2x = 6x et 3 · 5 = 15. Comme l'aire d'un rectangle coupé en deux." },
      defis: ["Remplis le rectangle 3 sur (x + 2) avec des tuiles : quelle est son aire ?", "Remplis le rectangle (x + 2) sur (x + 3).", "Remplis le rectangle 2x sur (x + 3)."],
      play: mk(D1, [null, { q: "Développe (x + 4)(x + 1) et réduis : tape le coefficient de x.", ans: 5, ok: "(x + 4)(x + 1) = x² + x + 4x + 4 = x² + 5x + 4.", no: "Quatre produits : x · x, x · 1, 4 · x et 4 · 1 ; puis regroupe les x." }, null]),
    });
    const D2 = [{ top: ["x", "1"], left: ["x", "1"], txt: "(x + 1)²", msg: "Un carré x², deux barres x et une unité : x² + 2x + 1." },
      { top: ["x", "1", "1"], left: ["x", "1", "1"], txt: "(x + 2)²", msg: "Deux rectangles de 2x (le double produit 4x), plus 2² = 4 : x² + 4x + 4." },
      { top: ["x", "1", "1", "1"], left: ["x", "1", "1", "1"], txt: "(x + 3)²", msg: "x² + 6x + 9 : sans les deux rectangles 3x, il manquerait le double produit." }];
    set("idrem", {
      /* 24.11 : les deux autres identités remarquables, en défis courts */
      plus: [{ d: "Développe \\((x - 4)^2 = x^2 + bx + 16\\). Tape \\(b\\).", ans: -8, ok: "(a − b)² = a² − 2ab + b² : le double produit est soustrait, (x − 4)² = x² − 8x + 16.", no: "Le double produit vaut 2 · x · 4, et il est précédé du signe −." },
        { d: "Développe \\((x + 6)(x - 6) = x^2 + c\\). Tape \\(c\\).", ans: -36, ok: "(a + b)(a − b) = a² − b² : les produits +6x et −6x s'annulent, il reste x² − 36.", no: "Développe : x · x, x · (−6), 6 · x et 6 · (−6). Les deux termes en x s'annulent." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((a + b)^2 = a^2 + 2ab + b^2\\). Le carré de côté \\(a + b\\) se découpe en \\(a^2\\), deux rectangles \\(ab\\) et \\(b^2\\) : le terme du milieu, \\(2ab\\), s'appelle le double produit. De même, \\((a - b)^2 = a^2 - 2ab + b^2\\) et \\((a + b)(a - b) = a^2 - b^2\\).", exemple: ["\\((x + 1)^2 = x^2 + 2x + 1\\).", "\\((x + 3)^2 = x^2 + 6x + 9\\).", "\\((x - 4)^2 = x^2 - 8x + 16\\).", "\\((x + 6)(x - 6) = x^2 - 36\\)."], piege: "\\((x - 4)^2 \\neq x^2 - 16\\) : il manque le double produit \\(-8x\\)." },
      predict: { q: "(x + 3)² = ?", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(x + 3)² = (x + 3)(x + 3) : 4 morceaux, x², 3x, 3x et 9. Le terme du milieu est le double produit 6x." },
      defis: ["Remplis le carré de côté x + 1.", "Remplis le carré de côté x + 2.", "Remplis le carré de côté x + 3. Compte les barres x."],
      play: mk(D2, [null, null, { q: "Sans la figure : (x + 5)² = x² + ?x + 25. Tape le coefficient de x.", ans: 10, ok: "Deux rectangles 5x : le double produit vaut 2 · 5 · x = 10x.", no: "Dans le carré, il y a DEUX rectangles 5 sur x." }]),
    });
  }

  // ===================== Factoriser : tirer le bord du rectangle pour former des rangées =====================
  {
    const E = [[6, 9], [10, -15], [12, 18]], RX = 44, RY = 46, RH = 26, KMAX = 6;
    const txt = (p, q) => poly([[p, "x"], [q, ""]]);
    set("factor", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Factoriser, c'est écrire un produit : l'inverse de développer. Mise en évidence : on cherche le facteur commun et on l'écrit devant, \\(ka + kb = k(a + b)\\). Factoriser au maximum : on prend le plus grand facteur commun. On vérifie en développant.", exemple: ["\\(6x + 9 = 3(2x + 3)\\).", "\\(10x - 15 = 5(2x - 3)\\).", "\\(12x + 18 = 6(2x + 3)\\)."], piege: "\\(12x + 18 = 2(6x + 9)\\) n'est pas fini : le plus grand facteur commun est 6." },
      predict: { q: "Factoriser 10x + 15, c'est l'écrire…", choices: ["comme un produit", "comme une somme plus courte"], good: 0, why: "Factoriser = écrire un produit : 10x + 15 = 5(2x + 3). C'est l'inverse de développer." },
      defis: ["Range les tuiles de 6x + 9 en rectangle : tire le bord pour choisir le nombre de rangées. Fais le plus de rangées possible.", "Même chose avec 10x − 15.", "Et avec 12x + 18, au maximum."],
      play: manipLesson({ W: 320, H: RY + KMAX * RH + 40, aria: "tuiles rangées en rectangle",
        note: "Glisse la poignée rouge vers le bas ou vers le haut (ou flèches du clavier) : les tuiles se rangent en rangées égales.",
        init: () => ({ k: 1 }),
        handles: (st) => [{ x: 160, y: RY + st.k * RH + 12, label: "nombre de rangées : " + st.k, role: "slider",
          svg: `<rect x="-38" y="-11" width="76" height="22" rx="11" fill="var(--margin)"/><text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">⇕ ${st.k} rangée${st.k > 1 ? "s" : ""}</text>`, hit: { x: -48, y: -22, w: 96, h: 44 } }],
        move: (st, k, p) => { st.k = clamp(Math.round((p.y - 12 - RY) / RH), 1, KMAX); },
        nudge: (st, k, dx, dy) => { st.k = clamp(st.k - dy + dx, 1, KMAX); },
        draw: (st, step) => { const [p, q] = E[step], k = st.k, a = Math.floor(p / k), b = Math.floor(Math.abs(q) / k), ra = p % k, rb = Math.abs(q) % k, ok = !ra && !rb;
          const BW = 40, UW = 13, need = a * (BW + 2) + b * (UW + 2) + 8, s = Math.min(1, (300 - RX - (ok ? 0 : 50)) / need), bw = BW * s, uw = UW * s;
          let g = T(160, 18, "Aire : " + txt(p, q), "middle", 14, ' font-weight="700"'), xe = RX;
          for (let r = k; r < KMAX; r++) g += `<rect x="${RX}" y="${RY + r * RH + 2}" width="${300 - RX}" height="${RH - 4}" rx="3" fill="none" stroke="var(--line)" stroke-dasharray="3 4"/>`;
          for (let r = 0; r < k; r++) { let x = RX; const y = RY + r * RH + 2;
            for (let i = 0; i < a; i++) { g += `<rect x="${x.toFixed(1)}" y="${y}" width="${(bw).toFixed(1)}" height="${RH - 4}" rx="2" fill="var(--blue)" stroke="var(--ink)"/>`; x += bw + 2 * s; }
            const gx = x; x += 6 * s;
            for (let i = 0; i < b; i++) { g += `<rect x="${x.toFixed(1)}" y="${y + (RH - 4 - Math.min(uw, RH - 4)) / 2}" width="${uw.toFixed(1)}" height="${Math.min(uw, RH - 4).toFixed(1)}" rx="1.5" fill="${q < 0 ? "var(--bad-soft)" : "var(--blue)"}" stroke="${q < 0 ? "var(--bad)" : "var(--ink)"}"${q < 0 ? ' stroke-dasharray="2 2"' : ""}/>`; x += uw + 2 * s; }
            xe = Math.max(xe, x); if (r === 0) st._gx = gx; }
          g += `<rect x="${RX - 4}" y="${RY - 2}" width="${(xe - RX + 6).toFixed(1)}" height="${k * RH + 2}" fill="none" stroke="${ok && k > 1 ? "var(--ok)" : "var(--ink-soft)"}" stroke-width="2"${ok ? "" : ' stroke-dasharray="5 4"'}/>`;
          g += T(RX - 12, RY + (k * RH) / 2 + 6, String(k), "end", 18, ' font-weight="800" fill="var(--margin)"');
          if (ok) g += T((RX + st._gx) / 2, RY - 8, (p / k === 1 ? "" : p / k) + "x", "middle", 13, ' font-weight="700" fill="var(--margin)"') + T((st._gx + xe) / 2, RY - 8, (q < 0 ? "−" : "") + Math.abs(q) / k, "middle", 13, ' font-weight="700" fill="var(--margin)"');
          if (!ok) { let x = xe + 10, y = RY + 2; g += T(x, RY - 8, "reste", "start", 11, ' fill="var(--bad)"');
            for (let i = 0; i < ra; i++) { g += `<rect x="${x}" y="${y}" width="10" height="${RH - 6}" fill="none" stroke="var(--bad)" stroke-width="1.5"/>`; y += RH - 2; }
            for (let i = 0; i < rb; i++) { g += `<rect x="${x + 14}" y="${RY + 2 + i * 12}" width="9" height="9" fill="none" stroke="var(--bad)" stroke-width="1.5"/>`; } }
          return g; },
        out: (st, step) => { const [p, q] = E[step], k = st.k; return !(p % k) && !(q % k) ? `${txt(p, q)} = <b>${k === 1 ? "1 · (" + txt(p, q) + ")" : k + "(" + txt(p / k, q / k) + ")"}</b>` : `${k} rangées : il reste des tuiles, ${k} ne divise pas ${p % k ? p : Math.abs(q)}.`; },
        hint: (st, step) => { const [p, q] = E[step], k = st.k; if (k === 1) return "Une seule rangée, c'est toujours possible, mais ça ne met rien en évidence."; if (p % k || q % k) return "Les rangées doivent être toutes pareilles : essaie un autre nombre de rangées."; return "Rectangle complet ! Mais chaque rangée se partage encore : peux-tu faire plus de rangées ?"; },
        goal: E.map(([p, q]) => (st) => { const G = gcd(p, q); return st.k === G ? txt(p, q) + " = " + G + "(" + txt(p / G, q / G) + ") : " + G + " est le plus grand facteur commun, la parenthèse ne se factorise plus." : ""; }),
        ask: [null, null, { q: "Factorise 8x + 12 au maximum. Tape le facteur placé devant la parenthèse.", ans: 4, ok: "8x + 12 = 4(2x + 3) : 4 est le plus grand diviseur commun de 8 et 12.", no: "Cherche le plus grand nombre qui divise 8 et 12." }] }),
    });
  }

  // ===================== Équations : la balance à deux plateaux =====================
  // Sacs (x, poids caché) et cubes (1). On enlève (ou déplace) des objets : la balance penche si on ne fait pas la même chose des deux côtés.
  {
    const E = [[2, 3, 0, 11, 4], [3, 2, 1, 8, 3], [4, 1, 2, 7, 3]];
    const PX = 160, PY = 46, ARM = 98, DROP = 92, TABLE = 196;
    const weight = (st, side) => st.items.reduce((s, I) => s + (I.side === side && !I.off ? (I.t === "x" ? st.X : 1) : 0), 0);
    const count = (st, side, t) => st.items.filter((I) => I.side === side && !I.off && I.t === t).length;
    const tilt = (st) => clamp((weight(st, "R") - weight(st, "L")) * 3, -15, 15);
    const ends = (st) => { const a = (tilt(st) * Math.PI) / 180, c = Math.cos(a) * ARM, s = Math.sin(a) * ARM; return { L: { x: PX - c, y: PY - s }, R: { x: PX + c, y: PY + s } }; };
    const pos = (st) => { const en = ends(st), P = [];
      ["L", "R"].forEach((side) => { const e = en[side], py = e.y + DROP; let bi = 0, ui = 0, oi = 0; const nb0 = count(st, side, "x");
        st.items.forEach((I, k) => { if (I.side !== side) return;
          if (I.off) { P[k] = { x: (side === "L" ? 22 : 182) + (oi % 8) * 17, y: TABLE + 22 + Math.floor(oi / 8) * 18 + (I.t === "x" ? 0 : 0) }; oi++; return; }
          if (I.t === "x") { P[k] = { x: e.x - 45 + bi * 30, y: py - 15 }; bi++; }
          else { P[k] = { x: e.x - 46 + (ui % 7) * 15, y: py - (nb0 ? 38 : 8) - Math.floor(ui / 7) * 16 }; ui++; } }); });
      return P; };
    const side = (st, s) => poly([[count(st, s, "x"), "x"], [count(st, s, "1"), ""]]);
    const bag = (off) => `<path d="M-11,-8 Q-14,13 0,14 Q14,13 11,-8 Z" fill="${off ? "var(--grid)" : "var(--warn)"}" stroke="var(--ink)" stroke-width="1.2"/><path d="M-6,-8 L-3,-13 L3,-13 L6,-8" fill="none" stroke="var(--ink)" stroke-width="1.2"/><text y="7" text-anchor="middle" font-size="13" font-weight="800" fill="${off ? "var(--ink-soft)" : "#fff"}">x</text>`;
    const cube = (off) => `<rect x="-6.5" y="-6.5" width="13" height="13" rx="2" fill="${off ? "var(--grid)" : "var(--blue)"}" stroke="var(--ink)" stroke-width="1"/>`;
    const solved = (st) => { for (const [a, b] of [["L", "R"], ["R", "L"]]) if (count(st, a, "x") === 1 && count(st, a, "1") === 0 && count(st, b, "x") === 0 && weight(st, "L") === weight(st, "R")) return true; return false; };
    set("eq1", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(2x + 3 = 11\\), \\(2x = 8\\), \\(x = 4\\).", "\\(3x + 2 = x + 8\\), \\(2x = 6\\), \\(x = 3\\). Contrôle : \\(11 = 11\\).", "\\(4x + 1 = 2x + 7\\), \\(2x = 6\\), \\(x = 3\\)."] },
      predict: { q: "Dans 3x + 5 = 20, on « fait passer » le 5 de l'autre côté. Que fait-on vraiment ?", choices: ["On soustrait 5 des deux côtés", "On efface le 5", "On divise par 5"], good: 0, why: "Une équation est une balance : on retire 5 des deux plateaux, 3x = 15. Le 5 ne « saute » pas : il est soustrait des deux côtés." },
      defis: ["La balance montre 2x + 3 = 11. Enlève des objets, sans la déséquilibrer, jusqu'à ce qu'un sac x reste seul : combien pèse-t-il ?", "Même jeu avec 3x + 2 = x + 8.", "Et avec 4x + 1 = 2x + 7."],
      play: manipLesson({ W: 320, H: 250, aria: "balance à deux plateaux",
        note: "Glisse un objet hors du plateau (ou touche-le) pour l'enlever ; remets-le de la même façon. Chaque sac contient le même poids inconnu x.",
        init: (step) => { const [a, b, c, d, X] = E[step], items = []; const add = (n, t, s) => { for (let i = 0; i < n; i++) items.push({ t, side: s, off: false }); };
          add(a, "x", "L"); add(b, "1", "L"); add(c, "x", "R"); add(d, "1", "R"); return { items, X, moved: null }; },
        handles: (st) => { const P = pos(st); return st.items.map((I, k) => ({ x: st.moved && st.moved.k === k ? st.moved.x : P[k].x, y: st.moved && st.moved.k === k ? st.moved.y : P[k].y, label: (I.t === "x" ? "sac x" : "cube 1") + (I.off ? " retiré" : I.side === "L" ? " sur le plateau de gauche" : " sur le plateau de droite"),
          svg: I.t === "x" ? bag(I.off) : cube(I.off), hit: I.t === "x" ? { x: -16, y: -18, w: 32, h: 36 } : { x: -11, y: -11, w: 22, h: 22 } })); },
        move: (st, k, p) => { st.moved = { k, x: clamp(p.x, 8, 312), y: clamp(p.y, 8, 244) }; },
        drop: (st, k, p) => { st.moved = null; const I = st.items[k];
          if (p.y >= TABLE - 6) { I.off = true; return; }
          const s = p.x < PX ? "L" : "R"; if (I.off || s !== I.side) { I.off = false; I.side = s; } },
        tap: (st, k) => { st.items[k].off = !st.items[k].off; },
        draw: (st) => { const en = ends(st), a = tilt(st); let g = `<rect x="6" y="${TABLE}" width="308" height="48" rx="8" fill="var(--grid)" stroke="var(--line)"/>` + T(160, TABLE + 13, "objets retirés", "middle", 11, ' fill="var(--ink-soft)"');
          g += `<path d="M${PX},${PY} L${PX - 30},${TABLE - 4} L${PX + 30},${TABLE - 4} Z" fill="var(--line)"/><line x1="${en.L.x}" y1="${en.L.y}" x2="${en.R.x}" y2="${en.R.y}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><circle cx="${PX}" cy="${PY}" r="5" fill="var(--ink)"/>`;
          g += `<line x1="${PX}" y1="${PY}" x2="${PX + Math.sin((a * Math.PI) / 180) * 26}" y2="${PY - Math.cos((a * Math.PI) / 180) * 26}" stroke="${a ? "var(--bad)" : "var(--ok)"}" stroke-width="3"/>`;
          ["L", "R"].forEach((s) => { const e = en[s], py = e.y + DROP; g += `<line x1="${e.x}" y1="${e.y}" x2="${e.x - 54}" y2="${py}" stroke="var(--ink-soft)"/><line x1="${e.x}" y1="${e.y}" x2="${e.x + 54}" y2="${py}" stroke="var(--ink-soft)"/><path d="M${e.x - 58},${py} L${e.x + 58},${py} L${e.x + 50},${py + 7} L${e.x - 50},${py + 7} Z" fill="var(--ink-soft)"/>`; });
          return g; },
        out: (st) => { const l = weight(st, "L"), r = weight(st, "R"); return `<b>${side(st, "L")} = ${side(st, "R")}</b> · ${l === r ? '<b class="act-ok">⚖ équilibre</b>' : "la balance penche à " + (l > r ? "gauche" : "droite")}`; },
        hint: (st) => { const l = weight(st, "L"), r = weight(st, "R");
          if (l !== r) return "La balance penche : ce que tu enlèves d'un côté, enlève-le aussi de l'autre.";
          const xl = count(st, "L", "x"), xr = count(st, "R", "x");
          if (xl && xr) return "Équilibre gardé. Il y a des sacs des deux côtés : enlève-en autant de chaque côté.";
          const kx = xl || xr, n = xl ? count(st, "R", "1") : count(st, "L", "1"), u = xl ? count(st, "L", "1") : count(st, "R", "1");
          if (u) return "Équilibre gardé. Il reste des cubes à côté des sacs : enlève-les des deux côtés.";
          if (kx > 1) return kx + " sacs pèsent autant que " + n + " cubes. Enlève un sac, puis rééquilibre avec des cubes.";
          return ""; },
        goal: E.map(([a, b, c, d, X]) => (st) => (solved(st) ? "Un sac seul équilibre " + X + " cubes : x = " + X + ". Contrôle dans " + poly([[a, "x"], [b, ""]]) + " = " + poly([[c, "x"], [d, ""]]) + " : " + (a * X + b) + " = " + (c * X + d) + ". On a fait la même chose des deux côtés à chaque étape." : "")),
        ask: [null, null, { q: "Sans la balance : résous 7 − 2x = 15. Tape x.", ans: -4, ok: "On ajoute 2x des deux côtés : 7 = 15 + 2x ; on retire 15 : −8 = 2x ; on divise par 2 : x = −4. Même idée que la balance : la même opération des deux côtés.", no: "Ajoute 2x des deux côtés, puis retire 15, puis divise par 2." }] }),
    });
  }
  // ---------- outils géométriques ----------
  // Secteur d'angle : angles en degrés, sens direct (y vers le haut), de a0 à a1.
  const pt = (cx, cy, r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  const sector = (cx, cy, r, a0, a1, col, op = 0.35) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
    return `<path d="M${cx.toFixed(1)},${cy.toFixed(1)} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-width="1.5"/>`; };
  const dot = (col, txt, r = 10) => `<circle r="${r}" fill="${col}" stroke="var(--paper)" stroke-width="2.5"/>${txt ? `<text y="-16" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--ink)">${esc(txt)}</text>` : ""}`;
  const r1 = (v) => nb(Math.round(v * 10) / 10);

  // ===================== Fractions : barres à poser sous la somme =====================
  {
    const X0 = 10, LEN = 300, U = 120, DEN = [2, 3, 4, 5, 6, 8, 10, 12], RY = 104, RH = 26;
    const D = [{ a: [1, 4], b: [1, 6] }, { a: [2, 3], b: [1, 6] }, { a: [1, 3], b: [1, 4] }];
    const chip = (i) => ({ x: 46 + (i % 4) * 76, y: 172 + Math.floor(i / 4) * 44 });
    const tgt = (s) => (U * D[s].a[0]) / D[s].a[1] + (U * D[s].b[0]) / D[s].b[1];
    const sum = (st) => st.row.reduce((a, d) => a + U / d, 0);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const piece = (w, d, fill) => `<rect x="${-w / 2}" y="${-RH / 2}" width="${w}" height="${RH}" fill="${fill}" stroke="var(--ink)" stroke-width="1.2"/>` + (w >= 24 ? `<text y="4" text-anchor="middle" font-size="11" font-weight="700" style="fill:var(--ink);pointer-events:none">1/${d}</text>` : "");
    const chipSvg = (d) => `<rect x="-32" y="-18" width="64" height="36" rx="8" fill="var(--card)" stroke="var(--blue)" stroke-width="1.5"/><text y="1" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--ink)">1/${d}</text><rect x="-26" y="7" width="${(52 / d).toFixed(1)}" height="6" fill="var(--ok-soft)" stroke="var(--ink)" stroke-width=".8"/>`;
    const fr = (n, d) => n + "/" + d;
    set("fracadd", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On cherche le plus petit multiple commun des dénominateurs. On écrit chaque fraction avec ce dénominateur (des parts toutes pareilles), on additionne les numérateurs, puis on simplifie. Pour soustraire, même méthode.", exemple: ["\\(\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}\\).", "\\(\\frac{2}{3} + \\frac{1}{6} = \\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}\\).", "\\(\\frac{1}{3} + \\frac{1}{4} = \\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}\\).", "\\(\\frac{5}{6} - \\frac{3}{8} = \\frac{20}{24} - \\frac{9}{24} = \\frac{11}{24}\\)."] },
      /* 24.11 : la soustraction (notion « additionner, soustraire »), en défi court */
      plus: [{ d: "Calcule \\(\\frac{5}{6} - \\frac{3}{8} = \\frac{a}{24}\\). Tape \\(a\\).", ans: 11, ok: "5/6 = 20/24 et 3/8 = 9/24 : 20/24 − 9/24 = 11/24. Pour soustraire, même méthode que pour additionner.", no: "Écris chaque fraction en vingt-quatrièmes : 24 ÷ 6 = 4 et 24 ÷ 8 = 3." }],
      predict: { q: "Combien font 1/3 + 1/4 ?", choices: ["2/7", "7/12", "2/12"], good: 1, why: "Un tiers et un quart ne sont pas des parts de même taille : on les découpe en douzièmes, 4/12 + 3/12 = 7/12. Additionner les dénominateurs donnerait 2/7, moins qu'un tiers seul !" },
      defis: ["Sous 1/4 + 1/6, pose des pièces TOUTES PAREILLES qui font exactement la même longueur.", "Même chose sous 2/3 + 1/6.", "Et sous 1/3 + 1/4."],
      play: manipLesson({ W: 320, H: 240, aria: "barres de fractions",
        note: "Glisse une pièce dans la rangée du milieu (ou touche-la pour l'ajouter). Touche une pièce posée pour l'enlever.",
        init: () => ({ row: [], drag: null, dx: 0, dy: 0, msg: "" }),
        handles: (st) => { const hs = []; let x = X0;
          st.row.forEach((d) => { const w = LEN / d; hs.push({ x: x + w / 2, y: RY + RH / 2, label: "pièce 1/" + d + " posée (toucher pour l'enlever)", svg: piece(w, d, "var(--ok-soft)"), hit: { x: -w / 2, y: -RH / 2 - 6, w, h: RH + 12 } }); x += w; });
          DEN.forEach((d, i) => { const c = chip(i), dr = st.drag === i; hs.push({ x: dr ? st.dx : c.x, y: dr ? st.dy : c.y, label: "pièce 1/" + d, svg: dr ? piece(LEN / d, d, "var(--ok-soft)") : chipSvg(d), hit: { x: -36, y: -21, w: 72, h: 42 } }); });
          return hs; },
        grab: (st, k) => { st.msg = ""; const n = st.row.length; if (k >= n) { st.drag = k - n; const c = chip(k - n); st.dx = c.x; st.dy = c.y; } },
        move: (st, k, p) => { if (k >= st.row.length) { st.dx = clamp(p.x, 10, 310); st.dy = clamp(p.y, 10, 236); } },
        drop: (st, k, p) => { const n = st.row.length; st.drag = null; if (k < n) { if (Math.abs(p.y - (RY + RH / 2)) > 30) st.row.splice(k, 1); return; } if (Math.abs(p.y - (RY + RH / 2)) <= 34) add(st, DEN[k - n]); },
        tap: (st, k) => { const n = st.row.length; st.drag = null; if (k < n) st.row.splice(k, 1); else add(st, DEN[k - n]); },
        draw: (st, s) => { const { a, b } = D[s], wa = (LEN * a[0]) / a[1], wb = (LEN * b[0]) / b[1];
          let g = `<rect x="${X0}" y="10" width="${LEN}" height="22" fill="var(--grid)" stroke="var(--ink)" stroke-width="1.2"/>` + T(X0 + LEN / 2, 26, "1", "middle", 13, ' font-weight="700"');
          g += `<rect x="${X0}" y="52" width="${wa}" height="${RH}" fill="var(--blue)" stroke="var(--ink)"/><rect x="${X0 + wa}" y="52" width="${wb}" height="${RH}" fill="var(--warn)" stroke="var(--ink)"/>`;
          g += T(X0 + wa / 2, 69, fr(a[0], a[1]), "middle", 13, ' font-weight="700" fill="#fff"') + T(X0 + wa + wb / 2, 69, fr(b[0], b[1]), "middle", 13, ' font-weight="700" fill="#fff"') + T(X0 + wa + wb + 6, 69, "= ?", "start", 13, ' font-weight="700"');
          for (const x of [X0 + wa, X0 + wa + wb]) g += `<line x1="${x}" y1="${52}" x2="${x}" y2="${RY + RH + 6}" stroke="var(--margin)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
          g += `<rect x="${X0}" y="${RY}" width="${LEN}" height="${RH}" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/>` + (st.row.length ? "" : T(X0 + LEN / 2, RY + 17, "pose tes pièces ici", "middle", 12, ' fill="var(--ink-soft)"'));
          return g; },
        out: (st, s) => { const n = st.row.length, t = tgt(s), v = sum(st); if (!n) return "Ta rangée est vide.";
          const same = st.row.every((d) => d === st.row[0]); const what = same ? `${n} × 1/${st.row[0]} = <b>${n}/${st.row[0]}</b>` : st.row.map((d) => "1/" + d).join(" + ");
          return what + " · " + (v === t ? '<b class="act-ok">même longueur</b>' : v < t ? "trop court" : "trop long"); },
        hint: (st, s) => { const v = sum(st), t = tgt(s); if (v === t && !st.row.every((d) => d === st.row[0])) return "Bonne longueur ! Mais pour écrire une seule fraction, il faut des pièces toutes pareilles."; if (v > t) return "Trop long : touche une pièce posée pour l'enlever."; return st.msg; },
        goal: D.map(({ a, b }, s) => (st) => { if (!st.row.length || sum(st) !== tgt(s) || !st.row.every((d) => d === st.row[0])) return ""; const d = st.row[0], L = lcm(a[1], b[1]);
          return `${fr(a[0], a[1])} = ${fr((a[0] * d) / a[1], d)} et ${fr(b[0], b[1])} = ${fr((b[0] * d) / b[1], d)}, donc ${fr(a[0], a[1])} + ${fr(b[0], b[1])} = ${fr(st.row.length, d)}.` + (d === L ? " " + L + " est le plus petit dénominateur commun." : " Ça marche, mais des pièces de 1/" + L + " suffisaient : " + fr(st.row.length, d) + " = " + fr((st.row.length * L) / d, L) + "."); }),
        ask: [null, null, { q: "Sans les barres : 1/6 + 3/8 = …/24. Tape le numérateur.", ans: 13, ok: "1/6 = 4/24 et 3/8 = 9/24 : 4/24 + 9/24 = 13/24.", no: "Écris chaque fraction en vingt-quatrièmes : 24 ÷ 6 = 4 et 24 ÷ 8 = 3." }] }),
    });
    function add(st, d) { if (sum(st) + U / d > U) { st.msg = "Ça dépasserait 1 : enlève d'abord des pièces."; return; } st.row.push(d); st.msg = ""; }
  }

  // ===================== Nombres relatifs : la flèche qu'on étire sur la droite =====================
  {
    const X = (v) => 160 + v * 14, LY = 128, AY = 96;
    const D = [{ a: -5, w: 7, txt: "−5 + 7" }, { a: 3, w: -8, txt: "3 − 8" }, { a: -2, w: 6, txt: "(−2) − (−6)", ghost: -6 }];
    const sg = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v);
    const arrow = (x0, x1, y, col, dash) => { if (x0 === x1) return ""; const d = x1 > x0 ? -1 : 1; return `<line x1="${x0}" y1="${y}" x2="${x1 + d * 6}" y2="${y}" stroke="${col}" stroke-width="3"${dash ? ' stroke-dasharray="5 4"' : ""}/><path d="M${x1},${y} L${x1 + d * 10},${y - 6} L${x1 + d * 10},${y + 6} Z" fill="${col}"/>`; };
    set("rel", {
      /* 24.11 : la notion rel est « multiplier, diviser, priorités » (l'addition seule est reladd) : trois défis courts */
      plus: [{ d: "Calcule \\((-6) \\cdot (-7)\\).", ans: 42, ok: "Deux facteurs négatifs : le produit est positif. (−6) · (−7) = 42.", no: "Même signe : le produit est positif." },
        { d: "Calcule \\((-48) \\div 6\\).", ans: -8, ok: "Signes contraires : le quotient est négatif. (−48) ÷ 6 = −8.", no: "Un négatif divisé par un positif : le quotient est négatif." },
        { d: "Calcule \\((-2) \\cdot 5 - (-3) \\cdot 4\\).", ans: 2, ok: "D'abord les produits : (−2) · 5 = −10 et (−3) · 4 = −12. Puis −10 − (−12) = −10 + 12 = 2.", no: "Calcule d'abord les deux produits, puis la soustraction." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Sur la droite graduée, ajouter un nombre positif, c'est avancer ; ajouter un nombre négatif, c'est reculer. Soustraire un nombre, c'est additionner son opposé. Pour multiplier ou diviser : deux nombres de même signe donnent un résultat positif, deux nombres de signes contraires un résultat négatif. Les multiplications et les divisions passent avant les additions et les soustractions.", exemple: ["\\(-5 + 7 = 2\\).", "\\(3 - 8 = -5\\).", "\\((-2) - (-6) = -2 + 6 = 4\\).", "\\((-6) \\cdot (-7) = 42\\) et \\((-48) \\div 6 = -8\\).", "\\((-2) \\cdot 5 - (-3) \\cdot 4 = -10 - (-12) = -10 + 12 = 2\\)."], piege: "Soustraire \\(-6\\), c'est ajouter 6 : \\((-2) - (-6) = 4\\), pas \\(-8\\)." },
      predict: { q: "Combien font (−5) − (−8) ?", choices: ["−13", "3", "−3"], good: 1, why: "Soustraire −8, c'est ajouter 8 : −5 + 8 = 3. Sur la droite, on part de −5 et on avance de 8." },
      defis: ["Calcule −5 + 7 : étire la flèche depuis −5 (glisse le point rouge).", "Calcule 3 − 8.", "Calcule (−2) − (−6). La flèche grise montre « ajouter −6 » : soustraire, c'est faire le contraire."],
      play: manipLesson({ W: 320, H: 172, aria: "droite graduée avec une flèche", // 24.11 : H 160 → 172, « départ » était coupé
        note: "Glisse le point rouge le long de la droite (ou flèches du clavier). On vérifie quand tu le lâches.",
        init: (s) => ({ tip: D[s].a }),
        handles: (st) => [{ x: X(st.tip), y: AY, label: "bout de la flèche, sur " + sg(st.tip), role: "slider", svg: dot("var(--margin)", ""), R: 24 }],
        move: (st, k, p) => { st.tip = clamp(Math.round((p.x - 160) / 14), -10, 10); },
        nudge: (st, k, dx, dy) => { st.tip = clamp(st.tip + dx + dy, -10, 10); },
        draw: (st, s) => { const { a, ghost } = D[s], k = st.tip - a; let g = `<line x1="8" y1="${LY}" x2="312" y2="${LY}" stroke="var(--ink)" stroke-width="1.5"/>`;
          for (let v = -10; v <= 10; v++) g += `<line x1="${X(v)}" y1="${LY - (v % 5 ? 4 : 7)}" x2="${X(v)}" y2="${LY + (v % 5 ? 4 : 7)}" stroke="var(--ink)"/>` + (v % 2 === 0 ? T(X(v), LY + 20, String(v).replace("-", "−"), "middle", 10) : "");
          if (ghost) g += arrow(X(a), X(a + ghost), AY - 40, "var(--ink-soft)", true) + T((X(a) + X(a + ghost)) / 2, AY - 48, "ajouter " + sg(ghost), "middle", 11, ' fill="var(--ink-soft)"');
          g += `<line x1="${X(a)}" y1="${AY}" x2="${X(a)}" y2="${LY}" stroke="var(--ink-soft)" stroke-dasharray="3 3"/><circle cx="${X(a)}" cy="${LY}" r="6" fill="var(--ink)"/>` + T(X(a), LY + 34, "départ", "middle", 10, ' fill="var(--ink-soft)"');
          const col = k > 0 ? "var(--blue)" : "var(--bad)"; g += arrow(X(a), X(st.tip), AY, col);
          if (k) g += T((X(a) + X(st.tip)) / 2, AY - 10, sg(k), "middle", 14, ` font-weight="800" fill="${col}"`) + `<line x1="${X(st.tip)}" y1="${AY}" x2="${X(st.tip)}" y2="${LY}" stroke="${col}" stroke-dasharray="3 3"/><circle cx="${X(st.tip)}" cy="${LY}" r="5" fill="${col}"/>`;
          return T(8, 16, D[s].txt + " = ?", "start", 15, ' font-weight="700"') + g; },
        out: (st, s) => { const k = st.tip - D[s].a; return k ? `Flèche <b>${sg(k)}</b> : de ${sg(D[s].a).replace(/^\+/, "")} on arrive sur <b>${String(st.tip).replace("-", "−")}</b>` : "Étire la flèche : vers la droite pour ajouter un positif, vers la gauche pour un négatif."; },
        hint: (st, s) => { const k = st.tip - D[s].a, w = D[s].w; if (!k || k === w) return "";
          if (s === 2 && k === -6) return "Ça, c'est (−2) + (−6) = −8. Soustraire −6, c'est le contraire d'ajouter −6 : retourne la flèche.";
          if (k === -w) return "Bonne longueur, mauvais sens : " + (w > 0 ? "ajouter un positif, c'est aller vers la droite." : "soustraire 8, c'est aller vers la gauche.");
          return "La flèche doit mesurer " + Math.abs(w) + " graduations : elle en mesure " + Math.abs(k) + "."; },
        goal: D.map(({ a, w, txt }, s) => (st) => (st.tip - a === w ? txt + " = " + String(a + w).replace("-", "−") + [" : ajouter 7, c'est avancer de 7 vers la droite.", " : soustraire 8, c'est reculer de 8 vers la gauche.", " : soustraire −6, c'est ajouter 6. On fait le contraire de la flèche grise."][s] : "")),
        ask: [null, { q: "Sans la droite : calcule −7 + 4.", ans: -3, ok: "De −7, on avance de 4 : on arrive sur −3.", no: "Pars de −7 et avance de 4 vers la droite." }, { q: "Sans la droite : calcule (−5) − (−8).", ans: 3, ok: "Soustraire −8, c'est ajouter 8 : −5 + 8 = 3.", no: "Remplace « − (−8) » par « + 8 »." }] }),
    });
  }

  // ===================== Thalès : la parallèle qu'on glisse =====================
  {
    const U = 21.5, OX = 30, OY = 204, X = (u) => OX + u * U, Y = (v) => OY - v * U, AB = 12;
    const geo = (st) => { const [cx, cy] = st.C, AC = Math.hypot(cx, cy), BC = Math.hypot(cx - AB, cy), t = st.d / AB; return { AC, BC, E: [cx * t, cy * t], AE: AC * t, DE: BC * t, t }; };
    set("thales", {
      predict: { q: "(DE) ∥ (BC), AD = 2, AB = 6, BC = 9. Combien mesure DE ?", choices: ["3", "5", "4,5"], good: 0, why: "Le grand triangle est 3 fois plus grand (6 ÷ 2 = 3) : DE = 9 ÷ 3 = 3. On compare des rapports, pas des différences." },
      defis: ["AB = 12 et BC = 10. Glisse D (la parallèle suit) pour que DE soit la moitié de BC.", "Glisse D pour que DE mesure 7,5.", "Déforme le triangle en déplaçant C, puis place D pour que AD = 4. Les trois rapports restent-ils égaux ?"],
      play: manipLesson({ W: 320, H: 226, aria: "triangle ABC coupé par une parallèle DE",
        note: (st, s) => (s === 2 ? "Glisse le sommet C, puis le point D." : "Glisse le point D sur [AB] : la droite (DE) reste parallèle à (BC)."),
        init: (s, prev) => ({ d: prev ? prev.d : 3, C: [6, 8], moved: false }),
        handles: (st, s) => { const g = geo(st); return [{ x: X(st.d), y: Y(0), label: "point D, AD = " + st.d, role: "slider", svg: dot("var(--margin)", "") }, { x: X(st.C[0]), y: Y(st.C[1]), off: s !== 2, label: "sommet C", svg: dot("var(--blue)", "") }]; },
        move: (st, k, p) => { if (k === 0) st.d = clamp(Math.round((p.x - OX) / U), 1, 11); else { const c = [clamp(Math.round((p.x - OX) / U), 0, 12), clamp(Math.round((OY - p.y) / U), 4, 8)]; st.C = c; st.moved = c[0] !== 6 || c[1] !== 8; } },
        nudge: (st, k, dx, dy) => { if (k === 0) st.d = clamp(st.d + dx + dy, 1, 11); else { st.C = [clamp(st.C[0] + dx, 0, 12), clamp(st.C[1] + dy, 4, 8)]; st.moved = st.C[0] !== 6 || st.C[1] !== 8; } },
        draw: (st) => { const g0 = geo(st), [cx, cy] = st.C, E = g0.E;
          let g = `<polygon points="${X(0)},${Y(0)} ${X(AB)},${Y(0)} ${X(cx)},${Y(cy)}" fill="var(--blue-soft)" stroke="var(--ink)" stroke-width="1.6"/>`;
          g += `<polygon points="${X(0)},${Y(0)} ${X(st.d)},${Y(0)} ${X(E[0])},${Y(E[1])}" fill="var(--warn-soft)" stroke="none"/>`;
          g += `<line x1="${X(AB)}" y1="${Y(0)}" x2="${X(cx)}" y2="${Y(cy)}" stroke="var(--blue)" stroke-width="3"/><line x1="${X(st.d)}" y1="${Y(0)}" x2="${X(E[0])}" y2="${Y(E[1])}" stroke="var(--margin)" stroke-width="3"/>`;
          g += `<circle cx="${X(E[0])}" cy="${Y(E[1])}" r="4" fill="var(--margin)"/>` + T(X(0) - 8, Y(0) + 4, "A", "end", 13, ' font-weight="700"') + T(X(AB) + 8, Y(0) + 4, "B", "start", 13, ' font-weight="700"') + T(X(cx), Y(cy) - 12, "C", "middle", 13, ' font-weight="700"') + T(X(st.d), Y(0) + 18, "D", "middle", 13, ' font-weight="700"') + T(X(E[0]) - 9, Y(E[1]) - 4, "E", "end", 13, ' font-weight="700"');
          g += T((X(st.d) + X(E[0])) / 2 + 6, (Y(0) + Y(E[1])) / 2, "DE = " + r1(g0.DE), "start", 11, ' fill="var(--margin)" font-weight="700"') + T((X(AB) + X(cx)) / 2 + 6, (Y(0) + Y(cy)) / 2, "BC = " + r1(g0.BC), "start", 11, ' fill="var(--blue)" font-weight="700"');
          return g; },
        out: (st) => { const g0 = geo(st), q = (a, b) => nb(Math.round((a / b) * 100) / 100);
          return `AD ÷ AB = ${st.d} ÷ ${AB} = <b>${q(st.d, AB)}</b><br>AE ÷ AC = ${r1(g0.AE)} ÷ ${r1(g0.AC)} = <b>${q(g0.AE, g0.AC)}</b><br>DE ÷ BC = ${r1(g0.DE)} ÷ ${r1(g0.BC)} = <b>${q(g0.DE, g0.BC)}</b>`; },
        goal: [(st) => (st.d === 6 ? "AD = 6, la moitié de AB : DE = 5, la moitié de BC. Les trois rapports valent 0,5." : ""),
          (st) => (st.d === 9 ? "AD ÷ AB = 9 ÷ 12 = 0,75 : DE = 0,75 · 10 = 7,5. Le petit triangle ADE est une réduction du grand." : ""),
          (st) => (st.moved && st.d === 4 ? "Quelle que soit la forme du triangle, AD ÷ AB = AE ÷ AC = DE ÷ BC (ici 1/3) dès que (DE) ∥ (BC) : c'est le théorème de Thalès." : "")],
        hint: (st, s) => (s === 2 && !st.moved && st.d === 4 ? "Déforme d'abord le triangle en déplaçant C." : ""),
        ask: [null, { q: "Nouvelle figure : AD = 4, AB = 10, BC = 15 et (DE) ∥ (BC). Combien mesure DE ?", ans: 6, ok: "AD ÷ AB = 4 ÷ 10 = 0,4, donc DE = 0,4 · 15 = 6.", no: "Les rapports sont égaux : DE ÷ 15 = 4 ÷ 10." },
          { q: "Un bâton de 2 m a une ombre de 3 m ; au même moment, l'ombre d'un arbre mesure 15 m. Hauteur de l'arbre (en m) ?", ans: 10, ok: "15 ÷ 3 = 5 : tout est 5 fois plus grand, l'arbre mesure 2 · 5 = 10 m.", no: "Les rayons du soleil sont parallèles : c'est une configuration de Thalès, ombre ÷ ombre = hauteur ÷ hauteur." }] }),
    });
  }

  // ===================== Homothétie : tirer le coin de l'image =====================
  {
    const O = { x: 34, y: 262 }, S0 = 30;
    set("simil", {
      /* 24.11 : volumes × k³ (notion « Homothéties et similitudes ») */
      plus: [{ d: "Un cube est agrandi avec le rapport \\(k = 3\\). Par combien son volume est-il multiplié ?", ans: 27, ok: "Longueur, largeur et hauteur sont multipliées par 3 : le volume est multiplié par 3 · 3 · 3 = 3³ = 27.", no: "Trois dimensions sont multipliées par 3." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si les longueurs sont multipliées par \\(k\\), les aires sont multipliées par \\(k^2\\) et les volumes par \\(k^3\\).", exemple: ["Rapport \\(k = 3\\) : aire multipliée par 9, volume par 27.", "Aire divisée par 4 : longueurs divisées par 2.", "Aire multipliée par 6,25 : \\(k = 2{,}5\\)."] },
      predict: { q: "On double tous les côtés d'un carré. Son aire est multipliée par…", choices: ["2", "4", "8"], good: 1, why: "Longueurs × 2, donc aire × 2 · 2 = 4 : on voit 4 copies du petit carré dans le grand." },
      defis: ["Tire le coin rouge pour que l'aire du carré soit multipliée par 9.", "Réduis le carré pour que son aire soit divisée par 4.", "Trouve le rapport k qui multiplie l'aire par 6,25."],
      play: manipLesson({ W: 320, H: 276, aria: "carré agrandi depuis le centre O",
        note: "Glisse le coin rouge le long du rayon pointillé : c'est le rapport k qui change.",
        init: () => ({ k: 1 }),
        handles: (st) => [{ x: O.x + S0 * st.k, y: O.y - S0 * st.k, label: "coin de l'image, k = " + nb(st.k), role: "slider", svg: dot("var(--margin)", "") }],
        move: (st, k, p) => { st.k = M.snap((p.x - O.x + O.y - p.y) / (2 * S0), 0.5, 0.5, 7); },
        nudge: (st, k, dx, dy) => { st.k = clamp(st.k + 0.5 * (dx + dy), 0.5, 7); },
        draw: (st) => { const k = st.k, s = S0 * k; let g = `<line x1="${O.x}" y1="${O.y}" x2="${O.x + 236}" y2="${O.y - 236}" stroke="var(--ink-soft)" stroke-dasharray="4 4"/>`;
          g += `<rect x="${O.x}" y="${O.y - s}" width="${s}" height="${s}" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`;
          for (let i = 1; i * S0 < s - 0.1; i++) g += `<line x1="${O.x + i * S0}" y1="${O.y}" x2="${O.x + i * S0}" y2="${O.y - s}" stroke="var(--blue)" stroke-width=".8" stroke-dasharray="3 3"/><line x1="${O.x}" y1="${O.y - i * S0}" x2="${O.x + s}" y2="${O.y - i * S0}" stroke="var(--blue)" stroke-width=".8" stroke-dasharray="3 3"/>`;
          g += `<rect x="${O.x}" y="${O.y - S0}" width="${S0}" height="${S0}" fill="var(--warn)" fill-opacity=".75" stroke="var(--ink)" stroke-width="1.5"/>` + T(O.x + S0 / 2, O.y - S0 / 2 + 4, "1", "middle", 12, ' font-weight="700"');
          g += `<circle cx="${O.x}" cy="${O.y}" r="4" fill="var(--ink)"/>` + T(O.x - 6, O.y + 12, "O", "end", 13, ' font-weight="700"') + T(Math.max(O.x + 6, O.x + s / 2 - 26), O.y + 14, "côté × " + nb(k), "start", 12, /* 24.11 : jamais sur « O » */ ' fill="var(--margin)" font-weight="700"');
          return g; },
        out: (st) => { const k = st.k; return `k = <b>${nb(k)}</b> : longueurs × ${nb(k)}, aire × ${nb(k)}² = <b>${nb(k * k)}</b>` + (Number.isInteger(k) ? ` <span class="small muted">(${k * k} copie${k > 1 ? "s" : ""} du petit carré)</span>` : ""); },
        goal: [(st) => (st.k === 3 ? "k = 3 : on compte 3 · 3 = 9 copies du petit carré. Longueurs × 3, aire × 3² = 9." : ""),
          (st) => (st.k === 0.5 ? "k = 0,5 : aire × 0,5² = 0,25, c'est-à-dire divisée par 4. Un rapport plus petit que 1 réduit la figure." : ""),
          (st) => (st.k === 2.5 ? "k = 2,5 car 2,5² = 6,25 : pour l'aire, on multiplie par k au carré." : "")],
        hint: (st, s) => (s === 0 && st.k === 9 ? "Aire × 81 : trop ! L'aire est multipliée par k · k." : ""),
        ask: [{ q: "Un triangle est agrandi avec le rapport k = 5. Son aire est multipliée par… ?", ans: 25, ok: "5² = 25 : l'aire est multipliée par k au carré, quelle que soit la forme.", no: "Comme pour le carré : aire × k · k." }, null,
          { q: "Un cube est agrandi avec k = 2. Son volume est multiplié par… ?", ans: 8, ok: "Volume × k³ = 2³ = 8 : il faut 8 petits cubes pour faire le grand.", no: "Pour un volume, trois dimensions sont multipliées : k · k · k." }] }),
    });
  }

  // ===================== Angles et parallèles : la sécante qu'on fait tourner =====================
  {
    const Mx = 160, My = 130, Y1 = 80, Y2 = 180, R = 100;
    const PQ = (th) => { const t = (My - Y1) / Math.sin((th * Math.PI) / 180), c = Math.cos((th * Math.PI) / 180); return { P: [Mx + t * c, Y1], Q: [Mx - t * c, Y2] }; };
    set("angles", {
      /* 24.11 : la notion couvre aussi le cercle (curriculum « Angles : parallèles, cercle ») : deux défis courts */
      plus: [{ d: "Dans un cercle de centre O, l'angle inscrit \\(\\widehat{ACB}\\) mesure 38°. Combien mesure l'angle au centre \\(\\widehat{AOB}\\) qui intercepte le même arc ?", ans: 76, ok: "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc : 2 · 38° = 76°.", no: "L'angle au centre est le double de l'angle inscrit." },
        { d: "L'angle au centre \\(\\widehat{AOB}\\) mesure 130°. Combien mesure un angle inscrit \\(\\widehat{ADB}\\) qui intercepte le même arc ?", ans: 65, ok: "La moitié de l'angle au centre : 130° ÷ 2 = 65°. Tous les angles inscrits qui interceptent cet arc mesurent 65°.", no: "L'angle inscrit est la moitié de l'angle au centre." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Deux droites parallèles coupées par une sécante : les angles alternes-internes sont égaux ; deux angles co-intérieurs (du même côté, entre les parallèles) sont supplémentaires, leur somme vaut \\(180°\\). Une sécante perpendiculaire à l'une des parallèles l'est aussi à l'autre. Dans un cercle, l'angle au centre vaut le double d'un angle inscrit qui intercepte le même arc.", exemple: ["Un angle de 70° : son alterne-interne mesure 70°, son co-intérieur 110°.", "Triangle avec des angles de 48° et 75° : \\(180° - 48° - 75° = 57°\\) (la parallèle menée par le sommet le montre).", "Angle inscrit de 38° : l'angle au centre qui intercepte le même arc mesure \\(2 \\cdot 38° = 76°\\) ; angle au centre de 130° : angle inscrit de 65°."], piege: "Alternes-internes : de part et d'autre de la sécante, égaux ; co-intérieurs : du même côté, supplémentaires." },
      predict: { q: "Deux droites parallèles sont coupées par une sécante ; un angle mesure 70°. L'angle alterne-interne mesure…", choices: ["70°", "110°", "20°"], good: 0, why: "Avec des parallèles, les angles alternes-internes sont égaux : 70°. Les angles du même côté (co-intérieurs) sont supplémentaires : 70° + 110° = 180°." },
      defis: ["Fais tourner la sécante (glisse le point rouge) pour que l'angle bleu en P mesure 60°. Regarde l'angle bleu en Q.", "Fais en sorte que l'angle orange mesure 50°.", "Rends la sécante perpendiculaire aux deux parallèles."],
      play: manipLesson({ W: 320, H: 226, aria: "deux parallèles coupées par une sécante",
        note: "Glisse le point rouge en arc de cercle (ou flèches du clavier) : la sécante tourne autour de son milieu.",
        init: (s, prev) => ({ th: prev ? prev.th : 110 }),
        handles: (st) => { const [x, y] = pt(Mx, My, R, st.th); return [{ x, y, label: "bout de la sécante, angle " + st.th + "°", role: "slider", svg: dot("var(--margin)", "") }]; },
        move: (st, k, p) => { st.th = M.C.circle({ x: Mx, y: My }, R, 5, 35, 145)(p).a; },
        nudge: (st, k, dx, dy) => { st.th = clamp(st.th + 5 * (dy - dx), 35, 145); },
        draw: (st) => { const th = st.th, al = 180 - th, { P, Q } = PQ(th), [ax, ay] = pt(Mx, My, R + 22, th), [bx, by] = pt(Mx, My, R + 22, th + 180);
          let g = "";
          for (const y of [Y1, Y2]) g += `<line x1="8" y1="${y}" x2="312" y2="${y}" stroke="var(--ink)" stroke-width="2"/><path d="M290,${y - 5} L298,${y} L290,${y + 5}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
          g += sector(P[0], P[1], 26, th + 180, 360, "var(--blue)") + sector(Q[0], Q[1], 26, th, 180, "var(--blue)") + sector(Q[0], Q[1], 20, 0, th, "var(--warn)");
          g += `<line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="var(--margin)" stroke-width="2.4"/>`;
          const lab = (c, r, a, s, col) => { const [x, y] = pt(c[0], c[1], r, a); return T(x, y + 4, s, "middle", 12, ` font-weight="800" fill="${col}"`); };
          g += lab(P, 42, (th + 540) / 2, al + "°", "var(--blue)");
          g += lab(Q, 42, (th + 180) / 2, al + "°", "var(--blue)") + lab(Q, 36, th / 2, th + "°", "var(--warn)");
          g += T(P[0] + 4, P[1] - 8, "P", "start", 13, ' font-weight="700"') + T(Q[0] - 4, Q[1] + 18, "Q", "end", 13, ' font-weight="700"');
          return g; },
        out: (st) => `Angle bleu en P : <b>${180 - st.th}°</b> · son alterne-interne en Q : <b>${180 - st.th}°</b><br><span style="color:var(--warn)">Angle orange en Q : <b>${st.th}°</b></span> · ${180 - st.th} + ${st.th} = 180`,
        goal: [(st) => (180 - st.th === 60 ? "Les deux angles bleus restent égaux pendant que la sécante tourne : des angles alternes-internes formés par des parallèles sont égaux." : ""),
          (st) => (st.th === 50 ? "Angle orange 50°, angle bleu 130° : les angles co-intérieurs (même côté, entre les parallèles) font 180° ensemble." : ""),
          (st) => (st.th === 90 ? "Perpendiculaire à l'une, elle l'est aussi à l'autre : les quatre angles valent 90°." : "")],
        ask: [{ q: "Deux parallèles, une sécante : un angle mesure 70°. Son alterne-interne mesure… ?", ans: 70, ok: "Alternes-internes égaux : 70°.", no: "Regarde les deux angles bleus : ils restent égaux." }, { q: "Et l'angle co-intérieur d'un angle de 70° ?", ans: 110, ok: "180 − 70 = 110°.", no: "Bleu + orange = 180°." },
          { q: "Un triangle a des angles de 48° et 75°. Combien mesure le troisième ?", ans: 57, ok: "180 − 48 − 75 = 57°. La parallèle à un côté menée par le sommet opposé montre pourquoi : alternes-internes, et un angle plat de 180°.", no: "La somme des trois angles d'un triangle vaut 180°." }] }),
    });
  }

  // ===================== Somme des angles : le triangle déformable =====================
  {
    const X = (u) => 10 + u * 20, Y = (v) => 190 - v * 20, COL = ["var(--blue)", "var(--warn)", "var(--ok)"], NAME = ["A", "B", "C"], START = [[2, 1], [13, 1], [6, 7]];
    const ang = (P) => P.map((p, i) => { const a = P[(i + 1) % 3], b = P[(i + 2) % 3], u = [a[0] - p[0], a[1] - p[1]], v = [b[0] - p[0], b[1] - p[1]];
      return (Math.acos(clamp((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v)), -1, 1)) * 180) / Math.PI; });
    const round180 = (a) => { const f = a.map(Math.floor); let r = 180 - f.reduce((s, x) => s + x, 0); a.map((x, i) => [x - Math.floor(x), i]).sort((p, q) => q[0] - p[0]).forEach(([, i]) => { if (r > 0) { f[i]++; r--; } }); return f; };
    const dir = (p, q) => (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
    const cross = (P) => (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[1][1] - P[0][1]) * (P[2][0] - P[0][0]);
    const dot2 = (P, i) => { const p = P[i], a = P[(i + 1) % 3], b = P[(i + 2) % 3]; return (a[0] - p[0]) * (b[0] - p[0]) + (a[1] - p[1]) * (b[1] - p[1]); };
    const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    set("angtri", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Dans un triangle, la somme des trois angles vaut \\(180°\\) : si un angle grandit, les deux autres rétrécissent. Dans un triangle isocèle, les deux angles à la base sont égaux." },
      predict: { q: "Un triangle très aplati a un angle de 170°. La somme de ses trois angles vaut…", choices: ["180°", "plus de 180°", "ça dépend du triangle"], good: 0, why: "Quelle que soit sa forme, un triangle a 180° d'angles en tout : si un angle grandit, les deux autres rétrécissent. Ici, ils se partagent 10°." },
      defis: ["Déplace un sommet pour obtenir un angle droit.", "Fais un triangle qui a deux angles égaux.", "Fais un angle de plus de 120°. Que reste-t-il pour les deux autres ?"],
      play: manipLesson({ W: 320, H: 300, aria: "triangle dont on déplace les sommets",
        note: "Glisse les sommets (ou flèches du clavier). En bas, les trois angles sont mis bout à bout.",
        init: () => ({ P: START.map((p) => p.slice()) }),
        handles: (st) => st.P.map((p, i) => ({ x: X(p[0]), y: Y(p[1]), label: "sommet " + NAME[i], svg: dot(COL[i], "") })),
        move: (st, k, p) => { const q = [clamp(Math.round((p.x - 10) / 20), 0, 15), clamp(Math.round((190 - p.y) / 20), 0, 8)], P = st.P.map((r, i) => (i === k ? q : r)); if (cross(P) !== 0) st.P = P; },
        nudge: (st, k, dx, dy) => { const o = st.P[k], q = [clamp(o[0] + dx, 0, 15), clamp(o[1] + dy, 0, 8)], P = st.P.map((r, i) => (i === k ? q : r)); if (cross(P) !== 0) st.P = P; },
        draw: (st) => { const P = st.P, a = ang(P), A = round180(a), ccw = cross(P) > 0;
          let g = `<polygon points="${P.map((p) => X(p[0]) + "," + Y(p[1])).join(" ")}" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>`;
          P.forEach((p, i) => { const q1 = P[(i + 1) % 3], q2 = P[(i + 2) % 3], s1 = dir(p, q1), s2 = dir(p, q2); let a0 = ccw ? s1 : s2, a1 = ccw ? s2 : s1; while (a1 < a0) a1 += 360;
            g += sector(X(p[0]), Y(p[1]), 20, a0, a1, COL[i]); const [lx, ly] = pt(X(p[0]), Y(p[1]), 36, (a0 + a1) / 2); g += T(lx, ly + 4, A[i] + "°", "middle", 11, ` font-weight="800" fill="${COL[i]}"`);
            const [nx, ny] = pt(X(p[0]), Y(p[1]), 16, (a0 + a1) / 2 + 180); g += T(nx, ny + 4, NAME[i], "middle", 12, ' font-weight="700"'); });
          const cx = 160, cy = 284; let s = 180; g += `<line x1="${cx - 70}" y1="${cy}" x2="${cx + 70}" y2="${cy}" stroke="var(--ink)" stroke-width="1.5"/>`;
          A.forEach((v, i) => { g += sector(cx, cy, 48, s - v, s, COL[i], 0.45); const [lx, ly] = pt(cx, cy, 34, s - v / 2); if (v >= 14) g += T(lx, ly + 4, v + "°", "middle", 10, ` font-weight="700"`); s -= v; });
          g += T(cx + 74, cy - 2, "180°", "start", 11, ' font-weight="700"');
          return g; },
        out: (st) => { const A = round180(ang(st.P)); return `${A[0]}° + ${A[1]}° + ${A[2]}° = <b>180°</b>`; },
        goal: [(st) => ([0, 1, 2].some((i) => dot2(st.P, i) === 0) ? "Un angle droit : les deux autres se partagent les 90° qui restent." : ""),
          (st) => { const [a, b, c] = [d2(st.P[1], st.P[2]), d2(st.P[0], st.P[2]), d2(st.P[0], st.P[1])]; return a === b || b === c || a === c ? "Deux côtés de même longueur, deux angles égaux : un triangle isocèle." : ""; },
          (st) => { const A = round180(ang(st.P)), m = Math.max(...A); return m > 120 ? "Un angle de " + m + "° : il ne reste que " + (180 - m) + "° pour les deux autres. La somme reste 180°." : ""; }],
        ask: [{ q: "Un triangle rectangle a un angle de 35°. Combien mesure le troisième angle ?", ans: 55, ok: "90 + 35 = 125, et 180 − 125 = 55°.", no: "Les trois angles font 180°, dont 90° pour l'angle droit." }, null,
          { q: "Un quadrilatère se découpe en deux triangles par une diagonale. Quelle est la somme de ses angles (en degrés) ?", ans: 360, ok: "2 · 180° = 360°.", no: "Chaque triangle apporte 180°." }] }),
    });
  }

  // ===================== Diagrammes et moyenne : tirer les barres, égaliser =====================
  {
    const BX = (i) => 52 + i * 54, BW = 36, Y0 = 204, SC = 7, VALS = [12, 18, 9, 21];
    const pill = (txt) => `<rect x="-20" y="-11" width="40" height="22" rx="11" fill="var(--margin)"/><text y="4" text-anchor="middle" font-size="11" font-weight="700" style="fill:#fff">${txt}</text>`;
    const bars = (st) => st.v.concat(st.v5 === null ? [] : [st.v5]);
    set("diagr", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Moyenne : on additionne toutes les valeurs et on divise par leur nombre. Sur un diagramme en barres, c'est la hauteur où ce qui dépasse comble exactement les trous.", exemple: ["12, 18, 9, 21 : moyenne \\(\\frac{60}{4} = 15\\).", "Pour 16 de moyenne en 5 matchs : \\(5 \\cdot 16 = 80\\), donc \\(80 - 60 = 20\\) points."], piege: "Notes 6 ; 6 ; 3 : le 6 compte deux fois, la moyenne est 5, pas \\((6 + 3) \\div 2 = 4{,}5\\)." },
      predict: { q: "Trois notes : 6 ; 6 ; 3. Quelle est la moyenne ?", choices: ["4,5", "5", "6"], good: 1, why: "(6 + 6 + 3) ÷ 3 = 15 ÷ 3 = 5. Le 6 compte deux fois : ce n'est pas (6 + 3) ÷ 2 = 4,5." },
      defis: ["Une joueuse de basket marque 12, 18, 9 et 21 points en 4 matchs. Tire les barres à la bonne hauteur.", "Glisse la ligne rouge à la hauteur où ce qui dépasse comble exactement les trous : c'est la moyenne.", "Un 5e match : combien doit-elle marquer pour que sa moyenne monte à 16 ?"],
      play: manipLesson({ W: 320, H: 236, aria: "diagramme en barres",
        note: (st, s) => ["Glisse le haut de chaque barre (ou flèches du clavier).", "Glisse la ligne rouge vers le haut ou vers le bas.", "Glisse la 5e barre."][s],
        init: (s) => ({ v: s === 0 ? [5, 5, 5, 5] : VALS.slice(), m: 8, v5: s === 2 ? 4 : null }),
        handles: (st, s) => s === 0 ? st.v.map((v, i) => ({ x: BX(i) + BW / 2, y: Y0 - v * SC, label: "barre du match " + (i + 1) + " : " + v, role: "slider", svg: pill(v), hit: { x: -26, y: -22, w: 52, h: 44 } }))
          : s === 1 ? [{ x: 296, y: Y0 - st.m * SC, label: "ligne de la moyenne : " + st.m, role: "slider", svg: pill(st.m), hit: { x: -26, y: -22, w: 52, h: 44 } }]
          : [{ x: BX(4) + BW / 2, y: Y0 - st.v5 * SC, label: "barre du match 5 : " + st.v5, role: "slider", svg: pill(st.v5), hit: { x: -26, y: -22, w: 52, h: 44 } }],
        move: (st, k, p, s) => { const v = clamp(Math.round((Y0 - p.y) / SC), 0, 25); if (s === 0) st.v[k] = v; else if (s === 1) st.m = v; else st.v5 = v; },
        nudge: (st, k, dx, dy, s) => { const d = dy || dx; if (s === 0) st.v[k] = clamp(st.v[k] + d, 0, 25); else if (s === 1) st.m = clamp(st.m + d, 0, 25); else st.v5 = clamp(st.v5 + d, 0, 25); },
        draw: (st, s) => { let g = ""; for (let v = 0; v <= 25; v += 5) g += `<line x1="30" y1="${Y0 - v * SC}" x2="312" y2="${Y0 - v * SC}" stroke="var(--line)"/>` + T(24, Y0 - v * SC + 4, v, "end", 10);
          const B = bars(st);
          B.forEach((v, i) => { g += `<rect x="${BX(i)}" y="${Y0 - v * SC}" width="${BW}" height="${v * SC}" fill="${i === 4 ? "var(--warn)" : "var(--blue)"}" fill-opacity=".85"/>` + T(BX(i) + BW / 2, Y0 + 14, "match " + (i + 1), "middle", 10);
            if (s === 1) { const m = st.m; if (v > m) g += `<rect x="${BX(i)}" y="${Y0 - v * SC}" width="${BW}" height="${(v - m) * SC}" fill="var(--ok)" fill-opacity=".8"/>`; else if (v < m) g += `<rect x="${BX(i)}" y="${Y0 - m * SC}" width="${BW}" height="${(m - v) * SC}" fill="var(--bad-soft)" stroke="var(--bad)" stroke-dasharray="3 2"/>`; } });
          if (s === 1) g += `<line x1="30" y1="${Y0 - st.m * SC}" x2="276" y2="${Y0 - st.m * SC}" stroke="var(--margin)" stroke-width="2.5"/>`;
          if (s === 2) g += `<line x1="30" y1="${Y0 - 16 * SC}" x2="312" y2="${Y0 - 16 * SC}" stroke="var(--margin)" stroke-width="1.5" stroke-dasharray="6 4"/>` + T(312, Y0 - 16 * SC - 5, "16", "end", 11, ' fill="var(--margin)" font-weight="700"');
          g += `<line x1="30" y1="${Y0}" x2="312" y2="${Y0}" stroke="var(--ink)" stroke-width="1.5"/>`;
          return g; },
        out: (st, s) => { if (s === 0) return "Tes barres : " + st.v.join(" · ") + ' <span class="small muted">(à obtenir : 12 · 18 · 9 · 21)</span>';
          if (s === 1) { const up = VALS.map((v) => Math.max(0, v - st.m)).filter((x) => x), dn = VALS.map((v) => Math.max(0, st.m - v)).filter((x) => x), su = up.reduce((a, b) => a + b, 0), sd = dn.reduce((a, b) => a + b, 0);
            return `<span style="color:var(--ok)">Dépasse : ${up.join(" + ") || "0"} = <b>${su}</b></span> · <span style="color:var(--bad)">Manque : ${dn.join(" + ") || "0"} = <b>${sd}</b></span>`; }
          const t = 60 + st.v5; return `Moyenne : (60 + ${st.v5}) ÷ 5 = ${t} ÷ 5 = <b>${nb(t / 5)}</b>`; },
        hint: (st, s) => { if (s === 0) { const i = st.v.findIndex((v, j) => v !== VALS[j]); return i >= 0 ? "Regarde le match " + (i + 1) + " : " + VALS[i] + " points." : ""; }
          if (s === 1) { const su = VALS.reduce((a, v) => a + Math.max(0, v - st.m), 0), sd = VALS.reduce((a, v) => a + Math.max(0, st.m - v), 0); return su > sd ? "Ce qui dépasse est plus grand que les trous : monte la ligne." : su < sd ? "Les trous sont plus grands que ce qui dépasse : descends la ligne." : ""; }
          return st.v5 > 20 ? "La moyenne dépasse 16 : moins haut." : st.v5 < 20 ? "La moyenne est sous 16 : plus haut." : ""; },
        goal: [(st) => (st.v.every((v, j) => v === VALS[j]) ? "Le diagramme est construit : une barre par match, la hauteur est le nombre de points." : ""),
          (st) => (st.m === 15 ? "À 15, ce qui dépasse (3 + 6 = 9) comble exactement les trous (3 + 6 = 9). Le calcul donne la même chose : (12 + 18 + 9 + 21) ÷ 4 = 60 ÷ 4 = 15." : ""),
          (st) => (st.v5 === 20 ? "Avec 20 points, le total vaut 80 et 80 ÷ 5 = 16. Pour une moyenne de 16 en 5 matchs, il faut 16 · 5 = 80 points en tout : 80 − 60 = 20." : "")],
        ask: [null, null, { q: "Notes d'un test : 3 élèves ont 4, 5 élèves ont 5 et 2 élèves ont 6. Quelle est la moyenne de la classe ?", ans: 4.9, ok: "(3 · 4 + 5 · 5 + 2 · 6) ÷ 10 = 49 ÷ 10 = 4,9.", no: "Somme de toutes les notes (12 + 25 + 12) divisée par le nombre d'élèves (10)." }] }),
    });
  }

  // ===================== Volumes : le pavé qu'on étire (longueur, largeur, hauteur) =====================
  {
    const c = 15, ca = 13, sa = 7.5, OX = 150, OY = 114, N2 = ca * ca + sa * sa;
    const P = (x, y, z) => [OX + (x - y) * ca, OY + (x + y) * sa - z * c], pp = (...q) => q.map((v) => { const [x, y] = P(...v); return x.toFixed(1) + "," + y.toFixed(1); }).join(" ");
    const ln = (a, b) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ink)" stroke-width=".7"/>`; };
    const arrowSvg = (a) => `<circle r="12" fill="var(--margin)" stroke="var(--paper)" stroke-width="2.5"/><path d="M-6,0 L6,0 M-6,0 L-3,-3 M-6,0 L-3,3 M6,0 L3,-3 M6,0 L3,3" stroke="#fff" stroke-width="1.8" fill="none" transform="rotate(${a})"/>`;
    set("vol", {
      /* 24.11 : prisme et cylindre (notion « Volumes : prisme droit et cylindre »), en défis courts */
      plus: [{ d: "Cylindre de rayon 2 cm et de hauteur 5 cm : \\(V = A_{\\text{base}} \\cdot h = k\\pi\\ \\text{cm}^3\\). Tape \\(k\\).", ans: 20, ok: "La base est un disque d'aire π · 2² = 4π cm² ; 4π · 5 = 20π cm³, environ 62,8 cm³.", no: "Aire du disque : π · r², puis multiplie par la hauteur." },
        { d: "Prisme droit : sa base est un triangle de base 6 cm et de hauteur 4 cm, et il est long de 10 cm. Volume, en cm³ ?", ans: 120, ok: "Aire de la base : 6 · 4 ÷ 2 = 12 cm² ; 12 · 10 = 120 cm³. Toujours aire de la base × hauteur.", no: "Aire du triangle : base · hauteur ÷ 2, puis multiplie par 10." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On empile des couches identiques à la base : volume = aire de la base × hauteur. Pavé : \\(a \\cdot b \\cdot c\\). Même formule pour un prisme droit et pour un cylindre, dont la base est un disque d'aire \\(\\pi r^2\\).", exemple: ["Cylindre \\(r = 2\\), \\(h = 5\\) : \\(V = \\pi \\cdot 4 \\cdot 5 = 20\\pi \\approx 62{,}8\\ \\text{cm}^3\\).", "Prisme à base triangulaire (6 sur 4), long de 10 : \\(V = 12 \\cdot 10 = 120\\ \\text{cm}^3\\).", "Base 4 × 3 : 12 cubes par couche, 3 couches, \\(36\\ \\text{cm}^3\\).", "\\(24\\ \\text{cm}^3\\) de hauteur 2 : base de 12, par exemple 4 × 3.", "Autre pavé de \\(24\\ \\text{cm}^3\\) : \\(2 \\cdot 3 \\cdot 4\\) ou \\(6 \\cdot 4 \\cdot 1\\)."], piege: "Un même volume peut avoir plusieurs formes : \\(24 = 4 \\cdot 3 \\cdot 2 = 6 \\cdot 4 \\cdot 1\\)." },
      predict: { q: "Combien de cubes de 1 cm³ faut-il pour remplir un pavé de 4 cm × 3 cm × 2 cm ?", choices: ["9", "24", "14"], good: 1, why: "Une couche de 4 · 3 = 12 cubes, et 2 couches : 24 cm³. Volume = aire de la base × hauteur." },
      defis: ["Base 4 × 3 : monte le pavé jusqu'à 36 cm³.", "Fabrique un pavé de 24 cm³ de hauteur 2.", "Fabrique un autre pavé de 24 cm³, qui n'a pas une hauteur de 2."],
      play: manipLesson({ W: 320, H: 214, aria: "pavé formé de petits cubes",
        note: "Glisse les trois poignées rouges : longueur (à droite), largeur (à gauche), hauteur (en haut).",
        init: (s, prev) => (s === 0 ? { L: 4, l: 3, h: 1 } : s === 1 ? { L: 2, l: 2, h: 1 } : Object.assign({}, prev)),
        handles: (st) => { const a = P(st.L + 0.8, 0, 0), b = P(0, st.l + 0.8, 0), t = P(st.L / 2, st.l / 2, st.h);
          return [{ x: a[0], y: a[1], label: "longueur " + st.L, role: "slider", svg: arrowSvg(30) }, { x: b[0], y: b[1], label: "largeur " + st.l, role: "slider", svg: arrowSvg(-30) }, { x: t[0], y: t[1] - 16, label: "hauteur " + st.h, role: "slider", svg: arrowSvg(90) }]; },
        move: (st, k, p) => { const dx = p.x - OX, dy = p.y - OY;
          if (k === 0) st.L = clamp(Math.round((dx * ca + dy * sa) / N2 - 0.8), 1, 6);
          else if (k === 1) st.l = clamp(Math.round((-dx * ca + dy * sa) / N2 - 0.8), 1, 6);
          else st.h = clamp(Math.round((P(st.L / 2, st.l / 2, 0)[1] - (p.y + 16)) / c), 1, 6); },
        nudge: (st, k, dx, dy) => { const d = dx + dy; if (k === 0) st.L = clamp(st.L + d, 1, 6); else if (k === 1) st.l = clamp(st.l + d, 1, 6); else st.h = clamp(st.h + d, 1, 6); },
        draw: (st) => { const { L, l, h } = st; let g = `<polygon points="${pp([0, 0, 0], [L, 0, 0], [L, l, 0], [0, l, 0])}" fill="none" stroke="var(--line)"/>`;
          g += `<polygon points="${pp([0, 0, h], [L, 0, h], [L, l, h], [0, l, h])}" fill="var(--blue-soft)" stroke="var(--ink)" stroke-width="1.4"/>`;
          g += `<polygon points="${pp([L, 0, 0], [L, l, 0], [L, l, h], [L, 0, h])}" fill="var(--blue)" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.4"/>`;
          g += `<polygon points="${pp([0, l, 0], [L, l, 0], [L, l, h], [0, l, h])}" fill="var(--blue)" fill-opacity=".8" stroke="var(--ink)" stroke-width="1.4"/>`;
          for (let i = 1; i < L; i++) g += ln([i, 0, h], [i, l, h]) + ln([i, l, 0], [i, l, h]);
          for (let j = 1; j < l; j++) g += ln([0, j, h], [L, j, h]) + ln([L, j, 0], [L, j, h]);
          for (let z = 1; z < h; z++) g += ln([L, 0, z], [L, l, z]) + ln([0, l, z], [L, l, z]);
          const lab = (q, s, dx, dy) => { const [x, y] = P(...q); return T(x + dx, y + dy, s, "middle", 12, ' font-weight="700" fill="var(--margin)"'); };
          g += lab([L / 2, l, 0], L, 8, 16) + lab([L, l / 2, 0], l, -8, 16) + lab([L, l, h / 2], h, 14, 4);
          return g; },
        out: (st) => { const { L, l, h } = st; return `V = ${L} · ${l} · ${h} = <b>${L * l * h} cm³</b> <span class="small muted">(${h} couche${h > 1 ? "s" : ""} de ${L * l} cubes)</span>`; },
        hint: (st, s) => (s === 0 && (st.L !== 4 || st.l !== 3) ? "Garde la base 4 × 3 : change seulement la hauteur." : s > 0 && st.L * st.l * st.h > 24 ? "Plus de 24 cm³ : trop grand." : ""),
        goal: [(st) => (st.L === 4 && st.l === 3 && st.h === 3 ? "3 couches de 4 · 3 = 12 cubes : 36 cm³. Volume = aire de la base × hauteur." : ""),
          (st) => (st.h === 2 && st.L * st.l * st.h === 24 ? "Base de " + st.L * st.l + " cubes, 2 couches : 24 cm³. Il fallait une base de 12 (" + st.L + " × " + st.l + ")." : ""),
          (st) => (st.h !== 2 && st.L * st.l * st.h === 24 ? st.L + " · " + st.l + " · " + st.h + " = 24 : des pavés de formes différentes peuvent avoir le même volume." : "")],
        ask: [null, null, { q: "Un prisme a une base triangulaire d'aire 6 cm² et un volume de 48 cm³. Quelle est sa longueur (en cm) ?", ans: 8, ok: "Volume = aire de la base × longueur : 48 ÷ 6 = 8 cm.", no: "Comme pour le pavé : volume = aire de la base × hauteur." }] }),
    });
  }
  // ===================== Systèmes : le point qu'on promène jusqu'aux deux droites =====================
  {
    const U = 18, OX = 104, OY = 196, X = (x) => OX + x * U, Y = (y) => OY - y * U, XR = [-5, 11], YR = [-4, 10];
    const S = [{ f: [[-1, 10], [1, -2]], sol: [6, 4] }, { f: [[2, 1], [-1, 7]], sol: [2, 5] }, { f: [[1, 3], [-2, -3]], sol: [-2, 1] }];
    const eqt = ([m, p]) => "y = " + poly([[m, "x"], [p, ""]]);
    const on = ([m, p], P) => P[1] === m * P[0] + p;
    const val = ([m, p], x) => m * x + p;
    const COLS = ["var(--blue)", "var(--warn)"];
    set("sys2", {
      /* 24.11 : les deux méthodes de calcul (combinaison, substitution), en défis courts */
      plus: [{ d: "Système \\(x + y = 11\\) et \\(x - y = 3\\) : additionne les deux équations pour faire disparaître \\(y\\). Que vaut \\(x\\) ?", ans: 7, ok: "(x + y) + (x − y) = 11 + 3, soit 2x = 14 : x = 7, puis y = 11 − 7 = 4. C'est la méthode par combinaison.", no: "Les y s'annulent : il reste 2x = 11 + 3." },
        { d: "Système \\(y = 2x\\) et \\(x + y = 15\\) : remplace \\(y\\) par \\(2x\\) dans la 2e équation. Que vaut \\(x\\) ?", ans: 5, ok: "x + 2x = 15, donc 3x = 15 et x = 5 ; puis y = 2 · 5 = 10. C'est la méthode par substitution.", no: "x + 2x = 15 : résous cette équation." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "La solution d'un système de deux équations est un couple \\((x ; y)\\) qui vérifie les deux équations : c'est le point d'intersection des deux droites. En additionnant les deux équations, une inconnue peut disparaître (méthode par combinaison). Si une équation donne une inconnue isolée, on la remplace dans l'autre (méthode par substitution).", exemple: ["\\(y = 2x\\) et \\(x + y = 15\\) : \\(x + 2x = 15\\), donc \\(x = 5\\) et \\(y = 10\\).", "\\(\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases}\\) En additionnant, \\(2x = 12\\), \\(x = 6\\), \\(y = 4\\).", "\\(y = -x + 10\\) et \\(y = x - 2\\) se coupent en \\((6 ; 4)\\).", "\\(y = 2x + 1\\) et \\(y = -x + 7\\) se coupent en \\((2 ; 5)\\)."] },
      predict: { q: "x + y = 8 et x − y = 2. Que vaut x ?", choices: ["5", "4", "3"], good: 0, why: "En additionnant les deux équations, les y disparaissent : 2x = 10, donc x = 5 (et y = 3). 4 et 4 font bien 8, mais 4 − 4 ne fait pas 2." },
      defis: ["y = −x + 10 et y = x − 2 : place le point P pour que ses coordonnées vérifient les DEUX équations.", "Même chose pour y = 2x + 1 et y = −x + 7.", "Et pour y = x + 3 et y = −2x − 3."],
      play: manipLesson({ W: 320, H: 290, aria: "deux droites et un point à placer",
        note: "Glisse le point P sur le quadrillage (ou flèches du clavier). Une équation s'allume quand P est sur sa droite.",
        init: () => ({ P: [0, 0] }),
        handles: (st) => [{ x: X(st.P[0]), y: Y(st.P[1]), label: "point P (" + st.P.join(" ; ") + ")", svg: dot("var(--margin)", "P") }],
        move: (st, k, p) => { st.P = [clamp(Math.round((p.x - OX) / U), XR[0], XR[1]), clamp(Math.round((OY - p.y) / U), YR[0], YR[1])]; },
        nudge: (st, k, dx, dy) => { st.P = [clamp(st.P[0] + dx, XR[0], XR[1]), clamp(st.P[1] + dy, YR[0], YR[1])]; },
        draw: (st, s) => { let g = "";
          for (let x = XR[0]; x <= XR[1]; x++) g += `<line x1="${X(x)}" y1="${Y(YR[0])}" x2="${X(x)}" y2="${Y(YR[1])}" stroke="var(--line)" stroke-width="${x ? 0.6 : 1.4}"${x ? "" : ' style="stroke:var(--ink)"'}/>`;
          for (let y = YR[0]; y <= YR[1]; y++) g += `<line x1="${X(XR[0])}" y1="${Y(y)}" x2="${X(XR[1])}" y2="${Y(y)}" stroke="var(--line)" stroke-width="${y ? 0.6 : 1.4}"${y ? "" : ' style="stroke:var(--ink)"'}/>`;
          g += T(X(1), Y(0) + 12, "1", "middle", 9) + T(X(0) - 4, Y(1) + 3, "1", "end", 9);
          S[s].f.forEach((F, i) => { const lit = on(F, st.P), [m, q] = F; let a = XR[0], b = XR[1]; if (m) { const u = (YR[0] - q) / m, v = (YR[1] - q) / m; a = Math.max(a, Math.min(u, v)); b = Math.min(b, Math.max(u, v)); }
            g += `<line x1="${X(a)}" y1="${Y(val(F, a))}" x2="${X(b)}" y2="${Y(val(F, b))}" stroke="${COLS[i]}" stroke-width="${lit ? 4 : 2.2}"/>` + T(X(b) - 4, Y(val(F, b)) + (m > 0 ? 14 : -6), eqt(F), "end", 11, ` font-weight="700" fill="${COLS[i]}"`); });
          const [px, py] = st.P; g += `<line x1="${X(px)}" y1="${Y(py)}" x2="${X(px)}" y2="${Y(0)}" stroke="var(--margin)" stroke-dasharray="3 3"/><line x1="${X(px)}" y1="${Y(py)}" x2="${X(0)}" y2="${Y(py)}" stroke="var(--margin)" stroke-dasharray="3 3"/>`;
          return g; },
        out: (st, s) => { const [x, y] = st.P, n = (v) => String(v).replace("-", "−"); return `P(${n(x)} ; ${n(y)})<br>` + S[s].f.map((F, i) => { const v = val(F, x); return `<span style="color:${COLS[i]}">${eqt(F)}</span> : pour x = ${n(x)}, y = ${n(v)} ${v === y ? '<b class="act-ok">✓ P est dessus</b>' : ""}`; }).join("<br>"); },
        hint: (st, s) => { const a = on(S[s].f[0], st.P), b = on(S[s].f[1], st.P); return a !== b ? "P est sur une seule droite : ses coordonnées vérifient une équation, pas l'autre." : ""; },
        goal: S.map(({ f, sol }) => (st) => (on(f[0], st.P) && on(f[1], st.P) ? "P(" + sol.join(" ; ").replace(/-/g, "−") + ") est sur les deux droites : c'est la solution du système, x = " + String(sol[0]).replace("-", "−") + " et y = " + String(sol[1]).replace("-", "−") + ". Par le calcul : " + eqt(f[0]).slice(4) + " = " + eqt(f[1]).slice(4) + "." : "")),
        ask: [null, null, { q: "Sans la figure : x + y = 10 et x − y = 2. Tape y.", ans: 4, ok: "En additionnant : 2x = 12, x = 6 ; puis y = 10 − 6 = 4.", no: "Additionne les deux équations : les y disparaissent." }] }),
    });
  }

  // ===================== Durées : tirer la barre d'une heure (minutes et heures décimales) =====================
  {
    const X0 = 22, W = 276, XM = (m) => X0 + (W * m) / 60;
    set("utemps", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(1\\ \\text{h} = 60\\ \\text{min}\\) : une heure n'a pas 100 minutes. Pour passer des minutes aux heures décimales, on divise par 60. Pour passer des heures décimales aux minutes, on multiplie la partie décimale par 60. Pour une durée entre deux horaires, on passe par l'heure ronde.", exemple: ["\\(45\\ \\text{min} = \\frac{45}{60}\\ \\text{h} = 0{,}75\\ \\text{h}\\).", "\\(0{,}2\\ \\text{h} = 0{,}2 \\cdot 60 = 12\\ \\text{min}\\).", "\\(0{,}35\\ \\text{h} = 21\\ \\text{min}\\).", "De 8 h 47 à 10 h 15 : 13 min jusqu'à 9 h, puis 1 h 15 min, soit 88 min."] },
      /* 24.11 : durée entre deux horaires (notion « Durées et horaires »), en défi court */
      plus: [{ d: "Un train part à 8 h 47 et arrive à 10 h 15. Durée du trajet, en minutes ?", ans: 88, ok: "De 8 h 47 à 9 h : 13 min ; de 9 h à 10 h 15 : 75 min. 13 + 75 = 88 min, soit 1 h 28 min.", no: "Passe par 9 h : combien de minutes de 8 h 47 à 9 h, puis de 9 h à 10 h 15 ?" }],
      predict: { q: "Un film dure 1,5 h. Combien de temps est-ce ?", choices: ["1 h 50 min", "1 h 30 min", "1 h 05 min"], good: 1, why: "0,5 h, c'est une demi-heure : la moitié de 60 min, donc 30 min. Une heure n'a pas 100 minutes." },
      defis: ["Tire la barre jusqu'à 0,75 h.", "Combien de minutes font 0,2 h ? Tire la barre.", "Trouve la durée qui s'écrit 0,35 h."],
      play: manipLesson({ W: 320, H: 128, aria: "barre d'une heure",
        note: "Glisse le bout rouge de la barre (ou flèches du clavier, minute par minute). En haut les minutes, en bas les heures décimales.",
        init: () => ({ m: 10 }),
        handles: (st) => [{ x: XM(st.m), y: 56, label: st.m + " minutes", role: "slider", svg: `<rect x="-7" y="-24" width="14" height="48" rx="7" fill="var(--margin)" stroke="var(--paper)" stroke-width="2"/>`, hit: { x: -22, y: -30, w: 44, h: 60 } }],
        move: (st, k, p) => { st.m = clamp(Math.round(((p.x - X0) / W) * 60), 0, 60); },
        nudge: (st, k, dx, dy) => { st.m = clamp(st.m + dx + dy, 0, 60); },
        draw: (st) => { let g = `<rect x="${X0}" y="38" width="${W}" height="36" rx="6" fill="var(--grid)" stroke="var(--ink)" stroke-width="1.2"/><rect x="${X0}" y="38" width="${(XM(st.m) - X0).toFixed(1)}" height="36" rx="6" fill="var(--blue)"/>`;
          for (let k = 0; k <= 60; k += 5) g += `<line x1="${XM(k)}" y1="${k % 15 ? 32 : 26}" x2="${XM(k)}" y2="38" stroke="var(--ink)"/>` + (k % 15 === 0 ? T(XM(k), 20, k + " min", "middle", 10) : "");
          for (let h = 0; h <= 10; h++) g += `<line x1="${X0 + (W * h) / 10}" y1="74" x2="${X0 + (W * h) / 10}" y2="${h % 5 ? 80 : 86}" stroke="var(--warn)"/>` + (h % 5 === 0 || h === 2 ? "" : "") + (h % 5 === 0 ? T(X0 + (W * h) / 10, 98, nb(h / 10) + " h", "middle", 10, ' fill="var(--warn)"') : "");
          g += T(X0 + (W * 0.25), 98, "0,25 h", "middle", 9, ' fill="var(--warn)"') + T(X0 + (W * 0.75), 98, "0,75 h", "middle", 9, ' fill="var(--warn)"');
          return g + T(160, 120, "les heures décimales comptent en dixièmes d'heure (6 min chacun)", "middle", 10, ' fill="var(--ink-soft)"'); },
        out: (st) => `<b>${st.m} min</b> = ${st.m} ÷ 60 h = <b>${nb(+(st.m / 60).toFixed(4))} h</b>`,
        hint: (st, s) => (s === 0 && st.m === 50 ? "0,75 h, ce n'est pas 50 min : ce sont les trois quarts de 60 minutes." : ""),
        goal: [(st) => (st.m === 45 ? "45 min = 45 ÷ 60 = 0,75 h : trois quarts d'heure." : ""), (st) => (st.m === 12 ? "0,2 h = 0,2 · 60 = 12 min (deux dixièmes d'heure, de 6 min chacun)." : ""), (st) => (st.m === 21 ? "0,35 h = 0,35 · 60 = 21 min. Des heures vers les minutes, on multiplie par 60." : "")],
        ask: [null, null, { q: "Écris 1 h 24 min en heures décimales.", ans: 1.4, ok: "24 ÷ 60 = 0,4 : 1 h 24 min = 1,4 h.", no: "Divise les minutes par 60, puis ajoute l'heure entière." }] }),
    });
  }
  // ===================== Cercle de Thalès : le point C qu'on promène sur le cercle (24.11) =====================
  // [AB] diamètre ; C glisse sur le demi-cercle : l'angle en C reste droit, l'angle en A vaut la moitié de l'angle au centre BOC.
  {
    const O = { x: 160, y: 128 }, R = 100, A = [60, 128], B = [260, 128];
    const PHI = (p) => { let a = (Math.atan2(O.y - p.y, p.x - O.x) * 180) / Math.PI; if (a < 0) a = a < -90 ? 180 : 0; return clamp(Math.round(a / 2) * 2, 6, 174); };
    const unit = (P, Q) => { const dx = Q[0] - P[0], dy = Q[1] - P[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
    set("cercthales", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si \\([AB]\\) est un diamètre et \\(C\\) un point du cercle, le triangle \\(ABC\\) est rectangle en \\(C\\) (cercle de Thalès). L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc.", exemple: ["\\([AB]\\) diamètre et \\(\\widehat{A} = 35°\\) : l'angle en \\(C\\) est droit, donc \\(\\widehat{B} = 90° - 35° = 55°\\).", "Angle au centre \\(\\widehat{BOC} = 100°\\) : l'angle en \\(A\\) mesure 50°.", "Angle au centre 140° : angle inscrit 70°."], piege: "L'angle droit est en \\(C\\), sur le cercle, pas au centre." },
      predict: { q: "Le triangle ABC est inscrit dans un cercle de diamètre [AB]. L'angle en C mesure…", choices: ["90°", "60°", "ça dépend de C"], good: 0, why: "C'est le cercle de Thalès : où que soit C sur le cercle, l'angle ACB est droit." },
      defis: ["[AB] est un diamètre. Glisse C sur le cercle pour que l'angle en A mesure 35°. Regarde l'angle en C.", "Place C pour que le triangle ABC soit isocèle en C (CA = CB).", "Place C pour que l'angle au centre BOC mesure 100°. Compare-le à l'angle en A."],
      play: manipLesson({ W: 320, H: 236, aria: "triangle ABC inscrit dans un cercle de diamètre AB",
        note: "Glisse le point C le long du cercle (ou flèches du clavier, 2° par appui). A et B restent aux deux bouts du diamètre ; AB = 10.",
        init: (s) => ({ phi: [130, 40, 60][s] }),
        handles: (st) => { const [x, y] = pt(O.x, O.y, R, st.phi); return [{ x, y, label: "point C, angle en A " + st.phi / 2 + "°", role: "slider", svg: dot("var(--margin)", "C") }]; },
        move: (st, k, p) => { st.phi = PHI(p); },
        nudge: (st, k, dx, dy) => { st.phi = clamp(st.phi + 2 * (dy - dx), 6, 174); },
        draw: (st, s) => { const a = st.phi / 2, b = 90 - a, C = pt(O.x, O.y, R, st.phi), u = unit(C, A), v = unit(C, B), q = 11;
          let g = `<circle cx="${O.x}" cy="${O.y}" r="${R}" fill="none" stroke="var(--ink-soft)" stroke-width="1.5"/>`;
          g += `<polygon points="${A.join(",")} ${C[0].toFixed(1)},${C[1].toFixed(1)} ${B.join(",")}" fill="var(--blue)" fill-opacity="0.08" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>`;
          if (s === 2) { const [lx, ly] = pt(O.x, O.y, 46, st.phi / 2); g += sector(O.x, O.y, 30, 0, st.phi, "var(--warn)") + `<line x1="${O.x}" y1="${O.y}" x2="${C[0].toFixed(1)}" y2="${C[1].toFixed(1)}" stroke="var(--warn)" stroke-width="2"/>` + T(lx, ly + 4, st.phi + "°", "middle", 12, ' font-weight="800" fill="var(--warn)"'); }
          g += sector(A[0], A[1], 34, 0, a, "var(--blue)") + sector(B[0], B[1], 34, 180 - b, 180, "var(--ok)");
          g += `<path d="M${(C[0] + u[0] * q).toFixed(1)},${(C[1] + u[1] * q).toFixed(1)} L${(C[0] + (u[0] + v[0]) * q).toFixed(1)},${(C[1] + (u[1] + v[1]) * q).toFixed(1)} L${(C[0] + v[0] * q).toFixed(1)},${(C[1] + v[1] * q).toFixed(1)}" fill="none" stroke="var(--margin)" stroke-width="2"/>`;
          const [ax, ay] = pt(A[0], A[1], 50, a / 2), [bx, by] = pt(B[0], B[1], 50, 180 - b / 2), w = Math.hypot(u[0] + v[0], u[1] + v[1]) || 1;
          g += T(ax, ay + 4, a + "°", "middle", 12, ' font-weight="800" fill="var(--blue)"') + T(bx, by + 4, b + "°", "middle", 12, ' font-weight="800" fill="var(--ok)"');
          g += T(C[0] + ((u[0] + v[0]) / w) * 30, C[1] + ((u[1] + v[1]) / w) * 30 + 4, "90°", "middle", 12, ' font-weight="800" fill="var(--margin)"');
          g += `<circle cx="${O.x}" cy="${O.y}" r="3" fill="var(--ink)"/>` + T(O.x, O.y + 17, "O", "middle", 12, ' font-weight="700"');
          return g + T(A[0] - 8, A[1] + 5, "A", "end", 13, ' font-weight="700"') + T(B[0] + 8, B[1] + 5, "B", "start", 13, ' font-weight="700"'); },
        out: (st, s) => { const a = st.phi / 2, b = 90 - a, r = (Math.PI * a) / 180;
          return `Angle en A : <b style="color:var(--blue)">${a}°</b> · en B : <b style="color:var(--ok)">${b}°</b> · en C : <b style="color:var(--margin)">90°</b><br>CA ≈ ${r1(10 * Math.cos(r))} · CB ≈ ${r1(10 * Math.sin(r))}` + (s === 2 ? `<br>Angle au centre BOC : <b style="color:var(--warn)">${st.phi}°</b> = 2 · ${a}°` : ""); },
        hint: (st, s) => (s === 0 ? (st.phi === 110 ? "C'est l'angle en B qui mesure 35° : l'angle en A est l'angle bleu, au bout gauche du diamètre." : "L'angle en C reste à 90°, où que soit C. Il faut que l'angle bleu, en A, mesure 35°.")
          : s === 1 ? "Isocèle en C : CA = CB, donc les angles en A et en B sont égaux. Combien chacun, si ensemble ils font 90° ?"
          : "L'angle orange, au centre, vaut toujours le double de l'angle bleu en A : ici " + st.phi + "° = 2 · " + st.phi / 2 + "°."),
        goal: [(st) => (st.phi === 70 ? "Angle en A 35°, angle en C toujours 90° : l'angle en B vaut 90 − 35 = 55°. Où que soit C sur le cercle, l'angle ACB est droit (cercle de Thalès)." : ""),
          (st) => (st.phi === 90 ? "C en haut du cercle : CA = CB ≈ 7,1 et deux angles de 45°. Le triangle est rectangle ET isocèle en C." : ""),
          (st) => (st.phi === 100 ? "Angle au centre 100°, angle en A 50° : l'angle inscrit vaut la moitié de l'angle au centre qui intercepte le même arc BC." : "")],
        ask: [{ q: "[AB] est un diamètre, C est sur le cercle et l'angle en A mesure 25°. Combien mesure l'angle en B ?", ans: 65, ok: "Angle droit en C : 90 − 25 = 65°.", no: "L'angle en C vaut 90°, donc A + B = 90°." },
          { q: "Diamètre AB = 10 et AC = 6 : calcule BC.", ans: 8, ok: "Le triangle est rectangle en C : BC² = 10² − 6² = 64, BC = 8.", no: "Rectangle en C, d'hypoténuse [AB] : Pythagore." },
          { q: "Un angle au centre mesure 140°. Combien mesure l'angle inscrit qui intercepte le même arc ?", ans: 70, ok: "La moitié de l'angle au centre : 70°.", no: "L'angle inscrit vaut la moitié de l'angle au centre." }] }),
    });
  }

  // ===================== Probabilités : l'urne qu'on remplit (24.11) =====================
  // On glisse (ou touche) des boules de couleur dans l'urne ; la barre des chances et P(rouge) = rouges ÷ toutes les boules suivent.
  {
    const COL = { r: "var(--bad)", b: "var(--blue)", v: "var(--ok)" }, NOM = { r: "rouge", b: "bleue", v: "verte" }, LET = { r: "R", b: "B", v: "V" };
    const URN = { x: 16, y: 44, w: 160, h: 160 }, MAXB = 12, GX = 16, GW = 288, GY = 216;
    const STEPS = [{ c: ["r", "b"], start: ["r", "r", "r"] }, { c: ["r", "b"], start: ["r", "r", "b", "b", "b", "b"] }, { c: ["r", "b", "v"], start: ["r", "b", "v"] }];
    const cnt = (st, c) => st.balls.filter((x) => x === c).length;
    const fr = (n, d) => { const g = gcd(n, d) || 1; return n + "/" + d + (g > 1 ? " = " + n / g + "/" + d / g : ""); };
    const pl = (n, c) => n + " " + NOM[c] + (n > 1 ? "s" : "");
    const slot = (i) => ({ x: URN.x + 26 + (i % 4) * 36, y: URN.y + URN.h - 24 - Math.floor(i / 4) * 34 });
    const src = (j) => ({ x: 252, y: 72 + j * 52 });
    const ball = (c, r = 13) => `<circle r="${r}" fill="${COL[c]}" stroke="var(--paper)" stroke-width="2"/><text y="4.5" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" style="pointer-events:none">${LET[c]}</text>`;
    const add = (st, c) => { if (st.balls.length >= MAXB) { st.msg = "L'urne est pleine (12 boules) : enlève des boules."; return; } st.balls.push(c); st.msg = ""; };
    set("proba", {
      /* 24.11 : arbre et tirages sans remise (notion « Probabilités », 11e), en défi court */
      plus: [{ d: "Urne : 3 rouges et 2 bleues. On tire deux boules l'une après l'autre, sans remise ; sur l'arbre, on multiplie le long d'une branche. \\(P(\\text{deux rouges}) = \\frac{a}{10}\\) : tape \\(a\\).", ans: 3, ok: "1er tirage : 3/5. Il reste 2 rouges sur 4 boules : 2/4. 3/5 · 2/4 = 6/20 = 3/10.", no: "Après une rouge, il reste 4 boules, dont 2 rouges." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Quand toutes les issues ont la même chance, \\(P = \\frac{\\text{nombre de cas favorables}}{\\text{nombre de cas possibles}}\\). Pour deux tirages successifs, on multiplie les probabilités le long d'une branche de l'arbre ; sans remise, il reste une boule de moins.", exemple: ["3 rouges et 3 autres boules : \\(P(\\text{rouge}) = \\frac{3}{6} = \\frac{1}{2}\\).", "3 rouges et 2 bleues, deux tirages sans remise : \\(P(\\text{deux rouges}) = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{3}{10}\\).", "2 rouges sur 5 boules : \\(P(\\text{rouge}) = \\frac{2}{5}\\).", "3 rouges, 1 verte, 2 bleues : \\(P(\\text{rouge}) = \\frac{1}{2}\\), \\(P(\\text{verte}) = \\frac{1}{6}\\)."], piege: "Ajouter une boule d'une autre couleur change le nombre de cas possibles : \\(\\frac{2}{3}\\) devient \\(\\frac{2}{4}\\)." },
      predict: { q: "Une urne contient 2 boules rouges et 1 bleue. On ajoute une boule bleue. La probabilité de tirer une rouge…", choices: ["augmente", "diminue", "ne change pas"], good: 1, why: "Avant : 2 rouges sur 3 boules, 2/3. Après : 2 rouges sur 4 boules, 2/4 = 1/2. Les rouges n'ont pas changé, mais le nombre de cas possibles a augmenté." },
      defis: ["L'urne contient 3 rouges. Ajoute ou enlève des boules pour que P(rouge) = 1/2.", "Nouvelle urne : obtiens P(rouge) = 2/5.", "Avec trois couleurs : obtiens P(rouge) = 1/2 et P(verte) = 1/6."],
      play: manipLesson({ W: 320, H: 236, aria: "urne à remplir de boules de couleur",
        note: "Glisse une boule de droite dans l'urne (ou touche-la) pour l'ajouter ; glisse une boule hors de l'urne (ou touche-la) pour l'enlever. On tire une boule au hasard.",
        init: (s) => ({ balls: STEPS[s].start.slice(), drag: -1, dx: 0, dy: 0, msg: "" }),
        handles: (st, s) => { const cs = STEPS[s].c;
          return cs.map((c, j) => { const P = src(j), d = st.drag === j; return { x: d ? st.dx : P.x, y: d ? st.dy : P.y, label: "ajouter une boule " + NOM[c], svg: ball(c, 15), hit: { x: -26, y: -24, w: 52, h: 48 } }; })
            .concat(st.balls.map((c, i) => { const P = slot(i), d = st.drag === cs.length + i; return { x: d ? st.dx : P.x, y: d ? st.dy : P.y, label: "boule " + NOM[c] + " dans l'urne : la toucher pour l'enlever", svg: ball(c), hit: { x: -17, y: -17, w: 34, h: 34 } }; })); },
        grab: (st, k, s) => { st.msg = ""; st.drag = k; const cs = STEPS[s].c, P = k < cs.length ? src(k) : slot(k - cs.length); st.dx = P.x; st.dy = P.y; },
        move: (st, k, p) => { st.dx = clamp(p.x, 10, 310); st.dy = clamp(p.y, 10, 230); },
        drop: (st, k, p, s) => { st.drag = -1; const cs = STEPS[s].c, inUrn = M.zoneAt([URN], p, 6) === 0;
          if (k < cs.length) { if (inUrn) add(st, cs[k]); else st.msg = "Pour l'ajouter, lâche la boule dans l'urne (ou touche-la simplement)."; }
          else if (!inUrn) st.balls.splice(k - cs.length, 1); },
        tap: (st, k, s) => { st.drag = -1; const cs = STEPS[s].c; if (k < cs.length) add(st, cs[k]); else { st.balls.splice(k - cs.length, 1); st.msg = ""; } },
        draw: (st, s) => { const n = st.balls.length, cs = STEPS[s].c;
          let g = `<path d="M${URN.x},${URN.y} L${URN.x},${URN.y + URN.h - 8} Q${URN.x},${URN.y + URN.h} ${URN.x + 8},${URN.y + URN.h} L${URN.x + URN.w - 8},${URN.y + URN.h} Q${URN.x + URN.w},${URN.y + URN.h} ${URN.x + URN.w},${URN.y + URN.h - 8} L${URN.x + URN.w},${URN.y}" fill="var(--grid)" stroke="var(--ink)" stroke-width="2.5"/>`;
          g += T(URN.x + URN.w / 2, 30, "urne : " + n + " boule" + (n > 1 ? "s" : ""), "middle", 13, ' font-weight="700"');
          cs.forEach((c, j) => { g += T(src(j).x, src(j).y + 30, "+ " + NOM[c], "middle", 11, ' fill="var(--ink-soft)"'); });
          g += T(252, 30, "réserve", "middle", 12, ' fill="var(--ink-soft)"');
          let x = GX; g += `<rect x="${GX}" y="${GY}" width="${GW}" height="14" rx="3" fill="var(--grid)" stroke="var(--line)"/>`;
          if (n) cs.forEach((c) => { const w = (GW * cnt(st, c)) / n; if (w > 0) g += `<rect x="${x.toFixed(1)}" y="${GY}" width="${w.toFixed(1)}" height="14" fill="${COL[c]}" stroke="var(--paper)"/>`; x += w; });
          return g; },
        out: (st, s) => { const n = st.balls.length, cs = STEPS[s].c; if (!n) return "L'urne est vide : ajoute des boules.";
          return "Dans l'urne : " + cs.map((c) => pl(cnt(st, c), c)).join(", ") + " (" + n + " boules)<br>" + cs.filter((c) => c !== "b" || s < 2).map((c) => `P(${NOM[c]}) = <b>${fr(cnt(st, c), n)}</b>`).join(" · "); },
        hint: (st, s) => { if (st.msg) return st.msg; const n = st.balls.length, r = cnt(st, "r"), b = cnt(st, "b"), v = cnt(st, "v"); if (!n) return "Ajoute des boules dans l'urne.";
          if (s === 1 && 5 * r === 2 * b && r) return r + " rouges pour " + b + " bleues, cela fait " + n + " boules : P(rouge) = " + r + "/" + n + ". Il faut 2 rouges sur 5 boules EN TOUT.";
          const t = [1 / 2, 2 / 5, 1 / 2][s], pr = r / n;
          if (Math.abs(pr - t) > 1e-9) return pr > t ? "P(rouge) est trop grande : trop de rouges par rapport au total. Ajoute d'autres couleurs (ou enlève des rouges)." : "P(rouge) est trop petite : ajoute des rouges (ou enlève d'autres boules).";
          return "P(rouge) = 1/2 est atteinte. Pour P(verte) = 1/6, il faut 1 verte pour 6 boules en tout" + (v * 6 > n ? " : il y a trop de vertes." : " : il manque des vertes (ou il y a trop d'autres boules)."); },
        goal: [(st) => { const n = st.balls.length, r = cnt(st, "r"); return n && 2 * r === n ? r + " rouges sur " + n + " boules : P(rouge) = " + fr(r, n) + ". Une chance sur deux : autant de rouges que d'autres boules." : ""; },
          (st) => { const n = st.balls.length, r = cnt(st, "r"); return n && 5 * r === 2 * n ? "P(rouge) = " + fr(r, n) + " : " + r + " rouges sur " + n + " boules. On compare les rouges à TOUTES les boules, pas aux bleues seulement." : ""; },
          (st) => { const n = st.balls.length, r = cnt(st, "r"), v = cnt(st, "v"); return n && 2 * r === n && 6 * v === n ? "P(rouge) = 1/2, P(verte) = 1/6, donc P(bleue) = 1 − 1/2 − 1/6 = 1/3 (" + cnt(st, "b") + " sur " + n + ") : la somme des probabilités vaut 1." : ""; }],
        ask: [{ q: "Une urne contient 4 rouges et 6 bleues. Probabilité de tirer une bleue ? (fraction ou nombre décimal)", ans: 0.6, ok: "6 bleues sur 10 boules : 6/10 = 0,6.", no: "Cas favorables (les bleues) sur cas possibles (toutes les boules)." }, null,
          { q: "Urne de 3 rouges et 2 bleues : on tire deux boules sans remise. P(deux rouges) ? (fraction)", ans: 0.3, ok: "3/5 · 2/4 = 6/20 = 3/10.", no: "Au premier tirage 3/5 ; au deuxième, il reste 2 rouges sur 4 boules : multiplie." }] }),
    });
  }

  // ===================== Modéliser (premier degré) : la droite qu'on règle avec deux poignées (24.11) =====================
  // Taxi A = 6 + 2x contre taxi B = 3x : on règle la droite de A (ordonnée à l'origine, puis un point), on cherche où elles se croisent, puis on construit un taxi C.
  {
    const X = (x) => 36 + x * 22, Y = (y) => 200 - y * 5.5, YM = 32, KX = 214;
    const slope = (st) => (st.Q[1] - st.p) / st.Q[0];
    const seg = (m, p, col, w, dash) => { let lo = 0, hi = 12; if (m) { const a = -p / m, b = (YM - p) / m; lo = Math.max(0, Math.min(a, b)); hi = Math.min(12, Math.max(a, b)); } else if (p < 0 || p > YM) return "";
      return lo < hi ? `<line x1="${X(lo).toFixed(1)}" y1="${Y(m * lo + p).toFixed(1)}" x2="${X(hi).toFixed(1)}" y2="${Y(m * hi + p).toFixed(1)}" stroke="${col}" stroke-width="${w}"${dash ? ' stroke-dasharray="6 4"' : ""}/>` : ""; };
    const eqn = (m, p) => "y = " + poly([[+m.toFixed(2), "x"], [p, ""]]).replace(".", ",");
    const sq = (col) => `<rect x="-9" y="-9" width="18" height="18" rx="4" fill="${col}" stroke="var(--paper)" stroke-width="2.5"/>`;
    const line2 = (st, s) => { const col = s === 2 ? "var(--margin)" : "var(--blue)";
      return [{ x: X(0), y: Y(st.p), label: "ordonnée à l'origine : " + st.p + " CHF", role: "slider", svg: sq(col) }, { x: X(st.Q[0]), y: Y(st.Q[1]), label: "point de la droite : " + st.Q[0] + " km, " + st.Q[1] + " CHF", svg: dot(col, "") }]; };
    set("modaff", {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Taxi A : \\(C(n) = 6 + 2n\\) ; taxi B : \\(C(n) = 3n\\).", "\\(6 + 2n = 3n \\iff n = 6\\) : même prix pour 6 km."] },
      predict: { q: "Taxi A : 6 CHF + 2 CHF/km. Taxi B : 3 CHF/km. Pour 10 km, le moins cher est…", choices: ["A", "B", "ils coûtent pareil"], good: 0, why: "A : 6 + 20 = 26 CHF ; B : 30 CHF. Au-delà de 6 km, la part fixe de A est « remboursée »." },
      defis: ["Règle la droite du taxi A : 6 CHF de prise en charge, puis 2 CHF par km.", "Glisse le repère : pour combien de km les deux taxis coûtent-ils le même prix ?", "Taxi C : 12 CHF de prise en charge, et le même prix que B pour 8 km. Règle sa droite."],
      play: manipLesson({ W: 320, H: 236, aria: "graphique prix en fonction des kilomètres",
        note: (st, s) => (s === 1 ? "Glisse le repère rouge le long de l'axe des km (ou flèches du clavier)." : "Glisse le carré sur l'axe vertical (prise en charge) et le point rond (un autre point de la droite) ; flèches du clavier aussi."),
        init: (s) => (s === 1 ? { x: 2 } : s === 0 ? { p: 2, Q: [4, 8] } : { p: 3, Q: [5, 10] }),
        handles: (st, s) => (s === 1 ? [{ x: X(st.x), y: KX, label: "repère à " + st.x + " km", role: "slider", svg: `<rect x="-26" y="-11" width="52" height="22" rx="11" fill="var(--margin)"/><text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">⇔ ${st.x} km</text>`, hit: { x: -34, y: -22, w: 68, h: 44 } }] : line2(st, s)),
        move: (st, k, p, s) => { if (s === 1) { st.x = clamp(Math.round((p.x - 36) / 22), 0, 12); return; }
          const y = clamp(Math.round((200 - p.y) / 5.5), 0, YM); if (k === 0) st.p = Math.min(y, 30); else st.Q = [clamp(Math.round((p.x - 36) / 22), 1, 12), y]; },
        nudge: (st, k, dx, dy, s) => { if (s === 1) { st.x = clamp(st.x + dx + dy, 0, 12); return; } if (k === 0) st.p = clamp(st.p + dy, 0, 30); else st.Q = [clamp(st.Q[0] + dx, 1, 12), clamp(st.Q[1] + dy, 0, YM)]; },
        draw: (st, s) => { let g = "";
          for (let x = 0; x <= 12; x++) g += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(YM)}" stroke="var(--line)" stroke-width="${x ? 0.6 : 1.6}"${x ? "" : ' style="stroke:var(--ink)"'}/>` + (x % 2 === 0 ? T(X(x), Y(0) + 13, String(x), "middle", 10) : "");
          for (let y = 0; y <= YM; y += 2) g += `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(12)}" y2="${Y(y)}" stroke="var(--line)" stroke-width="${y ? (y % 10 ? 0.4 : 0.9) : 1.6}"${y ? "" : ' style="stroke:var(--ink)"'}/>` + (y % 10 === 0 ? T(X(0) - 5, Y(y) + 4, String(y), "end", 10) : "");
          g += T(X(12), Y(0) + 26, "km", "end", 10, ' fill="var(--ink-soft)"') + T(X(0) + 4, 12, "prix (CHF)", "start", 10, ' fill="var(--ink-soft)"');
          g += seg(3, 0, "var(--warn)", 2.6) + T(X(10.3), Y(31), "B : 3x", "end", 11, ' font-weight="700" fill="var(--warn)"');
          if (s === 0) { const m = slope(st); g += seg(m, st.p, "var(--blue)", 2.8);
            const ty = Y(st.p + m); if (m >= 0 && st.p + m <= YM) g += `<path d="M${X(0)},${Y(st.p)} L${X(1)},${Y(st.p)} L${X(1)},${ty.toFixed(1)}" fill="none" stroke="var(--margin)" stroke-width="1.6" stroke-dasharray="3 2"/>` + T(X(1) + 4, (Y(st.p) + ty) / 2 + 4, "+" + nb(Math.round(m * 100) / 100), "start", 11, ' font-weight="700" fill="var(--margin)"');
            return g; }
          g += seg(2, 6, "var(--blue)", s === 2 ? 1.8 : 2.8) + T(X(12), Y(30) + 14, "A : 2x + 6", "end", 11, ' font-weight="700" fill="var(--blue)"');
          if (s === 1) { const a = 6 + 2 * st.x, b = 3 * st.x;
            g += `<line x1="${X(st.x)}" y1="${Y(0)}" x2="${X(st.x)}" y2="${Y(YM)}" stroke="var(--margin)" stroke-dasharray="4 3"/>`;
            g += `<circle cx="${X(st.x)}" cy="${Y(a)}" r="5" fill="var(--blue)"/><circle cx="${X(st.x)}" cy="${Y(b)}" r="5" fill="var(--warn)"/>`;
            g += T(X(st.x) - 7, Y(a) + (a >= b ? -6 : 14), a + " CHF", "end", 11, ' font-weight="700" fill="var(--blue)"') + T(X(st.x) + 7, Y(b) + (b > a ? -6 : 14), b + " CHF", "start", 11, ' font-weight="700" fill="var(--warn)"');
            return g; }
          return g + seg(slope(st), st.p, "var(--margin)", 2.8) + `<circle cx="${X(8)}" cy="${Y(24)}" r="4" fill="none" stroke="var(--warn)" stroke-width="2"/>`; },
        out: (st, s) => { if (s === 1) { const a = 6 + 2 * st.x, b = 3 * st.x; return `À <b>${st.x} km</b> : A = 6 + 2 · ${st.x} = <b style="color:var(--blue)">${a} CHF</b> · B = 3 · ${st.x} = <b style="color:var(--warn)">${b} CHF</b>`; }
          const m = slope(st), ex = Math.abs(m * 100 - Math.round(m * 100)) < 1e-9;
          return `Prise en charge : <b>${st.p} CHF</b> · par km : <b>${ex ? "" : "≈ "}${nb(Math.round(m * 100) / 100)} CHF</b><br>Taxi ${s === 2 ? "C" : "A"} : ${eqn(Math.round(m * 100) / 100, st.p)}`; },
        hint: (st, s) => { if (s === 1) { const d = 6 - st.x; return "À " + st.x + " km, A − B = " + nb(d) + " CHF. La part fixe de A (6 CHF) est « remboursée » de 1 CHF par km, car B coûte 1 CHF de plus par km."; }
          const m = slope(st);
          if (s === 0) return st.p !== 6 ? "La prise en charge se paie même pour 0 km : c'est le point de la droite sur l'axe vertical." : "Pente actuelle : " + nb(Math.round(m * 100) / 100) + " CHF par km. Chaque km de plus doit ajouter 2 CHF : place le point rond en conséquence.";
          return st.p !== 12 ? "La prise en charge de C (12 CHF) se lit à 0 km, sur l'axe vertical." : "C doit coûter autant que B à 8 km : B(8) = 3 · 8 = 24 CHF. Fais passer la droite par ce point (cercle orange)."; },
        goal: [(st) => (st.p === 6 && Math.abs(slope(st) - 2) < 1e-9 ? "y = 2x + 6 : l'ordonnée à l'origine 6 est la prise en charge (prix pour 0 km), la pente 2 est le prix de chaque km." : ""),
          (st) => (st.x === 6 ? "À 6 km, les deux droites se croisent : 6 + 2 · 6 = 18 = 3 · 6 CHF. Avant, B est moins cher ; après, c'est A. Par le calcul : 6 + 2x = 3x, donc x = 6." : ""),
          (st) => (st.p === 12 && Math.abs(8 * slope(st) + 12 - 24) < 1e-9 ? "Taxi C : y = 1,5x + 12. Par (0 ; 12) et (8 ; 24) : pente = (24 − 12) ÷ 8 = 1,5 CHF par km." : "")],
        ask: [{ q: "Avec le taxi A (6 CHF + 2 CHF/km), combien coûtent 15 km (en CHF) ?", ans: 36, ok: "6 + 2 · 15 = 36 CHF.", no: "Prise en charge + prix du km × nombre de km." },
          { q: "Taxi D : 10 CHF + 1 CHF/km. Pour combien de km coûte-t-il autant que B (3 CHF/km) ?", ans: 5, ok: "10 + x = 3x, donc 2x = 10 et x = 5 km.", no: "Écris 10 + x = 3x, puis isole x." },
          { q: "Un taxi prend 8 CHF de prise en charge et coûte autant que B (3 CHF/km) pour 4 km. Combien coûte chaque km (en CHF) ?", ans: 1, ok: "B(4) = 12 CHF : 8 + 4m = 12, donc m = 1 CHF par km.", no: "Prix de B pour 4 km, moins la prise en charge, divisé par 4." }] }),
    });
  }

  // ===================== Formes du 2e degré : la parabole dont on tire le sommet (24.11) =====================
  // y = (x − h)² + k : on déplace le sommet S(h ; k), la forme développée x² − 2hx + (h² + k) suit ; on fait coïncider avec une parabole cible.
  {
    const X = (x) => 160 + x * 20, Y = (y) => 150 - y * 12, XR = 7, YB = -5, YT = 11;
    const TG = [{ S: [4, 4], txt: "y = x² − 8x + 20" }, { S: [-3, -4], txt: "y = x² + 6x + 5" }, { S: [3, -4], txt: "zéros : 1 et 5" }];
    const sg = (v) => (v < 0 ? "− " + -v : "+ " + v);
    const canon = (h, k) => "y = " + (h ? "(x " + sg(-h) + ")²" : "x²") + (k ? " " + sg(k) : "");
    const devel = (h, k) => "y = " + poly([[1, "x²"], [-2 * h, "x"], [h * h + k, ""]]);
    const curve = (h, k, col, w, dash) => { const d = Math.sqrt(YT + 0.5 - k), a = Math.max(-XR - 0.5, h - d), b = Math.min(XR + 0.5, h + d), P = [];
      for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60, y = (x - h) ** 2 + k; if (y >= YB - 0.5) P.push(X(x).toFixed(1) + "," + Y(y).toFixed(1)); }
      return `<polyline points="${P.join(" ")}" fill="none" stroke="${col}" stroke-width="${w}"${dash ? ' stroke-dasharray="7 5"' : ""}/>`; };
    set("f2formes", {
      predict: { q: "(x − 2)² + 3 a pour sommet…", choices: ["(2 ; 3)", "(−2 ; 3)", "(3 ; 2)"], good: 0, why: "Forme canonique a(x − h)² + k : sommet (h ; k) = (2 ; 3)." },
      defis: ["Tire le sommet de la parabole bleue pour la poser exactement sur la parabole pointillée y = x² − 8x + 20.", "Même chose avec y = x² + 6x + 5.", "Place le sommet pour que la parabole coupe l'axe des x en 1 et en 5."],
      play: manipLesson({ W: 320, H: 226, aria: "parabole dont on déplace le sommet",
        note: "Glisse le sommet S (ou flèches du clavier) : toute la parabole se déplace sans changer de forme. Sous la figure, les deux écritures de la même fonction.",
        init: (s) => ({ S: [[0, 0], [1, 2], [0, -2]][s] }),
        handles: (st) => [{ x: X(st.S[0]), y: Y(st.S[1]), label: "sommet S (" + st.S.join(" ; ") + ")", svg: dot("var(--margin)", "S") }],
        move: (st, k, p) => { st.S = [clamp(Math.round((p.x - 160) / 20), -6, 6), clamp(Math.round((150 - p.y) / 12), YB, 10)]; },
        nudge: (st, k, dx, dy) => { st.S = [clamp(st.S[0] + dx, -6, 6), clamp(st.S[1] + dy, YB, 10)]; },
        draw: (st, s) => { let g = "";
          for (let x = -XR; x <= XR; x++) g += `<line x1="${X(x)}" y1="${Y(YB)}" x2="${X(x)}" y2="${Y(YT)}" stroke="var(--line)" stroke-width="${x ? 0.5 : 1.5}"${x ? "" : ' style="stroke:var(--ink)"'}/>` + (x && x % 2 === 0 ? T(X(x), Y(0) + 12, String(x).replace("-", "−"), "middle", 9) : "");
          for (let y = YB; y <= YT; y++) g += `<line x1="${X(-XR)}" y1="${Y(y)}" x2="${X(XR)}" y2="${Y(y)}" stroke="var(--line)" stroke-width="${y ? 0.5 : 1.5}"${y ? "" : ' style="stroke:var(--ink)"'}/>` + (y && y % 2 === 0 ? T(X(0) - 4, Y(y) + 3, String(y).replace("-", "−"), "end", 9) : "");
          const t = TG[s];
          if (s < 2) g += curve(t.S[0], t.S[1], "var(--ink-soft)", 3, true);
          else g += [1, 5].map((z) => `<circle cx="${X(z)}" cy="${Y(0)}" r="6" fill="none" stroke="var(--warn)" stroke-width="2.5"/>`).join("");
          const [h, k] = st.S; g += `<line x1="${X(h)}" y1="${Y(YB)}" x2="${X(h)}" y2="${Y(YT)}" stroke="var(--margin)" stroke-width="1" stroke-dasharray="3 3"/>` + curve(h, k, "var(--blue)", 2.6);
          return g + `<rect x="${X(XR) - 150}" y="2" width="150" height="17" rx="4" fill="var(--paper)" opacity="0.85"/>` + T(X(XR) - 4, 15, (s < 2 ? "cible : " : "") + t.txt, "end", 11, ` font-weight="700" fill="${s < 2 ? "var(--ink-soft)" : "var(--warn)"}"`); },
        out: (st) => { const [h, k] = st.S; return `Sommet <b>S(${String(h).replace("-", "−")} ; ${String(k).replace("-", "−")})</b><br>${canon(h, k)}<br>= <b>${devel(h, k)}</b>`; },
        hint: (st, s) => { const [h, k] = st.S, [H, K] = TG[s].S;
          if (s === 2) return h !== 3 ? "L'axe de symétrie (pointillé rouge) passe au milieu des deux zéros 1 et 5." : "Bon axe de symétrie : monte ou descends le sommet jusqu'à ce que la parabole passe par 1 et par 5.";
          if (h === H) return "Bon coefficient de x (−2h) : il reste à monter ou descendre le sommet. Compare la constante à celle de la cible.";
          if (k === K) return "Bonne hauteur du sommet : déplace-le vers la gauche ou la droite. Le coefficient de x vaut −2h.";
          return "Les deux paraboles ont la même forme : fais coïncider les sommets. Compare la forme développée à la cible."; },
        goal: [(st) => (st.S[0] === 4 && st.S[1] === 4 ? "Les deux paraboles coïncident : x² − 8x + 20 = (x − 4)² + 4. Sommet (4 ; 4) : h = 8 ÷ 2 et k = 20 − 4²." : ""),
          (st) => (st.S[0] === -3 && st.S[1] === -4 ? "x² + 6x + 5 = (x + 3)² − 4 : sommet (−3 ; −4). Avec h = −3, (x − h)² s'écrit (x + 3)²." : ""),
          (st) => (st.S[0] === 3 && st.S[1] === -4 ? "(x − 3)² − 4 = x² − 6x + 5 = (x − 1)(x − 5) : le sommet est au milieu des zéros (x = 3), et f(3) = −4." : "")],
        ask: [{ q: "Sans la figure : x² − 10x + 27 = (x − h)² + k. Tape k.", ans: 2, ok: "h = 10 ÷ 2 = 5 ; (x − 5)² = x² − 10x + 25, donc k = 27 − 25 = 2.", no: "h est la moitié de 10 ; développe (x − h)² et compare sa constante à 27." },
          { q: "Développe (x + 2)² − 7 : tape la constante.", ans: -3, ok: "(x + 2)² = x² + 4x + 4 ; 4 − 7 = −3.", no: "(x + 2)² = x² + 4x + 4 : il reste à enlever 7." },
          { q: "La parabole y = (x − 2)² − 9 coupe l'axe des x en −1 et en… ?", ans: 5, ok: "Les zéros sont symétriques autour de x = 2 : 2 − 3 = −1 et 2 + 3 = 5.", no: "Le sommet est au milieu des zéros : −1 est à 3 unités à gauche de 2." }] }),
    });
  }

  // ===================== Pente en pourcentage : le bout de la route qu'on tire (24.11) =====================
  // Montée ÷ distance horizontale ; repères tous les 100 m (« 6 % = 6 m pour chaque 100 m ») ; hauteurs dessinées 5 fois plus grandes.
  {
    const X0 = 24, BASE = 196, LPX = 270, EX = 5;
    const SPEC = [{ L: 300, H: 40 }, { L: 250, H: 34 }, { h: 0.9, LM: 25 }];
    const sx = (s, st) => (s < 2 ? LPX / SPEC[s].L : LPX / SPEC[2].LM);
    const dims = (st, s) => (s < 2 ? { L: SPEC[s].L, h: st.h } : { L: st.L, h: 0.9 });
    const pc = (h, L) => Math.round((h / L) * 10000) / 100;
    set("pente", {
      predict: { q: "Un panneau indique une pente de 100 %. La route est…", choices: ["verticale", "inclinée à 45°", "impossible à construire"], good: 1, why: "100 % : on monte de 100 m pour 100 m à l'horizontale. Dénivelé = distance horizontale : c'est la diagonale d'un carré, un angle de 45°." },
      defis: ["Sur 300 m à l'horizontale, tire le bout de la route pour faire une pente de 6 %.", "Sur 250 m à l'horizontale, fais une pente de 12 %.", "Une rampe monte de 0,9 m. Tire son bout pour que sa pente soit de 6 %."],
      play: manipLesson({ W: 320, H: 230, aria: "route en pente dont on tire le bout",
        note: (st, s) => (s < 2 ? "Glisse le bout de la route vers le haut ou le bas (ou flèches du clavier, 1 m par appui)." : "Glisse le bout de la rampe vers la gauche ou la droite (ou flèches du clavier, 0,5 m par appui).") + " Les hauteurs sont dessinées 5 fois plus grandes.",
        init: (s) => (s < 2 ? { h: 10 } : { L: 8 }),
        handles: (st, s) => { const { L, h } = dims(st, s), k = sx(s); return [{ x: X0 + L * k, y: BASE - h * k * EX, label: s < 2 ? "montée : " + h + " m" : "longueur horizontale : " + nb(L) + " m", role: "slider", svg: dot("var(--margin)", "") }]; },
        move: (st, k, p, s) => { const q = sx(s); if (s < 2) st.h = clamp(Math.round((BASE - p.y) / (q * EX)), 0, SPEC[s].H); else st.L = clamp(Math.round(((p.x - X0) / q) * 2) / 2, 2, SPEC[2].LM); },
        nudge: (st, k, dx, dy, s) => { if (s < 2) st.h = clamp(st.h + dy + dx, 0, SPEC[s].H); else st.L = clamp(st.L + 0.5 * (dx + dy), 2, SPEC[2].LM); },
        draw: (st, s) => { const { L, h } = dims(st, s), k = sx(s), xe = X0 + L * k, ye = BASE - h * k * EX;
          let g = `<line x1="4" y1="${BASE}" x2="316" y2="${BASE}" stroke="var(--ink-soft)" stroke-width="1.5"/>`;
          g += `<polygon points="${X0},${BASE} ${xe.toFixed(1)},${BASE} ${xe.toFixed(1)},${ye.toFixed(1)}" fill="var(--grid)"/>`;
          if (s < 2) for (let d = 100; d < L; d += 100) { const yd = BASE - ((h * d) / L) * k * EX; g += `<line x1="${X0 + d * k}" y1="${BASE}" x2="${X0 + d * k}" y2="${yd.toFixed(1)}" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="3 2"/>` + T(X0 + d * k, BASE + 12, d + " m", "middle", 9, ' fill="var(--ok)"') + (h ? T(X0 + d * k - 3, yd - 5, "+" + r1((h * d) / L) + " m", "end", 10, ' font-weight="700" fill="var(--ok)"') : ""); }
          g += `<line x1="${X0}" y1="${BASE}" x2="${xe.toFixed(1)}" y2="${ye.toFixed(1)}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>`;
          g += `<line x1="${xe.toFixed(1)}" y1="${BASE}" x2="${xe.toFixed(1)}" y2="${ye.toFixed(1)}" stroke="var(--margin)" stroke-width="2" stroke-dasharray="4 3"/>`;
          g += T(xe > 250 ? xe - 10 : xe + 10, (BASE + ye) / 2 + 4, nb(h) + " m", xe > 250 ? "end" : "start", 12, ' font-weight="800" fill="var(--margin)"');
          g += T((X0 + xe) / 2, BASE + 26, nb(L) + " m à l'horizontale", "middle", 11, ' font-weight="700"');
          return g + T(X0, 16, "pente : " + nb(pc(h, L)) + " %", "start", 14, ' font-weight="800"'); },
        out: (st, s) => { const { L, h } = dims(st, s), p = pc(h, L), ex = Math.abs((h / L) * 10000 - Math.round((h / L) * 10000)) < 1e-6;
          return `Montée <b>${nb(h)} m</b> pour <b>${nb(L)} m</b> : pente = ${nb(h)} ÷ ${nb(L)} ${ex ? "=" : "≈"} ${nb(p / 100)} = <b>${nb(p)} %</b><br><span class="small muted">angle réel ≈ ${r1((Math.atan(h / L) * 180) / Math.PI)}°</span>`; },
        hint: (st, s) => { if (s === 0) return st.h === 6 ? "6 m pour 300 m, c'est 2 % seulement : 6 % veut dire 6 m pour CHAQUE 100 m (repères verts)." : "Regarde les repères verts tous les 100 m : la route doit y monter de 6 m de plus.";
          if (s === 1) return st.h === 12 ? "12 m pour 250 m, c'est 4,8 % : 12 % veut dire 12 m pour chaque 100 m, donc plus de 12 m sur 250 m." : "Pente 12 % : 12 m de montée par 100 m à l'horizontale. Combien pour 250 m ?";
          return "Pente = montée ÷ horizontale : 0,9 ÷ " + nb(st.L) + " doit valoir 0,06." + (st.L < 15 ? " Ta rampe est trop raide : allonge-la." : " Ta rampe est trop douce : raccourcis-la."); },
        goal: [(st) => (st.h === 18 ? "18 ÷ 300 = 0,06 = 6 % : la route monte de 6 m pour chaque 100 m à l'horizontale." : ""),
          (st) => (st.h === 30 ? "12 % de 250 m : 0,12 · 250 = 30 m de montée (12 m par 100 m)." : ""),
          (st) => (st.L === 15 ? "0,9 ÷ 15 = 0,06 = 6 % : une rampe peu pentue doit être longue." : "")],
        ask: [{ q: "Une route monte de 45 m pour 900 m à l'horizontale. Sa pente, en % ?", ans: 5, ok: "45 ÷ 900 = 0,05 = 5 %.", no: "Montée ÷ distance horizontale, puis en pour cent (× 100)." }, null,
          { q: "Une pente de 100 % fait un angle de combien de degrés avec l'horizontale ?", ans: 45, ok: "100 % : on monte d'autant qu'on avance, c'est la diagonale d'un carré : 45°.", no: "100 % : montée = distance horizontale. Quel triangle est-ce ?" }] }),
    });
  }
})();
