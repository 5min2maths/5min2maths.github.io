// 25.11 (agent trous) · Collège de Genève, 1re et 2e : derniers savoir-faire calculables du référentiel matu.
//  - graphefct (1re, M1C04) : reconnaître si une courbe est le graphe d'une fonction (1.FO.02c) : droites verticales,
//    tableaux de couples, équations, demi-cercles, courbes « couchées », raccord de deux morceaux.
//  - ineqgraph (2e, M2C03) : résoudre graphiquement une inéquation (2.AL.04e) : f(x) ≷ 0, f(x) ≷ k, f(x) ≷ g(x),
//    asymptote verticale, zéro double, encadrement, intersections à calculer.
// (Les droites remarquables dans un problème, 1.GE.04d, étendent droitesrem dans src/ch1c_geo.js.)
// Outils : TRX (src/trx.js). Paquet de chargement « 12 » (build.py : préfixe ch1c), chargé aussi en 2e.
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof TRX === "undefined") return;
  const { pk, nz, r6, fT, fS, QN, QSet, QS, GR, GSet, GSS, TR, TSt, TS, P, reg, W, toi, sv, tx, ln } = TRX;
  const NEG = { "<": ">=", "<=": ">", ">": "<=", ">=": "<" }, SWAP = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
  const ssT = (ivs) => SolSet.show(ivs, true);
  const yrOf = (fs, a, b) => { let lo = Infinity, hi = -Infinity; for (const f of fs) for (let i = 0; i <= 80; i++) { const y = f(a + ((b - a) * i) / 80); if (isFinite(y) && Math.abs(y) < 60) { lo = Math.min(lo, y); hi = Math.max(hi, y); } } return [Math.floor(Math.min(lo, -1)) - 1, Math.ceil(Math.max(hi, 1)) + 1]; };
  const PLf = (fns, o = {}) => { const yr = o.yr || [-6, 6]; return FIG.plot(fns, o.pts || [], Object.assign({ numbers: true, xr: [-6, 6], maxH: 320 }, yr[1] - yr[0] > 12 ? { step: 2 } : {}, o)); };
  const fx = (r) => (r === 0 ? "x" : "(x " + (r < 0 ? "+ " + fT(-r) : "- " + fT(r)) + ")");

  // ======================= graphefct : graphe d'une fonction ou non (1.FO.02c) =======================
  /* courbes : [fonction ?, nom, polylignes (coordonnées dans [−4 ; 4]²)] */
  const smp = (f, a, b, n = 60) => { const o = []; for (let i = 0; i <= n; i++) { const t = a + ((b - a) * i) / n; o.push(f(t)); } return o; };
  const CURVES = [
    [1, "parabole", [smp((t) => [t, t * t / 2 - 2], -3.6, 3.6)]],
    [1, "droite oblique", [smp((t) => [t, 0.6 * t + 0.5], -4, 4)]],
    [1, "courbe en S", [smp((t) => [t, (t * t * t) / 6 - t], -3.9, 3.9)]],
    [1, "courbe en V", [smp((t) => [t, Math.abs(t) * 0.9 - 1.5], -4, 4)]],
    [1, "hyperbole (deux morceaux)", [smp((t) => [t, 2 / t], -4, -0.5), smp((t) => [t, 2 / t], 0.5, 4)]],
    [1, "vague", [smp((t) => [t, 2 * Math.sin(1.2 * t)], -4, 4)]],
    [0, "cercle", [smp((t) => [3 * Math.cos(t), 3 * Math.sin(t)], 0, 2 * Math.PI, 80)]],
    [0, "droite verticale", [[[1.5, -4], [1.5, 4]]]],
    [0, "parabole couchée", [smp((t) => [t * t / 2 - 2, t], -3.6, 3.6)]],
    [0, "courbe en S couchée", [smp((t) => [(t * t * t) / 6 - t, t], -3.9, 3.9)]],
    [0, "ellipse", [smp((t) => [3.5 * Math.cos(t), 1.8 * Math.sin(t)], 0, 2 * Math.PI, 80)]],
  ];
  /* panneaux 2 × 2 : chaque courbe dans un repère [−4 ; 4]², numéro en coin */
  const panels = (cs, vline) => {
    const one = cs.length === 1, S = one ? 240 : 146, G = 8, H = one ? S : 2 * S + G, X0 = (i) => (i % 2) * (S + G), Y0 = (i) => Math.floor(i / 2) * (S + G), uid = "gf" + Math.floor(R.rand() * 1e9);
    let g = "";
    cs.forEach((c, i) => {
      const ox = X0(i), oy = Y0(i), X = (x) => ox + S / 2 + (x * (S - 12)) / 8, Y = (y) => oy + S / 2 - (y * (S - 12)) / 8, cid = uid + "-" + i;
      g += '<clipPath id="' + cid + '"><rect x="' + ox + '" y="' + oy + '" width="' + S + '" height="' + S + '" rx="6"/></clipPath>';
      g += '<rect x="' + ox + '" y="' + oy + '" width="' + S + '" height="' + S + '" rx="6" class="f-shape2" style="fill-opacity:.25"/>';
      for (let k = -4; k <= 4; k++) g += ln(X(k), Y(-4), X(k), Y(4), "f-grid", ' stroke-width="0.7"') + ln(X(-4), Y(k), X(4), Y(k), "f-grid", ' stroke-width="0.7"');
      g += ln(X(-4), Y(0), X(4), Y(0), "f-line", ' stroke-width="1.2"') + ln(X(0), Y(-4), X(0), Y(4), "f-line", ' stroke-width="1.2"');
      for (const pl of c[2]) g += '<path d="' + pl.map((p, j) => (j ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join(" ") + '" class="f-accent" fill="none" stroke-width="2.4" clip-path="url(#' + cid + ')"/>';
      if (vline !== undefined) g += ln(X(vline), Y(-4), X(vline), Y(4), "f-line", ' stroke-dasharray="5 4" stroke-width="1.6"');
      if (!one) g += '<circle cx="' + (ox + 14) + '" cy="' + (oy + 14) + '" r="10" class="f-shape" style="fill-opacity:.9"/>' + tx(ox + 14, oy + 18.5, String(i + 1), "middle", 13);
    });
    return sv(one ? S : 2 * S + G, H, g, cs.length > 1 ? "quatre courbes numérotées" : "courbe");
  };
  const GF = {
    1: [
      () => { const F = CURVES.filter((c) => c[0]), N = CURVES.filter((c) => !c[0]), nf = R.int(1, 3), pickN = (L, n) => { const a = L.slice(); const o = []; while (o.length < n) o.push(a.splice(Math.floor(R.rand() * a.length), 1)[0]); return o; };
        const cs = pickN(F, nf).concat(pickN(N, 4 - nf)); for (let i = cs.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [cs[i], cs[j]] = [cs[j], cs[i]]; }
        const ok = cs.map((c, i) => (c[0] ? i + 1 : 0)).filter(Boolean), ko = cs.map((c, i) => (c[0] ? 0 : i + 1)).filter(Boolean), hyp = cs.findIndex((c) => /hyperbole/.test(c[1])) + 1;
        return QSet("Parmi ces quatre courbes, lesquelles sont des graphes de fonctions (une image au plus pour chaque " + M("x") + ") ? Donne leurs numéros, séparés par « ; ».", ok,
          "Test de la droite verticale : une courbe est le graphe d'une fonction si aucune droite verticale ne la coupe en plus d'un point. " + cs.map((c, i) => (i + 1) + " : " + c[1] + (c[0] ? " (oui)" : " (non : une droite verticale la coupe deux fois ou plus)")).join(" ; ") + ".",
          { ctx: "quatre-courbes", fig: panels(cs),
            guide: [GR("Combien de ces courbes ne sont coupées qu'une fois au plus par chaque droite verticale ?", ok.length, M(ok.length) + "."), { ask: "Leurs numéros ?", spec: { kind: "set", values: ok }, sol: ok.join(" ; ") + "." }],
            traps: [TSt(ko, "Ce sont celles qui ne conviennent pas : une droite verticale les coupe deux fois."), hyp && cs[hyp - 1][0] ? TSt(ok.filter((i) => i !== hyp), "Le graphe d'une fonction peut être en plusieurs morceaux (courbe " + hyp + ") : chaque x a au plus une image.") : null, TSt([1, 2, 3, 4], "Teste chaque courbe avec une droite verticale.")] }); },
      () => { const c = pk([["le cercle de centre " + M("O") + " et de rayon 3", (a) => (Math.abs(a) < 3 ? 2 : 1), CURVES[6], [-2, -1, 1, 2]], ["la parabole « couchée » " + M("x = \\frac{y^2}{2} - 2"), (a) => 2, CURVES[8], [-1, 1, 2, 3]], ["la courbe en S « couchée »", (a) => 3, CURVES[9], [-0.5, 0.5]]]), a = pk(c[3]), v = c[1](a);
        return QN("La figure montre " + c[0] + " et la droite verticale " + M("x = " + fT(a)) + " (en traitillé). En combien de points cette droite coupe-t-elle la courbe ?", v,
          "On compte les points d'intersection : " + v + ". Le nombre " + M(fT(a)) + " aurait donc " + v + " « images » : la courbe n'est pas le graphe d'une fonction.",
          { ctx: "droite-verticale", fig: panels([c[2]], a),
            guide: [GR("Nombre de points d'intersection ?", v, M(v) + ".")],
            traps: [TR(1, "Regarde au-dessus ET au-dessous de l'axe des x."), TR(v === 2 ? 3 : 2, "Compte de nouveau, en suivant la droite en traitillé de haut en bas.")] }); },
      () => { const mkT = (fn) => { const xs = []; while (xs.length < 4) { const x = R.int(-4, 6); if (!xs.includes(x)) xs.push(x); } const ys = xs.map(() => R.int(-5, 9));
          if (!fn) { const i = R.int(1, 3); xs[i] = xs[R.int(0, i - 1)]; while (ys[i] === ys[xs.indexOf(xs[i])]) ys[i] = R.int(-5, 9); } else if (R.rand() < 0.6) ys[3] = ys[R.int(0, 2)];
          return [xs, ys, fn]; };
        const nf = R.int(1, 3), Ts = Array.from({ length: 4 }, (_, i) => mkT(i < nf)); for (let i = 3; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [Ts[i], Ts[j]] = [Ts[j], Ts[i]]; }
        const ok = Ts.map((t, i) => (t[2] ? i + 1 : 0)).filter(Boolean), ko = Ts.map((t, i) => (t[2] ? 0 : i + 1)).filter(Boolean);
        const tabT = (t, i) => (i + 1) + ") " + M("\\begin{array}{c|cccc} x & " + t[0].join(" & ") + " \\\\ \\hline y & " + t[1].join(" & ") + " \\end{array}");
        return QSet("Chaque tableau donne quatre points " + M("(x \\,;\\, y)") + ". Lesquels peuvent faire partie du graphe d'une fonction ? Donne les numéros, séparés par « ; ».<br>" + Ts.map(tabT).join("<br>"), ok,
          "Un graphe de fonction ne contient jamais deux points de même abscisse avec des ordonnées différentes. " + (ko.length ? "Tableau" + (ko.length > 1 ? "x " : " ") + ko.join(", ") + " : une même valeur de " + M("x") + " a deux valeurs de " + M("y") + "." : "") + " Deux " + M("x") + " différents peuvent avoir le même " + M("y") + ". Conviennent : " + (ok.length > 1 ? "tableaux " : "tableau ") + ok.join(" ; ") + ".",
          { ctx: "couples", guide: [GR("Combien de tableaux ont une valeur de " + M("x") + " répétée avec deux " + M("y") + " différents ?", ko.length, M(ko.length) + "."), { ask: "Numéros des tableaux qui conviennent ?", spec: { kind: "set", values: ok }, sol: ok.join(" ; ") + "." }],
            traps: [TSt(ko, "Ce sont ceux qui ne conviennent pas : une abscisse y a deux images."), TSt(ok.filter((i) => new Set(Ts[i - 1][1]).size === 4), "Deux abscisses différentes peuvent avoir la même image : seul un x répété avec deux y différents pose problème.")] }); },
    ],
    2: [
      () => { const h = nz(-2, 2), k = R.int(-1, 2), r = pk([2, 3]), v = [h - r, h + r];
        const fig = FIG.plot([], [[h, k, "C"]], { numbers: true, xr: [-6, 6], yr: [-5, 5], circles: [[h, k, r]], maxH: 260, label: "cercle de centre C" });
        return QSet("La figure montre le cercle de centre " + M("C(" + h + " \\,;\\, " + k + ")") + " et de rayon " + M(r) + ". Pour quelles valeurs de " + M("a") + " la droite verticale " + M("x = a") + " touche-t-elle le cercle en un seul point ?", v,
          "Une droite verticale coupe le cercle en deux points tant qu'elle passe entre les bords gauche et droit ; elle le touche en un seul point aux bords, à une distance " + M(r) + " du centre : " + M("a = " + h + " - " + r + " = " + (h - r)) + " et " + M("a = " + h + " + " + r + " = " + (h + r)) + ". Entre les deux, chaque " + M("x") + " a deux « images » : ce n'est pas le graphe d'une fonction.",
          { ctx: "cercle-verticales", fig,
            guide: [GR("Abscisse du centre ?", h, M(h) + "."), GR("Rayon ?", r, M(r) + "."), GSet("Abscisses cherchées ?", v, M((h - r) + " \\,;\\, " + (h + r)) + ".")],
            traps: [TSt([k - r, k + r], "Ce sont des ordonnées : on cherche des abscisses (droites verticales)."), TSt([-r, r], "Le centre n'est pas l'origine : pars de x = " + h + "."), TSt([h], "Au centre, la droite verticale coupe le cercle deux fois.")] }); },
      () => { const POOL = [[1, "y = x^2 - 3"], [1, "2x - 3y = 6"], [1, "y = |x| + 1"], [1, "y = \\sqrt{x}"], [1, "xy = 4"], [1, "y = x^3"], [1, "y - 2x^2 = 1"], [0, "x^2 + y^2 = 9"], [0, "y^2 = x"], [0, "x = 4"], [0, "|y| = x"], [0, "x = y^2 - 1"], [0, "y^2 = x^2"]];
        const F = POOL.filter((p) => p[0]), N = POOL.filter((p) => !p[0]), nf = R.int(2, 3), take = (L, n) => { const a = L.slice(), o = []; while (o.length < n) o.push(a.splice(Math.floor(R.rand() * a.length), 1)[0]); return o; };
        const es = take(F, nf).concat(take(N, 5 - nf)); for (let i = 4; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [es[i], es[j]] = [es[j], es[i]]; }
        const ok = es.map((e, i) => (e[0] ? i + 1 : 0)).filter(Boolean), ko = es.map((e, i) => (e[0] ? 0 : i + 1)).filter(Boolean);
        return QSet("Lesquelles de ces équations définissent " + M("y") + " comme une fonction de " + M("x") + " (au plus une valeur de " + M("y") + " pour chaque " + M("x") + ") ? Donne les numéros.<br>" + es.map((e, i) => (i + 1) + ") " + M(e[1])).join(" ; "), ok,
          "On isole " + M("y") + " : s'il reste deux valeurs possibles (" + M("y = \\pm\\ldots") + ") ou aucune contrainte sur " + M("y") + " (" + M("x = 4") + "), ce n'est pas une fonction. " + es.map((e, i) => (i + 1) + " : " + (e[0] ? "oui" : "non")).join(", ") + ".",
          { ctx: "equations", guide: [GR("Combien de ces équations donnent une seule valeur de " + M("y") + " pour chaque " + M("x") + " ?", ok.length, M(ok.length) + "."), { ask: "Leurs numéros ?", spec: { kind: "set", values: ok }, sol: ok.join(" ; ") + "." }],
            traps: [TSt(ko, "Ce sont celles qui ne conviennent pas (deux valeurs de y, ou x seul)."), TSt(es.map((e, i) => (/y\^2|\|y\|/.test(e[1]) ? 0 : i + 1)).filter(Boolean), "x = 4 ne donne pas y : la droite verticale n'est pas un graphe de fonction.")] }); },
      () => { const [r, a, b] = pk([[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [15, 9, 12]]), s = pk([1, -1]), up = R.rand() < 0.6, v = up ? b : -b;
        return QN("Le cercle " + M("x^2 + y^2 = " + r * r) + " n'est pas le graphe d'une fonction, mais sa moitié " + (up ? "supérieure" : "inférieure") + " l'est : c'est le graphe de " + M("f(x) = " + (up ? "" : "-") + "\\sqrt{" + r * r + " - x^2}") + ". Calcule " + M("f(" + s * a + ")") + ".", v,
          M("f(" + s * a + ") = " + (up ? "" : "-") + "\\sqrt{" + r * r + " - " + a * a + "} = " + (up ? "" : "-") + "\\sqrt{" + b * b + "} = " + v) + " : un seul point de la moitié " + (up ? "supérieure" : "inférieure") + " a pour abscisse " + M(s * a) + ".",
          { ctx: "demi-cercle", guide: [GR(M(r * r + " - (" + s * a + ")^2") + " ?", b * b, M(b * b) + "."), GR(M("f(" + s * a + ")") + " ?", v, M(v) + ".")],
            traps: [TR(-v, up ? "Moitié supérieure : la racine est positive." : "Moitié inférieure : f(x) = −√(…) est négative."), TR(up ? r - a : a - r, "On ne soustrait pas les longueurs : √(" + r * r + " − " + a * a + ")."), TR(b * b, "C'est y² ; prends la racine.")] }); },
    ],
    3: [
      () => { const c = R.int(1, 6), sq = pk([4, 9, 16].filter((q) => q !== c)), a = sq - c, v = Math.sqrt(sq);
        return QSet("La courbe d'équation " + M("x = y^2 - " + c) + " est une parabole « couchée ». Quelles sont les ordonnées de ses points d'abscisse " + M(a) + " ?", [-v, v],
          M(a + " = y^2 - " + c + " \\iff y^2 = " + sq + " \\iff y = -" + v + " \\text{ ou } y = " + v) + " : deux points ont l'abscisse " + M(a) + ", la courbe n'est pas le graphe d'une fonction de " + M("x") + ".",
          { ctx: "parabole-couchee", guide: [GR(M("y^2") + " ?", sq, M(sq) + "."), GSet("Ordonnées ?", [-v, v], M("-" + v + " \\,;\\, " + v) + ".")],
            traps: [TSt([v], "y² = " + sq + " a deux solutions : " + v + " et −" + v + "."), TSt([a * a - c], "Ici x est donné : remplace x par " + a + " et résous en y."), TSt([-sq, sq], "y² = " + sq + " : prends encore la racine.")] }); },
      () => { const h = nz(-4, 4), r = pk([2, 3, 4, 5]), ivs = [[h - r, true, h + r, true]];
        return QS("La fonction " + M("f(x) = \\sqrt{" + r * r + " - " + (h > 0 ? "(x - " + h + ")" : "(x + " + -h + ")") + "^2}") + " a pour graphe un demi-cercle. Donne son ensemble de définition (intervalle).", ivs,
          "Il faut " + M(r * r + " - (x " + (h > 0 ? "- " + h : "+ " + -h) + ")^2 \\ge 0") + ", soit " + M("|x " + (h > 0 ? "- " + h : "+ " + -h) + "| \\le " + r) + " : " + M(ssT(ivs)) + ". C'est la moitié supérieure du cercle de centre " + M("(" + h + " \\,;\\, 0)") + " et de rayon " + M(r) + ".",
          { ctx: "demi-cercle-domaine", guide: [GR("Abscisse du centre du cercle ?", h, M(h) + "."), GR("Rayon ?", r, M(r) + "."), GSS("Ensemble de définition ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS([[-r, true, r, true]], "Le centre n'est pas en 0 : décale de " + h + "."), TS([[h - r, false, h + r, false]], "Aux bornes, la racine vaut 0 : elles sont comprises."), TS([[h - r * r, true, h + r * r, true]], "Le rayon est " + r + ", pas " + r * r + ".")] }); },
      () => { const a = nz(-3, 3), b = nz(-5, 5), c = nz(-3, 3), x0 = nz(-3, 4); if (a === c) return null; const k = a * x0 + b - c * x0;
        return QN("On trace " + M("y = " + (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b < 0 ? " - " + -b : " + " + b)) + " pour " + M("x \\le " + x0) + ", et " + M("y = " + (c === 1 ? "" : c === -1 ? "-" : c) + "x + k") + " pour " + M("x \\ge " + x0) + ". Pour quelle valeur de " + M("k") + " cette réunion est-elle le graphe d'une fonction ?", k,
          "Les deux morceaux donnent chacun une image à " + M("x = " + x0) + " : il faut qu'elles soient égales. " + M(a + " \\cdot (" + x0 + ")" + (b < 0 ? " - " + -b : " + " + b) + " = " + (a * x0 + b)) + " et " + M(c + " \\cdot (" + x0 + ") + k = " + c * x0 + " + k") + ", donc " + M("k = " + k) + ".",
          { ctx: "raccord", guide: [GR("Image de " + M(x0) + " par le premier morceau ?", a * x0 + b, M(a * x0 + b) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(a * x0 + b, "C'est l'image par le premier morceau ; retire encore " + c + " · (" + x0 + ")."), TR(a * x0 + b + c * x0, "k = (image du premier morceau) − " + c + " · (" + x0 + ") : attention au signe."), TR(b, "On compare les deux morceaux en x = " + x0 + ".")] }); },
    ],
  };

  // ======================= ineqgraph : résoudre graphiquement une inéquation (2.AL.04e) =======================
  const OPS = ["<", "<=", ">", ">="], opT = (op) => OPT[op];
  const two = (lo, hi) => { let p, q; do { p = R.int(lo, hi); q = R.int(lo, hi); } while (Math.abs(p - q) < 2); return p < q ? [p, q] : [q, p]; };
  const IG = {
    1: [
      () => { const [p, q] = two(-5, 5), a = pk([1, -1, 0.5, -0.5]), f = (x) => a * (x - p) * (x - q), op = pk(OPS), ivs = signSet(f, [p, q], [], op), yr = yrOf([f], -6, 6);
        return QS("Voici le graphe de la fonction " + M("f") + ". Résous graphiquement " + M("f(x) " + opT(op) + " 0") + " (ensemble des solutions, en intervalles).", ivs,
          "La courbe coupe l'axe des " + M("x") + " en " + M(p) + " et " + M(q) + ". On garde les " + M("x") + " où la courbe est " + (op[0] === ">" ? "au-dessus" : "au-dessous") + " de l'axe" + (op.length === 2 ? " ou dessus (zéros compris)" : " (zéros exclus)") + " : " + M("S = " + ssT(ivs)) + ".",
          { ctx: "signe-f", fig: PLf([{ f }], { yr: [Math.max(yr[0], -9), Math.min(yr[1], 9)] }),
            guide: [GSet("Abscisses des points où la courbe coupe l'axe des " + M("x") + " ?", [p, q], M(p + " \\,;\\, " + q) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet(f, [p, q], [], NEG[op]), "Tu as pris l'autre côté de l'axe : " + M("f(x) " + opT(op) + " 0") + " veut la courbe " + (op[0] === ">" ? "au-dessus" : "au-dessous") + "."), TS(signSet(f, [p, q], [], SWAP[op]), op.length === 2 ? "Inégalité large : les zéros sont solutions." : "Inégalité stricte : les zéros ne sont pas solutions.")] }); },
      () => { const [p, q] = two(-4, 5), a = pk([1, -1, 0.5, -0.5]), k = nz(-3, 3), f = (x) => a * (x - p) * (x - q) + k, g = (x) => f(x) - k, op = pk(OPS), ivs = signSet(g, [p, q], [], op), yr = yrOf([f, () => k], -6, 6);
        return QS("Voici le graphe de la fonction " + M("f") + " et la droite " + M("y = " + k) + ". Résous graphiquement " + M("f(x) " + opT(op) + " " + k) + ".", ivs,
          "La courbe rencontre la droite " + M("y = " + k) + " aux abscisses " + M(p) + " et " + M(q) + ". On garde les " + M("x") + " où la courbe est " + (op[0] === ">" ? "au-dessus" : "au-dessous") + " de la droite : " + M("S = " + ssT(ivs)) + ".",
          { ctx: "f-et-constante", fig: PLf([{ f }, { f: () => k, cls: "f-line", dash: true }], { yr: [Math.max(yr[0], -9), Math.min(yr[1], 9)] }),
            guide: [GSet("Abscisses des points communs à la courbe et à la droite " + M("y = " + k) + " ?", [p, q], M(p + " \\,;\\, " + q) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet(g, [p, q], [], NEG[op]), "Tu as pris l'autre côté de la droite y = " + k + "."), TS(signSet(g, [p, q], [], SWAP[op]), op.length === 2 ? "Inégalité large : les points communs sont solutions." : "Inégalité stricte : les points communs ne sont pas solutions.")] }); },
      () => { const [p, q] = two(-4, 4), a = pk([1, -1, 0.5]), m = pk([-1, 0.5, 1, 2, -0.5]), n = R.int(-2, 2), g = (x) => m * x + n, f = (x) => g(x) + a * (x - p) * (x - q), d = (x) => f(x) - g(x), op = pk(OPS), ivs = signSet(d, [p, q], [], op), yr = yrOf([f, g], -6, 6);
        return QS("Voici les graphes de " + M("f") + " (courbe) et de " + M("g") + " (droite). Résous graphiquement " + M("f(x) " + opT(op) + " g(x)") + ".", ivs,
          "Les graphes se coupent aux abscisses " + M(p) + " et " + M(q) + ". " + M("f(x) " + opT(op) + " g(x)") + " : la courbe est " + (op[0] === ">" ? "au-dessus" : "au-dessous") + " de la droite" + (op.length === 2 ? " (points d'intersection compris)" : "") + " : " + M("S = " + ssT(ivs)) + ".",
          { ctx: "f-et-g", fig: PLf([{ f }, { f: g, cls: "f-line" }], { yr: [Math.max(yr[0], -10), Math.min(yr[1], 10)] }),
            guide: [GSet("Abscisses des points d'intersection ?", [p, q], M(p + " \\,;\\, " + q) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet(d, [p, q], [], NEG[op]), "C'est l'ensemble où la courbe est de l'autre côté de la droite."), TS(signSet(d, [p, q], [], SWAP[op]), op.length === 2 ? "Inégalité large : les abscisses des intersections sont solutions." : "Inégalité stricte : les intersections ne sont pas solutions.")] }); },
    ],
    2: [
      () => { let p, z; do { p = nz(-3, 3); z = nz(-4, 4); } while (Math.abs(p - z) < 2); const b = pk([1, -1, 2]), a = b * (p - z), f = (x) => a / (x - p) + b, op = pk(OPS), ivs = signSet(f, [z], [p], op);
        return QS("Voici le graphe de la fonction " + M("f") + " ; la droite " + M("x = " + p) + " (en traitillé) est une asymptote verticale : " + M("f") + " n'est pas définie en " + M(p) + ". Résous graphiquement " + M("f(x) " + opT(op) + " 0") + ".", ivs,
          "La courbe coupe l'axe des " + M("x") + " en " + M(z) + " ; elle change aussi de côté à l'asymptote " + M("x = " + p) + ", qui est toujours exclue. " + M("S = " + ssT(ivs)) + ".",
          { ctx: "hyperbole", fig: PLf([{ f }], { yr: [-7, 7], vlines: [p] }),
            guide: [GR("Zéro de " + M("f") + " (lu sur le graphe) ?", z, M(z) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet(f, [z, p], [], op), "En " + p + ", f n'est pas définie : cette valeur est toujours exclue."), TS(signSet(f, [z], [p], NEG[op]), "Tu as pris l'autre côté de l'axe."), TS(signSet(f, [z], [p], SWAP[op]), op.length === 2 ? "Inégalité large : le zéro " + z + " est solution." : "Inégalité stricte : le zéro " + z + " n'est pas solution.")] }); },
      () => { const [p, q] = two(-5, 5), k = nz(-3, 3), a = pk([1, 0.5]), f = (x) => a * (x - p) * (x - q) + k, strict = R.rand() < 0.5, v = strict ? q - p - 1 : q - p + 1, yr = yrOf([f, () => k], -6, 6);
        return QN("Voici le graphe de " + M("f") + " et la droite " + M("y = " + k) + ". Combien de nombres entiers " + M("x") + " vérifient " + M("f(x) " + (strict ? "<" : "\\le") + " " + k) + " ?", v,
          "La courbe est sous la droite entre " + M(p) + " et " + M(q) + " : " + M("S = " + ssT(signSet((x) => f(x) - k, [p, q], [], strict ? "<" : "<="))) + ". Entiers : de " + M(strict ? p + 1 : p) + " à " + M(strict ? q - 1 : q) + ", soit " + M(v) + ".",
          { ctx: "entiers", fig: PLf([{ f }, { f: () => k, cls: "f-line", dash: true }], { yr: [Math.max(yr[0], -9), Math.min(yr[1], 9)] }),
            guide: [GSet("Abscisses des points communs ?", [p, q], M(p + " \\,;\\, " + q) + "."), GR("Nombre d'entiers solutions ?", v, M(v) + ".")],
            traps: [TR(q - p, "Compte les entiers de " + p + " à " + q + " un par un : " + (strict ? "bornes exclues." : "bornes comprises, il y en a " + (q - p + 1) + ".")), TR(strict ? q - p + 1 : q - p - 1, strict ? "Inégalité stricte : " + p + " et " + q + " ne sont pas solutions." : "Inégalité large : " + p + " et " + q + " sont solutions.")] }); },
      () => { let p, q; do { p = nz(-3, 3); q = R.int(-3, 3); } while (p === q); const s = pk([1, -1]) * 0.25, f = (x) => s * (x - p) * (x - p) * (x - q), op = pk([">", "<", ">=", "<="]), ivs = signSet(f, [p, q], [], op), yr = yrOf([f], -5, 5);
        return QS("Voici le graphe de la fonction " + M("f") + " ; il touche l'axe des " + M("x") + " en " + M(p) + " sans le traverser. Résous graphiquement " + M("f(x) " + opT(op) + " 0") + ".", ivs,
          "En " + M(q) + ", la courbe traverse l'axe ; en " + M(p) + ", elle le touche et repart du même côté (zéro double)" + (op.length === 2 ? " : " + M(p) + " est solution, même isolé" : " : " + M(p) + " est exclu") + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "racine-double", fig: PLf([{ f }], { xr: [-5, 5], yr: [Math.max(yr[0], -8), Math.min(yr[1], 8)] }),
            guide: [GSet("Abscisses des points communs avec l'axe des " + M("x") + " ?", [p, q], M([p, q].sort((u, v) => u - v).join(" \\,;\\, ")) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet((x) => s * (x - p) * (x - q), [p, q], [], op), "En " + p + ", la courbe ne traverse pas l'axe : le signe ne change pas."), TS(signSet(f, [p, q], [], SWAP[op]), op.length === 2 ? "Inégalité large : les zéros sont solutions." : "Inégalité stricte : les zéros ne sont pas solutions."), TS(signSet(f, [p, q], [], NEG[op]), "Tu as pris l'autre côté de l'axe.")] }); },
    ],
    3: [
      () => { const rs = []; while (rs.length < 3) { const r = R.int(-4, 4); if (!rs.some((x) => Math.abs(x - r) < 2)) rs.push(r); } rs.sort((u, v) => u - v);
        const s = pk([0.25, -0.25, 0.2]), m = pk([0.5, -0.5, 1]), n = R.int(-1, 1), g = (x) => m * x + n, d = (x) => s * (x - rs[0]) * (x - rs[1]) * (x - rs[2]), f = (x) => g(x) + d(x), op = pk(OPS), ivs = signSet(d, rs, [], op), yr = yrOf([f, g], -5.5, 5.5);
        return QS("Voici les graphes de " + M("f") + " (courbe) et de " + M("g") + " (droite). Résous graphiquement " + M("f(x) " + opT(op) + " g(x)") + ".", ivs,
          "Les graphes se coupent en trois points, d'abscisses " + rs.map(M).join(", ") + ". Entre deux intersections consécutives, la courbe reste du même côté de la droite : " + M("S = " + ssT(ivs)) + ".",
          { ctx: "trois-intersections", fig: PLf([{ f }, { f: g, cls: "f-line" }], { xr: [-6, 6], yr: [Math.max(yr[0], -10), Math.min(yr[1], 10)] }),
            guide: [GSet("Abscisses des trois points d'intersection ?", rs, M(rs.join(" \\,;\\, ")) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet(d, rs, [], NEG[op]), "C'est là où la courbe est de l'autre côté de la droite."), TS(signSet(d, [rs[0], rs[2]], [], op), "Il y a trois intersections : la courbe change de côté aussi en " + rs[1] + "."), TS(signSet(d, rs, [], SWAP[op]), "Vérifie si les bornes sont comprises (inégalité large) ou non.")] }); },
      () => { const h = R.int(-2, 2), v0 = R.int(-4, -1), [s1, s2] = pk([[1, 2], [1, 3], [2, 3]]), k1 = v0 + s1 * s1, k2 = v0 + s2 * s2, f = (x) => (x - h) ** 2 + v0;
        const ivs = [[h - s2, true, h - s1, true], [h + s1, true, h + s2, true]];
        return QS("Voici le graphe de " + M("f") + " et les droites " + M("y = " + k1) + " et " + M("y = " + k2) + ". Résous graphiquement " + M(k1 + " \\le f(x) \\le " + k2) + ".", ivs,
          "On garde les " + M("x") + " où la courbe est entre les deux droites (bord compris). Elle rencontre " + M("y = " + k2) + " en " + M(h - s2) + " et " + M(h + s2) + ", et " + M("y = " + k1) + " en " + M(h - s1) + " et " + M(h + s1) + " : deux morceaux, " + M("S = " + ssT(ivs)) + ".",
          { ctx: "encadrement", fig: PLf([{ f }, { f: () => k1, cls: "f-line", dash: true }, { f: () => k2, cls: "f-line", dash: true }], { yr: [v0 - 1, Math.max(k2 + 1, 2)] }),
            guide: [GSet("Abscisses où la courbe rencontre " + M("y = " + k2) + " ?", [h - s2, h + s2], M((h - s2) + " \\,;\\, " + (h + s2)) + "."), GSet("Où elle rencontre " + M("y = " + k1) + " ?", [h - s1, h + s1], M((h - s1) + " \\,;\\, " + (h + s1)) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS([[h - s2, true, h + s2, true]], "Entre " + (h - s1) + " et " + (h + s1) + ", la courbe passe sous la droite y = " + k1 + " : ces x ne conviennent pas."), TS([[h - s1, true, h + s1, true]], "Là, f(x) ≤ " + k1 + " : on veut la courbe entre les deux droites."), TS([[h - s2, false, h - s1, false], [h + s1, false, h + s2, false]], "Inégalités larges : les bornes sont comprises.")] }); },
      () => { const p = pk([-1.5, -0.5, 0.5, 1.5, 2.5]), q = nz(-3, 3), m = pk([1, -1, 2]), n = R.int(-2, 2); if (q === p) return null;
        const B = -2 * (p + q) + m, C = 2 * p * q + n, f = (x) => 2 * x * x + B * x + C, g = (x) => m * x + n, op = pk(["<", "<=", ">", ">="]), d = (x) => f(x) - g(x), ivs = signSet(d, [p, q], [], op);
        const fT2 = "2x^2" + (B ? (B < 0 ? " - " : " + ") + (Math.abs(B) === 1 ? "" : fT(Math.abs(B))) + "x" : "") + (C ? (C < 0 ? " - " : " + ") + fT(Math.abs(C)) : ""), gT = (m === 1 ? "" : m === -1 ? "-" : m) + "x" + (n ? (n < 0 ? " - " + -n : " + " + n) : "");
        return QS("On donne " + M("f(x) = " + fT2) + " et " + M("g(x) = " + gT) + " (graphes ci-dessous). Une intersection ne tombe pas sur un nombre entier : calcule les abscisses des intersections, puis résous " + M("f(x) " + opT(op) + " g(x)") + ".", ivs,
          M("f(x) - g(x) = 2x^2" + (B - m ? (B - m < 0 ? " - " : " + ") + fT(Math.abs(B - m)) + "x" : "") + (C - n ? (C - n < 0 ? " - " : " + ") + fT(Math.abs(C - n)) : "") + " = 2" + fx(p) + fx(q)) + " : intersections en " + M(fT(p)) + " et " + M(q) + ". Le graphe confirme de quel côté est la parabole : " + M("S = " + ssT(ivs)) + ".",
          { ctx: "algebre-et-graphe", fig: PLf([{ f }, { f: g, cls: "f-line" }], { xr: [-5, 5], yr: [-6, 10], step: 2 }),
            guide: [GSet("Abscisses des intersections (fraction acceptée) ?", [p, q], M([p, q].sort((u, v) => u - v).map(fT).join(" \\,;\\, ")) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(signSet(d, [Math.round(p + 0.01), q].filter((v, i, t) => t.indexOf(v) === i), [], op), "L'intersection est en " + fS(p) + " : un graphe ne suffit pas, calcule-la."), TS(signSet(d, [p, q], [], NEG[op]), "C'est là où la parabole est de l'autre côté de la droite."), TS(signSet(d, [p, q], [], SWAP[op]), "Vérifie si les bornes sont comprises.")] }); },
    ],
  };

  const PROBS = {
    /* 26.11 soir (agent defis3) : valeurs tirées, 3 contextes chacun (avant : 3 ou 2 énoncés presque fixes). */
    graphefct: [
      () => { const [a1, b1, r] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15]]), a = pk([a1, b1, r, r, r + R.int(1, 3)]), n = a < r ? 2 : a === r ? 1 : 0;
        return Object.assign(P("On considère le cercle " + M("x^2 + y^2 = " + r * r) + " et la droite verticale " + M("x = " + a) + ".", [["a) En combien de points la droite coupe-t-elle le cercle ?", n], ["b) Image de " + a1 + " par la fonction dont le graphe est la moitié supérieure du cercle", b1], ["c) Plus grande abscisse d'un point du cercle", r]],
          ["Remplace x par " + a + " dans l'équation : combien de valeurs de y conviennent ?", "Moitié supérieure : y = √(" + r * r + " − x²), toujours positif."],
          "a) " + (n === 2 ? M("y^2 = " + (r * r - a * a)) + " : deux valeurs de " + M("y") + ", 2 points (le cercle n'est pas le graphe d'une fonction)" : n === 1 ? M("y^2 = 0") + " : un seul point (1), la droite touche le cercle" : M("y^2 = " + (r * r - a * a)) + " < 0 : aucun point, 0") + " ; b) " + M("\\sqrt{" + r * r + " - " + a1 * a1 + "} = " + b1) + " ; c) " + r + "."), { ctx: "cercle" }); },
      () => { const [a, h, r] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15]]);
        return Object.assign(P("Une arche de pont est un demi-cercle de rayon " + M(r) + " m. On place un repère au centre, au niveau de l'eau : l'arche est la moitié supérieure du cercle " + M("x^2 + y^2 = " + r * r) + ".", [["a) Hauteur de l'arche à " + a + " m du centre (m)", h], ["b) Largeur de la rivière sous l'arche (m)", 2 * r], ["c) Combien de points de l'arche ont pour abscisse " + a + " ?", 1]],
          ["Hauteur à " + a + " m du centre : y = √(" + r * r + " − " + a + "²).", "c) L'arche ne garde que y ≥ 0 : c'est le graphe d'une fonction."],
          "a) " + M("\\sqrt{" + r * r + " - " + a * a + "} = \\sqrt{" + h * h + "} = " + h) + " m ; b) " + M("2 \\cdot " + r + " = " + 2 * r) + " m ; c) 1 : le cercle entier en aurait 2, mais l'arche n'en garde qu'un (graphe d'une fonction)."), { ctx: "arche" }); },
      () => { const c = R.int(-4, 3), d = R.int(2, 5), k = pk([c + d * d, c, c - R.int(1, 3)]), n = k > c ? 2 : k === c ? 1 : 0, kk = c + d * d;
        return Object.assign(P("On considère la courbe d'équation " + M("x = y^2" + (c ? (c < 0 ? " - " + -c : " + " + c) : "")) + " (une parabole « couchée ») et la droite verticale " + M("x = " + k) + ".", [["a) En combien de points la droite coupe-t-elle la courbe ?", n], ["b) Plus grande ordonnée d'un point de la courbe d'abscisse " + kk, d], ["c) Cette courbe est-elle le graphe d'une fonction de x ? Tape 1 pour oui, 0 pour non.", 0]],
          ["Remplace x par " + k + " : " + M("y^2 = " + k + (c ? (c < 0 ? " + " + -c : " - " + c) : "")) + ".", "Un graphe de fonction : toute droite verticale le coupe au plus une fois."],
          "a) " + M("y^2 = " + (k - c)) + " : " + (n === 2 ? "deux valeurs de " + M("y") + ", 2 points" : n === 1 ? M("y = 0") + ", 1 point" : "impossible, 0 point") + " ; b) " + M("y^2 = " + kk + (c ? (c < 0 ? " + " + -c : " - " + c) + " = " + d * d : "")) + ", " + M("y = " + d) + " ; c) non (0) : la droite " + M("x = " + kk) + " la coupe en deux points."), { ctx: "parabole-couchee" }); },
    ],
    ineqgraph: [
      () => { const p = R.int(-4, -1), q = R.int(1, 5), f = (x) => (x - p) * (x - q), [op, opT, cx] = pk([["<", "<", "inf"], ["<=", "\\le", "infeg"], [">", ">", "sup"], [">=", "\\ge", "supeg"]]);
        const ok = (x) => (op === "<" ? f(x) < 0 : op === "<=" ? f(x) <= 0 : op === ">" ? f(x) > 0 : f(x) >= 0), fin = op[0] === "<", cnt = fin ? (op === "<" ? q - p - 1 : q - p + 1) : op === ">" ? q + 1 : q;
        const lc = fin ? "c) Nombre d'entiers x tels que " + M("f(x) " + opT + " 0") : "c) Plus petit entier positif x tel que " + M("f(x) " + opT + " 0");
        return Object.assign(P("Le graphe de " + M("f(x) = " + poly([1, -(p + q), p * q])) + " coupe l'axe des x en deux points.", [["a) Plus petite abscisse d'intersection avec l'axe", p], ["b) Plus grande", q], [lc, cnt]],
          ["Factorise : f(x) = " + fx(p) + fx(q) + ", ou lis le graphe.", fin ? "f(x) " + (op === "<" ? "<" : "≤") + " 0 entre les zéros, bornes " + (op === "<" ? "exclues" : "comprises") + "." : "f(x) " + (op === ">" ? ">" : "≥") + " 0 à l'extérieur des zéros, bornes " + (op === ">" ? "exclues" : "comprises") + "."],
          "a) " + p + " ; b) " + q + " ; c) " + (fin ? "les entiers de " + (op === "<" ? p + 1 : p) + " à " + (op === "<" ? q - 1 : q) + ", soit " + cnt : "à droite de " + q + (op === ">" ? " (exclu)" : " (compris)") + ", le plus petit entier positif est " + cnt) + ".", PLf([{ f }], { yr: [-8, 8] })), { ctx: cx }); },
      () => { const p = R.int(1, 3), q = R.int(6, 9), B = (x) => -(x - p) * (x - q), top = ((q - p) / 2) ** 2, obj = pk(["vélos", "tables", "lampes", "sacs"]);
        return Object.assign(P("Un atelier fabrique des " + obj + ". Pour " + M("x") + " centaines d'objets vendus, son bénéfice vaut " + M("B(x) = " + poly([-1, p + q, -p * q])) + " (en milliers de CHF). Le graphe de B est tracé.", [["a) Plus petite quantité (en centaines) pour laquelle B(x) = 0", p], ["b) Plus grande quantité pour laquelle B(x) = 0", q], ["c) Nombre de quantités entières (en centaines) pour lesquelles B(x) > 0", q - p - 1]],
          ["B(x) = −(x − " + p + ")(x − " + q + ") : lis où la courbe coupe l'axe.", "B(x) > 0 là où la courbe est au-dessus de l'axe, bornes exclues."],
          "a) " + p + " ; b) " + q + " : " + M("B(x) = -(x - " + p + ")(x - " + q + ")") + " ; c) bénéfice positif entre les zéros, bornes exclues : de " + (p + 1) + " à " + (q - 1) + ", soit " + (q - p - 1) + " quantités.", PLf([{ f: B }], { xr: [-1, 10], yr: [-6, Math.ceil(top) + 2] })), { ctx: "benefice" }); },
    ],
  };

  reg([
    { id: "graphefct", theme: "fa", label: "Graphe d'une fonction ou non ?", ex: "\\text{une droite verticale coupe le graphe au plus une fois}", CH: [12], lv: GF, probs: PROBS.graphefct,
      hint: "Test de la droite verticale : une courbe est le graphe d'une fonction si chaque droite verticale la coupe au plus une fois (chaque x a au plus une image). Un graphe peut être en plusieurs morceaux. Tableau de couples : aucune abscisse répétée avec deux ordonnées différentes.",
      lesson: ["Graphe d'une fonction", "Une fonction donne au plus une image à chaque nombre : son graphe ne repasse jamais au-dessus d'un même x.",
        "Le graphe de \\(f\\) est l'ensemble des points \\((x \\,;\\, f(x))\\). Une courbe est le graphe d'une fonction si et seulement si toute droite verticale \\(x = a\\) la coupe en un point au plus (aucun point : \\(a\\) n'est pas dans l'ensemble de définition). Un cercle, une parabole « couchée » (\\(x = y^2\\)), une droite verticale ne sont pas des graphes de fonctions ; une demi-circonférence l'est (\\(y = \\sqrt{r^2 - x^2}\\)). Une équation définit \\(y\\) comme fonction de \\(x\\) si, pour chaque \\(x\\), elle donne au plus une valeur de \\(y\\).",
        ["\\(x^2 + y^2 = 25\\) en \\(x = 3\\) : \\(y = 4\\) ou \\(y = -4\\) → pas une fonction.", "\\(y = \\frac{2}{x}\\) : deux morceaux, mais un seul \\(y\\) par \\(x\\) → fonction."],
        "Deux abscisses différentes peuvent avoir la même image : c'est une même abscisse avec deux images qui est interdite."],
      comps: ["Reconnaître un graphe de fonction (droites verticales, tableaux de couples)", "Cercles, équations, demi-cercles", "Courbes couchées, ensemble de définition, raccord de deux morceaux"],
      act: { retiens: { regle: "Une courbe est le graphe d'une fonction si chaque droite verticale la coupe au plus une fois.", exemple: ["Cercle \\(x^2 + y^2 = 25\\), droite \\(x = 3\\) : deux points \\((3 \\,;\\, 4)\\) et \\((3 \\,;\\, -4)\\) → pas une fonction.", "Moitié supérieure : \\(f(x) = \\sqrt{25 - x^2}\\), \\(f(3) = 4\\)."], piege: "Deux x différents avec le même y, c'est permis ; un même x avec deux y, non." },
        predict: { q: "Un cercle peut-il être le graphe d'une fonction ?", choices: ["non : une droite verticale le coupe en deux points", "oui, c'est une courbe fermée", "oui, si son centre est l'origine"], good: 0, why: "Pour un x entre les bords, il y a un point en haut et un en bas : deux images. Seule une moitié (haute ou basse) est un graphe de fonction." },
        defis: ["Cercle \\(x^2 + y^2 = 25\\) : en combien de points la droite \\(x = 3\\) le coupe-t-elle ?", "Sa moitié supérieure est le graphe de \\(f(x) = \\sqrt{25 - x^2}\\). Tape \\(f(3)\\)."],
        play: toi(["Remplace x par 3 : y² = 25 − 9 = 16", "f(3) = √(25 − 9)"], [W(2, "y = 4 ou y = −4 : deux points, donc pas une fonction."), W(4, "√16 = 4 : la moitié supérieure ne garde que y = 4.")]) } },
    { id: "ineqgraph", theme: "fa", label: "Résoudre graphiquement une inéquation", ex: "f(x) \\ge g(x) \\iff \\text{courbe de } f \\text{ au-dessus}", CH: [13], lv: IG, probs: PROBS.ineqgraph,
      hint: "f(x) > 0 : courbe au-dessus de l'axe des x ; f(x) > k : au-dessus de la droite y = k ; f(x) > g(x) : courbe de f au-dessus de celle de g. Repère d'abord les abscisses des points d'intersection ; inégalité large : elles sont comprises. Une asymptote verticale est toujours exclue.",
      lesson: ["Résolution graphique", "Une inéquation se lit sur un graphique : au-dessus ou au-dessous.",
        "Pour résoudre \\(f(x) \\ge g(x)\\), on trace les deux graphes, on lit les abscisses de leurs points d'intersection, puis on garde les intervalles où la courbe de \\(f\\) est au-dessus de celle de \\(g\\) (avec les abscisses des intersections si l'inégalité est large). \\(f(x) \\ge 0\\) : \\(g\\) est l'axe des \\(x\\) ; \\(f(x) \\ge k\\) : la droite horizontale \\(y = k\\). Une valeur où \\(f\\) n'est pas définie (asymptote) n'est jamais solution. Si une intersection ne tombe pas sur une graduation, on la calcule.",
        ["Parabole sous l'axe entre \\(-1\\) et \\(3\\) : \\(f(x) < 0 \\iff x \\in \\,]-1 \\,;\\, 3[\\)", "Courbe au-dessus de la droite à gauche de \\(-2\\) : \\(f(x) \\ge g(x)\\) sur \\(]-\\infty \\,;\\, -2]\\)…"],
        "On lit les solutions sur l'axe des \\(x\\) (des abscisses), pas sur l'axe des \\(y\\)."],
      comps: ["Lire f(x) ≷ 0, f(x) ≷ k, f(x) ≷ g(x) sur un graphique", "Asymptote verticale, zéro double, solutions entières", "Trois intersections, encadrement, intersection à calculer"],
      act: { retiens: { regle: "\\(f(x) \\le k\\) : on garde les abscisses où la courbe est sous la droite \\(y = k\\) (bornes comprises si l'inégalité est large).", exemple: ["\\(f(x) = x^2 - 4\\) : sous l'axe entre \\(-2\\) et \\(2\\).", "Entiers solutions de \\(f(x) \\le 0\\) : \\(-2, -1, 0, 1, 2\\), soit 5."], piege: "On lit les solutions sur l'axe des x, pas les valeurs de f." },
        predict: { q: "La parabole y = x² − 4 est sous l'axe des x…", choices: ["entre −2 et 2", "pour x < −4", "partout"], good: 0, why: "Elle coupe l'axe en −2 et 2 ; entre les deux, x² < 4, donc x² − 4 < 0." },
        defis: ["\\(f(x) = x^2 - 4\\). Combien d'entiers vérifient \\(f(x) \\le 0\\) ?", "\\(f(x) = x^2 - 2x - 3\\) coupe l'axe en \\(-1\\) et \\(3\\). Tape le plus grand entier tel que \\(f(x) < 0\\)."],
        play: toi(["La courbe est sous l'axe entre −2 et 2, bornes comprises", "Sous l'axe entre −1 et 3, bornes exclues"], [W(5, "−2, −1, 0, 1, 2 : cinq entiers."), W(2, "f(3) = 0 n'est pas < 0 : le plus grand entier est 2.")]) } },
  ]);
})();
