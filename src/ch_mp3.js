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
      () => { const v = pk([10, 12, 15, 20, 24, 30]), w = pk([2, 3, 4, 5, 6, 10]), t = pk([1, 2]), d = (t * v * (v + w)) / w; if (!Number.isInteger(d) || d > 600) return null;
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
        return QN(nom + " a une demi-vie de " + M(N(Tt)) + " " + u + ". Après combien de " + u + " ne reste-t-il que " + M(p + "\\,\\%") + " de la quantité de départ (au dixième) ?", t, M("0{,}5^{t / " + N(Tt) + "} = " + N(p / 100)) + " : " + M("\\frac{t}{" + N(Tt) + "} = \\frac{\\log " + N(p / 100) + "}{\\log 0{,}5} \\approx " + D(r, 0.01)) + ", " + M("t \\approx " + D(t, 0.1)) + " " + u + ".",
          { ctx: "demi-vie-temps", round: 0.1, guide: [G("On résout " + M("0{,}5^{t / " + N(Tt) + "} = " + N(p / 100)) + ". " + M("\\frac{t}{" + N(Tt) + "} = \\frac{\\log " + N(p / 100) + "}{\\log 0{,}5}") + " (au centième) ?", r, M(D(r, 0.01)) + ".", 0.01), G(M("t") + " (au dixième) ?", t, M(D(t, 0.1)) + " " + u + ".", 0.1)],
            traps: [TR((Tt * (100 - p)) / 50, "La décroissance n'est pas linéaire : utilise le logarithme."), TR(-t, "Les deux logarithmes sont négatifs : le quotient est positif."), TR(r, "C'est le nombre de demi-vies ; multiplie par " + T(Tt) + ".")] }); },
      () => { const C0 = pk([2000, 5000, 8000, 10000]), rr = pk([1.5, 2, 2.5, 3, 4]), n = R.int(3, 10), C1 = Math.round(C0 * (1 + rr / 100) ** n * 100) / 100, q = C1 / C0, t = 100 * (q ** (1 / n) - 1);
        return QN("Un capital de " + M(N(C0)) + " CHF placé à intérêts composés vaut " + M(N(C1)) + " CHF après " + M(n) + " ans. Quel est le taux annuel (en %, au centième) ?", t, M("(1 + t)^{" + n + "} = \\frac{" + N(C1) + "}{" + N(C0) + "}") + ", " + M("1 + t = \\sqrt[" + n + "]{" + D(q, 0.0001) + "}") + ", taux " + M("\\approx " + D(t, 0.01) + "\\,\\%") + ".",
          { ctx: "taux", round: 0.01, guide: [G("Facteur total " + M("\\frac{" + N(C1) + "}{" + N(C0) + "}") + " (au millième) ?", q, M(D(q, 0.001)) + ".", 0.001), G("Racine " + n + "e moins 1, en % (au centième) ?", t, M(D(t, 0.01) + "\\,\\%") + ".", 0.01)],
            traps: [TR((100 * (q - 1)) / n, "Ce serait le taux d'intérêts simples ; avec les intérêts composés, prends la racine " + n + "e."), TR(100 * (q - 1), "C'est l'augmentation totale sur " + n + " ans.")] }); },
      () => { const car = R.rand() < 0.5, p = car ? pk([10, 12, 15, 20, 25]) : pk([10, 15, 20, 25, 30]), [qv, qt] = car ? pk([[0.5, "la moitié"], [0.25, "le quart"], [1 / 3, "le tiers"]]) : pk([[0.1, "10 %"], [0.2, "20 %"], [0.05, "5 %"]]), f = 1 - p / 100, x = l10(qv) / l10(f), n = Math.ceil(x); if (Number.isInteger(r6(x))) return null;
        return QN(car ? "Une machine perd " + M(p + "\\,\\%") + " de sa valeur chaque année. Après combien d'années entières vaut-elle moins de " + qt + " de son prix d'achat ?" : "Le corps élimine " + M(p + "\\,\\%") + " d'un médicament par heure. Après combien d'heures entières en reste-t-il moins de " + qt + " de la dose ?", n,
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
      () => { const [h1, h2] = pk([[20, 30], [10, 20], [12, 18], [15, 30], [16, 24], [30, 15], [20, 10]]), k = h2 / h1, V1 = pk([0.5, 0.25, 0.75, 1, 1.5, 2]), V2 = V1 * k ** 3;
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
