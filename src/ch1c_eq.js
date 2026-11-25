// Chantier 1re Collège · équations (16.11) : une seule source pour eq1, eqfrac, eqspec, formule, probeq (1er degré)
// et eq2fact, eq2, eq2disc, probeq2, eq3, bicarre, eqirr (2e degré et au-delà). Même standard que ch11_litt.js :
// au moins 3 formes par niveau, pas à pas (guide) sur toutes les questions, erreurs typiques (traps : { v } pour une
// valeur, { s: [solutions] } pour un ensemble, { none } « aucune », { all } « tous »), étiquette ctx ; défi = problèmes
// en plusieurs étapes. Modèles : polycopié d'algèbre de 1re du Collège (équations, formules de physique, « gerbe de
// problèmes »), modelés et non recopiés.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const G = (a, b) => (b ? G(b, a % b) : Math.abs(a));
  const lcm = (a, b) => (a * b) / G(a, b);
  const tn = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return frac(Math.round(v * d), d); return dec(+v.toFixed(4)); };
  const uq = (vs) => [...new Set(vs.map((v) => +(+v).toFixed(10)))].sort((a, b) => a - b);
  const SS = (vs, texs) => M(vs.length || texs ? "S = \\{" + (texs || uq(vs).map(tn)).join(" \\,;\\, ") + "\\}" : "S = \\varnothing");
  const sgn = (b) => (b < 0 ? " - " + tn(-b) : " + " + tn(b));
  const P = (v) => (v < 0 ? "(" + tn(v) + ")" : tn(v));
  const L = (a, b, x = "x") => poly([a, b], x);
  const T2 = (a, b, c, x = "x") => poly([a, b, c], x);
  const xm = (r, x = "x") => (r === 0 ? x : x + sgn(-r)); // x − r
  const sameSet = (a, b) => { const A = uq(a), B = uq(b); return A.length === B.length && A.every((v, i) => Math.abs(v - B[i]) < 1e-9); };
  const Qv = (q, value, sol, o = {}) => Object.assign({ q, spec: { kind: "value", value }, sol, guide: o.guide, ctx: o.ctx,
    traps: (o.traps || []).filter((t, i, A) => isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && A.findIndex((u) => Math.abs(u.v - t.v) < 1e-9) === i) }, o.fig ? { fig: o.fig } : {});
  const Qs = (q, values, sol, o = {}) => { const spec = { kind: "set", values: o.all ? [] : uq(values) }; if (o.all) spec.all = true;
    const traps = (o.traps || []).filter((t) => !t.s || t.s.every(isFinite)).filter((t, i, A) => A.findIndex((u) => (t.s && u.s ? sameSet(t.s, u.s) : (t.none && u.none) || (t.all && u.all))) === i).filter((t) => (t.none ? !(spec.values.length === 0 && !spec.all) : t.all ? !spec.all : !(!spec.all && sameSet(t.s, spec.values))));
    return Object.assign({ q, spec, sol, guide: o.guide, ctx: o.ctx, traps }, o.fig ? { fig: o.fig } : {}); };
  const Qx = (q, expr, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "expr", expr }, o.pos ? { pos: true } : {}), sol, guide: o.guide, ctx: o.ctx };
    let target = null; try { target = Expr.parse(expr); } catch (er) {}
    x.traps = (o.traps || []).filter((tr) => { try { return !target || !Expr.equivalent(Expr.parse(tr.e), target, o.pos); } catch (er) { return false; } });
    return x; };
  const GSet = (ask, values, sol, all) => ({ ask, spec: Object.assign({ kind: "set", values: all ? [] : uq(values) }, all ? { all: true } : {}), sol });
  const GX = (ask, expr, sol, pos) => ({ ask, spec: Object.assign({ kind: "expr", expr }, pos ? { pos: true } : {}), sol });
  const TS = (s, m) => ({ s, m }), TN = (m) => ({ none: true, m }), TA = (m) => ({ all: true, m }), TV = (v, m) => ({ v, m }), TX = (e, m) => ({ e, m });
  const ASK = " Donne toutes les solutions, séparées par « ; » (∅ ou « aucune » s'il n'y en a pas).";
  const ASKS = " Écris les solutions séparées par « ; », ∅ ou « aucune » s'il n'y en a pas, « tous » si tout nombre est solution.";
  const WHO = ["Léa", "Noé", "Inès", "Yanis", "Mia", "Sam", "Lina", "Léo"];
  const sq = (n) => { for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return [k * sq(n / (k * k))[0], sq(n / (k * k))[1]]; return [1, n]; }; // n = a²·b
  const rt = (n) => { const [a, b] = sq(n); return b === 1 ? String(a) : (a > 1 ? a : "") + "\\sqrt{" + b + "}"; };

  // ===================== eq1 : équations du 1er degré =====================
  const EQ1 = {
    1: [
      () => { const a = pk([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5]), s = nz(-9, 9), b = nz(-12, 12), c = a * s + b;
        return Qv("Résous : " + M(L(a, b) + " = " + c) + ".", s, "On " + (b > 0 ? "soustrait " + b : "ajoute " + -b) + " des deux côtés : " + M(L(a, 0) + " = " + (c - b)) + ", puis on divise par " + M(P(a)) + " : " + M("x = " + s) + ".",
          { ctx: "simple", fig: FIG.balance(L(a, b), String(c)),
            guide: [GS((b > 0 ? "Soustrais " + b : "Ajoute " + -b) + " des deux côtés : " + M(L(a, 0) + " = \\ ?"), c - b, M(L(a, 0) + " = " + c + sgn(-b) + " = " + (c - b)) + "."), GS("Divise les deux côtés par " + M(P(a)) + " : " + M("x = \\ ?"), s, M("x = \\frac{" + (c - b) + "}{" + a + "} = " + s) + ".")],
            traps: [TV((c + b) / a, "Pour enlever " + M(b) + " à gauche, on " + (b > 0 ? "soustrait " + b : "ajoute " + -b) + " des <b>deux</b> côtés : " + M(c + sgn(-b) + " = " + (c - b)) + "."), TV((c - b) * a, "Pour défaire « fois " + a + " », on divise par " + a + " : on ne multiplie pas."), TV((c - b) / -a, "Attention au signe : on divise par " + M(P(a)) + ", avec son signe.")] }); },
      () => { let a, c; do { a = R.int(2, 9); c = R.int(1, 9); } while (a === c); const s = nz(-9, 9), b = nz(-12, 12), d = (a - c) * s + b;
        return Qv("Résous : " + M(L(a, b) + " = " + L(c, d)) + ".", s, "Les " + M("x") + " à gauche, les nombres à droite : " + M(L(a - c, 0) + " = " + (d - b)) + ", donc " + M("x = " + s) + ".",
          { ctx: "deuxcotes", fig: FIG.balance(L(a, b), L(c, d)),
            guide: [GS("Soustrais " + M(L(c, 0)) + " des deux côtés. Combien reste-t-il de " + M("x") + " à gauche (coefficient) ?", a - c, M(a + "x - " + L(c, 0) + " = " + L(a - c, 0)) + "."), GS("Soustrais " + M(b) + " des deux côtés : " + M(L(a - c, 0) + " = \\ ?"), d - b, M(L(a - c, 0) + " = " + d + sgn(-b) + " = " + (d - b)) + "."), GS("Divise : " + M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV((d - b) / (a + c), "Pour faire passer " + M(L(c, 0)) + " à gauche, on le <b>soustrait</b> des deux côtés : " + M(a + "x - " + L(c, 0) + " = " + L(a - c, 0)) + "."), TV((d + b) / (a - c), "Le nombre " + M(b) + " change de membre : on " + (b > 0 ? "soustrait" : "ajoute") + " " + Math.abs(b) + " des deux côtés.")] }); },
      () => { const a = R.int(2, 9), s = nz(-9, 9), k = R.int(3, 20), c = k - a * s;
        return Qv("Résous : " + M(k + " - " + a + "x = " + c) + ".", s, M("-" + a + "x = " + c + " - " + k + " = " + (c - k)) + ", donc " + M("x = \\frac{" + (c - k) + "}{-" + a + "} = " + s) + ".",
          { ctx: "negatif",
            guide: [GS("Soustrais " + k + " des deux côtés : " + M("-" + a + "x = \\ ?"), c - k, M("-" + a + "x = " + c + " - " + k + " = " + (c - k)) + "."), GS("Divise par " + M("-" + a) + " (avec le signe) : " + M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV((c - k) / a, "Le coefficient de " + M("x") + " est " + M("-" + a) + " : on divise par " + M("-" + a) + ", ce qui change le signe."), TV((k - c) / -a, "Pour enlever " + k + ", on soustrait " + k + " des deux côtés : " + M(c + " - " + k + " = " + (c - k)) + ".")] }); },
      () => { const m = pk([2, 3, 4, 5]); let n; do n = nz(-17, 17); while (n % m === 0); const c = R.int(1, 6), a = c + m, b = nz(-9, 9), d = n + b;
        return Qv("Résous : " + M(L(a, b) + " = " + L(c, d)) + " (valeur exacte).", n / m, M(L(m, 0) + " = " + n) + ", donc " + M("x = " + frac(n, m)) + " : la solution n'est pas toujours un nombre entier.",
          { ctx: "fraction",
            guide: [GS("Regroupe : " + M(L(m, 0) + " = \\ ?"), n, M(a + "x - " + L(c, 0) + " = " + L(m, 0)) + " et " + M(d + sgn(-b) + " = " + n) + "."), GS("Divise par " + m + " (fraction irréductible) : " + M("x = \\ ?"), n / m, M("x = " + frac(n, m)) + ".")],
            traps: [TV(m / n, "Tu as inversé : " + M(m + "x = " + n) + " donne " + M("x = " + frac(n, m)) + "."), TV((d + b) / m, "Le nombre " + M(b) + " change de membre : on " + (b > 0 ? "soustrait" : "ajoute") + " " + Math.abs(b) + " des deux côtés.")] }); },
    ],
    2: [
      () => { let a, c; do { a = R.int(2, 7); c = R.int(2, 6); } while (a === c); const b = R.int(1, 9), d = R.int(1, 9), s = pk([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]), e = a * (s + b) - c * (s - d); /* 25.11 : solution ≠ ±1 */
        return Qv("Résous : " + M(a + "(x + " + b + ") - " + c + "(x - " + d + ") = " + e) + ".", s, "On développe : " + M(a + "x + " + a * b + " - " + c + "x + " + c * d + " = " + e) + ", donc " + M(L(a - c, 0) + " = " + (e - a * b - c * d)) + " et " + M("x = " + s) + ".",
          { ctx: "parentheses",
            guide: [GS("Développe le membre de gauche. Quel est le nombre seul (" + M(a + " \\cdot " + b + " - " + c + " \\cdot (-" + d + ")") + ") ?", a * b + c * d, M(a * b + " + " + c * d + " = " + (a * b + c * d)) + " : " + M("-" + c + " \\cdot (-" + d + ") = +" + c * d) + "."), GS("Réduis : " + M(L(a - c, 0) + " + " + (a * b + c * d) + " = " + e) + ". Donc " + M(L(a - c, 0) + " = \\ ?"), e - a * b - c * d, M(L(a - c, 0) + " = " + (e - a * b - c * d)) + "."), GS(M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV((e - a * b + c * d) / (a - c), "Le « − » devant " + M(c + "(x - " + d + ")") + " change les deux signes : " + M("-" + c + " \\cdot (-" + d + ") = +" + c * d) + "."), TV((e - b - d) / (a - c), "On multiplie <b>chaque</b> terme de la parenthèse : " + M(a + "(x + " + b + ") = " + a + "x + " + a * b) + ".")] }); },
      () => { const C = pk([[0.25, 0.75], [0.5, 1.5], [0.2, 0.7], [1.5, 0.5], [0.4, 1.4], [1.2, 0.2]]), [p, r] = C, v = pk(["x", "t", "R", "y"]), s = 2 * nz(-6, 6), q = nz(-9, 9), t = +((p - r) * s + q).toFixed(4);
        if (!Number.isInteger(t)) return EQ1[2][1]();
        const Ld = (a, b) => dec(a) + v + sgn(b);
        return Qv("Résous : " + M(Ld(p, q) + " = " + Ld(r, t)) + ".", s, M("(" + dec(p) + " - " + dec(r) + ")" + v + " = " + t + sgn(-q)) + ", soit " + M(dec(+(p - r).toFixed(4)) + v + " = " + (t - q)) + ", donc " + M(v + " = " + s) + ".",
          { ctx: "decimaux",
            guide: [GS("Regroupe les " + M(v) + " à gauche. Quel est leur coefficient (" + M(dec(p) + " - " + dec(r)) + ") ?", +(p - r).toFixed(4), M(dec(p) + " - " + dec(r) + " = " + dec(+(p - r).toFixed(4))) + "."), GS("Les nombres à droite : " + M(dec(+(p - r).toFixed(4)) + v + " = \\ ?"), t - q, M(t + sgn(-q) + " = " + (t - q)) + "."), GS(M(v + " = \\ ?"), s, M(v + " = \\frac{" + (t - q) + "}{" + dec(+(p - r).toFixed(4)) + "} = " + s) + ".")],
            traps: [TV((t - q) / (p + r), "Pour regrouper les " + M(v) + ", on <b>soustrait</b> " + M(dec(r) + v) + " des deux côtés."), TV((t + q) / (p - r), "Le nombre " + M(q) + " change de membre : on le soustrait des deux côtés.")] }); },
      () => { let a, b, c, d; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); d = nz(-6, 6); } while (a + b === c + d || [a, b].sort().join() === [c, d].sort().join());
        const s = pk([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), e = (a + b - c - d) * s + a * b - c * d; if (e === 0) return EQ1[2][2](); /* 25.11 : solution ≠ ±1 (robot) */
        const k = a + b - c - d;
        return Qv("Résous : " + M("(" + L(1, a) + ")(" + L(1, b) + ") = (" + L(1, c) + ")(" + L(1, d) + ")" + sgn(e)) + ".", s, "On développe : " + M(T2(1, a + b, a * b) + " = " + T2(1, c + d, c * d + e)) + ". Les " + M("x^2") + " s'éliminent : " + M(L(k, 0) + " = " + (c * d + e - a * b)) + ", donc " + M("x = " + s) + ".",
          { ctx: "carres-elimines",
            guide: [GS("Développe le membre de gauche : coefficient de " + M("x") + " ?", a + b, M("(" + L(1, a) + ")(" + L(1, b) + ") = " + T2(1, a + b, a * b)) + "."), GS("Développe à droite (sans oublier " + M(e) + "), puis soustrais " + M("x^2") + " des deux côtés : " + M(L(k, 0) + " = \\ ?"), c * d + e - a * b, M(T2(1, c + d, c * d + e)) + " ; il reste " + M(L(k, 0) + " = " + (c * d + e - a * b)) + "."), GS(M("x = \\ ?"), s, M("x = " + s) + " : l'équation avait l'air du 2e degré, mais elle est du 1er degré.")],
            traps: [TV((c * d - a * b) / k, "N'oublie pas le terme " + M(e) + " du membre de droite.")] }); },
      () => { let a, c; do { a = R.int(3, 9); c = R.int(1, 8); } while (a <= c); const s = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]), b = nz(-9, 9), d = (a - c) * s + b, w = pk(WHO), wrong = (d + b) / (a - c);
        if (Math.abs(wrong - s) < 1e-9) return EQ1[2][3]();
        return Qv(w + " résout " + M(L(a, b) + " = " + L(c, d)) + " ainsi : " + M(L(a - c, 0) + " = " + (d + b)) + ", donc " + M("x = " + tn(wrong)) + ". Trouve l'erreur, puis donne la bonne solution.", s, "Erreur : " + M(b) + " change de membre, donc de signe : " + M(L(a - c, 0) + " = " + d + sgn(-b) + " = " + (d - b)) + ", et " + M("x = " + s) + ". Vérification : " + M(a + " \\cdot " + P(s) + sgn(b) + " = " + (a * s + b)) + " et " + M(c + " \\cdot " + P(s) + sgn(d) + " = " + (c * s + d)) + ".",
          { ctx: "erreur",
            guide: [GS("Soustrais " + M(b) + " des deux côtés : " + M(L(a - c, 0) + " = \\ ?"), d - b, M(d + sgn(-b) + " = " + (d - b)) + " : " + w + " a ajouté au lieu de soustraire."), GS(M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV(wrong, "C'est le résultat de " + w + " : vérifie-le dans l'équation, il ne marche pas.")] }); },
    ],
    3: [
      () => { const F = pk([
          ["3 - ax = b", "(3-b)/a", "\\frac{3 - b}{a}", [["Isole le terme en " + M("x") + " : " + M("-ax = \\ ?"), "b-3", "b - 3"]], ["(b-3)/a", "Le coefficient de " + M("x") + " est " + M("-a") + " : on divise par " + M("-a") + "."], "lit-a"],
          ["a(x - b) = c", "c/a+b", "\\frac{c}{a} + b", [["Divise par " + M("a") + " : " + M("x - b = \\ ?"), "c/a", "\\frac{c}{a}"]], ["c/a-b", "On ajoute " + M("b") + " des deux côtés : " + M("x = \\frac{c}{a} + b") + "."], "lit-b"],
          ["ax + b = cx", "b/(c-a)", "\\frac{b}{c - a}", [["Regroupe les " + M("x") + " à droite : " + M("b = (\\ldots)x") + ". Écris la parenthèse.", "c-a", "c - a"]], ["b/(a-c)", "Vérifie le signe : " + M("b = cx - ax = (c - a)x") + "."], "lit-c"],
          ["m(x - p) = nx", "m*p/(m-n)", "\\frac{mp}{m - n}", [["Développe et regroupe : " + M("(\\ldots)x = mp") + ". Écris la parenthèse.", "m-n", "m - n"]], ["m*p/(n-m)", M("mx - mp = nx") + " donne " + M("mx - nx = mp") + ", donc " + M("(m - n)x = mp") + "."], "lit-d"],
          ["a(x + c) = b(x - c)", "c*(a+b)/(b-a)", "\\frac{c(a + b)}{b - a}", [["Développe et regroupe les " + M("x") + " à droite : " + M("ac + bc = (\\ldots)x") + ". Écris la parenthèse.", "b-a", "b - a"]], ["c*(a-b)/(b-a)", M("-b \\cdot (-c) = +bc") + " : on ajoute " + M("bc") + " des deux côtés."], "lit-e"]]);
        return Qx("Résous par rapport à " + M("x") + " (les autres lettres sont des nombres, et l'on suppose qu'on ne divise jamais par 0) : " + M(F[0]) + ". Écris " + M("x = \\ldots") + " ou seulement l'expression.", F[1], M("x = " + F[2]) + ". On résout comme avec des nombres : la lettre " + M("x") + " est l'inconnue.",
          { ctx: F[5], guide: [...F[3].map(([ask, e, t]) => GX(ask, e, M(t) + ".")), GX("Isole " + M("x") + " :", F[1], M("x = " + F[2]) + ".")], traps: [TX(F[4][0], F[4][1])] }); },
      () => { let a, b; do { a = R.int(1, 6); b = R.int(1, 6); } while (a === b); const s = nz(-6, 6), k = 2 * (a + b), c = k * s + a * a - b * b;
        return Qv("Résous : " + M("(x + " + a + ")^2 - (x - " + b + ")^2 = " + c) + ".", s, M("x^2 + " + 2 * a + "x + " + a * a + " - (x^2 - " + 2 * b + "x + " + b * b + ") = " + L(k, a * a - b * b)) + ", donc " + M(L(k, 0) + " = " + (c - a * a + b * b)) + " et " + M("x = " + s) + ".",
          { ctx: "identites",
            guide: [GS("Développe et réduis le membre de gauche : coefficient de " + M("x") + " ?", k, M(2 * a + "x + " + 2 * b + "x = " + k + "x") + " (le « − » change le signe de " + M("-" + 2 * b + "x") + ")."), GS("Terme constant du membre de gauche ?", a * a - b * b, M(a * a + " - " + b * b + " = " + (a * a - b * b)) + "."), GS(M("x = \\ ?"), s, M(L(k, 0) + " = " + (c - a * a + b * b)) + ", " + M("x = " + s) + ".")],
            traps: [...(a !== b ? [TV((c - a * a + b * b) / (2 * a - 2 * b), "Le « − » devant " + M("(x - " + b + ")^2") + " change tous les signes : " + M("-(x^2 - " + 2 * b + "x + " + b * b + ") = -x^2 + " + 2 * b + "x - " + b * b) + ".")] : []), TV((c - a * a - b * b) / k, M("-(x - " + b + ")^2") + " donne " + M("-" + b * b) + " : le carré est soustrait.")] }); },
      () => { const s = pk([2, 3, 4, 5, -1, -2, -3]), a = R.int(2, 6), b = pk([1, 2, 3, 4, 5].filter((v) => v !== a)), m = (a * s - b) / (s - 1);
        if (!Number.isInteger(m) || m === a || m === 0 || Math.abs(m) === 1) return EQ1[3][2]();
        return Qv("Pour quelle valeur de " + M("m") + " l'équation " + M("mx + " + b + " = " + a + "x + m") + " a-t-elle la solution " + M("x = " + s) + " ?", m, "On remplace " + M("x") + " par " + M(s) + " : " + M(P(s) + "m + " + b + " = " + a * s + " + m") + ", donc " + M("(" + s + " - 1)m = " + (a * s - b)) + " et " + M("m = " + m) + ".",
          { ctx: "parametre",
            guide: [GS("Remplace " + M("x") + " par " + M(s) + ". Regroupe les " + M("m") + " à gauche : " + M("(\\ldots)m = " + (a * s - b)) + ". Quel est le coefficient de " + M("m") + " ?", s - 1, M(s + "m - m = " + (s - 1) + "m") + "."), GS(M("m = \\ ?"), m, M("m = \\frac{" + (a * s - b) + "}{" + (s - 1) + "} = " + m) + ".")],
            traps: [TV((a * s - b) / s, "Le " + M("m") + " du membre de droite passe aussi à gauche : " + M(s + "m - m") + ".")] }); },
    ],
  };

  // ===================== eqfrac : parenthèses et fractions =====================
  const EQF = {
    1: [
      () => { const a = R.int(2, 9), b = nz(-9, 9), k = nz(-6, 7), s = a * k, c = k + b;
        return Qv("Résous : " + M("\\frac{x}{" + a + "}" + sgn(b) + " = " + c) + ".", s, M("\\frac{x}{" + a + "} = " + k) + ", donc " + M("x = " + k + " \\cdot " + a + " = " + s) + ".",
          { ctx: "xsura", guide: [GS((b > 0 ? "Soustrais " + b : "Ajoute " + -b) + " des deux côtés : " + M("\\frac{x}{" + a + "} = \\ ?"), k, M(c + sgn(-b) + " = " + k) + "."), GS("Multiplie par " + a + " : " + M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV(k / a, "Pour défaire « divisé par " + a + " », on <b>multiplie</b> par " + a + "."), TV((c + b) * a, "Le nombre " + M(b) + " change de membre : on " + (b > 0 ? "soustrait" : "ajoute") + " " + Math.abs(b) + ".")] }); },
      () => { const a = R.int(2, 9), b = nz(-9, 9), c = nz(-6, 7), s = a * c - b;
        return Qv("Résous : " + M("\\frac{x" + sgn(b) + "}{" + a + "} = " + c) + ".", s, "On multiplie par " + a + " : " + M("x" + sgn(b) + " = " + a * c) + ", donc " + M("x = " + s) + ".",
          { ctx: "numerateur", guide: [GS("Multiplie les deux côtés par " + a + " : " + M("x" + sgn(b) + " = \\ ?"), a * c, M(a + " \\cdot " + P(c) + " = " + a * c) + "."), GS(M("x = \\ ?"), s, M("x = " + a * c + sgn(-b) + " = " + s) + ".")],
            traps: [TV(c / a - b, "On multiplie par " + a + " (on ne divise pas) : " + M("x" + sgn(b) + " = " + a * c) + "."), TV(a * c + b, "Le nombre " + M(b) + " change de membre : on le soustrait.")] }); },
      () => { const a = R.int(2, 7), b = nz(-8, 8), s = nz(-6, 9), c = a * (s + b);
        return Qv("Résous en divisant d'abord : " + M(a + "(x" + sgn(b) + ") = " + c) + ".", s, "On divise par " + a + " : " + M("x" + sgn(b) + " = " + (s + b)) + ", donc " + M("x = " + s) + ".",
          { ctx: "diviser", guide: [GS("Divise les deux côtés par " + a + " : " + M("x" + sgn(b) + " = \\ ?"), s + b, M("\\frac{" + c + "}{" + a + "} = " + (s + b)) + "."), GS(M("x = \\ ?"), s, M("x = " + (s + b) + sgn(-b) + " = " + s) + ".")],
            traps: [TV((c - b) / a, "Le facteur " + a + " multiplie toute la parenthèse : " + M(a + "(x" + sgn(b) + ") = " + a + "x" + sgn(a * b)) + "."), TV(c / a + b, "Pour enlever " + M(b) + ", on " + (b > 0 ? "soustrait" : "ajoute") + " " + Math.abs(b) + ".")] }); },
      () => { const a = R.int(2, 7), b = pk([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => G(v, a) === 1)); let c; do c = nz(-9, 9); while (G(a, c) === a); const s = (b * c) / a;
        return Qv("Résous : " + M("\\frac{" + a + "x}{" + b + "} = " + c) + " (valeur exacte).", s, M(a + "x = " + b * c) + ", donc " + M("x = " + frac(b * c, a)) + ".",
          { ctx: "coefficient", guide: [GS("Multiplie par " + b + " : " + M(a + "x = \\ ?"), b * c, M(b + " \\cdot " + P(c) + " = " + b * c) + "."), GS("Divise par " + a + " : " + M("x = \\ ?"), s, M("x = " + frac(b * c, a)) + ".")],
            traps: [TV((c * a) / b, "Tu as inversé : on multiplie par " + b + ", puis on divise par " + a + "."), TV(c * a * b, "Pour enlever le facteur " + a + ", on divise par " + a + ".")] }); },
    ],
    2: [
      () => { const [a, b] = pk([[2, 3], [2, 5], [3, 4], [4, 6], [3, 6], [2, 4], [4, 5], [6, 9]]), l = lcm(a, b), k = nz(-4, 5), s = l * k, c = s / a + s / b;
        return Qv("Résous : " + M("\\frac{x}{" + a + "} + \\frac{x}{" + b + "} = " + c) + ".", s, "On multiplie par " + l + " : " + M(l / a + "x + " + l / b + "x = " + l * c) + ", soit " + M((l / a + l / b) + "x = " + l * c) + ", donc " + M("x = " + s) + ".",
          { ctx: "deuxfractions", guide: [GS("Par quel nombre (le plus petit) multiplier pour faire disparaître les deux dénominateurs ?", l, M(l) + ", le plus petit multiple commun de " + a + " et " + b + "."), GS("Multiplie <b>chaque</b> terme par " + l + ". Que devient le membre de droite ?", l * c, M(l + " \\cdot " + P(c) + " = " + l * c) + "."), GS(M((l / a + l / b) + "x = " + l * c) + ", donc " + M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV(c / (l / a + l / b), "On multiplie <b>les deux</b> membres par " + l + " : le membre de droite aussi."), TV((c * (a + b)) / 2, "On n'additionne pas les dénominateurs : on met les fractions au même dénominateur.")] }); },
      () => { let a, d, c, f, b, e, s, ok = false;
        for (let k = 0; k < 60 && !ok; k++) { c = R.int(2, 6); f = R.int(2, 6); a = R.int(1, 4); d = R.int(1, 4); b = nz(-6, 6); s = nz(-6, 6); if (c === f || f * a === c * d) continue; const num = (f * a - c * d) * s + f * b; if (num % c) continue; e = num / c; ok = e !== 0 && Math.abs(e) <= 15; }
        if (!ok) return EQF[2][0]();
        const k = f * a - c * d;
        return Qv("Résous : " + M("\\frac{" + L(a, b) + "}{" + c + "} = \\frac{" + L(d, e) + "}{" + f + "}") + ".", s, "Produit en croix : " + M(f + "(" + L(a, b) + ") = " + c + "(" + L(d, e) + ")") + ", soit " + M(L(f * a, f * b) + " = " + L(c * d, c * e)) + ", donc " + M(L(k, 0) + " = " + (c * e - f * b)) + " et " + M("x = " + s) + ".",
          { ctx: "croix", guide: [GS("Produit en croix : " + M(f + "(" + L(a, b) + ") = " + c + "(" + L(d, e) + ")") + ". Développe et regroupe les " + M("x") + " à gauche : quel est leur coefficient ?", k, M(f * a + "x - " + L(c * d, 0) + " = " + L(k, 0)) + "."), GS("Les nombres à droite : " + M(L(k, 0) + " = \\ ?"), c * e - f * b, M(c * e + sgn(-f * b) + " = " + (c * e - f * b)) + "."), GS(M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV((e - b) / k, "Le facteur multiplie toute la parenthèse : " + M(f + "(" + L(a, b) + ") = " + L(f * a, f * b)) + "."), TV((c * e - f * b) / (f * a + c * d), "Pour regrouper les " + M("x") + ", on soustrait " + M(L(c * d, 0)) + " des deux côtés.")] }); },
      () => { const [a, c] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [6, 4], [3, 2], [5, 2]]), l = lcm(a, c), k = nz(-3, 4), s = l * k, b = s / a - s / c;
        if (b === 0) return EQF[2][2]();
        return Qv("Résous : " + M("\\frac{x}{" + a + "}" + sgn(-b) + " = \\frac{x}{" + c + "}") + ".", s, "On multiplie par " + l + " : " + M(l / a + "x" + sgn(-l * b) + " = " + l / c + "x") + ", donc " + M(L(l / a - l / c, 0) + " = " + l * b) + " et " + M("x = " + s) + ".",
          { ctx: "xdeuxcotes", guide: [GS("Par quel nombre (le plus petit) multiplier les deux membres ?", l, M(l) + "."), GS("Après la multiplication, regroupe les " + M("x") + " à gauche : " + M(L(l / a - l / c, 0) + " = \\ ?"), l * b, M(l + " \\cdot " + P(b) + " = " + l * b) + "."), GS(M("x = \\ ?"), s, M("x = " + s) + ".")],
            traps: [TV(b / (l / a - l / c), "Le nombre " + M(tn(-b)) + " doit aussi être multiplié par " + l + ".")] }); },
    ],
    3: [
      () => { const [p, q] = pk([[2, 3], [3, 4], [4, 6], [2, 5], [3, 5], [6, 4], [4, 3], [5, 2]]), l = lcm(p, q), a = R.int(1, 7), b = R.int(1, 7), c = nz(-3, 4), A = l / p, B = l / q;
        if (A === B) return EQF[3][0]();
        const num = l * c - A * a - B * b, s = num / (A - B);
        return Qv("Résous : " + M("\\frac{x + " + a + "}{" + p + "} - \\frac{x - " + b + "}{" + q + "} = " + c) + " (valeur exacte).", s, "On multiplie par " + l + " : " + M(A + "(x + " + a + ") - " + B + "(x - " + b + ") = " + l * c) + ", soit " + M(L(A - B, A * a + B * b) + " = " + l * c) + ", donc " + M("x = " + tn(s)) + ".",
          { ctx: "deuxnumerateurs", guide: [GS("Par quel nombre multiplier (le plus petit) ?", l, M(l) + "."), GS("Développe " + M(A + "(x + " + a + ") - " + B + "(x - " + b + ")") + " : quel est le nombre seul ?", A * a + B * b, M(A * a + " + " + B * b + " = " + (A * a + B * b)) + " : " + M("-" + B + " \\cdot (-" + b + ") = +" + B * b) + "."), GS(M("x = \\ ?") + " (valeur exacte)", s, M(L(A - B, 0) + " = " + num) + ", " + M("x = " + tn(s)) + ".")],
            traps: [TV((l * c - A * a + B * b) / (A - B), "Le « − » devant la deuxième fraction porte sur tout son numérateur : " + M("-" + B + "(x - " + b + ") = -" + B + "x + " + B * b) + "."), TV((c - A * a - B * b) / (A - B), "Le membre de droite aussi est multiplié par " + l + ".")] }); },
      () => { const [p, q] = pk([[3, 5], [2, 3], [4, 3], [3, 4], [5, 2], [6, 4]]), l = lcm(p, q), A = l / p, B = l / q, a = R.int(1, 3), b = nz(-5, 5), c = R.int(1, 3), d = nz(-5, 5), k = nz(-3, 3);
        const co = A * a + B * c, num = l * k - A * b - B * d, s = num / co;
        if (num === 0) return EQF[3][1]();
        return Qv("Résous : " + M("\\frac{" + L(a, b) + "}{" + p + "} + \\frac{" + L(c, d) + "}{" + q + "} = " + k) + " (valeur exacte).", s, "On multiplie par " + l + " : " + M(A + "(" + L(a, b) + ") + " + B + "(" + L(c, d) + ") = " + l * k) + ", soit " + M(L(co, A * b + B * d) + " = " + l * k) + ", donc " + M("x = " + tn(s)) + ".",
          { ctx: "sommefractions", guide: [GS("Multiplie par " + l + ". Que devient le membre de droite ?", l * k, M(l + " \\cdot " + P(k) + " = " + l * k) + "."), GS("Coefficient de " + M("x") + " à gauche ?", co, M(A + " \\cdot " + a + " + " + B + " \\cdot " + c + " = " + co) + "."), GS(M("x = \\ ?") + " (valeur exacte)", s, M(L(co, 0) + " = " + num) + ", " + M("x = " + tn(s)) + ".")],
            traps: [TV((k - A * b - B * d) / co, "Le membre de droite aussi est multiplié par " + l + " : " + M(l * k) + ".")] }); },
      () => { const [a, b] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 6]]), l = lcm(a, b), k = nz(-3, 4), s = l * k, c = s / a + s / b, w = pk(WHO), wrong = c / (l / a + l / b);
        return Qv(w + " résout " + M("\\frac{x}{" + a + "} + \\frac{x}{" + b + "} = " + c) + " : « je multiplie par " + l + " : " + M(l / a + "x + " + l / b + "x = " + c) + ", donc " + M("x = " + tn(wrong)) + " ». Trouve l'erreur, puis donne la bonne solution.", s,
          w + " n'a pas multiplié le membre de droite : " + M(l / a + "x + " + l / b + "x = " + l * c) + ", donc " + M("x = " + s) + ".",
          { ctx: "erreur", guide: [GS("Multiplie <b>aussi</b> le membre de droite par " + l + " : il vaut ?", l * c, M(l + " \\cdot " + P(c) + " = " + l * c) + "."), GS(M("x = \\ ?"), s, M((l / a + l / b) + "x = " + l * c) + ", " + M("x = " + s) + ".")],
            traps: [TV(wrong, "C'est le résultat de " + w + " : une équation reste équilibrée seulement si l'on multiplie <b>les deux</b> membres.")] }); },
    ],
  };

  // ===================== eqspec : aucune solution, tous les nombres, x = 0 =====================
  const SPE = {
    1: [
      () => { const a = R.int(2, 9), b = nz(-9, 9); let c; do c = nz(-9, 9); while (c === b);
        return Qs("Résous : " + M(L(a, b) + " = " + c + " + " + a + "x") + "." + ASKS, [], "On soustrait " + M(a + "x") + " des deux côtés : " + M(b + " = " + c) + ", ce qui est faux. Aucun nombre ne convient : " + M("S = \\varnothing") + ".",
          { ctx: "impossible", guide: [GS("Soustrais " + M(a + "x") + " des deux côtés. Combien de " + M("x") + " reste-t-il ?", 0, "Aucun : il reste " + M(b + " = " + c) + "."), GSet("L'égalité " + M(b + " = " + c) + " est fausse. Quelles sont les solutions ?", [], "Aucune : quel que soit " + M("x") + ", les deux membres diffèrent de " + Math.abs(b - c) + ".")],
            traps: [TS([0], M("x = 0") + " ne marche pas : " + M(b + " \\ne " + c) + ". Les " + M("x") + " ont disparu et l'égalité restante est fausse : aucune solution."), TA("L'égalité " + M(b + " = " + c) + " est fausse : aucun nombre ne convient.")] }); },
      () => { const a = R.int(2, 7), b = nz(-8, 8);
        return Qs("Résous : " + M(a + "(x" + sgn(b) + ") = " + L(a, a * b)) + "." + ASKS, [], "On développe : " + M(L(a, a * b) + " = " + L(a, a * b)) + " ; les deux membres sont identiques. Tout nombre est solution : " + M("S = \\mathbb{R}") + ".",
          { ctx: "indeterminee", all: true, guide: [GS("Développe le membre de gauche : quel est le nombre seul ?", a * b, M(a + "(x" + sgn(b) + ") = " + L(a, a * b)) + "."), GSet("On obtient " + M(L(a, a * b) + " = " + L(a, a * b)) + ", soit " + M("0 = 0") + " : vrai. Quelles sont les solutions ?", [], "Tous les nombres (écris « tous ») : l'égalité est vraie pour n'importe quel " + M("x") + ".", true)],
            traps: [TS([0], M("0 = 0") + " ne veut pas dire " + M("x = 0") + " : l'égalité est vraie pour <b>tous</b> les nombres. Essaie " + M("x = 5") + "."), TN("L'égalité obtenue, " + M("0 = 0") + ", est vraie : tout nombre est solution, il y en a une infinité.")] }); },
      () => { let a, c; do { a = R.int(2, 9); c = R.int(1, 9); } while (a === c); const b = nz(-9, 9);
        return Qs("Résous : " + M(L(a, b) + " = " + L(c, b)) + "." + ASKS, [0], M(L(a - c, 0) + " = 0") + ", donc " + M("x = 0") + " : l'équation a <b>une</b> solution, le nombre 0.",
          { ctx: "xzero", guide: [GS("Regroupe : " + M(L(a - c, 0) + " = \\ ?"), 0, M(b + " - " + P(b) + " = 0") + "."), GSet("Un produit " + M(L(a - c, 0)) + " vaut 0 : solutions ?", [0], M("x = 0") + ". Vérification : les deux membres valent " + M(b) + ".")],
            traps: [TN("Les " + M("x") + " ne s'éliminent pas : " + M(L(a - c, 0) + " = 0") + " donne " + M("x = 0") + ", qui est une vraie solution."), TA("Essaie " + M("x = 1") + " : " + M(a + b) + " et " + M(c + b) + " ne sont pas égaux. Seul 0 convient.")] }); },
      () => { const a = R.int(2, 6), b = nz(-6, 6), c = R.int(1, 5), s = nz(-6, 6), d = (a + c) * s + b - a * c;
        return Qs("Résous : " + M(a + "(x - " + c + ")" + sgn(b) + " = " + L(-c, d)) + "." + ASKS, [s], M(L(a, b - a * c) + " = " + L(-c, d)) + ", soit " + M(L(a + c, 0) + " = " + (d - b + a * c)) + ", donc " + M("x = " + s) + ".",
          { ctx: "unique", guide: [GS("Développe et regroupe les " + M("x") + " à gauche : coefficient ?", a + c, M(a + "x + " + c + "x = " + (a + c) + "x") + "."), GSet("Résous " + M(L(a + c, 0) + " = " + (d - b + a * c)) + " :", [s], M("x = " + s) + ".")],
            traps: [TN("Les " + M("x") + " ne s'éliminent pas ici : il y a une solution unique."), TS([(d - b + a * c) / (a - c)], "Pour regrouper, on <b>ajoute</b> " + M(c + "x") + " des deux côtés.")] }); },
    ],
    2: [
      () => { const k = R.int(2, 5), p = R.int(2, 5), q = nz(-7, 7), r = nz(-7, 7), same = R.rand() < 0.5, t = same ? k * q - p * r : k * q - p * r + nz(-4, 4);
        return Qs("Résous : " + M(k + "(" + L(p, q) + ") - " + p + "(" + L(k, r) + ") = " + t) + "." + ASKS, [], "On développe : " + M(L(k * p, k * q) + " - " + p * k + "x" + sgn(-p * r) + " = " + t) + ", soit " + M((k * q - p * r) + " = " + t) + " : " + (same ? "vrai pour tout " + M("x") + " ; " + M("S = \\mathbb{R}") : "faux ; " + M("S = \\varnothing")) + ".",
          { ctx: "parentheses", all: same, guide: [GS("Développe : combien reste-t-il de " + M("x") + " ?", 0, M(k * p + "x - " + p * k + "x = 0") + "."), GS("Quel nombre reste-t-il à gauche ?", k * q - p * r, M(k * q + sgn(-p * r) + " = " + (k * q - p * r)) + "."), GSet(M((k * q - p * r) + " = " + t) + " est " + (same ? "vrai" : "faux") + ". Solutions ?", [], same ? "Tous les nombres." : "Aucune.", same)],
            traps: [TS([0], "Les " + M("x") + " ont disparu : la réponse n'est pas " + M("x = 0") + ", elle dépend de l'égalité qui reste."), same ? TN("L'égalité qui reste est <b>vraie</b> : tout nombre est solution.") : TA("L'égalité qui reste est <b>fausse</b> : aucun nombre ne convient.")] }); },
      () => { const a = R.int(1, 7), same = R.rand() < 0.5, c = same ? a * a : a * a + nz(-5, 5), s = pk([1, -1]);
        return Qs("Résous : " + M("(x " + (s > 0 ? "+ " : "- ") + a + ")^2 = x^2 " + (s > 0 ? "+ " : "- ") + 2 * a + "x + " + c) + "." + ASKS, [], M("(x " + (s > 0 ? "+ " : "- ") + a + ")^2 = x^2 " + (s > 0 ? "+ " : "- ") + 2 * a + "x + " + a * a) + " : il reste " + M(a * a + " = " + c) + ", " + (same ? "vrai : tous les nombres sont solutions" : "faux : aucune solution") + ".",
          { ctx: "identite", all: same, guide: [GS("Développe " + M("(x " + (s > 0 ? "+ " : "- ") + a + ")^2") + " : terme constant ?", a * a, M(a + "^2 = " + a * a) + "."), GSet("Il reste " + M(a * a + " = " + c) + ". Solutions ?", [], same ? "Tous les nombres : c'est une identité." : "Aucune.", same)],
            traps: [same ? TN("Les deux membres sont égaux pour tout " + M("x") + " : c'est l'identité remarquable.") : TA("Il reste " + M(a * a + " = " + c) + ", faux : aucune solution."), TS([0], "Les " + M("x") + " s'éliminent : la réponse dépend de l'égalité qui reste, pas de " + M("x = 0") + ".")] }); },
      () => { const a = R.int(2, 6), w = pk(WHO);
        return Qs(w + " résout " + M(a + "(x + 1) = " + a + "x + " + a) + ". " + (w === "Léa" || w === "Inès" || w === "Mia" || w === "Lina" ? "Elle" : "Il") + " obtient " + M("0 = 0") + " et écrit " + M("S = \\{0\\}") + ". Corrige." + ASKS, [], M("0 = 0") + " est vraie quel que soit " + M("x") + " : tout nombre est solution, " + M("S = \\mathbb{R}") + ". Par exemple " + M("x = 3") + " : " + M(a + " \\cdot 4 = " + 4 * a) + " et " + M(3 * a + " + " + a + " = " + 4 * a) + ".",
          { ctx: "erreur", all: true, guide: [GS("Teste " + M("x = 3") + " : combien vaut le membre de gauche ?", 4 * a, M(a + " \\cdot 4 = " + 4 * a) + ", et le membre de droite aussi : 3 est solution."), GSet("Solutions ?", [], "Tous les nombres.", true)],
            traps: [TS([0], "C'est l'erreur de " + w + " : " + M("0 = 0") + " ne signifie pas " + M("x = 0") + "."), TN(M("0 = 0") + " est une égalité <b>vraie</b> : tout nombre convient.")] }); },
      () => { let a, b, c, d; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); d = a + b - c; } while (d === 0 || a * b === c * d || [a, b].sort().join() === [c, d].sort().join());
        return Qs("Résous : " + M("(" + L(1, a) + ")(" + L(1, b) + ") = (" + L(1, c) + ")(" + L(1, d) + ")") + "." + ASKS, [], M(T2(1, a + b, a * b) + " = " + T2(1, c + d, c * d)) + " : les " + M("x^2") + " et les " + M("x") + " s'éliminent, il reste " + M(a * b + " = " + c * d) + ", faux. Aucune solution.",
          { ctx: "produits", guide: [GS("Développe les deux membres. Coefficient de " + M("x") + " à gauche ? (compare avec la droite)", a + b, M(a + b) + " des deux côtés : les " + M("x") + " s'éliminent."), GSet("Il reste " + M(a * b + " = " + c * d) + ". Solutions ?", [], "Aucune.")],
            traps: [TS([0], "Il ne reste plus de " + M("x") + " : " + M(a * b + " = " + c * d) + " est faux, donc aucune solution."), TA(M(a * b + " = " + c * d) + " est faux : aucun nombre ne convient.")] }); },
    ],
    3: [
      () => { const a = R.int(2, 7), b = R.int(1, 8), c = a - 1;
        return Qv("Pour quelle valeur de " + M("k") + " l'équation " + M(a + "(x + " + b + ") - x = " + L(c, 0) + " + k") + " a-t-elle pour solutions tous les nombres ?", a * b, M(L(c, a * b) + " = " + L(c, 0) + " + k") + " : il faut " + M("k = " + a * b) + " (sinon, aucune solution).",
          { ctx: "param-tous", guide: [GS("Développe et réduis le membre de gauche : terme constant ?", a * b, M(a + "x + " + a * b + " - x = " + L(c, a * b)) + "."), GS("Pour que les deux membres soient identiques, " + M("k = \\ ?"), a * b, M("k = " + a * b) + ".")],
            traps: [TV(b, "On développe : " + M(a + "(x + " + b + ") = " + a + "x + " + a * b) + "."), TV(0, "Si " + M("k = 0") + ", il reste " + M(a * b + " = 0") + ", faux.")] }); },
      () => { const c = R.int(2, 5), b = R.int(1, 6), a = nz(-9, 9), m = 2 * c; if (a === 2 * b) return SPE[3][1]();
        return Qv("Pour quelle valeur de " + M("m") + " l'équation " + M("mx" + sgn(a) + " = 2(" + L(c, b) + ")") + " n'a-t-elle aucune solution ?", m, M("mx" + sgn(a) + " = " + L(2 * c, 2 * b)) + " ; si " + M("m = " + m) + ", les " + M("x") + " s'éliminent et il reste " + M(a + " = " + 2 * b) + ", faux : aucune solution.",
          { ctx: "param-aucune", guide: [GS("Développe le membre de droite : coefficient de " + M("x") + " ?", 2 * c, M("2(" + L(c, b) + ") = " + L(2 * c, 2 * b)) + "."), GS("Les " + M("x") + " s'éliminent si " + M("m = \\ ?"), m, "Avec " + M("m = " + m) + " : " + M(a + " = " + 2 * b) + " est faux, donc aucune solution.")],
            traps: [TV(c, "Développe d'abord : " + M("2(" + L(c, b) + ") = " + L(2 * c, 2 * b)) + ".")] }); },
      () => { let a, b, c, d; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); d = nz(-6, 6); } while (a + b === c + d || a + b === 0); const k = a + b - c - d, s = (c * d - a * b) / k;
        return Qs("Résous : " + M("(" + L(1, a) + ")(" + L(1, b) + ") = (" + L(1, c) + ")(" + L(1, d) + ")") + " (valeur exacte)." + ASKS, [s], M(T2(1, a + b, a * b) + " = " + T2(1, c + d, c * d)) + " : " + M(L(k, 0) + " = " + (c * d - a * b)) + ", donc " + M("x = " + tn(s)) + ".",
          { ctx: "produits-unique", guide: [GS("Développe : les " + M("x^2") + " s'éliminent. Coefficient de " + M("x") + " après regroupement à gauche ?", k, M((a + b) + " - " + P(c + d) + " = " + k) + "."), GSet("Solution ?", [s], M(L(k, 0) + " = " + (c * d - a * b)) + ", " + M("x = " + tn(s)) + ".")],
            traps: [TN("Les " + M("x^2") + " s'éliminent, mais pas les " + M("x") + " : il reste une équation du 1er degré, avec une solution."), TS([-s], "Vérifie le signe en regroupant : " + M(L(k, 0) + " = " + (c * d - a * b)) + ".")] }); },
    ],
  };

  // ===================== formule : transformer une formule =====================
  // [formule (TeX), lettre cherchée, réponse, réponse TeX, étapes [[consigne, expr, TeX]], piège [expr, message], contexte, pos]
  const FOR = {
    1: [
      ["v = \\frac{d}{t}", "d", "v*t", "v \\cdot t", [], ["v/t", "On multiplie par " + M("t") + " (on ne divise pas)."], "vitesse"],
      ["U = R \\cdot I", "I", "u/r", "\\frac{U}{R}", [], ["u*r", "Pour défaire « fois " + M("R") + " », on divise par " + M("R") + "."], "electricite"],
      ["P = 4c", "c", "p/4", "\\frac{P}{4}", [], ["p-4", "Le 4 multiplie " + M("c") + " : on divise par 4."], "perimetre"],
      ["y = 3x + b", "b", "y-3*x", "y - 3x", [], ["y+3*x", "On soustrait " + M("3x") + " des deux côtés."], "droite"],
      ["F = m \\cdot a", "m", "f/a", "\\frac{F}{a}", [], ["f*a", "On divise par " + M("a") + "."], "force"],
      ["p = \\frac{F}{S}", "F", "p*s", "p \\cdot S", [], ["p/s", "On multiplie les deux membres par " + M("S") + "."], "pression"],
      ["M = \\frac{S}{n}", "S", "m*n", "M \\cdot n", [], ["m/n", "La moyenne est la somme divisée par le nombre de notes : la somme vaut " + M("M \\cdot n") + "."], "moyenne"],
      ["d = v \\cdot t", "t", "d/v", "\\frac{d}{v}", [], ["v/d", "On divise par " + M("v") + " : " + M("t = \\frac{d}{v}") + ", pas l'inverse."], "duree"],
    ],
    2: [
      ["v = \\frac{d}{t}", "t", "d/v", "\\frac{d}{v}", [["Multiplie par " + M("t") + " :", "v*t", "v \\cdot t = d"]], ["v/d", M("vt = d") + ", puis on divise par " + M("v") + " : " + M("t = \\frac{d}{v}") + "."], "vitesse"],
      ["A = \\frac{b \\cdot h}{2}", "h", "2*a/b", "\\frac{2A}{b}", [["Multiplie par 2 : que vaut " + M("b \\cdot h") + " ?", "2*a", "b \\cdot h = 2A"]], ["a/(2*b)", "On multiplie par 2 (pour défaire « divisé par 2 »), puis on divise par " + M("b") + "."], "triangle"],
      ["P = 2(a + b)", "b", "p/2-a", "\\frac{P}{2} - a", [["Divise par 2 : que vaut " + M("a + b") + " ?", "p/2", "a + b = \\frac{P}{2}"]], ["p/2+a", "On soustrait " + M("a") + " : " + M("b = \\frac{P}{2} - a") + "."], "rectangle"],
      ["v = u + a \\cdot t", "t", "(v-u)/a", "\\frac{v - u}{a}", [["Soustrais " + M("u") + " : que vaut " + M("a \\cdot t") + " ?", "v-u", "a \\cdot t = v - u"]], ["v/a-u", "On soustrait " + M("u") + " <b>avant</b> de diviser : " + M("t = \\frac{v - u}{a}") + "."], "acceleration"],
      ["C = \\frac{5(F - 32)}{9}", "F", "9*c/5+32", "\\frac{9C}{5} + 32", [["Multiplie par 9 et divise par 5 : que vaut " + M("F - 32") + " ?", "9*c/5", "F - 32 = \\frac{9C}{5}"]], ["5*c/9+32", "Pour défaire « fois 5, divisé par 9 », on multiplie par 9 et on divise par 5."], "temperature"],
      ["M = \\frac{a + b}{2}", "b", "2*m-a", "2M - a", [["Multiplie par 2 : que vaut " + M("a + b") + " ?", "2*m", "a + b = 2M"]], ["m/2-a", "On multiplie par 2 (on ne divise pas)."], "milieu"],
      ["Q = m \\cdot c \\cdot (f - i)", "f", "q/(m*c)+i", "\\frac{Q}{mc} + i", [["Divise par " + M("m \\cdot c") + " : que vaut " + M("f - i") + " ?", "q/(m*c)", "f - i = \\frac{Q}{mc}"]], ["q/(m*c)-i", "On <b>ajoute</b> " + M("i") + " des deux côtés."], "chaleur"],
      ["p \\cdot V = n \\cdot R \\cdot T", "T", "p*v/(n*r)", "\\frac{pV}{nR}", [], ["n*r/(p*v)", "On divise les deux membres par " + M("nR") + " : " + M("T = \\frac{pV}{nR}") + "."], "gaz"],
    ],
    3: [
      ["A = \\pi r^2", "r", "sqrt(a/pi)", "\\sqrt{\\frac{A}{\\pi}}", [["Divise par " + M("\\pi") + " : que vaut " + M("r^2") + " ?", "a/pi", "r^2 = \\frac{A}{\\pi}"]], ["a/(2*pi)", "Le rayon est au carré : on divise par " + M("\\pi") + ", puis on prend la racine carrée."], "disque", true],
      ["K = \\frac{m v^2}{2}", "v", "sqrt(2*k/m)", "\\sqrt{\\frac{2K}{m}}", [["Que vaut " + M("v^2") + " ?", "2*k/m", "v^2 = \\frac{2K}{m}"]], ["2*k/m", "C'est " + M("v^2") + " : il reste à prendre la racine carrée."], "cinetique", true],
      ["V = \\frac{\\pi r^2 h}{3}", "h", "3*v/(pi*r^2)", "\\frac{3V}{\\pi r^2}", [["Multiplie par 3 : que vaut " + M("\\pi r^2 h") + " ?", "3*v", "\\pi r^2 h = 3V"]], ["v/(3*pi*r^2)", "On multiplie par 3 (pour défaire « divisé par 3 »)."], "cone", true],
      ["c^2 = a^2 + b^2", "a", "sqrt(c^2-b^2)", "\\sqrt{c^2 - b^2}", [["Que vaut " + M("a^2") + " ?", "c^2-b^2", "a^2 = c^2 - b^2"]], ["c-b", M("\\sqrt{c^2 - b^2}") + " n'est pas " + M("c - b") + " : la racine ne se distribue pas sur une différence."], "pythagore", true],
      ["\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q}", "q", "p*f/(p-f)", "\\frac{pf}{p - f}", [["Que vaut " + M("\\frac{1}{q}") + " ?", "1/f-1/p", "\\frac{1}{q} = \\frac{1}{f} - \\frac{1}{p} = \\frac{p - f}{pf}"]], ["f-p", "On ne peut pas inverser terme à terme : on calcule d'abord " + M("\\frac{1}{q} = \\frac{1}{f} - \\frac{1}{p}") + ", puis on prend l'inverse."], "lentille", true],
      ["P = R \\cdot I^2", "I", "sqrt(p/r)", "\\sqrt{\\frac{P}{R}}", [["Que vaut " + M("I^2") + " ?", "p/r", "I^2 = \\frac{P}{R}"]], ["p/(2*r)", "Le carré se défait avec une racine carrée, pas en divisant par 2."], "puissance", true],
      ["d = \\frac{g t^2}{2}", "t", "sqrt(2*d/g)", "\\sqrt{\\frac{2d}{g}}", [["Que vaut " + M("t^2") + " ?", "2*d/g", "t^2 = \\frac{2d}{g}"]], ["2*d/g", "C'est " + M("t^2") + " : il reste la racine carrée."], "chute", true],
      ["A = 4\\pi r^2", "r", "sqrt(a/(4*pi))", "\\sqrt{\\frac{A}{4\\pi}}", [["Que vaut " + M("r^2") + " ?", "a/(4*pi)", "r^2 = \\frac{A}{4\\pi}"]], ["sqrt(a)/(4*pi)", "On divise d'abord par " + M("4\\pi") + ", puis on prend la racine de tout le quotient."], "sphere", true],
    ],
  };
  const FORMULE = {}; for (const d of [1, 2, 3]) FORMULE[d] = FOR[d].map((F) => () => {
    const [f, x, ans, ansT, steps, trap, ctx, pos] = F;
    return Qx("Dans la formule " + M(f) + ", exprime " + M(x) + " en fonction des autres lettres. (Écris par exemple « " + x + " = … » ou seulement l'expression" + (pos ? " ; touche √ pour une racine" : "") + ".)", ans, M(x + " = " + ansT) + ". On isole " + M(x) + " comme une inconnue : on défait les opérations, de l'extérieur vers l'intérieur" + (pos ? " ; la grandeur est positive, d'où la racine positive" : "") + ".",
      { ctx, pos, guide: [...steps.map(([ask, e, t]) => GX(ask, e, M(t) + ".", pos)), GX("Exprime " + M(x) + " :", ans, M(x + " = " + ansT) + ".", pos)], traps: [TX(trap[0], trap[1])] }); });

  // ===================== probeq : mettre en équation (1er degré) =====================
  const PRQ = {
    1: [
      () => { const k = pk([3, 4, 5]), even = R.rand() < 0.4, n = even ? 2 * R.int(5, 40) : R.int(8, 60), st = even ? 2 : 1, cst = st * (k * (k - 1)) / 2, S = k * n + cst;
        const tl = Array.from({ length: k }, (_, i) => (i ? "(n + " + st * i + ")" : "n")), sumT = (k >= 5 ? [tl[0], tl[1], "\\ldots", tl[k - 1]] : tl).join(" + "); /* 25.11 : 5 termes trop larges sur téléphone : somme abrégée */
        return Qv("La somme de " + k + " nombres " + (even ? "pairs" : "entiers") + " consécutifs vaut " + M(S) + ". Quel est le plus petit ?", n, "Avec " + M("n") + " le plus petit : " + M(sumT + " = " + k + "n + " + cst + " = " + S) + ", donc " + M(k + "n = " + (S - cst)) + " et " + M("n = " + n) + ".",
          { ctx: "consecutifs", guide: [GS("Avec " + M("n") + " le plus petit, la somme s'écrit " + M(k + "n + \\ ?") + ". Que vaut le nombre ?", cst, M(st + (k > 2 ? " + " + 2 * st : "") + (k > 3 ? " + " + 3 * st : "") + (k > 4 ? " + " + 4 * st : "") + " = " + cst) + "."), GS(M(k + "n = \\ ?"), S - cst, M(S + " - " + cst + " = " + (S - cst)) + "."), GS(M("n = \\ ?"), n, M("n = " + n) + " ; vérifie en additionnant.")],
            traps: [TV(S / k, "C'est la moyenne des " + k + " nombres, donc celui du milieu" + (k % 2 ? "" : " (ou presque)") + " : on demande le plus petit.")] }); },
      () => { let a, c; do { a = R.int(2, 9); c = R.int(2, 9); } while (a <= c); const x = R.int(2, 15), b = R.int(1, 15), d = (a - c) * x - b; if (d <= 0) return PRQ[1][1]();
        const [u, v] = pk([["Catherine", "Michel"], ["Lina", "Noé"], ["Inès", "Yanis"]]);
        return Qv(u + " et " + v + " affichent le même nombre sur leurs calculatrices. " + u + " le multiplie par " + a + ", puis retire " + b + ". " + v + " le multiplie par " + c + ", puis ajoute " + d + ". Ils obtiennent le même résultat. Quel nombre avaient-ils affiché ?", x, M(a + "x - " + b + " = " + c + "x + " + d) + ", donc " + M((a - c) + "x = " + (b + d)) + " et " + M("x = " + x) + ". Vérification : " + M(a * x - b) + " des deux côtés.",
          { ctx: "calculatrices", guide: [GS("L'équation est " + M(a + "x - " + b + " = " + c + "x + " + d) + ". Regroupe : " + M((a - c) + "x = \\ ?"), b + d, M(d + " + " + b + " = " + (b + d)) + "."), GS(M("x = \\ ?"), x, M("x = " + x) + ".")],
            traps: [TV((d - b) / (a - c), "En faisant passer " + M("-" + b) + " à droite, on ajoute " + b + " : " + M(d + " + " + b) + ".")] }); },
      () => { const n = R.int(4, 6); let notes, m, x; for (let k = 0; k < 50; k++) { notes = Array.from({ length: n }, () => pk([3, 3.5, 4, 4.5, 5, 5.5, 6])); m = pk([4, 4.5, 5]); x = m * (n + 1) - notes.reduce((s, v) => s + v, 0); if (x >= 2 && x <= 6 && x !== m) break; }
        if (!(x >= 2 && x <= 6 && x !== m)) return PRQ[1][0]();
        const S = notes.reduce((s, v) => s + v, 0);
        return Qv("Un élève a obtenu les notes " + notes.map((v) => M(dec(v))).join(", ") + ". Quelle note doit-il obtenir au prochain test pour avoir exactement " + M(dec(m)) + " de moyenne ?", x, "Avec " + M("x") + " la note : " + M("\\frac{" + dec(S) + " + x}{" + (n + 1) + "} = " + dec(m)) + ", donc " + M(dec(S) + " + x = " + dec(m * (n + 1))) + " et " + M("x = " + dec(x)) + ".",
          { ctx: "notes", guide: [GS("Somme des " + (n + 1) + " notes nécessaire pour une moyenne de " + M(dec(m)) + " ?", m * (n + 1), M(dec(m) + " \\cdot " + (n + 1) + " = " + dec(m * (n + 1))) + "."), GS("Somme des notes déjà obtenues ?", S, M(dec(S)) + "."), GS(M("x = \\ ?"), x, M(dec(m * (n + 1)) + " - " + dec(S) + " = " + dec(x)) + ".")],
            traps: [TV(m * n - S, "Il y aura " + (n + 1) + " notes en tout (avec la prochaine) : la somme doit valoir " + M(dec(m) + " \\cdot " + (n + 1)) + ".")] }); },
      () => { const k = pk([2, 3, 4]), x = R.int(6, 15), y = pk([3, 5, 10]), T = (k + 1) * x + 2 * y, who = k === 4 ? pk([["Une grand-mère", "son petit-fils", "la grand-mère"], ["Un grand-père", "sa petite-fille", "le grand-père"]]) : pk([["Un père", "son fils", "le père"], ["Une mère", "sa fille", "la mère"], ["Une tante", "son neveu", "la tante"]]);
        return Qv(who[0] + " a " + (k === 2 ? "le double" : k === 3 ? "le triple" : "le quadruple") + " de l'âge de " + who[1] + ". Dans " + y + " ans, ils auront à eux deux " + T + " ans. Quel âge a " + who[2] + " aujourd'hui ?", k * x,
          "Âge de " + who[1] + " : " + M("x") + ". Dans " + y + " ans : " + M("(x + " + y + ") + (" + k + "x + " + y + ") = " + T) + ", donc " + M((k + 1) + "x = " + (T - 2 * y)) + ", " + M("x = " + x) + ", et " + who[2] + " a " + M(k + " \\cdot " + x + " = " + k * x) + " ans.",
          { ctx: "ages", guide: [GS("Avec " + M("x") + " l'âge de " + who[1] + ", dans " + y + " ans la somme vaut " + M((k + 1) + "x + \\ ?") + ". Le nombre ?", 2 * y, M(y + " + " + y + " = " + 2 * y) + " : chacun vieillit de " + y + " ans."), GS("Âge de " + who[1] + " : " + M("x = \\ ?"), x, M((k + 1) + "x = " + (T - 2 * y)) + ", " + M("x = " + x) + "."), GS("Âge de " + who[2] + " aujourd'hui ?", k * x, M(k * x) + " ans.")],
            traps: [TV(x, "C'est l'âge de " + who[1] + " : on demande celui de " + who[2] + "."), TV((k * (T - y)) / (k + 1), "Dans " + y + " ans, <b>chacun</b> a " + y + " ans de plus : on retire " + 2 * y + " ans.")] }); },
    ],
    2: [
      () => { const p = pk([10, 15, 20, 25, 30, 40]), x = 20 * R.int(2, 30), P = (x * (100 - p)) / 100, obj = pk(["une veste", "un vélo", "une console", "un téléphone", "une tente"]);
        return Qv("Après une réduction de " + p + " %, " + obj + " coûte " + M(nb(P)) + " CHF. Quel était son prix avant la réduction (en CHF) ?", x, "Le prix payé représente " + (100 - p) + " % du prix initial : " + M(dec((100 - p) / 100) + " \\cdot x = " + nb(P)) + ", donc " + M("x = " + nb(x)) + " CHF.",
          { ctx: "reduction", guide: [GS("Le prix payé représente quel pourcentage du prix initial ?", 100 - p, M("100 - " + p + " = " + (100 - p)) + " %."), GS("Résous " + M(dec((100 - p) / 100) + " \\cdot x = " + nb(P)) + " : " + M("x = \\ ?"), x, M("x = \\frac{" + nb(P) + "}{" + dec((100 - p) / 100) + "} = " + nb(x)) + " CHF.")],
            traps: [TV(P * (1 + p / 100), "Ajouter " + p + " % au prix réduit ne redonne pas le prix initial : les " + p + " % se calculaient sur le prix initial."), TV(P + p, "La réduction est un pourcentage, pas un montant en CHF.")] }); },
      () => { const C = pk([[[1, 4], [2, 3], "de rock", "de rap", "chansons", "autres chansons sont du reggae"], [[1, 3], [1, 2], "des romans", "des BD", "livres", "autres livres sont des atlas"], [[2, 5], [1, 3], "de pop", "de jazz", "chansons", "autres chansons sont du rap"], [[1, 6], [3, 4], "au football", "au basket", "élèves", "autres élèves jouent au tennis"], [[3, 8], [1, 4], "de rap", "de rock", "chansons", "autres chansons sont du jazz"]]);
        const [[a1, b1], [a2, b2]] = C, num = b1 * b2 - a1 * b2 - a2 * b1, den = b1 * b2, g = G(num, den), N = num / g, D = den / g, k = R.int(2, 6), x = D * k, left = N * k;
        return Qv("Dans une liste de " + C[4] + ", " + M(frac(a1, b1)) + " sont " + C[2] + ", " + M(frac(a2, b2)) + " sont " + C[3] + ", et les " + left + " " + C[5] + ". Combien y en a-t-il en tout ?", x, "Il reste " + M("1 - " + frac(a1, b1) + " - " + frac(a2, b2) + " = " + frac(N, D)) + " du total : " + M(frac(N, D) + "x = " + left) + ", donc " + M("x = " + x) + ".",
          { ctx: "fractions", guide: [GS("Quelle fraction du total reste-t-il ?", N / D, M(frac(N, D)) + "."), GS("Résous " + M(frac(N, D) + " x = " + left) + " : " + M("x = \\ ?"), x, M("x = " + left + " \\cdot " + frac(D, N) + " = " + x) + ".")],
            traps: [TV((left * N) / D, "On divise par la fraction (on multiplie par son inverse) : " + M(left + " \\cdot " + frac(D, N)) + "."), TV(left * (b1 + b2), "On cherche le total : la part qui reste, " + M(frac(N, D)) + ", correspond à " + left + ".")] }); },
      () => { const n = pk([3, 4, 5]), d = pk([5, 10, 15, 20]), x = 5 * R.int(4, 30), T = n * x + (d * n * (n - 1)) / 2, what = pk([["Paul lit un livre", "pages", "lit"], ["Une cycliste s'entraîne", "km", "parcourt"], ["Un apprenti range des cartons", "cartons", "range"]]);
        /* 25.11 (377 px sur téléphone) : 5 jours → somme abrégée « x + (x + d) + … + (x + 4d) ». */
        return Qv(what[0] + " en " + n + " jours : en tout " + T + " " + what[1] + ". Chaque jour, " + (what[2] === "lit" ? "il lit" : what[2] === "parcourt" ? "elle parcourt" : "il range") + " " + d + " " + what[1] + " de plus que la veille. Combien le premier jour ?", x, M(Array.from({ length: n }, (_, i) => (i ? "(x + " + d * i + ")" : "x")).filter((t, i) => n < 5 || i < 2 || i === n - 1).map((t, i) => (n >= 5 && i === 2 ? "\\ldots + " + t : t)).join(" + ") + " = " + n + "x + " + (d * n * (n - 1)) / 2 + " = " + T) + ", donc " + M(n + "x = " + (T - (d * n * (n - 1)) / 2)) + " et " + M("x = " + x) + ".",
          { ctx: "suite", guide: [GS("Avec " + M("x") + " le premier jour, le total s'écrit " + M(n + "x + \\ ?") + ". Le nombre ?", (d * n * (n - 1)) / 2, M(Array.from({ length: n - 1 }, (_, i) => d * (i + 1)).join(" + ") + " = " + (d * n * (n - 1)) / 2) + "."), GS(M("x = \\ ?"), x, M(n + "x = " + (T - (d * n * (n - 1)) / 2)) + ", " + M("x = " + x) + ".")],
            traps: [TV(T / n, "C'est la moyenne par jour : le premier jour est en dessous, car chaque jour en ajoute " + d + ".")] }); },
      () => { const b = pk([2, 3, 4, 5]), h = pk([1, 1.5, 2, 2.5]), B = b + pk([1, 2, 3, 4]), A = ((B + b) * h) / 2;
        return Qv("La coupe d'un canal est un trapèze de petite base " + M(b) + " m et de hauteur " + M(dec(h)) + " m. Quelle doit être la grande base (en m) pour que l'aire de la coupe soit " + M(dec(A)) + " m² ?", B, M("\\frac{(B + " + b + ") \\cdot " + dec(h) + "}{2} = " + dec(A)) + ", donc " + M("B + " + b + " = \\frac{2 \\cdot " + dec(A) + "}{" + dec(h) + "} = " + dec(B + b)) + " et " + M("B = " + dec(B)) + " m.",
          { ctx: "trapeze", fig: FIG.trapezoid("B = ?", b + " m", decTxt(h) + " m"), guide: [GS("Multiplie par 2 et divise par " + M(dec(h)) + " : que vaut " + M("B + " + b) + " ?", B + b, M("\\frac{2 \\cdot " + dec(A) + "}{" + dec(h) + "} = " + dec(B + b)) + "."), GS(M("B = \\ ?"), B, M(dec(B + b) + " - " + b + " = " + dec(B)) + " m.")],
            traps: [TV(B + b, "C'est la somme des deux bases : retire la petite base."), TV(A / h - b, "L'aire d'un trapèze se divise par 2 : on multiplie donc par 2 avant tout.")] }); },
    ],
    3: [
      () => { let n, k, a, x; for (let t = 0; t < 80; t++) { n = R.int(18, 30); k = R.int(2, 5); a = pk([1.5, 2, 2.5, 3, 4]); x = ((n - k) * a) / k; if (Number.isInteger(x * 2) && x >= 12 && x <= 45) break; }
        if (!(Number.isInteger(x * 2) && x >= 12 && x <= 45)) return PRQ[3][1]();
        return Qv("Les " + n + " élèves d'une classe vont au restaurant. Au moment de payer, " + k + " d'entre eux ont oublié leur porte-monnaie. Les autres paient chacun " + M(dec(a)) + " CHF de plus que le prix de leur menu. Quel est le prix d'un menu (en CHF) ?", x,
          "Prix " + M("x") + " : " + M("(" + n + " - " + k + ")(x + " + dec(a) + ") = " + n + "x") + ", soit " + M((n - k) + "x + " + dec((n - k) * a) + " = " + n + "x") + ", donc " + M(k + "x = " + dec((n - k) * a)) + " et " + M("x = " + dec(x)) + " CHF.",
          { ctx: "restaurant", guide: [GS("L'addition totale vaut " + M(n + "x") + ". Elle est payée par combien d'élèves ?", n - k, M(n + " - " + k + " = " + (n - k)) + "."), GS("Développe " + M((n - k) + "(x + " + dec(a) + ") = " + n + "x") + " et regroupe : " + M(k + "x = \\ ?"), (n - k) * a, M((n - k) + " \\cdot " + dec(a) + " = " + dec((n - k) * a)) + "."), GS(M("x = \\ ?"), x, M("x = " + dec(x)) + " CHF.")],
            traps: [TV((n * a) / k, "Ce sont les " + (n - k) + " élèves présents qui paient le supplément, pas les " + n + "."), TV((n - k) * a, "C'est le supplément total : il couvre " + k + " menus.")] }); },
      () => { const w = pk([20, 22, 24, 25, 26]), h = R.int(3, 12), S = 40 * w + 1.5 * w * h;
        return Qv("Le salaire horaire d'un employé est de " + w + " CHF pour les 40 premières heures de la semaine ; chaque heure supplémentaire est payée une fois et demie plus. Cette semaine, il a gagné " + M(nb(S)) + " CHF. Combien d'heures supplémentaires a-t-il faites ?", h,
          M("40 \\cdot " + w + " + " + dec(1.5 * w) + " \\cdot h = " + nb(S)) + ", donc " + M(dec(1.5 * w) + "h = " + nb(S - 40 * w)) + " et " + M("h = " + h) + ".",
          { ctx: "salaire", guide: [GS("Salaire des 40 premières heures ?", 40 * w, M("40 \\cdot " + w + " = " + nb(40 * w)) + " CHF."), GS("Prix d'une heure supplémentaire ?", 1.5 * w, M("1{,}5 \\cdot " + w + " = " + dec(1.5 * w)) + " CHF."), GS(M("h = \\ ?"), h, M("\\frac{" + nb(S - 40 * w) + "}{" + dec(1.5 * w) + "} = " + h) + ".")],
            traps: [TV((S - 40 * w) / w, "Les heures supplémentaires sont payées " + M(dec(1.5 * w)) + " CHF, pas " + w + " CHF.")] }); },
      () => { const v1 = pk([15, 18, 20, 24]), v2 = pk([40, 45, 50, 60, 72]), t0 = pk([0.5, 1, 1.5, 2]), t = (v1 * t0) / (v2 - v1);
        if (!Number.isInteger(t * 4)) return PRQ[3][2]();
        return Qv("Une cycliste part de Genève à " + v1 + " km/h. " + decTxt(t0) + " h plus tard, une voiture part du même endroit, sur la même route, à " + v2 + " km/h. Au bout de combien de temps (en h, après son départ) la voiture rattrape-t-elle la cycliste ?", t,
          "En " + M("t") + " heures, la voiture fait " + M(v2 + "t") + " km et la cycliste " + M(v1 + "(t + " + dec(t0) + ")") + " km : " + M(v2 + "t = " + v1 + "t + " + dec(v1 * t0)) + ", donc " + M((v2 - v1) + "t = " + dec(v1 * t0)) + " et " + M("t = " + dec(t)) + " h.",
          { ctx: "poursuite", guide: [GS("Quelle avance (en km) la cycliste a-t-elle au départ de la voiture ?", v1 * t0, M(v1 + " \\cdot " + dec(t0) + " = " + dec(v1 * t0)) + " km."), GS("De combien de km/h la voiture va-t-elle plus vite ?", v2 - v1, M(v2 - v1) + " km/h : elle grignote l'avance."), GS(M("t = \\ ?"), t, M("\\frac{" + dec(v1 * t0) + "}{" + (v2 - v1) + "} = " + dec(t)) + " h.")],
            traps: [TV((v1 * t0) / (v2 + v1), "Elles roulent dans le même sens : l'écart diminue de " + M(v2 + " - " + v1) + " km/h, pas de " + M(v2 + " + " + v1) + ".")] }); },
      () => { const a = pk([6, 7, 8, 9, 10]), b = pk([3, 4, 5].filter((v) => v < a)), x = R.int(8, 25), A = (a - b) * x, lieu = pk([["La piscine", "une entrée"], ["Le cinéma", "une séance"], ["La patinoire", "une entrée"]]);
        return Qv(lieu[0] + " propose " + lieu[1] + " à " + a + " CHF, ou un abonnement annuel à " + A + " CHF qui fait payer " + lieu[1] + " " + b + " CHF. Pour combien d'entrées les deux formules coûtent-elles la même chose ?", x, M(a + "x = " + A + " + " + b + "x") + ", donc " + M((a - b) + "x = " + A) + " et " + M("x = " + x) + ". Au-delà, l'abonnement est plus avantageux.",
          { ctx: "tarifs", guide: [GS("Écris " + M(a + "x = " + A + " + " + b + "x") + ". Regroupe : coefficient de " + M("x") + " ?", a - b, M(a + " - " + b + " = " + (a - b)) + "."), GS(M("x = \\ ?"), x, M("\\frac{" + A + "}{" + (a - b) + "} = " + x) + ".")],
            traps: [TV(A / a, "L'abonnement coûte " + A + " CHF <b>plus</b> " + b + " CHF par entrée : on compare " + M(a + "x") + " et " + M(A + " + " + b + "x") + ".")] }); },
      () => { const k = pk([2, 3]), r = pk([8, 12, 16, 24]), who = pk(["prunes", "cerises", "noix"]);
        const X = k === 3 ? (r * 27) / 8 : r * 4; if (!Number.isInteger(X)) return PRQ[3][4]();
        const frx = k === 3 ? "un tiers" : "la moitié", f = k === 3 ? 2 / 3 : 1 / 2, n = k === 3 ? 3 : 2;
        return Qv((n === 3 ? "Trois amis" : "Deux amis") + " partagent un sac de " + who + " pendant la nuit. Chacun se réveille à son tour et mange " + frx + " de ce qui reste dans le sac. Au matin, il reste " + r + " " + who + ". Combien y en avait-il au départ ?", X,
          "Chaque fois, il reste " + M(frac(k - 1, k)) + " du sac : " + M("x \\cdot (" + frac(k - 1, k) + ")^" + n + " = " + r) + ", donc " + M("x = " + r + " \\cdot (" + frac(k, k - 1) + ")^" + n + " = " + X) + ".",
          { ctx: "partage", guide: [GS("Quelle fraction du sac reste-t-il après les " + n + " réveils ?", f ** n, M("(" + frac(k - 1, k) + ")^" + n + " = " + frac((k - 1) ** n, k ** n)) + "."), GS(M("x = \\ ?"), X, M(r + " : " + frac((k - 1) ** n, k ** n) + " = " + X) + ".")],
            traps: [TV(r * (k / (k - 1)) ** (n - 1), "Il y a " + n + " réveils : on remonte " + n + " fois en divisant par " + M(frac(k - 1, k)) + "."), TV(r * (n + 1), "Chacun mange " + frx + " de <b>ce qui reste</b> : les fractions se multiplient, elles ne s'additionnent pas.")] }); },
    ],
  };

  // ===================== eq2fact : 2e degré par factorisation (et méthode directe) =====================
  const E2F = {
    1: [
      () => { const k = R.int(2, 12), c = pk([0, R.int(1, 20)]), v = pk(["x", "t", "u"]);
        return Qs("Résous : " + M(v + "^2" + (c ? " + " + c : "") + " = " + (k * k + c)) + "." + ASK, [-k, k], M(v + "^2 = " + k * k) + ", donc " + M(v + " = " + k) + " ou " + M(v + " = -" + k) + " : " + SS([-k, k]) + ".",
          { ctx: "direct", guide: [GS(M(v + "^2 = \\ ?"), k * k, M(v + "^2 = " + k * k) + "."), GSet("Quels nombres ont " + k * k + " pour carré ?", [-k, k], M(k) + " et " + M(-k) + " : " + M("(-" + k + ")^2 = " + k * k) + " aussi.")],
            traps: [TS([k], "N'oublie pas la solution négative : " + M("(-" + k + ")^2 = " + k * k) + "."), TS([-(k * k), k * k], "C'est " + M(v + "^2") + " qui vaut " + k * k + " : il faut encore prendre la racine carrée.")] }); },
      () => { const [p, q] = pk([[3, 2], [5, 2], [2, 3], [4, 3], [5, 3], [3, 4], [5, 4], [1, 2], [1, 3], [7, 2]]);
        return Qs("Résous : " + M(q * q + "x^2 = " + p * p) + " (valeurs exactes)." + ASK, [-p / q, p / q], M("x^2 = " + frac(p * p, q * q)) + ", donc " + M("x = \\pm " + frac(p, q)) + " : " + SS([-p / q, p / q]) + ".",
          { ctx: "direct-frac", guide: [GS(M("x^2 = \\ ?"), (p * p) / (q * q), M(frac(p * p, q * q)) + "."), GSet("Solutions ?", [-p / q, p / q], M("\\pm\\sqrt{" + frac(p * p, q * q) + "} = \\pm " + frac(p, q)) + ".")],
            traps: [TS([p / q], "Il y a deux solutions : " + M(frac(p, q)) + " et " + M("-" + frac(p, q)) + "."), TS([-(p * p) / (q * q), (p * p) / (q * q)], "C'est " + M("x^2") + " : prends la racine carrée.")] }); },
      () => { const c = R.int(1, 12);
        if (R.rand() < 0.4) { const r = R.int(2, 9); return Qs("Résous : " + M("x^2 + " + c + " = " + (r * r + c)) + "." + ASK, [-r, r], M("x^2 = " + r * r) + " : " + SS([-r, r]) + ".", { ctx: "direct-plus", guide: [GS(M("x^2 = \\ ?"), r * r, M(r * r) + "."), GSet("Solutions ?", [-r, r], M("\\pm " + r) + ".")], traps: [TS([r], "Et " + M(-r) + " ? Son carré vaut aussi " + r * r + "."), TN(M("x^2 = " + r * r) + " est positif : il y a deux solutions.")] }); }
        const K = pk([1, 4, 9, 16, 25, 36, 2, 5, 7]), rhs = c - K;
        return Qs("Résous : " + M("x^2 + " + c + " = " + rhs) + "." + ASK, [], M("x^2 = " + (rhs - c)) + " : un carré n'est jamais négatif. Aucune solution, " + M("S = \\varnothing") + ".",
          { ctx: "direct-plus", guide: [GS(M("x^2 = \\ ?"), rhs - c, M(rhs + " - " + c + " = " + (rhs - c)) + "."), GSet("Un carré peut-il valoir " + (rhs - c) + " ? Solutions ?", [], "Aucune : un carré est toujours positif ou nul.")],
            traps: [TS([-Math.sqrt(K), Math.sqrt(K)], "Vérifie : " + M("(" + rt(K) + ")^2 = " + K) + ", pas " + M(-K) + ". Un carré n'est jamais négatif.")] }); },
      () => { const k = nz(-12, 12), v = pk(["x", "y", "t"]);
        return Qs("Résous : " + M(v + "^2 = " + k + v) + "." + ASK, [0, k], "On ramène tout à gauche : " + M(v + "^2 " + (k < 0 ? "+ " + -k : "- " + k) + v + " = 0") + ", soit " + M(v + "(" + xm(k, v) + ") = 0") + " : " + M(v + " = 0") + " ou " + M(v + " = " + k) + ".",
          { ctx: "evidence", guide: [GS("Ramène à 0 et mets " + M(v) + " en évidence : " + M(v + "(" + v + " - \\ ?) = 0") + ". Le nombre ?", k, M(v + "(" + xm(k, v) + ") = 0") + "."), GSet("Un produit est nul si l'un des facteurs est nul. Solutions ?", [0, k], M(v + " = 0") + " ou " + M(v + " = " + k) + ".")],
            traps: [TS([k], "Tu as divisé par " + M(v) + " : tu as perdu la solution " + M(v + " = 0") + ". On ne divise jamais par l'inconnue.")] }); },
    ],
    2: [
      () => { const g = R.int(2, 7), p = R.int(1, 5), q = pk([1, 2, 3, 4, 5, 6].filter((v) => G(v, p) === 1 && v !== p)), s = pk([1, -1]), v = pk(["x", "t", "z"]);
        return Qs("Résous : " + M(g * q + v + "^2 " + (s > 0 ? "+ " : "- ") + g * p + v + " = 0") + " (valeurs exactes)." + ASK, [0, (-s * p) / q], M(g + v + "(" + q + v + (s > 0 ? " + " : " - ") + p + ") = 0") + " : " + M(v + " = 0") + " ou " + M(v + " = " + tn((-s * p) / q)) + ".",
          { ctx: "evidence-frac", guide: [GS("Plus grand facteur numérique commun ?", g, M(g) + " (avec " + M(v) + ") : " + M(g + v + "(" + q + v + (s > 0 ? " + " : " - ") + p + ")") + "."), GSet("Solutions ?", [0, (-s * p) / q], M(v + " = 0") + " ou " + M(q + v + (s > 0 ? " + " : " - ") + p + " = 0 \\iff " + v + " = " + tn((-s * p) / q)) + ".")],
            traps: [TS([(-s * p) / q], "Et le facteur " + M(g + v) + " ? Il s'annule pour " + M(v + " = 0") + "."), TS([0, (s * p) / q], "Attention au signe : " + M(q + v + (s > 0 ? " + " : " - ") + p + " = 0") + " donne " + M(v + " = " + tn((-s * p) / q)) + ".")] }); },
      () => { const a = nz(-7, 7), b = R.int(1, 9);
        return Qs("Résous : " + M("(" + L(1, a) + ")^2 = " + b * b) + "." + ASK, [-a - b, -a + b], M(L(1, a) + " = " + b) + " ou " + M(L(1, a) + " = -" + b) + ", donc " + M("x = " + (b - a)) + " ou " + M("x = " + (-b - a)) + ".",
          { ctx: "carre-egal", guide: [GS(M(L(1, a) + " = \\pm \\ ?") + " (le nombre positif)", b, M("\\sqrt{" + b * b + "} = " + b) + "."), GSet("Résous " + M(L(1, a) + " = " + b) + " et " + M(L(1, a) + " = -" + b) + " :", [-a - b, -a + b], M("x = " + (b - a)) + " ou " + M("x = " + (-b - a)) + ".")],
            traps: [TS([b - a], "Il y a deux cas : " + M(L(1, a) + " = " + b) + " <b>ou</b> " + M(L(1, a) + " = -" + b) + "."), TS([b * b - a], "On prend la racine carrée : " + M(L(1, a) + " = \\pm " + b) + ".")] }); },
      () => { let p, q; do { p = nz(-9, 9); q = nz(-9, 9); } while (p === q || p === -q);
        return Qs("Résous : " + M(T2(1, -(p + q), p * q) + " = 0") + "." + ASK, [p, q], "Deux nombres de somme " + M(-(p + q)) + " et de produit " + M(p * q) + " : " + M(-p) + " et " + M(-q) + ". " + M("(" + xm(p) + ")(" + xm(q) + ") = 0") + ", donc " + SS([p, q]) + ".",
          { ctx: "trinome", guide: [GS("Factorise " + M("(x + a)(x + b)") + " : deux nombres de produit " + M(p * q) + " et de somme " + M(-(p + q)) + ". Donne le plus petit.", Math.min(-p, -q), M(-p) + " et " + M(-q) + "."), GSet("Solutions de " + M("(" + xm(p) + ")(" + xm(q) + ") = 0") + " ?", [p, q], SS([p, q]) + " : les solutions sont les <b>opposés</b> des nombres trouvés.")],
            traps: [TS([-p, -q], "Ce sont les nombres de la factorisation : " + M("x " + (p < 0 ? "+ " + -p : "- " + p) + " = 0") + " donne " + M("x = " + p) + ". Les solutions sont leurs opposés.")] }); },
      () => { const a = nz(-9, 9);
        return Qs("Résous : " + M(T2(1, -2 * a, a * a) + " = 0") + "." + ASK, [a], M("(" + xm(a) + ")^2 = 0") + " : une seule solution, " + M("x = " + a) + ".",
          { ctx: "carre-parfait", guide: [GS("C'est un carré parfait " + M("(x - a)^2") + " : " + M("a = \\ ?"), a, M("(" + xm(a) + ")^2 = " + T2(1, -2 * a, a * a)) + "."), GSet("Solutions ?", [a], M("x = " + a) + " (solution double).")],
            traps: [TS([-a, a], M("(" + xm(a) + ")^2 = 0") + " seulement si " + M(xm(a) + " = 0") + " : une seule solution."), TS([-a], "Attention au signe : " + M(xm(a) + " = 0 \\iff x = " + a) + ".")] }); },
      () => { let p, q; do { p = R.int(2, 9); q = -R.int(2, 9); } while (p === -q); const b = -(p + q), c = -p * q;
        return Qs("Résous : " + M("x^2" + sgn(b) + "x = " + c) + "." + ASK, [p, q], "On ramène à 0 : " + M(T2(1, b, -c) + " = 0") + ", soit " + M("(" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + SS([p, q]) + ".",
          { ctx: "ramener-zero", guide: [GS("Ramène à 0 : " + M("x^2" + sgn(b) + "x - \\ ? = 0") + ". Le nombre ?", c, M(T2(1, b, -c) + " = 0") + "."), GS("Deux nombres de produit " + M(-c) + " et de somme " + M(b) + " : le plus petit ?", Math.min(-p, -q), M(-p) + " et " + M(-q) + "."), GSet("Solutions ?", [p, q], SS([p, q]) + ".")],
            traps: [TS([c, c - b], "Le produit nul ne marche qu'avec 0 de l'autre côté : " + M("x(x" + sgn(b) + ") = " + c) + " ne dit pas que " + M("x = " + c) + ".")] }); },
    ],
    3: [
      () => { const a = nz(-7, 7), b = nz(-6, 6), c = nz(-6, 6); if (b + c === -a || b + c === 0) return E2F[3][0]();
        return Qs("Résous : " + M("(" + L(1, a) + ")(" + L(2, -b) + ") - (" + L(1, a) + ")(" + L(1, c) + ") = 0") + "." + ASK, [-a, b + c], "Facteur commun " + M("(" + L(1, a) + ")") + " : " + M("(" + L(1, a) + ")[(" + L(2, -b) + ") - (" + L(1, c) + ")] = (" + L(1, a) + ")(" + L(1, -b - c) + ") = 0") + " : " + SS([-a, b + c]) + ".",
          { ctx: "facteur-commun", guide: [GS("Mets " + M("(" + L(1, a) + ")") + " en évidence. Il reste " + M("(" + L(2, -b) + ") - (" + L(1, c) + ") = x - \\ ?"), b + c, M(L(1, -b - c)) + "."), GSet("Solutions ?", [-a, b + c], SS([-a, b + c]) + ".")],
            traps: [TS([b + c], "Tu as divisé par " + M("(" + L(1, a) + ")") + " : tu as perdu la solution " + M("x = " + -a) + "."), TS([-a, b - c], "Attention : " + M("-(" + L(1, c) + ") = " + L(-1, -c)) + ".")] }); },
      () => { const [a, c] = pk([[3, 1], [2, 1], [3, 2], [4, 1], [5, 3]]); let r1, r2, b, d, ok = false;
        for (let t = 0; t < 60 && !ok; t++) { r1 = nz(-6, 6); r2 = nz(-6, 6); const A = (a - c) * r1, B = -(a + c) * r2; if ((A + B) % 2) continue; d = (A + B) / 2; b = (B - A) / 2; ok = r1 !== r2 && b !== 0 && d !== 0 && b !== d; }
        if (!ok) return E2F[3][1]();
        const x1 = (d - b) / (a - c), x2 = -(d + b) / (a + c);
        return Qs("Résous : " + M("(" + L(a, b) + ")^2 = (" + L(c, d) + ")^2") + "." + ASK, [x1, x2], M("A^2 = B^2 \\iff A = B") + " ou " + M("A = -B") + " : " + M(L(a, b) + " = " + L(c, d)) + " donne " + M("x = " + tn(x1)) + " ; " + M(L(a, b) + " = " + L(-c, -d)) + " donne " + M("x = " + tn(x2)) + ".",
          { ctx: "carres-egaux", guide: [GS("Premier cas, " + M(L(a, b) + " = " + L(c, d)) + " : " + M("x = \\ ?"), x1, M("x = " + tn(x1)) + "."), GSet("Deuxième cas, " + M(L(a, b) + " = -(" + L(c, d) + ")") + ". Toutes les solutions ?", [x1, x2], SS([x1, x2]) + ".")],
            traps: [TS([x1], "Deux carrés égaux : " + M("A = B") + " <b>ou</b> " + M("A = -B") + ". Il manque un cas.")] }); },
      () => { const k = pk([2, 3, 5]); let p, q; do { p = nz(-8, 8); q = nz(-8, 8); } while (p === q || p === -q);
        return Qs("Résous : " + M(T2(k, -k * (p + q), k * p * q) + " = 0") + "." + ASK, [p, q], M(k + "(" + T2(1, -(p + q), p * q) + ") = " + k + "(" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + SS([p, q]) + " (le facteur " + k + " ne s'annule jamais).",
          { ctx: "facteur-num", guide: [GS("Mets le facteur numérique en évidence :", k, M(k + "(" + T2(1, -(p + q), p * q) + ")") + "."), GS("Deux nombres de produit " + M(p * q) + " et de somme " + M(-(p + q)) + " : le plus petit ?", Math.min(-p, -q), M(-p) + " et " + M(-q) + "."), GSet("Solutions ?", [p, q], SS([p, q]) + ".")],
            traps: [TS([-p, -q], "Les solutions sont les opposés des nombres de la factorisation."), TS([0, p, q], "Le facteur " + k + " ne vaut jamais 0 : il ne donne pas de solution.")] }); },
      () => { let p, q; do { p = R.int(2, 9); q = R.int(1, 8); } while (p === q); const a = p - q, c = p * q, w = pk(WHO);
        return Qs(w + " résout " + M("x(x - " + a + ") = " + c) + " : « " + M("x = " + c) + " ou " + M("x - " + a + " = " + c) + ", donc " + M("x = " + c) + " ou " + M("x = " + (c + a)) + " ». Trouve l'erreur et résous correctement." + ASK, [p, -q],
          "Le produit nul ne marche qu'avec 0 : on ramène à " + M(T2(1, -a, -c) + " = 0") + ", soit " + M("(" + xm(p) + ")(" + xm(-q) + ") = 0") + " : " + SS([p, -q]) + ".",
          { ctx: "erreur", guide: [GS("Ramène à 0 : " + M("x^2 - " + a + "x - \\ ? = 0") + ". Le nombre ?", c, M(T2(1, -a, -c) + " = 0") + "."), GSet("Factorise et résous :", [p, -q], M("(" + xm(p) + ")(" + xm(-q) + ") = 0") + ", " + SS([p, -q]) + ".")],
            traps: [TS([c, c + a], "C'est l'erreur de " + w + " : un produit égal à " + c + " ne dit rien sur chaque facteur. Seul 0 le permet.")] }); },
    ],
  };

  // ===================== eq2 : équations produit nul =====================
  const EPN = {
    1: [
      () => { let a, b; do { a = nz(-9, 9); b = nz(-9, 9); } while (a === -b);
        return Qs("Résous : " + M("(" + xm(a) + ")(" + L(1, b) + ") = 0") + "." + ASK, [a, -b], "Un produit est nul si l'un de ses facteurs est nul : " + M(xm(a) + " = 0") + " ou " + M(L(1, b) + " = 0") + ", donc " + SS([a, -b]) + ".",
          { ctx: "deux-facteurs", guide: [GS("Premier facteur nul : " + M(xm(a) + " = 0 \\iff x = \\ ?"), a, M("x = " + a) + "."), GSet("Toutes les solutions ?", [a, -b], SS([a, -b]) + ".")],
            traps: [TS([-a, b], "Attention aux signes : " + M(xm(a) + " = 0") + " donne " + M("x = " + a) + "."), TS([a], "Chaque facteur donne une solution : " + M(L(1, b) + " = 0") + " aussi.")] }); },
      () => { const a = R.int(2, 7), b = pk([1, 2, 3, 4, 5, 6, 7].filter((v) => G(v, a) === 1)), c = nz(-8, 8), s = pk([1, -1]);
        return Qs("Résous : " + M("(" + L(a, -s * b) + ")(" + L(1, c) + ") = 0") + " (valeurs exactes)." + ASK, [(s * b) / a, -c], M(L(a, -s * b) + " = 0 \\iff x = " + tn((s * b) / a)) + " ; " + M(L(1, c) + " = 0 \\iff x = " + -c) + ".",
          { ctx: "facteur-frac", guide: [GS(M(L(a, -s * b) + " = 0 \\iff x = \\ ?"), (s * b) / a, M(a + "x = " + s * b) + ", " + M("x = " + tn((s * b) / a)) + "."), GSet("Toutes les solutions ?", [(s * b) / a, -c], SS([(s * b) / a, -c]) + ".")],
            traps: [TS([a / (s * b), -c], "Tu as inversé : " + M(a + "x = " + s * b) + " donne " + M("x = " + tn((s * b) / a)) + "."), TS([s * b - a, -c], "On divise par " + a + " : " + M(a + "x = " + s * b) + ".")] }); },
      () => { const a = nz(-9, 9), v = pk(["x", "t", "y"]);
        return Qs("Résous : " + M(v + "(" + L(1, a, v) + ") = 0") + "." + ASK, [0, -a], M(v + " = 0") + " ou " + M(L(1, a, v) + " = 0") + " : " + SS([0, -a]) + ".",
          { ctx: "x-facteur", guide: [GS("Le facteur " + M(v) + " est nul pour " + M(v + " = \\ ?"), 0, M(v + " = 0") + " est une solution."), GSet("Toutes les solutions ?", [0, -a], SS([0, -a]) + ".")],
            traps: [TS([-a], "Le facteur " + M(v) + " peut aussi valoir 0 : " + M(v + " = 0") + " est une solution."), TS([0, a], "Attention au signe : " + M(L(1, a, v) + " = 0 \\iff " + v + " = " + -a) + ".")] }); },
      () => { const a = R.int(2, 9), b = nz(-9, 9); if (b === -a) return EPN[1][3]();
        return Qs("Résous : " + M("(" + a + " - x)(" + L(1, b) + ") = 0") + "." + ASK, [a, -b], M(a + " - x = 0 \\iff x = " + a) + " ; " + M(L(1, b) + " = 0 \\iff x = " + -b) + ".",
          { ctx: "a-moins-x", guide: [GS(M(a + " - x = 0 \\iff x = \\ ?"), a, M("x = " + a) + "."), GSet("Toutes les solutions ?", [a, -b], SS([a, -b]) + ".")],
            traps: [TS([-a, -b], M(a + " - x = 0") + " donne " + M("x = " + a) + " (on ajoute " + M("x") + " des deux côtés).")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), b = R.int(2, 5), c = pk([1, 3, 5, 7].filter((v) => G(v, b) === 1)), d = nz(-6, 6); if (a === -d) return EPN[2][0]();
        return Qs("Résous : " + M("(" + xm(a) + ")(" + L(b, c) + ")(" + L(1, d) + ") = 0") + " (valeurs exactes)." + ASK, [a, -c / b, -d], "Trois facteurs, trois solutions : " + SS([a, -c / b, -d]) + ".",
          { ctx: "trois-facteurs", guide: [GS(M(L(b, c) + " = 0 \\iff x = \\ ?"), -c / b, M("x = " + tn(-c / b)) + "."), GSet("Toutes les solutions ?", [a, -c / b, -d], SS([a, -c / b, -d]) + ".")],
            traps: [TS([a, -d], "Il y a trois facteurs : " + M(L(b, c) + " = 0") + " donne aussi une solution.")] }); },
      () => { const k = R.int(2, 9), b = nz(-9, 9);
        return Qs("Résous : " + M(k + "(" + xm(b) + ")^2 = 0") + "." + ASK, [b], M(k) + " ne vaut jamais 0 ; " + M("(" + xm(b) + ")^2 = 0 \\iff x = " + b) + " : une seule solution.",
          { ctx: "carre-nul", guide: [GSet("Quels facteurs peuvent s'annuler ? Solutions ?", [b], M(xm(b) + " = 0") + " : " + M("x = " + b) + ". Le facteur " + k + " ne s'annule jamais.")],
            traps: [TS([-b, b], "Un carré est nul seulement si le nombre est nul : " + M(xm(b) + " = 0") + ", une seule solution."), TS([0, b], "Le facteur " + k + " n'est jamais nul : il ne donne pas " + M("x = 0") + "."), TS([-b], "Attention au signe : " + M(xm(b) + " = 0 \\iff x = " + b) + ".")] }); },
      () => { const k = pk([1, 4, 9, 16, 25]), a = nz(-9, 9);
        return Qs("Résous : " + M("(x^2 + " + k + ")(" + xm(a) + ") = 0") + "." + ASK, [a], M("x^2 + " + k) + " est toujours positif (au moins " + k + ") : il ne s'annule jamais. Seule solution : " + M("x = " + a) + ".",
          { ctx: "facteur-positif", guide: [GS("Combien de solutions a " + M("x^2 + " + k + " = 0") + " ?", 0, "Aucune : " + M("x^2 = -" + k) + " est impossible."), GSet("Solutions de l'équation ?", [a], M("x = " + a) + ".")],
            traps: [TS([a, -Math.sqrt(k), Math.sqrt(k)], M("x^2 + " + k + " = 0") + " donne " + M("x^2 = -" + k) + ", impossible ; ce n'est pas " + M("x^2 - " + k) + "."), TS([-a], "Attention au signe : " + M(xm(a) + " = 0 \\iff x = " + a) + ".")] }); },
      () => { const k = R.int(2, 8), a = nz(-9, 9); if (Math.abs(a) === k) return EPN[2][3]();
        return Qs("Résous : " + M("(x^2 - " + k * k + ")(" + L(1, a) + ") = 0") + "." + ASK, [-k, k, -a], M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + " : trois solutions, " + SS([-k, k, -a]) + ".",
          { ctx: "difference-carres", guide: [GS(M("x^2 - " + k * k + " = 0") + " : la solution positive ?", k, M("x = \\pm " + k) + "."), GSet("Toutes les solutions ?", [-k, k, -a], SS([-k, k, -a]) + ".")],
            traps: [TS([k, -a], M("x^2 = " + k * k) + " a deux solutions : " + M(k) + " et " + M(-k) + ".")] }); },
    ],
    3: [
      () => { let a, b, r1, r2, c; for (let t = 0; t < 80; t++) { a = nz(-6, 6); b = nz(-6, 6); r1 = nz(-8, 8); r2 = a - b - r1; c = -a * b - r1 * r2; if (c !== 0 && r1 !== r2 && r2 !== 0 && ![a, -b].includes(r1) && ![a, -b].includes(r2)) break; c = 0; }
        if (!c) return EPN[3][1]();
        return Qs("Résous : " + M("(" + xm(a) + ")(" + L(1, b) + ") = " + c) + "." + ASK, [r1, r2], "Le produit vaut " + c + ", pas 0 : on développe et on ramène à 0. " + M(T2(1, b - a, -a * b - c) + " = 0") + ", soit " + M("(" + xm(r1) + ")(" + xm(r2) + ") = 0") + " : " + SS([r1, r2]) + ".",
          { ctx: "pas-zero", guide: [GS("Développe et ramène à 0 : " + M("x^2" + sgn(b - a) + "x + c = 0") + ". Que vaut " + M("c") + " ?", -a * b - c, M(-a * b + " - " + P(c) + " = " + (-a * b - c)) + "."), GSet("Factorise et résous :", [r1, r2], M("(" + xm(r1) + ")(" + xm(r2) + ") = 0") + " : " + SS([r1, r2]) + ".")],
            traps: [TS([a + c, c - b], "Le produit nul ne marche qu'avec 0 à droite. Ici, il faut développer et ramener à 0."), TS([a, -b], "Ce sont les solutions de " + M("(" + xm(a) + ")(" + L(1, b) + ") = 0") + ", mais le produit vaut " + c + ".")] }); },
      () => { const a = nz(-7, 7), b = nz(-6, 6), c = nz(-6, 6); if (b + c === a || b + c === 0) return EPN[3][1]();
        return Qs("Résous : " + M("(" + xm(a) + ")(" + L(1, b) + ") = (" + xm(a) + ")(" + L(2, -c) + ")") + "." + ASK, [a, b + c], "On ramène tout à gauche et on met " + M("(" + xm(a) + ")") + " en évidence : " + M("(" + xm(a) + ")(" + L(1, b) + " - " + L(2, -c) + ") = (" + xm(a) + ")(" + L(-1, b + c) + ") = 0") + " : " + SS([a, b + c]) + ".",
          { ctx: "simplifier-interdit", guide: [GS("Ramène à 0 et mets " + M("(" + xm(a) + ")") + " en évidence : il reste " + M("(" + L(1, b) + ") - (" + L(2, -c) + ") = -x + \\ ?"), b + c, M(L(-1, b + c)) + "."), GSet("Solutions ?", [a, b + c], SS([a, b + c]) + ".")],
            traps: [TS([b + c], "Tu as simplifié par " + M("(" + xm(a) + ")") + " : interdit, car il peut valoir 0. Tu as perdu " + M("x = " + a) + ".")] }); },
      () => { let r1, r2; do { r1 = nz(-8, 8); r2 = nz(-8, 8); } while (r1 === r2 || r1 === -r2);
        return Qv("L'équation " + M("x^2 + bx + c = 0") + " a pour solutions " + M(r1) + " et " + M(r2) + ". Que vaut " + M("c") + " ?", r1 * r2, "Elle s'écrit " + M("(" + xm(r1) + ")(" + xm(r2) + ") = 0") + ", soit " + M(T2(1, -(r1 + r2), r1 * r2) + " = 0") + " : " + M("c = " + r1 * r2) + ".",
          { ctx: "construire", guide: [GS("Elle s'écrit " + M("(" + xm(r1) + ")(" + xm(r2) + ") = 0") + ". Développe : coefficient " + M("b") + " ?", -(r1 + r2), M("b = " + -(r1 + r2)) + "."), GS("Terme constant " + M("c") + " ?", r1 * r2, M(P(-r1) + " \\cdot " + P(-r2) + " = " + r1 * r2) + ".")],
            traps: [TV(-r1 * r2, M("(" + xm(r1) + ")(" + xm(r2) + ")") + " : le terme constant est " + M(P(-r1) + " \\cdot " + P(-r2) + " = " + r1 * r2) + "."), TV(r1 + r2, "C'est en lien avec la somme des solutions ; " + M("c") + " est leur produit.")] }); },
    ],
  };

  // ===================== eq2disc : formule et discriminant =====================
  const DIS = {
    1: [
      () => { const a = pk([1, 2, 3, -1, -2]), b = nz(-9, 9), c = nz(-9, 9), D = b * b - 4 * a * c;
        return Qv("Calcule le discriminant de " + M(T2(a, b, c) + " = 0") + ".", D, M("\\Delta = b^2 - 4ac = " + P(b) + "^2 - 4 \\cdot " + P(a) + " \\cdot " + P(c) + " = " + b * b + sgn(-4 * a * c) + " = " + D) + ".",
          { ctx: "delta", guide: [GS(M("b^2 = " + P(b) + "^2 = \\ ?"), b * b, M(b * b) + " (un carré est positif)."), GS(M("4ac = 4 \\cdot " + P(a) + " \\cdot " + P(c) + " = \\ ?"), 4 * a * c, M(4 * a * c) + "."), GS(M("\\Delta = " + b * b + " - " + P(4 * a * c) + " = \\ ?"), D, M("\\Delta = " + D) + ".")],
            traps: [TV(b * b + 4 * a * c, "La formule est " + M("b^2 - 4ac") + " : on soustrait " + M("4ac") + "."), TV(-b * b - 4 * a * c, M(P(b) + "^2 = " + b * b) + " est positif."), TV(b * b - a * c, "N'oublie pas le facteur 4 : " + M("4ac") + ".")] }); },
      () => { let p, q; do { p = nz(-9, 9); q = nz(-9, 9); } while (p === q || p === -q); const b = -(p + q), c = p * q, D = b * b - 4 * c, r = Math.abs(p - q);
        return Qs("Résous avec la formule : " + M(T2(1, b, c) + " = 0") + "." + ASK, [p, q], M("\\Delta = " + D + " = " + r + "^2") + ", " + M("x = \\frac{" + -b + " \\pm " + r + "}{2}") + " : " + SS([p, q]) + ".",
          { ctx: "formule-entiers", guide: [GS(M("\\Delta = b^2 - 4ac = \\ ?"), D, M(P(b) + "^2 - 4 \\cdot " + P(c) + " = " + D) + "."), GS(M("\\sqrt{\\Delta} = \\ ?"), r, M(r) + "."), GSet(M("x = \\frac{" + -b + " \\pm " + r + "}{2}") + " : solutions ?", [p, q], SS([p, q]) + ".")],
            traps: [TS([-p, -q], "Dans la formule, c'est " + M("-b = " + -b) + " : attention au signe."), TS([(-b + r), (-b - r)], "N'oublie pas de diviser par " + M("2a = 2") + ".")] }); },
      () => { const a = pk([1, 2, 3]), b = nz(-6, 6), c = Math.floor((b * b) / (4 * a)) + R.int(1, 6), D = b * b - 4 * a * c;
        return Qs("Résous : " + M(T2(a, b, c) + " = 0") + "." + ASK, [], M("\\Delta = " + b * b + " - " + 4 * a * c + " = " + D + " < 0") + " : aucune solution réelle (la racine d'un nombre négatif n'existe pas).",
          { ctx: "delta-negatif", guide: [GS(M("\\Delta = \\ ?"), D, M(b * b + " - " + 4 * a * c + " = " + D) + "."), GSet(M("\\Delta < 0") + " : solutions ?", [], "Aucune : " + M("\\sqrt{" + D + "}") + " n'existe pas.")],
            traps: [TS([(-b + Math.sqrt(-D)) / (2 * a), (-b - Math.sqrt(-D)) / (2 * a)], "Tu as pris " + M("\\sqrt{" + -D + "}") + " au lieu de " + M("\\sqrt{" + D + "}") + " : la racine d'un nombre négatif n'existe pas.")] }); },
    ],
    2: [
      () => { let m, n, r; do { m = R.int(2, 5); n = nz(-7, 7); r = nz(-6, 6); } while (G(m, n) !== 1 || n / m === r); const a = m, b = -(m * r + n), c = n * r, D = b * b - 4 * a * c, s = Math.sqrt(D);
        return Qs("Résous : " + M(T2(a, b, c) + " = 0") + " (valeurs exactes)." + ASK, [n / m, r], M("\\Delta = " + D) + ", " + M("\\sqrt{\\Delta} = " + s) + ", " + M("x = \\frac{" + -b + " \\pm " + s + "}{" + 2 * a + "}") + " : " + SS([n / m, r]) + ".",
          { ctx: "formule-a", guide: [GS(M("\\Delta = \\ ?"), D, M(P(b) + "^2 - 4 \\cdot " + a + " \\cdot " + P(c) + " = " + D) + "."), GS(M("\\sqrt{\\Delta} = \\ ?"), s, M(s) + "."), GSet(M("x = \\frac{" + -b + " \\pm " + s + "}{" + 2 * a + "}") + " : solutions ?", [n / m, r], SS([n / m, r]) + ".")],
            traps: [TS([(-b + s) / 2, (-b - s) / 2], "On divise par " + M("2a = " + 2 * a) + ", pas par 2."), TS([-n / m, -r], "Le numérateur commence par " + M("-b = " + -b) + ".")] }); },
      () => { const p = R.int(1, 5), q = pk([1, 2, 3, 4, 5, 7].filter((v) => G(v, p) === 1)), s = pk([1, -1]), a = p * p, b = -2 * p * q * s, c = q * q;
        return Qs("Résous : " + M(T2(a, b, c) + " = 0") + "." + ASK, [(s * q) / p], M("\\Delta = " + b * b + " - " + 4 * a * c + " = 0") + " : une seule solution, " + M("x = \\frac{" + -b + "}{" + 2 * a + "} = " + tn((s * q) / p)) + ".",
          { ctx: "delta-nul", guide: [GS(M("\\Delta = \\ ?"), 0, M(b * b + " - " + 4 * a * c + " = 0") + "."), GSet(M("\\Delta = 0") + " : " + M("x = \\frac{-b}{2a}") + ". Solution ?", [(s * q) / p], M("x = " + tn((s * q) / p)) + ".")],
            traps: [TS([(-s * q) / p, (s * q) / p], M("\\Delta = 0") + " : une seule solution, " + M("\\frac{-b}{2a}") + "."), TS([(-s * q) / p], "Attention au signe : " + M("-b = " + -b) + ".")] }); },
      () => { let m, n, r; do { m = R.int(2, 4); n = nz(-7, 7); r = nz(-5, 5); } while (G(m, n) !== 1 || n / m === r); const B = m * r + n, C = n * r;
        return Qs("Résous : " + M(m + "x^2" + sgn(C) + " = " + L(B, 0)) + " (valeurs exactes)." + ASK, [n / m, r], "On ramène à 0 : " + M(T2(m, -B, C) + " = 0") + " ; " + M("\\Delta = " + (B * B - 4 * m * C)) + " : " + SS([n / m, r]) + ".",
          { ctx: "ramener", guide: [GS("Ramène à " + M("ax^2 + bx + c = 0") + " : " + M("b = \\ ?"), -B, M("b = " + -B) + " (on soustrait " + M(L(B, 0)) + ")."), GS(M("\\Delta = \\ ?"), B * B - 4 * m * C, M(B * B + sgn(-4 * m * C) + " = " + (B * B - 4 * m * C)) + "."), GSet("Solutions ?", [n / m, r], SS([n / m, r]) + ".")],
            traps: [TS([-n / m, -r], "En ramenant à 0, " + M(L(B, 0)) + " change de signe : " + M("b = " + -B) + ".")] }); },
    ],
    3: [
      () => { const p = nz(-6, 6), m = pk([2, 3, 5, 6, 7, 8, 12]), b = -2 * p, c = p * p - m, D = 4 * m, [k, rr] = sq(m);
        return Qs("Résous : " + M(T2(1, b, c) + " = 0") + " (valeurs exactes, avec √)." + ASK, [p - Math.sqrt(m), p + Math.sqrt(m)], M("\\Delta = " + D) + ", " + M("\\sqrt{\\Delta} = " + rt(D)) + ", " + M("x = \\frac{" + -b + " \\pm " + rt(D) + "}{2} = " + (p ? p + " \\pm " : "\\pm ") + rt(m)) + ".",
          { ctx: "racines", guide: [GS(M("\\Delta = \\ ?"), D, M(b * b + sgn(-4 * c) + " = " + D) + "."), GSR(M("\\sqrt{\\Delta} = \\ ?") + " (forme simplifiée)", Math.sqrt(D), M("\\sqrt{" + D + "} = " + rt(D)) + "."), GSet("Solutions ?", [p - Math.sqrt(m), p + Math.sqrt(m)], M("x = " + (p ? p + " \\pm " : "\\pm ") + rt(m)) + ".")],
            traps: [TS([p - m, p + m], "Il manque la racine carrée : " + M("\\pm " + rt(m)) + ".")] }); },
      () => { const b = 2 * nz(-7, 7), v = pk(["c", "k", "m"]);
        return Qv("Pour quelle valeur de " + M(v) + " l'équation " + M("x^2" + sgn(b) + "x + " + v + " = 0") + " a-t-elle une seule solution ?", (b * b) / 4, "Une seule solution quand " + M("\\Delta = 0") + " : " + M(b * b + " - 4" + v + " = 0") + ", donc " + M(v + " = " + (b * b) / 4) + ". Alors " + M("x^2" + sgn(b) + "x + " + (b * b) / 4 + " = (x" + sgn(b / 2) + ")^2") + ".",
          { ctx: "parametre", guide: [GS("Une seule solution " + M("\\iff \\Delta = 0") + ". Que vaut " + M("b^2") + " ?", b * b, M(P(b) + "^2 = " + b * b) + "."), GS(M(b * b + " - 4" + v + " = 0 \\iff " + v + " = \\ ?"), (b * b) / 4, M(v + " = " + (b * b) / 4) + ".")],
            traps: [TV((b * b) / 2, M("\\Delta = b^2 - 4" + v) + " : on divise par 4."), TV(Math.abs(b) / 2, "Écris " + M("\\Delta = 0") + " : " + M(b * b + " - 4" + v + " = 0") + ".")] }); },
      () => { let a, b, c, D; for (let t = 0; t < 80; t++) { a = pk([2, 3]); b = nz(-6, 6); c = nz(-5, 5); D = b * b - 4 * a * c; if (D > 0 && sq(D)[1] !== 1) break; D = 0; }
        if (!D) return DIS[3][0]();
        const x1 = (-b - Math.sqrt(D)) / (2 * a), x2 = (-b + Math.sqrt(D)) / (2 * a);
        return Qs("Résous : " + M(T2(a, b, c) + " = 0") + " (valeurs exactes, avec √)." + ASK, [x1, x2], M("\\Delta = " + D) + " : " + M("x = \\frac{" + -b + " \\pm " + rt(D) + "}{" + 2 * a + "}") + ".",
          { ctx: "racines-a", guide: [GS(M("\\Delta = \\ ?"), D, M(b * b + sgn(-4 * a * c) + " = " + D) + "."), GSet(M("x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}") + " : solutions ?", [x1, x2], M("x = \\frac{" + -b + " \\pm " + rt(D) + "}{" + 2 * a + "}") + ".")],
            traps: [TS([(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2], "On divise par " + M("2a = " + 2 * a) + "."), TS([(b - Math.sqrt(D)) / (2 * a), (b + Math.sqrt(D)) / (2 * a)], "Le numérateur commence par " + M("-b = " + -b) + ".")] }); },
      () => { let r1, r2; do { r1 = nz(-9, 9); r2 = nz(-9, 9); } while (r1 === r2 || r1 === -r2); const S = r1 + r2, Pp = r1 * r2;
        return Qv("L'équation " + M(T2(1, -S, Pp) + " = 0") + " a la solution " + M("x = " + r1) + ". Trouve l'autre sans calculer " + M("\\Delta") + ".", r2, "La somme des solutions vaut " + M("-\\frac{b}{a} = " + S) + " : l'autre est " + M(S + " - " + P(r1) + " = " + r2) + " (et le produit " + M(P(r1) + " \\cdot " + P(r2) + " = " + Pp) + " vaut bien " + M("\\frac{c}{a}") + ").",
          { ctx: "viete", guide: [GS("Somme des solutions " + M("-\\frac{b}{a} = \\ ?"), S, M(S) + "."), GS("L'autre solution ?", r2, M(S + " - " + P(r1) + " = " + r2) + ".")],
            traps: [TV(-S - r1, "La somme vaut " + M("-\\frac{b}{a} = " + S) + ", attention au signe de " + M("b") + "."), TV(S + r1, "On soustrait la solution connue de la somme.")] }); },
    ],
  };

  // ===================== probeq2 : problèmes du 2e degré =====================
  const JARDINS = []; for (let Lg = 10; Lg <= 40; Lg++) for (let l = 6; l < Lg; l++) for (let x = 1; x < l; x++) if (2 * (Lg - x) * (l - x) === Lg * l && x <= l / 2) JARDINS.push([Lg, l, x]);
  const VELOS = []; for (let v = 10; v <= 30; v++) for (const k of [2, 3, 4, 5, 6]) for (let D = 10; D <= 120; D += 2) { const t = D / v - D / (v + k); if (Math.abs(t * 4 - Math.round(t * 4)) < 1e-9 && t > 0 && Number.isInteger(D / v * 4)) VELOS.push([v, k, D, Math.round(t * 4) / 4]); }
  const PRQ2 = {
    1: [
      () => { const n = R.int(5, 20), Pr = n * (n + 1);
        return Qv("Le produit de deux nombres entiers positifs consécutifs vaut " + M(Pr) + ". Quel est le plus petit ?", n, M("n(n + 1) = " + Pr) + ", soit " + M("n^2 + n - " + Pr + " = 0") + " ; " + M("\\Delta = " + (1 + 4 * Pr) + " = " + (2 * n + 1) + "^2") + ", " + M("n = " + n) + " ou " + M("n = " + -(n + 1)) + " (refusé : négatif).",
          { ctx: "consecutifs", guide: [GS("Écris " + M("n^2 + n - " + Pr + " = 0") + ". " + M("\\Delta = \\ ?"), 1 + 4 * Pr, M("1 + 4 \\cdot " + Pr + " = " + (1 + 4 * Pr)) + "."), GS(M("\\sqrt{\\Delta} = \\ ?"), 2 * n + 1, M(2 * n + 1) + "."), GS("Solution positive " + M("n = \\ ?"), n, M("\\frac{-1 + " + (2 * n + 1) + "}{2} = " + n) + " ; l'autre, " + M(-(n + 1)) + ", ne convient pas.")],
            traps: [TV(-(n + 1), "L'énoncé demande des nombres positifs : on écarte la solution négative."), TV(Pr / 2, "On cherche deux nombres consécutifs dont le <b>produit</b> vaut " + Pr + ".")] }); },
      () => { const l = R.int(3, 12), d = R.int(2, 7), A = l * (l + d), obj = pk(["un rectangle", "un potager rectangulaire", "une affiche rectangulaire"]);
        return Qv("La longueur d'" + obj.slice(3) + " dépasse sa largeur de " + d + " cm. Son aire vaut " + A + " cm². Quelle est sa largeur (en cm) ?", l, M("x(x + " + d + ") = " + A) + ", soit " + M("x^2 + " + d + "x - " + A + " = 0") + " ; " + M("\\Delta = " + (d * d + 4 * A)) + ", " + M("x = " + l) + " (l'autre solution, " + M(-(l + d)) + ", est négative).",
          { ctx: "rectangle", fig: FIG.rectFig(9, 5, "x + " + d, "x"), guide: [GS("Équation " + M("x^2 + " + d + "x - " + A + " = 0") + " : " + M("\\Delta = \\ ?"), d * d + 4 * A, M(d * d + " + " + 4 * A + " = " + (d * d + 4 * A)) + "."), GS(M("\\sqrt{\\Delta} = \\ ?"), 2 * l + d, M(2 * l + d) + "."), GS("Largeur ?", l, M("\\frac{-" + d + " + " + (2 * l + d) + "}{2} = " + l) + " cm.")],
            traps: [TV(-(l + d), "Une largeur est positive : on écarte cette solution."), TV(l + d, "C'est la longueur : on demande la largeur.")] }); },
      () => { const k = R.int(1, 5), x = R.int(3, 15), A = 2 * k * x + k * k;
        return Qv("Si l'on augmente de " + k + " cm le côté d'un carré, son aire augmente de " + A + " cm². Quel est le côté du carré (en cm) ?", x, M("(x + " + k + ")^2 - x^2 = " + A) + ", soit " + M(2 * k + "x + " + k * k + " = " + A) + " : les " + M("x^2") + " s'éliminent, " + M("x = " + x) + " cm.",
          { ctx: "carre-agrandi", guide: [GS("Développe " + M("(x + " + k + ")^2 - x^2") + " : coefficient de " + M("x") + " ?", 2 * k, M(2 * k + "x + " + k * k) + " : l'équation est du 1er degré !"), GS(M("x = \\ ?"), x, M(2 * k + "x = " + (A - k * k)) + ", " + M("x = " + x) + ".")],
            traps: [TV(Math.sqrt(A) - k, "L'augmentation n'est pas un carré : " + M("(x + " + k + ")^2 - x^2 = " + 2 * k + "x + " + k * k) + "."), TV((A - k * k) / k, "Le double produit vaut " + M(2 * k + "x") + ".")] }); },
      () => { let b, n0, c, a; do { b = R.int(2, 5); n0 = R.int(b + 2, 12); c = R.int(1, 9); a = n0 * (n0 - b) - b - c; } while (a <= 0);
        return Qv("Trouve un nombre entier positif " + M("n") + " tel que son carré diminué de " + a + " soit égal à " + b + " fois le nombre suivant, augmenté de " + c + ".", n0, M("n^2 - " + a + " = " + b + "(n + 1) + " + c) + ", soit " + M("n^2 - " + b + "n - " + (a + b + c) + " = 0") + " : " + M("n = " + n0) + " ou " + M("n = " + (b - n0)) + " (négatif, refusé).",
          { ctx: "nombres", guide: [GS("Ramène à " + M("n^2 - " + b + "n - c = 0") + " : " + M("c = \\ ?"), a + b + c, M(a + " + " + b + " + " + c + " = " + (a + b + c)) + "."), GS("Solution positive ?", n0, M("(n - " + n0 + ")(n + " + (n0 - b) + ") = 0") + " : " + M("n = " + n0) + ".")],
            traps: [TV(b - n0, "On cherche un entier <b>positif</b>."), TV(Math.sqrt(a + c), "Le nombre suivant est " + M("n + 1") + " : " + M(b + "(n + 1)") + ".")] }); },
    ],
    2: [
      () => { const w = pk([10, 12, 15, 18, 20]), h = pk([8, 10, 12, 15]), x = R.int(1, 5), A = (w + 2 * x) * (h + 2 * x), c = w * h - A;
        return Qv("Une photo de " + w + " cm sur " + h + " cm est entourée d'un cadre de largeur constante " + M("x") + ". L'ensemble (photo et cadre) a une aire de " + A + " cm². Quelle est la largeur du cadre (en cm) ?", x,
          M("(" + w + " + 2x)(" + h + " + 2x) = " + A) + ", soit " + M("4x^2 + " + 2 * (w + h) + "x " + sgn(c).trim() + " = 0") + " : " + M("x = " + x) + " cm (l'autre solution est négative).",
          { ctx: "cadre", fig: FIG.rectFig(10, 7, Math.max(w, h) + " + 2x", Math.min(w, h) + " + 2x"), guide: [GS("Dimensions extérieures : " + M("(" + w + " + 2x)") + " sur " + M("(" + h + " + 2x)") + ". Développe : coefficient de " + M("x") + " ?", 2 * (w + h), M("2 \\cdot " + w + " + 2 \\cdot " + h + " = " + 2 * (w + h)) + " (avec " + M("4x^2") + ")."), GS("Ramène à 0 : terme constant ?", c, M(w * h + " - " + A + " = " + c) + "."), GS("Largeur positive du cadre ?", x, M("x = " + x) + " cm.")],
            traps: [TV(-(w + h) / 2 - x, "Une largeur est positive : on écarte cette solution."), TV((A - w * h) / (2 * (w + h)), "N'oublie pas le terme " + M("4x^2") + " (les quatre coins).")] }); },
      () => { const [a, b, c] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [20, 21, 29], [7, 24, 25], [12, 16, 20]]), d = b - a;
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + c + " cm et l'un des côtés de l'angle droit dépasse l'autre de " + d + " cm. Combien mesure le plus petit côté (en cm) ?", a, M("x^2 + (x + " + d + ")^2 = " + c * c) + ", soit " + M("2x^2 + " + 2 * d + "x - " + (c * c - d * d) + " = 0") + ", ou " + M("x^2 + " + d + "x - " + (c * c - d * d) / 2 + " = 0") + " : " + M("x = " + a) + " cm.",
          { ctx: "pythagore", fig: FIG.rightTriangle(["x", "x + " + d, c + " cm"]), guide: [GS("Pythagore : " + M("x^2 + (x + " + d + ")^2 = " + c * c) + ". Divise par 2 après avoir ramené à 0 : terme constant ?", -(c * c - d * d) / 2, M("x^2 + " + d + "x - " + (c * c - d * d) / 2 + " = 0") + "."), GS("Solution positive ?", a, M("x = " + a) + " cm (l'autre côté : " + b + " cm).")],
            traps: [TV(b, "C'est le plus grand côté de l'angle droit."), TV(-b, "Une longueur est positive.")] }); },
      () => { let p, q; do { p = R.int(2, 15); q = R.int(2, 15); } while (p === q); const S = p + q, Pr = p * q;
        return Qv("Deux nombres positifs ont pour somme " + S + " et pour produit " + Pr + ". Quel est le plus grand ?", Math.max(p, q), M("x(" + S + " - x) = " + Pr) + ", soit " + M("x^2 - " + S + "x + " + Pr + " = 0") + " : " + M("x = " + Math.min(p, q)) + " ou " + M("x = " + Math.max(p, q)) + ". Les deux nombres sont " + Math.min(p, q) + " et " + Math.max(p, q) + ".",
          { ctx: "somme-produit", guide: [GS("Équation " + M("x^2 - " + S + "x + " + Pr + " = 0") + " : " + M("\\Delta = \\ ?"), S * S - 4 * Pr, M(S * S + " - " + 4 * Pr + " = " + (S * S - 4 * Pr)) + "."), GS("Le plus grand nombre ?", Math.max(p, q), M("\\frac{" + S + " + " + Math.abs(p - q) + "}{2} = " + Math.max(p, q)) + ".")],
            traps: [TV(Math.min(p, q), "C'est le plus petit des deux."), TV(S / 2, "Les deux nombres ne sont pas égaux.")] }); },
      () => { const T = R.int(2, 6), k = R.int(1, T - 1), v = 5 * k, h0 = 5 * T * (T - k);
        return Qv("Depuis le haut d'une falaise de " + h0 + " m, on lance une pierre vers le haut. Sa hauteur au-dessus de la mer est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + " (en m, " + M("t") + " en s). Au bout de combien de secondes touche-t-elle l'eau ?", T,
          M("-5t^2 + " + v + "t + " + h0 + " = 0") + " ; on divise par " + M("-5") + " : " + M("t^2 - " + k + "t - " + T * (T - k) + " = 0") + ", " + M("(t - " + T + ")(t + " + (T - k) + ") = 0") + " : " + M("t = " + T) + " s (l'autre est négative).",
          { ctx: "balle", guide: [GS("Divise par " + M("-5") + " : " + M("t^2 - " + k + "t - \\ ? = 0") + ". Le nombre ?", T * (T - k), M(h0 + " : 5 = " + T * (T - k)) + "."), GS("Solution positive ?", T, M("t = " + T) + " s.")],
            traps: [TV(-(T - k), "Un temps négatif n'a pas de sens ici."), TV(Math.sqrt(h0 / 5), "Le lancer vers le haut compte : il y a un terme en " + M("t") + ".")] }); },
    ],
    3: [
      () => { const [Lg, l, x] = pk(JARDINS), c = Lg * l / 2;
        return Qv("Un jardin rectangulaire de " + Lg + " m sur " + l + " m est traversé par deux allées perpendiculaires de même largeur " + M("x") + " (une dans chaque sens). Le reste est du gazon. Quelle largeur faut-il aux allées pour que les allées et le gazon aient la même aire ?", x,
          "Le gazon forme un rectangle de " + M("(" + Lg + " - x)") + " sur " + M("(" + l + " - x)") + " ; il doit valoir la moitié du jardin, " + c + " m² : " + M("x^2 - " + (Lg + l) + "x + " + (Lg * l - c) + " = 0") + ", " + M("x = " + x) + " m (l'autre solution, " + (Lg + l - x) + " m, dépasse la largeur du jardin).",
          { ctx: "jardin", guide: [GS("Aire que doit avoir le gazon (m²) ?", c, "La moitié de " + M(Lg + " \\cdot " + l) + " : " + M(c) + "."), GS(M("(" + Lg + " - x)(" + l + " - x) = " + c) + " : ramène à " + M("x^2 - " + (Lg + l) + "x + k = 0") + ". " + M("k = \\ ?"), Lg * l - c, M(Lg * l + " - " + c + " = " + (Lg * l - c)) + "."), GS("Largeur des allées ?", x, M("x = " + x) + " m.")],
            traps: [TV(Lg + l - x, "Une allée de " + (Lg + l - x) + " m serait plus large que le jardin : on écarte cette solution.")] }); },
      () => { const c = pk([2, 3, 4, 5]), k = R.int(3, 12), V = c * k * k, s = k + 2 * c;
        return Qv("Dans une plaque carrée, on découpe un carré de " + c + " cm de côté à chaque coin, puis on plie les bords pour faire une boîte sans couvercle de " + V + " cm³. Quel est le côté de la plaque (en cm) ?", s,
          "Le fond est un carré de côté " + M("s - " + 2 * c) + " et la hauteur vaut " + c + " : " + M(c + "(s - " + 2 * c + ")^2 = " + V) + ", donc " + M("(s - " + 2 * c + ")^2 = " + k * k) + ", " + M("s - " + 2 * c + " = " + k) + " et " + M("s = " + s) + " cm.",
          { ctx: "boite", guide: [GS("Que vaut " + M("(s - " + 2 * c + ")^2") + " ?", k * k, M(V + " : " + c + " = " + k * k) + "."), GS("Côté du fond " + M("s - " + 2 * c) + " ?", k, M(k) + " (une longueur est positive)."), GS("Côté de la plaque ?", s, M(k + " + " + 2 * c + " = " + s) + " cm.")],
            traps: [TV(k, "C'est le côté du fond : on a découpé " + c + " cm de chaque côté."), TV(k + c, "On découpe un carré à <b>chaque</b> coin : " + 2 * c + " cm en tout sur chaque côté.")] }); },
      () => { const [p, q] = pk([[3, 1], [2, 1], [3, 2], [4, 3], [5, 2], [5, 3], [4, 1]]), S = (p * p + q * q) / (p * q);
        return Qv("Un nombre positif augmenté de son inverse vaut " + M(frac(p * p + q * q, p * q)) + ". Quel est ce nombre, s'il est plus grand que 1 ?", p / q,
          M("x + \\frac{1}{x} = " + frac(p * p + q * q, p * q)) + " ; on multiplie par " + M(p * q + "x") + " : " + M(p * q + "x^2 - " + (p * p + q * q) + "x + " + p * q + " = 0") + ", " + M("x = " + frac(p, q)) + " ou " + M("x = " + frac(q, p)) + ".",
          { ctx: "inverse", guide: [GS("Multiplie par " + M(p * q + "x") + " : " + M(p * q + "x^2 - b x + " + p * q + " = 0") + ". " + M("b = \\ ?"), p * p + q * q, M(p * p + q * q) + "."), GS("Solution plus grande que 1 ?", p / q, M(frac(p, q)) + " (l'autre, " + M(frac(q, p)) + ", est son inverse).")],
            traps: [TV(q / p, "C'est la solution plus petite que 1 (l'inverse de l'autre)."), TV(S, "C'est la somme donnée : on cherche le nombre.")] }); },
      () => { if (!VELOS.length) return PRQ2[3][0](); const [v, k, D, t] = pk(VELOS);
        return Qv("Une cycliste parcourt " + D + " km. Si elle roulait " + k + " km/h plus vite, elle mettrait " + decTxt(t) + " h de moins. Quelle est sa vitesse (en km/h) ?", v,
          M("\\frac{" + D + "}{v} - \\frac{" + D + "}{v + " + k + "} = " + dec(t)) + " ; on multiplie par " + M("v(v + " + k + ")") + " : " + M(D * k + " = " + dec(t) + "v(v + " + k + ")") + ", donc " + M("v^2 + " + k + "v - " + (D * k) / t + " = 0") + " et " + M("v = " + v) + " km/h.",
          { ctx: "velo", guide: [GS("Multiplie par " + M("v(v + " + k + ")") + " et divise par " + M(dec(t)) + " : " + M("v^2 + " + k + "v - c = 0") + ". " + M("c = \\ ?"), (D * k) / t, M(D + " \\cdot " + k + " : " + dec(t) + " = " + (D * k) / t) + "."), GS("Vitesse positive ?", v, M("v = " + v) + " km/h.")],
            traps: [TV(-(v + k), "Une vitesse est positive ici."), TV(v + k, "C'est la vitesse plus rapide ; on demande sa vitesse réelle.")] }); },
    ],
  };

  // ===================== eq3 : degré 3 par factorisation =====================
  const EQ3 = {
    1: [
      () => { const k = R.int(2, 9);
        return Qs("Résous : " + M("x^3 - " + k * k + "x = 0") + "." + ASK, [-k, 0, k], M("x(x^2 - " + k * k + ") = x(x - " + k + ")(x + " + k + ") = 0") + " : " + SS([-k, 0, k]) + ".",
          { ctx: "evidence", guide: [GS("Mets " + M("x") + " en évidence : " + M("x(x^2 - \\ ?)") + ". Le nombre ?", k * k, M("x(x^2 - " + k * k + ")") + "."), GSet("Solutions ?", [-k, 0, k], SS([-k, 0, k]) + ".")],
            traps: [TS([-k, k], "Tu as divisé par " + M("x") + " : tu perds " + M("x = 0") + "."), TS([0, k], M("x^2 = " + k * k) + " a deux solutions.")] }); },
      () => { const b = nz(-9, 9);
        return Qs("Résous : " + M("x^3" + sgn(b) + "x^2 = 0") + "." + ASK, [0, -b], M("x^2(x" + sgn(b) + ") = 0") + " : " + M("x = 0") + " (solution double) ou " + M("x = " + -b) + ".",
          { ctx: "x2-evidence", guide: [GS("Mets " + M("x^2") + " en évidence : " + M("x^2(x + \\ ?)") + ". Le nombre ?", b, M("x^2(x" + sgn(b) + ")") + "."), GSet("Solutions ?", [0, -b], SS([0, -b]) + ".")],
            traps: [TS([-b], M("x^2 = 0") + " donne aussi une solution : " + M("x = 0") + "."), TS([0, b], "Attention au signe : " + M("x" + sgn(b) + " = 0 \\iff x = " + -b) + ".")] }); },
      () => { const a = nz(-6, 6), b = R.int(1, 6); if (Math.abs(a) === b) return EQ3[1][2]();
        return Qs("Résous : " + M("(" + xm(a) + ")(x^2 - " + b * b + ") = 0") + "." + ASK, [a, -b, b], M("(" + xm(a) + ")(x - " + b + ")(x + " + b + ") = 0") + " : " + SS([a, -b, b]) + ".",
          { ctx: "produit", guide: [GS("Factorise " + M("x^2 - " + b * b) + " : la racine positive ?", b, M("(x - " + b + ")(x + " + b + ")") + "."), GSet("Solutions ?", [a, -b, b], SS([a, -b, b]) + ".")],
            traps: [TS([a, b], M("x^2 = " + b * b) + " a deux solutions : " + M(b) + " et " + M(-b) + ".")] }); },
      () => { const a = pk([2, 3, 5]), k = R.int(2, 7);
        return Qs("Résous : " + M(a + "x^3 = " + a * k * k + "x") + "." + ASK, [-k, 0, k], "On ramène à 0 : " + M(a + "x(x^2 - " + k * k + ") = 0") + " : " + SS([-k, 0, k]) + ".",
          { ctx: "ramener", guide: [GS("Ramène à 0 et mets " + M(a + "x") + " en évidence : " + M(a + "x(x^2 - \\ ?)") + ". Le nombre ?", k * k, M(a * k * k + " : " + a + " = " + k * k) + "."), GSet("Solutions ?", [-k, 0, k], SS([-k, 0, k]) + ".")],
            traps: [TS([-k, k], "Diviser par " + M("x") + " fait perdre la solution " + M("x = 0") + ".")] }); },
    ],
    2: [
      () => { let p, q; do { p = nz(-8, 8); q = nz(-8, 8); } while (p === q || p === -q);
        return Qs("Résous : " + M(poly([1, -(p + q), p * q, 0]) + " = 0") + "." + ASK, [0, p, q], M("x(" + T2(1, -(p + q), p * q) + ") = x(" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + SS([0, p, q]) + ".",
          { ctx: "trinome", guide: [GS("Après la mise en évidence de " + M("x") + ", factorise le trinôme : deux nombres de produit " + M(p * q) + " et de somme " + M(-(p + q)) + ". Le plus petit ?", Math.min(-p, -q), M(-p) + " et " + M(-q) + "."), GSet("Solutions ?", [0, p, q], SS([0, p, q]) + ".")],
            traps: [TS([p, q], "Et le facteur " + M("x") + " ? Il donne " + M("x = 0") + "."), TS([0, -p, -q], "Les solutions sont les opposés des nombres de la factorisation.")] }); },
      () => { const k = pk([1, 2, 3, 4, 5, 9, 16]);
        return Qs("Résous : " + M("x^3 + " + k + "x = 0") + "." + ASK, [0], M("x(x^2 + " + k + ") = 0") + " ; " + M("x^2 + " + k) + " ne s'annule jamais. Seule solution : " + M("x = 0") + ".",
          { ctx: "facteur-positif", guide: [GS("Combien de solutions a " + M("x^2 + " + k + " = 0") + " ?", 0, "Aucune : un carré ne vaut jamais " + M(-k) + "."), GSet("Solutions de l'équation ?", [0], M("x = 0") + ".")],
            traps: [TS([-Math.sqrt(k), 0, Math.sqrt(k)], M("x^2 + " + k + " = 0") + " n'a pas de solution (ce n'est pas " + M("x^2 - " + k) + ")."), TN(M("x = 0") + " est solution : " + M("0^3 + " + k + " \\cdot 0 = 0") + ".")] }); },
      () => { const a = nz(-7, 7);
        return Qs("Résous : " + M(poly([1, -2 * a, a * a, 0]) + " = 0") + "." + ASK, [0, a], M("x(" + T2(1, -2 * a, a * a) + ") = x(" + xm(a) + ")^2 = 0") + " : " + SS([0, a]) + ".",
          { ctx: "carre-parfait", guide: [GS("Après " + M("x") + " en évidence, " + M(T2(1, -2 * a, a * a)) + " est le carré " + M("(x - a)^2") + " : " + M("a = \\ ?"), a, M("(" + xm(a) + ")^2") + "."), GSet("Solutions ?", [0, a], SS([0, a]) + ".")],
            traps: [TS([-a, 0, a], M("(" + xm(a) + ")^2 = 0") + " seulement pour " + M("x = " + a) + "."), TS([a], "Et " + M("x = 0") + " ?")] }); },
      () => { const k = nz(-9, 9);
        return Qs("Résous : " + M("x^3 = " + k + "x^2") + "." + ASK, [0, k], M("x^2(" + xm(k) + ") = 0") + " : " + SS([0, k]) + ".",
          { ctx: "x2-ramener", guide: [GSet("Ramène à 0 et mets " + M("x^2") + " en évidence : " + M("x^2(" + xm(k) + ") = 0") + ". Solutions ?", [0, k], SS([0, k]) + ".")],
            traps: [TS([k], "Diviser par " + M("x^2") + " fait perdre " + M("x = 0") + ".")] }); },
    ],
    3: [
      () => { const a = nz(-6, 6), b = R.int(1, 6); if (Math.abs(a) === b) return EQ3[3][0]();
        return Qs("Résous : " + M(poly([1, a, -b * b, -a * b * b]) + " = 0") + "." + ASK, [-a, -b, b], "Par groupements : " + M("x^2(" + L(1, a) + ") - " + b * b + "(" + L(1, a) + ") = (" + L(1, a) + ")(x^2 - " + b * b + ")") + " : " + SS([-a, -b, b]) + ".",
          { ctx: "groupements", guide: [GS("Groupe : " + M("x^2(" + L(1, a) + ") - k(" + L(1, a) + ")") + ". " + M("k = \\ ?"), b * b, M(b * b) + "."), GSet("Solutions ?", [-a, -b, b], SS([-a, -b, b]) + ".")],
            traps: [TS([-a], "Le facteur " + M("x^2 - " + b * b) + " donne aussi deux solutions."), TS([a, -b, b], "Attention au signe : " + M(L(1, a) + " = 0 \\iff x = " + -a) + ".")] }); },
      () => { const k = pk([2, 3, 5]); let p, q; do { p = nz(-7, 7); q = nz(-7, 7); } while (p === q || p === -q);
        return Qs("Résous : " + M(poly([k, -k * (p + q), k * p * q, 0]) + " = 0") + "." + ASK, [0, p, q], M(k + "x(" + T2(1, -(p + q), p * q) + ") = " + k + "x(" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + SS([0, p, q]) + ".",
          { ctx: "facteur-num", guide: [GS("Facteur commun numérique ?", k, M(k + "x") + " en évidence."), GS("Deux nombres de produit " + M(p * q) + " et de somme " + M(-(p + q)) + " : le plus petit ?", Math.min(-p, -q), M(-p) + " et " + M(-q) + "."), GSet("Solutions ?", [0, p, q], SS([0, p, q]) + ".")],
            traps: [TS([p, q], "Le facteur " + M(k + "x") + " donne " + M("x = 0") + ".")] }); },
      () => { const m = pk([2, 3, 5, 6, 7]), b = nz(-6, 6);
        return Qs("Résous : " + M("(x^2 - " + m + ")(" + xm(b) + ") = 0") + " (valeurs exactes, avec √)." + ASK, [-Math.sqrt(m), Math.sqrt(m), b], M("x^2 = " + m) + " donne " + M("x = \\pm\\sqrt{" + m + "}") + " ; " + M(xm(b) + " = 0") + " donne " + M("x = " + b) + ".",
          { ctx: "racines", guide: [GSR("Solution positive de " + M("x^2 = " + m) + " ?", Math.sqrt(m), M("\\sqrt{" + m + "}") + "."), GSet("Toutes les solutions ?", [-Math.sqrt(m), Math.sqrt(m), b], M("-\\sqrt{" + m + "}") + ", " + M("\\sqrt{" + m + "}") + " et " + M(b) + ".")],
            traps: [TS([b], "Le facteur " + M("x^2 - " + m) + " s'annule aussi."), TS([Math.sqrt(m), b], M("x^2 = " + m) + " a deux solutions.")] }); },
      () => { const k = R.int(2, 7), w = pk(WHO);
        return Qs(w + " résout " + M("x^3 = " + k * k + "x") + " : « je divise par " + M("x") + " : " + M("x^2 = " + k * k) + ", donc " + M("x = " + k) + " ». Corrige." + ASK, [-k, 0, k], "Deux erreurs : diviser par " + M("x") + " perd " + M("x = 0") + ", et " + M("x^2 = " + k * k) + " a deux solutions. " + M("x(x - " + k + ")(x + " + k + ") = 0") + " : " + SS([-k, 0, k]) + ".",
          { ctx: "erreur", guide: [GSet("Ramène à 0 et factorise : " + M("x(x - " + k + ")(x + " + k + ") = 0") + ". Solutions ?", [-k, 0, k], SS([-k, 0, k]) + ".")],
            traps: [TS([k], "C'est la réponse de " + w + " : il en manque deux."), TS([-k, k], "Diviser par " + M("x") + " fait perdre " + M("x = 0") + ".")] }); },
    ],
  };

  // ===================== bicarre : équations bicarrées =====================
  const BIC = {
    1: [
      () => { const p = R.int(1, 4), q = p + R.int(1, 3);
        return Qs("Résous : " + M(poly([1, 0, -(p * p + q * q), 0, p * p * q * q]) + " = 0") + "." + ASK, [-q, -p, p, q], "Avec " + M("X = x^2") + " : " + M("X^2 - " + (p * p + q * q) + "X + " + p * p * q * q + " = 0") + ", " + M("X = " + p * p) + " ou " + M("X = " + q * q) + ", donc " + M("x = \\pm " + p) + " ou " + M("x = \\pm " + q) + ".",
          { ctx: "quatre", guide: [GS("Pose " + M("X = x^2") + " : " + M("X^2 - " + (p * p + q * q) + "X + " + p * p * q * q + " = 0") + ". La plus petite valeur de " + M("X") + " ?", p * p, M("X = " + p * p) + " ou " + M("X = " + q * q) + "."), GSet("Reviens à " + M("x") + " : toutes les solutions ?", [-q, -p, p, q], SS([-q, -p, p, q]) + ".")],
            traps: [TS([p * p, q * q], "Ce sont les valeurs de " + M("X = x^2") + " : il faut revenir à " + M("x") + "."), TS([p, q], M("x^2 = " + q * q) + " a deux solutions, " + M("\\pm " + q) + ".")] }); },
      () => { const p = R.int(2, 7);
        return Qs("Résous : " + M("x^4 - " + p * p + "x^2 = 0") + "." + ASK, [-p, 0, p], M("x^2(x^2 - " + p * p + ") = 0") + " : " + M("x = 0") + " ou " + M("x = \\pm " + p) + ".",
          { ctx: "evidence", guide: [GS("Mets " + M("x^2") + " en évidence : " + M("x^2(x^2 - \\ ?)") + ". Le nombre ?", p * p, M("x^2(x^2 - " + p * p + ")") + "."), GSet("Solutions ?", [-p, 0, p], SS([-p, 0, p]) + ".")],
            traps: [TS([-p, p], M("x^2 = 0") + " donne aussi " + M("x = 0") + ".")] }); },
      () => { const k = R.int(2, 4);
        return Qs("Résous : " + M("x^4 = " + k ** 4) + "." + ASK, [-k, k], M("x^4 - " + k ** 4 + " = (x^2 - " + k * k + ")(x^2 + " + k * k + ") = 0") + " ; " + M("x^2 = -" + k * k) + " est impossible, donc " + M("x = \\pm " + k) + ".",
          { ctx: "puissance4", guide: [GS(M("(x^2)^2 = " + k ** 4) + " : la valeur positive de " + M("x^2") + " ?", k * k, M("x^2 = " + k * k) + " (et " + M("x^2 = -" + k * k) + " est impossible)."), GSet("Solutions ?", [-k, k], SS([-k, k]) + ".")],
            traps: [TS([k], "Et " + M(-k) + " ? " + M("(-" + k + ")^4 = " + k ** 4) + "."), TS([-k * k, k * k], "Ce sont les valeurs de " + M("x^2") + " (et " + M("-" + k * k) + " est impossible).")] }); },
    ],
    2: [
      () => { const p = R.int(1, 5), n = R.int(1, 6);
        return Qs("Résous : " + M(poly([1, 0, n - p * p, 0, -n * p * p]) + " = 0") + "." + ASK, [-p, p], "Avec " + M("X = x^2") + " : " + M("X = " + p * p) + " ou " + M("X = " + -n) + " (impossible : un carré n'est pas négatif). Donc " + M("x = \\pm " + p) + ".",
          { ctx: "un-negatif", guide: [GS("Pose " + M("X = x^2") + ". La valeur négative de " + M("X") + " ?", -n, M("X = " + -n) + " ou " + M("X = " + p * p) + "."), GSet(M("x^2 = " + -n) + " est impossible. Solutions ?", [-p, p], SS([-p, p]) + ".")],
            traps: [TS([-n, p * p], "Ce sont les valeurs de " + M("X") + " : reviens à " + M("x") + "."), TS([p], M("x^2 = " + p * p) + " a deux solutions.")] }); },
      () => { const m = R.int(1, 5), n = R.int(1, 5);
        return Qs("Résous : " + M(poly([1, 0, m + n, 0, m * n]) + " = 0") + "." + ASK, [], "Avec " + M("X = x^2") + " : " + M("X = " + -m) + " ou " + M("X = " + -n) + " ; un carré n'est jamais négatif. Aucune solution.",
          { ctx: "aucune", guide: [GS("Pose " + M("X = x^2") + ". La plus petite valeur de " + M("X") + " ?", -Math.max(m, n), M("X = " + -m) + (m !== n ? " ou " + M("X = " + -n) : "") + "."), GSet("Les deux valeurs sont négatives. Solutions ?", [], "Aucune.")],
            traps: [TS([-m, -n], "Ce sont les valeurs de " + M("X = x^2") + ", et elles sont négatives : aucun " + M("x") + " ne convient.")] }); },
      () => { const a = R.int(2, 7), b = pk([1, 3, 4, 9, 16]);
        return Qs("Résous : " + M("(x^2 - " + a * a + ")(x^2 + " + b + ") = 0") + "." + ASK, [-a, a], M("x^2 = " + a * a) + " donne " + M("\\pm " + a) + " ; " + M("x^2 = -" + b) + " est impossible.",
          { ctx: "produit", guide: [GSet("Quels facteurs peuvent s'annuler ? Solutions ?", [-a, a], SS([-a, a]) + " ; " + M("x^2 + " + b) + " est toujours positif.")],
            traps: [TS([-Math.sqrt(b), Math.sqrt(b), -a, a], M("x^2 + " + b + " = 0") + " donne " + M("x^2 = -" + b) + ", impossible."), TS([a], "Et " + M(-a) + " ?")] }); },
      () => { const p = R.int(2, 6);
        return Qs("Résous : " + M(poly([1, 0, -2 * p * p, 0, p ** 4]) + " = 0") + "." + ASK, [-p, p], M("(x^2 - " + p * p + ")^2 = 0") + " : " + M("x^2 = " + p * p) + ", " + M("x = \\pm " + p) + ".",
          { ctx: "carre", guide: [GS("Pose " + M("X = x^2") + " : " + M("(X - \\ ?)^2 = 0") + ". Le nombre ?", p * p, M("X = " + p * p) + "."), GSet("Solutions ?", [-p, p], SS([-p, p]) + ".")],
            traps: [TS([p * p], "C'est la valeur de " + M("X = x^2") + " : reviens à " + M("x") + ".")] }); },
    ],
    3: [
      () => { const p = R.int(1, 3), m = pk([2, 3, 5, 6, 7].filter((v) => v !== p * p));
        return Qs("Résous : " + M(poly([1, 0, -(p * p + m), 0, p * p * m]) + " = 0") + " (valeurs exactes)." + ASK, [-Math.sqrt(m), -p, p, Math.sqrt(m)], "Avec " + M("X = x^2") + " : " + M("X = " + p * p) + " ou " + M("X = " + m) + ", donc " + M("x = \\pm " + p) + " ou " + M("x = \\pm\\sqrt{" + m + "}") + ".",
          { ctx: "racines", guide: [GS("Pose " + M("X = x^2") + ". La valeur de " + M("X") + " qui est un carré parfait ?", p * p, M("X = " + p * p) + " ou " + M("X = " + m) + "."), GSet("Toutes les solutions ?", [-Math.sqrt(m), -p, p, Math.sqrt(m)], M("\\pm " + p) + " et " + M("\\pm\\sqrt{" + m + "}") + ".")],
            traps: [TS([p * p, m], "Ce sont les valeurs de " + M("X") + " : reviens à " + M("x") + ".")] }); },
      () => { const a = pk([2, 3]), q = R.int(2, 3);
        return Qs("Résous : " + M(poly([a * a, 0, -(a * a * q * q + 1), 0, q * q]) + " = 0") + " (valeurs exactes)." + ASK, [-q, -1 / a, 1 / a, q], "Avec " + M("X = x^2") + " : " + M("X = " + q * q) + " ou " + M("X = \\frac{1}{" + a * a + "}") + ", donc " + M("x = \\pm " + q) + " ou " + M("x = \\pm \\frac{1}{" + a + "}") + ".",
          { ctx: "fractions", guide: [GS("Pose " + M("X = x^2") + ". La plus grande valeur de " + M("X") + " ?", q * q, M("X = " + q * q) + " ou " + M("X = \\frac{1}{" + a * a + "}") + "."), GSet("Toutes les solutions ?", [-q, -1 / a, 1 / a, q], SS([-q, -1 / a, 1 / a, q]) + ".")],
            traps: [TS([1 / (a * a), q * q], "Ce sont les valeurs de " + M("X") + ".")] }); },
      () => { const y1 = R.int(1, 3), y2 = y1 + R.int(1, 4), c = R.int(1, 3);
        const xs = [y1 + c, y2 + c], vals = xs.flatMap((v) => [-Math.sqrt(v), Math.sqrt(v)]);
        return Qs("Résous : " + M("(x^2 - " + c + ")^2 - " + (y1 + y2) + "(x^2 - " + c + ") + " + y1 * y2 + " = 0") + " (valeurs exactes, avec √ si besoin)." + ASK, vals,
          "Avec " + M("Y = x^2 - " + c) + " : " + M("Y^2 - " + (y1 + y2) + "Y + " + y1 * y2 + " = 0") + ", " + M("Y = " + y1) + " ou " + M("Y = " + y2) + ", donc " + M("x^2 = " + xs[0]) + " ou " + M("x^2 = " + xs[1]) + " : " + M("x = \\pm " + rt(xs[0])) + " ou " + M("x = \\pm " + rt(xs[1])) + ".",
          { ctx: "substitution", guide: [GS("Pose " + M("Y = x^2 - " + c) + ". La plus petite valeur de " + M("Y") + " ?", y1, M("Y = " + y1) + " ou " + M("Y = " + y2) + "."), GS("Alors " + M("x^2 = Y + " + c) + ". La plus petite valeur de " + M("x^2") + " ?", xs[0], M(xs[0]) + " (et " + M(xs[1]) + ")."), GSet("Toutes les solutions ?", vals, M("\\pm " + rt(xs[0])) + " et " + M("\\pm " + rt(xs[1])) + ".")],
            traps: [TS([y1, y2], "Ce sont les valeurs de " + M("Y") + " : reviens à " + M("x") + " (" + M("x^2 = Y + " + c) + ")."), TS([-Math.sqrt(y1), Math.sqrt(y1), -Math.sqrt(y2), Math.sqrt(y2)], M("Y = x^2 - " + c) + " : on ajoute " + c + " avant de prendre la racine.")] }); },
      () => { const p = 1, q = R.int(2, 4), w = pk(WHO);
        return Qs(w + " résout " + M(poly([1, 0, -(1 + q * q), 0, q * q]) + " = 0") + " et donne " + M("S = \\{1 \\,;\\, " + q * q + "\\}") + ". Corrige." + ASK, [-q, -1, 1, q], w + " a donné les valeurs de " + M("X = x^2") + ". On revient à " + M("x") + " : " + M("x^2 = 1") + " ou " + M("x^2 = " + q * q) + ", donc " + SS([-q, -1, 1, q]) + ".",
          { ctx: "erreur", guide: [GSet("Reviens à " + M("x") + " : " + M("x^2 = 1") + " ou " + M("x^2 = " + q * q) + ". Solutions ?", [-q, -1, 1, q], SS([-q, -1, 1, q]) + ".")],
            traps: [TS([1, q * q], "C'est la réponse de " + w + " : ce sont les valeurs de " + M("X") + "."), TS([1, q], "Chaque " + M("x^2 = X > 0") + " donne deux solutions.")] }); },
    ],
  };

  // ===================== eqirr : équations irrationnelles =====================
  const IRR = {
    1: [
      () => { const a = nz(-9, 9), b = R.int(2, 9);
        return Qs("Résous : " + M("\\sqrt{" + L(1, a) + "} = " + b) + "." + ASK, [b * b - a], "On élève au carré : " + M(L(1, a) + " = " + b * b) + ", donc " + M("x = " + (b * b - a)) + ". Vérification : " + M("\\sqrt{" + b * b + "} = " + b) + ".",
          { ctx: "simple", guide: [GS("Élève au carré : " + M(L(1, a) + " = \\ ?"), b * b, M(b + "^2 = " + b * b) + "."), GSet("Solution (vérifiée) ?", [b * b - a], M("x = " + (b * b - a)) + ".")],
            traps: [TS([b - a], "On élève les <b>deux</b> membres au carré : " + M(L(1, a) + " = " + b * b) + ".")] }); },
      () => { const a = R.int(2, 5), b = nz(-9, 9), c = R.int(2, 7); if ((c * c - b) % a) return IRR[1][1]();
        return Qs("Résous : " + M("\\sqrt{" + L(a, b) + "} = " + c) + "." + ASK, [(c * c - b) / a], M(L(a, b) + " = " + c * c) + ", donc " + M("x = " + tn((c * c - b) / a)) + ".",
          { ctx: "coefficient", guide: [GS("Élève au carré : " + M(L(a, b) + " = \\ ?"), c * c, M(c * c) + "."), GSet("Solution ?", [(c * c - b) / a], M("x = " + tn((c * c - b) / a)) + ".")],
            traps: [TS([(c - b) / a], "Élève au carré les deux membres : " + M(c + "^2 = " + c * c) + ".")] }); },
      () => { const a = nz(-9, 9), b = R.int(2, 7);
        return Qs("Résous : " + M("\\sqrt{" + L(1, a) + "} = -" + b) + "." + ASK, [], "Une racine carrée n'est jamais négative : aucune solution. (En élevant au carré, on trouverait " + M("x = " + (b * b - a)) + ", mais " + M("\\sqrt{" + b * b + "} = " + b + " \\ne -" + b) + ".)",
          { ctx: "negatif", guide: [GSet("Une racine carrée peut-elle valoir " + M("-" + b) + " ? Solutions ?", [], "Aucune : une racine carrée est toujours positive ou nulle.")],
            traps: [TS([b * b - a], "Vérifie : " + M("\\sqrt{" + b * b + "} = " + b) + ", pas " + M("-" + b) + ". C'est une solution parasite.")] }); },
      () => { const a = R.int(1, 9), d = R.int(2, 8), v = pk(["x", "t"]);
        return Qs("Résous : " + M("\\sqrt{" + v + "} + " + a + " = " + (a + d)) + "." + ASK, [d * d], "On isole la racine : " + M("\\sqrt{" + v + "} = " + d) + ", puis " + M(v + " = " + d * d) + ".",
          { ctx: "isoler", guide: [GS("Isole la racine : " + M("\\sqrt{" + v + "} = \\ ?"), d, M((a + d) + " - " + a + " = " + d) + "."), GSet("Solution ?", [d * d], M(v + " = " + d * d) + ".")],
            traps: [TS([(a + d) ** 2 - a * a], "Isole d'abord la racine, puis élève au carré : " + M("(\\sqrt{" + v + "} + " + a + ")^2 \\ne " + v + " + " + a * a) + "."), TS([d], "C'est " + M("\\sqrt{" + v + "}") + " qui vaut " + d + " : " + M(v + " = " + d + "^2") + ".")] }); },
    ],
    2: [
      () => { let b, r, p, a; for (let t = 0; t < 80; t++) { b = R.int(-3, 4); r = R.int(Math.max(1 - b, -2), 7); p = 1 - 2 * b - r; a = b * b - r * p; if (p + b < 0 && r !== p && p + a >= 0) break; a = null; }
        if (a === null) return IRR[2][1]();
        return Qs("Résous : " + M("\\sqrt{" + L(1, a) + "} = " + L(1, b)) + "." + ASK, [r], "Au carré : " + M(L(1, a) + " = (" + L(1, b) + ")^2") + ", soit " + M(T2(1, 2 * b - 1, b * b - a) + " = 0") + " : " + M("x = " + r) + " ou " + M("x = " + p) + ". Vérification : pour " + M("x = " + p) + ", " + M(L(1, b) + " = " + (p + b) + " < 0") + " : solution parasite. " + SS([r]) + ".",
          { ctx: "parasite", guide: [GS("Élève au carré et ramène à 0 : " + M(T2(1, 2 * b - 1, 0) + " + c = 0") + ". " + M("c = \\ ?"), b * b - a, M(b * b + " - " + P(a) + " = " + (b * b - a)) + "."), GS("Solutions de cette équation : la plus petite ?", p, M("x = " + p) + " ou " + M("x = " + r) + "."), GSet("Vérifie dans l'équation de départ. Solutions ?", [r], "Pour " + M("x = " + p) + ", le membre de droite vaut " + M(p + b) + " < 0 : refusé. " + SS([r]) + ".")],
            traps: [TS([r, p], "Vérifie " + M("x = " + p) + " : " + M("\\sqrt{" + (p + a) + "} = " + Math.sqrt(p + a)) + ", mais " + M(L(1, b) + " = " + (p + b)) + ". Le carré a créé une solution parasite.")] }); },
      () => { let a, b, c, d, s; for (let t = 0; t < 60; t++) { a = R.int(2, 6); c = R.int(1, 5); b = nz(-9, 9); s = nz(-6, 8); d = (a - c) * s + b; if (a !== c && a * s + b >= 0) break; s = null; }
        if (s === null) return IRR[2][0]();
        return Qs("Résous : " + M("\\sqrt{" + L(a, b) + "} = \\sqrt{" + L(c, d) + "}") + "." + ASK, [s], "Au carré : " + M(L(a, b) + " = " + L(c, d)) + ", donc " + M("x = " + s) + ". Vérification : les deux radicandes valent " + M(a * s + b) + " (positif).",
          { ctx: "deux-racines", guide: [GS("Au carré : " + M(L(a, b) + " = " + L(c, d)) + ". " + M("x = \\ ?"), s, M(L(a - c, 0) + " = " + (d - b)) + ", " + M("x = " + s) + "."), GSet("Les radicandes sont-ils positifs pour cette valeur ? Solutions ?", [s], "Oui (" + M(a * s + b) + ") : " + SS([s]) + ".")],
            traps: [TN("Pour " + M("x = " + s) + ", les radicandes valent " + M(a * s + b) + " : la solution convient.")] }); },
      () => { const b = R.int(1, 5), x0 = R.int(-b + 1, 8), a = 2 * b * x0 + b * b; if (a <= 0) return IRR[2][2]();
        return Qs("Résous : " + M("\\sqrt{x^2 + " + a + "} = x + " + b) + "." + ASK, [x0], "Au carré : " + M("x^2 + " + a + " = x^2 + " + 2 * b + "x + " + b * b) + ", donc " + M(2 * b + "x = " + (a - b * b)) + " et " + M("x = " + x0) + ". Vérification : " + M("x + " + b + " = " + (x0 + b) + " \\ge 0") + ".",
          { ctx: "carres-elimines", guide: [GS("Au carré, les " + M("x^2") + " s'éliminent : " + M(2 * b + "x = \\ ?"), a - b * b, M(a + " - " + b * b + " = " + (a - b * b)) + "."), GSet("Solution (vérifiée) ?", [x0], M("x = " + x0) + ".")],
            traps: [TS([(a - b * b) / b], M("(x + " + b + ")^2 = x^2 + " + 2 * b + "x + " + b * b) + " : le double produit vaut " + M(2 * b + "x") + "."), TS([a / (2 * b)], "N'oublie pas le " + M(b * b) + " de " + M("(x + " + b + ")^2 = x^2 + " + 2 * b + "x + " + b * b) + ".")] }); },
    ],
    3: [
      () => { let b, r, p, a; for (let t = 0; t < 80; t++) { b = R.int(1, 6); r = R.int(b + 1, b + 8); p = 2 * b + 1 - r; a = r * p - b * b; a = -a; if (p - b < 0 && p + a >= 0 && r !== p) break; a = null; }
        // x − b = √(x + a) ; au carré : x² − (2b + 1)x + b² − a = 0, de solutions r et p.
        if (a === null) return IRR[2][0]();
        return Qs("Résous : " + M("\\sqrt{" + L(1, a) + "} + " + b + " = x") + "." + ASK, [r], "On isole la racine : " + M("\\sqrt{" + L(1, a) + "} = x - " + b) + ". Au carré : " + M(T2(1, -(2 * b + 1), b * b - a) + " = 0") + " : " + M("x = " + r) + " ou " + M("x = " + p) + " ; pour " + M("x = " + p) + ", " + M("x - " + b + " = " + (p - b) + " < 0") + " : parasite. " + SS([r]) + ".",
          { ctx: "isoler-parasite", guide: [GS("Isole la racine : " + M("\\sqrt{" + L(1, a) + "} = x - \\ ?"), b, M("x - " + b) + "."), GS("Au carré et ramené à 0, l'équation a deux solutions : la plus petite ?", p, M("x = " + p) + " ou " + M("x = " + r) + "."), GSet("Vérifie. Solutions ?", [r], SS([r]) + " : " + M(p) + " est parasite.")],
            traps: [TS([r, p], "Vérifie " + M("x = " + p) + " dans l'équation de départ : " + M("\\sqrt{" + (p + a) + "} + " + b + " = " + (Math.sqrt(p + a) + b) + " \\ne " + p) + ".")] }); },
      () => { const a = pk([3, 5, 7, 9, 11, 13]), h = (a - 1) / 2;
        return Qs("Résous : " + M("\\sqrt{x + " + a + "} = \\sqrt{x} + 1") + "." + ASK, [h * h], "Au carré : " + M("x + " + a + " = x + 2\\sqrt{x} + 1") + ", donc " + M("2\\sqrt{x} = " + (a - 1)) + ", " + M("\\sqrt{x} = " + h) + " et " + M("x = " + h * h) + ". Vérification : " + M("\\sqrt{" + (h * h + a) + "} = " + (h + 1)) + ".",
          { ctx: "deux-carres", guide: [GS("Au carré : " + M("x + " + a + " = x + 2\\sqrt{x} + 1") + ". Que vaut " + M("2\\sqrt{x}") + " ?", a - 1, M(a + " - 1 = " + (a - 1)) + "."), GS(M("\\sqrt{x} = \\ ?"), h, M(h) + "."), GSet("Solution ?", [h * h], M("x = " + h * h) + ".")],
            traps: [TN(M("(\\sqrt{x} + 1)^2 = x + 2\\sqrt{x} + 1") + ", pas " + M("x + 1") + " : il y a le double produit."), TS([h], "C'est " + M("\\sqrt{x}") + " : élève au carré.")] }); },
      () => { let b, r, p, a; for (let t = 0; t < 80; t++) { b = R.int(1, 5); r = R.int(b + 3, b + 9); p = 2 * b + 2 - r; a = b * b - r * p; if (p - b < 0 && 2 * p + a >= 0 && r !== p) break; a = null; }
        if (a === null) return IRR[3][1]();
        return Qs("Résous : " + M("\\sqrt{" + L(2, a) + "} = x - " + b) + "." + ASK, [r], "Au carré : " + M(L(2, a) + " = (x - " + b + ")^2") + ", soit " + M(T2(1, -(2 * b + 2), b * b - a) + " = 0") + " : " + M("x = " + r) + " ou " + M("x = " + p) + " ; " + M(p) + " est parasite (" + M("x - " + b + " < 0") + ").",
          { ctx: "coeff-parasite", guide: [GS("Au carré et ramené à 0 : " + M("x^2 - " + (2 * b + 2) + "x + c = 0") + ". " + M("c = \\ ?"), b * b - a, M(b * b + " - " + P(a) + " = " + (b * b - a)) + "."), GSet("Résous et vérifie. Solutions ?", [r], SS([r]) + ".")],
            traps: [TS([r, p], "Vérifie " + M("x = " + p) + " : " + M("x - " + b + " = " + (p - b)) + " est négatif, alors qu'une racine ne l'est jamais.")] }); },
      () => { let b, r, p, a; for (let t = 0; t < 80; t++) { b = R.int(-2, 3); r = R.int(Math.max(1 - b, 0), 6); p = 1 - 2 * b - r; a = b * b - r * p; if (p + b < 0 && r !== p && p + a >= 0) break; a = null; }
        if (a === null) return IRR[3][1]();
        const w = pk(WHO);
        return Qs(w + " résout " + M("\\sqrt{" + L(1, a) + "} = " + L(1, b)) + " et donne " + M("S = \\{" + [p, r].sort((u, v) => u - v).join(" \\,;\\, ") + "\\}") + ". A-t-" + (["Léa", "Inès", "Mia", "Lina"].includes(w) ? "elle" : "il") + " raison ? Corrige si besoin." + ASK, [r], "Il faut vérifier : pour " + M("x = " + p) + ", " + M("\\sqrt{" + (p + a) + "} = " + Math.sqrt(p + a)) + " mais " + M(L(1, b) + " = " + (p + b)) + ". Seule " + M("x = " + r) + " convient : " + SS([r]) + ".",
          { ctx: "erreur", guide: [GS("Vérifie " + M("x = " + p) + " : combien vaut le membre de droite ?", p + b, M(p + b) + ", négatif : impossible pour une racine."), GSet("Solutions ?", [r], SS([r]) + ".")],
            traps: [TS([p, r], "C'est la réponse de " + w + " : il manque la vérification ; " + M(p) + " est une solution parasite.")] }); },
    ],
  };

  // ===================== Défis : problèmes en plusieurs étapes (réponses numériques) =====================
  const Pb = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const PROBS = {
    eq1: [() => { const h1 = pk([24, 30, 36]), a = pk([3, 4, 6]), b = pk([1, 1.5, 2]), t = pk([4, 5, 6]), h2 = h1 - (a - b) * t; if (h2 <= 0 || h2 >= h1 || h1 - a * t < 3) return PROBS.eq1[0](); /* 25.11 : hauteur commune non nulle (sinon les bougies sont consumées) */
      return Pb("Deux bougies sont allumées en même temps. La bougie A mesure " + h1 + " cm et raccourcit de " + a + " cm par heure ; la bougie B mesure " + M(dec(h2)) + " cm et raccourcit de " + M(dec(b)) + " cm par heure.", [["a) Hauteur de A après 2 h (cm)", h1 - 2 * a], ["b) Au bout de combien d'heures ont-elles la même hauteur ?", t], ["c) Quelle est alors cette hauteur (cm) ?", h1 - a * t]],
        ["Hauteur de A : " + h1 + " − " + a + "t ; de B : " + decTxt(h2) + " − " + (b === 1 ? "" : decTxt(b)) + "t.", "Résous " + h1 + " − " + a + "t = " + decTxt(h2) + " − " + (b === 1 ? "" : decTxt(b)) + "t."], "a) " + M(h1 + " - " + 2 * a + " = " + (h1 - 2 * a)) + " cm. b) " + M(h1 + " - " + a + "t = " + dec(h2) + " - " + (b === 1 ? "" : dec(b)) + "t") + " donne " + M(dec(a - b) + "t = " + dec(h1 - h2)) + ", " + M("t = " + t) + " h. c) " + M(h1 + " - " + a * t + " = " + (h1 - a * t)) + " cm."); }],
    eqfrac: [() => { const [a, b] = pk([[3, 6], [4, 12], [2, 3], [6, 3], [10, 15], [4, 6]]), t = (a * b) / (a + b);
      return Pb("Un robinet remplit une cuve en " + a + " h ; un autre la remplit en " + b + " h. On les ouvre ensemble.", [["a) Fraction de la cuve remplie en 1 h par le premier", 1 / a], ["b) Fraction remplie en 1 h par les deux ensemble", 1 / a + 1 / b], ["c) Durée pour remplir la cuve ensemble (h)", t]],
        ["En 1 h, le premier remplit 1/" + a + " de la cuve.", "Résous t/" + a + " + t/" + b + " = 1."], "a) " + M("\\frac{1}{" + a + "}") + ". b) " + M("\\frac{1}{" + a + "} + \\frac{1}{" + b + "} = " + frac(a + b, a * b)) + ". c) " + M("\\frac{t}{" + a + "} + \\frac{t}{" + b + "} = 1 \\iff t = " + tn(t)) + " h."); }],
    eqspec: [() => { const a = R.int(2, 9), m = pk([2, 3]);
      return Pb("Programme : « Choisis un nombre. Ajoute " + a + ". Multiplie par " + m + ". Retire " + m + " fois le nombre de départ. »", [["a) Résultat pour 5", m * a], ["b) Résultat pour −3", m * a], ["c) Combien de nombres donnent " + (m * a + 1) + " ?", 0]],
        ["Écris le programme avec n : " + m + "(n + " + a + ") − " + m + "n.", "c) Résous " + m + "(n + " + a + ") − " + m + "n = " + (m * a + 1) + "."], "a) et b) " + M(m * a) + " : " + M(m + "(n + " + a + ") - " + m + "n = " + m * a) + " pour tout " + M("n") + ". c) " + M(m * a + " = " + (m * a + 1)) + " est faux : aucun nombre, donc 0."); }],
    formule: [() => { const C1 = pk([20, 25, 30, 35, 40]), F2 = pk([212, 50, 68, 86, 104]);
      return Pb("La température en degrés Fahrenheit vaut " + M("F = \\frac{9C}{5} + 32") + ", avec " + M("C") + " en degrés Celsius.", [["a) F pour C = " + C1, (9 * C1) / 5 + 32], ["b) C pour F = " + F2, ((F2 - 32) * 5) / 9], ["c) Température où C et F sont égaux", -40]],
        ["b) Isole C : C = 5(F − 32)/9.", "c) Résous x = 9x/5 + 32."], "a) " + M("\\frac{9 \\cdot " + C1 + "}{5} + 32 = " + ((9 * C1) / 5 + 32)) + ". b) " + M("C = \\frac{5(" + F2 + " - 32)}{9} = " + tn(((F2 - 32) * 5) / 9)) + ". c) " + M("x = \\frac{9x}{5} + 32 \\iff -\\frac{4x}{5} = 32 \\iff x = -40") + "."); }],
    probeq: [() => { const a = pk([8, 9, 10, 12]), b = pk([4, 5, 6].filter((v) => v < a)), x = R.int(10, 25), A = (a - b) * x;
      return Pb("Un musée propose l'entrée à " + a + " CHF, ou un abonnement de " + A + " CHF qui fait payer l'entrée " + b + " CHF.", [["a) Prix de 10 entrées sans abonnement (CHF)", 10 * a], ["b) Nombre d'entrées pour lequel les deux formules coûtent autant", x], ["c) Prix payé alors (CHF)", a * x]],
        ["Sans abonnement : " + a + "x ; avec : " + A + " + " + b + "x.", "Résous " + a + "x = " + A + " + " + b + "x."], "a) " + 10 * a + " CHF. b) " + M((a - b) + "x = " + A) + ", " + M("x = " + x) + ". c) " + M(a + " \\cdot " + x + " = " + a * x) + " CHF : au-delà, l'abonnement est plus avantageux."); }],
    eq2fact: [() => { const T = pk([3, 4, 5]), h0 = 5 * T * T, t2 = T - 1;
      return Pb("On lâche une bille du haut d'une tour de " + h0 + " m. Sa hauteur est " + M("h = " + h0 + " - 5t^2") + " (m, " + M("t") + " en s).", [["a) Hauteur après 1 s (m)", h0 - 5], ["b) Instant où elle touche le sol (s)", T], ["c) Instant où elle est à " + (h0 - 5 * t2 * t2) + " m (s)", t2]],
        ["b) Résous " + h0 + " − 5t² = 0 (t positif).", "c) Résous " + h0 + " − 5t² = " + (h0 - 5 * t2 * t2) + "."], "a) " + (h0 - 5) + " m. b) " + M("t^2 = " + T * T) + ", " + M("t = " + T) + " s (" + M("t = -" + T) + " refusé). c) " + M("5t^2 = " + 5 * t2 * t2) + ", " + M("t = " + t2) + " s."); }],
    eq2: [() => { let a, b, c; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); } while (new Set([a, -b, c]).size < 3);
      return Pb("On considère l'équation " + M("(" + xm(a) + ")(" + L(1, b) + ")(" + xm(c) + ") = 0") + ".", [["a) Nombre de solutions", 3], ["b) Plus grande solution", Math.max(a, -b, c)], ["c) Somme des solutions", a - b + c]],
        ["Un produit est nul si l'un de ses facteurs est nul.", "Les solutions : " + a + ", " + -b + " et " + c + "."], "a) 3 : chaque facteur donne une solution. b) " + Math.max(a, -b, c) + ". c) " + M(a + " + " + P(-b) + " + " + P(c) + " = " + (a - b + c)) + "."); }],
    eq2disc: [() => { let p, q; do { p = nz(-7, 7); q = nz(-7, 7); } while (p === q || p === -q); const b = -(p + q), c = p * q;
      return Pb("On considère " + M(T2(1, b, c) + " = 0") + ".", [["a) Discriminant", b * b - 4 * c], ["b) Plus petite solution", Math.min(p, q)], ["c) Valeur de k pour que x² " + (b < 0 ? "− " + -b : "+ " + b) + "x + k = 0 ait une seule solution", (b * b) / 4]],
        ["Δ = b² − 4ac.", "c) Une seule solution quand Δ = 0."], "a) " + M("\\Delta = " + (b * b - 4 * c)) + ". b) " + M(Math.min(p, q)) + ". c) " + M(b * b + " - 4k = 0 \\iff k = " + tn((b * b) / 4)) + "."); }],
    probeq2: [() => { const w = pk([12, 15, 20]), h = pk([8, 10]), x = pk([2, 3, 4]), A = (w + 2 * x) * (h + 2 * x);
      return Pb("Une photo de " + w + " cm sur " + h + " cm est entourée d'un cadre de largeur " + M("x") + ". L'ensemble mesure " + A + " cm².", [["a) Aire de la photo (cm²)", w * h], ["b) Largeur du cadre (cm)", x], ["c) Aire du cadre seul (cm²)", A - w * h]],
        ["(" + w + " + 2x)(" + h + " + 2x) = " + A + ".", "Garde la solution positive."], "a) " + w * h + " cm². b) " + M("4x^2 + " + 2 * (w + h) + "x - " + (A - w * h) + " = 0") + ", " + M("x = " + x) + " cm. c) " + (A - w * h) + " cm²."); }],
    eq3: [() => { let p, q; do { p = R.int(1, 7); q = R.int(1, 7); } while (p === q);
      return Pb("On considère " + M(poly([1, -(p + q), p * q, 0]) + " = 0") + ".", [["a) Nombre de solutions", 3], ["b) Plus grande solution", Math.max(p, q)], ["c) Somme des solutions", p + q]],
        ["Mets x en évidence, puis factorise le trinôme.", "x(x − " + p + ")(x − " + q + ") = 0."], "a) 3 : " + SS([0, p, q]) + ". b) " + Math.max(p, q) + ". c) " + (p + q) + "."); }],
    bicarre: [() => { const p = R.int(1, 3), q = p + R.int(1, 3);
      return Pb("On considère " + M(poly([1, 0, -(p * p + q * q), 0, p * p * q * q]) + " = 0") + " et l'on pose " + M("X = x^2") + ".", [["a) Plus petite valeur de X", p * p], ["b) Plus grande valeur de X", q * q], ["c) Nombre de solutions x", 4]],
        ["X² − " + (p * p + q * q) + "X + " + p * p * q * q + " = 0.", "Chaque X positif donne deux valeurs de x."], "a) " + p * p + ". b) " + q * q + ". c) 4 : " + SS([-q, -p, p, q]) + "."); }],
    eqirr: [() => { const d1 = pk([18, 32, 50, 72]), v2 = pk([40, 60, 100]);
      return Pb("D'après la longueur " + M("d") + " (en m) de ses traces de freinage, la vitesse d'une voiture est environ " + M("v = \\sqrt{200d}") + " (en km/h).", [["a) v pour d = " + d1 + " m", Math.sqrt(200 * d1)], ["b) d pour v = " + v2 + " km/h (m)", (v2 * v2) / 200], ["c) Si d est multipliée par 4, v est multipliée par…", 2]],
        ["b) Résous √(200d) = " + v2 + " : élève au carré.", "c) √(200 · 4d) = 2√(200d)."], "a) " + M("\\sqrt{" + 200 * d1 + "} = " + Math.sqrt(200 * d1)) + " km/h. b) " + M("200d = " + v2 * v2 + " \\iff d = " + tn((v2 * v2) / 200)) + " m. c) 2, car " + M("\\sqrt{4} = 2") + "."); }],
  };

  // « Trouve l'erreur » (24.11, chantier I, suite) : division par x (solution perdue), formule mal retournée.
  const camarade = () => pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  EPN[2].push(() => { const a = pk([1, 1, 2, 3]), r = pk([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]), w = camarade(), ax = (a === 1 ? "" : a) + "x";
    return Qs(w + " résout " + M(ax + "^2 = " + a * r + "x") + " : « je divise les deux membres par " + M("x") + " : " + M(ax + " = " + a * r) + ", donc " + M("x = " + r) + " ». Trouve l'erreur, puis donne toutes les solutions." + ASK, [0, r],
      "Erreur : on ne peut pas diviser par " + M("x") + " sans savoir s'il est nul, et justement " + M("x = 0") + " est solution. On ramène tout à gauche et on factorise : " + M(ax + "^2 " + sgn(-a * r) + "x = 0 \\iff x(" + ax + sgn(-a * r) + ") = 0") + ", donc " + SS([0, r]) + ".",
      { ctx: "erreur", guide: [GS("Tout à gauche et factorisé : " + M("x(" + ax + sgn(-a * r) + ") = 0") + ". Premier facteur nul : " + M("x") + " = ?", 0, M("x = 0") + "."), GSet("Toutes les solutions ?", [0, r], SS([0, r]) + ".")],
        traps: [TS([r], "C'est la réponse de " + w + " : en divisant par " + M("x") + ", on a perdu la solution " + M("x = 0") + ".")] }); });
  FORMULE[2].push(() => { const w = camarade(), c = pk([
      ["v = \\frac{d}{t}", "t", "d/v", "\\frac{d}{v}", "v*d", "v \\cdot d", [["Multiplie les deux membres par " + M("t") + " : " + M("v \\cdot t") + " = ?", "d", "d"], ["Divise par " + M("v") + " : " + M("t") + " = ?", "d/v", "\\frac{d}{v}"]], "vitesse"],
      ["A = \\frac{b \\cdot h}{2}", "h", "2*a/b", "\\frac{2A}{b}", "a/(2*b)", "\\frac{A}{2b}", [["Multiplie les deux membres par 2 : " + M("2A") + " = ?", "b*h", "b \\cdot h"], ["Divise par " + M("b") + " : " + M("h") + " = ?", "2*a/b", "\\frac{2A}{b}"]], "triangle"],
      ["I = \\frac{U}{R}", "R", "u/i", "\\frac{U}{I}", "u*i", "U \\cdot I", [["Multiplie les deux membres par " + M("R") + " : " + M("I \\cdot R") + " = ?", "u", "U"], ["Divise par " + M("I") + " : " + M("R") + " = ?", "u/i", "\\frac{U}{I}"]], "ohm"]]);
    return Qx("Dans la formule " + M(c[0]) + ", " + w + " isole " + M(c[1]) + " : « " + M(c[1] + " = " + c[5]) + " ». Trouve l'erreur, puis exprime correctement " + M(c[1]) + " (écris par exemple « " + c[1] + " = … » ou seulement l'expression).", c[2],
      "Erreur : " + M(c[1]) + " est au dénominateur ; on ne peut pas simplement « faire passer » les lettres. On multiplie d'abord par le dénominateur, puis on divise : " + M(c[1] + " = " + c[3]) + ". Contrôle : en remplaçant dans " + M(c[0]) + ", on retrouve une égalité vraie.",
      { ctx: "erreur", guide: c[6].map(([ask, e, t]) => GX(ask, e, M(t) + ".")), traps: [TX(c[4], "C'est la formule de " + w + " : vérifie avec des nombres, elle ne redonne pas " + M(c[0]) + ".")] }); });

  // ===================== Enregistrement =====================
  const ALL = { eq1: EQ1, eqfrac: EQF, eqspec: SPE, formule: FORMULE, probeq: PRQ, eq2fact: E2F, eq2: EPN, eq2disc: DIS, probeq2: PRQ2, eq3: EQ3, bicarre: BIC, eqirr: IRR };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pk(lv[Math.min(Math.max(d, 1), 3)])();
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    eq1: "Même opération des deux côtés : les x d'un côté, les nombres de l'autre, puis on divise par le coefficient (avec son signe).",
    eqfrac: "Multiplie chaque terme des deux membres par le dénominateur commun ; un « − » devant une fraction porte sur tout son numérateur.",
    eqspec: "Si les x disparaissent : égalité fausse → aucune solution ; égalité vraie → tous les nombres. x = 0 est une vraie solution.",
    formule: "La lettre cherchée est l'inconnue : on défait les opérations de l'extérieur vers l'intérieur, les mêmes des deux côtés.",
    probeq: "Choisis l'inconnue, traduis l'énoncé en équation, résous, puis vérifie la réponse dans l'énoncé.",
    eq2fact: "Ramène à « … = 0 », factorise, puis annule chaque facteur. Ne divise jamais par x.",
    eq2: "Un produit est nul si (et seulement si) l'un de ses facteurs est nul — mais seulement avec 0 de l'autre côté.",
    eq2disc: "Δ = b² − 4ac ; Δ > 0 : x = (−b ± √Δ) / 2a ; Δ = 0 : x = −b / 2a ; Δ < 0 : aucune solution.",
    probeq2: "Pose l'inconnue, écris l'équation, ramène à ax² + bx + c = 0, résous et garde les solutions qui ont un sens.",
    eq3: "Mets x (ou x²) en évidence, factorise ce qui reste, puis annule chaque facteur.",
    bicarre: "Pose X = x², résous en X, puis reviens à x : x² = X donne ±√X si X ≥ 0, rien si X < 0.",
    eqirr: "Isole la racine, élève au carré, résous, puis vérifie chaque solution dans l'équation de départ.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    eq1: ["Résoudre une équation du 1er degré", "Résoudre avec parenthèses, décimaux, développements", "Résoudre avec des lettres ou un paramètre"],
    eqfrac: ["Résoudre avec une fraction simple", "Résoudre avec deux fractions, produit en croix", "Résoudre avec plusieurs numérateurs"],
    eqspec: ["Reconnaître aucune solution, tous les nombres, x = 0", "Cas particuliers avec parenthèses", "Choisir un paramètre"],
    formule: ["Transformer une formule simple", "Transformer une formule en deux étapes", "Transformer une formule avec carré ou inverse"],
    probeq: ["Mettre en équation un problème simple", "Mettre en équation (pourcentages, fractions)", "Mettre en équation un problème en plusieurs étapes"],
    eq2fact: ["Résoudre x² = a et x² = kx", "Résoudre par mise en évidence ou trinôme", "Résoudre en factorisant au maximum"],
    eq2: ["Utiliser le produit nul", "Produit nul à trois facteurs", "Ramener à un produit nul"],
    eq2disc: ["Calculer Δ et résoudre", "Résoudre avec a ≠ 1 ou Δ = 0", "Racines irrationnelles, paramètre, Viète"],
    probeq2: ["Problème du 2e degré simple", "Problème du 2e degré (géométrie, mouvement)", "Problème du 2e degré en plusieurs étapes"],
    eq3: ["Résoudre par mise en évidence", "Mise en évidence et trinôme", "Groupements et racines"],
    bicarre: ["Résoudre une bicarrée simple", "Bicarrée avec valeurs de X négatives", "Bicarrée avec racines ou substitution"],
    eqirr: ["Résoudre √(…) = nombre", "Rejeter une solution parasite", "Isoler, élever au carré deux fois"],
  });
})();
