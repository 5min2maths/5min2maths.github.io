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
          { ctx: "periode-" + c[1], guide: [G("Un cycle complet correspond à 360°. Pour quel " + M("t") + " a-t-on " + M(b + "t = 360") + " ?", per, M(N(per)) + " " + c[1] + ".")], traps: [TR(360 * b, "On divise 360 par " + b + "."), TR(b, "C'est la vitesse angulaire (degrés par " + c[1] + "), pas la période.")] }); },
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

  const PROBS = {
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
    { id: "droiteparam", th: "DP", sem: "S7", theme: "es", label: "Droites paramétriques", ex: "\\begin{cases} x = 2 + 3t \\\\ y = -1 + 4t \\end{cases}", lv: DP,
      hint: "Point de départ A, vecteur directeur d : (x ; y) = A + t · d. Un point est sur la droite si le même t convient pour toutes les coordonnées. Intersection : égalise les coordonnées (deux paramètres t et s).",
      lesson: ["Droites paramétriques", "Une droite décrite par un point et une direction.", "La droite passant par \\(A\\) de vecteur directeur \\(\\vec{d}\\) : \\(x = x_A + t\\,d_x\\), \\(y = y_A + t\\,d_y\\) (\\(+ z\\) dans l'espace). Chaque valeur de \\(t\\) donne un point. Un point est sur la droite s'il existe un même \\(t\\) pour toutes les coordonnées. Angle entre deux droites : angle aigu entre leurs vecteurs directeurs.",
        ["Par \\(A(2 ; -1)\\) et \\(B(5 ; 3)\\) : \\(x = 2 + 3t\\), \\(y = -1 + 4t\\)"], "Pour l'intersection de deux droites, utilise deux paramètres différents (t et s)."],
      comps: ["Calculer un point d'une droite ; trouver le paramètre", "Intersection avec un axe ou un plan de coordonnées", "Intersection de deux droites ; angle ; problèmes"] },
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

