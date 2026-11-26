// MP 3e (grade 14, filière « mp ») · chantier G du 24.11 (agent mp34). Calé sur les polycopiés CFPT MP3
// (CFPT/MP3/Polycops de cours, chapitres A à D) et le référentiel MP (S5.EA, S5.PL, S6.EL, S6.VS).
// Douze notions, toutes nouvelles (identifiants propres à la MP, aucune notion du Collège n'est modifiée) :
//   A. Équations avancées : eqabs, eqbic, eqirrmp, eqratmp ;
//   B. Puissances et logarithmes : puisrat, logdef, logprop ;
//   C. Équations exponentielles et logarithmiques : eqexp, eqlog, croissexp ;
//   D. Volumes et similitude : volmp, similmp.
// Niveau MP (base Maurizio) : méthodes guidées, nombres simples, jamais trivial.
// Standard : 3 niveaux, ≥ 3 formes par niveau, pas à pas partout, erreurs typiques, ctx, leçon, indice, 3 compétences,
// problème en plusieurs étapes. Les outils communs sont exportés (MP34H) pour src/ch_mp4.js.
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(12); /* 12 décimales : 5/3 reste reconnaissable comme fraction */
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  // nombre décimal en TeX (virgule, séparateur de milliers)
  const N = (v) => { v = r6(v); let s = Math.abs(v).toFixed(9).replace(/\.?0+$/, ""); let [i, f] = s.split("."); if (i.length >= 5) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return (v < 0 ? "-" : "") + i + (f ? "{,}" + f : ""); };
  const T = (v) => N(v).replace("{,}", ",").replace(/\\text\{'\}/g, "'"); /* texte simple */
  const fT = (v) => { const d = den(v); v = r6(v); if (d === 1 || !d || d > 60) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pT = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const tm = (c, v, first) => { if (!c) return ""; const a = Math.abs(c), s = c < 0 ? (first ? "-" : " - ") : first ? "" : " + "; return s + (v && a === 1 ? "" : fT(a)) + v; };
  const polyT = (cs, x = "x") => { const d = cs.length - 1; let o = ""; cs.forEach((c, i) => { const p = d - i; o += tm(c, p === 0 ? "" : p === 1 ? x : x + "^{" + p + "}", o === ""); }); return o || "0"; };
  const lin = (a, b, x = "x") => polyT([a, b], x);
  const D = (v, s) => N(Math.round(v / s) * s); /* valeur arrondie au pas s, en TeX */
  const uniq = (vals) => vals.filter((v, i) => vals.findIndex((w) => Math.abs(w - v) < 1e-9) === i);
  const sortU = (vals) => uniq(vals).sort((a, b) => a - b);
  const setT = (vals) => (vals.length ? "S = \\{" + sortU(vals).map(fT).join(" \\,;\\, ") + "\\}" : "S = \\varnothing");
  // ---------- constructeurs ----------
  // écriture canonique d'une réponse (couple, inégalité, intervalles) : contrôle des pièges
  const canonS = (sp) => (sp.kind === "pair" ? sp.values.map(fS).join(" ; ") : sp.kind === "ineq" ? "x " + sp.op + " " + fS(sp.value) : sp.kind === "solset" && typeof SolSet !== "undefined" ? SolSet.show(sp.ivs, false) : "");
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e !== undefined) return true;
    if (tr.none) { if (spec.kind !== "set" || !spec.values.length || seen.has("none")) return false; seen.add("none"); return true; }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.length || !tr.s.every(isFinite)) return false; const c = tr.s.map(fS).join(";"); if (seen.has(c)) return false;
      try { if (checkAnswer(spec, tr.s.map(String).join(" ; ")).status === "correct") return false; } catch (e) { return false; } seen.add(c); return true; }
    if (tr.spec) { if (!tr.spec || tr.spec.kind !== spec.kind) return false; const c = canonS(tr.spec); if (!c || seen.has(c)) return false;
      try { if (checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; } seen.add(c); return true; }
    if (spec.kind !== "value" || !isFinite(tr.v)) return false;
    const tol = Math.max(spec.round || 0, 1e-6 * Math.max(1, Math.abs(spec.value)));
    if (Math.abs(tr.v - spec.value) <= tol) return false;
    const k = "v" + r6(tr.v); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.shownOk) x.shownOk = true; return x; };
  const QN = (q, value, sol, o) => (isFinite(value) ? mk(q, Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, o) : null);
  const QS = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "set", values: sortU(vals) }, sol, o) : null);
  const QX = (q, expr, sol, o) => mk(q, Object.assign({ kind: "expr", expr }, o.pos ? { pos: true } : {}), sol, Object.assign({}, o, { traps: (o.traps || []).filter((tr) => { try { return tr.e !== undefined && !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr), o.pos); } catch (e) { return false; } }) }));
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals.slice() }, sol, o);
  const G = (ask, value, sol, round) => GS(ask, value, sol, round);
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: sortU(vals) }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.slice() }, sol });
  const TR = (v, m) => ({ v, m });
  const TS = (s, m) => ({ s: sortU(s), m });
  const T0 = (m) => ({ none: true, m });
  const TX = (e, m) => ({ e, m });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.slice() }, m });
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const lg = (b, arg) => (b === 10 ? "\\log " : "\\log_{" + b + "} ") + arg;
  const l10 = Math.log10, PI = Math.PI;
  const cm3 = "\\text{ cm}^3", cm2 = "\\text{ cm}^2";
  if (typeof window !== "undefined") window.MP34H = { canonS, pk, nz, r6, den, fS, N, T, fT, pT, sg, tm, polyT, lin, D, uniq, sortU, setT, keepT, mk, QN, QS, QX, QP, G, GSet, GX, GP, TR, TS, T0, TX, TP, P };

  // ===================================== A1. eqabs : équations avec valeur absolue =====================================
  const ABS = {
    1: [
      () => { const a = nz(-8, 8), c = R.int(2, 9); if (c === Math.abs(a)) return null; const x1 = a - c, x2 = a + c, A = lin(1, -a);
        return QS("Résous " + M("|" + A + "| = " + c) + ".", [x1, x2], M(A + " = " + c) + " ou " + M(A + " = -" + c) + ", donc " + M("x = " + x2) + " ou " + M("x = " + x1) + " : les deux nombres à distance " + c + " de " + a + ". " + M(setT([x1, x2])) + ".",
          { ctx: "distance", guide: [G("Premier cas, " + M(A + " = " + c) + ". " + M("x") + " = ?", x2, M("x = " + a + " + " + c + " = " + x2) + "."), G("Second cas, " + M(A + " = -" + c) + ". " + M("x") + " = ?", x1, M("x = " + a + " - " + c + " = " + x1) + "."), GSet("Ensemble des solutions ?", [x1, x2], M(setT([x1, x2])) + ".")],
            traps: [TS([x2], "Il y a deux cas : |A| = c donne A = c ou A = −c."), TS([-a - c, -a + c], "Attention au signe : x − a = c donne x = a + c."), TS([c, -c], "On cherche x, pas la valeur de x − a.")] }); },
      () => { const k = pk([2, 3, 4]), x1 = nz(-5, 5), d = R.int(1, 4); if ((k * d) % 2) return null; const c = (k * d) / 2, x2 = x1 - d, b = c - k * x1; if (!b) return null; const A = lin(k, b);
        return QS("Résous " + M("|" + A + "| = " + c) + ".", [x1, x2], M(A + " = " + c) + " donne " + M("x = " + x1) + " ; " + M(A + " = -" + c) + " donne " + M("x = " + x2) + ". " + M(setT([x1, x2])) + ".",
          { ctx: "affine", guide: [G("Cas " + M(A + " = " + c) + " : " + M("x") + " = ?", x1, M(k + "x = " + (c - b)) + ", " + M("x = " + x1) + "."), G("Cas " + M(A + " = -" + c) + " : " + M("x") + " = ?", x2, M(k + "x = " + (-c - b)) + ", " + M("x = " + x2) + "."), GSet("Ensemble des solutions ?", [x1, x2], M(setT([x1, x2])) + ".")],
            traps: [TS([x1], "N'oublie pas le cas A = −c."), TS([x1, (b - c) / k], "Second cas : on retire " + b + " des deux côtés, kx = −c − b."), TS([(c - b), (-c - b)], "Divise encore par " + k + ".")] }); },
      () => { const a = pk([2, 3, 4, 5]), h = nz(-6, 6), c = R.int(1, 6), p = nz(-9, 9), q = a * c + p, A = lin(1, -h);
        return QS("Résous " + M(a + "|" + A + "|" + sg(p) + " = " + q) + ".", [h - c, h + c], "On isole la valeur absolue : " + M("|" + A + "| = " + c) + ", puis " + M(A + " = \\pm " + c) + ". " + M(setT([h - c, h + c])) + ".",
          { ctx: "isoler", guide: [G("Isole la valeur absolue : " + M("|" + A + "|") + " = ?", c, M("(" + q + sg(-p) + ") \\div " + a + " = " + c) + "."), G("Plus grande solution ?", h + c, M("x = " + h + " + " + c + " = " + (h + c)) + "."), GSet("Ensemble des solutions ?", [h - c, h + c], M(setT([h - c, h + c])) + ".")],
            traps: [TS([h - (q - p), h + (q - p)], "Divise aussi par " + a + " avant de séparer les deux cas."), TS([h + c], "Deux cas : x − " + h + " = " + c + " ou = −" + c + "."), TS([h - (q + p) / a, h + (q + p) / a], "On retire " + p + " (opération inverse), puis on divise.")] }); },
    ],
    2: [
      () => { const A = R.int(1, 3), C = pk([1, 2, 3, -1, -2]), B = nz(-6, 6), Dd = nz(-6, 6); if (A === C || A === -C) return null; const x1 = r6((Dd - B) / (A - C)), x2 = r6(-(Dd + B) / (A + C)); if (den(x1) > 6 || den(x2) > 6 || x1 === x2) return null;
        const L = lin(A, B), Rr = lin(C, Dd);
        return QS("Résous " + M("|" + L + "| = |" + Rr + "|") + ". (fractions acceptées)", [x1, x2], M("|A| = |B| \\iff A = B") + " ou " + M("A = -B") + ". " + M(L + " = " + Rr) + " donne " + M("x = " + fT(x1)) + " ; " + M(L + " = -(" + Rr + ")") + " donne " + M("x = " + fT(x2)) + ". " + M(setT([x1, x2])) + ".",
          { ctx: "deux-abs", guide: [G("Cas " + M(L + " = " + Rr) + " : " + M("x") + " = ?", x1, M(fT(A - C) + "x = " + fT(Dd - B)) + ", " + M("x = " + fT(x1)) + "."), G("Cas " + M(L + " = -(" + Rr + ")") + " : " + M("x") + " = ?", x2, M(fT(A + C) + "x = " + fT(-Dd - B)) + ", " + M("x = " + fT(x2)) + "."), GSet("Ensemble des solutions ?", [x1, x2], M(setT([x1, x2])) + ".")],
            traps: [TS([x1], "Deux cas : A = B ou A = −B."), TS([x1, (Dd - B) / (A + C)], "Le « − » porte sur toute la parenthèse : il change le signe des deux termes.")] }); },
      () => { const k = pk([1, 2, 3]), b = nz(-6, 6), p = R.int(3, 9), q = p - R.int(1, p + 3), v = q - p, A = lin(k, b);
        return QS("Résous " + M("|" + A + "| + " + p + " = " + q) + ".", [], "On isole : " + M("|" + A + "| = " + v) + ". Une valeur absolue n'est jamais négative : pas de solution, " + M("S = \\varnothing") + ".",
          { ctx: "jamais-negatif", guide: [G("Isole la valeur absolue : " + M("|" + A + "|") + " = ?", v, M(q + " - " + p + " = " + v) + "."), GSet("Ensemble des solutions ? (écris « aucune » s'il n'y en a pas)", [], "Une valeur absolue est toujours positive ou nulle : " + M("S = \\varnothing") + ".")],
            traps: [TS([(v - b) / k, (-v - b) / k], "Une valeur absolue n'est jamais négative : |A| = " + v + " est impossible.")] }); },
      () => { const a = nz(-9, 9), b = nz(-9, 9); if (a === b || a + b === 0) return null; const m = (a + b) / 2;
        return QS("Quel nombre " + M("x") + " est à la même distance de " + M(a) + " et de " + M(b) + " ? Résous " + M("|" + lin(1, -a) + "| = |" + lin(1, -b) + "|") + ".", [m], "Le cas " + M(lin(1, -a) + " = " + lin(1, -b)) + " est impossible. " + M(lin(1, -a) + " = -(" + lin(1, -b) + ")") + " donne " + M("2x = " + (a + b)) + ", " + M("x = " + fT(m)) + " (le milieu).",
          { ctx: "milieu", guide: [G("Second cas, " + M(lin(1, -a) + " = -(" + lin(1, -b) + ")") + " : que vaut " + M("2x") + " ?", a + b, M("2x = " + a + sg(b) + " = " + (a + b)) + "."), GSet("Ensemble des solutions ? (le premier cas n'en donne pas)", [m], M(setT([m])) + ".")],
            traps: [TS([a, b], "Ce sont les deux points ; on cherche le point à égale distance."), TS([(a - b) / 2], "2x = " + a + " + " + b + " : on additionne.")] }); },
    ],
    3: [
      () => { /* audit niveau 25.11 : forme de l'examen TASV spécifique 2024 (« 3x² − 2|x| − 1 = 0 ») : on pose X = |x| ≥ 0 */
        const a = pk([1, 2, 3, 4]), p = R.int(1, 5), n = R.int(1, 5), b = n - a * p, c = -n * p; if (!b || (a === 1 && n === p)) return null; const X2 = -n / a, sol = [-p, p];
        return QS("Résous " + M((a === 1 ? "" : a) + "x^2" + (b === 1 ? " + " : b === -1 ? " - " : sg(b)) + "|x|" + sg(c) + " = 0") + ".", sol, "On pose " + M("X = |x| \\ge 0") + " (et " + M("x^2 = X^2") + ") : " + M(polyT([a, b, c], "X") + " = 0") + " donne " + M("X = " + p) + " ou " + M("X = " + fT(X2)) + " (rejetée : " + M("|x|") + " n'est jamais négatif). " + M("|x| = " + p) + " : " + M(setT(sol)) + ".",
          { ctx: "carre-abs", guide: [G("On pose " + M("X = |x|") + " : " + M(polyT([a, b, c], "X") + " = 0") + ". Solution positive " + M("X") + " ?", p, M("X = " + p) + " (l'autre, " + M(fT(X2)) + ", est négative : rejetée)."), GSet("Ensemble des solutions en " + M("x") + " ?", sol, M("|x| = " + p) + " : " + M(setT(sol)) + ".")],
            traps: [TS([p, X2], "Ce sont les valeurs de X = |x| ; X négatif est impossible, puis |x| = " + p + " donne deux solutions."), TS([p], "|x| = " + p + " donne x = " + p + " ou x = −" + p + "."), TS([-p, p, X2, -X2], "X = " + fS(X2) + " est négatif : |x| ne peut pas valoir ce nombre.")] }); },
      () => { let p, a, c, sol;
        if (R.rand() < 0.6) { p = R.int(2, 5); const q = R.int(1, p - 1); if ((p * p + q * q) % 2) return null; a = (p * p + q * q) / 2; c = (p * p - q * q) / 2; sol = [p, -p, q, -q]; }
        else { p = R.int(2, 5); a = R.int(1, Math.ceil(p * p / 2) - 1); c = p * p - a; sol = [p, -p]; }
        const two = sol.length === 4;
        return QS("Résous " + M("|x^2 - " + a + "| = " + c) + ".", sol, M("x^2 - " + a + " = " + c) + " donne " + M("x^2 = " + (a + c)) + " ; " + M("x^2 - " + a + " = -" + c) + " donne " + M("x^2 = " + (a - c)) + (two ? "" : " (impossible)") + ". " + M(setT(sol)) + ".",
          { ctx: "carre", guide: [G("Cas " + M("x^2 - " + a + " = " + c) + " : " + M("x^2") + " = ?", a + c, M(a + " + " + c + " = " + (a + c)) + "."), G("Cas " + M("x^2 - " + a + " = -" + c) + " : " + M("x^2") + " = ?", a - c, M(a + " - " + c + " = " + (a - c)) + (two ? "." : " : un carré n'est jamais négatif, pas de solution.")), GSet("Ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS(sol.filter((v) => v > 0), "x² = " + p * p + " donne x = " + p + " ou x = −" + p + "."), TS(two ? [a + c, a - c] : [a + c], "Ce sont les valeurs de x² : prends les racines (±).")] }); },
      () => { const A = R.int(1, 3), C = pk([1, 2, 3, -1]), B = nz(-6, 6), Dd = nz(-6, 6); if (A === C || A === -C) return null;
        const x1 = r6((Dd - B) / (A - C)), x2 = r6(-(Dd + B) / (A + C)); if (den(x1) > 4 || den(x2) > 4 || x1 === x2) return null;
        const ok1 = C * x1 + Dd >= 0, ok2 = C * x2 + Dd >= 0; if (ok1 === ok2) return null; const good = ok1 ? x1 : x2, bad = ok1 ? x2 : x1, L = lin(A, B), Rr = lin(C, Dd);
        return QS("Résous " + M("|" + L + "| = " + Rr) + ". (fractions acceptées)", [good], "Cas " + M(L + " = " + Rr) + " : " + M("x = " + fT(x1)) + " ; cas " + M(L + " = -(" + Rr + ")") + " : " + M("x = " + fT(x2)) + ". On garde seulement les x pour lesquels " + M(Rr + " \\ge 0") + " : " + M("x = " + fT(bad)) + " donne " + M(fT(r6(C * bad + Dd)) + " < 0") + ", rejetée. " + M(setT([good])) + ".",
          { ctx: "verification", guide: [G("Cas " + M(L + " = " + Rr) + " : " + M("x") + " = ?", x1, M("x = " + fT(x1)) + "."), G("Cas " + M(L + " = -(" + Rr + ")") + " : " + M("x") + " = ?", x2, M("x = " + fT(x2)) + "."), GSet("Garde celles pour lesquelles " + M(Rr + " \\ge 0") + ". Ensemble des solutions ?", [good], M(setT([good])) + ".")],
            traps: [TS([x1, x2], "Vérifie : le membre de droite doit être positif ou nul (une valeur absolue n'est jamais négative)."), TS([bad], "Celle-ci rend le membre de droite négatif : c'est l'autre qu'il faut garder.")] }); },
      () => { const k = pk([2, 3]), a = nz(-9, 9), x1 = r6(-a / (k - 1)), x2 = r6(a / (k + 1)); if (den(x2) > 4) return null; const w = k === 2 ? "le double" : "le triple";
        return QS("Trouve les nombres dont la distance à " + M(a) + " vaut " + w + " de leur distance à 0 : résous " + M("|" + lin(1, -a) + "| = " + k + "|x|") + ". (fractions acceptées)", [x1, x2], M(lin(1, -a) + " = " + k + "x") + " donne " + M("x = " + fT(x1)) + " ; " + M(lin(1, -a) + " = -" + k + "x") + " donne " + M("x = " + fT(x2)) + ". " + M(setT([x1, x2])) + ".",
          { ctx: "distance-double", guide: [G("Cas " + M(lin(1, -a) + " = " + k + "x") + " : " + M("x") + " = ?", x1, M(fT(1 - k) + "x = " + a) + ", " + M("x = " + fT(x1)) + "."), G("Cas " + M(lin(1, -a) + " = -" + k + "x") + " : " + M("x") + " = ?", x2, M((k + 1) + "x = " + a) + ", " + M("x = " + fT(x2)) + "."), GSet("Ensemble des solutions ?", [x1, x2], M(setT([x1, x2])) + ".")],
            traps: [TS([x2], "Deux cas : A = B ou A = −B."), TS([x1], "Deux cas : A = B ou A = −B."), TS([a / (k - 1), x2], "Premier cas : x − kx = " + a + ", soit (1 − " + k + ")x = " + a + " : le coefficient est négatif.")] }); },
    ],
  };

  // ===================================== A2. eqbic : bicarrées, changement de variable =====================================
  const BIC = {
    1: [
      () => { const p = R.int(2, 6), q = R.int(1, p - 1), s = p * p + q * q, Pr = p * p * q * q, sol = [p, -p, q, -q];
        return QS("Résous " + M("x^4 - " + s + "x^2 + " + Pr + " = 0") + ".", sol, "On pose " + M("X = x^2") + " : " + M("X^2 - " + s + "X + " + Pr + " = 0") + ", " + M("X = " + q * q) + " ou " + M("X = " + p * p) + ". Retour à x : " + M(setT(sol)) + ".",
          { ctx: "bicarree", guide: [G("On pose " + M("X = x^2") + " : " + M("X^2 - " + s + "X + " + Pr + " = 0") + ". Plus petite solution en " + M("X") + " ?", q * q, M("X = " + q * q) + "."), G("Plus grande ?", p * p, M("X = " + p * p) + "."), GSet("Retour à " + M("x") + " (" + M("x^2 = X") + ") : ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS([q * q, p * p], "Ce sont les valeurs de X = x² : prends encore les racines (±)."), TS([p, q], "x² = " + p * p + " donne x = " + p + " ou x = −" + p + ".")] }); },
      () => { const p = R.int(2, 6), m = R.int(1, 9), B = p * p - m; if (!B) return null; const sol = [p, -p];
        return QS("Résous " + M("x^4" + tm(-B, "x^{2}") + tm(-p * p * m, "") + " = 0") + ".", sol, "Avec " + M("X = x^2") + " : " + M("X = " + p * p) + " ou " + M("X = -" + m) + ". Or " + M("x^2 = -" + m) + " n'a pas de solution. " + M(setT(sol)) + ".",
          { ctx: "x-negatif", guide: [G("On pose " + M("X = x^2") + ". Solution positive en " + M("X") + " ?", p * p, M("X = " + p * p) + "."), G("L'autre solution en " + M("X") + " ?", -m, M("X = -" + m) + " : " + M("x^2 = -" + m) + " est impossible."), GSet("Ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS([p], "x² = " + p * p + " a deux solutions : " + p + " et −" + p + "."), TS([p * p, -m], "Ce sont les valeurs de X = x².")] }); },
      () => { const q = R.int(1, 4), neg = R.rand() < 0.4, X2 = neg ? -R.int(1, 6) : R.int(q + 1, 6) ** 2, X1 = q * q, s = X1 + X2, Pr = X1 * X2; if (!s) return null;
        return QS("En posant " + M("X = x^2") + ", l'équation " + M("x^4" + tm(-s, "x^{2}") + tm(Pr, "") + " = 0") + " devient " + M("X^2" + tm(-s, "X") + tm(Pr, "") + " = 0") + ". Donne ses solutions en " + M("X") + ".", [X1, X2], "Discriminant " + M("\\Delta = " + (s * s - 4 * Pr)) + ", " + M("X = " + Math.min(X1, X2)) + " ou " + M("X = " + Math.max(X1, X2)) + ".",
          { ctx: "etape-X", guide: [G("Discriminant " + M("\\Delta") + " = ?", s * s - 4 * Pr, M("(" + -s + ")^2 - 4 \\cdot " + pT(Pr) + " = " + (s * s - 4 * Pr)) + "."), GSet("Solutions en " + M("X") + " ?", [X1, X2], M("X = " + Math.min(X1, X2)) + " ou " + M("X = " + Math.max(X1, X2)) + ".")],
            traps: [TS([-X1, -X2], "Attention aux signes : X² − sX + P = (X − a)(X − b)."), TS(neg ? [q, -q] : [q, -q, Math.sqrt(X2), -Math.sqrt(X2)], "On demande les valeurs de X, pas encore celles de x.")] }); },
    ],
    2: [
      () => { const p = nz(-3, 3), q = nz(-3, 3); if (p === q || p === -q) return null; const a = p ** 3, b = q ** 3, sol = [p, q];
        return QS("Résous " + M("x^6" + tm(-(a + b), "x^{3}") + tm(a * b, "") + " = 0") + ".", sol, "On pose " + M("X = x^3") + " : " + M("X = " + a) + " ou " + M("X = " + b) + ". Racine cubique : " + M(setT(sol)) + ".",
          { ctx: "cube", guide: [G("On pose " + M("X = x^3") + ". Plus petite solution en " + M("X") + " ?", Math.min(a, b), M(Math.min(a, b)) + "."), G("Plus grande ?", Math.max(a, b), M(Math.max(a, b)) + "."), GSet("Retour à " + M("x") + " (racine cubique) : ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS([a, b], "Ce sont les valeurs de X = x³ : prends la racine cubique."), TS([p, -p, q, -q], "x³ = a n'a qu'une solution, du même signe que a.")] }); },
      () => { const r1 = nz(-4, 6), r2 = nz(-4, 6), b = nz(-5, 5); if (r1 === r2 || r1 + r2 === 0) return null; const s = r1 + r2, Pr = r1 * r2, sol = [r1 - b, r2 - b], X = "(" + lin(1, b) + ")";
        return QS("Résous " + M(X + "^2" + tm(-s, X) + tm(Pr, "") + " = 0") + ".", sol, "On pose " + M("X = " + lin(1, b)) + " : " + M("X = " + Math.min(r1, r2)) + " ou " + M("X = " + Math.max(r1, r2)) + ", puis " + M("x = X" + sg(-b)) + ". " + M(setT(sol)) + ".",
          { ctx: "affine", guide: [G("On pose " + M("X = " + lin(1, b)) + ". Plus petite solution en " + M("X") + " ?", Math.min(r1, r2), M(Math.min(r1, r2)) + "."), G("Plus grande ?", Math.max(r1, r2), M(Math.max(r1, r2)) + "."), GSet("Retour à " + M("x = X" + sg(-b)) + " : ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS([r1, r2], "Ce sont les valeurs de X = x " + (b < 0 ? "− " + -b : "+ " + b) + " : il faut encore isoler x."), TS([r1 + b, r2 + b], "x = X " + (b < 0 ? "+ " + -b : "− " + b) + " : attention au signe.")] }); },
      () => { const r2 = R.int(2, 6), r1 = R.rand() < 0.35 ? -R.int(1, 4) : R.int(1, r2 - 1), s = r1 + r2, Pr = r1 * r2; if (s === 0 || s === 1) return null; const sol = r1 > 0 ? [r1 * r1, r2 * r2] : [r2 * r2];
        return QS("Résous " + M("x" + tm(-s, "\\sqrt{x}") + tm(Pr, "") + " = 0") + ".", sol, "On pose " + M("X = \\sqrt{x} \\ge 0") + " : " + M("X^2" + tm(-s, "X") + tm(Pr, "") + " = 0") + ", " + M("X = " + r1) + " ou " + M("X = " + r2) + (r1 < 0 ? " (rejetée, car " + M("\\sqrt{x} \\ge 0") + ")" : "") + ". Puis " + M("x = X^2") + " : " + M(setT(sol)) + ".",
          { ctx: "racine", guide: [G("On pose " + M("X = \\sqrt{x}") + ". Plus grande solution en " + M("X") + " ?", r2, M(r2) + "."), G("Plus petite ?", r1, M(r1) + (r1 < 0 ? " : impossible, une racine n'est jamais négative." : ".")), GSet("Retour à " + M("x = X^2") + " : ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS(r1 > 0 ? [r1, r2] : [r2], "Ce sont les valeurs de √x : élève au carré."), TS([r1 * r1, r2 * r2], "√x ne peut pas valoir " + r1 + " : rejette cette valeur.")] }); },
      () => { const a = R.int(1, 6), b = R.int(1, 6); if (a === b) return null;
        return QS("Résous " + M("x^4" + tm(a + b, "x^{2}") + tm(a * b, "") + " = 0") + ".", [], "Avec " + M("X = x^2") + " : " + M("X = -" + a) + " ou " + M("X = -" + b) + " ; un carré n'est jamais négatif. " + M("S = \\varnothing") + ".",
          { ctx: "aucune", guide: [G("On pose " + M("X = x^2") + ". Plus petite solution en " + M("X") + " ?", -Math.max(a, b), M(-Math.max(a, b)) + "."), G("Plus grande ?", -Math.min(a, b), M(-Math.min(a, b)) + "."), GSet("Ensemble des solutions en " + M("x") + " ? (écris « aucune » s'il n'y en a pas)", [], "Les deux valeurs de " + M("x^2") + " sont négatives : " + M("S = \\varnothing") + ".")],
            traps: [TS([-a, -b], "Ce sont les valeurs de X = x², et un carré n'est jamais négatif.")] }); },
    ],
    3: [
      () => { const b = nz(-4, 4), u1 = R.int(-5, 5), u2 = R.int(-5, 5), v1 = -b - u1, v2 = -b - u2, X1 = -u1 * v1, X2 = -u2 * v2; const all = sortU([u1, v1, u2, v2]); if (all.length < 4 || X1 === X2) return null; const s = X1 + X2, Pr = X1 * X2; if (!s || !Pr) return null; const X = "(x^2" + tm(b, "x") + ")";
        return QS("Résous " + M(X + "^2" + tm(-s, X) + tm(Pr, "") + " = 0") + ".", all, "On pose " + M("X = x^2" + tm(b, "x")) + " : " + M("X = " + Math.min(X1, X2)) + " ou " + M("X = " + Math.max(X1, X2)) + ". Chaque valeur donne une équation du 2e degré en x. " + M(setT(all)) + ".",
          { ctx: "x2-plus-bx", guide: [G("On pose " + M("X = x^2" + tm(b, "x")) + ". Plus petite solution en " + M("X") + " ?", Math.min(X1, X2), M(Math.min(X1, X2)) + "."), G("Plus grande ?", Math.max(X1, X2), M(Math.max(X1, X2)) + "."), GSet("Résous " + M("x^2" + tm(b, "x") + " = X") + " pour chaque valeur. Ensemble des solutions ?", all, M(setT(all)) + ".")],
            traps: [TS([X1, X2], "Ce sont les valeurs de X ; résous ensuite x² + " + b + "x = X."), TS([u1, v1], "Chaque valeur de X donne des solutions : il y en a quatre.")] }); },
      () => { const n = pk([2, 3]), k = R.int(2, 4), A = n * n, B = n * n * k * k + 1, sol = [1 / n, -1 / n, k, -k];
        return QS("Résous " + M(A + "x^4 - " + B + "x^2 + " + k * k + " = 0") + ". (fractions acceptées)", sol, "Avec " + M("X = x^2") + " : " + M("\\Delta = " + (B * B - 4 * A * k * k)) + ", " + M("X = \\frac{1}{" + A + "}") + " ou " + M("X = " + k * k) + ". " + M(setT(sol)) + ".",
          { ctx: "coef-dominant", guide: [G("On pose " + M("X = x^2") + ". Discriminant ?", B * B - 4 * A * k * k, M(B + "^2 - 4 \\cdot " + A + " \\cdot " + k * k + " = " + (B * B - 4 * A * k * k)) + "."), G("Plus petite solution en " + M("X") + " (fraction) ?", 1 / A, M("\\frac{1}{" + A + "}") + "."), G("Plus grande ?", k * k, M(k * k) + "."), GSet("Ensemble des solutions en " + M("x") + " ?", sol, M(setT(sol)) + ".")],
            traps: [TS([1 / A, k * k], "Ce sont les valeurs de X = x² : prends les racines."), TS([1 / n, k], "Chaque valeur positive de x² donne deux solutions (±).")] }); },
      () => { const m = pk([2, 3, 5, 6, 7, 10, 11]), n = R.int(1, 6), B = m - n; if (!B || m === n) return null; const sol = [Math.sqrt(m), -Math.sqrt(m)];
        return QS("Résous " + M("x^4" + tm(-B, "x^{2}") + tm(-m * n, "") + " = 0") + ". (écris les racines avec √)", sol, "Avec " + M("X = x^2") + " : " + M("X = " + m) + " ou " + M("X = -" + n) + " (impossible). " + M("x^2 = " + m) + " : " + M("S = \\{-\\sqrt{" + m + "} \\,;\\, \\sqrt{" + m + "}\\}") + ".",
          { ctx: "racines", guide: [G("On pose " + M("X = x^2") + ". Solution positive en " + M("X") + " ?", m, M(m) + "."), G("L'autre ?", -n, M(-n) + " : impossible pour un carré."), GSet("Ensemble des solutions ?", sol, M("\\pm\\sqrt{" + m + "}") + ".")],
            traps: [TS([m], "x² = " + m + " donne x = √" + m + " ou x = −√" + m + "."), TS([Math.sqrt(m)], "N'oublie pas la solution négative.")] }); },
    ],
  };

  // ===================================== A3. eqirrmp : équations irrationnelles =====================================
  const IRR = {
    1: [
      () => { const a = nz(-9, 9), c = R.int(2, 8), x = c * c - a;
        return QS("Résous " + M("\\sqrt{x" + sg(a) + "} = " + c) + ".", [x], "On élève au carré : " + M("x" + sg(a) + " = " + c * c) + ", " + M("x = " + x) + ". Vérification : " + M("\\sqrt{" + c * c + "} = " + c) + ".",
          { ctx: "simple", guide: [G("On élève au carré : " + M("x" + sg(a)) + " = ?", c * c, M(c + "^2 = " + c * c) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([c - a], "Élève aussi le membre de droite au carré : x " + (a < 0 ? "− " + -a : "+ " + a) + " = " + c * c + "."), TS([c * c + a], "On retire " + a + " des deux côtés.")] }); },
      () => { const k = pk([2, 3, 4, 5]), x0 = nz(-5, 9), c = R.int(2, 7), a = c * c - k * x0; if (!a) return null; const A = lin(k, a);
        return QS("Résous " + M("\\sqrt{" + A + "} = " + c) + ".", [x0], "Au carré : " + M(A + " = " + c * c) + ", " + M(k + "x = " + (c * c - a)) + ", " + M("x = " + x0) + ".",
          { ctx: "coef", guide: [G("Au carré : " + M(A) + " = ?", c * c, M(c * c) + "."), G("Que vaut " + M(k + "x") + " ?", c * c - a, M(c * c + sg(-a) + " = " + (c * c - a)) + "."), GSet("Ensemble des solutions ?", [x0], M(setT([x0])) + ".")],
            traps: [TS([(c - a) / k], "Élève le membre de droite au carré : " + c + "² = " + c * c + "."), TS([(c * c + a) / k], "On retire " + a + " (opération inverse).")] }); },
      () => { const x0 = nz(-5, 8), A = R.int(2, 5), C = R.int(1, 4), v = R.int(1, 30); if (A === C) return null; const B = v - A * x0, Dd = v - C * x0; if (!B || !Dd) return null;
        return QS("Résous " + M("\\sqrt{" + lin(A, B) + "} = \\sqrt{" + lin(C, Dd) + "}") + ".", [x0], "Au carré : " + M(lin(A, B) + " = " + lin(C, Dd)) + ", " + M((A - C) + "x = " + (Dd - B)) + ", " + M("x = " + x0) + ". Vérification : les deux racines valent " + M("\\sqrt{" + v + "}") + ".",
          { ctx: "deux-racines", guide: [G("Au carré : " + M(lin(A, B) + " = " + lin(C, Dd)) + ". Coefficient de x après regroupement à gauche ?", A - C, M(A + " - " + C + " = " + (A - C)) + "."), G("Et le terme constant à droite ?", Dd - B, M(Dd + sg(-B) + " = " + (Dd - B)) + "."), GSet("Vérifie que les radicandes sont positifs. Ensemble des solutions ?", [x0], "Pour " + M("x = " + x0) + ", les deux radicandes valent " + M(v) + " : " + M(setT([x0])) + ".")],
            traps: [TS([(Dd + B) / (A - C)], "En passant " + B + " de l'autre côté, son signe change."), TS([(B - Dd) / (A - C)], "Attention au signe : (A − C)x = D − B.")] }); },
    ],
    2: [
      () => { const b = R.int(-4, 4), lo = Math.max(-b, 2 - b), r1 = R.int(lo, lo + 5), r2 = 1 - 2 * b - r1, a = b * b - r1 * r2; if (!a || r1 === r2) return null; const Q = polyT([1, 2 * b - 1, b * b - a]);
        return QS("Résous " + M("\\sqrt{x" + sg(a) + "} = " + lin(1, b)) + ".", [r1], "Condition " + M(lin(1, b) + " \\ge 0") + ". Au carré : " + M(Q + " = 0") + ", " + M("x = " + r1) + " ou " + M("x = " + r2) + ". " + M("x = " + r2) + " donne " + M(lin(1, b) + " = " + (r2 + b) + " < 0") + " : solution parasite. " + M(setT([r1])) + ".",
          { ctx: "parasite", guide: [G("Condition : " + M(lin(1, b) + " \\ge 0") + ", donc " + M("x") + " doit être au moins ?", -b, M("x \\ge " + -b) + "."), G("Au carré : " + M(Q + " = 0") + ". Plus grande solution ?", r1, M(r1) + "."), G("Plus petite ?", r2, M(r2) + "."), GSet("Garde celles qui vérifient la condition. Ensemble des solutions ?", [r1], M(setT([r1])) + " (" + M(r2) + " est parasite).")],
            traps: [TS([r1, r2], "Vérifie : x = " + r2 + " rend le membre de droite négatif (solution parasite)."), TS([r2], "C'est la solution parasite : vérifie dans l'équation de départ.")] }); },
      () => { const a = nz(-9, 9), c = R.int(3, 9), d = R.int(0, c - 1), v = d - c;
        return QS("Résous " + M("\\sqrt{x" + sg(a) + "} + " + c + " = " + d) + ".", [], "On isole : " + M("\\sqrt{x" + sg(a) + "} = " + v) + ". Une racine carrée n'est jamais négative : " + M("S = \\varnothing") + ".",
          { ctx: "negatif", guide: [G("Isole la racine : " + M("\\sqrt{x" + sg(a) + "}") + " = ?", v, M(d + " - " + c + " = " + v) + "."), GSet("Ensemble des solutions ? (écris « aucune » s'il n'y en a pas)", [], "Une racine carrée est toujours positive ou nulle : " + M("S = \\varnothing") + ".")],
            traps: [TS([v * v - a], "En élevant au carré, on ajoute une solution parasite : une racine ne vaut jamais " + v + ".")] }); },
      () => { const c = R.int(2, 8), r1 = R.int(c - 6, c), r2 = 2 * c + 1 - r1, a = c * c - r1 * r2; if (!a) return null; const Q = polyT([1, -(2 * c + 1), c * c - a]);
        return QS("Résous " + M("x + \\sqrt{x" + sg(a) + "} = " + c) + ".", [r1], "On isole : " + M("\\sqrt{x" + sg(a) + "} = " + c + " - x") + " (il faut " + M("x \\le " + c) + "). Au carré : " + M(Q + " = 0") + ", " + M("x = " + r1) + " ou " + M("x = " + r2) + " (parasite). " + M(setT([r1])) + ".",
          { ctx: "isoler", guide: [G("On isole la racine : " + M("\\sqrt{x" + sg(a) + "} = " + c + " - x") + ". Condition : " + M("x") + " au plus ?", c, M("x \\le " + c) + "."), G("Au carré : " + M(Q + " = 0") + ". Plus petite solution ?", r1, M(r1) + "."), G("Plus grande ?", r2, M(r2) + "."), GSet("Ensemble des solutions ?", [r1], M(setT([r1])) + ".")],
            traps: [TS([r1, r2], "Vérifie : x = " + r2 + " donne " + c + " − x < 0 (solution parasite)."), TS([r2], "C'est la solution parasite.")] }); },
    ],
    3: [
      () => { const s = R.int(1, 4), c = R.int(2 * s + 1, 2 * s + 5), a = c * c - 2 * c * s;
        return QS("Résous " + M("\\sqrt{x + " + a + "} + \\sqrt{x} = " + c) + ".", [s * s], "On isole : " + M("\\sqrt{x + " + a + "} = " + c + " - \\sqrt{x}") + ". Au carré : " + M("x + " + a + " = " + c * c + " - " + 2 * c + "\\sqrt{x} + x") + ", donc " + M(2 * c + "\\sqrt{x} = " + (c * c - a)) + ", " + M("\\sqrt{x} = " + s) + ", " + M("x = " + s * s) + ".",
          { ctx: "somme-racines", guide: [G("On isole " + M("\\sqrt{x + " + a + "}") + " et on élève au carré ; les x s'éliminent. Que vaut " + M(2 * c + "\\sqrt{x}") + " ?", c * c - a, M(c * c + " - " + a + " = " + (c * c - a)) + "."), G(M("\\sqrt{x}") + " = ?", s, M(s) + "."), GSet("Ensemble des solutions ? (vérifie)", [s * s], M("\\sqrt{" + (s * s + a) + "} + \\sqrt{" + s * s + "} = " + (c - s) + " + " + s + " = " + c) + " : " + M(setT([s * s])) + ".")],
            traps: [TS([s], "C'est √x ; x = " + s + "² = " + s * s + "."), TS([c * c - a], "Divise encore par " + 2 * c + ", puis élève au carré.")] }); },
      () => { const A = pk([2, 3, 4]), b = R.int(-3, 3), r1 = R.int(-4, 6), r2 = A - 2 * b - r1, B = b * b - r1 * r2; if (!B || r1 === r2) return null; const ok = [r1, r2].filter((r) => r + b >= 0); if (!ok.length) return null; const bad = [r1, r2].filter((r) => r + b < 0), Q = polyT([1, 2 * b - A, b * b - B]);
        return QS("Résous " + M("\\sqrt{" + lin(A, B) + "} = " + lin(1, b)) + ".", ok, "Au carré : " + M(Q + " = 0") + ", " + M("x = " + Math.min(r1, r2)) + " ou " + M("x = " + Math.max(r1, r2)) + ". On garde " + M(lin(1, b) + " \\ge 0") + " : " + M(setT(ok)) + (bad.length ? " (" + M(bad[0]) + " est parasite)." : "."),
          { ctx: "general", guide: [G("Au carré : " + M(Q + " = 0") + ". Plus petite solution ?", Math.min(r1, r2), M(Math.min(r1, r2)) + "."), G("Plus grande ?", Math.max(r1, r2), M(Math.max(r1, r2)) + "."), GSet("Garde celles pour lesquelles " + M(lin(1, b) + " \\ge 0") + ". Ensemble des solutions ?", ok, M(setT(ok)) + ".")],
            traps: [TS([r1, r2], "Vérifie : le membre de droite doit être positif ou nul."), TS(bad.length ? bad : [Math.max(r1, r2)], bad.length ? "C'est la solution parasite." : "Les deux vérifient la condition : garde-les toutes les deux.")] }); },
      () => { if (R.rand() < 0.5) { const v = pk([10, 12, 14, 15, 16, 18, 20, 24, 30]), h = r6(v * v / 20);
          return QN("La vitesse (en m/s) d'un objet lâché d'une hauteur " + M("h") + " (en m) est " + M("v = \\sqrt{20h}") + ". De quelle hauteur faut-il le lâcher pour qu'il atteigne " + M(v) + " m/s ?", h, M(v + " = \\sqrt{20h}") + " ; au carré : " + M(v * v + " = 20h") + ", " + M("h = " + N(h)) + " m.",
            { ctx: "chute", guide: [G("Au carré : " + M("v^2 = 20h") + ". Que vaut " + M("v^2") + " ?", v * v, M(v * v) + "."), G(M("h") + " (en m) ?", h, M(v * v + " \\div 20 = " + N(h)) + " m.")], traps: [TR(v / 20, "Élève d'abord au carré."), TR(v * v * 20, "On divise par 20."), TR(Math.sqrt(20 * v), "On cherche h : on isole h dans v = √(20h).")] }); }
        const Tp = pk([1, 3, 5, 2.4, 2.8, 3.6, 4.4]), L = r6((Tp / 2) ** 2);
        return QN("La période (en s) d'un pendule de longueur " + M("L") + " (en m) vaut environ " + M("T = 2\\sqrt{L}") + ". Quelle longueur donne une période de " + M(N(Tp)) + " s ?", L, M("\\sqrt{L} = " + N(Tp) + " \\div 2 = " + N(Tp / 2)) + ", " + M("L = " + N(Tp / 2) + "^2 = " + N(L)) + " m.",
          { ctx: "pendule", guide: [G("On divise par 2 : " + M("\\sqrt{L}") + " = ?", Tp / 2, M(N(Tp / 2)) + "."), G("Au carré : " + M("L") + " (en m) ?", L, M(N(L)) + " m.")], traps: [TR(Tp / 2, "C'est √L : élève au carré."), TR(Tp * Tp / 2, "Divise par 2 avant d'élever au carré (ou divise T² par 4)."), TR(Tp * Tp, "N'oublie pas le facteur 2.")] }); },
    ],
  };

  // ===================================== A4. eqratmp : équations rationnelles =====================================
  const RAT = {
    1: [
      () => { const c = pk([2, 3, 4, 5, -2, -3]), q = nz(-5, 5), a = c * q, b = nz(-6, 6), x = b + q;
        return QS("Résous " + M("\\frac{" + a + "}{" + lin(1, -b) + "} = " + c) + ".", [x], "Valeur interdite " + M(b) + ". En multipliant : " + M(lin(1, -b) + " = " + a + " \\div " + pT(c) + " = " + q) + ", " + M("x = " + x) + ".",
          { ctx: "simple", guide: [G("Valeur interdite (le dénominateur s'annule) : " + M("x") + " ≠ ?", b, M(b) + "."), G("On multiplie par " + M(lin(1, -b)) + " et on divise par " + M(c) + " : " + M(lin(1, -b)) + " = ?", q, M(a + " \\div " + pT(c) + " = " + q) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([q - b], "x − " + (b < 0 ? "(" + b + ")" : b) + " = " + q + " donne x = " + q + " + " + (b < 0 ? "(" + b + ")" : b) + "."), TS([a * c + b], "On divise par " + c + " (on ne multiplie pas).")] }); },
      () => { const A = nz(-4, 5), B = nz(-6, 6), C = pk([1, 2, 3]), Dd = nz(-6, 6), k = pk([2, 3, 4, -2, -3]); if (A - k * C === 0 || A * Dd === B * C) return null; const x = r6((k * Dd - B) / (A - k * C)), f = r6(-Dd / C); if (den(x) > 6 || x === f) return null;
        return QS("Résous " + M("\\frac{" + lin(A, B) + "}{" + lin(C, Dd) + "} = " + k) + ". (fractions acceptées)", [x], "Valeur interdite " + M(fT(f)) + ". " + M(lin(A, B) + " = " + k + "(" + lin(C, Dd) + ")") + ", " + M(fT(A - k * C) + "x = " + fT(k * Dd - B)) + ", " + M("x = " + fT(x)) + ".",
          { ctx: "lineaire", guide: [G("Valeur interdite (fraction acceptée) ?", f, M(lin(C, Dd) + " = 0") + " pour " + M("x = " + fT(f)) + "."), G("On multiplie : " + M(lin(A, B) + " = " + k + "(" + lin(C, Dd) + ")") + ". Coefficient de x quand tout est à gauche ?", A - k * C, M(A + " - " + pT(k * C) + " = " + (A - k * C)) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([(Dd - B) / (A - k * C)], k + " multiplie tout le dénominateur : " + k + "(" + C + "x + " + Dd + ") = " + k * C + "x + " + k * Dd + "."), TS([f], "C'est la valeur interdite !")] }); },
      () => { const r = nz(-6, 6), s = nz(-6, 6), a = nz(-9, 9); if (r === s || a === -r || a === -s) return null; const p = -(r + s), q = r * s;
        return QS("Pour quelles valeurs de " + M("x") + " la fraction " + M("\\frac{" + lin(1, a) + "}{" + polyT([1, p, q]) + "}") + " n'est-elle pas définie (valeurs interdites) ?", [r, s], "Le dénominateur s'annule : " + M(polyT([1, p, q]) + " = (x" + sg(-r) + ")(x" + sg(-s) + ")") + ", donc " + M("x = " + Math.min(r, s)) + " ou " + M("x = " + Math.max(r, s)) + ".",
          { ctx: "interdites", guide: [G("Discriminant du dénominateur ?", p * p - 4 * q, M(pT(p) + "^2 - 4 \\cdot " + pT(q) + " = " + (p * p - 4 * q)) + "."), GSet("Valeurs interdites (zéros du dénominateur) ?", [r, s], M("x = " + Math.min(r, s)) + " et " + M("x = " + Math.max(r, s)) + ".")],
            traps: [TS([-r, -s], "(x − r)(x − s) = 0 donne x = r ou x = s : attention aux signes."), TS([-a], "Les valeurs interdites annulent le dénominateur, pas le numérateur.")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), c = nz(-6, 6), b = nz(-5, 5), d = nz(-5, 5); if (a + c === 0 || b === d) return null; const x = r6(-(a * d + c * b) / (a + c)); if (den(x) > 6 || x === -b || x === -d) return null;
        const F = (n, k) => "\\frac{" + Math.abs(n) + "}{" + lin(1, k) + "}";
        return QS("Résous " + M((a < 0 ? "-" : "") + F(a, b) + (c < 0 ? " - " : " + ") + F(c, d) + " = 0") + ". (fractions acceptées)", [x], "On multiplie par " + M("(" + lin(1, b) + ")(" + lin(1, d) + ")") + " : " + M(a + "(" + lin(1, d) + ")" + sg(c) + "(" + lin(1, b) + ") = 0") + ", " + M((a + c) + "x" + sg(a * d + c * b) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "somme-nulle", guide: [G("On multiplie par les deux dénominateurs : " + M(a + "(" + lin(1, d) + ")" + sg(c) + "(" + lin(1, b) + ") = 0") + ". Coefficient de x ?", a + c, M(a + sg(c) + " = " + (a + c)) + "."), G("Terme constant ?", a * d + c * b, M(a + " \\cdot " + pT(d) + sg(c) + " \\cdot " + pT(b) + " = " + (a * d + c * b)) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + " (ce n'est pas une valeur interdite).")],
            traps: [TS([(a * d + c * b) / (a + c)], "Attention au signe en isolant x."), TS([-b, -d], "Ce sont les valeurs interdites !")] }); },
      () => { const r = nz(-5, 5), s = nz(-5, 5), k = pk([1, 2, 3, -1, -2]), x2 = s + k; if (x2 === r || r === s) return null; const N2 = polyT([1, -(r + s), r * s]);
        return QS("Résous " + M("\\frac{" + N2 + "}{" + lin(1, -r) + "} = " + k) + ".", [x2], "Valeur interdite " + M(r) + ". " + M(N2 + " = " + k + "(" + lin(1, -r) + ")") + " donne " + M("x = " + r) + " ou " + M("x = " + x2) + " ; " + M(r) + " est interdite. " + M(setT([x2])) + ".",
          { ctx: "rejet", guide: [G("Valeur interdite ?", r, M(r) + "."), G("On multiplie et on résout l'équation du 2e degré. Plus grande solution ?", Math.max(r, x2), M(Math.max(r, x2)) + "."), G("Plus petite ?", Math.min(r, x2), M(Math.min(r, x2)) + "."), GSet("Ensemble des solutions (sans la valeur interdite) ?", [x2], M(setT([x2])) + ".")],
            traps: [TS([r, x2], r + " est une valeur interdite : on la rejette."), TS([r], "C'est la valeur interdite !")] }); },
      () => { const A = nz(-6, 6), B = nz(-6, 6), p = nz(-5, 5), q = nz(-5, 5); if (A === B || p === q) return null; const x = r6((A * q - B * p) / (A - B)); if (den(x) > 6 || x === p || x === q) return null;
        return QS("Résous " + M("\\frac{" + A + "}{" + lin(1, -p) + "} = \\frac{" + B + "}{" + lin(1, -q) + "}") + ". (fractions acceptées)", [x], "Produit en croix : " + M(A + "(" + lin(1, -q) + ") = " + B + "(" + lin(1, -p) + ")") + ", " + M(fT(A - B) + "x = " + fT(A * q - B * p)) + ", " + M("x = " + fT(x)) + ".",
          { ctx: "produit-croix", guide: [G("Produit en croix : " + M(A + "(" + lin(1, -q) + ") = " + B + "(" + lin(1, -p) + ")") + ". Coefficient de x (à gauche, après regroupement) ?", A - B, M(A + " - " + pT(B) + " = " + (A - B)) + "."), G("Terme constant (à droite) ?", A * q - B * p, M(A * q + " - " + pT(B * p) + " = " + (A * q - B * p)) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([(A * p - B * q) / (A - B)], "Produit en croix : " + A + " multiplie le dénominateur de l'autre fraction (x − " + q + ")."), TS([p, q], "Ce sont les valeurs interdites.")] }); },
    ],
    3: [
      () => { const p = nz(-5, 5), q = nz(-5, 5), s = R.int(-6, 6); if (p === q || s === p || s === q) return null; const m = q - p - s, Rr = -m * p - p * s; if (!m || !Rr) return null;
        const Fm = (m < 0 ? " - " : " + ") + "\\frac{" + Math.abs(m) + "}{" + lin(1, -q) + "}";
        return QS("Résous " + M("\\frac{x}{" + lin(1, -p) + "}" + Fm + " = \\frac{" + Rr + "}{" + polyT([1, -(p + q), p * q]) + "}") + ".", [s], "Le dénominateur de droite vaut " + M("(" + lin(1, -p) + ")(" + lin(1, -q) + ")") + " : valeurs interdites " + M(p) + " et " + M(q) + ". En multipliant : " + M(polyT([1, m - q, -m * p - Rr]) + " = 0") + ", " + M("x = " + p) + " (interdite) ou " + M("x = " + s) + ". " + M(setT([s])) + ".",
          { ctx: "valeur-interdite", guide: [G("Le dénominateur de droite se factorise en " + M("(" + lin(1, -p) + ")(" + lin(1, -q) + ")") + ". Plus grande valeur interdite ?", Math.max(p, q), M(Math.max(p, q)) + "."), G("On multiplie par ce dénominateur : " + M(polyT([1, m - q, -m * p - Rr]) + " = 0") + ". Plus grande solution ?", Math.max(p, s), M(Math.max(p, s)) + "."), G("Plus petite ?", Math.min(p, s), M(Math.min(p, s)) + "."), GSet("Ensemble des solutions ?", [s], M(setT([s])) + " (" + M(p) + " est interdite).")],
            traps: [TS([p, s], p + " est une valeur interdite : on la rejette."), TS([p], "C'est une valeur interdite !")] }); },
      () => { const v = pk([10, 12, 15, 20, 24, 30]), w = pk([2, 3, 4, 5, 6, 10]), t = pk([1, 2]), d = (t * v * (v + w)) / w; if (!Number.isInteger(d) || d > 150) return null; /* 26.11 (vraisemblance) : un cycliste ne parcourt pas 440 km d'une traite */
        return QN("Un cycliste parcourt " + M(d) + " km. S'il roulait " + M(w) + " km/h plus vite, il mettrait " + (t === 1 ? "une heure" : "deux heures") + " de moins. Quelle est sa vitesse (en km/h) ?", v, "Avec " + M("v") + " la vitesse : " + M("\\frac{" + d + "}{v} - \\frac{" + d + "}{v + " + w + "} = " + t) + ". En multipliant par " + M("v(v + " + w + ")") + " : " + M(d * w + " = " + t + "v(v + " + w + ")") + ", " + M("v = " + v) + " km/h (l'autre solution, " + M(-v - w) + ", est négative).",
          { ctx: "trajet", guide: [G("On écrit " + M("\\frac{" + d + "}{v} - \\frac{" + d + "}{v + " + w + "} = " + t) + " et on multiplie par " + M("v(v + " + w + ")") + ". Le membre de gauche devient " + M(d + " \\cdot " + w) + " = ?", d * w, M(d * w) + "."), G("Solution positive de " + M(polyT([t, t * w, -d * w], "v") + " = 0") + " ?", v, M(v) + " km/h.")],
            traps: [TR(v + w, "C'est la vitesse s'il roulait plus vite."), TR(-v - w, "Une vitesse est positive : rejette la solution négative."), TR(r6(d / t), "Il faut écrire les deux temps de parcours d ÷ v.")] }); },
      () => { const [a, b] = pk([[2, 3], [3, 6], [4, 12], [6, 12], [2, 6], [3, 4], [4, 6], [5, 20], [10, 15], [6, 3], [4, 4], [5, 4]]), t = (a * b) / (a + b);
        const c = pk([["Un robinet remplit une citerne en " + a + " h, un autre en " + b + " h.", "aux deux robinets ensemble", "robinets"], ["Une imprimante tire un lot de flyers en " + a + " h, une autre en " + b + " h.", "aux deux imprimantes ensemble", "imprimantes"], ["Un apprenti vernit un parquet en " + a + " h, un autre apprenti en " + b + " h.", "aux deux apprentis ensemble", "ouvriers"]]);
        return QN(c[0] + " Combien de temps (en h) faut-il " + c[1] + " ? (fraction ou décimal)", t, "En 1 h : " + M("\\frac{1}{" + a + "} + \\frac{1}{" + b + "} = " + fT(1 / a + 1 / b)) + " du travail. Temps : " + M("t = " + fT(t)) + " h (on résout " + M("\\frac{1}{" + a + "} + \\frac{1}{" + b + "} = \\frac{1}{t}") + ").",
          { ctx: c[2], guide: [G("Part du travail faite en 1 h par le premier (fraction) ?", 1 / a, M("\\frac{1}{" + a + "}") + "."), G("Par les deux ensemble, en 1 h ?", 1 / a + 1 / b, M(fT(1 / a + 1 / b)) + "."), G("Temps total (l'inverse) ?", t, M(fT(t)) + " h.")],
            traps: [TR(a + b, "Ensemble, ils vont plus vite que chacun seul."), TR((a + b) / 2, "Ce n'est pas la moyenne : on additionne les parts faites en 1 h."), TR(1 / a + 1 / b, "C'est la part faite en 1 h ; le temps est son inverse.")] }); },
    ],
  };

  // ===================================== B1. puisrat : puissances d'exposant rationnel =====================================
  const rootW = (q) => (q === 2 ? "carrée" : q === 3 ? "cubique" : q + "e");
  const rootT = (n, inner) => (n === 2 ? "\\sqrt{" + inner + "}" : "\\sqrt[" + n + "]{" + inner + "}");
  const xp = (m) => (m === 1 ? "x" : "x^{" + m + "}");
  const PR = {
    1: [
      () => { const r = pk([2, 3, 4, 5]), q = pk([2, 3, 4]), b = r ** q, p = pk([1, 2, 3]); if (b > 625 || p === q || (p === 1 && q === 2 && r === 2)) return null; const v = r ** p;
        const g = [G("Racine " + rootW(q) + " de " + M(b) + " ?", r, M(rootT(q, b) + " = " + r) + ".")]; if (p > 1) g.push(G("À la puissance " + M(p) + " ?", v, M(r + "^{" + p + "} = " + v) + "."));
        return QN("Calcule sans calculatrice " + M(b + "^{\\frac{" + p + "}{" + q + "}}") + ".", v, M(b + "^{\\frac{" + p + "}{" + q + "}} = \\left(" + rootT(q, b) + "\\right)^{" + p + "} = " + r + (p > 1 ? "^{" + p + "} = " + v : "")) + ".",
          { ctx: "calcul", guide: g, traps: [TR(r6(b * p / q), "L'exposant n'est pas un facteur : b^(p/q) = (racine q-ième de b)^p."), TR(r6(b ** (q / p)), "Le dénominateur de l'exposant est l'indice de la racine."), TR(r * p, "On élève à la puissance " + p + ", on ne multiplie pas par " + p + ".")] }); },
      () => { /* audit niveau 25.11 : remplace 5^(-3) (exposant entier négatif : MP 1re, S1.CN.12) par un exposant décimal (S5.PL.03) */
        const [e, p, q] = pk([["0{,}5", 1, 2], ["1{,}5", 3, 2], ["2{,}5", 5, 2], ["0{,}25", 1, 4], ["0{,}75", 3, 4], ["1{,}25", 5, 4], ["0{,}2", 1, 5], ["0{,}4", 2, 5], ["0{,}6", 3, 5]]);
        const r = pk(q === 2 ? [3, 4, 5, 6, 7, 9] : q === 4 ? [2, 3] : [2, 3]), b = r ** q, v = r ** p; if (v > 1000 || b > 300) return null; const ed = e.replace("{,}", ",");
        return QN("Calcule sans calculatrice " + M(b + "^{" + e + "}") + ".", v, "On écrit l'exposant en fraction : " + M(e + " = \\frac{" + p + "}{" + q + "}") + ", puis " + M(b + "^{\\frac{" + p + "}{" + q + "}} = \\left(" + rootT(q, b) + "\\right)^{" + p + "} = " + r + (p > 1 ? "^{" + p + "} = " + v : "")) + ".",
          { ctx: "exposant-decimal", guide: [G("Exposant " + M(e) + " en fraction : dénominateur (indice de la racine) ?", q, M(e + " = \\frac{" + p + "}{" + q + "}") + "."), G("Racine " + rootW(q) + " de " + M(b) + " ?", r, M(rootT(q, b) + " = " + r) + "."), G("Résultat ?", v, M(r + "^{" + p + "} = " + v) + ".")],
            traps: [TR(r6(b * p / q), "L'exposant " + ed + " n'est pas un facteur : b^(p/q) = (racine q-ième de b)^p."), TR(r, "Exposant " + ed + " = " + p + "/" + q + " : on élève encore la racine à la puissance " + p + "."), TR(r6(b ** (q / p)), "Le dénominateur de l'exposant est l'indice de la racine.")] }); },
      () => { const t = R.int(0, 2), n = pk([2, 3, 4, 5]), m = R.int(1, 4); if (m === n || (t === 0 && m === 1 && n === 2 && R.rand() < 0.5)) return null;
        if (t === 0) return QN("Écris " + M(rootT(n, xp(m))) + " sous la forme " + M("x^k") + " (avec " + M("x > 0") + ") : que vaut " + M("k") + " ? (fraction)", m / n, "L'indice de la racine va au dénominateur : " + M(rootT(n, xp(m)) + " = x^{\\frac{" + m + "}{" + n + "}}") + ".",
          { ctx: "racine", guide: [G("L'exposant " + M(m) + " va au numérateur, l'indice " + M(n) + " au dénominateur : " + M("k") + " = ?", m / n, M(fT(m / n)) + ".")], traps: [TR(n / m, "L'indice de la racine va au dénominateur."), TR(m * n, "C'est une fraction : exposant ÷ indice.")] });
        if (t === 1) return QN("Écris " + M("\\frac{1}{" + rootT(n, xp(m)) + "}") + " sous la forme " + M("x^k") + " : que vaut " + M("k") + " ? (fraction)", -m / n, M(rootT(n, xp(m)) + " = x^{" + fT(m / n) + "}") + " et l'inverse change le signe de l'exposant : " + M("k = " + fT(-m / n)) + ".",
          { ctx: "inverse-racine", guide: [G("Exposant de " + M(rootT(n, xp(m))) + " ?", m / n, M(fT(m / n)) + "."), G("L'inverse change le signe : " + M("k") + " = ?", -m / n, M(fT(-m / n)) + ".")], traps: [TR(m / n, "1 ÷ x^a = x^(−a) : exposant négatif."), TR(-n / m, "L'indice de la racine va au dénominateur.")] });
        const a = R.int(1, 3);
        return QN("Écris " + M(xp(a) + " \\cdot " + rootT(n, xp(m))) + " sous la forme " + M("x^k") + " : que vaut " + M("k") + " ? (fraction)", a + m / n, "Produit de puissances : on additionne les exposants, " + M(a + " + " + fT(m / n) + " = " + fT(a + m / n)) + ".",
          { ctx: "produit-racine", guide: [G("Exposant de la racine ?", m / n, M(fT(m / n)) + "."), G("On additionne : " + M("k") + " = ?", a + m / n, M(fT(a + m / n)) + ".")], traps: [TR(a * m / n, "Produit de puissances : on additionne les exposants."), TR(a + n / m, "L'indice de la racine va au dénominateur.")] }); },
    ],
    2: [
      () => { const r = pk([2, 3, 4, 5]), q = pk([2, 3]), b = r ** q, p = pk([1, 2, 3]); if (b > 125 || p === q) return null; const v = r ** p;
        return QN("Calcule " + M(b + "^{-\\frac{" + p + "}{" + q + "}}") + ". (fraction)", 1 / v, M(b + "^{-\\frac{" + p + "}{" + q + "}} = \\frac{1}{\\left(" + rootT(q, b) + "\\right)^{" + p + "}} = \\frac{1}{" + v + "}") + ".",
          { ctx: "negatif-rationnel", guide: [G("Racine " + rootW(q) + " de " + M(b) + " ?", r, M(r) + "."), G("À la puissance " + M(p) + " ?", v, M(v) + "."), G("Le signe « − » donne l'inverse : résultat ?", 1 / v, M("\\frac{1}{" + v + "}") + ".")],
            traps: [TR(-v, "Exposant négatif : c'est l'inverse, pas un nombre négatif."), TR(v, "N'oublie pas l'inverse (exposant négatif).")] }); },
      () => { const b1 = pk([2, 3, 4]), b2 = pk([2, 3, 4, 6]), a = R.int(1, 5), c = R.int(1, 5), quot = R.rand() < 0.4, k = r6(a / b1 + (quot ? -1 : 1) * c / b2); if (b1 === b2 || a % b1 === 0 || c % b2 === 0 || [0, 1, -1].includes(k) || den(k) > 12) return null; const L = (b1 * b2) / gcd(b1, b2);
        return QN("Simplifie " + M(quot ? "\\frac{x^{\\frac{" + a + "}{" + b1 + "}}}{x^{\\frac{" + c + "}{" + b2 + "}}}" : "x^{\\frac{" + a + "}{" + b1 + "}} \\cdot x^{\\frac{" + c + "}{" + b2 + "}}") + " en " + M("x^k") + " : que vaut " + M("k") + " ? (fraction)", k, (quot ? "Quotient : on soustrait" : "Produit : on additionne") + " les exposants, " + M("\\frac{" + a + "}{" + b1 + "}" + (quot ? " - " : " + ") + "\\frac{" + c + "}{" + b2 + "} = " + fT(k)) + ".",
          { ctx: quot ? "quotient" : "produit", guide: [G("Dénominateur commun des deux exposants ?", L, M(L) + "."), G((quot ? "Différence" : "Somme") + " des exposants : " + M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(r6((a * c) / (b1 * b2)), "On " + (quot ? "soustrait" : "additionne") + " les exposants, on ne les multiplie pas."), TR(r6((a + (quot ? -c : c)) / (b1 + b2)), "Pour additionner des fractions, il faut un dénominateur commun.")] }); },
      () => { const c = pk([2, 3, 5]), q = pk([2, 3]), e = R.int(1, 3); if (c ** q > 125) return null; const cq = c ** q, ex = c + (e === 1 ? "*x" : "*x^" + e);
        return QX("Simplifie " + M("\\left(" + cq + "x^{" + q * e + "}\\right)^{\\frac{1}{" + q + "}}") + " (avec " + M("x > 0") + ").", ex, "Chaque facteur est élevé à la puissance " + M("\\frac{1}{" + q + "}") + " : " + M(cq + "^{\\frac{1}{" + q + "}} = " + c) + " et " + M("x^{" + q * e + " \\cdot \\frac{1}{" + q + "}} = " + xp(e)) + ". Résultat " + M(c + xp(e)) + ".",
          { ctx: "simplifier", pos: true, guide: [G("Le nombre : " + M(cq + "^{\\frac{1}{" + q + "}}") + " = ?", c, M(c) + "."), G("Exposant de x : " + M(q * e + " \\cdot \\frac{1}{" + q + "}") + " = ?", e, M(e) + "."), GX("Résultat ?", ex, M(c + xp(e)) + ".")],
            traps: [TX(cq + (e === 1 ? "*x" : "*x^" + e), "La puissance s'applique aussi au nombre " + cq + "."), TX(c + "*x^" + q * e, "Puissance d'une puissance : on multiplie les exposants.")] }); },
    ],
    3: [
      () => { const A = pk([[2, 4], [2, 3], [3, 2], [4, 2], [3, 3], [5, 2], [2, 5]]), B = pk([[3, 3], [2, 4], [4, 2], [5, 2], [3, 2], [2, 3]]); const [r1, q1] = A, [r2, q2] = B; if (r1 === r2 || q1 === q2 && r1 ** q1 === r2 ** q2) return null;
        const p1 = pk([1, 2, 3]), p2 = pk([1, -1, 2]); if (p1 === q1 || Math.abs(p2) === q2) return null; const v1 = r1 ** p1, v2 = r2 ** p2, v = r6(v1 * v2); if ([0, 1, -1].includes(v)) return null;
        return QN("Calcule sans calculatrice " + M((r1 ** q1) + "^{\\frac{" + p1 + "}{" + q1 + "}} \\cdot " + (r2 ** q2) + "^{" + (p2 < 0 ? "-" : "") + "\\frac{" + Math.abs(p2) + "}{" + q2 + "}}") + ". (fraction acceptée)", v, "Premier facteur " + M(fT(v1)) + ", second " + M(fT(v2)) + " : produit " + M(fT(v)) + ".",
          { ctx: "deux-bases", guide: [G("Premier facteur ?", v1, M(fT(v1)) + "."), G("Second facteur ?", v2, M(fT(v2)) + (p2 < 0 ? " (exposant négatif : inverse)." : ".")), G("Produit ?", v, M(fT(v)) + ".")],
            traps: [TR(r6(v1 + v2), "C'est un produit, pas une somme."), TR(r6(v1 * r2 ** Math.abs(p2)), "Exposant négatif : c'est l'inverse.")] }); },
      () => { const r = pk([2, 3, 4, 5]), p = pk([1, 2, 3]), q = pk([2, 3, 4]); if (p === q || r ** q > 1000 || (p === 1 && q === 2)) return null; const x = r ** q, c = r ** p;
        const g = p > 1 ? [G("On élève à la puissance " + M("\\frac{" + q + "}{" + p + "}") + ". D'abord la racine " + rootW(p) + " de " + M(c) + " ?", r, M(r) + ".")] : [G("On élève à la puissance " + M(q) + ". Que vaut " + M(c) + " exposant " + M(q) + " ?", x, M(x) + ".")];
        g.push(GSet("Ensemble des solutions ?", [x], M(setT([x])) + "."));
        return QS("Résous " + M("x^{\\frac{" + p + "}{" + q + "}} = " + c) + " (avec " + M("x > 0") + ").", [x], "On élève à la puissance " + M(fT(q / p)) + " : " + M("x = " + c + "^{" + fT(q / p) + "} = " + x) + ".",
          { ctx: "equation", guide: g, traps: [TS([r6(c ** (p / q))], "On élève à la puissance inverse q/p, pas p/q."), TS([r6(c * q / p)], "L'exposant n'est pas un facteur : on élève à la puissance " + q + "/" + p + ".")] }); },
      () => { const n1 = pk([2, 3, 4]), n2 = pk([2, 3, 4]), m1 = R.int(1, 3), m2 = R.int(1, 3), a = pk([1, 2]); if (n1 === n2 || m1 === n1 || m2 === n2) return null; const s = r6(m1 / n1 + m2 / n2), k = r6(s - a); if ([0, 1, -1].includes(k)) return null;
        return QN("Écris " + M("\\frac{" + rootT(n1, xp(m1)) + " \\cdot " + rootT(n2, xp(m2)) + "}{" + xp(a) + "}") + " sous la forme " + M("x^k") + " : que vaut " + M("k") + " ? (fraction)", k, "Numérateur : " + M(fT(m1 / n1) + " + " + fT(m2 / n2) + " = " + fT(s)) + " ; on soustrait " + M(a) + " : " + M("k = " + fT(k)) + ".",
          { ctx: "quotient-racines", guide: [G("Exposant du numérateur (somme des deux) ?", s, M(fT(s)) + "."), G("On divise par " + M(xp(a)) + " : " + M("k") + " = ?", k, M(fT(s) + " - " + a + " = " + fT(k)) + ".")],
            traps: [TR(s, "On divise encore par x^" + a + " : on soustrait " + a + "."), TR(r6((m1 / n1) * (m2 / n2) - a), "Produit de puissances : on additionne les exposants.")] }); },
    ],
  };

  // ===================================== B2. logdef : définition du logarithme =====================================
  const LD = {
    1: [
      () => { const b = pk([2, 3, 4, 5]), n = R.int(2, b === 2 ? 9 : b === 3 ? 6 : 4), v = b ** n;
        return QN("Calcule sans calculatrice " + M(lg(b, N(v))) + ".", n, M(lg(b, N(v)) + " = " + n) + " car " + M(b + "^{" + n + "} = " + N(v)) + ".",
          { ctx: "puissance", guide: [G("Écris " + M(N(v) + " = " + b + " \\cdot " + N(v / b)) + ". Et " + M(N(v / b)) + " = " + M(b + "^{?}") + " : exposant ?", n - 1, M(N(v / b) + " = " + b + "^{" + (n - 1) + "}") + "."), G("Donc " + M(N(v) + " = " + b + "^{?}") + " : " + M(lg(b, N(v))) + " = ?", n, M(n) + ".")],
            traps: [TR(v / b, "Le logarithme est un exposant : on cherche ? tel que " + b + "^? = " + v + "."), TR(v / 2, "Le logarithme est un exposant, pas une division."), TR(n + 1, "Compte bien : " + b + "^" + n + " = " + v + ".")] }); },
      () => { const b = pk([2, 3, 5]), n = pk([2, 3, 4, -1, -2]); if (b === 5 && n > 3) return null; const x = r6(b ** n);
        return QS("Résous " + M(lg(b, "x") + " = " + n) + ". (fraction acceptée)", [x], "Par définition, " + M(lg(b, "x") + " = " + n + " \\iff x = " + b + "^{" + n + "} = " + fT(x)) + ".",
          { ctx: "trouver-x", guide: [G("Par définition, " + M("x = " + b + "^{" + n + "}") + ". Que vaut " + M(b + "^{" + n + "}") + " ?", x, M(fT(x)) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([b * n], "x = " + b + "^" + n + ", pas " + b + " · " + n + "."), TS([r6(n ** b)], "La base est " + b + " : x = " + b + "^" + n + ".")] }); },
      () => { const n = pk([-4, -3, -2, 2, 3, 4, 5]), v = r6(10 ** n);
        return QN("Calcule sans calculatrice " + M("\\log " + N(v)) + ".", n, M(N(v) + " = 10^{" + n + "}") + ", donc " + M("\\log " + N(v) + " = " + n) + ".",
          { ctx: "base10", guide: [G("Écris " + M(N(v)) + " comme puissance de 10 : exposant ?", n, M("10^{" + n + "}") + "."), G(M("\\log " + N(v)) + " = ?", n, M(n) + ".")],
            traps: [TR(-n, n < 0 ? "Un nombre plus petit que 1 a un logarithme négatif." : "Un nombre plus grand que 1 a un logarithme positif."), TR(n < 0 ? -n - 1 : n + 1, "Compte bien les rangs : " + T(v) + " = 10^(" + n + ").")] }); },
    ],
    2: [
      () => { const b = pk([2, 3, 5]), n = pk([2, 3, 4]); if (b === 5 && n > 3) return null; const v = b ** n;
        return QN("Calcule sans calculatrice " + M(lg(b, "\\frac{1}{" + v + "}")) + ".", -n, M("\\frac{1}{" + v + "} = " + b + "^{-" + n + "}") + ", donc le logarithme vaut " + M(-n) + ".",
          { ctx: "inverse", guide: [G(M(v) + " = " + M(b + "^{?}") + " : exposant ?", n, M(n) + "."), G(M("\\frac{1}{" + v + "} = " + b + "^{?}") + " : le logarithme vaut ?", -n, M(-n) + ".")],
            traps: [TR(n, "1/" + v + " = " + b + "^(−" + n + ") : l'exposant est négatif."), TR(1 / n, "L'inverse d'un nombre change le signe de l'exposant, il n'inverse pas l'exposant.")] }); },
      () => { const c = pk([2, 3]), k = pk([2, 3]), m = R.int(1, 5); if (m % k === 0 || c ** k > 27 || c ** m > 243) return null; const B = c ** k, A = c ** m;
        return QN("Calcule sans calculatrice " + M(lg(B, A)) + ". (fraction)", m / k, M(B + " = " + c + "^{" + k + "}") + " et " + M(A + " = " + c + "^{" + m + "}") + " : " + M("(" + c + "^{" + k + "})^{x} = " + c + "^{" + m + "}") + ", " + M("x = " + fT(m / k)) + ".",
          { ctx: "fraction", guide: [G("Écris " + M(B) + " comme puissance de " + M(c) + " : exposant ?", k, M(k) + "."), G("Écris " + M(A) + " comme puissance de " + M(c) + " : exposant ?", m, M(m) + "."), G("Le logarithme vaut ?", m / k, M(fT(m / k)) + ".")],
            traps: [TR(k / m, "C'est l'inverse : (" + c + "^" + k + ")^x = " + c + "^" + m + " donne " + k + "x = " + m + "."), TR(r6(A / B), "Le logarithme est un exposant, pas un quotient.")] }); },
      () => { const x = R.int(2, 6), n = pk([2, 3]), Nn = x ** n; if (Nn > 216) return null;
        return QS("Résous " + M("\\log_{x} " + Nn + " = " + n) + ".", [x], "Par définition " + M("x^{" + n + "} = " + Nn) + " ; la base d'un logarithme est positive : " + M("x = " + x) + ".",
          { ctx: "base-inconnue", guide: [G("Par définition " + M("x^{" + n + "} = " + Nn) + ". Racine " + (n === 2 ? "carrée" : "cubique") + " de " + M(Nn) + " ?", x, M(x) + "."), GSet("Ensemble des solutions (la base est positive) ?", [x], M(setT([x])) + ".")],
            traps: [TS([Nn / n], "x^" + n + " = " + Nn + " : on prend la racine, on ne divise pas."), TS([x, -x], "Une base de logarithme est positive : −" + x + " est exclu.")] }); },
    ],
    3: [
      () => { const b = pk([2, 3, 5, 7]), Nn = pk([10, 20, 50, 12, 30, 100, 6]); if (Math.abs(Math.log(Nn) / Math.log(b) - Math.round(Math.log(Nn) / Math.log(b))) < 1e-9) return null; const v = l10(Nn) / l10(b);
        return QN("À la calculatrice, calcule " + M(lg(b, Nn)) + " (au millième).", v, "Changement de base : " + M(lg(b, Nn) + " = \\frac{\\log " + Nn + "}{\\log " + b + "} \\approx " + D(v, 0.001)) + ".",
          { ctx: "calculatrice", round: 0.001, guide: [G("Changement de base : " + M("\\log_{b} N = \\frac{\\log N}{\\log b}") + ". Que vaut " + M("\\log " + Nn) + " (au millième) ?", l10(Nn), M(D(l10(Nn), 0.001)) + ".", 0.001), G("Résultat (au millième) ?", v, M(D(l10(Nn), 0.001) + " \\div " + D(l10(b), 0.001) + " \\approx " + D(v, 0.001)) + ".", 0.001)],
            traps: [TR(l10(Nn) - l10(b), "C'est un quotient (log N ÷ log b), pas une différence."), TR(l10(b) / l10(Nn), "C'est log N ÷ log b, pas l'inverse."), TR(l10(Nn / b), "log_b N n'est pas log(N ÷ b).")] }); },
      () => { const b = pk([2, 3, 5, 1.5, 1.2]), c = pk([5, 7, 10, 20, 40, 100, 3]); if (Math.abs(Math.log(c) / Math.log(b) - Math.round(Math.log(c) / Math.log(b))) < 1e-9) return null; const x = l10(c) / l10(b);
        return QN("Résous " + M(N(b) + "^{x} = " + c) + " (au millième).", x, M("x = " + lg(N(b), c) + " = \\frac{\\log " + c + "}{\\log " + N(b) + "} \\approx " + D(x, 0.001)) + ".",
          { ctx: "exposant-inconnu", round: 0.001, guide: [G("On prend le logarithme : " + M("x \\cdot \\log " + N(b) + " = \\log " + c) + ". Que vaut " + M("\\log " + c) + " (au millième) ?", l10(c), M(D(l10(c), 0.001)) + ".", 0.001), G(M("x") + " (au millième) ?", x, M("x \\approx " + D(x, 0.001)) + ".", 0.001)],
            traps: [TR(c / b, "x est un exposant : on utilise le logarithme, on ne divise pas."), TR(l10(c) - l10(b), "x = log " + c + " ÷ log " + T(b) + ".")] }); },
      () => { if (R.rand() < 0.5) { const a = pk([2, 3, 4, 5, 6, 8]), n = R.int(2, 9), ph = n - l10(a);
          return QN("Le pH d'une solution vaut " + M("\\text{pH} = -\\log [H^+]") + ". Calcule le pH si " + M("[H^+] = " + a + " \\cdot 10^{-" + n + "}") + " mol/L (au centième).", ph, M("\\text{pH} = -(\\log " + a + " - " + n + ") = " + n + " - \\log " + a + " \\approx " + D(ph, 0.01)) + ".",
            { ctx: "ph", round: 0.01, guide: [G(M("\\log " + a) + " (au centième) ?", l10(a), M(D(l10(a), 0.01)) + ".", 0.01), G(M("\\log(" + a + " \\cdot 10^{-" + n + "}) = \\log " + a + " - " + n) + ", puis on change le signe : pH (au centième) ?", ph, M(D(ph, 0.01)) + ".", 0.01)],
              traps: [TR(n, "Le facteur " + a + " compte aussi : log(" + a + " · 10^(−" + n + ")) = log " + a + " − " + n + "."), TR(n + l10(a), "log(a · 10^(−n)) = log a − n ; le pH est l'opposé : n − log a."), TR(-ph, "pH = −log[H⁺] : il est positif.")] }); }
        const a = pk([2, 3, 4, 5, 6, 8]), n = R.int(2, 8), L = 10 * (n + l10(a));
        return QN("Le niveau sonore vaut " + M("L = 10 \\cdot \\log\\left(\\frac{I}{I_0}\\right)") + " (en dB). Calcule " + M("L") + " pour un son " + M(a + " \\cdot 10^{" + n + "}") + " fois plus intense que " + M("I_0") + " (au dixième).", L, M("L = 10 \\cdot (\\log " + a + " + " + n + ") \\approx " + D(L, 0.1)) + " dB.",
          { ctx: "decibels", round: 0.1, guide: [G(M("\\log(" + a + " \\cdot 10^{" + n + "}) = \\log " + a + " + " + n) + " (au centième) ?", n + l10(a), M(D(n + l10(a), 0.01)) + ".", 0.01), G(M("L") + " (au dixième) ?", L, M(D(L, 0.1)) + " dB.", 0.1)],
            traps: [TR(10 * n, "Le facteur " + a + " compte aussi : log(" + a + " · 10^" + n + ") = log " + a + " + " + n + "."), TR(n + l10(a), "N'oublie pas de multiplier par 10.")] }); },
    ],
  };

  // ===================================== B3. logprop : propriétés des logarithmes =====================================
  const L2 = 0.301, L3 = 0.477;
  const LP = {
    1: [
      () => { const [a, b] = pk([[50, 2], [25, 4], [20, 5], [125, 8], [250, 4], [40, 25], [200, 5], [500, 2], [2, 5000], [4, 2500]]), p = a * b, k = Math.round(l10(p));
        return QN("Calcule sans calculatrice " + M("\\log " + N(a) + " + \\log " + N(b)) + ".", k, M("\\log a + \\log b = \\log(a \\cdot b)") + " : " + M("\\log " + N(p) + " = " + k) + ".",
          { ctx: "somme", guide: [G("Propriété : " + M("\\log a + \\log b = \\log(a \\cdot b)") + ". Que vaut " + M(N(a) + " \\cdot " + N(b)) + " ?", p, M(N(p)) + "."), G(M("\\log " + N(p)) + " = ?", k, M(k) + ".")],
            traps: [TR(l10(a + b), "log a + log b = log(a · b), pas log(a + b)."), TR(l10(a) * l10(b), "La somme des logarithmes est le logarithme du produit."), TR(p, "On demande le logarithme du produit.")] }); },
      () => { const b = pk([2, 3, 5]), m = pk([2, 3, 5, 6, 7]), k = R.int(2, 4); if (m === b || (b === 2 && m === 4) || b ** k * m > 1000) return null; const A = b ** k * m;
        return QN("Calcule sans calculatrice " + M(lg(b, A) + " - " + lg(b, m)) + ".", k, M(lg(b, A) + " - " + lg(b, m) + " = " + lg(b, A + " \\div " + m) + " = " + lg(b, b ** k) + " = " + k) + ".",
          { ctx: "difference", guide: [G(M("\\log A - \\log B = \\log(A \\div B)") + ". Que vaut " + M(A + " \\div " + m) + " ?", b ** k, M(b ** k) + "."), G("Le logarithme vaut ?", k, M(lg(b, b ** k) + " = " + k) + ".")],
            traps: [TR(Math.log(A - m) / Math.log(b), "log A − log B = log(A ÷ B), pas log(A − B)."), TR(b ** k, "On demande le logarithme de " + b ** k + ".")] }); },
      () => { const [a, k, c, m] = pk([[5, 2, 4, 2], [2, 3, 125, 3], [5, 3, 8, 3], [2, 2, 25, 2], [20, 2, 25, 4], [2, 4, 625, 4], [4, 2, 625, 4], [5, 2, 40, 3]]);
        return QN("Calcule sans calculatrice " + M(k + " \\log " + a + " + \\log " + c) + ".", m, M(k + " \\log " + a + " = \\log " + a + "^{" + k + "} = \\log " + a ** k) + ", puis " + M("\\log(" + a ** k + " \\cdot " + c + ") = \\log " + N(a ** k * c) + " = " + m) + ".",
          { ctx: "coefficient", guide: [G(M(k + " \\log " + a + " = \\log(" + a + "^{" + k + "})") + ". Que vaut " + M(a + "^{" + k + "}") + " ?", a ** k, M(a ** k) + "."), G("Produit " + M(a ** k + " \\cdot " + c) + " ?", a ** k * c, M(N(a ** k * c)) + "."), G("Résultat ?", m, M("\\log " + N(a ** k * c) + " = " + m) + ".")],
            traps: [TR(l10(k * a * c), "k log a = log(a^k), pas log(k · a)."), TR(l10(a * c) * k, "Le coefficient ne porte que sur log " + a + ".")] }); },
    ],
    2: [
      () => { const [Nn, e2, e10] = pk([[8, 3, 0], [5, -1, 1], [20, 1, 1], [0.5, -1, 0], [16, 4, 0], [40, 2, 1], [2.5, -2, 1], [50, -1, 2], [0.2, 1, -1], [25, -2, 2], [32, 5, 0], [200, 1, 2], [0.25, -2, 0], [0.05, -1, -1]]), v = r6(e2 * L2 + e10);
        return QN("Sachant que " + M("\\log 2 \\approx 0{,}301") + ", calcule sans calculatrice " + M("\\log " + N(Nn)) + " (au millième).", v, M(N(Nn) + " = 2^{" + e2 + "} \\cdot 10^{" + e10 + "}") + " : " + M("\\log " + N(Nn) + " \\approx " + e2 + " \\cdot 0{,}301 " + (e10 < 0 ? "- " + -e10 : "+ " + e10) + " = " + N(v)) + ".",
          { ctx: "log2-donne", round: 0.001, guide: [G("Écris " + M(N(Nn) + " = 2^{a} \\cdot 10^{b}") + " : " + M("a") + " = ?", e2, M("a = " + e2) + "."), G("Et " + M("b") + " = ?", e10, M("b = " + e10) + " (" + M("\\log 10 = 1") + ")."), G(M("\\log " + N(Nn)) + " (au millième) ?", v, M(N(v)) + ".", 0.001)],
            traps: [TR(r6(e2 * L2), "N'oublie pas la puissance de 10 (log 10 = 1)."), TR(r6(L2 * Nn / 2), "Le logarithme n'est pas proportionnel : log(2k) ≠ k · log 2.")] }); },
      () => { const p = nz(-4, 5), q = nz(-4, 5), m = pk([2, 3]), n = pk([1, 2]), quot = R.rand() < 0.5, v = m * p + (quot ? -1 : 1) * n * q; if ([0, 1, -1].includes(v) || p === q) return null; const yy = n === 1 ? "y" : "y^{" + n + "}";
        return QN("On sait que " + M("\\log_a x = " + p) + " et " + M("\\log_a y = " + q) + ". Calcule " + M("\\log_a" + (quot ? "\\left(\\frac{x^{" + m + "}}{" + yy + "}\\right)" : "\\left(x^{" + m + "} " + yy + "\\right)")) + ".", v, M("= " + m + " \\log_a x " + (quot ? "-" : "+") + " " + (n === 1 ? "" : n) + "\\log_a y = " + m + " \\cdot " + pT(p) + (quot ? " - " : " + ") + (n === 1 ? "" : n + " \\cdot ") + pT(q) + " = " + v) + ".",
          { ctx: "developper", guide: [G("Développe : " + M(m + " \\log_a x " + (quot ? "-" : "+") + " " + (n === 1 ? "" : n) + "\\log_a y") + ". Que vaut " + M(m + " \\log_a x") + " ?", m * p, M(m * p) + "."), G("Résultat ?", v, M(v) + ".")],
            traps: [TR(r6(m * p * n * q), "Le logarithme d'un produit est une somme."), TR(m * p + (quot ? 1 : -1) * n * q, quot ? "Quotient : on soustrait le log du dénominateur." : "Produit : on additionne les logarithmes."), TR(p ** m * q ** n, "L'exposant devient un facteur devant le logarithme.")] }); },
      () => { const m = R.int(2, 5), k = pk([2, 3]), div = R.rand() < 0.5, v = r6(m + (div ? -1 : 1) / k), rt = k === 2 ? "\\sqrt{a}" : "\\sqrt[3]{a}";
        return QN("Simplifie " + M("\\log_a\\left(" + (div ? "\\frac{a^{" + m + "}}{" + rt + "}" : "a^{" + m + "} \\cdot " + rt) + "\\right)") + ". (fraction)", v, M(rt + " = a^{\\frac{1}{" + k + "}}") + " : " + M("\\log_a(a^{" + fT(v) + "}) = " + fT(v)) + ".",
          { ctx: "base-a", guide: [G("Écris " + M(rt) + " comme puissance de " + M("a") + " : exposant ?", 1 / k, M("\\frac{1}{" + k + "}") + "."), G("Exposant total (on " + (div ? "soustrait" : "additionne") + ") ?", v, M(m + (div ? " - " : " + ") + "\\frac{1}{" + k + "} = " + fT(v)) + ".")],
            traps: [TR(r6(m / k), div ? "Quotient : on soustrait les exposants." : "Produit : on additionne les exposants."), TR(m + (div ? 1 : -1) / k, div ? "On divise : on soustrait." : "On multiplie : on additionne."), TR(m + (div ? -k : k), "√a = a^(1/" + k + ") : l'exposant est une fraction.")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, 5]), b = pk([3, 5, 6, 7, 10]), k = R.int(2, 4); if (a === b || a ** k > 625) return null; const c = a ** k;
        return QN("Calcule sans calculatrice " + M(lg(a, b) + " \\cdot " + lg(b, c)) + ".", k, "Changement de base : " + M("\\frac{\\log " + b + "}{\\log " + a + "} \\cdot \\frac{\\log " + c + "}{\\log " + b + "} = \\frac{\\log " + c + "}{\\log " + a + "} = " + lg(a, c) + " = " + k) + ".",
          { ctx: "chaine", guide: [G("Écris chaque facteur comme quotient de logarithmes : " + M("\\log " + b) + " se simplifie. Il reste " + M(lg(a, c)) + ". " + M(c + " = " + a + "^{?}") + " : exposant ?", k, M(k) + "."), G("Résultat ?", k, M(k) + ".")],
            traps: [TR(l10(c) / l10(b), "Ce n'est que le second facteur."), TR(l10(c) / l10(a) * l10(b), "Le log " + b + " apparaît en haut et en bas : il se simplifie.")] }); },
      () => { const b = pk([2, 3, 4, 5]), a = R.int(2, 9), cands = [2, 3, 4, 5, 6, 8, 9, 10, 12].filter((c) => (a * b * b) % c === 0 && c !== a && c !== b && c !== a * b * b); if (!cands.length) return null; const c = pk(cands), x = (a * b * b) / c; if (x === 1) return null;
        return QS("Résous " + M("\\log_2 x = \\log_2 " + a + " + 2 \\log_2 " + b + " - \\log_2 " + c) + ".", [x], M("2 \\log_2 " + b + " = \\log_2 " + b * b) + ", donc " + M("\\log_2 x = \\log_2 \\frac{" + a + " \\cdot " + b * b + "}{" + c + "}") + " et " + M("x = " + x) + ".",
          { ctx: "un-seul-log", guide: [G(M("2 \\log_2 " + b + " = \\log_2(" + b + "^2)") + ". Que vaut " + M(b + "^2") + " ?", b * b, M(b * b) + "."), G("Somme des logs = log du produit : " + M(a + " \\cdot " + b * b) + " = ?", a * b * b, M(a * b * b) + "."), GSet("Différence = log du quotient : ensemble des solutions ?", [x], M("x = " + a * b * b + " \\div " + c + " = " + x) + ".")],
            traps: [TS([a + 2 * b - c], "Les logarithmes se combinent en produits et quotients, pas en sommes de nombres."), TS([(2 * a * b) / c], "2 log b = log(b²), pas log(2b)."), TS([a * b * b * c], "Le « − log " + c + " » divise par " + c + ".")] }); },
      () => { const [Nn, i, j, k] = pk([[6, 1, 1, 0], [12, 2, 1, 0], [18, 1, 2, 0], [1.5, -1, 1, 0], [0.6, 1, 1, -1], [24, 3, 1, 0], [4.5, -1, 2, 0], [60, 1, 1, 1], [0.3, 0, 1, -1], [36, 2, 2, 0], [27, 0, 3, 0], [15, -1, 1, 1], [0.9, 0, 2, -1]]), v = r6(i * L2 + j * L3 + k);
        return QN("Sachant que " + M("\\log 2 \\approx 0{,}301") + " et " + M("\\log 3 \\approx 0{,}477") + ", calcule sans calculatrice " + M("\\log " + N(Nn)) + " (au millième).", v, M(N(Nn) + " = 2^{" + i + "} \\cdot 3^{" + j + "} \\cdot 10^{" + k + "}") + " : " + M("\\log " + N(Nn) + " \\approx " + N(v)) + ".",
          { ctx: "log2-log3", round: 0.001, guide: [G("Écris " + M(N(Nn) + " = 2^{a} \\cdot 3^{b} \\cdot 10^{c}") + ". Exposant " + M("a") + " de 2 ?", i, M(i) + "."), G("Exposant " + M("b") + " de 3 ?", j, M(j) + "."), G(M("\\log " + N(Nn)) + " (au millième) ?", v, M(i + " \\cdot 0{,}301 + " + j + " \\cdot 0{,}477" + (k ? (k < 0 ? " - " : " + ") + Math.abs(k) : "") + " \\approx " + N(v)) + ".", 0.001)],
            traps: [TR(r6(L2 * L3), "log(2 · 3) = log 2 + log 3 : une somme, pas un produit."), TR(r6(i * L2 + j * L3), "N'oublie pas la puissance de 10 (log 10 = 1).")] }); },
    ],
  };

  // ===================================== C1. eqexp : équations exponentielles =====================================
  const EX = {
    1: [
      () => { const b = pk([2, 3, 5]), k = R.int(2, b === 2 ? 7 : 4), a = nz(-4, 4), v = b ** k, x = k - a;
        return QS("Résous " + M(b + "^{" + lin(1, a) + "} = " + N(v)) + ".", [x], M(N(v) + " = " + b + "^{" + k + "}") + " : même base, on égalise les exposants. " + M(lin(1, a) + " = " + k) + ", " + M("x = " + x) + ".",
          { ctx: "meme-base", guide: [G("Écris " + M(N(v)) + " comme puissance de " + M(b) + " : exposant ?", k, M(N(v) + " = " + b + "^{" + k + "}") + "."), GSet("Même base : " + M(lin(1, a) + " = " + k) + ". Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([k + a], "x " + (a < 0 ? "− " + -a : "+ " + a) + " = " + k + " donne x = " + k + " " + (a < 0 ? "+ " + -a : "− " + a) + "."), TS([v - a], "On égalise les exposants, pas les nombres.")] }); },
      () => { const b = pk([2, 3]), k = pk([2, 3]), x0 = nz(-2, 4), m = R.int(1, b === 2 ? 6 : 4), a = k * x0 - m; if (!a) return null; const v = b ** m;
        return QS("Résous " + M(b + "^{" + lin(k, -a) + "} = " + v) + ".", [x0], M(v + " = " + b + "^{" + m + "}") + " : " + M(lin(k, -a) + " = " + m) + ", " + M(k + "x = " + (m + a)) + ", " + M("x = " + x0) + ".",
          { ctx: "affine", guide: [G("Écris " + M(v) + " comme puissance de " + M(b) + " : exposant ?", m, M(m) + "."), G("On égalise les exposants : que vaut " + M(k + "x") + " ?", m + a, M(m + sg(a) + " = " + (m + a)) + "."), GSet("Ensemble des solutions ?", [x0], M(setT([x0])) + ".")],
            traps: [TS([(m - a) / k], "En passant " + -a + " de l'autre côté, son signe change."), TS([m / k + a], "Divise tout le membre de droite par " + k + ".")] }); },
      () => { const m = pk([2, 3, 4, 5, 6]), b = pk([2, 3]), k = R.int(2, b === 2 ? 5 : 4), v = m * b ** k;
        return QS("Résous " + M(m + " \\cdot " + b + "^{x} = " + v) + ".", [k], "On divise par " + M(m) + " : " + M(b + "^{x} = " + b ** k + " = " + b + "^{" + k + "}") + ", " + M("x = " + k) + ".",
          { ctx: "coef", guide: [G("On divise par " + M(m) + " : " + M(b + "^{x}") + " = ?", b ** k, M(v + " \\div " + m + " = " + b ** k) + "."), GSet("Ensemble des solutions ?", [k], M(b ** k + " = " + b + "^{" + k + "}") + " : " + M(setT([k])) + ".")],
            traps: [TS([b ** k], "C'est la valeur de " + b + "^x ; x est l'exposant."), TS([v / (m * b)], "On ne divise pas par la base : on cherche l'exposant.")] }); },
    ],
    2: [
      () => { const p = pk([2, 3]), i = R.int(1, 3), j = R.int(1, 3); if (i === j || p ** i > 27 || p ** j > 27) return null; const u = R.int(-3, 3), v = R.int(-3, 3), x = r6((j * v - i * u) / (i - j)); if (den(x) > 3 || u === v) return null;
        const B1 = p ** i, B2 = p ** j;
        return QS("Résous " + M(B1 + "^{" + lin(1, u) + "} = " + B2 + "^{" + lin(1, v) + "}") + ". (fractions acceptées)", [x], "Même base " + M(p) + " : " + M(p + "^{" + i + "(" + lin(1, u) + ")} = " + p + "^{" + j + "(" + lin(1, v) + ")}") + ", donc " + M(i + "(" + lin(1, u) + ") = " + j + "(" + lin(1, v) + ")") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "base-commune", guide: [G("Écris " + M(B1) + " comme puissance de " + M(p) + " : exposant ?", i, M(i) + "."), G("Et " + M(B2) + " ?", j, M(j) + "."), G("On égalise " + M(i + "(" + lin(1, u) + ") = " + j + "(" + lin(1, v) + ")") + ". Coefficient de x, tout à gauche ?", i - j, M(i + " - " + j + " = " + (i - j)) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([v - u], "Écris d'abord les deux membres avec la même base " + p + "."), TS([(j * v - i * u) / (j - i)], "Attention au signe en regroupant.")] }); },
      () => { const c = pk([2, 3, 4, 5]), b = pk([2, 3, 1.5, 1.08, 5]), d = c * pk([3, 7, 10, 2.5, 12]); const r = d / c, x = l10(r) / l10(b); if (Math.abs(x - Math.round(x)) < 1e-6) return null;
        return QN("Résous " + M(c + " \\cdot " + N(b) + "^{x} = " + N(d)) + " (au millième).", x, "On isole : " + M(N(b) + "^{x} = " + N(r)) + ", puis " + M("x = \\frac{\\log " + N(r) + "}{\\log " + N(b) + "} \\approx " + D(x, 0.001)) + ".",
          { ctx: "logarithme", round: 0.001, guide: [G("On divise par " + M(c) + " : " + M(N(b) + "^{x}") + " = ?", r, M(N(r)) + "."), G("Logarithme : " + M("x = \\frac{\\log " + N(r) + "}{\\log " + N(b) + "}") + " (au millième) ?", x, M(D(x, 0.001)) + ".", 0.001)],
            traps: [TR(l10(d) / l10(b), "Divise d'abord par " + c + "."), TR(r / b, "x est un exposant : utilise le logarithme."), TR(l10(r) - l10(b), "x = log " + T(r) + " ÷ log " + T(b) + ".")] }); },
      () => { const b = pk([2, 3, 5]), k = R.int(2, b === 5 ? 2 : 4), sub = R.rand() < 0.4, f = sub ? b * b - 1 : b + 1, v = f * b ** k;
        return QS("Résous " + M(sub ? b + "^{x + 2} - " + b + "^{x} = " + v : b + "^{x + 1} + " + b + "^{x} = " + v) + ".", [k], "On met " + M(b + "^{x}") + " en évidence : " + M(b + "^{x}(" + (sub ? b * b + " - 1" : b + " + 1") + ") = " + v) + ", " + M(b + "^{x} = " + b ** k) + ", " + M("x = " + k) + ".",
          { ctx: "factoriser", guide: [G("On met " + M(b + "^{x}") + " en évidence (" + M(b + "^{x + " + (sub ? 2 : 1) + "} = " + (sub ? b * b : b) + " \\cdot " + b + "^{x}") + "). Facteur entre parenthèses ?", f, M(f) + "."), G(M(b + "^{x}") + " = ?", b ** k, M(v + " \\div " + f + " = " + b ** k) + "."), GSet("Ensemble des solutions ?", [k], M(setT([k])) + ".")],
            traps: [TS([k - 1], "On factorise " + b + "^x : il reste " + b ** k + " = " + b + "^" + k + "."), TS([b ** k], "C'est la valeur de " + b + "^x ; x est l'exposant.")] }); },
    ],
    3: [
      () => { const b = pk([2, 3]), m = R.int(0, 3), neg = R.rand() < 0.35; let n = R.int(0, 3); if (!neg && n === m) return null; const X1 = b ** m, X2 = neg ? -R.int(1, 5) : b ** n, s = X1 + X2, Pr = X1 * X2; if (!s) return null; const sol = neg ? [m] : [m, n];
        return QS("Résous " + M(b + "^{2x}" + (s > 0 ? " - " : " + ") + (Math.abs(s) === 1 ? "" : fT(Math.abs(s)) + " \\cdot ") + b + "^{x}" + tm(Pr, "") + " = 0") + ".", sol, "On pose " + M("X = " + b + "^{x} > 0") + " : " + M("X^2" + tm(-s, "X") + tm(Pr, "") + " = 0") + ", " + M("X = " + Math.min(X1, X2)) + " ou " + M("X = " + Math.max(X1, X2)) + (neg ? " (une puissance est positive : rejetée)" : "") + ". " + M(setT(sol)) + ".",
          { ctx: "changement-variable", guide: [G("On pose " + M("X = " + b + "^{x}") + ". Plus petite solution en " + M("X") + " ?", Math.min(X1, X2), M(Math.min(X1, X2)) + (neg ? " : impossible, " + b + "^x est toujours positif." : ".")), G("Plus grande ?", Math.max(X1, X2), M(Math.max(X1, X2)) + "."), GSet("Retour à " + M("x") + " (" + M(b + "^{x} = X") + ") : ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS(neg ? [X1] : [X1, X2], "Ce sont les valeurs de X = " + b + "^x ; x est l'exposant."), neg ? TS([m, Math.abs(X2)], b + "^x est toujours positif : X = " + X2 + " est impossible.") : null] }); },
      () => { const a = pk([2, 3, 5]), c = pk([3, 5, 7]), k = R.int(1, 3); if (a === c) return null; const la = l10(a), lc = l10(c), x = (-k * lc) / (la - lc);
        return QN("Résous " + M(a + "^{x} = " + c + "^{x - " + k + "}") + " (au millième).", x, "On prend le logarithme : " + M("x \\log " + a + " = (x - " + k + ") \\log " + c) + ", " + M("x(\\log " + a + " - \\log " + c + ") = -" + k + " \\log " + c) + ", " + M("x \\approx " + D(x, 0.001)) + ".",
          { ctx: "deux-bases", round: 0.001, guide: [G("Logarithme des deux membres : " + M("x \\log " + a + " = (x - " + k + ") \\log " + c) + ". Coefficient de x tout à gauche, " + M("\\log " + a + " - \\log " + c) + " (au millième) ?", la - lc, M(D(la - lc, 0.001)) + ".", 0.001), G(M("x") + " (au millième) ?", x, M("\\frac{-" + k + " \\log " + c + "}{\\log " + a + " - \\log " + c + "} \\approx " + D(x, 0.001)) + ".", 0.001)],
            traps: [TR(k, "Les bases sont différentes : on ne peut pas égaliser les exposants."), TR(-x, "Attention aux signes en regroupant."), TR((k * lc) / (la + lc), "En développant, (x − " + k + ") log " + c + " = x log " + c + " − " + k + " log " + c + ".")] }); },
      () => { const b = pk([2, 3, 5]), s = R.int(2, 4), k = R.int(1, b === 2 ? 5 : 3), a = s * s - k; if (!a) return null; const v = b ** k, sol = [s, -s];
        return QS("Résous " + M(b + "^{" + polyT([1, 0, -a]) + "} = " + v) + ".", sol, M(v + " = " + b + "^{" + k + "}") + " : " + M("x^2" + sg(-a) + " = " + k) + ", " + M("x^2 = " + s * s) + ". " + M(setT(sol)) + ".",
          { ctx: "carre", guide: [G("Écris " + M(v) + " comme puissance de " + M(b) + " : exposant ?", k, M(k) + "."), G("On égalise les exposants : " + M("x^2") + " = ?", s * s, M(k + sg(a) + " = " + s * s) + "."), GSet("Ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS([s], "x² = " + s * s + " a deux solutions."), TS([s * s], "C'est x² ; prends les racines.")] }); },
    ],
  };

  // ===================================== C2. eqlog : équations logarithmiques =====================================
  const ELG = {
    1: [
      () => { const b = pk([2, 3, 5]), k = pk([2, 3]), a = nz(-5, 9), x = b ** k + a;
        return QS("Résous " + M(lg(b, "(" + lin(1, -a) + ")") + " = " + k) + ".", [x], "Par définition : " + M(lin(1, -a) + " = " + b + "^{" + k + "} = " + b ** k) + ", " + M("x = " + x) + " (et " + M(lin(1, -a) + " > 0") + ").",
          { ctx: "definition", guide: [G("Par définition, " + M(lin(1, -a) + " = " + b + "^{" + k + "}") + ". Que vaut " + M(b + "^{" + k + "}") + " ?", b ** k, M(b ** k) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([b * k + a], "x − " + a + " = " + b + "^" + k + ", pas " + b + " · " + k + "."), TS([b ** k - a], "On ajoute " + a + " (opération inverse).")] }); },
      () => { const k = pk([1, 2, 3]), a = nz(-20, 20), x = 10 ** k - a;
        return QS("Résous " + M("\\log(" + lin(1, a) + ") = " + k) + ".", [x], M(lin(1, a) + " = 10^{" + k + "} = " + N(10 ** k)) + ", " + M("x = " + N(x)) + ".",
          { ctx: "base10", guide: [G("Par définition, " + M(lin(1, a) + " = 10^{" + k + "}") + ". Que vaut " + M("10^{" + k + "}") + " ?", 10 ** k, M(N(10 ** k)) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([10 * k - a], "log(…) = " + k + " signifie … = 10^" + k + ", pas 10 · " + k + "."), TS([10 ** k + a], "On retire " + a + " des deux côtés.")] }); },
      () => { const b = pk([2, 3]), k = pk([2, 3, 4]), x0 = nz(-3, 8), m = R.int(2, b === 2 ? 5 : 4), a = b ** m - k * x0; if (!a) return null;
        return QS("Résous " + M(lg(b, "(" + lin(k, a) + ")") + " = " + m) + ".", [x0], M(lin(k, a) + " = " + b + "^{" + m + "} = " + b ** m) + ", " + M(k + "x = " + (b ** m - a)) + ", " + M("x = " + x0) + ".",
          { ctx: "affine", guide: [G("Par définition, " + M(lin(k, a)) + " = ?", b ** m, M(b + "^{" + m + "} = " + b ** m) + "."), G("Que vaut " + M(k + "x") + " ?", b ** m - a, M(b ** m + sg(-a) + " = " + (b ** m - a)) + "."), GSet("Ensemble des solutions ?", [x0], M(setT([x0])) + ".")],
            traps: [TS([(b * m - a) / k], "Par définition, " + k + "x + " + a + " = " + b + "^" + m + "."), TS([(b ** m + a) / k], "On retire " + a + ".")] }); },
    ],
    2: [
      () => { const C = []; for (const b of [2, 3, 10]) for (const m of [1, 2, 3]) { const Pp = b ** m; if (Pp > 1000) continue; for (let r = 2; r <= 40; r++) if (Pp % r === 0 && r - Pp / r >= 1) C.push([b, m, r, r - Pp / r]); }
        const [b, m, r1, a] = pk(C), r2 = a - r1, Pp = b ** m;
        return QS("Résous " + M(lg(b, "x") + " + " + lg(b, "(" + lin(1, -a) + ")") + " = " + m) + ".", [r1], "Domaine " + M("x > " + a) + ". " + M(lg(b, "(x(" + lin(1, -a) + "))") + " = " + m) + ", " + M("x^2 - " + (a === 1 ? "" : a) + "x - " + Pp + " = 0") + ", " + M("x = " + r1) + " ou " + M("x = " + r2) + " (hors domaine). " + M(setT([r1])) + ".",
          { ctx: "somme-rejet", guide: [G("Domaine : les deux logarithmes existent si " + M("x") + " est plus grand que ?", a, M("x > " + a) + "."), G("Somme = log du produit : " + M("x(" + lin(1, -a) + ") = " + b + "^{" + m + "}") + ". Que vaut " + M(b + "^{" + m + "}") + " ?", Pp, M(Pp) + "."), G("Plus grande solution de " + M("x^2 - " + (a === 1 ? "" : a) + "x - " + Pp + " = 0") + " ?", r1, M(r1) + "."), GSet("Garde celles du domaine. Ensemble des solutions ?", [r1], M(setT([r1])) + " (" + M(r2) + " est hors domaine).")],
            traps: [TS([r1, r2], "Vérifie le domaine : x > " + a + "."), TS([r2], "Cette valeur est hors domaine (log d'un nombre négatif).")] }); },
      () => { const b = pk([2, 3]), m = pk([1, 2]), B = b ** m, c = nz(-3, 5), a = R.int(1, 9); if (a + c <= 0 || B === 1) return null; const x = r6((B * c + a) / (B - 1)); if (den(x) > 8) return null;
        return QS("Résous " + M(lg(b, "(" + lin(1, a) + ")") + " - " + lg(b, "(" + lin(1, -c) + ")") + " = " + m) + ". (fractions acceptées)", [x], "Différence = log du quotient : " + M("\\frac{" + lin(1, a) + "}{" + lin(1, -c) + "} = " + B) + ", " + M(lin(1, a) + " = " + B + "(" + lin(1, -c) + ")") + ", " + M("x = " + fT(x)) + " (dans le domaine " + M("x > " + c) + ").",
          { ctx: "difference", guide: [G("Différence = log du quotient : " + M("\\frac{" + lin(1, a) + "}{" + lin(1, -c) + "}") + " = ?", B, M(b + "^{" + m + "} = " + B) + "."), G("On multiplie : " + M(lin(1, a) + " = " + B + "(" + lin(1, -c) + ")") + ". Coefficient de x (droite moins gauche) ?", B - 1, M(B - 1) + "."), GSet("Ensemble des solutions ?", [x], M(setT([x])) + ".")],
            traps: [TS([(c * B + a) / (B + 1)], "Regroupe les x : (" + B + " − 1)x = " + B * c + " + " + a + "."), TS([(B * c - a) / (B - 1)], "Attention aux signes en développant.")] }); },
      () => { const r1 = R.int(2, 8), r2 = -R.int(1, 6), p = r1 + r2, q = -r1 * r2; if (!p) return null;
        return QS("Résous " + M("2\\log x = \\log(" + lin(p, q) + ")") + ".", [r1], M("2\\log x = \\log(x^2)") + " : " + M("x^2 = " + lin(p, q)) + ", " + M("x = " + r1) + " ou " + M("x = " + r2) + " ; le domaine impose " + M("x > 0") + ". " + M(setT([r1])) + ".",
          { ctx: "coefficient", guide: [G(M("2 \\log x = \\log(x^2)") + ". Plus grande solution de " + M("x^2 = " + lin(p, q)) + " ?", r1, M(r1) + "."), G("Plus petite ?", r2, M(r2) + " : hors domaine (" + M("x > 0") + ")."), GSet("Ensemble des solutions ?", [r1], M(setT([r1])) + ".")],
            traps: [TS([r1, r2], "Domaine : log x existe seulement pour x > 0."), TS([r2], "Hors domaine : log d'un nombre négatif.")] }); },
    ],
    3: [
      () => { const c = R.int(1, 3), s = R.int(c + 1, c + 5), k = s * s - c * c, sol = [s];
        return QS("Résous " + M("\\log(" + lin(1, -c) + ") + \\log(" + lin(1, c) + ") = \\log " + k) + ".", sol, "Domaine " + M("x > " + c) + ". " + M("(x - " + c + ")(x + " + c + ") = " + k) + ", " + M("x^2 = " + s * s) + ", " + M("x = \\pm " + s) + " ; " + M(-s) + " est hors domaine. " + M(setT(sol)) + ".",
          { ctx: "domaine", guide: [G("Domaine : " + M("x") + " plus grand que ?", c, M("x > " + c) + "."), G("Produit : " + M("x^2 - " + c * c + " = " + k) + ". " + M("x^2") + " = ?", s * s, M(s * s) + "."), GSet("Ensemble des solutions (dans le domaine) ?", sol, M(setT(sol)) + ".")],
            traps: [TS([s, -s], "Domaine : x > " + c + " ; −" + s + " est rejeté."), TS([s * s], "C'est x² ; prends la racine.")] }); },
      () => { const m = R.int(-2, 3), n = R.int(-2, 3); if (m >= n) return null; const s = m + n, Pr = m * n, sol = [10 ** m, 10 ** n];
        return QS("Résous " + M("(\\log x)^2" + tm(-s, "\\log x") + tm(Pr, "") + " = 0") + ".", sol, "On pose " + M("X = \\log x") + " : " + M("X = " + m) + " ou " + M("X = " + n) + ", puis " + M("x = 10^{X}") + " : " + M(setT(sol)) + ".",
          { ctx: "changement-variable", guide: [G("On pose " + M("X = \\log x") + ". Plus petite solution en " + M("X") + " ?", m, M(m) + "."), G("Plus grande ?", n, M(n) + "."), GSet("Retour à " + M("x = 10^{X}") + " : ensemble des solutions ?", sol, M(setT(sol)) + ".")],
            traps: [TS([m, n], "Ce sont les valeurs de log x : x = 10^X.")] }); },
      () => { if (R.rand() < 0.5) { const L = pk([30, 40, 50, 60, 70, 80, 90, 100, 110]), v = 10 ** (L / 10);
          return QN("Le niveau sonore vaut " + M("L = 10 \\cdot \\log\\left(\\frac{I}{I_0}\\right)") + " (en dB). Un son a un niveau de " + M(L) + " dB. Combien de fois son intensité est-elle plus grande que " + M("I_0") + " ?", v, M("\\log\\left(\\frac{I}{I_0}\\right) = " + L / 10) + ", donc " + M("\\frac{I}{I_0} = 10^{" + L / 10 + "} = " + N(v)) + ".",
            { ctx: "decibels", guide: [G("On divise par 10 : " + M("\\log\\left(\\frac{I}{I_0}\\right)") + " = ?", L / 10, M(L / 10) + "."), G(M("\\frac{I}{I_0}") + " = ?", v, M("10^{" + L / 10 + "} = " + N(v)) + ".")], traps: [TR(L / 10, "C'est le logarithme du rapport : rapport = 10^" + L / 10 + "."), TR(10 * L, "Par définition, log y = k donne y = 10^k.")] }); }
        const M1 = pk([5, 6, 7, 8]), d = pk([1, 2, 3]), v = 10 ** d;
        return QN("La magnitude d'un séisme vaut " + M("M = \\log\\left(\\frac{A}{A_0}\\right)") + " (A : amplitude). Combien de fois l'amplitude d'un séisme de magnitude " + M(M1) + " est-elle plus grande que celle d'un séisme de magnitude " + M(M1 - d) + " ?", v, M("\\log\\left(\\frac{A_1}{A_2}\\right) = " + M1 + " - " + (M1 - d) + " = " + d) + ", donc " + M("\\frac{A_1}{A_2} = 10^{" + d + "} = " + N(v)) + ".",
          { ctx: "richter", guide: [G("Différence des magnitudes = log du rapport : " + M("\\log\\left(\\frac{A_1}{A_2}\\right)") + " = ?", d, M(d) + "."), G("Rapport des amplitudes ?", v, M("10^{" + d + "} = " + N(v)) + ".")], traps: [TR(d, "C'est le logarithme du rapport."), TR(r6(M1 / (M1 - d)), "L'échelle est logarithmique : rapport = 10^(différence).")] }); },
    ],
  };

  // ===================================== C3. croissexp : croissance et décroissance exponentielles =====================================
  const CHF = (v) => N(Math.round(v * 100) / 100);
  const CR = {
    1: [
      () => { const C0 = pk([1000, 2000, 2500, 5000, 8000, 10000]), t = pk([1, 1.5, 2, 2.5, 3, 4]), n = R.int(2, 10), f = 1 + t / 100, C = C0 * f ** n;
        return QN("Un capital de " + M(N(C0)) + " CHF est placé à " + M(N(t) + "\\,\\%") + " d'intérêts composés par an. Que vaut-il après " + M(n) + " ans (au centime) ?", C, M("C = " + N(C0) + " \\cdot " + N(f) + "^{" + n + "} \\approx " + CHF(C)) + " CHF.",
          { ctx: "capital", round: 0.01, guide: [G("Facteur annuel " + M("1 + \\frac{" + N(t) + "}{100}") + " ?", f, M(N(f)) + "."), G("Capital après " + n + " ans (au centime) ?", C, M(N(C0) + " \\cdot " + N(f) + "^{" + n + "} \\approx " + CHF(C)) + " CHF.", 0.01)],
            traps: [TR(C0 * (1 + (n * t) / 100), "Intérêts composés : on multiplie chaque année par " + T(f) + " (les intérêts rapportent aussi)."), TR(C0 * f * n, "On multiplie " + n + " fois par " + T(f) + " : c'est une puissance."), TR(C0 * (t / 100) ** n, "Le facteur annuel est 1 + t, pas t.")] }); },
      () => { /* audit niveau 25.11 : « double toutes les T h, après k·T h » (2^k, niveau CO) -> durée non multiple de T, modèle N0 · 2^(t/T) (S6.EL.03, S5.PL.03) */
        const N0 = pk([120, 200, 250, 400, 500, 800]), Tt = pk([3, 4, 5, 6, 8]), t = R.int(Tt + 1, 4 * Tt); if (t % Tt === 0) return null; const e = t / Tt, Nt = N0 * 2 ** e;
        return QN("Une culture de " + M(N0) + " bactéries double toutes les " + M(Tt) + " heures : " + M("N(t) = " + N0 + " \\cdot 2^{\\frac{t}{" + Tt + "}}") + " (t en heures). Combien y a-t-il de bactéries après " + M(t) + " heures (à l'unité) ?", Nt, "Exposant " + M("\\frac{" + t + "}{" + Tt + "}" + (den(e) <= 10 && den(e) > 1 ? "" : " \\approx " + D(e, 0.001))) + " : " + M("N(" + t + ") = " + N0 + " \\cdot 2^{\\frac{" + t + "}{" + Tt + "}} \\approx " + N(Math.round(Nt))) + " bactéries.",
          { ctx: "doublement", round: 1, guide: [G("Exposant " + M("\\frac{" + t + "}{" + Tt + "}") + " (nombre de doublements, au centième) ?", e, M("\\frac{" + t + "}{" + Tt + "} \\approx " + D(e, 0.01)) + ".", 0.01), G("Facteur " + M("2^{\\frac{" + t + "}{" + Tt + "}}") + " (au centième) ?", 2 ** e, M("\\approx " + D(2 ** e, 0.01)) + ".", 0.01), G("Nombre de bactéries (à l'unité) ?", Nt, M(N0 + " \\cdot 2^{\\frac{" + t + "}{" + Tt + "}} \\approx " + N(Math.round(Nt))) + ".", 1)],
            traps: [TR(N0 * 2 * e, "Doubler " + T(r6(Math.round(e * 100) / 100)) + " fois, c'est multiplier par 2 à la puissance " + t + "/" + Tt + ", pas par 2 · " + t + "/" + Tt + "."), TR(N0 * 2 ** Math.floor(e), "Le modèle est continu : l'exposant " + t + "/" + Tt + " n'est pas arrondi."), TR(N0 * 2 ** (Tt / t), "L'exposant est t ÷ " + Tt + " (temps écoulé ÷ temps de doublement).")] }); },
      () => { const V0 = pk([18000, 20000, 25000, 30000, 40000]), p = pk([10, 12, 15, 20]), n = R.int(2, 6), f = 1 - p / 100, V = V0 * f ** n;
        return QN("Une voiture achetée " + M(N(V0)) + " CHF perd " + M(p + "\\,\\%") + " de sa valeur chaque année. Que vaut-elle après " + M(n) + " ans (au franc près) ?", V, M(N(V0) + " \\cdot " + N(f) + "^{" + n + "} \\approx " + N(Math.round(V))) + " CHF.",
          { ctx: "depreciation", round: 1, guide: [G("Facteur annuel " + M("1 - \\frac{" + p + "}{100}") + " ?", f, M(N(f)) + "."), G("Valeur après " + n + " ans (au franc près) ?", V, M(N(Math.round(V))) + " CHF.", 1)],
            traps: [TR(V0 * (1 - (n * p) / 100), "La perte se calcule chaque année sur la nouvelle valeur : puissance de " + T(f) + "."), TR(V0 * (p / 100) ** n, "Elle garde " + (100 - p) + " % de sa valeur : facteur " + T(f) + "."), TR(V0 - V0 * f ** n, "On demande la valeur restante, pas la perte.")] }); },
    ],
    2: [
      () => { const t = pk([1.5, 2, 2.5, 3, 4, 5, 6]), f = 1 + t / 100, ne = l10(2) / l10(f), n = Math.ceil(ne);
        return QN("Un capital est placé à " + M(N(t) + "\\,\\%") + " d'intérêts composés. Après combien d'années entières aura-t-il doublé pour la première fois ?", n, M(N(f) + "^{n} = 2") + " : " + M("n = \\frac{\\log 2}{\\log " + N(f) + "} \\approx " + D(ne, 0.01)) + " ; il faut donc " + M(n) + " ans.",
          { ctx: "doubler", guide: [G("On résout " + M(N(f) + "^{n} = 2") + " : " + M("n = \\frac{\\log 2}{\\log " + N(f) + "}") + " (au centième) ?", ne, M(D(ne, 0.01)) + ".", 0.01), G("Nombre d'années entières ?", n, "Après " + M(Math.floor(ne)) + " ans, pas encore doublé : " + M(n) + " ans.")],
            traps: [TR(Math.floor(ne), "Après " + Math.floor(ne) + " ans, le capital n'a pas encore tout à fait doublé : il faut l'année suivante."), TR(Math.round(100 / t), "Ce serait vrai avec des intérêts simples."), TR(Math.ceil(l10(2) / l10(t)), "Le facteur est 1 + t = " + T(f) + ".")] }); },
      () => { const [nom, Tt, u] = pk([["L'iode 131", 8, "jours"], ["Le technétium 99m", 6, "heures"], ["Le césium 137", 30, "ans"], ["Le carbone 14", 5730, "ans"]]), f = pk([0.5, 1.5, 2.5, 3, 4, 5]), t = f * Tt, pct = 100 * 0.5 ** f;
        return QN(nom + " a une demi-vie de " + M(N(Tt)) + " " + u + ". Quel pourcentage d'un échantillon reste-t-il après " + M(N(t)) + " " + u + " (au dixième) ?", pct, M(N(t) + " \\div " + N(Tt) + " = " + N(f)) + " demi-vies : " + M("100 \\cdot 0{,}5^{" + N(f) + "} \\approx " + D(pct, 0.1)) + " %.",
          { ctx: "demi-vie", round: 0.1, guide: [G("Nombre de demi-vies ?", f, M(N(f)) + "."), G("Pourcentage restant (au dixième) ?", pct, M(D(pct, 0.1)) + " %.", 0.1)],
            traps: [TR(100 - 50 * f, "La décroissance n'est pas linéaire : on divise par 2 à chaque demi-vie."), TR(100 / (2 * f), "On multiplie par 0,5 à chaque demi-vie : 0,5^" + T(f) + ".")] }); },
      () => { const N0 = pk([100, 200, 500, 300]), Tt = pk([2, 3, 4, 20, 30]), k = R.int(3, 7), Nt = N0 * 2 ** k, u = Tt >= 20 ? "minutes" : "heures";
        return QN("Une culture de " + M(N0) + " bactéries double toutes les " + M(Tt) + " " + u + ". Après combien " + (u === "heures" ? "d'heures" : "de minutes") + " y en aura-t-il " + M(N(Nt)) + " ?", k * Tt, M(N0 + " \\cdot 2^{t / " + Tt + "} = " + N(Nt)) + " : " + M("2^{t / " + Tt + "} = " + 2 ** k + " = 2^{" + k + "}") + ", " + M("t = " + k * Tt) + " " + u + ".",
          { ctx: "bacteries", guide: [G("Facteur de croissance " + M(N(Nt) + " \\div " + N0) + " ?", 2 ** k, M(2 ** k) + "."), G("Nombre de doublements (" + M(2 ** k + " = 2^{?}") + ") ?", k, M(k) + "."), G("Durée (en " + u + ") ?", k * Tt, M(k + " \\cdot " + Tt + " = " + k * Tt) + ".")],
            traps: [TR(k, "C'est le nombre de doublements ; multiplie par " + Tt + "."), TR((2 ** k * Tt) / 2, "Le facteur " + 2 ** k + " correspond à " + k + " doublements.")] }); },
    ],
    3: [
      () => { const [nom, Tt, u] = pk([["L'iode 131", 8, "jours"], ["Le carbone 14", 5730, "ans"], ["Le césium 137", 30, "ans"], ["Un médicament", 6, "heures"]]), p = pk([5, 10, 20, 25, 30, 40]), r = l10(p / 100) / l10(0.5), t = Tt * r; if (Number.isInteger(r6(r))) return null;
        return QN(nom + " a une demi-vie de " + M(N(Tt)) + " " + u + ". Après combien " + (u === "ans" ? "d'années" : "de " + u) + " ne reste-t-il que " + M(p + "\\,\\%") + " de la quantité de départ (au dixième) ?", t, M("0{,}5^{t / " + N(Tt) + "} = " + N(p / 100)) + " : " + M("\\frac{t}{" + N(Tt) + "} = \\frac{\\log " + N(p / 100) + "}{\\log 0{,}5} \\approx " + D(r, 0.01)) + ", " + M("t \\approx " + D(t, 0.1)) + " " + u + ".",
          { ctx: "demi-vie-temps", round: 0.1, guide: [G("On résout " + M("0{,}5^{t / " + N(Tt) + "} = " + N(p / 100)) + ". " + M("\\frac{t}{" + N(Tt) + "} = \\frac{\\log " + N(p / 100) + "}{\\log 0{,}5}") + " (au centième) ?", r, M(D(r, 0.01)) + ".", 0.01), G(M("t") + " (au dixième) ?", t, M(D(t, 0.1)) + " " + u + ".", 0.1)],
            traps: [TR((Tt * (100 - p)) / 50, "La décroissance n'est pas linéaire : utilise le logarithme."), TR(-t, "Les deux logarithmes sont négatifs : le quotient est positif."), TR(r, "C'est le nombre de demi-vies ; multiplie par " + T(Tt) + ".")] }); },
      () => { const C0 = pk([2000, 5000, 8000, 10000]), rr = pk([1.5, 2, 2.5, 3, 4]), n = R.int(3, 10), C1 = Math.round(C0 * (1 + rr / 100) ** n * 100) / 100, q = C1 / C0, t = 100 * (q ** (1 / n) - 1);
        return QN("Un capital de " + M(N(C0)) + " CHF placé à intérêts composés vaut " + M(N(C1)) + " CHF après " + M(n) + " ans. Quel est le taux annuel (en %, au centième) ?", t, M("(1 + t)^{" + n + "} = \\frac{" + N(C1) + "}{" + N(C0) + "}") + ", " + M("1 + t = \\sqrt[" + n + "]{" + D(q, 0.0001) + "}") + ", taux " + M("\\approx " + D(t, 0.01) + "\\,\\%") + ".",
          { ctx: "taux", round: 0.01, guide: [G("Facteur total " + M("\\frac{" + N(C1) + "}{" + N(C0) + "}") + " (au millième) ?", q, M(D(q, 0.001)) + ".", 0.001), G("Racine " + n + "e moins 1, en % (au centième) ?", t, M(D(t, 0.01) + "\\,\\%") + ".", 0.01)],
            traps: [TR((100 * (q - 1)) / n, "Ce serait le taux d'intérêts simples ; avec les intérêts composés, prends la racine " + n + "e."), TR(100 * (q - 1), "C'est l'augmentation totale sur " + n + " ans.")] }); },
      () => { const car = R.rand() < 0.5, p = car ? pk([10, 12, 15, 20, 25]) : pk([10, 15, 20, 25, 30]), [qv, qt] = car ? pk([[0.5, "la moitié"], [0.25, "le quart"], [1 / 3, "le tiers"]]) : pk([[0.1, "10 %"], [0.2, "20 %"], [0.05, "5 %"]]), f = 1 - p / 100, x = l10(qv) / l10(f), n = Math.ceil(x); if (Number.isInteger(r6(x))) return null;
        return QN(car ? "Une machine perd " + M(p + "\\,\\%") + " de sa valeur chaque année. Après combien d'années entières vaut-elle moins " + qt.replace(/^le /, "du ").replace(/^la /, "de la ") + " de son prix d'achat ?" : "Le corps élimine " + M(p + "\\,\\%") + " d'un médicament par heure. Après combien d'heures entières en reste-t-il moins de " + qt + " de la dose ?", n,
          M(N(f) + "^{n} < " + N(qv)) + " : " + M("n > \\frac{\\log " + N(qv) + "}{\\log " + N(f) + "} \\approx " + D(x, 0.01)) + " (on divise par un nombre négatif : le sens change), donc " + M(n) + ".",
          { ctx: car ? "seuil-machine" : "seuil-medicament", guide: [G(M("n > \\frac{\\log " + N(qv) + "}{\\log " + N(f) + "}") + " (au centième) ?", x, M(D(x, 0.01)) + ".", 0.01), G("Plus petit nombre entier qui convient ?", n, M(n) + ".")],
            traps: [TR(Math.floor(x), "Après " + Math.floor(x) + " " + (car ? "ans" : "heures") + ", on n'est pas encore en dessous : il faut l'entier suivant."), TR(Math.ceil((1 - qv) / (p / 100)), "La diminution n'est pas linéaire : on multiplie par " + T(f) + " à chaque fois.")] }); },
    ],
  };

  // ===================================== D1. volmp : volumes =====================================
  const VO = {
    1: [
      () => { /* audit niveau 25.11 : la formule seule est du niveau 11e ; on demande la capacité en litres (conversion, examen TASV 2023) */
        const r = pk([15, 20, 25, 30, 35, 40, 45, 60]), h = 10 * R.int(4, 15), dia = R.rand() < 0.5; const V = PI * r * r * h, L = V / 1000;
        return QN("Un réservoir cylindrique a un " + (dia ? "diamètre de " + M(2 * r + "\\text{ cm}") : "rayon de " + M(r + "\\text{ cm}")) + " et une hauteur de " + M(h + "\\text{ cm}") + ". Quelle est sa capacité en litres (au dixième) ?", L, M("V = \\pi r^2 h = \\pi \\cdot " + r + "^2 \\cdot " + h + " \\approx " + D(V, 1) + cm3) + " et " + M("1\\text{ L} = 1\\text{'}000" + cm3) + " : " + M("\\approx " + D(L, 0.1) + "\\text{ L}") + ".",
          { ctx: "cylindre", round: 0.1, guide: [G("Volume en " + M("\\text{cm}^3") + " (à l'unité) ?", V, M("\\pi \\cdot " + r + "^2 \\cdot " + h + " \\approx " + D(V, 1) + cm3) + ".", 1), G("Capacité en litres (" + M("1\\text{ L} = 1\\text{ dm}^3 = 1\\text{'}000" + cm3) + ", au dixième) ?", L, M(D(L, 0.1) + "\\text{ L}") + ".", 0.1)],
            traps: [TR(V, "La réponse est demandée en litres : divise par 1'000."), TR(V / 100, "1 L = 1'000 cm³ (1 dm³), pas 100 cm³."), dia ? TR(4 * V / 1000, "Le rayon est la moitié du diamètre.") : TR(2 * PI * r * h / 1000, "2πrh est l'aire latérale ; le volume est πr²h.")] }); },
      () => { const c = R.int(3, 12), h = 3 * R.int(1, 5), V = (c * c * h) / 3;
        return QN("Calcule le volume d'une pyramide à base carrée de côté " + M(c + "\\text{ cm}") + " et de hauteur " + M(h + "\\text{ cm}") + ".", V, M("V = \\frac{A_{\\text{base}} \\cdot h}{3} = \\frac{" + c * c + " \\cdot " + h + "}{3} = " + N(V) + cm3) + ".",
          { ctx: "pyramide", guide: [G("Aire de la base ?", c * c, M(c + "^2 = " + c * c + cm2) + "."), G("Volume ?", V, M(N(V) + cm3) + ".")],
            traps: [TR(c * c * h, "Pyramide : on divise par 3."), TR((c * c * h) / 2, "Pyramide : on divise par 3, pas par 2."), TR((c * h) / 3, "La base est un carré : aire = côté².")] }); },
      () => { const r = R.int(2, 9), h = R.int(3, 15); if (h === r) return null; const V = (PI * r * r * h) / 3;
        return QN("Calcule le volume d'un cône de rayon " + M(r + "\\text{ cm}") + " et de hauteur " + M(h + "\\text{ cm}") + " (au centième).", V, M("V = \\frac{\\pi r^2 h}{3} = \\frac{" + r * r * h + "\\pi}{3} \\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: "cone", round: 0.01, guide: [G("Aire de la base " + M("\\pi r^2") + " (au centième) ?", PI * r * r, M(D(PI * r * r, 0.01)) + ".", 0.01), G("Volume (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR(PI * r * r * h, "Cône : on divise par 3."), TR((PI * r * h) / 3, "La base est un disque : aire πr².")] }); },
      () => { /* audit niveau 25.11 : boule -> capacité en litres (conversion) */
        const d = pk([16, 20, 24, 30, 36, 40, 50]), r = d / 2, V = (4 / 3) * PI * r ** 3, L = V / 1000;
        return QN("Un ballon sphérique a un diamètre de " + M(d + "\\text{ cm}") + ". Quel volume d'air contient-il, en litres (au dixième) ?", L, "Rayon " + M(r) + " cm : " + M("V = \\frac{4}{3}\\pi \\cdot " + r + "^3 \\approx " + D(V, 1) + cm3 + " \\approx " + D(L, 0.1) + "\\text{ L}") + ".",
          { ctx: "boule", round: 0.1, guide: [G("Rayon (cm) ?", r, M(r + "\\text{ cm}") + "."), G("Volume " + M("\\frac{4}{3}\\pi r^3") + " en " + M("\\text{cm}^3") + " (à l'unité) ?", V, M(D(V, 1) + cm3) + ".", 1), G("En litres (au dixième) ?", L, M(D(L, 0.1) + "\\text{ L}") + ".", 0.1)],
            traps: [TR((4 / 3) * PI * d ** 3 / 1000, "Le rayon est la moitié du diamètre."), TR(4 * PI * r * r / 1000, "4πr² est l'aire de la sphère ; le volume est 4/3 πr³."), TR(V, "La réponse est demandée en litres : divise par 1'000.")] }); },
    ],
    2: [
      () => { const r = R.int(2, 6), h = R.int(2, 12); if (h === r) return null; const k = r * r * h;
        return QN("Un cylindre de rayon " + M(r + "\\text{ cm}") + " a un volume de " + M(k + "\\pi" + cm3) + ". Quelle est sa hauteur (en cm) ?", h, M(k + "\\pi = \\pi \\cdot " + r * r + " \\cdot h") + ", donc " + M("h = " + k + " \\div " + r * r + " = " + h) + " cm.",
          { ctx: "hauteur-cylindre", guide: [G("Aire de la base, en multiples de " + M("\\pi") + " : " + M("r^2") + " = ?", r * r, M(r * r) + "."), G("Hauteur ?", h, M(k + " \\div " + r * r + " = " + h) + " cm.")],
            traps: [TR(k / r, "La base est πr² : divise par r² = " + r * r + "."), TR(k / (2 * r), "La base est πr², pas 2πr.")] }); },
      () => { const r = R.int(2, 9), h = 3 * R.int(1, 4); if (h === r) return null; const k = (r * r * h) / 3;
        return QN("Un cône de hauteur " + M(h + "\\text{ cm}") + " a un volume de " + M(k + "\\pi" + cm3) + ". Quel est son rayon (en cm) ?", r, M("\\frac{\\pi r^2 \\cdot " + h + "}{3} = " + k + "\\pi") + " : " + M("r^2 = \\frac{3 \\cdot " + k + "}{" + h + "} = " + r * r) + ", " + M("r = " + r) + " cm.",
          { ctx: "rayon-cone", guide: [G(M("r^2 = \\frac{3V}{\\pi h}") + " : " + M("r^2") + " = ?", r * r, M("3 \\cdot " + k + " \\div " + h + " = " + r * r) + "."), G("Rayon ?", r, M("\\sqrt{" + r * r + "} = " + r) + " cm.")],
            traps: [TR(r * r, "C'est r² : prends la racine."), TR(Math.sqrt(k / h), "N'oublie pas le ÷ 3 de la formule : multiplie par 3.")] }); },
      () => { const r = R.int(2, 6), k = (4 * r ** 3) / 3;
        return QN("Une boule a un volume de " + M(fT(k) + "\\pi" + cm3) + ". Quel est son rayon (en cm) ?", r, M("\\frac{4}{3}\\pi r^3 = " + fT(k) + "\\pi") + " : " + M("r^3 = " + fT(k) + " \\cdot \\frac{3}{4} = " + r ** 3) + ", " + M("r = " + r) + " cm.",
          { ctx: "rayon-boule", guide: [G(M("r^3 = \\frac{3}{4} \\cdot " + fT(k)) + " = ?", r ** 3, M(r ** 3) + "."), G("Rayon (racine cubique) ?", r, M("\\sqrt[3]{" + r ** 3 + "} = " + r) + " cm.")],
            traps: [TR(r ** 3, "C'est r³ : prends la racine cubique."), TR(Math.cbrt(k), "Multiplie d'abord par 3/4.")] }); },
      () => { const a = R.int(3, 10), b = R.int(3, 10), h = R.int(4, 20); if (a === b) return null; const V = (a * b * h) / 2;
        return QN("Un prisme droit a pour base un triangle rectangle dont les côtés de l'angle droit mesurent " + M(a + "\\text{ cm}") + " et " + M(b + "\\text{ cm}") + ". Sa hauteur vaut " + M(h + "\\text{ cm}") + ". Calcule son volume.", V, M("A_{\\text{base}} = \\frac{" + a + " \\cdot " + b + "}{2} = " + N((a * b) / 2)) + " ; " + M("V = " + N((a * b) / 2) + " \\cdot " + h + " = " + N(V) + cm3) + ".",
          { ctx: "prisme", guide: [G("Aire du triangle de base ?", (a * b) / 2, M(N((a * b) / 2) + cm2) + "."), G("Volume ?", V, M(N(V) + cm3) + ".")],
            traps: [TR(a * b * h, "L'aire d'un triangle rectangle est (a · b) ÷ 2."), TR((a * b * h) / 6, "C'est un prisme (pas une pyramide) : V = A_base · h.")] }); },
    ],
    3: [
      () => { const r = R.int(2, 5), H = R.int(6, 12), cone = R.rand() < 0.5, hc = R.int(2, 5), Vc = PI * r * r * H, Vt = cone ? (PI * r * r * hc) / 3 : (2 / 3) * PI * r ** 3, V = Vc + Vt;
        return QN("Un silo est formé d'un cylindre de rayon " + M(r + "\\text{ m}") + " et de hauteur " + M(H + "\\text{ m}") + ", surmonté " + (cone ? "d'un cône de même rayon et de hauteur " + M(hc + "\\text{ m}") : "d'une demi-boule de même rayon") + ". Calcule son volume (en m³, au centième).", V,
          "Cylindre " + M(D(Vc, 0.01)) + ", " + (cone ? "cône" : "demi-boule") + " " + M(D(Vt, 0.01)) + " : total " + M("\\approx " + D(V, 0.01) + "\\text{ m}^3") + ".",
          { ctx: "silo", round: 0.01, guide: [G("Volume du cylindre (au centième) ?", Vc, M(r * r * H + "\\pi \\approx " + D(Vc, 0.01)) + ".", 0.01), G("Volume du " + (cone ? "cône" : "toit (demi-boule)") + " (au centième) ?", Vt, M(D(Vt, 0.01)) + ".", 0.01), G("Volume total (au centième) ?", V, M(D(V, 0.01) + "\\text{ m}^3") + ".", 0.01)],
            traps: [TR(Vc, "Ajoute le volume du toit."), cone ? TR(Vc + PI * r * r * hc, "Cône : divise par 3.") : TR(Vc + (4 / 3) * PI * r ** 3, "Une demi-boule : la moitié de 4/3 πr³.")] }); },
      () => { const c = pk([6, 8, 10, 12, 20]), cyl = R.rand() < 0.4, Vs = cyl ? PI * (c / 2) ** 2 * c : (4 / 3) * PI * (c / 2) ** 3, V = c ** 3 - Vs;
        return QN((cyl ? "Un cylindre" : "Une boule") + " est placé" + (cyl ? "" : "e") + " dans une boîte cubique d'arête " + M(c + "\\text{ cm}") + " qu'" + (cyl ? "il" : "elle") + " touche sur chaque face. Calcule le volume d'air restant dans la boîte (au centième).", V,
          "Cube " + M(N(c ** 3) + cm3) + ", " + (cyl ? "cylindre (rayon " + c / 2 + ", hauteur " + c + ")" : "boule (rayon " + c / 2 + ")") + " " + M("\\approx " + D(Vs, 0.01)) + " : air " + M("\\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: cyl ? "cylindre-cube" : "boule-cube", round: 0.01, guide: [G("Volume du cube ?", c ** 3, M(c + "^3 = " + N(c ** 3)) + "."), G("Volume " + (cyl ? "du cylindre" : "de la boule") + " (rayon " + c / 2 + ", au centième) ?", Vs, M(D(Vs, 0.01)) + ".", 0.01), G("Volume d'air (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR(Vs, "On demande l'espace vide : cube − solide."), TR(c ** 3 - (cyl ? PI * c * c * c : (4 / 3) * PI * c ** 3), "Le rayon vaut la moitié de l'arête.")] }); },
      () => { const c = pk([6, 8, 10, 12]), a = R.int(Math.ceil(c / Math.SQRT2) + 2, c + 6), h = Math.sqrt(a * a - (c * c) / 2), V = (c * c * h) / 3;
        return QN("Une pyramide régulière a une base carrée de côté " + M(c + "\\text{ cm}") + " et des arêtes latérales de " + M(a + "\\text{ cm}") + ". Calcule son volume (au centième).", V, "Demi-diagonale " + M("\\frac{" + c + "\\sqrt{2}}{2} \\approx " + D(c / Math.SQRT2, 0.01)) + " ; hauteur " + M("h = \\sqrt{" + a + "^2 - " + N((c * c) / 2) + "} \\approx " + D(h, 0.01)) + " ; " + M("V = \\frac{" + c * c + " \\cdot h}{3} \\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: "pythagore", round: 0.01, guide: [G("Demi-diagonale de la base (au centième) ?", c / Math.SQRT2, M("\\frac{" + c + "\\sqrt{2}}{2} \\approx " + D(c / Math.SQRT2, 0.01)) + ".", 0.01), G("Hauteur (Pythagore, au centième) ?", h, M("\\sqrt{" + a * a + " - " + N((c * c) / 2) + "} \\approx " + D(h, 0.01)) + ".", 0.01), G("Volume (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR((c * c * a) / 3, "L'arête latérale n'est pas la hauteur : utilise Pythagore."), TR(c * c * h, "Pyramide : divise par 3."), TR((c * c * Math.sqrt(a * a - (c * c) / 4)) / 3, "Le pied de la hauteur est le centre du carré : demi-diagonale, pas demi-côté.")] }); },
      () => { const [r0, h0, g0] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [4, 3, 5], [12, 5, 13]]), k = pk([1, 2]), r = r0 * k, h = h0 * k, g = g0 * k, V = (PI * r * r * h) / 3;
        return QN("Un cône a un rayon de " + M(r + "\\text{ cm}") + " et une génératrice de " + M(g + "\\text{ cm}") + ". Calcule son volume (au centième).", V, "Hauteur " + M("h = \\sqrt{" + g + "^2 - " + r + "^2} = " + h) + " ; " + M("V = \\frac{\\pi \\cdot " + r * r + " \\cdot " + h + "}{3} = " + N((r * r * h) / 3) + "\\pi \\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: "generatrice", round: 0.01, guide: [G("Hauteur (Pythagore) ?", h, M("\\sqrt{" + g * g + " - " + r * r + "} = " + h) + "."), G("Volume (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR((PI * r * r * g) / 3, "La génératrice n'est pas la hauteur : utilise Pythagore."), TR(PI * r * r * h, "Cône : divise par 3.")] }); },
    ],
  };

  // ===================================== D2. similmp : similitude =====================================
  const SI = {
    1: [
      () => { /* audit niveau 25.11 : « triangles semblables, côté correspondant » (Thalès, MP 1re S2.GE.06) -> rapport des aires connu, longueur cherchée (S6.VS.05) */
        const k = pk([1.5, 2, 2.5, 3, 4]), A1 = 4 * R.int(2, 9), A2 = r6(A1 * k * k), m = R.int(3, 12); if (!Number.isInteger(A2) || !Number.isInteger(r6(m * k * 10))) return null;
        return QN("Deux figures semblables ont des aires de " + M(A1 + cm2) + " et " + M(A2 + cm2) + ". Un côté de la petite mesure " + M(m + "\\text{ cm}") + " : combien mesure le côté correspondant de la grande ?", m * k, "Rapport des aires " + M("k^2 = " + A2 + " \\div " + A1 + " = " + N(k * k)) + ", donc " + M("k = \\sqrt{" + N(k * k) + "} = " + N(k)) + " ; " + M(m + " \\cdot " + N(k) + " = " + N(m * k)) + " cm.",
          { ctx: "aires-vers-longueur", guide: [G("Rapport des aires " + M("k^2") + " (grande ÷ petite) ?", k * k, M(A2 + " \\div " + A1 + " = " + N(k * k)) + "."), G("Rapport des longueurs " + M("k") + " ?", k, M("\\sqrt{" + N(k * k) + "} = " + N(k)) + "."), G("Longueur cherchée (cm) ?", m * k, M(N(m * k)) + " cm.")],
            traps: [TR(m * k * k, "Les aires sont multipliées par k², les longueurs seulement par k = √(" + T(k * k) + ")."), TR(m / k, "La grande figure a des côtés plus longs : on multiplie par k."), TR(m + A2 - A1, "Agrandissement : on multiplie, on n'ajoute pas.")] }); },
      () => { const k = pk([2, 3, 4, 5, 1.5, 0.5]), A1 = R.int(3, 20), A2 = A1 * k * k;
        return QN("On " + (k > 1 ? "agrandit" : "réduit") + " une figure d'aire " + M(A1 + cm2) + " : toutes ses longueurs sont multipliées par " + M(N(k)) + ". Quelle est l'aire de la nouvelle figure ?", A2, "Les aires sont multipliées par " + M("k^2 = " + N(k * k)) + " : " + M(A1 + " \\cdot " + N(k * k) + " = " + N(A2) + cm2) + ".",
          { ctx: "aire", guide: [G("Facteur des aires " + M("k^2") + " ?", k * k, M(N(k * k)) + "."), G("Nouvelle aire ?", A2, M(N(A2) + cm2) + ".")],
            traps: [TR(A1 * k, "Les aires sont multipliées par k², pas par k."), TR(A1 * k ** 3, "k³, c'est pour les volumes.")] }); },
      () => { const k = pk([2, 3, 0.5, 1.5, 4]), V1 = R.int(2, 30), V2 = V1 * k ** 3;
        return QN("On " + (k > 1 ? "agrandit" : "réduit") + " un solide de volume " + M(V1 + cm3) + " : ses longueurs sont multipliées par " + M(N(k)) + ". Quel est le nouveau volume ?", V2, "Les volumes sont multipliés par " + M("k^3 = " + N(k ** 3)) + " : " + M(V1 + " \\cdot " + N(k ** 3) + " = " + N(V2) + cm3) + ".",
          { ctx: "volume", guide: [G("Facteur des volumes " + M("k^3") + " ?", k ** 3, M(N(k ** 3)) + "."), G("Nouveau volume ?", V2, M(N(V2) + cm3) + ".")],
            traps: [TR(V1 * k, "Les volumes sont multipliés par k³."), TR(V1 * k * k, "k², c'est pour les aires ; les volumes : k³."), TR(V1 * 3 * k, "k³ = k · k · k, pas 3k.")] }); },
    ],
    2: [
      () => { const [h1, V1, h2] = pk([[20, 0.4, 30], [10, 0.05, 20], [15, 0.2, 30], [24, 1, 12], [30, 1.5, 15], [20, 0.5, 10]]) /* 26.11 (vraisemblance) : hauteur et contenance cohérentes (1,5 L ≈ 30 cm, et non 20 cm) */, k = h2 / h1, V2 = V1 * k ** 3;
        return QN("Deux bouteilles semblables mesurent " + M(h1 + "\\text{ cm}") + " et " + M(h2 + "\\text{ cm}") + " de haut. La première contient " + M(N(V1) + "\\text{ L}") + ". Combien contient la seconde (en L) ?", V2, M("k = " + h2 + " \\div " + h1 + " = " + N(k)) + ", " + M("k^3 = " + N(k ** 3)) + " : " + M(N(V1) + " \\cdot " + N(k ** 3) + " = " + N(V2) + "\\text{ L}") + ".",
          { ctx: "bouteilles", guide: [G("Rapport " + M("k") + " (seconde ÷ première) ?", k, M(N(k)) + "."), G(M("k^3") + " ?", k ** 3, M(N(k ** 3)) + "."), G("Contenance (L) ?", V2, M(N(V2)) + " L.")],
            traps: [TR(V1 * k, "Les volumes varient comme k³."), TR(V1 * k * k, "k² pour les aires ; k³ pour les volumes.")] }); },
      () => { const n = pk([1000, 2000, 5000, 10000, 25000, 50000]), a = R.int(2, 12), m2 = (a * n * n) / 1e4, ha = n >= 25000;
        return QN("Sur une carte au " + M("1\\,:\\," + N(n)) + ", un terrain couvre " + M(a + cm2) + ". Quelle est sa surface réelle (en " + (ha ? "hectares" : "m²") + ") ?", ha ? m2 / 1e4 : m2, "Les aires sont multipliées par " + M(N(n) + "^2") + " : " + M(a + " \\cdot " + N(n * n) + " = " + N(a * n * n) + cm2 + " = " + N(m2) + "\\text{ m}^2") + (ha ? " " + M("= " + N(m2 / 1e4) + "\\text{ ha}") : "") + ".",
          { ctx: "carte", guide: [G("Facteur des aires " + M(N(n) + "^2") + " ?", n * n, M(N(n * n)) + "."), G("Surface réelle en m² (1 m² = 10'000 cm²) ?", m2, M(N(m2)) + " m².")].concat(ha ? [G("En hectares (1 ha = 10'000 m²) ?", m2 / 1e4, M(N(m2 / 1e4)) + " ha.")] : []),
            traps: [TR(ha ? (a * n) / 1e8 : (a * n) / 1e4, "Les aires sont multipliées par k² = " + T(n) + "²."), TR(ha ? m2 / 100 : m2 * 100, "1 m² = 10'000 cm².")] }); },
      () => { const f = pk([1 / 2, 2 / 3, 3 / 4, 1 / 3, 4 / 5, 3 / 5]), v = 100 * f ** 3;
        return QN("Un verre conique (pointe en bas) est rempli jusqu'aux " + M(fT(f)) + " de sa hauteur. Quel pourcentage du verre est rempli (au dixième) ?", v, "Le liquide forme un cône semblable, de rapport " + M(fT(f)) + " : volume " + M("\\left(" + fT(f) + "\\right)^3 = " + fT(f ** 3) + " \\approx " + D(v, 0.1) + "\\,\\%") + ".",
          { ctx: "verre", round: 0.1, guide: [G("Rapport de similitude (liquide ÷ verre) ?", f, M(fT(f)) + "."), G("Fraction du volume " + M("k^3") + " ?", f ** 3, M(fT(f ** 3)) + "."), G("En pourcentage (au dixième) ?", v, M(D(v, 0.1) + "\\,\\%") + ".", 0.1)],
            traps: [TR(100 * f, "Le volume n'est pas proportionnel à la hauteur : k³."), TR(100 * f * f, "k², c'est pour les aires.")] }); },
      () => { const [H1, M1] = pk([[2, 800], [3, 1350], [1.6, 640], [2.4, 1728], [2, 1200]]), k = pk([0.5, 0.25, 0.2]), H2 = H1 * k, paint = R.rand() < 0.4, P1 = pk([2, 3, 4, 5]);
        if (paint) return QN("Il faut " + M(P1 + "\\text{ L}") + " de peinture pour peindre une statue de " + M(N(H1) + "\\text{ m}") + ". Combien en faut-il pour une copie semblable de " + M(N(H2 * 100) + "\\text{ cm}") + " (en L) ?", P1 * k * k, M("k = " + fT(k)) + " ; la surface varie comme " + M("k^2 = " + fT(k * k)) + " : " + M(P1 + " \\cdot " + fT(k * k) + " = " + N(P1 * k * k) + "\\text{ L}") + ".",
          { ctx: "statue-peinture", guide: [G("Rapport " + M("k") + " (copie ÷ statue, fraction) ?", k, M(fT(k)) + " (attention aux unités)."), G("Facteur des surfaces ?", k * k, M(fT(k * k)) + "."), G("Peinture (L) ?", P1 * k * k, M(N(P1 * k * k)) + " L.")], traps: [TR(P1 * k, "La peinture couvre une surface : k²."), TR(P1 * k ** 3, "k³, c'est pour le volume (la masse).")] });
        return QN("Une statue de " + M(N(H1) + "\\text{ m}") + " pèse " + M(N(M1) + "\\text{ kg}") + ". Quelle est la masse d'une copie semblable, dans le même matériau, de " + M(N(H2 * 100) + "\\text{ cm}") + " (en kg) ?", M1 * k ** 3, M("k = " + fT(k)) + " ; la masse varie comme le volume, " + M("k^3 = " + fT(k ** 3)) + " : " + M(N(M1) + " \\cdot " + fT(k ** 3) + " = " + N(M1 * k ** 3) + "\\text{ kg}") + ".",
          { ctx: "statue-masse", guide: [G("Rapport " + M("k") + " (copie ÷ statue, fraction) ?", k, M(fT(k)) + " (attention aux unités)."), G("Facteur des volumes ?", k ** 3, M(fT(k ** 3)) + "."), G("Masse (kg) ?", M1 * k ** 3, M(N(M1 * k ** 3)) + " kg.")], traps: [TR(M1 * k, "La masse varie comme le volume : k³."), TR(M1 * k * k, "k² pour les surfaces ; la masse suit le volume : k³.")] }); },
    ],
    3: [
      () => { const [p, q] = pk([[2, 3], [3, 4], [1, 2], [3, 5], [4, 5], [2, 5], [1, 3]]), m = R.int(1, 4), V1 = m * p ** 3, V2 = m * q ** 3;
        return QN("Deux cônes semblables ont des volumes de " + M(V1 + cm3) + " et " + M(V2 + cm3) + ". Quel est le rapport de leurs hauteurs (petit ÷ grand) ? (fraction)", p / q, M("k^3 = \\frac{" + V1 + "}{" + V2 + "} = " + fT(p ** 3 / q ** 3)) + ", donc " + M("k = \\sqrt[3]{" + fT(p ** 3 / q ** 3) + "} = " + fT(p / q)) + ".",
          { ctx: "volumes-vers-k", guide: [G("Rapport des volumes (fraction simplifiée) ?", p ** 3 / q ** 3, M(fT(p ** 3 / q ** 3)) + "."), G("Rapport des hauteurs (racine cubique) ?", p / q, M(fT(p / q)) + ".")],
            traps: [TR(p ** 3 / q ** 3, "C'est k³ : prends la racine cubique."), TR(Math.sqrt(p ** 3 / q ** 3), "Volumes : racine cubique (pas carrée)."), TR(q / p, "Petit ÷ grand : le rapport est plus petit que 1.")] }); },
      () => { const [p, q] = pk([[2, 3], [3, 4], [1, 2], [3, 5], [2, 5], [4, 3], [3, 2]]), A1 = p * p * R.int(1, 3), A2 = (A1 * q * q) / (p * p), V1 = p ** 3 * R.int(1, 4), V2 = (V1 * q ** 3) / p ** 3;
        return QN("Deux boîtes semblables ont des surfaces de " + M(A1 + cm2) + " et " + M(A2 + cm2) + ". La première a un volume de " + M(V1 + cm3) + ". Quel est le volume de la seconde ?", V2, M("k^2 = \\frac{" + A2 + "}{" + A1 + "} = " + fT((q * q) / (p * p))) + ", " + M("k = " + fT(q / p)) + ", " + M("k^3 = " + fT(q ** 3 / p ** 3)) + " : " + M("V = " + V1 + " \\cdot " + fT(q ** 3 / p ** 3) + " = " + N(V2) + cm3) + ".",
          { ctx: "aires-vers-volumes", guide: [G(M("k^2") + " (rapport des surfaces, fraction) ?", (q * q) / (p * p), M(fT((q * q) / (p * p))) + "."), G(M("k") + " ?", q / p, M(fT(q / p)) + "."), G("Volume de la seconde ?", V2, M(N(V2) + cm3) + ".")],
            traps: [TR((V1 * q * q) / (p * p), "Pour les volumes, on utilise k³, pas k²."), TR((V1 * q) / p, "Volumes : k³.")] }); },
      () => { const m = pk([2, 3, 5, 10, 0.5, 4]), r = pk([5, 10, 12, 20]), k = Math.cbrt(m), v = r * k;
        return QN("On veut " + (m === 0.5 ? "diviser par 2" : "multiplier par " + m) + " le volume d'un ballon sphérique de rayon " + M(r + "\\text{ cm}") + ". Quel doit être le nouveau rayon (au centième) ?", v, M("k^3 = " + N(m)) + ", " + M("k = \\sqrt[3]{" + N(m) + "} \\approx " + D(k, 0.001)) + " : " + M(r + " \\cdot " + D(k, 0.001) + " \\approx " + D(v, 0.01)) + " cm.",
          { ctx: "multiplier-volume", round: 0.01, guide: [G("Facteur des volumes " + M("k^3") + " ?", m, M(N(m)) + "."), G(M("k") + " (racine cubique, au millième) ?", k, M(D(k, 0.001)) + ".", 0.001), G("Nouveau rayon (au centième) ?", v, M(D(v, 0.01)) + " cm.", 0.01)],
            traps: [TR(r * m, "Multiplier le rayon par k multiplie le volume par k³ : prends la racine cubique."), TR(r * Math.sqrt(m), "Volumes : racine cubique, pas carrée.")] }); },
      () => { const f = pk([1 / 2, 1 / 3, 2 / 3]), V = pk([270, 540, 81, 216, 1080]), Vt = V * (1 - f ** 3);
        return QN("Un cône a un volume de " + M(V + cm3) + ". On le coupe par un plan parallèle à la base, aux " + M(fT(f)) + " de sa hauteur depuis la pointe. Quel est le volume du tronc de cône restant (la partie du bas) ?", Vt, "Le petit cône est semblable, rapport " + M(fT(f)) + " : volume " + M(V + " \\cdot " + fT(f ** 3) + " = " + N(V * f ** 3)) + ". Tronc : " + M(V + " - " + N(V * f ** 3) + " = " + N(Vt) + cm3) + ".",
          { ctx: "tronc", guide: [G("Fraction du volume du petit cône (" + M("k^3") + ") ?", f ** 3, M(fT(f ** 3)) + "."), G("Volume du petit cône ?", V * f ** 3, M(N(V * f ** 3)) + "."), G("Volume du tronc ?", Vt, M(N(Vt) + cm3) + ".")],
            traps: [TR(V * (1 - f), "Les volumes varient comme k³."), TR(V * f ** 3, "C'est le petit cône ; le tronc est grand − petit.")] }); },
    ],
  };

  // ===================================== problèmes en plusieurs étapes (niveau 4) =====================================
  const PROBS = {
    eqabs: () => P("On résout l'équation |2x − 3| = 7.", [["a) Plus petite solution", -2], ["b) Plus grande solution", 5], ["c) Plus grande solution de |2x − 3| = x", 3]], ["2x − 3 = 7 ou 2x − 3 = −7.", "Pour c), vérifie que x ≥ 0."], "a) −2 ; b) 5 ; c) " + M("2x - 3 = x") + " donne 3, " + M("2x - 3 = -x") + " donne 1 (les deux conviennent) : la plus grande est 3."),
    eqbic: () => P("On résout x⁴ − 10x² + 9 = 0 en posant X = x².", [["a) Plus petite solution en X", 1], ["b) Plus grande solution en X", 9], ["c) Nombre de solutions en x", 4]], ["X² − 10X + 9 = 0.", "x² = 1 ou x² = 9."], "a) 1 ; b) 9 ; c) " + M("x = \\pm 1") + " et " + M("x = \\pm 3") + " : 4 solutions."),
    eqirrmp: () => P("On résout √(x + 7) = x + 1.", [["a) Condition : x doit être au moins", -1], ["b) Plus petite solution de l'équation élevée au carré", -3], ["c) Solution retenue", 2]], ["x + 1 ≥ 0.", "x + 7 = x² + 2x + 1."], "a) " + M("x \\ge -1") + " ; b) " + M("x^2 + x - 6 = 0") + " : −3 ou 2 ; c) −3 est parasite, " + M("S = \\{2\\}") + "."),
    eqratmp: () => P("On résout 5/(x + 2) + 4/(x − 1) = 0.", [["a) Plus petite valeur interdite", -2], ["b) Coefficient de x après multiplication par (x + 2)(x − 1)", 9], ["c) Solution (fraction)", -1 / 3]], ["Les dénominateurs s'annulent.", "5(x − 1) + 4(x + 2) = 0."], "a) −2 (et 1) ; b) " + M("9x + 3 = 0") + " ; c) " + M("x = -\\frac{1}{3}") + "."),
    puisrat: () => P("On considère 27^(2/3) et 16^(−3/4).", [["a) 27^(2/3)", 9], ["b) 16^(−3/4) (fraction)", 1 / 8], ["c) Produit des deux (fraction)", 9 / 8]], ["Racine cubique de 27, puis au carré.", "Racine 4e de 16 = 2."], "a) " + M("3^2 = 9") + " ; b) " + M("\\frac{1}{2^3} = \\frac{1}{8}") + " ; c) " + M("\\frac{9}{8}") + "."),
    logdef: () => P("On travaille avec le logarithme en base 2.", [["a) log₂ 32", 5], ["b) log₂(1/8)", -3], ["c) x tel que log₂ x = 6", 64]], ["2⁵ = 32.", "1/8 = 2^(−3)."], "a) 5 ; b) −3 ; c) " + M("x = 2^6 = 64") + "."),
    logprop: () => P("On sait que log 2 ≈ 0,301.", [["a) log 8 (au centième)", 0.903, 0.01], ["b) log 5 (au centième)", 0.699, 0.01], ["c) log 40 (au centième)", 1.602, 0.01]], ["8 = 2³.", "5 = 10 ÷ 2."], "a) " + M("3 \\cdot 0{,}301 \\approx 0{,}90") + " ; b) " + M("1 - 0{,}301 \\approx 0{,}70") + " ; c) " + M("2 \\cdot 0{,}301 + 1 \\approx 1{,}60") + "."),
    eqexp: () => P("On résout 4^x − 6 · 2^x + 8 = 0 en posant X = 2^x.", [["a) Plus petite solution en X", 2], ["b) Plus grande solution en X", 4], ["c) Somme des solutions en x", 3]], ["4^x = (2^x)².", "2^x = 2 ou 2^x = 4."], "a) 2 ; b) 4 ; c) " + M("x = 1") + " ou " + M("x = 2") + ", somme 3."),
    eqlog: () => P("On résout log x + log(x − 3) = 1.", [["a) Domaine : x doit être plus grand que", 3], ["b) Plus grande solution de x(x − 3) = 10", 5], ["c) Plus petite solution de x(x − 3) = 10 (rejetée)", -2]], ["Les deux logarithmes doivent exister.", "x² − 3x − 10 = 0."], "a) 3 ; b) 5 ; c) −2, hors domaine : " + M("S = \\{5\\}") + "."),
    croissexp: () => P("Un capital de 5'000 CHF est placé à 2 % d'intérêts composés.", [["a) Valeur après 10 ans (au centime)", 5000 * 1.02 ** 10, 0.01], ["b) n = log 2 ÷ log 1,02 (au centième)", l10(2) / l10(1.02), 0.01], ["c) Nombre d'années entières pour doubler", 36]], ["5'000 · 1,02^10.", "1,02^n = 2."], "a) " + M("\\approx 6\\text{'}094{,}97") + " CHF ; b) " + M("\\approx 35{,}00") + " ; c) après 35 ans il manque quelques centimes : 36 ans."),
    volmp: () => P("Un silo est un cylindre de rayon 3 m et de hauteur 8 m, surmonté d'un cône de même rayon et de hauteur 4 m.", [["a) Volume du cylindre (m³, au centième)", 72 * PI, 0.01], ["b) Volume du cône (m³, au centième)", 12 * PI, 0.01], ["c) Volume total (m³, à l'unité)", 84 * PI, 1]], ["π · 3² · 8.", "π · 3² · 4 ÷ 3."], "a) " + M("72\\pi \\approx 226{,}19") + " ; b) " + M("12\\pi \\approx 37{,}70") + " ; c) " + M("84\\pi \\approx 264") + " m³."),
    similmp: () => P("Un verre conique de 12 cm de haut contient 0,3 L quand il est plein.", [["a) Rapport de similitude si on le remplit jusqu'à 6 cm", 0.5], ["b) Volume de liquide alors (L)", 0.0375], ["c) Hauteur pour qu'il soit à moitié plein (cm, au dixième)", 12 * Math.cbrt(0.5), 0.1]], ["6 ÷ 12.", "Volumes : k³."], "a) 0,5 ; b) " + M("0{,}3 \\cdot 0{,}125 = 0{,}0375") + " L ; c) " + M("k^3 = 0{,}5") + ", " + M("k \\approx 0{,}794") + ", " + M("h \\approx 9{,}5") + " cm."),
  };

  // ===================================== enregistrement =====================================
  const NEW = [
    { id: "eqabs", th: "EA", sem: "S5", theme: "fa", label: "Équations avec valeur absolue", ex: "|x - 3| = 5 \\iff x = -2 \\text{ ou } x = 8", lv: ABS,
      hint: "|A| = c (c > 0) : A = c ou A = −c. |A| = |B| : A = B ou A = −B. Si c < 0 : pas de solution. Si l'inconnue est à droite, vérifie que le membre de droite est ≥ 0.",
      lesson: ["Valeur absolue", "La valeur absolue est une distance : jamais négative.", "\\(|a - b|\\) est la distance entre \\(a\\) et \\(b\\). Pour \\(|A| = c\\) : si \\(c < 0\\), aucune solution ; sinon \\(A = c\\) ou \\(A = -c\\). Pour \\(|A| = |B|\\) : \\(A = B\\) ou \\(A = -B\\). Si le membre de droite contient \\(x\\), on garde seulement les solutions qui le rendent positif ou nul.",
        ["\\(|x - 3| = 5\\) : \\(x = 8\\) ou \\(x = -2\\)", "\\(|2x - 5| = |x + 1|\\) : \\(x = 6\\) ou \\(x = \\frac{4}{3}\\)"], "\\(|x + 4| = -2\\) n'a pas de solution : une valeur absolue n'est jamais négative."],
      comps: ["Résoudre |A| = c", "Résoudre |A| = |B| ou une équation sans solution", "Résoudre une équation avec vérification (|A| = B, |x² − a| = c)"] },
    { id: "eqbic", th: "EA", sem: "S5", theme: "fa", label: "Équations bicarrées, changement de variable", ex: "x^4 - 13x^2 + 36 = 0", lv: BIC,
      hint: "Pose X = x² (ou l'expression qui se répète), résous en X, puis reviens à x : x² = X donne ±√X si X ≥ 0, rien si X < 0.",
      lesson: ["Changement de variable", "Une équation de degré 4 peut cacher une équation de degré 2.", "Bicarrée \\(ax^4 + bx^2 + c = 0\\) : on pose \\(X = x^2\\), on résout \\(aX^2 + bX + c = 0\\), puis on revient à \\(x\\) (\\(x^2 = X\\)). Même idée avec \\(X = x^3\\), \\(X = \\sqrt{x}\\) ou \\(X = x^2 - 2x\\).",
        ["\\(x^4 - 13x^2 + 36 = 0\\) : \\(X = 4\\) ou \\(9\\), \\(S = \\{-3 ; -2 ; 2 ; 3\\}\\)", "\\(x - 5\\sqrt{x} + 6 = 0\\) : \\(\\sqrt{x} = 2\\) ou \\(3\\), \\(S = \\{4 ; 9\\}\\)"], "N'oublie pas de revenir à \\(x\\), et rejette \\(X < 0\\) quand \\(X = x^2\\) ou \\(X = \\sqrt{x}\\)."],
      comps: ["Résoudre une équation bicarrée", "Choisir un changement de variable (x³, √x, x + b)", "Résoudre avec X = x² + bx ou un coefficient devant x⁴"] },
    { id: "eqirrmp", th: "EA", sem: "S5", theme: "fa", label: "Équations irrationnelles", ex: "\\sqrt{2x - 1} = x - 2", lv: IRR,
      hint: "Isole la racine, pose les conditions (sous la racine ≥ 0, membre de droite ≥ 0), élève au carré, résous, puis vérifie chaque solution : il peut y avoir des solutions parasites.",
      lesson: ["Équations irrationnelles", "L'inconnue est sous une racine carrée.", "1. Isoler une racine. 2. Conditions : radicande \\(\\ge 0\\) et membre égal à la racine \\(\\ge 0\\). 3. Élever au carré et résoudre. 4. Vérifier chaque solution dans l'équation de départ : élever au carré peut ajouter des solutions parasites.",
        ["\\(\\sqrt{2x - 1} = x - 2\\) : \\(x^2 - 6x + 5 = 0\\), \\(x = 1\\) (parasite) ou \\(x = 5\\) : \\(S = \\{5\\}\\)"], "\\(\\sqrt{x - 1} = -3\\) n'a pas de solution : une racine n'est jamais négative."],
      comps: ["Résoudre √A = c ou √A = √B", "Résoudre avec une solution parasite", "Résoudre avec deux racines ou utiliser une formule"] },
    { id: "eqratmp", th: "EA", sem: "S5", theme: "fa", label: "Équations rationnelles", ex: "\\frac{5}{x + 2} + \\frac{4}{x - 1} = 0", lv: RAT,
      hint: "Cherche d'abord les valeurs interdites (dénominateurs nuls), multiplie par le dénominateur commun, résous, puis rejette les valeurs interdites.",
      lesson: ["Équations rationnelles", "L'inconnue est au dénominateur.", "1. Valeurs interdites : celles qui annulent un dénominateur (factorise-le). 2. Multiplier les deux membres par le dénominateur commun. 3. Résoudre l'équation obtenue. 4. Rejeter les solutions interdites.",
        ["\\(\\frac{5}{x + 2} + \\frac{4}{x - 1} = 0\\) : \\(5(x - 1) + 4(x + 2) = 0\\), \\(x = -\\frac{1}{3}\\)"], "Une solution égale à une valeur interdite n'est pas une solution."],
      comps: ["Trouver les valeurs interdites, résoudre a ÷ (x − b) = c", "Résoudre une équation rationnelle (produit en croix, somme nulle)", "Résoudre avec rejet ; problèmes (vitesse, travail en commun)"] },
    { id: "puisrat", th: "PL", sem: "S5", theme: "no", label: "Puissances d'exposant rationnel", ex: "27^{\\frac{2}{3}} = \\left(\\sqrt[3]{27}\\right)^2 = 9", lv: PR,
      hint: "a^(p/q) = (racine q-ième de a)^p. a^(−n) = 1/a^n. Produit : on additionne les exposants ; quotient : on les soustrait ; puissance de puissance : on les multiplie.",
      lesson: ["Exposants rationnels", "Une racine est une puissance d'exposant fractionnaire.", "\\(\\sqrt[q]{a} = a^{\\frac{1}{q}}\\) et \\(\\sqrt[q]{a^p} = a^{\\frac{p}{q}}\\) (\\(a > 0\\)). \\(a^{-n} = \\frac{1}{a^n}\\). Mêmes règles qu'avec les entiers : \\(a^r a^s = a^{r + s}\\), \\(\\frac{a^r}{a^s} = a^{r - s}\\), \\((a^r)^s = a^{rs}\\).",
        ["\\(16^{\\frac{3}{4}} = 2^3 = 8\\)", "\\(\\sqrt[3]{x^2} = x^{\\frac{2}{3}}\\)", "\\(x \\sqrt{x} = x^{\\frac{3}{2}}\\)"], "L'indice de la racine va au dénominateur de l'exposant ; un exposant négatif donne l'inverse, pas un nombre négatif."],
      comps: ["Calculer une puissance d'exposant rationnel, passer d'une racine à une puissance", "Calculer avec des exposants négatifs ou fractionnaires", "Simplifier, résoudre x^(p/q) = c"] },
    { id: "logdef", th: "PL", sem: "S5", theme: "no", label: "Logarithmes : définition et calcul", ex: "\\log_2 8 = 3 \\iff 2^3 = 8", lv: LD,
      hint: "log_b N est l'exposant x tel que b^x = N. log = log en base 10. À la calculatrice : log_b N = log N ÷ log b.",
      lesson: ["Logarithme", "Le logarithme répond à la question « à quelle puissance ? ».", "Pour \\(b > 0\\), \\(b \\ne 1\\) et \\(N > 0\\) : \\(\\log_b N = x \\iff b^x = N\\). \\(\\log\\) (sans base) est le logarithme en base 10. Changement de base (calculatrice) : \\(\\log_b N = \\frac{\\log N}{\\log b}\\).",
        ["\\(\\log_3 81 = 4\\) car \\(3^4 = 81\\)", "\\(\\log 0{,}01 = -2\\)", "\\(\\log_4 2 = \\frac{1}{2}\\)"], "Le logarithme est un exposant : \\(\\log_2 8 = 3\\), pas \\(4\\) (8 ÷ 2)."],
      comps: ["Calculer un logarithme simple, trouver x tel que log_b x = n", "Calculer un logarithme négatif ou fractionnaire, trouver la base", "Utiliser la calculatrice (changement de base, pH, décibels)"] },
    { id: "logprop", th: "PL", sem: "S5", theme: "no", label: "Propriétés des logarithmes", ex: "\\log a + \\log b = \\log(ab)", lv: LP,
      hint: "log(ab) = log a + log b ; log(a ÷ b) = log a − log b ; log(a^n) = n log a ; log_b N = log N ÷ log b.",
      lesson: ["Propriétés des logarithmes", "Les logarithmes transforment produits en sommes.", "\\(\\log(ab) = \\log a + \\log b\\), \\(\\log\\frac{a}{b} = \\log a - \\log b\\), \\(\\log(a^n) = n \\log a\\) (vrai dans toute base). Changement de base : \\(\\log_b N = \\frac{\\log N}{\\log b}\\).",
        ["\\(\\log 50 + \\log 2 = \\log 100 = 2\\)", "\\(\\log 8 = 3\\log 2 \\approx 0{,}903\\)"], "\\(\\log(a + b) \\ne \\log a + \\log b\\)."],
      comps: ["Utiliser log(ab), log(a ÷ b) et n log a", "Calculer à partir de log 2, développer un logarithme", "Combiner les propriétés (un seul log, changement de base)"] },
    { id: "eqexp", th: "EL", sem: "S6", theme: "fa", label: "Équations exponentielles", ex: "2^{x + 1} = 16 \\iff x = 3", lv: EX,
      hint: "Même base : égalise les exposants. Sinon : prends le logarithme, x = log c ÷ log b. Si b^x revient deux fois, pose X = b^x (X > 0).",
      lesson: ["Équations exponentielles", "L'inconnue est dans l'exposant.", "Si les deux membres s'écrivent avec la même base : \\(b^A = b^B \\iff A = B\\). Sinon, on isole \\(b^x\\) et on prend le logarithme : \\(b^x = c \\iff x = \\frac{\\log c}{\\log b}\\). Avec \\(b^{2x}\\) et \\(b^x\\), on pose \\(X = b^x > 0\\).",
        ["\\(3^{2x - 1} = 27\\) : \\(2x - 1 = 3\\), \\(x = 2\\)", "\\(2^x = 5\\) : \\(x = \\frac{\\log 5}{\\log 2} \\approx 2{,}322\\)"], "Une puissance \\(b^x\\) est toujours positive : \\(b^x = -2\\) est impossible."],
      comps: ["Résoudre avec la même base", "Utiliser une base commune, le logarithme ou une factorisation", "Résoudre par changement de variable ou avec deux bases différentes"] },
    { id: "eqlog", th: "EL", sem: "S6", theme: "fa", label: "Équations logarithmiques", ex: "\\log_2(x - 1) = 3 \\iff x = 9", lv: ELG,
      hint: "Domaine : ce qui est dans un logarithme doit être > 0. log_b A = k donne A = b^k. Regroupe avec les propriétés, résous, puis rejette ce qui sort du domaine.",
      lesson: ["Équations logarithmiques", "L'inconnue est dans un logarithme.", "1. Domaine : chaque argument de logarithme doit être strictement positif. 2. Se ramener à \\(\\log_b A = k\\) (propriétés) puis \\(A = b^k\\), ou à \\(\\log_b A = \\log_b B\\) puis \\(A = B\\). 3. Résoudre et garder les solutions du domaine.",
        ["\\(\\log x + \\log(x - 3) = 1\\) : \\(x(x - 3) = 10\\), \\(x = 5\\) (\\(-2\\) rejetée)"], "Vérifie toujours le domaine : une solution peut rendre un argument négatif."],
      comps: ["Résoudre log_b A = k", "Résoudre en regroupant les logarithmes (domaine)", "Résoudre par changement de variable ; décibels, séismes"] },
    { id: "croissexp", th: "EL", sem: "S6", theme: "fa", label: "Croissance et décroissance exponentielles", ex: "C_n = C_0 \\cdot (1 + t)^n", lv: CR,
      hint: "Augmentation de t % par période : facteur 1 + t ; diminution : 1 − t. Après n périodes : valeur initiale · facteur^n. Pour trouver n : logarithme.",
      lesson: ["Modèle exponentiel", "Une grandeur multipliée par le même facteur à chaque période.", "\\(f(n) = f_0 \\cdot q^n\\) : intérêts composés \\(q = 1 + t\\), dépréciation \\(q = 1 - t\\), doublement \\(2^{t/T}\\), demi-vie \\(0{,}5^{t/T}\\). Pour trouver la durée, on résout \\(q^n = k\\) avec le logarithme : \\(n = \\frac{\\log k}{\\log q}\\).",
        ["5'000 CHF à 2 % : \\(5\\text{'}000 \\cdot 1{,}02^n\\) ; doublement : \\(n = \\frac{\\log 2}{\\log 1{,}02} \\approx 35{,}003\\), donc 36 ans"], "Ce n'est pas linéaire : 10 ans à 2 % ne font pas 20 % de plus."],
      comps: ["Calculer une valeur après n périodes", "Trouver une durée (doublement, demi-vie)", "Trouver un taux ou un seuil"] },
    { id: "volmp", th: "VS", sem: "S6", theme: "gm", label: "Volumes des solides", ex: "V_{\\text{cône}} = \\frac{\\pi r^2 h}{3}", lv: VO,
      hint: "Prisme, cylindre : A_base · h. Pyramide, cône : A_base · h ÷ 3. Boule : 4/3 πr³. Solide composé : additionne ou soustrais les volumes. Hauteur manquante : Pythagore.",
      lesson: ["Volumes", "Quatre formules à connaître.", "Prisme et cylindre : \\(V = A_{\\text{base}} \\cdot h\\) (cylindre : \\(\\pi r^2 h\\)). Pyramide et cône : \\(V = \\frac{A_{\\text{base}} \\cdot h}{3}\\). Boule : \\(V = \\frac{4}{3}\\pi r^3\\). Pour un solide composé, on additionne (ou on soustrait) les volumes des parties.",
        ["Cylindre \\(r = 4\\), \\(h = 9\\) : \\(144\\pi \\approx 452{,}39 \\text{ cm}^3\\)", "Boule de diamètre 12 : \\(r = 6\\), \\(288\\pi \\approx 904{,}78 \\text{ cm}^3\\)"], "La hauteur d'un cône n'est pas sa génératrice, et le rayon est la moitié du diamètre."],
      comps: ["Calculer le volume d'un solide usuel", "Isoler une dimension dans une formule de volume", "Calculer le volume d'un solide composé (Pythagore si besoin)"] },
    { id: "similmp", th: "VS", sem: "S6", theme: "gm", label: "Similitude : rapports k, k², k³", ex: "\\frac{V_2}{V_1} = k^3", lv: SI,
      hint: "Si les longueurs sont multipliées par k : les aires par k², les volumes (et les masses) par k³. Pour remonter à k : racine carrée (aires) ou cubique (volumes).",
      lesson: ["Similitude", "Agrandir ou réduire en gardant la forme.", "Deux figures (ou solides) sont semblables si toutes les longueurs sont multipliées par le même rapport \\(k\\). Alors les aires sont multipliées par \\(k^2\\) et les volumes par \\(k^3\\).",
        ["Rayon doublé : surface × 4, volume × 8", "Verre conique rempli à mi-hauteur : \\(\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}\\) du volume"], "Le volume n'est pas proportionnel à la hauteur : à mi-hauteur, le verre n'est pas à moitié plein."],
      comps: ["Utiliser le rapport k, k² ou k³", "Résoudre un problème d'échelle (bouteilles, carte, verre)", "Remonter au rapport k ; tronc de cône"] },
  ];
  NEW.forEach((n, i) => {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: null, MP: [14, n.sem], FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[n.id] = {};
    if (typeof HINTS_EXTRA !== "undefined") HINTS_EXTRA[n.id] = n.hint;
    if (typeof LESSONS_EXTRA !== "undefined") LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = [PROBS[n.id]];
    if (typeof ORDRE !== "undefined") ORDRE.MP[n.id] = 49 + i;
    if (typeof ORDRE_THEME !== "undefined") ORDRE_THEME.MP[n.id] = n.th;
  });
})();

// MP 4e (grade 15, filière « mp ») · chantier G du 24.11 (agent mp34). Calé sur les polycopiés CFPT MP4
// (CFPT/MP4/Polycops de cours, chapitres E à J) et le référentiel MP (S7.CO, S7.VE, S7.DP, S8.IN, S8.FP, S8.FS).
// Neuf notions nouvelles (identifiants propres à la MP) :
//   E. coordmp (distance, milieu, polaires, espace) ; F. vectmp (composantes, opérations, norme, colinéarité),
//   scalmp (produit scalaire, angle, orthogonalité, travail) ; G. droiteparam (droites paramétriques) ;
//   H. ineqmp (inéquations, tableau des signes) ; I. fctmp (réciproque, parité, transformations, composition),
//   polymp (polynômes : zéros, division, signe) ; J. sinusmp (fonctions sinusoïdales), explogfn (fonctions exp. et log.).
// Ajout du 24.11 (agent mp4plus) : pvectmp (produit vectoriel, « facultatif » dans le polycopié MP4, chap. F, leçon 5) ;
//   question avec graphique « signe lu sur la courbe » dans ineqmp (N2) et polymp (N3).
// Ajouts du 24.11 (agent greste) : projmp (projection orthogonale), posdroites (position relative de deux droites),
//   fratmp (fonctions rationnelles simples) ; questions avec graphique (sinusoïde, exponentielle, hyperbole : FIG.plot).
// Même standard que src/ch_mp3.js, dont il reprend les outils (MP34H).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof window === "undefined" || !window.MP34H) return;
  const { pk, nz, r6, den, fS, N, T, fT, pT, sg, tm, polyT, lin, D, sortU, setT, mk, QN, QS, QX, QP, G, GSet, GX, GP, TR, TS, TX, TP, P } = window.MP34H;
  const l10 = Math.log10, PI = Math.PI, DEG = 180 / PI;
  const v2 = (a, b) => "\\begin{pmatrix} " + a + " \\\\ " + b + " \\end{pmatrix}";
  const v3 = (a, b, c) => "\\begin{pmatrix} " + a + " \\\\ " + b + " \\\\ " + c + " \\end{pmatrix}";
  const pt = (...c) => M("(" + c.map(fT).join(" \\,;\\, ") + ")");
  const ptN = (name, ...c) => M(name + "(" + c.map(fT).join(" \\,;\\, ") + ")");
  const PAIR = " Réponds « x ; y ».", TRIP = " Réponds « x ; y ; z ».";
  // inégalités et intervalles
  const QI = (q, op, value, sol, o) => mk(q, { kind: "ineq", op, value }, sol, o);
  const QSS = (q, ivs, sol, o) => mk(q, { kind: "solset", ivs }, sol, o);
  const GI = (ask, op, value, sol) => ({ ask, spec: { kind: "ineq", op, value }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: { kind: "solset", ivs }, sol });
  const TI = (op, value, m) => ({ spec: { kind: "ineq", op, value }, m });
  const TSS = (ivs, m) => ({ spec: { kind: "solset", ivs }, m });
  const opT = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" }, flip = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };
  const ivT = (ivs) => (typeof SolSet !== "undefined" ? SolSet.show(ivs, true) : "");
  const INF = Infinity;
  const TRI2 = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [8, 15, 17], [9, 12, 15]];
  const TRI3 = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 2, 1, 3]];
  const sgn = () => (R.rand() < 0.5 ? -1 : 1);
  const perm = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));

  // ===================================== E. coordmp : coordonnées =====================================
  const CO = {
    1: [
      () => { const [a, b, c] = pk(TRI2), dx = a * sgn(), dy = b * sgn(), x1 = R.int(-5, 5), y1 = R.int(-5, 5), x2 = x1 + dx, y2 = y1 + dy;
        return QN("Calcule la distance entre " + ptN("A", x1, y1) + " et " + ptN("B", x2, y2) + ".", c, M("AB = \\sqrt{(" + x2 + " - " + pT(x1) + ")^2 + (" + y2 + " - " + pT(y1) + ")^2} = \\sqrt{" + a * a + " + " + b * b + "} = " + c) + ".",
          { ctx: "distance-plan", guide: [G("Écart horizontal " + M("x_B - x_A") + " ?", dx, M(dx) + "."), G("Écart vertical " + M("y_B - y_A") + " ?", dy, M(dy) + "."), G("Distance ?", c, M("\\sqrt{" + dx * dx + " + " + dy * dy + "} = " + c) + ".")],
            traps: [TR(Math.abs(dx) + Math.abs(dy), "On n'additionne pas les écarts : Pythagore, √(Δx² + Δy²)."), TR(c * c, "N'oublie pas la racine carrée."), TR(Math.hypot(x1 + x2, y1 + y2), "On soustrait les coordonnées (écarts), on ne les additionne pas.")] }); },
      () => { const x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = R.int(-6, 6), y2 = R.int(-6, 6); if (x1 === x2 || y1 === y2) return null; const m = [(x1 + x2) / 2, (y1 + y2) / 2];
        return QP("Donne le milieu " + M("M") + " de " + M("[AB]") + " avec " + ptN("A", x1, y1) + " et " + ptN("B", x2, y2) + "." + PAIR + " (fractions ou décimaux acceptés)", m, "Moyenne des coordonnées : " + M("M = \\left(\\frac{" + x1 + sg(x2) + "}{2} \\,;\\, \\frac{" + y1 + sg(y2) + "}{2}\\right)") + " = " + pt(...m) + ".",
          { ctx: "milieu-plan", guide: [G("Abscisse du milieu ?", m[0], M(fT(m[0])) + "."), G("Ordonnée du milieu ?", m[1], M(fT(m[1])) + "."), GP("Milieu ?", m, pt(...m) + ".")],
            traps: [TP([(x2 - x1) / 2, (y2 - y1) / 2], "Le milieu est la moyenne : (x_A + x_B) ÷ 2."), TP([x1 + x2, y1 + y2], "N'oublie pas de diviser par 2."), TP([m[1], m[0]], "Le point s'écrit (x ; y).")] }); },
      () => { const [a, b, c, d] = pk(TRI3), p = perm([a, b, c]).map((v) => v * sgn()), A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], B = A.map((v, i) => v + p[i]);
        return QN("Calcule la distance entre " + ptN("A", ...A) + " et " + ptN("B", ...B) + " (dans l'espace).", d, M("AB = \\sqrt{" + p.map((v) => pT(v) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "distance-espace", guide: [G("Somme des carrés des trois écarts ?", d * d, M(p.map((v) => v * v).join(" + ") + " = " + d * d) + "."), G("Distance ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")],
            traps: [TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Pythagore dans l'espace : √(Δx² + Δy² + Δz²)."), TR(d * d, "N'oublie pas la racine."), TR(Math.hypot(p[0], p[1]), "Il y a trois coordonnées : n'oublie pas Δz.")] }); },
    ],
    2: [
      () => { const xa = R.int(-6, 6), ya = R.int(-6, 6), xm = R.int(-5, 5), ym = R.int(-5, 5); if (xa === xm || ya === ym) return null; const B = [2 * xm - xa, 2 * ym - ya];
        return QP(ptN("M", xm, ym) + " est le milieu de " + M("[AB]") + " avec " + ptN("A", xa, ya) + ". Donne les coordonnées de " + M("B") + "." + PAIR, B, M("x_B = 2x_M - x_A = " + B[0]) + ", " + M("y_B = 2y_M - y_A = " + B[1]) + " : " + ptN("B", ...B) + ".",
          { ctx: "symetrique", guide: [G(M("x_B = 2x_M - x_A") + " = ?", B[0], M("2 \\cdot " + pT(xm) + " - " + pT(xa) + " = " + B[0]) + "."), G(M("y_B") + " = ?", B[1], M(B[1]) + "."), GP("Point " + M("B") + " ?", B, ptN("B", ...B) + ".")],
            traps: [TP([(xa + xm) / 2, (ya + ym) / 2], "M est le milieu de [AB] : on cherche B tel que (x_A + x_B) ÷ 2 = x_M."), TP([xm - xa, ym - ya], "B = 2M − A (on reporte le vecteur AM à partir de M).")] }); },
      () => { const t = R.int(0, 2), th = pk([[0, 90, 180, 270], [30, 60, 120, 150, 210, 240, 300, 330], [45, 135, 225, 315]][t]), r = t === 0 ? R.int(2, 9) : 2 * R.int(1, 4), k = t === 2 ? R.int(1, 4) : 0;
        const rr = k ? k * Math.SQRT2 : r, cl = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v), X = cl(rr * Math.cos(th / DEG)), Y = cl(rr * Math.sin(th / DEG));
        const rT = k ? (k === 1 ? "" : k) + "\\sqrt{2}" : r, ex = (v) => { const a = Math.abs(v), s = v < 0 ? "-" : ""; if (Number.isInteger(a)) return s + a; const q3 = a / Math.sqrt(3); return Math.abs(q3 - Math.round(q3)) < 1e-9 ? s + (Math.round(q3) === 1 ? "" : Math.round(q3)) + "\\sqrt{3}" : s + N(a); };
        return QP("Convertis en coordonnées cartésiennes le point de coordonnées polaires " + M("(r \\,;\\, \\theta) = (" + rT + " \\,;\\, " + th + "°)") + "." + PAIR + " (√ accepté)", [X, Y], M("x = r\\cos\\theta = " + ex(X)) + ", " + M("y = r\\sin\\theta = " + ex(Y)) + " : " + M("(" + ex(X) + " \\,;\\, " + ex(Y) + ")") + ".",
          { ctx: "polaire-vers-cart", guide: [G(M("x = r \\cos \\theta") + " = ?", X, M(ex(X)) + "."), G(M("y = r \\sin \\theta") + " = ?", Y, M(ex(Y)) + "."), GP("Point ?", [X, Y], M("(" + ex(X) + " \\,;\\, " + ex(Y) + ")") + ".")],
            traps: [TP([Y, X], "x = r cos θ et y = r sin θ (le cosinus pour x)."), TP([Math.abs(X), Math.abs(Y)], "Attention aux signes selon le quadrant.")] }); },
      () => { const t = R.int(0, 2); let x, y, r, th, rT;
        if (t === 0) { const k = R.int(1, 5); th = pk([45, 135, 225, 315]); x = k * Math.sign(Math.cos(th / DEG)); y = k * Math.sign(Math.sin(th / DEG)); r = k * Math.SQRT2; rT = (k === 1 ? "" : k) + "\\sqrt{2}"; }
        else if (t === 1) { const a = R.int(2, 9); th = pk([0, 90, 180, 270]); x = Math.round(a * Math.cos(th / DEG)); y = Math.round(a * Math.sin(th / DEG)); r = a; rT = a; }
        else { const m = R.int(1, 3); th = pk([60, 120, 240, 300]); x = m * Math.sign(Math.cos(th / DEG)); y = m * Math.sqrt(3) * Math.sign(Math.sin(th / DEG)); r = 2 * m; rT = 2 * m; }
        const yT = t === 2 ? (y < 0 ? "-" : "") + (Math.abs(x) === 1 ? "" : Math.abs(x)) + "\\sqrt{3}" : fT(y);
        return QP("Convertis en coordonnées polaires le point " + M("(" + fT(x) + " \\,;\\, " + yT + ")") + ". Réponds « r ; θ » (θ en degrés, entre 0° et 360°).", [r, th], M("r = \\sqrt{x^2 + y^2} = " + rT) + " ; le point est " + (th % 90 === 0 ? "sur un axe" : "dans le quadrant " + (Math.floor(th / 90) + 1)) + ", donc " + M("\\theta = " + th + "°") + ".",
          { ctx: "cart-vers-polaire", guide: [G(M("r = \\sqrt{x^2 + y^2}") + " = ?", r, M(rT) + "."), G("Angle " + M("\\theta") + " (en degrés, attention au quadrant) ?", th, M(th + "°") + "."), GP("Coordonnées polaires ?", [r, th], M("(" + rT + " \\,;\\, " + th + "°)") + ".")],
            traps: [TP([r * r, th], "N'oublie pas la racine : r = √(x² + y²)."), TP([r, (th + 180) % 360], "Vérifie le quadrant : regarde les signes de x et de y.")] }); },
    ],
    3: [
      () => { const xa = R.int(-5, 5), ya = R.int(1, 6), xb = R.int(-5, 5), yb = R.int(1, 6); if (xa === xb || ya === yb) return null; const x = r6((xb * xb + yb * yb - xa * xa - ya * ya) / (2 * (xb - xa))); if (den(x) > 4) return null;
        return QN("Trouve le point " + M("P(x \\,;\\, 0)") + " de l'axe des abscisses situé à égale distance de " + ptN("A", xa, ya) + " et de " + ptN("B", xb, yb) + ". Que vaut " + M("x") + " ? (fraction acceptée)", x, M("PA^2 = PB^2") + " : " + M("(x" + sg(-xa) + ")^2 + " + ya * ya + " = (x" + sg(-xb) + ")^2 + " + yb * yb) + " ; les " + M("x^2") + " s'éliminent, " + M("x = " + fT(x)) + ".",
          { ctx: "equidistant", guide: [G("On écrit " + M("PA^2 = PB^2") + " ; après simplification des " + M("x^2") + ", coefficient de x, " + M("2(x_B - x_A)") + " ?", 2 * (xb - xa), M(2 * (xb - xa)) + "."), G("Membre de droite " + M("x_B^2 + y_B^2 - x_A^2 - y_A^2") + " ?", xb * xb + yb * yb - xa * xa - ya * ya, M(xb * xb + yb * yb - xa * xa - ya * ya) + "."), G(M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR((xa + xb) / 2, "Ce serait vrai si A et B avaient la même ordonnée : écris PA² = PB²."), TR(-x, "Attention au signe en isolant x.")] }); },
      () => { const a = R.int(2, 8), b = R.int(2, 8), c = R.int(1, 6), d = Math.sqrt(a * a + b * b + c * c); if (Number.isInteger(d) || a === b) return null;
        return QN("Un pavé droit mesure " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm et a un sommet à l'origine. Longueur de sa grande diagonale (au centième) ?", d, "De " + pt(0, 0, 0) + " à " + pt(a, b, c) + " : " + M("\\sqrt{" + a * a + " + " + b * b + " + " + c * c + "} = \\sqrt{" + (a * a + b * b + c * c) + "} \\approx " + D(d, 0.01)) + " cm.",
          { ctx: "diagonale", round: 0.01, guide: [G("Somme des carrés des trois dimensions ?", a * a + b * b + c * c, M(a * a + b * b + c * c) + "."), G("Diagonale (au centième) ?", d, M(D(d, 0.01)) + " cm.", 0.01)],
            traps: [TR(Math.hypot(a, b), "C'est la diagonale de la base ; dans l'espace, ajoute c²."), TR(a + b + c, "Pythagore dans l'espace : √(a² + b² + c²).")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], B = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)]; if (A.some((v, i) => v === B[i])) return null; const m = A.map((v, i) => (v + B[i]) / 2);
        return QP("Donne le milieu de " + M("[AB]") + " avec " + ptN("A", ...A) + " et " + ptN("B", ...B) + "." + TRIP + " (décimaux acceptés)", m, "Moyenne de chaque coordonnée : " + pt(...m) + ".",
          { ctx: "milieu-espace", guide: [G("Abscisse " + M("x") + " ?", m[0], M(fT(m[0])) + "."), G("Ordonnée " + M("y") + " ?", m[1], M(fT(m[1])) + "."), GP("Milieu ?", m, pt(...m) + ".")],
            traps: [TP(A.map((v, i) => (B[i] - v) / 2), "Le milieu est la moyenne : (A + B) ÷ 2."), TP(A.map((v, i) => v + B[i]), "N'oublie pas de diviser par 2.")] }); },
    ],
  };

  // ===================================== F1. vectmp : vecteurs =====================================
  const VE = {
    1: [
      () => { const A = [R.int(-6, 6), R.int(-6, 6)], B = [R.int(-6, 6), R.int(-6, 6)]; if (A[0] === B[0] || A[1] === B[1]) return null; const u = [B[0] - A[0], B[1] - A[1]];
        return QP("Donne les composantes du vecteur " + M("\\overrightarrow{AB}") + " avec " + ptN("A", ...A) + " et " + ptN("B", ...B) + "." + PAIR, u, M("\\overrightarrow{AB} = " + v2("x_B - x_A", "y_B - y_A") + " = " + v2(u[0], u[1])) + ".",
          { ctx: "composantes", guide: [G(M("x_B - x_A") + " ?", u[0], M(B[0] + " - " + pT(A[0]) + " = " + u[0]) + "."), G(M("y_B - y_A") + " ?", u[1], M(u[1]) + "."), GP("Composantes ?", u, M(v2(u[0], u[1])) + ".")],
            traps: [TP([-u[0], -u[1]], "C'est le vecteur BA : on calcule arrivée − départ."), TP([A[0] + B[0], A[1] + B[1]], "On soustrait les coordonnées : B − A.")] }); },
      () => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], a = pk([2, 3, -2]), b = pk([1, -1, 2, -3]), w = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
        const comb = co(a) + "\\vec{u}" + (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "\\vec{v}";
        return QP("Avec " + M("\\vec{u} = " + v2(u[0], u[1])) + " et " + M("\\vec{v} = " + v2(v[0], v[1])) + ", calcule " + M(comb) + "." + PAIR, w, "Composante par composante : " + M(comb + " = " + v2(w[0], w[1])) + ".",
          { ctx: "combinaison", guide: [G("Première composante ?", w[0], M(a + " \\cdot " + pT(u[0]) + " + " + pT(b) + " \\cdot " + pT(v[0]) + " = " + w[0]) + "."), G("Seconde composante ?", w[1], M(a + " \\cdot " + pT(u[1]) + " + " + pT(b) + " \\cdot " + pT(v[1]) + " = " + w[1]) + "."), GP("Vecteur ?", w, M(v2(w[0], w[1])) + ".")],
            traps: [TP([a * u[0] + v[0], a * u[1] + v[1]], "Le coefficient " + b + " multiplie aussi v."), TP([u[0] + b * v[0], u[1] + b * v[1]], "Le coefficient " + a + " multiplie chaque composante de u.")] }); },
      () => { const [a, b, c] = pk(TRI2), u = [a * sgn(), b * sgn()];
        return QN("Calcule la norme du vecteur " + M("\\vec{u} = " + v2(u[0], u[1])) + ".", c, M("\\|\\vec{u}\\| = \\sqrt{" + pT(u[0]) + "^2 + " + pT(u[1]) + "^2} = \\sqrt{" + c * c + "} = " + c) + ".",
          { ctx: "norme", guide: [G("Somme des carrés des composantes ?", c * c, M(a * a + " + " + b * b + " = " + c * c) + "."), G("Norme ?", c, M(c) + ".")],
            traps: [TR(Math.abs(u[0]) + Math.abs(u[1]), "La norme se calcule avec Pythagore."), TR(c * c, "N'oublie pas la racine."), TR(u[0] + u[1], "La norme est √(x² + y²).")] }); },
    ],
    2: [
      () => { const [a, b, c, d] = pk(TRI3), u = perm([a, b, c]).map((v) => v * sgn());
        return QN("Calcule la norme du vecteur " + M("\\vec{u} = " + v3(...u)) + ".", d, M("\\|\\vec{u}\\| = \\sqrt{" + u.map((v) => pT(v) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "norme-espace", guide: [G("Somme des carrés des trois composantes ?", d * d, M(u.map((v) => v * v).join(" + ") + " = " + d * d) + "."), G("Norme ?", d, M(d) + ".")],
            traps: [TR(Math.abs(u[0]) + Math.abs(u[1]) + Math.abs(u[2]), "La norme se calcule avec Pythagore."), TR(d * d, "N'oublie pas la racine.")] }); },
      () => { const a = nz(-4, 4), b = nz(-5, 5), k = pk([2, 3, -2, 1.5, -3]), c = r6(a * k), dd = r6(b * k); if (!Number.isInteger(c) || !Number.isInteger(dd)) return null;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M(v2(a, "m")) + " et " + M(v2(c, dd)) + " sont-ils colinéaires ?", b, "Colinéaires : le second vaut " + M(fT(k)) + " fois le premier (car " + M(c + " = " + fT(k) + " \\cdot " + pT(a)) + "), donc " + M("m = " + dd + " \\div " + pT(k) + " = " + b) + ".",
          { ctx: "colineaire", guide: [G("Rapport " + M("k") + " entre les premières composantes, " + M(c + " \\div " + pT(a)) + " ?", k, M(fT(k)) + "."), G(M("m") + " = ?", b, M(dd + " \\div " + pT(k) + " = " + b) + ".")],
            traps: [TR(dd * k, "On divise par k : la seconde composante du second vecteur vaut k · m."), TR(-b, "Attention au signe du rapport k.")] }); },
      () => { const A = [R.int(-5, 3), R.int(-5, 3)], B = [A[0] + R.int(2, 5), A[1] + R.int(-2, 3)], C = [B[0] + R.int(-2, 2), B[1] + R.int(2, 5)], Dp = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
        return QP("ABCD est un parallélogramme avec " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + ptN("C", ...C) + ". Donne les coordonnées de " + M("D") + "." + PAIR, Dp, M("\\overrightarrow{AD} = \\overrightarrow{BC} = " + v2(C[0] - B[0], C[1] - B[1])) + ", donc " + ptN("D", ...Dp) + ".",
          { ctx: "parallelogramme", guide: [GP("Composantes de " + M("\\overrightarrow{BC}") + " ?", [C[0] - B[0], C[1] - B[1]], M(v2(C[0] - B[0], C[1] - B[1])) + "."), GP(M("D = A + \\overrightarrow{BC}") + " ?", Dp, ptN("D", ...Dp) + ".")],
            traps: [TP([B[0] + C[0] - A[0], B[1] + C[1] - A[1]], "Dans ABCD, AD = BC : D = A + BC."), TP([A[0] + B[0] - C[0], A[1] + B[1] - C[1]], "Respecte l'ordre des sommets : ABCD.")] }); },
    ],
    3: [
      () => { /* audit niveau 25.11 : « exprimer w comme combinaison linéaire de u et v » (examen TASV spécifique 2024 p. 2, 2023 p. 7) */
        const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], det = u[0] * v[1] - u[1] * v[0], a = nz(-4, 4), b = nz(-4, 4); if (!det || Math.abs(a) === Math.abs(b) || (Math.abs(a) === 1 && Math.abs(b) === 1)) return null; const w = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
        return QP("Avec " + M("\\vec{u} = " + v2(...u)) + ", " + M("\\vec{v} = " + v2(...v)) + " et " + M("\\vec{w} = " + v2(...w)) + ", trouve les nombres " + M("a") + " et " + M("b") + " tels que " + M("\\vec{w} = a\\,\\vec{u} + b\\,\\vec{v}") + ". Réponds « a ; b ».", [a, b], "On résout le système " + M("\\begin{cases} " + u[0] + "a" + sg(v[0]) + "b = " + w[0] + " \\\\ " + u[1] + "a" + sg(v[1]) + "b = " + w[1] + " \\end{cases}") + " : " + M("a = " + a) + ", " + M("b = " + b) + ". Donc " + M("\\vec{w} = " + fT(a) + "\\,\\vec{u}" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "\\,\\vec{v}") + ".",
          { ctx: "combinaison-lineaire", guide: [G("Système : " + M(u[0] + "a" + sg(v[0]) + "b = " + w[0]) + " et " + M(u[1] + "a" + sg(v[1]) + "b = " + w[1]) + ". Que vaut " + M("a") + " ?", a, M("a = " + a) + "."), G("Que vaut " + M("b") + " ?", b, M("b = " + b) + "."), GP("Réponse « a ; b » ?", [a, b], M("a = " + a) + ", " + M("b = " + b) + ".")],
            traps: [TP([b, a], "a multiplie u et b multiplie v : respecte l'ordre."), TP([-a, -b], "Vérifie les signes en recalculant a·u + b·v.")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = pk([2, 3, -1, -2, 1.5, 0.5]), Cc = [A[0] + k * u[0], A[1] + k * u[1]]; if (!Number.isInteger(Cc[0] * 2) || !Number.isInteger(Cc[1] * 2)) return null; const B = [A[0] + u[0], A[1] + u[1]];
        return QP("Avec " + ptN("A", ...A) + " et " + ptN("B", ...B) + ", trouve le point " + M("C") + " tel que " + M("\\overrightarrow{AC} = " + fT(k) + "\\,\\overrightarrow{AB}") + "." + PAIR, Cc, M("\\overrightarrow{AB} = " + v2(u[0], u[1])) + ", " + M("\\overrightarrow{AC} = " + v2(fT(k * u[0]), fT(k * u[1]))) + ", " + ptN("C", ...Cc) + ".",
          { ctx: "point-vecteur", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?", u, M(v2(u[0], u[1])) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?", [k * u[0], k * u[1]], M(v2(fT(k * u[0]), fT(k * u[1]))) + "."), GP("Point " + M("C = A + \\overrightarrow{AC}") + " ?", Cc, ptN("C", ...Cc) + ".")],
            traps: [TP([k * u[0], k * u[1]], "C'est le vecteur AC ; le point C vaut A + AC."), TP([B[0] + k * u[0], B[1] + k * u[1]], "On part de A, pas de B.")] }); },
      () => { const u = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], a = pk([2, 3, -2]), w = u.map((x, i) => a * x - v[i]);
        return QP("Avec " + M("\\vec{u} = " + v3(...u)) + " et " + M("\\vec{v} = " + v3(...v)) + ", calcule " + M(a + "\\vec{u} - \\vec{v}") + "." + TRIP, w, M(a + "\\vec{u} - \\vec{v} = " + v3(...w)) + ".",
          { ctx: "combinaison-espace", guide: [G("Première composante ?", w[0], M(a + " \\cdot " + pT(u[0]) + " - " + pT(v[0]) + " = " + w[0]) + "."), G("Deuxième ?", w[1], M(w[1]) + "."), GP("Vecteur ?", w, M(v3(...w)) + ".")],
            traps: [TP(u.map((x, i) => a * x + v[i]), "On soustrait v."), TP(u.map((x, i) => a * (x - v[i])), "Le coefficient " + a + " ne multiplie que u.")] }); },
      () => { const A = [R.int(-6, 6), R.int(-6, 6)], B = [R.int(-6, 6), R.int(-6, 6)], C = [R.int(-6, 6), R.int(-6, 6)], Gc = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]; if (A[0] === B[0] && B[0] === C[0]) return null;
        return QP("Le centre de gravité d'un triangle est " + M("G = \\frac{A + B + C}{3}") + " (moyenne des sommets). Donne " + M("G") + " pour " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + "." + PAIR + " (fractions acceptées)", Gc, M("x_G = \\frac{" + (A[0] + B[0] + C[0]) + "}{3}") + ", " + M("y_G = \\frac{" + (A[1] + B[1] + C[1]) + "}{3}") + " : " + ptN("G", ...Gc) + ".",
          { ctx: "centre-gravite", guide: [G("Somme des abscisses ?", A[0] + B[0] + C[0], M(A[0] + B[0] + C[0]) + "."), G("Somme des ordonnées ?", A[1] + B[1] + C[1], M(A[1] + B[1] + C[1]) + "."), GP(M("G") + " ?", Gc, ptN("G", ...Gc) + ".")],
            traps: [TP([A[0] + B[0] + C[0], A[1] + B[1] + C[1]], "Divise par 3 (moyenne)."), TP([(A[0] + B[0] + C[0]) / 2, (A[1] + B[1] + C[1]) / 2], "Il y a trois sommets : divise par 3.")] }); },
    ],
  };

  // ===================================== F2. scalmp : produit scalaire =====================================
  const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
  const angDeg = (u, v) => DEG * Math.acos(dot(u, v) / (Math.hypot(...u) * Math.hypot(...v)));
  const SC = {
    1: [
      () => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], p = dot(u, v); if (!p) return null;
        return QN("Calcule le produit scalaire " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + M("\\vec{u} = " + v2(u[0], u[1])) + " et " + M("\\vec{v} = " + v2(v[0], v[1])) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + pT(u[0]) + " \\cdot " + pT(v[0]) + " + " + pT(u[1]) + " \\cdot " + pT(v[1]) + " = " + p) + ".",
          { ctx: "calcul-2d", guide: [G("Produit des premières composantes ?", u[0] * v[0], M(u[0] * v[0]) + "."), G("Produit des secondes ?", u[1] * v[1], M(u[1] * v[1]) + "."), G("Produit scalaire ?", p, M(p) + ".")],
            traps: [TR(u[0] * v[1] + u[1] * v[0], "On multiplie composante par composante : x avec x, y avec y."), TR(u[0] * v[0] - u[1] * v[1], "On additionne les deux produits.")] }); },
      () => { const u = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], p = dot(u, v); if (!p) return null;
        return QN("Calcule " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + M("\\vec{u} = " + v3(...u)) + " et " + M("\\vec{v} = " + v3(...v)) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + u.map((x, i) => pT(x) + " \\cdot " + pT(v[i])).join(" + ") + " = " + p) + ".",
          { ctx: "calcul-3d", guide: [G("Somme des deux premiers produits ?", u[0] * v[0] + u[1] * v[1], M(u[0] * v[0] + u[1] * v[1]) + "."), G("Produit scalaire (avec le troisième) ?", p, M(p) + ".")],
            traps: [TR(u[0] * v[0] + u[1] * v[1], "Il y a trois composantes dans l'espace."), TR(p - 2 * u[2] * v[2], "Attention aux signes du dernier produit.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5), k = r6(-(b * c) / a); if (!Number.isInteger(k * 2) || !k) return null;
        return QN("Pour quelle valeur de " + M("k") + " les vecteurs " + M(v2("k", b)) + " et " + M(v2(a, c)) + " sont-ils orthogonaux ? (fraction acceptée)", k, "Orthogonaux : produit scalaire nul, " + M(a + "k + " + pT(b) + " \\cdot " + pT(c) + " = 0") + ", " + M("k = " + fT(k)) + ".",
          { ctx: "orthogonal", guide: [G("Le produit scalaire vaut " + M(a + "k + " + pT(b) + " \\cdot " + pT(c)) + ". Que vaut " + M(pT(b) + " \\cdot " + pT(c)) + " ?", b * c, M(b * c) + "."), G(M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(-k, "Attention au signe en isolant k."), TR(r6(b * c), "Divise par " + a + ".")] }); },
    ],
    2: [
      () => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)]; if (u[0] * v[1] === u[1] * v[0] || !dot(u, v)) return null; const ang = angDeg(u, v), cs = Math.cos(ang / DEG);
        return QN("Calcule l'angle entre " + M("\\vec{u} = " + v2(u[0], u[1])) + " et " + M("\\vec{v} = " + v2(v[0], v[1])) + " (en degrés, au dixième).", ang, M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\cdot \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + D(ang, 0.1) + "°") + ".",
          { ctx: "angle", round: 0.1, guide: [G("Produit scalaire ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\cos\\alpha") + " (au millième) ?", cs, M(D(cs, 0.001)) + ".", 0.001), G("Angle (au dixième) ?", ang, M(D(ang, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - ang, "Un produit scalaire " + (dot(u, v) < 0 ? "négatif donne un angle obtus." : "positif donne un angle aigu."))] }); },
      () => { const a = R.int(2, 8), b = R.int(2, 8), th = pk([60, 120, 180, 45, 135]), c = Math.cos(th / DEG), p = a * b * c, rad = th === 45 || th === 135, cT = { 60: "\\frac{1}{2}", 120: "-\\frac{1}{2}", 180: "-1", 45: "\\frac{\\sqrt{2}}{2}", 135: "-\\frac{\\sqrt{2}}{2}" }[th];
        const pTx = rad ? (th === 135 ? "-" : "") + (a * b === 2 ? "" : fT((a * b) / 2)) + "\\sqrt{2}" : fT(r6(p));
        return QN("Deux vecteurs ont des normes " + M(a) + " et " + M(b) + " et forment un angle de " + M(th + "°") + ". Calcule leur produit scalaire" + (rad ? " (√ accepté)." : "."), p, M("\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha = " + a + " \\cdot " + b + " \\cdot " + (th === 180 ? "(-1)" : cT) + " = " + pTx) + ".",
          { ctx: "normes-angle", guide: [G(M("\\cos " + th + "°") + " (valeur exacte) ?", c, M(cT) + "."), G("Produit scalaire ?", p, M(pTx) + ".")],
            traps: [TR(a * b, "N'oublie pas le facteur cos α."), TR(a * b * Math.sin(th / DEG), "Produit scalaire : cosinus (pas sinus).")] }); },
      () => { const F = pk([30, 40, 50, 60, 80]) /* 26.11 (vraisemblance) : une luge se tire avec quelques dizaines de N */, dd = pk([5, 10, 12, 20, 25, 30]), th = pk([20, 25, 30, 35, 40, 45, 60]), W = F * dd * Math.cos(th / DEG);
        return QN("On tire une luge avec une force de " + M(F + "\\text{ N}") + " qui fait un angle de " + M(th + "°") + " avec le sol, sur " + M(dd + "\\text{ m}") + ". Calcule le travail " + M("W = \\vec{F} \\cdot \\vec{d}") + " (en J, au dixième).", W, M("W = " + F + " \\cdot " + dd + " \\cdot \\cos " + th + "° \\approx " + D(W, 0.1)) + " J.",
          { ctx: "travail", round: 0.1, guide: [G(M("\\cos " + th + "°") + " (au millième) ?", Math.cos(th / DEG), M(D(Math.cos(th / DEG), 0.001)) + ".", 0.001), G("Travail (au dixième) ?", W, M(D(W, 0.1)) + " J.", 0.1)],
            traps: [TR(F * dd, "Seule la composante de la force dans le sens du déplacement travaille : × cos α."), TR(F * dd * Math.sin(th / DEG), "C'est le cosinus de l'angle (projection sur le déplacement).")] }); },
    ],
    3: [
      () => { const A = [R.int(-4, 4), R.int(-4, 4)], B = [R.int(-4, 6), R.int(-4, 6)], C = [R.int(-4, 6), R.int(-4, 6)], u = [B[0] - A[0], B[1] - A[1]], v = [C[0] - A[0], C[1] - A[1]]; if (u[0] * v[1] === u[1] * v[0] || !dot(u, v)) return null; const ang = angDeg(u, v);
        return QN("Calcule l'angle " + M("\\widehat{BAC}") + " du triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + " (en degrés, au dixième).", ang, M("\\overrightarrow{AB} = " + v2(u[0], u[1])) + ", " + M("\\overrightarrow{AC} = " + v2(v[0], v[1])) + " ; " + M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "}\\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + D(ang, 0.1) + "°") + ".",
          { ctx: "angle-triangle", round: 0.1, guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?", u, M(v2(u[0], u[1])) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?", v, M(v2(v[0], v[1])) + "."), G("Produit scalaire ?", dot(u, v), M(dot(u, v)) + "."), G("Angle (au dixième) ?", ang, M(D(ang, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - ang, "Le signe du produit scalaire décide : " + (dot(u, v) < 0 ? "négatif, angle obtus." : "positif, angle aigu.")), TR(angDeg(u, [C[0] - B[0], C[1] - B[1]]), "L'angle en A utilise les vecteurs AB et AC (tous deux partant de A).")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = nz(-4, 4), d = nz(-4, 4), e = nz(-4, 4), k = r6(-(a * d + b * e) / c); if (!Number.isInteger(k * 2) || !k) return null;
        return QN("Pour quelle valeur de " + M("k") + " les vecteurs " + M(v3(a, b, c)) + " et " + M(v3(d, e, "k")) + " sont-ils orthogonaux ? (fraction acceptée)", k, M(a + " \\cdot " + pT(d) + " + " + pT(b) + " \\cdot " + pT(e) + " + " + pT(c) + "k = 0") + ", " + M("k = " + fT(k)) + ".",
          { ctx: "orthogonal-espace", guide: [G("Somme des deux premiers produits ?", a * d + b * e, M(a * d + b * e) + "."), G(M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(-k, "Attention au signe en isolant k."), TR(r6(-(a * d + b * e)), "Divise par " + c + ".")] }); },
      () => { const A = [R.int(-3, 3), R.int(-3, 3)], u = [nz(-4, 4), nz(-4, 4)], B = [A[0] + u[0], A[1] + u[1]], yc = A[1] + nz(-5, 5), x = r6(A[0] - (u[1] * (yc - A[1])) / u[0]); if (!Number.isInteger(x * 2)) return null;
        return QN("Le triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + M("C(x \\,;\\, " + yc + ")") + " est rectangle en " + M("A") + ". Que vaut " + M("x") + " ? (fraction acceptée)", x, "Rectangle en A : " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 0") + ", " + M(u[0] + "(x" + sg(-A[0]) + ") + " + pT(u[1]) + " \\cdot " + pT(yc - A[1]) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "angle-droit", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?", u, M(v2(u[0], u[1])) + "."), G("Seconde composante de " + M("\\overrightarrow{AC}") + " ?", yc - A[1], M(yc - A[1]) + "."), G("Produit scalaire nul : " + M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR(r6(-(u[1] * (yc - A[1])) / u[0]), "C'est x − x_A ; ajoute encore x_A = " + A[0] + "."), TR(r6(A[0] + (u[1] * (yc - A[1])) / u[0]), "Attention au signe.")] }); },
    ],
  };

  // ===================================== G. droiteparam : droites paramétriques =====================================
  const cT1 = (a, dd, s) => (a ? a + tm(dd, s) : tm(dd, s, true)); /* « y = -3t » plutôt que « y = 0 - 3t » */
  const eqP = (A, d, s = "t") => M("\\begin{cases} x = " + cT1(A[0], d[0], s) + " \\\\ y = " + cT1(A[1], d[1], s) + (A.length > 2 ? " \\\\ z = " + cT1(A[2], d[2], s) : "") + " \\end{cases}");
  const DP = {
    1: [
      () => { /* audit niveau 25.11 : « équations paramétriques de la droite passant par A et B » (examen TASV spécifique 2024 p. 4c) */
        const A = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], B = A.map((x, i) => x + d[i]), t = pk([2, 3, -2, -1]), P = A.map((x, i) => x + t * d[i]);
        return QP("On écrit la droite " + M("(AB)") + " avec " + ptN("A", ...A) + " comme point de départ et " + M("\\overrightarrow{AB}") + " comme vecteur directeur, pour " + ptN("B", ...B) + ". Quel point obtient-on pour " + M("t = " + t) + " ?" + TRIP, P, M("\\overrightarrow{AB} = " + v3(...d)) + ", donc " + eqP(A, d) + " ; pour " + M("t = " + t) + " : " + pt(...P) + ".",
          { ctx: "deux-points", guide: [GP("Vecteur directeur " + M("\\overrightarrow{AB}") + " (« x ; y ; z ») ?", d, M(v3(...d)) + "."), G(M("x = " + A[0] + " + " + pT(d[0]) + "t") + " pour " + M("t = " + t) + " ?", P[0], M(P[0]) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP(B.map((x, i) => x + t * d[i]), "Le point de départ est A (pour t = 0), pas B."), TP(A.map((x, i) => x + t * B[i]), "Le vecteur directeur est AB = B − A, pas les coordonnées de B."), TP(A.map((x, i) => x - t * d[i]), "AB = B − A (arrivée − départ).")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4)], t = pk([2, 3, -1, -2, 4]), P = [A[0] + t * d[0], A[1] + t * d[1]];
        return QP("La droite " + M("d") + " a pour équations paramétriques " + eqP(A, d) + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + PAIR, P, M("x = " + A[0] + sg(d[0]) + " \\cdot " + pT(t) + " = " + P[0]) + ", " + M("y = " + A[1] + sg(d[1]) + " \\cdot " + pT(t) + " = " + P[1]) + " : " + pt(...P) + ".",
          { ctx: "point-t", guide: [G(M("x") + " pour " + M("t = " + t) + " ?", P[0], M(P[0]) + "."), G(M("y") + " ?", P[1], M(P[1]) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP([t * d[0], t * d[1]], "On part du point de départ : x = " + A[0] + " + (" + d[0] + ")t."), TP([A[0] + d[0], A[1] + d[1]], "Remplace t par " + t + ".")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4)], t = pk([2, 3, -2, 4, 5, -3]), P = [A[0] + t * d[0], A[1] + t * d[1]];
        return QN("Le point " + ptN("P", ...P) + " est sur la droite " + eqP(A, d) + ". Pour quelle valeur du paramètre " + M("t") + " ?", t, M(P[0] + " = " + A[0] + tm(d[0], "t")) + " donne " + M("t = " + t) + " ; on vérifie avec y : " + M(A[1] + sg(d[1]) + " \\cdot " + pT(t) + " = " + P[1]) + ".",
          { ctx: "parametre", shownOk: true, guide: [G("Avec la première équation : " + M(d[0] + "t") + " = ?", P[0] - A[0], M(P[0] + " - " + pT(A[0]) + " = " + (P[0] - A[0])) + "."), G(M("t") + " = ?", t, M(t) + " (la seconde équation donne la même valeur).")],
            traps: [TR(P[0] - A[0], "Divise encore par " + d[0] + "."), TR(-t, "Attention au signe.")] }); },
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], d = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t = pk([2, 3, -1, -2]), P = A.map((v, i) => v + t * d[i]);
        return QP("Donne le point de la droite " + eqP(A, d) + " obtenu pour " + M("t = " + t) + "." + TRIP, P, "On remplace " + M("t") + " par " + M(t) + " : " + pt(...P) + ".",
          { ctx: "point-espace", guide: [G(M("x") + " ?", P[0], M(P[0]) + "."), G(M("y") + " ?", P[1], M(P[1]) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP(d.map((v) => v * t), "N'oublie pas le point de départ."), TP(A.map((v, i) => v + d[i]), "Remplace t par " + t + ".")] }); },
    ],
    2: [
      () => { const A = [R.int(-5, 5), nz(-6, 6)], d = [nz(-4, 4), nz(-3, 3)], t = r6(-A[1] / d[1]), x = r6(A[0] + t * d[0]); if (!Number.isInteger(x * 2)) return null;
        return QP("En quel point la droite " + eqP(A, d) + " coupe-t-elle l'axe des abscisses ?" + PAIR + " (fractions acceptées)", [x, 0], "Sur l'axe des abscisses " + M("y = 0") + " : " + M(A[1] + tm(d[1], "t") + " = 0") + ", " + M("t = " + fT(t)) + ", " + M("x = " + fT(x)) + ". Point " + pt(x, 0) + ".",
          { ctx: "axe", guide: [G("On pose " + M("y = 0") + " : " + M("t") + " = ?", t, M(fT(t)) + "."), G(M("x") + " = ?", x, M(fT(x)) + "."), GP("Point ?", [x, 0], pt(x, 0) + ".")],
            traps: [TP([A[0], 0], "Calcule t avec y = 0, puis x."), TP([r6(A[0] - t * d[0]), 0], "Attention au signe de t.")] }); },
      () => { const A = [nz(-6, 6), nz(-6, 6), nz(-6, 6)], d = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], k = R.int(0, 2), name = ["yOz", "xOz", "xOy"][k], vr = ["x", "y", "z"][k], t = r6(-A[k] / d[k]); if (!Number.isInteger(t)) return null; const P = A.map((v, i) => (i === k ? 0 : v + t * d[i]));
        return QP("Donne le point d'intersection de la droite " + eqP(A, d) + " avec le plan " + M(name) + " (" + M(vr + " = 0") + ")." + TRIP, P, M(vr + " = 0") + " donne " + M("t = " + t) + " : " + pt(...P) + ".",
          { ctx: "plan-coordonnees", guide: [G("On pose " + M(vr + " = 0") + " : " + M("t") + " = ?", t, M(t) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP(A.map((v, i) => (i === k ? 0 : v)), "Calcule t, puis les deux autres coordonnées."), TP(A.map((v, i) => (i === k ? 0 : v - t * d[i])), "Attention au signe de t.")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4)], t = pk([2, 3, -1, -2, 4]), P = [A[0] + t * d[0], A[1] + t * d[1]];
        return QN("Le point " + M("P(" + P[0] + " \\,;\\, y)") + " est sur la droite " + eqP(A, d) + ". Que vaut " + M("y") + " ?", P[1], "Avec x : " + M(P[0] + " = " + A[0] + tm(d[0], "t")) + ", " + M("t = " + t) + " ; puis " + M("y = " + A[1] + sg(d[1]) + " \\cdot " + pT(t) + " = " + P[1]) + ".",
          { ctx: "coordonnee-manquante", guide: [G(M("t") + " (avec l'équation de x) ?", t, M(t) + "."), G(M("y") + " ?", P[1], M(P[1]) + ".")],
            traps: [TR(A[1] + d[1] * P[0], "Remplace t (pas x) dans l'équation de y."), TR(A[1] + d[1], "Calcule d'abord t avec x.")] }); },
    ],
    3: [
      () => { const P = [R.int(-4, 4), R.int(-4, 4)], d1 = [nz(-3, 3), nz(-3, 3)], d2 = [nz(-3, 3), nz(-3, 3)]; if (d1[0] * d2[1] === d1[1] * d2[0]) return null; const t0 = pk([1, -1, 2]), s0 = pk([1, -2, 2, -1]), A = [P[0] - t0 * d1[0], P[1] - t0 * d1[1]], B = [P[0] - s0 * d2[0], P[1] - s0 * d2[1]];
        return QP("Donne le point d'intersection des droites " + M("d_1") + " : " + eqP(A, d1) + " et " + M("d_2") + " : " + eqP(B, d2, "s") + "." + PAIR, P, "On résout " + M(A[0] + tm(d1[0], "t") + " = " + B[0] + tm(d2[0], "s")) + " et " + M(A[1] + tm(d1[1], "t") + " = " + B[1] + tm(d2[1], "s")) + ", d'où " + M("t = " + t0) + " et " + M("s = " + s0) + ". Point " + pt(...P) + ".",
          { ctx: "intersection", guide: [G("On égalise les x et les y (système en t et s). " + M("t") + " = ?", t0, M(t0) + "."), G(M("s") + " = ?", s0, M(s0) + "."), GP("Point (avec t dans " + M("d_1") + ") ?", P, pt(...P) + ".")],
            traps: [TP([t0, s0], "Ce sont les paramètres ; remplace t dans d₁ pour obtenir le point."), TP([P[1], P[0]], "Le point s'écrit (x ; y).")] }); },
      () => { const d1 = [nz(-3, 3), nz(-3, 3), R.int(-3, 3)], d2 = [nz(-3, 3), R.int(-3, 3), nz(-3, 3)], c = Math.abs(dot(d1, d2)) / (Math.hypot(...d1) * Math.hypot(...d2)); if (c > 0.999 || c < 1e-9) return null; const ang = DEG * Math.acos(c);
        return QN("Calcule l'angle aigu entre deux droites de vecteurs directeurs " + M(v3(...d1)) + " et " + M(v3(...d2)) + " (en degrés, au dixième).", ang, M("\\cos\\alpha = \\frac{|" + dot(d1, d2) + "|}{\\sqrt{" + dot(d1, d1) + "} \\cdot \\sqrt{" + dot(d2, d2) + "}}") + ", " + M("\\alpha \\approx " + D(ang, 0.1) + "°") + ".",
          { ctx: "angle-droites", round: 0.1, guide: [G("Produit scalaire des vecteurs directeurs ?", dot(d1, d2), M(dot(d1, d2)) + "."), G(M("\\cos\\alpha") + " avec la valeur absolue (au millième) ?", c, M(D(c, 0.001)) + ".", 0.001), G("Angle aigu (au dixième) ?", ang, M(D(ang, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - ang, "Entre deux droites, on donne l'angle aigu (valeur absolue du produit scalaire).")] }); },
      () => { const [a, b, c, n] = pk(TRI3), d = perm([a, b, c]), t = R.int(2, 8), P = d.map((v) => v * t);
        return QN("Un drone part de l'origine et vole en ligne droite : sa position après " + M("t") + " secondes est " + M("(x \\,;\\, y \\,;\\, z) = t \\cdot " + v3(...d)) + " (en m). Quelle distance a-t-il parcourue après " + M(t) + " s ?", n * t, "Position " + pt(...P) + " ; distance " + M(t + " \\cdot \\sqrt{" + dot(d, d) + "} = " + t + " \\cdot " + n + " = " + n * t) + " m.",
          { ctx: "drone", guide: [G("Norme du vecteur directeur (vitesse en m/s) ?", n, M("\\sqrt{" + dot(d, d) + "} = " + n) + "."), G("Distance après " + t + " s ?", n * t, M(n * t) + " m.")],
            traps: [TR((a + b + c) * t, "La distance se calcule avec la norme (Pythagore)."), TR(n, "C'est la distance parcourue en 1 s.")] }); },
    ],
  };

  // ===================================== H. ineqmp : inéquations et tableau des signes =====================================
  // Signe lu sur un graphique (24.11, agent mp4plus) : intervalles où a(x − r₁)(x − r₂)… vérifie « op 0 » (zéros simples, triés).
  const sgnIv = (rs, a, op) => { const b = [-INF].concat(rs, [INF]), pos = op[0] === ">", inc = op.length === 2, out = [];
    for (let i = 0; i < b.length - 1; i++) { const s = Math.sign(a) * (((rs.length - i) % 2) ? -1 : 1); if ((s > 0) === pos) out.push([b[i], isFinite(b[i]) && inc, b[i + 1], isFinite(b[i + 1]) && inc]); }
    return out; };
  const sgnFig = (f, rs, lab) => { let lo = 0, hi = 0; for (let x = -6; x <= 6; x += 0.05) { const y = f(x); if (x > rs[0] - 1.2 && x < rs[rs.length - 1] + 1.2) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
    const yr = [Math.max(-9, Math.floor(lo) - 1), Math.min(9, Math.ceil(hi) + 1)]; return FIG.plot([{ f }], [], { xr: [-6, 6], yr, numbers: true, step: yr[1] - yr[0] > 12 ? 2 : 1, maxH: 300, label: lab }); };
  const bel = { ">": "strictement au-dessus de", ">=": "au-dessus de (ou sur)", "<": "strictement au-dessous de", "<=": "au-dessous de (ou sur)" };
  const IQ = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-9, 9), x0 = nz(-6, 6), c = a * x0 + b, op = pk(["<", "<=", ">", ">="]), fop = a < 0 ? flip[op] : op;
        return QI("Résous " + M(lin(a, b) + " " + opT[op] + " " + c) + ". Réponds par exemple « x > 4 ».", fop, x0, M(a + "x " + opT[op] + " " + (c - b)) + (a < 0 ? " ; on divise par " + M(a) + " (négatif), le sens change" : "") + " : " + M("x " + opT[fop] + " " + x0) + ".",
          { ctx: "lineaire", guide: [G("On retire " + M(b) + " des deux côtés : que vaut le membre de droite ?", c - b, M(c + sg(-b) + " = " + (c - b)) + "."), GI("On divise par " + M(a) + (a < 0 ? " (négatif : on retourne le signe)" : "") + ". Solution ?", fop, x0, M("x " + opT[fop] + " " + x0) + ".")],
            traps: [TI(op, x0, "En divisant par un nombre négatif, on retourne le sens de l'inégalité."), TI(fop, r6((c + b) / a), "On retire " + b + " (opération inverse).")] }); },
      () => { const p = pk([2, 3, 4]), q = pk([2, 3, 5]); if (p === q) return null; const a = nz(-5, 5), b = nz(-5, 5), k = nz(-3, 3), op = pk(["<=", ">=", "<", ">"]);
        const cf = q - p, cst = q * a - p * b, x0 = r6((p * q * k - cst) / cf), fop = cf < 0 ? flip[op] : op; if (den(x0) > 6) return null;
        return QI("Résous " + M("\\frac{" + lin(1, a) + "}{" + p + "} - \\frac{" + lin(1, b) + "}{" + q + "} " + opT[op] + " " + k) + ". (fractions acceptées)", fop, x0, "On multiplie par " + M(p * q) + " : " + M(q + "(" + lin(1, a) + ") - " + p + "(" + lin(1, b) + ") " + opT[op] + " " + p * q * k) + ", " + M(lin(cf, cst) + " " + opT[op] + " " + p * q * k) + ", " + M("x " + opT[fop] + " " + fT(x0)) + ".",
          { ctx: "fractions", guide: [G("On multiplie par " + M(p * q) + " et on développe. Coefficient de x ?", cf, M(q + " - " + p + " = " + cf) + "."), G("Terme constant (à gauche) ?", cst, M(q + " \\cdot " + pT(a) + " - " + p + " \\cdot " + pT(b) + " = " + cst) + "."), GI("Solution ?", fop, x0, M("x " + opT[fop] + " " + fT(x0)) + ".")],
            traps: [TI(op === fop ? flip[op] : op, x0, cf < 0 ? "Le coefficient de x est négatif : on retourne le sens." : "On ne retourne le sens que si on divise par un nombre négatif."), TI(fop, r6((k - cst) / cf), "Multiplie aussi le membre de droite par " + p * q + ".")] }); },
      () => { const a = pk([2, 3, 4, 5]), b = nz(-7, 7), lo = R.int(-5, 1), hi = lo + R.int(2, 6), L = a * lo + b, H = a * hi + b, li = R.rand() < 0.5, hiI = R.rand() < 0.5, ivs = [[lo, li, hi, hiI]];
        return QSS("Résous " + M(L + " " + (li ? "\\le" : "<") + " " + lin(a, b) + " " + (hiI ? "\\le" : "<") + " " + H) + " et écris la solution comme un intervalle.", ivs, "On retire " + M(b) + " puis on divise par " + M(a) + " dans les trois membres : " + M(lo + " " + (li ? "\\le" : "<") + " x " + (hiI ? "\\le" : "<") + " " + hi) + ", soit " + M(ivT(ivs)) + ".",
          { ctx: "encadrement", guide: [G("Borne de gauche ?", lo, M("(" + L + sg(-b) + ") \\div " + a + " = " + lo) + "."), G("Borne de droite ?", hi, M("(" + H + sg(-b) + ") \\div " + a + " = " + hi) + "."), GSS("Intervalle (crochet fermé si la borne est comprise) ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS([[lo, !li, hi, !hiI]], "Crochet fermé pour ≤, ouvert pour < : vérifie chaque borne."), TSS([[L - b, li, H - b, hiI]], "Divise aussi par " + a + ".")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), b = nz(-6, 6); if (a === b) return null; const lo = Math.min(a, b), hi = Math.max(a, b), op = pk(["<", "<=", ">", ">="]), inc = op.length === 2, inside = op[0] === "<";
        const ivs = inside ? [[lo, inc, hi, inc]] : [[-INF, false, lo, inc], [hi, inc, INF, false]], other = inside ? [[-INF, false, lo, inc], [hi, inc, INF, false]] : [[lo, inc, hi, inc]];
        return QSS("Résous " + M("(" + lin(1, -a) + ")(" + lin(1, -b) + ") " + opT[op] + " 0") + ".", ivs, "Zéros " + M(lo) + " et " + M(hi) + " ; le produit est positif à l'extérieur, négatif entre les zéros. " + M("S = " + ivT(ivs)) + ".",
          { ctx: "produit", guide: [G("Plus petit zéro ?", lo, M(lo) + "."), G("Plus grand zéro ?", hi, M(hi) + "."), GSS("Tableau des signes : ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Le produit est " + (inside ? "négatif entre les zéros." : "positif à l'extérieur des zéros.")), TSS(inside ? [[-hi, inc, -lo, inc]] : [[-INF, false, -hi, inc], [-lo, inc, INF, false]], "(x − a) s'annule en x = a : attention aux signes.")] }); },
      () => { const k = nz(-8, 8), op = pk(["<=", ">=", "<", ">"]), inc = op.length === 2, inside = op[0] === "<", lo = Math.min(0, k), hi = Math.max(0, k);
        const ivs = inside ? [[lo, inc, hi, inc]] : [[-INF, false, lo, inc], [hi, inc, INF, false]];
        return QSS("Résous " + M("x^2" + tm(-k, "x") + " " + opT[op] + " 0") + ".", ivs, M("x(" + lin(1, -k) + ") " + opT[op] + " 0") + " ; zéros " + M(lo) + " et " + M(hi) + ", donc " + M("S = " + ivT(ivs)) + ".",
          { ctx: "mise-en-evidence", guide: [G("On factorise " + M("x(" + lin(1, -k) + ")") + ". Plus petit zéro ?", lo, M(lo) + "."), G("Plus grand ?", hi, M(hi) + "."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(inside ? [[-INF, false, lo, inc], [hi, inc, INF, false]] : [[lo, inc, hi, inc]], "Coefficient de x² positif : la parabole est négative entre les zéros.")] }); },
      () => { const r1 = nz(-6, 6), r2 = nz(-6, 6); if (r1 === r2) return null; const lo = Math.min(r1, r2), hi = Math.max(r1, r2), op = pk(["<", ">"]), inside = op === "<";
        const ivs = inside ? [[lo, false, hi, false]] : [[-INF, false, lo, false], [hi, false, INF, false]];
        return QSS("Résous " + M(polyT([1, -(r1 + r2), r1 * r2]) + " " + op + " 0") + ".", ivs, M(polyT([1, -(r1 + r2), r1 * r2]) + " = (x" + sg(-lo) + ")(x" + sg(-hi) + ")") + ", donc " + M("S = " + ivT(ivs)) + ".",
          { ctx: "trinome", guide: [G("Plus petit zéro du trinôme ?", lo, M(lo) + "."), G("Plus grand ?", hi, M(hi) + "."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(inside ? [[-INF, false, lo, false], [hi, false, INF, false]] : [[lo, false, hi, false]], "Le trinôme (a > 0) est négatif entre ses zéros, positif à l'extérieur."), TSS(inside ? [[lo, true, hi, true]] : [[-INF, false, lo, true], [hi, true, INF, false]], "Inégalité stricte : les zéros sont exclus.")] }); },
      () => { const r1 = nz(-5, 5), r2 = nz(-5, 5); if (Math.abs(r1 - r2) < 2) return null; const rs = [Math.min(r1, r2), Math.max(r1, r2)], a = pk([1, -1, 0.5, -0.5]), vy = (-a * (rs[1] - rs[0]) ** 2) / 4; if (Math.abs(vy) > 8 || Math.abs(vy) < 1) return null;
        const op = pk(["<", "<=", ">", ">="]), f = (x) => a * (x - rs[0]) * (x - rs[1]), ivs = sgnIv(rs, a, op), other = sgnIv(rs, -a, op), fig = sgnFig(f, rs, "parabole");
        return QSS("Le graphique montre la parabole d'une fonction " + M("f") + ". Sans calcul, résous " + M("f(x) " + opT[op] + " 0") + " en lisant le signe sur le graphique, et écris la solution avec des intervalles.", ivs,
          "La parabole coupe l'axe des x en " + M(rs[0]) + " et " + M(rs[1]) + " ; elle est tournée vers le " + (a > 0 ? "haut" : "bas") + ", donc " + (a > 0 ? "négative entre les zéros et positive à l'extérieur" : "positive entre les zéros et négative à l'extérieur") + ". On garde les x où la courbe est " + bel[op] + " l'axe : " + M("S = " + ivT(ivs)) + ".",
          { ctx: "signe-graphe-parabole", fig, guide: [G("Plus petit zéro (où la courbe coupe l'axe des x) ?", rs[0], M(rs[0]) + "."), G("Plus grand zéro ?", rs[1], M(rs[1]) + "."), GSS("Où la courbe est-elle " + bel[op] + " l'axe des x ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Relis le graphique : f(x) " + (op[0] === ">" ? "> 0" : "< 0") + " là où la courbe est " + (op[0] === ">" ? "au-dessus" : "au-dessous") + " de l'axe."), TSS(sgnIv(rs, a, op.length === 2 ? op[0] : op + "="), op.length === 2 ? "Avec ≤ ou ≥, les zéros sont compris (crochets fermés)." : "Inégalité stricte : les zéros sont exclus (crochets ouverts)."), TSS(sgnIv([-rs[1], -rs[0]], a, op), "Lis les zéros sur l'axe horizontal : attention aux signes.")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, 3]), b = nz(-6, 6), c = pk([1, 2]), d = nz(-6, 6), z = r6(-b / a), p = r6(-d / c); if (z === p || den(z) > 3 || den(p) > 2) return null; const op = pk([">=", "<="]), lo = Math.min(z, p), hi = Math.max(z, p), zl = z < p;
        const ivs = op === ">=" ? [[-INF, false, lo, zl], [hi, !zl, INF, false]] : [[lo, zl, hi, !zl]];
        return QSS("Résous " + M("\\frac{" + lin(a, b) + "}{" + lin(c, d) + "} " + opT[op] + " 0") + ". (fractions acceptées)", ivs, "Zéro du numérateur " + M(fT(z)) + " (compris), valeur interdite " + M(fT(p)) + " (exclue). Tableau des signes : " + M("S = " + ivT(ivs)) + ".",
          { ctx: "quotient", guide: [G("Zéro du numérateur ?", z, M(fT(z)) + "."), G("Valeur interdite (zéro du dénominateur) ?", p, M(fT(p)) + " : toujours exclue."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(op === ">=" ? [[-INF, false, lo, true], [hi, true, INF, false]] : [[lo, true, hi, true]], "La valeur interdite " + T(p) + " est toujours exclue (crochet ouvert)."), TSS(op === ">=" ? [[lo, zl, hi, !zl]] : [[-INF, false, lo, zl], [hi, !zl, INF, false]], "Refais le tableau des signes : le quotient est " + (op === ">=" ? "positif à l'extérieur." : "négatif entre les deux valeurs."))] }); },
      () => { const rs = sortU([nz(-6, 6), nz(-6, 6), nz(-6, 6)]); if (rs.length < 3) return null; const pole = pk(rs), zs = rs.filter((r) => r !== pole), [a, b, c] = rs;
        const ivs = [[-INF, false, a, a !== pole], [b, b !== pole, c, c !== pole]], other = [[a, a !== pole, b, b !== pole], [c, c !== pole, INF, false]];
        return QSS("Résous " + M("\\frac{(" + lin(1, -zs[0]) + ")(" + lin(1, -zs[1]) + ")}{" + lin(1, -pole) + "} \\le 0") + ".", ivs, "Zéros " + M(zs[0]) + " et " + M(zs[1]) + ", valeur interdite " + M(pole) + ". Signes de gauche à droite : − + − +. " + M("S = " + ivT(ivs)) + ".",
          { ctx: "tableau-signes", guide: [G("Plus petite valeur remarquable (zéro ou valeur interdite) ?", a, M(a) + "."), G("Signe tout à gauche (−1 ou 1) ?", -1, "Négatif : trois facteurs négatifs."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Tout à gauche, les trois facteurs sont négatifs : le quotient est négatif."), TSS([[-INF, false, a, true], [b, true, c, true]], "La valeur interdite " + pole + " est exclue.")] }); },
      () => { const k = pk([2, 3, 4, 5, 0.5]), op = pk(["<", ">"]), z = r6(1 / k);
        const ivs = op === "<" ? [[-INF, false, 0, false], [z, false, INF, false]] : [[0, false, z, false]];
        return QSS("Résous " + M("\\frac{1}{x} " + op + " " + fT(k)) + ". (fractions acceptées)", ivs, "On ne multiplie pas par x (signe inconnu) : " + M("\\frac{1 - " + fT(k) + "x}{x} " + op + " 0") + ", zéro " + M(fT(z)) + ", valeur interdite " + M(0) + ", donc " + M("S = " + ivT(ivs)) + ".",
          { ctx: "inverse", guide: [G("On écrit " + M("\\frac{1 - " + fT(k) + "x}{x}") + ". Zéro du numérateur ?", z, M(fT(z)) + "."), G("Valeur interdite ?", 0, "0."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(op === "<" ? [[z, false, INF, false]] : [[-INF, false, z, false]], "Pense aux x négatifs : 1/x y est négatif."), TSS(op === "<" ? [[0, false, z, false]] : [[-INF, false, 0, false], [z, false, INF, false]], "Refais le tableau des signes de (1 − " + T(k) + "x) ÷ x.")] }); },
    ],
  };

  // ===================================== I1. fctmp : réciproque, parité, transformations, composition =====================================
  const FC = {
    1: [
      () => { /* audit niveau 25.11 : « f paire, f(2) = 8, f(−2) ? » (parité facultative, réponse lue dans l'énoncé) -> réciproque d'une fonction bijective restreinte (examen TASV 2023, p. 6) */
        const c = nz(-9, 12), s0 = R.int(2, 7), neg = R.rand() < 0.5, v = neg ? c - s0 * s0 : s0 * s0 + c, x0 = neg ? -s0 : s0;
        const fx = neg ? c + " - x^2" : "x^2" + sg(c), dom = neg ? "]-\\infty \\,;\\, 0]" : "[0 \\,;\\, +\\infty[", img = neg ? "]-\\infty \\,;\\, " + c + "]" : "[" + c + " \\,;\\, +\\infty[";
        return QN("La fonction " + M("f(x) = " + fx) + " est bijective de " + M(dom) + " vers " + M(img) + ". Calcule " + M("f^{-1}(" + v + ")") + ".", x0, M("f^{-1}(" + v + ")") + " est le nombre " + M("x") + " de " + M(dom) + " tel que " + M(fx + " = " + v) + " : " + M("x^2 = " + s0 * s0) + ", " + M("x = \\pm " + s0) + " ; on garde " + M("x = " + x0) + (neg ? " (négatif)" : " (positif)") + ".",
          { ctx: "reciproque-restreinte", guide: [G("On résout " + M(fx + " = " + v) + " : " + M("x^2") + " = ?", s0 * s0, M("x^2 = " + s0 * s0) + "."), G(M("x") + " dans " + M(dom) + " ?", x0, M("x = " + x0) + " (" + M("-" + s0) + " et " + M(s0) + " ont la même image ; seul " + M(x0) + " est dans l'ensemble de départ).")],
            traps: [TR(-x0, "Les deux nombres ±" + s0 + " ont la même image ; f est définie sur " + (neg ? "les négatifs" : "les positifs") + " seulement."), TR(neg ? c - v * v : v * v + c, "C'est f(" + v + ") ; la réciproque fait le chemin inverse."), TR(s0 * s0, "On cherche x, pas x².")] }); },
      () => { /* audit niveau 25.11 : réciproque d'une fonction affine = MP 2e (S3.FA.06) -> fonction cubique bijective de ℝ vers ℝ (S8.FP.03) */
        const a = pk([2, 3, 4, -2, -1]), b = nz(-9, 9), x0 = pk([-3, -2, 2, 3]), y = a * x0 ** 3 + b, ax = a === 1 ? "" : a === -1 ? "-" : a;
        return QN("La fonction " + M("f(x) = " + ax + "x^3" + sg(b)) + " est bijective de " + M("\\mathbb{R}") + " vers " + M("\\mathbb{R}") + ". Calcule " + M("f^{-1}(" + y + ")") + ".", x0, "On résout " + M(ax + "x^3" + sg(b) + " = " + y) + " : " + M(a + "x^3 = " + (y - b)) + ", " + M("x^3 = " + x0 ** 3) + ", " + M("x = \\sqrt[3]{" + x0 ** 3 + "} = " + x0) + ".",
          { ctx: "reciproque-cube-valeur", guide: [G("On isole : " + M("x^3") + " = ?", x0 ** 3, M("x^3 = " + (y - b) + " \\div " + pT(a) + " = " + x0 ** 3) + "."), G(M("x") + " (racine cubique) ?", x0, M("\\sqrt[3]{" + x0 ** 3 + "} = " + x0) + ".")],
            traps: [TR(a * y ** 3 + b, "C'est f(" + y + ") ; la réciproque fait le chemin inverse."), TR(x0 ** 3, "On cherche x : prends encore la racine cubique de x³."), TR(-x0, "Une racine cubique garde le signe : ∛(" + x0 ** 3 + ") = " + x0 + ".")] }); },
      () => { const h = nz(-4, 4), k = nz(-5, 5), x1 = R.int(-3, 3), v1 = nz(-6, 6), x = x1 + h, val = v1 + k; if (!val) return null;
        return QN("On sait que " + M("f(" + x1 + ") = " + v1) + ". Soit " + M("g(x) = f(" + lin(1, -h) + ")" + sg(k)) + ". Que vaut " + M("g(" + x + ")") + " ?", val, M("g(" + x + ") = f(" + x + sg(-h) + ")" + sg(k) + " = f(" + x1 + ")" + sg(k) + " = " + val) + ". (Le graphe de f est translaté de " + M(h) + " horizontalement et de " + M(k) + " verticalement.)",
          { ctx: "translation", guide: [G("Argument de f, " + M(x + sg(-h)) + " ?", x1, M(x1) + "."), G(M("g(" + x + ")") + " = ?", val, M(v1 + sg(k) + " = " + val) + ".")],
            traps: [TR(v1 - k, "On ajoute " + k + " (translation verticale)."), TR(r6(v1 + k + h), "Le décalage dans la parenthèse agit sur x, il ne s'ajoute pas au résultat.")] }); },
    ],
    2: [
      () => { const t = R.rand() < 0.5, b = nz(-8, 8), mb = b < 0 ? "+" + -b : "-" + b;
        if (t) return QX("Soit " + M("f(x) = x^3" + sg(b)) + ". Donne l'expression de " + M("f^{-1}(x)") + " (racine cubique : écris cbrt(…) ou ∛).", "cbrt(x" + mb + ")", M("y = x^3" + sg(b) + " \\iff x = \\sqrt[3]{y" + sg(-b) + "}") + ", donc " + M("f^{-1}(x) = \\sqrt[3]{x" + sg(-b) + "}") + ".",
          { ctx: "reciproque-cube", guide: [GX("On isole " + M("x^3") + " dans " + M("y = x^3" + sg(b)) + " : " + M("x^3") + " = ? (en fonction de y)", "y" + mb, M("y" + sg(-b)) + "."), GX("Racine cubique, puis on renomme y en x : " + M("f^{-1}(x)") + " = ?", "cbrt(x" + mb + ")", M("\\sqrt[3]{x" + sg(-b) + "}") + ".")],
            traps: [TX("cbrt(x)" + mb, "On retire " + b + " AVANT de prendre la racine cubique."), TX("1/(x^3" + (b < 0 ? "-" + -b : "+" + b) + ")", "La réciproque n'est pas l'inverse 1/f.")] });
        const a = R.int(1, 6);
        return QX("Soit " + M("f(x) = \\sqrt{x - " + a + "}") + " (pour " + M("x \\ge " + a) + "). Donne l'expression de " + M("f^{-1}(x)") + " (pour " + M("x \\ge 0") + ").", "x^2+" + a, M("y = \\sqrt{x - " + a + "} \\iff y^2 = x - " + a + " \\iff x = y^2 + " + a) + " : " + M("f^{-1}(x) = x^2 + " + a) + ".",
          { ctx: "reciproque-racine", pos: true, guide: [GX("On élève " + M("y = \\sqrt{x - " + a + "}") + " au carré et on isole x : x = ? (en fonction de y)", "y^2+" + a, M("y^2 + " + a) + "."), GX("On renomme y en x : " + M("f^{-1}(x)") + " = ?", "x^2+" + a, M("x^2 + " + a) + ".")],
            traps: [TX("x^2-" + a, "y² = x − " + a + " donne x = y² + " + a + "."), TX("(x+" + a + ")^2", "On élève d'abord au carré, puis on ajoute " + a + ".")] }); },
      () => { const a = nz(-3, 3), b = nz(-5, 5), c = R.int(1, 3), x0 = nz(-3, 3), g0 = a * x0 + b; if (!g0 || Math.abs(g0) === 1) return null; const val = c * g0 * g0, fx = c === 1 ? "x^2" : c + "x^2";
        return QN("Soit " + M("f(x) = " + fx) + " et " + M("g(x) = " + lin(a, b)) + ". Calcule " + M("(f \\circ g)(" + x0 + ") = f(g(" + x0 + "))") + ".", val, M("g(" + x0 + ") = " + g0) + ", puis " + M("f(" + g0 + ") = " + (c === 1 ? "" : c + " \\cdot ") + pT(g0) + "^2 = " + val) + ".",
          { ctx: "composition", guide: [G("D'abord " + M("g(" + x0 + ")") + " ?", g0, M(g0) + "."), G("Puis " + M("f(" + g0 + ")") + " ?", val, M(val) + ".")],
            traps: [TR(a * c * x0 * x0 + b, "f ∘ g : on applique g d'abord, puis f."), TR(c * x0 * x0 + g0, "C'est f(g(x)), une composition, pas une somme.")] }); },
      () => { const px = nz(-4, 4), py = nz(-6, 6), k = pk([2, 3, -1, 0.5]), hor = R.rand() < 0.5, Q = hor ? [r6(px / k), py] : [px, r6(k * py)]; if (Q.some((v) => !Number.isInteger(v * 2))) return null;
        return QP("Le point " + pt(px, py) + " est sur le graphe de " + M("f") + ". Donne le point correspondant du graphe de " + M("g(x) = " + (hor ? "f(" + co(k) + "x)" : co(k) + "f(x)")) + "." + PAIR + " (fractions acceptées)", Q, hor ? M("g(x) = f(" + co(k) + "x)") + " : les abscisses sont divisées par " + M(fT(k)) + ", d'où " + pt(...Q) + "." : M("g(x) = " + co(k) + "f(x)") + " : les ordonnées sont multipliées par " + M(fT(k)) + ", d'où " + pt(...Q) + ".",
          { ctx: hor ? "compression-x" : "etirement-y", guide: [G(hor ? "Nouvelle abscisse (" + M(co(k) + "x = " + px) + ") ?" : "Abscisse (inchangée) ?", Q[0], M(fT(Q[0])) + "."), G(hor ? "Ordonnée (inchangée) ?" : "Nouvelle ordonnée ?", Q[1], M(fT(Q[1])) + "."), GP("Point ?", Q, pt(...Q) + ".")],
            traps: [TP(hor ? [r6(px * k), py] : [r6(px / k), py], hor ? "f(kx) : on cherche x tel que kx = " + px + ", on divise par k." : "k · f(x) agit sur les ordonnées, pas sur les abscisses."), TP(hor ? [px, r6(py * k)] : [px, r6(py / k)], hor ? "f(kx) agit sur les abscisses." : "k · f(x) multiplie l'ordonnée par k.")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), b = nz(-5, 5), c = nz(-3, 3), d = nz(-5, 5), ex = "(" + c + ")*(" + a + "*x+(" + b + "))^2+(" + d + ")", cT = c === 1 ? "" : c === -1 ? "-" : c;
        return QX("Soit " + M("f(x) = " + cT + "x^2" + sg(d)) + " et " + M("g(x) = " + lin(a, b)) + ". Donne l'expression de " + M("(f \\circ g)(x)") + ".", ex, M("(f \\circ g)(x) = f(" + lin(a, b) + ") = " + cT + "(" + lin(a, b) + ")^2" + sg(d)) + " (développée ou non).",
          { ctx: "composee-expr", guide: [G("Terme constant de " + M("g(x)") + " ?", b, M(b) + "."), GX("On remplace x par " + M("g(x)") + " dans f : résultat ?", ex, M(cT + "(" + lin(a, b) + ")^2" + sg(d)) + ".")],
            traps: [TX("(" + a + ")*((" + c + ")*x^2+(" + d + "))+(" + b + ")", "Ça, c'est g ∘ f : ici on applique g d'abord."), TX("(" + c + ")*(" + a + "*x+(" + b + "))+(" + d + ")", "N'oublie pas le carré de g(x).")] }); },
      () => { const a = pk([2, 3, 4, -2, -3]), b = nz(-9, 9), x0 = r6(-b / a); if (den(x0) > 4) return null; const op = a > 0 ? ">=" : "<=";
        return QI("Quel est l'ensemble de définition de " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + " ? Réponds par exemple « x >= 3 ».", op, x0, "Il faut " + M(lin(a, b) + " \\ge 0") + ", soit " + M("x " + opT[op] + " " + fT(x0)) + (a < 0 ? " (on divise par un négatif : le sens change)" : "") + ".",
          { ctx: "domaine-racine", guide: [G("Pour quelle valeur de x le radicand s'annule-t-il ?", x0, M(fT(x0)) + "."), GI("On résout " + M(lin(a, b) + " \\ge 0") + " : solution ?", op, x0, M("x " + opT[op] + " " + fT(x0)) + ".")],
            traps: [TI(a > 0 ? ">" : "<", x0, "La racine de 0 existe : l'inégalité est large."), TI(flip[op], x0, a < 0 ? "On divise par " + a + " (négatif) : le sens change." : "Le radicand doit être positif ou nul.")] }); },
      () => { /* audit niveau 25.11 : intersection parabole-droite = MP 2e (S3.FQ.06) -> racine et droite, solution parasite (examens TASV spécifique 2022 p. 4, 2024 p. 5) */
        const x0 = R.int(-3, 8), s0 = R.int(1, 6), q = s0 - x0, pp = s0 * s0 - x0, x1 = 1 - 2 * q - x0; if (x1 === x0 || x1 + q >= 0 || x1 + pp < 0 || !pp || !q) return null;
        const rad = "\\sqrt{" + lin(1, pp) + "}", gx = lin(1, q);
        return QP("Détermine les coordonnées du point d'intersection des graphes de " + M("f(x) = " + rad) + " et " + M("g(x) = " + gx) + "." + PAIR, [x0, s0], "On résout " + M(rad + " = " + gx) + " : au carré, " + M(lin(1, pp) + " = (" + gx + ")^2") + ", soit " + M(polyT([1, 2 * q - 1, q * q - pp]) + " = 0") + ", d'où " + M("x = " + x0) + " ou " + M("x = " + x1) + ". Vérification : pour " + M("x = " + x1) + ", " + M("g(" + x1 + ") = " + (x1 + q) + " < 0") + " alors qu'une racine est positive : solution parasite. Point " + pt(x0, s0) + ".",
          { ctx: "intersection-racine", guide: [GSet("Après élévation au carré : solutions de " + M(polyT([1, 2 * q - 1, q * q - pp]) + " = 0") + " ?", [x0, x1], M(setT([x0, x1])) + "."), G("Abscisse retenue (vérifie " + M("g(x) \\ge 0") + ") ?", x0, M("x = " + x0) + " ; " + M("x = " + x1) + " est parasite."), GP("Point d'intersection ?", [x0, s0], pt(x0, s0) + ".")],
            traps: [TP([x1, x1 + q], "Vérifie dans l'équation de départ : pour x = " + x1 + ", la droite est sous l'axe, la racine non (solution parasite)."), TP([s0, x0], "Un point s'écrit (abscisse ; ordonnée)."), TP([x0, s0 * s0], "L'ordonnée est f(" + x0 + ") = √" + (x0 + pp) + " = " + s0 + ".")] }); },
    ],
  };

  // ===================================== I2. polymp : polynômes =====================================
  const expand = (roots, a = 1) => roots.reduce((cs, r) => { const o = cs.concat(0); for (let i = o.length - 1; i > 0; i--) o[i] -= r * o[i - 1]; return o; }, [a]);
  const pv = (cs, x) => cs.reduce((s, c) => s * x + c, 0);
  const pE = (cs) => polyT(cs).replace(/\^\{(\d+)\}/g, "^$1").replace(/(\d)x/g, "$1*x").replace(/\s+/g, "");
  const PO = {
    1: [
      () => { /* audit niveau 25.11 : « calcule P(2) » (substitution : niveau CO) -> mise en évidence de x puis trinôme (S8.FP.07) */
        const r1 = nz(-6, 6), r2 = nz(-6, 6), a = pk([1, 1, 2, -1]); if (r1 === r2 || r1 === -r2) return null; const cs = [a, -a * (r1 + r2), a * r1 * r2, 0], sol = [0, r1, r2];
        return QS("Trouve les zéros de " + M("P(x) = " + polyT(cs)) + ".", sol, "Mise en évidence : " + M("P(x) = x\\left(" + polyT([a, -a * (r1 + r2), a * r1 * r2]) + "\\right)") + ", puis le trinôme : " + M("x = " + r1) + " ou " + M("x = " + r2) + ". " + M(setT(sol)) + ".",
          { ctx: "mise-en-evidence", guide: [GSet("On met " + M("x") + " en évidence ; zéros du trinôme " + M(polyT([a, -a * (r1 + r2), a * r1 * r2])) + " ?", [r1, r2], M(setT([r1, r2])) + "."), GSet("Tous les zéros de " + M("P") + " ?", sol, M(setT(sol)) + " (n'oublie pas " + M("x = 0") + ").")],
            traps: [TS([r1, r2], "La mise en évidence donne aussi le zéro x = 0."), TS([0, -r1, -r2], "Attention aux signes : (x − a) s'annule en x = a.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5), k = pk([2, 3]), c = nz(-5, 5), z3 = r6(c / k); if (a === b || z3 === a || z3 === b || Number.isInteger(z3)) return null; const sol = [a, b, z3];
        return QS("Donne les zéros de " + M("P(x) = (" + lin(1, -a) + ")(" + lin(1, -b) + ")(" + lin(k, -c) + ")") + ". (fractions acceptées)", sol, "Un produit est nul si un facteur est nul : " + M(setT(sol)) + ".",
          { ctx: "produit-nul", guide: [G("Zéro du troisième facteur " + M(lin(k, -c)) + " ?", z3, M(fT(z3)) + "."), GSet("Tous les zéros ?", sol, M(setT(sol)) + ".")],
            traps: [TS([-a, -b, -z3], "x − a = 0 donne x = a : attention aux signes."), TS([a, b, c], k + "x − " + c + " = 0 donne x = " + c + " ÷ " + k + ".")] }); },
      () => { const r = nz(-3, 3), b = R.int(-4, 4), d = nz(-9, 9), s0 = r ** 3 + b * r * r + d, c = r6(-s0 / r); if (!Number.isInteger(c) || !c || Math.abs(r) === 1 && Math.abs(c) > 12) return null;
        return QN("Le nombre " + M(r) + " est un zéro de " + M("P(x) = x^3" + tm(b, "x^{2}") + " + cx" + sg(d)) + ". Que vaut " + M("c") + " ?", c, M("P(" + r + ") = 0") + " : " + M(pT(r) + "^3" + (b ? sg(b) + " \\cdot " + pT(r) + "^2" : "") + " + " + pT(r) + " c" + sg(d) + " = 0") + ", " + M("c = " + c) + ".",
          { ctx: "coefficient", guide: [G("Valeur de " + M("P(" + r + ")") + " sans le terme en c ?", s0, M(s0) + "."), G(M("c") + " = ?", c, M(c) + ".")],
            traps: [TR(-c, "Attention au signe en isolant c."), TR(-s0, "Divise par " + r + ".")] }); },
    ],
    2: [
      () => { const a = nz(-4, 4), q = [1, R.int(-4, 4), R.int(-6, 6)], rest = nz(-6, 6), Pcs = [q[0], q[1] - a * q[0], q[2] - a * q[1], -a * q[2] + rest];
        return QX("Effectue la division de " + M("P(x) = " + polyT(Pcs)) + " par " + M(lin(1, -a)) + ". Donne le quotient.", pE(q), "Division (ou schéma de Horner) : quotient " + M(polyT(q)) + ", reste " + M(rest) + ".",
          { ctx: "division", guide: [G("Coefficient de " + M("x") + " dans le quotient ?", q[1], M(q[1]) + "."), G("Terme constant du quotient ?", q[2], M(q[2]) + "."), GX("Quotient ?", pE(q), M(polyT(q)) + ".")],
            traps: [TX(pE([q[0], q[1] + 2 * a * q[0], q[2]]), "Divise par (x − " + a + ") : à chaque étape, on multiplie par " + a + " et on soustrait."), TX(pE(Pcs.slice(0, 3)), "Le quotient n'est pas le début de P : il faut faire la division.")] }); },
      () => { const cs = [pk([1, 2, -1, 3]), R.int(-5, 5), R.int(-6, 6), nz(-9, 9)], a = nz(-3, 3), rst = pv(cs, a); if ([0, 1, -1].includes(rst)) return null;
        return QN("Quel est le reste de la division de " + M("P(x) = " + polyT(cs)) + " par " + M(lin(1, -a)) + " ?", rst, "Théorème du reste : le reste vaut " + M("P(" + a + ") = " + rst) + ".",
          { ctx: "reste", guide: [G("Le reste de la division par " + M(lin(1, -a)) + " est " + M("P(" + a + ")") + ". Terme en " + M("x^3") + " ?", cs[0] * a ** 3, M(cs[0] * a ** 3) + "."), G(M("P(" + a + ")") + " = ?", rst, M(rst) + ".")],
            traps: [TR(pv(cs, -a), "On divise par (x − " + a + ") : le reste est P(" + a + "), pas P(" + -a + ")."), TR(cs[3], "Le reste n'est pas le terme constant : calcule P(" + a + ").")] }); },
      () => { const r1 = pk([1, -1, 2, -2]), r2 = nz(-5, 5), r3 = nz(-5, 5); if (new Set([r1, r2, r3]).size < 3) return null; const cs = expand([r1, r2, r3]), others = [r2, r3];
        return QS("Le nombre " + M(r1) + " est un zéro de " + M("P(x) = " + polyT(cs)) + ". Trouve les autres zéros.", others, "On divise par " + M(lin(1, -r1)) + " : " + M(polyT(expand([r2, r3]))) + ", dont les zéros sont " + M(Math.min(r2, r3)) + " et " + M(Math.max(r2, r3)) + ".",
          { ctx: "zero-connu", guide: [GX("Quotient de la division par " + M(lin(1, -r1)) + " ?", pE(expand([r2, r3])), M(polyT(expand([r2, r3]))) + "."), GSet("Zéros de ce quotient ?", others, M(setT(others)) + ".")],
            traps: [TS([-r2, -r3], "Attention aux signes des zéros."), TS([r1, r2, r3], "On demande les autres zéros (sans " + r1 + ").")] }); },
    ],
    3: [
      () => { const r1 = pk([1, -1, 2, -2, 3]), r2 = nz(-4, 4), r3 = nz(-4, 4); if (new Set([r1, r2, r3]).size < 3) return null; const cs = expand([r1, r2, r3]), sol = [r1, r2, r3];
        return QS("Trouve tous les zéros de " + M("P(x) = " + polyT(cs)) + " (cherche d'abord un zéro « évident » parmi les diviseurs du terme constant).", sol, "Essai : " + M("P(" + r1 + ") = 0") + ". Division par " + M(lin(1, -r1)) + " : " + M(polyT(expand([r2, r3]))) + ". " + M(setT(sol)) + ".",
          { ctx: "racine-evidente", guide: [G("Un zéro évident (essaie ±1, ±2, ±3) ?", r1, M("P(" + r1 + ") = 0") + "."), GX("Quotient par " + M(lin(1, -r1)) + " ?", pE(expand([r2, r3])), M(polyT(expand([r2, r3]))) + "."), GSet("Tous les zéros ?", sol, M(setT(sol)) + ".")],
          traps: [TS(sol.map((v) => -v), "Attention aux signes."), TS([r2, r3], "N'oublie pas le zéro évident " + r1 + ".")] }); },
      () => { const rs = sortU([nz(-5, 5), nz(-5, 5), nz(-5, 5)]); if (rs.length < 3) return null; const [a, b, c] = rs, op = pk([">=", "<="]);
        const ivs = op === ">=" ? [[a, true, b, true], [c, true, INF, false]] : [[-INF, false, a, true], [b, true, c, true]];
        return QSS("Résous " + M("(" + lin(1, -a) + ")(" + lin(1, -b) + ")(" + lin(1, -c) + ") " + opT[op] + " 0") + ".", ivs, "Zéros " + M(a) + ", " + M(b) + ", " + M(c) + " ; signes de gauche à droite : − + − +. " + M("S = " + ivT(ivs)) + ".",
          { ctx: "signe-degre3", guide: [G("Plus petit zéro ?", a, M(a) + "."), G("Signe du produit tout à gauche (−1 ou 1) ?", -1, "Négatif : trois facteurs négatifs."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(op === ">=" ? [[-INF, false, a, true], [b, true, c, true]] : [[a, true, b, true], [c, true, INF, false]], "Tout à gauche, le produit de trois facteurs négatifs est négatif."), TSS(op === ">=" ? [[c, true, INF, false]] : [[-INF, false, a, true]], "Il y a deux intervalles : le signe change à chaque zéro.")] }); },
      () => { const rs = sortU([nz(-4, 4), nz(-4, 4), nz(-4, 4)]); if (rs.length < 3) return null; const a = pk([2, -1, -2, 3, 0.5]), pr = -rs[0] * rs[1] * rs[2], y0 = a * pr;
        return QN("Un polynôme de degré 3 a pour zéros " + M(rs.join(" \\,;\\, ")) + " et son graphe coupe l'axe vertical en " + M(fT(y0)) + ". Il s'écrit " + M("P(x) = a(" + rs.map((r) => lin(1, -r)).join(")(") + ")") + ". Que vaut " + M("a") + " ? (fraction acceptée)", a, M("P(0) = a \\cdot " + rs.map((r) => pT(-r)).join(" \\cdot ") + " = " + fT(pr) + "a") + " ; " + M(fT(pr) + "a = " + fT(y0)) + ", " + M("a = " + fT(a)) + ".",
          { ctx: "depuis-graphe", guide: [G("Produit " + M(rs.map((r) => pT(-r)).join(" \\cdot ")) + " ?", pr, M(fT(pr)) + "."), G(M("a") + " = ?", a, M(fT(y0) + " \\div " + pT(pr) + " = " + fT(a)) + ".")],
            traps: [TR(y0, "C'est P(0) ; divise par le produit."), TR(-a, "Attention aux signes : P(0) = a · (−r₁)(−r₂)(−r₃).")] }); },
      () => { const rs = sortU([nz(-4, 4), nz(-4, 4), nz(-4, 4)]); if (rs.length < 3 || rs[1] - rs[0] < 2 && rs[2] - rs[1] < 2) return null; const a = pk([0.5, 1, -0.5, -1]), op = pk(["<", "<=", ">", ">="]), f = (x) => a * (x - rs[0]) * (x - rs[1]) * (x - rs[2]);
        if ([0, 1].some((i) => Math.abs(f((rs[i] + rs[i + 1]) / 2)) < 0.8 || Math.abs(f((rs[i] + rs[i + 1]) / 2)) > 9)) return null;
        const ivs = sgnIv(rs, a, op), other = sgnIv(rs, -a, op), fig = sgnFig(f, rs, "courbe d'un polynôme de degré 3"), sgL = (a > 0 ? ["−", "+", "−", "+"] : ["+", "−", "+", "−"]).join(" ");
        return QSS("Le graphique montre la courbe d'un polynôme " + M("P") + " de degré 3. Dresse son tableau des signes à partir du graphique, puis résous " + M("P(x) " + opT[op] + " 0") + " (avec des intervalles).", ivs,
          "Zéros lus sur l'axe des x : " + M(rs.join(" \\,;\\, ")) + ". Signes de gauche à droite : " + sgL + ". On garde les x où la courbe est " + bel[op] + " l'axe : " + M("S = " + ivT(ivs)) + ".",
          { ctx: "signe-graphe-degre3", fig, guide: [G("Plus petit zéro ?", rs[0], M(rs[0]) + "."), G("Signe de " + M("P(x)") + " tout à gauche (−1 ou 1) ?", a > 0 ? -1 : 1, a > 0 ? "Négatif : la courbe arrive d'en bas." : "Positif : la courbe arrive d'en haut."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Relis le tableau des signes : la courbe " + (a > 0 ? "arrive d'en bas (négative tout à gauche)." : "arrive d'en haut (positive tout à gauche).")), TSS(sgnIv(rs, a, op.length === 2 ? op[0] : op + "="), op.length === 2 ? "Avec ≤ ou ≥, les zéros sont compris (crochets fermés)." : "Inégalité stricte : les zéros sont exclus."), TSS(ivs.slice(0, 1), "Il y a deux intervalles : le signe change à chaque zéro.")] }); },
    ],
  };

  // ===================================== J1. sinusmp : fonctions sinusoïdales =====================================
  const piT = (k) => { const d = den(k), n = Math.round(k * d); return (n < 0 ? "-" : "") + (d === 1 ? (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\pi" : "\\frac{" + (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\pi}{" + d + "}"); };
  const sinT = (a, b, d) => co(a) + "\\sin(" + (b === 1 ? "" : fT(b)) + "x)" + (d ? sg(d) : "");
  const SN = {
    1: [
      () => { const lo = R.int(-10, 10), A = R.int(2, 15), axe = R.rand() < 0.5, roue = R.rand() < 0.5, L = roue ? lo + 22 : lo, H = L + 2 * A;
        const txt = roue ? "La hauteur d'une nacelle de grande roue varie entre " + M(L) + " m et " + M(H) + " m." : "La température d'une ville varie au cours de l'année entre " + M(L + "°") + " C et " + M(H + "°") + " C.";
        return QN(txt + " On la modélise par " + M("f(x) = a \\sin(b x) + d") + ". " + (axe ? "Que vaut " + M("d") + " (l'axe) ?" : "Que vaut l'amplitude " + M("a") + " (positive) ?"), axe ? (L + H) / 2 : A, (axe ? "Axe : moyenne du maximum et du minimum, " + M("d = \\frac{" + H + sg(L) + "}{2} = " + fT((L + H) / 2)) : "Amplitude : demi-écart, " + M("a = \\frac{" + H + " - " + pT(L) + "}{2} = " + A)) + ".",
          { ctx: (roue ? "grande-roue" : "temperature") + (axe ? "-axe" : "-amplitude"), guide: [G("Écart entre le maximum et le minimum ?", H - L, M(H - L) + "."), axe ? G("Axe " + M("d") + " (moyenne) ?", (L + H) / 2, M(fT((L + H) / 2)) + ".") : G("Amplitude (demi-écart) ?", A, M(A) + ".")],
            traps: axe ? [TR(A, "C'est l'amplitude ; l'axe est la moyenne du max et du min."), TR(H - L, "L'axe est au milieu : (max + min) ÷ 2.")] : [TR(H - L, "L'amplitude est la moitié de l'écart."), TR((L + H) / 2, "C'est l'axe ; l'amplitude est (max − min) ÷ 2.")] }); },
      () => { const b = pk([2, 3, 4, 0.5, 1.5]), a = nz(-5, 5), d = R.int(-3, 3), Pd = 2 / b;
        return QN("Quelle est la période de " + M("f(x) = " + sinT(a, b, d)) + " (x en radians) ? (écris π)", Pd * PI, "Période " + M("\\frac{2\\pi}{" + fT(b) + "} = " + piT(Pd)) + ".",
          { ctx: "periode", guide: [G("Coefficient " + M("b") + " devant x ?", b, M(fT(b)) + "."), G("Période " + M("\\frac{2\\pi}{b}") + " ?", Pd * PI, M(piT(Pd)) + ".")],
            traps: [TR(2 * PI * b, "La période est 2π ÷ b."), TR(PI / b, "La période d'un sinus est 2π (divisé par b)."), TR(2 * PI, "Le coefficient " + T(b) + " change la période.")] }); },
      () => { const a = nz(-6, 6), d = nz(-5, 5), b = pk([2, 3, 0.5]), mx = R.rand() < 0.5, v = mx ? d + Math.abs(a) : d - Math.abs(a); if ([0, 1, -1].includes(v)) return null;
        return QN("Quelle est la valeur " + (mx ? "maximale" : "minimale") + " de " + M("f(x) = " + sinT(a, b, d)) + " ?", v, "Le sinus varie entre −1 et 1 ; " + M("f") + " varie donc entre " + M(d - Math.abs(a)) + " et " + M(d + Math.abs(a)) + ".",
          { ctx: mx ? "maximum" : "minimum", guide: [G("Amplitude " + M("|a|") + " ?", Math.abs(a), M(Math.abs(a)) + "."), G((mx ? "Maximum " + M("d + |a|") : "Minimum " + M("d - |a|")) + " ?", v, M(v) + ".")],
            traps: [TR(mx ? d - Math.abs(a) : d + Math.abs(a), mx ? "Le maximum est d + |a|." : "Le minimum est d − |a|."), TR(mx ? Math.abs(a) : -Math.abs(a), "N'oublie pas l'axe d = " + d + ".")] }); },
    ],
    2: [
      /* 24.11 (chantier G) : lecture sur un graphique */
      () => { const Pd = pk([4, 8]), a = pk([2, 3, 4, -2, -3, -4]), d = pk([-2, 2, 3, -3]), kind = R.int(0, 2), A = Math.abs(a), f = (x) => a * Math.sin((2 * PI * x) / Pd) + d, x1 = a > 0 ? Pd / 4 : (3 * Pd) / 4;
        const yr = [Math.min(0, d - A) - 1, Math.max(0, d + A) + 1], fig = FIG.plot([{ f }], [], { xr: [-1, 2 * Pd], yr, numbers: true, step: Pd === 8 || yr[1] - yr[0] > 9 ? 2 : 1, maxH: 300, label: "sinusoïde" });
        const ask = ["Lis son amplitude (positive).", "Son axe est la droite " + M("y = d") + " : lis " + M("d") + ".", "Lis sa période."][kind], ans = [A, d, Pd][kind];
        const fin = [G("Amplitude, " + M("\\frac{\\max - \\min}{2}") + " ?", A, M("\\frac{" + (d + A) + " - " + pT(d - A) + "}{2} = " + A) + "."), G("Axe, " + M("\\frac{\\max + \\min}{2}") + " ?", d, M("\\frac{" + (d + A) + sg(d - A) + "}{2} = " + d) + "."), G("Période (écart entre deux maximums) ?", Pd, M((x1 + Pd) + " - " + x1 + " = " + Pd) + ".")][kind];
        const guide = kind === 2 ? [G("Abscisse du premier maximum (x > 0) ?", x1, M(x1) + "."), G("Abscisse du maximum suivant ?", x1 + Pd, M(x1 + Pd) + "."), fin] : [G("Valeur maximale lue ?", d + A, M(d + A) + "."), G("Valeur minimale lue ?", d - A, M(d - A) + "."), fin];
        const traps = [[TR(2 * A, "L'amplitude est la moitié de l'écart entre le maximum et le minimum."), TR(d + A, "C'est le maximum ; l'amplitude est (max − min) ÷ 2.")], [TR(A, "C'est l'amplitude ; l'axe est au milieu, (max + min) ÷ 2."), TR(d + A, "C'est le maximum ; l'axe est au milieu.")], [TR(Pd / 2, "D'un maximum au maximum suivant (pas jusqu'au minimum)."), TR(2 * Pd, "Une période = un motif complet, d'un maximum au suivant.")]][kind];
        return QN("Le graphique montre une fonction sinusoïdale " + M("f(x) = a\\sin(bx) + d") + ". " + ask, ans, ["Amplitude : (max − min) ÷ 2 = " + M(A), "Axe : (max + min) ÷ 2, " + M("d = " + d), "Période : d'un maximum au suivant, " + M(Pd)][kind] + ".",
          { ctx: ["graphe-amplitude", "graphe-axe", "graphe-periode"][kind], fig, guide, traps }); },
      () => { const Pd = pk([1, 4, 0.5, 1 / 3, 2 / 3, 4 / 3, 6]), b = 2 / Pd;
        return QN("Une fonction " + M("f(x) = a\\sin(bx) + d") + " a une période de " + M(piT(Pd)) + ". Que vaut " + M("b") + " (positif) ? (fraction acceptée)", b, M("b = \\frac{2\\pi}{\\text{période}} = \\frac{2\\pi}{" + piT(Pd) + "} = " + fT(b)) + ".",
          { ctx: "b-depuis-periode", guide: [G("Que vaut la période divisée par " + M("\\pi") + " ?", Pd, M(fT(Pd)) + "."), G(M("b = \\frac{2\\pi}{\\text{période}}") + " : " + M("b") + " = ?", b, M(fT(b)) + ".")],
            traps: [TR(Pd, "b = 2π ÷ période (les π se simplifient)."), TR(Pd / 2, "C'est l'inverse : b = 2π ÷ période."), TR(1 / Pd, "Avec un sinus, la période de base est 2π.")] }); },
      () => { const b = pk([1, 2, 3, 0.5]), c = pk([1 / 4, 1 / 3, 1 / 6, 1 / 2]), Pd = 2 / b, xm = c + Pd / 4, a = R.int(1, 5), d = R.int(-3, 3);
        return QN("Pour " + M("f(x) = " + (a === 1 ? "" : a) + "\\sin\\left(" + (b === 1 ? "x - " + piT(c) : fT(b) + "\\left(x - " + piT(c) + "\\right)") + "\\right)" + (d ? sg(d) : "")) + ", donne le premier " + M("x > " + piT(c)) + " où " + M("f") + " est maximale. (écris π)", xm * PI, "Le sinus est maximal quand son argument vaut " + M("\\frac{\\pi}{2}") + " : " + M((b === 1 ? "" : fT(b)) + "\\left(x - " + piT(c) + "\\right) = \\frac{\\pi}{2}") + ", " + M("x = " + piT(c) + " + " + piT(Pd / 4) + " = " + piT(xm)) + ".",
          { ctx: "dephasage", guide: [G("Déphasage (où la courbe coupe l'axe en montant) ?", c * PI, M(piT(c)) + "."), G("Quart de période ?", (Pd / 4) * PI, M(piT(Pd / 4)) + "."), G("Premier maximum ?", xm * PI, M(piT(xm)) + ".")],
            traps: [TR(c * PI, "Au déphasage, f vaut d (montée) ; le maximum vient un quart de période plus tard."), TR((c + Pd / 2) * PI, "Un quart de période (pas une demi) après le déphasage."), TR((Pd / 4 - c) * PI, "x − c = …, donc on ajoute le déphasage.")] }); },
      () => { const a = nz(-4, 4), b = pk([2, 3]), d = R.int(-3, 3), [k, s] = pk([[1 / 6, 0.5], [1 / 2, 1], [3 / 2, -1], [5 / 6, 0.5], [7 / 6, -0.5]]), x0 = k / b, v = r6(a * s + d); if ([0, 1, -1].includes(v)) return null;
        return QN("Soit " + M("f(x) = " + sinT(a, b, d)) + ". Calcule " + M("f\\left(" + piT(x0) + "\\right)") + ".", v, M(b + " \\cdot " + piT(x0) + " = " + piT(k)) + ", " + M("\\sin " + piT(k) + " = " + fT(s)) + ", donc " + M("f = " + a + " \\cdot " + pT(s) + (d ? sg(d) : "") + " = " + fT(v)) + ".",
          { ctx: "image", guide: [G(M("\\sin\\left(" + b + " \\cdot " + piT(x0) + "\\right) = \\sin " + piT(k)) + " = ?", s, M(fT(s)) + "."), G(M("f\\left(" + piT(x0) + "\\right)") + " = ?", v, M(fT(v)) + ".")],
            traps: [TR(r6(a * Math.sin(x0 * PI) + d), "Multiplie d'abord x par " + b + "."), TR(r6(a * s), "N'oublie pas + d.")] }); },
    ],
    3: [
      () => { const lo = R.int(-6, 2), A = R.int(1, 5), hi = lo + 2 * A, Pd = pk([2, 4, 1, 6]), b = 2 / Pd, d = (lo + hi) / 2, ex = A + "*sin(" + fS(b) + "*x)+(" + fS(d) + ")";
        return QX("Une sinusoïde coupe son axe en montant en " + M("x = 0") + ", varie entre " + M(lo) + " et " + M(hi) + " et a une période de " + M(piT(Pd)) + ". Donne son expression " + M("f(x) = a\\sin(bx) + d") + " (x en radians).", ex, M("a = " + A) + ", " + M("b = \\frac{2\\pi}{" + piT(Pd) + "} = " + fT(b)) + ", " + M("d = " + fT(d)) + " : " + M("f(x) = " + sinT(A, b, d)) + ".",
          { ctx: "depuis-graphe", guide: [G("Amplitude " + M("a") + " ?", A, M(A) + "."), G(M("b") + " ?", b, M(fT(b)) + "."), G("Axe " + M("d") + " ?", d, M(fT(d)) + "."), GX("Expression ?", ex, M(sinT(A, b, d)) + ".")],
            traps: [TX(A + "*sin(" + fS(Pd) + "*x)+(" + fS(d) + ")", "b = 2π ÷ période."), TX(2 * A + "*sin(" + fS(b) + "*x)+(" + fS(d) + ")", "L'amplitude est la moitié de l'écart max − min.")] }); },
      () => { const b = pk([1, 2, 3, 0.5]), c = pk([0, 1 / 4, 1 / 3, 1 / 6]), a = nz(-4, 4), Pd = 2 / b, first = a > 0 ? c + Pd / 4 : c + (3 * Pd) / 4;
        return QN("Pour " + M("f(x) = " + co(a) + "\\sin\\left(" + (b === 1 ? (c ? "x - " + piT(c) : "x") : fT(b) + (c ? "\\left(x - " + piT(c) + "\\right)" : "x")) + "\\right)") + ", donne le premier " + M("x > " + (c ? piT(c) : "0")) + " où " + M("f") + " est maximale. (écris π)", first * PI, (a > 0 ? "Maximum quand le sinus vaut 1, un quart de période après " : "Avec a < 0, le maximum arrive quand le sinus vaut −1, trois quarts de période après ") + M(c ? piT(c) : "0") + " : " + M("x = " + piT(first)) + ".",
          { ctx: "premier-max", guide: [G("Période ?", Pd * PI, M(piT(Pd)) + "."), G("Premier maximum ?", first * PI, M(piT(first)) + ".")],
            traps: [TR((a > 0 ? c + (3 * Pd) / 4 : c + Pd / 4) * PI, a > 0 ? "a > 0 : le maximum suit la montée d'un quart de période." : "a < 0 : la courbe commence par descendre ; le maximum arrive aux trois quarts de la période."), TR((c + Pd / 2) * PI, "À une demi-période, le sinus revient à 0.")] }); },
      () => { const dd = pk([3, 4, 5]), A = pk([1.5, 2, 2.5]), rr = pk([0.3, 0.5, 0.6, 0.8, -0.4, -0.5]), Lv = r6(dd + A * rr), t = (Math.asin(rr) * 6) / PI, tt = t < 0 ? 6 - t : t;
        return QN("La hauteur d'eau d'un port vaut " + M("h(t) = " + dd + " + " + N(A) + "\\sin\\left(\\frac{\\pi}{6} t\\right)") + " (en m, t en heures depuis minuit). À quelle heure la hauteur vaut-elle " + M(N(Lv)) + " m pour la première fois ? (au centième d'heure)", tt, M("\\sin\\left(\\frac{\\pi}{6} t\\right) = \\frac{" + N(Lv) + " - " + dd + "}{" + N(A) + "} = " + N(rr)) + (rr < 0 ? " (négatif : la marée descend sous l'axe après 6 h)" : "") + ", " + M("t \\approx " + D(tt, 0.01)) + " h.",
          { ctx: "maree", round: 0.01, guide: [G("Valeur du sinus " + M("\\frac{h - " + dd + "}{" + N(A) + "}") + " ?", rr, M(N(rr)) + "."), G("Heure (au centième) ?", tt, M(D(tt, 0.01)) + " h.", 0.01)],
            traps: [TR(Math.asin(Math.abs(rr)), "C'est l'argument π t ÷ 6 : multiplie par 6 ÷ π."), TR(rr > 0 ? 6 - t : 12 + t, "C'est le second passage : on demande le premier.")] }); },
    ],
  };

  // ===================================== J2. explogfn : fonctions exponentielles et logarithmiques =====================================
  const EL = {
    1: [
      () => { const a = R.int(2, 6), b = pk([2, 3, 4, 5, 0.5]), n = pk([1, 2]), y = a * b ** n; if (b === a) return null;
        return QN("La fonction " + M("f(x) = a \\cdot b^x") + " passe par " + pt(0, a) + " et " + pt(n, y) + ". Que vaut " + M("b") + " ? (" + M("b > 0") + ")", b, M("f(0) = a = " + a) + " ; " + M(a + " \\cdot b^{" + n + "} = " + N(y)) + ", " + M("b^{" + n + "} = " + N(b ** n)) + ", " + M("b = " + N(b)) + ".",
          { ctx: "base", guide: [G(M("a = f(0)") + " ?", a, M(a) + "."), G(M("b^{" + n + "}") + " = ?", b ** n, M(N(y) + " \\div " + a + " = " + N(b ** n)) + "."), G(M("b") + " = ?", b, M(N(b)) + ".")],
            traps: [TR(y / a / n, "b^" + n + " = " + T(b ** n) + " : on prend la racine, on ne divise pas."), TR(y, "On divise d'abord par a = " + a + ".")] }); },
      () => { const b = pk([2, 3, 10]), a = nz(-6, 6);
        return QI("Quel est l'ensemble de définition de " + M("f(x) = " + (b === 10 ? "\\log" : "\\log_{" + b + "}") + "(" + lin(1, -a) + ")") + " ? Réponds par exemple « x > 3 ».", ">", a, "Un logarithme n'existe que pour un argument strictement positif : " + M(lin(1, -a) + " > 0") + ", " + M("x > " + a) + ".",
          { ctx: "domaine-log", guide: [G("Pour quel x l'argument s'annule-t-il ?", a, M(a) + "."), GI("On résout " + M(lin(1, -a) + " > 0") + " : solution ?", ">", a, M("x > " + a) + ".")],
            traps: [TI(">=", a, "Le logarithme de 0 n'existe pas : inégalité stricte."), TI(">", -a, "x − " + a + " > 0 donne x > " + a + " : attention au signe.")] }); },
      () => { const b = pk([2, 3, 10]), a = nz(-6, 6), k = nz(-2, 2), z = r6(a + b ** -k); if (b === 3 && k > 0) return null; if (!z) return null; const lg = b === 10 ? "\\log" : "\\log_{" + b + "}";
        return QN("Quel est le zéro de " + M("f(x) = " + lg + "(" + lin(1, -a) + ")" + sg(k)) + " ? (fraction ou décimal)", z, M(lg + "(" + lin(1, -a) + ") = " + -k) + ", " + M(lin(1, -a) + " = " + b + "^{" + -k + "} = " + fT(b ** -k)) + ", " + M("x = " + fT(z)) + ".",
          { ctx: "zero-log", guide: [G("On isole le log : " + M(lg + "(" + lin(1, -a) + ")") + " = ?", -k, M(-k) + "."), G(M(lin(1, -a)) + " = ?", b ** -k, M(b + "^{" + -k + "} = " + fT(b ** -k)) + "."), G(M("x") + " = ?", z, M(fT(z)) + ".")],
            traps: [TR(a + b ** k, "Le logarithme vaut " + -k + " (on change le signe en isolant)."), TR(a - k, "Par définition, log_b(A) = c donne A = b^c.")] }); },
    ],
    2: [
      /* 24.11 (chantier G) : lecture sur un graphique */
      () => { const a = pk([2, 3, 4]), b = pk([2, 3, 0.5]), kind = R.int(0, 2), y1 = a * b; if (!Number.isInteger(y1)) return null; const v = [b, a * b ** 3, a / b][kind], bT = b === 0.5 ? "\\left(\\frac{1}{2}\\right)" : String(b); if (Math.abs(v) === 1) return null;
        const yr = [-1, Math.max(a, y1) + 1], fig = FIG.plot([{ f: (x) => a * b ** x }], [[0, a, "A"], [1, y1, "B"]], { xr: [-3, 4], yr, numbers: true, step: yr[1] > 10 ? 2 : 1, maxH: 300, label: "courbe exponentielle" });
        const ask = ["Que vaut " + M("b") + " ?", "Calcule " + M("f(3)") + ". (fraction acceptée)", "Calcule " + M("f(-1)") + ". (fraction acceptée)"][kind];
        const g0 = [G(M("f(0)") + ", lu au point A ?", a, M(a) + "."), G(M("f(1)") + ", lu au point B ?", y1, M(y1) + "."), G(M("b = f(1) \\div f(0)") + " ?", b, M(y1 + " \\div " + a + " = " + fT(b)) + ".")];
        const guide = kind === 0 ? g0 : g0.concat([kind === 1 ? G(M("f(3) = " + a + " \\cdot " + bT + "^3") + " ?", v, M(fT(v)) + ".") : G(M("f(-1) = " + a + " \\div " + fT(b)) + " ?", v, M(fT(v)) + ".")]);
        const traps = [[TR(y1 - a, "Exponentielle : on multiplie par b à chaque pas, b = f(1) ÷ f(0)."), TR(y1, "b = f(1) ÷ f(0) (et f(0) = " + a + ").")], [TR(a * b * 3, "C'est une puissance : b³, pas 3b."), TR(y1 + 2 * (y1 - a), "La croissance n'est pas linéaire : on multiplie par b à chaque pas.")], [TR(a * b, "f(−1) = a · b⁻¹ = a ÷ b."), TR(a - (y1 - a), "La croissance n'est pas linéaire : on divise par b quand x recule de 1.")]][kind];
        return QN("Le graphique montre la courbe de " + M("f(x) = a \\cdot b^x") + " ; elle passe par les points A et B. " + ask, v, M("a = f(0) = " + a) + ", " + M("b = \\frac{f(1)}{f(0)} = " + fT(b)) + (kind ? ", " + (kind === 1 ? M("f(3) = " + a + " \\cdot " + bT + "^3 = " + fT(v)) : M("f(-1) = \\frac{" + a + "}{" + fT(b) + "} = " + fT(v))) : "") + ".",
          { ctx: ["graphe-exp-base", "graphe-exp-image", "graphe-exp-negatif"][kind], fig, guide, traps }); },
      () => { const a = R.int(2, 5), b = pk([2, 3]), y2 = a * b * b, x3 = pk([3, 4, -1]), v = a * b ** x3; if (a === b) return null;
        return QN("La fonction " + M("f(x) = a \\cdot b^x") + " passe par " + pt(0, a) + " et " + pt(2, y2) + ". Calcule " + M("f(" + x3 + ")") + ". (fraction acceptée)", v, M("a = " + a) + ", " + M("b^2 = " + b * b) + ", " + M("b = " + b) + " ; " + M("f(" + x3 + ") = " + a + " \\cdot " + b + "^{" + x3 + "} = " + fT(v)) + ".",
          { ctx: "deux-points", guide: [G(M("b") + " ?", b, M(b) + "."), G(M("f(" + x3 + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(a * b * x3, "C'est une puissance : b^" + x3 + "."), TR(r6(a + ((y2 - a) / 2) * x3), "La croissance n'est pas linéaire.")] }); },
      () => { const b = pk([2, 3, 5]), k = nz(-5, 5), n = R.int(2, 4), y = b ** n + k;
        return QN("Soit " + M("f(x) = " + b + "^x" + sg(k)) + ". Calcule " + M("f^{-1}(" + y + ")") + ".", n, M(b + "^x" + sg(k) + " = " + y) + ", " + M(b + "^x = " + b ** n) + ", " + M("x = " + n) + ". (Réciproque " + M("f^{-1}(x) = \\log_{" + b + "}(x" + sg(-k) + ")") + ".)",
          { ctx: "reciproque", guide: [G("On résout " + M(b + "^x" + sg(k) + " = " + y) + " : " + M(b + "^x") + " = ?", b ** n, M(b ** n) + "."), G(M("x") + " = ?", n, M(n) + ".")],
            traps: [TR(b ** y + k, "C'est f(" + y + ") ; la réciproque fait le chemin inverse."), TR(b ** n, "C'est " + b + "^x ; x est l'exposant.")] }); },
      () => { const N0 = pk([20000, 50000, 80000, 120000]), p = pk([1.5, 2, 3, 4]), t = R.int(5, 20), f = 1 + p / 100, v = N0 * f ** t;
        return QN("Une ville de " + M(N(N0)) + " habitants croît de " + M(N(p) + "\\,\\%") + " par an : " + M("N(t) = " + N(N0) + " \\cdot " + N(f) + "^{t}") + ". Estime la population après " + M(t) + " ans (à l'unité).", v, M("N(" + t + ") = " + N(N0) + " \\cdot " + N(f) + "^{" + t + "} \\approx " + N(Math.round(v))) + ".",
          { ctx: "population", round: 1, guide: [G("Facteur " + M(N(f) + "^{" + t + "}") + " (au millième) ?", f ** t, M(D(f ** t, 0.001)) + ".", 0.001), G("Population (à l'unité) ?", v, M(N(Math.round(v))) + ".", 1)],
            traps: [TR(N0 * (1 + (p * t) / 100), "Croissance exponentielle : puissance du facteur, pas t fois le pourcentage."), TR(N0 * (p / 100) ** t, "Le facteur annuel est 1 + p.")] }); },
    ],
    3: [
      () => { const b = pk([2, 3]), h = nz(-5, 5), k = nz(-3, 3), z = r6(h + b ** -k);
        return QN("Le graphe de " + M("g(x) = \\log_{" + b + "}(x" + sg(-h) + ")" + sg(k)) + " est celui de " + M("\\log_{" + b + "} x") + " translaté. Quel est son zéro ? (fraction acceptée)", z, "Asymptote " + M("x = " + h) + ". " + M("\\log_{" + b + "}(x" + sg(-h) + ") = " + -k) + ", donc " + M("x = " + h + " + " + b + "^{" + -k + "} = " + fT(z)) + ".",
          { ctx: "translation-log", guide: [G("Asymptote verticale : " + M("x") + " = ?", h, M(h) + "."), G(M("x" + sg(-h)) + " = " + M(b + "^{" + -k + "}") + " = ?", b ** -k, M(fT(b ** -k)) + "."), G("Zéro ?", z, M(fT(z)) + ".")],
            traps: [TR(h + 1, "Le zéro de log(x − " + h + ") seul serait " + (h + 1) + " ; ici il y a aussi " + (k < 0 ? "− " + -k : "+ " + k) + "."), TR(r6(h + b ** k), "On isole le log : il vaut " + -k + ".")] }); },
      () => { const a = R.int(2, 6), b = pk([2, 3, 4, 0.5]), x1 = pk([1, 2]), x2 = x1 + pk([1, 2]), y1 = a * b ** x1, y2 = a * b ** x2;
        return QN("La fonction " + M("f(x) = a \\cdot b^x") + " passe par " + pt(x1, y1) + " et " + pt(x2, y2) + ". Que vaut " + M("a") + " ?", a, M("\\frac{f(" + x2 + ")}{f(" + x1 + ")} = b^{" + (x2 - x1) + "} = " + fT(y2 / y1)) + ", " + M("b = " + N(b)) + " ; " + M("a = \\frac{" + fT(y1) + "}{" + N(b) + "^{" + x1 + "}} = " + a) + ".",
          { ctx: "deux-points-a", guide: [G("Quotient " + M("\\frac{f(" + x2 + ")}{f(" + x1 + ")} = b^{" + (x2 - x1) + "}") + " ?", y2 / y1, M(fT(y2 / y1)) + "."), G(M("b") + " ?", b, M(N(b)) + "."), G(M("a") + " ?", a, M(a) + ".")],
            traps: [TR(y1, "a = f(0), pas f(" + x1 + ")."), TR(r6(y1 / b), "Divise par b^" + x1 + ".")] }); },
      () => { const N0 = pk([10, 20, 50]), b = pk([2, 3, 4]), target = pk([1000, 10000, 100000, 1000000]), t = l10(target / N0) / l10(b); if (Number.isInteger(r6(t))) return null;
        return QN("Une épidémie suit le modèle " + M("N(t) = " + N0 + " \\cdot " + b + "^{t}") + " (t en jours). Après combien de jours y a-t-il " + M(N(target)) + " malades ? (au centième)", t, M(b + "^{t} = " + N(target / N0)) + ", " + M("t = \\frac{\\log " + N(target / N0) + "}{\\log " + b + "} \\approx " + D(t, 0.01)) + " jours.",
          { ctx: "epidemie", round: 0.01, guide: [G("On divise par " + M(N0) + " : " + M(b + "^{t}") + " = ?", target / N0, M(N(target / N0)) + "."), G(M("t") + " (au centième) ?", t, M(D(t, 0.01)) + ".", 0.01)],
            traps: [TR(l10(target) / l10(b), "Divise d'abord par " + N0 + "."), TR(target / N0 / b, "t est un exposant : utilise le logarithme.")] }); },
    ],
  };


  // ===================================== G2. posdroites : position relative de deux droites (S7.DP.03, 24.11) =====================================
  /* Pas de réponse « par mot » dans l'app : on fait calculer ce qui décide de la position (paramètre m, point commun, écart des cotes). */
  const det2 = (a, b, c, d) => a * d - b * c;
  /* réponse lisible dans l'énoncé ou triviale : on retire (pickForm refait un tirage) */
  const chk = (q) => (q && typeof answerShown === "function" && (answerShown(q) || trivialQ(q, 0)) ? null : q);
  /* équations paramétriques dont une composante du vecteur directeur est une lettre (m) */
  const cTs = (a, dd, s) => (typeof dd === "string" ? (a === 0 ? dd + s : a + " + " + dd + s) : cT1(a, dd, s));
  const eqS = (A, d, s = "t") => M("\\begin{cases} x = " + cTs(A[0], d[0], s) + " \\\\ y = " + cTs(A[1], d[1], s) + (A.length > 2 ? " \\\\ z = " + cTs(A[2], d[2], s) : "") + " \\end{cases}");
  const PD = {
    1: [
      () => { const u = [nz(-4, 4), nz(-4, 4)], k = pk([2, 3, -2, -3]), m = k * u[1], A = [R.int(-5, 5), R.int(-5, 5)], B = [R.int(-5, 5), R.int(-5, 5)]; if (Math.abs(m) < 2 || Math.abs(u[0]) === Math.abs(u[1])) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqS(B, [k * u[0], "m"], "s") + " sont-elles parallèles ?", m,
          "Parallèles : vecteurs directeurs colinéaires. " + M(v2(k * u[0], "m") + " = " + fT(k) + " \\cdot " + v2(u[0], u[1])) + " (car " + M(k * u[0] + " = " + fT(k) + " \\cdot " + pT(u[0])) + "), donc " + M("m = " + fT(k) + " \\cdot " + pT(u[1]) + " = " + m) + ".",
          { ctx: "parallele-m", guide: [G("Rapport " + M("k") + " entre les premières composantes des vecteurs directeurs, " + M(k * u[0] + " \\div " + pT(u[0])) + " ?", k, M(fT(k)) + "."), G(M("m = k \\cdot " + pT(u[1])) + " = ?", m, M(m) + ".")],
            traps: [TR(u[1], "Le vecteur de g est " + k + " fois celui de d : multiplie aussi la seconde composante."), TR(r6(u[1] / k), "On multiplie par k, on ne divise pas."), TR(-m, "Attention au signe de k.")] })); },
      () => { /* audit niveau 25.11 : « deux droites cartésiennes parallèles » (pentes égales : MP 2e, S3.FA) -> droite paramétrique parallèle à une droite cartésienne (vecteur directeur (b ; −a), S7.DP.03) */
        const a = nz(-5, 5), b = nz(-5, 5), k = pk([2, 3, -2, -1, 0.5]), A = [R.int(-5, 5), R.int(-5, 5)], c = nz(-9, 9), u1 = k * b, m = k * -a; if (Math.abs(a) === Math.abs(b) || !Number.isInteger(u1) || !Number.isInteger(m) || Math.abs(m) < 2) return null;
        const e = tm(a, "x", true) + tm(b, "y") + " = " + c;
        return chk(QN("Pour quelle valeur de " + M("m") + " la droite " + M("d") + " : " + eqS(A, [u1, "m"], "t") + " est-elle parallèle à la droite " + M("g : " + e) + " ?", m,
          "Un vecteur directeur de " + M("g : ax + by = c") + " est " + M(v2("b", "-a") + " = " + v2(b, -a)) + ". " + M(v2(u1, "m")) + " doit lui être colinéaire : " + M(fT(u1) + " = " + fT(k) + " \\cdot " + pT(b)) + ", donc " + M("m = " + fT(k) + " \\cdot " + pT(-a) + " = " + m) + ".",
          { ctx: "parallele-param-cartesienne", guide: [GP("Vecteur directeur de " + M("g") + " (" + M(v2("b", "-a")) + ", « x ; y ») ?", [b, -a], M(v2(b, -a)) + "."), G("Rapport " + M(fT(u1) + " \\div " + pT(b)) + " ?", k, M(fT(k)) + "."), G(M("m") + " = ?", m, M(fT(k) + " \\cdot " + pT(-a) + " = " + m) + ".")],
            traps: [TR(k * a, "Le vecteur directeur de ax + by = c est (b ; −a) : attention au signe."), TR(r6(u1 * b / a), "(a ; b) est un vecteur normal de g (perpendiculaire) ; le vecteur directeur est (b ; −a)."), TR(-a, "Multiplie −a par le même rapport que b.")] })); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-3, 3), nz(-3, 3)], t0 = pk([2, -2, 3, -3]), P = [A[0] + t0 * u[0], A[1] + t0 * u[1]], m = pk([2, 3, -2, -3, 4]), p = P[1] - m * P[0]; if (u[1] === m * u[0] || !p) return null;
        return QP("La droite " + M("d") + " : " + eqP(A, u) + " coupe la droite " + M("g") + " : " + M("y = " + lin(m, p)) + ". Donne leur point d'intersection." + PAIR, P,
          "On remplace x et y de d dans l'équation de g : " + M(cT1(A[1], u[1], "t") + " = " + m + "(" + cT1(A[0], u[0], "t") + ")" + sg(p)) + ", d'où " + M("t = " + t0) + " et le point " + pt(...P) + ".",
          { ctx: "param-cartesienne", guide: [G("On remplace " + M("x") + " et " + M("y") + " de " + M("d") + " dans l'équation de " + M("g") + " : " + M("t") + " = ?", t0, M("t = " + t0) + "."), GP("Point d'intersection ?", P, pt(...P) + ".")],
            traps: [TP(A, "C'est le point de départ de d (t = 0) : calcule t d'abord."), TP([A[0] - t0 * u[0], A[1] - t0 * u[1]], "Attention au signe de t."), TP([t0, P[1]], "Remplace t dans x aussi.")] }); },
    ],
    2: [
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = pk([2, -2, 3, -1]), t0 = pk([2, 3, -2, -3]), y0 = A[1] + t0 * u[1], c = A[0] + t0 * u[0]; if (Math.abs(c) < 2 || c === y0 || !y0 || Math.abs(u[0]) === Math.abs(u[1])) return null;
        return chk(QN("Les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP(["c", y0], [k * u[0], k * u[1]], "s") + " sont parallèles. Pour quelle valeur de " + M("c") + " sont-elles confondues ?", c,
          "Confondues : le point " + M("(c \\,;\\, " + y0 + ")") + " de g doit être sur d. " + M(y0 + " = " + cT1(A[1], u[1], "t")) + " donne " + M("t = " + t0) + ", puis " + M("c = " + A[0] + sg(u[0]) + " \\cdot " + pT(t0) + " = " + c) + ".",
          { ctx: "confondues", guide: [G("Le point " + M("(c \\,;\\, " + y0 + ")") + " doit être sur " + M("d") + ". Avec l'ordonnée, " + M("t") + " = ?", t0, M(y0 + " = " + cT1(A[1], u[1], "t")) + ", " + M("t = " + t0) + "."), G(M("c") + " = ?", c, M(c) + ".")],
            traps: [TR(A[0] - t0 * u[0], "Attention au signe de t."), TR(A[0], "Le point de g doit être sur d : calcule t avec l'ordonnée."), TR(A[0] + t0 * k * u[0], "On utilise le vecteur directeur de d (pas celui de g).")] })); },
      () => { const u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], k = pk([2, -2, 3, -3]), m = k * u[1], A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], B = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)]; if (Math.abs(m) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites de l'espace " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqS(B, [k * u[0], "m", k * u[2]], "s") + " sont-elles parallèles ?", m,
          "Vecteurs directeurs colinéaires : " + M(k * u[0] + " = " + fT(k) + " \\cdot " + pT(u[0])) + " et " + M(k * u[2] + " = " + fT(k) + " \\cdot " + pT(u[2])) + " ; donc " + M("m = " + fT(k) + " \\cdot " + pT(u[1]) + " = " + m) + ".",
          { ctx: "parallele-espace", guide: [G("Rapport " + M("k") + " (première et troisième composantes) ?", k, M(fT(k)) + "."), G(M("m") + " = ?", m, M(m) + ".")],
            traps: [TR(u[1], "Multiplie aussi la deuxième composante par k."), TR(r6(u[1] / k), "On multiplie par k, on ne divise pas."), TR(-m, "Attention au signe de k.")] })); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-3, 3), nz(-3, 3)], t0 = pk([2, 3, -2, -3, 4]), P = [A[0] + t0 * u[0], A[1] + t0 * u[1]], a = nz(-4, 4), b = nz(-4, 4), c = a * P[0] + b * P[1], den2 = a * u[0] + b * u[1]; if (!den2 || !c || Math.abs(a) === Math.abs(b)) return null;
        return chk(QN("Pour quelle valeur du paramètre " + M("t") + " la droite " + M("d") + " : " + eqP(A, u) + " coupe-t-elle la droite " + M(tm(a, "x", true) + tm(b, "y") + " = " + c) + " ?", t0,
          M(co(a) + "(" + cT1(A[0], u[0], "t") + ")" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "(" + cT1(A[1], u[1], "t") + ") = " + c) + ", soit " + M(tm(den2, "t", true) + (a * A[0] + b * A[1] ? sg(a * A[0] + b * A[1]) : "") + " = " + c) + ", d'où " + M("t = " + t0) + ".",
          { ctx: "parametre-intersection", guide: [G("Après remplacement, coefficient de " + M("t") + " ?", den2, M(a + " \\cdot " + pT(u[0]) + " + " + pT(b) + " \\cdot " + pT(u[1]) + " = " + den2) + "."), ].concat(a * A[0] + b * A[1] ? [G("Terme constant ?", a * A[0] + b * A[1], M(a * A[0] + b * A[1]) + ".")] : [], [G(M("t") + " = ?", t0, M(t0) + ".")]),
            traps: [TR(-t0, "Attention au signe en isolant t."), TR(r6(c / den2), "Fais passer le terme constant de l'autre côté avant de diviser.")] })); },
    ],
    3: [
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = pk([2, -1, 3, -2]), s0 = pk([2, -2, 3, 1, -1]); if (!det2(u[0], -v[0], u[1], -v[1]) || u[0] * v[2] === u[2] * v[0]) return null;
        const P = A.map((x, i) => x + t0 * u[i]), B = P.map((x, i) => x - s0 * v[i]);
        return QP("Les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP(B, v, "s") + " sont sécantes. Donne leur point d'intersection." + TRIP, P,
          "Avec x et y : " + M(cT1(A[0], u[0], "t") + " = " + cT1(B[0], v[0], "s")) + " et " + M(cT1(A[1], u[1], "t") + " = " + cT1(B[1], v[1], "s")) + " donnent " + M("t = " + t0) + ", " + M("s = " + s0) + " ; z concorde (" + M(P[2]) + ") : point " + pt(...P) + ".",
          { ctx: "secantes-espace", guide: [G("Système en " + M("x") + " et " + M("y") + " : " + M("t") + " = ?", t0, M("t = " + t0) + "."), G(M("s") + " = ?", s0, M("s = " + s0) + "."), G("Vérification en z : cote du point ?", P[2], M(P[2]) + " des deux côtés."), GP("Point d'intersection ?", P, pt(...P) + ".")],
            traps: [TP(A, "C'est le point de départ de d : calcule t d'abord."), TP(B, "C'est le point de départ de g."), TP(A.map((x, i) => x + s0 * u[i]), "Dans d, on remplace t (pas s).")] }); },
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = pk([2, -1, 3, -2]), s0 = pk([2, -2, 3, -1]), dz = pk([2, 3, 4, -2, -3, 5]); if (!det2(u[0], -v[0], u[1], -v[1]) || u[0] * v[2] === u[2] * v[0]) return null;
        const P = A.map((x, i) => x + t0 * u[i]), B = P.map((x, i) => x - s0 * v[i] + (i === 2 ? dz : 0)), zd = P[2], zg = P[2] + dz;
        return chk(QN("On veut savoir si les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP(B, v, "s") + " se coupent. On résout le système formé par les équations en x et en y, puis on compare les cotes. Que vaut " + M("z_g - z_d") + " pour les valeurs de t et s trouvées ?", dz,
          "Avec x et y : " + M("t = " + t0) + ", " + M("s = " + s0) + ". Alors " + M("z_d = " + zd) + " et " + M("z_g = " + zg) + " : " + M("z_g - z_d = " + dz) + ". La différence n'est pas nulle : aucun point commun ; les directions n'étant pas parallèles, les droites sont gauches.",
          { ctx: "gauches", guide: [G(M("t") + " = ?", t0, M("t = " + t0) + "."), G(M("s") + " = ?", s0, M("s = " + s0) + "."), G(M("z_d") + " (avec t) ?", zd, M(zd) + "."), G(M("z_g") + " (avec s) ?", zg, M(zg) + "."), G(M("z_g - z_d") + " ?", dz, M(dz) + " : différent de 0, droites gauches.")],
            traps: [TR(-dz, "C'est z_g − z_d, dans cet ordre."), TR(zg, "On demande la différence des cotes."), TR(B[2] - s0 * v[2] - zd, "Recalcule z_g avec s = " + T(s0) + " : attention au signe.")] })); },
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = pk([2, -1, 3, -2]), s0 = pk([2, -2, 3, -1]); if (!det2(u[0], -v[0], u[1], -v[1]) || u[0] * v[2] === u[2] * v[0]) return null;
        const P = A.map((x, i) => x + t0 * u[i]), B = P.map((x, i) => x - s0 * v[i]), m = B[2]; if (Math.abs(m) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP([B[0], B[1], "m"], v, "s") + " sont-elles sécantes ?", m,
          "Avec x et y : " + M("t = " + t0) + ", " + M("s = " + s0) + ". En z : " + M(cT1(A[2], u[2], "t") + " = m" + tm(v[2], "s")) + " donne " + M(P[2] + " = m" + sg(s0 * v[2])) + ", donc " + M("m = " + m) + ".",
          { ctx: "secantes-m", guide: [G("Système en " + M("x") + " et " + M("y") + " : " + M("t") + " = ?", t0, M("t = " + t0) + "."), G(M("s") + " = ?", s0, M("s = " + s0) + "."), G("Cote du point de " + M("d") + " ?", P[2], M(P[2]) + "."), G(M("m") + " = ?", m, M(P[2] + " - " + pT(s0 * v[2]) + " = " + m) + ".")],
            traps: [TR(P[2] + s0 * v[2], "Isole m : m = " + T(P[2]) + " − (" + T(s0 * v[2]) + ")."), TR(P[2], "Il faut encore retrancher le terme en s.")] })); },
    ],
  };

  // ===================================== F3. projmp : projection orthogonale (S7.VE, 24.11) =====================================
  const SMALL = [[1, 2], [2, 1], [1, -2], [2, -1], [1, 3], [3, 1], [3, -1], [2, 3], [3, -2]];
  const perp = (d) => [-d[1], d[0]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const PJ = {
    1: [
      () => { const [a, b, c] = pk(TRI2), v = [a * sgn(), b * sgn()], u = [nz(-6, 6), nz(-6, 6)], p = dot(u, v), comp = r6(p / c); if (!p || Math.abs(comp) === 1 || den(comp) > 20) return null;
        return QN("Calcule la projection scalaire de " + M("\\vec{u} = " + v2(u[0], u[1])) + " sur la direction de " + M("\\vec{v} = " + v2(v[0], v[1])) + ", c'est-à-dire " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|}") + ". (fraction acceptée)", comp,
          M("\\vec{u} \\cdot \\vec{v} = " + p) + ", " + M("\\|\\vec{v}\\| = " + c) + ", projection " + M("\\frac{" + p + "}{" + c + "} = " + fT(comp)) + ".",
          { ctx: "projection-scalaire", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{v}\\|") + " ?", c, M(c) + "."), G("Projection scalaire ?", comp, M(fT(comp)) + ".")],
            traps: [TR(p, "Divise encore par la norme de v."), TR(r6(p / (c * c)), "On divise par ‖v‖ (pas par ‖v‖², qui sert au vecteur projeté)."), TR(r6(p / Math.hypot(...u)), "On divise par la norme du vecteur sur lequel on projette (v).")] }); },
      () => { const v = pk(SMALL), lam = pk([2, 3, -2, -3]), mu = nz(-2, 2), u = [lam * v[0] + mu * -v[1], lam * v[1] + mu * v[0]], n2 = v[0] ** 2 + v[1] ** 2, p = dot(u, v), w = [lam * v[0], lam * v[1]]; if (u.includes(0)) return null;
        return QP("Donne le vecteur projeté orthogonal de " + M("\\vec{u} = " + v2(u[0], u[1])) + " sur " + M("\\vec{v} = " + v2(v[0], v[1])) + " : " + M("\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2} \\, \\vec{v}") + "." + PAIR, w,
          M("\\vec{u} \\cdot \\vec{v} = " + p) + ", " + M("\\|\\vec{v}\\|^2 = " + n2) + ", coefficient " + M("\\frac{" + p + "}{" + n2 + "} = " + lam) + ", " + M("\\vec{p} = " + lam + " \\, \\vec{v} = " + v2(w[0], w[1])) + ".",
          { ctx: "vecteur-projete", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{v}\\|^2") + " ?", n2, M(n2) + "."), G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}") + " ?", lam, M(lam) + "."), GP("Vecteur projeté ?", w, M(v2(w[0], w[1])) + ".")],
            traps: [TP([p * v[0], p * v[1]], "Divise par ‖v‖² avant de multiplier par v."), TP(u, "C'est u lui-même : on garde seulement sa partie dans la direction de v."), TP([u[0] - w[0], u[1] - w[1]], "C'est la composante orthogonale ; le projeté est parallèle à v.")] }); },
      () => { const th = pk([15, 20, 25, 35, 40, 50]), it = pk([["On tire une valise avec une force de", "le sol", "valise", [30, 40, 50, 60]], ["Un cheval tire une péniche le long du canal avec une corde ; la force vaut", "le canal", "peniche", [400, 500, 600, 800, 1000]], ["Un remonte-pente tire un skieur avec une force de", "la piste", "skieur", [150, 200, 250, 300]]]), F = pk(it[3]) /* 26.11 (vraisemblance) : force selon le contexte (un cheval tire quelques centaines de N à 1000 N) */, h = F * Math.cos(th / DEG);
        return QN(it[0] + " " + M(F + "\\text{ N}") + ", inclinée de " + M(th + "°") + " par rapport " + (it[1].startsWith("le ") ? "au " + it[1].slice(3) : "à " + it[1]) + ". Calcule la composante de la force dans la direction " + (it[1].startsWith("le ") ? "du " + it[1].slice(3) : "de " + it[1]) + " (projection, en N, au dixième).", h,
          "Projection sur la direction du déplacement : " + M("F \\cos\\alpha = " + F + " \\cdot \\cos " + th + "° \\approx " + D(h, 0.1)) + " N.",
          { ctx: "force-" + it[2], round: 0.1, guide: [G(M("\\cos " + th + "°") + " (au millième) ?", Math.cos(th / DEG), M(D(Math.cos(th / DEG), 0.001)) + ".", 0.001), G("Composante (au dixième) ?", h, M(D(h, 0.1)) + " N.", 0.1)],
            traps: [TR(F * Math.sin(th / DEG), "La composante le long du déplacement utilise le cosinus (côté adjacent)."), TR(F, "Seule une partie de la force agit dans cette direction : × cos α."), TR(F / Math.cos(th / DEG), "On multiplie par cos α, on ne divise pas.")] }); },
    ],
    2: [
      () => { const d = pk(SMALL), A = [R.int(-4, 4), R.int(-4, 4)], lam = pk([2, -1, 3, -2, 0.5, 1.5]), mu = nz(-2, 2), H = [A[0] + lam * d[0], A[1] + lam * d[1]], P = [H[0] + mu * -d[1], H[1] + mu * d[0]], AP = [P[0] - A[0], P[1] - A[1]], n2 = d[0] ** 2 + d[1] ** 2; if (!Number.isInteger(H[0]) || !Number.isInteger(H[1])) return null;
        return QP("La droite " + M("d") + " passe par " + ptN("A", ...A) + " et a pour vecteur directeur " + M("\\vec{d} = " + v2(d[0], d[1])) + ". Donne le projeté orthogonal " + M("H") + " de " + ptN("P", ...P) + " sur " + M("d") + "." + PAIR, H,
          M("\\overrightarrow{AP} = " + v2(AP[0], AP[1])) + ", " + M("\\lambda = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2} = \\frac{" + dot(AP, d) + "}{" + n2 + "} = " + fT(lam)) + ", " + M("H = A + \\lambda \\vec{d}") + " = " + pt(...H) + ".",
          { ctx: "pied-perpendiculaire", guide: [GP("Composantes de " + M("\\overrightarrow{AP}") + " ?", AP, M(v2(AP[0], AP[1])) + "."), G(M("\\lambda = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}") + " ?", lam, M(fT(lam)) + "."), GP("Point " + M("H") + " ?", H, pt(...H) + ".")],
            traps: [TP([lam * d[0], lam * d[1]], "C'est le vecteur AH : ajoute les coordonnées de A."), TP(P, "H est sur d : on projette P."), TP([A[0] + dot(AP, d) * d[0], A[1] + dot(AP, d) * d[1]], "Divise le produit scalaire par ‖d‖².")] }); },
      () => { const d = pk([[3, 4], [4, 3], [1, 2], [2, 1], [1, 3], [3, -4], [2, -1]]), A = [R.int(-4, 4), R.int(-4, 4)], lam = pk([2, -1, 3, -2]), mu = pk([2, -2, 1, -1, 3]), H = [A[0] + lam * d[0], A[1] + lam * d[1]], P = [H[0] + mu * -d[1], H[1] + mu * d[0]], n = Math.hypot(...d), dist = Math.abs(mu) * n, ex = Number.isInteger(r6(dist));
        return QN("Calcule la distance du point " + ptN("P", ...P) + " à la droite passant par " + ptN("A", ...A) + " de vecteur directeur " + M(v2(d[0], d[1])) + (ex ? "." : " (au centième)."), dist,
          "Projeté orthogonal " + ptN("H", ...H) + " ; distance " + M("PH = \\sqrt{" + pT(P[0] - H[0]) + "^2 + " + pT(P[1] - H[1]) + "^2} " + (ex ? "= " + dist : "\\approx " + D(dist, 0.01))) + ".",
          Object.assign({ ctx: "distance-droite", guide: [GP("Projeté orthogonal " + M("H") + " de " + M("P") + " ?", H, ptN("H", ...H) + "."), G("Distance " + M("PH") + (ex ? "" : " (au centième)") + " ?", dist, M(ex ? dist : D(dist, 0.01)) + ".", ex ? undefined : 0.01)],
            traps: [TR(Math.hypot(P[0] - A[0], P[1] - A[1]), "PA est oblique : la distance se mesure perpendiculairement, PH."), TR(dist * dist, "N'oublie pas la racine."), TR(Math.abs(mu), "Multiplie par la norme du vecteur perpendiculaire.")] }, ex ? {} : { round: 0.01 })); },
      () => { const v = pk(SMALL), lam = pk([2, 3, -2, 0.5, 1.5]), mu = pk([2, -2, 3, -1]), u = [lam * v[0] + mu * -v[1], lam * v[1] + mu * v[0]]; if (u.includes(0) || !Number.isInteger(u[0]) || !Number.isInteger(u[1])) return null; const w = [mu * -v[1], mu * v[0]], p = [lam * v[0], lam * v[1]];
        return QP("Décompose " + M("\\vec{u} = " + v2(u[0], u[1])) + " en une partie parallèle à " + M("\\vec{v} = " + v2(v[0], v[1])) + " et une partie orthogonale. Donne la partie orthogonale " + M("\\vec{w} = \\vec{u} - \\vec{p}") + "." + PAIR, w,
          "Projeté " + M("\\vec{p} = \\frac{" + dot(u, v) + "}{" + (v[0] ** 2 + v[1] ** 2) + "} \\vec{v} = " + v2(fT(p[0]), fT(p[1]))) + ", " + M("\\vec{w} = \\vec{u} - \\vec{p} = " + v2(w[0], w[1])) + " (vérification : " + M("\\vec{w} \\cdot \\vec{v} = 0") + ").",
          { ctx: "composante-orthogonale", guide: [G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}") + " ?", lam, M(fT(lam)) + "."), GP("Vecteur projeté " + M("\\vec{p}") + " ?", p, M(v2(fT(p[0]), fT(p[1]))) + "."), GP(M("\\vec{w} = \\vec{u} - \\vec{p}") + " ?", w, M(v2(w[0], w[1])) + ".")],
            traps: [TP(p, "C'est la partie parallèle ; la partie orthogonale est u − p."), TP([u[0] + p[0], u[1] + p[1]], "On soustrait le projeté.")] }); },
    ],
    3: [
      () => { const v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], e = [nz(-2, 2), nz(-2, 2), nz(-2, 2)], w = cross(v, e), lam = pk([2, -2, 3, -1]); if (w.every((x) => !x)) return null; const u = v.map((x, i) => lam * x + w[i]), p = v.map((x) => lam * x), n2 = dot(v, v); if (u.includes(0)) return null;
        return QP("Donne le vecteur projeté orthogonal de " + M("\\vec{u} = " + v3(...u)) + " sur " + M("\\vec{v} = " + v3(...v)) + "." + TRIP, p,
          M("\\vec{u} \\cdot \\vec{v} = " + dot(u, v)) + ", " + M("\\|\\vec{v}\\|^2 = " + n2) + ", coefficient " + M(fT(lam)) + " : " + M("\\vec{p} = " + v3(...p)) + ".",
          { ctx: "projete-espace", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\|\\vec{v}\\|^2") + " ?", n2, M(n2) + "."), G("Coefficient ?", lam, M(lam) + "."), GP("Vecteur projeté ?", p, M(v3(...p)) + ".")],
            traps: [TP(v.map((x) => dot(u, v) * x), "Divise le produit scalaire par ‖v‖²."), TP(w, "C'est la partie orthogonale."), TP(u, "On ne garde que la partie parallèle à v.")] }); },
      () => { const d = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], e = [nz(-2, 2), nz(-2, 2), nz(-2, 2)], w = cross(d, e), A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], lam = pk([2, -1, 3, -2]); if (w.every((x) => !x)) return null; const H = A.map((x, i) => x + lam * d[i]), P = H.map((x, i) => x + w[i]), AP = P.map((x, i) => x - A[i]);
        return QP("Donne le projeté orthogonal " + M("H") + " du point " + ptN("P", ...P) + " sur la droite " + eqP(A, d) + "." + TRIP, H,
          M("\\overrightarrow{AP} \\cdot \\vec{d} = " + dot(AP, d)) + ", " + M("\\|\\vec{d}\\|^2 = " + dot(d, d)) + ", " + M("t = " + lam) + " : " + ptN("H", ...H) + ".",
          { ctx: "pied-espace", guide: [G(M("\\overrightarrow{AP} \\cdot \\vec{d}") + " (A point de départ de la droite) ?", dot(AP, d), M(dot(AP, d)) + "."), G("Paramètre " + M("t = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}") + " ?", lam, M(lam) + "."), GP("Point " + M("H") + " ?", H, ptN("H", ...H) + ".")],
            traps: [TP(A, "C'est le point de départ (t = 0) : calcule t."), TP(A.map((x, i) => x - lam * d[i]), "Attention au signe de t."), TP(d.map((x) => lam * x), "Ajoute les coordonnées du point de départ.")] }); },
      () => { const d = pk(SMALL.concat([[3, 4], [4, -3]])), A = [R.int(-4, 3), R.int(-4, 3)], B = [A[0] + d[0], A[1] + d[1]], lam = pk([0.5, 2, -1, 1.5]), mu = pk([2, 3, -2, -3]), n2 = d[0] ** 2 + d[1] ** 2, H = [A[0] + lam * d[0], A[1] + lam * d[1]], C = [H[0] - mu * d[1], H[1] + mu * d[0]]; if (!C.every(Number.isInteger)) return null;
        const h = Math.abs(mu) * Math.sqrt(n2), aire = (Math.abs(mu) * n2) / 2, ex = Number.isInteger(r6(h));
        return QN("Triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + ". Calcule son aire avec la hauteur issue de " + M("C") + " (projeté orthogonal de C sur (AB)). (décimal accepté)", aire,
          "Projeté " + ptN("H", ...H) + ", hauteur " + M("CH " + (ex ? "= " + h : "= " + Math.abs(mu) + "\\sqrt{" + n2 + "}")) + ", base " + M("AB = \\sqrt{" + n2 + "}") + " : aire " + M("\\frac{1}{2} \\cdot AB \\cdot CH = " + fT(aire)) + ".",
          { ctx: "aire-hauteur", guide: [GP("Projeté " + M("H") + " de " + M("C") + " sur " + M("(AB)") + " ?", H, ptN("H", ...H) + "."), G("Hauteur " + M("CH") + " (au centième) ?", h, M(ex ? h : D(h, 0.01)) + ".", ex ? undefined : 0.01), G("Aire ?", aire, M(fT(aire)) + ".")],
            traps: [TR(aire * 2, "Aire d'un triangle : base × hauteur ÷ 2."), TR(Math.sqrt(n2) * Math.hypot(C[0] - A[0], C[1] - A[1]) / 2, "AC n'est pas la hauteur : prends la distance de C à (AB).")] }); },
    ],
  };

  // ===================================== F4. pvectmp : produit vectoriel (S7.VE, 24.11 ; « facultatif » dans le polycopié MP4, chap. F, leçon 5) =====================================
  const nrm = (w) => Math.hypot(...w);
  const ok2 = (v) => den(v) === 1 || den(v) === 2; /* valeur exacte (entière ou demi-entière) */
  const eqv = (v) => (ok2(v) ? "= " + N(v) : "\\approx " + D(v, 0.01));
  const rnd = (v) => (ok2(v) ? undefined : 0.01);
  const add3 = (a, b, k = 1) => a.map((x, i) => x + k * b[i]);
  /* 25.11 (corrigés de 332 à 373 px sur téléphone) : produit sans « · » devant une parenthèse ; le résultat passe à la ligne (M séparé). */
  const mulT = (a, b) => pT(a) + (b < 0 ? pT(b) : " \\cdot " + pT(b));
  const crT = (u, v) => v3(mulT(u[1], v[2]) + " - " + mulT(u[2], v[1]), mulT(u[2], v[0]) + " - " + mulT(u[0], v[2]), mulT(u[0], v[1]) + " - " + mulT(u[1], v[0]));
  const sq3 = (w) => w.map((x) => pT(x) + "^2").join(" + ");
  const PV = {
    1: [
      () => { const u = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], w = cross(u, v); if (w.includes(0)) return null;
        return QP("Calcule le produit vectoriel " + M("\\vec{u} \\times \\vec{v}") + " avec " + M("\\vec{u} = " + v3(...u)) + " et " + M("\\vec{v} = " + v3(...v)) + "." + TRIP, w,
          M("\\vec{u} \\times \\vec{v} = " + crT(u, v)) + " " + M("= " + v3(...w)) + ".",
          { ctx: "composantes", guide: [G("Première composante " + M("u_2 v_3 - u_3 v_2") + " ?", w[0], M(pT(u[1]) + " \\cdot " + pT(v[2]) + " - " + pT(u[2]) + " \\cdot " + pT(v[1]) + " = " + w[0]) + "."), G("Deuxième composante " + M("u_3 v_1 - u_1 v_3") + " ?", w[1], M(w[1]) + "."), G("Troisième composante " + M("u_1 v_2 - u_2 v_1") + " ?", w[2], M(w[2]) + "."), GP("Produit vectoriel ?", w, M(v3(...w)) + ".")],
            traps: [TP(w.map((x) => -x), "L'ordre compte : v × u = −(u × v). Première composante : u₂v₃ − u₃v₂, dans cet ordre."), TP(u.map((x, i) => x * v[i]), "Ce n'est pas un produit composante par composante : on croise les composantes (u₂v₃ − u₃v₂, …)."), TP([w[0], -w[1], w[2]], "Deuxième composante : u₃v₁ − u₁v₃ (attention à l'ordre des produits).")] }); },
      () => { const [a, b, c, d] = pk(TRI3), w = perm([a, b, c]).map((x) => x * sgn()), tri = R.rand() < 0.5, ar = tri ? d / 2 : d;
        return QN("On a calculé " + M("\\vec{u} \\times \\vec{v} = " + v3(...w)) + ". Quelle est l'aire du " + (tri ? "triangle" : "parallélogramme") + " construit sur " + M("\\vec{u}") + " et " + M("\\vec{v}") + " ?" + (tri ? " (décimal accepté)" : ""), ar,
          "L'aire du parallélogramme est la norme du produit vectoriel : " + M("\\sqrt{" + sq3(w) + "} = \\sqrt{" + d * d + "} = " + d) + (tri ? " ; le triangle en est la moitié, " + M(N(ar)) : "") + ".",
          { ctx: tri ? "aire-triangle-norme" : "aire-para-norme", guide: [G("Somme des carrés des composantes ?", d * d, M(w.map((x) => x * x).join(" + ") + " = " + d * d) + "."), G("Norme " + M("\\|\\vec{u} \\times \\vec{v}\\|") + " ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")].concat(tri ? [G("Aire du triangle ?", ar, M(d + " \\div 2 = " + N(ar)) + ".")] : []),
            traps: [TR(d * d, "N'oublie pas la racine carrée."), TR(tri ? d : d / 2, tri ? "Le triangle est la moitié du parallélogramme." : "C'est l'aire du triangle ; le parallélogramme vaut la norme entière."), TR(Math.abs(w[0]) + Math.abs(w[1]) + Math.abs(w[2]), "Norme : √(x² + y² + z²), pas la somme des composantes.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), e = nz(-6, 6), det = a * e - b * c, ar = Math.abs(det); if (ar < 2 || [a, b, c, e].map(Math.abs).includes(ar)) return null;
        const it = pk([["Une terrasse", "m"], ["Une parcelle de jardin", "dam"], ["Un vitrail", "dm"], ["Le tablier d'un petit pont", "m"]]);
        /* 25.11 (formule trop large sur téléphone) : calcul de la 3e composante sorti du vecteur colonne. */
        return QN(it[0] + " a la forme d'un parallélogramme construit sur " + M("\\vec{u} = " + v2(a, b)) + " et " + M("\\vec{v} = " + v2(c, e)) + " (en " + it[1] + "). On les écrit dans l'espace avec " + M("z = 0") + " : " + M("\\vec{u} \\times \\vec{v}") + " n'a qu'une composante non nulle. Calcule l'aire (en " + M("\\text{" + it[1] + "}^2") + ").", ar,
          "Troisième composante " + M("u_1 v_2 - u_2 v_1 = " + pT(a) + " \\cdot " + pT(e) + " - " + pT(b) + " \\cdot " + pT(c) + " = " + det) + ", donc " + M("\\vec{u} \\times \\vec{v} = " + v3(0, 0, det)) + " ; aire " + M("|" + det + "| = " + ar + "\\ \\text{" + it[1] + "}^2") + ".",
          { ctx: "aire-plan", guide: [G("Troisième composante " + M("u_1 v_2 - u_2 v_1") + " ?", det, M(pT(a) + " \\cdot " + pT(e) + " - " + pT(b) + " \\cdot " + pT(c) + " = " + det) + "."), G("Aire (une aire est positive) ?", ar, M(ar) + ".")],
            traps: [TR(Math.abs(a * c + b * e), "C'est le produit scalaire ; l'aire vient du produit vectoriel."), TR(Math.abs(a * e + b * c), "u₁v₂ − u₂v₁ : on soustrait les deux produits."), TR(ar / 2, "Pour le parallélogramme, on prend la norme entière (le triangle en serait la moitié)."), TR(det, "Une aire est positive : prends la valeur absolue.")] }); },
    ],
    2: [
      () => { const A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], u = [nz(-3, 3), nz(-3, 3), R.int(-3, 3)], v = [R.int(-3, 3), nz(-3, 3), nz(-3, 3)], w = cross(u, v); if (w.filter((x) => x).length < 2) return null;
        const B = add3(A, u), C = add3(A, v), n = nrm(w), ar = n / 2, ro = rnd(ar);
        return QN("Calcule l'aire du triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + " dans l'espace" + (ro ? " (au centième)." : ". (décimal accepté)"), ar,
          M("\\overrightarrow{AB} = " + v3(...u)) + ", " + M("\\overrightarrow{AC} = " + v3(...v)) + ", " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC} = " + v3(...w)) + " ; aire " + M("\\frac{1}{2}\\sqrt{" + Math.round(n * n) + "} " + eqv(ar)) /* 26.11 : √(50.00000000000001) */ + ".",
          Object.assign({ ctx: "aire-triangle-espace", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?" + TRIP, v, M(v3(...v)) + "."), GP(M("\\overrightarrow{AB} \\times \\overrightarrow{AC}") + " ?" + TRIP, w, M(v3(...w)) + "."), G("Aire " + M("\\frac{1}{2}\\|\\overrightarrow{AB} \\times \\overrightarrow{AC}\\|") + (ro ? " (au centième)" : "") + " ?", ar, M(eqv(ar).replace(/^= /, "")) + ".", ro)],
            traps: [TR(n, "Pour le triangle, on prend la moitié de la norme."), TR((n * n) / 2, "N'oublie pas la racine carrée."), TR((nrm(u) * nrm(v)) / 2, "AB · AC ÷ 2 ne vaut que si l'angle en A est droit : passe par le produit vectoriel.")] }, ro ? { round: ro } : {})); },
      () => { const A = [R.int(0, 4), R.int(0, 4), R.int(0, 3)], u = [nz(-3, 3), nz(-3, 3), R.int(-2, 2)], v = [nz(-3, 3), R.int(-3, 3), nz(-2, 2)], w = cross(u, v); if (w.filter((x) => x).length < 2) return null;
        const B = add3(A, u), C = add3(A, v), it = pk([["Un panneau solaire triangulaire", "panneau"], ["Une voile d'ombrage tendue", "voile"], ["Un pan de toit triangulaire", "toit"]]);
        return QP(it[0] + " a ses coins en " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + ptN("C", ...C) + " (en m). Calcule le vecteur normal " + M("\\vec{n} = \\overrightarrow{AB} \\times \\overrightarrow{AC}") + ", perpendiculaire à la surface." + TRIP, w,
          M("\\overrightarrow{AB} = " + v3(...u)) + ", " + M("\\overrightarrow{AC} = " + v3(...v)) + ", " + M("\\vec{n} = " + crT(u, v)) + " " + M("= " + v3(...w)) + ". Vérification : " + M("\\vec{n} \\cdot \\overrightarrow{AB} = 0") + " et " + M("\\vec{n} \\cdot \\overrightarrow{AC} = 0") + ".",
          { ctx: "normal-" + it[1], guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?" + TRIP, v, M(v3(...v)) + "."), GP("Vecteur normal " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC}") + " ?" + TRIP, w, M(v3(...w)) + ".")],
            traps: [TP(w.map((x) => -x), "C'est AC × AB : l'ordre compte, AC × AB = −(AB × AC)."), TP(u.map((x, i) => x * v[i]), "On ne multiplie pas composante par composante : formule « en croix »."), TP(cross(B, C), "Calcule d'abord les vecteurs AB et AC (pas les coordonnées des points).")] }); },
      () => { const it = pk([["On serre un écrou avec une clé", "clé"], ["On pousse une porte", "porte"], ["Un cycliste appuie sur sa pédale", "pedale"]]), rx = pk([0.2, 0.25, 0.3, 0.4]), ry = pk([0.1, 0.15, 0.2]), fx = pk([-40, -30, -20, 20, 30, 50]), fy = pk([60, 80, 100, 120, -60, -80]);
        const mz = r6(rx * fy - ry * fx), am = Math.abs(mz); if (am < 2 || [fx, fy].map(Math.abs).includes(am)) return null;
        /* 25.11 (formule trop large sur téléphone) : calcul de la 3e composante sorti du vecteur colonne. */
        return QN(it[0] + " : le bras de levier est " + M("\\vec{r} = " + v3(N(rx), N(ry), 0)) + " (en m) et la force " + M("\\vec{F} = " + v3(fx, fy, 0)) + " (en N). Calcule la norme du moment " + M("\\vec{M} = \\vec{r} \\times \\vec{F}") + " (en N·m).", am,
          "Troisième composante " + M("r_x F_y - r_y F_x = " + N(rx) + " \\cdot " + pT(fy) + " - " + N(ry) + " \\cdot " + pT(fx) + " = " + N(mz)) + ", donc " + M("\\vec{r} \\times \\vec{F} = " + v3(0, 0, N(mz))) + " ; norme " + M(N(am)) + " N·m.",
          { ctx: "moment-" + it[1], guide: [G("Troisième composante " + M("r_x F_y - r_y F_x") + " ?", mz, M(N(rx) + " \\cdot " + pT(fy) + " - " + N(ry) + " \\cdot " + pT(fx) + " = " + N(mz)) + "."), G("Norme du moment (positive) ?", am, M(N(am)) + " N·m.")],
            traps: [TR(Math.abs(r6(rx * fx + ry * fy)), "C'est le produit scalaire (le travail) ; le moment vient du produit vectoriel."), TR(Math.abs(r6(rx * fy + ry * fx)), "r_x F_y − r_y F_x : on soustrait."), TR(nrm([rx, ry]) * nrm([fx, fy]), "‖r‖ · ‖F‖ seulement si la force est perpendiculaire au bras de levier.")] }); },
    ],
    3: [
      () => { const [a, b, c, dn] = pk(TRI3.filter((t) => t[3] > 3 && t[3] < 10)), d = perm([a, b, c]).map((x) => x * sgn()), e = [nz(-1, 1), nz(-1, 1), nz(-1, 1)], wv = cross(d, e); if (wv.filter((x) => x).length < 2) return null;
        const A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], lam = pk([1, 2, -1, -2]), P = add3(add3(A, d, lam), wv), AP = P.map((x, i) => x - A[i]), cr = cross(AP, d), nc = nrm(cr), dist = nc / dn, ro = rnd(dist);
        return QN("Calcule la distance du point " + ptN("P", ...P) + " à la droite " + eqP(A, d) + (ro ? " (au centième)." : "."), dist,
          M("\\overrightarrow{AP} = " + v3(...AP)) + ", " + M("\\overrightarrow{AP} \\times \\vec{d} = " + v3(...cr)) + " ; distance " + M("\\frac{\\|\\overrightarrow{AP} \\times \\vec{d}\\|}{\\|\\vec{d}\\|} = \\frac{\\sqrt{" + Math.round(nc * nc) + "}}{" + dn + "} " + eqv(dist)) + ".",
          Object.assign({ ctx: "distance-point-droite", guide: [GP("Composantes de " + M("\\overrightarrow{AP}") + " (A, point de départ de la droite) ?" + TRIP, AP, M(v3(...AP)) + "."), GP(M("\\overrightarrow{AP} \\times \\vec{d}") + " ?" + TRIP, cr, M(v3(...cr)) + "."), G(M("\\|\\vec{d}\\|") + " ?", dn, M("\\sqrt{" + dn * dn + "} = " + dn) + "."), G("Distance " + M("\\frac{\\|\\overrightarrow{AP} \\times \\vec{d}\\|}{\\|\\vec{d}\\|}") + (ro ? " (au centième)" : "") + " ?", dist, M(eqv(dist).replace(/^= /, "")) + ".", ro)],
            traps: [TR(nrm(AP), "AP est oblique : la distance se mesure perpendiculairement à la droite."), TR(nc, "Divise encore par la norme de d."), TR(nc / (dn * dn), "On divise par ‖d‖, pas par ‖d‖².")] }, ro ? { round: ro } : {})); },
      () => { const u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], t = pk([2, 3, -1, -2, 0.5, 1.5]), C = add3(A, u, t); if (!C.every(Number.isInteger)) return null; const B = add3(A, u), k = C[2];
        if ([0, 1, -1].includes(k) || A.includes(k) || B.includes(k) || C[0] === k || C[1] === k) return null;
        return QN("On donne " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, k)") + ". Trouve " + M("k") + " pour que les trois points soient alignés, c'est-à-dire " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC} = \\vec{0}") + ".", k,
          "Le produit vectoriel est nul quand les vecteurs sont colinéaires : " + M("\\overrightarrow{AC} = t \\, \\overrightarrow{AB}") + " avec " + M("\\overrightarrow{AB} = " + v3(...u)) + ". En x : " + M(pT(C[0] - A[0]) + " = " + pT(u[0]) + " t") + ", " + M("t = " + fT(t)) + " ; en z : " + M("k = " + fT(A[2]) + " + " + pT(t) + " \\cdot " + pT(u[2]) + " = " + k) + ".",
          { ctx: "alignement", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), G("Facteur " + M("t") + " tel que " + M("\\overrightarrow{AC} = t \\, \\overrightarrow{AB}") + " (lis-le sur les abscisses) ?", t, M(fT(C[0] - A[0]) + " \\div " + pT(u[0]) + " = " + fT(t)) + "."), G(M("k = z_A + t \\cdot u_z") + " ?", k, M(k) + ".")],
            traps: [TR(B[2], "C'est la cote de B : multiplie le vecteur AB par t = " + T(t) + "."), TR(r6(A[2] - t * u[2]), "Attention au signe : k = z_A + t · (z_B − z_A)."), TR(r6(t * u[2]), "Ajoute la cote de A.")] }); },
      () => { const A = [R.int(-2, 3), R.int(-2, 3), R.int(0, 3)], u = [nz(-3, 3), nz(-3, 3), R.int(-2, 2)], v = [R.int(-3, 3), nz(-3, 3), nz(-2, 2)], w = cross(u, v); if (w.filter((x) => x).length < 2) return null;
        const B = add3(A, u), C = add3(B, v), n = nrm(w), ro = rnd(n), it = pk(["Une rampe d'accès", "Un pare-soleil", "Une plaque de verre"]);
        return QN(it + " a la forme d'un parallélogramme " + M("ABCD") + " avec " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + ptN("C", ...C) + " (en m). Calcule son aire (en m²" + (ro ? ", au centième" : "") + ").", n,
          "Dans " + M("ABCD") + ", " + M("\\overrightarrow{AD} = \\overrightarrow{BC}") + ". " + M("\\overrightarrow{AB} = " + v3(...u)) + ", " + M("\\overrightarrow{BC} = " + v3(...v)) + ", " + M("\\overrightarrow{AB} \\times \\overrightarrow{BC} = " + v3(...w)) + " ; aire " + M("\\sqrt{" + r6(n * n) + "} " + eqv(n)) + " m².",
          Object.assign({ ctx: "aire-parallelogramme", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), GP("Composantes de " + M("\\overrightarrow{BC}") + " (égal à " + M("\\overrightarrow{AD}") + ") ?" + TRIP, v, M(v3(...v)) + "."), GP(M("\\overrightarrow{AB} \\times \\overrightarrow{BC}") + " ?" + TRIP, w, M(v3(...w)) + "."), G("Aire" + (ro ? " (au centième)" : "") + " ?", n, M(eqv(n).replace(/^= /, "")) + ".", ro)],
            traps: [TR(n / 2, "C'est l'aire du triangle ABC ; le parallélogramme vaut le double."), TR(nrm(u) * nrm(v), "AB · BC ne vaut que pour un rectangle : passe par le produit vectoriel."), TR(n * n, "N'oublie pas la racine carrée.")] }, ro ? { round: ro } : {})); },
    ],
  };

  // ===================================== J3. fratmp : fonctions rationnelles simples (S8.FS.06, 24.11) =====================================
  const fracT = (a, b, c, d) => "\\frac{" + lin(a, b) + "}{" + lin(c, d) + "}";
  const hyp = (k, h, v) => (x) => k / (x - h) + v;
  const RA = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-9, 9), c = pk([2, 3, 4, 5, -2, -3]), d = nz(-9, 9), x = r6(-d / c); if (a * d === b * c || Math.abs(x) === 1 || Math.abs(d) === Math.abs(x) || den(x) > 6) return null;
        return QN("Quelle est la valeur interdite de " + M("f(x) = " + fracT(a, b, c, d)) + " ? (fraction acceptée)", x, "Le dénominateur s'annule : " + M(lin(c, d) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "valeur-interdite", guide: [G("On résout " + M(lin(c, d) + " = 0") + " : " + M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR(-x, "Attention au signe en isolant x."), TR(r6(-b / a), "C'est le zéro (numérateur) ; la valeur interdite annule le dénominateur."), TR(-d, "Divise encore par " + c + ".")] }); },
      () => { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-9, 9), c = nz(-4, 4), d = nz(-9, 9), x = r6(-b / a); if (a * d === b * c || Math.abs(x) === 1 || Math.abs(b) === Math.abs(x) || den(x) > 6 || c * x + d === 0) return null;
        return QN("Quel est le zéro de " + M("f(x) = " + fracT(a, b, c, d)) + " ? (fraction acceptée)", x, "Un quotient est nul quand son numérateur est nul (et le dénominateur non nul) : " + M(lin(a, b) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "zero", guide: [G("On résout " + M(lin(a, b) + " = 0") + " : " + M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR(r6(-d / c), "C'est la valeur interdite ; le zéro annule le numérateur."), TR(-x, "Attention au signe."), TR(r6(b / d), "On ne simplifie pas les termes constants : résous numérateur = 0.")] }); },
      () => { const a = nz(-9, 9), c = pk([2, 3, 4, 5, -2, -4]), b = nz(-9, 9), d = nz(-9, 9), y = r6(a / c); if (a * d === b * c || Math.abs(y) === 1 || den(y) > 5 || Math.abs(y) === Math.abs(a)) return null;
        return QN("La courbe de " + M("f(x) = " + fracT(a, b, c, d)) + " a une asymptote horizontale " + M("y = k") + ". Que vaut " + M("k") + " ? (fraction acceptée)", y, "Pour x très grand, seuls les termes en x comptent : " + M("f(x) \\approx \\frac{" + a + "x}{" + c + "x} = " + fT(y)) + ".",
          { ctx: "asymptote-horizontale", guide: [G("Coefficient de " + M("x") + " au numérateur ?", a, M(a) + "."), G("Au dénominateur ?", c, M(c) + "."), G(M("k") + " = ?", y, M(fT(y)) + ".")],
            traps: [TR(r6(b / d), "Pour x très grand, ce sont les termes en x qui comptent, pas les constantes."), TR(r6(-d / c), "C'est l'asymptote verticale (valeur interdite)."), TR(r6(c / a), "Numérateur divisé par dénominateur : a ÷ c.")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), b = nz(-9, 9), c = pk([2, 3, 4, -2, -3]), d = nz(-9, 9), X = r6(-d / c), Y = r6(a / c); if (a * d === b * c || den(X) > 4 || den(Y) > 4 || Math.abs(X) === Math.abs(Y)) return null;
        return QP("Donne les asymptotes de " + M("f(x) = " + fracT(a, b, c, d)) + " : verticale " + M("x = \\ldots") + " et horizontale " + M("y = \\ldots") + ". Réponds « x ; y » (fractions acceptées).", [X, Y],
          "Verticale : " + M(lin(c, d) + " = 0") + ", " + M("x = " + fT(X)) + ". Horizontale : " + M("y = \\frac{" + a + "}{" + c + "} = " + fT(Y)) + ".",
          { ctx: "asymptotes", guide: [G("Asymptote verticale : " + M("x") + " = ?", X, M(fT(X)) + "."), G("Asymptote horizontale : " + M("y") + " = ?", Y, M(fT(Y)) + "."), GP("Réponse ?", [X, Y], M("x = " + fT(X)) + ", " + M("y = " + fT(Y)) + ".")],
            traps: [TP([-X, Y], "Valeur interdite : attention au signe."), TP([X, r6(b / d)], "Asymptote horizontale : rapport des coefficients de x."), TP([r6(-b / a), Y], "L'asymptote verticale vient du dénominateur.")] }); },
      () => { let r1 = nz(-6, 6), r2 = nz(-6, 6); if (r1 === r2 || Math.abs(r1) === 1 || Math.abs(r2) === 1 || r1 === -r2) return null; const al = nz(-7, 7); if (-al === r1 || -al === r2) return null; const p = -(r1 + r2), q = r1 * r2;
        return QS("Quelles sont les valeurs interdites de " + M("f(x) = \\frac{" + lin(1, al) + "}{" + polyT([1, p, q]) + "}") + " ? Sépare-les par « ; ».", [r1, r2],
          "Le dénominateur " + M(polyT([1, p, q]) + " = (" + lin(1, -r1) + ")(" + lin(1, -r2) + ")") + " s'annule en " + M(fT(Math.min(r1, r2))) + " et " + M(fT(Math.max(r1, r2))) + ".",
          { ctx: "domaine-quadratique", guide: [G("Produit des deux racines du dénominateur ?", q, M(q) + "."), G("Somme des deux racines ?", r1 + r2, M(r1 + r2) + "."), GSet("Valeurs interdites ?", [r1, r2], M(setT([r1, r2]).replace("S = ", "")) + ".")],
            traps: [TS([-r1, -r2], "Signes : (x − a)(x − b) s'annule en a et b."), TS([-al], "C'est le zéro du numérateur ; les valeurs interdites annulent le dénominateur."), TS([r1, r2, -al], "Le zéro du numérateur n'est pas interdit.")] }); },
      () => { const a = nz(-5, 5), c = nz(-3, 3), d = nz(-6, 6), k = nz(-4, 4), x0 = pk([2, 3, -2, -3, 4, 5]), b = k * (c * x0 + d) - a * x0; if (a - k * c === 0 || c * x0 + d === 0 || !b || a * d === b * c || k === a) return null;
        return QN("Résous " + M(fracT(a, b, c, d) + " = " + k) + ".", x0,
          "On multiplie par " + M(lin(c, d)) + " (non nul) : " + M(lin(a, b) + " = " + k + "(" + lin(c, d) + ")") + ", " + M(lin(a - k * c, 0) + " = " + (k * d - b)) + ", " + M("x = " + x0) + " (pas une valeur interdite).",
          { ctx: "equation-rationnelle", guide: [G("Après " + M("ax + b = k(cx + d)") + ", coefficient de " + M("x") + " (" + M("a - kc") + ") ?", a - k * c, M(a - k * c) + "."), G("Membre de droite " + M("kd - b") + " ?", k * d - b, M(k * d - b) + "."), G(M("x") + " = ?", x0, M(x0) + ".")],
            traps: [TR(-x0, "Attention au signe en isolant x."), TR(r6((k * d - b) / a), "Développe aussi k(cx + d) : le terme en x passe à gauche."), TR(r6((k - b) / a), "Multiplie d'abord les deux membres par le dénominateur.")] }); },
    ],
    3: [
      () => { const h = nz(-3, 3), v = nz(-3, 3), k = pk([1, 2, 3, -1, -2]); if (Math.abs(h) === Math.abs(v)) return null; const fig = FIG.plot([{ f: hyp(k, h, v) }], [], { xr: [-6, 6], yr: [-6, 6], numbers: true, label: "hyperbole" });
        return QP("Le graphique montre la courbe de " + M("f(x) = \\frac{k}{x - h} + v") + ". Lis ses asymptotes : verticale " + M("x = \\ldots") + " et horizontale " + M("y = \\ldots") + ". Réponds « x ; y ».", [h, v],
          "La courbe s'approche de la droite verticale " + M("x = " + h) + " (valeur interdite) et de la droite horizontale " + M("y = " + v) + " (pour x très grand) : " + M("f(x) = \\frac{" + k + "}{" + lin(1, -h) + "}" + sg(v)) + ".",
          { ctx: "lecture-graphe", fig, guide: [G("Abscisse de la droite verticale dont la courbe s'approche ?", h, M("x = " + h) + "."), G("Ordonnée de la droite horizontale ?", v, M("y = " + v) + "."), GP("Réponse ?", [h, v], M("x = " + h) + ", " + M("y = " + v) + ".")],
            traps: [TP([-h, v], "Lis l'abscisse sur le graphique : la valeur interdite est " + h + "."), TP([h, -v], "Lis l'ordonnée de l'asymptote horizontale.")] }); },
      () => { const h = nz(-3, 3), v = nz(-3, 3), dl = pk([1, 2, -1, -2]), q = pk([2, 3, -2, -3]), k = dl * q, x0 = h + dl, y0 = v + q; if (Math.abs(k) < 2 || Math.abs(x0) > 5 || Math.abs(y0) > 5 || Math.abs(h) === Math.abs(v)) return null;
        const fig = FIG.plot([{ f: hyp(k, h, v) }], [[x0, y0, "P"]], { xr: [-6, 6], yr: [-6, 6], numbers: true, hlines: [v], vlines: [h], label: "hyperbole et ses asymptotes" });
        return QN("La courbe de " + M("f(x) = \\frac{k}{x - h} + v") + " a pour asymptotes " + M("x = " + h) + " et " + M("y = " + v) + " (en traitillé) et passe par le point " + M("P") + " du graphique. Que vaut " + M("k") + " ?", k,
          "On lit " + ptN("P", x0, y0) + " : " + M(y0 + " = \\frac{k}{" + pT(x0) + " - " + pT(h) + "}" + sg(v)) + ", " + M("\\frac{k}{" + dl + "} = " + q) + ", " + M("k = " + k) + ".",
          { ctx: "retrouver-k", fig, guide: [GP("Coordonnées de " + M("P") + " ?", [x0, y0], ptN("P", x0, y0) + "."), G(M("x_P - h") + " ?", dl, M(dl) + "."), G(M("y_P - v") + " ?", q, M(q) + "."), G(M("k = (x_P - h)(y_P - v)") + " ?", k, M(k) + ".")],
            traps: [TR(r6(q / dl), "k = (y − v)(x − h) : on multiplie."), TR(y0 * dl, "Soustrais d'abord v = " + v + "."), TR(-k, "Attention aux signes.")] }); },
      () => { const it = pk([["Une imprimante 3D coûte", "frais fixes", "pièces imprimées", "pièce", "imprimante"], ["Un club de sport facture une cotisation annuelle de", "cotisation", "séances", "séance", "club"], ["Un atelier de t-shirts paie", "frais de démarrage", "t-shirts", "t-shirt", "atelier"]]), c = pk([2, 3, 4, 5, 6]), dk = pk([2, 4, 5, 8]), x0 = pk([25, 40, 50, 60, 75, 120]), F = x0 * dk, k = c + dk;
        const txt = it[0] + " " + M(F + "\\text{ CHF}") + " (" + it[1] + "), puis " + M(c + "\\text{ CHF}") + " par " + it[3] + ". Le coût moyen par " + it[3] + " est " + M("C(x) = \\frac{" + F + " + " + c + "x}{x}") + ". Pour combien de " + it[2] + " le coût moyen descend-il à " + M(k + "\\text{ CHF}") + " ?";
        return QN(txt, x0, M("\\frac{" + F + " + " + c + "x}{x} = " + k) + " donne " + M(F + " + " + c + "x = " + k + "x") + ", " + M(dk + "x = " + F) + ", " + M("x = " + x0) + ". (Asymptote horizontale " + M("y = " + c) + " : le coût moyen ne descend jamais sous " + c + " CHF.)",
          { ctx: "cout-moyen-" + it[4], guide: [G("On multiplie par x : coefficient de x après regroupement, " + M(k + " - " + c) + " ?", dk, M(dk) + "."), G(M("x") + " = ?", x0, M(F + " \\div " + dk + " = " + x0) + ".")],
            traps: [TR(r6(F / k), "Le coût par " + it[3] + " s'ajoute : " + k + "x = " + F + " + " + c + "x."), TR(r6(F / (k + c)), "On soustrait " + c + "x des deux côtés."), TR(r6(F / c), "Pose C(x) = " + k + ".")] }); },
    ],
  };

  const PROBS = {
    posdroites: () => P("d : x = 1 + t, y = 2 − t, z = 3 + 2t ; g : x = 5 + 2s, y = 1 + s, z = m − s.", [["a) t obtenu avec les équations en x et y", 2], ["b) s obtenu avec les mêmes équations", -1], ["c) m pour que les droites soient sécantes", 6]], ["1 + t = 5 + 2s et 2 − t = 1 + s.", "En z : 3 + 2 · 2 = m − (−1)."], "a) " + M("t = 2") + " ; b) " + M("s = -1") + " ; c) " + M("7 = m + 1") + ", " + M("m = 6") + " : point commun " + M("(3 \\,;\\, 0 \\,;\\, 7)") + ". Pour une autre valeur de m, les droites seraient gauches."),
    projmp: () => P("On donne u = (4 ; 7) et v = (3 ; 4).", [["a) u · v", 40], ["b) Projection scalaire de u sur v", 8], ["c) Première composante du vecteur projeté de u sur v", 4.8]], ["4 · 3 + 7 · 4.", "40 ÷ ‖v‖ = 40 ÷ 5."], "a) 40 ; b) " + M("\\frac{40}{5} = 8") + " ; c) " + M("\\frac{40}{25} \\cdot 3 = 4{,}8") + " (projeté " + M("(4{,}8 \\,;\\, 6{,}4)") + ")."),
    pvectmp: () => P("On donne u = (1 ; 2 ; 2) et v = (2 ; −1 ; 2).", [["a) Première composante de u × v", 6], ["b) Troisième composante de u × v", -5], ["c) Aire du parallélogramme construit sur u et v (au centième)", Math.sqrt(65), 0.01]], ["u₂v₃ − u₃v₂ = 2 · 2 − 2 · (−1).", "u₁v₂ − u₂v₁ = 1 · (−1) − 2 · 2."], "a) 6 ; b) −5 (u × v = (6 ; 2 ; −5), orthogonal à u : 6 + 4 − 10 = 0) ; c) " + M("\\sqrt{36 + 4 + 25} = \\sqrt{65} \\approx 8{,}06") + "."),
    fratmp: () => P("Soit f(x) = (2x − 6) ÷ (x + 4).", [["a) Valeur interdite", -4], ["b) Zéro de f", 3], ["c) Asymptote horizontale y = …", 2]], ["x + 4 = 0.", "Pour x très grand : 2x ÷ x."], "a) −4 (asymptote verticale " + M("x = -4") + ") ; b) " + M("2x - 6 = 0") + ", " + M("x = 3") + " ; c) " + M("y = 2") + "."),
    coordmp: () => P("On donne A(1 ; 2) et B(4 ; 6).", [["a) Distance AB", 5], ["b) Abscisse du milieu de [AB]", 2.5], ["c) Rayon polaire r du point B (au centième)", Math.hypot(4, 6), 0.01]], ["√(3² + 4²).", "(1 + 4) ÷ 2."], "a) 5 ; b) 2,5 (milieu (2,5 ; 4)) ; c) " + M("\\sqrt{52} \\approx 7{,}21") + "."),
    vectmp: () => P("On donne u = (3 ; −4) et v = (1 ; 2).", [["a) Norme de u", 5], ["b) Première composante de 2u − v", 5], ["c) Seconde composante de 2u − v", -10]], ["√(9 + 16).", "2 · 3 − 1."], "a) 5 ; b) 5 ; c) " + M("2 \\cdot (-4) - 2 = -10") + "."),
    scalmp: () => P("On donne u = (2 ; 1) et v = (1 ; 3).", [["a) u · v", 5], ["b) cos de l'angle (au centième)", 5 / Math.sqrt(50), 0.01], ["c) Angle en degrés (au dixième)", 45, 0.1]], ["2 · 1 + 1 · 3.", "5 ÷ (√5 · √10)."], "a) 5 ; b) " + M("\\frac{5}{\\sqrt{50}} \\approx 0{,}71") + " ; c) 45°."),
    droiteparam: () => P("La droite d passe par A(2 ; −1) et B(5 ; 3) : x = 2 + 3t, y = −1 + 4t.", [["a) Seconde composante du vecteur directeur AB", 4], ["b) Abscisse du point de d pour t = 2", 8], ["c) Valeur de t pour le point (−1 ; −5)", -1]], ["3 − (−1).", "2 + 3 · 2."], "a) 4 (vecteur (3 ; 4)) ; b) 8 ; c) " + M("2 + 3t = -1") + ", " + M("t = -1") + "."),
    ineqmp: () => P("On étudie (2x − 1) ÷ (x + 3) ≥ 0.", [["a) Zéro du numérateur", 0.5], ["b) Valeur interdite", -3], ["c) Signe du quotient pour x = 0 (−1 ou 1)", -1]], ["2x − 1 = 0.", "x + 3 = 0."], "a) " + M("\\frac{1}{2}") + " ; b) −3 ; c) " + M("\\frac{-1}{3} < 0") + ". " + M("S = \\left]-\\infty \\,;\\, -3\\right[ \\cup \\left[\\frac{1}{2} \\,;\\, +\\infty\\right[") + "."),
    fctmp: () => P("Soit f(x) = 2x + 3 et g(x) = x².", [["a) f(g(2))", 11], ["b) g(f(2))", 49], ["c) f⁻¹(11)", 4]], ["g(2) = 4.", "f(2) = 7."], "a) " + M("f(4) = 11") + " ; b) " + M("g(7) = 49") + " ; c) " + M("2x + 3 = 11") + ", " + M("x = 4") + "."),
    polymp: () => P("Soit P(x) = x³ − 7x + 6.", [["a) P(2)", 0], ["b) Coefficient de x dans le quotient de P par (x − 1)", 1], ["c) Plus petit zéro de P", -3]], ["8 − 14 + 6.", "Quotient x² + x − 6."], "a) 0 ; b) quotient " + M("x^2 + x - 6") + " ; c) " + M("(x - 1)(x - 2)(x + 3)") + ", plus petit zéro −3."),
    sinusmp: () => P("La température d'une ville varie entre −2 °C et 24 °C sur une période de 12 mois.", [["a) Amplitude", 13], ["b) Axe d", 11], ["c) Coefficient b (x en mois), au centième", PI / 6, 0.01]], ["(24 − (−2)) ÷ 2.", "(24 + (−2)) ÷ 2."], "a) 13 ; b) 11 ; c) " + M("b = \\frac{2\\pi}{12} = \\frac{\\pi}{6} \\approx 0{,}52") + "."),
    explogfn: () => P("On cherche f(x) = a · b^x passant par (0 ; 3) et (2 ; 12).", [["a) a", 3], ["b) b", 2], ["c) f(5)", 96]], ["f(0) = a.", "3b² = 12."], "a) 3 ; b) 2 ; c) " + M("3 \\cdot 2^5 = 96") + "."),
  };

  const NEW = [
    { id: "coordmp", th: "CO", sem: "S7", theme: "es", label: "Coordonnées : distance, milieu, polaires", ex: "AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}", lv: CO,
      hint: "Distance : √(Δx² + Δy²) (+ Δz² dans l'espace). Milieu : moyenne des coordonnées. Polaires : x = r cos θ, y = r sin θ ; r = √(x² + y²), θ selon le quadrant.",
      lesson: ["Coordonnées", "Repérer un point dans le plan ou dans l'espace.", "Distance \\(AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\\) (ajouter \\((z_B - z_A)^2\\) dans l'espace). Milieu : \\(\\left(\\frac{x_A + x_B}{2} ; \\frac{y_A + y_B}{2}\\right)\\). Coordonnées polaires \\((r ; \\theta)\\) : \\(x = r\\cos\\theta\\), \\(y = r\\sin\\theta\\) ; inversement \\(r = \\sqrt{x^2 + y^2}\\) et \\(\\theta\\) d'après le quadrant.",
        ["\\(A(1 ; 2)\\), \\(B(4 ; 6)\\) : \\(AB = 5\\), milieu \\((2{,}5 ; 4)\\)", "\\((2 ; 60°)\\) en cartésiennes : \\((1 ; \\sqrt{3})\\)"], "Pour θ, vérifie le quadrant : \\((-4 ; -4)\\) donne 225°, pas 45°."],
      comps: ["Calculer une distance ou un milieu", "Retrouver un point ; passer des polaires aux cartésiennes", "Résoudre un problème de coordonnées (espace, équidistance)"] },
    { id: "vectmp", th: "VE", sem: "S7", theme: "es", label: "Vecteurs : composantes, opérations, norme", ex: "\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix}", lv: VE,
      hint: "AB = B − A (arrivée − départ). On additionne et on multiplie composante par composante. Norme : √(x² + y² (+ z²)). Colinéaires : l'un est un multiple de l'autre.",
      lesson: ["Vecteurs", "Un vecteur : une direction, un sens, une longueur.", "\\(\\overrightarrow{AB}\\) a pour composantes \\(B - A\\). Opérations composante par composante : \\(a\\vec{u} + b\\vec{v}\\). Norme \\(\\|\\vec{u}\\| = \\sqrt{x^2 + y^2}\\) (\\(+ z^2\\) dans l'espace). \\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires si \\(\\vec{v} = k\\vec{u}\\). ABCD parallélogramme \\(\\iff \\overrightarrow{AD} = \\overrightarrow{BC}\\).",
        ["\\(A(1 ; 2)\\), \\(B(4 ; -2)\\) : \\(\\overrightarrow{AB} = (3 ; -4)\\), norme 5"], "\\(\\overrightarrow{AB} = B - A\\), pas \\(A - B\\)."],
      comps: ["Calculer des composantes, une combinaison, une norme", "Utiliser la colinéarité ; parallélogramme ; norme dans l'espace", "Construire un point avec des vecteurs ; centre de gravité"] },
    { id: "scalmp", th: "VE", sem: "S7", theme: "es", label: "Produit scalaire, angle, orthogonalité", ex: "\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2", lv: SC,
      hint: "u · v = x₁x₂ + y₁y₂ (+ z₁z₂) = ‖u‖ ‖v‖ cos α. Orthogonaux ⟺ produit scalaire nul. Angle : cos α = u · v ÷ (‖u‖ ‖v‖).",
      lesson: ["Produit scalaire", "Un nombre qui dit si deux vecteurs « vont dans le même sens ».", "\\(\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2\\) (\\(+ z_1 z_2\\)) \\(= \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Nul : vecteurs orthogonaux ; positif : angle aigu ; négatif : angle obtus. Angle : \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\). Travail d'une force : \\(W = \\vec{F} \\cdot \\vec{d}\\).",
        ["\\((2 ; 1) \\cdot (1 ; 3) = 5\\), \\(\\cos\\alpha = \\frac{5}{\\sqrt{5}\\sqrt{10}}\\), \\(\\alpha = 45°\\)"], "On multiplie x avec x et y avec y, puis on additionne."],
      comps: ["Calculer un produit scalaire ; orthogonalité", "Calculer un angle ; utiliser normes et cosinus ; travail", "Angle d'un triangle ; angle droit ; orthogonalité dans l'espace"] },
    { id: "projmp", th: "VE", sem: "S7", theme: "es", label: "Projection orthogonale", ex: "\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}\\,\\vec{v}", lv: PJ,
      hint: "Projection scalaire de u sur v : u · v ÷ ‖v‖. Vecteur projeté : (u · v ÷ ‖v‖²) · v. Projeté d'un point P sur une droite (A ; d) : H = A + t · d avec t = AP · d ÷ ‖d‖².",
      lesson: ["Projection orthogonale", "L'ombre d'un vecteur sur une direction, quand la lumière tombe à angle droit.", "Projection scalaire de \\(\\vec{u}\\) sur la direction de \\(\\vec{v}\\) : \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|} = \\|\\vec{u}\\|\\cos\\alpha\\). Vecteur projeté : \\(\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}\\,\\vec{v}\\) ; la partie \\(\\vec{u} - \\vec{p}\\) est orthogonale à \\(\\vec{v}\\). Projeté orthogonal d'un point \\(P\\) sur la droite passant par \\(A\\) de direction \\(\\vec{d}\\) : \\(H = A + t\\,\\vec{d}\\) avec \\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}\\) ; la distance de \\(P\\) à la droite est \\(PH\\).",
        ["\\(\\vec{u} = (4 ; 7)\\), \\(\\vec{v} = (3 ; 4)\\) : \\(\\vec{u} \\cdot \\vec{v} = 40\\), projection 8, projeté \\(\\frac{40}{25}(3 ; 4) = (4{,}8 ; 6{,}4)\\)"], "Pour le vecteur projeté, on divise par \\(\\|\\vec{v}\\|^2\\) ; pour la longueur projetée, par \\(\\|\\vec{v}\\|\\)."],
      comps: ["Projection scalaire, vecteur projeté, composante d'une force", "Projeté d'un point sur une droite ; distance point-droite", "Projection dans l'espace ; hauteur et aire d'un triangle"] },
    { id: "pvectmp", th: "VE", sem: "S7", theme: "es", label: "Produit vectoriel", ex: "\\vec{u} \\times \\vec{v} = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}", lv: PV,
      hint: "u × v = (u₂v₃ − u₃v₂ ; u₃v₁ − u₁v₃ ; u₁v₂ − u₂v₁) : un vecteur orthogonal à u et à v. Sa norme = aire du parallélogramme construit sur u et v (triangle : la moitié). L'ordre compte : v × u = −(u × v).",
      lesson: ["Produit vectoriel", "Un vecteur perpendiculaire à deux vecteurs de l'espace, dont la longueur mesure une aire.", "Dans l'espace, \\(\\vec{u} \\times \\vec{v} = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}\\) (on « croise » les composantes). C'est un vecteur orthogonal à \\(\\vec{u}\\) et à \\(\\vec{v}\\) : un vecteur normal au plan qu'ils engendrent. Sa norme \\(\\|\\vec{u} \\times \\vec{v}\\|\\) est l'aire du parallélogramme construit sur \\(\\vec{u}\\) et \\(\\vec{v}\\) ; le triangle en est la moitié. Il est nul si et seulement si les vecteurs sont colinéaires. L'ordre compte : \\(\\vec{v} \\times \\vec{u} = -\\vec{u} \\times \\vec{v}\\).",
        ["\\((1 ; 2 ; 2) \\times (2 ; -1 ; 2) = (6 ; 2 ; -5)\\) ; vérification : \\(6 + 4 - 10 = 0\\)", "Aire du parallélogramme : \\(\\sqrt{36 + 4 + 25} = \\sqrt{65} \\approx 8{,}06\\)"], "Le produit scalaire donne un nombre (angle, travail) ; le produit vectoriel donne un vecteur (normale, aire, moment)."],
      comps: ["Calculer les composantes d'un produit vectoriel ; aire à partir de sa norme", "Aire d'un triangle dans l'espace ; vecteur normal ; moment d'une force", "Distance d'un point à une droite ; alignement ; aire d'un parallélogramme dans l'espace"] },
    { id: "droiteparam", th: "DP", sem: "S7", theme: "es", label: "Droites paramétriques", ex: "\\begin{cases} x = 2 + 3t \\\\ y = -1 + 4t \\end{cases}", lv: DP,
      hint: "Point de départ A, vecteur directeur d : (x ; y) = A + t · d. Un point est sur la droite si le même t convient pour toutes les coordonnées. Intersection : égalise les coordonnées (deux paramètres t et s).",
      lesson: ["Droites paramétriques", "Une droite décrite par un point et une direction.", "La droite passant par \\(A\\) de vecteur directeur \\(\\vec{d}\\) : \\(x = x_A + t\\,d_x\\), \\(y = y_A + t\\,d_y\\) (\\(+ z\\) dans l'espace). Chaque valeur de \\(t\\) donne un point. Un point est sur la droite s'il existe un même \\(t\\) pour toutes les coordonnées. Angle entre deux droites : angle aigu entre leurs vecteurs directeurs.",
        ["Par \\(A(2 ; -1)\\) et \\(B(5 ; 3)\\) : \\(x = 2 + 3t\\), \\(y = -1 + 4t\\)"], "Pour l'intersection de deux droites, utilise deux paramètres différents (t et s)."],
      comps: ["Calculer un point d'une droite ; trouver le paramètre", "Intersection avec un axe ou un plan de coordonnées", "Intersection de deux droites ; angle ; problèmes"] },
    { id: "posdroites", th: "DP", sem: "S7", theme: "es", label: "Position relative de deux droites", ex: "d \\parallel g, \\ d \\cap g = \\{P\\}", lv: PD,
      hint: "Vecteurs directeurs colinéaires : parallèles (confondues si un point de l'une est sur l'autre). Sinon, dans le plan : sécantes. Dans l'espace : on résout avec x et y (t et s), puis on vérifie z ; si z ne concorde pas, les droites sont gauches.",
      lesson: ["Position relative de deux droites", "Parallèles, confondues, sécantes… ou gauches dans l'espace.", "On compare d'abord les vecteurs directeurs. Colinéaires : droites parallèles ; confondues si, en plus, un point de l'une est sur l'autre. Non colinéaires : dans le plan, les droites sont sécantes (on égale les coordonnées, avec deux paramètres t et s). Dans l'espace, on résout le système des équations en x et en y, puis on vérifie la troisième : si elle est satisfaite, les droites sont sécantes ; sinon, elles n'ont aucun point commun sans être parallèles : elles sont gauches.",
        ["\\((2 ; -1)\\) et \\((-6 ; 3)\\) sont colinéaires (facteur \\(-3\\)) : droites parallèles", "Avec x et y on trouve \\(t = 2\\), \\(s = -1\\) ; si les cotes diffèrent, les droites sont gauches"], "Deux droites de l'espace qui ne se coupent pas ne sont pas forcément parallèles."],
      comps: ["Reconnaître des droites parallèles ; point d'intersection dans le plan", "Droites confondues ; parallélisme dans l'espace ; paramètre du point commun", "Droites sécantes ou gauches dans l'espace"] },
    { id: "ineqmp", th: "IN", sem: "S8", theme: "fa", label: "Inéquations, tableau des signes", ex: "\\frac{2x - 1}{x + 3} \\ge 0", lv: IQ,
      hint: "Inéquation linéaire : comme une équation, en retournant le sens si on multiplie ou divise par un négatif. Sinon : tout à gauche, factoriser, tableau des signes ; les valeurs interdites sont toujours exclues.",
      lesson: ["Inéquations", "Trouver tous les x qui vérifient une inégalité.", "Linéaire : on isole x ; multiplier ou diviser par un nombre négatif retourne le sens. Non linéaire : on ramène tout à gauche (\\(\\ldots \\ge 0\\)), on factorise, on dresse le tableau des signes des facteurs, puis on lit les intervalles. Crochet fermé si la borne est comprise, ouvert sinon (toujours ouvert en une valeur interdite et en \\(\\pm\\infty\\)).",
        ["\\(-2x + 1 \\ge 5 \\iff x \\le -2\\)", "\\((x - 2)(x + 3) > 0\\) : \\(]-\\infty ; -3[ \\cup ]2 ; +\\infty[\\)"], "On ne multiplie pas par x (ni par un dénominateur) sans connaître son signe."],
      comps: ["Résoudre une inéquation linéaire ou un encadrement", "Résoudre une inéquation du 2e degré (tableau des signes)", "Résoudre une inéquation rationnelle ou de degré 3"] },
    { id: "fctmp", th: "FP", sem: "S8", theme: "fa", label: "Fonctions : réciproque, parité, transformations", ex: "g(x) = f(x - h) + k", lv: FC,
      hint: "f⁻¹ défait f. Paire : f(−x) = f(x) ; impaire : f(−x) = −f(x). f(x − h) + k : translation de h vers la droite et de k vers le haut. k·f(x) étire verticalement, f(kx) comprime horizontalement. (f ∘ g)(x) = f(g(x)).",
      lesson: ["Fonctions", "Transformer, inverser, composer.", "Réciproque : si \\(f(a) = b\\), alors \\(f^{-1}(b) = a\\) (on isole x, puis on renomme). Parité : \\(f(-x) = f(x)\\) (paire, symétrie d'axe vertical) ou \\(f(-x) = -f(x)\\) (impaire, symétrie centrale). Transformations : \\(f(x - h) + k\\) translate, \\(k f(x)\\) étire verticalement, \\(f(kx)\\) comprime horizontalement. Composition : \\((f \\circ g)(x) = f(g(x))\\).",
        ["\\(f(x) = 2^x + 1\\) : \\(f^{-1}(x) = \\log_2(x - 1)\\)", "\\(f(x) = x^3\\) est impaire"], "Dans \\(f(x - 2)\\), le graphe se décale vers la droite (pas vers la gauche)."],
      comps: ["Utiliser la parité, la réciproque ou une translation", "Exprimer une réciproque ; composer ; étirer ou comprimer", "Composée en expression ; domaine ; intersection de graphes"] },
    { id: "polymp", th: "FP", sem: "S8", theme: "fa", label: "Polynômes : zéros, division, signe", ex: "x^3 - 7x + 6 = (x - 1)(x - 2)(x + 3)", lv: PO,
      hint: "P(a) = 0 ⟺ (x − a) divise P. Le reste de la division par (x − a) vaut P(a). Zéro évident : essaie les diviseurs du terme constant. Signe : tableau des signes des facteurs.",
      lesson: ["Polynômes", "Trouver les zéros pour factoriser et étudier le signe.", "Si \\(P(a) = 0\\), on peut diviser \\(P\\) par \\((x - a)\\) (division ou schéma de Horner). Le reste de la division par \\((x - a)\\) est \\(P(a)\\). Un zéro entier divise le terme constant. Une fois factorisé, on lit le signe dans un tableau.",
        ["\\(x^3 - 7x + 6\\) : \\(P(1) = 0\\), quotient \\(x^2 + x - 6\\), zéros \\(1\\), \\(2\\), \\(-3\\)"], "Le reste de la division par \\((x - 2)\\) est \\(P(2)\\), pas \\(P(-2)\\)."],
      comps: ["Calculer une valeur, des zéros, un coefficient", "Diviser un polynôme ; théorème du reste", "Factoriser complètement ; signe ; retrouver un polynôme"] },
    { id: "sinusmp", th: "FS", sem: "S8", theme: "fa", label: "Fonctions sinusoïdales", ex: "f(x) = a\\sin(b(x - c)) + d", lv: SN,
      hint: "a sin(b(x − c)) + d : amplitude |a|, période 2π ÷ b, déphasage c, axe d. Max d + |a|, min d − |a|. Depuis le graphe : a = (max − min) ÷ 2, d = (max + min) ÷ 2.",
      lesson: ["Fonctions sinusoïdales", "Modéliser un phénomène périodique.", "\\(f(x) = a\\sin(b(x - c)) + d\\) : amplitude \\(|a|\\), période \\(\\frac{2\\pi}{b}\\), déphasage \\(c\\) (si \\(a > 0\\), la courbe coupe l'axe en montant en \\(x = c\\)), axe \\(y = d\\). Valeurs entre \\(d - |a|\\) et \\(d + |a|\\). D'un graphe : \\(a = \\frac{\\max - \\min}{2}\\), \\(d = \\frac{\\max + \\min}{2}\\).",
        ["\\(3\\sin\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1\\) : amplitude 3, période \\(\\pi\\), déphasage \\(\\frac{\\pi}{4}\\), max 4, min −2"], "La période est \\(2\\pi \\div b\\), pas \\(2\\pi \\cdot b\\)."],
      comps: ["Lire amplitude, axe, période, extremums", "Trouver b ; déphasage ; calculer une image", "Trouver l'expression ; premier maximum ; modèle de marée"] },
    { id: "explogfn", th: "FS", sem: "S8", theme: "fa", label: "Fonctions exponentielles et logarithmiques", ex: "f(x) = a \\cdot b^x", lv: EL,
      hint: "f(x) = a · b^x : a = f(0), b = facteur quand x augmente de 1. log_b(x − h) : domaine x > h, asymptote x = h. La réciproque de b^x est log_b x.",
      lesson: ["Exponentielles et logarithmes", "Deux fonctions réciproques l'une de l'autre.", "\\(f(x) = a \\cdot b^x\\) (\\(b > 0\\)) : \\(f(0) = a\\), multiplication par \\(b\\) quand x augmente de 1 ; croissante si \\(b > 1\\), décroissante si \\(0 < b < 1\\). \\(\\log_b x\\) est la réciproque de \\(b^x\\) : domaine \\(x > 0\\), zéro en 1, asymptote verticale \\(x = 0\\). \\(\\log_b(x - h) + k\\) : domaine \\(x > h\\).",
        ["Par \\((0 ; 3)\\) et \\((2 ; 12)\\) : \\(f(x) = 3 \\cdot 2^x\\)", "\\(\\log_2(x - 1)\\) : domaine \\(x > 1\\), zéro \\(x = 2\\)"], "Le logarithme n'existe que pour un argument strictement positif."],
      comps: ["Trouver la base ; domaine et zéro d'un logarithme", "Calculer une image, une réciproque ; modèle de croissance", "Retrouver a et b ; translation ; durée (logarithme)"] },
    { id: "fratmp", th: "FS", sem: "S8", theme: "fa", label: "Fonctions rationnelles simples", ex: "f(x) = \\frac{ax + b}{cx + d}", lv: RA,
      hint: "Valeur interdite (asymptote verticale) : le dénominateur s'annule. Zéro : le numérateur s'annule. Asymptote horizontale de (ax + b) ÷ (cx + d) : y = a ÷ c. f(x) = k ÷ (x − h) + v : asymptotes x = h et y = v.",
      lesson: ["Fonctions rationnelles", "Un quotient de deux polynômes, et des asymptotes.", "\\(f(x) = \\frac{ax + b}{cx + d}\\) n'existe pas quand \\(cx + d = 0\\) : valeur interdite, asymptote verticale \\(x = -\\frac{d}{c}\\). Zéro : \\(ax + b = 0\\). Pour x très grand, \\(f(x) \\approx \\frac{ax}{cx} = \\frac{a}{c}\\) : asymptote horizontale \\(y = \\frac{a}{c}\\). Forme \\(f(x) = \\frac{k}{x - h} + v\\) : hyperbole d'asymptotes \\(x = h\\) et \\(y = v\\). Pour résoudre \\(f(x) = k\\), on multiplie par le dénominateur, puis on vérifie que la solution n'est pas interdite.",
        ["\\(f(x) = \\frac{2x - 6}{x + 4}\\) : valeur interdite \\(-4\\), zéro 3, asymptote \\(y = 2\\)"], "Le zéro vient du numérateur, la valeur interdite du dénominateur : ne les confonds pas."],
      comps: ["Valeur interdite, zéro, asymptote horizontale", "Asymptotes ; domaine ; équation rationnelle", "Lire et retrouver une hyperbole ; coût moyen"] },
  ];
  NEW.forEach((n, i) => {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: null, MP: [15, n.sem], FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[n.id] = {};
    if (typeof HINTS_EXTRA !== "undefined") HINTS_EXTRA[n.id] = n.hint;
    if (typeof LESSONS_EXTRA !== "undefined") LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = [PROBS[n.id]];
    if (typeof ORDRE !== "undefined") ORDRE.MP[n.id] = 61 + i;
    if (typeof ORDRE_THEME !== "undefined") ORDRE_THEME.MP[n.id] = n.th;
  });
  window.MP4_IDS = NEW.map((n) => n.id);
})();

// Généré par tools/ref_mp.py (26.11) : objectifs de mathématiques de la maturité professionnelle (plan d'études
// d'établissement MP, semestres 1 à 8, d'après le plan d'études cadre fédéral) et rattachement aux notions de l'app.
// Champs : code, statut (0 = plan d'études cadre, 1 = ajouté par l'école, 2 = facultatif), thème, notion, intitulé, année MP.
const REF_MP = {
  niv: ["PEC", "*", "facultatif"],
  th: ["Semestre 1 — Calcul numérique", "Semestre 1 — Calcul algébrique", "Semestre 1 — Équations", "Semestre 2 — Géométrie", "Semestre 2 — Trigonométrie du triangle rectangle", "Semestre 2 — Systèmes d'équations linéaires", "Semestre 2 — Fonctions : généralités", "Semestre 3 — Fonctions affines", "Semestre 3 — Fonctions quadratiques", "Semestre 4 — Trigonométrie", "Semestre 4 — Analyse de données", "Semestre 5 — Équations avancées", "Semestre 5 — Puissances et logarithmes", "Semestre 6 — Équations exponentielles et logarithmiques", "Semestre 6 — Volumes et similitude", "Semestre 7 — Systèmes de coordonnées", "Semestre 7 — Géométrie vectorielle en dimension 2 et 3", "Semestre 7 — Droites paramétriques", "Semestre 8 — Inéquations", "Semestre 8 — Fonctions : transformations et polynômes", "Semestre 8 — Fonctions sinusoïdales, exponentielles et logarithmiques"],
  no: [""],
  c: [
    ["S1.CN.01", 0, 0, 0, "Connaître les ensembles N, Z, Q et R et situer un nombre dans le plus petit ensemble", 1],
    ["S1.CN.02", 0, 0, 0, "Donner la valeur absolue d'un nombre", 1],
    ["S1.CN.03", 0, 0, 0, "Utiliser la relation d'ordre et écrire un intervalle (notation et représentation)", 1],
    ["S1.CN.04", 0, 0, 0, "Passer d'une écriture à l'autre (fractionnaire, pourcentage, décimale, scientifique)", 1],
    ["S1.CN.05", 0, 0, 0, "Effectuer les 4 opérations et utiliser leurs propriétés", 1],
    ["S1.CN.06", 0, 0, 0, "Appliquer la règle des signes et la hiérarchie des opérations", 1],
    ["S1.CN.07", 1, 0, 0, "Reconnaître un nombre premier et utiliser les critères de divisibilité", 1],
    ["S1.CN.08", 1, 0, 0, "Décomposer un nombre en produit de facteurs premiers", 1],
    ["S1.CN.09", 1, 0, 0, "Déterminer le PGDC et le PPMC de deux nombres", 1],
    ["S1.CN.10", 1, 0, 0, "Rendre une fraction numérique irréductible", 1],
    ["S1.CN.11", 0, 0, 0, "Calculer avec des fractions numériques (4 opérations)", 1],
    ["S1.CN.12", 0, 0, 0, "Connaître la définition et la terminologie des puissances à exposant entier", 1],
    ["S1.CN.13", 0, 0, 0, "Utiliser les propriétés des puissances", 1],
    ["S1.CN.14", 0, 0, 0, "Utiliser les propriétés des racines carrées et simplifier une racine", 1],
    ["S1.CN.15", 1, 0, 0, "Rendre rationnel le dénominateur d'une fraction", 1],
    ["S1.CA.01", 0, 1, 0, "Reconnaître un monôme (coefficient, degré) et réduire des monômes semblables", 1],
    ["S1.CA.02", 0, 1, 0, "Additionner, soustraire et multiplier des monômes", 1],
    ["S1.CA.03", 0, 1, 0, "Réduire et ordonner un polynôme", 1],
    ["S1.CA.04", 0, 1, 0, "Additionner, soustraire et multiplier des polynômes", 1],
    ["S1.CA.05", 0, 1, 0, "Développer avec les identités remarquables (a ± b)² et (a + b)(a − b)", 1],
    ["S1.CA.06", 1, 1, 0, "Développer et factoriser (x + a)(x + b)", 1],
    ["S1.CA.07", 0, 1, 0, "Factoriser par mise en évidence", 1],
    ["S1.CA.08", 0, 1, 0, "Factoriser à l'aide des identités remarquables", 1],
    ["S1.CA.09", 0, 1, 0, "Factoriser par groupements", 1],
    ["S1.CA.10", 1, 1, 0, "Déterminer les valeurs interdites d'une fraction rationnelle", 1],
    ["S1.CA.11", 1, 1, 0, "Simplifier une fraction rationnelle", 1],
    ["S1.CA.12", 1, 1, 0, "Multiplier et diviser des fractions rationnelles", 1],
    ["S1.CA.13", 1, 1, 0, "Additionner et soustraire des fractions rationnelles", 1],
    ["S1.CA.14", 0, 1, 0, "Transformer une formule (isoler une grandeur)", 1],
    ["S1.EQ.01", 0, 2, 0, "Résoudre une équation linéaire (y compris à coefficients irrationnels)", 1],
    ["S1.EQ.02", 0, 2, 0, "Discuter une équation linéaire en fonction d'un paramètre réel", 1],
    ["S1.EQ.03", 0, 2, 0, "Mettre un problème en équation du 1er degré, le résoudre et discuter le résultat", 1],
    ["S1.EQ.04", 0, 2, 0, "Résoudre une équation quadratique par factorisation (aussi à l'aide des identités)", 1],
    ["S1.EQ.05", 0, 2, 0, "Résoudre une équation quadratique avec la formule de Viète (discriminant)", 1],
    ["S1.EQ.06", 0, 2, 0, "Discuter une équation quadratique en fonction d'un paramètre réel", 1],
    ["S1.EQ.07", 1, 2, 0, "Factoriser un trinôme sous la forme a(x − x₁)(x − x₂)", 1],
    ["S1.EQ.08", 0, 2, 0, "Mettre un problème en équation du 2e degré, le résoudre et discuter le résultat", 1],
    ["S2.GE.01", 0, 3, 0, "Connaître les figures élémentaires du plan et leurs propriétés (angles, triangles, quadrilatères, cercle)", 1],
    ["S2.GE.02", 0, 3, 0, "Connaître les définitions et propriétés de la médiane, de la bissectrice et de la médiatrice", 1],
    ["S2.GE.03", 0, 3, 0, "Connaître le vocabulaire du cercle (corde, sécante, tangente, arc, secteur)", 1],
    ["S2.GE.04", 0, 3, 0, "Utiliser le théorème de Pythagore", 1],
    ["S2.GE.05", 0, 3, 0, "Utiliser la réciproque et la contraposée du théorème de Pythagore", 1],
    ["S2.GE.06", 0, 3, 0, "Utiliser le théorème de Thalès dans des triangles semblables", 1],
    ["S2.GE.07", 0, 3, 0, "Utiliser les théorèmes d'Euclide et de la hauteur", 1],
    ["S2.GE.08", 0, 3, 0, "Utiliser le théorème de l'angle au centre et ses corollaires", 1],
    ["S2.GE.09", 0, 3, 0, "Calculer des longueurs et des aires, aussi en valeurs exactes", 1],
    ["S2.TR.01", 0, 4, 0, "Connaître les définitions de sinus, cosinus et tangente dans un triangle rectangle", 1],
    ["S2.TR.02", 0, 4, 0, "Calculer un côté d'un triangle rectangle avec un rapport trigonométrique", 1],
    ["S2.TR.03", 0, 4, 0, "Calculer un angle avec les fonctions inverses de la calculatrice", 1],
    ["S2.TR.04", 0, 4, 0, "Résoudre un triangle rectangle", 1],
    ["S2.TR.05", 0, 4, 0, "Résoudre un problème de trigonométrie (hauteur, pente, angle d'élévation)", 1],
    ["S2.SY.01", 0, 5, 0, "Résoudre un système de 2 équations par addition", 1],
    ["S2.SY.02", 0, 5, 0, "Résoudre un système de 2 équations par substitution", 1],
    ["S2.SY.03", 0, 5, 0, "Résoudre un système de 3 équations à 3 inconnues", 1],
    ["S2.SY.04", 0, 5, 0, "Illustrer graphiquement un système 2 × 2 (solution unique, aucune, infinité)", 1],
    ["S2.SY.05", 0, 5, 0, "Mettre un problème en système, le résoudre et discuter le résultat", 1],
    ["S2.FO.01", 0, 6, 0, "Connaître la définition d'une fonction et ses représentations (expression, tableau, graphe)", 1],
    ["S2.FO.02", 0, 6, 0, "Déterminer l'ensemble de définition d'une fonction", 1],
    ["S2.FO.03", 0, 6, 0, "Calculer une image et une pré-image", 1],
    ["S2.FO.04", 0, 6, 0, "Déterminer les zéros et l'ordonnée à l'origine", 1],
    ["S2.FO.05", 0, 6, 0, "Lire ces éléments sur un graphique", 1],
    ["S2.FO.06", 0, 6, 0, "Déterminer l'intersection de deux fonctions graphiquement et par calcul", 1],
    ["S3.FA.01", 0, 7, 0, "Connaître la définition d'une fonction affine (pente, ordonnée à l'origine) et l'interpréter graphiquement", 2],
    ["S3.FA.02", 0, 7, 0, "Tracer une droite à partir de son équation", 2],
    ["S3.FA.03", 0, 7, 0, "Trouver l'équation d'une droite passant par deux points ou par un point de pente donnée", 2],
    ["S3.FA.04", 0, 7, 0, "Connaître les droites horizontales et verticales et la condition de perpendicularité", 2],
    ["S3.FA.05", 0, 7, 0, "Résoudre un problème modélisé par une fonction affine", 2],
    ["S3.FA.06", 1, 7, 0, "Calculer la réciproque d'une fonction affine (algébriquement et graphiquement)", 2],
    ["S3.FQ.01", 0, 8, 0, "Connaître les formes générale, canonique et factorisée d'une fonction quadratique", 2],
    ["S3.FQ.02", 0, 8, 0, "Passer d'une forme à l'autre", 2],
    ["S3.FQ.03", 0, 8, 0, "Déterminer zéros, sommet, ordonnée à l'origine et convexité quelle que soit la forme", 2],
    ["S3.FQ.04", 0, 8, 0, "Tracer une parabole", 2],
    ["S3.FQ.05", 0, 8, 0, "Trouver l'équation d'une parabole à partir de points ou de son graphe", 2],
    ["S3.FQ.06", 0, 8, 0, "Déterminer l'intersection d'une parabole et d'une droite", 2],
    ["S3.FQ.07", 0, 8, 0, "Résoudre un problème d'optimisation", 2],
    ["S3.FQ.08", 0, 8, 0, "Résoudre un problème d'application (trajectoire, aire, recette…)", 2],
    ["S4.TG.01", 0, 9, 0, "Connaître le radian et savoir convertir degrés et radians", 2],
    ["S4.TG.02", 0, 9, 0, "Connaître le cercle trigonométrique et y lire sinus, cosinus et tangente", 2],
    ["S4.TG.03", 0, 9, 0, "Connaître les valeurs remarquables et les relations élémentaires (sin² + cos² = 1, symétries)", 2],
    ["S4.TG.04", 0, 9, 0, "Utiliser le théorème du sinus", 2],
    ["S4.TG.05", 0, 9, 0, "Utiliser le théorème du cosinus", 2],
    ["S4.TG.06", 0, 9, 0, "Résoudre un triangle quelconque", 2],
    ["S4.TG.07", 0, 9, 0, "Utiliser les opérations inverses et trouver toutes les solutions dans un intervalle", 2],
    ["S4.TG.08", 0, 9, 0, "Résoudre une équation trigonométrique élémentaire", 2],
    ["S4.AD.01", 0, 10, 0, "Connaître le vocabulaire statistique (population, échantillon, individu, variable, modalités, effectifs, fréquences)", 2],
    ["S4.AD.02", 0, 10, 0, "Reconnaître une variable qualitative, quantitative discrète ou continue", 2],
    ["S4.AD.03", 0, 10, 0, "Organiser des données dans un tableau (effectifs, fréquences, cumulées, classes)", 2],
    ["S4.AD.04", 0, 10, 0, "Représenter des données (bâtons, diagramme circulaire, histogramme)", 2],
    ["S4.AD.05", 0, 10, 0, "Calculer le mode, la médiane et la moyenne", 2],
    ["S4.AD.06", 0, 10, 0, "Déterminer les quartiles, l'étendue et l'intervalle interquartile", 2],
    ["S4.AD.07", 0, 10, 0, "Calculer un écart-type", 2],
    ["S4.AD.08", 0, 10, 0, "Construire et interpréter une boîte à moustaches", 2],
    ["S5.EA.01", 0, 11, 0, "Résoudre une équation élémentaire avec valeur absolue", 3],
    ["S5.EA.02", 0, 11, 0, "Résoudre une équation du 2e degré (révision)", 3],
    ["S5.EA.03", 0, 11, 0, "Résoudre une équation bicarrée ou par changement simple de variable", 3],
    ["S5.EA.04", 2, 11, 0, "Résoudre une équation paramétrique de degré 1 ou 2 (avancé, facultatif)", 3],
    ["S5.EA.05", 0, 11, 0, "Résoudre une équation irrationnelle (avec vérification des solutions)", 3],
    ["S5.EA.06", 0, 11, 0, "Résoudre une équation rationnelle en déterminant l'ensemble de définition", 3],
    ["S5.EA.07", 0, 11, 0, "Mettre un problème en équation, le résoudre et discuter le résultat", 3],
    ["S5.PL.01", 0, 12, 0, "Utiliser les propriétés des puissances (rappels)", 3],
    ["S5.PL.02", 0, 12, 0, "Passer d'une racine à une puissance d'exposant rationnel et inversement", 3],
    ["S5.PL.03", 0, 12, 0, "Calculer avec des puissances d'exposant rationnel", 3],
    ["S5.PL.04", 0, 12, 0, "Connaître la définition du logarithme (aˣ = b ⇔ logₐ b = x)", 3],
    ["S5.PL.05", 0, 12, 0, "Calculer un logarithme simple sans calculatrice", 3],
    ["S5.PL.06", 0, 12, 0, "Utiliser les propriétés des logarithmes et le changement de base", 3],
    ["S6.EL.01", 0, 13, 0, "Résoudre une équation exponentielle (même base ou à l'aide du logarithme)", 3],
    ["S6.EL.02", 0, 13, 0, "Résoudre une équation logarithmique (en vérifiant le domaine)", 3],
    ["S6.EL.03", 0, 13, 0, "Mettre en équation un problème de croissance ou de décroissance exponentielle et le résoudre", 3],
    ["S6.VS.01", 0, 14, 0, "Calculer le volume d'un prisme, d'un cylindre, d'une pyramide, d'un cône et d'une sphère", 3],
    ["S6.VS.02", 0, 14, 0, "Calculer le volume d'un solide composé ou d'une partie de solide", 3],
    ["S6.VS.03", 0, 14, 0, "Isoler une dimension dans une formule de volume", 3],
    ["S6.VS.04", 0, 14, 0, "Reconnaître des figures ou des solides semblables et déterminer le rapport de similitude", 3],
    ["S6.VS.05", 0, 14, 0, "Utiliser le rapport des aires (k²)", 3],
    ["S6.VS.06", 0, 14, 0, "Utiliser le rapport des volumes (k³)", 3],
    ["S7.CO.01", 0, 15, 0, "Calculer la distance entre deux points et le milieu d'un segment dans le plan", 4],
    ["S7.CO.02", 0, 15, 0, "Passer des coordonnées cartésiennes aux coordonnées polaires et inversement", 4],
    ["S7.CO.03", 0, 15, 0, "Calculer la distance entre deux points et le milieu d'un segment dans l'espace", 4],
    ["S7.VE.01", 0, 16, 0, "Connaître la définition d'un vecteur (direction, sens, norme)", 4],
    ["S7.VE.02", 0, 16, 0, "Additionner et soustraire des vecteurs graphiquement (vecteur opposé)", 4],
    ["S7.VE.03", 0, 16, 0, "Multiplier un vecteur par un scalaire", 4],
    ["S7.VE.04", 0, 16, 0, "Calculer avec les composantes cartésiennes en dimension 2 et 3", 4],
    ["S7.VE.05", 0, 16, 0, "Calculer la norme d'un vecteur et un vecteur unitaire", 4],
    ["S7.VE.06", 0, 16, 0, "Reconnaître des vecteurs colinéaires", 4],
    ["S7.VE.07", 0, 16, 0, "Calculer un produit scalaire (composantes, angle, projection orthogonale)", 4],
    ["S7.VE.08", 0, 16, 0, "Reconnaître des vecteurs orthogonaux", 4],
    ["S7.VE.09", 0, 16, 0, "Calculer le travail d'une force", 4],
    ["S7.VE.10", 2, 16, 0, "Calculer un produit vectoriel et un produit mixte (facultatif)", 4],
    ["S7.DP.01", 0, 17, 0, "Écrire les équations paramétriques d'une droite", 4],
    ["S7.DP.02", 0, 17, 0, "Vérifier si un point appartient à une droite", 4],
    ["S7.DP.03", 0, 17, 0, "Déterminer la position relative de deux droites", 4],
    ["S7.DP.04", 2, 17, 0, "Déterminer la position d'une droite par rapport aux plans de coordonnées (facultatif)", 4],
    ["S7.DP.05", 0, 17, 0, "Résoudre un problème de longueur, d'angle ou de distance", 4],
    ["S8.IN.01", 0, 18, 0, "Résoudre une inéquation linéaire et écrire l'ensemble des solutions en intervalle", 4],
    ["S8.IN.02", 0, 18, 0, "Dresser un tableau des signes", 4],
    ["S8.IN.03", 0, 18, 0, "Résoudre une inéquation non linéaire à l'aide d'un tableau des signes", 4],
    ["S8.FP.01", 0, 19, 0, "Retrouver les caractéristiques d'une fonction (rappels : domaine, zéros, images)", 4],
    ["S8.FP.02", 0, 19, 0, "Visualiser et résoudre équations et inéquations à l'aide de graphiques de fonctions", 4],
    ["S8.FP.03", 1, 19, 0, "Déterminer si une fonction est bijective et trouver sa réciproque", 4],
    ["S8.FP.04", 2, 19, 0, "Étudier la parité d'une fonction (facultatif)", 4],
    ["S8.FP.05", 0, 19, 0, "Tracer une fonction transformée (translation, étirement, compression)", 4],
    ["S8.FP.06", 2, 19, 0, "Effectuer des opérations sur les fonctions et la composition (facultatif)", 4],
    ["S8.FP.07", 0, 19, 0, "Factoriser un polynôme, trouver ses zéros et dresser son tableau des signes", 4],
    ["S8.FP.08", 0, 19, 0, "Effectuer une division polynomiale", 4],
    ["S8.FP.09", 0, 19, 0, "Trouver l'équation d'une fonction polynomiale à partir de son graphe", 4],
    ["S8.FS.01", 0, 20, 0, "Connaître la forme générale d'une fonction sinusoïdale (amplitude, période, déphasage, axe)", 4],
    ["S8.FS.02", 0, 20, 0, "Tracer une fonction sinusoïdale et retrouver son expression à partir du graphe", 4],
    ["S8.FS.03", 0, 20, 0, "Étudier et tracer une fonction exponentielle", 4],
    ["S8.FS.04", 0, 20, 0, "Étudier et tracer une fonction logarithme", 4],
    ["S8.FS.05", 0, 20, 0, "Résoudre un problème modélisé par une fonction exponentielle ou sinusoïdale", 4],
    ["S8.FS.06", 2, 20, 0, "Étudier une fonction rationnelle simple (facultatif)", 4]
  ],
  // objectif → notions de l'app (« id » : tous les niveaux de question ; « id@13 » : niveaux 1 et 3)
  q: {"S1.CN.01":["ensembles"],"S1.CN.02":["vabs"],"S1.CN.03":["ensembles"],"S1.CN.04":["fracconv","sci"],"S1.CN.05":["prio"],"S1.CN.06":["prio","rel","fracops@3"],"S1.CN.07":["arith","divcrit","premiers@1"],"S1.CN.08":["arith","premiers"],"S1.CN.09":["arith"],"S1.CN.10":["fracadd@1","fracsimp"],"S1.CN.11":["fracadd","fracmul","fracops@12"],"S1.CN.12":["puiss"],"S1.CN.13":["puiss"],"S1.CN.14":["rac"],"S1.CN.15":["rac","ratden"],"S1.CA.01":["reduire"],"S1.CA.02":["reduire"],"S1.CA.03":["reduire"],"S1.CA.04":["distrib","polyop","parenth"],"S1.CA.05":["idrem","polyop"],"S1.CA.06":["factor","factor2"],"S1.CA.07":["factor","factor2"],"S1.CA.08":["factor","factor2"],"S1.CA.09":["factor2"],"S1.CA.10":["fracrat","valint"],"S1.CA.11":["fracrat"],"S1.CA.12":["fracrat"],"S1.CA.13":["fracrat"],"S1.CA.14":["formule"],"S1.EQ.01":["eq1","eqfrac","eqspec"],"S1.EQ.02":["eq1","eqparam"],"S1.EQ.03":["probeq"],"S1.EQ.04":["eq2","eq2fact"],"S1.EQ.05":["eq2disc"],"S1.EQ.06":["eq2disc","eqparam"],"S1.EQ.07":["eq2disc","trinfact"],"S1.EQ.08":["probeq"],"S2.GE.02":["droitesrem"],"S2.GE.04":["pyth","pythfig"],"S2.GE.05":["pyth","pythrec"],"S2.GE.06":["thales"],"S2.GE.07":["euclide"],"S2.GE.08":["angles","cercthales"],"S2.GE.09":["exactes","geocomb"],"S2.TR.01":["trigo"],"S2.TR.02":["trigo"],"S2.TR.03":["trigo"],"S2.TR.04":["trigo"],"S2.TR.05":["trigo","trigexact"],"S2.SY.01":["sys2"],"S2.SY.02":["sys2"],"S2.SY.03":["sys3"],"S2.SY.04":["sys2","sysgraph"],"S2.SY.05":["sys2","sysprob"],"S2.FO.01":["fimg"],"S2.FO.02":["domaine"],"S2.FO.03":["fimg"],"S2.FO.04":["fimg"],"S2.FO.05":["fimg","lectgraph"],"S2.FO.06":["inter"],"S3.FA.01":["affine","affzero@12"],"S3.FA.03":["droites","droitesinter"],"S3.FA.04":["droites"],"S3.FA.05":["affine@13","modaff","affzero@13"],"S3.FA.06":["recipaff"],"S3.FQ.01":["f2","f2formes@1"],"S3.FQ.02":["f2","f2formes"],"S3.FQ.03":["f2"],"S3.FQ.05":["f2expr","f2trois"],"S3.FQ.06":["inter"],"S3.FQ.07":["optim"],"S3.FQ.08":["optim"],"S4.TG.01":["trigcercle"],"S4.TG.02":["trigcercle"],"S4.TG.03":["trigcercle","trigassoc"],"S4.TG.04":["sinlaw"],"S4.TG.05":["sinlaw"],"S4.TG.06":["sinlaw","triaire"],"S4.TG.07":["trigeq"],"S4.TG.08":["trigeq","trigeq2"],"S4.AD.01":["statfreq"],"S4.AD.02":["statfreq"],"S4.AD.03":["statfreq"],"S4.AD.05":["stats"],"S4.AD.06":["quartiles"],"S4.AD.07":["stats"],"S4.AD.08":["quartiles"],"S5.EA.01":["eqabs"],"S5.EA.02":["eq2disc"],"S5.EA.03":["eqbic"],"S5.EA.04":["eqparam@23"],"S5.EA.05":["eqirrmp"],"S5.EA.06":["eqratmp"],"S5.EA.07":["eqratmp@3"],"S5.PL.01":["puiss"],"S5.PL.02":["puisrat@1"],"S5.PL.03":["puisrat@23"],"S5.PL.04":["logdef@1"],"S5.PL.05":["logdef@12"],"S5.PL.06":["logprop"],"S6.EL.01":["eqexp"],"S6.EL.02":["eqlog"],"S6.EL.03":["croissexp"],"S6.VS.01":["volmp@1"],"S6.VS.02":["volmp@3"],"S6.VS.03":["volmp@2"],"S6.VS.04":["similmp@3"],"S6.VS.05":["similmp@12"],"S6.VS.06":["similmp@12"],"S7.CO.01":["coordmp@12"],"S7.CO.02":["coordmp@2"],"S7.CO.03":["coordmp@13"],"S7.VE.03":["vectmp@1"],"S7.VE.04":["vectmp"],"S7.VE.05":["vectmp@12"],"S7.VE.06":["vectmp@2"],"S7.VE.07":["scalmp","projmp@1"],"S7.VE.08":["scalmp@13"],"S7.VE.09":["scalmp@2"],"S7.VE.10":["pvectmp"],"S7.DP.01":["droiteparam@1"],"S7.DP.02":["droiteparam@1"],"S7.DP.03":["posdroites"],"S7.DP.04":["droiteparam@2"],"S7.DP.05":["droiteparam@3","projmp@2"],"S8.IN.01":["ineqmp@1"],"S8.IN.02":["ineqmp@23"],"S8.IN.03":["ineqmp@23"],"S8.FP.01":["fimg","domaine"],"S8.FP.02":["lectgraph"],"S8.FP.03":["fctmp@12"],"S8.FP.04":["fctmp@1"],"S8.FP.06":["fctmp@23"],"S8.FP.07":["polymp@13"],"S8.FP.08":["polymp@2"],"S8.FP.09":["polymp@3"],"S8.FS.01":["sinusmp@12"],"S8.FS.02":["sinusmp@3"],"S8.FS.03":["explogfn@12"],"S8.FS.04":["explogfn@13"],"S8.FS.05":["explogfn@23","sinusmp@3"],"S8.FS.06":["fratmp"]},
  // objectif → formes de question retenues pour une notion (ctx du générateur ; les autres formes servent d'autres objectifs)
  f: {"S3.FA.01":{"affine":["image-lue","pente","image","b-lu","expression","antecedent","expression-lue","graphe","pente-fraction","parallele","f-sup-g-droites","expression-fraction"],"affzero":["zero","zerofrac"]},"S3.FA.05":{"affine":["taxi","velo","temperature","forfaits"],"affzero":["bougie","reservoir","trottinette"]},"S7.CO.01":{"coordmp":["distance-plan","milieu-plan","symetrique"]},"S7.CO.02":{"coordmp":["polaire-vers-cart","cart-vers-polaire"]},"S7.CO.03":{"coordmp":["distance-espace","milieu-espace","diagonale"]}},
};

// MP 1re · Calcul numérique (23.11) : sujet de préparation riche, niveau des épreuves CFPT MP1 (Test S1.1, base
// Maurizio) : SANS calculatrice, nombres choisis pour se calculer à la main. Outils communs : RX (riche_mp2.js).
(function () {
  const { N, pk, g2, X, ul, who, tab, VF, par } = RX;
  const T = (v) => M(N(v));
  const Q0 = (v, s) => RX.Q(v, s || "CHF");
  const fem = (w) => ["Lina", "Inès", "Mia", "Elsa"].includes(w);
  const fr = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const sl = (n, d) => { const g = g2(n, d) || 1; return d / g === 1 ? String(n / g) : n / g + "/" + d / g; }; // forme tapée
  const fact = (n) => { const f = {}; let k = 2; while (n > 1) { while (n % k === 0) { f[k] = (f[k] || 0) + 1; n /= k; } k++; } return f; };
  const factX = (n) => Object.entries(fact(n)).map(([p, e]) => p + (e > 1 ? "^{" + e + "}" : "")).join(" \\cdot ");
  const lcm = (a, b) => (a * b) / g2(a, b);
  const hh = (x) => Math.floor(x / 60) + " h " + String(x % 60).padStart(2, "0");

  const EX = [
    // L'argent de poche (fractions d'un reste)
    () => { let a, f, S; do { a = pk([3, 4, 5]); f = pk([[1, 2], [2, 3], [1, 3], [3, 5], [3, 4]]); S = pk([60, 80, 90, 120, 150, 180, 240]); } while ((S * (a - 1)) % a || ((S * (a - 1)) / a) % f[1]);
      const r1 = [a - 1, a], c = [f[0] * (a - 1), f[1] * a], rest = [(f[1] - f[0]) * (a - 1), f[1] * a], Rv = (S * rest[0]) / rest[1], w = who(), K = pk([["un livre", "une place de concert"], ["un jeu vidéo", "un abonnement de bus"], ["un pull", "une sortie au cinéma"]]);
      return X({ id: "fracmul", lv: 1, titre: "L'argent de poche",
        q: w + " dépense " + M(fr(1, a)) + " de son argent de poche pour " + K[0] + ". " + (fem(w) ? "Elle" : "Il") + " utilise ensuite " + M(fr(f[0], f[1])) + " de ce qui reste pour " + K[1] + ". Il lui reste alors " + Q0(Rv) + ".",
        parts: [{ label: "Quelle fraction de l'argent de poche reste-t-il après le premier achat ?", pts: 1 }, { label: "Quelle fraction de l'argent de poche total coûte le second achat ?", pts: 1 }, { label: "Quelle fraction du total reste-t-il à la fin ?", pts: 1 }, { label: "Combien d'argent de poche " + w + " avait-" + (fem(w) ? "elle" : "il") + " au départ ? Réponds par une phrase.", pts: 1 }],
        sol: ul([M("1 - " + fr(1, a) + " = " + fr(r1[0], r1[1])) + ".", M(fr(f[0], f[1]) + " \\cdot " + fr(r1[0], r1[1]) + " = " + fr(c[0], c[1])) + " du total.", M(fr(r1[0], r1[1]) + " - " + fr(c[0], c[1]) + " = " + fr(rest[0], rest[1])) + ".", M(fr(rest[0], rest[1])) + " du total valent " + Rv + " CHF, donc le total vaut " + M(Rv + " : " + fr(rest[0], rest[1]) + " = " + S) + ". « " + w + " avait " + S + " CHF au départ. »"]),
        chk: [[c[0] / c[1], sl(c[0], c[1])], [rest[0] / rest[1], sl(rest[0], rest[1])], [(Rv * rest[1]) / rest[0], String(S)]] }); },
    // Le carrelage (décomposition, PGDC)
    () => { let L, l, s; do { s = pk([12, 15, 18, 20, 24, 25, 30]); L = s * pk([7, 8, 9, 11, 13]); l = s * pk([4, 5, 6]); } while (g2(L, l) !== s);
      const n = (L / s) * (l / s), prix = pk([4, 5, 6]);
      return X({ id: "arith", lv: 2, titre: "Le carrelage",
        q: "Une salle de bain rectangulaire mesure " + Q0(L, "cm") + " sur " + Q0(l, "cm") + ". On veut la couvrir de carreaux carrés identiques, sans découpe, les plus grands possible. Un carreau coûte " + Q0(prix) + ".",
        parts: [{ label: "Décompose " + L + " et " + l + " en produit de facteurs premiers (notation avec puissances).", pts: 2 }, { label: "Quel est le côté des carreaux ? Justifie.", pts: 1 }, { label: "Combien de carreaux faut-il ? Combien coûtent-ils ?", pts: 2 }],
        sol: ul([M(L + " = " + factX(L)) + " ; " + M(l + " = " + factX(l)) + ".", "Le côté doit diviser " + L + " et " + l + " : c'est le PGDC, produit des facteurs communs avec le plus petit exposant, " + M("\\text{PGDC} = " + factX(s) + " = " + s) + " cm.", M((L / s) + " \\cdot " + (l / s) + " = " + n) + " carreaux ; " + M(n + " \\cdot " + prix + " = " + n * prix) + " CHF."]),
        chk: [[g2(L, l), String(s)], [(L * l) / (s * s), String(n)]] }); },
    // Les deux lignes de bus (PPMC)
    () => { let a, b; do { a = pk([6, 8, 9, 10, 12, 15]); b = pk([8, 10, 12, 14, 15, 18, 20]); } while (a === b || lcm(a, b) === a * b || lcm(a, b) === Math.max(a, b) || lcm(a, b) > 90);
      const p = lcm(a, b), h0 = pk([6, 7]), m0 = pk([0, 15, 30]), t = h0 * 60 + m0 + p;
      return X({ id: "premiers", lv: 1, titre: "Les deux lignes de bus",
        q: "Au terminus, un bus de la ligne 12 part toutes les " + a + " minutes et un bus de la ligne 15 toutes les " + b + " minutes. À " + hh(h0 * 60 + m0) + ", deux bus partent en même temps. Le trajet de la ligne 12 dure 35 minutes.",
        parts: [{ label: "Décompose " + a + " et " + b + " en facteurs premiers.", pts: 1 }, { label: "Après combien de minutes les deux bus repartiront-ils ensemble ? Justifie.", pts: 2 }, { label: "À quelle heure ? Combien de bus de chaque ligne seront partis entre-temps (en comptant le départ de " + hh(h0 * 60 + m0) + ") ?", pts: 2 }],
        sol: ul([M(a + " = " + factX(a)) + " ; " + M(b + " = " + factX(b)) + ".", "C'est le PPMC : tous les facteurs, avec le plus grand exposant, " + M("\\text{PPMC} = " + factX(p) + " = " + p) + " minutes.", "À " + hh(t) + ". Ligne 12 : " + M(p + " : " + a + " = " + p / a) + " bus ; ligne 15 : " + M(p + " : " + b + " = " + p / b) + " bus. La durée du trajet ne sert à rien."]),
        chk: [[lcm(a, b), String(p)], [p / a, String(p / a)]] }); },
    // La lumière, le disque dur, le sang (notation scientifique sans calculatrice) + règles des puissances
    () => { const K = pk([
        { t: "La lumière du Soleil", q: "La distance Terre–Soleil vaut environ " + M("1{,}5 \\cdot 10^{8}") + " km et la lumière parcourt " + M("3 \\cdot 10^{5}") + " km par seconde.", ask: "Combien de secondes la lumière met-elle pour aller du Soleil à la Terre ? Donne le résultat en notation scientifique, puis en notation décimale.", d: [1.5, 8], v: [3, 5] },
        { t: "Le disque dur", q: null, ask: "Combien de photos peut-on stocker ? Donne le résultat en notation scientifique, puis en notation décimale.", d: [pk([2, 4, 6, 8]), 12], v: [pk([2, 4]), 6] },
        { t: "Les globules rouges", q: "Un litre de sang contient environ " + M("5 \\cdot 10^{12}") + " globules rouges. Un adulte a environ 5 litres de sang.", ask: "Combien de globules rouges a-t-il ? Donne le résultat en notation scientifique.", d: [5, 12], v: [5, 0], mul: true }]);
      const d = K.d, v = K.v, q = K.q || "Un disque dur contient " + M(d[0] + " \\cdot 10^{" + d[1] + "}") + " octets. Une photo occupe " + M(v[0] + " \\cdot 10^{" + v[1] + "}") + " octets.";
      const mant = K.mul ? d[0] * v[0] : d[0] / v[0], ex = K.mul ? d[1] + v[1] : d[1] - v[1], sh = mant >= 10 ? 1 : mant < 1 ? -1 : 0, m2 = mant / 10 ** sh, e2 = ex + sh, val = m2 * 10 ** e2;
      let a, p1, p2, p3, p4, res; do { a = pk([2, 3, 5]); p1 = pk([4, 6]); p2 = pk([-2, 5]); p3 = pk([2, 3]); p4 = pk([3, 5, 7]); res = (p1 + p2) * p3 - p4; } while (res === 0 || res === 1);
      return X({ id: "puiss", lv: 2, titre: K.t,
        q: q + " Calculatrice non autorisée.",
        parts: [{ label: K.ask, pts: 2 }, { label: "Écris " + M("\\frac{(" + a + "^{" + p1 + "} \\cdot " + a + "^{" + p2 + "})^{" + p3 + "}}{" + a + "^{" + p4 + "}}") + " sous la forme d'une seule puissance de " + a + ".", pts: 2 }],
        sol: ul([M(K.mul ? N(d[0]) + " \\cdot " + N(v[0]) + " \\cdot 10^{" + d[1] + "}" : "\\frac{" + N(d[0]) + "}{" + N(v[0]) + "} \\cdot 10^{" + d[1] + " - " + v[1] + "}") + " = " + M(N(mant) + " \\cdot 10^{" + ex + "}") + (sh ? " = " + M(N(m2) + " \\cdot 10^{" + e2 + "}") : "") + (e2 <= 7 ? " = " + T(val) : "") + ".", "On additionne les exposants dans le produit, on les multiplie pour la puissance d'une puissance, on les soustrait dans le quotient : " + M(a + "^{(" + p1 + " + " + par(p2) + ") \\cdot " + p3 + " - " + p4 + "} = " + a + "^{" + res + "}") + "."]),
        chk: [[K.mul ? d[0] * v[0] * 10 ** (d[1] + v[1]) : (d[0] * 10 ** d[1]) / (v[0] * 10 ** v[1]), N(m2) + "*10^(" + e2 + ")"], [(p1 + p2) * p3 - p4, String(res)]] }); },
    // Le jardin carré (racines, dénominateur rationnel)
    () => { const k = pk([3, 4, 5, 6, 7]), A = 2 * k * k, m = pk([2, 3, 5]); let q, co, tot;
      do { q = [pk([2, 3]), pk([4, 5]), pk([3, 6])]; co = [1, pk([2, 3]), pk([2, 4])]; tot = q[0] - co[1] * q[1] + co[2] * q[2]; } while (Math.abs(tot) <= 1);
      const num = m * 6;
      return X({ id: "rac", lv: 2, titre: "Le jardin carré",
        q: "Un jardin carré a une aire de " + Q0(A, "m^2") + ". On le borde d'une haie et on trace une allée en diagonale. Calculatrice non autorisée.",
        parts: [{ label: "Calcule la valeur exacte du côté, sous la forme " + M("a\\sqrt{b}") + " la plus simple.", pts: 1 }, { label: "Calcule la longueur de la diagonale (valeur exacte) et la longueur de la haie.", pts: 2 }, { label: "Regroupe et réduis : " + M("\\sqrt{" + 2 * q[0] ** 2 + "} - " + co[1] + "\\sqrt{" + 2 * q[1] ** 2 + "} + " + co[2] + "\\sqrt{" + 2 * q[2] ** 2 + "}") + ".", pts: 2 }, { label: "Rends rationnel le dénominateur et simplifie : " + M("\\frac{" + num + "}{2\\sqrt{3}}") + ".", pts: 1 }],
        sol: ul([M("\\sqrt{" + A + "} = \\sqrt{" + k * k + " \\cdot 2} = " + k + "\\sqrt{2}") + " m.", "Diagonale " + M(k + "\\sqrt{2} \\cdot \\sqrt{2} = " + 2 * k) + " m ; haie " + M("4 \\cdot " + k + "\\sqrt{2} = " + 4 * k + "\\sqrt{2}") + " m.", M(q[0] + "\\sqrt{2} - " + co[1] * q[1] + "\\sqrt{2} + " + co[2] * q[2] + "\\sqrt{2} = " + tot + "\\sqrt{2}") + ".", M("\\frac{" + num + " \\cdot \\sqrt{3}}{2\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{" + num + "\\sqrt{3}}{6} = " + m + "\\sqrt{3}") + "."]),
        chk: [[Math.sqrt(A), k + "√2"], [2 * k, String(2 * k)], [tot * Math.SQRT2, tot + "√2"], [num / (2 * Math.sqrt(3)), m + "√3"]] }); },
    // Les soldes (pourcentages successifs, question inverse)
    () => { let P, h, r; do { P = pk([80, 120, 200, 250]); h = pk([10, 20, 25]); r = pk([20, 25, 40, 50]); } while (Math.abs((1 + h / 100) * (1 - r / 100) - 1) < 1e-9);
      const P1 = P * (1 + h / 100), P2 = P1 * (1 - r / 100), g = ((P2 - P) / P) * 100, F = pk([36, 48, 60, 72]), rr = pk([20, 25, 40]), F0 = F / (1 - rr / 100);
      return X({ id: "pctvar", lv: 2, titre: "Avant et pendant les soldes",
        q: "Un magasin de sport augmente de " + h + " % le prix d'une veste à " + Q0(P) + " en octobre, puis le baisse de " + r + " % pendant les soldes de janvier. Le magasin est ouvert le dimanche.",
        parts: [{ label: "Calcule le prix en octobre, puis pendant les soldes.", pts: 2 }, { label: "Calcule la variation totale en pourcentage. Est-ce " + (r > h ? "une baisse de " + (r - h) : "une hausse de " + (h - r)) + " % ? Explique.", pts: 1 }, { label: "Pendant les soldes, une paire de chaussures soldée à −" + rr + " % coûte " + Q0(F) + ". Quel était son prix avant les soldes ?", pts: 2 }],
        sol: ul([M(P + " \\cdot " + N(1 + h / 100) + " = " + N(P1)) + " CHF ; " + M(N(P1) + " \\cdot " + N(1 - r / 100) + " = " + N(P2)) + " CHF.", "Coefficient global " + M(N(1 + h / 100) + " \\cdot " + N(1 - r / 100) + " = " + N((1 + h / 100) * (1 - r / 100))) + " : " + (g < 0 ? "baisse" : "hausse") + " de " + M(N(Math.abs(g)) + "\\,\\%") + ". Les pourcentages ne s'additionnent pas : le second s'applique à un prix déjà augmenté.", "Le prix soldé vaut " + M(N(1 - rr / 100)) + " fois l'ancien : " + M(F + " : " + N(1 - rr / 100) + " = " + N(F0)) + " CHF. Le dimanche ne sert à rien."]),
        chk: [[P * (1 + h / 100), N(P1)], [P1 * (1 - r / 100), N(P2)], [Math.abs(g), N(Math.abs(g))], [F / (1 - rr / 100), N(F0)]] }); },
    // La station météo (relatifs, valeur absolue, ensembles, intervalles)
    () => { let t; do { t = Array.from({ length: 5 }, () => R.int(-9, 8)); } while (Math.min(...t) >= 0 || Math.max(...t) <= 0 || new Set(t).size < 5 || t.includes(0) || t.reduce((s, x) => s + x, 0) % 5 !== 0 || t.reduce((s, x) => s + x, 0) === 0);
      const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"], mx = Math.max(...t), mn = Math.min(...t), sum = t.reduce((s, x) => s + x, 0), moy = sum / 5, lo = pk([-6, -5, -4]), hi = pk([2, 3]), rr = pk([2, 3, 5]);
      const inI = t.map((x, i) => [days[i], x]).filter(([, x]) => x >= lo && x < hi).map(([d]) => d);
      return X({ id: "rel", lv: 1, titre: "La station météo",
        q: "Températures relevées à 7 h au col des Mosses (en °C) :" + tab(days, [t.map((x) => T(x))]),
        parts: [{ label: "Quel est l'écart entre la température la plus haute et la plus basse ? Écris le calcul avec une valeur absolue.", pts: 1 }, { label: "Calcule la température moyenne de la semaine.", pts: 1 }, { label: "Le sel de déneigement agit quand la température est dans l'intervalle " + M("[" + lo + " \\,;\\, " + hi + "[") + ". Quels jours sont dans cet intervalle ? La valeur " + T(hi) + " en fait-elle partie ?", pts: 2 }, { label: "À quel plus petit ensemble (" + M("\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}") + " ou " + M("\\mathbb{R}") + ") appartient la moyenne ? Et " + M("\\sqrt{" + rr + "}") + " ?", pts: 1 }],
        sol: ul([M("|" + mx + " - " + par(mn) + "| = " + (mx - mn)) + " °C.", M("\\frac{" + t.map(par).join(" + ") + "}{5} = \\frac{" + sum + "}{5} = " + moy) + " °C.", (inI.length ? inI.join(", ") : "Aucun jour") + ". Non : le crochet est ouvert du côté de " + hi + ", qui est exclu.", M(moy) + " " + (moy < 0 ? "est un entier négatif : " + M("\\mathbb{Z}") : "est un entier naturel : " + M("\\mathbb{N}")) + " ; " + M("\\sqrt{" + rr + "}") + " n'est pas un quotient d'entiers (" + rr + " n'est pas un carré) : " + M("\\mathbb{R}") + "."]),
        chk: [[Math.abs(mx - mn), String(mx - mn)], [moy, String(moy)]] }); },
    // Les sachets de bonbons (critères de divisibilité, simplifier une fraction)
    () => { let n, m; do { n = pk([2, 3, 4, 5, 6, 9]) * R.int(40, 160); m = R.int(2, 9) * 30; } while (n < 300 || n > 999 || g2(n, m) < 6 || n % 10 === 0 || n % m === 0);
      const divs = [2, 3, 4, 5, 9].filter((d) => n % d === 0), no = [2, 3, 4, 5, 9].filter((d) => n % d !== 0), sum = String(n).split("").reduce((s, c) => s + +c, 0), g = g2(n, m);
      return X({ id: "divcrit", lv: 1, titre: "Les sachets de bonbons",
        q: "Une confiserie a fabriqué " + T(n) + " bonbons à la fraise et " + T(m) + " bonbons à la menthe.",
        parts: [{ label: "Sans poser de division, dis si on peut répartir les bonbons à la fraise en sachets de 2, de 3, de 4, de 5 ou de 9, sans reste. Justifie avec les critères.", pts: 2 }, { label: "Simplifie la fraction " + M("\\frac{" + n + "}{" + m + "}") + " jusqu'à obtenir une fraction irréductible.", pts: 2 }],
        sol: ul([(divs.length ? "Oui pour " + divs.join(", ") : "Aucun") + (no.length ? " ; non pour " + no.join(", ") : "") + ". Somme des chiffres : " + sum + (n % 3 ? " (pas multiple de 3)" : n % 9 ? " (multiple de 3, pas de 9)" : " (multiple de 9)") + " ; nombre formé par les deux derniers chiffres : " + String(n).slice(-2) + (n % 4 ? " (pas multiple de 4)" : " (multiple de 4)") + " ; dernier chiffre " + (n % 10) + ".", M("\\frac{" + n + "}{" + m + "} = " + fr(n, m)) + " (on divise par le PGDC " + g + ", par exemple par étapes)."]),
        chk: [[n / m, sl(n, m)], [sum, String(sum)]] }); },
  ];
  const RAISON = [
    () => { let a, b, c, d; do { a = R.int(1, 5); b = R.int(2, 9); c = R.int(1, 5); d = R.int(2, 9); } while (b === d || a >= b || c >= d || g2(a, b) > 1 || g2(c, d) > 1); const w = who();
      return X({ id: "fracadd", lv: 1, titre: "Trouve l'erreur",
        q: w + " calcule : « " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + " ».",
        parts: [{ label: "Montre avec un exemple simple que cette méthode est fausse.", pts: 1 }, { label: "Calcule correctement (fraction irréductible).", pts: 1 }],
        sol: ul(["Avec cette méthode, " + M("\\frac{1}{2} + \\frac{1}{2} = \\frac{2}{4} = \\frac{1}{2}") + ", alors que deux moitiés font 1.", M("\\frac{" + a * d + "}{" + b * d + "} + \\frac{" + c * b + "}{" + b * d + "} = " + fr(a * d + c * b, b * d)) + " : il faut un dénominateur commun."]),
        chk: [[a / b + c / d, sl(a * d + c * b, b * d)]] }); },
    () => { const [p, q] = pk([[9, 16], [36, 64], [16, 9], [25, 144]]), w = who();
      return X({ id: "rac", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\sqrt{" + p + " + " + q + "} = \\sqrt{" + p + "} + \\sqrt{" + q + "} = " + (Math.sqrt(p) + Math.sqrt(q))) + " ».",
        parts: [{ label: "Calcule " + M("\\sqrt{" + p + " + " + q + "}") + " correctement.", pts: 1 }, { label: "Quelle règle " + w + " a-t-" + (fem(w) ? "elle" : "il") + " inventée ? Quelle est la règle juste ?", pts: 1 }],
        sol: ul([M("\\sqrt{" + (p + q) + "} = " + Math.sqrt(p + q)) + ", pas " + (Math.sqrt(p) + Math.sqrt(q)) + ".", M("\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}") + " ; la règle juste concerne le produit : " + M("\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}") + "."]),
        chk: [[Math.sqrt(p + q), String(Math.sqrt(p + q))]] }); },
    () => VF("puiss", 1, [["« " + M("-3^2 = 9") + ". »", false, "Le carré porte sur 3 seulement : " + M("-3^2 = -9") + " ; c'est " + M("(-3)^2") + " qui vaut 9."],
      ["« " + M("(-2)^5") + " est négatif. »", true, "Exposant impair : le signe moins reste, " + M("(-2)^5 = -32") + "."],
      ["« " + M("0{,}333\\ldots") + " est un nombre rationnel. »", true, "C'est " + M("\\frac{1}{3}") + " : développement périodique."],
      ["« " + M("\\sqrt{2}") + " appartient à " + M("\\mathbb{Q}") + ". »", false, "Ce n'est pas un quotient d'entiers : son développement est illimité non périodique."],
      ["« Augmenter de 10 % puis baisser de 10 % redonne le prix de départ. »", false, M("1{,}1 \\cdot 0{,}9 = 0{,}99") + " : on perd 1 %."],
      ["« Tous les nombres premiers sont impairs. »", false, "2 est premier et pair."],
      ["« " + M("2^3 \\cdot 2^4 = 2^{12}") + ". »", false, "On additionne les exposants : " + M("2^7") + "."],
      ["« " + M("|-7| = 7") + " et " + M("|3 - 10| = 7") + ". »", true, "La valeur absolue est la distance à 0 : " + M("|3 - 10| = |-7| = 7") + "."]]),
    () => { const a = pk([3, 5, 7]), m = pk([2, 4]), n = pk([2, 5]), w = who();
      return X({ id: "fracops", lv: 2, titre: "Trouve l'erreur",
        q: w + " calcule " + M("\\frac{2}{" + a + "} + \\frac{" + m + "}{" + a + "} \\cdot " + n) + " ainsi : « " + M("\\frac{2 + " + m + "}{" + a + "} \\cdot " + n + " = " + fr((2 + m) * n, a)) + " ».",
        parts: [{ label: "Quelle règle de priorité n'a pas été respectée ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
        sol: ul(["La multiplication passe avant l'addition : il faut d'abord calculer " + M("\\frac{" + m + "}{" + a + "} \\cdot " + n) + ".", M("\\frac{2}{" + a + "} + \\frac{" + m * n + "}{" + a + "} = " + fr(2 + m * n, a)) + "."]),
        chk: [[2 / a + (m / a) * n, sl(2 + m * n, a)]] }); },
  ];
  RICH.cnmp1 = { ids: ["ensembles", "vabs", "fracadd", "rel", "arith", "fracmul", "puiss", "rac", "ratden", "divcrit", "premiers", "fracsimp", "fracops", "pctvar"], track: "mp", label: "Calcul numérique (MP)", ex: EX, raison: RAISON, minutes: 45 };
})();

// MP 3e et MP 4e (24.11) : sujets de préparation riches des chapitres A à J (polycopiés CFPT MP3 et MP4).
// Exercices contextualisés en plusieurs étapes, modelés sur les problèmes des polycopiés (robinets, train, demi-vie,
// placements, silos, bouteilles semblables, drone, radar, grande roue, abonnements…) — jamais recopiés tels quels.
// Niveau MP : calculatrice autorisée, méthodes guidées, beaucoup plus simple que le Collège. Outils communs : RX
// (riche_mp2.js). Banques réservées à la MP (track: "mp").
// Exposants : « ^{\,1{,}5} » plutôt que « ^{1{,}5} » (le test des écritures triviales lit « ^{1 » comme un exposant 1).
(function () {
  if (typeof RX === "undefined" || typeof RICH === "undefined") return;
  const { r6, N, A, Q, pk, FR, sg, par, X, ul, VF, shuffle, D } = RX;
  const T = (v) => M(N(v));
  const tx = (v) => N(v).replace("{,}", ",").replace(/\\text\{'\}/g, "'");
  const FRp = (v) => FR(v).replace(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/, "$1$2/$3");
  const pt = (x, y, z) => "(" + FR(x) + " \\,;\\, " + FR(y) + (z === undefined ? "" : " \\,;\\, " + FR(z)) + ")";
  const vc = (x, y, z) => "\\begin{pmatrix} " + FR(x) + " \\\\ " + FR(y) + (z === undefined ? "" : " \\\\ " + FR(z)) + " \\end{pmatrix}";
  // Polynôme (coefficients du plus haut degré au terme constant) ; termes nuls omis.
  const poly = (c, x = "x") => { const n = c.length - 1; let s = ""; c.forEach((a, i) => { const e = n - i; if (Math.abs(a) < 1e-12) return; const mono = e === 0 ? N(Math.abs(a)) : (Math.abs(Math.abs(a) - 1) < 1e-12 ? "" : N(Math.abs(a))) + x + (e > 1 ? "^{" + e + "}" : ""); s += s ? (a < 0 ? " - " : " + ") + mono : (a < 0 ? "-" : "") + mono; }); return s || "0"; };
  const fac = (r, x = "x") => "(" + x + (r < 0 ? " + " + N(-r) : " - " + N(r)) + ")";
  // Notation scientifique m · 10^e : [mantisse arrondie, exposant].
  const sci = (v, k = 2) => { let e = Math.floor(Math.log10(v)), m = +(v / Math.pow(10, e)).toFixed(k); if (m >= 10) { m = +(m / 10).toFixed(k); e++; } return [m, e]; };
  const sciT = (v, k = 2) => { const [m, e] = sci(v, k); return N(m) + " \\cdot 10^{" + e + "}"; };
  const deg = (r) => (r * 180) / Math.PI;
  const de = (w) => (/^[aeéiouh]/.test(w) ? "d'" : "de ") + w; /* « d'heures », « de jours » */
  const tous = (w) => (/^(heures|minutes|semaines)/.test(w) ? "toutes les " : "tous les "); /* tous les 8 jours, toutes les 6 heures */
  const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
  const mo = (v) => M((Number.isInteger(r6(v)) ? N(v) : r6(v).toFixed(2).replace(".", "{,}")) + "\\ \\text{CHF}"); /* prix : 3,60 CHF */
  const eqA = (v) => (Number.isInteger(r6(v)) ? "= " + N(v) : "\\approx " + A(v, 2)); /* « = 10 » ou « ≈ 7,07 » (24.11) */
  const lin1 = (x0, a, p) => (x0 ? x0 + (a < 0 ? " - " : " + ") : a < 0 ? "-" : "") + (Math.abs(a) === 1 ? "" : Math.abs(a)) + p; /* x0 + a·p */

  // ===================== MP 3e · A. Équations avancées =====================
  const EXA = [
    // Travail en commun (équation rationnelle)
    () => { const [a, b] = pk([[6, 12], [3, 6], [4, 12], [10, 15], [12, 24], [20, 30], [6, 3]]), c = (a * b) / (a + b), K = pk([
        { t: "Deux robinets", A: "Le robinet A", Al: "le robinet A", B: "le robinet B", seul: "seul", job: "remplit le bassin", job2: "remplir les trois quarts du bassin", un: "h", unl: "heure", inut: "Le bassin contient 12 m³ d'eau quand il est plein." },
        { t: "Deux imprimantes", A: "L'imprimante A", Al: "l'imprimante A", B: "l'imprimante B", seul: "seule", job: "imprime toutes les copies d'un examen", job2: "imprimer les trois quarts des copies", un: "min", unl: "minute", inut: "Chaque copie compte 4 pages." },
        { t: "Deux peintres", A: "Le peintre A", Al: "le peintre A", B: "le peintre B", seul: "seul", job: "peint la façade", job2: "peindre les trois quarts de la façade", un: "h", unl: "heure", inut: "La façade mesure 9 m de haut." }]);
      return X({ id: "eqratmp", lv: 1, titre: K.t,
        q: K.A + " " + K.job + " en " + Q(a, K.un) + ". Quand " + K.Al + " et " + K.B + " travaillent ensemble, le travail est fait en " + Q(c, K.un) + ". " + K.inut + " On cherche la durée " + M("t") + " (en " + K.un + ") dont " + K.B + " a besoin " + K.seul + ".",
        parts: [{ label: "Quelle fraction du travail est faite en une " + K.unl + " par " + K.Al + " ? Par les deux ensemble ?", pts: 1 }, { label: "Écris une équation d'inconnue " + M("t") + " (avec sa valeur interdite) et résous-la.", pts: 2 }, { label: "Combien de temps faut-il aux deux ensemble pour " + K.job2 + " ?", pts: 1 }],
        sol: ul([M("\\frac{1}{" + a + "}") + " du travail ; ensemble " + M("\\frac{1}{" + N(c) + "}") + ".", M("\\frac{1}{" + a + "} + \\frac{1}{t} = \\frac{1}{" + N(c) + "}") + " avec " + M("t \\neq 0") + " ; " + M("\\frac{1}{t} = \\frac{1}{" + N(c) + "} - \\frac{1}{" + a + "} = \\frac{1}{" + b + "}") + ", donc " + M("t = " + b) + " " + K.un + ".", M("\\frac{3}{4} \\cdot " + N(c) + " = " + N(0.75 * c)) + " " + K.un + ". La phrase « " + K.inut.replace(/\.$/, "") + " » ne sert à rien."]),
        chk: [[(a * c) / (a - c), String(b)], [0.75 * c, N(0.75 * c)]] }); },
    // Le trajet plus rapide (équation rationnelle → 2e degré)
    () => { const K = pk([{ veh: "Un train", f: 0, D: 300, v: 50, dv: 10, dt: 1 }, { veh: "Un train régional", f: 0, D: 240, v: 60, dv: 20, dt: 1 }, { veh: "Un car", f: 0, D: 200, v: 80, dv: 20, dt: 0.5 }, { veh: "Une cycliste", f: 1, D: 60, v: 15, dv: 5, dt: 1 }, { veh: "Un bus", f: 0, D: 200, v: 40, dv: 10, dt: 1 }]);
      const { D: Dk, v, dv, dt } = K, Kc = v * (v + dv), du = Dk / v, dtT = dt === 1 ? "une heure" : "une demi-heure", il = K.f ? "elle" : "il";
      return X({ id: "eqratmp", lv: 2, titre: "Le trajet plus rapide",
        q: K.veh + " parcourt " + Q(Dk, "km") + " à vitesse constante. " + (K.f ? "Si elle" : "S'il") + " roulait " + Q(dv, "km/h") + " plus vite, " + il + " arriverait " + dtT + " plus tôt. On note " + M("v") + " sa vitesse habituelle (en km/h).",
        parts: [{ label: "Exprime la durée du trajet habituel et celle du trajet plus rapide en fonction de " + M("v") + ".", pts: 1 }, { label: "Écris l'équation qui traduit l'énoncé. Quelles sont les valeurs interdites ?", pts: 1 }, { label: "Montre qu'elle revient à " + M("v^2 + " + dv + "v - " + N(Kc) + " = 0") + ", puis résous-la.", pts: 2 }, { label: "Quelle solution garder ? Quelle est la durée du trajet habituel ?", pts: 1 }],
        sol: ul([M("\\frac{" + Dk + "}{v}") + " et " + M("\\frac{" + Dk + "}{v + " + dv + "}") + " (en heures).", M("\\frac{" + Dk + "}{v} - \\frac{" + Dk + "}{v + " + dv + "} = " + N(dt)) + " ; valeurs interdites " + M("0") + " et " + M("-" + dv) + ".", "On multiplie par " + M("v(v + " + dv + ")") + " : " + M(Dk + "(v + " + dv + ") - " + Dk + "v = " + (dt === 1 ? "" : N(dt) + " \\cdot ") + "v(v + " + dv + ")") + ", donc " + M(N(Dk * dv) + " = " + (dt === 1 ? "" : N(dt)) + "v^2 + " + N(dt * dv) + "v") + (dt === 1 ? "" : " ; on divise par " + M(N(dt))) + ". D'où " + M("v^2 + " + dv + "v - " + N(Kc) + " = 0") + ". " + M("\\Delta = " + dv * dv + " + 4 \\cdot " + N(Kc) + " = " + N(dv * dv + 4 * Kc)) + ", " + M("\\sqrt{\\Delta} = " + (2 * v + dv)) + " : " + M("v = " + v) + " ou " + M("v = -" + (v + dv)) + ".", "Une vitesse est positive : " + M("v = " + v) + " km/h. Durée " + M("\\frac{" + Dk + "}{" + v + "} = " + N(du)) + " h (vérification : " + M("\\frac{" + Dk + "}{" + (v + dv) + "} = " + N(Dk / (v + dv))) + " h, soit " + tx(dt) + " h de moins)."]),
        chk: [[v, String(v)], [-(v + dv), String(-(v + dv))], [du, N(du)], [Dk / v - Dk / (v + dv), N(dt)]] }); },
    // Le nombre mystère (équation irrationnelle, solution parasite)
    () => { let r, b, s, a; do { r = pk([3, 4, 5]); b = pk([2, 3, 5, 6]); s = b + r; a = r * r - s; } while (a < 2 || b + 1 === r); const s2 = b + 1 - r, c0 = b * b - a;
      return X({ id: "eqirrmp", lv: 2, titre: "Le nombre mystère",
        q: "La racine carrée d'un nombre augmenté de " + a + " est égale à ce nombre diminué de " + b + ". Quel est ce nombre ?",
        parts: [{ label: "Traduis l'énoncé par une équation d'inconnue " + M("x") + ".", pts: 1 }, { label: "Quelles conditions " + M("x") + " doit-il vérifier ?", pts: 1 }, { label: "Élève au carré et résous l'équation obtenue.", pts: 2 }, { label: "Vérifie chaque solution et conclus.", pts: 1 }],
        sol: ul([M("\\sqrt{x + " + a + "} = x - " + b), "Sous la racine : " + M("x \\geq -" + a) + " ; une racine n'est jamais négative : " + M("x - " + b + " \\geq 0") + ", donc " + M("x \\geq " + b) + ".", M("x + " + a + " = x^2 - " + 2 * b + "x + " + b * b) + " ⟺ " + M(poly([1, -(2 * b + 1), c0]) + " = 0") + " : " + M("x = " + s) + " ou " + M("x = " + s2) + ".", "Pour " + M("x = " + s) + ", " + M("\\sqrt{" + (s + a) + "} = " + r) + " et " + M(s + " - " + b + " = " + r) + " ✓. " + M("x = " + s2) + " ne vérifie pas " + M("x \\geq " + b) + " (" + M("\\sqrt{" + (s2 + a) + "} = " + (r - 1)) + " mais " + M(s2 + " - " + b + " = " + (s2 - b)) + ") : solution parasite. Le nombre est " + M(s) + "."]),
        chk: [[s, String(s)], [s2, String(s2)], [Math.sqrt(s + a), String(r)]] }); },
    // Le pendule (racine carrée dans une formule)
    () => { const g = 9.81, L1 = pk([0.25, 0.5, 0.8, 1.2]), T2 = pk([1.5, 2.5, 3]), L3 = pk([16, 25, 36]), T1 = 2 * Math.PI * Math.sqrt(L1 / g), L2 = g * Math.pow(T2 / (2 * Math.PI), 2), T3 = 2 * Math.PI * Math.sqrt(L3 / g), obj = pk(["une horloge à balancier", "une balançoire", "un pendule de laboratoire"]);
      return X({ id: "eqirrmp", lv: 1, titre: "Le pendule",
        q: "La période d'un pendule (durée d'un aller-retour, en s) vaut " + M("T = 2\\pi\\sqrt{\\frac{L}{9{,}81}}") + ", où " + M("L") + " est sa longueur en mètres. La formule s'applique aussi bien à " + obj + " qu'à un fil lesté.",
        parts: [{ label: "Calcule la période d'un pendule de " + Q(L1, "m") + " (au centième).", pts: 1 }, { label: "Quelle longueur faut-il pour une période de " + Q(T2, "s") + " (au centième de m) ?", pts: 2 }, { label: "Période d'un grand pendule de " + Q(L3, "m") + " (au centième) ?", pts: 1 }, { label: "Par combien faut-il multiplier la longueur pour doubler la période ?", pts: 1 }],
        sol: ul([M("T = 2\\pi\\sqrt{\\frac{" + N(L1) + "}{9{,}81}} \\approx " + A(T1, 2)) + " s.", M(N(T2) + " = 2\\pi\\sqrt{\\frac{L}{9{,}81}}") + " ⟺ " + M("\\sqrt{\\frac{L}{9{,}81}} = \\frac{" + N(T2) + "}{2\\pi}") + " ⟺ " + M("L = 9{,}81 \\cdot \\left(\\frac{" + N(T2) + "}{2\\pi}\\right)^2 \\approx " + A(L2, 2)) + " m.", M("T \\approx " + A(T3, 2)) + " s.", "Par 4 : " + M("\\sqrt{4L} = 2\\sqrt{L}") + ", la période double."]),
        chk: [[T1, A(T1, 2), 0.01], [L2, A(L2, 2), 0.01], [T3, A(T3, 2), 0.01]] }); },
    // La diagonale (équation bicarrée)
    () => { const [obj, un, a, b, d] = pk([["Un terrain de sport rectangulaire", "m", 12, 16, 20], ["Une table rectangulaire", "dm", 6, 8, 10], ["Un panneau publicitaire rectangulaire", "m", 5, 12, 13], ["Un champ rectangulaire", "m", 15, 20, 25], ["Une porte de garage", "dm", 9, 12, 15], ["Une plaque de contreplaqué", "dm", 8, 15, 17]]), P = a * b;
      return X({ id: "eqbic", lv: 2, titre: "La diagonale",
        q: obj + " a une aire de " + Q(P, un + "^2") + " et une diagonale de " + Q(d, un) + ". On cherche ses dimensions ; on note " + M("x") + " sa largeur.",
        parts: [{ label: "Exprime la longueur à l'aide de " + M("x") + " et de l'aire.", pts: 1 }, { label: "Avec Pythagore, montre que " + M("x^4 - " + d * d + "x^2 + " + N(P * P) + " = 0") + ".", pts: 2 }, { label: "Résous cette équation en posant " + M("X = x^2") + ".", pts: 2 }, { label: "Donne les dimensions et le périmètre.", pts: 1 }],
        sol: ul(["Longueur " + M("\\frac{" + P + "}{x}") + ".", M("x^2 + \\left(\\frac{" + P + "}{x}\\right)^2 = " + d + "^2") + " ; on multiplie par " + M("x^2") + " : " + M("x^4 + " + N(P * P) + " = " + d * d + "x^2") + ", d'où l'équation.", M("X^2 - " + d * d + "X + " + N(P * P) + " = 0") + ", " + M("\\Delta = " + N(d ** 4) + " - " + N(4 * P * P) + " = " + N((b * b - a * a) ** 2)) + " : " + M("X = " + a * a) + " ou " + M("X = " + b * b) + ". Puis " + M("x^2 = " + a * a) + " ou " + M("x^2 = " + b * b) + " : " + M("x = \\pm " + a) + " ou " + M("x = \\pm " + b) + ".", "Une longueur est positive : " + Q(a, un) + " sur " + Q(b, un) + " (les deux solutions positives donnent le même rectangle). Périmètre " + Q(2 * (a + b), un) + "."]),
        chk: [[Math.sqrt(a * a), String(a)], [b, String(b)], [2 * (a + b), String(2 * (a + b))], [P / a, String(b)]] }); },
    // Tolérances (valeur absolue)
    () => { const K = pk([
        { t: "Le contrôle de qualité", c: pk([120, 150, 250]), e: pk([0.5, 0.8, 1.2]), txt: (c, e) => "Une machine découpe des tiges de longueur nominale " + Q(c, "mm") + ". Une tige est acceptée si sa longueur " + M("x") + " (en mm) diffère d'au plus " + Q(e, "mm") + " de la longueur nominale.", lim: "les longueurs limites acceptées", q3: (x) => "Une tige mesure " + Q(x, "mm") + ". Est-elle acceptée ?", oui: "acceptée", non: "refusée", all: "les longueurs acceptées" },
        { t: "Les stations-service", c: pk([47, 63, 85]), e: pk([12, 15, 18]), txt: (c, e) => "Sur une autoroute, une sortie se trouve à la borne kilométrique " + c + ". Deux stations-service sont à " + Q(e, "km") + " de cette sortie, une de chaque côté. On note " + M("x") + " la borne d'une station.", lim: "les bornes des deux stations", q3: (x) => "Une aire de repos est à la borne " + tx(x) + ". Est-elle plus près de la sortie que les stations ?", oui: "oui, plus près", non: "non, plus loin", all: "les bornes qui ne sont pas plus loin de la sortie que les stations" },
        { t: "Le thermostat", c: pk([19, 20, 21]), e: pk([1.5, 2]), txt: (c, e) => "Le chauffage d'une salle de classe est réglé sur " + c + " °C. Il réagit (marche ou arrêt) dès que la température " + M("x") + " (en °C) s'écarte de " + tx(e) + " °C de cette valeur.", lim: "les températures où le chauffage réagit", q3: (x) => "Le thermomètre indique " + tx(x) + " °C. Le chauffage a-t-il réagi ?", oui: "non, pas encore", non: "oui, il a réagi", all: "les températures où le chauffage ne réagit pas encore" }]);
      const { c, e } = K, dl = r6(pk([-1, 1]) * pk([0.4, 0.7, 1.5, 2.5]) * e), x0 = r6(c + dl), dd = Math.abs(dl);
      return X({ id: "eqabs", lv: 1, titre: K.t,
        q: K.txt(c, e),
        parts: [{ label: "Écris une équation avec une valeur absolue dont les solutions sont " + K.lim + ".", pts: 1 }, { label: "Résous-la.", pts: 1 }, { label: K.q3(x0), pts: 1 }, { label: "Écris l'inéquation qui décrit " + K.all + ", puis donne-les sous forme d'encadrement.", pts: 1 }],
        sol: ul([M("|x - " + c + "| = " + N(e)) + ".", M("x - " + c + " = " + N(e)) + " ou " + M("x - " + c + " = -" + N(e)) + ", donc " + M("x = " + N(c + e)) + " ou " + M("x = " + N(c - e)) + ".", M("|" + N(x0) + " - " + c + "| = " + N(dd)) + (dd < e ? " est plus petit que " : " est plus grand que ") + M(N(e)) + " : " + (dd < e ? K.oui : K.non) + ".", M("|x - " + c + "| \\leq " + N(e)) + " ⟺ " + M(N(c - e) + " \\leq x \\leq " + N(c + e)) + "."]),
        chk: [[c - e, N(c - e)], [c + e, N(c + e)], [dd, N(dd)]] }); },
    // À égale distance (|A| = |B|)
    () => { let a, b2, p, q; do { a = R.int(2, 15); b2 = a + 2 * R.int(2, 9) + pk([0, 1]); p = R.int(2, 9); q = R.int(1, 8); } while (p === q || p + q === (p - q) / 3);
      const m = (a + b2) / 2, x1 = p + q, x2 = (p - q) / 3, v2 = (p + 2 * q) / 3, who = pk(["La commune", "La société de transport", "L'association du quartier"]);
      return X({ id: "eqabs", lv: 3, titre: "À égale distance",
        q: "Le long d'une route droite, deux arrêts de bus sont aux bornes " + a + " et " + b2 + " (en km). " + who + " veut construire un abri à égale distance des deux arrêts, à la borne " + M("x") + ".",
        parts: [{ label: "Écris une équation avec deux valeurs absolues et résous-la.", pts: 2 }, { label: "Explique pourquoi l'un des deux cas n'a pas de solution.", pts: 1 }, { label: "Résous de même " + M("|2x - " + p + "| = |x + " + q + "|") + ".", pts: 2 }, { label: "Vérifie la solution non entière (ou la plus petite) de la question c.", pts: 1 }],
        sol: ul([M("|x - " + a + "| = |x - " + b2 + "|") + " ⟺ " + M("x - " + a + " = -(x - " + b2 + ")") + " ⟺ " + M("2x = " + (a + b2)) + " ⟺ " + M("x = " + N(m)) + " (le milieu).", "L'autre cas, " + M("x - " + a + " = x - " + b2) + ", donne " + M("-" + a + " = -" + b2) + " : impossible.", M("2x - " + p + " = x + " + q) + " donne " + M("x = " + x1) + " ; " + M("2x - " + p + " = -(x + " + q + ")") + " donne " + M("3x = " + (p - q)) + ", " + M("x = " + FR(x2)) + ".", "Pour " + M("x = " + FR(x2)) + ", " + M("|2x - " + p + "| = " + FR(Math.abs(2 * x2 - p))) + " et " + M("|x + " + q + "| = " + FR(Math.abs(x2 + q))) + " ✓."]),
        chk: [[m, N(m)], [x1, String(x1)], [x2, FRp(x2)], [Math.abs(2 * x2 - p), FRp(v2)]] }); },
  ];
  const RAISONA = [
    () => { let r, b, s, a; do { r = pk([3, 4, 5]); b = pk([2, 3, 4, 5]); s = b + r; a = r * r - s; } while (a < 2 || b + 1 === r); const s2 = b + 1 - r, w = RX.who();
      return X({ id: "eqirrmp", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\sqrt{x + " + a + "} = x - " + b) + " : « J'élève au carré, " + M(poly([1, -(2 * b + 1), b * b - a]) + " = 0") + ", donc " + M("S = \\{" + s2 + " \\,;\\, " + s + "\\}") + ". »",
        parts: [{ label: "Quelle étape manque ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul(["Les solutions n'ont pas été vérifiées : élever au carré peut ajouter des solutions parasites (il fallait " + M("x \\geq " + b) + ").", "Pour " + M("x = " + s2) + ", " + M("\\sqrt{" + (s2 + a) + "} = " + (r - 1)) + " mais " + M(s2 + " - " + b + " = " + (s2 - b)) + " ✗. " + M("S = \\{" + s + "\\}") + "."]),
        chk: [[s, String(s)]] }); },
    () => VF("eqabs", 1, [["« " + M("|x - 4| = -3") + " n'a pas de solution. »", true, "Une valeur absolue est une distance : elle n'est jamais négative."],
      ["« " + M("|x + 5|") + " est la distance entre " + M("x") + " et 5. »", false, M("|x + 5| = |x - (-5)|") + " : c'est la distance entre " + M("x") + " et " + M("-5") + "."],
      ["« " + M("x^4 - 5x^2 + 4 = 0") + " a quatre solutions. »", true, "Avec " + M("X = x^2") + ", " + M("X^2 - 5X + 4 = 0") + " donne " + M("X = 1") + " ou " + M("X = 4") + ", donc " + M("x = \\pm 1") + " ou " + M("x = \\pm 2") + "."],
      ["« " + M("x^4 + 5x^2 + 4 = 0") + " a quatre solutions. »", false, M("X = -1") + " ou " + M("X = -4") + " : un carré n'est jamais négatif, aucune solution."],
      ["« Élever au carré les deux membres d'une équation ne change pas ses solutions. »", false, "Contre-exemple : " + M("x = 3") + " a une solution, " + M("x^2 = 9") + " en a deux. D'où les solutions parasites."],
      ["« " + M("x = 2") + " peut être solution de " + M("\\frac{5}{x - 2} = 1 + \\frac{3}{x - 2}") + ". »", false, M("x = 2") + " annule les dénominateurs : c'est une valeur interdite."],
      ["« " + M("\\sqrt{x - 1} = -3") + " n'a pas de solution. »", true, "Une racine carrée n'est jamais négative."]]),
    () => { const c = R.int(2, 7), w = RX.who();
      return X({ id: "eqratmp", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{x^2}{x - " + c + "} = \\frac{" + c * c + "}{x - " + c + "}") + " : « Les dénominateurs sont égaux, donc " + M("x^2 = " + c * c) + " et " + M("S = \\{-" + c + " \\,;\\, " + c + "\\}") + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul([M(c) + " est une valeur interdite : il annule le dénominateur.", M("S = \\{-" + c + "\\}") + " (vérification : " + M("\\frac{" + c * c + "}{" + -2 * c + "}") + " des deux côtés)."]),
        chk: [[-c, String(-c)]] }); },
    () => { const [m, n] = pk([[4, 9], [1, 16], [4, 25], [9, 16], [1, 9], [9, 25]]), w = RX.who();
      return X({ id: "eqbic", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("x^4 - " + (m + n) + "x^2 + " + m * n + " = 0") + " : « Je pose " + M("X = x^2") + ", " + M("X^2 - " + (m + n) + "X + " + m * n + " = 0") + ", donc " + M("S = \\{" + m + " \\,;\\, " + n + "\\}") + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul([M(m) + " et " + M(n) + " sont les valeurs de " + M("X") + " : il faut revenir à " + M("x") + " avec " + M("x^2 = X") + ".", M("x^2 = " + m) + " ou " + M("x^2 = " + n) + ", donc " + M("S = \\{-" + Math.sqrt(n) + " \\,;\\, -" + Math.sqrt(m) + " \\,;\\, " + Math.sqrt(m) + " \\,;\\, " + Math.sqrt(n) + "\\}") + "."]),
        chk: [[Math.sqrt(n), String(Math.sqrt(n))]] }); },
  ];

  // ===================== MP 3e · B–C. Puissances, exponentielles et logarithmes =====================
  const EXL = [
    // Le placement (intérêts composés)
    () => { const C0 = pk([2000, 5000, 8000, 12000]), t = pk([1.5, 2, 2.5, 3]), n = pk([5, 8, 10]), Y = pk([10, 12, 15]), q = 1 + t / 100, Cn = C0 * Math.pow(q, n), nd = Math.log(2) / Math.log(q), n2 = Math.ceil(nd), tY = (Math.pow(2, 1 / Y) - 1) * 100, obj = pk(["un compte épargne", "un 3e pilier", "un livret jeunesse"]);
      return X({ id: "croissexp", lv: 1, titre: "Le placement",
        q: "On place " + Q(C0, "CHF") + " sur " + obj + " à " + tx(t) + " % d'intérêts composés par an (les intérêts restent sur le compte).",
        parts: [{ label: "Écris le capital " + M("C(n)") + " après " + M("n") + " années, puis calcule-le après " + n + " ans (au centime).", pts: 2 }, { label: "Combien d'intérêts a-t-on gagnés en " + n + " ans ?", pts: 1 }, { label: "Après combien d'années entières le capital aura-t-il doublé ?", pts: 2 }, { label: "Quel taux annuel faudrait-il pour doubler le capital en " + Y + " ans (au centième de %) ?", pts: 1 }],
        sol: ul([M("C(n) = " + N(C0) + " \\cdot " + N(q) + "^n") + " ; " + M("C(" + n + ") \\approx " + A(Cn, 2)) + " CHF.", M(A(Cn, 2) + " - " + N(C0) + " \\approx " + A(Cn - C0, 2)) + " CHF.", M(N(q) + "^n = 2") + " ⟺ " + M("n = \\frac{\\log 2}{\\log " + N(q) + "} \\approx " + A(nd, 2)) + " : il faut " + M(n2) + " ans.", M("q^{" + Y + "} = 2") + " ⟺ " + M("q = 2^{\\frac{1}{" + Y + "}} \\approx " + A(1 + tY / 100, 5)) + " : taux " + M("\\approx " + A(tY, 2) + "\\,\\%") + "."]),
        chk: [[Cn, A(Cn, 2), 0.01], [Cn - C0, A(Cn - C0, 2), 0.01], [n2, String(n2)], [tY, A(tY, 2), 0.01]] }); },
    // La demi-vie (décroissance)
    () => { const [sub, Tm, un] = pk([["de l'iode 131 (traitement de la thyroïde)", 8, "jours"], ["du technétium 99m (imagerie médicale)", 6, "heures"], ["du césium 137 (déchets radioactifs)", 30, "années"]]), m0 = pk([50, 80, 120, 200]), t1 = Tm * pk([1.25, 2.5, 3.75]), p = pk([10, 5, 1]);
      const m1 = m0 * Math.pow(0.5, t1 / Tm), tp = (Tm * Math.log(p / 100)) / Math.log(0.5);
      return X({ id: "croissexp", lv: 2, titre: "La demi-vie",
        q: "La demi-vie " + sub + " est de " + Tm + " " + un + " : " + tous(un) + Tm + " " + un + ", la masse restante est divisée par 2. On dispose au départ de " + Q(m0, "mg") + ".",
        parts: [{ label: "Écris la masse " + M("m(t)") + " après " + M("t") + " " + un + ".", pts: 1 }, { label: "Quelle masse reste-t-il après " + tx(t1) + " " + un + " (au centième de mg) ?", pts: 1 }, { label: "Après combien " + de(un) + " ne reste-t-il que " + p + " % de la masse de départ (au dixième) ?", pts: 2 }, { label: "Quel pourcentage reste-t-il après trois demi-vies ?", pts: 1 }],
        sol: ul([M("m(t) = " + m0 + " \\cdot 0{,}5^{\\frac{t}{" + Tm + "}}"), M("m(" + N(t1) + ") = " + m0 + " \\cdot 0{,}5^{\\," + N(t1 / Tm) + "} \\approx " + A(m1, 2)) + " mg.", M("0{,}5^{\\frac{t}{" + Tm + "}} = " + N(p / 100)) + " ⟺ " + M("\\frac{t}{" + Tm + "} = \\frac{\\log " + N(p / 100) + "}{\\log 0{,}5}") + " ⟺ " + M("t \\approx " + A(tp, 1)) + " " + un + ".", M("0{,}5^3 = 0{,}125") + " : il reste 12,5 %."]),
        chk: [[m1, A(m1, 2), 0.01], [tp, A(tp, 1), 0.1], [12.5, "12,5"]] }); },
    // Deux villes (croissance, dépassement)
    () => { const PA = pk([45000, 60000, 80000]), a = pk([0.5, 1]), f = pk([0.6, 0.7, 0.75]), PB = PA * f, b = pk([2, 2.5, 3]), qa = 1 + a / 100, qb = 1 + b / 100;
      const A10 = PA * Math.pow(qa, 10), B10 = PB * Math.pow(qb, 10), ns = Math.log(PA / PB) / Math.log(qb / qa), n0 = Math.ceil(ns), dbl = Math.log(2) / Math.log(qb);
      return X({ id: "croissexp", lv: 3, titre: "Deux villes",
        q: "La ville A compte " + T(PA) + " habitants et sa population augmente de " + tx(a) + " % par an. La ville B, plus petite, compte " + T(PB) + " habitants et augmente de " + tx(b) + " % par an. On suppose que ces taux restent constants.",
        parts: [{ label: "Écris les populations " + M("A(n)") + " et " + M("B(n)") + " après " + M("n") + " années.", pts: 1 }, { label: "Calcule les deux populations dans 10 ans (à l'unité).", pts: 1 }, { label: "Dans combien d'années entières la ville B aura-t-elle dépassé la ville A ?", pts: 2 }, { label: "Combien d'années faut-il à la ville B pour doubler sa population (au dixième) ?", pts: 1 }],
        sol: ul([M("A(n) = " + N(PA) + " \\cdot " + N(qa) + "^n") + " ; " + M("B(n) = " + N(PB) + " \\cdot " + N(qb) + "^n") + ".", M("A(10) \\approx " + A(A10, 0)) + " ; " + M("B(10) \\approx " + A(B10, 0)) + ".", M(N(PB) + " \\cdot " + N(qb) + "^n = " + N(PA) + " \\cdot " + N(qa) + "^n") + " ⟺ " + M("\\left(\\frac{" + N(qb) + "}{" + N(qa) + "}\\right)^n = \\frac{" + N(PA) + "}{" + N(PB) + "}") + " ⟺ " + M("n = \\frac{\\log(" + N(PA) + " : " + N(PB) + ")}{\\log(" + N(qb) + " : " + N(qa) + ")} \\approx " + A(ns, 2)) + " : dans " + M(n0) + " ans.", M(N(qb) + "^n = 2") + " ⟺ " + M("n = \\frac{\\log 2}{\\log " + N(qb) + "} \\approx " + A(dbl, 1)) + " ans."]),
        chk: [[A10, A(A10, 0), 1], [B10, A(B10, 0), 1], [n0, String(n0)], [dbl, A(dbl, 1), 0.1]] }); },
    // Le pH (définition du logarithme)
    () => { const k = pk([2, 3, 5, 6]), mb = pk([2.5, 3.2, 4, 6.3]), eb = pk([3, 4, 5]), pHb = eb - Math.log10(mb), pc = pk([2.5, 7.4, 8.2]), Hc = Math.pow(10, -pc), [mc, ec] = sci(Hc, 2), dl = pk([2, 3]), ph1 = pk([3, 4]), ph2 = ph1 + dl;
      return X({ id: "logdef", lv: 1, titre: "Le pH",
        q: "Le pH d'une solution vaut " + M("\\text{pH} = -\\log c") + ", où " + M("c") + " est la concentration en ions hydrogène (en mol/L). Plus le pH est bas, plus la solution est acide.",
        parts: [{ label: "Quel est le pH d'une solution où " + M("c = 10^{-" + k + "}") + " ?", pts: 1 }, { label: "Quel est le pH d'une solution où " + M("c = " + N(mb) + " \\cdot 10^{-" + eb + "}") + " (au centième) ?", pts: 1 }, { label: "Le pH " + (pc === 7.4 ? "du sang" : "d'une solution") + " vaut " + tx(pc) + ". Quelle est la concentration " + M("c") + " ?", pts: 2 }, { label: "Une solution de pH " + ph1 + " est combien de fois plus concentrée en ions hydrogène qu'une solution de pH " + ph2 + " ?", pts: 1 }],
        sol: ul([M("-\\log 10^{-" + k + "} = " + k) + ".", M("-\\log(" + N(mb) + " \\cdot 10^{-" + eb + "}) \\approx " + A(pHb, 2)) + ".", M("-\\log c = " + N(pc)) + " ⟺ " + M("c = 10^{-" + N(pc) + "} \\approx " + N(mc) + " \\cdot 10^{" + ec + "}") + " mol/L.", M("\\frac{10^{-" + ph1 + "}}{10^{-" + ph2 + "}} = 10^{" + dl + "} = " + N(Math.pow(10, dl))) + " fois : un pH plus bas d'une unité, c'est une concentration 10 fois plus grande."]),
        chk: [[k, String(k)], [pHb, A(pHb, 2), 0.01], [Hc / Math.pow(10, ec), N(mc), 0.01], [Math.pow(10, dl), N(Math.pow(10, dl))]] }); },
    // Les décibels (propriétés des logarithmes)
    () => { const k = pk([6, 7, 8]), L1 = pk([70, 72, 76, 80]), L2 = L1 + 10 * Math.log10(2), ex = (85 - L1) / 10, nmax = Math.floor(Math.pow(10, ex) + 1e-9), K = pk([["Dans un atelier", "machines"], ["Sur un chantier", "marteaux-piqueurs"], ["Dans une salle de concert", "enceintes"]]);
      return X({ id: "logprop", lv: 2, titre: "Les décibels",
        q: "Le niveau sonore (en dB) vaut " + M("L = 10\\log\\frac{I}{I_0}") + ", où " + M("I") + " est l'intensité du son et " + M("I_0") + " l'intensité la plus faible qu'on entend. " + K[0] + ", " + (K[1] === "marteaux-piqueurs" ? "chacun" : "chacune") + " des " + K[1] + " produit " + L1 + " dB.",
        parts: [{ label: "Quel est le niveau d'un son d'intensité " + M("I = 10^{" + k + "} I_0") + " ?", pts: 1 }, { label: "Deux " + K[1] + " identiques fonctionnent ensemble : l'intensité double. Quel est le niveau (au dixième) ?", pts: 2 }, { label: "Combien de " + K[1] + " identiques faut-il pour atteindre " + (L1 + 10) + " dB ?", pts: 1 }, { label: "Le bruit devient dangereux au-delà de 85 dB. Combien de " + K[1] + " peuvent fonctionner ensemble, au maximum, sans dépasser 85 dB ?", pts: 2 }],
        sol: ul([M("10\\log 10^{" + k + "} = 10 \\cdot " + k + " = " + 10 * k) + " dB.", M("10\\log\\frac{2I}{I_0} = 10\\log 2 + 10\\log\\frac{I}{I_0} \\approx 3{,}0 + " + L1 + " = " + A(L2, 1)) + " dB : doubler l'intensité ajoute environ 3 dB, pas " + L1 + ".", "Il faut multiplier l'intensité par 10 (" + M("10\\log 10 = 10") + ") : 10 " + K[1] + ".", M(L1 + " + 10\\log n \\leq 85") + " ⟺ " + M("\\log n \\leq " + N(ex)) + " ⟺ " + M("n \\leq 10^{\\," + N(ex) + "} \\approx " + A(Math.pow(10, ex), 2)) + " : au maximum " + nmax + "."]),
        chk: [[10 * k, String(10 * k)], [L2, A(L2, 1), 0.1], [nmax, String(nmax)]] }); },
    // La croissance (équations exponentielles)
    () => { const N0 = pk([100, 200, 500]), Tt = pk([2, 3, 4, 5]), kk = pk([3, 4, 5]), j = pk([6, 7, 8]), m = pk([10, 50, 100]), K = pk([["une colonie compte", "bactéries", "heures"], ["une culture de levure compte", "cellules", "heures"], ["les algues d'un étang couvrent", "m²", "jours"]]);
      const tm = (Tt * Math.log(m)) / Math.log(2);
      return X({ id: "eqexp", lv: 2, titre: "La croissance",
        q: "Au départ, " + K[0] + " " + N0 + " " + K[1] + " ; cette quantité double " + tous(K[2]) + Tt + " " + K[2] + ".",
        parts: [{ label: "Écris la quantité " + M("N(t)") + " après " + M("t") + " " + K[2] + ".", pts: 1 }, { label: "Quelle est la quantité après " + kk * Tt + " " + K[2] + " ?", pts: 1 }, { label: "Après combien " + de(K[2]) + " atteint-on " + T(N0 * Math.pow(2, j)) + " " + K[1] + " ? (même base)", pts: 1 }, { label: "Après combien " + de(K[2]) + " atteint-on " + T(N0 * m) + " " + K[1] + " (au dixième) ?", pts: 2 }],
        sol: ul([M("N(t) = " + N0 + " \\cdot 2^{\\frac{t}{" + Tt + "}}"), M("N(" + kk * Tt + ") = " + N0 + " \\cdot 2^{" + kk + "} = " + N(N0 * Math.pow(2, kk))) + " " + K[1] + ".", M("2^{\\frac{t}{" + Tt + "}} = " + Math.pow(2, j) + " = 2^{" + j + "}") + " ⟺ " + M("\\frac{t}{" + Tt + "} = " + j) + " ⟺ " + M("t = " + j * Tt) + " " + K[2] + ".", M("2^{\\frac{t}{" + Tt + "}} = " + m) + " ⟺ " + M("\\frac{t}{" + Tt + "} = \\frac{\\log " + m + "}{\\log 2}") + " ⟺ " + M("t \\approx " + A(tm, 1)) + " " + K[2] + "."]),
        chk: [[N0 * Math.pow(2, kk), N(N0 * Math.pow(2, kk))], [j * Tt, String(j * Tt)], [tm, A(tm, 1), 0.1]] }); },
    // La légende de l'échiquier (logarithme, nombre de chiffres)
    () => { const c = pk([20, 25, 30]), m = pk([6, 9, 12]), nc = Math.ceil(m / Math.log10(2)) + 1, d64 = Math.floor(63 * Math.log10(2)) + 1;
      return X({ id: "logprop", lv: 3, titre: "La légende de l'échiquier",
        q: "Selon une légende, l'inventeur des échecs demanda 1 grain de riz sur la 1re case de l'échiquier, 2 sur la 2e, 4 sur la 3e, et ainsi de suite en doublant à chaque case (64 cases).",
        parts: [{ label: "Combien de grains y a-t-il sur la case " + M("n") + " ? Sur la case " + c + " ?", pts: 1 }, { label: "Sur quelle case dépasse-t-on pour la première fois " + M("10^{" + m + "}") + " grains ?", pts: 2 }, { label: "En utilisant " + M("\\log(2^{63}) = 63\\log 2") + ", trouve le nombre de chiffres du nombre de grains de la dernière case.", pts: 2 }],
        sol: ul([M("2^{n - 1}") + " ; case " + c + " : " + M("2^{" + (c - 1) + "} = " + N(Math.pow(2, c - 1))) + " grains.", M("2^{n - 1} > 10^{" + m + "}") + " ⟺ " + M("n - 1 > \\frac{" + m + "}{\\log 2} \\approx " + A(m / Math.log10(2), 2)) + " : la case " + M(nc) + ".", M("63\\log 2 \\approx " + A(63 * Math.log10(2), 2)) + " : " + M("2^{63} \\approx 10^{" + A(63 * Math.log10(2), 2) + "}") + ", entre " + M("10^{18}") + " et " + M("10^{19}") + " : " + d64 + " chiffres."]),
        chk: [[Math.pow(2, c - 1), N(Math.pow(2, c - 1))], [nc, String(nc)], [d64, String(d64)]] }); },
    // L'énergie des séismes (équation logarithmique)
    () => { const M1 = pk([4, 5, 6]), M2 = pk([5.5, 6.2, 7.1]), E1 = Math.pow(10, 4.8 + 1.5 * M1), [m2, e2] = sci(Math.pow(10, 4.8 + 1.5 * M2), 2), E2 = m2 * Math.pow(10, e2), M2c = (Math.log10(E2) - 4.8) / 1.5, r1 = Math.pow(10, 1.5), [m1, e1] = sci(E1, 2);
      return X({ id: "eqlog", lv: 3, titre: "L'énergie des séismes",
        q: "L'énergie " + M("E") + " (en joules) libérée par un séisme de magnitude " + M("M") + " vérifie " + M("\\log E = 4{,}8 + 1{,}5M") + ".",
        parts: [{ label: "Quelle énergie libère un séisme de magnitude " + M1 + " ?", pts: 1 }, { label: "Un séisme libère " + M(N(m2) + " \\cdot 10^{" + e2 + "}") + " J. Quelle est sa magnitude (au dixième) ?", pts: 2 }, { label: "Combien de fois plus d'énergie libère un séisme d'une magnitude plus élevée de 1 (à l'unité) ? Et de 2 ?", pts: 2 }],
        sol: ul([M("E = 10^{\\,4{,}8 + 1{,}5 \\cdot " + M1 + "} = 10^{" + N(4.8 + 1.5 * M1) + "} \\approx " + sciT(E1)) + " J.", M("\\log(" + N(m2) + " \\cdot 10^{" + e2 + "}) \\approx " + A(Math.log10(E2), 2)) + " ; " + M("M = \\frac{" + A(Math.log10(E2), 2) + " - 4{,}8}{1{,}5} \\approx " + A(M2c, 1)) + ".", M("\\frac{E_2}{E_1} = 10^{\\,1{,}5(M_2 - M_1)}") + " : " + M("10^{\\,1{,}5} \\approx " + A(r1, 0)) + " fois ; et " + M("10^3 = 1\\text{'}000") + " fois pour 2 de plus."]),
        chk: [[M2c, A(M2c, 1), 0.1], [r1, A(r1, 0), 1], [E1 / Math.pow(10, e1), N(m1), 0.01]] }); },
  ];
  const RAISONL = [
    () => VF("logprop", 1, [["« " + M("\\log(a + b) = \\log a + \\log b") + " »", false, "Contre-exemple : " + M("\\log(10 + 10) = \\log 20 \\approx 1{,}3") + ", mais " + M("\\log 10 + \\log 10 = 2") + "."],
      ["« " + M("\\log(100x) = 2 + \\log x") + " (pour " + M("x > 0") + "). »", true, M("\\log 100 + \\log x = 2 + \\log x") + "."],
      ["« " + M("\\log_2 8 = 4") + " »", false, M("2^3 = 8") + ", donc " + M("\\log_2 8 = 3") + "."],
      ["« " + M("2^x = -4") + " n'a pas de solution. »", true, "Une puissance de 2 est toujours positive."],
      ["« " + M("\\log\\frac{a}{b} = \\frac{\\log a}{\\log b}") + " »", false, M("\\log\\frac{a}{b} = \\log a - \\log b") + " ; contre-exemple : " + M("\\log\\frac{1\\text{'}000}{10} = 2") + ", mais " + M("\\frac{3}{1} = 3") + "."],
      ["« Une hausse de 10 % deux années de suite fait une hausse de 20 %. »", false, M("1{,}1^2 = 1{,}21") + " : +21 %."],
      ["« " + M("\\log 0") + " n'existe pas. »", true, "Aucune puissance de 10 ne vaut 0."]]),
    () => { const a = pk([2, 3, 4, 5]), r = a + pk([1, 2, 3, 5]), b = r * (r - a), s2 = a - r, w = RX.who();
      return X({ id: "eqlog", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\log x + \\log(x - " + a + ") = \\log " + b) + " : « " + M("x(x - " + a + ") = " + b) + ", donc " + M(poly([1, -a, -b]) + " = 0") + " et " + M("S = \\{" + s2 + " \\,;\\, " + r + "\\}") + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul(["Le domaine n'a pas été vérifié : il faut " + M("x > 0") + " et " + M("x - " + a + " > 0") + ", soit " + M("x > " + a) + ".", M(s2) + " est négatif (on ne peut pas calculer " + M("\\log(" + s2 + ")") + "), donc " + M("S = \\{" + r + "\\}") + "."]),
        chk: [[r, String(r)], [r * (r - a), String(b)]] }); },
    () => { const c = pk([3, 5, 7]), b = pk([2, 3]), k = b === 2 ? pk([3, 4, 5]) : pk([2, 3, 4]), v = c * Math.pow(b, k), w = RX.who(), wr = Math.log(v) / Math.log(c * b);
      return X({ id: "eqexp", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M(c + " \\cdot " + b + "^x = " + v) + " : « " + M(c + " \\cdot " + b + "^x = " + c * b + "^x") + ", donc " + M("x = \\frac{\\log " + v + "}{\\log " + c * b + "} \\approx " + A(wr, 2)) + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Résous correctement l'équation.", pts: 1 }],
        sol: ul([M(c + " \\cdot " + b + "^x") + " n'est pas " + M("(" + c + " \\cdot " + b + ")^x") + " : l'exposant ne porte que sur " + M(b) + ".", "On divise par " + M(c) + " : " + M(b + "^x = " + Math.pow(b, k) + " = " + b + "^{" + k + "}") + ", donc " + M("x = " + k) + "."]),
        chk: [[k, String(k)]] }); },
  ];

  // ===================== MP 3e · D. Volumes et similitude =====================
  const EXV = [
    // Le silo (cylindre + cône)
    () => { const r = pk([1.5, 2, 2.5]), h = pk([6, 8, 10]), hc = pk([1.5, 2, 3]), Qd = pk([5, 8, 10]), Vc = Math.PI * r * r * h, Vk = (Math.PI * r * r * hc) / 3, Vt = Vc + Vk, tt = Vt / Qd;
      return X({ id: "volmp", lv: 1, titre: "Le silo",
        q: "Un silo à grains est formé d'un cylindre de " + Q(2 * r, "m") + " de diamètre et de " + Q(h, "m") + " de haut, posé sur un cône (la trémie) de " + Q(hc, "m") + " de haut et de même diamètre.",
        parts: [{ label: "Calcule le volume du cylindre (au centième de m³).", pts: 1 }, { label: "Calcule le volume du cône (au centième de m³).", pts: 1 }, { label: "Quel est le volume total du silo, en m³ puis en litres ?", pts: 1 }, { label: "Une vis sans fin le remplit à raison de " + Q(Qd, "m^3") + " par heure. Combien de temps faut-il pour le remplir (au dixième d'heure) ?", pts: 1 }],
        sol: ul(["Rayon " + Q(r, "m") + ", " + M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + h + " \\approx " + A(Vc, 2)) + " m³.", M("V = \\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(hc) + "}{3} \\approx " + A(Vk, 2)) + " m³.", M("V \\approx " + A(Vt, 2)) + " m³, soit environ " + M(A(Vt * 1000, 0)) + " L (" + M("1\\ \\text{m}^3 = 1\\text{'}000\\ \\text{L}") + ").", M(A(Vt, 2) + " : " + Qd + " \\approx " + A(tt, 1)) + " h."]),
        chk: [[Vc, A(Vc, 2), 0.01], [Vk, A(Vk, 2), 0.01], [Vt, A(Vt, 2), 0.01], [tt, A(tt, 1), 0.1]] }); },
    // La boîte de conserve (isoler une dimension)
    () => { const V = pk([330, 400, 500, 850]), d = pk([6, 7, 8, 10]), r = d / 2, h = V / (Math.PI * r * r), lab = 2 * Math.PI * r * h, h2 = h / 4, S1 = 2 * Math.PI * r * r + lab, S2 = 2 * Math.PI * 4 * r * r + 2 * Math.PI * 2 * r * h2;
      return X({ id: "volmp", lv: 2, titre: "La boîte de conserve",
        q: "Une boîte de conserve cylindrique doit contenir " + Q(V, "mL") + " (" + M("1\\ \\text{mL} = 1\\ \\text{cm}^3") + "). Son diamètre est de " + Q(d, "cm") + ".",
        parts: [{ label: "Calcule sa hauteur (au dixième de cm).", pts: 2 }, { label: "Quelle est l'aire de l'étiquette qui fait le tour de la boîte (au cm² près) ?", pts: 1 }, { label: "On double le diamètre en gardant le même volume. Par combien la hauteur est-elle divisée ? Quelle est la nouvelle hauteur ?", pts: 1 }, { label: "Laquelle des deux boîtes demande le moins de métal (aire totale, couvercles compris) ?", pts: 2 }],
        sol: ul([M(V + " = \\pi \\cdot " + N(r) + "^2 \\cdot h") + " ⟺ " + M("h = \\frac{" + V + "}{\\pi \\cdot " + N(r * r) + "} \\approx " + A(h, 1)) + " cm.", M("2\\pi \\cdot " + N(r) + " \\cdot " + A(h, 1) + " \\approx " + A(lab, 0)) + " cm² (avec la hauteur non arrondie).", "L'aire de la base est multipliée par " + M("2^2 = 4") + " : la hauteur est divisée par 4, " + M("h \\approx " + A(h2, 1)) + " cm.", "Première boîte, " + M("2\\pi r^2 + 2\\pi r h \\approx " + A(S1, 0)) + " cm² ; seconde, " + M("\\approx " + A(S2, 0)) + " cm². " + (S1 < S2 ? "La première boîte" : "La seconde boîte") + " demande le moins de métal."]),
        chk: [[h, A(h, 1), 0.1], [lab, A(lab, 0), 1], [h2, A(h2, 1), 0.1], [S1, A(S1, 0), 1], [S2, A(S2, 0), 1]] }); },
    // Le tipi ou le tas de sable (Pythagore, cône)
    () => { const [r, h, g] = pk([[1.5, 2, 2.5], [3, 4, 5], [2.4, 3.2, 4], [1.8, 2.4, 3], [2.1, 2.8, 3.5]]), V = (Math.PI * r * r * h) / 3, Ab = Math.PI * r * r, sand = R.rand() < 0.5;
      return X({ id: "volmp", lv: 2, titre: sand ? "Le tas de sable" : "Le tipi",
        q: sand ? "Sur un chantier, un tas de sable a la forme d'un cône. Son diamètre au sol mesure " + Q(2 * r, "m") + " et sa pente, du sommet au sol, " + Q(g, "m") + ". Un mètre cube de sable pèse " + Q(1.6, "t") + "." : "Un tipi a la forme d'un cône. Son diamètre au sol mesure " + Q(2 * r, "m") + " et ses perches, du sommet au sol, " + Q(g, "m") + ". On compte au moins " + Q(1.5, "m^3") + " d'air par personne.",
        parts: [{ label: "Calcule la hauteur du cône.", pts: 2 }, { label: "Calcule son volume (au dixième de m³).", pts: 1 }, { label: "Calcule l'aire " + (sand ? "occupée au sol" : "du sol du tipi") + " (au centième de m²).", pts: 1 }, { label: sand ? "Quelle est la masse du tas (au dixième de tonne) ?" : "Combien de personnes au maximum peuvent dormir dans le tipi ?", pts: 1 }],
        sol: ul(["Pythagore (hauteur, rayon, pente) : " + M("h = \\sqrt{" + N(g) + "^2 - " + N(r) + "^2} = " + N(h)) + " m.", M("V = \\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + "}{3} \\approx " + A(V, 1)) + " m³.", M("\\pi \\cdot " + N(r) + "^2 \\approx " + A(Ab, 2)) + " m².", sand ? M(A(V, 1) + " \\cdot 1{,}6 \\approx " + A(V * 1.6, 1)) + " t (calcul avec le volume non arrondi)." : M(A(V, 1) + " : 1{,}5 \\approx " + A(V / 1.5, 2)) + ", donc au maximum " + Math.floor(V / 1.5) + " personnes."]),
        chk: [[Math.sqrt(g * g - r * r), N(h), 0.001], [V, A(V, 1), 0.1], [Ab, A(Ab, 2), 0.01], sand ? [V * 1.6, A(V * 1.6, 1), 0.1] : [Math.floor(V / 1.5), String(Math.floor(V / 1.5))]] }); },
    // La maquette (k, k², k³)
    () => { const n = pk([20, 25, 50]), Lr = pk([5, 6, 7.5]), wr = pk([4, 4.5]), hr = 2.5, Ar = Lr * wr, Vr = Ar * hr, Lm = (Lr * 100) / n, Am = (Ar * 10000) / (n * n), Vm = (Vr * 1e6) / (n * n * n), tap = pk([12, 24, 48]), tapR = (tap * n * n) / 10000;
      return X({ id: "similmp", lv: 1, titre: "La maquette",
        q: "Une architecte construit la maquette d'un salon à l'échelle " + M("1 : " + n) + ". Le salon réel mesure " + Q(Lr, "m") + " sur " + Q(wr, "m") + " et " + Q(hr, "m") + " de haut.",
        parts: [{ label: "Quelle est la longueur du salon sur la maquette (en cm) ?", pts: 1 }, { label: "Quelle est l'aire du sol de la maquette (en cm²) ?", pts: 1 }, { label: "Quel est le volume de la pièce sur la maquette (en cm³) ?", pts: 1 }, { label: "Sur la maquette, un tapis couvre " + Q(tap, "cm^2") + ". Quelle est l'aire du vrai tapis (en m²) ?", pts: 1 }],
        sol: ul(["Longueurs divisées par " + n + " : " + M(N(Lr * 100) + " : " + n + " = " + N(Lm)) + " cm.", "Aires divisées par " + M(n + "^2 = " + N(n * n)) + " : " + M(N(Ar) + "\\ \\text{m}^2 = " + N(Ar * 10000) + "\\ \\text{cm}^2") + ", et " + M(N(Ar * 10000) + " : " + N(n * n) + " = " + N(Am)) + " cm².", "Volumes divisés par " + M(n + "^3 = " + N(n ** 3)) + " : " + M(N(Vr) + "\\ \\text{m}^3 = " + N(Vr * 1e6) + "\\ \\text{cm}^3") + ", et " + M(N(Vr * 1e6) + " : " + N(n ** 3) + " = " + N(Vm)) + " cm³.", M(tap + " \\cdot " + N(n * n) + " = " + N(tap * n * n)) + " cm², soit " + M(N(tapR)) + " m²."]),
        chk: [[Lm, N(Lm)], [Am, N(Am)], [Vm, N(Vm)], [tapR, N(tapR)]] }); },
    // Les bouteilles semblables (prix au litre)
    () => { const h1 = pk([16, 20, 24]), k = pk([1.25, 1.5, 2]), h2 = h1 * k, V1 = pk([0.4, 0.5]), V2 = V1 * k ** 3, A1 = pk([60, 80, 90]), A2 = A1 * k * k, p1 = pk([2.4, 3, 3.6]), f = pk([0.8, 1.15]), p2 = r6(Math.round((p1 * k ** 3 * f) / 0.05) * 0.05), l1 = p1 / V1, l2 = p2 / V2, obj = pk(["jus de pomme", "sirop", "huile d'olive"]);
      return X({ id: "similmp", lv: 2, titre: "Les bouteilles semblables",
        q: "Deux bouteilles de " + obj + " ont exactement la même forme. La petite mesure " + Q(h1, "cm") + " de haut et contient " + Q(V1, "L") + " ; la grande mesure " + Q(h2, "cm") + ". L'étiquette de la petite a une aire de " + Q(A1, "cm^2") + ". La petite coûte " + mo(p1) + ", la grande " + mo(p2) + ".",
        parts: [{ label: "Quel est le rapport de similitude " + M("k") + " ?", pts: 1 }, { label: "Quelle est la contenance de la grande bouteille (au mL près) ?", pts: 1 }, { label: "Quelle est l'aire de l'étiquette de la grande bouteille ?", pts: 1 }, { label: "Quelle bouteille est la plus avantageuse ? Compare les prix au litre (au centime).", pts: 2 }],
        sol: ul([M("k = \\frac{" + N(h2) + "}{" + h1 + "} = " + N(k)), "Volumes × " + M("k^3 = " + N(k ** 3)) + " : " + M(N(V1) + " \\cdot " + N(k ** 3) + " \\approx " + A(V2, 3)) + " L.", "Aires × " + M("k^2 = " + N(k * k)) + " : " + M(A1 + " \\cdot " + N(k * k) + " = " + N(A2)) + " cm².", "Petite, " + M(N(p1) + " : " + N(V1) + " = " + A(l1, 2)) + " CHF/L ; grande, " + M(N(p2) + " : " + A(V2, 3) + " \\approx " + A(l2, 2)) + " CHF/L. " + (l2 < l1 ? "La grande" : "La petite") + " est la plus avantageuse."]),
        chk: [[k, N(k)], [V2, A(V2, 3), 0.001], [A2, N(A2)], [l1, A(l1, 2), 0.01], [l2, A(l2, 2), 0.01]] }); },
    // Le verre conique (k³ ; remonter à k)
    () => { const [H, kn, kd] = pk([[12, 2, 3], [12, 3, 4], [15, 2, 3], [15, 4, 5], [15, 3, 5], [10, 4, 5], [10, 3, 5]]), k = kn / kd, h = H * k, V = pk([200, 250, 300]), Vl = V * k ** 3, hh = H * Math.cbrt(0.5);
      return X({ id: "similmp", lv: 3, titre: "Le verre conique",
        q: "Un verre a la forme d'un cône (pointe en bas) de " + Q(H, "cm") + " de haut ; plein, il contient " + Q(V, "mL") + ". On le remplit jusqu'à " + Q(h, "cm") + " de hauteur.",
        parts: [{ label: "Le liquide forme un cône semblable au verre. Quel est le rapport de similitude " + M("k") + " ?", pts: 1 }, { label: "Quel volume de liquide contient le verre (au mL près) ?", pts: 1 }, { label: "Quel volume faut-il encore verser pour le remplir ?", pts: 1 }, { label: "Jusqu'à quelle hauteur faut-il le remplir pour qu'il soit à moitié plein (au dixième de cm) ?", pts: 2 }],
        sol: ul([M("k = \\frac{" + N(h) + "}{" + H + "} = \\frac{" + kn + "}{" + kd + "}"), "Volumes × " + M("k^3 = \\frac{" + kn ** 3 + "}{" + kd ** 3 + "}") + " : " + M(V + " \\cdot \\frac{" + kn ** 3 + "}{" + kd ** 3 + "} \\approx " + A(Vl, 0)) + " mL.", M(V + " - " + A(Vl, 0) + " \\approx " + A(V - Vl, 0)) + " mL : le verre est rempli aux " + M("\\frac{" + kn + "}{" + kd + "}") + " de sa hauteur, mais pas aux " + M("\\frac{" + kn + "}{" + kd + "}") + " de son volume.", M("k^3 = 0{,}5") + " ⟺ " + M("k = \\sqrt[3]{0{,}5} \\approx 0{,}794") + ", donc " + M("h \\approx 0{,}794 \\cdot " + H + " \\approx " + A(hh, 1)) + " cm."]),
        chk: [[Vl, A(Vl, 0), 1], [V - Vl, A(V - Vl, 0), 1], [hh, A(hh, 1), 0.1]] }); },
    // La copie de la statue (masse k³, vernis k²)
    () => { const H = pk([2, 2.5, 3]), Mm = pk([600, 800, 1200]), Pp = pk([2, 3]), k = pk([0.2, 0.25]), h = H * k, kk = pk([0.4, 0.6]), mq = r6(Mm * kk ** 3);
      return X({ id: "similmp", lv: 2, titre: "La copie de la statue",
        q: "Une statue en bronze de " + Q(H, "m") + " de haut pèse " + Q(Mm, "kg") + " ; il faut " + Q(Pp, "L") + " de vernis pour la recouvrir. Un artisan en fait une copie réduite, pleine et dans le même bronze, de " + Q(r6(h * 100), "cm") + " de haut.",
        parts: [{ label: "Quel est le rapport de réduction " + M("k") + " ?", pts: 1 }, { label: "Quelle est la masse de la copie ?", pts: 1 }, { label: "Combien de vernis (en mL) faut-il pour la copie ?", pts: 1 }, { label: "Une autre copie pleine pèse " + Q(mq, "kg") + ". Quelle est sa hauteur (en cm) ?", pts: 2 }],
        sol: ul([M("k = \\frac{" + N(h) + "}{" + N(H) + "} = " + N(k)), "La masse suit le volume, × " + M("k^3 = " + N(k ** 3)) + " : " + M(Mm + " \\cdot " + N(k ** 3) + " = " + N(Mm * k ** 3)) + " kg.", "Le vernis suit l'aire, × " + M("k^2 = " + N(k * k)) + " : " + M(N(Pp * 1000) + " \\cdot " + N(k * k) + " = " + N(Pp * 1000 * k * k)) + " mL.", M("k^3 = \\frac{" + N(mq) + "}{" + Mm + "} = " + N(kk ** 3)) + ", " + M("k = \\sqrt[3]{" + N(kk ** 3) + "} = " + N(kk)) + " : hauteur " + M(N(kk) + " \\cdot " + N(H * 100) + " = " + N(kk * H * 100)) + " cm."]),
        chk: [[k, N(k)], [Mm * k ** 3, N(Mm * k ** 3)], [Pp * 1000 * k * k, N(Pp * 1000 * k * k)], [kk * H * 100, N(kk * H * 100)]] }); },
  ];
  const RAISONV = [
    () => { const D1 = pk([30, 32, 36]), D2 = pk([20, 22, 24]), rat = (D1 / D2) ** 2, w = RX.who();
      return X({ id: "similmp", lv: 1, titre: "Une grande ou deux petites ?",
        q: "Une pizzeria propose, au même prix, une pizza de " + Q(D1, "cm") + " de diamètre ou deux pizzas de " + Q(D2, "cm") + ". " + w + " choisit les deux petites : « " + M("2 \\cdot " + D2 + " = " + 2 * D2) + " cm, c'est plus que " + D1 + " cm. »",
        parts: [{ label: "Pourquoi ce raisonnement est-il faux ?", pts: 1 }, { label: "Quelle offre donne le plus de pizza ? Justifie avec le rapport des aires.", pts: 2 }],
        sol: ul(["On mange une surface : les aires sont proportionnelles au carré des diamètres, pas aux diamètres.", "Rapport des aires " + M("\\left(\\frac{" + D1 + "}{" + D2 + "}\\right)^2 \\approx " + A(rat, 2)) + (rat > 2 ? " > 2 : la grande pizza vaut plus que deux petites." : " < 2 : les deux petites donnent plus de pizza (la conclusion est juste, mais pas la raison).")]),
        chk: [[rat, A(rat, 2), 0.01]] }); },
    () => VF("similmp", 1, [["« Si on double le rayon d'une boule, son volume double. »", false, "Volume × " + M("2^3 = 8") + "."],
      ["« Un cône a le tiers du volume du cylindre de même base et de même hauteur. »", true, M("V_{\\text{cône}} = \\frac{A_{\\text{base}} \\cdot h}{3}") + "."],
      ["« Sur une carte au " + M("1 : 25\\text{'}000") + ", 1 cm² représente 6,25 ha. »", true, M("25\\text{'}000^2\\ \\text{cm}^2 = 62\\text{'}500\\ \\text{m}^2 = 6{,}25\\ \\text{ha}") + "."],
      ["« Deux cylindres de même volume ont la même hauteur. »", false, "Contre-exemple : " + M("r = 2, h = 4") + " et " + M("r = 4, h = 1") + " donnent tous deux " + M("16\\pi") + "."],
      ["« Si les aires de deux figures semblables sont dans le rapport 9, les longueurs sont dans le rapport 3. »", true, M("k^2 = 9") + " donne " + M("k = 3") + "."],
      ["« Un verre conique rempli à mi-hauteur est à moitié plein. »", false, M("\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}") + " : il n'est rempli qu'au huitième."]]),
    () => { const [r, h, g] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]), w = RX.who(), Vw = (Math.PI * r * r * g) / 3, V = (Math.PI * r * r * h) / 3;
      return X({ id: "volmp", lv: 2, titre: "Trouve l'erreur",
        q: "Un cône a un rayon de " + Q(r, "cm") + " et une génératrice (le côté, du sommet au bord de la base) de " + Q(g, "cm") + ". " + w + " calcule : « " + M("V = \\frac{\\pi \\cdot " + r + "^2 \\cdot " + g + "}{3} \\approx " + A(Vw, 2)) + " cm³ ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon volume (au centième).", pts: 2 }],
        sol: ul(["La génératrice n'est pas la hauteur : la hauteur est perpendiculaire à la base.", "Pythagore : " + M("h = \\sqrt{" + g + "^2 - " + r + "^2} = " + h) + " cm ; " + M("V = \\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} \\approx " + A(V, 2)) + " cm³."]),
        chk: [[Math.sqrt(g * g - r * r), String(h)], [V, A(V, 2), 0.01]] }); },
  ];

  // ===================== MP 4e · E–G. Coordonnées, vecteurs, droites paramétriques =====================
  const EXG = [
    // La nature du triangle (distances, milieu)
    () => { const xa = R.int(-3, 3), ya = R.int(-3, 3), [p0, q0] = pk([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3], [3, 2]]), p = p0 * pk([1, -1]), q = q0 * pk([1, -1]);
      const B = [xa + p, ya + q], C = [xa - q, ya + p], n2 = p * p + q * q, Mx = (B[0] + C[0]) / 2, My = (B[1] + C[1]) / 2, AM = Math.sqrt(2 * n2) / 2;
      return X({ id: "coordmp", lv: 1, titre: "La nature du triangle",
        q: "On donne " + M("A" + pt(xa, ya)) + ", " + M("B" + pt(B[0], B[1])) + " et " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule les longueurs " + M("AB") + ", " + M("AC") + " et " + M("BC") + " (valeur exacte et au centième).", pts: 2 }, { label: "Montre que le triangle est isocèle et rectangle. En quel sommet ?", pts: 1 }, { label: "Calcule le milieu " + M("M") + " de " + M("[BC]") + " et la longueur " + M("AM") + " (au centième).", pts: 1 }, { label: "Calcule l'aire du triangle.", pts: 1 }],
        sol: ul([M("AB = \\sqrt{" + par(p) + "^2 + " + par(q) + "^2} = \\sqrt{" + n2 + "} \\approx " + A(Math.sqrt(n2), 2)) + " ; " + M("AC = \\sqrt{" + n2 + "}") + " ; " + M("BC = \\sqrt{" + 2 * n2 + "} \\approx " + A(Math.sqrt(2 * n2), 2)) + ".", M("AB = AC") + " : isocèle en " + M("A") + " ; " + M("AB^2 + AC^2 = " + n2 + " + " + n2 + " = " + 2 * n2 + " = BC^2") + " : rectangle en " + M("A") + " (réciproque de Pythagore).", M("M" + pt(Mx, My)) + " ; " + M("AM = \\sqrt{" + N((Mx - xa) ** 2 + (My - ya) ** 2) + "} \\approx " + A(AM, 2)) + " (la moitié de " + M("BC") + ").", M("\\frac{AB \\cdot AC}{2} = \\frac{" + n2 + "}{2} = " + N(n2 / 2)) + "."]),
        chk: [[(B[0] - xa) ** 2 + (B[1] - ya) ** 2, String(n2)], [(C[0] - B[0]) ** 2 + (C[1] - B[1]) ** 2, String(2 * n2)], [AM, A(AM, 2), 0.01], [n2 / 2, N(n2 / 2)]] }); },
    // L'antenne (équidistance)
    () => { let a1, a2, b1, b2, x; do { a1 = R.int(-6, 0); b1 = R.int(2, 8); a2 = R.int(1, 6); b2 = R.int(1, 6); x = (b1 * b1 + b2 * b2 - a1 * a1 - a2 * a2) / (2 * (b1 - a1)); } while (!Number.isInteger(2 * x) || x === 0 || a2 === b2);
      const PA = Math.hypot(x - a1, a2), who = pk(["Une compagnie de téléphone", "La commune", "Un fournisseur d'internet"]);
      return X({ id: "coordmp", lv: 2, titre: "L'antenne",
        q: "Dans un repère (unité : 1 km), une route rectiligne suit l'axe " + M("Ox") + ". Deux villages sont en " + M("A" + pt(a1, a2)) + " et " + M("B" + pt(b1, b2)) + ". " + who + " veut placer une antenne " + M("P(x \\,;\\, 0)") + " au bord de la route, à égale distance des deux villages.",
        parts: [{ label: "Exprime " + M("PA^2") + " et " + M("PB^2") + " en fonction de " + M("x") + ".", pts: 1 }, { label: "Résous " + M("PA^2 = PB^2") + " pour placer l'antenne.", pts: 2 }, { label: "À quelle distance des villages est-elle (au centième de km) ? Vérifie avec " + M("PB") + ".", pts: 1 }],
        sol: ul([M("PA^2 = " + (a1 ? "(x" + sg(-a1) + ")^2" : "x^2") + " + " + a2 * a2) + " ; " + M("PB^2 = (x" + sg(-b1) + ")^2 + " + b2 * b2) + ".", "En développant, " + M("x^2") + " disparaît : " + M(poly([1, -2 * a1, a1 * a1 + a2 * a2]) + " = " + poly([1, -2 * b1, b1 * b1 + b2 * b2])) + " ⟺ " + M(2 * (b1 - a1) + "x = " + N(b1 * b1 + b2 * b2 - a1 * a1 - a2 * a2)) + " ⟺ " + M("x = " + N(x)) + ", donc " + M("P" + pt(x, 0)) + ".", M("PA = \\sqrt{" + N((x - a1) ** 2 + a2 * a2) + "} \\approx " + A(PA, 2)) + " km ; " + M("PB = \\sqrt{" + N((x - b1) ** 2 + b2 * b2) + "}") + ", la même valeur ✓."]),
        chk: [[x, N(x)], [PA, A(PA, 2), 0.01], [Math.hypot(x - b1, b2), A(PA, 2), 0.01]] }); },
    // Le radar (coordonnées polaires)
    () => { const r1 = pk([8, 10, 12]), t1 = pk([20, 40, 50]), r2 = pk([6, 9]), t2 = pk([110, 130, 150]), P1 = [r1 * Math.cos(t1 * D), r1 * Math.sin(t1 * D)], P2 = [r2 * Math.cos(t2 * D), r2 * Math.sin(t2 * D)], dd = Math.hypot(P1[0] - P2[0], P1[1] - P2[1]);
      const [u, v] = pk([[-6, -8], [-8, -6], [-5, -12], [-9, -12]]), r3 = Math.hypot(u, v), t3 = 180 + deg(Math.atan(v / u));
      return X({ id: "coordmp", lv: 2, titre: "Le radar",
        q: "Le radar d'un port est à l'origine. Il repère un bateau à " + Q(r1, "km") + " dans la direction " + t1 + "° et un autre à " + Q(r2, "km") + " dans la direction " + t2 + "° (angles mesurés depuis l'axe " + M("Ox") + ", dans le sens inverse des aiguilles d'une montre).",
        parts: [{ label: "Calcule les coordonnées cartésiennes des deux bateaux (au centième).", pts: 2 }, { label: "Quelle distance sépare les deux bateaux (au centième de km) ?", pts: 1 }, { label: "Un troisième bateau est au point " + M(pt(u, v)) + ". Donne ses coordonnées polaires (angle au dixième de degré).", pts: 2 }],
        sol: ul([M("(" + r1 + "\\cos " + t1 + "° \\,;\\, " + r1 + "\\sin " + t1 + "°) \\approx (" + A(P1[0], 2) + " \\,;\\, " + A(P1[1], 2) + ")") + " et " + M("(" + A(P2[0], 2) + " \\,;\\, " + A(P2[1], 2) + ")") + ".", M("\\sqrt{(" + A(P1[0], 2) + " - (" + A(P2[0], 2) + "))^2 + (" + A(P1[1], 2) + " - " + A(P2[1], 2) + ")^2} \\approx " + A(dd, 2)) + " km.", M("r = \\sqrt{" + u * u + " + " + v * v + "} = " + r3) + " ; le point est dans le 3e quadrant, donc " + M("\\theta = 180° + \\arctan\\frac{" + v + "}{" + u + "} \\approx " + A(t3, 1) + "°") + " (et non " + A(t3 - 180, 1).replace("{,}", ",") + "°)."]),
        chk: [[dd, A(dd, 2), 0.02], [r3, String(r3)], [t3, A(t3, 1), 0.1]] }); },
    // Le parallélogramme (vecteurs)
    () => { let A0, B, C, Dp, ab, bc; do { A0 = [R.int(-4, 0), R.int(-3, 1)]; B = [A0[0] + R.int(3, 6), A0[1] + R.int(-1, 2)]; C = [B[0] + R.int(-1, 3), B[1] + R.int(2, 5)]; Dp = [A0[0] + C[0] - B[0], A0[1] + C[1] - B[1]]; ab = [B[0] - A0[0], B[1] - A0[1]]; bc = [C[0] - B[0], C[1] - B[1]]; } while (ab[0] * bc[0] + ab[1] * bc[1] === 0 || bc[0] === 0 || ab[1] === 0 || Dp[0] === 0 || Dp[1] === 0);
      const Ox = (A0[0] + C[0]) / 2, Oy = (A0[1] + C[1]) / 2, lab = Math.hypot(...ab), lbc = Math.hypot(...bc), per = 2 * (lab + lbc);
      return X({ id: "vectmp", lv: 1, titre: "Le parallélogramme",
        q: "On donne " + M("A" + pt(...A0)) + ", " + M("B" + pt(...B)) + " et " + M("C" + pt(...C)) + ".",
        parts: [{ label: "Calcule les composantes de " + M("\\overrightarrow{AB}") + " et de " + M("\\overrightarrow{BC}") + ".", pts: 1 }, { label: "Trouve le point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme.", pts: 2 }, { label: "Calcule le centre du parallélogramme de deux façons (milieu de " + M("[AC]") + ", milieu de " + M("[BD]") + ").", pts: 1 }, { label: "Calcule son périmètre (au centième). Est-ce un rectangle ?", pts: 2 }],
        sol: ul([M("\\overrightarrow{AB} = " + vc(...ab)) + ", " + M("\\overrightarrow{BC} = " + vc(...bc)) + ".", M("\\overrightarrow{AD} = \\overrightarrow{BC}") + ", donc " + M("D = A + \\overrightarrow{BC} = " + pt(...Dp)) + ".", "Milieu de " + M("[AC]") + " : " + M(pt(Ox, Oy)) + " ; milieu de " + M("[BD]") + " : " + M(pt((B[0] + Dp[0]) / 2, (B[1] + Dp[1]) / 2)) + ", le même : les diagonales se coupent en leur milieu.", M("AB = \\sqrt{" + (ab[0] ** 2 + ab[1] ** 2) + "}") + ", " + M("BC = \\sqrt{" + (bc[0] ** 2 + bc[1] ** 2) + "}") + ", périmètre " + M("\\approx " + A(per, 2)) + ". " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{BC} = " + (ab[0] * bc[0] + ab[1] * bc[1])) + " ≠ 0 : pas de rectangle."]),
        chk: [[Dp[0], String(Dp[0])], [Dp[1], String(Dp[1])], [per, A(per, 2), 0.01]] }); },
    // L'angle droit caché (produit scalaire)
    () => { let V, u, w; do { V = [R.int(-3, 3), R.int(-3, 3)]; const [p, q] = pk([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3]]); u = [p * pk([1, -1]), q * pk([1, -1])]; const k = pk([1, 2]); w = [-u[1] * k, u[0] * k]; } while (V[0] === 0 && V[1] === 0);
      const pts0 = [V, [V[0] + u[0], V[1] + u[1]], [V[0] + w[0], V[1] + w[1]]], rot = R.int(0, 2), P = [pts0[rot % 3], pts0[(rot + 1) % 3], pts0[(rot + 2) % 3]], nm = ["A", "B", "C"], iR = (3 - rot) % 3, right = nm[iR];
      const dot3 = (i) => { const O = P[i], a = P[(i + 1) % 3], b = P[(i + 2) % 3]; return (a[0] - O[0]) * (b[0] - O[0]) + (a[1] - O[1]) * (b[1] - O[1]); };
      const ds = [0, 1, 2].map(dot3), area = Math.abs(u[0] * w[1] - u[1] * w[0]) / 2, j = (iR + 1) % 3, O = P[j], a = P[(j + 1) % 3], b = P[(j + 2) % 3], na = (a[0] - O[0]) ** 2 + (a[1] - O[1]) ** 2, nb2 = (b[0] - O[0]) ** 2 + (b[1] - O[1]) ** 2;
      const ang = deg(Math.acos(ds[j] / Math.sqrt(na * nb2)));
      const lab3 = ["\\overrightarrow{AB} \\cdot \\overrightarrow{AC}", "\\overrightarrow{BC} \\cdot \\overrightarrow{BA}", "\\overrightarrow{CA} \\cdot \\overrightarrow{CB}"];
      return X({ id: "scalmp", lv: 2, titre: "L'angle droit caché",
        q: "On donne " + M("A" + pt(...P[0])) + ", " + M("B" + pt(...P[1])) + " et " + M("C" + pt(...P[2])) + ".",
        parts: [{ label: "Calcule " + M(lab3[0]) + ", " + M(lab3[1]) + " et " + M(lab3[2]) + ".", pts: 2 }, { label: "Le triangle est-il rectangle ? En quel sommet ?", pts: 1 }, { label: "Calcule son aire.", pts: 1 }, { label: "Calcule l'angle en " + M(nm[j]) + " (au dixième de degré).", pts: 2 }],
        sol: ul([ds.map((v, i) => M(lab3[i] + " = " + v)).join(" ; ") + ".", "Le produit scalaire en " + M(right) + " est nul : les côtés issus de " + M(right) + " sont orthogonaux, le triangle est rectangle en " + M(right) + ".", "Aire = demi-produit des côtés de l'angle droit, " + M(N(area)) + ".", M("\\cos \\alpha = \\frac{" + ds[j] + "}{\\sqrt{" + na + "} \\cdot \\sqrt{" + nb2 + "}}") + ", " + M("\\alpha \\approx " + A(ang, 1) + "°") + "."]),
        chk: [[ds[j], String(ds[j])], [area, N(area)], [ang, A(ang, 1), 0.1]] }); },
    // Le travail d'une force (produit scalaire)
    () => { const K = pk(["Un enfant tire une luge", "Un ouvrier tire un chariot", "Un cheval tire une péniche le long d'un canal"]), big = /cheval/.test(K) /* 26.11 (vraisemblance) : un cheval tire une péniche avec 400 à 1000 N, pas 60 N */, Fx = big ? pk([400, 500, 600, 800]) : /luge/.test(K) ? pk([40, 60, 80]) : pk([60, 80, 120]), Fy = big ? pk([150, 200, 300]) : pk([30, 45, 60]), dx = pk([20, 25, 40]), dx2 = pk([12, 15]), dy2 = -pk([2, 3, 4]), W1 = Fx * dx, nF = Math.hypot(Fx, Fy), al = deg(Math.atan(Fy / Fx)), W2 = Fx * dx2 + Fy * dy2;
      return X({ id: "scalmp", lv: 2, titre: "Le travail d'une force",
        q: K + " avec une force " + M("\\vec{F} = " + vc(Fx, Fy)) + " (en N). Le déplacement est " + M("\\vec{d} = " + vc(dx, 0)) + " (en m). Le travail de la force (en joules) vaut " + M("W = \\vec{F} \\cdot \\vec{d}") + ".",
        parts: [{ label: "Calcule le travail " + M("W") + ".", pts: 1 }, { label: "Calcule " + M("\\|\\vec{F}\\|") + " et l'angle entre " + M("\\vec{F}") + " et " + M("\\vec{d}") + " (au dixième de degré).", pts: 2 }, { label: "Vérifie que " + M("W = \\|\\vec{F}\\| \\cdot \\|\\vec{d}\\| \\cdot \\cos\\alpha") + ".", pts: 1 }, { label: "Avec la même force, le déplacement devient " + M(vc(dx2, dy2)) + ". Calcule le nouveau travail.", pts: 1 }],
        sol: ul([M("W = " + Fx + " \\cdot " + dx + " + " + Fy + " \\cdot 0 = " + N(W1)) + " J.", M("\\|\\vec{F}\\| = \\sqrt{" + Fx + "^2 + " + Fy + "^2} \\approx " + A(nF, 2)) + " N ; " + M("\\cos\\alpha = \\frac{" + N(W1) + "}{" + A(nF, 2) + " \\cdot " + dx + "}") + ", " + M("\\alpha \\approx " + A(al, 1) + "°") + ".", M(A(nF, 2) + " \\cdot " + dx + " \\cdot \\cos " + A(al, 1) + "° \\approx " + N(W1)) + " ✓.", M(Fx + " \\cdot " + dx2 + " + " + Fy + " \\cdot " + par(dy2) + " = " + N(W2)) + " J."]),
        chk: [[W1, N(W1)], [nF, A(nF, 2), 0.01], [al, A(al, 1), 0.1], [W2, N(W2)]] }); },
    // Le drone (droite paramétrique dans l'espace)
    () => { const [v, nv] = pk([[[2, 2, 1], 3], [[1, 2, 2], 3], [[2, 1, 2], 3], [[2, 3, 6], 7], [[6, 2, 3], 7], [[4, 4, 2], 6]]), A0 = [R.nz(-5, 5), R.nz(-5, 5), pk([2, 5, 10])], t1 = pk([4, 5, 6]), tZ = pk([8, 10, 12]), Z = A0[2] + v[2] * tZ, tp = pk([3, 7]), on = R.rand() < 0.5;
      const Pq = [A0[0] + tp * v[0], A0[1] + tp * v[1] + (on ? 0 : pk([1, 2])), A0[2] + tp * v[2]], at = (t) => A0.map((c, i) => c + t * v[i]);
      return X({ id: "droiteparam", lv: 2, titre: "Le drone",
        q: "Un drone décolle d'une plateforme en " + M("A" + pt(...A0)) + " (en m) et vole en ligne droite : chaque seconde, il se déplace de " + M("\\vec{v} = " + vc(...v)) + ".",
        parts: [{ label: "Écris une représentation paramétrique de sa trajectoire (paramètre " + M("t") + " en secondes).", pts: 1 }, { label: "Où est le drone après " + t1 + " s ? Quelle distance a-t-il parcourue ?", pts: 2 }, { label: "Quand atteint-il l'altitude " + Q(Z, "m") + " ? Où est-il alors ?", pts: 1 }, { label: "Passe-t-il par le point " + M("P" + pt(...Pq)) + " ?", pts: 1 }],
        sol: ul([M("x = " + lin1(A0[0], v[0], "t")) + ", " + M("y = " + lin1(A0[1], v[1], "t")) + ", " + M("z = " + lin1(A0[2], v[2], "t")), M(pt(...at(t1))) + " ; " + M("\\|\\vec{v}\\| = \\sqrt{" + v.map((c) => c * c).join(" + ") + "} = " + nv) + " m par seconde, donc " + M(t1 + " \\cdot " + nv + " = " + t1 * nv) + " m.", M(lin1(A0[2], v[2], "t") + " = " + Z) + " ⟺ " + M("t = " + tZ) + " s ; point " + M(pt(...at(tZ))) + ".", "Avec " + M("x") + ", " + M("t = " + tp) + " ; avec " + M("y") + ", " + (on ? M("t = " + tp) + " aussi ; avec " + M("z") + ", " + M("t = " + tp) + ". Oui, pour " + M("t = " + tp) + " s." : M("t = " + FR((Pq[1] - A0[1]) / v[1])) + " ≠ " + tp + ". Non, " + M("P") + " n'est pas sur la trajectoire.")]),
        chk: [[t1 * nv, String(t1 * nv)], [(Z - A0[2]) / v[2], String(tZ)], [(Pq[0] - A0[0]) / v[0], String(tp)]] }); },
    // Deux routes maritimes (intersection de droites paramétriques)
    () => { let I, u, v; do { I = [R.int(-3, 6), R.int(-2, 6)]; u = [R.nz(-3, 3), R.nz(-3, 3)]; v = [R.nz(-3, 3), R.nz(-3, 3)]; } while (u[0] * v[1] - u[1] * v[0] === 0 || u[0] * v[0] + u[1] * v[1] === 0 || I[0] === 0 || I[1] === 0);
      const t0 = pk([2, 3, 4]), s0 = pk([2, 3, 5]), A0 = [I[0] - t0 * u[0], I[1] - t0 * u[1]], B0 = [I[0] - s0 * v[0], I[1] - s0 * v[1]], ca = Math.abs(u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v)), ang = deg(Math.acos(ca));
      const eq = (P, w, p) => M("x = " + lin1(P[0], w[0], p)) + ", " + M("y = " + lin1(P[1], w[1], p));
      return X({ id: "droiteparam", lv: 3, titre: "Deux routes maritimes",
        q: "Deux bateaux suivent des routes rectilignes (unités : km et heures). Le premier, " + eq(A0, u, "t") + ". Le second, " + eq(B0, v, "s") + ".",
        parts: [{ label: "Les routes sont-elles parallèles ? Justifie avec les vecteurs directeurs.", pts: 1 }, { label: "Calcule le point d'intersection des deux routes.", pts: 2 }, { label: "Les deux bateaux passent-ils au point d'intersection au même instant ?", pts: 1 }, { label: "Calcule l'angle aigu entre les deux routes (au dixième de degré).", pts: 1 }],
        sol: ul(["Vecteurs directeurs " + M(vc(...u)) + " et " + M(vc(...v)) + " : pas multiples l'un de l'autre (" + M(u[0] + " \\cdot " + par(v[1]) + " - " + par(u[1]) + " \\cdot " + par(v[0]) + " = " + (u[0] * v[1] - u[1] * v[0])) + " ≠ 0), donc pas parallèles.", "Deux paramètres différents : " + M(lin1(A0[0], u[0], "t") + " = " + lin1(B0[0], v[0], "s")) + " et " + M(lin1(A0[1], u[1], "t") + " = " + lin1(B0[1], v[1], "s")) + ". On trouve " + M("t = " + t0) + " et " + M("s = " + s0) + ", point " + M(pt(...I)) + ".", t0 === s0 ? "Oui, " + M("t = s = " + t0) + " : risque de collision !" : "Non : le premier y passe à " + M("t = " + t0) + " h, le second à " + M("s = " + s0) + " h.", M("\\cos\\alpha = \\frac{|" + (u[0] * v[0] + u[1] * v[1]) + "|}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\cdot \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + A(ang, 1) + "°") + "."]),
        chk: [[t0, String(t0)], [s0, String(s0)], [A0[0] + t0 * u[0], String(I[0])], [B0[1] + s0 * v[1], String(I[1])], [ang, A(ang, 1), 0.1]] }); },
    // Ajouts du 24.11 (agent mp4plus) : projection orthogonale, position relative de deux droites, produit vectoriel.
    // Le raccordement le plus court (projection orthogonale, distance point-droite)
    () => { let d, A0, lam, mu, H, P; do { d = pk([[3, 4], [4, 3], [1, 2], [2, 1], [4, -3], [3, -4], [1, 3]]); A0 = [R.int(-4, 2), R.int(-4, 2)]; lam = pk([1, 2, 3]); mu = pk([1, 2, -1, -2]); H = [A0[0] + lam * d[0], A0[1] + lam * d[1]]; P = [H[0] - mu * d[1], H[1] + mu * d[0]]; } while (H.includes(0) || P.includes(0));
      const n2 = d[0] ** 2 + d[1] ** 2, AP = [P[0] - A0[0], P[1] - A0[1]], HP = [P[0] - H[0], P[1] - H[1]], dist = Math.abs(mu) * Math.sqrt(n2), c = pk([65, 80, 95, 120]), cost = dist * c, dPA = Math.hypot(...AP);
      const K = pk([["Une maison", "la conduite d'eau", "raccorder la maison"], ["Un chalet", "la ligne électrique", "relier le chalet"], ["Une ferme", "le câble de fibre optique", "raccorder la ferme"]]);
      return X({ id: "projmp", lv: 2, titre: "Le raccordement le plus court",
        q: K[0] + " est en " + M("P" + pt(...P)) + ". " + cap(K[1]) + " suit la droite passant par " + M("A" + pt(...A0)) + " de vecteur directeur " + M("\\vec{d} = " + vc(...d)) + " (unités : m). On veut " + K[2] + " par le chemin le plus court.",
        parts: [{ label: "Calcule " + M("\\overrightarrow{AP}") + " et le paramètre " + M("t = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}") + ".", pts: 2 }, { label: "Donne le pied " + M("H = A + t\\,\\vec{d}") + " de la perpendiculaire et vérifie que " + M("\\overrightarrow{HP} \\cdot \\vec{d} = 0") + ".", pts: 1 }, { label: "Calcule la longueur " + M("PH") + " du raccordement (au centième).", pts: 1 }, { label: "Le raccordement coûte " + Q(c, "CHF") + " par mètre. Combien coûte-t-il ? Combien coûterait un raccordement direct de " + M("P") + " à " + M("A") + " ?", pts: 2 }],
        sol: ul([M("\\overrightarrow{AP} = " + vc(...AP)) + " ; " + M("\\overrightarrow{AP} \\cdot \\vec{d} = " + (AP[0] * d[0] + AP[1] * d[1])) + ", " + M("\\|\\vec{d}\\|^2 = " + n2) + ", donc " + M("t = " + lam) + ".", M("H = " + pt(...H)) + " ; " + M("\\overrightarrow{HP} = " + vc(...HP)) + " et " + M(par(HP[0]) + " \\cdot " + par(d[0]) + " + " + par(HP[1]) + " \\cdot " + par(d[1]) + " = 0") + " ✓.", M("PH = \\sqrt{" + par(HP[0]) + "^2 + " + par(HP[1]) + "^2} = \\sqrt{" + mu * mu * n2 + "} " + eqA(dist)) + " m.", M(A(dist, 2) + " \\cdot " + c + " " + eqA(cost)) + " CHF ; en direct, " + M("PA = \\sqrt{" + (AP[0] ** 2 + AP[1] ** 2) + "} " + eqA(dPA)) + " m, soit environ " + M(A(dPA * c, 2)) + " CHF : plus cher, car " + M("[PA]") + " est oblique."]),
        chk: [[lam, String(lam)], [H[0], String(H[0])], [H[1], String(H[1])], [dist, A(dist, 2), 0.01], [cost, A(cost, 2), 0.01]] }); },
    // Deux tunnels (position relative de deux droites de l'espace : sécantes ou gauches)
    () => { let I, u, v, t0, s0, zB; do { I = [R.int(-3, 4), R.int(-3, 4), R.int(1, 6)]; u = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-2, 2)]; v = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-2, 2)]; t0 = pk([1, 2, 3]); s0 = pk([1, 2, -1]); zB = I[2] - s0 * v[2]; } while (u[0] * v[1] - u[1] * v[0] === 0 || zB === 0);
      const on = R.rand() < 0.5, gap = on ? 0 : pk([1, 2, -1, -2]), A0 = I.map((x, i) => x - t0 * u[i]), B0 = I.map((x, i) => x - s0 * v[i]); B0[2] += gap; const zG = I[2] + gap;
      const K = pk([["Deux tunnels en construction", "le premier tunnel", "le second tunnel", "km"], ["Deux faisceaux laser d'un spectacle", "le premier faisceau", "le second faisceau", "m"], ["Deux câbles tendus au-dessus d'une vallée", "le premier câble", "le second câble", "hm"]]);
      const eq = (P, w, p) => M("x = " + lin1(P[0], w[0], p)) + ", " + M("y = " + lin1(P[1], w[1], p)) + ", " + M("z = " + lin1(P[2], w[2], p));
      return X({ id: "posdroites", lv: 3, titre: K[0],
        q: K[0] + " sont modélisés par des droites (unités : " + K[3] + "). Pour " + K[1] + " : " + eq(A0, u, "t") + ". Pour " + K[2] + " : " + eq(B0, v, "s") + ".",
        parts: [{ label: "Les deux droites sont-elles parallèles ? Justifie avec les vecteurs directeurs.", pts: 1 }, { label: "Résous le système formé par les équations en " + M("x") + " et en " + M("y") + " (inconnues " + M("t") + " et " + M("s") + ").", pts: 2 }, { label: "Compare les cotes " + M("z") + " pour ces valeurs. Les droites sont-elles sécantes ou gauches ?", pts: 1 }, { label: on ? "Donne le point commun et vérifie-le avec les deux représentations." : "Quelle cote de départ faudrait-il au second (à la place de " + M(B0[2]) + ") pour que les droites se coupent ?", pts: 1 }],
        sol: ul(["Vecteurs directeurs " + M(vc(...u)) + " et " + M(vc(...v)) + " : pas colinéaires (" + M(par(u[0]) + " \\cdot " + par(v[1]) + " - " + par(u[1]) + " \\cdot " + par(v[0]) + " = " + (u[0] * v[1] - u[1] * v[0])) + " ≠ 0), donc pas parallèles.",
          M(lin1(A0[0], u[0], "t") + " = " + lin1(B0[0], v[0], "s")) + " et " + M(lin1(A0[1], u[1], "t") + " = " + lin1(B0[1], v[1], "s")) + " donnent " + M("t = " + t0) + " et " + M("s = " + s0) + ".",
          "Première droite : " + M("z = " + I[2]) + " pour " + M("t = " + t0) + " ; seconde : " + M("z = " + zG) + " pour " + M("s = " + s0) + ". " + (on ? "Les cotes sont égales : les droites sont sécantes." : "Les cotes diffèrent (écart " + M(Math.abs(gap)) + ") : aucun point commun, et pas parallèles. Les droites sont gauches."),
          on ? "Point commun " + M(pt(...I)) + " : on le retrouve avec " + M("t = " + t0) + " dans la première et avec " + M("s = " + s0) + " dans la seconde." : "Il faut " + M("c" + sg(s0 * v[2]) + " = " + I[2]) + ", donc " + M("c = " + zB) + " : la cote de départ serait " + M(zB) + " au lieu de " + M(B0[2]) + "."]),
        chk: [[t0, String(t0)], [s0, String(s0)], on ? [I[2], String(I[2])] : [zB, String(zB)]] }); },
    // La voile d'ombrage (produit vectoriel : vecteur normal, aire dans l'espace)
    () => { let A0, u, v, w; do { A0 = [R.int(0, 3), R.int(0, 3), pk([2, 3, 4])]; u = [R.int(2, 5), R.int(-1, 2), R.int(-1, 1)]; v = [R.int(-1, 2), R.int(2, 5), R.int(-1, 1)]; w = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; } while (w.filter((x) => x).length < 2);
      const B = A0.map((x, i) => x + u[i]), C = A0.map((x, i) => x + v[i]), nw = Math.hypot(...w), ar = nw / 2, c = pk([18, 24, 32]), cost = ar * 1.15 * c, K = pk(["Une voile d'ombrage triangulaire est tendue", "Un auvent triangulaire est fixé", "Un panneau publicitaire triangulaire est accroché"]);
      return X({ id: "pvectmp", lv: 2, titre: "La voile d'ombrage",
        q: K + " entre les points " + M("A" + pt(...A0)) + ", " + M("B" + pt(...B)) + " et " + M("C" + pt(...C)) + " (en m).",
        parts: [{ label: "Calcule " + M("\\overrightarrow{AB}") + ", " + M("\\overrightarrow{AC}") + " et le produit vectoriel " + M("\\vec{n} = \\overrightarrow{AB} \\times \\overrightarrow{AC}") + ".", pts: 2 }, { label: "Vérifie que " + M("\\vec{n}") + " est orthogonal à " + M("\\overrightarrow{AB}") + " et à " + M("\\overrightarrow{AC}") + ".", pts: 1 }, { label: "Calcule l'aire de la toile (au centième).", pts: 1 }, { label: "La toile coûte " + Q(c, "CHF") + " le m², et il faut 15 % de toile en plus pour les ourlets. Combien coûte la toile ?", pts: 1 }],
        sol: ul([M("\\overrightarrow{AB} = " + vc(...u)) + ", " + M("\\overrightarrow{AC} = " + vc(...v)) + ", " + M("\\vec{n} = " + vc(...w)) + ".", M("\\vec{n} \\cdot \\overrightarrow{AB} = " + w.map((x, i) => par(x) + " \\cdot " + par(u[i])).join(" + ") + " = 0") + " et " + M("\\vec{n} \\cdot \\overrightarrow{AC} = 0") + " ✓.", "Aire du triangle : " + M("\\frac{1}{2}\\|\\vec{n}\\| = \\frac{1}{2}\\sqrt{" + w.map((x) => x * x).reduce((s, x) => s + x, 0) + "} " + eqA(ar)) + " m².", M(A(ar, 2) + " \\cdot 1{,}15 \\cdot " + c + " " + eqA(cost)) + " CHF."]),
        chk: [[ar, A(ar, 2), 0.01], [cost, A(cost, 2), 0.01]] }); },
  ];
  const RAISONG = [
    () => VF("vectmp", 1, [["« Le vecteur " + M("\\overrightarrow{AB}") + " a pour composantes " + M("A - B") + ". »", false, M("\\overrightarrow{AB} = B - A") + " (arrivée moins départ)."],
      ["« Si " + M("\\vec{u} \\cdot \\vec{v} = 0") + " (vecteurs non nuls), ils sont orthogonaux. »", true, M("\\cos\\alpha = 0") + ", donc " + M("\\alpha = 90°") + "."],
      ["« Le produit scalaire de deux vecteurs est un vecteur. »", false, "C'est un nombre : " + M("x_1x_2 + y_1y_2") + "."],
      ["« " + M(vc(2, -4)) + " et " + M(vc(-3, 6)) + " sont colinéaires. »", true, M(vc(-3, 6) + " = -1{,}5 \\cdot " + vc(2, -4)) + "."],
      ["« Le point " + M("(5 \\,;\\, 2)") + " est sur la droite " + M("x = 1 + 2t") + ", " + M("y = 4 - t") + ". »", true, M("t = 2") + " donne " + M("x = 5") + " et " + M("y = 2") + "."],
      ["« Si " + M("\\vec{u} \\cdot \\vec{v} \\lt 0") + ", l'angle entre " + M("\\vec{u}") + " et " + M("\\vec{v}") + " est obtus. »", true, M("\\cos\\alpha \\lt 0") + "."],
      ["« La norme de " + M(vc(3, 4)) + " vaut 7. »", false, M("\\sqrt{9 + 16} = 5") + "."]]),
    () => { let A0, B; do { A0 = [R.int(-5, 5), R.int(-5, 5)]; B = [R.int(-5, 5), R.int(-5, 5)]; } while (A0[0] === B[0] || A0[1] === B[1]); const w = RX.who(), ab = [B[0] - A0[0], B[1] - A0[1]], n = ab[0] ** 2 + ab[1] ** 2;
      return X({ id: "vectmp", lv: 1, titre: "Trouve l'erreur",
        q: "Avec " + M("A" + pt(...A0)) + " et " + M("B" + pt(...B)) + ", " + w + " écrit : « " + M("\\overrightarrow{AB} = " + vc(A0[0] - B[0], A0[1] - B[1])) + " ».",
        parts: [{ label: "Quelle est l'erreur ? Corrige " + M("\\overrightarrow{AB}") + " et vérifie que " + M("A + \\overrightarrow{AB} = B") + ".", pts: 1 }, { label: "Calcule " + M("\\|\\overrightarrow{AB}\\|") + " (au centième).", pts: 1 }],
        sol: ul(["C'est " + M("A - B") + " qui a été calculé : " + M("\\overrightarrow{AB} = B - A = " + vc(...ab)) + ", et " + M(pt(...A0) + " + " + vc(...ab) + " = " + pt(...B)) + " ✓.", M("\\sqrt{" + n + "} \\approx " + A(Math.sqrt(n), 2)) + ". La norme est la même pour " + M("\\overrightarrow{BA}") + "."]),
        chk: [[Math.sqrt(n), A(Math.sqrt(n), 2), 0.01]] }); },
    () => { const x0 = R.nz(-4, 4), y0 = R.nz(-4, 4), a = R.nz(-3, 3), b = R.nz(-3, 3), w = RX.who(), P = [x0 + 2 * a, y0 + 3 * b];
      return X({ id: "droiteparam", lv: 2, titre: "Trouve l'erreur",
        q: "La droite " + M("d") + " a pour équations " + M("x = " + lin1(x0, a, "t")) + ", " + M("y = " + lin1(y0, b, "t")) + ". " + w + " affirme : « Pour " + M("P" + pt(...P)) + ", l'abscisse donne " + M("t = 2") + ", donc " + M("P") + " est sur " + M("d") + ". »",
        parts: [{ label: "Qu'est-ce qui n'a pas été vérifié ?", pts: 1 }, { label: M("P") + " est-il sur " + M("d") + " ? Justifie.", pts: 1 }],
        sol: ul(["Le même " + M("t") + " doit convenir pour toutes les coordonnées.", "Avec " + M("y") + ", " + M(lin1(y0, b, "t") + " = " + P[1]) + " donne " + M("t = 3") + " ≠ 2 : " + M("P") + " n'est pas sur " + M("d") + "."]),
        chk: [[(P[0] - x0) / a, "2"], [(P[1] - y0) / b, "3"]] }); },
    // Ajouts du 24.11 (agent mp4plus)
    () => { const [a, b, c] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]), v = [a * pk([1, -1]), b * pk([1, -1])], lam = pk([2, 3, -2, -1]), mu = pk([1, -1, 2]), u = [lam * v[0] - mu * v[1], lam * v[1] + mu * v[0]], w = RX.who(), uv = lam * c * c, p = [lam * v[0], lam * v[1]], r = [u[0] - p[0], u[1] - p[1]];
      return X({ id: "projmp", lv: 2, titre: "Trouve l'erreur",
        q: w + " calcule le vecteur projeté de " + M("\\vec{u} = " + vc(...u)) + " sur " + M("\\vec{v} = " + vc(...v)) + " et écrit : « " + M("\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|} \\, \\vec{v} = " + vc(lam * c * v[0], lam * c * v[1])) + " ».",
        parts: [{ label: "Calcule " + M("\\vec{u} \\cdot \\vec{v}") + " et " + M("\\|\\vec{v}\\|") + ".", pts: 1 }, { label: "Quelle est l'erreur ? Donne le bon vecteur projeté.", pts: 1 }, { label: "Vérifie que " + M("\\vec{u} - \\vec{p}") + " est orthogonal à " + M("\\vec{v}") + ".", pts: 1 }],
        sol: ul([M("\\vec{u} \\cdot \\vec{v} = " + uv) + ", " + M("\\|\\vec{v}\\| = " + c) + ".", "Pour le vecteur projeté, on divise par " + M("\\|\\vec{v}\\|^2 = " + c * c) + " (diviser par " + M("\\|\\vec{v}\\|") + " donne la longueur projetée, " + M(N(Math.abs(lam) * c)) + ") : " + M("\\vec{p} = \\frac{" + uv + "}{" + c * c + "} \\vec{v} = " + vc(...p)) + ". Son résultat est " + M(c) + " fois trop long.", M("\\vec{u} - \\vec{p} = " + vc(...r)) + " et " + M(par(r[0]) + " \\cdot " + par(v[0]) + " + " + par(r[1]) + " \\cdot " + par(v[1]) + " = 0") + " ✓."]),
        chk: [[uv, String(uv)], [p[0], String(p[0])], [p[1], String(p[1])]] }); },
    () => VF("posdroites", 2, [["« Deux droites de l'espace sans point commun sont parallèles. »", false, "Elles peuvent être gauches : ni parallèles, ni sécantes."],
      ["« Si les vecteurs directeurs sont colinéaires, les droites sont parallèles ou confondues. »", true, "Elles ont la même direction ; confondues si elles ont en plus un point commun."],
      ["« " + M(vc(1, 2, -1)) + " et " + M(vc(-2, -4, 2)) + " dirigent des droites parallèles (ou confondues). »", true, M(vc(-2, -4, 2) + " = -2 \\cdot " + vc(1, 2, -1)) + "."],
      ["« Dans le plan, deux droites non parallèles sont sécantes. »", true, "Dans le plan, il n'y a pas de droites gauches."],
      ["« Le vecteur projeté de " + M("\\vec{u}") + " sur " + M("\\vec{v}") + " est parallèle à " + M("\\vec{u}") + ". »", false, "Il est parallèle à " + M("\\vec{v}") + " : " + M("\\vec{p} = k\\,\\vec{v}") + "."],
      ["« " + M("\\vec{u} \\times \\vec{v} = \\vec{v} \\times \\vec{u}") + ". »", false, "Ils sont opposés : " + M("\\vec{v} \\times \\vec{u} = -\\vec{u} \\times \\vec{v}") + "."],
      ["« " + M("\\|\\vec{u} \\times \\vec{v}\\|") + " est l'aire du triangle construit sur " + M("\\vec{u}") + " et " + M("\\vec{v}") + ". »", false, "C'est l'aire du parallélogramme ; le triangle en est la moitié."],
      ["« Si " + M("\\vec{u} \\times \\vec{v} = \\vec{0}") + " (vecteurs non nuls), " + M("\\vec{u}") + " et " + M("\\vec{v}") + " sont colinéaires. »", true, "L'aire du parallélogramme est nulle : il est aplati, les vecteurs ont la même direction."]]),
  ];

  // ===================== MP 4e · H–J. Inéquations, fonctions, polynômes, sinusoïdales =====================
  const EXF = [
    // Deux abonnements (inéquation linéaire)
    () => { const K = pk([["Deux abonnements de téléphone", "minutes", "min", "par minute", "l'opérateur A", "l'opérateur B"], ["Deux locations de vélo électrique", "heures", "h", "de l'heure", "le loueur A", "le loueur B"], ["Deux parkings", "heures", "h", "de l'heure", "le parking A", "le parking B"]]);
      const fA = pk([10, 12, 15]), dF = pk([3, 5, 6]), rB = pk([0.15, 0.2, 0.5]), dr = pk([0.05, 0.1]), fB = fA + dF, rA = r6(rB + dr), ts = r6(dF / dr), bud = r6(fA + rA * pk([20, 30, 40]) + pk([0.5, 1.2])), tmax = Math.floor((bud - fA) / rA + 1e-9);
      return X({ id: "ineqmp", lv: 1, titre: K[0],
        q: cap(K[4]) + " : " + mo(fA) + " par mois, puis " + mo(rA) + " " + K[3] + ". " + cap(K[5]) + " : " + mo(fB) + " par mois, puis " + mo(rB) + " " + K[3] + ". On note " + M("t") + " le nombre " + de(K[1]) + " par mois.",
        parts: [{ label: "Écris les deux coûts mensuels " + M("A(t)") + " et " + M("B(t)") + ".", pts: 1 }, { label: "Résous l'inéquation " + M("A(t) \\lt B(t)") + ". Quand " + K[4] + " est-il le plus avantageux ?", pts: 2 }, { label: "Avec " + K[4] + ", combien " + de(K[1]) + " entières au maximum peut-on payer avec " + mo(bud) + " par mois ?", pts: 1 }],
        sol: ul([M("A(t) = " + fA + " + " + N(rA) + "t") + " ; " + M("B(t) = " + fB + " + " + N(rB) + "t") + ".", M(fA + " + " + N(rA) + "t \\lt " + fB + " + " + N(rB) + "t") + " ⟺ " + M(N(dr) + "t \\lt " + dF) + " ⟺ " + M("t \\lt " + N(ts)) + " : jusqu'à " + tx(ts) + " " + K[2] + " (au-delà, " + K[5] + " est plus avantageux).", M(fA + " + " + N(rA) + "t \\leq " + N(bud)) + " ⟺ " + M("t \\leq \\frac{" + N(bud - fA) + "}{" + N(rA) + "} \\approx " + A((bud - fA) / rA, 2)) + ", donc au maximum " + tmax + " " + K[2] + "."]),
        chk: [[dF / dr, N(ts)], [tmax, String(tmax)]] }); },
    // Le bénéfice (inéquation du 2e degré, tableau des signes)
    () => { const r1 = R.int(10, 20), r2 = r1 + pk([10, 14, 20, 24, 30]), c = pk([1, 2, 5]), m = (r1 + r2) / 2, Bm = c * (m - r1) * (r2 - m), obj = pk(["lampes", "sacs en cuir", "tabourets", "horloges"]);
      return X({ id: "ineqmp", lv: 2, titre: "Le bénéfice",
        q: "Un atelier fabrique et vend des " + obj + ". Pour " + M("q") + " pièces vendues par semaine, son bénéfice (en CHF) est " + M("B(q) = " + poly([-c, c * (r1 + r2), -c * r1 * r2], "q")) + ".",
        parts: [{ label: "Montre que " + M("B(q) = " + (c === 1 ? "-" : "-" + c) + "(q - " + r1 + ")(q - " + r2 + ")") + " et donne les zéros de " + M("B") + ".", pts: 1 }, { label: "Dresse le tableau des signes et résous " + M("B(q) > 0") + ".", pts: 2 }, { label: "Combien de quantités entières sont rentables ?", pts: 1 }, { label: "Quel est le bénéfice maximal ? Pour combien de pièces ?", pts: 1 }],
        sol: ul(["On développe " + M("(q - " + r1 + ")(q - " + r2 + ") = " + poly([1, -(r1 + r2), r1 * r2], "q")) + (c === 1 ? " et on change tous les signes." : " et on multiplie par " + M("-" + c) + ".") + " Zéros : " + M(r1) + " et " + M(r2) + ".", "Coefficient de " + M("q^2") + " négatif : " + M("B") + " est positif entre ses zéros, " + M("S = \\,]" + r1 + " \\,;\\, " + r2 + "[") + ".", "De " + (r1 + 1) + " à " + (r2 - 1) + " pièces : " + (r2 - r1 - 1) + " quantités.", "Au milieu des zéros, " + M("q = " + m) + " : " + M("B(" + m + ") = " + N(Bm)) + " CHF."]),
        chk: [[r2 - r1 - 1, String(r2 - r1 - 1)], [-c * m * m + c * (r1 + r2) * m - c * r1 * r2, N(Bm)]] }); },
    // La boîte sans couvercle (polynôme de degré 3, Horner)
    () => { const [a, x0] = pk([[12, 1], [12, 3], [12, 4], [18, 2], [18, 5], [24, 2], [24, 5], [24, 7]]), V0 = x0 * (a - 2 * x0) ** 2, sd = Math.sqrt(x0 * (2 * a - 3 * x0)), u1 = (a - x0 - sd) / 2, u2 = (a - x0 + sd) / 2, q1 = 4 * x0 - 4 * a, q0 = a * a - 4 * a * x0 + 4 * x0 * x0;
      const mat = pk(["une plaque de carton carrée", "une feuille de tôle carrée"]);
      return X({ id: "polymp", lv: 3, titre: "La boîte sans couvercle",
        q: "Dans " + mat + " de " + Q(a, "cm") + " de côté, on découpe aux quatre coins un carré de côté " + M("x") + " (en cm), puis on relève les bords pour former une boîte sans couvercle. On veut une boîte de " + Q(V0, "cm^3") + ".",
        parts: [{ label: "Montre que le volume vaut " + M("V(x) = x(" + a + " - 2x)^2") + ". Pour quelles valeurs de " + M("x") + " la boîte existe-t-elle ?", pts: 1 }, { label: "Vérifie que " + M("x = " + x0) + " convient.", pts: 1 }, { label: "Développe " + M("V(x) - " + V0) + " et divise-le par " + M("(x - " + x0 + ")") + " (schéma de Horner).", pts: 2 }, { label: "Trouve les autres solutions (au centième) et dis lesquelles conviennent.", pts: 2 }],
        sol: ul(["Base carrée de côté " + M(a + " - 2x") + ", hauteur " + M("x") + ". Il faut " + M("0 \\lt x \\lt " + N(a / 2)) + ".", M("V(" + x0 + ") = " + x0 + " \\cdot " + (a - 2 * x0) + "^2 = " + V0) + " ✓.", M(poly([4, -4 * a, a * a, -V0]) + " = (x - " + x0 + ")(" + poly([4, q1, q0]) + ")") + " (reste nul).", M(poly([4, q1, q0]) + " = 0") + " donne " + M("x \\approx " + A(u1, 2)) + " ou " + M("x \\approx " + A(u2, 2)) + ". Or " + M(A(u2, 2) + " > " + N(a / 2)) + " : impossible. Deux boîtes conviennent, avec " + M("x = " + x0) + " cm ou " + M("x \\approx " + A(u1, 2)) + " cm."]),
        chk: [[u1, A(u1, 2), 0.01], [u2, A(u2, 2), 0.01], [x0 * q0, N(V0)], [u1 * (a - 2 * u1) ** 2, N(V0), 0.5]] }); },
    // Le polynôme de degré 3 (zéro, division, signe)
    () => { let z; do { z = shuffle([-4, -3, -2, -1, 2, 3, 4, 5]).slice(0, 3); } while (z[0] + z[1] + z[2] === 0 || z[0] * z[1] + z[1] * z[2] + z[0] * z[2] === 0 || z[1] + z[2] === 0);
      const [r1, r2, r3] = z, c2 = -(r1 + r2 + r3), c1 = r1 * r2 + r1 * r3 + r2 * r3, c0 = -r1 * r2 * r3, Pv = (x) => ((x + c2) * x + c1) * x + c0, s = z.slice().sort((p, q) => p - q);
      let m; do { m = pk([-3, -2, 2, 3, 6]); } while (z.includes(m)); const qb = r1 + c2, qc = r1 * qb + c1;
      return X({ id: "polymp", lv: 2, titre: "Le polynôme de degré 3",
        q: "On donne " + M("P(x) = " + poly([1, c2, c1, c0])) + ".",
        parts: [{ label: "Vérifie que " + M(r1) + " est un zéro de " + M("P") + ".", pts: 1 }, { label: "Divise " + M("P(x)") + " par " + M(fac(r1)) + " et factorise complètement " + M("P(x)") + ".", pts: 2 }, { label: "Sans division, quel est le reste de la division de " + M("P(x)") + " par " + M(fac(m)) + " ?", pts: 1 }, { label: "Résous " + M("P(x) > 0") + " à l'aide d'un tableau des signes.", pts: 2 }],
        sol: ul([M("P(" + r1 + ") = 0") + " ✓.", "Quotient " + M(poly([1, qb, qc])) + " ; ses zéros sont " + M(r2) + " et " + M(r3) + ", donc " + M("P(x) = " + fac(r1) + fac(r2) + fac(r3)) + ".", "Théorème du reste : " + M("P(" + m + ") = " + N(Pv(m))) + ".", "Signes alternés de droite à gauche (coefficient de " + M("x^3") + " positif) : " + M("S = \\,]" + s[0] + " \\,;\\, " + s[1] + "[ \\,\\cup\\, ]" + s[2] + " \\,;\\, +\\infty[") + "."]),
        chk: [[r2 * r3, String(qc)], [Pv(m), N(Pv(m))]] }); },
    // La grande roue (fonction sinusoïdale)
    () => { const Dm = pk([40, 50, 60]), Rr = Dm / 2, H = Rr + pk([2, 3]), Tp = pk([8, 10, 12]), t1 = pk([1, 2, 3].filter((u) => u % (Tp / 4) !== 0)), h1 = Rr * Math.sin(((2 * Math.PI) / Tp) * (t1 - Tp / 4)) + H;
      return X({ id: "sinusmp", lv: 1, titre: "La grande roue",
        q: "Une grande roue a un diamètre de " + Q(Dm, "m") + " ; son centre est à " + Q(H, "m") + " du sol. Elle fait un tour en " + Q(Tp, "min") + ". On monte dans une nacelle au point le plus bas, à " + M("t = 0") + ". La hauteur de la nacelle est " + M("h(t) = " + Rr + "\\sin\\left(\\frac{\\pi}{" + Tp / 2 + "}\\left(t - " + N(Tp / 4) + "\\right)\\right) + " + H) + " (" + M("t") + " en min, " + M("h") + " en m).",
        parts: [{ label: "Donne l'amplitude, l'axe et la période. Vérifie que " + M("b = \\frac{2\\pi}{" + Tp + "}") + ".", pts: 2 }, { label: "Quelles sont la hauteur maximale et la hauteur minimale ?", pts: 1 }, { label: "À quelle hauteur est la nacelle après " + t1 + " min (au centième) ?", pts: 1 }, { label: "Combien de minutes par tour la nacelle est-elle à plus de " + Q(H + Rr / 2, "m") + " (au centième) ?", pts: 2 }],
        sol: ul(["Amplitude " + Rr + " m (le rayon), axe " + M("y = " + H) + " (le centre), période " + Tp + " min ; " + M("\\frac{2\\pi}{" + Tp + "} = \\frac{\\pi}{" + Tp / 2 + "}") + ".", "Max " + M(H + " + " + Rr + " = " + (H + Rr)) + " m ; min " + M(H + " - " + Rr + " = " + (H - Rr)) + " m.", M("h(" + t1 + ") \\approx " + A(h1, 2)) + " m.", "Il faut " + M("\\sin(\\ldots) > \\frac{1}{2}") + " : l'angle est entre 30° et 150°, soit le tiers d'un tour, " + M(Tp + " : 3 \\approx " + A(Tp / 3, 2)) + " min."]),
        chk: [[H + Rr, String(H + Rr)], [h1, A(h1, 2), 0.01], [Tp / 3, A(Tp / 3, 2), 0.01]] }); },
    // Les températures de l'année (trouver l'expression)
    () => { const Tx = pk([24, 26, 28]), Tn = pk([-2, 1, 2]), a = (Tx - Tn) / 2, d = (Tx + Tn) / 2, m1 = pk([2, 5, 9, 12]), T1 = a * Math.sin((Math.PI / 6) * (m1 - 4)) + d, ville = pk(["une ville du Plateau suisse", "une ville de plaine", "une petite ville au bord d'un lac"]);
      return X({ id: "sinusmp", lv: 2, titre: "Les températures de l'année",
        q: "Dans " + ville + ", la température moyenne d'un mois varie au fil de l'année comme une sinusoïde : " + Tx + " °C au maximum (mi-juillet, " + M("m = 7") + ") et " + tx(Tn) + " °C au minimum (mi-janvier, " + M("m = 1") + "). On cherche " + M("T(m) = a\\sin(b(m - c)) + d") + ", " + M("m") + " étant le numéro du mois.",
        parts: [{ label: "Calcule l'amplitude " + M("a") + " et l'axe " + M("d") + ".", pts: 1 }, { label: "La période est de 12 mois : calcule " + M("b") + ".", pts: 1 }, { label: "La courbe coupe l'axe en montant 3 mois avant le maximum : donne " + M("c") + " et l'expression de " + M("T") + ".", pts: 1 }, { label: "Quelle température moyenne le modèle prévoit-il au mois " + m1 + " (au dixième) ?", pts: 1 }],
        sol: ul([M("a = \\frac{" + Tx + " - " + par(Tn) + "}{2} = " + N(a)) + " ; " + M("d = \\frac{" + Tx + " + " + par(Tn) + "}{2} = " + N(d)) + ".", M("b = \\frac{2\\pi}{12} = \\frac{\\pi}{6}"), M("c = 7 - 3 = 4") + ", donc " + M("T(m) = " + N(a) + "\\sin\\left(\\frac{\\pi}{6}(m - 4)\\right) + " + N(d)) + ".", M("T(" + m1 + ") \\approx " + A(T1, 1)) + " °C."]),
        chk: [[a, N(a)], [d, N(d)], [T1, A(T1, 1), 0.1]] }); },
    // Le modèle exponentiel (a · b^x)
    () => { const grow = R.rand() < 0.5, a = grow ? pk([50, 80, 200]) : pk([40, 60, 80]), b = grow ? pk([1.5, 2, 3]) : pk([0.5, 0.7, 0.8]), y2 = a * b * b, x1 = pk([5, 6]), thr = grow ? a * pk([100, 1000]) : a * pk([0.1, 0.05]), xt = Math.log(thr / a) / Math.log(b);
      const K = grow ? ["Une population de bactéries", "jours", "dépasse-t-elle " + T(thr) + " bactéries"] : ["La quantité d'un médicament dans le sang (en mg)", "heures", "descend-elle au-dessous de " + T(thr) + " mg"];
      return X({ id: "explogfn", lv: 2, titre: grow ? "La population de bactéries" : "Le médicament",
        q: K[0] + " suit un modèle " + M("f(x) = a \\cdot b^x") + ", " + M("x") + " en " + K[1] + ". Au départ, " + M("f(0) = " + a) + " ; après 2 " + K[1] + ", " + M("f(2) = " + N(y2)) + ".",
        parts: [{ label: "Détermine " + M("a") + " et " + M("b") + " (avec " + M("b > 0") + ").", pts: 2 }, { label: "La fonction est-elle croissante ou décroissante ? Que signifie " + M("b") + " ?", pts: 1 }, { label: "Calcule " + M("f(" + x1 + ")") + " (au centième).", pts: 1 }, { label: "Quand la quantité " + K[2] + " (au dixième) ?", pts: 2 }],
        sol: ul([M("a = f(0) = " + a) + " ; " + M(a + " \\cdot b^2 = " + N(y2)) + " ⟺ " + M("b^2 = " + N(b * b)) + " ⟺ " + M("b = " + N(b)) + ".", (b > 1 ? "Croissante (" + M("b > 1") + ")" : "Décroissante (" + M("0 \\lt b \\lt 1") + ")") + " : chaque " + K[1].replace(/s$/, "") + ", la quantité est multipliée par " + tx(b) + ".", M("f(" + x1 + ") = " + a + " \\cdot " + N(b) + "^{" + x1 + "} \\approx " + A(a * b ** x1, 2)) + ".", M(N(b) + "^x = " + N(thr / a)) + " ⟺ " + M("x = \\frac{\\log " + N(thr / a) + "}{\\log " + N(b) + "} \\approx " + A(xt, 1)) + " " + K[1] + "."]),
        chk: [[Math.sqrt(y2 / a), N(b)], [a * b ** x1, A(a * b ** x1, 2), 0.01], [xt, A(xt, 1), 0.1]] }); },
    // TVA et bon de réduction (composition, réciproque)
    () => { const Rb = pk([10, 20, 25]), p = pk([80, 150, 240]), fg = 1.081 * p - Rb, gf = 1.081 * (p - Rb), p2 = pk([60, 120, 200]), P2 = r6(1.081 * p2 - Rb);
      return X({ id: "fctmp", lv: 2, titre: "TVA et bon de réduction",
        q: "Un magasin ajoute la TVA de 8,1 % au prix hors taxe : " + M("g(x) = 1{,}081x") + ". Un client a un bon de " + Q(Rb, "CHF") + " : " + M("f(x) = x - " + Rb) + ".",
        parts: [{ label: "Écris " + M("(f \\circ g)(x)") + " et " + M("(g \\circ f)(x)") + ". Que signifie chacune ?", pts: 2 }, { label: "Pour un article à " + Q(p, "CHF") + " hors taxe, calcule les deux prix. Lequel est le plus avantageux pour le client ? De combien ?", pts: 1 }, { label: "Détermine la réciproque de " + M("f \\circ g") + ". Un client a payé " + Q(P2, "CHF") + " (TVA puis bon) : quel était le prix hors taxe ?", pts: 2 }, { label: "Avec un rabais de 10 % (" + M("r(x) = 0{,}9x") + ") au lieu du bon, l'ordre compte-t-il ?", pts: 1 }],
        sol: ul([M("(f \\circ g)(x) = 1{,}081x - " + Rb) + " : TVA d'abord, puis bon ; " + M("(g \\circ f)(x) = 1{,}081(x - " + Rb + ") = 1{,}081x - " + N(1.081 * Rb)) + " : bon d'abord, puis TVA.", M("(f \\circ g)(" + p + ") = " + A(fg, 2)) + " CHF ; " + M("(g \\circ f)(" + p + ") = " + A(gf, 2)) + " CHF. Le bon avant la TVA est plus avantageux de " + M(A(fg - gf, 2)) + " CHF (la TVA ne porte pas sur le bon).", M("y = 1{,}081x - " + Rb) + " ⟺ " + M("x = \\frac{y + " + Rb + "}{1{,}081}") + " ; " + M("\\frac{" + N(P2) + " + " + Rb + "}{1{,}081} = " + p2) + " CHF.", "Non : " + M("1{,}081 \\cdot 0{,}9x = 0{,}9 \\cdot 1{,}081x") + ", les deux composées sont égales."]),
        chk: [[fg, A(fg, 2), 0.01], [gf, A(gf, 2), 0.01], [fg - gf, A(fg - gf, 2), 0.01], [(P2 + Rb) / 1.081, String(p2), 0.01]] }); },
    // Ajouts du 24.11 (agent mp4plus) : fonctions rationnelles.
    // Le mélange (fonction rationnelle : image, asymptote horizontale, équation)
    () => { const V0 = pk([20, 40, 60]), k = pk([100, 200, 300]), xs = pk([V0, 3 * V0, V0 / 4, 1.5 * V0]), T = (k * xs) / (xs + V0), x1 = pk([5, 10, 20].filter((x) => x !== xs)), c1 = (k * x1) / (x1 + V0);
      const K = pk([["Un aquarium d'eau de mer est préparé dans une cuve qui", "une eau très salée", "de sel"], ["Une cuve de fabrication de sirop", "un concentré sucré", "de sucre"], ["Le réservoir d'un pulvérisateur agricole", "un engrais liquide", "d'engrais"]]);
      return X({ id: "fratmp", lv: 2, titre: "Le mélange",
        q: K[0] + " contient " + Q(V0, "L") + " d'eau pure. On y verse " + M("x") + " litres d'" + K[1] + " à " + M(k + "\\ \\text{g/L}") + " " + K[2] + ". La concentration du mélange (en g/L) est " + M("c(x) = \\frac{" + k + "x}{x + " + V0 + "}") + ".",
        parts: [{ label: "Calcule " + M("c(" + x1 + ")") + " (au centième) et interprète.", pts: 1 }, { label: "Quelle est l'asymptote horizontale de " + M("c") + " ? Que signifie-t-elle pour le mélange ?", pts: 1 }, { label: "Combien de litres faut-il verser pour atteindre " + Q(T, "g/L") + " ?", pts: 2 }, { label: "Quelle est la valeur interdite de " + M("c") + " ? Pourquoi ne gêne-t-elle pas ici ?", pts: 1 }],
        sol: ul([M("c(" + x1 + ") = \\frac{" + k * x1 + "}{" + (x1 + V0) + "} " + eqA(c1)) + " g/L : avec " + Q(x1, "L") + " versés, chaque litre de mélange contient environ " + M(A(c1, 2)) + " g " + K[2] + ".", M("\\frac{" + k + "x}{x} = " + k) + " : asymptote " + M("y = " + k) + ". Plus on verse, plus le mélange ressemble au produit pur ; sa concentration s'approche de " + Q(k, "g/L") + " sans jamais l'atteindre.", M(k + "x = " + N(T) + "(x + " + V0 + ")") + " ⟺ " + M(N(k - T) + "x = " + N(T * V0)) + " ⟺ " + M("x = " + N(xs)) + " L.", M("x = -" + V0) + " (le dénominateur s'annule) ; ici " + M("x \\ge 0") + " (on ne peut pas verser une quantité négative), donc cette valeur n'est jamais atteinte."]),
        chk: [[c1, A(c1, 2), 0.01], [k, String(k)], [xs, N(xs)], [-V0, String(-V0)]] }); },
    // La lentille (fonction rationnelle d'un modèle physique)
    () => { const f = pk([8, 12, 20]), m = pk([2, 3, 1.5, 5]), T = m * f, dT = (m * f) / (m - 1), k1 = pk([3, 4, 5].filter((k) => k * f !== dT)), d1 = k1 * f, i1 = (f * d1) / (d1 - f), K = pk(["l'objectif d'un appareil photo", "la lentille d'un projecteur de diapositives", "la lentille d'une webcam"]);
      return X({ id: "fratmp", lv: 3, titre: "La lentille",
        q: "Pour " + K + " de distance focale " + Q(f, "cm") + ", un objet placé à la distance " + M("d") + " (en cm, " + M("d > " + f) + ") donne une image nette à la distance " + M("i(d) = \\frac{" + f + "d}{d - " + f + "}") + " (en cm) derrière la lentille.",
        parts: [{ label: "Calcule " + M("i(" + d1 + ")") + " (au centième).", pts: 1 }, { label: "Quelle est la valeur interdite de " + M("i") + " ? Que devient l'image quand l'objet s'approche de cette distance ?", pts: 1 }, { label: "Quelle est l'asymptote horizontale ? Interprète-la pour un objet très éloigné.", pts: 1 }, { label: "À quelle distance faut-il placer l'objet pour que l'image soit à " + Q(T, "cm") + " ?", pts: 2 }],
        sol: ul([M("i(" + d1 + ") = \\frac{" + f * d1 + "}{" + (d1 - f) + "} " + eqA(i1)) + " cm.", M("d = " + f) + " (le dénominateur s'annule). Quand " + M("d") + " s'approche de " + M(f) + ", " + M("i(d)") + " devient énorme : l'image part « à l'infini » (asymptote verticale " + M("d = " + f) + ").", M("\\frac{" + f + "d}{d} = " + f) + " : asymptote " + M("y = " + f) + ". Pour un objet très lointain, l'image se forme dans le plan focal, à " + Q(f, "cm") + " de la lentille.", M(f + "d = " + N(T) + "(d - " + f + ")") + " ⟺ " + M(N(T - f) + "d = " + N(T * f)) + " ⟺ " + M("d = " + N(dT)) + " cm (plus grand que " + M(f) + ", donc permis)."]),
        chk: [[i1, A(i1, 2), 0.01], [f, String(f)], [dT, N(dT)]] }); },
  ];
  const RAISONF = [
    () => VF("ineqmp", 1, [["« " + M("-3x > 12") + " équivaut à " + M("x > -4") + ". »", false, "On divise par " + M("-3") + " : le sens change, " + M("x \\lt -4") + "."],
      ["« " + M("(x - 2)^2 > 0") + " pour tout " + M("x") + ". »", false, "Pour " + M("x = 2") + ", " + M("(x - 2)^2 = 0") + "."],
      ["« Si " + M("P(3) = 0") + ", alors " + M("(x - 3)") + " divise " + M("P(x)") + ". »", true, "Le reste de la division par " + M("(x - 3)") + " vaut " + M("P(3) = 0") + "."],
      ["« La période de " + M("\\sin(2x)") + " est " + M("4\\pi") + ". »", false, M("2\\pi : 2 = \\pi") + "."],
      ["« " + M("f(x) = x^3") + " est impaire. »", true, M("(-x)^3 = -x^3") + "."],
      ["« Le graphe de " + M("f(x) + 3") + " est celui de " + M("f") + " décalé de 3 vers la droite. »", false, "Vers le haut ; vers la droite, c'est " + M("f(x - 3)") + "."],
      ["« " + M("\\log_2 x") + " n'est définie que pour " + M("x > 0") + ". »", true, "C'est la réciproque de " + M("2^x") + ", toujours positive."]]),
    () => { const a = pk([2, 3, 4, 5]), s = R.nz(-4, 4), b = R.nz(-6, 9), c = b - a * s, w = RX.who();
      return X({ id: "ineqmp", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("-" + a + "x" + sg(b) + " \\geq " + N(c)) + " : « " + M("-" + a + "x \\geq " + N(c - b)) + ", donc " + M("x \\geq " + s) + ". »",
        parts: [{ label: "Teste sa réponse avec " + M("x = " + (s + 1)) + ". Que constates-tu ?", pts: 1 }, { label: "Quelle est l'erreur ? Donne la bonne solution.", pts: 1 }],
        sol: ul([M("-" + a + " \\cdot " + par(s + 1) + sg(b) + " = " + N(-a * (s + 1) + b)) + ", et " + M(N(-a * (s + 1) + b) + " \\lt " + N(c)) + " : " + M("x = " + (s + 1)) + " ne convient pas.", "En divisant par " + M("-" + a) + ", négatif, il faut retourner le sens : " + M("x \\leq " + s) + "."]),
        chk: [[(c - b) / -a, String(s)]] }); },
    () => { const a = pk([2, 3, 5]), b = pk([2, 3, 4]), d = pk([-1, 1, 4]), w = RX.who();
      return X({ id: "sinusmp", lv: 2, titre: "Trouve l'erreur",
        q: "Pour " + M("f(x) = " + a + "\\sin(" + b + "x)" + sg(d)) + ", " + w + " écrit : « période " + M("2\\pi \\cdot " + b + " = " + 2 * b + "\\pi") + ", maximum " + M(a) + ". »",
        parts: [{ label: "Corrige la période.", pts: 1 }, { label: "Corrige le maximum et donne le minimum.", pts: 1 }],
        sol: ul([M("\\frac{2\\pi}{" + b + "}" + (b === 2 ? " = \\pi" : "")) + " : avec " + M(b + "x") + ", la courbe va " + b + " fois plus vite.", "Maximum " + M(d + " + " + a + " = " + (d + a)) + " ; minimum " + M(d + " - " + a + " = " + (d - a)) + " (l'axe est " + M("y = " + d) + ")."]),
        chk: [[d + a, String(d + a)], [d - a, String(d - a)]] }); },
    // Ajout du 24.11 (agent mp4plus) : valeur interdite oubliée.
    () => { const p = pk([-5, -4, -3, -2, 2, 3, 4, 5, 6]), k = pk([2, 3, 4, 5]), w = RX.who(), num = k + "x" + sg(-k * p), dn = "x" + sg(-p);
      return X({ id: "fratmp", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{" + num + "}{" + dn + "} = " + k) + " : « Je multiplie par " + M("(" + dn + ")") + " : " + M(num + " = " + num) + ", c'est toujours vrai, donc tous les nombres réels sont solutions. »",
        parts: [{ label: "Remplace " + M("x") + " par " + M(p) + " dans l'équation de départ. Que se passe-t-il ?", pts: 1 }, { label: "Quelle est l'erreur ? Donne l'ensemble des solutions correct.", pts: 1 }],
        sol: ul(["Le dénominateur vaut " + M(p + sg(-p) + " = 0") + " : la fraction n'existe pas, " + M(p) + " est une valeur interdite.", "On ne peut multiplier par " + M("(" + dn + ")") + " que si " + M(dn + " \\neq 0") + " : il fallait exclure la valeur interdite. " + M("S = \\mathbb{R} \\setminus \\{" + p + "\\}") + " (pour " + M("x \\neq " + p) + ", la fraction se simplifie en " + M(k) + ")."]),
        chk: [[p, String(p)]] }); },
  ];

  RICH.eqmp3 = { ids: ["eqabs", "eqbic", "eqirrmp", "eqratmp"], track: "mp", label: "Équations avancées (MP)", ex: EXA, raison: RAISONA, minutes: 45 };
  RICH.logmp3 = { ids: ["puisrat", "logdef", "logprop", "eqexp", "eqlog", "croissexp"], track: "mp", label: "Exponentielles et logarithmes (MP)", ex: EXL, raison: RAISONL, minutes: 45 };
  RICH.volmp3 = { ids: ["volmp", "similmp"], track: "mp", label: "Volumes et similitude (MP)", ex: EXV, raison: RAISONV, minutes: 45 };
  RICH.vecmp4 = { ids: ["coordmp", "vectmp", "scalmp", "projmp", "pvectmp", "droiteparam", "posdroites"], track: "mp", label: "Géométrie vectorielle (MP)", ex: EXG, raison: RAISONG, minutes: 45 };
  RICH.fctmp4 = { ids: ["ineqmp", "fctmp", "polymp", "sinusmp", "explogfn", "fratmp"], track: "mp", label: "Inéquations et fonctions (MP)", ex: EXF, raison: RAISONF, minutes: 45 };
})();

// Chantier MP 3e et MP 4e (24.11) : leçons actives des 21 notions de src/ch_mp3.js et src/ch_mp4.js.
// Trois modes pour l'étape 2 (actPrep, active.js) :
//   - Manipule (vrai geste, manipLesson de manip.js) : eqabs (le point qu'on promène sur la droite graduée),
//     similmp (le niveau du liquide dans un verre conique), vectmp (la flèche qu'on tire sur le quadrillage) ;
//   - Essaie sur la figure (réponse tapée qui fait réagir un graphique) : droiteparam, sinusmp ;
//   - À toi : 2 questions (réponse tapée, coup de pouce après une erreur) : les 16 autres, plus projmp, pvectmp,
//     posdroites et fratmp (ajoutés le 24.11, agent mp4plus).
// Le rappel de cours (« Retiens ») est la leçon de la notion (LESSONS, dans ch_mp3.js / ch_mp4.js).
// Pas de TeX dans ce qui est redessiné à chaque geste ni dans les messages de réussite.
(function () {
  if (typeof ACTIVE === "undefined") return;
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const n0 = (v) => String(v).replace("-", "−");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const Tx = (x, y, s, a, sz, ex) => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="f-txt" text-anchor="${a}" font-size="${sz}"${(ex || "").replace(/ fill="([^"]+)"/, ' style="fill:$1"')}>${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" class="${cls}" stroke-width="${w}"/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const tu = (x) => " ; tu proposes <b>" + nb(x) + "</b>";
  const dot = (col, lab) => `<circle r="9" fill="${col}" stroke="var(--paper)" stroke-width="2.5"/>` + (lab ? `<text y="-14" text-anchor="middle" class="f-txt" font-size="13" font-weight="700">${lab}</text>` : "");

  // Chercheur (même moteur que act_mp2.js) : réponse tapée ; o.blank → figure (« Essaie sur la figure »),
  // sinon « À toi » (actPrep garde 2 questions et affiche show() comme coup de pouce après une erreur).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
        x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis le coup de pouce, puis recalcule.")); };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Leçon « À toi » : deux questions, coups de pouce (texte simple) et messages de réussite.
  const guide = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(cp[s] + tu(x)), wins });

  Object.assign(ACTIVE, {
    // =============================== MP 3e · A. Équations avancées ===============================
    eqbic: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Bicarrée \\(ax^4 + bx^2 + c = 0\\) : on pose \\(X = x^2\\), on résout \\(aX^2 + bX + c = 0\\), puis on revient à \\(x\\) (\\(x^2 = X\\)). Une valeur \\(X < 0\\) est rejetée : un carré n'est jamais négatif.", exemple: ["\\(x^4 - 10x^2 + 9 = 0\\) : \\(X = 1\\) ou \\(9\\), \\(S = \\{-3 ; -1 ; 1 ; 3\\}\\)", "\\(x^4 + 3x^2 - 4 = 0\\) : \\(X = 1\\) ou \\(X = -4\\) (rejetée), \\(S = \\{-1 ; 1\\}\\)"], piege: "N'oublie pas de revenir à \\(x\\) : \\(X = 9\\) donne deux solutions, \\(x = 3\\) et \\(x = -3\\)." },
      predict: { q: "Dans \\(x^4 - 13x^2 + 36 = 0\\), on pose \\(X = x^2\\). On obtient…", choices: ["\\(X^2 - 13X + 36 = 0\\)", "\\(X - 13X + 36 = 0\\)", "\\(X^4 - 13X + 36 = 0\\)"], good: 0,
        why: "x⁴ = (x²)² = X² : l'équation de degré 4 devient une équation du 2e degré en X, qu'on sait résoudre." },
      defis: ["\\(x^4 - 10x^2 + 9 = 0\\) : avec \\(X = x^2\\), on trouve \\(X = 1\\) ou \\(X = 9\\). Quelle est la plus grande solution \\(x\\) ?", "\\(x^4 + 3x^2 - 4 = 0\\) : combien de solutions réelles \\(x\\) ?"],
      play: guide(["On revient à x : x² = 1 ou x² = 9, donc x = ±1 ou x = ±3", "X² + 3X − 4 = (X − 1)(X + 4) : X = 1 ou X = −4 ; puis x² = X"],
        [W(3, "x² = 9 donne x = 3 ou x = −3, et x² = 1 donne x = 1 ou x = −1 : S = {−3 ; −1 ; 1 ; 3}. La plus grande : 3."),
          W(2, "X = 1 donne x = 1 ou x = −1 ; X = −4 est rejetée, car un carré x² n'est jamais négatif. Deux solutions.")]),
    },
    eqirrmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "1. Isoler la racine. 2. Élever au carré et résoudre. 3. Vérifier chaque solution dans l'équation de départ : élever au carré peut ajouter des solutions parasites.", exemple: ["\\(\\sqrt{2x + 1} = 5\\) : \\(2x + 1 = 25\\), \\(x = 12\\)", "\\(\\sqrt{x + 7} = x + 1\\) : \\(x^2 + x - 6 = 0\\), \\(x = 2\\) ou \\(x = -3\\) (parasite) ; \\(S = \\{2\\}\\)"], piege: "Une solution de l'équation élevée au carré n'est pas forcément une solution : \\(x = -3\\) donne \\(\\sqrt{4} = 2\\), mais \\(-3 + 1 = -2\\)." },
      predict: { q: "\\(\\sqrt{x + 3} = x - 3\\). En élevant au carré, on trouve \\(x = 1\\) ou \\(x = 6\\). Les solutions de l'équation sont…", choices: ["6 seulement", "1 et 6", "1 seulement"], good: 0,
        why: "On vérifie dans l'équation de départ : x = 6 donne √9 = 3 et 6 − 3 = 3 ✓ ; x = 1 donne √4 = 2, mais 1 − 3 = −2 ✗. Élever au carré a ajouté une solution parasite, 1." },
      defis: ["Résous \\(\\sqrt{2x + 1} = 5\\).", "Résous \\(\\sqrt{x + 7} = x + 1\\) : élève au carré, résous, puis vérifie. Quelle est la solution ?"],
      play: guide(["On élève au carré : 2x + 1 = 25", "x + 7 = (x + 1)² = x² + 2x + 1, donc x² + x − 6 = 0 : x = 2 ou x = −3. Vérifie les deux"],
        [W(12, "2x + 1 = 25, donc x = 12. Vérification : √25 = 5 ✓."),
          W(2, "x = 2 : √9 = 3 et 2 + 1 = 3 ✓. x = −3 : √4 = 2, mais −3 + 1 = −2 ✗ (solution parasite). S = {2}.")]),
    },
    eqratmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "1. Valeurs interdites : celles qui annulent un dénominateur. 2. Multiplier les deux membres par le dénominateur. 3. Résoudre l'équation obtenue. 4. Rejeter les solutions interdites.", exemple: ["\\(\\frac{6}{x - 1} = 3\\) : \\(6 = 3(x - 1)\\), \\(x = 3\\) (pas interdite)", "Robinets : \\(\\frac{1}{6} + \\frac{1}{t} = \\frac{1}{4}\\), donc \\(t = 12\\) h"] },
      predict: { q: "\\(\\dfrac{x}{x - 2} = \\dfrac{2}{x - 2}\\). Le nombre \\(x = 2\\) est-il solution ?", choices: ["Non : 2 est une valeur interdite", "Oui", "Oui, c'est la seule solution"], good: 0,
        why: "Pour x = 2, le dénominateur x − 2 vaut 0 : les fractions n'existent pas. En multipliant, on trouve x = 2, mais il faut la rejeter : l'équation n'a pas de solution." },
      defis: ["Résous \\(\\dfrac{6}{x - 1} = 3\\).", "Le robinet A remplit un bassin en 6 h. Avec le robinet B, les deux ensemble le remplissent en 4 h. Combien d'heures faut-il au robinet B seul ?"],
      play: guide(["Valeur interdite : 1. On multiplie par (x − 1) : 6 = 3(x − 1)", "En 1 h, A remplit 1/6 du bassin, B en remplit 1/t, ensemble 1/4 : 1/6 + 1/t = 1/4"],
        [W(3, "6 = 3x − 3, donc x = 3 (ce n'est pas la valeur interdite 1). Vérification : 6 ÷ 2 = 3 ✓."),
          W(12, "1/t = 1/4 − 1/6 = 3/12 − 2/12 = 1/12, donc t = 12 h.")]),
    },
    // =============================== MP 3e · B. Puissances et logarithmes ===============================
    puisrat: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\sqrt[q]{a} = a^{\\frac{1}{q}}\\) et \\(\\sqrt[q]{a^p} = a^{\\frac{p}{q}}\\) (\\(a > 0\\)) : on prend la racine, puis la puissance. \\(a^{-r} = \\frac{1}{a^r}\\).", exemple: ["\\(8^{\\frac{1}{3}} = \\sqrt[3]{8} = 2\\)", "\\(16^{\\frac{3}{4}} = 2^3 = 8\\)", "\\(9^{-\\frac{1}{2}} = \\frac{1}{\\sqrt{9}} = \\frac{1}{3}\\)"] },
      predict: { q: "\\(8^{\\frac{1}{3}}\\) vaut…", choices: ["2", "8/3", "24"], good: 0,
        why: "L'exposant 1/3 est la racine cubique : 8 puissance 1/3 = ∛8 = 2, car 2³ = 8. Ce n'est ni 8 ÷ 3, ni 8 · 3." },
      defis: ["Calcule \\(16^{\\frac{3}{4}}\\).", "Calcule \\(9^{-\\frac{1}{2}}\\) (fraction acceptée)."],
      play: guide(["16 puissance 3/4 = (racine 4e de 16)³", "L'exposant négatif donne l'inverse : 9 puissance −1/2 = 1 ÷ 9 puissance 1/2 = 1 ÷ √9"],
        [W(8, "La racine 4e de 16 vaut 2 (2⁴ = 16), puis 2³ = 8."),
          W(1 / 3, "√9 = 3, puis l'inverse : 1/3. Un exposant négatif donne un inverse, pas un nombre négatif.")]),
    },
    logdef: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pour \\(b > 0\\), \\(b \\ne 1\\) et \\(N > 0\\) : \\(\\log_b N = x \\iff b^x = N\\) (« \\(b\\) à quelle puissance donne \\(N\\) ? »). \\(\\log\\) (sans base) est le logarithme en base 10. Un logarithme peut être négatif, mais pas son argument.", exemple: ["\\(\\log_3 81 = 4\\) car \\(3^4 = 81\\)", "\\(\\log 0{,}001 = -3\\) car \\(0{,}001 = 10^{-3}\\)"] },
      predict: { q: "\\(\\log_2 8\\) vaut…", choices: ["3", "4", "16"], good: 0,
        why: "log₂ 8 répond à la question « 2 à quelle puissance donne 8 ? » : 2³ = 8, donc log₂ 8 = 3. (4, c'est 8 ÷ 2 : le logarithme est un exposant.)" },
      defis: ["Calcule \\(\\log_3 81\\).", "Calcule \\(\\log 0{,}001\\) (logarithme en base 10)."],
      play: guide(["3 à quelle puissance donne 81 ?", "0,001 = 1/1000 = 10 à quelle puissance ?"],
        [W(4, "3⁴ = 81, donc log₃ 81 = 4."),
          W(-3, "0,001 = 10⁻³, donc log 0,001 = −3. Un logarithme peut être négatif (mais pas son argument).")]),
    },
    logprop: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\log(ab) = \\log a + \\log b\\) et \\(\\log(a^n) = n \\log a\\).", exemple: ["\\(\\log 50 + \\log 2 = \\log 100 = 2\\)", "\\(\\log 8 + 3\\log 5 = \\log 8 + \\log 125 = \\log 1000 = 3\\)", "\\(\\log 16 = 4\\log 2 \\approx 1{,}204\\)"] },
      predict: { q: "\\(\\log 50 + \\log 2\\) vaut…", choices: ["2", "\\(\\log 52\\)", "100"], good: 0,
        why: "log a + log b = log(ab) : log 50 + log 2 = log(50 · 2) = log 100 = 2. La somme des logarithmes est le logarithme du produit, pas de la somme." },
      defis: ["Calcule \\(\\log 8 + 3\\log 5\\) (indice : \\(3\\log 5 = \\log 5^3\\)).", "On sait que \\(\\log 2 \\approx 0{,}301\\). Calcule \\(\\log 16\\) avec cette valeur."],
      play: guide(["3 log 5 = log 125, puis log 8 + log 125 = log(8 · 125)", "16 = 2⁴, donc log 16 = 4 log 2"],
        [W(3, "log 8 + log 125 = log 1000 = 3."),
          W(1.204, "log 16 = 4 · log 2 ≈ 4 · 0,301 = 1,204.")]),
    },
    // =============================== MP 3e · C. Exponentielles et logarithmes ===============================
    eqexp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si les deux membres s'écrivent avec la même base : \\(b^A = b^B \\iff A = B\\). Sinon, on prend le logarithme : \\(b^x = c \\iff x = \\frac{\\log c}{\\log b}\\).", piege: "Écris d'abord les deux membres avec la même base (\\(27 = 3^3\\), \\(16 = 2^4\\)) avant d'égaler les exposants." },
      predict: { q: "\\(2^{x + 1} = 16\\). Que vaut \\(x\\) ?", choices: ["3", "7", "8"], good: 0,
        why: "16 = 2⁴ : les deux membres ont la même base 2, donc les exposants sont égaux : x + 1 = 4 et x = 3." },
      defis: ["Résous \\(3^{2x - 1} = 27\\).", "Résous \\(2^x = 5\\) : \\(x = \\dfrac{\\log 5}{\\log 2}\\). Donne \\(x\\) au centième."],
      play: guide(["27 = 3³ : même base, donc 2x − 1 = 3", "Calculatrice : log 5 ÷ log 2, puis arrondis au centième"],
        [W(2, "2x − 1 = 3, donc x = 2. Vérification : 3³ = 27 ✓."),
          W(2.32, "log 5 ÷ log 2 ≈ 0,699 ÷ 0,301 ≈ 2,32. Vérification : 2 puissance 2,32 ≈ 5 ✓.")]),
    },
    eqlog: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "1. Domaine : chaque argument de logarithme doit être strictement positif. 2. Se ramener à \\(\\log_b A = k\\) (avec \\(\\log a + \\log b = \\log(ab)\\)), puis \\(A = b^k\\). 3. Résoudre et garder les solutions du domaine.", exemple: ["\\(\\log(2x + 4) = 2\\) : \\(2x + 4 = 100\\), \\(x = 48\\)", "\\(\\log x + \\log(x - 3) = 1\\) : \\(x(x - 3) = 10\\), \\(x = 5\\) (\\(-2\\) rejetée)"] },
      predict: { q: "\\(\\log_2(x - 1) = 3\\). Que vaut \\(x\\) ?", choices: ["9", "7", "4"], good: 0,
        why: "log₂ A = 3 signifie A = 2³ = 8 : x − 1 = 8, donc x = 9. Et 9 − 1 = 8 > 0 : x = 9 est dans le domaine." },
      defis: ["Résous \\(\\log(2x + 4) = 2\\).", "Résous \\(\\log x + \\log(x - 3) = 1\\) (domaine : \\(x > 3\\))."],
      play: guide(["log A = 2 signifie A = 10² = 100 : 2x + 4 = 100", "log x + log(x − 3) = log(x(x − 3)) = 1, donc x(x − 3) = 10 : x² − 3x − 10 = 0"],
        [W(48, "2x + 4 = 100, donc x = 48 ; 2 · 48 + 4 = 100 > 0 ✓."),
          W(5, "x² − 3x − 10 = (x − 5)(x + 2) : x = 5 ou x = −2. Le domaine impose x > 3 : seule 5 convient.")]),
    },
    croissexp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Modèle exponentiel \\(f(n) = f_0 \\cdot q^n\\) : à chaque période, on multiplie par \\(q\\) (hausse de 10 % : \\(q = 1{,}1\\)). Doublement toutes les \\(T\\) heures : \\(f_0 \\cdot 2^{t/T}\\). Pour trouver la durée, on résout \\(q^n = k\\).", exemple: ["100 bactéries, doublement toutes les 3 h : après 12 h, \\(100 \\cdot 2^4 = 1\\text{'}600\\)", "\\(100 \\cdot 2^{t/3} = 6\\text{'}400\\) : \\(2^{t/3} = 64 = 2^6\\), \\(t = 18\\) h"], piege: "Ce n'est pas linéaire : deux hausses de 10 % font \\(1{,}1^2 = 1{,}21\\), soit +21 %, pas +20 %." },
      predict: { q: "Un prix augmente de 10 % par an pendant 2 ans. Au total, il a augmenté de…", choices: ["21 %", "20 %", "12 %"], good: 0,
        why: "Chaque année, on multiplie par 1,1 : 1,1 · 1,1 = 1,21, soit +21 %. Les pourcentages successifs ne s'additionnent pas." },
      defis: ["Une population de 100 bactéries double toutes les 3 heures. Combien y en a-t-il après 12 heures ?", "Après combien d'heures y en a-t-il 6'400 ?"],
      play: guide(["En 12 heures, la population double 12 ÷ 3 = 4 fois : 100 · 2⁴", "100 · 2 puissance (t ÷ 3) = 6'400, donc 2 puissance (t ÷ 3) = 64 = 2⁶"],
        [W(1600, "12 ÷ 3 = 4 doublements : 100 · 2⁴ = 100 · 16 = 1'600 bactéries."),
          W(18, "t ÷ 3 = 6, donc t = 18 heures.")]),
    },
    // =============================== MP 3e · D. Volumes et similitude ===============================
    volmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Cylindre : \\(V = A_{\\text{base}} \\cdot h = \\pi r^2 h\\). Cône : \\(V = \\frac{A_{\\text{base}} \\cdot h}{3}\\), le tiers du cylindre de même base et de même hauteur.", exemple: ["Cylindre \\(r = 2\\), \\(h = 5\\) : \\(V = \\pi \\cdot 4 \\cdot 5 = 20\\pi\\) cm³", "Cône \\(r = 3\\), \\(V = 12\\pi\\) : \\(\\frac{9\\pi h}{3} = 12\\pi\\), \\(h = 4\\) cm"], piege: "Pour le cône, n'oublie pas de diviser par 3." },
      predict: { q: "Un cône et un cylindre ont la même base et la même hauteur. Le volume du cône est…", choices: ["le tiers de celui du cylindre", "la moitié de celui du cylindre", "le même"], good: 0,
        why: "Cylindre : A_base · h ; cône : A_base · h ÷ 3. Il faut trois cônes pleins pour remplir le cylindre." },
      defis: ["Cylindre de rayon 2 cm et de hauteur 5 cm. Son volume vaut k · π cm³ : que vaut k ?", "Un cône a un volume de 12π cm³ et un rayon de 3 cm. Quelle est sa hauteur (en cm) ?"],
      play: guide(["V = π · r² · h = π · 2² · 5", "V = π · r² · h ÷ 3 = π · 9 · h ÷ 3 = 3π · h"],
        [W(20, "π · 4 · 5 = 20π ≈ 62,83 cm³."),
          W(4, "3π · h = 12π, donc h = 4 cm.")]),
    },
    // =============================== MP 4e · E–G. Coordonnées, vecteurs, droites ===============================
    coordmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Distance \\(AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\\) (Pythagore sur les écarts). Milieu : la moyenne des coordonnées \\(\\left(\\frac{x_A + x_B}{2} ; \\frac{y_A + y_B}{2}\\right)\\). Coordonnées polaires \\((r ; \\theta)\\) : \\(x = r\\cos\\theta\\), \\(y = r\\sin\\theta\\).", exemple: ["\\(A(1 ; 2)\\), \\(B(4 ; 6)\\) : \\(AB = \\sqrt{3^2 + 4^2} = 5\\)", "Milieu de \\(A(-2 ; 5)\\) et \\(B(6 ; 1)\\) : abscisse \\(\\frac{-2 + 6}{2} = 2\\)", "\\((6 ; 60°)\\) : \\(x = 6\\cos 60° = 3\\)"], piege: "\\(AB = \\sqrt{3^2 + 4^2} = 5\\), pas \\(3 + 4 = 7\\)." },
      predict: { q: "Distance entre \\(A(1 \\,;\\, 2)\\) et \\(B(4 \\,;\\, 6)\\) ?", choices: ["5", "7", "25"], good: 0,
        why: "On applique Pythagore aux écarts : Δx = 3, Δy = 4, AB = √(3² + 4²) = √25 = 5. (7 = 3 + 4 et 25 = AB².)" },
      defis: ["Milieu de \\(A(-2 \\,;\\, 5)\\) et \\(B(6 \\,;\\, 1)\\) : quelle est son abscisse ?", "Le point de coordonnées polaires \\((6 \\,;\\, 60°)\\) : que vaut son abscisse \\(x = r\\cos\\theta\\) ?"],
      play: guide(["Abscisse du milieu = moyenne des abscisses : (−2 + 6) ÷ 2", "x = 6 · cos 60° et cos 60° = 0,5"],
        [W(2, "(−2 + 6) ÷ 2 = 2 ; ordonnée (5 + 1) ÷ 2 = 3 : milieu (2 ; 3)."),
          W(3, "x = 6 · 0,5 = 3 ; et y = 6 · sin 60° ≈ 5,2.")]),
    },
    scalmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\) : c'est un nombre. Nul : vecteurs orthogonaux. Angle : \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\)." },
      predict: { q: "\\(\\vec{u} = (2 \\,;\\, 1)\\) et \\(\\vec{v} = (-1 \\,;\\, 2)\\). Le produit scalaire \\(\\vec{u} \\cdot \\vec{v}\\) vaut…", choices: ["0", "4", "(−2 ; 2)"], good: 0,
        why: "x avec x, y avec y, puis on additionne : 2 · (−1) + 1 · 2 = 0. Les vecteurs sont orthogonaux. Le produit scalaire est un nombre, pas un vecteur." },
      defis: ["\\(\\vec{u} = (6 \\,;\\, k)\\) et \\(\\vec{v} = (2 \\,;\\, -3)\\) sont orthogonaux. Que vaut \\(k\\) ?", "\\(\\vec{u} = (2 \\,;\\, 1)\\), \\(\\vec{v} = (1 \\,;\\, 3)\\). Angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\), en degrés ?"],
      play: guide(["Orthogonaux : produit scalaire nul, 6 · 2 + k · (−3) = 0", "u · v = 5, ‖u‖ = √5, ‖v‖ = √10 : cos α = 5 ÷ (√5 · √10) = 5 ÷ √50"],
        [W(4, "12 − 3k = 0, donc k = 4."),
          W(45, "cos α = 5 ÷ √50 ≈ 0,707, donc α = 45°.")]),
    },
    // Ajouts du 24.11 (agent mp4plus) : projmp, pvectmp, posdroites, fratmp (À toi, 2 questions).
    projmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Projection scalaire de \\(\\vec{u}\\) sur la direction de \\(\\vec{v}\\) : \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|}\\) (la longueur de l'« ombre »). Vecteur projeté : \\(\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}\\,\\vec{v}\\) ; la partie \\(\\vec{u} - \\vec{p}\\) est orthogonale à \\(\\vec{v}\\).", exemple: ["\\(\\vec{u} = (4 ; 7)\\), \\(\\vec{v} = (3 ; 4)\\) : \\(\\vec{u} \\cdot \\vec{v} = 40\\), projection \\(40 \\div 5 = 8\\)", "\\(\\vec{u} = (7 ; 1)\\), \\(\\vec{v} = (1 ; 1)\\) : \\(\\vec{p} = \\frac{8}{2}(1 ; 1) = (4 ; 4)\\)"] },
      predict: { q: "L'« ombre » du vecteur \\(\\vec{u} = (3 \\,;\\, 4)\\) sur l'axe des x, quand la lumière tombe à angle droit, est…", choices: ["(3 ; 0)", "(0 ; 4)", "(3 ; 4)"], good: 0,
        why: "On garde seulement la partie de u dans la direction de l'axe : (3 ; 0). Le reste, (0 ; 4), est orthogonal à l'axe. C'est la projection orthogonale." },
      defis: ["\\(\\vec{u} = (4 \\,;\\, 7)\\) et \\(\\vec{v} = (3 \\,;\\, 4)\\). Projection scalaire de \\(\\vec{u}\\) sur \\(\\vec{v}\\), \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|}\\) ?", "Vecteur projeté de \\(\\vec{u} = (7 \\,;\\, 1)\\) sur \\(\\vec{v} = (1 \\,;\\, 1)\\) : que vaut sa première composante ?"],
      play: guide(["u · v = 4 · 3 + 7 · 4 = 40 et ‖v‖ = √(9 + 16) = 5", "u · v = 8 et ‖v‖² = 2 : coefficient 8 ÷ 2, puis on multiplie v par ce coefficient"],
        [W(8, "40 ÷ 5 = 8 : l'ombre de u sur la direction de v mesure 8."),
          W(4, "Coefficient 8 ÷ 2 = 4, donc p = 4 · (1 ; 1) = (4 ; 4). Et u − p = (3 ; −3) est bien orthogonal à v : 3 − 3 = 0.")]),
    },
    pvectmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Dans l'espace, \\(\\vec{u} \\times \\vec{v} = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}\\) (on « croise » les composantes). C'est un vecteur orthogonal à \\(\\vec{u}\\) et à \\(\\vec{v}\\). Sa norme \\(\\|\\vec{u} \\times \\vec{v}\\|\\) est l'aire du parallélogramme construit sur \\(\\vec{u}\\) et \\(\\vec{v}\\) ; le triangle en est la moitié.", exemple: ["\\((1 ; 2 ; 2) \\times (2 ; -1 ; 2)\\) : première composante \\(2 \\cdot 2 - 2 \\cdot (-1) = 6\\)", "\\(\\vec{u} \\times \\vec{v} = (2 ; 3 ; 6)\\) : aire \\(\\sqrt{4 + 9 + 36} = 7\\), triangle 3,5"], piege: "Le produit scalaire donne un nombre ; le produit vectoriel donne un vecteur." },
      predict: { q: "Le produit vectoriel \\(\\vec{u} \\times \\vec{v}\\) de deux vecteurs de l'espace est…", choices: ["un vecteur orthogonal à u et à v", "un nombre", "un vecteur parallèle à u"], good: 0,
        why: "Contrairement au produit scalaire (un nombre), le produit vectoriel est un vecteur, perpendiculaire à u et à v. Sa longueur est l'aire du parallélogramme construit sur u et v." },
      defis: ["\\(\\vec{u} = (1 \\,;\\, 2 \\,;\\, 2)\\) et \\(\\vec{v} = (2 \\,;\\, -1 \\,;\\, 2)\\). Première composante de \\(\\vec{u} \\times \\vec{v}\\), c'est-à-dire \\(u_2 v_3 - u_3 v_2\\) ?", "On a trouvé \\(\\vec{u} \\times \\vec{v} = (2 \\,;\\, 3 \\,;\\, 6)\\). Aire du parallélogramme construit sur \\(\\vec{u}\\) et \\(\\vec{v}\\) ?"],
      play: guide(["u₂v₃ − u₃v₂ = 2 · 2 − 2 · (−1)", "L'aire est la norme du produit vectoriel : √(2² + 3² + 6²)"],
        [W(6, "4 + 2 = 6. En entier, u × v = (6 ; 2 ; −5), et (6 ; 2 ; −5) · (1 ; 2 ; 2) = 6 + 4 − 10 = 0 : orthogonal à u ✓."),
          W(7, "√(4 + 9 + 36) = √49 = 7. Le triangle construit sur u et v aurait une aire de 3,5.")]),
    },
    posdroites: {
      predict: { q: "Dans l'espace, deux droites qui n'ont aucun point commun sont…", choices: ["parallèles ou gauches", "forcément parallèles", "forcément confondues"], good: 0,
        why: "Dans le plan, pas de point commun veut dire parallèles. Dans l'espace, il y a aussi les droites gauches : ni parallèles, ni sécantes (une route et un pont qui passe au-dessus en biais)." },
      defis: ["\\(d\\) a pour vecteur directeur \\((2 \\,;\\, -1)\\) et \\(g\\) a pour vecteur directeur \\((-6 \\,;\\, m)\\). Pour quelle valeur de \\(m\\) les droites sont-elles parallèles ?", "Dans l'espace, \\(d : x = 1 + t,\\ y = 2 - t,\\ z = 3 + 2t\\) et \\(g : x = 5 + 2s,\\ y = 1 + s,\\ z = m - s\\). Les équations en x et en y donnent \\(t = 2\\) et \\(s = -1\\). Pour quelle valeur de \\(m\\) les droites sont-elles sécantes ?"],
      play: guide(["Parallèles : (−6 ; m) = k · (2 ; −1). La première composante donne k = −3", "Point commun : les cotes doivent aussi être égales, 3 + 2 · 2 = m − (−1)"],
        [W(3, "k = −3, donc m = −3 · (−1) = 3 : (−6 ; 3) = −3 · (2 ; −1), les droites sont parallèles (ou confondues)."),
          W(6, "7 = m + 1, donc m = 6 : point commun (3 ; 0 ; 7). Pour toute autre valeur de m, les droites seraient gauches.")]),
    },
    fratmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(f(x) = \\frac{ax + b}{cx + d}\\) n'existe pas quand \\(cx + d = 0\\) : valeur interdite, asymptote verticale \\(x = -\\frac{d}{c}\\). Zéro : \\(ax + b = 0\\). Pour x très grand, \\(f(x) \\approx \\frac{ax}{cx} = \\frac{a}{c}\\) : asymptote horizontale \\(y = \\frac{a}{c}\\). Pour résoudre \\(f(x) = k\\), on multiplie par le dénominateur, puis on vérifie que la solution n'est pas interdite." },
      predict: { q: "\\(f(x) = \\frac{2x - 6}{x + 4}\\). Où est l'asymptote verticale ?", choices: ["x = −4", "x = 3", "y = 2"], good: 0,
        why: "Le dénominateur s'annule en x = −4 : c'est la valeur interdite, la courbe s'envole près de cette droite verticale. x = 3 est le zéro (numérateur) ; y = 2 est l'asymptote horizontale." },
      defis: ["\\(f(x) = \\frac{3x + 6}{x - 1}\\). Asymptote horizontale \\(y = \\ldots\\) ?", "Résous \\(\\frac{2x + 1}{x - 2} = 3\\)."],
      play: guide(["Pour x très grand, f(x) ≈ 3x ÷ x", "On multiplie les deux membres par (x − 2) : 2x + 1 = 3(x − 2)"],
        [W(3, "3x ÷ x = 3 : asymptote y = 3. (Valeur interdite 1, zéro −2.)"),
          W(7, "2x + 1 = 3x − 6, donc x = 7, qui n'est pas la valeur interdite 2. Vérification : 15 ÷ 5 = 3 ✓.")]),
    },
    // =============================== MP 4e · H–J. Inéquations, fonctions ===============================
    ineqmp: {
      predict: { q: "\\(-2x > 6\\). Laquelle est juste ?", choices: ["\\(x < -3\\)", "\\(x > -3\\)", "\\(x > 3\\)"], good: 0,
        why: "On divise par −2, un nombre négatif : le sens de l'inégalité se retourne, x < −3. Vérifie avec x = −4 : −2 · (−4) = 8 > 6 ✓." },
      defis: ["Quel est le plus grand nombre entier \\(x\\) tel que \\(5 - 3x \\ge 17\\) ?", "\\((x - 1)(x + 4) < 0\\) : combien de nombres entiers sont solutions ?"],
      play: guide(["5 − 3x ≥ 17 ⟺ −3x ≥ 12 : on divise par −3, le sens se retourne", "Zéros des facteurs : 1 et −4. Tableau des signes : le produit est négatif entre les deux zéros"],
        [W(-4, "−3x ≥ 12 ⟺ x ≤ −4 : le plus grand entier est −4 (5 + 12 = 17 ✓)."),
          W(4, "S = ]−4 ; 1[ (crochets ouverts, car l'inégalité est stricte) : les entiers −3, −2, −1 et 0, soit 4 nombres.")]),
    },
    fctmp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Réciproque : si \\(f(a) = b\\), alors \\(f^{-1}(b) = a\\). Composition : \\((f \\circ g)(x) = f(g(x))\\), d'abord \\(g\\), puis \\(f\\) ; l'ordre compte. Le graphe de \\(f(x - 2)\\) est celui de \\(f\\) décalé de 2 vers la droite ; \\(f(x) + 2\\), vers le haut ; \\(k \\cdot f(x)\\), étiré verticalement d'un facteur \\(k\\) ; \\(f(kx)\\), comprimé horizontalement d'un facteur \\(k\\) (\\(k > 1\\)). \\(f\\) est paire si \\(f(-x) = f(x)\\) (graphe symétrique par rapport à l'axe des y), impaire si \\(f(-x) = -f(x)\\).", exemple: ["\\(f(x) = 2x + 6\\) : \\(2x + 6 = 10\\), donc \\(f^{-1}(10) = 2\\)", "\\(f(x) = x^2\\), \\(g(x) = x + 3\\) : \\((f \\circ g)(1) = f(4) = 16\\), mais \\((g \\circ f)(1) = 4\\)", "Graphe de \\(f\\) par \\((2 \\,;\\, 5)\\) : celui de \\(3f(x)\\) passe par \\((2 \\,;\\, 15)\\)", "Graphe de \\(f\\) par \\((6 \\,;\\, 1)\\) : celui de \\(f(2x)\\) passe par \\((3 \\,;\\, 1)\\)"] },
      /* 24.11 : parité et étirements (notion « réciproque, parité, transformations ») en défis courts */
      plus: [{ d: "\\(f\\) est paire, \\(f(-4) = 9\\) et \\(f(1) = 2\\). Que vaut \\(f(4) - f(-1)\\) ?", ans: 7, ok: "Paire : f(−x) = f(x), le graphe est symétrique par rapport à l'axe des y. f(4) = 9 et f(−1) = 2 : 9 − 2 = 7. (Impaire : f(−x) = −f(x).)", no: "Paire veut dire f(−x) = f(x)." },
        { d: "Le graphe de \\(f\\) passe par \\((2 \\,;\\, 5)\\). Celui de \\(3f(x)\\) passe par \\((2 \\,;\\, k)\\). Que vaut \\(k\\) ?", ans: 15, ok: "3f(x) multiplie chaque ordonnée par 3 : 5 · 3 = 15. Le graphe est étiré verticalement d'un facteur 3.", no: "Le facteur 3 multiplie la valeur f(2)." },
        { d: "Le graphe de \\(f\\) passe par \\((6 \\,;\\, 1)\\). Celui de \\(f(2x)\\) passe par \\((m \\,;\\, 1)\\). Que vaut \\(m\\) ?", ans: 3, ok: "f(2x) vaut f(6) quand 2x = 6, donc en x = 3 : le graphe est comprimé horizontalement d'un facteur 2.", no: "Cherche x tel que 2x = 6." }],
      predict: { q: "Le graphe de \\(f(x - 2)\\) est celui de \\(f\\), décalé…", choices: ["de 2 vers la droite", "de 2 vers la gauche", "de 2 vers le haut"], good: 0,
        why: "f(x − 2) prend en x la valeur que f prenait en x − 2 : tout arrive 2 unités plus tard, donc plus à droite. (Vers le haut, ce serait f(x) + 2.)" },
      defis: ["\\(f(x) = 2x + 6\\). Que vaut \\(f^{-1}(10)\\) ?", "\\(f(x) = x^2\\) et \\(g(x) = x + 3\\). Que vaut \\((f \\circ g)(1)\\) ?"],
      play: guide(["f⁻¹(10) est le nombre dont l'image par f vaut 10 : 2x + 6 = 10", "(f ∘ g)(1) = f(g(1)) : on applique d'abord g, puis f"],
        [W(2, "2x + 6 = 10, donc x = 2. En effet, f(2) = 10, donc f⁻¹(10) = 2."),
          W(16, "g(1) = 4, puis f(4) = 16. (Dans l'autre ordre, (g ∘ f)(1) = 4 : l'ordre compte.)")]),
    },
    polymp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si \\(P(a) = 0\\), \\(a\\) est un zéro et \\(P\\) est divisible par \\((x - a)\\). Le reste de la division de \\(P\\) par \\((x - a)\\) est \\(P(a)\\) (théorème du reste). Une fois \\(P\\) factorisé, on lit ses zéros sur chaque facteur.", exemple: ["\\(x^3 + 2x^2 - 5\\) divisé par \\((x - 2)\\) : reste \\(P(2) = 11\\)", "\\(x^3 - 7x + 6 = (x - 1)(x + 3)(x - 2)\\) : zéros \\(1\\), \\(2\\), \\(-3\\)"] },
      predict: { q: "\\(P(x) = x^3 - 2x^2 - 5x + 6\\). Que vaut \\(P(1)\\) ?", choices: ["0", "6", "−2"], good: 0,
        why: "P(1) = 1 − 2 − 5 + 6 = 0 : 1 est un zéro de P, donc P est divisible par (x − 1)." },
      defis: ["Quel est le reste de la division de \\(P(x) = x^3 + 2x^2 - 5\\) par \\((x - 2)\\) ?", "\\(x^3 - 7x + 6 = (x - 1)(x^2 + x - 6)\\). Quel est le plus petit zéro ?"],
      play: guide(["Théorème du reste : le reste de la division par (x − 2) vaut P(2)", "Factorise x² + x − 6 : deux nombres de produit −6 et de somme 1"],
        [W(11, "P(2) = 8 + 8 − 5 = 11 : c'est le reste (2 n'est donc pas un zéro)."),
          W(-3, "x² + x − 6 = (x + 3)(x − 2) : les zéros sont 1, 2 et −3. Le plus petit : −3.")]),
    },
    explogfn: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(f(x) = a \\cdot b^x\\) (\\(b > 0\\)) : \\(f(0) = a\\), et \\(f(x)\\) est multiplié par \\(b\\) quand x augmente de 1. \\(\\log_b(x - h)\\) n'existe que pour \\(x > h\\) ; il s'annule quand \\(x - h = 1\\).", exemple: ["Par \\((0 ; 5)\\) et \\((1 ; 15)\\) : \\(a = 5\\), \\(b = 15 \\div 5 = 3\\)", "\\(\\log_2(x - 3) = 0\\) quand \\(x - 3 = 1\\) : zéro \\(x = 4\\)"] },
      predict: { q: "\\(f(x) = 3 \\cdot 2^x\\). Quand \\(x\\) augmente de 1, \\(f(x)\\) est…", choices: ["multiplié par 2", "augmenté de 2", "multiplié par 3"], good: 0,
        why: "f(x + 1) = 3 · 2 puissance (x + 1) = 2 · f(x) : la base b = 2 est le facteur multiplicatif. Le 3 est la valeur de départ, f(0)." },
      defis: ["\\(f(x) = a \\cdot b^x\\) passe par \\((0 \\,;\\, 5)\\) et \\((1 \\,;\\, 15)\\). Que vaut \\(b\\) ?", "\\(g(x) = \\log_2(x - 3)\\). Quel est son zéro ?"],
      play: guide(["f(0) = a = 5, puis f(1) = 5 · b = 15", "g(x) = 0 ⟺ log₂(x − 3) = 0 ⟺ x − 3 = 2⁰ = 1"],
        [W(3, "a = 5 et 5b = 15, donc b = 3, et f(x) = 5 · 3 puissance x."),
          W(4, "x − 3 = 1, donc x = 4. (Domaine de g : x > 3.)")]),
    },
  });

  // =============================== Essaie sur la figure ===============================
  // Droite paramétrique x = −3 + 2t, y = 4 − t dans un repère ; le t proposé place le point M(t).
  {
    const XR = [-4, 7], YR = [-2, 5], U = 25, ml = 20, mt = 12, X = (v) => ml + (v - XR[0]) * U, Y = (v) => mt + (YR[1] - v) * U, Wd = 2 * ml + (XR[1] - XR[0]) * U, Hd = mt + 14 + (YR[1] - YR[0]) * U;
    const P = (t) => [-3 + 2 * t, 4 - t];
    const fig = (s, t) => {
      let g = "";
      for (let v = XR[0]; v <= XR[1]; v++) g += L(X(v), Y(YR[0]), X(v), Y(YR[1]), v ? "f-grid" : "f-line", v ? 0.7 : 1.2);
      for (let v = YR[0]; v <= YR[1]; v++) g += L(X(XR[0]), Y(v), X(XR[1]), Y(v), v ? "f-grid" : "f-line", v ? 0.7 : 1.2);
      g += T(X(1), Y(0) + 12, "1", "middle", 9) + T(X(0) - 4, Y(1) + 3, "1", "end", 9);
      g += `<defs><clipPath id="dp-clip"><rect x="${X(XR[0])}" y="${Y(YR[1])}" width="${X(XR[1]) - X(XR[0])}" height="${Y(YR[0]) - Y(YR[1])}"/></clipPath></defs>`;
      const a = P(-1), b = P(7); g += `<g clip-path="url(#dp-clip)">${L(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), "f-accent", 2.2)}</g>` + T(X(-3) + 6, Y(4) - 6, "A (t = 0)", "start", 10);
      g += `<circle cx="${X(-3)}" cy="${Y(4)}" r="3.5" class="f-dot"/>` + L(X(-3), Y(4), X(-1), Y(3), "f-blue", 2.4) + T(X(-1) + 2, Y(3) - 6, "d = (2 ; −1)", "start", 10, "f-txt f-blue");
      if (s === 0) g += `<circle cx="${X(3)}" cy="${Y(1)}" r="4" fill="none" stroke="var(--ink)" stroke-width="1.6"/>` + T(X(3) + 6, Y(1) - 6, "P(3 ; 1)", "start", 11);
      let out = "";
      if (t !== null) {
        const [mx, my] = P(t), inside = mx >= XR[0] && mx <= XR[1] && my >= YR[0] && my <= YR[1];
        if (inside) g += `<circle cx="${X(mx)}" cy="${Y(my)}" r="5" class="f-accent"/>` + T(X(mx), Y(my) + 16, "M", "middle", 11, "f-txt f-accent");
        out = plain(`t = ${nb(t)} : M(−3 + 2 · ${nb(t)} ; 4 − ${nb(t)}) = <b>M(${nb(mx)} ; ${nb(my)})</b>` + (inside ? "" : " (hors du dessin)"));
      }
      return svg(Wd, Hd, g, "droite paramétrique dans un repère") + out;
    };
    ACTIVE.droiteparam = {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "La droite passant par \\(A\\) de vecteur directeur \\(\\vec{d}\\) : \\(x = x_A + t\\,d_x\\), \\(y = y_A + t\\,d_y\\). Chaque valeur de \\(t\\) donne un point. Un point est sur la droite s'il existe un même \\(t\\) pour toutes les coordonnées. Pour couper l'axe des x, on pose \\(y = 0\\) ; l'axe des y, \\(x = 0\\).", exemple: ["\\(d : x = -3 + 2t\\), \\(y = 4 - t\\) : \\(P(3 ; 1)\\) pour \\(t = 3\\)", "\\(y = 0\\) pour \\(t = 4\\) : \\(d\\) coupe l'axe des x en \\((5 ; 0)\\)"], piege: "Trouve \\(t\\) avec une coordonnée, puis vérifie qu'il donne aussi l'autre." },
      predict: { q: "La droite \\(x = 1 + 2t\\), \\(y = 3 - t\\). Pour \\(t = 2\\), on obtient le point…", choices: ["(5 ; 1)", "(3 ; 2)", "(2 ; 2)"], good: 0,
        why: "On remplace t par 2 dans les deux coordonnées : x = 1 + 2 · 2 = 5 et y = 3 − 2 = 1. (Le point (3 ; 2), c'est t = 1.)" },
      defis: ["La droite d : x = −3 + 2t, y = 4 − t. Quelle valeur de t donne le point P(3 ; 1) ?", "Pour quel t la droite d coupe-t-elle l'axe des x (y = 0) ?", "Pour quel t coupe-t-elle l'axe des y (x = 0) ?"],
      play: hunt({ ask: true, label: "t =", blank: (s) => fig(s, null), show: (t, s) => fig(s, t),
        wins: [W(3, "x : −3 + 2t = 3 donne t = 3 ; y : 4 − 3 = 1 ✓. Le même t convient pour les deux coordonnées : P est sur d."),
          W(4, "y = 0 ⟺ 4 − t = 0 ⟺ t = 4 ; alors x = −3 + 8 = 5 : d coupe l'axe des x en (5 ; 0)."),
          W(1.5, "x = 0 ⟺ −3 + 2t = 0 ⟺ t = 1,5 ; alors y = 4 − 1,5 = 2,5 : d coupe l'axe des y en (0 ; 2,5).")] }),
    };
  }
  // Marée h(t) = 2,5 sin(π/6 · (t − 2)) + 3,5 sur 24 heures ; la réponse tapée se dessine sur le graphique.
  {
    const ml = 30, mb = 22, W0 = 320, H0 = 200, X = (t) => ml + (t / 24) * (W0 - ml - 10), Y = (v) => H0 - mb - (v / 7) * (H0 - mb - 10);
    const h = (t) => 2.5 * Math.sin((Math.PI / 6) * (t - 2)) + 3.5;
    const fig = (s, x) => {
      let g = "";
      for (let t = 0; t <= 24; t += 2) g += L(X(t), Y(0), X(t), Y(7), "f-grid", 0.7) + (t % 4 ? "" : T(X(t), Y(0) + 14, String(t), "middle", 9));
      for (let v = 0; v <= 7; v++) g += L(X(0), Y(v), X(24), Y(v), "f-grid", 0.7) + T(X(0) - 4, Y(v) + 3, String(v), "end", 9);
      g += L(X(0), Y(0), X(24), Y(0), "f-line", 1.2) + L(X(0), Y(0), X(0), Y(7), "f-line", 1.2) + T(X(24), Y(0) - 4, "t (h)", "end", 9) + T(X(0) + 4, Y(7) + 9, "h (m)", "start", 9);
      let p = ""; for (let i = 0; i <= 96; i++) { const t = i / 4; p += (i ? " L" : "M") + X(t).toFixed(1) + "," + Y(h(t)).toFixed(1); }
      g += `<path d="${p}" class="f-accent" fill="none" stroke-width="2.2"/>`;
      let out = "";
      if (x !== null) {
        if (s === 0) { if (x >= 0 && x <= 7) g += L(X(0), Y(x), X(24), Y(x), "f-blue", 1.6) + T(X(24) - 2, Y(x) - 4, "h = " + nb(x), "end", 10, "f-txt f-blue");
          out = plain(`Hauteur ${nb(x)} m : ` + (Math.abs(x - 6) < 1e-9 ? '<b class="act-ok">la ligne touche juste les sommets</b>' : x > 6 ? "la courbe ne monte jamais si haut" : "la courbe passe au-dessus de cette ligne")); }
        else if (s === 1) { const e = 2 + x; if (x > 0 && e <= 24) g += L(X(2), Y(3.5), X(e), Y(3.5), "f-blue", 2.4) + `<circle cx="${X(2)}" cy="${Y(3.5)}" r="4" class="f-dot"/><circle cx="${X(e)}" cy="${Y(3.5)}" r="4" class="f-dot"/>`;
          out = plain(`De t = 2 à t = ${nb(e)} : h(2) = 3,5 m, h(${nb(e)}) ≈ ${nb(Math.round(h(e) * 100) / 100)} m` + (Math.abs(x - 12) < 1e-9 ? ' <b class="act-ok">la courbe recommence exactement</b>' : "")); }
        else { if (x >= 0 && x <= 24) g += L(X(x), Y(0), X(x), Y(7), "f-blue", 1.6) + `<circle cx="${X(x)}" cy="${Y(h(x))}" r="4.5" class="f-dot"/>`;
          out = plain(`t = ${nb(x)} h : h ≈ ${nb(Math.round(h(x) * 100) / 100)} m`); }
      }
      return svg(W0, H0, g, "courbe de la marée sur 24 heures") + out;
    };
    ACTIVE.sinusmp = {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(f(x) = a\\sin(b(x - c)) + d\\) : amplitude \\(|a|\\), période \\(\\frac{2\\pi}{b}\\), déphasage \\(c\\) (si \\(a > 0\\), la courbe coupe l'axe en montant en \\(x = c\\)), axe \\(y = d\\). Valeurs entre \\(d - |a|\\) et \\(d + |a|\\). Le maximum arrive un quart de période après \\(c\\).", exemple: ["Marée \\(h(t) = 2{,}5\\sin\\left(\\frac{\\pi}{6}(t - 2)\\right) + 3{,}5\\) : max 6 m, période 12 h, marée haute en \\(t = 2 + 3 = 5\\) h"] },
      predict: { q: "\\(f(x) = 3\\sin x + 2\\). La plus grande valeur de \\(f\\) est…", choices: ["5", "3", "6"], good: 0,
        why: "sin x est entre −1 et 1, donc 3 sin x est entre −3 et 3 : f est entre 2 − 3 = −1 et 2 + 3 = 5. Amplitude 3, axe y = 2." },
      defis: ["Marée : h(t) = 2,5 sin(π/6 · (t − 2)) + 3,5 (h en m, t en heures). Hauteur maximale de l'eau ?", "Période de la marée, en heures (période = 2π ÷ b) ?", "À quel instant (t > 0) a lieu la première marée haute ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => fig(s, null), show: (x, s) => fig(s, x),
        wins: [W(6, "Axe y = 3,5, amplitude 2,5 : maximum 3,5 + 2,5 = 6 m (et minimum 3,5 − 2,5 = 1 m)."),
          W(12, "b = π/6 : période 2π ÷ (π/6) = 12 heures. Deux marées hautes par jour."),
          W(5, "En t = 2 (le déphasage), la courbe coupe l'axe en montant ; le sommet arrive un quart de période plus tard : 2 + 12 ÷ 4 = 5 h.")] }),
    };
  }

  // =============================== Manipule (manipLesson) ===============================
  if (typeof manipLesson === "undefined") return;

  // ---- Valeur absolue : le point qu'on promène sur la droite graduée (distance au centre) ----
  {
    const X = (v) => 160 + v * 14, LY = 108;
    const E = [{ c: 3, d: 5, txt: "|x − 3| = 5" }, { c: 3, d: 5, txt: "|x − 3| = 5" }, { c: -2, d: 4, txt: "|x + 2| = 4" }];
    const ex = (x, c) => "|" + n0(x) + (c < 0 ? " + " + -c : " − " + c) + "| = |" + n0(x - c) + "| = " + Math.abs(x - c);
    ACTIVE.eqabs = {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(|a - b|\\) est la distance entre \\(a\\) et \\(b\\) ; \\(|x + 2| = |x - (-2)|\\) est la distance entre \\(x\\) et \\(-2\\). \\(|A| = c\\) avec \\(c > 0\\) : \\(A = c\\) ou \\(A = -c\\), deux solutions. Avec \\(c < 0\\) : aucune solution.", exemple: ["\\(|x - 3| = 5\\) : \\(x = 8\\) ou \\(x = -2\\)", "\\(|x + 2| = 4\\) : \\(x = 2\\) ou \\(x = -6\\)", "\\(|2x - 1| = 7\\) : \\(2x - 1 = 7\\) ou \\(2x - 1 = -7\\), \\(x = 4\\) ou \\(x = -3\\)"] },
      predict: { q: "Combien de solutions a l'équation \\(|x - 1| = 4\\) ?", choices: ["2", "1", "aucune"], good: 0,
        why: "|x − 1| est la distance entre x et 1. Deux nombres sont à distance 4 de 1 : 5 (à droite) et −3 (à gauche)." },
      defis: ["|x − 3| est la distance entre x et 3. Glisse le point x pour que cette distance vaille 5.", "Trouve l'autre solution de |x − 3| = 5.", "|x + 2| = |x − (−2)| est la distance entre x et −2. Place x sur une solution de |x + 2| = 4."],
      play: manipLesson({ W: 320, H: 150, aria: "droite graduée avec un point à placer",
        note: "Glisse le point rouge le long de la droite (ou flèches du clavier). On vérifie quand tu le lâches.",
        init: (s, prev) => ({ x: s === 1 && prev ? prev.x : 0, first: s === 1 && prev ? prev.x : null }),
        handles: (st) => [{ x: X(st.x), y: LY, label: "point x = " + n0(st.x), role: "slider", svg: dot("var(--margin)", "x"), R: 24 }],
        move: (st, k, p) => { st.x = clamp(Math.round((p.x - 160) / 14), -10, 10); },
        nudge: (st, k, dx, dy) => { st.x = clamp(st.x + dx + dy, -10, 10); },
        draw: (st, s) => { const c = E[s].c; let g = Tx(8, 18, E[s].txt, "start", 15, ' font-weight="700"') + `<line x1="8" y1="${LY}" x2="312" y2="${LY}" stroke="var(--ink)" stroke-width="1.5"/>`;
          for (let v = -10; v <= 10; v++) g += `<line x1="${X(v)}" y1="${LY - (v % 5 ? 4 : 7)}" x2="${X(v)}" y2="${LY + (v % 5 ? 4 : 7)}" stroke="var(--ink)"/>` + (v % 2 === 0 && v !== c ? T(X(v), LY + 22, n0(v), "middle", 10) : "");
          g += `<circle cx="${X(c)}" cy="${LY}" r="5" fill="var(--ink)"/>` + Tx(X(c), LY + 22, n0(c), "middle", 11, ' font-weight="800"');
          if (st.first !== null && st.first !== undefined) g += `<circle cx="${X(st.first)}" cy="${LY}" r="6" fill="var(--ok)" opacity=".7"/>` + Tx(X(st.first), LY + 36, "trouvé", "middle", 9, ' fill="var(--ok)"');
          const d = Math.abs(st.x - c);
          if (d) g += `<line x1="${X(c)}" y1="${LY - 30}" x2="${X(st.x)}" y2="${LY - 30}" stroke="var(--blue)" stroke-width="3"/><line x1="${X(c)}" y1="${LY - 36}" x2="${X(c)}" y2="${LY - 24}" stroke="var(--blue)" stroke-width="2"/><line x1="${X(st.x)}" y1="${LY - 36}" x2="${X(st.x)}" y2="${LY - 24}" stroke="var(--blue)" stroke-width="2"/>` + Tx((X(c) + X(st.x)) / 2, LY - 38, "distance " + d, "middle", 12, ' font-weight="700" fill="var(--blue)"');
          return g; },
        out: (st, s) => `x = ${n0(st.x)} : <b>${ex(st.x, E[s].c)}</b>`,
        hint: (st, s) => { const { c, d } = E[s];
          if (s === 1 && st.x === st.first) return "C'est la solution déjà trouvée : cherche de l'autre côté de 3.";
          if (s === 2 && Math.abs(st.x - 2) === d && Math.abs(st.x - c) !== d) return "Attention : |x + 2| mesure la distance à −2, pas à 2.";
          const e = Math.abs(st.x - c); return e === d ? "" : "La distance vaut " + e + " : il faut " + d + "."; },
        goal: [(st) => (Math.abs(st.x - 3) === 5 ? "x = " + n0(st.x) + " est à distance 5 de 3 : " + ex(st.x, 3) + ". Il y a une autre solution, de l'autre côté de 3." : ""),
          (st) => (Math.abs(st.x - 3) === 5 && st.x !== st.first ? "Les deux solutions : x = −2 et x = 8, de part et d'autre de 3. Par le calcul : x − 3 = 5 ou x − 3 = −5." : ""),
          (st) => (Math.abs(st.x + 2) === 4 ? "|x + 2| = 4 : x = 2 ou x = −6, à distance 4 de −2. Par le calcul : x + 2 = 4 ou x + 2 = −4." : "")],
        ask: [null, { q: "Sans la droite : combien de solutions a |x + 4| = −2 ?", ans: 0, ok: "Aucune : une valeur absolue est une distance, elle n'est jamais négative.", no: "Une distance peut-elle valoir −2 ?" },
          { q: "Sans la droite : quelle est la plus petite solution de |2x − 1| = 7 ?", ans: -3, ok: "2x − 1 = 7 ou 2x − 1 = −7 : x = 4 ou x = −3. La plus petite : −3.", no: "Écris les deux cas : 2x − 1 = 7 ou 2x − 1 = −7." }] }),
    };
  }

  // ---- Similitude : le niveau du liquide dans un verre conique (volume × k³) ----
  {
    const AX = 120, AY = 232, HP = 200, RP = 92, HC = 12, VF = 640, px = HP / HC;
    const vol = (h) => VF * Math.pow(h / HC, 3);
    const r1 = (v) => nb(Math.round(v * 10) / 10);
    const TG = [80, 270, 10];
    ACTIVE.similmp = {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Deux solides sont semblables si toutes les longueurs sont multipliées par le même rapport \\(k\\). Alors les volumes sont multipliés par \\(k^3\\).", exemple: ["Verre conique rempli à mi-hauteur : \\(\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}\\) du volume", "Rempli à mi-hauteur, il contient 30 mL : plein, \\(8 \\cdot 30 = 240\\) mL"] },
      predict: { q: "Un verre conique est rempli jusqu'à la moitié de sa hauteur. Il contient…", choices: ["la moitié de son volume", "le quart de son volume", "le huitième de son volume"], good: 2,
        why: "Le liquide forme un petit cône semblable au verre, de rapport k = 1/2 : les longueurs sont divisées par 2, le volume par 2³ = 8." },
      defis: ["Le verre plein (12 cm de haut) contient 640 mL. Tire la surface du liquide pour qu'il contienne 80 mL.", "Remplis-le pour qu'il contienne 270 mL.", "Et pour qu'il ne contienne que 10 mL."],
      play: manipLesson({ W: 320, H: 250, aria: "verre conique avec un niveau de liquide à régler",
        note: "Glisse la poignée rouge le long de la règle : le niveau du liquide suit. On vérifie quand tu la lâches.",
        init: (s, prev) => ({ h: prev ? prev.h : 12 }),
        handles: (st) => [{ x: 262, y: AY - st.h * px, label: "niveau du liquide, " + nb(st.h) + " cm", role: "slider", svg: dot("var(--margin)", ""), R: 24 }],
        move: (st, k, p) => { st.h = clamp(Math.round(((AY - p.y) / px) * 2) / 2, 0.5, 12); },
        nudge: (st, k, dx, dy) => { st.h = clamp(st.h + 0.5 * (dx + dy), 0.5, 12); },
        draw: (st) => { const yl = AY - st.h * px, w = (RP * st.h) / HC;
          let g = `<polygon points="${AX},${AY} ${AX - w},${yl} ${AX + w},${yl}" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.5"/>`;
          g += `<polyline points="${AX - RP},${AY - HP} ${AX},${AY} ${AX + RP},${AY - HP}" fill="none" stroke="var(--ink)" stroke-width="2"/>` + L(AX - RP, AY - HP, AX + RP, AY - HP, "f-line", 1);
          g += `<line x1="${AX + w}" y1="${yl}" x2="262" y2="${yl}" stroke="var(--margin)" stroke-dasharray="4 3"/>` + `<line x1="248" y1="${AY}" x2="248" y2="${AY - HP}" stroke="var(--ink)" stroke-width="1.5"/>`;
          for (let c = 0; c <= HC; c++) g += `<line x1="${c % 2 ? 244 : 240}" y1="${AY - c * px}" x2="248" y2="${AY - c * px}" stroke="var(--ink)"/>` + (c % 2 ? "" : T(236, AY - c * px + 4, String(c), "end", 9));
          g += T(248, AY + 14, "cm", "middle", 9) + Tx(AX, AY - HP - 6, "plein : 640 mL", "middle", 11, ' fill="var(--ink-soft)"');
          return g; },
        out: (st) => { const k = st.h / HC; return `h = ${nb(st.h)} cm : k = ${nb(st.h)} ÷ 12 ≈ ${nb(Math.round(k * 1000) / 1000)} ; volume = k³ · 640 ≈ <b>${r1(vol(st.h))} mL</b>`; },
        hint: (st, s) => { const v = vol(st.h), t = TG[s];
          if (s === 0 && st.h === 1.5) return "Hauteur divisée par 8 : le volume est divisé par bien plus. Le volume suit k³, pas k.";
          return Math.abs(v - t) < 1e-9 ? "" : v < t ? "Pas assez : monte le niveau." : "Trop : baisse le niveau."; },
        goal: [(st) => (st.h === 6 ? "h = 6 cm : k = 0,5 et 0,5³ = 0,125, soit 640 ÷ 8 = 80 mL. À mi-hauteur, le verre n'est rempli qu'au huitième !" : ""),
          (st) => (st.h === 9 ? "h = 9 cm : k = 0,75 et 0,75³ = 0,421875 : 0,421875 · 640 = 270 mL. Aux trois quarts de la hauteur, moins de la moitié du volume." : ""),
          (st) => (st.h === 3 ? "h = 3 cm : k = 0,25 et 0,25³ = 1/64 : 640 ÷ 64 = 10 mL." : "")],
        ask: [{ q: "Sans la figure : un verre conique de 10 cm, rempli jusqu'à 5 cm, contient 30 mL. Combien contient-il plein (en mL) ?", ans: 240, ok: "k = 0,5, le volume est divisé par 8 : plein, il contient 8 · 30 = 240 mL.", no: "Le liquide est un cône de rapport 1/2 : son volume est 2³ = 8 fois plus petit que le verre plein." }, null,
          { q: "Sans la figure : jusqu'à quelle hauteur (au dixième de cm) faut-il remplir ce verre de 12 cm pour qu'il soit à moitié plein ?", ans: 9.5, ok: "k³ = 0,5, donc k = ∛0,5 ≈ 0,794 et h ≈ 0,794 · 12 ≈ 9,5 cm.", no: "Le volume est multiplié par k³ = 0,5 : calcule k = ∛0,5, puis h = 12k." }] }),
    };
  }

  // ---- Vecteurs : la flèche qu'on tire sur le quadrillage ----
  {
    const U = 26, XR = [-1, 9], YR = [-3, 6], OX = 22 + U, OY = 18 + 6 * U, X = (x) => OX + x * U, Y = (y) => OY - y * U;
    const Wd = X(XR[1]) + 18, Hd = Y(YR[0]) + 14;
    const P3 = { A: [0, 0], B: [5, 1], C: [7, 4] };
    const arrow = (P, Q, col) => { const x1 = X(P[0]), y1 = Y(P[1]), x2 = X(Q[0]), y2 = Y(Q[1]), l = Math.hypot(x2 - x1, y2 - y1); if (l < 1) return ""; const ux = (x2 - x1) / l, uy = (y2 - y1) / l;
      return `<line x1="${x1}" y1="${y1}" x2="${(x2 - ux * 9).toFixed(1)}" y2="${(y2 - uy * 9).toFixed(1)}" stroke="${col}" stroke-width="3"/><path d="M${x2},${y2} L${(x2 - ux * 12 - uy * 6).toFixed(1)},${(y2 - uy * 12 + ux * 6).toFixed(1)} L${(x2 - ux * 12 + uy * 6).toFixed(1)},${(y2 - uy * 12 - ux * 6).toFixed(1)} Z" fill="${col}"/>`; };
    const pt = (P, lab, col = "var(--ink)") => `<circle cx="${X(P[0])}" cy="${Y(P[1])}" r="4.5" fill="${col}"/>` + Tx(X(P[0]) - 7, Y(P[1]) - 7, lab, "end", 13, ' font-weight="700"');
    const cp = (v) => "(" + n0(v[0]) + " ; " + n0(v[1]) + ")";
    const norm = (v) => { const q = v[0] * v[0] + v[1] * v[1], r = Math.sqrt(q); return Number.isInteger(r) ? String(r) : "√" + q + " ≈ " + nb(Math.round(r * 100) / 100); };
    ACTIVE.vectmp = {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\overrightarrow{AB}\\) a pour composantes \\(B - A\\) (arrivée moins départ). Norme \\(\\|\\vec{u}\\| = \\sqrt{x^2 + y^2}\\). ABCD parallélogramme \\(\\iff \\overrightarrow{AD} = \\overrightarrow{BC}\\)." },
      predict: { q: "\\(A(1 \\,;\\, 2)\\) et \\(B(4 \\,;\\, 6)\\). Les composantes du vecteur \\(\\overrightarrow{AB}\\) sont…", choices: ["(3 ; 4)", "(−3 ; −4)", "(5 ; 8)"], good: 0,
        why: "AB = B − A, arrivée moins départ : (4 − 1 ; 6 − 2) = (3 ; 4). Pour aller de A à B : 3 vers la droite, 4 vers le haut." },
      defis: ["A(1 ; 1) est fixe. Glisse la pointe B pour que le vecteur AB ait les composantes (3 ; −2).", "Place B pour que la norme de AB vaille 5, sans aller tout droit (deux composantes non nulles).", "Voici A(0 ; 0), B(5 ; 1) et C(7 ; 4). Place D pour que ABCD soit un parallélogramme."],
      play: manipLesson({ W: Wd, H: Hd, aria: "quadrillage avec un vecteur à régler",
        note: (st, s) => (s === 2 ? "Glisse le point D (ou flèches du clavier)." : "Glisse la pointe B de la flèche (ou flèches du clavier). On vérifie quand tu la lâches."),
        init: (s) => (s === 2 ? { D: [1, 5] } : { B: s === 0 ? [5, 3] : [3, 2] }),
        handles: (st, s) => { const P = s === 2 ? st.D : st.B; return [{ x: X(P[0]), y: Y(P[1]), label: (s === 2 ? "point D " : "pointe B ") + cp(P), svg: dot("var(--margin)", s === 2 ? "D" : "B") }]; },
        move: (st, k, p, s) => { const q = [clamp(Math.round((p.x - OX) / U), XR[0], XR[1]), clamp(Math.round((OY - p.y) / U), YR[0], YR[1])]; if (s === 2) st.D = q; else st.B = q; },
        nudge: (st, k, dx, dy, s) => { const P = s === 2 ? st.D : st.B, q = [clamp(P[0] + dx, XR[0], XR[1]), clamp(P[1] + dy, YR[0], YR[1])]; if (s === 2) st.D = q; else st.B = q; },
        draw: (st, s) => { let g = "";
          for (let x = XR[0]; x <= XR[1]; x++) g += L(X(x), Y(YR[0]), X(x), Y(YR[1]), x ? "f-grid" : "f-line", x ? 0.7 : 1.3);
          for (let y = YR[0]; y <= YR[1]; y++) g += L(X(XR[0]), Y(y), X(XR[1]), Y(y), y ? "f-grid" : "f-line", y ? 0.7 : 1.3);
          g += T(X(1), Y(0) + 12, "1", "middle", 9) + T(X(0) - 4, Y(1) + 3, "1", "end", 9);
          if (s < 2) return g + arrow([1, 1], st.B, "var(--blue)") + pt([1, 1], "A");
          const { A, B, C } = P3, D = st.D;
          g += `<polygon points="${[A, B, C, D].map((P) => X(P[0]) + "," + Y(P[1])).join(" ")}" fill="var(--blue-soft)" stroke="var(--ink-soft)" stroke-dasharray="4 3"/>`;
          return g + arrow(B, C, "var(--blue)") + arrow(A, D, "var(--margin)") + pt(A, "A") + pt(B, "B") + pt(C, "C"); },
        out: (st, s) => { if (s < 2) { const v = [st.B[0] - 1, st.B[1] - 1]; return `AB = B − A = (${n0(st.B[0])} − 1 ; ${n0(st.B[1])} − 1) = <b>${cp(v)}</b> · norme ‖AB‖ = ${norm(v)}`; }
          const { A, B, C } = P3, bc = [C[0] - B[0], C[1] - B[1]], ad = [st.D[0] - A[0], st.D[1] - A[1]];
          return `<span style="color:var(--blue)">BC = C − B = <b>${cp(bc)}</b></span><br><span style="color:var(--margin)">AD = D − A = <b>${cp(ad)}</b></span>` + (ad[0] === bc[0] && ad[1] === bc[1] ? ' <b class="act-ok">✓ mêmes composantes</b>' : ""); },
        hint: (st, s) => { if (s === 0) { const v = [st.B[0] - 1, st.B[1] - 1]; return v[0] === -3 && v[1] === 2 ? "C'est A − B : le vecteur AB va de A vers B, arrivée moins départ." : ""; }
          if (s === 1) { const v = [st.B[0] - 1, st.B[1] - 1]; return v[0] * v[0] + v[1] * v[1] === 25 && !(v[0] && v[1]) ? "Bien, mais tout droit : cherche avec deux composantes non nulles (pense au triangle 3, 4, 5)." : ""; }
          return "AD doit avoir les mêmes composantes que BC."; },
        goal: [(st) => (st.B[0] === 4 && st.B[1] === -1 ? "AB = (3 ; −2) : depuis A, 3 vers la droite et 2 vers le bas. B = A + (3 ; −2) = (4 ; −1)." : ""),
          (st) => { const v = [st.B[0] - 1, st.B[1] - 1]; return v[0] && v[1] && v[0] * v[0] + v[1] * v[1] === 25 ? "‖AB‖ = √(" + v[0] * v[0] + " + " + v[1] * v[1] + ") = √25 = 5 : c'est Pythagore sur les composantes " + cp(v) + "." : ""; },
          (st) => (st.D[0] === 2 && st.D[1] === 3 ? "AD = BC = (2 ; 3) : [AD] et [BC] sont parallèles et de même longueur, ABCD est un parallélogramme. D = A + BC = (2 ; 3)." : "")],
        ask: [null, { q: "Sans la figure : quelle est la norme du vecteur (6 ; −8) ?", ans: 10, ok: "√(36 + 64) = √100 = 10.", no: "Norme = √(x² + y²)." },
          { q: "Sans la figure : A(2 ; 1), B(5 ; 3) et C(6 ; 7). Quelle est l'ordonnée de D pour que ABCD soit un parallélogramme ?", ans: 5, ok: "BC = (1 ; 4), donc D = A + BC = (3 ; 5) : ordonnée 5.", no: "Il faut AD = BC = C − B, puis D = A + BC." }] }),
    };
  }
})();

