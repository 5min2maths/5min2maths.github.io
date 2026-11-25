// 25.11 (agent trous) · Outils communs des notions qui comblent les derniers manques des référentiels (src/ch11_rep3d.js,
// src/ch1c_trous.js, src/ch4c_trous.js, src/fr_trous.js). Code commun (paquet de base) : constructeurs de questions
// (réponse type « canon » toujours posée), pièges filtrés, enregistrement d'une notion, figures de l'espace en perspective
// cavalière, repère en panneaux, et brique « À toi : 2 questions » des leçons actives (même rendu que act_col34b.js).
// Aucun texte d'élève ici : chaque fichier rédige ses énoncés selon son système (Suisse ou France).
const TRX = (function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => R.nz(a, b);
  const r6 = (v) => +(+v).toFixed(9);
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };
  /* nombre en TeX à la suisse (virgule, milliers 10'000) ; fraction si dénominateur court */
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  /* nombre tapé : entier ou a/b */
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d || d > 400) return String(v); return Math.round(v * d) + "/" + d; };
  const dT = (v, k = 4) => nb(+(+v).toFixed(k));
  const rd = (v, r) => +(Math.round(v / r) * r).toFixed(6);
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (tr.spec) {
      if (tr.spec.kind !== spec.kind) return false;
      if (tr.spec.kind === "pair" && (tr.spec.values.length !== spec.values.length || !tr.spec.values.every(isFinite))) return false;
      const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false);
      if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
    if (spec.kind !== "value") return false;
    const tol = Math.max(spec.round || 0, 1e-9), k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
    if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; for (const k of ["fig", "canon", "calcul"]) if (o[k] !== undefined) x[k] = o[k]; return x; };
  const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value: r6(value) }, o.radical ? { radical: true } : {}), sol, Object.assign({ canon: fS(value) }, o));
  const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, Object.assign({ canon: String(rd(value, round)).replace(".", ",") }, o));
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => { const v = [...new Set(vals.map(r6))].sort((a, b) => a - b); return mk(q, { kind: "set", values: v }, sol, Object.assign({ canon: v.map(fS).join(" ; ") }, o)); };
  const QP = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o)) : null);
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GR = (ask, value, sol, round) => ({ ask, spec: Object.assign({ kind: "value", value: round ? value : r6(value) }, round ? { round } : {}), sol });
  const GRad = (ask, value, sol) => ({ ask, spec: { kind: "value", value: r6(value), radical: true }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const TR = TRAP, TX = (e, m) => ({ e, m }), TSt = (s, m) => ({ s, m }), TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m }), TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  /* problème en plusieurs étapes (niveau 4) : parts [libellé, valeur, arrondi] */
  const P = (q, parts, hints, sol, fig) => ({ fig, q, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: round ? value : r6(value) }, round ? { round } : {}) })), hints });
  /* enregistrement : d = { id, theme, label, ex, CH | FR, againFR, niv, lv, hint, lesson, comps, probs, act } */
  const reg = (defs) => {
    for (const d of defs) {
      if (!NOTIONS.some((n) => n.id === d.id)) NOTIONS.push(Object.assign({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: d.CH || null, MP: null, FR: d.FR || null }, d.againFR ? { againFR: d.againFR } : {}, d.niv ? { niv: d.niv } : {}));
      GEN[d.id] = (lv) => pickForm(d.lv[Math.min(Math.max(lv, 1), 3)]);
      if (typeof VAR !== "undefined") VAR[d.id] = {};
      HINTS_EXTRA[d.id] = d.hint;
      LESSONS_EXTRA[d.id] = d.lesson;
      if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
      if (d.probs && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[d.id] = d.probs;
      if (d.act) actReg({ [d.id]: d.act });
    }
  };
  /* Leçons actives : un fichier de notions est chargé avant src/active.js dans la page unique (dist) et après dans les
     paquets ; ACT_LATER est recopié dans ACTIVE à la fin de src/active.js. */
  /* try : dans la page unique, ACTIVE (const de src/active.js) n'est pas encore initialisé (typeof lèverait une erreur). */
  const actReg = (defs) => { try { Object.assign(ACTIVE, defs); } catch (e) { Object.assign((window.ACT_LATER = window.ACT_LATER || {}), defs); } };
  // ---------- brique « À toi : 2 questions » (réponse tapée, coup de pouce après une erreur ; copie de act_col34b.js) ----------
  const anb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
  const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");
  /* brique « hunt » (copie de act_col34b.js) : o = { ask, label, show(x, s), wins, blank?, miss?, note? } ; actPrep0 (active.js)
     lit play.o et play.mk pour proposer « À toi : 2 questions ». */
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? '<div class="small muted">' + o.note + "</div>" : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = anb(x).replace("−", "-");
      const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || "Pas encore : regarde le coup de pouce, puis recalcule."); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  /* cp[s] : coup de pouce du défi s (affiché avec la réponse proposée), wins[s] = W(réponse, message) */
  const toi = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => '<div class="act-out">' + cp[s] + "<br>tu proposes <b>" + anb(x) + "</b></div>", wins });
  // ---------- figures ----------
  const sv = (w, h, g, lab) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + lab + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
  const tx = (x, y, s, a = "middle", sz = 13, cls = "f-txt") => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + cls + '" text-anchor="' + a + '" font-size="' + sz + '">' + s + "</text>";
  const ln = (x1, y1, x2, y2, cls = "f-line", ex = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '"' + ex + "/>";
  const pg = (pts, cls = "f-shape", ex = "") => '<polygon points="' + pts.map((p) => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ") + '" class="' + cls + '"' + ex + "/>";
  const DASH = ' stroke-dasharray="5 4"';
  /* Solide en perspective cavalière (fuyantes à 45°, réduction 0,5). o = { pts: { nom: [x, y, z] } (x vers la droite,
     y en profondeur, z vers le haut), edges: [[A, B, caché?]], faces: [[noms…]] (remplies, avant les arêtes),
     accent: [[A, B]] (segments mis en valeur), polys: [[noms…]] (section, remplie), labels: noms à écrire, axes: bool,
     marks: [[nom, texte]] (cotes au milieu d'un segment [A, B] : [[A, B, texte]]), W, H, lab } */
  const solid = (o) => {
    const k = 0.5 * Math.SQRT1_2, raw = (p) => [p[0] + k * p[1], -(p[2] + k * p[1])], P0 = o.pts;
    const all = Object.values(P0).map(raw).concat(o.extra ? o.extra.map(raw) : []);
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const Wm = o.W || 300, mg = 26, s = Math.min((Wm - 2 * mg) / Math.max(x1 - x0, 1e-9), ((o.H || 210) - 2 * mg) / Math.max(y1 - y0, 1e-9));
    const H = Math.round((y1 - y0) * s + 2 * mg), X = (p) => { const r = raw(p); return [mg + (r[0] - x0) * s, mg + (r[1] - y0) * s]; }, Q = (n) => X(P0[n]);
    let g = "";
    for (const F of o.faces || []) g += pg(F.map(Q), "f-shape2", ' style="stroke:none;fill-opacity:.55"');
    for (const F of o.polys || []) g += pg(F.map(Q), "f-fill2", ' style="fill-opacity:.75"');
    for (const [a, b, hid] of o.edges || []) { const A = Q(a), B = Q(b); g += ln(A[0], A[1], B[0], B[1], "f-line", ' stroke-width="1.8"' + (hid ? DASH : "")); }
    for (const [a, b, hid] of o.accent || []) { const A = Q(a), B = Q(b); g += ln(A[0], A[1], B[0], B[1], "f-accent", ' stroke-width="2.6"' + (hid ? DASH : "")); }
    for (const [a, b, t, dx = 0, dy = 0] of o.marks || []) { const A = Q(a), B = Q(b); g += tx((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, "middle", 12, "f-accent f-txt"); }
    const cx = mg + ((x0 + x1) / 2 - x0) * s, cy = mg + ((y0 + y1) / 2 - y0) * s;
    for (const n of o.labels || Object.keys(P0)) { const A = Q(n), dx = A[0] - cx, dy = A[1] - cy, d = Math.hypot(dx, dy) || 1; g += tx(A[0] + (11 * dx) / d, A[1] + (11 * dy) / d + 4, n, "middle", 13); }
    for (const n of o.dots || []) { const A = Q(n); g += '<circle cx="' + A[0].toFixed(1) + '" cy="' + A[1].toFixed(1) + '" r="3.5" class="f-dot"/>'; }
    return sv(Wm, H, g, o.lab || "solide en perspective");
  };
  return { pk, nz, r6, den, fT, fS, dT, rd, mk, QN, QR, QX, QSet, QP, QS, GR, GRad, GX, GSet, GP, GSS, TR, TX, TSt, TP, TS, P, reg, actReg, W, toi, sv, tx, ln, pg, DASH, solid };
})();
