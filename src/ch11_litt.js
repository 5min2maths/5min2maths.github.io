// Chantier 11e · 5. Calcul littéral (15.11) : une seule source pour litelab, valnum, reduire, monomes, parenth,
// distrib (calcul littéral 1) et idrem, factor (calcul littéral 2). Même standard que ch11_prop.js : au moins
// 3 formes par niveau, pas à pas (guide) sur toutes les questions, erreurs typiques (traps : { e: expression }
// ou { v: valeur }), étiquette ctx ; défi = problèmes en plusieurs étapes. Réponses littérales contrôlées par
// équivalence et par la forme demandée (reduced : réduit ; product + minFactors : factorisé au maximum).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  // ---------- polynômes : liste de termes [coef, { lettre: exposant }] ----------
  const key = (v) => Object.keys(v).filter((k) => v[k]).sort().map((k) => k + v[k]).join("");
  const deg = (v) => Object.values(v).reduce((s, p) => s + p, 0);
  /* 26.11 (revue p5, n° 10 : corrigé « −12ab + 4a² + 9b² ») : à degré égal, ordre lexicographique (a², ab, b²) */
  const lexo = (v, w) => { for (const k of [...new Set([...Object.keys(v), ...Object.keys(w)])].sort()) { const d = (w[k] || 0) - (v[k] || 0); if (d) return d; } return 0; };
  const norm = (L) => { const m = new Map(); for (const [c, v] of L) { const k = key(v); const o = m.get(k); m.set(k, o ? [o[0] + c, o[1]] : [c, { ...v }]); }
    return [...m.values()].filter(([c]) => Math.abs(c) > 1e-12).sort((a, b) => deg(b[1]) - deg(a[1]) || lexo(a[1], b[1]) || key(a[1]).localeCompare(key(b[1]))); };
  const mulP = (A, B) => norm(A.flatMap(([c, v]) => B.map(([d, w]) => { const u = { ...v }; for (const k in w) u[k] = (u[k] || 0) + w[k]; return [c * d, u]; })));
  const addP = (...Ls) => norm(Ls.flat());
  const neg = (L) => L.map(([c, v]) => [-c, v]);
  const sc = (k, L) => L.map(([c, v]) => [k * c, v]);
  const lit = (v, tex) => Object.keys(v).filter((k) => v[k]).sort().map((k) => k + (v[k] > 1 ? (tex ? "^{" + v[k] + "}" : "^" + v[k]) : "")).join(tex ? "" : "*");
  const cTex = (c) => (Number.isInteger(c) ? String(Math.abs(c)) : dec(Math.abs(c)));
  const tex = (L) => !L.length ? "0" : L.map(([c, v], i) => { const l = lit(v, true), s = c < 0 ? (i ? " - " : "-") : i ? " + " : "";
    return s + (l ? (Math.abs(c) === 1 ? "" : cTex(c)) + l : cTex(c)); }).join("");
  const plain = (L) => !L.length ? "0" : L.map(([c, v]) => { const l = lit(v, false); return (c < 0 ? "-" : "+") + (l ? Math.abs(c) + "*" + l : Math.abs(c)); }).join("").replace(/^\+/, "");
  const X1 = (c, v = { x: 1 }) => [[c, v]];
  const lin = (a, b, x = "x") => norm([[a, { [x]: 1 }], [b, {}]]); // ax + b
  const raw = (terms) => terms.map(([c, s], i) => (c < 0 ? (i ? " - " : "-") : i ? " + " : "") + (s ? (Math.abs(c) === 1 ? "" : Math.abs(c)) + s : Math.abs(c))).join(""); // écriture non réduite
  const par = (t) => "(" + t + ")";
  const sg = (n) => (n < 0 ? "-" : "+");
  // ---------- constructeurs de questions ----------
  const Qx = (q, L, sol, o = {}) => { const e = typeof L === "string" ? L : plain(L);
    const x = { q, spec: Object.assign({ kind: "expr", expr: e }, o.form ? { form: o.form } : {}, o.minFactors ? { minFactors: o.minFactors } : {}), sol };
    if (o.guide) x.guide = o.guide; if (o.ctx) x.ctx = o.ctx; if (o.fig) x.fig = o.fig;
    // Un piège qui coïncide avec la bonne réponse (cas particuliers des nombres tirés) est retiré.
    let target = null; try { target = Expr.parse(e); } catch (er) {}
    x.traps = (o.traps || []).filter((tr) => { try { return !target || !Expr.equivalent(Expr.parse(tr.e), target); } catch (er) { return false; } });
    return x; };
  const Qn = (q, value, sol, o = {}) => { const x = QV(q, value, sol, o.fig ? { fig: o.fig } : {}); if (o.guide) x.guide = o.guide; x.traps = o.traps || []; if (o.ctx) x.ctx = o.ctx; return x; };
  const GX = (ask, L, sol, form) => ({ ask, spec: Object.assign({ kind: "expr", expr: typeof L === "string" ? L : plain(L) }, form ? { form } : {}), sol });
  const TX = (L, m) => ({ e: typeof L === "string" ? L : plain(L), m });
  const red = { form: "reduced" };
  const MULT = ["", "", "le double", "le triple", "le quadruple", "le quintuple"];

  // ===================== litelab : écrire une expression littérale =====================
  const LIT = {
    1: [
      () => { const m = R.int(2, 5), k = R.int(2, 9), up = R.rand() < 0.5, L = lin(m, up ? k : -k);
        return Qx("Écris l'expression littérale : « " + MULT[m] + " de " + M("x") + ", " + (up ? "augmenté" : "diminué") + " de " + k + " ».", L, M(tex(L)) + " : on prend d'abord " + MULT[m] + " de " + M("x") + " (" + M(m + "x") + "), puis on " + (up ? "ajoute" : "retire") + " " + k + ".",
          { ctx: "phrase", guide: [GX("Écris d'abord « " + MULT[m] + " de " + M("x") + " ».", X1(m), M(m + "x") + "."), GX("Puis " + (up ? "ajoute" : "retire") + " " + k + " :", L, M(tex(L)) + ".")],
            traps: [TX(m + "*(x" + (up ? "+" : "-") + k + ")", "Avec des parenthèses, on " + (up ? "ajouterait" : "retirerait") + " " + k + " avant de multiplier. Ici, on multiplie d'abord " + M("x") + ", puis on " + (up ? "ajoute" : "retire") + ".")] }); },
      () => { const m = R.int(2, 5), k = R.int(2, 9), y = pk(["x", "y", "a"]), e = m + "*(" + y + "+" + k + ")";
        return Qx("Écris l'expression littérale : « " + MULT[m] + " de la somme de " + M(y) + " et de " + k + " ».", e, M(m + "(" + y + " + " + k + ")") + " : la somme est calculée d'abord, donc entre parenthèses.",
          { ctx: "phrase-somme", guide: [GX("Écris d'abord « la somme de " + M(y) + " et de " + k + " ».", y + "+" + k, M(y + " + " + k) + "."), GX("Prends " + MULT[m] + " de cette somme (avec des parenthèses) :", e, M(m + "(" + y + " + " + k + ")") + ".")],
            traps: [TX(m + "*" + y + "+" + k, "Sans parenthèses, seul " + M(y) + " est multiplié. Ici, c'est toute la somme qu'on multiplie : " + M(m + "(" + y + " + " + k + ")") + ".")] }); },
      () => { const c = pk([["le produit de x et du carré de y", "x*y^2", "x y^2", "(x*y)^2", "Ici seul y est au carré : x · y²."], ["le carré du produit de x et de y", "(x*y)^2", "(x y)^2", "x*y^2", "C'est tout le produit qui est au carré : (xy)²."], ["la somme des carrés de a et de b", "a^2+b^2", "a^2 + b^2", "(a+b)^2", "On élève chaque nombre au carré, puis on additionne."], ["le carré de la somme de a et de b", "(a+b)^2", "(a + b)^2", "a^2+b^2", "On additionne d'abord, puis on élève la somme au carré."]]);
        return Qx("Écris l'expression littérale : « " + c[0].replace(/ (x|y|a|b)( |$)/g, " \\($1\\)$2") + " ».", c[1], M(c[2]) + ". " + c[4],
          { ctx: "carre", guide: [GX("Le début de la phrase donne l'opération faite en dernier. Écris l'expression.", c[1], M(c[2]) + ". " + c[4])], traps: [TX(c[3], c[4])] }); },
    ],
    2: [
      () => { const c = pk([["le nombre entier qui suit n", "n+1", "n + 1", "n*1"], ["le nombre pair qui suit 2n", "2*n+2", "2n + 2", "2*n+1"], ["la somme de trois nombres entiers consécutifs, le plus petit étant n", "3*n+3", "n + (n + 1) + (n + 2) = 3n + 3", "3*n"], ["le nombre impair qui suit 2n + 1", "2*n+3", "2n + 3", "2*n+2"], ["le produit d'un nombre entier n et de son successeur", "n*(n+1)", "n(n + 1)", "n+n+1"]]);
        return Qx("Avec " + M("n") + " un nombre entier, écris " + c[0].replace(/ (n|2n|2n \+ 1)( |$)/g, " \\($1\\)$2") + ".", c[1], M(c[2]) + ".",
          { ctx: "entiers", guide: [GX("Écris l'expression (essaie avec n = 5 pour vérifier).", c[1], M(c[2]) + ".")], traps: [TX(c[3], "Essaie avec n = 5 : ton expression ne donne pas le bon nombre.")] }); },
      () => { const k = R.int(2, 9), w = pk(["x", "a"]), P = norm([[4, { [w]: 1 }], [2 * k, {}]]);
        return Qx("Un rectangle a une largeur " + M(w) + " et une longueur " + M(w + " + " + k) + ". Écris son périmètre sous forme réduite.", P, M("2 \\cdot " + w + " + 2(" + w + " + " + k + ") = " + tex(P)) + ".",
          { ...red, ctx: "perim", fig: FIG.rectFig(9, 5, w + " + " + k, w), guide: [GX("Additionne les quatre côtés : " + M(w + " + " + w + " + (" + w + " + " + k + ") + (" + w + " + " + k + ")") + ". Réduis.", P, M(tex(P)) + ".", "reduced")],
            traps: [TX(w + "*(" + w + "+" + k + ")", "Ça, c'est l'aire. Le périmètre est la longueur du tour : on additionne les côtés."), TX("2*" + w + "+" + k, "Ça, c'est un demi-périmètre (une largeur et une longueur).")] }); },
      () => { const k = R.int(2, 9), e = "x*(x+" + k + ")";
        return Qx("Un rectangle a une largeur " + M("x") + " et une longueur " + M("x + " + k) + ". Écris son aire.", e, M("A = x(x + " + k + ") = x^2 + " + k + "x") + ".",
          { ctx: "aire", fig: FIG.rectFig(9, 5, "x + " + k, "x"), guide: [GX("Aire = longueur · largeur. Écris-la.", e, M("x(x + " + k + ")") + " (ou, développé, " + M("x^2 + " + k + "x") + ").")],
            traps: [TX("4*x+" + 2 * k, "Ça, c'est le périmètre. L'aire est le produit longueur · largeur."), TX("x*x+" + k, "Il faut des parenthèses : c'est toute la longueur " + M("x + " + k) + " qu'on multiplie par " + M("x") + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 9), m = R.int(2, 5), drop = R.rand() < 0.5;
        const L = drop ? X1(m, { n: 1 }) : X1(1, { n: 1 });
        return Qx("Tour de magie : choisis un nombre " + M("n") + ". Ajoute " + a + ". Multiplie le résultat par " + m + ". " + (drop ? "Retire " + m * a + "." : "Retire " + m * a + ", puis divise par " + m + ".") + " Écris le résultat sous la forme la plus simple.", L,
          M(m + "(n + " + a + ") - " + m * a + " = " + m + "n + " + m * a + " - " + m * a + " = " + m + "n") + (drop ? "" : " ; divisé par " + m + " : " + M("n")) + ". On retrouve toujours le même résultat, quel que soit " + M("n") + ".",
          { ...red, ctx: "magie", guide: [GX("Écris le résultat après « multiplie par " + m + " ».", m + "*(n+" + a + ")", M(m + "(n + " + a + ")") + "."), GX("Développe et retire " + m * a + " : il reste ?", X1(m, { n: 1 }), M(m + "n + " + m * a + " - " + m * a + " = " + m + "n") + ".", "reduced"), ...(drop ? [] : [GX("Divise par " + m + " :", "n", M("n") + " : on retrouve le nombre de départ !", "reduced")])],
            traps: [TX(m + "*n+" + a + "-" + m * a, "On multiplie toute la somme " + M("n + " + a) + " par " + m + " : " + M(m + "(n + " + a + ")") + ".")] }); },
      () => { const k = R.int(2, 6), c = pk([["carré de côté x", "x^2", "x^2"], ["rectangle de " + M("2x") + " sur " + M("x"), "2*x^2", "2x^2"]]), e = c[1] + "-" + k * k;
        return Qx("Dans un " + (c[0].startsWith("carré") ? "carré de côté " + M("x") : c[0]) + ", on découpe un carré de côté " + k + " dans un coin. Écris l'aire de la figure restante.", e, M(c[2] + " - " + k + "^2 = " + c[2] + " - " + k * k) + ".",
          { ctx: "decoupe", guide: [GX("Aire de la grande figure ?", c[1], M(c[2]) + "."), GX("Retire l'aire du petit carré (" + k + " · " + k + ") :", e, M(c[2] + " - " + k * k) + ".")],
            traps: [TX(c[0].startsWith("carré") ? "(x-" + k + ")^2" : "2*(x-" + k + ")^2", "On n'enlève pas " + k + " au côté : on retire l'aire du petit carré, " + k * k + "."), TX(c[1] + "-" + k, "On retire une aire : celle du petit carré, " + k + "² = " + k * k + ".")] }); },
      () => { const c = pk([["Léa a \\(x\\) ans. Son père a 3 fois son âge plus 4 ans. Écris la somme de leurs âges sous forme réduite.", [[4, { x: 1 }], [4, {}]], "x + (3x + 4) = 4x + 4", "3*x+4", "C'est l'âge du père seulement : ajoute celui de Léa.", "age"],
          ["Un cahier coûte \\(a\\) CHF et un stylo \\(b\\) CHF. Écris le prix de 5 cahiers et de 3 stylos, moins un bon de 2 CHF.", "5*a+3*b-2", "5a + 3b - 2", "5*a+3*b", "N'oublie pas le bon de 2 CHF.", "prix"],
          ["Un taxi demande 6 CHF de prise en charge et 3 CHF par km. Écris le prix d'une course de \\(k\\) km, puis celui de deux courses identiques, sous forme réduite.", [[6, { k: 1 }], [12, {}]], "2(6 + 3k) = 12 + 6k", "6+3*k", "C'est le prix d'une seule course : on en veut deux.", "taxi"]]);
        return Qx(c[0], c[1], M(c[2]) + ".", { ...red, ctx: c[5], guide: [GX("Écris l'expression, puis réduis-la.", c[1], M(c[2]) + ".", "reduced")], traps: [TX(c[3], c[4])] }); },
    ],
  };

  // ===================== valnum : substituer =====================
  const VAL = {
    1: [
      () => { const a = R.int(2, 5), b = nz(-6, 6), x = -R.int(2, 4), v = a * x * x + b * x;
        return Qn("Calcule " + M(a + "x^2 " + (b < 0 ? "- " : "+ ") + Math.abs(b) + "x") + " pour " + M("x = " + x) + ".", v, M(a + " \\cdot (" + x + ")^2 " + (b < 0 ? "- " : "+ ") + Math.abs(b) + " \\cdot (" + x + ") = " + a * x * x + (b * x < 0 ? " - " : " + ") + Math.abs(b * x) + " = " + v) + ".",
          { ctx: "poly", guide: [GS("Calcule d'abord " + M("(" + x + ")^2") + ".", x * x, M("(" + x + ")^2 = " + x * x) + " : un carré est positif."), GS("Puis " + M(a + "x^2 = " + a + " \\cdot " + x * x) + " :", a * x * x, M(a * x * x) + "."), GS("Et " + M((b < 0 ? "-" : "") + Math.abs(b) + "x") + " pour " + M("x = " + x) + ", puis le total :", v, M(a * x * x + (b * x < 0 ? " - " : " + ") + Math.abs(b * x) + " = " + v) + ".")],
            traps: [{ v: -a * x * x + b * x, m: "Attention : " + M("(" + x + ")^2 = " + x * x) + ", positif. On met la valeur négative entre parenthèses avant d'élever au carré." }, { v: (a * x) ** 2 + b * x, m: "Seul " + M("x") + " est au carré, pas " + M(a + "x") + "." }] }); },
      () => { const a = R.int(3, 12), b = R.int(2, 5), x = -R.int(2, 6), v = a - b * x;
        return Qn("Calcule " + M(a + " - " + b + "x") + " pour " + M("x = " + x) + ".", v, M(a + " - " + b + " \\cdot (" + x + ") = " + a + " + " + -b * x + " = " + v) + ".",
          { ctx: "lin", guide: [GS("Calcule " + M(b + " \\cdot (" + x + ")") + ".", b * x, M(b * x) + "."), GS("Puis " + M(a + " - (" + b * x + ")") + " :", v, "Moins un nombre négatif, c'est plus : " + M(v) + ".")],
            traps: [{ v: a + b * x, m: "Soustraire " + M(b * x) + ", c'est ajouter " + M(-b * x) + "." }] }); },
      () => { const L = R.int(5, 15) + pk([0, 0.5]), l = R.int(2, 9), c = pk([["P = 2(L + l)", 2 * (L + l), "2(" + dec(L) + " + " + l + ") = " + dec(2 * (L + l)), 2 * L + l, "Les parenthèses d'abord : on additionne L et l, puis on multiplie la somme par 2.", "perim"], ["A = L \\cdot l", L * l, dec(L) + " \\cdot " + l + " = " + dec(L * l), L + l, "L'aire est un produit, pas une somme.", "aire"]]);
        return Qn("Utilise la formule " + M(c[0]) + " pour un rectangle de longueur " + M("L = " + dec(L)) + " cm et de largeur " + M("l = " + l) + " cm (résultat en " + (c[5] === "aire" ? "cm²" : "cm") + ").", c[1], M(c[2]) + ".",
          { ctx: c[5], guide: [GS("Remplace " + M("L") + " et " + M("l") + " par leurs valeurs et calcule.", c[1], M(c[2]) + ".")], traps: [{ v: c[3], m: c[4] }] }); },
    ],
    2: [
      () => { const a = -R.int(1, 4), b = R.int(2, 5), c = R.int(2, 4), v = a * a - c * a * b + b;
        return Qn("Calcule " + M("a^2 - " + c + "ab + b") + " pour " + M("a = " + a) + " et " + M("b = " + b) + ".", v, M("(" + a + ")^2 - " + c + " \\cdot (" + a + ") \\cdot " + b + " + " + b + " = " + a * a + " + " + -c * a * b + " + " + b + " = " + v) + ".",
          { ctx: "deux", guide: [GS("Calcule " + M("(" + a + ")^2") + ".", a * a, M(a * a) + "."), GS("Calcule " + M(c + " \\cdot (" + a + ") \\cdot " + b) + ".", c * a * b, M(c * a * b) + "."), GS("Total : " + M(a * a + " - (" + c * a * b + ") + " + b) + " ?", v, M(v) + ".")],
            traps: [{ v: -a * a - c * a * b + b, m: M("(" + a + ")^2 = " + a * a) + " (positif)." }, { v: a * a + c * a * b + b, m: "Attention au signe : " + M("-" + c + " \\cdot (" + a + ") \\cdot " + b + " = " + -c * a * b) + "." }] }); },
      () => { const x = pk([0.5, 1.5, 2.5]), a = R.int(2, 4), b = R.int(3, 7), v = +(x * x - a * x + b).toFixed(4);
        return Qn("Calcule " + M("x^2 - " + a + "x + " + b) + " pour " + M("x = " + dec(x)) + ".", v, M(dec(x) + "^2 - " + a + " \\cdot " + dec(x) + " + " + b + " = " + dec(x * x) + " - " + dec(a * x) + " + " + b + " = " + dec(v)) + ".",
          { ctx: "dec", guide: [GS("Calcule " + M(dec(x) + "^2") + ".", x * x, M(dec(x) + " \\cdot " + dec(x) + " = " + dec(x * x)) + "."), GS("Total ?", v, M(dec(v)) + ".")],
            traps: [{ v: +(2 * x - a * x + b).toFixed(4), m: M(dec(x) + "^2") + " veut dire " + M(dec(x) + " \\cdot " + dec(x)) + ", pas " + M("2 \\cdot " + dec(x)) + "." }] }); },
      () => { const B = R.int(6, 14), b = R.int(2, B - 2), h = R.int(3, 8), v = ((B + b) * h) / 2;
        return Qn("L'aire d'un trapèze est " + M("A = \\frac{(B + b) \\cdot h}{2}") + ". Calcule-la pour " + M("B = " + B) + " cm, " + M("b = " + b) + " cm et " + M("h = " + h) + " cm (en cm²).", v, M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = \\frac{" + (B + b) * h + "}{2} = " + dec(v)) + " cm².",
          { ctx: "trapeze", guide: [GS("Calcule d'abord la parenthèse " + M("B + b") + ".", B + b, M(B + b) + "."), GS("Puis " + M("\\frac{" + (B + b) + " \\cdot " + h + "}{2}") + " :", v, M(dec(v)) + " cm².")],
            traps: [{ v: B + (b * h) / 2, m: "La parenthèse se calcule d'abord : " + M("B + b") + ", puis on multiplie par " + M("h") + "." }] }); },
    ],
    3: [
      () => { const x = pk([[-2, 3], [2, 3], [-1, 2], [-3, 2]]), a = pk([6, 12]), b = R.int(2, 5), c = R.int(1, 5), xv = x[0] / x[1], v = a * xv * xv - b * xv + c;
        return Qn("Calcule " + M(a + "x^2 - " + b + "x + " + c) + " pour " + M("x = " + frac(x[0], x[1])) + " (résultat exact).", v, M(a + " \\cdot " + frac(x[0] * x[0], x[1] * x[1]) + " - " + b + " \\cdot (" + frac(x[0], x[1]) + ") + " + c + " = " + frac(a * x[0] * x[0], x[1] * x[1]) + (b * x[0] < 0 ? " + " : " - ") + frac(Math.abs(b * x[0]), x[1]) + " + " + c + " = " + frac(Math.round(v * 36), 36)) + ".",
          { ctx: "frac", guide: [GS("Calcule " + M("x^2 = (" + frac(x[0], x[1]) + ")^2") + ".", xv * xv, M(frac(x[0] * x[0], x[1] * x[1])) + "."), GS("Calcule " + M(a + "x^2") + ".", a * xv * xv, M(frac(a * x[0] * x[0], x[1] * x[1])) + "."), GS("Résultat exact ?", v, M(frac(Math.round(v * 36), 36)) + ".")],
            traps: [{ v: -a * xv * xv - b * xv + c, m: "Le carré d'un nombre négatif est positif." }] }); },
      () => { const a = R.int(2, 6), b = -R.int(2, 6), v = (a - b) ** 2;
        return Qn("Calcule " + M("(a - b)^2") + " pour " + M("a = " + a) + " et " + M("b = " + b) + ".", v, M("(" + a + " - (" + b + "))^2 = " + (a - b) + "^2 = " + v) + ".",
          { ctx: "carre", guide: [GS("Calcule d'abord " + M("a - b = " + a + " - (" + b + ")") + ".", a - b, M(a - b) + "."), GS("Élève au carré :", v, M((a - b) + "^2 = " + v) + ".")],
            traps: [{ v: a * a - b * b, m: M("(a - b)^2") + " n'est pas " + M("a^2 - b^2") + " : on calcule la parenthèse, puis on élève au carré." }, { v: (a + b) ** 2, m: "Moins un nombre négatif, c'est plus : " + M(a + " - (" + b + ") = " + (a - b)) + "." }] }); },
      () => { const x = -R.int(2, 4), k = R.int(2, 5), v = x ** 3 - k * x;
        return Qn("Calcule " + M("x^3 - " + k + "x") + " pour " + M("x = " + x) + ".", v, M("(" + x + ")^3 - " + k + " \\cdot (" + x + ") = " + x ** 3 + " + " + -k * x + " = " + v) + ".",
          { ctx: "cube", guide: [GS("Calcule " + M("(" + x + ")^3") + " (trois facteurs négatifs).", x ** 3, M("(" + x + ") \\cdot (" + x + ") \\cdot (" + x + ") = " + x ** 3) + " : un cube garde le signe."), GS("Résultat ?", v, M(x ** 3 + " + " + -k * x + " = " + v) + ".")],
            traps: [{ v: -(x ** 3) - k * x, m: "Le cube d'un nombre négatif est négatif (trois signes « − »)." }] }); },
    ],
  };

  // ===================== reduire : réduire, ordonner =====================
  const RED = {
    1: [
      () => { const v = pk(["x", "y", "a"]); let a, b, c, d; do { a = nz(-9, 9); c = nz(-9, 9); b = nz(-9, 9); d = nz(-9, 9); } while (a + c === 0 || b + d === 0 || a + c === 1);
        const L = norm([[a + c, { [v]: 1 }], [b + d, {}]]);
        return Qx("Réduis : " + M(raw([[a, v], [b, ""], [c, v], [d, ""]])) + ".", L, "Termes en " + M(v) + " : " + M(a + (c < 0 ? " - " : " + ") + Math.abs(c) + " = " + (a + c)) + ". Nombres : " + M(b + (d < 0 ? " - " : " + ") + Math.abs(d) + " = " + (b + d)) + ". Donc " + M(tex(L)) + ".",
          { ...red, ctx: "lin", guide: [GX("Regroupe les termes en " + M(v) + " :", X1(a + c, { [v]: 1 }), M((a + c) + v) + ".", "reduced"), GX("Ajoute les nombres seuls :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d) + "*" + v, "On n'additionne pas des " + M(v) + " et des nombres seuls : ce ne sont pas des termes semblables.")] }); },
      () => { let a, b, c, d; do { a = nz(-8, 8); b = nz(-8, 8); c = nz(-8, 8); d = nz(-8, 8); } while (a + c === 0 || b + d === 0);
        const L = norm([[a + c, { a: 1 }], [b + d, { b: 1 }]]);
        return Qx("Réduis : " + M(raw([[a, "a"], [b, "b"], [c, "a"], [d, "b"]])) + ".", L, "Les " + M("a") + " ensemble, les " + M("b") + " ensemble : " + M(tex(L)) + ".",
          { ...red, ctx: "ab", guide: [GX("Regroupe les termes en " + M("a") + " :", X1(a + c, { a: 1 }), M((a + c) + "a") + ".", "reduced"), GX("Puis ceux en " + M("b") + " ; écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d) + "*a*b", "On ne mélange pas les " + M("a") + " et les " + M("b") + " : ce ne sont pas des termes semblables.")] }); },
      () => { let a, b, c, k; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); k = nz(-9, 9); } while (a + b + c === 0);
        const L = norm([[a + b + c, { x: 1 }], [k, {}]]);
        return Qx("Réduis : " + M(raw([[a, "x"], [k, ""], [b, "x"], [c, "x"]])) + ".", L, M((a + b + c) + "x") + " et le nombre " + M(k) + " : " + M(tex(L)) + ".",
          { ...red, ctx: "trois", guide: [GX("Combien de " + M("x") + " en tout ?", X1(a + b + c), M(a + " + " + par(b) + " + " + par(c) + " = " + (a + b + c)) + ".", "reduced"), GX("Écris le résultat réduit :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + k) + "*x", "Le nombre " + M(k) + " reste seul : il n'y a pas de " + M("x") + " avec lui.")] }); },
    ],
    2: [
      () => { let a, b, c, d, e; do { a = nz(-5, 5); b = nz(-7, 7); c = nz(-9, 9); d = nz(-5, 5); e = nz(-7, 7); } while (a + d === 0 || b + e === 0);
        const L = norm([[a + d, { x: 2 }], [b + e, { x: 1 }], [c, {}]]);
        return Qx("Réduis et ordonne : " + M(raw([[a, "x^2"], [b, "x"], [c, ""], [d, "x^2"], [e, "x"]])) + ".", L, "Les " + M("x^2") + " : " + M((a + d) + "x^2") + " ; les " + M("x") + " : " + M((b + e) + "x") + ". Donc " + M(tex(L)) + ".",
          { ...red, ctx: "x2", guide: [GX("Regroupe les termes en " + M("x^2") + " :", X1(a + d, { x: 2 }), M((a + d) + "x^2") + " (l'exposant ne change pas).", "reduced"), GX("Écris le tout, du plus grand exposant au plus petit :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + d) + "*x^4+" + (b + e) + "*x+" + c, "On n'additionne pas les exposants : " + M("x^2 + x^2 = 2x^2") + ", pas " + M("x^4") + "."), TX((a + d + b + e) + "*x^3+" + c, "Des " + M("x^2") + " et des " + M("x") + " ne sont pas semblables.")] }); },
      () => { let a, b, c, d; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); d = nz(-6, 6); } while (a + c === 0 || b + d === 0);
        const L = norm([[a + c, { x: 1, y: 1 }], [b + d, { x: 1 }]]);
        return Qx("Réduis : " + M(raw([[a, "xy"], [b, "x"], [c, "xy"], [d, "x"]])) + ".", L, "Les " + M("xy") + " ensemble, les " + M("x") + " ensemble : " + M(tex(L)) + ".",
          { ...red, ctx: "xy", guide: [GX("Regroupe les termes en " + M("xy") + " :", X1(a + c, { x: 1, y: 1 }), M((a + c) + "xy") + ".", "reduced"), GX("Écris le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d) + "*x*y", M("xy") + " et " + M("x") + " ne sont pas semblables : la partie littérale doit être exactement la même.")] }); },
      () => { let a, b, c, d, e; do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); e = nz(-9, 9); } while (a + c === 0 || b + d === 0 || a + c + b + d === 0);
        const L = norm([[a + c, { x: 2 }], [b + d, { x: 1 }], [e, {}]]);
        return Qx("Réduis et ordonne : " + M(raw([[b, "x"], [e, ""], [a, "x^2"], [d, "x"], [c, "x^2"]])) + ".", L, M(tex(L)) + " : les termes semblables ont la même lettre avec le même exposant.",
          { ...red, ctx: "desordre", guide: [GX("Les termes en " + M("x^2") + " :", X1(a + c, { x: 2 }), M((a + c) + "x^2") + ".", "reduced"), GX("Les termes en " + M("x") + " :", X1(b + d), M((b + d) + "x") + ".", "reduced"), GX("Résultat ordonné :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + c + b + d) + "*x^2+" + e, "Des " + M("x") + " et des " + M("x^2") + " ne s'additionnent pas.")] }); },
    ],
    3: [
      () => { const [p, q] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5]]), a = R.int(1, 3), b = R.int(1, 3), sgn = pk([1, -1]), n = a * q + sgn * b * p, d = p * q, g = gcd2(n, d), e = "(" + n / g + ")*x/" + d / g;
        if (n === 0 || gcd2(a, p) !== 1 || gcd2(b, q) !== 1) return RED[3][0]();
        return Qx("Réduis : " + M("\\frac{" + (a > 1 ? a : "") + "x}{" + p + "} " + (sgn > 0 ? "+" : "-") + " \\frac{" + (b > 1 ? b : "") + "x}{" + q + "}") + ".", e,
          "Dénominateur commun " + M(d) + " : " + M("\\frac{" + a * q + "x}{" + d + "} " + (sgn > 0 ? "+" : "-") + " \\frac{" + b * p + "x}{" + d + "} = " + (d / g === 1 ? n / g + "x" : "\\frac{" + n / g + "x}{" + d / g + "}")) + ".",
          { ...red, ctx: "fractions", guide: [GS("Quel est le dénominateur commun le plus petit ?", d / gcd2(p, q) === d ? d : d, M(d) + " (multiple de " + p + " et de " + q + ")."), GX("Additionne les numérateurs sur ce dénominateur et simplifie :", e, M("\\frac{" + n / g + "x}{" + d / g + "}") + ".", "reduced")],
            traps: [TX("(" + (a + sgn * b) + ")*x/" + (p + q), "On n'additionne pas les dénominateurs : on met d'abord les fractions au même dénominateur.")] }); },
      () => { let a, b, c, d, e; do { a = nz(-4, 4); b = nz(-4, 4); c = nz(-4, 4); d = nz(-4, 4); e = nz(-4, 4); } while (a + c + e === 0 || b + d === 0);
        const L = norm([[a + c + e, { a: 2, b: 1 }], [b + d, { a: 1, b: 2 }]]);
        return Qx("Réduis : " + M(raw([[a, "a^2b"], [b, "ab^2"], [c, "a^2b"], [d, "ab^2"], [e, "a^2b"]])) + ".", L, M("a^2b") + " et " + M("ab^2") + " ne sont pas semblables (exposants différents) : " + M(tex(L)) + ".",
          { ...red, ctx: "a2b", guide: [GX("Regroupe les termes en " + M("a^2b") + " :", X1(a + c + e, { a: 2, b: 1 }), M((a + c + e) + "a^2b") + ".", "reduced"), GX("Puis ceux en " + M("ab^2") + " ; écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d + e) + "*a^2*b", M("a^2b") + " et " + M("ab^2") + " ne sont pas semblables : les exposants ne sont pas les mêmes.")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 6), w = pk(["Max", "Lina", "Noé"]), L = norm([[b, { x: 2 }], [a + c, { x: 1 }]]);
        return Qx(w + " écrit : « " + M(a + "x + " + b + "x^2 = " + (a + b) + "x^3") + " ». Trouve l'erreur, puis réduis correctement " + M(a + "x + " + b + "x^2 + " + c + "x") + ".", L,
          "Erreur : " + M("x") + " et " + M("x^2") + " ne sont pas semblables ; on ne peut pas les additionner. " + M(a + "x + " + c + "x = " + (a + c) + "x") + ", donc " + M(tex(L)) + ".",
          { ...red, ctx: "erreur", guide: [GX("Quels termes sont semblables ? Additionne-les :", X1(a + c), M(a + "x + " + c + "x = " + (a + c) + "x") + ".", "reduced"), GX("Écris le résultat réduit et ordonné :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c) + "*x^3", "C'est l'erreur de " + w + " : " + M("x") + " et " + M("x^2") + " ne s'additionnent pas.")] }); },
      /* 25.11 (audit de niveau 11e, tools/niveau_11.md) : fractions à numérateur binôme, comme le dossier de calcul
         littéral de la 11LS (Ex. 17 : (x + 5)/3 − (x − 1)/2) ; le niveau 3 n'avait que x/4 + x/6. */
      () => { let p, q, a1, b1, a2, b2, op, L, cx, c0;
        do { [p, q] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [6, 4], [5, 10], [3, 6]]); a1 = pk([1, 1, 2, 3]); a2 = pk([1, 1, 2, 3]); b1 = nz(-7, 7); b2 = nz(-7, 7); op = pk([1, -1]);
          L = (p * q) / gcd2(p, q); cx = (L / p) * a1 + op * (L / q) * a2; c0 = (L / p) * b1 + op * (L / q) * b2; }
        while (cx === 0 || c0 === 0 || gcd2(gcd2(cx, c0), L) !== 1);
        const num = (a, b) => (a === 1 ? "" : a) + "x" + (b < 0 ? " - " + -b : " + " + b), N = norm([[cx, { x: 1 }], [c0, {}]]), e = "(" + plain(N) + ")/" + L;
        const k1 = L / p, k2 = L / q, mul = (k, a, b) => (k === 1 ? "(" + num(a, b) + ")" : k + "(" + num(a, b) + ")");
        const wrong = norm([[cx, { x: 1 }], [k1 * b1 + k2 * b2, {}]]);
        return Qx("Réduis et écris en une seule fraction : " + M("\\frac{" + num(a1, b1) + "}{" + p + "} " + (op > 0 ? "+" : "-") + " \\frac{" + num(a2, b2) + "}{" + q + "}") + ".", e,
          "Dénominateur commun " + M(L) + " : " + M("\\frac{" + mul(k1, a1, b1) + (op > 0 ? " + " : " - ") + mul(k2, a2, b2) + "}{" + L + "} = \\frac{" + tex(N) + "}{" + L + "}") + (op < 0 ? " (le « − » s'applique à tout le second numérateur)." : "."),
          { form: "onefrac", ctx: "fractions-binomes",
            guide: [GS("Quel est le plus petit dénominateur commun ?", L, M(L) + "."), GX("Numérateur, une fois les parenthèses enlevées et réduit :", N, M(tex(N)) + ".", "reduced"), GX("Résultat en une seule fraction :", e, M("\\frac{" + tex(N) + "}{" + L + "}") + ".", "onefrac")],
            traps: [...(op < 0 ? [TX("(" + plain(wrong) + ")/" + L, "Le « − » devant la seconde fraction change le signe de TOUT son numérateur : " + M("-" + mul(k2, a2, b2)) + ".")] : []),
              TX("(" + plain(norm([[a1 + op * a2, { x: 1 }], [b1 + op * b2, {}]])) + ")/" + (p + q), "On n'additionne pas les dénominateurs : on met d'abord les fractions au même dénominateur.")] }); },
    ],
  };

  // ===================== monomes : multiplier des monômes =====================
  const MON = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), v = pk(["x", "a", "y"]), L = X1(a * b, { [v]: 2 });
        return Qx("Calcule : " + M(a + v + " \\cdot " + b + v) + ".", L, M(a + " \\cdot " + b + " = " + a * b) + " et " + M(v + " \\cdot " + v + " = " + v + "^2") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "simple", guide: [GS("Multiplie les coefficients :", a * b, M(a + " \\cdot " + b + " = " + a * b) + "."), GX("Multiplie les parties littérales (" + M(v + " \\cdot " + v) + ") et écris le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a * b) + "*" + v, M(v + " \\cdot " + v + " = " + v + "^2") + ", pas " + M(v) + "."), TX((a + b) + "*" + v + "^2", "On multiplie les coefficients, on ne les additionne pas.")] }); },
      () => { const a = R.int(2, 7), b = R.int(3, 7), m = R.int(2, 4), n = R.int(2, 5), L = X1(a * b, { x: m + n });
        return Qx("Calcule : " + M(a + "x^{" + m + "} \\cdot " + b + "x^{" + n + "}") + ".", L, M(a * b) + " et " + M("x^{" + m + " + " + n + "} = x^{" + (m + n) + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "exposants", guide: [GS("Multiplie les coefficients :", a * b, M(a * b) + "."), GS("Exposant de " + M("x") + " : on additionne les exposants. Lequel ?", m + n, M(m + " + " + n + " = " + (m + n)) + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b + "*x^" + m * n, "On additionne les exposants (" + M("x^{" + m + "} \\cdot x^{" + n + "} = x^{" + (m + n) + "}") + "), on ne les multiplie pas."), TX((a + b) + "*x^" + (m + n), "On multiplie les coefficients : " + M(a + " \\cdot " + b + " = " + a * b) + ".")] }); },
      () => { const a = -R.int(2, 7), b = R.int(2, 7), L = X1(a * b, { y: 3 });
        return Qx("Calcule : " + M("(" + a + "y) \\cdot (" + b + "y^2)") + ".", L, "Signe : " + M("- \\cdot + = -") + ". " + M(Math.abs(a) * b) + " et " + M("y^3") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "signe", guide: [GS("Coefficient (avec son signe) :", a * b, M(a + " \\cdot " + b + " = " + a * b) + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(-a * b + "*y^3", "Attention au signe : un négatif fois un positif donne un négatif.")] }); },
    ],
    2: [
      () => { const a = -R.int(2, 5), b = R.int(2, 5), m = R.int(2, 3), n = R.int(2, 4), L = X1(a * b, { a: m + 1, b: n + 1 });
        return Qx("Calcule : " + M("(" + a + "a^{" + m + "}b) \\cdot (" + b + "ab^{" + n + "})") + ".", L, M(a * b) + " ; " + M("a^{" + m + "} \\cdot a = a^{" + (m + 1) + "}") + " ; " + M("b \\cdot b^{" + n + "} = b^{" + (n + 1) + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "deuxlettres", guide: [GS("Coefficient :", a * b, M(a * b) + "."), GS("Exposant de " + M("a") + " (" + M("a^{" + m + "} \\cdot a^1") + ") :", m + 1, M(m + 1) + "."), GX("Écris le monôme complet :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b + "*a^" + m + "*b^" + n, "Une lettre écrite sans exposant a l'exposant 1 : " + M("a^{" + m + "} \\cdot a = a^{" + (m + 1) + "}") + ".")] }); },
      () => { const a = R.int(2, 4), b = R.int(2, 4), c = -R.int(2, 3), L = X1(a * b * c, { x: 3, y: 4 });
        return Qx("Calcule : " + M("(" + a + "x^2y) \\cdot (" + b + "xy^2) \\cdot (" + c + "y)") + ".", L, M(a + " \\cdot " + b + " \\cdot (" + c + ") = " + a * b * c) + " ; " + M("x^{2+1} = x^3") + " ; " + M("y^{1+2+1} = y^4") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "trois", guide: [GS("Coefficient :", a * b * c, M(a * b * c) + "."), GS("Exposant de " + M("y") + " ?", 4, M("1 + 2 + 1 = 4") + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b * c + "*x^2*y^2", "Additionne les exposants de chaque lettre (une lettre seule = exposant 1).")] }); },
      () => { const k = pk([2, 3, 4, 5, -2, -3]), m = R.int(2, 4), L = X1(k * k, { x: 2 * m });
        return Qx("Calcule : " + M("(" + k + "x^{" + m + "})^2") + ".", L, M("(" + k + ")^2 = " + k * k) + " et " + M("(x^{" + m + "})^2 = x^{" + 2 * m + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "carre", guide: [GS("Coefficient : " + M("(" + k + ")^2") + " ?", k * k, M(k * k) + "."), GS("Exposant : " + M("x^{" + m + "} \\cdot x^{" + m + "}") + " ?", 2 * m, M(m + " + " + m + " = " + 2 * m) + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(k + "*x^" + 2 * m, "Le coefficient aussi est au carré : " + M("(" + k + ")^2 = " + k * k) + "."), TX(k * k + "*x^" + (m + 2), "On double l'exposant : " + M("(x^{" + m + "})^2 = x^{" + 2 * m + "}") + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 6), b = R.int(2, 6), m = R.int(1, 3), n = R.int(1, 3), L = X1(b, { x: n });
        return Qx("Trouve le monôme " + M("M") + " : " + M("M \\cdot " + a + "x^{" + m + "} = " + a * b + "x^{" + (m + n) + "}") + ".", L, "Coefficient : " + M(a * b + " : " + a + " = " + b) + ". Exposant : " + M((m + n) + " - " + m + " = " + n) + ". " + M("M = " + tex(L)) + ".",
          { ...red, ctx: "manquant", guide: [GS("Coefficient de " + M("M") + " (" + M(a + " \\cdot ? = " + a * b) + ") :", b, M(b) + "."), GS("Exposant de " + M("x") + " (" + M(m + " + ? = " + (m + n)) + ") :", n, M(n) + "."), GX("Écris " + M("M") + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b - a + "*x^" + n, "On cherche le facteur manquant : on divise les coefficients, on ne soustrait pas."), TX(b + "*x^" + (m + n), "L'exposant de " + M("M") + " est ce qui manque : " + M((m + n) + " - " + m + " = " + n) + "."), TX(a * b + "*x^" + n, "Le coefficient de " + M("M") + " fois " + a + " doit donner " + a * b + ".")] }); },
      () => { const k = R.int(2, 9), m = R.int(2, 4), L = X1(k, { x: m });
        return Qx("Trouve le monôme " + M("M") + ", de coefficient positif, tel que " + M("M^2 = " + k * k + "x^{" + 2 * m + "}") + ".", L, M("(" + k + "x^{" + m + "})^2 = " + k * k + "x^{" + 2 * m + "}") + ", donc " + M("M = " + tex(L)) + ".",
          { ...red, ctx: "racine", guide: [GS("Quel nombre positif au carré donne " + k * k + " ?", k, M(k) + "."), GS("Quel exposant, doublé, donne " + 2 * m + " ?", m, M(m) + "."), GX("Écris " + M("M") + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(k + "*x^" + (2 * m - 2), "Au carré, l'exposant est multiplié par 2 : il faut " + M(m) + ", la moitié de " + 2 * m + "."), TX(k + "*x^" + 2 * m, "Au carré, l'exposant double : celui de " + M("M") + " est la moitié de " + 2 * m + "."), TX(k * k + "*x^" + m, "Le coefficient de " + M("M") + " est le nombre dont le carré vaut " + k * k + ".")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 8), m = R.int(1, 2), n = R.int(1, 3), L = X1(b, { x: n });
        return Qx("Simplifie : " + M("\\frac{" + a * b + "x^{" + (m + n) + "}}{" + a + "x^{" + m + "}}") + ".", L, M(a * b + " : " + a + " = " + b) + " et " + M("x^{" + (m + n) + " - " + m + "} = x^{" + n + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "quotient", guide: [GS("Divise les coefficients :", b, M(b) + "."), GS("Exposant de " + M("x") + " (on soustrait) :", n, M((m + n) + " - " + m + " = " + n) + "."), GX("Écris le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b - a + "*x^" + n, "On divise les coefficients, on ne les soustrait pas."), TX(b + "*x^" + (m + n), "Pour diviser, on soustrait les exposants : " + M((m + n) + " - " + m + " = " + n) + "."), TX(a * b + "*x^" + n, "Divise aussi les coefficients : " + M(a * b + " \\div " + a + " = " + b) + ".")] }); },
    ],
  };

  // ===================== parenth : supprimer des parenthèses =====================
  const PAR = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 6), L = norm([[1 + b, { x: 1 }], [-a, {}]]);
        return Qx("Supprime les parenthèses et réduis : " + M("x - (" + a + " - " + b + "x)") + ".", L, "Le « − » devant la parenthèse change le signe de chaque terme : " + M("x - " + a + " + " + b + "x = " + tex(L)) + ".",
          { ...red, ctx: "moins", guide: [GX("Enlève la parenthèse en changeant les signes à l'intérieur (sans réduire) :", "x-" + a + "+" + b + "*x", M("x - " + a + " + " + b + "x") + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x-" + a + "-" + b + "*x", "Le « − » devant la parenthèse change le signe de <b>tous</b> les termes : " + M("-(-" + b + "x) = +" + b + "x") + ".")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 9), L = norm([[-b, { x: 1 }], [a - c, {}]]);
        if (a === c) return PAR[1][1]();
        return Qx("Supprime les parenthèses et réduis : " + M(a + " - (" + b + "x + " + c + ")") + ".", L, M(a + " - " + b + "x - " + c + " = " + tex(L)) + ".",
          { ...red, ctx: "moins2", guide: [GX("Enlève la parenthèse (le « − » change les signes) :", a + "-" + b + "*x-" + c, M(a + " - " + b + "x - " + c) + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a + "-" + b + "*x+" + c, "Tous les termes changent de signe : " + M("-(+" + c + ") = -" + c) + ".")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9), d = R.int(2, 9); if (a === c || b === d) return PAR[1][2]();
        const L = norm([[a - c, { x: 1 }], [-b + d, {}]]);
        return Qx("Supprime les parenthèses et réduis : " + M("(" + a + "x - " + b + ") - (" + c + "x - " + d + ")") + ".", L, M(a + "x - " + b + " - " + c + "x + " + d + " = " + tex(L)) + ".",
          { ...red, ctx: "deux", guide: [GX("Enlève les parenthèses :", a + "*x-" + b + "-" + c + "*x+" + d, M(a + "x - " + b + " - " + c + "x + " + d) + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a - c, { x: 1 }], [-b - d, {}]]), "Le deuxième terme de la parenthèse change aussi de signe : " + M("-(-" + d + ") = +" + d) + ".")] }); },
    ],
    2: [
      () => { const [a, b, c, d, e, f] = [R.int(2, 7), R.int(2, 7), R.int(2, 7), R.int(2, 7), R.int(2, 7), R.int(2, 7)], L = norm([[a + c - e, { a: 1 }], [-b - d + f, { b: 1 }]]);
        if (!L.length || L.length < 2) return PAR[2][0]();
        return Qx("Réduis : " + M("(" + a + "a - " + b + "b) + (" + c + "a - " + d + "b) - (" + e + "a - " + f + "b)") + ".", L, M(a + "a - " + b + "b + " + c + "a - " + d + "b - " + e + "a + " + f + "b = " + tex(L)) + ".",
          { ...red, ctx: "trois", guide: [GX("Enlève les parenthèses (attention à la dernière) :", a + "*a-" + b + "*b+" + c + "*a-" + d + "*b-" + e + "*a+" + f + "*b", M(a + "a - " + b + "b + " + c + "a - " + d + "b - " + e + "a + " + f + "b") + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a + c - e, { a: 1 }], [-b - d - f, { b: 1 }]]), "La dernière parenthèse est précédée d'un « − » : " + M("-(-" + f + "b) = +" + f + "b") + ".")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 9), c = R.int(2, 9), d = R.int(2, 6), L = norm([[-a + 1 + d, { x: 1 }], [b - c, {}]]);
        if (b === c || -a + 1 + d === 0) return PAR[2][1]();
        return Qx("Réduis : " + M("-(" + a + "x - " + b + ") - (" + c + " - x) + " + d + "x") + ".", L, M("-" + a + "x + " + b + " - " + c + " + x + " + d + "x = " + tex(L)) + ".",
          { ...red, ctx: "opposes", guide: [GX("Enlève les parenthèses :", "-" + a + "*x+" + b + "-" + c + "+x+" + d + "*x", M("-" + a + "x + " + b + " - " + c + " + x + " + d + "x") + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[-a - 1 + d, { x: 1 }], [b - c, {}]]), M("-(" + c + " - x) = -" + c + " + x") + " : le « − x » devient « + x ».")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 6), L = norm([[-a, { x: 1 }], [-b, { y: 1 }], [c, {}]]);
        return Qx("Écris l'opposé de " + M(a + "x + " + b + "y - " + c) + " sans parenthèses.", L, M("-(" + a + "x + " + b + "y - " + c + ") = " + tex(L)) + " : chaque terme change de signe.",
          { ...red, ctx: "oppose", guide: [GX("Change le signe de chaque terme :", L, M(tex(L)) + ".", "reduced")], traps: [TX("-" + a + "*x+" + b + "*y-" + c, "Tous les termes changent de signe, pas seulement le premier.")] }); },
    ],
    3: [
      () => { const a = R.int(3, 7), b = R.int(2, 5), c = R.int(2, 5), L = norm([[a - b - 1, { a: 1 }], [2, { b: 1 }]]);
        if (a - b - 1 === 0) return PAR[3][0]();
        return Qx("Réduis : " + M(a + "a - [" + b + "a - b + (a - b)]") + ".", L, "D'abord la parenthèse dans le crochet : " + M(b + "a - b + a - b = " + (b + 1) + "a - 2b") + ". Puis " + M(a + "a - (" + (b + 1) + "a - 2b) = " + tex(L)) + ".",
          { ...red, ctx: "crochets", guide: [GX("Réduis l'intérieur du crochet :", (b + 1) + "*a-2*b", M((b + 1) + "a - 2b") + ".", "reduced"), GX("Enlève le crochet (précédé d'un « − ») et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a - b - 1, { a: 1 }], [-2, { b: 1 }]]), "Le crochet est précédé d'un « − » : " + M("-(-2b) = +2b") + ".")] }); },
      () => { const k = R.int(2, 9), L = norm([[1, { x: 1 }], [-k, {}]]);
        return Qx("Simplifie : " + M("x - (x - (x - " + k + "))") + ".", L, "De l'intérieur vers l'extérieur : " + M("x - (x - x + " + k + ") = x - " + k) + ".",
          { ...red, ctx: "emboite", guide: [GX("Simplifie la parenthèse intérieure " + M("x - (x - " + k + ")") + " :", String(k), M("x - x + " + k + " = " + k) + "."), GX("Puis " + M("x - " + k) + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x+" + k, "Compte les « − » : la parenthèse intérieure donne " + M(k) + ", puis " + M("x - " + k) + ".")] }); },
      () => { const a = R.int(2, 5), b = R.int(2, 9), c = R.int(2, 5), d = R.int(2, 9), w = pk(["Sam", "Inès", "Yanis"]), L = norm([[a - c, { x: 1 }], [-b + d, {}]]);
        if (a === c || b === d) return PAR[3][2]();
        return Qx(w + " écrit : « " + M("(" + a + "x - " + b + ") - (" + c + "x - " + d + ") = " + a + "x - " + b + " - " + c + "x - " + d) + " ». Trouve l'erreur, puis donne le résultat réduit correct.", L,
          "Erreur : le « − » devant la parenthèse change aussi le signe de " + M("-" + d) + ". " + M(a + "x - " + b + " - " + c + "x + " + d + " = " + tex(L)) + ".",
          { ...red, ctx: "erreur", guide: [GX("Réécris sans parenthèses, correctement :", a + "*x-" + b + "-" + c + "*x+" + d, M(a + "x - " + b + " - " + c + "x + " + d) + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a - c, { x: 1 }], [-b - d, {}]]), "C'est le résultat de " + w + " : " + M("-(-" + d + ") = +" + d) + ".")] }); },
    ],
  };

  // ===================== distrib : développer =====================
  const DIS = {
    1: [
      () => { const k = R.int(2, 9), a = R.int(2, 7), b = nz(-9, 9), L = sc(k, lin(a, b));
        return Qx("Développe : " + M(k + "(" + tex(lin(a, b)) + ")") + ".", L, "On multiplie chaque terme par " + k + " : " + M(k + " \\cdot " + a + "x " + sg(b) + " " + k + " \\cdot " + Math.abs(b) + " = " + tex(L)) + ".",
          { ...red, ctx: "simple", fig: FIG.rectFig(10, 4, a + "x " + sg(b) + " " + Math.abs(b), String(k)), guide: [GX("Multiplie " + k + " par " + M(a + "x") + " :", X1(k * a), M(k * a + "x") + ".", "reduced"), GX("Multiplie " + k + " par " + M(b) + ", puis écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[k * a, { x: 1 }], [b, {}]]), "Il faut multiplier les deux termes par " + k + ", aussi " + M(b) + ".")] }); },
      () => { const k = -R.int(2, 9), a = R.int(2, 7), b = -R.int(2, 9), L = sc(k, lin(a, b));
        return Qx("Développe : " + M(k + "(" + tex(lin(a, b)) + ")") + ".", L, M(k + " \\cdot " + a + "x = " + k * a + "x") + " et " + M(k + " \\cdot (" + b + ") = " + k * b) + " : " + M(tex(L)) + ".",
          { ...red, ctx: "negatif", guide: [GX("Multiplie " + M(k) + " par " + M(a + "x") + " :", X1(k * a), M(k * a + "x") + ".", "reduced"), GX("Multiplie " + M(k) + " par " + M(b) + " (moins fois moins…), écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[k * a, { x: 1 }], [-k * b, {}]]), "Signe : " + M("(" + k + ") \\cdot (" + b + ") = +" + k * b) + " (moins fois moins donne plus).")] }); },
      () => { const a = R.int(2, 6), b = nz(-9, 9), v = pk(["x", "a"]), L = mulP(X1(1, { [v]: 1 }), lin(a, b, v));
        return Qx("Développe : " + M(v + "(" + tex(lin(a, b, v)) + ")") + ".", L, M(v + " \\cdot " + a + v + " = " + a + v + "^2") + " et " + M(v + " \\cdot " + b + " = " + b + v) + " : " + M(tex(L)) + ".",
          { ...red, ctx: "lettre", guide: [GX("Multiplie " + M(v) + " par " + M(a + v) + " :", X1(a, { [v]: 2 }), M(a + v + "^2") + ".", "reduced"), GX("Puis " + M(v) + " par " + M(b) + " ; écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a, { [v]: 1 }], [b, { [v]: 1 }]]), M(v + " \\cdot " + a + v + " = " + a + v + "^2") + " (deux " + M(v) + " multipliés).")] }); },
    ],
    2: [
      () => { const a = nz(-7, 7), b = nz(-7, 7); if (a + b === 0) return DIS[2][0](); const L = mulP(lin(1, a), lin(1, b));
        return Qx("Développe et réduis : " + M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ")") + ".", L, "Chaque terme de la première parenthèse multiplie chaque terme de la deuxième : " + M("x^2 " + sg(b) + " " + Math.abs(b) + "x " + sg(a) + " " + Math.abs(a) + "x " + sg(a * b) + " " + Math.abs(a * b) + " = " + tex(L)) + ".",
          { ...red, ctx: "double", guide: [GX("Développe sans réduire (4 produits) :", L, M("x^2 " + sg(b) + " " + Math.abs(b) + "x " + sg(a) + " " + Math.abs(a) + "x " + sg(a * b) + " " + Math.abs(a * b)) + "."), GX("Réduis les termes en " + M("x") + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[1, { x: 2 }], [a * b, {}]]), "Il manque les produits « croisés » : " + M("x \\cdot (" + b + ")") + " et " + M(a + " \\cdot x") + "."), TX(norm([[1, { x: 2 }], [a + b, { x: 1 }], [a + b, {}]]), "Le terme constant est un produit : " + M(a + " \\cdot (" + b + ") = " + a * b) + ".")] }); },
      () => { const a = R.int(2, 5), b = nz(-6, 6), c = R.int(2, 5), d = nz(-6, 6); const L = mulP(lin(a, b), lin(c, d)); if (L.length < 3) return DIS[2][1]();
        return Qx("Développe et réduis : " + M("(" + tex(lin(a, b)) + ")(" + tex(lin(c, d)) + ")") + ".", L, M(a * c + "x^2 " + sg(a * d) + " " + Math.abs(a * d) + "x " + sg(b * c) + " " + Math.abs(b * c) + "x " + sg(b * d) + " " + Math.abs(b * d) + " = " + tex(L)) + ".",
          { ...red, ctx: "double2", fig: FIG.rectFig(10, 6, tex(lin(c, d)).replace(/\\/g, ""), tex(lin(a, b)).replace(/\\/g, "")), guide: [GX("Premier terme × premier terme :", X1(a * c, { x: 2 }), M(a * c + "x^2") + ".", "reduced"), GX("Les deux produits croisés, réduits :", X1(a * d + b * c), M(a * d + b * c + "x") + ".", "reduced"), GX("Le tout, réduit :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a * c, { x: 2 }], [b * d, {}]]), "Il manque les produits croisés (" + M(a + "x \\cdot (" + d + ")") + " et " + M(b + " \\cdot " + c + "x") + ").")] }); },
      () => { const k = R.int(2, 4), a = R.int(2, 5), b = nz(-5, 5), c = nz(-6, 6), P2 = norm([[a, { x: 2 }], [b, { x: 1 }], [c, {}]]), L = mulP(X1(k), P2);
        return Qx("Développe : " + M(k + "x(" + tex(P2) + ")") + ".", L, "Chaque terme multiplié par " + M(k + "x") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "trinome", guide: [GX(M(k + "x \\cdot " + a + "x^2") + " = ?", X1(k * a, { x: 3 }), M(k * a + "x^3") + ".", "reduced"), GX("Écris le développement complet :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[k * a, { x: 3 }], [b, { x: 1 }], [c, {}]]), "Les trois termes sont multipliés par " + M(k + "x") + ".")] }); },
    ],
    3: [
      () => { const [a, b, c, d] = [nz(-5, 5), nz(-5, 5), nz(-5, 5), nz(-5, 5)], L = addP(mulP(lin(1, a), lin(1, b)), neg(mulP(lin(1, c), lin(1, d)))); if (L.length < 2) return DIS[3][0]();
        return Qx("Développe et réduis : " + M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ") - (" + tex(lin(1, c)) + ")(" + tex(lin(1, d)) + ")") + ".", L, "Premier produit : " + M(tex(mulP(lin(1, a), lin(1, b))))+ ". Deuxième : " + M(tex(mulP(lin(1, c), lin(1, d)))) + ", à soustraire en entier (parenthèses !). Résultat : " + M(tex(L)) + ".",
          { ...red, ctx: "difference", guide: [GX("Développe le premier produit :", mulP(lin(1, a), lin(1, b)), M(tex(mulP(lin(1, a), lin(1, b)))) + ".", "reduced"), GX("Développe le deuxième :", mulP(lin(1, c), lin(1, d)), M(tex(mulP(lin(1, c), lin(1, d)))) + ".", "reduced"), GX("Soustrais le deuxième en entier et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(addP(mulP(lin(1, a), lin(1, b)), neg(mulP(lin(1, c), lin(1, d))).map(([c0, v], i) => i === 0 ? [c0, v] : [-c0, v])), "Le « − » s'applique à tout le deuxième produit : mets-le entre parenthèses avant de changer les signes.")] }); },
      () => { const a = R.int(2, 4), k = R.int(2, 5), m = R.int(2, 6), L = addP(mulP(X1(1), lin(a, -1)), neg(sc(k, norm([[1, { x: 2 }], [m, {}]]))));
        return Qx("Développe et réduis : " + M("x(" + a + "x - 1) - " + k + "(x^2 + " + m + ")") + ".", L, M(a + "x^2 - x - " + k + "x^2 - " + k * m + " = " + tex(L)) + ".",
          { ...red, ctx: "deuxdev", guide: [GX("Développe " + M("x(" + a + "x - 1)") + " :", mulP(X1(1), lin(a, -1)), M(a + "x^2 - x") + ".", "reduced"), GX("Développe " + M("-" + k + "(x^2 + " + m + ")") + " :", neg(sc(k, norm([[1, { x: 2 }], [m, {}]]))), M("-" + k + "x^2 - " + k * m) + ".", "reduced"), GX("Réduis le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(addP(mulP(X1(1), lin(a, -1)), neg(X1(k, { x: 2 })), [[m, {}]]), "Le " + M("-" + k) + " multiplie aussi " + M(m) + " : " + M("-" + k + " \\cdot " + m + " = -" + k * m) + ".")] }); },
      () => { const a = R.int(1, 3), b = nz(-4, 4), c = R.int(1, 3), d = nz(-4, 4), e = nz(-5, 5), P2 = norm([[c, { x: 2 }], [d, { x: 1 }], [e, {}]]), L = mulP(lin(a, b), P2);
        return Qx("Développe et réduis : " + M("(" + tex(lin(a, b)) + ")(" + tex(P2) + ")") + ".", L, "6 produits, puis on réduit : " + M(tex(L)) + ".",
          { ...red, ctx: "degre3", guide: [GX("Multiplie " + M(tex(lin(a, b).slice(0, 1))) + " par chaque terme de la deuxième parenthèse :", mulP(lin(a, 0), P2), M(tex(mulP(lin(a, 0), P2))) + ".", "reduced"), GX("Puis " + M(b) + " par chaque terme ; additionne et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a * c, { x: 3 }], [b * e, {}]]), "Chaque terme de la première parenthèse multiplie chaque terme de la deuxième : 6 produits.")] }); },
    ],
  };

  // ===================== idrem : identités remarquables =====================
  const IDR = {
    1: [
      () => { const a = R.int(2, 9), L = mulP(lin(1, a), lin(1, a));
        return Qx("Développe : " + M("(x + " + a + ")^2") + ".", L, M("(a + b)^2 = a^2 + 2ab + b^2") + " : " + M("x^2 + 2 \\cdot x \\cdot " + a + " + " + a + "^2 = " + tex(L)) + ".",
          { ...red, ctx: "plus", guide: [GX("Carré du premier terme :", X1(1, { x: 2 }), M("x^2") + ".", "reduced"), GX("Double produit " + M("2 \\cdot x \\cdot " + a) + " :", X1(2 * a), M(2 * a + "x") + ".", "reduced"), GX("Écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x^2+" + a * a, "Il manque le double produit " + M("2 \\cdot x \\cdot " + a + " = " + 2 * a + "x") + " : " + M("(x + " + a + ")^2 = (x + " + a + ")(x + " + a + ")") + "."), TX("x^2+" + a + "*x+" + a * a, "Le terme du milieu est le <b>double</b> produit : " + M(2 * a + "x") + ".")] }); },
      () => { const a = R.int(2, 9), L = mulP(lin(1, -a), lin(1, -a));
        return Qx("Développe : " + M("(x - " + a + ")^2") + ".", L, M("(a - b)^2 = a^2 - 2ab + b^2") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "moins", guide: [GX("Double produit (avec son signe) :", X1(-2 * a), M("-" + 2 * a + "x") + ".", "reduced"), GX("Écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x^2-" + a * a, "Il manque le double produit, et " + M("(-" + a + ")^2 = +" + a * a) + "."), TX("x^2-" + 2 * a + "*x-" + a * a, "Le dernier terme est un carré : " + M("(-" + a + ")^2 = +" + a * a) + ".")] }); },
      () => { const a = R.int(2, 9), L = norm([[1, { x: 2 }], [-a * a, {}]]);
        return Qx("Développe : " + M("(x + " + a + ")(x - " + a + ")") + ".", L, M("(a + b)(a - b) = a^2 - b^2") + " : " + M(tex(L)) + " (les produits croisés s'annulent).",
          { ...red, ctx: "diff", guide: [GX("Développe et réduis (les termes en " + M("x") + " s'annulent) :", L, M("x^2 - " + a + "x + " + a + "x - " + a * a + " = " + tex(L)) + ".", "reduced")],
            traps: [TX("x^2+" + a * a, M(a + " \\cdot (-" + a + ") = -" + a * a) + " : le résultat est une différence de carrés.")] }); },
    ],
    2: [
      () => { const b = R.int(2, 5), a = R.int(1, 7), L = mulP(lin(b, a), lin(b, a));
        return Qx("Développe : " + M("(" + b + "x + " + a + ")^2") + ".", L, M("(" + b + "x)^2 + 2 \\cdot " + b + "x \\cdot " + a + " + " + a + "^2 = " + tex(L)) + ".",
          { ...red, ctx: "coef", guide: [GX("Carré du premier terme " + M("(" + b + "x)^2") + " :", X1(b * b, { x: 2 }), M(b * b + "x^2") + " (le coefficient aussi est au carré).", "reduced"), GX("Double produit :", X1(2 * a * b), M(2 * a * b + "x") + ".", "reduced"), GX("Le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[b, { x: 2 }], [2 * a * b, { x: 1 }], [a * a, {}]]), M("(" + b + "x)^2 = " + b * b + "x^2") + " : le coefficient est aussi au carré."), TX(norm([[b * b, { x: 2 }], [a * a, {}]]), "Il manque le double produit.")] }); },
      () => { const a = R.int(1, 4), b = R.int(2, 5), L = mulP(norm([[a, { a: 1 }], [-b, { b: 1 }]]), norm([[a, { a: 1 }], [-b, { b: 1 }]]));
        return Qx("Développe : " + M("(" + (a > 1 ? a : "") + "a - " + b + "b)^2") + ".", L, M(tex(L)) + ".",
          { ...red, ctx: "deuxlettres", guide: [GX("Double produit " + M("2 \\cdot " + (a > 1 ? a : "") + "a \\cdot " + b + "b") + " (avec le signe) :", X1(-2 * a * b, { a: 1, b: 1 }), M("-" + 2 * a * b + "ab") + ".", "reduced"), GX("Le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a * a, { a: 2 }], [-b * b, { b: 2 }]]), "Ce n'est pas une différence de carrés : " + M("(a - b)^2 = a^2 - 2ab + b^2") + ".")] }); },
      () => { const b = R.int(2, 6), a = R.int(1, 9), L = norm([[b * b, { x: 2 }], [-a * a, {}]]);
        return Qx("Développe : " + M("(" + b + "x - " + a + ")(" + b + "x + " + a + ")") + ".", L, M("(" + b + "x)^2 - " + a + "^2 = " + tex(L)) + ".",
          { ...red, ctx: "diff2", guide: [GX(M("(" + b + "x)^2") + " = ?", X1(b * b, { x: 2 }), M(b * b + "x^2") + ".", "reduced"), GX("Le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[b, { x: 2 }], [-a * a, {}]]), M("(" + b + "x)^2 = " + b * b + "x^2") + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 7), b = R.int(2, 7), L = addP(mulP(lin(1, a), lin(1, a)), neg(mulP(lin(1, -b), lin(1, -b))));
        return Qx("Développe et réduis : " + M("(x + " + a + ")^2 - (x - " + b + ")^2") + ".", L, M("x^2 + " + 2 * a + "x + " + a * a + " - (x^2 - " + 2 * b + "x + " + b * b + ") = " + tex(L)) + ".",
          { ...red, ctx: "diffcarres", guide: [GX("Développe " + M("(x - " + b + ")^2") + " :", mulP(lin(1, -b), lin(1, -b)), M(tex(mulP(lin(1, -b), lin(1, -b)))) + ".", "reduced"), GX("Soustrais-le en entier et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(addP(mulP(lin(1, a), lin(1, a)), [[-1, { x: 2 }], [-2 * b, { x: 1 }], [b * b, {}]]), "Le « − » change tous les signes de " + M("(x - " + b + ")^2") + " développé.")] }); },
      () => { const a = R.int(2, 9), c = pk([1, 2, 3]);
        return Qn("Complète : " + M("(x + \\ldots)^2 = x^2 + " + 2 * a + "x + \\ldots") + ". Quel nombre manque dans la parenthèse ?", a, "Le double produit " + M("2 \\cdot x \\cdot ? = " + 2 * a + "x") + " donne " + M(a) + " ; le dernier terme est " + M(a + "^2 = " + a * a) + ".",
          { ctx: "completer", guide: [GS("Double produit : " + M("2 \\cdot ? = " + 2 * a) + ". Le nombre ?", a, M(a) + ".")], traps: [{ v: 2 * a, m: "Le terme du milieu est le <b>double</b> produit : divise " + 2 * a + " par 2." }, { v: a * a, m: "C'est le dernier terme (" + M(a + "^2") + "), pas le nombre de la parenthèse." }] }); },
      () => { const n = pk([31, 41, 51, 61, 71, 99, 101, 49, 59]), v = n * n, r = Math.round(n / 10) * 10, d = n - r;
        return Qn("Calcule mentalement " + M(n + "^2") + " avec une identité remarquable.", v, M("(" + r + (d < 0 ? " - " : " + ") + Math.abs(d) + ")^2 = " + r * r + (d < 0 ? " - " : " + ") + 2 * r * Math.abs(d) + " + " + d * d + " = " + v) + ".",
          { ctx: "mental", guide: [GS("Écris " + n + " comme " + r + (d < 0 ? " − " : " + ") + Math.abs(d) + ". Calcule " + M(r + "^2") + ".", r * r, M(r * r) + "."), GS("Double produit " + M("2 \\cdot " + r + " \\cdot " + Math.abs(d)) + " :", 2 * r * Math.abs(d), M(2 * r * Math.abs(d)) + "."), GS("Résultat :", v, M(r * r + (d < 0 ? " - " : " + ") + 2 * r * Math.abs(d) + " + " + d * d + " = " + v) + ".")],
            traps: [{ v: r * r + d * d, m: "Il manque le double produit " + M("2 \\cdot " + r + " \\cdot " + Math.abs(d)) + "." }] }); },
      /* 25.11 (audit de niveau 11e, tools/niveau_11.md) : 3e identité avec des racines, comme le dossier de la 11LS
         (Ex. 20 : (5√3 − 4√2)(5√3 + 4√2)) et l'EVACOM (racines et calcul littéral). */
      () => { let a, b, m, n, v; do { a = R.int(2, 6); b = R.int(2, 5); [m, n] = pk([[3, 2], [2, 3], [5, 2], [5, 3], [7, 2], [7, 3], [6, 5], [3, 5], [2, 7]]); v = a * a * m - b * b * n; } while (Math.abs(v) < 2);
        const A = a + "\\sqrt{" + m + "}", B = b + "\\sqrt{" + n + "}";
        return Qn("Calcule avec une identité remarquable : " + M("(" + A + " - " + B + ")(" + A + " + " + B + ")") + ".", v,
          M("(" + A + ")^2 - (" + B + ")^2 = " + a * a + " \\cdot " + m + " - " + b * b + " \\cdot " + n + " = " + a * a * m + " - " + b * b * n + " = " + v) + ".",
          { ctx: "racines", guide: [GS("C'est " + M("(u - v)(u + v) = u^2 - v^2") + ". Calcule " + M("(" + A + ")^2") + " :", a * a * m, M(a + "^2 \\cdot " + m + " = " + a * a * m) + "."), GS("Calcule " + M("(" + B + ")^2") + " :", b * b * n, M(b + "^2 \\cdot " + n + " = " + b * b * n) + "."), GS("Résultat :", v, M(a * a * m + " - " + b * b * n + " = " + v) + ".")],
            traps: [{ v: a * a * m + b * b * n, m: "C'est une <b>différence</b> de carrés : " + M("u^2 - v^2") + "." }, { v: a * m - b * n, m: M("(" + A + ")^2 = " + a + "^2 \\cdot (\\sqrt{" + m + "})^2") + " : le " + a + " est aussi élevé au carré." }].filter((t) => t.v !== v) }); },
    ],
  };

  // ===================== factor : factoriser =====================
  const prod = { form: "product" };
  const FAC = {
    1: [
      () => { const g = R.int(2, 7), a = R.int(2, 7), b = R.int(1, 9) * pk([1, -1]); if (gcd2(a, Math.abs(b)) !== 1) return FAC[1][0]();
        const e = g + "*(" + a + "*x" + (b < 0 ? "" : "+") + b + ")";
        return Qx("Factorise (mise en évidence) : " + M(g * a + "x " + sg(b) + " " + Math.abs(g * b)) + ".", e, "Le plus grand facteur commun est " + M(g) + " : " + M(g + "(" + a + "x " + sg(b) + " " + Math.abs(b) + ")") + ".",
          { ...prod, ctx: "nombre", guide: [GS("Plus grand facteur commun de " + M(g * a) + " et " + M(Math.abs(g * b)) + " ?", g, M(g) + "."), GX("Écris " + M(g + "(\\ldots)") + " :", e, M(g + "(" + a + "x " + sg(b) + " " + Math.abs(b) + ")") + ". Vérifie en développant.", "product")],
            traps: [TX(g + "*(" + a + "*x" + (b < 0 ? "" : "+") + g * b + ")", "Divise <b>chaque</b> terme par " + M(g) + " : " + M(Math.abs(g * b) + " \\div " + g + " = " + Math.abs(b)) + "."), TX(g + "*(" + g * a + "*x" + (b < 0 ? "" : "+") + b + ")", "Divise <b>chaque</b> terme par " + M(g) + " : " + M(g * a + "x \\div " + g + " = " + a + "x") + ".")] }); },
      () => { const a = R.int(2, 6), b = nz(-9, 9), g = gcd2(a, Math.abs(b)), e = g + "*x*(" + a / g + "*x" + (b < 0 ? "" : "+") + b / g + ")";
        return Qx("Factorise au maximum : " + M(tex(norm([[a, { x: 2 }], [b, { x: 1 }]]))) + ".", e, "Facteur commun " + M((g > 1 ? g : "") + "x") + " : " + M((g > 1 ? g : "") + "x(" + tex(lin(a / g, b / g)) + ")") + ".",
          { ...prod, ctx: "lettre", guide: [GX("Quel est le facteur commun (nombre et lettre) ?", (g > 1 ? g + "*" : "") + "x", M((g > 1 ? g : "") + "x") + "."), GX("Écris la factorisation :", e, M((g > 1 ? g : "") + "x(" + tex(lin(a / g, b / g)) + ")") + ".", "product")],
            traps: [TX((g > 1 ? g + "*" : "") + "x*(" + a / g + "*x^2" + (b < 0 ? "" : "+") + b / g + ")", "Mettre " + M("x") + " en évidence retire un " + M("x") + " de chaque terme : " + M("x^2") + " devient " + M("x") + "."), TX((g > 1 ? g + "*" : "") + "x*(" + a / g + "*x" + (b < 0 ? "" : "+") + b / g + "*x)", "Le " + M("x") + " mis en évidence ne reste plus dans le deuxième terme.")] }); },
      () => { const a = R.int(2, 5), c = nz(-4, 4), b = nz(-6, 6), e = "(" + a + "*x" + (b < 0 ? "" : "+") + b + ")*(" + c + "*x-1)";
        if (Math.abs(c) === 1) return FAC[1][2]();
        return Qx("Factorise : " + M(c + "x(" + tex(lin(a, b)) + ") - (" + tex(lin(a, b)) + ")") + ".", e, "Le facteur commun est la parenthèse " + M("(" + tex(lin(a, b)) + ")") + " : " + M("(" + tex(lin(a, b)) + ")(" + c + "x - 1)") + ".",
          { ...prod, ctx: "parenthese", guide: [GX("Quel est le facteur commun ?", "(" + a + "*x" + (b < 0 ? "" : "+") + b + ")", "La parenthèse " + M("(" + tex(lin(a, b)) + ")") + "."), GX("Que reste-t-il de chaque terme ? Écris le produit :", e, M("(" + tex(lin(a, b)) + ")(" + c + "x - 1)") + " : il reste " + M(c + "x") + " et " + M("-1") + ".", "product")],
            traps: [TX("(" + a + "*x" + (b < 0 ? "" : "+") + b + ")*" + c + "*x", "Le deuxième terme est " + M("-1 \\cdot (" + tex(lin(a, b)) + ")") + " : il reste " + M("-1") + ", pas rien.")] }); },
    ],
    2: [
      () => { const a = R.int(2, 12), e = "(x-" + a + ")*(x+" + a + ")";
        return Qx("Factorise : " + M("x^2 - " + a * a) + ".", e, M("a^2 - b^2 = (a - b)(a + b)") + " : " + M("(x - " + a + ")(x + " + a + ")") + ".",
          { ...prod, ctx: "diffcarres", guide: [GS(M(a * a) + " est le carré de quel nombre ?", a, M(a + "^2 = " + a * a) + "."), GX("Applique " + M("a^2 - b^2 = (a - b)(a + b)") + " :", e, M("(x - " + a + ")(x + " + a + ")") + ".", "product")],
            traps: [TX("(x-" + a + ")^2", M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + " : ce n'est pas la même chose.")] }); },
      () => { const a = R.int(2, 9), s = pk([1, -1]), e = "(x" + (s > 0 ? "+" : "-") + a + ")^2";
        return Qx("Factorise : " + M("x^2 " + sg(s) + " " + 2 * a + "x + " + a * a) + ".", e, "C'est un carré parfait : " + M("x^2 " + sg(s) + " 2 \\cdot x \\cdot " + a + " + " + a + "^2 = (x " + sg(s) + " " + a + ")^2") + ".",
          { ...prod, ctx: "carre", guide: [GS(M(a * a) + " est le carré de :", a, M(a) + "."), GX("Vérifie le double produit (" + M(2 * a + "x") + ") et écris le carré :", e, M("(x " + sg(s) + " " + a + ")^2") + ".", "product")],
            traps: [TX("(x-" + a + ")*(x+" + a + ")", "Ça, c'est " + M("x^2 - " + a * a) + ". Ici il y a un double produit : c'est un carré.")] }); },
      () => { const b = R.int(2, 6), a = R.int(1, 9), e = "(" + b + "*x-" + a + ")*(" + b + "*x+" + a + ")";
        if (gcd2(a, b) !== 1) return FAC[2][2]();
        return Qx("Factorise : " + M(b * b + "x^2 - " + a * a) + ".", e, M("(" + b + "x)^2 - " + a + "^2 = (" + b + "x - " + a + ")(" + b + "x + " + a + ")") + ".",
          { ...prod, ctx: "diffcarres2", guide: [GX(M(b * b + "x^2") + " est le carré de :", b + "*x", M(b + "x") + "."), GX("Écris la factorisation :", e, M("(" + b + "x - " + a + ")(" + b + "x + " + a + ")") + ".", "product")],
            traps: [TX("(" + b * b + "*x-" + a + ")*(x+" + a + ")", M(b * b + "x^2 = (" + b + "x)^2") + " : les deux facteurs commencent par " + M(b + "x") + ".")] }); },
    ],
    3: [
      () => { let a, b; do { a = nz(-7, 7); b = nz(-7, 7); } while (a === b || a + b === 0 || a === -b);
        const e = "(x" + (a < 0 ? "" : "+") + a + ")*(x" + (b < 0 ? "" : "+") + b + ")";
        return Qx("Factorise : " + M(tex(norm([[1, { x: 2 }], [a + b, { x: 1 }], [a * b, {}]]))) + ".", e, "On cherche deux nombres de produit " + M(a * b) + " et de somme " + M(a + b) + " : " + M(a) + " et " + M(b) + ". Donc " + M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ")") + ".",
          { ...prod, ctx: "trinome", guide: [GS("Deux nombres de produit " + M(a * b) + " et de somme " + M(a + b) + " : donne le plus petit.", Math.min(a, b), M(a) + " et " + M(b) + " : " + M(a + " \\cdot " + par(b) + " = " + a * b) + ", " + M(a + " + " + par(b) + " = " + (a + b)) + "."), GX("Écris la factorisation :", e, M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ")") + ".", "product")],
            traps: [TX("(x" + (-a < 0 ? "" : "+") + -a + ")*(x" + (-b < 0 ? "" : "+") + -b + ")", "Vérifie les signes en développant : la somme doit être " + M(a + b) + ".")] }); },
      () => { const k = R.int(2, 5), a = R.int(2, 7), e = k + "*(x-" + a + ")*(x+" + a + ")";
        return Qx("Factorise au maximum : " + M(k + "x^2 - " + k * a * a) + ".", e, "Mise en évidence de " + M(k) + " : " + M(k + "(x^2 - " + a * a + ")") + ", puis différence de carrés : " + M(k + "(x - " + a + ")(x + " + a + ")") + ".",
          { ...prod, minFactors: 2, ctx: "maximal", guide: [GX("Mets " + M(k) + " en évidence :", k + "*(x^2-" + a * a + ")", M(k + "(x^2 - " + a * a + ")") + ".", "product"), GX("Factorise encore la parenthèse :", e, M(k + "(x - " + a + ")(x + " + a + ")") + ".", "product")],
            traps: [TX(k + "*(x-" + a + ")^2", M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + " : ce n'est pas " + M("x^2 - " + a * a) + "."), TX("(x-" + a + ")*(x+" + a + ")", "Il manque le facteur " + M(k) + " mis en évidence au début.")] }); },
      () => { const a = R.int(2, 7), k = pk([1, 2, 3]), e = (k > 1 ? k + "*" : "") + "x*(x-" + a + ")*(x+" + a + ")";
        return Qx("Factorise au maximum : " + M((k > 1 ? k : "") + "x^3 - " + k * a * a + "x") + ".", e, "Facteur commun " + M((k > 1 ? k : "") + "x") + " : " + M((k > 1 ? k : "") + "x(x^2 - " + a * a + ") = " + (k > 1 ? k : "") + "x(x - " + a + ")(x + " + a + ")") + ".",
          { ...prod, minFactors: 2, ctx: "cube", guide: [GX("Mets le facteur commun en évidence :", (k > 1 ? k + "*" : "") + "x*(x^2-" + a * a + ")", M((k > 1 ? k : "") + "x(x^2 - " + a * a + ")") + ".", "product"), GX("Factorise la parenthèse :", e, M((k > 1 ? k : "") + "x(x - " + a + ")(x + " + a + ")") + ".", "product")],
            traps: [TX((k > 1 ? k + "*" : "") + "x*(x-" + a + ")^2", M("x^2 - " + a * a) + " est une différence de carrés : " + M("(x - " + a + ")(x + " + a + ")") + ", pas un carré."), TX((k > 1 ? k + "*" : "") + "(x-" + a + ")*(x+" + a + ")", "Il manque le facteur " + M("x") + " mis en évidence.")] }); },
    ],
  };

  // ===================== Défis : problèmes en plusieurs étapes (réponses numériques) =====================
  const Pb = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const PROBS = {
    litelab: [() => { const k = R.int(2, 6), x = R.int(3, 8), P = 4 * k + 2 * k; const per = 4 * R.int(k + 2, 12) + 2 * k, xs = (per - 2 * k) / 4;
      return Pb("Un rectangle a une largeur " + M("x") + " cm et une longueur " + M("x + " + k) + " cm.", [["a) Périmètre pour x = " + x + " (cm)", 4 * x + 2 * k], ["b) Aire pour x = " + x + " (cm²)", x * (x + k)], ["c) Valeur de x pour un périmètre de " + per + " cm", xs]],
        ["Périmètre : 4x + " + 2 * k + " ; aire : x(x + " + k + ").", "c) Résous 4x + " + 2 * k + " = " + per + "."], "a) " + M("4 \\cdot " + x + " + " + 2 * k + " = " + (4 * x + 2 * k)) + " cm. b) " + M(x + " \\cdot " + (x + k) + " = " + x * (x + k)) + " cm². c) Périmètre " + M("2x + 2(x + " + k + ") = 4x + " + 2 * k) + ", donc " + M("4x + " + 2 * k + " = " + per) + " ; on enlève " + M(2 * k) + " des deux côtés : " + M("4x = " + (per - 2 * k)) + " ; on divise par 4 : " + M("x = " + xs) + "."); /* 24.11 : étapes détaillées (retour testeur) */ }],
    valnum: [() => { const v1 = pk([40, 50, 60]), v2 = 2 * v1;
      return Pb("La distance de freinage d'une voiture (en m) est environ " + M("d = \\frac{v^2}{200}") + ", avec " + M("v") + " en km/h.", [["a) d pour v = " + v1 + " km/h (m)", v1 * v1 / 200], ["b) d pour v = " + v2 + " km/h (m)", v2 * v2 / 200], ["c) Si la vitesse double, la distance est multipliée par…", 4]],
        ["Remplace v par sa valeur, calcule le carré, divise par 200.", "Compare les deux distances."], "a) " + M("\\frac{" + v1 * v1 + "}{200} = " + dec(v1 * v1 / 200)) + " m. b) " + M(dec(v2 * v2 / 200)) + " m. c) 4 : la distance dépend du carré de la vitesse."); }],
    reduire: [() => { const x = R.int(4, 8), P = 6 * x - 1, xs = R.int(5, 9);
      return Pb("Un triangle a des côtés de longueurs " + M("x") + ", " + M("2x + 1") + " et " + M("3x - 2") + " (en cm).", [["a) Coefficient de x dans le périmètre réduit", 6], ["b) Périmètre pour x = " + x + " (cm)", P], ["c) Valeur de x pour un périmètre de " + (6 * xs - 1) + " cm", xs]],
        ["Additionne les trois côtés et réduis : 6x − 1.", "c) Résous 6x − 1 = " + (6 * xs - 1) + "."], "a) " + M("x + 2x + 1 + 3x - 2 = 6x - 1") + " : 6. b) " + M("6 \\cdot " + x + " - 1 = " + P) + " cm. c) " + M("6x = " + 6 * xs) + ", " + M("x = " + xs) + "."); }],
    monomes: [() => { const x = R.int(2, 4);
      return Pb("Un cube a des arêtes de longueur " + M("3x") + " cm.", [["a) Coefficient du volume écrit sous forme de monôme", 27], ["b) Volume pour x = " + x + " (cm³)", 27 * x ** 3], ["c) Coefficient de l'aire totale (6 faces)", 54]],
        ["Volume : (3x)³ = 27x³.", "Une face : (3x)² = 9x² ; six faces : 54x²."], "a) " + M("(3x)^3 = 27x^3") + ". b) " + M("27 \\cdot " + x + "^3 = " + 27 * x ** 3) + " cm³. c) " + M("6 \\cdot 9x^2 = 54x^2") + "."); }],
    parenth: [() => { const a = R.int(4, 7), b = R.int(2, 9), c = R.int(2, 9), x = R.int(3, 8), k = a - 2 - 1, cst = b - c;
      if (cst === 0) return PROBS.parenth[0]();
      return Pb("On considère " + M("E = " + a + "x - (2x - " + b + ") - (x + " + c + ")") + ".", [["a) Coefficient de x dans E réduite", k], ["b) Terme constant de E réduite", cst], ["c) Valeur de E pour x = " + x, k * x + cst]],
        ["Chaque « − » devant une parenthèse change les signes à l'intérieur.", "E = " + k + "x " + (cst < 0 ? "− " + -cst : "+ " + cst) + "."], "a) " + M(a + "x - 2x + " + b + " - x - " + c + " = " + tex(lin(k, cst))) + " : " + k + ". b) " + cst + ". c) " + M(k + " \\cdot " + x + (cst < 0 ? " - " + -cst : " + " + cst) + " = " + (k * x + cst)) + "."); }],
    distrib: [() => { const a = R.int(2, 6), b = R.int(1, 5), x = R.int(2, 6);
      return Pb("Dans un rectangle de " + M("(x + " + a + ")") + " sur " + M("(x + " + b + ")") + ", on retire un carré de côté " + M("x") + ".", [["a) Coefficient de x dans l'aire restante", a + b], ["b) Terme constant", a * b], ["c) Aire restante pour x = " + x, (a + b) * x + a * b]],
        ["Aire du rectangle : (x + " + a + ")(x + " + b + ") ; retire x².", "Il reste " + (a + b) + "x + " + a * b + "."], "a) " + M("x^2 + " + (a + b) + "x + " + a * b + " - x^2") + " : " + (a + b) + ". b) " + a * b + ". c) " + M((a + b) + " \\cdot " + x + " + " + a * b + " = " + ((a + b) * x + a * b)) + "."); }],
    idrem: [() => { const n = R.int(10, 40), m = R.int(20, 60);
      return Pb("On remarque que " + M("(n + 1)^2 - n^2 = 2n + 1") + ".", [["a) Calcule (n + 1)² − n² pour n = " + n, 2 * n + 1], ["b) Calcule mentalement 101² − 100²", 201], ["c) Pour quel n a-t-on (n + 1)² − n² = " + (2 * m + 1) + " ?", m]],
        ["Développe (n + 1)² = n² + 2n + 1.", "c) Résous 2n + 1 = " + (2 * m + 1) + "."], "a) " + M("2 \\cdot " + n + " + 1 = " + (2 * n + 1)) + ". b) " + M("2 \\cdot 100 + 1 = 201") + ". c) " + M("n = " + m) + "."); }],
    factor: [() => { const a = pk([53, 54, 56, 61]), b = 100 - a, c = pk([98, 97, 102, 103]), d = 200 - c;
      return Pb("Calcul mental avec les identités (sans calculatrice).", [["a) " + a + "² − " + b + "²", a * a - b * b], ["b) " + c + " · " + d, c * d], ["c) 29²", 841]],
        ["a² − b² = (a − b)(a + b).", c + " · " + d + " = (100 " + (c > 100 ? "+ " : "− ") + Math.abs(c - 100) + ")(100 " + (c > 100 ? "− " : "+ ") + Math.abs(c - 100) + ")."], "a) " + M("(" + a + " - " + b + ")(" + a + " + " + b + ") = " + (a - b) + " \\cdot 100 = " + (a * a - b * b)) + ". b) " + M("100^2 - " + (c - 100) ** 2 + " = " + c * d) + ". c) " + M("(30 - 1)^2 = 900 - 60 + 1 = 841") + "."); }],
  };

  // « Trouve l'erreur » (24.11, chantier I, suite) : exposants d'un produit, signe devant la parenthèse, carré d'une somme.
  const camarade = () => pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  MON[2].push(() => { let m, n; do { m = R.int(2, 5); n = R.int(2, 5); } while (m * n === m + n); const a = R.int(2, 6), b = R.int(2, 6), w = camarade();
    const L = X1(a * b, { x: m + n });
    return Qx(w + " écrit : « " + M(a + "x^{" + m + "} \\cdot " + b + "x^{" + n + "} = " + a * b + "x^{" + m * n + "}") + " ». Trouve l'erreur, puis donne le bon produit.", L,
      "Erreur : " + M("x^{" + m + "} \\cdot x^{" + n + "}") + " compte " + m + " + " + n + " facteurs " + M("x") + " : on <b>additionne</b> les exposants. " + M(a + " \\cdot " + b + " = " + a * b) + ", donc " + M(tex(L)) + ".",
      { ...red, ctx: "erreur", guide: [GS("Coefficient : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS("Exposant de " + M("x") + " : " + M(m + " + " + n) + " = ?", m + n, M(m + n) + "."), GX("Le bon produit :", L, M(tex(L)) + ".", "reduced")],
        traps: [TX(X1(a * b, { x: m * n }), "C'est le résultat de " + w + " : on multiplie les exposants seulement pour une puissance de puissance.")] }); });
  DIS[2].push(() => { const k = R.int(2, 7), a = R.int(2, 6), b = R.int(2, 9), L = lin(-k * a, k * b), F = lin(-k * a, -k * b), w = camarade();
    return Qx(w + " écrit : « " + M("-" + k + "(" + a + "x - " + b + ") = " + tex(F)) + " ». Trouve l'erreur, puis développe correctement.", L,
      "Erreur : le facteur " + M("-" + k) + " multiplie aussi " + M("-" + b) + ", et moins par moins donne plus : " + M("(-" + k + ") \\cdot (-" + b + ") = +" + k * b) + ". Donc " + M(tex(L)) + ".",
      { ...red, ctx: "erreur", guide: [GX("Premier terme : " + M("(-" + k + ") \\cdot " + a + "x") + " = ?", X1(-k * a), M(-k * a + "x") + ".", "reduced"), GS("Deuxième terme : " + M("(-" + k + ") \\cdot (-" + b + ")") + " = ?", k * b, M("+" + k * b) + "."), GX("Le bon développement :", L, M(tex(L)) + ".", "reduced")],
        traps: [TX(F, "C'est le résultat de " + w + " : attention au signe du deuxième produit.")] }); });
  IDR[2].push(() => { const b = pk([1, 1, 2, 3]), a = R.int(2, 9), s = pk([1, -1]), w = camarade(), bx = (b === 1 ? "" : b) + "x";
    const L = norm([[b * b, { x: 2 }], [2 * s * a * b, { x: 1 }], [a * a, {}]]), F = norm([[b * b, { x: 2 }], [a * a, {}]]);
    return Qx(w + " écrit : « " + M("(" + bx + (s > 0 ? " + " : " - ") + a + ")^2 = " + tex(F)) + " ». Trouve l'erreur, puis développe correctement.", L,
      "Erreur : un carré, c'est un produit : " + M("(" + bx + (s > 0 ? " + " : " - ") + a + ")(" + bx + (s > 0 ? " + " : " - ") + a + ")") + ". Il manque le double produit " + M((s > 0 ? "" : "-") + "2 \\cdot " + bx + " \\cdot " + a + " = " + 2 * s * a * b + "x") + ". Donc " + M(tex(L)) + ".",
      { ...red, ctx: "erreur", guide: [GS("Double produit : " + M("2 \\cdot " + bx + " \\cdot " + (s > 0 ? a : "(-" + a + ")")) + " ; coefficient de " + M("x") + " ?", 2 * s * a * b, M(2 * s * a * b + "x") + "."), GX("Le bon développement :", L, M(tex(L)) + ".", "reduced")],
        traps: [TX(F, "C'est le résultat de " + w + " : " + M("(a + b)^2 \\neq a^2 + b^2") + ", il manque le double produit.")] }); });

  // Lot 26.11 (référentiel du Collège 1.AL.03c : factoriser x² + sx + p par somme et produit) : deux formes de plus au
  // niveau 3, à côté de la forme « trinome » : compléter une factorisation commencée, corriger une erreur de signe.
  const trin = () => { let a, b; do { a = nz(-7, 7); b = nz(-7, 7); } while (a === b || a + b === 0 || Math.abs(a) === Math.abs(b) || Math.abs(a) < 2 || Math.abs(b) < 2); return [a, b]; };
  const xp = (a) => "x" + (a < 0 ? " - " + -a : " + " + a);
  const pq = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const xe = (a) => "(x" + (a < 0 ? "" : "+") + a + ")";
  FAC[3].push(() => { for (let essai = 0; ; essai++) { const [a, b] = trin(), T = tex(norm([[1, { x: 2 }], [a + b, { x: 1 }], [a * b, {}]]));
    const q = Qn("Complète la factorisation : " + M(T + " = (" + xp(a) + ")(x + \\ldots)") + ". Quel nombre manque ? (il peut être négatif)", b,
      "Les deux nombres ont pour produit " + M(a * b) + " et pour somme " + M(a + b) + " : " + M(a + " \\cdot " + pq(b) + " = " + a * b) + " et " + M(a + " + " + pq(b) + " = " + (a + b)) + ". Donc " + M(T + " = (" + xp(a) + ")(" + xp(b) + ")") + ".",
      { ctx: "trinome-complete", guide: [GS("Les deux nombres de la factorisation ont pour produit le terme constant. Que vaut ce produit ?", a * b, M(a * b) + "."), GS(M(a + " \\cdot \\ldots = " + a * b) + " : le nombre manquant ?", b, M(a * b + " \\div " + pq(a) + " = " + b) + " ; contrôle : " + M(a + " + " + pq(b) + " = " + (a + b)) + ", le coefficient de " + M("x") + ".")],
        traps: [TRAP(-b, "Vérifie le signe : le produit " + M(a + " \\cdot " + pq(-b)) + " ne donne pas " + M(a * b) + "."), TRAP(a * b, "C'est le produit ; on cherche le nombre qui, multiplié par " + a + ", donne " + a * b + "."), TRAP(a + b + a, "La somme des deux nombres doit valoir " + (a + b) + " : on soustrait " + a + ", on n'ajoute pas.")] });
    if (essai >= 20 || (!trivialQ(q, 0) && !answerShown(q))) return q; } });
  FAC[3].push(() => { const [a, b] = trin(), w = camarade(), T = tex(norm([[1, { x: 2 }], [a + b, { x: 1 }], [a * b, {}]])), e = xe(a) + "*" + xe(b), f = xe(-a) + "*" + xe(-b);
    return Qx(w + " écrit : « " + M(T + " = (" + xp(-a) + ")(" + xp(-b) + ")") + " ». Trouve l'erreur, puis factorise correctement.", e,
      "Erreur de signes : en développant " + M("(" + xp(-a) + ")(" + xp(-b) + ")") + ", le coefficient de " + M("x") + " vaut " + M(-(a + b)) + " au lieu de " + M(a + b) + ". Les deux nombres sont " + M(a) + " et " + M(b) + " (produit " + M(a * b) + ", somme " + M(a + b) + ") : " + M("(" + xp(a) + ")(" + xp(b) + ")") + ".",
      { ...prod, ctx: "erreur", guide: [GS("Somme des deux nombres choisis par " + w + " (" + M(-a) + " et " + M(-b) + ") ?", -(a + b), M(-(a + b)) + " : il fallait " + M(a + b) + "."), GX("La bonne factorisation :", e, M("(" + xp(a) + ")(" + xp(b) + ")") + ".", "product")],
        traps: [TX(f, "C'est la réponse de " + w + " : développe pour vérifier, le coefficient de " + M("x") + " doit être " + M(a + b) + ".")] }); });

  /* 26.11 soir (agent defisch) : litelab et parenth passés de 1 à 3 contextes (tag ctx, oracle par contexte dans
     tests/recalc_oracles.js). Notions communes avec la France : aucun lieu suisse. */
  {
    const CXQ = (cx, q) => Object.assign(q, { ctx: cx }), W0 = (id, cx) => { const f = PROBS[id][0]; PROBS[id][0] = () => CXQ(cx, f()); };
    W0("litelab", "rectangle"); W0("parenth", "expression");
    PROBS.litelab.push(
      () => { const k = R.int(2, 7), x = R.int(3, 9); let xs; do { xs = R.int(4, 15); } while (xs === x);
        return CXQ("triangle", Pb("Un triangle isocèle a une base de " + M("x") + " cm, et ses deux autres côtés mesurent chacun " + M("x + " + k) + " cm.",
          [["a) Périmètre pour x = " + x + " (cm)", 3 * x + 2 * k], ["b) Valeur de x pour un périmètre de " + (3 * xs + 2 * k) + " cm", xs], ["c) Longueur d'un des côtés égaux quand le périmètre vaut " + (3 * xs + 2 * k) + " cm (cm)", xs + k]],
          ["Périmètre : x + 2(x + " + k + ") = 3x + " + 2 * k + ".", "b) Résous 3x + " + 2 * k + " = " + (3 * xs + 2 * k) + "."],
          "a) " + M("3 \\cdot " + x + " + " + 2 * k + " = " + (3 * x + 2 * k)) + " cm. b) " + M("3x + " + 2 * k + " = " + (3 * xs + 2 * k)) + " ; " + M("3x = " + 3 * xs) + " ; " + M("x = " + xs) + ". c) " + M(xs + " + " + k + " = " + (xs + k)) + " cm.")); },
      () => { const k = R.int(2, 5), x = R.int(8, 14), nm = pk([["Tom", "sa sœur"], ["Lina", "son frère"], ["Noé", "sa sœur"]]); let xs; do { xs = R.int(8, 15); } while (xs === x);
        return CXQ("ages", Pb(nm[0] + " a " + M("x") + " ans. " + nm[1].charAt(0).toUpperCase() + nm[1].slice(1) + " a " + k + " ans de plus que " + (nm[0] === "Lina" ? "elle" : "lui") + ", et leur mère a le triple de l'âge de " + nm[0] + ".",
          [["a) Somme des trois âges pour x = " + x + " (ans)", 5 * x + k], ["b) Valeur de x si la somme des trois âges vaut " + (5 * xs + k) + " ans", xs], ["c) Âge de la mère quand la somme des trois âges vaut " + (5 * xs + k) + " ans (ans)", 3 * xs]],
          ["Somme : x + (x + " + k + ") + 3x = 5x + " + k + ".", "b) Résous 5x + " + k + " = " + (5 * xs + k) + "."],
          "a) " + M("5 \\cdot " + x + " + " + k + " = " + (5 * x + k)) + " ans. b) " + M("5x = " + 5 * xs) + ", " + M("x = " + xs) + ". c) " + M("3 \\cdot " + xs + " = " + 3 * xs) + " ans.")); });
    PROBS.parenth.push(
      () => { let a, b, c, x; do { a = R.int(4, 7); b = R.int(2, 9); c = R.int(2, 9); x = R.int(3, 8); } while (b === c);
        const k = a - 3, cst = b - c;
        return CXQ("programme", Pb("Programme : « Choisis un nombre " + M("x") + ", multiplie-le par " + a + ", soustrais " + M("(2x - " + b + ")") + ", puis soustrais encore " + M("(x + " + c + ")") + ". » On obtient " + M("E = " + a + "x - (2x - " + b + ") - (x + " + c + ")") + ".",
          [["a) Coefficient de x dans E réduite", k], ["b) Terme constant de E réduite", cst], ["c) Résultat du programme pour x = " + x, k * x + cst]],
          ["Un signe − devant une parenthèse change le signe de chaque terme à l'intérieur.", "E = " + a + "x − 2x + " + b + " − x − " + c + "."],
          M("E = " + a + "x - 2x + " + b + " - x - " + c + " = " + (k === 1 ? "" : k) + "x " + (cst < 0 ? "- " + -cst : "+ " + cst)) + ". a) " + k + ". b) " + cst + ". c) " + M((k === 1 ? "" : k + " \\cdot ") + x + (cst < 0 ? " - " + -cst : " + " + cst) + " = " + (k * x + cst)) + ".")); },
      () => { let a, b, c, x; do { a = R.int(3, 7); b = R.int(3, 9); c = R.int(1, 3); x = R.int(4, 10); } while (x - c < 1);
        const k = a - 2, cst = a * b + 2 * c;
        return CXQ("decoupe", Pb("Dans une plaque rectangulaire de " + a + " cm sur " + M("(x + " + b + ")") + " cm, on découpe une fente rectangulaire de 2 cm sur " + M("(x - " + c + ")") + " cm. L'aire qui reste vaut " + M("E = " + a + "(x + " + b + ") - 2(x - " + c + ")") + " cm².",
          [["a) Coefficient de x dans E réduite", k], ["b) Terme constant de E réduite", cst], ["c) Aire qui reste pour x = " + x + " (cm²)", k * x + cst]],
          ["Distribue chaque facteur, en faisant attention au signe − devant 2(x − " + c + ").", "−2 · (−" + c + ") = +" + 2 * c + "."],
          M("E = " + a + "x + " + a * b + " - 2x + " + 2 * c + " = " + (k === 1 ? "" : k) + "x + " + cst) + ". a) " + k + ". b) " + cst + ". c) " + M((k === 1 ? "" : k + " \\cdot ") + x + " + " + cst + " = " + (k * x + cst)) + " cm².")); });
  }

  // ===================== Enregistrement =====================
  const ALL = { litelab: LIT, valnum: VAL, reduire: RED, monomes: MON, parenth: PAR, distrib: DIS, idrem: IDR, factor: FAC };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pk(lv[Math.min(Math.max(d, 1), 3)])();
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    litelab: "Le début de la phrase donne l'opération faite en dernier : « le double de la somme… » → 2(… + …) ; « la somme du double… » → 2… + ….",
    valnum: "Remplace la lettre par sa valeur entre parenthèses, puis respecte les priorités : puissances, puis · et ÷, puis + et −.",
    reduire: "On additionne seulement les termes semblables : même lettre, même exposant. x et x² ne s'additionnent pas.",
    monomes: "Multiplie les coefficients ; pour chaque lettre, additionne les exposants (x = x¹).",
    parenth: "Un « − » devant une parenthèse change le signe de chaque terme à l'intérieur.",
    distrib: "Chaque terme de la première parenthèse multiplie chaque terme de la deuxième, puis on réduit.",
    idrem: "(a + b)² = a² + 2ab + b² ; (a − b)² = a² − 2ab + b² ; (a + b)(a − b) = a² − b².",
    factor: "Cherche d'abord un facteur commun, puis une identité remarquable ; vérifie en développant.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    litelab: ["Traduire une phrase en expression", "Écrire une expression (nombres, figure)", "Modéliser et simplifier une situation"],
    valnum: ["Calculer une expression pour une valeur", "Substituer plusieurs valeurs", "Substituer des fractions ou des puissances"],
    reduire: ["Réduire une expression du 1er degré", "Réduire et ordonner un polynôme", "Réduire avec fractions ou plusieurs lettres"],
    monomes: ["Multiplier des monômes", "Multiplier des monômes à plusieurs lettres", "Trouver un monôme manquant"],
    parenth: ["Supprimer une parenthèse précédée de −", "Supprimer plusieurs parenthèses", "Parenthèses et crochets"],
    distrib: ["Développer avec la simple distributivité", "Développer avec la double distributivité", "Développer et réduire une expression"],
    idrem: ["Développer (a ± b)² et (a + b)(a − b)", "Identités avec coefficients", "Utiliser les identités (calcul, différence)"],
    factor: ["Factoriser par mise en évidence", "Factoriser avec une identité remarquable", "Factoriser au maximum, trinôme (somme et produit)"],
  });
})();
