// Manipulations refaites (23.11, « la manipulation est un point faible ») : de vrais gestes sur les objets
// mathématiques, avec la bibliothèque src/manip.js (manipLesson). Diagnostic et principes : tools/manipulation.md.
// Remplace la partie « Manipule » (predict, defis, play) des leçons : reduire, distrib, idrem, factor (tuiles
// algébriques), eq1 (balance), fracadd (barres de fractions), rel (flèches sur la droite graduée), thales (parallèle
// qu'on glisse), simil (homothétie), angles (sécante qu'on fait tourner), angtri (triangle déformable), diagr (barres et
// moyenne), vol (pavé de cubes). Le rappel de cours (LESSONS) ne change pas. Chargé après act_manip.js.
(function () {
  if (typeof manipLesson === "undefined" || typeof ACTIVE === "undefined") return;
  const M = MANIP, nb = M.nb, esc = M.esc, clamp = M.clamp;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const T = (x, y, s, a = "middle", sz = 12, ex = "") => (ex = ex.replace(/ fill="([^"]+)"/, ' style="fill:$1"'), `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="f-txt" text-anchor="${a}" font-size="${sz}"${ex}>${s}</text>`);
  const term = (c, l, first) => { const s = c < 0 ? (first ? "−" : " − ") : first ? "" : " + "; const a = Math.abs(c); return s + (l ? (a === 1 ? "" : a) + l : a); };
  const poly = (ts) => { const f = ts.filter(([c]) => c !== 0); return f.length ? f.map(([c, l], i) => term(c, l, i === 0)).join("") : "0"; };
  const set = (id, o) => { ACTIVE[id] = o; };

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
      predict: { q: "3(2x + 5) = ?", choices: ["6x + 5", "6x + 15", "5x + 8"], good: 1, why: "Le 3 multiplie les deux termes : 3 · 2x = 6x et 3 · 5 = 15. Comme l'aire d'un rectangle coupé en deux." },
      defis: ["Remplis le rectangle 3 sur (x + 2) avec des tuiles : quelle est son aire ?", "Remplis le rectangle (x + 2) sur (x + 3).", "Remplis le rectangle 2x sur (x + 3)."],
      play: mk(D1, [null, { q: "Développe (x + 4)(x + 1) et réduis : tape le coefficient de x.", ans: 5, ok: "(x + 4)(x + 1) = x² + x + 4x + 4 = x² + 5x + 4.", no: "Quatre produits : x · x, x · 1, 4 · x et 4 · 1 ; puis regroupe les x." }, null]),
    });
    const D2 = [{ top: ["x", "1"], left: ["x", "1"], txt: "(x + 1)²", msg: "Un carré x², deux barres x et une unité : x² + 2x + 1." },
      { top: ["x", "1", "1"], left: ["x", "1", "1"], txt: "(x + 2)²", msg: "Deux rectangles de 2x (le double produit 4x), plus 2² = 4 : x² + 4x + 4." },
      { top: ["x", "1", "1", "1"], left: ["x", "1", "1", "1"], txt: "(x + 3)²", msg: "x² + 6x + 9 : sans les deux rectangles 3x, il manquerait le double produit." }];
    set("idrem", {
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
      predict: { q: "Factoriser 6x + 9, c'est l'écrire…", choices: ["comme un produit", "comme une somme plus courte"], good: 0, why: "Factoriser = écrire un produit : 6x + 9 = 3(2x + 3). C'est l'inverse de développer." },
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
})();
