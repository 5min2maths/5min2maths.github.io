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

