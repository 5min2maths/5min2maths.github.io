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
  const TVC = [
    () => { const t1 = R.int(6, 10), d = R.int(2, 5), r = pk([1.5, 2, 2.5, 3, -1.5, -2, -0.5, 3.5]), v1 = R.int(-4, 10), v2 = r6(v1 + r * d);
      return { ctx: "temperature", d, r, v1, v2, u: "°C par heure", txt: "À " + t1 + " h, le thermomètre indique " + M(nb(v1) + tu("°C")) + " ; à " + (t1 + d) + " h, il indique " + M(nb(v2) + tu("°C")) + ".", dur: "heures" }; },
    () => { const t1 = R.int(7, 10), d = R.int(2, 4), r = pk([250, 300, 350, 400, -450, -300]), v1 = R.int(80, 150) * 10, v2 = v1 + r * d;
      return { ctx: "randonnee", d, r, v1, v2, u: "m par heure", txt: "Une randonneuse est à l'altitude " + M(nb(v1) + tu("m")) + " à " + t1 + " h et à " + M(nb(v2) + tu("m")) + " à " + (t1 + d) + " h.", dur: "heures" }; },
    () => { const y1 = R.int(2008, 2016), d = R.int(4, 8), r = pk([150, 240, -120, 350, 480, -90]), v1 = R.int(120, 300) * 100, v2 = v1 + r * d;
      return { ctx: "population", d, r, v1, v2, u: "habitants par an", txt: "Une commune compte " + M(nb(v1)) + " habitants en " + y1 + " et " + M(nb(v2)) + " habitants en " + (y1 + d) + ".", dur: "années" }; },
    () => { const t1 = R.int(7, 9), d = R.int(2, 6), r = pk([-200, -250, -400, -150, 300, 350]), v1 = R.int(30, 60) * 100, v2 = v1 + r * d;
      return { ctx: "reservoir", d, r, v1, v2, u: "litres par heure", txt: "Un réservoir contient " + M(nb(v1) + tu("L")) + " à " + t1 + " h et " + M(nb(v2) + tu("L")) + " à " + (t1 + d) + " h.", dur: "heures" }; },
    () => { const w1 = R.int(2, 4), d = R.int(2, 5), r = pk([1.5, 2, 2.5, 3, 3.5]), v1 = R.int(8, 20), v2 = r6(v1 + r * d);
      return { ctx: "plante", d, r, v1, v2, u: "cm par semaine", txt: "Un plant de tomate mesure " + M(nb(v1) + tu("cm")) + " à la semaine " + w1 + " et " + M(nb(v2) + tu("cm")) + " à la semaine " + (w1 + d) + ".", dur: "semaines" }; },
    () => { const t1 = R.int(8, 14), d = R.int(2, 4), r = pk([18, 21, 23, 24, 26, 19]), v1 = R.int(5, 40), v2 = v1 + r * d;
      return { ctx: "velo", d, r, v1, v2, u: "km par heure", txt: "Le compteur d'une cycliste indique " + M(nb(v1) + tu("km")) + " à " + t1 + " h et " + M(nb(v2) + tu("km")) + " à " + (t1 + d) + " h.", dur: "heures" }; },
  ];
  const TV = {
    1: [
      () => { const a = pk([1, -1, 2, -2, 3]), b = nz(-5, 5), c = R.int(-6, 6), x1 = R.int(-3, 2), x2 = x1 + R.int(2, 4), cs = [a, b, c], y1 = pv(cs, x1), y2 = pv(cs, x2), t = (y2 - y1) / (x2 - x1);
        return QN("Calcule le taux de variation moyen de " + ftex(cs) + " entre " + M(x1) + " et " + M(x2) + ".", t, M("\\frac{f(" + x2 + ") - f(" + x1 + ")}{" + x2 + " - " + par(x1) + "} = \\frac{" + y2 + " - " + par(y1) + "}{" + (x2 - x1) + "} = " + fT(t)) + ".",
          { ctx: "polynome", guide: [GS("Calcule " + M("f(" + x1 + ")") + ".", y1, M("f(" + x1 + ") = " + y1) + "."), GS("Calcule " + M("f(" + x2 + ")") + ".", y2, M("f(" + x2 + ") = " + y2) + "."), GS("Taux : variation de " + M("f") + " divisée par variation de " + M("x") + ". Résultat ?", t, M("\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + fT(t)) + ".")],
            traps: [TR(y2 - y1, "Il faut encore diviser par l'écart des abscisses."), TR(y2 === y1 ? NaN : (x2 - x1) / (y2 - y1), "C'est l'inverse : variation de f divisée par variation de x."), TR(-t, "Attention à l'ordre : f(x₂) − f(x₁) avec x₂ − x₁, dans le même ordre.")] }); },
      () => { const c = pk(TVC)();
        return QN(c.txt + " Quel est le taux de variation moyen, en " + c.u + " ?", c.r, "Variation " + M(nb(c.v2) + " - " + (c.v1 < 0 ? "(" + nb(c.v1) + ")" : nb(c.v1)) + " = " + nb(r6(c.v2 - c.v1))) + " en " + M(c.d) + " " + c.dur + " : " + M("\\frac{" + nb(r6(c.v2 - c.v1)) + "}{" + c.d + "} = " + nb(c.r)) + " " + c.u + ".",
          { ctx: c.ctx, guide: [GS("Variation de la grandeur (valeur finale − valeur initiale) ?", r6(c.v2 - c.v1), M(nb(r6(c.v2 - c.v1))) + "."), GS("Durée (en " + c.dur + ") ?", c.d, M(c.d) + "."), GS("Taux moyen = variation ÷ durée ?", c.r, M(nb(c.r)) + " " + c.u + ".")],
            traps: [TR(r6(c.v2 - c.v1), "C'est la variation totale : divise-la par la durée."), TR(r6(c.v2 / c.d), "On divise la variation (et non la valeur finale) par la durée."), TR(-c.r, "Signe : la grandeur " + (c.r > 0 ? "augmente" : "diminue") + ".")] }); },
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
      () => { const x0 = pk([1, 2, 3, -1, -2]), k = nz(-5, 5), m = -3 * x0 * x0 - 2 * k * x0; if (!m) return null;
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
      () => { const p = nz(-5, 3), q = p + R.int(2, 5), s = pk([1, -1]), max = s > 0 ? p : q, min = s > 0 ? q : p;
        return QN("La dérivée d'une fonction " + M("f") + " est " + M("f'(x) = " + (s > 0 ? "" : "-") + "(x" + sg(-p) + ")(x" + sg(-q) + ")") + ". En quelle abscisse " + M("f") + " admet-elle un maximum local ?", max, M("f'") + " s'annule en " + M(p) + " et " + M(q) + ". " + (s > 0 ? M("f'") + " est positive avant " + M(p) + ", négative entre les deux, positive après" : M("f'") + " est négative avant " + M(p) + ", positive entre les deux, négative après") + " : " + M("f") + " monte puis descend en " + M(max) + ".",
          { ctx: "signe-derivee", guide: [GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("Où " + M("f'") + " passe-t-elle de + à − ?", max, M(max) + " : maximum local.")],
            traps: [TR(min, "En " + min + ", f' passe de − à + : c'est un minimum."), TR(-max, "Les zéros de (x − a) sont en a : vérifie le signe.")] }); },
      () => { const s = R.int(1, 4), d = R.int(-5, 5), k = pk([1, 2]), cs = [k, 0, -3 * k * s * s, d];
        return QSet("En quelles abscisses " + ftex(cs) + " admet-elle un extremum local ?", [-s, s], M("f'(x) = " + P2(dP(cs)) + " = " + 3 * k + "(x - " + s + ")(x + " + s + ")") + " : s'annule et change de signe en " + M("\\pm " + s) + ".",
          { ctx: "cubique-symetrique", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [-s, s], M("\\pm " + s) + ".")],
            traps: [TSt([s], "f'(x) = 0 a deux solutions."), TSt([0], "On cherche les zéros de f', pas ceux de f ou de f''."), TSt([-s * s, s * s], "x² = " + s * s + " : prends la racine.")] }); },
      () => { const a = pk([1, -1, 2, -2, 3]), h = pk([-4, -3, -2, 2, 3, 4]), k = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), cs = [a, -2 * a * h, a * h * h + k];
        return QN("Avec la dérivée, trouve la valeur " + (a > 0 ? "minimale" : "maximale") + " de " + ftex(cs) + ".", k, M("f'(x) = " + P2(dP(cs)) + " = 0") + " pour " + M("x = " + h) + " ; " + M("f(" + h + ") = " + k) + " est un " + (a > 0 ? "minimum" : "maximum") + ".",
          { ctx: "extremum-parabole", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GS(M("f'(x) = 0") + " pour " + M("x") + " = ?", h, M(h) + "."), GS("Valeur " + (a > 0 ? "minimale" : "maximale") + " " + M("f(" + h + ")") + " ?", k, M(k) + ".")],
            traps: [TR(h, "C'est l'abscisse du " + (a > 0 ? "minimum" : "maximum") + " ; on demande la valeur f(" + h + ")."), TR(cs[2], "C'est f(0), pas l'extremum.")] }); },
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
      () => { const a = pk([2, 4, 5]), q0 = R.int(6, 30), b = 2 * a * q0, F = R.int(2, 9) * 50, ask = pk(["q", "B"]), Bm = a * q0 * q0 - F, it = pk(["bougies", "savons artisanaux", "pots de miel", "carnets reliés"]);
        return QN("Une petite entreprise vend " + M("q") + " " + it + " par semaine. Son bénéfice vaut " + M("B(q) = " + P2([-a, b, -F], "q")) + " CHF. " + (ask === "q" ? "Combien doit-elle en vendre pour un bénéfice maximal ?" : "Quel est le bénéfice maximal (en CHF) ?"), ask === "q" ? q0 : Bm,
          M("B'(q) = " + P2([-2 * a, b], "q") + " = 0") + " pour " + M("q = " + q0) + " (" + M("B'") + " passe de + à −) ; " + M("B(" + q0 + ") = " + nb(Bm)) + " CHF.",
          { ctx: "benefice-" + ask, guide: [GX(M("B'(q)") + " ?", tp([-2 * a, b], "q"), M(P2([-2 * a, b], "q")) + "."), GS(M("B'(q) = 0") + " pour " + M("q") + " = ?", q0, M(q0) + ".")].concat(ask === "B" ? [GS(M("B(" + q0 + ")") + " ?", Bm, M(nb(Bm)) + " CHF.")] : []),
            traps: ask === "q" ? [TR(b / a, "B'(q) = −" + 2 * a + "q + " + b + " : divise par " + 2 * a + "."), TR(Bm, "C'est le bénéfice maximal ; on demande la quantité.")] : [TR(q0, "C'est la quantité ; calcule B(" + q0 + ")."), TR(a * q0 * q0, "N'oublie pas les frais fixes −" + F + ".")] }); },
      () => { const k = R.int(3, 15), L = 4 * k * pk([1, 2, 5]), x = L / 4, A = L * L / 8, ask = pk(["x", "A"]);
        return QN("Avec " + M(nb(L) + tu("m")) + " de clôture, on ferme un enclos rectangulaire le long d'une rivière (le côté de la rivière n'est pas clôturé). On note " + M("x") + " la longueur des deux côtés perpendiculaires à la rivière. " + (ask === "x" ? "Quelle valeur de " + M("x") + " (en m) donne l'aire maximale ?" : "Quelle est l'aire maximale (en m²) ?"), ask === "x" ? x : A,
          "Côté parallèle : " + M(L + " - 2x") + ". " + M("A(x) = x(" + L + " - 2x)") + ", " + M("A'(x) = " + L + " - 4x = 0") + " pour " + M("x = " + nb(x)) + " ; " + M("A = " + nb(x) + " \\cdot " + nb(L / 2) + " = " + nb(A)) + " m².",
          { ctx: "enclos-" + ask, guide: [GX("Aire " + M("A(x)") + " (développée) ?", tp([-2, L, 0]), M(P2([-2, L, 0])) + "."), GS(M("A'(x) = 0") + " pour " + M("x") + " = ?", x, M(nb(x)) + " m.")].concat(ask === "A" ? [GS("Aire maximale ?", A, M(nb(A)) + " m².")] : []),
            traps: ask === "x" ? [TR(L / 3, "Les trois côtés ne sont pas égaux à l'optimum : dérive A(x)."), TR(L / 2, "C'est la longueur du côté parallèle à la rivière.")] : [TR(L * L / 9, "Les trois côtés ne sont pas égaux à l'optimum."), TR(L * L / 16, "C'est un carré : ici, le côté de la rivière n'est pas clôturé.")] }); },
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
      return X({ id: "stats", lv: 2, titre: "Les temps de trajet",
        q: who() + " note ses temps de trajet (en minutes) pendant deux semaines d'école : " + xs.join(" ; ") + ".",
        parts: [{ label: "Calcule la moyenne " + M("\\bar x") + ".", pts: 1 }, { label: "Calcule l'écart-type " + M("\\sigma") + " (au centième).", pts: 2 }, { label: "Combien de trajets sont dans l'intervalle " + M("[\\bar x - \\sigma \\,;\\, \\bar x + \\sigma]") + " ? Quel pourcentage cela représente-t-il ?", pts: 1 }],
        sol: ul([M("\\bar x = \\frac{" + xs.reduce((a, b) => a + b, 0) + "}{10} = " + N(m)) + " min.", M("\\sigma = \\sqrt{\\frac{1}{10}\\sum (x_i - \\bar x)^2} \\approx " + A(sd, 2)) + " min (racine de la moyenne des carrés des écarts).", "Intervalle " + M("[" + A(m - sd, 2) + " \\,;\\, " + A(m + sd, 2) + "]") + " : " + M(k) + " trajets, soit " + M(10 * k + "\\,\\%") + " (pour une loi normale, on en attendrait environ 68 %)."]),
        chk: [[m, N(m)], [sd, A(sd, 2), 0.01], [k, N(k)]] }); },
    // Deux classes, deux boîtes (quartiles)
    () => { const mk11 = () => Array.from({ length: 11 }, () => R.int(20, 60)).sort((a, b) => a - b); let s1, s2; do { s1 = mk11(); s2 = mk11(); } while (s1[8] - s1[2] === s2[8] - s2[2] || s1[5] === s2[5]);
      const iq1 = s1[8] - s1[2], iq2 = s2[8] - s2[2];
      return X({ id: "quartiles", lv: 2, titre: "Deux classes, deux boîtes",
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
  RICH.proba4c = { ids: ["condbayes", "varalea", "binomiale", "normale", "stats", "quartiles"], track: "col", label: "Probabilités", ex: EXP, raison: RAISONP, minutes: 45 };
})();

// Chantier 3e et 4e Collège (24.11) : leçons actives (devine / manipule ou essaie sur la figure / retiens) pour les
// notions de src/ch3c_ana.js (3e, dérivation : tauxvar, nbderive, derivref, derivregles, derivprodquot, derivcomp,
// tangente, variations, optimderiv) et de src/ch4c_ana.js (4e : primitives, integrale, aireint, volrev, lnexp,
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
})();

