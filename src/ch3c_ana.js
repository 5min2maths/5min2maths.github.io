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
