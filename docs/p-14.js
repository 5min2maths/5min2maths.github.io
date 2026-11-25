// 3e du Collège de Genève (grade 14) · Analyse : dérivation (23.11, agent college34 ; programme dans
// tools/programme_3e_4e_college.md). Chapitre Sésamath Ma3 Ch3, compétences 3.AN.03 à 3.AN.10 du référentiel matu.
// Neuf notions, communes aux niveaux normal (MA1) et avancé (MA2) : tauxvar, nbderive, derivref, derivregles,
// derivprodquot, derivcomp, tangente, variations, optimderiv. Identifiants stables : l'agent « France 1re–Tle »
// les réutilise (il suffit d'ajouter FR: [année, …] dans le tableau NEW ci-dessous).
// Standard : 3 niveaux, au moins 3 formes par niveau, pas à pas, erreurs typiques, étiquette ctx, leçon, indice,
// 3 compétences, problème en plusieurs étapes (niveau 4). Chargé après ch_mp2.js, avant riche.js et lessons.js.
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(9);
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  // nombre en TeX : entier, fraction, sinon décimal à virgule
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a)); // coefficient devant une lettre (TeX)
  const sgS = (v) => (v < 0 ? " - " + fS(-v) : " + " + fS(v)); // signe et nombre tapés
  // nombre tapé (réponse attendue) : entier ou a/b
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const P2 = (cs, x = "x") => poly(ptrim(cs), x);
  // polynôme tapé : « 3x^2 - 4x + 5 » (coefficients entiers ou fractions entre parenthèses)
  const tp = (cs, x = "x") => { cs = ptrim(cs); const d = cs.length - 1; let o = "";
    cs.forEach((c, i) => { const p = d - i; if (!c) return; const a = Math.abs(c), co = p === 0 ? fS(a) : a === 1 ? "" : Number.isInteger(r6(a)) ? fS(a) : "(" + fS(a) + ")";
      const t = co + (p === 0 ? "" : p === 1 ? x : x + "^" + p); o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; });
    return o || "0"; };
  const dP = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
  const pv = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  // monôme c·xⁿ en TeX et tapé (n entier, éventuellement 0 ou 1)
  const mT = (c, n, x = "x") => (n === 0 ? fT(c) : (c === 1 ? "" : c === -1 ? "-" : fT(c)) + (n === 1 ? x : x + "^{" + n + "}"));
  const mS = (c, n, x = "x") => (n === 0 ? fS(c) : (c === 1 ? "" : c === -1 ? "-" : Number.isInteger(r6(c)) ? fS(c) : "(" + fS(c) + ")") + (n === 1 ? x : x + "^" + (n < 0 ? "(" + n + ")" : n)));
  const lin = (a, b, x = "x") => P2([a, b], x); // ax + b en TeX
  const linS = (a, b, x = "x") => tp([a, b], x);
  const pw = (base, n) => "(" + base + ")" + (n === 1 ? "" : "^" + n); // (base)ⁿ tapé
  const pwT = (base, n) => "(" + base + ")" + (n === 1 ? "" : "^{" + n + "}");
  const sq3 = (p, q) => { // p + q√3 en TeX (p, q rationnels)
    if (!q) return fT(p); const qa = Math.abs(q), qs = (qa === 1 ? "" : fT(qa).startsWith("\\frac") ? "" : fT(qa)) , isF = fT(qa).startsWith("\\frac");
    const rt = isF ? "\\frac{" + (Math.round(qa * den(qa)) === 1 ? "" : Math.round(qa * den(qa))) + "\\sqrt{3}}{" + den(qa) + "}" : qs + "\\sqrt{3}";
    return (p ? fT(p) + (q < 0 ? " - " : " + ") : q < 0 ? "-" : "") + rt; };
  const PL = (fns, pts, o = {}) => FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { try { const t = Expr.parse(tr.e); if (Expr.equivalent(t, Expr.parse(spec.expr))) return false; const k = tr.e; if (seen.has(k)) return false; seen.add(k); return true; } catch (e) { return false; } }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (tr.spec) { const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false); if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
    if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) < 1e-9 || seen.has(r6(tr.v))) return false; seen.add(r6(tr.v)); return true; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)].sort((a, b) => a - b) }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)].sort((a, b) => a - b) }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const TX = (e, m) => ({ e, m });
  const TSt = (s, m) => ({ s, m });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const quad = (cs) => (x) => pv(cs, x);
  const ftex = (cs) => M("f(x) = " + P2(cs));

  // ======================= tauxvar : taux de variation moyen (3.AN.03a) =======================
  // Contextes (situation, unité du taux) : valeurs choisies pour un taux entier ou demi-entier.
  /* 25.11 (audit niveau 3e) : les contextes « vélo, plante, température, population » (deux relevés, une division)
     étaient du niveau du CO. Remplacés par des situations où il faut d'abord évaluer une fonction (3.AN.03a). */
  const TVC = [
    () => { const v0 = R.int(12, 24), h0 = R.int(1, 3), t1 = R.int(0, 1), t2 = t1 + pk([1, 2]); const f = (t) => r6(h0 + v0 * t - 5 * t * t); const r = r6((f(t2) - f(t1)) / (t2 - t1)); if (f(t2) <= 0 || r === 0) return null;
      return { ctx: "balle", r, v1: f(t1), v2: f(t2), d: t2 - t1, a: t1, b: t2, u: "m/s", fx: "h(t) = " + h0 + " + " + v0 + "t - 5t^2", fn: "h", txt: "Une balle est lancée vers le haut ; sa hauteur vaut " + M("h(t) = " + h0 + " + " + v0 + "t - 5t^2") + " mètres après " + M("t") + " secondes.", qq: "Quelle est sa vitesse verticale moyenne (en m/s) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?" }; },
    () => { const k = pk([2, 3, 4]), V0 = R.int(4, 9) * 100, t1 = R.int(1, 4), t2 = t1 + R.int(2, 4); const f = (t) => V0 - k * t * t - 10 * t; const r = r6((f(t2) - f(t1)) / (t2 - t1)); if (f(t2) <= 0) return null;
      return { ctx: "vidange", r, v1: f(t1), v2: f(t2), d: t2 - t1, a: t1, b: t2, u: "L/min", fx: "V(t) = " + V0 + " - 10t - " + k + "t^2", fn: "V", txt: "Une cuve se vide : elle contient " + M("V(t) = " + nb(V0) + " - 10t - " + k + "t^2") + " litres après " + M("t") + " minutes.", qq: "Quel est le taux de variation moyen du volume (en L/min) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?" }; },
    () => { const N0 = R.int(2, 6) * 100, a = pk([2, 4, 6]), t1 = R.int(1, 3), t2 = t1 + R.int(2, 3); const f = (t) => N0 + a * t ** 3; const r = r6((f(t2) - f(t1)) / (t2 - t1));
      return { ctx: "culture", r, v1: f(t1), v2: f(t2), d: t2 - t1, a: t1, b: t2, u: "bactéries par heure", fx: "N(t) = " + N0 + " + " + a + "t^3", fn: "N", txt: "Une culture compte " + M("N(t) = " + nb(N0) + " + " + a + "t^3") + " bactéries après " + M("t") + " heures.", qq: "Quel est le taux de variation moyen (en bactéries par heure) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?" }; },
  ];
  const TV = {
    1: [
      () => { const a = pk([1, -1, 2, -2, 3]), b = nz(-5, 5), c = R.int(-6, 6), x1 = R.int(-3, 2), x2 = x1 + R.int(2, 4), cs = [a, b, c], y1 = pv(cs, x1), y2 = pv(cs, x2), t = (y2 - y1) / (x2 - x1);
        return QN("Calcule le taux de variation moyen de " + ftex(cs) + " entre " + M(x1) + " et " + M(x2) + ".", t, M("\\frac{f(" + x2 + ") - f(" + x1 + ")}{" + x2 + " - " + par(x1) + "} = \\frac{" + y2 + " - " + par(y1) + "}{" + (x2 - x1) + "} = " + fT(t)) + ".",
          { ctx: "polynome", guide: [GS("Calcule " + M("f(" + x1 + ")") + ".", y1, M("f(" + x1 + ") = " + y1) + "."), GS("Calcule " + M("f(" + x2 + ")") + ".", y2, M("f(" + x2 + ") = " + y2) + "."), GS("Taux : variation de " + M("f") + " divisée par variation de " + M("x") + ". Résultat ?", t, M("\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + fT(t)) + ".")],
            traps: [TR(y2 - y1, "Il faut encore diviser par l'écart des abscisses."), TR(y2 === y1 ? NaN : (x2 - x1) / (y2 - y1), "C'est l'inverse : variation de f divisée par variation de x."), TR(-t, "Attention à l'ordre : f(x₂) − f(x₁) avec x₂ − x₁, dans le même ordre.")] }); },
      () => { const c = pk(TVC)(); if (!c) return null;
        return QN(c.txt + " " + c.qq, c.r, M("\\frac{" + c.fn + "(" + c.b + ") - " + c.fn + "(" + c.a + ")}{" + c.b + " - " + c.a + "} = \\frac{" + nb(c.v2) + " - " + (c.v1 < 0 ? "(" + nb(c.v1) + ")" : nb(c.v1)) + "}{" + c.d + "} = " + nb(c.r)) + " " + c.u + ".",
          { ctx: c.ctx, guide: [GS("Calcule " + M(c.fn + "(" + c.a + ")") + ".", c.v1, M(nb(c.v1)) + "."), GS("Calcule " + M(c.fn + "(" + c.b + ")") + ".", c.v2, M(nb(c.v2)) + "."), GS("Taux moyen = variation ÷ durée ?", c.r, M(nb(c.r)) + " " + c.u + ".")],
            traps: [TR(r6(c.v2 - c.v1), "C'est la variation totale : divise-la par la durée " + c.d + "."), TR(r6(c.v2 / c.b), "On divise la variation " + c.fn + "(" + c.b + ") − " + c.fn + "(" + c.a + "), pas la valeur finale."), TR(-c.r, "Signe : la grandeur " + (c.r > 0 ? "augmente" : "diminue") + " sur cet intervalle.")] }); },
      () => { const a = pk([1, -1]), h = nz(-2, 2), k = R.int(-3, 3), cs = [a, -2 * a * h, a * h * h + k], x1 = R.int(-3, 1), x2 = x1 + R.int(2, 3), y1 = pv(cs, x1), y2 = pv(cs, x2); if (Math.abs(y1) > 5 || Math.abs(y2) > 5 || y1 === y2) return null; const t = (y2 - y1) / (x2 - x1);
        return QN("Lis les coordonnées des points " + M("A") + " et " + M("B") + " du graphe de " + M("f") + ". Quel est le taux de variation moyen de " + M("f") + " entre leurs abscisses (la pente de la sécante " + M("AB") + ") ?", t, M("A(" + x1 + " \\,;\\, " + y1 + ")") + ", " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + " : " + M("\\frac{" + y2 + " - " + par(y1) + "}{" + x2 + " - " + par(x1) + "} = " + fT(t)) + ".",
          { ctx: "graphique", fig: PL([{ f: quad(cs) }], [[x1, y1, "A"], [x2, y2, "B"]], { segs: [[x1, y1, x2, y2, "f-line"]] }), guide: [GS("Variation verticale de " + M("A") + " à " + M("B") + " ?", y2 - y1, M(y2 - y1) + "."), GS("Variation horizontale ?", x2 - x1, M(x2 - x1) + "."), GS("Pente de la sécante ?", t, M(fT(t)) + ".")],
            traps: [TR((x2 - x1) / (y2 - y1), "Pente = variation verticale ÷ variation horizontale, pas l'inverse."), TR(y2 - y1, "Divise par la variation horizontale."), TR(-t, "La sécante " + (t > 0 ? "monte" : "descend") + " de A vers B.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4, 5]), t1 = R.int(1, 4), t2 = t1 + R.int(1, 3), d1 = k * t1 * t1, d2 = k * t2 * t2, v = k * (t1 + t2), obj = pk([["Une bille descend un plan incliné", "bille"], ["Un skieur s'élance sur une piste", "skieur"], ["Une luge démarre dans une pente", "luge"]]);
        return QN(obj[0] + " : après " + M("t") + " secondes, la distance parcourue est " + M("d(t) = " + k + "t^2") + " mètres. Quelle est la vitesse moyenne (en m/s) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?", v, M("\\frac{d(" + t2 + ") - d(" + t1 + ")}{" + t2 + " - " + t1 + "} = \\frac{" + d2 + " - " + d1 + "}{" + (t2 - t1) + "} = " + v) + " m/s.",
          { ctx: "chute-" + obj[1], guide: [GS(M("d(" + t1 + ")") + " ?", d1, M(d1) + " m."), GS(M("d(" + t2 + ")") + " ?", d2, M(d2) + " m."), GS("Vitesse moyenne ?", v, M(v) + " m/s.")],
            traps: [TR(d2 / t2, "C'est la vitesse moyenne depuis le départ, pas entre les deux instants."), TR(d2 - d1, "Divise par la durée " + (t2 - t1) + " s.")] }); },
      () => { const k = pk([12, 24, 36, 60, 48]), ds = [1, 2, 3, 4, 6, 12].filter((x) => k % x === 0), x1 = pk(ds.slice(0, -1)), x2 = pk(ds.filter((x) => x > x1)); if (!x2) return null; const y1 = k / x1, y2 = k / x2, t = (y2 - y1) / (x2 - x1);
        return QN("Calcule le taux de variation moyen de " + M("f(x) = \\frac{" + k + "}{x}") + " entre " + M(x1) + " et " + M(x2) + ".", t, M("\\frac{" + y2 + " - " + y1 + "}{" + x2 + " - " + x1 + "} = " + fT(t)) + " : négatif, la fonction décroît.",
          { ctx: "inverse", guide: [GS(M("f(" + x1 + ")") + " ?", y1, M(y1) + "."), GS(M("f(" + x2 + ")") + " ?", y2, M(y2) + "."), GS("Taux ?", t, M(fT(t)) + ".")],
            traps: [TR(-t, "f décroît sur cet intervalle : le taux est négatif."), TR(y2 - y1, "Divise par " + (x2 - x1) + "."), TR((x2 - x1) / (y2 - y1), "Variation de f divisée par variation de x, pas l'inverse.")] }); },
      () => { const a = pk([1, 2, 3, -1, -2]), p = nz(-4, 4), b = p + pk([2, 3, 4, 5, -3, -2]); if (b === 0 || b === p) return null; const T = a * (p + b);
        return QN("Le taux de variation moyen de " + M("f(x) = " + mT(a, 2)) + " entre " + M(p) + " et un nombre " + M("b \\neq " + p) + " vaut " + M(T) + ". Que vaut " + M("b") + " ?", b, M("\\frac{f(b) - f(" + p + ")}{b - " + par(p) + "} = " + co(a) + "(b + " + par(p) + ")") + " (différence de carrés) ; " + M(co(a) + "(b + " + par(p) + ") = " + T) + " donne " + M("b = " + b) + ".",
          { ctx: "inconnue", guide: [GS("Le taux se simplifie en " + M(co(a) + "(" + p + " + b)") + ". Que vaut " + M(p + " + b") + " ?", T / a, M(fT(T / a)) + "."), GS(M("b") + " ?", b, M(b) + ".")],
            traps: [TR(T / a, "Tu as trouvé p + b : retire encore " + p + "."), TR(T - p, a === 1 ? "Vérifie : p + b = " + T + "." : "Divise d'abord par " + a + "."), TR(T / a + p, "p + b = " + fT(T / a) + " : on soustrait " + p + ".")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, -1, 3, -2]), b = R.int(-5, 5), c = R.int(-5, 5), x0 = nz(-3, 3), cs = [a, b, c], m = 2 * a * x0 + b; if (!m) return null;
        return QX("Soit " + ftex(cs) + ". Simplifie le taux de variation moyen entre " + M(x0) + " et " + M(x0 + " + h") + " (avec " + M("h \\neq 0") + ") : " + M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h}") + ".", tp([a, m], "h"),
          M("f(" + x0 + " + h) - f(" + x0 + ") = " + P2([a, m, 0], "h")) + ", donc le taux vaut " + M(P2([a, m], "h")) + ".",
          { ctx: "quotient-h", guide: [GX("Développe et réduis " + M("f(" + x0 + " + h) - f(" + x0 + ")") + " (en fonction de " + M("h") + ").", tp([a, m, 0], "h"), M(P2([a, m, 0], "h")) + "."), GX("Divise par " + M("h") + ".", tp([a, m], "h"), M(P2([a, m], "h")) + ".")],
            traps: [TX(tp([a, m, 0], "h"), "Il reste à diviser par h."), TX(tp([a, 2 * a * x0], "h"), "Le terme " + b + "x de f compte aussi : il donne " + b + " dans le taux."), TX(tp([1, m], "h"), "Le coefficient de h² dans la différence est " + a + ".")] }); },
      () => { const a = pk([0.02, 0.05, 0.1, 0.04]), b = R.int(8, 20), F = R.int(5, 15) * 100, q1 = R.int(5, 20) * 10, q2 = q1 + R.int(2, 6) * 10, C = (q) => r6(a * q * q + b * q + F), t = r6(a * (q1 + q2) + b), it = pk([["bougies", "bougie"], ["pots de confiture", "pot"], ["coques de téléphone", "coque"], ["mugs imprimés", "mug"]]);
        return QN("Un atelier fabrique " + M("q") + " " + it[0] + " par jour pour un coût " + M("C(q) = " + nb(a) + "q^2 + " + b + "q + " + nb(F)) + " (en CHF). Quand la production passe de " + M(q1) + " à " + M(q2) + " " + it[0] + ", quel est le taux de variation moyen du coût (en CHF par " + it[1] + ") ?", t,
          M("\\frac{C(" + q2 + ") - C(" + q1 + ")}{" + (q2 - q1) + "} = \\frac{" + nb(C(q2)) + " - " + nb(C(q1)) + "}{" + (q2 - q1) + "} = " + nb(t)) + " CHF par " + it[1] + " supplémentaire.",
          { ctx: "cout", guide: [GS(M("C(" + q1 + ")") + " ?", C(q1), M(nb(C(q1))) + " CHF."), GS(M("C(" + q2 + ")") + " ?", C(q2), M(nb(C(q2))) + " CHF."), GS("Taux moyen ?", t, M(nb(t)) + " CHF.")],
            traps: [TR(r6(C(q2) - C(q1)), "C'est la hausse totale : divise par " + (q2 - q1) + "."), TR(r6(C(q2) / q2), "C'est le coût moyen d'une pièce, pas le taux de variation du coût.")] }); },
      () => { const x0 = pk([1, 2, 3, -2]), h = pk([0.1, 0.2]), y0 = x0 ** 3, y1 = r6((x0 + h) ** 3), t = r6((y1 - y0) / h);
        return QN("Calcule le taux de variation moyen de " + M("f(x) = x^3") + " entre " + M(x0) + " et " + M(nb(r6(x0 + h))) + ". (Plus l'intervalle est petit, plus ce taux approche la pente de la tangente en " + M(x0) + ".)", t,
          M("\\frac{" + nb(y1) + " - " + par(y0) + "}{" + nb(h) + "} = " + nb(t)) + " (proche de " + M("3 \\cdot " + par(x0) + "^2 = " + 3 * x0 * x0) + ").",
          { ctx: "petit-intervalle", guide: [GS(M("f(" + nb(r6(x0 + h)) + ")") + " ?", y1, M(nb(y1)) + "."), GS("Variation " + M("f(" + nb(r6(x0 + h)) + ") - f(" + x0 + ")") + " ?", r6(y1 - y0), M(nb(r6(y1 - y0))) + "."), GS("Divisée par " + M(nb(h)) + " ?", t, M(nb(t)) + ".")],
            traps: [TR(r6(y1 - y0), "Divise encore par " + String(h).replace(".", ",") + "."), TR(3 * x0 * x0, "C'est la pente de la tangente (la limite) ; ici on demande le taux sur l'intervalle.")] }); },
    ],
  };

  // ======================= nbderive : nombre dérivé (3.AN.03b, 3.AN.04a) =======================
  const ND = {
    1: [
      () => { const [a, dd] = pk([[1, 1], [1, 2], [-1, 1], [-1, 2], [0.5, 2], [-0.5, 2]]), d = dd * pk([1, -1]), h = R.int(-2, 2), k = R.int(-3, 3), x0 = h + d, cs = [a, -2 * a * h, a * h * h + k], y0 = pv(cs, x0), m = 2 * a * d; if (Math.abs(y0) > 5) return null;
        return QN("La droite en pointillés est tangente au graphe de " + M("f") + " au point " + M("A") + ". Que vaut " + M("f'(" + x0 + ")") + " ?", m, "La tangente passe par " + M("A(" + x0 + " \\,;\\, " + y0 + ")") + " et par " + M("(" + (x0 + 1) + " \\,;\\, " + (y0 + m) + ")") + " : sa pente vaut " + M(m) + ", donc " + M("f'(" + x0 + ") = " + m) + ".",
          { ctx: "tangente-lue", fig: PL([{ f: quad(cs) }, { f: (x) => m * (x - x0) + y0, cls: "f-line", dash: true }], [[x0, y0, "A"]]), guide: [GS("Abscisse du point " + M("A") + " ?", x0, M(x0) + "."), GS("Sur la tangente, quand " + M("x") + " augmente de 1, de combien " + M("y") + " varie-t-il ?", m, M(m) + " : c'est la pente, donc " + M("f'(" + x0 + ")") + ".")],
            traps: [TR(y0, "f(" + x0 + ") est l'ordonnée de A ; le nombre dérivé est la pente de la tangente."), TR(-m, "La tangente " + (m > 0 ? "monte" : "descend") + " : vérifie le signe."), TR(1 / m, "Pente = variation verticale ÷ variation horizontale.")] }); },
      () => { const k = pk([1, 1, 2, 3, -1, -2]), c = R.int(-5, 5), a = nz(-6, 6), v = 2 * k * a;
        return QN("Avec la définition " + M("f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}") + ", calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = " + P2([k, 0, c])) + ".", v, M("\\frac{f(" + a + " + h) - f(" + a + ")}{h} = " + P2([k, 2 * k * a], "h")) + " ; quand " + M("h \\to 0") + ", il reste " + M(v) + ".",
          { ctx: "definition-x2", guide: [GX("Simplifie " + M("\\frac{f(" + a + " + h) - f(" + a + ")}{h}") + " (en fonction de " + M("h") + ").", tp([k, 2 * k * a], "h"), M(P2([k, 2 * k * a], "h")) + "."), GS("Limite quand " + M("h") + " tend vers 0 ?", v, M(v) + ".")],
            traps: [TR(k * a * a + c, "C'est f(" + a + "), pas le nombre dérivé."), TR(v + k, "h tend vers 0 : on ne remplace pas h par 1."), TR(k * a, "(x²)' = 2x : il manque le facteur 2.")] }); },
      () => { const x0 = nz(-4, 4), m = nz(-5, 5), p = nz(-6, 6), ask = pk(["der", "val"]), y0 = m * x0 + p;
        return QN("La tangente au graphe de " + M("f") + " au point d'abscisse " + M(x0) + " a pour équation " + M("y = " + lin(m, p)) + ". Que vaut " + M(ask === "der" ? "f'(" + x0 + ")" : "f(" + x0 + ")") + " ?", ask === "der" ? m : y0,
          ask === "der" ? "Le nombre dérivé est la pente de la tangente : " + M("f'(" + x0 + ") = " + m) + "." : "Le point de contact est sur la tangente : " + M("f(" + x0 + ") = " + m + " \\cdot " + par(x0) + sg(p) + " = " + y0) + ".",
          { ctx: "eq-tangente-" + ask, guide: ask === "der" ? [GS("Pente de la droite " + M("y = " + lin(m, p)) + " ?", m, M(m) + " = " + M("f'(" + x0 + ")") + ".")] : [GS("Le point de contact est sur la tangente. Ordonnée de la tangente en " + M("x = " + x0) + " ?", y0, M(y0) + ".")],
            traps: ask === "der" ? [TR(p, "p est l'ordonnée à l'origine ; le nombre dérivé est la pente m."), TR(y0, "C'est f(" + x0 + ")."), TR(-m, "Signe de la pente.")] : [TR(m, "m est la pente, c'est-à-dire f'(" + x0 + ")."), TR(p, "p est la valeur en x = 0, pas en x = " + x0 + "."), TR(m * x0 - p, "Ordonnée : m · x0 + p.")] }); },
    ],
    2: [
      () => { const a = pk([1, -1, 2, -2, 3]), b = nz(-6, 6), c = R.int(-5, 5), x0 = nz(-3, 3), cs = [a, b, c], v = 2 * a * x0 + b; if (!v) return null;
        return QN("Avec la définition du nombre dérivé, calcule " + M("f'(" + x0 + ")") + " pour " + ftex(cs) + ".", v, M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h} = " + P2([a, v], "h")) + " ; limite en " + M("h \\to 0") + " : " + M(v) + ".",
          { ctx: "definition-x2b", guide: [GX("Simplifie le quotient " + M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h}") + ".", tp([a, v], "h"), M(P2([a, v], "h")) + "."), GS("Limite quand " + M("h \\to 0") + " ?", v, M(v) + ".")],
            traps: [TR(pv(cs, x0), "C'est f(" + x0 + ")."), TR(2 * a * x0, "Le terme " + b + "x donne aussi " + b + " dans la limite."), TR(v + a, "h tend vers 0 : le terme en h disparaît.")] }); },
      () => { const k = pk([1, 2, 3, 4, 6]), a = pk([2, 3, 4, 5, -2, -3, -4]), v = -k / (a * a);
        return QN("Avec la définition, calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = \\frac{" + k + "}{x}") + ".", v, M("\\frac{f(" + a + " + h) - f(" + a + ")}{h} = \\frac{-" + k + "}{" + a + "(" + a + " + h)}") + " ; quand " + M("h \\to 0") + " : " + M("\\frac{-" + k + "}{" + a * a + "} = " + fT(v)) + ".",
          { ctx: "definition-inverse", guide: [GX("Simplifie " + M("\\frac{f(" + a + " + h) - f(" + a + ")}{h}") + " (une seule fraction).", "-" + k + "/(" + a + "*(" + a + "+h))", M("\\frac{-" + k + "}{" + a + "(" + a + " + h)}") + "."), GS("Limite quand " + M("h \\to 0") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(-v, "La fonction k/x décroît : le nombre dérivé est négatif."), TR(-k / a, "Au dénominateur, a(a + h) tend vers a², pas vers a."), TR(k / a, "C'est f(" + a + ").")] }); },
      () => { const a = pk([1, -1, 0.5, -0.5]), h = nz(-3, 3), k = R.int(-3, 3), cs = [a, -2 * a * h, a * h * h + k], ask = pk(["abs", "signe"]);
        if (ask === "abs") return QN("Sur le graphe de " + M("f") + ", en quelle abscisse le nombre dérivé " + M("f'(x)") + " est-il nul ?", h, "La tangente est horizontale au sommet de la parabole : " + M("x = " + h) + ".",
          { ctx: "derivee-nulle", fig: PL([{ f: quad(cs) }], []), guide: [GS("Où la tangente est-elle horizontale (pente 0) ? Au sommet. Abscisse du sommet ?", h, M(h) + ".")],
            traps: [TR(k, "C'est l'ordonnée du sommet ; on demande l'abscisse."), TR(-h, "Lis l'abscisse sur l'axe horizontal (signe).")] });
        const x0 = h + pk([-2, 2]), m = 2 * a * (x0 - h);
        return QN("Sur le graphe de " + M("f(x) = " + P2(cs)) + ", calcule la pente de la tangente au point d'abscisse " + M(x0) + ", c'est-à-dire " + M("f'(" + x0 + ")") + ", avec la définition.", m, M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h} = " + P2([a, m], "h")) + " → " + M(m) + ". " + (m > 0 ? "La fonction croît en ce point." : "La fonction décroît en ce point."),
          { ctx: "pente-parabole", fig: PL([{ f: quad(cs) }], [[x0, pv(cs, x0), ""]]), guide: [GX("Quotient simplifié (en " + M("h") + ") ?", tp([a, m], "h"), M(P2([a, m], "h")) + "."), GS("Limite ?", m, M(m) + ".")],
            traps: [TR(pv(cs, x0), "C'est f(" + x0 + ")."), TR(-m, "Vérifie le signe sur le graphique : la courbe " + (m > 0 ? "monte" : "descend") + ".")] }); },
    ],
    3: [
      () => { const r = R.int(2, 9), a = r * r, v = 1 / (2 * r);
        return QN("Avec la définition (et l'expression conjuguée), calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = \\sqrt{x}") + ".", v, M("\\frac{\\sqrt{" + a + " + h} - " + r + "}{h} = \\frac{1}{\\sqrt{" + a + " + h} + " + r + "}") + " ; quand " + M("h \\to 0") + " : " + M("\\frac{1}{" + 2 * r + "}") + ".",
          { ctx: "definition-racine", guide: [GX("Multiplie par l'expression conjuguée et simplifie le quotient (en " + M("h") + ").", "1/(sqrt(" + a + "+h)+" + r + ")", M("\\frac{1}{\\sqrt{" + a + " + h} + " + r + "}") + "."), GS("Limite quand " + M("h \\to 0") + " ?", v, M("\\frac{1}{" + 2 * r + "}") + ".")],
            traps: [TR(1 / r, "Le dénominateur tend vers √a + √a = " + 2 * r + "."), TR(1 / (2 * a), "C'est 1/(2√a), pas 1/(2a)."), TR(r, "C'est f(" + a + ").")] }); },
      () => { const a = nz(-4, 4), k = pk([1, 2, -1]), v = 3 * k * a * a;
        return QN("Avec la définition, calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = " + mT(k, 3)) + ".", v, M("\\frac{f(" + a + " + h) - f(" + a + ")}{h} = " + P2([k, 3 * k * a, 3 * k * a * a], "h")) + " → " + M(v) + ".",
          { ctx: "definition-cube", guide: [GX("Quotient simplifié (développe " + M("(" + a + " + h)^3") + ") ?", tp([k, 3 * k * a, 3 * k * a * a], "h"), M(P2([k, 3 * k * a, 3 * k * a * a], "h")) + "."), GS("Limite ?", v, M(v) + ".")],
            traps: [TR(k * a ** 3, "C'est f(" + a + ")."), TR(3 * k * a, "(x³)' = 3x² : le carré manque."), TR(k * a * a, "Il manque le facteur 3.")] }); },
      () => { const p = pk([0.5, 1, 1.5, 2, 2.5]), q = R.int(0, 6), t0 = R.int(2, 12), v = r6(2 * p * t0 + q), o = pk(["Un train qui démarre", "Une voiture qui s'insère sur l'autoroute", "Un cycliste qui accélère", "Un tram qui quitte l'arrêt"]);
        const sT = nb(p).replace(/^1$/, "") + "t^2" + (q ? " + " + q + "t" : "");
        return QN(o + " parcourt " + M("s(t) = " + sT) + " mètres en " + M("t") + " secondes. Quelle est sa vitesse instantanée (en m/s) à " + M("t = " + t0) + " s, c'est-à-dire " + M("s'(" + t0 + ")") + " ?", v, M("s'(t) = " + P2([2 * p, q], "t")) + " ; " + M("s'(" + t0 + ") = " + nb(v)) + " m/s.",
          { ctx: "vitesse-instantanee", guide: [GX("Dérivée " + M("s'(t)") + " ?", tp([2 * p, q], "t"), M(P2([2 * p, q], "t")) + "."), GS(M("s'(" + t0 + ")") + " ?", v, M(nb(v)) + " m/s.")],
            traps: [TR(r6(p * t0 + q), "C'est la vitesse moyenne depuis le départ : la vitesse instantanée est s'(t)."), TR(r6(p * t0 * t0 + q * t0), "C'est la distance parcourue s(" + t0 + ")."), TR(r6(2 * p * t0), "Le terme " + q + "t donne aussi " + q + " m/s.")] }); },
    ],
  };

  // ======================= derivref : fonctions de référence (3.AN.04b, 3.AN.04c) =======================
  const DR = {
    1: [
      () => { const n = R.int(3, 9);
        return QX("Donne la fonction dérivée de " + M("f(x) = x^{" + n + "}") + ". Écris seulement l'expression de " + M("f'(x)") + ".", n + "x^" + (n - 1), M("(x^n)' = n x^{n - 1}") + " : " + M("f'(x) = " + n + "x^{" + (n - 1) + "}") + ".",
          { ctx: "puissance", guide: [GS("Exposant de la dérivée (" + M(n + " - 1") + ") ?", n - 1, M(n - 1) + "."), GX(M("f'(x)") + " ?", n + "x^" + (n - 1), M(n + "x^{" + (n - 1) + "}") + ".")],
            traps: [TX(n + "x^" + n, "L'exposant diminue de 1."), TX("x^" + (n - 1), "L'exposant descend devant : facteur " + n + "."), TX((n - 1) + "x^" + n, "(xⁿ)' = n·xⁿ⁻¹.")] }); },
      () => { const k = pk([2, 3, 4, 5, -2, -3, -4, -6, 7]), n = R.int(2, 6), c = k * n;
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + mT(k, n)) + ".", mS(c, n - 1), M("f'(x) = " + k + " \\cdot " + n + mT(1, n - 1) + " = " + mT(c, n - 1)) + ".",
          { ctx: "multiple", guide: [GS("Dérivée de " + M("x^{" + n + "}") + " : coefficient ?", n, M("(x^{" + n + "})' = " + mT(n, n - 1)) + "."), GX("Avec le facteur " + M(k) + " ?", mS(c, n - 1), M(mT(c, n - 1)) + ".")],
            traps: [TX(mS(c, n), "L'exposant diminue de 1."), TX(mS(k, n - 1), "Le facteur " + n + " (l'exposant) descend devant."), TX(mS(n, n - 1), "Le coefficient " + k + " reste : (k·u)' = k·u'.")] }); },
      () => { const n = R.int(2, 5), a = pk([2, -2, 3, -3]), v = n * a ** (n - 1);
        return QN("Pour " + M("f(x) = x^{" + n + "}") + ", calcule " + M("f'(" + a + ")") + ".", v, M("f'(x) = " + mT(n, n - 1)) + ", donc " + M("f'(" + a + ") = " + n + " \\cdot " + par(a) + (n - 1 > 1 ? "^{" + (n - 1) + "}" : "") + " = " + v) + ".",
          { ctx: "valeur-puissance", guide: [GX(M("f'(x)") + " ?", mS(n, n - 1), M(mT(n, n - 1)) + "."), GS(M("f'(" + a + ")") + " ?", v, M(v) + ".")],
            traps: [TR(a ** n, "C'est f(" + a + ") : dérive d'abord."), TR(n * a ** n, "L'exposant de la dérivée est " + (n - 1) + "."), TR(a ** (n - 1), "N'oublie pas le facteur " + n + ".")] }); },
    ],
    2: [
      () => { const n = R.int(1, 4), ans = "-" + n + "/x^" + (n + 1);
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{1}{" + (n === 1 ? "x" : "x^{" + n + "}") + "}") + ".", ans, M("f(x) = x^{-" + n + "}") + ", donc " + M("f'(x) = -" + (n === 1 ? "" : n) + "x^{-" + (n + 1) + "} = -\\frac{" + n + "}{x^{" + (n + 1) + "}}") + ".",
          { ctx: "inverse-puissance", guide: [GS("Écris " + M("f(x) = x^{p}") + " : exposant " + M("p") + " ?", -n, M(-n) + "."), GX(M("f'(x)") + " ?", ans, M("-\\frac{" + n + "}{x^{" + (n + 1) + "}}") + ".")],
            traps: [TX(n + "/x^" + (n + 1), "Exposant négatif : la dérivée est négative."), TX(n === 1 ? "-1" : "-" + n + "/x^" + (n - 1), "L'exposant −" + n + " diminue de 1 : il devient −" + (n + 1) + "."), TX("1/(" + n + "*x^" + (n - 1) + ")", "On ne dérive pas le dénominateur seul : écris f(x) = x^(−" + n + ").")] }); },
      () => { const k = pk([1, 2, 3, 4, 6, 8, 10]), r = R.int(2, 7), a = r * r, v = k / (2 * r);
        return QN("Pour " + M("f(x) = " + (k === 1 ? "" : k) + "\\sqrt{x}") + ", calcule " + M("f'(" + a + ")") + ".", v, M("f'(x) = \\frac{" + k + "}{2\\sqrt{x}}") + ", donc " + M("f'(" + a + ") = \\frac{" + k + "}{2 \\cdot " + r + "} = " + fT(v)) + ".",
          { ctx: "racine", guide: [GX(M("f'(x)") + " ?", k + "/(2*sqrt(x))", M("\\frac{" + k + "}{2\\sqrt{x}}") + "."), GS(M("f'(" + a + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(k / r, "(√x)' = 1/(2√x) : le facteur 2 manque."), TR(k / (2 * a), "Au dénominateur : 2√x, pas 2x."), TR(k * r, "C'est f(" + a + ").")] }); },
      () => { const t = pk(["cbrt", "x32", "x52"]);
        const [eN, eD, ftx] = t === "cbrt" ? [1, 3, "\\sqrt[3]{x}"] : t === "x32" ? [3, 2, "x\\sqrt{x}"] : [5, 2, "x^2\\sqrt{x}"];
        const b = t === "cbrt" ? pk([2, 3, 4]) : R.int(2, 5), a = t === "cbrt" ? b ** 3 : b * b, e = eN / eD, v = r6(e * Math.pow(a, e - 1));
        return QN("Pour " + M("f(x) = " + ftx) + ", calcule " + M("f'(" + a + ")") + ". (Écris d'abord " + M("f(x)") + " comme une puissance de " + M("x") + ".)", v, M("f(x) = x^{\\frac{" + eN + "}{" + eD + "}}") + ", " + M("f'(x) = \\frac{" + eN + "}{" + eD + "} x^{" + fT(e - 1) + "}") + " ; " + M("f'(" + a + ") = " + fT(v)) + ".",
          { ctx: "exposant-" + t, guide: [GS("Exposant de " + M("x") + " dans " + M("f(x)") + " (fraction) ?", e, M("\\frac{" + eN + "}{" + eD + "}") + "."), GS(M("f'(" + a + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(r6(e * Math.pow(a, e)), "L'exposant diminue de 1 : " + fS(e) + " − 1 = " + fS(e - 1) + "."), TR(r6(Math.pow(a, e - 1)), "N'oublie pas le facteur " + fS(e) + "."), TR(r6(Math.pow(a, e)), "C'est f(" + a + ").")] }); },
    ],
    3: [
      () => { const A = [["0", [1, 0], [0, 0]], ["\\frac{\\pi}{2}", [0, 0], [1, 0]], ["\\pi", [-1, 0], [0, 0]], ["\\frac{\\pi}{3}", [0.5, 0], [0, 0.5]], ["\\frac{\\pi}{6}", [0, 0.5], [0.5, 0]]];
        const [xt, cz, si] = pk(A), a = nz(-5, 5), b = nz(-5, 5); // f'(x) = a cos x − b sin x
        const p = a * cz[0] - b * si[0], q = a * cz[1] - b * si[1], v = r6(p + q * Math.sqrt(3)), fv = r6(a * (si[0] + si[1] * Math.sqrt(3)) + b * (cz[0] + cz[1] * Math.sqrt(3)));
        return QN("Soit " + M("f(x) = " + co(a) + "\\sin x" + (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "\\cos x") + " (" + M("x") + " en radians). Calcule " + M("f'\\left(" + xt + "\\right)") + " (valeur exacte).", v,
          M("f'(x) = " + co(a) + "\\cos x" + (b < 0 ? " + " : " - ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "\\sin x") + ", donc " + M("f'\\left(" + xt + "\\right) = " + sq3(p, q)) + ".",
          { ctx: "trigo-valeur", guide: [GX(M("f'(x)") + " ? (tape cos(x) et sin(x))", a + "*cos(x)" + sgS(-b) + "*sin(x)", M("f'(x) = " + co(a) + "\\cos x" + (b < 0 ? " + " : " - ") + co(Math.abs(b)) + "\\sin x") + "."), GS(M("f'\\left(" + xt + "\\right)") + " ?", v, M(sq3(p, q)) + ".")],
            traps: [TR(r6(a * (cz[0] + cz[1] * Math.sqrt(3)) + b * (si[0] + si[1] * Math.sqrt(3))), "(cos x)' = −sin x : attention au signe."), TR(fv, "C'est f, pas f' : dérive d'abord."), TR(r6(-v), "(sin x)' = cos x et (cos x)' = −sin x : un seul signe moins.")] }); },
      () => { const fn = pk(["sin", "cos"]), a = pk([2, 3, 4, 5, -2, -3]), k = nz(-4, 4), n = R.int(2, 4), c = k * n;
        const ans = (fn === "sin" ? a + "*cos(x)" : -a + "*sin(x)") + (c < 0 ? " - " : " + ") + mS(Math.abs(c), n - 1);
        const ansT = (fn === "sin" ? a + "\\cos x" : -a + "\\sin x") + sg(c) + (n - 1 === 1 ? "x" : "x^{" + (n - 1) + "}");
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + a + "\\" + fn + " x" + (k < 0 ? " - " : " + ") + co(Math.abs(k)) + "x^{" + n + "}") + ". Tape " + M("\\sin") + " et " + M("\\cos") + " avec des parenthèses : « cos(x) ».", ans, M("f'(x) = " + ansT) + ".",
          { ctx: "trigo-" + fn, guide: [GX("Dérivée de " + M(a + "\\" + fn + " x") + " ?", fn === "sin" ? a + "*cos(x)" : -a + "*sin(x)", M(fn === "sin" ? a + "\\cos x" : -a + "\\sin x") + "."), GX(M("f'(x)") + " ?", ans, M(ansT) + ".")],
            traps: [TX((fn === "sin" ? -a + "*cos(x)" : a + "*sin(x)") + sgS(c) + "*x^" + (n - 1), fn === "sin" ? "(sin x)' = cos x, sans signe moins." : "(cos x)' = −sin x : le signe moins manque."), TX((fn === "sin" ? a + "*cos(x)" : -a + "*sin(x)") + sgS(k) + "*x^" + (n - 1), "(xⁿ)' = n·xⁿ⁻¹ : facteur " + n + ".")] }); },
      () => { const n = R.int(2, 4), a = pk([2, 3, -2, -3, 4, 5]), V = a * n * 2 ** (n - 1);
        return QN("Pour " + M("f(x) = a \\cdot x^{" + n + "}") + ", on sait que " + M("f'(2) = " + V) + ". Que vaut " + M("a") + " ?", a, M("f'(x) = " + n + "a x^{" + (n - 1) + "}") + ", donc " + M("f'(2) = " + n * 2 ** (n - 1) + "a = " + V) + " : " + M("a = " + a) + ".",
          { ctx: "coefficient", guide: [GX(M("f'(x)") + " (avec la lettre " + M("a") + ") ?", n + "*a*x^" + (n - 1), M(n + "a x^{" + (n - 1) + "}") + "."), GS(M("f'(2)") + " vaut combien de fois " + M("a") + " ?", n * 2 ** (n - 1), M(n + " \\cdot 2^{" + (n - 1) + "} = " + n * 2 ** (n - 1)) + "."), GS(M("a") + " ?", a, M(a) + ".")],
            traps: [TR(V / 2 ** n, "On utilise f'(2), pas f(2) : f'(2) = " + n * 2 ** (n - 1) + "a."), TR(V / 2 ** (n - 1), "N'oublie pas le facteur " + n + " de la dérivée.")] }); },
    ],
  };

  // ======================= derivregles : somme, multiple, polynômes (3.AN.05a) =======================
  const DG = {
    1: [
      () => { const a = nz(-6, 6), b = nz(-9, 9), c = nz(-9, 9), cs = [a, b, c], d = dP(cs); if (Math.abs(a) === 1 && R.rand() < 0.5) return null;
        return QX("Donne " + M("f'(x)") + " pour " + ftex(cs) + ".", tp(d), M("f'(x) = " + P2(d)) + " : " + M("(x^2)' = 2x") + ", " + M("(x)' = 1") + ", la constante disparaît.",
          { ctx: "degre2", guide: [GX("Dérivée de " + M(mT(a, 2)) + " ?", mS(2 * a, 1), M(mT(2 * a, 1)) + "."), GX(M("f'(x)") + " ?", tp(d), M(P2(d)) + ".")],
            traps: [TX(tp([2 * a, b, c]), "La dérivée d'une constante est 0."), TX(tp([a, b]), "(x²)' = 2x : le coefficient double."), TX(tp([2 * a, 0]), "Le terme " + b + "x a pour dérivée " + b + ".")] }); },
      () => { const cs = [nz(-4, 4), nz(-6, 6), nz(-9, 9), R.int(-9, 9)], d = dP(cs);
        return QX("Donne " + M("f'(x)") + " pour " + ftex(cs) + ".", tp(d), M("f'(x) = " + P2(d)) + " (chaque terme se dérive séparément).",
          { ctx: "degre3", guide: [GX("Dérivée de " + M(mT(cs[0], 3)) + " ?", mS(3 * cs[0], 2), M(mT(3 * cs[0], 2)) + "."), GX(M("f'(x)") + " ?", tp(d), M(P2(d)) + ".")],
            traps: [TX(tp([3 * cs[0], 2 * cs[1], cs[2], cs[3]]), "La dérivée d'une constante est 0."), TX(tp([cs[0], cs[1], cs[2]]), "L'exposant descend devant : (x³)' = 3x²."), TX(tp([3 * cs[0], 2 * cs[1], 0]), "Le terme " + cs[2] + "x a pour dérivée " + cs[2] + ".")] }); },
      () => { const cs = [nz(-3, 3), R.int(-5, 5), nz(-6, 6), R.int(-9, 9)], x0 = nz(-3, 3), d = dP(cs), v = pv(d, x0);
        return QN("Pour " + ftex(cs) + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = " + P2(d)) + ", " + M("f'(" + x0 + ") = " + v) + ".",
          { ctx: "valeur-poly", guide: [GX(M("f'(x)") + " ?", tp(d), M(P2(d)) + "."), GS(M("f'(" + x0 + ")") + " ?", v, M(v) + ".")],
            traps: [TR(pv(cs, x0), "C'est f(" + x0 + ") : dérive d'abord."), TR(pv([cs[0], cs[1], cs[2]], x0), "Dérive chaque terme : (x³)' = 3x², (x²)' = 2x.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 4), n = R.int(3, 5), b = pk([2, 3, 4, 5, -2, -3, -6]), c = R.int(-6, 6), d1 = mS(n * a, n - 1), ans = d1 + sgS(-b) + "/x^2";
        const fT0 = mT(a, n) + (b < 0 ? " - " : " + ") + "\\frac{" + Math.abs(b) + "}{x}" + (c ? sg(c) : ""), dT = mT(n * a, n - 1) + (b > 0 ? " - " : " + ") + "\\frac{" + Math.abs(b) + "}{x^2}";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + fT0) + ".", ans, M("\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}") + " : " + M("f'(x) = " + dT) + ".",
          { ctx: "puissance-inverse", guide: [GX("Dérivée de " + M("\\frac{" + b + "}{x}") + " ?", fS(-b) + "/x^2", M("\\frac{" + -b + "}{x^2}") + "."), GX(M("f'(x)") + " ?", ans, M(dT) + ".")],
            traps: [TX(d1 + sgS(b) + "/x^2", "(1/x)' = −1/x² : signe moins."), TX(d1, "Le terme " + b + "/x se dérive aussi."), TX(d1 + sgS(b) + "*ln(x)", "On dérive, on ne cherche pas de primitive.")] }); },
      () => { const p = nz(-6, 6), q = nz(-6, 6); if (p + q === 0) return null; const e = [1, p + q, p * q];
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(1, p) + ")(" + lin(1, q) + ")") + ". (Développe d'abord.)", tp(dP(e)), M("f(x) = " + P2(e)) + ", donc " + M("f'(x) = " + P2(dP(e))) + ".",
          { ctx: "developper", guide: [GX("Forme développée de " + M("f(x)") + " ?", tp(e), M(P2(e)) + "."), GX(M("f'(x)") + " ?", tp(dP(e)), M(P2(dP(e))) + ".")],
            traps: [TX("1", "La dérivée d'un produit n'est pas le produit des dérivées (1 · 1)."), TX("2x", "Le terme " + (p + q) + "x donne " + (p + q) + "."), TX(tp([2, p + q, p * q]), "Le terme constant " + p * q + " disparaît.")] }); },
      () => { const k = pk([1, 2]), a = nz(-4, 4), b = nz(-6, 6), c = k === 1 ? nz(-5, 5) : 0, red = k === 1 ? [a, b, c] : [a, b], num = red.concat(k === 1 ? [0] : [0, 0]), dd = dP(red), denT = k === 1 ? "x" : "x^2";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{" + P2(num) + "}{" + denT + "}") + " (" + M("x \\neq 0") + "). Simplifie d'abord la fraction.", tp(dd), M("f(x) = " + P2(red)) + ", donc " + M("f'(x) = " + P2(dd)) + ".",
          { ctx: "simplifier-" + k, guide: [GX("Forme simplifiée de " + M("f(x)") + " ?", tp(red), M(P2(red)) + "."), GX(M("f'(x)") + " ?", tp(dd), M(P2(dd)) + ".")],
            traps: [TX(tp(dP(num)), "On ne dérive pas le numérateur seul : simplifie d'abord par " + (k === 1 ? "x" : "x²") + "."), TX(tp(red), "Il reste à dériver.")] }); },
    ],
    3: [
      () => { const x0 = pk([1, 2, 3, -1, -2]), k = pk([-5, -4, -3, -2, 2, 3, 4, 5]), m = -3 * x0 * x0 - 2 * k * x0; if (!m) return null; /* 25.11 (robot) : k ≠ ±1 (réponse) */
        return QN("Soit " + M("f(x) = x^3 + kx^2" + sg(m) + "x") + ". Pour quelle valeur de " + M("k") + " la tangente au point d'abscisse " + M(x0) + " est-elle horizontale ?", k, M("f'(x) = 3x^2 + 2kx" + sg(m)) + " ; " + M("f'(" + x0 + ") = " + 3 * x0 * x0 + (x0 < 0 ? " - " : " + ") + Math.abs(2 * x0) + "k" + sg(m) + " = 0") + " donne " + M("k = " + k) + ".",
          { ctx: "parametre", guide: [GX(M("f'(x)") + " (avec la lettre " + M("k") + ") ?", "3x^2 + 2*k*x" + sgS(m), M("3x^2 + 2kx" + sg(m)) + "."), GS("Tangente horizontale : " + M("f'(" + x0 + ") = 0") + ". Valeur de " + M("k") + " ?", k, M("k = " + k) + ".")],
            traps: [TR(-k, "Vérifie le signe en résolvant f'(" + x0 + ") = 0."), TR(-(x0 ** 3 + m * x0) / (x0 * x0), "On veut f'(" + x0 + ") = 0 (pente nulle), pas f(" + x0 + ") = 0.")] }); },
      () => { let r1 = nz(-4, 3), r2 = r1 + pk([2, 4, 6]); const b = -3 * (r1 + r2) / 2, mm = nz(-6, 6), c = 3 * r1 * r2 + mm, d = R.int(-5, 5), cs = [1, b, c, d];
        return QSet("En quelles abscisses la tangente au graphe de " + ftex(cs) + " a-t-elle une pente égale à " + M(mm) + " ? Sépare les réponses par « ; ».", [r1, r2], M("f'(x) = " + P2(dP(cs)) + " = " + mm) + " ⟺ " + M(P2([3, 2 * b, c - mm]) + " = 0 ⟺ 3(x" + sg(-r1) + ")(x" + sg(-r2) + ") = 0") + ".",
          { ctx: "pente-donnee", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Résous " + M("f'(x) = " + mm) + ".", [r1, r2], M(r1) + " et " + M(r2) + ".")],
            traps: [TSt([-r1, -r2], "Vérifie les signes : 3(x − r₁)(x − r₂) s'annule en r₁ et r₂."), TSt([r1], "Il y a deux solutions."), TSt([r2], "Il y a deux solutions.")] }); },
      () => { const k = R.int(2, 5), a = pk([1, 2]), b = 3 * a * k, o = pk(["Un drone de livraison", "Une montgolfière", "Une fusée à eau"]);
        return QN(o + " monte selon " + M("h(t) = " + P2([-a, b, 0, 0], "t")) + " mètres (" + M("t") + " en secondes, pendant la montée). À quel instant sa vitesse verticale " + M("v(t) = h'(t)") + " est-elle maximale ?", k, M("v(t) = " + P2([-3 * a, 2 * b, 0], "t")) + ", " + M("v'(t) = " + P2([-6 * a, 2 * b], "t") + " = 0") + " pour " + M("t = " + k) + " s.",
          { ctx: "vitesse-max", guide: [GX(M("v(t) = h'(t)") + " ?", tp([-3 * a, 2 * b, 0], "t"), M(P2([-3 * a, 2 * b, 0], "t")) + "."), GX("Pour son maximum, dérive encore : " + M("v'(t)") + " ?", tp([-6 * a, 2 * b], "t"), M(P2([-6 * a, 2 * b], "t")) + "."), GS(M("v'(t) = 0") + " pour " + M("t") + " = ?", k, M(k) + " s.")],
            traps: [TR(2 * k, "À t = " + 2 * k + " s, la vitesse est nulle (sommet de la montée) ; on cherche quand elle est maximale."), TR(3 * k, "h(" + 3 * k + ") = 0 : c'est le retour au sol, pas le maximum de la vitesse.")] }); },
    ],
  };

  // ======================= derivprodquot : produit et quotient (3.AN.05b, 3.AN.05c) =======================
  const PQ = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-6, 6), c = nz(-5, 5), d = nz(-6, 6); if (a * d === b * c) return null; const e = [2 * a * c, a * d + b * c];
        return QX("Avec la règle du produit, donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")(" + lin(c, d) + ")") + ".", tp(e), M("(uv)' = u'v + uv'") + " : " + M(a + "(" + lin(c, d) + ") + " + par(c) + "(" + lin(a, b) + ") = " + P2(e)) + ".",
          { ctx: "produit-affines", guide: [GS(M("u = " + lin(a, b)) + " : " + M("u'") + " ?", a, M(a) + "."), GS(M("v = " + lin(c, d)) + " : " + M("v'") + " ?", c, M(c) + "."), GX(M("f'(x) = u'v + uv'") + " ?", tp(e), M(P2(e)) + ".")],
            traps: [TX(String(a * c), "La dérivée d'un produit n'est pas u' · v'."), TX(tp([a * c, a * d]), "Il manque le terme u · v'."), TX(tp([a * c, b * c]), "Il manque le terme u' · v.")] }); },
      () => { const n = R.int(2, 3), a = nz(-4, 4), b = nz(-5, 5), x0 = pk([-2, -1, 1, 2]), u = x0 ** n, du = n * x0 ** (n - 1), w = a * x0 + b, v = du * w + u * a;
        return QN("Pour " + M("f(x) = x^{" + n + "}(" + lin(a, b) + ")") + ", calcule " + M("f'(" + x0 + ")") + " avec la règle du produit.", v, M("f'(x) = " + n + mT(1, n - 1) + "(" + lin(a, b) + ") + " + (a === 1 ? "" : par(a)) + "x^{" + n + "}") + " ; " + M("f'(" + x0 + ") = " + du + " \\cdot " + par(w) + " + " + par(u) + " \\cdot " + par(a) + " = " + v) + ".",
          { ctx: "produit-valeur", guide: [GS(M("u'(" + x0 + ")") + " avec " + M("u = x^{" + n + "}") + " ?", du, M(du) + "."), GS(M("v(" + x0 + ")") + " ?", w, M(w) + "."), GS(M("u'v + uv'") + " en " + M(x0) + " ?", v, M(v) + ".")],
            traps: [TR(du * a, "La dérivée d'un produit n'est pas u' · v'."), TR(du * w, "Il manque le terme u · v'."), TR(u * w, "C'est f(" + x0 + ").")] }); },
      () => { const a = nz(-5, 5), b = nz(-6, 6), ans = -a + "/(" + linS(a, b) + ")^2";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{1}{" + lin(a, b) + "}") + ".", ans, M("\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}") + " : " + M("f'(x) = \\frac{" + -a + "}{(" + lin(a, b) + ")^2}") + ".",
          { ctx: "inverse-affine", guide: [GS(M("v'") + " avec " + M("v = " + lin(a, b)) + " ?", a, M(a) + "."), GX(M("f'(x) = -\\frac{v'}{v^2}") + " ?", ans, M("\\frac{" + -a + "}{(" + lin(a, b) + ")^2}") + ".")],
            traps: [TX(a + "/(" + linS(a, b) + ")^2", "Il y a un signe moins : (1/v)' = −v'/v²."), TX("-1/(" + linS(a, b) + ")^2", "N'oublie pas v' = " + a + " au numérateur."), TX("1/" + a, "On ne dérive pas le dénominateur seul.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 4), b = nz(-6, 6), c = pk([1, 1, 2, -1]), d = nz(-6, 6), N = a * d - b * c; if (!N) return null; const ans = N + "/(" + linS(c, d) + ")^2";
        return QX("Avec la règle du quotient, donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{" + lin(a, b) + "}{" + lin(c, d) + "}") + ".", ans, M("\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}") + " : numérateur " + M(a + "(" + lin(c, d) + ") - " + par(c) + "(" + lin(a, b) + ") = " + N) + ", donc " + M("f'(x) = \\frac{" + N + "}{(" + lin(c, d) + ")^2}") + ".",
          { ctx: "quotient-affines", guide: [GS("Numérateur " + M("u'v - uv'") + " (il ne contient plus de " + M("x") + ") ?", N, M(N) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + N + "}{(" + lin(c, d) + ")^2}") + ".")],
            traps: [TX((a * d + b * c) + "/(" + linS(c, d) + ")^2", "Au numérateur, u'v − uv' : un moins."), TX((-N) + "/(" + linS(c, d) + ")^2", "L'ordre compte : u'v − uv', pas uv' − u'v."), TX(fS(a / c), "La dérivée d'un quotient n'est pas u'/v'.")] }); },
      () => { const p = nz(-5, 6), r = R.int(2, 5), x0 = r * r; if (x0 + p === 0) return null; const v = r6(r + (x0 + p) / (2 * r));
        return QN("Pour " + M("f(x) = (" + lin(1, p) + ")\\sqrt{x}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\sqrt{x} + \\frac{" + lin(1, p) + "}{2\\sqrt{x}}") + " ; " + M("f'(" + x0 + ") = " + r + " + \\frac{" + (x0 + p) + "}{" + 2 * r + "} = " + fT(v)) + ".",
          { ctx: "produit-racine", guide: [GS(M("u'v") + " en " + M(x0) + " (" + M("u = " + lin(1, p)) + ", " + M("v = \\sqrt{x}") + ") ?", r, M("1 \\cdot " + r + " = " + r) + "."), GS(M("uv'") + " en " + M(x0) + " ?", r6((x0 + p) / (2 * r)), M("\\frac{" + (x0 + p) + "}{" + 2 * r + "}") + "."), GS("Somme ?", v, M(fT(v)) + ".")],
            traps: [TR(1 / (2 * r), "La dérivée d'un produit n'est pas u' · v'."), TR(r, "Il manque le terme u · v'."), TR(r6(r + (x0 + p) / r), "(√x)' = 1/(2√x) : facteur 2.")] }); },
      () => { const a = nz(-4, 4), x0 = nz(-4, 4); if (x0 + a === 0) return null; const v = (x0 * (x0 + 2 * a)) / ((x0 + a) ** 2); if (!v) return null;
        return QN("Pour " + M("f(x) = \\frac{x^2}{" + lin(1, a) + "}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\frac{2x(" + lin(1, a) + ") - x^2}{(" + lin(1, a) + ")^2} = \\frac{" + P2([1, 2 * a, 0]) + "}{(" + lin(1, a) + ")^2}") + " ; " + M("f'(" + x0 + ") = " + fT(v)) + ".",
          { ctx: "quotient-valeur", guide: [GS("Numérateur " + M("u'v - uv'") + " en " + M(x0) + " ?", x0 * (x0 + 2 * a), M(2 * x0 + " \\cdot " + par(x0 + a) + " - " + x0 * x0 + " = " + x0 * (x0 + 2 * a)) + "."), GS(M("v^2") + " en " + M(x0) + " ?", (x0 + a) ** 2, M((x0 + a) ** 2) + "."), GS(M("f'(" + x0 + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(2 * x0, "La dérivée d'un quotient n'est pas u'/v'."), TR((2 * x0 * (x0 + a) + x0 * x0) / (x0 + a) ** 2, "Au numérateur, u'v − uv' : un moins."), TR(x0 * (x0 + 2 * a), "N'oublie pas de diviser par v².")] }); },
    ],
    3: [
      () => { const a = nz(-6, 6), b = nz(-5, 5); if (b * b + a === 0) return null; const ans = "(" + tp([1, 2 * b, -a]) + ")/(" + linS(1, b) + ")^2";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{" + P2([1, 0, a]) + "}{" + lin(1, b) + "}") + ". Écris une seule fraction.", ans, M("f'(x) = \\frac{2x(" + lin(1, b) + ") - (" + P2([1, 0, a]) + ")}{(" + lin(1, b) + ")^2} = \\frac{" + P2([1, 2 * b, -a]) + "}{(" + lin(1, b) + ")^2}") + ".",
          { ctx: "quotient-degre2", guide: [GX("Numérateur " + M("u'v - uv'") + " développé ?", tp([1, 2 * b, -a]), M(P2([1, 2 * b, -a])) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + P2([1, 2 * b, -a]) + "}{(" + lin(1, b) + ")^2}") + ".")],
            traps: [TX("(" + tp([1, 2 * b, a]) + ")/(" + linS(1, b) + ")^2", "uv' se soustrait en entier : −(x² " + (a < 0 ? "− " + -a : "+ " + a) + ")."), TX("2x", "La dérivée d'un quotient n'est pas u'/v'."), TX("(" + tp([3, 2 * b, a]) + ")/(" + linS(1, b) + ")^2", "Au numérateur, u'v − uv' : un moins.")] }); },
      () => { const s = R.int(1, 5), k = s * s, c = pk([1, 2, 3]);
        return QSet("En quelles abscisses la tangente au graphe de " + M("f(x) = \\frac{" + (c === 1 ? "" : c) + "x}{x^2 + " + k + "}") + " est-elle horizontale ?", [-s, s], M("f'(x) = \\frac{" + c + "(x^2 + " + k + ") - " + c + "x \\cdot 2x}{(x^2 + " + k + ")^2} = \\frac{" + c + "(" + k + " - x^2)}{(x^2 + " + k + ")^2}") + " ; nul pour " + M("x^2 = " + k) + ".",
          { ctx: "tangentes-horizontales", guide: [GX("Numérateur de " + M("f'(x)") + " (développé) ?", tp([-c, 0, c * k]), M(P2([-c, 0, c * k])) + "."), GSet("Il s'annule pour ?", [-s, s], M("x = \\pm " + s) + ".")],
            traps: [TSt([0], "x = 0 annule f (le numérateur de f), pas f'."), TSt([s], "x² = " + k + " a deux solutions."), TSt([-k, k], "x² = " + k + " : prends la racine.")] }); },
      () => { const s = R.int(2, 6), b = s * s, a = pk([10, 12, 20, 30, 40]), ask = pk(["t", "C"]), Cm = r6(a / (2 * s));
        return QN("Après une prise de médicament, la concentration dans le sang vaut " + M("C(t) = \\frac{" + a + "t}{t^2 + " + b + "}") + " (mg/L, " + M("t") + " en heures). " + (ask === "t" ? "Après combien d'heures la concentration est-elle maximale ?" : "Quelle est la concentration maximale (en mg/L) ?"), ask === "t" ? s : Cm,
          M("C'(t) = \\frac{" + a + "(" + b + " - t^2)}{(t^2 + " + b + ")^2}") + " : positive avant " + M("t = " + s) + ", négative après. Maximum en " + M("t = " + s) + " h : " + M("C(" + s + ") = \\frac{" + a * s + "}{" + 2 * b + "} = " + fT(Cm)) + " mg/L.",
          { ctx: "medicament-" + ask, guide: [GX("Numérateur de " + M("C'(t)") + " (en " + M("t") + ") ?", tp([-a, 0, a * b], "t"), M(P2([-a, 0, a * b], "t")) + "."), GS("Instant où " + M("C'(t) = 0") + " (" + M("t > 0") + ") ?", s, M(s) + " h.")].concat(ask === "C" ? [GS(M("C(" + s + ")") + " ?", Cm, M(fT(Cm)) + " mg/L.")] : []),
            traps: ask === "t" ? [TR(b, "C'(t) = 0 pour t² = " + b + " : prends la racine."), TR(Cm, "C'est la concentration maximale, pas l'instant.")] : [TR(s, "C'est l'instant du maximum ; calcule C(" + s + ")."), TR(r6(a / s), "C(" + s + ") = " + a * s + "/(" + s * s + " + " + b + ").")] }); },
    ],
  };

  // ======================= derivcomp : fonction composée (3.AN.05d, 3.AN.05e) =======================
  const DC = {
    1: [
      () => { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-7, 7), n = R.int(2, 6), c = n * a, ans = c + "*" + pw(linS(a, b), n - 1);
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")^{" + n + "}") + ". (Laisse la parenthèse.)", ans, M("(u^n)' = n u^{n - 1} \\cdot u'") + " : " + M("f'(x) = " + n + " \\cdot " + par(a) + " \\cdot " + pwT(lin(a, b), n - 1) + " = " + c + pwT(lin(a, b), n - 1)) + ".",
          { ctx: "puissance-affine", guide: [GS("Dérivée de l'intérieur " + M("u = " + lin(a, b)) + " ?", a, M(a) + "."), GX(M("f'(x) = n u^{n-1} \\cdot u'") + " ?", ans, M(c + pwT(lin(a, b), n - 1)) + ".")],
            traps: [TX(n + "*" + pw(linS(a, b), n - 1), "Multiplie par la dérivée de l'intérieur : " + a + "."), TX(c + "*" + pw(linS(a, b), n), "L'exposant diminue de 1."), TX(String(c), "On dérive l'extérieur en gardant l'intérieur : (" + n + "u^" + (n - 1) + ") · u'.")] }); },
      () => { const a = pk([2, 3, 4, 5, 6]), r = R.int(2, 6), x0 = nz(-4, 6), b = r * r - a * x0, v = a / (2 * r);
        return QN("Pour " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\frac{" + a + "}{2\\sqrt{" + lin(a, b) + "}}") + " ; en " + M(x0) + " : " + M("\\frac{" + a + "}{2 \\cdot " + r + "} = " + fT(v)) + ".",
          { ctx: "racine-affine", guide: [GS("Intérieur " + M("u(" + x0 + ")") + " ?", r * r, M(r * r) + "."), GS(M("\\sqrt{u(" + x0 + ")}") + " ?", r, M(r) + "."), GS(M("f'(" + x0 + ") = \\frac{u'}{2\\sqrt{u}}") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(1 / (2 * r), "Multiplie par u' = " + a + "."), TR(a / r, "(√u)' = u'/(2√u) : facteur 2."), TR(r, "C'est f(" + x0 + ").")] }); },
      () => { const fn = pk(["sin", "cos"]), k = pk([2, 3, 4, 5, -2, -3]), ans = fn === "sin" ? k + "*cos(" + k + "x)" : -k + "*sin(" + k + "x)";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\" + fn + "(" + k + "x)") + ". Tape par exemple « 3cos(3x) ».", ans, M("f'(x) = " + (fn === "sin" ? k + "\\cos(" + k + "x)" : -k + "\\sin(" + k + "x)")) + " : on multiplie par la dérivée de l'intérieur, " + M(k) + ".",
          { ctx: "trigo-" + fn, guide: [GS("Dérivée de l'intérieur " + M(k + "x") + " ?", k, M(k) + "."), GX(M("f'(x)") + " ?", ans, M(fn === "sin" ? k + "\\cos(" + k + "x)" : -k + "\\sin(" + k + "x)") + ".")],
            traps: [TX(fn === "sin" ? "cos(" + k + "x)" : "-sin(" + k + "x)", "Multiplie par la dérivée de l'intérieur : " + k + "."), TX(fn === "sin" ? k + "*cos(x)" : -k + "*sin(x)", "L'intérieur " + k + "x reste dans la fonction."), TX(fn === "sin" ? -k + "*cos(" + k + "x)" : k + "*sin(" + k + "x)", fn === "sin" ? "(sin u)' = u'·cos u, sans signe moins." : "(cos u)' = −u'·sin u.")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), n = R.int(2, 5), ans = 2 * n + "x*" + pw(tp([1, 0, a]), n - 1);
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + P2([1, 0, a]) + ")^{" + n + "}") + ". (Laisse la parenthèse.)", ans, M("f'(x) = " + n + pwT(P2([1, 0, a]), n - 1) + " \\cdot 2x = " + 2 * n + "x" + pwT(P2([1, 0, a]), n - 1)) + ".",
          { ctx: "puissance-carre", guide: [GX("Dérivée de l'intérieur " + M("u = " + P2([1, 0, a])) + " ?", "2x", M("2x") + "."), GX(M("f'(x)") + " ?", ans, M(2 * n + "x" + pwT(P2([1, 0, a]), n - 1)) + ".")],
            traps: [TX(n + "*" + pw(tp([1, 0, a]), n - 1), "Multiplie par u' = 2x."), TX(2 * n + "x*" + pw(tp([1, 0, a]), n), "L'exposant diminue de 1."), TX(n + "*(2x)^" + (n - 1), "On garde l'intérieur x² " + (a < 0 ? "− " + -a : "+ " + a) + " entier.")] }); },
      () => { const a = pk([2, 3, -2, -3, 4]), b = nz(-6, 6), k = pk([2, 3]), ans = -k * a + "/(" + linS(a, b) + ")^" + (k + 1);
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{1}{(" + lin(a, b) + ")^{" + k + "}}") + ".", ans, M("f(x) = (" + lin(a, b) + ")^{-" + k + "}") + ", " + M("f'(x) = -" + k + " \\cdot " + par(a) + "(" + lin(a, b) + ")^{-" + (k + 1) + "} = \\frac{" + -k * a + "}{(" + lin(a, b) + ")^{" + (k + 1) + "}}") + ".",
          { ctx: "inverse-puissance", guide: [GS("Écris " + M("f(x) = u^{p}") + " : exposant " + M("p") + " ?", -k, M(-k) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + -k * a + "}{(" + lin(a, b) + ")^{" + (k + 1) + "}}") + ".")],
            traps: [TX(-k + "/(" + linS(a, b) + ")^" + (k + 1), "Multiplie par u' = " + a + "."), TX(k * a + "/(" + linS(a, b) + ")^" + (k + 1), "L'exposant −" + k + " descend : signe moins."), TX(-k * a + "/(" + linS(a, b) + ")^" + k, "L'exposant devient −" + (k + 1) + ".")] }); },
      () => { const [x1, r] = pk([[3, 5], [4, 5], [6, 10], [8, 10], [5, 13], [12, 13], [8, 17], [15, 17]]), x0 = x1 * pk([1, -1]), a = r * r - x1 * x1, v = x0 / r;
        return QN("Pour " + M("f(x) = \\sqrt{x^2 + " + a + "}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\frac{2x}{2\\sqrt{x^2 + " + a + "}} = \\frac{x}{\\sqrt{x^2 + " + a + "}}") + " ; " + M("f'(" + x0 + ") = \\frac{" + x0 + "}{" + r + "}") + ".",
          { ctx: "racine-carre", guide: [GS(M("u(" + x0 + ")") + " avec " + M("u = x^2 + " + a) + " ?", r * r, M(r * r) + "."), GS(M("u'(" + x0 + ")") + " ?", 2 * x0, M(2 * x0) + "."), GS(M("f'(" + x0 + ") = \\frac{u'}{2\\sqrt{u}}") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(1 / (2 * r), "Multiplie par u' = 2x."), TR(2 * x0 / r, "(√u)' = u'/(2√u) : le 2 se simplifie."), TR(r, "C'est f(" + x0 + ").")] }); },
    ],
    3: [
      () => { const p = nz(-3, 3), n = R.int(2, 3), x0 = nz(-2, 3); if (x0 === p) return null; const v = (x0 - p) ** n + n * x0 * (x0 - p) ** (n - 1); if (!v) return null;
        return QN("Pour " + M("f(x) = x(" + lin(1, -p) + ")^{" + n + "}") + ", calcule " + M("f'(" + x0 + ")") + " (produit et composée).", v, M("f'(x) = (" + lin(1, -p) + ")^{" + n + "} + " + n + "x" + pwT(lin(1, -p), n - 1)) + " ; " + M("f'(" + x0 + ") = " + (x0 - p) ** n + sg(n * x0 * (x0 - p) ** (n - 1)) + " = " + v) + ".",
          { ctx: "produit-composee", guide: [GS(M("u'v") + " en " + M(x0) + " (" + M("u = x") + ", " + M("v = " + pwT(lin(1, -p), n)) + ") ?", (x0 - p) ** n, M((x0 - p) ** n) + "."), GS(M("uv'") + " en " + M(x0) + " ?", n * x0 * (x0 - p) ** (n - 1), M(n * x0 * (x0 - p) ** (n - 1)) + "."), GS("Somme ?", v, M(v) + ".")],
            traps: [TR(n * x0 * (x0 - p) ** (n - 1), "Il manque le terme u' · v = (x − " + p + ")^" + n + "."), TR((x0 - p) ** n, "Il manque le terme u · v'."), TR(n * (x0 - p) ** (n - 1), "La dérivée d'un produit n'est pas u' · v'.")] }); },
      () => { const ctx = pk(["maree", "roue"]);
        if (ctx === "maree") { const A = pk([2, 3, 4]), m = pk([3, 4, 5]), [t0, c] = pk([[0, 1], [2, 0.5], [4, -0.5], [6, -1], [8, -0.5], [10, 0.5]]), v = A * c * Math.PI / 6;
          return QN("Dans un port, la hauteur d'eau vaut " + M("h(t) = " + m + " + " + A + "\\sin\\left(\\frac{\\pi t}{6}\\right)") + " mètres (" + M("t") + " en heures). À quelle vitesse (en m/h) l'eau monte-t-elle à " + M("t = " + t0) + " ? Valeur exacte (négative si elle descend).", v,
            M("h'(t) = " + A + " \\cdot \\frac{\\pi}{6}\\cos\\left(\\frac{\\pi t}{6}\\right)") + " ; " + M("h'(" + t0 + ") = " + fT(A / 6) + "\\pi \\cdot " + par(c) + " = " + fT(A * c / 6) + "\\pi") + " m/h.",
            { ctx: "maree", guide: [GS("Dérivée de l'intérieur " + M("\\frac{\\pi t}{6}") + " (valeur exacte, tape pi) ?", Math.PI / 6, M("\\frac{\\pi}{6}") + "."), GS(M("\\cos\\left(\\frac{\\pi \\cdot " + t0 + "}{6}\\right)") + " ?", c, M(fT(c)) + "."), GS(M("h'(" + t0 + ")") + " ?", v, M(fT(A * c / 6) + "\\pi") + " m/h.")],
              traps: [TR(A * c, "Multiplie par la dérivée de l'intérieur, π/6."), TR(-v, "(sin u)' = u' · cos u : vérifie le signe de cos."), TR(m + A * Math.sin(Math.PI * t0 / 6), "C'est la hauteur h(" + t0 + "), pas la vitesse.")] }); }
        const R0 = pk([20, 25, 30]), [t0, s] = pk([[1, 0.5], [3, 1], [5, 0.5], [7, -0.5], [9, -1], [11, -0.5]]), v = R0 * s * Math.PI / 6;
        return QN("Une cabine de grande roue est à la hauteur " + M("h(t) = " + (R0 + 2) + " - " + R0 + "\\cos\\left(\\frac{\\pi t}{6}\\right)") + " mètres (" + M("t") + " en minutes). À quelle vitesse verticale (en m/min) monte-t-elle à " + M("t = " + t0) + " ? Valeur exacte (négative si elle descend).", v,
          M("h'(t) = " + R0 + " \\cdot \\frac{\\pi}{6}\\sin\\left(\\frac{\\pi t}{6}\\right)") + " ; " + M("h'(" + t0 + ") = " + fT(R0 / 6) + "\\pi \\cdot " + par(s) + " = " + fT(R0 * s / 6) + "\\pi") + " m/min.",
          { ctx: "grande-roue", guide: [GS(M("\\sin\\left(\\frac{\\pi \\cdot " + t0 + "}{6}\\right)") + " ?", s, M(fT(s)) + "."), GS(M("h'(" + t0 + ")") + " (tape pi) ?", v, M(fT(R0 * s / 6) + "\\pi") + " m/min.")],
            traps: [TR(R0 * s, "Multiplie par la dérivée de l'intérieur, π/6."), TR(-v, "(−cos u)' = u' · sin u : le signe est +."), TR(R0 * Math.PI / 6 * Math.cos(Math.PI * t0 / 6), "La dérivée de cos est −sin, pas cos.")] }); },
      () => { const a = pk([1, 2, 3, 4]), b = pk([1, 4, 9, 5, 2]), ans = (a === 1 ? "" : a) + "x/sqrt(" + tp([a, 0, b]) + ")";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\sqrt{" + P2([a, 0, b]) + "}") + ". Tape « sqrt(…) » pour la racine.", ans, M("f'(x) = \\frac{" + 2 * a + "x}{2\\sqrt{" + P2([a, 0, b]) + "}} = \\frac{" + (a === 1 ? "" : a) + "x}{\\sqrt{" + P2([a, 0, b]) + "}}") + ".",
          { ctx: "racine-expression", guide: [GX("Dérivée de l'intérieur " + M("u = " + P2([a, 0, b])) + " ?", mS(2 * a, 1), M(mT(2 * a, 1)) + "."), GX(M("f'(x) = \\frac{u'}{2\\sqrt{u}}") + " ?", ans, M("\\frac{" + (a === 1 ? "" : a) + "x}{\\sqrt{" + P2([a, 0, b]) + "}}") + ".")],
            traps: [TX("1/(2*sqrt(" + tp([a, 0, b]) + "))", "Multiplie par u' = " + 2 * a + "x."), TX(2 * a + "x/sqrt(" + tp([a, 0, b]) + ")", "(√u)' = u'/(2√u) : le 2 se simplifie."), TX("sqrt(" + 2 * a + "x)", "On ne dérive pas sous la racine : (√u)' = u'/(2√u).")] }); },
    ],
  };

  // ======================= tangente : équation de la tangente (3.AN.03c, 3.AN.03d) =======================
  const TG = {
    1: [
      () => { const a = pk([1, -1, 2, -2, 0.5]), b = R.int(-4, 4), c = R.int(-4, 4), x0 = nz(-3, 3), cs = [a, b, c], y0 = pv(cs, x0), m = 2 * a * x0 + b, p = y0 - m * x0; if (!m || !Number.isInteger(y0)) return null;
        return QX("Donne l'équation de la tangente au graphe de " + ftex(cs) + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("f(" + x0 + ") = " + y0) + ", " + M("f'(" + x0 + ") = " + m) + " ; " + M("y = " + m + "(x - " + par(x0) + ")" + sg(y0) + " = " + P2([m, p])) + ".",
          { ctx: "parabole", fig: Math.abs(y0) <= 5 ? PL([{ f: quad(cs) }, { f: (x) => m * x + p, cls: "f-line", dash: true }], [[x0, y0, ""]]) : undefined, guide: [GS(M("f(" + x0 + ")") + " ?", y0, M(y0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GX("Tangente " + M("y = f'(x_0)(x - x_0) + f(x_0)") + " ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
            traps: [TX(tp([m, y0]), "y = m(x − x₀) + f(x₀) : développe, l'ordonnée à l'origine n'est pas f(x₀)."), TX(tp([m, 0]), "Il manque l'ordonnée à l'origine."), TX(tp([m, y0 + m * x0]), "y = m(x − x₀) + f(x₀) : attention au signe de −m·x₀.")] }); },
      () => { const x0 = nz(-4, 4), v = nz(-6, 6), m = nz(-5, 5), p = v - m * x0; if (!p) return null;
        return QX("On sait que " + M("f(" + x0 + ") = " + v) + " et " + M("f'(" + x0 + ") = " + m) + ". Donne l'équation de la tangente au graphe de " + M("f") + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("y = " + m + "(x - " + par(x0) + ")" + sg(v) + " = " + P2([m, p])) + ".",
          { ctx: "donnees", guide: [GS("Pente de la tangente ?", m, M("f'(" + x0 + ") = " + m) + "."), GS("Ordonnée à l'origine " + M("p = f(x_0) - m x_0") + " ?", p, M(v + " - " + par(m) + " \\cdot " + par(x0) + " = " + p) + "."), GX("Tangente ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
            traps: [TX(tp([m, v]), "La tangente passe par (" + x0 + " ; " + v + "), pas par (0 ; " + v + ")."), TX(tp([v, m]), "La pente est f'(" + x0 + ") = " + m + "."), TX(tp([m, v + m * x0]), "p = f(x₀) − m·x₀ : attention au signe.")] }); },
      () => { const cs = [pk([1, -1, 2, -2]), R.int(-4, 4), R.int(-5, 5)], x0 = nz(-3, 3), y0 = pv(cs, x0), m = pv(dP(cs), x0), p = y0 - m * x0; if (!m || !p) return null;
        return QN("Où la tangente au graphe de " + ftex(cs) + " au point d'abscisse " + M(x0) + " coupe-t-elle l'axe des " + M("y") + " ? Donne l'ordonnée.", p, "Tangente " + M("y = " + m + "(x - " + par(x0) + ")" + sg(y0) + " = " + P2([m, p])) + " : elle coupe l'axe des " + M("y") + " en " + M(p) + ".",
          { ctx: "ordonnee-origine", guide: [GS(M("f(" + x0 + ")") + " ?", y0, M(y0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GS("Valeur de la tangente en " + M("x = 0") + " ?", p, M(y0 + " - " + par(m) + " \\cdot " + par(x0) + " = " + p) + ".")],
            traps: [TR(y0, "C'est l'ordonnée du point de contact, pas celle de l'intersection avec l'axe des y."), TR(cs[2], "C'est f(0) : la courbe coupe l'axe en " + cs[2] + ", la tangente ailleurs."), TR(m, "C'est la pente de la tangente.")] }); },
    ],
    2: [
      () => { const cs = [pk([1, -1, 2]), R.int(-3, 3), R.int(-5, 5), R.int(-5, 5)], x0 = nz(-2, 2), y0 = pv(cs, x0), m = pv(dP(cs), x0), p = y0 - m * x0; if (!m) return null;
        return QX("Donne l'équation de la tangente au graphe de " + ftex(cs) + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("f(" + x0 + ") = " + y0) + ", " + M("f'(x) = " + P2(dP(cs))) + ", " + M("f'(" + x0 + ") = " + m) + " : " + M("y = " + P2([m, p])) + ".",
          { ctx: "cubique", guide: [GS(M("f(" + x0 + ")") + " ?", y0, M(y0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GX("Tangente ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
            traps: [TX(tp([m, y0]), "y = m(x − x₀) + f(x₀) : développe."), TX(tp([m, y0 + m * x0]), "p = f(x₀) − m·x₀ : attention au signe."), TX(tp([y0, m]), "La pente est f'(" + x0 + ") = " + m + ".")] }); },
      () => { const [r, ds] = pk([[5, [1, 2, 3, -1, -2]], [10, [1, 2, 3, 4, -1, -2, -3]], [4, [1, 2, -1, -2]], [20, [2, 4, -2, 6]]]), d = pk(ds), N = r * r, v = r6(r + d / (2 * r));
        return QN("Avec l'approximation affine de " + M("f(x) = \\sqrt{x}") + " en " + M(N) + " (la tangente), donne une valeur approchée de " + M("\\sqrt{" + (N + d) + "}") + ".", v, M("f(" + (N + d) + ") \\approx f(" + N + ") + f'(" + N + ") \\cdot " + par(d) + " = " + r + " + \\frac{" + d + "}{" + 2 * r + "} = " + nb(v)) + ".",
          { ctx: "approx-racine", guide: [GS(M("f'(" + N + ") = \\frac{1}{2\\sqrt{" + N + "}}") + " ?", 1 / (2 * r), M("\\frac{1}{" + 2 * r + "}") + "."), GS(M("f(" + N + ") + f'(" + N + ") \\cdot " + par(d)) + " ?", v, M(nb(v)) + ".")],
            traps: [TR(r6(r + d / r), "f'(" + N + ") = 1/(2√" + N + ") = 1/" + 2 * r + "."), TR(r + d, "On ajoute f'(" + N + ") · " + d + ", pas " + d + "."), TR(r6(r + d / (2 * N)), "f'(x) = 1/(2√x), pas 1/(2x).")] }); },
      () => { const [k, x0] = pk([[4, 1], [4, 2], [8, 2], [12, 2], [18, 3], [9, 3], [16, 4], [4, -1], [8, -2], [18, -3]]), m = -k / (x0 * x0), p = 2 * k / x0;
        return QX("Donne l'équation de la tangente au graphe de " + M("f(x) = \\frac{" + k + "}{x}") + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("f(" + x0 + ") = " + k / x0) + ", " + M("f'(x) = -\\frac{" + k + "}{x^2}") + ", " + M("f'(" + x0 + ") = " + m) + " : " + M("y = " + P2([m, p])) + ".",
          { ctx: "hyperbole", fig: PL([{ f: (x) => k / x, from: x0 > 0 ? 0.3 : -6, to: x0 > 0 ? 6 : -0.3 }, { f: (x) => m * x + p, cls: "f-line", dash: true }], Math.abs(k / x0) <= 6 ? [[x0, k / x0, ""]] : [], { xr: [-7, 7], yr: [-7, 9] }), guide: [GS(M("f(" + x0 + ")") + " ?", k / x0, M(k / x0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GX("Tangente ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
            traps: [TX(tp([-m, p]), "(k/x)' = −k/x² : la pente est négative."), TX(tp([m, k / x0]), "y = m(x − x₀) + f(x₀) : développe."), TX(tp([m, 0]), "Il manque l'ordonnée à l'origine.")] }); },
    ],
    3: [
      () => { const a = pk([1, -1, 2, -2]), b = R.int(-4, 4), c = R.int(-4, 4), x = nz(-3, 3), m = 2 * a * x + b, cs = [a, b, c], y = pv(cs, x); if (!m) return null;
        return QP("En quel point la tangente au graphe de " + ftex(cs) + " a-t-elle une pente égale à " + M(m) + " ? Réponds « x ; y ».", [x, y], M("f'(x) = " + P2([2 * a, b]) + " = " + m) + " donne " + M("x = " + x) + " ; " + M("f(" + x + ") = " + y) + ".",
          { ctx: "point-pente", guide: [GX(M("f'(x)") + " ?", tp([2 * a, b]), M(P2([2 * a, b])) + "."), GS("Résous " + M("f'(x) = " + m) + " : " + M("x") + " ?", x, M(x) + "."), GP("Point de contact (« x ; y ») ?", [x, y], M("(" + x + " \\,;\\, " + y + ")") + ".")],
            traps: [TP([x, m], "La pente " + m + " n'est pas l'ordonnée : calcule f(" + x + ")."), TP([-x, pv(cs, -x)], "Vérifie le signe en résolvant " + 2 * a + "x " + (b < 0 ? "− " + -b : "+ " + b) + " = " + m + "."), TP([y, x], "Écris x d'abord, puis y.")] }); },
      () => { const s = R.int(1, 5), c = s * s, a = pk([1, 2]);
        return QSet("Quelles tangentes au graphe de " + M("f(x) = " + P2([a, 0, a * c])) + " passent par l'origine ? Donne les abscisses des points de contact.", [-s, s], "Tangente en " + M("t") + " : " + M("y = " + 2 * a + "t \\, x - " + (a === 1 ? "" : a) + "t^2 + " + a * c) + ". Elle passe par " + M("O") + " si " + M((a === 1 ? "" : a) + "t^2 = " + a * c) + " : " + M("t = \\pm " + s) + ".",
          { ctx: "tangentes-origine", guide: [GX("Ordonnée à l'origine de la tangente au point d'abscisse " + M("t") + " (en fonction de " + M("t") + ") ?", tp([-a, 0, a * c], "t"), M(P2([-a, 0, a * c], "t")) + "."), GSet("Elle vaut 0 pour ?", [-s, s], M("t = \\pm " + s) + ".")],
            traps: [TSt([s], "Il y a deux tangentes, symétriques."), TSt([-c, c], c === 1 ? "t² = 1." : "t² = " + c + " : prends la racine."), TSt([0], "En t = 0, la tangente est horizontale à la hauteur " + a * c + " : elle ne passe pas par O.")] }); },
      () => { const N = pk([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17]), x0 = Math.round(Math.sqrt(N)) + pk([0, 1]), v = (x0 * x0 + N) / (2 * x0);
        return QN("Méthode de Newton pour " + M("\\sqrt{" + N + "}") + " : on part de " + M("x_0 = " + x0) + " et on remplace la courbe de " + M("f(x) = x^2 - " + N) + " par sa tangente en " + M("x_0") + ". Où cette tangente coupe-t-elle l'axe des " + M("x") + " ? (Valeur exacte.)", v,
          M("f(" + x0 + ") = " + (x0 * x0 - N)) + ", " + M("f'(" + x0 + ") = " + 2 * x0) + " ; " + M("x_1 = x_0 - \\frac{f(x_0)}{f'(x_0)} = " + x0 + " - \\frac{" + (x0 * x0 - N) + "}{" + 2 * x0 + "} = " + fT(v)) + " (proche de " + M("\\sqrt{" + N + "}") + ").",
          { ctx: "newton", guide: [GS(M("f(" + x0 + ")") + " ?", x0 * x0 - N, M(x0 * x0 - N) + "."), GS(M("f'(" + x0 + ")") + " ?", 2 * x0, M(2 * x0) + "."), GS("Zéro de la tangente " + M("x_0 - \\frac{f(x_0)}{f'(x_0)}") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(x0 + (x0 * x0 - N) / (2 * x0), "x₁ = x₀ − f(x₀)/f'(x₀) : on soustrait."), TR((x0 * x0 - N) / (2 * x0), "C'est le déplacement ; il faut partir de x₀."), TR(x0 - (x0 * x0 - N), "Divise f(x₀) par la pente f'(x₀) = " + 2 * x0 + ".")] }); },
    ],
  };

  // ======================= variations : signe de f' et extrema (3.AN.07a, 3.AN.07b) =======================
  const VA = {
    1: [
      () => { let p, q, s, max; do { p = nz(-5, 3); q = p + R.int(2, 5); s = pk([1, -1]); max = s > 0 ? p : q; } while (Math.abs(max) <= 1); const min = s > 0 ? q : p; /* 25.11 : abscisse du maximum ≠ 0, ±1 (robot) */
        return QN("La dérivée d'une fonction " + M("f") + " est " + M("f'(x) = " + (s > 0 ? "" : "-") + "(x" + sg(-p) + ")(x" + sg(-q) + ")") + ". En quelle abscisse " + M("f") + " admet-elle un maximum local ?", max, M("f'") + " s'annule en " + M(p) + " et " + M(q) + ". " + (s > 0 ? M("f'") + " est positive avant " + M(p) + ", négative entre les deux, positive après" : M("f'") + " est négative avant " + M(p) + ", positive entre les deux, négative après") + " : " + M("f") + " monte puis descend en " + M(max) + ".",
          { ctx: "signe-derivee", guide: [GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("Où " + M("f'") + " passe-t-elle de + à − ?", max, M(max) + " : maximum local.")],
            traps: [TR(min, "En " + min + ", f' passe de − à + : c'est un minimum."), TR(-max, "Les zéros de (x − a) sont en a : vérifie le signe.")] }); },
      () => { const s = R.int(1, 4), d = R.int(-5, 5), k = pk([1, 2]), cs = [k, 0, -3 * k * s * s, d];
        return QSet("En quelles abscisses " + ftex(cs) + " admet-elle un extremum local ?", [-s, s], M("f'(x) = " + P2(dP(cs)) + " = " + 3 * k + "(x - " + s + ")(x + " + s + ")") + " : s'annule et change de signe en " + M("\\pm " + s) + ".",
          { ctx: "cubique-symetrique", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [-s, s], M("\\pm " + s) + ".")],
            traps: [TSt([s], "f'(x) = 0 a deux solutions."), TSt([0], "On cherche les zéros de f', pas ceux de f ou de f''."), TSt([-s * s, s * s], "x² = " + s * s + " : prends la racine.")] }); },
      /* 25.11 (audit niveau 3e) : « valeur extrême d'une parabole » se fait en 1re sans dérivée (sommet). Remplacé :
         racine double de f' (pas de changement de signe, donc pas d'extremum) (3.AN.07b). */
      () => { const p = nz(-4, 4), q = p + pk([-5, -4, -3, -2, 2, 3, 4, 5]), s = pk([1, -1]), ext = q; if (Math.abs(q) <= 1) return null;
        return Object.assign(QN("La dérivée d'une fonction " + M("f") + " est " + M("f'(x) = " + (s > 0 ? "" : "-") + "(x" + sg(-p) + ")^2(x" + sg(-q) + ")") + ". En quelle abscisse " + M("f") + " admet-elle un extremum local ?", ext,
          M("f'") + " s'annule en " + M(p) + " et en " + M(q) + ". Le facteur " + M("(x" + sg(-p) + ")^2") + " est toujours positif : " + M("f'") + " ne change pas de signe en " + M(p) + " (palier, pas d'extremum). Elle change de signe en " + M(q) + " : " + (s > 0 ? "minimum" : "maximum") + " local.",
          { ctx: "racine-double", guide: [GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("En lequel de ces zéros " + M("f'") + " change-t-elle de signe ?", ext, M(ext) + ".")],
            traps: [TR(p, "En " + p + ", f' s'annule sans changer de signe (carré) : c'est un palier, pas un extremum."), TR(-q, "Le facteur (x − a) s'annule en a : vérifie le signe."), TR(-p, "Le facteur (x − a) s'annule en a ; et en ce point, f' ne change pas de signe.")] }), { shownOk: true }); },
    ],
    2: [
      () => { const p = nz(-4, 2), q = p + pk([2, 4]), b = -1.5 * (p + q), c = 3 * p * q, d = R.int(-5, 5), cs = [1, b, c, d], fp = pv(cs, p), fq = pv(cs, q);
        return QN("Quelle est la valeur du maximum local de " + ftex(cs) + " ?", fp, M("f'(x) = " + P2(dP(cs)) + " = 3(x" + sg(-p) + ")(x" + sg(-q) + ")") + " : " + M("f'") + " passe de + à − en " + M(p) + ". Maximum local " + M("f(" + p + ") = " + fp) + ".",
          { ctx: "cubique-max", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("Maximum local (là où " + M("f'") + " passe de + à −) : sa valeur ?", fp, M("f(" + p + ") = " + fp) + ".")],
            traps: [TR(fq, "f(" + q + ") est le minimum local (f' passe de − à +)."), TR(p, "C'est l'abscisse du maximum ; on demande sa valeur."), TR(d, "C'est f(0).")] }); },
      () => { const p = nz(-4, 2), q = p + pk([2, 4]), b = -1.5 * (p + q), c = 3 * p * q, d = R.int(-5, 5), cs = [1, b, c, d], ivs = [[p, true, q, true]];
        return QS("Sur quel intervalle (fermé) la fonction " + ftex(cs) + " est-elle décroissante ?", ivs, M("f'(x) = 3(x" + sg(-p) + ")(x" + sg(-q) + ")") + " est négative entre ses zéros : " + M("f") + " décroît sur " + M("[" + p + " \\,;\\, " + q + "]") + ".",
          { ctx: "decroissance", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GSS("Où " + M("f'(x) \\le 0") + " ?", ivs, M("[" + p + " \\,;\\, " + q + "]") + ".")],
            traps: [TS([[-Infinity, false, p, true], [q, true, Infinity, false]], "Là, f' > 0 : f est croissante."), TS([[-q, true, -p, true]], "Les zéros de (x − a) sont en a : vérifie les signes.")] }); },
      () => { const s = R.int(2, 6), k = s * s, ask = pk(["val", "abs"]);
        return QN("Pour " + M("x > 0") + ", la fonction " + M("f(x) = x + \\frac{" + k + "}{x}") + " admet un minimum. " + (ask === "val" ? "Quelle est sa valeur ?" : "En quelle abscisse ?"), ask === "val" ? 2 * s : s, M("f'(x) = 1 - \\frac{" + k + "}{x^2} = 0") + " pour " + M("x = " + s) + " ; " + M("f(" + s + ") = " + s + " + " + s + " = " + 2 * s) + ".",
          { ctx: "somme-inverse-" + ask, guide: [GX(M("f'(x)") + " ?", "1 - " + k + "/x^2", M("1 - \\frac{" + k + "}{x^2}") + "."), GS(M("f'(x) = 0") + " pour " + M("x > 0") + " ?", s, M(s) + ".")].concat(ask === "val" ? [GS(M("f(" + s + ")") + " ?", 2 * s, M(2 * s) + ".")] : []),
            traps: ask === "val" ? [TR(s, "C'est l'abscisse ; la valeur minimale est f(" + s + ")."), TR(k + 1, "C'est f(1), pas le minimum.")] : [TR(k, "x² = " + k + " : prends la racine."), TR(2 * s, "C'est la valeur minimale ; on demande l'abscisse.")] }); },
    ],
    3: [
      () => { const a = R.int(1, 4);
        return QN("Quelle est la valeur du minimum local de " + M("f(x) = \\frac{x^2}{x - " + a + "}") + " ?", 4 * a, M("f'(x) = \\frac{2x(x - " + a + ") - x^2}{(x - " + a + ")^2} = \\frac{x(x - " + 2 * a + ")}{(x - " + a + ")^2}") + " : zéros " + M(0) + " (maximum local) et " + M(2 * a) + " (minimum local). " + M("f(" + 2 * a + ") = \\frac{" + 4 * a * a + "}{" + a + "} = " + 4 * a) + ".",
          { ctx: "rationnelle-min", guide: [GX("Numérateur de " + M("f'(x)") + " ?", tp([1, -2 * a, 0]), M(P2([1, -2 * a, 0])) + "."), GSet("Zéros de " + M("f'") + " ?", [0, 2 * a], M(0) + " et " + M(2 * a) + "."), GS("Minimum local " + M("f(" + 2 * a + ")") + " ?", 4 * a, M(4 * a) + ".")],
            traps: [TR(2 * a, "C'est l'abscisse du minimum ; calcule f(" + 2 * a + ")."), TR(0, "En 0, f' passe de + à − : c'est le maximum local (valeur 0).")] }); },
      () => { const s = pk([1, 2, 3, -1, -2, -3]), k = -3 * s * s, c = pk([1, 2]);
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M("f(x) = " + (c === 1 ? "" : c) + "x^3 + " + (c === 1 ? "" : c) + "kx") + " admet-elle un extremum local en " + M("x = " + s) + " ?", k, M("f'(x) = " + 3 * c + "x^2 + " + (c === 1 ? "" : c) + "k") + " ; " + M("f'(" + s + ") = " + 3 * c * s * s + " + " + (c === 1 ? "" : c) + "k = 0") + " donne " + M("k = " + k) + ".",
          { ctx: "parametre-extremum", guide: [GX(M("f'(x)") + " (avec " + M("k") + ") ?", 3 * c + "x^2 + " + c + "*k", M(3 * c + "x^2 + " + (c === 1 ? "" : c) + "k") + "."), GS(M("f'(" + s + ") = 0") + " : " + M("k") + " ?", k, M(k) + ".")],
            traps: [TR(-k, "3x² + k = 0 donne k = −3x² : négatif."), TR(-s * s, "f'(x) = 3x² + k : facteur 3."), TR(-(s * s), "Le facteur 3 de 3x² compte.")] }); },
      () => { const s = R.int(1, 3), a = pk([1, 2]), cs = [a, 0, -2 * a * s * s, 0, 0], mn = -a * s ** 4;
        return QN("Quelle est la valeur minimale de " + ftex(cs) + " ?", mn, M("f'(x) = " + P2(dP(cs)) + " = " + 4 * a + "x(x - " + s + ")(x + " + s + ")") + " : minima en " + M("\\pm " + s) + ", maximum local en " + M(0) + ". " + M("f(" + s + ") = " + mn) + ".",
          { ctx: "degre4", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [-s, 0, s], M("-" + s) + ", " + M(0) + ", " + M(s) + "."), GS("Valeur minimale " + M("f(" + s + ")") + " ?", mn, M(mn) + ".")],
            traps: [TR(0, "En 0, f a un maximum local."), TR(s, "C'est une abscisse du minimum ; calcule f(" + s + ")."), TR(-s, "C'est une abscisse ; on demande la valeur.")] }); },
    ],
  };

  // ======================= optimderiv : problèmes d'optimisation (3.AN.10a–c) =======================
  const OP = {
    1: [
      /* 25.11 (audit niveau 3e) : bénéfice du 2e degré et enclos le long d'une rivière = sommet d'une parabole (1re).
         Remplacés par le coût moyen minimal (dérivée de k/q) et la boîte de volume maximal à surface donnée (3.AN.10). */
      () => { const a = pk([1, 2, 4, 5]), q0 = pk([10, 20, 30, 40, 50]), F = a * q0 * q0, b = pk([8, 12, 15, 20]), ask = pk(["q", "CM"]), CM = 2 * a * q0 + b, it = pk(["vélos", "drones", "tables", "trottinettes"]);
        return QN("Une entreprise produit " + M("q") + " " + it + " par mois pour un coût total " + M("C(q) = " + co(a) + "q^2 + " + b + "q + " + nb(F)) + " CHF. Le coût moyen par pièce est " + M("C_M(q) = \\frac{C(q)}{q}") + ". " + (ask === "q" ? "Quelle production rend le coût moyen minimal ?" : "Quel est le coût moyen minimal (en CHF par pièce) ?"), ask === "q" ? q0 : CM,
          M("C_M(q) = " + co(a) + "q + " + b + " + \\frac{" + nb(F) + "}{q}") + ", " + M("C_M'(q) = " + a + " - \\frac{" + nb(F) + "}{q^2} = 0") + " pour " + M("q^2 = " + nb(F / a)) + ", " + M("q = " + q0) + " ; " + M("C_M(" + q0 + ") = " + nb(a * q0) + " + " + b + " + " + nb(F / q0) + " = " + nb(CM)) + " CHF.",
          { ctx: "cout-moyen-" + ask, guide: [GX(M("C_M(q)") + " (simplifié) ?", (a === 1 ? "" : a) + "q + " + b + " + " + F + "/q", M(co(a) + "q + " + b + " + \\frac{" + nb(F) + "}{q}") + "."), GS(M("C_M'(q) = 0") + " pour " + M("q > 0") + " ?", q0, M(q0) + ".")].concat(ask === "CM" ? [GS(M("C_M(" + q0 + ")") + " ?", CM, M(nb(CM)) + " CHF.")] : []),
            traps: ask === "q" ? [TR(F / a, "C'est q² : prends la racine."), TR(Math.sqrt(F), "C_M'(q) = " + a + " − " + F + "/q² : q² = " + F + " ÷ " + a + "."), TR(F / q0, "C'est la part des frais fixes ; on demande q.")] : [TR(q0, "C'est la production ; calcule C_M(" + q0 + ")."), TR(a * q0 + b, "N'oublie pas les frais fixes répartis : " + F + " ÷ " + q0 + "."), TR(a * q0 * q0 + b * q0 + F, "C'est le coût total, pas le coût moyen.")] }); },
      () => { const x0 = R.int(4, 10), S = 3 * x0 * x0, ask = pk(["x", "V"]), V = x0 ** 3 / 2;
        return QN("Une boîte sans couvercle, à base carrée de côté " + M("x") + ", est fabriquée avec " + M(nb(S) + tu("cm^2")) + " de carton. Sa hauteur vaut donc " + M("h = \\frac{" + nb(S) + " - x^2}{4x}") + ". " + (ask === "x" ? "Quel côté " + M("x") + " (en cm) rend son volume maximal ?" : "Quel est son volume maximal (en cm³) ?"), ask === "x" ? x0 : V,
          M("V(x) = x^2 h = \\frac{" + nb(S) + "x - x^3}{4}") + ", " + M("V'(x) = \\frac{" + nb(S) + " - 3x^2}{4} = 0") + " pour " + M("x^2 = " + x0 * x0) + ", " + M("x = " + x0) + " (+ puis −) ; " + M("V(" + x0 + ") = \\frac{" + nb(S * x0) + " - " + nb(x0 ** 3) + "}{4} = " + nb(V)) + " cm³.",
          { ctx: "boite-surface-" + ask, guide: [GX(M("V(x) = x^2 h") + " (développé) ?", "(" + S + "x - x^3)/4", M("\\frac{" + nb(S) + "x - x^3}{4}") + "."), GS(M("V'(x) = 0") + " pour " + M("x > 0") + " ?", x0, M(x0) + " cm.")].concat(ask === "V" ? [GS("Volume maximal ?", V, M(nb(V)) + " cm³.")] : []),
            traps: ask === "x" ? [TR(Math.sqrt(S), "x² = S donnerait h = 0 : résous V'(x) = 0, soit 3x² = " + S + "."), TR(x0 * x0, "C'est x² ; prends la racine."), TR(S / 4, "Dérive V(x) = (" + S + "x − x³) ÷ 4.")] : [TR(x0, "C'est le côté ; calcule V(" + x0 + ")."), TR(x0 ** 3, "V = (S·x − x³) ÷ 4 : n'oublie pas de diviser."), TR(S * x0 / 4, "Il faut retrancher x³.")] }); },
      () => { const k = R.int(2, 8), S = 3 * k, ask = pk(["y", "P"]), y = 2 * k, Pm = 4 * k ** 3;
        return QN("Deux nombres positifs " + M("x") + " et " + M("y") + " ont pour somme " + M(S) + ". On veut rendre le produit " + M("P = x y^2") + " le plus grand possible. " + (ask === "y" ? "Quelle valeur de " + M("y") + " faut-il choisir ?" : "Quelle est la valeur maximale de " + M("P") + " ?"), ask === "y" ? y : Pm,
          M("P(y) = (" + S + " - y)y^2 = " + S + "y^2 - y^3") + ", " + M("P'(y) = " + 2 * S + "y - 3y^2 = y(" + 2 * S + " - 3y)") + " : " + M("y = " + y) + ", " + M("x = " + k) + ", " + M("P = " + k + " \\cdot " + y * y + " = " + Pm) + ".",
          { ctx: "produit-" + ask, guide: [GX(M("P(y)") + " (développé) ?", tp([-1, S, 0, 0], "y"), M(P2([-1, S, 0, 0], "y")) + "."), GX(M("P'(y)") + " ?", tp([-3, 2 * S, 0], "y"), M(P2([-3, 2 * S, 0], "y")) + "."), GS(M("P'(y) = 0") + " pour " + M("y > 0") + " ?", y, M(y) + ".")].concat(ask === "P" ? [GS(M("P") + " maximal ?", Pm, M(Pm) + ".")] : []),
            traps: ask === "y" ? [TR(S / 2, "La moitié n'est pas l'optimum ici : y compte au carré."), TR(k, "C'est la valeur de x.")] : [TR(r6((S / 2) ** 3), "La moitié n'est pas l'optimum : dérive P(y)."), TR(y, "C'est y ; calcule P = x · y².")] }); },
    ],
    2: [
      () => { const L = pk([12, 18, 24, 30, 36]), x = L / 6, V = 2 * L ** 3 / 27, ask = pk(["x", "V"]);
        return QN("Dans une feuille carrée de carton de " + M(L + tu("cm")) + " de côté, on découpe un carré de côté " + M("x") + " à chaque coin, puis on plie pour obtenir une boîte sans couvercle. " + (ask === "x" ? "Quelle valeur de " + M("x") + " (en cm) donne le volume maximal ?" : "Quel est le volume maximal (en cm³) ?"), ask === "x" ? x : V,
          M("V(x) = x(" + L + " - 2x)^2") + ", " + M("V'(x) = (" + L + " - 2x)(" + L + " - 6x)") + " ; " + M("x = " + L / 2) + " donne une boîte plate, donc " + M("x = " + x) + " cm et " + M("V = " + x + " \\cdot " + (L - 2 * x) + "^2 = " + nb(V)) + " cm³.",
          { ctx: "boite-" + ask, guide: [GX(M("V(x)") + " développé ?", tp([4, -4 * L, L * L, 0]), M(P2([4, -4 * L, L * L, 0])) + "."), GX(M("V'(x)") + " ?", tp([12, -8 * L, L * L]), M(P2([12, -8 * L, L * L])) + "."), GS("Zéro utile de " + M("V'") + " (" + M("0 < x < " + L / 2) + ") ?", x, M(x) + " cm.")].concat(ask === "V" ? [GS("Volume maximal ?", V, M(nb(V)) + " cm³.")] : []),
            traps: ask === "x" ? [TR(L / 2, "En x = " + L / 2 + ", le fond disparaît : volume nul."), TR(L / 4, "Dérive V(x) : V'(x) = (" + L + " − 2x)(" + L + " − 6x)."), TR(L / 3, "Résous V'(x) = 0.")] : [TR(x, "C'est x ; calcule V(" + x + ")."), TR((L / 4) * (L / 2) ** 2, "x = " + L / 4 + " n'est pas l'optimum.")] }); },
      () => { const m = R.int(2, 5), ask = pk(["q", "B"]), q = 2 * m, B = 4 * m ** 3;
        return QN("Le bénéfice d'une usine vaut " + M("B(q) = " + P2([-1, 3 * m, 0, 0], "q")) + " (en milliers de CHF, " + M("q") + " en centaines de pièces). " + (ask === "q" ? "Quelle production " + M("q") + " rend le bénéfice maximal ?" : "Quel est le bénéfice maximal (en milliers de CHF) ?"), ask === "q" ? q : B,
          M("B'(q) = " + P2([-3, 6 * m, 0], "q") + " = -3q(q - " + 2 * m + ")") + " : maximum en " + M("q = " + q) + " ; " + M("B(" + q + ") = " + B) + ".",
          { ctx: "usine-" + ask, guide: [GX(M("B'(q)") + " ?", tp([-3, 6 * m, 0], "q"), M(P2([-3, 6 * m, 0], "q")) + "."), GS("Zéro non nul de " + M("B'") + " ?", q, M(q) + ".")].concat(ask === "B" ? [GS(M("B(" + q + ")") + " ?", B, M(B) + ".")] : []),
            traps: ask === "q" ? [TR(3 * m, "B(" + 3 * m + ") = 0 : c'est là où le bénéfice s'annule."), TR(m, "Résous B'(q) = −3q² + " + 6 * m + "q = 0.")] : [TR(q, "C'est la production ; calcule B(" + q + ")."), TR(2 * m ** 3, "B(" + m + ") n'est pas le maximum.")] }); },
      () => { const s = R.int(1, 3), c = 3 * s * s, ask = pk(["x", "A"]), A = 4 * s ** 3;
        return QN("Un rectangle a deux sommets sur l'axe des " + M("x") + " et les deux autres sur la parabole " + M("y = " + c + " - x^2") + " (symétrique par rapport à l'axe des " + M("y") + "). On note " + M("x > 0") + " l'abscisse du sommet de droite. " + (ask === "x" ? "Quelle valeur de " + M("x") + " rend l'aire maximale ?" : "Quelle est l'aire maximale ?"), ask === "x" ? s : A,
          M("A(x) = 2x(" + c + " - x^2) = " + 2 * c + "x - 2x^3") + ", " + M("A'(x) = " + 2 * c + " - 6x^2 = 0") + " pour " + M("x = " + s) + " ; " + M("A = 2 \\cdot " + s + " \\cdot " + (c - s * s) + " = " + A) + ".",
          { ctx: "rectangle-parabole-" + ask, fig: PL([{ f: (x) => c - x * x }], [[s, c - s * s, ""]], { xr: [-4, 4], yr: [-1, c + 1], squash: c > 8 ? 0.6 : 1, polys: [[[-s, 0], [s, 0], [s, c - s * s], [-s, c - s * s]]] }), guide: [GX("Aire " + M("A(x)") + " ?", tp([-2, 0, 2 * c, 0]), M(P2([-2, 0, 2 * c, 0])) + "."), GS(M("A'(x) = 0") + " pour " + M("x > 0") + " ?", s, M(s) + ".")].concat(ask === "A" ? [GS("Aire maximale ?", A, M(A) + ".")] : []),
            traps: ask === "x" ? [TR(c, "Résous A'(x) = " + 2 * c + " − 6x² = 0."), TR(s * s, "x² = " + s * s + " : prends la racine.")] : [TR(r6(s * (c - s * s)), "La base vaut 2x, pas x."), TR(s, "C'est x ; calcule l'aire.")] }); },
    ],
    3: [
      () => { const x = pk([4, 6, 8, 10, 12]), V = x ** 3 / 2, h = V / (x * x), ask = pk(["x", "S"]), S = 3 * x * x;
        return QN("Une boîte sans couvercle, à base carrée, doit contenir " + M(nb(V) + tu("cm^3")) + ". On veut utiliser le moins de matière possible. " + (ask === "x" ? "Quel côté de base (en cm) faut-il choisir ?" : "Quelle est l'aire minimale de matière (en cm²) ?"), ask === "x" ? x : S,
          "Hauteur " + M("h = \\frac{" + nb(V) + "}{x^2}") + ", " + M("S(x) = x^2 + 4xh = x^2 + \\frac{" + nb(4 * V) + "}{x}") + ", " + M("S'(x) = 2x - \\frac{" + nb(4 * V) + "}{x^2} = 0 \\iff x^3 = " + nb(2 * V)) + " : " + M("x = " + x) + " cm, " + M("h = " + h) + " cm, " + M("S = " + nb(S)) + " cm².",
          { ctx: "boite-ouverte-" + ask, guide: [GX(M("S(x)") + " en fonction de " + M("x") + " ?", "x^2 + " + 4 * V + "/x", M("x^2 + \\frac{" + nb(4 * V) + "}{x}") + "."), GS(M("S'(x) = 0 \\iff x^3 =") + " ?", 2 * V, M(nb(2 * V)) + "."), GS(M("x") + " ?", x, M(x) + " cm.")].concat(ask === "S" ? [GS(M("S(" + x + ")") + " ?", S, M(nb(S)) + " cm².")] : []),
            traps: ask === "x" ? [TR(r6(Math.cbrt(V)), "Le cube n'est pas l'optimum sans couvercle : x³ = 2V."), TR(h, "C'est la hauteur.")] : [TR(r6(6 * Math.cbrt(V) ** 2 - Math.cbrt(V) ** 2), "Ce cube n'est pas l'optimum : x³ = 2V."), TR(x, "C'est le côté ; calcule S.")] }); },
      () => { const k = R.int(2, 6), V = 2 * k ** 3, ask = pk(["r", "h"]);
        return QN("Une boîte de conserve cylindrique doit contenir " + M(nb(V) + "\\pi" + tu("cm^3")) + ". Pour utiliser le moins de métal possible (aire totale minimale), " + (ask === "r" ? "quel rayon (en cm) faut-il choisir ?" : "quelle hauteur (en cm) faut-il choisir ?"), ask === "r" ? k : 2 * k,
          M("h = \\frac{" + V + "}{r^2}") + ", " + M("S(r) = 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + \\frac{" + 2 * V + "\\pi}{r}") + ", " + M("S'(r) = 4\\pi r - \\frac{" + 2 * V + "\\pi}{r^2} = 0 \\iff r^3 = " + k ** 3) + " : " + M("r = " + k) + " cm, " + M("h = " + 2 * k) + " cm (hauteur = diamètre).",
          { ctx: "conserve-" + ask, guide: [GS(M("S'(r) = 0 \\iff r^3 =") + " ?", k ** 3, M(k ** 3) + "."), GS("Rayon " + M("r") + " ?", k, M(k) + " cm.")].concat(ask === "h" ? [GS("Hauteur " + M("h = \\frac{" + V + "}{r^2}") + " ?", 2 * k, M(2 * k) + " cm.")] : []),
            traps: ask === "r" ? [TR(2 * k, "C'est la hauteur (égale au diamètre)."), TR(r6(Math.cbrt(V)), "r³ = " + V + "/2 : la moitié.")] : [TR(k, "C'est le rayon ; h = " + V + "/r²."), TR(4 * k, "h = " + V + "/" + k * k + ".")] }); },
      () => { const v = pk([60, 70, 80, 90, 100]), kk = pk([100, 200]), a = v * v / kk, d = pk([150, 240, 300, 420]);
        return QN("Un camion fait un trajet de " + M(d + tu("km")) + " à vitesse constante " + M("v") + " (km/h). Le chauffeur coûte " + M(nb(a)) + " CHF par heure et le carburant " + M("\\frac{v^2}{" + kk + "}") + " CHF par heure. Le coût du trajet est " + M("C(v) = \\frac{" + d + "}{v}\\left(" + nb(a) + " + \\frac{v^2}{" + kk + "}\\right)") + ". Quelle vitesse rend ce coût minimal ?", v,
          M("C(v) = \\frac{" + nb(d * a) + "}{v} + \\frac{" + d + "v}{" + kk + "}") + ", " + M("C'(v) = -\\frac{" + nb(d * a) + "}{v^2} + \\frac{" + d + "}{" + kk + "} = 0 \\iff v^2 = " + nb(a * kk)) + " : " + M("v = " + v) + " km/h.",
          { ctx: "camion", guide: [GS(M("C'(v) = 0 \\iff v^2 =") + " ?", a * kk, M(nb(a * kk)) + "."), GS(M("v") + " ?", v, M(v) + " km/h.")],
            traps: [TR(r6(Math.sqrt(a)), "v² = " + nb(a) + " · " + kk + " : multiplie par " + kk + "."), TR(a * kk, "C'est v² : prends la racine."), TR(r6(Math.sqrt(a * kk / 2)), "Résous C'(v) = 0 sans diviser par 2.")] }); },
    ],
  };

  // ---------- problèmes en plusieurs étapes (niveau 4) ----------
  const PROBS = {
    tauxvar: [() => P("Une voiture électrique a parcouru d(t) = 2t² + 5t mètres après t secondes.", [["a) Distance après 4 s (m)", 52], ["b) Vitesse moyenne entre 2 s et 4 s (m/s)", 17], ["c) Vitesse moyenne entre 4 s et 4,5 s (m/s)", 22]], ["d(2) = 18 et d(4) = 52.", "d(4,5) = 63, puis (63 − 52) ÷ 0,5."], "a) " + M("d(4) = 32 + 20 = 52") + " ; b) " + M("\\frac{52 - 18}{2} = 17") + " ; c) " + M("\\frac{63 - 52}{0{,}5} = 22") + " (proche de la vitesse instantanée " + M("d'(4) = 21") + ").")],
    nbderive: [() => P("On étudie f(x) = x² − 3x au point d'abscisse 2.", [["a) f(2)", -2], ["b) Quotient (f(2 + h) − f(2)) ÷ h pour h = 0,1", 1.1], ["c) f'(2)", 1]], ["f(2 + h) − f(2) = h + h².", "Le quotient vaut 1 + h."], "a) −2 ; b) " + M("1 + 0{,}1 = 1{,}1") + " ; c) limite quand " + M("h \\to 0") + " : 1.")],
    derivref: [() => P("Soit f(x) = 2√x + x³.", [["a) f(4)", 68], ["b) f'(4)", 48.5], ["c) f'(1)", 4]], ["f'(x) = 1/√x + 3x².", "f'(4) = 1/2 + 48."], "a) " + M("2 \\cdot 2 + 64 = 68") + " ; b) " + M("f'(x) = \\frac{1}{\\sqrt{x}} + 3x^2") + ", " + M("f'(4) = 48{,}5") + " ; c) " + M("1 + 3 = 4") + ".")],
    derivregles: [() => P("Soit f(x) = x³ − 6x² + 9x + 1.", [["a) f'(0)", 9], ["b) Plus petite abscisse où f'(x) = 0", 1], ["c) Plus grande abscisse où f'(x) = 0", 3]], ["f'(x) = 3x² − 12x + 9.", "3(x − 1)(x − 3)."], "a) 9 ; b) et c) " + M("f'(x) = 3(x - 1)(x - 3)") + " : 1 et 3.")],
    derivprodquot: [() => P("Soit f(x) = (2x + 1)/(x − 1), x ≠ 1.", [["a) Numérateur de f'(x) (une constante)", -3], ["b) f'(2)", -3], ["c) f'(0)", -3]], ["u'v − uv' = 2(x − 1) − (2x + 1).", "f'(x) = −3/(x − 1)²."], "a) " + M("2(x - 1) - (2x + 1) = -3") + " ; b) " + M("\\frac{-3}{1} = -3") + " ; c) " + M("\\frac{-3}{(-1)^2} = -3") + ".")],
    derivcomp: [() => P("Soit f(x) = (x² − 3)⁴.", [["a) f(2)", 1], ["b) f'(2)", 16], ["c) f'(1)", -64]], ["f'(x) = 4(x² − 3)³ · 2x.", "En x = 1, on calcule 4 · (−2)³ · 2."], "a) " + M("1^4 = 1") + " ; b) " + M("8x(x^2 - 3)^3") + " en 2 : " + M("16 \\cdot 1 = 16") + " ; c) " + M("8 \\cdot (-8) = -64") + ".")],
    tangente: [() => P("Tangente à f(x) = x² − 4x + 5 au point d'abscisse 3.", [["a) f(3)", 2], ["b) Pente f'(3)", 2], ["c) Ordonnée à l'origine de la tangente", -4]], ["f'(x) = 2x − 4.", "y = 2(x − 3) + 2."], "a) 2 ; b) 2 ; c) " + M("y = 2x - 4") + " : −4.")],
    variations: [() => P("Soit f(x) = x³ − 3x² − 9x + 2.", [["a) Abscisse du maximum local", -1], ["b) Valeur du maximum local", 7], ["c) Valeur du minimum local", -25]], ["f'(x) = 3(x + 1)(x − 3).", "f(−1) = 7 et f(3) = −25."], "a) −1 ; b) " + M("f(-1) = -1 - 3 + 9 + 2 = 7") + " ; c) " + M("f(3) = 27 - 27 - 27 + 2 = -25") + ".")],
    optimderiv: [() => P("Dans une feuille de 30 cm × 30 cm, on découpe un carré de côté x à chaque coin pour faire une boîte sans couvercle.", [["a) Volume pour x = 3 (cm³)", 1728], ["b) x qui rend le volume maximal (cm)", 5], ["c) Volume maximal (cm³)", 2000]], ["V(x) = x(30 − 2x)².", "V'(x) = (30 − 2x)(30 − 6x)."], "a) " + M("3 \\cdot 24^2 = 1728") + " ; b) 5 ; c) " + M("5 \\cdot 20^2 = 2000") + ".")],
  };

  // ---------- catalogue ----------
  const NEW = [
    { id: "tauxvar", theme: "fa", label: "Taux de variation moyen", ex: "\\frac{f(b) - f(a)}{b - a}", CH: [14], codesMATU: "3\\.AN\\.03a", lv: TV,
      hint: "Taux de variation moyen entre a et b : (f(b) − f(a)) ÷ (b − a). C'est la pente de la sécante.",
      lesson: ["Taux de variation moyen", "De combien une grandeur change-t-elle, en moyenne, par unité ?", "Entre \\(a\\) et \\(b\\), le taux de variation moyen de \\(f\\) vaut \\(\\frac{f(b) - f(a)}{b - a}\\). C'est la pente de la sécante qui relie les points d'abscisses \\(a\\) et \\(b\\). Une vitesse moyenne est un taux de variation moyen.",
        ["\\(f(x) = x^2\\) entre 1 et 3 : \\(\\frac{9 - 1}{3 - 1} = 4\\).", "De 8 h (4 °C) à 14 h (19 °C) : \\(\\frac{19 - 4}{6} = 2{,}5\\) °C par heure."], "On divise par l'écart des abscisses, dans le même ordre : \\(f(b) - f(a)\\) avec \\(b - a\\)."],
      comps: ["Calculer un taux de variation moyen", "Interpréter un taux de variation (vitesse moyenne)", "Simplifier le taux de variation entre a et a + h"] },
    { id: "nbderive", theme: "fa", label: "Nombre dérivé", ex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}", CH: [14], codesMATU: "3\\.AN\\.03b|3\\.AN\\.04a", lv: ND,
      hint: "f'(a) est la pente de la tangente en a : la limite de (f(a + h) − f(a)) ÷ h quand h tend vers 0.",
      lesson: ["Nombre dérivé", "Le nombre dérivé mesure la pente de la courbe en un point.", "\\(f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}\\). On simplifie d'abord le quotient (on peut alors diviser par \\(h\\)), puis on fait tendre \\(h\\) vers 0. Graphiquement, \\(f'(a)\\) est la pente de la tangente au point d'abscisse \\(a\\). Si \\(s(t)\\) est une position, \\(s'(t)\\) est la vitesse instantanée.",
        ["\\(f(x) = x^2\\), \\(a = 3\\) : \\(\\frac{(3 + h)^2 - 9}{h} = 6 + h\\), donc \\(f'(3) = 6\\).", "Tangente de pente 2 au point A : \\(f'(x_A) = 2\\)."], "Ne confonds pas \\(f(a)\\) (une hauteur) et \\(f'(a)\\) (une pente)."],
      comps: ["Lire un nombre dérivé (pente de la tangente)", "Calculer un nombre dérivé avec la définition", "Calculer un nombre dérivé (racine, cube, vitesse)"] },
    { id: "derivref", theme: "fa", label: "Dérivées des fonctions de référence", ex: "(x^n)' = n x^{n - 1}", CH: [14], codesMATU: "3\\.AN\\.04[bc]", lv: DR,
      hint: "(xⁿ)' = n·xⁿ⁻¹ (aussi pour n négatif ou fractionnaire), (√x)' = 1/(2√x), (sin x)' = cos x, (cos x)' = −sin x.",
      lesson: ["Dérivées des fonctions de référence", "Quelques dérivées à connaître par cœur.", "\\((x^n)' = n x^{n - 1}\\) pour tout exposant \\(n\\) ; en particulier \\(\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}\\) et \\((\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}\\). En radians : \\((\\sin x)' = \\cos x\\) et \\((\\cos x)' = -\\sin x\\). Une constante a pour dérivée 0.",
        ["\\((x^5)' = 5x^4\\)", "\\(\\left(\\frac{1}{x^3}\\right)' = (x^{-3})' = -3x^{-4} = -\\frac{3}{x^4}\\)", "\\((x\\sqrt{x})' = \\left(x^{\\frac{3}{2}}\\right)' = \\frac{3}{2}\\sqrt{x}\\)"], "Racines et inverses : écris d'abord une puissance de \\(x\\), puis applique la règle."],
      comps: ["Dériver une puissance de x", "Dériver 1/xⁿ, √x et une racine", "Dériver sinus et cosinus"] },
    { id: "derivregles", theme: "fa", label: "Dériver une somme, un polynôme", ex: "(3x^2 - 5x + 1)' = 6x - 5", CH: [14], codesMATU: "3\\.AN\\.05a", lv: DG,
      hint: "La dérivée d'une somme est la somme des dérivées ; (k·f)' = k·f' ; la dérivée d'une constante est 0.",
      lesson: ["Dériver une somme", "On dérive terme par terme.", "\\((u + v)' = u' + v'\\) et \\((k u)' = k u'\\). Pour un polynôme, chaque terme \\(a x^n\\) devient \\(n a x^{n - 1}\\) et la constante disparaît. Un produit ou un quotient simple peut d'abord être développé ou simplifié.",
        ["\\((2x^3 - 5x^2 + 4x - 7)' = 6x^2 - 10x + 4\\)", "\\(((x + 1)(x - 3))' = (x^2 - 2x - 3)' = 2x - 2\\)"], "La dérivée d'un produit n'est pas le produit des dérivées : développe d'abord (ou utilise la règle du produit)."],
      comps: ["Dériver un polynôme", "Dériver une somme de puissances (développer, simplifier)", "Utiliser la dérivée : paramètre, pente donnée, vitesse"] },
    { id: "derivprodquot", theme: "fa", label: "Dériver un produit, un quotient", ex: "\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}", CH: [14], codesMATU: "3\\.AN\\.05[bc]", lv: PQ,
      hint: "(uv)' = u'v + uv' ; (u/v)' = (u'v − uv') ÷ v² ; (1/v)' = −v' ÷ v².",
      lesson: ["Produit et quotient", "Deux règles à connaître.", "\\((uv)' = u'v + uv'\\). \\(\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}\\) (là où \\(v \\neq 0\\)) ; cas particulier \\(\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}\\). On garde en général le dénominateur sous forme de carré.",
        ["\\((x^2(3x + 1))' = 2x(3x + 1) + 3x^2 = 9x^2 + 2x\\)", "\\(\\left(\\frac{2x + 1}{x - 1}\\right)' = \\frac{2(x - 1) - (2x + 1)}{(x - 1)^2} = \\frac{-3}{(x - 1)^2}\\)"], "Au numérateur du quotient : \\(u'v - uv'\\), dans cet ordre, et \\(uv'\\) se soustrait en entier (parenthèses)."],
      comps: ["Dériver un produit", "Dériver un quotient", "Utiliser produit et quotient (tangente horizontale, maximum)"] },
    { id: "derivcomp", theme: "fa", label: "Dériver une fonction composée", ex: "\\left((3x + 1)^5\\right)' = 15(3x + 1)^4", CH: [14], codesMATU: "3\\.AN\\.05[de]", lv: DC,
      hint: "(f(u))' = f'(u) · u' : on dérive l'extérieur en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur.",
      lesson: ["Fonction composée", "Dériver « l'extérieur », puis multiplier par la dérivée de « l'intérieur ».", "\\((f(u(x)))' = f'(u(x)) \\cdot u'(x)\\). Cas fréquents : \\((u^n)' = n u^{n - 1} u'\\), \\((\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}}\\), \\((\\sin u)' = u' \\cos u\\), \\((\\cos u)' = -u' \\sin u\\).",
        ["\\(\\left((x^2 + 1)^3\\right)' = 3(x^2 + 1)^2 \\cdot 2x = 6x(x^2 + 1)^2\\)", "\\((\\sin(3x))' = 3\\cos(3x)\\)", "\\(\\left(\\sqrt{2x + 5}\\right)' = \\frac{2}{2\\sqrt{2x + 5}} = \\frac{1}{\\sqrt{2x + 5}}\\)"], "N'oublie pas le facteur \\(u'\\) : \\(((3x + 1)^5)' = 15(3x + 1)^4\\), pas \\(5(3x + 1)^4\\)."],
      comps: ["Dériver une puissance ou une racine d'une fonction affine", "Dériver une composée (carré, inverse, racine)", "Combiner produit et composée ; modèles périodiques"] },
    { id: "tangente", theme: "fa", label: "Équation de la tangente", ex: "y = f'(a)(x - a) + f(a)", CH: [14], codesMATU: "3\\.AN\\.03[cd]", lv: TG,
      hint: "Tangente en a : y = f'(a)(x − a) + f(a). Pente f'(a), elle passe par (a ; f(a)).",
      lesson: ["Équation de la tangente", "La tangente est la droite qui « colle » à la courbe en un point.", "Au point d'abscisse \\(a\\), la tangente a pour pente \\(f'(a)\\) et passe par \\((a \\,;\\, f(a))\\) : \\(y = f'(a)(x - a) + f(a)\\). Près de \\(a\\), \\(f(x) \\approx f(a) + f'(a)(x - a)\\) (approximation affine).",
        ["\\(f(x) = x^2\\) en 3 : \\(y = 6(x - 3) + 9 = 6x - 9\\).", "\\(\\sqrt{102} \\approx 10 + \\frac{2}{20} = 10{,}1\\) (tangente de \\(\\sqrt{x}\\) en 100)."], "Développe : l'ordonnée à l'origine est \\(f(a) - f'(a) \\cdot a\\), pas \\(f(a)\\)."],
      comps: ["Établir l'équation d'une tangente", "Tangente d'une fonction quelconque ; approximation affine", "Résoudre un problème de tangente (pente donnée, Newton)"] },
    { id: "variations", theme: "fa", label: "Signe de la dérivée et variations", ex: "f' > 0 \\Rightarrow f \\nearrow", CH: [14], codesMATU: "3\\.AN\\.07[ab]", lv: VA,
      hint: "f' > 0 : f croît ; f' < 0 : f décroît. Un extremum local là où f' s'annule en changeant de signe (+ → − : maximum).",
      lesson: ["Variations et extrema", "Le signe de la dérivée donne le sens de variation.", "Sur un intervalle, si \\(f' > 0\\), \\(f\\) est croissante ; si \\(f' < 0\\), décroissante. Méthode : calculer \\(f'(x)\\), trouver ses zéros, dresser le tableau de signes de \\(f'\\), en déduire les variations. Si \\(f'\\) passe de + à − en \\(a\\), \\(f(a)\\) est un maximum local ; de − à +, un minimum local.",
        ["\\(f(x) = x^3 - 3x\\) : \\(f'(x) = 3(x - 1)(x + 1)\\), maximum local \\(f(-1) = 2\\), minimum local \\(f(1) = -2\\)."], "Un zéro de \\(f'\\) sans changement de signe n'est pas un extremum (exemple : \\(x^3\\) en 0). Et l'extremum est la valeur \\(f(a)\\), pas l'abscisse \\(a\\)."],
      comps: ["Trouver les extrema avec le signe de f'", "Dresser les variations d'une fonction de degré 3", "Étudier une fonction rationnelle ou de degré 4"] },
    { id: "optimderiv", theme: "fa", label: "Problèmes d'optimisation", ex: "V'(x) = 0", CH: [14], codesMATU: "3\\.AN\\.10[abc]", lv: OP,
      hint: "Exprime la grandeur à optimiser avec une seule variable, dérive, cherche où la dérivée s'annule et vérifie que c'est bien un maximum (ou un minimum).",
      lesson: ["Optimisation", "Trouver la meilleure valeur : la plus grande aire, le plus petit coût…", "1. Choisir la variable \\(x\\) et son domaine. 2. Écrire la grandeur à optimiser en fonction de \\(x\\) seulement (utiliser la contrainte). 3. Dériver, résoudre \\(f'(x) = 0\\). 4. Vérifier avec le signe de \\(f'\\) (ou les bords du domaine) et répondre à la question posée.",
        ["Enclos le long d'une rivière, 40 m de clôture : \\(A(x) = x(40 - 2x)\\), \\(A'(x) = 40 - 4x = 0\\), \\(x = 10\\) m, aire 200 m².", "Boîte dans un carré de 30 cm : \\(V'(x) = (30 - 2x)(30 - 6x)\\), \\(x = 5\\) cm."], "Lis bien ce qu'on demande : la valeur de \\(x\\) ou la valeur optimale de la grandeur."],
      comps: ["Optimiser avec une fonction de degré 2 (dérivée)", "Optimiser avec une fonction de degré 3", "Optimiser avec une contrainte (boîte, cylindre, coût)"] },
  ];

  // ---------- enregistrement (additif : aucune notion existante n'est modifiée) ----------
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
  }
  // Figure de leçon : tangente et sécante (nombre dérivé, tangente).
  if (typeof LESSON_FIGS !== "undefined") {
    const fq = (x) => 0.5 * x * x - 1;
    LESSON_FIGS.nbderive = () => PL([{ f: fq }, { f: (x) => 2 * (x - 2) + 1, cls: "f-line", dash: true }, { f: (x) => 2.5 * (x - 2) + 1, cls: "f-line" }], [[2, 1, "A"], [3, 3.5, "B"]], { xr: [-3, 5], yr: [-2, 6], label: "sécante AB et tangente en A" });
    LESSON_FIGS.tangente = () => PL([{ f: fq }, { f: (x) => 2 * (x - 2) + 1, cls: "f-line", dash: true }], [[2, 1, "(a ; f(a))"]], { xr: [-3, 5], yr: [-2, 6], label: "tangente au point d'abscisse a" });
  }
})();

// =====================================================================================================================
// 24.11 soir (agent c3ana) : neuf notions de plus pour la 3e du Collège (programme : tools/programme_3e_4e_college.md).
// M3C02 Limites et continuité : limites, limitinf, asymptotes, continuite. M3C03 : derivseconde, etudefct.
// M3C05 Combinatoire et probabilités : combi, probaxiomes, probarbre. Même standard que les notions ci-dessus
// (3 niveaux, au moins 3 formes, pas à pas, pièges, ctx, leçon, indice, 3 compétences, problème de niveau 4 aux
// valeurs tirées au hasard). Réponses : nombre, ensemble (« ; »), couple « x ; y » ou intervalle ; jamais de mots.
// Bloc autonome (ses propres outils) : il s'ajoute sans toucher aux neuf notions de dérivation.
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const ri = R.int;
  const r6 = (v) => +(+v).toFixed(9);
  const den = (v) => { for (let d = 1; d <= 1000; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };
  /* nombres : virgule décimale, ' pour les milliers dès 1'000 ; D en TeX, T en texte simple */
  const grp = (v, sep, dp) => { const [i, f] = String(+(+v).toFixed(8)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i) + (f ? dp + f : ""); };
  const D = (v) => grp(v, "\\text{'}", "{,}");
  const T = (v) => grp(v, "'", ",").replace(/^-/, "−");
  /* fraction exacte en TeX (sinon décimal), fraction tapée a/b, fraction en texte simple */
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 400) return D(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  const fX = (v) => fS(v).replace(/^-/, "−");
  const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const lt = (c) => (c === 1 ? " + x" : c === -1 ? " - x" : sg(c) + "x"); /* terme en x précédé de son signe */
  const P2 = (cs, x = "x") => poly(ptrim(cs), x);
  const pv = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  const dP = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
  const xm = (p, x = "x") => (p === 0 ? x : p > 0 ? x + " - " + fT(p) : x + " + " + fT(-p)); /* x − p en TeX */
  const xmT = (p) => (p === 0 ? "x" : p > 0 ? "x − " + fX(p) : "x + " + fX(-p));
  const pT = (cs) => poly(ptrim(cs)).replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³").replace(/\^\{?4\}?/g, "⁴").replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/-/g, "−");
  const setT = (vs) => "\\{" + [...vs].sort((a, b) => a - b).map(fT).join(" \\,;\\, ") + "\\}";
  const cases = (e1, c1, e2, c2) => "f(x) = \\begin{cases} " + e1 + " & \\text{si } " + c1 + " \\\\ " + e2 + " & \\text{si } " + c2 + " \\end{cases}";
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const Cb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  const bn = (n, k) => "\\binom{" + n + "}{" + k + "}";
  const PL = (fns, pts, o = {}) => { const yr = o.yr || [-6, 6]; return FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6], maxH: 300 }, yr[1] - yr[0] > 11 ? { step: 2 } : {}, o)); };
  /* Téléphone 360 px : formule longue découpée aux « = », « ⟺ », « ≈ » de premier niveau (comme ch4c_ana.js) */
  const vis = (t) => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b)).replace(/\\[a-zA-Z]+/g, "x").replace(/\\[,;!]|[{}\s]/g, "");
  const cut = (t) => { const out = []; let d = 0, last = 0;
    for (let i = 0; i < t.length; i++) { const c = t[i];
      if (c === "{") d++; else if (c === "}") d--; else if (t.startsWith("\\left", i)) d++; else if (t.startsWith("\\right", i)) d--;
      else if (d === 0 && i > last + 1) { const m = /^ (=|\\iff|\\approx) /.exec(t.slice(i)); if (m) { out.push(t.slice(last, i)); last = i + 1; i += m[0].length - 2; } } }
    out.push(t.slice(last)); return out; };
  const wrapM = (h) => (typeof h !== "string" ? h : h.replace(/\\\((.*?)\\\)/g, (m, t) => { if (/\\begin/.test(t) || vis(t).length <= 22) return m; const ps = cut(t); if (ps.length < 2) return m;
    const ch = []; let cur = ""; for (const p of ps) { if (cur && vis(cur + p).length > 22) { ch.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; } ch.push(cur);
    return ch.map((c) => "\\(" + c + "\\)").join(" "); }));
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => { const seen = new Set(), tol = Math.max(spec.round || 0, 1e-9); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(r6).sort((a, b) => a - b).join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (tr.spec) { const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false); if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
    if (spec.kind !== "value") return false;
    const k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
    if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
  const mk = (q, spec, sol, o) => { const x = { q: wrapM(q), spec, sol: wrapM(sol), guide: (o.guide || []).map((g) => Object.assign({}, g, { ask: wrapM(g.ask), sol: wrapM(g.sol) })), ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value: r6(value) }, sol, o);
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const G = (ask, value, sol) => GS(ask, r6(value), sol);
  const dS3 = (v) => D(+(+v).toFixed(3)); /* décimal au millième, en TeX */
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const TR = (v, m) => TRAP(r6(v), m);
  const TSt = (s, m) => ({ s, m });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  /* problème en plusieurs étapes : parts [libellé, valeur ou spec, arrondi] */
  const P = (q, parts, hints, sol, fig) => ({ fig, q: wrapM(q), sol: wrapM(sol), hints, parts: parts.map(([label, v, round]) => ({ label, spec: v && typeof v === "object" ? v : Object.assign({ kind: "value", value: r6(v) }, round ? { round } : {}) })) });
  const SET = (vals) => ({ kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) });
  const lim = (to) => "\\lim_{x \\to " + to + "}";
  const ITEMS = [["boules", "rouges", "bleues", "rouge", "bleue"], ["billes", "vertes", "jaunes", "verte", "jaune"], ["perles", "noires", "blanches", "noire", "blanche"]];

  // ======================= limites : lecture, calcul direct, forme 0/0 (3.AN.01a, 3.AN.01b) =======================
  const LI = {
    1: [
      () => { const x0 = ri(-2, 2), V = [-4, -3, -2, 2, 3, 4], L1 = pk(V), L2 = pk(V), m1 = pk([1, -1, 0.5, -0.5]), m2 = pk([1, -1, 0.5, -0.5]), g = R.rand() < 0.5, v = g ? L1 : L2;
        if (Math.abs(L1 - L2) < 2 || v === x0) return null;
        const f1 = (x) => L1 + m1 * (x - x0), f2 = (x) => L2 + m2 * (x - x0), cond = g ? "x < " + x0 : "x > " + x0;
        return QN("Le graphique représente une fonction " + M("f") + " (le point plein donne " + M("f(" + x0 + ")") + "). Que vaut " + M("\\lim_{x \\to " + x0 + ",\\; " + cond + "} f(x)") + " ?", v,
          "Quand " + M("x") + " s'approche de " + M(x0) + (g ? " par la gauche" : " par la droite") + ", la courbe se dirige vers la hauteur " + M(v) + ". " + (g ? "Ici, la limite à gauche (" + M(L1) + ") n'est pas égale à la limite à droite (" + M(L2) + ") : la courbe fait un saut." : "Ici, la limite à droite est égale à " + M("f(" + x0 + ")") + "."),
          { ctx: g ? "lecture-gauche" : "lecture-droite", fig: PL([{ f: f1, to: x0, cls: "f-accent" }, { f: f2, from: x0, cls: "f-accent" }], [[x0, L2, ""]]),
            guide: [G("Suis la courbe " + (g ? "à gauche" : "à droite") + " de " + M("x = " + x0) + " en te rapprochant de cette abscisse : vers quelle hauteur va-t-elle ?", v, M(v) + ".")],
            traps: [TR(g ? L2 : L1, g ? "C'est la limite à droite (et f(" + T(x0) + ")) : on demande x < " + T(x0) + ", à gauche." : "C'est la limite à gauche : on demande x > " + T(x0) + ", à droite."), TR(-v, "Vérifie le signe de la hauteur lue."), TR(x0, "C'est l'abscisse ; la limite se lit sur l'axe vertical.")] }); },
      () => { const a = nz(-4, 4), p = pk([1, 2, -1, 3, -2]), q = nz(-6, 6), r = ri(-6, 6), cs = [p, q, r], v = pv(cs, a); if (Math.abs(v) <= 1) return null;
        return QN("Calcule " + M(lim(a) + " \\left(" + P2(cs) + "\\right)") + ".", v, "Un polynôme est continu : sa limite en " + M(a) + " est sa valeur en " + M(a) + ". " + M(fT(p) + " \\cdot " + par(a) + "^2" + (q < 0 ? " - " : " + ") + Math.abs(q) + " \\cdot " + par(a) + (r ? sg(r) : "") + " = " + v) + ".",
          { ctx: "polynome", guide: [G("Valeur de " + M(P2([p, 0, 0])) + " en " + M("x = " + a) + " ?", p * a * a, M(p * a * a) + "."), G("Valeur de " + M(P2([q, 0])) + " en " + M("x = " + a) + " ?", q * a, M(q * a) + "."), G("Limite ?", v, M(v) + ".")],
            traps: [TR(pv(cs, -a), "Remplace x par " + T(a) + " avec son signe."), TR(2 * p * a + q * a + r, "x² = x · x, pas 2x."), TR(p * a * a + q + r, "Le terme en x se multiplie aussi par " + T(a) + ".")] }); },
      () => { const a = nz(-4, 4), b = nz(-5, 5), c = ri(-6, 6), d = pk([1, 2, 3, -1, -2]), e = ri(-6, 6), N = b * a + c, Dn = d * a + e; if (!Dn || !N || Math.abs(N) === Math.abs(Dn) || b * Dn === d * N) return null; const v = N / Dn;
        return QN("Calcule " + M(lim(a) + " \\frac{" + P2([b, c]) + "}{" + P2([d, e]) + "}") + ".", v, "Le dénominateur ne s'annule pas en " + M(a) + " : on remplace " + M("x") + " par " + M(a) + ". " + M("\\frac{" + N + "}{" + Dn + "}" + (den(v) < Math.abs(Dn) ? " = " + fT(v) : "")) + ".",
          { ctx: "rationnelle-directe", guide: [G("Numérateur en " + M("x = " + a) + " ?", N, M(N) + "."), G("Dénominateur en " + M("x = " + a) + " ?", Dn, M(Dn) + " : il n'est pas nul, on peut diviser."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(Dn / N, "Numérateur divisé par dénominateur, pas l'inverse."), TR(b / d, "C'est la limite à l'infini ; ici x tend vers " + T(a) + "."), TR(-v, "Attention aux signes.")] }); },
    ],
    2: [
      () => { const a = nz(-5, 5), b = ri(-6, 6); if (Math.abs(a - b) < 2) return null; const v = a - b, num = [1, -(a + b), a * b];
        return QN("Calcule " + M(lim(a) + " \\frac{" + P2(num) + "}{" + xm(a) + "}") + ".", v,
          "En " + M(a) + " : forme " + M("\\frac{0}{0}") + ". " + M(P2(num) + " = (" + xm(a) + ")(" + xm(b) + ")") + ", donc le quotient vaut " + M(xm(b)) + " pour " + M("x \\neq " + a) + " ; limite " + M(a + " - " + par(b) + " = " + v) + ".",
          { ctx: "factorisation", guide: [G("Le numérateur s'annule en " + M(a) + " : il se factorise en " + M("(" + xm(a) + ")(x - b)") + ". Que vaut " + M("b") + " ?", b, M(b) + "."), G("Après simplification, il reste " + M(xm(b)) + ". Limite en " + M(a) + " ?", v, M(v) + ".")],
            traps: [TR(0, "0 ÷ 0 n'est pas un résultat : simplifie d'abord par (" + xmT(a) + ")."), TR(b - a, "Il reste " + xmT(b) + " : en x = " + T(a) + ", cela donne " + T(a) + " − (" + T(b) + ")."), TR(a + b, "Factorise le numérateur, simplifie, puis remplace x.")] }); },
      () => { const a = nz(-4, 4), c = ri(-5, 5); if (c === a || c === -a) return null; const v = (2 * a) / (a - c); if (Math.abs(v) === 1) return null; const num = [1, 0, -a * a], dn = [1, -(a + c), a * c];
        return QN("Calcule " + M(lim(a) + " \\frac{" + P2(num) + "}{" + P2(dn) + "}") + ".", v,
          "Forme " + M("\\frac{0}{0}") + ". " + M(P2(num) + " = (" + xm(a) + ")(" + xm(-a) + ")") + " et " + M(P2(dn) + " = (" + xm(a) + ")(" + xm(c) + ")") + ". On simplifie : " + M("\\frac{" + xm(-a) + "}{" + xm(c) + "}") + ", qui tend vers " + M("\\frac{" + 2 * a + "}{" + (a - c) + "}" + (den(v) < Math.abs(a - c) ? " = " + fT(v) : "")) + ".",
          { ctx: "deux-factorisations", guide: [G("Après simplification par " + M("(" + xm(a) + ")") + ", le numérateur devient " + M(xm(-a)) + ". Sa valeur en " + M(a) + " ?", 2 * a, M(2 * a) + "."), G("Le dénominateur devient " + M(xm(c)) + ". Sa valeur en " + M(a) + " ?", a - c, M(a - c) + "."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(0, "0 ÷ 0 n'est pas un résultat : factorise et simplifie."), TR((a - c) / (2 * a), "Numérateur divisé par dénominateur, pas l'inverse."), a + c ? TR((2 * a) / (a + c), "Le dénominateur se factorise en (x − " + T(a) + ")(" + xmT(c) + ").") : null] }); },
      () => { const a = pk([2, 3, -2, -3, 4]), v = 3 * a * a;
        return QN("Calcule " + M(lim(a) + " \\frac{" + P2([1, 0, 0, -(a ** 3)]) + "}{" + xm(a) + "}") + ".", v,
          "Forme " + M("\\frac{0}{0}") + ". " + M(P2([1, 0, 0, -(a ** 3)]) + " = (" + xm(a) + ")(" + P2([1, a, a * a]) + ")") + " : le quotient vaut " + M(P2([1, a, a * a])) + ", qui tend vers " + M(a * a + sg(a * a) + sg(a * a) + " = " + v) + ".",
          { ctx: "cube", guide: [G("On factorise : " + M(P2([1, 0, 0, -(a ** 3)]) + " = (" + xm(a) + ")(" + P2([1, a, a * a]) + ")") + ". Valeur de " + M(P2([1, a, a * a])) + " en " + M("x = " + a) + " ?", v, M(v) + ".")],
            traps: [TR(a * a, "Les trois termes valent chacun " + T(a * a) + " en x = " + T(a) + "."), TR(3 * a, "En x = " + T(a) + ", x² vaut " + T(a * a) + "."), TR(0, "0 ÷ 0 n'est pas un résultat : factorise d'abord.")] }); },
    ],
    3: [
      () => { const c = ri(2, 5), a = nz(-4, 6), b = c * c - a, v = 1 / (2 * c), rt = "\\sqrt{" + P2([1, b]) + "}";
        return QN("Calcule " + M(lim(a) + " \\frac{" + rt + " - " + c + "}{" + xm(a) + "}") + ".", v,
          "Forme " + M("\\frac{0}{0}") + ". On multiplie par la quantité conjuguée " + M(rt + " + " + c) + " : le numérateur devient " + M(P2([1, b]) + " - " + c * c + " = " + xm(a)) + ", d'où " + M("\\frac{1}{" + rt + " + " + c + "}") + ", qui tend vers " + M("\\frac{1}{" + 2 * c + "}") + ".",
          { ctx: "conjuguee", guide: [G("Après multiplication par la quantité conjuguée et simplification, il reste " + M("\\frac{1}{" + rt + " + " + c + "}") + ". Valeur du dénominateur en " + M(a) + " ?", 2 * c, M(c + " + " + c + " = " + 2 * c) + "."), G("Limite ?", v, M("\\frac{1}{" + 2 * c + "}") + ".")],
            traps: [TR(1 / c, "Le dénominateur tend vers " + c + " + " + c + " = " + 2 * c + "."), TR(2 * c, "C'est le dénominateur : la limite est son inverse."), TR(0, "0 ÷ 0 n'est pas un résultat : utilise la quantité conjuguée.")] }); },
      () => { const a = pk([2, 3, 4, 5, -2, -3, -4]), v = -1 / (a * a), fr = "\\frac{1}{x}" + (a > 0 ? " - \\frac{1}{" + a + "}" : " + \\frac{1}{" + -a + "}");
        return QN("Calcule " + M(lim(a) + " \\frac{" + fr + "}{" + xm(a) + "}") + ".", v,
          M(fr + " = \\frac{" + a + " - x}{" + a + "x} = \\frac{-(" + xm(a) + ")}{" + a + "x}") + " ; après division par " + M("(" + xm(a) + ")") + ", il reste " + M("\\frac{-1}{" + a + "x}") + ", qui tend vers " + M("\\frac{-1}{" + a * a + "}") + ".",
          { ctx: "fractions-etagees", guide: [G("Au même dénominateur, puis après division par (" + xmT(a) + "), il reste −1 ÷ (" + T(a) + "x). Valeur de " + M(a + "x") + " en " + M("x = " + a) + " ?", a * a, M(a * a) + "."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(1 / (a * a), "Signe : 1/x − 1/a = (a − x) ÷ (ax), et a − x = −(x − a)."), TR(-1 / a, "Le dénominateur " + T(a) + "x tend vers " + T(a * a) + "."), TR(0, "0 ÷ 0 n'est pas un résultat : réduis au même dénominateur.")] }); },
      () => { const a = nz(-4, 4), b = nz(-5, 5); if (b === a || Math.abs(a + b) < 2) return null; const c = a * b, k = -(a + b), ka = a === 1 ? " + k" : a === -1 ? " - k" : (a < 0 ? " - " + -a : " + " + a) + "k";
        return QN("Pour quelle valeur de " + M("k") + " la limite " + M(lim(a) + " \\frac{x^2 + kx" + sg(c) + "}{" + xm(a) + "}") + " est-elle un nombre (finie) ?", k,
          "Le dénominateur s'annule en " + M(a) + " : il faut que le numérateur s'annule aussi (forme " + M("\\frac{0}{0}") + "). " + M(a * a + ka + sg(c) + " = 0") + ", donc " + M("k = " + k) + ". Alors " + M("x^2" + lt(k) + sg(c) + " = (" + xm(a) + ")(" + xm(b) + ")") + " et la limite vaut " + M(a - b) + ".",
          { ctx: "parametre", guide: [G("Il faut que le numérateur s'annule en " + M("x = " + a) + " : " + M(a * a + ka + sg(c) + " = 0") + ". Que vaut " + M(a + " \\cdot k") + " ?", -(a * a + c), M(-(a * a + c)) + "."), G(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(a + b, "Vérifie le signe : " + T(a * a) + (a < 0 ? " − " + T(-a) : " + " + T(a)) + "k + " + T(c) + " = 0."), Math.abs(a) > 1 ? TR(-(a * a + c), "C'est " + T(a) + "k : divise encore par " + T(a) + ".") : null, TR(b, "C'est l'autre racine du numérateur, pas k.")] }); },
    ],
  };

  // ======================= limitinf : limites à l'infini (3.AN.01c) =======================
  const LF = {
    1: [
      () => { const a = nz(-6, 6), d = pk([2, 3, 4, 5, -2, -3]), b = ri(-5, 5), c = nz(-7, 7), e = nz(-7, 7), v = a / d, inf = pk(["+\\infty", "-\\infty"]); if (Math.abs(v) === 1) return null;
        return QN("Calcule " + M(lim(inf) + " \\frac{" + P2([a, b, c]) + "}{" + P2([d, 0, e]) + "}") + ".", v, "À l'infini, seuls les termes de plus haut degré comptent : " + M("\\frac{" + P2([a, 0, 0]) + "}{" + P2([d, 0, 0]) + "} = " + fT(v)) + ".",
          { ctx: "degres-egaux", guide: [G("Terme dominant du numérateur : son coefficient ?", a, M(P2([a, 0, 0])) + "."), G("Terme dominant du dénominateur : son coefficient ?", d, M(P2([d, 0, 0])) + "."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(c / e, "C'est la valeur en x = 0 ; à l'infini, ce sont les termes de plus haut degré qui comptent."), TR(d / a, "Numérateur divisé par dénominateur, pas l'inverse."), TR(-v, "Les deux termes dominants sont en x² : le signe de x ne change rien.")] }); },
      () => { const k = pk([-5, -4, -3, -2, 2, 3, 4, 5]), m = pk([2, 3, 5, 7, -2, -3, -5, -7]), xs = [10, 100, 1000, 10000], ys = xs.map((x) => r6(k + m / x));
        return QN("Voici quelques valeurs d'une fonction " + M("f") + " :<br>" + M("\\begin{array}{c|c|c|c|c} x & 10 & 100 & 1\\text{'}000 & 10\\text{'}000 \\\\ \\hline f(x) & " + ys.map(D).join(" & ") + " \\end{array}") + "<br>Quelle est, vraisemblablement, " + M(lim("+\\infty") + " f(x)") + " ?", k,
          "Quand " + M("x") + " grandit, " + M("f(x)") + " se rapproche de " + M(k) + " : l'écart (" + M(D(ys[0] - k)) + ", puis " + M(D(r6(ys[1] - k))) + ", …) est divisé par 10 à chaque fois. " + M(lim("+\\infty") + " f(x) = " + k) + ".",
          { ctx: "tableau-valeurs", guide: [G("Les valeurs se rapprochent d'un nombre entier quand " + M("x") + " grandit. Lequel ?", k, M(k) + ".")],
            traps: [TR(ys[0], "C'est f(10) : regarde ce que deviennent les valeurs pour x très grand."), TR(0, "f(x) ne devient pas petit : c'est l'écart à " + T(k) + " qui tend vers 0."), TR(-k, "Vérifie le signe des valeurs.")] }); },
      () => { const C = pk([["Après une injection, la concentration d'un médicament dans le sang vaut", "C(t)", "mg/L", "heures", "concentration", [3, 4, 5, 6, 8, 12]], ["Le nombre d'abonnés à une nouvelle application vaut", "N(t)", "milliers d'abonnés", "mois", "abonnes", [12, 15, 24, 40, 45]], ["La vitesse d'un parachutiste, parachute fermé, vaut", "v(t)", "m/s", "secondes", "parachutiste", [48, 50, 52, 54, 55]]]);
        const L = pk(C[5]), k = pk([2, 3, 4]), b = ri(2, 9), a = k * L; if (b === L) return null;
        return QN(C[0] + " " + M(C[1] + " = \\frac{" + a + "t}{" + k + "t + " + b + "}") + " (" + M("t") + " en " + C[3] + "). Vers quelle valeur (en " + C[2] + ") tend-elle quand " + M("t") + " devient très grand ?", L,
          "Pour " + M("t") + " très grand, " + M(k + "t + " + b + " \\approx " + k + "t") + " : " + M("\\frac{" + a + "t}{" + k + "t} = " + L) + ". " + M("\\lim_{t \\to +\\infty} " + C[1] + " = " + L) + " " + C[2] + ".",
          { ctx: C[4], guide: [G("Pour t très grand, " + k + "t + " + b + " ≈ " + k + "t. Simplifie " + M("\\frac{" + a + "t}{" + k + "t}") + " :", L, M(L) + ".")],
            traps: [TR(a, "Divise par " + k + " : au dénominateur, " + k + "t + " + b + " ≈ " + k + "t."), TR(a / b, "Le terme " + b + " ne compte plus quand t est très grand."), TR(0, "Le numérateur grandit aussi : la limite n'est pas 0.")] }); },
    ],
    2: [
      () => { const a = pk([2, 3, -2, -3, 4]), c = pk([2, 3, 5, 6, 8, 12]), b = nz(-5, 5), d = nz(-9, 9), v = (a * a) / c, inf = pk(["+\\infty", "-\\infty"]); if (Math.abs(v) === 1) return null;
        return QN("Calcule " + M(lim(inf) + " \\frac{(" + P2([a, b]) + ")^2}{" + P2([c, 0, d]) + "}") + ".", v, "Développé, le numérateur commence par " + M("(" + a + "x)^2 = " + a * a + "x^2") + ". Termes dominants : " + M("\\frac{" + a * a + "x^2}{" + c + "x^2} = " + fT(v)) + ".",
          { ctx: "carre", guide: [G("Terme de plus haut degré du numérateur : son coefficient ?", a * a, M("(" + a + "x)^2 = " + a * a + "x^2") + "."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(a / c, "Le carré porte aussi sur " + T(a) + "x : (" + T(a) + "x)² = " + T(a * a) + "x²."), TR((2 * a) / c, "Le terme en x² vient de (" + T(a) + "x)², pas du double produit."), TR(-v, "Un carré est positif, et " + c + "x² aussi.")] }); },
      () => { const a = pk([1, 2, 3, -2, -1]), c = nz(-5, 5), b = nz(-9, 9), v = -a * c; if (Math.abs(v) < 2) return null;
        const ax = a > 0 ? " - " + (a === 1 ? "" : a) + "x" : " + " + (a === -1 ? "" : -a) + "x";
        return QN("Calcule " + M(lim("+\\infty") + " \\left(\\frac{" + P2([a, 0, b]) + "}{" + xm(-c) + "}" + ax + "\\right)") + ".", v,
          "Forme « ∞ − ∞ ». Au même dénominateur : " + M("\\frac{" + P2([a, 0, b]) + " - " + (a === 1 ? "" : a === -1 ? "-" : a) + "x(" + xm(-c) + ")}{" + xm(-c) + "} = \\frac{" + P2([-a * c, b]) + "}{" + xm(-c) + "}") + ", qui tend vers " + M("\\frac{" + (-a * c) + "x}{x} = " + v) + ".",
          { ctx: "difference", guide: [G("Au même dénominateur, le numérateur devient un polynôme de degré 1 : " + M(P2([-a * c, b])) + ". Son coefficient de " + M("x") + " ?", -a * c, M(-a * c) + "."), G("Limite ?", v, M(v) + ".")],
            traps: [TR(a * c, "Signe : le terme " + T(a) + "x(" + xmT(-c) + ") se soustrait en entier."), TR(0, "« ∞ − ∞ » n'est pas 0 : réduis au même dénominateur."), TR(b, "Le terme constant ne compte plus à l'infini ; c'est le coefficient de x qui donne la limite.")] }); },
      () => { const a = nz(-6, 6), c = pk([1, 2, 3, -1, -2]), e = pk([2, 3, 4, -2]), d = nz(-5, 5), f = nz(-5, 5), b = ri(-5, 5), v = a / (c * e), inf = pk(["+\\infty", "-\\infty"]); if (Math.abs(v) === 1) return null;
        return QN("Calcule " + M(lim(inf) + " \\frac{" + P2([a, b, 0]) + "}{(" + P2([c, d]) + ")(" + P2([e, f]) + ")}") + ".", v, "Le dénominateur développé commence par " + M(P2([c * e, 0, 0])) + ". Termes dominants : " + M("\\frac{" + P2([a, 0, 0]) + "}{" + P2([c * e, 0, 0]) + "} = " + fT(v)) + ".",
          { ctx: "produit", guide: [G("Terme dominant du dénominateur (produit des deux termes en x) : son coefficient ?", c * e, M(P2([c * e, 0, 0])) + "."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [c + e ? TR(a / (c + e), "Les termes en x se multiplient : (" + pT([c, 0]) + ")(" + pT([e, 0]) + ") = " + pT([c * e, 0, 0]) + ".") : null, TR(a / c, "Le second facteur compte aussi."), TR(-v, "Les deux termes dominants sont en x² : le signe de x ne change rien.")] }); },
    ],
    3: [
      () => { const a = pk([3, 4, 5, 6, 7, 8, -3, -4, -5, -6, -7, -8]), v = a / 2;
        return QN("Calcule " + M(lim("+\\infty") + " \\left(\\sqrt{" + P2([1, a, 0]) + "} - x\\right)") + ".", v,
          "Forme « ∞ − ∞ ». Quantité conjuguée : " + M("\\frac{(" + P2([1, a, 0]) + ") - x^2}{\\sqrt{" + P2([1, a, 0]) + "} + x} = \\frac{" + P2([a, 0]) + "}{\\sqrt{" + P2([1, a, 0]) + "} + x}") + ". Pour " + M("x") + " très grand, le dénominateur vaut environ " + M("2x") + " : " + M("\\frac{" + P2([a, 0]) + "}{2x} = " + fT(v)) + ".",
          { ctx: "conjuguee-infini", guide: [G("Après multiplication par la quantité conjuguée, le numérateur devient " + M("kx") + ". Que vaut " + M("k") + " ?", a, M(P2([a, 0])) + "."), G("Le dénominateur " + M("\\sqrt{" + P2([1, a, 0]) + "} + x") + " vaut environ combien de fois " + M("x") + " ?", 2, M("x + x = 2x") + "."), G("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(a, "Le dénominateur √(x² + …) + x vaut environ 2x, pas x."), TR(0, "« ∞ − ∞ » n'est pas 0 : multiplie par la quantité conjuguée."), TR(-v, "Vérifie le signe.")] }); },
      () => { const a = pk([2, 3, 4, 5, -2, -3, -4, -5]), b = nz(-6, 6), c = pk([1, 3, 4, 5, 9]), v = -a;
        return QN("Calcule " + M(lim("-\\infty") + " \\frac{" + P2([a, b]) + "}{\\sqrt{" + P2([1, 0, c]) + "}}") + ".", v,
          "Pour " + M("x") + " très négatif, " + M("\\sqrt{" + P2([1, 0, c]) + "} \\approx \\sqrt{x^2} = |x| = -x") + ". Donc " + M("\\frac{" + P2([a, 0]) + "}{-x} = " + v) + ".",
          { ctx: "racine-moins-infini", guide: [G("Pour " + M("x < 0") + ", " + M("\\sqrt{x^2} = |x| = kx") + ". Que vaut " + M("k") + " ?", -1, M("|x| = -x") + " pour " + M("x < 0") + "."), G("Limite ?", v, M(v) + ".")],
            traps: [TR(a, "Pour x < 0, √(x²) = |x| = −x, pas x."), TR(0, "Numérateur et dénominateur sont tous deux « de degré 1 »."), TR(b, "Le terme constant ne compte plus à l'infini.")] }); },
      () => { const c = pk([2, 3, 4, 5]), L = pk([2, 3, -2, -3, 1.5, -1.5, 2.5, 0.5, -0.5]), k = r6(c * L); if (!Number.isInteger(k) || Math.abs(k) < 2) return null; const b = nz(-6, 6), d = nz(-9, 9);
        return QN("Pour quelle valeur de " + M("k") + " a-t-on " + M(lim("+\\infty") + " \\frac{kx^2" + lt(b) + "}{" + P2([c, 0, d]) + "} = " + fT(L)) + " ?", k,
          "La limite vaut " + M("\\frac{k}{" + c + "}") + " (termes dominants). " + M("\\frac{k}{" + c + "} = " + fT(L) + " \\iff k = " + k) + ".",
          { ctx: "parametre-infini", guide: [G("La limite est le quotient des coefficients dominants : " + M("\\frac{k}{" + c + "}") + ". Résous " + M("\\frac{k}{" + c + "} = " + fT(L)) + " : " + M("k") + " ?", k, M(k) + ".")],
            traps: [TR(L, "La limite vaut k ÷ " + c + " : multiplie par " + c + "."), TR(L / c, "On multiplie par " + c + ", on ne divise pas."), TR(-k, "Vérifie le signe.")] }); },
    ],
  };

  // ======================= asymptotes : verticales, horizontales, obliques (3.AN.01d, 3.AN.01e) =======================
  const AS = {
    1: [
      () => { const a = nz(-5, 5), b = ri(-6, 6), k = pk([2, 3, 4, -2]), c = pk([-5, -4, -3, -2, 2, 3, 4, 5]); if (a * c + b === 0) return null;
        return QN("Soit " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([k, -k * c]) + "}") + ". Son asymptote verticale a pour équation " + M("x = c") + ". Que vaut " + M("c") + " ?", c,
          "Le dénominateur s'annule en " + M("x = " + c) + ", et le numérateur n'y vaut pas 0 (" + M(a * c + b) + ") : asymptote verticale " + M("x = " + c) + ".",
          { ctx: "verticale", guide: [G("Résous " + M(P2([k, -k * c]) + " = 0") + " : " + M("x") + " ?", c, M("x = " + c) + ".")],
            traps: [TR(-c, "Résous " + pT([k, -k * c]) + " = 0 : vérifie le signe."), b ? TR(-b / a, "C'est là que le numérateur s'annule (f vaut 0) ; l'asymptote vient du dénominateur.") : null, TR(-k * c, "Résous l'équation : divise par " + T(k) + ".")] }); },
      () => { const a = nz(-6, 6), c = pk([2, 3, 4, 5, -2, -3]), b = ri(-6, 6), d = nz(-6, 6), v = a / c; if (Math.abs(v) === 1 || a * d === b * c) return null;
        return QN("L'asymptote horizontale de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([c, d]) + "}") + " a pour équation " + M("y = k") + ". Que vaut " + M("k") + " ?", v,
          "À l'infini, " + M("f(x) \\approx \\frac{" + P2([a, 0]) + "}{" + P2([c, 0]) + "} = " + fT(v)) + " : asymptote horizontale " + M("y = " + fT(v)) + ".",
          { ctx: "horizontale", guide: [G("Limite de " + M("f(x)") + " à l'infini (quotient des coefficients de " + M("x") + ") ?", v, M(fT(v)) + ".")],
            traps: [b ? TR(b / d, "C'est f(0) ; l'asymptote horizontale est la limite à l'infini.") : null, TR(c / a, "Numérateur divisé par dénominateur, pas l'inverse."), TR(-d / c, "C'est l'asymptote verticale (x = …).")] }); },
      () => { const V = [-4, -3, -2, 2, 3, 4], c = pk(V), k = pk(V), m = pk([1, 2, -1, -2, 3, -3]), askV = R.rand() < 0.5, v = askV ? c : k;
        return QN("La courbe de " + M("f") + " a deux asymptotes (en pointillés). " + (askV ? "L'asymptote verticale a pour équation " + M("x = a") + ". Que vaut " + M("a") : "L'asymptote horizontale a pour équation " + M("y = b") + ". Que vaut " + M("b")) + " ?", v,
          "Asymptote verticale " + M("x = " + c) + " (la courbe file vers l'infini près de cette droite) ; asymptote horizontale " + M("y = " + k) + " (la courbe s'en approche quand " + M("x") + " devient très grand).",
          { ctx: askV ? "lecture-verticale" : "lecture-horizontale", fig: PL([{ f: (x) => k + m / (x - c) }], [], { vlines: [c], hlines: [k] }),
            guide: [G(askV ? "La droite verticale en pointillés coupe l'axe horizontal en ?" : "La droite horizontale en pointillés coupe l'axe vertical en ?", v, M(v) + ".")],
            traps: [TR(askV ? k : c, askV ? "C'est l'asymptote horizontale (y = …)." : "C'est l'asymptote verticale (x = …)."), TR(-v, "Lis le signe sur l'axe.")] }); },
    ],
    2: [
      () => { const r1 = nz(-5, 5), r2 = nz(-5, 5), a = nz(-4, 4), b = ri(-6, 6); if (r1 === r2 || r1 === -r2 || a * r1 + b === 0 || a * r2 + b === 0) return null; const dn = [1, -(r1 + r2), r1 * r2];
        return QSet("Quelles sont les asymptotes verticales de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2(dn) + "}") + " ? Donne les nombres " + M("a") + " des équations " + M("x = a") + ", séparés par « ; ».", [r1, r2],
          M(P2(dn) + " = (" + xm(r1) + ")(" + xm(r2) + ")") + " s'annule en " + M(r1) + " et en " + M(r2) + ", où le numérateur n'est pas nul : asymptotes " + M("x = " + Math.min(r1, r2)) + " et " + M("x = " + Math.max(r1, r2)) + ".",
          { ctx: "deux-verticales", guide: [GSet("Zéros du dénominateur " + M(P2(dn)) + " ?", [r1, r2], M(setT([r1, r2])) + ".")],
            traps: [TSt([-r1, -r2], "Les zéros de (x − a)(x − b) sont a et b : attention aux signes."), TSt([r1], "Le dénominateur a deux zéros : deux asymptotes."), TSt([r2], "Le dénominateur a deux zéros : deux asymptotes.")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = ri(-5, 5); if (a === b || c === a || c === b) return null; const num = [1, -(a + c), a * c], dn = [1, -(a + b), a * b];
        return QSet("Quelles sont les asymptotes verticales de " + M("f(x) = \\frac{" + P2(num) + "}{" + P2(dn) + "}") + " ? Donne les nombres " + M("a") + " des équations " + M("x = a") + " (séparés par « ; » s'il y en a plusieurs).", [b],
          M("f(x) = \\frac{(" + xm(a) + ")(" + xm(c) + ")}{(" + xm(a) + ")(" + xm(b) + ")}") + ". En " + M(a) + ", on simplifie : la courbe a un « trou », pas d'asymptote. Seule asymptote verticale : " + M("x = " + b) + ".",
          { ctx: "trou", guide: [GSet("Zéros du dénominateur ?", [a, b], M(setT([a, b])) + "."), GSet("Lesquels n'annulent pas aussi le numérateur ?", [b], M(b) + " (en " + M(a) + ", on simplifie).")],
            traps: [TSt([a, b], "En x = " + T(a) + ", numérateur et dénominateur s'annulent : après simplification, la limite est finie (un « trou »)."), TSt([a], "En x = " + T(a) + ", on simplifie par (" + xmT(a) + ") : pas d'asymptote là."), TSt([-b], "x − b = 0 donne x = b : attention au signe.")] }); },
      () => { const x0 = nz(-4, 4), c = pk([1, 2, 3, -1, -2]), a = nz(-6, 6), d = -c * x0, b = ri(-6, 6), y0 = a / c; if (a * d === b * c) return null;
        return QP("Les deux asymptotes de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([c, d]) + "}") + " se coupent en un point. Donne ses coordonnées « x ; y ».", [x0, y0],
          "Asymptote verticale " + M("x = " + x0) + " (le dénominateur s'annule), asymptote horizontale " + M("y = " + fT(y0)) + " (quotient des coefficients de " + M("x") + ") : point " + M("(" + x0 + " \\,;\\, " + fT(y0) + ")") + ".",
          { ctx: "centre", guide: [G("Asymptote verticale : " + M("x") + " = ?", x0, M(x0) + "."), G("Asymptote horizontale : " + M("y") + " = ?", y0, M(fT(y0)) + "."), GP("Point « x ; y » ?", [x0, y0], M("(" + x0 + " \\,;\\, " + fT(y0) + ")") + ".")],
            traps: [TP([y0, x0], "Abscisse d'abord : celle de l'asymptote verticale."), TP([-x0, y0], "Résous " + pT([c, d]) + " = 0 : vérifie le signe de l'abscisse."), TP([x0, b / d], "L'ordonnée est la limite à l'infini, pas f(0).")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, 3, -1, -2]), d = pk([1, 2, 3, 4, 5]), b = nz(-4, 4), x0 = pk([-4, -3, -2, 2, 3, 4, 5]), c = a * d - b * x0;
        return QN("La courbe de " + M("f(x) = \\frac{" + P2([a, b, c]) + "}{" + P2([1, 0, d]) + "}") + " coupe son asymptote horizontale en un point. Quelle est son abscisse ?", x0,
          "Asymptote horizontale " + M("y = " + a) + ". " + M("f(x) = " + a + " \\iff " + P2([a, b, c]) + " = " + P2([a, 0, a * d]) + " \\iff " + P2([b, c - a * d]) + " = 0 \\iff x = " + x0) + ".",
          { ctx: "croise", guide: [G("Asymptote horizontale : " + M("y") + " = ?", a, M("y = " + a) + "."), G("Résous " + M("f(x) = " + a) + " (multiplie par " + M(P2([1, 0, d])) + ") : " + M("x") + " ?", x0, M("x = " + x0) + ".")],
            traps: [TR(-x0, "Vérifie le signe en résolvant " + pT([b, c - a * d]) + " = 0."), TR(a, "C'est l'ordonnée (l'asymptote y = " + T(a) + ") ; on demande l'abscisse."), c ? TR(-c / b, "Le terme " + T(a * d) + " (le dénominateur multiplié par " + T(a) + ") compte aussi.") : null] }); },
      () => { const a = pk([1, 2, -1, 3, -2]), d = nz(-4, 4), b = ri(-5, 5), c = ri(-6, 6), p = b + a * d, rem = a * d * d + b * d + c; if (!rem || !p) return null;
        return QP("Soit " + M("f(x) = \\frac{" + P2([a, b, c]) + "}{" + xm(d) + "}") + ". Son asymptote oblique a pour équation " + M("y = mx + p") + ". Réponds « m ; p ».", [a, p],
          "Division : " + M(P2([a, b, c]) + " = (" + xm(d) + ")(" + P2([a, p]) + ")" + sg(rem)) + ", donc " + M("f(x) = " + P2([a, p]) + " + \\frac{" + rem + "}{" + xm(d) + "}") + ". La fraction tend vers 0 : asymptote " + M("y = " + P2([a, p])) + ".",
          { ctx: "oblique", guide: [G("Division de " + M(P2([a, b, c])) + " par " + M(xm(d)) + " : coefficient " + M("m") + " du quotient ?", a, M(a) + "."), G("Terme constant " + M("p") + " du quotient ?", p, M(p) + "."), GP("« m ; p » ?", [a, p], M("y = " + P2([a, p])) + ".")],
            traps: [TP([a, b], "Il faut diviser : p n'est pas le coefficient de x du numérateur (p = " + T(b) + " + " + T(a) + " · " + T(d) + ")."), TP([a, b - a * d], "Signe : on divise par (" + xmT(d) + ")."), TP([p, a], "Dans l'ordre : m (la pente) puis p.")] }); },
      () => { const m = ri(2, 6), a = pk([-9, -7, -5, -3, -2, 2, 3, 4, 5, 7]);
        return QSet("Pour quelles valeurs de " + M("k") + " la fonction " + M("f(x) = \\frac{" + a + "}{x^2 + kx + " + m * m + "}") + " a-t-elle une seule asymptote verticale ? (valeurs séparées par « ; »)", [-2 * m, 2 * m],
          "Une seule asymptote : le dénominateur a une seule racine (double), donc " + M("\\Delta = k^2 - " + 4 * m * m + " = 0") + ", " + M("k = \\pm " + 2 * m) + ". (Pour " + M("k = " + 2 * m) + ", " + M("x^2 + " + 2 * m + "x + " + m * m + " = (x + " + m + ")^2") + ".)",
          { ctx: "une-seule-verticale", guide: [G("Discriminant du dénominateur : " + M("\\Delta = k^2 - c") + ". Que vaut " + M("c") + " ?", 4 * m * m, M("4 \\cdot " + m * m + " = " + 4 * m * m) + "."), GSet(M("\\Delta = 0") + " : " + M("k") + " ?", [-2 * m, 2 * m], M("k = \\pm " + 2 * m) + ".")],
            traps: [TSt([2 * m], "k² = " + T(4 * m * m) + " a deux solutions."), TSt([-m, m], "k² = 4 · " + T(m * m) + " : k = ±" + T(2 * m) + "."), TSt([-4 * m * m, 4 * m * m], "C'est k² : prends la racine.")] }); },
    ],
  };

  // ======================= continuite : continuité en un point, fonction par morceaux (3.AN.02a, 3.AN.02b) =======================
  const CO = {
    1: [
      () => { const x0 = nz(-3, 4), a = nz(-4, 4), b = ri(-6, 6), c = nz(-4, 4); if (c === a) return null; const k = (a - c) * x0 + b; if (Math.abs(k) <= 1) return null;
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases(P2([a, b]), "x < " + x0, P2([c, 0]) + " + k", "x \\ge " + x0)) + " est-elle continue en " + M(x0) + " ?", k,
          "Les deux morceaux doivent se rejoindre en " + M(x0) + " : " + M(pv([a, b], x0) + " = " + c * x0 + " + k") + ", donc " + M("k = " + k) + ".",
          { ctx: "affine-morceaux", guide: [G("Valeur du 1er morceau en " + M("x = " + x0) + " ?", a * x0 + b, M(a * x0 + b) + "."), G("Valeur de " + M(P2([c, 0])) + " en " + M("x = " + x0) + " ?", c * x0, M(c * x0) + "."), G(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(a * x0 + b, "C'est la valeur du 1er morceau ; il faut encore retirer " + T(c * x0) + "."), TR(a * x0 + b + c * x0, "On retire " + T(c * x0) + ", on ne l'ajoute pas."), TR(-k, "Vérifie le signe.")] }); },
      () => { const x0 = pk([-3, -2, 2, 3]), V = [-4, -3, -2, 2, 3, 4], L1 = pk(V), L2 = pk(V), m1 = pk([0.5, -0.5, 1, -1]), m2 = pk([0.5, -0.5, 1, -1]), ask = pk(["abs", "saut"]); if (Math.abs(L1 - L2) < 2) return null;
        const fig = PL([{ f: (x) => L1 + m1 * (x - x0), to: x0, cls: "f-accent" }, { f: (x) => L2 + m2 * (x - x0), from: x0, cls: "f-accent" }], [[x0, L2, ""]]);
        if (ask === "abs") return QN("Le graphique représente une fonction " + M("f") + " définie sur " + M("\\mathbb{R}") + " (le point plein est sur la courbe). En quelle abscisse " + M("f") + " n'est-elle pas continue ?", x0,
          "En " + M("x = " + x0) + ", la courbe fait un saut : la limite à gauche (" + M(L1) + ") n'est pas égale à " + M("f(" + x0 + ") = " + L2) + ". On ne peut pas la tracer sans lever le crayon.",
          { ctx: "lecture-saut", fig, guide: [G("Où faut-il lever le crayon pour tracer la courbe ? Abscisse :", x0, M(x0) + ".")],
            traps: [TR(L2, "C'est une ordonnée ; on demande l'abscisse du saut."), TR(L1, "C'est une ordonnée ; on demande l'abscisse du saut."), TR(-x0, "Lis le signe sur l'axe horizontal.")] });
        return QN("Le graphique représente une fonction " + M("f") + " (le point plein donne " + M("f(" + x0 + ")") + "). En " + M("x = " + x0) + ", elle fait un saut. Que vaut " + M("f(" + x0 + ") - \\lim_{x \\to " + x0 + ",\\; x < " + x0 + "} f(x)") + " (la hauteur du saut, avec son signe) ?", L2 - L1,
          "Limite à gauche " + M(L1) + ", " + M("f(" + x0 + ") = " + L2) + " : saut " + M(L2 + " - " + par(L1) + " = " + (L2 - L1)) + ".",
          { ctx: "lecture-hauteur", fig, guide: [G("Limite à gauche (hauteur où arrive la courbe de gauche) ?", L1, M(L1) + "."), G(M("f(" + x0 + ")") + " (le point plein) ?", L2, M(L2) + "."), G("Saut ?", L2 - L1, M(L2 - L1) + ".")],
            traps: [TR(L1 - L2, "Dans l'ordre : f(" + T(x0) + ") moins la limite à gauche."), TR(L2, "C'est f(" + T(x0) + ") ; retire la limite à gauche."), TR(L1, "C'est la limite à gauche.")] }); },
      () => { const a = nz(-5, 5), b = ri(-6, 6), m = pk([2, 3, -2]); if (Math.abs(a - b) < 1) return null; const num = [m, -m * (a + b), m * a * b], k = m * (a - b);
        return QN("On pose " + M("f(x) = \\frac{" + P2(num) + "}{" + xm(a) + "}") + " pour " + M("x \\neq " + a) + ", et " + M("f(" + a + ") = k") + ". Quelle valeur de " + M("k") + " rend " + M("f") + " continue en " + M(a) + " ?", k,
          "Pour " + M("x \\neq " + a) + ", " + M("f(x) = \\frac{" + m + "(" + xm(a) + ")(" + xm(b) + ")}{" + xm(a) + "} = " + m + "(" + xm(b) + ")") + ". Continuité : " + M("k = " + lim(a) + " f(x) = " + m + "(" + a + " - " + par(b) + ") = " + k) + ".",
          { ctx: "prolongement", guide: [G("Le numérateur se factorise en " + M(m + "(" + xm(a) + ")(x - b)") + ". Que vaut " + M("b") + " ?", b, M(b) + "."), G(M("k") + " = la limite en " + M(a) + " ?", k, M(m + "(" + a + " - " + par(b) + ") = " + k) + ".")],
            traps: [TR(0, "0 ÷ 0 n'est pas une valeur : simplifie d'abord par (" + xmT(a) + ")."), TR(m * (b - a), "Il reste " + T(m) + "(" + xmT(b) + ") : en x = " + T(a) + ", vérifie le signe."), TR(a - b, "N'oublie pas le facteur " + T(m) + ".")] }); },
    ],
    2: [
      () => { const x0 = nz(-3, 3), p = nz(-5, 5), m = nz(-4, 4), k = x0 * x0 + p * x0 - m * x0; if (Math.abs(k) <= 1) return null;
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases(P2([1, p, 0]), "x \\le " + x0, P2([m, 0]) + " + k", "x > " + x0)) + " est-elle continue ?", k,
          "Chaque morceau est continu ; il reste le raccord en " + M(x0) + " : " + M(par(x0) + "^2" + (p < 0 ? " - " : " + ") + Math.abs(p) + " \\cdot " + par(x0) + " = " + m * x0 + " + k") + ", donc " + M("k = " + (x0 * x0 + p * x0) + " - " + par(m * x0) + " = " + k) + ".",
          { ctx: "parabole-droite", guide: [G("Valeur de " + M(P2([1, p, 0])) + " en " + M("x = " + x0) + " ?", x0 * x0 + p * x0, M(x0 * x0 + p * x0) + "."), G("Valeur de " + M(P2([m, 0])) + " en " + M("x = " + x0) + " ?", m * x0, M(m * x0) + "."), G(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(x0 * x0 + p * x0, "C'est la valeur du 1er morceau ; retire encore " + T(m * x0) + "."), TR(x0 * x0 + p * x0 + m * x0, "On retire " + T(m * x0) + ", on ne l'ajoute pas."), TR(-x0 * x0 + p * x0 - m * x0, "(" + T(x0) + ")² = " + T(x0 * x0) + " : un carré est positif.")] }); },
      () => { const x0 = pk([2, 3, 4, -3, -4]), k = pk([-5, -4, -3, -2, 2, 3, 4, 5]), b = x0 * x0 - k - k * x0; if (!b) return null;
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases("kx" + sg(b), "x < " + x0, "x^2 - k", "x \\ge " + x0)) + " est-elle continue en " + M(x0) + " ?", k,
          "Les deux morceaux se rejoignent : " + M(par(x0) + "k" + sg(b) + " = " + x0 * x0 + " - k") + ", donc " + M((x0 + 1) + "k = " + (x0 * x0 - b)) + " et " + M("k = " + k) + ".",
          { ctx: "parametre-deux-cotes", guide: [G("On écrit " + M(par(x0) + "k" + sg(b) + " = " + x0 * x0 + " - k") + " et on regroupe les " + M("k") + " à gauche : coefficient de " + M("k") + " ?", x0 + 1, M(x0 + " + 1 = " + (x0 + 1)) + "."), G("Membre de droite (" + M(x0 * x0 + " - " + par(b)) + ") ?", x0 * x0 - b, M(x0 * x0 - b) + "."), G(M("k") + " ?", k, M(k) + ".")],
            traps: [TR((x0 * x0 - b) / x0, "k apparaît aussi à droite (x² − k) : regroupe les k."), TR(-k, "Vérifie le signe."), TR((x0 * x0 + b) / (x0 + 1), "On isole k : " + T(x0 * x0) + " − (" + T(b) + ").")] }); },
      () => { const C = pk([["Un parking facture", "h", "heures", [2, 3, 4], [[3, 2], [4, 2.5], [2.5, 1.5], [3.5, 2]]], ["Un fournisseur d'électricité facture", "kWh", "kWh", [100, 200, 300], [[0.3, 0.2], [0.35, 0.25], [0.4, 0.3]]], ["Un forfait de données mobiles coûte", "Go", "Go", [5, 10, 20], [[2, 1.5], [1.6, 1.2], [3, 2]]], ["Une compagnie de taxis facture", "km", "km", [10, 15, 20], [[3.5, 2.5], [4, 3], [3.2, 2.4]]]]);
        const s = pk(C[3]), [a, b] = pk(C[4]), as = r6(a * s), bs = r6(b * s), k = r6(as - bs);
        return QN(C[0] + " " + M("P(x) = " + D(a) + "x") + " CHF pour " + M("x \\le " + D(s)) + " " + C[2] + ", puis " + M("P(x) = " + D(b) + "x + k") + " CHF au-delà. Quelle valeur de " + M("k") + " (en CHF) évite un saut du prix en " + M(D(s)) + " " + C[1] + " ?", k,
          "Les deux formules doivent donner le même prix en " + M(D(s)) + " : " + M(D(a) + " \\cdot " + D(s) + " = " + D(b) + " \\cdot " + D(s) + " + k") + ", donc " + M("k = " + D(as) + " - " + D(bs) + " = " + D(k)) + " CHF.",
          { ctx: "tarif-" + C[1], guide: [G("Prix en " + M(D(s)) + " " + C[1] + " avec la 1re formule ?", as, M(D(as)) + " CHF."), G(M(D(b) + " \\cdot " + D(s)) + " ?", bs, M(D(bs)) + "."), G(M("k") + " ?", k, M(D(k)) + " CHF.")],
            traps: [TR(as, "C'est le prix en " + T(s) + " " + C[1] + " ; retire " + T(bs) + "."), TR(bs, "C'est b · s ; k = a · s − b · s."), TR(-k, "Vérifie le signe : le second tarif par unité est plus bas, k est positif.")] }); },
    ],
    3: [
      () => { const x1 = nz(-3, 1), dd = pk([1, 2, 3]), x2 = x1 + dd, u = ri(-3, 3), a = pk([-3, -2, 2, 3]), y1 = x1 * x1 + u, v = y1 + a * dd, b = v - a * x2;
        return QP("Trouve " + M("a") + " et " + M("b") + " pour que " + M("f(x) = \\begin{cases} " + P2([1, 0, u]) + " & \\text{si } x < " + x1 + " \\\\ ax + b & \\text{si } " + x1 + " \\le x \\le " + x2 + " \\\\ " + v + " & \\text{si } x > " + x2 + " \\end{cases}") + " soit continue sur " + M("\\mathbb{R}") + ". Réponds « a ; b ».", [a, b],
          "Raccord en " + M(x1) + " : la droite passe par " + M("(" + x1 + " \\,;\\, " + y1 + ")") + ". Raccord en " + M(x2) + " : par " + M("(" + x2 + " \\,;\\, " + v + ")") + ". Pente " + M("a = \\frac{" + v + " - " + par(y1) + "}{" + dd + "} = " + a) + ", puis " + M("b = " + v + " - " + par(a) + " \\cdot " + par(x2) + " = " + b) + ".",
          { ctx: "trois-morceaux", guide: [G("Valeur de " + M(P2([1, 0, u])) + " en " + M("x = " + x1) + " ?", y1, M(y1) + "."), G("La droite passe par " + M("(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("(" + x2 + " \\,;\\, " + v + ")") + ". Pente " + M("a") + " ?", a, M(a) + "."), G(M("b") + " ?", b, M(b) + "."), GP("« a ; b » ?", [a, b], M("(" + a + " \\,;\\, " + b + ")") + ".")],
            traps: [TP([b, a], "Dans l'ordre : a (la pente), puis b."), TP([a, v], "b n'est pas la valeur en " + T(x2) + " : b = " + T(v) + " − a · (" + T(x2) + ")."), TP([-a, v + a * x2], "Pente = (valeur en " + T(x2) + " − valeur en " + T(x1) + ") ÷ (" + T(x2) + " − (" + T(x1) + ")), dans cet ordre.")] }); },
      () => { const c = ri(2, 5), a = nz(-4, 6), b = c * c - a, v = 1 / (2 * c), rt = "\\sqrt{" + P2([1, b]) + "}";
        return QN("On pose " + M("f(x) = \\frac{" + rt + " - " + c + "}{" + xm(a) + "}") + " pour " + M("x \\neq " + a) + ". Quelle valeur faut-il donner à " + M("f(" + a + ")") + " pour que " + M("f") + " soit continue en " + M(a) + " ?", v,
          "Il faut " + M("f(" + a + ") = " + lim(a) + " f(x)") + ". Quantité conjuguée : " + M("f(x) = \\frac{" + xm(a) + "}{(" + xm(a) + ")(" + rt + " + " + c + ")} = \\frac{1}{" + rt + " + " + c + "}") + ", qui tend vers " + M("\\frac{1}{" + 2 * c + "}") + ".",
          { ctx: "prolongement-racine", guide: [G("Après multiplication par " + M(rt + " + " + c) + " et simplification, " + M("f(x) = \\frac{1}{" + rt + " + " + c + "}") + ". Valeur du dénominateur en " + M(a) + " ?", 2 * c, M(2 * c) + "."), G(M("f(" + a + ")") + " ?", v, M("\\frac{1}{" + 2 * c + "}") + ".")],
            traps: [TR(1 / c, "Le dénominateur tend vers " + c + " + " + c + " = " + 2 * c + "."), TR(0, "0 ÷ 0 n'est pas une valeur : utilise la quantité conjuguée."), TR(2 * c, "C'est le dénominateur : prends l'inverse.")] }); },
      () => { const x0 = pk([2, 3, -1, -2]), k = pk([-4, -3, -2, 2, 3, 4]), c = k * x0 * x0 - k * x0 - x0 * x0; if (!c) return null;
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases("x^2 + kx", "x \\le " + x0, "kx^2" + sg(-c), "x > " + x0)) + " est-elle continue en " + M(x0) + " ?", k,
          "Raccord en " + M(x0) + " : " + M(x0 * x0 + " + " + par(x0) + "k = " + x0 * x0 + "k" + sg(-c)) + ", donc " + M((x0 * x0 - x0) + "k = " + (x0 * x0 + c)) + " et " + M("k = " + k) + ".",
          { ctx: "parametre-carres", guide: [G("On regroupe les " + M("k") + " : coefficient de " + M("k") + " (" + M(x0 * x0 + " - " + par(x0)) + ") ?", x0 * x0 - x0, M(x0 * x0 - x0) + "."), G("Autre membre (" + M(x0 * x0 + sg(c)) + ") ?", x0 * x0 + c, M(x0 * x0 + c) + "."), G(M("k") + " ?", k, M(k) + ".")],
            traps: [TR((x0 * x0 + c) / (x0 * x0), "k apparaît des deux côtés : regroupe-les."), TR(-k, "Vérifie le signe."), TR((x0 * x0 - c) / (x0 * x0 - x0), "Le terme −" + T(c) + " passe de l'autre côté : il change de signe.")] }); },
    ],
  };

  // ======================= etudefct : étude complète d'une fonction (3.AN.07c, 3.AN.07d) =======================
  const EF = {
    1: [
      () => { const a = nz(-5, 5), b = ri(2, 4); if (Math.abs(a) === b) return null; const cs = [1, -a, -b * b, a * b * b];
        return QSet("Quels sont les zéros de " + M("f(x) = " + P2(cs)) + " ? (séparés par « ; »)", [a, -b, b],
          "Groupement : " + M("f(x) = x^2(" + xm(a) + ") - " + b * b + "(" + xm(a) + ") = (" + xm(a) + ")(x^2 - " + b * b + ")") + ". Zéros : " + M(setT([a, -b, b])) + ".",
          { ctx: "zeros-cubique", guide: [G("Groupe les termes deux à deux : " + M("f(x) = (x - a)(x^2 - c)") + ". Que vaut " + M("c") + " ?", b * b, M(b * b) + "."), GSet("Zéros de " + M("f") + " ?", [a, -b, b], M(setT([a, -b, b])) + ".")],
            traps: [TSt([a], "x² − " + T(b * b) + " s'annule aussi."), TSt([a, b], "x² = " + T(b * b) + " a deux solutions : " + T(b) + " et −" + T(b) + "."), TSt([-a, -b, b], "x − a = 0 donne x = a : vérifie le signe.")] }); },
      () => { const k = ri(2, 6), a = nz(-5, 5), b = ri(-6, 6); if (b === 0 || [k, -k].some((z) => a * z + b === 0)) return null;
        return QSet("Quelles valeurs faut-il exclure de l'ensemble de définition de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([1, 0, -k * k, 0]) + "}") + " ? (séparées par « ; »)", [-k, 0, k],
          "On exclut les zéros du dénominateur : " + M(P2([1, 0, -k * k, 0]) + " = x(x^2 - " + k * k + ") = x(" + xm(k) + ")(" + xm(-k) + ")") + ". Valeurs interdites : " + M(setT([-k, 0, k])) + ".",
          { ctx: "domaine", guide: [G("Mets " + M("x") + " en évidence : " + M(P2([1, 0, -k * k, 0]) + " = x(x^2 - c)") + ". Que vaut " + M("c") + " ?", k * k, M(k * k) + "."), GSet("Valeurs interdites ?", [-k, 0, k], M(setT([-k, 0, k])) + ".")],
            traps: [TSt([-k, k], "Le facteur x s'annule aussi : 0 est interdit."), TSt([k], "x² = " + T(k * k) + " a deux solutions, et 0 est aussi interdit."), TSt([0, k * k], "x² = " + T(k * k) + " donne x = ±" + T(k) + ".")] }); },
      () => { const k = ri(1, 3), d = ri(-6, 6), cs = [1, 0, -3 * k * k, d], ym = 2 * k ** 3 + d;
        return QP("Donne les coordonnées « x ; y » du maximum local de " + M("f(x) = " + P2(cs)) + ".", [-k, ym],
          M("f'(x) = " + P2([3, 0, -3 * k * k]) + " = 3(" + xm(-k) + ")(" + xm(k) + ")") + " : " + M("f'") + " passe de + à − en " + M(-k) + ". Maximum local " + M("f(" + -k + ") = " + ym) + ", au point " + M("(" + -k + " \\,;\\, " + ym + ")") + ".",
          { ctx: "maximum-cubique", guide: [GSet("Zéros de " + M("f'(x) = " + P2([3, 0, -3 * k * k])) + " ?", [-k, k], M(setT([-k, k])) + "."), G("En quelle abscisse " + M("f'") + " passe-t-elle de + à − ?", -k, M(-k) + "."), G(M("f(" + -k + ")") + " ?", ym, M(ym) + "."), GP("« x ; y » ?", [-k, ym], M("(" + -k + " \\,;\\, " + ym + ")") + ".")],
            traps: [TP([k, d - 2 * k ** 3], "C'est le minimum local (f' passe de − à +)."), TP([-k, d], "L'ordonnée est f(−" + T(k) + "), pas f(0)."), TP([ym, -k], "Dans l'ordre : x, puis y.")] }); },
    ],
    2: [
      () => { const k = ri(2, 7), c = k * k, v = 2 * k;
        return QN("Soit " + M("f(x) = \\frac{x^2 + " + c + "}{x}") + " pour " + M("x > 0") + ". Quelle est la valeur de son minimum ?", v,
          M("f(x) = x + \\frac{" + c + "}{x}") + ", " + M("f'(x) = 1 - \\frac{" + c + "}{x^2}") + " s'annule en " + M("x = " + k) + " (de − à +). Minimum " + M("f(" + k + ") = " + k + " + " + k + " = " + v) + ".",
          { ctx: "x-plus-inverse", guide: [G(M("f'(x) = 1 - \\frac{" + c + "}{x^2}") + ". Zéro positif ?", k, M(k) + "."), G(M("f(" + k + ")") + " ?", v, M(v) + ".")],
            traps: [TR(k, "C'est l'abscisse du minimum ; calcule f(" + T(k) + ")."), TR(2 * c, "f(" + T(k) + ") = (" + T(c) + " + " + T(c) + ") ÷ " + T(k) + " : divise par " + T(k) + "."), TR(c + 1, "C'est f(1) : le minimum est là où f' s'annule.")] }); },
      () => { const k = ri(1, 4), a = pk([2, 4, 6, 8, 3, 5]), y = a / (2 * k);
        return QP("Donne les coordonnées « x ; y » du maximum de " + M("f(x) = \\frac{" + a + "x}{x^2 + " + k * k + "}") + ".", [k, y],
          M("f'(x) = \\frac{" + a + "(" + k * k + " - x^2)}{(x^2 + " + k * k + ")^2}") + " : positive entre " + M(-k) + " et " + M(k) + ", négative ensuite. Maximum en " + M("x = " + k) + " : " + M("f(" + k + ") = \\frac{" + a * k + "}{" + 2 * k * k + "} = " + fT(y)) + ".",
          { ctx: "rationnelle-bosse", guide: [G("Le numérateur de " + M("f'(x)") + " est " + M(a + "(" + k * k + " - x^2)") + ". Son zéro positif ?", k, M(k) + "."), G(M("f(" + k + ")") + " ?", y, M(fT(y)) + "."), GP("« x ; y » ?", [k, y], M("(" + k + " \\,;\\, " + fT(y) + ")") + ".")],
            traps: [TP([-k, -y], "C'est le minimum (f' passe de − à +)."), TP([k, a / k], "Au dénominateur : " + T(k * k) + " + " + T(k * k) + " = " + T(2 * k * k) + "."), TP([y, k], "Dans l'ordre : x, puis y.")] }); },
      () => { const a = ri(1, 3), b = ri(a + 1, 5), cs = [1, 0, -(a * a + b * b), 0, a * a * b * b];
        return QSet("Quels sont les zéros de " + M("f(x) = " + P2(cs)) + " ? (séparés par « ; »)", [-b, -a, a, b],
          "On pose " + M("X = x^2") + " : " + M("X^2 - " + (a * a + b * b) + "X + " + a * a * b * b + " = (X - " + a * a + ")(X - " + b * b + ")") + ". " + M("x^2 = " + a * a) + " ou " + M("x^2 = " + b * b) + " : " + M(setT([-b, -a, a, b])) + ".",
          { ctx: "bicarree", guide: [GSet("Avec " + M("X = x^2") + ", résous " + M("X^2 - " + (a * a + b * b) + "X + " + a * a * b * b + " = 0") + " : " + M("X") + " ?", [a * a, b * b], M(setT([a * a, b * b])) + "."), GSet("Zéros " + M("x") + " ?", [-b, -a, a, b], M(setT([-b, -a, a, b])) + ".")],
            traps: [TSt([a * a, b * b], "Ce sont les valeurs de X = x² : prends les racines."), TSt([a, b], "x² = " + T(a * a) + " donne aussi x = −" + T(a) + "."), TSt([-b, b], "x² = " + T(a * a) + " donne aussi deux zéros.")] }); },
    ],
    3: [
      () => { let r1, r2; do { r1 = nz(-5, 3); r2 = r1 + pk([2, 4, 6]); } while (r2 === 0); const b = (r1 + r2) / 2, c = -r1 * r2, ask = pk(["min", "max"]), v = ask === "min" ? 2 * r2 : 2 * r1, x = ask === "min" ? r2 : r1;
        return QN("Soit " + M("f(x) = \\frac{x^2" + sg(c) + "}{" + xm(b) + "}") + ". Quelle est la valeur de son " + (ask === "min" ? "minimum" : "maximum") + " local ?", v,
          M("f'(x) = \\frac{2x(" + xm(b) + ") - (x^2" + sg(c) + ")}{(" + xm(b) + ")^2} = \\frac{" + P2([1, -2 * b, -c]) + "}{(" + xm(b) + ")^2}") + ", nulle en " + M(r1) + " et " + M(r2) + ". Maximum local " + M("f(" + r1 + ") = " + 2 * r1) + ", minimum local " + M("f(" + r2 + ") = " + 2 * r2) + " (ils sont sur les deux branches, de part et d'autre de l'asymptote " + M("x = " + b) + ").",
          { ctx: "rationnelle-oblique-" + ask, guide: [GSet("Zéros du numérateur de " + M("f'(x)") + ", " + M(P2([1, -2 * b, -c])) + " ?", [r1, r2], M(setT([r1, r2])) + "."), G("Le " + (ask === "min" ? "minimum (f' passe de − à +)" : "maximum (f' passe de + à −)") + " est en " + M("x") + " = ?", x, M(x) + "."), G("Valeur ?", v, M("f(" + x + ") = " + v) + ".")],
            traps: [TR(x, "C'est l'abscisse ; calcule f en ce point."), TR(ask === "min" ? 2 * r1 : 2 * r2, "C'est l'autre extremum (le " + (ask === "min" ? "maximum" : "minimum") + " local)."), TR(-v, "Vérifie le signe.")] }); },
      () => { const k = ri(1, 3), d = ri(-6, 6), hi = 2 * k ** 3 + d, lo = d - 2 * k ** 3, cs = [1, 0, -3 * k * k, d], iv = [[lo, false, hi, false]];
        return QS("Pour quelles valeurs de " + M("m") + " l'équation " + M(P2(cs) + " = m") + " a-t-elle trois solutions ? (intervalle)", iv,
          "Maximum local " + M("f(" + -k + ") = " + hi) + ", minimum local " + M("f(" + k + ") = " + lo) + " ; " + M("f") + " va de " + M("-\\infty") + " à " + M("+\\infty") + ". La droite " + M("y = m") + " coupe trois fois la courbe exactement quand " + M(lo + " < m < " + hi) + " : " + M(SolSet.show(iv)) + ".",
          { ctx: "nombre-solutions", guide: [G("Valeur du maximum local ?", hi, M("f(" + -k + ") = " + hi) + "."), G("Valeur du minimum local ?", lo, M("f(" + k + ") = " + lo) + "."), GSS("Valeurs de " + M("m") + " ?", iv, M(SolSet.show(iv)) + ".")],
            traps: [TS([[lo, true, hi, true]], "Pour m = " + T(hi) + " ou m = " + T(lo) + ", la droite est tangente à la courbe : deux solutions seulement."), TS([[-k, false, k, false]], "Ce sont les abscisses des extremums ; m est une valeur de f (sur l'axe vertical).")] }); },
      () => { const a = pk([2, 3, -2, -3]), d = ri(-9, 9), cs = [3, -4 * a, 0, 0, d], v = d - a ** 4;
        return QN("Quelle est la valeur minimale de " + M("f(x) = " + P2(cs)) + " ?", v,
          M("f'(x) = " + P2([12, -12 * a, 0, 0]) + " = 12x^2(" + xm(a) + ")") + ". En " + M(0) + ", " + M("f'") + " s'annule sans changer de signe (palier) ; en " + M(a) + ", elle passe de − à + : minimum " + M("f(" + a + ") = " + v) + ".",
          { ctx: "quartique-palier", guide: [GSet("Zéros de " + M("f'(x) = " + P2([12, -12 * a, 0, 0])) + " ?", [0, a], M(setT([0, a])) + "."), G("En quelle abscisse " + M("f'") + " passe-t-elle de − à + ?", a, M(a) + " (en 0, " + M("12x^2 \\ge 0") + " ne change pas de signe)."), G(M("f(" + a + ")") + " ?", v, M(v) + ".")],
            traps: [TR(d, "En 0, f' s'annule sans changer de signe : ce n'est pas un extremum."), TR(a, "C'est l'abscisse du minimum ; calcule f(" + T(a) + ")."), TR(d + a ** 4, "f(" + T(a) + ") = 3 · " + T(a ** 4) + " − 4 · " + T(a ** 4) + " + " + T(d) + ".")] }); },
    ],
  };

  // ======================= derivseconde : concavité, points d'inflexion (3.AN.08a, 3.AN.08b) =======================
  const DS = {
    1: [
      () => { const a = pk([1, 2, -1, 3, -2]), p = pk([-4, -3, -2, 2, 3, 4]), b = -3 * a * p, c = ri(-8, 8), d = ri(-6, 6), cs = [a, b, c, d];
        return QN("En quelle abscisse la courbe de " + M("f(x) = " + P2(cs)) + " a-t-elle un point d'inflexion ?", p,
          M("f'(x) = " + P2(dP(cs))) + ", " + M("f''(x) = " + P2([6 * a, 2 * b])) + " s'annule en changeant de signe en " + M("x = " + p) + ".",
          { ctx: "inflexion-cubique", guide: [G(M("f''(x) = " + P2([6 * a, 0]) + " + c") + ". Que vaut " + M("c") + " ?", 2 * b, M(2 * b) + "."), G("Zéro de " + M("f''") + " ?", p, M(p) + ".")],
            traps: [TR(-p, "Résous " + pT([6 * a, 2 * b]) + " = 0 : vérifie le signe."), TR(3 * p, "f''(x) = " + pT([6 * a, 2 * b]) + " : divise par " + T(6 * a) + "."), TR(1.5 * p, "C'est le zéro de " + pT([2 * a, b]) + " ; f''(x) = 6ax + 2b.")] }); },
      () => { const a = pk([1, -1, 2]), b = nz(-3, 3), c = nz(-5, 5), e = ri(-6, 6), x0 = nz(-3, 3), cs = [a, b, c, e, 0], v = 12 * a * x0 * x0 + 6 * b * x0 + 2 * c; if (Math.abs(v) <= 1) return null;
        return QN("Soit " + M("f(x) = " + P2(cs)) + ". Calcule " + M("f''(" + x0 + ")") + ".", v,
          M("f'(x) = " + P2(dP(cs))) + ", " + M("f''(x) = " + P2(dP(dP(cs)))) + ", donc " + M("f''(" + x0 + ") = " + v) + ".",
          { ctx: "valeur-seconde", guide: [G("Dans " + M("f''(x)") + ", coefficient de " + M("x^2") + " ?", 12 * a, M(12 * a) + "."), G(M("f''(" + x0 + ")") + " ?", v, M(v) + ".")],
            traps: [TR(pv(dP(cs), x0), "C'est f'(" + T(x0) + ") : dérive encore une fois."), TR(12 * a * x0 * x0 + 6 * b * x0 + c, "Le terme " + T(c) + "x² donne " + T(2 * c) + "x, puis " + T(2 * c) + "."), TR(pv(cs, x0), "C'est f(" + T(x0) + ").")] }); },
      () => { const p = pk([-4, -3, -2, 2, 3, 4]), m = pk([1, -1, 2, -2, 0.5, -0.5]);
        return QN("Le graphique représente la dérivée seconde " + M("f''") + " d'une fonction " + M("f") + ". En quelle abscisse la courbe de " + M("f") + " a-t-elle un point d'inflexion ?", p,
          M("f''") + " s'annule en changeant de signe en " + M("x = " + p) + " : la courbe de " + M("f") + " passe de " + (m > 0 ? "concave (tournée vers le bas) à convexe (tournée vers le haut)" : "convexe à concave") + ".",
          { ctx: "lecture-seconde", fig: PL([{ f: (x) => m * (x - p) }], []), guide: [G("Où la droite coupe-t-elle l'axe horizontal ?", p, M(p) + ".")],
            traps: [TR(-m * p, "C'est l'ordonnée à l'origine de f'' ; cherche où f''(x) = 0."), TR(-p, "Lis le signe sur l'axe horizontal.")] }); },
    ],
    2: [
      () => { const a = pk([1, -1, 2, -2]), p = nz(-4, 4), b = -3 * a * p, c = ri(-6, 6), d = ri(-6, 6), cs = [a, b, c, d], ask = pk(["convexe", "concave"]);
        const right = (ask === "convexe") === (a > 0), R1 = [[p, true, Infinity, false]], L1 = [[-Infinity, false, p, true]], iv = right ? R1 : L1;
        return QS("Sur quel intervalle " + M("f(x) = " + P2(cs)) + " est-elle " + ask + " (courbe tournée vers " + (ask === "convexe" ? "le haut" : "le bas") + ") ?", iv,
          M("f''(x) = " + P2([6 * a, 2 * b]) + " = " + 6 * a + "(" + xm(p) + ")") + ". " + (ask === "convexe" ? M("f'' \\ge 0") : M("f'' \\le 0")) + " sur " + M(SolSet.show(iv)) + ".",
          { ctx: ask + "-cubique", guide: [G("Zéro de " + M("f''(x) = " + P2([6 * a, 2 * b])) + " ?", p, M(p) + "."), GSS("Intervalle où " + (ask === "convexe" ? M("f'' \\ge 0") : M("f'' \\le 0")) + " ?", iv, M(SolSet.show(iv)) + ".")],
            traps: [TS(right ? L1 : R1, "C'est l'intervalle où f est " + (ask === "convexe" ? "concave" : "convexe") + " : regarde le signe de " + T(6 * a) + " devant (" + xmT(p) + ")."), TS(right ? [[-p, true, Infinity, false]] : [[-Infinity, false, -p, true]], "Le zéro de f'' est " + T(p) + " : vérifie le signe.")] }); },
      () => { const p = ri(-3, 2), q = p + ri(1, 4), e = ri(-5, 5), g = ri(-5, 5), cs = [1, -2 * (p + q), 6 * p * q, e, g];
        return QSet("Quelles sont les abscisses des points d'inflexion de " + M("f(x) = " + P2(cs)) + " ? (séparées par « ; »)", [p, q],
          M("f''(x) = " + P2([12, -12 * (p + q), 12 * p * q]) + " = 12(" + xm(p) + ")(" + xm(q) + ")") + " : elle change de signe en " + M(p) + " et en " + M(q) + ".",
          { ctx: "inflexion-quartique", guide: [G("Dans " + M("f''(x)") + ", coefficient de " + M("x") + " ?", -12 * (p + q), M(-12 * (p + q)) + "."), GSet("Zéros de " + M("f''(x) = " + P2([12, -12 * (p + q), 12 * p * q])) + " ?", [p, q], M(setT([p, q])) + ".")],
            traps: [TSt([-p, -q], "Les zéros de 12(x − p)(x − q) sont p et q : vérifie les signes."), Number.isInteger((p + q) / 2) ? TSt([(p + q) / 2], "C'est le milieu des deux zéros : résous f''(x) = 0.") : null, TSt([p], "f'' a deux zéros, et elle change de signe en chacun.")] }); },
      () => { const p = nz(-3, 3), c = ri(-6, 6), d = ri(-6, 6), cs = [1, -3 * p, c, d], y = pv(cs, p);
        return QP("Donne les coordonnées « x ; y » du point d'inflexion de " + M("f(x) = " + P2(cs)) + ".", [p, y],
          M("f''(x) = " + P2([6, -6 * p]) + "") + " s'annule en " + M(p) + " ; " + M("f(" + p + ") = " + y) + " : point " + M("(" + p + " \\,;\\, " + y + ")") + ".",
          { ctx: "point-inflexion", guide: [G("Zéro de " + M("f''(x) = " + P2([6, -6 * p])) + " ?", p, M(p) + "."), G(M("f(" + p + ")") + " ?", y, M(y) + "."), GP("« x ; y » ?", [p, y], M("(" + p + " \\,;\\, " + y + ")") + ".")],
            traps: [TP([p, pv(dP(cs), p)], "L'ordonnée est f(" + T(p) + "), pas f'(" + T(p) + ")."), TP([-p, pv(cs, -p)], "Résous 6x − " + T(6 * p) + " = 0 : vérifie le signe."), TP([y, p], "Dans l'ordre : x, puis y.")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, -1, 3]), p = nz(-3, 3), k = -3 * a * p, c = nz(-6, 6);
        return QN("Pour quelle valeur de " + M("k") + " la courbe de " + M("f(x) = " + P2([a, 0, 0, 0]) + " + kx^2" + lt(c)) + " a-t-elle un point d'inflexion en " + M("x = " + p) + " ?", k,
          M("f''(x) = " + P2([6 * a, 0]) + " + 2k") + " ; " + M("f''(" + p + ") = " + 6 * a * p + " + 2k = 0") + ", donc " + M("k = " + k) + ".",
          { ctx: "parametre-inflexion", guide: [G(M("f''(x) = " + P2([6 * a, 0]) + " + 2k") + ". Que vaut " + M(P2([6 * a, 0])) + " en " + M("x = " + p) + " ?", 6 * a * p, M(6 * a * p) + "."), G(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(-6 * a * p, "f''(x) = " + T(6 * a) + "x + 2k : divise encore par 2."), TR(-a * p, "La dérivée seconde de " + pT([a, 0, 0, 0]) + " est " + T(6 * a) + "x."), TR(3 * a * p, "Vérifie le signe.")] }); },
      () => { const p = nz(-3, 3), c = ri(-6, 6), d = ri(-6, 6), cs = [1, -3 * p, c, d], fp = pv(cs, p), m = c - 3 * p * p, n = p ** 3 + d; if (Math.abs(n) <= 1) return null;
        return QN("Soit " + M("f(x) = " + P2(cs)) + ". La tangente à sa courbe au point d'inflexion a pour équation " + M("y = mx + n") + ". Que vaut " + M("n") + " ?", n,
          "Inflexion en " + M("x = " + p) + " (" + M("f''(x) = " + P2([6, -6 * p])) + "). " + M("f(" + p + ") = " + fp) + ", " + M("f'(" + p + ") = " + m) + ". Tangente " + M("y = " + m + "(" + xm(p) + ")" + sg(fp)) + ", ordonnée à l'origine " + M(fp + " - " + par(p) + " \\cdot " + par(m) + " = " + n) + ".",
          { ctx: "tangente-inflexion", guide: [G("Abscisse du point d'inflexion ?", p, M(p) + "."), G(M("f(" + p + ")") + " ?", fp, M(fp) + "."), G("Pente " + M("f'(" + p + ")") + " ?", m, M(m) + "."), G(M("n = f(" + p + ") - " + par(p) + " \\cdot f'(" + p + ")") + " ?", n, M(n) + ".")],
            traps: [TR(fp, "C'est f(" + T(p) + ") : développe y = f'(" + T(p) + ")(" + xmT(p) + ") + f(" + T(p) + ")."), TR(m, "C'est la pente m."), TR(fp + p * m, "n = f(p) − p · f'(p) : vérifie le signe.")] }); },
      () => { const m = ri(1, 4), a = pk([2, 3, 4, 6, 12, -6]), k = 3 * m * m;
        return QSet("Quelles sont les abscisses des points d'inflexion de " + M("f(x) = \\frac{" + a + "}{x^2 + " + k + "}") + " ? (séparées par « ; »)", [-m, m],
          M("f'(x) = \\frac{" + -2 * a + "x}{(x^2 + " + k + ")^2}") + ", " + M("f''(x) = \\frac{" + a + "(6x^2 - " + 2 * k + ")}{(x^2 + " + k + ")^3}") + " s'annule et change de signe quand " + M("x^2 = " + m * m) + " : " + M("x = \\pm " + m) + ".",
          { ctx: "inflexion-cloche", guide: [G(M("f''(x)") + " a le signe de " + (a > 0 ? "" : "l'opposé de ") + M("6x^2 - " + 2 * k) + ". Elle s'annule pour " + M("x^2") + " = ?", m * m, M(m * m) + "."), GSet("Abscisses ?", [-m, m], M("\\pm " + m) + ".")],
            traps: [TSt([0], "En 0, f'(0) = 0 : c'est le sommet de la courbe, pas une inflexion."), TSt([m], "x² = " + T(m * m) + " a deux solutions."), TSt([-m * m, m * m], "C'est x² : prends la racine.")] }); },
    ],
  };

  // ======================= combi : dénombrement (3.PS.01a–e) =======================
  const WORDS = ["ANANAS", "BANANE", "PAPAYE", "RADAR", "CERISE", "POMME", "GENEVE", "BALLON", "ARBRE", "ELEVE", "ALGEBRE", "CITRON", "MATHS"];
  const KO = {
    1: [
      /* 25.11 (audit niveau 3e) : « menus, tenues, coupes » (principe multiplicatif à trois choix) = niveau 11e (denombr).
         Remplacé par des choix de groupes, combinaisons calculées avec la formule (3.PS.01d). */
      () => { const C = pk([["jass", 36, pk([3, 4, 5]), "On tire simultanément", "cartes d'un jeu de jass de 36 cartes. Combien de mains différentes peut-on obtenir ?"], ["loto", pk([42, 45, 49]), 6, "Au loto, on coche", "numéros parmi"], ["livres", ri(9, 15), pk([3, 4, 5]), "Pour les vacances, Noé choisit", "livres parmi"]]);
        const n = C[1], k = C[2], v = Cb(n, k), A = Cb(n, k) * fact(k);
        const txt = C[0] === "jass" ? C[3] + " " + k + " " + C[4] : C[0] === "loto" ? C[3] + " " + k + " " + C[4] + " " + n + " (l'ordre ne compte pas). Combien de grilles différentes ?" : C[3] + " " + k + " " + C[4] + " les " + n + " de sa bibliothèque. Combien de choix différents a-t-il ?";
        return QN(txt, v, "On choisit " + M(k) + " éléments parmi " + M(n) + ", sans ordre : " + M(bn(n, k) + " = \\frac{" + Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ") + "}{" + k + "!} = " + D(v)) + ".",
          { ctx: "groupe-" + C[0], guide: [G("Si l'ordre comptait (" + M(Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ")) + ") ?", A, M(D(A)) + "."), G(M(k + "!") + " ?", fact(k), M(fact(k)) + "."), G(M(bn(n, k)) + " ?", v, M(D(v)) + ".")],
            traps: [TR(A, "L'ordre ne compte pas : divise par " + k + "! = " + fact(k) + "."), TR(n ** k, "On ne choisit pas deux fois le même élément, et l'ordre ne compte pas."), TR(Cb(n, k - 1), "C'est le choix de " + (k - 1) + " éléments.")] }); },
      () => { const n = ri(4, 7), C = pk([["De combien de façons peut-on ranger " + n + " livres différents sur une étagère ?", "etagere"], [n + " coureuses participent à une course (sans ex æquo). Combien d'ordres d'arrivée sont possibles ?", "course"], [n + " amis posent en ligne pour une photo. Combien d'ordres différents sont possibles ?", "photo"]]), v = fact(n);
        return QN(C[0], v, "Permutations : " + M(n + " \\cdot " + (n - 1) + " \\cdot \\ldots \\cdot 2 \\cdot 1 = " + n + "! = " + D(v)) + ".",
          { ctx: C[1], guide: [G("Choix pour la 1re place ?", n, M(n) + "."), G("Choix pour la 2e place ?", n - 1, M(n - 1) + "."), G("Total " + M(n + "!") + " ?", v, M(D(v)) + ".")],
            traps: [TR(n ** n, "Ce qui est déjà placé ne peut pas l'être une 2e fois : " + n + " · " + (n - 1) + " · …"), TR(n * (n - 1), "Continue jusqu'à 1 : " + n + " · " + (n - 1) + " · … · 1."), TR((n * (n + 1)) / 2, "On multiplie, on n'additionne pas.")] }); },
      () => { const n = ri(6, 12), C = pk([[n + " athlètes disputent une finale. Combien de podiums (or, argent, bronze) sont possibles ?", "podium"], ["Un club de " + n + " membres élit un président, un vice-président et un caissier (trois personnes différentes). Combien de bureaux sont possibles ?", "bureau"], [n + " chevaux prennent le départ. Un pari « tiercé dans l'ordre » désigne le 1er, le 2e et le 3e. Combien de paris différents ?", "tierce"]]), v = n * (n - 1) * (n - 2);
        return QN(C[0], v, "L'ordre compte et les trois sont différents : " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + D(v)) + ".",
          { ctx: C[1], guide: [G("Choix pour la 1re place ?", n, M(n) + "."), G("Pour la 2e (une personne de moins) ?", n - 1, M(n - 1) + "."), G("Total ?", v, M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + D(v)) + ".")],
            traps: [TR(Cb(n, 3), "Ici l'ordre compte (1er ≠ 2e) : on ne divise pas par 3!."), TR(n ** 3, "Une même personne ne peut pas occuper deux places."), TR(n * (n - 1), "Il y a trois places à attribuer.")] }); },
    ],
    2: [
      () => { const t = pk(["deleg", "mains", "pizza"]); let n, k, txt;
        if (t === "deleg") { n = ri(15, 25); k = pk([2, 3]); txt = "Une classe de " + n + " élèves choisit " + k + " délégués (sans rôle particulier). Combien de groupes de délégués sont possibles ?"; }
        else if (t === "mains") { n = ri(8, 30); k = 2; txt = n + " personnes se saluent : chacune serre la main de chaque autre, une seule fois. Combien de poignées de main ?"; }
        else { n = ri(8, 12); k = pk([2, 3, 4]); txt = "Une pizzeria propose " + n + " garnitures. Combien de pizzas différentes peut-on composer avec " + k + " garnitures différentes ?"; }
        const A = Cb(n, k) * fact(k), v = Cb(n, k);
        return QN(txt, v, "L'ordre ne compte pas : " + M(bn(n, k) + " = \\frac{" + D(A) + "}{" + k + "!} = " + D(v)) + ".",
          { ctx: "combinaisons-" + t, guide: [G("Si l'ordre comptait (" + M(Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ")) + ") ?", A, M(D(A)) + "."), G("Nombre d'ordres d'un même groupe, " + M(k + "!") + " ?", fact(k), M(fact(k)) + "."), G("Nombre de groupes ?", v, M(D(v)) + ".")],
            traps: [TR(A, "L'ordre ne compte pas : divise par " + k + "! = " + fact(k) + "."), TR(n ** k, "On ne choisit pas deux fois le même élément, et l'ordre ne compte pas."), TR(n * k, "Ce n'est pas n · k : compte les groupes.")] }); },
      () => { const t = pk(["qcm", "cadenas", "code"]); let b, e, txt;
        if (t === "qcm") { e = ri(5, 8); b = pk([3, 4]); txt = "Un QCM a " + e + " questions, chacune avec " + b + " réponses possibles. Combien de grilles de réponses différentes peut-on remplir (une réponse par question) ?"; }
        else if (t === "cadenas") { e = ri(3, 5); b = pk([6, 8, 12]); txt = "Un cadenas a " + e + " roues de " + b + " symboles chacune. Combien de combinaisons différentes ?"; }
        else { e = 3; b = 26; txt = "Combien de codes de 3 lettres (de A à Z, répétitions permises) peut-on former ?"; }
        const v = b ** e;
        return QN(txt, v, "Chaque position a " + M(b) + " possibilités, indépendamment des autres : " + M(b + "^" + e + " = " + D(v)) + ".",
          { ctx: "puissance-" + t, guide: [G("Nombre de possibilités pour chaque position ?", b, M(b) + "."), G("Total " + M(b + "^" + e) + " ?", v, M(D(v)) + ".")],
            traps: [TR(b * e, "On multiplie " + b + " par lui-même " + e + " fois : " + b + "^" + e + "."), TR(e ** b, "C'est (possibilités par position) puissance (nombre de positions)."), TR(Cb(b, e) * fact(e), "Les répétitions sont permises.")] }); },
      () => { const w = pk(WORDS), cnt = {}; for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1; const reps = Object.values(cnt).filter((c) => c > 1), prod = reps.reduce((s, c) => s * fact(c), 1), n = w.length, v = fact(n) / prod;
        return QN("Combien de « mots » différents (même sans signification) peut-on écrire avec toutes les lettres du mot " + w + " ?", v,
          M(n) + " lettres : " + M(n + "! = " + D(fact(n))) + " ordres. " + (reps.length ? "Échanger des lettres identiques ne change pas le mot : on divise par " + M(reps.map((c) => c + "!").join(" \\cdot ") + " = " + prod) + ". " + M("\\frac{" + D(fact(n)) + "}{" + prod + "} = " + D(v)) + "." : "Toutes les lettres sont différentes : " + M(D(v)) + " mots."),
          { ctx: "anagramme", guide: [G("Nombre de lettres " + M("n") + " ; que vaut " + M("n!") + " ?", fact(n), M(n + "! = " + D(fact(n))) + "."), G("Produit des factorielles des lettres répétées (1 s'il n'y en a pas) ?", prod, M(prod) + "."), G("Nombre de mots ?", v, M(D(v)) + ".")],
            traps: [TR(fact(n), "Des lettres identiques échangées donnent le même mot : divise par les factorielles des répétitions."), reps.length > 1 ? TR(fact(n) / fact(reps[0]), "Toutes les lettres répétées comptent : divise par le produit de leurs factorielles.") : null, TR(n ** n, "Chaque lettre n'est utilisée qu'une fois.")] }); },
    ],
    3: [
      () => { const g = ri(4, 9), b = ri(4, 9), k = pk([3, 4]), j = ri(1, k - 1), v = Cb(g, j) * Cb(b, k - j);
        return QN("Une classe compte " + g + " filles et " + b + " garçons. On forme un comité de " + k + " élèves. Combien de comités comptent exactement " + j + " fille" + (j > 1 ? "s" : "") + " ?", v,
          "On choisit les filles ET les garçons : " + M(bn(g, j) + " \\cdot " + bn(b, k - j) + " = " + Cb(g, j) + " \\cdot " + Cb(b, k - j) + " = " + D(v)) + ".",
          { ctx: "comite-exact", guide: [G("Choix des " + j + " fille" + (j > 1 ? "s" : "") + ", " + M(bn(g, j)) + " ?", Cb(g, j), M(Cb(g, j)) + "."), G("Choix des " + (k - j) + " garçon" + (k - j > 1 ? "s" : "") + " ?", Cb(b, k - j), M(Cb(b, k - j)) + "."), G("Total ?", v, M(D(v)) + ".")],
            traps: [TR(Cb(g + b, k), "Ce sont tous les comités, sans condition."), TR(Cb(g, j) + Cb(b, k - j), "Filles ET garçons : on multiplie les choix."), TR(Cb(g, j) * Cb(b, k - j) * fact(k), "Dans un comité, l'ordre ne compte pas.")] }); },
      () => { const g = ri(3, 8), b = ri(4, 9), k = pk([3, 4]), n = g + b, v = Cb(n, k) - Cb(b, k);
        return QN("Une classe compte " + g + " filles et " + b + " garçons. On forme un comité de " + k + " élèves. Combien de comités comptent au moins une fille ?", v,
          "Par le contraire : tous les comités moins ceux sans fille. " + M(bn(n, k) + " - " + bn(b, k) + " = " + D(Cb(n, k)) + " - " + D(Cb(b, k)) + " = " + D(v)) + ".",
          { ctx: "au-moins-une", guide: [G("Nombre total de comités ?", Cb(n, k), M(bn(n, k) + " = " + D(Cb(n, k))) + "."), G("Comités sans fille (que des garçons) ?", Cb(b, k), M(bn(b, k) + " = " + D(Cb(b, k))) + "."), G("Au moins une fille ?", v, M(D(v)) + ".")],
            traps: [TR(Cb(n, k), "Retire les comités sans fille."), TR(g * Cb(n - 1, k - 1), "Ce calcul compte plusieurs fois les comités à plusieurs filles : passe par le contraire."), TR(Cb(b, k), "C'est le nombre de comités sans fille.")] }); },
      () => { const n = ri(6, 24), H = (n * (n - 1)) / 2;
        return QN("Lors d'une fête, chaque invité serre la main de chaque autre invité, une seule fois. On compte " + T(H) + " poignées de main. Combien y a-t-il d'invités ?", n,
          M("\\frac{n(n - 1)}{2} = " + D(H) + " \\iff n(n - 1) = " + D(2 * H)) + " ; or " + M(n + " \\cdot " + (n - 1) + " = " + D(2 * H)) + ", donc " + M("n = " + n) + ".",
          { ctx: "poignees-inverse", guide: [G("Avec " + M("n") + " invités, il y a " + M("\\frac{n(n - 1)}{2}") + " poignées. Que vaut " + M("n(n - 1)") + " ?", 2 * H, M(D(2 * H)) + "."), G(M("n") + " (deux entiers consécutifs dont le produit vaut " + M(D(2 * H)) + ") ?", n, M(n) + ".")],
            traps: [TR(n - 1, "n(n − 1) : n est le plus grand des deux facteurs."), TR(2 * H, "C'est n(n − 1) ; il faut encore trouver n."), TR(n + 1, "Vérifie : " + (n + 1) + " · " + n + " ≠ " + T(2 * H) + ".")] }); },
      () => { const n = ri(4, 7), v = 2 * fact(n - 1);
        return QN(n + " amis, dont Alix et Bao, s'assoient sur un banc de " + n + " places. De combien de façons peuvent-ils s'asseoir si Alix et Bao veulent être côte à côte ?", v,
          "On colle Alix et Bao en un bloc : " + M(n - 1) + " « objets » à ranger, " + M((n - 1) + "! = " + D(fact(n - 1))) + " façons ; dans le bloc, 2 ordres. " + M("2 \\cdot " + D(fact(n - 1)) + " = " + D(v)) + ".",
          { ctx: "cote-a-cote", guide: [G("Alix et Bao forment un bloc : combien d'« objets » à ranger ?", n - 1, M(n - 1) + "."), G("Nombre de rangements de ces objets ?", fact(n - 1), M((n - 1) + "! = " + D(fact(n - 1))) + "."), G("Total (2 ordres dans le bloc) ?", v, M(D(v)) + ".")],
            traps: [TR(fact(n - 1), "Alix et Bao peuvent échanger leurs places : multiplie par 2."), TR(fact(n), "Ce sont toutes les dispositions, sans contrainte."), TR(2 * fact(n - 2), "Le bloc compte comme un objet : " + (n - 1) + " objets.")] }); },
      () => { const k = pk([3, 4]), v = k === 3 ? 648 : 4536;
        return QN("Combien de nombres de " + k + " chiffres (le premier n'est pas 0) ont tous leurs chiffres différents ?", v,
          "1er chiffre : 9 choix (pas 0). 2e : 9 choix (0 redevient possible, mais pas le 1er chiffre). Puis 8" + (k === 4 ? ", puis 7" : "") + ". " + M("9 \\cdot 9 \\cdot 8" + (k === 4 ? " \\cdot 7" : "") + " = " + D(v)) + ".",
          { ctx: "chiffres-distincts", guide: [G("Choix du 1er chiffre ?", 9, M(9) + " (de 1 à 9)."), G("Choix du 2e chiffre ?", 9, M(9) + " : le 0 est permis, pas le 1er chiffre."), G("Total ?", v, M(D(v)) + ".")],
            traps: [TR(k === 3 ? 720 : 5040, "Le premier chiffre ne peut pas être 0 : 9 choix."), TR(k === 3 ? 504 : 3024, "Pour le 2e chiffre, le 0 redevient possible : encore 9 choix."), TR(k === 3 ? 900 : 9000, "Les chiffres doivent être différents.")] }); },
    ],
  };

  // ======================= probaxiomes : équiprobabilité, contraire, réunion (3.PS.02a–c) =======================
  const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
  const PA = {
    1: [
      /* 25.11 (audit niveau 3e) : urne « multiple de k / nombre premier », « 1 − 0,08 » et somme de deux dés = niveau 9e–11e.
         Remplacés par des probabilités calculées par dénombrement (3.PS.02b–c avec 3.PS.01). */
      () => { const r = ri(4, 9), b = ri(3, 8), n = r + b, col = pk([["rouges", "bleues", "boules"], ["vertes", "jaunes", "billes"], ["noires", "blanches", "perles"]]), ask = pk(["deux", "mixte"]);
        const fav = ask === "deux" ? Cb(r, 2) : r * b, v = fav / Cb(n, 2);
        return QN("Un sac contient " + r + " " + col[2] + " " + col[0] + " et " + b + " " + col[2] + " " + col[1] + ". On en tire deux simultanément. Quelle est la probabilité d'obtenir " + (ask === "deux" ? "deux " + col[2] + " " + col[0] : "une " + col[2].slice(0, -1) + " de chaque couleur") + " ?", v,
          M(bn(n, 2) + " = " + Cb(n, 2)) + " tirages équiprobables ; favorables : " + M(ask === "deux" ? bn(r, 2) + " = " + fav : r + " \\cdot " + b + " = " + fav) + ". " + M("P = \\frac{" + fav + "}{" + Cb(n, 2) + "}" + (den(v) < Cb(n, 2) ? " = " + fT(v) : "")) + ".",
          { ctx: "simultane-" + ask, guide: [G("Nombre de tirages possibles " + M(bn(n, 2)) + " ?", Cb(n, 2), M(Cb(n, 2)) + "."), G("Nombre de tirages favorables ?", fav, M(fav) + "."), G("Probabilité ?", v, M(fT(v)) + ".")],
            traps: ask === "deux" ? [TR((r / n) ** 2, "Les deux boules sont tirées ensemble : pas de remise."), TR(r / n, "Il faut deux boules de cette couleur."), TR(Cb(r, 2) / (n * n), "Le nombre de tirages possibles est C(" + n + " ; 2) = " + Cb(n, 2) + ".")] : [TR(r * b / (n * n), "Sans remise : C(" + n + " ; 2) = " + Cb(n, 2) + " tirages possibles."), TR(r * b / (n * (n - 1)), "Une paire non ordonnée : C(" + n + " ; 2) = " + Cb(n, 2) + ", pas " + n * (n - 1) + "."), TR(0.5, "Les couleurs n'ont pas le même nombre de boules.")] }); },
      () => { const t = pk(["des", "jass"]); let v, txt, cmp, ctx, tr;
        if (t === "des") { const k = pk([3, 4, 5]); v = 1 - (5 / 6) ** k; cmp = (5 / 6) ** k; ctx = "au-moins-un-six"; txt = "On lance " + k + " dés équilibrés. Quelle est la probabilité d'obtenir au moins un 6 (" + "arrondi au millième) ?"; tr = [TR(k / 6, "Les cas « un 6 sur le 1er dé », « sur le 2e »… ne sont pas incompatibles : passe par le contraire."), TR(cmp, "C'est la probabilité de n'avoir aucun 6 ; prends le contraire."), TR(1 - (1 / 6) ** k, "Le contraire de « au moins un 6 » est « aucun 6 » : (5/6)^" + k + ".")]; }
        else { const k = pk([3, 4]); cmp = Cb(32, k) / Cb(36, k); v = 1 - cmp; ctx = "au-moins-un-as"; txt = "On tire simultanément " + k + " cartes d'un jeu de jass de 36 cartes (4 as). Quelle est la probabilité d'obtenir au moins un as (arrondi au millième) ?"; tr = [TR(k * 4 / 36, "Les événements « un as en 1re carte »… ne sont pas incompatibles : passe par le contraire."), TR(cmp, "C'est la probabilité de n'avoir aucun as ; prends le contraire."), TR(4 / 36, "Il y a " + k + " cartes tirées.")]; }
        return mk(txt, { kind: "value", value: v, round: 0.001 }, "Événement contraire : " + M("P = 1 - P(\\text{aucun}) = 1 - " + dS3(cmp) + " \\approx " + dS3(v)) + ".",
          { ctx, guide: [GS("Probabilité de l'événement contraire « aucun » (" + "arrondie au millième) ?", cmp, M("\\approx " + dS3(cmp)) + ".", 0.001), GS("Probabilité cherchée ?", v, M("\\approx " + dS3(v)) + ".", 0.001)], traps: tr }); },
      () => { const t = pk([["chiffres", 10, pk([3, 4]), "Un code de", "chiffres (de 0 à 9) est choisi au hasard."], ["lettres", 6, pk([3, 4]), "Un mot de passe de", "lettres, chacune tirée au hasard parmi A, B, C, D, E, F."], ["anniversaires", 12, pk([3, 4, 5]), "Dans un groupe de", "personnes, chacune est née un mois au hasard (12 mois équiprobables)."]]);
        const n = t[1], k = t[2], A = Cb(n, k) * fact(k), N = n ** k, v = A / N;
        return mk(t[3] + " " + k + " " + t[4] + " Quelle est la probabilité que " + (t[0] === "anniversaires" ? "toutes soient nées des mois différents" : "tous ses symboles soient différents") + " (arrondi au millième) ?", { kind: "value", value: v, round: 0.001 },
          "Issues équiprobables : " + M(n + "^" + k + " = " + D(N)) + ". Favorables (arrangements) : " + M(Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ") + " = " + D(A)) + ". " + M("P = \\frac{" + D(A) + "}{" + D(N) + "} \\approx " + dS3(v)) + ".",
          { ctx: "tous-differents-" + t[0], guide: [G("Nombre total d'issues " + M(n + "^" + k) + " ?", N, M(D(N)) + "."), G("Nombre d'issues sans répétition ?", A, M(D(A)) + "."), GS("Probabilité (arrondie au millième) ?", v, M("\\approx " + dS3(v)) + ".", 0.001)],
            traps: [TR(Cb(n, k) / N, "L'ordre compte dans les issues : compte les arrangements " + n + " · " + (n - 1) + " · …"), TR(1 - v, "C'est la probabilité qu'au moins deux symboles soient égaux."), TR(A / (Cb(n + k - 1, k) * fact(k)), "Le total des issues est " + n + "^" + k + ".")] }); },
    ],
    2: [
      () => { const a = pk([0.3, 0.4, 0.45, 0.5, 0.25, 0.6]), b = pk([0.2, 0.35, 0.4, 0.15, 0.3]), i = pk([0.05, 0.1, 0.15]), ask = pk(["union", "inter"]), u = r6(a + b - i); if (i >= Math.min(a, b) || u > 1) return null;
        if (ask === "union") return QN("On sait que " + M("P(A) = " + D(a)) + ", " + M("P(B) = " + D(b)) + " et " + M("P(A \\cap B) = " + D(i)) + ". Calcule " + M("P(A \\cup B)") + ".", u,
          M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = " + D(a) + " + " + D(b) + " - " + D(i) + " = " + D(u)) + ".",
          { ctx: "reunion", guide: [G(M("P(A) + P(B)") + " ?", r6(a + b), M(D(r6(a + b))) + "."), G(M("P(A \\cup B)") + " ?", u, M(D(u)) + ".")],
            traps: [TR(r6(a + b), "A ∩ B est compté deux fois : retire-le une fois."), TR(r6(a + b + i), "On retire P(A ∩ B), on ne l'ajoute pas."), TR(r6(a * b), "C'est un produit ; pour « A ou B », on additionne et on retire P(A ∩ B).")] });
        return QN("On sait que " + M("P(A) = " + D(a)) + ", " + M("P(B) = " + D(b)) + " et " + M("P(A \\cup B) = " + D(u)) + ". Calcule " + M("P(A \\cap B)") + ".", i,
          M("P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = " + D(a) + " + " + D(b) + " - " + D(u) + " = " + D(i)) + ".",
          { ctx: "intersection", guide: [G(M("P(A) + P(B)") + " ?", r6(a + b), M(D(r6(a + b))) + "."), G(M("P(A \\cap B)") + " ?", i, M(D(i)) + ".")],
            traps: [TR(r6(a * b), "A et B ne sont pas forcément indépendants : utilise P(A ∪ B) = P(A) + P(B) − P(A ∩ B)."), TR(r6(u - a), "C'est P(B) − P(A ∩ B) : retire encore."), TR(r6(a + b + u), "P(A ∩ B) = P(A) + P(B) − P(A ∪ B).")] }); },
      () => { const S = pk(["un cœur", "un pique", "un trèfle", "un carreau"]), Gp = pk([["un as", 4], ["une figure (valet, dame ou roi)", 12], ["un 6, un 7 ou un 8", 12], ["un dix ou un as", 8]]), both = Gp[1] / 4, cnt = 9 + Gp[1] - both, v = cnt / 36;
        return QN("On tire une carte au hasard dans un jeu de jass de 36 cartes (4 couleurs de 9 cartes : 6, 7, 8, 9, 10, valet, dame, roi, as). Quelle est la probabilité de tirer " + S + " ou " + Gp[0] + " ?", v,
          M("P(A \\cup B) = \\frac{9}{36} + \\frac{" + Gp[1] + "}{36} - \\frac{" + both + "}{36} = \\frac{" + cnt + "}{36}" + (den(v) < 36 ? " = " + fT(v) : "")) + " (les " + both + " cartes qui sont les deux sont comptées une seule fois).",
          { ctx: "jass", guide: [G("Nombre de cartes de la couleur ?", 9, M(9) + "."), G("Nombre de cartes « " + Gp[0] + " » ?", Gp[1], M(Gp[1]) + "."), G("Cartes qui sont les deux à la fois ?", both, M(both) + "."), G("Probabilité ?", v, M(fT(v)) + ".")],
            traps: [TR((9 + Gp[1]) / 36, "Les " + both + " cartes qui sont les deux à la fois sont comptées deux fois."), TR(both / 36, "C'est « et » ; on demande « ou »."), TR((9 * Gp[1]) / 36 / 36, "Pour « ou », on additionne et on retire l'intersection.")] }); },
      () => { const N = pk([24, 25, 28, 30]), a = ri(8, 15), b = ri(6, 12), c = ri(2, Math.min(a, b) - 2), nn = N - a - b + c; if (nn <= 1) return null; const v = nn / N, act = pk([["font du football", "jouent d'un instrument", "ne fasse ni football ni musique", "sondage-loisirs"], ["ont un chat", "ont un chien", "n'ait ni chat ni chien", "sondage-animaux"], ["lisent des mangas", "lisent des BD", "ne lise ni mangas ni BD", "sondage-lecture"]]);
        return QN("Dans une classe de " + N + " élèves, " + a + " " + act[0] + ", " + b + " " + act[1] + " et " + c + " font les deux. On choisit un élève au hasard. Quelle est la probabilité qu'il " + act[2] + " ?", v,
          "Au moins l'un des deux : " + M(a + " + " + b + " - " + c + " = " + (a + b - c)) + " élèves. Ni l'un ni l'autre : " + M(N + " - " + (a + b - c) + " = " + nn) + ". Probabilité " + M("\\frac{" + nn + "}{" + N + "}" + (den(v) < N ? " = " + fT(v) : "")) + ".",
          { ctx: act[3], guide: [G("Élèves concernés par au moins l'un des deux (" + a + " + " + b + " − " + c + ") ?", a + b - c, M(a + b - c) + "."), G("Ni l'un ni l'autre ?", nn, M(nn) + "."), G("Probabilité ?", v, M(fT(v)) + ".")],
            traps: [TR((N - a - b) / N, "Les " + c + " élèves qui font les deux ont été retirés deux fois."), TR(c / N, "C'est la probabilité de « les deux »."), TR(nn, "C'est un nombre d'élèves : divise par " + N + ".")] }); },
    ],
    3: [
      () => { const a = pk([0.4, 0.5, 0.45, 0.6, 0.35]), b = pk([0.3, 0.25, 0.4, 0.2]), i = pk([0.1, 0.15, 0.05]), u = r6(a + b - i), v = r6(a - i); if (u > 1 || i >= b) return null;
        return QN("On sait que " + M("P(A) = " + D(a)) + ", " + M("P(B) = " + D(b)) + " et " + M("P(A \\cup B) = " + D(u)) + ". Quelle est la probabilité que " + M("A") + " se réalise, mais pas " + M("B") + " ?", v,
          M("P(A \\cap B) = " + D(a) + " + " + D(b) + " - " + D(u) + " = " + D(i)) + ", puis " + M("P(A \\cap \\overline{B}) = P(A) - P(A \\cap B) = " + D(a) + " - " + D(i) + " = " + D(v)) + ".",
          { ctx: "a-seulement", guide: [G(M("P(A \\cap B)") + " ?", i, M(D(i)) + "."), G(M("P(A) - P(A \\cap B)") + " ?", v, M(D(v)) + ".")],
            traps: [TR(i, "C'est P(A ∩ B) : A et B ensemble."), TR(r6(a - b), "On retire la partie commune P(A ∩ B), pas P(B)."), TR(r6(a * (1 - b)), "A et B ne sont pas forcément indépendants : passe par P(A ∩ B).")] }); },
      () => { const m = ri(2, 5), ask = pk(["six", "pair", "petit"]), tot = 5 + m, v = ask === "six" ? m / tot : ask === "pair" ? (2 + m) / tot : 3 / tot, ev = { six: "un 6", pair: "un nombre pair", petit: "un nombre inférieur ou égal à 3" }[ask];
        return QN("Un dé est truqué : le 6 sort " + m + " fois plus souvent que chacune des autres faces (qui sont équiprobables entre elles). Quelle est la probabilité d'obtenir " + ev + " ?", v,
          "Si une face ordinaire a la probabilité " + M("p") + " : " + M("5p + " + m + "p = 1") + ", " + M("p = \\frac{1}{" + tot + "}") + ". " + (ask === "six" ? M("P(6) = \\frac{" + m + "}{" + tot + "}") : ask === "pair" ? M("P(\\text{pair}) = p + p + " + m + "p = \\frac{" + (2 + m) + "}{" + tot + "}") : M("P(\\le 3) = 3p = \\frac{3}{" + tot + "}")) + (den(v) < tot ? " " + M("= " + fT(v)) : "") + ".",
          { ctx: "de-truque-" + ask, guide: [G("Probabilité " + M("p") + " d'une face ordinaire (" + M("5p + " + m + "p = 1") + ") ?", 1 / tot, M("\\frac{1}{" + tot + "}") + "."), G("Probabilité demandée ?", v, M(fT(v)) + ".")],
            traps: [TR(ask === "six" ? m / 6 : ask === "pair" ? 1 / 2 : 1 / 2, "Le dé est truqué : les faces ne sont pas équiprobables."), TR(ask === "six" ? 1 / 6 : ask === "pair" ? (2 + m) / 6 : 3 / (6 + m), "La somme des six probabilités vaut 1 : 5p + " + m + "p = 1."), TR(ask === "six" ? 1 / tot : (ask === "pair" ? 3 : 2) / tot, ask === "six" ? "C'est p, la probabilité d'une face ordinaire : le 6 vaut " + m + "p." : "Compte bien les faces : le 6 vaut " + m + "p.")] }); },
      () => { const k = pk(["produit", "six", "ecart", "somme"]); let cnt, txt, trs;
        if (k === "produit") { cnt = 27; txt = "un produit pair"; trs = [TR(1 / 2, "Le produit est pair dès qu'un des deux dés est pair."), TR(1 / 4, "C'est la probabilité que les deux soient pairs.")]; }
        else if (k === "six") { cnt = 11; txt = "au moins un 6"; trs = [TR(12 / 36, "Le couple (6 ; 6) est compté deux fois."), TR(1 / 36, "C'est la probabilité de deux 6.")]; }
        else if (k === "ecart") { const d = ri(1, 4); cnt = 2 * (6 - d); txt = "un écart de " + d + " entre les deux résultats (le plus grand moins le plus petit)"; trs = [TR((6 - d) / 36, "Deux ordres : par exemple (1 ; " + (1 + d) + ") et (" + (1 + d) + " ; 1)."), TR(1 / 6, "Les écarts ne sont pas équiprobables : compte les couples.")]; }
        else { const s = ri(9, 11); cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 6, 3][s]; txt = "une somme d'au moins " + s; trs = [TR((6 - Math.abs(7 - s)) / 36, "« Au moins " + s + " » : additionne les sommes " + s + ", " + (s + 1) + ", …, 12."), TR((13 - s) / 11, "Les sommes ne sont pas équiprobables : compte les 36 couples.")]; }
        const v = cnt / 36;
        return QN("On lance deux dés équilibrés (un rouge et un bleu). Quelle est la probabilité d'obtenir " + txt + " ?", v,
          "On compte dans le tableau des 36 couples (rouge ; bleu) : " + M(cnt) + " cas favorables. " + M("\\frac{" + cnt + "}{36}" + (den(v) < 36 ? " = " + fT(v) : "")) + "." + (k === "produit" ? " (Par le contraire : produit impair quand les deux sont impairs, " + M("\\frac{9}{36}") + ".)" : k === "six" ? " (Par le contraire : " + M("1 - \\frac{25}{36}") + ".)" : ""),
          { ctx: "deux-des-" + k, guide: [G("Nombre de couples favorables (sur 36) ?", cnt, M(cnt) + "."), G("Probabilité ?", v, M(fT(v)) + ".")], traps: trs.concat([TR(cnt, "C'est le nombre de cas : divise par 36.")]) }); },
    ],
  };

  // ======================= probarbre : expériences successives, arbres (3.PS.02d) =======================
  const PT = {
    1: [
      /* 25.11 (audit niveau 3e) : « deux tirages avec remise », « deux événements indépendants », « un dé lancé deux fois »
         (un seul chemin, un produit) = niveau 11e. Remplacés par des arbres à plusieurs chemins (3.PS.02d). */
      () => { const r = ri(3, 8), b = ri(3, 8), n = r + b, it = pk(ITEMS), v = (2 * r * b) / (n * (n - 1));
        return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise. Quelle est la probabilité d'obtenir exactement une " + it[0].replace(/s$/, "") + " " + it[1].replace(/s$/, "") + " ?", v,
          "Deux chemins : " + it[1].replace(/s$/, "") + " puis " + it[2].replace(/s$/, "") + ", ou l'inverse. " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + (n - 1) + "} = " + fT(v)) + ".",
          { ctx: "exactement-une", guide: [G("Probabilité du chemin « " + it[1].replace(/s$/, "") + " puis " + it[2].replace(/s$/, "") + " » ?", (r * b) / (n * (n - 1)), M(fT((r * b) / (n * (n - 1)))) + "."), G("Probabilité cherchée (deux chemins) ?", v, M(fT(v)) + ".")],
            traps: [TR((r * b) / (n * (n - 1)), "Il y a deux chemins : l'ordre inverse convient aussi."), TR((2 * r * b) / (n * n), "Sans remise : il reste " + (n - 1) + " objets au 2e tirage."), TR((r / n) * (b / n), "Sans remise, et deux chemins possibles.")] }); },
      () => { const p = pk([0.9, 0.95, 0.8, 0.85]), q = pk([0.7, 0.6, 0.75, 0.8]), rr = pk([0.5, 0.6, 0.7]), v = r6(p * (1 - (1 - q) * (1 - rr))), c = pk([["Un circuit électrique fonctionne si le composant A fonctionne et si au moins un des deux composants B, C (montés en parallèle) fonctionne.", "circuit", "le circuit fonctionne"], ["Un réseau informatique fonctionne si le serveur A fonctionne et si au moins un des deux routeurs B, C (de secours l'un pour l'autre) fonctionne.", "reseau", "le réseau fonctionne"], ["Une alarme se déclenche si la centrale A fonctionne et si au moins un des deux détecteurs B, C réagit.", "alarme", "l'alarme se déclenche"]]);
        return QN(c[0] + " Les éléments sont indépendants : A fonctionne avec la probabilité " + M(D(p)) + ", B avec " + M(D(q)) + ", C avec " + M(D(rr)) + ". Quelle est la probabilité que " + c[2] + " ?", v,
          "B ou C : " + M("1 - (1 - " + D(q) + ")(1 - " + D(rr) + ") = " + D(r6(1 - (1 - q) * (1 - rr)))) + ". Avec A : " + M(D(p) + " \\cdot " + D(r6(1 - (1 - q) * (1 - rr))) + " = " + D(v)) + ".",
          { ctx: "serie-parallele-" + c[1], guide: [G("Probabilité qu'aucun des deux, B et C, ne fonctionne ?", (1 - q) * (1 - rr), M(D(r6((1 - q) * (1 - rr)))) + "."), G("Probabilité qu'au moins un des deux fonctionne ?", 1 - (1 - q) * (1 - rr), M(D(r6(1 - (1 - q) * (1 - rr)))) + "."), G("Avec A ?", v, M(D(v)) + ".")],
            traps: [TR(r6(p * q * rr), "B et C sont en parallèle : il suffit que l'un des deux fonctionne."), TR(r6(p * (q + rr)), "B et C ne sont pas incompatibles : passe par le contraire."), TR(r6(1 - (1 - q) * (1 - rr)), "A doit aussi fonctionner : multiplie par " + T(p) + ".")] }); },
      () => { const p = pk([0.2, 0.25, 0.3, 0.4, 0.6]), k = pk([3, 4, 5]), v = r6((1 - p) ** (k - 1) * p), c = pk([["Une archère touche la cible", "touche la cible pour la première fois", "tir", "archere"], ["Un basketteur réussit un lancer franc", "réussisse pour la première fois", "lancer", "basket"], ["Un dé truqué donne un 6", "obtienne un 6 pour la première fois", "lancer", "de"]]);
        return QN(c[0] + " avec la probabilité " + M(D(p)) + ", à chaque " + c[2] + " et indépendamment. Quelle est la probabilité qu'" + (c[3] === "de" ? "on" : c[3] === "archere" ? "elle" : "il") + " " + c[1] + " au " + k + "e " + c[2] + " ?", v,
          "Chemin : " + (k - 1) + " échecs puis un succès. " + M("(1 - " + D(p) + ")^{" + (k - 1) + "} \\cdot " + D(p) + " = " + D(r6((1 - p) ** (k - 1))) + " \\cdot " + D(p) + " = " + D(v)) + ".",
          { ctx: "premier-succes-" + c[3], guide: [G("Probabilité de " + (k - 1) + " échecs de suite ?", (1 - p) ** (k - 1), M(D(r6((1 - p) ** (k - 1)))) + "."), G("Puis un succès ?", v, M(D(v)) + ".")],
            traps: [TR(p, "Il faut d'abord " + (k - 1) + " échecs."), TR(r6((1 - p) ** k), "Le dernier " + c[2] + " est un succès : facteur " + T(p) + "."), TR(r6(1 - (1 - p) ** k), "C'est « au moins un succès en " + k + " », pas « le premier au " + k + "e ».")] }); },
    ],
    2: [
      () => { const r = ri(3, 7), b = ri(2, 6), n = r + b, it = pk(ITEMS), v = (r * (r - 1)) / (n * (n - 1));
        return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise. Quelle est la probabilité d'obtenir deux " + it[0] + " " + it[1] + " ?", v,
          "Sans remise : au 2e tirage, il reste " + M(r - 1) + " " + it[1] + " sur " + M(n - 1) + ". " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fT(v)) + ".",
          { ctx: "urne-sans-remise", guide: [G("Probabilité au 1er tirage ?", r / n, M(fT(r / n)) + "."), G("Au 2e tirage, sachant que la 1re était " + it[3] + " ?", (r - 1) / (n - 1), M(fT((r - 1) / (n - 1))) + "."), G("Produit ?", v, M(fT(v)) + ".")],
            traps: [TR((r / n) ** 2, "Sans remise : au 2e tirage, il reste " + (r - 1) + " " + it[1] + " sur " + (n - 1) + "."), TR((r - 1) / (n - 1), "C'est seulement la 2e branche : multiplie par la 1re."), TR((r * (r - 1)) / (n * n), "Le dénominateur aussi diminue : " + (n - 1) + " au 2e tirage.")] }); },
      () => { const r = ri(2, 7), b = ri(2, 7), n = r + b, it = pk(ITEMS), v = (2 * r * b) / (n * n);
        return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire une, on la remet, puis on en tire une deuxième. Quelle est la probabilité d'obtenir deux couleurs différentes ?", v,
          "Deux chemins : " + it[3] + " puis " + it[4] + ", ou " + it[4] + " puis " + it[3] + ". " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + n + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + n + "} = " + fT(v)) + ".",
          { ctx: "urne-deux-couleurs", guide: [G("Chemin " + it[3] + " puis " + it[4] + " ?", (r * b) / (n * n), M(fT((r * b) / (n * n))) + "."), G("Total (deux chemins) ?", v, M(fT(v)) + ".")],
            traps: [TR((r * b) / (n * n), "Il y a deux ordres : " + it[3] + " puis " + it[4] + ", et l'inverse."), TR((2 * r * b) / (n * (n - 1)), "Avec remise : l'urne est la même au 2e tirage."), TR((r + b) / (n * n), "Le long d'un chemin, on multiplie.")] }); },
      () => { const C = pk([[(p, k) => "Un archer touche la cible avec la probabilité " + M(D(p)) + " à chaque tir, indépendamment. Il tire " + k + " fois. Quelle est la probabilité qu'il touche la cible au moins une fois ?", "archer"], [(p, k) => "Sur son trajet, Mia passe " + k + " feux indépendants ; chacun est rouge avec la probabilité " + M(D(p)) + ". Quelle est la probabilité qu'elle rencontre au moins un feu rouge ?", "feux-rouges"], [(p, k) => "Une graine germe avec la probabilité " + M(D(p)) + ". On plante " + k + " graines (indépendantes). Quelle est la probabilité qu'au moins une graine germe ?", "graines"]]);
        const p = pk([0.1, 0.2, 0.3, 0.4, 0.6]), k = ri(2, 4), none = r6((1 - p) ** k), v = r6(1 - none);
        return QN(C[0](p, k), v,
          "Par le contraire : « aucun » a la probabilité " + M(D(r6(1 - p)) + "^" + k + " = " + D(none)) + ", donc " + M("1 - " + D(none) + " = " + D(v)) + ".",
          { ctx: "au-moins-un-" + C[1], guide: [G("Probabilité d'un échec à un essai ?", 1 - p, M(D(r6(1 - p))) + "."), G("Probabilité de « aucun » sur les " + k + " essais ?", none, M(D(r6(1 - p)) + "^" + k + " = " + D(none)) + "."), G("Au moins un ?", v, M(D(v)) + ".")],
            traps: [TR(r6(k * p), "On ne peut pas additionner : passe par le contraire « aucun »."), TR(r6(p ** k), "C'est la probabilité que tous réussissent."), TR(none, "C'est la probabilité de « aucun » : prends le contraire.")] }); },
    ],
    3: [
      () => { const r = ri(3, 6), b = ri(3, 6), n = r + b, it = pk(ITEMS), dn = n * (n - 1) * (n - 2), pr = (r * (r - 1) * (r - 2)) / dn, pb = (b * (b - 1) * (b - 2)) / dn, v = pr + pb;
        return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire trois, l'une après l'autre, sans remise. Quelle est la probabilité qu'elles soient toutes de la même couleur ?", v,
          "Deux chemins : trois " + it[1] + " " + M("\\frac{" + r + " \\cdot " + (r - 1) + " \\cdot " + (r - 2) + "}{" + n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + "} = " + fT(pr)) + ", ou trois " + it[2] + " " + M("= " + fT(pb)) + ". Total " + M(fT(v)) + ".",
          { ctx: "trois-meme-couleur", guide: [G("Probabilité de trois " + it[1] + " ?", pr, M(fT(pr)) + "."), G("Probabilité de trois " + it[2] + " ?", pb, M(fT(pb)) + "."), G("Total ?", v, M(fT(v)) + ".")],
            traps: [TR(pr, "Il y a deux couleurs possibles : additionne les deux chemins."), TR((r ** 3 + b ** 3) / n ** 3, "Sans remise : l'urne change à chaque tirage."), TR(pr * pb, "Ce sont deux chemins différents : on les additionne.")] }); },
      () => { const r1 = ri(1, 5), n1 = r1 + ri(1, 5), r2 = ri(1, 5), n2 = r2 + ri(1, 5), cho = pk(["piece", "de"]), pU = cho === "piece" ? 1 / 2 : 1 / 3; if (r1 * n2 === r2 * n1) return null; const v = pU * (r1 / n1) + (1 - pU) * (r2 / n2);
        return QN("L'urne U₁ contient " + r1 + " boule" + (r1 > 1 ? "s" : "") + " rouge" + (r1 > 1 ? "s" : "") + " et " + (n1 - r1) + " bleue" + (n1 - r1 > 1 ? "s" : "") + " ; l'urne U₂, " + r2 + " rouge" + (r2 > 1 ? "s" : "") + " et " + (n2 - r2) + " bleue" + (n2 - r2 > 1 ? "s" : "") + ". " + (cho === "piece" ? "On lance une pièce : pile, on tire une boule dans U₁ ; face, dans U₂." : "On lance un dé : avec 1 ou 2, on tire une boule dans U₁ ; sinon, dans U₂.") + " Quelle est la probabilité de tirer une boule rouge ?", v,
          "Deux chemins dans l'arbre : " + M(fT(pU) + " \\cdot \\frac{" + r1 + "}{" + n1 + "} + " + fT(1 - pU) + " \\cdot \\frac{" + r2 + "}{" + n2 + "} = " + fT(v)) + ".",
          { ctx: "deux-urnes-" + cho, guide: [G("Chemin U₁ puis rouge ?", pU * (r1 / n1), M(fT(pU * (r1 / n1))) + "."), G("Chemin U₂ puis rouge ?", (1 - pU) * (r2 / n2), M(fT((1 - pU) * (r2 / n2))) + "."), G("Total ?", v, M(fT(v)) + ".")],
            traps: [TR((r1 + r2) / (n1 + n2), "On ne mélange pas les urnes : suis les deux chemins de l'arbre."), TR(r1 / n1 + r2 / n2, "Chaque chemin se multiplie par la probabilité de choisir l'urne."), TR((r1 / n1) * (r2 / n2), "On ne tire qu'une boule : les deux chemins s'additionnent.")] }); },
      () => { const r = ri(2, 7), b = ri(2, 7), n = r + b, it = pk(ITEMS), rr = (r * (r - 1)) / (n * (n - 1)), br = (b * r) / (n * (n - 1)), v = r / n;
        return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise, sans regarder la première. Quelle est la probabilité que la deuxième soit " + it[3] + " ?", v,
          "Deux chemins : " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + (n - 1) + "} = \\frac{" + r * (r - 1) + " + " + b * r + "}{" + n * (n - 1) + "} = " + fT(v)) + " : la même probabilité qu'au premier tirage !",
          { ctx: "second-tirage", guide: [G("Chemin " + it[3] + " puis " + it[3] + " ?", rr, M(fT(rr)) + "."), G("Chemin " + it[4] + " puis " + it[3] + " ?", br, M(fT(br)) + "."), G("Total ?", v, M(fT(v)) + ".")],
            traps: [TR((r - 1) / (n - 1), "On ne sait pas ce qu'a donné le 1er tirage : il y a deux chemins."), TR(rr, "C'est « deux " + it[1] + " » ; il faut aussi le chemin " + it[4] + " puis " + it[3] + "."), TR(br, "Il manque le chemin " + it[3] + " puis " + it[3] + ".")] }); },
    ],
  };

  // ---------- problèmes en plusieurs étapes (niveau 4), valeurs tirées au hasard ----------
  const PROBS = {
    limites: [() => { let a, r, m; do { a = nz(-4, 4); r = nz(-5, 5); m = pk([2, 3, -2]); } while (r === a || r === -a);
      const num = [m, -m * (a + r), m * a * r], v1 = (m * (a - r)) / (2 * a);
      return P("Soit " + M("f(x) = \\frac{" + P2(num) + "}{" + P2([1, 0, -a * a]) + "}") + ".",
        [["a) " + M(lim(a) + " f(x)") + " (fraction acceptée)", v1], ["b) " + M(lim("+\\infty") + " f(x)"), m], ["c) Abscisse de la seule asymptote verticale", -a]],
        ["Numérateur et dénominateur s'annulent tous deux en x = " + T(a) + " : factorise-les.", "Après simplification par (" + xmT(a) + "), f(x) = " + T(m) + "(" + xmT(r) + ") ÷ (" + xmT(-a) + ")."],
        "a) " + M("f(x) = \\frac{" + m + "(" + xm(a) + ")(" + xm(r) + ")}{(" + xm(a) + ")(" + xm(-a) + ")} = \\frac{" + m + "(" + xm(r) + ")}{" + xm(-a) + "}") + " pour " + M("x \\neq " + a) + " ; limite " + M("\\frac{" + m * (a - r) + "}{" + 2 * a + "} = " + fT(v1)) + ". b) Termes dominants : " + M("\\frac{" + m + "x^2}{x^2} = " + m) + ". c) En " + M(a) + ", on simplifie (un « trou ») ; en " + M(-a) + ", seul le dénominateur s'annule : " + M("x = " + -a) + ".");
    }],
    limitinf: [() => { const a = pk([12, 20, 30, 8, 40]), b = ri(2, 6);
      return P("Après une injection, la concentration d'un médicament dans le sang vaut " + M("C(t) = \\frac{" + a + "t}{t + " + b + "}") + " mg/L, " + M("t") + " en heures.",
        [["a) " + M("C(" + b + ")") + " (mg/L)", a / 2], ["b) " + M("\\lim_{t \\to +\\infty} C(t)") + " (mg/L)", a], ["c) Après combien d'heures la concentration atteint-elle 90 % de cette limite ?", 9 * b]],
        ["En t = " + b + ", le numérateur vaut " + T(a * b) + " et le dénominateur " + 2 * b + ". À l'infini, t + " + b + " ≈ t.", "c) Résous " + a + "t ÷ (t + " + b + ") = " + T(r6(0.9 * a)) + " : multiplie les deux membres par (t + " + b + ")."],
        "a) " + M("\\frac{" + a * b + "}{" + 2 * b + "} = " + fT(a / 2)) + " mg/L. b) " + M("\\frac{" + a + "t}{t} = " + a) + " mg/L. c) " + M(a + "t = " + D(r6(0.9 * a)) + "(t + " + b + ") \\iff " + D(r6(0.1 * a)) + "t = " + D(r6(0.9 * a * b)) + " \\iff t = " + 9 * b) + " h.");
    }],
    asymptotes: [() => { let a, b, c, d, p, rem; do { a = pk([1, 2, -1]); d = nz(-4, 4); b = ri(-5, 5); c = nz(-6, 6); p = b + a * d; rem = a * d * d + b * d + c; } while (!rem || !p);
      return P("Soit " + M("f(x) = \\frac{" + P2([a, b, c]) + "}{" + xm(d) + "}") + ".",
        [["a) Abscisse de l'asymptote verticale", d], ["b) Asymptote oblique " + M("y = mx + p") + " : réponds « m ; p »", { kind: "pair", values: [a, p] }], ["c) " + M("f(0)") + " (fraction acceptée)", -c / d]],
        ["Le dénominateur s'annule en x = " + T(d) + " (pas le numérateur).", "Divise " + pT([a, b, c]) + " par (" + xmT(d) + ") : le quotient est la droite asymptote."],
        "a) " + M("x = " + d) + ". b) " + M(P2([a, b, c]) + " = (" + xm(d) + ")(" + P2([a, p]) + ")" + sg(rem)) + " : " + M("y = " + P2([a, p])) + ". c) " + M("f(0) = \\frac{" + c + "}{" + -d + "} = " + fT(-c / d)) + ".");
    }],
    continuite: [() => { const [a, b] = pk([[3, 2], [4, 2.5], [3.5, 2], [4, 3], [2.5, 1.5]]), h = pk([2, 3, 4]), k = r6((a - b) * h), x2 = h + ri(2, 5); let x3; do x3 = h + ri(1, 6); while (x3 === x2);
      const P2v = r6(b * x2 + k), S = r6(b * x3 + k);
      return P("Un parking facture " + M("P(x) = " + D(a) + "x") + " CHF pour une durée " + M("x \\le " + h) + " heures, puis " + M("P(x) = " + D(b) + "x + k") + " CHF au-delà.",
        [["a) Valeur de k pour que le prix ne fasse pas de saut (CHF)", k], ["b) Prix pour " + x2 + " heures (CHF)", P2v], ["c) Durée de stationnement (h) pour un prix de " + M(D(S)) + " CHF", x3]],
        ["Les deux formules donnent le même prix en x = " + h + ".", "c) Le prix dépasse " + T(r6(a * h)) + " CHF : utilise la 2e formule et résous " + T(b) + "x + k = " + T(S) + "."],
        "a) " + M(D(a) + " \\cdot " + h + " = " + D(b) + " \\cdot " + h + " + k \\iff k = " + D(k)) + ". b) " + M(D(b) + " \\cdot " + x2 + " + " + D(k) + " = " + D(P2v)) + " CHF. c) " + M(D(b) + "x + " + D(k) + " = " + D(S) + " \\iff x = " + x3) + " h.");
    }],
    etudefct: [() => { const k = ri(1, 3), d = nz(-6, 6), cs = [1, 0, -3 * k * k, d], hi = 2 * k ** 3 + d, lo = d - 2 * k ** 3;
      return P("Soit " + M("f(x) = " + P2(cs)) + ".",
        [["a) Abscisse du maximum local", -k], ["b) Valeur du maximum local", hi], ["c) Valeurs de " + M("m") + " pour lesquelles " + M("f(x) = m") + " a trois solutions (intervalle)", { kind: "solset", ivs: [[lo, false, hi, false]] }]],
        ["f'(x) = 3x² − " + 3 * k * k + " = 3(x − " + k + ")(x + " + k + ").", "c) Trace la droite horizontale y = m : elle coupe la courbe trois fois entre le minimum local et le maximum local."],
        "a) " + M("f'") + " passe de + à − en " + M(-k) + ". b) " + M("f(" + -k + ") = " + hi) + ". c) Minimum local " + M("f(" + k + ") = " + lo) + " : " + M(SolSet.show([[lo, false, hi, false]])) + ".");
    }],
    derivseconde: [() => { const p = nz(-3, 3), c = ri(-6, 6), d = ri(-6, 6), cs = [1, -3 * p, c, d], fp = pv(cs, p), m = c - 3 * p * p, n = p ** 3 + d;
      return P("Soit " + M("f(x) = " + P2(cs)) + ".",
        [["a) Abscisse du point d'inflexion", p], ["b) Ordonnée du point d'inflexion", fp], ["c) Ordonnée à l'origine de la tangente au point d'inflexion", n]],
        ["f''(x) = 6x " + (p > 0 ? "− " + 6 * p : "+ " + -6 * p) + ".", "c) Tangente : y = f'(p)(x − p) + f(p) ; prends x = 0."],
        "a) " + M("f''(x) = " + P2([6, -6 * p]) + " = 0 \\iff x = " + p) + ". b) " + M("f(" + p + ") = " + fp) + ". c) " + M("f'(" + p + ") = " + m) + ", " + M("y = " + m + "(" + xm(p) + ")" + sg(fp)) + " ; en " + M("x = 0") + " : " + M(n) + ".");
    }],
    combi: [() => { const g = ri(5, 9), b = ri(5, 9), n = g + b, v1 = Cb(n, 4), v2 = Cb(g, 2) * Cb(b, 2), v3 = Cb(n, 4) - Cb(b, 4);
      return P("Une classe compte " + g + " filles et " + b + " garçons. On forme un comité de 4 élèves (sans rôle particulier).",
        [["a) Nombre de comités possibles", v1], ["b) Nombre de comités avec exactement 2 filles", v2], ["c) Nombre de comités avec au moins une fille", v3]],
        ["L'ordre ne compte pas : combinaisons.", "c) Passe par le contraire : les comités sans fille."],
        "a) " + M(bn(n, 4) + " = " + D(v1)) + ". b) " + M(bn(g, 2) + " \\cdot " + bn(b, 2) + " = " + Cb(g, 2) + " \\cdot " + Cb(b, 2) + " = " + D(v2)) + ". c) " + M(D(v1) + " - " + bn(b, 4) + " = " + D(v1) + " - " + D(Cb(b, 4)) + " = " + D(v3)) + ".");
    }],
    probaxiomes: [() => { const s = pk([4, 5, 6, 8, 9, 10]), cnt = 6 - Math.abs(7 - s), dbl = s % 2 === 0 ? 1 : 0, u = cnt + 6 - dbl;
      return P("On lance deux dés équilibrés (un rouge et un bleu). A : « la somme vaut " + s + " » ; B : « on obtient un double ».",
        [["a) P(A) (fraction acceptée)", cnt / 36], ["b) P(B)", 1 / 6], ["c) P(A ∪ B)", u / 36]],
        ["Compte les couples (rouge ; bleu) parmi les 36.", "c) P(A ∪ B) = P(A) + P(B) − P(A ∩ B) : " + (dbl ? "le double (" + s / 2 + " ; " + s / 2 + ") est dans A et dans B." : "une somme impaire n'est jamais un double.")],
        "a) " + M("\\frac{" + cnt + "}{36}") + ". b) " + M("\\frac{6}{36} = \\frac{1}{6}") + ". c) " + M("\\frac{" + cnt + "}{36} + \\frac{6}{36} - \\frac{" + dbl + "}{36} = \\frac{" + u + "}{36}" + (den(u / 36) < 36 ? " = " + fT(u / 36) : "")) + ".");
    }],
    probarbre: [() => { const r = ri(3, 6), b = ri(2, 5), n = r + b, it = pk(ITEMS), dd = n * (n - 1), p1 = (r * (r - 1)) / dd, p2 = (2 * r * b) / dd;
      return P("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise.",
        [["a) Probabilité de tirer deux " + it[0] + " " + it[1] + " (fraction acceptée)", p1], ["b) Probabilité de tirer deux couleurs différentes", p2], ["c) Probabilité qu'au moins une des deux soit " + it[4], 1 - p1]],
        ["Dessine l'arbre : au 2e tirage, il reste " + (n - 1) + " " + it[0] + ".", "c) Le contraire de « au moins une " + it[4] + " » est « deux " + it[1] + " »."],
        "a) " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fT(p1)) + ". b) " + M("2 \\cdot \\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} = " + fT(p2)) + ". c) " + M("1 - " + fT(p1) + " = " + fT(1 - p1)) + ".");
    }],
  };

  // ---------- catalogue ----------
  const NEW = [
    { id: "limites", theme: "fa", label: "Limites : lecture, calcul, forme 0/0", ex: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = 6", CH: [14], codesMATU: "3\\.AN\\.01[ab]", lv: LI,
      hint: "Si on peut remplacer x par a (dénominateur non nul), la limite est la valeur obtenue. Forme 0/0 : factorise par (x − a), simplifie, puis remplace.",
      lesson: ["Limites", "Vers quelle valeur f(x) se dirige-t-elle quand x s'approche de a ?", "\\(\\lim_{x \\to a} f(x) = L\\) : \\(f(x)\\) devient aussi proche de \\(L\\) qu'on veut quand \\(x\\) s'approche de \\(a\\), sans forcément l'atteindre. Pour un polynôme, ou une fraction dont le dénominateur ne s'annule pas en \\(a\\), on remplace \\(x\\) par \\(a\\). Forme \\(\\frac{0}{0}\\) : on factorise par \\((x - a)\\) et on simplifie (avec une racine : quantité conjuguée), puis on remplace. Sur un graphique, on lit la limite à gauche (\\(x < a\\)) et la limite à droite (\\(x > a\\)).",
        ["\\(\\lim_{x \\to 2} (x^2 + 3x) = 4 + 6 = 10\\)", "\\(\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6\\)", "\\(\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4} = \\lim_{x \\to 4} \\frac{1}{\\sqrt{x} + 2} = \\frac{1}{4}\\)"], "\\(\\frac{0}{0}\\) n'est pas un résultat (ni 0, ni 1) : c'est le signal qu'il faut simplifier."],
      comps: ["Lire une limite sur un graphique ; calculer une limite par remplacement", "Lever une forme 0/0 en factorisant", "Quantité conjuguée, fractions étagées ; paramètre pour une limite finie"] },
    { id: "limitinf", theme: "fa", label: "Limites à l'infini", ex: "\\lim_{x \\to +\\infty} \\frac{6x^2 + 1}{2x^2 - 5} = 3", CH: [14], codesMATU: "3\\.AN\\.01c", lv: LF,
      hint: "À l'infini, seuls les termes de plus haut degré comptent. Forme ∞ − ∞ : réduis au même dénominateur ou multiplie par la quantité conjuguée.",
      lesson: ["Limites à l'infini", "Que devient f(x) quand x devient très grand, ou très négatif ?", "Pour un polynôme ou une fraction rationnelle, seuls les termes de plus haut degré comptent à l'infini. Mêmes degrés en haut et en bas : la limite est le quotient des coefficients dominants ; degré du haut plus petit : la limite est 0. Forme « \\(\\infty - \\infty\\) » : réduire au même dénominateur, ou multiplier par la quantité conjuguée. Pour \\(x < 0\\), \\(\\sqrt{x^2} = |x| = -x\\).",
        ["\\(\\lim_{x \\to +\\infty} \\frac{6x^2 + x}{2x^2 - 5} = \\frac{6}{2} = 3\\)", "\\(\\lim_{x \\to +\\infty} \\frac{4}{x + 1} = 0\\)", "\\(\\sqrt{x^2 + 6x} - x = \\frac{6x}{\\sqrt{x^2 + 6x} + x}\\), qui tend vers \\(\\frac{6x}{2x} = 3\\)"], "On ne remplace pas \\(x\\) par « l'infini » terme à terme : \\(\\infty - \\infty\\) et \\(\\frac{\\infty}{\\infty}\\) ne sont pas des résultats."],
      comps: ["Limite à l'infini d'une fraction rationnelle ; lecture dans un tableau ; modèle concret", "Termes dominants (carré, produit) ; forme ∞ − ∞", "Quantité conjuguée ; √(x²) = |x| ; paramètre"] },
    { id: "asymptotes", theme: "fa", label: "Asymptotes", ex: "f(x) = \\frac{2x + 1}{x - 3} : x = 3, \\ y = 2", CH: [14], codesMATU: "3\\.AN\\.01[de]", lv: AS,
      hint: "Verticale x = a : le dénominateur s'annule en a (pas le numérateur). Horizontale y = b : b est la limite à l'infini. Oblique : divise le numérateur par le dénominateur.",
      lesson: ["Asymptotes", "Des droites dont la courbe s'approche sans fin.", "Asymptote verticale \\(x = a\\) : \\(f(x)\\) part vers \\(\\pm\\infty\\) quand \\(x\\) s'approche de \\(a\\) (le dénominateur s'annule en \\(a\\), pas le numérateur). Asymptote horizontale \\(y = b\\) : \\(\\lim_{x \\to \\pm\\infty} f(x) = b\\). Asymptote oblique \\(y = mx + p\\) (degré du haut = degré du bas + 1) : on divise, \\(f(x) = mx + p + \\frac{r}{x - d}\\), et la fraction tend vers 0.",
        ["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : verticale \\(x = 3\\), horizontale \\(y = 2\\).", "\\(f(x) = \\frac{x^2 + 1}{x - 1} = x + 1 + \\frac{2}{x - 1}\\) : oblique \\(y = x + 1\\)."], "Si numérateur et dénominateur s'annulent tous deux en \\(a\\), on simplifie d'abord : souvent un « trou », pas une asymptote."],
      comps: ["Trouver une asymptote verticale ou horizontale ; lecture graphique", "Plusieurs asymptotes ; trou ou asymptote ; point d'intersection", "Asymptote oblique ; courbe qui coupe son asymptote ; paramètre"] },
    { id: "continuite", theme: "fa", label: "Continuité", ex: "\\lim_{x \\to a} f(x) = f(a)", CH: [14], codesMATU: "3\\.AN\\.02[ab]", lv: CO,
      hint: "f est continue en a si la limite en a existe et vaut f(a). Pour une fonction par morceaux, égale les valeurs des deux formules au point de raccord.",
      lesson: ["Continuité", "Peut-on tracer la courbe sans lever le crayon ?", "\\(f\\) est continue en \\(a\\) si \\(\\lim_{x \\to a} f(x) = f(a)\\) : la limite à gauche, la limite à droite et \\(f(a)\\) sont égales. Polynômes, fractions rationnelles (là où elles sont définies) et racines sont continus. Fonction par morceaux : chaque morceau est continu ; on vérifie le raccord en égalant les valeurs des deux formules au point de jonction.",
        ["\\(f(x) = 2x + 1\\) si \\(x < 1\\), \\(x^2 + k\\) si \\(x \\ge 1\\) : \\(3 = 1 + k\\), donc \\(k = 2\\).", "\\(f(x) = \\frac{x^2 - 4}{x - 2}\\) et \\(f(2) = 4\\) : continue, car \\(\\lim_{x \\to 2} (x + 2) = 4\\)."], "Au raccord, on utilise les deux formules au même point, même si l'une est écrite avec « < » et l'autre avec « ≥ »."],
      comps: ["Raccorder deux morceaux affines ; repérer un saut sur un graphique ; prolonger par continuité", "Raccord parabole-droite ; paramètre des deux côtés ; tarif sans saut", "Trois morceaux (deux paramètres) ; prolongement avec une racine ; paramètre au carré"] },
    { id: "derivseconde", theme: "fa", label: "Dérivée seconde, points d'inflexion", ex: "f''(x) = 0 \\text{ et change de signe}", CH: [14], codesMATU: "3\\.AN\\.08[ab]", lv: DS,
      hint: "f'' > 0 : f convexe (tournée vers le haut) ; f'' < 0 : concave. Point d'inflexion : f'' s'annule en changeant de signe.",
      lesson: ["Dérivée seconde, concavité", "Dans quel sens la courbe tourne-t-elle ?", "\\(f''\\) est la dérivée de \\(f'\\). Si \\(f'' > 0\\) sur un intervalle, \\(f\\) est convexe (courbe tournée vers le haut) ; si \\(f'' < 0\\), concave (tournée vers le bas). Un point d'inflexion est un point où la courbe change de concavité : \\(f''\\) s'y annule en changeant de signe. Pour \\(ax^3 + bx^2 + cx + d\\), il est en \\(x = -\\frac{b}{3a}\\).",
        ["\\(f(x) = x^3 - 6x^2\\) : \\(f''(x) = 6x - 12\\), inflexion en \\(x = 2\\) ; concave sur \\(]-\\infty \\,;\\, 2]\\), convexe sur \\([2 \\,;\\, +\\infty[\\)."], "\\(f''(a) = 0\\) ne suffit pas : il faut un changement de signe (\\(x^4\\) en 0 n'a pas de point d'inflexion)."],
      comps: ["Trouver un point d'inflexion (degré 3, lecture de f'') ; calculer f''", "Intervalles de concavité ; inflexions d'un polynôme de degré 4", "Paramètre ; tangente d'inflexion ; inflexions d'une fonction rationnelle"] },
    { id: "etudefct", theme: "fa", label: "Étude complète d'une fonction", ex: "D_f, \\text{ zéros}, f', \\text{ extremums}", CH: [14], codesMATU: "3\\.AN\\.07[cd]", lv: EF,
      hint: "Ensemble de définition, zéros, limites et asymptotes, signe de f' et extremums (là où f' change de signe), puis f'' pour la concavité.",
      lesson: ["Étude complète d'une fonction", "Tout savoir d'une fonction avant d'en tracer la courbe.", "1. Ensemble de définition (valeurs interdites). 2. Zéros et signe. 3. Limites aux bornes, asymptotes. 4. Dérivée, son signe, tableau de variations, extremums (là où \\(f'\\) change de signe). 5. Éventuellement \\(f''\\) : concavité, inflexions. 6. Tableau récapitulatif, puis la courbe.",
        ["\\(f(x) = x^3 - 3x\\) : zéros \\(0\\) et \\(\\pm\\sqrt{3}\\) ; \\(f'(x) = 3(x - 1)(x + 1)\\) ; maximum local \\(f(-1) = 2\\), minimum local \\(f(1) = -2\\).", "\\(f(x) = x + \\frac{4}{x}\\) pour \\(x > 0\\) : \\(f'(x) = 1 - \\frac{4}{x^2}\\), minimum \\(f(2) = 4\\)."], "Un zéro de \\(f'\\) n'est un extremum que si \\(f'\\) y change de signe (\\(3x^4 - 8x^3\\) en 0 : palier, pas d'extremum)."],
      comps: ["Zéros, valeurs interdites, extremum d'un polynôme de degré 3", "Extremums d'une fonction rationnelle ; zéros d'une bicarrée", "Extremums sur deux branches ; nombre de solutions de f(x) = m ; palier"] },
    { id: "combi", theme: "no", label: "Dénombrement : permutations, combinaisons", ex: "\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}", CH: [14], codesMATU: "3\\.PS\\.01[a-e]", lv: KO,
      hint: "Principe multiplicatif. L'ordre compte : n(n − 1)… ; il ne compte pas : divise par k!. Répétitions permises : nᵏ.",
      lesson: ["Dénombrement", "Compter sans tout écrire.", "Principe multiplicatif : des choix successifs de \\(n_1, n_2, \\ldots\\) possibilités donnent \\(n_1 \\cdot n_2 \\cdot \\ldots\\) issues. Permutations de \\(n\\) objets : \\(n! = n(n - 1) \\ldots 2 \\cdot 1\\). Arrangements (\\(k\\) objets parmi \\(n\\), l'ordre compte) : \\(n(n - 1) \\ldots (n - k + 1)\\). Combinaisons (l'ordre ne compte pas) : \\(\\binom{n}{k} = \\frac{n(n - 1) \\ldots (n - k + 1)}{k!}\\). Avec répétitions : \\(n^k\\).",
        ["Podium avec 8 coureurs : \\(8 \\cdot 7 \\cdot 6 = 336\\)", "3 délégués parmi 20 : \\(\\binom{20}{3} = \\frac{20 \\cdot 19 \\cdot 18}{6} = 1\\text{'}140\\)", "Mots avec ANANAS : \\(\\frac{6!}{3! \\cdot 2!} = 60\\)"], "Demande-toi toujours si l'ordre compte (podium : oui ; comité : non) et si les répétitions sont permises."],
      comps: ["Principe multiplicatif, permutations, arrangements", "Combinaisons ; répétitions (nᵏ) ; anagrammes", "Comités avec contraintes ; « au moins un » ; problèmes inverses"] },
    { id: "probaxiomes", theme: "no", label: "Probabilités : contraire, réunion", ex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", CH: [14], codesMATU: "3\\.PS\\.02[abc]", lv: PA,
      hint: "Équiprobabilité : cas favorables ÷ cas possibles. P(contraire) = 1 − P(A). P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
      lesson: ["Probabilités : règles de calcul", "Calculer une probabilité sans tout recompter.", "Issues équiprobables : \\(P(A) = \\frac{\\text{cas favorables}}{\\text{cas possibles}}\\). Toujours \\(0 \\le P(A) \\le 1\\). Contraire : \\(P(\\overline{A}) = 1 - P(A)\\). Réunion : \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\) ; si \\(A\\) et \\(B\\) sont incompatibles, \\(P(A \\cup B) = P(A) + P(B)\\).",
        ["Deux dés, somme 7 : 6 couples sur 36, \\(P = \\frac{1}{6}\\).", "\\(P(A) = 0{,}5\\), \\(P(B) = 0{,}4\\), \\(P(A \\cap B) = 0{,}2\\) : \\(P(A \\cup B) = 0{,}7\\)."], "Avec deux dés, les sommes ne sont pas équiprobables : on compte les 36 couples. Et dans \\(A \\cup B\\), l'intersection n'est comptée qu'une fois."],
      comps: ["Équiprobabilité ; événement contraire ; deux dés", "Réunion et intersection ; jeu de cartes ; tableau d'effectifs", "A sans B ; dé truqué ; événements sur deux dés"] },
    { id: "probarbre", theme: "no", label: "Expériences successives, arbres", ex: "P(RR) = \\frac{3}{5} \\cdot \\frac{2}{4}", CH: [14], codesMATU: "3\\.PS\\.02d", lv: PT,
      hint: "Le long d'un chemin de l'arbre, on multiplie ; entre chemins, on additionne. Sans remise, l'urne change. « Au moins un » : 1 − P(aucun).",
      lesson: ["Expériences successives", "Un arbre pour organiser les étapes.", "Sur un arbre, la probabilité d'un chemin est le produit des probabilités de ses branches ; la probabilité d'un événement est la somme des probabilités de ses chemins. Avec remise, les tirages se répètent à l'identique ; sans remise, l'urne change (un objet de moins au 2e tirage). « Au moins un » : on passe par le contraire « aucun », \\(1 - (1 - p)^n\\).",
        ["3 rouges, 2 bleues, deux tirages sans remise : \\(P(RR) = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{3}{10}\\)", "Au moins un 6 en 3 lancers : \\(1 - \\left(\\frac{5}{6}\\right)^3 = \\frac{91}{216}\\)"], "Le long d'un chemin, on multiplie ; entre chemins, on additionne. Pas l'inverse."],
      comps: ["Deux étapes indépendantes ; tirages avec remise", "Tirages sans remise ; deux chemins ; « au moins un »", "Trois tirages ; deux urnes ; second tirage"] },
  ];

  // ---------- enregistrement (additif) ----------
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
  }
  // Figures de leçon : asymptotes d'une hyperbole ; point d'inflexion d'une cubique.
  if (typeof LESSON_FIGS !== "undefined") {
    LESSON_FIGS.asymptotes = () => PL([{ f: (x) => 2 + 1 / (x - 1) }], [], { vlines: [1], hlines: [2], label: "f(x) = 2 + 1/(x − 1) : asymptotes x = 1 et y = 2" });
    LESSON_FIGS.derivseconde = () => PL([{ f: (x) => 0.25 * (x - 1) ** 3 - (x - 1) + 1 }], [[1, 1, "I"]], { label: "point d'inflexion I : la courbe change de concavité" });
  }
})();

// 3e du Collège de Genève (grade 14) · Géométrie vectorielle et analytique de l'espace (24.11, agent c3geo ; programme
// dans tools/programme_3e_4e_college.md, § 3 et § 5, priorité 3). Chapitre Sésamath Ma3 Ch6 (M3C06), compétences
// 3.GV.01 à 3.GV.05 du référentiel matu.
// Huit notions : vect3d (composantes, milieu, norme, Chasles), colin (colinéarité, coplanarité ; MA2), droite3d (droites
// paramétriques de l'espace : notion Collège, car droiteparam de la MP vit dans le paquet « mp », non chargé en 3e),
// plans (équations paramétriques et cartésienne, traces), posrel (positions relatives, intersections), pscal3d (produit
// scalaire : angle, orthogonalité, projection), distances (point-droite, point-plan, aire), sphere (vecteur normal,
// plan médiateur, sphère, plan tangent). Le produit vectoriel (pvect, MA2) reste à faire.
// Réponses : nombre, triplet « x ; y ; z » (format pair à 3 valeurs), couple, ensemble, expression (z en fonction de t).
// Standard : 3 niveaux, au moins 3 formes par niveau, pas à pas, erreurs typiques, étiquette ctx, leçon, indice,
// 3 compétences, problème en plusieurs étapes à valeurs tirées (niveau 4). Paquet de chargement « 14 » (build.py).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => { const x = +(+v).toFixed(9); return x === 0 ? 0 : x; };
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };
  /* nombre en TeX : entier, fraction, sinon décimal à virgule */
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  /* nombre tapé : entier ou a/b */
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  const par = (v) => (r6(v) < 0 ? "(" + fT(v) + ")" : fT(v));
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));
  const DEG = 180 / Math.PI;
  /* fraction m/n, suivie de sa forme simplifiée si elle diffère */
  const frT = (m, n) => { const f = "\\frac{" + m + "}{" + n + "}", g = fT(m / n); return g === f ? f : f + " = " + g; };
  /* coefficient devant une lettre, précédé de son signe (« - 2m », « + m ») */
  const sgc = (c, v) => (c < 0 ? " - " : " + ") + (Math.abs(c) === 1 ? "" : fT(Math.abs(c))) + v;
  const sgn = () => (R.rand() < 0.5 ? -1 : 1);
  const perm = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  /* vecteurs de l'espace (tableaux de 3 nombres) */
  const add = (u, v) => u.map((x, i) => r6(x + v[i]));
  const sub = (u, v) => u.map((x, i) => r6(x - v[i]));
  const mul = (k, u) => u.map((x) => r6(k * x));
  const dot = (u, v) => r6(u.reduce((s, x, i) => s + x * v[i], 0));
  const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]].map(r6);
  const nn2 = (u) => dot(u, u);
  const nrm = (u) => Math.sqrt(nn2(u));
  const isZ = (u) => u.every((x) => Math.abs(x) < 1e-9);
  const red = (u) => { const g = u.reduce((a, x) => gcd(a, Math.abs(x)), 0) || 1; return u.map((x) => r6(x / g)); };
  const det3 = (a, b, c) => dot(a, cross(b, c));
  const angle = (u, v) => DEG * Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nrm(u) * nrm(v)))));
  const rp = (k = 5) => [R.int(-k, k), R.int(-k, k), R.int(-k, k)];
  const rv = (k = 3) => [nz(-k, k), nz(-k, k), nz(-k, k)];
  const D = (v, s) => nb(r6(Math.round(v / s) * s));
  /* quadruplets de Pythagore a² + b² + c² = d² : vecteur à norme entière */
  const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15]];
  const qv = (lim) => { const [a, b, c, d] = pk(lim ? QUAD.slice(0, lim) : QUAD); return [perm([a, b, c]).map((x) => x * sgn()), d]; };
  /* matrices orthogonales entières (lignes deux à deux orthogonales, de même norme n) */
  const ORTH = [[[[1, 2, 2], [2, 1, -2], [2, -2, 1]], 3], [[[2, 3, 6], [3, -6, 2], [6, 2, -3]], 7], [[[1, 4, 8], [4, 7, -4], [8, -4, 1]], 9]];
  const orth = (lim) => { const [Mx, n] = pk(lim ? ORTH.slice(0, lim) : ORTH), p = perm([0, 1, 2]), s = [sgn(), sgn(), sgn()], rows = perm([0, 1, 2]).map((i) => p.map((j, k) => Mx[i][j] * s[k])); return { u: rows[0], w: rows[1], z: rows[2], n }; };
  /* écriture */
  const vec = (s) => (s.length > 1 ? "\\overrightarrow{" + s + "}" : "\\vec{" + s + "}");
  const v3 = (u) => "\\begin{pmatrix} " + u.map(fT).join(" \\\\ ") + " \\end{pmatrix}";
  const vN = (s, u) => M(vec(s) + " = " + v3(u));
  const ptT = (u) => "(" + u.map(fT).join(" \\,;\\, ") + ")";
  const pt = (u) => M(ptT(u));
  const ptN = (n, u) => M(n + ptT(u));
  const TRIP = " Réponds « x ; y ; z ».";
  /* somme de termes c·v (v = "" pour la constante), en TeX ; termes nuls omis */
  const lt = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), t = (vs[i] && a === 1 ? "" : fT(a)) + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };
  /* même chose, tapé au clavier (coefficients fractionnaires entre parenthèses) */
  const ltS = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), cf = !vs[i] ? fS(a) : a === 1 ? "" : Number.isInteger(a) ? fS(a) : "(" + fS(a) + ")", t = cf + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };
  const XYZ = ["x", "y", "z", ""];
  const plT = (n, d) => lt(n.concat([d]), XYZ) + " = 0";
  /* composante d'une représentation paramétrique : constante d'abord (« 2 - 3t ») */
  const cmp = (a, cs, ps) => { const tail = lt(cs, ps); if (!r6(a)) return tail; if (tail === "0") return fT(a); return fT(a) + (tail[0] === "-" ? " - " + tail.slice(1) : " + " + tail); };
  const cmpS = (a, c, p) => { const tail = ltS([c], [p]); if (!r6(a)) return tail; if (tail === "0") return fS(a); return fS(a) + (tail[0] === "-" ? " - " + tail.slice(1) : " + " + tail); };
  const eqD = (A, u, s = "t") => M("\\begin{cases} x = " + cmp(A[0], [u[0]], [s]) + " \\\\ y = " + cmp(A[1], [u[1]], [s]) + " \\\\ z = " + cmp(A[2], [u[2]], [s]) + " \\end{cases}");
  const eqPl = (A, u, v) => M("\\begin{cases} x = " + cmp(A[0], [u[0], v[0]], ["s", "t"]) + " \\\\ y = " + cmp(A[1], [u[1], v[1]], ["s", "t"]) + " \\\\ z = " + cmp(A[2], [u[2], v[2]], ["s", "t"]) + " \\end{cases}");
  /* (x - a)² en TeX */
  const sq = (v, c) => (r6(c) ? "(" + v + (c < 0 ? " + " + fT(-c) : " - " + fT(c)) + ")^2" : v + "^2");
  const sphT = (C, r2) => sq("x", C[0]) + " + " + sq("y", C[1]) + " + " + sq("z", C[2]) + " = " + fT(r2);
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => { const seen = new Set(), tol = Math.max(spec.round || 0, 1e-9); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e !== undefined) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.length || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (tr.spec) { if (spec.kind !== "pair" || tr.spec.values.length !== spec.values.length || !tr.spec.values.every(isFinite)) return false; const c = tr.spec.values.map(fS).join(" ; "); if (seen.has(c) || checkAnswer(spec, c).status === "correct") return false; seen.add(c); return true; }
    if (spec.kind !== "value" || !isFinite(tr.v)) return false;
    const k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
    if (Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
  /* Téléphone 360 px : une formule longue est découpée aux « = » de premier niveau (comme src/ch4c_ana.js). */
  const vis = (t) => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b)).replace(/\\[a-zA-Z]+/g, "x").replace(/\\[,;!]|[{}\s]/g, "");
  const cut = (t) => { const out = []; let d = 0, last = 0;
    for (let i = 0; i < t.length; i++) { const c = t[i];
      if (c === "{") d++; else if (c === "}") d--; else if (t.startsWith("\\left", i)) d++; else if (t.startsWith("\\right", i)) d--;
      else if (d === 0 && i > last + 1) { const m = /^ (=|\\iff|\\approx) /.exec(t.slice(i)); if (m) { out.push(t.slice(last, i)); last = i + 1; i += m[0].length - 2; } } }
    out.push(t.slice(last)); return out; };
  const wrapM = (h) => (typeof h !== "string" ? h : h.replace(/\\\((.*?)\\\)/g, (m, t) => { if (/\\begin/.test(t) || vis(t).length <= 22) return m; const ps = cut(t); if (ps.length < 2) return m;
    const ch = []; let cur = ""; for (const p of ps) { if (cur && vis(cur + p).length > 22) { ch.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; } ch.push(cur);
    return ch.map((c) => "\\(" + c + "\\)").join(" "); }));
  const mk = (q, spec, sol, o) => { const x = { q: wrapM(q), spec, sol: wrapM(sol), guide: (o.guide || []).map((g) => Object.assign({}, g, { ask: wrapM(g.ask), sol: wrapM(g.sol) })), ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
  const QN = (q, value, sol, o) => (isFinite(value) ? mk(q, { kind: "value", value: r6(value) }, sol, o) : null);
  const QR = (q, value, round, sol, o) => (isFinite(value) ? mk(q, { kind: "value", value, round }, sol, o) : null);
  const QP = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o)) : null);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
  const G = (ask, value, sol, round) => GS(ask, r6(value), sol, round);
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
  const TR = TRAP;
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m });
  const TX = (e, m) => ({ e, m });
  const TSt = (s, m) => ({ s: s.map(r6), m });
  const P = (q, parts, hints, sol) => ({ q, sol: wrapM(sol), parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: r6(value) }, round ? { round } : {}) })), hints });
  /* coordonnées d'un point en texte simple (problèmes) */
  const ptS = (u) => "(" + u.map((x) => String(r6(x)).replace(".", ",").replace("-", "−")).join(" ; ") + ")";
  const plS = (n, d) => ltS(n.concat([d]), XYZ).replace(/-/g, "−") + " = 0";

  // ======================= vect3d : vecteurs de l'espace (3.GV.01a–d) =======================
  const VE = {
    1: [
      () => { const A = rp(5), B = rp(5), u = sub(B, A); if (u.some((x) => !x)) return null;
        return QP("Donne les composantes du vecteur " + M(vec("AB")) + " avec " + ptN("A", A) + " et " + ptN("B", B) + "." + TRIP, u, "Extrémité moins origine : " + M(vec("AB") + " = " + v3(u)) + ".",
          { ctx: "composantes", guide: [G("Première composante " + M("x_B - x_A") + " ?", u[0], M(fT(B[0]) + " - " + par(A[0]) + " = " + fT(u[0])) + "."), G("Deuxième " + M("y_B - y_A") + " ?", u[1], M(fT(B[1]) + " - " + par(A[1]) + " = " + fT(u[1])) + "."), G("Troisième " + M("z_B - z_A") + " ?", u[2], M(fT(B[2]) + " - " + par(A[2]) + " = " + fT(u[2])) + "."), GP("Composantes de " + M(vec("AB")) + " ?", u, M(v3(u)) + ".")],
            traps: [TP(sub(A, B), "Extrémité moins origine : B − A, pas A − B."), TP(add(A, B), "On soustrait les coordonnées (B − A), on ne les additionne pas.")] }); },
      () => { const A = rp(6), h = rv(3), B = add(A, mul(2, h)), Mi = add(A, h);
        return QP("Donne les coordonnées du milieu " + M("M") + " de " + M("[AB]") + " avec " + ptN("A", A) + " et " + ptN("B", B) + "." + TRIP, Mi, "Moyenne des coordonnées : " + M("M = \\left(\\frac{x_A + x_B}{2} \\,;\\, \\frac{y_A + y_B}{2} \\,;\\, \\frac{z_A + z_B}{2}\\right)") + " = " + pt(Mi) + ".",
          { ctx: "milieu", guide: [G(M("x_M") + " ?", Mi[0], M("\\frac{" + fT(A[0]) + " + " + par(B[0]) + "}{2} = " + fT(Mi[0])) + "."), G(M("y_M") + " ?", Mi[1], M(fT(Mi[1])) + "."), G(M("z_M") + " ?", Mi[2], M(fT(Mi[2])) + "."), GP("Milieu ?", Mi, pt(Mi) + ".")],
            traps: [TP(h, "Le milieu est la moyenne (x_A + x_B) ÷ 2, pas la demi-différence."), TP(add(A, B), "N'oublie pas de diviser par 2.")] }); },
      () => { const a = pk([2, 3, -2, -3, 4]), b = pk([2, 3, -2, -3]), u = rp(4), v = rp(4); if (isZ(u) || isZ(v)) return null; const w = add(mul(a, u), mul(b, v)); if (isZ(w)) return null;
        const ex = co(a) + "\\vec{u}" + (b < 0 ? " - " : " + ") + Math.abs(b) + "\\vec{v}";
        return QP("Avec " + vN("u", u) + " et " + vN("v", v) + ", calcule les composantes de " + M(ex) + "." + TRIP, w, M(fT(a) + "\\vec{u} = " + v3(mul(a, u))) + ", " + M(fT(b) + "\\vec{v} = " + v3(mul(b, v))) + " ; on additionne : " + M(v3(w)) + ".",
          { ctx: "combinaison", guide: [GP("Composantes de " + M(fT(a) + "\\vec{u}") + " ?", mul(a, u), M(v3(mul(a, u))) + "."), GP("Composantes de " + M(fT(b) + "\\vec{v}") + " ?", mul(b, v), M(v3(mul(b, v))) + "."), GP("Somme ?", w, M(v3(w)) + ".")],
            traps: [TP(add(mul(a, u), v), "Multiplie aussi chaque composante de v par " + b + "."), TP(add(mul(a, u), mul(-b, v)), "Attention au signe devant v."), TP(add(u, v), "Les coefficients " + a + " et " + b + " multiplient les vecteurs.")] }); },
    ],
    2: [
      () => { const [p, d] = qv(), A = rp(5), B = add(A, p);
        return QN("Calcule la distance " + M("AB") + " avec " + ptN("A", A) + " et " + ptN("B", B) + ", c'est-à-dire la norme de " + M(vec("AB")) + ".", d, M(vec("AB") + " = " + v3(p)) + ", " + M("\\|" + vec("AB") + "\\| = \\sqrt{" + p.map((x) => par(x) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "norme", guide: [GP("Composantes de " + M(vec("AB")) + " ?", p, M(v3(p)) + "."), G("Somme des carrés des composantes ?", d * d, M(p.map((x) => x * x).join(" + ") + " = " + d * d) + "."), G("Norme ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")],
            traps: [TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Pythagore dans l'espace : √(a² + b² + c²), on n'additionne pas les composantes."), TR(d * d, "N'oublie pas la racine carrée."), TR(Math.hypot(p[0], p[1]), "Il y a trois composantes : n'oublie pas z.")] }); },
      () => { const A = rp(5), B = rp(5), C = rp(5); if (isZ(cross(sub(B, A), sub(C, B)))) return null; const Dp = add(A, sub(C, B));
        return QP(M("ABCD") + " est un parallélogramme (sommets dans cet ordre) avec " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + ". Donne les coordonnées de " + M("D") + "." + TRIP, Dp, "Dans " + M("ABCD") + ", " + M(vec("AD") + " = " + vec("BC")) + " : " + M("D = A + " + vec("BC") + " = " + ptT(Dp)) + ".",
          { ctx: "parallelogramme", guide: [GP("Composantes de " + M(vec("BC")) + " ?", sub(C, B), M(v3(sub(C, B))) + "."), GP(M("D = A + " + vec("BC")) + " ?", Dp, pt(Dp) + ".")],
            traps: [TP(add(B, sub(C, A)), "C'est le parallélogramme ABDC : dans ABCD, on a AD = BC."), TP(add(A, sub(B, C)), "Dans ABCD, AD = BC : D = A + (C − B)."), TP(add(C, sub(B, A)), "Ce point complète ABEC ; dans ABCD, AD = BC.")] }); },
      () => { const u = rv(4), v = rv(4), w = sub(v, u); if (w.some((x) => !x)) return null;
        return QP("On connaît " + vN("AB", u) + " et " + vN("AC", v) + ". Donne les composantes de " + M(vec("BC")) + "." + TRIP, w, "Chasles : " + M(vec("BC") + " = " + vec("BA") + " + " + vec("AC") + " = " + vec("AC") + " - " + vec("AB") + " = " + v3(w)) + ".",
          { ctx: "chasles", guide: [GP("Composantes de " + M(vec("BA") + " = -" + vec("AB")) + " ?", mul(-1, u), M(v3(mul(-1, u))) + "."), GP(M(vec("BC") + " = " + vec("BA") + " + " + vec("AC")) + " ?", w, M(v3(w)) + ".")],
            traps: [TP(sub(u, v), "BC = BA + AC = AC − AB, pas AB − AC."), TP(add(u, v), "BA = −AB : on soustrait AB.")] }); },
    ],
    3: [
      () => { const A = rp(6), Mi = rp(4); if (A.some((x, i) => x === Mi[i])) return null; const B = sub(mul(2, Mi), A);
        return QP("Le point " + M("B") + " est le symétrique de " + ptN("A", A) + " par rapport à " + ptN("M", Mi) + ". Donne les coordonnées de " + M("B") + "." + TRIP, B, M("M") + " est le milieu de " + M("[AB]") + " : " + M("B = A + 2\\," + vec("AM") + " = 2M - A = " + ptT(B)) + ".",
          { ctx: "symetrique", guide: [GP("Composantes de " + M(vec("AM")) + " ?", sub(Mi, A), M(v3(sub(Mi, A))) + "."), GP(M("B = M + " + vec("AM")) + " ?", B, pt(B) + ".")],
            traps: [TP(mul(0.5, add(A, Mi)), "M est le milieu de [AB] : on cherche B, pas le milieu de [AM]."), TP(sub(Mi, A), "C'est le vecteur AM ; le point B vaut M + AM."), TP(add(Mi, A), "B = 2M − A.")] }); },
      () => { const [a0, b0, c, d] = pk(QUAD), a = a0 * sgn(), b = b0 * sgn(); if (c < 2) return null;
        return QN("Pour quelle valeur de " + M("m > 0") + " le vecteur " + M("\\vec{u} = \\begin{pmatrix} " + fT(a) + " \\\\ " + fT(b) + " \\\\ m \\end{pmatrix}") + " a-t-il pour norme " + M(d) + " ?", c, M(par(a) + "^2 + " + par(b) + "^2 + m^2 = " + d + "^2") + ", donc " + M("m^2 = " + (d * d) + " - " + (a * a + b * b) + " = " + c * c) + " et " + M("m = " + c) + ".",
          { ctx: "norme-inconnue", guide: [G(M("m^2 = " + d + "^2 - " + par(a) + "^2 - " + par(b) + "^2") + " ?", c * c, M(c * c) + "."), G(M("m") + " (positif) ?", c, M(c) + ".")],
            traps: [TR(c * c, "C'est m² : prends la racine carrée."), TR(d - Math.abs(a) - Math.abs(b), "Pythagore : m² = d² − a² − b², pas m = d − a − b."), TR(Math.sqrt(d * d + a * a + b * b), "On soustrait a² et b² de d².")] }); },
      () => { const Gc = rp(4), p = rv(3), q = rv(3); if (isZ(cross(p, q))) return null; const A = add(Gc, p), B = add(Gc, q), C = sub(sub(Gc, p), q);
        return QP("Donne le centre de gravité " + M("G") + " du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + "." + TRIP, Gc, M("G = \\frac{A + B + C}{3}") + " (moyenne des trois sommets) : " + pt(Gc) + ".",
          { ctx: "centre-gravite", guide: [G(M("x_G = \\frac{x_A + x_B + x_C}{3}") + " ?", Gc[0], M("\\frac{" + (A[0] + B[0] + C[0]) + "}{3} = " + Gc[0]) + "."), G(M("y_G") + " ?", Gc[1], M(Gc[1]) + "."), G(M("z_G") + " ?", Gc[2], M(Gc[2]) + "."), GP("Centre de gravité ?", Gc, pt(Gc) + ".")],
            traps: [TP(add(add(A, B), C), "Divise la somme par 3."), TP(mul(0.5, add(A, B)), "C'est le milieu de [AB] ; G est la moyenne des trois sommets.")] }); },
    ],
  };

  // ======================= colin : colinéarité, coplanarité (3.GV.02a, 02b ; MA2) =======================
  const CL = {
    1: [
      () => { const u = rv(5), k = pk([2, 3, -2, -3, 4]), m = k * u[1], v = [k * u[0], "m", k * u[2]];
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + vN("u", u) + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(v[0]) + " \\\\ m \\\\ " + fT(v[2]) + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, M("\\frac{" + fT(v[0]) + "}{" + fT(u[0]) + "} = " + k) + " et " + M("\\frac{" + fT(v[2]) + "}{" + fT(u[2]) + "} = " + k) + " : " + M("\\vec{v} = " + k + "\\vec{u}") + ", donc " + M("m = " + k + " \\cdot " + par(u[1]) + " = " + m) + ".",
          { ctx: "colin-m", guide: [G("Facteur " + M("k") + " tel que " + M("\\vec{v} = k\\vec{u}") + " (avec les premières composantes) ?", k, M(k) + "."), G(M("m = k \\cdot u_y") + " ?", m, M(m) + ".")],
            traps: [TR(u[1] / k, "v = k·u : on multiplie u_y par k, on ne divise pas."), TR(-m, "Attention au signe de k."), TR(u[1], "Les composantes de v valent k fois celles de u.")] }); },
      () => { const k = pk([2, 3, -2, -3, 0.5, -0.5, 1.5]), u = den(k) > 1 ? mul(2, rv(3)) : rv(4), v = mul(k, u);
        return QN("Les vecteurs " + vN("u", u) + " et " + vN("v", v) + " sont colinéaires : " + M("\\vec{v} = k\\,\\vec{u}") + ". Que vaut " + M("k") + " ?", k, M("k = \\frac{" + fT(v[0]) + "}{" + fT(u[0]) + "} = " + fT(k)) + " (même rapport pour les trois composantes).",
          { ctx: "facteur", guide: [G(M("\\frac{v_x}{u_x}") + " ?", k, M(fT(k)) + "."), G("Même rapport avec " + M("z") + " ? Donc " + M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(1 / k, "C'est le facteur de u = k·v ; ici v = k·u : k = v_x ÷ u_x."), TR(-k, "Attention au signe.")] }); },
      () => { const A = rp(4), d = rv(3), t = pk([2, 3, -1, -2]), B = add(A, d), C = add(A, mul(t, d)); if (Math.abs(C[2]) < 2) return null;
        return QN("Les points " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, z)") + " sont alignés. Que vaut " + M("z") + " ?", C[2], M(vec("AB") + " = " + v3(d)) + " ; avec " + M("x") + " : " + M(vec("AC") + " = " + t + "\\," + vec("AB")) + ", donc " + M("z = " + fT(A[2]) + " + " + par(t) + " \\cdot " + par(d[2]) + " = " + fT(C[2])) + ".",
          { ctx: "alignes", guide: [GP(M(vec("AB")) + " ?", d, M(v3(d)) + "."), G("Nombre " + M("t") + " tel que " + M(vec("AC") + " = t\\," + vec("AB")) + " (avec " + M("x") + ") ?", t, M(t) + "."), G(M("z = z_A + t \\cdot (z_B - z_A)") + " ?", C[2], M(fT(C[2])) + ".")],
            traps: [TR(B[2], "C'est la cote de B ; C correspond à t = " + t + "."), TR(t * d[2], "On part de A : z = z_A + t·(z_B − z_A)."), TR(-C[2], "Attention au signe.")] }); },
    ],
    2: [
      () => { const A = rp(4), d = mul(2, rv(2)), t = pk([0.5, 1.5, -0.5, 2.5]), B = add(A, d), C = add(A, mul(t, d));
        return QP("Les points " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, m \\,;\\, n)") + " sont alignés. Donne " + M("m") + " et " + M("n") + ". Réponds « m ; n ».", [C[1], C[2]], M(vec("AC") + " = t\\," + vec("AB")) + " : avec " + M("x") + ", " + M("t = " + fT(t)) + " ; " + M("m = " + fT(A[1]) + " + " + fT(t) + " \\cdot " + par(d[1]) + " = " + fT(C[1])) + ", " + M("n = " + fT(A[2]) + " + " + fT(t) + " \\cdot " + par(d[2]) + " = " + fT(C[2])) + ".",
          { ctx: "alignes-deux", guide: [G(M("t") + " (avec les abscisses) ?", t, M(fT(t)) + "."), G(M("m") + " ?", C[1], M(fT(C[1])) + "."), G(M("n") + " ?", C[2], M(fT(C[2])) + "."), GP("Réponse « m ; n » ?", [C[1], C[2]], M(fT(C[1]) + " \\,;\\, " + fT(C[2])) + ".")],
            traps: [TP([C[2], C[1]], "Dans l'ordre : m (ordonnée) puis n (cote)."), TP([B[1], B[2]], "C n'est pas B : AC = t·AB avec t = " + fS(t) + ".")] }); },
      () => { const u = rv(3), v = rv(3); if (isZ(cross(u, v))) return null; const a = nz(-3, 3), b = nz(-3, 3); if (Math.abs(a) === 1 && Math.abs(b) === 1) return null; const w = add(mul(a, u), mul(b, v)); if (w.some((x) => !x)) return null;
        return QP("Les vecteurs " + vN("u", u) + ", " + vN("v", v) + " et " + vN("w", w) + " sont coplanaires. Trouve " + M("\\alpha") + " et " + M("\\beta") + " tels que " + M("\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}") + ". Réponds « α ; β ».", [a, b], "On résout le système des trois composantes (deux suffisent, la troisième vérifie) : " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + ".",
          { ctx: "decomposition", guide: [G(M("\\alpha") + " ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), GP("Réponse « α ; β » ?", [a, b], M(a + " \\,;\\, " + b) + ".")],
            traps: [TP([b, a], "α multiplie u et β multiplie v : vérifie l'ordre."), TP([-a, -b], "Attention aux signes : vérifie avec une composante.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const a = nz(-2, 2), b = nz(-2, 2), Dp = add(A, add(mul(a, u), mul(b, v))); if (Math.abs(Dp[2]) < 2) return null; const B = add(A, u), C = add(A, v);
        return QN("Les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(" + fT(Dp[0]) + " \\,;\\, " + fT(Dp[1]) + " \\,;\\, z)") + " sont coplanaires. Que vaut " + M("z") + " ?", Dp[2], M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + " ; avec " + M("x") + " et " + M("y") + " : " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + " ; puis " + M("z = " + fT(A[2]) + " + " + par(a) + " \\cdot " + par(u[2]) + " + " + par(b) + " \\cdot " + par(v[2]) + " = " + fT(Dp[2])) + ".",
          { ctx: "coplanaires", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), GP(M(vec("AC")) + " ?", v, M(v3(v)) + "."), G(M("\\alpha") + " (avec les composantes x et y de " + M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + ") ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), G(M("z") + " ?", Dp[2], M(fT(Dp[2])) + ".")],
            traps: [TR(A[2] + b * u[2] + a * v[2], "α multiplie AB et β multiplie AC."), TR(a * u[2] + b * v[2], "On part de A : z = z_A + α·(AB)_z + β·(AC)_z.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, -2, -3]), p = pk([1, 2, -1, -2, 3]), c = nz(-4, 4), m = p * k, q = p * k * k;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u} = \\begin{pmatrix} m \\\\ " + fT(p) + " \\\\ " + fT(c) + " \\end{pmatrix}") + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(q) + " \\\\ m \\\\ " + fT(k * c) + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, "Les troisièmes composantes donnent " + M("\\vec{v} = " + k + "\\vec{u}") + ". Deuxième composante : " + M("m = " + k + " \\cdot " + par(p) + " = " + m) + " ; vérification : " + M(k + " \\cdot " + par(m) + " = " + q) + ".",
          { ctx: "colin-parametre", guide: [G("Facteur " + M("k") + " (avec les troisièmes composantes) ?", k, M(k) + "."), G(M("m = k \\cdot " + par(p)) + " ?", m, M(m) + " (et " + M(k + " \\cdot " + par(m) + " = " + q) + " : ça vérifie).")],
            traps: [TR(-m, "Les deux conditions m² = " + p * q + " donnent ±" + Math.abs(m) + " : seule la valeur compatible avec le facteur " + k + " convient."), TR(q / k, "v = k·u : m = k · " + p + ".")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[1] * v[2] - u[2] * v[1] === 0) return null; const a = nz(-2, 2), b = nz(-2, 2), Dp = add(A, add(mul(a, u), mul(b, v))); if (Math.abs(Dp[0]) < 2) return null; const B = add(A, u), C = add(A, v);
        return QN("Pour quelle valeur de " + M("m") + " les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(m \\,;\\, " + fT(Dp[1]) + " \\,;\\, " + fT(Dp[2]) + ")") + " sont-ils coplanaires ?", Dp[0], M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + " ; les composantes " + M("y") + " et " + M("z") + " donnent " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + " ; puis " + M("m = " + fT(A[0]) + " + " + par(a) + " \\cdot " + par(u[0]) + " + " + par(b) + " \\cdot " + par(v[0]) + " = " + fT(Dp[0])) + ".",
          { ctx: "coplanaires-x", guide: [G(M("\\alpha") + " (système avec les composantes y et z) ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), G(M("m") + " ?", Dp[0], M(fT(Dp[0])) + ".")],
            traps: [TR(A[0] + b * u[0] + a * v[0], "α multiplie AB et β multiplie AC."), TR(a * u[0] + b * v[0], "On part de A : m = x_A + α·(AB)_x + β·(AC)_x.")] }); },
      () => { const A = [R.int(-3, 3), R.int(-3, 3), R.int(1, 4)], u = [nz(-3, 3), nz(-3, 3), nz(1, 3)], t = pk([2, 3, 4]), B = add(A, u), C = add(A, mul(t, u)); if (C[2] < 2) return null;
        return QN("Un rayon laser part de " + ptN("A", A) + " et passe par " + ptN("B", B) + " (en m). À quelle hauteur " + M("z") + " passe-t-il à la verticale du point " + M("(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, 0)") + " ?", C[2], "Le point du rayon s'écrit " + M("A + t\\," + vec("AB")) + " ; avec " + M("x") + " : " + M("t = " + t) + " (même valeur avec " + M("y") + ") ; " + M("z = " + fT(A[2]) + " + " + t + " \\cdot " + par(u[2]) + " = " + fT(C[2])) + " m.",
          { ctx: "laser", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), G(M("t") + " (avec l'abscisse) ?", t, M(t) + "."), G("Hauteur " + M("z") + " ?", C[2], M(fT(C[2])) + " m.")],
            traps: [TR(B[2], "C'est la hauteur en B (t = 1) ; ici t = " + t + "."), TR(t * u[2], "On part de A : z = z_A + t·(AB)_z."), TR(t * B[2], "z = z_A + t·(z_B − z_A).")] }); },
    ],
  };

  // ======================= droite3d : droites de l'espace (3.GV.03a, 03b) =======================
  const DT = {
    1: [
      () => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, -3]), Q = add(A, mul(t, u));
        return QP("La droite " + M("d") + " a pour équations paramétriques " + eqD(A, u) + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + TRIP, Q, "On remplace " + M("t") + " par " + M(t) + " : " + pt(Q) + ".",
          { ctx: "point-t", guide: [G(M("x") + " ?", Q[0], M(fT(A[0]) + " + " + par(u[0]) + " \\cdot " + par(t) + " = " + fT(Q[0])) + "."), G(M("y") + " ?", Q[1], M(fT(Q[1])) + "."), G(M("z") + " ?", Q[2], M(fT(Q[2])) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(mul(t, u), "N'oublie pas le point de départ (le terme sans t)."), TP(add(A, u), "Remplace t par " + t + ".")] }); },
      () => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, 4, -3]), Q = add(A, mul(t, u));
        return QN("Le point " + ptN("P", Q) + " est sur la droite " + eqD(A, u) + ". Pour quelle valeur du paramètre " + M("t") + " ?", t, M(fT(Q[0]) + " = " + cmp(A[0], [u[0]], ["t"])) + " donne " + M("t = " + t) + " ; les deux autres équations donnent la même valeur.",
          { ctx: "parametre", shownOk: true, guide: [G("Avec la première équation : " + M(fT(u[0]) + "t") + " = ?", Q[0] - A[0], M(fT(Q[0]) + " - " + par(A[0]) + " = " + fT(Q[0] - A[0])) + "."), G(M("t") + " ?", t, M(t) + ".")],
            traps: [TR(Q[0] - A[0], "Divise encore par " + u[0] + "."), TR(-t, "Attention au signe."), TR(Q[0], "On résout x_P = x_A + t·u_x.")] }); },
      () => { const A = rp(5), B = rp(5), u = sub(B, A); if (u.some((x) => !x) || !A[2]) return null; const ex = cmpS(A[2], u[2], "t");
        return QX("On paramètre la droite " + M("(AB)") + " par " + M("(x \\,;\\, y \\,;\\, z) = A + t\\," + vec("AB")) + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ". Donne l'expression de " + M("z") + " en fonction de " + M("t") + ".", ex, M(vec("AB") + " = " + v3(u)) + ", donc " + M("z = " + cmp(A[2], [u[2]], ["t"])) + ".",
          { ctx: "equation-AB", guide: [G("Troisième composante de " + M(vec("AB")) + " ?", u[2], M(fT(B[2]) + " - " + par(A[2]) + " = " + fT(u[2])) + "."), GX(M("z") + " en fonction de " + M("t") + " ?", ex, M("z = " + cmp(A[2], [u[2]], ["t"])) + ".")],
            traps: [TX(cmpS(B[2], u[2], "t"), "On part de A (t = 0 donne A), pas de B."), TX(cmpS(A[2], B[2], "t"), "Le coefficient de t est z_B − z_A."), TX(cmpS(A[2], -u[2], "t"), "AB = B − A : attention au signe.")] }); },
    ],
    2: [
      () => { const A = rv(6), u = rv(3), k = R.int(0, 2), name = ["yOz", "xOz", "xOy"][k], vr = ["x", "y", "z"][k], t = r6(-A[k] / u[k]); if (!Number.isInteger(t) || Math.abs(t) < 2) return null; const Q = A.map((x, i) => (i === k ? 0 : r6(x + t * u[i])));
        return QP("Donne le point d'intersection de la droite " + eqD(A, u) + " avec le plan " + M(name) + " (d'équation " + M(vr + " = 0") + ")." + TRIP, Q, M(vr + " = 0") + " donne " + M("t = " + t) + " : " + pt(Q) + ".",
          { ctx: "plan-coord", guide: [G("On pose " + M(vr + " = 0") + " : " + M("t") + " = ?", t, M(t) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(A.map((x, i) => (i === k ? 0 : x)), "Calcule t, puis les deux autres coordonnées."), TP(A.map((x, i) => (i === k ? 0 : r6(x - t * u[i]))), "Attention au signe de t.")] }); },
      () => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, -3]), Q = add(A, mul(t, u)); if (Math.abs(Q[2]) < 2) return null;
        return QN("Le point " + M("P(" + fT(Q[0]) + " \\,;\\, " + fT(Q[1]) + " \\,;\\, m)") + " appartient à la droite " + eqD(A, u) + ". Que vaut " + M("m") + " ?", Q[2], "Avec " + M("x") + " : " + M("t = " + t) + " (même valeur avec " + M("y") + ") ; " + M("m = " + fT(A[2]) + " + " + par(u[2]) + " \\cdot " + par(t) + " = " + fT(Q[2])) + ".",
          { ctx: "coordonnee-manquante", guide: [G(M("t") + " (avec l'équation de x) ?", t, M(t) + "."), G(M("m") + " ?", Q[2], M(fT(Q[2])) + ".")],
            traps: [TR(A[2] + u[2] * Q[0], "Remplace t (et non x) dans l'équation de z."), TR(A[2] + u[2], "Calcule d'abord t avec x."), TR(u[2] * t, "N'oublie pas le terme constant " + A[2] + ".")] }); },
      () => { const A = rp(4), B = rp(4), u = rv(3), t = pk([2, 3, -2]); if (A.every((x, i) => x === B[i])) return null; const Q = add(B, mul(t, u));
        return QP("La droite " + M("d") + " passe par " + ptN("B", B) + " et est parallèle à la droite " + M("d'") + " : " + eqD(A, u) + ". On paramètre " + M("d") + " avec le même vecteur directeur que " + M("d'") + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + TRIP, Q, "Vecteur directeur de " + M("d'") + " : " + M(v3(u)) + ". " + M("d") + " : " + M("B + t\\," + v3(u)) + " ; pour " + M("t = " + t) + " : " + pt(Q) + ".",
          { ctx: "parallele", guide: [GP("Vecteur directeur de " + M("d'") + " ?", u, M(v3(u)) + "."), GP("Point " + M("B + " + t + "\\vec{u}") + " ?", Q, pt(Q) + ".")],
            traps: [TP(add(A, mul(t, u)), "C'est le point de d' ; d passe par B."), TP(add(B, u), "Remplace t par " + t + "."), TP(add(B, mul(t, A)), "Le vecteur directeur est formé des coefficients de t, pas du point de départ.")] }); },
    ],
    3: [
      () => { const Pp = rp(4), u = rv(3), v = rv(3); if (isZ(cross(u, v))) return null; const t0 = pk([1, -1, 2, -2]), s0 = pk([1, 2, -1, -2, 3]), A = sub(Pp, mul(t0, u)), B = sub(Pp, mul(s0, v));
        return QP("Les droites " + M("d_1") + " : " + eqD(A, u) + " et " + M("d_2") + " : " + eqD(B, v, "s") + " sont sécantes. Donne leur point d'intersection." + TRIP, Pp, "On égalise les coordonnées (système en " + M("t") + " et " + M("s") + ") : " + M("t = " + t0) + ", " + M("s = " + s0) + " (la troisième équation vérifie). Point " + pt(Pp) + ".",
          { ctx: "intersection", guide: [G(M("t") + " ?", t0, M(t0) + "."), G(M("s") + " ?", s0, M(s0) + "."), GP("Point (avec " + M("t") + " dans " + M("d_1") + ") ?", Pp, pt(Pp) + ".")],
            traps: [TP(add(A, mul(s0, u)), "Dans d₁, remplace t (pas s)."), TP(add(B, mul(t0, v)), "Dans d₂, remplace s (pas t)."), TP(A, "C'est le point de d₁ pour t = 0.")] }); },
      () => { const z0 = pk([150, 200, 300, 450]), w = pk([120, 150, 200, 250, 300]), t = R.int(4, 15), h = z0 + w * t, vx = pk([3, 4, 5, 6]), vy = pk([2, 3, 4, -3, -2]), x0 = R.int(-5, 5), y0 = R.int(-5, 5);
        return QN("Un avion décolle ; " + M("t") + " minutes après le décollage, sa position est " + eqD([x0, y0, z0], [vx, vy, w]) + " (" + M("x") + " et " + M("y") + " en km, altitude " + M("z") + " en m). Au bout de combien de minutes atteint-il l'altitude de " + M(nb(h) + tu("m")) + " ?", t, M(z0 + " + " + w + "t = " + nb(h)) + ", donc " + M("t = \\frac{" + nb(h - z0) + "}{" + w + "} = " + t) + " min.",
          { ctx: "avion", guide: [G("Altitude à gagner depuis le décollage (en m) ?", h - z0, M(nb(h) + " - " + z0 + " = " + nb(h - z0)) + "."), G(M("t") + " (en min) ?", t, M(t) + ".")],
            traps: [TR(r6(h / w), "L'avion part de l'altitude " + z0 + " m : retire-la d'abord."), TR(h - z0, "Divise encore par " + w + " (mètres par minute).")] }); },
      () => { const A = rp(4), u0 = nz(-3, 3), u1 = nz(-3, 3), m = nz(-4, 4), t0 = pk([2, 3, -2]), Q = add(A, mul(t0, [u0, u1, m])); if (Math.abs(m) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " la droite " + M("d") + " : " + M("\\begin{cases} x = " + cmp(A[0], [u0], ["t"]) + " \\\\ y = " + cmp(A[1], [u1], ["t"]) + " \\\\ z = " + cmp(A[2], [1], ["mt"]) + " \\end{cases}") + " passe-t-elle par " + ptN("P", Q) + " ?", m, "Avec " + M("x") + " : " + M("t = " + t0) + " (même valeur avec " + M("y") + ") ; puis " + M(fT(Q[2]) + " = " + fT(A[2]) + " + " + t0 + "m") + ", donc " + M("m = " + m) + ".",
          { ctx: "parametre-direction", guide: [G(M("t") + " (avec x) ?", t0, M(t0) + "."), G(M("m") + " ?", m, M("\\frac{" + fT(Q[2]) + " - " + par(A[2]) + "}{" + t0 + "} = " + m) + ".")],
            traps: [TR(Q[2] - A[2], "Divise encore par t = " + t0 + "."), TR(r6((Q[2] + A[2]) / t0), "On soustrait " + A[2] + " avant de diviser."), TR(-m, "Attention au signe.")] }); },
    ],
  };

  // ======================= plans : équations d'un plan (3.GV.03c, 03e) =======================
  const PL = {
    1: [
      () => { const A = rp(4), u = rv(2), v = rv(2); if (isZ(cross(u, v))) return null; const s = pk([2, -1, 3, -2]), t = pk([2, 3, -2, -1]); if (s === t) return null; const Q = add(A, add(mul(s, u), mul(t, v)));
        return QP("Le plan " + M("\\pi") + " a pour équations paramétriques " + eqPl(A, u, v) + ". Donne le point de " + M("\\pi") + " obtenu pour " + M("s = " + s) + " et " + M("t = " + t) + "." + TRIP, Q, "On remplace " + M("s") + " et " + M("t") + " : " + pt(Q) + ".",
          { ctx: "point-st", guide: [G(M("x") + " ?", Q[0], M(fT(Q[0])) + "."), G(M("y") + " ?", Q[1], M(fT(Q[1])) + "."), G(M("z") + " ?", Q[2], M(fT(Q[2])) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(add(A, add(mul(t, u), mul(s, v))), "s multiplie le premier vecteur directeur et t le second."), TP(add(mul(s, u), mul(t, v)), "N'oublie pas le point de départ.")] }); },
      () => { const n = rv(4), x0 = R.int(-4, 4), y0 = R.int(-4, 4), m = nz(-5, 5); if (Math.abs(m) < 2) return null; const d = -(n[0] * x0 + n[1] * y0 + n[2] * m), K = n[0] * x0 + n[1] * y0 + d;
        return QN("Le point " + M("P(" + fT(x0) + " \\,;\\, " + fT(y0) + " \\,;\\, m)") + " appartient au plan " + M("\\pi : " + plT(n, d)) + ". Que vaut " + M("m") + " ?", m, "On remplace : " + M(lt([n[0] * x0, n[1] * y0, d], ["", "", ""]) + " + " + co(n[2]) + "m = 0").replace("+ -", "- ") + ", soit " + M(lt([n[2], K], ["m", ""]) + " = 0") + ", donc " + M("m = " + m) + ".",
          { ctx: "point-plan-m", guide: [G("Somme des termes connus " + M(fT(n[0]) + " \\cdot " + par(x0) + " + " + fT(n[1]) + " \\cdot " + par(y0) + " + " + par(d)) + " ?", K, M(K) + "."), G(M("m") + " ?", m, M(lt([n[2]], ["m"]) + " = " + fT(-K)) + ", " + M("m = " + m) + ".")],
            traps: [TR(-m, "Attention au signe : " + n[2] + "m = " + (-K) + "."), TR(-K, "Divise encore par " + n[2] + "."), TR(r6(K / n[2]), "On isole m : " + n[2] + "m = −(" + K + ").")] }); },
      () => { const n = rv(4), k = R.int(0, 2), w = nz(-6, 6); if (Math.abs(w) < 2) return null; const d = -n[k] * w, Q = [0, 0, 0]; Q[k] = w; const ax = ["Ox", "Oy", "Oz"][k];
        return QP("En quel point le plan " + M("\\pi : " + plT(n, d)) + " coupe-t-il l'axe " + M(ax) + " ?" + TRIP, Q, "Sur l'axe " + M(ax) + ", les deux autres coordonnées sont nulles : " + M(lt([n[k], d], [["x", "y", "z"][k], ""]) + " = 0") + ", d'où " + pt(Q) + ".",
          { ctx: "trace-axe", guide: [G("Coordonnée non nulle (" + M(["x", "y", "z"][k]) + ") ?", w, M(fT(w)) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(Q.map((x) => -x), "Attention au signe : " + n[k] + "·" + ["x", "y", "z"][k] + " = " + (-d) + "."), TP([0, 1, 2].map((i) => (i === (k + 1) % 3 ? w : 0)), "Sur l'axe " + ax + ", c'est la coordonnée " + ["x", "y", "z"][k] + " qui n'est pas nulle.")] }); },
    ],
    2: [
      () => { const n = rv(4), A = rp(4), d0 = nz(-6, 6), d = -dot(n, A); if (Math.abs(d) < 2 || d === d0) return null;
        return QN("Le plan " + M("\\pi'") + " passe par " + ptN("A", A) + " et est parallèle au plan " + M("\\pi : " + plT(n, d0)) + ". Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, "Plans parallèles : même vecteur normal " + M(v3(n)) + ". " + M("A \\in \\pi'") + " : " + M("d = -(" + fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + ") = " + d) + ".",
          { ctx: "parallele", guide: [G(M("ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("d") + " ?", d, M(d) + ".")],
            traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(d0, "C'est le d de π ; π' passe par A.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const s0 = nz(-2, 2), t0 = nz(-2, 2), Q = add(A, add(mul(s0, u), mul(t0, v))); if (Math.abs(Q[2]) < 2) return null;
        return QN("Le point " + M("P(" + fT(Q[0]) + " \\,;\\, " + fT(Q[1]) + " \\,;\\, m)") + " appartient au plan " + eqPl(A, u, v) + ". Que vaut " + M("m") + " ?", Q[2], "Les équations de " + M("x") + " et " + M("y") + " donnent " + M("s = " + s0) + " et " + M("t = " + t0) + " ; puis " + M("m = " + fT(Q[2])) + ".",
          { ctx: "param-appartenance", guide: [G(M("s") + " (système avec x et y) ?", s0, M(s0) + "."), G(M("t") + " ?", t0, M(t0) + "."), G(M("m") + " ?", Q[2], M(fT(Q[2])) + ".")],
            traps: [TR(A[2] + t0 * u[2] + s0 * v[2], "s multiplie le premier vecteur directeur, t le second."), TR(s0 * u[2] + t0 * v[2], "N'oublie pas le terme constant " + A[2] + ".")] }); },
      () => { const b = pk([1, -1, 2, -2]), p = nz(-3, 3), q = nz(-5, 5), c = nz(-4, 4), n = [b * p, b, c], d = b * q, ex = ltS([-p, -q], ["x", ""]);
        return QX("La trace du plan " + M("\\pi : " + plT(n, d)) + " dans le plan " + M("xOy") + " (où " + M("z = 0") + ") est une droite. Donne son équation sous la forme " + M("y = mx + h") + " (tape l'expression de " + M("y") + ").", ex, "Avec " + M("z = 0") + " : " + M(plT([n[0], n[1], 0], d)) + ", donc " + M("y = " + lt([-p, -q], ["x", ""])) + ".",
          { ctx: "trace-plan", guide: [GX("Équation avec " + M("z = 0") + " : isole " + M(fT(b) + "y") + ". " + M(fT(b) + "y") + " = ?", ltS([-b * p, -b * q], ["x", ""]), M(fT(b) + "y = " + lt([-b * p, -b * q], ["x", ""])) + "."), GX(M("y") + " = ?", ex, M("y = " + lt([-p, -q], ["x", ""])) + ".")],
            traps: [TX(ltS([p, q], ["x", ""]), "On fait passer les autres termes de l'autre côté : les signes changent."), TX(ltS([-b * p, -b * q], ["x", ""]), "Divise encore par " + b + "."), TX(ltS([-p, -q - c], ["x", ""]), "Dans le plan xOy, z = 0 : le terme en z disparaît.")] }); },
    ],
    3: [
      () => { const b = nz(-3, 3), c = pk([1, -1, 2, -2]), d = nz(-6, 6), n = [1, b, c], pts = [];
        for (let i = 0; i < 40 && pts.length < 3; i++) { const x = R.int(-4, 4), y = R.int(-3, 3), z = r6(-(x + b * y + d) / c); if (Number.isInteger(z) && Math.abs(z) <= 9 && !pts.some((q) => q[0] === x && q[1] === y)) pts.push([x, y, z]); }
        if (pts.length < 3 || isZ(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))) return null; const [A, B, C] = pts;
        return QP("Le plan passant par " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " a une équation de la forme " + M("x + by + cz + d = 0") + ". Trouve " + M("b") + ", " + M("c") + " et " + M("d") + ". Réponds « b ; c ; d ».", [b, c, d], "Chaque point vérifie l'équation : trois équations en " + M("b, c, d") + ". Solution : " + M("\\pi : " + plT(n, d)) + ".",
          { ctx: "trois-points", guide: [G(M("b") + " ?", b, M(b) + "."), G(M("c") + " ?", c, M(c) + "."), G(M("d") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [b, c, d], M(b + " \\,;\\, " + c + " \\,;\\, " + d) + ".")],
            traps: [TP([-b, -c, -d], "Le coefficient de x vaut 1 : vérifie les signes avec le point A."), TP([c, b, d], "b est le coefficient de y, c celui de z.")] }); },
      () => { const u = rv(3), v = rv(3); let n = red(cross(u, v)); if (isZ(n) || !n[0] || n.some((x) => Math.abs(x) > 12)) return null; if (n[0] < 0) n = mul(-1, n); const A = rp(3), d = -dot(n, A);
        return QP("Écris une équation cartésienne du plan " + M("\\pi") + " : " + eqPl(A, u, v) + " sous la forme " + M(lt([n[0]], ["x"]) + " + by + cz + d = 0") + ". Réponds « b ; c ; d ».", [n[1], n[2], d], "Un vecteur normal " + M("\\vec{n}") + " est orthogonal aux deux vecteurs directeurs " + M(v3(u)) + " et " + M(v3(v)) + " : " + M("\\vec{n} = " + v3(n)) + ". Avec " + ptN("A", A) + " : " + M("d = " + d) + ". " + M("\\pi : " + plT(n, d)) + ".",
          { ctx: "param-cartesienne", guide: [G("Vecteur normal " + M("\\begin{pmatrix} " + fT(n[0]) + " \\\\ b \\\\ c \\end{pmatrix}") + " orthogonal aux deux vecteurs directeurs (produits scalaires nuls). " + M("b") + " ?", n[1], M(n[1]) + "."), G(M("c") + " ?", n[2], M(n[2]) + "."), G(M("d = -(a x_A + b y_A + c z_A)") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [n[1], n[2], d], M(n[1] + " \\,;\\, " + n[2] + " \\,;\\, " + d) + ".")],
            traps: [TP([n[1], n[2], -d], "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TP([-n[1], -n[2], d], "Vérifie : n · u = 0 et n · v = 0.")] }); },
      () => { const p = pk([0.5, -0.5, 0.25, -0.25, 0.75]), q = pk([0.5, -0.5, 0.25, 0.75, -0.75]), r = R.int(6, 10), x1 = R.int(1, 4), y1 = R.int(1, 4), zf = (x, y) => r6(p * x + q * y + r), A = [x1, y1, zf(x1, y1)], B = [x1 + 4, y1, zf(x1 + 4, y1)], C = [x1, y1 + 4, zf(x1, y1 + 4)], X = R.int(5, 12), Y = R.int(5, 12), h = zf(X, Y);
        const pD = (u) => M("(" + u.map(nb).join(" \\,;\\, ") + ")");
        return QN("Un toit plat incliné passe par les points " + M("A") + pD(A) + ", " + M("B") + pD(B) + " et " + M("C") + pD(C) + " (coordonnées en m, " + M("z") + " = hauteur). Son équation s'écrit " + M("z = px + qy + r") + ". À quelle hauteur est le toit au-dessus du point " + M("(" + X + " \\,;\\, " + Y + " \\,;\\, 0)") + " ?", h, "De A à B, " + M("x") + " augmente de 4 : " + M("p = \\frac{" + nb(r6(B[2] - A[2])) + "}{4} = " + nb(p)) + " ; de A à C : " + M("q = " + nb(q)) + " ; avec A : " + M("r = " + r) + ". " + M("z = " + nb(p) + " \\cdot " + X + " + " + par(q).replace(/\\frac\{(\d+)\}\{(\d+)\}/, (m, a, b) => nb(r6(a / b))) + " \\cdot " + Y + " + " + r + " = " + nb(h)) + " m.",
          { ctx: "toit", guide: [G(M("p") + " (variation de " + M("z") + " de A à B, divisée par 4) ?", p, M(nb(p)) + "."), G(M("q") + " ?", q, M(nb(q)) + "."), G(M("r") + " ?", r, M(r) + "."), G("Hauteur au-dessus de " + M("(" + X + " \\,;\\, " + Y + ")") + " ?", h, M(nb(h)) + " m.")],
            traps: [TR(r6(p * X + q * Y), "N'oublie pas la constante r = " + r + "."), TR(r6(q * X + p * Y + r), "p multiplie x et q multiplie y."), TR(r6(4 * p * X + 4 * q * Y + r), "p = variation de z ÷ 4 (pour 1 m en x).")] }); },
    ],
  };

  // ======================= posrel : positions relatives, intersections (3.GV.03d) =======================
  const PO = {
    1: [
      () => { const n = rv(4), Pp = rp(4), d = -dot(n, Pp), u = rv(3); if (!dot(n, u)) return null; const t0 = pk([2, -2, 3, -1]), A = sub(Pp, mul(t0, u));
        return QP("Donne le point d'intersection de la droite " + M("d") + " : " + eqD(A, u) + " et du plan " + M("\\pi : " + plT(n, d)) + "." + TRIP, Pp, "On remplace " + M("x, y, z") + " dans l'équation du plan : équation du premier degré en " + M("t") + ", " + M("t = " + t0) + ". Point " + pt(Pp) + ".",
          { ctx: "droite-plan", guide: [G("Équation en " + M("t") + " obtenue en remplaçant dans " + M("\\pi") + ". " + M("t") + " = ?", t0, M(t0) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
            traps: [TP(A, "C'est le point de d pour t = 0 ; calcule t."), TP(sub(A, mul(t0, u)), "Attention au signe de t.")] }); },
      () => { const b = pk([1, -1, 2, -2]), a = nz(-4, 4), c = nz(-4, 4), u0 = nz(-3, 3), u2 = nz(-3, 3), m = r6(-(a * u0 + c * u2) / b); if (!Number.isInteger(m) || Math.abs(m) < 2) return null; const n = [a, b, c], d = nz(-6, 6);
        return QN("Pour quelle valeur de " + M("m") + " une droite de vecteur directeur " + M("\\vec{u} = \\begin{pmatrix} " + fT(u0) + " \\\\ m \\\\ " + fT(u2) + " \\end{pmatrix}") + " est-elle parallèle au plan " + M("\\pi : " + plT(n, d)) + " ?", m, "Parallèle au plan ⟺ " + M("\\vec{u}") + " orthogonal au vecteur normal " + M(v3(n)) + " : " + M(fT(a) + " \\cdot " + par(u0) + sgc(b, "m") + " + " + par(c) + " \\cdot " + par(u2) + " = 0") + ", donc " + M("m = " + m) + ".",
          { ctx: "parallele-m", guide: [G(M("a u_x + c u_z") + " ?", a * u0 + c * u2, M(a * u0 + c * u2) + "."), G(M("m") + " (avec " + M("\\vec{n} \\cdot \\vec{u} = 0") + ") ?", m, M(m) + ".")],
            traps: [TR(-m, "Attention au signe : " + b + "m = " + (-(a * u0 + c * u2)) + "."), TR(a * u0 + c * u2, "Divise par le coefficient de y."), TR(r6(b * u0 / a), "Droite parallèle au plan : u orthogonal à n (pas colinéaire).")] }); },
      () => { const n = rv(4), k = pk([2, 3, -2, -3]), d1 = nz(-6, 6), d2 = nz(-9, 9), m = k * n[1];
        return QN("Pour quelle valeur de " + M("m") + " les plans " + M("\\pi_1 : " + plT(n, d1)) + " et " + M("\\pi_2 : " + lt([k * n[0]], ["x"]) + " + my" + (k * n[2] < 0 ? " - " : " + ") + fT(Math.abs(k * n[2])) + "z" + (d2 < 0 ? " - " : " + ") + fT(Math.abs(d2)) + " = 0") + " sont-ils parallèles ?", m, "Plans parallèles : vecteurs normaux colinéaires. " + M("\\frac{" + fT(k * n[0]) + "}{" + fT(n[0]) + "} = " + k) + ", donc " + M("m = " + k + " \\cdot " + par(n[1]) + " = " + m) + ".",
          { ctx: "plans-paralleles", guide: [G("Facteur entre les vecteurs normaux ?", k, M(k) + "."), G(M("m") + " ?", m, M(m) + ".")],
            traps: [TR(n[1], "Les coefficients sont proportionnels : multiplie par " + k + "."), TR(r6(n[1] / k), "π₂ a les coefficients de π₁ multipliés par " + k + " : on multiplie."), TR(-m, "Attention au signe.")] }); },
    ],
    2: [
      () => { const Pp = rp(4), n1 = rv(3), n2 = rv(3); if (n1[0] * n2[1] - n1[1] * n2[0] === 0 || isZ(cross(n1, n2)) || Pp[0] === Pp[1] || !Pp[2]) return null; const d1 = -dot(n1, Pp), d2 = -dot(n2, Pp);
        return QP("Les plans " + M("\\pi_1 : " + plT(n1, d1)) + " et " + M("\\pi_2 : " + plT(n2, d2)) + " se coupent selon une droite. Donne le point de cette droite dont la cote vaut " + M("z = " + Pp[2]) + "." + TRIP, Pp, "Avec " + M("z = " + Pp[2]) + ", on résout le système en " + M("x") + " et " + M("y") + " : " + M("x = " + Pp[0]) + ", " + M("y = " + Pp[1]) + ". Point " + pt(Pp) + ".",
          { ctx: "deux-plans", guide: [G(M("x") + " ?", Pp[0], M(Pp[0]) + "."), G(M("y") + " ?", Pp[1], M(Pp[1]) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
            traps: [TP([Pp[1], Pp[0], Pp[2]], "Dans l'ordre : x, puis y, puis z.")] }); },
      () => { const n = rv(4), r = rv(2), u = red(cross(n, r)); if (isZ(u) || u.some((x) => Math.abs(x) > 9)) return null; const A = rp(4), d = -dot(n, A); if (Math.abs(d) < 2) return null;
        return QN("La droite " + M("d") + " : " + eqD(A, u) + " est parallèle au plan " + M("\\pi : " + lt(n, ["x", "y", "z"]) + " + k = 0") + " (vérifie-le : " + M("\\vec{n} \\cdot \\vec{u} = 0") + "). Pour quelle valeur de " + M("k") + " la droite est-elle contenue dans le plan ?", d, "Il suffit qu'un point de " + M("d") + " soit dans " + M("\\pi") + " : avec " + ptN("A", A) + ", " + M("k = -(" + fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + ") = " + d) + ".",
          { ctx: "droite-contenue", guide: [GP("Point de " + M("d") + " pour " + M("t = 0") + " ?", A, pt(A) + "."), G(M("ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("k") + " ?", d, M(d) + ".")],
            traps: [TR(-d, "k = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-dot(n, add(A, u)), "Le point de départ est celui obtenu pour t = 0.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const t0 = nz(-2, 2), s0 = nz(-2, 2), Pp = add(A, mul(t0, u)), B = sub(Pp, mul(s0, v)); if (Math.abs(B[2]) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " les droites " + M("d_1") + " : " + eqD(A, u) + " et " + M("d_2") + " : " + M("\\begin{cases} x = " + cmp(B[0], [v[0]], ["s"]) + " \\\\ y = " + cmp(B[1], [v[1]], ["s"]) + " \\\\ z = m" + (v[2] < 0 ? " - " : " + ") + (Math.abs(v[2]) === 1 ? "" : fT(Math.abs(v[2]))) + "s \\end{cases}") + " sont-elles sécantes ?", B[2], "Les équations de " + M("x") + " et " + M("y") + " donnent " + M("t = " + t0) + " et " + M("s = " + s0) + ". Les cotes doivent être égales : " + M(fT(Pp[2]) + " = m " + (v[2] * s0 < 0 ? "- " + fT(-v[2] * s0) : "+ " + fT(v[2] * s0))) + ", donc " + M("m = " + fT(B[2])) + ".",
          { ctx: "secantes-m", guide: [G(M("t") + " (système avec x et y) ?", t0, M(t0) + "."), G(M("s") + " ?", s0, M(s0) + "."), G(M("m") + " ?", B[2], M(fT(B[2])) + ".")],
            traps: [TR(Pp[2], "C'est la cote du point d'intersection ; m = cette cote − (" + v[2] + ")·s."), TR(Pp[2] + v[2] * s0, "On retire " + v[2] + "·s (avec s = " + s0 + ").")] }); },
    ],
    3: [
      () => { const Pp = rp(3), ns = [rv(3), rv(3), rv(3)]; if (Math.abs(det3(...ns)) < 1e-9 || new Set(Pp).size < 3) return null; const ds = ns.map((n) => -dot(n, Pp));
        return QP("Donne le point d'intersection des trois plans " + M("\\pi_1 : " + plT(ns[0], ds[0])) + ", " + M("\\pi_2 : " + plT(ns[1], ds[1])) + " et " + M("\\pi_3 : " + plT(ns[2], ds[2])) + "." + TRIP, Pp, "Système de trois équations à trois inconnues (substitution ou combinaisons) : " + pt(Pp) + ".",
          { ctx: "trois-plans", guide: [G(M("x") + " ?", Pp[0], M(Pp[0]) + "."), G(M("y") + " ?", Pp[1], M(Pp[1]) + "."), G(M("z") + " ?", Pp[2], M(Pp[2]) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
            traps: [TP(mul(-1, Pp), "Vérifie dans π₁ : attention aux signes."), TP([Pp[2], Pp[1], Pp[0]], "Dans l'ordre : x, y, z.")] }); },
      () => { const n = rv(3), Pp = rp(3), d = -dot(n, Pp), u = rv(3); if (!dot(n, u)) return null; const t0 = pk([2, 3, -1, -2]), A = sub(Pp, mul(t0, u)), B = add(A, u);
        return QP("La droite " + M("(AB)") + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ", perce le plan " + M("\\pi : " + plT(n, d)) + " en un point " + M("I") + ". Donne ses coordonnées." + TRIP, Pp, M("(AB) : A + t\\," + vec("AB")) + " avec " + M(vec("AB") + " = " + v3(u)) + " ; dans " + M("\\pi") + " : " + M("t = " + t0) + " ; " + M("I") + pt(Pp) + ".",
          { ctx: "droite-AB-plan", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), G(M("t") + " (on remplace " + M("A + t\\," + vec("AB")) + " dans " + M("\\pi") + ") ?", t0, M(t0) + "."), GP("Point " + M("I") + " ?", Pp, pt(Pp) + ".")],
            traps: [TP(add(B, mul(t0, u)), "Avec A + t·AB, on part de A, pas de B."), TP(sub(A, mul(t0, u)), "Attention au signe de t.")] }); },
      () => { const [h, t] = pk([[6, 2], [6, 3], [8, 2], [12, 2], [12, 3], [9, 3], [10, 2]]), pz = r6(h * (t - 1) / t), S = [R.int(-3, 3), R.int(-3, 3), h], Pz = [S[0] + nz(-4, 4), S[1] + nz(-4, 4), pz], O = add(S, mul(t, sub(Pz, S)));
        return QP("Une lampe ponctuelle est en " + ptN("S", S) + " ; le sommet d'un poteau vertical est en " + ptN("P", Pz) + " (en m). Où se trouve l'ombre de " + M("P") + " sur le sol (plan " + M("z = 0") + ") ?" + TRIP, O, "L'ombre est sur la droite " + M("(SP)") + " : " + M("S + t\\," + vec("SP")) + " avec " + M(vec("SP") + " = " + v3(sub(Pz, S))) + ". " + M("z = 0") + " donne " + M("t = " + t) + " : ombre en " + pt(O) + ".",
          { ctx: "ombre", guide: [GP(M(vec("SP")) + " ?", sub(Pz, S), M(v3(sub(Pz, S))) + "."), G(M("t") + " tel que " + M("z = 0") + " ?", t, M(fT(h) + " " + (pz - h < 0 ? "- " + fT(h - pz) : "+ " + fT(pz - h)) + "t = 0") + ", " + M("t = " + t) + "."), GP("Ombre ?", O, pt(O) + ".")],
            traps: [TP([Pz[0], Pz[1], 0], "L'ombre n'est pas au pied du poteau : prolonge la droite SP jusqu'au sol."), TP([S[0], S[1], 0], "C'est le point du sol sous la lampe."), TP(add(S, mul(2 * t, sub(Pz, S))).map((x, i) => (i === 2 ? 0 : x)), "Calcule t avec la cote : z = 0.")] }); },
    ],
  };

  // ======================= pscal3d : produit scalaire dans l'espace (3.GV.04a–c) =======================
  const PS = {
    1: [
      () => { const u = rv(5), v = rv(5), p = dot(u, v); if (Math.abs(p) < 2) return null;
        return QN("Calcule le produit scalaire " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + vN("u", u) + " et " + vN("v", v) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + u.map((x, i) => par(x) + " \\cdot " + par(v[i])).join(" + ") + " = " + p) + ".",
          { ctx: "calcul", guide: [G("Somme des deux premiers produits " + M("u_x v_x + u_y v_y") + " ?", u[0] * v[0] + u[1] * v[1], M(u[0] * v[0] + u[1] * v[1]) + "."), G("Avec " + M("u_z v_z") + " ?", p, M(p) + ".")],
            traps: [TR(u[0] * v[0] + u[1] * v[1], "Il y a trois produits dans l'espace : n'oublie pas z."), TR(u[0] * v[0] + u[1] * v[1] - u[2] * v[2], "On additionne les trois produits."), TR(u[0] + u[1] + u[2] + v[0] + v[1] + v[2], "On multiplie composante par composante, puis on additionne.")] }); },
      () => { const u = [nz(-4, 4), pk([1, -1, 2, -2]), nz(-4, 4)], v0 = nz(-4, 4), v2 = nz(-4, 4), m = r6(-(u[0] * v0 + u[2] * v2) / u[1]); if (!Number.isInteger(m) || Math.abs(m) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + vN("u", u) + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(v0) + " \\\\ m \\\\ " + fT(v2) + " \\end{pmatrix}") + " sont-ils orthogonaux ?", m, "Orthogonaux ⟺ " + M("\\vec{u} \\cdot \\vec{v} = 0") + " : " + M(par(u[0]) + " \\cdot " + par(v0) + sgc(u[1], "m") + " + " + par(u[2]) + " \\cdot " + par(v2) + " = 0") + ", donc " + M("m = " + m) + ".",
          { ctx: "orthogonal-m", guide: [G(M("u_x v_x + u_z v_z") + " ?", u[0] * v0 + u[2] * v2, M(u[0] * v0 + u[2] * v2) + "."), G(M("m") + " ?", m, M(m) + ".")],
            traps: [TR(-m, "Attention au signe : " + u[1] + "m = " + (-(u[0] * v0 + u[2] * v2)) + "."), TR(u[0] * v0 + u[2] * v2, "Divise par " + u[1] + " (et change de côté).")] }); },
      () => { const u = rv(3), v = rv(3), c = dot(u, v) / (nrm(u) * nrm(v)); if (Math.abs(c) > 0.999 || Math.abs(c) < 1e-9) return null; const a = angle(u, v);
        return QR("Calcule l'angle entre les vecteurs " + vN("u", u) + " et " + vN("v", v) + " (en degrés, arrondi au dixième).", a, 0.1, M("\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|} = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + ".",
          { ctx: "angle", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\cos\\alpha") + " (au millième) ?", c, M(D(c, 0.001)) + ".", 0.001), G(M("\\alpha") + " (au dixième de degré) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - a, "L'angle de deux vecteurs est entre 0° et 180° : garde le signe du produit scalaire."), TR(Math.acos(c), "Donne l'angle en degrés, pas en radians."), TR(DEG * Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nn2(u) * nn2(v))))), "On divise par le produit des normes (avec les racines).")] }); },
    ],
    2: [
      () => { const A = rp(4), B = rp(4), C = rp(4), u = sub(B, A), v = sub(C, A); if (isZ(cross(u, v))) return null; const a = angle(u, v);
        return QR("Calcule l'angle " + M("\\widehat{BAC}") + " du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " (en degrés, au dixième).", a, 0.1, M(vec("AB") + " = " + v3(u)) + ", " + M(vec("AC") + " = " + v3(v)) + " ; " + M("\\cos\\widehat{BAC} = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\widehat{BAC} \\approx " + D(a, 0.1) + "°") + ".",
          { ctx: "angle-triangle", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), GP(M(vec("AC")) + " ?", v, M(v3(v)) + "."), G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", dot(u, v), M(dot(u, v)) + "."), G("Angle (au dixième) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - a, "Les deux vecteurs partent de A : AB et AC (pas BA)."), TR(angle(sub(A, B), sub(C, B)), "C'est l'angle en B ; on demande l'angle en A.")] }); },
      () => { const [u, d] = qv(4), v = rv(5), p = dot(u, v); if (!p || den(Math.abs(p) / d) === 1 && Math.abs(p) / d < 2) return null; const L = Math.abs(p) / d;
        return QN("Calcule la longueur de la projection orthogonale du vecteur " + vN("v", v) + " sur la direction de " + vN("u", u) + " (fractions acceptées).", L, "Longueur " + M("\\frac{|\\vec{u} \\cdot \\vec{v}|}{\\|\\vec{u}\\|} = " + frT(Math.abs(p), d)) + ".",
          { ctx: "projection-longueur", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{u}\\|") + " ?", d, M("\\sqrt{" + d * d + "} = " + d) + "."), G("Longueur de la projection ?", L, M(fT(L)) + ".")],
            traps: [TR(Math.abs(p) / (d * d), "On divise par ‖u‖, pas par ‖u‖² (‖u‖² sert pour le vecteur projeté)."), TR(Math.abs(p), "Divise par la norme de u.")] }); },
      () => { const A = rp(3), p = [nz(-3, 3), nz(-3, 3), pk([1, -1, 2, -2])], c0 = nz(-3, 3), c1 = nz(-3, 3), w2 = r6(-(p[0] * c0 + p[1] * c1) / p[2]); if (!Number.isInteger(w2)) return null; const B = add(A, p), C = [A[0] + c0, A[1] + c1, A[2] + w2]; if (Math.abs(C[2]) < 2) return null;
        /* 25.11 (formule de 335 px sur téléphone) : corrigé avec AC écrit, produits sans « · » devant une parenthèse, m − z_A simplifié. */
        return QN("Pour quelle valeur de " + M("m") + " le triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, m)") + " est-il rectangle en " + M("A") + " ?", C[2], "Rectangle en A ⟺ " + M(vec("AB") + " \\cdot " + vec("AC") + " = 0") + " avec " + M(vec("AC") + " = \\begin{pmatrix} " + fT(c0) + " \\\\ " + fT(c1) + " \\\\ m" + (A[2] ? sg(-A[2]) : "") + " \\end{pmatrix}") + " : " + M(par(p[0]) + (c0 < 0 ? par(c0) : " \\cdot " + fT(c0)) + " + " + par(p[1]) + (c1 < 0 ? par(c1) : " \\cdot " + fT(c1)) + " + " + par(p[2]) + "(m" + (A[2] ? sg(-A[2]) : "") + ") = 0") + ", donc " + M("m = " + fT(C[2])) + ".",
          { ctx: "rectangle-m", guide: [GP(M(vec("AB")) + " ?", p, M(v3(p)) + "."), G("Somme des deux premiers produits de " + M(vec("AB") + " \\cdot " + vec("AC")) + " ?", p[0] * c0 + p[1] * c1, M(p[0] * c0 + p[1] * c1) + "."), G(M("m") + " ?", C[2], M(fT(C[2])) + ".")],
            traps: [TR(w2, "C'est la troisième composante de AC ; m = z_A + (AC)_z."), TR(A[2] - w2, "Attention au signe."), TR(r6(-(p[0] * C[0] + p[1] * C[1]) / p[2]), "Utilise les composantes du vecteur AC, pas les coordonnées de C.")] }); },
    ],
    3: [
      () => { const base = pk([[1, 2, 2], [1, 1, 1], [2, 1, 2], [1, 1, 2], [1, 2, 3]]), u = perm(base).map((x) => x * sgn()), v = rv(4), k = dot(u, v) / nn2(u); if (!k || den(k) > 3) return null; const w = mul(k, u);
        return QP("Donne le projeté orthogonal du vecteur " + vN("v", v) + " sur la droite dirigée par " + vN("u", u) + " (le vecteur projeté)." + TRIP + " (fractions acceptées)", w, "Vecteur projeté " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}\\,\\vec{u} = \\frac{" + dot(u, v) + "}{" + nn2(u) + "}\\,\\vec{u} = " + v3(w)) + ".",
          { ctx: "projection-vecteur", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\|\\vec{u}\\|^2") + " ?", nn2(u), M(nn2(u)) + "."), G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}") + " ?", k, M(fT(k)) + "."), GP("Vecteur projeté ?", w, M(v3(w)) + ".")],
            traps: [TP(mul(dot(u, v), u), "Divise par ‖u‖² = " + nn2(u) + "."), TP(mul(-k, u), "Attention au signe du produit scalaire."), TP(mul(k, v), "Le vecteur projeté est colinéaire à u (on multiplie u, pas v).")] }); },
      () => { const { u, w, n } = orth(2), A = rp(3), t0 = pk([1, -1, 2]), H = add(A, mul(t0, u)), Pp = add(H, w), AP = sub(Pp, A);
        return QP("Donne le projeté orthogonal " + M("H") + " du point " + ptN("P", Pp) + " sur la droite " + M("d") + " : " + eqD(A, u) + "." + TRIP, H, M("H = A + t\\,\\vec{u}") + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2} = \\frac{" + dot(AP, u) + "}{" + n * n + "} = " + t0) + " : " + M("H") + pt(H) + ".",
          { ctx: "pied-droite", guide: [GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M(vec("AP") + " \\cdot \\vec{u}") + " ?", dot(AP, u), M(dot(AP, u)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}") + " ?", t0, M(t0) + "."), GP("Point " + M("H") + " ?", H, pt(H) + ".")],
            traps: [TP(add(A, mul(t0 * n, u)), "Divise par ‖u‖² = " + n * n + " (pas par ‖u‖)."), TP(A, "C'est le point de d pour t = 0."), TP(add(A, mul(dot(AP, u), u)), "t = (AP · u) ÷ ‖u‖².")] }); },
      () => { const L = R.int(2, 9), l = R.int(2, 9), h = R.int(2, 9); if (L === l || l === h || L === h) return null; const kind = pk(["arete", "base", "face"]), g = [L, l, h], o = kind === "arete" ? [L, 0, 0] : kind === "base" ? [L, l, 0] : [0, l, h], a = angle(g, o);
        const nom = kind === "arete" ? "l'arête " + M("[AB]") : kind === "base" ? "la diagonale " + M("[AC]") + " de la base" : "la diagonale " + M("[AH]") + " de la face " + M("ADHE");
        const oT = kind === "arete" ? vec("AB") : kind === "base" ? vec("AC") : vec("AH");
        return QR("Un pavé droit " + M("ABCDEFGH") + " a pour dimensions " + M("AB = " + L) + ", " + M("AD = " + l) + " et " + M("AE = " + h) + ". Dans le repère d'origine " + M("A") + " (axes selon " + M("[AB]") + ", " + M("[AD]") + ", " + M("[AE]") + "), " + M("G") + pt(g) + ". Calcule l'angle entre la diagonale " + M("[AG]") + " et " + nom + " (en degrés, au dixième).", a, 0.1,
          M(vec("AG") + " = " + v3(g)) + ", " + M(oT + " = " + v3(o)) + " ; " + M("\\cos\\alpha = \\frac{" + dot(g, o) + "}{\\sqrt{" + nn2(g) + "} \\cdot \\sqrt{" + nn2(o) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + ".",
          { ctx: "pave-" + kind, guide: [GP("Composantes de " + M(oT) + " ?", o, M(v3(o)) + "."), G(M(vec("AG") + " \\cdot " + oT) + " ?", dot(g, o), M(dot(g, o)) + "."), G("Angle (au dixième) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
            traps: [TR(90 - a, "C'est le complémentaire : vérifie avec cos α = (AG · v) ÷ (‖AG‖ ‖v‖)."), TR(DEG * Math.acos(dot(g, o) / nn2(g)), "Divise par le produit des deux normes.")] }); },
    ],
  };

  // ======================= distances : point-droite, point-plan, aire (3.GV.04d, 04e) =======================
  const DI = {
    1: [
      () => { const [n, nn] = qv(5), Pp = rp(4), m = R.int(2, 3 * nn); if (m % nn === 0 && m / nn < 2) return null; const s = sgn(), d = s * m - dot(n, Pp), L = m / nn;
        return QN("Calcule la distance du point " + ptN("P", Pp) + " au plan " + M("\\pi : " + plT(n, d)) + " (fractions acceptées).", L, M("\\delta = \\frac{|" + fT(n[0]) + " \\cdot " + par(Pp[0]) + " + " + fT(n[1]) + " \\cdot " + par(Pp[1]) + " + " + fT(n[2]) + " \\cdot " + par(Pp[2]) + " + " + par(d) + "|}{\\sqrt{" + nn * nn + "}} = " + frT(m, nn)) + ".",
          { ctx: "point-plan", guide: [G("On remplace " + M("P") + " dans le membre de gauche : " + M("ax_P + by_P + cz_P + d") + " = ?", s * m, M(s * m) + "."), G("Norme du vecteur normal ?", nn, M("\\sqrt{" + nn * nn + "} = " + nn) + "."), G("Distance ?", L, M(fT(L)) + ".")],
            traps: [TR(m, "Divise par la norme du vecteur normal."), TR(m / (nn * nn), "On divise par ‖n‖, pas par ‖n‖²."), TR(-L, "Une distance est positive : valeur absolue.")] }); },
      () => { const [n, nn] = qv(5), d1 = nz(-9, 9), m = R.int(2, 2 * nn), d2 = d1 + m * sgn(), L = m / nn; if (m % nn === 0 && L < 2) return null;
        return QN("Calcule la distance entre les plans parallèles " + M("\\pi_1 : " + plT(n, d1)) + " et " + M("\\pi_2 : " + plT(n, d2)) + " (fractions acceptées).", L, "Même vecteur normal " + M(v3(n)) + " de norme " + M(nn) + " : " + M("\\delta = \\frac{|" + fT(d1) + " - " + par(d2) + "|}{" + nn + "} = " + fT(L)) + ".",
          { ctx: "plans-paralleles", guide: [G(M("|d_1 - d_2|") + " ?", m, M(m) + "."), G(M("\\|\\vec{n}\\|") + " ?", nn, M(nn) + "."), G("Distance ?", L, M(fT(L)) + ".")],
            traps: [TR(Math.abs(d1 + d2) / nn, "On soustrait d₁ − d₂ (même vecteur normal)."), TR(m, "Divise par la norme du vecteur normal.")] }); },
      () => { const { u, w, n } = orth(), k1 = n > 3 ? 1 : pk([1, 2]), k2 = n > 3 ? 1 : pk([1, 2]), A = rp(3), B = add(A, mul(k1, u)), C = add(A, mul(k2, w)), S = (k1 * k2 * n * n) / 2;
        return QN("Le triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " est rectangle en " + M("A") + " (vérifie-le : " + M(vec("AB") + " \\cdot " + vec("AC") + " = 0") + "). Calcule son aire.", S, M("AB = \\sqrt{" + k1 * k1 * n * n + "} = " + k1 * n) + ", " + M("AC = " + k2 * n) + " ; aire " + M("\\frac{" + k1 * n + " \\cdot " + k2 * n + "}{2} = " + fT(S)) + ".",
          { ctx: "aire-rectangle", guide: [G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", 0, M("0") + " : rectangle en A."), G(M("AB") + " ?", k1 * n, M(k1 * n) + "."), G(M("AC") + " ?", k2 * n, M(k2 * n) + "."), G("Aire ?", S, M(fT(S)) + ".")],
            traps: [TR(2 * S, "Aire d'un triangle rectangle : produit des côtés de l'angle droit ÷ 2."), TR((k1 + k2) * n, "L'aire est un produit (÷ 2), pas une somme.")] }); },
    ],
    2: [
      () => { const { u, w, n } = orth(2), k = pk([1, 2]), A = rp(3), t0 = pk([1, -1, 2, -2]), H = add(A, mul(t0, u)), Pp = add(H, mul(k, w)), AP = sub(Pp, A);
        return QN("Calcule la distance du point " + ptN("P", Pp) + " à la droite " + M("d") + " : " + eqD(A, u) + ".", k * n, "Pied de la perpendiculaire : " + M("H = A + t\\,\\vec{u}") + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2} = " + t0) + ", " + M("H") + pt(H) + " ; " + M("PH = \\sqrt{" + k * k * n * n + "} = " + k * n) + ".",
          { ctx: "point-droite", guide: [GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}") + " ?", t0, M(t0) + "."), GP("Pied " + M("H") + " ?", H, pt(H) + "."), G("Distance " + M("PH") + " ?", k * n, M(k * n) + ".")],
            traps: [TR(nrm(AP), "C'est la distance AP ; la distance à la droite se mesure perpendiculairement (pied H)."), TR(k * k * n * n, "N'oublie pas la racine carrée.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (isZ(cross(u, v)) || !dot(u, v)) return null; const S = 0.5 * Math.sqrt(nn2(u) * nn2(v) - dot(u, v) ** 2), B = add(A, u), C = add(A, v);
        return QR("Calcule l'aire du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " (arrondie au centième). Utilise " + M("\\mathcal{A} = \\frac{1}{2}\\sqrt{AB^2 \\cdot AC^2 - (" + vec("AB") + " \\cdot " + vec("AC") + ")^2}") + ".", S, 0.01, M("AB^2 = " + nn2(u)) + ", " + M("AC^2 = " + nn2(v)) + ", " + M(vec("AB") + " \\cdot " + vec("AC") + " = " + dot(u, v)) + " ; " + M("\\mathcal{A} = \\frac{1}{2}\\sqrt{" + nn2(u) * nn2(v) + " - " + dot(u, v) ** 2 + "} \\approx " + D(S, 0.01)) + ".",
          { ctx: "aire-formule", guide: [G(M("AB^2") + " ?", nn2(u), M(nn2(u)) + "."), G(M("AC^2") + " ?", nn2(v), M(nn2(v)) + "."), G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", dot(u, v), M(dot(u, v)) + "."), G("Aire (au centième) ?", S, M(D(S, 0.01)) + ".", 0.01)],
            traps: [TR(0.5 * nrm(u) * nrm(v), "½·AB·AC n'est l'aire que si le triangle est rectangle en A."), TR(2 * S, "N'oublie pas le facteur ½."), TR(0.5 * Math.sqrt(nn2(u) * nn2(v) + dot(u, v) ** 2), "On soustrait le carré du produit scalaire.")] }); },
      () => { const [n, nn] = qv(5), r = rv(2), u = red(cross(n, r)); if (isZ(u) || u.some((x) => Math.abs(x) > 9)) return null; const A = rp(3), m = R.int(2, 3 * nn); if (m % nn === 0 && m / nn < 2) return null; const s = sgn(), d = s * m - dot(n, A), L = m / nn;
        return QN("La droite " + M("d") + " : " + eqD(A, u) + " est parallèle au plan " + M("\\pi : " + plT(n, d)) + ". Calcule la distance entre " + M("d") + " et " + M("\\pi") + " (fractions acceptées).", L, M("\\vec{n} \\cdot \\vec{u} = 0") + " : tous les points de " + M("d") + " sont à la même distance de " + M("\\pi") + ". Avec " + ptN("A", A) + " : " + M("\\delta = " + frT(m, nn)) + ".",
          { ctx: "droite-plan", guide: [G(M("\\vec{n} \\cdot \\vec{u}") + " ?", 0, M("0") + " : la droite est parallèle au plan."), G("On remplace " + M("A") + " (point de " + M("d") + ") dans le membre de gauche de " + M("\\pi") + " : valeur ?", s * m, M(s * m) + "."), G("Distance ?", L, M(fT(L)) + ".")],
            traps: [TR(m, "Divise par la norme du vecteur normal (" + nn + ")."), TR(Math.abs(dot(n, A)) / nn, "Remplace les coordonnées de A dans tout le membre de gauche, d compris.")] }); },
    ],
    3: [
      () => { const [n, nn] = qv(5), T = rp(3), m = R.int(2, 3 * nn), s = sgn(), d = s * m - dot(n, T), S = 3 * R.int(2, 9), h = m / nn, V = (S * h) / 3;
        return QN("La base d'une pyramide est un triangle du plan " + M("\\pi : " + plT(n, d)) + ", d'aire " + M(S) + ". Son sommet est " + ptN("T", T) + ". Calcule le volume de la pyramide (fractions acceptées).", V, "Hauteur = distance de " + M("T") + " à " + M("\\pi") + " : " + M("h = " + frT(m, nn)) + " ; " + M("V = \\frac{1}{3} \\cdot " + S + " \\cdot " + fT(h) + " = " + fT(V)) + ".",
          { ctx: "pyramide", guide: [G("Hauteur " + M("h") + " (distance de " + M("T") + " au plan) ?", h, M(fT(h)) + "."), G("Volume ?", V, M(fT(V)) + ".")],
            traps: [TR(S * h, "Volume d'une pyramide : base × hauteur ÷ 3."), TR((S * h) / 2, "Pyramide : on divise par 3."), TR((S * m) / 3, "La hauteur est m ÷ ‖n‖ = " + m + " ÷ " + nn + ".")] }); },
      () => { const [q0, nn] = qv(4); const iz = q0.findIndex((x) => Math.abs(x) <= 2); if (iz < 0) return null; const n = q0.slice(); [n[iz], n[2]] = [n[2], n[iz]]; const Dd = R.int(1, 3), m1 = R.int(-4, 4), m2 = r6(m1 - (2 * Dd * nn) / n[2]); if (!Number.isInteger(m2)) return null; const K = Dd * nn - n[2] * m1, p0 = R.int(-3, 3), p1 = R.int(-3, 3), d = K - n[0] * p0 - n[1] * p1;
        return QSet("Pour quelles valeurs de " + M("m") + " le point " + M("P(" + fT(p0) + " \\,;\\, " + fT(p1) + " \\,;\\, m)") + " est-il à la distance " + M(Dd) + " du plan " + M("\\pi : " + plT(n, d)) + " ? Sépare les valeurs par « ; ».", [m1, m2], M("\\frac{|" + lt([n[2], K], ["m", ""]) + "|}{" + nn + "} = " + Dd) + ", donc " + M(lt([n[2], K], ["m", ""]) + " = \\pm " + Dd * nn) + " : " + M("m = " + m1) + " ou " + M("m = " + m2) + ".",
          { ctx: "distance-donnee", guide: [G(M("\\|\\vec{n}\\|") + " ?", nn, M(nn) + "."), G("Valeur absolue du numérateur : " + M("|" + lt([n[2], K], ["m", ""]) + "|") + " = ?", Dd * nn, M(Dd + " \\cdot " + nn + " = " + Dd * nn) + "."), GSet("Valeurs de " + M("m") + " ?", [m1, m2], M("m = " + m1) + " ou " + M("m = " + m2) + ".")],
            traps: [TSt([m1], "Valeur absolue : deux cas, + et −."), TSt([r6((Dd - K) / n[2]), r6((-Dd - K) / n[2])], "Multiplie d'abord la distance par ‖n‖ = " + nn + ".")] }); },
      () => { const { u, w, n } = orth(2), s = pk([2, 3]), t0 = R.int(1, s - 1), k = pk([1, 2]), A = [R.int(-3, 3), R.int(-3, 3), R.int(5, 9)], B = add(A, mul(s, u)), Pp = add(add(A, mul(t0, u)), mul(k, w)), AB = sub(B, A), AP = sub(Pp, A), t = t0 / s;
        return QN("Un câble tendu relie " + ptN("A", A) + " et " + ptN("B", B) + " (en m). Un drone est en " + ptN("P", Pp) + ". À quelle distance minimale du câble se trouve-t-il ?", k * n, "Pied " + M("H = A + t\\," + vec("AB")) + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot " + vec("AB") + "}{AB^2} = \\frac{" + dot(AP, AB) + "}{" + nn2(AB) + "} = " + fT(t)) + " (entre A et B) ; " + M("PH = " + k * n) + " m.",
          { ctx: "cable", guide: [GP(M(vec("AB")) + " ?", AB, M(v3(AB)) + "."), GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot " + vec("AB") + "}{AB^2}") + " ?", t, M(fT(t)) + "."), G("Distance " + M("PH") + " ?", k * n, M(k * n) + " m.")],
            traps: [TR(nrm(AP), "C'est la distance PA ; la plus courte se mesure perpendiculairement au câble."), TR(Math.min(nrm(AP), nrm(sub(Pp, B))), "La distance au câble n'est pas la distance à une extrémité."), TR(k * k * n * n, "N'oublie pas la racine carrée.")] }); },
    ],
  };

  // ======================= sphere : vecteur normal, plan médiateur, sphère, plan tangent (3.GV.05a–d) =======================
  const SP = {
    1: [
      () => { const n = rv(4), A = rp(4), d = -dot(n, A); if (Math.abs(d) < 2) return null;
        return QN("Le plan " + M("\\pi") + " passe par " + ptN("A", A) + " et admet " + vN("n", n) + " comme vecteur normal. Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, M("A \\in \\pi") + " : " + M(fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + " + d = 0") + ", donc " + M("d = " + d) + ".",
          { ctx: "plan-normal", guide: [G(M("\\vec{n} \\cdot \\overrightarrow{OA} = ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("d") + " ?", d, M(d) + ".")],
            traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-(A[0] + A[1] + A[2]), "Multiplie chaque coordonnée de A par le coefficient correspondant.")] }); },
      () => { const C = rv(5), r2 = pk([4, 9, 16, 25, 7, 10, 12, 20]);
        return QP("Donne le centre de la sphère " + M(sphT(C, r2)) + "." + TRIP, C, "La sphère de centre " + M("(a \\,;\\, b \\,;\\, c)") + " et de rayon " + M("r") + " a pour équation " + M("(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2") + " : centre " + pt(C) + ".",
          { ctx: "sphere-centre", guide: [G(M("a") + " (dans " + M(sq("x", C[0])) + ") ?", C[0], M(C[0]) + "."), G(M("b") + " ?", C[1], M(C[1]) + "."), G(M("c") + " ?", C[2], M(C[2]) + "."), GP("Centre ?", C, pt(C) + ".")],
            traps: [TP(mul(-1, C), "(x − a)² : le centre a pour abscisse a ; « x + 2 » donne a = −2.")] }); },
      () => { const C = rp(4), [p, d] = qv(), A = add(C, p);
        return QN("Calcule le rayon de la sphère de centre " + ptN("C", C) + " qui passe par " + ptN("A", A) + ".", d, M("r = CA = \\sqrt{" + p.map((x) => par(x) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "rayon-point", guide: [GP(M(vec("CA")) + " ?", p, M(v3(p)) + "."), G(M("CA^2") + " ?", d * d, M(d * d) + "."), G("Rayon ?", d, M(d) + ".")],
            traps: [TR(d * d, "C'est r² : prends la racine."), TR(2 * d, "C'est le diamètre ; le rayon est CA."), TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Distance : √(Δx² + Δy² + Δz²).")] }); },
    ],
    2: [
      () => { const A = rp(5), h = rv(3), B = add(A, mul(2, h)), Mi = add(A, h), d = -dot(h, Mi); if (Math.abs(d) < 2) return null;
        return QN("Le plan médiateur de " + M("[AB]") + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ", a une équation de la forme " + M(lt(h, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, "Plan médiateur : perpendiculaire à " + M("[AB]") + " (vecteur normal " + M(vec("AB") + " = " + v3(mul(2, h))) + ", colinéaire à " + M(v3(h)) + ") et passant par le milieu " + M("M") + pt(Mi) + " : " + M("d = " + d) + ".",
          { ctx: "plan-mediateur", guide: [GP("Milieu " + M("M") + " de " + M("[AB]") + " ?", Mi, pt(Mi) + "."), G(M("d = -(ax_M + by_M + cz_M)") + " ?", d, M(d) + ".")],
            traps: [TR(-dot(h, A), "Le plan médiateur passe par le milieu de [AB], pas par A."), TR(dot(h, Mi), "d = −(a·x_M + b·y_M + c·z_M) : attention au signe."), TR(-dot(h, B), "Il passe par le milieu M, pas par B.")] }); },
      () => { const C = rv(4), r = R.int(2, 7), K = nn2(C) - r * r; if (!K) return null;
        return QN("La sphère " + M("x^2 + y^2 + z^2 " + (lt([-2 * C[0], -2 * C[1], -2 * C[2], K], XYZ).replace(/^-/, "- ").replace(/^(?=\d)/, "+ ")) + " = 0") + " a quel rayon ?", r, "On complète les carrés : " + M(sphT(C, r * r)) + ". Centre " + pt(C) + ", rayon " + M("\\sqrt{" + r * r + "} = " + r) + ".",
          { ctx: "sphere-developpee", guide: [GP("Centre (moitié des coefficients de " + M("x, y, z") + ", signe changé) ?", C, pt(C) + "."), G(M("r^2 = a^2 + b^2 + c^2 - " + par(K)) + " ?", r * r, M(nn2(C) + " - " + par(K) + " = " + r * r) + "."), G("Rayon ?", r, M(r) + ".")],
            traps: [TR(r * r, "C'est r² : prends la racine carrée."), TR(K > 0 ? NaN : Math.sqrt(-K), "Le terme constant ne donne pas r² directement : complète d'abord les carrés.")] }); },
      () => { const C = rp(4), [p] = qv(), T = add(C, p), d = -dot(p, T);
        return QP("Le point " + ptN("T", T) + " est sur la sphère de centre " + ptN("C", C) + ". Le plan tangent à la sphère en " + M("T") + " a une équation de la forme " + M(lt([p[0]], ["x"]) + " + by + cz + d = 0") + ". Réponds « b ; c ; d ».", [p[1], p[2], d], "Le plan tangent en " + M("T") + " est perpendiculaire au rayon : vecteur normal " + M(vec("CT") + " = " + v3(p)) + ". Il passe par " + M("T") + " : " + M("d = " + d) + ". " + M(plT(p, d)) + ".",
          { ctx: "plan-tangent", guide: [GP(M(vec("CT")) + " ?", p, M(v3(p)) + "."), G(M("d = -(ax_T + by_T + cz_T)") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [p[1], p[2], d], M(p[1] + " \\,;\\, " + p[2] + " \\,;\\, " + d) + ".")],
            traps: [TP([p[1], p[2], -dot(p, C)], "Le plan tangent passe par T, pas par le centre C."), TP([p[1], p[2], -d], "d = −(a·x_T + b·y_T + c·z_T) : attention au signe.")] }); },
    ],
    3: [
      () => { const [del, rho, Rr] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15]]), [n, nn] = qv(4), C = rp(3), d = sgn() * del * nn - dot(n, C);
        return QN("La sphère " + M(sphT(C, Rr * Rr)) + " coupe le plan " + M("\\pi : " + plT(n, d)) + " selon un cercle. Calcule le rayon de ce cercle.", rho, "Distance du centre " + pt(C) + " au plan : " + M("\\delta = \\frac{" + del * nn + "}{" + nn + "} = " + del) + " ; Pythagore : " + M("\\rho = \\sqrt{" + Rr + "^2 - " + del + "^2} = " + rho) + ".",
          { ctx: "cercle-section", guide: [G("Distance " + M("\\delta") + " du centre au plan ?", del, M(del) + "."), G("Rayon du cercle " + M("\\sqrt{R^2 - \\delta^2}") + " ?", rho, M(rho) + ".")],
            traps: [TR(Rr - del, "Pythagore : ρ² = R² − δ², pas ρ = R − δ."), TR(rho * rho, "N'oublie pas la racine carrée."), TR(del, "C'est la distance du centre au plan ; le rayon du cercle vaut √(R² − δ²).")] }); },
      () => { const [n, nn] = qv(4), C = rp(3), m = R.int(2, 3 * nn), s = sgn(), d = s * m - dot(n, C), r2 = (m * m) / (nn * nn); if (m % nn === 0 && m / nn < 2) return null;
        return QN("La sphère de centre " + ptN("C", C) + " est tangente au plan " + M("\\pi : " + plT(n, d)) + ". Son équation s'écrit " + M(sq("x", C[0]) + " + " + sq("y", C[1]) + " + " + sq("z", C[2]) + " = r^2") + ". Que vaut " + M("r^2") + " ? (fractions acceptées)", r2, "Sphère tangente : rayon = distance du centre au plan, " + M("r = " + frT(m, nn)) + ", donc " + M("r^2 = " + fT(r2)) + ".",
          { ctx: "sphere-tangente", guide: [G("Rayon " + M("r") + " (distance de " + M("C") + " au plan) ?", m / nn, M(fT(m / nn)) + "."), G(M("r^2") + " ?", r2, M(fT(r2)) + ".")],
            traps: [TR(m / nn, "C'est r ; on demande r²."), TR(m * m / nn, "r = " + m + " ÷ " + nn + " : élève aussi le dénominateur au carré."), TR(m, "Divise par la norme du vecteur normal.")] }); },
      () => { const { u, w } = orth(1), mm = pk([1, 2]), k = pk([1, 2, 3]), C = rp(3), s0 = pk([2, -2, 3, -3, 4]), Mc = add(C, mul(mm, w)), A = sub(Mc, mul(s0, u)), R2 = 9 * (k * k + mm * mm), t1 = s0 - k, t2 = s0 + k; if (!t1 || !t2) return null;
        return QSet("Pour quelles valeurs de " + M("t") + " la droite " + M("d") + " : " + eqD(A, u) + " coupe-t-elle la sphère " + M(sphT(C, R2)) + " ? Sépare les valeurs par « ; ».", [t1, t2], "On remplace " + M("x, y, z") + " dans l'équation de la sphère : " + M("9t^2 " + (-18 * s0 < 0 ? "- " + 18 * s0 : "+ " + -18 * s0) + "t " + (9 * (s0 * s0 - k * k) < 0 ? "- " + -9 * (s0 * s0 - k * k) : "+ " + 9 * (s0 * s0 - k * k)) + " = 0") + ", soit " + M(lt([1, -2 * s0, s0 * s0 - k * k], ["t^2", "t", ""]) + " = 0") + " : " + M("t = " + t1) + " ou " + M("t = " + t2) + ".",
          { ctx: "droite-sphere", guide: [G("Après remplacement, on divise par " + M("\\|\\vec{u}\\|^2 = 9") + " : " + M("t^2 + pt + q = 0") + ". " + M("p") + " ?", -2 * s0, M(-2 * s0) + "."), G(M("q") + " ?", s0 * s0 - k * k, M(s0 * s0 - k * k) + "."), GSet("Valeurs de " + M("t") + " ?", [t1, t2], M("t = " + t1) + " ou " + M("t = " + t2) + ".")],
            traps: [TSt([t2], "La droite coupe la sphère en deux points : deux valeurs de t."), TSt([-t1, -t2], "Attention au signe : vérifie avec t² + pt + q = 0.")] }); },
    ],
  };

  // ---------- problèmes en plusieurs étapes (niveau 4, valeurs tirées) ----------
  const PROBS = {
    vect3d: [() => { const A = rp(4), [p, d] = qv(4), B = add(A, p), Mi = add(A, mul(0.5, p)), E = add(A, mul(3, p));
      return P("On donne A" + ptS(A) + " et B" + ptS(B) + ".", [["a) Longueur AB", d], ["b) Cote (z) du milieu de [AB]", Mi[2]], ["c) Cote du point E tel que AE = 3 · AB (vecteurs)", E[2]]], ["AB = B − A, puis Pythagore dans l'espace.", "E = A + 3·AB."], "a) " + M(vec("AB") + " = " + v3(p)) + ", " + M("AB = \\sqrt{" + d * d + "} = " + d) + " ; b) " + M("z_M = \\frac{" + fT(A[2]) + " + " + par(B[2]) + "}{2} = " + fT(Mi[2])) + " ; c) " + M("z_E = " + fT(A[2]) + " + 3 \\cdot " + par(p[2]) + " = " + fT(E[2])) + "."); }],
    colin: [() => { const A = rp(3), u = mul(2, rv(2)), t = pk([1.5, 2.5, -0.5]), B = add(A, u), C = add(A, mul(t, u));
      return P("Les points A" + ptS(A) + ", B" + ptS(B) + " et C(" + String(C[0]).replace("-", "−") + " ; m ; n) sont alignés.", [["a) Nombre t tel que AC = t · AB (vecteurs)", t], ["b) m", C[1]], ["c) n", C[2]]], ["Avec les abscisses : t = (x_C − x_A) ÷ (x_B − x_A).", "m = y_A + t·(y_B − y_A)."], "a) " + M("t = " + fT(t)) + " ; b) " + M("m = " + fT(C[1])) + " ; c) " + M("n = " + fT(C[2])) + "."); }],
    droite3d: [() => { const A = rv(4), u = rv(3), k = 2; const t = -A[2] / u[2], Z = A.map((x, i) => r6(x + t * u[i])), Q = add(A, mul(k, u));
      return P("La droite d passe par A" + ptS(A) + " et a pour vecteur directeur u" + ptS(u) + " (on écrit A + t·u).", [["a) Cote du point de d pour t = 2", Q[2]], ["b) Valeur de t où d coupe le plan z = 0", t], ["c) Abscisse de ce point d'intersection", Z[0]]], ["Point pour t : A + t·u.", "z = 0 donne t = −z_A ÷ u_z."], "a) " + M(fT(A[2]) + " + 2 \\cdot " + par(u[2]) + " = " + fT(Q[2])) + " ; b) " + M("t = " + fT(t)) + " ; c) " + M("x = " + fT(A[0]) + " + " + par(t) + " \\cdot " + par(u[0]) + " = " + fT(Z[0])) + "."); }],
    plans: [() => { const n = rv(3), A = rp(3), d = -dot(n, A), x0 = R.int(-3, 3), y0 = R.int(-3, 3), m = r6(-(n[0] * x0 + n[1] * y0 + d) / n[2]);
      return P("Le plan π passe par A" + ptS(A) + " et a pour vecteur normal n" + ptS(n) + " ; son équation s'écrit ax + by + cz + d = 0 avec (a ; b ; c) = n.", [["a) d", d], ["b) Abscisse du point où π coupe l'axe Ox", -d / n[0]], ["c) m tel que P(" + String(x0).replace("-", "−") + " ; " + String(y0).replace("-", "−") + " ; m) soit dans π", m]], ["d = −(a·x_A + b·y_A + c·z_A).", "Sur l'axe Ox : y = z = 0."], "a) " + M("d = " + d) + ", " + M("\\pi : " + plT(n, d)) + " ; b) " + M(lt([n[0], d], ["x", ""]) + " = 0") + ", " + M("x = " + fT(-d / n[0])) + " ; c) " + M("m = " + fT(m)) + "."); }],
    posrel: [() => { const n = rv(3), Pp = rp(3), d = -dot(n, Pp), u = rv(2); if (!dot(n, u)) return PROBS.posrel[0](); const t0 = pk([2, -1, 3]), A = sub(Pp, mul(t0, u));
      return P("La droite d passe par A" + ptS(A) + ", de vecteur directeur u" + ptS(u) + " ; le plan π a pour équation " + plS(n, d) + ".", [["a) Valeur de t du point d'intersection (A + t·u)", t0], ["b) Cote (z) du point d'intersection", Pp[2]], ["c) Produit scalaire n · u (n = vecteur normal de π)", dot(n, u)]], ["Remplace x, y, z de A + t·u dans l'équation de π.", "Si n · u ≠ 0, la droite n'est pas parallèle au plan."], "a) " + M("t = " + t0) + " ; b) point " + pt(Pp) + ", " + M("z = " + Pp[2]) + " ; c) " + M("\\vec{n} \\cdot \\vec{u} = " + dot(n, u) + " \\neq 0") + " : la droite coupe le plan."); }],
    pscal3d: [() => { const A = rp(3), u = rv(3), v = rv(3); if (isZ(cross(u, v)) || !dot(u, v)) return PROBS.pscal3d[0](); const B = add(A, u), C = add(A, v), a = angle(u, v);
      return P("Triangle de sommets A" + ptS(A) + ", B" + ptS(B) + " et C" + ptS(C) + ".", [["a) Produit scalaire AB · AC", dot(u, v)], ["b) AB² (carré de la longueur)", nn2(u)], ["c) Angle BAC en degrés (au dixième)", a, 0.1]], ["AB = B − A et AC = C − A.", "cos(BAC) = (AB · AC) ÷ (AB · AC)."], "a) " + M(dot(u, v)) + " ; b) " + M(nn2(u)) + " ; c) " + M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + "."); }],
    distances: [() => { const [n, nn] = qv(4), Pp = rp(3), m = R.int(2, 3 * nn), d = m - dot(n, Pp), Q = rp(3), d2 = -dot(n, Q); if (d2 === d) return PROBS.distances[0]();
      return P("Le plan π a pour équation " + plS(n, d) + " ; on donne P" + ptS(Pp) + " et Q" + ptS(Q) + ".", [["a) Norme du vecteur normal de π", nn], ["b) Distance de P à π", m / nn], ["c) Distance entre π et le plan parallèle à π passant par Q", Math.abs(d - d2) / nn]], ["δ = |ax + by + cz + d| ÷ ‖n‖.", "Le plan parallèle par Q : même n, d' = −n · Q."], "a) " + M(nn) + " ; b) " + M("\\frac{" + m + "}{" + nn + "}") + " ; c) " + M("d' = " + d2) + ", " + M("\\frac{|" + fT(d) + " - " + par(d2) + "|}{" + nn + "} = " + fT(Math.abs(d - d2) / nn)) + "."); }],
    sphere: [() => { const C = rp(3), [p, r] = qv(4), T = add(C, p), dT = -dot(p, T), O = sub(mul(2, C), T);
      return P("La sphère de centre C" + ptS(C) + " passe par T" + ptS(T) + ".", [["a) Rayon de la sphère", r], ["b) d dans l'équation du plan tangent en T : " + ltS(p, ["x", "y", "z"]).replace(/-/g, "−") + " + d = 0", dT], ["c) Cote (z) du point diamétralement opposé à T", O[2]]], ["Rayon = CT.", "Le plan tangent en T a pour vecteur normal CT ; le point opposé vaut 2C − T."], "a) " + M("CT = " + r) + " ; b) " + M("d = " + dT) + " ; c) " + M("2 \\cdot " + par(C[2]) + " - " + par(T[2]) + " = " + fT(O[2])) + "."); }],
  };

  // ---------- catalogue ----------
  const NEW = [
    { id: "vect3d", theme: "es", label: "Vecteurs de l'espace", ex: "\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\\\ z_B - z_A \\end{pmatrix}", CH: [14], codesMATU: "3\\.GV\\.01[a-d]", lv: VE,
      hint: "Composantes de AB : B − A (trois coordonnées). Milieu : moyenne des coordonnées. Norme : √(a² + b² + c²). Chasles : AB + BC = AC.",
      lesson: ["Vecteurs de l'espace", "Comme dans le plan, avec une troisième coordonnée.", "Dans un repère de l'espace, \\(\\overrightarrow{AB}\\) a pour composantes \\(B - A\\). Les opérations se font composante par composante. Le milieu de \\([AB]\\) est la moyenne des coordonnées. La norme de \\(\\vec{u} = (a \\,;\\, b \\,;\\, c)\\) vaut \\(\\sqrt{a^2 + b^2 + c^2}\\) (Pythagore deux fois). Relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\).",
        ["\\(A(1 \\,;\\, 2 \\,;\\, -1)\\), \\(B(3 \\,;\\, 0 \\,;\\, 4)\\) : \\(\\overrightarrow{AB} = (2 \\,;\\, -2 \\,;\\, 5)\\), \\(AB = \\sqrt{33}\\).", "\\(\\|(2 \\,;\\, 3 \\,;\\, 6)\\| = \\sqrt{4 + 9 + 36} = 7\\)."], "Dans \\(ABCD\\) (parallélogramme), \\(\\overrightarrow{AD} = \\overrightarrow{BC}\\) : l'ordre des sommets compte."],
      comps: ["Calculer composantes, milieu et combinaisons de vecteurs", "Calculer une norme ; parallélogramme ; relation de Chasles", "Symétrique, centre de gravité, norme avec une inconnue"] },
    { id: "colin", theme: "es", label: "Colinéarité et coplanarité", ex: "\\vec{v} = k\\,\\vec{u}", CH: [14], codesMATU: "3\\.GV\\.02[ab]", lv: CL,
      hint: "Colinéaires : v = k·u (même rapport pour les trois composantes). Coplanaires : w = α·u + β·v. Points alignés : AC = t·AB.",
      lesson: ["Colinéarité et coplanarité", "Deux vecteurs parallèles, trois vecteurs dans un même plan (niveau avancé MA2).", "\\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires s'il existe \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\) : les trois rapports de composantes sont égaux. Trois points \\(A, B, C\\) sont alignés si \\(\\overrightarrow{AC} = t\\,\\overrightarrow{AB}\\). Trois vecteurs sont coplanaires si l'un est combinaison des deux autres : \\(\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}\\) ; quatre points \\(A, B, C, D\\) sont coplanaires si \\(\\overrightarrow{AD} = \\alpha\\overrightarrow{AB} + \\beta\\overrightarrow{AC}\\).",
        ["\\((2 \\,;\\, -1 \\,;\\, 3)\\) et \\((6 \\,;\\, -3 \\,;\\, 9)\\) : \\(k = 3\\), colinéaires.", "\\(\\vec{w} = 2\\vec{u} - \\vec{v}\\) : on trouve \\(\\alpha\\) et \\(\\beta\\) avec deux composantes, la troisième vérifie."], "Deux équations donnent \\(\\alpha\\) et \\(\\beta\\) ; il faut toujours vérifier la troisième."],
      comps: ["Reconnaître des vecteurs colinéaires (facteur k, alignement)", "Décomposer un vecteur ; points coplanaires", "Colinéarité ou coplanarité avec un paramètre"] },
    { id: "droite3d", theme: "es", label: "Droites de l'espace", ex: "\\begin{cases} x = 1 + 2t \\\\ y = -3t \\\\ z = 4 + t \\end{cases}", CH: [14], codesMATU: "3\\.GV\\.03[ab]", lv: DT,
      hint: "Droite par A, de vecteur directeur u : (x ; y ; z) = A + t·u. Un point est sur la droite si les trois équations donnent la même valeur de t.",
      lesson: ["Droites de l'espace", "Un point de départ et une direction.", "La droite passant par \\(A\\) et de vecteur directeur \\(\\vec{u}\\) a pour équations paramétriques \\(x = x_A + t\\,u_x\\), \\(y = y_A + t\\,u_y\\), \\(z = z_A + t\\,u_z\\). Chaque valeur de \\(t\\) donne un point. Un point appartient à la droite si les trois équations donnent le même \\(t\\). Deux droites de l'espace peuvent être sécantes, parallèles ou gauches (ni l'un ni l'autre).",
        ["\\((AB)\\) avec \\(A(1 \\,;\\, 0 \\,;\\, 2)\\), \\(B(3 \\,;\\, -1 \\,;\\, 5)\\) : \\(x = 1 + 2t\\), \\(y = -t\\), \\(z = 2 + 3t\\).", "Intersection avec le plan \\(z = 0\\) : \\(2 + 3t = 0\\), \\(t = -\\frac{2}{3}\\)."], "Les coefficients de \\(t\\) forment le vecteur directeur ; les termes constants, le point de départ."],
      comps: ["Lire et utiliser des équations paramétriques de droite", "Intersection avec un plan de coordonnées ; droite parallèle", "Intersection de deux droites ; problèmes de trajectoire"] },
    { id: "plans", theme: "es", label: "Équations d'un plan", ex: "ax + by + cz + d = 0", CH: [14], codesMATU: "3\\.GV\\.03[ce]", lv: PL,
      hint: "Paramétriques : A + s·u + t·v. Cartésienne : ax + by + cz + d = 0, où (a ; b ; c) est un vecteur normal. Traces : on annule une ou deux coordonnées.",
      lesson: ["Équations d'un plan", "Deux directions, ou un vecteur normal.", "Le plan passant par \\(A\\) et dirigé par \\(\\vec{u}\\) et \\(\\vec{v}\\) (non colinéaires) a pour équations paramétriques \\(A + s\\,\\vec{u} + t\\,\\vec{v}\\). En éliminant \\(s\\) et \\(t\\), on obtient une équation cartésienne \\(ax + by + cz + d = 0\\) ; le vecteur \\((a \\,;\\, b \\,;\\, c)\\) est orthogonal au plan. Traces : avec \\(z = 0\\), on obtient la droite du plan \\(xOy\\) ; avec deux coordonnées nulles, le point sur un axe.",
        ["\\(2x - y + 3z - 6 = 0\\) coupe l'axe \\(Oz\\) en \\((0 \\,;\\, 0 \\,;\\, 2)\\).", "Plan parallèle passant par \\(A(1 \\,;\\, 1 \\,;\\, 1)\\) : \\(2x - y + 3z - 4 = 0\\)."], "Deux plans parallèles ont des coefficients \\(a, b, c\\) proportionnels ; seul \\(d\\) change."],
      comps: ["Utiliser une équation paramétrique ou cartésienne de plan", "Plan parallèle ; appartenance ; trace dans un plan de coordonnées", "Équation cartésienne par trois points ou depuis les équations paramétriques"] },
    { id: "posrel", theme: "es", label: "Positions relatives, intersections", ex: "d \\cap \\pi", CH: [14], codesMATU: "3\\.GV\\.03d", lv: PO,
      hint: "Droite et plan : remplace x, y, z de la droite dans l'équation du plan (équation en t). Parallèles si n · u = 0. Deux plans : système de deux équations.",
      lesson: ["Positions relatives", "Se couper, être parallèles, être contenu.", "Droite \\(A + t\\vec{u}\\) et plan \\(\\vec{n} \\cdot (x \\,;\\, y \\,;\\, z) + d = 0\\) : si \\(\\vec{n} \\cdot \\vec{u} \\neq 0\\), ils se coupent en un point (une valeur de \\(t\\)) ; si \\(\\vec{n} \\cdot \\vec{u} = 0\\), la droite est parallèle au plan, et contenue dedans si \\(A\\) y est. Deux plans non parallèles se coupent selon une droite ; trois plans se coupent en général en un point (système 3 × 3).",
        ["\\(x = 1 + t\\), \\(y = 2t\\), \\(z = 3 - t\\) et \\(x + y + z - 7 = 0\\) : \\(4 + 2t = 7\\), \\(t = \\frac{3}{2}\\)."], "Parallèle au plan : \\(\\vec{u}\\) orthogonal à \\(\\vec{n}\\) (pas colinéaire)."],
      comps: ["Intersection d'une droite et d'un plan ; parallélisme", "Intersection de deux plans ; droite contenue ; droites sécantes", "Trois plans ; droite qui perce un plan ; ombre portée"] },
    { id: "pscal3d", theme: "es", label: "Produit scalaire dans l'espace", ex: "\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z", CH: [14], codesMATU: "3\\.GV\\.04[a-c]", lv: PS,
      hint: "u · v = uₓvₓ + u_yv_y + u_zv_z = ‖u‖ ‖v‖ cos α. Orthogonaux ⟺ u · v = 0. Projeté de v sur u : (u · v ÷ ‖u‖²)·u.",
      lesson: ["Produit scalaire dans l'espace", "Un nombre qui mesure l'angle entre deux directions.", "\\(\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Donc \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\), et \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\). Projection orthogonale de \\(\\vec{v}\\) sur la direction de \\(\\vec{u}\\) : longueur \\(\\frac{|\\vec{u} \\cdot \\vec{v}|}{\\|\\vec{u}\\|}\\), vecteur \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}\\,\\vec{u}\\).",
        ["\\((1 \\,;\\, 2 \\,;\\, 2) \\cdot (2 \\,;\\, 0 \\,;\\, -1) = 2 + 0 - 2 = 0\\) : orthogonaux.", "\\(\\cos\\alpha = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}\\) : \\(\\alpha = 60°\\)."], "L'angle de deux vecteurs est entre 0° et 180° : un produit scalaire négatif donne un angle obtus."],
      comps: ["Calculer un produit scalaire ; orthogonalité ; angle", "Angle d'un triangle ; projection ; triangle rectangle", "Vecteur projeté ; projeté d'un point sur une droite ; angles dans un pavé"] },
    { id: "distances", theme: "es", label: "Distances et aires dans l'espace", ex: "\\delta(P, \\pi) = \\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}", CH: [14], codesMATU: "3\\.GV\\.04[de]", lv: DI,
      hint: "Point-plan : |ax + by + cz + d| ÷ √(a² + b² + c²). Point-droite : distance au pied H de la perpendiculaire. Aire : ½·√(AB²·AC² − (AB · AC)²).",
      lesson: ["Distances et aires", "La plus courte distance se mesure perpendiculairement.", "Distance de \\(P\\) au plan \\(ax + by + cz + d = 0\\) : \\(\\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}\\). Distance de \\(P\\) à la droite \\(A + t\\vec{u}\\) : on cherche le pied \\(H\\) (\\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}\\)), puis \\(PH\\). Aire du triangle \\(ABC\\) : \\(\\frac{1}{2}\\sqrt{AB^2 \\cdot AC^2 - (\\overrightarrow{AB} \\cdot \\overrightarrow{AC})^2}\\).",
        ["\\(P(1 \\,;\\, 1 \\,;\\, 1)\\) et \\(2x + y + 2z - 2 = 0\\) : \\(\\frac{|2 + 1 + 2 - 2|}{3} = 1\\).", "Plans parallèles \\(\\vec{n} \\cdot X + d_1 = 0\\) et \\(\\vec{n} \\cdot X + d_2 = 0\\) : \\(\\frac{|d_1 - d_2|}{\\|\\vec{n}\\|}\\)."], "N'oublie ni la valeur absolue ni la racine de \\(a^2 + b^2 + c^2\\)."],
      comps: ["Distance point-plan, plans parallèles ; aire d'un triangle rectangle", "Distance point-droite ; aire d'un triangle quelconque", "Volume d'une pyramide ; distance imposée ; problème de distance minimale"] },
    { id: "sphere", theme: "es", label: "Vecteur normal, plan médiateur, sphère", ex: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2", CH: [14], codesMATU: "3\\.GV\\.05[a-d]", lv: SP,
      hint: "Plan de vecteur normal n par A : n · AX = 0. Plan médiateur de [AB] : normal AB, par le milieu. Sphère : (x − a)² + (y − b)² + (z − c)² = r². Plan tangent en T : normal CT, par T.",
      lesson: ["Sphère et plans", "Un vecteur normal suffit pour écrire un plan.", "Le plan passant par \\(A\\) et de vecteur normal \\(\\vec{n} = (a \\,;\\, b \\,;\\, c)\\) a pour équation \\(ax + by + cz + d = 0\\) avec \\(d = -(ax_A + by_A + cz_A)\\). Le plan médiateur de \\([AB]\\) a pour vecteur normal \\(\\overrightarrow{AB}\\) et passe par le milieu de \\([AB]\\). La sphère de centre \\(C\\) et de rayon \\(r\\) : \\((x - a)^2 + (y - b)^2 + (z - c)^2 = r^2\\). Le plan tangent en \\(T\\) a pour vecteur normal \\(\\overrightarrow{CT}\\). Un plan à distance \\(\\delta < r\\) du centre coupe la sphère selon un cercle de rayon \\(\\sqrt{r^2 - \\delta^2}\\).",
        ["\\(x^2 + y^2 + z^2 - 2x + 4z - 4 = 0\\) : \\((x - 1)^2 + y^2 + (z + 2)^2 = 9\\), centre \\((1 \\,;\\, 0 \\,;\\, -2)\\), rayon 3."], "Dans \\((x + 2)^2\\), la coordonnée du centre est \\(-2\\)."],
      comps: ["Plan par un point et un vecteur normal ; centre et rayon d'une sphère", "Plan médiateur ; équation développée ; plan tangent", "Section d'une sphère ; sphère tangente à un plan ; droite et sphère"] },
  ];

  // ---------- enregistrement (additif : aucune notion existante n'est modifiée) ----------
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
  }
})();

// 3e et 4e Collège (24.11) : sujets de préparation riches des chapitres de 3e (dérivation) et de 4e (intégration,
// logarithme et exponentielle, algèbre linéaire, probabilités). Problèmes à plusieurs étapes modelés sur les épreuves
// de maturité gymnasiale (Collège de Genève, niveau normal MA1) : modéliser, dériver, optimiser, interpréter.
// Calculatrice autorisée, valeurs exactes quand elles sont simples. Outils communs : RX (riche_mp2.js).
// Banques réservées au Collège (track: "col"). Paquet de chargement « 14 » (build.py).
(function () {
  const { N, A, pk, FR, lin, sg, par, X, ul, who, VF } = RX;
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"); /* forme tapée d'une fraction */
  // Polynôme (coefficients du plus haut degré au terme constant).
  const poly = (c, x = "x") => { const n = c.length - 1; let s = ""; c.forEach((a, i) => { const e = n - i; if (Math.abs(a) < 1e-12) return; const mono = e === 0 ? FR(Math.abs(a)) : (Math.abs(Math.abs(a) - 1) < 1e-12 ? "" : FR(Math.abs(a))) + x + (e > 1 ? "^{" + e + "}" : ""); s += s ? (a < 0 ? " - " : " + ") + mono : (a < 0 ? "-" : "") + mono; }); return s || "0"; };
  const pv = (c, x) => c.reduce((s, a) => s * x + a, 0);
  const fac = (r, x = "x") => "(" + x + (r < 0 ? " + " + FR(-r) : " - " + FR(r)) + ")";
  const pt = (x, y) => "(" + FR(x) + " \\,;\\, " + FR(y) + ")";
  const mX = (m) => "\\begin{pmatrix} " + FR(m[0][0]) + " & " + FR(m[0][1]) + " \\\\ " + FR(m[1][0]) + " & " + FR(m[1][1]) + " \\end{pmatrix}";
  const mul = (P, Q) => [[P[0][0] * Q[0][0] + P[0][1] * Q[1][0], P[0][0] * Q[0][1] + P[0][1] * Q[1][1]], [P[1][0] * Q[0][0] + P[1][1] * Q[1][0], P[1][0] * Q[0][1] + P[1][1] * Q[1][1]]];
  const det = (P) => P[0][0] * P[1][1] - P[0][1] * P[1][0];
  const col = (a, b) => "\\begin{pmatrix} " + FR(a) + " \\\\ " + FR(b) + " \\end{pmatrix}";
  const nzm = (a, b) => [[R.nz(a, b), R.nz(a, b)], [R.nz(a, b), R.nz(a, b)]];
  const E = Math.E;
  const yT = (b) => (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "y"; /* « + 3y », « - y » */

  // ===================== 3e · Dérivation =====================
  const EXD = [
    // Tangentes à une parabole
    () => { let a, b, c, x0, xk, m, y0, k;
      do { a = pk([2, 3]); b = R.nz(-8, 8); c = R.nz(-6, 6); x0 = pk([1, 2, 3]); xk = x0 + pk([-3, -2, 2]); m = 2 * a * x0 + b; y0 = a * x0 * x0 + b * x0 + c; k = 2 * a * xk + b; }
      while (Math.abs(m) <= 1 || y0 === 0 || c === a * x0 * x0 || xk === 0 || Math.abs(k) <= 1 || k === m);
      const p = c - a * x0 * x0, xh = -b / (2 * a), yh = c - (b * b) / (4 * a), h = pk([-3, 2, 5]);
      return X({ id: "tangente", lv: 1, titre: "Tangentes à une parabole",
        q: "Soit " + M("f(x) = " + poly([a, b, c])) + ".",
        parts: [{ label: "Calcule " + M("f'(x)") + ".", pts: 1 }, { label: "Donne l'équation de la tangente au point d'abscisse " + M(x0) + ".", pts: 2 }, { label: "En quel point la tangente est-elle horizontale ?", pts: 1 }, { label: "En quel point la tangente est-elle parallèle à la droite " + M("d : y = " + lin(k, h)) + " ?", pts: 1 }],
        sol: ul([M("f'(x) = " + lin(2 * a, b)) + ".", M("f(" + x0 + ") = " + y0) + " et " + M("f'(" + x0 + ") = " + m) + ", donc " + M("y = " + FR(m) + "(x - " + x0 + ")" + sg(y0)) + ", soit " + M("y = " + lin(m, p)) + ".", M("f'(x) = 0") + " pour " + M("x = " + FR(xh)) + " : point " + M(pt(xh, yh)) + " (le sommet).", "Même pente " + M(k) + " : " + M(lin(2 * a, b) + " = " + k) + " donne " + M("x = " + xk) + ", point " + M(pt(xk, a * xk * xk + b * xk + c)) + "."]),
        chk: [[m, N(m)], [p, N(p)], [xh, FRp(xh)], [xk, N(xk)]] }); },
    // Étude d'une fonction de degré 3
    () => { let al, be, r, P, Q, fA, fB;
      do { [al, be] = pk([[-1, 3], [-3, 1], [1, 5], [-5, -1], [-2, 4], [-4, 2], [2, 4], [-4, -2]]); r = R.nz(-8, 8); P = (-3 * (al + be)) / 2; Q = 3 * al * be; fA = pv([1, P, Q, r], al); fB = pv([1, P, Q, r], be); } while (fA === 0 || fB === 0);
      const cnt = fB > 0 || fA < 0 ? 1 : 3;
      return X({ id: "variations", lv: 2, titre: "Étude d'une fonction de degré 3",
        q: "Soit " + M("f(x) = " + poly([1, P, Q, r])) + ".",
        parts: [{ label: "Calcule " + M("f'(x)") + " et factorise-la.", pts: 1 }, { label: "Dresse le tableau de signes de " + M("f'") + " et le tableau de variations de " + M("f") + ".", pts: 2 }, { label: "Donne les extrema locaux de " + M("f") + " (abscisse et valeur).", pts: 1 }, { label: "Combien de solutions l'équation " + M("f(x) = 0") + " a-t-elle ? Justifie avec le tableau.", pts: 1 }],
        sol: ul([M("f'(x) = " + poly([3, 2 * P, Q]) + " = 3" + fac(al) + fac(be)) + ".", M("f'") + " est positive à l'extérieur des racines, négative entre elles : " + M("f") + " croît sur " + M("]-\\infty \\,;\\, " + al + "]") + ", décroît sur " + M("[" + al + " \\,;\\, " + be + "]") + ", croît sur " + M("[" + be + " \\,;\\, +\\infty[") + ".", "Maximum local " + M("f(" + al + ") = " + fA) + ", minimum local " + M("f(" + be + ") = " + fB) + ".", cnt === 3 ? "Le maximum local est positif et le minimum local négatif : la courbe traverse l'axe sur chacun des trois intervalles, donc 3 solutions." : (fB > 0 ? "Le minimum local est positif : la courbe ne coupe l'axe qu'avant " + M(al) : "Le maximum local est négatif : la courbe ne coupe l'axe qu'après " + M(be)) + ", donc 1 solution."]),
        chk: [[fA, N(fA)], [fB, N(fB)], [cnt, String(cnt)]] }); },
    // La boîte en carton
    () => { const [L, l, xs] = pk([[16, 10, 2], [24, 9, 2], [21, 16, 3], [45, 24, 5], [40, 25, 5]]), x2 = (L * l) / (12 * xs), Vm = xs * (L - 2 * xs) * (l - 2 * xs), V1 = (L - 2) * (l - 2);
      return X({ id: "optimderiv", lv: 2, titre: "La boîte en carton",
        q: "Dans une plaque de carton de " + M(L + "\\ \\text{cm} \\times " + l + "\\ \\text{cm}") + ", on découpe un carré de côté " + M("x") + " cm à chaque coin, puis on plie les bords pour obtenir une boîte sans couvercle.",
        parts: [{ label: "Exprime le volume " + M("V(x)") + " de la boîte ; pour quelles valeurs de " + M("x") + " a-t-il un sens ? Calcule " + M("V(1)") + ".", pts: 1 }, { label: "Calcule " + M("V'(x)") + ".", pts: 1 }, { label: "Pour quelle valeur de " + M("x") + " le volume est-il maximal ? Justifie.", pts: 2 }, { label: "Quel est ce volume maximal ?", pts: 1 }],
        sol: ul([M("V(x) = x(" + L + " - 2x)(" + l + " - 2x)") + " pour " + M("0 \\lt x \\lt " + FR(l / 2)) + " ; " + M("V(1) = " + N(V1)) + " cm³.", "En développant, " + M("V(x) = " + poly([4, -2 * (L + l), L * l, 0])) + ", donc " + M("V'(x) = " + poly([12, -4 * (L + l), L * l])) + ".", M("V'(x) = 0") + " pour " + M("x = " + xs) + " ou " + M("x = " + FR(x2)) + " ; la seconde est hors du domaine. " + M("V'") + " passe de + à − en " + M(xs) + " : maximum.", M("V(" + xs + ") = " + xs + " \\cdot " + (L - 2 * xs) + " \\cdot " + (l - 2 * xs) + " = " + N(Vm)) + " cm³."]),
        chk: [[V1, N(V1)], [xs, N(xs)], [x2, FRp(x2)], [Vm, N(Vm)]] }); },
    // Le coût moyen
    () => { const a = pk([2, 3, 5]), n = pk([10, 20, 30]), b = pk([40, 60, 80]), c = a * n * n, m = 2 * a * n + b;
      return X({ id: "derivprodquot", lv: 3, titre: "Le coût moyen",
        q: "Une entreprise fabrique " + M("q") + " objets par jour ; le coût total (en CHF) est " + M("C(q) = " + a + "q^2 + " + b + "q + " + N(c)) + ". Le coût moyen par objet est " + M("CM(q) = \\frac{C(q)}{q}") + " et le coût marginal est " + M("C'(q)") + ".",
        parts: [{ label: "Calcule le coût moyen pour " + M(n / 2) + " objets.", pts: 1 }, { label: "Calcule " + M("CM'(q)") + " avec la règle du quotient.", pts: 1 }, { label: "Quelle production minimise le coût moyen ? Quel est ce coût moyen minimal ?", pts: 2 }, { label: "Calcule le coût marginal pour cette production. Que constates-tu ?", pts: 1 }],
        sol: ul([M("CM(" + n / 2 + ") = \\frac{C(" + n / 2 + ")}{" + n / 2 + "} = " + N((a * n * n) / 4 + (b * n) / 2 + c) + " \\div " + n / 2 + " = " + N((a * n) / 2 + b + (2 * c) / n)) + " CHF.", M("CM'(q) = \\frac{C'(q) \\cdot q - C(q)}{q^2} = \\frac{(" + 2 * a + "q + " + b + ")q - (" + a + "q^2 + " + b + "q + " + N(c) + ")}{q^2} = \\frac{" + a + "q^2 - " + N(c) + "}{q^2}") + ".", M("CM'(q) = 0") + " pour " + M("q^2 = " + n * n) + ", " + M("q = " + n) + " (q > 0) ; " + M("CM'") + " passe de − à + : minimum " + M("CM(" + n + ") = " + a * n + " + " + b + " + " + a * n + " = " + m) + " CHF.", M("C'(q) = " + 2 * a + "q + " + b) + ", " + M("C'(" + n + ") = " + m) + " : au minimum du coût moyen, coût moyen et coût marginal sont égaux."]),
        chk: [[(a * n) / 2 + b + (2 * c) / n, N((a * n) / 2 + b + (2 * c) / n)], [n, N(n)], [m, N(m)]] }); },
    // Le point le plus proche
    () => { const p = pk([2.5, 6.5, 12.5]), xs = p - 0.5, d = Math.sqrt(p - 0.25);
      return X({ id: "derivcomp", lv: 3, titre: "Le point le plus proche",
        q: "On cherche le point " + M("M(x \\,;\\, \\sqrt{x})") + " de la courbe " + M("y = \\sqrt{x}") + " le plus proche du point " + M("P(" + N(p) + " \\,;\\, 0)") + ".",
        parts: [{ label: "Exprime la distance " + M("d(x) = PM") + " en fonction de " + M("x") + ".", pts: 1 }, { label: "Calcule " + M("d'(x)") + " (dérivée d'une composée).", pts: 2 }, { label: "Pour quelle valeur de " + M("x") + " la distance est-elle minimale ? Quelle est cette distance ?", pts: 1 }, { label: "Vérifie que " + M("(PM)") + " est alors perpendiculaire à la tangente à la courbe en " + M("M") + ".", pts: 1 }],
        sol: ul([M("d(x) = \\sqrt{(x - " + N(p) + ")^2 + x} = \\sqrt{" + poly([1, -(2 * p - 1), p * p]) + "}") + ".", M("d'(x) = \\frac{2x - " + N(2 * p - 1) + "}{2\\sqrt{" + poly([1, -(2 * p - 1), p * p]) + "}}") + " : on dérive la racine, puis on multiplie par la dérivée de l'intérieur.", M("d'(x) = 0") + " pour " + M("x = " + N(xs)) + " (le signe passe de − à +) ; " + M("d = \\sqrt{" + N(xs * xs - 2 * p * xs + p * p + xs) + "} = " + N(d)) + ".", "Pente de la tangente : " + M("\\frac{1}{2\\sqrt{" + N(xs) + "}}") + " ; pente de " + M("(PM)") + " : " + M("\\frac{\\sqrt{" + N(xs) + "}}{" + N(xs) + " - " + N(p) + "} = -2\\sqrt{" + N(xs) + "}") + ". Produit : " + M("-1") + ", donc perpendiculaires."]),
        chk: [[xs, N(xs)], [d, N(d)]] }); },
    // La balle lancée
    () => { const v0 = pk([15, 20, 25]), [t1, t2] = pk([[0.5, 1], [1, 1.5], [0.5, 2]]), h = (t) => 1.5 + v0 * t - 5 * t * t, av = v0 - 5 * (t1 + t2), vi = v0 - 10 * t1, T = v0 / 10, hm = h(T);
      return X({ id: "nbderive", lv: 1, titre: "La balle lancée",
        q: "Une balle est lancée vers le haut ; sa hauteur (en m) après " + M("t") + " secondes est " + M("h(t) = 1{,}5 + " + v0 + "t - 5t^2") + ".",
        parts: [{ label: "Calcule sa vitesse moyenne entre " + M("t = " + N(t1)) + " s et " + M("t = " + N(t2)) + " s.", pts: 1 }, { label: "Calcule sa vitesse instantanée à " + M("t = " + N(t1)) + " s avec la définition du nombre dérivé.", pts: 2 }, { label: "À quel instant la balle est-elle au plus haut ? À quelle hauteur ?", pts: 2 }],
        sol: ul([M("\\frac{h(" + N(t2) + ") - h(" + N(t1) + ")}{" + N(t2) + " - " + N(t1) + "} = \\frac{" + N(h(t2)) + " - " + N(h(t1)) + "}{" + N(t2 - t1) + "} = " + N(av)) + " m/s.", M("\\frac{h(" + N(t1) + " + k) - h(" + N(t1) + ")}{k} = " + N(vi) + " - 5k") + " (après simplification par " + M("k") + "), qui tend vers " + M(N(vi)) + " m/s quand " + M("k \\to 0") + ".", M("h'(t) = " + v0 + " - 10t = 0") + " pour " + M("t = " + N(T)) + " s ; " + M("h(" + N(T) + ") = " + N(hm)) + " m."]),
        chk: [[av, N(av)], [vi, N(vi)], [T, N(T)], [hm, N(hm)]] }); },
  ];
  const RAISOND = [
    () => { const k = pk([2, 3, 4, 5]), w = who();
      return X({ id: "derivprodquot", lv: 1, titre: "Trouve l'erreur",
        q: "Pour " + M("f(x) = x^2(x - " + k + ")") + ", " + w + " écrit : « " + M("f'(x) = 2x \\cdot 1 = 2x") + " ».",
        parts: [{ label: "Développe " + M("f(x)") + ", dérive, et compare.", pts: 1 }, { label: "Refais le calcul avec la règle du produit ; calcule " + M("f'(1)") + ".", pts: 1 }],
        sol: ul([M("f(x) = x^3 - " + k + "x^2") + ", donc " + M("f'(x) = 3x^2 - " + 2 * k + "x") + " : " + w + " a multiplié les dérivées, ce qui est faux.", M("(uv)' = u'v + uv' = 2x(x - " + k + ") + x^2 \\cdot 1 = 3x^2 - " + 2 * k + "x") + " ; " + M("f'(1) = " + (3 - 2 * k)) + "."]),
        chk: [[3 - 2 * k, N(3 - 2 * k)]] }); },
    () => { const a = pk([1, 2, 3]), c = pk([-3, 3, 5]), w = who(), p = c - a * a;
      return X({ id: "tangente", lv: 2, titre: "Trouve l'erreur",
        q: "Tangente à " + M("f(x) = x^2" + sg(c)) + " au point d'abscisse " + M(a) + ". " + w + " écrit : « " + M("f'(" + a + ") = " + 2 * a) + " et " + M("f(" + a + ") = " + (a * a + c)) + ", donc la tangente est " + M("y = " + lin(2 * a, a * a + c)) + " ».",
        parts: [{ label: "Cette droite passe-t-elle par le point de contact ? Où est l'erreur ?", pts: 1 }, { label: "Donne la bonne équation.", pts: 1 }],
        sol: ul(["En " + M("x = " + a) + ", la droite donne " + M(2 * a * a + a * a + c) + ", pas " + M(a * a + c) + " : " + w + " a oublié le " + M("(x - " + a + ")") + " de la formule.", M("y = " + 2 * a + "(x - " + a + ")" + sg(a * a + c) + " = " + lin(2 * a, p)) + "."]),
        chk: [[p, N(p)]] }); },
    () => VF("variations", 2, [["« Si " + M("f'(a) = 0") + ", alors " + M("f") + " a un extremum en " + M("a") + ". »", false, "Contre-exemple : " + M("f(x) = x^3") + " en 0, " + M("f'") + " ne change pas de signe."],
      ["« Si " + M("f'(x) > 0") + " sur un intervalle, " + M("f") + " y est croissante. »", true, "C'est le lien entre le signe de la dérivée et les variations."],
      ["« La dérivée de " + M("(2x + 1)^3") + " est " + M("3(2x + 1)^2") + ". »", false, "Il manque le facteur 2 (dérivée de l'intérieur) : " + M("6(2x + 1)^2") + "."],
      ["« " + M("\\left(\\frac{1}{x}\\right)' = \\frac{1}{x^2}") + ". »", false, M("\\left(x^{-1}\\right)' = -x^{-2} = -\\frac{1}{x^2}") + "."],
      ["« Le taux de variation moyen de " + M("f") + " entre " + M("a") + " et " + M("b") + " est la pente de la sécante. »", true, "C'est " + M("\\frac{f(b) - f(a)}{b - a}") + ", la pente de la droite qui relie les deux points."],
      ["« La tangente au point d'abscisse " + M("a") + " a pour équation " + M("y = f'(a)(x - a) + f(a)") + ". »", true, "Pente " + M("f'(a)") + ", elle passe par " + M("(a \\,;\\, f(a))") + "."],
      ["« La dérivée d'un produit est le produit des dérivées. »", false, M("(uv)' = u'v + uv'") + " ; contre-exemple : " + M("(x \\cdot x)' = 2x \\neq 1") + "."]]),
  ];

  // ===================== 4e · Intégration =====================
  const EXI = [
    // La distance de freinage
    () => { const [v0, a] = pk([[20, 4], [24, 6], [30, 5], [25, 5], [28, 4]]), T = v0 / a, dist = (v0 * v0) / (2 * a), d1 = v0 - a / 2;
      return X({ id: "primitives", lv: 1, titre: "La distance de freinage",
        q: "Une voiture roule à " + M(v0 + "\\ \\text{m/s}") + " ; elle freine, et sa vitesse vaut alors " + M("v(t) = " + v0 + " - " + a + "t") + " (en m/s, " + M("t") + " en secondes depuis le début du freinage).",
        parts: [{ label: "Trouve la distance " + M("d(t)") + " parcourue depuis le début du freinage (" + M("d(0) = 0") + ").", pts: 1 }, { label: "Quelle distance parcourt-elle pendant la première seconde ?", pts: 1 }, { label: "Au bout de combien de temps s'arrête-t-elle ? Quelle est sa distance de freinage ?", pts: 2 }, { label: "À quelle vitesse roulait-elle, en km/h ?", pts: 1 }],
        sol: ul([M("d") + " est la primitive de " + M("v") + " qui s'annule en 0 : " + M("d(t) = " + v0 + "t - " + FR(a / 2) + "t^2") + ".", M("d(1) = " + v0 + " - " + FR(a / 2) + " = " + N(d1)) + " m.", M("v(t) = 0") + " pour " + M("t = " + N(T)) + " s ; " + M("d(" + N(T) + ") = " + N(dist)) + " m.", M(v0 + " \\cdot 3{,}6 = " + N(v0 * 3.6)) + " km/h."]),
        chk: [[d1, N(d1)], [T, N(T)], [dist, N(dist)], [v0 * 3.6, N(v0 * 3.6)]] }); },
    // Aire entre une parabole et une droite
    () => { let r1, w, r2, m, p, B, C;
      do { r1 = pk([-3, -2, -1, 1, 2]); w = pk([2, 3, 4, 6]); r2 = r1 + w; m = pk([-2, -1, 1, 2, 3]); p = R.nz(-4, 4); B = r1 + r2 + m; C = p - r1 * r2; } while (r2 === 0 || r2 === 1 || B === 0 || C === 0);
      const ar = w ** 3 / 6, mid = (w * w) / 4;
      return X({ id: "aireint", lv: 2, titre: "Entre une parabole et une droite",
        q: "On donne " + M("f(x) = " + poly([-1, B, C])) + " et " + M("g(x) = " + lin(m, p)) + ".",
        parts: [{ label: "Calcule les abscisses des points d'intersection des deux courbes.", pts: 2 }, { label: "Entre ces abscisses, quelle courbe est au-dessus ? Justifie.", pts: 1 }, { label: "Calcule l'aire du domaine compris entre les deux courbes.", pts: 2 }],
        sol: ul([M("f(x) - g(x) = " + poly([-1, r1 + r2, -r1 * r2]) + " = -" + fac(r1) + fac(r2)) + " : intersections en " + M("x = " + r1) + " et " + M("x = " + r2) + ".", "Au milieu, " + M("f - g") + " vaut " + M(FR(mid) + " > 0") + " : la parabole est au-dessus.", M("\\int_{" + r1 + "}^{" + r2 + "} \\left(" + poly([-1, r1 + r2, -r1 * r2]) + "\\right) dx = " + FR(ar)) + "."]),
        chk: [[r1, N(r1)], [r2, N(r2)], [mid, FRp(mid)], [ar, FRp(ar)]] }); },
    // Le débit d'un ruisseau
    () => { const [k, T] = pk([[1, 6], [2, 6], [3, 4], [3, 8], [1, 12]]), r0 = pk([5, 8, 10, 12]), mx = (k * T * T) / 4 + r0, vol = (k * T ** 3) / 6 + r0 * T, moy = (k * T * T) / 6 + r0;
      return X({ id: "integrale", lv: 2, titre: "Le débit d'un ruisseau",
        q: "Pendant une averse de " + M(T) + " heures, le débit d'un ruisseau (en m³ par heure) vaut " + M("r(t) = " + poly([-k, k * T, r0], "t")) + ", pour " + M("0 \\le t \\le " + T) + ".",
        parts: [{ label: "Quel est le débit au début et à la fin de l'averse ?", pts: 1 }, { label: "Quand le débit est-il maximal ? Que vaut-il ?", pts: 1 }, { label: "Quel volume d'eau s'est écoulé pendant l'averse ?", pts: 2 }, { label: "Quel est le débit moyen ? Compare-le au débit maximal.", pts: 1 }],
        sol: ul([M("r(0) = r(" + T + ") = " + r0) + " m³/h.", M("r'(t) = " + lin(-2 * k, k * T).replace(/x/g, "t") + " = 0") + " pour " + M("t = " + N(T / 2)) + " h ; " + M("r(" + N(T / 2) + ") = " + N(mx)) + " m³/h.", M("\\int_0^{" + T + "} r(t)\\,dt = \\left[" + poly([-k / 3, (k * T) / 2, r0, 0], "t") + "\\right]_0^{" + T + "} = " + N(vol)) + " m³.", M(N(vol) + " \\div " + T + " = " + N(moy)) + " m³/h, nettement moins que le maximum " + M(N(mx)) + "."]),
        chk: [[T / 2, N(T / 2)], [mx, N(mx)], [vol, N(vol)], [moy, N(moy)]] }); },
    // Le vase
    () => { const a = pk([1, 2, 3]), h = pk([6, 8, 10, 12]), Vp = (a * h * h) / 2, rr = Math.sqrt(a * h), hh = h / Math.SQRT2;
      return X({ id: "volrev", lv: 3, titre: "Le vase",
        q: "Un vase est obtenu en faisant tourner la courbe " + M("y = \\sqrt{" + (a === 1 ? "" : a) + "x}") + " autour de l'axe des abscisses, pour " + M("x") + " de 0 à " + M(h) + " (en cm). L'axe des " + M("x") + " est l'axe du vase, posé verticalement sur sa pointe.",
        parts: [{ label: "Calcule le volume du vase (valeur exacte, puis au cm³ près).", pts: 2 }, { label: "Quel est le rayon de l'ouverture (au centième) ?", pts: 1 }, { label: "On remplit le vase à moitié (en volume). À quelle hauteur l'eau arrive-t-elle (au millimètre) ? Pourquoi pas à " + M(h / 2) + " cm ?", pts: 2 }],
        sol: ul([M("V = \\pi \\int_0^{" + h + "} " + (a === 1 ? "" : a) + "x\\,dx = \\pi \\cdot \\frac{" + (a === 1 ? "" : a + " \\cdot ") + h + "^2}{2} = " + N(Vp) + "\\pi \\approx " + A(Vp * Math.PI, 0)) + " cm³.", M("y(" + h + ") = \\sqrt{" + a * h + "} \\approx " + A(rr, 2)) + " cm.", "Jusqu'à la hauteur " + M("x") + " : " + M("\\pi \\frac{" + (a === 1 ? "" : a) + "x^2}{2} = \\frac{" + N(Vp) + "\\pi}{2}") + ", donc " + M("x^2 = " + (h * h) / 2) + ", " + M("x = \\frac{" + h + "}{\\sqrt{2}} \\approx " + A(hh, 1)) + " cm. Le vase s'évase vers le haut : la moitié du volume est dans la partie haute, plus large."]),
        chk: [[Vp * Math.PI, A(Vp * Math.PI, 0), 1], [rr, A(rr, 2), 0.01], [hh, A(hh, 1), 0.1]] }); },
    // La parabole d'Archimède
    () => { const n = pk([2, 3]), ar = (4 * n ** 3) / 3, tg = n === 2 ? 36 : FR(32 / 3), at = n === 2 ? 9 : 4;
      return X({ id: "aireint", lv: 3, titre: "La parabole d'Archimède",
        q: "Soit " + M("f(x) = " + n * n + " - x^2") + ", et plus généralement " + M("f_a(x) = a - x^2") + " avec " + M("a > 0") + ".",
        parts: [{ label: "Calcule les zéros de " + M("f") + " et l'aire du domaine compris entre sa courbe et l'axe des abscisses.", pts: 2 }, { label: "Vérifie que cette aire vaut les deux tiers de celle du rectangle qui entoure le domaine (Archimède).", pts: 1 }, { label: "Exprime l'aire " + M("S(a)") + " pour " + M("f_a") + " et trouve " + M("a") + " pour que l'aire vaille " + M(tg) + ".", pts: 2 }],
        sol: ul(["Zéros " + M("\\pm " + n) + " ; " + M("\\int_{-" + n + "}^{" + n + "} (" + n * n + " - x^2)\\,dx = \\left[" + n * n + "x - \\frac{x^3}{3}\\right]_{-" + n + "}^{" + n + "} = " + FR(ar)) + ".", "Rectangle " + M(2 * n + " \\times " + n * n) + ", aire " + M(2 * n ** 3) + " ; " + M("\\frac{2}{3} \\cdot " + 2 * n ** 3 + " = " + FR(ar)) + " ✓.", M("S(a) = \\frac{4}{3} a\\sqrt{a}") + " (zéros " + M("\\pm\\sqrt{a}") + ") ; " + M("\\frac{4}{3}a\\sqrt{a} = " + tg) + " donne " + M("a\\sqrt{a} = " + (at * Math.sqrt(at))) + ", " + M("a = " + at) + "."]),
        chk: [[n, N(n)], [ar, FRp(ar)], [at, N(at)]] }); },
  ];
  const RAISONI = [
    () => { let a, b; do { a = pk([1, 2, 3]); b = pk([2, 3, 4]); } while (a === b); const w = who(), I = (b * b - a * a) / 2, S = (a * a + b * b) / 2;
      return X({ id: "aireint", lv: 1, titre: "Trouve l'erreur",
        q: "Pour l'aire entre la droite " + M("y = x") + " et l'axe des abscisses, de " + M("x = -" + a) + " à " + M("x = " + b) + ", " + w + " calcule " + M("\\int_{-" + a + "}^{" + b + "} x\\,dx = " + FR(I)) + ".",
        parts: [{ label: "Pourquoi n'est-ce pas l'aire ? Fais un croquis.", pts: 1 }, { label: "Calcule l'aire correcte.", pts: 1 }],
        sol: ul(["Sur " + M("[-" + a + " \\,;\\, 0]") + " la droite est sous l'axe : ce morceau compte négativement dans l'intégrale.", M("\\left|\\int_{-" + a + "}^{0} x\\,dx\\right| + \\int_0^{" + b + "} x\\,dx = " + FR((a * a) / 2) + " + " + FR((b * b) / 2) + " = " + FR(S)) + "."]),
        chk: [[S, FRp(S)]] }); },
    () => VF("integrale", 2, [["« " + M("\\int_a^b f(x)\\,dx") + " est toujours l'aire sous la courbe. »", false, "Seulement si " + M("f \\ge 0") + " ; les parties sous l'axe comptent négativement."],
      ["« Deux primitives d'une même fonction diffèrent d'une constante. »", true, "Leur différence a une dérivée nulle."],
      ["« " + M("\\int_1^3 2x\\,dx = 8") + ". »", true, M("3^2 - 1^2 = 8") + "."],
      ["« Une primitive de " + M("\\cos x") + " est " + M("-\\sin x") + ". »", false, M("(\\sin x)' = \\cos x") + " : c'est " + M("\\sin x") + "."],
      ["« " + M("\\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx") + ". »", true, "Échanger les bornes change le signe."],
      ["« Le volume de révolution vaut " + M("\\pi\\int_a^b f(x)\\,dx") + ". »", false, "On intègre " + M("f(x)^2") + " : " + M("\\pi\\int_a^b f(x)^2\\,dx") + "."]]),
  ];

  // ===================== 4e · Logarithme et exponentielle =====================
  const EXL = [
    // Trois équations
    () => { const c = pk([5, 7, 10, 12]), a = pk([2, 3]), b = pk([1, 2, 4]), k = pk([1, 2, 3]), [p, q] = pk([[2, 3], [2, 5], [3, 4], [2, 4], [3, 5]]);
      const x1 = (Math.log(c) + b) / a, x2 = (Math.exp(k) + 1) / 2;
      return X({ id: "lnexp", lv: 1, titre: "Trois équations",
        q: "Résous les équations suivantes (valeur exacte, puis au millième).",
        parts: [{ label: M("e^{" + a + "x - " + b + "} = " + c), pts: 1 }, { label: M("\\ln(2x - 1) = " + k), pts: 1 }, { label: M("e^{2x} - " + (p + q) + "e^x + " + p * q + " = 0") + " (pose " + M("X = e^x") + ").", pts: 2 }],
        sol: ul([M(a + "x - " + b + " = \\ln " + c) + ", " + M("x = \\frac{\\ln " + c + " + " + b + "}{" + a + "} \\approx " + A(x1, 3)) + ".", M("2x - 1 = e" + (k > 1 ? "^{" + k + "}" : "")) + ", " + M("x = \\frac{e" + (k > 1 ? "^{" + k + "}" : "") + " + 1}{2} \\approx " + A(x2, 3)) + " (et " + M("2x - 1 > 0") + " ✓).", M("X^2 - " + (p + q) + "X + " + p * q + " = (X - " + p + ")(X - " + q + ") = 0") + " : " + M("e^x = " + p) + " ou " + M("e^x = " + q) + ", " + M("x = \\ln " + p + " \\approx " + A(Math.log(p), 3)) + " ou " + M("x = \\ln " + q + " \\approx " + A(Math.log(q), 3)) + "."]),
        chk: [[x1, A(x1, 3), 0.001], [x2, A(x2, 3), 0.001], [Math.log(p), A(Math.log(p), 3), 0.001], [Math.log(q), A(Math.log(q), 3), 0.001]] }); },
    // Une culture de bactéries
    () => { const N0 = pk([800, 2000, 5000]), r = pk([1.5, 1.2, 1.8]), t1 = pk([3, 4, 5]), F = pk([5, 10]), k = Math.log(r) / t1, Td = Math.LN2 / k, tF = Math.log(F) / k, N1 = N0 * r;
      return X({ id: "croissance", lv: 2, titre: "Une culture de bactéries",
        q: "Une culture compte " + M(N(N0)) + " bactéries ; " + M(t1) + " heures plus tard, elle en compte " + M(N(N1)) + ". On suppose une croissance exponentielle " + M("N(t) = N_0 e^{kt}") + " (" + M("t") + " en heures).",
        parts: [{ label: "Détermine " + M("k") + " (valeur exacte, puis au millième).", pts: 1 }, { label: "Calcule le temps de doublement (au dixième d'heure).", pts: 1 }, { label: "Au bout de combien de temps la culture compte-t-elle " + M(N(F * N0)) + " bactéries (au dixième) ?", pts: 2 }, { label: "Le temps de doublement dépend-il de " + M("N_0") + " ? Justifie.", pts: 1 }],
        sol: ul([M("e^{" + t1 + "k} = " + N(r)) + ", " + M("k = \\frac{\\ln " + N(r) + "}{" + t1 + "} \\approx " + A(k, 3)) + ".", M("e^{kT} = 2") + ", " + M("T = \\frac{\\ln 2}{k} \\approx " + A(Td, 1)) + " h.", M("e^{kt} = " + F) + ", " + M("t = \\frac{\\ln " + F + "}{k} \\approx " + A(tF, 1)) + " h.", "Non : " + M("N_0 e^{kT} = 2N_0") + " se simplifie par " + M("N_0") + "."]),
        chk: [[k, A(k, 3), 0.001], [Td, A(Td, 1), 0.1], [tF, A(tF, 1), 0.1]] }); },
    // Le café qui refroidit
    () => { const T0 = pk([80, 90, 95]), Ta = pk([18, 20, 22]), T10 = pk([50, 55, 60]), q = (T10 - Ta) / (T0 - Ta), k = -Math.log(q) / 10, T20 = Ta + (T0 - Ta) * q * q, t30 = Math.log((T0 - Ta) / 10) / k;
      return X({ id: "croissance", lv: 2, titre: "Le café qui refroidit",
        q: "Un café à " + M(T0 + "\\ °\\text{C}") + " refroidit dans une pièce à " + M(Ta + "\\ °\\text{C}") + ". Sa température suit " + M("T(t) = " + Ta + " + " + (T0 - Ta) + "e^{-kt}") + " (" + M("t") + " en minutes). Après 10 minutes, il est à " + M(T10 + "\\ °\\text{C}") + ".",
        parts: [{ label: "Détermine " + M("k") + " (au millième).", pts: 1 }, { label: "Quelle est sa température après 20 minutes (au dixième) ?", pts: 1 }, { label: "Quand atteint-il " + M(Ta + 10 + "\\ °\\text{C}") + " (au dixième de minute) ?", pts: 2 }, { label: "Que devient la température à long terme ?", pts: 1 }],
        sol: ul([M((T0 - Ta) + "e^{-10k} = " + (T10 - Ta)) + ", " + M("k = -\\frac{1}{10}\\ln\\frac{" + (T10 - Ta) + "}{" + (T0 - Ta) + "} \\approx " + A(k, 3)) + ".", M("T(20) = " + Ta + " + " + (T0 - Ta) + "\\left(\\frac{" + (T10 - Ta) + "}{" + (T0 - Ta) + "}\\right)^2 \\approx " + A(T20, 1)) + " °C.", M((T0 - Ta) + "e^{-kt} = 10") + ", " + M("t = \\frac{\\ln " + N((T0 - Ta) / 10) + "}{k} \\approx " + A(t30, 1)) + " min.", M("e^{-kt} \\to 0") + " : la température tend vers " + M(Ta) + " °C (celle de la pièce)."]),
        chk: [[k, A(k, 3), 0.001], [T20, A(T20, 1), 0.1], [t30, A(t30, 1), 0.1]] }); },
    // Le médicament
    () => { const k = pk([8, 10, 12]), a = pk([2, 3, 4]), Cm = (k * a) / E, C2 = (2 * k * a) / (E * E);
      return X({ id: "lnexp", lv: 3, titre: "Le médicament",
        q: "La concentration d'un médicament dans le sang (en mg/L), " + M("t") + " heures après la prise, vaut " + M("C(t) = " + k + "t\\,e^{-t/" + a + "}") + ".",
        parts: [{ label: "Calcule " + M("C'(t)") + " et factorise-la.", pts: 2 }, { label: "Quand la concentration est-elle maximale ? Que vaut-elle (au centième) ?", pts: 1 }, { label: "Calcule " + M("C(" + 2 * a + ")") + " (au centième) et décris l'évolution après le maximum.", pts: 1 }, { label: "Quelle est la pente de la tangente à l'origine ? Que signifie-t-elle ?", pts: 1 }],
        sol: ul([M("C'(t) = " + k + "e^{-t/" + a + "} + " + k + "t \\cdot \\left(-\\frac{1}{" + a + "}\\right)e^{-t/" + a + "} = " + k + "e^{-t/" + a + "}\\left(1 - \\frac{t}{" + a + "}\\right)") + ".", M("C'") + " passe de + à − en " + M("t = " + a) + " : maximum " + M("C(" + a + ") = \\frac{" + k * a + "}{e} \\approx " + A(Cm, 2)) + " mg/L.", M("C(" + 2 * a + ") = \\frac{" + 2 * k * a + "}{e^2} \\approx " + A(C2, 2)) + " mg/L : après le maximum, la concentration décroît et tend vers 0.", M("C'(0) = " + k) + " : au début, la concentration augmente d'environ " + M(k) + " mg/L par heure."]),
        chk: [[a, N(a)], [Cm, A(Cm, 2), 0.01], [C2, A(C2, 2), 0.01], [k, N(k)]] }); },
  ];
  const RAISONL = [
    () => { const [u, v] = pk([[2, 3], [2, 5], [3, 4], [4, 5]]), w = who();
      return X({ id: "lnexp", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\ln(" + u + " + " + v + ") = \\ln " + u + " + \\ln " + v) + " ».",
        parts: [{ label: "Calcule les deux membres (au millième). Conclusion ?", pts: 1 }, { label: "Quelle est la bonne propriété ? Simplifie " + M("\\ln " + u + " + \\ln " + v) + ".", pts: 1 }],
        sol: ul([M("\\ln " + (u + v) + " \\approx " + A(Math.log(u + v), 3)) + " mais " + M("\\ln " + u + " + \\ln " + v + " \\approx " + A(Math.log(u * v), 3)) + " : c'est faux.", M("\\ln a + \\ln b = \\ln(ab)") + " : " + M("\\ln " + u + " + \\ln " + v + " = \\ln " + u * v) + ". Le logarithme transforme les produits en sommes, pas les sommes."]),
        chk: [[Math.log(u + v), A(Math.log(u + v), 3), 0.001], [Math.log(u * v), A(Math.log(u * v), 3), 0.001]] }); },
    () => VF("lnexp", 2, [["« " + M("(e^{3x})' = 3e^{3x}") + ". »", true, M("(e^u)' = u'e^u") + " avec " + M("u = 3x") + "."],
      ["« " + M("\\ln(x^5) = 5\\ln x") + " pour " + M("x > 0") + ". »", true, M("\\ln(a^n) = n\\ln a") + "."],
      ["« L'équation " + M("e^x = -2") + " a une solution. »", false, M("e^x > 0") + " pour tout " + M("x") + "."],
      ["« " + M("(\\ln x)' = \\frac{1}{x}") + ". »", true, "C'est la définition de " + M("\\ln") + " comme primitive de " + M("\\frac{1}{x}") + "."],
      ["« Une croissance de 5 % par an correspond à " + M("N_0e^{0{,}05t}") + ". »", false, "Il faut " + M("k = \\ln 1{,}05 \\approx 0{,}0488") + "."],
      ["« La demi-vie d'une décroissance " + M("N_0e^{-kt}") + " vaut " + M("\\frac{\\ln 2}{k}") + ". »", true, M("e^{-kT} = \\frac{1}{2} \\iff T = \\frac{\\ln 2}{k}") + "."]]),
  ];

  // ===================== 4e · Algèbre linéaire =====================
  const D4 = [
    [[[0, -1], [1, 0]], "la rotation de 90° autour de O"], [[[0, 1], [-1, 0]], "la rotation de −90° autour de O"],
    [[[1, 0], [0, -1]], "la symétrie d'axe Ox"], [[[-1, 0], [0, 1]], "la symétrie d'axe Oy"],
    [[[0, 1], [1, 0]], "la symétrie d'axe y = x"], [[[0, -1], [-1, 0]], "la symétrie d'axe y = −x"],
    [[[-1, 0], [0, -1]], "la symétrie centrale de centre O (rotation de 180°)"], [[[1, 0], [0, 1]], "l'identité"],
  ];
  const nomD4 = (P) => D4.find(([Q]) => Q.every((r, i) => r.every((v, j) => v === P[i][j])))[1];
  const EXA = [
    // Calcul matriciel
    () => { let P, Q; do { P = nzm(-4, 5); Q = nzm(-3, 4); } while (!det(P) || !det(Q) || !mul(P, Q)[0][1]);
      const PQ = mul(P, Q), QP = mul(Q, P), eq = PQ.every((r, i) => r.every((v, j) => v === QP[i][j])), S = P.map((r, i) => r.map((v, j) => 2 * v - Q[i][j]));
      return X({ id: "matrices", lv: 1, titre: "Calcul matriciel",
        q: "On donne " + M("A = " + mX(P)) + " et " + M("B = " + mX(Q)) + ".",
        parts: [{ label: "Calcule " + M("2A - B") + ".", pts: 1 }, { label: "Calcule " + M("AB") + " et " + M("BA") + ". Commente.", pts: 2 }, { label: "Calcule " + M("\\det A") + ", " + M("\\det B") + " et " + M("\\det(AB)") + ". Que constates-tu ?", pts: 2 }],
        sol: ul([M("2A - B = " + mX(S)) + ".", M("AB = " + mX(PQ)) + ", " + M("BA = " + mX(QP)) + (eq ? " : ici égales, mais c'est un hasard." : " : " + M("AB \\neq BA") + ", le produit n'est pas commutatif."), M("\\det A = " + det(P)) + ", " + M("\\det B = " + det(Q)) + ", " + M("\\det(AB) = " + det(PQ) + " = " + par(det(P)) + " \\cdot " + par(det(Q))) + " : " + M("\\det(AB) = \\det A \\cdot \\det B") + "."]),
        chk: [[PQ[0][1], N(PQ[0][1])], [det(P), N(det(P))], [det(Q), N(det(Q))], [det(PQ), N(det(PQ))]] }); },
    // Système et inverse
    () => { let a, b, c, d, D, x0, y0, e, f; do { a = R.nz(-6, 6); b = R.nz(-6, 6); c = R.nz(-6, 6); d = pk([-3, -2, 2, 3]); D = a * d - b * c; x0 = R.nz(-5, 5); y0 = R.nz(-5, 5); e = a * x0 + b * y0; f = c * x0 + d * y0; } while (Math.abs(D) < 2 || !e || !f || x0 === y0);
      const mm = (b * c) / d;
      return X({ id: "matrices", lv: 2, titre: "Un système, deux méthodes",
        q: "On considère le système " + M("\\begin{cases} " + lin(a, 0) + yT(b) + " = " + e + " \\\\ " + lin(c, 0) + yT(d) + " = " + f + " \\end{cases}") + ", de matrice " + M("A = " + mX([[a, b], [c, d]])) + ".",
        parts: [{ label: "Calcule " + M("\\det A") + ". Le système a-t-il une solution unique ?", pts: 1 }, { label: "Résous-le avec la règle de Cramer.", pts: 2 }, { label: "Calcule " + M("A^{-1}") + " et vérifie la solution avec " + M("A^{-1}\\binom{" + e + "}{" + f + "}") + ".", pts: 1 }, { label: "On remplace le coefficient " + M(a) + " par " + M("m") + ". Pour quelle valeur de " + M("m") + " le système n'a-t-il plus une solution unique ?", pts: 1 }],
        sol: ul([M("\\det A = " + par(a) + " \\cdot " + par(d) + " - " + par(b) + " \\cdot " + par(c) + " = " + D) + " ≠ 0 : solution unique.", M("x = \\frac{" + e + " \\cdot " + par(d) + " - " + par(b) + " \\cdot " + par(f) + "}{" + D + "} = " + x0) + ", " + M("y = \\frac{" + par(a) + " \\cdot " + par(f) + " - " + par(e) + " \\cdot " + par(c) + "}{" + D + "} = " + y0) + ".", M("A^{-1} = \\frac{1}{" + D + "}" + mX([[d, -b], [-c, a]])) + " ; le produit donne bien " + M(col(x0, y0)) + ".", M("\\det = " + par(d) + "m - " + par(b) + " \\cdot " + par(c) + " = 0") + " pour " + M("m = " + FR(mm)) + "."]),
        chk: [[D, N(D)], [x0, N(x0)], [y0, N(y0)], [mm, FRp(mm)]] }); },
    // Un triangle transformé
    () => { let P, u1, u2; do { P = nzm(-3, 3); u1 = R.nz(-3, 3); u2 = R.nz(-3, 3); } while (Math.abs(det(P)) < 2 || P[0][0] * u1 + P[0][1] * u2 === 0 || P[1][0] * u1 + P[1][1] * u2 === 0);
      const p = pk([2, 3, 4]), q = pk([2, 3]), s1 = P[0][0] * u1 + P[0][1] * u2, s2 = P[1][0] * u1 + P[1][1] * u2, ar = (p * q) / 2, ai = Math.abs(det(P)) * ar;
      return X({ id: "translin", lv: 2, titre: "Un triangle transformé",
        q: "L'application linéaire " + M("f") + " a pour matrice " + M("A = " + mX(P)) + ". On considère le triangle " + M("O(0 \\,;\\, 0)") + ", " + M("P(" + p + " \\,;\\, 0)") + ", " + M("Q(0 \\,;\\, " + q + ")") + ".",
        parts: [{ label: "Calcule les images " + M("P'") + " et " + M("Q'") + " de " + M("P") + " et " + M("Q") + ".", pts: 1 }, { label: "Calcule l'aire du triangle " + M("OPQ") + " et celle de son image, sans dessin.", pts: 2 }, { label: "Quel point a pour image " + M("S(" + s1 + " \\,;\\, " + s2 + ")") + " ?", pts: 2 }],
        sol: ul([M("P' = " + pt(P[0][0] * p, P[1][0] * p)) + ", " + M("Q' = " + pt(P[0][1] * q, P[1][1] * q)) + " (colonnes de " + M("A") + " multipliées par " + M(p) + " et " + M(q) + ").", "Aire " + M("\\frac{" + p + " \\cdot " + q + "}{2} = " + FR(ar)) + " ; " + M("|\\det A| = " + Math.abs(det(P))) + ", donc aire de l'image " + M(FR(ai)) + ".", M("A^{-1}" + col(s1, s2) + " = " + col(u1, u2)) + " (ou résoudre le système) : c'est " + M(pt(u1, u2)) + "."]),
        chk: [[P[0][0] * p, N(P[0][0] * p)], [ai, FRp(ai)], [u1, N(u1)], [u2, N(u2)]] }); },
    // Composer deux transformations
    () => { let i, j, G; do { i = R.int(0, 5); j = R.int(0, 5); G = mul(D4[j][0], D4[i][0]); } while (i === j || nomD4(G) === "l'identité");
      const [Af, nf] = D4[i], [Bg, ng] = D4[j], F = mul(Af, Bg); let p1, p2; do { p1 = R.nz(-5, 5); p2 = R.nz(-5, 5); } while (Math.abs(p1) === Math.abs(p2));
      const im = [G[0][0] * p1 + G[0][1] * p2, G[1][0] * p1 + G[1][1] * p2];
      return X({ id: "translin", lv: 3, titre: "Composer deux transformations",
        q: M("f") + " est " + nf + " et " + M("g") + " est " + ng + ".",
        parts: [{ label: "Écris la matrice " + M("A") + " de " + M("f") + " et la matrice " + M("B") + " de " + M("g") + " (images de " + M("(1 \\,;\\, 0)") + " et " + M("(0 \\,;\\, 1)") + ").", pts: 1 }, { label: "Calcule la matrice de " + M("g \\circ f") + " (d'abord " + M("f") + "). Quelle transformation est-ce ?", pts: 2 }, { label: "Même question pour " + M("f \\circ g") + ". L'ordre compte-t-il ?", pts: 1 }, { label: "Calcule l'image de " + M("P(" + p1 + " \\,;\\, " + p2 + ")") + " par " + M("g \\circ f") + ".", pts: 1 }],
        sol: ul([M("A = " + mX(Af)) + ", " + M("B = " + mX(Bg)) + ".", M("BA = " + mX(G)) + " : " + nomD4(G) + ".", M("AB = " + mX(F)) + " : " + nomD4(F) + (nomD4(F) === nomD4(G) ? " ; ici l'ordre ne change rien." : " ; l'ordre compte."), M("BA" + col(p1, p2) + " = " + col(im[0], im[1])) + "."]),
        chk: [[im[0], N(im[0])], [im[1], N(im[1])]] }); },
    // La machine qui écrase le plan (24.11 : applications linéaires, noyau et image)
    () => { const b = pk([-3, -2, 2, 3]), m = pk([-2, 2, 3]), a = -b * m, k = pk([-3, -2, 2, 3]), Am = [[a, b], [k * a, k * b]], u = [R.nz(-3, 3), R.nz(-3, 3)];
      if (a * u[0] + b * u[1] === 0) u[0] += u[0] > 0 ? 1 : -1; /* u hors du noyau */
      const fu = [a * u[0] + b * u[1], k * (a * u[0] + b * u[1])];
      return X({ id: "appllin", lv: 2, titre: "La machine qui écrase le plan",
        q: "L'application linéaire " + M("f") + " a pour matrice " + M(mX(Am)) + ".",
        parts: [{ label: "Calcule " + M("\\det A") + ". Que peut-on en conclure ?", pts: 1 }, { label: "Le noyau est engendré par " + M("(1 \\,;\\, m)") + ". Trouve " + M("m") + ".", pts: 1 }, { label: "L'image est la droite " + M("y = px") + ". Trouve " + M("p") + ".", pts: 1 }, { label: "Calcule " + M("f" + pt(u[0], u[1])) + " et vérifie que ce point est sur la droite image.", pts: 1 }],
        sol: ul([M("\\det A = " + FR(a) + " \\cdot " + par(k * b) + " - " + par(b) + " \\cdot " + par(k * a) + " = 0") + " : " + M("f") + " n'est pas inversible ; elle écrase le plan sur une droite.", M(FR(a) + " + " + par(b) + "m = 0") + " : " + M("m = " + m) + ".", "Image engendrée par la première colonne " + M(pt(a, k * a)) + " : " + M("p = " + k) + ".", M("f" + pt(u[0], u[1]) + " = " + pt(fu[0], fu[1])) + " ; " + M(FR(fu[1]) + " = " + k + " \\cdot " + par(fu[0])) + " : il est bien sur " + M("y = " + k + "x") + "."]),
        chk: [[m, N(m)], [k, N(k)], [fu[0], N(fu[0])], [fu[1], N(fu[1])]] }); },
  ];
  const RAISONA = [
    () => { let P, Q; do { P = nzm(-3, 4); Q = nzm(-3, 4); } while (mul(P, Q)[0][0] === P[0][0] * Q[0][0] || !mul(P, Q)[0][0]); const w = who(), PQ = mul(P, Q);
      return X({ id: "matrices", lv: 1, titre: "Trouve l'erreur",
        q: "Pour " + M("A = " + mX(P)) + " et " + M("B = " + mX(Q)) + ", " + w + " écrit : « " + M("AB = " + mX(P.map((r, i) => r.map((v, k) => v * Q[i][k])))) + " ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon produit.", pts: 1 }],
        sol: ul([w + " a multiplié les coefficients placés au même endroit ; le produit se fait « ligne × colonne ».", M("AB = " + mX(PQ)) + " ; par exemple en haut à gauche " + M(par(P[0][0]) + " \\cdot " + par(Q[0][0]) + " + " + par(P[0][1]) + " \\cdot " + par(Q[1][0]) + " = " + PQ[0][0]) + "."]),
        chk: [[PQ[0][0], N(PQ[0][0])]] }); },
    () => VF("translin", 2, [["« Les colonnes de la matrice d'une application linéaire sont les images de " + M("(1 \\,;\\, 0)") + " et " + M("(0 \\,;\\, 1)") + ". »", true, M("A\\binom{1}{0}") + " est la 1re colonne, " + M("A\\binom{0}{1}") + " la 2e."],
      ["« Une matrice de déterminant nul est inversible. »", false, "Il faut " + M("\\det A \\neq 0") + " ; sinon l'application écrase le plan sur une droite."],
      ["« Une rotation conserve les aires. »", true, M("\\det = \\cos^2\\theta + \\sin^2\\theta = 1") + "."],
      ["« Pour toutes matrices, " + M("AB = BA") + ". »", false, "Exemple : rotation de 90° et symétrie d'axe Ox ne commutent pas."],
      ["« Une homothétie de rapport 3 multiplie les aires par 9. »", true, M("\\det\\begin{pmatrix} 3 & 0 \\\\ 0 & 3 \\end{pmatrix} = 9") + "."],
      ["« " + M("\\det(2A) = 2\\det A") + " pour une matrice " + M("2 \\times 2") + ". »", false, M("\\det(2A) = 2^2 \\det A = 4\\det A") + "."]]),
  ];

  // ===================== 4e · Probabilités =====================
  const EXP = [
    // La loi normale en pratique
    () => { const [ctx, u, mu, s] = pk([["La durée de vie d'une ampoule", "h", 1200, 100], ["La masse des œufs d'un élevage", "g", 62, 4], ["Le temps de trajet de " + who() + " pour aller au Collège", "min", 35, 5], ["La taille des recrues d'une caserne", "cm", 176, 7]]), n = pk([200, 400, 500, 1000]);
      return X({ id: "normale", lv: 1, titre: "La règle 68-95-99,7",
        q: ctx + " suit une loi normale de moyenne " + M(N(mu) + "\\ \\text{" + u + "}") + " et d'écart-type " + M(s + "\\ \\text{" + u + "}") + ".",
        parts: [{ label: "Quel pourcentage se trouve entre " + M(N(mu - s)) + " et " + M(N(mu + s)) + " " + u + " ?", pts: 1 }, { label: "Quel pourcentage dépasse " + M(N(mu + 2 * s)) + " " + u + " ?", pts: 1 }, { label: "Quel pourcentage se trouve entre " + M(N(mu - s)) + " et " + M(N(mu + 2 * s)) + " " + u + " ?", pts: 2 }, { label: "Sur " + M(n) + " cas, combien en attend-on sous " + M(N(mu - s)) + " " + u + " ?", pts: 1 }],
        sol: ul(["À un écart-type de la moyenne : environ 68 %.", M(N(mu + 2 * s) + " = \\mu + 2\\sigma") + " : il reste " + M("\\frac{100 - 95}{2} = 2{,}5") + " %.", "On coupe à la moyenne : " + M("34 + 47{,}5 = 81{,}5") + " %.", "Sous " + M("\\mu - \\sigma") + " : " + M("\\frac{100 - 68}{2} = 16") + " %, soit " + M(n + " \\cdot 0{,}16 = " + N(0.16 * n)) + "."]),
        chk: [[68, "68"], [2.5, "2,5"], [81.5, "81,5"], [0.16 * n, N(0.16 * n)]] }); },
    // Deux machines
    () => { const a = pk([0.6, 0.7, 0.55]), dA = pk([0.02, 0.03]), dB = pk([0.05, 0.04, 0.06]), pD = a * dA + (1 - a) * dB, pAD = (a * dA) / pD, pBn = ((1 - a) * (1 - dB)) / (1 - pD);
      return X({ id: "condbayes", lv: 2, titre: "Deux machines",
        q: "Une usine fabrique des pièces avec deux machines : la machine A produit " + M(N(100 * a) + "\\,\\%") + " des pièces, dont " + M(N(100 * dA) + "\\,\\%") + " sont défectueuses ; la machine B produit les autres, dont " + M(N(100 * dB) + "\\,\\%") + " sont défectueuses. On prend une pièce au hasard.",
        parts: [{ label: "Dessine l'arbre de probabilités.", pts: 1 }, { label: "Quelle est la probabilité que la pièce soit défectueuse ?", pts: 1 }, { label: "La pièce est défectueuse. Quelle est la probabilité qu'elle vienne de A (au millième) ?", pts: 2 }, { label: "La pièce est en bon état. Quelle est la probabilité qu'elle vienne de B (au millième) ?", pts: 1 }],
        sol: ul(["Branches A (" + M(N(a)) + ") et B (" + M(N(1 - a)) + "), puis défectueuse ou non.", "Probabilités totales : " + M(N(a) + " \\cdot " + N(dA) + " + " + N(1 - a) + " \\cdot " + N(dB) + " = " + N(pD)) + ".", "Bayes : " + M("P_D(A) = \\frac{" + N(a * dA) + "}{" + N(pD) + "} \\approx " + A(pAD, 3)) + ".", M("P_{\\overline{D}}(B) = \\frac{" + N(1 - a) + " \\cdot " + N(1 - dB) + "}{1 - " + N(pD) + "} \\approx " + A(pBn, 3)) + "."]),
        chk: [[pD, N(pD)], [pAD, A(pAD, 3), 0.001], [pBn, A(pBn, 3), 0.001]] }); },
    // Le QCM au hasard
    () => { const n = pk([8, 10, 12]), k = pk([3, 4, 5]), p = 1 / k, P0 = (1 - p) ** n, P1 = n * p * (1 - p) ** (n - 1), P2 = 1 - P0 - P1, m = Math.ceil(Math.log(0.01) / Math.log(1 - p));
      return X({ id: "binomiale", lv: 2, titre: "Le QCM au hasard",
        q: "Un QCM a " + M(n) + " questions, chacune avec " + M(k) + " réponses dont une seule juste. " + who() + " répond au hasard à toutes. " + M("X") + " est le nombre de bonnes réponses.",
        parts: [{ label: "Quelle est la loi de " + M("X") + " ? Calcule " + M("E(X)") + ".", pts: 1 }, { label: "Calcule " + M("P(X = 0)") + " (au millième).", pts: 1 }, { label: "Calcule " + M("P(X \\ge 2)") + " (au millième).", pts: 2 }, { label: "Combien de questions faudrait-il au minimum pour que la probabilité d'avoir au moins une bonne réponse dépasse 99 % ?", pts: 1 }],
        sol: ul([M("X \\sim B(" + n + " \\,;\\, " + FR(p) + ")") + " ; " + M("E(X) = " + n + " \\cdot " + FR(p) + " = " + FR(n * p)) + ".", M("P(X = 0) = \\left(" + FR(1 - p) + "\\right)^{" + n + "} \\approx " + A(P0, 3)) + ".", M("P(X = 1) = " + n + " \\cdot " + FR(p) + " \\cdot \\left(" + FR(1 - p) + "\\right)^{" + (n - 1) + "} \\approx " + A(P1, 3)) + ", donc " + M("P(X \\ge 2) = 1 - P(X = 0) - P(X = 1) \\approx " + A(P2, 3)) + ".", M("1 - \\left(" + FR(1 - p) + "\\right)^m \\ge 0{,}99") + " ⟺ " + M("m \\ge \\frac{\\ln 0{,}01}{\\ln " + FR(1 - p) + "} \\approx " + A(Math.log(0.01) / Math.log(1 - p), 2)) + " : " + M(m) + " questions."]),
        chk: [[n * p, FRp(n * p)], [P0, A(P0, 3), 0.001], [P2, A(P2, 3), 0.001], [m, N(m)]] }); },
    // La roue de la fête
    () => { let mz, s, j, Ex, jf; do { mz = pk([2, 3, 4]); s = pk([1, 2]); j = pk([6, 8, 10]); Ex = -mz / 2 + s / 3 + j / 6; jf = 3 * mz - 2 * s; } while (Math.abs(Ex) < 1e-9 || jf <= s || jf === j);
      const V = (mz * mz) / 2 + (s * s) / 3 + (j * j) / 6 - Ex * Ex;
      return X({ id: "varalea", lv: 3, titre: "La roue de la fête",
        q: "Une roue a trois secteurs : rouge (180°), bleu (120°) et vert (60°). On mise " + M(mz) + " CHF : sur le rouge on perd la mise ; sur le bleu, on récupère la mise plus " + M(s) + " CHF ; sur le vert, la mise plus " + M(j) + " CHF. " + M("X") + " est le gain net (en CHF).",
        parts: [{ label: "Donne la loi de " + M("X") + ".", pts: 1 }, { label: "Calcule " + M("E(X)") + ". Le jeu est-il favorable au joueur ?", pts: 1 }, { label: "Calcule l'écart-type de " + M("X") + " (au centième).", pts: 1 }, { label: "Quel gain sur le vert rendrait le jeu équitable ? Et que gagne-t-on en moyenne sur 30 parties avec le gain actuel ?", pts: 2 }],
        sol: ul([M("X") + " vaut " + M("-" + mz) + ", " + M(s) + ", " + M(j) + " avec les probabilités " + M("\\frac{1}{2}") + ", " + M("\\frac{1}{3}") + ", " + M("\\frac{1}{6}") + " (angles ÷ 360°).", M("E(X) = -\\frac{" + mz + "}{2} + \\frac{" + s + "}{3} + \\frac{" + j + "}{6} = " + FR(Ex)) + (Ex > 0 ? " > 0 : favorable au joueur." : " < 0 : défavorable au joueur."), M("V = E(X^2) - E(X)^2 = " + FR((mz * mz) / 2 + (s * s) / 3 + (j * j) / 6) + " - \\left(" + FR(Ex) + "\\right)^2 \\approx " + A(V, 2)) + ", " + M("\\sigma \\approx " + A(Math.sqrt(V), 2)) + ".", M("-\\frac{" + mz + "}{2} + \\frac{" + s + "}{3} + \\frac{g}{6} = 0") + " donne " + M("g = " + jf) + " CHF ; sur 30 parties : " + M("30 \\cdot " + FR(Ex) + " = " + FR(30 * Ex)) + " CHF."]),
        chk: [[Ex, FRp(Ex)], [Math.sqrt(V), A(Math.sqrt(V), 2), 0.01], [jf, N(jf)], [30 * Ex, FRp(30 * Ex)]] }); },
    // Les temps de trajet (24.11 : statistiques ouvertes en 4e)
    () => { let xs, m, sd, k; do { xs = Array.from({ length: 10 }, () => R.int(12, 45)); m = xs.reduce((a, b) => a + b, 0) / 10; sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / 10); k = xs.filter((x) => x >= m - sd && x <= m + sd).length; } while (sd < 4 || new Set(xs).size < 8);
      return X({ id: "statdesc", lv: 2, titre: "Les temps de trajet",
        q: who() + " note ses temps de trajet (en minutes) pendant deux semaines d'école : " + xs.join(" ; ") + ".",
        parts: [{ label: "Calcule la moyenne " + M("\\bar x") + ".", pts: 1 }, { label: "Calcule l'écart-type " + M("\\sigma") + " (au centième).", pts: 2 }, { label: "Combien de trajets sont dans l'intervalle " + M("[\\bar x - \\sigma \\,;\\, \\bar x + \\sigma]") + " ? Quel pourcentage cela représente-t-il ?", pts: 1 }],
        sol: ul([M("\\bar x = \\frac{" + xs.reduce((a, b) => a + b, 0) + "}{10} = " + N(m)) + " min.", M("\\sigma = \\sqrt{\\frac{1}{10}\\sum (x_i - \\bar x)^2} \\approx " + A(sd, 2)) + " min (racine de la moyenne des carrés des écarts).", "Intervalle " + M("[" + A(m - sd, 2) + " \\,;\\, " + A(m + sd, 2) + "]") + " : " + M(k) + " trajets, soit " + M(10 * k + "\\,\\%") + " (pour une loi normale, on en attendrait environ 68 %)."]),
        chk: [[m, N(m)], [sd, A(sd, 2), 0.01], [k, N(k)]] }); },
    // Deux classes, deux boîtes (quartiles)
    () => { const mk11 = () => Array.from({ length: 11 }, () => R.int(20, 60)).sort((a, b) => a - b); let s1, s2; do { s1 = mk11(); s2 = mk11(); } while (s1[8] - s1[2] === s2[8] - s2[2] || s1[5] === s2[5]);
      const iq1 = s1[8] - s1[2], iq2 = s2[8] - s2[2];
      return X({ id: "statdesc", lv: 2, titre: "Deux classes, deux boîtes",
        q: "Points obtenus à un même test (sur 60) dans deux classes de 11 élèves, séries triées. Classe A : " + s1.join(" ; ") + ". Classe B : " + s2.join(" ; ") + ".",
        parts: [{ label: "Donne la médiane, " + M("Q_1") + " et " + M("Q_3") + " de la classe A.", pts: 1 }, { label: "Calcule l'écart interquartile de chaque classe.", pts: 1 }, { label: "Dessine les deux boîtes à moustaches sur un même axe. Quelle classe est la plus homogène ?", pts: 2 }],
        sol: ul(["Classe A : médiane " + M(s1[5]) + " (6e valeur), " + M("Q_1 = " + s1[2]) + ", " + M("Q_3 = " + s1[8]) + " (médianes des 5 premières et des 5 dernières valeurs).", "A : " + M(s1[8] + " - " + s1[2] + " = " + iq1) + " ; B : " + M("Q_1 = " + s2[2]) + ", " + M("Q_3 = " + s2[8]) + ", " + M(s2[8] + " - " + s2[2] + " = " + iq2) + ".", "Boîtes : min, " + M("Q_1") + ", médiane, " + M("Q_3") + ", max. La classe " + (iq1 < iq2 ? "A" : "B") + " a le plus petit écart interquartile : la moitié centrale de ses notes est plus resserrée."]),
        chk: [[s1[5], N(s1[5])], [s1[2], N(s1[2])], [s1[8], N(s1[8])], [iq1, N(iq1)], [iq2, N(iq2)]] }); },
  ];
  const RAISONP = [
    () => { let a, b, c, r; do { a = pk([0.4, 0.5, 0.6]); b = pk([0.2, 0.3]); c = pk([0.25, 0.3, 0.4]); r = (a * b) / c; } while (r > 1 || Math.abs(r - b) < 1e-9); const w = who();
      return X({ id: "condbayes", lv: 2, titre: "Trouve l'erreur",
        q: "Dans un collège, " + M(N(100 * a) + "\\,\\%") + " des élèves font du sport (S) ; parmi les sportifs, " + M(N(100 * b) + "\\,\\%") + " jouent d'un instrument (I) ; en tout, " + M(N(100 * c) + "\\,\\%") + " des élèves jouent d'un instrument. " + w + " affirme : « parmi les musiciens, " + M(N(100 * b) + "\\,\\%") + " font du sport ».",
        parts: [{ label: "Quelle confusion " + w + " fait-il ou elle ?", pts: 1 }, { label: "Calcule la bonne probabilité " + M("P_I(S)") + " (au millième).", pts: 1 }],
        sol: ul(["On connaît " + M("P_S(I) = " + N(b)) + " ; " + w + " le prend pour " + M("P_I(S)") + ", ce n'est pas la même chose.", "Bayes : " + M("P_I(S) = \\frac{P(S) \\cdot P_S(I)}{P(I)} = \\frac{" + N(a) + " \\cdot " + N(b) + "}{" + N(c) + "} \\approx " + A(r, 3)) + "."]),
        chk: [[r, A(r, 3), 0.001]] }); },
    () => VF("binomiale", 2, [["« Si " + M("X \\sim B(10 \\,;\\, 0{,}3)") + ", alors " + M("E(X) = 3") + ". »", true, M("E(X) = np = 10 \\cdot 0{,}3") + "."],
      ["« " + M("P(X = 2) = 0{,}3^2 \\cdot 0{,}7^8") + " pour " + M("X \\sim B(10 \\,;\\, 0{,}3)") + ". »", false, "Il manque le coefficient " + M("\\binom{10}{2} = 45") + " (nombre de chemins)."],
      ["« " + M("P_A(B) = P_B(A)") + " pour tous événements. »", false, "Contre-exemple : un test fiable donne beaucoup de faux positifs quand la maladie est rare."],
      ["« Deux événements indépendants vérifient " + M("P(A \\cap B) = P(A) \\cdot P(B)") + ". »", true, "C'est la définition de l'indépendance."],
      ["« Pour une loi normale, environ 95 % des valeurs sont à moins de deux écarts-types de la moyenne. »", true, "Règle 68-95-99,7."],
      ["« Un jeu d'espérance de gain nulle est équitable. »", true, "En moyenne, on ne gagne ni ne perd."]]),
  ];

  RICH.deriv3c = { ids: ["tauxvar", "nbderive", "derivref", "derivregles", "derivprodquot", "derivcomp", "tangente", "variations", "optimderiv"], track: "col", label: "Dérivation", ex: EXD, raison: RAISOND, minutes: 45 };
  RICH.int4c = { ids: ["primitives", "integrale", "aireint", "volrev"], track: "col", label: "Intégration", ex: EXI, raison: RAISONI, minutes: 45 };
  RICH.exp4c = { ids: ["lnexp", "croissance"], track: "col", label: "Logarithme et exponentielle", ex: EXL, raison: RAISONL, minutes: 45 };
  RICH.alg4c = { ids: ["matrices", "translin", "appllin"], track: "col", label: "Algèbre linéaire", ex: EXA, raison: RAISONA, minutes: 45 };
  RICH.proba4c = { ids: ["condbayes", "varalea", "binomiale", "statdesc", "normale"], track: "col", label: "Probabilités", ex: EXP, raison: RAISONP, minutes: 45 };
})();

// Chantier 3e et 4e Collège (24.11) : leçons actives (devine / manipule ou essaie sur la figure / retiens) pour les
// notions de src/ch3c_ana.js (3e, dérivation : tauxvar, nbderive, derivref, derivregles, derivprodquot, derivcomp,
// tangente, variations, optimderiv ; 24.11 soir : limites, limitinf, asymptotes, continuite, etudefct, derivseconde,
// combi, probaxiomes, probarbre, en « À toi : 2 questions ») et de src/ch4c_ana.js (4e : primitives, integrale, aireint, volrev, lnexp,
// croissance, matrices, translin, condbayes, varalea, binomiale, normale). Programme : tools/programme_3e_4e_college.md.
// Même moteur que act_2c.js (briques hunt et slide recopiées : fichier autonome), avec en plus des surfaces colorées
// (o.polys, aires sous une courbe) et un format des graduations x (o.fx). Le « Retiens » vient de LESSONS[id]
// (leçons de ch3c_ana.js et ch4c_ana.js) : les défis présentent les règles qu'il affiche.
// Paquet de chargement « 14 » (build.py) : chargé dès la 3e, donc aussi en 4e.
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  // Nombre arrondi à d décimales, milliers séparés par ' (1'551,33).
  const mil = (v, d = 2) => { const s = (+(+v).toFixed(d)).toString().split("."), i = s[0].replace("-", ""), neg = s[0][0] === "-";
    return (neg ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (s[1] ? "," + s[1] : ""); };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const pw = (b, x) => (Number.isInteger(x) ? b + sup(x) : b + "^" + nb(x));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const tu = (x) => "tu proposes <b>" + nb(x) + "</b>";
  const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
  // Facteur (x − z) écrit proprement : (x + 2), (x − 3).
  const fac = (z) => (z < 0 ? "(x + " + -z + ")" : "(x − " + z + ")");

  // Repère : o = { xr, yr, eq (même unité sur les deux axes), H, gx, gy, lx, ly, fns: [{ f, cls, w, dash, from, to }],
  //   vl: [[x, cls]], hl: [[y, cls]], segs: [[x1, y1, x2, y2, cls, w, dash]], circles: [[cx, cy, r, cls]],
  //   arrows: [[x1, y1, x2, y2, cls]], pts: [[x, y, étiquette, cls, position]], fy, fx (format des graduations y, x), polys, lab }
  let UID = 0;
  const graph = (o) => {
    // o.pad : marge à gauche (px) pour les graduations quand l'axe des x commence à 0 (grands nombres).
    const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
    const H = o.H || (o.eq ? Math.round((yr[1] - yr[0]) * ux + 2 * m) : 230), uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c34" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb, fx = o.fx || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    /* 24.11 soir (galerie : « 2 » pâli sous l'aire colorée) : graduations dessinées après les surfaces et les courbes, avec liseré */
    let tk = "";
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) tk += T(X(v), Math.min(Y(y0) + 13, H - 2), fx(+v.toFixed(6)), "middle", 10, "f-txt f-tick");
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) tk += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10, "f-txt f-tick");
    /* polys : surfaces colorées [[points [x, y]…], classe] (aires sous une courbe), dessinées sous les courbes */
    for (const [P, cls] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x) + "," + Y(Math.max(yr[0], Math.min(yr[1], y)))).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:0.7"/>`;
    const span = yr[1] - yr[0];
    for (const F of o.fns || []) {
      const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 360; let d = "", prev = null;
      for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
        if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
        d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
      if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    }
    for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
    for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
    for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
    for (const [cx, cy, r, cls] of o.circles || []) c += `<ellipse cx="${X(cx)}" cy="${Y(cy)}" rx="${(r * ux).toFixed(1)}" ry="${(r * uy).toFixed(1)}" class="${cls || "f-blue"}" fill="none" stroke-width="2.4"/>`;
    for (const [x1, y1, x2, y2, cls] of o.arrows || []) {
      const p = [X(x1), Y(y1)], q = [X(x2), Y(y2)], dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy);
      if (n < 1) continue; const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), b = [q[0] - ex * k, q[1] - ey * k];
      c += L(p[0], p[1], b[0].toFixed(1), b[1].toFixed(1), cls || "f-blue", 2.6) + `<polygon points="${q[0]},${q[1]} ${(b[0] - ey * 5).toFixed(1)},${(b[1] + ex * 5).toFixed(1)} ${(b[0] + ey * 5).toFixed(1)},${(b[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" || !cls ? "fill:var(--blue)" : ""}"/>`;
    }
    let p = "";
    for (const [x, y, lab, cls, pos] of o.pts || []) {
      if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
      p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
      if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
    }
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${tk}${p}`, o.lab || "repère");
  };

  // ---------- brique « hunt » (réponse tapée) ----------
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");

  // ---------- brique « slide » (curseurs) ----------
  // o = { ctl(step) → [{ k, lab, min, max, step }], init(step) → état, fig(st, step) → SVG, out(st, step) → texte,
  //       goal[step](st) → message ou "", miss(st, step) → indice (facultatif), ask[step] : { q, ans, tol, ok, no }, fmt(k, v, step), note }
  const slide = (o) => (box, onWin) => {
    let step = 0, st = null, asking = false;
    const start = () => {
      st = Object.assign({}, o.init(step)); asking = false;
      const cs = o.ctl(step);
      box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
        `<div class="act-out s2c-out" aria-live="polite"></div><div class="s2c-ask"></div><div class="small muted">${o.note || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
      box.querySelectorAll('input[type="range"]').forEach((inp) => {
        inp.oninput = () => { if (asking) { inp.value = st[inp.dataset.k]; return; } st[inp.dataset.k] = +inp.value; refresh(); };
        inp.onchange = () => { if (asking) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
      });
      refresh();
    };
    const refresh = () => {
      box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
      box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
      box.querySelector(".s2c-out").innerHTML = o.out(st, step);
    };
    const win = (mm) => { onWin(step, mm); step++; if (step < o.goal.length) start(); else { asking = true; box.querySelector(".s2c-ask").innerHTML = ""; } };
    const check = () => {
      if (asking || step >= o.goal.length) return;
      const mm = o.goal[step](st);
      if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
      const A = o.ask && o.ask[step];
      if (!A) { win(mm); return; }
      asking = true; const el = box.querySelector(".act-hint"); if (el) el.textContent = "";
      const ab = box.querySelector(".s2c-ask");
      ab.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${mm}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
      if (typeof typeset === "function" && /\\\(/.test(A.q)) typeset(ab);
      const inp = ab.querySelector("input"), go = () => { const v = parseNum(inp.value);
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        if (Math.abs(v - A.ans) <= (A.tol || 1e-9)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
      actAnswerBind(ab, go);
    };
    start();
  };


  // ---------- outils propres à ce fichier ----------
  // Fraction lisible (dénominateur ≤ 12), sinon décimal.
  const fr = (v) => { for (let d = 1; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? nb(n) : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; } return nb(v); };
  // Figure « tangente » : courbe de D.f, point (D.a ; f(D.a)) et droite de pente m (proposée) par ce point.
  // D = { f, a, m (pente juste), tol, xr, yr, gx, gy, lx, ly, lab (étiquette du point), txt (légende) }.
  const tanFig = (D, m) => {
    const fa = D.f(D.a), ok = m !== null && Math.abs(m - D.m) <= (D.tol || 1e-9);
    const o = { xr: D.xr, yr: D.yr, gx: D.gx, gy: D.gy, lx: D.lx, ly: D.ly, fns: [{ f: D.f }], pts: [[D.a, fa, D.lab || "", "f-dot", D.pos]], lab: "courbe et droite passant par un de ses points" };
    if (m !== null) o.fns.push({ f: (x) => m * (x - D.a) + fa, cls: ok ? "f-accent" : "f-line", w: 1.8 });
    const t = m === null ? '<span class="small">' + D.txt + "</span>" : "Droite de pente <b>" + nb(m) + "</b> : " + (ok ? '<b class="act-ok">elle frôle la courbe, c\'est la tangente</b>' : "ce n'est pas la tangente (pente " + (m > D.m ? "trop forte" : "trop faible") + ")");
    return graph(o) + plain(t);
  };
  // Surface entre f (haut) et g (bas) de a à b, pour o.polys.
  const shade = (f, g, a, b) => { const P = []; for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60; P.push([x, f(x)]); } for (let i = 60; i >= 0; i--) { const x = a + ((b - a) * i) / 60; P.push([x, g(x)]); } return P; };
  const z0 = () => 0;

  // =====================================================================================================
  // 3e Collège · Dérivation (ch3c_ana.js)
  // =====================================================================================================
  // nbderive (étape 2) : f(x) = 0,5x² − 1, droite par A(2 ; 1) ; elle recoupe la courbe en x = 2m − 2.
  const fq = (x) => 0.5 * x * x - 1;
  const DREF = [
    { f: (x) => x ** 3, a: 2, m: 12, xr: [-1, 3.2], yr: [-4, 28], gy: 2, ly: 8, lab: "(2 ; 8)", txt: "f(x) = x³ et son point d'abscisse 2" },
    { f: (x) => 1 / x, a: 2, m: -0.25, xr: [0, 5], yr: [-0.5, 4], lab: "(2 ; 0,5)", txt: "f(x) = 1/x et son point d'abscisse 2" },
    { f: (x) => Math.sqrt(x), a: 4, m: 0.25, xr: [0, 9], yr: [-0.5, 3.5], lab: "(4 ; 2)", txt: "f(x) = √x et son point d'abscisse 4" },
    { f: Math.sin, a: Math.PI / 3, m: 0.5, xr: [-0.5, 3.5], yr: [-1.5, 1.5], gx: 0.5, gy: 0.5, lx: 1, ly: 1, lab: "(π/3 ; √3/2)", txt: "f(x) = sin x et son point d'abscisse π/3 ≈ 1,05" },
  ];
  const DREG = [
    { f: (x) => 2 * x ** 3 - 5 * x * x + 4 * x - 7, a: 2, m: 8, xr: [-0.5, 3], yr: [-12, 6], gx: 0.5, lx: 1, gy: 2, ly: 4, lab: "(2 ; −3)", txt: "f(x) = 2x³ − 5x² + 4x − 7 et son point d'abscisse 2" },
    { f: (x) => (x + 1) * (x - 3), a: 4, m: 6, xr: [-2, 5.5], yr: [-5, 12], lab: "(4 ; 5)", txt: "f(x) = (x + 1)(x − 3) et son point d'abscisse 4" },
  ];
  const fh = (x) => x * x - 6 * x + 1;
  const regFig = (s, x) => {
    if (s < 2) return tanFig(DREG[s], x);
    const o = { xr: [-1, 7], yr: [-9, 8], fns: [{ f: fh }], pts: [], lab: "parabole et tangente au point choisi" };
    if (x === null) return graph(o) + plain('<span class="small">f(x) = x² − 6x + 1 : tape une abscisse, on trace la tangente en ce point</span>');
    const m = 2 * x - 6; o.fns.push({ f: (t) => m * (t - x) + fh(x), cls: m === 0 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([x, fh(x), "", "f-dot"]);
    return graph(o) + plain("Tangente en x = " + nb(x) + " : pente f'(" + nb(x) + ") = <b>" + nb(m) + "</b>" + (m === 0 ? ' : <b class="act-ok">horizontale</b>' : ""));
  };
  const DPQ = [
    { f: (x) => x * x * (3 * x + 1), a: 1, m: 11, xr: [-1.5, 2], yr: [-2, 12], gx: 0.5, lx: 1, gy: 1, ly: 2, lab: "(1 ; 4)", txt: "f(x) = x²(3x + 1) et son point d'abscisse 1" },
    { f: (x) => (2 * x + 1) / (x - 1), a: 3, m: -0.75, xr: [0, 7], yr: [-2, 10], lab: "(3 ; 3,5)", txt: "f(x) = (2x + 1) ÷ (x − 1) et son point d'abscisse 3" },
    { f: (x) => 1 / (x * x + 1), a: 1, m: -0.5, xr: [-3, 3], yr: [-0.25, 1.25], gx: 0.5, lx: 1, gy: 0.25, ly: 0.5, lab: "(1 ; 0,5)", txt: "f(x) = 1 ÷ (x² + 1) et son point d'abscisse 1" },
  ];
  // derivcomp : chaîne x → intérieur u → extérieur f, avec les valeurs.
  const DCH = [
    ["x = 4", "u = 2x − 5 = 3", "f = u³ = 27"],
    ["x = 2", "u = 2x + 5 = 9", "f = √u = 3"],
    ["x = π/4", "u = 2x = π/2", "f = cos u = 0"],
    ["x = 1", "u = x² + 1 = 2", "f = u³ = 8"],
  ];
  const chain = (s) => {
    const B = DCH[s], xs = [4, 108, 216], w = [84, 100, 100];
    let g = T(xs[1] + 50, 14, "intérieur", "middle", 11) + T(xs[2] + 50, 14, "extérieur", "middle", 11);
    B.forEach((t, i) => { g += `<rect x="${xs[i]}" y="22" width="${w[i]}" height="34" rx="8" class="${i ? "f-fill2" : "f-soft"}"/>` + T(xs[i] + w[i] / 2, 44, t, "middle", 12); });
    g += L(xs[0] + w[0] + 2, 39, xs[1] - 4, 39, "f-line", 1.6) + L(xs[1] + w[1] + 2, 39, xs[2] - 4, 39, "f-line", 1.6);
    return svg(320, 62, g, "chaîne de calcul : x, puis l'intérieur u, puis l'extérieur f");
  };
  // optimderiv : enclos le long d'une rivière (étape 1), boîte (étape 2).
  const enclos = (x) => {
    const k = 7, Lg = 40 - 2 * x, x0 = 160 - (Lg * k) / 2;
    let g = `<rect x="0" y="4" width="320" height="14" class="f-fill2"/>` + T(160, 15, "rivière", "middle", 10);
    g += `<rect x="${x0}" y="18" width="${Lg * k}" height="${x * k}" class="f-soft"/>` + `<path d="M${x0},18 V${18 + x * k} H${x0 + Lg * k} V18" class="f-line" fill="none" stroke-width="2.4"/>`;
    g += T(160, 18 + x * k + 14, nb(Lg) + " m", "middle", 11) + T(x0 - 4, 18 + (x * k) / 2 + 4, nb(x) + " m", "end", 11);
    return svg(320, 18 + 19 * k + 20, g, "enclos rectangulaire le long d'une rivière");
  };

  Object.assign(ACTIVE, {
    tauxvar: {
      predict: { q: "À 8 h, il fait 4 °C ; à 14 h, il fait 19 °C. En moyenne, la température a monté de…", choices: ["2,5 °C par heure", "15 °C par heure", "3,2 °C par heure"], good: 0,
        why: "Elle a monté de 19 − 4 = 15 °C en 14 − 8 = 6 heures : 15 ÷ 6 = 2,5 °C par heure. C'est un taux de variation moyen." },
      defis: ["f(x) = x². Le point A est fixé en x = 1. Déplace B pour que le taux de variation moyen de f entre 1 et b vaille 5.", "Même fonction : règle b pour que le taux de variation moyen vaille −1."],
      play: slide({
        ctl: () => [{ k: "b", lab: "Abscisse b du point B", min: -3, max: 5, step: 0.5 }],
        init: (s) => ({ b: s ? 3 : 2.5 }),
        fig: (st) => { const b = st.b, o = { xr: [-3.5, 5.5], yr: [-2, 26], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [[1, 1, "A", "f-dot", "b"], [b, b * b, "B", "f-dot", b < 1 ? "l" : "r"]], lab: "parabole et sécante AB" };
          if (b !== 1) { o.fns.push({ f: (x) => (b + 1) * (x - 1) + 1, cls: "f-accent", w: 1.8 }); o.segs = [[1, 1, b, 1, "f-line", 1.2, "4 3"], [b, 1, b, b * b, "f-line", 1.2, "4 3"]]; }
          return graph(o); },
        out: (st) => (st.b === 1 ? "B est sur A : pas de sécante, on ne peut pas diviser par b − 1 = 0." : "Taux = (f(" + nb(st.b) + ") − f(1)) ÷ (" + nb(st.b) + " − 1) = " + nb(st.b * st.b - 1) + " ÷ " + nb(st.b - 1) + " = <b>" + nb(st.b + 1) + "</b><br><span class=\"small\">c'est la pente de la sécante AB (en rouge)</span>"),
        goal: [(st) => (st.b === 4 ? "Entre 1 et 4 : (16 − 1) ÷ (4 − 1) = 15 ÷ 3 = 5. La sécante AB monte de 5 par unité." : ""),
          (st) => (st.b === -2 ? "Entre 1 et −2 : (4 − 1) ÷ (−2 − 1) = 3 ÷ (−3) = −1. Taux négatif : la sécante descend. On garde le même ordre en haut et en bas." : "")],
        miss: (st, s) => (st.b === 1 ? "" : st.b + 1 < [5, -1][s] ? "Pente trop faible : déplace B vers la droite." : "Pente trop forte : déplace B vers la gauche."),
        ask: [null, { q: "Une voiture a parcouru s(t) = 2t² mètres après t secondes. Quelle est sa vitesse moyenne (en m/s) entre t = 1 s et t = 4 s ?", ans: 10, ok: "(s(4) − s(1)) ÷ (4 − 1) = (32 − 2) ÷ 3 = 10 m/s : une vitesse moyenne est un taux de variation moyen.", no: "Calcule s(4) et s(1), puis divise la différence par la durée 4 − 1." }] }),
    },
    nbderive: {
      predict: { q: "f(x) = x². Entre 3 et 3,1, le taux de variation moyen vaut 6,1 ; entre 3 et 3,01, il vaut 6,01. De quel nombre s'approche-t-il ?", choices: ["6", "9", "0"], good: 0,
        why: "Entre 3 et 3 + h, il vaut 6 + h : quand h devient minuscule, il s'approche de 6. C'est le nombre dérivé f'(3). (9 = f(3) est une hauteur, pas une pente.)" },
      defis: ["f(x) = x², A d'abscisse 3. Rapproche B de A : rends l'écart h le plus petit possible (sans 0).", "f(x) = 0,5x² − 1. Fais pivoter la droite autour de A(2 ; 1) jusqu'à ce qu'elle ne touche plus la courbe qu'en A."],
      play: slide({
        ctl: (s) => [s ? { k: "m", lab: "Pente de la droite", min: -2, max: 6, step: 0.5 } : { k: "h", lab: "Écart h entre A et B", min: -2, max: 2, step: 0.25 }],
        init: (s) => (s ? { m: 0 } : { h: 2 }),
        fig: (st, s) => {
          if (!s) { const h = st.h, o = { xr: [-0.5, 5.5], yr: [-1, 27], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [[3, 9, "A", "f-dot", "l"], [3 + h, (3 + h) ** 2, h ? "B" : "", "f-dot", "r"]], lab: "parabole, sécante AB" };
            if (h) o.fns.push({ f: (x) => (6 + h) * (x - 3) + 9, cls: "f-accent", w: 1.8 });
            return graph(o); }
          const m = st.m, o = { xr: [-3, 6], yr: [-3, 10], fns: [{ f: fq }, { f: (x) => m * (x - 2) + 1, cls: m === 2 ? "f-accent" : "f-line", w: 1.8 }], pts: [[2, 1, "A", "f-dot", "r"]], lab: "parabole et droite pivotant autour de A" };
          if (m !== 2) o.pts.push([2 * m - 2, fq(2 * m - 2), "", "f-fill2"]);
          return graph(o); },
        out: (st, s) => (!s ? (st.h === 0 ? "h = 0 : B est sur A, le quotient n'a plus de sens (0 ÷ 0). On s'approche sans y aller." : "(f(3 + h) − f(3)) ÷ h = (6h + h²) ÷ h = 6 + h = <b>" + nb(6 + st.h) + "</b>")
          : st.m === 2 ? 'Pente 2 : <b class="act-ok">la droite ne touche la courbe qu\'en A</b>' : "Pente " + nb(st.m) + " : la droite recoupe la courbe en x = " + nb(2 * st.m - 2)),
        goal: [(st) => (Math.abs(st.h) === 0.25 ? "Avec h = " + nb(st.h) + ", le taux vaut " + nb(6 + st.h) + " : plus h est petit, plus on s'approche de 6. Cette limite est le nombre dérivé f'(3)." : ""),
          (st) => (st.m === 2 ? "La tangente en A a une pente de 2 : f'(2) = 2. Le nombre dérivé est la pente de la tangente." : "")],
        miss: (st, s) => (s ? "La droite coupe encore la courbe en un 2e point (point clair) : continue à pivoter." : "Rapproche B de A : rends h le plus petit possible, sans 0."),
        ask: [{ q: "Que vaut alors f'(3) pour f(x) = x² ?", ans: 6, ok: "6 + h tend vers 6 quand h tend vers 0 : f'(3) = 6, la pente de la tangente en 3.", no: "Le taux vaut 6 + h : que devient-il quand h devient très petit ?" },
          { q: "Une pierre tombe : elle a parcouru s(t) = 5t² mètres après t secondes. Sa vitesse instantanée (en m/s) à t = 2 s ?", ans: 20, ok: "(s(2 + h) − s(2)) ÷ h = (20h + 5h²) ÷ h = 20 + 5h, qui tend vers 20, donc s'(2) = 20 m/s.", no: "Calcule (s(2 + h) − s(2)) ÷ h, simplifie par h, puis fais tendre h vers 0." }] }),
    },
    derivref: {
      /* 24.11 : (cos x)' = −sin x en défi court */
      plus: [{ d: "\\(f(x) = \\cos x\\) (x en radians). Tape \\(f'\\left(\\frac{\\pi}{2}\\right)\\).", ans: -1, ok: "(cos x)' = −sin x, donc f'(π/2) = −sin(π/2) = −1 : la courbe du cosinus descend en π/2.", no: "La dérivée de cos x est −sin x : attention au signe −." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((x^n)' = n x^{n - 1}\\), aussi pour un exposant négatif ou fractionnaire. Ainsi \\(\\left(\\frac{1}{x}\\right)' = (x^{-1})' = -\\frac{1}{x^2}\\) et \\((\\sqrt{x})' = \\left(x^{\\frac{1}{2}}\\right)' = \\frac{1}{2\\sqrt{x}}\\). En radians : \\((\\sin x)' = \\cos x\\) et \\((\\cos x)' = -\\sin x\\). \\(f'(a)\\) est la pente de la tangente au point d'abscisse \\(a\\).", exemple: ["\\((x^3)' = 3x^2\\), donc la pente en 2 vaut \\(3 \\cdot 4 = 12\\).", "\\(\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}\\), donc \\(f'(2) = -\\frac{1}{4}\\).", "\\((\\sin x)' = \\cos x\\), donc \\(f'\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}\\).", "\\((\\cos x)' = -\\sin x\\), donc \\(f'\\left(\\frac{\\pi}{2}\\right) = -1\\)."], piege: "Racines et inverses : écris d'abord une puissance de \\(x\\) (\\(\\sqrt{x} = x^{\\frac{1}{2}}\\), \\(\\frac{1}{x} = x^{-1}\\)), puis applique la règle." },
      predict: { q: "La dérivée de x² est 2x. Quelle est celle de x³ ?", choices: ["3x²", "2x³", "3x³"], good: 0,
        why: "On descend l'exposant devant et on le diminue de 1 : (x³)' = 3x². Règle générale : (xⁿ)' = n·xⁿ⁻¹. Une constante a pour dérivée 0." },
      defis: ["f(x) = x³. Tape la pente de la tangente au point d'abscisse 2, c'est-à-dire f'(2).", "f(x) = 1/x = x⁻¹. Tape f'(2).", "f(x) = √x = x^(1/2). Tape f'(4).", "f(x) = sin x (x en radians). Tape f'(π/3)."],
      play: hunt({ ask: true, label: "Pente de la tangente", blank: (s) => tanFig(DREF[s], null), show: (x, s) => tanFig(DREF[s], x),
        miss: (x, s) => ["(xⁿ)' = n·xⁿ⁻¹ : ici n = 3, puis remplace x par 2.", "Applique (xⁿ)' = n·xⁿ⁻¹ avec n = −1 : f'(x) = −x⁻² = −1/x².", "x^(1/2) se dérive en (1/2)·x^(−1/2) = 1/(2√x).", "La dérivée de sin x est cos x : calcule cos(π/3)."][s],
        wins: [W(12, "f'(x) = 3x², donc f'(2) = 3 · 4 = 12."), W(-0.25, "(x⁻¹)' = −x⁻² = −1/x², donc f'(2) = −1/4 : la courbe descend."), W(0.25, "(√x)' = 1/(2√x), donc f'(4) = 1/(2 · 2) = 1/4."), W(0.5, "(sin x)' = cos x, donc f'(π/3) = cos(π/3) = 1/2. De même, (cos x)' = −sin x.")] }),
    },
    derivregles: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((u + v)' = u' + v'\\) et \\((k u)' = k u'\\). Pour un polynôme, chaque terme \\(a x^n\\) devient \\(n a x^{n - 1}\\) et la constante disparaît. Un produit peut d'abord être développé. La tangente est horizontale là où \\(f'(x) = 0\\)." },
      predict: { q: "Quelle est la dérivée de x³ + x² ?", choices: ["3x² + 2x", "6x", "3x² · 2x"], good: 0,
        why: "On dérive terme par terme : (x³)' + (x²)' = 3x² + 2x. La dérivée d'une somme est la somme des dérivées." },
      defis: ["f(x) = 2x³ − 5x² + 4x − 7. Tape la pente de la tangente en x = 2, c'est-à-dire f'(2).", "f(x) = (x + 1)(x − 3). Développe, puis tape f'(4).", "f(x) = x² − 6x + 1. En quelle abscisse la tangente est-elle horizontale ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => regFig(s, null), show: (x, s) => regFig(s, x),
        miss: (x, s) => ["Chaque terme a·xⁿ devient n·a·xⁿ⁻¹, la constante disparaît : f'(x) = 6x² − 10x + 4.", "Développe d'abord : x² − 2x − 3.", "Tangente horizontale : f'(x) = 0, avec f'(x) = 2x − 6."][s],
        wins: [W(8, "f'(x) = 6x² − 10x + 4 (le −7 disparaît), donc f'(2) = 24 − 20 + 4 = 8."), W(6, "(x + 1)(x − 3) = x² − 2x − 3, donc f'(x) = 2x − 2 et f'(4) = 6. (Le produit des dérivées, 1 · 1 = 1, serait faux.)"), W(3, "f'(x) = 2x − 6 = 0 pour x = 3 : la tangente est horizontale au sommet (3 ; −8).")] }),
    },
    derivprodquot: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((uv)' = u'v + uv'\\). \\(\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}\\) (là où \\(v \\neq 0\\)) ; cas particulier \\(\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}\\)." },
      predict: { q: "Vrai ou faux : la dérivée de x · x est (x)' · (x)' = 1 · 1 = 1.", choices: ["Vrai", "Faux"], good: 1,
        why: "Faux : x · x = x², dont la dérivée est 2x. La dérivée d'un produit n'est pas le produit des dérivées : (uv)' = u'v + uv' = 1 · x + x · 1 = 2x." },
      defis: ["f(x) = x²(3x + 1). Avec (uv)' = u'v + uv', tape f'(1).", "f(x) = (2x + 1) ÷ (x − 1). Avec (u/v)' = (u'v − uv') ÷ v², tape f'(3).", "f(x) = 1 ÷ (x² + 1). Avec (1/v)' = −v' ÷ v², tape f'(1)."],
      play: hunt({ ask: true, label: "Pente de la tangente", blank: (s) => tanFig(DPQ[s], null), show: (x, s) => tanFig(DPQ[s], x),
        miss: (x, s) => ["u = x², u' = 2x ; v = 3x + 1, v' = 3 : calcule u'v + uv' en x = 1.", "u'v − uv' = 2(x − 1) − (2x + 1) · 1 : le second produit se soustrait en entier.", "v = x² + 1 : v(1) = 2 et v'(1) = 2."][s],
        wins: [W(11, "f'(x) = 2x(3x + 1) + x² · 3 = 9x² + 2x, donc f'(1) = 11."), W(-0.75, "f'(x) = (2(x − 1) − (2x + 1)) ÷ (x − 1)² = −3 ÷ (x − 1)², donc f'(3) = −3/4."), W(-0.5, "f'(x) = −2x ÷ (x² + 1)², donc f'(1) = −2/4 = −1/2.")] }),
    },
    derivcomp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((f(u(x)))' = f'(u(x)) \\cdot u'(x)\\) : on dérive l'extérieur en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur. Cas fréquents : \\((u^n)' = n u^{n - 1} u'\\), \\((\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}}\\), \\((\\cos u)' = -u' \\sin u\\).", exemple: ["\\(\\left((x^2 + 1)^3\\right)' = 3(x^2 + 1)^2 \\cdot 2x = 6x(x^2 + 1)^2\\)", "\\((\\cos(2x))' = -2\\sin(2x)\\)", "\\(\\left(\\sqrt{2x + 5}\\right)' = \\frac{2}{2\\sqrt{2x + 5}} = \\frac{1}{\\sqrt{2x + 5}}\\)"] },
      predict: { q: "Pour dériver (3x + 1)⁵, on écrit 5(3x + 1)⁴, puis…", choices: ["on multiplie par 3", "c'est fini", "on ajoute 3"], good: 0,
        why: "On dérive l'extérieur (la puissance 5) en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur, 3 : 15(3x + 1)⁴." },
      defis: ["f(x) = (2x − 5)³. Tape f'(4).", "f(x) = √(2x + 5). Tape f'(2).", "f(x) = cos(2x). Tape f'(π/4).", "f(x) = (x² + 1)³. Tape f'(1)."],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => chain(s), show: (x, s) => chain(s) + plain(tu(x)),
        miss: (x, s) => ["(u³)' = 3u² · u' : n'oublie pas le facteur u' = 2.", "(√u)' = u' ÷ (2√u), avec u = 9 et u' = 2.", "(cos u)' = −u' · sin u, avec u = π/2 et u' = 2.", "3u² · u', avec u = 2 et u' = 2x = 2."][s],
        wins: [W(54, "Extérieur dérivé : 3u² = 3 · 3² = 27 ; intérieur : u' = 2. f'(4) = 27 · 2 = 54."), W(1 / 3, "(√u)' = u' ÷ (2√u) = 2 ÷ (2 · 3) = 1/3."), W(-2, "(cos u)' = −u' · sin u = −2 · sin(π/2) = −2."), W(24, "f'(x) = 3(x² + 1)² · 2x, donc f'(1) = 3 · 4 · 2 = 24.")] }),
    },
    tangente: {
      predict: { q: "f(3) = 9 et f'(3) = 6. La tangente au point d'abscisse 3 a pour pente…", choices: ["6", "9", "3"], good: 0,
        why: "La pente de la tangente est le nombre dérivé f'(3) = 6 ; elle passe par le point (3 ; 9)." },
      defis: ["Règle m et p pour que la droite y = mx + p soit la tangente à f(x) = x² au point d'abscisse 3.", "Même parabole : déplace le point de contact a pour que la tangente passe par P(0 ; −4)."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "Abscisse a du point de contact", min: -3, max: 3, step: 0.5 }] : [{ k: "m", lab: "Pente m", min: 0, max: 8 }, { k: "p", lab: "Ordonnée à l'origine p", min: -12, max: 0 }]),
        init: (s) => (s ? { a: 1 } : { m: 2, p: 0 }),
        fig: (st, s) => {
          const o = { xr: [-3.5, 5], yr: [-12, 20], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [], lab: "parabole y = x² et une droite" };
          if (!s) { o.fns.push({ f: (x) => st.m * x + st.p, cls: st.m === 6 && st.p === -9 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([3, 9, "(3 ; 9)", "f-dot", "l"]); }
          else { const a = st.a; o.fns.push({ f: (x) => 2 * a * x - a * a, cls: a * a === 4 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([a, a * a, "", "f-dot"], [0, -4, "P", "f-fill2", "r"]); }
          return graph(o); },
        out: (st, s) => { if (s) { const a = st.a; return "Tangente en a = " + nb(a) + " : pente 2a = " + nb(2 * a) + ", y = " + nb(2 * a) + "x − " + nb(a * a) + "<br><span class=\"small\">ordonnée à l'origine : −a² = " + nb(-a * a) + "</span>"; }
          return "y = " + (st.m ? nb(st.m) + "x" : "") + (st.p < 0 ? " − " + nb(-st.p) : st.m ? "" : "0") + " ; en x = 3 : " + nb(3 * st.m + st.p) + (3 * st.m + st.p === 9 ? " (passe par le point)" : " (on veut 9)"); },
        goal: [(st) => (st.m === 6 && st.p === -9 ? "y = 6x − 9 : pente f'(3) = 6, et 6 · 3 − 9 = 9. C'est y = f'(3)(x − 3) + f(3) développé." : ""),
          (st) => (st.a * st.a === 4 ? "Avec a = " + nb(st.a) + ", la tangente y = " + nb(2 * st.a) + "x − 4 passe par (0 ; −4). Il y a deux tangentes par P : en a = 2 et en a = −2." : "")],
        miss: (st, s) => (s ? "L'ordonnée à l'origine de la tangente est −a² : on veut −4." : st.m === 6 ? "Bonne pente f'(3) = 6. Règle p pour que la droite passe par (3 ; 9) : 6 · 3 + p = 9." : 3 * st.m + st.p === 9 ? "La droite passe par (3 ; 9), mais sa pente n'est pas f'(3) : f'(x) = 2x." : ""),
        ask: [{ q: "La tangente à f(x) = √x en 100 a pour pente f'(100) = 1/20. Donne une valeur approchée de √104 avec cette tangente.", ans: 10.2, tol: 1e-6, ok: "√104 ≈ f(100) + f'(100) · 4 = 10 + 4/20 = 10,2 (la calculatrice donne 10,198…) : c'est l'approximation affine.", no: "f(100) = 10 : avance de 4 le long de la tangente, de pente 1/20." }, null] }),
    },
    variations: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Sur un intervalle, si \\(f' > 0\\), \\(f\\) est croissante ; si \\(f' < 0\\), décroissante. Méthode : calculer \\(f'(x)\\), trouver ses zéros, regarder le signe de \\(f'\\) de part et d'autre. Si \\(f'\\) passe de + à − en \\(a\\), \\(f(a)\\) est un maximum local ; de − à +, un minimum local." },
      predict: { q: "Sur un intervalle, f'(x) > 0. Alors f est…", choices: ["croissante", "positive", "décroissante"], good: 0,
        why: "Le signe de la dérivée donne le sens de variation : f' > 0, la courbe monte. (Une fonction peut être négative et croissante.)" },
      defis: ["f(x) = x³ − 3x. Déplace le point jusqu'au maximum local : tangente horizontale, et f' passe de + à −.", "f(x) = x³. Place le point là où f'(x) = 0. Est-ce un extremum ?"],
      play: slide({
        ctl: () => [{ k: "x", lab: "Abscisse du point", min: -2.5, max: 2.5, step: 0.25 }],
        init: (s) => (s ? { x: 1.5 } : { x: 2 }),
        fig: (st, s) => { const f = s ? (t) => t ** 3 : (t) => t ** 3 - 3 * t, d = s ? 3 * st.x * st.x : 3 * st.x * st.x - 3, x = st.x;
          return graph({ xr: [-2.6, 2.6], yr: s ? [-16, 16] : [-9, 9], gx: 0.5, lx: 1, gy: s ? 4 : 2, ly: s ? 8 : 4, fns: [{ f }], segs: [[x - 0.6, f(x) - 0.6 * d, x + 0.6, f(x) + 0.6 * d, d > 0 ? "f-blue" : d < 0 ? "f-accent" : "f-line", 3]], pts: [[x, f(x), "", "f-dot"]], lab: "courbe et tangente au point choisi" }); },
        out: (st, s) => { const d = s ? 3 * st.x * st.x : 3 * st.x * st.x - 3; return "f'(" + nb(st.x) + ") = <b>" + nb(d) + "</b>" + (d > 0 ? " > 0 : f monte" : d < 0 ? " < 0 : f descend" : " : tangente horizontale"); },
        goal: [(st) => (st.x === -1 ? "En −1, f' passe de + à − : f(−1) = −1 + 3 = 2 est un maximum local. f'(x) = 3(x − 1)(x + 1)." : ""),
          (st) => (st.x === 0 ? "f'(0) = 0, mais f'(x) = 3x² est positive des deux côtés : pas de changement de signe, donc pas d'extremum en 0." : "")],
        miss: (st, s) => (!s && st.x === 1 ? "Tangente horizontale, mais f' passe de − à + : c'est un minimum. Cherche le maximum." : ""),
        ask: [{ q: "Pour f(x) = x³ − 3x, quelle est la valeur du minimum local ?", ans: -2, ok: "f' passe de − à + en x = 1 : minimum local f(1) = 1 − 3 = −2. L'extremum est la valeur f(1), pas l'abscisse 1.", no: "Le minimum local est en x = 1 : calcule f(1)." },
          { q: "g(x) = x³ − 3x² − 9x + 2. Quelle est la valeur du minimum local de g ?", ans: -25, ok: "g'(x) = 3x² − 6x − 9 = 3(x + 1)(x − 3) passe de − à + en 3, d'où le minimum g(3) = 27 − 27 − 27 + 2 = −25.", no: "g'(x) = 3(x + 1)(x − 3) : le minimum est en x = 3, calcule g(3)." }] }),
    },
    optimderiv: {
      predict: { q: "Avec 40 m de clôture le long d'une rivière (trois côtés à clôturer), quel enclos a la plus grande aire ?", choices: ["10 m × 20 m", "13 m × 14 m", "5 m × 30 m"], good: 0,
        why: "Les trois utilisent 40 m (2 · 10 + 20, 2 · 13 + 14, 2 · 5 + 30). Aires : 200 m², 182 m², 150 m². A(x) = x(40 − 2x) est maximale pour x = 10." },
      defis: ["Enclos le long d'une rivière : 40 m de clôture pour les trois autres côtés. Règle la largeur x pour que l'aire soit maximale.", "Boîte sans couvercle : dans une feuille de 30 cm × 30 cm, on découpe un carré de côté x à chaque coin. Règle x pour que le volume soit maximal."],
      play: slide({
        ctl: (s) => [s ? { k: "x", lab: "Côté x des carrés découpés (cm)", min: 0.5, max: 14.5, step: 0.5 } : { k: "x", lab: "Largeur x (m)", min: 1, max: 19 }],
        init: (s) => ({ x: s ? 2 : 4 }),
        fig: (st, s) => { const x = st.x;
          if (!s) return enclos(x);
          return graph({ xr: [0, 15], yr: [0, 2200], pad: 26, gy: 200, ly: 1000, lx: 5, fns: [{ f: (t) => t * (30 - 2 * t) ** 2 }], segs: [[x, 0, x, x * (30 - 2 * x) ** 2, "f-line", 1.2, "4 3"]], pts: [[x, x * (30 - 2 * x) ** 2, "", "f-dot"]], fy: (v) => mil(v, 0), lab: "volume de la boîte selon x" }); },
        out: (st, s) => (s ? "V(x) = x(30 − 2x)² = " + nb(st.x) + " · " + nb(30 - 2 * st.x) + "² = <b>" + mil(st.x * (30 - 2 * st.x) ** 2, 1) + " cm³</b>" : "A(x) = x(40 − 2x) = " + st.x + " · " + (40 - 2 * st.x) + " = <b>" + st.x * (40 - 2 * st.x) + " m²</b>"),
        goal: [(st) => (st.x === 10 ? "x = 10 m : A'(x) = 40 − 4x = 0 pour x = 10. Aire maximale 10 · 20 = 200 m²." : ""),
          (st) => (st.x === 5 ? "x = 5 cm : V'(x) = (30 − 2x)(30 − 6x) = 0 pour x = 5 (x = 15 ne donne pas de boîte). Volume maximal 5 · 20² = 2'000 cm³." : "")],
        miss: (st, s) => (s ? (st.x < 5 ? "Le volume augmente encore : avance." : "Le volume diminue : recule.") : st.x < 10 ? "L'aire augmente encore : élargis." : "L'aire diminue : rétrécis."),
        ask: [{ q: "Même enclos, mais avec 60 m de clôture : quelle largeur x (en m) donne l'aire maximale ?", ans: 15, ok: "A(x) = x(60 − 2x), A'(x) = 60 − 4x = 0 pour x = 15 m (aire 15 · 30 = 450 m²).", no: "Écris A(x) = x(60 − 2x), dérive, puis résous A'(x) = 0." },
          { q: "Même boîte dans une feuille de 24 cm × 24 cm : quel x (en cm) donne le volume maximal ?", ans: 4, ok: "V'(x) = (24 − 2x)(24 − 6x) s'annule en 4 et en 12 ; seul x = 4 donne une boîte. Volume 4 · 16² = 1'024 cm³.", no: "V(x) = x(24 − 2x)², et V'(x) = (24 − 2x)(24 − 6x)." }] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Intégration, ln et exp (ch4c_ana.js)
  // =====================================================================================================
  const E = Math.E;
  // lnexp : quatre figures (équation, deux tangentes, lecture de ln).
  const LNT = [
    null,
    { f: (x) => x * Math.log(x), a: E * E, m: 3, xr: [0, 10], yr: [-2, 24], gy: 2, ly: 4, lab: "(e² ; 2e²)", txt: "f(x) = x · ln x et son point d'abscisse e² ≈ 7,39" },
    { f: (x) => Math.exp(x * x), a: 1, m: 2 * E, tol: 0.006, xr: [-1.6, 1.8], yr: [-1, 12], gx: 0.5, lx: 1, lab: "(1 ; e)", txt: "f(x) = e^(x²) et son point d'abscisse 1" },
  ];
  const lnFig = (s, x) => {
    if (s === 0) { const g = (t) => Math.exp(2 * t - 1), o = { xr: [-1, 2.5], yr: [-1, 12], gx: 0.5, lx: 1, fns: [{ f: g }], hl: [[5, "f-accent"]], pts: [], lab: "courbe y = e^(2x − 1) et droite y = 5" };
      if (x !== null) o.pts.push([x, g(x), "", "f-dot"]);
      return graph(o) + plain(x === null ? '<span class="small">en bleu y = e^(2x − 1), en rouge la hauteur 5</span>' : "e^(2 · " + nb(x) + " − 1) ≈ <b>" + nb(+g(x).toFixed(3)) + "</b> (on veut 5)"); }
    if (s < 3) return tanFig(LNT[s], x);
    const o = { xr: [0, 60], yr: [-1, 5], gx: 10, lx: 20, fns: [{ f: Math.log }], pts: [[E ** 4, Math.log(E ** 4), "", "f-fill2"]], lab: "courbe y = ln x" };
    if (x !== null) o.pts.push([E ** 4, x, "", "f-dot"]);
    return graph(o) + plain(x === null ? '<span class="small">courbe y = ln x ; le point clair est en x = e⁴ ≈ 54,6</span>' : "Tu proposes ln(e⁴) = <b>" + nb(x) + "</b> : " + (x === 4 ? '<b class="act-ok">le point est sur la courbe</b>' : "le point n'est pas sur la courbe"));
  };

  Object.assign(ACTIVE, {
    primitives: {
      /* 24.11 : sin → −cos et 1/x² → −1/x en défis courts */
      plus: [{ d: "\\(f(x) = \\sin x\\) a pour primitives \\(F(x) = -\\cos x + C\\). Que vaut \\(C\\) si \\(F(0) = 3\\) ?", ans: 4, ok: "(−cos x)' = sin x. F(0) = −cos 0 + C = −1 + C = 3, donc C = 4.", no: "cos 0 = 1 : F(0) = −1 + C." },
        { d: "\\(f(x) = \\frac{1}{x^2}\\) a pour primitives \\(F(x) = -\\frac{1}{x} + C\\). Que vaut \\(C\\) si \\(F(1) = 2\\) ?", ans: 3, ok: "(−1/x)' = 1/x². F(1) = −1 + C = 2, donc C = 3.", no: "F(1) = −1/1 + C." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(F\\) est une primitive de \\(f\\) si \\(F'(x) = f(x)\\). On primitive terme à terme : \\(x^n \\to \\frac{x^{n + 1}}{n + 1}\\), \\(\\cos x \\to \\sin x\\), \\(\\sin x \\to -\\cos x\\), \\(\\frac{1}{x^2} \\to -\\frac{1}{x}\\). Toutes les primitives diffèrent d'une constante \\(C\\) ; une condition (\\(F(a) = b\\)) la fixe." },
      predict: { q: "Quelle fonction a pour dérivée 2x ?", choices: ["x²", "2", "2x²"], good: 0,
        why: "(x²)' = 2x : x² est une primitive de 2x. Mais x² + 3 aussi ! Toutes les primitives diffèrent d'une constante." },
      defis: ["f(x) = 6x² − 4x + 1 a pour primitives F(x) = 2x³ − 2x² + x + C. Règle C pour que F(1) = 5.", "f(x) = cos x a pour primitives F(x) = sin x + C. Règle C pour que F(π/2) = −1."],
      play: slide({
        ctl: (s) => [s ? { k: "C", lab: "Constante C", min: -4, max: 4, step: 0.5 } : { k: "C", lab: "Constante C", min: -6, max: 6 }],
        init: (s) => ({ C: s ? 1 : 0 }),
        fig: (st, s) => { const F = s ? (x) => Math.sin(x) : (x) => 2 * x ** 3 - 2 * x * x + x, P = s ? [Math.PI / 2, -1] : [1, 5], o = s ? { xr: [-1, 6.5], yr: [-5, 5] } : { xr: [-1.5, 2.2], yr: [-8, 10], gx: 0.5, lx: 1, gy: 2, ly: 4 };
          o.fns = [-2, 2].map((d) => ({ f: (x) => F(x) + st.C + d, cls: "f-line", w: 1, dash: true })).concat([{ f: (x) => F(x) + st.C }]);
          o.pts = [[P[0], P[1], s ? "(π/2 ; −1)" : "(1 ; 5)", "f-fill2", "r"]]; o.lab = "primitives de f, décalées verticalement";
          return graph(o) + plain('<span class="small">en bleu F avec ta constante C ; en pointillés : d\'autres primitives (C ± 2)</span>'); },
        out: (st, s) => (s ? "F(π/2) = sin(π/2) + C = 1 + " + par(st.C) + " = <b>" + nb(1 + st.C) + "</b> (on veut −1)" : "F(1) = 2 − 2 + 1 + C = 1 + " + par(st.C) + " = <b>" + nb(1 + st.C) + "</b> (on veut 5)"),
        goal: [(st) => (st.C === 4 ? "F(x) = 2x³ − 2x² + x + 4 : F(1) = 1 + 4 = 5. Toutes les primitives ne diffèrent que de C ; la condition F(1) = 5 la fixe." : ""),
          (st) => (st.C === -2 ? "F(x) = sin x − 2 : F(π/2) = 1 − 2 = −1. Une primitive de cos x est sin x ; une primitive de sin x est −cos x." : "")],
        miss: (st, s) => (1 + st.C < (s ? -1 : 5) ? "La courbe passe sous le point : augmente C." : "La courbe passe au-dessus du point : diminue C."),
        ask: [{ q: "f(x) = 3x² − 4x. Sa primitive F vérifie F(0) = 5. Calcule F(3).", ans: 14, ok: "F(x) = x³ − 2x² + 5, donc F(3) = 27 − 18 + 5 = 14. Vérification : F'(x) = 3x² − 4x.", no: "Une primitive de 3x² est x³, de −4x c'est −2x² ; puis F(0) = C = 5." },
          { q: "Une primitive de (2x + 1)³ s'écrit (2x + 1)⁴ ÷ k. Que vaut k ?", ans: 8, ok: "La dérivée de (2x + 1)⁴ est 4 · 2 · (2x + 1)³ = 8(2x + 1)³ : il faut diviser par k = 8 (par 4 et par 2).", no: "Dérive (2x + 1)⁴ : 4(2x + 1)³ · 2. Par quoi faut-il diviser pour retrouver (2x + 1)³ ?" }] }),
    },
    integrale: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Théorème fondamental : \\(\\int_a^b f(x)\\,dx = F(b) - F(a)\\) où \\(F\\) est une primitive de \\(f\\). Si \\(f \\geq 0\\), c'est l'aire sous la courbe ; les parties sous l'axe comptent négativement. Valeur moyenne : \\(\\frac{1}{b - a}\\int_a^b f(x)\\,dx\\). Relation de Chasles : \\(\\int_a^b f + \\int_b^c f = \\int_a^c f\\) ; échanger les bornes change le signe ; \\(\\int_a^b k f = k\\int_a^b f\\).", exemple: ["\\(\\int_1^3 2x\\,dx = 3^2 - 1^2 = 8\\).", "\\(\\int_0^2 f = 3\\) et \\(\\int_2^5 f = 4\\) : \\(\\int_0^5 f = 7\\), \\(\\int_5^0 f = -7\\), \\(\\int_0^5 3f = 21\\)."] },
      /* 24.11 : Chasles, bornes échangées et linéarité, en défis courts */
      plus: [{ d: "\\(\\int_0^2 f(x)\\,dx = 3\\) et \\(\\int_2^5 f(x)\\,dx = 4\\). Que vaut \\(\\int_0^5 f(x)\\,dx\\) ?", ans: 7, ok: "Relation de Chasles : on met bout à bout [0 ; 2] et [2 ; 5] : 3 + 4 = 7.", no: "L'intervalle [0 ; 5] est fait de [0 ; 2] et de [2 ; 5]." },
        { d: "Même \\(f\\) : que vaut \\(\\int_5^0 f(x)\\,dx\\) ?", ans: -7, ok: "Échanger les bornes change le signe : F(0) − F(5) = −(F(5) − F(0)) = −7.", no: "Les bornes sont dans l'autre ordre : F(0) − F(5)." },
        { d: "Même \\(f\\) : que vaut \\(\\int_0^5 3f(x)\\,dx\\) ?", ans: 21, ok: "Le facteur 3 sort de l'intégrale : 3 · 7 = 21 (linéarité).", no: "Une constante sort de l'intégrale." }],
      predict: { q: "Une primitive de 2x est x². Quelle est l'aire sous la droite y = 2x entre x = 1 et x = 3 ?", choices: ["8", "4", "9"], good: 0,
        why: "x² vaut 9 en 3 et 1 en 1 : 9 − 1 = 8 (borne du haut moins borne du bas). C'est le théorème fondamental : ∫ f = F(b) − F(a)." },
      defis: ["Règle la borne b pour que \\(\\int_1^b 2x\\,dx = 8\\).", "Règle b pour que \\(\\int_0^b (x - 2)\\,dx = 0\\)."],
      play: slide({
        ctl: () => [{ k: "b", lab: "Borne b", min: 0.5, max: 5.5, step: 0.5 }],
        init: () => ({ b: 2 }),
        fig: (st, s) => { const b = st.b;
          if (!s) return graph({ xr: [-0.5, 6], yr: [-1, 12], gy: 1, ly: 2, fns: [{ f: (x) => 2 * x }], polys: b > 1 ? [[shade((x) => 2 * x, z0, 1, b), "f-fill2"]] : [], vl: [[1, "f-line"]], lab: "aire sous y = 2x entre 1 et b" });
          const f = (x) => x - 2, P = [[shade(f, z0, 0, Math.min(b, 2)), "f-soft"]];
          if (b > 2) P.push([shade(f, z0, 2, b), "f-fill2"]);
          return graph({ xr: [-0.5, 6], yr: [-3, 4], fns: [{ f }], polys: P, lab: "y = x − 2 : partie sous l'axe (grise) et au-dessus (bleue)" }); },
        out: (st, s) => (s ? "∫₀ᵇ (x − 2) dx = [x²/2 − 2x] = " + nb(st.b * st.b / 2) + " − " + nb(2 * st.b) + " = <b>" + nb(st.b * st.b / 2 - 2 * st.b) + "</b><br><span class=\"small\">la partie sous l'axe compte négativement</span>"
          : st.b < 1 ? "b < 1 : ∫₁ᵇ = −∫ᵇ₁, on obtient " + nb(st.b * st.b - 1) : "∫₁ᵇ 2x dx = [x²]₁ᵇ = " + nb(st.b * st.b) + " − 1 = <b>" + nb(st.b * st.b - 1) + "</b>"),
        goal: [(st) => (st.b === 3 ? "∫₁³ 2x dx = 3² − 1² = 8 : c'est l'aire du trapèze coloré, calculée avec la primitive x²." : ""),
          (st) => (st.b === 4 ? "∫₀⁴ (x − 2) dx = 8 − 8 = 0 : la partie au-dessus de l'axe compense exactement celle du dessous." : "")],
        miss: (st, s) => ((s ? st.b * st.b / 2 - 2 * st.b < 0 : st.b * st.b - 1 < 8) ? "Pas assez : augmente b." : "Trop : diminue b."),
        ask: [{ q: "Calcule \\(\\int_1^4 3x^2\\,dx\\).", ans: 63, ok: "Une primitive de 3x² est x³ : 4³ − 1³ = 64 − 1 = 63.", no: "Primitive de 3x² : x³. Puis F(4) − F(1)." },
          { q: "Valeur moyenne de f(x) = x² sur [0 ; 3] ?", ans: 3, ok: "(1 ÷ 3) · ∫₀³ x² dx = (1 ÷ 3) · 9 = 3.", no: "Valeur moyenne : l'intégrale ∫₀³ x² dx = 9, divisée par la longueur de l'intervalle." }] }),
    },
    aireint: {
      predict: { q: "L'intégrale de x³ entre −1 et 1 vaut 0. L'aire entre la courbe y = x³ et l'axe des x, de −1 à 1, vaut-elle aussi 0 ?", choices: ["Non", "Oui"], good: 0,
        why: "Non : dans l'intégrale, la partie sous l'axe compte négativement et compense l'autre. Pour une aire, on prend chaque morceau en valeur absolue : 1/4 + 1/4 = 1/2." },
      defis: ["Règle la pente m de la droite y = mx pour que l'aire entre la droite et la parabole y = x² vaille 4/3.", "f(x) = x² − 2x. Règle b pour que \\(\\int_0^b f(x)\\,dx = 0\\)."],
      play: slide({
        ctl: (s) => [s ? { k: "b", lab: "Borne b", min: 0.5, max: 4, step: 0.5 } : { k: "m", lab: "Pente m", min: 0.5, max: 4, step: 0.5 }],
        init: (s) => (s ? { b: 2 } : { m: 1 }),
        fig: (st, s) => {
          if (!s) { const m = st.m; return graph({ xr: [-0.5, 4.5], yr: [-1, 17], gy: 1, ly: 4, fns: [{ f: (x) => x * x }, { f: (x) => m * x, cls: "f-accent", w: 2 }], polys: [[shade((x) => m * x, (x) => x * x, 0, m), "f-fill2"]], lab: "aire entre une droite et la parabole" }); }
          const f = (x) => x * x - 2 * x, b = st.b, P = [[shade(f, z0, 0, Math.min(b, 2)), "f-soft"]];
          if (b > 2) P.push([shade(f, z0, 2, b), "f-fill2"]);
          return graph({ xr: [-0.5, 4.5], yr: [-2, 6], fns: [{ f }], polys: P, lab: "y = x² − 2x : partie sous l'axe (grise) et au-dessus (bleue)" }); },
        out: (st, s) => (s ? "∫₀ᵇ (x² − 2x) dx = b³/3 − b² = <b>" + fr(st.b ** 3 / 3 - st.b * st.b) + "</b>" : "Intersections x = 0 et x = " + nb(st.m) + " ; aire = ∫₀ᵐ (mx − x²) dx = m³ ÷ 6 = <b>" + fr(st.m ** 3 / 6) + "</b>"),
        goal: [(st) => (st.m === 2 ? "m = 2 : intersections 0 et 2, aire ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3. On intègre « haut moins bas » entre les intersections." : ""),
          (st) => (st.b === 3 ? "∫₀³ (x² − 2x) dx = 9 − 9 = 0 : la partie sous l'axe (−4/3) compense celle du dessus (+4/3). L'intégrale est nulle, mais pas l'aire !" : "")],
        miss: (st, s) => (s ? (st.b ** 3 / 3 - st.b * st.b < 0 ? "Encore négatif : augmente b." : "Trop : diminue b.") : st.m ** 3 / 6 < 4 / 3 ? "Aire trop petite : augmente m." : "Aire trop grande : diminue m."),
        ask: [{ q: "Aire du domaine compris entre y = 4 − x² et y = x + 2 ?", ans: 4.5, ok: "4 − x² = x + 2 donne x = −2 ou x = 1 ; ∫₋₂¹ (−x² − x + 2) dx = 7/6 + 10/3 = 9/2.", no: "Résous 4 − x² = x + 2, puis intègre (4 − x²) − (x + 2) entre les deux solutions." },
          { q: "Quelle est alors l'aire totale entre la courbe y = x² − 2x et l'axe des x, sur [0 ; 3] ?", ans: 8 / 3, ok: "On coupe au zéro x = 2 : |−4/3| + 4/3 = 8/3.", no: "Coupe en x = 2 (zéro de f) et additionne les valeurs absolues des deux intégrales." }] }),
    },
    volrev: {
      predict: { q: "On fait tourner la courbe de f autour de l'axe des x. Une tranche très fine du solide est…", choices: ["un disque de rayon f(x)", "un rectangle de hauteur f(x)", "un cercle de diamètre x"], good: 0,
        why: "Chaque tranche d'épaisseur dx est un disque d'aire π · f(x)² : en les empilant, V = π ∫ f(x)² dx." },
      defis: ["Le segment y = (r ÷ 3) · x, pour x de 0 à 3, tourne autour de l'axe des x : c'est un cône de hauteur 3. Règle r pour que son volume soit 4π.", "Le demi-cercle y = √(r² − x²) tourne autour de l'axe des x : c'est une boule. Règle r pour que son volume soit 36π."],
      play: slide({
        ctl: (s) => [{ k: "r", lab: "Rayon r", min: s ? 1 : 0.5, max: s ? 5 : 4, step: 0.5 }],
        init: (s) => ({ r: s ? 2 : 1 }),
        fig: (st, s) => { const r = st.r;
          if (!s) { const f = (x) => (r / 3) * x; return graph({ xr: [-0.5, 4], yr: [-4.5, 4.5], H: 250 /* 24.11 soir : en repère orthonormé, la figure faisait 600 px de haut */, fns: [{ f, from: 0, to: 3 }, { f: (x) => -f(x), from: 0, to: 3, cls: "f-line", w: 1.4, dash: true }], polys: [[shade(f, (x) => -f(x), 0, 3), "f-fill2"]], segs: [[3, -r, 3, r, "f-line", 1.4, "4 3"]], lab: "profil du cône" }); }
          const f = (x) => Math.sqrt(Math.max(0, r * r - x * x));
          return graph({ xr: [-5.5, 5.5], yr: [-5.5, 5.5], eq: true /* 24.11 soir : H 220 retiré, la boule était dessinée en ellipse */, fns: [{ f, from: -r, to: r }, { f: (x) => -f(x), from: -r, to: r, cls: "f-line", w: 1.4, dash: true }], polys: [[shade(f, (x) => -f(x), -r, r), "f-fill2"]], lab: "profil de la boule" }); },
        out: (st, s) => (s ? "V = π ∫₋ᵣʳ (r² − x²) dx = (4/3)π r³ = <b>" + nb(+((4 / 3) * st.r ** 3).toFixed(2)) + " π</b>" : "V = π ∫₀³ (r x ÷ 3)² dx = π · r² ÷ 9 · 9 = <b>" + nb(st.r * st.r) + " π</b>"),
        goal: [(st) => (st.r === 2 ? "r = 2 : V = π ∫₀³ (2x/3)² dx = π · (4/9) · 9 = 4π, comme la formule du cône (1/3)π r² h = (1/3)π · 4 · 3." : ""),
          (st) => (st.r === 3 ? "r = 3 : (4/3)π · 27 = 36π. La formule de la boule vient de π ∫ (r² − x²) dx." : "")],
        miss: (st, s) => ((s ? (4 / 3) * st.r ** 3 < 36 : st.r * st.r < 4) ? "Volume trop petit : augmente r." : "Volume trop grand : diminue r."),
        ask: [{ q: "Le graphe de f(x) = √x tourne autour de l'axe des x, de x = 0 à x = 4. Volume divisé par π ?", ans: 8, ok: "V = π ∫₀⁴ (√x)² dx = π ∫₀⁴ x dx = π · 8 : on intègre f(x)², ici x.", no: "On intègre f(x)² = x, pas √x : calcule ∫₀⁴ x dx." },
          { q: "Un tube : le domaine entre R(x) = 2 et r(x) = 1, de x = 0 à x = 5, tourne autour de l'axe des x. Volume divisé par π ?", ans: 15, ok: "Solide creux : π ∫₀⁵ (2² − 1²) dx = π · 3 · 5 = 15π.", no: "Solide creux : π ∫ (R² − r²) dx, ici (4 − 1) sur une longueur 5." }] }),
    },
    lnexp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(e^x\\) et \\(\\ln\\) sont réciproques : \\(e^x = a \\iff x = \\ln a\\) (\\(a > 0\\)). \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln\\frac{a}{b} = \\ln a - \\ln b\\), \\(\\ln(a^n) = n\\ln a\\) et \\(\\ln 1 = 0\\). Dérivées : \\((e^x)' = e^x\\), \\((e^{u})' = u'e^{u}\\), \\((\\ln x)' = \\frac{1}{x}\\). Une primitive de \\(\\frac{1}{x}\\) est \\(\\ln x\\).", exemple: ["\\(e^{2x - 1} = 5 \\iff 2x - 1 = \\ln 5 \\iff x = \\frac{\\ln 5 + 1}{2}\\)", "\\((x\\ln x)' = \\ln x + 1\\)", "\\(\\int_1^{e^4} \\frac{dx}{x} = \\ln(e^4) - \\ln 1 = 4\\)", "\\(\\ln a = 2\\) et \\(\\ln b = 5\\) : \\(\\ln(ab) = 7\\) et \\(\\ln\\frac{b}{a} = 3\\)"] },
      /* 24.11 : ln(ab) et ln(a/b), essentiels à la notion, en défis courts */
      plus: [{ d: "On sait que \\(\\ln a = 2\\) et \\(\\ln b = 5\\). Que vaut \\(\\ln(ab)\\) ?", ans: 7, ok: "ln(ab) = ln a + ln b = 2 + 5 = 7 : le logarithme transforme un produit en somme.", no: "Le logarithme d'un produit est la somme des logarithmes." },
        { d: "Mêmes \\(a\\) et \\(b\\) : que vaut \\(\\ln\\left(\\frac{b}{a}\\right)\\) ?", ans: 3, ok: "ln(b/a) = ln b − ln a = 5 − 2 = 3 : un quotient devient une différence.", no: "Le logarithme d'un quotient est la différence des logarithmes." }],
      predict: { q: "La dérivée de eˣ est…", choices: ["eˣ", "x · eˣ⁻¹", "e"], good: 0,
        why: "eˣ est sa propre dérivée : en chaque point, la pente de la courbe égale sa hauteur. Ce n'est pas une puissance de x." },
      defis: ["Résous e^(2x − 1) = 5 (au centième).", "f(x) = x · ln x. Tape la pente de la tangente en x = e².", "f(x) = e^(x²). Tape f'(1) (au centième).", "Calcule l'intégrale de 1/x entre 1 et e⁴."],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => lnFig(s, null), show: (x, s) => lnFig(s, x),
        miss: (x, s) => ["ln et exp sont réciproques : e^(2x − 1) = 5 ⟺ 2x − 1 = ln 5.", "Produit : (x · ln x)' = 1 · ln x + x · (1/x). Et ln(e²) = 2.", "(e^u)' = u' · e^u avec u = x².", "Une primitive de 1/x est ln x : ln(e⁴) − ln 1. Rappel : ln(aⁿ) = n · ln a."][s],
        wins: [W((Math.log(5) + 1) / 2, "2x − 1 = ln 5, donc x = (ln 5 + 1) ÷ 2 ≈ 1,30.", 0.006), W(3, "(x · ln x)' = ln x + 1 ; en x = e² : 2 + 1 = 3."), W(2 * E, "f'(x) = 2x · e^(x²), donc f'(1) = 2e ≈ 5,44.", 0.006), W(4, "∫₁^(e⁴) dx/x = ln(e⁴) − ln 1 = 4 − 0 = 4.")] }),
    },
    croissance: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Modèle \\(N(t) = N_0 e^{kt}\\) : croissance si \\(k > 0\\), décroissance si \\(k < 0\\). Pour trouver \\(t\\) : isoler \\(e^{kt}\\), puis appliquer \\(\\ln\\). Demi-vie \\(T\\) : \\(k = \\frac{\\ln 2}{T}\\) ; après 3 demi-vies, il reste \\(\\frac{1}{8}\\)." },
      predict: { q: "Une quantité double toutes les 3 heures. Après 9 heures, elle a été multipliée par…", choices: ["8", "3", "6"], good: 0,
        why: "9 heures = 3 doublements : × 2 × 2 × 2 = × 8. Une croissance exponentielle multiplie, elle n'additionne pas." },
      defis: ["Des bactéries suivent N(t) = 400 · e^(0,25t) (t en heures). Règle t pour que la population ait doublé.", "Un isotope a une demi-vie de 5 ans : Q(t) = 800 · e^(−kt) grammes, avec k = ln 2 ÷ 5. Règle t pour qu'il n'en reste que 100 g."],
      play: slide({
        ctl: (s) => [s ? { k: "t", lab: "Temps t (années)", min: 0, max: 25 } : { k: "t", lab: "Temps t (heures)", min: 0, max: 6, step: 0.1 }],
        init: (s) => ({ t: s ? 4 : 1 }),
        fig: (st, s) => { const t = st.t, f = s ? (x) => 800 * Math.exp((-Math.LN2 / 5) * x) : (x) => 400 * Math.exp(0.25 * x);
          return graph(s ? { xr: [0, 26], yr: [0, 900], pad: 22, gx: 1, lx: 5, gy: 100, ly: 200, fns: [{ f }], hl: [[100, "f-accent"]], pts: [[t, f(t), "", "f-dot"]], lab: "décroissance exponentielle" }
            : { xr: [0, 6.2], yr: [0, 1900], pad: 26, gx: 0.5, lx: 1, gy: 200, ly: 400, fns: [{ f }], hl: [[800, "f-accent"]], pts: [[t, f(t), "", "f-dot"]], lab: "croissance exponentielle", fy: (v) => mil(v, 0) }); },
        out: (st, s) => (s ? "Q(" + nb(st.t) + ") = 800 · e^(−k · " + nb(st.t) + ") ≈ <b>" + mil(800 * Math.exp((-Math.LN2 / 5) * st.t), 1) + " g</b> (on veut 100)" : "N(" + nb(st.t) + ") = 400 · e^(0,25 · " + nb(st.t) + ") ≈ <b>" + mil(400 * Math.exp(0.25 * st.t), 0) + "</b> (on veut 800)"),
        goal: [(st) => (Math.abs(st.t - 2.8) < 1e-9 ? "e^(0,25t) = 2 ⟺ t = ln 2 ÷ 0,25 ≈ 2,77 h. Le temps de doublement ne dépend pas de N₀." : ""),
          (st) => (st.t === 15 ? "15 ans = 3 demi-vies : 800 → 400 → 200 → 100 g, il reste 1/8. Calcul : e^(−kt) = 1/8 ⟺ t = ln 8 ÷ k = 15." : "")],
        miss: (st, s) => (s ? (800 * Math.exp((-Math.LN2 / 5) * st.t) > 100 ? "Il en reste trop : avance le temps." : "Il en reste moins de 100 g : recule.") : 400 * Math.exp(0.25 * st.t) < 800 ? "Pas encore doublé : avance t." : "Plus que le double : recule t."),
        ask: [{ q: "N(t) = 500 · e^(0,2t). Au bout de combien de temps atteint-on 2'000 ? (au dixième)", ans: Math.log(4) / 0.2, tol: 0.06, ok: "e^(0,2t) = 4, donc t = ln 4 ÷ 0,2 ≈ 6,9.", no: "Isole l'exponentielle : e^(0,2t) = 2'000 ÷ 500 = 4, puis applique ln." },
          { q: "Une population augmente de 5 % par an. Son taux continu k = ln(1,05) vaut environ… (au millième)", ans: Math.log(1.05), tol: 0.0006, ok: "k = ln(1,05) ≈ 0,049, un peu moins que 0,05 : N₀ · e^(kt) = N₀ · 1,05ᵗ.", no: "Une croissance de p % par an correspond à k = ln(1 + p/100)." }] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Algèbre linéaire
  // =====================================================================================================
  // Matrice 2 × 2 dessinée : x, y = coin haut gauche ; M = [[a, b], [c, d]] (texte) ; hl = { r, c } ligne ou colonne mise en évidence.
  const mat = (x, y, Mx, hl = {}) => {
    const w = 66, h = 46;
    let g = `<path d="M${x + 6},${y} h-6 v${h} h6 M${x + w - 6},${y} h6 v${h} h-6" class="f-line" fill="none" stroke-width="1.6"/>`;
    if (hl.r !== undefined) g += `<rect x="${x + 3}" y="${y + 3 + hl.r * 21}" width="${w - 6}" height="19" rx="5" class="f-fill2"/>`;
    if (hl.c !== undefined) g += `<rect x="${x + 4 + hl.c * 29}" y="${y + 2}" width="${29}" height="${h - 4}" rx="5" class="f-fill2"/>`;
    Mx.forEach((row, i) => row.forEach((v, j) => { g += T(x + 18 + j * 30, y + 18 + i * 21, v, "middle", 13); }));
    return g;
  };
  const matFig = (s, x) => {
    const q = x === null ? "?" : nb(x);
    let g = "";
    if (s === 0) g = T(4, 40, "A ·", "start", 13) + mat(28, 14, [["3", "2"], ["4", "5"]], { r: 0 }) + T(108, 40, "B ·", "start", 13) + mat(132, 14, [["1", "4"], ["2", "−1"]], { c: 1 }) + T(208, 40, "=", "middle", 14) + mat(222, 14, [["…", q], ["…", "…"]]);
    if (s === 1) g = T(4, 40, "det", "start", 13) + mat(36, 14, [["3", "2"], ["4", "5"]]) + L(46, 22, 92, 52, "f-blue", 1.6) + L(92, 22, 46, 52, "f-accent", 1.6) + T(116, 40, "= " + q, "start", 14);
    if (s === 2) g = T(4, 40, "A⁻¹ = (1/7) ·", "start", 13) + mat(100, 14, [["5", "−2"], ["−4", "3"]]) + T(180, 40, "→ en haut à droite : " + q, "start", 12);
    if (s === 3) g = T(4, 22, "D", "start", 13) + mat(18, 6, [["3", "2"], ["4", "5"]]) + T(104, 22, "Dx", "start", 13) + mat(126, 6, [["12", "2"], ["23", "5"]], { c: 0 }) + T(4, 76, "x = Dx ÷ D = " + q, "start", 13);
    return svg(320, s === 3 ? 86 : 70, g, "calcul matriciel");
  };
  // translin : figures dans un repère (image d'un point, du carré unité, d'un triangle).
  const tlFig = (s, x) => {
    const o = { xr: [-7, 7], yr: [-7, 7], eq: true /* 24.11 soir : H 250 retiré (repère déformé, une rotation n'était plus une rotation) */, polys: [], pts: [], arrows: [], lab: "transformation linéaire du plan" };
    let t = "";
    if (s === 0) { o.arrows.push([0, 0, 4, 2, "f-line"]); o.pts.push([4, 2, "P", "f-dot", "r"]); if (x !== null) { o.pts.push([x, 4, "P' ?", "f-fill2", "r"]); o.arrows.push([0, 0, x, 4, "f-blue"]); } t = x === null ? "rotation de 90° autour de O" : x === -2 ? '<b class="act-ok">OP\' est bien OP tourné d\'un quart de tour</b>' : "OP' n'est pas OP tourné d'un quart de tour"; }
    if (s === 1) { o.polys.push([[[0, 0], [1, 0], [1, 1], [0, 1]], "f-soft"], [[[0, 0], [2, 1], [3, 4], [1, 3]], "f-fill2"]); o.xr = [-1, 5]; o.yr = [-1, 5]; t = "carré unité (gris) et son image (bleu) : (1 ; 0) ↦ (2 ; 1), (0 ; 1) ↦ (1 ; 3)" + (x === null ? "" : " ; aire proposée " + nb(x)); }
    if (s === 2) { o.pts.push([1, 2, "P", "f-dot", "r"], [1, -2, "f(P)", "f-dot", "r"]); if (x !== null) o.pts.push([3, x, "g(f(P)) ?", "f-fill2", "r"]); t = "f : symétrie d'axe Ox ; g : homothétie de rapport 3"; }
    if (s === 3) { o.xr = [-1, 13]; o.yr = [-5, 9]; o.H = 250; o.polys.push([[[0, 0], [2, 0], [0, 4]], "f-soft"], [[[0, 0], [2, 4], [12, -4]], "f-fill2"]); t = "triangle d'aire 4 (gris) et son image (bleu)" + (x === null ? "" : " ; aire proposée " + nb(x)); }
    return graph(o) + plain('<span class="small">' + t + "</span>");
  };

  Object.assign(ACTIVE, {
    matrices: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Produit \\(AB\\) : chaque coefficient est « ligne de \\(A\\) × colonne de \\(B\\) » ; en général \\(AB \\neq BA\\). Déterminant \\(\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc\\). Si \\(\\det A \\neq 0\\), \\(A\\) est inversible et \\(A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}\\). Système \\(A\\binom{x}{y} = \\binom{e}{f}\\) : \\(x = \\frac{D_x}{D}\\), \\(y = \\frac{D_y}{D}\\) (Cramer), où \\(D = \\det A\\) et \\(D_x\\) remplace la colonne des x par le second membre. \\(\\det(AB) = \\det A \\cdot \\det B\\) et, pour une matrice 2 × 2, \\(\\det(kA) = k^2 \\det A\\).", exemple: ["\\(\\det\\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix} = 15 - 8 = 7\\), inverse \\(\\frac{1}{7}\\begin{pmatrix} 5 & -2 \\\\ -4 & 3 \\end{pmatrix}\\)", "\\(\\det A = 3\\), \\(\\det B = -4\\) : \\(\\det(AB) = -12\\) ; \\(\\det A = 5\\) : \\(\\det(3A) = 9 \\cdot 5 = 45\\)"], piege: "\\(\\det(3A) \\neq 3\\det A\\) : chacune des deux lignes est multipliée par 3, donc le déterminant par \\(3^2 = 9\\)." },
      /* 24.11 : det(AB) et det(kA) en défis courts */
      plus: [{ d: "\\(A\\) et \\(B\\) sont des matrices 2 × 2 avec \\(\\det A = 3\\) et \\(\\det B = -4\\). Que vaut \\(\\det(AB)\\) ?", ans: -12, ok: "Le déterminant d'un produit est le produit des déterminants : det(AB) = 3 · (−4) = −12.", no: "det(AB) = det A · det B." },
        { d: "\\(A\\) est une matrice 2 × 2 avec \\(\\det A = 5\\). Que vaut \\(\\det(3A)\\) ?", ans: 45, ok: "3A multiplie les deux lignes par 3 : det(3A) = 3 · 3 · det A = 9 · 5 = 45, et non 15.", no: "Dans 3A, chaque coefficient est multiplié par 3 : calcule 3a · 3d − 3b · 3c." }],
      predict: { q: "Pour multiplier deux matrices, on…", choices: ["combine une ligne de la première avec une colonne de la seconde", "multiplie les coefficients placés au même endroit"], good: 0,
        why: "Chaque coefficient du produit AB vient d'une ligne de A et d'une colonne de B : on multiplie terme à terme et on additionne. Ce n'est pas coefficient par coefficient." },
      defis: ["\\(A = \\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix}\\) et \\(B = \\begin{pmatrix} 1 & 4 \\\\ 2 & -1 \\end{pmatrix}\\). Calcule le coefficient de AB en ligne 1, colonne 2.", "Calcule le déterminant de \\(A = \\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix}\\).", "Que vaut le coefficient en haut à droite de l'inverse \\(A^{-1}\\) ?", "Résous \\(3x + 2y = 12\\) et \\(4x + 5y = 23\\) avec Cramer : que vaut x ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => matFig(s, null), show: (x, s) => matFig(s, x),
        miss: (x, s) => ["Ligne 1 de A : (3 ; 2). Colonne 2 de B : (4 ; −1). Multiplie terme à terme et additionne.", "det = ad − bc : diagonale bleue moins diagonale rouge.", "A⁻¹ = (1 / det A) · (d −b ; −c a), et det A = 7.", "D = det A = 7 ; Dx remplace la colonne des x par (12 ; 23)."][s],
        wins: [W(10, "3 · 4 + 2 · (−1) = 10. (BA donnerait 1 · 2 + 4 · 5 = 22 à cette place : AB ≠ BA.)"), W(7, "det A = 3 · 5 − 2 · 4 = 15 − 8 = 7 ≠ 0 : A est inversible."), W(-2 / 7, "A⁻¹ = (1/7) · (5 −2 ; −4 3) : en haut à droite, −2/7. On échange a et d, on change le signe de b et c, on divise par det A."), W(2, "Dx = 12 · 5 − 2 · 23 = 14, donc x = 14 ÷ 7 = 2 ; de même y = (3 · 23 − 12 · 4) ÷ 7 = 3.")] }),
    },
    translin: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "L'image de \\(P(x ; y)\\) par l'application de matrice \\(A\\) est \\(A\\binom{x}{y}\\). Les colonnes de \\(A\\) sont les images de \\((1 ; 0)\\) et \\((0 ; 1)\\). Rotation de 90° autour de O \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\), symétrie d'axe Ox \\(\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\), homothétie de centre O et de rapport k \\(\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}\\). Les aires sont multipliées par \\(|\\det A|\\). Appliquer \\(f\\) (matrice A) puis \\(g\\) (matrice B) : matrice \\(BA\\)." },
      predict: { q: "La matrice (2 0 ; 0 2) agit sur tous les points du plan. Elle…", choices: ["agrandit tout du double depuis O", "fait tourner de 90°", "ne change rien"], good: 0,
        why: "(x ; y) ↦ (2x ; 2y) : c'est l'homothétie de centre O et de rapport 2. Les aires sont multipliées par det = 4." },
      defis: ["Rotation de 90° autour de O, de matrice \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\). Abscisse de l'image de P(4 ; 2) ?", "Matrice \\(A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}\\). Aire de l'image du carré unité ?", "f = symétrie d'axe Ox, g = homothétie de centre O et de rapport 3. Ordonnée de l'image de P(1 ; 2) par g ∘ f (d'abord f) ?", "Matrice \\(\\begin{pmatrix} 1 & 3 \\\\ 2 & -1 \\end{pmatrix}\\). Un triangle d'aire 4 a pour image un triangle d'aire… ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => tlFig(s, null), show: (x, s) => tlFig(s, x),
        miss: (x, s) => ["Matrice × coordonnées : (0 · 4 − 1 · 2 ; 1 · 4 + 0 · 2).", "Les aires sont multipliées par |det A|.", "f(P) = (1 ; −2), puis g multiplie les coordonnées par 3.", "Facteur des aires : |det| = |1 · (−1) − 3 · 2|."][s],
        wins: [W(-2, "(x ; y) ↦ (−y ; x), donc (4 ; 2) ↦ (−2 ; 4). Les colonnes de la matrice sont les images de (1 ; 0) et (0 ; 1)."), W(5, "Le carré unité (aire 1) devient un parallélogramme d'aire |det A| = |2 · 3 − 1 · 1| = 5."), W(-6, "f : (1 ; 2) ↦ (1 ; −2), puis g : ↦ (3 ; −6). Matrice de g ∘ f : B · A = (3 0 ; 0 −3), dans cet ordre."), W(28, "det = 1 · (−1) − 3 · 2 = −7 : les aires sont multipliées par |−7| = 7, donc 4 · 7 = 28.")] }),
    },
    /* 24.11 soir : applications linéaires (noyau, image, bases), « À toi » sans figure */
    appllin: {
      retiens: { regle: "Le noyau de \\(f\\) est formé des vecteurs \\(\\vec v\\) tels que \\(A\\vec v = \\vec 0\\) ; il n'est pas réduit à \\(\\vec 0\\) exactement quand \\(\\det A = 0\\). Si \\(\\det A = 0\\), l'image est la droite engendrée par une colonne non nulle de \\(A\\). Dans une base \\((\\vec u ; \\vec v)\\), les composantes \\((\\alpha ; \\beta)\\) de \\(\\vec w\\) vérifient \\(\\vec w = \\alpha\\vec u + \\beta\\vec v\\).",
        exemple: ["\\(A = \\begin{pmatrix} 2 & -4 \\\\ 3 & -6 \\end{pmatrix}\\) : \\(2 - 4m = 0\\), noyau engendré par \\((1 ; 0{,}5)\\) ; image : la droite \\(y = 1{,}5x\\)."] },
      predict: { q: "La matrice \\(\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}\\) envoie tous les points du plan…", choices: ["sur une même droite", "sur tout le plan", "sur l'origine seulement"], good: 0,
        why: "Les deux colonnes (1 ; 2) et (2 ; 4) sont colinéaires (det = 0) : toutes les images sont sur la droite y = 2x. Le plan est « écrasé », et toute une droite de vecteurs est envoyée sur 0 : c'est le noyau." },
      defis: ["\\(A = \\begin{pmatrix} 6 & -2 \\\\ 9 & -3 \\end{pmatrix}\\). Le noyau est engendré par \\((1 \\,;\\, m)\\). Que vaut \\(m\\) ?", "Pour cette même matrice, l'image est la droite \\(y = px\\). Que vaut \\(p\\) ?", "Base \\(\\vec u = (1 \\,;\\, 2)\\), \\(\\vec v = (1 \\,;\\, -1)\\). \\(\\vec w = (5 \\,;\\, 4) = \\alpha\\vec u + \\beta\\vec v\\). Que vaut \\(\\alpha\\) ?"],
      garde: [0, 2],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["Première ligne : 6 · 1 + (−2) · m = 0. ", "L'image est engendrée par la première colonne (6 ; 9) : pente 9 ÷ 6. ", "Système α + β = 5 et 2α − β = 4 : additionne les deux équations. "][s] + tu(x)),
        wins: [W(3, "6 − 2m = 0, donc m = 3 : le vecteur (1 ; 3) est envoyé sur (0 ; 0)."), W(1.5, "Les colonnes (6 ; 9) et (−2 ; −3) sont colinéaires : l'image est la droite y = 1,5x."), W(3, "3α = 9, donc α = 3, puis β = 2 : (5 ; 4) = 3 · (1 ; 2) + 2 · (1 ; −1).")] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Probabilités
  // =====================================================================================================
  // Arbre du dépistage : p = proportion de malades.
  const tree = (p) => {
    const t = (x, y, s, a = "start") => T(x, y, s, a, 11);
    let g = L(14, 80, 112, 36) + L(14, 80, 112, 124) + L(140, 36, 232, 16) + L(140, 36, 232, 56) + L(140, 124, 232, 104) + L(140, 124, 232, 144);
    g += t(118, 40, "M") + t(118, 128, "non M") + t(238, 20, "+") + t(238, 60, "−") + t(238, 108, "+") + t(238, 148, "−");
    g += t(40, 50, nb(p)) + t(40, 118, nb(+(1 - p).toFixed(4))) + t(170, 20, "0,99") + t(170, 58, "0,01") + t(170, 108, "0,05") + t(170, 146, "0,95");
    g += t(256, 20, "→ " + nb(+(0.99 * p).toFixed(5)), "start") + t(256, 108, "→ " + nb(+(0.05 * (1 - p)).toFixed(5)), "start");
    return svg(320, 156, g, "arbre : malade ou non, puis test positif ou négatif");
  };
  // Diagramme en barres : B = [[valeur, probabilité, classe]] ; v = trait vertical (espérance).
  const bars = (B, xr, yr, extra = {}) => graph(Object.assign({ xr, yr, gy: 0.1, ly: 0.2, segs: B.map(([x, p, cls]) => [x, 0, x, p, cls || "f-blue", 12]), lab: "diagramme en barres d'une loi de probabilité" }, extra));
  const C5 = [1, 5, 10, 10, 5, 1], b5 = (k) => C5[k] * 0.3 ** k * 0.7 ** (5 - k);
  // Loi normale (μ = 170, σ = 8) : valeurs de la règle 68-95-99,7 aux bornes μ + kσ.
  const PHI = { "-3": 0.15, "-2": 2.5, "-1": 16, 0: 50, 1: 84, 2: 97.5, 3: 99.85 };
  /* densité de la loi normale centrée réduite (abscisse z = (x − μ) ÷ σ) */
  const dens = (z) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

  Object.assign(ACTIVE, {
    condbayes: {
      predict: { q: "Un test repère 99 % des malades, mais il est aussi positif chez 5 % des personnes saines. La maladie touche 1 personne sur 100. Ton test est positif : la probabilité d'être malade est environ…", choices: ["17 %", "99 %", "50 %"], good: 0,
        why: "Sur 10'000 personnes : 100 malades, dont 99 positifs ; 9'900 saines, dont 495 positives. 99 ÷ (99 + 495) ≈ 17 %. Il ne faut pas confondre P_M(+) = 99 % et P_+(M)." },
      defis: ["Même test. Règle la proportion p de malades (en %) : quelle est la plus petite valeur pour laquelle un test positif signifie « malade » plus d'une fois sur deux ?", "P(A) = 0,4 et P(A ∩ B) = 0,12. Règle P(B) pour que A et B soient indépendants."],
      play: slide({
        ctl: (s) => [s ? { k: "b", lab: "P(B)", min: 0.1, max: 0.9, step: 0.05 } : { k: "p", lab: "Proportion de malades (%)", min: 1, max: 20 }],
        init: (s) => (s ? { b: 0.5 } : { p: 1 }),
        fig: (st, s) => { if (!s) return tree(st.p / 100);
          const W = 300, H = 140, a = 0.4 * W, hb = st.b * H;
          let g = `<rect x="10" y="4" width="${W}" height="${H}" class="f-soft"/><rect x="10" y="${4 + H - hb}" width="${W}" height="${hb}" class="f-fill2" style="opacity:0.6"/><rect x="10" y="4" width="${a}" height="${H}" fill="none" stroke="var(--accent)" stroke-width="2.4"/>`;
          g += T(10 + a / 2, 18, "A (0,4)", "middle", 11) + T(10 + W - 6, 4 + H - hb + 14, "B", "end", 11);
          return svg(320, 150, g, "univers : A à gauche, B en bas"); },
        out: (st, s) => { if (s) return "P(A) · P(B) = 0,4 · " + nb(st.b) + " = <b>" + nb(+(0.4 * st.b).toFixed(4)) + "</b> ; P(A ∩ B) = 0,12";
          const p = st.p / 100, a = 0.99 * p, b = 0.05 * (1 - p); return "P(+) = " + nb(+a.toFixed(5)) + " + " + nb(+b.toFixed(5)) + " = " + nb(+(a + b).toFixed(5)) + "<br>P(M sachant +) = " + nb(+a.toFixed(5)) + " ÷ " + nb(+(a + b).toFixed(5)) + " ≈ <b>" + nb(+((100 * a) / (a + b)).toFixed(1)) + " %</b>"; },
        goal: [(st) => (st.p === 5 ? "p = 5 % : P(M sachant +) = 0,0495 ÷ (0,0495 + 0,0475) ≈ 51 %. Avec 4 %, on n'a que 45 % : quand la maladie est rare, beaucoup de tests positifs sont de faux positifs." : ""),
          (st) => (Math.abs(st.b - 0.3) < 1e-9 ? "P(B) = 0,3 : P(A) · P(B) = 0,4 · 0,3 = 0,12 = P(A ∩ B), donc A et B sont indépendants. Et P_A(B) = 0,12 ÷ 0,4 = 0,3 = P(B) : savoir A ne change rien." : "")],
        miss: (st, s) => { if (s) return 0.4 * st.b < 0.12 ? "P(A) · P(B) est trop petit : augmente P(B)." : "P(A) · P(B) est trop grand : diminue P(B).";
          const p = st.p / 100, q = (0.99 * p) / (0.99 * p + 0.05 * (1 - p)); return q < 0.5 ? "Moins de 50 % : augmente la proportion de malades." : "Plus de 50 %, mais ce n'est pas la plus petite proportion : recule."; },
        ask: [{ q: "Avec 1 % de malades, quelle est la probabilité (en %, à l'unité) d'être malade quand le test est positif ?", ans: 100 * 0.0099 / 0.0594, tol: 0.5, ok: "Bayes : P(M) · P_M(+) ÷ P(+) = 0,0099 ÷ (0,0099 + 0,0495) ≈ 0,167, soit 17 %.", no: "P(M ∩ +) = 0,01 · 0,99 ; P(+) = 0,01 · 0,99 + 0,99 · 0,05 ; divise le premier par le second." },
          { q: "Autre cas : P(A) = 0,4 et P(A ∩ B) = 0,1. Que vaut P_A(B) ?", ans: 0.25, ok: "P_A(B) = P(A ∩ B) ÷ P(A) = 0,1 ÷ 0,4 = 0,25.", no: "Définition : P_A(B) = P(A ∩ B) ÷ P(A)." }] }),
    },
    varalea: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Loi de \\(X\\) : valeurs \\(x_i\\) et probabilités \\(p_i\\) (somme 1). Espérance (moyenne à long terme) \\(E(X) = \\sum x_i p_i\\) ; un jeu est équitable si l'espérance du gain est nulle. Variance \\(V(X) = E(X^2) - E(X)^2\\), écart-type \\(\\sigma(X) = \\sqrt{V(X)}\\). Changement d'échelle : \\(E(aX + b) = aE(X) + b\\) et \\(V(aX + b) = a^2V(X)\\).", exemple: ["Deux piles → 6 CHF, un pile → 2 CHF : \\(E = 6 \\cdot 0{,}25 + 2 \\cdot 0{,}5 = 2{,}5\\) ; prix d'entrée équitable 2,50 CHF.", "\\(E(X) = 4\\) : \\(E(3X + 2) = 14\\) ; \\(V(X) = 5\\) : \\(V(3X + 2) = 9 \\cdot 5 = 45\\).", "\\(V(X) = 6{,}25\\) : \\(\\sigma(X) = 2{,}5\\)."], piege: "Le « + b » décale les valeurs sans les disperser : il change l'espérance, pas la variance." },
      /* 24.11 : écart-type, E(aX + b) et V(aX + b) en défis courts */
      plus: [{ d: "\\(E(X) = 4\\). Que vaut \\(E(3X + 2)\\) ?", ans: 14, ok: "E(aX + b) = a · E(X) + b = 3 · 4 + 2 = 14 : chaque valeur est multipliée par 3 puis augmentée de 2, la moyenne aussi.", no: "Multiplie l'espérance par 3, puis ajoute 2." },
        { d: "\\(V(X) = 5\\). Que vaut \\(V(3X + 2)\\) ?", ans: 45, ok: "V(aX + b) = a² · V(X) = 9 · 5 = 45 : le facteur compte au carré, le + 2 ne disperse pas.", no: "La variance est un carré d'écarts : le facteur 3 compte au carré, et le + 2 ne change rien." },
        { d: "\\(V(X) = 6{,}25\\). Que vaut l'écart-type \\(\\sigma(X)\\) ?", ans: 2.5, ok: "σ(X) = √V(X) = √6,25 = 2,5 : l'écart-type est dans l'unité des valeurs.", no: "L'écart-type est la racine carrée de la variance." }],
      predict: { q: "On lance un dé : sur un 6, tu gagnes 12 CHF, sinon rien. En moyenne, une partie rapporte…", choices: ["2 CHF", "6 CHF", "12 CHF"], good: 0,
        why: "12 · 1/6 + 0 · 5/6 = 2 CHF : l'espérance pondère chaque gain par sa probabilité." },
      defis: ["On paie un prix d'entrée, puis on lance deux pièces : deux piles → on reçoit 6 CHF, un seul pile → 2 CHF, aucun → rien. Règle le prix pour que le jeu soit équitable (espérance du gain net nulle).", "X prend les valeurs 1, 2 et 3 avec les probabilités 0,2 ; 0,45 et p. Règle p pour que ce soit une loi de probabilité."],
      play: slide({
        ctl: (s) => [s ? { k: "p", lab: "p = P(X = 3)", min: 0.05, max: 0.6, step: 0.05 } : { k: "c", lab: "Prix d'entrée (CHF)", min: 0, max: 5, step: 0.5 }],
        init: (s) => (s ? { p: 0.15 } : { c: 1 }),
        fig: (st, s) => { if (s) return bars([[1, 0.2], [2, 0.45], [3, st.p, "f-accent"]], [0, 4], [0, 0.7]);
          const c = st.c, e = 2.5 - c; return bars([[6 - c, 0.25], [2 - c, 0.5], [-c, 0.25]], [-6, 7], [0, 0.6], { vl: [[e, "f-accent"]] }) + plain('<span class="small">barres : gain net G ; trait rouge : E(G)</span>'); },
        out: (st, s) => { if (s) { const S = 0.65 + st.p; return "Somme des probabilités : 0,2 + 0,45 + " + nb(st.p) + " = <b>" + nb(+S.toFixed(4)) + "</b>"; }
          return "G = " + nb(6 - st.c) + ", " + nb(2 - st.c) + " ou " + nb(-st.c) + " avec les probabilités 1/4, 1/2, 1/4<br>E(G) = 2,5 − " + nb(st.c) + " = <b>" + nb(2.5 - st.c) + " CHF</b>"; },
        goal: [(st) => (st.c === 2.5 ? "Prix 2,5 CHF : E(G) = 3,5 · 1/4 + (−0,5) · 1/2 + (−2,5) · 1/4 = 0. Jeu équitable : en moyenne, on ne gagne ni ne perd." : ""),
          (st) => (Math.abs(st.p - 0.35) < 1e-9 ? "0,2 + 0,45 + 0,35 = 1. Alors E(X) = 1 · 0,2 + 2 · 0,45 + 3 · 0,35 = 2,15." : "")],
        miss: (st, s) => (s ? (0.65 + st.p < 1 ? "La somme n'atteint pas 1 : augmente p." : "La somme dépasse 1 : diminue p.") : 2.5 - st.c > 0 ? "E(G) > 0 : le joueur gagne en moyenne, augmente le prix." : "E(G) < 0 : le joueur perd en moyenne, baisse le prix."),
        ask: [{ q: "Une loterie : gains 10, 0 et −2 CHF avec les probabilités 0,1 ; 0,5 et 0,4. Espérance du gain (CHF) ?", ans: 0.2, ok: "E = 10 · 0,1 + 0 · 0,5 + (−2) · 0,4 = 1 − 0,8 = 0,2 CHF.", no: "Multiplie chaque gain par sa probabilité, puis additionne." },
          { q: "Avec cette loi, calcule V(X) = E(X²) − E(X)² (au centième).", ans: 0.5275, tol: 0.006, ok: "E(X²) = 0,2 + 1,8 + 3,15 = 5,15 ; V = 5,15 − 2,15² = 0,5275 ≈ 0,53 ; écart-type σ ≈ 0,73.", no: "E(X²) = 1² · 0,2 + 2² · 0,45 + 3² · 0,35 ; puis retire E(X)² = 2,15²." }] }),
    },
    binomiale: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Schéma de Bernoulli : \\(n\\) épreuves identiques et indépendantes, chacune un succès avec la probabilité \\(p\\). \\(X\\) = nombre de succès suit \\(B(n \\,;\\, p)\\) : \\(P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}\\), où \\(\\binom{n}{k}\\) compte les chemins de l'arbre avec \\(k\\) succès. \\(E(X) = np\\)." },
      predict: { q: "On lance 3 fois une pièce. Combien de chemins de l'arbre donnent exactement 2 piles ?", choices: ["3", "2", "6"], good: 0,
        why: "PPF, PFP et FPP : 3 chemins, c'est le coefficient binomial (3 ; 2). Chacun a la probabilité 0,5³, donc P(X = 2) = 3 · 0,125 = 3/8." },
      defis: ["X suit la loi binomiale B(5 ; 0,3) : 5 épreuves, succès avec la probabilité 0,3. Sélectionne la valeur de k la plus probable.", "On lance un dé n fois. Règle n pour que P(au moins un 6) dépasse 50 %, avec n le plus petit possible."],
      play: slide({
        ctl: (s) => [s ? { k: "n", lab: "Nombre de lancers n", min: 1, max: 10 } : { k: "k", lab: "Nombre de succès k", min: 0, max: 5 }],
        init: (s) => (s ? { n: 1 } : { k: 4 }),
        fig: (st, s) => (s ? bars(Array.from({ length: 10 }, (_, i) => [i + 1, 1 - (5 / 6) ** (i + 1), i + 1 === st.n ? "f-accent" : "f-blue"]), [0, 11], [0, 1], { hl: [[0.5, "f-line"]], gy: 0.1, ly: 0.5 })
          : bars(C5.map((_, k) => [k, b5(k), k === st.k ? "f-accent" : "f-blue"]), [-0.8, 5.8], [0, 0.45])),
        out: (st, s) => (s ? "P(au moins un 6) = 1 − (5/6)^" + st.n + " ≈ <b>" + nb(+(1 - (5 / 6) ** st.n).toFixed(3)) + "</b>"
          : "P(X = " + st.k + ") = " + C5[st.k] + " · 0,3^" + st.k + " · 0,7^" + (5 - st.k) + " ≈ <b>" + nb(+b5(st.k).toFixed(3)) + "</b>"),
        goal: [(st) => (st.k === 1 ? "k = 1 : P(X = 1) = 5 · 0,3 · 0,7⁴ ≈ 0,360, la plus haute barre (k = 2 donne 0,309)." : ""),
          (st) => (st.n === 4 ? "n = 4 : 1 − (5/6)⁴ ≈ 0,518. Avec 3 lancers : 1 − (5/6)³ ≈ 0,421. « Au moins un » = 1 − « aucun »." : "")],
        miss: (st, s) => (s ? (1 - (5 / 6) ** st.n < 0.5 ? "Pas encore 50 % : augmente n." : "Plus de 50 %, mais il y a plus petit.") : "Ce n'est pas la plus haute barre."),
        ask: [{ q: "Toujours B(5 ; 0,3) : calcule P(X = 2) (au millième).", ans: b5(2), tol: 0.0006, ok: "10 chemins avec 2 succès : 10 · 0,3² · 0,7³ = 10 · 0,09 · 0,343 ≈ 0,309.", no: "N'oublie pas le coefficient : 10 chemins avec 2 succès, chacun de probabilité 0,3² · 0,7³." },
          { q: "12 passagers, chacun présent avec la probabilité 0,8, indépendamment. Espérance du nombre de présents ?", ans: 9.6, ok: "E(X) = n · p = 12 · 0,8 = 9,6 ; variance n · p · (1 − p) = 1,92.", no: "Pour une loi binomiale, E(X) = n · p." }] }),
    },
    normale: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si \\(X\\) suit une loi normale de moyenne \\(\\mu\\) et d'écart-type \\(\\sigma\\) : \\(P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx 68\\,\\%\\), \\(P(\\mu - 2\\sigma \\le X \\le \\mu + 2\\sigma) \\approx 95\\,\\%\\), \\(P(\\mu - 3\\sigma \\le X \\le \\mu + 3\\sigma) \\approx 99{,}7\\,\\%\\). Par symétrie, chaque moitié d'intervalle vaut la moitié (34 %, 47,5 %, 49,85 %) et chaque « queue » la moitié du reste (16 %, 2,5 %, 0,15 %)." },
      predict: { q: "Tailles d'adultes : moyenne 170 cm, écart-type 8 cm, loi normale. Quelle proportion mesure entre 162 et 178 cm ?", choices: ["environ 68 %", "environ 50 %", "environ 95 %"], good: 0,
        why: "162 et 178 sont à un écart-type de la moyenne : environ 68 % des personnes (règle 68-95-99,7)." },
      defis: ["Même modèle (μ = 170 cm, σ = 8 cm). Règle l'intervalle [a ; b] centré sur la moyenne qui contient environ 95 % des personnes.", "Règle maintenant un intervalle [a ; b] qui contient environ 81,5 % des personnes."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Borne a (cm)", min: 146, max: 194, step: 8 }, { k: "b", lab: "Borne b (cm)", min: 146, max: 194, step: 8 }],
        init: (s) => (s ? { a: 146, b: 194 } : { a: 162, b: 178 }),
        fig: (st) => { const za = (st.a - 170) / 8, zb = (st.b - 170) / 8;
          return graph({ xr: [-3.75, 3.75], yr: [-0.03, 0.43], gx: 1, lx: 1, gy: 0.1, ly: 1, fy: () => "", fx: (v) => nb(170 + 8 * v), fns: [{ f: dens }], polys: za < zb ? [[shade(dens, z0, za, zb), "f-fill2"]] : [], vl: [[0, "f-line"]], lab: "courbe en cloche, μ = 170, σ = 8" }) + plain('<span class="small">graduations : μ − 3σ = 146, …, μ + 3σ = 194</span>'); },
        out: (st) => (st.a >= st.b ? "Choisis a plus petit que b." : "P(" + st.a + " ≤ X ≤ " + st.b + ") ≈ <b>" + nb(PHI[(st.b - 170) / 8] - PHI[(st.a - 170) / 8]) + " %</b><br><span class=\"small\">a = μ " + ((st.a - 170) / 8 < 0 ? "− " + -(st.a - 170) / 8 : "+ " + (st.a - 170) / 8) + "σ ; b = μ " + ((st.b - 170) / 8 < 0 ? "− " + -(st.b - 170) / 8 : "+ " + (st.b - 170) / 8) + "σ</span>"),
        goal: [(st) => (st.a === 154 && st.b === 186 ? "[154 ; 186] = [μ − 2σ ; μ + 2σ] : environ 95 % des personnes." : ""),
          (st) => (st.a < st.b && PHI[(st.b - 170) / 8] - PHI[(st.a - 170) / 8] === 81.5 ? "[" + st.a + " ; " + st.b + "] : on coupe à la moyenne, " + (st.a === 162 ? "34 % + 47,5 %" : "47,5 % + 34 %") + " = 81,5 %." : "")],
        miss: (st, s) => (st.a >= st.b ? "" : s ? "On peut couper à la moyenne : 34 % d'un côté (1σ), 47,5 % de l'autre (2σ)." : (st.a + st.b) / 2 !== 170 ? "L'intervalle doit être centré sur 170." : "Centré, mais pas la bonne largeur : 95 % correspond à 2 écarts-types."),
        ask: [{ q: "Quel pourcentage de personnes mesure moins de 154 cm ?", ans: 2.5, ok: "Hors de [154 ; 186], il reste 5 %, partagé également : 2,5 % de chaque côté.", no: "Ce qui reste hors de l'intervalle à 95 % se partage en deux queues égales." },
          { q: "Sur 400 personnes, combien mesurent plus de 186 cm (environ) ?", ans: 10, ok: "P(X > 186) = 2,5 %, et 400 · 0,025 = 10 personnes.", no: "186 = μ + 2σ : au-dessus, il reste 2,5 %." }] }),
    },
  });
  // =====================================================================================================
  // 3e Collège · Limites, étude de fonctions, combinatoire et probabilités (24.11 soir, agent c3ana)
  // « À toi : 2 questions » (réponse tapée, coup de pouce après une erreur), sans figure.
  // =====================================================================================================
  const toi = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(cp[s] + "<br>" + tu(x)), wins });
  Object.assign(ACTIVE, {
    limites: {
      retiens: { regle: "Si le dénominateur ne s'annule pas en \\(a\\), on remplace \\(x\\) par \\(a\\). Forme \\(\\frac{0}{0}\\) : on factorise le numérateur par \\((x - a)\\), on simplifie, puis on remplace \\(x\\) par \\(a\\).", exemple: ["\\(\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6\\)", "\\(\\lim_{x \\to 2} \\frac{x^2 + x - 6}{x - 2} = \\lim_{x \\to 2} (x + 3) = 5\\)"], piege: "\\(\\frac{0}{0}\\) n'est pas un résultat : c'est le signal qu'il faut simplifier." },
      predict: { q: "Que vaut \\(\\frac{x^2 - 9}{x - 3}\\) pour \\(x = 3{,}001\\) ?", choices: ["environ 6", "environ 0", "on ne peut pas le calculer"], good: 0,
        why: "Pour x ≠ 3, (x² − 9) ÷ (x − 3) = x + 3 : en 3,001, elle vaut 6,001. En x = 3, on obtient 0 ÷ 0, mais la limite vaut 6." },
      defis: ["Calcule \\(\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}\\).", "Calcule \\(\\lim_{x \\to 2} \\frac{x^2 + x - 6}{x - 2}\\)."],
      play: toi(["x² − 9 = (x − 3)(x + 3) : simplifie par (x − 3), puis remplace x par 3", "x² + x − 6 = (x − 2)(x + 3) : simplifie, puis remplace x par 2"],
        [W(6, "(x − 3)(x + 3) ÷ (x − 3) = x + 3, qui vaut 6 en x = 3."), W(5, "x² + x − 6 = (x − 2)(x + 3) : il reste x + 3, qui vaut 5 en x = 2.")]),
    },
    limitinf: {
      retiens: { regle: "À l'infini, une fraction rationnelle se comporte comme le quotient de ses termes de plus haut degré. Mêmes degrés en haut et en bas : la limite est le quotient des coefficients dominants.", exemple: ["\\(\\lim_{x \\to +\\infty} \\frac{6x^2 + x - 1}{2x^2 + 5} = \\frac{6}{2} = 3\\)", "\\(\\lim_{x \\to -\\infty} \\frac{3x - 4}{4x + 7} = \\frac{3}{4}\\)"] },
      predict: { q: "Que devient \\(\\frac{6x^2 + 1}{2x^2 - 5}\\) quand \\(x\\) devient très grand (1'000, 1'000'000…) ?", choices: ["elle s'approche de 3", "elle devient énorme", "elle s'approche de 0"], good: 0,
        why: "Pour x très grand, le + 1 et le − 5 ne comptent presque plus : 6x² ÷ 2x² = 3." },
      defis: ["Calcule \\(\\lim_{x \\to +\\infty} \\frac{6x^2 + x - 1}{2x^2 + 5}\\).", "Calcule \\(\\lim_{x \\to -\\infty} \\frac{3x - 4}{4x + 7}\\) (fraction acceptée)."],
      play: toi(["Garde seulement les termes de plus haut degré : 6x² en haut, 2x² en bas", "Termes dominants : 3x en haut, 4x en bas"],
        [W(3, "6x² ÷ 2x² = 3 : les autres termes deviennent négligeables."), W(0.75, "3x ÷ 4x = 3/4, aussi en −∞ : les x se simplifient.")]),
    },
    asymptotes: {
      retiens: { regle: "Asymptote verticale \\(x = a\\) : le dénominateur s'annule en \\(a\\) (et pas le numérateur). Asymptote horizontale \\(y = b\\) : \\(b\\) est la limite de \\(f(x)\\) à l'infini.", exemple: ["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : asymptotes \\(x = 3\\) et \\(y = 2\\)."] },
      predict: { q: "\\(f(x) = \\frac{2x + 1}{x - 3}\\). Que fait la courbe près de \\(x = 3\\) ?", choices: ["elle part vers l'infini", "elle passe par 0", "elle vaut 7"], good: 0,
        why: "En x = 3, le dénominateur vaut 0 et le numérateur 7 : f(x) = 7 ÷ (très petit) devient énorme. La droite x = 3 est une asymptote verticale." },
      defis: ["\\(f(x) = \\frac{2x + 1}{x - 3}\\). Son asymptote verticale a pour équation \\(x = a\\). Que vaut \\(a\\) ?", "Même fonction : son asymptote horizontale a pour équation \\(y = b\\). Que vaut \\(b\\) ?"],
      play: toi(["Cherche où le dénominateur x − 3 s'annule", "Limite à l'infini : 2x ÷ x"],
        [W(3, "x − 3 = 0 pour x = 3, où le numérateur vaut 7 : asymptote verticale x = 3."), W(2, "À l'infini, (2x + 1) ÷ (x − 3) ≈ 2x ÷ x = 2 : asymptote horizontale y = 2.")]),
    },
    continuite: {
      retiens: { regle: "\\(f\\) est continue en \\(a\\) si \\(\\lim_{x \\to a} f(x) = f(a)\\). Pour une fonction par morceaux, les deux formules doivent donner la même valeur au point de raccord.", exemple: ["\\(x + 1\\) si \\(x < 2\\), \\(x^2 + k\\) si \\(x \\ge 2\\) : \\(3 = 4 + k\\), donc \\(k = -1\\).", "\\(g(x) = \\frac{x^2 - 16}{x - 4} = x + 4\\) pour \\(x \\neq 4\\) : on pose \\(g(4) = 8\\)."] },
      predict: { q: "\\(f(x) = x + 1\\) si \\(x < 2\\), et \\(f(x) = x^2 + k\\) si \\(x \\ge 2\\). Pour que la courbe ne fasse pas de saut en 2…", choices: ["les deux formules doivent donner la même valeur en 2", "il faut k = 0", "c'est impossible"], good: 0,
        why: "À gauche, la courbe arrive à la hauteur 2 + 1 = 3 ; à droite, elle part de 4 + k. Sans saut : 4 + k = 3." },
      defis: ["\\(f(x) = x + 1\\) si \\(x < 2\\), et \\(f(x) = x^2 + k\\) si \\(x \\ge 2\\). Pour quelle valeur de \\(k\\) est-elle continue ?", "\\(g(x) = \\frac{x^2 - 16}{x - 4}\\) pour \\(x \\neq 4\\). Quelle valeur faut-il donner à \\(g(4)\\) pour que \\(g\\) soit continue ?"],
      play: toi(["Valeur à gauche en 2 : 2 + 1 = 3 ; valeur à droite : 4 + k", "x² − 16 = (x − 4)(x + 4) : simplifie, puis prends la limite en 4"],
        [W(-1, "4 + k = 3, donc k = −1 : les deux morceaux se rejoignent au point (2 ; 3)."), W(8, "g(x) = x + 4 pour x ≠ 4, de limite 8 : on pose g(4) = 8.")]),
    },
    etudefct: {
      retiens: { regle: "Les extremums se cherchent là où \\(f'\\) s'annule en changeant de signe : de + à −, maximum local ; de − à +, minimum local. La valeur de l'extremum est \\(f(a)\\), pas \\(a\\).", exemple: ["\\(f(x) = x^3 - 12x\\) : \\(f'(x) = 3(x - 2)(x + 2)\\), maximum local \\(f(-2) = 16\\).", "\\(g(x) = x + \\frac{9}{x}\\) (\\(x > 0\\)) : \\(g'(x) = 1 - \\frac{9}{x^2}\\), minimum \\(g(3) = 6\\)."] },
      predict: { q: "\\(f(x) = x^3 - 12x\\). Où chercher ses extremums ?", choices: ["là où f'(x) = 0", "là où f(x) = 0", "en x = 0"], good: 0,
        why: "Un extremum est un sommet ou un creux : la tangente y est horizontale, donc f'(x) = 0 (et f' change de signe)." },
      defis: ["\\(f(x) = x^3 - 12x\\). Quelle est la valeur de son maximum local ?", "\\(g(x) = x + \\frac{9}{x}\\) pour \\(x > 0\\). Quelle est la valeur de son minimum ?"],
      play: toi(["f'(x) = 3x² − 12 = 3(x − 2)(x + 2) : f' passe de + à − en −2. Calcule f(−2)", "g'(x) = 1 − 9 ÷ x² s'annule en x = 3. Calcule g(3)"],
        [W(16, "f(−2) = −8 + 24 = 16 : maximum local au point (−2 ; 16)."), W(6, "g(3) = 3 + 3 = 6 : minimum au point (3 ; 6).")]),
    },
    derivseconde: {
      retiens: { regle: "Point d'inflexion : la courbe change de concavité, \\(f''\\) s'annule en changeant de signe. \\(f'' > 0\\) : courbe tournée vers le haut (convexe) ; \\(f'' < 0\\) : vers le bas (concave).", exemple: ["\\(f(x) = x^3 - 6x^2 + 5x\\) : \\(f''(x) = 6x - 12\\), inflexion en \\(x = 2\\).", "\\(f(x) = x^4 - 6x^2\\) : \\(f''(x) = 12x^2 - 12\\), inflexions en \\(x = \\pm 1\\)."] },
      predict: { q: "La courbe de \\(f(x) = x^3\\) est tournée vers le bas pour \\(x < 0\\) et vers le haut pour \\(x > 0\\). Que vaut \\(f''(0)\\) ?", choices: ["0", "3", "6"], good: 0,
        why: "f'(x) = 3x², f''(x) = 6x : f''(0) = 0, et f'' passe de − à + en 0. C'est un point d'inflexion." },
      defis: ["\\(f(x) = x^3 - 6x^2 + 5x\\). En quelle abscisse a-t-elle un point d'inflexion ?", "\\(f(x) = x^4 - 6x^2\\). Quelle est la plus grande abscisse d'un point d'inflexion ?"],
      play: toi(["f'(x) = 3x² − 12x + 5, puis f''(x) = 6x − 12 : résous f''(x) = 0", "f''(x) = 12x² − 12 : résous f''(x) = 0"],
        [W(2, "f''(x) = 6x − 12 s'annule en 2 et change de signe : inflexion en x = 2."), W(1, "12x² − 12 = 0 pour x = −1 ou x = 1 (f'' change de signe en chacun) : la plus grande est 1.")]),
    },
    combi: {
      retiens: { regle: "L'ordre compte (podium) : \\(n(n - 1)(n - 2) \\ldots\\). L'ordre ne compte pas (groupe) : on divise par le nombre d'ordres d'un même groupe, \\(k!\\) : \\(\\binom{n}{k}\\).", exemple: ["Podium avec 6 finalistes : \\(6 \\cdot 5 \\cdot 4 = 120\\).", "3 délégués parmi 7 : \\(\\binom{7}{3} = \\frac{7 \\cdot 6 \\cdot 5}{3!} = 35\\)."] },
      predict: { q: "Trois coureurs A, B et C. Combien d'ordres d'arrivée sont possibles ?", choices: ["6", "3", "9"], good: 0,
        why: "ABC, ACB, BAC, BCA, CAB, CBA : 3 choix pour la 1re place, 2 pour la 2e, 1 pour la 3e, soit 3 · 2 · 1 = 6." },
      defis: ["6 athlètes disputent une finale. Combien de podiums (or, argent, bronze) sont possibles ?", "Combien de groupes de 3 délégués (sans rôle particulier) peut-on former dans un groupe de 7 élèves ?"],
      play: toi(["6 choix pour l'or, puis 5 pour l'argent, puis 4 pour le bronze", "Si l'ordre comptait : 7 · 6 · 5. Chaque groupe est compté 3! = 6 fois"],
        [W(120, "6 · 5 · 4 = 120 : ici l'ordre compte."), W(35, "7 · 6 · 5 = 210 ordres, divisés par 3! = 6 : 35 groupes.")]),
    },
    probaxiomes: {
      retiens: { regle: "Issues équiprobables : \\(P(A) = \\frac{\\text{cas favorables}}{\\text{cas possibles}}\\). Réunion : \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\).", exemple: ["Deux dés, somme 7 : 6 couples sur 36, \\(P = \\frac{1}{6}\\).", "\\(P(A \\cup B) = 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7\\)"] },
      predict: { q: "On lance deux dés et on additionne. Quelle somme est la plus probable ?", choices: ["7", "12", "elles sont toutes aussi probables"], good: 0,
        why: "7 s'obtient de 6 façons (1 + 6, 2 + 5, …, 6 + 1) ; 12 d'une seule (6 + 6). Les 36 couples sont équiprobables, pas les sommes." },
      defis: ["On lance deux dés. Probabilité d'obtenir une somme de 7 ? (fraction acceptée)", "\\(P(A) = 0{,}5\\), \\(P(B) = 0{,}4\\) et \\(P(A \\cap B) = 0{,}2\\). Que vaut \\(P(A \\cup B)\\) ?"],
      play: toi(["Compte les couples (dé 1 ; dé 2) de somme 7 parmi les 36", "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)"],
        [W(1 / 6, "6 couples sur 36 : (1 ; 6), (2 ; 5), (3 ; 4), (4 ; 3), (5 ; 2), (6 ; 1). P = 6/36 = 1/6."), W(0.7, "0,5 + 0,4 − 0,2 = 0,7 : l'intersection est retirée une fois.")]),
    },
    probarbre: {
      retiens: { regle: "Le long d'un chemin de l'arbre, on multiplie les probabilités. Avec remise, l'urne est la même au 2e tirage ; sans remise, il y a un objet de moins.", exemple: ["3 rouges, 2 bleues, avec remise : \\(P(RR) = \\frac{3}{5} \\cdot \\frac{3}{5} = 0{,}36\\).", "Sans remise : \\(P(RR) = \\frac{3}{5} \\cdot \\frac{2}{4} = 0{,}3\\)."] },
      predict: { q: "Une urne contient 3 boules rouges et 2 bleues. On tire deux boules avec remise. La probabilité de tirer deux rouges vaut…", choices: ["3/5 · 3/5 = 0,36", "3/5 + 3/5", "3/5"], good: 0,
        why: "Sur l'arbre, le chemin rouge puis rouge a la probabilité 3/5 · 3/5 : le long d'un chemin, on multiplie." },
      defis: ["Urne : 3 boules rouges et 2 bleues. Deux tirages avec remise : probabilité de tirer deux rouges ?", "Même urne, deux tirages sans remise : probabilité de tirer deux rouges ?"],
      play: toi(["Avec remise, chaque tirage donne rouge avec la probabilité 3/5", "Sans remise : 3/5 au 1er tirage, puis il reste 2 rouges sur 4"],
        [W(0.36, "3/5 · 3/5 = 9/25 = 0,36."), W(0.3, "3/5 · 2/4 = 6/20 = 0,3 : moins qu'avec remise.")]),
    },
  });
})();

// Leçons actives de la 3e et de la 4e Collège, 2e série (25.11, agent act34) : les 13 notions qui n'en avaient pas.
// 3e (src/ch3c_geo.js, géométrie vectorielle de l'espace) : vect3d, colin, droite3d, plans, posrel, pscal3d, distances,
// sphere ; vraies manipulations (curseurs) sur une figure en perspective (projection orthogonale : la sphère reste un
// cercle). 4e (src/ch4c_ana.js) : intparties, intsubst (« Essaie sur la figure » : l'aire se compare à la réponse
// tapée), etudelnexp, eqdiff, statdesc (curseurs). ineqpoly (2e) est dans act_2c.js (paquet 13).
// Même moteur que act_col34.js (briques graph, hunt et slide recopiées : fichier autonome). Chaque leçon a son propre
// « Retiens » (règle du 15.11 : seulement ce que les défis ont présenté). Paquet de chargement « 14 » (build.py).
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
  /* triplet (a ; b ; c) */
  const tri = (p) => "(" + p.map(nb).join(" ; ") + ")";
  /* racine : entier si carré parfait, sinon √n ≈ … */
  /* « = 3 » si carré parfait, sinon « ≈ 4,69 » (après √n) */
  const rq = (n) => { const r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? " = " + nb(Math.round(r)) : " ≈ " + nb(+r.toFixed(2)); };
  const rt = (n) => { const r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? nb(Math.round(r)) : "√" + nb(n) + " ≈ " + nb(+r.toFixed(2)); };
  /* signe devant un nombre dans une somme : « + 3 », « − 2 » */
  const sg = (v) => (v < 0 ? " − " + nb(-v) : " + " + nb(v));
  const par = (v) => (v < 0 ? "(" + nb(v) + ")" : nb(v));
  const add = (a, b) => a.map((v, i) => v + b[i]), mul = (k, a) => a.map((v) => k * v), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  // Repère 2D (copie de act_col34.js) : o = { xr, yr, H, gx, gy, lx, ly, fns, vl, hl, segs, pts, polys, fy, fx, pad, lab }
  let UID = 0;
  const graph = (o) => {
    const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
    const H = o.H || 230, uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c34b" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb, fx = o.fx || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    let tk = "";
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) tk += T(X(v), Math.min(Y(y0) + 13, H - 2), fx(+v.toFixed(6)), "middle", 10, "f-txt f-tick");
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) tk += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10, "f-txt f-tick");
    for (const [P, cls, op] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x) + "," + Y(Math.max(yr[0], Math.min(yr[1], y)))).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:${op || 0.7}"/>`;
    const span = yr[1] - yr[0];
    for (const F of o.fns || []) {
      const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 300; let d = "", prev = null;
      for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
        if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
        d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
      if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    }
    for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
    for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
    for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
    let p = "";
    for (const [x, y, lab, cls, pos] of o.pts || []) {
      if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
      p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
      if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
    }
    for (const [x, y, t, a] of o.txt || []) p += T(X(x), Y(y), t, a || "middle", 11);
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${tk}${p}`, o.lab || "repère");
  };

  // ---------- brique « hunt » (réponse tapée ; avec une figure : « Essaie sur la figure ») ----------
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || "Pas encore : regarde la figure, puis recalcule."); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");

  // ---------- brique « slide » (curseurs ; copie de act_col34.js) ----------
  // o = { ctl(step) → [{ k, lab, min, max, step }], init(step) → état, fig(st, step), out(st, step), goal[step](st) → message ou "",
  //       miss(st, step) → indice, ask[step] : { q, ans, tol, ok, no }, fmt(k, v, step), note }
  const slide = (o) => (box, onWin) => {
    let step = 0, st = null, asking = false;
    const start = () => {
      st = Object.assign({}, o.init(step)); asking = false;
      const cs = o.ctl(step);
      box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
        `<div class="act-out s2c-out" aria-live="polite"></div><div class="s2c-ask"></div><div class="small muted">${o.note || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
      box.querySelectorAll('input[type="range"]').forEach((inp) => {
        inp.oninput = () => { if (asking) { inp.value = st[inp.dataset.k]; return; } st[inp.dataset.k] = +inp.value; refresh(); };
        inp.onchange = () => { if (asking) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
      });
      refresh();
    };
    const refresh = () => {
      box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
      box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
      box.querySelector(".s2c-out").innerHTML = o.out(st, step);
    };
    const win = (mm) => { onWin(step, mm); step++; if (step < o.goal.length) start(); else { asking = true; box.querySelector(".s2c-ask").innerHTML = ""; } };
    const check = () => {
      if (asking || step >= o.goal.length) return;
      const mm = o.goal[step](st);
      if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
      const A = o.ask && o.ask[step];
      if (!A) { win(mm); return; }
      asking = true; const el = box.querySelector(".act-hint"); if (el) el.textContent = "";
      const ab = box.querySelector(".s2c-ask");
      ab.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${mm}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
      if (typeof typeset === "function" && /\\\(/.test(A.q)) typeset(ab);
      const inp = ab.querySelector("input"), go = () => { const v = parseNum(inp.value);
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        if (Math.abs(v - A.ans) <= (A.tol || 1e-9)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
      actAnswerBind(ab, go);
    };
    start();
  };

  // ---------- figure de l'espace ----------
  // Projection orthogonale (azimut 30°, élévation 20°) : x vers l'avant à gauche, y vers la droite, z vers le haut ;
  // une sphère reste un cercle. scene(box) cadre la boîte [[x0, x1], [y0, y1], [z0, z1]] (fixe pendant le geste, pour
  // que la figure ne saute pas) dans 320 px de large ; les méthodes ajoutent des éléments en coordonnées de l'espace.
  const CA = Math.cos(Math.PI / 6), SA = Math.sin(Math.PI / 6), CB = Math.cos(Math.PI / 9), SB = Math.sin(Math.PI / 9);
  const raw = (q) => [q[1] * CA - q[0] * SA, -(q[2] * CB - (q[0] * CA + q[1] * SA) * SB)];
  const scene = (box, opt = {}) => {
    const W = 320, m = 16; let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
    for (const x of box[0]) for (const y of box[1]) for (const z of box[2]) { const [u, v] = raw([x, y, z]); a = Math.min(a, u); b = Math.max(b, u); c = Math.min(c, v); d = Math.max(d, v); }
    const s = Math.min(opt.s || 60, (W - 2 * m) / (b - a), ((opt.H || 290) - 2 * m) / (d - c)), H = Math.round((d - c) * s + 2 * m), ox = (W - (b - a) * s) / 2 - a * s, oy = m - c * s;
    const p = (q) => { const [u, v] = raw(q); return [+(ox + u * s).toFixed(1), +(oy + v * s).toFixed(1)]; };
    let back = "", g = "", top = "";
    const S = {
      p, s,
      line(A, B, cls = "f-line", w = 1.6, dash) { const u = p(A), v = p(B); g += L(u[0], u[1], v[0], v[1], cls, w, dash); return S; },
      path(Ps, cls = "f-line", w = 1.6, dash, close) { g += `<path d="${Ps.map((q, i) => (i ? "L" : "M") + p(q).join(",")).join(" ")}${close ? " Z" : ""}" class="${cls}" fill="none" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`; return S; },
      poly(Ps, cls = "f-soft", op = 0.5) { back += `<polygon points="${Ps.map((q) => p(q).join(",")).join(" ")}" class="${cls}" style="stroke:none;opacity:${op}"/>`; return S; },
      arrow(A, B, cls = "f-blue", w = 2.6) {
        const u = p(A), v = p(B), dx = v[0] - u[0], dy = v[1] - u[1], n = Math.hypot(dx, dy); if (n < 1) return S;
        const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), e = [v[0] - ex * k, v[1] - ey * k];
        g += L(u[0], u[1], e[0].toFixed(1), e[1].toFixed(1), cls, w) + `<polygon points="${v[0]},${v[1]} ${(e[0] - ey * 5).toFixed(1)},${(e[1] + ex * 5).toFixed(1)} ${(e[0] + ey * 5).toFixed(1)},${(e[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" ? "fill:var(--blue)" : ""}"/>`;
        return S; },
      dot(A, lab, cls = "f-dot", pos = "r", r = 4.5) {
        const u = p(A); top += `<circle cx="${u[0]}" cy="${u[1]}" r="${r}" class="${cls}"/>`;
        if (lab) top += T(u[0] + (pos === "l" ? -8 : 8), u[1] + (pos === "b" ? 16 : -7), lab, pos === "l" ? "end" : "start", 12);
        return S; },
      text(A, t, a = "middle", sz = 11) { const u = p(A); top += T(u[0], u[1], t, a, sz); return S; },
      raw(svgPart) { g += svgPart; return S; },
      /* traits de rappel d'un point : jusqu'au plan xOy, puis vers les axes x et y */
      guides(A) { const [x, y, z] = A; if (z) S.line([x, y, 0], A, "f-line", 1, "3 3"); if (x || y) S.line([x, 0, 0], [x, y, 0], "f-line", 1, "3 3").line([0, y, 0], [x, y, 0], "f-line", 1, "3 3"); return S; },
      svg(lab) { return svg(W, H, back + g + top, lab); },
    };
    if (opt.axes !== false) {
      const N = ["x", "y", "z"];
      for (let i = 0; i < 3; i++) {
        const lo = Math.min(0, box[i][0]), hi = Math.max(0, box[i][1]), A = [0, 0, 0], B = [0, 0, 0]; A[i] = lo; B[i] = hi;
        S.line(A, B, "f-line", 1.1); const E = [0, 0, 0]; E[i] = hi; const u = p(E); top += T(u[0] + (i === 0 ? -6 : i === 1 ? 8 : 0), u[1] + (i === 2 ? -4 : i === 0 ? 12 : 4), N[i], "middle", 12);
        if (opt.ticks !== false) for (let k = Math.ceil(lo); k <= hi - 0.5; k++) { if (!k) continue; const Q = [0, 0, 0]; Q[i] = k; const q = p(Q);
          back += `<circle cx="${q[0]}" cy="${q[1]}" r="1.6" class="f-dot" style="opacity:0.55"/>`;
          if (opt.ticks === "all" || k === 1) top += T(q[0] + (i === 2 ? -6 : 0), q[1] + (i === 2 ? 3 : 12), nb(k), i === 2 ? "end" : "middle", 9, "f-txt f-tick"); }
      }
    }
    return S;
  };
  /* morceau de droite A + t·u gardé dans la boîte (t dans [t0 ; t1]) */
  const clip = (A, u, box, t0 = -50, t1 = 50) => {
    for (let i = 0; i < 3; i++) {
      if (Math.abs(u[i]) < 1e-12) { if (A[i] < box[i][0] || A[i] > box[i][1]) return null; continue; }
      const a = (box[i][0] - A[i]) / u[i], b = (box[i][1] - A[i]) / u[i]; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
    }
    return t0 < t1 ? [add(A, mul(t0, u)), add(A, mul(t1, u))] : null;
  };
  const inBox = (P, box) => P.every((v, i) => v >= box[i][0] - 1e-9 && v <= box[i][1] + 1e-9);

  // =====================================================================================================
  // 3e Collège · Géométrie vectorielle de l'espace (ch3c_geo.js)
  // =====================================================================================================
  const BV = [[0, 4], [-1, 5], [-2, 3]], A1 = [1, 2, 0];
  const BC = [[0, 5], [-1, 3], [-1, 4]], CA1 = [1, 0, 2], CB1 = [3, 1, 1];
  const BW = [[-2, 2], [-4, 4], [-3, 4]], U1 = [1, 0, 1], V1 = [0, 2, 1], W1 = [2, -2, 1];
  const BD = [[-1, 6], [-3, 1], [-1, 5]], DA = [1, 0, 4], DU = [2, -1, -2], DB = [-1, -3, 2], DV = [2, 1, 0];
  const BP = [[0, 8], [0, 4], [0, 4]], BP2 = [[0, 4.5], [0, 4.5], [0, 4.5]];
  const BR = [[-1, 5], [-1, 5], [-1, 5]];
  const BS1 = [[0, 2.2], [0, 2.2], [-3, 3]], BS2 = [[0, 1.5], [0, 1.5], [-3, 3]];
  const BDP = [[-2, 4], [-3, 3], [-2, 3]], H0 = [1, 0, 0], E1 = [1, 0, -1], E2 = [1, -2, 0], PD = [3, 1, 2];
  const BDL = [[-1, 5], [-1, 4], [0, 2]], LA = [1, 0, 0], LU = [1, 1, 0], LP = [5, 0, 1];
  const BSP = [[-5.5, 5.5], [-5.5, 5.5], [-6, 6]];
  /* trace d'un plan ax + by + cz = d (a, b, c, d > 0) : triangle de ses points sur les axes */
  const traces = (S, a, b, c, d, cls = "f-fill2") => { const P = [[d / a, 0, 0], [0, d / b, 0], [0, 0, d / c]]; S.poly(P, cls, 0.45).path(P, "f-line", 1.4, null, true); return P; };
  /* arc de l'angle entre deux vecteurs issus de O */
  const arc = (S, u, v, r) => { const nu = Math.hypot(...u), nv = Math.hypot(...v), a = mul(1 / nu, u), b = mul(1 / nv, v), al = Math.acos(Math.max(-1, Math.min(1, dot(a, b)))); if (al < 1e-6) return;
    const P = []; for (let i = 0; i <= 24; i++) { const t = (al * i) / 24, w = add(mul(Math.sin(al - t) / Math.sin(al), a), mul(Math.sin(t) / Math.sin(al), b)); P.push(mul(r, w)); }
    if (Math.abs(al - Math.PI) < 1e-6) return; S.path(P, "f-accent", 1.6); };
  const ang = (u, v) => (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (Math.hypot(...u) * Math.hypot(...v))))) * 180) / Math.PI;

  Object.assign(ACTIVE, {
    vect3d: {
      retiens: { regle: "Dans un repère de l'espace, \\(\\overrightarrow{AB} = B - A\\) : on soustrait les coordonnées de \\(A\\) à celles de \\(B\\), une par une. La norme de \\(\\vec{u} = (a \\,;\\, b \\,;\\, c)\\) vaut \\(\\|\\vec{u}\\| = \\sqrt{a^2 + b^2 + c^2}\\) (Pythagore deux fois) : c'est la distance \\(AB\\). Le milieu de \\([AB]\\) est la moyenne des coordonnées de \\(A\\) et de \\(B\\).",
        exemple: ["\\(A(1 \\,;\\, 2 \\,;\\, 0)\\), \\(B(3 \\,;\\, -1 \\,;\\, 2)\\) : \\(\\overrightarrow{AB} = (2 \\,;\\, -3 \\,;\\, 2)\\).", "\\(\\|(1 \\,;\\, 2 \\,;\\, 2)\\| = \\sqrt{1 + 4 + 4} = 3\\).", "Milieu de \\(A(1 \\,;\\, 2 \\,;\\, -1)\\) et \\(B(3 \\,;\\, 0 \\,;\\, 4)\\) : \\(\\left(2 \\,;\\, 1 \\,;\\, \\frac{3}{2}\\right)\\)."],
        piege: "\\(\\overrightarrow{AB} = B - A\\), pas \\(A - B\\) (ce serait \\(\\overrightarrow{BA}\\)) : arrivée moins départ." },
      predict: { q: "A(1 ; 2 ; −1) et B(3 ; 0 ; 4). Les composantes du vecteur AB sont…", choices: ["(2 ; −2 ; 5)", "(4 ; 2 ; 3)", "(−2 ; 2 ; −5)"], good: 0,
        why: "On soustrait les coordonnées de A à celles de B : (3 − 1 ; 0 − 2 ; 4 − (−1)) = (2 ; −2 ; 5). (4 ; 2 ; 3) est la somme, (−2 ; 2 ; −5) le vecteur BA." },
      defis: ["A(1 ; 2 ; 0) est fixé. Déplace B pour que \\(\\overrightarrow{AB} = (2 \\,;\\, -3 \\,;\\, 2)\\).", "Déplace B pour que la distance AB vaille exactement 3, avec les trois composantes de \\(\\overrightarrow{AB}\\) non nulles."],
      play: slide({
        ctl: () => [{ k: "x", lab: "x de B", min: 0, max: 4 }, { k: "y", lab: "y de B", min: -1, max: 5 }, { k: "z", lab: "z de B", min: -2, max: 3 }],
        init: (s) => (s ? { x: 3, y: -1, z: 2 } : { x: 4, y: 4, z: 3 }),
        fig: (st) => { const B = [st.x, st.y, st.z], u = [B[0] - 1, B[1] - 2, B[2]], S = scene(BV);
          S.guides(B).path([A1, add(A1, [u[0], 0, 0]), add(A1, [u[0], u[1], 0]), B], "f-blue", 1.6, "5 4");
          if (u.some((v) => v)) S.arrow(A1, B, "f-accent");
          return S.dot(A1, "A", "f-dot", "l").dot(B, "B(" + B.map(nb).join(" ; ") + ")", "f-fill2", "r").svg("vecteur AB dans l'espace"); },
        out: (st) => { const u = [st.x - 1, st.y - 2, st.z], n2 = dot(u, u);
          return "Vecteur AB = B − A = (" + nb(st.x) + " − 1 ; " + nb(st.y) + " − 2 ; " + nb(st.z) + " − 0) = <b>" + tri(u) + "</b><br>AB = √(" + u.map((v) => par(v) + "²").join(" + ") + ") = √" + nb(n2) + "<b>" + rq(n2) + "</b>" + '<br><span class="small">en bleu : on avance selon x, puis selon y, puis selon z (Pythagore deux fois)</span>'; },
        goal: [(st) => (st.x === 3 && st.y === -1 && st.z === 2 ? "B = A + (2 ; −3 ; 2) = (3 ; −1 ; 2) : on ajoute les composantes à A, ou B − A = (2 ; −3 ; 2)." : ""),
          (st) => { const u = [st.x - 1, st.y - 2, st.z]; return dot(u, u) === 9 && u.every((v) => v) ? "AB = " + tri(u) + " : √(" + u.map((v) => v * v).join(" + ") + ") = √9 = 3. Pythagore deux fois : d'abord dans le plan horizontal, puis avec la hauteur." : ""; }],
        miss: (st, s) => { const u = [st.x - 1, st.y - 2, st.z];
          if (s === 0) { const k = [0, 1, 2].find((i) => u[i] !== [2, -3, 2][i]); return "Composante en " + "xyz"[k] + " : " + nb(u[k]) + " au lieu de " + nb([2, -3, 2][k]) + "."; }
          return dot(u, u) === 9 ? "AB = 3, mais une composante est nulle. Cherche trois carrés non nuls dont la somme fait 9." : "AB² = " + nb(dot(u, u)) + " : il faut AB² = 9."; },
        ask: [null, { q: "A(1 ; 2 ; −1) et B(3 ; 0 ; 4). Tape la cote (troisième coordonnée) du milieu de [AB].", ans: 1.5, ok: "(−1 + 4) ÷ 2 = 3/2 : le milieu est (2 ; 1 ; 3/2), la moyenne des coordonnées.", no: "Milieu : moyenne des deux cotes, (−1 + 4) ÷ 2." }] }),
    },

    colin: {
      retiens: { regle: "\\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires s'il existe \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\) : les trois rapports de composantes sont égaux. \\(A\\), \\(B\\), \\(C\\) sont alignés si \\(\\overrightarrow{AC} = t\\,\\overrightarrow{AB}\\). Trois vecteurs sont coplanaires si l'un est combinaison des deux autres : \\(\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}\\) ; deux composantes donnent \\(\\alpha\\) et \\(\\beta\\), la troisième vérifie.",
        exemple: ["\\((2 \\,;\\, -1 \\,;\\, 3)\\) et \\((6 \\,;\\, -3 \\,;\\, 8)\\) ne sont pas colinéaires : \\(\\frac{8}{3} \\neq 3\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 2)\\), \\(B(3 \\,;\\, 1 \\,;\\, 1)\\), \\(C(5 \\,;\\, 2 \\,;\\, 0)\\) : \\(\\overrightarrow{AC} = 2\\,\\overrightarrow{AB}\\), alignés.", "\\((2 \\,;\\, -2 \\,;\\, 1) = 2(1 \\,;\\, 0 \\,;\\, 1) - (0 \\,;\\, 2 \\,;\\, 1)\\) : coplanaires."],
        piege: "Deux équations suffisent à trouver \\(\\alpha\\) et \\(\\beta\\) (ou \\(k\\)) ; il faut toujours vérifier la troisième." },
      predict: { q: "Les vecteurs (2 ; −1 ; 3) et (6 ; −3 ; 8) sont-ils colinéaires ?", choices: ["Oui", "Non"], good: 1,
        why: "6 = 3 · 2 et −3 = 3 · (−1), mais 8 ≠ 3 · 3 = 9. Les trois rapports doivent être égaux : ils ne le sont pas." },
      defis: ["A(1 ; 0 ; 2) et B(3 ; 1 ; 1) sont fixés. Le point C a pour abscisse 5 : règle ses deux autres coordonnées pour que A, B et C soient alignés.", "\\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 2 \\,;\\, 1)\\). Règle \\(\\alpha\\) et \\(\\beta\\) pour que \\(\\alpha\\vec{u} + \\beta\\vec{v}\\) arrive sur \\(\\vec{w} = (2 \\,;\\, -2 \\,;\\, 1)\\)."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "α", min: -2, max: 2 }, { k: "b", lab: "β", min: -2, max: 2 }] : [{ k: "y", lab: "y de C", min: -1, max: 3 }, { k: "z", lab: "z de C", min: -1, max: 4 }]),
        init: (s) => (s ? { a: 1, b: 1 } : { y: 0, z: 3 }),
        fig: (st, s) => {
          if (!s) { const C = [5, st.y, st.z], S = scene(BC), seg = clip(CA1, [2, 1, -1], BC, -1, 2.5);
            if (seg) S.line(seg[0], seg[1], "f-line", 1.2, "6 4");
            return S.guides(C).arrow(CA1, CB1, "f-blue").arrow(CA1, C, "f-accent", 2).dot(CA1, "A", "f-dot", "l").dot(CB1, "B", "f-dot", "r").dot(C, "C", "f-fill2", "r").svg("points A, B et C dans l'espace"); }
          const S = scene(BW), R = add(mul(st.a, U1), mul(st.b, V1)), k = 2.2;
          S.poly([add(mul(-k, U1), mul(-k, V1)), add(mul(k, U1), mul(-k, V1)), add(mul(k, U1), mul(k, V1)), add(mul(-k, U1), mul(k, V1))], "f-soft", 0.45);
          S.arrow([0, 0, 0], U1, "f-blue").arrow([0, 0, 0], V1, "f-blue").path([[0, 0, 0], mul(st.a, U1), R], "f-line", 1.4, "5 4");
          if (R.some((v) => v)) S.arrow([0, 0, 0], R, "f-accent", 2.2);
          return S.dot(W1, "w", "f-fill2", "r").text(add(U1, [0, 0, 0.3]), "u").text(add(V1, [0, 0.2, 0.3]), "v").svg("vecteurs u, v, et la combinaison αu + βv dans le plan qu'ils engendrent"); },
        out: (st, s) => {
          if (s) { const R = add(mul(st.a, U1), mul(st.b, V1)); return "αu + βv = " + nb(st.a) + " · (1 ; 0 ; 1) " + sg(st.b).trim() + " · (0 ; 2 ; 1) = <b>" + tri(R) + "</b><br>" + '<span class="small">le plan clair contient toutes les combinaisons de u et de v</span>'; }
          const AC = [4, st.y, st.z - 2], r = [4 / 2, AC[1] / 1, AC[2] / -1];
          return "Vecteur AB = (2 ; 1 ; −1), vecteur AC = " + tri(AC) + "<br>Rapports : 4 ÷ 2 = <b>2</b> ; " + nb(AC[1]) + " ÷ 1 = <b>" + nb(r[1]) + "</b> ; " + nb(AC[2]) + " ÷ (−1) = <b>" + nb(r[2]) + "</b>"; },
        goal: [(st) => (st.y === 2 && st.z === 0 ? "C(5 ; 2 ; 0) : vecteur AC = (4 ; 2 ; −2) = 2 · (2 ; 1 ; −1). Les trois rapports valent 2 : AC = 2·AB, les points sont alignés." : ""),
          (st) => (st.a === 2 && st.b === -1 ? "2 · (1 ; 0 ; 1) − (0 ; 2 ; 1) = (2 ; −2 ; 1), donc w est une combinaison de u et v, les trois vecteurs sont coplanaires." : "")],
        miss: (st, s) => (s ? "Composante x : α · 1 = 2 donne α ; composante y : 2β = −2 donne β. Puis vérifie z." : "Les trois rapports doivent être égaux : le premier vaut 2."),
        ask: [null, { q: "Avec les mêmes \\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 2 \\,;\\, 1)\\), le vecteur \\((3 \\,;\\, 4 \\,;\\, z)\\) est coplanaire avec eux. Tape z.", ans: 5, ok: "x : α = 3 ; y : 2β = 4, β = 2 ; donc z = α + β = 5.", no: "Trouve α avec la composante x, β avec la composante y, puis calcule la composante z de αu + βv." }] }),
    },

    droite3d: {
      retiens: { regle: "La droite passant par \\(A\\) et de vecteur directeur \\(\\vec{u}\\) a pour équations paramétriques \\(x = x_A + t\\,u_x\\), \\(y = y_A + t\\,u_y\\), \\(z = z_A + t\\,u_z\\) : chaque valeur de \\(t\\) donne un point. Un point est sur la droite si les trois équations donnent le même \\(t\\). La droite perce le plan \\(xOy\\) là où \\(z = 0\\). Deux droites sont sécantes s'il existe \\(t\\) et \\(s\\) qui donnent le même point.",
        exemple: ["\\(x = 1 + 2t\\), \\(y = -t\\), \\(z = 4 - 2t\\) : \\(z = 0\\) pour \\(t = 2\\), point \\((5 \\,;\\, -2 \\,;\\, 0)\\).", "\\(P(7 \\,;\\, -3 \\,;\\, -2)\\) : \\(t = 3\\) dans les trois équations, \\(P\\) est sur la droite.", "Les deux droites se coupent en \\((3 \\,;\\, -1 \\,;\\, 2)\\), pour \\(t = 1\\) et \\(s = 2\\)."],
        piege: "Les coefficients de \\(t\\) forment le vecteur directeur ; les termes constants, le point de départ. Une seule équation vérifiée ne suffit pas." },
      predict: { q: "Droite : x = 1 + 2t, y = −t, z = 2 + 3t. Pour t = 1, on obtient le point…", choices: ["(3 ; −1 ; 5)", "(2 ; −1 ; 3)", "(1 ; 0 ; 2)"], good: 0,
        why: "On remplace t par 1 : x = 1 + 2 = 3, y = −1, z = 2 + 3 = 5. (1 ; 0 ; 2) est le point de départ (t = 0), (2 ; −1 ; 3) le vecteur directeur." },
      defis: ["Droite d₁ : x = 1 + 2t, y = −t, z = 4 − 2t. Fais glisser t pour amener le point M dans le plan xOy (z = 0).", "Droite d₂ : x = −1 + 2s, y = −3 + s, z = 2. Règle t et s pour que M (sur d₁) et N (sur d₂) soient au même endroit."],
      play: slide({
        ctl: (s) => (s ? [{ k: "t", lab: "t (point M sur d₁)", min: -0.5, max: 2.5, step: 0.5 }, { k: "s", lab: "s (point N sur d₂)", min: 0, max: 3, step: 0.5 }] : [{ k: "t", lab: "t", min: -0.5, max: 2.5, step: 0.5 }]),
        init: (s) => (s ? { t: 0, s: 0 } : { t: 0 }),
        fig: (st, s) => { const S = scene(BD), M = add(DA, mul(st.t, DU)), s1 = clip(DA, DU, BD);
          if (!s) S.poly([[-1, -3, 0], [6, -3, 0], [6, 1, 0], [-1, 1, 0]], "f-soft", 0.4);
          if (s1) S.line(s1[0], s1[1], "f-blue", 2);
          if (s) { const s2 = clip(DB, DV, BD), N = add(DB, mul(st.s, DV)); if (s2) S.line(s2[0], s2[1], "f-line", 2); S.dot(N, "N", "f-fill2", "b"); S.text(add(DB, [0, -0.4, 0.4]), "d₂"); }
          else S.guides(M);
          return S.dot(DA, "A", "f-dot", "l").dot(M, "M", "f-dot", "r").text(add(DA, mul(-0.8, DU)), "d₁").svg("droite d₁" + (s ? " et droite d₂" : " et plan xOy")); },
        out: (st, s) => { const M = add(DA, mul(st.t, DU));
          if (!s) return "M = (1 + 2t ; −t ; 4 − 2t) = <b>" + tri(M) + "</b>" + (M[2] === 0 ? " : dans le plan xOy" : " : cote " + nb(M[2]));
          const N = add(DB, mul(st.s, DV)), d = Math.hypot(M[0] - N[0], M[1] - N[1], M[2] - N[2]);
          return "M = " + tri(M) + " sur d₁<br>N = " + tri(N) + " sur d₂<br>Distance MN ≈ <b>" + nb(+d.toFixed(2)) + "</b>"; },
        goal: [(st) => (st.t === 2 ? "z = 4 − 2t = 0 pour t = 2 : M(5 ; −2 ; 0). La droite perce le plan xOy en ce point." : ""),
          (st) => (st.t === 1 && st.s === 2 ? "t = 1 et s = 2 donnent le même point (3 ; −1 ; 2) : les droites d₁ et d₂ sont sécantes." : "")],
        miss: (st, s) => (s ? (st.t === 1 ? "M est déjà sur d₂ (z = 2) : déplace N jusqu'à lui." : "Sur d₂, z vaut toujours 2 : cherche d'abord t pour que M ait aussi z = 2.") : "On veut z = 4 − 2t = 0."),
        ask: [{ q: "La droite x = 3 − t, y = 2t, z = 6 + 3t perce le plan xOy en un point. Tape son abscisse x.", ans: 5, ok: "z = 6 + 3t = 0 pour t = −2, d'où x = 3 − (−2) = 5 : le point (5 ; −4 ; 0).", no: "Cherche d'abord t avec z = 0, puis calcule x." },
          { q: "Le point P(7 ; −3 ; −2) est-il sur d₁ ? Tape la valeur de t que donne l'équation en x, puis vérifie les deux autres.", ans: 3, ok: "1 + 2t = 7 donne t = 3 ; y = −3 ✓ ; z = 4 − 6 = −2 ✓. Les trois équations donnent le même t : P est sur d₁.", no: "x = 1 + 2t = 7 : résous en t." }] }),
    },

    plans: {
      retiens: { regle: "Un plan a une équation cartésienne \\(ax + by + cz = d\\) (ou \\(ax + by + cz + d = 0\\)) ; le vecteur \\(\\vec{n} = (a \\,;\\, b \\,;\\, c)\\) est orthogonal au plan (vecteur normal). Les plans parallèles ont les mêmes \\(a\\), \\(b\\), \\(c\\) : seul \\(d\\) change. Un point est dans le plan si ses coordonnées vérifient l'équation. Traces sur les axes : on annule deux coordonnées.",
        exemple: ["\\(x + 2y + 2z = d\\) passe par \\(P(2 \\,;\\, 1 \\,;\\, 1)\\) si \\(d = 2 + 2 + 2 = 6\\).", "Plan par \\((4 \\,;\\, 0 \\,;\\, 0)\\), \\((0 \\,;\\, 2 \\,;\\, 0)\\), \\((0 \\,;\\, 0 \\,;\\, 4)\\) : \\(x + 2y + z = 4\\).", "\\(2x - y + 3z - 6 = 0\\) coupe l'axe \\(Oz\\) en \\((0 \\,;\\, 0 \\,;\\, 2)\\)."],
        piege: "Pour un plan parallèle, on garde \\(a\\), \\(b\\), \\(c\\) et on recalcule \\(d\\) avec le nouveau point." },
      predict: { q: "Le plan 2x − y + 3z − 6 = 0 coupe l'axe Oz en…", choices: ["(0 ; 0 ; 2)", "(0 ; 0 ; 6)", "(0 ; 0 ; 3)"], good: 0,
        why: "Sur l'axe Oz, x = 0 et y = 0 : il reste 3z − 6 = 0, donc z = 2." },
      defis: ["Le plan π : x + 2y + 2z = d glisse parallèlement à lui-même quand d change. Règle d pour qu'il passe par P(2 ; 1 ; 1).", "Règle a, b et c pour que le plan ax + by + cz = 4 passe par les trois points (4 ; 0 ; 0), (0 ; 2 ; 0) et (0 ; 0 ; 4)."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "a", min: 1, max: 4 }, { k: "b", lab: "b", min: 1, max: 4 }, { k: "c", lab: "c", min: 1, max: 4 }] : [{ k: "d", lab: "d", min: 1, max: 8 }]),
        init: (s) => (s ? { a: 2, b: 1, c: 2 } : { d: 2 }),
        fig: (st, s) => {
          if (!s) { const S = scene(BP), P = [2, 1, 1], Q = traces(S, 1, 2, 2, st.d), G = mul(1 / 3, add(add(Q[0], Q[1]), Q[2]));
            S.arrow(G, add(G, mul(0.6, [1, 2, 2])), "f-accent", 2).text(add(G, [0.6, 1.5, 1.5]), "n");
            return S.guides(P).dot(P, "P", st.d === 6 ? "f-dot" : "f-fill2", "r").svg("plan x + 2y + 2z = d et point P"); }
          const S = scene(BP2); traces(S, st.a, st.b, st.c, 4);
          return S.dot([4, 0, 0], "", "f-fill2", "l", 5).dot([0, 2, 0], "", "f-fill2", "b", 5).dot([0, 0, 4], "", "f-fill2", "l", 5).svg("plan ax + by + cz = 4 et trois points visés"); },
        out: (st, s) => {
          if (!s) { const v = 6 - st.d; return "Traces : (" + nb(st.d) + " ; 0 ; 0), (0 ; " + nb(st.d / 2) + " ; 0), (0 ; 0 ; " + nb(st.d / 2) + ")<br>Vecteur normal n = (1 ; 2 ; 2), le même pour toute valeur de d<br>P est <b>" + (v === 0 ? "dans le plan" : v > 0 ? "au-delà du plan (du côté où pointe n)" : "en deçà du plan") + "</b>"; }
          return "Traces sur les axes : (" + nb(+(4 / st.a).toFixed(2)) + " ; 0 ; 0), (0 ; " + nb(+(4 / st.b).toFixed(2)) + " ; 0), (0 ; 0 ; " + nb(+(4 / st.c).toFixed(2)) + ")<br>" + '<span class="small">sur l\'axe Ox, y = z = 0 : ax = 4, donc x = 4 ÷ a</span>'; },
        goal: [(st) => (st.d === 6 ? "En P : 2 + 2 · 1 + 2 · 1 = 6, donc d = 6. Le plan glisse sans tourner : n = (1 ; 2 ; 2) ne change pas." : ""),
          (st) => (st.a === 1 && st.b === 2 && st.c === 1 ? "x + 2y + z = 4 : (4 ; 0 ; 0) donne 4 = 4, (0 ; 2 ; 0) donne 4, (0 ; 0 ; 4) donne 4. Vecteur normal (1 ; 2 ; 1)." : "")],
        miss: (st, s) => (s ? "Chaque trace se règle seule : sur Ox, a · 4 = 4 ; sur Oy, b · 2 = 4 ; sur Oz, c · 4 = 4." : "Remplace x, y, z par les coordonnées de P dans x + 2y + 2z."),
        ask: [{ q: "Plan parallèle à 2x − y + 3z − 6 = 0 passant par A(1 ; 1 ; 1) : il s'écrit 2x − y + 3z + d = 0. Tape d.", ans: -4, ok: "2 − 1 + 3 + d = 0, donc d = −4 : 2x − y + 3z − 4 = 0. Mêmes a, b, c ; seul d change.", no: "Remplace x, y, z par 1 dans 2x − y + 3z + d = 0." },
          { q: "Le plan 3x + 2y + 6z = 12 coupe l'axe Oy en (0 ; y ; 0). Tape y.", ans: 6, ok: "x = z = 0 : 2y = 12, y = 6.", no: "Sur l'axe Oy, x = 0 et z = 0." }] }),
    },

    posrel: {
      retiens: { regle: "Droite \\(A + t\\vec{u}\\) et plan de vecteur normal \\(\\vec{n}\\) : on remplace \\(x\\), \\(y\\), \\(z\\) de la droite dans l'équation du plan et on résout en \\(t\\). Si \\(\\vec{n} \\cdot \\vec{u} \\neq 0\\), la droite perce le plan en un seul point. Si \\(\\vec{n} \\cdot \\vec{u} = 0\\), elle est parallèle au plan : contenue dedans si \\(A\\) est dans le plan, sinon aucun point commun. Deux plans non parallèles se coupent selon une droite.",
        exemple: ["\\(A(1 \\,;\\, 0 \\,;\\, 0) + t(1 \\,;\\, -2 \\,;\\, 1)\\) et \\(x + y + z = 4\\) : \\(\\vec{n} \\cdot \\vec{u} = 0\\), aucun point commun.", "\\(x = 1 + t\\), \\(y = 2t\\), \\(z = 3 - t\\) et \\(x + y + z - 7 = 0\\) : \\(4 + 2t = 7\\), \\(t = \\frac{3}{2}\\)."],
        piege: "Droite parallèle au plan : \\(\\vec{u}\\) est orthogonal à \\(\\vec{n}\\) (\\(\\vec{n} \\cdot \\vec{u} = 0\\)), pas colinéaire à \\(\\vec{n}\\)." },
      predict: { q: "Deux plans distincts de l'espace, non parallèles, se coupent…", choices: ["selon une droite", "en un seul point", "jamais"], good: 0,
        why: "Deux plans qui se coupent ont toute une droite en commun (pense au sol et à un mur). Il faut trois plans pour se couper, en général, en un seul point." },
      defis: ["Plan π : x + y + z = 4. La droite d part de A(1 ; 0 ; 0) avec la direction \\(\\vec{u} = (1 \\,;\\, m \\,;\\, 1)\\). Règle m pour que d ne perce pas π.", "Règle m pour que d perce π au point d'abscisse x = 2."],
      play: slide({
        ctl: () => [{ k: "m", lab: "m", min: -4, max: 3 }],
        init: (s) => ({ m: s ? -2 : 0 }),
        fig: (st) => { const S = scene(BR), u = [1, st.m, 1], A = [1, 0, 0]; traces(S, 1, 1, 1, 4);
          const seg = clip(A, u, BR, -1, 6); if (seg) S.line(seg[0], seg[1], "f-blue", 2.2);
          S.arrow(A, add(A, u), "f-accent", 2).dot(A, "A", "f-dot", "l");
          if (st.m !== -2) { const t = 3 / (2 + st.m), I = add(A, mul(t, u)); if (inBox(I, BR)) S.dot(I, "I", "f-fill2", "r", 5.5); }
          return S.svg("plan x + y + z = 4 et droite d"); },
        out: (st) => { const nu = 2 + st.m;
          return "n = (1 ; 1 ; 1), u = (1 ; " + nb(st.m) + " ; 1) : n · u = 1 + " + par(st.m) + " + 1 = <b>" + nb(nu) + "</b><br>" + (nu === 0 ? "On remplace : (1 + t) + " + nb(st.m) + "t + t = 4 donne 1 = 4, impossible : <b>aucun point commun</b>." : "On remplace : (1 + t) + " + par(st.m) + "t + t = 4 donne " + nb(nu) + "t = 3, t = " + nb(+(3 / nu).toFixed(3)) + " : point I" + tri(add([1, 0, 0], mul(3 / nu, [1, st.m, 1])).map((v) => +v.toFixed(2)))); },
        goal: [(st) => (st.m === -2 ? "m = −2, donc n · u = 0 ; u est orthogonal à n, donc d est parallèle à π. Et A n'est pas dans π (1 + 0 + 0 ≠ 4) : aucun point commun." : ""),
          (st) => (st.m === 1 ? "m = 1 : 3t = 3, t = 1, donc I(2 ; 1 ; 1) ; on vérifie 2 + 1 + 1 = 4." : "")],
        miss: (st, s) => (s ? "x = 1 + t = 2 demande t = 1 : il faut alors (2 + m) · 1 = 3." : "La droite perce le plan tant que n · u ≠ 0."),
        ask: [{ q: "Même plan x + y + z = 4 et droite x = 2 + t, y = −1 + 2t, z = 3 − 3t. Tape \\(\\vec{n} \\cdot \\vec{u}\\).", ans: 0, ok: "n · u = 1 + 2 − 3 = 0 : parallèle. Et A(2 ; −1 ; 3) vérifie 2 − 1 + 3 = 4 : cette droite est contenue dans π.", no: "u = (1 ; 2 ; −3) et n = (1 ; 1 ; 1) : additionne les produits des composantes." },
          { q: "La droite x = 1 + t, y = 2t, z = 3 − t perce le plan x + y + z − 7 = 0. Pour quelle valeur de t ?", ans: 1.5, ok: "(1 + t) + 2t + (3 − t) − 7 = 0 donne 2t − 3 = 0, t = 3/2 : le point (5/2 ; 3 ; 3/2).", no: "Remplace x, y, z par leurs expressions en t dans l'équation du plan." }] }),
    },

    pscal3d: {
      retiens: { regle: "\\(\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Donc \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\), et \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\).",
        exemple: ["\\((1 \\,;\\, 2 \\,;\\, 2) \\cdot (2 \\,;\\, 1 \\,;\\, -2) = 2 + 2 - 4 = 0\\) : orthogonaux.", "\\((1 \\,;\\, 0 \\,;\\, 1)\\) et \\((0 \\,;\\, 1 \\,;\\, 1)\\) : \\(\\cos\\alpha = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}\\), \\(\\alpha = 60°\\).", "\\((2 \\,;\\, 1 \\,;\\, -2)\\) et \\((1 \\,;\\, 1 \\,;\\, 0)\\) : \\(\\cos\\alpha = \\frac{3}{3\\sqrt{2}}\\), \\(\\alpha = 45°\\)."],
        piege: "Le produit scalaire est un nombre, pas un vecteur. Négatif : l'angle est obtus." },
      predict: { q: "Que vaut le produit scalaire (1 ; 2 ; 2) · (2 ; 0 ; −1) ?", choices: ["0", "(2 ; 0 ; −2)", "3"], good: 0,
        why: "On multiplie composante par composante et on additionne : 1 · 2 + 2 · 0 + 2 · (−1) = 0. Un produit scalaire nul : les vecteurs sont orthogonaux." },
      defis: ["\\(\\vec{u} = (1 \\,;\\, 2 \\,;\\, 2)\\) et \\(\\vec{v} = (2 \\,;\\, 1 \\,;\\, z)\\). Règle z pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient orthogonaux.", "\\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 1 \\,;\\, k)\\). Règle k pour que l'angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\) vaille 60°."],
      play: slide({
        ctl: (s) => [s ? { k: "k", lab: "k", min: -3, max: 3 } : { k: "z", lab: "z", min: -3, max: 3 }],
        init: (s) => (s ? { k: 3 } : { z: 2 }),
        fig: (st, s) => { const u = s ? [1, 0, 1] : [1, 2, 2], v = s ? [0, 1, st.k] : [2, 1, st.z], S = scene(s ? BS2 : BS1, { s: 34, ticks: false });
          arc(S, u, v, s ? 0.55 : 0.9);
          return S.arrow([0, 0, 0], u, "f-blue").arrow([0, 0, 0], v, "f-accent").text(add(u, [0, 0.15, 0.25]), "u").text(add(v, [0, 0.2, 0.25]), "v").svg("vecteurs u et v issus de O et leur angle"); },
        out: (st, s) => { const u = s ? [1, 0, 1] : [1, 2, 2], v = s ? [0, 1, st.k] : [2, 1, st.z], p = dot(u, v), a = ang(u, v);
          return "u · v = " + u.map((x, i) => nb(x) + " · " + par(v[i])).join(" + ") + " = <b>" + nb(p) + "</b><br>‖u‖ = " + rt(dot(u, u)) + ", ‖v‖ = " + rt(dot(v, v)) + "<br>cos α = " + nb(+(p / Math.sqrt(dot(u, u) * dot(v, v))).toFixed(3)) + ", α ≈ <b>" + nb(+a.toFixed(1)) + "°</b>" + (p < 0 ? " (obtus : produit scalaire négatif)" : p === 0 ? " (droit)" : ""); },
        goal: [(st) => (st.z === -2 ? "2 + 2 + 2z = 0 pour z = −2, donc u · v = 0 et l'angle est droit." : ""),
          (st) => (st.k === 1 ? "k = 1, donc u · v = 1, ‖u‖ = ‖v‖ = √2, cos α = 1 ÷ 2, donc α = 60°." : "")],
        miss: (st, s) => (s ? (st.k === -1 ? "120° : cos α = −1/2, le produit scalaire est négatif. Cherche cos α = +1/2." : "On veut cos α = 1/2.") : "Orthogonaux : u · v = 0."),
        ask: [{ q: "\\(\\vec{a} = (3 \\,;\\, -1 \\,;\\, 2)\\) et \\(\\vec{b} = (1 \\,;\\, k \\,;\\, -2)\\) sont orthogonaux. Tape k.", ans: -1, ok: "3 − k − 4 = 0, donc k = −1.", no: "Écris a · b = 0 et résous en k." },
          { q: "Angle (en degrés) entre \\((2 \\,;\\, 1 \\,;\\, -2)\\) et \\((1 \\,;\\, 1 \\,;\\, 0)\\) ?", ans: 45, tol: 0.5, ok: "Produit scalaire 3, normes 3 et √2 : cos α = 3 ÷ (3√2) = 1/√2, α = 45°.", no: "cos α = (u · v) ÷ (‖u‖ ‖v‖), puis la touche arccos." }] }),
    },

    distances: {
      retiens: { regle: "La plus courte distance d'un point à un plan ou à une droite se mesure perpendiculairement. Distance de \\(P\\) au plan \\(ax + by + cz + d = 0\\) : \\(\\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}\\). Distance de \\(P\\) à la droite \\(A + t\\vec{u}\\) : le pied \\(H\\) correspond à \\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}\\), puis on calcule \\(PH\\).",
        exemple: ["\\(P(3 \\,;\\, 1 \\,;\\, 2)\\) et \\(2x + y + 2z - 2 = 0\\) : \\(\\frac{|6 + 1 + 4 - 2|}{3} = 3\\).", "\\(Q(1 \\,;\\, 1 \\,;\\, 1)\\), même plan : \\(\\frac{|2 + 1 + 2 - 2|}{3} = 1\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 0) + t(1 \\,;\\, 1 \\,;\\, 0)\\), \\(P(5 \\,;\\, 0 \\,;\\, 1)\\) : \\(t = \\frac{4}{2} = 2\\), \\(H(3 \\,;\\, 2 \\,;\\, 0)\\), \\(PH = 3\\)."],
        piege: "N'oublie ni la valeur absolue ni la racine de \\(a^2 + b^2 + c^2\\)." },
      predict: { q: "Distance de P(1 ; 1 ; 1) au plan 2x + y + 2z − 2 = 0 : on calcule |2 + 1 + 2 − 2| = 3, puis on divise par…", choices: ["3 = √(2² + 1² + 2²)", "9 = 2² + 1² + 2²", "5 = 2 + 1 + 2"], good: 0,
        why: "On divise par la norme du vecteur normal (2 ; 1 ; 2), √(4 + 1 + 4) = 3 : la distance vaut 3 ÷ 3 = 1." },
      defis: ["Le point H se promène dans le plan π : 2x + y + 2z − 2 = 0. Règle-le pour que la distance PH, avec P(3 ; 1 ; 2), soit la plus courte possible.", "H se promène maintenant sur la droite d : (1 ; 0 ; 0) + t·(1 ; 1 ; 0). Règle t pour que la distance PH, avec P(5 ; 0 ; 1), soit la plus courte possible."],
      play: slide({
        ctl: (s) => (s ? [{ k: "t", lab: "t", min: -1, max: 4, step: 0.5 }] : [{ k: "s", lab: "H : direction 1", min: -1.5, max: 1.5, step: 0.5 }, { k: "t", lab: "H : direction 2", min: -1.5, max: 1.5, step: 0.5 }]),
        init: (s) => (s ? { t: 0 } : { s: 1, t: -1 }),
        fig: (st, s) => {
          if (!s) { const S = scene(BDP, { ticks: false }), H = add(H0, add(mul(st.s, E1), mul(st.t, E2))), k = 1.6, ok = st.s === 0 && st.t === 0;
            S.poly([[-k, -k], [k, -k], [k, k], [-k, k]].map(([a, b]) => add(H0, add(mul(a, E1), mul(b, E2)))), "f-fill2", 0.4);
            return S.line(PD, H, ok ? "f-accent" : "f-line", 2.2).dot(PD, "P", "f-dot", "r").dot(H, "H", "f-fill2", "b").svg("plan π, point P et point H du plan"); }
          const S = scene(BDL, { ticks: false }), H = add(LA, mul(st.t, LU)), seg = clip(LA, LU, BDL);
          if (seg) S.line(seg[0], seg[1], "f-blue", 2);
          return S.line(LP, H, st.t === 2 ? "f-accent" : "f-line", 2.2).dot(LA, "A", "f-dot", "l").dot(LP, "P", "f-dot", "r").dot(H, "H", "f-fill2", "b").svg("droite d, point P et point H de la droite"); },
        out: (st, s) => {
          const H = s ? add(LA, mul(st.t, LU)) : add(H0, add(mul(st.s, E1), mul(st.t, E2))), P = s ? LP : PD, v = P.map((x, i) => x - H[i]);
          return "H" + tri(H) + " ; vecteur HP = " + tri(v) + "<br>PH = √" + nb(dot(v, v)) + "<b>" + rq(dot(v, v)) + "</b>"; },
        goal: [(st) => (st.s === 0 && st.t === 0 ? "PH = 3, le plus court. Alors HP = (2 ; 1 ; 2) : c'est le vecteur normal du plan, PH est perpendiculaire à π. Formule : |6 + 1 + 4 − 2| ÷ √(4 + 1 + 4) = 9 ÷ 3 = 3." : ""),
          (st) => (st.t === 2 ? "t = 2 : H(3 ; 2 ; 0), HP = (2 ; −2 ; 1) et HP · u = 2 − 2 + 0 = 0, perpendiculaire à d. PH = 3. Calcul direct : t = (AP · u) ÷ ‖u‖² = 4 ÷ 2 = 2." : "")],
        miss: (st, s) => (s ? "Le plus court : HP perpendiculaire à la direction (1 ; 1 ; 0) de d." : "Cherche la position où PH est le plus petit possible."),
        ask: [{ q: "Avec la formule : distance de Q(1 ; 1 ; 1) au même plan 2x + y + 2z − 2 = 0 ?", ans: 1, ok: "|2 + 1 + 2 − 2| ÷ √(4 + 1 + 4) = 3 ÷ 3 = 1.", no: "|ax + by + cz + d| ÷ √(a² + b² + c²), avec les coordonnées de Q." },
          { q: "Droite (0 ; 0 ; 0) + t·(1 ; 2 ; 2) et point P(5 ; 5 ; 6) : tape la valeur de t du pied H.", ans: 3, ok: "AP · u = 5 + 10 + 12 = 27 et ‖u‖² = 9, donc t = 3, H(3 ; 6 ; 6), PH = √5.", no: "t = (AP · u) ÷ ‖u‖²." }] }),
    },

    sphere: {
      retiens: { regle: "La sphère de centre \\(C(a \\,;\\, b \\,;\\, c)\\) et de rayon \\(r\\) a pour équation \\((x - a)^2 + (y - b)^2 + (z - c)^2 = r^2\\). Un plan à distance \\(\\delta < r\\) du centre la coupe selon un cercle de rayon \\(\\sqrt{r^2 - \\delta^2}\\) ; si \\(\\delta = r\\), il est tangent (un seul point commun). Le plan tangent en \\(T\\) a pour vecteur normal \\(\\overrightarrow{CT}\\).",
        exemple: ["\\((x - 1)^2 + y^2 + (z + 2)^2 = 9\\) : centre \\((1 \\,;\\, 0 \\,;\\, -2)\\), rayon 3.", "Rayon 5, plan à distance 3 du centre : cercle de rayon \\(\\sqrt{25 - 9} = 4\\).", "\\(C(1 \\,;\\, 2 \\,;\\, 0)\\), \\(T(3 \\,;\\, 3 \\,;\\, 2)\\) : plan tangent \\(2x + y + 2z - 13 = 0\\)."],
        piege: "Dans \\((z + 2)^2\\), la coordonnée du centre est \\(-2\\)." },
      predict: { q: "La sphère (x − 1)² + y² + (z + 2)² = 9 a pour centre…", choices: ["(1 ; 0 ; −2)", "(−1 ; 0 ; 2)", "(1 ; 0 ; 2)"], good: 0,
        why: "(z + 2)² = (z − (−2))² : la cote du centre est −2. Centre (1 ; 0 ; −2), rayon √9 = 3." },
      defis: ["Sphère de centre O(0 ; 0 ; 0) et de rayon 5. Règle la hauteur h du plan z = h pour que la section soit un cercle de rayon 4.", "Règle h pour que le plan z = h soit tangent à la sphère."],
      play: slide({
        ctl: () => [{ k: "h", lab: "Hauteur h du plan", min: -6, max: 6 }],
        init: () => ({ h: 0 }),
        fig: (st) => { const S = scene(BSP, { ticks: false }), r = 5, h = st.h, k = 5.5, c = S.p([0, 0, 0]);
          S.raw(`<circle cx="${c[0]}" cy="${c[1]}" r="${(r * S.s).toFixed(1)}" class="f-blue" fill="none" stroke-width="2"/>`);
          const ring = (z, rho) => { const P = []; for (let i = 0; i <= 48; i++) { const a = (i * Math.PI) / 24; P.push([rho * Math.cos(a), rho * Math.sin(a), z]); } return P; };
          S.path(ring(0, r), "f-line", 1, "4 4");
          S.poly([[-k, -k, h], [k, -k, h], [k, k, h], [-k, k, h]], "f-fill2", 0.35);
          if (Math.abs(h) < r) S.path(ring(h, Math.sqrt(r * r - h * h)), "f-accent", 2.4);
          if (Math.abs(h) === r) S.dot([0, 0, h], "", "f-dot", "r", 5);
          return S.dot([0, 0, 0], "O", "f-dot", "l", 3).line([0, 0, 0], [0, 0, h], "f-line", 1.2, "3 3").svg("sphère de rayon 5 et plan horizontal z = h"); },
        out: (st) => { const h = Math.abs(st.h);
          return "Distance du centre au plan : δ = |h| = " + nb(h) + "<br>" + (h < 5 ? "Section : cercle de rayon √(5² − " + nb(h) + "²) = √" + nb(25 - h * h) + "<b>" + rq(25 - h * h) + "</b>" : h === 5 ? "<b>Un seul point commun</b> : le plan est tangent." : "δ > 5 : <b>aucun point commun</b>."); },
        goal: [(st) => (Math.abs(st.h) === 3 ? "δ = 3 : √(25 − 9) = √16 = 4. Pythagore : rayon de la sphère² = δ² + rayon du cercle²." : ""),
          (st) => (Math.abs(st.h) === 5 ? "δ = r = 5 : le plan touche la sphère en un seul point (0 ; 0 ; " + nb(st.h) + "). Il est perpendiculaire au rayon qui y aboutit." : "")],
        miss: (st, s) => (s ? "Tangent : la distance au centre égale le rayon." : "On veut √(25 − h²) = 4."),
        ask: [{ q: "Sphère de rayon 13, plan à distance 5 du centre : rayon du cercle de section ?", ans: 12, ok: "√(13² − 5²) = √(169 − 25) = √144 = 12.", no: "√(r² − δ²)." },
          { q: "Sphère de centre C(1 ; 2 ; 0) passant par T(3 ; 3 ; 2). Le plan tangent en T a pour vecteur normal \\(\\overrightarrow{CT} = (2 \\,;\\, 1 \\,;\\, 2)\\) : il s'écrit 2x + y + 2z + d = 0. Tape d.", ans: -13, ok: "T est dans le plan : 6 + 3 + 4 + d = 0, donc d = −13.", no: "Remplace x, y, z par les coordonnées de T." }] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Intégration, ln et exp, équations différentielles, statistique (ch4c_ana.js)
  // =====================================================================================================
  /* surface sous f entre a et b (aire signée, au-dessus en bleu clair, au-dessous en rouge) */
  const shade = (f, a, b) => { const up = [[a, 0]], dn = [[a, 0]]; for (let i = 0; i <= 80; i++) { const x = a + ((b - a) * i) / 80, y = f(x); up.push([x, Math.max(0, y)]); dn.push([x, Math.min(0, y)]); } up.push([b, 0]); dn.push([b, 0]); return [[up, "f-fill2"], [dn, "f-soft"]]; };
  /* aire comparée à la réponse tapée : rectangle de même aire (hauteur v ÷ (b − a)) */
  const areaFig = (D, v) => {
    const o = { xr: D.xr, yr: D.yr, gx: D.gx, lx: D.lx, gy: D.gy, ly: D.ly, H: D.H || 200, fx: D.fx, fns: [{ f: D.f, from: D.dom }], polys: shade(D.f, D.a, D.b), vl: [[D.a, "f-line"], [D.b, "f-line"]], lab: D.lab };
    let t = '<span class="small">' + D.txt + "</span>";
    if (v !== null) { const hgt = v / (D.b - D.a), ok = Math.abs(v - D.v) <= (D.tol || 1e-9); o.segs = [[D.a, hgt, D.b, hgt, ok ? "f-accent" : "f-line", 2.2, "6 4"], [D.a, 0, D.a, hgt, ok ? "f-accent" : "f-line", 1.4, "3 3"], [D.b, 0, D.b, hgt, ok ? "f-accent" : "f-line", 1.4, "3 3"]];
      t = "Rectangle de même aire que ta réponse (" + nb(v) + ") : " + (ok ? '<b class="act-ok">il compense exactement la surface colorée</b>' : v > D.v ? "trop haut" : "trop bas"); }
    return graph(o) + plain(t);
  };
  const IP = [
    { f: (x) => x * Math.exp(x), a: 0, b: 1, v: 1, xr: [-0.2, 1.3], yr: [-0.4, 3], gx: 0.25, lx: 0.5, gy: 0.5, ly: 1, txt: "f(x) = x·eˣ entre 0 et 1 : la surface colorée vaut l'intégrale", lab: "aire sous x·eˣ entre 0 et 1" },
    { f: (x) => x * Math.cos(x), a: 0, b: Math.PI, v: -2, xr: [-0.3, 3.5], yr: [-3.4, 1], gx: 0.5, lx: 1, gy: 0.5, ly: 1, txt: "f(x) = x·cos x entre 0 et π : la partie sous l'axe compte négativement", lab: "aire signée sous x·cos x entre 0 et π" },
    { f: (x) => Math.log(x), a: 1, b: Math.E, v: 1, dom: 0.05, xr: [0, 3.2], yr: [-0.6, 1.4], gx: 0.5, lx: 1, gy: 0.25, ly: 0.5, txt: "f(x) = ln x entre 1 et e", lab: "aire sous ln x entre 1 et e" },
  ];
  /* substitution : la même aire, lue en x (haut) et en u (bas) */
  const IS = [
    { x: { f: (x) => 2 * x * (x * x + 1) ** 2, a: 0, b: 1, v: 7 / 3, xr: [-0.2, 1.3], yr: [-1, 17], gx: 0.25, lx: 0.5, gy: 2, ly: 4, H: 150, txt: "en x : 2x(x² + 1)² de 0 à 1", lab: "aire sous 2x(x² + 1)² entre 0 et 1" },
      u: { f: (u) => u * u, a: 1, b: 2, v: 7 / 3, xr: [-0.2, 2.6], yr: [-0.5, 5], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 130, txt: "en u : u² de 1 à 2 (même aire)", lab: "aire sous u² entre 1 et 2" } },
    { x: { f: (x) => Math.sin(x) ** 2 * Math.cos(x), a: 0, b: Math.PI / 2, v: 1 / 3, xr: [-0.2, 1.8], yr: [-0.1, 0.5], gx: 0.25, lx: 0.5, gy: 0.1, ly: 0.2, H: 150, txt: "en x : sin²x · cos x de 0 à π/2", lab: "aire sous sin²x cos x entre 0 et π/2" },
      u: { f: (u) => u * u, a: 0, b: 1, v: 1 / 3, xr: [-0.2, 1.4], yr: [-0.1, 1.2], gx: 0.25, lx: 0.5, gy: 0.25, ly: 0.5, H: 130, txt: "en u : u² de 0 à 1 (même aire)", lab: "aire sous u² entre 0 et 1" } },
    { x: { f: (x) => x * (x * x + 1) ** 3, a: 0, b: 1, v: 15 / 8, xr: [-0.2, 1.3], yr: [-1, 9], gx: 0.25, lx: 0.5, gy: 1, ly: 2, H: 150, txt: "en x : x(x² + 1)³ de 0 à 1", lab: "aire sous x(x² + 1)³ entre 0 et 1" },
      u: { f: (u) => (u ** 3) / 2, a: 1, b: 2, v: 15 / 8, xr: [-0.2, 2.6], yr: [-0.5, 4.5], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 130, txt: "en u : u³ ÷ 2 de 1 à 2 (même aire)", lab: "aire sous u³ sur 2 entre 1 et 2" } },
  ];
  const isFig = (s, v) => areaFig(IS[s].x, v) + areaFig(IS[s].u, v === null ? null : v);
  /* histogrammes (statdesc) */
  const bars = (B, w, cls = "f-fill2") => B.map(([c, n]) => [[[c - w / 2, 0], [c + w / 2, 0], [c + w / 2, n], [c - w / 2, n]], cls, 0.75]);

  Object.assign(ACTIVE, {
    intparties: {
      retiens: { regle: "\\(\\int_a^b u(x)v'(x)\\,dx = \\left[u(x)v(x)\\right]_a^b - \\int_a^b u'(x)v(x)\\,dx\\). On choisit pour \\(u\\) le facteur qui devient plus simple en dérivant (\\(x\\), \\(\\ln x\\)) et pour \\(v'\\) celui dont on connaît une primitive (\\(e^x\\), \\(\\cos x\\), \\(1\\)).",
        exemple: ["\\(\\int_0^1 x e^x\\,dx = \\left[xe^x\\right]_0^1 - \\int_0^1 e^x\\,dx = e - (e - 1) = 1\\)", "\\(\\int_0^{\\pi} x\\cos x\\,dx = \\left[x\\sin x\\right]_0^{\\pi} - \\int_0^{\\pi} \\sin x\\,dx = 0 - 2 = -2\\)", "\\(\\int_1^e \\ln x\\,dx = \\left[x\\ln x\\right]_1^e - \\int_1^e 1\\,dx = e - (e - 1) = 1\\) (\\(u = \\ln x\\), \\(v' = 1\\))"],
        piege: "C'est « \\([uv]\\) MOINS \\(\\int u'v\\) » ; on ne primitive jamais les deux facteurs séparément." },
      predict: { q: "Pour ∫ x·eˣ dx, on pose u = x et v' = eˣ (donc u' = 1 et v = eˣ). Pourquoi pas l'inverse ?", choices: ["Avec u = x, il reste ∫ 1·eˣ dx, facile", "C'est pareil", "On ne sait pas primitiver x"], good: 0,
        why: "Avec u = x, la dérivée u' = 1 fait disparaître le x : il reste ∫ eˣ dx. À l'inverse (u = eˣ, v' = x), il resterait ∫ eˣ · x²/2 dx, plus compliqué." },
      defis: ["Calcule \\(\\int_0^1 x e^x\\,dx\\) par parties.", "Calcule \\(\\int_0^{\\pi} x\\cos x\\,dx\\).", "Calcule \\(\\int_1^e \\ln x\\,dx\\) (pose \\(u = \\ln x\\), \\(v' = 1\\))."],
      play: hunt({ ask: true, label: "Valeur de l'intégrale", blank: (s) => areaFig(IP[s], null), show: (x, s) => areaFig(IP[s], x),
        miss: (x, s) => ["u = x, v' = eˣ : [x·eˣ] de 0 à 1 vaut e ; retranche ∫ eˣ dx de 0 à 1 = e − 1.", "u = x, v' = cos x : [x·sin x] de 0 à π vaut 0 ; retranche ∫ sin x dx de 0 à π = 2.", "u = ln x, v = x : [x·ln x] de 1 à e vaut e ; retranche ∫ 1 dx de 1 à e = e − 1."][s],
        wins: [W(1, "[x·eˣ] de 0 à 1 = e − 0 = e ; ∫ eˣ dx = e − 1 ; résultat e − (e − 1) = 1."), W(-2, "[x·sin x] de 0 à π = 0 ; ∫ sin x dx = [−cos x] = 2 ; résultat 0 − 2 = −2 : la partie sous l'axe l'emporte."), W(1, "[x·ln x] de 1 à e = e ; ∫ 1 dx = e − 1 ; résultat 1. Une primitive de ln x : x·ln x − x.")] }),
    },

    intsubst: {
      retiens: { regle: "Si l'intégrande contient \\(g(x)\\) et (à un facteur près) \\(g'(x)\\), on pose \\(u = g(x)\\), \\(du = g'(x)\\,dx\\) : \\(\\int_a^b f(g(x))g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du\\). Les bornes changent avec la variable.",
        exemple: ["\\(\\int_0^1 2x(x^2 + 1)^2\\,dx = \\int_1^2 u^2\\,du = \\frac{7}{3}\\)", "\\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx = \\int_0^1 u^2\\,du = \\frac{1}{3}\\)", "\\(\\int_0^1 x(x^2 + 1)^3\\,dx = \\frac{1}{2}\\int_1^2 u^3\\,du = \\frac{15}{8}\\) (\\(x\\,dx = \\frac{du}{2}\\))"],
        piege: "On change les bornes, et on n'oublie pas le facteur de \\(dx\\) (\\(x\\,dx = \\frac{du}{2}\\))." },
      predict: { q: "Dans ∫ de 0 à 2 de 2x(x² + 1)² dx, on pose u = x² + 1. Quand x va de 0 à 2, u va de…", choices: ["1 à 5", "0 à 2", "0 à 4"], good: 0,
        why: "On calcule u aux bornes : u(0) = 0² + 1 = 1 et u(2) = 2² + 1 = 5. Les bornes changent avec la variable." },
      defis: ["Calcule \\(\\int_0^1 2x(x^2 + 1)^2\\,dx\\) avec \\(u = x^2 + 1\\) (fraction acceptée).", "Calcule \\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx\\) avec \\(u = \\sin x\\).", "Calcule \\(\\int_0^1 x(x^2 + 1)^3\\,dx\\) avec \\(u = x^2 + 1\\)."],
      play: hunt({ ask: true, label: "Valeur de l'intégrale", blank: (s) => isFig(s, null), show: (x, s) => isFig(s, x),
        miss: (x, s) => ["du = 2x dx ; u va de 1 à 2 : ∫ u² du = [u³/3] de 1 à 2.", "du = cos x dx ; u = sin x va de 0 à 1 : ∫ u² du.", "du = 2x dx, donc x dx = du/2 ; u va de 1 à 2 : ½ ∫ u³ du."][s],
        wins: [W(7 / 3, "du = 2x dx, u de 1 à 2 : ∫ u² du = (8 − 1) ÷ 3 = 7/3. Les deux surfaces ont la même aire."), W(1 / 3, "du = cos x dx, u = sin x de 0 à 1 : ∫ u² du = 1/3."), W(15 / 8, "x dx = du/2 : ½ ∫ u³ du de 1 à 2 = ½ · (16 − 1) ÷ 4 = 15/8. Sans le ½, on trouverait le double.")] }),
    },

    etudelnexp: {
      retiens: { regle: "\\((e^u)' = u'e^u\\) et \\((uv)' = u'v + uv'\\). Comme \\(e^x > 0\\), dans \\(f'(x) = (x - 1)e^x\\) le signe de \\(f'\\) est celui de \\(x - 1\\) : on en tire les variations et les extremums. Croissances comparées : \\(\\frac{x^n}{e^x} \\to 0\\) quand \\(x \\to +\\infty\\) (l'exponentielle l'emporte sur toute puissance).",
        exemple: ["\\(f(x) = (x - 2)e^x\\) : \\(f'(x) = (x - 1)e^x\\), minimum \\(f(1) = -e\\).", "\\(g(x) = x^2e^{-x}\\) : \\(g'(x) = x(2 - x)e^{-x}\\), maximum \\(g(2) = \\frac{4}{e^2}\\), et \\(g(x) \\to 0\\) en \\(+\\infty\\)."],
        piege: "\\(e^x\\) ne s'annule jamais : il ne donne aucun zéro de \\(f'\\) et ne change pas son signe." },
      predict: { q: "Quand x devient très grand, x³ ÷ eˣ…", choices: ["tend vers 0", "tend vers +∞", "tend vers 1"], good: 0,
        why: "L'exponentielle croît plus vite que toute puissance : pour x = 20, x³ = 8'000 mais e²⁰ ≈ 485 millions. Le quotient tend vers 0." },
      defis: ["f(x) = (x − 2)·eˣ. Déplace le point jusqu'au minimum (tangente horizontale).", "g(x) = x²·e⁻ˣ. Déplace le point jusqu'au maximum local."],
      play: slide({
        ctl: (s) => [s ? { k: "x", lab: "x", min: -0.5, max: 8, step: 0.5 } : { k: "x", lab: "x", min: -3, max: 2.5, step: 0.5 }],
        init: (s) => ({ x: s ? 4 : 2.5 }),
        fig: (st, s) => { const f = s ? (t) => t * t * Math.exp(-t) : (t) => (t - 2) * Math.exp(t), d = s ? (t) => t * (2 - t) * Math.exp(-t) : (t) => (t - 1) * Math.exp(t), x = st.x, m = d(x), w = s ? 0.9 : 0.5;
          return graph({ xr: s ? [-0.7, 8.3] : [-3.3, 2.8], yr: s ? [-0.15, 0.75] : [-3.2, 6.6], gx: s ? 1 : 0.5, lx: s ? 2 : 1, gy: s ? 0.1 : 1, ly: s ? 0.2 : 2, H: 210, fns: [{ f }], segs: [[x - w, f(x) - w * m, x + w, f(x) + w * m, Math.abs(m) < 1e-12 ? "f-accent" : "f-line", 2.6]], pts: [[x, f(x), "", "f-dot"]], lab: "courbe et tangente au point choisi" }); },
        out: (st, s) => { const x = st.x, m = s ? x * (2 - x) * Math.exp(-x) : (x - 1) * Math.exp(x), sgn = Math.abs(m) < 1e-12 ? 0 : Math.sign(m);
          return (s ? "g'(x) = 2x·e⁻ˣ − x²·e⁻ˣ = x(2 − x)·e⁻ˣ" : "f'(x) = 1·eˣ + (x − 2)·eˣ = (x − 1)·eˣ") + "<br>En x = " + nb(x) + " : " + (s ? "x(2 − x) = " + nb(x * (2 - x)) : "x − 1 = " + nb(x - 1)) + " et " + (s ? "e⁻ˣ" : "eˣ") + " > 0, donc la dérivée est <b>" + (sgn > 0 ? "positive : la courbe monte" : sgn < 0 ? "négative : la courbe descend" : "nulle : tangente horizontale") + "</b>"; },
        goal: [(st) => (st.x === 1 ? "f'(x) = (x − 1)·eˣ passe de − à + en 1 (eˣ > 0 ne change pas le signe) : minimum f(1) = −e ≈ −2,72." : ""),
          (st) => (st.x === 2 ? "g' = x(2 − x)·e⁻ˣ passe de + à − en 2 : maximum local g(2) = 4e⁻² ≈ 0,54. Plus loin, g descend vers 0." : "")],
        miss: (st, s) => (s && st.x === 0 ? "Tangente horizontale, mais g' passe de − à + : c'est un minimum (g(0) = 0). Cherche le maximum." : s ? "Le signe de g' est celui de x(2 − x)." : "Le signe de f' est celui de x − 1."),
        ask: [{ q: "h(x) = (x + 3)·eˣ. Tape l'abscisse de son minimum.", ans: -4, ok: "h'(x) = eˣ + (x + 3)·eˣ = (x + 4)·eˣ, nulle en x = −4, où elle passe de − à +.", no: "Dérive le produit, mets eˣ en évidence, puis cherche le zéro de l'autre facteur." },
          { q: "Vers quel nombre tend g(x) = x²·e⁻ˣ = x² ÷ eˣ quand x → +∞ ?", ans: 0, ok: "L'exponentielle l'emporte sur toute puissance : x² ÷ eˣ → 0. La courbe se rapproche de l'axe des x.", no: "Compare la croissance de x² et de eˣ (essaie x = 20)." }] }),
    },

    eqdiff: {
      retiens: { regle: "\\(y' = ky\\) a pour solutions \\(y = Ce^{kx}\\), et la condition initiale donne \\(C = y(0)\\). \\(y' = ay + b\\) : la solution constante (équilibre) est \\(y = -\\frac{b}{a}\\) (on pose \\(y' = 0\\)), et \\(y = Ce^{ax} - \\frac{b}{a}\\) ; si \\(a < 0\\), \\(y\\) tend vers l'équilibre.",
        exemple: ["\\(y' = ky\\), \\(y(0) = 3\\), \\(y(2) = 3e\\) : \\(e^{2k} = e\\), \\(k = \\frac{1}{2}\\).", "\\(T' = -0{,}5T + 10\\) : équilibre \\(T = 20\\) °C.", "\\(y' = -2y + 6\\), \\(y(0) = 1\\) : \\(y = 3 - 2e^{-2x}\\)."],
        piege: "Dans \\(y' = ay + b\\), \\(C = y(0) + \\frac{b}{a}\\), pas \\(y(0)\\) : on fixe \\(C\\) avec la condition initiale, sur la solution complète." },
      predict: { q: "Laquelle de ces fonctions vérifie y' = 2y ?", choices: ["y = e²ˣ", "y = x²", "y = 2eˣ"], good: 0,
        why: "(e²ˣ)' = 2e²ˣ = 2y. Pour y = x², y' = 2x ≠ 2x² ; pour y = 2eˣ, y' = 2eˣ = y, pas 2y." },
      defis: ["y' = ky avec y(0) = 3. Règle k pour que la solution y = 3e^{kx} passe par le point P(2 ; 3e) ≈ (2 ; 8,15).", "Refroidissement d'un café : T' = −0,5·T + b, avec T(0) = 90 °C. Règle b pour que la température se stabilise à 20 °C."],
      play: slide({
        ctl: (s) => [s ? { k: "b", lab: "b", min: 0, max: 20 } : { k: "k", lab: "k", min: -1, max: 1.5, step: 0.1 }],
        init: (s) => (s ? { b: 4 } : { k: 1 }),
        fig: (st, s) => {
          if (!s) { const k = st.k; return graph({ xr: [-0.5, 3.2], yr: [-0.5, 13], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 210, fns: [{ f: (x) => 3 * Math.exp(k * x) }], pts: [[0, 3, "(0 ; 3)", "f-dot", "r"], [2, 3 * Math.E, "P", Math.abs(k - 0.5) < 1e-9 ? "f-dot" : "f-fill2", "r"]], lab: "solution de y' = ky passant par (0 ; 3)" }); }
          const e = 2 * st.b; return graph({ xr: [-0.3, 10], yr: [-4, 100], gx: 1, lx: 2, gy: 10, ly: 20, H: 210, pad: 14, fns: [{ f: (x) => e + (90 - e) * Math.exp(-0.5 * x) }], hl: [[e, "f-accent"]], pts: [[0, 90, "T(0) = 90", "f-dot", "r"]], lab: "température du café au cours du temps" }); },
        out: (st, s) => {
          if (!s) return "y = 3·e^(" + nb(st.k) + "x) : y(2) = 3·e^(" + nb(2 * st.k) + ") ≈ <b>" + nb(+(3 * Math.exp(2 * st.k)).toFixed(2)) + "</b> (on veut 3e ≈ 8,15)";
          return "Équilibre : T' = 0 ⇔ −0,5·T + " + nb(st.b) + " = 0 ⇔ T = <b>" + nb(2 * st.b) + " °C</b> (pointillé)<br>" + '<span class="small">T = ' + nb(2 * st.b) + " + " + nb(90 - 2 * st.b) + "·e^(−0,5t) : l'écart à l'équilibre diminue de moitié… puis encore</span>"; },
        goal: [(st) => (Math.abs(st.k - 0.5) < 1e-9 ? "k = 1/2, donc y(2) = 3·e^(2 · 0,5) = 3e. On a résolu 3e^(2k) = 3e, donc 2k = 1." : ""),
          (st) => (st.b === 10 ? "b = 10 : l'équilibre −b/a = 10 ÷ 0,5 = 20 °C. Comme a = −0,5 < 0, la température tend vers 20 °C." : "")],
        miss: (st, s) => (s ? "La température se stabilise là où T' = 0." : "Courbe trop " + (st.k > 0.5 ? "raide" : "plate") + " : on veut y(2) = 3e."),
        ask: [{ q: "y' = ky, y(0) = 5 et y(1) = 15. Tape k (au centième).", ans: Math.log(3), tol: 0.006, ok: "5e^k = 15, e^k = 3, k = ln 3 ≈ 1,10.", no: "y = 5e^(kx) ; écris y(1) = 15 et isole e^k." },
          { q: "\\(y' = -2y + 6\\), \\(y(0) = 1\\). La solution s'écrit \\(y = 3 + Ce^{-2x}\\). Tape C.", ans: -2, ok: "y(0) = 3 + C = 1, donc C = −2 (et non 1), d'où y = 3 − 2e^(−2x).", no: "Remplace x par 0 : y(0) = 3 + C." }] }),
    },

    statdesc: {
      retiens: { regle: "Série en classes : on remplace chaque classe par son centre, puis moyenne pondérée \\(\\bar x = \\frac{1}{N}\\sum n_i x_i\\). Écart-type (formule de König) : \\(\\sigma = \\sqrt{\\overline{x^2} - \\bar x^2}\\), où \\(\\overline{x^2}\\) est la moyenne des carrés. Si \\(y = ax + b\\) : \\(\\bar y = a\\bar x + b\\) et \\(\\sigma_y = |a|\\,\\sigma_x\\).",
        exemple: ["Classes \\([10 \\,;\\, 20[\\), \\([20 \\,;\\, 30[\\), \\([30 \\,;\\, 40[\\) d'effectifs 4, 6, 4 : \\(\\bar x = \\frac{15 \\cdot 4 + 25 \\cdot 6 + 35 \\cdot 4}{14} = 25\\).", "\\(\\bar x = 30\\), \\(\\overline{x^2} = 925\\) : \\(\\sigma = \\sqrt{925 - 900} = 5\\).", "\\(\\bar x = 20\\), \\(\\sigma = 5\\), \\(y = 3x + 40\\) : \\(\\bar y = 100\\), \\(\\sigma_y = 15\\)."],
        piege: "Ajouter \\(b\\) à toutes les valeurs déplace la moyenne mais ne change pas l'écart-type." },
      predict: { q: "Classes [10 ; 20[ (effectif 4) et [20 ; 30[ (effectif 6). Pour calculer la moyenne, on remplace chaque classe par…", choices: ["son centre (15 et 25)", "sa borne inférieure (10 et 20)", "son effectif"], good: 0,
        why: "Le centre représente au mieux les valeurs de la classe : x̄ = (15 · 4 + 25 · 6) ÷ 10 = 21." },
      defis: ["Classes [10 ; 20[, [20 ; 30[, [30 ; 40[ d'effectifs 4, 6 et n. Règle n pour que la moyenne vaille 25.", "Une série a x̄ = 20 et σ = 5. On transforme chaque valeur par y = ax + b. Règle a et b pour obtenir ȳ = 100 et σ_y = 15."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "a", min: 0.5, max: 4, step: 0.5 }, { k: "b", lab: "b", min: -20, max: 60, step: 10 }] : [{ k: "n", lab: "Effectif n de [30 ; 40[", min: 0, max: 12 }]),
        init: (s) => (s ? { a: 1, b: 0 } : { n: 1 }),
        fig: (st, s) => {
          if (!s) { const n = st.n, N = 10 + n, m = (60 + 150 + 35 * n) / N; return graph({ xr: [5, 45], yr: [-0.5, 13], gx: 5, lx: 10, gy: 1, ly: 2, H: 190, polys: bars([[15, 4], [25, 6], [35, n]], 10), vl: [[m, "f-accent"]], txt: [[m, 12.2, "x̄"]], lab: "histogramme des trois classes et moyenne" }); }
          const y1 = 15 * st.a + st.b, y2 = 25 * st.a + st.b, m = 20 * st.a + st.b, sd = 5 * st.a;
          return graph({ xr: [-20, 180], yr: [-0.5, 7], gx: 10, lx: 40, gy: 1, ly: 2, H: 170, polys: bars([[15, 5], [25, 5]], 3, "f-soft").concat(bars([[y1, 5], [y2, 5]], 3 * st.a)), vl: [[m, "f-accent"]], segs: [[m - sd, 6, m + sd, 6, "f-accent", 2]], txt: [[m, 6.4, "ȳ ± σ"]], lab: "série de départ (clair) et série transformée" }); },
        out: (st, s) => {
          if (s) return "ȳ = a·x̄ + b = " + nb(st.a) + " · 20 " + sg(st.b).trim() + " = <b>" + nb(20 * st.a + st.b) + "</b><br>σ_y = |a|·σ = " + nb(st.a) + " · 5 = <b>" + nb(5 * st.a) + "</b>";
          const n = st.n, N = 10 + n, m = (60 + 150 + 35 * n) / N, q = (225 * 4 + 625 * 6 + 1225 * n) / N, sd = Math.sqrt(q - m * m);
          return "x̄ = (15 · 4 + 25 · 6 + 35 · " + n + ") ÷ " + N + " = <b>" + nb(+m.toFixed(2)) + "</b><br>moyenne des carrés = (15² · 4 + 25² · 6 + 35² · " + n + ") ÷ " + N + " ≈ " + nb(+q.toFixed(2)) + "<br>σ = √(moyenne des carrés − x̄²) ≈ <b>" + nb(+sd.toFixed(2)) + "</b>"; },
        goal: [(st) => (st.n === 4 ? "n = 4 : (60 + 150 + 140) ÷ 14 = 350 ÷ 14 = 25. Avec 4 valeurs de chaque côté, la série est symétrique autour de 25." : ""),
          (st) => (st.a === 3 && st.b === 40 ? "a = 3 étire la série (σ × 3 = 15), b = 40 la décale sans changer la dispersion : 3 · 20 + 40 = 100." : "")],
        miss: (st, s) => (s ? (st.a === 3 ? "Bon écart-type : b décale toutes les valeurs sans changer la dispersion. Règle b pour la moyenne." : "σ_y = |a| · 5 : seul a change la dispersion.") : "On veut (210 + 35n) ÷ (10 + n) = 25."),
        ask: [{ q: "Une série a pour moyenne x̄ = 30 et pour moyenne des carrés 925. Tape son écart-type σ.", ans: 5, ok: "σ = √(925 − 30²) = √25 = 5.", no: "σ = √(moyenne des carrés − x̄²)." },
          { q: "Températures : x̄ = 20 °C, σ = 5 °C. En degrés Fahrenheit (y = 1,8x + 32), tape σ_y.", ans: 9, ok: "σ_y = 1,8 · 5 = 9 °F ; le + 32 ne change pas l'écart-type.", no: "σ_y = |a| · σ : le terme b n'intervient pas." }] }),
    },
  });
})();

