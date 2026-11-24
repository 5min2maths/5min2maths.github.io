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
  const ASK = " Donne toutes les solutions, séparées par « ; » (« aucune » s'il n'y en a pas).";
  const ASKS = " Écris les solutions séparées par « ; », « aucune » s'il n'y en a pas, « tous » si tout nombre est solution.";
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
      () => { let a, c; do { a = R.int(2, 7); c = R.int(2, 6); } while (a === c); const b = R.int(1, 9), d = R.int(1, 9), s = nz(-8, 8), e = a * (s + b) - c * (s - d);
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
        const s = nz(-7, 7), e = (a + b - c - d) * s + a * b - c * d; if (e === 0) return EQ1[2][2]();
        const k = a + b - c - d;
        return Qv("Résous : " + M("(" + L(1, a) + ")(" + L(1, b) + ") = (" + L(1, c) + ")(" + L(1, d) + ")" + sgn(e)) + ".", s, "On développe : " + M(T2(1, a + b, a * b) + " = " + T2(1, c + d, c * d + e)) + ". Les " + M("x^2") + " s'éliminent : " + M(L(k, 0) + " = " + (c * d + e - a * b)) + ", donc " + M("x = " + s) + ".",
          { ctx: "carres-elimines",
            guide: [GS("Développe le membre de gauche : coefficient de " + M("x") + " ?", a + b, M("(" + L(1, a) + ")(" + L(1, b) + ") = " + T2(1, a + b, a * b)) + "."), GS("Développe à droite (sans oublier " + M(e) + "), puis soustrais " + M("x^2") + " des deux côtés : " + M(L(k, 0) + " = \\ ?"), c * d + e - a * b, M(T2(1, c + d, c * d + e)) + " ; il reste " + M(L(k, 0) + " = " + (c * d + e - a * b)) + "."), GS(M("x = \\ ?"), s, M("x = " + s) + " : l'équation avait l'air du 2e degré, mais elle est du 1er degré.")],
            traps: [TV((c * d - a * b) / k, "N'oublie pas le terme " + M(e) + " du membre de droite.")] }); },
      () => { let a, c; do { a = R.int(3, 9); c = R.int(1, 8); } while (a <= c); const s = nz(-6, 9), b = nz(-9, 9), d = (a - c) * s + b, w = pk(WHO), wrong = (d + b) / (a - c);
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
        return Qv("La somme de " + k + " nombres " + (even ? "pairs" : "entiers") + " consécutifs vaut " + M(S) + ". Quel est le plus petit ?", n, "Avec " + M("n") + " le plus petit : " + M(Array.from({ length: k }, (_, i) => (i ? "(n + " + st * i + ")" : "n")).join(" + ") + " = " + k + "n + " + cst + " = " + S) + ", donc " + M(k + "n = " + (S - cst)) + " et " + M("n = " + n) + ".",
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
        return Qv(what[0] + " en " + n + " jours : en tout " + T + " " + what[1] + ". Chaque jour, " + (what[2] === "lit" ? "il lit" : what[2] === "parcourt" ? "elle parcourt" : "il range") + " " + d + " " + what[1] + " de plus que la veille. Combien le premier jour ?", x, M(Array.from({ length: n }, (_, i) => (i ? "(x + " + d * i + ")" : "x")).join(" + ") + " = " + n + "x + " + (d * n * (n - 1)) / 2 + " = " + T) + ", donc " + M(n + "x = " + (T - (d * n * (n - 1)) / 2)) + " et " + M("x = " + x) + ".",
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
    eq1: [() => { const h1 = pk([24, 30, 36]), a = pk([3, 4, 6]), b = pk([1, 1.5, 2]), t = pk([4, 5, 6]), h2 = h1 - (a - b) * t; if (h2 <= 0 || h2 >= h1) return PROBS.eq1[0]();
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

// Chantier 1re Collège · fin du chapitre équations et systèmes (18.11, choix de l'utilisateur) : une seule source pour
// sys2, sysprob, sysgraph, sys3, affine, affzero, sysineq, ineq (20.11). Même standard que ch1c_eq.js : au moins 3 formes par niveau,
// pas à pas sur toutes les questions, erreurs typiques (pièges { spec, m } pour les couples, inégalités et intervalles),
// étiquette ctx ; défis en plusieurs étapes. Réponses : couple « x ; y » (pair), triplet, nombre, expression, inégalité
// « x > 3 », intervalle ou « aucune » (solset).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(6)); const n = Math.round(v * d); return n + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(4)).replace(".", "{,}"); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pT = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const N = (v) => { let [i, f] = String(+(+v).toFixed(6)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const term = (c, v, first) => (c === 0 ? "" : (first ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + ") + (Math.abs(c) === 1 ? "" : fT(Math.abs(c))) + v);
  const lhs = (cs, vs = ["x", "y", "z"]) => { let s = "", f = true; cs.forEach((c, i) => { if (c) { s += term(c, vs[i], f); f = false; } }); return s || "0"; };
  const lin = (a, b) => (a === 0 ? fT(b) : term(a, "x", true) + (b ? (b < 0 ? " - " : " + ") + fT(Math.abs(b)) : ""));
  const linP = (a, b) => (a === 0 ? fS(b) : (a === 1 ? "" : a === -1 ? "-" : fS(a) + "*") + "x" + (b ? (b < 0 ? "-" : "+") + fS(Math.abs(b)) : ""));
  const sys = (...rows) => M("\\begin{cases} " + rows.join(" \\\\ ") + " \\end{cases}");
  const pairS = (vals) => vals.map(fS).join(" ; ");
  const pairT = (vals) => M("(" + vals.map(fT).join(" \\,;\\, ") + ")");
  const same = (A, B) => A.length === B.length && A.every((v, i) => Math.abs(v - B[i]) < 1e-9);
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { const c = tr.spec.kind === "pair" ? pairS(tr.spec.values) : tr.spec.kind === "ineq" ? "x " + tr.spec.op + " " + fS(tr.spec.value) : SolSet.show(tr.spec.ivs, false);
      // piège relisible, différent de la réponse, sans doublon (18.11)
      try { if (seen.has(c) || tr.spec.kind !== spec.kind || (tr.spec.kind === "pair" && !tr.spec.values.every(isFinite)) || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status !== "wrong") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: pairS(vals) }, o));
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({}, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const QI = (q, op, value, sol, o) => mk(q, { kind: "ineq", op, value }, sol, Object.assign({ canon: "x " + op + " " + fS(value) }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GI = (ask, op, value, sol) => ({ ask, spec: { kind: "ineq", op, value }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TI = (op, value, m) => ({ spec: { kind: "ineq", op, value }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TX = (e, m) => ({ e, m });
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const PAIR = " Réponds « x ; y ».";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);

  // ===================== sys2 : systèmes de deux équations =====================
  const SYS2 = {
    1: [
      () => { const x = nz(-6, 7), y = nz(-6, 7), a = nz(-4, 4), b = y - a * x, c = nz(-4, 5), e = nz(-3, 4), r = c * x + e * y;
        if (Math.abs(a) === 1 && b === 0) return null;
        return QP("Résous par substitution : " + sys("y = " + lin(a, b), lhs([c, e]) + " = " + r) + "." + PAIR, [x, y],
          "On remplace " + M("y") + " dans la 2e équation : " + M(lhs([c]) + (e < 0 ? " - " : " + ") + (Math.abs(e) === 1 ? "" : Math.abs(e)) + "(" + lin(a, b) + ") = " + r) + ", donc " + M((c + e * a) + "x = " + (r - e * b)) + ", " + M("x = " + x) + " ; puis " + M("y = " + y) + ".",
          { ctx: "subst", guide: [GN("On remplace " + M("y") + " par " + M(lin(a, b)) + " dans la 2e équation. On obtient une équation en " + M("x") + " : " + M((c + e * a) + "x = " + (r - e * b)) + ". Que vaut " + M("x") + " ?", x, M("x = " + x) + "."), GN("Puis " + M("y = " + lin(a, b)) + " avec " + M("x = " + x) + " : " + M("y") + " = ?", y, M("y = " + y) + "."), GP("La solution (« x ; y ») ?", [x, y], pairT([x, y]) + ".")],
            traps: [TP([y, x], "x d'abord, puis y."), TP([x, a * x - b], "Attention au signe de l'ordonnée à l'origine en calculant y.")] }); },
      () => { const x = nz(-5, 9), y = nz(-5, 9), s = x + y, t = x - y; if (s === 0 || t === 0) return null;
        return QP("Résous par combinaison (addition) : " + sys("x + y = " + s, "x - y = " + t) + "." + PAIR, [x, y], "En additionnant : " + M("2x = " + (s + t)) + ", " + M("x = " + x) + ". Puis " + M("y = " + s + " - " + pT(x) + " = " + y) + ".",
          { ctx: "addition", guide: [GN("Additionne les deux équations : les " + M("y") + " disparaissent. " + M("2x") + " = ?", 2 * x, M("2x = " + s + " + " + pT(t) + " = " + 2 * x) + "."), GN(M("x") + " = ?", x, M("x = " + x) + "."), GP("Avec " + M("x + y = " + s) + " : solution « x ; y » ?", [x, y], pairT([x, y]) + ".")],
            traps: [TP([y, x], "x d'abord, puis y."), TP([x, -y], "Vérifie dans la 2e équation : " + M("x - y = " + t) + ".")] }); },
      () => { const pa = pk([12, 15, 14, 18]), pe = pk([6, 8, 9, 10]), [n1, m1, n2, m2] = pk([[2, 3, 1, 1], [1, 2, 1, 1], [3, 2, 1, 1], [2, 1, 1, 1]]);
        if (pa === pe) return null;
        const x = pk([
          [`Au cinéma, ${n1} adulte${n1 > 1 ? "s" : ""} et ${m1} enfant${m1 > 1 ? "s" : ""} paient ${n1 * pa + m1 * pe} CHF ; ${n2} adulte et ${m2} enfant paient ${n2 * pa + m2 * pe} CHF. Quel est le prix d'un billet adulte, puis d'un billet enfant ?`, "cinema"],
          [`À la piscine, ${n1} entrée${n1 > 1 ? "s" : ""} adulte et ${m1} entrée${m1 > 1 ? "s" : ""} enfant coûtent ${n1 * pa + m1 * pe} CHF ; ${n2} adulte et ${m2} enfant, ${n2 * pa + m2 * pe} CHF. Prix d'une entrée adulte, puis enfant ?`, "piscine"]]);
        return QP(x[0] + " Réponds « adulte ; enfant ».", [pa, pe], "Avec " + M("a") + " et " + M("e") + " : " + sys(lhs([n1, m1], ["a", "e"]) + " = " + (n1 * pa + m1 * pe), "a + e = " + (pa + pe)) + ". On remplace " + M("e = " + (pa + pe) + " - a") + " : " + M("a = " + pa) + ", " + M("e = " + pe) + ".",
          { ctx: x[1], guide: [GN("Avec " + M("a") + " (adulte) et " + M("e") + " (enfant), la 2e information donne " + M("a + e") + " = ?", pa + pe, M("a + e = " + (pa + pe)) + "."), GN("Dans la 1re, remplace " + M("e") + " par " + M((pa + pe) + " - a") + " : " + M("a") + " = ?", pa, M("a = " + pa) + " CHF."), GP("Réponse « adulte ; enfant » ?", [pa, pe], pa + " CHF et " + pe + " CHF.")],
            traps: [TP([pe, pa], "Dans l'ordre demandé : adulte d'abord.")] }); },
    ],
    2: [
      () => { let a, b, c, e; const x = nz(-6, 7), y = nz(-6, 7); do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); e = nz(-6, 6); } while (a * e - b * c === 0 || [a, b, c, e].filter((v) => Math.abs(v) === 1).length > 1);
        const r1 = a * x + b * y, r2 = c * x + e * y, k = a * e - b * c;
        return QP("Résous " + sys(lhs([a, b]) + " = " + r1, lhs([c, e]) + " = " + r2) + "." + PAIR, [x, y], "On multiplie la 1re par " + M(pT(e)) + ", la 2e par " + M(pT(b)) + " et on soustrait : " + M(k + "x = " + (r1 * e - r2 * b)) + ", " + M("x = " + x) + " ; puis " + M("y = " + y) + ".",
          { ctx: "combin", guide: [GN("Pour éliminer " + M("y") + " : 1re × " + pT(e) + " moins 2e × " + pT(b) + ". On obtient " + M(k + "x = " + (r1 * e - r2 * b)) + ". Que vaut " + M("x") + " ?", x, M("x = " + x) + "."), GN("Remplace dans la 1re : " + M("y") + " = ?", y, M("y = " + y) + "."), GP("Solution « x ; y » ?", [x, y], pairT([x, y]) + ". Vérifie dans les deux équations.")],
            traps: [TP([y, x], "x d'abord, puis y."), TP([-x, -y], "Les signes sont inversés : vérifie la soustraction des équations.")] }); },
      () => { let a, b, c, e; const X = pk([-7, -5, -3, -1, 1, 3, 5, 7]) / 2, Y = nz(-5, 5); do { a = 2 * nz(-3, 3); b = nz(-5, 5); c = 2 * nz(-3, 3); e = nz(-5, 5); } while (a * e - b * c === 0);
        const r1 = a * X + b * Y, r2 = c * X + e * Y;
        return QP("Résous " + sys(lhs([a, b]) + " = " + fT(r1), lhs([c, e]) + " = " + fT(r2)) + ". Réponds « x ; y » (fractions acceptées).", [X, Y], "Par combinaison : " + M("x = " + fT(X)) + " et " + M("y = " + Y) + ".",
          { ctx: "fraction", guide: [GN("Élimine " + M("x") + " : 1re × " + pT(c) + " moins 2e × " + pT(a) + " donne " + M((b * c - e * a) + "y = " + fT(r1 * c - r2 * a)) + ". " + M("y") + " = ?", Y, M("y = " + Y) + "."), GN("Remplace : " + M("x") + " = ? (fraction)", X, M("x = " + fT(X)) + "."), GP("Solution « x ; y » ?", [X, Y], pairT([X, Y]) + ".")],
            traps: [TP([Math.round(X), Y], "La valeur de x n'est pas entière : garde la fraction " + M(fT(X)) + ".")] }); },
      () => { const x = nz(-4, 6), y = nz(-4, 6), a = R.int(2, 5), k = R.int(2, 3), b = R.int(1, 4), c = R.int(2, 4);
        // a x = b y + r1  et  k(x + y) = r2 + c·y  (à réordonner)
        const r1 = a * x - b * y, r2 = k * (x + y) - c * y;
        return QP("Résous " + sys(a + "x = " + term(b, "y", true) + (r1 ? (r1 < 0 ? " - " : " + ") + Math.abs(r1) : ""), k + "(x + y) = " + r2 + (c ? " + " + term(c, "y", true) : "")) + " (commence par ordonner chaque équation)." + PAIR, [x, y],
          "Ordonné : " + sys(lhs([a, -b]) + " = " + r1, lhs([k, k - c]) + " = " + r2) + ", puis combinaison : " + pairT([x, y]) + ".",
          { ctx: "ordonner", guide: [GX("Écris la 1re sous la forme « ax + by = c » : le membre de gauche ?", linP(a, 0).replace("x", "x") + "-" + b + "*y", M(lhs([a, -b]) + " = " + r1) + "."), GN("Après avoir ordonné la 2e (" + M(lhs([k, k - c]) + " = " + r2) + ") et combiné, que vaut " + M("x") + " ?", x, M("x = " + x) + "."), GP("Solution « x ; y » ?", [x, y], pairT([x, y]) + ".")],
            traps: [TP([y, x], "x d'abord."), TP([x, -y], "En faisant passer " + M(b + "y") + " à gauche, il change de signe.")] }); },
    ],
    3: [
      () => { const x = 6 * nz(-3, 3), y = 4 * nz(-3, 3), A = x / 2 + y / 4, B = x / 3 - y / 2;
        return QP("Résous " + sys("\\frac{x}{2} + \\frac{y}{4} = " + fT(A), "\\frac{x}{3} - \\frac{y}{2} = " + fT(B)) + "." + PAIR, [x, y], "On multiplie par 4 et par 6 : " + sys("2x + y = " + 4 * A, "2x - 3y = " + 6 * B) + " ; on soustrait : " + M("4y = " + (4 * A - 6 * B)) + ", " + M("y = " + y) + ", puis " + M("x = " + x) + ".",
          { ctx: "fracsys", guide: [GN("Multiplie la 1re par 4 : " + M("2x + y = ?") + " (membre de droite)", 4 * A, M("2x + y = " + 4 * A) + "."), GN("Multiplie la 2e par 6 : " + M("2x - 3y = ?"), 6 * B, M("2x - 3y = " + 6 * B) + "."), GN("Soustrais : " + M("4y = " + (4 * A - 6 * B)) + ". " + M("y") + " = ?", y, M("y = " + y) + "."), GP("Solution « x ; y » ?", [x, y], pairT([x, y]) + ".")],
            traps: [TP([y, x], "x d'abord."), TP([x / 2, y], "Tu as gardé une fraction : vérifie x dans la 1re équation.")] }); },
      () => { let x1, y1, x2, y2; do { x1 = R.int(-4, 3); x2 = x1 + R.int(1, 5); const a = nz(-3, 3) * (R.rand() < 0.3 ? 0.5 : 1), b = R.int(-5, 5); y1 = a * x1 + b; y2 = a * x2 + b; } while (!Number.isInteger(y1) || !Number.isInteger(y2) || y1 === y2);
        const a = (y2 - y1) / (x2 - x1), b = y1 - a * x1;
        return QP("Trouve " + M("a") + " et " + M("b") + " pour que la droite " + M("y = ax + b") + " passe par " + M("A(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + ". Réponds « a ; b ».", [a, b],
          "Système " + sys(pT(x1) + "a + b = " + y1, pT(x2) + "a + b = " + y2) + " ; on soustrait : " + M((x2 - x1) + "a = " + (y2 - y1)) + ", " + M("a = " + fT(a)) + ", puis " + M("b = " + fT(b)) + ".",
          { ctx: "droite", guide: [GN("En remplaçant les deux points, on soustrait les équations : " + M((x2 - x1) + "a = " + (y2 - y1)) + ". " + M("a") + " = ?", a, M("a = " + fT(a)) + "."), GN("Puis " + M("b = " + y1 + " - " + pT(a) + " \\cdot " + pT(x1)) + " = ?", b, M("b = " + fT(b)) + "."), GP("Réponse « a ; b » ?", [a, b], M("y = " + lin(a, b)) + ".")],
            traps: [TP([b, a], "a (la pente) d'abord, puis b."), TP([(x2 - x1) / (y2 - y1), b], "La pente est (différence des y) ÷ (différence des x).")] }); },
      () => { const pf = pk([8, 9, 10, 12]), ab = pk([40, 50, 60, 80]), n1 = R.int(4, 9), n2 = n1 + R.int(3, 8);
        return QP("Un club de sport facture un abonnement fixe plus un prix par séance. " + who() + " a payé " + (ab + pf * n1) + " CHF pour " + n1 + " séances ; une amie a payé " + (ab + pf * n2) + " CHF pour " + n2 + " séances. Quel est le prix d'une séance, puis celui de l'abonnement ? Réponds « séance ; abonnement ».", [pf, ab],
          "Avec " + M("s") + " et " + M("f") + " : " + sys(n1 + "s + f = " + (ab + pf * n1), n2 + "s + f = " + (ab + pf * n2)) + ". On soustrait : " + M((n2 - n1) + "s = " + pf * (n2 - n1)) + ", " + M("s = " + pf) + ", puis " + M("f = " + ab) + ".",
          { ctx: "abonnement", guide: [GN("La différence de prix correspond à " + (n2 - n1) + " séances : combien coûte une séance ?", pf, M((pf * (n2 - n1)) + " : " + (n2 - n1) + " = " + pf) + " CHF."), GN("Abonnement : " + M((ab + pf * n1) + " - " + n1 + " \\cdot " + pf) + " = ?", ab, M(ab) + " CHF."), GP("Réponse « séance ; abonnement » ?", [pf, ab], pf + " CHF et " + ab + " CHF.")],
            traps: [TP([ab, pf], "Dans l'ordre demandé : la séance d'abord."), TP([(ab + pf * n1) / n1, 0], "Il y a un abonnement fixe : le prix n'est pas proportionnel au nombre de séances.")] }); },
    ],
  };
  const GN = (ask, value, sol) => GS(ask, value, sol);

  // ===================== sysprob : problèmes à deux inconnues =====================
  const SPROB = {
    1: [
      () => { const a = R.int(10, 16), d = R.int(2, 9), b = a + d, w1 = who();
        return QP(w1 + " et sa sœur ont ensemble " + (a + b) + " ans. La sœur a " + d + " ans de plus. Quel âge a " + w1 + ", puis sa sœur ? Réponds « " + w1 + " ; sœur ».", [a, b], sys("x + y = " + (a + b), "y = x + " + d) + " : " + M("2x + " + d + " = " + (a + b)) + ", " + M("x = " + a) + ", " + M("y = " + b) + ".",
          { ctx: "ages", guide: [GN("Avec " + M("x") + " (" + w1 + ") et " + M("y = x + " + d) + " : " + M("2x + " + d + " = " + (a + b)) + ". " + M("x") + " = ?", a, M("x = " + a) + "."), GP("Réponse « " + w1 + " ; sœur » ?", [a, b], a + " ans et " + b + " ans.")],
            traps: [TP([(a + b) / 2, (a + b) / 2], "Ils n'ont pas le même âge : la sœur a " + d + " ans de plus."), TP([b, a], "Dans l'ordre demandé.")] }); },
      () => { const n10 = R.int(3, 12), n20 = R.int(2, 10), n = n10 + n20, s = 10 * n10 + 20 * n20;
        return QP("Dans une caisse, il y a " + n + " billets de 10 CHF et de 20 CHF, pour un total de " + s + " CHF. Combien y a-t-il de billets de 10, puis de 20 ? Réponds « billets de 10 ; billets de 20 ».", [n10, n20], sys("x + y = " + n, "10x + 20y = " + s) + " : " + M("10x + 20(" + n + " - x) = " + s) + ", " + M("x = " + n10) + ", " + M("y = " + n20) + ".",
          { ctx: "billets", guide: [GN("Si tous les billets étaient des 10 CHF, on aurait combien ?", 10 * n, M(10 * n) + " CHF."), GN("Chaque billet de 20 ajoute 10 CHF de plus. Combien de billets de 20 ?", n20, M("(" + s + " - " + 10 * n + ") : 10 = " + n20) + "."), GP("Réponse « 10 ; 20 » ?", [n10, n20], n10 + " et " + n20 + ".")],
            traps: [TP([n20, n10], "Dans l'ordre demandé : les billets de 10 d'abord.")] }); },
      () => { const L = R.int(8, 20), l = R.int(3, L - 2), p = 2 * (L + l), dd = L - l;
        return QP("Un rectangle a un périmètre de " + p + " cm. Sa longueur dépasse sa largeur de " + dd + " cm. Donne sa longueur, puis sa largeur (en cm). Réponds « longueur ; largeur ».", [L, l], sys("2L + 2\\ell = " + p, "L - \\ell = " + dd) + " : " + M("L + \\ell = " + (L + l)) + ", donc " + M("L = " + L) + ", " + M("\\ell = " + l) + ".",
          { ctx: "rectangle", guide: [GN("Le demi-périmètre " + M("L + \\ell") + " vaut ?", L + l, M(p + " : 2 = " + (L + l)) + "."), GN("Avec " + M("L - \\ell = " + dd) + ", en additionnant : " + M("2L") + " = ?", 2 * L, M(2 * L) + ", donc " + M("L = " + L) + "."), GP("Réponse « longueur ; largeur » ?", [L, l], L + " cm et " + l + " cm.")],
            traps: [TP([(p + dd) / 2, (p - dd) / 2], "Le périmètre compte deux longueurs et deux largeurs : divise d'abord par 2.")] }); },
    ],
    2: [
      () => { const [p1, p2] = pk([[18, 30], [24, 36], [20, 32], [16, 28]]), q1 = R.int(2, 8), q2 = R.int(2, 8), tot = q1 + q2, cost = p1 * q1 + p2 * q2;
        return QP("Un torréfacteur mélange un café à " + p1 + " CHF/kg et un café à " + p2 + " CHF/kg. Il obtient " + tot + " kg de mélange qui valent " + cost + " CHF en tout. Combien de kilos de chaque café ? Réponds « café à " + p1 + " ; café à " + p2 + " ».", [q1, q2],
          sys("x + y = " + tot, p1 + "x + " + p2 + "y = " + cost) + " : " + M(p1 + "x + " + p2 + "(" + tot + " - x) = " + cost) + ", " + M("x = " + q1) + ", " + M("y = " + q2) + ".",
          { ctx: "melange", guide: [GN("Si tout était du café à " + p1 + ", le mélange vaudrait ?", p1 * tot, M(p1 * tot) + " CHF."), GN("Chaque kilo du café cher ajoute " + (p2 - p1) + " CHF. Combien de kilos du café à " + p2 + " ?", q2, M("(" + cost + " - " + p1 * tot + ") : " + (p2 - p1) + " = " + q2) + "."), GP("Réponse ?", [q1, q2], q1 + " kg et " + q2 + " kg.")],
            traps: [TP([q2, q1], "Dans l'ordre demandé."), TP([tot / 2, tot / 2], "Ce n'est pas moitié-moitié : vérifie le prix total.")] }); },
      () => { const v = pk([12, 15, 18, 20]), c = pk([2, 3, 4]), d = pk([30, 36, 48, 60]), t1 = d / (v + c), t2 = d / (v - c);
        if (!Number.isInteger(t1 * 4) || !Number.isInteger(t2 * 4)) return null;
        return QP("Un bateau parcourt " + d + " km en descendant une rivière en " + M(N(t1)) + " h, et remonte la même distance en " + M(N(t2)) + " h. Quelle est la vitesse du bateau en eau calme, puis celle du courant (en km/h) ? Réponds « bateau ; courant ».", [v, c],
          "En descendant : " + M("v + c = " + d + " : " + N(t1) + " = " + (v + c)) + " ; en remontant : " + M("v - c = " + (v - c)) + ". Donc " + M("v = " + v) + " et " + M("c = " + c) + ".",
          { ctx: "courant", guide: [GN("Vitesse en descendant (" + M("v + c") + ") ?", v + c, M(d + " : " + N(t1) + " = " + (v + c)) + " km/h."), GN("Vitesse en remontant (" + M("v - c") + ") ?", v - c, M(v - c) + " km/h."), GP("Réponse « bateau ; courant » ?", [v, c], v + " km/h et " + c + " km/h.")],
            traps: [TP([c, v], "Dans l'ordre : le bateau d'abord."), TP([v + c, v - c], "Ce sont les vitesses en descendant et en remontant ; résous le système v + c = " + (v + c) + ", v − c = " + (v - c) + ".")] }); },
      () => { const t = R.int(1, 8), u = R.int(t + 1, 9), n = 10 * t + u, s = t + u, sw = 10 * u + t;
        return QN("Un nombre de deux chiffres a une somme des chiffres égale à " + s + ". Si on permute ses chiffres, on obtient un nombre plus grand de " + (sw - n) + ". Quel est ce nombre ?", n,
          "Avec dizaines " + M("d") + " et unités " + M("u") + " : " + sys("d + u = " + s, "(10u + d) - (10d + u) = " + (sw - n)) + ", soit " + M("u - d = " + (u - t)) + ". Donc " + M("u = " + u) + ", " + M("d = " + t) + " : le nombre est " + M(n) + ".",
          { ctx: "chiffres", guide: [GN("La permutation ajoute " + M("9(u - d)") + ". Combien vaut " + M("u - d") + " ?", u - t, M((sw - n) + " : 9 = " + (u - t)) + "."), GN("Avec " + M("u + d = " + s) + ", le chiffre des unités ?", u, M("u = " + u) + "."), GN("Le nombre ?", n, M(n) + ".")],
            traps: [{ v: sw, m: "C'est le nombre après permutation ; on demande le nombre de départ (plus petit)." }] }); },
    ],
    3: [
      () => { const c1 = pk([20, 30, 40]), c2 = pk([60, 70, 80]), V = pk([10, 20, 40]), x = R.int(1, V - 1), cm = (c1 * x + c2 * (V - x)) / V;
        if (!Number.isInteger(cm) || c1 === c2) return null;
        return QP("On mélange une solution de sirop à " + c1 + " % de sucre et une autre à " + c2 + " %, pour obtenir " + V + " L à " + cm + " %. Combien de litres de chaque solution ? Réponds « à " + c1 + " % ; à " + c2 + " % ».", [x, V - x],
          sys("x + y = " + V, "0{,}" + String(c1).slice(0, 1) + "x + 0{,}" + String(c2).slice(0, 1) + "y = " + N((cm * V) / 100)) + " : " + M("x = " + x) + " L et " + M("y = " + (V - x)) + " L.",
          { ctx: "concentration", guide: [GN("Quantité de sucre dans le mélange final (en L) ?", (cm * V) / 100, M(cm + "\\,\\% \\cdot " + V + " = " + N((cm * V) / 100)) + " L."), GN("Litres de la solution à " + c1 + " % ?", x, M("x = " + x) + " (en résolvant " + M("x + y = " + V) + ")."), GP("Réponse ?", [x, V - x], x + " L et " + (V - x) + " L.")],
            traps: [TP([V - x, x], "Dans l'ordre demandé."), TP([V / 2, V / 2], "Ce n'est pas moitié-moitié : la concentration finale n'est pas la moyenne.")] }); },
      () => { const va = pk([60, 80, 90]), vb = pk([40, 50, 70]), D = (va + vb) * pk([2, 3]), t = D / (va + vb);
        return QP("Deux trains partent en même temps de deux villes distantes de " + D + " km, l'un vers l'autre, à " + va + " km/h et " + vb + " km/h. Au bout de combien d'heures se croisent-ils, et à quelle distance de la ville du premier train (km) ? Réponds « heures ; km ».", [t, va * t],
          "Ils se rapprochent de " + M((va + vb) + " km/h") + " : " + M("t = " + D + " : " + (va + vb) + " = " + t) + " h ; le premier a parcouru " + M(va + " \\cdot " + t + " = " + va * t) + " km.",
          { ctx: "trains", guide: [GN("De combien de km se rapprochent-ils chaque heure ?", va + vb, M(va + " + " + vb + " = " + (va + vb)) + "."), GN("Après combien d'heures ?", t, M(t) + " h."), GP("Réponse « heures ; km » ?", [t, va * t], t + " h, à " + va * t + " km.")],
            traps: [TP([t, vb * t], "On demande la distance depuis la ville du premier train (" + va + " km/h).")] }); },
      () => { const pa = pk([3, 4, 5]), pb = pk([6, 7, 8]), na = R.int(5, 15), nb = R.int(5, 15), mon = pa * na + pb * nb, nt = na + nb;
        if (pa === pb) return null;
        return QP("Pour une fête, la classe achète " + nt + " boissons : des jus à " + pa + " CHF et des smoothies à " + pb + " CHF. Elle dépense exactement " + mon + " CHF. Combien de jus et de smoothies ? Réponds « jus ; smoothies ».", [na, nb],
          sys("j + s = " + nt, pa + "j + " + pb + "s = " + mon) + " : " + M("j = " + na) + ", " + M("s = " + nb) + ".",
          { ctx: "fete", guide: [GN("Si toutes les boissons étaient des jus, la dépense serait ?", pa * nt, M(pa * nt) + " CHF."), GN("Chaque smoothie coûte " + (pb - pa) + " CHF de plus. Combien de smoothies ?", nb, M("(" + mon + " - " + pa * nt + ") : " + (pb - pa) + " = " + nb) + "."), GP("Réponse « jus ; smoothies » ?", [na, nb], na + " et " + nb + ".")],
            traps: [TP([nb, na], "Dans l'ordre demandé : les jus d'abord.")] }); },
    ],
  };

  // ===================== sysgraph : systèmes et droites =====================
  const SGRAPH = {
    1: [
      () => { const x0 = R.int(-3, 3), y0 = R.int(-3, 3); let a, c; do { a = nz(-2, 2); c = nz(-2, 2); } while (a === c); const b = y0 - a * x0, d = y0 - c * x0;
        return QP("Le graphique montre les droites d'équations " + M("y = " + lin(a, b)) + " et " + M("y = " + lin(c, d)) + ". Lis la solution du système formé par ces deux équations." + PAIR, [x0, y0], "La solution est le point d'intersection " + pairT([x0, y0]) + " : on vérifie " + M(y0 + " = " + pT(a) + " \\cdot " + pT(x0) + (b < 0 ? " - " + -b : " + " + b)) + ".",
          { ctx: "lecture", fig: FIG.plot([{ f: (x) => a * x + b }, { f: (x) => c * x + d }], [], { numbers: true }), guide: [GN("Repère le point où les droites se coupent. Son abscisse ?", x0, M("x = " + x0) + "."), GP("Son ordonnée, puis la solution « x ; y » ?", [x0, y0], pairT([x0, y0]) + ".")],
            traps: [TP([y0, x0], "Un point s'écrit (abscisse ; ordonnée) : x d'abord."), TP([0, b], "C'est l'ordonnée à l'origine d'une droite, pas le point d'intersection.")] }); },
      () => { let a, b, c, d, x0; do { a = nz(-4, 4); c = nz(-4, 4); b = R.int(-6, 6); d = R.int(-6, 6); x0 = (d - b) / (a - c); } while (a === c || !Number.isInteger(x0));
        const y0 = a * x0 + b;
        return QP("Calcule le point d'intersection des droites " + M("y = " + lin(a, b)) + " et " + M("y = " + lin(c, d)) + "." + PAIR, [x0, y0], "On égalise : " + M(lin(a, b) + " = " + lin(c, d)) + ", " + M((a - c) + "x = " + (d - b)) + ", " + M("x = " + x0) + " ; " + M("y = " + y0) + ".",
          { ctx: "egaliser", guide: [GN("Au point commun, les deux " + M("y") + " sont égaux : " + M(lin(a, b) + " = " + lin(c, d)) + ". " + M("x") + " = ?", x0, M("x = " + x0) + "."), GN(M("y") + " = ?", y0, M("y = " + y0) + "."), GP("Point d'intersection « x ; y » ?", [x0, y0], pairT([x0, y0]) + ".")],
            traps: [TP([y0, x0], "x d'abord.")] }); },
      () => { const a = nz(-5, 5), b = R.int(-6, 6), c = b + nz(-5, 5);
        return QN("Pour quelle valeur de " + M("m") + " le système " + sys("y = " + lin(a, b), "2y = mx" + (2 * c < 0 ? " - " + -2 * c : " + " + 2 * c)) + " n'a-t-il aucune solution ?", 2 * a, "La 2e s'écrit " + M("y = \\frac{m}{2}x" + (c < 0 ? " - " + -c : " + " + c)) + ". Aucune solution : droites parallèles distinctes, même pente " + M("\\frac{m}{2} = " + a) + ", donc " + M("m = " + 2 * a) + ".",
          { ctx: "paralleles", guide: [GN("Divise la 2e équation par 2 : la pente de la 2e droite est " + M("\\frac{m}{2}") + ". Aucune solution veut dire droites parallèles : quelle pente doit-elle avoir ?", a, "La même que la 1re : " + M(a) + "."), GN(M("m") + " = ?", 2 * a, M("m = " + 2 * a) + ".")],
            traps: [{ v: a, m: "La pente de la 2e droite est m/2 (on divise par 2) : m vaut le double." }] }); },
    ],
    2: [
      () => { const a = R.int(2, 5), b = R.int(2, 6), k = R.int(2, 4), c = R.int(1, 9), d = k * c + nz(-4, 4);
        return QN("Pour quelle valeur de " + M("m") + " le système " + sys(a + "x + " + b + "y = " + c, k * a + "x + my = " + d) + " n'a-t-il aucune solution ?", k * b, "Les membres de gauche doivent être proportionnels (facteur " + M(k) + ") : " + M("m = " + k * b) + " ; les membres de droite ne le sont pas (" + M(d + " \\neq " + k * c) + "), donc aucune solution.",
          { ctx: "propor", guide: [GN("La 2e ligne a " + M(k * a + "x") + ", soit " + k + " fois " + M(a + "x") + ". Quel est le facteur ?", k, M(k) + "."), GN("Pour des droites parallèles, " + M("m") + " = ?", k * b, M(k + " \\cdot " + b + " = " + k * b) + ".")], traps: [{ v: b, m: "Les coefficients doivent être proportionnels : m = " + k + " · " + b + "." }] }); },
      () => { const a = R.int(2, 5), b = R.int(2, 6), k = R.int(2, 4), c = R.int(1, 9);
        return QN("Pour quelle valeur de " + M("m") + " le système " + sys(a + "x + " + b + "y = " + c, k * a + "x + " + k * b + "y = m") + " a-t-il une infinité de solutions ?", k * c, "Les deux équations doivent être proportionnelles (facteur " + M(k) + ") : " + M("m = " + k * c) + " ; les droites sont alors confondues.",
          { ctx: "confondues", guide: [GN("Facteur entre les deux membres de gauche ?", k, M(k) + "."), GN(M("m") + " = ?", k * c, M(k + " \\cdot " + c + " = " + k * c) + ".")], traps: [{ v: c, m: "Toute l'équation est multipliée par " + k + ", le membre de droite aussi." }] }); },
      () => { let a, b, c, d, x0; do { a = nz(-4, 4); c = nz(-4, 4); b = R.int(-6, 6); d = R.int(-6, 6); x0 = (d - b) / (a - c); } while (a === c || Number.isInteger(x0) || den(x0) > 6);
        const y0 = a * x0 + b;
        return QP("Calcule le point d'intersection des droites " + M("y = " + lin(a, b)) + " et " + M("y = " + lin(c, d)) + " (fractions acceptées)." + PAIR, [x0, y0], M((a - c) + "x = " + (d - b)) + ", " + M("x = " + fT(x0)) + ", " + M("y = " + fT(y0)) + ".",
          { ctx: "egaliser-frac", guide: [GN(M("x") + " = ? (fraction)", x0, M("x = " + fT(x0)) + "."), GN(M("y") + " = ? (fraction)", y0, M("y = " + fT(y0)) + "."), GP("Point « x ; y » ?", [x0, y0], pairT([x0, y0]) + ".")],
            traps: [TP([y0, x0], "x d'abord."), TP([Math.round(x0), Math.round(y0)], "Le point n'a pas des coordonnées entières : garde les fractions.")] }); },
    ],
    3: [
      () => { const a = R.int(2, 4), b = R.int(2, 5), c = R.int(1, 6);
        return QN("Pour quelle valeur de " + M("m") + " le système " + sys(a + "x + " + b + "y = " + c, "mx + " + 2 * b + "y = " + (c + 1)) + " n'a-t-il pas une seule solution ? (Pour toute autre valeur, il en a exactement une.)", 2 * a, "Pas de solution unique quand les droites sont parallèles : " + M("\\frac{m}{" + a + "} = \\frac{" + 2 * b + "}{" + b + "}") + ", donc " + M("m = " + 2 * a) + " (et alors aucune solution, car " + M((c + 1) + " \\neq " + 2 * c) + ").",
          { ctx: "unique", guide: [GN("Facteur entre les coefficients de " + M("y") + " ?", 2, M(2 * b + " : " + b + " = 2") + "."), GN(M("m") + " = ?", 2 * a, M("m = 2 \\cdot " + a + " = " + 2 * a) + ".")], traps: [{ v: a, m: "Le facteur entre les coefficients de y est 2 : m = 2 · " + a + "." }] }); },
      () => { const x0 = nz(-3, 3), y0 = nz(-3, 4); let a, c; do { a = nz(-3, 3); c = nz(-3, 3); } while (a === c); const b = y0 - a * x0, e = R.int(2, 4);
        return QN("Les droites " + M("y = " + lin(a, b)) + ", " + M("y = " + lin(c, y0 - c * x0)) + " et " + M("y = " + e + "x + k") + " passent par un même point. Que vaut " + M("k") + " ?", y0 - e * x0, "Intersection des deux premières : " + pairT([x0, y0]) + ". La 3e doit y passer : " + M(y0 + " = " + e + " \\cdot " + pT(x0) + " + k") + ", donc " + M("k = " + (y0 - e * x0)) + ".",
          { ctx: "concourantes", guide: [GN("Abscisse du point d'intersection des deux premières droites ?", x0, M("x = " + x0) + "."), GN("Son ordonnée ?", y0, M("y = " + y0) + "."), GN("La 3e passe par ce point : " + M("k") + " = ?", y0 - e * x0, M("k = " + y0 + " - " + e + " \\cdot " + pT(x0) + " = " + (y0 - e * x0)) + ".")],
            traps: [{ v: y0 + e * x0, m: "k = y − " + e + "x : attention au signe." }] }); },
      () => { const a = R.int(2, 4), b = nz(-4, 4), k = R.int(2, 3);
        return QN("Pour quelle valeur de " + M("m") + " le système " + sys("y = " + lin(a, b), k + "y - " + k * a + "x = m") + " a-t-il une infinité de solutions ?", k * b, "La 2e s'écrit " + M("y = " + a + "x + \\frac{m}{" + k + "}") + " : les droites sont confondues si " + M("\\frac{m}{" + k + "} = " + b) + ", donc " + M("m = " + k * b) + ".",
          { ctx: "confondues2", guide: [GN("Isole " + M("y") + " dans la 2e : son ordonnée à l'origine est " + M("\\frac{m}{" + k + "}") + ". Quelle valeur doit-elle avoir ?", b, M(b) + " (la même que la 1re)."), GN(M("m") + " = ?", k * b, M(k * b) + ".")], traps: [{ v: b, m: "C'est m/" + k + " qui vaut " + b + "." }] }); },
    ],
  };

  // ===================== sys3 : systèmes de trois équations =====================
  const tri = (vals) => vals.map(fS).join(" ; ");
  const QT = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: tri(vals) }, o));
  const GT = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const TT = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const row3 = (c, v) => lhs(c) + " = " + (c[0] * v[0] + c[1] * v[1] + c[2] * v[2]);
  const TRI = " Réponds « x ; y ; z ».";
  const SYS3 = {
    1: [
      () => { const v = [nz(-4, 5), nz(-4, 5), nz(-4, 5)], b = nz(-3, 3), c = nz(-3, 3);
        return QT("Résous " + sys(row3([1, 1, 1], v), row3([0, 1, b], v), row3([0, 0, c], v)) + "." + TRI, v, "On remonte : " + M("z = " + v[2]) + ", puis " + M("y = " + v[1]) + ", puis " + M("x = " + v[0]) + ".",
          { ctx: "triangle", guide: [GN("La 3e ligne donne " + M("z") + " = ?", v[2], M("z = " + v[2]) + "."), GN("La 2e donne " + M("y") + " = ?", v[1], M("y = " + v[1]) + "."), GN("La 1re donne " + M("x") + " = ?", v[0], M("x = " + v[0]) + "."), GT("Solution « x ; y ; z » ?", v, M("(" + v.join(" ; ") + ")") + ".")],
            traps: [TT([v[2], v[1], v[0]], "Dans l'ordre x, y, z.")] }); },
      () => { const v = [nz(-4, 6), nz(-4, 6), nz(-4, 6)];
        return QT("Résous " + sys(row3([1, 1, 1], v), row3([1, -1, 0], v), row3([0, 1, -1], v)) + "." + TRI, v, "De la 2e, " + M("x = y + " + pT(v[0] - v[1])) + " ; de la 3e, " + M("z = y - " + pT(v[1] - v[2])) + " ; dans la 1re : " + M("3y = " + (v[0] + v[1] + v[2] - (v[0] - v[1]) + (v[1] - v[2]))) + ", " + M("y = " + v[1]) + ".",
          { ctx: "chaine", guide: [GN("Exprime " + M("x") + " et " + M("z") + " en fonction de " + M("y") + ", remplace dans la 1re : " + M("y") + " = ?", v[1], M("y = " + v[1]) + "."), GN(M("x") + " = ?", v[0], M("x = " + v[0]) + "."), GT("Solution « x ; y ; z » ?", v, M("(" + v.join(" ; ") + ")") + ".")],
            traps: [TT([v[1], v[0], v[2]], "Dans l'ordre x, y, z.")] }); },
      () => { const a = R.int(10, 16), b = a + R.int(1, 4), c = b + R.int(1, 4), w = [who(), who(), who()];
        return QT("Trois frères et sœurs ont ensemble " + (a + b + c) + " ans. Le deuxième a " + (b - a) + " ans de plus que le plus jeune, et le troisième " + (c - b) + " ans de plus que le deuxième. Donne leurs âges, du plus jeune au plus âgé. Réponds « x ; y ; z ».", [a, b, c],
          "Avec " + M("x") + " : " + M("x + (x + " + (b - a) + ") + (x + " + (c - a) + ") = " + (a + b + c)) + ", " + M("3x = " + 3 * a) + ", " + M("x = " + a) + " : " + M(a + ", " + b + ", " + c) + ".",
          { ctx: "fratrie", guide: [GN("En exprimant tout avec l'âge " + M("x") + " du plus jeune : " + M("3x + " + (c - a + b - a) + " = " + (a + b + c)) + ". " + M("x") + " = ?", a, M("x = " + a) + "."), GT("Les trois âges « x ; y ; z » ?", [a, b, c], M(a + ", " + b + ", " + c) + ".")],
            traps: [TT([(a + b + c) / 3, (a + b + c) / 3, (a + b + c) / 3], "Ils n'ont pas le même âge.")] }); },
    ],
    2: [
      () => { const v = [nz(-4, 5), nz(-4, 5), nz(-4, 5)]; let m; const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        do m = [[1, R.int(-2, 2), R.int(-2, 2)], [R.int(1, 3), nz(-2, 3), R.int(-2, 2)], [R.int(-2, 3), R.int(-2, 2), nz(-3, 3)]]; while (det(m) === 0);
        return QT("Résous " + sys(row3(m[0], v), row3(m[1], v), row3(m[2], v)) + "." + TRI, v, "Par élimination (méthode de Gauss) : " + M("(" + v.join(" ; ") + ")") + ". Vérifie dans les trois équations.",
          { ctx: "gauss", guide: [GN("Élimine " + M("x") + " des lignes 2 et 3 avec la ligne 1, puis " + M("y") + " : tu obtiens " + M("z") + ". Que vaut " + M("z") + " ?", v[2], M("z = " + v[2]) + "."), GN("En remontant, " + M("y") + " = ?", v[1], M("y = " + v[1]) + "."), GN(M("x") + " = ?", v[0], M("x = " + v[0]) + "."), GT("Solution « x ; y ; z » ?", v, M("(" + v.join(" ; ") + ")") + ".")],
            traps: [TT([v[2], v[1], v[0]], "Dans l'ordre x, y, z.")] }); },
      () => { const v = [nz(-5, 5), nz(-5, 5), nz(-5, 5)];
        return QT("Résous " + sys(row3([1, 1, 0], v), row3([0, 1, 1], v), row3([1, 0, 1], v)) + " (astuce : additionne les trois équations)." + TRI, v, "En additionnant : " + M("2(x + y + z) = " + 2 * (v[0] + v[1] + v[2])) + ", donc " + M("x + y + z = " + (v[0] + v[1] + v[2])) + ". On retranche chaque ligne : " + M("z = " + v[2]) + ", " + M("x = " + v[0]) + ", " + M("y = " + v[1]) + ".",
          { ctx: "somme", guide: [GN("Additionne les trois lignes et divise par 2 : " + M("x + y + z") + " = ?", v[0] + v[1] + v[2], M(v[0] + v[1] + v[2]) + "."), GN("Retranche la 1re ligne (" + M("x + y") + ") : " + M("z") + " = ?", v[2], M("z = " + v[2]) + "."), GT("Solution « x ; y ; z » ?", v, M("(" + v.join(" ; ") + ")") + ".")],
            traps: [TT([v[1], v[2], v[0]], "Vérifie l'ordre x, y, z.")] }); },
      () => { const pc = pk([2, 3]), pj = pk([4, 5]), pg = pk([6, 7]), q = [[2, 1, 1], [1, 2, 1], [1, 1, 3]], v = [pc, pj, pg], t = q.map((r) => r[0] * pc + r[1] * pj + r[2] * pg);
        return QT("À la cafétéria : 2 cafés, 1 jus et 1 gâteau coûtent " + t[0] + " CHF ; 1 café, 2 jus et 1 gâteau, " + t[1] + " CHF ; 1 café, 1 jus et 3 gâteaux, " + t[2] + " CHF. Prix d'un café, d'un jus, d'un gâteau ? Réponds « café ; jus ; gâteau ».", v,
          sys("2c + j + g = " + t[0], "c + 2j + g = " + t[1], "c + j + 3g = " + t[2]) + " : " + M("c = " + pc) + ", " + M("j = " + pj) + ", " + M("g = " + pg) + ".",
          { ctx: "cafeteria", guide: [GN("1re moins 2e : " + M("c - j = " + (t[0] - t[1])) + ". Garde-le. 3e moins 2e : " + M("-j + 2g = " + (t[2] - t[1])) + ". En combinant avec la 1re, le prix du gâteau ?", pg, M("g = " + pg) + " CHF."), GN("Le jus ?", pj, M("j = " + pj) + " CHF."), GT("Réponse « café ; jus ; gâteau » ?", v, pc + ", " + pj + " et " + pg + " CHF.")],
            traps: [TT([pg, pj, pc], "Dans l'ordre demandé.")] }); },
    ],
    3: [
      () => { const a = nz(-2, 2), b = R.int(-4, 4), c = R.int(-4, 4), xs = [-1, 1, 2], ys = xs.map((x) => a * x * x + b * x + c);
        return QT("Trouve " + M("a") + ", " + M("b") + " et " + M("c") + " pour que la parabole " + M("y = ax^2 + bx + c") + " passe par " + xs.map((x, i) => M("(" + x + " \\,;\\, " + ys[i] + ")")).join(", ") + ". Réponds « a ; b ; c ».", [a, b, c],
          sys("a - b + c = " + ys[0], "a + b + c = " + ys[1], "4a + 2b + c = " + ys[2]) + " : 2e − 1re donne " + M("2b = " + (ys[1] - ys[0])) + ", etc. " + M("a = " + a) + ", " + M("b = " + b) + ", " + M("c = " + c) + ".",
          { ctx: "parabole", fig: FIG.plot([{ f: (x) => a * x * x + b * x + c }], xs.map((x, i) => [x, ys[i], ""]), { numbers: true, yr: [-8, 8], squash: 0.75 }), guide: [GN("En remplaçant les points, 2e ligne − 1re ligne donne " + M("2b = " + (ys[1] - ys[0])) + ". " + M("b") + " = ?", b, M("b = " + b) + "."), GN("Puis 3e − 2e : " + M("3a + b = " + (ys[2] - ys[1])) + ". " + M("a") + " = ?", a, M("a = " + a) + "."), GT("Réponse « a ; b ; c » ?", [a, b, c], M("y = " + (a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + (b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x" : "") + (c ? (c < 0 ? " - " : " + ") + Math.abs(c) : "")) + ".")],
            traps: [TT([c, b, a], "Dans l'ordre a, b, c.")] }); },
      () => { const v = [nz(-4, 4), nz(-4, 4), nz(-4, 4)]; let m; const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        do m = [0, 1, 2].map(() => [nz(-4, 4), nz(-4, 4), nz(-4, 4)]); while (det(m) === 0 || m.some((r) => r.every((x) => Math.abs(x) === 1)));
        return QT("Résous " + sys(row3(m[0], v), row3(m[1], v), row3(m[2], v)) + "." + TRI, v, "Par élimination : " + M("(" + v.join(" ; ") + ")") + ".",
          { ctx: "gauss3", guide: [GN("Après élimination de " + M("x") + " puis " + M("y") + ", que vaut " + M("z") + " ?", v[2], M("z = " + v[2]) + "."), GN(M("y") + " = ?", v[1], M("y = " + v[1]) + "."), GT("Solution « x ; y ; z » ?", v, M("(" + v.join(" ; ") + ")") + ".")],
            traps: [TT([v[2], v[1], v[0]], "Dans l'ordre x, y, z."), TT([-v[0], -v[1], -v[2]], "Tous les signes sont inversés : vérifie une équation.")] }); },
      () => { const n = [R.int(4, 10), R.int(3, 8), R.int(2, 6)], tot = n[0] + n[1] + n[2], pts = 1 * n[0] + 2 * n[1] + 3 * n[2], d = n[0] - n[2];
        return QT("Dans un match de basket, une équipe a marqué " + tot + " paniers (à 1, 2 et 3 points) pour " + pts + " points. Elle a réussi " + (d >= 0 ? d + " lancers francs (1 point) de plus que de paniers à 3 points" : -d + " paniers à 3 points de plus que de lancers francs") + ". Combien de paniers de chaque sorte ? Réponds « 1 pt ; 2 pts ; 3 pts ».", n,
          sys("u + d + t = " + tot, "u + 2d + 3t = " + pts, "u - t = " + d) + " : " + M("(" + n.join(" ; ") + ")") + ".",
          { ctx: "basket", guide: [GN("2e − 1re : " + M("d + 2t = " + (pts - tot)) + ". Avec " + M("u = t + " + pT(d)) + " dans la 1re : " + M("d + 2t = " + (tot - d)) + "... Combine : nombre de paniers à 3 points ?", n[2], M("t = " + n[2]) + "."), GT("Réponse « 1 ; 2 ; 3 » ?", n, M(n.join(", ")) + ".")],
            traps: [TT([n[2], n[1], n[0]], "Dans l'ordre : 1 point, 2 points, 3 points.")] }); },
    ],
  };

  // ===================== affine : fonctions affines =====================
  const AFF = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-9, 9), k = nz(-5, 6), v = a * k + b;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Calcule " + M("f(" + k + ")") + ".", v, M("f(" + k + ") = " + pT(a) + " \\cdot " + pT(k) + (b < 0 ? " - " + -b : " + " + b) + " = " + v) + ".",
          { ctx: "image", guide: [GN(M(pT(a) + " \\cdot " + pT(k)) + " = ?", a * k, M(a * k) + "."), GN("Ajoute " + M(b) + " : " + M("f(" + k + ")") + " = ?", v, M(v) + ".")], traps: [{ v: a + k + b, m: "On multiplie a par x : f(" + k + ") = " + a + " · " + k + (b < 0 ? " − " + -b : " + " + b) + "." }, { v: a * k - b, m: "Attention au signe de b." }] }); },
      () => { let x1, x2, a, b; do { x1 = R.int(-4, 4); x2 = R.int(-4, 5); a = nz(-4, 4) * (R.rand() < 0.3 ? 0.5 : 1); b = R.int(-5, 5); } while (x1 === x2 || !Number.isInteger(a * x1) || !Number.isInteger(a * x2));
        const y1 = a * x1 + b, y2 = a * x2 + b;
        return QN("Une fonction affine vérifie " + M("f(" + x1 + ") = " + y1) + " et " + M("f(" + x2 + ") = " + y2) + ". Calcule sa pente.", a, M("a = \\frac{" + y2 + " - " + pT(y1) + "}{" + x2 + " - " + pT(x1) + "} = \\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + fT(a)) + ".",
          { ctx: "pente", guide: [GN("Variation des images : " + M(y2 + " - " + pT(y1)) + " = ?", y2 - y1, M(y2 - y1) + "."), GN("Variation des " + M("x") + " : " + M(x2 + " - " + pT(x1)) + " = ?", x2 - x1, M(x2 - x1) + "."), GN("Pente (quotient) ?", a, M("a = " + fT(a)) + ".")],
            traps: [{ v: (x2 - x1) / (y2 - y1), m: "La pente est (différence des images) ÷ (différence des x), pas l'inverse." }, { v: -a, m: "Garde le même ordre en haut et en bas." }] }); },
      () => { const pc = pk([6, 7, 8]), pk_ = pk([2.5, 3, 3.5, 4]), k = R.int(4, 25), v = pc + pk_ * k, x = pk([["Un taxi facture " + pc + " CHF de prise en charge, puis " + N(pk_).replace("{,}", ",") + " CHF par kilomètre.", "taxi", "km"], ["Une location de vélo coûte " + pc + " CHF, plus " + N(pk_).replace("{,}", ",") + " CHF par heure.", "velo", "h"]]);
        return QN(x[0] + " Combien paie-t-on pour " + k + " " + x[2] + " ? (CHF)", v, M("f(x) = " + N(pk_) + "x + " + pc) + " ; " + M("f(" + k + ") = " + N(pk_) + " \\cdot " + k + " + " + pc + " = " + N(v)) + " CHF.",
          { ctx: x[1], guide: [GN("Partie variable : " + M(N(pk_) + " \\cdot " + k) + " = ?", pk_ * k, M(N(pk_ * k))), GN("Total avec la partie fixe ?", v, M(N(v)) + " CHF.")], traps: [{ v: pk_ * k, m: "N'oublie pas la partie fixe de " + pc + " CHF." }, { v: (pc + pk_) * k, m: "La partie fixe ne se paie qu'une fois." }] }); },
    ],
    2: [
      () => { let x1, x2, a, b; do { x1 = R.int(-4, 3); x2 = x1 + R.int(1, 5); a = nz(-4, 4); b = R.int(-6, 6); } while (b === 0 && R.rand() < 0.7);
        const y1 = a * x1 + b, y2 = a * x2 + b;
        return QX("Détermine l'expression de la fonction affine " + M("f") + " telle que " + M("f(" + x1 + ") = " + y1) + " et " + M("f(" + x2 + ") = " + y2) + ". Écris " + M("f(x)") + ".", linP(a, b), "Pente " + M("a = \\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + a) + " ; " + M("b = " + y1 + " - " + pT(a) + " \\cdot " + pT(x1) + " = " + b) + " : " + M("f(x) = " + lin(a, b)) + ".",
          { ctx: "expression", guide: [GN("Pente ?", a, M("a = " + a) + "."), GN("Ordonnée à l'origine " + M("b = f(" + x1 + ") - a \\cdot " + pT(x1)) + " = ?", b, M("b = " + b) + "."), GX(M("f(x)") + " = ?", linP(a, b), M("f(x) = " + lin(a, b)) + ".")],
            traps: [TX(linP(a, -b), "Attention au signe de b : b = f(x) − a·x."), TX(linP(b, a), "La pente multiplie x ; b est le terme constant.")] }); },
      () => { const a = nz(-5, 5), b = nz(-8, 8), x = nz(-6, 6), v = a * x + b;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Quel nombre a pour image " + M(v) + " ? (Résous " + M("f(x) = " + v) + ".)", x, M(lin(a, b) + " = " + v) + ", " + M(a + "x = " + (v - b)) + ", " + M("x = " + x) + ".",
          { ctx: "antecedent", guide: [GN(M(a + "x") + " = ? (on retire " + M(b) + ")", v - b, M(a + "x = " + (v - b)) + "."), GN(M("x") + " = ?", x, M("x = " + x) + ".")], traps: [{ v: a * v + b, m: "On cherche un antécédent (le x), pas l'image de " + v + "." }, { v: (v + b) / a, m: "Pour isoler ax, on soustrait b." }] }); },
      () => { const a = pk([-2, -1, 1, 2, 0.5, -0.5, 3]), b = R.int(-3, 3);
        return QN("Lis sur le graphique la pente de la droite.", a, "En avançant de " + (Number.isInteger(a) ? 1 : 2) + " vers la droite, la droite " + (a > 0 ? "monte" : "descend") + " de " + Math.abs(Number.isInteger(a) ? a : 2 * a) + " : " + M("a = " + fT(a)) + ".",
          { ctx: "graphe", fig: FIG.plot([{ f: (x) => a * x + b }], [[0, b, ""], [Number.isInteger(a) ? 1 : 2, b + (Number.isInteger(a) ? a : 2 * a), ""]], { numbers: true }), guide: [GN("Entre les deux points marqués, de combien avance-t-on horizontalement ?", Number.isInteger(a) ? 1 : 2, Number.isInteger(a) ? "De 1." : "De 2."), GN("Et de combien monte-t-on (négatif si on descend) ?", Number.isInteger(a) ? a : 2 * a, M(Number.isInteger(a) ? a : 2 * a) + "."), GN("Pente = montée ÷ avancée ?", a, M("a = " + fT(a)) + ".")],
            traps: [{ v: b, m: "C'est l'ordonnée à l'origine ; la pente se lit en avançant d'une unité." }, { v: -a, m: "La droite " + (a > 0 ? "monte" : "descend") + " : le signe de la pente est " + (a > 0 ? "positif" : "négatif") + "." }] }); },
    ],
    3: [
      () => { const a = nz(-4, 4), b0 = R.int(-5, 5), x0 = nz(-4, 4), y0 = R.int(-6, 6), b = y0 - a * x0;
        return QX("Écris l'expression de la fonction affine dont la droite est parallèle à celle de " + M("g(x) = " + lin(a, b0)) + " et passe par " + M("P(" + x0 + " \\,;\\, " + y0 + ")") + ".", linP(a, b), "Parallèle : même pente " + M(a) + ". " + M("b = " + y0 + " - " + pT(a) + " \\cdot " + pT(x0) + " = " + b) + " : " + M("f(x) = " + lin(a, b)) + ".",
          { ctx: "parallele", guide: [GN("Pente d'une droite parallèle ?", a, M(a) + " (la même)."), GN(M("b") + " = ?", b, M("b = " + b) + "."), GX(M("f(x)") + " = ?", linP(a, b), M("f(x) = " + lin(a, b)) + ".")], traps: [TX(linP(a, b0), "Cette droite est g elle-même : elle ne passe pas par P."), TX(linP(-1 / a, b), "Parallèle = même pente (pas la pente inverse).")] }); },
      () => { const fa = pk([5, 10, 15]), pa = pk([0.5, 0.4]), pb = pk([0.8, 0.9, 1]), x = fa / (pb - pa);
        if (!Number.isInteger(x)) return null;
        return QN("Forfait A : " + fa + " CHF par mois plus " + N(pa).replace("{,}", ",") + " CHF par minute. Forfait B : " + N(pb).replace("{,}", ",") + " CHF par minute, sans frais fixes. Pour combien de minutes les deux forfaits coûtent-ils la même chose ?", x, M(N(pa) + "x + " + fa + " = " + N(pb) + "x") + ", " + M(N(+(pb - pa).toFixed(2)) + "x = " + fa) + ", " + M("x = " + x) + " minutes.",
          { ctx: "forfaits", guide: [GN("On égalise : " + M(N(pa) + "x + " + fa + " = " + N(pb) + "x") + ". Coefficient de " + M("x") + " après regroupement ?", +(pb - pa).toFixed(2), M(N(+(pb - pa).toFixed(2))) + "."), GN(M("x") + " = ?", x, M(x) + " minutes.")], traps: [{ v: fa / pb, m: "Les deux forfaits ont une partie variable : regroupe les x." }] }); },
      () => { const c = pk([10, 25, 35, 40, -10, 20]), F = 1.8 * c + 32;
        return QN("Les températures en degrés Fahrenheit sont une fonction affine des degrés Celsius : " + M("0^\\circ\\text{C} = 32^\\circ\\text{F}") + " et " + M("100^\\circ\\text{C} = 212^\\circ\\text{F}") + ". Combien de degrés Fahrenheit font " + M(c + "^\\circ\\text{C}") + " ?", F, "Pente " + M("\\frac{212 - 32}{100} = 1{,}8") + " : " + M("F = 1{,}8C + 32") + ", donc " + M(N(F)) + " °F.",
          { ctx: "temperature", guide: [GN("Pente " + M("\\frac{212 - 32}{100 - 0}") + " = ?", 1.8, M("1{,}8") + "."), GN("Ordonnée à l'origine (valeur pour 0 °C) ?", 32, "32."), GN(M("F") + " pour " + c + " °C ?", F, M(N(F)) + " °F.")], traps: [{ v: 1.8 * c, m: "N'oublie pas l'ordonnée à l'origine 32." }, { v: (c - 32) / 1.8, m: "C'est la conversion inverse (de °F vers °C)." }] }); },
    ],
  };

  // ===================== affzero : zéro et signe =====================
  const AZ = {
    1: [
      () => { const a = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b = nz(-12, 12), z = -b / a;
        return QN("Détermine le zéro de " + M("f(x) = " + lin(a, b)) + " (fraction acceptée).", z, M(lin(a, b) + " = 0") + " donne " + M("x = " + fT(z)) + ".",
          { ctx: "zero", guide: [GN(M(a + "x") + " = ? (on retire " + M(b) + " des deux côtés)", -b, M(a + "x = " + -b) + "."), GN(M("x") + " = ?", z, M("x = " + fT(z)) + ".")], traps: [{ v: b, m: "Le zéro n'est pas b (l'ordonnée à l'origine) : résous f(x) = 0." }, { v: b / a, m: "Signe : ax = −b, donc x = −b/a." }] }); },
      () => { const v0 = pk([40, 50, 60]), r = pk([4, 5, 8, 10]), x = pk([["Un réservoir contient " + v0 + " L d'eau. Il se vide de " + r + " L par minute : il contient " + M("V(t) = " + v0 + " - " + r + "t") + " litres après " + M("t") + " minutes. Après combien de minutes est-il vide ?", "reservoir"], ["Une bougie mesure " + v0 + " mm et raccourcit de " + r + " mm par heure : " + M("h(t) = " + v0 + " - " + r + "t") + ". Après combien d'heures est-elle entièrement consumée ?", "bougie"]]);
        return QN(x[0], v0 / r, "On résout " + M(v0 + " - " + r + "t = 0") + " : " + M("t = " + fT(v0 / r)) + ".", { ctx: x[1], guide: [GN("On cherche le zéro : " + M(r + "t") + " = ?", v0, M(r + "t = " + v0) + "."), GN(M("t") + " = ?", v0 / r, M("t = " + fT(v0 / r)) + ".")], traps: [{ v: v0 * r, m: "On divise " + v0 + " par " + r + "." }] }); },
      () => { const a = R.int(2, 6), z = R.int(-6, 6);
        return QI("Soit " + M("f(x) = " + lin(a, -a * z)) + ". Pour quelles valeurs de " + M("x") + " a-t-on " + M("f(x) > 0") + " ? Réponds par exemple « x > 4 ».", ">", z, "Zéro : " + M(z) + ". Pente positive : " + M("f(x) > 0") + " pour " + M("x > " + z) + ".",
          { ctx: "signe+", guide: [GN("Zéro de " + M("f") + " ?", z, M("x = " + z) + "."), GI("La pente est positive (la droite monte). Où " + M("f(x) > 0") + " ? (« x > … » ou « x < … »)", ">", z, M("x > " + z) + ".")], traps: [TI("<", z, "La pente est positive : f est négative avant le zéro et positive après."), TI(">", -z, "Le zéro est " + z + ".")] }); },
    ],
    2: [
      () => { const a = -R.int(2, 6), z = R.int(-6, 6);
        return QI("Soit " + M("f(x) = " + lin(a, -a * z)) + ". Pour quelles valeurs de " + M("x") + " a-t-on " + M("f(x) > 0") + " ?", "<", z, "Zéro : " + M(z) + ". Pente négative : " + M("f") + " est positive avant le zéro : " + M("x < " + z) + ".",
          { ctx: "signe-", guide: [GN("Zéro ?", z, M(z) + "."), GI("La pente est négative (la droite descend). Où " + M("f(x) > 0") + " ?", "<", z, M("x < " + z) + ".")], traps: [TI(">", z, "La pente est négative : f est positive avant le zéro.")] }); },
      () => { const a = nz(-5, 5), z = R.int(-5, 5), op = pk([">=", "<="]), res = a > 0 ? op : op === ">=" ? "<=" : ">=";
        return QI("Résous " + M(lin(a, -a * z) + (op === ">=" ? " \\ge 0" : " \\le 0")) + ". Réponds par exemple « x >= 2 » ou « x <= -1 ».", res, z, M(a + "x " + (op === ">=" ? "\\ge" : "\\le") + " " + a * z) + (a < 0 ? " ; on divise par " + M(a) + " (négatif) : le sens change" : "") + " : " + M("x " + (res === ">=" ? "\\ge" : "\\le") + " " + z) + ".",
          { ctx: "large", guide: [GN("Zéro ?", z, M(z) + "."), GI("Solution (avec ≥ ou ≤) ?", res, z, M("x " + (res === ">=" ? "\\ge" : "\\le") + " " + z) + (a < 0 ? " (sens retourné : a < 0)." : "."))], traps: [TI(op, z, a < 0 ? "En divisant par un nombre négatif, on retourne le sens de l'inégalité." : "Vérifie le sens."), TI(res === ">=" ? ">" : "<", z, "Le zéro fait partie des solutions (≥ ou ≤) : inégalité large.")] }); },
      () => { const n = R.int(1, 9), d = pk([2, 3, 4, 5]), c = nz(-6, 6), z = -c * d / n;
        return QN("Détermine le zéro de " + M("f(x) = \\frac{" + n + "}{" + d + "}x" + (c < 0 ? " - " + -c : " + " + c)) + " (fraction acceptée).", z, M("\\frac{" + n + "}{" + d + "}x = " + -c) + ", " + M("x = " + -c + " \\cdot \\frac{" + d + "}{" + n + "} = " + fT(z)) + ".",
          { ctx: "zerofrac", guide: [GN(M("\\frac{" + n + "}{" + d + "}x") + " = ?", -c, M(-c) + "."), GN(M("x") + " = ? (on multiplie par l'inverse " + M("\\frac{" + d + "}{" + n + "}") + ")", z, M("x = " + fT(z)) + ".")], traps: [{ v: -c * n / d, m: "Pour isoler x, on multiplie par l'inverse " + d + "/" + n + "." }] }); },
    ],
    3: [
      () => { let a, b, c, e; do { a = nz(-5, 5); c = nz(-5, 5); b = R.int(-8, 8); e = R.int(-8, 8); } while (a === c || !Number.isInteger((e - b) / (a - c)));
        const z = (e - b) / (a - c), res = a - c > 0 ? ">" : "<";
        return QI("Pour quelles valeurs de " + M("x") + " a-t-on " + M("f(x) > g(x)") + ", avec " + M("f(x) = " + lin(a, b)) + " et " + M("g(x) = " + lin(c, e)) + " ?", res, z, M((a - c) + "x > " + (e - b)) + (a - c < 0 ? " ; on divise par un négatif, le sens change" : "") + " : " + M("x " + res + " " + z) + ".",
          { ctx: "fg", guide: [GN("Regroupe : " + M((a - c) + "x > " + (e - b)) + ". Valeur frontière ?", z, M(z) + "."), GI("Solution ?", res, z, M("x " + res + " " + z) + ".")], traps: [TI(res === ">" ? "<" : ">", z, "Attention au sens : si le coefficient de x est négatif, on retourne l'inégalité.")] }); },
      () => { const fa = pk([20, 30]), pa = pk([0.5, 1]), pb = pk([1.5, 2, 2.5]), x0 = fa / (pb - pa);
        if (!Number.isInteger(x0)) return null;
        return QI("Location de trottinette : formule A, " + fa + " CHF d'abonnement plus " + N(pa).replace("{,}", ",") + " CHF par trajet ; formule B, " + N(pb).replace("{,}", ",") + " CHF par trajet. Pour quels nombres de trajets " + M("x") + " la formule A est-elle moins chère ? Réponds « x > … ».", ">", x0,
          M(N(pa) + "x + " + fa + " < " + N(pb) + "x") + ", " + M(fa + " < " + N(+(pb - pa).toFixed(2)) + "x") + ", " + M("x > " + x0) + " trajets.",
          { ctx: "trottinette", guide: [GN("Nombre de trajets pour lequel les prix sont égaux ?", x0, M(x0) + "."), GI("Au-delà ou en deçà ? Solution ?", ">", x0, M("x > " + x0) + " : A devient avantageuse quand on roule beaucoup.")], traps: [TI("<", x0, "Avec peu de trajets, l'abonnement de A pèse : A est moins chère au-delà de " + x0 + " trajets.")] }); },
      () => { const a = R.int(2, 4), b = R.int(1, 5), c = R.int(2, 5), d = R.int(1, 5), coef = a - c, cst = -a * b - c * d; if (coef === 0) return null;
        const z = -cst / coef, res = coef > 0 ? "<=" : ">=";
        return QI("Résous " + M(a + "(x - " + b + ") - " + c + "(x + " + d + ") \\le 0") + ".", res, z, "On développe : " + M(lin(coef, cst) + " \\le 0") + ", donc " + M("x " + (res === "<=" ? "\\le" : "\\ge") + " " + fT(z)) + (coef < 0 ? " (on a divisé par un négatif)" : "") + ".",
          { ctx: "develop", guide: [GX("Développe et réduis le membre de gauche :", linP(coef, cst), M(lin(coef, cst)) + "."), GI("Solution ?", res, z, M("x " + (res === "<=" ? "\\le" : "\\ge") + " " + fT(z)) + ".")], traps: [TI(res === "<=" ? ">=" : "<=", z, "Vérifie le sens (division par un négatif ?)."), TI(res, -z, "Vérifie le signe de la valeur frontière.")] }); },
    ],
  };

  // ===================== sysineq : systèmes d'inéquations =====================
  const iv = (lo, li, hi, hi_) => [lo, li, hi, hi_];
  const andIv = (A, B) => { const lo = Math.max(A[0], B[0]), hi = Math.min(A[2], B[2]); const li = lo === A[0] && lo === B[0] ? A[1] && B[1] : lo === A[0] ? A[1] : B[1]; const hc = hi === A[2] && hi === B[2] ? A[3] && B[3] : hi === A[2] ? A[3] : B[3]; if (lo > hi || (lo === hi && !(li && hc))) return null; return [lo, li, hi, hc]; };
  const ivOp = (op, b) => (op === ">" ? iv(b, false, Infinity, false) : op === ">=" ? iv(b, true, Infinity, false) : op === "<" ? iv(-Infinity, false, b, false) : iv(-Infinity, false, b, true));
  const opT = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
  const flip = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };
  const ANS = " Donne l'ensemble des solutions (intervalle, ou « aucune »).";
  const SI = {
    1: [
      () => { const a = R.int(-5, 3), b = a + R.int(2, 7), o1 = pk([">", ">="]), o2 = pk(["<", "<="]), I = andIv(ivOp(o1, a), ivOp(o2, b));
        return QS("Résous le système " + sys("x " + opT[o1] + " " + a, "x " + opT[o2] + " " + b) + "." + ANS, [I], "Partie commune des deux conditions : " + M("S = " + SolSet.show([I])) + ".",
          { ctx: "direct", guide: [GSS("Les nombres qui vérifient les deux conditions (intervalle) ?", [I], M("S = " + SolSet.show([I])) + ".")].length ? [GN("Borne de gauche ?", a, M(a) + (o1 === ">=" ? " (comprise)." : " (exclue).")), GN("Borne de droite ?", b, M(b) + (o2 === "<=" ? " (comprise)." : " (exclue).")), GSS("Ensemble des solutions ?", [I], M("S = " + SolSet.show([I])) + ".")] : [],
            traps: [TS([iv(a, !I[1], b, !I[3])], "Crochets : « ≥ » et « ≤ » incluent la borne ([), « > » et « < » l'excluent (])."), TS([iv(-Infinity, false, Infinity, false)], "On garde seulement la partie commune.")] }); },
      () => { const a = R.int(1, 4), p = R.int(-3, 4), b = R.int(1, 5), q = p + R.int(2, 6), o1 = pk([">", ">="]), o2 = pk(["<", "<="]), I = andIv(ivOp(o1, p), ivOp(o2, q));
        return QS("Résous le système " + sys(lin(a, -a * p + 1) + " " + opT[o1] + " 1", "x + " + b + " " + opT[o2] + " " + (q + b)) + "." + ANS, [I], "1re ligne : " + M("x " + opT[o1] + " " + p) + " ; 2e : " + M("x " + opT[o2] + " " + q) + ". " + M("S = " + SolSet.show([I])) + ".",
          { ctx: "simple", guide: [GI("Résous la 1re inéquation :", o1, p, M("x " + opT[o1] + " " + p) + "."), GI("Résous la 2e :", o2, q, M("x " + opT[o2] + " " + q) + "."), GSS("Partie commune ?", [I], M("S = " + SolSet.show([I])) + ".")],
            traps: [TS([iv(q, o2 === "<=" ? true : false, Infinity, false)], "Ce n'est pas l'union : on garde les x qui vérifient les deux lignes.")] }); },
      () => { const a = R.int(-3, 4), b = a - R.int(1, 5);
        return QS("Résous le système " + sys("x > " + a, "x < " + b) + "." + ANS, [], "Il faudrait " + M("x > " + a) + " et " + M("x < " + b) + " avec " + M(b + " < " + a) + " : aucun nombre. " + M("S = \\varnothing") + ".",
          { ctx: "vide", guide: [GN("Le plus petit nombre possible (borne de la 1re) ?", a, M(a) + "."), GN("La borne de la 2e ?", b, M(b) + " : elle est plus petite que " + M(a) + "."), GSS("Ensemble des solutions (tape « aucune » s'il est vide) ?", [], M("S = \\varnothing") + ".")],
            traps: [TS([iv(b, false, a, false)], "Les deux conditions ne se chevauchent pas : il n'y a aucune solution.")] }); },
    ],
    2: [
      () => { const k1 = -R.int(2, 5), a = R.int(-4, 2), o1 = pk([">", ">="]), rs = flip[o1], b = R.int(a + 2, a + 8), o2 = pk(["<", "<="]), k2 = R.int(2, 4), I1 = ivOp(rs, a), I = andIv(I1, ivOp(o2, b)) || andIv(ivOp(o1, a), ivOp(o2, b));
        // 1re : k1·x o1 k1·a  →  x rs a (sens retourné)
        const Ireal = andIv(ivOp(rs, a), ivOp(o2, b));
        return QS("Résous le système " + sys(k1 + "x " + opT[o1] + " " + k1 * a, k2 + "x " + opT[o2] + " " + k2 * b) + "." + ANS, Ireal ? [Ireal] : [], "1re : on divise par " + M(k1) + " (négatif), le sens change : " + M("x " + opT[rs] + " " + a) + ". 2e : " + M("x " + opT[o2] + " " + b) + ". " + M("S = " + (Ireal ? SolSet.show([Ireal]) : "\\varnothing")) + ".",
          { ctx: "negatif", guide: [GI("1re ligne : on divise par " + M(k1) + ". Résultat ?", rs, a, M("x " + opT[rs] + " " + a) + " (sens retourné)."), GI("2e ligne ?", o2, b, M("x " + opT[o2] + " " + b) + "."), GSS("Partie commune ?", Ireal ? [Ireal] : [], M("S = " + (Ireal ? SolSet.show([Ireal]) : "\\varnothing")) + ".")],
            traps: [TS(I && andIv(ivOp(o1, a), ivOp(o2, b)) ? [andIv(ivOp(o1, a), ivOp(o2, b))] : [], "En divisant par un nombre négatif, on retourne le sens de l'inégalité.")] }); },
      () => { const a = R.int(2, 4), b = nz(-5, 5), lo = R.int(-4, 2), hi = lo + R.int(2, 6), ol = pk(["<", "<="]), oh = pk(["<", "<="]), I = iv(lo, ol === "<=", hi, oh === "<=");
        return QS("Résous " + M((a * lo + b) + " " + opT[ol] + " " + lin(a, b) + " " + opT[oh] + " " + (a * hi + b)) + "." + ANS, [I], "On soustrait " + M(b) + " partout, puis on divise par " + M(a) + " : " + M(lo + " " + opT[ol] + " x " + opT[oh] + " " + hi) + ", " + M("S = " + SolSet.show([I])) + ".",
          { ctx: "double", guide: [GN("On retire " + M(b) + " aux trois membres, puis on divise par " + M(a) + ". Borne de gauche ?", lo, M(lo) + "."), GN("Borne de droite ?", hi, M(hi) + "."), GSS("Ensemble des solutions ?", [I], M("S = " + SolSet.show([I])) + ".")],
            traps: [TS([iv(a * lo + b, ol === "<=", a * hi + b, oh === "<=")], "Il faut isoler x : retire " + b + " et divise par " + a + " dans les trois membres.")] }); },
      () => { const m0 = pk([4, 4.5]), notes = [pk([3.5, 4, 4.5]), pk([4, 5, 5.5])], s = notes[0] + notes[1], lo = 3 * m0 - s, I = andIv(ivOp(">=", lo), ivOp("<=", 6));
        if (lo > 6 || lo < 1) return null;
        return QS(who() + " a obtenu " + notes.map((n) => N(n).replace("{,}", ",")).join(" et ") + ". Quelles notes " + M("x") + " (entre 1 et 6) au 3e test lui donnent une moyenne d'au moins " + N(m0).replace("{,}", ",") + " ?" + ANS, [I], M("\\frac{" + N(s) + " + x}{3} \\ge " + N(m0)) + " donne " + M("x \\ge " + N(lo)) + " ; avec " + M("x \\le 6") + " : " + M("S = " + SolSet.show([I])) + ".",
          { ctx: "notes", guide: [GN("Il faut " + M(N(s) + " + x \\ge 3 \\cdot " + N(m0)) + ". Note minimale ?", lo, M("x \\ge " + N(lo)) + "."), GSS("Avec la note maximale 6, ensemble des solutions ?", [I], M("S = " + SolSet.show([I])) + ".")],
            traps: [TS([ivOp(">=", lo)], "La note ne peut pas dépasser 6 : ajoute la condition x ≤ 6.")] }); },
    ],
    3: [
      () => { const a = R.int(-6, 0), b = a + R.int(3, 6), c = R.int(a + 1, b - 1), I = andIv(andIv(ivOp(">", a), ivOp("<=", b)), ivOp(">=", c));
        return QS("Résous le système " + sys("2x - 1 > " + (2 * a - 1), "3 - x \\ge " + (3 - b), "x + 4 \\ge " + (c + 4)) + "." + ANS, [I], "Les trois lignes : " + M("x > " + a) + ", " + M("x \\le " + b) + " (sens retourné), " + M("x \\ge " + c) + ". " + M("S = " + SolSet.show([I])) + ".",
          { ctx: "trois", guide: [GI("1re ligne ?", ">", a, M("x > " + a) + "."), GI("2e ligne (attention au signe de x) ?", "<=", b, M("x \\le " + b) + "."), GI("3e ligne ?", ">=", c, M("x \\ge " + c) + "."), GSS("Partie commune ?", [I], M("S = " + SolSet.show([I])) + ".")],
            traps: [TS([andIv(ivOp(">", a), ivOp(">=", b)) || []].flat().length ? [andIv(ivOp(">", a), ivOp(">=", b))] : [], "Dans 3 − x ≥ …, on divise par −1 : le sens change.")] }); },
      () => { const d = pk([2, 3, 4]), lo = R.int(-3, 2), hi = lo + R.int(2, 5), I = iv(lo, false, hi, true);
        return QS("Résous le système " + sys("\\frac{x}{" + d + "} > " + fT(lo / d), "\\frac{x - " + hi + "}{2} \\le 0") + "." + ANS, [I], M("x > " + lo) + " et " + M("x \\le " + hi) + " : " + M("S = " + SolSet.show([I])) + ".",
          { ctx: "fractions", guide: [GI("1re ligne (multiplie par " + d + ") ?", ">", lo, M("x > " + lo) + "."), GI("2e ligne ?", "<=", hi, M("x \\le " + hi) + "."), GSS("Ensemble des solutions ?", [I], M("S = " + SolSet.show([I])) + ".")],
            traps: [TS([iv(lo / d, false, hi, true)], "Multiplie la 1re par " + d + " des deux côtés.")] }); },
      () => { const L = pk([40, 48, 50, 60]), w = pk([6, 8, 10]);
        if (L / 4 <= w) return null;
        return QS("Un rectangle a un périmètre de " + L + " cm et une largeur " + M("x") + ". On veut que la largeur dépasse " + w + " cm et que la longueur soit au moins égale à la largeur. Quelles valeurs de " + M("x") + " conviennent ?" + ANS, [iv(w, false, L / 4, true)].map((J) => andIv(J, ivOp(">", w)) || J),
          "Longueur " + M(L / 2 + " - x") + " ; " + M(L / 2 + " - x \\ge x") + " donne " + M("x \\le " + N(L / 4)) + ". Avec " + M("x > " + w) + " : " + M("S = \\,]" + w + " \\,;\\, " + N(L / 4) + "]") + ".",
          { ctx: "rectangle", guide: [GX("Longueur en fonction de " + M("x") + " ?", L / 2 + "-x", M(L / 2 + " - x") + "."), GI(M(L / 2 + " - x \\ge x") + " donne ?", "<=", L / 4, M("x \\le " + N(L / 4)) + "."), GSS("Ensemble des solutions ?", [iv(w, false, L / 4, true)], M("S = \\,]" + w + " \\,;\\, " + N(L / 4) + "]") + ".")],
            traps: [TS([iv(w, false, L / 2, true)], "La longueur vaut " + L / 2 + " − x (demi-périmètre moins la largeur).")] }); },
    ],
  };

  // ===================== Défis (niveau 4) =====================
  // ===================== ineq : inéquations du 1er degré (20.11) =====================
  // 1re Collège : seulement le 1er degré (les inéquations rationnelles sont la notion ineqfrac, en 2e).
  const TR = TRAP, sg = (v) => (v < 0 ? " - " + -v : " + " + v), par = (v) => (v < 0 ? "(" + v + ")" : String(v)), xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const ANI = " Réponds par exemple « x > 4 », « x <= -3 » ou avec un intervalle.";
  const ops = [">", ">=", "<", "<="];
  const SX = (op, v) => M("x " + opT[op] + " " + fT(v));
  const IQ = {
    1: [
      () => { const a = R.int(2, 7), x0 = nz(-6, 6), b = nz(-9, 9), op = pk(ops), c = a * x0 + b, I = [ivOp(op, x0)];
        return QS("Résous " + M(lin(a, b) + " " + opT[op] + " " + c) + "." + ANI, I, "On retire " + M(fT(b)) + " : " + M(a + "x " + opT[op] + " " + (c - b)) + ". On divise par " + M(a) + " (positif, le sens ne change pas) : " + SX(op, x0) + ", " + M("S = " + SolSet.show(I)) + ".",
          { ctx: "direct", guide: [GN("On retire " + M(fT(b)) + " des deux côtés : " + M(a + "x " + opT[op]) + " ?", c - b, M(c + sg(-b) + " = " + (c - b)) + "."), GSS("On divise par " + M(a) + " (positif : le sens ne change pas). Solutions ?", I, SX(op, x0) + ".")],
            traps: [TS([ivOp(flip[op], x0)], "On ne retourne le sens que si on multiplie ou divise par un nombre négatif."), TS([ivOp(op, (c + b) / a)], "Pour faire disparaître " + fS(b) + ", on fait l'opération contraire.")] }); },
      () => { const a = -R.int(2, 6), x0 = nz(-6, 6), b = nz(-9, 9), op = pk(ops), c = a * x0 + b, rs = flip[op], I = [ivOp(rs, x0)];
        return QS("Résous " + M(lin(a, b) + " " + opT[op] + " " + c) + "." + ANI, I, M(a + "x " + opT[op] + " " + (c - b)) + ". On divise par " + M(a) + ", un nombre négatif : le sens de l'inégalité se retourne. " + SX(rs, x0) + ".",
          { ctx: "negatif", guide: [GN("On retire " + M(fT(b)) + " : " + M(a + "x " + opT[op]) + " ?", c - b, M(c - b) + "."), GSS("On divise par " + M(a) + " (négatif !). Solutions ?", I, "Le sens se retourne : " + SX(rs, x0) + ".")],
            traps: [TS([ivOp(op, x0)], "En divisant par " + a + " (négatif), il faut retourner le sens de l'inégalité.")] }); },
      () => { const pr = pk([1.5, 2.5, 3.5, 4, 4.5, 6.5, 7]), B = R.int(20, 80), n = Math.floor(B / pr + 1e-9); if (Math.abs(n * pr - B) < 1e-9 || n < 3) return null;
        const chf = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", "{,}")), c = pk([["cahiers", "un cahier coûte"], ["billets", "un billet de bus coûte"], ["glaces", "une glace coûte"], ["places de cinéma", "une place de cinéma coûte"]]);
        return QN("Avec " + M(B) + " CHF, combien de " + c[0] + " peut-on acheter au maximum si " + c[1] + " " + M(chf(pr)) + " CHF ?", n, M(chf(pr) + " \\cdot n \\le " + B) + " donne " + M("n \\le " + B + " \\div " + chf(pr) + " \\approx " + N(+(B / pr).toFixed(2))) + " : au maximum " + M(n) + " (un nombre entier, arrondi vers le bas).",
          { ctx: "budget", guide: [GN("Inéquation " + M(chf(pr) + " \\cdot n \\le " + B) + ". " + M(B + " \\div " + chf(pr)) + " ≈ ? (au centième)", +(B / pr).toFixed(2), M("\\approx " + N(+(B / pr).toFixed(2))) + "."), GN("Plus grand nombre entier possible ?", n, M(n) + " : on arrondit vers le bas, sinon on dépasse le budget.")],
            traps: [TR(n + 1, "Avec " + (n + 1) + " " + c[0] + ", on dépasserait " + B + " CHF : on arrondit vers le bas."), TR(+(B / pr).toFixed(2), "On ne peut acheter qu'un nombre entier.")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), cc = nz(-6, 6), k = a - cc; if (k === 0 || Math.abs(k) === 1 && R.rand() < 0.5) return null; const x0 = nz(-6, 6), b = nz(-9, 9), d = k * x0 + b, op = pk(ops), rs = k < 0 ? flip[op] : op, I = [ivOp(rs, x0)];
        return QS("Résous " + M(lin(a, b) + " " + opT[op] + " " + lin(cc, d)) + "." + ANI, I, "On regroupe les " + M("x") + " à gauche : " + M(lin(k, 0) + " " + opT[op] + " " + (d - b)) + ". " + (k < 0 ? "On divise par " + M(k) + " (négatif) : le sens se retourne, " : "On divise par " + M(k) + " : ") + SX(rs, x0) + ".",
          { ctx: "deux-membres", guide: [GN("On regroupe les " + M("x") + " à gauche et les nombres à droite. Coefficient de " + M("x") + " à gauche ?", k, M(a + sg(-cc) + " = " + k) + "."), GN("Membre de droite (constante) ?", d - b, M(d + sg(-b) + " = " + (d - b)) + "."), GSS("Solutions ?", I, (k < 0 ? "Division par un négatif, sens retourné : " : "") + SX(rs, x0) + ".")],
            traps: [TS([ivOp(k < 0 ? op : flip[op], x0)], k < 0 ? "Le coefficient " + k + " est négatif : on retourne le sens en divisant." : "Le coefficient " + k + " est positif : le sens ne change pas."), TS([ivOp(rs, (d + b) / k)], "Un terme qui change de membre change de signe.")] }); },
      () => { const k = pk([2, 3, 4, 5]), p = nz(-5, 5), m = pk([2, 3]), q = nz(-5, 5), A = k - m, B = m * q + k * p; if (A === 0 || B % A !== 0) return null; const x0 = B / A, op = pk(ops), rs = A < 0 ? flip[op] : op, I = [ivOp(rs, x0)];
        return QS("Résous " + M(k + "(" + xm(p) + ") " + opT[op] + " " + m + "(x" + sg(q) + ")") + "." + ANI, I, "On développe : " + M(lin(k, -k * p) + " " + opT[op] + " " + lin(m, m * q)) + ", puis " + M(lin(A, 0) + " " + opT[op] + " " + B) + (A < 0 ? " ; division par " + M(A) + ", sens retourné" : "") + " : " + SX(rs, x0) + ".",
          { ctx: "parentheses", guide: [GN("On développe " + M(k + "(" + xm(p) + ")") + ". Terme constant ?", -k * p, M(lin(k, -k * p)) + "."), GN("On regroupe : " + M(lin(A, 0) + " " + opT[op]) + " ?", B, M(lin(A, 0) + " " + opT[op] + " " + B) + "."), GSS("Solutions ?", I, SX(rs, x0) + ".")],
            traps: [TS([ivOp(rs, (m * q + p) / A)], "On multiplie " + k + " par les deux termes de la parenthèse."), TS([ivOp(A < 0 ? op : flip[op], x0)], "Le sens ne se retourne que si on divise par un négatif.")] }); },
      () => { const [p, r] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 6]]), L = (p * r) / gcd2(p, r), q = R.int(1, 6), op = pk(ops), A = L / p - L / r; if (A === 0) return null; const x0 = (q * L) / A; if (!Number.isInteger(x0)) return null; const rs = A < 0 ? flip[op] : op, I = [ivOp(rs, x0)];
        return QS("Résous " + M("\\frac{x}{" + p + "} - " + q + " " + opT[op] + " \\frac{x}{" + r + "}") + "." + ANI, I, "On multiplie par " + M(L) + " (positif, le sens ne change pas) : " + M((L / p) + "x - " + q * L + " " + opT[op] + " " + (L / r) + "x") + ", donc " + M(lin(A, 0) + " " + opT[op] + " " + q * L) + (A === 1 ? "" : " : " + SX(rs, x0)) + ".",
          { ctx: "fractions", guide: [GN("On multiplie tout par le dénominateur commun (positif). Lequel ?", L, M(L) + "."), GN("On obtient " + M((L / p) + "x - " + q * L + " " + opT[op] + " " + (L / r) + "x") + ". Après regroupement, " + M(lin(A, 0) + " " + opT[op]) + " ?", q * L, M(q * L) + "."), GSS("Solutions ?", I, SX(rs, x0) + ".")],
            traps: [TS([ivOp(rs, q / A)], "On multiplie aussi " + q + " par " + L + "."), TS([ivOp(flip[rs], x0)], "Multiplier par " + L + " (positif) ne change pas le sens.")] }); },
    ],
    3: [
      () => { const a = -R.int(2, 4), b = nz(-6, 6), lo = R.int(-4, 1), hi = lo + R.int(2, 6), ol = pk(["<", "<="]), oh = pk(["<", "<="]);
        // lo ol x oh hi  ⇔  a·hi + b  oh'  a·x + b  ol'  a·lo + b  (a < 0 : on part des bornes de x)
        const L = a * hi + b, H = a * lo + b, I = [iv(lo, ol === "<=", hi, oh === "<=")];
        return QS("Résous " + M(L + " " + opT[oh] + " " + lin(a, b) + " " + opT[ol] + " " + H) + ". Donne l'ensemble des solutions (intervalle).", I, "On retire " + M(fT(b)) + " aux trois membres : " + M((L - b) + " " + opT[oh] + " " + a + "x " + opT[ol] + " " + (H - b)) + ". On divise par " + M(a) + " (négatif) : les deux sens se retournent, " + M(lo + " " + opT[ol] + " x " + opT[oh] + " " + hi) + ", " + M("S = " + SolSet.show(I)) + ".",
          { ctx: "double-negatif", guide: [GN("On retire " + M(fT(b)) + " aux trois membres, puis on divise par " + M(a) + " (les sens se retournent). Borne de gauche de x ?", lo, M(fT(H - b) + " \\div " + par(a) + " = " + lo) + "."), GN("Borne de droite ?", hi, M(fT(L - b) + " \\div " + par(a) + " = " + hi) + "."), GSS("Ensemble des solutions ?", I, M("S = " + SolSet.show(I)) + " (vérifie les crochets).")],
            traps: [ol !== oh && TS([iv(lo, oh === "<=", hi, ol === "<=")], "En retournant l'inégalité, chaque borne garde son crochet : regarde quel signe va avec quelle borne."), TS([iv(-hi, false, -lo, false)], "On divise par " + a + " (avec son signe).")] }); },
      () => { const fA = R.int(0, 10), pA = R.int(4, 9), fB = R.int(15, 60), pB = R.int(1, pA - 2), t = (fB - fA) / (pA - pB), n = Math.floor(t) + 1;
        const c = pk([["salle de sport", "par séance", "séances"], ["cinéma", "par film", "films"], ["piscine", "par entrée", "entrées"], ["location de kayak", "par sortie", "sorties"]]);
        return QN(c[0][0].toUpperCase() + c[0].slice(1) + " : formule A, " + (fA ? M(fA) + " CHF d'inscription et " : "") + M(pA) + " CHF " + c[1] + " ; formule B, " + M(fB) + " CHF d'abonnement et " + M(pB) + " CHF " + c[1] + ". À partir de combien de " + c[2] + " la formule B est-elle strictement moins chère ?", n,
          M(fB + " + " + pB + "n < " + fA + " + " + pA + "n") + " donne " + M((pA - pB) + "n > " + (fB - fA)) + ", " + M("n > " + N(+t.toFixed(2))) + " : à partir de " + M(n) + " " + c[2] + ".",
          { ctx: "offres", guide: [GN("Inéquation " + M(fB + " + " + pB + "n < " + fA + " + " + pA + "n") + ". On regroupe : " + M((pA - pB) + "n >") + " ?", fB - fA, M(fB + " - " + fA + " = " + (fB - fA)) + "."), GN(M("n >") + " ? (au centième)", +t.toFixed(2), M(N(+t.toFixed(2))) + "."), GN("Plus petit nombre entier qui convient ?", n, M(n) + (Number.isInteger(t) ? " : à " + t + " " + c[2] + " les deux formules coûtent pareil (inégalité stricte)." : "."))],
            traps: [TR(Number.isInteger(t) ? t : Math.floor(t), Number.isInteger(t) ? "À " + t + " " + c[2] + ", les deux formules coûtent autant : B n'est pas encore « strictement » moins chère." : "n doit être plus grand que " + String(+t.toFixed(2)).replace(".", ",") + " : on arrondit vers le haut."), TR(Math.ceil((fB + fA) / (pA - pB)), "On soustrait les frais fixes : " + fB + " − " + fA + ".")] }); },
      () => { const k = pk([2, 3, 4, -2]), p = nz(-5, 5), q = nz(-8, 8), op = pk(ops), lhsC = k * p, holds = (op === ">" ? lhsC > q : op === ">=" ? lhsC >= q : op === "<" ? lhsC < q : lhsC <= q); if (lhsC === q) return null;
        const I = holds ? [[-Infinity, false, Infinity, false]] : [];
        return QS("Résous " + M(k + "(x" + sg(p) + ") " + opT[op] + " " + lin(k, q)) + ". (Réponds « aucune » ou « tous » si besoin.)", I, "On développe : " + M(lin(k, lhsC) + " " + opT[op] + " " + lin(k, q)) + ". Les " + M("x") + " s'éliminent : " + M(lhsC + " " + opT[op] + " " + q) + ", " + (holds ? "toujours vrai : tous les nombres sont solutions, " + M("S = \\mathbb{R}") : "toujours faux : aucune solution, " + M("S = \\varnothing")) + ".",
          { ctx: "aucune-tous", guide: [GN("On développe " + M(k + "(x" + sg(p) + ")") + ". Terme constant ?", lhsC, M(lin(k, lhsC)) + "."), GSS("Les termes en " + M("x") + " s'éliminent : il reste " + M(lhsC + " " + opT[op] + " " + q) + ". Solutions (« tous » ou « aucune ») ?", I, holds ? "Vrai pour tout x : " + M("S = \\mathbb{R}") + "." : "Faux pour tout x : " + M("S = \\varnothing") + ".")],
            traps: [TS(holds ? [] : [[-Infinity, false, Infinity, false]], holds ? M(lhsC + " " + opT[op] + " " + q) + " est vrai : tous les x conviennent." : M(lhsC + " " + opT[op] + " " + q) + " est faux : aucun x ne convient.")] }); },
    ],
  };

  const PROBS = {
    ineq: [() => P("Un rectangle a une largeur de x cm et une longueur de (x + 7) cm. Son périmètre ne doit pas dépasser 60 cm, et sa largeur doit valoir au moins 3 cm.", [["a) Périmètre en fonction de x : coefficient de x", 4], ["b) Largeur maximale (cm)", 11.5], ["c) Combien de largeurs entières sont possibles ?", 9]], ["P = 2x + 2(x + 7).", "c) 3 ≤ x ≤ 11,5."], "a) " + M("P = 4x + 14") + " ; b) " + M("4x + 14 \\le 60") + ", " + M("x \\le 11{,}5") + " ; c) " + M("x \\in \\{3, 4, \\ldots, 11\\}") + " : 9 valeurs.")],
    sys2: [
      () => P("Au marché, 3 kg de pommes et 2 kg de poires coûtent 13 CHF ; 2 kg de pommes et 3 kg de poires coûtent 14,50 CHF.", [["a) Prix d'un kg de pommes (CHF)", 2], ["b) Prix d'un kg de poires (CHF)", 3.5], ["c) Prix de 5 kg de pommes et 1 kg de poires (CHF)", 13.5]],
          ["Additionne les deux équations : 5p + 5q = 27,5.", "Puis soustrais-les : p − q = −1,5."], "a) 2 CHF ; b) 3,50 CHF ; c) " + M("5 \\cdot 2 + 3{,}5 = 13{,}5") + " CHF."),
      () => P("La droite " + M("y = ax + b") + " passe par " + M("A(1 \\,;\\, 5)") + " et " + M("B(4 \\,;\\, -1)") + ".", [["a) a", -2], ["b) b", 7], ["c) Abscisse du point où elle coupe l'axe des x", 3.5]],
          ["a + b = 5 et 4a + b = −1.", "c) Résous −2x + 7 = 0."], "a) " + M("a = -2") + " ; b) " + M("b = 7") + " ; c) " + M("x = 3{,}5") + "."),
    ],
    sysprob: [
      () => P("Dans une ferme, il y a des poules et des lapins : 35 têtes et 94 pattes.", [["a) Nombre de poules", 23], ["b) Nombre de lapins", 12]], ["Si tous étaient des poules : 70 pattes.", "Chaque lapin ajoute 2 pattes."], "Lapins : " + M("(94 - 70) : 2 = 12") + " ; poules : 23."),
      () => P("Un avion parcourt 1'800 km en 2 h avec le vent dans le dos, et 3 h contre le vent.", [["a) Vitesse avec le vent (km/h)", 900], ["b) Vitesse contre le vent (km/h)", 600], ["c) Vitesse de l'avion sans vent (km/h)", 750], ["d) Vitesse du vent (km/h)", 150]],
          ["v + w = 900, v − w = 600.", "Additionne."], "c) 750 km/h ; d) 150 km/h."),
    ],
    sysgraph: [
      () => P("On considère " + sys("2x + 3y = 6", "4x + my = k") + ".", [["a) Pour quel m les droites sont-elles parallèles ?", 6], ["b) Avec ce m, pour quel k y a-t-il une infinité de solutions ?", 12], ["c) Avec m = 1 et k = 2 : abscisse de la solution", 0]],
          ["Coefficients proportionnels (facteur 2).", "c) Résous le système."], "a) 6 ; b) 12 ; c) " + M("x = 0") + ", " + M("y = 2") + "."),
      () => P("Deux opérateurs : A coûte 20 CHF par mois plus 0,10 CHF la minute ; B coûte 0,30 CHF la minute.", [["a) Coût de A pour 60 minutes (CHF)", 26], ["b) Coût de B pour 60 minutes (CHF)", 18], ["c) Nombre de minutes où les coûts sont égaux", 100]],
          ["Écris deux fonctions affines.", "c) 0,1x + 20 = 0,3x."], "c) " + M("0{,}2x = 20") + ", " + M("x = 100") + " minutes."),
    ],
    sys3: [
      () => P("Trois amis comparent leurs économies : A et B ont ensemble 70 CHF, B et C 90 CHF, A et C 80 CHF.", [["a) Total des trois (CHF)", 120], ["b) Économies de A", 30], ["c) Économies de B", 40], ["d) Économies de C", 50]], ["Additionne les trois équations : 2(A + B + C) = 240.", "A = total − (B + C)."], "a) 120 ; A = 30, B = 40, C = 50."),
      () => P("Une parabole " + M("y = ax^2 + bx + c") + " passe par " + M("(0 \\,;\\, 3)") + ", " + M("(1 \\,;\\, 2)") + " et " + M("(2 \\,;\\, 3)") + ".", [["a) c", 3], ["b) a", 1], ["c) b", -2]], ["c se lit avec x = 0.", "a + b = −1 et 4a + 2b = 0."], M("y = x^2 - 2x + 3") + "."),
    ],
    affine: [
      () => P("Un plombier facture un déplacement fixe et un tarif horaire : 2 h coûtent 230 CHF, 5 h coûtent 470 CHF.", [["a) Tarif horaire (CHF)", 80], ["b) Déplacement (CHF)", 70], ["c) Prix pour 3 h 30 (CHF)", 350]], ["Pente : (470 − 230) ÷ 3.", "c) 3,5 h."], "a) 80 ; b) 70 ; c) " + M("80 \\cdot 3{,}5 + 70 = 350") + " CHF."),
      () => P("Une bougie de 24 cm brûle régulièrement : elle mesure 18 cm après 2 h.", [["a) Vitesse (cm par heure)", 3], ["b) Hauteur après 5 h (cm)", 9], ["c) Durée totale de combustion (h)", 8]], ["h(t) = 24 − 3t.", "c) h(t) = 0."], "c) " + M("t = 8") + " h."),
    ],
    affzero: [
      () => P("Un club propose : formule A, 60 CHF par an plus 5 CHF par entrée ; formule B, 9 CHF par entrée.", [["a) Nombre d'entrées où les deux coûtent pareil", 15], ["b) Coût commun (CHF)", 135], ["c) À partir de combien d'entrées A est-elle strictement moins chère ? (le plus petit entier)", 16]],
          ["60 + 5x = 9x.", "c) 60 + 5x < 9x."], "a) 15 ; b) 135 CHF ; c) " + M("x > 15") + ", donc dès 16 entrées."),
      () => P("Soit " + M("f(x) = 3x - 7") + " et " + M("g(x) = -x + 5") + ".", [["a) Zéro de f (fraction : 7/3)", 7 / 3], ["b) Zéro de g", 5], ["c) Abscisse où f(x) = g(x)", 3]], ["Résous f(x) = 0, puis g(x) = 0.", "c) 3x − 7 = −x + 5."], "a) " + M("\\frac{7}{3}") + " ; b) 5 ; c) " + M("x = 3") + "."),
    ],
    sysineq: [
      () => P("Pour une sortie, la classe dispose de 600 CHF. Le car coûte 240 CHF et l'entrée 15 CHF par élève. Il faut au moins 12 élèves pour que la sortie ait lieu.", [["a) Nombre maximal d'élèves", 24], ["b) Nombre minimal d'élèves", 12], ["c) Combien de valeurs possibles pour le nombre d'élèves ?", 13]],
          ["240 + 15x ≤ 600.", "c) Les entiers de 12 à 24."], "a) " + M("15x \\le 360") + ", " + M("x \\le 24") + " ; c) 13 valeurs."),
      () => P("On cherche les nombres x qui vérifient à la fois 2x − 3 > 1 et 5 − x ≥ −2.", [["a) Borne de gauche (exclue)", 2], ["b) Borne de droite (comprise)", 7], ["c) Combien d'entiers vérifient le système ?", 5]], ["2x > 4 ; −x ≥ −7, donc x ≤ 7.", "c) 3, 4, 5, 6, 7."], M("S = \\,]2 \\,;\\, 7]") + " ; 5 entiers."),
    ],
  };

  // ===================== Enregistrement =====================
  // « Trouve l'erreur » (24.11, chantier I) : addition des équations mal faite (signe de y).
  SYS2[2].push(() => { const x = R.nz(-5, 6), y = R.nz(-5, 6), s = x + y, d = x - y, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    if (s === d || s + d === s - d) return SYS2[2][0]();
    return QN("Pour résoudre " + M("\\begin{cases} x + y = " + s + " \\\\ x - y = " + d + " \\end{cases}") + ", " + w + " écrit : « j'additionne : " + M("2x = " + s + " - " + par(d) + " = " + (s - d)) + " ». Trouve l'erreur, puis donne la valeur de " + M("x") + ".", x,
      "Erreur : en additionnant, les " + M("y") + " s'éliminent et les seconds membres s'<b>additionnent</b> : " + M("2x = " + s + " + " + par(d) + " = " + 2 * x) + ", donc " + M("x = " + x) + ".",
      { ctx: "erreur", guide: [GS("On additionne les deux équations : " + M(s + " + " + par(d)) + " = ? (c'est 2x)", 2 * x, M("2x = " + 2 * x) + "."), GS("x = ?", x, M("x = " + x) + ".")],
        traps: [TRAP((s - d) / 2, "C'est le calcul de " + w + " : on additionne aussi les seconds membres.")] }); });
  // ===================== Chantier X (24.11) : lecture sur figure (sysgraph, affine) =====================
  // Solutions, pentes et ordonnées à l'origine LUES sur des droites tracées ; points d'intersection sur des nœuds du
  // quadrillage (demi-unités au niveau 3, signalées dans l'énoncé) ; aucune coordonnée écrite sur la figure.
  const PLT = (fns, pts = [], o = {}) => FIG.plot(fns, pts, Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  const dC = (v) => String(v).replace(".", ",");
  SGRAPH[1].push(
    () => { const x0 = R.int(-3, 3), y0 = R.int(-3, 3); if (x0 === y0 || (!x0 && !y0)) return null; const a1 = nz(-3, 3), b1 = nz(-2, 2), a2 = nz(-3, 3), b2 = nz(-2, 2); if (a1 * b2 === a2 * b1) return null;
      const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
      return QP("Le graphique montre les droites des deux équations du système " + sys(lhs([a1, b1]) + " = " + c1, lhs([a2, b2]) + " = " + c2) + ". Lis sa solution sur le graphique." + PAIR, [x0, y0], "Les deux droites se coupent en " + pairT([x0, y0]) + ". Vérification dans la 1re équation : " + M(a1 + " \\cdot " + pT(x0) + (b1 < 0 ? " - " : " + ") + Math.abs(b1) + " \\cdot " + pT(y0) + " = " + c1) + ".",
        { ctx: "lecture-general", fig: PLT([{ f: (x) => (c1 - a1 * x) / b1 }, { f: (x) => (c2 - a2 * x) / b2, cls: "f-blue" }]), guide: [GN("Repère le point où les deux droites se coupent. Son abscisse (axe horizontal) ?", x0, M("x = " + x0) + "."), GN("Son ordonnée (axe vertical) ?", y0, M("y = " + y0) + "."), GP("Solution « x ; y » ?", [x0, y0], pairT([x0, y0]) + ".")],
          traps: [TP([y0, x0], "Un point s'écrit (abscisse ; ordonnée) : x d'abord."), TP([0, c1 / b1], "C'est là qu'une droite coupe l'axe vertical, pas le point commun aux deux droites."), TP([x0, -y0], "Vérifie le signe de l'ordonnée : le point est " + (y0 < 0 ? "sous" : "au-dessus de") + " l'axe horizontal.")] }); },
    () => { const [a, b] = pk([[1, 0.5], [2, 1], [2, 0.5], [1, 2], [0.5, 2], [0.5, 1]]), t = R.int(2, 6), H = R.int(2, 6), hA = H + a * t, hB = H + b * t; if (hA > 10 || hB > 10 || !Number.isInteger(hA) || !Number.isInteger(hB)) return null;
      return QP("Deux bougies se consument. Le graphique donne leur hauteur (en cm, axe vertical) en fonction du temps (en heures, axe horizontal) : bougie A en trait plein, bougie B en bleu. Après combien d'heures ont-elles la même hauteur, et quelle est cette hauteur ? Réponds « heures ; cm ».", [t, H],
        "Les deux droites se coupent au point " + pairT([t, H]) + " : après " + M(t) + " h, les deux bougies mesurent " + M(H) + " cm. (A : " + M(hA) + " cm au départ, B : " + M(hB) + " cm.)",
        { ctx: "bougies", fig: FIG.plot([{ f: (x) => hA - a * x, from: 0, to: hA / a }, { f: (x) => hB - b * x, from: 0, to: hB / b, cls: "f-blue" }], [], { numbers: true, xr: [-1, 11], yr: [-1, 11], squash: 0.85 }), guide: [GN("Repère le point où les deux droites se croisent. Temps (axe horizontal) ?", t, M(t) + " h."), GN("Hauteur à ce moment (axe vertical) ?", H, M(H) + " cm."), GP("Réponse « heures ; cm » ?", [t, H], pairT([t, H]) + ".")],
          traps: [TP([H, t], "Le temps se lit sur l'axe horizontal, la hauteur sur l'axe vertical : temps d'abord."), TP([0, hA], "Ça, c'est la hauteur de départ de la bougie A.")] }); },
  );
  SGRAPH[2].push(
    () => { const a = pk([2, -2, 3, -3, 0.5, -0.5]), b = nz(-3, 3); let p; do p = nz(-4, 4); while (p === b || Math.abs(p) === Math.abs(a) || Math.abs(p) < 2);
      return QN("La droite tracée a pour équation " + M("y = mx + h") + ". Pour quelle valeur de " + M("k") + " le système formé par cette droite et " + M("y = kx" + (p < 0 ? " - " + -p : " + " + p)) + " n'a-t-il aucune solution ?" + (Number.isInteger(a) ? "" : " (fraction ou décimal accepté)"), a,
        "Aucune solution : droites parallèles distinctes, donc même pente. On lit la pente de la droite tracée : en avançant de " + (Number.isInteger(a) ? 1 : 2) + ", elle " + (a > 0 ? "monte" : "descend") + " de " + Math.abs(Number.isInteger(a) ? a : 2 * a) + ", donc " + M("m = " + fT(a)) + " et " + M("k = " + fT(a)) + ". (Les ordonnées à l'origine " + M(b) + " et " + M(p) + " sont différentes : les droites ne sont pas confondues.)",
        { ctx: "pente-lue-parallele", fig: PLT([{ f: (x) => a * x + b }]), guide: [GN("Aucune solution = droites parallèles = même pente. Lis la pente de la droite tracée : de combien monte-t-elle (négatif si elle descend) quand on avance de " + (Number.isInteger(a) ? "1" : "2") + " ?", Number.isInteger(a) ? a : 2 * a, M(Number.isInteger(a) ? a : 2 * a) + "."), GN("Pente " + M("m") + " (montée ÷ avancée), donc " + M("k") + " = ?", a, M("k = " + fT(a)) + ".")],
          traps: [{ v: b, m: "Ça, c'est l'ordonnée à l'origine (h) ; pour des droites parallèles, ce sont les PENTES qui sont égales." }, { v: -a, m: "La droite " + (a > 0 ? "monte" : "descend") + " : sa pente est " + (a > 0 ? "positive" : "négative") + "." }, { v: 1 / a, m: "Pente = montée verticale ÷ avancée horizontale, pas l'inverse." }] }); },
    () => { const SL = [-3, -2, -1, 1, 2, 3, 0.5, -0.5]; let L, i, j, X, Y, g = 0;
      do { L = [0, 1, 2].map(() => [pk(SL), R.int(-4, 4)]); i = R.int(0, 2); j = (i + R.int(1, 2)) % 3; X = (L[j][1] - L[i][1]) / (L[i][0] - L[j][0]); Y = L[i][0] * X + L[i][1]; g++; }
      while (g < 200 && (new Set(L.map((l) => l[0])).size < 3 || new Set(L.map((l) => l[1])).size < 3 || !Number.isInteger(X) || !Number.isInteger(Y) || Math.abs(X) > 4 || Math.abs(Y) > 5 || X === Y || (!X && !Y)));
      if (g >= 200) return null; const [i1, j1] = i < j ? [i, j] : [j, i], k = 3 - i1 - j1, eq = (l) => "y = " + lin(l[0], l[1]);
      const other = (u, w) => { const x = (L[w][1] - L[u][1]) / (L[u][0] - L[w][0]); return [x, L[u][0] * x + L[u][1]]; };
      return QP("Les trois droites tracées ont pour équations " + M("(1)\\ " + eq(L[0])) + ", " + M("(2)\\ " + eq(L[1])) + " et " + M("(3)\\ " + eq(L[2])) + ". Reconnais-les, puis lis la solution du système formé par " + M("(" + (i1 + 1) + ")") + " et " + M("(" + (j1 + 1) + ")") + "." + PAIR, [X, Y],
        "La droite " + M("(" + (i1 + 1) + ")") + " coupe l'axe vertical en " + M(L[i1][1]) + ", la droite " + M("(" + (j1 + 1) + ")") + " en " + M(L[j1][1]) + " : elles se coupent en " + pairT([X, Y]) + ".",
        { ctx: "trois-droites", fig: PLT([{ f: (x) => L[0][0] * x + L[0][1] }, { f: (x) => L[1][0] * x + L[1][1], cls: "f-blue" }, { f: (x) => L[2][0] * x + L[2][1], cls: "f-line", dash: true }]), guide: [GN("Pour reconnaître " + M("(" + (i1 + 1) + ")") + " : où coupe-t-elle l'axe vertical (ordonnée à l'origine) ?", L[i1][1], M(L[i1][1]) + " ; elle " + (L[i1][0] > 0 ? "monte" : "descend") + "."), GN("Et " + M("(" + (j1 + 1) + ")") + " ?", L[j1][1], M(L[j1][1]) + " ; elle " + (L[j1][0] > 0 ? "monte" : "descend") + "."), GP("Point d'intersection de ces deux droites « x ; y » ?", [X, Y], pairT([X, Y]) + ".")],
          traps: [TP([Y, X], "x d'abord, puis y."), TP(other(i1, k), "Ça, c'est l'intersection de (" + (i1 + 1) + ") avec (" + (k + 1) + ") : vérifie quelle droite est laquelle."), TP(other(j1, k), "Ça, c'est l'intersection de (" + (j1 + 1) + ") avec (" + (k + 1) + ") : vérifie quelle droite est laquelle.")] }); },
  );
  SGRAPH[3].push(
    () => { const SL = [1, -1, 3, -3]; let a, c, b, d, x0, y0, g = 0;
      do { a = pk(SL); c = pk(SL); b = R.int(-4, 4); d = R.int(-4, 4); x0 = (d - b) / (a - c); y0 = a * x0 + b; g++; } while (g < 200 && (a === c || Number.isInteger(x0) || !Number.isInteger(2 * x0) || !Number.isInteger(2 * y0) || Math.abs(x0) > 4 || Math.abs(y0) > 4.5));
      if (g >= 200) return null;
      return QP("Le graphique montre les deux droites d'un système. Leur point d'intersection est entre les lignes du quadrillage (demi-unités). Lis la solution du système." + PAIR + " (Nombres décimaux acceptés.)", [x0, y0], "Les droites se coupent à mi-chemin entre deux lignes verticales : " + M("x = " + dC(x0).replace(",", "{,}")) + " ; " + (Number.isInteger(y0) ? "sur une ligne horizontale" : "à mi-chemin entre deux lignes horizontales") + " : " + M("y = " + dC(y0).replace(",", "{,}")) + ".",
        { ctx: "demi-unites", canon: dC(x0) + " ; " + dC(y0), fig: PLT([{ f: (x) => a * x + b }, { f: (x) => c * x + d, cls: "f-blue" }]), guide: [GN("Abscisse du point d'intersection (au milieu entre deux graduations : ajoute 0,5 à la plus petite) ?", x0, M(dC(x0).replace(",", "{,}")) + "."), GN("Ordonnée ?", y0, M(dC(y0).replace(",", "{,}")) + "."), GP("Solution « x ; y » ?", [x0, y0], M("(" + dC(x0).replace(",", "{,}") + " \\,;\\, " + dC(y0).replace(",", "{,}") + ")") + ".")],
          traps: [TP([y0, x0], "x d'abord, puis y."), TP([Math.floor(x0), Math.floor(y0)], "Le point n'est pas sur un nœud du quadrillage : il est à mi-chemin (0,5)."), TP([Math.ceil(x0), Math.ceil(y0)], "Le point n'est pas sur un nœud du quadrillage : il est à mi-chemin (0,5).")] }); },
    () => { const x0 = nz(-3, 3), y0 = nz(-3, 3); let a, c; if (Math.abs(x0) === Math.abs(y0)) return null; do { a = nz(-3, 3); c = nz(-3, 3); } while (a === c); const b = y0 - a * x0, d = y0 - c * x0, e = pk([2, 3, -2, 4]), k = y0 - e * x0; if (Math.abs(b) > 6 || Math.abs(d) > 6 || Math.abs(k) < 2) return null;
      return QN("Lis sur le graphique le point d'intersection des deux droites tracées. Pour quelle valeur de " + M("k") + " la droite " + M("y = " + e + "x + k") + " passe-t-elle aussi par ce point (trois droites concourantes) ?", k, "Point commun lu : " + pairT([x0, y0]) + ". La 3e droite y passe : " + M(y0 + " = " + e + " \\cdot " + pT(x0) + " + k") + ", donc " + M("k = " + k) + ".",
        { ctx: "concourantes-lues", fig: PLT([{ f: (x) => a * x + b }, { f: (x) => c * x + d, cls: "f-blue" }]), guide: [GN("Abscisse du point d'intersection ?", x0, M(x0) + "."), GN("Son ordonnée ?", y0, M(y0) + "."), GN("Remplace dans " + M("y = " + e + "x + k") + " : " + M("k") + " = ?", k, M("k = " + y0 + " - " + e + " \\cdot " + pT(x0) + " = " + k) + ".")],
          traps: [{ v: y0 + e * x0, m: "k = y − " + e + "x : attention au signe." }, { v: x0 - e * y0, m: "Tu as inversé x et y : le point est (" + x0 + " ; " + y0 + ")." }, { v: y0, m: "k n'est pas l'ordonnée du point : la droite a une pente " + e + "." }] }); },
  );

  AFF[1].push(
    () => { const a = pk([1, -1, 2, -2, 3, -3]), b = R.pick([-4, -3, -2, 2, 3, 4]);
      return QN("La droite représente une fonction affine " + M("f(x) = ax + b") + ". Lis son ordonnée à l'origine " + M("b") + ".", b, "L'ordonnée à l'origine est la hauteur où la droite coupe l'axe vertical : " + M("b = f(0) = " + b) + ".",
        { ctx: "b-lu", fig: PLT([{ f: (x) => a * x + b }]), guide: [GN("Où la droite coupe-t-elle l'axe VERTICAL ? (valeur lue sur cet axe)", b, M(b) + ".")],
          traps: [{ v: -b / a, m: "Ça, c'est là où la droite coupe l'axe horizontal (le zéro). L'ordonnée à l'origine se lit sur l'axe vertical." }, { v: a, m: "Ça, c'est la pente. L'ordonnée à l'origine est la hauteur du point d'abscisse 0." }, { v: -b, m: "Le point est " + (b < 0 ? "sous" : "au-dessus de") + " l'axe horizontal : vérifie le signe." }] }); },
    () => { const a = pk([1, -1, 2, -2, 3, -3, 0.5, -0.5]), b = R.int(-3, 3), xs = [-4, -3, -2, 2, 3, 4].filter((x) => { const v = a * x + b; return Number.isInteger(v) && Math.abs(v) >= 2 && Math.abs(v) <= 6 && Math.abs(v) !== Math.abs(x); }); if (!xs.length) return null; const k = pk(xs), v = a * k + b;
      return QN("La droite représente une fonction affine " + M("f") + ". Lis " + M("f(" + k + ")") + " sur le graphique.", v, "Au-dessus (ou au-dessous) de " + M("x = " + k) + ", la droite est à la hauteur " + M(v) + " : " + M("f(" + k + ") = " + v) + ".",
        { ctx: "image-lue", fig: PLT([{ f: (x) => a * x + b }]), guide: [GN("Repère " + M(k) + " sur l'axe horizontal, va verticalement jusqu'à la droite. Hauteur du point ?", v, M(v) + ".")],
          traps: [{ v: k, m: "f(" + k + ") se lit sur l'axe vertical : c'est la hauteur du point, pas son abscisse." }, { v: -v, m: "Le point est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal." }, { v: a * -k + b, m: "Ça, c'est f(" + -k + ") : " + k + " est " + (k < 0 ? "à gauche" : "à droite") + " de l'axe vertical." }] }); },
  );
  AFF[2].push(
    () => { const a = pk([2, -2, 3, -3, 1, -1]), b = R.pick([-4, -3, -2, 2, 3, 4]);
      return QX("La droite représente une fonction affine " + M("f") + ". Lis sa pente et son ordonnée à l'origine, puis écris " + M("f(x)") + ".", linP(a, b), "La droite coupe l'axe vertical en " + M(b) + " (" + M("b = " + b) + ") ; en avançant de 1, elle " + (a > 0 ? "monte" : "descend") + " de " + Math.abs(a) + " (" + M("a = " + a) + ") : " + M("f(x) = " + lin(a, b)) + ".",
        { ctx: "expression-lue", fig: PLT([{ f: (x) => a * x + b }]), guide: [GN("Ordonnée à l'origine " + M("b") + " (lue sur l'axe vertical) ?", b, M(b) + "."), GN("Pente " + M("a") + " : de combien la droite monte-t-elle (négatif si elle descend) quand on avance de 1 ?", a, M(a) + "."), GX(M("f(x)") + " = ?", linP(a, b), M("f(x) = " + lin(a, b)) + ".")],
          traps: [TX(linP(b, a), "La pente multiplie x ; l'ordonnée à l'origine est le terme constant."), TX(linP(-a, b), "La droite " + (a > 0 ? "monte" : "descend") + " : la pente est " + (a > 0 ? "positive" : "négative") + "."), TX(linP(a, -b), "Vérifie le signe de b : la droite coupe l'axe vertical " + (b < 0 ? "sous" : "au-dessus de") + " l'origine.")] }); },
    () => { const q = pk([2, 3]), p = pk(q === 2 ? [1, -1, 3, -3, 5, -5] : [1, -1, 2, -2, 4, -4]), x1 = R.int(-3, 0), y1 = R.int(-3, 2), a = p / q, b = y1 - a * x1;
      if (Math.abs(y1 + p) > 6 || Math.abs(y1 + 2 * p) > 7 && x1 + 2 * q <= 6) return null;
      return QN("Lis la pente de la droite tracée (fraction acceptée). Aide : cherche deux points de la droite placés exactement sur des nœuds du quadrillage.", a, "La droite passe par " + pairT([x1, y1]) + " et " + pairT([x1 + q, y1 + p]) + " : en avançant de " + M(q) + ", elle " + (p > 0 ? "monte" : "descend") + " de " + M(Math.abs(p)) + ". Pente " + M("\\frac{" + p + "}{" + q + "} = " + fT(a)) + ".",
        { ctx: "pente-fraction", fig: PLT([{ f: (x) => a * x + b }]), guide: [GN("Trouve deux nœuds du quadrillage sur la droite. De combien avance-t-on horizontalement de l'un à l'autre (le plus petit écart) ?", q, M(q) + "."), GN("De combien monte-t-on (négatif si on descend) ?", p, M(p) + "."), GN("Pente = montée ÷ avancée ?", a, M(fT(a)) + ".")],
          traps: [{ v: q / p, m: "Pente = variation verticale ÷ variation horizontale (pas l'inverse)." }, { v: -a, m: "La droite " + (p > 0 ? "monte" : "descend") + " : la pente est " + (p > 0 ? "positive" : "négative") + "." }, { v: p, m: "Divise la montée par l'avancée (" + q + ")." }] }); },
  );
  AFF[3].push(
    () => { const x0 = nz(-3, 3); let a, c; do { a = nz(-3, 3); c = nz(-3, 3); } while (a === c); const y0 = R.int(-3, 3), b = y0 - a * x0, d = y0 - c * x0; if (Math.abs(b) > 7 || Math.abs(d) > 7 || Math.abs(x0) === Math.abs(y0)) return null;
      const op = pk([">", "<", ">=", "<="]), up = op[0] === ">", OP = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" }, flip = { ">": "<", "<": ">", ">=": "<=", "<=": ">=" }, res = (a > c) === up ? op.replace("<", ">") : flip[op.replace("<", ">")];
      // res : f − g = (a − c)(x − x0) ; f > g ⇔ x > x0 si a > c.
      return QI("On a tracé les droites représentant " + M("f") + " (trait plein) et " + M("g") + " (pointillé). Résous graphiquement " + M("f(x) " + OP[op] + " g(x)") + ". Réponds par une inégalité, par exemple « x > 2 ».", res, x0,
        "Les droites se coupent en " + M("x = " + x0) + ". La droite de " + M("f") + " est " + (up ? "au-dessus" : "en dessous") + " de celle de " + M("g") + " " + (res[0] === ">" ? "à droite" : "à gauche") + " de ce point : " + M("x " + OP[res] + " " + x0) + ".",
        { ctx: "f-sup-g-droites", fig: PLT([{ f: (x) => a * x + b }, { f: (x) => c * x + d, cls: "f-line", dash: true }]), guide: [GN("Abscisse du point d'intersection ?", x0, M(x0) + "."), GI("De quel côté de ce point le trait plein est-il " + (up ? "au-dessus" : "en dessous") + " du pointillé ? Solution :", res, x0, M("x " + OP[res] + " " + x0) + ".")],
          traps: [TI(res, y0, "La borne est l'abscisse du point d'intersection (" + x0 + "), pas son ordonnée."), TI(flip[res], y0, "La borne est l'abscisse du point d'intersection (" + x0 + "), pas son ordonnée."), TI(res, -x0, "Vérifie le signe de l'abscisse du point d'intersection.")] }); },
    () => { const p = pk([1, -1, 3, -3, 5, -5]), x1 = pk([-3, -1, 1]), y1 = R.int(-3, 2), a = p / 2, b = y1 - a * x1; if (Math.abs(b) > 5 || Math.abs(y1 + p) > 6) return null;
      return QX("La droite représente une fonction affine " + M("f") + ". Son ordonnée à l'origine est entre deux graduations. Lis deux points de la droite placés sur des nœuds du quadrillage, puis écris " + M("f(x)") + " (fractions acceptées).", linP(a, b), "La droite passe par " + pairT([x1, y1]) + " et " + pairT([x1 + 2, y1 + p]) + " : pente " + M("a = \\frac{" + p + "}{2}") + ". Puis " + M("b = " + y1 + " - " + pT(a) + " \\cdot " + pT(x1) + " = " + fT(b)) + " : " + M("f(x) = " + lin(a, b)) + ".",
        { ctx: "expression-fraction", fig: PLT([{ f: (x) => a * x + b }]), guide: [GN("Pente : en avançant de 2, de combien la droite monte-t-elle (négatif si elle descend) ? Divise par 2 :", a, M("a = " + fT(a)) + "."), GN("Ordonnée à l'origine " + M("b") + " (à mi-chemin entre deux graduations, ou calcule-la avec un point) ?", b, M("b = " + fT(b)) + "."), GX(M("f(x)") + " = ?", linP(a, b), M("f(x) = " + lin(a, b)) + ".")],
          traps: [TX(linP(2 / p, b), "Pente = variation verticale ÷ variation horizontale (pas l'inverse)."), TX(linP(a, Math.round(b)), "L'ordonnée à l'origine n'est pas entière : elle est à mi-chemin entre deux graduations."), TX(linP(-a, b), "Vérifie si la droite monte ou descend.")] }); },
  );
  // « Trouve l'erreur » (24.11, chantier I, suite) : division par un négatif sans retourner le sens.
  IQ[2].push(() => { const a = R.int(2, 6), x0 = nz(-6, 6), b = nz(-9, 9), op = pk(ops), c = -a * x0 + b, rs = flip[op], I = [ivOp(rs, x0)], w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return QS(w + " résout " + M(lin(-a, b) + " " + opT[op] + " " + c) + " : « " + M("-" + a + "x " + opT[op] + " " + (c - b)) + ", je divise par " + M("-" + a) + " : " + SX(op, x0) + " ». Trouve l'erreur, puis donne les solutions." + ANI, I,
      "Erreur : en divisant (ou multipliant) par un nombre <b>négatif</b>, on retourne le sens de l'inégalité. " + M("-" + a + "x " + opT[op] + " " + (c - b)) + " donne " + SX(rs, x0) + ". Contrôle avec " + M("x = " + (x0 + (rs[0] === ">" ? 1 : -1))) + " : " + M(lin(-a, b) + " = " + (-a * (x0 + (rs[0] === ">" ? 1 : -1)) + b)) + ", ça marche.",
      { ctx: "erreur", guide: [GN("On retire " + M(fT(b)) + " des deux côtés : " + M("-" + a + "x " + opT[op]) + " ?", c - b, M(c + sg(-b) + " = " + (c - b)) + "."), GSS("On divise par " + M("-" + a) + " (négatif : le sens se retourne). Solutions ?", I, SX(rs, x0) + ".")],
        traps: [TS([ivOp(op, x0)], "C'est la réponse de " + w + " : il a oublié de retourner le sens en divisant par " + M("-" + a) + ".")] }); });
  const ALL = { sys2: SYS2, sysprob: SPROB, sysgraph: SGRAPH, sys3: SYS3, affine: AFF, affzero: AZ, sysineq: SI, ineq: IQ };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    sys2: "Substitution (une inconnue déjà isolée) ou combinaison (multiplier pour éliminer une inconnue) ; vérifie dans les deux équations.",
    sysprob: "Choisis deux inconnues, écris une équation par information, résous, puis vérifie dans l'énoncé.",
    sysgraph: "Chaque équation est une droite : sécantes → une solution ; parallèles → aucune ; confondues → une infinité.",
    sys3: "Élimine une inconnue avec deux paires de lignes, résous le système 2 × 2 obtenu, puis remonte.",
    affine: "f(x) = ax + b : a = (différence des images) ÷ (différence des x) ; b = f(0), l'ordonnée à l'origine.",
    affzero: "Zéro : résous ax + b = 0. Si a > 0, f est négative avant le zéro et positive après ; si a < 0, l'inverse.",
    sysineq: "Résous chaque inéquation (en retournant le sens si tu divises par un négatif), puis garde la partie commune.",
    ineq: "Comme une équation : on isole x. Mais en multipliant ou divisant par un nombre négatif, on retourne le sens de l'inégalité.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    sys2: ["Résoudre par substitution ou addition", "Combinaison, solutions fractionnaires", "Systèmes à fractions, droite par deux points"],
    sysprob: ["Mettre en système (âges, billets, rectangle)", "Mélanges, courant, chiffres", "Concentrations, rencontres, achats"],
    sysgraph: ["Lire et calculer une intersection", "Parallèles ou confondues : paramètre", "Unicité, droites concourantes"],
    sys3: ["Système triangulaire, simple", "Élimination de Gauss", "Parabole par trois points, problèmes"],
    affine: ["Image, pente, tarif", "Expression par deux points, antécédent, graphique", "Parallèles, comparaison, conversion"],
    affzero: ["Zéro et signe", "Inéquation avec coefficient négatif", "f(x) > g(x), problèmes"],
    sysineq: ["Système direct, sans solution", "Sens retourné, double inégalité", "Trois inéquations, problèmes"],
    ineq: ["Résoudre, coefficient négatif, budget", "x des deux côtés, parenthèses, fractions", "Double inégalité, comparer des offres, aucune ou tous"],
  });
})();

// Chantier 1re Collège (bêta-testeurs) · lot 2 du plan pas à pas (19.11) : une seule source pour racenc, ensembles,
// tradexpr, divcrit, domaine. Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs
// typiques (pièges { spec, m } pour les intervalles), étiquette ctx ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dsum = (n) => String(n).split("").reduce((s, c) => s + +c, 0);
  const lst = (ns) => ns.map((n) => M(n)).join(" ; ");
  const inf = (v) => (v === Infinity ? "+\\infty" : v === -Infinity ? "-\\infty" : String(v));
  // Intervalle(s) en LaTeX : [[a, aFermé, b, bFermé], …]
  const IT = (ivs) => ivs.map(([a, ac, b, bc]) => (ac ? "[" : "]") + inf(a) + " \\,;\\, " + inf(b) + (bc ? "]" : "[")).join(" \\cup ");
  const RM = (vals) => "\\mathbb{R} \\setminus \\{" + vals.join(" \\,;\\, ") + "\\}";
  const sans = (vals) => { const v = [...vals].sort((a, b) => a - b), out = []; let lo = -Infinity; for (const x of v) { out.push([lo, false, x, false]); lo = x; } out.push([lo, false, Infinity, false]); return out; };
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? (b < 0 ? " - " + -b : " + " + b) : "");
  const tri = (b, c) => "x^2" + (b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x" : "") + (c ? (c < 0 ? " - " : " + ") + Math.abs(c) : "");
  // ---------- constructeurs (comme ch1c_sys.js) ----------
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { const c = SolSet.show(tr.spec.ivs, false);
      try { if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status !== "wrong") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({}, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  
  // ===================== tradexpr =====================
  const TE = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), v = 2 * (a + b);
        return QN("Calcule le double de la somme de " + M(a) + " et " + M(b) + ".", v, M("2 \\cdot (" + a + " + " + b + ") = 2 \\cdot " + (a + b) + " = " + v) + " : on calcule d'abord la somme.",
          { ctx: "double-somme", guide: [GS("D'abord la somme de " + M(a) + " et " + M(b) + " ?", a + b, M(a + b) + "."), GS("Son double ?", v, M(v) + ".")], traps: [TR(2 * a + b, "« Le double de la somme » : toute la somme est doublée, il faut des parenthèses.")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9), v = a + b * c;
        return QN("Calcule la somme de " + M(a) + " et du produit de " + M(b) + " par " + M(c) + ".", v, M(a + " + " + b + " \\cdot " + c + " = " + v) + ".",
          { ctx: "somme-produit", guide: [GS("Le produit de " + M(b) + " par " + M(c) + " ?", b * c, M(b * c) + "."), GS("La somme ?", v, M(v) + ".")], traps: [TR((a + b) * c, "C'est une somme dont un terme est un produit : " + a + " + (" + b + " · " + c + ").")] }); },
      () => { const b = R.int(2, 9), a = b + R.int(2, 9), v = 3 * (a - b);
        return QN("Calcule le triple de la différence entre " + M(a) + " et " + M(b) + ".", v, M("3 \\cdot (" + a + " - " + b + ") = " + v) + ".",
          { ctx: "triple-diff", guide: [GS("La différence ?", a - b, M(a - b) + "."), GS("Son triple ?", v, M(v) + ".")], traps: [TR(3 * a - b, "Toute la différence est triplée : parenthèses."), TR(a - 3 * b, "On triple la différence, pas seulement " + b + ".")] }); },
      () => { const c = R.int(3, 9), s = c * R.int(2, 9), a = R.int(1, s - 1), b = s - a; if (b % c === 0) return null;
        return QN("Calcule le quotient de la somme de " + M(a) + " et " + M(b) + " par " + M(c) + ".", s / c, M("(" + a + " + " + b + ") : " + c + " = " + s + " : " + c + " = " + s / c) + ".",
          { ctx: "quotient-somme", guide: [GS("La somme ?", s, M(s) + "."), GS("Divisée par " + M(c) + " ?", s / c, M(s / c) + ".")], traps: [TR(a + b / c, "Toute la somme est divisée : (" + a + " + " + b + ") : " + c + ".")] }); },
    ],
    2: [
      () => { const a = R.int(3, 9), b = R.int(3, 9), e = R.int(2, 6), c = e * R.int(2, 5), v = a * b - c / e;
        return QN("Calcule la différence entre le produit de " + M(a) + " par " + M(b) + " et le quotient de " + M(c) + " par " + M(e) + ".", v, M(a + " \\cdot " + b + " - " + c + " : " + e + " = " + a * b + " - " + c / e + " = " + v) + ".",
          { ctx: "diff-prod-quot", guide: [GS("Le produit ?", a * b, M(a * b) + "."), GS("Le quotient ?", c / e, M(c / e) + "."), GS("La différence ?", v, M(v) + ".")], traps: [TR(c / e - a * b, "« La différence entre A et B » : A − B, dans cet ordre.")] }); },
      () => { const a = 2 * R.int(2, 6), b = R.int(2, 9), c = R.int(2, 9), v = (a * (b + c)) / 2;
        return QN("Calcule la moitié du produit de " + M(a) + " par la somme de " + M(b) + " et " + M(c) + ".", v, M("\\frac{" + a + " \\cdot (" + b + " + " + c + ")}{2} = \\frac{" + a * (b + c) + "}{2} = " + v) + ".",
          { ctx: "moitie-produit", guide: [GS("La somme ?", b + c, M(b + c) + "."), GS("Le produit par " + M(a) + " ?", a * (b + c), M(a * (b + c)) + "."), GS("La moitié ?", v, M(v) + ".")], traps: [TR((a * b + c) / 2, "Le produit porte sur toute la somme : " + a + " · (" + b + " + " + c + ")."), TR(a * (b + c), "N'oublie pas de prendre la moitié.")] }); },
      () => { const a = R.int(2, 7), b = R.int(2, 7), d = R.int(2, 6), c = d + R.int(2, 6), v = (a + b) * (c - d);
        return QN("Calcule le produit de la somme de " + M(a) + " et " + M(b) + " par la différence entre " + M(c) + " et " + M(d) + ".", v, M("(" + a + " + " + b + ") \\cdot (" + c + " - " + d + ") = " + (a + b) + " \\cdot " + (c - d) + " = " + v) + ".",
          { ctx: "prod-somme-diff", guide: [GS("La somme ?", a + b, M(a + b) + "."), GS("La différence ?", c - d, M(c - d) + "."), GS("Le produit ?", v, M(v) + ".")], traps: [TR(a + b * c - d, "Deux groupes : deux paires de parenthèses.")] }); },
      () => { const k = R.int(2, 5), b = R.int(2, 9), x = pk([["le " + ["", "", "double", "triple", "quadruple", "quintuple"][k] + " de la somme de " + M("x") + " et " + M(b), k + "*(x+" + b + ")", k + "*x+" + b, k + " \\cdot (x + " + b + ")"], ["la somme du " + ["", "", "double", "triple", "quadruple", "quintuple"][k] + " de " + M("x") + " et de " + M(b), k + "*x+" + b, k + "*(x+" + b + ")", k + "x + " + b]]);
        return QX("Traduis en expression : " + x[0] + ".", x[1], M(x[3]) + ".",
          { ctx: "litteral", guide: [GX("Écris l'expression", x[1], M(x[3]) + ".")], traps: [TX(x[2], "Regarde le premier mot : il dit quelle opération se fait en dernier.")] }); },
    ],
    3: [
      () => { const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 7), v = (a + b) ** 2 - 3 * c;
        return QN("Calcule le carré de la somme de " + M(a) + " et " + M(b) + ", diminué du triple de " + M(c) + ".", v, M("(" + a + " + " + b + ")^2 - 3 \\cdot " + c + " = " + (a + b) ** 2 + " - " + 3 * c + " = " + v) + ".",
          { ctx: "carre-somme", guide: [GS("Le carré de la somme ?", (a + b) ** 2, M((a + b) ** 2) + "."), GS("Moins le triple de " + M(c) + " ?", v, M(v) + ".")], traps: [TR(a * a + b * b - 3 * c, "Le carré de la somme n'est pas la somme des carrés.")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 9), sum = R.rand() < 0.5, v = sum ? a * a + b * b : (a + b) ** 2;
        return QN("Calcule " + (sum ? "la somme des carrés" : "le carré de la somme") + " de " + M(a) + " et " + M(b) + ".", v, M(sum ? a + "^2 + " + b + "^2 = " + a * a + " + " + b * b + " = " + v : "(" + a + " + " + b + ")^2 = " + (a + b) + "^2 = " + v) + ".",
          { ctx: sum ? "somme-carres" : "carre-somme2", guide: [GS(sum ? "Les deux carrés, additionnés ?" : "D'abord la somme ?", sum ? v : a + b, sum ? M(v) + "." : M(a + b) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(sum ? (a + b) ** 2 : a * a + b * b, sum ? "« La somme des carrés » : on élève chacun au carré, puis on additionne." : "« Le carré de la somme » : on additionne d'abord, puis on élève au carré.")] }); },
      () => { const b = R.int(2, 9), x = pk([["le carré de la différence entre " + M("x") + " et " + M(b), "(x-" + b + ")^2", "x^2-" + b, "(x - " + b + ")^2", "carre-diff"], ["la différence entre le carré de " + M("x") + " et " + M(b), "x^2-" + b, "(x-" + b + ")^2", "x^2 - " + b, "diff-carre"], ["la moitié du carré de " + M("x") + ", diminuée de " + M(b), "x^2/2-" + b, "(x^2-" + b + ")/2", "\\frac{x^2}{2} - " + b, "moitie-carre"]]);
        return QX("Traduis en expression : " + x[0] + ".", x[1], M(x[3]) + ".",
          { ctx: x[4], guide: [GX("Écris l'expression", x[1], M(x[3]) + ".")], traps: [TX(x[2], "Lis la phrase de gauche à droite : le premier mot est la dernière opération faite.")] }); },
    ],
  };

  // ===================== divcrit =====================
  const DC = {
    1: [
      () => { const k = pk([3, 9]); let ns; do ns = [0, 0, 0, 0].map(() => R.int(101, 998)); while (ns.filter((n) => n % k === 0).length !== 1 || new Set(ns).size < 4); const ok = ns.find((n) => n % k === 0);
        return QN("Lequel de ces nombres est divisible par " + M(k) + " ? " + lst(ns), ok, "Somme des chiffres de " + M(ok) + " : " + M(String(ok).split("").join(" + ") + " = " + dsum(ok)) + ", divisible par " + M(k) + ".",
          { ctx: "lequel-" + k, guide: [GS("Somme des chiffres de " + M(ok) + " ?", dsum(ok), M(dsum(ok)) + "."), GS("Le nombre divisible par " + M(k) + " ?", ok, M(ok) + ".")], traps: ns.filter((n) => n !== ok).map((n) => TR(n, "Somme des chiffres de " + n + " : " + dsum(n) + ", pas un multiple de " + k + ".")) }); },
      () => { let n; do n = R.int(1000, 9990); while ([2, 3, 5, 9, 10].filter((d) => n % d === 0).length < 2); const ok = [2, 3, 5, 9, 10].filter((d) => n % d === 0);
        return QN("Par combien des nombres " + lst([2, 3, 5, 9, 10]) + " le nombre " + M(n) + " est-il divisible ?", ok.length, "Divisible par " + ok.join(", ") + " (unités : " + (n % 10) + " ; somme des chiffres : " + dsum(n) + ") : " + M(ok.length) + ".",
          { ctx: "combien-crit", guide: [GS("Somme des chiffres de " + M(n) + " ?", dsum(n), M(dsum(n)) + "."), GS("Nombre de diviseurs de la liste ?", ok.length, ok.join(", ") + ".")], traps: [TR(ok.length + 1, "Pour 3 et 9, c'est la somme des chiffres qui compte."), TR(ok.length - 1, "Vérifie chaque critère : 2 (pair), 3, 5, 9, 10.")] }); },
      () => { let a, c; do { a = R.int(1, 9); c = R.int(0, 9); } while ((a + c) % 3 === 0); const x = (3 - ((a + c) % 3)) % 3;
        return QN("Quel est le plus petit chiffre à écrire à la place de ■ pour que " + M(a + "\\,■\\," + c) + " soit divisible par " + M(3) + " ?", x, "Somme " + M(a + " + " + c + " + ■") + " multiple de 3 : le plus petit chiffre est " + M(x) + " (" + M(a + c + x) + ").",
          { ctx: "chiffre-3", guide: [GS("Somme des chiffres connus ?", a + c, M(a + c) + "."), GS("Plus petit chiffre ■ ?", x, M(x) + ".")], traps: [TR(x + 3, "Ça marche aussi, mais on demande le plus petit."), TR((3 - (c % 3)) % 3, "C'est la somme de TOUS les chiffres qui doit être un multiple de 3.")] }); },
      () => { let a, c; do { a = R.int(1, 9); c = R.int(0, 9); } while ((a + c) % 9 === 0 || (a + c) % 9 === 8); const x = 9 - ((a + c) % 9); /* 24.11 : chiffre jamais 1 */
        return QN("Quel chiffre faut-il écrire à la place de ■ pour que " + M(a + "\\,■\\," + c) + " soit divisible par " + M(9) + " ?", x, "La somme des chiffres doit être un multiple de 9 : " + M(a + " + " + c + " + " + x + " = " + (a + c + x)) + ".",
          { ctx: "chiffre-9", guide: [GS("Somme des chiffres connus ?", a + c, M(a + c) + "."), GS("Chiffre ■ ?", x, M(x) + ".")], traps: [TR(x > 3 ? x - 3 : x + 3, "Pour 9, il faut un multiple de 9 (pas seulement de 3).")] }); },
    ],
    2: [
      () => { const [k, txt, why] = pk([[6, "à la fois par 2 et par 3", "pair et somme des chiffres multiple de 3"], [15, "à la fois par 3 et par 5", "finit par 0 ou 5 et somme multiple de 3"], [4, "par 4", "le nombre formé par les deux derniers chiffres est divisible par 4"], [25, "par 25", "finit par 00, 25, 50 ou 75"]]); let ns; do ns = [0, 0, 0, 0, 0].map(() => (R.rand() < 0.5 ? k * R.int(26, 249) : R.int(101, 998))); while (new Set(ns).size < 5 || ns.filter((n) => n % k === 0).length < 1 || ns.filter((n) => n % k === 0).length > 3); const ok = ns.filter((n) => n % k === 0);
        return QN("Combien de ces nombres sont divisibles " + txt + " ? " + lst(ns), ok.length, "Critère : " + why + ". Conviennent : " + ok.join(", ") + ".",
          { ctx: "compte-" + k, guide: [GS("Critère : " + why + ". Combien ?", ok.length, ok.join(", ") + ".")], traps: [TR(ns.filter((n) => n % (k === 6 ? 2 : k === 15 ? 5 : k === 4 ? 2 : 5) === 0).length, k === 4 ? "Pair ne suffit pas : regarde les deux derniers chiffres." : k === 25 ? "Finir par 5 ne suffit pas." : "Il faut les deux critères à la fois.")] }); },
      () => { const a = R.int(1, 9), b = R.int(0, 9), cand = [0, 2, 4, 6, 8].filter((x) => (a + b + x) % 3 === 0); if (!cand.length) return null; const x = cand[0];
        return QN("Quel est le plus petit chiffre ■ pour que " + M(a + "\\," + b + "\\,■") + " soit divisible par " + M(6) + " ?", x, "Divisible par 6 = pair ET divisible par 3 : ■ pair et " + M(a + " + " + b + " + ■") + " multiple de 3 → " + M(x) + ".",
          { ctx: "chiffre-6", guide: [GS("Somme des deux premiers chiffres ?", a + b, M(a + b) + "."), GS("Plus petit chiffre pair qui rend la somme multiple de 3 ?", x, M(x) + ".")], traps: [TR((3 - ((a + b) % 3)) % 3, "Divisible par 6 : le nombre doit aussi être pair.")] }); },
      () => { const [k, txt] = pk([[30, "par 2, par 3 et par 5"], [18, "par 2 et par 9"], [45, "par 5 et par 9"], [12, "par 3 et par 4"]]), L = R.int(130, 870), v = Math.floor(L / k) * k + k;
        return QN("Quel est le plus petit nombre strictement supérieur à " + M(L) + " divisible " + txt + " ?", v, "Divisible " + txt + " = divisible par " + M(k) + " : " + M(v) + ".",
          { ctx: "plus-petit-" + k, guide: [GS("Divisible " + txt + " revient à divisible par… ?", k, M(k) + "."), GS("Premier multiple de " + M(k) + " après " + M(L) + " ?", v, M(v) + ".")], traps: [TR(v - k, "Strictement supérieur à " + L + "."), TR(Math.floor(L / 6) * 6 + 6, "Vérifie tous les critères.")] }); },
    ],
    3: [
      () => { const a = R.int(1, 9), b = R.int(0, 9), k = pk([3, 9]), c = [...Array(10).keys()].filter((x) => (a + b + x) % k === 0).length;
        return QN("Combien de chiffres ■ (de 0 à 9) rendent " + M(a + "\\,■\\," + b) + " divisible par " + M(k) + " ?", c, "La somme " + M(a + " + " + b + " + ■") + " doit être un multiple de " + k + " : ■ ∈ {" + [...Array(10).keys()].filter((x) => (a + b + x) % k === 0).join(" ; ") + "}, soit " + M(c) + ".",
          { ctx: "combien-chiffres-" + k, guide: [GS("Plus petit ■ qui convient ?", [...Array(10).keys()].find((x) => (a + b + x) % k === 0), "On ajoute ensuite " + k + " à chaque fois."), GS("Nombre de chiffres ?", c, M(c) + ".")], traps: [TR(1, "Plusieurs chiffres conviennent : on peut ajouter " + k + " à ■ tant qu'on reste ≤ 9.")] }); },
      () => { const a = R.int(1, 9), b = R.int(0, 9), cand = [...Array(10).keys()].filter((x) => (a * 100 + b * 10 + x) % 12 === 0); if (!cand.length) return null; const x = cand[0];
        return QN("Quel est le plus petit chiffre ■ pour que " + M(a + "\\," + b + "\\,■") + " soit divisible par " + M(12) + " ?", x, "Divisible par 12 = par 3 et par 4 : " + M(b + "■") + " divisible par 4 et somme des chiffres multiple de 3 → " + M(a * 100 + b * 10 + x) + ".",
          { ctx: "chiffre-12", guide: [GS("12 = 3 · 4. Plus petit ■ qui marche ?", x, M(a * 100 + b * 10 + x) + " = " + M("12 \\cdot " + (a * 100 + b * 10 + x) / 12) + ".")], traps: [TR([...Array(10).keys()].find((y) => (a + b + y) % 3 === 0 && y % 2 === 0 && y !== x), "Pair ne suffit pas pour 4 : les deux derniers chiffres doivent former un multiple de 4.")] }); },
      () => { const k = pk([6, 15, 18]), lo = R.int(100, 400), hi = lo + R.int(40, 90), c = Math.floor(hi / k) - Math.floor((lo - 1) / k);
        return QN("Combien de nombres entre " + M(lo) + " et " + M(hi) + " (compris) sont divisibles à la fois par " + (k === 6 ? M(2) + " et " + M(3) : k === 15 ? M(3) + " et " + M(5) : M(2) + " et " + M(9)) + " ?", c, "Ce sont les multiples de " + M(k) + " : de " + M(Math.ceil(lo / k) * k) + " à " + M(Math.floor(hi / k) * k) + ", soit " + M(c) + ".",
          { ctx: "compte-intervalle-" + k, guide: [GS("Divisible par les deux revient à divisible par… ?", k, M(k) + "."), GS("Premier multiple de " + M(k) + " ≥ " + M(lo) + " ?", Math.ceil(lo / k) * k, M(Math.ceil(lo / k) * k) + "."), GS("Combien de multiples jusqu'à " + M(hi) + " ?", c, M(c) + ".")], traps: [TR(c + 1, "Compte bien : du premier au dernier multiple, pas à pas de " + k + "."), TR(Math.floor((hi - lo) / k), "Compte les multiples réellement présents (le premier n'est pas forcément " + lo + ").")] }); },
    ],
  };

  // ===================== racenc =====================
  const RC = {
    1: [
      () => { const n = R.int(5, 150), f = Math.floor(Math.sqrt(n)); if (f * f === n) return null; const lo = R.rand() < 0.5;
        return QN("Le nombre " + M("\\sqrt{" + n + "}") + " est compris entre deux entiers consécutifs. Quel est le plus " + (lo ? "petit" : "grand") + " des deux ?", lo ? f : f + 1, M(f * f + " < " + n + " < " + (f + 1) ** 2) + ", donc " + M(f + " < \\sqrt{" + n + "} < " + (f + 1)) + ".",
          { ctx: lo ? "encadre-bas" : "encadre-haut", guide: [GS("Plus grand carré parfait inférieur à " + M(n) + " ?", f * f, M(f * f + " = " + f + "^2") + "."), GS("Donc l'entier cherché ?", lo ? f : f + 1, M(f + " < \\sqrt{" + n + "} < " + (f + 1)) + ".")], traps: [TR(Math.round(n / 2), "La racine n'est pas la moitié."), TR(lo ? f + 1 : f, lo ? "On demande le plus petit des deux." : "On demande le plus grand des deux.")] }); },
      () => { const k = R.int(4, 12), d = pk([1, 2, -1, -2]), n = k * k + d; const near = k;
        return QN("Quel est l'entier le plus proche de " + M("\\sqrt{" + n + "}") + " ?", near, M(n) + " est tout près de " + M(k * k + " = " + k + "^2") + " : " + M("\\sqrt{" + n + "} \\approx " + k) + ".",
          { ctx: "proche", guide: [GS("Carré parfait le plus proche de " + M(n) + " ?", k * k, M(k * k) + "."), GS("Entier le plus proche ?", k, M(k) + ".")], traps: [TR(d > 0 ? k + 1 : k - 1, M(n) + " est bien plus proche de " + k * k + " que de " + (d > 0 ? (k + 1) ** 2 : (k - 1) ** 2) + "."), TR(Math.round(n / 2), "La racine n'est pas la moitié.")] }); },
      () => { const k = R.int(3, 12), n = k * k + pk([-3, -2, -1, 1, 2, 3]), big = R.rand() < 0.5, rb = n > k * k;
        return QN("Quel est le plus " + (big ? "grand" : "petit") + " de ces deux nombres : " + M(k) + " ou " + M("\\sqrt{" + n + "}") + " ?", rb === big ? Math.sqrt(n) : k, M(k + " = \\sqrt{" + k * k + "}") + " et " + M(k * k + (rb ? " < " : " > ") + n) + ", donc " + M(k + (rb ? " < " : " > ") + "\\sqrt{" + n + "}") + ".",
          { ctx: "comparer", guide: [GS(M(k + "^2") + " = ?", k * k, M(k * k) + "."), GS("Le plus " + (big ? "grand" : "petit") + " ?", rb === big ? Math.sqrt(n) : k, rb === big ? M("\\sqrt{" + n + "}") + "." : M(k) + ".")], traps: [TR(rb === big ? k : Math.sqrt(n), "Compare les carrés : " + k * k + " et " + n + ".")] }); },
    ],
    2: [
      () => { const n = R.int(5, 12), k = n * n + R.int(1, 2 * n), mid = Math.sqrt(k);
        return QN("On range " + M("\\sqrt{" + k + "}") + ", " + M(n) + " et " + M(n + 1) + " dans l'ordre croissant. Lequel est au milieu ?", mid, M(n * n + " < " + k + " < " + (n + 1) ** 2) + ", donc " + M(n + " < \\sqrt{" + k + "} < " + (n + 1)) + ".",
          { ctx: "ranger", guide: [GS(M(n + "^2") + " = ?", n * n, M(n * n) + "."), GS(M((n + 1) + "^2") + " = ?", (n + 1) ** 2, M((n + 1) ** 2) + "."), GS("Au milieu ?", mid, M("\\sqrt{" + k + "}") + ".")], traps: [TR(n, M(n) + " est plus petit que " + M("\\sqrt{" + k + "}") + "."), TR(n + 1, M(n + 1) + " est plus grand.")] }); },
      () => { const n = pk([2, 3, 5, 6, 7, 10, 11, 13]), v = Math.floor(Math.sqrt(n) * 10) / 10; if (Math.abs(Math.sqrt(n) * 10 - Math.round(Math.sqrt(n) * 10)) < 0.05) return null;
        return QN("Encadre " + M("\\sqrt{" + n + "}") + " au dixième : quel est le nombre " + M("a") + " (à un chiffre après la virgule) tel que " + M("a < \\sqrt{" + n + "} < a + 0{,}1") + " ?", v,
          M(String(v).replace(".", "{,}") + "^2 = " + String(+(v * v).toFixed(2)).replace(".", "{,}") + " < " + n + " < " + String(+((v + 0.1) ** 2).toFixed(2)).replace(".", "{,}") + " = " + String(+(v + 0.1).toFixed(1)).replace(".", "{,}") + "^2") + ".",
          { ctx: "dixieme", guide: [GS("Entier juste en dessous de " + M("\\sqrt{" + n + "}") + " ?", Math.floor(Math.sqrt(n)), M(Math.floor(Math.sqrt(n))) + "."), GS("Essaie les carrés de " + M(Math.floor(Math.sqrt(n)) + "{,}1") + ", " + M(Math.floor(Math.sqrt(n)) + "{,}2") + "… Valeur de " + M("a") + " ?", v, M(String(v).replace(".", "{,}")) + ".")], traps: [TR(+(v + 0.1).toFixed(1), "C'est la borne du dessus (son carré dépasse " + n + ")."), TR(n / 2, "La racine n'est pas la moitié.")] }); },
      () => { const a = pk([2, 3, 5]), b = pk([2, 3, 5, 6, 7]), A = a * a * b, d = pk([-1, 1, 2, -2]), C = A + d; if (C <= 0) return null; const big = A > C;
        return QN("Quel est le plus grand : " + M(a + "\\sqrt{" + b + "}") + " ou " + M("\\sqrt{" + C + "}") + " ?", big ? a * Math.sqrt(b) : Math.sqrt(C), M(a + "\\sqrt{" + b + "} = \\sqrt{" + a * a + " \\cdot " + b + "} = \\sqrt{" + A + "}") + ", et " + M(A + (big ? " > " : " < ") + C) + ".",
          { ctx: "comparer-coef", guide: [GS("Écris " + M(a + "\\sqrt{" + b + "}") + " sous la forme " + M("\\sqrt{n}") + " : " + M("n") + " = ?", A, M(a + "^2 \\cdot " + b + " = " + A) + "."), GS("Le plus grand ?", big ? a * Math.sqrt(b) : Math.sqrt(C), big ? M(a + "\\sqrt{" + b + "}") + "." : M("\\sqrt{" + C + "}") + ".")], traps: [TR(big ? Math.sqrt(C) : a * Math.sqrt(b), M(a + "\\sqrt{" + b + "}") + " vaut " + M("\\sqrt{" + A + "}") + " (on élève " + a + " au carré pour le rentrer).")] }); },
    ],
    3: [
      () => { const a = R.int(3, 12);
        return QN("Combien y a-t-il de nombres entiers " + M("n") + " tels que " + M(a + " < \\sqrt{n} < " + (a + 1)) + " ?", 2 * a, "Il faut " + M(a * a + " < n < " + (a + 1) ** 2) + " : de " + M(a * a + 1) + " à " + M((a + 1) ** 2 - 1) + ", soit " + M(2 * a) + " entiers.",
          { ctx: "compte-n", guide: [GS("Borne du bas (" + M(a + "^2") + ") ?", a * a, M(a * a) + "."), GS("Borne du haut (" + M((a + 1) + "^2") + ") ?", (a + 1) ** 2, M((a + 1) ** 2) + "."), GS("Entiers strictement entre les deux ?", 2 * a, M((a + 1) ** 2 + " - " + a * a + " - 1 = " + 2 * a) + ".")], traps: [TR(2 * a + 1, "Les bornes sont exclues (inégalités strictes)."), TR(1, "Il y a beaucoup d'entiers entre " + a * a + " et " + (a + 1) ** 2 + ".")] }); },
      () => { const p = R.int(10, 40), q = p + R.int(40, 90), lo = Math.ceil(Math.sqrt(p) + 1e-9), hi = Math.floor(Math.sqrt(q) - 1e-9), c = hi - lo + 1; if (Number.isInteger(Math.sqrt(p)) || Number.isInteger(Math.sqrt(q)) || c < 2) return null;
        return QN("Combien de nombres entiers sont compris entre " + M("\\sqrt{" + p + "}") + " et " + M("\\sqrt{" + q + "}") + " ?", c, M(lo - 1 + " < \\sqrt{" + p + "} < " + lo) + " et " + M(hi + " < \\sqrt{" + q + "} < " + (hi + 1)) + " : les entiers de " + M(lo) + " à " + M(hi) + ", soit " + M(c) + ".",
          { ctx: "entre-racines", guide: [GS("Premier entier après " + M("\\sqrt{" + p + "}") + " ?", lo, M(lo) + " (" + M(lo + "^2 = " + lo * lo) + ")."), GS("Dernier entier avant " + M("\\sqrt{" + q + "}") + " ?", hi, M(hi) + "."), GS("Combien ?", c, M(c) + ".")], traps: [TR(q - p - 1, "On compte les entiers entre les racines, pas entre " + p + " et " + q + "."), TR(c + 1, "Compte de " + lo + " à " + hi + " inclus.")] }); },
      () => { const k = R.int(4, 12), v = Math.ceil((k + 0.5) ** 2) - 1;
        return QN("Quel est le plus grand entier " + M("n") + " tel que " + M("\\sqrt{n} < " + k + "{,}5") + " ?", v, M("\\sqrt{n} < " + k + "{,}5 \\iff n < " + k + "{,}5^2 = " + String((k + 0.5) ** 2).replace(".", "{,}")) + " : " + M("n = " + v) + ".",
          { ctx: "plus-grand-n", guide: [GS(M(k + "{,}5^2") + " = ?", (k + 0.5) ** 2, M(String((k + 0.5) ** 2).replace(".", "{,}")) + "."), GS("Plus grand entier en dessous ?", v, M(v) + ".")], traps: [TR(k * k, "C'est pour √n < " + k + " ; ici la borne est " + k + ",5."), TR(2 * k + 1, "On élève au carré, on ne double pas.")] }); },
    ],
  };

  // ===================== ensembles =====================
  const EN = {
    1: [
      () => { const a = R.int(-9, -1), b = R.int(1, 9);
        return QN("Combien de nombres entiers l'intervalle " + M("[" + a + " \\,;\\, " + b + "]") + " contient-il ?", b - a + 1, "De " + M(a) + " à " + M(b) + ", bornes comprises : " + M(b + " - (" + a + ") + 1 = " + (b - a + 1)) + ".",
          { ctx: "compte-ferme", guide: [GS("Combien d'entiers de " + M(a) + " à " + M(-1) + " ?", -a, M(-a) + "."), GS("En comptant " + M(0) + " et les positifs jusqu'à " + M(b) + ", total ?", b - a + 1, M(b - a + 1) + ".")], traps: [TR(b - a, "Bornes comprises : n'oublie pas de compter les deux bouts (et 0)."), TR(b + a, "On compte de " + a + " à " + b + " : " + b + " − (" + a + ") + 1.")] }); },
      () => { const a = R.int(-9, -1), b = R.int(1, 9), t = R.int(0, 2), I = [["]", "]", b - a], ["[", "[", b - a], ["]", "[", b - a - 1]][t];
        return QN("Combien de nombres entiers l'intervalle " + M(I[0] + a + " \\,;\\, " + b + I[1]) + " contient-il ?", I[2], (t === 0 ? "La borne " + M(a) + " est exclue" : t === 1 ? "La borne " + M(b) + " est exclue" : "Les deux bornes sont exclues") + " : " + M(I[2]) + " entiers.",
          { ctx: "compte-ouvert", guide: [GS("Combien d'entiers si les deux bornes étaient comprises ?", b - a + 1, M(b - a + 1) + "."), GS("Moins les bornes exclues ?", I[2], M(I[2]) + ".")], traps: [TR(b - a + 1, "Crochet tourné vers l'extérieur : la borne est exclue.")] }); },
      () => { const a = R.int(-8, 3), b = a + R.int(2, 9), t = R.int(0, 3), w = [["\\le", "<", true, false], ["<", "\\le", false, true], ["\\le", "\\le", true, true], ["<", "<", false, false]][t];
        return QS("Écris sous forme d'intervalle l'ensemble des " + M("x") + " tels que " + M(a + " " + w[0] + " x " + w[1] + " " + b) + ".", [[a, w[2], b, w[3]]], M(IT([[a, w[2], b, w[3]]])) + " : crochet tourné vers le nombre s'il est compris.",
          { ctx: "ecrire-int", guide: [GSS("Intervalle ?", [[a, w[2], b, w[3]]], M(IT([[a, w[2], b, w[3]]])) + ".")], traps: [TS([[a, !w[2], b, !w[3]]], "« ≤ » : borne comprise, crochet tourné vers le nombre ; « < » : crochet tourné vers l'extérieur.")] }); },
      () => { const a = R.int(-9, 5), b = a + R.int(3, 9), lo = R.rand() < 0.5;
        return QN("Quel est le plus " + (lo ? "petit" : "grand") + " entier de l'intervalle " + M(lo ? "]" + a + " \\,;\\, " + b + "]" : "[" + a + " \\,;\\, " + b + "[") + " ?", lo ? a + 1 : b - 1, (lo ? M(a) + " est exclu : le plus petit entier est " + M(a + 1) : M(b) + " est exclu : le plus grand entier est " + M(b - 1)) + ".",
          { ctx: lo ? "plus-petit-entier" : "plus-grand-entier", guide: [GS("Réponse ?", lo ? a + 1 : b - 1, M(lo ? a + 1 : b - 1) + ".")], traps: [TR(lo ? a : b, "Le crochet est tourné vers l'extérieur : cette borne est exclue.")] }); },
    ],
    2: [
      () => { const a = R.int(-9, -3), c = a + R.int(2, 4), b = c + R.int(2, 6), d = b + R.int(2, 5);
        return QN("Combien de nombres entiers appartiennent à la fois à " + M("[" + a + " \\,;\\, " + b + "]") + " et à " + M("]" + c + " \\,;\\, " + d + "[") + " ?", b - c, "L'intersection est " + M("]" + c + " \\,;\\, " + b + "]") + " : de " + M(c + 1) + " à " + M(b) + ", soit " + M(b - c) + " entiers.",
          { ctx: "inter-compte", guide: [GSS("Intersection ?", [[c, false, b, true]], M("]" + c + " \\,;\\, " + b + "]") + "."), GS("Nombre d'entiers ?", b - c, M(b - c) + ".")], traps: [TR(b - c + 1, M(c) + " est exclu (crochet ouvert)."), TR(d - a, "Ça, c'est la réunion ; on veut les nombres communs.")] }); },
      () => { const a = R.int(-9, -2), c = a + R.int(1, 4), b = c + R.int(2, 6), d = b + R.int(1, 5), ac = R.rand() < 0.5, bc = R.rand() < 0.5, cc = R.rand() < 0.5, dc = R.rand() < 0.5, A = [a, ac, b, bc], B = [c, cc, d, dc];
        return QS("Écris " + M(IT([A]) + " \\cap " + IT([B])) + " sous forme d'intervalle.", [[c, cc, b, bc]], "Partie commune : de " + M(c) + " (borne de la 2e) à " + M(b) + " (borne de la 1re) : " + M(IT([[c, cc, b, bc]])) + ".",
          { ctx: "inter", guide: [GSS("Intersection ?", [[c, cc, b, bc]], M(IT([[c, cc, b, bc]])) + ".")], traps: [TS([[a, ac, d, dc]], "« ∩ » : les nombres communs aux deux (pas la réunion)."), TS([[a, ac, c, cc]], "Regarde où les deux intervalles se chevauchent.")] }); },
      () => { const a = R.int(-9, -2), c = a + R.int(1, 4), b = c + R.int(2, 6), d = b + R.int(1, 5);
        return QS("Écris " + M("[" + a + " \\,;\\, " + b + "] \\cup [" + c + " \\,;\\, " + d + "[") + " sous forme d'un seul intervalle.", [[a, true, d, false]], "Les deux intervalles se chevauchent : la réunion va de " + M(a) + " à " + M(d) + " : " + M("[" + a + " \\,;\\, " + d + "[") + ".",
          { ctx: "union", guide: [GSS("Réunion ?", [[a, true, d, false]], M("[" + a + " \\,;\\, " + d + "[") + ".")], traps: [TS([[c, true, b, true]], "Ça, c'est l'intersection ; « ∪ » réunit tout.")] }); },
      () => { const a = R.int(-9, 9), cl = R.rand() < 0.5, right = R.rand() < 0.5, I = right ? [a, cl, Infinity, false] : [-Infinity, false, a, cl], C = right ? [-Infinity, false, a, !cl] : [a, !cl, Infinity, false];
        return QS("Écris le complémentaire de " + M(IT([I])) + " dans " + M("\\mathbb{R}") + " (tous les réels qui n'y sont pas).", [C], "Tout le reste de la droite : " + M(IT([C])) + " ; la borne change de camp.",
          { ctx: "complement", guide: [GSS("Complémentaire ?", [C], M(IT([C])) + ".")], traps: [TS([right ? [-Infinity, false, a, cl] : [a, cl, Infinity, false]], "La borne " + a + " est déjà dans l'intervalle de départ : elle n'est pas dans le complémentaire (ou l'inverse).")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, 4]), b = R.int(-5, 5), lo = R.int(-6, 0), hi = lo + R.int(2, 6), L = a * lo + b, H = a * hi + b;
        return QS("Écris sous forme d'intervalle l'ensemble des " + M("x") + " tels que " + M(L + " < " + lin(a, b) + " \\le " + H) + ".", [[lo, false, hi, true]], M(L + (b ? (b > 0 ? " - " + b : " + " + -b) : "") + " < " + a + "x \\le " + H + (b ? (b > 0 ? " - " + b : " + " + -b) : "")) + ", puis on divise par " + M(a) + " : " + M(IT([[lo, false, hi, true]])) + ".",
          { ctx: "double-ineq", guide: [GS("Après avoir " + (b > 0 ? "soustrait " + b : b < 0 ? "ajouté " + -b : "rien fait") + ", borne de gauche pour " + M(a + "x") + " ?", L - b, M(L - b) + "."), GSS("Intervalle pour " + M("x") + " ?", [[lo, false, hi, true]], M(IT([[lo, false, hi, true]])) + ".")], traps: [TS([[L, false, H, true]], "Il faut isoler x : enlève " + b + " puis divise par " + a + "."), TS([[lo, true, hi, false]], "Garde les mêmes symboles : < à gauche (exclu), ≤ à droite (compris).")] }); },
      () => { const c = R.int(-6, 6), r = R.int(1, 6), le = R.rand() < 0.5;
        return QS("Écris sous forme d'intervalle l'ensemble des " + M("x") + " dont la distance à " + M(c) + " est " + (le ? "au plus" : "strictement inférieure à") + " " + M(r) + " (" + M("|" + xm(c) + "| " + (le ? "\\le" : "<") + " " + r) + ").", [[c - r, le, c + r, le]], "De " + M(c + " - " + r) + " à " + M(c + " + " + r) + " : " + M(IT([[c - r, le, c + r, le]])) + ".",
          { ctx: "distance", guide: [GS("Borne de gauche (" + M(c + " - " + r) + ") ?", c - r, M(c - r) + "."), GSS("Intervalle ?", [[c - r, le, c + r, le]], M(IT([[c - r, le, c + r, le]])) + ".")], traps: [TS([[-r, le, r, le]], "L'intervalle est centré en " + c + ", pas en 0."), TS([[c - r, !le, c + r, !le]], le ? "« Au plus » : bornes comprises." : "« Strictement » : bornes exclues.")] }); },
      () => { const b = R.int(-3, 8), c = b - R.int(3, 9), bc = R.rand() < 0.5, cc = R.rand() < 0.5, n = b - c + 1 - (bc ? 0 : 1) - (cc ? 0 : 1);
        return QN("Combien de nombres entiers appartiennent à " + M("]-\\infty \\,;\\, " + b + (bc ? "]" : "[") + " \\cap " + (cc ? "[" : "]") + c + " \\,;\\, +\\infty[") + " ?", n, "L'intersection est " + M((cc ? "[" : "]") + c + " \\,;\\, " + b + (bc ? "]" : "[")) + " : " + M(n) + " entiers.",
          { ctx: "inter-infini", guide: [GSS("Intersection ?", [[c, cc, b, bc]], M((cc ? "[" : "]") + c + " \\,;\\, " + b + (bc ? "]" : "[")) + "."), GS("Nombre d'entiers ?", n, M(n) + ".")], traps: [TR(b - c + 1, "Vérifie si chaque borne est comprise ou exclue.")] }); },
    ],
  };

  // ===================== domaine =====================
  const DO = {
    1: [
      () => { const r = nz(-7, 7), k = nz(-9, 9);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{" + k + "}{" + xm(r) + "}") + ".", sans([r]), "On ne divise pas par 0 : " + M(xm(r) + " = 0 \\iff x = " + r) + ", donc " + M("D = " + RM([r])) + ".",
          { ctx: "frac", guide: [GS("Valeur interdite (le dénominateur s'annule) ?", r, M(xm(r) + " = 0 \\iff x = " + r) + "."), GSS("Domaine ?", sans([r]), M(RM([r])) + ".")], traps: [TS(sans([-r]), "Résous " + xm(r) + " = 0 : attention au signe.")] }); },
      () => { const r = nz(-7, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + xm(r) + "}") + ".", [[r, true, Infinity, false]], "Sous une racine, il faut " + M(xm(r) + " \\ge 0") + " : " + M("D = [" + r + " \\,;\\, +\\infty[") + ".",
          { ctx: "racine", guide: [GS("Valeur où " + M(xm(r)) + " s'annule ?", r, M(r) + "."), GSS("Domaine (sous la racine ≥ 0) ?", [[r, true, Infinity, false]], M("[" + r + " \\,;\\, +\\infty[") + ".")], traps: [TS([[r, false, Infinity, false]], "√0 = 0 existe : la borne est comprise."), TS([[-Infinity, false, r, true]], "Il faut " + xm(r) + " ≥ 0, donc x ≥ " + r + "."), TS(sans([r]), "Pour une racine, on exige un nombre positif ou nul, pas seulement ≠ 0.")] }); },
      () => { const a = pk([2, 3, 4, 5]), z = nz(-5, 5), b = -a * z, k = nz(-9, 9);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{" + k + "}{" + lin(a, b) + "}") + ".", sans([z]), M(lin(a, b) + " = 0 \\iff x = " + z) + " : " + M("D = " + RM([z])) + ".",
          { ctx: "frac-lin", guide: [GS("Valeur interdite ?", z, M(a + "x = " + -b + " \\iff x = " + z) + "."), GSS("Domaine ?", sans([z]), M(RM([z])) + ".")], traps: [TS(sans([-b]), "Il faut diviser par " + a + " : " + a + "x = " + -b + "."), TS(sans([-z]), "Attention au signe.")] }); },
    ],
    2: [
      () => { const k = R.int(1, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{x}{x^2 - " + k * k + "}") + ".", sans([-k, k]), M("x^2 - " + k * k + " = 0 \\iff x = \\pm " + k) + " : " + M("D = " + RM([-k, k])) + ".",
          { ctx: "frac-carre", guide: [GS("Valeur interdite positive ?", k, M("x^2 = " + k * k + " \\iff x = \\pm " + k) + "."), GSS("Domaine ?", sans([-k, k]), M(RM([-k, k])) + ".")], traps: [TS(sans([k]), "x² = " + k * k + " a deux solutions : " + k + " et −" + k + "."), TS(sans([k * k]), "On cherche x tel que x² = " + k * k + ".")] }); },
      () => { const a = -R.int(2, 5), z = nz(-4, 4), b = -a * z;
        return QS("Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + ".", [[-Infinity, false, z, true]], M(lin(a, b) + " \\ge 0 \\iff " + a + "x \\ge " + -b + " \\iff x \\le " + z) + " (division par " + M(a) + " : on retourne le signe) : " + M("D = ]-\\infty \\,;\\, " + z + "]") + ".",
          { ctx: "racine-neg", guide: [GS("Valeur où " + M(lin(a, b)) + " s'annule ?", z, M(z) + "."), GSS("Domaine ?", [[-Infinity, false, z, true]], M("]-\\infty \\,;\\, " + z + "]") + " (sens retourné).")], traps: [TS([[z, true, Infinity, false]], "En divisant par " + a + " (négatif), on retourne le sens de l'inégalité.")] }); },
      () => { const r = nz(-7, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{1}{\\sqrt{" + xm(r) + "}}") + ".", [[r, false, Infinity, false]], "Racine : " + M(xm(r) + " \\ge 0") + " ; dénominateur non nul : " + M(xm(r) + " \\ne 0") + ". Donc " + M(xm(r) + " > 0") + " : " + M("D = ]" + r + " \\,;\\, +\\infty[") + ".",
          { ctx: "inv-racine", guide: [GS("Valeur où " + M(xm(r)) + " s'annule ?", r, M(r) + "."), GSS("Domaine (strictement positif) ?", [[r, false, Infinity, false]], M("]" + r + " \\,;\\, +\\infty[") + ".")], traps: [TS([[r, true, Infinity, false]], "En " + r + ", le dénominateur vaut √0 = 0 : borne exclue.")] }); },
      () => { const p = nz(-6, 5), q = p + R.int(1, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{3}{(" + xm(p) + ")(" + xm(q) + ")}") + ".", sans([p, q]), "Un produit est nul si l'un des facteurs est nul : " + M("x = " + p) + " ou " + M("x = " + q) + ". " + M("D = " + RM([p, q])) + ".",
          { ctx: "frac-produit", guide: [GS("Plus petite valeur interdite ?", p, M(p) + "."), GSS("Domaine ?", sans([p, q]), M(RM([p, q])) + ".")], traps: [TS(sans([-p, -q]), "Résous chaque facteur = 0 : attention aux signes."), TS(sans([p]), "Il y a deux valeurs interdites.")] }); },
    ],
    3: [
      () => { const r = nz(-6, 4), s = r + R.int(1, 6);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{\\sqrt{" + xm(r) + "}}{" + xm(s) + "}") + ".", [[r, true, s, false], [s, false, Infinity, false]], "Il faut " + M("x \\ge " + r) + " et " + M("x \\ne " + s) + " : " + M("D = " + IT([[r, true, s, false], [s, false, Infinity, false]])) + ".",
          { ctx: "racine-frac", guide: [GSS("Condition de la racine ?", [[r, true, Infinity, false]], M("x \\ge " + r) + "."), GS("Valeur interdite du dénominateur ?", s, M(s) + "."), GSS("Domaine ?", [[r, true, s, false], [s, false, Infinity, false]], M(IT([[r, true, s, false], [s, false, Infinity, false]])) + ".")], traps: [TS([[r, true, Infinity, false]], "N'oublie pas d'exclure " + s + " (dénominateur nul)."), TS(sans([s]), "N'oublie pas la condition de la racine : x ≥ " + r + ".")] }); },
      () => { const p = nz(-6, 4), q = p + R.int(1, 6), ext = R.rand() < 0.5, sg = ext ? "" : "-";
        const expr = ext ? tri(-(p + q), p * q) : "-" + "(" + xm(p) + ")(" + xm(q) + ")", ivs = ext ? [[-Infinity, false, p, true], [q, true, Infinity, false]] : [[p, true, q, true]];
        return QS("Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + expr + "}") + ".", ivs, (ext ? M(tri(-(p + q), p * q) + " = (" + xm(p) + ")(" + xm(q) + ")") + " est positif à l'extérieur des racines" : "Le produit " + M("(" + xm(p) + ")(" + xm(q) + ")") + " est négatif entre les racines, donc son opposé y est positif") + " : " + M("D = " + IT(ivs)) + ".",
          { ctx: ext ? "racine-tri-ext" : "racine-tri-int", guide: [GS("Plus petit zéro de l'expression sous la racine ?", p, M(p) + "."), GS("L'autre zéro ?", q, M(q) + "."), GSS("Domaine (expression ≥ 0) ?", ivs, M(IT(ivs)) + ".")], traps: [TS(ext ? [[p, true, q, true]] : [[-Infinity, false, p, true], [q, true, Infinity, false]], ext ? "a > 0 : la parabole est positive à l'extérieur des racines." : "Avec le signe −, l'expression est positive entre les racines."), TS(ext ? [[-Infinity, false, p, false], [q, false, Infinity, false]] : [[p, false, q, false]], "≥ 0 : les zéros sont compris.")] }); },
      () => { const p = nz(-6, 4), q = p + R.int(1, 6);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{x + 1}{" + tri(-(p + q), p * q) + "}") + ".", sans([p, q]), "On factorise : " + M(tri(-(p + q), p * q) + " = (" + xm(p) + ")(" + xm(q) + ")") + ", nul pour " + M("x = " + p) + " ou " + M("x = " + q) + " : " + M("D = " + RM([p, q])) + ".",
          { ctx: "frac-tri", guide: [GS("Somme des deux valeurs interdites (" + M("-b") + ") ?", p + q, M(p + q) + "."), GS("Plus petite valeur interdite ?", p, M(p) + "."), GSS("Domaine ?", sans([p, q]), M(RM([p, q])) + ".")], traps: [TS(sans([-p, -q]), "Les zéros de (x − p)(x − q) sont p et q : attention aux signes."), TS([[p, false, q, false]], "Le dénominateur doit seulement être non nul : on retire deux points, pas un intervalle.")] }); },
    ],
  };

  const PROBS = {
    tradexpr: [
      () => P("Un nombre " + M("x") + " vaut " + M(4) + ".", [["a) Le double de la somme de x et 3", 14], ["b) La somme du double de x et de 3", 11], ["c) Le carré de la différence entre x et 7", 9]], ["Le premier mot dit la dernière opération.", "c) (4 − 7)² = (−3)²."], "a) " + M("2 \\cdot (4 + 3) = 14") + " ; b) " + M("2 \\cdot 4 + 3 = 11") + " ; c) " + M("(4 - 7)^2 = 9") + "."),
    ],
    divcrit: [
      () => P("On cherche le nombre " + M("74\\,■\\,■") + " (deux chiffres à trouver).", [["a) Chiffre des unités pour être divisible par 10", 0], ["b) Puis le chiffre des dizaines pour être divisible par 9", 7], ["c) Combien de nombres 74■0 sont divisibles par 3 ?", 3]], ["Par 10 : finit par 0.", "Par 9 : 7 + 4 + ■ + 0 multiple de 9."], "a) 0 ; b) " + M("7 + 4 + 7 = 18") + " ; c) ■ ∈ {1 ; 4 ; 7} : 3 nombres."),
    ],
    racenc: [
      () => P("On étudie " + M("\\sqrt{70}") + ".", [["a) Entier juste en dessous", 8], ["b) Entier juste au-dessus", 9], ["c) Combien d'entiers n vérifient 8 < √n < 9 ?", 16]], ["64 < 70 < 81.", "c) de 65 à 80."], "a) 8 ; b) 9 ; c) de 65 à 80 : 16 entiers."),
    ],
    ensembles: [
      () => P("A = [−4 ; 6[ et B = ]1 ; 10].", [["a) Nombre d'entiers de A", 10], ["b) Nombre d'entiers de A ∩ B", 4], ["c) Nombre d'entiers de A ∪ B", 15]], ["A : de −4 à 5.", "A ∩ B = ]1 ; 6[ ; A ∪ B = [−4 ; 10]."], "a) 10 ; b) 2, 3, 4, 5 : 4 ; c) de −4 à 10 : 15."),
    ],
    domaine: [
      () => P("f(x) = √(x + 3) / (x − 2).", [["a) Plus petite valeur de x permise par la racine", -3], ["b) Valeur interdite par le dénominateur", 2], ["c) Combien d'entiers de [−5 ; 5] sont dans le domaine ?", 8]], ["x + 3 ≥ 0.", "x ≠ 2."], "a) −3 ; b) 2 ; c) −3, −2, −1, 0, 1, 3, 4, 5 : 8."),
    ],
  };

  const ALL = { tradexpr: TE, divcrit: DC, racenc: RC, ensembles: EN, domaine: DO };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    tradexpr: "Le premier mot de la phrase dit l'opération faite en dernier : « le double de la somme » = 2 · (… + …).",
    divcrit: "Par 2 : pair ; par 5 : 0 ou 5 ; par 4 : deux derniers chiffres ; par 3 ou 9 : somme des chiffres. Par 6 = 2 et 3 ; par 12 = 3 et 4.",
    racenc: "Encadre par deux carrés parfaits : 49 < 50 < 64, donc 7 < √50 < 8. Pour comparer, compare les carrés.",
    ensembles: "Crochet tourné vers le nombre : compris ; vers l'extérieur : exclu. ∩ = partie commune, ∪ = tout réunir.",
    domaine: "Interdit : diviser par 0, racine d'un négatif. Cherche les valeurs qui annulent le dénominateur, puis où l'expression sous la racine est ≥ 0.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    tradexpr: ["Traduire une phrase en calcul", "Phrases à deux opérations, expressions", "Carrés, sommes de carrés, expressions"],
    divcrit: ["Critères par 2, 3, 5, 9, 10", "Par 4, 6, 15, 25 : combiner", "Chiffres manquants, compter"],
    racenc: ["Encadrer, comparer à un entier", "Ranger, au dixième, a√b", "Compter des entiers, plus grand n"],
    ensembles: ["Intervalles et entiers", "Intersection, réunion, complémentaire", "Inégalités, distance, infini"],
    domaine: ["Fraction, racine simple", "Deux valeurs interdites, sens retourné", "Racine et fraction, trinôme"],
  });
})();

// Chantier 1re Collège (bêta-testeurs) · lot 3 du plan pas à pas (19.11) : une seule source pour fimg, lectgraph,
// racinv, modaff, transf ; absval et morceaux ajoutés le 20.11 (dernières notions de 1re sans pas à pas). Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs typiques,
// étiquette ctx, figures (repère gradué) ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(6)); return Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(4)).replace(".", "{,}"); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const sg = (v) => (v < 0 ? " - " + -v : " + " + v);
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? sg(b) : "");
  const tri = (a, b, c) => (a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + (b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x" : "") + (c ? sg(c) : "");
  const IT = (ivs) => ivs.map(([a, ac, b, bc]) => (ac ? "[" : "]") + (a === -Infinity ? "-\\infty" : a) + " \\,;\\, " + (b === Infinity ? "+\\infty" : b) + (bc ? "]" : "[")).join(" \\cup ");
  // ---------- constructeurs ----------
  const show = (spec) => spec.kind === "pair" ? spec.values.map(fS).join(" ; ") : spec.kind === "set" ? spec.values.map(fS).join(" ; ") : SolSet.show(spec.ivs, false);
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({}, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
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
  const FA = " (fraction acceptée)";
  const PL = (fns, o = {}) => FIG.plot(fns, [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));

  // ===================== fimg =====================
  const FI = {
    1: [
      () => { const b = nz(-5, 5), c = nz(-6, 6), x = -R.int(1, 4), v = x * x + b * x + c;
        return QN("Soit " + M("f(x) = " + tri(1, b, c)) + ". Calcule " + M("f(" + x + ")") + ".", v, M(par(x) + "^2" + (b < 0 ? " - " + -b : " + " + b) + " \\cdot " + par(x) + sg(c) + " = " + x * x + sg(b * x) + sg(c) + " = " + v) + ".",
          { ctx: "image-poly", guide: [GS(M(par(x) + "^2") + " = ?", x * x, M(x * x) + " (un carré est positif)."), GS(M(b + " \\cdot " + par(x)) + " = ?", b * x, M(b * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")],
            traps: [TR(-x * x + b * x + c, M(par(x) + "^2 = " + x * x) + " : avec les parenthèses, le carré est positif."), TR(x * x - b * x + c, "Attention au signe de " + b + " · (" + x + ").")] }); },
      () => { const a = nz(-4, 5), b = nz(-8, 8), y = R.int(-15, 15), x = (y - b) / a; if (!Number.isInteger(x) || a === 1) return null;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Détermine la préimage de " + M(y) + ".", x, M(lin(a, b) + " = " + y + " \\iff " + a + "x = " + (y - b) + " \\iff x = " + x) + ".",
          { ctx: "preimage-aff", guide: [GS("On résout " + M(lin(a, b) + " = " + y) + ". D'abord " + M(a + "x") + " = ?", y - b, M(y - b) + "."), GS(M("x") + " = ?", x, M(x) + ".")],
            traps: [TR(a * y + b, "Ça, c'est l'image de " + y + " ; on cherche x tel que f(x) = " + y + "."), TR((y + b) / a, "On soustrait " + b + " des deux côtés.")] }); },
      () => { const a = pk([0.5, 1, -1, -0.5]), p = R.int(-3, 0), q = p + R.int(2, 4), f = (x) => a * (x - p) * (x - q), xs = [-3, -2, -1, 0, 1, 2, 3, 4].filter((x) => Number.isInteger(f(x)) && Math.abs(f(x)) <= 5 && Math.abs(f(x)) !== 1 && x !== p && x !== q && x !== 0); if (!xs.length) return null; const x = pk(xs);
        return QN("La courbe représente une fonction " + M("f") + ". Lis " + M("f(" + x + ")") + " sur le graphique.", f(x), "On part de " + M("x = " + x) + " sur l'axe horizontal, on monte (ou descend) jusqu'à la courbe, puis on lit l'ordonnée : " + M("f(" + x + ") = " + f(x)) + ".",
          { ctx: "lire-image", fig: PL([{ f }]), guide: [GS("Ordonnée du point de la courbe d'abscisse " + M(x) + " ?", f(x), M(f(x)) + ".")], traps: [TR(x, "f(" + x + ") est une ordonnée (hauteur), pas une abscisse."), TR(-f(x), "Vérifie si le point est au-dessus ou en dessous de l'axe.")] }); },
    ],
    2: [
      () => { const k = R.int(-5, 5), r = R.int(2, 7);
        return QN("Soit " + M("f(x) = \\sqrt{" + xm(-k) + "}") + ". Calcule " + M("f(" + (r * r - k) + ")") + ".", r, M("\\sqrt{" + (r * r - k) + sg(k) + "} = \\sqrt{" + r * r + "} = " + r) + ".",
          { ctx: "image-racine", guide: [GS("Sous la racine, " + M((r * r - k) + sg(k)) + " = ?", r * r, M(r * r) + "."), GS("Racine ?", r, M(r) + ".")], traps: [TR(Math.sqrt(r * r - k) + k, "On calcule d'abord tout ce qui est sous la racine."), TR(r * r, "N'oublie pas la racine.")] }); },
      () => { const c = R.int(-6, 4), v = R.int(2, 7), y = v * v + c;
        return QSet("Soit " + M("f(x) = x^2" + (c ? sg(c) : "")) + ". Détermine les préimages de " + M(y) + ".", [v, -v], M("x^2" + (c ? sg(c) : "") + " = " + y + " \\iff x^2 = " + v * v) + " : " + M("x = " + v) + " ou " + M("x = -" + v) + ".",
          { ctx: "preimage-carre", fig: FIG.parabola((t) => (t * t + c) / 3, [], null, false), guide: [GS(M("x^2") + " = ?", v * v, M(v * v) + "."), GSet("Préimages ?", [v, -v], M(v) + " et " + M(-v) + ".")], traps: [TSet([v], "Un carré a deux racines : " + v + " et −" + v + "."), TSet([y * y + c], "On cherche x tel que f(x) = " + y + ", pas f(" + y + ").")] }); },
      () => { const p = R.int(-4, 1), q = p + R.int(2, 5), f = (x) => 0.5 * (x - p) * (x - q), xs = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x < (p + q) / 2 && Number.isInteger(f(x)) && f(x) > 0 && f(x) <= 5); if (!xs.length) return null; const x1 = pk(xs), k = f(x1), x2 = p + q - x1;
        return QSet("La courbe représente une fonction " + M("f") + ". Lis les solutions de " + M("f(x) = " + k) + " (la droite " + M("y = " + k) + " est en pointillé).", [x1, x2], "La droite horizontale " + M("y = " + k) + " coupe la courbe en " + M("x = " + x1) + " et " + M("x = " + x2) + ".",
          { ctx: "lire-preimages", fig: PL([{ f }], { hlines: [k] }), guide: [GS("Abscisse du point d'intersection de gauche ?", x1, M(x1) + "."), GSet("Solutions ?", [x1, x2], M(x1) + " et " + M(x2) + ".")], traps: [TSet([x1], "La droite coupe la courbe deux fois."), TSet([p, q], "Ça, ce sont les zéros (f(x) = 0) ; on cherche f(x) = " + k + ".")] }); },
    ],
    3: [
      () => { const p = nz(-5, 4), q = p + R.int(1, 6), y = nz(-8, 8), b = -(p + q), c = p * q + y;
        return QSet("Soit " + M("f(x) = " + tri(1, b, c)) + ". Détermine les préimages de " + M(y) + ".", [p, q], M(tri(1, b, c) + " = " + y + " \\iff " + tri(1, b, p * q) + " = 0 \\iff (" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + ".",
          { ctx: "preimage-tri", guide: [GX("Ramène à « … = 0 » : expression ?", "x^2" + (b < 0 ? "-" + -b : "+" + b) + "*x" + (p * q < 0 ? "-" + -p * q : "+" + p * q), M(tri(1, b, p * q) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Les zéros de (x − p)(x − q) sont p et q : attention aux signes.")] }); },
      () => { const a = nz(-3, 3), b = nz(-5, 5), x = R.int(-3, 4), fx = a * x + b, v = a * fx + b; if (a === 1 || Math.abs(v) > 60) return null;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Calcule " + M("f(f(" + x + "))") + ".", v, M("f(" + x + ") = " + fx) + ", puis " + M("f(" + fx + ") = " + a + " \\cdot " + par(fx) + sg(b) + " = " + v) + ".",
          { ctx: "compose", guide: [GS("D'abord " + M("f(" + x + ")") + " ?", fx, M(fx) + "."), GS("Puis " + M("f(" + fx + ")") + " ?", v, M(v) + ".")], traps: [TR(fx, "Il faut appliquer f deux fois."), TR(fx * fx, "f(f(x)) n'est pas f(x)².")] }); },
      () => { const a = nz(-4, 5), x = pk([2, 3, -2, -1]), y = a * x * x, r = pk([1, 4, -3, 5].filter((t) => t !== x));
        return QN("Soit " + M("f(x) = ax^2") + " avec " + M("f(" + x + ") = " + y) + ". Calcule " + M("f(" + r + ")") + ".", a * r * r, M(a + " \\cdot " + par(x) + "^2 = " + y) + " donne " + M("a = " + a) + " ; " + M("f(" + r + ") = " + a + " \\cdot " + par(r) + "^2 = " + a * r * r) + ".",
          { ctx: "parametre", guide: [GS("Valeur de " + M("a") + " ?", a, M(y + " : " + par(x * x) + " = " + a) + "."), GS(M("f(" + r + ")") + " ?", a * r * r, M(a * r * r) + ".")], traps: [TR(y / x, "f(" + x + ") = a · " + x + "², donc a = " + y + " ÷ " + x * x + "."), TR(-a * r * r, "Un carré est positif : (" + r + ")² = " + r * r + ".")] }); },
    ],
  };

  // ===================== lectgraph =====================
  const LG = {
    1: [
      () => { const a = pk([0.5, -0.5, 1, -1]), p = R.int(-4, 1), q = p + (Math.abs(a) === 1 ? pk([2, 3, 4]) : pk([2, 3, 4, 5, 6])); if (q > 5) return null; const big = R.rand() < 0.5;
        return QN("La courbe représente une fonction " + M("f") + ". Quel est son plus " + (big ? "grand" : "petit") + " zéro ?", big ? q : p, "La courbe coupe l'axe des " + M("x") + " en " + M(p) + " et en " + M(q) + ".",
          { ctx: "zero", fig: PL([{ f: (x) => a * (x - p) * (x - q) }]), guide: [GS("Plus " + (big ? "grand" : "petit") + " zéro ?", big ? q : p, M(big ? q : p) + ".")], traps: [TR(a * p * q, "Ça, c'est l'ordonnée à l'origine (axe vertical) ; un zéro se lit sur l'axe horizontal."), TR(big ? p : q, "On demande le plus " + (big ? "grand" : "petit") + ".")] }); },
      () => { const a = pk([-1, 1, 0.5]), p = R.int(-3, 0), q = p + 2 * R.int(1, 2), f = (x) => a * (x - p) * (x - q), y0 = f(0); if (!Number.isInteger(y0) || Math.abs(y0) > 5 || y0 === 0) return null;
        return QN("La courbe représente une fonction " + M("f") + ". Quelle est son ordonnée à l'origine " + M("f(0)") + " ?", y0, "La courbe coupe l'axe vertical en " + M(y0) + ".",
          { ctx: "ordonnee", fig: PL([{ f }]), guide: [GS("Où la courbe coupe-t-elle l'axe vertical ?", y0, M(y0) + ".")], traps: [TR(p, "Ça, c'est un zéro (axe horizontal)."), TR(-y0, "Au-dessus ou en dessous de l'axe ?")] }); },
      () => { const m = R.int(-1, 1), s = pk([1, 1.5]), c = pk([-3, -2, 0, 2, 3]), f = cubicF(m, s, c), xs = [], hi = 2 * s + c, lo = -2 * s + c; const n = hi > 0 && lo < 0 ? 3 : 1; if (hi === 0 || lo === 0) return null;
        return QN("La courbe représente une fonction " + M("f") + " (elle continue de monter à droite et de descendre à gauche). Combien de zéros " + M("f") + " a-t-elle ?", n, "La courbe coupe l'axe horizontal " + M(n) + " fois.",
          { ctx: "nb-zeros", fig: PL([{ f }]), guide: [GS("Nombre de points d'intersection avec l'axe horizontal ?", n, M(n) + ".")], traps: [TR(n === 3 ? 1 : 3, "Compte les passages de la courbe sur l'axe horizontal (y = 0)."), TR(2, "Compte bien tous les points.")] }); },
    ],
    2: [
      () => { const m = R.int(-2, 2), s = pk([1, 1.5]), c = R.int(-1, 1), mx = R.rand() < 0.5;
        return QN("La courbe représente une fonction " + M("f") + ". " + (mx ? "Pour quelle valeur de " + M("x") + " atteint-elle son maximum local (le sommet de la « bosse ») ?" : "Elle est décroissante entre deux valeurs de " + M("x") + ". Quelle est la plus grande des deux ?"), mx ? m - 1 : m + 1, "La courbe monte jusqu'en " + M("x = " + (m - 1)) + ", descend jusqu'en " + M("x = " + (m + 1)) + ", puis remonte.",
          { ctx: mx ? "max-local" : "decroissance", fig: PL([{ f: cubicF(m, s, c) }]), guide: [GS("Abscisse de la bosse ?", m - 1, M(m - 1) + "."), GS("Réponse ?", mx ? m - 1 : m + 1, M(mx ? m - 1 : m + 1) + ".")], traps: [TR(mx ? 2 * s + c : m - 1, mx ? "Ça, c'est la valeur du maximum (ordonnée) ; on demande l'abscisse." : "La courbe descend après la bosse, jusqu'au creux."), TR(mx ? m + 1 : -2 * s + c, mx ? "C'est le creux (minimum local)." : "On demande une valeur de x, pas une ordonnée.")] }); },
      () => { const m = R.int(-2, 2), s = pk([1, 1.5]), c = R.int(-1, 1), hi = 2 * s + c, lo = -2 * s + c; let k; do k = R.int(-5, 5); while (k === hi || k === lo); const n = k < hi && k > lo ? 3 : 1;
        return QN("La courbe représente une fonction " + M("f") + " (elle continue de monter à droite et de descendre à gauche). Combien de solutions l'équation " + M("f(x) = " + k) + " a-t-elle ? La droite " + M("y = " + k) + " est tracée en pointillé.", n, "La droite horizontale " + M("y = " + k) + " coupe la courbe en " + M(n) + " point" + (n > 1 ? "s" : "") + ".",
          { ctx: "nb-solutions", fig: PL([{ f: cubicF(m, s, c) }], { hlines: [k] }), guide: [GS("Points d'intersection avec la droite ?", n, M(n) + ".")], traps: [TR(n === 3 ? 1 : 3, "Compte les points d'intersection de la courbe avec la droite pointillée."), TR(k, "On demande un nombre de solutions.")] }); },
      () => { const h = R.int(-3, 3), k = R.int(1, 5), down = R.rand() < 0.5, a = down ? -1 : 1, kk = down ? k : -k, f = (x) => a * (x - h) ** 2 + kk;
        return QN("La courbe représente une fonction " + M("f") + ". Quelle est la valeur " + (down ? "maximale" : "minimale") + " de " + M("f") + " ?", kk, "Le sommet de la parabole est " + M("(" + h + " ; " + kk + ")") + " : la valeur " + (down ? "maximale" : "minimale") + " est " + M(kk) + ".",
          { ctx: down ? "valeur-max" : "valeur-min", fig: PL([{ f }]), guide: [GP("Sommet ? (« x ; y »)", [h, kk], M("(" + h + " ; " + kk + ")") + "."), GS("Valeur " + (down ? "maximale" : "minimale") + " ?", kk, M(kk) + ".")], traps: [TR(h, "La valeur d'une fonction est une ordonnée ; " + h + " est l'abscisse où elle est atteinte.")] }); },
    ],
    3: [
      () => { const p = R.int(-4, 0), q = p + R.int(2, 5), up = R.rand() < 0.5, a = up ? 0.5 : -0.5, f = (x) => a * (x - p) * (x - q), pos = R.rand() < 0.5, inside = up !== pos, ivs = inside ? [[p, false, q, false]] : [[-Infinity, false, p, false], [q, false, Infinity, false]];
        if (q > 5) return null;
        return QS("La courbe représente une fonction " + M("f") + ". Résous " + M("f(x) " + (pos ? ">" : "<") + " 0") + " (où la courbe est-elle " + (pos ? "au-dessus" : "en dessous") + " de l'axe ?).", ivs, "La courbe est " + (pos ? "au-dessus" : "en dessous") + " de l'axe " + (inside ? "entre les zéros" : "à l'extérieur des zéros") + " " + M(p) + " et " + M(q) + " : " + M("S = " + IT(ivs)) + ".",
          { ctx: "signe-graph", fig: PL([{ f }]), guide: [GS("Plus petit zéro ?", p, M(p) + "."), GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(inside ? [[-Infinity, false, p, false], [q, false, Infinity, false]] : [[p, false, q, false]], "Regarde où la courbe est " + (pos ? "au-dessus" : "en dessous") + " de l'axe horizontal."), TS(inside ? [[p, true, q, true]] : [[-Infinity, false, p, true], [q, true, Infinity, false]], "Inégalité stricte : les zéros sont exclus.")] }); },
      () => { const h = R.int(-3, 3), k = R.int(-4, 2), up = R.rand() < 0.5, f = (x) => (up ? 0.5 : -0.5) * (x - h) ** 2 + k, inc = R.rand() < 0.5, ivs = up === inc ? [[h, true, Infinity, false]] : [[-Infinity, false, h, true]];
        return QS("La courbe représente une fonction " + M("f") + ". Sur quel intervalle " + M("f") + " est-elle " + (inc ? "croissante" : "décroissante") + " ?", ivs, "La parabole " + (up ? "descend puis monte" : "monte puis descend") + ", avec son sommet en " + M("x = " + h) + " : " + M(IT(ivs)) + ".",
          { ctx: "variations", fig: PL([{ f }]), guide: [GS("Abscisse du sommet ?", h, M(h) + "."), GSS("Intervalle ?", ivs, M(IT(ivs)) + ".")], traps: [TS(up === inc ? [[-Infinity, false, h, true]] : [[h, true, Infinity, false]], "Croissante = la courbe monte quand on va vers la droite."), TS(up === inc ? [[k, true, Infinity, false]] : [[-Infinity, false, k, true]], "Un intervalle de variation se lit sur l'axe des x.")] }); },
      () => { const p = R.int(-3, 0), q = p + R.int(2, 4), m = pk([1, -1, 0.5]), b0 = R.int(-2, 2), f = (x) => 0.5 * (x - p) * (x - q) + m * x + b0, g = (x) => m * x + b0; if (q > 4 || Math.abs(g(p)) > 5 || Math.abs(g(q)) > 5 || !Number.isInteger(g(p)) || !Number.isInteger(g(q))) return null;
        return QSet("On a tracé les graphes de " + M("f") + " (courbe) et " + M("g") + " (droite). Résous " + M("f(x) = g(x)") + ".", [p, q], "Les deux graphes se coupent en " + M("x = " + p) + " et " + M("x = " + q) + ".",
          { ctx: "f-egal-g", fig: PL([{ f }, { f: g }]), guide: [GS("Abscisse du point d'intersection de gauche ?", p, M(p) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([g(p), g(q)], "On demande les abscisses x, pas les ordonnées."), TSet([p], "Les graphes se coupent deux fois.")] }); },
    ],
  };

  // ===================== racinv =====================
  const RI = {
    1: [
      () => { const a = pk([1, -1]) * R.int(2, 12), x = nz(-6, 6); if (Number.isInteger(a / x) && Math.abs(x) === 1) return null;
        return QN("Soit " + M("f(x) = \\frac{" + a + "}{x}") + ". Calcule " + M("f(" + x + ")") + FA + ".", a / x, M("\\frac{" + a + "}{" + x + "} = " + fT(a / x)) + ".",
          { ctx: "image-inv", fig: FIG.plot([{ f: (t) => a / t }], [], { ticks: true }), guide: [GS("Image" + FA + " ?", a / x, M(fT(a / x)) + ".")], traps: [TR(x / a, "C'est " + a + " divisé par x, pas l'inverse."), TR(a * x, "On divise par x.")] }); },
      () => { const a = pk([1, -1]) * R.int(2, 12), y = pk([2, 3, 4, 6, -2, -3, 5]);
        return QN("Soit " + M("f(x) = \\frac{" + a + "}{x}") + ". Détermine la préimage de " + M(y) + FA + ".", a / y, M("\\frac{" + a + "}{x} = " + y + " \\iff x = \\frac{" + a + "}{" + y + "} = " + fT(a / y)) + ".",
          { ctx: "preimage-inv", guide: [GS("On résout " + M("\\frac{" + a + "}{x} = " + y) + " : " + M("x") + FA + " ?", a / y, M(fT(a / y)) + ".")], traps: [TR(y / a, "x = " + a + " ÷ " + y + " (on multiplie par x puis divise par " + y + ")."), TR(a * y, "Ça, c'est a · y ; il faut diviser.")] }); },
      () => { const c = nz(-5, 5), r = R.int(2, 9);
        return QN("Soit " + M("f(x) = \\sqrt{x}" + sg(c)) + ". Calcule " + M("f(" + r * r + ")") + ".", r + c, M("\\sqrt{" + r * r + "}" + sg(c) + " = " + r + sg(c) + " = " + (r + c)) + ".",
          { ctx: "image-sqrt", fig: FIG.plot([{ f: (t) => Math.sqrt(t) + c, from: 0 }], [], { xr: [-2, 30], yr: [-6, 10], grid: false, ticks: false }), guide: [GS(M("\\sqrt{" + r * r + "}") + " = ?", r, M(r) + "."), GS("Image ?", r + c, M(r + c) + ".")], traps: [TR(Math.sqrt(r * r + c), "La racine porte seulement sur x : on ajoute " + c + " après."), TR(r * r + c, "N'oublie pas la racine.")] }); },
    ],
    2: [
      () => { const t = R.int(2, 5), c = t * t - t;
        return QSet("Résous " + M("\\sqrt{x} = x - " + c) + ". (Attention aux solutions parasites.)", [t * t], "On élève au carré : " + M("x = (x - " + c + ")^2") + ", d'où " + M(t * t) + " et " + M((1 - t) ** 2) + ". Vérification : seule " + M("x = " + t * t) + " convient.",
          { ctx: "sqrt-lin", fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }, { f: (x) => x - c }], [], { xr: [-2, 30], yr: [-3, 7], grid: false, ticks: false }), guide: [GSet("Solutions de " + M("x = (x - " + c + ")^2") + " ?", [t * t, (1 - t) ** 2], M(t * t) + " et " + M((1 - t) ** 2) + "."), GSet("Celles qui vérifient l'équation de départ ?", [t * t], M("\\sqrt{" + (1 - t) ** 2 + "} = " + (t - 1) + " \\ne " + ((1 - t) ** 2 - c)) + " : seule " + M(t * t) + ".")], traps: [TSet([t * t, (1 - t) ** 2], "Vérifie chaque solution : élever au carré peut ajouter des solutions parasites.")] }); },
      () => { const k = nz(-6, 8), m = R.int(2, 7), x = m * m - k;
        return QN("Résous " + M("\\sqrt{" + xm(-k) + "} = " + m) + ".", x, "On élève au carré : " + M(xm(-k) + " = " + m * m) + ", donc " + M("x = " + x) + ".",
          { ctx: "sqrt-const", guide: [GS("Après avoir élevé au carré : " + M(xm(-k)) + " = ?", m * m, M(m * m) + "."), GS(M("x") + " = ?", x, M(x) + ".")], traps: [TR(m - k, "Il faut élever au carré pour enlever la racine."), TR(m * m + k, "Attention au signe : " + xm(-k) + " = " + m * m + ".")] }); },
      () => { const r = R.int(2, 6), k = r * r, a = R.rand() < 0.5 ? 1 : 4, kk = k * a;
        return QSet("Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = \\frac{" + kk + "}{x}") + " et " + M("g(x) = " + (a === 1 ? "" : a) + "x") + " se coupent-ils ?", [r, -r], M("\\frac{" + kk + "}{x} = " + (a === 1 ? "" : a) + "x \\iff x^2 = " + k) + " : " + M("x = \\pm " + r) + ".",
          { ctx: "inv-lin", fig: FIG.plot([{ f: (x) => kk / x }, { f: (x) => a * x }], [], { grid: false, ticks: false, fit: [r, -r, 2 * r, -2 * r, r / 2, -r / 2], maxH: 280 }), guide: [GS("Après avoir multiplié par x : " + M("x^2") + " = ?", k, M(k) + "."), GSet("Solutions ?", [r, -r], M(r) + " et " + M(-r) + ".")], traps: [TSet([r], "x² = " + k + " a deux solutions."), TSet([k, -k], "On cherche x tel que x² = " + k + ".")] }); },
    ],
    3: [
      () => { let p, q; do { p = nz(-5, 5); q = nz(-5, 5); } while (p === q || p + q === 0); const k = p * q, m = -(p + q);
        return QSet("Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = \\frac{" + -k + "}{x}") + " et " + M("g(x) = " + lin(1, m)) + " se coupent-ils ?", [p, q], M("\\frac{" + -k + "}{x} = " + lin(1, m) + " \\iff " + tri(1, m, k) + " = 0") + " ; " + M("x = " + p) + " ou " + M("x = " + q) + ".",
          { ctx: "inv-aff", fig: FIG.plot([{ f: (x) => -k / x }, { f: (x) => x + m }], [], { grid: false, ticks: false, fit: [p, q, 2 * p, 2 * q, p / 2, q / 2], maxH: 280 }), guide: [GX("Multiplie par x et ramène à « … = 0 »", "x^2" + (m < 0 ? "-" + -m : "+" + m) + "*x" + (k < 0 ? "-" + -k : "+" + k), M(tri(1, m, k) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes en factorisant.")] }); },
      () => { const b = R.int(1, 4), t = b + R.int(2, 5), a = (t - b) ** 2 - t, t2 = 2 * b + 1 - t;
        return QSet("Résous " + M("\\sqrt{" + xm(-a) + "} = x - " + b) + ". (Attention aux solutions parasites.)", [t], "Au carré : " + M(xm(-a) + " = (x - " + b + ")^2 \\iff " + tri(1, -(2 * b + 1), b * b - a) + " = 0") + ", d'où " + M(t) + " et " + M(t2) + ". Or " + M(t2 + " - " + b + " < 0") + " : seule " + M("x = " + t) + " convient.",
          { ctx: "sqrt-param", guide: [GSet("Solutions après avoir élevé au carré ?", [t, t2], M(t) + " et " + M(t2) + "."), GSet("Solutions de l'équation de départ ?", [t], M(t2 + " - " + b + " = " + (t2 - b)) + " < 0 : parasite.")], traps: [TSet([t, t2], "Une racine carrée n'est jamais négative : " + t2 + " − " + b + " < 0, donc " + t2 + " est parasite.")] }); },
      () => { const p = pk([1, 2, 3, -2, 4]), q = pk([6, -4, 3, 12, 2]), a = p * q, r = pk([3, 4, -6, 5, 8].filter((x) => x !== p));
        return QN("La courbe de " + M("f(x) = \\frac{a}{x}") + " passe par " + M("P(" + p + " ; " + q + ")") + ". Calcule " + M("f(" + r + ")") + FA + ".", a / r, M("a = " + p + " \\cdot " + par(q) + " = " + a) + ", puis " + M("f(" + r + ") = \\frac{" + a + "}{" + r + "} = " + fT(a / r)) + ".",
          { ctx: "inv-param", guide: [GS(M("a = x \\cdot f(x)") + " = ?", a, M(a) + "."), GS(M("f(" + r + ")") + FA + " ?", a / r, M(fT(a / r)) + ".")], traps: [TR(q / p / r, "a = x · y (on multiplie les coordonnées)."), TR(a * r, "f(" + r + ") = a ÷ " + r + ".")] }); },
    ],
  };

  // ===================== modaff =====================
  const MA = {
    1: [
      () => { const x = pk([["Une piscine propose un abonnement à ", " CHF, puis ", " CHF par entrée. Combien paie-t-on en tout pour ", " entrées (en CHF) ?", "piscine"], ["Un cours de musique coûte une inscription de ", " CHF, puis ", " CHF par leçon. Combien coûtent ", " leçons en tout (en CHF) ?", "musique"], ["Un forfait de téléphone coûte ", " CHF par mois, plus ", " CHF par Go supplémentaire. Combien paie-t-on pour ", " Go supplémentaires (en CHF) ?", "forfait"]]), F = 5 * R.int(4, 16), p = R.int(3, 9), n = R.int(5, 20), v = F + p * n;
        return QN(x[0] + M(F) + x[1] + M(p) + x[2] + M(n) + x[3], v, M("C(n) = " + F + " + " + p + "n") + " : " + M("C(" + n + ") = " + F + " + " + p + " \\cdot " + n + " = " + v) + " CHF.",
          { ctx: x[4], guide: [GS("Part variable (" + M(p + " \\cdot " + n) + ") ?", p * n, M(p * n) + "."), GS("Total ?", v, M(v) + " CHF.")], traps: [TR((F + p) * n, "La part fixe se paie une seule fois."), TR(p * n, "N'oublie pas la part fixe de " + F + " CHF.")] }); },
      () => { const F = 5 * R.int(2, 10), p = R.int(2, 9), n1 = R.int(2, 5), n2 = n1 + R.int(2, 6), x = pk([["Une imprimerie facture ", " cartes", "cartes"], ["Un loueur de vélos facture ", " heures", "velos"]]);
        return QN(x[0] + M(F + p * n1) + " CHF pour " + M(n1) + x[1] + " et " + M(F + p * n2) + " CHF pour " + M(n2) + x[1] + " (part fixe + prix par unité). Quel est le prix par unité (en CHF) ?", p, M("\\frac{" + (F + p * n2) + " - " + (F + p * n1) + "}{" + n2 + " - " + n1 + "} = \\frac{" + p * (n2 - n1) + "}{" + (n2 - n1) + "} = " + p) + " CHF.",
          { ctx: x[2], guide: [GS("Différence de prix ?", p * (n2 - n1), M(p * (n2 - n1)) + " CHF."), GS("Pour combien d'unités en plus ?", n2 - n1, M(n2 - n1) + "."), GS("Prix par unité ?", p, M(p) + " CHF.")], traps: [TR(+((F + p * n2) / n2).toFixed(4), "Le prix total contient une part fixe : compare deux commandes."), TR(F, "Ça, c'est la part fixe.")] }); },
      () => { const F = pk([4, 5, 6, 7]), p = pk([2, 3, 4]), k = R.int(6, 20), B = F + p * k + R.int(0, p - 1);
        return QN("Un taxi coûte " + M(F) + " CHF de prise en charge, puis " + M(p) + " CHF par km. Avec " + M(B) + " CHF, combien de km entiers peut-on parcourir au maximum ?", k, M(F + " + " + p + "x \\le " + B + " \\iff x \\le " + fT((B - F) / p)) + " : au plus " + M(k) + " km.",
          { ctx: "taxi", guide: [GS("Budget après la prise en charge ?", B - F, M(B - F) + " CHF."), GS("Nombre de km entiers ?", k, M(k) + ".")], traps: [TR(Math.floor(B / p), "Retire d'abord la prise en charge."), TR(k + 1, "On ne peut pas dépasser le budget.")] }); },
    ],
    2: [
      () => { const p1 = R.int(8, 14), p2 = p1 - R.int(2, 5), F = R.int(25, 90), n = Math.floor(F / (p1 - p2)) + 1;
        return QN("Sans abonnement, l'entrée coûte " + M(p1) + " CHF. Avec un abonnement à " + M(F) + " CHF, elle coûte " + M(p2) + " CHF. À partir de combien d'entrées l'abonnement est-il strictement plus avantageux ?", n, M(F + " + " + p2 + "n < " + p1 + "n \\iff n > " + fT(F / (p1 - p2))) + " : à partir de " + M(n) + " entrées.",
          { ctx: "abonnement", guide: [GS("Économie par entrée avec l'abonnement ?", p1 - p2, M(p1 - p2) + " CHF."), GS("Plus petit entier " + M("n") + " avec " + M(n + " \\cdot " + (p1 - p2)) + " > " + M(F) + " ?", n, M(n) + ".")], traps: [TR(F / (p1 - p2), "Le nombre d'entrées est un entier, et il faut « strictement » plus avantageux."), TR(Math.ceil(F / p2), "Compare les deux tarifs : n > " + F + " ÷ " + (p1 - p2) + ".")] }); },
      () => { const x = 50 * R.int(1, 8), fa = 10 * R.int(3, 9), fb = fa + x / 5;
        return QN("Location d'une voiture pour un jour. Offre A : " + M(fa) + " CHF plus " + M("0{,}50") + " CHF par km. Offre B : " + M(fb) + " CHF plus " + M("0{,}30") + " CHF par km. Pour quelle distance (en km) les deux offres coûtent-elles le même prix ?", x, M(fa + " + 0{,}5x = " + fb + " + 0{,}3x \\iff 0{,}2x = " + (fb - fa)) + ", donc " + M("x = " + x) + " km.",
          { ctx: "location", guide: [GS("Différence des parts fixes ?", fb - fa, M(fb - fa) + " CHF."), GS("Distance ?", x, M((fb - fa) + " : 0{,}2 = " + x) + " km.")], traps: [TR((fb - fa) / 0.8, "On soustrait : 0,5x − 0,3x = 0,2x."), TR((fb - fa) * 0.2, "On divise par 0,2.")] }); },
      () => { const F = 5 * R.int(2, 12), p = R.int(2, 9), x = pk([["un abonnement de " + M(F) + " CHF puis " + M(p) + " CHF par séance", "seance"], ["une prise en charge de " + M(F) + " CHF puis " + M(p) + " CHF par km", "km"]]);
        return QX("Un tarif comprend " + x[0] + ". Écris le coût " + M("C(x)") + " pour " + M("x") + " " + (x[1] === "km" ? "km" : "séances") + ".", F + "+" + p + "*x", M("C(x) = " + F + " + " + p + "x") + ".",
          { ctx: "expr-" + x[1], guide: [GX("Expression de " + M("C(x)"), F + "+" + p + "*x", M(F + " + " + p + "x") + ".")], traps: [TX(p + "+" + F + "*x", "La part fixe ne dépend pas de x ; c'est le prix unitaire qui multiplie x."), TX("(" + F + "+" + p + ")*x", "La part fixe se paie une seule fois.")] }); },
    ],
    3: [
      () => { const v = R.int(2, 4), h1 = R.int(1, 3), h2 = h1 + R.int(2, 4), L0 = v * R.int(8, 14), L1 = L0 - v * h1, L2 = L0 - v * h2, T = L0 / v;
        return QN("Une bougie brûle régulièrement. Elle mesure " + M(L1) + " cm après " + M(h1) + " h et " + M(L2) + " cm après " + M(h2) + " h. Après combien d'heures (depuis l'allumage) sera-t-elle entièrement consumée ?", T, "Elle perd " + M("\\frac{" + (L1 - L2) + "}{" + (h2 - h1) + "} = " + v) + " cm/h ; au départ " + M(L1 + " + " + v + " \\cdot " + h1 + " = " + L0) + " cm ; " + M(L0 + " : " + v + " = " + T) + " h.",
          { ctx: "bougie", guide: [GS("Vitesse de combustion (cm/h) ?", v, M(v) + "."), GS("Longueur au départ ?", L0, M(L0) + " cm."), GS("Durée totale ?", T, M(T) + " h.")], traps: [TR(L2 / v + h2 - h1, "Compte depuis l'allumage (t = 0)."), TR(L1 / v, "La bougie mesurait plus au départ : remonte à t = 0."), TR(L2 / v, "On demande la durée depuis l'allumage : ajoute les " + h2 + " h déjà passées.")] }); },
      () => { const fix = 100 * R.int(6, 20), c = R.int(2, 6), pv = c + R.int(2, 6), n = Math.floor(fix / (pv - c)) + 1;
        return QN("Un artisan a " + M(fix) + " CHF de frais fixes. Chaque objet lui coûte " + M(c) + " CHF et il le vend " + M(pv) + " CHF. Combien d'objets doit-il vendre au minimum pour faire un bénéfice (strictement positif) ?", n, "Bénéfice " + M("B(n) = " + (pv - c) + "n - " + fix) + " ; " + M("B(n) > 0 \\iff n > " + fT(fix / (pv - c))) + " : " + M(n) + " objets.",
          { ctx: "benefice", guide: [GS("Gain par objet vendu ?", pv - c, M(pv - c) + " CHF."), GS("Nombre minimum d'objets ?", n, M(n) + ".")], traps: [TR(fix / (pv - c), "Il faut un bénéfice strictement positif, et un nombre entier d'objets."), TR(Math.floor(fix / pv) + 1, "Chaque objet ne rapporte que " + (pv - c) + " CHF (prix de vente − coût).")] }); },
      () => { const V = 10 * R.int(4, 7), c = pk([5, 6, 8]), r = R.int(5, 10), d = ((V - r) / c) * 100; if (!Number.isInteger(d)) return null;
        return QN("Le réservoir d'une voiture contient " + M(V) + " L. Elle consomme " + M(c) + " L aux 100 km. Après combien de km reste-t-il " + M(r) + " L ?", d, M("R(x) = " + V + " - " + fT(c / 100) + "x") + " ; " + M("R(x) = " + r + " \\iff x = \\frac{" + (V - r) + "}{" + fT(c / 100) + "} = " + d) + " km.",
          { ctx: "reservoir", guide: [GS("Litres consommés ?", V - r, M(V - r) + " L."), GS("Distance (km) ?", d, M((V - r) + " : " + c + " \\cdot 100 = " + d) + " km.")], traps: [TR((r / c) * 100, "On cherche quand il RESTE " + r + " L : il a consommé " + (V - r) + " L."), TR((V / c) * 100, "Ça, c'est la distance jusqu'à la panne sèche.")] }); },
    ],
  };

  // ===================== transf =====================
  const xmT = (a) => "(" + xm(a) + ")";
  const TF = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5);
        return QP("Le graphe de " + M("g(x) = " + xmT(a) + "^2" + sg(b)) + " est obtenu en déplaçant celui de " + M("f(x) = x^2") + ". Quel est le sommet de la parabole de " + M("g") + " ? Réponds « x ; y ».", [a, b], M(xmT(a) + "^2") + " décale de " + M(a) + " horizontalement, " + M(sg(b).trim()) + " de " + M(b) + " verticalement : " + M("(0 ; 0) \\to (" + a + " ; " + b + ")") + ".",
          { ctx: "sommet", fig: PL([{ f: (x) => x * x, dash: true }]), guide: [GS("Décalage horizontal (négatif = vers la gauche) ?", a, M(xmT(a)) + " : " + M(a) + "."), GP("Sommet ?", [a, b], M("(" + a + " ; " + b + ")") + ".")], traps: [TP([-a, b], M(xm(a)) + " décale de " + a + " : le signe dans la parenthèse est inversé."), TP([b, a], "Abscisse d'abord (horizontal), puis ordonnée.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5);
        return QX("On décale la parabole " + M("y = x^2") + " de " + M(Math.abs(a)) + " vers la " + (a > 0 ? "droite" : "gauche") + " et de " + M(Math.abs(b)) + " vers le " + (b > 0 ? "haut" : "bas") + ". Écris l'expression de la nouvelle fonction " + M("g(x)") + ".", "(x" + (a > 0 ? "-" + a : "+" + -a) + ")^2" + (b > 0 ? "+" + b : "-" + -b), M("g(x) = " + xmT(a) + "^2" + sg(b)) + ".",
          { ctx: "ecrire-g", guide: [GX("Expression de " + M("g(x)"), "(x" + (a > 0 ? "-" + a : "+" + -a) + ")^2" + (b > 0 ? "+" + b : "-" + -b), M(xmT(a) + "^2" + sg(b)) + ".")], traps: [TX("(x" + (a > 0 ? "+" + a : "-" + -a) + ")^2" + (b > 0 ? "+" + b : "-" + -b), "Vers la droite de " + Math.abs(a) + " : on remplace x par x − " + Math.abs(a) + " (signe inversé)."), TX("x^2" + (a > 0 ? "-" + a : "+" + -a) + (b > 0 ? "+" + b : "-" + -b), "Le décalage horizontal se fait dans la parenthèse : (x − a)².")] }); },
      () => { const a = nz(-5, 5), b = nz(-4, 4), f = pk([["|x|", "abs"], ["x^2", "carre"]]);
        return QN("Le graphe de " + M("g(x) = " + (f[1] === "abs" ? "|" + xm(a) + "|" : xmT(a) + "^2") + sg(b)) + " est celui de " + M("f(x) = " + f[0]) + " déplacé. De combien d'unités est-il décalé horizontalement (vers la droite : positif, vers la gauche : négatif) ?", a, M(xm(a)) + " : décalage de " + M(a) + ".",
          { ctx: "decalage-h-" + f[1], guide: [GS("Décalage horizontal ?", a, "On remplace x par " + M(xm(a)) + " : " + M(a) + ".")], traps: [TR(-a, M(xm(a)) + " décale de " + a + " (le signe est inversé dans la parenthèse)."), TR(b, "Ça, c'est le décalage vertical.")] }); },
    ],
    2: [
      () => { const p = R.int(-4, 4), q = R.int(-4, 4), a = nz(-4, 4), b = nz(-4, 4);
        return QP("Le point " + M("P(" + p + " ; " + q + ")") + " est sur le graphe de " + M("f") + ". On pose " + M("g(x) = f" + xmT(a) + sg(b)) + ". Quel point du graphe de " + M("g") + " correspond à " + M("P") + " ? Réponds « x ; y ».", [p + a, q + b], "Translation de " + M(a) + " horizontalement et " + M(b) + " verticalement : " + M("(" + (p + a) + " ; " + (q + b) + ")") + ".",
          { ctx: "point", guide: [GS("Nouvelle abscisse (" + M(p + sg(a)) + ") ?", p + a, M(p + a) + "."), GP("Point ?", [p + a, q + b], M("(" + (p + a) + " ; " + (q + b) + ")") + ".")], traps: [TP([p - a, q + b], "f(x − a) décale de +a horizontalement."), TP([p + b, q + a], "Le décalage horizontal est dans la parenthèse, le vertical à l'extérieur.")] }); },
      () => { const h = nz(-3, 3), k = nz(-4, 4), a = nz(-3, 3), b = nz(-3, 3);
        return QP("Soit " + M("f(x) = " + xmT(h) + "^2" + sg(k)) + " et " + M("g(x) = f" + xmT(a) + sg(b)) + ". Quel est le sommet de la parabole de " + M("g") + " ? Réponds « x ; y ».", [h + a, k + b], "Sommet de " + M("f") + " : " + M("(" + h + " ; " + k + ")") + " ; translation " + M("(" + a + " ; " + b + ")") + " : " + M("(" + (h + a) + " ; " + (k + b) + ")") + ".",
          { ctx: "sommet-compose", guide: [GP("Sommet de " + M("f") + " ?", [h, k], M("(" + h + " ; " + k + ")") + "."), GP("Sommet de " + M("g") + " ?", [h + a, k + b], M("(" + (h + a) + " ; " + (k + b) + ")") + ".")], traps: [TP([h - a, k + b], "f(x − a) décale de +a vers la droite."), TP([a, b], "Pars du sommet de f, pas de (0 ; 0).")] }); },
      () => { const h = nz(-4, 4), k = nz(-4, 4), a = nz(-3, 3), b = nz(-3, 3), min = R.rand() < 0.5, X = h + a, Y = k + b; if (X === 0 || Y === 0 || X === h || Y === k) return null;
        return QN("Soit " + M("f(x) = |" + xm(h) + "|" + sg(k)) + " et " + M("g(x) = f" + xmT(a) + sg(b)) + ". " + (min ? "Quelle est la valeur minimale de " + M("g") + " ?" : "Pour quelle valeur de " + M("x") + " le minimum de " + M("g") + " est-il atteint ?"), min ? Y : X, "La pointe du « V » de " + M("f") + " est en " + M("(" + h + " ; " + k + ")") + " ; la translation " + M("(" + a + " ; " + b + ")") + " l'amène en " + M("(" + X + " ; " + Y + ")") + ". " + (min ? "Minimum de " + M("g") + " : " + M(Y) : "Minimum atteint en " + M("x = " + X)) + ".",
          { ctx: min ? "abs-min" : "abs-xmin", fig: PL([{ f: (x) => Math.abs(x - h) + k, dash: true }]), guide: [GP("Pointe du V de " + M("f") + " ? (« x ; y »)", [h, k], M("(" + h + " ; " + k + ")") + "."), GP("Pointe du V de " + M("g") + " ?", [X, Y], M("(" + h + sg(a) + " \\,;\\, " + k + sg(b) + ") = (" + X + " ; " + Y + ")") + "."), GS("Réponse ?", min ? Y : X, M(min ? Y : X) + ".")],
            traps: [TR(min ? X : Y, min ? "La valeur minimale est une ordonnée." : "On demande l'abscisse x."), TR(min ? k - b : h - a, min ? "+ " + b + " à l'extérieur : on monte (ou descend) de " + b + "." : "f(x − a) décale de +a vers la droite."), TR(min ? k : h, "C'est le sommet de f ; il faut encore appliquer la translation.")] }); },
    ],
    3: [
      () => { const p = R.int(-3, 3), q = nz(-4, 4), a = nz(-3, 3), b = nz(-4, 4), k = pk([-1, 2, -2, 3]);
        return QP("Le point " + M("P(" + p + " ; " + q + ")") + " est sur le graphe de " + M("f") + ". On pose " + M("g(x) = " + (k === -1 ? "-" : k) + "f" + xmT(a) + sg(b)) + ". Quel point du graphe de " + M("g") + " correspond à " + M("P") + " ? Réponds « x ; y ».", [p + a, k * q + b], "Abscisse : " + M(p + sg(a) + " = " + (p + a)) + ". Ordonnée : " + M(k + " \\cdot " + par(q) + sg(b) + " = " + (k * q + b)) + ".",
          { ctx: "point-k", guide: [GS("Nouvelle abscisse ?", p + a, M(p + a) + "."), GS("Nouvelle ordonnée (" + M(k + " \\cdot " + par(q) + sg(b)) + ") ?", k * q + b, M(k * q + b) + "."), GP("Point ?", [p + a, k * q + b], M("(" + (p + a) + " ; " + (k * q + b) + ")") + ".")], traps: [TP([p + a, k * (q + b)], "On multiplie d'abord par " + k + ", puis on ajoute " + b + "."), TP([p - a, k * q + b], "f(x − a) décale de +a.")] }); },
      () => { const x0 = R.int(-2, 4), a = nz(-3, 3), y0 = nz(-6, 6), k = pk([2, 3, -1, -2]), b = nz(-5, 5), X = x0 + a, v = k * y0 + b;
        return QN("On sait que " + M("f(" + x0 + ") = " + y0) + ". Soit " + M("g(x) = " + (k === -1 ? "-" : k) + "f" + xmT(a) + sg(b)) + ". Calcule " + M("g(" + X + ")") + ".", v, M("g(" + X + ") = " + (k === -1 ? "-" : k) + "f(" + X + sg(-a) + ")" + sg(b) + " = " + (k === -1 ? "-" : k) + "f(" + x0 + ")" + sg(b) + " = " + k + " \\cdot " + par(y0) + sg(b) + " = " + v) + ".",
          { ctx: "calcul-g", guide: [GS("Dans la parenthèse : " + M(X + sg(-a)) + " = ?", x0, M(x0) + "."), GS(M("g(" + X + ")") + " = ?", v, M(v) + ".")], traps: [TR(k * (y0 + b), "On multiplie f(" + x0 + ") par " + k + ", puis on ajoute " + b + "."), TR(y0 + b, "N'oublie pas le facteur " + k + ".")] }); },
      () => { const h = nz(-4, 4), k = nz(-5, 5), b = -2 * h, c = h * h + k;
        return QP("Quelle translation (« horizontal ; vertical ») envoie la parabole " + M("y = x^2") + " sur " + M("y = " + tri(1, b, c)) + " ?", [h, k], "Forme canonique : " + M(tri(1, b, c) + " = " + xmT(h) + "^2" + sg(k)) + " : translation " + M("(" + h + " ; " + k + ")") + ".",
          { ctx: "canonique", guide: [GS("Abscisse du sommet " + M("-\\frac{b}{2}") + " ?", h, M(h) + "."), GS("Ordonnée du sommet " + M("f(" + h + ")") + " ?", k, M(k) + "."), GP("Translation ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "x_S = −b ÷ 2 = " + h + "."), TP([h, c], c + " est l'ordonnée à l'origine, pas celle du sommet.")] }); },
    ],
  };

  // ===================== absval : valeur absolue (20.11, dernier lot de 1re Collège) =====================
  const opA = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
  const AB = (r) => "|" + xm(r) + "|";
  const setT = (vs) => vs.length ? M("S = \\{" + vs.map(fT).join(" \\,;\\, ") + "\\}") : M("S = \\varnothing");
  const AV = {
    1: [
      () => { const a = -R.int(2, 9), p = R.int(1, 6), q = p + R.int(2, 9), v = -a - (q - p); if (v === 0) return null;
        return QN("Calcule " + M("|" + a + "| - |" + p + " - " + q + "|") + ".", v, M("|" + a + "| = " + -a) + " et " + M("|" + p + " - " + q + "| = |" + (p - q) + "| = " + (q - p)) + ", donc " + M(-a + " - " + (q - p) + " = " + v) + ".",
          { ctx: "calcul", guide: [GS(M("|" + a + "|") + " = ?", -a, M(-a) + " : la distance de " + M(a) + " à 0."), GS(M(p + " - " + q) + " = ?", p - q, M(p - q) + "."), GS(M("|" + (p - q) + "|") + " = ?", q - p, M(q - p) + "."), GS("Résultat ?", v, M(-a + " - " + (q - p) + " = " + v) + ".")],
            traps: [TR(a - (p - q), "Une valeur absolue n'est jamais négative : " + M("|" + a + "| = " + -a) + "."), TR(-a + (p - q), M("|" + (p - q) + "| = " + (q - p)) + ", pas " + M(p - q) + "."), TR(Math.abs(a - p + q), "On calcule chaque valeur absolue séparément, puis on soustrait.")] }); },
      () => { const a = -R.int(2, 12), b = R.int(1, 12), d = b - a, c = pk([
          ["temperature", "Le matin, le thermomètre indique " + M(a + "\\,°\\text{C}") + " ; l'après-midi, " + M(b + "\\,°\\text{C}") + ". De combien de degrés la température a-t-elle monté ?"],
          ["droite", "Sur une droite graduée, quelle est la distance entre les points d'abscisses " + M(a) + " et " + M(b) + " ?"],
          ["altitude", "Une plongeuse est à " + M(-a + " \\text{ m}") + " sous le niveau de la mer (altitude " + M(a + " \\text{ m}") + "), une mouette vole à " + M(b + " \\text{ m}") + " au-dessus. Quelle distance verticale les sépare (en m) ?"]]);
        return QN(c[1], d, (c[0] === "temperature" ? "Écart " : "Distance ") + M("= |" + b + " - " + par(a) + "| = |" + b + " + " + -a + "| = " + d) + ".",
          { ctx: c[0], guide: [GS(M(b + " - " + par(a)) + " = ?", d, M(b + " + " + -a + " = " + d) + " : soustraire un négatif, c'est ajouter."), GS("Et dans l'autre sens, " + M(a + " - " + b) + " = ?", a - b, M(a - b) + " : même distance, au signe près ; la distance est la valeur absolue."), GS("Distance ?", d, M(d) + ".")],
            traps: [TR(b + a, M(b + " - " + par(a)) + " = " + M(b + " + " + -a) + " : soustraire un négatif, c'est ajouter."), TR(a - b, "Une distance est positive : on prend la valeur absolue.")] }); },
      () => { const a = nz(-6, 6), b = R.int(1, 8);
        return QSet("Résous " + M(AB(a) + " = " + b) + ". Sépare les solutions par « ; ».", [a - b, a + b], M(xm(a) + " = " + b) + " donne " + M("x = " + (a + b)) + " ; " + M(xm(a) + " = -" + b) + " donne " + M("x = " + (a - b)) + ". " + setT([a - b, a + b]) + " : les deux nombres à distance " + M(b) + " de " + M(a) + ".",
          { ctx: "eq-simple", guide: [GS("Premier cas, " + M(xm(a) + " = " + b) + " : " + M("x") + " = ?", a + b, M(a + b) + "."), GS("Deuxième cas, " + M(xm(a) + " = -" + b) + " : " + M("x") + " = ?", a - b, M(a - b) + "."), GSet("Les solutions ?", [a - b, a + b], setT([a - b, a + b]) + ".")],
            traps: [TSet([a + b], "Il y a deux nombres à distance " + b + " de " + a + " : n'oublie pas le cas « = −" + b + " »."), TSet([b - a, -b - a], M(AB(a) + " = " + b) + " : " + M(xm(a) + " = \\pm " + b) + ", donc " + M("x = " + a + " \\pm " + b) + " (attention au signe).")] }); },
      () => { const a = nz(-5, 5), c = nz(-4, 4), k = a + pk([-1, 1]) * R.int(2, 6), v = Math.abs(k - a) + c;
        return QN("Soit " + M("f(x) = " + AB(a) + sg(c)) + ". Calcule " + M("f(" + k + ")") + ".", v, M("f(" + k + ") = |" + k + sg(-a) + "|" + sg(c) + " = |" + (k - a) + "|" + sg(c) + " = " + Math.abs(k - a) + sg(c) + " = " + v) + ".",
          { ctx: "image", guide: [GS(M(k + sg(-a)) + " = ?", k - a, M(k - a) + "."), GS(M("|" + (k - a) + "|") + " = ?", Math.abs(k - a), M(Math.abs(k - a)) + "."), GS(M("f(" + k + ")") + " = ?", v, M(Math.abs(k - a) + sg(c) + " = " + v) + ".")],
            traps: [TR(k - a + c, "La valeur absolue rend positif : " + M("|" + (k - a) + "| = " + Math.abs(k - a)) + "."), TR(Math.abs(k + a) + c, "On remplace x par " + k + " dans " + M(xm(a)) + " : attention au signe.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4, -2]), c = nz(-7, 7), b = R.int(1, 9), s1 = (b - c) / k, s2 = (-b - c) / k; if (den(s1) > 4 || den(s2) > 4) return null;
        const e = (k === -2 ? "-2" : k) + "x" + sg(c);
        return QSet("Résous " + M("|" + e + "| = " + b) + ". Sépare les solutions par « ; »" + FA + ".", [s1, s2], M(e + " = " + b) + " donne " + M("x = " + fT(s1)) + " ; " + M(e + " = -" + b) + " donne " + M("x = " + fT(s2)) + ".",
          { ctx: "eq-lin", guide: [GS("Cas " + M(e + " = " + b) + " : " + M("x") + " = ?", s1, M(k + "x = " + (b - c)) + ", " + M("x = " + fT(s1)) + "."), GS("Cas " + M(e + " = -" + b) + " : " + M("x") + " = ?", s2, M(k + "x = " + (-b - c)) + ", " + M("x = " + fT(s2)) + "."), GSet("Les solutions ?", [s1, s2], setT([s1, s2]) + ".")],
            traps: [TSet([s1], "Deux cas : " + M(e + " = " + b) + " ou " + M(e + " = -" + b) + "."), TSet([(b + c) / k, (-b + c) / k], "On retire " + M(c) + " (on ne l'ajoute pas) avant de diviser par " + M(k) + ".")] }); },
      () => { const m = pk([2, 3, 4]), a = nz(-6, 6), r = R.int(1, 6), c = nz(-8, 8), d = m * r + c;
        return QSet("Résous " + M(m + AB(a) + sg(c) + " = " + d) + ". Sépare les solutions par « ; ».", [a - r, a + r], "On isole la valeur absolue : " + M(m + AB(a) + " = " + (d - c)) + ", " + M(AB(a) + " = " + r) + ". Puis " + M("x = " + a + " \\pm " + r) + " : " + setT([a - r, a + r]) + ".",
          { ctx: "isoler", guide: [GS("On isole d'abord la valeur absolue : " + M(AB(a)) + " = ?", r, M(m + AB(a) + " = " + (d - c)) + ", on divise par " + M(m) + " : " + M(r) + "."), GS("Plus petite solution ?", a - r, M(a + " - " + r + " = " + (a - r)) + "."), GSet("Les solutions ?", [a - r, a + r], setT([a - r, a + r]) + ".")],
            traps: [TSet([a - (d - c), a + (d - c)], "Divise par " + m + " avant de séparer les deux cas."), TSet([a + r], "Deux nombres sont à distance " + r + " de " + a + ".")] }); },
      () => { const a = nz(-6, 6), c = R.int(3, 9), d = c - R.int(1, c + 3), r = d - c;
        return QSet("Résous " + M(AB(a) + " + " + c + " = " + d) + ". (Écris « aucune » s'il n'y a pas de solution.)", [], "On isole : " + M(AB(a) + " = " + r) + ". Une valeur absolue est toujours positive ou nulle : aucune solution, " + M("S = \\varnothing") + ".",
          { ctx: "impossible", guide: [GS("On isole : " + M(AB(a)) + " = ?", r, M(d + " - " + c + " = " + r) + "."), GSet("Une valeur absolue peut-elle valoir " + M(r) + " ? Solutions (« aucune » s'il n'y en a pas) ?", [], "Non : une distance n'est jamais négative. Aucune solution.")],
            traps: [TSet([a + r, a - r], "Une valeur absolue ne peut pas être négative : " + M(AB(a) + " = " + r) + " est impossible.")] }); },
      () => { const a = nz(-5, 5), c = nz(-4, 4), r = R.int(1, 6), y = c + r;
        return QSet("Soit " + M("f(x) = " + AB(a) + sg(c)) + ". Détermine les préimages de " + M(y) + ". Sépare-les par « ; ».", [a - r, a + r], M(AB(a) + sg(c) + " = " + y) + " donne " + M(AB(a) + " = " + r) + ", donc " + M("x = " + a + " \\pm " + r) + " : " + setT([a - r, a + r]) + ".",
          { ctx: "preimage", guide: [GS("On résout " + M("f(x) = " + y) + ". " + M(AB(a)) + " = ?", r, M(y + sg(-c) + " = " + r) + "."), GSet("Préimages ?", [a - r, a + r], setT([a - r, a + r]) + ".")],
            traps: [TSet([a - y, a + y], "On retire d'abord " + M(c) + " : " + M(AB(a) + " = " + r) + "."), TSet([a + r], "Il y a deux préimages.")] }); },
    ],
    3: [
      () => { let e; const a = nz(-6, 6); do e = nz(-6, 6); while (e === a || (a + e) % 2 !== 0); const mid = (a + e) / 2;
        return QSet("Résous " + M(AB(a) + " = " + AB(e)) + ".", [mid], "La distance de " + M("x") + " à " + M(a) + " égale sa distance à " + M(e) + " : " + M("x") + " est le milieu, " + M("x = \\frac{" + a + " + " + par(e) + "}{2} = " + mid) + ". (Par le calcul : " + M(xm(a) + " = " + xm(e)) + " est impossible, " + M(xm(a) + " = -(" + xm(e) + ")") + " donne " + M("x = " + mid) + ".)",
          { ctx: "milieu", guide: [GS("Le nombre cherché est à égale distance de " + M(a) + " et de " + M(e) + " : c'est leur milieu. Milieu = ?", mid, M("\\frac{" + a + " + " + par(e) + "}{2} = " + mid) + "."), GSet("Solutions ?", [mid], setT([mid]) + ".")],
            traps: [TSet([a, e], "Les solutions sont les x à égale distance de " + a + " et de " + e + " : un seul nombre, le milieu."), TSet([-mid], "Milieu : demi-somme " + M("\\frac{" + a + " + " + par(e) + "}{2}") + ".")] }); },
      () => { const a = nz(-6, 6), k = pk([2, 3, -2, -3]), c = R.int(-6, 6), x1 = (c + a) / (1 - k), x2 = (a - c) / (1 + k);
        if (!Number.isInteger(x1) || !Number.isInteger(x2) || x1 === x2) return null; const v1 = k * x1 + c >= 0, v2 = k * x2 + c >= 0; if (v1 === v2) return null; const s = v1 ? x1 : x2, bad = v1 ? x2 : x1, rhs = lin(k, c);
        return QSet("Résous " + M(AB(a) + " = " + rhs) + ".", [s], "Cas 1 : " + M(xm(a) + " = " + rhs) + " donne " + M("x = " + x1) + ". Cas 2 : " + M("-(" + xm(a) + ") = " + rhs) + " donne " + M("x = " + x2) + ". Le membre de droite est une distance, il doit être positif : en " + M("x = " + bad) + ", " + M(rhs) + " vaut " + M(k * bad + c) + " (rejeté). " + setT([s]) + ".",
          { ctx: "verif", guide: [GS("Cas 1, " + M(xm(a) + " = " + rhs) + " : " + M("x") + " = ?", x1, M("x = " + x1) + "."), GS("Cas 2, " + M("-(" + xm(a) + ") = " + rhs) + " : " + M("x") + " = ?", x2, M("x = " + x2) + "."), GSet("Le membre de droite doit être positif ou nul (c'est une distance). Solutions retenues ?", [s], "En " + M("x = " + bad) + ", " + M(rhs + " = " + (k * bad + c)) + " < 0 : rejeté. " + setT([s]) + ".")],
            traps: [TSet([x1, x2], "Vérifie chaque valeur : " + M(rhs) + " doit être positif ou nul. L'une des deux est à rejeter.")] }); },
      () => { const a = nz(-5, 5), b = R.int(1, 6), op = pk(["<", "<=", ">", ">="]), inside = op[0] === "<", inc = op.length === 2;
        const ivs = inside ? [[a - b, inc, a + b, inc]] : [[-Infinity, false, a - b, inc], [a + b, inc, Infinity, false]], wrong = inside ? [[-Infinity, false, a - b, !inc], [a + b, !inc, Infinity, false]] : [[a - b, !inc, a + b, !inc]];
        return QS("Résous " + M(AB(a) + " " + opA[op] + " " + b) + ". Donne l'ensemble des solutions (intervalle ou réunion d'intervalles).", ivs, M(AB(a)) + " est la distance de " + M("x") + " à " + M(a) + ". Elle est " + (inside ? "inférieure" : "supérieure") + " à " + M(b) + (inside ? " entre " : " à l'extérieur de ") + M(a - b) + " et " + M(a + b) + " : " + M("S = " + SolSet.show(ivs)) + ".",
          { ctx: "inequation", guide: [GS("Nombres à distance exactement " + M(b) + " de " + M(a) + " : le plus petit ?", a - b, M(a + " - " + b + " = " + (a - b)) + "."), GS("Le plus grand ?", a + b, M(a + b) + "."), GSS("Les x " + (inside ? "plus proches" : "plus éloignés") + " de " + M(a) + " (distance " + M(opA[op] + " " + b) + ") : ensemble ?", ivs, M("S = " + SolSet.show(ivs)) + ".")],
            traps: [TS(wrong, inside ? "Distance plus petite que " + b + " : entre les deux bornes." : "Distance plus grande que " + b + " : à l'extérieur des deux bornes."), TS(inside ? [[a - b, !inc, a + b, !inc]] : [[-Infinity, false, a - b, !inc], [a + b, !inc, Infinity, false]], "Crochets : « ≤ » et « ≥ » gardent les bornes, « < » et « > » les excluent.")] }); },
    ],
  };

  // ===================== morceaux : fonctions définies par morceaux (20.11) =====================
  const PCW = (p1, c, p2) => M("f(x) = \\begin{cases} " + p1 + " & \\text{si } x < " + c + " \\\\ " + p2 + " & \\text{si } x \\ge " + c + " \\end{cases}");
  // Prix en CHF : décimales (« 1,50 »), jamais en fraction. T : [ctx, énoncé, unité, question, « d'heures » / « de km », « premières » / « premiers »]
  const chf = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", "{,}"));
  const TARIFS = [
    ["parking", (F, s, p) => "Un parking coûte " + M(chf(F)) + " CHF pour les " + s + " premières heures (ou moins), puis " + M(chf(p)) + " CHF par heure supplémentaire.", "heures", "Combien paie-t-on pour", "d'heures", "premières"],
    ["taxi", (F, s, p) => "Un taxi facture " + M(chf(F)) + " CHF pour les " + s + " premiers kilomètres (ou moins), puis " + M(chf(p)) + " CHF par kilomètre supplémentaire.", "km", "Prix d'une course de", "de km", "premiers"],
    ["forfait", (F, s, p) => "Un abonnement mobile coûte " + M(chf(F)) + " CHF par mois avec " + s + " Go inclus, puis " + M(chf(p)) + " CHF par Go supplémentaire.", "Go", "Facture d'un mois avec", "de Go", "premiers"],
    ["velo", (F, s, p) => "La location d'un vélo coûte " + M(chf(F)) + " CHF pour les " + s + " premières heures (ou moins), puis " + M(chf(p)) + " CHF par heure en plus.", "heures", "Prix pour", "d'heures", "premières"],
  ];
  const tarif = () => { const T = pk(TARIFS), F = R.int(3, 25), s = R.int(2, 5), p = pk([1.5, 2, 2.5, 3, 4]); return { T, F, s, p }; };
  const MO = {
    1: [
      () => { const a = nz(-3, 3), b = nz(-4, 4), c = R.int(-1, 2), e = nz(-4, 3), k = pk([c - R.int(1, 3), c, c + R.int(1, 2)]), first = k < c, v = first ? a * k + b : k * k + e, other = first ? k * k + e : a * k + b;
        if (other === v) return null;
        return QN("On donne " + PCW(lin(a, b), c, tri(1, 0, e)) + ". Calcule " + M("f(" + k + ")") + ".", v, M(k) + (first ? " est plus petit que " + M(c) + " : premier morceau, " + M("f(" + k + ") = " + a + " \\cdot " + par(k) + sg(b) + " = " + v) : " n'est pas plus petit que " + M(c) + " : second morceau, " + M("f(" + k + ") = " + par(k) + "^2" + sg(e) + " = " + v)) + ".",
          { ctx: "image", fig: PL([{ f: (x) => a * x + b, to: c - 0.001 }, { f: (x) => x * x + e, from: c }], { yr: [-6, 8] }), guide: [GS("On compare " + M(k) + " à la frontière " + M(c) + ". Numéro du morceau à utiliser (1 ou 2) ?", first ? 1 : 2, first ? M(k + " < " + c) + " : morceau 1." : M(k + " \\ge " + c) + " : morceau 2" + (k === c ? " (à la frontière, « ≥ » : c'est le second)." : ".")), GS(M("f(" + k + ")") + " = ?", v, M(v) + ".")],
            traps: [TR(other, k === c ? "À la frontière x = " + c + ", c'est « x ≥ " + c + " » qui s'applique : le second morceau." : "Mauvais morceau : compare d'abord " + k + " à " + c + ".")] }); },
      () => { const c = R.int(-1, 2), a = pk([1, -1, 2]), b = R.int(-2, 3), d = pk([-1, 1, -2, 0.5]), g = a * c + b + pk([0, 2, -2]) - d * c, f = (x) => (x < c ? a * x + b : d * x + g);
        const xs = [-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((x) => Number.isInteger(f(x)) && Math.abs(f(x)) <= 5 && x !== c); if (!xs.length) return null; const k = pk(xs), v = f(k), wrongPiece = k < c ? d * k + g : a * k + b;
        return QN("La fonction " + M("f") + " est définie par morceaux (graphique). Lis " + M("f(" + k + ")") + ".", v, "En " + M("x = " + k) + ", on est sur la partie " + (k < c ? "gauche" : "droite") + " de la courbe : on lit " + M("f(" + k + ") = " + v) + ".",
          { ctx: "lecture", fig: PL([{ f: (x) => a * x + b, to: c - 0.001 }, { f: (x) => d * x + g, from: c }]), guide: [GS("En " + M("x = " + k) + ", la courbe est-elle sur la partie gauche (1) ou droite (2) ?", k < c ? 1 : 2, k < c ? "Gauche : " + M(k + " < " + c) + "." : "Droite : " + M(k + " \\ge " + c) + "."), GS("Ordonnée lue ?", v, M(v) + ".")],
            traps: [TR(wrongPiece, "Ce morceau-là ne vaut que de l'autre côté de x = " + c + "."), TR(k, "f(" + k + ") est une ordonnée (hauteur), pas une abscisse.")] }); },
      () => { const { T, F, s, p } = tarif(), t = R.rand() < 0.25 ? R.int(1, s) : s + R.int(1, 6), extra = Math.max(0, t - s), v = F + p * extra;
        return QN(T[1](F, s, p, t) + " " + T[3] + " " + t + " " + T[2] + " ? (en CHF)", v, extra ? M(t + " - " + s + " = " + extra) + " " + T[2] + " en plus : " + M(chf(F) + " + " + extra + " \\cdot " + chf(p) + " = " + chf(v)) + " CHF." : M(t + " \\le " + s) + " : seulement le prix de base, " + M(chf(F)) + " CHF.",
          { ctx: "tarif-" + T[0], guide: [GS("Combien " + T[4] + " au-delà des " + s + " " + T[5] + " ?", extra, extra ? M(t + " - " + s + " = " + extra) + "." : "Aucune : " + M(t + " \\le " + s) + "."), GS("Supplément (CHF) ?", p * extra, M(extra + " \\cdot " + chf(p) + " = " + chf(p * extra)) + "."), GS("Total (CHF) ?", v, M(chf(v)) + ".")],
            traps: [TR(F + p * t, "Le supplément ne compte qu'au-delà des " + s + " " + T[5] + "."), TR(p * extra, "N'oublie pas le prix de base, " + chf(F).replace("{,}", ",") + " CHF."), TR(p * t, "Fonction par morceaux : prix de base jusqu'à " + s + ", puis supplément.")] }); },
    ],
    2: [
      () => { const c = R.int(0, 2), a = nz(-3, 3), b = R.int(-4, 4), x1 = R.int(c - 4, c + 2), y = a * x1 + b, r = R.int(1, 4), e = y - r * r;
        const sols = [...new Set([...(x1 < c ? [x1] : []), ...[r, -r].filter((x) => x >= c)])], all = [...new Set([x1, r, -r])];
        if (all.length === sols.length) return null;
        return QSet("On donne " + PCW(lin(a, b), c, tri(1, 0, e)) + ". Résous " + M("f(x) = " + y) + ". (Sépare les solutions par « ; » ; « aucune » s'il n'y en a pas.)", sols,
          "Morceau 1 : " + M(lin(a, b) + " = " + y + " \\Rightarrow x = " + x1) + (x1 < c ? " (gardé, " + M(x1 + " < " + c) + ")" : " (rejeté, " + M(x1 + " \\ge " + c) + ")") + ". Morceau 2 : " + M("x^2 = " + r * r + " \\Rightarrow x = \\pm " + r) + ", on garde ceux qui sont " + M("\\ge " + c) + ". " + setT(sols) + ".",
          { ctx: "equation", guide: [GS("Morceau 1 : " + M(lin(a, b) + " = " + y) + ", " + M("x") + " = ?", x1, M("x = " + x1) + (x1 < c ? " : il est bien " + M("< " + c) + ", on le garde." : " : il n'est pas " + M("< " + c) + ", on le rejette.")), GS("Morceau 2 : " + M(tri(1, 0, e) + " = " + y) + ". " + M("x^2") + " = ?", r * r, M("x = " + r) + " ou " + M("x = -" + r) + " ; on garde ceux qui sont " + M("\\ge " + c) + "."), GSet("Solutions retenues ?", sols, setT(sols) + ".")],
            traps: [TSet(all, "Chaque solution doit être dans l'intervalle de son morceau : vérifie avec la frontière " + c + ".")] }); },
      () => { const a = nz(-6, 6), left = R.rand() < 0.5;
        const e = left ? "-x" + sg(a) : xm(a), ex = left ? a + "-x" : "x" + (a < 0 ? "+" + -a : "-" + a), t = left ? a - R.int(1, 4) : a + R.int(1, 4);
        return QX("Pour " + M(left ? "x < " + a : "x \\ge " + a) + ", écris " + M(AB(a)) + " sans valeur absolue.", ex, (left ? "Si " + M("x < " + a) + ", " + M(xm(a)) + " est négatif : " + M(AB(a) + " = -(" + xm(a) + ") = " + e) : "Si " + M("x \\ge " + a) + ", " + M(xm(a)) + " est positif ou nul : " + M(AB(a) + " = " + e)) + ". Donc " + M(AB(a)) + " est une fonction par morceaux.",
          { ctx: "absmorceaux", guide: [GS("Exemple : pour " + M("x = " + t) + ", " + M(t + sg(-a)) + " = ?", t - a, M(t - a) + (left ? " : négatif, la valeur absolue change son signe." : " : positif, la valeur absolue ne change rien.")), GX("Pour " + M(left ? "x < " + a : "x \\ge " + a) + ", " + M(AB(a)) + " = ?", ex, M(e) + ".")],
            traps: left ? [TX("x" + (a < 0 ? "+" + -a : "-" + a), "Pour x < " + a + ", " + xm(a) + " est négatif : on prend son opposé."), TX("-x" + (a < 0 ? "+" + -a : "-" + a), "L'opposé de " + xm(a) + " est " + (a < 0 ? "−x − " + -a : "−x + " + a) + " : on change le signe des deux termes.")] : [TX(a + "-x", "Pour x ≥ " + a + ", " + xm(a) + " est déjà positif ou nul : on le garde tel quel.")] }); },
      () => { const { T, F, s, p } = tarif(), extra = R.int(2, 8), tot = F + p * extra, t = s + extra;
        return QN(T[1](F, s, p) + " On a payé " + M(chf(tot)) + " CHF. Combien " + T[4] + " ?", t, M(chf(tot) + " - " + chf(F) + " = " + chf(p * extra)) + " CHF de supplément, soit " + M(chf(p * extra) + " \\div " + chf(p) + " = " + extra) + " " + T[2] + " en plus des " + s + " " + T[5] + " : " + M(t) + " " + T[2] + ".",
          { ctx: "tarifinv-" + T[0], guide: [GS("Supplément payé (CHF) ?", p * extra, M(chf(tot) + " - " + chf(F) + " = " + chf(p * extra)) + "."), GS("Nombre " + T[4] + " en plus ?", extra, M(chf(p * extra) + " \\div " + chf(p) + " = " + extra) + "."), GS("Nombre total " + T[4] + " ?", t, M(s + " + " + extra + " = " + t) + ".")],
            traps: [TR(extra, "Ce sont les " + T[2] + " au-delà des " + s + " " + T[5] + " : ajoute-les."), TR(tot / p, "Le prix de base couvre les " + s + " " + T[5] + " : retire-le d'abord.")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), c = R.int(-2, 3), e = R.int(-4, 4), m = c * c + e - a * c;
        return QN("On donne " + M("f(x) = \\begin{cases} " + (a === 1 ? "" : a === -1 ? "-" : a) + "x + m & \\text{si } x < " + c + " \\\\ " + tri(1, 0, e) + " & \\text{si } x \\ge " + c + " \\end{cases}") + ". Quelle valeur de " + M("m") + " rend le graphe de " + M("f") + " continu (sans saut) ?", m,
          "Les deux morceaux doivent donner la même valeur en " + M("x = " + c) + " : " + M(a + " \\cdot " + par(c) + " + m = " + par(c) + "^2" + sg(e)) + ", donc " + M("m = " + m) + ".",
          { ctx: "continuite", guide: [GS("Valeur du second morceau en " + M("x = " + c) + " ?", c * c + e, M(par(c) + "^2" + sg(e) + " = " + (c * c + e)) + "."), GS("Le premier morceau doit arriver à la même hauteur : " + M(a + " \\cdot " + par(c) + " + m = " + (c * c + e)) + ". " + M("m") + " = ?", m, M("m = " + (c * c + e) + sg(-a * c) + " = " + m) + ".")],
            traps: [TR(c * c + e, "C'est la hauteur au raccord ; il faut encore en déduire m."), TR(c * c + e + a * c, "On retire " + a + " · " + par(c) + " = " + a * c + " (attention au signe).")] }); },
      () => { const c = R.int(-1, 2), a1 = nz(-3, 3), b1 = R.int(-4, 4), a2 = nz(-3, 3), b2 = R.int(-4, 4), y = R.int(-5, 6), x1 = (y - b1) / a1, x2 = (y - b2) / a2;
        if (!Number.isInteger(x1) || !Number.isInteger(x2) || x1 === x2) return null; const sols = [...(x1 < c ? [x1] : []), ...(x2 >= c ? [x2] : [])]; if (sols.length === 2) return null;
        return QSet("On donne " + PCW(lin(a1, b1), c, lin(a2, b2)) + ". Résous " + M("f(x) = " + y) + ". (« aucune » s'il n'y a pas de solution.)", sols,
          "Morceau 1 : " + M("x = " + x1) + (x1 < c ? " (gardé)" : " (rejeté, pas " + M("< " + c) + ")") + ". Morceau 2 : " + M("x = " + x2) + (x2 >= c ? " (gardé)" : " (rejeté, pas " + M("\\ge " + c) + ")") + ". " + setT(sols) + ".",
          { ctx: "deux-affines", guide: [GS("Morceau 1, " + M(lin(a1, b1) + " = " + y) + " : " + M("x") + " = ?", x1, M("x = " + x1) + (x1 < c ? ", il est " + M("< " + c) + " : gardé." : ", il n'est pas " + M("< " + c) + " : rejeté.")), GS("Morceau 2, " + M(lin(a2, b2) + " = " + y) + " : " + M("x") + " = ?", x2, M("x = " + x2) + (x2 >= c ? ", il est " + M("\\ge " + c) + " : gardé." : ", il n'est pas " + M("\\ge " + c) + " : rejeté.")), GSet("Solutions retenues ?", sols, setT(sols) + ".")],
            traps: [TSet([x1, x2], "Une solution de morceau ne compte que si elle est dans l'intervalle de ce morceau.")] }); },
      () => { const c = R.int(0, 2), a = nz(-2, 3), b = R.int(-3, 3), e = R.int(-4, 2), f = (x) => (x < c ? a * x + b : x * x + e), k = R.int(-3, 3), y1 = f(k), v = f(y1); if (Math.abs(v) > 60 || y1 === k) return null;
        return QN("On donne " + PCW(lin(a, b), c, tri(1, 0, e)) + ". Calcule " + M("f(f(" + k + "))") + ".", v, M("f(" + k + ") = " + y1) + " (morceau " + (k < c ? 1 : 2) + "), puis " + M("f(" + y1 + ") = " + v) + " (morceau " + (y1 < c ? 1 : 2) + ").",
          { ctx: "fof", guide: [GS(M("f(" + k + ")") + " = ?", y1, "Morceau " + (k < c ? 1 : 2) + " : " + M(y1) + "."), GS(M("f(" + y1 + ")") + " = ?", v, "Morceau " + (y1 < c ? 1 : 2) + " (compare " + y1 + " à " + c + ") : " + M(v) + ".")],
            traps: [TR(y1, "C'est f(" + k + ") ; il faut encore calculer f de ce résultat."), TR(y1 < c ? y1 * y1 + e : a * y1 + b, "Pour f(" + y1 + "), compare " + y1 + " à la frontière " + c + " : autre morceau.")] }); },
    ],
  };

  const PROBS = {
    absval: [() => P("Sur une route droite, deux bornes sont aux kilomètres 12 et 30. On cherche les points (kilomètre x) dont la somme des distances aux deux bornes vaut 26 km : " + M("|x - 12| + |x - 30| = 26") + ".", [["a) Distance entre les deux bornes (km)", 18], ["b) Plus petite solution x", 8], ["c) Plus grande solution x", 34]], ["Entre les bornes, la somme vaut toujours 18 : trop peu.", "À gauche de 12, la somme vaut (12 − x) + (30 − x)."], "a) 18 ; b) " + M("42 - 2x = 26") + ", " + M("x = 8") + " ; c) par symétrie, " + M("x = 34") + ".")],
    morceaux: [() => P("Un parking : 4 CHF pour les 2 premières heures (ou moins), puis 2,50 CHF par heure supplémentaire, avec un maximum de 20 CHF par jour.", [["a) Prix pour 5 heures (CHF)", 11.5], ["b) Dès combien d'heures paie-t-on le maximum ?", 9], ["c) Prix pour 12 heures (CHF)", 20]], ["5 h = 2 h + 3 h en plus.", "4 + 2,5 · (t − 2) ≥ 20."], "a) " + M("4 + 3 \\cdot 2{,}5 = 11{,}5") + " ; b) " + M("2{,}5(t - 2) \\ge 16") + ", " + M("t \\ge 8{,}4") + " : dès 9 heures ; c) le maximum, 20 CHF.")],
    fimg: [() => P("Soit f(x) = x² − 2x − 3.", [["a) f(−2)", 5], ["b) f(0)", -3], ["c) Plus grande préimage de 0", 3]], ["(−2)² = 4.", "x² − 2x − 3 = (x − 3)(x + 1)."], "a) " + M("4 + 4 - 3 = 5") + " ; b) −3 ; c) zéros −1 et 3 : 3.")],
    lectgraph: [() => P("Une parabole a pour sommet S(2 ; −4) et coupe l'axe des x en 0 et 4.", [["a) Valeur minimale de f", -4], ["b) Plus grand zéro", 4], ["c) Nombre de solutions de f(x) = −2", 2]], ["Le sommet est le point le plus bas.", "y = −2 est au-dessus du sommet."], "a) −4 ; b) 4 ; c) la droite coupe la parabole 2 fois.")],
    racinv: [() => P("f(x) = 12/x et g(x) = x + 1.", [["a) f(3)", 4], ["b) Préimage de 6 par f", 2], ["c) Plus grande abscisse d'intersection de f et g", 3]], ["12/x = x + 1 ⇔ x² + x − 12 = 0.", "(x + 4)(x − 3) = 0."], "a) 4 ; b) 2 ; c) x = 3 (et x = −4).")],
    modaff: [() => P("Club de fitness : A = 15 CHF par séance ; B = 120 CHF d'abonnement + 7 CHF par séance.", [["a) Coût de 10 séances avec A", 150], ["b) Coût de 10 séances avec B", 190], ["c) Nombre minimum de séances pour que B soit strictement moins cher", 16]], ["15n < 120 + 7n ?", "8n > 120 ⇔ n > 15."], "a) 150 ; b) 190 ; c) 16.")],
    transf: [() => P("f(x) = x² ; g(x) = (x − 3)² − 5.", [["a) Abscisse du sommet de g", 3], ["b) Ordonnée du sommet de g", -5], ["c) g(5)", -1]], ["(x − 3) : 3 vers la droite.", "g(5) = 2² − 5."], "a) 3 ; b) −5 ; c) −1.")],
  };

  // ===================== Chantier X (24.11) : lectgraph, lecture sur figure (image, antécédent, extremum sur un
  // intervalle, symétrie, inéquation f ≥ g, f(f(k))). Valeurs lues sur des nœuds du quadrillage.
  const parab = () => { const s = pk([1, -1, 0.5, -0.5]), h = R.int(-2, 2), c = s > 0 ? R.int(-5, -1) : R.int(1, 5); return { s, h, c, f: (x) => s * (x - h) ** 2 + c }; };
  const okV = (v) => Number.isInteger(v) && Math.abs(v) >= 2 && Math.abs(v) <= 6;
  LG[1].push(
    () => { const P = parab(), xs = [-4, -3, -2, -1, 1, 2, 3, 4].filter((x) => x !== P.h && okV(P.f(x)) && Math.abs(P.f(x)) !== Math.abs(x)); if (!xs.length) return null; const k = pk(xs), v = P.f(k);
      return QN("La courbe représente une fonction " + M("f") + ". Lis " + M("f(" + k + ")") + " sur le graphique.", v, "On part de " + M("x = " + k) + " sur l'axe horizontal, on va verticalement jusqu'à la courbe, puis on lit la hauteur sur l'axe vertical : " + M("f(" + k + ") = " + v) + ".",
        { ctx: "lire-image", fig: PL([{ f: P.f }]), guide: [GS("Repère " + M(k) + " sur l'axe horizontal, va jusqu'à la courbe. Hauteur du point atteint ?", v, M(v) + ".")],
          traps: [TR(k, "f(" + k + ") est une ordonnée (hauteur), pas l'abscisse."), TR(-v, "Le point est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal."), TR(P.f(-k), "Ça, c'est f(" + -k + ") : vérifie de quel côté de l'axe vertical se trouve x = " + k + ".")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5]), h = R.int(-3, 0), c = R.int(-4, 4), f = (x) => s * (x - h) ** 2 + c, xs = [h + 1, h + 2, h + 3, h + 4].filter((x) => Math.abs(x) >= 2 && okV(f(x)) && Math.abs(f(x)) <= 5 && Math.abs(f(x)) !== Math.abs(x)); if (!xs.length) return null; const x0 = pk(xs), v = f(x0);
      return QN("La fonction " + M("f") + " est définie sur " + M("[" + h + " \\,;\\, 6]") + " (courbe tracée). Résous " + M("f(x) = " + v) + " en lisant le graphique (il y a une seule solution).", x0, "On part de " + M(v) + " sur l'axe vertical, on va horizontalement jusqu'à la courbe, puis on descend (ou monte) jusqu'à l'axe horizontal : " + M("x = " + x0) + ".",
        { ctx: "lire-antecedent", fig: PL([{ f, from: h, to: 6 }], { hlines: [v] }), guide: [GS("Repère " + M(v) + " sur l'axe VERTICAL (droite pointillée). Abscisse du point où elle coupe la courbe ?", x0, M(x0) + ".")],
          traps: [TR(v, "On cherche x (axe horizontal), pas la valeur " + v + "."), TR(Number.isInteger(f(v)) && v >= h ? f(v) : NaN, "Ça, c'est f(" + v + "). On cherche le x dont l'image vaut " + v + "."), TR(-x0, "Vérifie de quel côté de l'axe vertical est le point.")] }); },
  );
  LG[2].push(
    () => { const P = parab(); let a, b; do { a = R.int(-5, 2); b = a + R.int(3, 6); } while (b > 5); const xs = []; for (let x = a; x <= b; x++) xs.push(x); if (!xs.every((x) => Number.isInteger(P.f(x))) || Math.abs(P.f(a)) > 7 || Math.abs(P.f(b)) > 7) return null;
      const mx = R.rand() < 0.5, vals = xs.map(P.f), best = mx ? Math.max(...vals) : Math.min(...vals), at = xs[vals.indexOf(best)], other = mx ? Math.min(...vals) : Math.max(...vals); if (vals.filter((v) => v === best).length > 1 || Math.abs(best) < 2) return null;
      return QN("La fonction " + M("f") + " est définie sur " + M("[" + a + " \\,;\\, " + b + "]") + " (courbe tracée). Quel est son " + (mx ? "maximum" : "minimum") + " sur cet intervalle ?", best, "Le point " + (mx ? "le plus haut" : "le plus bas") + " de la courbe est en " + M("x = " + at) + (at === a || at === b ? " (une extrémité de l'intervalle)" : " (le sommet)") + " : " + (mx ? "maximum " : "minimum ") + M(best) + ".",
        { ctx: mx ? "max-intervalle" : "min-intervalle", fig: PL([{ f: P.f, from: a, to: b }], { yr: [-7, 7] }), guide: [GS("Repère le point " + (mx ? "le plus haut" : "le plus bas") + " de la courbe (regarde aussi les extrémités). Son abscisse ?", at, M(at) + "."), GS("Sa hauteur (lue sur l'axe vertical) ?", best, M(best) + ".")],
          traps: [TR(at, "Ça, c'est l'abscisse où il est atteint ; " + (mx ? "le maximum" : "le minimum") + " est une valeur de f (ordonnée)."), TR(other, "Ça, c'est " + (mx ? "le minimum" : "le maximum") + "."), TR(P.c, "Le sommet n'est pas forcément le point " + (mx ? "le plus haut" : "le plus bas") + " sur un intervalle : regarde les extrémités.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5]), h = nz(-2, 2), c = s > 0 ? R.int(-5, -1) : R.int(1, 5), f = (x) => s * (x - h) ** 2 + c, xs = [-4, -3, -2, 2, 3, 4].filter((x) => x !== h && Math.abs(f(x)) <= 6 && Number.isInteger(f(x)) && Math.abs(2 * h - x) <= 5 && Math.abs(2 * h - x) !== Math.abs(x) && Math.abs(2 * h - x) >= 2); if (!xs.length) return null; const x0 = pk(xs), y0 = f(x0), r = 2 * h - x0;
      return QN("La courbe représente une fonction " + M("f") + " (une parabole). Le point marqué a pour abscisse " + M(x0) + ". Quel autre nombre a la même image que " + M(x0) + " ?", r, "La parabole est symétrique par rapport à la droite verticale " + M("x = " + h) + " passant par son sommet. " + M(x0) + " est à " + Math.abs(x0 - h) + " de " + M(h) + " ; l'autre nombre est de l'autre côté : " + M(r) + ". En effet, " + M("f(" + x0 + ") = f(" + r + ") = " + y0) + ".",
        { ctx: "symetrie", fig: FIG.plot([{ f }], [[x0, y0, ""]], { numbers: true, xr: [-6, 6], yr: [-6, 6], hlines: [y0] }), guide: [GS("Abscisse du sommet (axe de symétrie) ?", h, M(h) + "."), GS("Le point marqué et l'autre point de la droite pointillée sont symétriques par rapport à cet axe. Abscisse de l'autre ?", r, M(r) + ".")],
          traps: [TR(-x0, "La symétrie n'est pas par rapport à l'axe vertical du repère, mais par rapport à la droite x = " + h + " (sommet)."), TR(y0, "On cherche une abscisse (un nombre x), pas l'image."), TR(h, "Ça, c'est l'abscisse du sommet.")] }); },
  );
  LG[3].push(
    () => { const p = R.int(-3, 0), q = p + R.int(2, 4), m = pk([1, -1, 0.5, 2]), b0 = R.int(-2, 2), f = (x) => 0.5 * (x - p) * (x - q) + m * x + b0, g = (x) => m * x + b0; if (q > 4 || !Number.isInteger(g(p)) || !Number.isInteger(g(q)) || Math.abs(g(p)) > 6 || Math.abs(g(q)) > 6) return null;
      const op = pk([">=", ">", "<=", "<"]), inside = op[0] === "<", cl = op.length === 2, ivs = inside ? [[p, cl, q, cl]] : [[-Infinity, false, p, cl], [q, cl, Infinity, false]], OP = { ">=": "\\ge", ">": ">", "<=": "\\le", "<": "<" }[op];
      return QS("On a tracé les graphes de " + M("f") + " (courbe) et de " + M("g") + " (droite). Résous graphiquement " + M("f(x) " + OP + " g(x)") + ".", ivs, "Les graphes se coupent en " + M("x = " + p) + " et " + M("x = " + q) + ". La courbe est " + (inside ? "en dessous de" : "au-dessus de") + " la droite " + (inside ? "entre" : "à l'extérieur de") + " ces deux abscisses : " + M("S = " + IT(ivs)) + ".",
        { ctx: "f-sup-g", fig: PL([{ f }, { f: g }], { yr: [-6, 6] }), guide: [GS("Abscisse du point d'intersection de gauche ?", p, M(p) + "."), GS("De droite ?", q, M(q) + "."), GSS("Où la courbe est-elle " + (inside ? "en dessous de" : "au-dessus de") + " la droite ? Ensemble des solutions :", ivs, M(IT(ivs)) + ".")],
          traps: [TS(inside ? [[-Infinity, false, p, cl], [q, cl, Infinity, false]] : [[p, cl, q, cl]], "Regarde où la courbe est " + (inside ? "en DESSOUS de" : "au-DESSUS de") + " la droite."), TS(inside ? [[p, !cl, q, !cl]] : [[-Infinity, false, p, !cl], [q, !cl, Infinity, false]], cl ? "Inégalité large : les points d'intersection sont solutions (crochets fermés)." : "Inégalité stricte : les points d'intersection sont exclus."), TS(inside ? [[g(p), cl, g(q), cl]].map((r) => r[0] < r[2] ? r : [r[2], cl, r[0], cl]) : [[-Infinity, false, Math.min(g(p), g(q)), cl]], "Les solutions sont des abscisses (axe horizontal), pas des ordonnées.")] }); },
    () => { const s = pk([1, -1]), h = R.int(-2, 2), c = R.int(-4, 4), f = (x) => s * (x - h) ** 2 + c, xs = [-3, -2, -1, 0, 1, 2, 3].filter((x) => { const y = f(x); return Math.abs(y) <= 5 && y !== x && Math.abs(f(y)) <= 6 && Math.abs(f(y)) >= 2 && f(y) !== y; }); if (!xs.length) return null; const k = pk(xs), y1 = f(k), y2 = f(y1);
      return QN("La courbe représente une fonction " + M("f") + ". Calcule " + M("f(f(" + k + "))") + " en lisant deux fois le graphique.", y2, "On lit d'abord " + M("f(" + k + ") = " + y1) + ", puis l'image de ce résultat : " + M("f(" + y1 + ") = " + y2) + ".",
        { ctx: "f-de-f", fig: PL([{ f }]), guide: [GS("Première lecture : " + M("f(" + k + ")") + " ?", y1, M(y1) + "."), GS("Deuxième lecture : " + M("f(" + y1 + ")") + " ? (pars de " + M(y1) + " sur l'axe HORIZONTAL)", y2, M(y2) + ".")],
          traps: [TR(y1, "Ça, c'est f(" + k + ") ; il faut encore lire l'image de " + y1 + "."), TR(y1 * y1, "f(f(x)) n'est pas f(x)² : on relit l'image de " + y1 + " sur la courbe.")] }); },
  );
  // « Trouve l'erreur » (24.11, chantier I, suite) : -(-k)^2 calculé comme +k^2.
  FI[2].push(() => { for (let essai = 0; ; essai++) { const k = R.int(2, 5), b = nz(-6, 6), c = nz(-9, 9), x = -k, v = -k * k + b * x + c, faux = k * k + b * x + c, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    const q = QN("Soit " + M("f(x) = " + tri(-1, b, c)) + ". " + w + " calcule : « " + M("f(" + x + ") = " + k * k + sg(b * x) + sg(c) + " = " + faux) + " ». Trouve l'erreur, puis donne " + M("f(" + x + ")") + ".", v,
      "Erreur : " + M("-x^2") + " vaut " + M("-(" + x + ")^2 = -" + k * k) + " : on élève au carré <b>avant</b> d'appliquer le signe moins. " + M("f(" + x + ") = -" + k * k + sg(b * x) + sg(c) + " = " + v) + ".",
      { ctx: "erreur", guide: [GS(M("(" + x + ")^2") + " = ?", k * k, M(k * k) + "."), GS(M("-(" + x + ")^2") + " = ?", -k * k, M(-k * k) + " (le moins reste devant le carré)."), GS(M("f(" + x + ")") + " = ?", v, M(-k * k + sg(b * x) + sg(c) + " = " + v) + ".")],
        traps: [TR(faux, "C'est le résultat de " + w + " : " + M("-(" + x + ")^2 = -" + k * k) + ", pas " + M("+" + k * k) + ".")] });
    if (essai >= 20 || (Math.abs(v) > 1 && !trivialQ(q, 0) && !answerShown(q))) return q; } });
  const ALL = { fimg: FI, lectgraph: LG, racinv: RI, modaff: MA, transf: TF, absval: AV, morceaux: MO };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    fimg: "Image : remplace x par le nombre (avec des parenthèses). Préimage : résous f(x) = valeur ; il peut y en avoir plusieurs.",
    lectgraph: "Zéros : sur l'axe horizontal. Valeurs : sur l'axe vertical. f(x) = k : abscisses des points de la courbe à la hauteur k.",
    racinv: "√x : élève au carré puis vérifie (solutions parasites). a/x : multiplie par x. Intersection : égalise les deux expressions.",
    modaff: "Coût = part fixe + prix unitaire · quantité. Pour comparer deux offres, égalise-les ; le résultat est souvent un entier à arrondir.",
    transf: "f(x − a) + b : a vers la droite, b vers le haut ; le point (p ; q) devient (p + a ; q + b). k · f(x) multiplie les ordonnées.",
    absval: "|A| est la distance de A à 0. |A| = b (b ≥ 0) : A = b ou A = −b ; isole d'abord la valeur absolue ; si elle doit être négative, aucune solution.",
    morceaux: "Compare d'abord x à la frontière pour choisir le morceau. Pour résoudre, résous dans chaque morceau et garde ce qui est dans le bon intervalle.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    fimg: ["Image, préimage, lecture", "Racine, deux préimages, lecture", "Trinôme, f(f(x)), paramètre"],
    lectgraph: ["Zéros, ordonnée à l'origine", "Extremums, nombre de solutions", "Signe, variations, f(x) = g(x)"],
    racinv: ["Images et préimages", "Équations avec racine, intersections", "Parasites, paramètre"],
    modaff: ["Coût total, prix unitaire, budget", "Seuil, égalité d'offres, expression", "Bougie, bénéfice, réservoir"],
    transf: ["Sommet, expression, décalage", "Point, sommet composé, valeur absolue", "Étirement, calcul de g, forme canonique"],
    absval: ["Calculer, distance, équation simple", "Isoler, deux cas, aucune solution", "Milieu, vérification, inéquation"],
    morceaux: ["Image, lecture, tarif", "Équation, |x − a| par morceaux, tarif inverse", "Continuité, deux morceaux affines, f(f(x))"],
  });
})();

// Chantier 1re Collège (bêta-testeurs) · lot 4 du plan pas à pas (19.11) : une seule source pour polyop, factor2,
// trinfact, f2, f2formes. Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs typiques
// (expressions fausses mais plausibles), étiquette ctx ; défis en plusieurs étapes. Coefficients entiers : poly() sert
// à la fois d'écriture TeX et de réponse attendue (le lecteur d'expressions accepte « 3x »).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(6)); return Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const sg = (v) => (v < 0 ? " - " + -v : " + " + v);
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? sg(b) : "");
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : String(a));
  const P2 = (cs) => poly(ptrim(cs));
  // ---------- constructeurs ----------
  const show = (spec) => (spec.kind === "pair" || spec.kind === "set" ? spec.values.map(fS).join(" ; ") : "");
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QX = (q, expr, form, sol, o) => mk(q, Object.assign({ kind: "expr", expr }, form ? { form } : {}), sol, Object.assign({ canon: expr }, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const DEV = "Développe et réduis : ", FAC = "Factorise au maximum dans \\(\\mathbb{R}\\) : "; // 22.11 : dans R (retour de l auteur)
  const fx = (a, p, q) => co(a) + "(" + xm(p) + ")(" + xm(q) + ")";

  // ===================== polyop =====================
  const PO = {
    1: [
      () => { const a = nz(-4, 4), b = nz(-7, 7), c = nz(-4, 4), e = nz(-7, 7), cs = pmul([a, b], [c, e]); if (Math.abs(a) === 1 && Math.abs(c) === 1) return null;
        return QX(DEV + M("(" + lin(a, b) + ")(" + lin(c, e) + ")") + ".", P2(cs), "expanded", "Double distributivité : " + M(a * c + "x^2" + sg(a * e) + "x" + sg(b * c) + "x" + sg(b * e) + " = " + P2(cs)) + ".",
          { ctx: "double-distrib", guide: [GS("Coefficient de " + M("x^2") + " ?", a * c, M(a + " \\cdot " + par(c) + " = " + a * c) + "."), GS("Coefficient de " + M("x") + " (" + M(a + " \\cdot " + par(e) + " + " + b + " \\cdot " + par(c)) + ") ?", a * e + b * c, M(a * e + b * c) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([a * c, 0, b * e]), "Il manque les produits croisés : chaque terme multiplie chaque terme."), TX(P2([a * c, a * e - b * c, b * e]), "Attention aux signes des produits croisés.")] }); },
      () => { const a = R.int(2, 6), b = nz(-6, 6), c = R.int(2, 6), e = nz(-6, 6), cs = [a - c, a * b + c * e]; if (a === c) return null;
        return QX(DEV + M(a + "(" + lin(1, b) + ") - " + c + "(" + lin(1, -e) + ")") + ".", P2(cs), "expanded", M(a + "x" + sg(a * b) + " - " + c + "x" + sg(c * e) + " = " + P2(cs)) + " : le « − » devant la parenthèse change tous les signes.",
          { ctx: "moins-parenthese", guide: [GX("Développe " + M("-" + c + "(" + lin(1, -e) + ")"), P2([-c, c * e]), M(P2([-c, c * e])) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([a - c, a * b - c * e]), "−" + c + " · (" + -e + ") = " + c * e + " : le moins change le signe du 2e terme aussi.")] }); },
      () => { const a = nz(-8, 8), k = pk([1, 2, 3]), sq = R.rand() < 0.5, cs = sq ? [k * k, 2 * k * a, a * a] : [k * k, 0, -a * a];
        return QX(DEV + M(sq ? "(" + lin(k, a) + ")^2" : "(" + lin(k, a) + ")(" + lin(k, -a) + ")") + ".", P2(cs), "expanded", (sq ? "Identité " + M("(A + B)^2 = A^2 + 2AB + B^2") : "Identité " + M("(A + B)(A - B) = A^2 - B^2")) + " : " + M(P2(cs)) + ".",
          { ctx: sq ? "identite-carre" : "identite-diff", guide: [GS(sq ? "Double produit " + M("2AB") + " (coefficient de x) ?" : "Coefficient de " + M("x^2") + " ?", sq ? 2 * k * a : k * k, M(sq ? 2 * k * a : k * k) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: sq ? [TX(P2([k * k, 0, a * a]), "(A + B)² n'est pas A² + B² : il manque le double produit 2AB."), TX(P2([k * k, k * a, a * a]), "Le double produit vaut 2AB.")] : [TX(P2([k * k, 0, a * a]), "(A + B)(A − B) = A² − B² : le dernier terme est négatif.")] }); },
    ],
    2: [
      () => { const a = R.int(2, 5), b = nz(-6, 6), c = R.int(1, 4), e = R.int(1, 7), cs = padd(pmul([a, b], [a, b]), pscale([c * c, 0, -e * e], -1));
        return QX(DEV + M("(" + lin(a, b) + ")^2 - (" + lin(c, e) + ")(" + lin(c, -e) + ")") + ".", P2(cs), "expanded", M("(" + lin(a, b) + ")^2 = " + P2(pmul([a, b], [a, b]))) + " et " + M("(" + lin(c, e) + ")(" + lin(c, -e) + ") = " + P2([c * c, 0, -e * e])) + " ; on soustrait : " + M(P2(cs)) + ".",
          { ctx: "carre-moins-produit", guide: [GX("Développe " + M("(" + lin(a, b) + ")^2"), P2(pmul([a, b], [a, b])), M(P2(pmul([a, b], [a, b]))) + "."), GX("Développe " + M("(" + lin(c, e) + ")(" + lin(c, -e) + ")"), P2([c * c, 0, -e * e]), M(P2([c * c, 0, -e * e])) + "."), GX("Différence", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2(padd(pmul([a, b], [a, b]), [-c * c, 0, -e * e])), "On soustrait TOUT le 2e produit : −(" + c * c + "x² − " + e * e + ") = −" + c * c + "x² + " + e * e + "."), TX(P2(padd([a * a, 0, b * b], [-c * c, 0, e * e])), "(A + B)² = A² + 2AB + B².")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = nz(-6, 6), cs = pmul([1, a], [1, b, c]);
        return QX(DEV + M("(" + lin(1, a) + ")(" + P2([1, b, c]) + ")") + ".", P2(cs), "expanded", M("x(" + P2([1, b, c]) + ")" + sg(a) + "(" + P2([1, b, c]) + ") = " + P2(cs)) + ".",
          { ctx: "cubique", guide: [GX("Développe " + M("x(" + P2([1, b, c]) + ")"), P2([1, b, c, 0]), M(P2([1, b, c, 0])) + "."), GX("Développe " + M(a + "(" + P2([1, b, c]) + ")"), P2([a, a * b, a * c]), M(P2([a, a * b, a * c])) + "."), GX("Somme réduite", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([1, b, c + a]), "Chaque terme de la 1re parenthèse multiplie chaque terme de la 2e."), TX(P2([1, b + a, c + a * b, a * c + 1]), "Regroupe bien les termes de même degré.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6); if (a === b || a === -b) return null; const cs = [2 * (a - b), a * a - b * b];
        return QX(DEV + M("(" + lin(1, a) + ")^2 - (" + lin(1, b) + ")^2") + ".", P2(cs), "expanded", M(P2([1, 2 * a, a * a]) + " - (" + P2([1, 2 * b, b * b]) + ") = " + P2(cs)) + " : les " + M("x^2") + " s'annulent.",
          { ctx: "difference-carres", guide: [GS("Que devient " + M("x^2 - x^2") + " ?", 0, "0 : il ne reste qu'un 1er degré."), GS("Coefficient de " + M("x") + " ?", 2 * (a - b), M(2 * a + " - " + par(2 * b) + " = " + 2 * (a - b)) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([2 * (a + b), a * a + b * b]), "On soustrait tout le 2e carré : les signes changent."), TX(String(a * a - b * b), "N'oublie pas les doubles produits.")] }); },
    ],
    3: [
      () => { const a = pk([1, 2]), b = nz(-3, 3), p = nz(-4, 4), r = nz(-5, 5), cube = pmul(pmul([a, b], [a, b]), [a, b]), cs = padd(cube, pscale(pmul([1, p], [1, 0, r]), -1));
        return QX(DEV + M("(" + lin(a, b) + ")^3 - (" + lin(1, p) + ")(" + P2([1, 0, r]) + ")") + ".", P2(cs), "expanded", M("(" + lin(a, b) + ")^3 = " + P2(cube)) + " ; " + M("(" + lin(1, p) + ")(" + P2([1, 0, r]) + ") = " + P2(pmul([1, p], [1, 0, r]))) + " ; différence : " + M(P2(cs)) + ".",
          { ctx: "cube", guide: [GX("Développe " + M("(" + lin(a, b) + ")^3"), P2(cube), M(P2(cube)) + "."), GX("Développe le produit", P2(pmul([1, p], [1, 0, r])), M(P2(pmul([1, p], [1, 0, r]))) + "."), GX("Différence", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2(padd([a ** 3, 0, 0, b ** 3], pscale(pmul([1, p], [1, 0, r]), -1))), "(A + B)³ n'est pas A³ + B³ : (A + B)³ = A³ + 3A²B + 3AB² + B³.")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = nz(-4, 4); if (new Set([a, b, c]).size < 3) return null; const cs = pmul(pmul([1, a], [1, b]), [1, c]);
        return QX(DEV + M("(" + lin(1, a) + ")(" + lin(1, b) + ")(" + lin(1, c) + ")") + ".", P2(cs), "expanded", M("(" + lin(1, a) + ")(" + lin(1, b) + ") = " + P2(pmul([1, a], [1, b]))) + ", puis fois " + M("(" + lin(1, c) + ")") + " : " + M(P2(cs)) + ".",
          { ctx: "trois-facteurs", guide: [GX("D'abord " + M("(" + lin(1, a) + ")(" + lin(1, b) + ")"), P2(pmul([1, a], [1, b])), M(P2(pmul([1, a], [1, b]))) + "."), GS("Terme constant (" + M(a + " \\cdot " + par(b) + " \\cdot " + par(c)) + ") ?", a * b * c, M(a * b * c) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([1, a + b + c, a * b * c]), "Le produit de trois facteurs du 1er degré est de degré 3.")] }); },
      () => { const a = pk([1, 2, 3]), k = R.int(1, 5), cs = [a * a, 0, 0, 0, -(k ** 4)];
        return QX(DEV + M("(" + co(a) + "x^2 - " + k * k + ")(" + co(a) + "x^2 + " + k * k + ")") + ".", P2(cs), "expanded", "Identité " + M("(A - B)(A + B) = A^2 - B^2") + " avec " + M("A = " + co(a) + "x^2") + " : " + M(P2(cs)) + ".",
          { ctx: "identite-x2", guide: [GX(M("A^2 = (" + co(a) + "x^2)^2"), P2([a * a, 0, 0, 0, 0]), M(P2([a * a, 0, 0, 0, 0])) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([a * a, 0, -(k ** 4)]), "(x²)² = x⁴ : on multiplie les exposants."), TX(P2([a * a, 0, 0, 0, -k * k]), "B² = (" + k * k + ")² = " + k ** 4 + ".")] }); },
    ],
  };

  // ===================== factor2 =====================
  const FC = {
    1: [
      () => { const a = R.int(2, 6), m = nz(-9, 9), e = a + "x(" + lin(1, m) + ")";
        return QX(FAC + M(P2([a, a * m, 0])) + ".", e, "product", "Mise en évidence de " + M(a + "x") + " : " + M(e) + ".",
          { ctx: "mise-en-evidence", guide: [GX("Facteur commun", a + "x", M(a + "x") + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX("x(" + a + "x" + (a * m < 0 ? "-" + -a * m : "+" + a * m) + ")", "On peut encore sortir " + a + " : factorise au maximum."), TX(a + "(x^2" + (m < 0 ? "-" + -m : "+" + m) + ")", "x aussi est commun aux deux termes.")] }); },
      () => { const a = R.int(1, 6), k = R.int(1, 9), e = co(a) + "(x-" + k + ")(x+" + k + ")";
        return QX(FAC + M(P2([a, 0, -a * k * k])) + ".", e, "product", (a > 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "différence de carrés " + M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + ".",
          { ctx: "diff-carres", guide: [GS("Quel nombre au carré donne " + M(k * k) + " ?", k, M(k) + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX(co(a) + "(x-" + k + ")^2", "x² − " + k * k + " = (x − " + k + ")(x + " + k + ") : différence de carrés, pas un carré."), ...(a > 1 ? [TX("(" + a + "x-" + a * k + ")(x+" + k + ")", "Mets d'abord " + a + " en évidence pour factoriser au maximum.")] : [])] }); },
      () => { const k = nz(-8, 8), a = pk([1, 1, 2, 3]), e = co(a) + "(x" + (k < 0 ? "-" + -k : "+" + k) + ")^2";
        return QX(FAC + M(P2([a, 2 * a * k, a * k * k])) + ".", e, "product", (a > 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "identité " + M("A^2 + 2AB + B^2 = (A + B)^2") + " : " + M(co(a) + "(" + xm(-k) + ")^2") + ".",
          { ctx: "carre-parfait", guide: [GS("Le terme constant (" + M(k * k) + ") est le carré de… (avec le signe du terme en x) ?", k, M(k) + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX(co(a) + "(x" + (k < 0 ? "+" + -k : "-" + k) + ")^2", "Le signe dans la parenthèse est celui du terme en x."), TX(co(a) + "(x-" + Math.abs(k) + ")(x+" + Math.abs(k) + ")", "Ce n'est pas une différence de carrés : il y a un terme en x.")] }); },
    ],
    2: [
      () => { const p = nz(-7, 7), q = nz(-7, 7), a = pk([1, 1, 2, 3, -1]); if (p === q || p === -q) return null; const cs = pscale(pmul([1, -p], [1, -q]), a), e = co(a) + "(" + xm(p) + ")(" + xm(q) + ")";
        return QX(FAC + M(P2(cs)) + ".", e.replace(/ /g, ""), "product", (a !== 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "deux nombres de somme " + M(-(p + q)) + " et de produit " + M(p * q) + " : " + M(-p) + " et " + M(-q) + ". " + M(e) + ".",
          { ctx: "somme-produit", guide: [GSet("Zéros du trinôme ?", [p, q], M(p) + " et " + M(q) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX(co(a) + "(" + xm(-p) + ")(" + xm(-q) + ")".replace(/ /g, ""), "Zéro p ↔ facteur (x − p) : le signe s'inverse.")] }); },
      () => { const a = pk([2, 3, 4]), b = nz(-5, 5), c = R.int(1, 7), e = "(" + lin(a, b - c) + ")(" + lin(a, b + c) + ")";
        return QX(FAC + M("(" + lin(a, b) + ")^2 - " + c * c) + ".", e.replace(/ /g, ""), "product", "Différence de carrés " + M("A^2 - B^2 = (A - B)(A + B)") + " avec " + M("A = " + lin(a, b)) + " et " + M("B = " + c) + " : " + M(e) + ".",
          { ctx: "diff-carres-bloc", guide: [GS(M("B") + " (" + M("B^2 = " + c * c) + ") ?", c, M(c) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX("(" + lin(a, b) + "-" + c + ")^2", "A² − B² = (A − B)(A + B), pas (A − B)².")] }); },
      () => { const a = R.int(2, 5), p = nz(-6, 6), r = pk([1, 2, 3]) * pk([1, -1]), e = a + "x(x-" + Math.abs(r) + ")(x+" + Math.abs(r) + ")";
        return QX(FAC + M(P2([a, 0, -a * r * r, 0])) + ".", e, "product", "Mise en évidence de " + M(a + "x") + " : " + M(a + "x(x^2 - " + r * r + ")") + ", puis différence de carrés : " + M(e) + ".",
          { ctx: "evidence-puis-diff", guide: [GX("Après la mise en évidence de " + M(a + "x"), a + "x(x^2-" + r * r + ")", M(a + "x(x^2 - " + r * r + ")") + "."), GX("Factorisation complète", e, M(e) + ".")], traps: [TX(a + "x(x^2-" + r * r + ")", "On peut encore factoriser x² − " + r * r + " (différence de carrés).")] }); },
    ],
    3: [
      () => { const p = nz(-5, 5), q = R.int(1, 5); if (Math.abs(p) === q) return null; const e = "(" + lin(1, p) + ")(x-" + q + ")(x+" + q + ")";
        return QX(FAC + M(P2([1, p, -q * q, -p * q * q])) + ".", e.replace(/ /g, ""), "product", "Groupements : " + M("x^2(" + lin(1, p) + ") - " + q * q + "(" + lin(1, p) + ") = (" + lin(1, p) + ")(x^2 - " + q * q + ")") + ", puis différence de carrés.",
          { ctx: "groupement", guide: [GX("Après groupement", "(" + lin(1, p).replace(/ /g, "") + ")(x^2-" + q * q + ")", M("(" + lin(1, p) + ")(x^2 - " + q * q + ")") + "."), GX("Factorisation complète", e.replace(/ /g, ""), M(e) + ".")], traps: [TX("(" + lin(1, p).replace(/ /g, "") + ")(x^2-" + q * q + ")", "x² − " + q * q + " se factorise encore.")] }); },
      () => { let a, b, c, e; do { a = R.int(2, 4); b = nz(-5, 5); c = R.int(1, 3); e = nz(-5, 5); } while (gcd(a, Math.abs(b)) !== 1 || gcd(c, Math.abs(e)) !== 1 || a * e === b * c); const f = "(" + lin(a, b) + ")(" + lin(c, e) + ")";
        return QX(FAC + M(P2(pmul([a, b], [c, e]))) + ".", f.replace(/ /g, ""), "product", "Zéros " + M(fT(-b / a)) + " et " + M(fT(-e / c)) + " (discriminant) : " + M(f) + ".",
          { ctx: "non-unitaire", guide: [GSet("Zéros (fractions acceptées) ?", [-b / a, -e / c], M(fT(-b / a)) + " et " + M(fT(-e / c)) + "."), GX("Factorisation", f.replace(/ /g, ""), M(f) + ".")], traps: [TX("(x" + (b < 0 ? "-" + -b : "+" + b) + ")(x" + (e < 0 ? "-" + -e : "+" + e) + ")", "Le coefficient de x² n'est pas 1 : vérifie en développant.")] }); },
      () => { const k = pk([1, 2, 3]), e = "(x-" + k + ")(x+" + k + ")(x^2+" + k * k + ")";
        return QX(FAC + M("x^4 - " + k ** 4) + ".", e, "product", M("x^4 - " + k ** 4 + " = (x^2 - " + k * k + ")(x^2 + " + k * k + ")") + ", et " + M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + " ; " + M("x^2 + " + k * k) + " ne se factorise pas.",
          { ctx: "x4", guide: [GX("Première différence de carrés", "(x^2-" + k * k + ")(x^2+" + k * k + ")", M("(x^2 - " + k * k + ")(x^2 + " + k * k + ")") + "."), GX("Factorisation complète", e, M(e) + ".")], traps: [TX("(x^2-" + k * k + ")(x^2+" + k * k + ")", "x² − " + k * k + " se factorise encore.")] }); },
    ],
  };

  // ===================== trinfact =====================
  const TF = {
    1: [
      () => { const p = nz(-7, 7), q = nz(-7, 7); if (p === q || p === -q) return null; const e = "(" + xm(p) + ")(" + xm(q) + ")";
        return QX("Factorise : " + M(P2([1, -(p + q), p * q])) + ".", e.replace(/ /g, ""), "product", "Deux nombres de somme " + M(p + q) + " et de produit " + M(p * q) + " : les zéros " + M(p) + " et " + M(q) + ". " + M(e) + ".",
          { ctx: "unitaire", guide: [GS("Plus petit zéro ?", Math.min(p, q), M(Math.min(p, q)) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX(("(" + xm(-p) + ")(" + xm(-q) + ")").replace(/ /g, ""), "Zéro p ↔ facteur (x − p).")] }); },
      () => { const p = nz(-6, 6), e = "(" + xm(p) + ")^2";
        return QX("Factorise : " + M(P2([1, -2 * p, p * p])) + ".", e.replace(/ /g, ""), "product", "Un seul zéro (double) : " + M(p) + ". " + M(e) + ".",
          { ctx: "double", guide: [GS("Zéro double ?", p, M(p) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX(("(" + xm(p) + ")(" + xm(-p) + ")").replace(/ /g, ""), "Développe pour vérifier : ce serait x² − " + p * p + ".")] }); },
      () => { const p = nz(-7, 7), q = nz(-7, 7); if (p === q || p === -q) return null;
        return QSet("Quels sont les zéros de " + M(P2([1, -(p + q), p * q])) + " ?", [p, q], M(P2([1, -(p + q), p * q]) + " = (" + xm(p) + ")(" + xm(q) + ")") + " : zéros " + M(p) + " et " + M(q) + ".",
          { ctx: "zeros", guide: [GS("Produit des zéros ?", p * q, M(p * q) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Les zéros sont p et q quand le trinôme vaut (x − p)(x − q).")] }); },
    ],
    2: [
      () => { const a = pk([2, 3, -1, -2]), p = nz(-6, 6), q = nz(-6, 6); if (p === q) return null; const e = (a === -1 ? "-" : a + "*") + "(" + xm(p) + ")*(" + xm(q) + ")";
        return QX("Factorise : " + M(P2([a, -a * (p + q), a * p * q])) + ".", e.replace(/ /g, ""), "product", "Zéros " + M(p) + " et " + M(q) + " : " + M(fx(a, p, q)) + ".",
          { ctx: "coef-a", guide: [GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GX("Factorisation (n'oublie pas " + M("a") + ")", e.replace(/ /g, ""), M(fx(a, p, q)) + ".")], traps: [TX(("(" + xm(p) + ")(" + xm(q) + ")").replace(/ /g, ""), "N'oublie pas le coefficient " + a + " devant les parenthèses.")] }); },
      () => { const a = pk([2, 3]), n = pk([1, -1, a === 2 ? 3 : 2, a === 2 ? -3 : -2]), q = nz(-6, 6), e = "(" + a + "x" + (n > 0 ? "-" + n : "+" + -n) + ")(" + xm(q).replace(/ /g, "") + ")";
        return QX("Factorise : " + M(P2([a, -n - a * q, n * q])) + ".", e, "product", "Zéros " + M(fT(n / a)) + " et " + M(q) + " : " + M(a + "(x - " + (n < 0 ? "(" + fT(n / a) + ")" : fT(n / a)) + ")(" + xm(q) + ") = " + e) + ".",
          { ctx: "zero-fraction", guide: [GSet("Zéros (fraction acceptée) ?", [n / a, q], M(fT(n / a)) + " et " + M(q) + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX("(x" + (n > 0 ? "-" + n : "+" + -n) + ")(" + xm(q).replace(/ /g, "") + ")", "Développe pour vérifier : le coefficient de x² doit être " + a + ".")] }); },
      () => { const a = pk([2, 3, -1, 4]), p = nz(-5, 5), q = nz(-5, 5); if (p === q) return null;
        return QX("Un trinôme a pour coefficient dominant " + M(a) + " et pour zéros " + M(p) + " et " + M(q) + ". Écris-le sous forme développée.", P2([a, -a * (p + q), a * p * q]), "expanded", M(fx(a, p, q) + " = " + P2([a, -a * (p + q), a * p * q])) + ".",
          { ctx: "reconstruire", guide: [GX("Forme factorisée", (a === -1 ? "-" : a + "*") + "(" + xm(p).replace(/ /g, "") + ")*(" + xm(q).replace(/ /g, "") + ")", M(fx(a, p, q)) + "."), GX("Forme développée", P2([a, -a * (p + q), a * p * q]), M(P2([a, -a * (p + q), a * p * q])) + ".")], traps: [TX(P2([1, -(p + q), p * q]), "N'oublie pas le coefficient " + a + "."), TX(P2([a, a * (p + q), a * p * q]), "Zéro p ↔ facteur (x − p).")] }); },
    ],
    3: [
      () => { let a, b, c, d; do { a = pk([2, 3]); b = nz(-3, 3); c = pk([2, 3, 5]); d = nz(-4, 4); } while (gcd(a, Math.abs(b)) !== 1 || gcd(c, Math.abs(d)) !== 1 || a * d === b * c); const e = "(" + lin(a, b) + ")(" + lin(c, d) + ")";
        return QX("Factorise : " + M(P2(pmul([a, b], [c, d]))) + ".", e.replace(/ /g, ""), "product", "Zéros " + M(fT(-b / a)) + " et " + M(fT(-d / c)) + " (discriminant) : " + M(e) + ".",
          { ctx: "deux-fractions", guide: [GSet("Zéros (fractions acceptées) ?", [-b / a, -d / c], M(fT(-b / a)) + " et " + M(fT(-d / c)) + "."), GX("Factorisation à coefficients entiers", e.replace(/ /g, ""), M(e) + ".")], traps: [TX("(x" + (b < 0 ? "-" + -b : "+" + b) + ")(x" + (d < 0 ? "-" + -d : "+" + d) + ")", "Le coefficient de x² vaut " + a * c + " : vérifie en développant.")] }); },
      () => { const a = pk([2, 3, 4]), p = nz(-5, 5), e = a + "*(" + xm(p).replace(/ /g, "") + ")^2";
        return QX("Factorise : " + M(P2([a, -2 * a * p, a * p * p])) + ".", e, "product", "Mise en évidence de " + M(a) + ", puis carré parfait : " + M(a + "(" + xm(p) + ")^2") + ".",
          { ctx: "double-coef", guide: [GX("Après la mise en évidence de " + M(a), "x^2" + (p > 0 ? "-" + 2 * p : "+" + -2 * p) + "*x+" + p * p, M(P2([1, -2 * p, p * p])) + "."), GX("Factorisation", e, M(a + "(" + xm(p) + ")^2") + ".")], traps: [TX("(" + a + "x" + (p > 0 ? "-" + p : "+" + -p) + ")^2", "(" + a + "x − …)² donnerait " + a * a + "x² : sors " + a + " en facteur.")] }); },
      () => { const p = nz(-6, 6), q = nz(-6, 6), b = -(p + q), c = p * q; if (p === q) return null; const nb = R.int(0, 2), cc = nb === 0 ? Math.floor(b * b / 4) + R.int(1, 5) : nb === 1 ? b * b / 4 : c; if (nb === 1 && b % 2) return null;
        return QN("Combien de zéros a le trinôme " + M(P2([1, b, cc])) + " ?", nb === 0 ? 0 : nb === 1 ? 1 : 2, M("\\Delta = " + par(b) + "^2 - 4 \\cdot " + par(cc) + " = " + (b * b - 4 * cc)) + " : " + (nb === 0 ? "négatif, aucun zéro (il ne se factorise pas)." : nb === 1 ? "nul, un zéro double." : "positif, deux zéros."),
          { ctx: "discriminant", guide: [GS(M("\\Delta = b^2 - 4ac") + " = ?", b * b - 4 * cc, M(b * b - 4 * cc) + "."), GS("Nombre de zéros ?", nb === 0 ? 0 : nb === 1 ? 1 : 2, "Selon le signe de Δ.")], traps: [TR(nb === 2 ? 0 : 2, "Δ > 0 : deux zéros ; Δ = 0 : un ; Δ < 0 : aucun."), TR(nb === 1 ? 2 : 1, "Regarde le signe de Δ.")] }); },
    ],
  };

  // ===================== f2 =====================
  const F2 = {
    1: [
      () => { const p = nz(-6, 6), q = nz(-6, 6), a0 = pk([1, -1, 2, -2, 3]); if (p === q) return null;
        return QSet("Détermine les zéros de " + M("f(x) = " + P2([a0, -a0 * (p + q), a0 * p * q])) + ".", [p, q], M("f(x) = " + fx(a0, p, q)) + " : zéros " + M(p) + " et " + M(q) + ".",
          { ctx: "zeros", fig: FIG.parabola((x) => a0 * (x - p) * (x - q) / 3, [], null, false), guide: [GS("Somme des zéros (" + M("-\\frac{b}{a}") + ") ?", p + q, M(p + q) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes : (x − p) s'annule en p.")] }); },
      () => { const h = nz(-5, 5), k = nz(-6, 6), a = pk([1, -1, 2, -3]);
        return QP("Quel est le sommet de la parabole " + M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k)) + " ? Réponds « x ; y ».", [h, k], "Forme canonique " + M("a(x - h)^2 + k") + " : sommet " + M("(" + h + " ; " + k + ")") + ".",
          { ctx: "sommet-canon", guide: [GS("Abscisse du sommet (" + M("h") + ") ?", h, M(h) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "Dans (x − h)², le sommet a pour abscisse h : (" + xm(h) + ") → " + h + "."), TP([h, -k], "Le + k ou − k se lit tel quel.")] }); },
      () => { const p = nz(-5, 5), q = nz(-5, 5), a = pk([1, -1, 2, -2]); if (p === q || p * q === 0) return null;
        return QN("Quelle est l'ordonnée à l'origine de la parabole " + M("f(x) = " + fx(a, p, q)) + " ?", a * p * q, M("f(0) = " + co(a) + "(" + -p + ")(" + -q + ") = " + a * p * q) + ".",
          { ctx: "ordonnee", guide: [GS(M("f(0)") + " = ?", a * p * q, M(a * p * q) + ".")], traps: [TR(p * q, "N'oublie pas le coefficient " + a + "."), TR(-a * p * q, "(0 − " + p + ")(0 − " + q + ") = " + p * q + ".")] }); },
    ],
    2: [
      () => { const h = nz(-4, 4), k = R.int(-6, 6), a = pk([1, -1, 2, -2, 3]);
        return QP("Détermine le sommet de la parabole " + M("f(x) = " + P2([a, -2 * a * h, a * h * h + k])) + ". Réponds « x ; y ».", [h, k], M("x_S = -\\frac{b}{2a} = -\\frac{" + -2 * a * h + "}{" + 2 * a + "} = " + h) + " ; " + M("y_S = f(" + h + ") = " + k) + ".",
          { ctx: "sommet-dev", fig: FIG.parabola((x) => (a * (x - h) ** 2 + k) / 3, [], null, false), guide: [GS(M("x_S = -\\frac{b}{2a}") + " ?", h, M(h) + "."), GS(M("y_S = f(x_S)") + " ?", k, M(k) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "x_S = −b ÷ (2a) : attention au signe."), TP([h, a * h * h + k], "y_S = f(" + h + "), pas le terme constant.")] }); },
      () => { let p, q, a; do { a = pk([2, 3, -2]); p = nz(-5, 5); q = nz(-5, 5); } while (p === q);
        return QSet("Résous " + M(P2([a, -a * (p + q), a * p * q]) + " = 0") + ".", [p, q], "On divise par " + M(a) + " : " + M(P2([1, -(p + q), p * q]) + " = 0") + ", soit " + M("(" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + M(p) + " et " + M(q) + ".",
          { ctx: "equation-a", guide: [GX("Après division par " + M(a), P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q])) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes.")] }); },
      () => { const h = nz(-4, 4), k = nz(-8, 8), a = pk([1, -1, 2, -2]), up = a > 0;
        return QN("Quelle est la valeur " + (up ? "minimale" : "maximale") + " de " + M("f(x) = " + P2([a, -2 * a * h, a * h * h + k])) + " ?", k, "Sommet en " + M("x = " + h) + " ; " + M("f(" + h + ") = " + k) + " ; la parabole est tournée vers le " + (up ? "haut : c'est un minimum" : "bas : c'est un maximum") + ".",
          { ctx: up ? "min" : "max", guide: [GS("Abscisse du sommet ?", h, M(h) + "."), GS("Valeur " + (up ? "minimale" : "maximale") + " ?", k, M(k) + ".")], traps: [TR(h, "La valeur est une ordonnée : calcule f(" + h + ")."), TR(a * h * h + k, "Ça, c'est f(0) ; le " + (up ? "minimum" : "maximum") + " est au sommet.")] }); },
    ],
    3: [
      () => { const a = pk([-2, 2, 3, -3, -1]), b = nz(-7, 7), c = R.int(-5, 5), xs = -b / (2 * a), ys = a * xs * xs + b * xs + c; if (Number.isInteger(xs)) return null;
        return QP("Détermine le sommet de " + M("f(x) = " + P2([a, b, c])) + ". Réponds « x ; y » (fractions acceptées).", [xs, ys], M("x_S = -\\frac{" + b + "}{" + 2 * a + "} = " + fT(xs)) + " ; " + M("y_S = f(x_S) = " + fT(ys)) + ".",
          { ctx: "sommet-frac", guide: [GS(M("x_S") + " (fraction) ?", xs, M(fT(xs)) + "."), GS(M("y_S") + " (fraction) ?", ys, M(fT(ys)) + "."), GP("Sommet ?", [xs, ys], M("(" + fT(xs) + " ; " + fT(ys) + ")") + ".")], traps: [TP([-xs, ys], "x_S = −b ÷ (2a)."), TP([xs, c], "y_S = f(x_S), pas c.")] }); },
      () => { const b = 2 * nz(-6, 6), c = b * b / 4;
        return QN("Pour quelle valeur de " + M("c") + " la parabole " + M("y = " + P2([1, b, 0]) + " + c") + " touche-t-elle l'axe des " + M("x") + " en un seul point ?", c, "Un seul zéro : " + M("\\Delta = " + b * b + " - 4c = 0") + ", donc " + M("c = " + c) + ".",
          { ctx: "tangent-axe", guide: [GS(M("\\Delta = b^2 - 4c") + " doit valoir… ?", 0, "0 (un seul zéro)."), GS(M("c") + " ?", c, M(b * b + " : 4 = " + c) + ".")], traps: [TR(b * b, "Δ = b² − 4c = 0 donne c = b² ÷ 4."), TR(b / 2, "Ça, c'est le zéro double (au signe près) ; on demande c.")] }); },
      () => { const a = pk([1, 2, -1]), h = nz(-4, 4), d = R.int(1, 4), k = -a * d * d;
        return QSet("Une parabole a pour sommet " + M("S(" + h + " ; " + k + ")") + " et coefficient " + M("a = " + a) + ". Quels sont ses zéros ?", [h - d, h + d], M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k) + " = 0 \\iff (" + xm(h) + ")^2 = " + d * d) + " : " + M("x = " + h + " \\pm " + d) + ".",
          { ctx: "zeros-sommet", guide: [GS(M("(" + xm(h) + ")^2") + " = ?", d * d, M(d * d) + "."), GSet("Zéros ?", [h - d, h + d], M(h - d) + " et " + M(h + d) + ".")], traps: [TSet([-d, d], "Les zéros sont symétriques autour de " + h + ", pas de 0."), TSet([h + d], "Il y a deux zéros, symétriques par rapport au sommet.")] }); },
    ],
  };

  // ===================== f2formes =====================
  const FF = {
    1: [
      () => { const a = pk([1, 2, -1, -2, 3]), h = nz(-4, 4), k = nz(-6, 6), cs = [a, -2 * a * h, a * h * h + k];
        return QX(DEV + M(co(a) + "(" + xm(h) + ")^2" + sg(k)) + ".", P2(cs), "expanded", M("(" + xm(h) + ")^2 = " + P2([1, -2 * h, h * h])) + ", fois " + M(a) + ", plus " + M(k) + " : " + M(P2(cs)) + ".",
          { ctx: "canon-dev", guide: [GX("Développe " + M("(" + xm(h) + ")^2"), P2([1, -2 * h, h * h]), M(P2([1, -2 * h, h * h])) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -2 * a * h, a * h * h + a * k]), "Le " + k + " est hors de la parenthèse : il n'est pas multiplié par " + a + "."), TX(P2([a, 0, a * h * h + k]), "(x − h)² contient le double produit −2hx.")] }); },
      () => { const h = R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), k = nz(-6, 6); // 24.11 : h ≠ ±1 (robot)
        return QN("Pour " + M("f(x) = (" + xm(h) + ")^2" + sg(k)) + ", que vaut " + M("h") + " dans la forme " + M("(x - h)^2 + k") + " ?", h, M(xm(h) + " = x - " + par(h)) + " : " + M("h = " + h) + ".",
          { ctx: "lire-h", guide: [GS(M("h") + " ?", h, M(h) + ".")], traps: [TR(-h, M(xm(h)) + " = x − (" + h + ")."), TR(k, "Ça, c'est k.")] }); },
      () => { const h = nz(-5, 5), k = nz(-8, 8);
        return QN("On écrit " + M(P2([1, -2 * h, h * h + k])) + " sous la forme " + M("(x - h)^2 + k") + ". Que vaut " + M("k") + " ?", k, M("h = " + h) + " et " + M("(" + xm(h) + ")^2 = " + P2([1, -2 * h, h * h])) + ", donc " + M("k = " + (h * h + k) + " - " + h * h + " = " + k) + ".",
          { ctx: "lire-k", guide: [GS(M("h") + " (moitié du coefficient de x, au signe près) ?", h, M(h) + "."), GS(M("k") + " ?", k, M(k) + ".")], traps: [TR(h * h + k, "Il faut retirer " + h * h + " (le carré de h)."), TR(h * h + k + h * h, "(x − h)² apporte +" + h * h + " : on le soustrait.")] }); },
    ],
    2: [
      () => { const a = pk([1, 2, -1, -2, 3]), p = R.int(-5, 3), q = p + 2 * R.int(1, 3), h = (p + q) / 2, k = -a * ((q - p) / 2) ** 2; if (p === 0 || q === 0) return null;
        return QN("Soit " + M("f(x) = " + fx(a, p, q)) + ". Dans la forme canonique " + M("a(x - h)^2 + k") + ", que vaut " + M("k") + " ?", k, "Le sommet est au milieu des zéros : " + M("h = " + h) + ". " + M("k = f(" + h + ") = " + k) + ".",
          { ctx: "fact-k", guide: [GS(M("h") + " (milieu des zéros) ?", h, M("\\frac{" + p + " + " + par(q) + "}{2} = " + h) + "."), GS(M("k = f(h)") + " ?", k, M(k) + ".")], traps: [TR(a * p * q, "Ça, c'est f(0)."), TR(-k, "Attention aux signes dans f(" + h + ").")] }); },
      () => { const a = pk([1, -1, 2]), p = R.int(-5, 2), q = p + 2 * R.int(1, 3), h = (p + q) / 2, k = -a * ((q - p) / 2) ** 2;
        return QP("Quel est le sommet de " + M("f(x) = " + fx(a, p, q)) + " ? Réponds « x ; y ».", [h, k], "Milieu des zéros : " + M("h = " + h) + " ; " + M("f(" + h + ") = " + k) + ".",
          { ctx: "fact-sommet", guide: [GS(M("h") + " ?", h, M(h) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "Les zéros sont " + p + " et " + q + " (signes inversés dans les parenthèses)."), TP([h, -k], "Calcule f(" + h + ") avec les signes.")] }); },
      () => { const a = pk([2, 3, -2]), h = nz(-4, 4), k = nz(-8, 8), cs = [a, -2 * a * h, a * h * h + k];
        return QN("On écrit " + M(P2(cs)) + " sous la forme " + M(a + "(x - h)^2 + k") + ". Que vaut " + M("k") + " ?", k, M("h = -\\frac{" + cs[1] + "}{" + 2 * a + "} = " + h) + " ; " + M("k = f(" + h + ") = " + k) + ".",
          { ctx: "dev-k-a", guide: [GS(M("h = -\\frac{b}{2a}") + " ?", h, M(h) + "."), GS(M("k = f(h)") + " ?", k, M(k) + ".")], traps: [TR(cs[2] - h * h, "Avec a = " + a + " : k = c − a·h² = " + cs[2] + " − " + a * h * h + "."), TR(cs[2], "Ça, c'est f(0).")] }); },
    ],
    3: [
      () => { const a = pk([2, -1, 3]), p = nz(-5, 5), q = nz(-5, 5), cs = [a, -a * (p + q), a * p * q];
        return QX(DEV + M(fx(a, p, q)) + ".", P2(cs), "expanded", M("(" + xm(p) + ")(" + xm(q) + ") = " + P2([1, -(p + q), p * q])) + ", fois " + M(a) + " : " + M(P2(cs)) + ".",
          { ctx: "fact-dev", guide: [GX("D'abord " + M("(" + xm(p) + ")(" + xm(q) + ")"), P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q])) + "."), GX("Fois " + M(a), P2(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -(p + q), p * q]), "Le coefficient " + a + " multiplie tous les termes."), TX(P2([a, -a * (p + q), -a * p * q]), "(−" + p + ") · (−" + q + ") = " + p * q + ".")] }); },
      () => { const a = pk([1, 2, -1, -2]), h = nz(-4, 4), d = R.int(1, 4), k = -a * d * d;
        return QSet("Quels sont les zéros de " + M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k)) + " ?", [h - d, h + d], M("(" + xm(h) + ")^2 = " + d * d) + " : " + M(xm(h) + " = \\pm " + d) + ", donc " + M(h - d) + " et " + M(h + d) + ".",
          { ctx: "canon-zeros", guide: [GS(M("(" + xm(h) + ")^2") + " = ?", d * d, M(-k + " : " + par(a) + " = " + d * d) + "."), GSet("Zéros ?", [h - d, h + d], M(h - d) + " et " + M(h + d) + ".")], traps: [TSet([h + d], "Deux solutions : " + xm(h) + " = " + d + " ou −" + d + "."), TSet([-h - d, -h + d], "Attention au signe de h.")] }); },
      () => { const a = pk([2, -2, 3]), h = nz(-4, 4), k = nz(-9, 9), cs = [a, -2 * a * h, a * h * h + k];
        return QP("Écris " + M(P2(cs)) + " sous forme canonique " + M("a(x - h)^2 + k") + " et donne le couple « h ; k ».", [h, k], M(P2(cs) + " = " + a + "(" + xm(h) + ")^2" + sg(k)) + ".",
          { ctx: "canon-couple", guide: [GS(M("h") + " ?", h, M(h) + "."), GS(M("k") + " ?", k, M(k) + "."), GP("Couple ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "h = −b ÷ (2a)."), TP([h, cs[2] - h * h], "k = f(h) = c − a·h².")] }); },
    ],
  };

  const PROBS = {
    polyop: [() => P("A(x) = (x + 3)² et B(x) = (x − 1)(x + 1).", [["a) Coefficient de x dans A", 6], ["b) Terme constant de A − B", 10], ["c) A(2) − B(2)", 22]], ["(x + 3)² = x² + 6x + 9.", "A − B = 6x + 10."], "a) 6 ; b) " + M("9 - (-1) = 10") + " ; c) " + M("25 - 3 = 22") + ".")],
    factor2: [() => P("f(x) = 2x³ − 18x.", [["a) Coefficient mis en évidence (avec x) : quel nombre ?", 2], ["b) Nombre de facteurs du 1er degré après factorisation complète", 3], ["c) Plus grand zéro", 3]], ["2x(x² − 9).", "x² − 9 = (x − 3)(x + 3)."], "a) 2 (2x en évidence) ; b) " + M("2x(x - 3)(x + 3)") + " : 3 facteurs ; c) 3.")],
    trinfact: [() => P("f(x) = 2x² − 2x − 12.", [["a) Discriminant", 100], ["b) Plus grand zéro", 3], ["c) Plus petit zéro", -2]], ["Δ = 4 + 96.", "x = (2 ± 10) ÷ 4."], "a) 100 ; b) 3 ; c) −2 : " + M("f(x) = 2(x - 3)(x + 2)") + ".")],
    f2: [() => P("f(x) = −x² + 4x + 5.", [["a) Abscisse du sommet", 2], ["b) Valeur maximale", 9], ["c) Plus grand zéro", 5]], ["x_S = −4 ÷ (−2).", "f(x) = −(x − 5)(x + 1)."], "a) 2 ; b) " + M("f(2) = 9") + " ; c) 5.")],
    f2formes: [() => P("f(x) = x² − 8x + 12.", [["a) h de la forme canonique", 4], ["b) k de la forme canonique", -4], ["c) Plus petit zéro", 2]], ["(x − 4)² = x² − 8x + 16.", "(x − 4)² = 4 ⇔ x − 4 = ±2."], "a) 4 ; b) " + M("12 - 16 = -4") + " ; c) 2 (et 6).")],
  };

  // « Trouve l'erreur » (24.11, chantier I) : abscisse du sommet sans le signe moins.
  F2[2].push(() => { const a = R.pick([1, 2, -1, -2]), xs = R.pick([-3, -2, 2, 3, 4]), b = -2 * a * xs, c = R.int(-6, 6), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return QN("Pour " + M("f(x) = " + P2([a, b, c])) + ", " + w + " calcule l'abscisse du sommet : « " + M("x_S = \\frac{b}{2a} = \\frac{" + b + "}{" + 2 * a + "} = " + -xs) + " ». Trouve l'erreur, puis donne " + M("x_S") + ".", xs,
      "Erreur : la formule est " + M("x_S = -\\frac{b}{2a}") + ". Ici " + M("x_S = -\\frac{" + b + "}{" + 2 * a + "} = " + xs) + ".",
      { ctx: "erreur", guide: [GS("Formule " + M("x_S = -\\frac{b}{2a}") + " : combien vaut " + M("\\frac{b}{2a}") + " ?", -xs, M(-xs) + "."), GS("Avec le signe moins, " + M("x_S") + " = ?", xs, M(xs) + ".")],
        traps: [TRAP(-xs, "C'est le calcul de " + w + " : il manque le signe moins de la formule.")] }); });
  // ===================== Chantier X (24.11) : f2, lecture sur figure (zéros, sommet, axe de symétrie, forme
  // canonique, coefficient a lus sur la parabole tracée) ; valeurs sur des nœuds du quadrillage.
  const PLf = (fns, pts = [], o = {}) => FIG.plot(fns, pts, Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  const dC = (v) => String(v).replace(".", "{,}");
  const sqE = (s, h, k) => (s === -1 ? "-" : s === 1 ? "" : s + "*") + "(x" + (h < 0 ? "+" + -h : "-" + h) + ")^2" + (k < 0 ? "-" + -k : "+" + k);
  F2[1].push(
    () => { const s = pk([1, -1, 0.5, -0.5]), p = R.int(-5, 3), q = p + R.int(2, 6), vy = -s * (q - p) ** 2 / 4; if (q > 5 || Math.abs(vy) > 6 || !p || !q || p === -q) return null;
      return QSet("La parabole représente une fonction " + M("f") + ". Lis ses zéros sur le graphique.", [p, q], "La parabole coupe l'axe horizontal en " + M("x = " + p) + " et " + M("x = " + q) + " : ce sont les zéros de " + M("f") + ".",
        { ctx: "zeros-lus", fig: PLf([{ f: (x) => s * (x - p) * (x - q) }], [], { yr: [-7, 7] }), guide: [GS("Les zéros sont les abscisses des points où la courbe coupe l'axe HORIZONTAL. Le plus petit ?", p, M(p) + "."), GSet("Les deux zéros ?", [p, q], M(p) + " et " + M(q) + ".")],
          traps: [TSet([-p, -q], "Lis les abscisses avec leur signe : à gauche de l'axe vertical, elles sont négatives."), TSet([s * p * q], "Ça, c'est l'ordonnée à l'origine f(0) (axe vertical). Les zéros se lisent sur l'axe horizontal."), TSet([q], "Il y a deux zéros.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5, 2, -2]), h = nz(-4, 4), k = nz(-5, 5); if (Math.abs(h) === Math.abs(k) || (s > 0 && k > 3) || (s < 0 && k < -3)) return null;
      return QP("La parabole représente une fonction " + M("f") + ". Lis les coordonnées de son sommet. Réponds « x ; y ».", [h, k], "Le sommet est le point " + (s > 0 ? "le plus bas" : "le plus haut") + " de la parabole : " + M("S(" + h + " ; " + k + ")") + ".",
        { ctx: "sommet-lu", fig: PLf([{ f: (x) => s * (x - h) ** 2 + k }]), guide: [GS("Sommet = point " + (s > 0 ? "le plus bas" : "le plus haut") + ". Son abscisse (axe horizontal) ?", h, M(h) + "."), GP("Son ordonnée, puis le sommet « x ; y » ?", [h, k], M("(" + h + " ; " + k + ")") + ".")],
          traps: [TP([k, h], "Abscisse d'abord (axe horizontal), puis ordonnée."), TP([-h, k], "Le sommet est " + (h < 0 ? "à gauche" : "à droite") + " de l'axe vertical : vérifie le signe de l'abscisse."), TP([h, -k], "Le sommet est " + (k < 0 ? "sous" : "au-dessus de") + " l'axe horizontal.")] }); },
  );
  F2[2].push(
    () => { const s = pk([1, -1]), h = nz(-3, 3), k = s > 0 ? R.int(-5, -1) : R.int(1, 5), e = sqE(s, h, k);
      return QX("La parabole a pour expression " + M("f(x) = (x - h)^2 + k") + " ou " + M("f(x) = -(x - h)^2 + k") + ". Lis son sommet et son orientation, puis écris " + M("f(x)") + ".", e, null, "Sommet lu " + M("S(" + h + " ; " + k + ")") + ", parabole tournée vers le " + (s > 0 ? "haut (signe +)" : "bas (signe −)") + " : " + M("f(x) = " + (s < 0 ? "-" : "") + "(" + xm(h) + ")^2" + sg(k)) + ".",
        { ctx: "canonique-lue", fig: PLf([{ f: (x) => s * (x - h) ** 2 + k }]), guide: [GS("Abscisse du sommet ?", h, M(h) + "."), GS("Ordonnée du sommet ?", k, M(k) + "."), GX("Tournée vers le " + (s > 0 ? "haut" : "bas") + " : " + M("f(x)") + " = ?", e, M("f(x) = " + (s < 0 ? "-" : "") + "(" + xm(h) + ")^2" + sg(k)) + ".")],
          traps: [TX(sqE(s, -h, k), "Dans (x − h)², h est l'abscisse du sommet : sommet en " + h + " donne (" + xm(h) + ")²."), TX(sqE(-s, h, k), "La parabole est tournée vers le " + (s > 0 ? "haut : coefficient positif." : "bas : signe − devant la parenthèse.")), TX(sqE(s, h, -k), "k est l'ordonnée du sommet, avec son signe.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5]); let p, q; do { p = R.int(-5, 2); q = p + pk([1, 3, 5]); } while (q > 5); const ax = (p + q) / 2, vy = -s * ((q - p) / 2) ** 2; if (Math.abs(vy) > 6.5) return null;
      return QN("Lis les deux zéros de la parabole, puis donne l'abscisse de son axe de symétrie (nombre décimal).", ax, "Zéros lus : " + M(p) + " et " + M(q) + ". L'axe de symétrie passe au milieu : " + M("x = \\frac{" + p + " + " + (q < 0 ? "(" + q + ")" : q) + "}{2} = " + dC(ax)) + ".",
        { ctx: "axe-sym", fig: PLf([{ f: (x) => s * (x - p) * (x - q) }], [], { yr: [-7, 7] }), guide: [GS("Plus petit zéro ?", p, M(p) + "."), GS("Plus grand zéro ?", q, M(q) + "."), GS("Milieu des deux (moyenne) ?", ax, M(dC(ax)) + ".")],
          traps: [TR(p + q, "Divise la somme des zéros par 2 (milieu)."), TR(vy, "Ça, c'est l'ordonnée du sommet ; l'axe de symétrie est vertical, on donne son abscisse."), TR((q - p) / 2, "Le milieu, c'est la moyenne (somme ÷ 2), pas la demi-différence.")] }); },
  );
  F2[3].push(
    () => { const a = pk([2, -2, 3, -3, 0.5, -0.5]), d = Math.abs(a) === 0.5 ? 2 : Math.abs(a) === 3 ? 1 : pk([1, 2]), h = R.int(-3, 2), k = a > 0 ? R.int(-5, -1) : R.int(1, 5), P = [h + d, k + a * d * d]; if (Math.abs(P[1]) > 6 || P[0] > 5) return null;
      return QN("La parabole a pour sommet " + M("S") + " et passe par le point " + M("P") + " (marqués). Elle a pour expression " + M("f(x) = a(x - h)^2 + k") + ". Lis les coordonnées de " + M("S") + " et " + M("P") + ", puis trouve " + M("a") + (Number.isInteger(a) ? "." : " (fraction ou décimal accepté)."), a,
        "Sommet lu " + M("S(" + h + " ; " + k + ")") + ", point " + M("P(" + P[0] + " ; " + P[1] + ")") + ". " + M(P[1] + " = a(" + P[0] + " - " + par(h) + ")^2 + " + par(k)) + ", soit " + M((P[1] - k) + " = " + d * d + "a") + " et " + M("a = " + fT(a)) + ".",
        { ctx: "a-sommet-point", fig: PLf([{ f: (x) => a * (x - h) ** 2 + k }], [[h, k, "S"], [P[0], P[1], "P"]]), guide: [GS("Écart horizontal entre " + M("S") + " et " + M("P") + " ?", d, M(d) + "."), GS("Écart vertical (de " + M("S") + " à " + M("P") + ", négatif si on descend) ?", a * d * d, M(a * d * d) + "."), GS(M("a") + " = écart vertical ÷ (écart horizontal)² ?", a, M(fT(a)) + ".")],
          traps: d > 1 ? [TR(a * d * d, "Il faut diviser par (écart horizontal)² = " + d * d + "."), TR(a * d, "On divise par le CARRÉ de l'écart horizontal : " + d * d + "."), TR(-a, "La parabole est tournée vers le " + (a > 0 ? "haut : a > 0." : "bas : a < 0."))] : [TR(-a, "La parabole est tournée vers le " + (a > 0 ? "haut : a > 0." : "bas : a < 0.")), TR(P[1], "Ça, c'est l'ordonnée de P ; a se calcule avec l'écart à partir du sommet."), TR(1 / a, "a = écart vertical ÷ (écart horizontal)², pas l'inverse.")] }); },
    () => { const a = pk([2, -2, 0.5, -0.5, 1.5, -1.5]); let p, q; do { p = nz(-4, 3); q = nz(-3, 4); } while (p >= q); const f0 = a * p * q, vy = -a * ((q - p) / 2) ** 2; if (!Number.isInteger(f0) || Math.abs(f0) < 2 || Math.abs(f0) > 6 || Math.abs(vy) > 8) return null;
      return QN("La parabole a pour expression " + M("f(x) = a(x - x_1)(x - x_2)") + ". Lis ses zéros " + M("x_1") + ", " + M("x_2") + " et son ordonnée à l'origine (point marqué), puis trouve " + M("a") + (Number.isInteger(a) ? "." : " (fraction ou décimal accepté)."), a,
        "Zéros lus : " + M(p) + " et " + M(q) + " ; " + M("f(0) = " + f0) + ". Or " + M("f(0) = a \\cdot " + par(-p) + " \\cdot " + par(-q) + " = " + p * q + "a") + ", donc " + M("a = \\frac{" + f0 + "}{" + p * q + "} = " + fT(a)) + ".",
        { ctx: "a-zeros-f0", fig: PLf([{ f: (x) => a * (x - p) * (x - q) }], [[0, f0, ""]], { yr: [-8, 8], squash: 0.8 }), guide: [GSet("Zéros lus ?", [p, q], M(p) + " et " + M(q) + "."), GS("Ordonnée à l'origine " + M("f(0)") + " (point marqué) ?", f0, M(f0) + "."), GS(M("f(0) = a \\cdot (0 - x_1)(0 - x_2) = " + p * q + "a") + ". Donc " + M("a") + " = ?", a, M(fT(a)) + ".")],
          traps: [TR(f0, "f(0) n'est pas a : f(0) = a · x₁ · x₂."), TR(-a, "La parabole est tournée vers le " + (a > 0 ? "haut : a > 0." : "bas : a < 0.")), TR(f0 / (p + q), "f(0) = a · x₁ · x₂ : on divise par le PRODUIT des zéros.")] }); },
  );
  // « Trouve l'erreur » (24.11, chantier I, suite) : le signe moins devant un carré ne change que le premier terme.
  PO[2].push(() => { let a, b; do { a = R.int(2, 7); b = R.int(2, 7); } while (a === b); const w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    const sq = P2([1, -2 * b, b * b]), op = P2([-1, 2 * b, -b * b]), ans = P2([2 * (a + b), a * a - b * b]), faux = P2([2 * (a - b), a * a + b * b]);
    return QX(w + " écrit : « " + M("(x + " + a + ")^2 - (x - " + b + ")^2 = x^2 + " + 2 * a + "x + " + a * a + " - x^2 - " + 2 * b + "x + " + b * b + " = " + faux) + " ». Trouve l'erreur, puis développe et réduis correctement.", ans, "expanded",
      "Erreur : le signe moins s'applique à <b>tout</b> le carré. On développe d'abord " + M("(x - " + b + ")^2 = " + sq) + " entre parenthèses, puis on change tous les signes : " + M("-(" + sq + ") = " + op) + ". Donc " + M("x^2 + " + 2 * a + "x + " + a * a + " - x^2 + " + 2 * b + "x - " + b * b + " = " + ans) + ".",
      { ctx: "erreur", guide: [GX("Développe " + M("(x - " + b + ")^2") + " :", sq, M(sq) + "."), GX("Change tous les signes : " + M("-(x - " + b + ")^2") + " = ?", op, M(op) + "."), GX("Ajoute " + M("(x + " + a + ")^2 = x^2 + " + 2 * a + "x + " + a * a) + " et réduis :", ans, M(ans) + ".")],
        traps: [TX(faux, "C'est le résultat de " + w + " : le moins change le signe des trois termes du carré.")] }); });
  const ALL = { polyop: PO, factor2: FC, trinfact: TF, f2: F2, f2formes: FF };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    polyop: "Chaque terme multiplie chaque terme ; identités (A ± B)² = A² ± 2AB + B², (A + B)(A − B) = A² − B². Un « − » devant une parenthèse change tous les signes.",
    factor2: "Dans l'ordre : mise en évidence, identités (différence de carrés, carré parfait), trinôme (somme-produit), groupements. Recommence tant que c'est possible.",
    trinfact: "Zéros x₁ et x₂ (somme-produit ou discriminant) : ax² + bx + c = a(x − x₁)(x − x₂). Δ < 0 : pas de factorisation.",
    f2: "Zéros : factorise ou discriminant. Sommet : x_S = −b/(2a), y_S = f(x_S). a > 0 : minimum ; a < 0 : maximum.",
    f2formes: "Développée ax² + bx + c ; factorisée a(x − x₁)(x − x₂) ; canonique a(x − h)² + k, sommet (h ; k), h = −b/(2a), k = f(h).",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    polyop: ["Distributivité, identités", "Carrés et produits, degré 3", "Cubes, trois facteurs, x⁴"],
    factor2: ["Mise en évidence, identités", "Trinôme, différence de carrés", "Groupements, coefficients, x⁴"],
    trinfact: ["Somme-produit, zéro double", "Coefficient a, zéros fractionnaires", "Deux fractions, discriminant"],
    f2: ["Zéros, sommet canonique, f(0)", "Sommet par la formule, extremum", "Sommet fractionnaire, paramètre"],
    f2formes: ["Développer, lire h et k", "Factorisée → canonique", "Toutes les conversions"],
  });
})();

// Chantier 1re Collège (bêta-testeurs) · lot 5 du plan pas à pas (19.11) : une seule source pour f2expr, f2trois,
// inter, interpar, ineq2 ; ineqfrac ajouté le 20.11. Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs typiques,
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
      () => { const a = pk([2, -2, 3, -3]), b = nz(-4, 4), c = R.int(-4, 4), cs = [a, b, c], f = quad(cs); // 24.11 : a ≠ ±1 (robot)
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
          { ctx: "x2-droite", fig: FIG.plot([{ f: (x) => x * x }, { f: (x) => (p + q) * x - p * q }], [], { xr: [Math.min(p, -1) - 2, Math.max(q, 1) + 2], yr: [-2, Math.max(p * p, q * q, 1) + 2], grid: false, ticks: false, minH: 170, maxH: 260, label: "parabole et droite" }), guide: [GX("Ramène à « … = 0 »", P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q]) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes en factorisant."), TSet([p * p, q * q], "On demande les abscisses x.")] }); },
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
          { ctx: "compte-entiers", guide: [GSS("Solution ?", [[p, lg, q, lg]], M((lg ? "[" : "]") + p + " \\,;\\, " + q + (lg ? "]" : "[")) + "."), GS("Nombre d'entiers ?", n, M(n) + ".")], traps: [TR(lg ? n - 2 : n + 2, lg ? "≤ : les zéros sont compris." : "< : les zéros sont exclus."), TR(q - p, "Compte les entiers un par un.")] }); },
      () => { const r1 = R.int(2, 5), r2 = r1 + R.int(2, 6), s = r1 + r2, A = r1 * r2;
        return QS("Un rectangle a un périmètre de " + M(2 * s) + " cm. On note " + M("x") + " sa longueur (en cm). Pour quelles valeurs de " + M("x") + " son aire est-elle d'au moins " + M(A) + " cm² ?", [[r1, true, r2, true]], "Largeur " + M(s + " - x") + " ; aire " + M("x(" + s + " - x) \\ge " + A + " \\iff x^2 - " + s + "x + " + A + " \\le 0 \\iff (x - " + r1 + ")(x - " + r2 + ") \\le 0") + " : " + M("[" + r1 + " \\,;\\, " + r2 + "]") + ".",
          { ctx: "rectangle", guide: [GX("Aire en fonction de " + M("x"), "x*(" + s + "-x)", M("x(" + s + " - x)") + "."), GSet("Zéros de " + M("x^2 - " + s + "x + " + A) + " ?", [r1, r2], M(r1) + " et " + M(r2) + "."), GSS("Solution ?", [[r1, true, r2, true]], M("[" + r1 + " \\,;\\, " + r2 + "]") + ".")], traps: [TS([[-Infinity, false, r1, true], [r2, true, Infinity, false]], "L'aire est maximale au milieu : elle dépasse " + A + " ENTRE les zéros."), TS([[r1, false, r2, false]], "« Au moins » : ≥, les bornes sont comprises.")] }); },
    ],
  };

  // ===================== ineqfrac : inéquations fractionnaires (20.11, fin de la 1re Collège) =====================
  const ANF = " Donne l'ensemble des solutions (intervalles).";
  const linE = (a, b) => (a === 0 ? fT(b) : co(a) + "x" + (b ? sg(b) : ""));
  // pièges communs : valeur interdite comprise (on a traité le quotient comme un produit) ; signe contraire
  const fracTraps = (f, zeros, poles, op) => [TS(signSet(f, zeros.concat(poles), [], op), "La valeur interdite (dénominateur nul) est toujours exclue : crochet ouvert."), TS(signSet(f, zeros, poles, opp[op]), "Relis le tableau des signes : tu as pris le signe contraire.")];
  const fracGuide = (zeros, poles, ivs, extra) => (extra || []).concat([GSet("Zéro(s) du numérateur ?", zeros, zeros.map(fT).join(" et ") + "."), GSet("Valeur(s) interdite(s) (dénominateur nul) ?", poles, poles.map(fT).join(" et ") + " : exclue(s) de toute façon."), GSS("Tableau des signes. Ensemble des solutions ?", ivs, M("S = " + IT(ivs)) + ".")]);
  const IFQ = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5), op = pk(["<", "<=", ">", ">="]); if (a === b) return null; const f = (x) => (x - a) / (x - b), ivs = signSet(f, [a], [b], op);
        return QS("Résous " + M("\\frac{" + xm(a) + "}{" + xm(b) + "} " + OPT[op] + " 0") + "." + ANF, ivs, "Numérateur nul en " + M(a) + ", dénominateur nul en " + M(b) + " (valeur interdite, exclue). Tableau des signes : " + M("S = " + IT(ivs)) + ".",
          { ctx: "simple", guide: fracGuide([a], [b], ivs), traps: fracTraps(f, [a], [b], op) }); },
      () => { const k = nz(-6, 6), b = nz(-5, 5), op = pk(["<", "<=", ">", ">="]), f = (x) => k / (x - b), ivs = signSet(f, [], [b], op);
        return QS("Résous " + M("\\frac{" + k + "}{" + xm(b) + "} " + OPT[op] + " 0") + "." + ANF, ivs, "Le numérateur " + M(k) + " est " + (k > 0 ? "positif" : "négatif") + " et jamais nul : le quotient a le signe " + (k > 0 ? "du" : "contraire du") + " dénominateur, qui change en " + M(b) + " (exclu). " + M("S = " + IT(ivs)) + ".",
          { ctx: "numerateur-constant", guide: [GS("Valeur interdite ?", b, M(b) + "."), GSS("Le numérateur " + M(k) + " ne change jamais de signe. Ensemble des solutions ?", ivs, M("S = " + IT(ivs)) + ".")],
            traps: [TS(signSet(f, [b], [], op.length === 2 ? op : op + "="), "La valeur interdite " + b + " est exclue."), TS(signSet(f, [], [b], opp[op]), k < 0 ? "Le numérateur est négatif : le quotient a le signe contraire du dénominateur." : "Relis le signe du dénominateur de part et d'autre de " + b + ".")] }); },
      () => { const z = nz(-4, 4), p = nz(-4, 4), k1 = pk([-1, 1]) * R.int(1, 3), k2 = pk([-1, 1]) * R.int(1, 3), op = pk(["<", "<=", ">", ">="]); if (z === p || (k1 > 0 && k2 > 0)) return null;
        const f = (x) => (k1 * (x - z)) / (k2 * (x - p)), ivs = signSet(f, [z], [p], op);
        return QS("Résous " + M("\\frac{" + linE(k1, -k1 * z) + "}{" + linE(k2, -k2 * p) + "} " + OPT[op] + " 0") + "." + ANF, ivs, "Numérateur nul en " + M(z) + ", dénominateur nul en " + M(p) + " (exclu). Attention : un coefficient de " + M("x") + " est négatif, ce qui inverse le signe de ce facteur. " + M("S = " + IT(ivs)) + ".",
          { ctx: "coef-negatif", guide: fracGuide([z], [p], ivs), traps: [TS(signSet((x) => (x - z) / (x - p), [z], [p], op), "Un coefficient de x négatif inverse le signe de sa ligne dans le tableau."), ...fracTraps(f, [z], [p], op)] }); },
    ],
    2: [
      () => { const b = nz(-4, 4), pp = pk([2, 3, -1]), k = pk([1, 2, -1].filter((v) => v !== pp)), z = nz(-5, 5); if (z === b) return null;
        // (pp·x + q)/(x − b) op k  ⇔  ((pp − k)x + q + k·b)/(x − b) op 0, numérateur (pp − k)(x − z)
        const A = pp - k, q = -A * z - k * b, op = pk(["<", "<=", ">", ">="]), f = (x) => (A * (x - z)) / (x - b), ivs = signSet(f, [z], [b], op);
        const wrongLin = signSet((x) => A * (x - z), [z], [], op);
        return QS("Résous " + M("\\frac{" + linE(pp, q) + "}{" + xm(b) + "} " + OPT[op] + " " + k) + "." + ANF, ivs, "On ne multiplie pas par " + M(xm(b)) + " (signe inconnu) : on soustrait " + M(k) + " et on met au même dénominateur, " + M("\\frac{" + linE(A, -A * z) + "}{" + xm(b) + "} " + OPT[op] + " 0") + ". Tableau des signes : " + M("S = " + IT(ivs)) + ".",
          { ctx: "comparer-k", guide: [GX("On soustrait " + M(k) + " : " + M("\\frac{" + linE(pp, q) + "}{" + xm(b) + "} - " + par(k) + " = \\frac{?}{" + xm(b) + "}") + ". Numérateur ?", linE(A, -A * z).replace(/\s/g, ""), M(linE(pp, q) + " - " + par(k) + "(" + xm(b) + ") = " + linE(A, -A * z)) + "."), ...fracGuide([z], [b], ivs)],
            traps: [TS(wrongLin, "On ne peut pas multiplier par x − " + b + " sans connaître son signe : la valeur interdite disparaîtrait."), ...fracTraps(f, [z], [b], op)] }); },
      () => { const a = nz(-5, 4), c = a + R.int(1, 5), b = nz(-5, 5), op = pk(["<", "<=", ">", ">="]); if (b === a || b === c) return null; const f = (x) => ((x - a) * (x - c)) / (x - b), ivs = signSet(f, [a, c], [b], op);
        return QS("Résous " + M("\\frac{(" + xm(a) + ")(" + xm(c) + ")}{" + xm(b) + "} " + OPT[op] + " 0") + "." + ANF, ivs, "Zéros du numérateur : " + M(a) + " et " + M(c) + " ; valeur interdite : " + M(b) + ". Tableau des signes à trois lignes : " + M("S = " + IT(ivs)) + ".",
          { ctx: "trois-facteurs", guide: fracGuide([a, c], [b], ivs), traps: fracTraps(f, [a, c], [b], op) }); },
      () => { const m = R.int(1, 5), b = nz(-6, 6), op = pk(["<", "<=", ">", ">="]); if (Math.abs(b) === m) return null; const f = (x) => (x * x - m * m) / (x - b), ivs = signSet(f, [-m, m], [b], op);
        return QS("Résous " + M("\\frac{x^2 - " + m * m + "}{" + xm(b) + "} " + OPT[op] + " 0") + "." + ANF, ivs, M("x^2 - " + m * m + " = (x - " + m + ")(x + " + m + ")") + " : zéros " + M(-m) + " et " + M(m) + ", valeur interdite " + M(b) + ". " + M("S = " + IT(ivs)) + ".",
          { ctx: "diff-carres", guide: fracGuide([-m, m], [b], ivs, [GSet("On factorise " + M("x^2 - " + m * m) + ". Ses zéros ?", [-m, m], M("\\pm " + m) + ".")]).filter((g, i) => i !== 1), traps: [TS(signSet(f, [m], [b], op), "x² − " + m * m + " s'annule aussi en −" + m + "."), ...fracTraps(f, [-m, m], [b], op)] }); },
    ],
    3: [
      () => { const b = nz(-4, 4), c = nz(-4, 4), op = pk(["<", "<=", ">", ">="]); if (b === c) return null; const f = (x) => (b - c) / ((x - b) * (x - c)), ivs = signSet(f, [], [b, c], op);
        return QS("Résous " + M("\\frac{1}{" + xm(b) + "} " + OPT[op] + " \\frac{1}{" + xm(c) + "}") + "." + ANF, ivs, "On ramène à 0 : " + M("\\frac{1}{" + xm(b) + "} - \\frac{1}{" + xm(c) + "} = \\frac{" + (b - c) + "}{(" + xm(b) + ")(" + xm(c) + ")}") + ". Le numérateur " + M(b - c) + " ne change pas de signe : tout dépend du dénominateur. " + M("S = " + IT(ivs)) + ".",
          { ctx: "deux-fractions", guide: [GS("On soustrait et on met au même dénominateur " + M("(" + xm(b) + ")(" + xm(c) + ")") + ". Numérateur (un nombre) ?", b - c, M("(" + xm(c) + ") - (" + xm(b) + ") = " + (b - c)) + "."), GSet("Valeurs interdites ?", [b, c], M(b) + " et " + M(c) + "."), GSS("Ensemble des solutions ?", ivs, M("S = " + IT(ivs)) + ".")],
            traps: [TS(signSet((x) => (x - c) - (x - b) > 0 ? 1 : -1, [], [], op), "On ne « croise » pas les dénominateurs sans connaître leur signe."), TS(signSet(f, [], [b, c], opp[op]), "Relis le signe : numérateur " + (b - c) + ".")] }); },
      () => { const m = R.int(1, 4), op = pk(["<", "<=", ">", ">="]), f = (x) => (x * x - m * m) / x, ivs = signSet(f, [-m, m], [0], op);
        return QS("Résous " + M("x " + OPT[op] + " \\frac{" + m * m + "}{x}") + "." + ANF, ivs, "On ne multiplie pas par " + M("x") + " (signe inconnu) : " + M("x - \\frac{" + m * m + "}{x} = \\frac{x^2 - " + m * m + "}{x}") + ", zéros " + M("\\pm " + m) + ", valeur interdite " + M(0) + ". " + M("S = " + IT(ivs)) + ".",
          { ctx: "x-et-1sur-x", guide: [GX("On ramène à 0 : " + M("x - \\frac{" + m * m + "}{x} = \\frac{?}{x}") + ". Numérateur ?", "x^2-" + m * m, M("x^2 - " + m * m) + "."), ...fracGuide([-m, m], [0], ivs)],
            traps: [TS(signSet((x) => x * x - m * m, [-m, m], [], op), "Multiplier par x change le sens quand x < 0 : on perd des solutions (ou on en ajoute)."), ...fracTraps(f, [-m, m], [0], op)] }); },
      () => { const F = pk([120, 150, 200, 240, 300]), v = pk([2, 3, 4, 5]), s = v + pk([1, 2, 3]), t = F / (s - v), n = Number.isInteger(t) ? t : Math.ceil(t), c = pk([["t-shirts imprimés", "la machine d'impression", "par t-shirt"], ["gâteaux", "le four", "par gâteau"], ["badges", "la presse", "par badge"]]);
        return QN("Pour fabriquer des " + c[0] + ", une association loue " + c[1] + " " + M(F) + " CHF, puis chaque pièce coûte " + M(v) + " CHF de matériel. Le coût moyen par pièce est " + M("\\frac{" + F + " + " + v + "n}{n}") + ". À partir de combien de pièces ce coût moyen est-il d'au plus " + M(s) + " CHF ?", n,
          M("\\frac{" + F + " + " + v + "n}{n} \\le " + s) + " ; comme " + M("n > 0") + ", on peut multiplier par " + M("n") + " sans changer le sens : " + M(F + " + " + v + "n \\le " + s + "n") + ", " + M((s - v) + "n \\ge " + F) + ", " + M("n \\ge " + (Number.isInteger(t) ? t : String(+t.toFixed(2)).replace(".", "{,}"))) + " : à partir de " + M(n) + " pièces.",
          { ctx: "cout-moyen", guide: [GS("Ici " + M("n > 0") + " : on multiplie par " + M("n") + ", on regroupe. " + M((s - v) + "n \\ge") + " ?", F, M(F) + "."), GS("Plus petit nombre entier " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(Math.floor(t) === t ? t - 1 : Math.floor(t), "Avec moins de pièces, les frais fixes pèsent trop : arrondis vers le haut."), TR(F / s, "Il faut retirer le coût du matériel : " + (s - v) + "n ≥ " + F + ".")] }); },
    ],
  };

  const PROBS = {
    ineqfrac: [() => P("On étudie le quotient q(x) = (x − 2)/(x + 3).", [["a) Valeur interdite", -3], ["b) Zéro de q", 2], ["c) Nombre d'entiers x de −10 à 10 tels que q(x) < 0", 4]], ["Le dénominateur s'annule en −3.", "q(x) < 0 entre −3 et 2 (exclus)."], "a) −3 ; b) 2 ; c) " + M("S = \\,]-3 \\,;\\, 2[") + " : les entiers −2, −1, 0, 1, soit 4.")],
    f2expr: [() => P("Une parabole a pour sommet S(1 ; −4) et passe par (3 ; 0).", [["a) Coefficient a", 1], ["b) f(0)", -3], ["c) L'autre zéro", -1]], ["f(x) = a(x − 1)² − 4.", "Les zéros sont symétriques par rapport à x = 1."], "a) " + M("0 = 4a - 4") + ", a = 1 ; b) " + M("f(0) = 1 - 4 = -3") + " ; c) −1.")],
    f2trois: [() => P("Une parabole passe par (0 ; 3), (1 ; 0) et (−1 ; 8).", [["a) c", 3], ["b) a", 1], ["c) b", -4]], ["c = f(0).", "a + b = −3 et a − b = 5."], "a) 3 ; b) " + M("2a = 2") + " ; c) " + M("b = -4") + " : " + M("f(x) = x^2 - 4x + 3") + ".")],
    inter: [() => P("f(x) = x² − 2x − 1 et g(x) = x + 3.", [["a) Plus petite abscisse d'intersection", -1], ["b) Plus grande abscisse d'intersection", 4], ["c) Ordonnée du point le plus à droite", 7]], ["x² − 3x − 4 = 0.", "(x − 4)(x + 1) = 0."], "a) −1 ; b) 4 ; c) " + M("g(4) = 7") + ".")],
    interpar: [() => P("f(x) = x² − 4 et g(x) = −x² + 2x.", [["a) Plus petite abscisse d'intersection", -1], ["b) Plus grande abscisse d'intersection", 2], ["c) Ordonnée du point d'abscisse 2", 0]], ["2x² − 2x − 4 = 0.", "x² − x − 2 = (x − 2)(x + 1)."], "a) −1 ; b) 2 ; c) " + M("f(2) = 0") + ".")],
    ineq2: [() => P("On résout x² − 2x − 8 ≤ 0.", [["a) Plus petit zéro", -2], ["b) Plus grand zéro", 4], ["c) Nombre d'entiers solutions", 7]], ["(x − 4)(x + 2).", "Solution [−2 ; 4]."], "a) −2 ; b) 4 ; c) de −2 à 4 : 7 entiers.")],
  };

  // « Trouve l'erreur » (24.11, chantier I, suite) : x^2 > k^2 « donc x > k » (solutions négatives oubliées).
  IQ[2].push(() => { const op = pk(["<", "<=", ">", ">="]), k = R.int(2, 9), f = (x) => x * x - k * k, ivs = signSet(f, [-k, k], [], op), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]),
      faux = op[0] === "<" ? [[-Infinity, false, k, op === "<="]] : [[k, op === ">=", Infinity, false]];
    return QS(w + " résout " + M("x^2 " + opLabel(op) + " " + k * k) + " : « je prends la racine : " + M("x " + opLabel(op) + " " + k) + " ». Trouve l'erreur, puis donne l'ensemble des solutions.", ivs,
      "Erreur : " + w + " oublie les nombres négatifs ; par exemple " + M("(-" + (k + 1) + ")^2 = " + (k + 1) * (k + 1)) + (op[0] === "<" ? " ne vérifie pas l'inéquation, alors que " + M("-" + (k + 1) + " " + opLabel(op) + " " + k) + "." : " vérifie l'inéquation.") + " " + M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + ", zéros " + M(-k) + " et " + M(k) + " : " + M("S = " + IT(ivs)) + ".",
      { ctx: "erreur", guide: [GSet("Zéros de " + M("x^2 - " + k * k) + " ?", [-k, k], M(-k) + " et " + M(k) + "."), GSS("Solution ? (parabole tournée vers le haut)", ivs, M(IT(ivs)) + ".")],
        traps: [TS(faux, "C'est la réponse de " + w + " : " + M("\\sqrt{x^2} = |x|") + ", il y a aussi des solutions négatives" + (op[0] === "<" ? " et une borne à gauche." : "."))] }); });
  const ALL = { f2expr: FE, f2trois: T3, inter: IN, interpar: IP, ineq2: IQ, ineqfrac: IFQ };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
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
    ineqfrac: "Ramène tout à « … ≷ 0 » sans multiplier par le dénominateur. Zéros du numérateur, valeurs interdites (toujours exclues), puis tableau des signes.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    f2expr: ["Zéros et ordonnée, sommet et a", "Sommet et point, zéros et point, lecture", "Trois points, extremum, axe de symétrie"],
    f2trois: ["Points d'abscisses 0, 1, −1", "Points 0, 1, 2 ; balle", "Sans abscisse 0, différences, sommet"],
    inter: ["x² et une droite, horizontale, point", "Cas général, Δ, coordonnées", "Tangente, coefficient a, distance"],
    interpar: ["Deux paraboles", "Hyperbole, même a", "Point, Δ, symétrie"],
    ineq2: ["Produit, différence de carrés, x² ≤ k", "Coefficient a, Δ < 0, carré parfait", "f(x) ≤ g(x), entiers, rectangle"],
    ineqfrac: ["Quotient simple, numérateur constant, coefficients négatifs", "Comparer à un nombre, trois facteurs, différence de carrés", "Deux fractions, x et 1/x, coût moyen"],
  });
})();

// Chantier 1re Collège (bêta-testeurs) · lot géométrie (19.11) : une seule source pour euclide, geocomb, droitesrem,
// exactes, angtri. Même standard : au moins 3 formes par niveau, pas à pas, erreurs typiques, ctx, figures ; défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const N = (v) => String(r6(v)).replace(".", "{,}");
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.radical ? { radical: true } : {}, o.pi ? { pi: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const RS = (k, m) => M((k === 1 ? "" : k) + "\\sqrt{" + m + "}");
  const RC = (k, m) => (k === 1 ? "" : k) + "√" + m;
  const EXA = " (valeur exacte, touche √)";

  // ===================== euclide =====================
  const EU = {
    1: [
      () => { const [p, q] = pk([[1, 4], [2, 8], [4, 9], [3, 12], [1, 9], [4, 16], [9, 16]]), h = Math.sqrt(p * q);
        return Qv("Dans un triangle rectangle, la hauteur issue de l'angle droit découpe l'hypoténuse en segments de " + M(p) + " cm et " + M(q) + " cm. Calcule la hauteur (en cm).", h, "Théorème de la hauteur : " + M("h^2 = p \\cdot q = " + p * q) + ", donc " + M("h = " + h) + " cm.",
          { ctx: "hauteur", fig: GF.altitude(p, q, { lp: p + " cm", lq: q + " cm", lh: "h = ?" }), guide: [GS(M("h^2 = p \\cdot q") + " = ?", p * q, M(p * q) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")], traps: [TR((p + q) / 2, "C'est h² = p · q (produit), pas la moyenne."), TR(p * q, "N'oublie pas la racine.")] }); },
      () => { const [p, c] = pk([[4, 9], [2, 8], [1, 9], [9, 16], [4, 25], [3, 12]]), a = Math.sqrt(p * c);
        return Qv("Un triangle est rectangle en " + M("C") + ", d'hypoténuse " + M("c = " + c) + " cm. La projection de la cathète " + M("a") + " sur l'hypoténuse mesure " + M(p) + " cm. Calcule " + M("a") + " (en cm).", a, "Théorème d'Euclide : " + M("a^2 = p \\cdot c = " + p * c) + ", " + M("a = " + a) + " cm.",
          { ctx: "cathete", fig: GF.altitude(p, c - p, { lp: p + " cm", lq: "", lh: "", lc: "c = " + c + " cm", la: "a = ?" }), guide: [GS(M("a^2 = p \\cdot c") + " = ?", p * c, M(p * c) + "."), GS(M("a") + " = ?", a, M(a) + " cm.")], traps: [TR(Math.sqrt(p * (c - p)), "Euclide : a² = p · c (hypoténuse entière), pas p · q."), TR(p * c, "N'oublie pas la racine.")] }); },
      () => { const [a, c] = pk([[6, 9], [6, 12], [10, 20], [12, 16], [15, 25], [8, 16]]), p = (a * a) / c;
        return Qv("Un triangle rectangle a une hypoténuse de " + M(c) + " cm et une cathète " + M("a = " + a) + " cm. Calcule la projection " + M("p") + " de " + M("a") + " sur l'hypoténuse (en cm).", p, M("a^2 = p \\cdot c") + " : " + M("p = \\frac{" + a * a + "}{" + c + "} = " + N(p)) + " cm.",
          { ctx: "projection", guide: [GS(M("a^2") + " = ?", a * a, M(a * a) + "."), GS(M("p = a^2 : c") + " = ?", p, M(N(p)) + " cm.")], traps: [TR(a * a * c, "On divise a² par c."), TR(c - a, "La projection n'est pas une différence de longueurs.")] }); },
    ],
    2: [
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), h = (a * b) / c;
        return Qv("Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Calcule la hauteur relative à l'hypoténuse (en cm, valeur exacte).", h, M("c = " + c) + " ; aire " + M("\\frac{a \\cdot b}{2} = \\frac{c \\cdot h}{2}") + ", donc " + M("h = \\frac{" + a * b + "}{" + c + "} = " + N(h)) + " cm.",
          { ctx: "h-aire", fig: GF.altitude((a * a) / c, (b * b) / c, { lp: "", lq: "", lh: "h = ?", la: a + " cm", lb: b + " cm" }), guide: [GS("Hypoténuse " + M("c") + " ?", c, M(c) + " cm."), GS(M("h = \\frac{a \\cdot b}{c}") + " ?", h, M(N(h)) + " cm.")], traps: [TR((a + b) / 2, "Utilise l'aire : a · b = c · h."), TR(a * b, "Divise par l'hypoténuse.")] }); },
      () => { const [h, p] = pk([[6, 4], [6, 3], [12, 9], [8, 4], [10, 5], [12, 8]]), q = (h * h) / p;
        return Qv("Dans un triangle rectangle, la hauteur relative à l'hypoténuse mesure " + M(h) + " cm et l'un des segments de l'hypoténuse " + M(p) + " cm. Calcule l'autre segment (en cm).", q, M("h^2 = p \\cdot q") + " : " + M("q = \\frac{" + h * h + "}{" + p + "} = " + N(q)) + " cm.",
          { ctx: "segment", fig: GF.altitude(p, q, { lp: p + " cm", lq: "?", lh: "h = " + h + " cm" }), guide: [GS(M("h^2") + " ?", h * h, M(h * h) + "."), GS(M("q = h^2 : p") + " ?", q, M(N(q)) + " cm.")], traps: [TR(h - p, "Ce n'est pas une différence : h² = p · q."), TR(h * h * p, "On divise h² par p.")] }); },
      () => { const [a, p] = pk([[6, 4], [10, 5], [12, 8], [15, 9], [20, 16]]), c = (a * a) / p;
        return Qv("Dans un triangle rectangle, une cathète mesure " + M(a) + " cm et sa projection sur l'hypoténuse " + M(p) + " cm. Calcule l'hypoténuse (en cm).", c, M("a^2 = p \\cdot c") + " : " + M("c = \\frac{" + a * a + "}{" + p + "} = " + N(c)) + " cm.",
          { ctx: "hypotenuse", guide: [GS(M("a^2") + " ?", a * a, M(a * a) + "."), GS(M("c") + " ?", c, M(N(c)) + " cm.")], traps: [TR(Math.sqrt(a * a - p * p), "Ça, c'est la hauteur (Pythagore dans le petit triangle) ; on demande c."), TR(a + p, "Utilise a² = p · c.")] }); },
    ],
    3: [
      () => { const [p, q] = pk([[9, 16], [4, 9], [1, 4], [4, 16], [2, 8]]), h = Math.sqrt(p * q), A = ((p + q) * h) / 2;
        return Qv("La hauteur issue de l'angle droit d'un triangle rectangle découpe l'hypoténuse en " + M(p) + " cm et " + M(q) + " cm. Calcule l'aire du triangle (en cm²).", A, M("h = \\sqrt{" + p * q + "} = " + h) + " ; " + M("A = \\frac{" + (p + q) + " \\cdot " + h + "}{2} = " + N(A)) + " cm².",
          { ctx: "aire", guide: [GS(M("h") + " ?", h, M(h) + " cm."), GS("Hypoténuse " + M("p + q") + " ?", p + q, M(p + q) + " cm."), GS("Aire ?", A, M(N(A)) + " cm².")], traps: [TR((p + q) * h, "Aire d'un triangle : base · hauteur ÷ 2."), TR((p * q) / 2, "Calcule d'abord h.")] }); },
      () => { const [p, q, a, b] = pk([[9, 16, 15, 20], [3.6, 6.4, 6, 8], [1.8, 3.2, 3, 4], [25, 144, 65, 156]]), c = p + q, per = a + b + c;
        return Qv("Dans un triangle rectangle, la hauteur relative à l'hypoténuse découpe celle-ci en " + M(N(p)) + " cm et " + M(N(q)) + " cm. Calcule le périmètre du triangle (en cm).", per, M("c = " + N(c)) + " ; " + M("a = \\sqrt{" + N(p) + " \\cdot " + N(c) + "} = " + a) + " ; " + M("b = \\sqrt{" + N(q) + " \\cdot " + N(c) + "} = " + b) + " ; périmètre " + M(N(per)) + " cm.",
          { ctx: "perimetre", guide: [GS(M("c") + " ?", c, M(N(c)) + "."), GS(M("a = \\sqrt{p \\cdot c}") + " ?", a, M(a) + "."), GS(M("b") + " ?", b, M(b) + "."), GS("Périmètre ?", per, M(N(per)) + " cm.")], traps: [TR(a + b, "N'oublie pas l'hypoténuse."), TR(2 * c, "Calcule les deux cathètes avec Euclide.")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [15, 20, 25]]), p = (a * a) / c, q = (b * b) / c, d = r6(q - p);
        return Qv("Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. La hauteur issue de l'angle droit coupe l'hypoténuse en deux segments. De combien le plus long dépasse-t-il le plus court (en cm) ?", d, M("c = " + c) + " ; " + M("p = \\frac{" + a * a + "}{" + c + "} = " + N(p)) + ", " + M("q = \\frac{" + b * b + "}{" + c + "} = " + N(q)) + " ; écart " + M(N(d)) + " cm.",
          { ctx: "ecart", guide: [GS(M("p") + " ?", p, M(N(p)) + "."), GS(M("q") + " ?", q, M(N(q)) + "."), GS("Écart ?", d, M(N(d)) + " cm.")], traps: [TR(b - a, "Ce sont les projections qu'on compare, pas les cathètes.")] }); },
    ],
  };

  // ===================== geocomb =====================
  const GC = {
    1: [
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), x = pk([["un écran rectangulaire de " + a + " × " + b + " pouces : quelle est sa diagonale (en pouces) ?", "ecran"], ["un portail rectangulaire de " + a + " dm sur " + b + " dm : quelle est la longueur de la barre posée en diagonale (en dm) ?", "portail"]]);
        return Qv("On considère " + x[0], c, M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + ".", { ctx: x[1], guide: [GS(M(a + "^2 + " + b + "^2") + " ?", c * c, M(c * c) + "."), GS("Diagonale ?", c, M(c) + ".")], traps: [TR(a + b, "Pythagore : on additionne les CARRÉS."), TR(c * c, "N'oublie pas la racine.")] }); },
      () => { const [s, bb, h] = pk([[5, 6, 4], [10, 12, 8], [13, 10, 12], [17, 16, 15], [5, 8, 3]]);
        return Qv("Un triangle isocèle a deux côtés de " + M(s) + " cm et une base de " + M(bb) + " cm. Calcule sa hauteur relative à la base (en cm).", h, "La hauteur coupe la base en son milieu : " + M("h = \\sqrt{" + s + "^2 - " + bb / 2 + "^2} = " + h) + " cm.",
          { ctx: "isocele", guide: [GS("Demi-base ?", bb / 2, M(bb / 2) + " cm."), GS(M("h") + " ?", h, M(h) + " cm.")], traps: [TR(Math.sqrt(s * s - bb * bb), "La hauteur coupe la base en deux : utilise la demi-base."), TR(s - bb / 2, "Pythagore, pas une soustraction de longueurs.")] }); },
      () => { const k = pk([2, 3, 4, 5]);
        return Qv("Un triangle équilatéral a des côtés de " + M(2 * k) + " cm. Calcule sa hauteur" + EXA + ".", k * Math.sqrt(3), M("h = \\sqrt{" + 2 * k + "^2 - " + k + "^2} = \\sqrt{" + 3 * k * k + "} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "equilateral", radical: true, canon: RC(k, 3), guide: [GS(M("h^2") + " ?", 3 * k * k, M(3 * k * k) + "."), GSR("Valeur exacte ?", k * Math.sqrt(3), RS(k, 3) + " cm.")], traps: [TR(2 * k, "La hauteur est plus courte que le côté."), TR(k * Math.sqrt(2), "C'est √(4k² − k²) = k√3.")] }); },
    ],
    2: [
      () => { const [s, bb, h] = pk([[5, 6, 4], [10, 12, 8], [13, 10, 12], [17, 16, 15]]), A = (bb * h) / 2;
        return Qv("Un toit a la forme d'un triangle isocèle : côtés " + M(s) + " m, base " + M(bb) + " m. Calcule son aire (en m²).", A, "Hauteur " + M("\\sqrt{" + s * s + " - " + (bb / 2) ** 2 + "} = " + h) + " ; aire " + M("\\frac{" + bb + " \\cdot " + h + "}{2} = " + A) + " m².",
          { ctx: "toit", guide: [GS("Hauteur ?", h, M(h) + " m."), GS("Aire ?", A, M(A) + " m².")], traps: [TR(bb * h, "Aire d'un triangle : ÷ 2."), TR((bb * s) / 2, "Il faut la hauteur, pas le côté oblique.")] }); },
      () => { const [a, b, c, d] = pk([[2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13]]);
        return Qv("Un carton a pour dimensions " + M(a) + " dm, " + M(b) + " dm et " + M(c) + " dm. Quelle est la longueur de la plus longue baguette qu'on peut y glisser (diagonale de l'espace, en dm) ?", d, M("\\sqrt{" + a + "^2 + " + b + "^2 + " + c + "^2} = \\sqrt{" + d * d + "} = " + d) + " dm.",
          { ctx: "carton", guide: [GS("Diagonale du fond au carré (" + M(a + "^2 + " + b + "^2") + ") ?", a * a + b * b, M(a * a + b * b) + "."), GS("Diagonale de l'espace ?", d, M(d) + " dm.")], traps: [TR(Math.sqrt(a * a + b * b), "Ça, c'est la diagonale du fond ; il faut aussi la hauteur."), TR(a + b + c, "Pythagore deux fois, pas une somme.")] }); },
      () => { const [d1, d2, s] = pk([[6, 8, 5], [10, 24, 13], [12, 16, 10], [16, 30, 17]]);
        return Qv("Un losange a des diagonales de " + M(d1) + " cm et " + M(d2) + " cm. Calcule la longueur de son côté (en cm).", s, "Les diagonales se coupent en leur milieu à angle droit : " + M("\\sqrt{" + d1 / 2 + "^2 + " + d2 / 2 + "^2} = " + s) + " cm.",
          { ctx: "losange", guide: [GS("Demi-diagonales : " + M(d1 / 2) + " et ?", d2 / 2, M(d2 / 2) + "."), GS("Côté ?", s, M(s) + " cm.")], traps: [TR(Math.sqrt(d1 * d1 + d2 * d2), "On utilise les DEMI-diagonales."), TR((d1 + d2) / 2, "Pythagore dans un des quatre triangles rectangles.")] }); },
    ],
    3: [
      () => { const [B, b, l, h] = pk([[14, 8, 5, 4], [20, 10, 13, 12], [16, 4, 10, 8], [22, 10, 10, 8]]), A = ((B + b) * h) / 2;
        return Qv("Un trapèze isocèle a des bases de " + M(B) + " cm et " + M(b) + " cm, et des côtés obliques de " + M(l) + " cm. Calcule son aire (en cm²).", A, "Débord de chaque côté " + M("\\frac{" + B + " - " + b + "}{2} = " + (B - b) / 2) + " ; hauteur " + M("\\sqrt{" + l + "^2 - " + (B - b) / 2 + "^2} = " + h) + " ; aire " + M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + A) + " cm².",
          { ctx: "trapeze", guide: [GS("Débord de chaque côté ?", (B - b) / 2, M((B - b) / 2) + " cm."), GS("Hauteur ?", h, M(h) + " cm."), GS("Aire ?", A, M(A) + " cm².")], traps: [TR((B + b) * h, "Aire d'un trapèze : (B + b) · h ÷ 2."), TR(((B + b) * l) / 2, "Il faut la hauteur, pas le côté oblique.")] }); },
      () => { const [r, h, g] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]);
        return Qv("Un cornet de glace (cône) a un rayon de " + M(r) + " cm et une hauteur de " + M(h) + " cm. Calcule son aire latérale " + M("\\pi r g") + " (valeur exacte avec π, en cm²).", Math.PI * r * g, "Génératrice " + M("g = \\sqrt{" + r + "^2 + " + h + "^2} = " + g) + " ; aire " + M("\\pi \\cdot " + r + " \\cdot " + g + " = " + r * g + "\\pi") + " cm².",
          { ctx: "cone", guide: [GS("Génératrice " + M("g") + " ?", g, M(g) + " cm."), GS("Aire latérale (touche π) ?", Math.PI * r * g, M(r * g + "\\pi") + " cm².")], traps: [TR(Math.PI * r * h, "On utilise la génératrice g, pas la hauteur."), TR(Math.PI * r * r, "Ça, c'est l'aire de la base.")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), h = (a * b) / c, A = (a * b) / 2;
        return Qv("Un terrain triangulaire est rectangle, de côtés " + M(a) + " m, " + M(b) + " m et " + M(c) + " m. On veut tirer un tuyau depuis le coin de l'angle droit jusqu'au côté le plus long, par le plus court chemin. Quelle est sa longueur (en m) ?", h, "Le plus court chemin est la hauteur : aire " + M(A) + " m², " + M("h = \\frac{2 \\cdot " + A + "}{" + c + "} = " + N(h)) + " m.",
          { ctx: "tuyau", guide: [GS("Aire du terrain ?", A, M(A) + " m²."), GS("Hauteur relative à l'hypoténuse ?", h, M(N(h)) + " m.")], traps: [TR(c / 2, "La médiane n'est pas le plus court chemin : il faut la perpendiculaire."), TR(Math.min(a, b), "Le plus court chemin vers [hypoténuse] est perpendiculaire à celle-ci.")] }); },
    ],
  };

  // ===================== droitesrem =====================
  const DR = {
    1: [
      () => { const m = 3 * R.int(2, 10);
        return Qv("Dans le triangle " + M("ABC") + ", la médiane " + M("[CM]") + " mesure " + M(m) + " cm. " + M("G") + " est le centre de gravité. Calcule " + M("CG") + " (en cm).", (2 * m) / 3, "Le centre de gravité est aux deux tiers de la médiane depuis le sommet : " + M("\\frac{2}{3} \\cdot " + m + " = " + (2 * m) / 3) + " cm.",
          { ctx: "CG", fig: FIG.triLines("medianes", { m: m + " cm" }), guide: [GS("Un tiers de la médiane ?", m / 3, M(m / 3) + " cm."), GS(M("CG") + " (deux tiers) ?", (2 * m) / 3, M((2 * m) / 3) + " cm.")], traps: [TR(m / 2, "G n'est pas au milieu : il est aux 2/3 depuis le sommet."), TR(m / 3, "Ça, c'est GM ; CG en vaut le double.")] }); },
      () => { const m = 3 * R.int(2, 10);
        return Qv("La médiane " + M("[AM]") + " d'un triangle mesure " + M(m) + " cm. Calcule la distance " + M("GM") + " entre le centre de gravité et le milieu " + M("M") + " (en cm).", m / 3, M("GM = \\frac{1}{3} \\cdot " + m + " = " + m / 3) + " cm.",
          { ctx: "GM", guide: [GS(M("GM") + " ?", m / 3, M(m / 3) + " cm.")], traps: [TR((2 * m) / 3, "Ça, c'est AG (côté sommet)."), TR(m / 2, "G partage la médiane en 2/3 et 1/3.")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [3, 4, 5]]);
        return Qv("Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Quel est le rayon de son cercle circonscrit (en cm) ?", c / 2, "Le centre du cercle circonscrit est le milieu de l'hypoténuse : " + M("r = \\frac{" + c + "}{2} = " + N(c / 2)) + " cm.",
          { ctx: "circonscrit", fig: FIG.rightTriangle([a + " cm", b + " cm", ""]), guide: [GS("Hypoténuse ?", c, M(c) + " cm."), GS("Rayon ?", c / 2, M(N(c / 2)) + " cm.")], traps: [TR(c, "Le diamètre est l'hypoténuse : le rayon en est la moitié."), TR((a + b) / 2, "Calcule d'abord l'hypoténuse.")] }); },
    ],
    2: [
      () => { const A = 2 * R.int(15, 50);
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + A + "°") + ". " + M("I") + " est le point d'intersection des bissectrices. Que mesure " + M("\\widehat{BIC}") + " (en degrés) ?", 90 + A / 2, M("\\widehat{B} + \\widehat{C} = " + (180 - A) + "°") + " ; leurs moitiés font " + M((180 - A) / 2 + "°") + " ; " + M("\\widehat{BIC} = 180° - " + (180 - A) / 2 + "° = " + (90 + A / 2) + "°") + ".",
          { ctx: "bissectrices", fig: FIG.triLines("bissectrices", { A: A + "°" }), guide: [GS(M("\\widehat{B} + \\widehat{C}") + " ?", 180 - A, M(180 - A) + "°."), GS("Leurs moitiés ?", (180 - A) / 2, M((180 - A) / 2) + "°."), GS(M("\\widehat{BIC}") + " ?", 90 + A / 2, M(90 + A / 2) + "°.")], traps: [TR(180 - A, "Les bissectrices coupent B et C en deux."), TR(A / 2, "Utilise la somme des angles du triangle BIC.")] }); },
      () => { const g = 2 * R.int(2, 12);
        return Qv("Dans un triangle, le centre de gravité " + M("G") + " est à " + M(g) + " cm du sommet " + M("B") + ". Quelle est la longueur de la médiane issue de " + M("B") + " (en cm) ?", (3 * g) / 2, M("BG = \\frac{2}{3} BM") + ", donc " + M("BM = \\frac{3}{2} \\cdot " + g + " = " + (3 * g) / 2) + " cm.",
          { ctx: "mediane", guide: [GS("Un tiers de la médiane (" + M("BG : 2") + ") ?", g / 2, M(g / 2) + " cm."), GS("Médiane ?", (3 * g) / 2, M((3 * g) / 2) + " cm.")], traps: [TR(3 * g, "BG vaut les 2/3 de la médiane, pas 1/3."), TR(2 * g, "G n'est pas au milieu de la médiane.")] }); },
      () => { const B = R.int(35, 80);
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{B} = " + B + "°") + ". On trace la hauteur issue de " + M("A") + ", qui coupe " + M("[BC]") + " en " + M("H") + ". Que mesure " + M("\\widehat{BAH}") + " (en degrés) ?", 90 - B, "Le triangle " + M("ABH") + " est rectangle en " + M("H") + " : " + M("180° - 90° - " + B + "° = " + (90 - B) + "°") + ".",
          { ctx: "hauteur", guide: [GS("Angle en " + M("H") + " ?", 90, "90° : la hauteur est perpendiculaire."), GS(M("\\widehat{BAH}") + " ?", 90 - B, M(90 - B) + "°.")], traps: [TR(180 - B, "Le triangle ABH a aussi un angle droit en H."), TR(B, "Ce n'est pas l'angle en B.")] }); },
    ],
    3: [
      () => { const m = R.int(2, 6), a = 3 * m;
        return Qv("Un triangle équilatéral a des côtés de " + M(a) + " cm. Calcule le rayon de son cercle circonscrit (distance du centre à un sommet)" + EXA + ".", m * Math.sqrt(3), "Hauteur " + M("h = \\frac{" + a + "\\sqrt{3}}{2}") + " ; le centre (centre de gravité) est aux 2/3 : " + M("r = \\frac{2}{3} h = \\frac{" + a + "\\sqrt{3}}{3} = " + (m === 1 ? "" : m) + "\\sqrt{3}") + " cm.",
          { ctx: "equilateral-R", radical: true, canon: RC(m, 3), guide: [GSR("Hauteur ?", (a * Math.sqrt(3)) / 2, M("\\frac{" + a + "\\sqrt{3}}{2}") + "."), GSR("Rayon (2/3 de la hauteur) ?", m * Math.sqrt(3), RS(m, 3) + " cm.")], traps: [TR(a / 2, "Le centre n'est pas au milieu d'un côté."), TR((a * Math.sqrt(3)) / 2, "Ça, c'est la hauteur entière.")] }); },
      () => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), r = (a + b - c) / 2;
        return Qv("Un triangle rectangle a des côtés de " + M(a) + ", " + M(b) + " et " + M(c) + " cm. Le rayon de son cercle inscrit vaut " + M("r = \\frac{a + b - c}{2}") + ". Calcule-le (en cm).", r, M("\\frac{" + a + " + " + b + " - " + c + "}{2} = " + N(r)) + " cm.",
          { ctx: "inscrit", guide: [GS(M("a + b - c") + " ?", a + b - c, M(a + b - c) + "."), GS(M("r") + " ?", r, M(N(r)) + " cm.")], traps: [TR(c / 2, "Ça, c'est le rayon du cercle CIRCONSCRIT."), TR(a + b - c, "Divise par 2.")] }); },
      () => { const A = 2 * R.int(20, 45), B = 2 * R.int(15, 40); if (A + B >= 170) return null; const C = 180 - A - B;
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + A + "°") + " et " + M("\\widehat{B} = " + B + "°") + ". " + M("I") + " est le centre du cercle inscrit. Que mesure " + M("\\widehat{AIB}") + " ?", 180 - A / 2 - B / 2, "Les bissectrices coupent A et B en deux : " + M("180° - " + A / 2 + "° - " + B / 2 + "° = " + (180 - A / 2 - B / 2) + "°") + " (ou " + M("90° + \\frac{" + C + "°}{2}") + ").",
          { ctx: "AIB", guide: [GS("Moitiés de A et de B : somme ?", A / 2 + B / 2, M(A / 2 + B / 2) + "°."), GS(M("\\widehat{AIB}") + " ?", 180 - A / 2 - B / 2, M(180 - A / 2 - B / 2) + "°.")], traps: [TR(C, "Ce n'est pas l'angle C."), TR(180 - A - B, "Les bissectrices partagent A et B en deux.")] }); },
    ],
  };

  // ===================== exactes =====================
  const EX = {
    1: [
      () => { const k = R.int(2, 9);
        return Qv("Calcule la diagonale d'un carré de côté " + M(k) + " cm" + EXA + ".", k * Math.SQRT2, M("d = \\sqrt{" + k + "^2 + " + k + "^2} = \\sqrt{" + 2 * k * k + "} = " + k + "\\sqrt{2}") + " cm.",
          { ctx: "diag-carre", radical: true, canon: RC(k, 2), guide: [GS(M("d^2") + " ?", 2 * k * k, M(2 * k * k) + "."), GSR("Valeur exacte ?", k * Math.SQRT2, RS(k, 2) + " cm.")], traps: [TR(2 * k, "La diagonale est plus courte que deux côtés."), TR(k * Math.sqrt(3), "Pour un carré : k√2.")] }); },
      () => { const k = R.int(2, 7);
        return Qv("Calcule la hauteur d'un triangle équilatéral de côté " + M(2 * k) + " cm" + EXA + ".", k * Math.sqrt(3), M("\\sqrt{" + 4 * k * k + " - " + k * k + "} = \\sqrt{" + 3 * k * k + "} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "h-equi", radical: true, canon: RC(k, 3), guide: [GS(M("h^2") + " ?", 3 * k * k, M(3 * k * k) + "."), GSR("Valeur exacte ?", k * Math.sqrt(3), RS(k, 3) + " cm.")], traps: [TR(k * Math.SQRT2, "Pour l'équilatéral : k√3."), TR(2 * k, "La hauteur est plus courte que le côté.")] }); },
      () => { const k = R.int(2, 9);
        return Qv("Un carré a une aire de " + M(2 * k * k) + " cm². Calcule son côté" + EXA + ".", k * Math.SQRT2, M("\\sqrt{" + 2 * k * k + "} = \\sqrt{" + k * k + " \\cdot 2} = " + k + "\\sqrt{2}") + " cm.",
          { ctx: "cote-aire", radical: true, canon: RC(k, 2), guide: [GS("Plus grand carré parfait qui divise " + M(2 * k * k) + " ?", k * k, M(k * k) + "."), GSR("Côté ?", k * Math.SQRT2, RS(k, 2) + " cm.")], traps: [TR(k * k, "Le côté est la racine de l'aire."), TR((2 * k * k) / 4, "Diviser par 4 donne le côté à partir du périmètre.")] }); },
    ],
    2: [
      () => { const k = R.int(1, 5);
        return Qv("Calcule l'aire d'un triangle équilatéral de côté " + M(2 * k) + " cm" + EXA + ".", k * k * Math.sqrt(3), "Hauteur " + RS(k, 3) + " ; aire " + M("\\frac{" + 2 * k + " \\cdot " + (k === 1 ? "" : k) + "\\sqrt{3}}{2} = " + (k * k === 1 ? "" : k * k) + "\\sqrt{3}") + " cm².",
          { ctx: "aire-equi", radical: true, canon: RC(k * k, 3), guide: [GSR("Hauteur ?", k * Math.sqrt(3), RS(k, 3) + "."), GSR("Aire ?", k * k * Math.sqrt(3), RS(k * k, 3) + " cm².")], traps: [TR(2 * k * k * Math.sqrt(3), "Aire d'un triangle : ÷ 2."), TR(k * k * Math.SQRT2, "C'est √3 pour l'équilatéral.")] }); },
      () => { const k = R.int(1, 6);
        return Qv("Un rectangle mesure " + M(k) + " cm sur " + M(2 * k) + " cm. Calcule sa diagonale" + EXA + ".", k * Math.sqrt(5), M("\\sqrt{" + k * k + " + " + 4 * k * k + "} = \\sqrt{" + 5 * k * k + "} = " + (k === 1 ? "" : k) + "\\sqrt{5}") + " cm.",
          { ctx: "diag-rect", radical: true, canon: RC(k, 5), guide: [GS(M("d^2") + " ?", 5 * k * k, M(5 * k * k) + "."), GSR("Valeur exacte ?", k * Math.sqrt(5), RS(k, 5) + " cm.")], traps: [TR(3 * k, "Pythagore, pas la somme des côtés."), TR(k * Math.sqrt(3), "k² + (2k)² = 5k².")] }); },
      () => { const k = R.int(2, 9);
        return Qv("La diagonale d'un carré mesure " + RS(k, 2) + " cm. Calcule son périmètre (en cm).", 4 * k, "Diagonale " + M("c\\sqrt{2}") + " : le côté vaut " + M(k) + " cm ; périmètre " + M(4 * k) + " cm.",
          { ctx: "perim-diag", guide: [GS("Côté ?", k, M(k) + " cm."), GS("Périmètre ?", 4 * k, M(4 * k) + " cm.")], traps: [TR(4 * k * Math.SQRT2, "Le côté vaut k (la diagonale vaut k√2)."), TR(k * k, "Périmètre : 4 côtés.")] }); },
    ],
    3: [
      () => { const k = R.int(2, 9);
        return Qv("Calcule la diagonale de l'espace d'un cube d'arête " + M(k) + " cm" + EXA + ".", k * Math.sqrt(3), "Diagonale d'une face " + RS(k, 2) + " ; puis " + M("\\sqrt{" + 2 * k * k + " + " + k * k + "} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "cube", radical: true, canon: RC(k, 3), guide: [GS("Carré de la diagonale d'une face ?", 2 * k * k, M(2 * k * k) + "."), GSR("Diagonale de l'espace ?", k * Math.sqrt(3), RS(k, 3) + " cm.")], traps: [TR(k * Math.SQRT2, "Ça, c'est la diagonale d'une face."), TR(3 * k, "Pythagore deux fois.")] }); },
      () => { const k = R.int(1, 4);
        return Qv("Un hexagone régulier a des côtés de " + M(2 * k) + " cm (six triangles équilatéraux). Calcule son aire" + EXA + ".", 6 * k * k * Math.sqrt(3), "Un triangle : " + RS(k * k, 3) + " cm² ; six triangles : " + RS(6 * k * k, 3) + " cm².",
          { ctx: "hexagone", radical: true, canon: RC(6 * k * k, 3), guide: [GSR("Aire d'un triangle équilatéral de côté " + M(2 * k) + " ?", k * k * Math.sqrt(3), RS(k * k, 3) + "."), GSR("Aire de l'hexagone ?", 6 * k * k * Math.sqrt(3), RS(6 * k * k, 3) + " cm².")], traps: [TR(k * k * Math.sqrt(3), "Il y a six triangles."), TR(3 * k * k * Math.sqrt(3), "Six triangles, pas trois.")] }); },
      () => { const k = R.int(2, 6);
        return Qv("Un disque est inscrit dans un carré de côté " + M(2 * k) + " cm. Calcule l'aire de la partie du carré hors du disque (valeur exacte, touche π, en cm²).", 4 * k * k - Math.PI * k * k, "Carré " + M(4 * k * k) + " cm², disque " + M("\\pi \\cdot " + k + "^2 = " + k * k + "\\pi") + " : " + M(4 * k * k + " - " + k * k + "\\pi") + " cm².",
          { ctx: "carre-disque", pi: true, guide: [GS("Aire du carré ?", 4 * k * k, M(4 * k * k) + "."), GS("Aire du disque (touche π) ?", Math.PI * k * k, M(k * k + "\\pi") + "."), ({ ask: "Différence ?", spec: { kind: "value", value: 4 * k * k - Math.PI * k * k, pi: true }, sol:  M(4 * k * k + " - " + k * k + "\\pi") + "." })], traps: [TR(4 * k * k - Math.PI * 4 * k * k, "Le rayon vaut la moitié du côté : " + k + "."), TR(Math.PI * k * k, "On demande la partie HORS du disque.")] }); },
    ],
  };

  // ===================== angtri =====================
  const AT = {
    1: [
      () => { const a = R.int(25, 80), b = R.int(25, 80);
        return Qv("Dans un triangle, deux angles mesurent " + M(a + "°") + " et " + M(b + "°") + ". Que mesure le troisième (en degrés) ?", 180 - a - b, "Somme des angles : " + M("180° - " + a + "° - " + b + "° = " + (180 - a - b) + "°") + ".",
          { ctx: "triangle", fig: FIG.triAngles([a + "°", b + "°", "?"]), guide: [GS("Somme des deux angles connus ?", a + b, M(a + b) + "°."), GS("Troisième angle ?", 180 - a - b, M(180 - a - b) + "°.")], traps: [TR(360 - a - b, "Dans un triangle, la somme vaut 180° (360° pour un quadrilatère)."), TR(a + b, "On soustrait de 180°.")] }); },
      () => { const s = 2 * R.int(10, 70);
        return Qv("Un triangle isocèle a un angle au sommet de " + M(s + "°") + ". Que mesure chacun des angles à la base (en degrés) ?", (180 - s) / 2, M("\\frac{180° - " + s + "°}{2} = " + (180 - s) / 2 + "°") + " : les angles à la base sont égaux.",
          { ctx: "isocele", guide: [GS("Somme des deux angles à la base ?", 180 - s, M(180 - s) + "°."), GS("Chacun ?", (180 - s) / 2, M((180 - s) / 2) + "°.")], traps: [TR(180 - s, "Les deux angles à la base se partagent ce total."), TR(s, "Les angles à la base sont égaux entre eux, pas à l'angle au sommet.")] }); },
      () => { const a = R.int(60, 120), b = R.int(60, 120), c = R.int(50, 110); if (a + b + c >= 340) return null;
        return Qv("Un quadrilatère a trois angles de " + M(a + "°") + ", " + M(b + "°") + " et " + M(c + "°") + ". Que mesure le quatrième (en degrés) ?", 360 - a - b - c, "Somme des angles d'un quadrilatère : " + M("360°") + " ; " + M("360 - " + a + " - " + b + " - " + c + " = " + (360 - a - b - c)) + "°.",
          { ctx: "quadrilatere", guide: [GS("Somme des trois angles ?", a + b + c, M(a + b + c) + "°."), GS("Quatrième ?", 360 - a - b - c, M(360 - a - b - c) + "°.")], traps: [TR(180 - (a + b + c) % 180, "Un quadrilatère se découpe en deux triangles : 360°."), TR(Math.abs(180 - a - b - c), "La somme vaut 360°, pas 180°.")] }); },
    ],
    2: [
      () => { const a = R.int(30, 75), b = R.int(30, 75);
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + a + "°") + " et " + M("\\widehat{B} = " + b + "°") + ". On prolonge " + M("[BC]") + " au-delà de " + M("C") + ". Que mesure l'angle extérieur en " + M("C") + " (en degrés) ?", a + b, "Angle " + M("\\widehat{C} = " + (180 - a - b) + "°") + " ; extérieur " + M("180° - " + (180 - a - b) + "° = " + (a + b) + "°") + " (somme des deux autres angles).",
          { ctx: "exterieur", guide: [GS(M("\\widehat{C}") + " ?", 180 - a - b, M(180 - a - b) + "°."), GS("Angle extérieur ?", a + b, M(a + b) + "°.")], traps: [TR(180 - a - b, "Ça, c'est l'angle intérieur C."), TR(360 - a - b, "Angle extérieur = 180° − angle intérieur.")] }); },
      () => { const b = R.int(25, 85);
        return Qv("Un triangle isocèle a deux angles à la base de " + M(b + "°") + ". Que mesure l'angle au sommet (en degrés) ?", 180 - 2 * b, M("180° - 2 \\cdot " + b + "° = " + (180 - 2 * b) + "°") + ".",
          { ctx: "sommet", guide: [GS("Somme des angles à la base ?", 2 * b, M(2 * b) + "°."), GS("Angle au sommet ?", 180 - 2 * b, M(180 - 2 * b) + "°.")], traps: [TR(180 - b, "Il y a DEUX angles à la base de " + b + "°."), TR(b, "Les angles à la base sont égaux entre eux.")] }); },
      () => { const a = R.int(40, 140); if (a === 90) return null;
        return Qv("Dans un parallélogramme, un angle mesure " + M(a + "°") + ". Que mesure l'angle consécutif (voisin) (en degrés) ?", 180 - a, "Deux angles consécutifs d'un parallélogramme sont supplémentaires : " + M("180° - " + a + "° = " + (180 - a) + "°") + ".",
          { ctx: "parallelogramme", guide: [GS("Angle consécutif ?", 180 - a, M(180 - a) + "°.")], traps: [TR(a, "Ce sont les angles OPPOSÉS qui sont égaux."), TR(360 - a, "Consécutifs : supplémentaires (180°).")] }); },
    ],
    3: [
      () => { const n = pk([5, 6, 8, 9, 10, 12]), v = ((n - 2) * 180) / n;
        return Qv("Que mesure chaque angle d'un polygone régulier à " + M(n) + " côtés (en degrés) ?", v, "Somme des angles " + M("(" + n + " - 2) \\cdot 180° = " + (n - 2) * 180 + "°") + " ; chacun " + M((n - 2) * 180 + " : " + n + " = " + N(v) + "°") + ".",
          { ctx: "polygone", guide: [GS("Somme des angles (" + M("(n - 2) \\cdot 180") + ") ?", (n - 2) * 180, M((n - 2) * 180) + "°."), GS("Chaque angle ?", v, M(N(v)) + "°.")], traps: [TR(360 / n, "Ça, c'est l'angle au centre (ou extérieur), pas l'angle intérieur."), TR(180 - 360 / n === v ? (n * 180) / n : (n * 180) / n, "La somme vaut (n − 2) · 180°.")] }); },
      () => { const [p, q, r] = pk([[1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 3, 5], [3, 4, 5]]), k = 180 / (p + q + r); if (!Number.isInteger(k)) return null;
        return Qv("Les angles d'un triangle sont proportionnels à " + M(p) + ", " + M(q) + " et " + M(r) + ". Que mesure le plus grand (en degrés) ?", r * k, M(p + " + " + q + " + " + r + " = " + (p + q + r)) + " parts ; une part " + M("180° : " + (p + q + r) + " = " + k + "°") + " ; le plus grand " + M(r + " \\cdot " + k + " = " + r * k + "°") + ".",
          { ctx: "proportion", guide: [GS("Une part (en degrés) ?", k, M(k) + "°."), GS("Plus grand angle ?", r * k, M(r * k) + "°.")], traps: [TR(r * 10, "Il faut d'abord trouver la valeur d'une part."), TR(k, "Ça, c'est une part ; le plus grand vaut " + r + " parts.")] }); },
      () => { const n = pk([9, 10, 12, 15, 18, 20]), v = ((n - 2) * 180) / n;
        return Qv("Chaque angle d'un polygone régulier mesure " + M(N(v) + "°") + ". Combien a-t-il de côtés ?", n, "Angle extérieur " + M("180° - " + N(v) + "° = " + N(180 - v) + "°") + " ; " + M("360 : " + N(180 - v) + " = " + n) + " côtés.",
          { ctx: "nb-cotes", guide: [GS("Angle extérieur (" + M("180° -") + " angle) ?", 180 - v, M(N(180 - v)) + "°."), GS("Nombre de côtés (" + M("360 :") + " angle extérieur) ?", n, M(n) + ".")], traps: [TR(Math.round(360 / v), "On divise 360° par l'angle EXTÉRIEUR."), TR(Math.round(180 / (180 - v)), "La somme des angles extérieurs vaut 360°.")] }); },
    ],
  };

  const PROBS = {
    euclide: [() => P("Triangle rectangle : la hauteur issue de l'angle droit coupe l'hypoténuse en 9 cm et 16 cm.", [["a) Hauteur (cm)", 12], ["b) Plus petite cathète (cm)", 15], ["c) Aire (cm²)", 150]], ["h² = 9 · 16.", "a² = 9 · 25."], "a) 12 ; b) " + M("\\sqrt{9 \\cdot 25} = 15") + " ; c) " + M("\\frac{25 \\cdot 12}{2} = 150") + ".")],
    geocomb: [() => P("Une tente a la forme d'un prisme : la façade est un triangle isocèle de côtés 2,5 m et de base 4 m ; la tente est longue de 3 m.", [["a) Hauteur de la façade (m)", 1.5], ["b) Aire de la façade (m²)", 3], ["c) Volume de la tente (m³)", 9]], ["Demi-base 2 m.", "Volume = aire de la façade · longueur."], "a) " + M("\\sqrt{6{,}25 - 4} = 1{,}5") + " ; b) 3 ; c) 9.")],
    droitesrem: [() => P("Triangle ABC rectangle en C, AC = 6 cm, BC = 8 cm.", [["a) Rayon du cercle circonscrit (cm)", 5], ["b) Longueur de la médiane issue de C (cm)", 5], ["c) Distance de C au centre de gravité (cm)", 10 / 3]], ["Hypoténuse 10.", "La médiane issue de l'angle droit vaut la moitié de l'hypoténuse."], "a) 5 ; b) 5 ; c) " + M("\\frac{2}{3} \\cdot 5 = \\frac{10}{3}") + ".")],
    exactes: [() => P("Un carré a un côté de 4 cm.", [["a) d² (carré de la diagonale)", 32], ["b) Aire du carré construit sur la diagonale (cm²)", 32], ["c) Rapport de cette aire à celle du carré", 2]], ["d = 4√2.", "(4√2)² = 32."], "a) 32 ; b) 32 ; c) 2.")],
    angtri: [() => P("Un pentagone régulier ABCDE.", [["a) Somme des angles (°)", 540], ["b) Chaque angle (°)", 108], ["c) Angle ABE du triangle isocèle ABE (°)", 36]], ["(5 − 2) · 180.", "ABE isocèle en A, angle en A = 108°."], "a) 540 ; b) 108 ; c) " + M("\\frac{180 - 108}{2} = 36") + ".")],
  };

  const ALL = { euclide: EU, geocomb: GC, droitesrem: DR, exactes: EX, angtri: AT };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    euclide: "Triangle rectangle, hauteur h sur l'hypoténuse c = p + q : h² = p · q ; a² = p · c ; b² = q · c ; et a · b = c · h.",
    geocomb: "Cherche le triangle rectangle caché (hauteur d'un isocèle, demi-diagonales, débord d'un trapèze), puis Pythagore.",
    droitesrem: "Centre de gravité : aux 2/3 de chaque médiane depuis le sommet. Triangle rectangle : le centre du cercle circonscrit est le milieu de l'hypoténuse.",
    exactes: "Carré de côté a : diagonale a√2. Équilatéral de côté a : hauteur a√3/2. Garde les racines, ne passe pas aux décimaux.",
    angtri: "Triangle : 180°. Quadrilatère : 360°. Polygone à n côtés : (n − 2) · 180°. Isocèle : angles à la base égaux.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    euclide: ["Hauteur, cathète, projection", "Hauteur par l'aire, segment, hypoténuse", "Aire, périmètre, écart"],
    geocomb: ["Diagonale, isocèle, équilatéral", "Toit, carton, losange", "Trapèze, cône, plus court chemin"],
    droitesrem: ["Centre de gravité, cercle circonscrit", "Bissectrices, médiane, hauteur", "Équilatéral, cercle inscrit, angle AIB"],
    exactes: ["Diagonale, hauteur, côté", "Aire de l'équilatéral, rectangle, périmètre", "Cube, hexagone, disque inscrit"],
    angtri: ["Triangle, isocèle, quadrilatère", "Angle extérieur, sommet, parallélogramme", "Polygones réguliers, angles proportionnels"],
  });
})();

// Chantier 1re Collège (bêta-testeurs) · dernier lot (19.11) : trigo, trigexact. Même standard : au moins 3 formes
// par niveau, pas à pas, erreurs typiques (sin/cos/tan confondus, degré/pente), ctx, figures ; défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const D = Math.PI / 180, sin = (a) => Math.sin(a * D), cos = (a) => Math.cos(a * D), tan = (a) => Math.tan(a * D), deg = (x) => x / D;
  const N = (v, k) => String(k === undefined ? r6(v) : +(+v).toFixed(k)).replace(".", "{,}");
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 0.02 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}, o.radical ? { radical: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const F = (lab, ang) => FIG.trigTriangle(lab, ang);
  const GSr = (ask, value, sol, round) => ({ ask, spec: { kind: "value", value, round }, sol });

  // ===================== trigo =====================
  const TG = {
    1: [
      () => { const a = R.int(20, 70), h = R.int(4, 15), v = h * sin(a);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et un angle aigu " + M(a + "°") + ". Calcule le côté opposé à cet angle (au centième, en cm).", v, M("\\sin " + a + "° = \\frac{\\text{opp}}{" + h + "}") + ", donc " + M("\\text{opp} = " + h + " \\cdot \\sin " + a + "° \\approx " + N(v, 2)) + " cm.",
          { ctx: "sin-opp", round: 0.01, fig: F(["", "?", h + " cm"], a + "°"), guide: [GSr("Opposé et hypoténuse : sinus. " + M("\\sin " + a + "°") + " (au millième) ?", sin(a), M(N(sin(a), 3)) + ".", 0.001), GSr("Opposé ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(h * cos(a), "Le côté OPPOSÉ va avec le sinus (le cosinus donne l'adjacent)."), TR(h / sin(a), "On multiplie l'hypoténuse par sin, on ne divise pas.")] }); },
      () => { const a = R.int(20, 70), h = R.int(4, 15), v = h * cos(a);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et un angle aigu " + M(a + "°") + ". Calcule le côté adjacent à cet angle (au centième, en cm).", v, M("\\cos " + a + "° = \\frac{\\text{adj}}{" + h + "}") + ", donc " + M("\\text{adj} = " + h + " \\cdot \\cos " + a + "° \\approx " + N(v, 2)) + " cm.",
          { ctx: "cos-adj", round: 0.01, fig: F(["?", "", h + " cm"], a + "°"), guide: [GSr("Adjacent et hypoténuse : cosinus. " + M("\\cos " + a + "°") + " (au millième) ?", cos(a), M(N(cos(a), 3)) + ".", 0.001), GSr("Adjacent ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(h * sin(a), "Le côté ADJACENT va avec le cosinus."), TR(h * tan(a), "Avec l'hypoténuse : sinus ou cosinus, pas tangente.")] }); },
      () => { const a = R.int(20, 65), d = R.int(3, 12), v = d * tan(a);
        return Qv("Dans un triangle rectangle, le côté adjacent à un angle de " + M(a + "°") + " mesure " + M(d) + " cm. Calcule le côté opposé (au centième, en cm).", v, M("\\tan " + a + "° = \\frac{\\text{opp}}{" + d + "}") + ", " + M("\\text{opp} = " + d + " \\cdot \\tan " + a + "° \\approx " + N(v, 2)) + " cm.",
          { ctx: "tan-opp", round: 0.01, fig: F([d + " cm", "?", ""], a + "°"), guide: [GSr("Opposé et adjacent : tangente. " + M("\\tan " + a + "°") + " (au millième) ?", tan(a), M(N(tan(a), 3)) + ".", 0.001), GSr("Opposé ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(d * sin(a), "Sans l'hypoténuse : c'est la tangente (opposé ÷ adjacent)."), TR(d / tan(a), "opp = adj · tan, on multiplie.")] }); },
    ],
    2: [
      () => { const o = R.int(3, 12), d = R.int(3, 12); if (o === d) return null; const v = deg(Math.atan(o / d));
        return Qv("Les cathètes d'un triangle rectangle mesurent " + M(o) + " cm (opposée à " + M("\\alpha") + ") et " + M(d) + " cm (adjacente). Calcule " + M("\\alpha") + " (au dixième de degré).", v, M("\\tan \\alpha = \\frac{" + o + "}{" + d + "}") + ", " + M("\\alpha = \\tan^{-1}\\left(\\frac{" + o + "}{" + d + "}\\right) \\approx " + N(v, 1) + "°") + ".",
          { ctx: "atan", round: 0.1, fig: F([d + " cm", o + " cm", ""], "α ?"), guide: [GSr(M("\\tan \\alpha = \\frac{opp}{adj}") + " (au millième) ?", o / d, M(N(o / d, 3)) + ".", 0.001), GSr(M("\\alpha = \\tan^{-1}(\\ldots)") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR(deg(Math.atan(d / o)), "tan α = OPPOSÉ ÷ adjacent : " + o + " ÷ " + d + "."), TR(90 - v + (o > d ? 0 : 0) + 0.0001 === v ? 0 : 90 - v, "Ça, c'est l'autre angle aigu.")] }); },
      () => { const o = R.int(2, 9), h = o + R.int(1, 8), v = deg(Math.asin(o / h));
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et le côté opposé à " + M("\\alpha") + " mesure " + M(o) + " cm. Calcule " + M("\\alpha") + " (au dixième de degré).", v, M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ", " + M("\\alpha = \\sin^{-1}\\left(\\frac{" + o + "}{" + h + "}\\right) \\approx " + N(v, 1) + "°") + ".",
          { ctx: "asin", round: 0.1, fig: F(["", o + " cm", h + " cm"], "α ?"), guide: [GSr(M("\\sin \\alpha") + " (au millième) ?", o / h, M(N(o / h, 3)) + ".", 0.001), GSr(M("\\alpha") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR(deg(Math.acos(o / h)), "Opposé et hypoténuse : sinus, donc sin⁻¹."), TR(deg(Math.atan(o / h)), "Avec l'hypoténuse, ce n'est pas la tangente.")] }); },
      () => { const a = R.int(25, 65), o = R.int(3, 12), v = o / sin(a);
        return Qv("Le côté opposé à un angle de " + M(a + "°") + " d'un triangle rectangle mesure " + M(o) + " cm. Calcule l'hypoténuse (au centième, en cm).", v, M("\\sin " + a + "° = \\frac{" + o + "}{h}") + ", donc " + M("h = \\frac{" + o + "}{\\sin " + a + "°} \\approx " + N(v, 2)) + " cm.",
          { ctx: "hyp", round: 0.01, fig: F(["", o + " cm", "?"], a + "°"), guide: [GSr(M("\\sin " + a + "°") + " (au millième) ?", sin(a), M(N(sin(a), 3)) + ".", 0.001), GSr("Hypoténuse (" + M(o + " : \\sin " + a + "°") + ") ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(o * sin(a), "L'hypoténuse est le plus long côté : on DIVISE par sin."), TR(o / cos(a), "Le côté donné est opposé : sinus.")] }); },
    ],
    3: [
      () => { const a = R.int(20, 60), dist = R.int(15, 60), eye = 1.6, v = dist * tan(a) + eye;
        return Qv("Une personne dont les yeux sont à " + M("1{,}6") + " m du sol se tient à " + M(dist) + " m d'un immeuble. Elle voit son sommet sous un angle de " + M(a + "°") + " avec l'horizontale. Quelle est la hauteur de l'immeuble (au centième, en m) ?", v, M(dist + " \\cdot \\tan " + a + "° \\approx " + N(dist * tan(a), 2)) + " m au-dessus des yeux, plus " + M("1{,}6") + " m : " + M(N(v, 2)) + " m.",
          { ctx: "immeuble", round: 0.01, fig: F([dist + " m", "?", ""], a + "°"), guide: [GSr("Hauteur au-dessus des yeux ?", dist * tan(a), M(N(dist * tan(a), 2)) + " m.", 0.01), GSr("Hauteur totale ?", v, M(N(v, 2)) + " m.", 0.01)], traps: [TR(dist * tan(a), "N'oublie pas d'ajouter la hauteur des yeux."), TR(dist * sin(a) + eye, "La distance est horizontale (adjacent) : tangente.")] }); },
      () => { const L = pk([5, 6, 8, 10]), a = R.int(60, 78), h = L * sin(a), dd = L * cos(a);
        return Qv("Une échelle de " + M(L) + " m est appuyée contre un mur ; elle fait un angle de " + M(a + "°") + " avec le sol. À quelle distance du mur se trouve son pied (au centième, en m) ?", dd, M(L + " \\cdot \\cos " + a + "° \\approx " + N(dd, 2)) + " m (et elle atteint " + M(N(h, 2)) + " m de haut).",
          { ctx: "echelle", round: 0.01, fig: F(["?", "", L + " m"], a + "°"), guide: [GSr(M("\\cos " + a + "°") + " (au millième) ?", cos(a), M(N(cos(a), 3)) + ".", 0.001), GSr("Distance au mur ?", dd, M(N(dd, 2)) + " m.", 0.01)], traps: [TR(h, "Ça, c'est la hauteur atteinte (côté opposé à l'angle au sol)."), TR(L * tan(a), "L'échelle est l'hypoténuse : cosinus.")] }); },
      () => { const h = pk([120, 150, 200, 250]), dd = pk([1500, 2000, 2500]), v = deg(Math.atan(h / dd));
        return Qv("Une route monte de " + M(h) + " m sur une distance horizontale de " + M(N(dd / 1000) + "\\ \\text{km}") + ". Quel angle fait-elle avec l'horizontale (au dixième de degré) ?", v, M("\\tan \\alpha = \\frac{" + h + "}{" + dd + "}") + " ; " + M("\\alpha \\approx " + N(v, 1) + "°") + " (pente " + M(N((100 * h) / dd, 1) + "\\,\\%") + ").",
          { ctx: "route", round: 0.1, guide: [GSr("Même unité : " + M("\\tan \\alpha = \\frac{" + h + "}{" + dd + "}") + " (au millième) ?", h / dd, M(N(h / dd, 3)) + ".", 0.001), GSr(M("\\alpha") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR((100 * h) / dd, "Ça, c'est la pente en % ; on demande l'angle en degrés."), TR(deg(Math.atan(h / (dd / 1000))), "Convertis les km en m avant de diviser.")] }); },
    ],
  };

  // ===================== trigexact =====================
  const TE = {
    1: [
      () => { const h = 2 * R.int(2, 9);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et un angle aigu " + M("30°") + ". Calcule, sans calculatrice, le côté opposé à cet angle (en cm).", h / 2, M("\\sin 30° = \\frac{1}{2}") + " : " + M("\\frac{" + h + "}{2} = " + h / 2) + " cm.",
          { ctx: "sin30", fig: F(["", "?", h + " cm"], "30°"), guide: [GS(M("\\sin 30°") + " (fraction) ?", 0.5, M("\\frac{1}{2}") + "."), GS("Côté opposé ?", h / 2, M(h / 2) + " cm.")], traps: [TR((h * Math.sqrt(3)) / 2, "Ça, c'est le côté adjacent (cos 30°)."), TR(h * 30 / 90, "On utilise sin 30° = 1/2.")] }); },
      () => { const a = pk([45, 45, 30, 60]), v = a === 45 ? 100 : r6(100 * tan(a));
        if (a !== 45) return Qv("Une route est inclinée de " + M(a + "°") + ". Quelle est sa pente en % (au dixième) ?", v, "Pente " + M("= \\tan " + a + "° \\cdot 100\\,\\% \\approx " + N(v, 1) + "\\,\\%") + ".", { ctx: "pente-" + a, round: 0.1, guide: [GSr(M("\\tan " + a + "°") + " (au millième) ?", tan(a), M(N(tan(a), 3)) + ".", 0.001), GSr("Pente en % ?", v, M(N(v, 1) + "\\,\\%") + ".", 0.1)], traps: [TR(a, "Un angle n'est pas une pente : pente = tan(angle) · 100 %."), TR((a / 90) * 100, "Pas une règle de trois : utilise la tangente.")] });
        return Qv("Une rampe est inclinée de " + M("45°") + ". Quelle est sa pente en % ?", 100, M("\\tan 45° = 1") + " : on monte d'autant qu'on avance, soit " + M("100\\,\\%") + ".", { ctx: "pente-45", guide: [GS(M("\\tan 45°") + " ?", 1, M(1) + "."), GS("Pente en % ?", 100, M("100\\,\\%") + ".")], traps: [TR(45, "Un angle n'est pas une pente."), TR(50, "45° est la moitié de 90°, mais la pente n'est pas proportionnelle à l'angle.")] }); },
      () => { const k = R.int(2, 9);
        return Qv("Un triangle rectangle isocèle a une hypoténuse de " + M(2 * k) + " cm. Calcule la longueur d'une cathète (valeur exacte, touche √).", k * Math.SQRT2, M("\\cos 45° = \\frac{\\sqrt{2}}{2}") + " : " + M(2 * k + " \\cdot \\frac{\\sqrt{2}}{2} = " + k + "\\sqrt{2}") + " cm.",
          { ctx: "cos45", radical: true, canon: k + "√2", fig: F(["?", "", 2 * k + " cm"], "45°"), guide: [GSR(M("\\cos 45°") + " ?", Math.SQRT2 / 2, M("\\frac{\\sqrt{2}}{2}") + "."), GSR("Cathète ?", k * Math.SQRT2, M(k + "\\sqrt{2}") + " cm.")], traps: [TR(k, "Les cathètes ne valent pas la moitié de l'hypoténuse."), TR(2 * k * Math.SQRT2, "On multiplie par √2/2, pas par √2.")] }); },
    ],
    2: [
      () => { const k = R.int(2, 9);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(2 * k) + " cm et un angle aigu " + M("60°") + ". Calcule le côté opposé à cet angle (valeur exacte, touche √).", k * Math.sqrt(3), M("\\sin 60° = \\frac{\\sqrt{3}}{2}") + " : " + M(2 * k + " \\cdot \\frac{\\sqrt{3}}{2} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "sin60", radical: true, canon: k + "√3", fig: F(["", "?", 2 * k + " cm"], "60°"), guide: [GSR(M("\\sin 60°") + " ?", Math.sqrt(3) / 2, M("\\frac{\\sqrt{3}}{2}") + "."), GSR("Côté opposé ?", k * Math.sqrt(3), M(k + "\\sqrt{3}") + " cm.")], traps: [TR(k, "Ça, c'est le côté adjacent (cos 60° = 1/2)."), TR(k * Math.SQRT2, "C'est √3/2 pour 60°.")] }); },
      () => { const p = pk([5, 8, 10, 12, 15]), v = deg(Math.atan(p / 100));
        return Qv("Un panneau indique une pente de " + M(p + "\\,\\%") + ". Quel angle la route fait-elle avec l'horizontale (au dixième de degré) ?", v, M("\\tan \\alpha = " + N(p / 100)) + ", " + M("\\alpha = \\tan^{-1}(" + N(p / 100) + ") \\approx " + N(v, 1) + "°") + ".",
          { ctx: "angle-pente", round: 0.1, guide: [GS(M("\\tan \\alpha") + " (décimal) ?", p / 100, M(N(p / 100)) + " : on monte de " + p + " m pour 100 m."), GSr(M("\\alpha") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR(p, "Une pente de " + p + " % n'est pas un angle de " + p + "°."), TR((p * 90) / 100, "Utilise tan⁻¹, pas une règle de trois.")] }); },
      () => { const [o, h] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17]]), c = Math.sqrt(h * h - o * o) / h;
        return Qv("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ". Calcule " + M("\\cos \\alpha") + " (fraction).", c, M("\\cos^2 \\alpha = 1 - \\frac{" + o * o + "}{" + h * h + "} = \\frac{" + (h * h - o * o) + "}{" + h * h + "}") + ", " + M("\\cos \\alpha = \\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".",
          { ctx: "pythagore-trig", guide: [GS(M("\\cos^2 \\alpha") + " (fraction) ?", c * c, M("\\frac{" + (h * h - o * o) + "}{" + h * h + "}") + "."), GS(M("\\cos \\alpha") + " ?", c, M("\\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".")], traps: [TR(1 - o / h, "sin² + cos² = 1 : ce sont les CARRÉS."), TR(c * c, "N'oublie pas la racine.")] }); },
    ],
    3: [
      () => { const k = R.int(1, 6);
        return Qv("Dans un triangle rectangle, le côté adjacent à un angle de " + M("30°") + " mesure " + M(3 * k) + " cm. Calcule le côté opposé (valeur exacte, touche √).", k * Math.sqrt(3), M("\\tan 30° = \\frac{\\sqrt{3}}{3}") + " : " + M(3 * k + " \\cdot \\frac{\\sqrt{3}}{3} = " + (k === 1 ? "" : k) + "\\sqrt{3}") + " cm.",
          { ctx: "tan30", radical: true, canon: (k === 1 ? "" : k) + "√3", fig: F([3 * k + " cm", "?", ""], "30°"), guide: [GSR(M("\\tan 30°") + " ?", Math.sqrt(3) / 3, M("\\frac{\\sqrt{3}}{3}") + "."), GSR("Côté opposé ?", k * Math.sqrt(3), M((k === 1 ? "" : k) + "\\sqrt{3}") + " cm.")], traps: [TR(3 * k * Math.sqrt(3), "tan 30° = √3/3 (moins que 1), pas √3."), TR(1.5 * k, "Ça serait sin 30° avec l'hypoténuse.")] }); },
      () => { const p = pk([6, 8, 10, 12]), dkm = pk([1.5, 2, 2.5, 3]), v = p * dkm * 10;
        return Qv("Une route de montagne a une pente de " + M(p + "\\,\\%") + ". De combien de mètres monte-t-on pour " + M(N(dkm) + "\\ \\text{km}") + " parcourus à l'horizontale ?", v, M(p + "\\,\\%") + " : " + M(p) + " m pour 100 m ; " + M(N(dkm * 1000) + " \\cdot " + N(p / 100) + " = " + N(v)) + " m.",
          { ctx: "denivele", guide: [GS("Distance horizontale en m ?", dkm * 1000, M(N(dkm * 1000)) + " m."), GS("Montée ?", v, M(N(v)) + " m.")], traps: [TR(p * dkm, "Convertis les km en m."), TR(r6(dkm * 1000 * sin(p)), "Une pente en % n'est pas un angle.")] }); },
      () => { const k = R.int(2, 6);
        return Qv("Un triangle équilatéral a des côtés de " + M(2 * k) + " cm. Calcule son aire avec " + M("\\sin 60°") + " (valeur exacte, touche √, en cm²).", k * k * Math.sqrt(3), "Hauteur " + M(2 * k + " \\cdot \\sin 60° = " + k + "\\sqrt{3}") + " ; aire " + M("\\frac{" + 2 * k + " \\cdot " + k + "\\sqrt{3}}{2} = " + k * k + "\\sqrt{3}") + " cm².",
          { ctx: "aire-equi", radical: true, canon: k * k + "√3", guide: [GSR("Hauteur ?", k * Math.sqrt(3), M(k + "\\sqrt{3}") + "."), GSR("Aire ?", k * k * Math.sqrt(3), M(k * k + "\\sqrt{3}") + " cm².")], traps: [TR(2 * k * k * Math.sqrt(3), "Aire d'un triangle : ÷ 2."), TR(k * k, "N'oublie pas le facteur √3.")] }); },
    ],
  };

  // ===================== trigrel : relations trigonométriques (20.11, fin de la 1re Collège) =====================
  const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]; // triplets primitifs : fractions irréductibles
  const fr = (p, q) => "\\frac{" + p + "}{" + q + "}";
  const pick3 = () => { const [a, b, c] = pk(TRI), sw = R.rand() < 0.5; return sw ? [b, a, c] : [a, b, c]; }; // opp, adj, hyp
  const Qx = (q, value, sol, o) => Qv(q, value, sol, Object.assign({ canon: o.canon }, o));
  const TRL = {
    1: [
      () => { const [p, q, c] = pick3();
        return Qx("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin\\alpha = " + fr(p, c)) + ". Calcule " + M("\\cos\\alpha") + " (fraction).", q / c, M("\\cos^2\\alpha = 1 - \\sin^2\\alpha = 1 - " + fr(p * p, c * c) + " = " + fr(q * q, c * c)) + ", donc " + M("\\cos\\alpha = " + fr(q, c)) + " (positif : l'angle est aigu).",
          { ctx: "sin-vers-cos", canon: q + "/" + c, guide: [GS(M("\\sin^2\\alpha") + " = ? (fraction)", (p * p) / (c * c), M("\\left(" + fr(p, c) + "\\right)^2 = " + fr(p * p, c * c)) + "."), GS(M("\\cos^2\\alpha = 1 - \\sin^2\\alpha") + " = ?", (q * q) / (c * c), M(fr(q * q, c * c)) + "."), GS(M("\\cos\\alpha") + " = ?", q / c, M(fr(q, c)) + " (racine positive).")],
            traps: [TR(1 - p / c, "On utilise les carrés : cos²α = 1 − sin²α, pas cos α = 1 − sin α."), TR((q * q) / (c * c), "C'est cos²α ; il reste à prendre la racine."), TR(p / c, "C'est le sinus ; on cherche le cosinus.")] }); },
      () => { const [p, q, c] = pick3();
        return Qx("L'angle " + M("\\alpha") + " est aigu et " + M("\\cos\\alpha = " + fr(q, c)) + ". Calcule " + M("\\sin\\alpha") + " (fraction).", p / c, M("\\sin^2\\alpha = 1 - " + fr(q * q, c * c) + " = " + fr(p * p, c * c)) + ", donc " + M("\\sin\\alpha = " + fr(p, c)) + ".",
          { ctx: "cos-vers-sin", canon: p + "/" + c, guide: [GS(M("\\sin^2\\alpha = 1 - \\cos^2\\alpha") + " = ? (fraction)", (p * p) / (c * c), M("1 - " + fr(q * q, c * c) + " = " + fr(p * p, c * c)) + "."), GS(M("\\sin\\alpha") + " = ?", p / c, M(fr(p, c)) + ".")],
            traps: [TR(1 - q / c, "sin²α + cos²α = 1 porte sur les carrés."), TR((p * p) / (c * c), "C'est sin²α ; prends la racine.")] }); },
      () => { const [a0, b0, c] = pk([[3, 4, 5], [7, 24, 25]]), sw = R.rand() < 0.5, p = sw ? b0 : a0, q = sw ? a0 : b0, dS = (p / c).toFixed(2), dC = (q / c).toFixed(2);
        const ask = pk(["tan", "cos"]);
        return ask === "tan"
          ? Qx("Pour un angle aigu " + M("\\alpha") + ", " + M("\\sin\\alpha = " + dS.replace(".", "{,}")) + " et " + M("\\cos\\alpha = " + dC.replace(".", "{,}")) + ". Calcule " + M("\\tan\\alpha") + " (fraction ou décimal).", p / q, M("\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = \\frac{" + dS.replace(".", "{,}") + "}{" + dC.replace(".", "{,}") + "} = " + fr(p, q)) + ".",
            { ctx: "tan-quotient", guide: [GS(M("\\tan\\alpha = \\sin\\alpha \\div \\cos\\alpha") + " = ?", p / q, M(fr(p, q)) + ".")], traps: [TR(q / p, "tan α = sin α ÷ cos α (et non l'inverse)."), TR((p * q) / (c * c), "On divise, on ne multiplie pas.")] })
          : Qx("Pour un angle aigu " + M("\\alpha") + ", " + M("\\sin\\alpha = " + dS.replace(".", "{,}")) + ". Calcule " + M("\\cos\\alpha") + " (décimal).", q / c, M("\\cos\\alpha = \\sqrt{1 - " + dS.replace(".", "{,}") + "^2} = \\sqrt{" + (1 - (p / c) ** 2).toFixed(4).replace(/0+$/, "").replace(".", "{,}") + "} = " + dC.replace(".", "{,}")) + ".",
            { ctx: "decimal", guide: [GS(M(dS.replace(".", "{,}") + "^2") + " = ?", (p / c) ** 2, M(((p / c) ** 2).toFixed(4).replace(/0+$/, "").replace(".", "{,}")) + "."), GS(M("1 - " + dS.replace(".", "{,}") + "^2") + " = ?", 1 - (p / c) ** 2, M((1 - (p / c) ** 2).toFixed(4).replace(/0+$/, "").replace(".", "{,}")) + "."), GS(M("\\cos\\alpha") + " = ?", q / c, M(dC.replace(".", "{,}")) + ".")], traps: [TR(1 - p / c, "On travaille avec les carrés : cos²α = 1 − sin²α."), TR((q / c) ** 2, "C'est cos²α ; prends la racine.")] }); },
    ],
    2: [
      () => { const [p, q, c] = pick3();
        return Qx("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin\\alpha = " + fr(p, c)) + ". Calcule " + M("\\tan\\alpha") + " (fraction).", p / q, M("\\cos\\alpha = \\sqrt{1 - " + fr(p * p, c * c) + "} = " + fr(q, c)) + ", puis " + M("\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = " + fr(p, c) + " \\div " + fr(q, c) + " = " + fr(p, q)) + ".",
          { ctx: "sin-vers-tan", canon: p + "/" + q, guide: [GS("D'abord " + M("\\cos\\alpha") + " = ?", q / c, M(fr(q, c)) + "."), GS(M("\\tan\\alpha = \\sin\\alpha \\div \\cos\\alpha") + " = ?", p / q, M(fr(p, c) + " \\div " + fr(q, c) + " = " + fr(p, q)) + ".")],
            traps: [TR(q / p, "tan α = sin α ÷ cos α : opposé sur adjacent."), TR(q / c, "C'est cos α ; il faut encore diviser.")] }); },
      () => { const [p, q, c] = pick3(), ask = pk(["sin", "cos"]), v = ask === "sin" ? p / c : q / c;
        return Qx("L'angle " + M("\\alpha") + " est aigu et " + M("\\tan\\alpha = " + fr(p, q)) + ". Calcule " + M("\\" + ask + "\\alpha") + " (fraction).", v, "On dessine un triangle rectangle avec opposé " + M(p) + " et adjacent " + M(q) + " : hypoténuse " + M("\\sqrt{" + p * p + " + " + q * q + "} = " + c) + ". " + M("\\" + ask + "\\alpha = " + (ask === "sin" ? fr(p, c) : fr(q, c))) + ".",
          { ctx: "tan-vers-" + ask, canon: (ask === "sin" ? p : q) + "/" + c, fig: F([String(q), String(p), "?"], "α"), guide: [GS("Triangle d'opposé " + M(p) + " et d'adjacent " + M(q) + ". Hypoténuse ?", c, M("\\sqrt{" + p * p + " + " + q * q + "} = " + c) + "."), GS(M("\\" + ask + "\\alpha") + " = ?", v, M(ask === "sin" ? fr(p, c) : fr(q, c)) + (ask === "sin" ? " (opposé sur hypoténuse)." : " (adjacent sur hypoténuse)."))],
            traps: [TR(ask === "sin" ? q / c : p / c, ask === "sin" ? "Le sinus, c'est l'opposé sur l'hypoténuse." : "Le cosinus, c'est l'adjacent sur l'hypoténuse."), TR(ask === "sin" ? p / (p + q) : q / (p + q), "L'hypoténuse se calcule avec Pythagore, pas en additionnant.")] }); },
      () => { let p, q; do { q = R.int(3, 7); p = R.int(1, q - 1); } while (gcd(p, q) !== 1 || Number.isInteger(Math.sqrt(q * q - p * p)));
        const r = q * q - p * p; let k = 1, m = r; for (let i = 2; i * i <= m; i++) while (m % (i * i) === 0) { m /= i * i; k *= i; }
        const ex = (k === 1 ? "" : k) + "\\sqrt{" + m + "}", sw = R.rand() < 0.5;
        return Qv("L'angle " + M("\\alpha") + " est aigu et " + M((sw ? "\\cos" : "\\sin") + "\\alpha = " + fr(p, q)) + ". Calcule la valeur exacte de " + M((sw ? "\\sin" : "\\cos") + "\\alpha") + ".", Math.sqrt(r) / q, M((sw ? "\\sin" : "\\cos") + "^2\\alpha = 1 - " + fr(p * p, q * q) + " = " + fr(r, q * q)) + ", donc " + M((sw ? "\\sin" : "\\cos") + "\\alpha = \\frac{" + ex + "}{" + q + "}") + ".",
          { ctx: "exacte", radical: true, canon: (k === 1 ? "" : k) + "sqrt(" + m + ")/" + q, guide: [GS(M((sw ? "\\sin" : "\\cos") + "^2\\alpha") + " = ? (fraction)", r / (q * q), M("1 - " + fr(p * p, q * q) + " = " + fr(r, q * q)) + "."), GSR(M((sw ? "\\sin" : "\\cos") + "\\alpha") + " = ? (valeur exacte, avec √)", Math.sqrt(r) / q, M("\\frac{\\sqrt{" + r + "}}{" + q + "} = \\frac{" + ex + "}{" + q + "}") + ".")],
            traps: [TR(1 - p / q, "On travaille avec les carrés."), TR(r / (q * q), "C'est le carré ; prends la racine.")] }); },
    ],
    3: [
      () => { const [p, q, c] = pick3(), v = 1 + p / c;
        return Qx("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin\\alpha = " + fr(p, c)) + ". Calcule " + M("\\sin^2\\alpha + \\cos^2\\alpha + \\tan\\alpha \\cdot \\cos\\alpha") + " (fraction).", v, M("\\sin^2\\alpha + \\cos^2\\alpha = 1") + " et " + M("\\tan\\alpha \\cdot \\cos\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} \\cdot \\cos\\alpha = \\sin\\alpha") + " : " + M("1 + " + fr(p, c) + " = " + fr(c + p, c)) + ".",
          { ctx: "simplifier", canon: (c + p) + "/" + c, guide: [GS(M("\\sin^2\\alpha + \\cos^2\\alpha") + " = ?", 1, "Toujours " + M(1) + "."), GS(M("\\tan\\alpha \\cdot \\cos\\alpha") + " = ? (c'est une des trois valeurs)", p / c, M("\\sin\\alpha = " + fr(p, c)) + "."), GS("Total ?", v, M(fr(c + p, c)) + ".")],
            traps: [TR(1 + q / c, "tan α · cos α = sin α (et non cos α)."), TR(p / c, "N'oublie pas sin²α + cos²α = 1.")] }); },
      () => { const t = pk([2, 3, 4, 5]), ask = pk(["cos", "sin"]), v = ask === "cos" ? 1 / Math.sqrt(1 + t * t) : t / Math.sqrt(1 + t * t);
        return Qv("L'angle " + M("\\alpha") + " est aigu et " + M("\\tan\\alpha = " + t) + ". Calcule la valeur exacte de " + M("\\" + ask + "\\alpha") + ".", v, "Triangle rectangle d'opposé " + M(t) + " et d'adjacent " + M(1) + " : hypoténuse " + M("\\sqrt{" + (1 + t * t) + "}") + ". " + M("\\" + ask + "\\alpha = \\frac{" + (ask === "cos" ? 1 : t) + "}{\\sqrt{" + (1 + t * t) + "}}") + ".",
          { ctx: "tan-entier-" + ask, radical: true, canon: (ask === "cos" ? 1 : t) + "/sqrt(" + (1 + t * t) + ")", fig: F(["1", String(t), "?"], "α"), guide: [GS(M("\\tan\\alpha = " + t + " = \\frac{" + t + "}{1}") + " : opposé " + M(t) + ", adjacent " + M(1) + ". Hypoténuse (au carré) ?", 1 + t * t, M(t * t + " + 1 = " + (1 + t * t)) + " : hypoténuse " + M("\\sqrt{" + (1 + t * t) + "}") + "."), GSR(M("\\" + ask + "\\alpha") + " = ? (avec √)", v, M("\\frac{" + (ask === "cos" ? 1 : t) + "}{\\sqrt{" + (1 + t * t) + "}}") + ".")],
            traps: [TR(ask === "cos" ? 1 / t : t / (1 + t), ask === "cos" ? "1/t, c'est l'adjacent sur l'opposé, pas le cosinus." : "L'hypoténuse vient de Pythagore."), TR(ask === "cos" ? t / Math.sqrt(1 + t * t) : 1 / Math.sqrt(1 + t * t), ask === "cos" ? "Ça, c'est le sinus." : "Ça, c'est le cosinus.")] }); },
      () => { const [p, q, c] = pick3(), v = q / p;
        return Qx("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin\\alpha = " + fr(p, c)) + ". Calcule " + M("\\tan(90° - \\alpha)") + " (fraction).", v, "Dans le triangle rectangle, l'autre angle aigu vaut " + M("90° - \\alpha") + " : son opposé est l'adjacent de " + M("\\alpha") + ". Donc " + M("\\tan(90° - \\alpha) = \\frac{\\cos\\alpha}{\\sin\\alpha} = " + fr(q, c) + " \\div " + fr(p, c) + " = " + fr(q, p)) + ".",
          { ctx: "complementaire", canon: q + "/" + p, guide: [GS(M("\\cos\\alpha") + " = ?", q / c, M(fr(q, c)) + "."), GS(M("\\sin(90° - \\alpha)") + " = ? (l'opposé de l'autre angle est l'adjacent de α)", q / c, M("\\cos\\alpha = " + fr(q, c)) + "."), GS(M("\\tan(90° - \\alpha) = \\frac{\\sin(90° - \\alpha)}{\\cos(90° - \\alpha)}") + " = ?", v, M(fr(q, p)) + ".")],
            traps: [TR(p / q, "Ça, c'est tan α ; pour l'angle complémentaire, opposé et adjacent s'échangent."), TR(q / c, "C'est cos α ; il faut encore diviser.")] }); },
    ],
  };

  const PROBS = {
    trigrel: [() => P("Dans un triangle rectangle, l'angle aigu α vérifie sin α = 0,6. L'hypoténuse mesure 15 cm.", [["a) cos α (décimal)", 0.8], ["b) Côté opposé à α (cm)", 9], ["c) Côté adjacent à α (cm)", 12]], ["cos²α = 1 − 0,36.", "opposé = 15 · sin α."], "a) " + M("\\sqrt{0{,}64} = 0{,}8") + " ; b) " + M("15 \\cdot 0{,}6 = 9") + " ; c) " + M("15 \\cdot 0{,}8 = 12") + " cm.")],
    trigo: [() => P("Un cerf-volant est retenu par un fil tendu de 40 m qui fait un angle de 35° avec le sol (fil tenu à 1 m du sol).", [["a) Hauteur au-dessus de la main (m, au centième)", 22.94, 0.01], ["b) Hauteur au-dessus du sol (m, au centième)", 23.94, 0.01], ["c) Distance horizontale main–cerf-volant (m, au centième)", 32.77, 0.01]], ["Le fil est l'hypoténuse.", "sin pour la hauteur, cos pour l'horizontale."], "a) " + M("40 \\sin 35° \\approx 22{,}94") + " ; b) " + M("23{,}94") + " ; c) " + M("40 \\cos 35° \\approx 32{,}77") + ".")],
    trigexact: [() => P("Un triangle rectangle a une hypoténuse de 12 cm et un angle de 30°.", [["a) Côté opposé à 30° (cm)", 6], ["b) Côté adjacent (cm, valeur exacte : tape 6√3)", 6 * Math.sqrt(3)], ["c) Aire (cm², valeur exacte : tape 18√3)", 18 * Math.sqrt(3)]], ["sin 30° = 1/2.", "cos 30° = √3/2."], "a) 6 ; b) " + M("6\\sqrt{3}") + " ; c) " + M("\\frac{6 \\cdot 6\\sqrt{3}}{2} = 18\\sqrt{3}") + ".")],
  };

  // « Trouve l'erreur » (24.11, chantier I) : cosinus au lieu de sinus pour le côté opposé.
  TG[2].push(() => { const al = R.pick([25, 35, 40, 50, 55, 65]), c = R.int(6, 15), v = +(c * Math.sin((al * Math.PI) / 180)).toFixed(2), faux = +(c * Math.cos((al * Math.PI) / 180)).toFixed(2), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(c) + " cm et un angle aigu " + M("\\alpha") + " vaut " + M(al + "°") + ". Pour le côté <b>opposé</b> à " + M("\\alpha") + ", " + w + " écrit : « " + M(c + " \\cdot \\cos " + al + "° \\approx " + dec(faux)) + " cm ». Trouve l'erreur, puis calcule ce côté (au centième, en cm).", v,
      "Erreur : le cosinus relie le côté <b>adjacent</b> et l'hypoténuse. Pour le côté opposé : " + M("\\sin \\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}") + ", donc " + M(c + " \\cdot \\sin " + al + "° \\approx " + dec(v)) + " cm.",
      { round: 0.01, ctx: "erreur", guide: [GS("Quelle fonction relie l'opposé et l'hypoténuse ? Donne " + M("\\sin " + al + "°") + " (au millième).", Math.sin((al * Math.PI) / 180), M("\\sin " + al + "° \\approx " + dec(+Math.sin((al * Math.PI) / 180).toFixed(3))) + ".", 0.001), GS("Côté opposé : " + M(c + " \\cdot \\sin " + al + "°") + " ≈ ? (au centième)", v, M(dec(v)) + " cm.", 0.01)],
        traps: [TRAP(faux, "C'est le calcul de " + w + " : " + M("c \\cdot \\cos \\alpha") + " donne le côté adjacent.")] }); });
  const ALL = { trigo: TG, trigexact: TE, trigrel: TRL };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    trigo: "SOH-CAH-TOA : sin = opposé/hypoténuse, cos = adjacent/hypoténuse, tan = opposé/adjacent. Pour un angle : sin⁻¹, cos⁻¹, tan⁻¹ (calculatrice en degrés).",
    trigexact: "sin 30° = cos 60° = 1/2 ; sin 60° = cos 30° = √3/2 ; sin 45° = cos 45° = √2/2 ; tan 45° = 1. Pente (%) = tan(angle) · 100.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    trigo: ["Sinus, cosinus, tangente : un côté", "Calculer un angle, l'hypoténuse", "Immeuble, échelle, route"],
    trigexact: ["30°, 45°, pente de 100 %", "60°, angle d'une pente, sin² + cos²", "tan 30°, dénivelé, aire de l'équilatéral"],
  });
})();

// Chantier MP (19.11) · lot 1 du plan pas à pas : vabs, ratden, fracrat, valint, eqparam. Même standard : au moins
// 3 formes par niveau, pas à pas, erreurs typiques, ctx ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(6);
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); return d === 1 ? String(Math.round(v)) : Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const xs = (r) => xm(r).replace(/ /g, "");
  const show = (spec) => spec.values.map(fS).join(" ; ");
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; } seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value }, o.radical ? { radical: true } : {}), sol, o);
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QX = (q, expr, form, sol, o) => mk(q, Object.assign({ kind: "expr", expr }, form ? { form } : {}), sol, Object.assign({ canon: expr }, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });

  // ===================== vabs =====================
  const VA = {
    1: [
      () => { const a = R.int(2, 12), b = R.int(1, 12);
        return QN("Calcule : " + M("|-" + a + "| + |" + b + "|"), a + b, M(a + " + " + b + " = " + (a + b)) + " : la valeur absolue est une distance à zéro, toujours positive.", { ctx: "somme", guide: [GS(M("|-" + a + "|") + " ?", a, M(a) + "."), GS("Résultat ?", a + b, M(a + b) + ".")], traps: [TR(b - a, "|−" + a + "| = " + a + " (positif).")] }); },
      () => { const a = R.int(1, 9), b = a + R.int(2, 9);
        return QN("Calcule : " + M("|" + a + " - " + b + "|"), b - a, "On calcule d'abord l'intérieur : " + M("|" + (a - b) + "| = " + (b - a)) + ".", { ctx: "difference", guide: [GS("Intérieur " + M(a + " - " + b) + " ?", a - b, M(a - b) + "."), GS("Valeur absolue ?", b - a, M(b - a) + ".")], traps: [TR(a - b, "Une valeur absolue n'est jamais négative."), TR(a + b, "On calcule d'abord ce qui est entre les barres.")] }); },
      () => { const a = nz(-9, 9), b = nz(-9, 9); if (a === b) return null;
        return QN("Quelle est la distance entre " + M(a) + " et " + M(b) + " sur la droite des nombres ? (" + M("|a - b|") + ")", Math.abs(a - b), M("|" + a + " - " + par(b) + "| = |" + (a - b) + "| = " + Math.abs(a - b)) + ".", { ctx: "distance", guide: [GS(M(a + " - " + par(b)) + " ?", a - b, M(a - b) + "."), GS("Distance ?", Math.abs(a - b), M(Math.abs(a - b)) + ".")], traps: [TR(Math.abs(a + b), "Distance : on soustrait, |a − b|."), TR(a - b, "Une distance est positive.")] }); },
    ],
    2: [
      () => { const a = R.int(2, 9), b = R.int(3, 12); if (a === b) return null;
        return QSet("Résous : " + M("|" + a + " - x| = " + b) + ".", [a - b, a + b], M(a + " - x = \\pm " + b) + " : " + M("x = " + (a - b)) + " ou " + M("x = " + (a + b)) + ".", { ctx: "eq", guide: [GSet("Valeurs de " + M(a + " - x") + " ?", [b, -b], M("\\pm " + b) + "."), GSet("Solutions ?", [a - b, a + b], M(a - b) + " et " + M(a + b) + ".")], traps: [TSet([a + b], "|…| = " + b + " : deux cas, +" + b + " et −" + b + "."), TSet([a - b, -a - b], "Isole x correctement dans chaque cas.")] }); },
      () => { const a = nz(-6, 6), x = nz(-6, 6), v = Math.abs(2 * x - a) - Math.abs(x);
        return QN("Calcule " + M("|2x " + (a < 0 ? "+ " + -a : "- " + a) + "| - |x|") + " pour " + M("x = " + x) + ".", v, M("|" + (2 * x - a) + "| - |" + x + "| = " + Math.abs(2 * x - a) + " - " + Math.abs(x) + " = " + v) + ".", { ctx: "valeur", guide: [GS(M("|2x " + (a < 0 ? "+ " + -a : "- " + a) + "|") + " ?", Math.abs(2 * x - a), M(Math.abs(2 * x - a)) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(2 * x - a - x, "Prends la valeur absolue de chaque bloc."), TR(Math.abs(2 * x - a - x), "|A| − |B| n'est pas |A − B|.")] }); },
      () => { const c = nz(-5, 5), r = R.int(1, 6);
        return QN("Combien d'entiers " + M("x") + " vérifient " + M("|" + xm(c) + "| \\le " + r) + " ?", 2 * r + 1, "De " + M(c - r) + " à " + M(c + r) + " : " + M(2 * r + 1) + " entiers.", { ctx: "compte", guide: [GS("Plus petit entier ?", c - r, M(c - r) + "."), GS("Nombre d'entiers ?", 2 * r + 1, M(2 * r + 1) + ".")], traps: [TR(2 * r, "Les bornes sont comprises (≤)."), TR(r + 1, "Distance au plus " + r + " de part et d'autre de " + c + ".")] }); },
    ],
    3: [
      () => { const c = R.int(1, 5), d = R.int(2, 6);
        return QSet("Résous : " + M("\\left|\\frac{x}{2} - " + c + "\\right| = " + d) + ".", [2 * (c - d), 2 * (c + d)], M("\\frac{x}{2} = " + c + " \\pm " + d) + " : " + M("x = " + 2 * (c + d)) + " ou " + M("x = " + 2 * (c - d)) + ".", { ctx: "eq-frac", guide: [GSet("Valeurs de " + M("\\frac{x}{2}") + " ?", [c + d, c - d], M(c + d) + " et " + M(c - d) + "."), GSet("Solutions ?", [2 * (c - d), 2 * (c + d)], M(2 * (c - d)) + " et " + M(2 * (c + d)) + ".")], traps: [TSet([c - d, c + d], "Multiplie par 2 pour obtenir x.")] }); },
      () => { const a = R.int(1, 6), b = a + R.int(2, 8);
        return QSet("Résous : " + M("|" + xm(a) + "| = |" + xm(b) + "|") + ".", [(a + b) / 2], "x est à égale distance de " + M(a) + " et " + M(b) + " : le milieu " + M(fT((a + b) / 2)) + ".", { ctx: "milieu", guide: [GSet("Solution ?", [(a + b) / 2], M(fT((a + b) / 2)) + ".")], traps: [TSet([a, b], "Ce sont les points de référence ; x est entre les deux.")] }); },
      () => { const k = R.int(2, 9);
        return QN("Combien de solutions l'équation " + M("|x| = x - " + k) + " a-t-elle ?", 0, "Si " + M("x \\ge 0") + " : " + M("x = x - " + k) + " impossible ; si " + M("x < 0") + " : " + M("-x = x - " + k) + ", " + M("x = " + fT(k / 2)) + " > 0, refusé. Aucune solution.", { ctx: "aucune", guide: [GS("Cas " + M("x < 0") + " : valeur trouvée ?", k / 2, M(fT(k / 2)) + ", positive : contradiction."), GS("Nombre de solutions ?", 0, "0.")], traps: [TR(1, "Vérifie la condition de chaque cas."), TR(2, "Vérifie chaque solution dans l'équation de départ.")] }); },
    ],
  };

  // ===================== ratden =====================
  const RD = {
    1: [
      () => { const m = pk([2, 3, 5, 6, 7]), k = R.int(1, 5), a = k * m;
        return QN("Rends rationnel le dénominateur : " + M("\\frac{" + a + "}{\\sqrt{" + m + "}}") + " (forme " + M("a\\sqrt{b}") + ").", k * Math.sqrt(m), M("\\frac{" + a + "\\sqrt{" + m + "}}{" + m + "} = " + (k === 1 ? "" : k) + "\\sqrt{" + m + "}") + ".", { ctx: "simple", radical: true, canon: (k === 1 ? "" : k) + "√" + m, guide: [GS("On multiplie haut et bas par " + M("\\sqrt{" + m + "}") + " : nouveau dénominateur ?", m, M(m) + "."), GSR("Résultat ?", k * Math.sqrt(m), M((k === 1 ? "" : k) + "\\sqrt{" + m + "}") + ".")], traps: [TR(a * Math.sqrt(m), "Le dénominateur devient " + m + " : il faut diviser."), TR(a / m, "Il reste une racine au numérateur.")] }); },
      () => { const m = pk([2, 3, 5]), k = R.int(2, 6);
        return QN("Écris sans racine au dénominateur : " + M("\\frac{" + k + "}{\\sqrt{" + m + "}}") + ". Donne la valeur exacte (touche √).", k / Math.sqrt(m), M("\\frac{" + k + "\\sqrt{" + m + "}}{" + m + "}") + ".", { ctx: "fraction", guide: [GS("Nouveau dénominateur ?", m, M(m) + "."), GSR("Résultat ?", k / Math.sqrt(m), M("\\frac{" + k + "\\sqrt{" + m + "}}{" + m + "}") + ".")], traps: [TR(k * Math.sqrt(m), "Divise par " + m + ".")] }); },
      () => { const m = pk([2, 3, 5]), k = R.int(1, 4), v = k * k * m;
        return QN("Calcule " + M("\\left(\\frac{" + k * m + "}{\\sqrt{" + m + "}}\\right)^2") + ".", v, M("\\frac{" + k * m + "}{\\sqrt{" + m + "}} = " + (k === 1 ? "" : k) + "\\sqrt{" + m + "}") + ", au carré " + M(v) + ".", { ctx: "carre", guide: [GS("Carré du numérateur ?", k * k * m * m, M(k * k * m * m) + "."), GS("Divisé par " + M(m) + " ?", v, M(v) + ".")], traps: [TR(k * k * m * m, "Le dénominateur au carré vaut " + m + ".")] }); },
    ],
    2: [
      () => { const m = pk([2, 3, 5, 6, 7]), a = R.int(1, 3); if (a * a === m) return null; const d = a * a - m;
        return QN("Rends rationnel le dénominateur de " + M("\\frac{1}{" + a + " + \\sqrt{" + m + "}}") + ". Donne la valeur exacte (touche √).", 1 / (a + Math.sqrt(m)), "On multiplie par le conjugué " + M(a + " - \\sqrt{" + m + "}") + " : " + M("\\frac{" + a + " - \\sqrt{" + m + "}}{" + a * a + " - " + m + "} = \\frac{" + a + " - \\sqrt{" + m + "}}{" + d + "}") + ".", { ctx: "conjugue", guide: [GS("Dénominateur " + M("(" + a + " + \\sqrt{" + m + "})(" + a + " - \\sqrt{" + m + "})") + " ?", d, M(a * a + " - " + m + " = " + d) + "."), GSR("Résultat ?", 1 / (a + Math.sqrt(m)), M("\\frac{" + a + " - \\sqrt{" + m + "}}{" + d + "}") + ".")], traps: [TR((a + Math.sqrt(m)) / d, "On multiplie par le CONJUGUÉ (signe opposé)."), TR((a - Math.sqrt(m)) / (a * a + m), "(a + b)(a − b) = a² − b².")] }); },
      () => { const m = pk([2, 3, 5]), k = R.int(2, 5), v = (2 * k) / Math.sqrt(m) + Math.sqrt(m);
        return QN("Simplifie " + M("\\frac{" + 2 * k + "}{\\sqrt{" + m + "}} + \\sqrt{" + m + "}") + " (valeur exacte, touche √).", v, M("\\frac{" + 2 * k + "\\sqrt{" + m + "}}{" + m + "} + \\sqrt{" + m + "} = \\frac{" + (2 * k + m) + "\\sqrt{" + m + "}}{" + m + "}") + ".", { ctx: "somme", guide: [GSR("Premier terme rendu rationnel ?", (2 * k) / Math.sqrt(m), M("\\frac{" + 2 * k + "\\sqrt{" + m + "}}{" + m + "}") + "."), GSR("Somme ?", v, M("\\frac{" + (2 * k + m) + "\\sqrt{" + m + "}}{" + m + "}") + ".")], traps: [TR(Math.sqrt(m) * (2 * k + 1), "Mets au même dénominateur.")] }); },
      () => { const m = pk([2, 3, 5]), k = R.int(2, 6);
        return QN("Un rectangle a une aire de " + M(k * m) + " cm² et une largeur de " + M("\\sqrt{" + m + "}") + " cm. Calcule sa longueur (valeur exacte, touche √).", k * Math.sqrt(m), M("\\frac{" + k * m + "}{\\sqrt{" + m + "}} = " + k + "\\sqrt{" + m + "}") + " cm.", { ctx: "rectangle", radical: true, canon: k + "√" + m, guide: [GSR("Longueur ?", k * Math.sqrt(m), M(k + "\\sqrt{" + m + "}") + " cm.")], traps: [TR(k * m * Math.sqrt(m), "Aire ÷ largeur : on divise."), TR(k, "Rends rationnel : multiplie par √" + m + "/√" + m + ".")] }); },
    ],
    3: [
      () => { const a = pk([3, 4, 5]), m = pk([2, 3, 5, 7]); if (a * a === m) return null; const d = a * a - m, v = (2 * a) / d;
        return QN("Calcule " + M("\\frac{1}{" + a + " - \\sqrt{" + m + "}} + \\frac{1}{" + a + " + \\sqrt{" + m + "}}") + " (fraction).", v, "Même dénominateur " + M("(" + a + ")^2 - " + m + " = " + d) + " ; numérateur " + M("(" + a + " + \\sqrt{" + m + "}) + (" + a + " - \\sqrt{" + m + "}) = " + 2 * a) + " : " + M(fT(v)) + ".", { ctx: "somme-conj", guide: [GS("Dénominateur commun ?", d, M(d) + "."), GS("Numérateur ?", 2 * a, M(2 * a) + " (les racines s'annulent)."), GS("Résultat ?", v, M(fT(v)) + ".")], traps: [TR(2 / d, "Le numérateur vaut 2a, pas 2."), TR((2 * a) / (a * a + m), "(a − √m)(a + √m) = a² − m.")] }); },
      () => { const m = pk([2, 3, 5]), k = R.int(2, 6), v = (k * k * m) / m;
        return QN("Calcule " + M("\\left(\\frac{" + k + "}{\\sqrt{" + m + "}}\\right)^2 \\cdot " + m) + " ?", k * k, M("\\frac{" + k * k + "}{" + m + "} \\cdot " + m + " = " + k * k) + ".", { ctx: "verif", guide: [GS(M("\\left(\\frac{" + k + "}{\\sqrt{" + m + "}}\\right)^2") + " (fraction) ?", (k * k) / m, M(fT((k * k) / m)) + "."), GS("Fois " + M(m) + " ?", k * k, M(k * k) + ".")], traps: [TR(k * k * m, "(√" + m + ")² = " + m + " au dénominateur.")] }); },
      () => { const m = pk([2, 3]), a = pk([1, 2]), d = a * a - m, v = (a + Math.sqrt(m)) / d;
        return QN("Rends rationnel : " + M("\\frac{\\sqrt{" + m + "} + " + a + "}{" + a + " - \\sqrt{" + m + "}} \\cdot \\frac{1}{\\sqrt{" + m + "} + " + a + "}") + " (valeur exacte, touche √).", 1 / (a - Math.sqrt(m)), "On simplifie d'abord par " + M("\\sqrt{" + m + "} + " + a) + " : " + M("\\frac{1}{" + a + " - \\sqrt{" + m + "}} = \\frac{" + a + " + \\sqrt{" + m + "}}{" + d + "}") + ".", { ctx: "simplifier", guide: [GSR("Après simplification, " + M("\\frac{1}{" + a + " - \\sqrt{" + m + "}}") + " rendu rationnel ?", 1 / (a - Math.sqrt(m)), M("\\frac{" + a + " + \\sqrt{" + m + "}}{" + d + "}") + ".")], traps: [TR(v * d * d, "Le dénominateur vaut " + d + "."), TR(-1 / (a - Math.sqrt(m)), "Attention au signe : " + a * a + " − " + m + " = " + d + ".")] }); },
    ],
  };

  // ===================== fracrat =====================
  const FR = {
    1: [
      () => { const a = nz(-7, 7), k = nz(-6, 6); if (a === k) return null;
        return QX("Simplifie " + M("\\frac{" + poly(pmul([1, -a], [1, -k])) + "}{" + xm(a) + "}") + " (pour " + M("x \\ne " + a) + ").", xs(k), "nodiv", "Le numérateur vaut " + M("(" + xm(a) + ")(" + xm(k) + ")") + " : " + M(xm(k)) + ".", { ctx: "trinome", guide: [GX("Factorise le numérateur", "(" + xs(a) + ")*(" + xs(k) + ")", M("(" + xm(a) + ")(" + xm(k) + ")") + "."), GX("Après simplification", xs(k), M(xm(k)) + ".")], traps: [TX(xs(-k), "Attention au signe du facteur restant.")] }); },
      () => { const k = R.int(1, 8);
        return QX("Simplifie " + M("\\frac{x^2 - " + k * k + "}{x + " + k + "}") + ".", "x-" + k, "nodiv", "Différence de carrés : " + M("\\frac{(x - " + k + ")(x + " + k + ")}{x + " + k + "} = x - " + k) + ".", { ctx: "diff-carres", guide: [GX("Factorise le numérateur", "(x-" + k + ")*(x+" + k + ")", M("(x - " + k + ")(x + " + k + ")") + "."), GX("Résultat", "x-" + k, M("x - " + k) + ".")], traps: [TX("x+" + k, "C'est le facteur x + " + k + " qui se simplifie."), TX("x-" + k * k, "On ne simplifie pas terme à terme.")] }); },
      () => { const a = R.int(2, 6), k = nz(-6, 6);
        return QX("Simplifie " + M("\\frac{" + a + "x " + (a * k < 0 ? "- " + -a * k : "+ " + a * k) + "}{" + a + "}") + ".", "x" + (k < 0 ? k : "+" + k), "nodiv", "Mise en évidence : " + M("\\frac{" + a + "(x " + (k < 0 ? "- " + -k : "+ " + k) + ")}{" + a + "}") + ".", { ctx: "evidence", guide: [GX("Après mise en évidence de " + M(a) + " au numérateur", a + "*(x" + (k < 0 ? k : "+" + k) + ")", M(a + "(x " + (k < 0 ? "- " + -k : "+ " + k) + ")") + "."), GX("Résultat", "x" + (k < 0 ? k : "+" + k), M("x " + (k < 0 ? "- " + -k : "+ " + k)) + ".")], traps: [TX("x+" + a * k, "On divise TOUT le numérateur par " + a + ".")] }); },
    ],
    2: [
      () => { const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5); if (new Set([a, b, c]).size < 3) return null;
        return QX("Simplifie " + M("\\frac{" + poly(pmul([1, -a], [1, -b])) + "}{" + poly(pmul([1, -a], [1, -c])) + "}") + ".", "(" + xs(b) + ")/(" + xs(c) + ")", "", "Facteur commun " + M(xm(a)) + " : " + M("\\frac{" + xm(b) + "}{" + xm(c) + "}") + ".", { ctx: "deux-trinomes", guide: [GX("Factorise le numérateur", "(" + xs(a) + ")*(" + xs(b) + ")", M("(" + xm(a) + ")(" + xm(b) + ")") + "."), GX("Résultat", "(" + xs(b) + ")/(" + xs(c) + ")", M("\\frac{" + xm(b) + "}{" + xm(c) + "}") + ".")], traps: [TX("(" + xs(-b) + ")/(" + xs(-c) + ")", "Zéro p ↔ facteur (x − p).")] }); },
      () => { const k = R.int(1, 6);
        return QX("Simplifie " + M("\\frac{" + k + " - x}{x - " + k + "}") + ".", "-1", "", M(k + " - x = -(x - " + k + ")") + " : le quotient vaut " + M("-1") + ".", { ctx: "oppose", guide: [GX("Écris " + M(k + " - x") + " avec " + M("x - " + k), "-(x-" + k + ")", M("-(x - " + k + ")") + "."), GX("Résultat", "-1", M("-1") + ".")], traps: [TX("1", k + " − x est l'OPPOSÉ de x − " + k + ".")] }); },
      () => { const a = R.int(2, 5), k = R.int(1, 6);
        return QX("Simplifie " + M("\\frac{" + a + "x^2 - " + a * k * k + "}{" + a + "x + " + a * k + "}") + ".", "x-" + k, "nodiv", M("\\frac{" + a + "(x - " + k + ")(x + " + k + ")}{" + a + "(x + " + k + ")} = x - " + k) + ".", { ctx: "evidence-diff", guide: [GX("Numérateur factorisé", a + "*(x-" + k + ")*(x+" + k + ")", M(a + "(x - " + k + ")(x + " + k + ")") + "."), GX("Résultat", "x-" + k, M("x - " + k) + ".")], traps: [TX(a + "*(x-" + k + ")", "Le " + a + " se simplifie aussi (il est au dénominateur).")] }); },
    ],
    3: [
      () => { const a = nz(-4, 4), b = nz(-4, 4); if (a === b) return null;
        return QX("Simplifie " + M("\\frac{1}{" + xm(a) + "} - \\frac{1}{" + xm(b) + "}") + " en une seule fraction.", "(" + (a - b) + ")/((" + xs(a) + ")*(" + xs(b) + "))", "onefrac", M("\\frac{(" + xm(b) + ") - (" + xm(a) + ")}{(" + xm(a) + ")(" + xm(b) + ")} = \\frac{" + (a - b) + "}{(" + xm(a) + ")(" + xm(b) + ")}") + ".", { ctx: "difference", guide: [GX("Numérateur après réduction", String(a - b), M(a - b) + "."), GX("Une seule fraction", "(" + (a - b) + ")/((" + xs(a) + ")*(" + xs(b) + "))", M("\\frac{" + (a - b) + "}{(" + xm(a) + ")(" + xm(b) + ")}") + ".")], traps: [TX("(" + (b - a) + ")/((" + xs(a) + ")*(" + xs(b) + "))", "Attention à l'ordre : (x − b) − (x − a) = a − b.")] }); },
      () => { const a = nz(-4, 4), k = R.int(2, 5);
        return QX("Simplifie " + M("\\frac{" + poly([1, -a]) + "}{" + k + "} \\cdot \\frac{" + 2 * k + "}{" + poly(pmul([1, -a], [1, a])) + "}") + ".", "2/(x" + (a < 0 ? a : "+" + a) + ")", "", M(poly(pmul([1, -a], [1, a])) + " = (" + xm(a) + ")(" + xm(-a) + ")") + " : " + M("\\frac{2}{" + xm(-a) + "}") + ".", { ctx: "produit", guide: [GX("Factorise " + M(poly(pmul([1, -a], [1, a]))), "(" + xs(a) + ")*(" + xs(-a) + ")", M("(" + xm(a) + ")(" + xm(-a) + ")") + "."), GX("Résultat", "2/(x" + (a < 0 ? a : "+" + a) + ")", M("\\frac{2}{" + xm(-a) + "}") + ".")], traps: [TX("2/(x" + (a < 0 ? "+" + -a : "-" + a) + ")", "C'est (" + xm(a) + ") qui se simplifie.")] }); },
      () => { const a = nz(-5, 5);
        return QX("Simplifie " + M("\\frac{x^2 " + (2 * a < 0 ? "- " + -2 * a : "+ " + 2 * a) + "x + " + a * a + "}{x^2 - " + a * a + "}") + ".", "(x" + (a < 0 ? a : "+" + a) + ")/(x" + (a < 0 ? "+" + -a : "-" + a) + ")", "", "Carré parfait et différence de carrés : " + M("\\frac{(" + xm(-a) + ")^2}{(" + xm(-a) + ")(" + xm(a) + ")} = \\frac{" + xm(-a) + "}{" + xm(a) + "}") + ".", { ctx: "carre-parfait", guide: [GX("Numérateur factorisé", "(" + xs(-a) + ")^2", M("(" + xm(-a) + ")^2") + "."), GX("Résultat", "(x" + (a < 0 ? a : "+" + a) + ")/(x" + (a < 0 ? "+" + -a : "-" + a) + ")", M("\\frac{" + xm(-a) + "}{" + xm(a) + "}") + ".")], traps: [TX("1", "Il reste un facteur en haut et en bas.")] }); },
    ],
  };

  // ===================== valint =====================
  const VI = {
    1: [
      () => { const a = nz(-8, 8);
        return QSet("Quelle est la valeur interdite de " + M("\\frac{3x}{" + xm(a) + "}") + " ?", [a], M(xm(a) + " = 0 \\iff x = " + a) + ".", { ctx: "simple", guide: [GSet("Valeur interdite ?", [a], M(a) + ".")], traps: [TSet([-a], "Résous " + xm(a) + " = 0 : attention au signe."), TSet([0], "On regarde le DÉNOMINATEUR.")] }); },
      () => { const k = R.int(1, 9);
        return QSet("Quelles sont les valeurs interdites de " + M("\\frac{x + 1}{x^2 - " + k * k + "}") + " ?", [-k, k], M("x^2 = " + k * k + " \\iff x = \\pm " + k) + ".", { ctx: "carre", guide: [GSet("Valeurs interdites ?", [-k, k], M("\\pm " + k) + ".")], traps: [TSet([k], "x² = " + k * k + " a deux solutions."), TSet([-1], "On regarde le dénominateur, pas le numérateur.")] }); },
      () => { const a = pk([2, 3, 4, 5]), z = nz(-5, 5);
        return QSet("Quelle est la valeur interdite de " + M("\\frac{1}{" + a + "x " + (a * z > 0 ? "- " + a * z : "+ " + -a * z) + "}") + " ?", [z], M(a + "x = " + a * z + " \\iff x = " + z) + ".", { ctx: "lineaire", guide: [GSet("Valeur interdite ?", [z], M(z) + ".")], traps: [TSet([a * z], "Divise par " + a + "."), TSet([-z], "Attention au signe.")] }); },
    ],
    2: [
      () => { const p = nz(-6, 5), q = p + R.int(1, 7);
        return QSet("Quelles sont les valeurs interdites de " + M("\\frac{5}{" + poly([1, -(p + q), p * q]) + "}") + " ?", [p, q], M(poly([1, -(p + q), p * q]) + " = (" + xm(p) + ")(" + xm(q) + ")") + " : " + M(p) + " et " + M(q) + ".", { ctx: "trinome", guide: [GSet("Valeurs interdites ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Les zéros de (x − p)(x − q) sont p et q.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5); if (a === b) return null;
        return QSet("Quelles sont les valeurs interdites de " + M("\\frac{1}{" + xm(a) + "} + \\frac{2}{" + xm(b) + "}") + " ?", [a, b], "Chaque dénominateur doit être non nul : " + M(a) + " et " + M(b) + ".", { ctx: "somme", guide: [GSet("Valeurs interdites ?", [a, b], M(a) + " et " + M(b) + ".")], traps: [TSet([a], "Il y a deux dénominateurs.")] }); },
      () => { const a = nz(-6, 6);
        return QSet("Quelles sont les valeurs interdites de " + M("\\frac{x}{x^2 " + (a < 0 ? "+ " + -a : "- " + a) + "x}") + " ?", [0, a], M("x(" + xm(a) + ") = 0") + " : " + M(0) + " et " + M(a) + ".", { ctx: "evidence", guide: [GSet("Valeurs interdites ?", [0, a], M(0) + " et " + M(a) + ".")], traps: [TSet([a], "N'oublie pas x = 0 (même si la fraction se simplifie, 0 reste interdit).")] }); },
    ],
    3: [
      () => { const p = R.int(1, 4);
        return QSet("Quelles sont les valeurs interdites de " + M("\\frac{1}{x^3 - " + p * p + "x}") + " ?", [0, -p, p], M("x(x^2 - " + p * p + ") = x(x - " + p + ")(x + " + p + ")") + ".", { ctx: "cube", guide: [GSet("Valeurs interdites ?", [0, -p, p], M("0, \\pm " + p) + ".")], traps: [TSet([-p, p], "N'oublie pas x = 0."), TSet([0], "x² − " + p * p + " s'annule aussi.")] }); },
      () => { const b = R.int(-3, 3), c = R.int(Math.ceil((b * b) / 4) + 1, 9);
        return QN("Combien de valeurs interdites a " + M("\\frac{2}{" + poly([1, b, c]) + "}") + " ?", 0, M("\\Delta = " + (b * b - 4 * c)) + " < 0 : le dénominateur ne s'annule jamais.", { ctx: "delta", guide: [GS(M("\\Delta") + " ?", b * b - 4 * c, M(b * b - 4 * c) + "."), GS("Nombre de valeurs interdites ?", 0, "0.")], traps: [TR(2, "Δ < 0 : pas de zéro."), TR(1, "Calcule Δ.")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4); if (a === b || a === -b) return null;
        return QSet("Quelles sont les valeurs interdites de " + M("\\frac{\\frac{1}{" + xm(a) + "}}{" + xm(b) + "}") + " ?", [a, b], "Deux dénominateurs : " + M(xm(a)) + " et " + M(xm(b)) + " ; " + M(a) + " et " + M(b) + ".", { ctx: "etagee", guide: [GSet("Valeurs interdites ?", [a, b], M(a) + " et " + M(b) + ".")], traps: [TSet([b], "Le dénominateur intérieur compte aussi.")] }); },
    ],
  };

  // ===================== eqparam =====================
  const EP = {
    1: [
      () => { const m = R.int(3, 8), b = R.int(1, 9);
        return QN("Pour quelle valeur de " + M("m") + " l'équation " + M("(m - " + m + ")x = " + b) + " n'a-t-elle aucune solution ?", m, "Si " + M("m = " + m) + " : " + M("0 \\cdot x = " + b) + ", impossible.", { ctx: "aucune", guide: [GS("Le coefficient de x doit valoir… ?", 0, "0."), GS(M("m") + " ?", m, M(m) + ".")], traps: [TR(-m, "m − " + m + " = 0 donne m = " + m + "."), TR(b, "On regarde le coefficient de x.")] }); },
      () => { const m = R.int(2, 6), x = R.int(2, 6);
        return QN("Pour quelle valeur de " + M("m") + " le nombre " + M(x) + " est-il solution de " + M("mx + 3 = " + (m * x + 3)) + " ?", m, "On remplace " + M("x = " + x) + " : " + M(x + "m + 3 = " + (m * x + 3)) + ", donc " + M("m = " + m) + ".", { ctx: "solution", guide: [GS(M(x + "m") + " = ?", m * x, M(m * x) + "."), GS(M("m") + " ?", m, M(m) + ".")], traps: [TR(m * x, "Divise par " + x + "."), TR(x, "On cherche m, pas x.")] }); },
      () => { const m = nz(-5, 5), k = R.int(2, 6);
        return QN("Résous " + M("(m + 1)x = " + k + "(m + 1)") + " pour " + M("m = " + m) + (m === -1 ? " " : "") + ". Que vaut " + M("x") + " ?", k, M("m + 1 = " + (m + 1)) + " ≠ 0 : on divise, " + M("x = " + k) + ".", { ctx: "simple", guide: [GS(M("m + 1") + " ?", m + 1, M(m + 1) + "."), GS(M("x") + " ?", k, M(k) + ".")], traps: [TR(k * (m + 1), "Divise les deux membres par m + 1.")] }); },
    ],
    2: [
      () => { const k = R.int(2, 7);
        return QN("Pour quelle valeur positive de " + M("m") + " l'équation " + M("x^2 + mx + " + k * k + " = 0") + " a-t-elle une seule solution ?", 2 * k, M("\\Delta = m^2 - " + 4 * k * k + " = 0 \\iff m = \\pm " + 2 * k) + ".", { ctx: "delta-nul", guide: [GS(M("m^2") + " ?", 4 * k * k, M(4 * k * k) + "."), GS(M("m") + " (positif) ?", 2 * k, M(2 * k) + ".")], traps: [TR(k, "Δ = m² − 4 · " + k * k + "."), TR(4 * k * k, "N'oublie pas la racine.")] }); },
      () => { const a = R.int(2, 5), b = R.int(1, 8);
        return QN("Pour quelle valeur de " + M("m") + " l'équation " + M(a + "x + m = " + a + "x + " + b) + " a-t-elle une infinité de solutions ?", b, "Les x s'annulent : " + M("m = " + b) + " donne une égalité toujours vraie.", { ctx: "infinite", guide: [GS(M("m") + " ?", b, M(b) + ".")], traps: [TR(0, "Il faut m = " + b + " pour que l'égalité soit vraie pour tout x."), TR(b / a, "Les x s'annulent : m = " + b + ".")] }); },
      () => { const m = R.int(2, 6), x0 = R.int(1, 5), c = m * x0 * x0 - x0;
        return QN("Le nombre " + M(x0) + " est solution de " + M("mx^2 - x = " + c) + ". Calcule " + M("m") + ".", m, M("m \\cdot " + x0 * x0 + " - " + x0 + " = " + c) + ", donc " + M("m = " + m) + ".", { ctx: "deg2", guide: [GS(M(x0 * x0 + "m") + " ?", m * x0 * x0, M(m * x0 * x0) + "."), GS(M("m") + " ?", m, M(m) + ".")], traps: [TR((c + x0) / x0, "x² = " + x0 * x0 + ".")] }); },
    ],
    3: [
      () => { const k = R.int(1, 6);
        return QN("Pour quelle valeur de " + M("m") + " l'équation " + M("(m^2 - " + k * k + ")x = m - " + k) + " a-t-elle une infinité de solutions ?", k, "Il faut " + M("m^2 - " + k * k + " = 0") + " et " + M("m - " + k + " = 0") + " : " + M("m = " + k) + ". (Pour " + M("m = -" + k) + " : " + M("0 = " + -2 * k) + ", aucune solution.)", { ctx: "infinite2", guide: [GS("Valeur positive de m annulant " + M("m^2 - " + k * k) + " ?", k, M(k) + "."), GS(M("m") + " ?", k, M(k) + " (m = −" + k + " donne une impossibilité).")], traps: [TR(-k, "Pour m = −" + k + " : 0 = " + -2 * k + ", aucune solution.")] }); },
      () => { const k = R.int(2, 6), d = pk([1, 4, 9]);
        return QN("Pour quelle valeur de " + M("m") + " les solutions de " + M("x^2 - " + 2 * k + "x + m = 0") + " sont-elles distantes de " + M(2 * Math.sqrt(d)) + " ?", k * k - d, "Solutions " + M(k + " \\pm \\sqrt{" + k * k + " - m}") + " ; écart " + M("2\\sqrt{" + k * k + " - m} = " + 2 * Math.sqrt(d)) + ", donc " + M(k * k + " - m = " + d) + ", " + M("m = " + (k * k - d)) + ".", { ctx: "ecart", guide: [GS(M(k * k + " - m") + " ?", d, M(d) + "."), GS(M("m") + " ?", k * k - d, M(k * k - d) + ".")], traps: [TR(k * k + d, k * k + " − m = " + d + "."), TR(k * k, "Δ = 0 donnerait une seule solution.")] }); },
      () => { const k = R.int(2, 8);
        return QN("Pour quelles valeurs de " + M("m") + " l'équation " + M("x^2 + " + k * k + " = m") + " a-t-elle deux solutions ? Donne la plus petite valeur entière de " + M("m") + " qui convient.", k * k + 1, M("x^2 = m - " + k * k) + " : deux solutions si " + M("m > " + k * k) + " ; plus petit entier " + M(k * k + 1) + ".", { ctx: "seuil", guide: [GS("Seuil (une seule solution) ?", k * k, M(k * k) + "."), GS("Plus petit entier ?", k * k + 1, M(k * k + 1) + ".")], traps: [TR(k * k, "m = " + k * k + " donne une seule solution (x = 0)."), TR(k, "x² = m − " + k * k + ".")] }); },
    ],
  };

  const PROBS = {
    vabs: [() => P("Sur la droite des nombres, A = −3 et B = 5.", [["a) Distance AB", 8], ["b) Abscisse du milieu", 1], ["c) Nombre d'entiers x avec |x − 1| ≤ 4", 9]], ["|5 − (−3)|.", "De −3 à 5."], "a) 8 ; b) 1 ; c) de −3 à 5 : 9.")],
    ratden: [() => P("A = 6/√3 et B = 1/(2 − √3).", [["a) A² ", 12], ["b) Dénominateur de B après conjugué", 1], ["c) B − √3", 2]], ["A = 2√3.", "(2 − √3)(2 + √3) = 1."], "a) 12 ; b) 1 ; c) B = 2 + √3, donc 2.")],
    fracrat: [() => P("F(x) = (x² − 9)/(x² + 3x).", [["a) Nombre de valeurs interdites", 2], ["b) F(1) (fraction)", -2], ["c) F(3)", 0]], ["x(x + 3).", "F(x) = (x − 3)/x pour x ≠ −3."], "a) 0 et −3 ; b) −2 ; c) 0.")],
    valint: [() => P("f(x) = 1/(x² − 4x).", [["a) Plus petite valeur interdite", 0], ["b) Plus grande", 4], ["c) f(2) (fraction)", -1 / 4]], ["x(x − 4).", "4 − 8 = −4."], "a) 0 ; b) 4 ; c) " + M("-\\frac{1}{4}") + ".")],
    eqparam: [() => P("Équation x² − 6x + m = 0.", [["a) m pour une seule solution", 9], ["b) Solution alors", 3], ["c) Plus grand entier m avec deux solutions", 8]], ["Δ = 36 − 4m.", "Δ > 0 ⇔ m < 9."], "a) 9 ; b) 3 ; c) 8.")],
  };

  const ALL = { vabs: VA, ratden: RD, fracrat: FR, valint: VI, eqparam: EP };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    vabs: "|a| est la distance de a à zéro ; |a − b| est la distance entre a et b. |X| = d donne deux cas : X = d ou X = −d.",
    ratden: "Multiplie haut et bas par √m ; avec a ± √m, multiplie par le conjugué : (a + √m)(a − √m) = a² − m.",
    fracrat: "Factorise numérateur et dénominateur (mise en évidence, identités, trinôme), puis simplifie les facteurs communs (jamais terme à terme).",
    valint: "Valeurs interdites : celles qui annulent un dénominateur. Factorise le dénominateur ; n'oublie aucun facteur.",
    eqparam: "Coefficient de x nul : aucune ou une infinité de solutions. Au 2e degré : Δ = 0 (une), Δ > 0 (deux), Δ < 0 (aucune).",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    vabs: ["Calculer, distance", "Équations, compter des entiers", "Équations à deux cas, aucune solution"],
    ratden: ["Dénominateur √m", "Conjugué, sommes", "Sommes de conjugués, simplifications"],
    fracrat: ["Simplifier (trinôme, différence de carrés)", "Facteur commun, opposé", "Une seule fraction, produits"],
    valint: ["Une ou deux valeurs", "Trinôme, sommes, mise en évidence", "Degré 3, Δ < 0, fraction étagée"],
    eqparam: ["Aucune solution, paramètre par une solution", "Δ = 0, infinité, degré 2", "Infinité, écart des solutions, seuil"],
  });
})();

// Chantier MP 2e (20.11 : « tout le dev MP2 », les classes MP2C et MP2D de l'auteur deviennent bêta-testeuses),
// calé sur le cours CFPT (plans_mp2.py) : A. fonctions affines (droites, droitesinter) et réciproque d'une fonction
// affine (recipaff, notion nouvelle) ; B. trigonométrie (trigcercle, trigfn, sinlaw, trigeq, trigassoc, trigeq2, triaire) ;
// C. analyse de données (statfreq, stats, quartiles). Niveau maturité professionnelle :
// méthodes guidées, nombres simples. Standard du chantier : ≥ 3 formes par niveau, pas à pas partout, erreurs typiques,
// étiquette ctx, défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(6);
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(r6(v)); return Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(r6(v)).replace(".", "{,}"); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const pT = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  // y = mx + h en TeX et en saisie
  const linT = (m, h) => (m === 0 ? fT(h) : (m === 1 ? "" : m === -1 ? "-" : fT(m)) + "x" + (h ? sg(h) : ""));
  const linE = (m, h) => (m === 0 ? fS(h) : (m === 1 ? "" : m === -1 ? "-" : fS(m) + "*") + "x" + (h ? (h < 0 ? "-" : "+") + fS(Math.abs(h)) : ""));
  const linD = (m, h) => (m === 1 ? "" : m === -1 ? "-" : N(m)) + "x" + (h ? (h < 0 ? " - " + N(-h) : " + " + N(h)) : ""); // coefficients décimaux (contextes)
  const C = (v) => (Number.isInteger(r6(v)) ? N(v) : r6(v).toFixed(2).replace(".", "{,}")); // CHF
  const pt = (x, y) => M("(" + fT(x) + " \\,;\\, " + fT(y) + ")");
  // ---------- constructeurs (même modèle que ch1c_sys.js) ----------
  const pairS = (vals) => vals.map(fS).join(" ; ");
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { const c = pairS(tr.spec.values); try { if (seen.has(c) || !tr.spec.values.every(isFinite) || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; } seen.add(c); return true; }
    return isFinite(tr.v) && spec.kind === "value" && Math.abs(tr.v - spec.value) > 1e-6 * Math.max(1, Math.abs(spec.value)); }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
  // Valeurs non arrondies dans les spécifications (20.11) : arrondir π/4 ou √3/2 au millionième rendait la réponse
  // exacte « très proche » au lieu de juste. r6 seulement pour l'affichage.
  const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value: value }, o.round ? { round: o.round } : {}), sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals.slice() }, sol, Object.assign({ canon: pairS(vals) }, o));
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const G = (ask, value, sol) => GS(ask, value, sol);
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.slice() }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TR = (v, m) => TRAP(v, m);
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.slice() }, m });
  const TX = (e, m) => ({ e, m });
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const PAIR = " Réponds « x ; y ».";
  const Y = " Écris « y = … ».";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam", "Léa", "Tom"]);
  const PL = (fns, pts, o = {}) => FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  const slopes = [2, -2, 3, -3, 1, -1, 0.5, -0.5];

  // ===================== A1. droites : pente, équation, parallèles et perpendiculaires =====================
  const DR = {
    1: [
      () => { const x1 = R.int(-4, 1), x2 = x1 + R.int(1, 4), m = pk([2, -2, 3, -1, 0.5, -0.5, 1.5, -3]), y1 = R.int(-4, 4), y2 = r6(y1 + m * (x2 - x1)); if (!Number.isInteger(y2)) return null;
        return QN("Calcule la pente de la droite qui passe par " + M("A(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + "." + (den(m) > 1 ? " (fraction acceptée)" : ""), m,
          M("m = \\frac{y_B - y_A}{x_B - x_A} = \\frac{" + y2 + " - " + pT(y1) + "}{" + x2 + " - " + pT(x1) + "} = \\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "}" + (fT(m) === "\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "}" ? "" : " = " + fT(m))) + ".",
          { ctx: "pente", fig: PL([], [[x1, y1, "A"], [x2, y2, "B"]], { yr: [-8, 8], squash: 0.7 }), guide: [G("Variation verticale " + M("y_B - y_A") + " ?", y2 - y1, M(y2 + " - " + pT(y1) + " = " + (y2 - y1)) + "."), G("Variation horizontale " + M("x_B - x_A") + " ?", x2 - x1, M(x2 - x1) + "."), G("Pente ?", m, M("\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + fT(m)) + ".")],
            traps: [TR((x2 - x1) / (y2 - y1), "La pente, c'est le vertical sur l'horizontal (Δy ÷ Δx)."), TR(-m, "Attention à l'ordre : y_B − y_A et x_B − x_A, dans le même ordre.")] }); },
      () => { const m = pk([1, -1, 2, -2, 0.5, -0.5]), h = R.int(-3, 3), xs = [-2, 0, 2, 4].filter((x) => Number.isInteger(m * x + h) && Math.abs(m * x + h) <= 5);
        return QX("Lis sur le graphique l'équation de la droite (ordonnée à l'origine et pente)." + Y, linE(m, h), "La droite coupe l'axe vertical en " + M(h) + " : " + M("h = " + h) + ". En avançant de 1 vers la droite, elle " + (m > 0 ? "monte" : "descend") + " de " + M(fT(Math.abs(m))) + " : " + M("m = " + fT(m)) + ". " + M("y = " + linT(m, h)) + ".",
          { ctx: "lecture", fig: PL([{ f: (x) => m * x + h }], xs.map((x) => [x, m * x + h])), guide: [G("Ordonnée à l'origine (où la droite coupe l'axe vertical) ?", h, M(h) + "."), G("Pente (de combien monte-t-elle quand x augmente de 1 ?)", m, M(fT(m)) + "."), GX("Équation ?", linE(m, h), M("y = " + linT(m, h)) + ".")],
            traps: [TX(linE(h || 1, m), "La pente multiplie x ; l'ordonnée à l'origine est le terme seul."), TX(linE(-m, h), "La droite " + (m > 0 ? "monte" : "descend") + " : la pente est " + (m > 0 ? "positive." : "négative."))] }); },
      () => { const m = nz(-3, 3), h = nz(-5, 5), x1 = R.int(-3, 0), x2 = x1 + R.int(1, 3), y1 = m * x1 + h, y2 = m * x2 + h;
        return QX("Donne l'équation de la droite passant par " + M("A(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + "." + Y, linE(m, h), "Pente " + M("m = \\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + m) + " ; avec A : " + M(y1 + " = " + m + " \\cdot " + pT(x1) + " + h") + ", donc " + M("h = " + h) + ". " + M("y = " + linT(m, h)) + ".",
          { ctx: "deux-points", fig: PL([], [[x1, y1, "A"], [x2, y2, "B"]], { yr: [-9, 9], squash: 0.7 }), guide: [G("Pente " + M("m") + " ?", m, M("\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + m) + "."), G("Avec le point A : " + M(y1 + " = " + m + " \\cdot " + pT(x1) + " + h") + ". " + M("h") + " = ?", h, M("h = " + y1 + sg(-m * x1) + " = " + h) + "."), GX("Équation ?", linE(m, h), M("y = " + linT(m, h)) + ".")],
            traps: [TX(linE(m, y1), "h n'est pas l'ordonnée de A : h est la valeur de y quand x = 0."), TX(linE(1 / m, h), "Pente = Δy ÷ Δx.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 4), b = nz(-5, 5), px = nz(-3, 3), py = R.int(-5, 5), h = py - a * px; if (h === b) return null;
        return QX("Donne l'équation de la droite parallèle à " + M("y = " + linT(a, b)) + " qui passe par " + M("P(" + px + " \\,;\\, " + py + ")") + "." + Y, linE(a, h), "Parallèle : même pente " + M(a) + ". " + M(py + " = " + a + " \\cdot " + pT(px) + " + h") + " donne " + M("h = " + h) + ". " + M("y = " + linT(a, h)) + ".",
          { ctx: "parallele", guide: [G("Deux droites parallèles ont la même pente. Pente ?", a, M(a) + "."), G("Avec P : " + M(py + " = " + a + " \\cdot " + pT(px) + " + h") + ". " + M("h") + " = ?", h, M(h) + "."), GX("Équation ?", linE(a, h), M("y = " + linT(a, h)) + ".")],
            traps: [TX(linE(a, b), "C'est la droite de départ ; il faut qu'elle passe par P."), TX(linE(-1 / a, h), "Parallèle = même pente (−1/a, c'est pour perpendiculaire).")] }); },
      () => { const a = pk([2, -2, 3, -3, 0.5, -0.5, 1, -1]), b = nz(-4, 4), mp = -1 / a, px = pk([-4, -2, 2, 4, 6].filter((x) => Number.isInteger(mp * x))), py = R.int(-4, 4), h = r6(py - mp * px); if (px === undefined || !Number.isInteger(h)) return null;
        return QX("Donne l'équation de la droite perpendiculaire à " + M("y = " + linT(a, b)) + " qui passe par " + M("P(" + px + " \\,;\\, " + py + ")") + "." + Y + (den(mp) > 1 ? " (fractions acceptées)" : ""), linE(mp, h), "Perpendiculaire : pente " + M("-\\frac{1}{" + fT(a) + "} = " + fT(mp)) + ". " + M(py + " = " + fT(mp) + " \\cdot " + pT(px) + " + h") + " donne " + M("h = " + h) + ". " + M("y = " + linT(mp, h)) + ".",
          { ctx: "perpendiculaire", guide: [G("Perpendiculaire : pente " + M("-\\frac{1}{a}") + ". Pente ?", mp, M(fT(mp)) + " (le produit des pentes vaut −1)."), G("Avec P, " + M("h") + " = ?", h, M(h) + "."), GX("Équation ?", linE(mp, h), M("y = " + linT(mp, h)) + ".")],
            traps: [TX(linE(1 / a, r6(py - px / a)), "Il faut aussi changer le signe : −1/a."), TX(linE(-a, py + a * px), "Ce n'est pas −a, mais −1/a (l'inverse, et le signe opposé).")] }); },
      () => { const a = pk([2, -2, 3, -3, 4, -4, 0.5, -0.5, 1.5]), k = r6(-1 / a);
        return QN("Pour quelle valeur de " + M("k") + " la droite " + M("y = kx + 1") + " est-elle perpendiculaire à " + M("y = " + linT(a, pk([-3, 2, 5]))) + " ? (fraction acceptée)", k, "Deux droites sont perpendiculaires quand le produit de leurs pentes vaut −1 : " + M(fT(a) + " \\cdot k = -1") + ", " + M("k = " + fT(k)) + ".",
          { ctx: "parametre", guide: [G("Produit des pentes de deux perpendiculaires ?", -1, "−1."), G(M(fT(a) + " \\cdot k = -1") + " : " + M("k") + " = ?", k, M(fT(k)) + ".")], traps: [TR(a, "Même pente : ce serait parallèle."), TR(1 / a, "Le produit des pentes doit valoir −1 : attention au signe."), TR(-a, "Ce n'est pas l'opposé, c'est −1/a.")] }); },
    ],
    3: [
      () => { const x0 = nz(-4, 4), y0 = nz(-4, 4), a1 = nz(-3, 3), b1 = nz(-3, 3), a2 = nz(-3, 3), b2 = nz(-3, 3); if (a1 * b2 - a2 * b1 === 0) return null; const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
        const eq = (a, b, c) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "y = " + c;
        return QP("Donne le point d'intersection des droites " + M(eq(a1, b1, c1)) + " et " + M(eq(a2, b2, c2)) + "." + PAIR, [x0, y0], "On résout le système (combinaison ou substitution) : " + M("x = " + x0) + ", " + M("y = " + y0) + ". Point " + pt(x0, y0) + ".",
          { ctx: "systeme", guide: [G("Élimine " + M("y") + " (ou " + M("x") + ") en combinant les deux équations. " + M("x") + " = ?", x0, M("x = " + x0) + "."), G("Remplace dans une équation : " + M("y") + " = ?", y0, M("y = " + y0) + "."), GP("Point ?", [x0, y0], pt(x0, y0) + ".")],
            traps: [TP([y0, x0], "Le point s'écrit (x ; y), dans cet ordre."), TP([x0, -y0], "Vérifie dans les deux équations.")] }); },
      () => { const m = nz(-3, 3), h = nz(-5, 5), x1 = R.int(-3, 0), x2 = x1 + R.int(2, 4), y1 = m * x1 + h, y2 = m * x2 + h, xp = pk([5, 6, -5, 8].filter((x) => x !== x1 && x !== x2)), v = m * xp + h;
        return QN("Le point " + M("P(" + xp + " \\,;\\, y)") + " est sur la droite qui passe par " + M("A(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + ". Que vaut " + M("y") + " ?", v, "Pente " + M(m) + ", " + M("h = " + h) + " : " + M("y = " + linT(m, h)) + ". En " + M("x = " + xp) + " : " + M("y = " + v) + ".",
          { ctx: "point-sur-droite", guide: [G("Pente de (AB) ?", m, M(m) + "."), G("Ordonnée à l'origine " + M("h") + " ?", h, M(h) + "."), G(M("y") + " en " + M("x = " + xp) + " ?", v, M(m + " \\cdot " + pT(xp) + sg(h) + " = " + v) + ".")],
            traps: [TR(m * xp, "N'oublie pas l'ordonnée à l'origine " + h + "."), TR(xp + h, "On multiplie x par la pente.")] }); },
      () => { if (R.rand() < 0.5) { const L0 = R.int(15, 30), r = pk([0.5, 1.5, 2, 2.5]);
          return QX("Une bougie de " + M(L0) + " cm raccourcit de " + M(N(r)) + " cm par heure. Écris sa hauteur " + M("y") + " (en cm) en fonction du temps " + M("x") + " (en heures)." + Y, linE(-r, L0), "Hauteur de départ " + M(L0) + " (ordonnée à l'origine), diminution de " + M(N(r)) + " par heure (pente négative) : " + M("y = " + linD(-r, L0)) + ".",
            { ctx: "bougie", guide: [G("Hauteur au départ (" + M("x = 0") + ") ?", L0, M(L0) + " cm."), G("Pente (variation par heure, avec son signe) ?", -r, M(N(-r)) + " : la hauteur diminue."), GX("Équation ?", linE(-r, L0), M("y = " + linD(-r, L0)) + ".")], traps: [TX(linE(r, L0), "La bougie raccourcit : la pente est négative."), TX(linE(L0, -r), "La hauteur de départ est le terme constant.")] }); }
        const m = pk([1.5, 2.2, 2.5, 2.8, 3]), b0 = pk([5, 6, 7, 8]);
        return QX("Un taxi facture une prise en charge de " + M(b0) + " CHF, puis " + M(N(m)) + " CHF par km. Écris le prix " + M("y") + " (en CHF) en fonction du nombre de km " + M("x") + "." + Y, linE(m, b0), "Partie fixe " + M(b0) + " (ordonnée à l'origine), " + M(N(m)) + " par km (pente) : " + M("y = " + linD(m, b0)) + ".",
          { ctx: "taxi", guide: [G("Prix pour 0 km (ordonnée à l'origine) ?", b0, M(b0) + " CHF."), G("Pente (prix par km) ?", m, M(N(m)) + "."), GX("Équation ?", linE(m, b0), M("y = " + linD(m, b0)) + ".")], traps: [TX(linE(b0, m), "La prise en charge est le terme constant ; le prix par km multiplie x."), TX(linE(r6(m + b0), 0), "Le prix fixe ne se multiplie pas par les km.")] }); },
    ],
  };

  // ===================== A2. droitesinter : intersection de droites, problèmes =====================
  const DI = {
    1: [
      () => { const x0 = nz(-4, 4), y0 = R.int(-5, 5), m1 = nz(-3, 3), m2 = nz(-3, 3); if (m1 === m2) return null; const h1 = y0 - m1 * x0, h2 = y0 - m2 * x0;
        return QP("Détermine le point d'intersection des droites " + M("y = " + linT(m1, h1)) + " et " + M("y = " + linT(m2, h2)) + "." + PAIR, [x0, y0], "On égalise : " + M(linT(m1, h1) + " = " + linT(m2, h2)) + ", " + M((m1 - m2) + "x = " + (h2 - h1)) + ", " + M("x = " + x0) + " ; " + M("y = " + y0) + ". Point " + pt(x0, y0) + ".",
          { ctx: "egaliser", guide: [G("On égalise les deux expressions et on regroupe : " + M((m1 - m2) + "x = " + (h2 - h1)) + ". " + M("x") + " = ?", x0, M(x0) + "."), G(M("y") + " (dans une des deux équations) ?", y0, M(m1 + " \\cdot " + pT(x0) + sg(h1) + " = " + y0) + "."), GP("Point ?", [x0, y0], pt(x0, y0) + ".")],
            traps: [TP([y0, x0], "Le point s'écrit (x ; y)."), TP([x0, m1 * x0 - h1], "Calcule y avec la bonne ordonnée à l'origine.")] }); },
      () => { const m = pk([2, -2, 3, -3, 0.5, -0.5, 4]), h = nz(-6, 6), x0 = r6(-h / m); if (!Number.isInteger(x0 * 2)) return null; const ax = pk(["x", "y"]);
        return ax === "x"
          ? QP("En quel point la droite " + M("y = " + linT(m, h)) + " coupe-t-elle l'axe des abscisses ?" + PAIR + " (fractions acceptées)", [x0, 0], "Sur l'axe des abscisses, " + M("y = 0") + " : " + M(linT(m, h) + " = 0") + ", " + M("x = " + fT(x0)) + ". Point " + pt(x0, 0) + ".", { ctx: "axe-x", guide: [G("Sur l'axe des abscisses, que vaut " + M("y") + " ?", 0, "0."), G("On résout " + M(linT(m, h) + " = 0") + ". " + M("x") + " = ?", x0, M(fT(x0)) + "."), GP("Point ?", [x0, 0], pt(x0, 0) + ".")], traps: [TP([0, h], "Ça, c'est l'intersection avec l'axe des ordonnées (x = 0)."), TP([-x0, 0], "Attention au signe en isolant x.")] })
          : QP("En quel point la droite " + M("y = " + linT(m, h)) + " coupe-t-elle l'axe des ordonnées ?" + PAIR, [0, h], "Sur l'axe des ordonnées, " + M("x = 0") + " : " + M("y = " + h) + ". Point " + pt(0, h) + ".", { ctx: "axe-y", guide: [G("Sur l'axe des ordonnées, que vaut " + M("x") + " ?", 0, "0."), G(M("y") + " ?", h, M(h) + " (l'ordonnée à l'origine)."), GP("Point ?", [0, h], pt(0, h) + ".")], traps: [TP([h, 0], "Sur l'axe vertical, x = 0 : le point est (0 ; " + h + ")."), TP([x0, 0], "Ça, c'est l'intersection avec l'axe des abscisses.")] }); },
      () => { const m = nz(-3, 3), h = nz(-5, 5), k = R.int(-6, 6), x0 = r6((k - h) / m); if (!Number.isInteger(x0)) return null;
        return QP("La droite " + M("y = " + linT(m, h)) + " coupe la droite horizontale " + M("y = " + k) + " en quel point ?" + PAIR, [x0, k], M(linT(m, h) + " = " + k) + " donne " + M("x = " + x0) + ". Point " + pt(x0, k) + ".",
          { ctx: "horizontale", guide: [G("Sur la droite horizontale, " + M("y = " + k) + ". On résout " + M(linT(m, h) + " = " + k) + " : " + M("x") + " = ?", x0, M(x0) + "."), GP("Point ?", [x0, k], pt(x0, k) + ".")], traps: [TP([k, x0], "Le point s'écrit (x ; y)."), TP([x0, m * k + h], "Sur la droite y = " + k + ", l'ordonnée vaut " + k + ".")] }); },
    ],
    2: [
      () => { const a = R.int(10, 40), pa = pk([0.5, 1, 1.5, 2]), b = a + R.int(10, 40), pb = r6(pa - pk([0.25, 0.5, 1])), x0 = r6((b - a) / (pa - pb)); if (pb <= 0 || !Number.isInteger(x0) || x0 > (pa > 1.2 ? 60 : 200)) return null; const y0 = r6(a + pa * x0);
        const c = pk([["Location de voiture : offre A, " + M(a) + " CHF plus " + M(N(pa)) + " CHF par km ; offre B, " + M(b) + " CHF plus " + M(N(pb)) + " CHF par km.", "km", "location"], ["Salle de sport : formule A, " + M(a) + " CHF d'inscription plus " + M(N(pa)) + " CHF par séance ; formule B, " + M(b) + " CHF plus " + M(N(pb)) + " CHF par séance.", "séances", "sport"]]);
        return QN(c[0] + " Pour combien de " + c[1] + " les deux offres coûtent-elles la même chose ?", x0, M("y = " + N(a) + " + " + N(pa) + "x") + " et " + M("y = " + N(b) + " + " + N(pb) + "x") + " : on égalise, " + M(N(r6(pa - pb)) + "x = " + (b - a)) + ", " + M("x = " + x0) + " (prix commun : " + M(N(y0)) + " CHF).",
          { ctx: "offres-" + c[2], guide: [G("On égalise " + M(N(a) + " + " + N(pa) + "x = " + N(b) + " + " + N(pb) + "x") + ". Après regroupement, coefficient de " + M("x") + " ?", r6(pa - pb), M(N(r6(pa - pb))) + "."), G(M("x") + " = ?", x0, M((b - a) + " \\div " + N(r6(pa - pb)) + " = " + x0) + ".")],
            traps: [TR(r6((b + a) / (pa - pb)), "On soustrait les parties fixes : " + b + " − " + a + "."), TR(y0, "C'est le prix commun ; on demande le nombre de " + c[1] + ".")] }); },
      () => { const x0 = nz(-3, 3), y0 = nz(-4, 4), m1 = nz(-2, 2), m2 = nz(-3, 3); if (m1 === m2) return null; const h1 = y0 - m1 * x0, h2 = y0 - m2 * x0, ax = x0 - 2, bx = x0 + 1;
        return QP("La droite " + M("d") + " passe par " + M("A(" + ax + " \\,;\\, " + (m1 * ax + h1) + ")") + " et " + M("B(" + bx + " \\,;\\, " + (m1 * bx + h1) + ")") + ". Où coupe-t-elle la droite " + M("y = " + linT(m2, h2)) + " ?" + PAIR, [x0, y0], "Équation de " + M("d") + " : " + M("y = " + linT(m1, h1)) + ". On égalise : " + M("x = " + x0) + ", " + M("y = " + y0) + ".",
          { ctx: "deux-points-inter", guide: [GX("Équation de " + M("d") + " (« y = … ») ?", linE(m1, h1), M("y = " + linT(m1, h1)) + "."), G("On égalise : " + M("x") + " = ?", x0, M(x0) + "."), GP("Point ?", [x0, y0], pt(x0, y0) + ".")], traps: [TP([y0, x0], "Le point s'écrit (x ; y).")] }); },
      () => { const ax = R.int(-5, 1) * 2, ay = R.int(-4, 2) * 2, bx = ax + pk([2, 4, 6]), by = ay + pk([2, 4, -2, -4]), mx = (ax + bx) / 2, my = (ay + by) / 2, m = (by - ay) / (bx - ax), mp = r6(-1 / m), h = r6(my - mp * mx); if (!isFinite(mp)) return null;
        return QX("Soit " + M("A(" + ax + " \\,;\\, " + ay + ")") + " et " + M("B(" + bx + " \\,;\\, " + by + ")") + ". Donne l'équation de la médiatrice de " + M("[AB]") + " (la perpendiculaire à " + M("(AB)") + " qui passe par son milieu)." + Y + " (fractions acceptées)", linE(mp, h), "Milieu " + pt(mx, my) + " ; pente de (AB) " + M(fT(m)) + ", donc pente de la médiatrice " + M(fT(mp)) + " ; " + M("y = " + linT(mp, h)) + ".",
          { ctx: "mediatrice", guide: [GP("Milieu de [AB] ?", [mx, my], pt(mx, my) + " (moyenne des coordonnées)."), G("Pente de (AB) ?", m, M(fT(m)) + "."), G("Pente de la médiatrice (perpendiculaire) ?", mp, M(fT(mp)) + "."), GX("Équation ?", linE(mp, h), M("y = " + linT(mp, h)) + ".")],
            traps: [TX(linE(m, r6(my - m * mx)), "La médiatrice est perpendiculaire à (AB) : pente −1/m."), TX(linE(mp, r6(ay - mp * ax)), "Elle passe par le milieu de [AB], pas par A.")] }); },
    ],
    3: [
      () => { const m1 = pk([1, 2, 0.5]), h1 = R.int(1, 4), m2 = -pk([1, 2, 0.5]), h2 = R.int(5, 10), x0 = r6((h2 - h1) / (m1 - m2)), y0 = r6(m1 * x0 + h1), xa = r6(-h1 / m1), xb = r6(-h2 / m2), A = r6(Math.abs(xb - xa) * y0 / 2); if (!Number.isInteger(x0 * 2) || y0 <= 0) return null;
        return QN("Les droites " + M("y = " + linT(m1, h1)) + " et " + M("y = " + linT(m2, h2)) + " forment avec l'axe des abscisses un triangle. Calcule son aire.", A, "Sommets sur l'axe : " + pt(xa, 0) + " et " + pt(xb, 0) + " (base " + M(N(Math.abs(xb - xa))) + ") ; sommet du haut " + pt(x0, y0) + " (hauteur " + M(N(y0)) + "). Aire " + M("\\frac{" + N(Math.abs(xb - xa)) + " \\cdot " + N(y0) + "}{2} = " + N(A)) + ".",
          { ctx: "aire-triangle", fig: PL([{ f: (x) => m1 * x + h1 }, { f: (x) => m2 * x + h2 }], [], { xr: [-8, 12], yr: [-2, 10] }), guide: [G("Où la première droite coupe-t-elle l'axe des abscisses (" + M("x") + ") ?", xa, M(fT(xa)) + "."), G("Et la seconde ?", xb, M(fT(xb)) + "."), G("Ordonnée du point d'intersection des deux droites (la hauteur) ?", y0, M(N(y0)) + "."), G("Aire ?", A, M("\\frac{\\text{base} \\cdot \\text{hauteur}}{2} = " + N(A)) + ".")],
            traps: [TR(r6(Math.abs(xb - xa) * y0), "N'oublie pas de diviser par 2."), TR(r6(Math.abs(xb - xa) * x0 / 2), "La hauteur est l'ordonnée (y) du sommet, pas son abscisse.")] }); },
      () => { const v1 = pk([12, 15, 18, 20]), v2 = pk([4, 5, 6]), d = pk([30, 42, 48, 60, 63, 66, 72]), t = r6(d / (v1 + v2)); if (!Number.isInteger(t * 4)) return null; const c = pk([["Deux cyclistes", "km/h", "km", "se croisent"], ["Deux randonneurs (l'un à vélo, l'autre à pied)", "km/h", "km", "se rencontrent"]]);
        return QN(c[0] + " partent en même temps de deux villages distants de " + M(d) + " " + c[2] + " et roulent l'un vers l'autre, à " + M(v1) + " et " + M(v2) + " " + c[1] + ". Au bout de combien d'heures " + c[3] + "-ils ? (décimal ou fraction)", t, "Positions " + M("y = " + v1 + "x") + " et " + M("y = " + d + " - " + v2 + "x") + " ; on égalise : " + M((v1 + v2) + "x = " + d) + ", " + M("x = " + fT(t)) + " h.",
          { ctx: "rencontre", guide: [GX("Position du premier (en " + c[2] + " depuis son village) après " + M("x") + " heures : « y = … » ?", v1 + "*x", M("y = " + v1 + "x") + "."), GX("Position du second, mesurée depuis le même village ?", d + "-" + v2 + "*x", M("y = " + d + " - " + v2 + "x") + "."), G("On égalise : " + M("x") + " = ?", t, M(d + " \\div " + (v1 + v2) + " = " + fT(t)) + " h.")],
            traps: [TR(r6(d / (v1 - v2)), "Ils vont l'un vers l'autre : la distance diminue de " + v1 + " + " + v2 + " km par heure."), TR(r6(d / v1), "Les deux bougent : il faut égaliser leurs positions.")] }); },
      () => { const ax = R.int(-4, 0), ay = R.int(-3, 1), bx = ax + R.int(4, 7), by = ay + pk([-1, 1, 2]), cx = ax + R.int(1, 3), cy = ay + R.int(4, 6), m = (by - ay) / (bx - ax), mp = r6(-1 / m), h = r6(cy - mp * cx); if (by === ay || !Number.isInteger(mp * 2) || !Number.isInteger(h * 2)) return null;
        return QX("Dans le triangle " + M("ABC") + " avec " + M("A(" + ax + " \\,;\\, " + ay + ")") + ", " + M("B(" + bx + " \\,;\\, " + by + ")") + " et " + M("C(" + cx + " \\,;\\, " + cy + ")") + ", donne l'équation de la hauteur issue de " + M("C") + " (perpendiculaire à " + M("(AB)") + " passant par " + M("C") + ")." + Y + " (fractions acceptées)", linE(mp, h), "Pente de (AB) " + M(fT(m)) + " ; hauteur : pente " + M(fT(mp)) + ", passe par C : " + M("y = " + linT(mp, h)) + ".",
          { ctx: "hauteur", guide: [G("Pente de (AB) ?", m, M(fT(m)) + "."), G("Pente de la hauteur (perpendiculaire) ?", mp, M(fT(mp)) + "."), G("Avec C, " + M("h") + " = ?", h, M(fT(h)) + "."), GX("Équation ?", linE(mp, h), M("y = " + linT(mp, h)) + ".")],
            traps: [TX(linE(m, r6(cy - m * cx)), "La hauteur est perpendiculaire à (AB), pas parallèle."), TX(linE(mp, r6(ay - mp * ax)), "La hauteur issue de C passe par C.")] }); },
    ],
  };

  // ===================== A3. recipaff : réciproque d'une fonction affine (nouvelle notion MP 2e) =====================
  const RF = {
    1: [
      () => { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-9, 9), x0 = nz(-6, 6), y = a * x0 + b;
        return QN("Soit " + M("f(x) = " + linT(a, b)) + ". Calcule " + M("f^{-1}(" + y + ")") + ".", x0, M("f^{-1}(" + y + ")") + " est le nombre " + M("x") + " tel que " + M("f(x) = " + y) + " : " + M(linT(a, b) + " = " + y) + ", " + M(a + "x = " + (y - b)) + ", " + M("x = " + x0) + ".",
          { ctx: "valeur", guide: [G("On résout " + M(linT(a, b) + " = " + y) + ". D'abord " + M(a + "x") + " = ?", y - b, M(y - b) + "."), G(M("x") + " = ?", x0, M(x0) + ".")],
            traps: [TR(a * y + b, "Ça, c'est f(" + y + ") ; la réciproque fait le chemin inverse."), TR(r6((y + b) / a), "On retire " + b + " (opération inverse), puis on divise.")] }); },
      () => { const px = R.int(-5, 6), py = R.int(-5, 8); if (px === py) return null;
        return QP("Le point " + M("(" + px + " \\,;\\, " + py + ")") + " est sur le graphique de " + M("f") + ". Quel point est sur le graphique de " + M("f^{-1}") + " ?" + PAIR, [py, px], "La réciproque échange les rôles de x et y : " + M("f(" + px + ") = " + py) + " donne " + M("f^{-1}(" + py + ") = " + px) + ". Point " + pt(py, px) + " (symétrique par rapport à la droite " + M("y = x") + ").",
          { ctx: "point", guide: [G(M("f(" + px + ") = " + py) + ", donc " + M("f^{-1}(" + py + ")") + " = ?", px, M(px) + "."), GP("Point du graphique de " + M("f^{-1}") + " ?", [py, px], pt(py, px) + ".")], traps: [TP([px, py], "C'est le point de f ; pour la réciproque, on échange x et y."), TP([-px, -py], "On échange les coordonnées, on ne change pas les signes.")] }); },
      () => { const b = nz(-9, 9), k = pk([2, 3, 4, 5, 10]), add = R.rand() < 0.5, e = add ? "x" + sg(b) : k + "x", ex = add ? "x" + (b < 0 ? "+" + -b : "-" + b) : "x/" + k;
        return QX("Soit " + M("f(x) = " + e) + ". Quelle est l'expression de " + M("f^{-1}(x)") + " ?", ex, (add ? "f ajoute " + b + " ; la réciproque retire " + b : "f multiplie par " + k + " ; la réciproque divise par " + k) + " : " + M("f^{-1}(x) = " + (add ? "x" + sg(-b) : "\\frac{x}{" + k + "}")) + ".",
          { ctx: "simple", guide: [GX("La réciproque fait l'opération inverse. " + M("f^{-1}(x)") + " = ?", ex, M(add ? "x" + sg(-b) : "\\frac{x}{" + k + "}") + ".")], traps: [TX(add ? "x" + (b < 0 ? "-" + -b : "+" + b) : k + "*x", "C'est f elle-même."), TX(add ? "-x" + (b < 0 ? "-" + -b : "+" + b) : "1/(" + k + "*x)", "Réciproque ≠ opposé ni inverse : on défait l'opération.")] }); },
    ],
    2: [
      () => { const a = pk([2, 3, 4, 5, -2, -4]), b = nz(-8, 8), ex = linE(1 / a, r6(-b / a));
        return QX("Soit " + M("f(x) = " + linT(a, b)) + ". Donne l'expression de " + M("f^{-1}(x)") + ". (fractions acceptées)", ex, M("y = " + linT(a, b)) + " ⇔ " + M("x = \\frac{y" + sg(-b) + "}{" + a + "}") + ". En renommant : " + M("f^{-1}(x) = " + linT(1 / a, r6(-b / a))) + ".",
          { ctx: "expression", guide: [GX("On écrit " + M("y = " + linT(a, b)) + " et on isole " + M("x") + ". Après avoir retiré " + M(b) + " : " + M(a + "x") + " = ?", "y" + (b < 0 ? "+" + -b : "-" + b), M("y" + sg(-b)) + "."), GX("On divise par " + M(a) + " et on renomme " + M("y") + " en " + M("x") + " : " + M("f^{-1}(x)") + " = ?", ex, M(linT(1 / a, r6(-b / a))) + ".")],
            traps: [TX(linE(1 / a, b), "On retire " + b + " AVANT de diviser : le terme constant est aussi divisé par " + a + "."), TX(linE(-a, -b), "La réciproque n'est pas l'opposée."), TX("1/(" + linE(a, b) + ")", "La réciproque n'est pas 1/f.")] }); },
      () => { const F = pk([50, 59, 68, 77, 86, 95, 104, 14, 23, 32]), C = r6((F - 32) / 1.8), ask = pk(["valeur", "expr"]);
        return ask === "valeur"
          ? QN("Pour convertir des degrés Celsius en degrés Fahrenheit, on utilise " + M("F(c) = 1{,}8c + 32") + ". Quelle température en °C correspond à " + M(F) + " °F ?", C, "On utilise la réciproque : " + M("1{,}8c + 32 = " + F) + ", " + M("1{,}8c = " + (F - 32)) + ", " + M("c = " + N(C)) + " °C.", { ctx: "fahrenheit", guide: [G("On résout " + M("1{,}8c + 32 = " + F) + ". " + M("1{,}8c") + " = ?", F - 32, M(F - 32) + "."), G(M("c") + " = ?", C, M((F - 32) + " \\div 1{,}8 = " + N(C)) + ".")], traps: [TR(r6(1.8 * F + 32), "Ça convertit dans l'autre sens."), TR(r6(F / 1.8 - 32), "On retire 32 d'abord, puis on divise par 1,8.")] })
          : QX("Pour convertir des °C en °F, on utilise " + M("F(c) = 1{,}8c + 32") + ". Donne la fonction réciproque " + M("c(F)") + " qui convertit des °F en °C, en écrivant la variable " + M("x") + " à la place de " + M("F") + ".", "(x-32)/1.8", M("c = \\frac{F - 32}{1{,}8}") + ", soit " + M("c(x) = \\frac{x - 32}{1{,}8}") + ".", { ctx: "fahrenheit-expr", guide: [GX("On retire 32 : " + M("1{,}8c") + " = ? (en fonction de " + M("x") + ")", "x-32", M("x - 32") + "."), GX("On divise par 1,8 : " + M("c(x)") + " = ?", "(x-32)/1.8", M("\\frac{x - 32}{1{,}8}") + ".")], traps: [TX("x/1.8-32", "On retire 32 d'abord, puis on divise."), TX("1.8*x+32", "C'est la fonction de départ.")] }); },
      () => { const a = pk([2, 4, -2, 0.5]), b = nz(-6, 6), v = r6(-b / a);
        return QN("Le graphique de " + M("f^{-1}") + " est le symétrique de celui de " + M("f(x) = " + linT(a, b)) + " par rapport à la droite " + M("y = x") + ". En quelle ordonnée " + M("f^{-1}") + " coupe-t-elle l'axe vertical ? (fraction acceptée)", v, M("f") + " coupe l'axe horizontal en " + M("x = " + fT(v)) + " (" + M(linT(a, b) + " = 0") + "). Par symétrie, " + M("f^{-1}") + " coupe l'axe vertical en " + M(fT(v)) + ". (Ou : " + M("f^{-1}(0)") + " est la solution de " + M("f(x) = 0") + ".)",
          { ctx: "symetrie", fig: PL([{ f: (x) => a * x + b }, { f: (x) => x, dash: true }]), guide: [G("Où " + M("f") + " coupe-t-elle l'axe horizontal (" + M("f(x) = 0") + ") ?", v, M(fT(v)) + "."), G("La symétrie par rapport à " + M("y = x") + " échange les axes. Ordonnée cherchée ?", v, M(fT(v)) + ".")],
            traps: [TR(b, "C'est l'ordonnée à l'origine de f, pas de sa réciproque."), TR(-b, "On échange les rôles de x et y : il faut résoudre f(x) = 0.")] }); },
    ],
    3: [
      () => { const base = pk([5, 6, 6.5, 7]), pkm = pk([2.2, 2.5, 2.8, 3]), km = R.int(4, 25), tot = r6(base + pkm * km);
        return QN("Un taxi coûte " + M("p(x) = " + N(pkm) + "x + " + N(base)) + " CHF pour " + M("x") + " km. Une course a coûté " + M(C(tot)) + " CHF. Combien de km ont été parcourus ?", km, "Réciproque : " + M("x = \\frac{p - " + N(base) + "}{" + N(pkm) + "}") + " ; " + M("\\frac{" + C(tot) + " - " + N(base) + "}{" + N(pkm) + "} = " + km) + " km.",
          { ctx: "taxi", guide: [G("On retire la prise en charge : " + M(C(tot) + " - " + N(base)) + " = ?", r6(tot - base), M(N(r6(tot - base))) + " CHF."), G("On divise par " + M(N(pkm)) + " : nombre de km ?", km, M(km) + " km.")],
            traps: [TR(r6(tot / pkm), "Retire d'abord la prise en charge."), TR(r6(pkm * tot + base), "On cherche les km à partir du prix : chemin inverse.")] }); },
      () => { const a = pk([2, 3, 4, -2, -3]), b = nz(-6, 6), x1 = R.int(1, 3), x2 = x1 + R.int(1, 3), y1 = a * x1 + b, y2 = a * x2 + b; if ([0, 1, -1].includes(b)) return null;
        return QN("La fonction " + M("f") + " est affine. On sait que " + M("f(" + x1 + ") = " + y1) + " et que " + M("f^{-1}(" + y2 + ") = " + x2) + ". Que vaut " + M("f(0)") + " ?", b, M("f^{-1}(" + y2 + ") = " + x2) + " signifie " + M("f(" + x2 + ") = " + y2) + ". Pente " + M("\\frac{" + y2 + " - " + pT(y1) + "}{" + x2 + " - " + x1 + "} = " + a) + " ; " + M("f(0) = " + y1 + " - " + pT(a) + " \\cdot " + x1 + " = " + b) + ".",
          { ctx: "reconstruire", guide: [G(M("f^{-1}(" + y2 + ") = " + x2) + " signifie " + M("f(?) = " + y2) + ". Quel nombre a pour image " + M(y2) + " ?", x2, M(x2) + "."), G("Pente de " + M("f") + " ?", a, M("\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + a) + "."), G(M("f(0)") + " = ?", b, M(y1 + " - " + pT(a) + " \\cdot " + x1 + " = " + b) + ".")],
            traps: [TR(y1 - a * x2, "On repart d'un point connu : f(0) = f(" + x1 + ") − " + x1 + " · pente."), TR(r6(b + a), "f(0) est l'ordonnée à l'origine.")] }); },
      () => { const a = pk([2, 3, -1, -2, 0.5]), b = nz(-6, 6), x0 = r6(b / (1 - a)); if (!Number.isInteger(x0 * 2)) return null;
        return QP("Les graphiques de " + M("f(x) = " + linT(a, b)) + " et de " + M("f^{-1}") + " se coupent sur la droite " + M("y = x") + ". Donne leur point d'intersection." + PAIR + " (fractions acceptées)", [x0, x0], "Sur " + M("y = x") + " : " + M(linT(a, b) + " = x") + ", " + M(fT(r6(1 - a)) + "x = " + b) + ", " + M("x = " + fT(x0)) + ". Point " + pt(x0, x0) + ".",
          { ctx: "intersection-y=x", guide: [G("On résout " + M(linT(a, b) + " = x") + ". " + M("x") + " = ?", x0, M(fT(x0)) + "."), GP("Point (sur " + M("y = x") + ") ?", [x0, x0], pt(x0, x0) + ".")], traps: [TP([x0, -x0], "Sur la droite y = x, les deux coordonnées sont égales."), TP([-x0, -x0], "Attention au signe en isolant x.")] }); },
    ],
  };

  // ===================================== B. TRIGONOMÉTRIE =====================================
  const D2R = Math.PI / 180, cl = (v) => (Math.abs(v - Math.round(v * 2) / 2) < 1e-12 ? Math.round(v * 2) / 2 : v), sinD = (a) => cl(Math.sin(a * D2R)), cosD = (a) => cl(Math.cos(a * D2R)), tanD = (a) => cl(Math.tan(a * D2R));
  const QR = (q, value, sol, o) => mk(q, { kind: "value", value, radical: true }, sol, o); // valeur exacte (racines)
  const QRd = (q, value, sol, round, o) => mk(q, { kind: "value", value, round }, sol, o); // arrondi demandé
  const GR = (ask, value, sol) => ({ ask, spec: { kind: "value", value, radical: true }, sol });
  const Gd = (ask, value, sol, round) => ({ ask, spec: { kind: "value", value, round }, sol });
  const uniq = (vals) => vals.filter((v, i) => vals.findIndex((w) => Math.abs(w - v) < 1e-9) === i);
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: uniq(vals) }, sol, o);
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: uniq(vals) }, sol });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: uniq(vals) }, m });
  // valeurs exactes : texte TeX et saisie
  const EXA = { 0: ["0", "0"], 30: ["\\frac{1}{2}", "1/2"], 45: ["\\frac{\\sqrt{2}}{2}", "√2/2"], 60: ["\\frac{\\sqrt{3}}{2}", "√3/2"], 90: ["1", "1"] };
  const exT = (v) => { const a = Math.abs(v), s = v < 0 ? "-" : ""; const k = Object.keys(EXA).find((d) => Math.abs(sinD(+d) - a) < 1e-6); return k === undefined ? N(v) : s + EXA[k][0]; };
  const exE = (v) => { const a = Math.abs(v), s = v < 0 ? "-" : ""; const k = Object.keys(EXA).find((d) => Math.abs(sinD(+d) - a) < 1e-6); return k === undefined ? fS(v) : s + EXA[k][1]; };
  const ref = (a) => { a = ((a % 360) + 360) % 360; return a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a; };
  const quad = (a) => (a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4);
  const radTeX = (deg) => { const g = gcd(deg, 180), n = deg / g, d = 180 / g; if (n === 0) return "0"; const num = (n === 1 ? "" : n) + "\\pi"; return d === 1 ? num : "\\frac{" + num + "}{" + d + "}"; };
  const radE = (deg) => { const g = gcd(deg, 180), n = deg / g, d = 180 / g; return (n === 1 ? "" : n) + "π" + (d === 1 ? "" : "/" + d); };
  const NICE = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];

  // ===================== B1. trigcercle : radians, cercle trigonométrique, valeurs exactes =====================
  const TC = {
    1: [
      () => { const deg = pk([30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 315, 330, 360]), v = deg * D2R, f = deg / 180;
        return mk("Convertis " + M(deg + "°") + " en radians (valeur exacte, avec " + M("\\pi") + ").", { kind: "value", value: v }, M(deg + "° = " + deg + " \\cdot \\frac{\\pi}{180} = " + radTeX(deg)) + " rad.",
          { ctx: "deg-rad", canon: radE(deg), fig: FIG.unitCircle(deg), guide: [G(M("180° = \\pi") + " rad. Quelle fraction de 180° vaut " + M(deg + "°") + " ? (fraction)", f, M("\\frac{" + deg + "}{180} = " + fT(f)) + "."), G("En radians (avec π) ?", v, M(radTeX(deg)) + ".")],
            traps: [TR(deg * Math.PI / 360, "180° = π (et non 360° = π)."), TR(180 / deg * Math.PI, "On multiplie par π/180 : " + deg + "/180, pas 180/" + deg + "."), TR(deg / 180, "N'oublie pas π.")] }); },
      () => { const deg = pk([30, 45, 60, 90, 120, 135, 150, 210, 240, 270, 300, 330]);
        return QN("Convertis " + M(radTeX(deg)) + " radians en degrés.", deg, M("\\pi = 180°") + " : " + M(radTeX(deg) + " = " + deg + "°") + ".",
          { ctx: "rad-deg", guide: [G("On remplace " + M("\\pi") + " par " + M("180°") + ". Résultat ?", deg, M(deg + "°") + ".")], traps: [TR(deg / 2, "π vaut 180°, pas 360°."), TR(r6(deg * D2R), "On demande des degrés.")] }); },
      () => { const deg = pk([20, 75, 110, 160, 200, 250, 290, 340, 130, 225, 315, 95]), q = quad(deg);
        return QN("Dans quel quadrant du cercle trigonométrique se trouve l'angle " + M(deg + "°") + " ? (donne son numéro)", q, "Quadrants : 1 de 0° à 90°, 2 de 90° à 180°, 3 de 180° à 270°, 4 de 270° à 360°. " + M(deg + "°") + " est dans le quadrant " + q + " ; donc " + M("\\sin") + " est " + (q <= 2 ? "positif" : "négatif") + " et " + M("\\cos") + " " + (q === 1 || q === 4 ? "positif" : "négatif") + ".",
          { ctx: "quadrant", guide: [G("Combien de fois 90° tient-il entièrement dans " + M(deg + "°") + " ?", Math.floor(deg / 90), M(Math.floor(deg / 90)) + " fois."), G("Quadrant ?", q, "Le quadrant " + q + ".")], traps: [TR(q === 4 ? 1 : q + 1, "Compte à partir de 0°, dans le sens inverse des aiguilles d'une montre."), TR(Math.ceil(deg / 100), "Les quadrants se comptent de 90° en 90°.")] }); },
    ],
    2: [
      () => { const deg = pk(NICE.filter((a) => a <= 180)), fn = pk(["sin", "cos"]), v = fn === "sin" ? sinD(deg) : cosD(deg), r = ref(deg); if (Math.abs(v) < 1e-9) return null;
        return QR("Donne la valeur exacte de " + M("\\" + fn + " " + deg + "°") + ".", v, "Angle de référence " + M(r + "°") + " ; dans le quadrant " + quad(deg) + ", " + M("\\" + fn) + " est " + (v > 0 ? "positif" : "négatif") + " : " + M("\\" + fn + " " + deg + "° = " + exT(v)) + ".",
          { ctx: fn + "-exact", canon: exE(v), fig: FIG.unitCircle(deg), guide: [G("Angle de référence (l'angle aigu avec l'axe horizontal) ?", r, M(r + "°") + "."), GR("Valeur pour l'angle de référence, " + M("\\" + fn + " " + r + "°") + " ?", Math.abs(v), M(exT(Math.abs(v))) + "."), GR("Avec le signe du quadrant : " + M("\\" + fn + " " + deg + "°") + " = ?", v, M(exT(v)) + ".")],
            traps: [TR(-v, "Vérifie le signe : dans le quadrant " + quad(deg) + ", " + fn + " est " + (v > 0 ? "positif." : "négatif.")), TR(fn === "sin" ? cosD(deg) : sinD(deg), "Ne confonds pas sinus (ordonnée) et cosinus (abscisse).")] }); },
      () => { const deg = pk([120, 135, 150, 210, 225, 240, 300, 315, 330]), x = cosD(deg), y = sinD(deg);
        return QP("Donne les coordonnées exactes du point du cercle trigonométrique associé à " + M(deg + "°") + "." + PAIR, [x, y], "Le point est " + M("(\\cos " + deg + "° \\,;\\, \\sin " + deg + "°) = (" + exT(x) + " \\,;\\, " + exT(y) + ")") + ".",
          { ctx: "coordonnees", canon: exE(x) + " ; " + exE(y), fig: FIG.unitCircle(deg), guide: [GR("Abscisse = " + M("\\cos " + deg + "°") + " ?", x, M(exT(x)) + "."), GR("Ordonnée = " + M("\\sin " + deg + "°") + " ?", y, M(exT(y)) + "."), GP("Point ?", [x, y], M("(" + exT(x) + " \\,;\\, " + exT(y) + ")") + ".")],
            traps: [TP([y, x], "L'abscisse est le cosinus, l'ordonnée le sinus."), TP([Math.abs(x), Math.abs(y)], "Attention aux signes selon le quadrant.")] }); },
      () => { const r = pk([30, 45, 60]), fn = pk(["sin", "cos"]), lo = fn === "sin" ? 90 : 270, deg = fn === "sin" ? 180 - r : 360 - r, v = fn === "sin" ? sinD(r) : cosD(r);
        return QN("Quel angle " + M("\\alpha") + " compris entre " + M(lo + "°") + " et " + M((lo + 90) + "°") + " vérifie " + M("\\" + fn + " \\alpha = " + exT(v)) + " ?", deg, "Angle de référence " + M(r + "°") + " (car " + M("\\" + fn + " " + r + "° = " + exT(v)) + "). Dans ce quadrant : " + M("\\alpha = " + (fn === "sin" ? "180° - " : "360° - ") + r + "° = " + deg + "°") + ".",
          { ctx: "angle-" + fn, guide: [G("Quel angle aigu a pour " + fn + " " + M(exT(v)) + " ?", r, M(r + "°") + "."), G("Dans le quadrant demandé : " + M("\\alpha") + " = ?", deg, M(deg + "°") + ".")], traps: [TR(r, "On cherche l'angle entre " + lo + "° et " + (lo + 90) + "°, pas l'angle aigu."), TR(lo + r, fn === "sin" ? "sin(180° − α) = sin α : c'est 180° − " + r + "°." : "cos(360° − α) = cos α : c'est 360° − " + r + "°.")] }); },
    ],
    3: [
      () => { const deg = pk([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), v = tanD(deg);
        return QR("Donne la valeur exacte de " + M("\\tan " + deg + "°") + ".", v, M("\\tan = \\frac{\\sin}{\\cos}") + " ; angle de référence " + M(ref(deg) + "°") + ", " + M("\\tan " + ref(deg) + "° = " + { 30: "\\frac{\\sqrt{3}}{3}", 45: "1", 60: "\\sqrt{3}" }[ref(deg)]) + " ; signe : " + (v > 0 ? "positif" : "négatif") + " dans le quadrant " + quad(deg) + ".",
          { ctx: "tan-exact", canon: (v < 0 ? "-" : "") + { 30: "√3/3", 45: "1", 60: "√3" }[ref(deg)], guide: [G("Angle de référence ?", ref(deg), M(ref(deg) + "°") + "."), GR(M("\\tan") + " de l'angle de référence ?", Math.abs(v), M({ 30: "\\frac{\\sqrt{3}}{3}", 45: "1", 60: "\\sqrt{3}" }[ref(deg)]) + "."), GR("Avec le signe : " + M("\\tan " + deg + "°") + " = ?", v, M((v < 0 ? "-" : "") + { 30: "\\frac{\\sqrt{3}}{3}", 45: "1", 60: "\\sqrt{3}" }[ref(deg)]) + ".")],
            traps: [TR(-v, "Tangente positive dans les quadrants 1 et 3, négative dans 2 et 4."), TR(r6(1 / v), "tan = sin/cos, pas cos/sin.")] }); },
      () => { const deg = pk([150, 120, 135, 210, 240, 300, 330, 225, 315]), x = cosD(deg), y = sinD(deg);
        return QP("Donne les coordonnées exactes du point du cercle trigonométrique associé à l'angle " + M(radTeX(deg)) + " (en radians)." + PAIR, [x, y], M(radTeX(deg) + " = " + deg + "°") + " ; point " + M("(" + exT(x) + " \\,;\\, " + exT(y) + ")") + ".",
          { ctx: "coord-rad", canon: exE(x) + " ; " + exE(y), guide: [G("Angle en degrés ?", deg, M(deg + "°") + "."), GR(M("\\cos") + " ?", x, M(exT(x)) + "."), GR(M("\\sin") + " ?", y, M(exT(y)) + "."), GP("Point ?", [x, y], M("(" + exT(x) + " \\,;\\, " + exT(y) + ")") + ".")],
            traps: [TP([y, x], "(cos ; sin) : l'abscisse est le cosinus."), TP([-x, y], "Vérifie le signe de l'abscisse dans ce quadrant.")] }); },
      () => { const a = pk([30, 45, 60, 100, 135, 200, 250, 310]), k = pk([1, 2, -1]), deg = a + 360 * k;
        return QN("Quel angle compris entre " + M("0°") + " et " + M("360°") + " a le même point sur le cercle trigonométrique que " + M(deg + "°") + " ?", a, "On " + (k > 0 ? "retire" : "ajoute") + " " + Math.abs(k) + " tour" + (Math.abs(k) > 1 ? "s" : "") + " de 360° : " + M(deg + (k > 0 ? " - " : " + ") + Math.abs(k) * 360 + " = " + a + "°") + ".",
          { ctx: "tours", guide: [G("Combien de tours complets de 360° faut-il " + (k > 0 ? "retirer" : "ajouter") + " ?", Math.abs(k), Math.abs(k) + "."), G("Angle entre 0° et 360° ?", a, M(a + "°") + ".")], traps: [TR(((deg % 180) + 180) % 180, "Un tour complet fait 360°, pas 180°."), TR(Math.abs(deg) - 360, "Pour un angle négatif, on ajoute 360°.")] }); },
    ],
  };

  // ===================== B2. trigfn : fonctions sinus et cosinus =====================
  const sinTxt = (a, f, b, d) => (a === 1 ? "" : a === -1 ? "-" : N(a)) + "\\" + f + "(" + (b === 1 ? "" : N(b)) + "x)" + (d ? sg(d) : "");
  const TF = {
    1: [
      () => { const a = pk([1, 2, 3, 4, 0.5]), d = R.int(-3, 3), f = pk(["sin", "cos"]), ask = pk(["max", "min"]), v = ask === "max" ? d + a : d - a;
        return QN("Quelle est la valeur " + (ask === "max" ? "maximale" : "minimale") + " de " + M("f(x) = " + sinTxt(a, f, 1, d)) + " ?", v, M("\\" + f + "(x)") + " varie entre −1 et 1, donc " + M("f") + " varie entre " + M(N(d - a)) + " et " + M(N(d + a)) + ".",
          { ctx: "extremum", fig: PL([{ f: (x) => a * (f === "sin" ? Math.sin(x) : Math.cos(x)) + d }], [], { xr: [-1, 7], yr: [-8, 8], squash: 0.6 }), guide: [G("Valeur " + (ask === "max" ? "maximale" : "minimale") + " de " + M("\\" + f + "(x)") + " ?", ask === "max" ? 1 : -1, ask === "max" ? "1." : "−1."), G("Donc " + M("f") + " vaut au " + (ask === "max" ? "maximum" : "minimum") + " ?", v, M(N(a) + " \\cdot " + (ask === "max" ? "1" : "(-1)") + sg(d) + " = " + N(v)) + ".")],
            traps: [TR(ask === "max" ? a : -a, "N'oublie pas le décalage vertical " + d + "."), TR(ask === "max" ? d - a : d + a, ask === "max" ? "Le maximum, c'est d + a." : "Le minimum, c'est d − a.")] }); },
      () => { const a = pk([2, 3, 4, 5, 0.5, 1.5]), d = R.int(-4, 4), b = pk([1, 2, 3]), f = pk(["sin", "cos"]);
        return QN("Quelle est l'amplitude de " + M("f(x) = " + sinTxt(a, f, b, d)) + " ?", a, "L'amplitude est le coefficient devant " + M("\\" + f) + " (en valeur absolue) : " + M(N(a)) + ". La courbe monte jusqu'à " + M(N(d + a)) + " et descend jusqu'à " + M(N(d - a)) + ".",
          { ctx: "amplitude", guide: [G("Maximum de " + M("f") + " ?", d + a, M(N(d + a)) + "."), G("Minimum de " + M("f") + " ?", d - a, M(N(d - a)) + "."), G("Amplitude = (max − min) ÷ 2 ?", a, M(N(a)) + ".")], traps: [TR(2 * a, "L'amplitude est la moitié de l'écart entre max et min."), TR(d, "d décale la courbe ; il ne change pas l'amplitude."), TR(b, "b agit sur la période, pas sur l'amplitude.")] }); },
      () => { const f = pk(["sin", "cos"]), a = pk([2, 3, 4]), ask = pk(["min", "max"]), neg = R.rand() < 0.3, x = f === "sin" ? ((ask === "max") !== neg ? 90 : 270) : ((ask === "max") !== neg ? 360 : 180), xx = x === 360 ? 0 : x;
        return QN("Sur l'intervalle " + M("0° \\le x < 360°") + ", en quel " + M("x") + " la fonction " + M("f(x) = " + (neg ? "-" : "") + a + "\\" + f + "(x)") + " atteint-elle son " + (ask === "max" ? "maximum" : "minimum") + " ? (en degrés)", xx, M("\\" + f + "(x)") + " vaut " + (((ask === "max") !== neg) ? "1" : "−1") + " en " + M(xx + "°") + (neg ? " ; avec le signe moins, le " + (ask === "max" ? "maximum de f correspond au minimum" : "minimum de f correspond au maximum") + " de " + M("\\" + f) : "") + ".",
          { ctx: "position-" + ask, fig: PL([{ f: (t) => (neg ? -a : a) * (f === "sin" ? Math.sin(t * D2R) : Math.cos(t * D2R)) }], [], { xr: [-20, 380], yr: [-5, 5], squash: 0.5, numbers: false }), guide: [G("Pour le " + (ask === "max" ? "maximum" : "minimum") + " de " + M("f") + ", " + M("\\" + f + "(x)") + " doit valoir 1 ou −1 ?", ((ask === "max") !== neg) ? 1 : -1, neg ? "Avec le signe moins, c'est l'inverse." : "Le coefficient " + a + " est positif."), G("En quel " + M("x") + " (entre 0° et 360°) ?", xx, M(xx + "°") + ".")],
            traps: [TR(f === "sin" ? (xx === 90 ? 270 : 90) : (xx === 0 ? 180 : 0), "Maximum de " + f + " : 1 ; minimum : −1. Vérifie aussi le signe devant."), TR(f === "sin" ? (xx === 90 ? 0 : 180) : (xx === 0 ? 90 : 270), f === "sin" ? "Le sinus vaut 1 en 90° et −1 en 270°." : "Le cosinus vaut 1 en 0° et −1 en 180°.")] }); },
    ],
    2: [
      () => { const b = pk([2, 3, 4, 6, 0.5]), f = pk(["sin", "cos"]), a = pk([1, 2, 3]), per = r6(360 / b);
        return QN("Quelle est la période (en degrés) de " + M("f(x) = " + sinTxt(a, f, b, 0)) + " ?", per, "La période de " + M("\\" + f + "(x)") + " est 360° ; avec " + M(N(b) + "x") + ", la courbe va " + N(b) + " fois plus vite : " + M("\\frac{360°}{" + N(b) + "} = " + N(per) + "°") + ".",
          { ctx: "periode-deg", guide: [G("Période de " + M("\\" + f + "(x)") + " (en degrés) ?", 360, "360°."), G("On divise par le coefficient de " + M("x") + " : période ?", per, M(N(per) + "°") + ".")], traps: [TR(360 * b, "Avec bx, la courbe va plus vite : on divise par b."), TR(r6(360 / a), "C'est le coefficient de x (b) qui change la période, pas celui devant " + f + ".")] }); },
      () => { const b = pk([2, 3, 4, 0.5]), f = pk(["sin", "cos"]), per = 2 * Math.PI / b;
        return mk("Quelle est la période de " + M("f(x) = \\" + f + "(" + N(b) + "x)") + " (x en radians) ? (valeur exacte, avec " + M("\\pi") + ")", { kind: "value", value: per }, "Période de " + M("\\" + f) + " : " + M("2\\pi") + " ; avec " + M(N(b) + "x") + " : " + M("\\frac{2\\pi}{" + N(b) + "}") + ".",
          { ctx: "periode-rad", canon: b === 0.5 ? "4π" : b === 2 ? "π" : "2π/" + b, guide: [G("Période de " + M("\\" + f + "(x)") + " en radians ? (avec π)", r6(2 * Math.PI), M("2\\pi") + "."), G("Divisée par " + M(N(b)) + " ?", per, M("\\frac{2\\pi}{" + N(b) + "}") + ".")], traps: [TR(r6(2 * Math.PI * b), "On divise par b, on ne multiplie pas."), TR(r6(Math.PI / b), "La période de sin et cos est 2π (pas π).")] }); },
      () => { const a = pk([2, 3, 4]), d = R.int(-3, 3), x = pk([30, 90, 150, 270, 0, 180]), f = pk(["sin", "cos"]), base = f === "sin" ? sinD(x) : cosD(x), v = r6(a * base + d); if (!Number.isInteger(v * 2)) return null;
        return QN("Soit " + M("f(x) = " + sinTxt(a, f, 1, d)) + " (x en degrés). Calcule " + M("f(" + x + "°)") + ".", v, M("\\" + f + " " + x + "° = " + exT(base)) + " ; " + M("f(" + x + "°) = " + a + " \\cdot " + pT(base) + sg(d) + " = " + N(v)) + ".",
          { ctx: "image", guide: [G(M("\\" + f + " " + x + "°") + " = ?", base, M(exT(base)) + "."), G(M("f(" + x + "°)") + " = ?", v, M(N(v)) + ".")], traps: [TR(r6(a * base), "Ajoute " + d + "."), TR(r6(a * (f === "sin" ? cosD(x) : sinD(x)) + d), "Attention : " + f + ", pas " + (f === "sin" ? "cos" : "sin") + ".")] }); },
    ],
    3: [
      () => { const M2 = R.int(3, 9), m = M2 - 2 * R.int(1, 4), a = (M2 - m) / 2, d = (M2 + m) / 2, ask = pk(["a", "d"]);
        return QN("Une fonction " + M("f(x) = a\\sin(x) + d") + " (avec " + M("a > 0") + ") a pour maximum " + M(M2) + " et pour minimum " + M(m) + ". Que vaut " + M(ask) + " ?", ask === "a" ? a : d, "Amplitude " + M("a = \\frac{" + M2 + " - " + pT(m) + "}{2} = " + N(a)) + " ; milieu " + M("d = \\frac{" + M2 + " + " + pT(m) + "}{2} = " + N(d)) + ".",
          { ctx: "max-min-" + ask, guide: [G("Écart entre le maximum et le minimum ?", M2 - m, M(M2 - m) + "."), G(ask === "a" ? "L'amplitude en est la moitié : " + M("a") + " = ?" : "Le milieu " + M("d = \\frac{\\max + \\min}{2}") + " = ?", ask === "a" ? a : d, M(N(ask === "a" ? a : d)) + ".")], traps: [TR(ask === "a" ? M2 - m : M2, ask === "a" ? "L'amplitude est la moitié de l'écart." : "d est le milieu entre max et min."), TR(ask === "a" ? d : a, ask === "a" ? "Ça, c'est d (le milieu)." : "Ça, c'est a (l'amplitude).")] }); },
      () => { const b = pk([2, 3, 4]), f = "sin", n = 2 * b + 1;
        return QN("Combien de fois la courbe de " + M("f(x) = \\sin(" + b + "x)") + " coupe-t-elle l'axe des abscisses pour " + M("0° \\le x \\le 360°") + " ?", n, "Période " + M("\\frac{360°}{" + b + "} = " + 360 / b + "°") + " : il y a " + b + " périodes complètes, chacune coupe l'axe 2 fois, plus le point final en 360° : " + M("2 \\cdot " + b + " + 1 = " + n) + ".",
          { ctx: "zeros", guide: [G("Période (en degrés) ?", 360 / b, M(360 / b + "°") + "."), G("Nombre de périodes entre 0° et 360° ?", b, M(b) + "."), G("Nombre de zéros (2 par période, plus x = 360°) ?", n, M(n) + ".")], traps: [TR(2 * b, "Compte aussi x = 360° (sin(" + b + " · 360°) = 0)."), TR(3, "Avec " + b + "x, la courbe oscille " + b + " fois plus vite.")] }); },
      () => { const a = pk([2, 3]), b = pk([2, 3, 6]), f = pk(["sin", "cos"]), d = R.int(-2, 2), x0 = f === "sin" ? 90 / b : 0;
        if (f === "cos") { const x1 = 180 / b; return QN("En quel plus petit " + M("x > 0") + " (en degrés) la fonction " + M("f(x) = " + sinTxt(a, "cos", b, d)) + " atteint-elle son minimum ?", x1, M("\\cos") + " est minimal (−1) quand l'angle vaut 180° : " + M(b + "x = 180°") + ", " + M("x = " + N(x1) + "°") + ".", { ctx: "min-cos", guide: [G("Pour quel angle " + M("\\cos") + " vaut-il −1 (le plus petit positif) ?", 180, "180°."), G(M(b + "x = 180°") + " : " + M("x") + " = ?", x1, M(N(x1) + "°") + ".")], traps: [TR(180, "L'angle est " + b + "x : il faut diviser par " + b + "."), TR(360 / b, "Ça, c'est la période (le cos revient à son maximum).")] }); }
        return QN("En quel plus petit " + M("x > 0") + " (en degrés) la fonction " + M("f(x) = " + sinTxt(a, "sin", b, d)) + " atteint-elle son maximum ?", x0, M("\\sin") + " est maximal (1) quand l'angle vaut 90° : " + M(b + "x = 90°") + ", " + M("x = " + N(x0) + "°") + ".",
          { ctx: "max-sin", guide: [G("Pour quel angle " + M("\\sin") + " vaut-il 1 (le plus petit positif) ?", 90, "90°."), G(M(b + "x = 90°") + " : " + M("x") + " = ?", x0, M(N(x0) + "°") + ".")], traps: [TR(90, "L'angle est " + b + "x : il faut diviser par " + b + "."), TR(90 * b, "On divise par " + b + ", on ne multiplie pas.")] }); },
    ],
  };

  // ===================== B3. sinlaw : théorèmes du sinus et du cosinus =====================
  const TRI = (lab) => FIG.anyTriangle(lab);
  const SL = {
    1: [
      () => { const al = R.int(35, 80), be = R.int(30, 75), a = R.int(5, 15); if (al + be >= 160) return null; const b = r6(a * Math.sin(be * D2R) / Math.sin(al * D2R)), br = Math.round(b * 100) / 100;
        return QRd("Dans le triangle " + M("ABC") + ", " + M("a = " + a) + " cm, " + M("\\alpha = " + al + "°") + " et " + M("\\beta = " + be + "°") + ". Calcule " + M("b") + " (au centième, en cm).", b, "Théorème du sinus : " + M("\\frac{b}{\\sin \\beta} = \\frac{a}{\\sin \\alpha}") + ", " + M("b = \\frac{" + a + " \\cdot \\sin " + be + "°}{\\sin " + al + "°} \\approx " + N(br)) + " cm.", 0.01,
          { ctx: "sinus-cote", fig: TRI(["a = " + a, "b = ?", "", "α = " + al + "°", "A"]), guide: [Gd("Rapport " + M("\\frac{a}{\\sin \\alpha} = \\frac{" + a + "}{\\sin " + al + "°}") + " ≈ ? (au centième)", r6(a / Math.sin(al * D2R)), M("\\approx " + N(Math.round(a / Math.sin(al * D2R) * 100) / 100)) + ".", 0.01), Gd(M("b = \\frac{a}{\\sin\\alpha} \\cdot \\sin \\beta") + " ≈ ?", b, M("\\approx " + N(br)) + " cm.", 0.01)],
            traps: [TR(r6(a * Math.sin(al * D2R) / Math.sin(be * D2R)), "b est en face de β : b = a · sin β ÷ sin α (et non l'inverse)."), TR(r6(a * be / al), "On utilise les sinus des angles, pas les angles eux-mêmes.")] }); },
      () => { const al = R.int(40, 80), be = R.int(30, 70), c = R.int(6, 15); if (al + be >= 160) return null; const ga = 180 - al - be, a = r6(c * Math.sin(al * D2R) / Math.sin(ga * D2R));
        return QRd("Dans le triangle " + M("ABC") + ", " + M("c = " + c) + " cm, " + M("\\alpha = " + al + "°") + " et " + M("\\beta = " + be + "°") + ". Calcule " + M("a") + " (au centième, en cm).", a, M("\\gamma = 180° - " + al + "° - " + be + "° = " + ga + "°") + " ; " + M("a = \\frac{" + c + " \\cdot \\sin " + al + "°}{\\sin " + ga + "°} \\approx " + N(Math.round(a * 100) / 100)) + " cm.", 0.01,
          { ctx: "troisieme-angle", fig: TRI(["a = ?", "", "c = " + c, "α = " + al + "°, β = " + be + "°", "A"]), guide: [G("Il faut l'angle en face de " + M("c") + " : " + M("\\gamma") + " = ?", ga, M("180° - " + al + "° - " + be + "° = " + ga + "°") + "."), Gd(M("a = \\frac{c \\cdot \\sin\\alpha}{\\sin\\gamma}") + " ≈ ?", a, M("\\approx " + N(Math.round(a * 100) / 100)) + " cm.", 0.01)],
            traps: [TR(r6(c * Math.sin(al * D2R) / Math.sin(be * D2R)), "c est en face de γ (pas de β) : calcule d'abord γ."), TR(r6(c * Math.sin(be * D2R) / Math.sin(ga * D2R)), "a est en face de α.")] }); },
      () => { const al = R.int(35, 70), a = R.int(8, 15), b = R.int(4, a - 1), sb = b * Math.sin(al * D2R) / a, be = r6(Math.asin(sb) / D2R);
        return QRd("Dans le triangle " + M("ABC") + ", " + M("a = " + a) + ", " + M("b = " + b) + " et " + M("\\alpha = " + al + "°") + ". Calcule l'angle " + M("\\beta") + " (au dixième de degré).", be, M("\\sin \\beta = \\frac{b \\cdot \\sin\\alpha}{a} = \\frac{" + b + " \\cdot \\sin " + al + "°}{" + a + "} \\approx " + N(Math.round(sb * 1000) / 1000)) + ", " + M("\\beta \\approx " + N(Math.round(be * 10) / 10) + "°") + " (" + M("\\beta") + " est aigu car " + M("b < a") + ").", 0.1,
          { ctx: "sinus-angle", fig: TRI(["a = " + a, "b = " + b, "", "α = " + al + "°", "A"]), guide: [Gd(M("\\sin\\beta = \\frac{b \\sin\\alpha}{a}") + " ≈ ? (au millième)", r6(sb), M("\\approx " + N(Math.round(sb * 1000) / 1000)) + ".", 0.001), Gd(M("\\beta") + " (touche " + M("\\sin^{-1}") + ") ≈ ?", be, M("\\approx " + N(Math.round(be * 10) / 10) + "°") + ".", 0.1)],
            traps: [TR(r6(Math.asin(Math.min(1, a * Math.sin(al * D2R) / b)) / D2R), "sin β = b · sin α ÷ a (b au numérateur)."), TR(r6(180 - be), "b < a : β est plus petit que α, donc aigu.")] }); },
    ],
    2: [
      () => { const a = R.int(4, 12), b = R.int(4, 12), ga = pk([40, 50, 60, 70, 80, 100, 110, 120]), c = r6(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(ga * D2R))), cr = Math.round(c * 100) / 100;
        return QRd("Dans le triangle " + M("ABC") + ", " + M("a = " + a) + " cm, " + M("b = " + b) + " cm et l'angle compris " + M("\\gamma = " + ga + "°") + ". Calcule " + M("c") + " (au centième, en cm).", c, "Théorème du cosinus : " + M("c^2 = a^2 + b^2 - 2ab\\cos\\gamma = " + a * a + " + " + b * b + " - " + 2 * a * b + "\\cos " + ga + "° \\approx " + N(Math.round(c * c * 100) / 100)) + ", " + M("c \\approx " + N(cr)) + " cm.", 0.01,
          { ctx: "cosinus-cote", fig: TRI(["a = " + a, "b = " + b, "c = ?", "γ = " + ga + "°", "C"]), guide: [Gd(M("c^2 = a^2 + b^2 - 2ab\\cos\\gamma") + " ≈ ? (au centième)", r6(c * c), M("\\approx " + N(Math.round(c * c * 100) / 100)) + ".", 0.01), Gd(M("c") + " ≈ ?", c, M("\\approx " + N(cr)) + " cm.", 0.01)],
            traps: [TR(r6(Math.sqrt(a * a + b * b)), "Pythagore ne vaut que pour un angle droit : il manque − 2ab cos γ."), TR(r6(Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(ga * D2R))), "C'est − 2ab cos γ (signe moins)."), TR(r6(c * c), "N'oublie pas la racine.")] }); },
      () => { const d1 = R.int(3, 12), d2 = R.int(3, 12), ang = pk([35, 45, 60, 75, 100, 120, 130]), d = r6(Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(ang * D2R))), c = pk([["Deux sentiers partent d'un même carrefour et forment un angle de " + M(ang + "°") + ". Léa marche " + M(d1) + " km sur l'un, Tom " + M(d2) + " km sur l'autre. Quelle distance les sépare à vol d'oiseau (en km, au centième) ?", "sentiers"], ["Depuis un phare, un bateau est à " + M(d1) + " km et un autre à " + M(d2) + " km ; les deux directions forment un angle de " + M(ang + "°") + ". Quelle distance sépare les bateaux (en km, au centième) ?", "bateaux"]]);
        return QRd(c[0], d, M("d^2 = " + d1 + "^2 + " + d2 + "^2 - 2 \\cdot " + d1 + " \\cdot " + d2 + " \\cos " + ang + "°") + ", " + M("d \\approx " + N(Math.round(d * 100) / 100)) + " km.", 0.01,
          { ctx: c[1], guide: [Gd(M("d^2") + " ≈ ? (théorème du cosinus, au centième)", r6(d * d), M("\\approx " + N(Math.round(d * d * 100) / 100)) + ".", 0.01), Gd(M("d") + " ≈ ?", d, M("\\approx " + N(Math.round(d * 100) / 100)) + " km.", 0.01)], traps: [TR(r6(Math.sqrt(d1 * d1 + d2 * d2)), "L'angle n'est pas droit : théorème du cosinus."), TR(r6(Math.abs(d1 - d2)), "Il faut tenir compte de l'angle.")] }); },
      () => { const a = R.int(4, 10), b = R.int(4, 10), al = pk([50, 60, 70, 110, 120]), dg = r6(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos((180 - al) * D2R)));
        return QRd("Un parallélogramme a des côtés de " + M(a) + " cm et " + M(b) + " cm, et un angle de " + M(al + "°") + ". Calcule la longueur de la diagonale opposée à l'angle de " + M((180 - al) + "°") + " (au centième, en cm).", dg, "Dans le triangle formé par deux côtés et cette diagonale, l'angle compris vaut " + M((180 - al) + "°") + " : " + M("d^2 = " + a * a + " + " + b * b + " - " + 2 * a * b + "\\cos " + (180 - al) + "°") + ", " + M("d \\approx " + N(Math.round(dg * 100) / 100)) + " cm.", 0.01,
          { ctx: "parallelogramme", guide: [G("Angle compris entre les deux côtés, en face de cette diagonale ?", 180 - al, M((180 - al) + "°") + " (deux angles voisins d'un parallélogramme font 180°)."), Gd("Diagonale ≈ ?", dg, M("\\approx " + N(Math.round(dg * 100) / 100)) + " cm.", 0.01)], traps: [TR(r6(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(al * D2R))), "C'est l'autre diagonale (angle " + al + "°)."), TR(r6(Math.sqrt(a * a + b * b)), "Le parallélogramme n'est pas un rectangle.")] }); },
    ],
    3: [
      () => { let a, b, c; do { a = R.int(4, 12); b = R.int(4, 12); c = R.int(4, 12); } while (a + b <= c || a + c <= b || b + c <= a); const cg = (a * a + b * b - c * c) / (2 * a * b), ga = r6(Math.acos(cg) / D2R);
        return QRd("Un triangle a pour côtés " + M("a = " + a) + ", " + M("b = " + b) + " et " + M("c = " + c) + ". Calcule l'angle " + M("\\gamma") + " (opposé à " + M("c") + ", au dixième de degré).", ga, M("\\cos\\gamma = \\frac{a^2 + b^2 - c^2}{2ab} = \\frac{" + (a * a + b * b - c * c) + "}{" + 2 * a * b + "} \\approx " + N(Math.round(cg * 1000) / 1000)) + ", " + M("\\gamma \\approx " + N(Math.round(ga * 10) / 10) + "°") + ".", 0.1,
          { ctx: "cosinus-angle", fig: TRI(["a = " + a, "b = " + b, "c = " + c, "γ = ?", "C"]), guide: [G("Numérateur " + M("a^2 + b^2 - c^2") + " ?", a * a + b * b - c * c, M(a * a + b * b - c * c) + "."), Gd(M("\\cos\\gamma") + " ≈ ? (au millième)", r6(cg), M("\\approx " + N(Math.round(cg * 1000) / 1000)) + ".", 0.001), Gd(M("\\gamma") + " ≈ ?", ga, M("\\approx " + N(Math.round(ga * 10) / 10) + "°") + ".", 0.1)],
            traps: [TR(r6(Math.acos(Math.max(-1, Math.min(1, (a * a + b * b + c * c) / (2 * a * b) - 1))) / D2R), "Formule : a² + b² − c² (c, le côté opposé, avec un moins)."), TR(r6(180 - ga), "Le signe du cosinus donne directement l'angle (obtus si cos < 0).")] }); },
      () => { const base = pk([100, 150, 200, 250]), al = R.int(40, 75), be = R.int(40, 75); const ga = 180 - al - be, d = r6(base * Math.sin(be * D2R) / Math.sin(ga * D2R));
        return QRd("Deux observateurs A et B sont à " + M(base) + " m l'un de l'autre au bord d'un lac. Ils visent une bouée C : l'angle en A vaut " + M(al + "°") + " et l'angle en B " + M(be + "°") + ". Quelle est la distance AC (en m, au dixième) ?", d, M("\\gamma = 180° - " + al + "° - " + be + "° = " + ga + "°") + " ; AC est en face de B : " + M("AC = \\frac{" + base + " \\sin " + be + "°}{\\sin " + ga + "°} \\approx " + N(Math.round(d * 10) / 10)) + " m.", 0.1,
          { ctx: "bouee", guide: [G("Angle en C ?", ga, M(ga + "°") + "."), Gd("AC (en face de l'angle en B) ≈ ?", d, M("\\approx " + N(Math.round(d * 10) / 10)) + " m.", 0.1)], traps: [TR(r6(base * Math.sin(al * D2R) / Math.sin(ga * D2R)), "AC est en face de l'angle en B (pas en A)."), TR(r6(base * Math.sin(be * D2R)), "Divise par sin γ (le côté AB est en face de C).")] }); },
      () => { const a = R.int(5, 12), b = R.int(5, 12), ga = pk([35, 50, 65, 80]), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(ga * D2R)), be = r6(Math.asin(b * Math.sin(ga * D2R) / c) / D2R); if (b * b > a * a + c * c) return null;
        return QRd("Dans le triangle " + M("ABC") + ", " + M("a = " + a) + ", " + M("b = " + b) + " et " + M("\\gamma = " + ga + "°") + ". Calcule l'angle " + M("\\beta") + " (au dixième de degré).", be, "D'abord " + M("c") + " par le théorème du cosinus : " + M("c \\approx " + N(Math.round(c * 100) / 100)) + " ; puis le théorème du sinus : " + M("\\sin\\beta = \\frac{b \\sin\\gamma}{c}") + ", " + M("\\beta \\approx " + N(Math.round(be * 10) / 10) + "°") + ".", 0.1,
          { ctx: "cosinus-puis-sinus", guide: [Gd(M("c") + " (théorème du cosinus) ≈ ? (au centième)", r6(c), M("\\approx " + N(Math.round(c * 100) / 100)) + ".", 0.01), Gd(M("\\beta") + " (théorème du sinus) ≈ ?", be, M("\\approx " + N(Math.round(be * 10) / 10) + "°") + ".", 0.1)], traps: [TR(r6(180 - ga - be), "C'est α ; on demande β (en face de b)."), TR(r6(Math.asin(Math.min(1, a * Math.sin(ga * D2R) / c)) / D2R), "β est en face de b : sin β = b · sin γ ÷ c.")] }); },
    ],
  };

  // ===================== B4. trigeq : équations trigonométriques élémentaires (en degrés, sur [0° ; 360°[) =====================
  const twice = (v) => { const a = Math.abs(v), t = Math.abs(a - 0.5) < 1e-6 ? "1" : Math.abs(a - Math.SQRT2 / 2) < 1e-6 ? "\\sqrt{2}" : "\\sqrt{3}"; return (v < 0 ? "-" : "") + t; }; // 2·(valeur exacte)
  const IV = " pour " + M("0° \\le x < 360°") + ". Sépare les solutions par « ; » (en degrés).";
  const TQ = {
    1: [
      () => { const r = pk([30, 45, 60]), neg = R.rand() < 0.4, v = neg ? -sinD(r) : sinD(r), s1 = neg ? 180 + r : r, s2 = neg ? 360 - r : 180 - r;
        return QSet("Résous " + M("\\sin x = " + exT(v)) + IV, [s1, s2], "Angle de référence " + M(r + "°") + ". Le sinus est " + (neg ? "négatif dans les quadrants 3 et 4 : " + M("180° + " + r + "° = " + s1 + "°") + " et " + M("360° - " + r + "° = " + s2 + "°") : "positif dans les quadrants 1 et 2 : " + M(r + "°") + " et " + M("180° - " + r + "° = " + s2 + "°")) + ".",
          { ctx: neg ? "sin-neg" : "sin-pos", fig: FIG.unitCircle(s1, "x"), guide: [G("Angle de référence (aigu) dont le sinus vaut " + M(exT(Math.abs(v))) + " ?", r, M(r + "°") + "."), GSet("Le sinus est " + (neg ? "négatif" : "positif") + " dans deux quadrants. Les deux solutions ?", [s1, s2], M(s1 + "°") + " et " + M(s2 + "°") + ".")],
            traps: [TSet([s1], "Il y a deux solutions sur un tour : sin(180° − x) = sin x."), TSet(neg ? [-r, 180 + r] : [r, 360 - r], neg ? "Les solutions doivent être entre 0° et 360°." : "Pour le sinus, l'autre solution est 180° − x (360° − x, c'est pour le cosinus).")] }); },
      () => { const r = pk([30, 45, 60]), neg = R.rand() < 0.4, v = neg ? -cosD(r) : cosD(r), s1 = neg ? 180 - r : r, s2 = neg ? 180 + r : 360 - r;
        return QSet("Résous " + M("\\cos x = " + exT(v)) + IV, [s1, s2], "Angle de référence " + M(r + "°") + ". Le cosinus est " + (neg ? "négatif dans les quadrants 2 et 3 : " + M(s1 + "°") + " et " + M(s2 + "°") : "positif dans les quadrants 1 et 4 : " + M(r + "°") + " et " + M("360° - " + r + "° = " + s2 + "°")) + ".",
          { ctx: neg ? "cos-neg" : "cos-pos", fig: FIG.unitCircle(s1, "x"), guide: [G("Angle de référence (aigu) dont le cosinus vaut " + M(exT(Math.abs(v))) + " ?", r, M(r + "°") + "."), GSet("Les deux solutions ?", [s1, s2], M(s1 + "°") + " et " + M(s2 + "°") + " (le cosinus est symétrique par rapport à l'axe horizontal).")],
            traps: [TSet([s1], "Il y a deux solutions sur un tour : cos(360° − x) = cos x."), TSet(neg ? [180 - r, 180 + r].map((x) => 360 - x) : [r, 180 - r], "Pour le cosinus, l'autre solution est 360° − x (180° − x, c'est pour le sinus).")] }); },
      () => { const k = pk([0, 1, -1]), fn = pk(["sin", "cos"]), sols = fn === "sin" ? (k === 0 ? [0, 180] : k === 1 ? [90] : [270]) : (k === 0 ? [90, 270] : k === 1 ? [0] : [180]);
        return QSet("Résous " + M("\\" + fn + " x = " + k) + IV, sols, "Sur le cercle trigonométrique, " + (fn === "sin" ? "l'ordonnée" : "l'abscisse") + " vaut " + k + " en " + sols.map((x) => M(x + "°")).join(" et ") + ".",
          { ctx: "valeurs-cles", guide: [GSet("Points du cercle où " + (fn === "sin" ? "l'ordonnée (sinus)" : "l'abscisse (cosinus)") + " vaut " + k + " ?", sols, sols.map((x) => M(x + "°")).join(" et ") + ".")], traps: [TSet(fn === "sin" ? (k === 0 ? [90, 270] : k === 1 ? [0] : [180]) : (k === 0 ? [0, 180] : k === 1 ? [90] : [270]), "Le sinus est l'ordonnée, le cosinus l'abscisse.")] }); },
    ],
    2: [
      () => { const r = pk([30, 45, 60]), neg = R.rand() < 0.5, tv = neg ? -tanD(r) : tanD(r), s1 = neg ? 180 - r : r, s2 = s1 + 180;
        return QSet("Résous " + M("\\tan x = " + (neg ? "-" : "") + { 30: "\\frac{\\sqrt{3}}{3}", 45: "1", 60: "\\sqrt{3}" }[r]) + IV, [s1, s2], "Angle de référence " + M(r + "°") + ". La tangente se répète tous les 180° : " + M(s1 + "°") + " et " + M(s2 + "°") + ".",
          { ctx: "tan", guide: [G("Angle de référence ?", r, M(r + "°") + "."), G("Première solution (tangente " + (neg ? "négative : quadrant 2" : "positive : quadrant 1") + ") ?", s1, M(s1 + "°") + "."), GSet("La tangente se répète tous les 180°. Les solutions ?", [s1, s2], M(s1 + "°") + " et " + M(s2 + "°") + ".")],
            traps: [TSet([s1, 360 - s1], "La tangente a une période de 180° : x et x + 180°."), TSet([s1], "Il y a deux solutions sur un tour.")] }); },
      () => { const r = pk([30, 45, 60]), fn = pk(["sin", "cos"]), neg = R.rand() < 0.5, v = (neg ? -1 : 1) * (fn === "sin" ? sinD(r) : cosD(r)), rr = ref(fn === "sin" ? r : r), sols = fn === "sin" ? (neg ? [180 + r, 360 - r] : [r, 180 - r]) : (neg ? [180 - r, 180 + r] : [r, 360 - r]);
        return QSet("Résous " + M("2\\" + fn + " x = " + twice(v)) + IV, sols, "On divise par 2 : " + M("\\" + fn + " x = " + exT(v)) + ". Angle de référence " + M(r + "°") + " : " + sols.map((x) => M(x + "°")).join(" et ") + ".",
          { ctx: "isoler-" + fn, guide: [GR("On divise par 2 : " + M("\\" + fn + " x") + " = ?", v, M(exT(v)) + "."), GSet("Solutions ?", sols, sols.map((x) => M(x + "°")).join(" et ") + ".")], traps: [TSet(fn === "sin" ? [r, 360 - r] : [r, 180 - r], fn === "sin" ? "Sinus : x et 180° − x." : "Cosinus : x et 360° − x."), TSet([sols[0]], "Deux solutions sur un tour.")] }); },
      () => { const fn = pk(["sin", "cos"]), sols = fn === "sin" ? [210, 330] : [120, 240];
        return QSet("Résous " + M("2\\" + fn + " x + 1 = 0") + IV, sols, "On isole : " + M("\\" + fn + " x = -\\frac{1}{2}") + ". Référence " + M((fn === "sin" ? 30 : 60) + "°") + " ; " + fn + " négatif dans les quadrants " + (fn === "sin" ? "3 et 4" : "2 et 3") + " : " + sols.map((x) => M(x + "°")).join(" et ") + ".",
          { ctx: "2" + fn + "+1", guide: [G("On isole : " + M("\\" + fn + " x") + " = ?", -0.5, M("-\\frac{1}{2}") + "."), G("Angle de référence ?", fn === "sin" ? 30 : 60, M((fn === "sin" ? 30 : 60) + "°") + "."), GSet("Solutions ?", sols, sols.map((x) => M(x + "°")).join(" et ") + ".")], traps: [TSet(fn === "sin" ? [30, 150] : [60, 300], fn + " x = −1/2 est négatif : regarde les bons quadrants."), TSet([sols[0]], "Deux solutions sur un tour.")] }); },
    ],
    3: [
      () => { const sols = [45, 225];
        return QSet("Résous " + M("\\sin x = \\cos x") + IV, sols, "On divise par " + M("\\cos x") + " : " + M("\\tan x = 1") + ", donc " + M("x = 45°") + " ou " + M("x = 225°") + ".",
          { ctx: "sin=cos", guide: [G("En divisant par " + M("\\cos x") + ", on obtient " + M("\\tan x") + " = ?", 1, "1."), GSet("Solutions de " + M("\\tan x = 1") + " ?", sols, M("45°") + " et " + M("225°") + ".")], traps: [TSet([45], "La tangente se répète tous les 180° : 45° et 225°."), TSet([45, 135], "C'est tan x = 1 : période 180°.")] }); },
      () => { const r = pk([30, 45, 60]), fn = pk(["sin", "cos"]), v = fn === "sin" ? sinD(r) : cosD(r), sols = fn === "sin" ? [r, 180 - r] : [r, 360 - r], k = R.int(1, 4);
        return QSet("Résous " + M("2\\" + fn + " x - " + twice(v) + " = 0") + IV, sols, M("2\\" + fn + " x = " + twice(v)) + ", " + M("\\" + fn + " x = " + exT(v)) + ", référence " + M(r + "°") + " : " + sols.map((x) => M(x + "°")).join(" et ") + ".",
          { ctx: "isoler2-" + fn, guide: [GR("On isole : " + M("\\" + fn + " x") + " = ?", v, M(exT(v)) + "."), G("Angle de référence ?", r, M(r + "°") + "."), GSet("Solutions ?", sols, sols.map((x) => M(x + "°")).join(" et ") + ".")], traps: [TSet(fn === "sin" ? [r, 360 - r] : [r, 180 - r], fn === "sin" ? "Sinus : x et 180° − x." : "Cosinus : x et 360° − x."), TSet([r], "Deux solutions sur un tour.")] }); },
      () => { const r = pk([30, 45, 60]), fn = pk(["sin", "cos"]), v = fn === "sin" ? sinD(r) : cosD(r), sols = (fn === "sin" ? [r, 180 - r, 180 + r, 360 - r] : [r, 360 - r, 180 - r, 180 + r]);
        return QSet("Résous " + M("\\" + fn + "^2 x = " + (r === 45 ? "\\frac{1}{2}" : fn === "sin" ? (r === 30 ? "\\frac{1}{4}" : "\\frac{3}{4}") : (r === 60 ? "\\frac{1}{4}" : "\\frac{3}{4}"))) + IV, sols, M("\\" + fn + " x = " + exT(v)) + " ou " + M("\\" + fn + " x = " + exT(-v)) + " : quatre solutions, " + sols.slice().sort((a, b) => a - b).map((x) => M(x + "°")).join(", ") + ".",
          { ctx: "carre", guide: [GR("Une valeur positive possible de " + M("\\" + fn + " x") + " ?", v, M(exT(v)) + " (et aussi " + M(exT(-v)) + ")."), GSet("Toutes les solutions (quatre) ?", sols, sols.slice().sort((a, b) => a - b).map((x) => M(x + "°")).join(", ") + ".")], traps: [TSet(sols.slice(0, 2), "N'oublie pas la racine négative : " + fn + " x = ±" + exT(v).replace(/\\\\/g, "") + "."), TSet([r], "Il y a quatre solutions.")] }); },
    ],
  };

  // ===================== B5. trigassoc : angles associés, relations fondamentales =====================
  const TA = {
    1: [
      () => { const v = pk([0.2, 0.3, 0.4, 0.6, 0.8, 0.25, 0.75]), c = pk([["\\sin(180° - \\alpha)", "sin", 1, "Symétrie par rapport à l'axe vertical : même ordonnée."], ["\\cos(-\\alpha)", "cos", 1, "Symétrie par rapport à l'axe horizontal : même abscisse."], ["\\sin(-\\alpha)", "sin", -1, "Symétrie par rapport à l'axe horizontal : ordonnée opposée."], ["\\cos(180° - \\alpha)", "cos", -1, "Symétrie par rapport à l'axe vertical : abscisse opposée."], ["\\sin(180° + \\alpha)", "sin", -1, "Symétrie par rapport à l'origine : ordonnée opposée."], ["\\cos(360° - \\alpha)", "cos", 1, "Un tour moins α : même abscisse que −α, donc que α."]]), res = r6(c[2] * v);
        return QN("On sait que " + M("\\" + c[1] + " \\alpha = " + N(v)) + ". Que vaut " + M(c[0]) + " ?", res, c[3] + " " + M(c[0] + " = " + (c[2] < 0 ? "-" : "") + "\\" + c[1] + " \\alpha = " + N(res)) + ".",
          { ctx: "assoc-" + c[0].replace(/[^a-z0-9+-]/gi, ""), guide: [G("Même valeur (1) ou valeur opposée (−1) ?", c[2], c[3]), G(M(c[0]) + " = ?", res, M(N(res)) + ".")], traps: [TR(-res, "Dessine les deux angles sur le cercle : " + c[3]), TR(r6(Math.sqrt(1 - v * v)), "On reste avec la même fonction (" + c[1] + ").")] }); },
      () => { const deg = pk([150, 120, 135, 210, 225, 240, 300, 330, 315]), fn = pk(["sin", "cos"]), r = ref(deg), sgn = Math.sign(fn === "sin" ? sinD(deg) : cosD(deg));
        return QN("On sait que " + M("\\" + fn + " " + r + "° " + (Math.abs((fn === "sin" ? sinD(r) : cosD(r)) * 2 - Math.round((fn === "sin" ? sinD(r) : cosD(r)) * 2)) < 1e-9 ? "=" : "\\approx") + " " + N(Math.round((fn === "sin" ? sinD(r) : cosD(r)) * 100) / 100)) + ". Sans calculatrice, que vaut " + M("\\" + fn + " " + deg + "°") + " (au centième) ?", r6(Math.round(sgn * (fn === "sin" ? sinD(r) : cosD(r)) * 100) / 100), M(deg + "°") + " a pour angle de référence " + M(r + "°") + " ; dans le quadrant " + quad(deg) + ", " + fn + " est " + (sgn > 0 ? "positif" : "négatif") + ".",
          { ctx: "reference", round: 0.01, guide: [G("Angle de référence de " + M(deg + "°") + " ?", r, M(r + "°") + "."), G("Signe de " + M("\\" + fn) + " dans le quadrant " + quad(deg) + " (1 ou −1) ?", sgn, sgn > 0 ? "Positif." : "Négatif."), Gd("Valeur ?", r6(sgn * (fn === "sin" ? sinD(r) : cosD(r))), "Signe × valeur de référence.", 0.01)],
            traps: [TR(r6(-Math.round(sgn * (fn === "sin" ? sinD(r) : cosD(r)) * 100) / 100), "Vérifie le signe dans ce quadrant.")] }); },
      () => { const s = pk([0.6, 0.8, 0.28, 0.96, 0.6]), c = r6(Math.sqrt(1 - s * s));
        return QN("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin\\alpha = " + N(s)) + ". Calcule " + M("\\cos\\alpha") + ".", c, M("\\cos^2\\alpha = 1 - \\sin^2\\alpha = 1 - " + N(r6(s * s)) + " = " + N(r6(1 - s * s))) + ", " + M("\\cos\\alpha = " + N(c)) + " (positif, angle aigu).",
          { ctx: "pythagore", guide: [G(M("\\sin^2\\alpha") + " = ?", s * s, M(N(r6(s * s)))), G(M("\\cos^2\\alpha = 1 - \\sin^2\\alpha") + " = ?", 1 - s * s, M(N(r6(1 - s * s))) + "."), G(M("\\cos\\alpha") + " = ?", c, M(N(c)) + ".")], traps: [TR(r6(1 - s), "On travaille avec les carrés : cos² = 1 − sin²."), TR(r6(1 - s * s), "C'est cos² α ; prends la racine.")] }); },
    ],
    2: [
      () => { const v = pk([0.2, 0.3, 0.4, 0.6, 0.8, 0.25]), c = pk([["\\sin(90° - \\alpha)", "cos", "sin", 1], ["\\cos(90° - \\alpha)", "sin", "cos", 1], ["\\sin(90° + \\alpha)", "cos", "sin", 1], ["\\cos(90° + \\alpha)", "sin", "cos", -1]]), res = r6(c[3] * v);
        return QN("On sait que " + M("\\" + c[1] + " \\alpha = " + N(v)) + ". Que vaut " + M(c[0]) + " ?", res, "Avec " + M("90°") + ", sinus et cosinus s'échangent : " + M(c[0] + " = " + (c[3] < 0 ? "-" : "") + "\\" + c[1] + "\\alpha = " + N(res)) + ".",
          { ctx: "complementaire", guide: [G("Avec 90°, " + c[2] + " devient " + c[1] + ". Signe (1 ou −1) ?", c[3], c[3] > 0 ? "Positif." : "Négatif : cos(90° + α) = −sin α."), G(M(c[0]) + " = ?", res, M(N(res)) + ".")], traps: [TR(-res, "Attention au signe."), TR(r6(Math.sqrt(1 - v * v)), "Avec 90°, sin et cos s'échangent directement (pas besoin de Pythagore).")] }); },
      () => { const s = pk([0.6, 0.8, 0.28, 0.96]), c = r6(Math.sqrt(1 - s * s)), t = r6(s / c);
        return QN("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin\\alpha = " + N(s)) + ". Calcule " + M("\\tan\\alpha") + " (fraction ou décimal).", t, M("\\cos\\alpha = \\sqrt{1 - " + N(r6(s * s)) + "} = " + N(c)) + ", " + M("\\tan\\alpha = \\frac{" + N(s) + "}{" + N(c) + "} = " + fT(t)) + ".",
          { ctx: "tan", guide: [G(M("\\cos\\alpha") + " = ?", c, M(N(c)) + "."), G(M("\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}") + " = ?", t, M(fT(t)) + ".")], traps: [TR(r6(c / s), "tan = sin ÷ cos."), TR(c, "C'est cos α.")] }); },
      () => { const s = pk([0.6, 0.8, 0.28, 0.96]), c = r6(-Math.sqrt(1 - s * s));
        return QN("L'angle " + M("\\alpha") + " est obtus (entre 90° et 180°) et " + M("\\sin\\alpha = " + N(s)) + ". Calcule " + M("\\cos\\alpha") + ".", c, M("\\cos^2\\alpha = 1 - " + N(r6(s * s)) + " = " + N(r6(c * c))) + " ; angle obtus : cosinus négatif, " + M("\\cos\\alpha = " + N(c)) + ".",
          { ctx: "obtus", guide: [G(M("\\cos^2\\alpha") + " = ?", c * c, M(N(r6(c * c))) + "."), G("Signe du cosinus pour un angle obtus (1 ou −1) ?", -1, "Négatif (quadrant 2)."), G(M("\\cos\\alpha") + " = ?", c, M(N(c)) + ".")], traps: [TR(-c, "Angle obtus : le cosinus est négatif."), TR(r6(1 - s), "On travaille avec les carrés.")] }); },
    ],
    3: [
      () => { const c0 = pk([0.6, 0.8, -0.6, -0.8]), s0 = r6(Math.sqrt(1 - c0 * c0)) * pk([1, -1]), v = r6(s0 * s0 - c0 * c0);
        return QN("On sait que " + M("\\cos\\alpha = " + N(c0)) + ". Calcule " + M("\\sin^2\\alpha - \\cos^2\\alpha") + ".", v, M("\\sin^2\\alpha = 1 - \\cos^2\\alpha = " + N(r6(1 - c0 * c0))) + " ; " + M(N(r6(1 - c0 * c0)) + " - " + N(r6(c0 * c0)) + " = " + N(v)) + ". (Le signe de " + M("\\sin\\alpha") + " n'importe pas : il est au carré.)",
          { ctx: "expression", guide: [G(M("\\cos^2\\alpha") + " = ?", c0 * c0, M(N(r6(c0 * c0))) + "."), G(M("\\sin^2\\alpha = 1 - \\cos^2\\alpha") + " = ?", 1 - c0 * c0, M(N(r6(1 - c0 * c0))) + "."), G("Résultat ?", v, M(N(v)) + ".")], traps: [TR(-v, "C'est sin² − cos² (dans cet ordre)."), TR(1, "sin² + cos² = 1, mais ici c'est une différence.")] }); },
      () => { const v = pk([0.6, 0.8, 0.28, 0.3, 0.4]), res = r6(2 * v);
        return QN("On sait que " + M("\\sin\\alpha = " + N(v)) + ". Calcule " + M("\\sin(180° - \\alpha) - \\sin(180° + \\alpha)") + ".", res, M("\\sin(180° - \\alpha) = \\sin\\alpha") + " et " + M("\\sin(180° + \\alpha) = -\\sin\\alpha") + " : " + M(N(v) + " - (" + N(-v) + ") = " + N(res)) + ".",
          { ctx: "combinaison", guide: [G(M("\\sin(180° - \\alpha)") + " = ?", v, M(N(v)) + " (même ordonnée)."), G(M("\\sin(180° + \\alpha)") + " = ?", -v, M(N(-v)) + " (ordonnée opposée)."), G("Résultat ?", res, M(N(v) + " - (" + N(-v) + ") = " + N(res)) + ".")], traps: [TR(0, "Attention aux signes : − (−sin α) = + sin α."), TR(v, "Les deux termes s'additionnent.")] }); },
      () => { const c = pk([0.6, 0.8, 0.28, 0.96]), q = pk([4, 1]), sn = r6((q === 4 ? -1 : 1) * Math.sqrt(1 - c * c));
        return QN("On sait que " + M("\\cos\\alpha = " + N(c)) + " et que " + M("\\alpha") + " est dans le quadrant " + q + (q === 4 ? " (entre 270° et 360°)" : " (entre 0° et 90°)") + ". Calcule " + M("\\sin\\alpha") + ".", sn, M("\\sin^2\\alpha = 1 - " + N(r6(c * c)) + " = " + N(r6(1 - c * c))) + " ; dans le quadrant " + q + ", le sinus est " + (q === 4 ? "négatif" : "positif") + " : " + M("\\sin\\alpha = " + N(sn)) + ".",
          { ctx: "quadrant-" + q, guide: [G(M("\\sin^2\\alpha") + " = ?", 1 - c * c, M(N(r6(1 - c * c))) + "."), G("Signe du sinus dans le quadrant " + q + " (1 ou −1) ?", q === 4 ? -1 : 1, q === 4 ? "Négatif." : "Positif."), G(M("\\sin\\alpha") + " = ?", sn, M(N(sn)) + ".")], traps: [TR(-sn, "Le signe dépend du quadrant."), TR(r6(1 - c), "On travaille avec les carrés.")] }); },
    ],
  };

  // ===================== B6. trigeq2 : équations sin(bx), modèles sinusoïdaux =====================
  const T2 = {
    1: [
      () => { const r = pk([30, 45, 60, 90]), fn = pk(["sin", "cos"]), b = 2, v = fn === "sin" ? sinD(r) : cosD(r), base = fn === "sin" ? (r === 90 ? [90] : [r, 180 - r]) : [r, 360 - r], sols = base.map((u) => u / b).concat(base.map((u) => (u + 360) / b)).filter((x) => x < 360).sort((a, c) => a - c);
        return QSet("Résous " + M("\\" + fn + "(2x) = " + exT(v)) + " pour " + M("0° \\le x < 360°") + ". Sépare les solutions par « ; » (en degrés).", sols, "On pose " + M("u = 2x") + ", avec " + M("0° \\le u < 720°") + " (deux tours). " + M("\\" + fn + " u = " + exT(v)) + " : " + M("u = " + base.join("° ; ") + "°") + " (+ 360°). Puis " + M("x = \\frac{u}{2}") + " : " + sols.map((x) => M(x + "°")).join(", ") + ".",
          { ctx: "double-" + fn, guide: [GSet("Solutions de " + M("\\" + fn + " u = " + exT(v)) + " pour " + M("0° \\le u < 360°") + " ?", base, base.map((x) => M(x + "°")).join(" et ") + "."), GSet("Comme " + M("u = 2x") + " fait deux tours, ajoute aussi 360° à chaque solution, puis divise par 2. Solutions en " + M("x") + " ?", sols, sols.map((x) => M(x + "°")).join(", ") + ".")],
            traps: [TSet(base.map((u) => u / b), "Avec 2x, l'angle fait deux tours : il y a deux fois plus de solutions."), TSet(base, "On a trouvé u = 2x ; il faut encore diviser par 2.")] }); },
      () => { const a = pk([2, 3, 4]), d = R.int(1, 6), M2 = d + a, m = d - a, ask = pk(["max", "min"]), c = pk([["La température (en °C) dans une serre suit " + M("T(t) = " + d + " + " + a + "\\sin(15t)") + " (t en heures).", "serre"], ["Le niveau d'un bassin (en m) suit " + M("h(t) = " + d + " + " + a + "\\sin(30t)") + " (t en heures).", "bassin"]]);
        return QN(c[0] + " Quelle est sa valeur " + (ask === "max" ? "maximale" : "minimale") + " ?", ask === "max" ? M2 : m, M("\\sin") + " varie de −1 à 1 : la valeur va de " + M(d + " - " + a + " = " + m) + " à " + M(d + " + " + a + " = " + M2) + ".",
          { ctx: "modele-" + ask + "-" + c[1], guide: [G("Valeur " + (ask === "max" ? "maximale" : "minimale") + " de " + M("\\sin") + " ?", ask === "max" ? 1 : -1, ask === "max" ? "1." : "−1."), G("Valeur " + (ask === "max" ? "maximale" : "minimale") + " du modèle ?", ask === "max" ? M2 : m, M(ask === "max" ? M2 : m) + ".")], traps: [TR(ask === "max" ? a : -a, "N'oublie pas la valeur moyenne " + d + "."), TR(ask === "max" ? m : M2, ask === "max" ? "Le maximum, c'est la moyenne PLUS l'amplitude." : "Le minimum, c'est la moyenne MOINS l'amplitude.")] }); },
      () => { const b = pk([15, 30, 45, 60, 20]), per = 360 / b, c = pk([["La hauteur de la marée (en m) est modélisée par", "h"], ["La hauteur d'une cabine de grande roue (en dizaines de m) est modélisée par", "min"], ["La température sur une journée (en dizaines de °C) est modélisée par", "h"]]);
        return QN(c[0] + " " + M("f(t) = 3 + 2\\sin(" + b + "t)") + " (t en " + c[1] + ", angle en degrés). Quelle est la période (en " + c[1] + ") ?", per, "Le sinus fait un tour complet quand " + M(b + "t") + " augmente de 360° : " + M("T = \\frac{360}{" + b + "} = " + N(per)) + " " + c[1] + ".",
          { ctx: "periode-" + c[1], guide: [G("Un cycle complet correspond à 360°. Pour quel " + M("t") + " a-t-on " + M(b + "t = 360") + " ?", per, M(N(per)) + " " + c[1] + ".")], traps: [TR(360 * b, "On divise 360 par " + b + "."), TR(b, "C'est la vitesse angulaire (degrés par " + c[1] + "), pas la période."), TR(per / 2, "Au bout d'une demi-période, f reprend la valeur 3, mais en descendant : la courbe n'a pas encore fait un cycle complet (montée ET descente).")] }); },
    ],
    2: [
      () => { const M2 = R.int(5, 14), m = R.int(0, M2 - 2), a = (M2 - m) / 2, d = (M2 + m) / 2, ask = pk(["a", "d"]);
        return QN("Une sinusoïde d'équation " + M("f(x) = a\\sin(x) + d") + " (avec " + M("a > 0") + ") a pour maximum " + M(M2) + " et pour minimum " + M(m) + ". Que vaut " + M(ask) + " ?", ask === "a" ? a : d, M("a = \\frac{" + M2 + " - " + m + "}{2} = " + N(a)) + " (amplitude) ; " + M("d = \\frac{" + M2 + " + " + m + "}{2} = " + N(d)) + " (valeur moyenne).",
          { ctx: "sinusoide-" + ask, guide: [G(ask === "a" ? "Amplitude = (max − min) ÷ 2 ?" : "Valeur moyenne = (max + min) ÷ 2 ?", ask === "a" ? a : d, M(N(ask === "a" ? a : d)) + ".")], traps: [TR(ask === "a" ? M2 - m : M2 + m, "N'oublie pas de diviser par 2."), TR(ask === "a" ? d : a, ask === "a" ? "Ça, c'est d." : "Ça, c'est a.")] }); },
      () => { const d = R.int(3, 6), a = R.int(1, d - 1), b = pk([30, 15]), t = pk([1, 2, 3, 5, 7, 9]), ang = b * t, s = sinD(ang), v = r6(d + a * s); if (!Number.isInteger(v * 2)) return null;
        return QN("La hauteur d'eau d'un port (en m) est " + M("h(t) = " + d + " + " + a + "\\sin(" + b + "t)") + " (t en heures après minuit). Quelle est la hauteur à " + M(t + "\\text{ h}") + " ?", v, M("h(" + t + ") = " + d + " + " + a + "\\sin(" + ang + "°) = " + d + " + " + a + " \\cdot " + pT(s) + " = " + N(v)) + " m.",
          { ctx: "port-hauteur", guide: [G("Angle " + M(b + " \\cdot " + t) + " (en degrés) ?", ang, M(ang + "°") + "."), G(M("\\sin " + ang + "°") + " = ?", s, M(exT(s)) + "."), G("Hauteur ?", v, M(N(v)) + " m.")], traps: [TR(r6(d + a * cosD(ang)), "C'est un sinus, pas un cosinus."), TR(r6((d + a) * s), "On multiplie seulement a par le sinus, puis on ajoute d.")] }); },
      () => { const d = R.int(3, 6), a = R.int(1, d - 1), b = pk([30, 15, 45]), t = r6(90 / b);
        return QN("La hauteur d'eau d'un port (en m) est " + M("h(t) = " + d + " + " + a + "\\sin(" + b + "t)") + " (t en heures après minuit). À quelle heure la marée est-elle haute pour la première fois ?", t, "Le sinus vaut 1 pour un angle de 90° : " + M(b + "t = 90") + ", " + M("t = " + N(t)) + " h (hauteur " + M(d + a) + " m).",
          { ctx: "port-heure", guide: [G("Pour quel angle (en degrés) le sinus est-il maximal ?", 90, "90°."), G(M(b + "t = 90") + " : " + M("t") + " = ?", t, M(N(t)) + " h.")], traps: [TR(d + a, "C'est la hauteur maximale ; on demande l'heure."), TR(r6(360 / b), "C'est la période (une marée complète).")] }); },
    ],
    3: [
      () => { const d = R.int(4, 8), a = R.int(2, d - 1), b = pk([30, 15]), k = pk([0.5, -0.5]), target = r6(d + a * k), base = k > 0 ? [30, 150] : [210, 330], ts = base.map((u) => r6(u / b)).filter((x) => x < 360 / b);
        return QSet("Un port : " + M("h(t) = " + d + " + " + a + "\\sin(" + b + "t)") + " (en m, t en heures). Pendant le premier cycle (" + M("0 \\le t < " + 360 / b) + "), à quels instants la hauteur vaut-elle " + M(N(target)) + " m ? Sépare par « ; ».", ts, M(d + " + " + a + "\\sin(" + b + "t) = " + N(target)) + " ⇒ " + M("\\sin(" + b + "t) = " + exT(k)) + " ⇒ " + M(b + "t = " + base.join("° \\text{ ou } ") + "°") + " ⇒ " + M("t = " + ts.map(N).join(" \\text{ ou } ")) + " h.",
          { ctx: "port-equation", guide: [G("On isole : " + M("\\sin(" + b + "t)") + " = ?", k, M(exT(k)) + "."), GSet("Angles " + M(b + "t") + " (entre 0° et 360°) ?", base, base.map((x) => M(x + "°")).join(" et ") + "."), GSet("Instants " + M("t") + " (on divise par " + b + ") ?", ts, ts.map((x) => M(N(x))).join(" et ") + " h.")],
            traps: [TSet(base, "Ce sont les angles ; il faut diviser par " + b + " pour obtenir t."), TSet([ts[0]], "Le sinus prend cette valeur deux fois par cycle.")] }); },
      () => { const D = pk([40, 50, 60, 80]), c = pk([4, 5, 10]), T = pk([8, 10, 12, 20]), r = D / 2, hc = r + c, ask = pk(["max", "min"]), v = ask === "max" ? hc + r : hc - r;
        return QN("Une grande roue a un diamètre de " + M(D) + " m ; son axe est à " + M(hc) + " m du sol, et un tour dure " + M(T) + " minutes. On modélise la hauteur d'une cabine par " + M("h(t) = " + hc + " - " + r + "\\cos\\left(\\frac{360}{" + T + "} t\\right)") + ". Quelle est la hauteur " + (ask === "max" ? "maximale" : "minimale") + " d'une cabine (en m) ?", v,
          M("\\cos") + " varie de −1 à 1 : " + M("h") + " varie de " + M(hc + " - " + r + " = " + (hc - r)) + " à " + M(hc + " + " + r + " = " + (hc + r)) + " m.",
          { ctx: "roue-" + ask, guide: [G("Pour la hauteur " + (ask === "max" ? "maximale" : "minimale") + ", " + M("\\cos") + " doit valoir ?", ask === "max" ? -1 : 1, ask === "max" ? "−1 (le terme soustrait devient positif)." : "1 (on soustrait le rayon)."), G("Hauteur " + (ask === "max" ? "maximale" : "minimale") + " ?", v, M(N(v)) + " m.")],
            traps: [TR(ask === "max" ? hc - r : hc + r, ask === "max" ? "Ça, c'est la hauteur minimale." : "Ça, c'est la hauteur maximale."), TR(ask === "max" ? D : 0, ask === "max" ? "La roue est surélevée : hauteur de l'axe + rayon." : "La roue ne touche pas le sol : hauteur de l'axe − rayon.")] }); },
      () => { const b = pk([2, 3]), sols = Array.from({ length: 2 * b }, (_, k) => (90 + 180 * k) / b).filter((x) => x < 360);
        return QSet("Résous " + M("\\cos(" + b + "x) = 0") + " pour " + M("0° \\le x < 360°") + ". Sépare les solutions par « ; ».", sols, M("\\cos u = 0") + " pour " + M("u = 90° + k \\cdot 180°") + ". Avec " + M("u = " + b + "x") + " : " + M("x = \\frac{90° + k \\cdot 180°}{" + b + "}") + " : " + sols.map((x) => M(x + "°")).join(", ") + ".",
          { ctx: "cos-bx-0", guide: [GSet("Solutions de " + M("\\cos u = 0") + " pour " + M("0° \\le u < 360°") + " ?", [90, 270], M("90°") + " et " + M("270°") + "."), G("Combien de tours fait " + M("u = " + b + "x") + " quand " + M("x") + " va de 0° à 360° ?", b, M(b) + " tours."), GSet("Toutes les solutions en " + M("x") + " ?", sols, sols.map((x) => M(x + "°")).join(", ") + ".")],
            traps: [TSet([90 / b, 270 / b], "u = " + b + "x fait " + b + " tours : il y a " + 2 * b + " solutions."), TSet([90, 270], "Il faut diviser par " + b + ".")] }); },
    ],
  };

  // ===================== B7. triaire : aire d'un triangle quelconque, problèmes =====================
  const TAi = {
    1: [
      () => { const a = R.int(4, 15), b = R.int(4, 15), g = pk([30, 150, 90]), A = r6(a * b * sinD(g) / 2);
        return QN("Un triangle a deux côtés de " + M(a) + " cm et " + M(b) + " cm, qui forment un angle de " + M(g + "°") + ". Calcule son aire (en cm²).", A, M("\\mathcal{A} = \\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\cdot \\sin " + g + "° = \\frac{1}{2} \\cdot " + a * b + " \\cdot " + exT(sinD(g)) + " = " + N(A)) + " cm².",
          { ctx: "exact", fig: TRI(["a = " + a, "b = " + b, "", "γ = " + g + "°", "C"]), guide: [G(M("\\sin " + g + "°") + " = ?", sinD(g), M(exT(sinD(g))) + "."), G("Aire " + M("= \\frac{1}{2}ab\\sin\\gamma") + " ?", A, M(N(A)) + " cm².")], traps: [TR(r6(a * b * sinD(g)), "N'oublie pas le facteur 1/2."), TR(r6(a * b / 2), "Il faut multiplier par sin γ (sauf si l'angle est droit).")] }); },
      () => { const a = R.int(4, 15), b = R.int(4, 15), g = pk([35, 40, 50, 65, 70, 110, 125]), A = r6(a * b * Math.sin(g * D2R) / 2);
        return QRd("Un triangle a deux côtés de " + M(a) + " cm et " + M(b) + " cm, qui forment un angle de " + M(g + "°") + ". Calcule son aire (au centième, en cm²).", A, M("\\mathcal{A} = \\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\cdot \\sin " + g + "° \\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01,
          { ctx: "calculatrice", fig: TRI(["a = " + a, "b = " + b, "", "γ = " + g + "°", "C"]), guide: [Gd(M("\\sin " + g + "°") + " ≈ ? (au millième)", r6(Math.sin(g * D2R)), M("\\approx " + N(Math.round(Math.sin(g * D2R) * 1000) / 1000)) + ".", 0.001), Gd("Aire ≈ ?", A, M("\\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01)], traps: [TR(r6(2 * A), "N'oublie pas le facteur 1/2."), TR(r6(a * b * Math.cos(g * D2R) / 2), "C'est le sinus de l'angle compris (pas le cosinus).")] }); },
      () => { const a = R.int(4, 12), b = R.int(4, 12), al = pk([30, 45, 60, 120, 150]), A = r6(a * b * Math.sin(al * D2R));
        return QRd("Un parallélogramme a des côtés de " + M(a) + " cm et " + M(b) + " cm, qui forment un angle de " + M(al + "°") + ". Calcule son aire (au centième, en cm²).", A, "Deux triangles égaux : " + M("\\mathcal{A} = " + a + " \\cdot " + b + " \\cdot \\sin " + al + "° \\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01,
          { ctx: "parallelogramme", guide: [Gd("Aire d'un des deux triangles (diagonale) " + M("= \\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\cdot \\sin " + al + "°") + " ≈ ?", r6(A / 2), M("\\approx " + N(Math.round(A / 2 * 100) / 100)) + ".", 0.01), Gd("Aire du parallélogramme ≈ ?", A, M("\\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01)], traps: [TR(r6(A / 2), "C'est un seul triangle : le parallélogramme en contient deux."), TR(a * b, "Il faut multiplier par sin " + al + "° (ce n'est pas un rectangle).")] }); },
    ],
    2: [
      () => { const a = R.int(20, 80), b = R.int(20, 80), g = R.int(35, 140), A = r6(a * b * Math.sin(g * D2R) / 2), c = pk(["Un terrain triangulaire", "Une parcelle de vigne triangulaire", "Un jardin triangulaire"]);
        return QRd(c + " a deux côtés de " + M(a) + " m et " + M(b) + " m, qui forment un angle de " + M(g + "°") + ". Quelle est son aire (en m², à l'unité) ?", A, M("\\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\cdot \\sin " + g + "° \\approx " + Math.round(A)) + " m².", 1,
          { ctx: "terrain", guide: [Gd("Aire " + M("= \\frac{1}{2}ab\\sin\\gamma") + " ≈ ? (à l'unité)", A, M("\\approx " + Math.round(A)) + " m².", 1)], traps: [TR(r6(2 * A), "N'oublie pas le facteur 1/2."), TR(r6(a * b / 2), "Multiplie par sin γ.")] }); },
      () => { const a = R.int(5, 12), b = R.int(5, 12), g = pk([30, 45, 60, 50, 70]), A = r6(a * b * Math.sin(g * D2R) / 2), Ar = Math.round(A * 100) / 100, gg = r6(Math.asin(2 * Ar / (a * b)) / D2R);
        return QRd("Un triangle a deux côtés de " + M(a) + " cm et " + M(b) + " cm et une aire de " + M(N(Ar)) + " cm². L'angle compris entre ces côtés est aigu. Combien mesure-t-il (au degré près) ?", gg, M("\\sin\\gamma = \\frac{2 \\cdot " + N(Ar) + "}{" + a + " \\cdot " + b + "} \\approx " + N(Math.round(2 * Ar / (a * b) * 1000) / 1000)) + ", " + M("\\gamma \\approx " + Math.round(gg) + "°") + ".", 1,
          { ctx: "angle-depuis-aire", guide: [Gd(M("\\sin\\gamma = \\frac{2\\mathcal{A}}{ab}") + " ≈ ? (au millième)", r6(2 * Ar / (a * b)), M("\\approx " + N(Math.round(2 * Ar / (a * b) * 1000) / 1000)) + ".", 0.001), Gd(M("\\gamma") + " ≈ ?", gg, M("\\approx " + Math.round(gg) + "°") + ".", 1)], traps: [TR(r6(Math.asin(Math.min(1, Ar / (a * b))) / D2R), "Aire = ½ ab sin γ : sin γ = 2 · aire ÷ (ab)."), TR(r6(180 - gg), "L'angle est aigu.")] }); },
      () => { const c = pk([4, 6, 8, 10]), A = r6(Math.sqrt(3) / 4 * c * c);
        return QRd("Calcule l'aire d'un triangle équilatéral de côté " + M(c) + " cm (au centième, en cm²).", A, "Deux côtés de " + M(c) + " cm forment un angle de 60° : " + M("\\mathcal{A} = \\frac{1}{2} \\cdot " + c + "^2 \\cdot \\sin 60° = \\frac{\\sqrt{3}}{4} \\cdot " + c * c + " \\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01,
          { ctx: "equilateral", guide: [G("Angle d'un triangle équilatéral ?", 60, "60°."), Gd("Aire " + M("= \\frac{1}{2} \\cdot " + c + " \\cdot " + c + " \\cdot \\sin 60°") + " ≈ ?", A, M("\\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01)], traps: [TR(c * c / 2, "Il faut multiplier par sin 60°."), TR(r6(Math.sqrt(3) / 2 * c * c), "N'oublie pas le facteur 1/2.")] }); },
    ],
    3: [
      () => { const v1 = R.int(3, 6), v2 = R.int(3, 6), t = pk([2, 3]), ang = pk([50, 60, 70, 80, 100, 120]), d1 = v1 * t, d2 = v2 * t, d = r6(Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(ang * D2R)));
        return QRd("Deux randonneurs partent du même refuge dans des directions qui forment un angle de " + M(ang + "°") + ", à " + M(v1) + " km/h et " + M(v2) + " km/h. Quelle distance les sépare après " + M(t) + " h (en km, au centième) ?", d, "Distances : " + M(d1) + " km et " + M(d2) + " km ; théorème du cosinus : " + M("d \\approx " + N(Math.round(d * 100) / 100)) + " km.", 0.01,
          { ctx: "randonneurs", guide: [G("Distance parcourue par le premier (km) ?", d1, M(d1) + " km."), G("Par le second ?", d2, M(d2) + " km."), Gd("Distance entre eux (théorème du cosinus) ≈ ?", d, M("\\approx " + N(Math.round(d * 100) / 100)) + " km.", 0.01)], traps: [TR(r6(Math.sqrt(d1 * d1 + d2 * d2)), "L'angle n'est pas droit : théorème du cosinus."), TR(r6(Math.sqrt(v1 * v1 + v2 * v2 - 2 * v1 * v2 * Math.cos(ang * D2R))), "C'est la distance après 1 h ; il faut les distances après " + t + " h.")] }); },
      () => { const c = pk([2, 3, 4, 5, 6]), A = r6(6 * Math.sqrt(3) / 4 * c * c);
        return QRd("Un hexagone régulier a des côtés de " + M(c) + " cm. Calcule son aire (au centième, en cm²).", A, "Il se découpe en 6 triangles équilatéraux de côté " + M(c) + " : " + M("\\mathcal{A} = 6 \\cdot \\frac{1}{2} \\cdot " + c + "^2 \\cdot \\sin 60° \\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01,
          { ctx: "hexagone", fig: FIG.regPoly(6, ""), guide: [G("En combien de triangles équilatéraux se découpe l'hexagone ?", 6, "6 (depuis le centre)."), Gd("Aire d'un triangle ≈ ?", r6(A / 6), M("\\approx " + N(Math.round(A / 6 * 100) / 100)) + " cm².", 0.01), Gd("Aire de l'hexagone ≈ ?", A, M("\\approx " + N(Math.round(A * 100) / 100)) + " cm².", 0.01)], traps: [TR(r6(A / 6), "C'est un seul des 6 triangles."), TR(6 * c * c / 2, "Multiplie par sin 60° dans chaque triangle.")] }); },
      () => { const a = R.int(6, 12), b = R.int(6, 12), g = pk([40, 50, 70, 110]), A = r6(a * b * Math.sin(g * D2R) / 2), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(g * D2R)), h = r6(2 * A / c);
        return QRd("Dans un triangle, deux côtés mesurent " + M(a) + " cm et " + M(b) + " cm et forment un angle de " + M(g + "°") + ". Calcule la hauteur relative au troisième côté (au centième, en cm).", h, "Aire " + M("\\approx " + N(Math.round(A * 100) / 100)) + " ; troisième côté " + M("\\approx " + N(Math.round(c * 100) / 100)) + " (cosinus) ; hauteur " + M("= \\frac{2\\mathcal{A}}{c} \\approx " + N(Math.round(h * 100) / 100)) + " cm.", 0.01,
          { ctx: "hauteur", guide: [Gd("Aire " + M("\\frac{1}{2}ab\\sin\\gamma") + " ≈ ?", A, M("\\approx " + N(Math.round(A * 100) / 100)) + ".", 0.01), Gd("Troisième côté (théorème du cosinus) ≈ ?", r6(c), M("\\approx " + N(Math.round(c * 100) / 100)) + ".", 0.01), Gd("Hauteur " + M("= \\frac{2\\mathcal{A}}{c}") + " ≈ ?", h, M("\\approx " + N(Math.round(h * 100) / 100)) + " cm.", 0.01)], traps: [TR(r6(A / c), "Aire = base × hauteur ÷ 2 : hauteur = 2 · aire ÷ base."), TR(r6(a * Math.sin(g * D2R)), "C'est la hauteur relative au côté b, pas au troisième côté.")] }); },
    ],
  };

  // ===================================== C. ANALYSE DE DONNÉES =====================================
  const sum = (a) => a.reduce((x, y) => x + y, 0), srt = (a) => a.slice().sort((x, y) => x - y);
  const med = (s) => (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2);
  const lst = (a) => M(a.map((v) => N(v)).join(" \\,;\\, "));
  const tab = (vals, effs, h1, h2) => M("\\begin{array}{c|" + "c".repeat(vals.length) + "} \\text{" + h1 + "} & " + vals.map(N).join(" & ") + " \\\\ \\hline \\text{" + h2 + "} & " + effs.join(" & ") + " \\end{array}");

  // ===================== C1. statfreq : effectifs, fréquences, diagramme circulaire =====================
  const SF = {
    1: [
      () => { const n = pk([20, 25, 40, 50, 80]), k = R.int(2, n - 2), f = r6(100 * k / n); if (!Number.isInteger(f * 10)) return null; const c = pk([["Dans une classe de " + M(n) + " apprentis, " + M(k) + " viennent en train.", "viennent en train"], ["Sur " + M(n) + " réponses à un sondage, " + M(k) + " sont « oui ».", "ont répondu « oui »"], ["Sur " + M(n) + " clients d'un magasin, " + M(k) + " paient par carte.", "paient par carte"]]);
        return QN(c[0] + " Quelle est la fréquence (en %) de ceux qui " + c[1] + " ?", f, "Fréquence " + M("= \\frac{" + k + "}{" + n + "} = " + N(r6(k / n)) + " = " + N(f) + "\\,\\%") + ".",
          { ctx: "frequence", guide: [G("Fréquence en décimal " + M("\\frac{" + k + "}{" + n + "}") + " ?", k / n, M(N(r6(k / n)))), G("En pour cent ?", f, M(N(f) + "\\,\\%") + ".")], traps: [TR(k, "C'est l'effectif ; la fréquence est effectif ÷ total."), TR(r6(100 * n / k), "Effectif ÷ total (et non l'inverse).")] }); },
      () => { const n = pk([200, 300, 400, 500, 800, 1200]), p = pk([15, 20, 25, 35, 40, 45, 60, 65]), k = n * p / 100;
        return QN("Dans un sondage auprès de " + M(N(n)) + " personnes, " + M(p + "\\,\\%") + " ont répondu « oui ». Combien de personnes ont répondu « oui » ?", k, M(p + "\\,\\% \\text{ de } " + N(n) + " = " + N(r6(p / 100)) + " \\cdot " + N(n) + " = " + N(k)) + ".",
          { ctx: "effectif", guide: [G(M(p + "\\,\\%") + " en décimal ?", p / 100, M(N(r6(p / 100)))), G("Effectif ?", k, M(N(k)) + ".")], traps: [TR(p, "C'est la fréquence ; on demande un nombre de personnes."), TR(n - k, "Ce sont celles qui n'ont pas répondu « oui ».")] }); },
      () => { const vals = [1, 2, 3, 4], effs = vals.map(() => R.int(2, 9)), n = sum(effs), i = R.int(0, 3), f = r6(100 * effs[i] / n); if (!Number.isInteger(f * 10)) return null;
        return QN("Nombre de frères et sœurs des apprentis d'une classe : " + tab(vals, effs, "frères et sœurs", "effectif") + ". Quelle est la fréquence (en %) de la valeur " + M(vals[i]) + " ?", f, "Effectif total " + M(n) + " ; fréquence " + M("\\frac{" + effs[i] + "}{" + n + "} = " + N(f) + "\\,\\%") + ".",
          { ctx: "tableau", guide: [G("Effectif total ?", n, M(effs.join(" + ") + " = " + n) + "."), G("Fréquence (en %) de " + M(vals[i]) + " ?", f, M(N(f) + "\\,\\%") + ".")], traps: [TR(effs[i], "C'est l'effectif ; divise par le total."), TR(r6(100 * effs[i] / 4), "Le total est la somme des effectifs, pas le nombre de colonnes.")] }); },
    ],
    2: [
      () => { const vals = [0, 1, 2, 3, 4], effs = vals.map(() => R.int(1, 9)), lim = pk([2, 3]), k = sum(effs.slice(0, lim)), c = pk(["retards relevés par apprenti", "livres lus pendant les vacances"]);
        return QN("Nombre de " + c + " : " + tab(vals, effs, "nombre", "effectif") + ". Combien de personnes en ont moins de " + M(lim) + " ?", k, "Moins de " + lim + " : valeurs " + vals.slice(0, lim).join(", ") + " : " + M(effs.slice(0, lim).join(" + ") + " = " + k) + " (effectif cumulé).",
          { ctx: "cumule", guide: [G("Quelles valeurs comptent (« moins de " + lim + " ») ? Combien y en a-t-il ?", lim, vals.slice(0, lim).join(", ") + "."), G("Somme de leurs effectifs ?", k, M(k) + ".")], traps: [TR(k + effs[lim], "« Moins de " + lim + " » : la valeur " + lim + " n'est pas comprise."), TR(effs[lim - 1], "On additionne les effectifs de toutes les valeurs plus petites.")] }); },
      () => { const vals = pk([[4, 4.5, 5, 5.5, 6], [3, 3.5, 4, 4.5, 5, 5.5]]), effs = vals.map(() => R.int(1, 8)), mx = Math.max(...effs); if (effs.filter((e) => e === mx).length > 1) return null; const mode = vals[effs.indexOf(mx)];
        return QN("Notes d'un test : " + tab(vals, effs, "note", "effectif") + ". Quel est le mode de cette série ?", mode, "Le mode est la valeur la plus fréquente : " + M(N(mode)) + " (effectif " + mx + ").",
          { shownOk: true, ctx: "mode", guide: [G("Plus grand effectif ?", mx, M(mx) + "."), G("Valeur correspondante (le mode) ?", mode, M(N(mode)) + ".")], traps: [TR(mx, "Le mode est la VALEUR la plus fréquente, pas son effectif."), TR(Math.max(...vals), "Le mode n'est pas la plus grande valeur.")] }); },
      () => { const vals = [1, 2, 3, 4, 5], effs = vals.map(() => R.int(2, 9)), n = sum(effs), lim = pk([2, 3]), f = r6(100 * sum(effs.slice(0, lim)) / n); if (!Number.isInteger(f * 10)) return null;
        return QN("Nombre de pièces d'un appartement, dans un immeuble : " + tab(vals, effs, "pièces", "effectif") + ". Quel pourcentage des appartements a au plus " + M(lim) + " pièces ?", f, M("\\frac{" + effs.slice(0, lim).join(" + ") + "}{" + n + "} = \\frac{" + sum(effs.slice(0, lim)) + "}{" + n + "} = " + N(f) + "\\,\\%") + " (fréquence cumulée).",
          { ctx: "frequence-cumulee", guide: [G("Effectif des appartements d'au plus " + lim + " pièces ?", sum(effs.slice(0, lim)), M(sum(effs.slice(0, lim))) + "."), G("Effectif total ?", n, M(n) + "."), G("Pourcentage ?", f, M(N(f) + "\\,\\%") + ".")], traps: [TR(r6(100 * sum(effs.slice(0, lim - 1)) / n), "« Au plus " + lim + " » : la valeur " + lim + " est comprise."), TR(sum(effs.slice(0, lim)), "C'est un effectif ; on demande un pourcentage.")] }); },
    ],
    3: [
      () => { const n = pk([20, 24, 30, 36, 40, 60, 72]), k = R.int(2, n - 2), a = r6(360 * k / n); if (!Number.isInteger(a)) return null;
        return QN("Sur " + M(n) + " personnes interrogées, " + M(k) + " ont choisi la réponse A. Dans un diagramme circulaire, quel est l'angle (en degrés) du secteur « A » ?", a, M("\\frac{" + k + "}{" + n + "} \\cdot 360° = " + a + "°") + ".",
          { ctx: "angle", fig: FIG.sector("", a, "?"), guide: [G("Fréquence " + M("\\frac{" + k + "}{" + n + "}") + " (fraction ou décimal) ?", k / n, M(fT(k / n)) + "."), G("Angle = fréquence × 360° ?", a, M(a + "°") + ".")], traps: [TR(r6(100 * k / n), "C'est un pourcentage ; un tour complet fait 360°."), TR(r6(180 * k / n), "Le cercle entier fait 360°, pas 180°.")] }); },
      () => { const a = pk([36, 54, 72, 90, 108, 126, 144, 162, 18]), f = r6(100 * a / 360);
        return QN("Dans un diagramme circulaire, un secteur mesure " + M(a + "°") + ". Quelle fréquence (en %) représente-t-il ?", f, M("\\frac{" + a + "}{360} = " + N(r6(a / 360)) + " = " + N(f) + "\\,\\%") + ".",
          { ctx: "angle-vers-pourcent", fig: FIG.sector("", a, a + "°"), guide: [G("Fraction du tour " + M("\\frac{" + a + "}{360}") + " en décimal ?", a / 360, M(N(r6(a / 360))) + "."), G("En pour cent ?", f, M(N(f) + "\\,\\%") + ".")], traps: [TR(a, "C'est l'angle ; divise par 360."), TR(r6(100 * a / 180), "Un tour complet fait 360°.")] }); },
      () => { const n = pk([120, 180, 240, 360, 600]), a = pk([30, 45, 60, 90, 120, 150]), k = n * a / 360;
        return QN("Un diagramme circulaire représente les " + M(n) + " élèves d'une école. Le secteur « vélo » mesure " + M(a + "°") + ". Combien d'élèves viennent à vélo ?", k, M("\\frac{" + a + "}{360} \\cdot " + n + " = " + k) + " élèves.",
          { ctx: "angle-vers-effectif", fig: FIG.sector("", a, a + "°"), guide: [G("Fraction du tour " + M("\\frac{" + a + "}{360}") + " (fraction ou décimal) ?", a / 360, M(fT(a / 360)) + "."), G("Effectif ?", k, M(k) + " élèves.")], traps: [TR(a, "C'est l'angle, pas un nombre d'élèves."), TR(r6(n * a / 100), "L'angle se compare à 360°, pas à 100.")] }); },
    ],
  };

  // ===================== C2. stats : moyenne, mode, médiane, écart-type =====================
  const ST = {
    1: [
      () => { const n = pk([5, 6, 8]), xs = Array.from({ length: n }, () => R.int(2, 30)), m = sum(xs) / n; if (!Number.isInteger(m * 4)) return null;
        return QN("Calcule la moyenne de la série : " + lst(xs) + ".", m, M("\\frac{" + xs.join(" + ") + "}{" + n + "} = \\frac{" + sum(xs) + "}{" + n + "} = " + N(m)) + ".",
          { ctx: "moyenne", guide: [G("Somme des valeurs ?", sum(xs), M(sum(xs)) + "."), G("Moyenne (somme ÷ nombre de valeurs) ?", m, M(sum(xs) + " \\div " + n + " = " + N(m)) + ".")], traps: [TR(med(srt(xs)), "C'est la médiane ; la moyenne = somme ÷ effectif."), TR(r6(sum(xs) / (n - 1)), "On divise par le nombre de valeurs (" + n + ").")] }); },
      () => { const vals = [4, 4.5, 5, 5.5, 6], effs = vals.map(() => R.int(1, 6)), n = sum(effs), s = sum(vals.map((v, i) => v * effs[i])), m = r6(s / n); if (!Number.isInteger(m * 100)) return null;
        return QN("Notes d'un test : " + tab(vals, effs, "note", "effectif") + ". Calcule la moyenne de la classe (au centième).", m, "Moyenne pondérée : " + M("\\frac{" + vals.map((v, i) => N(v) + " \\cdot " + effs[i]).join(" + ") + "}{" + n + "} = \\frac{" + N(s) + "}{" + n + "} = " + N(m)) + ".",
          { ctx: "ponderee", guide: [G("Somme des notes × effectifs ?", s, M(N(s)) + "."), G("Effectif total ?", n, M(n) + "."), G("Moyenne ?", m, M(N(m)) + ".")], traps: [TR(r6(sum(vals) / vals.length), "Chaque note compte autant de fois que son effectif (moyenne pondérée)."), TR(r6(s / vals.length), "On divise par l'effectif total, pas par le nombre de notes différentes.")] }); },
      () => { const base = R.int(10, 40), xs = [base, base + R.int(1, 5), base, base + R.int(6, 9), base + R.int(10, 14), base - R.int(1, 4), base], s = xs.slice().sort(() => R.rand() - 0.5);
        return QN("Quel est le mode de la série : " + lst(s) + " ?", base, "Le mode est la valeur qui apparaît le plus souvent : " + M(base) + " (3 fois).",
          { shownOk: true, ctx: "mode", guide: [G("Quelle valeur apparaît le plus souvent ?", base, M(base) + ", 3 fois.")], traps: [TR(3, "3, c'est le nombre de fois ; le mode est la valeur."), TR(r6(sum(xs) / xs.length), "Le mode n'est pas la moyenne.")] }); },
    ],
    2: [
      () => { const n = pk([7, 8, 9, 10]), xs = Array.from({ length: n }, () => R.int(1, 40)), s = srt(xs), m = med(s);
        return QN("Donne la médiane de la série : " + lst(xs) + ".", m, "Série triée : " + lst(s) + ". " + (n % 2 ? "Effectif impair : valeur du milieu (" + ((n + 1) / 2) + "e), " + M(N(m)) : "Effectif pair : moyenne des " + n / 2 + "e et " + (n / 2 + 1) + "e valeurs, " + M("\\frac{" + s[n / 2 - 1] + " + " + s[n / 2] + "}{2} = " + N(m))) + ".",
          { shownOk: true, ctx: n % 2 ? "mediane-impair" : "mediane-pair", guide: [G("On trie la série. Plus petite valeur ?", s[0], M(s[0]) + " (série triée : " + s.join(" ; ") + ")."), G("Médiane ?", m, M(N(m)) + ".")], traps: [TR(n % 2 ? xs[(n - 1) / 2] : (xs[n / 2 - 1] + xs[n / 2]) / 2, "Il faut d'abord TRIER la série."), TR(r6(sum(xs) / n), "C'est la moyenne.")] }); },
      () => { const n = pk([4, 5]), xs = Array.from({ length: n - 1 }, () => R.int(3, 6) + pk([0, 0.5])), target = pk([4.5, 5]), miss = r6(target * n - sum(xs)); if (miss < 1 || miss > 6 || !Number.isInteger(miss * 2)) return null;
        return QN(who() + " a eu les notes " + lst(xs) + ". Quelle note lui faut-il au prochain test pour avoir exactement " + M(N(target)) + " de moyenne ?", miss, "Il faut une somme de " + M(N(target) + " \\cdot " + n + " = " + N(target * n)) + " ; on a déjà " + M(N(sum(xs))) + " : " + M(N(target * n) + " - " + N(sum(xs)) + " = " + N(miss)) + ".",
          { ctx: "valeur-manquante", guide: [G("Somme nécessaire (" + n + " notes de moyenne " + N(target).replace("{,}", ",") + ") ?", target * n, M(N(target * n)) + "."), G("Somme actuelle ?", sum(xs), M(N(sum(xs))) + "."), G("Note nécessaire ?", miss, M(N(miss)) + ".")], traps: [TR(target, "Il faut compenser les notes précédentes."), TR(r6(target * (n - 1) - sum(xs) + target), "La moyenne porte sur " + n + " notes au total.")] }); },
      () => { const vals = [1, 2, 3, 4, 5], effs = vals.map(() => R.int(1, 6)), n = sum(effs); if (n % 2 === 0) return null; const s = vals.flatMap((v, i) => Array(effs[i]).fill(v)), m = med(s), pos = (n + 1) / 2;
        return QN("Nombre de pièces d'un appartement : " + tab(vals, effs, "pièces", "effectif") + ". Quelle est la médiane du nombre de pièces ?", m, "Effectif total " + M(n) + " (impair) : la médiane est la " + pos + "e valeur. Effectifs cumulés : " + effs.map((_, i) => sum(effs.slice(0, i + 1))).join(", ") + " → " + M(m) + " pièces.",
          { shownOk: true, ctx: "mediane-tableau", guide: [G("Effectif total ?", n, M(n) + "."), G("Rang de la médiane (" + M("\\frac{n + 1}{2}") + ") ?", pos, M(pos) + "e valeur."), G("Valeur à ce rang (effectifs cumulés) ?", m, M(m) + ".")], traps: [TR(3, "La médiane n'est pas la valeur du milieu du tableau : compte les effectifs."), TR(r6(sum(vals.map((v, i) => v * effs[i])) / n), "C'est la moyenne.")] }); },
    ],
    3: [
      () => { const n = pk([4, 5, 6]), m0 = R.int(5, 20), xs = Array.from({ length: n }, () => m0 + R.int(-6, 6)), m = sum(xs) / n, v = sum(xs.map((x) => (x - m) ** 2)) / n, sd = Math.sqrt(v); if (!Number.isInteger(m * 2)) return null;
        return QRd("Calcule l'écart-type " + M("\\sigma") + " de la série " + lst(xs) + " (au centième).", sd, "Moyenne " + M(N(m)) + " ; variance " + M("\\frac{" + xs.map((x) => "(" + x + " - " + N(m) + ")^2").join(" + ") + "}{" + n + "} \\approx " + N(Math.round(v * 100) / 100)) + " ; " + M("\\sigma = \\sqrt{\\text{variance}} \\approx " + N(Math.round(sd * 100) / 100)) + ".", 0.01,
          { ctx: "ecart-type", guide: [G("Moyenne ?", m, M(N(m)) + "."), Gd("Variance (moyenne des carrés des écarts) ≈ ? (au centième)", v, M("\\approx " + N(Math.round(v * 100) / 100)) + ".", 0.01), Gd("Écart-type " + M("\\sigma") + " ≈ ?", sd, M("\\approx " + N(Math.round(sd * 100) / 100)) + ".", 0.01)], traps: [TR(r6(v), "C'est la variance ; l'écart-type est sa racine."), TR(r6(Math.sqrt(v * n / (n - 1))), "Ici, on divise par n (" + n + "), pas par n − 1.")] }); },
      () => { const sd = pk([1.2, 1.5, 2, 2.5, 3.4, 0.8]), k = pk([2, 3, 10]), m = R.int(10, 40);
        return QN("Une série a une moyenne de " + M(m) + " et un écart-type de " + M(N(sd)) + ". On multiplie toutes les valeurs par " + M(k) + ". Quel est le nouvel écart-type ?", r6(sd * k), "Multiplier toutes les valeurs par " + k + " multiplie aussi les écarts à la moyenne par " + k + " : " + M("\\sigma' = " + k + " \\cdot " + N(sd) + " = " + N(r6(sd * k))) + ".",
          { ctx: "transformation", guide: [G("Les écarts à la moyenne sont multipliés par combien ?", k, M(k) + "."), G("Nouvel écart-type ?", r6(sd * k), M(N(r6(sd * k))) + ".")], traps: [TR(sd, "La dispersion change : les écarts sont multipliés par " + k + "."), TR(r6(sd * k * k), "C'est la variance qui est multipliée par " + k + "² ; l'écart-type par " + k + ".")] }); },
      () => { const sd = pk([1.5, 2, 2.5, 3]), c = pk([3, 5, 10]), m = R.int(10, 40), ask = pk(["moyenne", "sigma"]);
        return ask === "moyenne"
          ? QN("Une série a une moyenne de " + M(m) + " et un écart-type de " + M(N(sd)) + ". On ajoute " + M(c) + " à toutes les valeurs. Quelle est la nouvelle moyenne ?", m + c, "Toutes les valeurs augmentent de " + c + " : la moyenne aussi, " + M(m + " + " + c + " = " + (m + c)) + " (l'écart-type, lui, ne change pas).", { ctx: "decalage-moyenne", guide: [G("Nouvelle moyenne ?", m + c, M(m + c) + ".")], traps: [TR(m, "Toutes les valeurs augmentent : la moyenne aussi."), TR(m * c, "On ajoute " + c + ", on ne multiplie pas.")] })
          : QN("Les scores d'une classe à un jeu ont une moyenne de " + M(m) + " points et un écart-type de " + M(N(sd)) + ". Chaque joueur reçoit un bonus de " + M(c) + " points. Quel est le nouvel écart-type ?", sd, "Ajouter la même valeur à toutes les données décale la série sans changer la dispersion : " + M("\\sigma' = " + N(sd)) + ".", { ctx: "decalage-sigma", guide: [G("Les écarts à la moyenne changent-ils ? Nouvel écart-type ?", sd, M(N(sd)) + " (inchangé).")], traps: [TR(r6(sd + c), "Ajouter une constante ne change pas les écarts à la moyenne."), TR(r6(sd * c), "On ajoute, on ne multiplie pas.")] }); },
    ],
  };

  // ===================== C3. quartiles : étendue, quartiles, écart interquartile, boîte à moustaches =====================
  // Séries de 7, 11 ou 15 valeurs : les conventions usuelles (médianes des moitiés, rang (n + 1)/4, calculatrice) concordent.
  const qs = (s) => { const h = (s.length - 1) / 2; return [med(s.slice(0, h)), med(s), med(s.slice(h + 1))]; };
  const QU = {
    1: [
      () => { const xs = Array.from({ length: 7 }, () => R.int(2, 40)), mn = Math.min(...xs), mx = Math.max(...xs); if (mn === mx) return null;
        return QN("Quelle est l'étendue de la série " + lst(xs) + " ?", mx - mn, "Étendue " + M("= \\max - \\min = " + mx + " - " + mn + " = " + (mx - mn)) + ".",
          { ctx: "etendue", guide: [G("Plus grande valeur ?", mx, M(mx) + "."), G("Plus petite valeur ?", mn, M(mn) + "."), G("Étendue ?", mx - mn, M(mx - mn) + ".")], traps: [TR(xs[xs.length - 1] - xs[0], "Il faut le max et le min, pas la dernière et la première valeur."), TR(mx + mn, "Étendue = max − min.")] }); },
      () => { const e = R.int(8, 30), mn = R.int(-5, 20), mx = mn + e, c = pk([["L'étendue d'une série vaut " + M(e) + " et sa plus petite valeur " + M(mn) + ". Quelle est sa plus grande valeur ?", "max"], ["Pendant une semaine, la température minimale a été de " + M(mn) + " °C et l'étendue des températures de " + M(e) + " °C. Quelle a été la température maximale (en °C) ?", "temperature"]]);
        return QN(c[0], mx, "Étendue = max − min, donc max = min + étendue = " + M(mn + " + " + e + " = " + mx) + ".",
          { ctx: c[1], guide: [G("max = min + étendue = ?", mx, M(mx) + ".")], traps: [TR(e - mn, "max = min + étendue."), TR(mn - e, "Le maximum est plus grand que le minimum.")] }); },
      () => { const s = srt(Array.from({ length: 7 }, () => R.int(1, 40))), [q1, m, q3] = qs(s);
        return QN("Série triée de 7 valeurs : " + lst(s) + ". Quel est le premier quartile " + M("Q_1") + " ?", q1, "Médiane : 4e valeur (" + M(m) + "). " + M("Q_1") + " : médiane des 3 premières valeurs, " + M(q1) + ".",
          { shownOk: true, ctx: "q1", guide: [G("Médiane (4e valeur) ?", m, M(m) + "."), G(M("Q_1") + " (médiane des 3 valeurs en dessous) ?", q1, M(q1) + ".")], traps: [TR(q3, "C'est Q3 ; Q1 est dans la moitié inférieure."), TR(m, "C'est la médiane.")] }); },
    ],
    2: [
      () => { const s = srt(Array.from({ length: 11 }, () => R.int(2, 40))), [q1, m, q3] = qs(s), sh = s.slice().sort(() => R.rand() - 0.5), ask = pk(["Q_3", "Q_1"]);
        return QN("Série de 11 valeurs : " + lst(sh) + ". Calcule " + M(ask) + ".", ask === "Q_1" ? q1 : q3, "Série triée : " + lst(s) + ". Médiane : 6e valeur (" + M(m) + "). " + M("Q_1") + " = 3e valeur (" + M(q1) + "), " + M("Q_3") + " = 9e valeur (" + M(q3) + ").",
          { shownOk: true, ctx: "quartile-" + ask.replace("_", ""), guide: [G("On trie. Médiane (6e valeur) ?", m, M(m) + "."), G(M(ask) + " (médiane de la moitié " + (ask === "Q_1" ? "inférieure" : "supérieure") + ", 5 valeurs) ?", ask === "Q_1" ? q1 : q3, M(ask === "Q_1" ? q1 : q3) + ".")], traps: [TR(ask === "Q_1" ? q3 : q1, "Q1 est dans la moitié inférieure, Q3 dans la moitié supérieure."), TR(ask === "Q_1" ? sh[2] : sh[8], "Trie d'abord la série.")] }); },
      () => { const a = R.int(5, 30), b = a + R.int(4, 20), c = pk([["Dans un diagramme en boîte, la boîte va de " + M(a) + " à " + M(b) + ". Quel est l'écart interquartile ?", "boite"], ["Pour les salaires d'une entreprise (en centaines de CHF), " + M("Q_1 = " + a) + " et " + M("Q_3 = " + b) + ". Quel est l'écart interquartile ?", "salaires"]]);
        return QN(c[0], b - a, "Écart interquartile " + M("= Q_3 - Q_1 = " + b + " - " + a + " = " + (b - a)) + " (la moitié centrale des données tient dans cet intervalle).",
          { ctx: c[1], guide: [G(M("Q_3 - Q_1") + " = ?", b - a, M(b - a) + ".")], traps: [TR(a + b, "Écart = différence."), TR((a + b) / 2, "Ce n'est pas la médiane.")] }); },
      () => { const s = srt(Array.from({ length: 7 }, () => R.int(5, 60))), [q1, m, q3] = qs(s), ask = pk(["% en dessous de Q1", "% entre Q1 et Q3", "% au-dessus de la médiane"]), v = ask === "% entre Q1 et Q3" ? 50 : ask === "% en dessous de Q1" ? 25 : 50;
        return QN("Une boîte à moustaches résume une grande série : minimum " + M(s[0]) + ", " + M("Q_1 = " + q1) + ", médiane " + M(m) + ", " + M("Q_3 = " + q3) + ", maximum " + M(s[6]) + ". Environ quel pourcentage des valeurs est " + (ask === "% en dessous de Q1" ? "inférieur à " + M(q1) : ask === "% entre Q1 et Q3" ? "compris entre " + M(q1) + " et " + M(q3) : "supérieur à " + M(m)) + " ?", v, "Les quartiles partagent la série en quatre parts d'environ 25 % : " + (v === 25 ? "en dessous de Q1, environ 25 %." : ask === "% entre Q1 et Q3" ? "de Q1 à Q3 (la boîte), environ 50 %." : "au-dessus de la médiane, environ 50 %."),
          { ctx: "lecture-boite", guide: [G("Quelle part des valeurs (en %) se trouve entre deux quartiles voisins ?", 25, "Environ 25 %."), G("Pourcentage demandé ?", v, M(v + "\\,\\%") + ".")], traps: [TR(v === 25 ? 75 : 25, "Chaque quart de la boîte (moustache ou demi-boîte) contient environ 25 % des valeurs."), TR(v === 50 ? 100 : 50, "Compte les quarts concernés.")] }); },
    ],
    3: [
      () => { const s = srt(Array.from({ length: 11 }, () => R.int(2, 50))), [q1, m, q3] = qs(s);
        return QN("Série triée de 11 valeurs : " + lst(s) + ". Calcule l'écart interquartile " + M("Q_3 - Q_1") + ".", q3 - q1, "Médiane : 6e valeur (" + M(m) + "). " + M("Q_1") + " : médiane des 5 premières, " + M(q1) + ". " + M("Q_3") + " : médiane des 5 dernières, " + M(q3) + ". Écart : " + M(q3 + " - " + q1 + " = " + (q3 - q1)) + ".",
          { shownOk: true, ctx: "eiq", guide: [G(M("Q_1") + " (3e valeur) ?", q1, M(q1) + "."), G(M("Q_3") + " (9e valeur) ?", q3, M(q3) + "."), G("Écart interquartile ?", q3 - q1, M(q3 - q1) + ".")], traps: [TR(s[10] - s[0], "C'est l'étendue ; l'écart interquartile utilise Q1 et Q3."), TR(q3 - m, "Q1, pas la médiane.")] }); },
      () => { const s = srt(Array.from({ length: 15 }, () => R.int(10, 90))), [q1, m, q3] = qs(s);
        return QN("Temps (en minutes) de 15 apprentis pour un exercice, triés : " + lst(s) + ". Calcule l'écart interquartile.", q3 - q1, "15 valeurs : médiane = 8e (" + M(m) + "), " + M("Q_1") + " = 4e (" + M(q1) + "), " + M("Q_3") + " = 12e (" + M(q3) + "). Écart " + M(q3 - q1) + " min.",
          { shownOk: true, ctx: "eiq-15", guide: [G("Rang de la médiane ?", 8, "8e valeur."), G(M("Q_1") + " (médiane des 7 premières, 4e valeur) ?", q1, M(q1) + "."), G(M("Q_3") + " (12e valeur) ?", q3, M(q3) + "."), G("Écart interquartile ?", q3 - q1, M(q3 - q1) + ".")], traps: [TR(s[14] - s[0], "C'est l'étendue."), TR(s[11] - s[3] === q3 - q1 ? s[10] - s[4] : s[11] - s[3], "Q1 = 4e valeur et Q3 = 12e valeur.")] }); },
      () => { const s = srt(Array.from({ length: 11 }, () => R.int(10, 40))), [q1, m, q3] = qs(s), e = q3 - q1, out = q3 + 1.5 * e + R.int(1, 10), v = r6(q3 + 1.5 * e);
        return QN("Pour une série, " + M("Q_1 = " + q1) + " et " + M("Q_3 = " + q3) + ". On considère comme « valeur extrême » toute valeur supérieure à " + M("Q_3 + 1{,}5 \\cdot (Q_3 - Q_1)") + ". À partir de quelle valeur une donnée est-elle extrême ?", v, "Écart interquartile " + M(e) + " ; " + M(q3 + " + 1{,}5 \\cdot " + e + " = " + N(v)) + ". (Par exemple " + M(N(out)) + " serait une valeur extrême.)",
          { ctx: "valeur-extreme", guide: [G("Écart interquartile ?", e, M(q3 + " - " + q1 + " = " + e) + "."), G("Seuil " + M("Q_3 + 1{,}5 \\cdot " + e) + " ?", v, M(N(v)) + ".")], traps: [TR(r6(q1 + 1.5 * e), "On part de Q3 (le haut de la boîte)."), TR(q3 + e, "N'oublie pas le facteur 1,5.")] }); },
    ],
  };

  const PROBS = {
    statfreq: [() => P("Sondage auprès de 40 apprentis sur leur moyen de transport : train 14, bus 10, vélo 6, voiture 10.", [["a) Fréquence du train (%)", 35], ["b) Angle du secteur « vélo » (degrés)", 54], ["c) Pourcentage de ceux qui ne viennent pas en voiture (%)", 75]], ["14 ÷ 40.", "6/40 · 360°."], "a) 35 % ; b) " + M("\\frac{6}{40} \\cdot 360° = 54°") + " ; c) " + M("\\frac{30}{40} = 75\\,\\%") + ".")],
    stats: [() => P("Notes de 6 tests : 4 ; 5,5 ; 4,5 ; 5 ; 6 ; 5.", [["a) Moyenne", 5], ["b) Médiane", 5], ["c) Note au 7e test pour une moyenne de 5,1", 5.7]], ["Somme 30.", "5,1 · 7 = 35,7."], "a) " + M("30 \\div 6 = 5") + " ; b) série triée 4 ; 4,5 ; 5 ; 5 ; 5,5 ; 6 : " + M("5") + " ; c) " + M("35{,}7 - 30 = 5{,}7") + ".")],
    quartiles: [() => P("Série triée de 11 valeurs : 3 ; 5 ; 6 ; 8 ; 9 ; 10 ; 12 ; 13 ; 15 ; 18 ; 30.", [["a) Médiane", 10], ["b) Écart interquartile", 9], ["c) Seuil des valeurs extrêmes Q3 + 1,5 · EIQ", 28.5]], ["6e valeur.", "Q1 = 6, Q3 = 15."], "a) 10 ; b) " + M("15 - 6 = 9") + " ; c) " + M("15 + 13{,}5 = 28{,}5") + " : 30 est une valeur extrême.")],
    trigcercle: [() => P("On considère l'angle de 150°.", [["a) En radians, c'est k·π/6 : que vaut k ?", 5], ["b) Quadrant", 2], ["c) Signe du cosinus (1 ou −1)", -1]], ["150 ÷ 30 = 5.", "Entre 90° et 180°."], "a) " + M("\\frac{5\\pi}{6}") + " ; b) quadrant 2 ; c) négatif : " + M("\\cos 150° = -\\frac{\\sqrt{3}}{2}") + ".")],
    trigfn: [() => P("f(x) = 3 sin(2x) + 1 (x en degrés).", [["a) Valeur maximale", 4], ["b) Période (degrés)", 180], ["c) Premier x > 0 où f est maximale (degrés)", 45]], ["sin vaut au plus 1.", "360 ÷ 2."], "a) " + M("3 + 1 = 4") + " ; b) " + M("180°") + " ; c) " + M("2x = 90°") + ", " + M("x = 45°") + ".")],
    sinlaw: [() => P("Dans le triangle ABC : a = 7, b = 8 et γ = 60°.", [["a) c² (théorème du cosinus)", 57], ["b) c (au centième)", Math.sqrt(57), 0.01], ["c) Aire (au centième)", 14 * Math.sqrt(3), 0.01]], ["49 + 64 − 2 · 7 · 8 · 0,5.", "½ · 7 · 8 · sin 60°."], "a) " + M("49 + 64 - 56 = 57") + " ; b) " + M("\\sqrt{57} \\approx 7{,}55") + " ; c) " + M("14\\sqrt{3} \\approx 24{,}25") + ".")],
    trigeq: [() => P("On résout 2 sin x = 1 pour 0° ≤ x < 360°.", [["a) sin x (décimal)", 0.5], ["b) Plus petite solution (degrés)", 30], ["c) Plus grande solution (degrés)", 150]], ["On divise par 2.", "sin(180° − x) = sin x."], "a) 0,5 ; b) 30° ; c) 150°.")],
    trigassoc: [() => P("On sait que sin α = 0,6 et que α est aigu.", [["a) cos α", 0.8], ["b) sin(180° − α)", 0.6], ["c) cos(180° + α)", -0.8]], ["cos² α = 1 − 0,36.", "180° + α : point symétrique par rapport à l'origine."], "a) 0,8 ; b) 0,6 ; c) −0,8.")],
    trigeq2: [() => P("La marée d'un port : h(t) = 4 + 2 sin(30t) (m, t en heures).", [["a) Hauteur maximale (m)", 6], ["b) Période (h)", 12], ["c) Heure de la première marée haute", 3]], ["sin vaut au plus 1.", "360 ÷ 30."], "a) 6 m ; b) 12 h ; c) " + M("30t = 90") + ", " + M("t = 3") + " h.")],
    triaire: [() => P("Un terrain triangulaire a deux côtés de 40 m et 30 m qui forment un angle de 60°.", [["a) Aire (m², à l'unité)", 300 * Math.sqrt(3), 1], ["b) Troisième côté (m, au dixième)", Math.sqrt(1300), 0.1], ["c) Prix à 85 CHF le m² (CHF, à la centaine)", 85 * 300 * Math.sqrt(3), 100]], ["½ · 40 · 30 · sin 60°.", "Théorème du cosinus."], "a) " + M("600 \\cdot \\frac{\\sqrt{3}}{2} \\approx 520") + " m² ; b) " + M("\\sqrt{1600 + 900 - 1200} = \\sqrt{1300} \\approx 36{,}1") + " m ; c) ≈ 44'200 CHF.")],
    droites: [() => P("Une droite passe par A(−1 ; 5) et B(3 ; −3).", [["a) Pente", -2], ["b) Ordonnée à l'origine", 3], ["c) Pente d'une perpendiculaire (fraction acceptée)", 0.5]], ["Δy ÷ Δx.", "5 = −2 · (−1) + h."], "a) " + M("\\frac{-8}{4} = -2") + " ; b) " + M("h = 3") + " ; c) " + M("\\frac{1}{2}") + " (produit des pentes : −1).")],
    droitesinter: [() => P("Offre A : 20 CHF + 1,50 CHF par km. Offre B : 50 CHF + 0,90 CHF par km.", [["a) Prix de A pour 40 km (CHF)", 80], ["b) Nombre de km où les offres coûtent pareil", 50], ["c) Prix commun pour ce kilométrage (CHF)", 95]], ["20 + 1,5 · 40.", "1,5x + 20 = 0,9x + 50."], "a) 80 ; b) " + M("0{,}6x = 30") + ", " + M("x = 50") + " ; c) " + M("20 + 75 = 95") + " CHF.")],
    recipaff: [() => P("Un forfait téléphone coûte f(x) = 0,5x + 12 CHF pour x Go.", [["a) Prix pour 10 Go (CHF)", 17], ["b) Nombre de Go pour une facture de 20 CHF", 16], ["c) f⁻¹(15)", 6]], ["f(10).", "0,5x + 12 = 20."], "a) 17 ; b) " + M("x = (20 - 12) \\div 0{,}5 = 16") + " ; c) " + M("(15 - 12) \\div 0{,}5 = 6") + ".")],
  };

  // ---------- notion nouvelle : recipaff (MP 2e, chapitre fonctions affines) ----------
  if (!NOTIONS.find((n) => n.id === "recipaff")) {
    const at = NOTIONS.findIndex((n) => n.id === "droitesinter");
    NOTIONS.splice(at + 1, 0, { id: "recipaff", theme: "fa", label: "Réciproque d'une fonction affine", ex: "f(x) = 2x + 3 \\Rightarrow f^{-1}(x) = \\frac{x - 3}{2}", CH: null, FR: null, MP: [13, "S1"] });
    if (typeof ORDRE !== "undefined") ORDRE.MP.recipaff = (ORDRE.MP.droites ?? 39) + 0.5;
    if (typeof ORDRE_THEME !== "undefined") ORDRE_THEME.MP.recipaff = "FA";
    LESSONS_EXTRA.recipaff = ["Fonction réciproque", "La réciproque \\(f^{-1}\\) fait le chemin inverse de \\(f\\).", "Si \\(f(a) = b\\), alors \\(f^{-1}(b) = a\\). Pour \\(f(x) = ax + b\\) : on écrit \\(y = ax + b\\), on isole \\(x\\) (retirer \\(b\\), puis diviser par \\(a\\)), et on renomme : \\(f^{-1}(x) = \\frac{x - b}{a}\\). Le graphique de \\(f^{-1}\\) est le symétrique de celui de \\(f\\) par rapport à la droite \\(y = x\\).",
      ["\\(f(x) = 2x + 3\\) : \\(f^{-1}(x) = \\frac{x - 3}{2}\\)", "\\(f(1) = 5\\), donc \\(f^{-1}(5) = 1\\)"], "\\(f^{-1}(x)\\) n'est pas \\(\\frac{1}{f(x)}\\) : c'est la fonction qui « défait » \\(f\\)."];
  }
  // fonctions sinus et cosinus : aussi au programme MP 2e (cours CFPT, leçons 6–7 de trigonométrie)
  const tf = NOTIONS.find((n) => n.id === "trigfn");
  if (tf && tf.MP == null) { tf.MP = [13, "S2"]; if (typeof ORDRE !== "undefined") ORDRE.MP.trigfn = (ORDRE.MP.trigcercle ?? 43) + 0.5; if (typeof ORDRE_THEME !== "undefined") ORDRE_THEME.MP.trigfn = "TG"; }

  // « Trouve l'erreur » (24.11, chantier I, suite) : théorème du cosinus, racine oubliée.
  SL[2].push(() => { const a = R.int(4, 12), b = R.int(4, 12), ga = pk([35, 40, 50, 55, 65, 70, 80, 100, 110, 120]), c2 = a * a + b * b - 2 * a * b * Math.cos(ga * D2R), c = Math.sqrt(c2), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    if (c2 < 4) return null;
    return QRd("Dans le triangle " + M("ABC") + ", " + M("a = " + a) + " cm, " + M("b = " + b) + " cm et " + M("\\gamma = " + ga + "°") + ". " + w + " écrit : « " + M("c = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cdot \\cos " + ga + "° \\approx " + N(Math.round(c2 * 100) / 100)) + " cm ». Trouve l'erreur, puis calcule " + M("c") + " (au centième, en cm).", c,
      "Erreur : le théorème du cosinus donne " + M("c^2") + ", pas " + M("c") + " : " + M("c^2 = a^2 + b^2 - 2ab\\cos\\gamma \\approx " + N(Math.round(c2 * 100) / 100)) + ", donc " + M("c \\approx \\sqrt{" + N(Math.round(c2 * 100) / 100) + "} \\approx " + N(Math.round(c * 100) / 100)) + " cm. (Contrôle : " + M("c") + " doit être plus petit que " + M("a + b = " + (a + b)) + ".)",
      0.01, { ctx: "erreur", guide: [Gd(M("c^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cdot \\cos " + ga + "°") + " ≈ ? (au centième)", c2, M("\\approx " + N(Math.round(c2 * 100) / 100)) + ".", 0.01), Gd(M("c = \\sqrt{c^2}") + " ≈ ? (au centième)", c, M("\\approx " + N(Math.round(c * 100) / 100)) + " cm.", 0.01)],
        traps: [TR(c2, "C'est la valeur de " + w + " : c'est " + M("c^2") + " ; il reste la racine carrée.")] }); });
  const ALL = { droites: DR, droitesinter: DI, recipaff: RF, trigcercle: TC, trigfn: TF, sinlaw: SL, trigeq: TQ, trigassoc: TA, trigeq2: T2, triaire: TAi, statfreq: SF, stats: ST, quartiles: QU };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    droites: "Pente = Δy ÷ Δx ; ordonnée à l'origine : valeur de y quand x = 0. Parallèles : même pente ; perpendiculaires : produit des pentes = −1.",
    droitesinter: "Égalise les deux expressions de y, résous en x, puis calcule y. Sur l'axe des abscisses y = 0 ; sur l'axe des ordonnées x = 0.",
    recipaff: "f⁻¹ défait f : si f(a) = b, alors f⁻¹(b) = a. Pour f(x) = ax + b : retire b, divise par a. Graphique : symétrique par rapport à y = x.",
    trigcercle: "180° = π rad. Sur le cercle trigonométrique, un angle donne le point (cos ; sin). Angle de référence + signe du quadrant.",
    trigfn: "a sin(bx) + d : amplitude |a|, période 360°/b (2π/b en radians), valeurs entre d − a et d + a.",
    sinlaw: "Sinus : a/sin α = b/sin β = c/sin γ (un côté et l'angle en face). Cosinus : c² = a² + b² − 2ab cos γ (deux côtés et l'angle compris, ou trois côtés).",
    trigeq: "Angle de référence, puis deux solutions sur un tour : sin → x et 180° − x ; cos → x et 360° − x ; tan → x et x + 180°.",
    trigassoc: "Dessine les angles sur le cercle : −α (symétrie horizontale), 180° − α (verticale), 180° + α (centre). sin² + cos² = 1 ; le quadrant donne le signe.",
    trigeq2: "Modèle d + a sin(bt) : valeurs de d − a à d + a, période 360/b. Pour sin(bx) = k : résous en u = bx (plusieurs tours), puis divise par b.",
    triaire: "Aire = ½ ab sin γ (deux côtés et l'angle compris). Parallélogramme : ab sin α. Polygones réguliers : découpe en triangles.",
    statfreq: "Fréquence = effectif ÷ total (× 100 pour des %). Diagramme circulaire : angle = fréquence × 360°. Effectif cumulé : on additionne.",
    stats: "Moyenne = somme ÷ effectif (pondérée avec un tableau). Médiane : on trie, valeur du milieu. Écart-type : racine de la moyenne des carrés des écarts.",
    quartiles: "Trie la série. Étendue = max − min. Q1 et Q3 : médianes des moitiés inférieure et supérieure. Écart interquartile = Q3 − Q1.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    droites: ["Pente, lecture graphique, équation par deux points", "Parallèle, perpendiculaire, paramètre", "Système, point sur une droite, modéliser"],
    droitesinter: ["Intersection, axes, droite horizontale", "Offres, droite par deux points, médiatrice", "Aire d'un triangle, rencontre, hauteur"],
    recipaff: ["f⁻¹(b), point symétrique, opération inverse", "Expression de f⁻¹, conversion °C/°F, symétrie", "Taxi, reconstruire f, intersection avec y = x"],
    trigcercle: ["Degrés ↔ radians, quadrants", "Valeurs exactes, coordonnées, angle depuis sin ou cos", "Tangente, radians, angles de plus d'un tour"],
    trigfn: ["Maximum, amplitude, position du maximum", "Période en degrés ou en radians, image", "a et d depuis max et min, zéros, premier maximum"],
    sinlaw: ["Théorème du sinus : côté, troisième angle, angle", "Théorème du cosinus : côté, distances, parallélogramme", "Angle par le cosinus, bouée, cosinus puis sinus"],
    trigeq: ["sin x = k, cos x = k, valeurs clés", "tan x = k, isoler, 2 sin x + 1 = 0", "sin x = cos x, isoler, carré"],
    trigassoc: ["Angles associés, angle de référence, Pythagore", "Complémentaires, tangente, angle obtus", "Expression, combinaison, quadrant donné"],
    trigeq2: ["sin(2x) = k, max ou min d'un modèle, période", "a et d d'une sinusoïde, hauteur d'un port, heure de marée haute", "Équation du port, grande roue, cos(bx) = 0"],
    triaire: ["½ ab sin γ exact ou à la calculatrice, parallélogramme", "Terrain, angle depuis l'aire, triangle équilatéral", "Randonneurs, hexagone, hauteur"],
    statfreq: ["Fréquence, effectif depuis un %, tableau", "Effectif cumulé, mode, fréquence cumulée", "Angle d'un secteur, angle vers %, angle vers effectif"],
    stats: ["Moyenne, moyenne pondérée, mode", "Médiane, valeur manquante, médiane d'un tableau", "Écart-type, multiplier, ajouter une constante"],
    quartiles: ["Étendue, maximum, Q1", "Q1 ou Q3, boîte, lecture d'une boîte", "Écart interquartile (11 et 15 valeurs), valeurs extrêmes"],
  });
})();

// Chantier 1re Collège (19.11) : tests de préparation de qualité pour 7. Degré 2, 4. Fonctions, 8. De Thalès à
// Pythagore, 10. Trigonométrie (exercices en situation, plusieurs étapes, interprétation) + raisonnements.
// Même format que riche_11b.js / riche_11c.js.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);
  const P1 = (n) => (n === 1 ? "" : "s");
  const D = Math.PI / 180;
  // ===================== 7. Degré 2 =====================
  const EX2 = [
    () => { const v = pk([15, 20, 25]), h0 = pk([1, 2]);
      return X({ id: "f2", lv: 1, titre: "Le lancer franc", q: "La hauteur (en m) d'un ballon est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + ", où " + M("t") + " est le temps en secondes.",
        parts: [{ label: "À quel instant le ballon est-il au plus haut ?", pts: 1 }, { label: "Quelle est la hauteur maximale ?", pts: 1 }, { label: "Le ballon touche-t-il un plafond situé à " + Q(v * v / 20 + h0 - 1, "m") + " ? Justifie.", pts: 1 }],
        sol: ul([M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(v / 10)) + " s.", M("h(" + N(v / 10) + ") = " + N(v * v / 20 + h0)) + " m.", "Oui : la hauteur maximale dépasse le plafond de 1 m."]) }); },
    () => { const p = pk([-3, -2, -1]), q = pk([2, 3, 4, 5]);
      return X({ id: "f2formes", lv: 2, titre: "Trois écritures d'une même parabole", q: "Soit " + M("f(x) = (x " + (p < 0 ? "+ " + -p : "- " + p) + ")(x - " + q + ")") + ".",
        parts: [{ label: "Donne les zéros et l'ordonnée à l'origine.", pts: 1 }, { label: "Écris la forme développée.", pts: 1 }, { label: "Écris la forme canonique et donne le sommet.", pts: 2 }],
        sol: ul([M(p) + " et " + M(q) + " ; " + M("f(0) = " + p * q) + ".", M("x^2 " + (-(p + q) < 0 ? "- " + (p + q) : "+ " + -(p + q)) + "x " + (p * q < 0 ? "- " + -p * q : "+ " + p * q)) + ".", "Sommet au milieu des zéros : " + M("x_S = " + N((p + q) / 2)) + ", " + M("f(x_S) = " + N(-(((q - p) / 2) ** 2))) + " ; " + M("f(x) = (x - " + N((p + q) / 2) + ")^2 - " + N(((q - p) / 2) ** 2)) + "."]) }); },
    () => { const L = pk([20, 24, 40]);
      return X({ id: "optim", lv: 2, titre: "L'enclos le long du mur", q: "Avec " + Q(L, "m") + " de grillage, on fabrique un enclos rectangulaire adossé à un mur (le mur remplace un côté). On note " + M("x") + " la largeur (côtés perpendiculaires au mur).",
        parts: [{ label: "Exprime la longueur, puis l'aire " + M("A(x)") + ".", pts: 2 }, { label: "Quelle largeur donne l'aire maximale ? Quelle est cette aire ?", pts: 2 }],
        sol: ul(["Longueur " + M(L + " - 2x") + " ; " + M("A(x) = x(" + L + " - 2x) = -2x^2 + " + L + "x") + ".", M("x = \\frac{" + L + "}{4} = " + N(L / 4)) + " m ; " + M("A = " + N(L * L / 8)) + " m²."]) }); },
    () => { const a = pk([1, 2]), p = pk([-1, 1, 2]), q = p + pk([3, 4]);
      return X({ id: "ineq2", lv: 3, titre: "Quand la fonction est-elle positive ?", q: "Soit " + M("f(x) = " + (a === 1 ? "" : a) + "x^2 " + (-(p + q) * a < 0 ? "- " + (p + q) * a : "+ " + -(p + q) * a) + "x " + (a * p * q < 0 ? "- " + -a * p * q : "+ " + a * p * q)) + " et " + M("g(x) = " + (a === 1 ? "" : a) + "x " + (a * p > 0 ? "- " + a * p : "+ " + -a * p)) + ".",
        parts: [{ label: "Résous " + M("f(x) = 0") + ".", pts: 1 }, { label: "Résous " + M("f(x) > 0") + " (tableau de signes ou parabole).", pts: 1 }, { label: "Résous " + M("f(x) \\le g(x)") + ".", pts: 2 }],
        sol: ul([M(p) + " et " + M(q) + ".", M("x < " + p) + " ou " + M("x > " + q) + ".", M("f(x) - g(x) = " + a + "(" + "x - " + p + ")(x - " + (q + 1) + ")").replace(/- -/g, "+ ") + " ≤ 0 : " + M("[" + p + " \\,;\\, " + (q + 1) + "]") + "."]) }); },
  ];
  const RAISON2 = [
    () => X({ id: "eq2", lv: 1, titre: "Trouve l'erreur", q: who() + " résout " + M("x^2 = 5x") + " en divisant par " + M("x") + " : « " + M("x = 5") + " ».", parts: [{ label: "Quelle solution a été perdue ? Pourquoi ?", pts: 1 }, { label: "Résous correctement.", pts: 1 }], sol: ul(["x = 0 : on ne peut pas diviser par x s'il peut être nul.", M("x(x - 5) = 0") + " : " + M("x = 0") + " ou " + M("x = 5") + "."]) }),
    () => X({ id: "eq2disc", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« x² + 4 = 0 n'a pas de solution réelle. »", pts: 1 }, { label: "« Si a et c sont de signes contraires, ax² + bx + c = 0 a deux solutions. »", pts: 1 }], sol: ul(["<b>Vrai</b> : un carré n'est jamais égal à −4.", "<b>Vrai</b> : " + M("\\Delta = b^2 - 4ac > 0") + " car " + M("-4ac > 0") + "."]) }),
  ];
  // ===================== 4. Fonctions =====================
  const EXF = [
    () => { const F = pk([8, 10, 12]), p = pk([0.5, 0.8]);
      return X({ id: "modaff", lv: 1, titre: "La location de trottinette", q: "Une trottinette coûte " + Q(F, "CHF") + " de déblocage, puis " + Q(p, "CHF") + " par minute. Un vélo coûte " + Q(0, "CHF") + " de déblocage et " + Q(p + 0.5, "CHF") + " par minute.",
        parts: [{ label: "Écris les prix " + M("T(x)") + " et " + M("V(x)") + " pour " + M("x") + " minutes.", pts: 1 }, { label: "À partir de combien de minutes la trottinette est-elle moins chère ?", pts: 2 }],
        sol: ul([M("T(x) = " + F + " + " + N(p) + "x") + " ; " + M("V(x) = " + N(p + 0.5) + "x") + ".", M(F + " + " + N(p) + "x < " + N(p + 0.5) + "x \\iff x > " + 2 * F) + " : dès " + (2 * F + 1) + " minutes."]) }); },
    () => { const a = pk([2, 3]), b = pk([-1, 1, 4]);
      return X({ id: "transf", lv: 2, titre: "Déplacer une parabole", q: "On part de " + M("f(x) = x^2") + " et on construit " + M("g(x) = (x - " + a + ")^2 " + (b < 0 ? "- " + -b : "+ " + b)) + ".",
        parts: [{ label: "Décris les déplacements qui envoient le graphe de f sur celui de g.", pts: 1 }, { label: "Donne le sommet de g et l'image du point " + M("(1 \\,;\\, 1)") + " de f.", pts: 2 }],
        sol: ul([a + " vers la droite et " + Math.abs(b) + " vers le " + (b > 0 ? "haut" : "bas") + ".", "Sommet " + M("(" + a + " \\,;\\, " + b + ")") + " ; point " + M("(" + (1 + a) + " \\,;\\, " + (1 + b) + ")") + "."]) }); },
    () => { const r = pk([2, 3, 4]);
      return X({ id: "domaine", lv: 2, titre: "Où la fonction existe-t-elle ?", q: "Soit " + M("f(x) = \\frac{\\sqrt{x + " + r + "}}{x - 1}") + ".",
        parts: [{ label: "Quelle condition impose la racine ?", pts: 1 }, { label: "Quelle valeur est interdite par le dénominateur ?", pts: 1 }, { label: "Écris le domaine de définition et calcule " + M("f(" + (r * r - r) + ")") + ".", pts: 2 }],
        sol: ul([M("x \\ge -" + r) + ".", M("x \\ne 1") + ".", M("D = [-" + r + " \\,;\\, 1[ \\cup ]1 \\,;\\, +\\infty[") + " ; " + M("f(" + (r * r - r) + ") = \\frac{" + r + "}{" + (r * r - r - 1) + "}") + "."]) }); },
    () => { const k = pk([12, 18, 24]);
      return X({ id: "racinv", lv: 3, titre: "Partager un gâteau", q: "Un gâteau de " + Q(k, "parts") + " est partagé équitablement entre " + M("x") + " personnes : chacune reçoit " + M("f(x) = \\frac{" + k + "}{x}") + " parts.",
        parts: [{ label: "Calcule f(2), f(3) et f(6). Comment évolue f(x) quand x augmente ?", pts: 2 }, { label: "Combien de personnes pour que chacune ait 1,5 part ?", pts: 1 }, { label: "Pourquoi " + M("x = 0") + " est-il interdit ?", pts: 1 }],
        sol: ul([N(k / 2) + ", " + N(k / 3) + ", " + N(k / 6) + " : f diminue (fonction inverse).", M("\\frac{" + k + "}{x} = 1{,}5 \\iff x = " + N(k / 1.5)) + ".", "On ne peut pas diviser par 0 (et partager entre 0 personne n'a pas de sens)."]) }); },
  ];
  const RAISONF = [
    () => X({ id: "fimg", lv: 1, titre: "Image ou antécédent ?", q: who() + " lit sur un graphique : « f(2) = 5, donc l'image de 5 est 2 ».", parts: [{ label: "Corrige la phrase.", pts: 1 }, { label: "Combien d'antécédents un nombre peut-il avoir ? Et d'images ?", pts: 1 }], sol: ul(["L'image de 2 est 5 ; 2 est un antécédent de 5.", "Un nombre a au plus une image, mais peut avoir plusieurs antécédents."]) }),
    () => X({ id: "transf", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Le graphe de f(x − 3) est celui de f décalé de 3 vers la gauche. »", pts: 1 }, { label: "« Le graphe de −f(x) est le symétrique de celui de f par rapport à l'axe des x. »", pts: 1 }], sol: ul(["<b>Faux</b> : vers la DROITE.", "<b>Vrai</b> : les ordonnées changent de signe."]) }),
  ];
  // ===================== 8. De Thalès à Pythagore =====================
  const EXG = [
    () => { const [p, q] = pk([[9, 16], [4, 9], [3.6, 6.4]]), h = Math.sqrt(p * q);
      return X({ id: "euclide", lv: 1, titre: "Le pont suspendu", q: "Un câble vertical relie le sommet de l'angle droit d'un triangle rectangle à son hypoténuse ; il la découpe en " + Q(p, "m") + " et " + Q(q, "m") + ".",
        parts: [{ label: "Calcule la longueur du câble.", pts: 1 }, { label: "Calcule les deux autres côtés du triangle.", pts: 2 }],
        sol: ul([M("h = \\sqrt{" + N(p) + " \\cdot " + N(q) + "} = " + N(h)) + " m.", M("\\sqrt{" + N(p) + " \\cdot " + N(p + q) + "} = " + N(Math.sqrt(p * (p + q)))) + " m et " + M(N(Math.sqrt(q * (p + q)))) + " m."]) }); },
    () => { const k = pk([2, 3, 4]);
      return X({ id: "exactes", lv: 2, titre: "Le carré et son cercle", q: "Un carré a un côté de " + Q(2 * k, "cm") + ".",
        parts: [{ label: "Calcule la valeur exacte de sa diagonale.", pts: 1 }, { label: "Calcule le rayon et l'aire (valeur exacte) du cercle circonscrit.", pts: 2 }],
        sol: ul([M(2 * k + "\\sqrt{2}") + " cm.", "Rayon " + M(k + "\\sqrt{2}") + " ; aire " + M("\\pi (" + k + "\\sqrt{2})^2 = " + 2 * k * k + "\\pi") + " cm²."]) }); },
    () => { const [B, b, l, h] = pk([[14, 8, 5, 4], [20, 10, 13, 12]]);
      return X({ id: "geocomb", lv: 2, titre: "Le bac à fleurs", q: "La section d'un bac à fleurs est un trapèze isocèle : bases " + Q(B, "dm") + " et " + Q(b, "dm") + ", côtés obliques " + Q(l, "dm") + ". Le bac est long de " + Q(10, "dm") + ".",
        parts: [{ label: "Calcule la hauteur du trapèze.", pts: 2 }, { label: "Calcule le volume de terre (en L).", pts: 2 }],
        sol: ul([M("\\sqrt{" + l + "^2 - " + (B - b) / 2 + "^2} = " + h) + " dm.", "Aire " + M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + ((B + b) * h) / 2) + " dm² ; volume " + M(((B + b) * h) / 2 * 10) + " L."]) }); },
    () => { const m = pk([9, 12, 15]);
      return X({ id: "droitesrem", lv: 3, titre: "Le centre de gravité", q: "Une plaque triangulaire ABC est rectangle en C, avec " + M("AC = " + (m === 9 ? 6 : m === 12 ? 9 : 12)) + " cm et " + M("BC = " + (m === 9 ? 8 : m === 12 ? 12 : 16)) + " cm.",
        parts: [{ label: "Calcule AB et la médiane issue de C.", pts: 2 }, { label: "À quelle distance de C se trouve le centre de gravité ?", pts: 1 }],
        sol: ul(["AB = " + M(m === 9 ? 10 : m === 12 ? 15 : 20) + " cm ; médiane = AB/2 = " + M(N((m === 9 ? 10 : m === 12 ? 15 : 20) / 2)) + " cm (milieu de l'hypoténuse).", M("\\frac{2}{3}") + " de la médiane : " + M(N(((m === 9 ? 10 : m === 12 ? 15 : 20) / 2) * 2 / 3)) + " cm."]) }); },
  ];
  const RAISONG = [
    () => X({ id: "pythrec", lv: 1, titre: "Trouve l'erreur", q: who() + " affirme : « 4² + 5² = 41 et 6² = 36, donc le triangle 4-5-6 est presque rectangle, on peut appliquer Pythagore ».", parts: [{ label: "Pourquoi est-ce faux ?", pts: 1 }, { label: "Le triangle a-t-il un angle aigu ou obtus face au côté 6 ?", pts: 1 }], sol: ul(["Pythagore exige l'égalité exacte : 41 ≠ 36, le triangle n'est pas rectangle.", "36 < 41 : l'angle face au côté 6 est aigu."]) }),
    () => X({ id: "euclide", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Dans un triangle rectangle, h² = p · q. »", pts: 1 }, { label: "« La médiane issue de l'angle droit vaut la moitié de l'hypoténuse. »", pts: 1 }], sol: ul(["<b>Vrai</b> (théorème de la hauteur).", "<b>Vrai</b> : le milieu de l'hypoténuse est le centre du cercle circonscrit."]) }),
  ];
  // ===================== 10. Trigonométrie =====================
  const EXT = [
    () => { const a = pk([30, 35, 40]), d = pk([20, 30, 40]);
      return X({ id: "trigo", lv: 1, titre: "La hauteur de l'arbre", q: "À " + Q(d, "m") + " d'un arbre, on voit son sommet sous un angle de " + M(a + "°") + " (yeux à " + Q(1.6, "m") + ").",
        parts: [{ label: "Fais un croquis et nomme les côtés (opposé, adjacent).", pts: 1 }, { label: "Calcule la hauteur de l'arbre (au cm).", pts: 2 }],
        sol: ul(["La distance est adjacente à l'angle, la hauteur cherchée opposée.", M(d + " \\cdot \\tan " + a + "° + 1{,}6 \\approx " + N(Math.round((d * Math.tan(a * D) + 1.6) * 100) / 100)) + " m."]) }); },
    () => { const [L, h] = pk([[4, 3.7], [5, 4.6], [6, 5.5], [5, 4.2], [4, 3.5]]);
      return X({ id: "trigo", lv: 2, titre: "L'échelle de sécurité", q: "Une échelle de " + Q(L, "m") + " doit faire un angle entre 65° et 75° avec le sol. On l'appuie pour atteindre " + Q(h, "m") + " de haut.",
        parts: [{ label: "Calcule l'angle avec le sol (au dixième).", pts: 2 }, { label: "Est-ce sûr ? Justifie.", pts: 1 }],
        sol: ul([M("\\sin \\alpha = \\frac{" + N(h) + "}{" + L + "}") + ", " + M("\\alpha \\approx " + N(Math.round((Math.asin(h / L) / D) * 10) / 10) + "°") + ".", (Math.asin(h / L) / D >= 65 && Math.asin(h / L) / D <= 75 ? "Oui, l'angle est dans l'intervalle." : "Non, l'angle est hors de l'intervalle 65°–75°.")]) }); },
    () => { const p = pk([8, 10, 12]);
      return X({ id: "trigexact", lv: 2, titre: "La route de col", q: "Un panneau annonce une pente de " + M(p + "\\,\\%") + " sur " + Q(3, "km") + " (distance horizontale).",
        parts: [{ label: "Quel dénivelé (en m) ?", pts: 1 }, { label: "Quel angle avec l'horizontale (au dixième) ?", pts: 1 }, { label: "Une pente de 100 % correspond à quel angle ?", pts: 1 }],
        sol: ul([M("3000 \\cdot " + N(p / 100) + " = " + 30 * p) + " m.", M("\\tan^{-1}(" + N(p / 100) + ") \\approx " + N(Math.round((Math.atan(p / 100) / D) * 10) / 10) + "°") + ".", M("45°") + " (tan 45° = 1)."]) }); },
    () => { const [o, h] = pk([[3, 5], [5, 13], [8, 17]]);
      return X({ id: "trigrel", lv: 3, titre: "Sans calculatrice", q: "Un angle aigu " + M("\\alpha") + " vérifie " + M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ".",
        parts: [{ label: "Calcule " + M("\\cos \\alpha") + " (valeur exacte).", pts: 2 }, { label: "Calcule " + M("\\tan \\alpha") + ".", pts: 1 }],
        sol: ul([M("\\cos \\alpha = \\sqrt{1 - \\frac{" + o * o + "}{" + h * h + "}} = \\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".", M("\\tan \\alpha = \\frac{" + o + "}{" + Math.sqrt(h * h - o * o) + "}") + "."]) }); },
  ];
  const RAISONT = [
    () => X({ id: "trigo", lv: 1, titre: "Trouve l'erreur", q: who() + " calcule le côté opposé à 40° avec une hypoténuse de 10 cm : « " + M("10 \\cdot \\cos 40° \\approx 7{,}66") + " cm ».", parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }], sol: ul(["Le côté opposé va avec le sinus.", M("10 \\sin 40° \\approx 6{,}43") + " cm."]) }),
    () => X({ id: "trigexact", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« sin 30° = cos 60°. »", pts: 1 }, { label: "« Une pente de 50 % correspond à un angle de 45°. »", pts: 1 }], sol: ul(["<b>Vrai</b> : les deux valent 1/2 (angles complémentaires).", "<b>Faux</b> : 45° donne 100 % ; 50 % donne environ 26,6°."]) }),
  ];

  RICH.deg2c = { ids: ["bicarre", "eq2", "eq2disc", "eq2fact", "eq3", "eqirr", "f2", "f2expr", "f2formes", "f2trois", "ineq2", "ineqfrac", "inter", "interpar", "optim", "probeq2", "trinfact"], label: "Degré 2", ex: EX2, raison: RAISON2, minutes: 45 };
  RICH.fct1c = { ids: ["absval", "domaine", "fimg", "lectgraph", "modaff", "morceaux", "racinv", "tabval", "transf"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45 };
  RICH.geo1c = { ids: ["droitesrem", "euclide", "exactes", "geocomb", "pyth", "pythfig", "pythrec", "simil", "thales"], label: "De Thalès à Pythagore", ex: EXG, raison: RAISONG, minutes: 45 };
  RICH.trig1c = { ids: ["trigexact", "trigo", "trigrel"], label: "Trigonométrie du triangle rectangle", ex: EXT, raison: RAISONT, minutes: 45 };
  // ===================== 1. Nombres =====================
  const EXN = [
    () => { const P0 = pk([80, 120, 200]), a = pk([20, 25]), b = pk([10, 20]);
      return X({ id: "pct", lv: 1, titre: "Hausse puis baisse", q: "Un article coûte " + Q(P0, "CHF") + ". Son prix augmente de " + a + " %, puis baisse de " + b + " %.",
        parts: [{ label: "Calcule le prix final.", pts: 2 }, { label: "Quel est le pourcentage de variation global ?", pts: 1 }],
        sol: ul([M(N(P0) + " \\cdot " + N(1 + a / 100) + " \\cdot " + N(1 - b / 100) + " = " + N(P0 * (1 + a / 100) * (1 - b / 100))) + " CHF.", M(N(r6(((1 + a / 100) * (1 - b / 100) - 1) * 100))) + " %."]) }); },
    () => { const e = pk([8, 9]), n = pk([3, 4, 6]);
      return X({ id: "scicalc", lv: 2, titre: "Les étoiles de la galaxie", q: "Notre galaxie compte environ " + M(n + " \\cdot 10^{11}") + " étoiles. Un ordinateur en recense " + M("2 \\cdot 10^{" + e + "}") + " par jour.",
        parts: [{ label: "Combien de jours faut-il ? (notation scientifique)", pts: 2 }, { label: "Combien d'années environ (365 jours) ?", pts: 1 }],
        sol: ul([M("\\frac{" + n + " \\cdot 10^{11}}{2 \\cdot 10^{" + e + "}} = " + N(n / 2) + " \\cdot 10^{" + (11 - e) + "}") + " jours.", "Environ " + M(N(Math.round((n / 2) * 10 ** (11 - e) / 365 * 10) / 10)) + " ans."]) }); },
    () => { const k = pk([2, 3, 5]);
      return X({ id: "rac", lv: 2, titre: "Simplifier pour comparer", q: "On compare " + M("A = \\sqrt{" + 12 * k * k + "}") + " et " + M("B = " + k + "\\sqrt{3} + \\sqrt{" + 3 * k * k + "}") + ".",
        parts: [{ label: "Écris A sous la forme " + M("a\\sqrt{3}") + ".", pts: 1 }, { label: "Écris B sous la même forme.", pts: 1 }, { label: "Conclus.", pts: 1 }],
        sol: ul([M("A = " + 2 * k + "\\sqrt{3}") + ".", M("B = " + k + "\\sqrt{3} + " + k + "\\sqrt{3} = " + 2 * k + "\\sqrt{3}") + ".", "A = B."]) }); },
    // 23.11 : racines carrées et cubiques (racprop, reprise de 11e en 1re)
    () => { const k = pk([2, 3, 4]), n = pk([2, 3, 5]), V = k ** 3 * n, lo = Math.floor(k * Math.cbrt(n)), k2 = pk([3, 4, 5]), m = pk([3, 5, 7]), a = k2 * k2 * m;
      return X({ id: "racprop", lv: 2, titre: "La boîte cubique", q: "Une boîte en forme de cube a un volume de " + Q(V, "cm^3") + ". Calculatrice non autorisée.",
        parts: [{ label: "Écris la longueur exacte de l'arête sous la forme " + M("a\\sqrt[3]{b}") + ", " + M("b") + " le plus petit possible.", pts: 1 }, { label: "Encadre l'arête entre deux entiers consécutifs.", pts: 1 }, { label: "On double l'arête. Par combien le volume est-il multiplié ? Vérifie avec la racine cubique.", pts: 1 }, { label: "Le couvercle d'une autre boîte est un carré d'aire " + Q(a, "cm^2") + ". Écris son côté et sa diagonale sous forme exacte simplifiée.", pts: 2 }],
        sol: ul([M("\\sqrt[3]{" + V + "} = \\sqrt[3]{" + k ** 3 + " \\cdot " + n + "} = " + k + "\\sqrt[3]{" + n + "}") + " cm.", M(lo + "^3 = " + lo ** 3 + " \\lt " + V + " \\lt " + (lo + 1) ** 3 + " = " + (lo + 1) + "^3") + " : l'arête est entre " + lo + " et " + (lo + 1) + " cm.", "Par " + M("2^3 = 8") + " : " + M("\\sqrt[3]{8 \\cdot " + V + "} = 2 \\cdot " + k + "\\sqrt[3]{" + n + "} = " + 2 * k + "\\sqrt[3]{" + n + "}") + ".", "Côté " + M("\\sqrt{" + a + "} = \\sqrt{" + k2 * k2 + " \\cdot " + m + "} = " + k2 + "\\sqrt{" + m + "}") + " cm ; diagonale " + M(k2 + "\\sqrt{" + m + "} \\cdot \\sqrt{2} = " + k2 + "\\sqrt{" + 2 * m + "}") + " cm."]),
        chk: [[Math.cbrt(V), k + "*" + n + "^(1/3)"], [Math.sqrt(a), k2 + "√" + m], [Math.sqrt(a) * Math.SQRT2, k2 + "√" + 2 * m]] }); },
    () => { const [a, b, c, d] = pk([[1, 2, 1, 3], [2, 3, 1, 4], [3, 4, 1, 6]]);
      return X({ id: "fracops", lv: 3, titre: "Le dosage du sirop", q: "Un sirop se dilue : " + M("\\frac{" + a + "}{" + b + "}") + " de la bouteille pour un jus, et on en a déjà utilisé " + M("\\frac{" + c + "}{" + d + "}") + ". Il reste " + M("\\frac{" + (b * d - b * c - a * d) + "}{" + b * d + "}").replace(/\\frac\{-/, "-\\frac{") + " de la bouteille après le jus.",
        parts: [{ label: "Vérifie ce reste par un calcul.", pts: 2 }, { label: "Combien de jus identiques peut-on encore faire avec ce reste ?", pts: 1 }],
        sol: ul([M("1 - \\frac{" + c + "}{" + d + "} - \\frac{" + a + "}{" + b + "} = \\frac{" + (b * d - b * c - a * d) + "}{" + b * d + "}") + ".", (b * d - b * c - a * d) >= 0 ? M(Math.floor((b * d - b * c - a * d) / (a * d))) + " jus." : "Le reste est négatif : il n'y avait pas assez de sirop pour ce jus."]) }); },
  ];
  const RAISONN = [
    () => { const [c, r] = pk([[-8, -2], [-27, -3], [-125, -5], [-64, -4]]), w = who();
      return X({ id: "racprop", lv: 1, titre: "Trouve l'erreur", q: w + " affirme : « " + M("\\sqrt[3]{" + c + "}") + " n'existe pas, car on ne peut pas prendre la racine d'un nombre négatif ».",
        parts: [{ label: "Calcule " + M("(" + r + ")^3") + ". Que peux-tu conclure ?", pts: 1 }, { label: "Pour quelle sorte de racine la remarque de " + w + " est-elle juste ? Donne un exemple.", pts: 1 }],
        sol: ul([M("(" + r + ")^3 = " + c) + " : donc " + M("\\sqrt[3]{" + c + "} = " + r) + ". La racine cubique d'un nombre négatif existe.", "Pour la racine carrée : " + M("\\sqrt{" + -c + "}") + " existe, mais pas " + M("\\sqrt{" + c + "}") + " (un carré n'est jamais négatif)."]),
        chk: [[Math.cbrt(c), String(r)]] }); },
    () => X({ id: "puiss", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("2^3 \\cdot 2^4 = 4^7") + " ».", parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }], sol: ul(["On garde la base 2 et on additionne les exposants.", M("2^7 = 128") + "."]) }),
    () => X({ id: "pct", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Deux hausses de 10 % font une hausse de 21 %. »", pts: 1 }, { label: "« √(a + b) = √a + √b. »", pts: 1 }], sol: ul(["<b>Vrai</b> : " + M("1{,}1^2 = 1{,}21") + ".", "<b>Faux</b> : " + M("\\sqrt{9 + 16} = 5 \\ne 7") + "."]) }),
  ];
  // ===================== 2. Ensembles =====================
  const EXE = [
    () => { const a = pk([-3, -2]), b = pk([4, 5]), c = pk([1, 2]), d = pk([7, 8]);
      return X({ id: "ensembles", lv: 1, titre: "Horaires d'ouverture", q: "Une piscine est ouverte de " + (a + 10) + " h à " + (b + 10) + " h (intervalle " + M("A = [" + (a + 10) + " \\,;\\, " + (b + 10) + "]") + ") ; le sauna de " + (c + 10) + " h à " + (d + 10) + " h (" + M("B = [" + (c + 10) + " \\,;\\, " + (d + 10) + "]") + ").",
        parts: [{ label: "Écris " + M("A \\cap B") + ". Que représente-t-il ?", pts: 2 }, { label: "Écris " + M("A \\cup B") + ".", pts: 1 }],
        sol: ul([M("[" + (c + 10) + " \\,;\\, " + (b + 10) + "]") + " : les heures où les deux sont ouverts.", M("[" + (a + 10) + " \\,;\\, " + (d + 10) + "]") + "."]) }); },
    () => X({ id: "ensembles", lv: 2, titre: "La bonne température", q: "Un aquarium doit rester entre 24 °C et 28 °C (bornes comprises). Le thermomètre affiche " + M("T") + ".",
      parts: [{ label: "Écris la condition avec une double inégalité, puis un intervalle.", pts: 1 }, { label: "Écris la condition avec une valeur absolue " + M("|T - c| \\le r") + ".", pts: 2 }],
      sol: ul([M("24 \\le T \\le 28") + " ; " + M("T \\in [24 \\,;\\, 28]") + ".", M("|T - 26| \\le 2") + "."]) }),
    () => { const n = pk([20, 30]);
      return X({ id: "ensembles", lv: 2, titre: "Les sports de la classe", q: "Dans une classe de " + n + " élèves, " + (n / 2) + " font du foot, " + (n / 2 - 4) + " du basket, et 3 les deux.",
        parts: [{ label: "Combien font au moins un des deux sports ?", pts: 1 }, { label: "Combien ne font ni l'un ni l'autre ?", pts: 1 }, { label: "Représente la situation par un diagramme de Venn.", pts: 1 }],
        sol: ul([M(n / 2 + " + " + (n / 2 - 4) + " - 3 = " + (n - 7)) + ".", M(n + " - " + (n - 7) + " = 7") + ".", "Deux ensembles qui se chevauchent : 3 dans l'intersection."]) }); },
    () => X({ id: "ensembles", lv: 3, titre: "Nombres et ensembles", q: "On considère les nombres " + M("-3") + ", " + M("0{,}5") + ", " + M("\\sqrt{16}") + ", " + M("\\frac{2}{3}") + ", " + M("\\sqrt{2}") + ", " + M("\\pi") + ".",
      parts: [{ label: "Lesquels sont des entiers (ℤ) ?", pts: 1 }, { label: "Lesquels sont rationnels (ℚ) ?", pts: 1 }, { label: "Lesquels sont irrationnels ?", pts: 1 }],
      sol: ul([M("-3") + " et " + M("\\sqrt{16} = 4") + ".", M("-3") + ", " + M("0{,}5") + ", " + M("4") + ", " + M("\\frac{2}{3}") + ".", M("\\sqrt{2}") + " et " + M("\\pi") + "."]) }),
  ];
  const RAISONE = [
    () => X({ id: "ensembles", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("]2 \\,;\\, 5]") + " contient 2, 3, 4 et 5 ».", parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Combien d'entiers contient-il ?", pts: 1 }], sol: ul(["Le crochet est tourné vers l'extérieur en 2 : 2 est exclu.", "3 entiers : 3, 4, 5."]) }),
    () => X({ id: "ensembles", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. »", pts: 1 }, { label: "« [1 ; 3] ∩ [3 ; 5] est vide. »", pts: 1 }], sol: ul(["<b>Vrai</b>.", "<b>Faux</b> : il contient 3."]) }),
  ];
  // ===================== 3. Argumenter =====================
  const EXR = [
    () => X({ id: "divcrit", lv: 1, titre: "Le code du cadenas", q: "Le code d'un cadenas est un nombre de 3 chiffres " + M("4\\,■\\,■") + ", divisible par 5 et par 9.",
      parts: [{ label: "Quel peut être le chiffre des unités ?", pts: 1 }, { label: "Trouve toutes les possibilités pour le code.", pts: 2 }],
      sol: ul(["0 ou 5 (divisible par 5).", "Somme des chiffres multiple de 9 : 450 (4 + 5 + 0), 405 (4 + 0 + 5), 495 (4 + 9 + 5)."]) }),
    () => { const n = pk([3, 4, 5]);
      return X({ id: "tradexpr", lv: 2, titre: "Le tour de magie", q: "Pense à un nombre. Ajoute " + n + ", multiplie par 2, soustrais " + 2 * n + ", puis divise par 2.",
        parts: [{ label: "Essaie avec deux nombres. Que remarques-tu ?", pts: 1 }, { label: "Prouve-le en appelant " + M("x") + " le nombre de départ.", pts: 2 }],
        sol: ul(["On retrouve le nombre de départ.", M("\\frac{2(x + " + n + ") - " + 2 * n + "}{2} = \\frac{2x}{2} = x") + "."]) }); },
    () => X({ id: "divcrit", lv: 2, titre: "Trois entiers consécutifs", q: "On additionne trois nombres entiers consécutifs.",
      parts: [{ label: "Essaie avec 4, 5, 6 puis 10, 11, 12. Que remarques-tu ?", pts: 1 }, { label: "Prouve que la somme est toujours divisible par 3.", pts: 2 }],
      sol: ul(["15 et 33 : des multiples de 3.", M("n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)") + "."]) }),
    () => X({ id: "tradexpr", lv: 3, titre: "Pair ou impair ?", q: "On s'intéresse à la somme de deux nombres impairs.",
      parts: [{ label: "Écris un nombre impair à l'aide d'un entier " + M("n") + ".", pts: 1 }, { label: "Prouve que la somme de deux impairs est paire.", pts: 2 }, { label: "Le produit de deux impairs est-il pair ou impair ? Justifie.", pts: 1 }],
      sol: ul([M("2n + 1") + ".", M("(2n + 1) + (2m + 1) = 2(n + m + 1)") + " : pair.", "Impair : " + M("(2n + 1)(2m + 1) = 2(2nm + n + m) + 1") + "."]) }),
  ];
  const RAISONR = [
    () => X({ id: "divcrit", lv: 1, titre: "Trouve l'erreur", q: who() + " dit : « 7 + 9 = 16 et 16 n'est pas divisible par 3, donc 79 n'est pas divisible par 3, mais 81 non plus car il finit par 1 ».", parts: [{ label: "Où est l'erreur pour 81 ?", pts: 1 }, { label: "81 est-il divisible par 3 ?", pts: 1 }], sol: ul(["Pour 3, on regarde la somme des chiffres, pas le dernier chiffre.", "Oui : 8 + 1 = 9."]) }),
    () => X({ id: "tradexpr", lv: 2, titre: "Un exemple suffit-il ?", q: who() + " vérifie que " + M("n^2 + n + 41") + " est premier pour n = 1, 2, 3, 4 et conclut : « c'est toujours un nombre premier ».", parts: [{ label: "Un exemple peut-il prouver une propriété générale ?", pts: 1 }, { label: "Teste n = 41.", pts: 1 }], sol: ul(["Non : il faut une preuve ; un seul contre-exemple suffit à réfuter.", M("41^2 + 41 + 41 = 41 \\cdot 43") + " : pas premier."]) }),
  ];

  RICH.no1c = { ids: ["arith", "fracops", "pct", "puiss", "rac", "racenc", "racprop", "rel", "sci", "scicalc"], label: "Nombres", ex: EXN, raison: RAISONN, minutes: 45 };
  RICH.ens1c = { ids: ["ensembles"], label: "Ensembles", ex: EXE, raison: RAISONE, minutes: 45 };
  RICH.arg1c = { ids: ["divcrit", "tradexpr"], label: "Argumenter", ex: EXR, raison: RAISONR, minutes: 45 };
})();

// Chantier 1re Collège · systèmes et fonctions affines (18.11) : exercices riches et raisonnements du test de préparation
// (contexte, plusieurs étapes, interprétation), même format que riche.js. Chargé après riche.js.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const T = (v) => M(N(v));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const sys = (...r) => M("\\begin{cases} " + r.join(" \\\\ ") + " \\end{cases}");
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);

  const EX = [
    // Forfaits de téléphone (fonctions affines, intersection, interprétation)
    () => { const fa = pk([10, 15, 20]), pa = pk([0.1, 0.2]), pb = pk([0.4, 0.5]), x0 = r6(fa / (pb - pa));
      return X({ id: "affine", lv: 1, titre: "Deux forfaits",
        q: "Forfait A : " + fa + " CHF par mois plus " + N(pa).replace("{,}", ",") + " CHF la minute. Forfait B : " + N(pb).replace("{,}", ",") + " CHF la minute, sans abonnement. On note " + M("x") + " le nombre de minutes par mois.",
        parts: [{ label: "Écris le coût " + M("A(x)") + " et le coût " + M("B(x)") + ".", pts: 1 }, { label: "Pour combien de minutes les deux forfaits coûtent-ils la même chose ?", pts: 2 }, { label: who() + " téléphone environ 2 h par mois. Quel forfait lui conseilles-tu ? Justifie.", pts: 1 }],
        sol: ul([M("A(x) = " + N(pa) + "x + " + fa) + ", " + M("B(x) = " + N(pb) + "x") + ".", M(N(pa) + "x + " + fa + " = " + N(pb) + "x") + ", " + M("x = " + N(x0)) + " minutes.", "120 min : A coûte " + M(N(r6(pa * 120 + fa))) + " CHF, B " + M(N(r6(pb * 120))) + " CHF : " + (pa * 120 + fa < pb * 120 ? "le forfait A." : "le forfait B.")]) }); },
    // Poules et lapins (système)
    () => { const l = R.int(8, 20), p = R.int(10, 30), t = l + p, pa = 4 * l + 2 * p;
      return X({ id: "sysprob", lv: 1, titre: "La ferme",
        q: "Dans une ferme, on compte " + t + " têtes et " + pa + " pattes. Il n'y a que des poules et des lapins.",
        parts: [{ label: "Choisis deux inconnues et écris un système.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "Vérifie ta réponse dans l'énoncé.", pts: 1 }],
        sol: ul([sys("p + \\ell = " + t, "2p + 4\\ell = " + pa) + " (" + M("p") + " poules, " + M("\\ell") + " lapins).", M("2p + 2\\ell = " + 2 * t) + " ; on soustrait : " + M("2\\ell = " + (pa - 2 * t)) + ", " + M("\\ell = " + l) + ", " + M("p = " + p) + ".", M(p + " + " + l + " = " + t) + " têtes et " + M(2 * p + " + " + 4 * l + " = " + pa) + " pattes ✓."]) }); },
    // Le bateau et le courant
    () => { const [v, c] = pk([[12, 2], [15, 3], [18, 2], [18, 3]]);
      const D = (v + c) * 2, t2 = D / (v - c);
      return X({ id: "sysprob", lv: 2, titre: "Le bateau et le courant",
        q: "Un bateau descend une rivière : il parcourt " + D + " km en 2 h. Il remonte ensuite la même distance en " + T(r6(t2)) + " h.",
        parts: [{ label: "Calcule sa vitesse en descendant et en remontant.", pts: 1 }, { label: "En notant " + M("v") + " la vitesse du bateau en eau calme et " + M("c") + " celle du courant, écris un système et résous-le.", pts: 2 }, { label: "Combien de temps lui faudrait-il pour parcourir " + D + " km sur un lac (sans courant) ?", pts: 1 }],
        sol: ul([M(D + " : 2 = " + (v + c)) + " km/h et " + M(D + " : " + N(r6(t2)) + " = " + (v - c)) + " km/h.", sys("v + c = " + (v + c), "v - c = " + (v - c)) + " : " + M("v = " + v) + ", " + M("c = " + c) + ".", M(D + " : " + v + " \\approx " + N(Math.round((D / v) * 100) / 100)) + " h."]) }); },
    // Droites et système (lecture graphique, calcul)
    () => { const a = pk([1, 2]), b = pk([-1, 1, 2]), c = pk([-1, -2]), e = pk([5, 4, 7]), x0 = (e - b) / (a - c), y0 = a * x0 + b;
      return X({ id: "sysgraph", lv: 2, titre: "Deux droites",
        q: "On considère les droites " + M("d_1 : y = " + (a === 1 ? "" : a) + "x" + (b < 0 ? " - " + -b : " + " + b)) + " et " + M("d_2 : y = " + (c === -1 ? "-" : c) + "x + " + e) + ".",
        parts: [{ label: "Calcule les coordonnées de leur point d'intersection.", pts: 2 }, { label: "Écris l'équation d'une droite " + M("d_3") + " qui n'a aucun point commun avec " + M("d_1") + ".", pts: 1 }, { label: "Le système formé par " + M("d_1") + " et " + M("2y = " + 2 * a + "x" + (2 * b < 0 ? " - " + -2 * b : " + " + 2 * b)) + " a-t-il une, aucune ou une infinité de solutions ? Explique.", pts: 1 }],
        sol: ul([M(a + "x" + (b < 0 ? " - " + -b : " + " + b) + " = " + c + "x + " + e) + ", " + M("x = " + N(r6(x0))) + ", " + M("y = " + N(r6(y0))) + ".", "Une droite parallèle : même pente " + M(a) + ", autre ordonnée à l'origine, par exemple " + M("y = " + (a === 1 ? "" : a) + "x + " + (b + 5)) + ".", "Une infinité : en divisant par 2, c'est la même équation (droites confondues)."]) }); },
    // Parabole par trois points (système 3x3)
    () => { const a = pk([1, -1, 2]), b = pk([-2, 0, 3]), c = pk([1, -3, 4]), ys = [-1, 0, 1].map((x) => a * x * x + b * x + c);
      return X({ id: "sys3", lv: 3, titre: "La parabole cachée",
        q: "Une parabole " + M("y = ax^2 + bx + c") + " passe par " + M("A(-1 \\,;\\, " + ys[0] + ")") + ", " + M("B(0 \\,;\\, " + ys[1] + ")") + " et " + M("C(1 \\,;\\, " + ys[2] + ")") + ".",
        parts: [{ label: "Écris le système de trois équations.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "La parabole passe-t-elle par " + M("D(2 \\,;\\, " + (4 * a + 2 * b + c + 1) + ")") + " ? Justifie.", pts: 1 }],
        sol: ul([sys("a - b + c = " + ys[0], "c = " + ys[1], "a + b + c = " + ys[2]), M("c = " + c) + " ; en additionnant la 1re et la 3e : " + M("2a + 2c = " + (ys[0] + ys[2])) + ", " + M("a = " + a) + " ; puis " + M("b = " + b) + ".", "Non : pour " + M("x = 2") + ", " + M("y = " + (4 * a + 2 * b + c)) + ", pas " + (4 * a + 2 * b + c + 1) + "."]) }); },
    // Budget d'une sortie (système d'inéquations)
    () => { const B = pk([600, 750, 900]), car = pk([240, 300]), p = pk([12, 15]), mn = pk([10, 12, 15]), mx = Math.floor((B - car) / p);
      return X({ id: "sysineq", lv: 2, titre: "La sortie de classe",
        q: "Pour une sortie, la classe dispose de " + B + " CHF. Le car coûte " + car + " CHF et l'entrée " + p + " CHF par élève. Il faut au moins " + mn + " élèves pour que le car soit réservé. On note " + M("x") + " le nombre d'élèves.",
        parts: [{ label: "Écris un système de deux inéquations.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "Combien de nombres d'élèves sont possibles ?", pts: 1 }],
        sol: ul([sys(car + " + " + p + "x \\le " + B, "x \\ge " + mn), M(p + "x \\le " + (B - car)) + ", " + M("x \\le " + N(r6((B - car) / p))) + " ; avec " + M("x \\ge " + mn) + " : " + M("S = [" + mn + " \\,;\\, " + N(r6((B - car) / p)) + "]") + ".", "Les entiers de " + mn + " à " + mx + " : " + (mx - mn + 1) + " possibilités."]) }); },
    // Signe et zéro (affzero)
    () => { let z, a, k, b; do { z = pk([2, 3, 4]); a = pk([-3, -2, 2, 3]); k = R.int(-6, 6); b = (a * z + k) / (a - 1); } while (!Number.isInteger(b) || k === 0);
      const gk = k < 0 ? " - " + -k : " + " + k, op = a - 1 < 0 ? "\\le" : "\\ge";
      return X({ id: "affzero", lv: 2, titre: "Étude de signe",
        q: "Soit " + M("f(x) = " + a + "x " + (-a * z < 0 ? "- " + a * z : "+ " + -a * z)) + " et " + M("g(x) = x" + gk) + ".",
        parts: [{ label: "Calcule le zéro de " + M("f") + " et dresse le tableau de signes de " + M("f") + ".", pts: 2 }, { label: "Résous " + M("f(x) \\ge g(x)") + ".", pts: 2 }],
        sol: ul(["Zéro : " + M("x = " + z) + ". " + (a > 0 ? "Pente positive : " + M("f") + " négative avant " + z + ", positive après." : "Pente négative : " + M("f") + " positive avant " + z + ", négative après."), M((a - 1) + "x \\ge " + (a * z + k)) + (a - 1 < 0 ? " ; on divise par un négatif, le sens change" : "") + " : " + M("x " + op + " " + b) + "."]) }); },
    // Le plombier (affine, deux points)
    () => { const h1 = pk([2, 3]), h2 = h1 + pk([2, 3]), t = pk([75, 80, 90]), dpl = pk([50, 60, 70]);
      return X({ id: "affine", lv: 2, titre: "La facture du plombier",
        q: "Un plombier facture un déplacement fixe et un tarif horaire. Pour " + h1 + " h de travail, il demande " + (dpl + t * h1) + " CHF ; pour " + h2 + " h, " + (dpl + t * h2) + " CHF.",
        parts: [{ label: "Calcule le tarif horaire.", pts: 1 }, { label: "Calcule le prix du déplacement et écris la fonction " + M("P(h)") + ".", pts: 2 }, { label: "Un client a payé " + (dpl + t * 4.5) + " CHF. Combien de temps le plombier a-t-il travaillé ?", pts: 1 }],
        sol: ul([M("\\frac{" + (dpl + t * h2) + " - " + (dpl + t * h1) + "}{" + (h2 - h1) + "} = " + t) + " CHF/h.", M((dpl + t * h1) + " - " + t + " \\cdot " + h1 + " = " + dpl) + " ; " + M("P(h) = " + t + "h + " + dpl) + ".", M(t + "h + " + dpl + " = " + N(dpl + t * 4.5)) + ", " + M("h = 4{,}5") + " : 4 h 30."]) }); },
  ];
  const RAISON = [
    () => { const w = who();
      return X({ id: "sys2", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + sys("x + y = 10", "x - y = 4") + " et répond « " + M("x = 7") + " ».",
        parts: [{ label: "Vérifie la valeur de " + w + ". Que manque-t-il à sa réponse ?", pts: 1 }, { label: "Donne la solution complète.", pts: 1 }],
        sol: ul([M("x = 7") + " est juste, mais la solution d'un système est un <b>couple</b> : il manque " + M("y") + ".", M("y = 10 - 7 = 3") + " ; " + M("S = \\{(7 \\,;\\, 3)\\}") + ", vérifié : " + M("7 - 3 = 4") + "."]) }); },
    () => { const S = [["« Deux droites de même pente n'ont jamais de point commun. »", false, "Si elles ont aussi la même ordonnée à l'origine, elles sont confondues (une infinité de points communs)."], ["« Un système de deux équations du 1er degré peut avoir exactement deux solutions. »", false, "Deux droites distinctes se coupent en un point au plus ; sinon aucune ou une infinité."], ["« Si a < 0, la fonction f(x) = ax + b est positive avant son zéro. »", true, "Elle est décroissante : positive avant le zéro, négative après."], ["« Le système x > 3 et x < 1 n'a aucune solution. »", true, "Aucun nombre n'est à la fois plus grand que 3 et plus petit que 1."]];
      return X({ id: "sysgraph", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie (exemple, contre-exemple ou propriété).",
        parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const w = who();
      return X({ id: "sysineq", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + sys("-2x + 1 > 7", "x + 5 \\ge 0") + " : « " + M("-2x > 6") + ", donc " + M("x > -3") + " ; et " + M("x \\ge -5") + ". Donc " + M("S = \\,]-3 \\,;\\, +\\infty[") + " ».",
        parts: [{ label: "Teste " + M("x = 0") + " dans la première inéquation. Que constates-tu ?", pts: 1 }, { label: "Corrige l'erreur et donne l'ensemble des solutions.", pts: 2 }],
        sol: ul([M("-2 \\cdot 0 + 1 = 1") + ", et " + M("1 > 7") + " est faux : 0 n'est pas solution, alors que " + w + " l'incluait.", "En divisant par " + M("-2") + ", on retourne le sens : " + M("x < -3") + ". Avec " + M("x \\ge -5") + " : " + M("S = [-5 \\,;\\, -3[") + "."]) }); },
    () => X({ id: "affine", lv: 2, titre: "Construis un exemple",
        q: "Réponds à chaque demande par un exemple, et justifie.",
        parts: [{ label: "Une fonction affine dont le zéro est 4 et qui est croissante.", pts: 1 }, { label: "Un système de deux équations qui a pour unique solution " + M("(2 \\,;\\, -1)") + ".", pts: 1 }, { label: "Un système de deux équations sans solution.", pts: 1 }],
        sol: ul(["Par exemple " + M("f(x) = x - 4") + " (pente 1 > 0, " + M("f(4) = 0") + ").", "Par exemple " + sys("x + y = 1", "x - y = 3") + " (vérifié : " + M("2 - 1 = 1") + ", " + M("2 + 1 = 3") + ").", "Par exemple " + sys("x + y = 1", "x + y = 2") + " : droites parallèles."]) }),
  ];
  RICH.sys1c = { ids: ["sys2", "sysprob", "sysgraph", "sys3", "affine", "affzero", "sysineq"], label: "Systèmes et fonctions affines", ex: EX, raison: RAISON, minutes: 45 };
})();

// Chantier 1re Collège · équations (16.11) : leçons actives (devine / manipule / retiens) et rappels de cours pour
// eq1, eqfrac, eqspec, formule, probeq, eq2fact, eq2, eq2disc, probeq2, eq3, bicarre, eqirr. Chargé après active.js et
// lessons2.js. Pas de TeX dans ce qui est redessiné (exposants en caractères ², ³, ⁴).
(function () {
  const R2 = {
    eq1: ["Équations du 1er degré", "Résoudre, c'est trouver tous les nombres qui rendent l'égalité vraie.",
      "Une équation est une balance : on peut faire la même opération des deux côtés (ajouter, soustraire, multiplier ou diviser par un nombre non nul) sans changer ses solutions. On regroupe les \\(x\\) d'un côté et les nombres de l'autre, puis on divise par le coefficient de \\(x\\), avec son signe. On contrôle en remplaçant \\(x\\) dans l'équation de départ.",
      ["\\(6x - 7 = 2x + 5\\), \\(4x = 12\\), \\(x = 3\\). Contrôle : \\(11 = 11\\).", "\\(7 - 2x = 15\\), \\(-2x = 8\\), \\(x = -4\\).", "\\(4x + 1 = 2x + 8\\), \\(2x = 7\\), \\(x = \\frac{7}{2}\\) : la solution peut être une fraction."],
      "Un terme qui « change de côté » change de signe : c'est parce qu'on l'a soustrait (ou ajouté) des deux côtés."],
    eqfrac: ["Parenthèses et fractions", "On se ramène à une équation sans parenthèses ni fractions.",
      "Parenthèses : on développe (ou on divise d'abord les deux membres, si c'est plus simple). Un « − » devant une parenthèse change le signe de chaque terme. Fractions : on multiplie <b>chaque terme</b> des deux membres par le plus petit dénominateur commun ; un « − » devant une fraction porte sur tout son numérateur. Deux fractions égales : produit en croix.",
      ["\\(\\frac{x}{2} + \\frac{x}{3} = 5\\) ; fois 6 : \\(3x + 2x = 30\\), \\(x = 6\\).", "\\(\\frac{x + 1}{2} - \\frac{x - 3}{3} = 2\\) ; fois 6 : \\(3(x + 1) - 2(x - 3) = 12\\), \\(x = 3\\).", "\\(\\frac{2x - 1}{3} = \\frac{x + 4}{2}\\) ; en croix : \\(2(2x - 1) = 3(x + 4)\\), \\(x = 14\\)."],
      "Quand on multiplie par 6, le nombre seul du membre de droite est aussi multiplié par 6."],
    eqspec: ["Aucune solution, tous les nombres", "Une équation du 1er degré n'a pas toujours une seule solution.",
      "Si, en regroupant, les \\(x\\) disparaissent, il reste une égalité entre deux nombres. Fausse (\\(3 = 5\\)) : aucun nombre ne convient, \\(S = \\varnothing\\). Vraie (\\(0 = 0\\)) : tous les nombres conviennent, \\(S = \\mathbb{R}\\). Si les \\(x\\) ne disparaissent pas, il y a une seule solution, qui peut être \\(0\\).",
      ["\\(2x + 3 = 2x + 5\\) donne \\(3 = 5\\) : faux, aucune solution.", "\\(3(x + 2) = 3x + 6\\) donne \\(0 = 0\\) : vrai, tous les nombres.", "\\(5x + 2 = 3x + 2\\) donne \\(2x = 0\\), \\(x = 0\\) : une solution."],
      "« \\(x = 0\\) » est une solution ; « aucune solution » est tout autre chose."],
    formule: ["Transformer une formule", "Isoler une lettre, c'est résoudre une équation dont cette lettre est l'inconnue.",
      "Les autres lettres se traitent comme des nombres. On défait les opérations qui entourent la lettre cherchée, de l'extérieur vers l'intérieur, en faisant la même opération des deux côtés. Si la lettre est au carré et représente une grandeur positive, on termine par une racine carrée.",
      ["\\(v = \\frac{d}{t}\\), \\(vt = d\\), \\(t = \\frac{d}{v}\\).", "\\(A = \\frac{(B + b)h}{2}\\), \\(B + b = \\frac{2A}{h}\\), \\(B = \\frac{2A}{h} - b\\).", "\\(A = \\pi r^2\\), \\(r^2 = \\frac{A}{\\pi}\\), \\(r = \\sqrt{\\frac{A}{\\pi}}\\)."],
      "Dans \\(v = u + at\\), on soustrait \\(u\\) <b>avant</b> de diviser par \\(a\\) : \\(t = \\frac{v - u}{a}\\)."],
    probeq: ["Mettre un problème en équation", "L'algèbre traduit un énoncé en une équation qu'on sait résoudre.",
      "1. Lire et repérer ce qu'on cherche. 2. Choisir l'inconnue et écrire ce qu'elle représente. 3. Traduire l'énoncé en équation (un dessin ou un tableau aide). 4. Résoudre. 5. Vérifier dans l'énoncé, pas seulement dans l'équation. 6. Répondre par une phrase.",
      ["Trois entiers consécutifs de somme 48 : \\(n + (n + 1) + (n + 2) = 48\\), \\(n = 15\\).", "Prix après 20 % de réduction : 300 CHF, donc \\(0{,}8x = 300\\), \\(x = 375\\) CHF.", "Notes 4 ; 4,5 ; 5 : pour 5 de moyenne avec une 4e note, \\(\\frac{13{,}5 + x}{4} = 5\\), \\(x = 6{,}5\\) : impossible !"],
      "Une solution de l'équation peut ne pas convenir au problème (note supérieure à 6, nombre d'objets non entier, âge négatif)."],
    eq2fact: ["Résoudre en factorisant", "Beaucoup d'équations du 2e degré se résolvent sans formule.",
      "Méthode directe : \\(x^2 = a\\) a deux solutions \\(\\pm\\sqrt{a}\\) si \\(a > 0\\), une (0) si \\(a = 0\\), aucune si \\(a < 0\\). Sinon : on ramène tout à gauche (\\(\\ldots = 0\\)), on factorise (mise en évidence, identité remarquable, trinôme) et on annule chaque facteur.",
      ["\\(4x^2 = 9\\), \\(x = \\pm\\frac{3}{2}\\).", "\\(x^2 = 5x\\), \\(x(x - 5) = 0\\) : \\(x = 0\\) ou \\(x = 5\\).", "\\(x^2 + 4x = 21\\), \\((x + 7)(x - 3) = 0\\) : \\(x = -7\\) ou \\(x = 3\\)."],
      "Ne divise jamais par \\(x\\) : tu perdrais la solution \\(x = 0\\)."],
    eq2: ["Le produit nul", "Un produit vaut zéro si et seulement si l'un de ses facteurs vaut zéro.",
      "\\(A \\cdot B = 0 \\iff A = 0\\) ou \\(B = 0\\). On écrit l'équation sous forme « produit \\(= 0\\) », puis on résout chaque facteur \\(= 0\\). Un facteur qui ne s'annule jamais (\\(3\\), \\(x^2 + 1\\)) ne donne pas de solution.",
      ["\\((x - 2)(x + 5) = 0\\) : \\(x = 2\\) ou \\(x = -5\\).", "\\((3x - 1)(x + 4)x = 0\\) : trois solutions, \\(\\frac{1}{3}\\), \\(-4\\) et \\(0\\).", "\\((x - 2)(x + 3) = 6\\) : on développe d'abord, \\(x^2 + x - 12 = 0\\), puis \\((x + 4)(x - 3) = 0\\)."],
      "Seul 0 a cette propriété : \\((x - 2)(x + 3) = 6\\) ne dit pas que \\(x - 2 = 6\\)."],
    eq2disc: ["La formule du 2e degré", "Une méthode qui marche pour toute équation \\(ax^2 + bx + c = 0\\).",
      "On calcule le discriminant \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : deux solutions \\(x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}\\). Si \\(\\Delta = 0\\) : une solution \\(x = \\frac{-b}{2a}\\). Si \\(\\Delta < 0\\) : aucune solution réelle. La somme des solutions vaut \\(-\\frac{b}{a}\\), leur produit \\(\\frac{c}{a}\\).",
      ["\\(5x^2 - 4x - 1 = 0\\) : \\(\\Delta = 36\\), \\(x = \\frac{4 \\pm 6}{10}\\), soit \\(1\\) ou \\(-\\frac{1}{5}\\).", "\\(x^2 - 2x + 1 = 0\\) : \\(\\Delta = 0\\), \\(x = 1\\).", "\\(x^2 - 2x - 1 = 0\\) : \\(\\Delta = 8\\), \\(x = 1 \\pm \\sqrt{2}\\)."],
      "On divise par \\(2a\\), et le numérateur commence par \\(-b\\) : si \\(b = -4\\), \\(-b = 4\\)."],
    probeq2: ["Problèmes du 2e degré", "Certains problèmes mènent à une équation qui contient \\(x^2\\).",
      "On pose l'inconnue, on écrit l'équation (aire, Pythagore, produit…), on la ramène à \\(ax^2 + bx + c = 0\\) et on la résout. Puis on garde seulement les solutions qui ont un sens : une longueur ou une durée est positive, une largeur d'allée ne dépasse pas le jardin.",
      ["Rectangle de largeur \\(x\\), longueur \\(x + 3\\), aire 40 : \\(x^2 + 3x - 40 = 0\\), \\(x = 5\\) (on écarte \\(-8\\)).", "Deux entiers consécutifs de produit 72 : \\(n(n + 1) = 72\\), \\(n = 8\\)."],
      "L'équation a souvent deux solutions ; le problème n'en garde parfois qu'une."],
    eq3: ["Équations de degré 3", "On se ramène à un produit nul.",
      "On ramène tout à gauche, on met en évidence \\(x\\) (ou \\(x^2\\), ou un groupe), on factorise ce qui reste, puis on annule chaque facteur. Une équation de degré 3 a au plus trois solutions.",
      ["\\(x^3 - 9x = 0\\), \\(x(x - 3)(x + 3) = 0\\) : \\(-3\\), \\(0\\), \\(3\\).", "\\(x^3 - 7x^2 + 12x = 0\\), \\(x(x - 3)(x - 4) = 0\\).", "\\(x^3 + 2x^2 - 9x - 18 = (x + 2)(x^2 - 9)\\) : \\(-3\\), \\(-2\\), \\(3\\)."],
      "Diviser par \\(x\\) fait perdre la solution \\(x = 0\\)."],
    bicarre: ["Équations bicarrées", "Une équation en \\(x^4\\) et \\(x^2\\) est du 2e degré « déguisée ».",
      "On pose \\(X = x^2\\), on résout \\(aX^2 + bX + c = 0\\), puis on revient à \\(x\\) : chaque \\(X > 0\\) donne deux solutions \\(\\pm\\sqrt{X}\\), \\(X = 0\\) donne \\(0\\), et \\(X < 0\\) n'en donne aucune.",
      ["\\(x^4 - 5x^2 + 4 = 0\\) : \\(X = 1\\) ou \\(X = 4\\), donc \\(x = \\pm 1\\) ou \\(x = \\pm 2\\).", "\\(x^4 + 3x^2 - 4 = 0\\) : \\(X = 1\\) ou \\(X = -4\\), donc \\(x = \\pm 1\\)."],
      "Les solutions sont les valeurs de \\(x\\), pas celles de \\(X\\) : il faut revenir à \\(x\\)."],
    eqirr: ["Équations irrationnelles", "L'inconnue est sous une racine carrée.",
      "On isole la racine, on élève les deux membres au carré, on résout, puis on <b>vérifie</b> chaque valeur dans l'équation de départ. Élever au carré peut ajouter des solutions « parasites » : si \\(A^2 = B^2\\), on a \\(A = B\\) ou \\(A = -B\\). Une racine carrée n'est jamais négative.",
      ["\\(\\sqrt{x + 3} = 4\\), \\(x + 3 = 16\\), \\(x = 13\\).", "\\(\\sqrt{x + 7} = x + 1\\), au carré \\(x^2 + x - 6 = 0\\) : \\(2\\) convient, \\(-3\\) est parasite (\\(x + 1 = -2 < 0\\))."],
      "\\(\\sqrt{x + 1} = -2\\) n'a aucune solution : une racine n'est jamais négative."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  // ---------- outils ----------
  const fr = (v) => { if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v)).replace("-", "−"); for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return (v < 0 ? "−" : "") + Math.abs(Math.round(v * d)) + "/" + d; return String(+v.toFixed(3)).replace(".", ",").replace("-", "−"); };
  const nb = (v) => String(+(+v).toFixed(3)).replace(".", ",").replace("-", "−");
  const cx = (a) => { const s = fr(Math.abs(a)); return (a < 0 ? "−" : "") + (s === "1" ? "x" : s.includes("/") ? s.replace("/", "x/") : s + "x"); };
  const side = (a, b) => { if (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) return "0"; let t = Math.abs(a) > 1e-9 ? cx(a) : ""; if (Math.abs(b) > 1e-9) t += t ? (b < 0 ? " − " : " + ") + fr(Math.abs(b)) : fr(b); return t; };
  const near = (u, v) => Math.abs(u - v) < 1e-9;

  // Balance : ax + b = cx + d ; on applique la même opération aux deux membres (k réglable).
  const balance = (E, opts = {}) => (box, onWin) => {
    let step = 0, k = 1, st, hist;
    const load = () => { if (step >= E.length) return; st = E[step].slice(0, 4); hist = [E[step][4] || side(st[0], st[1]) + " = " + side(st[2], st[3])]; k = 1; };
    load();
    const ops = [["+", "+ k"], ["-", "− k"], ["+x", "+ kx"], ["-x", "− kx"], ["*", "× k"], ["/", "÷ k"]];
    const draw = () => {
      if (step >= E.length) return;
      const [a, b, c, d] = st, gone = near(a, 0) && near(c, 0);
      box.innerHTML = `<div class="act-out">${hist.map((h, i) => (i ? "⇔ " : "") + h).join("<br>")}</div>
        ${gone ? `<div class="small muted">Plus de x : l'égalité ${fr(b)} = ${fr(d)} est ${near(b, d) ? "vraie" : "fausse"}. Que conclus-tu ?</div><div class="seg"><button type="button" data-c="none">Aucune solution</button><button type="button" data-c="all">Tous les nombres</button></div>`
          : `${actStepper("k", fr(k), "k")}<div class="seg act-ops">${ops.map(([o, l]) => `<button type="button" data-o="${o}">${l.replace("kx", Math.abs(k) === 1 ? (k < 0 ? "(−x)" : "x") : (k < 0 ? "(" + fr(k) + "x)" : fr(k) + "x")).replace("k", k < 0 ? "(" + fr(k) + ")" : fr(k))}</button>`).join("")}</div><div class="small muted">La même opération s'applique aux deux membres.</div>`}`;
      if (!gone) {
        actBindStepper(box, "k", () => k, (v) => { k = v === 0 ? (k > 0 ? -1 : 1) : v; draw(); }, -12, 12);
        box.querySelectorAll("[data-o]").forEach((el) => (el.onclick = () => {
          const o = el.dataset.o;
          if (o === "+") { st[1] += k; st[3] += k; } else if (o === "-") { st[1] -= k; st[3] -= k; }
          else if (o === "+x") { st[0] += k; st[2] += k; } else if (o === "-x") { st[0] -= k; st[2] -= k; }
          else if (o === "*") st = st.map((v) => v * k); else st = st.map((v) => v / k);
          st = st.map((v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v));
          hist.push(side(st[0], st[1]) + " = " + side(st[2], st[3])); if (hist.length > 6) hist.splice(1, 1); check();
        }));
      } else box.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => {
        const ok = (el.dataset.c === "all") === near(st[1], st[3]);
        if (!ok) { $hint(box, "Relis l'égalité qui reste : est-elle vraie ou fausse ?"); return; }
        onWin(step, E[step][5] || (near(st[1], st[3]) ? "0 = 0 est toujours vrai : tous les nombres sont solutions." : "L'égalité est fausse quel que soit x : aucune solution.")); step++; load(); draw();
      }));
    };
    const check = () => {
      const [a, b, c, d] = st;
      const sol = (near(a, 1) && near(b, 0) && near(c, 0)) ? d : (near(c, 1) && near(d, 0) && near(a, 0)) ? b : null;
      if (sol !== null) { onWin(step, E[step][5] || "Solution : x = " + fr(sol) + ".<br>Contrôle-la dans l'équation de départ."); step++; load(); }
      draw();
    };
    draw();
  };

  // Chercheur de solutions : un curseur sur x, l'expression calculée en direct ; chaque défi vérifie (x, vus).
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.start, step = 0; const seen = new Set();
    const draw = () => {
      box.innerHTML = actStepper(o.label || "x", nb(x), "x") + o.show(x, step) + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return; const m = o.wins[step](x, seen); if (m) { onWin(step, m); step++; check(); } };
    draw();
  };

  // Choix des étapes : à chaque état, choisir la bonne opération à faire des deux côtés.
  const chooser = (D) => (box, onWin) => {
    let step = 0, j = 0;
    const draw = () => {
      if (step >= D.length) return;
      const S = D[step], cur = S[j];
      box.innerHTML = `<div class="act-out">${S.slice(0, j + 1).map((s) => s.f).join("<br>⇔ ")}</div><div class="small muted">${cur.ask}</div>
        <div class="seg">${cur.ch.map((c, i) => `<button type="button" data-ch="${i}">${c}</button>`).join("")}</div>`;
      box.querySelectorAll("[data-ch]").forEach((el) => (el.onclick = () => {
        if (+el.dataset.ch !== cur.good) { $hint(box, cur.no); return; }
        j++;
        if (j >= S.length - 1) { onWin(step, S[S.length - 1].f + ". " + S[S.length - 1].why); step++; j = 0; }
        draw();
      }));
    };
    draw();
  };

  const sq = (v) => nb(v * v);
  Object.assign(ACTIVE, {
    eq1: {
      predict: { q: "Dans 3x + 5 = 20, on « fait passer » le 5 de l'autre côté. Que fait-on vraiment ?", choices: ["On soustrait 5 des deux côtés", "On efface le 5", "On divise par 5"], good: 0, why: "Une équation est une balance : on retire 5 des deux plateaux, 3x = 15. Le 5 ne « saute » pas : il est soustrait des deux côtés." },
      defis: ["Résous 3x + 5 = 20 en choisissant k et l'opération.", "Résous 5x − 3 = 2x + 9 : commence par les x.", "Résous 7 − 2x = 15 (attention au signe de −2x)."],
      play: balance([[3, 5, 0, 20], [5, -3, 2, 9], [-2, 7, 0, 15]]),
    },
    eqfrac: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Fractions : on multiplie chaque terme des deux membres par le plus petit dénominateur commun (un multiple de tous les dénominateurs). Un nombre seul est lui aussi multiplié. Il reste une équation sans fraction, qu'on résout.", exemple: ["\\(\\frac{x}{2} + \\frac{x}{3} = 5\\) ; fois 6 : \\(3x + 2x = 30\\), \\(x = 6\\).", "\\(\\frac{x}{4} - 1 = \\frac{x}{6}\\) ; fois 12 : \\(3x - 12 = 2x\\), \\(x = 12\\).", "\\(\\frac{x + 1}{2} = \\frac{x - 3}{3} + 2\\) ; fois 6 : \\(3(x + 1) = 2(x - 3) + 12\\), \\(x = 3\\)."] },
      predict: { q: "Pour faire disparaître les fractions de x/2 + x/3 = 5, on multiplie les deux membres par…", choices: ["5", "6", "2 + 3"], good: 1, why: "6 est un multiple de 2 et de 3 : 6 · x/2 = 3x et 6 · x/3 = 2x. Et le 5 devient 30." },
      defis: ["Résous x/2 + x/3 = 5 : multiplie d'abord par 6.", "Résous x/4 − 1 = x/6.", "Résous (x + 1)/2 = (x − 3)/3 + 2."],
      play: balance([[1 / 2 + 1 / 3, 0, 0, 5, "x/2 + x/3 = 5"], [1 / 4, -1, 1 / 6, 0, "x/4 − 1 = x/6"], [1 / 2, 1 / 2, 1 / 3, 1, "(x + 1)/2 = (x − 3)/3 + 2"]]),
    },
    eqspec: {
      predict: { q: "2x + 3 = 2x + 5 : combien de solutions ?", choices: ["Une : x = 0", "Aucune", "Une infinité"], good: 1, why: "Quel que soit x, le membre de droite vaut 2 de plus que celui de gauche : jamais égaux. Aucune solution." },
      defis: ["Résous 2x + 3 = 2x + 5.", "Résous 3(x + 1) = 3x + 3.", "Résous 4x + 1 = x + 1 (attention : les x ne disparaissent pas)."],
      play: balance([[2, 3, 2, 5], [3, 3, 3, 3, "3(x + 1) = 3x + 3"], [4, 1, 1, 1, "4x + 1 = x + 1", "x = 0 : c'est une vraie solution, pas « aucune solution »."]]),
    },
    formule: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Les autres lettres se traitent comme des nombres. On défait les opérations qui entourent la lettre cherchée, de l'extérieur vers l'intérieur, en faisant la même opération des deux côtés.", exemple: ["\\(P = 4c\\), \\(c = \\frac{P}{4}\\).", "\\(v = \\frac{d}{t}\\), \\(vt = d\\), \\(t = \\frac{d}{v}\\).", "\\(A = \\frac{(B + b)h}{2}\\), \\(B + b = \\frac{2A}{h}\\), \\(B = \\frac{2A}{h} - b\\)."], piege: "Dans \\(A = \\frac{(B + b)h}{2}\\), on défait d'abord \\(: 2\\) et \\(\\cdot h\\), puis on soustrait \\(b\\) en dernier." },
      predict: { q: "Dans v = d/t, pour isoler t, la première opération est…", choices: ["× t des deux côtés", "÷ v des deux côtés", "− d des deux côtés"], good: 0, why: "t est au dénominateur : on le fait remonter en multipliant par t, v · t = d ; puis on divise par v." },
      defis: ["Isole c dans P = 4c.", "Isole t dans v = d/t.", "Isole B dans A = (B + b) · h / 2."],
      play: chooser([
        [{ f: "P = 4c", ask: "Que fais-tu des deux côtés ?", ch: ["÷ 4", "− 4", "× 4"], good: 0, no: "c est multiplié par 4 : on défait une multiplication par une division." }, { f: "c = P/4", why: "On a défait « × 4 »." }],
        [{ f: "v = d/t", ask: "Première opération ?", ch: ["÷ t", "× t", "− d"], good: 1, no: "t est au dénominateur : on multiplie par t pour le faire remonter." }, { f: "v · t = d", ask: "Et maintenant ?", ch: ["÷ v", "× v", "− v"], good: 0, no: "t est multiplié par v : on divise par v." }, { f: "t = d/v", why: "On défait de l'extérieur vers l'intérieur." }],
        [{ f: "A = (B + b) · h / 2", ask: "Première opération ?", ch: ["− b", "× 2", "÷ h"], good: 1, no: "Commence par l'extérieur : la division par 2." }, { f: "2A = (B + b) · h", ask: "Ensuite ?", ch: ["÷ h", "− b", "÷ 2"], good: 0, no: "La parenthèse est multipliée par h : divise par h." }, { f: "2A/h = B + b", ask: "Enfin ?", ch: ["+ b", "− b", "÷ b"], good: 1, no: "On a B + b : on retire b." }, { f: "B = 2A/h − b", why: "Trois opérations défaites, dans l'ordre inverse." }],
      ]),
    },
    probeq: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Trois entiers consécutifs de somme 48 : \\(n + (n + 1) + (n + 2) = 48\\), \\(n = 15\\).", "Somme 75 : \\(3n + 3 = 75\\), \\(n = 24\\) (24, 25, 26).", "Quatre consécutifs de somme 98 : \\(4n + 6 = 98\\), \\(n = 23\\)."], piege: "Écris ce que représente l'inconnue : ici \\(n\\) est le plus petit, celui du milieu est \\(n + 1\\)." },
      predict: { q: "Trois entiers consécutifs ont pour somme 48. Le plus petit est…", choices: ["16", "15", "14"], good: 1, why: "n + (n + 1) + (n + 2) = 3n + 3 = 48, donc n = 15 : 15 + 16 + 17 = 48. 16 est celui du milieu." },
      defis: ["Trouve trois entiers consécutifs de somme 48.", "Trouve trois entiers consécutifs de somme 75.", "Avec 4 nombres : trouve quatre entiers consécutifs de somme 98."],
      play(box, onWin) {
        let n = 10, k = 3, step = 0;
        const draw = () => {
          const L = Array.from({ length: k }, (_, i) => n + i), S = L.reduce((a, b) => a + b, 0);
          box.innerHTML = `<div class="seg">${[3, 4].map((v) => `<button type="button" data-k="${v}" aria-pressed="${v === k}">${v} nombres</button>`).join("")}</div>${actStepper("n (le plus petit)", n, "n")}
            <div class="act-out">${L.join(" + ")} = <b>${S}</b><br><span class="small muted">en écriture littérale : ${k}n + ${k === 3 ? 3 : 6} = ${k} · ${n} + ${k === 3 ? 3 : 6}</span></div>`;
          actBindStepper(box, "n", () => n, (v) => { n = v; draw(); check(); }, 1, 60);
          box.querySelectorAll("[data-k]").forEach((el) => (el.onclick = () => { k = +el.dataset.k; draw(); check(); }));
        };
        const T = [[3, 48, "3n + 3 = 48 ⇔ 3n = 45 ⇔ n = 15."], [3, 75, "3n + 3 = 75 ⇔ n = 24 : l'équation évite de tâtonner."], [4, 98, "4n + 6 = 98 ⇔ 4n = 92 ⇔ n = 23."]];
        const check = () => { if (step < 3) { const [kk, S, m] = T[step]; if (k === kk && kk * n + (kk === 3 ? 3 : 6) === S) { onWin(step, m); step++; } } };
        draw();
      },
    },
    eq2fact: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Méthode directe : \\(x^2 = a\\) a deux solutions \\(\\pm\\sqrt{a}\\) si \\(a > 0\\). Sinon : on ramène tout à gauche (\\(\\ldots = 0\\)), on met en évidence et on annule chaque facteur.", exemple: ["\\(x^2 = 16\\), \\(x = 4\\) ou \\(x = -4\\).", "\\(x^2 = 3x\\), \\(x(x - 3) = 0\\) : \\(x = 0\\) ou \\(x = 3\\)."] },
      predict: { q: "x² = 3x : combien de solutions ?", choices: ["Une : x = 3", "Deux : 0 et 3", "Aucune"], good: 1, why: "0² = 3 · 0 = 0 et 3² = 3 · 3 = 9 : deux solutions. Diviser par x aurait fait perdre x = 0." },
      defis: ["Trouve un nombre x tel que x² = 3x.", "Trouves-en un autre !", "Mode x² = 16 : trouve la solution négative."],
      play: hunt({ start: 1, min: -6, max: 6, show: (x, st) => st < 2
        ? `<div class="act-out">Équation : x² = 3x<br>Membre de gauche : x² = (${nb(x)})² = <b>${sq(x)}</b><br>Membre de droite : 3x = 3 · (${nb(x)}) = <b>${nb(3 * x)}</b><br>${x * x === 3 * x ? "<b>Égaux ✓</b>" : "Pas égaux"}</div>`
        : `<div class="act-out">Nouvelle équation : x² = 16<br>x² = (${nb(x)})² = <b>${sq(x)}</b><br>${x * x === 16 ? "<b>Égal à 16 ✓</b>" : "Pas égal à 16"}</div>`, note: "Change x avec − et + ; compare les deux membres.",
        wins: [(x, s) => (x * x === 3 * x ? (s.add(x), "x = " + nb(x) + " : " + sq(x) + " = " + nb(3 * x) + ".") : null), (x, s) => (x * x === 3 * x && !s.has(x) ? "Deux solutions : 0 et 3. x(x − 3) = 0." : null), (x) => (x === -4 ? "x = −4 : (−4)² = 16. x² = 16 a deux solutions, ±4." : null)] }),
    },
    eq2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(A \\cdot B = 0 \\iff A = 0\\) ou \\(B = 0\\). On écrit l'équation sous forme « produit \\(= 0\\) », puis on résout chaque facteur \\(= 0\\).", exemple: ["\\((x - 2)(x + 5) = 0\\) : \\(x = 2\\) ou \\(x = -5\\).", "\\((x - 2)(x + 5) = -6\\) : on développe d'abord, \\(x^2 + 3x - 4 = 0\\), puis \\((x + 4)(x - 1) = 0\\)."] },
      predict: { q: "(x − 2)(x + 5) = 0. Une solution est…", choices: ["x = −2", "x = 2", "x = 5"], good: 1, why: "Si x = 2, le premier facteur vaut 0, donc le produit vaut 0. L'autre solution est x = −5." },
      defis: ["Trouve un x qui rend (x − 2)(x + 5) nul.", "Trouve l'autre.", "Trouve un x tel que (x − 2)(x + 5) = −6."],
      play: hunt({ start: 0, min: -8, max: 6, show: (x) => `<div class="act-out">(${nb(x)} − 2) · (${nb(x)} + 5) = ${nb(x - 2)} · ${nb(x + 5)} = <b>${nb((x - 2) * (x + 5))}</b></div>`,
        wins: [(x, s) => ((x - 2) * (x + 5) === 0 ? (s.add(x), "x = " + nb(x) + " : un facteur vaut 0, donc le produit aussi.") : null), (x, s) => ((x - 2) * (x + 5) === 0 && !s.has(x) ? "Les deux solutions : 2 et −5, une par facteur." : null), (x) => ((x - 2) * (x + 5) === -6 ? "x = " + nb(x) + " convient, mais ni x − 2 ni x + 5 ne vaut −6 : le produit nul ne marche qu'avec 0. Il faut développer : x² + 3x − 4 = 0, soit x = 1 ou x = −4." : null)] }),
    },
    eq2disc: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pour \\(ax^2 + bx + c = 0\\), on calcule le discriminant \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : deux solutions. Si \\(\\Delta = 0\\) : une solution. Si \\(\\Delta < 0\\) : aucune solution réelle (la parabole ne touche pas l'axe des x).", exemple: ["\\(x^2 - 4x + c = 0\\) : \\(\\Delta = 16 - 4c\\).", "\\(c = 4\\) : \\(\\Delta = 0\\), une solution ; \\(c > 4\\) : aucune ; \\(c < 0\\) : deux."], piege: "Dans \\(\\Delta = b^2 - 4ac\\), \\(b^2\\) est toujours positif : avec \\(b = -4\\), \\(b^2 = 16\\)." },
      predict: { q: "x² − 4x + c = 0. Si c devient très grand, le nombre de solutions…", choices: ["augmente", "devient 0", "reste 2"], good: 1, why: "La parabole monte : elle ne touche plus l'axe des x. Δ = 16 − 4c devient négatif dès que c > 4." },
      defis: ["Choisis c pour que l'équation ait exactement une solution.", "Choisis c pour qu'elle n'en ait aucune.", "Choisis c négatif : combien de solutions ?"],
      play(box, onWin) {
        let c = 1, step = 0;
        const draw = () => {
          const D = 16 - 4 * c, n = D > 0 ? 2 : D === 0 ? 1 : 0, W = 300, H = 150, gx = (x) => 150 + (x - 2) * 34, gy = (y) => 110 - y * 9;
          let p = ""; for (let x = -2; x <= 6.01; x += 0.1) p += (p ? " L" : "M") + gx(x).toFixed(1) + "," + Math.max(-20, gy(x * x - 4 * x + c)).toFixed(1);
          const sols = D > 0 ? [2 - Math.sqrt(D) / 2, 2 + Math.sqrt(D) / 2] : D === 0 ? [2] : [];
          box.innerHTML = actStepper("c", c, "c") + `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="parabole"><line x1="0" y1="${gy(0)}" x2="${W}" y2="${gy(0)}" class="f-line"/><path d="${p}" class="f-line" fill="none" stroke-width="2"/>${sols.map((s) => `<circle cx="${gx(s)}" cy="${gy(0)}" r="5" class="f-dot"/>`).join("")}</svg>
            <div class="act-out">Δ = 16 − 4 · ${nb(c)} = <b>${nb(D)}</b><br>Nombre de solutions : <b>${n}</b>${sols.length ? "<br>x ≈ " + sols.map((s) => nb(+s.toFixed(2))).join(" ; x ≈ ") : ""}</div>`;
          actBindStepper(box, "c", () => c, (v) => { c = v; draw(); check(); }, -8, 10);
        };
        const check = () => {
          const D = 16 - 4 * c;
          if (step === 0 && D === 0) { onWin(0, "c = 4 : Δ = 0, la parabole touche l'axe en x = 2 ; x² − 4x + 4 = (x − 2)²."); step = 1; }
          else if (step === 1 && D < 0) { onWin(1, "c = " + c + " : Δ < 0, la parabole ne coupe pas l'axe : aucune solution réelle."); step = 2; }
          else if (step === 2 && c < 0) { onWin(2, "Si c < 0, −4c > 0 donc Δ > 0 : toujours deux solutions."); step = 3; }
        };
        draw();
      },
    },
    probeq2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Rectangle de largeur \\(x\\), longueur \\(x + 3\\), aire 40 : \\(x^2 + 3x - 40 = 0\\), \\(x = 5\\) (on écarte \\(-8\\)).", "Aire 70 : \\(x^2 + 3x - 70 = 0\\), \\(x = 7\\) (on écarte \\(-10\\))."] },
      predict: { q: "Un rectangle a une longueur égale à sa largeur + 3 et une aire de 40. Sa largeur est…", choices: ["5", "8", "10"], good: 0, why: "5 · 8 = 40. L'équation x(x + 3) = 40 a aussi la solution −8, qu'on écarte : une largeur est positive." },
      defis: ["Trouve la largeur pour une aire de 40.", "Trouve la largeur pour une aire de 70.", "Et pour une aire de 28 ?"],
      play: hunt({ start: 2, min: 1, max: 12, label: "largeur x", show: (x) => `<svg class="fig" viewBox="0 0 320 ${Math.round(20 + x * 9)}" role="img" aria-label="rectangle"><rect x="10" y="10" width="${(x + 3) * 18}" height="${x * 9}" class="f-shape"/></svg><div class="act-out">Largeur ${nb(x)}, longueur ${nb(x + 3)}<br>Aire : ${nb(x)} · ${nb(x + 3)} = <b>${nb(x * (x + 3))}</b></div>`,
        wins: [(x) => (x * (x + 3) === 40 ? "x = 5 : x² + 3x − 40 = (x − 5)(x + 8) = 0 ; −8 est écarté." : null), (x) => (x * (x + 3) === 70 ? "x = 7 : 7 · 10 = 70." : null), (x) => (x * (x + 3) === 28 ? "x = 4 : (x − 4)(x + 7) = 0." : null)] }),
    },
    eq3: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On ramène tout à gauche, on met en évidence \\(x\\), on factorise ce qui reste, puis on annule chaque facteur. Une équation de degré 3 a au plus trois solutions.", exemple: ["\\(x^3 - 4x = 0\\), \\(x(x - 2)(x + 2) = 0\\) : \\(-2\\), \\(0\\), \\(2\\).", "\\(x^3 - 9x = 0\\), \\(x(x - 3)(x + 3) = 0\\) : \\(-3\\), \\(0\\), \\(3\\)."] },
      predict: { q: "x³ − 4x = 0 : combien de solutions au plus ?", choices: ["1", "2", "3"], good: 2, why: "x(x − 2)(x + 2) = 0 : trois facteurs, trois solutions : −2, 0 et 2." },
      defis: ["Trouve une solution positive de x³ − 4x = 0.", "Trouve une solution négative.", "Trouve la troisième."],
      play: hunt({ start: 1, min: -4, max: 4, show: (x) => `<div class="act-out">${nb(x)}³ − 4 · ${nb(x)} = ${nb(x ** 3)} − ${nb(4 * x).replace("−", "(−") + (x < 0 ? ")" : "")} = <b>${nb(x ** 3 - 4 * x)}</b></div>`,
        wins: [(x) => (x > 0 && x ** 3 === 4 * x ? "x = 2 : 8 − 8 = 0." : null), (x) => (x < 0 && x ** 3 === 4 * x ? "x = −2 : −8 + 8 = 0." : null), (x) => (x === 0 ? "x = 0 : x(x − 2)(x + 2) = 0 a trois solutions." : null)] }),
    },
    bicarre: {
      predict: { q: "x⁴ − 5x² + 4 = 0. Si l'on pose X = x², l'équation devient…", choices: ["X² − 5X + 4 = 0", "X⁴ − 5X + 4 = 0", "X − 5X + 4 = 0"], good: 0, why: "x⁴ = (x²)² = X². C'est une équation du 2e degré en X : X = 1 ou X = 4." },
      defis: ["Trouve une solution x de x⁴ − 5x² + 4 = 0.", "Trouve une solution x de valeur absolue différente.", "Trouve les quatre solutions."],
      play: hunt({ start: 0, min: -3, max: 3, show: (x) => `<div class="act-out">X = x² = <b>${sq(x)}</b><br>X² − 5X + 4 = ${sq(x * x)} − ${nb(5 * x * x)} + 4 = <b>${nb(x ** 4 - 5 * x * x + 4)}</b><br>${x ** 4 - 5 * x * x + 4 === 0 ? "<b>Solution ✓</b>" : "Pas une solution"}</div>`, note: "Chaque valeur de X positive donne deux x opposés.",
        wins: [(x, s) => (x ** 4 - 5 * x * x + 4 === 0 ? (s.add(x), "x = " + nb(x) + " : X = " + sq(x) + ".") : null), (x, s) => { if (x ** 4 - 5 * x * x + 4 === 0) s.add(x); return [...s].some((u) => Math.abs(u) !== Math.abs(x)) && x ** 4 - 5 * x * x + 4 === 0 ? "Deux valeurs de X : 1 et 4." : null; }, (x, s) => { if (x ** 4 - 5 * x * x + 4 === 0) s.add(x); return s.size === 4 ? "Quatre solutions : −2, −1, 1, 2 (X = 1 et X = 4 en donnent deux chacune)." : null; }] }),
    },
    eqirr: {
      predict: { q: "√(x + 7) = x + 1. En élevant au carré, on trouve x = 2 ou x = −3. Les deux conviennent-elles ?", choices: ["Oui", "Non, seulement 2", "Non, seulement −3"], good: 1, why: "Pour −3 : √4 = 2, mais x + 1 = −2. Une racine n'est jamais négative : −3 est une solution « parasite »." },
      defis: ["Trouve x tel que √(x + 7) = x + 1.", "Trouve un x tel que les carrés soient égaux mais pas les deux membres.", "Trouve x tel que √(x + 7) = 4."],
      play: hunt({ start: 0, min: -7, max: 12, show: (x) => `<div class="act-out">Membre de gauche : √(x + 7) = <b>${nb(+Math.sqrt(x + 7).toFixed(3))}</b><br>Membre de droite : x + 1 = <b>${nb(x + 1)}</b><br><span class="small muted">Au carré, à gauche : x + 7 = ${nb(x + 7)}<br>Au carré, à droite : (x + 1)² = ${sq(x + 1)}</span></div>`,
        wins: [(x) => (Math.sqrt(x + 7) === x + 1 ? "x = 2 : √9 = 3 = 2 + 1." : null), (x) => (x + 7 === (x + 1) ** 2 && Math.sqrt(x + 7) !== x + 1 ? "x = −3 : 4 = 4 au carré, mais √4 = 2 ≠ −2. Le carré a « oublié » le signe : on vérifie toujours." : null), (x) => (Math.sqrt(x + 7) === 4 ? "x = 9 : x + 7 = 16." : null)] }),
    },
  });
})();

// Chantier 1re Collège · systèmes et fonctions affines (18.11) : leçons actives (devine / manipule / retiens) et rappels
// pour sys2, sysprob, sysgraph, sys3, affine, affzero, sysineq. Mode réponse : l'élève calcule et tape sa réponse, la
// figure réagit ensuite (commentaire testeur du 17.11 : pas de curseur à tâtonner). Pas de TeX dans ce qui est redessiné.
(function () {
  const R2 = {
    sys2: ["Systèmes de deux équations", "Résoudre un système, c'est trouver le couple \\((x \\,;\\, y)\\) qui vérifie les deux équations à la fois.",
      "Substitution : on isole une inconnue dans une équation et on la remplace dans l'autre. Combinaison : on multiplie les équations pour que l'addition (ou la soustraction) fasse disparaître une inconnue. On termine en calculant l'autre inconnue et en vérifiant dans les <b>deux</b> équations.",
      ["\\(\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases}\\) : en additionnant, \\(2x = 12\\), \\(x = 6\\), \\(y = 4\\).", "\\(\\begin{cases} y = 2x + 1 \\\\ 3x + y = 11 \\end{cases}\\) : \\(3x + 2x + 1 = 11\\), \\(x = 2\\), \\(y = 5\\)."],
      "La réponse est un couple : x d'abord, puis y."],
    sysprob: ["Problèmes à deux inconnues", "Deux informations, deux inconnues : un système.",
      "1. Nommer les deux inconnues (et écrire ce qu'elles représentent). 2. Écrire une équation par information. 3. Résoudre. 4. Vérifier dans l'énoncé et répondre par une phrase.",
      ["35 têtes et 94 pattes : \\(p + \\ell = 35\\), \\(2p + 4\\ell = 94\\), donc 12 lapins et 23 poules.", "Avec le courant : \\(v + c = 20\\) ; contre : \\(v - c = 14\\) ; donc \\(v = 17\\), \\(c = 3\\)."],
      "Vérifie que la solution a un sens : un nombre d'animaux est entier et positif."],
    sysgraph: ["Systèmes et droites", "Chaque équation d'un système 2 × 2 est une droite ; la solution est leur point commun.",
      "Droites sécantes (pentes différentes) : une solution. Droites parallèles distinctes (même pente, ordonnées à l'origine différentes) : aucune solution. Droites confondues (équations proportionnelles) : une infinité de solutions.",
      ["\\(y = 2x + 1\\) et \\(y = 2x - 3\\) : parallèles, aucune solution.", "\\(2x + 3y = 6\\) et \\(4x + 6y = 12\\) : confondues, une infinité.", "\\(y = x + 1\\) et \\(y = -x + 5\\) : sécantes en \\((2 \\,;\\, 3)\\)."],
      "Compare les pentes après avoir isolé y dans chaque équation."],
    sys3: ["Systèmes de trois équations", "On ramène le système à un système 2 × 2, puis à une équation.",
      "On élimine une inconnue en combinant deux paires de lignes ; on résout le système 2 × 2 obtenu ; on remonte pour trouver la troisième inconnue. Un système « en escalier » (triangulaire) se résout directement de bas en haut.",
      ["\\(\\begin{cases} x + y + z = 6 \\\\ y + z = 5 \\\\ z = 2 \\end{cases}\\) : \\(z = 2\\), \\(y = 3\\), \\(x = 1\\).", "Astuce quand chaque ligne est la somme de deux inconnues : \\(\\begin{cases} x + y = 7 \\\\ y + z = 9 \\\\ x + z = 8 \\end{cases}\\). On additionne les trois lignes : \\(2x + 2y + 2z = 24\\), donc \\(x + y + z = 12\\). On retranche chaque ligne de 12 : \\(z = 12 - 7 = 5\\), \\(x = 12 - 9 = 3\\), \\(y = 12 - 8 = 4\\)."],
      "Garde l'ordre (x ; y ; z) dans la réponse."],
    affine: ["Fonctions affines", "\\(f(x) = ax + b\\) : une droite de pente \\(a\\) et d'ordonnée à l'origine \\(b\\).",
      "La pente se calcule avec deux points : \\(a = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}\\). L'ordonnée à l'origine est \\(b = f(0)\\), ou \\(b = f(x_1) - a x_1\\). Deux droites parallèles ont la même pente.",
      ["\\(f(1) = 5\\), \\(f(3) = 9\\) : \\(a = \\frac{4}{2} = 2\\), \\(b = 3\\), \\(f(x) = 2x + 3\\).", "Taxi : 6 CHF + 3 CHF/km : \\(f(x) = 3x + 6\\)."],
      "La pente est (différence des images) ÷ (différence des x), dans le même ordre en haut et en bas."],
    affzero: ["Zéro et signe", "Une fonction affine change de signe une seule fois, en son zéro.",
      "Zéro : on résout \\(ax + b = 0\\), \\(x = -\\frac{b}{a}\\). Si \\(a > 0\\), la fonction est négative avant le zéro et positive après ; si \\(a < 0\\), c'est l'inverse. Pour \\(f(x) > g(x)\\), on étudie le signe de \\(f(x) - g(x)\\).",
      ["\\(f(x) = 2x - 6\\) : zéro 3, \\(f(x) > 0\\) pour \\(x > 3\\).", "\\(f(x) = -3x + 12\\) : zéro 4, \\(f(x) > 0\\) pour \\(x < 4\\)."],
      "En divisant par un nombre négatif, on retourne le sens de l'inégalité."],
    sysineq: ["Systèmes d'inéquations", "Toutes les conditions doivent être vraies en même temps.",
      "On résout chaque inéquation, on représente les solutions sur une même droite graduée et on garde la partie commune (l'intersection). Crochet fermé pour ≤ et ≥ (borne comprise), ouvert pour < et >. Si les parties ne se chevauchent pas : aucune solution.",
      ["\\(x > 2\\) et \\(x \\le 5\\) : \\(S = \\,]2 \\,;\\, 5]\\).", "\\(-2x > 4\\) donne \\(x < -2\\) (sens retourné).", "\\(x < 1\\) et \\(x > 4\\) : \\(S = \\varnothing\\)."],
      "On garde la partie commune, pas la réunion des deux."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1);
      box.innerHTML = (actAnswerHtml(o.label || "Ta réponse")) + o.show(x, s);
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule."); };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (x !== null && Math.abs(x - target) < 1e-9 ? msg : "");
  // Repère avec droites, verticale x = v et points d'intersection avec chaque droite
  const plot = (fs, v, opts = {}) => { const X = (x) => 160 + x * 18, Y = (y) => 110 - y * 12; let g = "";
    for (let k = -8; k <= 8; k++) g += `<line x1="${X(k)}" y1="10" x2="${X(k)}" y2="210" class="f-grid"/>`;
    for (let k = -8; k <= 8; k++) g += `<line x1="16" y1="${Y(k)}" x2="304" y2="${Y(k)}" class="f-grid"/>`;
    g += `<line x1="16" y1="${Y(0)}" x2="304" y2="${Y(0)}" class="f-line"/><line x1="${X(0)}" y1="10" x2="${X(0)}" y2="210" class="f-line"/>`;
    fs.forEach((f, i) => { g += `<line x1="${X(-8)}" y1="${Y(f(-8))}" x2="${X(8)}" y2="${Y(f(8))}" class="${i ? "f-line" : "f-accent"}" stroke-width="2.4" clip-path="inset(0)"/>`; });
    if (v !== null && v !== undefined && Math.abs(v) <= 8) { g += `<line x1="${X(v)}" y1="10" x2="${X(v)}" y2="210" class="f-line" stroke-dasharray="4 4"/>`; fs.forEach((f) => { const y = f(v); if (Math.abs(y) <= 8.5) g += `<circle cx="${X(v)}" cy="${Y(y)}" r="4.5" class="f-dot"/>`; }); }
    (opts.pts || []).forEach(([a, b]) => (g += `<circle cx="${X(a)}" cy="${Y(b)}" r="4" class="f-dot"/>`));
    return svg(320, 220, `<clipPath id="pcs"><rect x="16" y="10" width="288" height="200"/></clipPath><g clip-path="url(#pcs)">${g}</g>`, "repère"); };

  Object.assign(ACTIVE, {
    sys2: {
      predict: { q: "x + y = 10 et x − y = 2. Que vaut x ?", choices: ["6", "5", "4"], good: 0, why: "En additionnant les deux équations, les y disparaissent : 2x = 12, donc x = 6 (et y = 4). 5 et 5 font bien 10, mais 5 − 5 ne fait pas 2." },
      defis: ["y = −x + 10 et y = x − 2 : quelle valeur de x rend les deux y égaux ?", "y = 2x + 1 et y = −x + 7 : trouve x.", "y = x + 3 et y = −2x − 3 : trouve x."],
      play: hunt({ label: "x =",
        show: (x, s) => { const F = [[(t) => -t + 10, (t) => t - 2], [(t) => 2 * t + 1, (t) => -t + 7], [(t) => t + 3, (t) => -2 * t - 3]][s];
          return plot(F, x) + (x === null ? `<div class="small muted">Les deux droites représentent les deux équations. Calcule x par substitution ou par combinaison.</div>` : `<div class="act-out">En x = ${nb(x)} : 1re droite y = ${nb(F[0](x))}, 2e droite y = ${nb(F[1](x))} → ${Math.abs(F[0](x) - F[1](x)) < 1e-9 ? '<b class="act-ok">même point : c\'est la solution</b>' : "écart " + nb(Math.abs(F[0](x) - F[1](x)))}</div>`); },
        wins: [W(6, "−x + 10 = x − 2, 2x = 12, x = 6 ; y = 4. Solution (6 ; 4)."), W(2, "2x + 1 = −x + 7, 3x = 6, x = 2 ; y = 5. Solution (2 ; 5)."), W(-2, "x + 3 = −2x − 3, 3x = −6, x = −2 ; y = 1. Solution (−2 ; 1).")] }),
    },
    sysprob: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["10 têtes et 28 pattes : si tout était des poules, 20 pattes ; il en manque 8, soit 4 lapins.", "35 têtes et 94 pattes : \\(p + \\ell = 35\\), \\(2p + 4\\ell = 94\\), donc 12 lapins et 23 poules."] },
      predict: { q: "Dans une ferme : 10 têtes et 28 pattes (poules et lapins). Combien de lapins ?", choices: ["4", "6", "5"], good: 0, why: "Si tous étaient des poules : 20 pattes. Il en manque 8, et chaque lapin ajoute 2 pattes : 4 lapins (et 6 poules)." },
      defis: ["10 têtes, 28 pattes : combien de lapins ?", "20 têtes, 56 pattes : combien de lapins ?", "35 têtes, 94 pattes : combien de lapins ?"],
      play: hunt({ label: "Lapins :",
        show: (x, s) => { const [n, p] = [[10, 28], [20, 56], [35, 94]][s]; if (x === null) return `<div class="small muted">${n} têtes, ${p} pattes. Écris le système p + ℓ = ${n}, 2p + 4ℓ = ${p}, ou raisonne « si tous étaient des poules… ».</div>`;
          const l = Math.max(0, Math.min(n, Math.round(x))), po = n - l, legs = 2 * po + 4 * l; let g = "";
          for (let k = 0; k < n; k++) g += `<circle cx="${20 + (k % 18) * 16}" cy="${20 + Math.floor(k / 18) * 22}" r="6" class="${k < l ? "f-fill" : "f-fill2"}"/>`;
          return svg(320, 20 + Math.ceil(n / 18) * 22, g, l + " lapins") + `<div class="act-out">${l} lapins et ${po} poules : ${4 * l} + ${2 * po} = <b>${legs} pattes</b> (il en faut ${p}) → ${legs === p ? '<b class="act-ok">✓</b>' : legs < p ? "pas assez" : "trop"}</div>`; },
        wins: [W(4, "4 lapins, 6 poules : 16 + 12 = 28."), W(8, "8 lapins, 12 poules : 32 + 24 = 56."), W(12, "Si tout était des poules : 70 pattes ; il en manque 24, soit 12 lapins.")] }),
    },
    sysgraph: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(y = 2x + 1\\) et \\(y = 2x - 3\\) : parallèles, aucune solution.", "\\(x + y = 4\\) et \\(y = -x + 4\\) : confondues, une infinité.", "\\(y = x + 1\\) et \\(y = -x + 5\\) : sécantes en \\((2 \\,;\\, 3)\\)."] },
      predict: { q: "Le système y = 2x + 1 et y = 2x − 3 a…", choices: ["une solution", "aucune solution", "une infinité de solutions"], good: 1, why: "Même pente 2, ordonnées à l'origine différentes : droites parallèles, jamais de point commun." },
      defis: ["Quelle pente m rend y = mx + 1 parallèle à y = 3x − 2 ?", "Quelle valeur de b rend y = −x + b confondue avec la droite x + y = 4 ?", "Quelle pente m fait couper y = mx et y = 2x + 4 en x = 2 ?"],
      play: hunt({ label: "Valeur :",
        show: (v, s) => { const base = [(t) => 3 * t - 2, (t) => 4 - t, (t) => 2 * t + 4][s], mine = v === null ? null : [(t) => v * t + 1, (t) => -t + v, (t) => v * t][s];
          const out = v === null ? `<div class="small muted">${["Deux droites parallèles ont la même pente.", "Isole y dans x + y = 4.", "Au point d'intersection, les deux droites ont le même y."][s]}</div>`
            : `<div class="act-out">${["pentes : " + nb(v) + " et 3 → " + (v === 3 ? '<b class="act-ok">parallèles : aucune solution</b>' : "sécantes : une solution"), "y = −x + " + nb(v) + " et y = −x + 4 → " + (v === 4 ? '<b class="act-ok">confondues : une infinité de solutions</b>' : "parallèles distinctes : aucune"), "en x = 2 : " + nb(2 * v) + " et 8 → " + (v === 4 ? '<b class="act-ok">elles se coupent en (2 ; 8)</b>' : "pas encore")][s]}</div>`;
          return plot(mine ? [base, mine] : [base], s === 2 ? 2 : null) + out; },
        wins: [W(3, "Même pente 3 : parallèles (ordonnées 1 et −2 différentes), aucune solution."), W(4, "x + y = 4 s'écrit y = −x + 4 : avec b = 4, les droites sont confondues."), W(4, "2m = 2 · 2 + 4 = 8, donc m = 4.")] }),
    },
    sys3: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Un système « en escalier » (triangulaire) se résout de bas en haut : on trouve \\(z\\), puis on remonte pour \\(y\\), puis pour \\(x\\). Quand chaque ligne est la somme de deux inconnues, on additionne les trois lignes : on obtient \\(2(x + y + z)\\).", exemple: ["\\(\\begin{cases} x + y + z = 9 \\\\ y + z = 7 \\\\ z = 3 \\end{cases}\\) : \\(z = 3\\), \\(y = 4\\), \\(x = 2\\).", "\\(\\begin{cases} x + y = 7 \\\\ y + z = 9 \\\\ x + z = 8 \\end{cases}\\) : la somme des lignes donne \\(2x + 2y + 2z = 24\\), donc \\(x + y + z = 12\\)."] },
      predict: { q: "x + y + z = 6, y + z = 5 et z = 2. Que vaut x ?", choices: ["1", "3", "4"], good: 0, why: "On remonte : z = 2, puis y = 5 − 2 = 3, puis x = 6 − 3 − 2 = 1." },
      defis: ["Système x + y + z = 9, y + z = 7, z = 3 : que vaut y ?", "Même système : que vaut x ?", "x + y = 7, y + z = 9, x + z = 8 : additionne les trois lignes. Que vaut x + y + z ?"],
      play: hunt({ label: "Ta réponse :",
        show: (v, s) => `<div class="act-out" style="text-align:left">${["x + y + z = 9<br>y + z = 7<br>z = 3", "x + y + z = 9<br>y + z = 7 (donc y = 4)<br>z = 3", "x + y = 7<br>y + z = 9<br>x + z = 8"][s]}</div>` + (v === null ? "" : `<div class="act-out">${[v === 4 ? "✓ y = 7 − 3 = 4" : "Avec z = 3 : y + 3 = 7…", v === 2 ? "✓ x = 9 − 4 − 3 = 2" : "x + 4 + 3 = 9…", v === 12 ? "✓ 2(x + y + z) = 24, donc 12" : "La somme des trois lignes vaut 24 = 2(x + y + z)…"][s]}</div>`),
        wins: [W(4, "z = 3, donc y = 7 − 3 = 4."), W(2, "x = 9 − 4 − 3 = 2 : solution (2 ; 4 ; 3)."), W(12, "2(x + y + z) = 24, donc x + y + z = 12 ; puis z = 12 − 7 = 5, x = 3, y = 4.")] }),
    },
    affine: {
      predict: { q: "f(x) = 2x + 3. Que vaut f(0) ?", choices: ["2", "3", "5"], good: 1, why: "f(0) = 2 · 0 + 3 = 3 : c'est l'ordonnée à l'origine b, là où la droite coupe l'axe vertical." },
      defis: ["Pente de la droite qui passe par (0 ; 1) et (2 ; 5) ?", "Ordonnée à l'origine de la droite de pente 3 passant par (1 ; 1) ?", "Pente de la droite qui passe par (−2 ; 4) et (2 ; 2) ?"],
      play: hunt({ label: "Ta réponse :",
        show: (v, s) => { const P = [[[0, 1], [2, 5]], [[1, 1]], [[-2, 4], [2, 2]]][s], f = v === null ? null : [(t) => v * t + 1, (t) => 3 * t + v, (t) => v * (t + 2) + 4][s];
          const ok = v !== null && [v === 2, v === -2, v === -0.5][s];
          return plot(f ? [f] : [], null, { pts: P }) + (v === null ? `<div class="small muted">${["Pente = (différence des y) ÷ (différence des x).", "b = y − a · x avec le point donné.", "Attention : la droite descend."][s]}</div>` : `<div class="act-out">${ok ? '<b class="act-ok">La droite passe par les points.</b>' : "La droite ne passe pas par tous les points."}</div>`); },
        wins: [W(2, "a = (5 − 1) ÷ (2 − 0) = 2."), W(-2, "b = 1 − 3 · 1 = −2 : f(x) = 3x − 2."), W(-0.5, "a = (2 − 4) ÷ (2 − (−2)) = −2 ÷ 4 = −0,5 : la droite descend.")] }),
    },
    affzero: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Zéro : on résout \\(ax + b = 0\\), \\(x = -\\frac{b}{a}\\). Si \\(a > 0\\), la fonction est négative avant le zéro et positive après ; si \\(a < 0\\), c'est l'inverse." },
      predict: { q: "f(x) = 2x − 6. Son zéro est…", choices: ["−6", "3", "6"], good: 1, why: "2x − 6 = 0 donne x = 3 : la droite coupe l'axe horizontal en 3. −6 est l'ordonnée à l'origine." },
      defis: ["Zéro de f(x) = 2x − 6 ?", "Zéro de f(x) = −3x + 12 ?", "Zéro de f(x) = 0,5x + 2 ?"],
      play: hunt({ label: "x =",
        show: (v, s) => { const f = [(t) => 2 * t - 6, (t) => -3 * t + 12, (t) => 0.5 * t + 2][s];
          return plot([f], v) + (v === null ? `<div class="small muted">Le zéro est l'abscisse où la droite coupe l'axe horizontal.</div>` : `<div class="act-out">f(${nb(v)}) = <b>${nb(f(v))}</b> → ${Math.abs(f(v)) < 1e-9 ? '<b class="act-ok">zéro !</b>' : f(v) > 0 ? "positif" : "négatif"}</div>`); },
        wins: [W(3, "2x = 6, x = 3. Avant 3, f est négative ; après, positive (pente positive)."), W(4, "−3x = −12, x = 4. Pente négative : f est positive avant 4."), W(-4, "0,5x = −2, x = −4.")] }),
    },
    sysineq: {
      predict: { q: "x > 2 et x ≤ 5. Le nombre 5 est-il solution ?", choices: ["Oui", "Non"], good: 0, why: "5 > 2 et 5 ≤ 5 : les deux conditions sont vraies. S = ]2 ; 5], crochet fermé en 5." },
      defis: ["x > 2 et x ≤ 5 : le plus grand entier solution ?", "2x − 1 > 3 et x + 4 ≤ 9 : le plus petit entier solution ?", "−2x > 4 et x > −5 : le plus grand entier solution ?"],
      play: hunt({ label: "Entier :",
        show: (v, s) => { const [lo, li, hi, hc] = [[2, false, 5, true], [2, false, 5, true], [-5, false, -2, false]][s], X = (t) => 160 + t * 20;
          let g = `<line x1="10" y1="40" x2="310" y2="40" class="f-line"/>`; for (let k = -7; k <= 7; k++) g += `<line x1="${X(k)}" y1="35" x2="${X(k)}" y2="45" class="f-line"/><text x="${X(k)}" y="60" class="f-txt" text-anchor="middle" font-size="10">${k}</text>`;
          g += `<line x1="${X(lo)}" y1="40" x2="${X(hi)}" y2="40" class="f-accent" stroke-width="5"/><text x="${X(lo)}" y="30" class="f-txt" text-anchor="middle">${li ? "[" : "]"}</text><text x="${X(hi)}" y="30" class="f-txt" text-anchor="middle">${hc ? "]" : "["}</text>`;
          const inside = v !== null && (v > lo || (li && v === lo)) && (v < hi || (hc && v === hi));
          if (v !== null && Math.abs(v) <= 7) g += `<circle cx="${X(v)}" cy="40" r="6" class="${inside ? "f-dot" : "f-soft"}" stroke="var(--ink)"/>`;
          return (v === null ? `<div class="small muted">${["Lis directement les deux conditions.", "Résous chaque ligne : 2x > 4 et x ≤ 5.", "−2x > 4 : on divise par −2, le sens change."][s]}</div>` : svg(320, 70, g, "droite graduée") + `<div class="act-out">${nb(v)} ${inside ? "vérifie les deux conditions" : "ne vérifie pas les deux conditions"}</div>`); },
        wins: [W(5, "5 est compris (≤) : S = ]2 ; 5]."), W(3, "x > 2 et x ≤ 5 : le plus petit entier est 3 (2 est exclu)."), W(-3, "−2x > 4 donne x < −2 ; avec x > −5 : S = ]−5 ; −2[, le plus grand entier est −3.")] }),
    },
  });
})();

// Chantier 1re Collège (19.11) : leçons actives pour pct, racenc, tradexpr, fimg, modaff, f2, optim, euclide, angtri,
// trigexact, ensembles, domaine, racinv, transf, absval, ineq, trinfact, f2formes, f2trois, inter, geocomb, droitesrem (devine / manipule / retiens). Même moteur que act_ch11c.js (outils recopiés).
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

  Object.assign(ACTIVE, {
    pct: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Une hausse de \\(p\\,\\%\\) multiplie par \\(1 + \\frac{p}{100}\\) ; une baisse de \\(p\\,\\%\\), par \\(1 - \\frac{p}{100}\\). Hausse en % : l'augmentation divisée par le prix de départ. Pour retrouver le prix de départ, on divise par le coefficient.", exemple: ["De 50 à 60 CHF : \\(\\frac{10}{50} = 20\\,\\%\\) de hausse.", "Après \\(+25\\,\\%\\), 100 CHF : départ \\(100 \\div 1{,}25 = 80\\) CHF.", "\\(+20\\,\\%\\) puis \\(-20\\,\\%\\) : \\(\\cdot 1{,}2 \\cdot 0{,}8 = \\cdot 0{,}96\\), soit \\(-4\\,\\%\\)."], piege: "\\(+20\\,\\%\\) puis \\(-20\\,\\%\\) ne ramène pas au prix de départ : la baisse porte sur un prix déjà augmenté." },
      predict: { q: "Un prix augmente de 20 %, puis baisse de 20 %. Il est finalement…", choices: ["égal au prix de départ", "plus bas", "plus haut"], good: 1, why: "× 1,2 puis × 0,8 = × 0,96 : la baisse porte sur un prix déjà augmenté. Il baisse de 4 %." },
      defis: ["Prix de départ 100 CHF : prix après +20 % puis −20 % ?", "Un prix passe de 50 à 60 CHF : hausse en % ?", "Après une hausse de 25 %, un objet coûte 100 CHF. Prix de départ ?"],  garde: [1, 2], // la 1re reprend le « Devine »
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["100 · 1,2 · 0,8", "(60 − 50) ÷ 50", "100 ÷ 1,25"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(96, "100 · 1,2 = 120, puis 120 · 0,8 = 96 CHF."), W(20, "10 ÷ 50 = 0,2 = 20 % : on divise par le prix de DÉPART."), W(80, "On divise par le coefficient 1,25 : 80 CHF (et non 100 − 25 % = 75).")] }),
    },
    racenc: {
      predict: { q: "Entre quels entiers se trouve √50 ?", choices: ["7 et 8", "24 et 26", "5 et 6"], good: 0, why: "49 < 50 < 64, donc 7 < √50 < 8. La racine n'est pas la moitié !" },
      defis: ["Plus petit entier au-dessus de √50 ?", "Combien d'entiers n vérifient 6 < √n < 7 ?", "Plus grand entier n tel que √n < 10 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["vérifie : " + nb(x) + "² = " + nb(x * x) + " (comparer à 50)", "il faut 36 < n < 49 ; tu proposes " + nb(x), "vérifie : √" + nb(x) + " < 10 ⇔ " + nb(x) + " < 100"][s]),
        wins: [W(8, "8² = 64 > 50 et 7² = 49 < 50."), W(12, "De 37 à 48 : 12 entiers."), W(99, "n < 100 : le plus grand est 99.")] }),
    },
    tradexpr: {
      predict: { q: "« Le double de la somme de 3 et 4 » vaut…", choices: ["10", "14", "11"], good: 1, why: "Le premier mot dit la dernière opération : on double la SOMME, 2 · (3 + 4) = 14. 2 · 3 + 4 = 10 serait « la somme du double de 3 et de 4 »." },
      defis: ["La somme de 5 et du triple de 4 ?", "Le triple de la somme de 5 et 4 ?", "Le carré de la différence entre 9 et 4 ?"],
      play: hunt({ ask: true, label: "Résultat", show: (x, s) => plain(["5 + 3 · 4", "3 · (5 + 4)", "(9 − 4)²"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(17, "5 + 12 = 17 : la somme est la dernière opération."), W(27, "3 · 9 = 27 : le triple est la dernière opération."), W(25, "5² = 25 : on calcule la différence d'abord.")] }),
    },
    fimg: {
      predict: { q: "f(x) = x² − 3. Combien de nombres ont pour image 6 ?", choices: ["un seul", "deux", "aucun"], good: 1, why: "x² − 3 = 6 ⇔ x² = 9 ⇔ x = 3 ou x = −3 : deux antécédents. Une image est unique, un antécédent pas forcément." },
      defis: ["f(x) = x² − 3 : calcule f(−4).", "Antécédent POSITIF de 6 ?", "Antécédent NÉGATIF de 6 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s === 0 ? "f(−4) = (−4)² − 3 ; tu proposes <b>" + nb(x) + "</b>" : "f(" + nb(x) + ") = " + nb(x * x - 3)),
        wins: [W(13, "(−4)² = 16, 16 − 3 = 13."), W(3, "f(3) = 9 − 3 = 6."), W(-3, "f(−3) = 9 − 3 = 6 aussi : deux antécédents.")] }),
    },
    modaff: {
      predict: { q: "Taxi A : 6 CHF + 2 CHF/km. Taxi B : 3 CHF/km. Pour 10 km, le moins cher est…", choices: ["A", "B", "ils coûtent pareil"], good: 0, why: "A : 6 + 20 = 26 CHF ; B : 30 CHF. Au-delà de 6 km, la part fixe de A est « remboursée »." },
      defis: ["Prix de A pour 10 km ?", "Pour combien de km les deux taxis coûtent-ils le même prix ?", "Prix commun à cette distance ?"], garde: [1, 2],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s === 1 ? "A(" + nb(x) + ") = " + nb(6 + 2 * x) + " ; B(" + nb(x) + ") = " + nb(3 * x) : "tu proposes <b>" + nb(x) + "</b> CHF"),
        wins: [W(26, "6 + 2 · 10 = 26 CHF."), W(6, "6 + 2x = 3x ⇔ x = 6 km."), W(18, "6 + 12 = 18 = 3 · 6 CHF.")] }),
    },
    f2: {
      predict: { q: "La parabole f(x) = x² − 6x + 5 a son sommet en x = …", choices: ["3", "−3", "5"], good: 0, why: "x_S = −b ÷ (2a) = 6 ÷ 2 = 3 : c'est aussi le milieu des zéros 1 et 5." },
      defis: ["Abscisse du sommet de x² − 6x + 5 ?", "Ordonnée du sommet ?", "Plus grand zéro ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => t * t - 6 * t + 5 }], [], { numbers: true, xr: [-2, 8], yr: [-5, 8] }), show: (x) => FIG.plot([{ f: (t) => t * t - 6 * t + 5 }], [[x, 0, ""]], { numbers: true, xr: [-2, 8], yr: [-5, 8] }) + plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "x_S = 6 ÷ 2 = 3."), W(-4, "f(3) = 9 − 18 + 5 = −4."), W(5, "(x − 1)(x − 5) = 0 : zéros 1 et 5.")] }),
    },
    optim: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Rectangle de périmètre 20 : aire \\(x(10 - x)\\), maximale au sommet \\(x = 5\\) : un carré de 25 m²."] },
      predict: { q: "Avec 20 m de clôture, quel rectangle a la plus grande aire ?", choices: ["2 m × 8 m", "5 m × 5 m", "1 m × 9 m"], good: 1, why: "Aire x(10 − x), maximale au sommet x = 5 : un carré de 25 m²." },
      defis: ["Règle la largeur pour une aire de 21 m².", "Puis pour 24 m².", "Trouve l'aire maximale (largeur 5)."],
      play: hunt({ label: "Largeur (m)", start: 1, min: 1, max: 9,
        show: (x) => { let g = `<rect x="40" y="10" width="${x * 24}" height="${(10 - x) * 12}" class="f-fill" stroke="var(--ink)"/>`; return svg(320, 130, g, "rectangle") + plain("largeur " + x + " m, longueur " + (10 - x) + " m → aire <b>" + x * (10 - x) + " m²</b>"); },
        wins: [(x) => (x * (10 - x) === 21 ? "3 × 7 = 21 (ou 7 × 3)." : ""), (x) => (x * (10 - x) === 24 ? "4 × 6 = 24." : ""), W(5, "5 × 5 = 25 m² : le sommet de la parabole x(10 − x).")] }),
    },
    euclide: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Théorème de la hauteur : dans un triangle rectangle, la hauteur issue de l'angle droit coupe l'hypoténuse en deux segments \\(p\\) et \\(q\\), et \\(h^2 = p \\cdot q\\).", exemple: ["\\(p = 4\\) et \\(q = 9\\) : \\(h^2 = 36\\), donc \\(h = 6\\).", "\\(p = 2\\) et \\(q = 8\\) : \\(h^2 = 16\\), donc \\(h = 4\\)."], piege: "\\(h^2 = p \\cdot q\\) : la hauteur n'est pas la moyenne des deux segments (6, pas 6,5)." },
      predict: { q: "Triangle rectangle : la hauteur coupe l'hypoténuse en 4 cm et 9 cm. La hauteur mesure…", choices: ["6,5 cm", "6 cm", "13 cm"], good: 1, why: "Théorème de la hauteur : h² = 4 · 9 = 36, h = 6 (et non la moyenne 6,5)." },
      defis: ["h pour des segments de 4 et 9 ?", "Cathète a (projection 4, hypoténuse 13) au carré : a² = ?", "h pour des segments de 2 et 8 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["h² = 4 · 9", "a² = p · c = 4 · 13", "h² = 2 · 8"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(6, "√36 = 6."), W(52, "a² = 52, a = 2√13."), W(4, "√16 = 4.")] }),
    },
    angtri: {
      predict: { q: "La somme des angles d'un pentagone vaut…", choices: ["360°", "540°", "900°"], good: 1, why: "On le découpe en 3 triangles depuis un sommet : 3 · 180° = 540°. En général (n − 2) · 180°." },
      defis: ["Chaque angle d'un hexagone régulier (en degrés) ?", "Nombre de côtés d'un polygone régulier dont chaque angle vaut 108° ?", "Un octogone se découpe en combien de triangles depuis un sommet ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(6 − 2) · 180 = 720, divisé par 6", "angle extérieur 180 − 108 = 72° ; 360 ÷ 72", "n − 2 triangles"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(120, "720 ÷ 6 = 120°."), W(5, "360 ÷ 72 = 5 : le pentagone régulier."), W(6, "8 − 2 = 6 triangles : 6 · 180° = 1080°.")] }),
    },
    trigexact: {
      predict: { q: "Une route de pente 100 % fait avec l'horizontale un angle de…", choices: ["90°", "45°", "100°"], good: 1, why: "Pente = tan(angle) ; 100 % ⇔ tan = 1 ⇔ 45° : on monte de 1 m pour 1 m d'avance." },
      defis: ["Hypoténuse 12, angle 30° : côté opposé ?", "Pente d'une route inclinée à 45° (en %) ?", "Hypoténuse 20, angle 60° : côté adjacent ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["12 · sin 30° = 12 · 1/2", "tan 45° = 1", "20 · cos 60° = 20 · 1/2"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(6, "sin 30° = 1/2 : 6."), W(100, "tan 45° = 1 : 100 %."), W(10, "cos 60° = 1/2 : 10.")] }),
    },
    ensembles: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\([a \\, ; b]\\) : bornes comprises. \\(]a \\, ; b[\\) : bornes exclues. \\([a \\, ; b[\\) : \\(a\\) compris, \\(b\\) exclu. Le crochet tourné vers l'extérieur exclut la borne." },
      predict: { q: "Combien de nombres entiers l'intervalle ]2 ; 5] contient-il ?", choices: ["4", "3", "2"], good: 1, why: "Crochet tourné vers l'extérieur en 2 : 2 est exclu ; 5 est compris. Il reste 3, 4, 5." },
      defis: ["Nombre d'entiers de [−3 ; 4] ?", "Nombre d'entiers de [−3 ; 4] ∩ ]0 ; 9[ ?", "Plus petit entier de ]−2 ; 7] ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["de −3 à 4, bornes comprises", "partie commune : ]0 ; 4]", "−2 est exclu"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(8, "−3, −2, −1, 0, 1, 2, 3, 4 : 8 entiers."), W(4, "]0 ; 4] : 1, 2, 3, 4."), W(-1, "−2 exclu : le plus petit est −1.")] }),
    },
    domaine: {
      predict: { q: "Pour f(x) = √(x − 3), quel nombre est interdit ?", choices: ["3", "0", "2"], good: 2, why: "Sous la racine, il faut x − 3 ≥ 0, donc x ≥ 3 : 2 est interdit, 3 est permis (√0 = 0)." },
      defis: ["f(x) = 1/(x − 7) : valeur interdite ?", "f(x) = √(x + 5) : plus petite valeur permise ?", "f(x) = 1/(x² − 16) : valeur interdite positive ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["dénominateur " + nb(x) + " − 7 = " + nb(x - 7), "sous la racine : " + nb(x) + " + 5 = " + nb(x + 5), "x² − 16 = " + nb(x * x - 16)][s]),
        wins: [W(7, "x − 7 = 0 pour x = 7."), W(-5, "x + 5 ≥ 0 ⇔ x ≥ −5."), W(4, "x² = 16 : ±4 interdits.")] }),
    },
    racinv: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\sqrt{x}\\) n'existe que pour \\(x \\ge 0\\) ; \\(\\frac{1}{x}\\) n'existe que pour \\(x \\ne 0\\). Avec \\(f(x) = \\frac{12}{x}\\), quand \\(x\\) double, \\(f(x)\\) est divisé par 2. Pour résoudre \\(\\sqrt{x} = a\\) (\\(a \\ge 0\\)), on élève au carré : \\(x = a^2\\).", exemple: ["\\(f(x) = \\frac{12}{x}\\) : \\(f(3) = 4\\)", "\\(\\sqrt{x} = 9\\) : \\(x = 81\\)"], piege: "\\(\\sqrt{x} = 9\\) donne \\(x = 81\\), pas \\(x = 3\\) : on élève au carré." },
      predict: { q: "Quand x double, que devient f(x) = 12/x ?", choices: ["il double", "il est divisé par 2", "il ne change pas"], good: 1, why: "12/(2x) = (12/x) ÷ 2 : la fonction inverse « fait l'inverse »." },
      defis: ["f(x) = 12/x : f(3) ?", "Préimage de 4 par f ?", "√x = 9 : x ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s < 2 ? "12 ÷ " + nb(x) + " = " + nb(12 / x) : "√" + nb(x) + " ≈ " + nb(Math.sqrt(Math.max(0, x)))),
        wins: [W(4, "12 ÷ 3 = 4."), W(3, "12/x = 4 ⇔ x = 3."), W(81, "On élève au carré : x = 81.")] }),
    },
    transf: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(g(x) = f(x - a) + b\\) : translation de \\(a\\) horizontalement et de \\(b\\) verticalement. Le point \\((p ; q)\\) devient \\((p + a ; q + b)\\) ; le sommet de \\((x - a)^2 + b\\) est \\((a ; b)\\)." },
      predict: { q: "Le graphe de (x − 3)² est celui de x² déplacé de…", choices: ["3 vers la gauche", "3 vers la droite", "3 vers le haut"], good: 1, why: "(x − 3)² vaut 0 en x = 3 : le sommet passe de 0 à 3, vers la DROITE (signe inversé dans la parenthèse)." },
      defis: ["g(x) = (x − 3)² + 2 : abscisse du sommet ?", "Son ordonnée ?", "g(x) = (x + 4)² − 1 : abscisse du sommet ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => FIG.plot([{ f: (t) => t * t, dash: true }, { f: s < 2 ? (t) => (t - 3) ** 2 + 2 : (t) => (t + 4) ** 2 - 1 }], [], { numbers: true, xr: [-7, 7], yr: [-3, 8] }), show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "(x − 3)² : 3 vers la droite."), W(2, "+ 2 : 2 vers le haut."), W(-4, "(x + 4)² = (x − (−4))² : 4 vers la gauche.")] }),
    },
    absval: {
      predict: { q: "Combien de solutions a |x − 2| = 5 ?", choices: ["une", "deux", "aucune"], good: 1, why: "x est à distance 5 de 2 : x = 7 ou x = −3." },
      defis: ["|x − 2| = 5 : plus grande solution ?", "Plus petite solution ?", "Distance entre −4 et 6 (|−4 − 6|) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s < 2 ? "|" + nb(x) + " − 2| = " + nb(Math.abs(x - 2)) : "tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(7, "2 + 5 = 7."), W(-3, "2 − 5 = −3."), W(10, "|−10| = 10.")] }),
    },
    ineq: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On résout une inéquation du 1er degré comme une équation, en isolant \\(x\\). En multipliant ou en divisant par un nombre négatif, on retourne le sens de l'inégalité.", exemple: ["\\(-2x > 6\\) : on divise par \\(-2\\), donc \\(x < -3\\).", "\\(5 - x < 2\\) : \\(-x < -3\\), donc \\(x > 3\\) ; plus petit entier : 4."], piege: "\\(-2x > 6\\) donne \\(x < -3\\), pas \\(x > -3\\) : le sens se retourne." },
      predict: { q: "−2x > 6 donne…", choices: ["x > −3", "x < −3", "x > 3"], good: 1, why: "En divisant par −2 (négatif), on RETOURNE le sens : x < −3." },
      defis: ["−2x > 6 : x < … ?", "3x − 4 ≤ 11 : x ≤ … ?", "Plus petit entier solution de 5 − x < 2 ?"],
      play: hunt({ ask: true, label: "Borne", show: (x, s) => plain(["6 ÷ (−2)", "3x ≤ 15", "−x < −3 ⇔ x > 3"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-3, "x < −3 (sens retourné)."), W(5, "x ≤ 5."), W(4, "x > 3 : le plus petit entier est 4.")] }),
    },
    trinfact: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si \\(x_1\\) et \\(x_2\\) sont les zéros de \\(x^2 + bx + c\\), alors \\(x^2 + bx + c = (x - x_1)(x - x_2)\\). On cherche deux nombres de somme \\(-b\\) et de produit \\(c\\).", exemple: ["\\(x^2 - 5x + 6 = (x - 2)(x - 3)\\)", "\\(x^2 - 7x + 10 = (x - 2)(x - 5)\\) : zéros 2 et 5", "\\(x^2 + x - 12 = (x + 4)(x - 3)\\) : zéros \\(-4\\) et 3"], piege: "Les zéros ont le signe contraire du nombre dans la parenthèse : \\((x + 4)\\) s'annule en \\(-4\\)." },
      predict: { q: "x² − 5x + 6 se factorise en…", choices: ["(x − 2)(x − 3)", "(x + 2)(x + 3)", "(x − 1)(x − 6)"], good: 0, why: "Deux nombres de somme 5 et de produit 6 : 2 et 3. Zéros 2 et 3, donc (x − 2)(x − 3)." },
      defis: ["x² − 7x + 10 : plus petit zéro ?", "Plus grand zéro ?", "x² + x − 12 : zéro positif ?"],
      play: hunt({ ask: true, label: "Zéro", show: (x, s) => plain(s < 2 ? nb(x) + "² − 7·" + nb(x) + " + 10 = " + nb(x * x - 7 * x + 10) : nb(x) + "² + " + nb(x) + " − 12 = " + nb(x * x + x - 12)),
        wins: [W(2, "4 − 14 + 10 = 0."), W(5, "(x − 2)(x − 5)."), W(3, "(x − 3)(x + 4) : zéros 3 et −4.")] }),
    },
    f2formes: {
      predict: { q: "(x − 2)² + 3 a pour sommet…", choices: ["(2 ; 3)", "(−2 ; 3)", "(3 ; 2)"], good: 0, why: "Forme canonique a(x − h)² + k : sommet (h ; k) = (2 ; 3)." },
      defis: ["x² − 8x + 20 = (x − h)² + k : h ?", "k ?", "Constante de (x + 3)² − 4 développé ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["h = 8 ÷ 2", "(x − 4)² = x² − 8x + 16 ; 20 − 16", "9 − 4"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(4, "h = 4."), W(4, "k = 20 − 16 = 4."), W(5, "(x + 3)² = x² + 6x + 9 ; 9 − 4 = 5.")] }),
    },
    f2trois: {
      predict: { q: "Une parabole passe par (0 ; 7). Que vaut c dans ax² + bx + c ?", choices: ["7", "0", "on ne peut pas savoir"], good: 0, why: "f(0) = c : le point d'abscisse 0 donne directement c." },
      defis: ["Points (0 ; 1), (1 ; 4), (−1 ; 0) : c ?", "a + b = ? (f(1) − c)", "a ?"], garde: [0, 1, 2], // calcul enchaîné : les trois étapes
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["f(0)", "4 − 1", "(a + b) + (a − b) = 3 + (−1)"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(1, "c = f(0) = 1."), W(3, "a + b = 3 (et a − b = −1)."), W(1, "2a = 2 : a = 1, b = 2 ; f(x) = x² + 2x + 1.")] }),
    },
    inter: {
      predict: { q: "Combien de points communs ont y = x² et y = −1 ?", choices: ["deux", "un", "aucun"], good: 2, why: "x² = −1 n'a pas de solution : un carré n'est jamais négatif. La droite passe sous la parabole." },
      defis: ["y = x² et y = x + 6 : abscisse positive d'intersection ?", "Abscisse négative ?", "Ordonnée du point d'abscisse positive ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => t * t }, { f: (t) => t + 6 }], [], { numbers: true, xr: [-4, 4], yr: [-1, 10], squash: 0.6 }), show: (x, s) => plain(s < 2 ? nb(x) + "² = " + nb(x * x) + " ; " + nb(x) + " + 6 = " + nb(x + 6) : "tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "x² − x − 6 = (x − 3)(x + 2)."), W(-2, "x = −2."), W(9, "3² = 9 = 3 + 6.")] }),
    },
    geocomb: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On repère les triangles rectangles cachés dans la figure, puis on applique Pythagore. Losange : les diagonales se coupent en leur milieu à angle droit. Pavé : on calcule d'abord la diagonale d'une face, puis celle du pavé.", exemple: ["Losange de diagonales 6 et 8 : côté \\(\\sqrt{3^2 + 4^2} = 5\\).", "Pavé \\(2 \\times 3 \\times 6\\) : diagonale \\(\\sqrt{4 + 9 + 36} = 7\\)."] },
      predict: { q: "Un losange a des diagonales de 6 et 8 cm. Son côté mesure…", choices: ["7 cm", "5 cm", "10 cm"], good: 1, why: "Les diagonales se coupent en leur milieu à angle droit : √(3² + 4²) = 5." },
      defis: ["Côté du losange de diagonales 6 et 8 ?", "Hauteur d'un triangle isocèle de côtés 10, 10 et base 12 ?", "Diagonale d'un pavé 2 × 3 × 6 ?"],
      play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["√(3² + 4²)", "√(10² − 6²)", "√(4 + 9 + 36)"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "Demi-diagonales 3 et 4 : 5."), W(8, "Demi-base 6 : √64 = 8."), W(7, "√49 = 7.")] }),
    },
    droitesrem: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Les médianes (sommet → milieu du côté opposé) se coupent au centre de gravité \\(G\\), situé aux \\(\\frac{2}{3}\\) de chaque médiane depuis le sommet. Dans un triangle rectangle, le centre du cercle circonscrit est le milieu de l'hypoténuse.", exemple: ["Médiane de 12 cm : \\(AG = \\frac{2}{3} \\cdot 12 = 8\\) cm.", "Hypoténuse 10 : rayon du cercle circonscrit 5."], piege: "\\(G\\) est aux deux tiers depuis le sommet, pas au milieu de la médiane." },
      predict: { q: "Le centre de gravité G partage la médiane [AM] en…", choices: ["deux moitiés", "AG = 2/3 de AM", "AG = 1/3 de AM"], good: 1, why: "G est aux deux tiers de chaque médiane en partant du sommet." },
      defis: ["Médiane de 12 cm : AG ?", "GM ?", "Triangle rectangle d'hypoténuse 10 : rayon du cercle circonscrit ?"],
      play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["2/3 de 12", "1/3 de 12", "milieu de l'hypoténuse"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(8, "AG = 8."), W(4, "GM = 4."), W(5, "Rayon = 10 ÷ 2 = 5.")] }),
    },
    lectgraph: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Zéros : abscisses des points sur l'axe des \\(x\\). Les solutions de \\(f(x) = k\\) sont les abscisses des points d'intersection avec la droite horizontale \\(y = k\\)." },
      predict: { q: "Pour lire les solutions de f(x) = 2 sur un graphique, on regarde…", choices: ["où la courbe coupe l'axe des y", "où la courbe croise la droite horizontale y = 2", "la valeur f(2)"], good: 1, why: "f(x) = 2 : on cherche les x dont l'image vaut 2, donc les points de la courbe à la hauteur 2." },
      defis: ["f(x) = (x − 1)² − 4 : plus petit zéro ?", "Plus grand zéro ?", "Nombre de solutions de f(x) = −4 ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => (t - 1) ** 2 - 4 }], [], { numbers: true, xr: [-4, 6], yr: [-5, 6], hlines: [-4] }), show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-1, "La courbe coupe l'axe en −1."), W(3, "… et en 3."), W(1, "y = −4 touche la courbe au sommet seulement.")] }),
    },
    morceaux: {
      predict: { q: "f(x) = 2x si x < 3, et f(x) = 10 − x si x ≥ 3. Que vaut f(3) ?", choices: ["6", "7", "les deux"], good: 1, why: "x = 3 relève du 2e morceau (x ≥ 3) : f(3) = 10 − 3 = 7." },
      defis: ["f(1) ?", "f(5) ?", "f(3) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["1 < 3 : 2 · 1", "5 ≥ 3 : 10 − 5", "3 ≥ 3 : 10 − 3"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(2, "1er morceau : 2."), W(5, "2e morceau : 5."), W(7, "x = 3 est dans le 2e morceau : 7.")] }),
    },
    polyop: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Chaque terme de la première parenthèse multiplie chaque terme de la seconde. \\((a + b)^2 = a^2 + 2ab + b^2\\) : le double produit ne disparaît pas. Pour finir, on réduit.", exemple: ["\\((x + 3)^2 = x^2 + 6x + 9\\)", "\\((2x + 1)(x - 4) = 2x^2 - 8x + x - 4 = 2x^2 - 7x - 4\\)"], piege: "\\((x + 3)^2\\) n'est pas \\(x^2 + 9\\) : il manque \\(2 \\cdot x \\cdot 3 = 6x\\)." },
      predict: { q: "(x + 3)² = …", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(a + b)² = a² + 2ab + b² : le double produit 2 · x · 3 = 6x ne disparaît pas." },
      defis: ["Coefficient de x dans (x + 3)² ?", "Terme constant de (x − 3)(x + 3) ?", "Coefficient de x dans (2x + 1)(x − 4) ?"],
      play: hunt({ ask: true, label: "Coefficient", show: (x, s) => plain(["2 · x · 3", "−3 · 3", "2x · (−4) + 1 · x"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(6, "x² + 6x + 9."), W(-9, "x² − 9."), W(-7, "2x² − 7x − 4.")] }),
    },
    factor2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Étape 1 : mise en évidence d'un facteur commun. Étape 2 : identités remarquables (\\(a^2 - b^2 = (a - b)(a + b)\\), carrés parfaits \\(a^2 + 2ab + b^2 = (a + b)^2\\)). On recommence tant qu'un facteur peut encore se factoriser.", exemple: ["\\(2x^2 - 18 = 2(x^2 - 9) = 2(x - 3)(x + 3)\\)", "\\(x^2 + 10x + 25 = (x + 5)^2\\)"], piege: "\\(2(x^2 - 9)\\) n'est pas fini : \\(x^2 - 9\\) se factorise encore." },
      predict: { q: "2x² − 18 factorisé au maximum, c'est…", choices: ["2(x² − 9)", "2(x − 3)(x + 3)", "(2x − 6)(x + 3)"], good: 1, why: "On met 2 en évidence, puis x² − 9 est une différence de carrés : 2(x − 3)(x + 3)." },
      defis: ["Facteur mis en évidence dans 2x² − 18 ?", "Racine du carré parfait 9 ?", "x² + 10x + 25 = (x + ?)²"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(2, "2(x² − 9)."), W(3, "(x − 3)(x + 3)."), W(5, "(x + 5)² = x² + 10x + 25.")] }),
    },
    f2expr: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si on connaît les zéros \\(x_1\\) et \\(x_2\\) : \\(f(x) = a(x - x_1)(x - x_2)\\). Un point de plus permet de calculer \\(a\\).", exemple: ["Zéros 1 et 5, \\(f(0) = 10\\) : \\(a(0 - 1)(0 - 5) = 5a = 10\\), donc \\(a = 2\\).", "Alors \\(f(3) = 2(3 - 1)(3 - 5) = -8\\)."] },
      predict: { q: "Une parabole a pour zéros 1 et 5 et passe par (0 ; 10). Son coefficient a vaut…", choices: ["1", "2", "10"], good: 1, why: "f(x) = a(x − 1)(x − 5) ; f(0) = 5a = 10, donc a = 2." },
      defis: ["Produit (0 − 1)(0 − 5) ?", "Valeur de a ?", "f(3) = a(3 − 1)(3 − 5) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "(−1)(−5) = 5."), W(2, "5a = 10."), W(-8, "2 · 2 · (−2) = −8 (sommet).")] }),
    },
    interpar: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On résout \\(f(x) = g(x)\\). Pour deux paraboles, si les \\(x^2\\) s'annulent, il reste une équation du 1er degré.", exemple: ["\\(x^2 + 1 = x^2 + 2x - 5 \\iff 1 = 2x - 5\\), donc \\(x = 3\\)", "\\(x^2 = -x^2 + 8 \\iff x^2 = 4\\), donc \\(x = 2\\) ou \\(x = -2\\)"] },
      predict: { q: "Deux paraboles y = x² + 1 et y = x² + 2x − 5 se coupent en…", choices: ["deux points", "un point", "aucun"], good: 1, why: "Les x² s'annulent : 1 = 2x − 5, une équation du 1er degré, x = 3." },
      defis: ["Abscisse du point commun ?", "Son ordonnée ?", "y = x² et y = −x² + 8 : abscisse positive ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "2x = 6."), W(10, "3² + 1 = 10."), W(2, "2x² = 8, x = ±2.")] }),
    },
    ineq2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { piege: "\\(x^2 \\le 16\\) donne \\(-4 \\le x \\le 4\\), pas seulement \\(x \\le 4\\)." },
      predict: { q: "(x − 1)(x − 5) < 0 est vrai…", choices: ["entre 1 et 5", "en dehors de [1 ; 5]", "jamais"], good: 0, why: "Parabole tournée vers le haut : négative entre ses zéros." },
      defis: ["Nombre d'entiers avec (x − 1)(x − 5) < 0 ?", "Et avec ≤ 0 ?", "x² ≤ 16 : plus grand entier ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["entre 1 et 5 exclus", "bornes comprises", "−4 ≤ x ≤ 4"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "2, 3, 4."), W(5, "1 à 5."), W(4, "x ∈ [−4 ; 4].")] }),
    },
    ineqfrac: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(\\frac{x - 2}{x + 3} \\ge 0\\) : \\(S = \\,]-\\infty ; -3[ \\cup [2 ; +\\infty[\\)"], piege: "Le zéro du dénominateur est toujours exclu, même avec \\(\\ge\\) : \\(-3\\) n'est jamais solution." },
      predict: { q: "Pour résoudre \\(\\dfrac{x - 2}{x + 3} \\ge 0\\), \\(x = -3\\) est…", choices: ["solution", "interdit", "la seule solution"], good: 1, why: "−3 annule le dénominateur : valeur interdite, jamais dans la solution." },
      defis: ["Valeur interdite ?", "Zéro du numérateur ?", "Combien d'entiers de [−5 ; 5] vérifient \\(\\dfrac{x - 2}{x + 3} \\ge 0\\) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-3, "x + 3 = 0."), W(2, "x − 2 = 0."), W(6, "x < −3 : −5, −4 ; x ≥ 2 : 2, 3, 4, 5.")] }),
    },
    exactes: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Carré de côté \\(a\\) : diagonale \\(a\\sqrt{2}\\). Triangle équilatéral de côté \\(a\\) : hauteur \\(\\frac{a\\sqrt{3}}{2}\\).", exemple: ["Carré de côté 5 : diagonale \\(\\sqrt{25 + 25} = \\sqrt{50} = 5\\sqrt{2}\\).", "Triangle équilatéral de côté 6 : hauteur \\(\\sqrt{36 - 9} = \\sqrt{27} = 3\\sqrt{3}\\)."] },
      predict: { q: "La diagonale d'un carré de côté 5 mesure exactement…", choices: ["5√2", "10", "7,07"], good: 0, why: "√(25 + 25) = √50 = 5√2. 7,07 n'est qu'une valeur approchée." },
      defis: ["(5√2)² = ?", "Hauteur² d'un équilatéral de côté 6 ?", "(3√3)² = ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(50, "25 · 2 = 50."), W(27, "36 − 9 = 27 : h = 3√3."), W(27, "9 · 3 = 27.")] }),
    },
    trigo: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Hypoténuse 10 et angle 30° : côté opposé \\(= 10 \\cdot \\sin 30° = 5\\).", "Hypoténuse 50 et \\(\\cos\\alpha = 0{,}6\\) : côté adjacent \\(= 50 \\cdot 0{,}6 = 30\\)."], piege: "Choisis le rapport selon les côtés en jeu : opposé et hypoténuse → sinus (SOH)." },
      predict: { q: "Hypoténuse connue, on cherche le côté opposé à l'angle : on utilise…", choices: ["le sinus", "le cosinus", "la tangente"], good: 0, why: "SOH : sin = opposé / hypoténuse." },
      defis: ["Hypoténuse 10, angle 30° : opposé ?", "Adjacent 8, angle 45° : opposé ?", "Hypoténuse 50, cos α = 0,6 : adjacent ?"],
      play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["10 · sin 30°", "8 · tan 45°", "50 · 0,6"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "sin 30° = 0,5."), W(8, "tan 45° = 1."), W(30, "50 · 0,6 = 30.")] }),
    },
    trigrel: {
      predict: { q: "Si sin α = 0,6 (α aigu), cos α vaut…", choices: ["0,4", "0,8", "0,6"], good: 1, why: "sin² + cos² = 1 : cos² = 1 − 0,36 = 0,64, cos = 0,8 (et non 1 − 0,6)." },
      defis: ["sin α = 3/5 : cos α = 4/? (dénominateur)", "tan α = sin/cos = 3/?", "100 · (sin² + cos²) = ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "cos = 4/5."), W(4, "tan = (3/5)/(4/5) = 3/4."), W(100, "sin² + cos² = 1.")] }),
    },
    vabs: {
      predict: { q: "|3 − 8| vaut…", choices: ["−5", "5", "11"], good: 1, why: "On calcule l'intérieur, 3 − 8 = −5, puis la distance à zéro : 5. Une valeur absolue n'est jamais négative." },
      defis: ["|3 − 8| ?", "Distance entre −4 et 7 ?", "|x − 2| = 6 : plus petite solution ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "|−5| = 5."), W(11, "|−4 − 7| = 11."), W(-4, "2 − 6 = −4 (et 8).")] }),
    },
    ratden: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\frac{a}{\\sqrt{b}} = \\frac{a\\sqrt{b}}{b}\\) : on multiplie le numérateur et le dénominateur par \\(\\sqrt{b}\\).", exemple: ["\\(\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}\\)", "\\(\\frac{10}{\\sqrt{5}} = \\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}\\)"] },
      predict: { q: "6/√3 s'écrit aussi…", choices: ["2√3", "6√3", "√2"], good: 0, why: "On multiplie haut et bas par √3 : 6√3/3 = 2√3." },
      defis: ["(6/√3)² = ?", "(2 + √3)(2 − √3) = ?", "(10/√5)² = ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(12, "36/3 = 12."), W(1, "4 − 3 = 1 : le conjugué fait disparaître la racine."), W(20, "100/5 = 20.")] }),
    },
    fracrat: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pour simplifier, on factorise le numérateur et le dénominateur, puis on supprime les facteurs communs. On note les valeurs interdites (dénominateur nul).", exemple: ["\\(\\frac{x^2 - 9}{x - 3} = \\frac{(x - 3)(x + 3)}{x - 3} = x + 3\\) (pour \\(x \\ne 3\\)).", "\\(\\frac{3 - x}{x - 3} = -1\\) (pour \\(x \\ne 3\\))."] },
      predict: { q: "(x² − 9)/(x − 3), pour x ≠ 3, se simplifie en…", choices: ["x − 3", "x + 3", "x² − 3"], good: 1, why: "x² − 9 = (x − 3)(x + 3) : on simplifie le FACTEUR x − 3, jamais terme à terme." },
      defis: ["Valeur de (x² − 9)/(x − 3) pour x = 5 ?", "Pour x = 10 ?", "(3 − x)/(x − 3) pour x = 7 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(8, "x + 3 = 8."), W(13, "x + 3 = 13."), W(-1, "Toujours −1 (opposés).")] }),
    },
    valint: {
      predict: { q: "Combien de valeurs interdites a 1/(x² − 4) ?", choices: ["une", "deux", "aucune"], good: 1, why: "x² = 4 ⇔ x = 2 ou x = −2." },
      defis: ["1/(x² − 4) : valeur interdite positive ?", "Négative ?", "1/(x² + 4) : nombre de valeurs interdites ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(2, "2² − 4 = 0."), W(-2, "(−2)² − 4 = 0."), W(0, "x² + 4 ≥ 4 : jamais nul.")] }),
    },
    eqparam: {
      predict: { q: "(m − 3)x = 5 n'a aucune solution quand…", choices: ["m = 3", "m = 5", "m = −3"], good: 0, why: "Pour m = 3 : 0 · x = 5, impossible." },
      defis: ["m pour aucune solution ?", "Pour m = 8, la solution x ?", "x² + mx + 9 = 0 : m > 0 pour une seule solution ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "0 · x = 5 : impossible."), W(1, "5x = 5."), W(6, "Δ = m² − 36 = 0.")] }),
    },
  });
})();

