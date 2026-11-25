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
  // Lot 26.11 (référentiel du Collège 2.AL.02c : multiplier et diviser des fractions rationnelles) : la division, au
  // niveau 3 à côté du produit (multiplier par l'inverse, factoriser, simplifier).
  FR[3].push(() => { const a = R.int(1, 7), s = pk([1, -1]), k = R.int(2, 4), m = R.int(2, 5), d = xm(-s * a), r = xm(s * a), A = a * a;
    const e = k + "*(" + xs(s * a) + ")";
    return QX("Simplifie " + M("\\frac{x^2 - " + A + "}{" + m + "x} \\div \\frac{" + d + "}{" + k * m + "x}") + " (pour les valeurs de " + M("x") + " permises).", e, "nodiv",
      "Diviser, c'est multiplier par l'inverse : " + M("\\frac{x^2 - " + A + "}{" + m + "x} \\cdot \\frac{" + k * m + "x}{" + d + "} = \\frac{(x - " + a + ")(x + " + a + ") \\cdot " + k * m + "x}{" + m + "x \\cdot (" + d + ")} = " + k + "(" + r + ")") + ".",
      { ctx: "division", guide: [GX("Multiplie par l'inverse de la deuxième fraction : écris le produit obtenu", "(x^2-" + A + ")/(" + m + "*x)*(" + k * m + "*x)/(" + xs(-s * a) + ")", M("\\frac{x^2 - " + A + "}{" + m + "x} \\cdot \\frac{" + k * m + "x}{" + d + "}") + "."),
        GX("Factorise " + M("x^2 - " + A), "(x-" + a + ")*(x+" + a + ")", M("(x - " + a + ")(x + " + a + ")") + "."), GX("Après simplification", e, M(k + "(" + r + ")") + ".")],
        traps: [TX("(x^2-" + A + ")*(" + xs(-s * a) + ")/(" + k * m * m + "*x^2)", "On ne multiplie pas directement : diviser, c'est multiplier par l'INVERSE de la deuxième fraction."), TX("(" + xs(s * a) + ")/" + k, "C'est la deuxième fraction qu'on retourne, pas la première.")] }); });

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
    fracrat: ["Simplifier (trinôme, différence de carrés)", "Facteur commun, opposé", "Une seule fraction, produits, quotients"],
    valint: ["Une ou deux valeurs", "Trinôme, sommes, mise en évidence", "Degré 3, Δ < 0, fraction étagée"],
    eqparam: ["Aucune solution, paramètre par une solution", "Δ = 0, infinité, degré 2", "Infinité, écart des solutions, seuil"],
  });
  /* 25.11 (audit de niveau MP 1re–2e, tools/niveau_mp12.md) : notions du PEE de MP 1re qui n'étaient pas dans l'année
     (sans champ MP, donc traitées comme des notions antérieures du CO) alors que le PEE les demande et que les épreuves CFPT
     les évaluent : hiérarchie des opérations (S1.CN.06), écritures fractionnaire, décimale et en pourcentage (S1.CN.04),
     notation scientifique et calcul en notation scientifique (S1.CN.04, Test S1.1 Q6–Q8), propriétés des racines
     (S1.CN.14, Test S1.1 Q9 « √12 + 7√3 − 2√27 »), monômes (S1.CA.01–02, Récit 2 ex. 1–2). Rang et chapitre MP ajoutés. */
  [["fracconv", 1.5, "CN"], ["sci", 1.6, "CN"], ["prio", 3, "CN"], ["scicalc", 7.5, "CN"], ["racprop", 8.5, "CN"], ["monomes", 10.5, "CA"]].forEach(([id, rk, ch]) => {
    const n = NOTIONS.find((x) => x.id === id);
    if (!n || n.MP !== undefined) return;
    n.MP = [12, "S1"];
    if (typeof ORDRE !== "undefined" && ORDRE.MP && ORDRE.MP[id] === undefined) ORDRE.MP[id] = rk;
    if (typeof ORDRE_THEME !== "undefined" && ORDRE_THEME.MP && !ORDRE_THEME.MP[id]) ORDRE_THEME.MP[id] = ch;
  });
})();
