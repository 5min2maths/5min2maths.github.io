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
  const T = (v) => N(v).replace("{,}", ",").replace(/\\text\{'\}/g, "'"); // texte simple
  const fT = (v) => { const d = den(v); v = r6(v); if (d === 1 || !d || d > 60) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pT = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const tm = (c, v, first) => { if (!c) return ""; const a = Math.abs(c), s = c < 0 ? (first ? "-" : " - ") : first ? "" : " + "; return s + (v && a === 1 ? "" : fT(a)) + v; };
  const polyT = (cs, x = "x") => { const d = cs.length - 1; let o = ""; cs.forEach((c, i) => { const p = d - i; o += tm(c, p === 0 ? "" : p === 1 ? x : x + "^{" + p + "}", o === ""); }); return o || "0"; };
  const lin = (a, b, x = "x") => polyT([a, b], x);
  const D = (v, s) => N(Math.round(v / s) * s); // valeur arrondie au pas s, en TeX
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
      () => { const b = pk([2, 3, 4, 5, 10]), n = pk([2, 3]), bn = b ** n;
        return QN("Calcule " + M(b + "^{-" + n + "}") + ". (fraction)", 1 / bn, "Un exposant négatif donne l'inverse : " + M(b + "^{-" + n + "} = \\frac{1}{" + b + "^{" + n + "}} = \\frac{1}{" + bn + "}") + ".",
          { ctx: "negatif", guide: [G("On écrit " + M("\\frac{1}{" + b + "^{" + n + "}}") + ". Que vaut " + M(b + "^{" + n + "}") + " ?", bn, M(bn) + "."), G("Résultat (fraction) ?", 1 / bn, M("\\frac{1}{" + bn + "}") + ".")],
            traps: [TR(-bn, "Exposant négatif ne veut pas dire nombre négatif : c'est l'inverse."), TR(-b * n, "b^(−n) = 1 ÷ b^n."), TR(bn, "Il faut prendre l'inverse.")] }); },
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
      () => { const N0 = pk([100, 200, 250, 500, 50]), Tt = pk([2, 3, 4, 5, 6]), k = R.int(3, 6), t = k * Tt, Nt = N0 * 2 ** k;
        return QN("Une population de " + M(N0) + " bactéries double toutes les " + M(Tt) + " heures. Combien y en a-t-il après " + M(t) + " heures ?", Nt, M(t + " \\div " + Tt + " = " + k) + " doublements : " + M(N0 + " \\cdot 2^{" + k + "} = " + N(Nt)) + ".",
          { ctx: "doublement", guide: [G("Nombre de doublements (" + M(t + " \\div " + Tt) + ") ?", k, M(k) + "."), G("Population ?", Nt, M(N0 + " \\cdot 2^{" + k + "} = " + N(Nt)) + ".")],
            traps: [TR(N0 * 2 * k, "Doubler " + k + " fois, c'est multiplier par 2^" + k + ", pas par 2 · " + k + "."), TR(N0 * 2 ** t, "Il y a un doublement toutes les " + Tt + " h, pas chaque heure."), TR(N0 * (k + 1), "Chaque doublement multiplie par 2.")] }); },
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
      () => { const r = R.int(2, 9), h = R.int(3, 15), dia = R.rand() < 0.4; if (h === r) return null; const V = PI * r * r * h;
        return QN("Calcule le volume d'un cylindre de " + (dia ? "diamètre " + M(2 * r + "\\text{ cm}") : "rayon " + M(r + "\\text{ cm}")) + " et de hauteur " + M(h + "\\text{ cm}") + " (au centième).", V, M("V = \\pi r^2 h = \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + r * r * h + "\\pi \\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: "cylindre", round: 0.01, guide: [G((dia ? "Rayon ? Puis aire" : "Aire") + " de la base " + M("\\pi r^2") + " (au centième) ?", PI * r * r, M(r * r + "\\pi \\approx " + D(PI * r * r, 0.01)) + ".", 0.01), G("Volume (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR(2 * PI * r * h, "2πrh est l'aire latérale ; le volume est πr²h."), TR(V / 3, "Le ÷ 3, c'est pour le cône."), dia ? TR(PI * 4 * r * r * h, "Le rayon est la moitié du diamètre.") : null] }); },
      () => { const c = R.int(3, 12), h = 3 * R.int(1, 5), V = (c * c * h) / 3;
        return QN("Calcule le volume d'une pyramide à base carrée de côté " + M(c + "\\text{ cm}") + " et de hauteur " + M(h + "\\text{ cm}") + ".", V, M("V = \\frac{A_{\\text{base}} \\cdot h}{3} = \\frac{" + c * c + " \\cdot " + h + "}{3} = " + N(V) + cm3) + ".",
          { ctx: "pyramide", guide: [G("Aire de la base ?", c * c, M(c + "^2 = " + c * c + cm2) + "."), G("Volume ?", V, M(N(V) + cm3) + ".")],
            traps: [TR(c * c * h, "Pyramide : on divise par 3."), TR((c * c * h) / 2, "Pyramide : on divise par 3, pas par 2."), TR((c * h) / 3, "La base est un carré : aire = côté².")] }); },
      () => { const r = R.int(2, 9), h = R.int(3, 15); if (h === r) return null; const V = (PI * r * r * h) / 3;
        return QN("Calcule le volume d'un cône de rayon " + M(r + "\\text{ cm}") + " et de hauteur " + M(h + "\\text{ cm}") + " (au centième).", V, M("V = \\frac{\\pi r^2 h}{3} = \\frac{" + r * r * h + "\\pi}{3} \\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: "cone", round: 0.01, guide: [G("Aire de la base " + M("\\pi r^2") + " (au centième) ?", PI * r * r, M(D(PI * r * r, 0.01)) + ".", 0.01), G("Volume (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR(PI * r * r * h, "Cône : on divise par 3."), TR((PI * r * h) / 3, "La base est un disque : aire πr².")] }); },
      () => { const d = pk([4, 6, 8, 10, 12, 20, 30]), r = d / 2, V = (4 / 3) * PI * r ** 3;
        return QN("Calcule le volume d'une boule de diamètre " + M(d + "\\text{ cm}") + " (au centième).", V, "Rayon " + M(r) + " cm : " + M("V = \\frac{4}{3}\\pi \\cdot " + r + "^3 \\approx " + D(V, 0.01) + cm3) + ".",
          { ctx: "boule", round: 0.01, guide: [G("Rayon ?", r, M(r + "\\text{ cm}") + "."), G("Volume " + M("\\frac{4}{3}\\pi r^3") + " (au centième) ?", V, M(D(V, 0.01) + cm3) + ".", 0.01)],
            traps: [TR((4 / 3) * PI * d ** 3, "Le rayon est la moitié du diamètre."), TR(4 * PI * r * r, "4πr² est l'aire de la sphère ; le volume est 4/3 πr³."), TR(PI * r ** 3, "N'oublie pas le facteur 4/3.")] }); },
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
      () => { const k = pk([1.5, 2, 2.5, 3, 4, 1.2]), L1 = R.int(2, 10), m = R.int(2, 12), L2 = r6(k * L1); if (m === L1 || !Number.isInteger(L2 * 10) || !Number.isInteger(r6(m * k * 10))) return null;
        return QN("Deux triangles sont semblables. Un côté mesure " + M(L1 + "\\text{ cm}") + " sur le petit et " + M(N(L2) + "\\text{ cm}") + " sur le grand. Un autre côté du petit mesure " + M(m + "\\text{ cm}") + " : combien mesure le côté correspondant du grand ?", m * k, "Rapport " + M("k = " + N(L2) + " \\div " + L1 + " = " + N(k)) + " ; " + M(m + " \\cdot " + N(k) + " = " + N(m * k)) + " cm.",
          { ctx: "longueur", guide: [G("Rapport de similitude " + M("k") + " (grand ÷ petit) ?", k, M(N(k)) + "."), G("Longueur cherchée ?", m * k, M(N(m * k)) + " cm.")],
            traps: [TR(m + L2 - L1, "Agrandissement : on multiplie par k, on n'ajoute pas."), TR(m / k, "Le grand est plus grand : on multiplie par k.")] }); },
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

// MP 4e (grade 15, filière « mp ») · chantier G du 24.11 (agent mp34). Calé sur les polycopiés CFPT MP4
// (CFPT/MP4/Polycops de cours, chapitres E à J) et le référentiel MP (S7.CO, S7.VE, S7.DP, S8.IN, S8.FP, S8.FS).
// Neuf notions nouvelles (identifiants propres à la MP) :
//   E. coordmp (distance, milieu, polaires, espace) ; F. vectmp (composantes, opérations, norme, colinéarité),
//   scalmp (produit scalaire, angle, orthogonalité, travail) ; G. droiteparam (droites paramétriques) ;
//   H. ineqmp (inéquations, tableau des signes) ; I. fctmp (réciproque, parité, transformations, composition),
//   polymp (polynômes : zéros, division, signe) ; J. sinusmp (fonctions sinusoïdales), explogfn (fonctions exp. et log.).
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
      () => { const F = pk([20, 50, 80, 100, 150, 200]), dd = pk([5, 10, 12, 20, 25, 30]), th = pk([20, 25, 30, 35, 40, 45, 60]), W = F * dd * Math.cos(th / DEG);
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
      () => { const v = R.int(2, 9), x0 = R.int(2, 6), par = R.rand() < 0.5; if (v === x0) return null;
        return QN("La fonction " + M("f") + " est " + (par ? "paire" : "impaire") + " et " + M("f(" + x0 + ") = " + v) + ". Que vaut " + M("f(-" + x0 + ")") + " ?", par ? v : -v, (par ? "Paire : " + M("f(-x) = f(x)") : "Impaire : " + M("f(-x) = -f(x)")) + ", donc " + M("f(-" + x0 + ") = " + (par ? v : -v)) + ".",
          { ctx: "parite", shownOk: true, guide: [G("Rappel : " + (par ? "paire, " + M("f(-x) = f(x)") : "impaire, " + M("f(-x) = -f(x)")) + ". " + M("f(-" + x0 + ")") + " = ?", par ? v : -v, M(par ? v : -v) + ".")],
            traps: [TR(par ? -v : v, par ? "Paire : symétrie par rapport à l'axe vertical, f(−x) = f(x)." : "Impaire : symétrie par rapport à l'origine, f(−x) = −f(x)."), TR(-x0, "On demande l'image f(−" + x0 + ").")] }); },
      () => { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-9, 9), x0 = nz(-6, 6), y = a * x0 + b;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Calcule " + M("f^{-1}(" + y + ")") + ".", x0, M("f^{-1}(" + y + ")") + " est le nombre dont l'image vaut " + M(y) + " : " + M(lin(a, b) + " = " + y) + ", " + M("x = " + x0) + ".",
          { ctx: "reciproque-valeur", guide: [G("On résout " + M(lin(a, b) + " = " + y) + " : " + M(a + "x") + " = ?", y - b, M(y - b) + "."), G(M("x") + " = ?", x0, M(x0) + ".")],
            traps: [TR(a * y + b, "C'est f(" + y + ") ; la réciproque fait le chemin inverse."), TR(r6((y + b) / a), "On retire " + b + ", puis on divise.")] }); },
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
      () => { const r1 = nz(-4, 4), r2 = nz(-4, 4); if (r1 === r2) return null; const m = r1 + r2, h = -r1 * r2, sol = [r1, r2];
        return QS("Trouve les abscisses des points d'intersection des graphes de " + M("f(x) = x^2") + " et " + M("g(x) = " + lin(m, h)) + ".", sol, M("x^2 = " + lin(m, h)) + " donne " + M(polyT([1, -m, -h]) + " = 0") + ", " + M("x = " + Math.min(r1, r2)) + " ou " + M("x = " + Math.max(r1, r2)) + ".",
          { ctx: "intersection-graphes", guide: [G("On résout " + M(polyT([1, -m, -h]) + " = 0") + ". Discriminant ?", m * m + 4 * h, M(m * m + 4 * h) + "."), GSet("Abscisses des points d'intersection ?", sol, M(setT(sol)) + ".")],
            traps: [TS([-r1, -r2], "Attention aux signes des solutions."), TS([r1 * r1, r2 * r2], "On demande les abscisses x, pas les ordonnées.")] }); },
    ],
  };

  // ===================================== I2. polymp : polynômes =====================================
  const expand = (roots, a = 1) => roots.reduce((cs, r) => { const o = cs.concat(0); for (let i = o.length - 1; i > 0; i--) o[i] -= r * o[i - 1]; return o; }, [a]);
  const pv = (cs, x) => cs.reduce((s, c) => s * x + c, 0);
  const pE = (cs) => polyT(cs).replace(/\^\{(\d+)\}/g, "^$1").replace(/(\d)x/g, "$1*x").replace(/\s+/g, "");
  const PO = {
    1: [
      () => { const cs = [pk([1, 2, -1]), R.int(-4, 4), R.int(-6, 6), nz(-9, 9)], x0 = nz(-3, 3), v = pv(cs, x0); if ([0, 1, -1].includes(v)) return null;
        return QN("Soit " + M("P(x) = " + polyT(cs)) + ". Calcule " + M("P(" + x0 + ")") + ".", v, M("P(" + x0 + ") = " + v) + ".",
          { ctx: "valeur", guide: [G("Terme en " + M("x^3") + " pour " + M("x = " + x0) + " (avec son coefficient) ?", cs[0] * x0 ** 3, M(cs[0] * x0 ** 3) + "."), G(M("P(" + x0 + ")") + " ?", v, M(v) + ".")],
            traps: [TR(pv(cs, -x0), "Remplace x par " + x0 + " (attention au signe)."), TR(cs[0] * 3 * x0 + cs[1] * 2 * x0 + cs[2] * x0 + cs[3], "x³ = x · x · x, pas 3x.")] }); },
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
      () => { const a = nz(-5, 5), b = nz(-5, 5), k = pk([2, 3, -2, -3]), p = k * a, m = k * b, c = nz(-9, 9), r = nz(-9, 9); if (Math.abs(m) < 2 || Math.abs(a) === Math.abs(b) || r === k * c) return null;
        const e1 = tm(a, "x", true) + tm(b, "y") + " = " + c, e2 = tm(p, "x", true) + " + my = " + r;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites " + M(e1) + " et " + M(e2) + " sont-elles parallèles ?", m,
          "Parallèles : coefficients de x et de y proportionnels. " + M(p + " = " + fT(k) + " \\cdot " + pT(a)) + ", donc " + M("m = " + fT(k) + " \\cdot " + pT(b) + " = " + m) + ".",
          { ctx: "parallele-cartesienne", guide: [G("Rapport des coefficients de " + M("x") + ", " + M(p + " \\div " + pT(a)) + " ?", k, M(fT(k)) + "."), G(M("m") + " = ?", m, M(fT(k) + " \\cdot " + pT(b) + " = " + m) + ".")],
            traps: [TR(b, "Les coefficients doivent être proportionnels : multiplie b par le même rapport."), TR(r6(b / k), "On multiplie par le rapport, on ne divise pas."), TR(r6((r * b) / c), "Les termes constants ne comptent pas : seules les directions décident.")] })); },
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
      () => { const F = pk([40, 60, 80, 120, 150, 250]), th = pk([15, 20, 25, 35, 40, 50]), it = pk([["On tire une valise avec une force de", "le sol", "valise"], ["Un cheval tire une péniche le long du canal avec une corde ; la force vaut", "le canal", "peniche"], ["Un remonte-pente tire un skieur avec une force de", "la piste", "skieur"]]), h = F * Math.cos(th / DEG);
        return QN(it[0] + " " + M(F + "\\text{ N}") + ", inclinée de " + M(th + "°") + " par rapport à " + it[1] + ". Calcule la composante de la force dans la direction de " + it[1] + " (projection, en N, au dixième).", h,
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

// Chantier MP 2e (20.11, « interactive mp2, fais tout ») : leçons actives (devine / calcule / retiens) pour droites,
// droitesinter, recipaff, trigcercle, trigfn, sinlaw, trigeq, trigassoc, trigeq2, triaire, statfreq, stats, quartiles.
// Même moteur que act_1c.js (outils recopiés) ; réponses tapées (mode ask), nombres décimaux ou fractions.
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // Chercheur : un curseur, l'affichage calculé en direct ; chaque défi vérifie la valeur.
  // Commentaire testeur du 17.11 : « les manipulations où on ne fait que toucher des curseurs n'apportent pas grand-chose ».
  // Mode réponse (o.ask) : l'élève calcule et tape sa réponse ; la figure se met à jour seulement après « Vérifier ».
  // Le curseur reste pour les vraies manipulations (colorier, descendre l'escalier) : o.ask absent.
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Barre de fraction : a/b de la longueur, avec graduations en 1/n
  const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
    if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
    return g; };
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
  // Droite graduée de −12 à 12, avec un départ et une arrivée.
  const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 30, 310, 30); for (let v = -12; v <= 12; v++) g += L(X(v), 26, X(v), 34, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 50, String(v).replace("-", "−"), "middle", 10));
    if (from !== null) g += `<circle cx="${X(from)}" cy="30" r="5" class="f-dot"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},22 Q${(X(from) + X(to)) / 2},2 ${X(to)},22" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="30" r="5" class="f-accent"/>`;
    return svg(320, 58, g, "droite graduée"); };
  // Configuration de Thalès schématique (étiquettes de longueurs).
  const thal = (k, labs) => { const A = [30, 120], B = [290, 140], C = [230, 20], D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
    let g = `<polygon points="${A} ${B} ${C}" class="f-shape"/>` + L(D[0], D[1], E[0], E[1], "f-accent", 2.4) + T(A[0] - 10, A[1] + 4, "A") + T(B[0] + 8, B[1] + 4, "B") + T(C[0] + 8, C[1], "C") + T(D[0], D[1] + 16, "D") + T(E[0] - 8, E[1] - 6, "E");
    const mid = (P, Q, dy) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2 + dy];
    for (const [k2, P, Q, dy] of [["AD", A, D, 16], ["DB", D, B, 16], ["AE", A, E, -8], ["EC", E, C, -8], ["DE", D, E, 0], ["BC", B, C, 0]]) if (labs[k2]) { const [x, y] = mid(P, Q, dy); g += T(x + (k2 === "DE" || k2 === "BC" ? 14 : 0), y, labs[k2], "middle", 12, /\?/.test(labs[k2]) ? "f-txt f-accent" : "f-txt"); }
    return svg(320, 160, g, "configuration de Thalès"); };
  const plain = (html) => `<div class="act-out">${html}</div>`;

  const tu = (x) => " ; tu proposes <b>" + nb(x) + "</b>";
  // Deux droites dans un repère quadrillé ; x proposé : verticale et les deux y lus (droitesinter, 22.11).
  const DI2 = [
    { f: (x) => 2 * x - 1, g: (x) => x + 3, fl: "y = 2x − 1", gl: "y = x + 3", xr: [-1, 8], yr: [-3, 16], gx: 1, gy: 2 },
    { f: (x) => 3 * x - 2, g: (x) => -x + 6, fl: "y = 3x − 2", gl: "y = −x + 6", xr: [-1, 5], yr: [-4, 12], gx: 1, gy: 2 },
    { f: (x) => 20 + 2 * x, g: (x) => 50 + x, fl: "A : 20 + 2x", gl: "B : 50 + x", xr: [0, 50], yr: [0, 130], gx: 5, gy: 10, unit: " CHF" },
  ];
  const twoLines = (s, x) => {
    const D = DI2[s], W0 = 300, H0 = 190, ml = 30, mb = 20, X = (v) => ml + ((v - D.xr[0]) / (D.xr[1] - D.xr[0])) * (W0 - ml - 10), Y = (v) => H0 - mb - ((v - D.yr[0]) / (D.yr[1] - D.yr[0])) * (H0 - mb - 10);
    let g = "";
    for (let v = Math.ceil(D.xr[0] / D.gx) * D.gx; v <= D.xr[1]; v += D.gx) g += L(X(v), Y(D.yr[0]), X(v), Y(D.yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(D.yr[0] / D.gy) * D.gy; v <= D.yr[1]; v += D.gy) g += L(X(D.xr[0]), Y(v), X(D.xr[1]), Y(v), "f-grid", 0.7);
    if (D.yr[0] <= 0) g += L(X(D.xr[0]), Y(0), X(D.xr[1]), Y(0), "f-line", 1.2);
    if (D.xr[0] <= 0) g += L(X(0), Y(D.yr[0]), X(0), Y(D.yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(D.xr[0] / D.gx) * D.gx; v <= D.xr[1]; v += D.gx * (D.gx === 1 ? 1 : 2)) if (v) g += T(X(v), Y(Math.max(D.yr[0], 0)) + 13, nb(v), "middle", 9);
    for (let v = Math.ceil(D.yr[0] / D.gy) * D.gy; v <= D.yr[1]; v += D.gy * 2) if (v) g += T(X(Math.max(D.xr[0], 0)) - 4, Y(v) + 3, nb(v), "end", 9);
    const seg = (f, cls) => L(X(D.xr[0]), Y(f(D.xr[0])), X(D.xr[1]), Y(f(D.xr[1])), cls, 2.2);
    g = `<defs><clipPath id="di-clip"><rect x="${ml}" y="10" width="${W0 - ml - 10}" height="${H0 - mb - 10}"/></clipPath></defs>` + g + `<g clip-path="url(#di-clip)">${seg(D.f, "f-accent")}${seg(D.g, "f-blue")}</g>`;
    g += T(W0 - 12, 22, D.fl, "end", 11, "f-txt f-accent") + T(W0 - 12, 36, D.gl, "end", 11, "f-txt f-blue");
    let out = "";
    if (x !== null && x >= D.xr[0] && x <= D.xr[1]) {
      const y1 = D.f(x), y2 = D.g(x), same = Math.abs(y1 - y2) < 1e-9;
      g += L(X(x), Y(D.yr[0]), X(x), Y(D.yr[1]), "f-line", 1) + `<circle cx="${X(x)}" cy="${Y(y1)}" r="4" class="f-dot"/><circle cx="${X(x)}" cy="${Y(y2)}" r="4" class="f-dot"/>`;
      out = `<div class="act-out">x = ${nb(x)} : ${D.fl.split(":")[0].replace("y = ", "")} donne <b>${nb(y1)}${D.unit || ""}</b>, ${D.gl.split(":")[0].replace("y = ", "")} donne <b>${nb(y2)}${D.unit || ""}</b> → ${same ? '<b class="act-ok">même valeur : c\'est le point commun</b>' : "pas encore le même"}</div>`;
    } else if (x !== null) out = `<div class="act-out">x = ${nb(x)} est hors du graphique : essaie entre ${nb(D.xr[0])} et ${nb(D.xr[1])}.</div>`;
    return svg(W0, H0, g, "deux droites dans un repère") + out;
  };
  Object.assign(ACTIVE, {
    droites: {
      predict: { q: "Une droite passe par (0 ; 1) et (2 ; 5). Sa pente vaut…", choices: ["2", "4", "1/2"], good: 0, why: "Pente = variation verticale ÷ variation horizontale = (5 − 1) ÷ (2 − 0) = 4 ÷ 2 = 2 : quand x augmente de 1, y augmente de 2." },
      defis: ["Pente de la droite qui passe par (1 ; 3) et (4 ; 9) ?", "La droite y = 2x + h passe par (3 ; 4). Que vaut h ?", "Pente d'une droite perpendiculaire à y = 3x − 1 ? (fraction)"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(9 − 3) ÷ (4 − 1)", "4 = 2 · 3 + h", "pente · 3 = −1"][s] + tu(x)),
        wins: [W(2, "6 ÷ 3 = 2."), W(-2, "4 = 6 + h, donc h = −2."), W(-1 / 3, "Perpendiculaires : produit des pentes = −1, donc −1/3.")] }),
    },
    droitesinter: {
      predict: { q: "Les droites y = x + 1 et y = −x + 5 se coupent pour x = …", choices: ["2", "3", "1"], good: 0, why: "Au point d'intersection, les deux y sont égaux : x + 1 = −x + 5, donc 2x = 4 et x = 2 (puis y = 3)." },
      // Défis repris le 22.11 (« les défis, c'est confusing ») : toujours la même tâche (l'abscisse du point commun),
      // avec le graphique des deux droites ; la réponse tapée place une verticale qui montre les deux y.
      defis: ["y = 2x − 1 et y = x + 3 : pour quel x les deux droites donnent-elles le même y ?", "y = 3x − 2 et y = −x + 6 : pour quel x ont-elles le même y ?", "Location d'une voiture. Offre A : 20 CHF + 2 CHF par km ; offre B : 50 CHF + 1 CHF par km. Pour combien de km les deux offres coûtent-elles le même prix ?"],
      play: hunt({ ask: true, label: "x =", blank: (s) => twoLines(s, null), show: (x, s) => twoLines(s, x),
        wins: [W(4, "2 · 4 − 1 = 7 et 4 + 3 = 7 : les droites se coupent en (4 ; 7)."), W(2, "3 · 2 − 2 = 4 et −2 + 6 = 4 : point commun (2 ; 4)."), W(30, "20 + 2 · 30 = 80 CHF et 50 + 30 = 80 CHF : pour 30 km, même prix ; au-delà, B est moins chère.")] }),
    },
    recipaff: {
      predict: { q: "f(x) = 2x + 3. Que vaut f⁻¹(11) ?", choices: ["4", "25", "1/11"], good: 0, why: "f⁻¹(11) est le nombre dont l'image vaut 11 : 2x + 3 = 11, donc x = 4. (25, c'est f(11) ; 1/11 n'a rien à voir.)" },
      defis: ["f(x) = 3x − 6. Que vaut f⁻¹(0) ?", "f(x) = 5x + 2. Que vaut f⁻¹(27) ?", "Le point (2 ; 9) est sur le graphique de f. Le point de f⁻¹ d'ordonnée 2 a quelle abscisse ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["3x − 6 = 0", "5x + 2 = 27", "on échange x et y"][s] + tu(x)),
        wins: [W(2, "3x = 6, donc x = 2."), W(5, "5x = 25, donc x = 5."), W(9, "La réciproque échange les coordonnées : (9 ; 2).")] }),
    },
    trigcercle: {
      predict: { q: "Un demi-tour (180°) vaut combien de radians ?", choices: ["π", "2π", "180"], good: 0, why: "Un tour complet mesure 2π radians (le périmètre du cercle de rayon 1), donc un demi-tour vaut π." },
      defis: ["Combien de degrés vaut π/6 rad ?", "135° = k · π/4. Que vaut k ?", "cos 120° (en décimal) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["π = 180°, donc π/6 = 180° ÷ 6", "π/4 = 45°", "120° : quadrant 2, angle de référence 60°"][s] + tu(x)),
        wins: [W(30, "180 ÷ 6 = 30°."), W(3, "135 ÷ 45 = 3, soit 3π/4."), W(-0.5, "cos 60° = 0,5 et le cosinus est négatif dans le quadrant 2 : −0,5.")] }),
    },
    trigfn: {
      predict: { q: "La période de sin(2x) (x en degrés) est…", choices: ["180°", "720°", "360°"], good: 0, why: "Avec 2x, l'angle va deux fois plus vite : la courbe se répète deux fois plus souvent, période 360° ÷ 2 = 180°." },
      defis: ["Valeur maximale de 3 sin x + 2 ?", "Période (en degrés) de cos(4x) ?", "Plus petit x > 0 (en degrés) où sin(3x) = 1 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["sin x vaut au plus 1", "360° ÷ 4", "sin vaut 1 pour un angle de 90°"][s] + tu(x)),
        wins: [W(5, "3 · 1 + 2 = 5."), W(90, "360 ÷ 4 = 90°."), W(30, "3x = 90°, donc x = 30°.")] }),
    },
    sinlaw: {
      predict: { q: "Dans un triangle, le plus grand côté est toujours en face…", choices: ["du plus grand angle", "du plus petit angle", "d'un angle droit"], good: 0, why: "Théorème du sinus : a ÷ sin α = b ÷ sin β. Plus l'angle est grand, plus le côté opposé est long." },
      defis: ["α = 30°, β = 90° et a = 5. Calcule b.", "a = 3, b = 4 et γ = 90°. Que vaut c² ?", "Triangle équilatéral : que vaut cos γ ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["b = a · sin β ÷ sin α = 5 · 1 ÷ 0,5", "c² = a² + b² − 2ab cos 90°", "côtés égaux : cos γ = (a² + a² − a²) ÷ (2a²)"][s] + tu(x)),
        wins: [W(10, "5 ÷ 0,5 = 10 : le côté en face de l'angle droit est le plus long."), W(25, "cos 90° = 0 : on retrouve Pythagore, c² = 25."), W(0.5, "cos γ = a² ÷ (2a²) = 0,5, donc γ = 60°.")] }),
    },
    trigeq: {
      predict: { q: "Combien de solutions a sin x = 0,5 pour 0° ≤ x < 360° ?", choices: ["2", "1", "4"], good: 0, why: "Deux points du cercle ont l'ordonnée 0,5 : 30° et 180° − 30° = 150°." },
      defis: ["Plus grande solution de sin x = 0,5 (entre 0° et 360°) ?", "Plus petite solution de cos x = −0,5 ?", "Solution de tan x = 1 entre 180° et 360° ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["sin(180° − x) = sin x", "cos 60° = 0,5 ; cosinus négatif dans le quadrant 2", "tan 45° = 1 ; la tangente se répète tous les 180°"][s] + tu(x)),
        wins: [W(150, "180° − 30° = 150°."), W(120, "180° − 60° = 120° (l'autre est 240°)."), W(225, "45° + 180° = 225°.")] }),
    },
    trigassoc: {
      predict: { q: "Si sin α = 0,6, alors sin(180° − α) vaut…", choices: ["0,6", "−0,6", "0,8"], good: 0, why: "α et 180° − α sont symétriques par rapport à l'axe vertical : même ordonnée, donc même sinus." },
      defis: ["cos α = 0,8. Que vaut cos(−α) ?", "sin α = 0,6. Que vaut sin(180° + α) ?", "sin α = 0,6 et α aigu. Que vaut cos α ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["−α : symétrie par rapport à l'axe horizontal", "180° + α : symétrie par rapport au centre", "cos² α = 1 − sin² α"][s] + tu(x)),
        wins: [W(0.8, "Même abscisse, donc cos(−α) = cos α = 0,8."), W(-0.6, "Point opposé : ordonnée opposée, −0,6."), W(0.8, "cos² α = 1 − 0,36 = 0,64, donc cos α = 0,8 (positif, angle aigu).")] }),
    },
    trigeq2: {
      predict: { q: "La marée d'un port : h(t) = 4 + 2 sin(30t) (en m). La hauteur maximale est…", choices: ["6 m", "4 m", "2 m"], good: 0, why: "sin vaut au plus 1 : 4 + 2 · 1 = 6 m. (4 m, c'est la hauteur moyenne ; 2 m, l'amplitude.)" },
      defis: ["Période de h, en heures (le sinus fait un tour pour 30t = 360) ?", "Hauteur minimale (en m) ?", "À quelle heure la marée est-elle haute pour la première fois ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["30t = 360", "sin vaut au moins −1", "30t = 90"][s] + tu(x)),
        wins: [W(12, "t = 12 h : deux marées hautes par jour."), W(2, "4 − 2 = 2 m."), W(3, "t = 3 h.")] }),
    },
    triaire: {
      predict: { q: "Un triangle a deux côtés de 6 cm et 8 cm qui forment un angle de 30°. Son aire vaut…", choices: ["12 cm²", "24 cm²", "48 cm²"], good: 0, why: "Aire = ½ · 6 · 8 · sin 30° = ½ · 48 · 0,5 = 12 cm². La hauteur sur le côté 8 vaut 6 · sin 30° = 3." },
      defis: ["Côtés 10 et 4, angle de 90° entre eux : aire ?", "Côtés 6 et 6, angle de 150° : aire ? (sin 150° = 0,5)", "Parallélogramme de côtés 5 et 8, angle de 30° : aire ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["½ · 10 · 4 · sin 90°", "½ · 6 · 6 · 0,5", "5 · 8 · sin 30° (deux triangles)"][s] + tu(x)),
        wins: [W(20, "sin 90° = 1 : on retrouve base × hauteur ÷ 2 = 20."), W(9, "½ · 36 · 0,5 = 9."), W(20, "40 · 0,5 = 20.")] }),
    },
    statfreq: {
      predict: { q: "Sur 40 personnes, 10 répondent « oui ». La fréquence de « oui » est…", choices: ["25 %", "10 %", "40 %"], good: 0, why: "Fréquence = effectif ÷ total = 10 ÷ 40 = 0,25 = 25 %." },
      defis: ["Angle du secteur « oui » (10 sur 40) dans un diagramme circulaire ?", "30 % de 60 personnes, c'est combien de personnes ?", "Un secteur mesure 72° : quel pourcentage ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["0,25 · 360°", "0,3 · 60", "72 ÷ 360"][s] + tu(x)),
        wins: [W(90, "Un quart du tour : 90°."), W(18, "0,3 · 60 = 18."), W(20, "72 ÷ 360 = 0,2 = 20 %.")] }),
    },
    stats: {
      predict: { q: "Série 2 ; 3 ; 100. Quel nombre représente le mieux une valeur « typique » ?", choices: ["la médiane, 3", "la moyenne, 35", "l'étendue, 98"], good: 0, why: "La valeur extrême 100 tire la moyenne vers le haut (35) ; la médiane (3) n'est pas influencée." },
      defis: ["Moyenne de 4 ; 5 ; 9 ?", "Médiane de 7 ; 1 ; 4 ; 10 ; 3 ?", "Notes 4 et 5 : quelle 3e note pour une moyenne de 5 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(4 + 5 + 9) ÷ 3", "on trie : 1 ; 3 ; 4 ; 7 ; 10", "il faut une somme de 3 · 5 = 15"][s] + tu(x)),
        wins: [W(6, "18 ÷ 3 = 6."), W(4, "Valeur du milieu : 4."), W(6, "15 − 4 − 5 = 6.")] }),
    },
    quartiles: {
      predict: { q: "Dans une boîte à moustaches, la « boîte » (de Q1 à Q3) contient…", choices: ["environ la moitié des valeurs", "environ un quart des valeurs", "toutes les valeurs"], good: 0, why: "Q1, la médiane et Q3 partagent la série en quatre parts d'environ 25 % : la boîte en contient deux, soit la moitié." },
      defis: ["Étendue de 3 ; 9 ; 15 ; 4 ?", "Série triée 2 ; 4 ; 5 ; 7 ; 9 ; 12 ; 15 : Q1 ?", "Et Q3 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["max − min", "moitié inférieure : 2 ; 4 ; 5 (sans la médiane 7)", "moitié supérieure : 9 ; 12 ; 15"][s] + tu(x)),
        wins: [W(12, "15 − 3 = 12."), W(4, "Médiane de 2 ; 4 ; 5 : 4."), W(12, "Médiane de 9 ; 12 ; 15 : 12 (écart interquartile 8).")] }),
    },
  });
})();

