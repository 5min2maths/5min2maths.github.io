// Chantier 1re Collège (bêta-testeurs) · lot 5 du plan pas à pas (19.11) : une seule source pour f2expr, f2trois,
// inter, interpar, ineq2. Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs typiques,
// étiquette ctx, figures ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(6)); return Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));
  const P2 = (cs) => poly(ptrim(cs));
  const IT = (ivs) => (ivs.length ? SolSet.show(ivs) : "\\varnothing");
  const isInt = (cs) => cs.every((c) => Number.isInteger(c));
  const EX = (cs) => (isInt(cs) ? P2(cs) : pex(cs)); // réponse saisissable
  // ---------- constructeurs ----------
  const show = (spec) => (spec.kind === "pair" || spec.kind === "set" ? spec.values.map(fS).join(" ; ") : SolSet.show(spec.ivs, false));
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const PL = (fns, pts, o = {}) => FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  const quad = (cs) => (x) => cs[0] * x * x + cs[1] * x + cs[2];
  const opp = { "<": ">=", "<=": ">", ">": "<=", ">=": "<" };

  // ===================== f2expr =====================
  const FE = {
    1: [
      () => { let p, q, a; do { p = nz(-4, 3); q = nz(-3, 4); a = pk([-1, 2, -2, 1]); } while (p === q || Math.abs(a * p * q) > 5); const c = a * p * q, cs = [a, -a * (p + q), c];
        return QX("La parabole coupe l'axe des " + M("x") + " en " + M(p) + " et " + M(q) + ", et l'axe des " + M("y") + " en " + M(c) + ". Donne l'expression de " + M("f(x)") + ".", EX(cs), M("f(x) = a(" + xm(p) + ")(" + xm(q) + ")") + " ; " + M("f(0) = " + p * q + "a = " + c) + " donc " + M("a = " + a) + " : " + M("f(x) = " + P2(cs)) + ".",
          { ctx: "zeros-ordonnee", fig: PL([{ f: quad(cs) }], [[p, 0, ""], [q, 0, ""], [0, c, ""]]), guide: [GS("Coefficient " + M("a") + " (avec " + M("f(0) = a \\cdot " + par(-p) + " \\cdot " + par(-q)) + ") ?", a, M(c + " : " + p * q + " = " + a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([1, -(p + q), p * q]), "Il faut trouver a avec l'ordonnée à l'origine " + c + "."), TX(P2([a, a * (p + q), c]), "Zéro p ↔ facteur (x − p).")] }); },
      () => { const h = nz(-4, 4), k = nz(-5, 5), a = pk([1, -1, 2, -2, 3]), cs = [a, -2 * a * h, a * h * h + k];
        return QX("Une parabole a pour sommet " + M("S(" + h + " \\,;\\, " + k + ")") + " et pour coefficient dominant " + M("a = " + a) + ". Donne l'expression développée de " + M("f(x)") + ".", EX(cs), M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k) + " = " + P2(cs)) + ".",
          { ctx: "sommet-a", guide: [GX("Forme canonique", (a === 1 ? "" : a + "*") + "(" + xm(h).replace(/ /g, "") + ")^2" + (k < 0 ? k : "+" + k), M(co(a) + "(" + xm(h) + ")^2" + sg(k)) + "."), GX("Forme développée", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, 2 * a * h, a * h * h + k]), "Sommet d'abscisse h ↔ (x − h)²."), TX(P2([a, -2 * a * h, a * (h * h + k)]), "k est hors de la parenthèse : il n'est pas multiplié par a.")] }); },
      () => { const p = nz(-5, 4), q = p + R.int(1, 6), a = pk([2, -1, 3, -2]), cs = [a, -a * (p + q), a * p * q];
        return QX("Une fonction du 2e degré a pour zéros " + M(p) + " et " + M(q) + ", et pour coefficient dominant " + M(a) + ". Donne son expression développée.", EX(cs), M("f(x) = " + co(a) + "(" + xm(p) + ")(" + xm(q) + ") = " + P2(cs)) + ".",
          { ctx: "zeros-a", guide: [GX("Forme factorisée", (a === -1 ? "-" : a + "*") + "(" + xm(p).replace(/ /g, "") + ")*(" + xm(q).replace(/ /g, "") + ")", M(co(a) + "(" + xm(p) + ")(" + xm(q) + ")") + "."), GX("Forme développée", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([1, -(p + q), p * q]), "N'oublie pas le coefficient " + a + "."), TX(P2([a, a * (p + q), a * p * q]), "Zéro p ↔ facteur (x − p).")] }); },
    ],
    2: [
      () => { const h = nz(-3, 3), k = R.int(-4, 4), a = pk([1, -1, 2, -2]), x1 = h + pk([-2, -1, 1, 2]), y1 = a * (x1 - h) ** 2 + k, cs = [a, -2 * a * h, a * h * h + k]; if (Math.abs(y1) > 6) return null;
        return QX("Une parabole a pour sommet " + M("S(" + h + " \\,;\\, " + k + ")") + " et passe par " + M("P(" + x1 + " \\,;\\, " + y1 + ")") + ". Donne l'expression de " + M("f(x)") + ".", EX(cs), M("f(x) = a(" + xm(h) + ")^2" + sg(k)) + " ; avec " + M("P") + " : " + M(y1 + " = a \\cdot " + (x1 - h) ** 2 + sg(k)) + ", " + M("a = " + a) + ".",
          { ctx: "sommet-point", fig: PL([{ f: quad(cs) }], [[h, k, "S"], [x1, y1, "P"]]), guide: [GS("Valeur de " + M("a") + " ?", a, M("(" + y1 + " - " + par(k) + ") : " + (x1 - h) ** 2 + " = " + a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([1, -2 * h, h * h + k]), "Il faut calculer a avec le point P."), TX(P2([a, 2 * a * h, a * h * h + k]), "Sommet d'abscisse h ↔ (x − h)².")] }); },
      () => { const p = nz(-4, 2), q = p + R.int(2, 5), a = pk([1, -1, 2, -2]), x1 = pk([p - 1, q + 1, p + 1].filter((x) => x !== q && x !== 0)), y1 = a * (x1 - p) * (x1 - q), cs = [a, -a * (p + q), a * p * q];
        return QX("Une parabole a pour zéros " + M(p) + " et " + M(q) + " et passe par " + M("P(" + x1 + " \\,;\\, " + y1 + ")") + ". Donne l'expression développée de " + M("f(x)") + ".", EX(cs), M("f(x) = a(" + xm(p) + ")(" + xm(q) + ")") + " ; " + M(y1 + " = a \\cdot " + par(x1 - p) + " \\cdot " + par(x1 - q)) + " donne " + M("a = " + a) + " : " + M(P2(cs)) + ".",
          { ctx: "zeros-point", guide: [GS(M("(" + x1 + sg(-p) + ")(" + x1 + sg(-q) + ")") + " = ?", (x1 - p) * (x1 - q), M((x1 - p) * (x1 - q)) + "."), GS(M("a") + " ?", a, M(y1 + " : " + par((x1 - p) * (x1 - q)) + " = " + a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([1, -(p + q), p * q]), "Calcule a avec le point P."), TX(P2([-a, a * (p + q), -a * p * q]), "Vérifie le signe de a avec P.")] }); },
      () => { const h = nz(-3, 3), k = R.int(-4, 3), a = pk([1, -1]), cs = [a, -2 * a * h, a * h * h + k];
        return QX("Lis le sommet sur le graphique (la parabole a la même ouverture que " + M(a === 1 ? "y = x^2" : "y = -x^2") + ") et donne l'expression développée de " + M("f(x)") + ".", EX(cs), "Sommet " + M("(" + h + " \\,;\\, " + k + ")") + ", " + M("a = " + a) + " : " + M(co(a) + "(" + xm(h) + ")^2" + sg(k) + " = " + P2(cs)) + ".",
          { ctx: "graph-sommet", fig: PL([{ f: quad(cs) }]), guide: [GP("Sommet lu ? (« x ; y »)", [h, k], M("(" + h + " ; " + k + ")") + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, 2 * a * h, a * h * h + k]), "Sommet d'abscisse h ↔ (x − h)².")] }); },
    ],
    3: [
      () => { const a = nz(-2, 2), b = R.int(-4, 4), c = R.int(-4, 4), xs = [-1, 1, 2], cs = [a, b, c], ys = xs.map(quad(cs)); if (ys.some((y) => Math.abs(y) > 8)) return null;
        return QX("Une parabole passe par " + xs.map((x, i) => M("(" + x + " \\,;\\, " + ys[i] + ")")).join(", ") + ". Donne l'expression " + M("f(x) = ax^2 + bx + c") + ".", EX(cs), "Système : " + M("a - b + c = " + ys[0]) + ", " + M("a + b + c = " + ys[1]) + ", " + M("4a + 2b + c = " + ys[2]) + " ; " + M("b = " + b) + ", " + M("a = " + a) + ", " + M("c = " + c) + ".",
          { ctx: "trois-points", fig: PL([{ f: quad(cs) }], xs.map((x, i) => [x, ys[i], ""]), { yr: [-8, 8], squash: 0.75 }), guide: [GS(M("b") + " (soustrais les deux premières équations) ?", b, M("2b = " + (ys[1] - ys[0])) + "."), GS(M("a") + " ?", a, M(a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -b, c]), "Vérifie le signe de b : (a + b + c) − (a − b + c) = 2b.")] }); },
      () => { const p = nz(-4, 1), d = pk([1, 2, 3]), q = p + 2 * d, Mx = pk([2, 4, 6, -2, -4]) * (d === 1 ? 1 : 1), a = -Mx / (d * d), cs = [a, -a * (p + q), a * p * q]; if (!Number.isInteger(a * (p + q)) || !Number.isInteger(a * p * q)) return null;
        return QX("Une parabole a pour zéros " + M(p) + " et " + M(q) + ", et sa valeur " + (Mx > 0 ? "maximale" : "minimale") + " est " + M(Mx) + ". Donne l'expression développée de " + M("f(x)") + ".", EX(cs), "Sommet au milieu des zéros : " + M("x_S = " + (p + q) / 2) + ". " + M("f(x_S) = a \\cdot " + par(d) + " \\cdot " + par(-d) + " = " + Mx) + " donne " + M("a = " + fT(a)) + " : " + M(P2(cs)) + ".",
          { ctx: "zeros-extremum", guide: [GS("Abscisse du sommet ?", (p + q) / 2, M((p + q) / 2) + "."), GS(M("a") + " (fraction acceptée) ?", a, M(fT(a)) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([-a, a * (p + q), -a * p * q]), Mx > 0 ? "Un maximum : la parabole est tournée vers le bas (a < 0)." : "Un minimum : a > 0.")] }); },
      () => { const h = nz(-3, 3), a = pk([1, -1, 2]), c = R.int(-4, 4), b = -2 * a * h, x1 = pk([1, 2, -1].filter((x) => x !== h)), cs = [a, b, c], y1 = quad(cs)(x1);
        return QX("Une parabole a pour axe de symétrie la droite " + M("x = " + h) + ", coupe l'axe des " + M("y") + " en " + M(c) + " et passe par " + M("(" + x1 + " \\,;\\, " + y1 + ")") + ". Donne son expression développée.", EX(cs), M("-\\frac{b}{2a} = " + h + " \\Rightarrow b = " + -2 * h + "a") + " ; " + M("c = " + c) + " ; avec le point : " + M("a = " + a) + ", " + M("b = " + b) + ".",
          { ctx: "axe-point", guide: [GX(M("b") + " en fonction de " + M("a"), -2 * h + "*a", M("b = " + -2 * h + "a") + "."), GS(M("a") + " ?", a, M(a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -b, c]), "Axe x = h ↔ −b ÷ (2a) = h.")] }); },
    ],
  };

  // ===================== f2trois =====================
  const pts3 = (xs, cs) => xs.map((x) => M("(" + x + " \\,;\\, " + fT(quad(cs)(x)) + ")")).join(", ");
  const T3 = {
    1: [
      () => { const a = pk([1, 2, 3, -1, -2]), b = nz(-4, 4), c = nz(-5, 5), cs = [a, b, c], f = quad(cs);
        return QX("Une parabole passe par " + pts3([0, 1, -1], cs) + ". Détermine l'expression développée de " + M("f(x)") + ".", EX(cs), M("c = f(0) = " + c) + " ; " + M("a + b = " + (f(1) - c)) + " et " + M("a - b = " + (f(-1) - c)) + " : " + M("a = " + a) + ", " + M("b = " + b) + ".",
          { ctx: "expr-0-1", guide: [GS(M("c = f(0)") + " ?", c, M(c) + "."), GS(M("a + b = f(1) - c") + " ?", a + b, M(a + b) + "."), GS(M("a") + " (moyenne de " + M("a + b") + " et " + M("a - b") + ") ?", a, M(a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -b, c]), "a + b = f(1) − c et a − b = f(−1) − c : attention au signe de b.")] }); },
      () => { const a = pk([1, 2, 3, -1, -2]), b = nz(-4, 4), c = nz(-5, 5), cs = [a, b, c], f = quad(cs);
        return QN("Une parabole " + M("f(x) = ax^2 + bx + c") + " passe par " + pts3([0, 1, -1], cs) + ". Que vaut " + M("a") + " ?", a, M("c = " + c) + " ; " + M("a + b = " + (a + b)) + ", " + M("a - b = " + (a - b)) + " ; en additionnant : " + M("2a = " + 2 * a) + ".",
          { ctx: "a-0-1", guide: [GS(M("c") + " ?", c, M(c) + "."), GS(M("2a") + " (somme des deux équations) ?", 2 * a, M(2 * a) + "."), GS(M("a") + " ?", a, M(a) + ".")], traps: [TR(2 * a, "En additionnant, on obtient 2a : divise par 2."), TR(b, "Ça, c'est b.")] }); },
      () => { const a = pk([1, 2, -1]), b = nz(-3, 3), c = nz(-4, 4), cs = [a, b, c], f = quad(cs);
        return QN("Une parabole passe par " + pts3([0, 1, -1], cs) + ". Calcule " + M("f(2)") + ".", f(2), M("f(x) = " + P2(cs)) + " ; " + M("f(2) = " + 4 * a + sg(2 * b) + sg(c) + " = " + f(2)) + ".",
          { ctx: "f2-0-1", guide: [GX("Expression de " + M("f(x)"), EX(cs), M(P2(cs)) + "."), GS(M("f(2)") + " ?", f(2), M(f(2)) + ".")], traps: [TR(2 * f(1) - f(0), "La fonction n'est pas affine : trouve d'abord a, b et c.")] }); },
    ],
    2: [
      () => { const a = pk([1, 2, -1, -2]), b = nz(-4, 4), c = nz(-4, 4), cs = [a, b, c], f = quad(cs);
        return QX("Une parabole passe par " + pts3([0, 1, 2], cs) + ". Détermine l'expression développée de " + M("f(x)") + ".", EX(cs), M("c = " + c) + " ; " + M("a + b = " + (a + b)) + " ; " + M("4a + 2b = " + (4 * a + 2 * b)) + " ; d'où " + M("2a = " + 2 * a) + ", " + M("a = " + a) + ", " + M("b = " + b) + ".",
          { ctx: "expr-0-2", guide: [GS(M("c") + " ?", c, M(c) + "."), GS(M("a") + " (soustrais 2 × (a + b) de 4a + 2b) ?", a, M(a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([b, a, c]), "a est le coefficient de x², b celui de x.")] }); },
      () => { const a = pk([1, 2, -1, 3]), b = nz(-4, 4), c = nz(-4, 4), cs = [a, b, c];
        return QN("Une parabole " + M("f(x) = ax^2 + bx + c") + " passe par " + pts3([0, 1, 2], cs) + ". Que vaut " + M("b") + " ?", b, M("c = " + c) + ", " + M("a + b = " + (a + b)) + ", " + M("4a + 2b = " + (4 * a + 2 * b)) + " : " + M("a = " + a) + ", " + M("b = " + b) + ".",
          { ctx: "b-0-2", guide: [GS(M("a") + " ?", a, M(a) + "."), GS(M("b") + " ?", b, M(b) + ".")], traps: [TR(a, "Ça, c'est a."), TR(a + b, "a + b = " + (a + b) + " ; il faut séparer a et b.")] }); },
      () => { const v = R.int(15, 25), h0 = R.int(1, 3), cs = [-5, v, h0], f = quad(cs), t = 3;
        return QN("On lance une balle. Sa hauteur (en m) vaut " + M(h0) + " au départ, " + M(f(1)) + " après " + M(1) + " s et " + M(f(2)) + " après " + M(2) + " s (trajectoire parabolique). Quelle est sa hauteur après " + M(t) + " s ?", f(t), M("h(t) = at^2 + bt + c") + " avec " + M("c = " + h0) + ", " + M("a + b = " + (f(1) - h0)) + ", " + M("4a + 2b = " + (f(2) - h0)) + " : " + M("a = -5") + ", " + M("b = " + v) + ". " + M("h(3) = " + f(3)) + " m.",
          { ctx: "balle", guide: [GS(M("a") + " ?", -5, M(-5) + "."), GS(M("b") + " ?", v, M(v) + "."), GS(M("h(3)") + " ?", f(3), M(f(3)) + " m.")], traps: [TR(2 * f(2) - f(1), "La hauteur n'augmente pas régulièrement : modélise par une parabole."), TR(f(2), "Calcule h(3).")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, -1, -2]), b = nz(-3, 3), c = R.int(-4, 4), cs = [a, b, c], f = quad(cs);
        return QX("Une parabole passe par " + pts3([-1, 1, 2], cs) + ". Détermine l'expression développée de " + M("f(x)") + ".", EX(cs), "Système : " + M("a - b + c = " + f(-1)) + ", " + M("a + b + c = " + f(1)) + ", " + M("4a + 2b + c = " + f(2)) + " : " + M("b = " + b) + ", puis " + M("a = " + a) + ", " + M("c = " + c) + ".",
          { ctx: "expr-sans-0", guide: [GS(M("b") + " (soustrais les deux premières) ?", b, M("2b = " + (f(1) - f(-1))) + "."), GS(M("a") + " ?", a, M(a) + "."), GX("Expression", EX(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -b, c]), "(a + b + c) − (a − b + c) = 2b.")] }); },
      () => { const a = pk([1, 2, -1, 3]), b = nz(-4, 4), c = R.int(-4, 4), cs = [a, b, c], f = quad(cs);
        return QN("Une parabole " + M("f(x) = ax^2 + bx + c") + " passe par " + pts3([1, 2, 3], cs) + ". Que vaut " + M("a") + " ?", a, M("f(2) - f(1) = 3a + b = " + (f(2) - f(1))) + " ; " + M("f(3) - f(2) = 5a + b = " + (f(3) - f(2))) + " ; donc " + M("2a = " + 2 * a) + ".",
          { ctx: "a-1-3", guide: [GS(M("3a + b = f(2) - f(1)") + " ?", 3 * a + b, M(3 * a + b) + "."), GS(M("5a + b = f(3) - f(2)") + " ?", 5 * a + b, M(5 * a + b) + "."), GS(M("a") + " ?", a, M(a) + ".")], traps: [TR(2 * a, "On obtient 2a : divise par 2."), TR(f(2) - f(1), "Différences successives : il faut en faire deux.")] }); },
      () => { const a = pk([1, -1, 2]), h = nz(-3, 3), k = R.int(-4, 4), cs = [a, -2 * a * h, a * h * h + k], xs = [h - 1, h + 1, h + 2];
        return QP("Une parabole passe par " + pts3(xs, cs) + ". Quel est son sommet ? Réponds « x ; y ».", [h, k], M("f(" + (h - 1) + ") = f(" + (h + 1) + ")") + " : l'axe de symétrie est " + M("x = " + h) + ". " + M("f(x) = " + P2(cs)) + ", " + M("f(" + h + ") = " + k) + ".",
          { ctx: "sommet-3pts", guide: [GS("Les deux premiers points ont la même ordonnée : axe " + M("x") + " = ?", h, M(h) + "."), GX("Expression", EX(cs), M(P2(cs)) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([h, quad(cs)(h + 1)], "Le sommet est sur l'axe, mais son ordonnée est f(" + h + ").")] }); },
    ],
  };

  // ===================== inter (parabole et droite) =====================
  const IN = {
    1: [
      () => { const p = R.int(-3, 0), q = R.int(1, 4);
        return QSet("Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = x^2") + " et " + M("g(x) = " + P2([p + q, -p * q])) + " se coupent-ils ?", [p, q], M("x^2 = " + P2([p + q, -p * q]) + " \\iff " + P2([1, -(p + q), p * q]) + " = 0 \\iff (" + xm(p) + ")(" + xm(q) + ") = 0") + ".",
          { ctx: "x2-droite", fig: FIG.parabola((x) => x * x / 3, [], (x) => ((p + q) * x - p * q) / 3, false), guide: [GX("Ramène à « … = 0 »", P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q]) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes en factorisant."), TSet([p * p, q * q], "On demande les abscisses x.")] }); },
      () => { const k = pk([-4, -1, 0, 1, 4, 9]), n = k > 0 ? 2 : k === 0 ? 1 : 0, c = R.int(-3, 3);
        return QN("Combien de points d'intersection ont la parabole " + M("y = x^2" + (c ? sg(c) : "")) + " et la droite horizontale " + M("y = " + (k + c)) + " ?", n, M("x^2" + (c ? sg(c) : "") + " = " + (k + c) + " \\iff x^2 = " + k) + " : " + (n === 2 ? "deux solutions." : n === 1 ? "une seule (x = 0)." : "aucune (un carré n'est jamais négatif)."),
          { ctx: "horizontale", guide: [GS(M("x^2") + " = ?", k, M(k) + "."), GS("Nombre de points ?", n, M(n) + ".")], traps: [TR(n === 2 ? 1 : 2, "x² = k a deux solutions si k > 0, une si k = 0, aucune si k < 0.")] }); },
      () => { const q = R.int(1, 4), p = -R.int(1, 3);
        return QP("Les graphes de " + M("f(x) = x^2") + " et " + M("g(x) = " + P2([p + q, -p * q])) + " se coupent en deux points. Donne les coordonnées de celui d'abscisse positive. Réponds « x ; y ».", [q, q * q], "Abscisses " + M(p) + " et " + M(q) + " ; " + M("f(" + q + ") = " + q * q) + " : " + M("(" + q + " \\,;\\, " + q * q + ")") + ".",
          { ctx: "point", guide: [GSet("Abscisses des intersections ?", [p, q], M(p) + " et " + M(q) + "."), GP("Point d'abscisse positive ?", [q, q * q], M("(" + q + " ; " + q * q + ")") + ".")], traps: [TP([p, p * p], "On demande le point d'abscisse positive."), TP([q, q], "L'ordonnée est f(" + q + ") = " + q * q + ".")] }); },
    ],
    2: [
      () => { const p = nz(-4, 3), q = p + R.int(1, 5), m = nz(-3, 3), c = R.int(-5, 5), B = m - (p + q), k = c - p * q;
        return QSet("Détermine les abscisses des points d'intersection de " + M("f(x) = " + P2([1, B, c])) + " et " + M("g(x) = " + P2([m, k])) + ".", [p, q], M("f(x) = g(x) \\iff " + P2([1, -(p + q), p * q]) + " = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + ".",
          { ctx: "general", fig: FIG.parabola((x) => (x * x + B * x + c) / 4, [], (x) => (m * x + k) / 4, false), guide: [GX(M("f(x) - g(x)"), P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q])) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes."), TSet([p, q, 0], "Il n'y a que deux solutions.")] }); },
      () => { const m = nz(-4, 4), c = R.int(-4, 4), D = R.int(0, 2), dl = D === 0 ? -pk([4, 8, 12]) : D === 1 ? 0 : pk([4, 8, 16, 20]), k = c - (m * m - dl) / 4 * 0; const kk = c + (dl - m * m) / 4 * -1;
        // x² + c = m x + k ⇔ x² - m x + (c - k) = 0, Δ = m² - 4(c - k)
        const kv = c - (m * m - dl) / 4, n = dl > 0 ? 2 : dl === 0 ? 1 : 0; if (!Number.isInteger(kv)) return null; void k; void kk;
        return QN("Combien de points d'intersection ont la parabole " + M("y = x^2" + (c ? sg(c) : "")) + " et la droite " + M("y = " + P2([m, kv])) + " ?", n, M("x^2 " + (-m < 0 ? "- " + m : "+ " + -m) + "x" + sg(c - kv) + " = 0") + ", " + M("\\Delta = " + dl) + " : " + (n === 2 ? "deux points." : n === 1 ? "un point (droite tangente)." : "aucun point."),
          { ctx: "delta", guide: [GS(M("\\Delta") + " de " + M("f(x) - g(x) = 0") + " ?", dl, M(dl) + "."), GS("Nombre de points ?", n, M(n) + ".")], traps: [TR(n === 2 ? 0 : 2, "Δ > 0 : 2 ; Δ = 0 : 1 ; Δ < 0 : 0.")] }); },
      () => { const p = nz(-4, 2), q = p + R.int(1, 5), m = nz(-3, 3), c = R.int(-5, 5), B = m - (p + q), k = c - p * q, y = m * q + k;
        return QP("Les graphes de " + M("f(x) = " + P2([1, B, c])) + " et " + M("g(x) = " + P2([m, k])) + " se coupent en deux points. Donne les coordonnées de celui le plus à droite. Réponds « x ; y ».", [q, y], "Abscisses " + M(p) + " et " + M(q) + " ; " + M("g(" + q + ") = " + y) + ".",
          { ctx: "point-droite", guide: [GSet("Abscisses ?", [p, q], M(p) + " et " + M(q) + "."), GS("Ordonnée (" + M("g(" + q + ")") + ") ?", y, M(y) + "."), GP("Point ?", [q, y], M("(" + q + " ; " + y + ")") + ".")], traps: [TP([p, m * p + k], "Le plus à droite = la plus grande abscisse."), TP([q, q * q + B * q + c + 1], "Calcule l'ordonnée avec f ou g (même valeur).")] }); },
    ],
    3: [
      () => { const b = 2 * nz(-4, 4), c = R.int(-3, 6), v = c - b * b / 4;
        return QN("Pour quelle valeur de " + M("k") + " la droite " + M("y = k") + " est-elle tangente à la parabole " + M("f(x) = " + P2([1, b, c])) + " (un seul point commun) ?", v, "La droite horizontale tangente passe par le sommet : " + M("x_S = " + -b / 2) + ", " + M("k = f(" + -b / 2 + ") = " + v) + ".",
          { ctx: "tangente-h", guide: [GS("Abscisse du sommet ?", -b / 2, M(-b / 2) + "."), GS(M("k") + " ?", v, M(v) + ".")], traps: [TR(c, "Ça, c'est f(0) ; la tangente horizontale passe par le sommet."), TR(-b / 2, "On demande k, l'ordonnée du sommet.")] }); },
      () => { const a = pk([2, 3, -2]), p = nz(-3, 2), q = p + R.int(1, 4), m = nz(-3, 3), k = R.int(-4, 4), D = [a, -a * (p + q), a * p * q], fc = padd(D, [m, k]);
        return QSet("Détermine les abscisses des points d'intersection de " + M("f(x) = " + P2(fc)) + " et " + M("g(x) = " + P2([m, k])) + ".", [p, q], M("f(x) - g(x) = " + P2(D) + " = " + a + "(" + xm(p) + ")(" + xm(q) + ")") + " : " + M(p) + " et " + M(q) + ".",
          { ctx: "coef-a", guide: [GX(M("f(x) - g(x)"), P2(D), M(P2(D)) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes."), TSet([a * p, a * q], "Divise d'abord par " + a + ".")] }); },
      () => { const p = nz(-4, 2), d = R.int(2, 6), q = p + d, m = nz(-2, 2), c = R.int(-3, 3), B = m - (p + q), k = c - p * q;
        return QN("La parabole " + M("f(x) = " + P2([1, B, c])) + " et la droite " + M("g(x) = " + P2([m, k])) + " se coupent en deux points. Quelle est la distance horizontale entre ces deux points ?", d, "Abscisses " + M(p) + " et " + M(q) + " : distance " + M(q + " - " + par(p) + " = " + d) + ".",
          { ctx: "distance", guide: [GSet("Abscisses ?", [p, q], M(p) + " et " + M(q) + "."), GS("Distance ?", d, M(d) + ".")], traps: [TR(Math.abs(p + q), "Distance = différence des abscisses."), TR(q, "C'est l'écart entre les deux abscisses.")] }); },
    ],
  };

  // ===================== interpar =====================
  const IP = {
    1: [
      () => { const p = R.int(-4, 2), q = p + R.int(1, 4), b2 = R.int(-3, 3), c2 = R.int(-4, 6), b1 = b2 - 2 * (p + q), c1 = c2 + 2 * p * q;
        return QSet("Détermine les abscisses des points d'intersection des paraboles " + M("f(x) = " + P2([1, b1, c1])) + " et " + M("g(x) = " + P2([-1, b2, c2])) + ".", [p, q], M("f(x) = g(x) \\iff " + P2([2, -2 * (p + q), 2 * p * q]) + " = 0 \\iff 2(" + xm(p) + ")(" + xm(q) + ") = 0") + ".",
          { ctx: "opposees", guide: [GX(M("f(x) - g(x)"), P2([2, -2 * (p + q), 2 * p * q]), M(P2([2, -2 * (p + q), 2 * p * q])) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes."), TSet([2 * p, 2 * q], "Divise par 2.")] }); },
      () => { const p = R.int(-4, 2), q = p + R.int(1, 4), b2 = R.int(-3, 3), c2 = R.int(-4, 6), b1 = b2 - (p + q), c1 = c2 + p * q;
        return QSet("Détermine les abscisses des points d'intersection des paraboles " + M("f(x) = " + P2([2, b1, c1])) + " et " + M("g(x) = " + P2([1, b2, c2])) + ".", [p, q], M("f(x) = g(x) \\iff " + P2([1, -(p + q), p * q]) + " = 0") + " : " + M(p) + " et " + M(q) + ".",
          { ctx: "coef2", guide: [GX(M("f(x) - g(x)"), P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q])) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes.")] }); },
      () => { const r = R.int(1, 4), a = R.int(1, 6), b = 2 * r * r - a;
        return QSet("Pour quelles valeurs de " + M("x") + " les paraboles " + M("f(x) = x^2" + sg(-a)) + " et " + M("g(x) = -x^2" + sg(b)) + " se coupent-elles ?", [-r, r], M("x^2 - " + a + " = -x^2" + sg(b) + " \\iff 2x^2 = " + 2 * r * r + " \\iff x^2 = " + r * r) + ".",
          { ctx: "symetriques", guide: [GS(M("x^2") + " = ?", r * r, M(r * r) + "."), GSet("Solutions ?", [-r, r], M(-r) + " et " + M(r) + ".")], traps: [TSet([r], "x² = " + r * r + " a deux solutions."), TSet([-r * r, r * r], "On cherche x, pas x².")] }); },
    ],
    2: [
      () => { const m = nz(-5, 5), n = Math.abs(m) < 2 ? 0 : Math.abs(m) === 2 ? 1 : 2;
        return QN("Combien de points d'intersection l'hyperbole " + M("y = \\frac{1}{x}") + " et la droite " + M("y = -x" + sg(m)) + " ont-elles ?", n, M("\\frac{1}{x} = -x" + sg(m) + " \\iff x^2 " + (m < 0 ? "+ " + -m : "- " + m) + "x + 1 = 0") + ", " + M("\\Delta = " + (m * m - 4)) + " : " + (n === 0 ? "aucun." : n === 1 ? "un seul (droite tangente)." : "deux."),
          { ctx: "hyperbole", fig: FIG.plot([{ f: (x) => 1 / x }, { f: (x) => -x + m }], [], { grid: false, ticks: false }), guide: [GS(M("\\Delta") + " ?", m * m - 4, M(m * m - 4) + "."), GS("Nombre de points ?", n, M(n) + ".")], traps: [TR(n === 2 ? 0 : 2, "Signe de Δ : > 0 → 2, = 0 → 1, < 0 → 0.")] }); },
      () => { const p = nz(-3, 3), b2 = R.int(-3, 3), c2 = R.int(-4, 4), d = nz(-3, 3), b1 = b2 + d, c1 = c2 - d * p;
        return QN("Les paraboles " + M("f(x) = " + P2([1, b1, c1])) + " et " + M("g(x) = " + P2([1, b2, c2])) + " se coupent en un seul point. Quelle est son abscisse ?", p, "Les termes en " + M("x^2") + " s'annulent : " + M(P2([d, -d * p]) + " = 0 \\iff x = " + p) + ".",
          { ctx: "meme-a", guide: [GX(M("f(x) - g(x)") + " (de degré 1)", P2([d, -d * p]), M(P2([d, -d * p])) + "."), GS(M("x") + " ?", p, M(p) + ".")], traps: [TR(-p, "Résous " + P2([d, -d * p]) + " = 0 : attention au signe."), TR(d * p, "Divise par " + d + ".")] }); },
      () => { let p, q; do { p = nz(-5, 5); q = nz(-5, 5); } while (p === q || p + q === 0); const k = p * q, m = -(p + q);
        return QSet("Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = \\frac{" + -k + "}{x}") + " et " + M("g(x) = " + P2([1, m])) + " se coupent-ils ?", [p, q], M("\\frac{" + -k + "}{x} = " + P2([1, m]) + " \\iff " + P2([1, m, k]) + " = 0") + " : " + M(p) + " et " + M(q) + ".",
          { ctx: "hyperbole-droite", guide: [GX("Multiplie par " + M("x") + " et ramène à « … = 0 »", P2([1, m, k]), M(P2([1, m, k]) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes.")] }); },
    ],
    3: [
      () => { const a1 = pk([2, 3]), a2 = 1, p = nz(-3, 3), q = p + R.int(1, 4), b2 = R.int(-3, 3), c2 = R.int(-3, 3), D = [a1 - a2, -(a1 - a2) * (p + q), (a1 - a2) * p * q], f1 = padd(D, [a2, b2, c2]);
        return QP("Les paraboles " + M("f(x) = " + P2(f1)) + " et " + M("g(x) = " + P2([a2, b2, c2])) + " se coupent en deux points. Donne les coordonnées de celui le plus à gauche. Réponds « x ; y ».", [p, quad([a2, b2, c2])(p)], M("f(x) - g(x) = " + P2(D)) + " : " + M(p) + " et " + M(q) + " ; " + M("g(" + p + ") = " + quad([a2, b2, c2])(p)) + ".",
          { ctx: "point-paraboles", guide: [GSet("Abscisses ?", [p, q], M(p) + " et " + M(q) + "."), GP("Point le plus à gauche ?", [p, quad([a2, b2, c2])(p)], M("(" + p + " ; " + quad([a2, b2, c2])(p) + ")") + ".")], traps: [TP([q, quad([a2, b2, c2])(q)], "Le plus à gauche = la plus petite abscisse.")] }); },
      () => { const b = nz(-4, 4), c = R.int(-3, 3), dl = pk([-8, -4, 0, 4, 8, 16]), cc = (b * b - dl) / 8; if (!Number.isInteger(cc)) return null; const n = dl > 0 ? 2 : dl === 0 ? 1 : 0;
        // x² + c = -x² + b x + (c + cc) ⇔ 2x² - b x - cc = 0 ; Δ = b² + 8cc ... on choisit cc tel que Δ = dl
        const cc2 = (dl - b * b) / 8; if (!Number.isInteger(cc2)) return null;
        return QN("Combien de points d'intersection ont les paraboles " + M("y = x^2" + (c ? sg(c) : "")) + " et " + M("y = " + P2([-1, b, c + cc2])) + " ?", n, M("2x^2 " + (b > 0 ? "- " + b : "+ " + -b) + "x" + sg(-cc2) + " = 0") + ", " + M("\\Delta = " + dl) + " : " + (n === 2 ? "deux points." : n === 1 ? "un point." : "aucun point."),
          { ctx: "delta-paraboles", guide: [GX("Équation " + M("f(x) - g(x) = 0"), P2([2, -b, -cc2]), M(P2([2, -b, -cc2]) + " = 0") + "."), GS(M("\\Delta") + " ?", dl, M(dl) + "."), GS("Nombre de points ?", n, M(n) + ".")], traps: [TR(n === 2 ? 0 : 2, "Signe de Δ.")] }); },
      () => { const h = nz(-3, 3), k = R.int(-3, 3), d = R.int(1, 3);
        return QSet("Les paraboles " + M("f(x) = " + P2([1, -2 * h, h * h + k])) + " et " + M("g(x) = " + P2([-1, 2 * h, -h * h + k + 2 * d * d])) + " sont symétriques par rapport à une droite horizontale. Résous " + M("f(x) = g(x)") + ".", [h - d, h + d], M("2(" + xm(h) + ")^2 = " + 2 * d * d + " \\iff (" + xm(h) + ")^2 = " + d * d) + " : " + M(h - d) + " et " + M(h + d) + ".",
          { ctx: "canon-symetrie", guide: [GS(M("(" + xm(h) + ")^2") + " = ?", d * d, M(d * d) + "."), GSet("Solutions ?", [h - d, h + d], M(h - d) + " et " + M(h + d) + ".")], traps: [TSet([-d, d], "Les solutions sont centrées en " + h + ", pas en 0.")] }); },
    ],
  };

  // ===================== ineq2 =====================
  const opLabel = (op) => OPT[op];
  const IQ = {
    1: [
      () => { const op = pk(["<", "<=", ">", ">="]), p = nz(-6, 4), q = p + R.int(1, 7), f = (x) => (x - p) * (x - q), ivs = signSet(f, [p, q], [], op);
        return QS("Résous " + M("(" + xm(p) + ")(" + xm(q) + ") " + opLabel(op) + " 0") + ".", ivs, "Parabole tournée vers le haut, zéros " + M(p) + " et " + M(q) + " : " + M("S = " + IT(ivs)) + ".",
          { ctx: "produit", fig: FIG.parabola((x) => f(x) / 3, [], null, false), guide: [GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(signSet(f, [p, q], [], opp[op]), "a > 0 : négatif entre les zéros, positif à l'extérieur."), TS(signSet(f, [p, q], [], op.length === 2 ? op[0] : op + "="), op.length === 2 ? "≤ ou ≥ : les zéros sont compris." : "Inégalité stricte : zéros exclus.")] }); },
      () => { const op = pk(["<", "<=", ">", ">="]), k = R.int(1, 6), f = (x) => x * x - k * k, ivs = signSet(f, [-k, k], [], op);
        return QS("Résous " + M("x^2 - " + k * k + " " + opLabel(op) + " 0") + ".", ivs, M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + " : " + M("S = " + IT(ivs)) + ".",
          { ctx: "diff-carres", guide: [GSet("Zéros ?", [-k, k], M(-k) + " et " + M(k) + "."), GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(signSet(f, [-k, k], [], opp[op]), "x² − " + k * k + " est négatif entre −" + k + " et " + k + "."), TS(op[0] === "<" ? [[-Infinity, false, k, op === "<="]] : [[k, op === ">=", Infinity, false]], "N'oublie pas la solution négative : x² = " + k * k + " ⇔ x = ±" + k + ".")] }); },
      () => { const op = pk(["<", "<=", ">", ">="]), k = R.int(1, 6), f = (x) => x * x - k * k, ivs = signSet(f, [-k, k], [], op);
        return QS("Résous " + M("x^2 " + opLabel(op) + " " + k * k) + ".", ivs, M("x^2 " + opLabel(op) + " " + k * k + " \\iff x^2 - " + k * k + " " + opLabel(op) + " 0") + " : " + M("S = " + IT(ivs)) + ".",
          { ctx: "carre-borne", guide: [GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(op[0] === "<" ? [[-Infinity, false, k, op === "<="]] : [[k, op === ">=", Infinity, false]], "x² ≤ 9 ne donne pas x ≤ 3 : (−4)² = 16 > 9. Pense aux nombres négatifs.")] }); },
    ],
    2: [
      () => { const op = pk(["<", "<=", ">", ">="]), p = nz(-6, 4), q = p + R.int(1, 7), a = pk([-1, 2, -2, -1]), f = (x) => a * (x - p) * (x - q), ivs = signSet(f, [p, q], [], op);
        return QS("Résous " + M(P2([a, -a * (p + q), a * p * q]) + " " + opLabel(op) + " 0") + ".", ivs, "Zéros " + M(p) + " et " + M(q) + ". " + M("a = " + a) + (a > 0 ? " > 0" : " < 0") + " : le trinôme est " + (a > 0 ? "positif" : "négatif") + " à l'extérieur des zéros : " + M("S = " + IT(ivs)) + ".",
          { ctx: "coef-a", guide: [GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(signSet((x) => -f(x), [p, q], [], op), "a = " + a + (a < 0 ? " < 0 : la parabole est tournée vers le bas." : " > 0."))] }); },
      () => { const op = pk(["<", "<=", ">", ">="]), b = R.int(-3, 3), c = R.int(Math.ceil((b * b) / 4) + 1, 9), f = (x) => x * x + b * x + c, ivs = signSet(f, [], [], op);
        return QS("Résous " + M(P2([1, b, c]) + " " + opLabel(op) + " 0") + ".", ivs, M("\\Delta = " + (b * b - 4 * c)) + " < 0 et " + M("a > 0") + " : le trinôme est toujours positif. " + (ivs.length ? M("S = \\mathbb{R}") : "Aucune solution") + ".",
          { ctx: "delta-negatif", guide: [GS(M("\\Delta") + " ?", b * b - 4 * c, M(b * b - 4 * c) + " < 0 : pas de zéro."), GSS("Solution ?", ivs, ivs.length ? "Tous les réels." : "Aucune.")], traps: [TS(signSet(f, [], [], opp[op]), "a > 0 et Δ < 0 : le trinôme est toujours strictement positif.")] }); },
      () => { const p = nz(-5, 5), gt = R.rand() < 0.5, f = (x) => (x - p) ** 2, ivs = gt ? [[-Infinity, false, p, false], [p, false, Infinity, false]] : [];
        return QS("Résous " + M(P2([1, -2 * p, p * p]) + (gt ? " > " : " < ") + "0") + ".", ivs, M(P2([1, -2 * p, p * p]) + " = (" + xm(p) + ")^2") + " : un carré est " + (gt ? "strictement positif sauf en " + M(p) + " : " + M("S = \\mathbb{R} \\setminus \\{" + p + "\\}") : "jamais négatif : aucune solution") + ".",
          { ctx: "carre-parfait", guide: [GS("Zéro double ?", p, M(p) + "."), GSS("Solution ?", ivs, gt ? M("\\mathbb{R} \\setminus \\{" + p + "\\}") : "Aucune.")], traps: [TS(gt ? [[-Infinity, false, Infinity, false]] : [[p, true, p, true]], gt ? "En x = " + p + ", le carré vaut 0 : pas > 0." : "Un carré n'est jamais strictement négatif.")] }); },
    ],
    3: [
      () => { const op = pk(["<", "<=", ">", ">="]), p = nz(-4, 2), q = p + pk([1, 2, 3, 4, 5]), a = pk([-2, 2, -1, 1]), m = nz(-3, 3), k = R.int(-4, 4), D = pmul([1, -p], [1, -q]).map((v) => v * a), fc = padd(D, [m, k]), f = (x) => a * (x - p) * (x - q), ivs = signSet(f, [p, q], [], op);
        return QS("Soit " + M("f(x) = " + P2(fc)) + " et " + M("g(x) = " + P2([m, k])) + ". Résous " + M("f(x) " + opLabel(op) + " g(x)") + ".", ivs, M("f(x) - g(x) = " + P2(D) + " = " + co(a) + "(" + xm(p) + ")(" + xm(q) + ")") + " : " + M("S = " + IT(ivs)) + ".",
          { ctx: "f-g", fig: FIG.parabola((x) => quad(fc)(x) / 4, [], (x) => (m * x + k) / 4, false), guide: [GX(M("f(x) - g(x)"), P2(D), M(P2(D)) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(signSet((x) => -f(x), [p, q], [], op), "Regarde le signe de a = " + a + ".")] }); },
      () => { const p = nz(-5, 3), q = p + R.int(3, 8), lg = R.rand() < 0.5, n = q - p - 1 + (lg ? 2 : 0);
        return QN("Combien de nombres entiers vérifient " + M("(" + xm(p) + ")(" + xm(q) + ") " + (lg ? "\\le" : "<") + " 0") + " ?", n, "Solution " + M((lg ? "[" : "]") + p + " \\,;\\, " + q + (lg ? "]" : "[")) + " : " + M(n) + " entiers.",
          { ctx: "compte-entiers", guide: [GSS("Solution ?", [[p, lg, q, lg]], M((lg ? "[" : "]") + p + " \\,;\\, " + q + (lg ? "]" : "["))) + "."), GS("Nombre d'entiers ?", n, M(n) + ".")], traps: [TR(lg ? n - 2 : n + 2, lg ? "≤ : les zéros sont compris." : "< : les zéros sont exclus."), TR(q - p, "Compte les entiers un par un.")] }); },
      () => { const r1 = R.int(2, 5), r2 = r1 + R.int(2, 6), s = r1 + r2, A = r1 * r2;
        return QS("Un rectangle a un périmètre de " + M(2 * s) + " cm. On note " + M("x") + " sa longueur (en cm). Pour quelles valeurs de " + M("x") + " son aire est-elle d'au moins " + M(A) + " cm² ?", [[r1, true, r2, true]], "Largeur " + M(s + " - x") + " ; aire " + M("x(" + s + " - x) \\ge " + A + " \\iff x^2 - " + s + "x + " + A + " \\le 0 \\iff (x - " + r1 + ")(x - " + r2 + ") \\le 0") + " : " + M("[" + r1 + " \\,;\\, " + r2 + "]") + ".",
          { ctx: "rectangle", guide: [GX("Aire en fonction de " + M("x"), "x*(" + s + "-x)", M("x(" + s + " - x)") + "."), GSet("Zéros de " + M("x^2 - " + s + "x + " + A) + " ?", [r1, r2], M(r1) + " et " + M(r2) + "."), GSS("Solution ?", [[r1, true, r2, true]], M("[" + r1 + " \\,;\\, " + r2 + "]") + ".")], traps: [TS([[-Infinity, false, r1, true], [r2, true, Infinity, false]], "L'aire est maximale au milieu : elle dépasse " + A + " ENTRE les zéros."), TS([[r1, false, r2, false]], "« Au moins » : ≥, les bornes sont comprises.")] }); },
    ],
  };

  const PROBS = {
    f2expr: [() => P("Une parabole a pour sommet S(1 ; −4) et passe par (3 ; 0).", [["a) Coefficient a", 1], ["b) f(0)", -3], ["c) L'autre zéro", -1]], ["f(x) = a(x − 1)² − 4.", "Les zéros sont symétriques par rapport à x = 1."], "a) " + M("0 = 4a - 4") + ", a = 1 ; b) " + M("f(0) = 1 - 4 = -3") + " ; c) −1.")],
    f2trois: [() => P("Une parabole passe par (0 ; 3), (1 ; 0) et (−1 ; 8).", [["a) c", 3], ["b) a", 1], ["c) b", -4]], ["c = f(0).", "a + b = −3 et a − b = 5."], "a) 3 ; b) " + M("2a = 2") + " ; c) " + M("b = -4") + " : " + M("f(x) = x^2 - 4x + 3") + ".")],
    inter: [() => P("f(x) = x² − 2x − 1 et g(x) = x + 3.", [["a) Plus petite abscisse d'intersection", -1], ["b) Plus grande abscisse d'intersection", 4], ["c) Ordonnée du point le plus à droite", 7]], ["x² − 3x − 4 = 0.", "(x − 4)(x + 1) = 0."], "a) −1 ; b) 4 ; c) " + M("g(4) = 7") + ".")],
    interpar: [() => P("f(x) = x² − 4 et g(x) = −x² + 2x.", [["a) Plus petite abscisse d'intersection", -1], ["b) Plus grande abscisse d'intersection", 2], ["c) Ordonnée du point d'abscisse 2", 0]], ["2x² − 2x − 4 = 0.", "x² − x − 2 = (x − 2)(x + 1)."], "a) −1 ; b) 2 ; c) " + M("f(2) = 0") + ".")],
    ineq2: [() => P("On résout x² − 2x − 8 ≤ 0.", [["a) Plus petit zéro", -2], ["b) Plus grand zéro", 4], ["c) Nombre d'entiers solutions", 7]], ["(x − 4)(x + 2).", "Solution [−2 ; 4]."], "a) −2 ; b) 4 ; c) de −2 à 4 : 7 entiers.")],
  };

  const ALL = { f2expr: FE, f2trois: T3, inter: IN, interpar: IP, ineq2: IQ };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => { const L0 = lv[Math.min(Math.max(d, 1), 3)]; let q = null; for (let k = 0; k < 40 && !(q && q.traps && q.traps.length); k++) q = pk(L0)(); return q; };
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    f2expr: "Zéros connus : f(x) = a(x − x₁)(x − x₂). Sommet connu : f(x) = a(x − h)² + k. Un point de plus donne a.",
    f2trois: "f(x) = ax² + bx + c ; chaque point donne une équation. Le point d'abscisse 0 donne c ; f(1) et f(−1) donnent a + b et a − b.",
    inter: "Résous f(x) = g(x) : ramène tout d'un côté (… = 0). Les solutions sont les abscisses ; l'ordonnée se calcule avec f ou g.",
    interpar: "Égale les deux expressions et ramène à « … = 0 ». Si les x² s'annulent, l'équation est du 1er degré. Δ donne le nombre de points.",
    ineq2: "Cherche les zéros, puis le signe : a > 0 → négatif entre les zéros, positif à l'extérieur (l'inverse si a < 0). ≤, ≥ : zéros compris.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    f2expr: ["Zéros et ordonnée, sommet et a", "Sommet et point, zéros et point, lecture", "Trois points, extremum, axe de symétrie"],
    f2trois: ["Points d'abscisses 0, 1, −1", "Points 0, 1, 2 ; balle", "Sans abscisse 0, différences, sommet"],
    inter: ["x² et une droite, horizontale, point", "Cas général, Δ, coordonnées", "Tangente, coefficient a, distance"],
    interpar: ["Deux paraboles", "Hyperbole, même a", "Point, Δ, symétrie"],
    ineq2: ["Produit, différence de carrés, x² ≤ k", "Coefficient a, Δ < 0, carré parfait", "f(x) ≤ g(x), entiers, rectangle"],
  });
})();
