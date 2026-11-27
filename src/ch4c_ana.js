// 4e du Collège de Genève (grade 15) · Intégration, logarithme et exponentielle, probabilités 2 (24.11, agent college4 ;
// programme dans tools/programme_3e_4e_college.md, § 3 et § 5, priorités 5 à 7). Chapitres Sésamath Ma4 Ch1, Ch2, Ch4 ;
// compétences 4.AN.01 à 4.AN.07 et 4.PS.02 à 4.PS.03 du référentiel matu, communes aux niveaux normal (MA1) et avancé (MA2).
// Neuf notions : primitives, integrale, aireint, volrev (M4C01) ; lnexp, croissance (M4C02) ; condbayes, varalea,
// binomiale (M4C04). Identifiants choisis pour ne pas heurter ceux du lycée français (probcond, binom, vaesp, expfn).
// Ajouts du 24.11 (agent greste, chantier G) : matrices, translin (M4C03, algèbre linéaire) ; normale (M4C04, loi normale
// sans table, règle 68-95-99,7) ; stats et quartiles (MP 2e) ouverts à la 4e du Collège (curriculum.js, gen3.js).
// Ajouts du 25.11 (agent c4plus) : intparties, intsubst (M4C01, renforcé MA2), etudelnexp (M4C02), eqdiff (M4C02, renforcé) ;
// champ niv: "R" sur les notions du niveau renforcé MA2 (lu par Engine.catalog depuis le 25.11 : décision de l'enseignant).
// Standard : 3 niveaux, au moins 3 formes par niveau, pas à pas, erreurs typiques, étiquette ctx, leçon, indice,
// 3 compétences, problème en plusieurs étapes (niveau 4). Paquet de chargement « 15 » (build.py).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(9);
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; }; /* 1e-7 : r6 arrondit déjà à 1e-9 (−5/3) */
  /* nombre en TeX : entier, fraction, sinon décimal à virgule */
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  /* nombre tapé : entier ou a/b */
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const P2 = (cs, x = "x") => poly(ptrim(cs), x);
  /* polynôme tapé : « 3x^2 - 4x + 5 » (fractions entre parenthèses) */
  const tp = (cs, x = "x") => { cs = ptrim(cs); const d = cs.length - 1; let o = "";
    cs.forEach((c, i) => { const p = d - i; if (!c) return; const a = Math.abs(c), co = p === 0 ? fS(a) : a === 1 ? "" : Number.isInteger(r6(a)) ? fS(a) : "(" + fS(a) + ")";
      const t = co + (p === 0 ? "" : p === 1 ? x : x + "^" + p); o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; });
    return o || "0"; };
  const dP = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
  const pv = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  const mT = (c, n, x = "x") => (n === 0 ? fT(c) : (c === 1 ? "" : c === -1 ? "-" : fT(c)) + (n === 1 ? x : x + "^{" + n + "}"));
  const mS = (c, n, x = "x") => (n === 0 ? fS(c) : (c === 1 ? "" : c === -1 ? "-" : Number.isInteger(r6(c)) ? fS(c) : "(" + fS(c) + ")") + (n === 1 ? x : x + "^" + n));
  const lin = (a, b, x = "x") => P2([a, b], x);
  const linS = (a, b, x = "x") => tp([a, b], x);
  const ftex = (cs) => M("f(x) = " + P2(cs));
  const dT = (v, k = 4) => nb(+(+v).toFixed(k)); /* décimal en TeX */
  const dS = (v, k = 4) => String(+(+v).toFixed(k)).replace(".", ","); /* décimal en texte simple */
  const kx = (k, x = "x") => (k === 1 ? x : k === -1 ? "-" + x : k + x); /* kx en TeX (exposants) */
  const cS = (c) => (c === 1 ? "" : c === -1 ? "-" : Number.isInteger(r6(c)) ? fS(c) + "*" : "(" + fS(c) + ")*"); /* coefficient tapé devant une fonction */
  const cT = (c) => (c === 1 ? "" : c === -1 ? "-" : fT(c)); /* coefficient TeX devant une fonction */
  /* multiple de π : TeX et tapé */
  const piT = (c) => { c = r6(c); const d = den(c), n = Math.round(c * d); if (d === 1) return (n === 1 ? "" : n === -1 ? "-" : n) + "\\pi"; return (n < 0 ? "-" : "") + "\\frac{" + (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\pi}{" + d + "}"; };
  const piS = (c) => { c = r6(c); const d = den(c), n = Math.round(c * d); return (n === 1 ? "" : n === -1 ? "-" : n) + "π" + (d === 1 ? "" : "/" + d); };
  const Cb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  /* maxH : figure pas plus haute que large (téléphone) ; graduations de 2 en 2 si l'axe vertical est long */
  const PL = (fns, pts, o = {}) => { const yr = o.yr || [-6, 6]; return FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6], maxH: 300 }, yr[1] - yr[0] > 11 ? { step: 2 } : {}, o)); };
  /* domaine entre deux courbes (polygone échantillonné) pour les figures d'aire */
  const shade = (f, g, a, b) => { const Q = []; for (let i = 0; i <= 40; i++) { const x = a + ((b - a) * i) / 40; Q.push([x, f(x)]); } for (let i = 40; i >= 0; i--) { const x = a + ((b - a) * i) / 40; Q.push([x, g(x)]); } return Q; };
  const z0 = () => 0;
  const yrOf = (fs, a, b) => { let lo = 0, hi = 0; for (const f of fs) for (let i = 0; i <= 60; i++) { const y = f(a + ((b - a) * i) / 60); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } } return [Math.floor(lo) - 1, Math.ceil(hi) + 1]; };
  /* tableau d'une loi de probabilité (deux lignes) */
  const lawT = (xs, ps) => M("\\begin{array}{c|" + "c".repeat(xs.length) + "} x_i & " + xs.map((x) => (typeof x === "string" ? x : fT(x))).join(" & ") + " \\\\ \\hline P(X = x_i) & " + ps.map((p) => (typeof p === "string" ? p : dT(p))).join(" & ") + " \\end{array}");
  const RND = { 1: "arrondi à l'unité", 10: "arrondi à la dizaine", 0.1: "arrondi au dixième", 0.01: "arrondi au centième", 0.001: "arrondi au millième", 0.0001: "arrondi au dix-millième" };
  const rd = (v, r) => +(Math.round(v / r) * r).toFixed(6);
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => { const seen = new Set(), tol = Math.max(spec.round || 0, 1e-9); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { try { const t = Expr.parse(tr.e); if (Expr.equivalent(t, Expr.parse(spec.expr))) return false; if (seen.has(tr.e)) return false; seen.add(tr.e); return true; } catch (e) { return false; } }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(r6).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map((v) => String(r6(v))).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (spec.kind !== "value") return false;
    const k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
    if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
  /* Téléphone 360 px (24.11) : MathJax ne coupe pas une formule en ligne. Une formule longue est découpée en plusieurs
     formules aux « = », « ⟺ », « ≈ » de premier niveau, pour que la ligne puisse se couper entre elles. */
  const vis = (t) => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b)).replace(/\\[a-zA-Z]+/g, "x").replace(/\\[,;!]|[{}\s]/g, "");
  const cut = (t) => { const out = []; let d = 0, last = 0;
    for (let i = 0; i < t.length; i++) { const c = t[i];
      if (c === "{") d++; else if (c === "}") d--; else if (t.startsWith("\\left", i)) d++; else if (t.startsWith("\\right", i)) d--;
      else if (d === 0 && i > last + 1) { const m = /^ (=|\\iff|\\approx) /.exec(t.slice(i)); if (m) { out.push(t.slice(last, i)); last = i + 1; i += m[0].length - 2; } } }
    out.push(t.slice(last)); return out; };
  const wrapM = (h) => (typeof h !== "string" ? h : h.replace(/\\\((.*?)\\\)/g, (m, t) => { if (/\\begin/.test(t) || vis(t).length <= 22) return m; const ps = cut(t); if (ps.length < 2) return m;
    const ch = []; let cur = ""; for (const p of ps) { if (cur && vis(cur + p).length > 22) { ch.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; } ch.push(cur);
    return ch.map((c) => "\\(" + c + "\\)").join(" "); }));
  const mk = (q, spec, sol, o) => { const x = { q: wrapM(q), spec, sol: wrapM(sol), guide: (o.guide || []).map((g) => Object.assign({}, g, { ask: wrapM(g.ask), sol: wrapM(g.sol) })), ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  /* 27.11 (recalcul, agent recalc34) : une valeur pile entre deux arrondis (0,3125 au millième, médiane 18,125 au centième) faisait
     accepter les deux voisins ; on garde l'arrondi « demi vers le haut », celui du corrigé. */
  const tie = (v, r) => { const k = +(v / r).toFixed(6); return r && Math.abs(k - Math.floor(k) - 0.5) < 1e-6 ? +((Math.floor(k) + 1) * r).toFixed(10) : v; };
  const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value: tie(value, round), round }, sol, o);
  const QPi = (q, c, sol, o) => mk(q, { kind: "value", value: c * Math.PI }, sol, Object.assign({ canon: piS(c) }, o));
  const QX = (q, expr, sol, o) => mk(q, Object.assign({ kind: "expr", expr }, o.pos ? { pos: true } : {}), sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
  const GX = (ask, expr, sol, pos) => ({ ask, spec: Object.assign({ kind: "expr", expr }, pos ? { pos: true } : {}), sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
  const GPi = (ask, c, sol) => GS(ask, c * Math.PI, sol);
  const TX = (e, m) => ({ e, m });
  const TSt = (s, m) => ({ s, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, sol: wrapM(sol), parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints });

  // ======================= primitives (4.AN.01a–c) =======================
  const PR = {
    1: [
      () => { const a = pk([3, 6, 9, -3, -6]), b = pk([2, 4, 6, 8, -2, -4, -6]), c = nz(-7, 7), cs = [a, b, c], F = [a / 3, b / 2, c, 0];
        return QX("Donne la primitive " + M("F") + " de " + ftex(cs) + " qui vérifie " + M("F(0) = 0") + ".", tp(F),
          M("F(x) = " + P2(F)) + ". Chaque terme " + M("a x^n") + " devient " + M("\\frac{a}{n + 1} x^{n + 1}") + " ; avec " + M("F(0) = 0") + ", pas de constante. Vérifie : " + M("F'(x) = f(x)") + ".",
          { ctx: "polynome", guide: [GX("Primitive de " + M(mT(a, 2)) + " ?", mS(a / 3, 3), M(mT(a / 3, 3)) + "."), GX("Primitive de " + M(mT(b, 1)) + " ?", mS(b / 2, 2), M(mT(b / 2, 2)) + "."), GX(M("F(x)") + " (avec " + M("F(0) = 0") + ") ?", tp(F), M(P2(F)) + ".")],
            traps: [TX(tp(dP(cs)), "Ça, c'est la dérivée de f. Une primitive F vérifie F' = f : l'exposant augmente."), TX(tp([a, b, c, 0]), "L'exposant augmente de 1, et on divise par le nouvel exposant."), TX(tp([3 * a, 2 * b, c, 0]), "On divise par le nouvel exposant, on ne multiplie pas.")] }); },
      () => { const cs = [nz(-3, 3), nz(-5, 5), nz(-6, 6), R.int(2, 9)], f = dP(cs);
        return QX("La fonction " + M("F(x) = " + P2(cs)) + " est une primitive de " + M("f") + ". Donne " + M("f(x)") + ".", tp(f),
          "Par définition " + M("F' = f") + ", donc " + M("f(x) = F'(x) = " + P2(f)) + ". La constante " + M(cs[3]) + " disparaît en dérivant.",
          { ctx: "verifier", guide: [GX("Dérivée de " + M(mT(cs[0], 3)) + " ?", mS(3 * cs[0], 2), M(mT(3 * cs[0], 2)) + "."), GX(M("f(x) = F'(x)") + " ?", tp(f), M(P2(f)) + ".")],
            traps: [TX(tp([cs[0] / 4, cs[1] / 3, cs[2] / 2, cs[3], 0]), "C'est une primitive de F. Ici F est la primitive : on dérive F pour trouver f."), TX(tp(f) + " + " + cs[3], "La dérivée d'une constante est 0."), TX(tp([cs[0], cs[1], cs[2]]), "En dérivant, l'exposant descend devant : (x³)' = 3x².")] }); },
      () => { const a = nz(-3, 3), b = nz(-4, 4), C = nz(-8, 8), x0 = pk([1, 2, -1]), F0 = a * x0 ** 3 + b * x0 * x0, y0 = F0 + C, f = [3 * a, 2 * b, 0];
        return QN("Les primitives de " + ftex(f) + " s'écrivent " + M("F(x) = " + P2([a, b, 0, 0]) + " + C") + ". Trouve la constante " + M("C") + " pour que " + M("F(" + x0 + ") = " + y0) + ".", C,
          M("F(" + x0 + ") = " + F0 + " + C = " + y0) + ", donc " + M("C = " + y0 + " - " + par(F0) + " = " + C) + ".",
          { ctx: "condition", guide: [GS("Calcule " + M(P2([a, b, 0, 0])) + " pour " + M("x = " + x0) + ".", F0, M(F0) + "."), GS("Il reste " + M(F0 + " + C = " + y0) + ". Que vaut " + M("C") + " ?", C, M(C) + ".")],
            traps: [TR(y0, "Il faut retirer la valeur de la primitive en " + x0 + " (ici " + F0 + ")."), TR(y0 + F0, "F(" + x0 + ") = " + F0 + " + C : on soustrait " + F0 + "."), TR(y0 - pv(f, x0), "On utilise F (pas f) pour la condition F(" + x0 + ") = " + y0 + ".")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4, 6, 8, 12]), c = nz(-5, 5), b = pk([2, 3, 4, 6]), v = -k / b + k + c;
        return QN("Soit " + M("F") + " la primitive de " + M("f(x) = \\frac{" + k + "}{x^2}") + " (pour " + M("x > 0") + ") telle que " + M("F(1) = " + c) + ". Calcule " + M("F(" + b + ")") + ".", v,
          M("F(x) = -\\frac{" + k + "}{x} + C") + " et " + M("F(1) = -" + k + " + C = " + c) + " donne " + M("C = " + (k + c)) + ". Puis " + M("F(" + b + ") = -\\frac{" + k + "}{" + b + "}" + sg(k + c) + " = " + fT(v)) + ".",
          { ctx: "inverse-carre", guide: [GX("Une primitive de " + M("\\frac{" + k + "}{x^2} = " + k + "x^{-2}") + " (sans constante) ?", "-" + k + "/x", M("-\\frac{" + k + "}{x}") + "."), GS("Constante " + M("C") + " (avec " + M("F(1) = " + c) + ") ?", k + c, M(k + c) + "."), GS(M("F(" + b + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(k / b - k + c, "La primitive de x⁻² est −x⁻¹ : attention au signe."), TR(-k / b, "N'oublie pas la constante C fixée par F(1) = " + c + "."), TR(k / (b * b), "C'est f(" + b + ") ; on demande F(" + b + ").")] }); },
      () => { const t = pk(["rac", "xrac"]), k = t === "rac" ? pk([3, 6, 9, -3, -6]) : pk([5, 10, 15, -5]), e = t === "rac" ? 1.5 : 2.5, c = k / e, eS = t === "rac" ? "3/2" : "5/2", ans = fS(c) + "*x^(" + eS + ")";
        const fTx = t === "rac" ? k + "\\sqrt{x}" : k + "x\\sqrt{x}";
        return QX("Donne la primitive " + M("F") + " de " + M("f(x) = " + fTx) + " (pour " + M("x \\geq 0") + ") qui vérifie " + M("F(0) = 0") + ".", ans,
          M("f(x) = " + k + "x^{" + fT(e - 1) + "}") + " ; l'exposant devient " + M(fT(e)) + " et on divise par " + M(fT(e)) + " : " + M("F(x) = " + fT(c) + "x^{" + fT(e) + "}") + ".",
          { ctx: "puissance-" + t, pos: true, guide: [GS("Écris " + M("f(x) = " + k + "x^{p}") + ". Exposant " + M("p") + " ?", e - 1, M(fT(e - 1)) + "."), GS("Exposant de la primitive ?", e, M(fT(e)) + "."), GX(M("F(x)") + " ?", ans, M(fT(c) + "x^{" + fT(e) + "}") + ".", true)],
            traps: [TX(k + "*x^(" + eS + ")", "On divise par le nouvel exposant " + eS + "."), TX(fS(k * e) + "*x^(" + eS + ")", "Diviser par " + eS + ", c'est multiplier par son inverse."), TX(fS(k * (e - 1)) + "*x^(" + fS(e - 2) + ")", "Ça, c'est la dérivée : pour une primitive, l'exposant augmente.")] }); },
      () => { if (R.rand() < 0.5) { const a = pk([2, 3]), b = nz(-5, 5), n = pk([2, 3, 4]), x0 = -b / a, D = a * (n + 1), base = linS(a, b), ans = "(" + base + ")^" + (n + 1) + "/" + D;
          return QX("Donne la primitive " + M("F") + " de " + M("f(x) = (" + lin(a, b) + ")^{" + n + "}") + " qui s'annule en " + M("x = " + fT(x0)) + ".", ans,
            M("F(x) = \\frac{(" + lin(a, b) + ")^{" + (n + 1) + "}}{" + a + " \\cdot " + (n + 1) + "} = \\frac{(" + lin(a, b) + ")^{" + (n + 1) + "}}{" + D + "}") + ". Vérifie en dérivant : le facteur " + M(a) + " de la composée se simplifie.",
            { ctx: "affine-puissance", guide: [GS("Exposant de " + M("F") + " ?", n + 1, M(n + 1) + "."), GS("Par quoi divise-t-on (nouvel exposant × coefficient de " + M("x") + ") ?", D, M((n + 1) + " \\cdot " + a + " = " + D) + "."), GX(M("F(x)") + " ?", ans, M("\\frac{(" + lin(a, b) + ")^{" + (n + 1) + "}}{" + D + "}") + ".")],
              traps: [TX("(" + base + ")^" + (n + 1) + "/" + (n + 1), "En dérivant, la composée fait sortir le facteur " + a + " : il faut aussi diviser par " + a + "."), TX(a * n + "*(" + base + ")^" + (n - 1), "Ça, c'est la dérivée : pour une primitive, l'exposant augmente."), TX(a + "*(" + base + ")^" + (n + 1) + "/" + (n + 1), "On divise par " + a + ", on ne multiplie pas.")] }); }
        const a = pk([2, 3, 4]), k = pk([1, 2, 3, 5, 6, 8, -2, -3]), c = k / a, ans = cS(c) + "sin(" + a + "x)";
        if (k === a) return null;
        return QX("Donne la primitive " + M("F") + " de " + M("f(x) = " + cT(k) + "\\cos(" + a + "x)") + " qui vérifie " + M("F(0) = 0") + ".", ans,
          M("F(x) = " + cT(c) + "\\sin(" + a + "x)") + ". La dérivée de " + M("\\sin(" + a + "x)") + " est " + M(a + "\\cos(" + a + "x)") + ", donc on divise par " + M(a) + ". Et " + M("\\sin(0) = 0") + ".",
          { ctx: "cosinus", guide: [GX("Une primitive de " + M("\\cos(" + a + "x)") + " ?", "sin(" + a + "x)/" + a, M("\\frac{1}{" + a + "}\\sin(" + a + "x)") + "."), GX(M("F(x)") + " ?", ans, M(cT(c) + "\\sin(" + a + "x)") + ".")],
            traps: [TX(cS(k * a) + "sin(" + a + "x)", "On divise par " + a + " (la dérivée de " + a + "x), on ne multiplie pas."), TX(cS(k) + "sin(" + a + "x)", "En dérivant sin(" + a + "x), un facteur " + a + " apparaît : divise par " + a + "."), TX("-(" + ans + ")", "La dérivée de sin est cos (sans signe −) : la primitive de cos est sin.")] }); },
    ],
    3: [
      () => { const k = pk([3, 6]), a = pk([2, 4, 6, -2, -4]), b = pk([2, 3]), C = a - k / 3, F = (x) => (k * x ** 3) / 3 - a / x + C, v = F(b);
        return QN("Soit " + M("f(x) = \\frac{" + P2([k, 0, 0, 0, a]) + "}{x^2}") + " pour " + M("x > 0") + ", et " + M("F") + " sa primitive telle que " + M("F(1) = 0") + ". Calcule " + M("F(" + b + ")") + ".", v,
          M("f(x) = " + k + "x^2 + \\frac{" + a + "}{x^2}") + ", " + M("F(x) = " + mT(k / 3, 3) + " - \\frac{" + a + "}{x} + C") + " ; " + M("F(1) = 0") + " donne " + M("C = " + fT(C)) + ", puis " + M("F(" + b + ") = " + fT(v)) + ".",
          { ctx: "simplifier", guide: [GX("Sépare la fraction en deux termes : " + M("f(x)") + " = ?", k + "x^2 + " + a + "/x^2", M(k + "x^2 + \\frac{" + a + "}{x^2}") + ".", true), GX("Une primitive (sans constante) ?", mS(k / 3, 3) + " - " + a + "/x", M(mT(k / 3, 3) + " - \\frac{" + a + "}{x}") + ".", true), GS("Constante " + M("C") + " ?", C, M(fT(C)) + "."), GS(M("F(" + b + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(v - C, "N'oublie pas la constante fixée par F(1) = 0."), TR((k * b ** 3) / 3 + a / b - a - k / 3, "La primitive de a/x² est −a/x : attention au signe."), TR(k * b * b + a / (b * b), "C'est f(" + b + ") ; on demande F(" + b + ").")] }); },
      () => { if (R.rand() < 0.5) { const a = pk([3, 6]), b = pk([2, 4, 6]), s0 = R.int(5, 40), T = pk([2, 3, 4, 5]), o = pk([["Un drone s'élève", "drone", "son altitude"], ["Un chariot avance sur un rail", "chariot", "sa position"], ["Un ascenseur de chantier monte", "ascenseur", "sa hauteur"]]), F = [a / 3, b / 2, 0, 0], v = pv(F, T) + s0;
          return QN(o[0] + " : sa vitesse vaut " + M("v(t) = " + P2([a, b, 0], "t")) + " m/s après " + M("t") + " secondes. Au départ (" + M("t = 0") + "), " + o[2] + " est " + M(s0 + tu("m")) + ". Que vaut " + o[2] + " (en m) à " + M("t = " + T) + " ?", v,
            "La position est une primitive de la vitesse : " + M("s(t) = " + P2(F, "t") + " + " + s0) + ", donc " + M("s(" + T + ") = " + fT(pv(F, T)) + " + " + s0 + " = " + fT(v)) + " m.",
            { ctx: "position-" + o[1], guide: [GX("Une primitive de " + M("v(t)") + " (sans constante, variable " + M("t") + ") ?", tp(F, "t"), M(P2(F, "t")) + "."), GS("Constante (position au départ) ?", s0, M(s0) + " m."), GS(M("s(" + T + ")") + " ?", v, M(fT(v)) + " m.")],
              traps: [TR(pv([a, b, 0], T), "C'est la vitesse v(" + T + ") ; la position est une primitive de v."), TR(pv(F, T), "Ajoute la position de départ " + s0 + " m."), TR(2 * a * T + b, "C'est l'accélération v'(" + T + ").")] }); }
        const m = pk([0.2, 0.4, 0.5]), c = R.int(8, 20), Ff = R.int(3, 9) * 100, Q = pk([50, 100, 150, 200]), it = pk(["des vélos électriques", "des skis", "des montres"]), v = (m * Q * Q) / 2 + c * Q + Ff;
        return QN("Pour produire " + it + ", le coût marginal vaut " + M("C'(q) = " + nb(m) + "q + " + c) + " CHF par pièce, et les coûts fixes " + M("C(0) = " + Ff) + " CHF. Quel est le coût total " + M("C(" + Q + ")") + " (en CHF) ?", v,
          M("C(q) = " + nb(m / 2) + "q^2 + " + c + "q + " + Ff) + ", donc " + M("C(" + Q + ") = " + nb((m * Q * Q) / 2) + " + " + nb(c * Q) + " + " + Ff + " = " + nb(v)) + " CHF.",
          { ctx: "cout-marginal", guide: [GX("Une primitive de " + M("C'(q)") + " (sans constante, variable " + M("q") + ") ?", tp([m / 2, c, 0], "q"), M(nb(m / 2) + "q^2 + " + c + "q") + "."), GS("Constante (coûts fixes) ?", Ff, M(Ff) + " CHF."), GS(M("C(" + Q + ")") + " ?", v, M(nb(v)) + " CHF.")],
            traps: [TR(m * Q + c, "C'est le coût marginal C'(" + Q + ") : le coût total est une primitive."), TR(v - Ff, "Ajoute les coûts fixes " + Ff + " CHF."), TR(m * Q * Q + c * Q + Ff, "La primitive de q est q²/2 : divise par 2.")] }); },
      () => { const a = nz(-2, 2), b = nz(-3, 3), c = nz(-5, 5), y0 = R.int(-6, 6), x1 = pk([2, -1, 3]), F0 = [a, b, c, 0], C = y0 - pv(F0, 1), v = pv(F0, x1) + C, f = [3 * a, 2 * b, c];
        return QN("En chaque point d'abscisse " + M("x") + ", la tangente à la courbe " + M("y = F(x)") + " a pour pente " + M(P2(f)) + ". La courbe passe par " + M("(1 \\,;\\, " + y0 + ")") + ". Que vaut " + M("F(" + x1 + ")") + " ?", v,
          M("F'(x) = " + P2(f)) + ", donc " + M("F(x) = " + P2(F0) + " + C") + " ; " + M("F(1) = " + pv(F0, 1) + " + C = " + y0) + " donne " + M("C = " + C) + " ; " + M("F(" + x1 + ") = " + v) + ".",
          { ctx: "pente-donnee", guide: [GX("Une primitive de " + M(P2(f)) + " (sans constante) ?", tp(F0), M(P2(F0)) + "."), GS("Constante " + M("C") + " (la courbe passe par " + M("(1 \\,;\\, " + y0 + ")") + ") ?", C, M(C) + "."), GS(M("F(" + x1 + ")") + " ?", v, M(v) + ".")],
            traps: [TR(pv(F0, x1), "Il manque la constante C, fixée par le point (1 ; " + y0 + ")."), TR(pv(f, x1), "C'est la pente en " + x1 + " ; on demande F(" + x1 + ")."), TR(pv(F0, x1) + y0, "C = " + y0 + " − F₀(1), pas " + y0 + ".")] }); },
    ],
  };

  // ======================= integrale (4.AN.02a–c, 4.AN.03a) =======================
  const IN = {
    1: [
      () => { const p = pk([3, -3, 6]), q = pk([2, 4, -2, -4, 0]), r = nz(-5, 5), a = R.int(-2, 1), b = a + R.int(1, 3), cs = [p, q, r], F = [p / 3, q / 2, r, 0], Fb = pv(F, b), Fa = pv(F, a), v = Fb - Fa;
        return QN("Calcule " + M("\\int_{" + a + "}^{" + b + "} \\left(" + P2(cs) + "\\right) dx") + ".", v, "Primitive " + M("F(x) = " + P2(F)) + ", puis " + M("F(" + b + ") - F(" + a + ") = " + Fb + " - " + par(Fa) + " = " + v) + ".",
          { ctx: "polynome", guide: [GX("Une primitive " + M("F(x)") + " ?", tp(F), M(P2(F)) + "."), GS(M("F(" + b + ")") + " ?", Fb, M(Fb) + "."), GS(M("F(" + a + ")") + " ?", Fa, M(Fa) + "."), GS("Intégrale " + M("F(" + b + ") - F(" + a + ")") + " ?", v, M(v) + ".")],
            traps: [TR(Fa - Fb, "Borne du haut moins borne du bas : F(" + b + ") − F(" + a + ")."), TR(pv(cs, b) - pv(cs, a), "On utilise une primitive F, pas f elle-même."), TR(Fb, "Il faut encore soustraire F(" + a + ").")] }); },
      () => { const m = pk([0.5, 1, 2, -0.5, -1]), a = R.int(-2, 1), b = a + pk([2, 4]), lo = Math.min(m * a, m * b), p = R.int(1, 2) - lo, f = (x) => m * x + p, fa = f(a), fb = f(b), v = ((fa + fb) / 2) * (b - a);
        if (!Number.isInteger(p) || Math.max(fa, fb) > 8) return null;
        return QN("Le graphique montre " + M("f(x) = " + lin(m, p)) + ". Sans chercher de primitive, calcule " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " grâce à l'aire du domaine coloré (un trapèze).", v,
          "Le domaine est un trapèze de bases " + M("f(" + a + ") = " + fT(fa)) + " et " + M("f(" + b + ") = " + fT(fb)) + ", de hauteur " + M(b - a) + " : " + M("\\frac{" + fT(fa) + " + " + fT(fb) + "}{2} \\cdot " + (b - a) + " = " + fT(v)) + ".",
          { ctx: "aire-trapeze", fig: PL([{ f }], [], { xr: [Math.min(-1, a - 1), b + 1], yr: [-1, Math.ceil(Math.max(fa, fb)) + 1], polys: [shade(f, z0, a, b)], label: "aire sous une droite" }),
            guide: [GS(M("f(" + a + ")") + " ?", fa, M(fT(fa)) + "."), GS(M("f(" + b + ")") + " ?", fb, M(fT(fb)) + "."), GS("Aire du trapèze ?", v, M(fT(v)) + ".")],
            traps: [TR(Math.max(fa, fb) * (b - a), "C'est le rectangle : la droite n'est pas horizontale."), TR((fa + fb) * (b - a), "Aire du trapèze : (somme des bases) × hauteur ÷ 2."), TR((Math.abs(fb - fa) * (b - a)) / 2, "C'est seulement le triangle du haut.")] }); },
      () => { const t = pk(["chasles", "inverse", "lin", "const"]), a = R.int(-2, 1), b = a + R.int(1, 3), c = b + R.int(1, 3), A = nz(-9, 9), B = nz(-9, 9);
        if (t === "chasles") { const v = A + B;
          return QN("On sait que " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + A) + " et " + M("\\int_{" + b + "}^{" + c + "} f(x)\\,dx = " + B) + ". Calcule " + M("\\int_{" + a + "}^{" + c + "} f(x)\\,dx") + ".", v, "Relation de Chasles : " + M(A + sg(B) + " = " + v) + ".",
            { ctx: "chasles", guide: [GS("Chasles : on additionne les intégrales des intervalles qui se suivent. Résultat ?", v, M(v) + ".")], traps: [TR(A - B, "Les intervalles se suivent : on additionne."), TR(B - A, "Chasles : les intégrales s'additionnent.")] }); }
        if (t === "inverse") { const k = pk([2, 3, -2, 5]), v = -k * A;
          return QN("On sait que " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + A) + ". Calcule " + M("\\int_{" + b + "}^{" + a + "} " + k + " f(x)\\,dx") + ".", v, "Inverser les bornes change le signe, et la constante sort : " + M("-" + par(k) + " \\cdot " + par(A) + " = " + v) + ".",
            { ctx: "bornes-inversees", guide: [GS(M("\\int_{" + b + "}^{" + a + "} f(x)\\,dx") + " ?", -A, M(-A) + " (bornes inversées)."), GS("Avec le facteur " + M(k) + " ?", v, M(v) + ".")], traps: [TR(k * A, "Les bornes sont inversées : le signe change."), TR(-A, "N'oublie pas le facteur " + k + ".")] }); }
        if (t === "lin") { const k = pk([2, 3, 4]), m = pk([2, 3, 5]), v = k * A - m * B;
          return QN("On sait que " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + A) + " et " + M("\\int_{" + a + "}^{" + b + "} g(x)\\,dx = " + B) + ". Calcule " + M("\\int_{" + a + "}^{" + b + "} \\left(" + k + "f(x) - " + m + "g(x)\\right) dx") + ".", v, "Linéarité : " + M(k + " \\cdot " + par(A) + " - " + m + " \\cdot " + par(B) + " = " + v) + ".",
            { ctx: "linearite", guide: [GS(M(k + " \\cdot " + par(A)) + " ?", k * A, M(k * A) + "."), GS(M(m + " \\cdot " + par(B)) + " ?", m * B, M(m * B) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(k * A + m * B, "Le signe − devant " + m + "g reste : on soustrait."), TR(A - B, "Les constantes " + k + " et " + m + " sortent de l'intégrale.")] }); }
        const k = nz(-4, 5), v = A + k * (b - a);
        return QN("On sait que " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + A) + ". Calcule " + M("\\int_{" + a + "}^{" + b + "} \\left(f(x)" + sg(k) + "\\right) dx") + ".", v, M("\\int_{" + a + "}^{" + b + "} " + k + "\\,dx = " + par(k) + " \\cdot " + (b - a) + " = " + k * (b - a)) + ", donc le total vaut " + M(v) + ".",
          { ctx: "constante", guide: [GS("Intégrale de la constante " + M(k) + " entre " + M(a) + " et " + M(b) + " ?", k * (b - a), M(k * (b - a)) + " (rectangle de largeur " + (b - a) + ")."), GS("Total ?", v, M(v) + ".")], traps: [TR(A + k, "L'intégrale de " + k + " sur un intervalle de longueur " + (b - a) + " vaut " + k * (b - a) + "."), TR(A * k, "On additionne les deux intégrales.")] }); },
    ],
    2: [
      () => { if (R.rand() < 0.5) { const k = pk([2, 3, 4, 6, 12]), [a, b] = pk([[1, 2], [1, 3], [2, 4], [1, 4], [2, 3], [3, 6]]), Fb = -k / b, Fa = -k / a, v = Fb - Fa;
          return QN("Calcule " + M("\\int_{" + a + "}^{" + b + "} \\frac{" + k + "}{x^2}\\,dx") + ".", v, "Primitive " + M("-\\frac{" + k + "}{x}") + " : " + M(fT(Fb) + " - " + par(Fa) + " = " + fT(v)) + ".",
            { ctx: "inverse-carre", guide: [GX("Une primitive de " + M("\\frac{" + k + "}{x^2}") + " ?", "-" + k + "/x", M("-\\frac{" + k + "}{x}") + "."), GS(M("F(" + b + ")") + " ?", Fb, M(fT(Fb)) + "."), GS(M("F(" + a + ")") + " ?", Fa, M(fT(Fa)) + "."), GS("Intégrale ?", v, M(fT(v)) + ".")],
              traps: [TR(-v, "La primitive de x⁻² est −1/x : le signe compte."), TR(k / (b * b) - k / (a * a), "On utilise une primitive, pas f."), TR(Math.log(b / a) * k, "1/x² n'est pas 1/x : sa primitive est −1/x.")] }); }
        const k = pk([3, 6, 9]), a = R.int(0, 2), b = a + R.int(1, 2), c = (2 * k) / 3, v = c * (b ** 3 - a ** 3);
        return QN("Calcule " + M("\\int_{" + a * a + "}^{" + b * b + "} " + k + "\\sqrt{x}\\,dx") + ".", v, "Primitive " + M(fT(c) + "x^{\\frac{3}{2}} = " + fT(c) + "x\\sqrt{x}") + " : " + M(fT(c) + " \\cdot " + b ** 3 + " - " + fT(c) + " \\cdot " + a ** 3 + " = " + v) + ".",
          { ctx: "racine", guide: [GX("Une primitive de " + M(k + "\\sqrt{x}") + " ?", fS(c) + "*x^(3/2)", M(fT(c) + "x^{\\frac{3}{2}}") + ".", true), GS(M("F(" + b * b + ")") + " ?", c * b ** 3, M(fT(c) + " \\cdot " + b + "^3 = " + c * b ** 3) + "."), GS(M("F(" + a * a + ")") + " ?", c * a ** 3, M(c * a ** 3) + "."), GS("Intégrale ?", v, M(v) + ".")],
            traps: [TR(k * (b ** 3 - a ** 3), "On divise par l'exposant 3/2 : facteur 2/3."), TR(k * (b - a), "C'est f(" + b * b + ") − f(" + a * a + ") : il faut une primitive."), TR(1.5 * k * (b ** 3 - a ** 3), "Diviser par 3/2, c'est multiplier par 2/3.")] }); },
      () => { const temp = R.rand() < 0.5, a = temp ? pk([-1, -2]) : pk([3, -3, 6]), T = pk([2, 3, 4, 6]), b = temp ? -a * T + pk([0, 2, 4]) : pk([2, 4, -2, -4]), c = temp ? R.int(4, 12) : nz(-5, 5), cs = [a, b, c], I = (a * T ** 3) / 3 + (b * T * T) / 2 + c * T, mu = I / T;
        const q = temp ? "Entre 0 h et " + T + " h après le lever du jour, la température suit " + M("\\theta(t) = " + P2(cs, "t")) + " (en °C). Quelle est la température moyenne sur cette période ?" : "Calcule la valeur moyenne de " + ftex(cs) + " sur l'intervalle " + M("[0 \\,;\\, " + T + "]") + ".";
        return QN(q, mu, "Valeur moyenne " + M("\\frac{1}{" + T + "}\\int_0^{" + T + "} " + (temp ? "\\theta(t)\\,dt" : "f(x)\\,dx") + " = \\frac{" + fT(I) + "}{" + T + "} = " + fT(mu)) + (temp ? " °C." : "."),
          { ctx: temp ? "moyenne-temperature" : "moyenne", guide: [GS("Intégrale sur " + M("[0 \\,;\\, " + T + "]") + " ?", I, M(fT(I)) + "."), GS("Divisée par la longueur " + M(T) + " ?", mu, M(fT(mu)) + ".")],
            traps: [TR(I, "Divise l'intégrale par la longueur de l'intervalle, " + T + "."), TR((pv(cs, 0) + pv(cs, T)) / 2, "La moyenne des valeurs aux bornes n'est pas la valeur moyenne (sauf pour une droite)."), TR(pv(cs, T / 2), "C'est la valeur au milieu ; la valeur moyenne se calcule avec l'intégrale.")] }); },
      () => { const t = pk(["sin", "cosc", "cos2"]), k = pk([3, 4, 5, 6, 8]);
        if (t === "sin") return QN("Calcule " + M("\\int_0^{\\pi} " + k + "\\sin(x)\\,dx") + ".", 2 * k, "Primitive " + M("-" + k + "\\cos(x)") + " : " + M("-" + k + "\\cos(\\pi) + " + k + "\\cos(0) = " + k + " + " + k + " = " + 2 * k) + ".",
          { ctx: "sinus", guide: [GX("Une primitive de " + M(k + "\\sin(x)") + " ?", "-" + k + "*cos(x)", M("-" + k + "\\cos(x)") + "."), GS("Intégrale ?", 2 * k, M(2 * k) + ".")], traps: [TR(-2 * k, "La primitive de sin est −cos : −cos(π) = 1."), TR(0, "cos(π) = −1 et cos(0) = 1 : ça ne s'annule pas."), TR(k, "−cos(π) + cos(0) = 2.")] });
        if (t === "cosc") { const m = pk([2, 4, 6, -2]), v = k + (m * Math.PI) / 2;
          return mk("Calcule " + M("\\int_0^{\\frac{\\pi}{2}} \\left(" + k + "\\cos(x)" + sg(m) + "\\right) dx") + " (valeur exacte).", { kind: "value", value: v }, "Primitive " + M(k + "\\sin(x)" + sg(m) + "x") + " : " + M(k + " \\cdot 1 + " + par(m) + " \\cdot \\frac{\\pi}{2} = " + k + (m < 0 ? " - " : " + ") + piT(Math.abs(m) / 2)) + ".",
            { ctx: "cosinus-constante", canon: k + (m < 0 ? " - " : " + ") + piS(Math.abs(m) / 2), guide: [GX("Une primitive ?", k + "*sin(x) " + (m < 0 ? "- " + -m : "+ " + m) + "x", M(k + "\\sin(x)" + sg(m) + "x") + "."), GS("Intégrale ?", v, M(k + (m < 0 ? " - " : " + ") + piT(Math.abs(m) / 2)) + ".")],
              traps: [TR(k, "N'oublie pas l'intégrale de la constante " + m + "."), TR((m * Math.PI) / 2, "N'oublie pas la partie " + k + "cos(x)."), TR(k + m, "L'intégrale de " + m + " sur [0 ; π/2] vaut " + m + " · π/2.")] }); }
        return QN("Calcule " + M("\\int_0^{\\frac{\\pi}{4}} " + k + "\\cos(2x)\\,dx") + ".", k / 2, "Primitive " + M(fT(k / 2) + "\\sin(2x)") + " : " + M(fT(k / 2) + "\\sin\\left(\\frac{\\pi}{2}\\right) - 0 = " + fT(k / 2)) + ".",
          { ctx: "cosinus-2x", guide: [GX("Une primitive de " + M(k + "\\cos(2x)") + " ?", fS(k / 2) + "*sin(2x)", M(fT(k / 2) + "\\sin(2x)") + "."), GS("Intégrale ?", k / 2, M(fT(k / 2)) + ".")], traps: [TR(k, "La primitive de cos(2x) est sin(2x)/2 : divise par 2."), TR(2 * k, "On divise par 2, on ne multiplie pas.")] }); },
    ],
    3: [
      () => { if (R.rand() < 0.5) { const a = pk([1, 2, 3]), c = pk([2, 3, 4]), T = (a * c ** 3) / 3;
          return QN("Trouve le nombre " + M("c > 0") + " tel que " + M("\\int_0^{c} " + (a === 1 ? "" : a) + "x^2\\,dx = " + fT(T)) + ".", c, M("\\int_0^c " + (a === 1 ? "" : a) + "x^2\\,dx = " + fT(a / 3) + "c^3 = " + fT(T)) + " donne " + M("c^3 = " + c ** 3) + ", donc " + M("c = " + c) + ".",
            { ctx: "borne-cube", guide: [GS("L'intégrale vaut " + M(fT(a / 3) + "c^3") + ". Que vaut " + M("c^3") + " ?", c ** 3, M(c ** 3) + "."), GS(M("c") + " ?", c, M(c) + ".")], traps: [TR(c ** 3, "C'est c³ : prends la racine cubique."), TR(r6(Math.cbrt(T)), "L'intégrale vaut " + (a === 3 ? "" : fS(a / 3) + "·") + "c³, pas c³."), TR(r6(Math.sqrt(T)), "Primitive de x² : x³/3, donc une racine cubique.")] }); }
        const p = pk([1, 2, 3, 4]), c = pk([2, 3, 4, 5, 6]), T = c * c + p * c;
        return QN("Trouve le nombre " + M("c > 0") + " tel que " + M("\\int_0^{c} (2x + " + p + ")\\,dx = " + T) + ".", c, M("\\int_0^c (2x + " + p + ")\\,dx = c^2 + " + p + "c = " + T) + " : " + M("c^2 + " + p + "c - " + T + " = 0") + " a pour solutions " + M(c) + " et " + M(-c - p) + " ; on garde " + M("c = " + c) + ".",
          { ctx: "borne-quadratique", guide: [GX("Intégrale en fonction de " + M("c") + " ?", "c^2 + " + p + "c", M("c^2 + " + p + "c") + "."), GSet("Solutions de " + M("c^2 + " + p + "c = " + T) + " ?", [c, -c - p], M(c) + " et " + M(-c - p) + "."), GS("Valeur positive ?", c, M(c) + ".")],
            traps: [TR(-c - p, "On cherche c > 0."), TR(r6(Math.sqrt(T)), "La primitive contient aussi " + p + "x : résous c² + " + p + "c = " + T + "."), TR(T / 2, "Intégrale : c² + " + p + "c, une équation du 2e degré.")] }); },
      () => { const p = pk([2, 3]), q = nz(-4, 4), n = pk([2, 3]), a = R.int(-1, 1), b = a + 1, ua = p * a + q, ub = p * b + q, D = p * (n + 1), Fb = ub ** (n + 1) / D, Fa = ua ** (n + 1) / D, v = Fb - Fa, ans = "(" + linS(p, q) + ")^" + (n + 1) + "/" + D;
        if (Math.abs(ub) > 6 || Math.abs(ua) > 6) return null;
        return QN("Calcule " + M("\\int_{" + a + "}^{" + b + "} (" + lin(p, q) + ")^{" + n + "}\\,dx") + ".", v, "Primitive " + M("\\frac{(" + lin(p, q) + ")^{" + (n + 1) + "}}{" + D + "}") + " : " + M("\\frac{" + par(ub) + "^{" + (n + 1) + "} - " + par(ua) + "^{" + (n + 1) + "}}{" + D + "} = " + fT(v)) + ".",
          { ctx: "affine-puissance", guide: [GX("Une primitive ?", ans, M("\\frac{(" + lin(p, q) + ")^{" + (n + 1) + "}}{" + D + "}") + "."), GS(M("F(" + b + ")") + " ?", Fb, M(fT(Fb)) + "."), GS(M("F(" + a + ")") + " ?", Fa, M(fT(Fa)) + "."), GS("Intégrale ?", v, M(fT(v)) + ".")],
            traps: [TR(v * p, "Il faut aussi diviser par " + p + " (dérivée de " + p + "x" + (q < 0 ? " − " + -q : " + " + q) + ")."), TR(-v, "F(borne du haut) − F(borne du bas)."), TR(ub ** n - ua ** n, "Il faut une primitive, pas f.")] }); },
      () => { if (R.rand() < 0.5) { const k = pk([1, 2, 3]), T = pk([4, 6, 10]), V = (k * T ** 3) / 6, it = pk(["Une citerne se remplit", "Un bassin se remplit", "Un réservoir se remplit"]);
          return QN(it + " pendant " + M(T + tu("min")) + " avec un débit " + M("r(t) = " + (k === 1 ? "" : k) + "t(" + T + " - t)") + " litres par minute. Combien de litres entrent en tout ?", V, "Volume " + M("\\int_0^{" + T + "} " + (k === 1 ? "" : k) + "t(" + T + " - t)\\,dt = \\left[" + P2([-k / 3, (k * T) / 2, 0, 0], "t") + "\\right]_0^{" + T + "} = " + fT(V)) + " L.",
            { ctx: "debit", guide: [GX("Une primitive de " + M(P2([-k, k * T, 0], "t")) + " (variable " + M("t") + ") ?", tp([-k / 3, (k * T) / 2, 0, 0], "t"), M(P2([-k / 3, (k * T) / 2, 0, 0], "t")) + "."), GS("Volume (en L) ?", V, M(fT(V)) + " L.")],
              traps: [TR(((k * T * T) / 4) * T, "Le débit n'est pas toujours maximal : intègre r(t)."), TR((k * T ** 3) / 2, "Primitive de t² : t³/3."), TR((k * T * T) / 4, "C'est le débit maximal (en L/min), pas le volume.")] }); }
        const v0 = pk([20, 24, 30, 36]), a = pk([4, 5, 6, 8]), ts = v0 / a, D = (v0 * v0) / (2 * a);
        if (!Number.isInteger(ts * 2)) return null;
        return QN("Une voiture freine : sa vitesse vaut " + M("v(t) = " + v0 + " - " + a + "t") + " m/s jusqu'à l'arrêt. Quelle distance (en m) parcourt-elle pendant le freinage ?", D, "Arrêt quand " + M("v(t) = 0") + " : " + M("t = " + fT(ts)) + " s. Distance " + M("\\int_0^{" + fT(ts) + "} (" + v0 + " - " + a + "t)\\,dt = " + fT(D)) + " m.",
          { ctx: "freinage", guide: [GS("Instant de l'arrêt (en s) ?", ts, M(fT(ts)) + " s."), GX("Une primitive de " + M("v(t)") + " ?", tp([-a / 2, v0, 0], "t"), M(P2([-a / 2, v0, 0], "t")) + "."), GS("Distance (en m) ?", D, M(fT(D)) + " m.")],
            traps: [TR(v0 * ts, "La vitesse diminue : ce n'est pas " + v0 + " m/s tout le temps."), TR((v0 * v0) / a, "Primitive de t : t²/2."), TR(ts, "C'est la durée du freinage (en s).")] }); },
    ],
  };

  // ======================= aireint : aire sous une courbe, entre deux courbes (4.AN.05a, 4.AN.05b) =======================
  const AI = {
    1: [
      () => { const k = pk([1, 2]), d = pk(k === 1 ? [2, 3, 4] : [2, 3, 4]), p = R.int(-3, 0), q = p + d, cs = [-k, k * (p + q), -k * p * q], f = (x) => pv(cs, x), A = (k * d ** 3) / 6, H = (k * d * d) / 4;
        return QN("Calcule l'aire du domaine coloré, compris entre la courbe de " + ftex(cs) + " et l'axe des abscisses.", A,
          M("f(x) = " + (k === 1 ? "" : k) + (p === 0 ? "x" : "(x" + sg(-p) + ")") + (q === 0 ? "(-x)" : "(" + q + " - x)")) + " s'annule en " + M(p) + " et " + M(q) + " ; " + M("f \\geq 0") + " entre les deux : aire " + M("\\int_{" + p + "}^{" + q + "} f(x)\\,dx = " + fT(A)) + ".",
          { ctx: "parabole-axe", fig: PL([{ f }], [], { xr: [p - 1, q + 1], yr: [-1, Math.ceil(H) + 1], polys: [shade(f, z0, p, q)], label: "aire sous une parabole" }),
            guide: [GSet("Zéros de " + M("f") + " (bornes du domaine) ?", [p, q], M(p) + " et " + M(q) + "."), GX("Une primitive de " + M("f") + " ?", tp([-k / 3, (k * (p + q)) / 2, -k * p * q, 0]), M(P2([-k / 3, (k * (p + q)) / 2, -k * p * q, 0])) + "."), GS("Aire ?", A, M(fT(A)) + ".")],
            traps: [TR(-A, "Une aire est positive : vérifie F(borne du haut) − F(borne du bas)."), TR(H * d, "C'est le rectangle qui contient le domaine."), TR((H * d) / 2, "Ce n'est pas un triangle : il faut intégrer.")] }); },
      () => { const k = pk([1, 2, 3]), b = pk([1, 2, 3]), f = (x) => x * x + k, A = b ** 3 / 3 + k * b;
        return QN("Calcule l'aire du domaine compris entre la courbe de " + M("f(x) = x^2 + " + k) + ", l'axe des abscisses et les droites " + M("x = 0") + " et " + M("x = " + b) + ".", A,
          M("f > 0") + " sur " + M("[0 \\,;\\, " + b + "]") + " : aire " + M("\\int_0^{" + b + "} (x^2 + " + k + ")\\,dx = \\frac{" + b ** 3 + "}{3} + " + k * b + " = " + fT(A)) + ".",
          { ctx: "sous-courbe", fig: PL([{ f }], [], { xr: [-2, b + 1], yr: [-1, b * b + k + 1], squash: b * b + k > 6 ? 0.6 : 1, polys: [shade(f, z0, 0, b)], label: "aire sous une courbe" }),
            guide: [GX("Une primitive de " + M("x^2 + " + k) + " ?", "x^3/3 + " + k + "x", M("\\frac{x^3}{3} + " + k + "x") + "."), GS("Aire ?", A, M(fT(A)) + ".")],
            traps: [TR(f(b) * b, "C'est le rectangle de hauteur f(" + b + ")."), TR(b ** 3 / 3, "N'oublie pas le terme " + k + " : il donne " + k * b + "."), TR(b ** 3 + k * b, "Primitive de x² : x³/3.")] }); },
      () => { const m = pk([1, 2, 3, 4]), A = m ** 3 / 6, f = (x) => x * x, g = (x) => m * x;
        return QN("Calcule l'aire du domaine compris entre la parabole " + M("y = x^2") + " et la droite " + M("y = " + kx(m)) + ".", A,
          "Intersections en " + M("x = 0") + " et " + M("x = " + m) + " ; la droite est au-dessus : " + M("\\int_0^{" + m + "} (" + kx(m) + " - x^2)\\,dx = \\frac{" + m ** 3 + "}{2} - \\frac{" + m ** 3 + "}{3} = " + fT(A)) + ".",
          { ctx: "droite-parabole", fig: PL([{ f }, { f: g, cls: "f-line" }], [], { xr: [-1, m + 1], yr: [-1, m * m + 1], squash: m > 2 ? 0.5 : 1, polys: [shade(g, f, 0, m)], label: "aire entre une droite et une parabole" }),
            guide: [GSet("Abscisses des points d'intersection ?", [0, m], M(0) + " et " + M(m) + "."), GX("Différence (courbe du haut − courbe du bas) ?", m + "x - x^2", M(kx(m) + " - x^2") + "."), GS("Aire ?", A, M(fT(A)) + ".")],
            traps: [TR(m ** 3 / 3, "C'est l'aire sous la parabole : retire-la de l'aire sous la droite."), TR(m ** 3 / 2, "C'est l'aire sous la droite : retire l'aire sous la parabole."), TR(-A, "Courbe du haut moins courbe du bas : l'aire est positive.")] }); },
    ],
    2: [
      () => { const p = pk([1, 2]), d = pk([1, 2]), b = p + d, f = (x) => x * x - p * p, A1 = (2 * p ** 3) / 3, A2 = (b ** 3 - p ** 3) / 3 - p * p * (b - p), A = A1 + A2, I = b ** 3 / 3 - p * p * b;
        return QN("Calcule l'aire totale du domaine compris entre la courbe de " + M("f(x) = x^2 - " + p * p) + " et l'axe des abscisses, entre " + M("x = 0") + " et " + M("x = " + b) + ".", A,
          M("f") + " change de signe en " + M(p) + ". Aire " + M("= \\left|\\int_0^{" + p + "} f\\right| + \\int_{" + p + "}^{" + b + "} f = " + fT(A1) + " + " + fT(A2) + " = " + fT(A)) + ".",
          { ctx: "changement-signe", fig: PL([{ f }], [], { xr: [-1, b + 1], yr: [-p * p - 1, b * b - p * p + 1], squash: 0.7, polys: [shade(f, z0, 0, b)], label: "aire d'une fonction qui change de signe" }),
            guide: [GS("Où " + M("f") + " change-t-elle de signe (entre 0 et " + b + ") ?", p, M(p) + "."), GS("Aire de 0 à " + M(p) + " (positive) ?", A1, M(fT(A1)) + "."), GS("Aire de " + M(p) + " à " + M(b) + " ?", A2, M(fT(A2)) + "."), GS("Aire totale ?", A, M(fT(A)) + ".")],
            traps: [TR(I, "C'est l'intégrale : les parties sous l'axe comptent négativement. Une aire se calcule par morceaux."), TR(A2 - A1, "La partie sous l'axe compte positivement dans l'aire."), TR(Math.abs(I), "Sépare en deux morceaux au zéro x = " + p + ".")] }); },
      () => { const k = pk([1, 2]), p = R.int(-2, 0), q = p + pk([2, 3]), u = nz(-2, 2), v = R.int(-2, 2), fc = [1, u, v], gc = [1 - k, u + k * (p + q), v - k * p * q], f = (x) => pv(fc, x), g = (x) => pv(gc, x), A = (k * (q - p) ** 3) / 6, diff = [-k, k * (p + q), -k * p * q];
        const [y0, y1] = yrOf([f, g], p - 0.5, q + 0.5);
        return QN("Calcule l'aire du domaine compris entre les courbes de " + M("f(x) = " + P2(fc)) + " et " + M("g(x) = " + P2(gc)) + ".", A,
          M("g(x) - f(x) = " + P2(diff)) + " s'annule en " + M(p) + " et " + M(q) + " et est positive entre les deux : aire " + M("\\int_{" + p + "}^{" + q + "} (g - f)\\,dx = " + fT(A)) + ".",
          { ctx: k === 1 ? "parabole-droite" : "deux-paraboles", fig: PL([{ f }, { f: g, cls: "f-line" }], [], { xr: [p - 1, q + 1], yr: [Math.max(y0, -8), Math.min(y1, 10)], squash: y1 - y0 > 8 ? 0.6 : 1, polys: [shade(g, f, p, q)], label: "aire entre deux courbes" }),
            guide: [GX(M("g(x) - f(x)") + " ?", tp(diff), M(P2(diff)) + "."), GSet("Abscisses des points d'intersection ?", [p, q], M(p) + " et " + M(q) + "."), GS("Aire ?", A, M(fT(A)) + ".")],
            traps: [TR(-A, "Intègre (courbe du haut − courbe du bas) : g est au-dessus."), TR((k * (q - p) ** 3) / 3, "Primitive de x² : x³/3, et les bornes sont les intersections.")] }); },
      () => { const p = pk([1, 2, 3]), f = (x) => x ** 3 - p * p * x, A = p ** 4 / 2;
        return QN("Calcule l'aire totale du domaine compris entre la courbe de " + M("f(x) = x^3 - " + (p * p === 1 ? "" : p * p) + "x") + " et l'axe des abscisses.", A,
          "Zéros " + M(-p) + ", " + M(0) + ", " + M(p) + ". Par symétrie, deux boucles de même aire " + M("\\frac{" + p ** 4 + "}{4}") + " : total " + M(fT(A)) + ". (L'intégrale de " + M(-p) + " à " + M(p) + " vaut 0 : elle ne donne pas l'aire.)",
          { ctx: "cubique-impaire", fig: p <= 2 ? PL([{ f }], [], { xr: [-p - 1, p + 1], yr: [-Math.ceil(0.39 * p ** 3) - 1, Math.ceil(0.39 * p ** 3) + 1], polys: [shade(f, z0, -p, p)], label: "deux boucles" }) : undefined,
            guide: [GSet("Zéros de " + M("f") + " ?", [-p, 0, p], M(-p) + ", " + M(0) + " et " + M(p) + "."), GS("Aire d'une boucle, " + M("\\left|\\int_0^{" + p + "} f(x)\\,dx\\right|") + " ?", p ** 4 / 4, M(fT(p ** 4 / 4)) + "."), GS("Aire totale ?", A, M(fT(A)) + ".")],
            traps: [TR(0, "L'intégrale de " + -p + " à " + p + " vaut 0, mais l'aire est la somme des deux boucles."), TR(p ** 4 / 4, "Il y a deux boucles (une de chaque côté de 0)."), TR(p ** 4, "Primitive de x³ : x⁴/4.")] }); },
    ],
    3: [
      () => { if (R.rand() < 0.5) { const a = pk([2, 3, 4, 5]), A = a ** 3 / 3;
          return QN("Pour quel nombre " + M("a > 0") + " l'aire sous la parabole " + M("y = x^2") + ", entre " + M("x = 0") + " et " + M("x = a") + ", vaut-elle " + M(fT(A)) + " ?", a, M("\\int_0^a x^2\\,dx = \\frac{a^3}{3} = " + fT(A)) + " donne " + M("a^3 = " + a ** 3) + ", " + M("a = " + a) + ".",
            { ctx: "parametre-borne", guide: [GS(M("\\frac{a^3}{3} = " + fT(A)) + ". Que vaut " + M("a^3") + " ?", a ** 3, M(a ** 3) + "."), GS(M("a") + " ?", a, M(a) + ".")], traps: [TR(a ** 3, "C'est a³ : prends la racine cubique."), TR(r6(Math.cbrt(A)), "L'aire vaut a³/3 : multiplie d'abord par 3."), TR(r6(Math.sqrt(3 * A)), "C'est un cube (x³/3), pas un carré.")] }); }
        const m = pk([2, 3, 4, 5, 6]), A = m ** 3 / 6;
        return QN("Pour quel nombre " + M("m > 0") + " l'aire du domaine entre la parabole " + M("y = x^2") + " et la droite " + M("y = mx") + " vaut-elle " + M(fT(A)) + " ?", m, "Intersections en 0 et " + M("m") + " : " + M("\\int_0^m (mx - x^2)\\,dx = \\frac{m^3}{6} = " + fT(A)) + ", donc " + M("m^3 = " + m ** 3) + " et " + M("m = " + m) + ".",
          { ctx: "parametre-droite", guide: [GX("Aire en fonction de " + M("m") + " ?", "m^3/6", M("\\frac{m^3}{6}") + ".", true), GS(M("m^3") + " ?", m ** 3, M(m ** 3) + "."), GS(M("m") + " ?", m, M(m) + ".")], traps: [TR(r6(Math.cbrt(3 * A)), "L'aire vaut m³/2 − m³/3 = m³/6."), TR(m ** 3, "C'est m³ : prends la racine cubique."), TR(r6(Math.cbrt(2 * A)), "L'aire vaut m³/6, pas m³/2.")] }); },
      () => { const m = pk([2, 3]), A = m ** 3 / 6, f = (x) => Math.sqrt(x), g = (x) => x / m;
        return QN("Calcule l'aire du domaine compris entre les courbes " + M("y = \\sqrt{x}") + " et " + M("y = \\frac{x}{" + m + "}") + ".", A,
          "Intersections : " + M("\\sqrt{x} = \\frac{x}{" + m + "}") + " pour " + M("x = 0") + " et " + M("x = " + m * m) + ". Aire " + M("\\int_0^{" + m * m + "} \\left(\\sqrt{x} - \\frac{x}{" + m + "}\\right) dx = " + fT((2 * m ** 3) / 3) + " - " + fT(m ** 3 / 2) + " = " + fT(A)) + ".",
          { ctx: "racine-droite", fig: PL([{ f }, { f: g, cls: "f-line" }], [], { xr: [-1, m * m + 1], yr: [-1, m + 1], squash: 1.2, polys: [shade(f, g, 0, m * m)], label: "aire entre une racine et une droite" }),
            guide: [GSet("Abscisses des points d'intersection ?", [0, m * m], M(0) + " et " + M(m * m) + "."), GS(M("\\int_0^{" + m * m + "} \\sqrt{x}\\,dx") + " ?", (2 * m ** 3) / 3, M(fT((2 * m ** 3) / 3)) + "."), GS(M("\\int_0^{" + m * m + "} \\frac{x}{" + m + "}\\,dx") + " ?", m ** 3 / 2, M(fT(m ** 3 / 2)) + "."), GS("Aire ?", A, M(fT(A)) + ".")],
            traps: [TR((2 * m ** 3) / 3, "C'est l'aire sous √x seule : retire l'aire sous la droite."), TR(-A, "√x est au-dessus de la droite entre les intersections."), TR(m * m, "C'est l'abscisse de l'intersection.")] }); },
      () => { const p = R.int(-2, 0), q = p + pk([2, 3]), s = p + q, c = -p * q, A = (q - p) ** 3 / 6, f = (x) => x * x, g = (x) => s * x + c;
        if (q > 3 || (p === 0 && q === 2 && R.rand() < 0.5)) return null;
        return QN("Les points " + M("A(" + p + " \\,;\\, " + p * p + ")") + " et " + M("B(" + q + " \\,;\\, " + q * q + ")") + " sont sur la parabole " + M("y = x^2") + ". Calcule l'aire du domaine compris entre la parabole et le segment " + M("[AB]") + ".", A,
          "Droite " + M("(AB) : y = " + lin(s, c)) + ". Aire " + M("\\int_{" + p + "}^{" + q + "} (" + lin(s, c) + " - x^2)\\,dx = " + fT(A)) + ".",
          { ctx: "corde", fig: PL([{ f }, { f: g, cls: "f-line", from: p, to: q }], [[p, p * p, "A"], [q, q * q, "B"]], { xr: [p - 1, q + 1], yr: [-1, Math.max(p * p, q * q) + 1], squash: 0.7, polys: [shade(g, f, p, q)], label: "aire entre une parabole et une corde" }),
            guide: [GS("Pente de la droite " + M("(AB)") + " ?", s, M("\\frac{" + q * q + " - " + p * p + "}{" + q + " - " + par(p) + "} = " + s) + "."), GS("Ordonnée à l'origine de " + M("(AB)") + " ?", c, M(c) + "."), GS("Aire ?", A, M(fT(A)) + ".")],
            traps: [TR((q ** 3 - p ** 3) / 3, "C'est l'aire sous la parabole : on veut l'aire entre la corde et la parabole."), TR(-A, "La corde est au-dessus de la parabole."), TR((q - p) ** 3 / 3, "Calcule la primitive de (droite − parabole) aux deux bornes.")] }); },
    ],
  };

  // ======================= volrev : volume d'un corps de révolution (4.AN.05c) =======================
  const VQ = "En tournant autour de l'axe des abscisses, ";
  const VR = {
    1: [
      () => { const m = pk([1, 2, 3, 0.5]), h = pk([2, 3, 6]), c = (m * m * h ** 3) / 3;
        return QPi(VQ + "le graphe de " + M("f(x) = " + (m === 1 ? "x" : fT(m) + "x")) + " entre " + M("x = 0") + " et " + M("x = " + h) + " engendre un cône. Calcule son volume (valeur exacte, avec " + M("\\pi") + ").", c,
          M("V = \\pi\\int_0^{" + h + "} " + (m === 1 ? "" : fT(m * m)) + "x^2\\,dx = \\pi \\cdot " + fT(m * m) + " \\cdot \\frac{" + h ** 3 + "}{3} = " + piT(c)) + ".",
          { ctx: "cone", guide: [GX(M("f(x)^2") + " ?", mS(m * m, 2), M(mT(m * m, 2)) + "."), GS(M("\\int_0^{" + h + "} f(x)^2\\,dx") + " ?", c, M(fT(c)) + "."), GPi("Volume " + M("V = \\pi \\int f^2") + " ?", c, M(piT(c)) + ".")],
            traps: [TR(c, "N'oublie pas le facteur π : V = π∫f(x)² dx."), TR((Math.PI * m * h * h) / 2, "On intègre f(x)², pas f(x)."), TR(3 * c * Math.PI, "Primitive de x² : x³/3.")] }); },
      () => { const k = pk([1, 2, 3, 4]), a = pk([2, 3, 4, 5]), c = (k * a * a) / 2;
        return QPi(VQ + "le graphe de " + M("f(x) = \\sqrt{" + kx(k) + "}") + " entre " + M("x = 0") + " et " + M("x = " + a) + " engendre un solide (un paraboloïde). Calcule son volume (valeur exacte).", c,
          M("V = \\pi\\int_0^{" + a + "} " + kx(k) + "\\,dx = \\pi \\cdot \\frac{" + k * a * a + "}{2} = " + piT(c)) + ".",
          { ctx: "paraboloide", guide: [GX(M("f(x)^2") + " ?", mS(k, 1), M(kx(k)) + "."), GS(M("\\int_0^{" + a + "} f(x)^2\\,dx") + " ?", c, M(fT(c)) + "."), GPi("Volume ?", c, M(piT(c)) + ".")],
            traps: [TR(c, "N'oublie pas le facteur π."), TR(Math.PI * k * a, "Intègre kx : primitive kx²/2."), TR(Math.PI * (2 / 3) * Math.sqrt(k) * a ** 1.5, "On intègre f(x)², pas f(x).")] }); },
      () => { if (R.rand() < 0.5) { const r = pk([2, 3, 4, 5]), h = pk([3, 4, 6, 10]), c = r * r * h;
          return QPi(VQ + "le graphe de la fonction constante " + M("f(x) = " + r) + " entre " + M("x = 0") + " et " + M("x = " + h) + " engendre un cylindre. Calcule son volume avec une intégrale (valeur exacte).", c,
            M("V = \\pi\\int_0^{" + h + "} " + r * r + "\\,dx = " + piT(c)) + " (on retrouve " + M("\\pi r^2 h") + ").",
            { ctx: "cylindre", guide: [GS(M("f(x)^2") + " ?", r * r, M(r * r) + "."), GPi("Volume ?", c, M(piT(c)) + ".")], traps: [TR(Math.PI * r * h, "On intègre f(x)² = " + r * r + ", pas f(x)."), TR(c, "N'oublie pas π."), TR(2 * Math.PI * r * h, "C'est l'aire latérale, pas le volume.")] }); }
        const a = pk([1, 2]), b = a + pk([1, 2]), c = (b ** 3 - a ** 3) / 3;
        return QPi(VQ + "le graphe de " + M("f(x) = x") + " entre " + M("x = " + a) + " et " + M("x = " + b) + " engendre un tronc de cône. Calcule son volume (valeur exacte).", c,
          M("V = \\pi\\int_{" + a + "}^{" + b + "} x^2\\,dx = \\pi \\cdot \\frac{" + b ** 3 + " - " + a ** 3 + "}{3} = " + piT(c)) + ".",
          { ctx: "tronc-cone", guide: [GS(M("\\int_{" + a + "}^{" + b + "} x^2\\,dx") + " ?", c, M(fT(c)) + "."), GPi("Volume ?", c, M(piT(c)) + ".")], traps: [TR((Math.PI * (b * b - a * a)) / 2, "On intègre x², pas x."), TR(c, "N'oublie pas π."), TR((Math.PI * (b - a) ** 3) / 3, "F(" + b + ") − F(" + a + ") = (" + b + "³ − " + a + "³)/3.")] }); },
    ],
    2: [
      () => { const r = pk([2, 3, 4, 5, 6]), half = R.rand() < 0.5, c = ((half ? 2 : 4) * r ** 3) / 3, lo = half ? 0 : -r;
        return QPi(VQ + "le graphe de " + M("f(x) = \\sqrt{" + r * r + " - x^2}") + " entre " + M("x = " + lo) + " et " + M("x = " + r) + " engendre " + (half ? "une demi-boule" : "une boule") + ". Calcule son volume (valeur exacte).", c,
          M("V = \\pi\\int_{" + lo + "}^{" + r + "} (" + r * r + " - x^2)\\,dx = " + piT(c)) + (half ? "." : " : on retrouve " + M("\\frac{4}{3}\\pi r^3") + "."),
          { ctx: half ? "demi-boule" : "boule", guide: [GX(M("f(x)^2") + " ?", r * r + " - x^2", M(r * r + " - x^2") + "."), GS(M("\\int_{" + lo + "}^{" + r + "} f(x)^2\\,dx") + " ?", c, M(fT(c)) + "."), GPi("Volume ?", c, M(piT(c)) + ".")],
            traps: [TR(4 * Math.PI * r * r, "C'est l'aire de la sphère, pas le volume."), TR(half ? (4 * Math.PI * r ** 3) / 3 : (2 * Math.PI * r ** 3) / 3, half ? "On intègre de 0 à " + r + " seulement : une demi-boule." : "On intègre de −" + r + " à " + r + " : la boule entière."), TR(c, "N'oublie pas π.")] }); },
      () => { const k = pk([1, 2]), a = pk([1, 2]), c = (k * k * a ** 5) / 5;
        return QPi(VQ + "le graphe de " + M("f(x) = " + mT(k, 2)) + " entre " + M("x = 0") + " et " + M("x = " + a) + " engendre un solide (une corolle). Calcule son volume (valeur exacte).", c,
          M("V = \\pi\\int_0^{" + a + "} " + mT(k * k, 4) + "\\,dx = \\pi \\cdot \\frac{" + k * k * a ** 5 + "}{5} = " + piT(c)) + ".",
          { ctx: "corolle", guide: [GX(M("f(x)^2") + " ?", mS(k * k, 4), M(mT(k * k, 4)) + "."), GS(M("\\int_0^{" + a + "} f(x)^2\\,dx") + " ?", c, M(fT(c)) + "."), GPi("Volume ?", c, M(piT(c)) + ".")],
            traps: [TR((Math.PI * k * a ** 3) / 3, "On intègre f(x)² = " + (k * k === 1 ? "" : k * k) + "x⁴, pas f(x)."), TR((Math.PI * k * k * a ** 5) / 4, "Primitive de x⁴ : x⁵/5."), TR(c, "N'oublie pas π.")] }); },
      () => { const k = pk([1, 2, 3]), b = pk([2, 3, 4, 5]), c = k * k * (1 - 1 / b);
        return QPi(VQ + "le graphe de " + M("f(x) = \\frac{" + k + "}{x}") + " entre " + M("x = 1") + " et " + M("x = " + b) + " engendre un pavillon de trompette. Calcule son volume (valeur exacte).", c,
          M("V = \\pi\\int_1^{" + b + "} \\frac{" + k * k + "}{x^2}\\,dx = \\pi\\left[-\\frac{" + k * k + "}{x}\\right]_1^{" + b + "} = " + piT(c)) + ".",
          { ctx: "trompette", guide: [GX(M("f(x)^2") + " ?", k * k + "/x^2", M("\\frac{" + k * k + "}{x^2}") + "."), GS(M("\\int_1^{" + b + "} f(x)^2\\,dx") + " ?", c, M(fT(c)) + "."), GPi("Volume ?", c, M(piT(c)) + ".")],
            traps: [TR(Math.PI * k * Math.log(b), "On intègre f(x)² = " + k * k + "/x², pas f(x)."), TR(-Math.PI * c, "La primitive de 1/x² est −1/x : F(" + b + ") − F(1) > 0."), TR(c, "N'oublie pas π.")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, 3]), c = (2 * a ** 5) / 15;
        return QPi("Le domaine compris entre la droite " + M("y = " + kx(a)) + " et la parabole " + M("y = x^2") + " (pour " + M("0 \\leq x \\leq " + a) + ") tourne autour de l'axe des abscisses. Calcule le volume du solide obtenu (valeur exacte).", c,
          "Solide creux : " + M("V = \\pi\\int_0^{" + a + "} \\left(" + (a === 1 ? "" : a * a) + "x^2 - x^4\\right) dx = \\pi\\left(" + fT(a ** 5 / 3) + " - " + fT(a ** 5 / 5) + "\\right) = " + piT(c)) + ".",
          { ctx: "anneau", guide: [GS("Volume du cône (droite) sans " + M("\\pi") + " : " + M("\\int_0^{" + a + "} " + (a === 1 ? "" : a * a) + "x^2\\,dx") + " ?", a ** 5 / 3, M(fT(a ** 5 / 3)) + "."), GS("Partie creuse (parabole) : " + M("\\int_0^{" + a + "} x^4\\,dx") + " ?", a ** 5 / 5, M(fT(a ** 5 / 5)) + "."), GPi("Volume ?", c, M(piT(c)) + ".")],
            traps: [TR((Math.PI * a ** 5) / 30, "On soustrait les carrés (R² − r²), pas le carré de la différence (R − r)²."), TR(c, "N'oublie pas π."), TR((Math.PI * a ** 5) / 3, "Retire le volume creusé par la parabole.")] }); },
      () => { const a = pk([2, 4, 6]), b = pk([4, 9, 16]), h = pk([10, 12, 15, 20]), I = (a * h * h) / 2 + b * h, V = Math.PI * I;
        return QR("Un vase a la forme du solide obtenu en faisant tourner " + M("f(x) = \\sqrt{" + a + "x + " + b + "}") + " (en cm) autour de l'axe des abscisses, entre " + M("x = 0") + " et " + M("x = " + h) + ". Quel est son volume en cm³ (" + RND[1] + ") ?", V, 1,
          M("V = \\pi\\int_0^{" + h + "} (" + a + "x + " + b + ")\\,dx = \\pi(" + nb((a * h * h) / 2) + " + " + nb(b * h) + ") = " + nb(I) + "\\pi \\approx " + nb(Math.round(V)) + tu("cm^3")) + ".",
          { ctx: "vase", guide: [GX(M("f(x)^2") + " ?", a + "x + " + b, M(a + "x + " + b) + "."), GS(M("\\int_0^{" + h + "} f(x)^2\\,dx") + " ?", I, M(nb(I)) + "."), GS("Volume (" + RND[1] + ") ?", V, M("\\approx " + nb(Math.round(V))) + " cm³.", 1)],
            traps: [TR(I, "N'oublie pas le facteur π."), TR(Math.PI * Math.sqrt(a * h + b) ** 2 * h, "Le rayon change avec x : il faut intégrer, ce n'est pas un cylindre."), TR(Math.PI * (a * h * h + b * h), "Primitive de " + a + "x : " + a + "x²/2.")] }); },
      () => { if (R.rand() < 0.5) { const a = pk([2, 4, 6]), c = (a * a) / 2;
          return QN(VQ + "le graphe de " + M("f(x) = \\sqrt{x}") + " entre " + M("x = 0") + " et " + M("x = a") + " engendre un solide de volume " + M(piT(c)) + ". Que vaut " + M("a") + " ?", a,
            M("V = \\pi\\int_0^a x\\,dx = \\frac{\\pi a^2}{2} = " + piT(c)) + " donne " + M("a^2 = " + a * a) + ", " + M("a = " + a) + ".",
            { ctx: "parametre-borne", guide: [GX("Volume en fonction de " + M("a") + ", divisé par " + M("\\pi") + " ?", "a^2/2", M("\\frac{a^2}{2}") + ".", true), GS(M("a^2") + " ?", a * a, M(a * a) + "."), GS(M("a") + " ?", a, M(a) + ".")], traps: [TR(a * a, "C'est a² : prends la racine."), TR(c, "V = πa²/2 : il reste à résoudre."), TR(r6(Math.sqrt(c)), "a²/2 = " + c + " : multiplie par 2 avant la racine.")] }); }
        const m = pk([2, 3, 4]), h = 3, c = 9 * m * m;
        return QN(VQ + "le graphe de " + M("f(x) = mx") + " (avec " + M("m > 0") + "), entre " + M("x = 0") + " et " + M("x = 3") + ", engendre un cône de volume " + M(piT(c)) + ". Que vaut " + M("m") + " ?", m,
          M("V = \\pi\\int_0^3 m^2x^2\\,dx = 9\\pi m^2 = " + piT(c)) + " donne " + M("m^2 = " + m * m) + ", " + M("m = " + m) + ".",
          { ctx: "parametre-cone", guide: [GX("Volume en fonction de " + M("m") + ", divisé par " + M("\\pi") + " ?", "9m^2", M("9m^2") + ".", true), GS(M("m^2") + " ?", m * m, M(m * m) + "."), GS(M("m") + " ?", m, M(m) + ".")], traps: [TR(m * m, "C'est m² : prends la racine."), TR(r6(Math.sqrt(c / 3)), "∫₀³ x² dx = 9, pas 3."), TR(c / 9, "Il reste la racine carrée.")] }); },
    ],
  };

  // ======================= lnexp : logarithme et exponentielle (4.AN.06a–c) =======================
  const LE = {
    1: [
      () => { const t = pk(["e", "eaff", "lnaff"]);
        if (t === "e") { const a = pk([2, 3, 5, 7, 10]);
          return QN("Résous " + M("e^{x} = " + a) + " (valeur exacte).", Math.log(a), "On applique " + M("\\ln") + " (réciproque de " + M("e^x") + ") : " + M("x = \\ln(" + a + ")") + ".",
            { ctx: "exp-simple", canon: "ln(" + a + ")", guide: [GS("On applique " + M("\\ln") + " des deux côtés : " + M("x") + " = ?", Math.log(a), M("\\ln(" + a + ")") + ".")], traps: [TR(Math.log10(a), "ln est le logarithme de base e, pas de base 10."), TR(a / Math.E, "e^x n'est pas e · x : on applique ln."), TR(Math.exp(a), "C'est e^" + a + " ; on cherche x tel que e^x = " + a + ".")] }); }
        if (t === "eaff") { const p = pk([2, 3]), q = nz(-3, 3), a = pk([2, 3, 5]), v = (Math.log(a) - q) / p;
          return QN("Résous " + M("e^{" + lin(p, q) + "} = " + a) + " (valeur exacte).", v, M(lin(p, q) + " = \\ln(" + a + ")") + ", donc " + M("x = \\frac{\\ln(" + a + ")" + sg(-q) + "}{" + p + "}") + ".",
            { ctx: "exp-affine", canon: "(ln(" + a + ")" + (q < 0 ? " + " + -q : " - " + q) + ")/" + p, guide: [GS(M(lin(p, q)) + " = ?", Math.log(a), M("\\ln(" + a + ")") + "."), GS(M("x") + " ?", v, M("\\frac{\\ln(" + a + ")" + sg(-q) + "}{" + p + "}") + ".")],
              traps: [TR(Math.log(a) / p - q, (q < 0 ? "On ajoute " + -q : "On retire " + q) + " avant de diviser par " + p + "."), TR((Math.log(a) + q) / p, "Attention au signe : on " + (q < 0 ? "ajoute " + -q : "retire " + q) + "."), TR((a - q) / p, "Applique d'abord ln : " + p + "x " + (q < 0 ? "−" : "+") + " " + Math.abs(q) + " = ln(" + a + ").")] }); }
        const p = pk([2, 3]), q = nz(-4, 4), k = pk([1, 2]), v = (Math.exp(k) - q) / p;
        return QN("Résous " + M("\\ln(" + lin(p, q) + ") = " + k) + " (valeur exacte).", v, M(lin(p, q) + " = e^{" + k + "}") + ", donc " + M("x = \\frac{e^{" + k + "}" + sg(-q) + "}{" + p + "}") + ".",
          { ctx: "ln-affine", canon: "(e^" + k + (q < 0 ? " + " + -q : " - " + q) + ")/" + p, guide: [GS(M(lin(p, q)) + " = ?", Math.exp(k), M("e^{" + k + "}") + "."), GS(M("x") + " ?", v, M("\\frac{e^{" + k + "}" + sg(-q) + "}{" + p + "}") + ".")],
            traps: [TR((k - q) / p, "ln(u) = " + k + " donne u = e^" + k + ", pas u = " + k + "."), TR((Math.log(k) - q) / p, "On applique l'exponentielle (réciproque de ln)."), TR(Math.exp(k) / p - q, (q < 0 ? "On ajoute " + -q : "On retire " + q) + " avant de diviser par " + p + ".")] }); },
      () => { const t = pk(["exp", "ln", "lnpow"]);
        if (t === "exp") { const a = pk([2, 3, 4, 5, -2, -3]), k = pk([2, 3, -1, -2]), b = nz(-5, 5), kS = k === -1 ? "-x" : k + "x", bS = (b < 0 ? " - " + -b : " + " + b), ans = a * k + "*exp(" + kS + ")" + bS;
          return QX("Dérive " + M("f(x) = " + a + "e^{" + kx(k) + "}" + sg(b) + "x") + ".", ans, M("(e^{" + kx(k) + "})' = " + k + "e^{" + kx(k) + "}") + ", donc " + M("f'(x) = " + a * k + "e^{" + kx(k) + "}" + sg(b)) + ".",
            { ctx: "derivee-exp", guide: [GX("Dérivée de " + M("e^{" + kx(k) + "}") + " ?", k + "*exp(" + kS + ")", M(k + "e^{" + kx(k) + "}") + "."), GX(M("f'(x)") + " ?", ans, M(a * k + "e^{" + kx(k) + "}" + sg(b)) + ".")],
              traps: [TX(a + "*exp(" + kS + ")" + bS, "e^(" + kS + ") est une composée : multiplie par la dérivée de " + kS + "."), TX(a * k + "*exp(" + kS + ")" + bS + "x", "La dérivée de " + b + "x est " + b + "."), TX(a * k + "*x*exp(" + kS + " - 1)" + bS, "e^u n'est pas une puissance : (e^u)' = u'·e^u, l'exposant ne change pas.")] }); }
        if (t === "ln") { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-4, 4), ans = a + "/x " + (b < 0 ? "- " + -2 * b : "+ " + 2 * b) + "x";
          return QX("Dérive " + M("f(x) = " + a + "\\ln(x)" + sg(b) + "x^2") + " (pour " + M("x > 0") + ").", ans, M("(\\ln x)' = \\frac{1}{x}") + ", donc " + M("f'(x) = \\frac{" + a + "}{x}" + sg(2 * b) + "x") + ".",
            { ctx: "derivee-ln", pos: true, guide: [GX("Dérivée de " + M("\\ln(x)") + " ?", "1/x", M("\\frac{1}{x}") + ".", true), GX(M("f'(x)") + " ?", ans, M("\\frac{" + a + "}{x}" + sg(2 * b) + "x") + ".", true)],
              traps: [TX(a + "*ln(x) " + (b < 0 ? "- " + -2 * b : "+ " + 2 * b) + "x", "La dérivée de ln(x) est 1/x."), TX(a + "/x " + (b < 0 ? "- " + -b : "+ " + b) + "x", "(x²)' = 2x."), TX(-a + "/x^2 " + (b < 0 ? "- " + -2 * b : "+ " + 2 * b) + "x", "1/x est la dérivée de ln(x) ; −1/x² est celle de 1/x.")] }); }
        const n = pk([2, 3, 4, 5]), a = pk([1, 2, 3]), ans = a * n + "/x";
        return QX("Dérive " + M("f(x) = " + (a === 1 ? "" : a) + "\\ln\\left(x^{" + n + "}\\right)") + " (pour " + M("x > 0") + "). Simplifie d'abord avec une propriété de " + M("\\ln") + ".", ans, M("\\ln(x^{" + n + "}) = " + n + "\\ln(x)") + ", donc " + M("f'(x) = \\frac{" + a * n + "}{x}") + ".",
          { ctx: "ln-puissance", pos: true, guide: [GX("Écris " + M("f(x)") + " avec " + M("\\ln(x)") + " seul.", a * n + "*ln(x)", M(a * n + "\\ln(x)") + ".", true), GX(M("f'(x)") + " ?", ans, M("\\frac{" + a * n + "}{x}") + ".", true)],
            traps: [TX(a + "/x^" + n, "ln(xⁿ) = n·ln(x) : sa dérivée est n/x."), TX(a + "/x", "ln(x^" + n + ") = " + n + "ln(x) : le facteur " + n + " reste."), TX(a * n + "*ln(x)", "Il reste à dériver : (ln x)' = 1/x.")] }); },
      () => { const t = pk(["inv", "exp", "exp2"]);
        if (t === "inv") { const a = pk([1, 2, 3]), m = pk([2, 3, 4, 5]), k = pk([2, 3, 5]), b = a * m, v = k * Math.log(m);
          return QN("Calcule " + M("\\int_{" + a + "}^{" + b + "} \\frac{" + k + "}{x}\\,dx") + " (valeur exacte).", v, "Primitive " + M(k + "\\ln(x)") + " : " + M(k + "\\ln(" + b + ") - " + k + "\\ln(" + a + ") = " + k + "\\ln\\left(\\frac{" + b + "}{" + a + "}\\right) = " + k + "\\ln(" + m + ")") + ".",
            { ctx: "integrale-inverse", canon: k + "*ln(" + m + ")", guide: [GX("Une primitive de " + M("\\frac{" + k + "}{x}") + " (pour " + M("x > 0") + ") ?", k + "*ln(x)", M(k + "\\ln(x)") + ".", true), GS("Intégrale ?", v, M(k + "\\ln(" + m + ")") + ".")],
              traps: [TR(Math.log(m), "N'oublie pas le facteur " + k + "."), TR(k / a - k / b, "La primitive de 1/x est ln(x), pas −1/x."), TR(k * Math.log(b), "Il faut soustraire F(" + a + ") = " + k + "ln(" + a + ")" + (a === 1 ? " = 0 : vérifie tes bornes" : "") + ".")] }); }
        if (t === "exp") { const m = pk([2, 3, 4, 5]), k = pk([2, 3, 4]), v = k * (m - 1);
          return QN("Calcule " + M("\\int_0^{\\ln(" + m + ")} " + k + "e^{x}\\,dx") + ".", v, "Primitive " + M(k + "e^x") + " : " + M(k + "e^{\\ln(" + m + ")} - " + k + "e^0 = " + k * m + " - " + k + " = " + v) + ".",
            { ctx: "integrale-exp", guide: [GS("Que vaut " + M("e^{\\ln(" + m + ")}") + " ?", m, M(m) + "."), GS("Intégrale " + M("\\left[" + k + "e^x\\right]_0^{\\ln(" + m + ")}") + " ?", v, M(v) + ".")],
              traps: [TR(k * m, "Il faut soustraire " + k + "e⁰ = " + k + "."), TR(k * Math.log(m), "La primitive de e^x est e^x."), TR(k * (m - 1) * Math.log(m), "e^(ln " + m + ") = " + m + ".")] }); }
        const k = pk([2, 4, 6]), v = (k / 2) * (Math.E ** 2 - 1);
        return QN("Calcule " + M("\\int_0^{1} " + k + "e^{2x}\\,dx") + " (valeur exacte).", v, "Primitive " + M(fT(k / 2) + "e^{2x}") + " : " + M(fT(k / 2) + "(e^{2} - 1)") + ".",
          { ctx: "integrale-exp2x", canon: fS(k / 2) + "*(e^2 - 1)", guide: [GX("Une primitive de " + M(k + "e^{2x}") + " ?", fS(k / 2) + "*exp(2x)", M(fT(k / 2) + "e^{2x}") + "."), GS("Intégrale ?", v, M(fT(k / 2) + "(e^2 - 1)") + ".")],
            traps: [TR(k * (Math.E ** 2 - 1), "La primitive de e^(2x) est e^(2x)/2."), TR((k / 2) * Math.E ** 2, "Il faut soustraire la valeur en 0 : e⁰ = 1."), TR(2 * k * (Math.E ** 2 - 1), "On divise par 2, on ne multiplie pas.")] }); },
    ],
    2: [
      () => { const t = pk(["xln", "xexp", "x2ln"]);
        if (t === "xln") { const a = pk([2, 3, 4, -2]), ans = a + "*ln(x) + " + a;
          return QX("Dérive " + M("f(x) = " + a + "x\\ln(x)") + " (pour " + M("x > 0") + ").", ans, "Règle du produit : " + M("f'(x) = " + a + "\\ln(x) + " + a + "x \\cdot \\frac{1}{x} = " + a + "\\ln(x)" + sg(a)) + ".",
            { ctx: "produit-ln", pos: true, guide: [GX(M("u = " + a + "x") + ", " + M("v = \\ln(x)") + ". Que vaut " + M("u'v") + " ?", a + "*ln(x)", M(a + "\\ln(x)") + ".", true), GX(M("uv'") + " (simplifié) ?", String(a), M(a) + ".", true), GX(M("f'(x)") + " ?", ans, M(a + "\\ln(x)" + sg(a)) + ".", true)],
              traps: [TX(a + "/x", "C'est un produit : (uv)' = u'v + uv'."), TX(a + "*ln(x)", "Il manque uv' = " + a + "x · 1/x = " + a + "."), TX(String(a), "Il manque u'v = " + a + "ln(x).")] }); }
        if (t === "xexp") { const b = nz(-4, 4), ans = "(x " + (b + 1 < 0 ? "- " + -(b + 1) : "+ " + (b + 1)) + ")*exp(x)";
          if (b === -1) return null;
          return QX("Dérive " + M("f(x) = (" + lin(1, b) + ")e^{x}") + ".", ans, M("f'(x) = 1 \\cdot e^x + (" + lin(1, b) + ")e^x = (" + lin(1, b + 1) + ")e^x") + ".",
            { ctx: "produit-exp", guide: [GX(M("u'v") + " avec " + M("u = " + lin(1, b)) + ", " + M("v = e^x") + " ?", "exp(x)", M("e^x") + "."), GX(M("uv'") + " ?", "(" + linS(1, b) + ")*exp(x)", M("(" + lin(1, b) + ")e^x") + "."), GX(M("f'(x)") + " (factorisé par " + M("e^x") + ") ?", ans, M("(" + lin(1, b + 1) + ")e^x") + ".")],
              traps: [TX("exp(x)", "C'est un produit : (uv)' = u'v + uv'."), TX("(" + linS(1, b) + ")*exp(x)", "Il manque u'v = 1 · e^x."), TX("(" + linS(1, b - 1) + ")*exp(x)", "u'v + uv' : on additionne e^x.")] }); }
        const a = pk([1, 2, 3]), aX = (a === 1 ? "" : a) + "x", ans = 2 * a + "x*ln(x) + " + aX;
        return QX("Dérive " + M("f(x) = " + (a === 1 ? "" : a) + "x^2\\ln(x)") + " (pour " + M("x > 0") + ").", ans, M("f'(x) = " + 2 * a + "x\\ln(x) + " + (a === 1 ? "" : a) + "x^2 \\cdot \\frac{1}{x} = " + 2 * a + "x\\ln(x) + " + (a === 1 ? "" : a) + "x") + ".",
          { ctx: "produit-x2ln", pos: true, guide: [GX(M("u'v") + " ?", 2 * a + "x*ln(x)", M(2 * a + "x\\ln(x)") + ".", true), GX(M("uv'") + " (simplifié) ?", aX, M(aX) + ".", true), GX(M("f'(x)") + " ?", ans, M(2 * a + "x\\ln(x) + " + (a === 1 ? "" : a) + "x") + ".", true)],
            traps: [TX(2 * a + "x/x", "C'est un produit : (uv)' = u'v + uv'."), TX(2 * a + "x*ln(x)", "Il manque uv' = " + (a === 1 ? "" : a) + "x² · 1/x."), TX(2 * a + "x*ln(x) + " + a, "x² · 1/x = x.")] }); },
      () => { if (R.rand() < 0.5) { const [p, q] = pk([[2, 3], [2, 5], [3, 4], [2, 4], [3, 5], [2, 6], [4, 5]]), S = p + q, Pr = p * q;
          return QSet("Résous " + M("e^{2x} - " + S + "e^{x} + " + Pr + " = 0") + " (valeurs exactes ; sépare-les par « ; »).", [Math.log(p), Math.log(q)],
            "Avec " + M("X = e^x") + " : " + M("X^2 - " + S + "X + " + Pr + " = (X - " + p + ")(X - " + q + ") = 0") + ", donc " + M("e^x = " + p) + " ou " + M("e^x = " + q) + " : " + M("x = \\ln(" + p + ")") + " ou " + M("x = \\ln(" + q + ")") + ".",
            { ctx: "exp-quadratique", guide: [GSet("Avec " + M("X = e^x") + ", résous " + M("X^2 - " + S + "X + " + Pr + " = 0") + ".", [p, q], M(p) + " et " + M(q) + "."), GSet("Valeurs de " + M("x") + " ?", [Math.log(p), Math.log(q)], M("\\ln(" + p + ")") + " et " + M("\\ln(" + q + ")") + ".")],
              traps: [TSt([p, q], "Ce sont les valeurs de X = e^x : il reste à prendre ln."), TSt([Math.log10(p), Math.log10(q)], "ln, pas log de base 10."), TSt([Math.log(p)], "Il y a deux solutions.")] }); }
        const x0 = pk([2, 3, 4]), a = R.int(1, 5), b = x0 * (x0 + a);
        return QN("Résous " + M("\\ln(x) + \\ln(x + " + a + ") = \\ln(" + b + ")") + ".", x0, M("\\ln(x(x + " + a + ")) = \\ln(" + b + ")") + " donne " + M("x^2 + " + a + "x - " + b + " = 0") + " : " + M("x = " + x0) + " ou " + M("x = " + (-x0 - a)) + ". Seul " + M("x = " + x0) + " est positif (ln).",
          { ctx: "ln-somme", guide: [GSet("Solutions de " + M("x(x + " + a + ") = " + b) + " ?", [x0, -x0 - a], M(x0) + " et " + M(-x0 - a) + "."), GS("Solution admissible (" + M("x > 0") + ") ?", x0, M(x0) + ".")],
            traps: [TR(-x0 - a, "ln(x) n'existe que pour x > 0 : cette valeur est exclue."), TR(b - a, "ln(x) + ln(x + " + a + ") = ln(x(x + " + a + ")), pas ln(2x + " + a + ")."), TR(r6((b - a) / 2), "ln(a) + ln(b) = ln(a·b) : on multiplie.")] }); },
      () => { const t = pk(["lnq", "expq", "lnl"]);
        if (t === "lnq") { const a = pk([1, 2, 3]), b = pk([1, 2, 4, 5]), ans = 2 * a + "x/(" + tp([a, 0, b]) + ")";
          return QX("Dérive " + M("f(x) = \\ln(" + P2([a, 0, b]) + ")") + ".", ans, M("(\\ln u)' = \\frac{u'}{u}") + " : " + M("f'(x) = \\frac{" + 2 * a + "x}{" + P2([a, 0, b]) + "}") + ".",
            { ctx: "ln-compose", guide: [GX("Dérivée de " + M("u(x) = " + P2([a, 0, b])) + " ?", 2 * a + "x", M(2 * a + "x") + "."), GX(M("f'(x) = \\frac{u'}{u}") + " ?", ans, M("\\frac{" + 2 * a + "x}{" + P2([a, 0, b]) + "}") + ".")],
              traps: [TX("1/(" + tp([a, 0, b]) + ")", "Composée : multiplie par u'(x) = " + 2 * a + "x."), TX(2 * a + "x", "(ln u)' = u'/u : on divise par u."), TX("1/(" + 2 * a + "x)", "C'est u'/u, pas 1/u'.")] }); }
        if (t === "expq") { const c = nz(-3, 3), k = pk([1, 2, 3]), ans = 2 * k + "x*exp(" + tp([k, 0, c]) + ")";
          return QX("Dérive " + M("f(x) = e^{" + P2([k, 0, c]) + "}") + ".", ans, M("(e^u)' = u'e^u") + " : " + M("f'(x) = " + 2 * k + "x\\,e^{" + P2([k, 0, c]) + "}") + ".",
            { ctx: "exp-compose", guide: [GX("Dérivée de l'exposant " + M(P2([k, 0, c])) + " ?", 2 * k + "x", M(2 * k + "x") + "."), GX(M("f'(x)") + " ?", ans, M(2 * k + "x\\,e^{" + P2([k, 0, c]) + "}") + ".")],
              traps: [TX("exp(" + tp([k, 0, c]) + ")", "Composée : multiplie par la dérivée de l'exposant."), TX("(" + tp([k, 0, c]) + ")*exp(" + tp([k, 0, c]) + " - 1)", "e^u n'est pas une puissance de u : (e^u)' = u'·e^u."), TX(2 * k + "x*exp(" + 2 * k + "x)", "On garde l'exposant tel quel et on multiplie par sa dérivée.")] }); }
        const a = pk([2, 3, 5]), b = nz(-4, 4), ans = a + "/(" + linS(a, b) + ")";
        return QX("Dérive " + M("f(x) = \\ln(" + lin(a, b) + ")") + ".", ans, M("f'(x) = \\frac{" + a + "}{" + lin(a, b) + "}") + " (" + M("\\frac{u'}{u}") + ").",
          { ctx: "ln-affine", guide: [GX(M("u'(x)") + " pour " + M("u = " + lin(a, b)) + " ?", String(a), M(a) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + a + "}{" + lin(a, b) + "}") + ".")],
            traps: [TX("1/(" + linS(a, b) + ")", "Composée : multiplie par u' = " + a + "."), TX("1/x", "ln(" + linS(a, b) + ") n'est pas ln(x)."), TX(a + "/x", "u'/u : on divise par u = " + linS(a, b) + ".")] }); },
    ],
    3: [
      () => { if (R.rand() < 0.5) { const a = pk([2, 3, 5]), v = Math.log(a) - 1;
          return QN("Donne l'ordonnée à l'origine de la tangente au graphe de " + M("f(x) = \\ln(x)") + " au point d'abscisse " + M(a) + " (valeur exacte).", v, M("f(" + a + ") = \\ln(" + a + ")") + ", " + M("f'(" + a + ") = \\frac{1}{" + a + "}") + " : " + M("y = \\frac{1}{" + a + "}(x - " + a + ") + \\ln(" + a + ") = \\frac{x}{" + a + "} + \\ln(" + a + ") - 1") + " ; ordonnée à l'origine " + M("\\ln(" + a + ") - 1") + "." /* 27.11 (recalcul) : le corrigé ne donnait pas la valeur demandée */,
            { ctx: "tangente-ln", canon: "ln(" + a + ") - 1", guide: [GS(M("f(" + a + ")") + " ?", Math.log(a), M("\\ln(" + a + ")") + "."), GS("Pente " + M("f'(" + a + ")") + " ?", 1 / a, M("\\frac{1}{" + a + "}") + "."), GS("Ordonnée à l'origine ?", v, M("\\ln(" + a + ") - 1") + ".")],
              traps: [TR(Math.log(a), "C'est f(" + a + ") ; l'ordonnée à l'origine est la valeur de la tangente en x = 0."), TR(Math.log(a) + 1, "y = (1/" + a + ")(x − " + a + ") + ln(" + a + ") : en x = 0, on retire 1."), TR(1 / a, "C'est la pente.")] }); }
        const a = pk([2, 3, -1, -2]), v = Math.exp(a) * (1 - a);
        return QN("Donne l'ordonnée à l'origine de la tangente au graphe de " + M("f(x) = e^{x}") + " au point d'abscisse " + M(a) + " (valeur exacte).", v, "Pente et valeur " + M("e^{" + a + "}") + " : " + M("y = e^{" + a + "}(x" + sg(-a) + ") + e^{" + a + "}") + ", en " + M("x = 0") + " : " + M("e^{" + a + "}(1" + sg(-a) + ") = " + fT(1 - a) + "e^{" + a + "}") + ".",
          { ctx: "tangente-exp", canon: fS(1 - a) + "*e^(" + a + ")", guide: [GS(M("f(" + a + ") = f'(" + a + ")") + " ?", Math.exp(a), M("e^{" + a + "}") + "."), GS("Ordonnée à l'origine ?", v, M(fT(1 - a) + "e^{" + a + "}") + ".")],
            traps: [TR(Math.exp(a), "C'est f(" + a + ") ; calcule la tangente en x = 0."), TR(Math.exp(a) * (1 + a), "y = e^a(x − a) + e^a : en x = 0, e^a(1 − a)."), TR(1, "C'est f(0), pas la tangente en 0.")] }); },
      () => { if (R.rand() < 0.5) { const a = pk([2, 3, 4, 5]), v = a - a * Math.log(a);
          return QN("Quelle est la valeur minimale de " + M("f(x) = x - " + a + "\\ln(x)") + " sur " + M("]0 \\,;\\, +\\infty[") + " (valeur exacte) ?", v, M("f'(x) = 1 - \\frac{" + a + "}{x}") + " s'annule en " + M("x = " + a) + " (− puis +) : minimum " + M("f(" + a + ") = " + a + " - " + a + "\\ln(" + a + ")") + ".",
            { ctx: "minimum-ln", canon: a + " - " + a + "*ln(" + a + ")", guide: [GX(M("f'(x)") + " ?", "1 - " + a + "/x", M("1 - \\frac{" + a + "}{x}") + ".", true), GS("Où " + M("f'") + " s'annule-t-elle ?", a, M(a) + "."), GS("Valeur minimale ?", v, M(a + " - " + a + "\\ln(" + a + ")") + ".")],
              traps: [TR(a, "C'est l'abscisse du minimum ; on demande la valeur f(" + a + ")."), TR(a - Math.log(a), "f(" + a + ") = " + a + " − " + a + "·ln(" + a + ")."), TR(1 - Math.log(a), "Remplace x par " + a + " dans f, pas dans f'.")] }); }
        const k = pk([2, 3, 4]), v = k / Math.E;
        return QN("Quelle est la valeur maximale de " + M("f(x) = x\\,e^{-\\frac{x}{" + k + "}}") + " pour " + M("x \\geq 0") + " (valeur exacte) ?", v, M("f'(x) = \\left(1 - \\frac{x}{" + k + "}\\right)e^{-\\frac{x}{" + k + "}}") + " s'annule en " + M("x = " + k) + " : maximum " + M("f(" + k + ") = " + k + "e^{-1} = \\frac{" + k + "}{e}") + ".",
          { ctx: "maximum-exp", canon: k + "/e", guide: [GX(M("f'(x)") + " ?", "(1 - x/" + k + ")*exp(-x/" + k + ")", M("\\left(1 - \\frac{x}{" + k + "}\\right)e^{-\\frac{x}{" + k + "}}") + "."), GS("Où " + M("f'") + " s'annule-t-elle ?", k, M(k) + "."), GS("Valeur maximale ?", v, M("\\frac{" + k + "}{e}") + ".")],
            traps: [TR(k, "C'est l'abscisse du maximum ; calcule f(" + k + ")."), TR(k * Math.E, "e^(−1) = 1/e."), TR(1 / Math.E, "f(" + k + ") = " + k + " · e^(−1).")] }); },
      () => { const t = pk(["uu", "uexp", "lnx"]);
        if (t === "uu") { const a = pk([1, 2, 3]), v = Math.log(a * a + 1);
          return QN("Calcule " + M("\\int_0^{" + a + "} \\frac{2x}{x^2 + 1}\\,dx") + " (valeur exacte).", v, "Forme " + M("\\frac{u'}{u}") + " avec " + M("u = x^2 + 1 > 0") + " : primitive " + M("\\ln(x^2 + 1)") + ", donc " + M("\\ln(" + (a * a + 1) + ") - \\ln(1) = \\ln(" + (a * a + 1) + ")") + ".",
            { ctx: "u-prime-sur-u", canon: "ln(" + (a * a + 1) + ")", guide: [GX("Une primitive ?", "ln(x^2 + 1)", M("\\ln(x^2 + 1)") + "."), GS("Intégrale ?", v, M("\\ln(" + (a * a + 1) + ")") + ".")],
              traps: [TR(v / 2, "Le numérateur 2x est exactement u' : pas de facteur 1/2."), TR(1 - 1 / (a * a + 1), "u'/u se primitive en ln(u)."), TR(2 * v, "Le numérateur 2x est déjà u'.")] }); }
        if (t === "uexp") { const a = pk([1, 2]), v = (Math.exp(a * a) - 1) / 2;
          return QN("Calcule " + M("\\int_0^{" + a + "} x\\,e^{x^2}\\,dx") + " (valeur exacte).", v, "Forme " + M("\\frac{1}{2}u'e^{u}") + " avec " + M("u = x^2") + " : primitive " + M("\\frac{1}{2}e^{x^2}") + ", donc " + M("\\frac{e^{" + a * a + "} - 1}{2}") + ".",
            { ctx: "u-prime-exp", canon: "(e^" + a * a + " - 1)/2", guide: [GX("Une primitive de " + M("x\\,e^{x^2}") + " ?", "exp(x^2)/2", M("\\frac{1}{2}e^{x^2}") + "."), GS("Intégrale ?", v, M("\\frac{e^{" + a * a + "} - 1}{2}") + ".")],
              traps: [TR(Math.exp(a * a) - 1, "(e^(x²))' = 2x·e^(x²) : il faut le facteur 1/2."), TR(Math.exp(a * a) / 2, "Il faut soustraire la valeur en 0 : e⁰/2."), TR(a * Math.exp(a * a), "Il faut une primitive, pas f(" + a + ").")] }); }
        const k = pk([2, 3, 4]), v = (k * k) / 2;
        return QN("Calcule " + M("\\int_1^{e^{" + k + "}} \\frac{\\ln(x)}{x}\\,dx") + ".", v, "Forme " + M("u'u") + " avec " + M("u = \\ln(x)") + " : primitive " + M("\\frac{(\\ln x)^2}{2}") + ", donc " + M("\\frac{" + k + "^2}{2} - 0 = " + fT(v)) + ".",
          { ctx: "ln-sur-x", guide: [GX("Une primitive de " + M("\\frac{\\ln(x)}{x}") + " ?", "ln(x)^2/2", M("\\frac{(\\ln x)^2}{2}") + ".", true), GS("Que vaut " + M("\\ln\\left(e^{" + k + "}\\right)") + " ?", k, M(k) + "."), GS("Intégrale ?", v, M(fT(v)) + ".")],
            traps: [TR(k * k, "(u²)' = 2u·u' : primitive de u·u' = u²/2."), TR(k, "ln(e^" + k + ") = " + k + ", mais la primitive est (ln x)²/2."), TR(k / 2, "La primitive de ln(x)/x est (ln x)²/2 : on élève au carré.")] }); },
    ],
  };

  // ======================= croissance : modèles exponentiels (4.AN.07a–c) =======================
  const CR = {
    1: [
      /* 25.11 (audit niveau 4e) : « calcule N(3) » (une évaluation à la calculatrice) et « demi-vie : diviser par 2ⁿ »
         étaient du niveau de la 2e (modexp). Remplacés : vitesse de croissance N'(t) = k·N(t) (lien avec la dérivée)
         et demi-vie pour une durée qui n'est pas un multiple de la demi-vie (4.AN.07a–b). */
      () => { const c = pk([["bacteries", "Une culture compte", "bactéries", "heures", "bactéries par heure", [200, 500, 1000], [0.3, 0.4, 0.5], [3, 4, 5, 6]], ["ville", "Une ville compte", "habitants", "ans", "habitants par an", [12000, 25000, 40000], [0.015, 0.02, 0.025], [10, 15, 20]], ["placement", "Un capital placé à intérêt continu vaut", "CHF", "ans", "CHF par an", [5000, 8000, 10000], [0.02, 0.03, 0.04], [5, 10, 15]]]),
          N0 = pk(c[5]), k = pk(c[6]), T = pk(c[7]), kT = r6(k * T), NT = N0 * Math.exp(kT), v = k * NT;
        return QR(c[1] + " " + M(nb(N0)) + " " + c[2] + " au départ et suit le modèle " + M("N(t) = " + nb(N0) + "\\,e^{" + nb(k) + "t}") + " (" + M("t") + " en " + c[3] + "). À quelle vitesse " + M("N") + " augmente-t-il à l'instant " + M("t = " + T) + ", c'est-à-dire combien vaut " + M("N'(" + T + ")") + " (en " + c[4] + ", " + RND[1] + ") ?", v, 1,
          M("N'(t) = " + nb(k) + " \\cdot " + nb(N0) + "\\,e^{" + nb(k) + "t} = " + nb(k) + "\\,N(t)") + " ; " + M("N(" + T + ") \\approx " + nb(Math.round(NT))) + ", donc " + M("N'(" + T + ") \\approx " + nb(Math.round(v))) + " " + c[4] + ".",
          { ctx: "vitesse-" + c[0], guide: [GS(M("N(" + T + ")") + " (" + RND[1] + ") ?", NT, M("\\approx " + nb(Math.round(NT))) + ".", 1), GS(M("N'(" + T + ") = " + nb(k) + " \\cdot N(" + T + ")") + " (" + RND[1] + ") ?", v, M("\\approx " + nb(Math.round(v))) + ".", 1)],
            traps: [TR(NT, "C'est la valeur N(" + T + ") ; la vitesse est la dérivée N'(" + T + ") = k · N(" + T + ")."), TR(k * N0, "C'est la vitesse au départ (t = 0) ; ici t = " + T + "."), TR(NT / T, "N(t) ÷ t est un taux moyen ; on veut la vitesse instantanée N'(t).")] }); },
      () => { if (R.rand() < 0.5) { const k = pk([0.02, 0.035, 0.05, 0.07, 0.1, 0.25]), u = k >= 0.25 ? "heures" : "ans", T = Math.log(2) / k;
          return QR("Une grandeur suit le modèle " + M("N(t) = N_0\\,e^{" + nb(k) + "t}") + " (" + M("t") + " en " + u + "). Quel est son temps de doublement, en " + u + " (" + RND[0.1] + ") ?", T, 0.1,
            M("e^{" + nb(k) + "T} = 2 \\iff T = \\frac{\\ln 2}{" + nb(k) + "} \\approx " + dT(T, 1)) + " " + u + ".",
            { ctx: "doublement", guide: [GS(M("e^{" + nb(k) + "T} = 2") + " donne " + M(nb(k) + "T = \\ln 2") + ". Que vaut " + M("\\ln 2") + " (" + RND[0.001] + ") ?", Math.log(2), M("\\approx 0{,}693") + ".", 0.001), GS(M("T") + " (" + RND[0.1] + ") ?", T, M("\\approx " + dT(T, 1)) + ".", 0.1)],
              traps: [TR(2 / k, "On résout e^(kT) = 2, donc T = ln(2) ÷ k."), TR(1 / k, "Il manque le facteur ln 2."), TR(Math.log(2) * k, "On divise ln 2 par k.")] }); }
        const T = pk([20, 30, 45, 5, 8]), u = T >= 20 ? "minutes" : "heures", k = Math.log(2) / T;
        return QR("Une population de cellules double toutes les " + M(T) + " " + u + ". Dans le modèle " + M("N(t) = N_0\\,e^{kt}") + " (" + M("t") + " en " + u + "), que vaut " + M("k") + " (" + RND[0.001] + ") ?", k, 0.001,
          M("e^{" + T + "k} = 2 \\iff k = \\frac{\\ln 2}{" + T + "} \\approx " + dT(k, 3)) + ".",
          { ctx: "taux-doublement", guide: [GS("Équation : " + M("e^{" + T + "k} = 2") + ". Que vaut " + M(T + "k") + " (" + RND[0.001] + ") ?", Math.log(2), M("\\ln 2 \\approx 0{,}693") + ".", 0.001), GS(M("k") + " (" + RND[0.001] + ") ?", k, M("\\approx " + dT(k, 3)) + ".", 0.001)],
            traps: [TR(2 / T, "On résout e^(kT) = 2, donc k = ln(2) ÷ T."), TR(1 / (2 * T), "On cherche e^(kT) = 2 (la quantité double), puis on applique ln."), TR(Math.log(2) * T, "On divise ln 2 par " + T + ".")] }); },
      () => { const s = pk([["de l'iode 131", 8, "jours", [5, 12, 20]], ["du césium 137", 30, "ans", [10, 45, 75]], ["d'un médicament", 6, "heures", [3, 9, 15]], ["du strontium 90", 29, "ans", [10, 50, 70]]]), t = pk(s[3]), m0 = pk([20, 40, 50, 80]), u = s[0] === "d'un médicament" ? "mg" : "g", k = Math.log(2) / s[1], v = m0 * Math.exp(-k * t);
        return QR("La demi-vie " + s[0] + " est " + M(s[1]) + " " + s[2] + ". Il y en a " + M(m0 + tu(u)) + " au départ. Avec le modèle " + M("m(t) = m_0\\,e^{-kt}") + ", combien en reste-t-il (en " + u + ", " + RND[0.1] + ") après " + M(t) + " " + s[2] + " ?", v, 0.1,
          M("e^{-" + s[1] + "k} = \\frac{1}{2} \\iff k = \\frac{\\ln 2}{" + s[1] + "} \\approx " + dT(k, 4)) + " ; " + M("m(" + t + ") = " + m0 + "\\,e^{-" + t + "k} = " + m0 + " \\cdot 2^{-\\frac{" + t + "}{" + s[1] + "}} \\approx " + dT(v, 1)) + " " + u + ".",
          { ctx: "demi-vie-" + s[2], guide: [GS(M("k = \\frac{\\ln 2}{" + s[1] + "}") + " (" + RND[0.0001] + ") ?", k, M("\\approx " + dT(k, 4)) + ".", 0.0001), GS("Masse restante (" + RND[0.1] + ") ?", v, M("\\approx " + dT(v, 1)) + " " + u + ".", 0.1)],
            traps: [TR(m0 * (1 - t / (2 * s[1])), "La décroissance n'est pas linéaire : m₀ · e^(−kt)."), TR(m0 / 2 / (t / s[1]), "On ne divise pas par le nombre de demi-vies : m₀ · (1/2)^(t/T)."), TR(m0 * Math.exp(-t / s[1]), "k = ln 2 ÷ T, pas 1 ÷ T.")] }); },
    ],
    2: [
      () => { const r = pk([2, 3, 1.5, 4, 2.5]), t1 = pk([4, 5, 8, 10]), N0 = pk([100, 200, 500]), N1 = N0 * r, k = Math.log(r) / t1, it = pk([["bactéries", "heures"], ["levures", "heures"], ["abonnés", "mois"]]);
        return QR("Au départ, on compte " + M(nb(N0)) + " " + it[0] + " ; après " + M(t1) + " " + it[1] + ", il y en a " + M(nb(N1)) + ". Dans le modèle " + M("N(t) = " + N0 + "\\,e^{kt}") + ", que vaut " + M("k") + " (" + RND[0.001] + ") ?", k, 0.001,
          M(N0 + "\\,e^{" + t1 + "k} = " + nb(N1) + " \\iff e^{" + t1 + "k} = " + nb(r) + " \\iff k = \\frac{\\ln(" + nb(r) + ")}{" + t1 + "} \\approx " + dT(k, 3)) + ".",
          { ctx: "taux-" + it[0], guide: [GS("Rapport " + M("\\frac{N(" + t1 + ")}{N(0)}") + " ?", r, M(nb(r)) + "."), GS(M("\\ln") + " de ce rapport (" + RND[0.001] + ") ?", Math.log(r), M("\\approx " + dT(Math.log(r), 3)) + ".", 0.001), GS(M("k") + " (" + RND[0.001] + ") ?", k, M("\\approx " + dT(k, 3)) + ".", 0.001)],
            traps: [TR((r - 1) / t1, "Ce serait un taux linéaire : ici, k = ln(" + dS(r) + ") ÷ " + t1 + "."), TR(r / t1, "Prends le logarithme du rapport."), TR(Math.log(N1) / t1, "On prend ln du rapport N(" + t1 + ")/N(0), pas ln(N(" + t1 + ")).")] }); },
      () => { const N0 = pk([100, 200, 500]), m = pk([5, 10, 20, 50]), S = N0 * m, k = pk([0.2, 0.35, 0.15, 0.5]), t = Math.log(m) / k;
        return QR("Une colonie suit " + M("N(t) = " + N0 + "\\,e^{" + nb(k) + "t}") + " (" + M("t") + " en jours). Après combien de jours atteint-elle " + M(nb(S)) + " individus (" + RND[0.1] + ") ?", t, 0.1,
          M("e^{" + nb(k) + "t} = \\frac{" + nb(S) + "}{" + N0 + "} = " + m + " \\iff t = \\frac{\\ln(" + m + ")}{" + nb(k) + "} \\approx " + dT(t, 1)) + " jours.",
          { ctx: "seuil", guide: [GS("Que doit valoir " + M("e^{" + nb(k) + "t}") + " ?", m, M(m) + "."), GS(M(nb(k) + "t = \\ln(" + m + ")") + ". Que vaut " + M("\\ln(" + m + ")") + " (" + RND[0.001] + ") ?", Math.log(m), M("\\approx " + dT(Math.log(m), 3)) + ".", 0.001), GS(M("t") + " (" + RND[0.1] + ") ?", t, M("\\approx " + dT(t, 1)) + " jours.", 0.1)],
            traps: [TR(m / k, "Prends ln : t = ln(" + m + ") ÷ " + dS(k) + "."), TR(Math.log(S) / k, "On divise d'abord par N₀ = " + N0 + "."), TR(Math.log(m) * k, "On divise par k.")] }); },
      () => { if (R.rand() < 0.6) { const p = pk([0.8, 0.6, 0.4, 0.35, 0.7]), n = -Math.log(p) / Math.log(2), t = 5730 * n;
          return QR("Un os ne contient plus que " + M(dT(p * 100, 0) + " \\%") + " du carbone 14 qu'il contenait à sa formation. La demi-vie du carbone 14 est " + M("5\\text{'}730") + " ans. Quel est son âge (" + RND[10] + ") ?", t, 10,
            M("\\left(\\frac{1}{2}\\right)^{n} = " + dT(p) + " \\iff n = -\\frac{\\ln(" + dT(p) + ")}{\\ln 2} \\approx " + dT(n, 3)) + " demi-vies, soit " + M("t \\approx " + nb(Math.round(t / 10) * 10)) + " ans.",
            { ctx: "carbone14", guide: [GS("Nombre de demi-vies " + M("n") + " tel que " + M("0{,}5^{n} = " + dT(p)) + " (" + RND[0.001] + ") ?", n, M("\\approx " + dT(n, 3)) + ".", 0.001), GS("Âge (" + RND[10] + ") ?", t, M("\\approx " + nb(Math.round(t / 10) * 10)) + " ans.", 10)],
              traps: [TR(5730 * 2 * (1 - p), "La décroissance n'est pas linéaire : utilise ln."), TR(5730 * p, "On cherche le nombre de demi-vies n avec 0,5ⁿ = " + dS(p) + "."), TR(-5730 * Math.log(p), "Divise aussi par ln 2.")] }); }
        const h = pk([4, 6, 8]), p = pk([0.2, 0.3, 0.1]), t = (-h * Math.log(p)) / Math.log(2);
        return QR("La concentration d'un médicament dans le sang diminue de moitié toutes les " + M(h) + " heures. Après combien d'heures n'en reste-t-il que " + M(dT(p * 100, 0) + " \\%") + " (" + RND[0.1] + ") ?", t, 0.1,
          M("0{,}5^{\\frac{t}{" + h + "}} = " + dT(p) + " \\iff t = " + h + " \\cdot \\frac{\\ln(" + dT(p) + ")}{\\ln(0{,}5)} \\approx " + dT(t, 1)) + " h.",
          { ctx: "medicament-temps", guide: [GS("Nombre de demi-vies (" + RND[0.001] + ") ?", t / h, M("\\approx " + dT(t / h, 3)) + ".", 0.001), GS("Durée en heures (" + RND[0.1] + ") ?", t, M("\\approx " + dT(t, 1)) + " h.", 0.1)],
            traps: [TR(h * (1 - p) * 2, "La décroissance n'est pas linéaire."), TR(-h * Math.log(p), "Divise par ln 2 (ou par −ln 0,5)."), TR(t / h, "C'est le nombre de demi-vies : multiplie par " + h + " h.")] }); },
    ],
    3: [
      () => { const Ta = pk([18, 20, 22]), T0 = pk([80, 90, 95]), k = pk([0.05, 0.08, 0.1]);
        if (R.rand() < 0.5) { const t = pk([10, 15, 20]), v = Ta + (T0 - Ta) * Math.exp(-k * t);
          return QR("Un thé à " + M(T0 + tu("°C")) + " refroidit dans une pièce à " + M(Ta + tu("°C")) + " : " + M("T(t) = " + Ta + " + " + (T0 - Ta) + "e^{-" + nb(k) + "t}") + " (" + M("t") + " en minutes). Quelle est sa température après " + M(t) + " minutes (" + RND[0.1] + ") ?", v, 0.1,
            M("T(" + t + ") = " + Ta + " + " + (T0 - Ta) + "e^{-" + nb(r6(k * t)) + "} \\approx " + dT(v, 1)) + " °C.",
            { ctx: "refroidissement-temperature", guide: [GS(M("e^{-" + nb(r6(k * t)) + "}") + " (" + RND[0.0001] + ") ?", Math.exp(-k * t), M("\\approx " + dT(Math.exp(-k * t), 4)) + ".", 0.0001), GS("Température (" + RND[0.1] + ") ?", v, M("\\approx " + dT(v, 1)) + " °C.", 0.1)],
              traps: [TR((T0 - Ta) * Math.exp(-k * t), "Ajoute la température de la pièce, " + Ta + " °C."), TR(T0 * Math.exp(-k * t), "Le thé tend vers " + Ta + " °C, pas vers 0 : T = " + Ta + " + " + (T0 - Ta) + "e^(−kt)."), TR(T0 - k * t * (T0 - Ta), "La décroissance est exponentielle.")] }); }
        const Tc = pk([40, 50]), r = (T0 - Ta) / (Tc - Ta), t = Math.log(r) / k;
        return QR("Un thé à " + M(T0 + tu("°C")) + " refroidit dans une pièce à " + M(Ta + tu("°C")) + " : " + M("T(t) = " + Ta + " + " + (T0 - Ta) + "e^{-" + nb(k) + "t}") + " (" + M("t") + " en minutes). Au bout de combien de minutes atteint-il " + M(Tc + tu("°C")) + " (" + RND[0.1] + ") ?", t, 0.1,
          M(Ta + " + " + (T0 - Ta) + "e^{-" + nb(k) + "t} = " + Tc + " \\iff e^{-" + nb(k) + "t} = \\frac{" + (Tc - Ta) + "}{" + (T0 - Ta) + "} \\iff t = \\frac{\\ln(" + fT(r) + ")}{" + nb(k) + "} \\approx " + dT(t, 1)) + " min.",
          { ctx: "refroidissement-temps", guide: [GS("Que doit valoir " + M("e^{-" + nb(k) + "t}") + " ? (fraction)", 1 / r, M("\\frac{" + (Tc - Ta) + "}{" + (T0 - Ta) + "}") + "."), GS("Durée (" + RND[0.1] + ") ?", t, M("t = \\frac{-\\ln(" + fT(1 / r) + ")}{" + nb(k) + "} \\approx " + dT(t, 1)) + " min.", 0.1)],
            traps: [TR(Math.log(T0 / Tc) / k, "Retire d'abord la température de la pièce (" + Ta + " °C)."), TR((T0 - Tc) / (k * (T0 - Ta)), "La décroissance est exponentielle : utilise ln."), TR(-t, "Une durée est positive : ln(" + (Tc - Ta) + "/" + (T0 - Ta) + ") < 0 et on divise par −" + dS(k) + ".")] }); },
      () => { const c = pk([["mots", "Une élève apprend du vocabulaire : après", "jours, elle connaît", "mots", 500, [0.1, 0.15, 0.2]], ["rumeur", "Dans un collège, après", "heures,", "élèves connaissent une rumeur", 800, [0.3, 0.25, 0.4]], ["ventes", "Un nouveau jeu se vend : après", "semaines,", "exemplaires ont été vendus", 2000, [0.2, 0.3, 0.15]]]),
          L = c[4], k = pk(c[5]);
        if (R.rand() < 0.5) { const t = Math.log(10) / k;
          return QR(c[1] + " " + M("t") + " " + c[2] + " " + M("N(t) = " + nb(L) + "\\left(1 - e^{-" + nb(k) + "t}\\right)") + " " + c[3] + ". Quand atteint-on " + M("90\\,\\%") + " du maximum " + M(nb(L)) + " (" + RND[0.1] + ") ?", t, 0.1,
            M(nb(L) + "\\left(1 - e^{-" + nb(k) + "t}\\right) = " + nb(0.9 * L) + " \\iff e^{-" + nb(k) + "t} = 0{,}1 \\iff t = \\frac{\\ln 10}{" + nb(k) + "} \\approx " + dT(t, 1)) + ".",
            { ctx: "limitee-" + c[0], guide: [GS("Que doit valoir " + M("e^{-" + nb(k) + "t}") + " ?", 0.1, M("0{,}1") + "."), GS(M("t") + " (" + RND[0.1] + ") ?", t, M("\\approx " + dT(t, 1)) + ".", 0.1)],
              traps: [TR(-Math.log(0.9) / k, "Il faut e^(−kt) = 0,1 (il reste 10 % à atteindre), pas 0,9."), TR(0.9 / k, "Utilise ln : t = ln(10) ÷ " + dS(k) + "."), TR(Math.log(10) * k, "On divise par k.")] }); }
        const t = pk([5, 10]), v = L * (1 - Math.exp(-k * t));
        return QR(c[1] + " " + M("t") + " " + c[2] + " " + M("N(t) = " + nb(L) + "\\left(1 - e^{-" + nb(k) + "t}\\right)") + " " + c[3] + ". Que vaut " + M("N(" + t + ")") + " (" + RND[1] + ") ?", v, 1,
          M("N(" + t + ") = " + nb(L) + "\\left(1 - e^{-" + nb(r6(k * t)) + "}\\right) \\approx " + nb(Math.round(v))) + ".",
          { ctx: "limitee-valeur-" + c[0], guide: [GS(M("e^{-" + nb(r6(k * t)) + "}") + " (" + RND[0.0001] + ") ?", Math.exp(-k * t), M("\\approx " + dT(Math.exp(-k * t), 4)) + ".", 0.0001), GS(M("N(" + t + ")") + " (" + RND[1] + ") ?", v, M("\\approx " + nb(Math.round(v))) + ".", 1)],
            traps: [TR(L * Math.exp(-k * t), "C'est la part qui manque : N = L(1 − e^(−kt))."), TR(L * (1 - Math.exp(k * t)), "L'exposant est négatif : −" + dS(k) + "t."), TR(L * k * t, "Le modèle n'est pas linéaire.")] }); },
      () => { const p = pk([2, 3, 4, 5, 6, 8]);
        if (R.rand() < 0.5) { const k = Math.log(1 + p / 100);
          return QR("Une population augmente de " + M(p + "\\,\\%") + " par an. Écris ce modèle sous la forme " + M("N(t) = N_0\\,e^{kt}") + " : que vaut " + M("k") + " (" + RND[0.0001] + ") ?", k, 0.0001,
            M("N_0 \\cdot " + nb(1 + p / 100) + "^{t} = N_0\\,e^{kt} \\iff e^{k} = " + nb(1 + p / 100) + " \\iff k = \\ln(" + nb(1 + p / 100) + ") \\approx " + dT(k, 4)) + ".",
            { ctx: "taux-continu", guide: [GS("Facteur annuel " + M("e^{k}") + " ?", 1 + p / 100, M(nb(1 + p / 100)) + "."), GS(M("k") + " (" + RND[0.0001] + ") ?", k, M("\\approx " + dT(k, 4)) + ".", 0.0001)],
              traps: [TR(p / 100, "Proche, mais k = ln(1 + " + dS(p / 100) + "), un peu plus petit."), TR(Math.log(p / 100), "Le facteur annuel est 1 + " + dS(p / 100) + "."), TR(Math.exp(p / 100) - 1, "e^k = " + dS(1 + p / 100) + " : on applique ln.")] }); }
        const T = Math.log(2) / Math.log(1 + p / 100);
        return QR("Un capital rapporte " + M(p + "\\,\\%") + " d'intérêts par an (composés). Au bout de combien d'années double-t-il (" + RND[0.1] + ") ?", T, 0.1,
          M(nb(1 + p / 100) + "^{T} = 2 \\iff T = \\frac{\\ln 2}{\\ln(" + nb(1 + p / 100) + ")} \\approx " + dT(T, 1)) + " ans.",
          { ctx: "doublement-annuel", guide: [GS(M("\\ln(" + nb(1 + p / 100) + ")") + " (" + RND[0.0001] + ") ?", Math.log(1 + p / 100), M("\\approx " + dT(Math.log(1 + p / 100), 4)) + ".", 0.0001), GS(M("T") + " (" + RND[0.1] + ") ?", T, M("\\approx " + dT(T, 1)) + " ans.", 0.1)],
            traps: [TR(100 / p, "Les intérêts sont composés : ce n'est pas 100 ÷ " + p + "."), TR(72 / p, "C'est la règle approchée « 72 ÷ taux » : calcule ln 2 ÷ ln(" + dS(1 + p / 100) + ")."), TR(2 / Math.log(1 + p / 100), "On résout (1 + taux)^T = 2 : T = ln 2 ÷ ln(1 + taux).")] }); },
    ],
  };

  // ======================= condbayes : probabilités conditionnelles, Bayes (4.PS.02a–d) =======================
  const CB = {
    1: [
      () => { const c = pk([
          ["sport", ["\\text{Sport}", "\\text{Pas de sport}"], ["\\text{1re}", "\\text{2e}"], "un élève de 2e", "qu'il fasse du sport", "un élève qui fait du sport", "qu'il soit en 1re"],
          ["lunettes", ["\\text{Lunettes}", "\\text{Sans}"], ["\\text{Filles}", "\\text{Garçons}"], "un garçon", "qu'il porte des lunettes", "une personne à lunettes", "que ce soit une fille"],
          ["transport", ["\\text{Bus}", "\\text{Vélo}"], ["\\text{Matin}", "\\text{Soir}"], "un trajet du soir", "qu'il se fasse en bus", "un trajet en bus", "qu'il ait lieu le matin"]]);
        const a = R.int(8, 30), b = R.int(8, 30), cc = R.int(8, 30), d = R.int(8, 30), N = a + b + cc + d, ask = pk(["ligne", "colonne"]);
        const tab = M("\\begin{array}{l|c|c} & " + c[1][0] + " & " + c[1][1] + " \\\\ \\hline " + c[2][0] + " & " + a + " & " + b + " \\\\ " + c[2][1] + " & " + cc + " & " + d + " \\end{array}");
        if (ask === "ligne") { const v = cc / (cc + d);
          return QN("Résultats d'un sondage :<br>" + tab + "<br>On choisit au hasard " + c[3] + ". Quelle est la probabilité " + c[4] + " ?", v, "On se place dans la ligne " + M(c[2][1]) + " (" + M(cc + d) + " cas) : " + M("\\frac{" + cc + "}{" + (cc + d) + "}" + (den(v) < cc + d ? " = " + fT(v) : "")) + ".",
            { ctx: "tableau-" + c[0], guide: [GS("Nombre de cas dans la ligne " + M(c[2][1]) + " ?", cc + d, M(cc + d) + "."), GS("Probabilité ?", v, M(fT(v)) + ".")], traps: [TR(cc / N, "On sait déjà dans quelle ligne on est : on divise par le total de la ligne, pas par " + N + "."), TR(cc / (a + cc), "On se place dans la ligne, pas dans la colonne."), TR(d / (cc + d), "Vérifie la colonne : tu as compté l'autre cas.")] }); }
        const v = a / (a + cc);
        return QN("Résultats d'un sondage :<br>" + tab + "<br>On choisit au hasard " + c[5] + ". Quelle est la probabilité " + c[6] + " ?", v, "On se place dans la colonne " + M(c[1][0]) + " (" + M(a + cc) + " cas) : " + M("\\frac{" + a + "}{" + (a + cc) + "}" + (den(v) < a + cc ? " = " + fT(v) : "")) + ".",
          { ctx: "tableau-colonne-" + c[0], guide: [GS("Nombre de cas dans la colonne " + M(c[1][0]) + " ?", a + cc, M(a + cc) + "."), GS("Probabilité ?", v, M(fT(v)) + ".")], traps: [TR(a / N, "On sait déjà dans quelle colonne on est : on divise par son total, pas par " + N + "."), TR(a / (a + b), "On se place dans la colonne, pas dans la ligne.")] }); },
      () => { const p = pk([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), q1 = pk([0.1, 0.2, 0.3, 0.4, 0.5, 0.25, 0.15]), q2 = pk([0.05, 0.1, 0.6, 0.7, 0.35]), cpl = R.rand() < 0.5, c = pk([["Un élève vient en bus (événement B) ou à pied", "B", "arrive en retard (R)", "R", "Il"], ["Une graine est de la variété A ou d'une autre variété", "A", "germe (G)", "G", "Elle"], ["Un client paie par carte (C) ou en espèces", "C", "achète un dessert (D)", "D", "Il"]]);
        const v = cpl ? r6((1 - p) * q2) : r6(p * q1), L = c[1], E = c[3];
        if (q1 === q2) return null;
        return QN(c[0] + " : " + M("P(" + L + ") = " + dT(p)) + ". " + c[4] + " " + c[2] + " avec " + M("P_{" + L + "}(" + E + ") = " + dT(q1)) + " et " + M("P_{\\overline{" + L + "}}(" + E + ") = " + dT(q2)) + ". Calcule " + M(cpl ? "P(\\overline{" + L + "} \\cap " + E + ")" : "P(" + L + " \\cap " + E + ")") + ".", v,
          "On multiplie le long du chemin : " + M(cpl ? dT(1 - p) + " \\cdot " + dT(q2) + " = " + dT(v) : dT(p) + " \\cdot " + dT(q1) + " = " + dT(v)) + ".",
          { ctx: cpl ? "arbre-contraire" : "arbre-produit", guide: cpl ? [GS(M("P(\\overline{" + L + "})") + " ?", 1 - p, M(dT(1 - p)) + "."), GS("Produit le long du chemin ?", v, M(dT(v)) + ".")] : [GS("Produit le long du chemin " + M(L + " \\to " + E) + " ?", v, M(dT(v)) + ".")],
            traps: [TR(cpl ? q2 : q1, "C'est la probabilité conditionnelle ; pour l'intersection, multiplie par la probabilité de la première branche."), TR(cpl ? r6(1 - p + q2) : r6(p + q1), "Le long d'un chemin, on multiplie."), TR(cpl ? r6(p * q2) : r6((1 - p) * q1), "Vérifie la première branche du chemin.")] }); },
      () => { const a = pk([0.2, 0.3, 0.4, 0.5, 0.6]), b = pk([0.1, 0.3, 0.5, 0.7, 0.8]), t = pk(["inter", "union", "aucun"]), v = t === "inter" ? r6(a * b) : t === "union" ? r6(a + b - a * b) : r6((1 - a) * (1 - b));
        const ask = t === "inter" ? "P(A \\cap B)" : t === "union" ? "P(A \\cup B)" : "P(\\overline{A} \\cap \\overline{B})";
        return QN("Les événements " + M("A") + " et " + M("B") + " sont indépendants, avec " + M("P(A) = " + dT(a)) + " et " + M("P(B) = " + dT(b)) + ". Calcule " + M(ask) + ".", v,
          t === "inter" ? "Indépendants : " + M("P(A \\cap B) = " + dT(a) + " \\cdot " + dT(b) + " = " + dT(v)) + "." : t === "union" ? M("P(A \\cup B) = " + dT(a) + " + " + dT(b) + " - " + dT(r6(a * b)) + " = " + dT(v)) + "." : M("\\overline{A}") + " et " + M("\\overline{B}") + " sont aussi indépendants : " + M(dT(1 - a) + " \\cdot " + dT(1 - b) + " = " + dT(v)) + ".",
          { ctx: "independance-" + t, guide: t === "inter" ? [GS("Produit ?", v, M(dT(v)) + ".")] : t === "union" ? [GS(M("P(A \\cap B)") + " ?", a * b, M(dT(r6(a * b))) + "."), GS(M("P(A \\cup B)") + " ?", v, M(dT(v)) + ".")] : [GS(M("P(\\overline{A}) \\cdot P(\\overline{B})") + " ?", v, M(dT(v)) + ".")],
            traps: [TR(r6(a + b), t === "union" ? "Il faut retirer P(A ∩ B), comptée deux fois." : "Pour une intersection d'événements indépendants, on multiplie."), TR(r6(1 - a * b), "Ce n'est pas le contraire de A ∩ B."), TR(r6(a * b), "C'est P(A ∩ B).")] }); },
    ],
    2: [
      () => { const p = pk([0.3, 0.4, 0.6, 0.7]), q1 = pk([0.1, 0.2, 0.15, 0.05]), q2 = pk([0.3, 0.25, 0.4, 0.35]), v = r6(p * q1 + (1 - p) * q2), c = pk([["En hiver, un élève vient à vélo", "il vient à pied", "il arrive en retard", "qu'il arrive en retard", "retard"], ["Un appareil est fabriqué dans l'usine U", "il est fabriqué dans l'usine V", "il est défectueux", "qu'il soit défectueux", "defaut"], ["Une joueuse de tennis réussit son premier service", "elle joue un second service", "elle perd le point", "qu'elle perde le point", "tennis"]]);
        return QN(c[0] + " avec la probabilité " + M(dT(p)) + " ; sinon, " + c[1] + ". Dans le premier cas, " + c[2] + " avec la probabilité " + M(dT(q1)) + " ; dans le second, avec la probabilité " + M(dT(q2)) + ". Quelle est la probabilité " + c[3] + " ?", v,
          "Probabilités totales : " + M(dT(p) + " \\cdot " + dT(q1) + " + " + dT(1 - p) + " \\cdot " + dT(q2) + " = " + dT(v)) + ".",
          { ctx: "probas-totales-" + c[4], guide: [GS("Premier chemin " + M(dT(p) + " \\cdot " + dT(q1)) + " ?", p * q1, M(dT(r6(p * q1))) + "."), GS("Second chemin " + M(dT(1 - p) + " \\cdot " + dT(q2)) + " ?", (1 - p) * q2, M(dT(r6((1 - p) * q2))) + "."), GS("Somme ?", v, M(dT(v)) + ".")],
            traps: [TR(r6((q1 + q2) / 2), "Pondère par les probabilités des deux cas (" + dS(p) + " et " + dS(1 - p) + ")."), TR(r6(p * q1), "Il manque le second chemin."), TR(r6(q1 + q2), "Chaque probabilité conditionnelle est multipliée par la probabilité de son cas.")] }); },
      () => { const pa = pk([0.4, 0.5, 0.25, 0.8, 0.2]), q = pk([0.3, 0.6, 0.75, 0.2, 0.4]), inter = r6(pa * q), pb = r6(inter + pk([0.1, 0.15, 0.2])), sw = R.rand() < 0.5;
        if (pb >= 1) return null;
        if (!sw) return QN("On sait que " + M("P(A) = " + dT(pa)) + " et " + M("P(A \\cap B) = " + dT(inter)) + ". Calcule " + M("P_A(B)") + ".", q, M("P_A(B) = \\frac{P(A \\cap B)}{P(A)} = \\frac{" + dT(inter) + "}{" + dT(pa) + "} = " + dT(q)) + ".",
          { ctx: "definition", guide: [GS(M("\\frac{P(A \\cap B)}{P(A)}") + " ?", q, M(dT(q)) + ".")], traps: [TR(r6(inter * pa), "On divise par P(A), on ne multiplie pas."), TR(r6(pa / inter), "C'est l'inverse : P(A ∩ B) ÷ P(A)."), TR(inter, "C'est P(A ∩ B) ; on demande la probabilité de B sachant A.")] });
        const v = inter / pb;
        return QR("On sait que " + M("P(B) = " + dT(pb)) + " et " + M("P(A \\cap B) = " + dT(inter)) + ". Calcule " + M("P_B(A)") + " (" + RND[0.001] + ").", v, 0.001, M("P_B(A) = \\frac{" + dT(inter) + "}{" + dT(pb) + "} \\approx " + dT(v, 3)) + ".",
          { ctx: "definition-b", guide: [GS(M("\\frac{P(A \\cap B)}{P(B)}") + " (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)], traps: [TR(inter / pa, "Sachant B : on divise par P(B)."), TR(inter * pb, "On divise par P(B)."), TR(inter, "C'est P(A ∩ B).")] }); },
      () => { const r = R.int(3, 6), b = R.int(2, 5), n = r + b, t = pk(["deux", "second", "mixte"]), it = pk([["boules", "rouges", "bleues", "rouge"], ["billes", "vertes", "jaunes", "verte"], ["jetons", "noirs", "blancs", "noir"]]);
        const base = "Une boîte contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux successivement, sans remise. ";
        if (t === "deux") { const v = (r * (r - 1)) / (n * (n - 1));
          return QN(base + "Quelle est la probabilité que les deux soient " + it[1] + " ?", v, M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fT(v)) + ".",
            { ctx: "urne-deux", guide: [GS("Probabilité au premier tirage ?", r / n, M(fT(r / n)) + "."), GS("Au second, sachant que le premier tirage a donné " + it[3] + " ?", (r - 1) / (n - 1), M(fT((r - 1) / (n - 1))) + "."), GS("Produit ?", v, M(fT(v)) + ".")], traps: [TR((r / n) ** 2, "Sans remise : au second tirage, il en reste " + (r - 1) + " sur " + (n - 1) + "."), TR((r - 1) / (n - 1), "C'est la probabilité conditionnelle du second tirage seul.")] }); }
        if (t === "second") { const v = (r - 1) / (n - 1);
          return QN(base + "Le premier tirage donne " + it[3] + ". Quelle est la probabilité que le second aussi ?", v, "Il en reste " + M(r - 1) + " sur " + M(n - 1) + " : " + M(fT(v)) + ".",
            { ctx: "urne-second", guide: [GS("Nombre de " + it[0] + " restant dans la boîte ?", n - 1, M(n - 1) + "."), GS("Probabilité ?", v, M(fT(v)) + ".")], traps: [TR(r / n, "Sans remise : la boîte a changé."), TR((r * (r - 1)) / (n * (n - 1)), "On sait déjà ce qu'a donné le premier tirage : c'est une probabilité conditionnelle.")] }); }
        const v = (2 * r * b) / (n * (n - 1));
        return QN(base + "Quelle est la probabilité d'obtenir deux couleurs différentes ?", v, "Deux chemins : " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + (n - 1) + "} = " + fT(v)) + ".",
          { ctx: "urne-mixte", guide: [GS("Premier chemin (" + it[1] + " puis " + it[2] + ") ?", (r * b) / (n * (n - 1)), M(fT((r * b) / (n * (n - 1)))) + "."), GS("Total (deux chemins) ?", v, M(fT(v)) + ".")], traps: [TR((r * b) / (n * (n - 1)), "Il y a deux ordres possibles : on additionne les deux chemins."), TR((2 * r * b) / (n * n), "Sans remise : au second tirage, il en reste " + (n - 1) + ".")] }); },
    ],
    3: [
      () => { const p = pk([0.01, 0.02, 0.05, 0.1]), se = pk([0.9, 0.95, 0.99]), sp = pk([0.9, 0.95, 0.98]), a = r6(p * se), b = r6((1 - p) * (1 - sp)), v = a / (a + b), mal = pk(["une maladie", "une allergie", "un virus"]);
        return QR("Dans une population, " + M(dT(p * 100) + "\\,\\%") + " des personnes ont " + mal + ". Un test est positif chez " + M(dT(se * 100) + "\\,\\%") + " des malades et négatif chez " + M(dT(sp * 100) + "\\,\\%") + " des personnes saines. Une personne a un test positif : quelle est la probabilité qu'elle soit malade (" + RND[0.001] + ") ?", v, 0.001,
          "Bayes : " + M("P_{+}(M) = \\frac{" + dT(p) + " \\cdot " + dT(se) + "}{" + dT(p) + " \\cdot " + dT(se) + " + " + dT(1 - p) + " \\cdot " + dT(r6(1 - sp)) + "} = \\frac{" + dT(a, 6) + "}{" + dT(r6(a + b), 6) + "} \\approx " + dT(v, 3)) + ". Peu de malades : beaucoup de « faux positifs ».",
          { ctx: "test-" + mal.split(" ")[1], guide: [GS(M("P(M \\cap +)") + " ?", a, M(dT(a, 6)) + "."), GS(M("P(\\overline{M} \\cap +)") + " (faux positifs) ?", b, M(dT(b, 6)) + "."), GS(M("P(+)") + " ?", a + b, M(dT(r6(a + b), 6)) + "."), GS(M("P_{+}(M)") + " (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)],
            traps: [TR(se, "C'est P₊ sachant M (le test chez les malades) ; on cherche M sachant +."), TR(a, "C'est P(M ∩ +) ; divise par P(+)."), TR(p, "C'est la probabilité d'être malade avant le test.")] }); },
      () => { const a = pk([0.6, 0.7, 0.4, 0.55]), dA = pk([0.02, 0.03, 0.05]), dB = pk([0.01, 0.04, 0.06]), pa = r6(a * dA), pb = r6((1 - a) * dB), v = pa / (pa + pb), it = pk(["ampoules", "téléphones", "pièces"]);
        return QR("Une usine produit des " + it + " sur deux machines : " + M("A") + " en fait " + M(dT(a * 100) + "\\,\\%") + ", avec " + M(dT(dA * 100) + "\\,\\%") + " de défauts ; " + M("B") + " le reste, avec " + M(dT(dB * 100) + "\\,\\%") + " de défauts. Une pièce est défectueuse : quelle est la probabilité qu'elle vienne de " + M("A") + " (" + RND[0.001] + ") ?", v, 0.001,
          M("P_D(A) = \\frac{" + dT(a) + " \\cdot " + dT(dA) + "}{" + dT(a) + " \\cdot " + dT(dA) + " + " + dT(r6(1 - a)) + " \\cdot " + dT(dB) + "} = \\frac{" + dT(pa, 6) + "}{" + dT(r6(pa + pb), 6) + "} \\approx " + dT(v, 3)) + ".",
          { ctx: "machines-" + it, guide: [GS(M("P(A \\cap D)") + " ?", pa, M(dT(pa, 6)) + "."), GS(M("P(B \\cap D)") + " ?", pb, M(dT(pb, 6)) + "."), GS(M("P_D(A)") + " (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)],
            traps: [TR(a, "C'est P(A) avant de savoir que la pièce est défectueuse."), TR(dA, "C'est P_A(D) : on cherche P_D(A)."), TR(pa, "C'est P(A ∩ D) : divise par P(D).")] }); },
      () => { const a = pk([0.2, 0.3, 0.4, 0.5, 0.6]), b = pk([0.2, 0.25, 0.4, 0.5, 0.7]), u = r6(a + b - a * b);
        return QN("Les événements " + M("A") + " et " + M("B") + " sont indépendants, avec " + M("P(A) = " + dT(a)) + " et " + M("P(A \\cup B) = " + dT(u)) + ". Calcule " + M("P(B)") + ".", b,
          M(dT(u) + " = " + dT(a) + " + P(B) - " + dT(a) + "P(B) = " + dT(a) + " + " + dT(r6(1 - a)) + "P(B)") + ", donc " + M("P(B) = \\frac{" + dT(r6(u - a)) + "}{" + dT(r6(1 - a)) + "} = " + dT(b)) + ".",
          { ctx: "independance-inconnue", guide: [GS("Avec " + M("P(A \\cup B) = P(A) + P(B) - P(A)P(B)") + " : que vaut " + M("(1 - " + dT(a) + ")P(B)") + " ?", u - a, M(dT(r6(u - a))) + "."), GS(M("P(B)") + " ?", b, M(dT(b)) + ".")],
            traps: [TR(r6(u - a), "Indépendants : P(A ∩ B) = P(A)·P(B) n'est pas nul ; divise par 1 − " + dS(a) + "."), TR(r6(u / a), "Utilise P(A ∪ B) = P(A) + P(B) − P(A)·P(B)."), TR(r6((u - a) / a), "On divise par 1 − P(A).")] }); },
    ],
  };

  // ======================= varalea : variable aléatoire discrète (4.PS.03a, 4.PS.03b) =======================
  const tenths = (n) => { for (;;) { const c = Array.from({ length: n - 1 }, () => R.int(1, 4)), s = c.reduce((x, y) => x + y, 0); if (s <= 9) return [...c, 10 - s].map((x) => x / 10); } };
  const EX = (xs, ps) => r6(xs.reduce((s, x, i) => s + x * ps[i], 0));
  const EX2 = (xs, ps) => r6(xs.reduce((s, x, i) => s + x * x * ps[i], 0));
  const VA = {
    1: [
      () => { const xs = [nz(-4, -1), R.int(0, 2), R.int(3, 5), R.int(6, 9)], ps = (() => { for (;;) { const c = [1, 2, 3].map(() => pk([0.05, 0.1, 0.15, 0.2, 0.25, 0.3])), s = r6(c[0] + c[1] + c[2]); if (s < 0.9) return [...c, r6(1 - s)]; } })(), i = R.int(0, 3), shown = ps.map((p, j) => (j === i ? "p" : p)), known = r6(1 - ps[i]);
        return QN("Voici la loi de probabilité de " + M("X") + " :<br>" + lawT(xs, shown) + "<br>Que vaut " + M("p") + " ?", ps[i], "La somme des probabilités vaut 1 : " + M("p = 1 - " + dT(known) + " = " + dT(ps[i])) + ".",
          { ctx: "loi-manquante", guide: [GS("Somme des probabilités connues ?", known, M(dT(known)) + "."), GS(M("p") + " ?", ps[i], M(dT(ps[i])) + ".")], traps: [TR(known, "C'est la somme des autres ; p = 1 − " + dS(known) + "."), TR(r6(1 - known) * 2, "La somme de toutes les probabilités vaut 1."), TR(0.25, "Les valeurs ne sont pas équiprobables : utilise que la somme des probabilités vaut 1.")] }); },
      () => { const xs = [nz(-5, -1), R.int(1, 3), R.int(4, 8)], ps = tenths(3), E = EX(xs, ps);
        return QN("Voici la loi de probabilité de " + M("X") + " :<br>" + lawT(xs, ps) + "<br>Calcule l'espérance " + M("E(X)") + ".", E, M("E(X) = " + xs.map((x, i) => par(x) + " \\cdot " + dT(ps[i])).join(" + ") + " = " + dT(E)) + ".",
          { ctx: "esperance", guide: [GS("Premier produit " + M(par(xs[0]) + " \\cdot " + dT(ps[0])) + " ?", xs[0] * ps[0], M(dT(r6(xs[0] * ps[0]))) + "."), GS(M("E(X)") + " (somme des " + M("x_i \\cdot p_i") + ") ?", E, M(dT(E)) + ".")],
            traps: [TR(r6((xs[0] + xs[1] + xs[2]) / 3), "Chaque valeur compte selon sa probabilité : E = Σ xᵢ·pᵢ."), TR(r6(E - 2 * xs[0] * ps[0]), "Le premier produit est négatif : " + dS(r6(xs[0] * ps[0])) + "."), TR(EX2(xs, ps), "C'est E(X²) : on ne met pas les valeurs au carré.")] }); },
      () => { const a = pk([6, 9, 12, 15]), b = pk([2, 3, 4]), c = pk([1, 2, 3]), E = (a + 2 * b - 3 * c) / 6;
        if (Math.abs(E) < 1e-9) return null;
        return QN("On lance un dé équilibré. Avec un 6, on gagne " + M(a + tu("CHF")) + " ; avec un 4 ou un 5, on gagne " + M(b + tu("CHF")) + " ; sinon, on perd " + M(c + tu("CHF")) + ". Quelle est l'espérance du gain " + M("G") + " (en CHF) ?", E,
          M("E(G) = " + a + " \\cdot \\frac{1}{6} + " + b + " \\cdot \\frac{2}{6} - " + c + " \\cdot \\frac{3}{6} = \\frac{" + (a + 2 * b - 3 * c) + "}{6} = " + fT(E)) + " CHF.",
          { ctx: "jeu-de", guide: [GS(M("P(G = " + b + ")") + " (un 4 ou un 5) ?", 1 / 3, M("\\frac{2}{6} = \\frac{1}{3}") + "."), GS(M("P(G = -" + c + ")") + " ?", 0.5, M("\\frac{3}{6} = \\frac{1}{2}") + "."), GS(M("E(G)") + " ?", E, M(fT(E)) + " CHF.")],
            traps: [TR((a + b - c) / 3, "Les trois gains n'ont pas la même probabilité."), TR((a + 2 * b + 3 * c) / 6, "Une perte compte négativement : −" + c + "."), TR(a + 2 * b - 3 * c, "Chaque face a la probabilité 1/6 : divise par 6.")] }); },
    ],
    2: [
      () => { const xs = [R.int(0, 1), R.int(2, 3), R.int(4, 6)], ps = tenths(3), E = EX(xs, ps), E2 = EX2(xs, ps), V = r6(E2 - E * E);
        return QN("Voici la loi de probabilité de " + M("X") + " :<br>" + lawT(xs, ps) + "<br>Calcule la variance " + M("V(X)") + ".", V, M("E(X) = " + dT(E)) + ", " + M("E(X^2) = " + dT(E2)) + ", " + M("V(X) = E(X^2) - E(X)^2 = " + dT(E2) + " - " + dT(r6(E * E)) + " = " + dT(V)) + ".",
          { ctx: "variance", guide: [GS(M("E(X)") + " ?", E, M(dT(E)) + "."), GS(M("E(X^2) = \\sum x_i^2 p_i") + " ?", E2, M(dT(E2)) + "."), GS(M("V(X) = E(X^2) - E(X)^2") + " ?", V, M(dT(V)) + ".")],
            traps: [TR(E2, "C'est E(X²) : retire encore E(X)²."), TR(r6(E2 - E), "On retire le carré de l'espérance : E(X)² = " + dS(r6(E * E)) + "."), TR(r6(Math.sqrt(V)), "C'est l'écart-type ; on demande la variance.")] }); },
      () => { const g = pk([10, 20, 50]), q = pk([0.1, 0.2, 0.25, 0.4]), m = pk([2, 5]), xs = [-m, g - m], ps = [r6(1 - q), q], E = EX(xs, ps), V = r6(EX2(xs, ps) - E * E), s = Math.sqrt(V);
        return QR("Un ticket coûte " + M(m + tu("CHF")) + " ; il fait gagner " + M(g + tu("CHF")) + " avec la probabilité " + M(dT(q)) + " (rien sinon). Le gain net " + M("X") + " vaut donc " + M(g - m) + " ou " + M(-m) + ". Calcule l'écart-type " + M("\\sigma(X)") + " (" + RND[0.01] + ").", s, 0.01,
          M("E(X) = " + dT(E)) + ", " + M("V(X) = " + dT(V)) + ", " + M("\\sigma(X) = \\sqrt{" + dT(V) + "} \\approx " + dT(s, 2)) + " CHF.",
          { ctx: "ecart-type-ticket", guide: [GS(M("E(X)") + " ?", E, M(dT(E)) + "."), GS(M("V(X)") + " ?", V, M(dT(V)) + "."), GS(M("\\sigma(X)") + " (" + RND[0.01] + ") ?", s, M("\\approx " + dT(s, 2)) + ".", 0.01)],
            traps: [TR(V, "C'est la variance : l'écart-type est sa racine."), TR(Math.sqrt(EX2(xs, ps)), "σ = √(E(X²) − E(X)²)."), TR(Math.abs(E), "C'est l'espérance (en valeur absolue).")] }); },
      () => { const N = pk([100, 200, 500]), A = pk([100, 200, 300]), k = pk([5, 10, 20]), B = pk([5, 10]), tot = A + k * B, m = tot / N;
        return QN("Une tombola vend " + M(N) + " billets. Il y a un gros lot de " + M(A + tu("CHF")) + " et " + M(k) + " lots de " + M(B + tu("CHF")) + ". Quel prix " + M("m") + " (en CHF) faut-il demander par billet pour que le jeu soit équitable (espérance du gain net nulle) ?", m,
          "Espérance du lot : " + M("\\frac{" + A + " + " + k + " \\cdot " + B + "}{" + N + "} = " + fT(m)) + " CHF. Équitable si le prix vaut cette espérance : " + M("m = " + fT(m)) + " CHF.",
          { ctx: "jeu-equitable", guide: [GS("Total des lots (CHF) ?", tot, M(tot) + "."), GS("Espérance du lot pour un billet ?", m, M(fT(m)) + " CHF.")], traps: [TR((A + B) / 2, "Chaque billet a une chance sur " + N + " : divise le total des lots par " + N + "."), TR((A + B) / N, "Il y a " + k + " lots de " + B + " CHF."), TR(tot, "C'est le total des lots, à répartir sur " + N + " billets.")] }); },
    ],
    3: [
      () => { const r = R.int(2, 5), b = R.int(2, 5), n = r + b, D = n * (n - 1), p2 = (r * (r - 1)) / D, p1 = (2 * r * b) / D, E = p1 + 2 * p2;
        return QN("Une urne contient " + r + " boules rouges et " + b + " bleues. On en tire deux sans remise ; " + M("X") + " est le nombre de boules rouges tirées. Calcule " + M("E(X)") + ".", E,
          M("P(X = 2) = " + fT(p2)) + ", " + M("P(X = 1) = " + fT(p1)) + ", " + M("E(X) = 1 \\cdot " + fT(p1) + " + 2 \\cdot " + fT(p2) + " = " + fT(E)) + ".",
          { ctx: "urne-esperance", guide: [GS(M("P(X = 2)") + " ?", p2, M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fT(p2)) + "."), GS(M("P(X = 1)") + " (deux ordres) ?", p1, M(fT(p1)) + "."), GS(M("E(X)") + " ?", E, M(fT(E)) + ".")],
            traps: [TR(p1 + p2, "E(X) = 1·P(X = 1) + 2·P(X = 2) : la valeur 2 compte double."), TR(r / n, "C'est la probabilité d'une rouge au premier tirage."), TR(p1 / 2 + 2 * p2, "P(X = 1) compte les deux ordres : rouge-bleue et bleue-rouge.")] }); },
      () => { const m = nz(-4, 6), v = pk([4, 9, 2, 3, 16]), a = pk([2, 3, -2, -3]), b = nz(-5, 5), t = pk(["E", "V", "s"]);
        if (t === "s" && ![4, 9, 16].includes(v)) return null;
        const val = t === "E" ? a * m + b : t === "V" ? a * a * v : Math.abs(a) * Math.sqrt(v), lab = t === "E" ? "E(Y)" : t === "V" ? "V(Y)" : "\\sigma(Y)";
        return QN("On sait que " + M("E(X) = " + m) + " et " + M("V(X) = " + v) + ". Soit " + M("Y = " + a + "X" + sg(b)) + ". Calcule " + M(lab) + ".", val,
          t === "E" ? M("E(Y) = " + a + "E(X)" + sg(b) + " = " + val) + "." : t === "V" ? M("V(Y) = " + par(a) + "^2 V(X) = " + a * a + " \\cdot " + v + " = " + val) + " (la constante " + M(b) + " ne change pas la dispersion)." : M("\\sigma(Y) = |" + a + "| \\cdot \\sqrt{" + v + "} = " + val) + ".",
          { ctx: "transformation-" + t, guide: t === "E" ? [GS(M(a + "E(X)") + " ?", a * m, M(a * m) + "."), GS(M("E(Y)") + " ?", val, M(val) + ".")] : t === "V" ? [GS(M(par(a) + "^2") + " ?", a * a, M(a * a) + "."), GS(M("V(Y)") + " ?", val, M(val) + ".")] : [GS(M("\\sigma(X)") + " ?", Math.sqrt(v), M(Math.sqrt(v)) + "."), GS(M("\\sigma(Y)") + " ?", val, M(val) + ".")],
            traps: t === "E" ? [TR(a * m, b < 0 ? "N'oublie pas de retirer " + -b + "." : "N'oublie pas d'ajouter " + b + "."), TR(m + b, "E(aX + b) = a·E(X) + b."), TR(a * (m + b), "E(aX + b) = a·E(X) + b : seul E(X) est multiplié par " + a + ".")] : t === "V" ? [TR(a * v, "La variance est multipliée par a² = " + a * a + "."), TR(a * a * v + b, "Ajouter une constante ne change pas la variance."), TR(a * a * v + b * b, "La constante b ne compte pas dans la variance.")] : [TR(a * Math.sqrt(v), "L'écart-type est positif : |a|·σ."), TR(a * a * Math.sqrt(v), "σ(aX + b) = |a|·σ(X)."), TR(Math.abs(a) * Math.sqrt(v) + b, "Ajouter une constante ne change pas l'écart-type.")] }); },
      () => { const ps = tenths(3), x1 = nz(-3, 1), x2 = R.int(2, 4), x = R.int(5, 12), E = EX([x1, x2, x], ps), part = r6(x1 * ps[0] + x2 * ps[1]);
        return QN("La variable " + M("X") + " prend les valeurs " + M(x1) + ", " + M(x2) + " et " + M("a") + " :<br>" + lawT([x1, x2, "a"], ps) + "<br>Sachant que " + M("E(X) = " + dT(E)) + ", que vaut " + M("a") + " ?", x,
          M(dT(part) + " + " + dT(ps[2]) + "a = " + dT(E)) + " donne " + M("a = \\frac{" + dT(r6(E - part)) + "}{" + dT(ps[2]) + "} = " + x) + ".",
          { ctx: "valeur-inconnue", guide: [GS("Contribution des deux valeurs connues " + M(par(x1) + " \\cdot " + dT(ps[0]) + " + " + x2 + " \\cdot " + dT(ps[1])) + " ?", part, M(dT(part)) + "."), GS("Que vaut " + M(dT(ps[2]) + "a") + " ?", E - part, M(dT(r6(E - part))) + "."), GS(M("a") + " ?", x, M(x) + ".")],
            traps: [TR(r6(E - part), "C'est " + dS(ps[2]) + "·a : divise par " + dS(ps[2]) + "."), TR(r6(E / ps[2]), "Retire d'abord la contribution des autres valeurs."), TR(r6((E + part) / ps[2]), "On soustrait la contribution des valeurs connues.")] }); },
    ],
  };

  // ======================= binomiale : loi binomiale (4.PS.03c, 4.PS.03d) =======================
  const bp = (n, p, k) => Cb(n, k) * p ** k * (1 - p) ** (n - k);
  const BN = {
    1: [
      () => { const n = pk([4, 5, 6]), p = pk([0.2, 0.3, 0.4, 0.6, 0.7]), k = R.int(1, n - 1), c = Cb(n, k), pp = p ** k * (1 - p) ** (n - k), v = c * pp, it = pk([["Un archer touche la cible", "tirs", "touche"], ["Une graine germe", "graines semées", "germe"], ["Un joueur marque un penalty", "tirs au but", "réussit"]]);
        return QR(it[0] + " avec la probabilité " + M(dT(p)) + ", indépendamment. Sur " + M(n) + " " + it[1] + ", quelle est la probabilité d'exactement " + M(k) + " succès (" + RND[0.001] + ") ?", v, 0.001,
          M("X \\sim B(" + n + " \\,;\\, " + dT(p) + ")") + " : " + M("P(X = " + k + ") = \\binom{" + n + "}{" + k + "} \\cdot " + dT(p) + "^{" + k + "} \\cdot " + dT(r6(1 - p)) + "^{" + (n - k) + "} \\approx " + dT(v, 3)) + ".",
          { ctx: "loi-" + it[2], guide: [GS("Nombre de chemins " + M("\\binom{" + n + "}{" + k + "}") + " ?", c, M(c) + "."), GS("Probabilité d'un chemin " + M(dT(p) + "^{" + k + "} \\cdot " + dT(r6(1 - p)) + "^{" + (n - k) + "}") + " (" + RND[0.0001] + ") ?", pp, M("\\approx " + dT(pp, 4)) + ".", 0.0001), GS(M("P(X = " + k + ")") + " (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)],
            traps: [TR(pp, "C'est la probabilité d'un seul chemin : il y en a " + c + "."), TR(c * (1 - p) ** k * p ** (n - k), "Puissance k pour la probabilité de succès " + dS(p) + "."), TR(c * p ** k, n - k === 1 ? "N'oublie pas l'échec : facteur " + dS(1 - p) + "." : "N'oublie pas les " + (n - k) + " échecs.")] }); },
      () => { const c = pk([["Une basketteuse réussit un lancer franc", 20, 0.7, "lancers", "lancers réussis"], ["En répondant au hasard à une question d'un QCM à 4 choix, on trouve la bonne réponse", 12, 0.25, "questions", "bonnes réponses"], ["Une graine germe", 40, 0.85, "graines semées", "graines qui germent"], ["Un vol est en retard", 50, 0.12, "vols", "vols en retard"]]), n = c[1], p = c[2], E = n * p;
        return QN(c[0] + " avec la probabilité " + M(dT(p)) + " (essais indépendants). Sur " + M(n) + " " + c[3] + ", combien de " + c[4] + " attend-on en moyenne (espérance) ?", E, M("X \\sim B(" + n + " \\,;\\, " + dT(p) + ")") + " : " + M("E(X) = np = " + n + " \\cdot " + dT(p) + " = " + dT(E)) + ".",
          { ctx: "esperance-" + c[3].split(" ")[0], guide: [GS("Nombre d'épreuves " + M("n") + " ?", n, M(n) + "."), GS(M("E(X) = np") + " ?", E, M(dT(E)) + ".")], traps: [TR(r6(n * (1 - p)), "np compte les succès ; n(1 − p) compte les échecs."), TR(r6(n * p * (1 - p)), "C'est la variance."), TR(r6(n / 2), "La probabilité de succès est " + dS(p) + ", pas 0,5.")] }); },
      () => { const t = pk(["de", "grele", "spam"]), [n, p, txt] = t === "de" ? [pk([3, 4, 5]), 1 / 6, "On lance un dé équilibré"] : t === "grele" ? [pk([5, 8, 10]), pk([0.1, 0.15, 0.2]), "Chaque jour d'été, il grêle avec une probabilité"] : [pk([10, 20]), pk([0.05, 0.08]), "Chaque message reçu est un pourriel avec une probabilité"], none = (1 - p) ** n, v = 1 - none;
        const q = t === "de" ? txt + " " + M(n) + " fois. Quelle est la probabilité d'obtenir au moins un 6 (" + RND[0.001] + ") ?" : txt + " " + M(dT(p)) + ", indépendamment. Sur " + M(n) + (t === "grele" ? " jours" : " messages") + ", quelle est la probabilité " + (t === "grele" ? "qu'il grêle au moins une fois" : "d'avoir au moins un pourriel") + " (" + RND[0.001] + ") ?";
        return QR(q, v, 0.001, M("P(X \\geq 1) = 1 - P(X = 0) = 1 - " + (t === "de" ? "\\left(\\frac{5}{6}\\right)" : dT(r6(1 - p))) + "^{" + n + "} \\approx " + dT(v, 3)) + ".",
          { ctx: "au-moins-un-" + t, guide: [GS(M("P(X = 0)") + ", aucun succès (" + RND[0.0001] + ") ?", none, M("\\approx " + dT(none, 4)) + ".", 0.0001), GS(M("P(X \\geq 1) = 1 - P(X = 0)") + " (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)],
            traps: [TR(n * p, "n·p est l'espérance, pas une probabilité : passe par le contraire « aucun »."), TR(1 - p ** n, "Le contraire de « au moins un » est « aucun » : (1 − p)ⁿ."), TR(none, "C'est P(X = 0) ; on demande le contraire.")] }); },
    ],
    2: [
      () => { const n = pk([5, 6, 8, 10]), p = pk([0.1, 0.2, 0.3]), p0 = (1 - p) ** n, p1 = n * p * (1 - p) ** (n - 1), le = p0 + p1, ge = R.rand() < 0.5, v = ge ? 1 - le : le;
        return QR("Une machine produit une pièce défectueuse avec la probabilité " + M(dT(p)) + ", indépendamment. On prélève " + M(n) + " pièces. Quelle est la probabilité " + (ge ? "d'au moins deux pièces défectueuses" : "d'au plus une pièce défectueuse") + " (" + RND[0.001] + ") ?", v, 0.001,
          M("P(X = 0) = " + dT(r6(1 - p)) + "^{" + n + "}") + ", " + M("P(X = 1) = " + n + " \\cdot " + dT(p) + " \\cdot " + dT(r6(1 - p)) + "^{" + (n - 1) + "}") + " ; " + M((ge ? "P(X \\geq 2) = 1 - P(X \\leq 1)" : "P(X \\leq 1)") + " \\approx " + dT(v, 3)) + ".",
          { ctx: ge ? "au-moins-deux" : "au-plus-un", guide: [GS(M("P(X = 0)") + " (" + RND[0.0001] + ") ?", p0, M("\\approx " + dT(p0, 4)) + ".", 0.0001), GS(M("P(X = 1)") + " (" + RND[0.0001] + ") ?", p1, M("\\approx " + dT(p1, 4)) + ".", 0.0001), GS("Réponse (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)],
            traps: ge ? [TR(1 - p0, "C'est P(X ≥ 1) : retire aussi P(X = 1)."), TR(le, "C'est P(X ≤ 1) ; on demande le contraire."), TR(1 - p0 - p * (1 - p) ** (n - 1), "P(X = 1) contient " + n + " chemins.")] : [TR(p0, "Au plus un : P(X = 0) + P(X = 1)."), TR(p0 + p * (1 - p) ** (n - 1), "P(X = 1) contient " + n + " chemins."), TR(1 - le, "C'est P(X ≥ 2).")] }); },
      () => { const n = pk([20, 25, 40, 50, 100]), p = pk([0.2, 0.4, 0.1, 0.3, 0.5]), V = r6(n * p * (1 - p)), s = Math.sqrt(V), askS = R.rand() < 0.6;
        if (askS) return QR("Soit " + M("X \\sim B(" + n + " \\,;\\, " + dT(p) + ")") + ". Calcule l'écart-type " + M("\\sigma(X)") + " (" + RND[0.01] + ").", s, 0.01, M("V(X) = np(1 - p) = " + n + " \\cdot " + dT(p) + " \\cdot " + dT(r6(1 - p)) + " = " + dT(V)) + ", " + M("\\sigma(X) = \\sqrt{" + dT(V) + "} \\approx " + dT(s, 2)) + ".",
          { ctx: "ecart-type", guide: [GS(M("V(X) = np(1 - p)") + " ?", V, M(dT(V)) + "."), GS(M("\\sigma(X)") + " (" + RND[0.01] + ") ?", s, M("\\approx " + dT(s, 2)) + ".", 0.01)], traps: [TR(V, "C'est la variance : prends la racine."), TR(Math.sqrt(n * p), "σ = √(np(1 − p))."), TR(n * p, "C'est l'espérance.")] });
        return QN("Soit " + M("X \\sim B(" + n + " \\,;\\, " + dT(p) + ")") + ". Calcule la variance " + M("V(X)") + ".", V, M("V(X) = np(1 - p) = " + n + " \\cdot " + dT(p) + " \\cdot " + dT(r6(1 - p)) + " = " + dT(V)) + ".",
          { ctx: "variance", guide: [GS(M("np") + " ?", n * p, M(dT(r6(n * p))) + "."), GS(M("V(X) = np(1 - p)") + " ?", V, M(dT(V)) + ".")], traps: [TR(r6(n * p), "C'est l'espérance ; multiplie encore par 1 − p."), TR(s, "C'est l'écart-type."), TR(r6(n * p * p), "V = np(1 − p), pas np².")] }); },
      () => { const n = R.int(5, 10), k = R.int(2, n - 2), c = Cb(n, k), ff = Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b, 1), kf = Array.from({ length: k }, (_, i) => i + 1).reduce((a, b) => a * b, 1), prodT = k <= 4 ? Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ") : n + " \\cdot " + (n - 1) + " \\cdots " + (n - k + 1), it = pk([["On lance une pièce", "fois", "pile"], ["Un élève répond à un vrai-faux de", "questions", "réponses justes"], ["On tire au but", "fois", "buts"]]);
        return QN(it[0] + " " + M(n) + " " + it[1] + ". Dans l'arbre des issues, combien de chemins comportent exactement " + M(k) + " " + it[2] + " ?", c, M("\\binom{" + n + "}{" + k + "} = \\frac{" + prodT + "}{" + k + "!} = \\frac{" + ff + "}{" + kf + "} = " + c) + ".",
          { ctx: "coefficient-" + it[2].split(" ")[0], guide: [GS("Produit " + M(prodT) + " (" + k + " facteurs) ?", ff, M(ff) + "."), GS("Divisé par " + M(k + "! = " + kf) + " ?", c, M(c) + ".")],
            traps: [TR(ff, "L'ordre des " + k + " succès ne compte pas : divise par " + k + "! = " + kf + "."), TR(2 ** n, "C'est le nombre total de chemins."), TR(n * k, "Utilise le coefficient binomial (n k).")] }); },
    ],
    3: [
      () => { const p = pk([0.1, 0.2, 0.05, 0.15]), c = pk([0.9, 0.95, 0.99]), q = Math.log(1 - c) / Math.log(1 - p), n = Math.ceil(q - 1e-9);
        return QN("Un tir réussit avec la probabilité " + M(dT(p)) + ". Combien de tirs faut-il au minimum pour que la probabilité d'au moins une réussite dépasse " + M(dT(c)) + " ?", n,
          M("1 - " + dT(r6(1 - p)) + "^{n} \\geq " + dT(c) + " \\iff " + dT(r6(1 - p)) + "^{n} \\leq " + dT(r6(1 - c)) + " \\iff n \\geq \\frac{\\ln(" + dT(r6(1 - c)) + ")}{\\ln(" + dT(r6(1 - p)) + ")} \\approx " + dT(q, 2)) + " : " + M("n = " + n) + ".",
          { ctx: "taille-minimale", guide: [GS(M("\\frac{\\ln(" + dT(r6(1 - c)) + ")}{\\ln(" + dT(r6(1 - p)) + ")}") + " (" + RND[0.01] + ") ?", q, M("\\approx " + dT(q, 2)) + ".", 0.01), GS("Plus petit entier " + M("n") + " qui convient ?", n, M(n) + ".")],
            traps: [TR(n - 1, "n doit être au moins " + dS(r6(Math.round(q * 100) / 100)) + " : on arrondit vers le haut."), TR(Math.ceil(c / p), "Passe par le contraire : (1 − p)ⁿ ≤ " + dS(r6(1 - c)) + ", puis ln."), TR(Math.ceil(Math.log(c) / Math.log(p)), "On travaille avec 1 − p et 1 − " + dS(c) + ".")] }); },
      () => { const n = pk([20, 25, 40, 50]), p = pk([0.2, 0.4, 0.6, 0.8]), mu = r6(n * p), v = r6(n * p * (1 - p)), askN = R.rand() < 0.5;
        return QN("Une variable " + M("X") + " suit une loi binomiale " + M("B(n \\,;\\, p)") + " avec " + M("E(X) = " + dT(mu)) + " et " + M("V(X) = " + dT(v)) + ". Que vaut " + M(askN ? "n" : "p") + " ?", askN ? n : p,
          M("\\frac{V}{E} = 1 - p = " + dT(r6(1 - p))) + ", donc " + M("p = " + dT(p)) + " et " + M("n = \\frac{" + dT(mu) + "}{" + dT(p) + "} = " + n) + ".",
          { ctx: askN ? "retrouver-n" : "retrouver-p", guide: [GS(M("1 - p = \\frac{V(X)}{E(X)}") + " ?", 1 - p, M(dT(r6(1 - p))) + "."), GS(M("p") + " ?", p, M(dT(p)) + ".")].concat(askN ? [GS(M("n = \\frac{E(X)}{p}") + " ?", n, M(n) + ".")] : []),
            traps: askN ? [TR(r6(mu / (1 - p)), "n = E(X) ÷ p, pas ÷ (1 − p)."), TR(r6(mu / v), "Trouve d'abord p avec V/E = 1 − p."), TR(r6(mu * p), "n = E(X) ÷ p.")] : [TR(r6(1 - p), "C'est 1 − p = V/E."), TR(r6(v / mu / 2), "V/E = 1 − p.")] }); },
      () => { const n = pk([5, 6]), ch = pk([3, 4]), p = 1 / ch, a = bp(n, p, n - 1), b = bp(n, p, n), v = a + b;
        return QR("Un élève répond au hasard aux " + M(n) + " questions d'un QCM (" + ch + " réponses proposées, une seule juste). Quelle est la probabilité qu'il ait au moins " + M(n - 1) + " réponses justes (" + RND[0.001] + ") ?", v, 0.001,
          M("X \\sim B\\left(" + n + " \\,;\\, \\frac{1}{" + ch + "}\\right)") + " : " + M("P(X = " + (n - 1) + ") + P(X = " + n + ") = " + n + " \\cdot \\left(\\frac{1}{" + ch + "}\\right)^{" + (n - 1) + "} \\cdot \\frac{" + (ch - 1) + "}{" + ch + "} + \\left(\\frac{1}{" + ch + "}\\right)^{" + n + "} \\approx " + dT(v, 3)) + ". Répondre au hasard ne marche pas !",
          { ctx: "qcm-hasard", guide: [GS(M("P(X = " + (n - 1) + ")") + " (" + RND[0.0001] + ") ?", a, M("\\approx " + dT(a, 4)) + ".", 0.0001), GS(M("P(X = " + n + ")") + " (" + RND[0.0001] + ") ?", b, M("\\approx " + dT(b, 4)) + ".", 0.0001), GS("Total (" + RND[0.001] + ") ?", v, M("\\approx " + dT(v, 3)) + ".", 0.001)],
            traps: [TR(a / n + b, "P(X = " + (n - 1) + ") contient " + n + " chemins."), TR(1 - b, "« Au moins " + (n - 1) + " » : seulement " + (n - 1) + " ou " + n + " réponses justes."), TR((n - 1) / n, "Utilise la loi binomiale avec p = 1/" + ch + ".")] }); },
    ],
  };


  // ======================= Ajouts du 24.11 (chantier G, agent greste) : loi normale, algèbre linéaire =======================
  /* réponses en couple (ligne d'une matrice, image d'un point) : keepT ne garde que les pièges numériques, d'où ce constructeur */
  const canP = (vals) => vals.map(fS).join(" ; ");
  const QP2 = (q, vals, sol, o) => { const spec = { kind: "pair", values: vals.slice() }, x = mk(q, spec, sol, Object.assign({}, o, { traps: [] })), seen = new Set();
    x.traps = (o.traps || []).filter((tr) => { if (!tr || !tr.spec || tr.spec.values.length !== vals.length || !tr.spec.values.every(isFinite)) return false; const c = canP(tr.spec.values); if (seen.has(c)) return false;
      try { if (checkAnswer(spec, c).status !== "wrong") return false; } catch (e) { return false; } seen.add(c); return true; });
    return x; };
  const GP2 = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.slice() }, sol });
  const TP2 = (vals, m) => ({ spec: { kind: "pair", values: vals.slice() }, m });
  const PAIR2 = " Réponds « x ; y ».";
  /* réponse lisible dans l'énoncé ou triviale : nouveau tirage */
  const chk = (q) => (q && typeof answerShown === "function" && (answerShown(q) || trivialQ(q, 0)) ? null : q);

  // ======================= normale : loi normale, règle 68-95-99,7 (4.PS.04a–c) =======================
  const PCT = { 1: 68, 2: 95, 3: 99.7 }, HALF = { 1: 34, 2: 47.5, 3: 49.85 }, TAIL = { 1: 16, 2: 2.5, 3: 0.15 };
  const NCTX = [["la taille (en cm) d'un élève de 4e pris au hasard", [168, 170, 172, 175], [6, 7, 8], "taille"],
    ["la durée de vie (en heures) d'une ampoule", [800, 900, 1200], [40, 50, 60], "ampoule"],
    ["la masse (en g) d'un paquet de pâtes", [500, 750], [4, 5, 6], "pates"],
    ["le temps de trajet (en minutes) d'une pendulaire", [30, 35, 42], [3, 4, 5], "trajet"],
    ["le QI d'une personne prise au hasard", [100], [15], "qi"],
    ["la note (sur 100) d'un candidat à un examen", [60, 62, 65], [8, 10], "examen"]];
  const nPick = () => { const c = pk(NCTX); return { c, mu: pk(c[1]), s: pk(c[2]) }; };
  /* 27.11 (recalcul, agent recalc34) : les probabilités attendues sont celles de la règle 68-95-99,7 (68 %, 16 %…), mais l'énoncé
     ne le disait pas : l'élève qui calculait avec Φ (68,27 %, 31,7 % au dixième…) était refusé. La règle est maintenant rappelée. */
  const nIntro = (o, noParam, noRule) => "On note " + M("X") + " " + o.c[0] + (noParam ? " ; " + M("X") + " suit une loi normale. " : " ; " + M("X") + " suit une loi normale de moyenne " + M("\\mu = " + nb(o.mu)) + " et d'écart-type " + M("\\sigma = " + nb(o.s)) + ". ") + (noRule ? "" : "Utilise la règle 68-95-99,7. ");
  const pc = (v) => M(nb(v) + "\\,\\%");
  const kS = (k) => (k === 1 ? "un écart-type" : k + " écarts-types");
  const NO = {
    1: [
      () => { const o = nPick(), k = pk([1, 2, 3]), a = o.mu - k * o.s, b = o.mu + k * o.s;
        return QN(nIntro(o) + "Quelle est la probabilité, en %, que " + M(nb(a) + " \\le X \\le " + nb(b)) + " ?", PCT[k], M(nb(a)) + " et " + M(nb(b)) + " sont à " + kS(k) + " de la moyenne, de part et d'autre : " + M("P(\\mu - " + (k === 1 ? "" : k) + "\\sigma \\le X \\le \\mu + " + (k === 1 ? "" : k) + "\\sigma) \\approx " + nb(PCT[k]) + "\\,\\%") + ".",
          { ctx: "intervalle-centre-" + o.c[3], guide: [GS("À combien d'écarts-types de la moyenne se trouve " + M(nb(b)) + " ?", k, M("(" + nb(b) + " - " + nb(o.mu) + ") \\div " + nb(o.s) + " = " + k) + "."), GS("Probabilité de l'intervalle centré (en %) ?", PCT[k], pc(PCT[k]) + ".")],
            traps: [TR(HALF[k], "C'est un seul côté : l'intervalle s'étend des deux côtés de la moyenne."), TR(100 - PCT[k], "C'est la probabilité d'être en dehors de l'intervalle."), TR(PCT[k === 3 ? 2 : k + 1], "Compte les écarts-types : " + k + " de chaque côté.")] }); },
      () => { const o = nPick(), k = pk([1, 2]), up = R.rand() < 0.5, x = up ? o.mu + k * o.s : o.mu - k * o.s;
        return QN(nIntro(o) + "Quelle est la probabilité, en %, que " + M("X " + (up ? "\\ge " : "\\le ") + nb(x)) + " ?", TAIL[k], M(nb(x)) + " est à " + kS(k) + " de la moyenne. Hors de l'intervalle centré : " + pc(100 - PCT[k]) + ", partagé également des deux côtés (symétrie) : " + pc(TAIL[k]) + ".",
          { ctx: "queue", guide: [GS("À combien d'écarts-types de la moyenne se trouve " + M(nb(x)) + " ?", k, M(k) + "."), GS("Probabilité d'être en dehors de l'intervalle centré, des deux côtés (en %) ?", 100 - PCT[k], pc(100 - PCT[k]) + "."), GS("D'un seul côté (en %) ?", TAIL[k], pc(TAIL[k]) + " (symétrie).")],
            traps: [TR(100 - PCT[k], "Ce sont les deux côtés : par symétrie, divise par 2."), TR(PCT[k], "C'est la probabilité d'être dans l'intervalle centré."), TR(HALF[k], "C'est entre la moyenne et " + nb(x) + " ; on demande au-delà.")] }); },
      () => { const o = nPick(), k = pk([1, 2, 3]), up = R.rand() < 0.5, x = up ? o.mu + k * o.s : o.mu - k * o.s;
        return QN(nIntro(o) + "Quelle est la probabilité, en %, que " + M(up ? nb(o.mu) + " \\le X \\le " + nb(x) : nb(x) + " \\le X \\le " + nb(o.mu)) + " ?", HALF[k], "De la moyenne à " + kS(k) + " d'un seul côté : la moitié de " + pc(PCT[k]) + ", soit " + pc(HALF[k]) + ".",
          { ctx: "demi-intervalle", guide: [GS("À combien d'écarts-types de la moyenne se trouve " + M(nb(x)) + " ?", k, M(k) + "."), GS("Probabilité de l'intervalle centré correspondant (en %) ?", PCT[k], pc(PCT[k]) + "."), GS("La moitié (en %) ?", HALF[k], pc(HALF[k]) + ".")],
            traps: [TR(PCT[k], "L'intervalle commence à la moyenne : un seul côté, divise par 2."), TR(TAIL[k], "C'est au-delà de " + nb(x) + " ; on demande entre la moyenne et " + nb(x) + "."), TR(50, "La moitié des valeurs dépasse la moyenne, mais pas toutes jusqu'à " + nb(x) + ".")] }); },
    ],
    2: [
      () => { const o = nPick(), [a, b] = pk([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), lo = o.mu - a * o.s, hi = o.mu + b * o.s, v = r6(HALF[a] + HALF[b]);
        return QN(nIntro(o) + "Quelle est la probabilité, en %, que " + M(nb(lo) + " \\le X \\le " + nb(hi)) + " ?", v, "On coupe à la moyenne : " + pc(HALF[a]) + " à gauche (" + kS(a) + ") et " + pc(HALF[b]) + " à droite (" + kS(b) + "), en tout " + pc(v) + ".",
          { ctx: "intervalle-asymetrique", guide: [GS("Partie gauche, de " + M(nb(lo)) + " à la moyenne (en %) ?", HALF[a], pc(HALF[a]) + "."), GS("Partie droite, de la moyenne à " + M(nb(hi)) + " (en %) ?", HALF[b], pc(HALF[b]) + "."), GS("Total (en %) ?", v, pc(v) + ".")],
            traps: [TR(PCT[Math.max(a, b)], "L'intervalle n'est pas centré : coupe-le à la moyenne."), TR(PCT[Math.min(a, b)], "L'intervalle n'est pas centré : coupe-le à la moyenne."), TR(PCT[a] + PCT[b], "Chaque côté ne compte que la moitié de l'intervalle centré.")] }); },
      () => { const o = nPick(), N = pk([200, 400, 600, 800]), kd = pk([["en dehors de l'intervalle", 5, (o2) => M("X < " + nb(o2.mu - 2 * o2.s)) + " ou " + M("X > " + nb(o2.mu + 2 * o2.s))], ["au-dessus", 16, (o2) => M("X > " + nb(o2.mu + o2.s))], ["très au-dessus", 2.5, (o2) => M("X > " + nb(o2.mu + 2 * o2.s))], ["dans l'intervalle", 68, (o2) => M(nb(o2.mu - o2.s) + " \\le X \\le " + nb(o2.mu + o2.s))]]), p = kd[1], cnt = (N * p) / 100;
        return chk(QN(nIntro(o) + "Sur " + M(N) + " observations indépendantes, combien de fois attend-on " + kd[2](o) + " ?", cnt, "Probabilité " + pc(p) + " (règle 68-95-99,7) ; " + M(N + " \\cdot " + nb(p / 100) + " = " + cnt) + ".",
          { ctx: "effectif", guide: [GS("Probabilité correspondante (en %) ?", p, pc(p) + "."), GS("Effectif attendu ?", cnt, M(N + " \\cdot " + nb(p / 100) + " = " + cnt) + ".")],
            traps: [TR((N * (100 - p)) / 100, "C'est l'effectif de l'événement contraire."), TR(p, "Multiplie la probabilité par le nombre d'observations."), TR((N * p) / 200, "La probabilité est déjà celle de l'événement demandé : ne divise pas par 2.")] })); },
      () => { const o = nPick(), k = pk([1, 2, 3]), a = o.mu - k * o.s, b = o.mu + k * o.s;
        return chk(QN("On note " + M("X") + " " + o.c[0] + " ; " + M("X") + " suit une loi normale. Environ " + pc(PCT[k]) + " des valeurs se trouvent entre " + M(nb(a)) + " et " + M(nb(b)) + ", un intervalle centré sur la moyenne. Que vaut l'écart-type " + M("\\sigma") + " ?", o.s, "Moyenne au milieu : " + M("\\mu = " + nb(o.mu)) + ". " + pc(PCT[k]) + " correspond à " + M("\\mu \\pm " + (k === 1 ? "" : k) + "\\sigma") + " : " + M((k === 1 ? "" : k) + "\\sigma = " + nb(b - o.mu)) + ", " + M("\\sigma = " + nb(o.s)) + ".",
          { ctx: "trouver-sigma", guide: [GS("Moyenne " + M("\\mu") + " (milieu de l'intervalle) ?", o.mu, M(nb(o.mu)) + "."), GS("Demi-largeur de l'intervalle ?", k * o.s, M(nb(b) + " - " + nb(o.mu) + " = " + nb(k * o.s)) + "."), GS("Combien d'écarts-types dans cette demi-largeur ?", k, M(k) + "."), GS(M("\\sigma") + " ?", o.s, M(nb(o.s)) + ".")],
            traps: [TR(k * o.s, "C'est " + kS(k) + " : divise par " + k + "."), TR(b - a, "C'est la largeur totale."), TR(((b - a) / 2) / (k === 2 ? 1 : 2), "Pour " + nb(PCT[k]) + " %, la demi-largeur vaut " + k + "σ.")] })); },
      () => { const o = nPick(), z = pk([1.5, -1.5, 2.5, -2.5, 0.5, -0.5, 2, -2, 3]), x = o.mu + z * o.s; if (!Number.isInteger(x)) return null;
        return chk(QN(nIntro(o, false, true) + "Calcule la valeur centrée réduite " + M("z = \\frac{x - \\mu}{\\sigma}") + " de " + M("x = " + nb(x)) + ". (décimal accepté)", z, M("z = \\frac{" + nb(x) + " - " + nb(o.mu) + "}{" + nb(o.s) + "} = \\frac{" + nb(x - o.mu) + "}{" + nb(o.s) + "} = " + nb(z)) + " : " + M(nb(x)) + " est à " + dS(Math.abs(z)) + " écart(s)-type(s) " + (z > 0 ? "au-dessus" : "en dessous") + " de la moyenne.",
          { ctx: "centrer-reduire", guide: [GS(M("x - \\mu") + " ?", x - o.mu, M(nb(x - o.mu)) + "."), GS(M("z") + " ?", z, M(nb(z)) + ".")],
            traps: [TR(x - o.mu, "Divise encore par l'écart-type."), TR(-z, "Attention au signe : x − μ."), TR(r6(x / o.s - o.mu), "On centre d'abord (x − μ), puis on divise par σ.")] })); },
    ],
    3: [
      () => { const o = nPick(), [a, b] = pk([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), lo = o.mu - a * o.s, hi = o.mu + b * o.s, v = r6(TAIL[a] + TAIL[b]);
        return QN(nIntro(o) + "Quelle est la probabilité, en %, que " + M("X \\le " + nb(lo)) + " ou " + M("X \\ge " + nb(hi)) + " ?", v, "Deux queues séparées : " + pc(TAIL[a]) + " sous " + M(nb(lo)) + " (" + kS(a) + ") et " + pc(TAIL[b]) + " au-dessus de " + M(nb(hi)) + " (" + kS(b) + "), en tout " + pc(v) + ".",
          { ctx: "union-queues", guide: [GS("Probabilité sous " + M(nb(lo)) + " (en %) ?", TAIL[a], pc(TAIL[a]) + "."), GS("Probabilité au-dessus de " + M(nb(hi)) + " (en %) ?", TAIL[b], pc(TAIL[b]) + "."), GS("Total (en %) ?", v, pc(v) + ".")],
            traps: [TR(2 * TAIL[a], "Les deux bornes ne sont pas à la même distance de la moyenne."), TR(2 * TAIL[b], "Les deux bornes ne sont pas à la même distance de la moyenne."), TR(r6(HALF[a] + HALF[b]), "C'est la probabilité d'être entre les deux bornes : on demande en dehors.")] }); },
      () => { const o = nPick(), k = pk([1, 2]), up = R.rand() < 0.5, x = up ? o.mu + k * o.s : o.mu - k * o.s;
        return chk(QN("On note " + M("X") + " " + o.c[0] + " ; " + M("X") + " suit une loi normale d'écart-type " + M("\\sigma = " + nb(o.s)) + ". Environ " + pc(TAIL[k]) + " des valeurs sont " + (up ? "supérieures" : "inférieures") + " à " + M(nb(x)) + ". Que vaut la moyenne " + M("\\mu") + " ?", o.mu, pc(TAIL[k]) + " d'un seul côté correspond à " + kS(k) + " : " + M(nb(x) + " = \\mu " + (up ? "+" : "-") + " " + (k === 1 ? "" : k) + "\\sigma") + ", donc " + M("\\mu = " + nb(o.mu)) + ".",
          { ctx: "trouver-mu", guide: [GS("À combien d'écarts-types de la moyenne se trouve " + M(nb(x)) + " ?", k, M(k) + "."), GS("Moyenne " + M("\\mu") + " ?", o.mu, M(nb(x) + (up ? " - " : " + ") + nb(k * o.s) + " = " + nb(o.mu)) + ".")],
            traps: [TR(up ? x + k * o.s : x - k * o.s, up ? "Les valeurs supérieures à " + nb(x) + " sont rares : la moyenne est en dessous." : "Les valeurs inférieures à " + nb(x) + " sont rares : la moyenne est au-dessus."), TR(up ? x - (3 - k) * o.s : x + (3 - k) * o.s, nb(TAIL[k]) + " % d'un côté correspond à " + kS(k) + ".")] })); },
      () => { const o = nPick(), k = pk([1, 2, 3]), up = R.rand() < 0.5, x = up ? o.mu + k * o.s : o.mu - k * o.s;
        return chk(QN(nIntro(o) + (up ? "Au-dessus de quelle valeur se trouvent les " + pc(TAIL[k]) + " des valeurs les plus grandes ?" : "En dessous de quelle valeur se trouvent les " + pc(TAIL[k]) + " des valeurs les plus petites ?"), x, pc(TAIL[k]) + " d'un seul côté : " + kS(k) + " de la moyenne, " + M(nb(o.mu) + (up ? " + " : " - ") + nb(k * o.s) + " = " + nb(x)) + ".",
          { ctx: "seuil", guide: [GS("Combien d'écarts-types correspondent à " + pc(TAIL[k]) + " d'un seul côté ?", k, M(k) + "."), GS("Seuil ?", x, M(nb(x)) + ".")],
            traps: [TR(up ? o.mu - k * o.s : o.mu + k * o.s, "Les valeurs " + (up ? "les plus grandes" : "les plus petites") + " sont " + (up ? "au-dessus" : "en dessous") + " de la moyenne."), TR(up ? o.mu + (k === 1 ? 2 : 1) * o.s : o.mu - (k === 1 ? 2 : 1) * o.s, nb(TAIL[k]) + " % d'un côté correspond à " + kS(k) + ".")] })); },
      () => { const o = nPick(), cs = pk([[1, 0, 16, 50, 32], [2, 0, 2.5, 50, 5], [2, 1, 2.5, 16, 15.625]]), [kn, kd, pn, pd, v] = cs, xn = o.mu + kn * o.s, xd = o.mu + kd * o.s;
        return QR(nIntro(o) + "Sachant que " + M("X \\ge " + nb(xd)) + ", quelle est la probabilité, en %, que " + M("X \\ge " + nb(xn)) + " ? (" + RND[0.1] + ")", v, 0.1, M("P(X \\ge " + nb(xn) + " \\mid X \\ge " + nb(xd) + ") = \\frac{P(X \\ge " + nb(xn) + ")}{P(X \\ge " + nb(xd) + ")} = \\frac{" + nb(pn) + "}{" + nb(pd) + "}") + " ≈ " + pc(rd(v, 0.1)) + ".",
          { ctx: "conditionnelle", guide: [GS(M("P(X \\ge " + nb(xn) + ")") + " (en %) ?", pn, pc(pn) + "."), GS(M("P(X \\ge " + nb(xd) + ")") + " (en %) ?", pd, pc(pd) + "."), GS("Quotient, en % (" + RND[0.1] + ") ?", v, pc(rd(v, 0.1)) + ".", 0.1)],
            traps: [TR(pn, "Sachant que… : divise par la probabilité de la condition."), TR(r6((pn * pd) / 100), "Probabilité conditionnelle : on divise, on ne multiplie pas.")] }); },
    ],
  };

  // ======================= matrices : calcul matriciel 2 × 2 (4.GV.02b, 02c, 02e) =======================
  const mat = (a, b, c, d) => "\\begin{pmatrix} " + fT(a) + " & " + fT(b) + " \\\\ " + fT(c) + " & " + fT(d) + " \\end{pmatrix}";
  const col = (x, y) => "\\begin{pmatrix} " + fT(x) + " \\\\ " + fT(y) + " \\end{pmatrix}";
  const mm = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
  const mv = (A, v) => [A[0] * v[0] + A[1] * v[1], A[2] * v[0] + A[3] * v[1]];
  const dt = (A) => A[0] * A[3] - A[1] * A[2];
  const mX = (A) => mat(...A);
  const rnd4 = (lo = -5, hi = 5) => [nz(lo, hi), nz(lo, hi), nz(lo, hi), nz(lo, hi)];
  const MA = {
    1: [
      () => { const A = rnd4(-6, 6), d = dt(A); if (Math.abs(d) < 2) return null;
        return chk(QN("Calcule le déterminant de " + M("A = " + mX(A)) + ".", d, M("\\det A = " + par(A[0]) + " \\cdot " + par(A[3]) + " - " + par(A[1]) + " \\cdot " + par(A[2]) + " = " + (A[0] * A[3]) + " - " + par(A[1] * A[2]) + " = " + d) + ".",
          { ctx: "determinant", guide: [GS("Produit de la diagonale principale " + M("a \\cdot d") + " ?", A[0] * A[3], M(A[0] * A[3]) + "."), GS("Produit de l'autre diagonale " + M("b \\cdot c") + " ?", A[1] * A[2], M(A[1] * A[2]) + "."), GS(M("\\det A = ad - bc") + " ?", d, M(d) + ".")],
            traps: [TR(A[0] * A[3] + A[1] * A[2], "On soustrait les deux produits : ad − bc."), TR(A[1] * A[2] - A[0] * A[3], "Diagonale principale moins l'autre : ad − bc."), TR(A[0] * A[1] - A[2] * A[3], "On multiplie en diagonale (a avec d, b avec c).")] })); },
      () => { const A = rnd4(), B = rnd4(), al = pk([2, 3, -2]), be = pk([2, -3, 3]), r = R.int(0, 1), C = A.map((x, i) => al * x + be * B[i]), row = [C[2 * r], C[2 * r + 1]], nm = al + "A " + (be < 0 ? "- " + -be : "+ " + be) + "B";
        return QP2("Avec " + M("A = " + mX(A)) + " et " + M("B = " + mX(B)) + ", donne la " + (r ? "deuxième" : "première") + " ligne de " + M(nm) + ". Réponds « a ; b ».", row, "Coefficient par coefficient : " + M(nm + " = " + mX(C)) + ".",
          { ctx: "combinaison", guide: [GS("Premier coefficient de la ligne ?", row[0], M(al + " \\cdot " + par(A[2 * r]) + " + " + par(be) + " \\cdot " + par(B[2 * r]) + " = " + row[0]) + "."), GS("Second coefficient ?", row[1], M(row[1]) + "."), GP2("Ligne ?", row, M("(" + row[0] + " \\,;\\, " + row[1] + ")") + ".")],
            traps: [TP2([al * A[2 * r] + B[2 * r], al * A[2 * r + 1] + B[2 * r + 1]], "Le coefficient " + be + " multiplie aussi B."), TP2([C[2 * (1 - r)], C[2 * (1 - r) + 1]], "C'est l'autre ligne."), TP2([A[2 * r] + B[2 * r], A[2 * r + 1] + B[2 * r + 1]], "Multiplie d'abord A par " + al + " et B par " + be + ".")] }); },
      () => { const A = rnd4(), v = [nz(-5, 5), nz(-5, 5)], w = mv(A, v); if (Math.abs(v[0]) === Math.abs(v[1])) return null;
        return QP2("Calcule " + M(mX(A) + col(...v)) + "." + PAIR2, w, "Ligne par colonne : " + M(par(A[0]) + " \\cdot " + par(v[0]) + " + " + par(A[1]) + " \\cdot " + par(v[1]) + " = " + w[0]) + " et " + M(par(A[2]) + " \\cdot " + par(v[0]) + " + " + par(A[3]) + " \\cdot " + par(v[1]) + " = " + w[1]) + ".",
          { ctx: "matrice-vecteur", guide: [GS("Première ligne × vecteur ?", w[0], M(w[0]) + "."), GS("Seconde ligne × vecteur ?", w[1], M(w[1]) + "."), GP2("Résultat ?", w, M(col(...w)) + ".")],
            traps: [TP2([A[0] * v[0] + A[2] * v[1], A[1] * v[0] + A[3] * v[1]], "On multiplie chaque ligne de la matrice par la colonne (pas les colonnes)."), TP2([A[0] * v[0], A[3] * v[1]], "Chaque ligne donne une somme de deux produits."), TP2([A[0] * v[0] + A[1] * v[0], A[2] * v[1] + A[3] * v[1]], "La première composante du vecteur va avec la première colonne.")] }); },
    ],
    2: [
      () => { const A = rnd4(-4, 4), B = rnd4(-4, 4), r = R.int(0, 1), C = mm(A, B), D = mm(B, A), row = [C[2 * r], C[2 * r + 1]]; if (row.includes(0) || (D[2 * r] === row[0] && D[2 * r + 1] === row[1])) return null;
        return QP2("Avec " + M("A = " + mX(A)) + " et " + M("B = " + mX(B)) + ", donne la " + (r ? "deuxième" : "première") + " ligne du produit " + M("AB") + ". Réponds « a ; b ».", row, "Ligne " + (r + 1) + " de A par chaque colonne de B : " + M(par(A[2 * r]) + " \\cdot " + par(B[0]) + " + " + par(A[2 * r + 1]) + " \\cdot " + par(B[2]) + " = " + row[0]) + " et " + M(par(A[2 * r]) + " \\cdot " + par(B[1]) + " + " + par(A[2 * r + 1]) + " \\cdot " + par(B[3]) + " = " + row[1]) + ".",
          { ctx: "produit", guide: [GS("Ligne " + (r + 1) + " de A × colonne 1 de B ?", row[0], M(row[0]) + "."), GS("Ligne " + (r + 1) + " de A × colonne 2 de B ?", row[1], M(row[1]) + "."), GP2("Ligne de " + M("AB") + " ?", row, M("(" + row[0] + " \\,;\\, " + row[1] + ")") + ".")],
            traps: [TP2([D[2 * r], D[2 * r + 1]], "C'est BA : en général AB ≠ BA."), TP2([A[2 * r] * B[2 * r], A[2 * r + 1] * B[2 * r + 1]], "Le produit matriciel ne se fait pas coefficient par coefficient : ligne × colonne."), TP2([A[2 * r] * B[0] + A[2 * r + 1] * B[1], A[2 * r] * B[2] + A[2 * r + 1] * B[3]], "Ligne de A par colonne de B (pas ligne par ligne).")] }); },
      () => { const D = pk([1, -1, 2, -2, 3]), a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5); if ((D + b * c) % a) return null; const d = (D + b * c) / a; if (!d) return null; const A = [a, b, c, d], row = [r6(d / D), r6(-b / D)]; if (row.some((x) => !x || den(x) > 3)) return null;
        return QP2("Donne la première ligne de l'inverse de " + M("A = " + mX(A)) + ". Réponds « a ; b » (fractions acceptées).", row, M("\\det A = " + D) + " ; " + M("A^{-1} = \\frac{1}{" + D + "}" + mat(d, -b, -c, a) + " = " + mat(row[0], row[1], r6(-c / D), r6(a / D))) + ".",
          { ctx: "inverse", guide: [GS(M("\\det A") + " ?", D, M(D) + "."), GP2("Première ligne de " + M("\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}") + " ?", [d, -b], M("(" + d + " \\,;\\, " + -b + ")") + "."), GP2("Divisée par le déterminant ?", row, M("(" + fT(row[0]) + " \\,;\\, " + fT(row[1]) + ")") + ".")],
            traps: [TP2([d, -b], "Divise encore par le déterminant."), TP2([r6(a / D), r6(-b / D)], "On échange a et d (et on change le signe de b et c)."), TP2([r6(1 / a), r6(1 / b)], "L'inverse d'une matrice ne se calcule pas coefficient par coefficient.")] }); },
      () => { const b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6); if ((b * c) % d) return null; const m = (b * c) / d; if (Math.abs(m) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " la matrice " + M("\\begin{pmatrix} m & " + fT(b) + " \\\\ " + fT(c) + " & " + fT(d) + " \\end{pmatrix}") + " n'est-elle pas inversible ?", m, "Pas inversible quand le déterminant est nul : " + M(fT(d) + "m - " + par(b) + " \\cdot " + par(c) + " = 0") + ", " + M(fT(d) + "m = " + b * c) + ", " + M("m = " + m) + ".",
          { ctx: "non-inversible", guide: [GS(M("\\det = " + (d === 1 ? "" : d === -1 ? "-" : d) + "m - " + par(b) + " \\cdot " + par(c)) + " ; que vaut " + M(par(b) + " \\cdot " + par(c)) + " ?", b * c, M(b * c) + "."), GS(M("m") + " (déterminant nul) ?", m, M(b * c + " \\div " + par(d) + " = " + m) + ".")],
            traps: [TR(-m, "Attention au signe : dm − bc = 0 donne dm = bc."), TR(b * c, "Divise encore par " + d + "."), TR(r6(d / (b * c)), "m = bc ÷ d.")] })); },
    ],
    3: [
      () => { const A = rnd4(-5, 5), D = dt(A), x0 = nz(-5, 5), y0 = nz(-5, 5); if (Math.abs(D) < 2 || x0 === y0) return null; const [e, f] = mv(A, [x0, y0]), Dx = e * A[3] - A[1] * f, Dy = A[0] * f - e * A[2];
        return QP2("Résous avec les déterminants (Cramer) : " + M("\\begin{cases} " + tp([A[0], 0]) + (A[1] < 0 ? " - " : " + ") + (Math.abs(A[1]) === 1 ? "" : Math.abs(A[1])) + "y = " + e + " \\\\ " + tp([A[2], 0]) + (A[3] < 0 ? " - " : " + ") + (Math.abs(A[3]) === 1 ? "" : Math.abs(A[3])) + "y = " + f + " \\end{cases}") + "." + PAIR2, [x0, y0],
          M("D = " + D) + ", " + M("D_x = " + Dx) + ", " + M("D_y = " + Dy) + " : " + M("x = \\frac{" + Dx + "}{" + D + "} = " + x0) + ", " + M("y = \\frac{" + Dy + "}{" + D + "} = " + y0) + ".",
          { ctx: "cramer", guide: [GS("Déterminant " + M("D") + " de la matrice des coefficients ?", D, M(D) + "."), GS(M("D_x") + " (colonne des x remplacée par le second membre) ?", Dx, M(Dx) + "."), GS(M("D_y") + " ?", Dy, M(Dy) + "."), GP2("Solution ?", [x0, y0], M("x = " + x0) + ", " + M("y = " + y0) + ".")],
            traps: [TP2([Dx, Dy], "Divise D_x et D_y par D."), TP2([y0, x0], "D_x donne x, D_y donne y."), TP2([-x0, -y0], "Attention aux signes des déterminants.")] }); },
      () => { const D = nz(-6, 6), k = pk([2, 3, -2]), t = R.int(0, 2), E = pk([2, 3, -2, 4]); if (Math.abs(D) < 2) return null; const v = [k * k * D, D * E, r6(1 / D)][t];
        const q = ["On sait que " + M("\\det A = " + D) + " (matrice 2 × 2). Que vaut " + M("\\det(" + k + "A)") + " ?", "On sait que " + M("\\det A = " + D) + " et " + M("\\det B = " + E) + ". Que vaut " + M("\\det(AB)") + " ?", "On sait que " + M("\\det A = " + D) + ". Que vaut " + M("\\det(A^{-1})") + " ? (fraction acceptée)"][t];
        const sol = [M("k A") + " multiplie les deux lignes par " + k + " : " + M("\\det(" + k + "A) = " + par(k) + "^2 \\cdot " + par(D) + " = " + v), M("\\det(AB) = \\det A \\cdot \\det B = " + par(D) + " \\cdot " + par(E) + " = " + v), M("\\det(A^{-1}) = \\frac{1}{\\det A} = " + fT(v))][t] + ".";
        return chk(QN(q, v, sol, { ctx: ["det-multiple", "det-produit", "det-inverse"][t], guide: [GS(["Facteur " + M("k^2") + " ?", "Produit des déterminants ?", "Inverse de " + M("\\det A") + " ?"][t], [k * k, D * E, v][t], M(fT([k * k, D * E, v][t])) + "."), GS("Réponse ?", v, M(fT(v)) + ".")].slice(t ? 1 : 0),
          traps: [[TR(k * D, "Chaque ligne est multipliée par " + dS(k) + " : le déterminant est multiplié par " + (k < 0 ? "(" + dS(k) + ")" : k) + "²."), TR(k + D, "On multiplie, on n'additionne pas.")], [TR(D + E, "Le déterminant d'un produit est le produit des déterminants."), TR(D, "N'oublie pas det B.")], [TR(-D, "C'est l'inverse, pas l'opposé."), TR(D, "det(A⁻¹) = 1 ÷ det A.")]][t] })); },
      () => { const A = rnd4(-4, 4), C = mm(A, A), r = R.int(0, 1), row = [C[2 * r], C[2 * r + 1]]; if (row.includes(0)) return null;
        return QP2("Avec " + M("A = " + mX(A)) + ", donne la " + (r ? "deuxième" : "première") + " ligne de " + M("A^2 = A \\cdot A") + ". Réponds « a ; b ».", row, M("A^2 = " + mX(C)) + " (ligne par colonne).",
          { ctx: "carre", guide: [GS("Ligne " + (r + 1) + " de A × colonne 1 de A ?", row[0], M(row[0]) + "."), GS("Ligne " + (r + 1) + " de A × colonne 2 de A ?", row[1], M(row[1]) + "."), GP2("Ligne de " + M("A^2") + " ?", row, M("(" + row[0] + " \\,;\\, " + row[1] + ")") + ".")],
            traps: [TP2([A[2 * r] ** 2, A[2 * r + 1] ** 2], "On n'élève pas chaque coefficient au carré : A² = A · A, ligne × colonne."), TP2([2 * A[2 * r], 2 * A[2 * r + 1]], "A² n'est pas 2A.")] }); },
    ],
  };

  // ======================= translin : transformations linéaires du plan (4.GV.01a–d) =======================
  const TU = [["la rotation de 90° (sens trigonométrique) autour de l'origine", [0, -1, 1, 0], "rot90"], ["la rotation de −90° (sens horaire) autour de l'origine", [0, 1, -1, 0], "rot-90"],
    ["la symétrie d'axe Ox (l'axe des abscisses)", [1, 0, 0, -1], "symx"], ["la symétrie d'axe Oy (l'axe des ordonnées)", [-1, 0, 0, 1], "symy"], ["la symétrie d'axe la droite y = x", [0, 1, 1, 0], "symdiag"]];
  const TL = {
    1: [
      () => { const A = rnd4(), P = [nz(-4, 4), nz(-4, 4)], Q = mv(A, P); if (Math.abs(P[0]) === Math.abs(P[1])) return null;
        return QP2("La transformation linéaire " + M("f") + " a pour matrice " + M(mX(A)) + ". Donne l'image du point " + M("P(" + P[0] + " \\,;\\, " + P[1] + ")") + "." + PAIR2, Q, M(mX(A) + col(...P) + " = " + col(...Q)) + " : " + M("f(P) = (" + Q[0] + " \\,;\\, " + Q[1] + ")") + ".",
          { ctx: "image-point", guide: [GS("Abscisse de l'image (ligne 1 × coordonnées) ?", Q[0], M(par(A[0]) + " \\cdot " + par(P[0]) + " + " + par(A[1]) + " \\cdot " + par(P[1]) + " = " + Q[0]) + "."), GS("Ordonnée (ligne 2) ?", Q[1], M(Q[1]) + "."), GP2("Image ?", Q, M("(" + Q[0] + " \\,;\\, " + Q[1] + ")") + ".")],
            traps: [TP2([A[0] * P[0] + A[2] * P[1], A[1] * P[0] + A[3] * P[1]], "Ligne de la matrice × colonne des coordonnées."), TP2([A[0] * P[0], A[3] * P[1]], "Chaque coordonnée de l'image est une somme de deux produits.")] }); },
      /* 25.11 (audit niveau 4e) : symétries d'axe Ox / Oy retirées ici (changer un signe = niveau CO) ; restent rotations, symétrie y = x, homothéties. */
      () => { const t = pk(TU.filter((u) => u[2] !== "symx" && u[2] !== "symy")), k = R.rand() < 0.25 ? pk([2, 3, -2]) : 0, Mx = k ? [k, 0, 0, k] : t[1], P = [nz(-5, 5), nz(-5, 5)], Q = mv(Mx, P); if (Math.abs(P[0]) === Math.abs(P[1])) return null;
        const nm = k ? "l'homothétie de centre O et de rapport " + k : t[0];
        return QP2("Quelle est l'image du point " + M("P(" + P[0] + " \\,;\\, " + P[1] + ")") + " par " + nm + " ?" + PAIR2, Q, "Matrice " + M(mX(Mx)) + " (colonnes : images de " + M("(1 \\,;\\, 0)") + " et de " + M("(0 \\,;\\, 1)") + ") : image " + M("(" + Q[0] + " \\,;\\, " + Q[1] + ")") + ".",
          { ctx: k ? "homothetie" : t[2], guide: [GP2("Image de " + M("(1 \\,;\\, 0)") + " (première colonne de la matrice) ?", [Mx[0], Mx[2]], M("(" + Mx[0] + " \\,;\\, " + Mx[2] + ")") + "."), GP2("Image de " + M("(0 \\,;\\, 1)") + " (seconde colonne) ?", [Mx[1], Mx[3]], M("(" + Mx[1] + " \\,;\\, " + Mx[3] + ")") + "."), GP2("Image de " + M("P") + " ?", Q, M("(" + Q[0] + " \\,;\\, " + Q[1] + ")") + ".")],
            traps: [TP2([-Q[0], -Q[1]], "Vérifie le sens : c'est l'image par la transformation opposée (ou la symétrie centrale)."), TP2([P[1], P[0]], "Échanger les coordonnées, c'est la symétrie d'axe y = x."), TP2([-P[0], -P[1]], "C'est la symétrie centrale (rotation de 180°)."), TP2([-P[1], P[0]], "C'est la rotation de 90° dans le sens trigonométrique.")] }); },
      () => { const A = rnd4(-5, 5), d = dt(A), S = pk([3, 4, 5, 6, 2.5, 7.5]); if (Math.abs(d) < 2) return null; const v = Math.abs(d) * S, fig = pk(["un triangle", "un carré", "un parallélogramme", "un logo"]);
        return chk(QN(fig[0].toUpperCase() + fig.slice(1) + " d'aire " + M(nb(S)) + " unités² est transformé par l'application linéaire de matrice " + M(mX(A)) + ". Quelle est l'aire de son image ?", v, "Les aires sont multipliées par " + M("|\\det| = |" + d + "| = " + Math.abs(d)) + " : " + M(Math.abs(d) + " \\cdot " + nb(S) + " = " + nb(v)) + " unités².",
          { ctx: "aire-image", guide: [GS("Déterminant de la matrice ?", d, M(d) + "."), GS("Facteur des aires " + M("|\\det|") + " ?", Math.abs(d), M(Math.abs(d)) + "."), GS("Aire de l'image ?", v, M(nb(v)) + ".")],
            traps: [TR(d * S, "Une aire est positive : on multiplie par la valeur absolue du déterminant."), TR(S * Math.abs(A[0] + A[3]), "Le facteur des aires est |det| = |ad − bc|."), TR(S / Math.abs(d), "L'aire est multipliée par |det| (pas divisée).")] })); },
    ],
    2: [
      () => { const A = rnd4(-4, 4), d = dt(A), P = [nz(-5, 5), nz(-5, 5)], Q = mv(A, P); if (Math.abs(d) < 1 || Math.abs(P[0]) === Math.abs(P[1])) return null;
        return QP2("La transformation de matrice " + M(mX(A)) + " envoie le point " + M("P") + " sur " + M("Q(" + Q[0] + " \\,;\\, " + Q[1] + ")") + ". Retrouve " + M("P") + "." + PAIR2, P, "On résout " + M(mX(A) + "\\begin{pmatrix} x \\\\ y \\end{pmatrix}" + " = " + col(...Q)) + " (ou " + M("P = A^{-1}Q") + ", " + M("\\det A = " + d) + ") : " + M("P(" + P[0] + " \\,;\\, " + P[1] + ")") + ".",
          { ctx: "antecedent", guide: [GS(M("\\det A") + " ?", d, M(d) + "."), GS(M("x") + " (Cramer : " + M("\\frac{D_x}{D}") + ") ?", P[0], M(P[0]) + "."), GP2("Point " + M("P") + " ?", P, M("(" + P[0] + " \\,;\\, " + P[1] + ")") + ".")],
            traps: [TP2(mv(A, Q), "C'est l'image de Q ; on cherche la préimage : P = A⁻¹Q." /* 26.11 soir : usage suisse (FR_WORDS → antécédent) */), TP2([P[1], P[0]], "Attention à l'ordre : x puis y.")] }); },
      () => { const A = rnd4(-3, 3), B = rnd4(-3, 3), P = [nz(-3, 3), nz(-3, 3)], Q1 = mv(A, P), Q = mv(B, Q1), W = mv(A, mv(B, P)); if (Q.includes(0) || (W[0] === Q[0] && W[1] === Q[1])) return null;
        return QP2("On applique d'abord " + M("f") + " de matrice " + M(mX(A)) + ", puis " + M("g") + " de matrice " + M(mX(B)) + ". Image de " + M("P(" + P[0] + " \\,;\\, " + P[1] + ")") + " par " + M("g \\circ f") + " ?" + PAIR2, Q, M("f(P) = (" + Q1[0] + " \\,;\\, " + Q1[1] + ")") + ", puis " + M("g(f(P)) = (" + Q[0] + " \\,;\\, " + Q[1] + ")") + ". (Matrice de " + M("g \\circ f") + " : " + M("BA") + ".)",
          { ctx: "composition", guide: [GP2("Image " + M("f(P)") + " ?", Q1, M("(" + Q1[0] + " \\,;\\, " + Q1[1] + ")") + "."), GP2("Puis " + M("g(f(P))") + " ?", Q, M("(" + Q[0] + " \\,;\\, " + Q[1] + ")") + ".")],
            traps: [TP2(W, "L'ordre compte : d'abord f, puis g (matrice BA, pas AB)."), TP2(Q1, "C'est f(P) : applique encore g.")] }); },
      () => { const c1 = [nz(-4, 4), nz(-4, 4)], c2 = [nz(-4, 4), nz(-4, 4)], A = [c1[0], c2[0], c1[1], c2[1]], P = [nz(-4, 4), nz(-4, 4)], Q = mv(A, P); if (dt(A) === 0 || Math.abs(P[0]) === Math.abs(P[1])) return null;
        return QP2("Une application linéaire " + M("f") + " envoie " + M("(1 \\,;\\, 0)") + " sur " + M("(" + c1[0] + " \\,;\\, " + c1[1] + ")") + " et " + M("(0 \\,;\\, 1)") + " sur " + M("(" + c2[0] + " \\,;\\, " + c2[1] + ")") + ". Image de " + M("P(" + P[0] + " \\,;\\, " + P[1] + ")") + " ?" + PAIR2, Q, "Les images sont les colonnes de la matrice " + M(mX(A)) + " : " + M("f(P) = " + par(P[0]) + col(...c1) + " + " + par(P[1]) + col(...c2) + " = " + col(...Q)) + ".",
          { ctx: "colonnes", guide: [GS("Abscisse de " + M("f(P)") + " ?", Q[0], M(par(P[0]) + " \\cdot " + par(c1[0]) + " + " + par(P[1]) + " \\cdot " + par(c2[0]) + " = " + Q[0]) + "."), GP2("Image ?", Q, M("(" + Q[0] + " \\,;\\, " + Q[1] + ")") + ".")],
            traps: [TP2([P[0] * c1[0] + P[1] * c1[1], P[0] * c2[0] + P[1] * c2[1]], "Les images de (1 ; 0) et (0 ; 1) sont les colonnes (pas les lignes) de la matrice."), TP2([c1[0] + c2[0], c1[1] + c2[1]], "Multiplie chaque colonne par la coordonnée correspondante de P.")] }); },
    ],
    3: [
      () => { const th = pk([30, 45, 60, 120, 135, 150, 210, 300]), P = [nz(-4, 4), nz(-4, 4)], c = Math.cos(th / (180 / Math.PI)), s = Math.sin(th / (180 / Math.PI)), xr = P[0] * c - P[1] * s, yr = P[0] * s + P[1] * c, askX = R.rand() < 0.5, v = askX ? xr : yr; if (Math.abs(v) < 0.05) return null;
        return QR("Par la rotation de centre O et d'angle " + M(th + "°") + ", quelle est " + (askX ? "l'abscisse" : "l'ordonnée") + " de l'image de " + M("P(" + P[0] + " \\,;\\, " + P[1] + ")") + " ? (" + RND[0.01] + ")", v, 0.01,
          "Matrice " + M("\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}") + " : " + (askX ? M("x' = x\\cos\\theta - y\\sin\\theta") : M("y' = x\\sin\\theta + y\\cos\\theta")) + " " + M("\\approx " + dT(v, 2)) + ".",
          { ctx: "rotation-angle", guide: [GS(M("\\cos " + th + "°") + " (" + RND[0.001] + ") ?", c, M(dT(c, 3)) + ".", 0.001), GS(M("\\sin " + th + "°") + " (" + RND[0.001] + ") ?", s, M(dT(s, 3)) + ".", 0.001), GS((askX ? M("x' = x\\cos\\theta - y\\sin\\theta") : M("y' = x\\sin\\theta + y\\cos\\theta")) + " (" + RND[0.01] + ") ?", v, M(dT(v, 2)) + ".", 0.01)],
            traps: [TR(askX ? P[0] * c + P[1] * s : P[0] * s - P[1] * c, "Matrice de rotation : (cos θ ; −sin θ) sur la première ligne, (sin θ ; cos θ) sur la seconde."), TR(askX ? yr : xr, askX ? "C'est l'ordonnée de l'image." : "C'est l'abscisse de l'image.")] }); },
      () => { const b = nz(-4, 4), c = nz(-4, 4), d = pk([2, 3, 4, -2]), k = pk([2, 3, 4, 5, -2, -3]), det = k * d - b * c, S = pk([2, 3, 4, 5]); if (det <= 1 || det === k) return null; const T = det * S;
        return chk(QN("La matrice " + M("\\begin{pmatrix} k & " + fT(b) + " \\\\ " + fT(c) + " & " + fT(d) + " \\end{pmatrix}") + " a un déterminant positif. Elle transforme un carré d'aire " + M(S) + " en une figure d'aire " + M(T) + ". Que vaut " + M("k") + " ?", k, "Facteur des aires : " + M("\\det = " + T + " \\div " + S + " = " + det) + " ; " + M(fT(d) + "k - " + par(b) + " \\cdot " + par(c) + " = " + det) + ", " + M("k = " + k) + ".",
          { ctx: "aire-parametre", guide: [GS("Déterminant (rapport des aires) ?", det, M(T + " \\div " + S + " = " + det) + "."), GS(M("k") + " ?", k, M("(" + det + sg(b * c) + ") \\div " + par(d) + " = " + k) + ".")],
            traps: [TR(r6((T + b * c) / d), "Le déterminant est le rapport des aires : divise d'abord " + T + " par " + S + "."), TR(r6((det - b * c) / d), "det = dk − bc : on ajoute bc avant de diviser.")] })); },
      () => { const A = rnd4(-4, 4), B = rnd4(-4, 4), dA = dt(A), dB = dt(B), S = pk([2, 3, 1.5, 4]); if (Math.abs(dA) < 2 || Math.abs(dB) < 2) return null; const v = Math.abs(dA * dB) * S;
        return chk(QN("Un triangle d'aire " + M(nb(S)) + " subit la transformation de matrice " + M(mX(A)) + ", puis celle de matrice " + M(mX(B)) + ". Quelle est l'aire de l'image finale ?", v, M("|\\det A| = " + Math.abs(dA)) + ", " + M("|\\det B| = " + Math.abs(dB)) + " : les aires sont multipliées par " + M(Math.abs(dA * dB)) + ", aire " + M(nb(v)) + ".",
          { ctx: "aire-composee", guide: [GS(M("\\det A") + " ?", dA, M(dA) + "."), GS(M("\\det B") + " ?", dB, M(dB) + "."), GS("Aire finale ?", v, M(Math.abs(dA * dB) + " \\cdot " + nb(S) + " = " + nb(v)) + ".")],
            traps: [TR(Math.abs(dA + dB) * S, "Les facteurs des aires se multiplient (det(BA) = det B · det A)."), TR(Math.abs(dA) * S, "Applique aussi la seconde transformation."), TR(dA * dB * S, "Une aire est positive : valeur absolue.")] })); },
    ],
  };

  // ======================= appllin : applications linéaires, noyau, image, bases (4.GV.02a, 02d ; 4.GV.03a–d) =======================
  // 24.11 (chantier G) : réponses numériques ou couples ; noyau et image d'une matrice 2 × 2 non inversible, famille liée,
  // composantes dans une base, changement de base, image d'un vecteur connue par les images d'une base.
  const vT = (v) => "(" + fT(v[0]) + " \\,;\\, " + fT(v[1]) + ")";
  const sing = () => { const m = pk([-3, -2, 2, 3]), b = nz(-4, 4), a = -b * m, k = pk([-3, -2, 2, 3]); return { A: [a, b, k * a, k * b], m, k }; }; /* lignes proportionnelles, noyau (1 ; m) */
  const AL = {
    1: [
      () => { const { A, m } = sing();
        return chk(QN("La matrice " + M(mX(A)) + " n'est pas inversible. Son noyau est la droite des vecteurs " + M("\\vec v") + " tels que " + M("A\\vec v = \\vec 0") + " ; elle est engendrée par " + M("(1 \\,;\\, m)") + ". Que vaut " + M("m") + " ?", m,
          "Première ligne : " + M(fT(A[0]) + " \\cdot 1 + " + par(A[1]) + " \\cdot m = 0") + ", donc " + M("m = " + m) + ". La seconde ligne est proportionnelle : elle donne la même condition.",
          { ctx: "noyau", guide: [GS("Équation donnée par la première ligne : " + M(fT(A[0]) + " + " + par(A[1]) + "m = 0") + ". " + M("m") + " = ?", m, M(m) + ".")], traps: [TR(-m, "Attention au signe : " + fT(A[0]) + " + " + par(A[1]) + "·m = 0."), TR(r6(1 / m), "Isole m : m = −" + par(A[0]) + " ÷ " + par(A[1]) + ".")] })); },
      () => { const a = nz(-5, 5), c = pk([-3, -2, 2, 3]), k0 = nz(-4, 4), d = c * k0, k = r6(a * d / c); if (!Number.isInteger(k) || Math.abs(k) < 2 || Math.abs(a) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("k") + " la matrice " + M("\\begin{pmatrix} " + fT(a) + " & k \\\\ " + fT(c) + " & " + fT(d) + " \\end{pmatrix}") + " a-t-elle un noyau non réduit à " + M("\\vec 0") + " (application non injective) ?", k,
          "Noyau non nul ⇔ " + M("\\det = 0") + " : " + M(fT(a) + " \\cdot " + par(d) + " - " + fT(c) + "k = 0") + ", " + M("k = " + k) + ".",
          { ctx: "det-nul", guide: [GS("Le noyau n'est pas réduit à 0 exactement quand le déterminant vaut… ?", 0, "0."), GS(M("k") + " ?", k, M(fT(a * d) + " \\div " + par(c) + " = " + k) + ".")], traps: [TR(-k, "det = ad − kc : vérifie le signe."), TR(r6(c * d / a), "Le déterminant est " + fT(a) + "·" + par(d) + " − k·" + par(c) + ".")] })); },
      () => { const u = [nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3)], al = nz(-4, 4), be = nz(-4, 4); if (u[0] * v[1] - u[1] * v[0] === 0 || Math.abs(al) === Math.abs(be)) return null; const w = [al * u[0] + be * v[0], al * u[1] + be * v[1]];
        return QP2("Dans la base " + M("\\mathcal B = (\\vec u \\,;\\, \\vec v)") + " avec " + M("\\vec u = " + vT(u)) + " et " + M("\\vec v = " + vT(v)) + ", le vecteur " + M("\\vec w") + " a pour composantes " + M(vT([al, be])) + ". Donne ses coordonnées dans la base canonique." + PAIR2, w,
          M("\\vec w = " + fT(al) + "\\vec u " + (be < 0 ? "- " + fT(-be) : "+ " + fT(be)) + "\\vec v = " + vT(w)) + ".",
          { ctx: "composantes-vers-canonique", guide: [GP2(M(fT(al) + "\\vec u") + " ?", [al * u[0], al * u[1]], M(vT([al * u[0], al * u[1]])) + "."), GP2(M("\\vec w") + " ?", w, M(vT(w)) + ".")], traps: [TP2([al, be], "Ce sont les composantes dans la base B ; on demande les coordonnées usuelles."), TP2([al * u[0] + be * u[1], al * v[0] + be * v[1]], "Combine les vecteurs : al·u + be·v, coordonnée par coordonnée.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 4), m = pk([-3, -2, 2, 3]), t = pk([-3, -2, 2, 3]), A = [a, t * a, m * a, t * m * a];
        return chk(QN("L'application linéaire de matrice " + M(mX(A)) + " n'est pas inversible : son image est une droite passant par l'origine, d'équation " + M("y = mx") + ". Que vaut " + M("m") + " ?", m,
          "Les deux colonnes " + M(col(A[0], A[2])) + " et " + M(col(A[1], A[3])) + " sont colinéaires : l'image est engendrée par " + M(vT([A[0], A[2]])) + ", donc " + M("m = " + fT(A[2]) + " \\div " + par(A[0]) + " = " + m) + ".",
          { ctx: "image", guide: [GP2("Un vecteur qui engendre l'image (première colonne) ?", [A[0], A[2]], M(vT([A[0], A[2]])) + "."), GS("Pente " + M("m") + " ?", m, M(m) + ".")], traps: [TR(t, "Ça, c'est le rapport entre les deux colonnes ; la pente de l'image est y ÷ x d'une colonne."), TR(r6(1 / m), "Pente = ordonnée ÷ abscisse.")] })); },
      () => { const u = [nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3)], d = u[0] * v[1] - u[1] * v[0], al = nz(-4, 4), be = nz(-4, 4); if (d === 0 || Math.abs(al) === Math.abs(be)) return null; const w = [al * u[0] + be * v[0], al * u[1] + be * v[1]];
        return QP2("Base " + M("\\mathcal B") + " : " + M("\\vec u = " + vT(u)) + ", " + M("\\vec v = " + vT(v)) + ". Donne les composantes " + M("(\\alpha \\,;\\, \\beta)") + " de " + M("\\vec w = " + vT(w)) + " dans cette base, c'est-à-dire " + M("\\vec w = \\alpha\\vec u + \\beta\\vec v") + "." + PAIR2, [al, be],
          "Système " + M(fT(u[0]) + "\\alpha " + (v[0] < 0 ? "- " + fT(-v[0]) : "+ " + fT(v[0])) + "\\beta = " + fT(w[0])) + " et " + M(fT(u[1]) + "\\alpha " + (v[1] < 0 ? "- " + fT(-v[1]) : "+ " + fT(v[1])) + "\\beta = " + fT(w[1])) + " (déterminant " + M(d) + ") : " + M("\\alpha = " + al) + ", " + M("\\beta = " + be) + ".",
          { ctx: "composantes", guide: [GS("Déterminant de " + M("(\\vec u \\,;\\, \\vec v)") + " (non nul : c'est bien une base) ?", d, M(d) + "."), GS(M("\\alpha") + " ?", al, M(al) + "."), GP2(M("(\\alpha \\,;\\, \\beta)") + " ?", [al, be], M(vT([al, be])) + ".")], traps: [TP2([be, al], "α est le coefficient de u, β celui de v."), TP2(w, "Ce sont les coordonnées usuelles de w.")] }); },
      () => { const a = nz(-4, 4), m = pk([-3, -2, 2, 3]), t = pk([-3, -2, 2, 3]), A = [a, t * a, m * a, t * m * a], y = m * pk([2, 3, 4, -2, -3]), k = y / m;
        return chk(QN("L'image de l'application de matrice " + M(mX(A)) + " est une droite. Pour quelle valeur de " + M("k") + " le vecteur " + M("(k \\,;\\, " + fT(y) + ")") + " appartient-il à l'image ?", k,
          "L'image est la droite engendrée par " + M(vT([A[0], A[2]])) + ", d'équation " + M("y = " + m + "x") + " : " + M(fT(y) + " = " + m + "k") + ", " + M("k = " + k) + ".",
          { ctx: "image-appartient", guide: [GS("Pente de la droite image ?", m, M("y = " + m + "x") + "."), GS(M("k") + " ?", k, M(k) + ".")], traps: [TR(y * m, "Sur la droite y = mx : k = y ÷ m."), TR(-k, "Vérifie le signe.")] })); },
    ],
    3: [
      () => { const b = nz(-3, 3), m = pk([-3, -2, 2, 3]), a = -b * m, k = pk([-3, -2, 2, 3]), c = k * a, t = k * b;
        return chk(QN("On considère " + M("\\begin{pmatrix} " + fT(a) + " & " + fT(b) + " \\\\ " + fT(c) + " & t \\end{pmatrix}") + ". Pour la valeur de " + M("t") + " qui rend la matrice non inversible, le noyau est engendré par " + M("(1 \\,;\\, m)") + ". Que vaut " + M("m") + " ?", m,
          M("\\det = " + fT(a) + "t - " + par(b) + " \\cdot " + par(c) + " = 0") + " donne " + M("t = " + t) + ". Puis " + M(fT(a) + " + " + par(b) + "m = 0") + " : " + M("m = " + m) + ".",
          { ctx: "parametre-noyau", guide: [GS(M("t") + " (déterminant nul) ?", t, M(t) + "."), GS(M("m") + " ?", m, M(m) + ".")], traps: [TR(t, "Ça, c'est t ; on demande ensuite le noyau."), TR(-m, "Vérifie le signe : " + fT(a) + " + " + par(b) + "·m = 0.")] })); },
      () => { const u = [nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3)], fu = [nz(-4, 4), nz(-4, 4)], fv = [nz(-4, 4), nz(-4, 4)], al = nz(-3, 3), be = nz(-3, 3); if (u[0] * v[1] - u[1] * v[0] === 0 || Math.abs(al) === Math.abs(be)) return null;
        const w = [al * u[0] + be * v[0], al * u[1] + be * v[1]], fw = [al * fu[0] + be * fv[0], al * fu[1] + be * fv[1]]; if (fw.includes(0)) return null;
        return QP2("Une application linéaire " + M("f") + " vérifie " + M("f" + vT(u) + " = " + vT(fu)) + " et " + M("f" + vT(v) + " = " + vT(fv)) + ". Calcule " + M("f" + vT(w)) + "." + PAIR2, fw,
          M(vT(w) + " = " + fT(al) + vT(u) + (be < 0 ? " - " + fT(-be) : " + " + fT(be)) + vT(v)) + " ; par linéarité " + M("f" + vT(w) + " = " + fT(al) + vT(fu) + (be < 0 ? " - " + fT(-be) : " + " + fT(be)) + vT(fv) + " = " + vT(fw)) + ".",
          { ctx: "image-par-base", guide: [GP2("Composantes de " + M(vT(w)) + " dans la base " + M("(" + vT(u) + " \\,;\\, " + vT(v) + ")") + " ?", [al, be], M(vT([al, be])) + "."), GP2("Image par linéarité ?", fw, M(vT(fw)) + ".")], traps: [TP2([al, be], "Ce sont les composantes ; applique ensuite f par linéarité."), TP2([w[0] * fu[0], w[1] * fv[1]], "On ne multiplie pas coordonnée par coordonnée : décompose d'abord w dans la base.")] }); },
      () => { const u = [nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3)], p = [nz(-3, 3), nz(-3, 3)], q = [nz(-3, 3), nz(-3, 3)], al = nz(-3, 3), be = nz(-3, 3); if (u[0] * v[1] - u[1] * v[0] === 0 || p[0] * q[1] - p[1] * q[0] === 0 || Math.abs(al) === Math.abs(be)) return null;
        const w = [al * u[0] + be * v[0], al * u[1] + be * v[1]], D = p[0] * q[1] - p[1] * q[0], g = (w[0] * q[1] - w[1] * q[0]) / D, h = (p[0] * w[1] - p[1] * w[0]) / D; if (!Number.isInteger(g) || !Number.isInteger(h) || !g || !h || (g === al && h === be)) return null;
        return QP2("Le vecteur " + M("\\vec w") + " a pour composantes " + M(vT([al, be])) + " dans la base " + M("(" + vT(u) + " \\,;\\, " + vT(v) + ")") + ". Quelles sont ses composantes dans la base " + M("(" + vT(p) + " \\,;\\, " + vT(q) + ")") + " ?" + PAIR2, [g, h],
          "D'abord dans la base canonique : " + M("\\vec w = " + vT(w)) + ". Puis on résout " + M("\\gamma" + vT(p) + " + \\delta" + vT(q) + " = " + vT(w)) + " : " + M("(\\gamma \\,;\\, \\delta) = " + vT([g, h])) + ".",
          { ctx: "changement-base", guide: [GP2("Coordonnées de " + M("\\vec w") + " dans la base canonique ?", w, M(vT(w)) + "."), GP2("Composantes dans la nouvelle base ?", [g, h], M(vT([g, h])) + ".")], traps: [TP2(w, "Ce sont les coordonnées canoniques ; il faut encore les exprimer dans la nouvelle base."), TP2([al, be], "Ce sont les composantes dans l'ancienne base.")] }); },
    ],
  };

  // ======================= 25.11 (agent c4plus) : intparties, intsubst, etudelnexp, eqdiff =======================
  /* puissance de e : TeX et tapé (exposant 1 écrit « e », jamais « e^{1} ») */
  const eT = (p) => (r6(p) === 1 ? "e" : "e^{" + fT(p) + "}");
  const eS = (p) => (r6(p) === 1 ? "e" : "e^(" + fS(p) + ")");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

  // ======================= intparties : intégration par parties (4.AN.04a, renforcé) =======================
  const IP = {
    1: [
      () => { const a = pk([2, 3, 4]), v = (a - 1) * Math.exp(a) + 1, c1 = a - 1;
        return QN("Calcule " + M("\\int_0^{" + a + "} x\\,e^{x}\\,dx") + " par parties (valeur exacte).", v,
          M("u = x") + ", " + M("v' = e^x") + " : " + M("u' = 1") + ", " + M("v = e^x") + ". " + M("\\int_0^{" + a + "} x e^x\\,dx = \\left[x e^x\\right]_0^{" + a + "} - \\int_0^{" + a + "} e^x\\,dx = " + a + "e^{" + a + "} - (e^{" + a + "} - 1) = " + cT(c1) + "e^{" + a + "} + 1") + ".",
          { ctx: "x-exp", canon: (c1 === 1 ? "" : c1 + "*") + "e^" + a + " + 1",
            guide: [GS("Avec " + M("u = x") + " et " + M("v = e^x") + ", que vaut " + M("\\left[x e^x\\right]_0^{" + a + "}") + " ?", a * Math.exp(a), M(a + "e^{" + a + "}") + "."), GS("Que vaut " + M("\\int_0^{" + a + "} u'v\\,dx = \\int_0^{" + a + "} e^x\\,dx") + " ?", Math.exp(a) - 1, M("e^{" + a + "} - 1") + "."), GS("Intégrale (différence des deux) ?", v, M(cT(c1) + "e^{" + a + "} + 1") + ".")],
            traps: [TR(a * Math.exp(a), "Il manque le second terme : − ∫ u'v dx."), TR(c1 * Math.exp(a), "La primitive (x − 1)eˣ vaut −1 en 0 : il faut soustraire F(0) = −1."), TR((a + 1) * Math.exp(a) - 1, "Par parties : [uv] MOINS ∫ u'v dx."), TR((a * a / 2) * Math.exp(a), "On ne primitive pas les deux facteurs séparément : c'est pour cela qu'on intègre par parties.")] }); },
      () => { const a = pk([2, 3, 4, 5]), v = a * Math.log(a) - a + 1;
        return QN("Calcule " + M("\\int_1^{" + a + "} \\ln(x)\\,dx") + " (valeur exacte). Indication : écris " + M("\\ln(x)") + " comme le produit " + M("1 \\cdot \\ln(x)") + " et intègre par parties.", v,
          M("u = \\ln(x)") + ", " + M("v' = 1") + " : " + M("u' = \\frac{1}{x}") + ", " + M("v = x") + ". " + M("\\left[x\\ln(x)\\right]_1^{" + a + "} - \\int_1^{" + a + "} x \\cdot \\frac{1}{x}\\,dx = " + a + "\\ln(" + a + ") - " + (a - 1)) + ".",
          { ctx: "ln-seul", canon: a + "*ln(" + a + ") - " + (a - 1),
            guide: [GS("Que vaut " + M("\\left[x\\ln(x)\\right]_1^{" + a + "}") + " ?", a * Math.log(a), M(a + "\\ln(" + a + ") - 0") + "."), GS("Que vaut " + M("\\int_1^{" + a + "} x \\cdot \\frac{1}{x}\\,dx") + " ?", a - 1, M(a + " - 1 = " + (a - 1)) + "."), GS("Intégrale ?", v, M(a + "\\ln(" + a + ") - " + (a - 1)) + ".")],
            traps: [TR(a * Math.log(a), "Il manque − ∫ u'v dx = −(" + a + " − 1)."), TR(1 / a - 1, "1/x est la dérivée de ln(x), pas sa primitive."), TR(a * Math.log(a) + a - 1, "Par parties : [uv] MOINS ∫ u'v dx."), TR(Math.log(a), "La primitive de ln(x) n'est pas ln(x) : on intègre par parties.")] }); },
      () => { const b = pk([-4, -3, -2, 2, 3, 4]), c = b - 1, base = "(" + linS(1, c) + ")*exp(x)", ans = base + (c > 0 ? " - " + c : " + " + -c);
        return QX("Donne la primitive " + M("F") + " de " + M("f(x) = (" + lin(1, b) + ")e^{x}") + " qui vérifie " + M("F(0) = 0") + ".", ans,
          M("u = " + lin(1, b)) + ", " + M("v' = e^x") + " : " + M("\\int f = (" + lin(1, b) + ")e^x - \\int e^x\\,dx = (" + lin(1, c) + ")e^x + C") + ". " + M("F(0) = " + c + " + C = 0") + " donne " + M("C = " + -c) + " : " + M("F(x) = (" + lin(1, c) + ")e^x" + sg(-c)) + ".",
          { ctx: "primitive-x-exp",
            guide: [GX("Avec " + M("u = " + lin(1, b)) + " et " + M("v = e^x") + ", que vaut " + M("uv") + " ?", "(" + linS(1, b) + ")*exp(x)", M("(" + lin(1, b) + ")e^x") + "."), GX("Une primitive (sans constante) : " + M("uv - \\int u'v\\,dx") + " ?", base, M("(" + lin(1, c) + ")e^x") + "."), GX(M("F(x)") + " avec " + M("F(0) = 0") + " ?", ans, M("(" + lin(1, c) + ")e^x" + sg(-c)) + ".")],
            traps: [TX("(" + linS(1, b) + ")*exp(x)", "Il manque − ∫ u'v dx = −eˣ ; vérifie en dérivant."), TX(base, "Cette primitive vaut " + c + " en 0 : ajuste la constante pour avoir F(0) = 0."), TX("(" + linS(1, b + 1) + ")*exp(x)" + (b + 1 > 0 ? " - " + (b + 1) : " + " + -(b + 1)), "Par parties : uv MOINS ∫ u'v dx (ici − eˣ)."), TX("(x^2/2 " + (b < 0 ? "- " + -b : "+ " + b) + "x)*exp(x)", "On ne primitive pas les deux facteurs séparément.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4, 6]);
        if (R.rand() < 0.5) { const v = (k * Math.PI) / 2 - k;
          return QN("Calcule " + M("\\int_0^{\\frac{\\pi}{2}} " + k + "x\\cos(x)\\,dx") + " (valeur exacte).", v,
            M("u = " + k + "x") + ", " + M("v' = \\cos(x)") + " : " + M("v = \\sin(x)") + ". " + M("\\left[" + k + "x\\sin(x)\\right]_0^{\\frac{\\pi}{2}} - \\int_0^{\\frac{\\pi}{2}} " + k + "\\sin(x)\\,dx = " + piT(k / 2) + " - " + k) + ".",
            { ctx: "x-cos", canon: piS(k / 2) + " - " + k,
              guide: [GS("Que vaut " + M("\\left[" + k + "x\\sin(x)\\right]_0^{\\frac{\\pi}{2}}") + " ?", (k * Math.PI) / 2, M(piT(k / 2)) + "."), GS("Que vaut " + M("\\int_0^{\\frac{\\pi}{2}} " + k + "\\sin(x)\\,dx") + " ?", k, M("\\left[-" + k + "\\cos(x)\\right]_0^{\\frac{\\pi}{2}} = " + k) + "."), GS("Intégrale ?", v, M(piT(k / 2) + " - " + k) + ".")],
              traps: [TR((k * Math.PI) / 2, "Il manque − ∫ u'v dx."), TR((k * Math.PI) / 2 + k, "Par parties : [uv] MOINS ∫ u'v dx."), TR((k * Math.PI * Math.PI) / 8, "On ne primitive pas x et cos(x) séparément.")] }); }
        const v = k * Math.PI;
        return QPi("Calcule " + M("\\int_0^{\\pi} " + k + "x\\sin(x)\\,dx") + " (valeur exacte).", k,
          M("u = " + k + "x") + ", " + M("v' = \\sin(x)") + " : " + M("v = -\\cos(x)") + ". " + M("\\left[-" + k + "x\\cos(x)\\right]_0^{\\pi} + \\int_0^{\\pi} " + k + "\\cos(x)\\,dx = " + piT(k) + " + 0 = " + piT(k)) + ".",
          { ctx: "x-sin",
            guide: [GS("Que vaut " + M("\\left[-" + k + "x\\cos(x)\\right]_0^{\\pi}") + " ?", v, M("-" + k + "\\pi\\cos(\\pi) = " + piT(k)) + "."), GS("Que vaut " + M("\\int_0^{\\pi} " + k + "\\cos(x)\\,dx") + " ?", 0, M("\\left[" + k + "\\sin(x)\\right]_0^{\\pi} = 0") + "."), GS("Intégrale ?", v, M(piT(k)) + ".")],
            traps: [TR(-v, "Une primitive de sin(x) est −cos(x), et cos(π) = −1 : le crochet est positif."), TR(2 * k, "C'est ∫ " + k + "sin(x) dx ; ici x multiplie sin(x) : intègre par parties."), TR((k * Math.PI * Math.PI) / 2, "On ne primitive pas x et sin(x) séparément.")] }); },
      () => { const a = pk([2, 3]), b = pk([-3, -1, 1, 3, 4]), s = a + b, d = a - b, v = s * Math.exp(2) + d; if (s === 0 || d === 0) return null;
        return QN("Calcule " + M("\\int_0^{2} (" + lin(a, b) + ")e^{x}\\,dx") + " (valeur exacte).", v,
          M("u = " + lin(a, b)) + ", " + M("v' = e^x") + " : primitive " + M("(" + lin(a, b) + ")e^x - " + a + "e^x = (" + lin(a, b - a) + ")e^x") + ". En 2 : " + M(cT(s) + "e^{2}") + " ; en 0 : " + M(b - a) + ". Intégrale " + M(cT(s) + "e^{2}" + sg(d)) + ".",
          { ctx: "affine-exp", canon: (s === 1 ? "" : s === -1 ? "-" : s + "*") + "e^2" + (d > 0 ? " + " + d : " - " + -d),
            guide: [GX("Une primitive (sans constante) de " + M("(" + lin(a, b) + ")e^x") + " ?", "(" + linS(a, b - a) + ")*exp(x)", M("(" + lin(a, b - a) + ")e^x") + "."), GS("Sa valeur en " + M("x = 2") + " ?", s * Math.exp(2), M(cT(s) + "e^{2}") + "."), GS("Sa valeur en " + M("x = 0") + " ?", b - a, M(b - a) + "."), GS("Intégrale ?", v, M(cT(s) + "e^{2}" + sg(d)) + ".")],
            traps: [TR(s * Math.exp(2), "Il faut soustraire la valeur de la primitive en 0 : " + (b - a) + "."), TR((2 * a + b) * Math.exp(2) - b, "Il manque − ∫ u'v dx = −" + a + "eˣ."), TR((3 * a + b) * Math.exp(2) - (b + a), "Par parties : uv MOINS ∫ u'v dx.")] }); },
      () => { const a = pk([2, 3, 4]), v = 1 - (a + 1) * Math.exp(-a);
        return QN("Calcule " + M("\\int_0^{" + a + "} x\\,e^{-x}\\,dx") + " (valeur exacte).", v,
          M("u = x") + ", " + M("v' = e^{-x}") + ", " + M("v = -e^{-x}") + " : " + M("\\left[-x e^{-x}\\right]_0^{" + a + "} + \\int_0^{" + a + "} e^{-x}\\,dx = -" + a + "e^{-" + a + "} + 1 - e^{-" + a + "} = 1 - " + (a + 1) + "e^{-" + a + "}") + ".",
          { ctx: "x-exp-neg", canon: "1 - " + (a + 1) + "*e^(-" + a + ")",
            guide: [GS("Que vaut " + M("\\left[-x e^{-x}\\right]_0^{" + a + "}") + " ?", -a * Math.exp(-a), M("-" + a + "e^{-" + a + "}") + "."), GS("Que vaut " + M("\\int_0^{" + a + "} e^{-x}\\,dx") + " ?", 1 - Math.exp(-a), M("1 - e^{-" + a + "}") + "."), GS("Intégrale ?", v, M("1 - " + (a + 1) + "e^{-" + a + "}") + ".")],
            traps: [TR(-a * Math.exp(-a), "Il manque le second terme, + ∫ e^(−x) dx."), TR(-(a + 1) * Math.exp(-a), "La primitive −(x + 1)e^(−x) vaut −1 en 0 : il faut la soustraire."), TR((a + 1) * Math.exp(-a) - 1, "Une primitive de e^(−x) est −e^(−x) (attention au signe).")] }); },
    ],
    3: [
      () => { const [lo, hi] = pk([[0, 2], [0, 3], [-1, 0], [-2, 0]]), pp = (t) => t * t - 2 * t + 2, F = (t) => pp(t) * Math.exp(t), v = F(hi) - F(lo);
        const tT = (t) => (t === 0 ? "2" : pp(t) + "e^{" + t + "}"), tS = (t) => (t === 0 ? "2" : pp(t) + "*e^(" + t + ")");
        const G = (g) => g(hi) - g(lo);
        return QN("Calcule " + M("\\int_{" + lo + "}^{" + hi + "} x^2 e^{x}\\,dx") + " (valeur exacte ; deux intégrations par parties).", v,
          "Première fois " + M("u = x^2") + " : " + M("x^2e^x - \\int 2x e^x\\,dx") + " ; deuxième fois " + M("u = 2x") + " : " + M("\\int 2xe^x\\,dx = (2x - 2)e^x") + ". Primitive " + M("(x^2 - 2x + 2)e^x") + ", donc " + M(tT(hi) + " - " + tT(lo)) + ".",
          { ctx: "x2-exp", canon: tS(hi) + " - " + tS(lo),
            guide: [GX("Première intégration par parties (" + M("u = x^2") + ", " + M("v' = e^x") + ") : " + M("\\int x^2e^x\\,dx = x^2e^x - \\int g(x)\\,dx") + ". Que vaut " + M("g(x)") + " ?", "2x*exp(x)", M("2xe^x") + "."), GX("Une primitive de " + M("x^2e^x") + " ?", "(x^2 - 2x + 2)*exp(x)", M("(x^2 - 2x + 2)e^x") + "."), GS("Intégrale ?", v, M(tT(hi) + " - " + tT(lo)) + ".")],
            traps: [TR(G((t) => (t * t - 2 * t) * Math.exp(t)), "La seconde intégration par parties donne (2x − 2)eˣ : il reste + 2eˣ."), TR(G((t) => (t * t + 2 * t + 2) * Math.exp(t)), "Par parties : uv MOINS ∫ u'v dx (signe de 2x)."), TR(G((t) => t * t * Math.exp(t)), "x²eˣ n'est pas une primitive de x²eˣ : dérive-la pour vérifier.")] }); },
      () => { const k = pk([2, 4, 6]), h = k / 2, sin = R.rand() < 0.5, A = sin ? Math.exp(Math.PI) + 1 : Math.exp(Math.PI / 2) - 1, v = h * A;
        const fn = sin ? "\\sin" : "\\cos", bT = sin ? "\\pi" : "\\frac{\\pi}{2}", AT = sin ? "e^{\\pi} + 1" : "e^{\\frac{\\pi}{2}} - 1", AS = sin ? "e^π + 1" : "e^(π/2) - 1";
        return QN("Calcule " + M("\\int_0^{" + bT + "} " + k + "e^{x}" + fn + "(x)\\,dx") + " (valeur exacte).", v,
          "On note " + M("I = \\int_0^{" + bT + "} e^{x}" + fn + "(x)\\,dx") + ". Deux intégrations par parties (" + M("v' = e^x") + " les deux fois) ramènent à " + M("I") + " lui-même : " + M("I = " + AT + " - I") + ", donc " + M("I = \\frac{" + AT + "}{2}") + " et l'intégrale vaut " + M(cT(h) + (h === 1 ? "" : "\\cdot") + "\\left(" + AT + "\\right)") + ".",
          { ctx: sin ? "exp-sin" : "exp-cos", canon: (h === 1 ? "" : h + "*") + "(" + AS + ")",
            guide: [GS("Sans le facteur " + M(k) + " : deux intégrations par parties donnent " + M("I = A - I") + ". Que vaut " + M("A") + " ?", A, M(AT) + "."), GS(M("I = \\frac{A}{2}") + " ?", A / 2, M("\\frac{" + AT + "}{2}") + "."), GS("Avec le facteur " + M(k) + " ?", v, M(cT(h) + (h === 1 ? "" : "\\cdot") + "\\left(" + AT + "\\right)") + ".")],
            traps: [TR(k * A, "On trouve I = A − I, donc 2I = A : divise par 2."), TR(sin ? h * (Math.exp(Math.PI) - 1) : h * (Math.exp(Math.PI / 2) + 1), "Attention aux signes : " + (sin ? "cos(π) = −1." : "cos(0) = 1 et sin(0) = 0.")), TR(h * (sin ? Math.exp(Math.PI) : Math.exp(Math.PI / 2)), "N'oublie pas les valeurs en 0 : e⁰ = 1.")] }); },
      () => { const n = pk([1, 2, 3]), a = pk([1, 2, 3, 4]), m = n + 1, c1 = a / m, c2 = a / (m * m);
        const ans = "(" + fS(c1) + ")*x^" + m + "*ln(x) - (" + fS(c2) + ")*x^" + m + " + " + fS(c2);
        const fx = (a === 1 ? "" : a) + (n === 1 ? "x" : "x^{" + n + "}") + "\\ln(x)", FT = cT(c1) + "x^{" + m + "}\\ln(x) - " + cT(c2) + "x^{" + m + "} + " + fT(c2);
        return QX("Donne la primitive " + M("F") + " de " + M("f(x) = " + fx) + " (pour " + M("x > 0") + ") qui s'annule en " + M("x = 1") + ".", ans,
          M("u = \\ln(x)") + ", " + M("v' = " + mT(a, n)) + " : " + M("v = " + mT(c1, m)) + ", " + M("u'v = " + mT(c1, n)) + ", dont une primitive est " + M(mT(c2, m)) + ". Avec " + M("F(1) = 0") + " : " + M("F(x) = " + FT) + ".",
          { ctx: "xn-ln", pos: true,
            guide: [GX("Avec " + M("u = \\ln(x)") + " et " + M("v' = " + mT(a, n)) + ", que vaut " + M("v") + " ?", mS(c1, m), M(mT(c1, m)) + ".", true), GX("Une primitive de " + M("u'v = " + mT(c1, n)) + " ?", mS(c2, m), M(mT(c2, m)) + ".", true), GX(M("F(x)") + " avec " + M("F(1) = 0") + " ?", ans, M(FT) + ".", true)],
            traps: [TX("(" + fS(c1) + ")*x^" + m + "*ln(x) - (" + fS(c2) + ")*x^" + m, "Cette primitive vaut −" + fS(c2) + " en 1 : ajuste la constante."), TX("(" + fS(c1) + ")*x^" + m + "*ln(x) + (" + fS(c2) + ")*x^" + m + " - " + fS(c2), "Par parties : uv MOINS ∫ u'v dx."), TX("(" + fS(c1) + ")*x^" + m + "*ln(x)", "Il manque − ∫ u'v dx.")] }); },
    ],
  };

  // ======================= intsubst : intégration par substitution (4.AN.04b, renforcé) =======================
  const IS = {
    1: [
      () => { const a = pk([2, 3]), b = pk([1, 2, -1]), n = pk([2, 3]), [lo, hi] = pk([[0, 2], [1, 2], [1, 3]]), Ul = a * lo + b, Uh = a * hi + b, m = n + 1, v = (Uh ** m - Ul ** m) / (a * m);
        return QN("Calcule " + M("\\int_{" + lo + "}^{" + hi + "} (" + lin(a, b) + ")^{" + n + "}\\,dx") + " avec la substitution " + M("u = " + lin(a, b)) + ".", v,
          M("du = " + a + "\\,dx") + ", bornes " + M("u(" + lo + ") = " + Ul) + " et " + M("u(" + hi + ") = " + Uh) + " : " + M("\\frac{1}{" + a + "}\\int_{" + Ul + "}^{" + Uh + "} u^{" + n + "}\\,du = \\frac{1}{" + a + "}\\left[\\frac{u^{" + m + "}}{" + m + "}\\right]_{" + Ul + "}^{" + Uh + "} = " + fT(v)) + ".",
          { ctx: "affine-puissance",
            guide: [GS("Nouvelle borne du bas " + M("u(" + lo + ")") + " ?", Ul, M(Ul) + "."), GS("Nouvelle borne du haut " + M("u(" + hi + ")") + " ?", Uh, M(Uh) + "."), GS(M("\\left[\\frac{u^{" + m + "}}{" + m + "}\\right]_{" + Ul + "}^{" + Uh + "}") + " ?", (Uh ** m - Ul ** m) / m, M(fT((Uh ** m - Ul ** m) / m)) + "."), GS("On divise par " + M(a) + " (car " + M("dx = \\frac{du}{" + a + "}") + ") : intégrale ?", v, M(fT(v)) + ".")],
            traps: [TR((Uh ** m - Ul ** m) / m, "du = " + a + " dx : il faut diviser par " + a + "."), TR((hi ** m - lo ** m) / (a * m), "En changeant de variable, on change aussi les bornes : u va de " + Ul + " à " + Uh + "."), TR((Uh ** m - Ul ** m) / a, "Une primitive de uⁿ est uⁿ⁺¹ ÷ (n + 1).")] }); },
      () => { const n = pk([2, 3]), c = n === 3 ? 2 : pk([2, 3]), b = pk([1, 2, 3]), U = c * c + b, m = n + 1, v = (U ** m - b ** m) / m;
        return QN("Calcule " + M("\\int_0^{" + c + "} 2x\\left(x^2 + " + b + "\\right)^{" + n + "}\\,dx") + " avec la substitution " + M("u = x^2 + " + b) + ".", v,
          M("du = 2x\\,dx") + ", bornes " + M("u(0) = " + b) + " et " + M("u(" + c + ") = " + U) + " : " + M("\\int_{" + b + "}^{" + U + "} u^{" + n + "}\\,du = \\frac{" + U + "^{" + m + "} - " + b + "^{" + m + "}}{" + m + "} = " + fT(v)) + ".",
          { ctx: "u-prime-puissance",
            guide: [GX("Avec " + M("u = x^2 + " + b) + ", " + M("du = g(x)\\,dx") + ". Que vaut " + M("g(x)") + " ?", "2x", M("2x") + "."), GS("Borne du bas " + M("u(0)") + " ?", b, M(b) + "."), GS("Borne du haut " + M("u(" + c + ")") + " ?", U, M(U) + "."), GS("Intégrale ?", v, M(fT(v)) + ".")],
            traps: [TR(U ** m / m, "Il faut soustraire la valeur en u = " + b + "."), TR(v / 2, "2x dx est exactement du : pas de facteur 1/2."), TR((c ** m - 0) / m, "Les bornes changent : u va de " + b + " à " + U + ".")] }); },
      () => { const [a, b, mm] = pk([[2, 1, 4], [3, 1, 5], [5, 1, 3], [4, 9, 4], [3, 4, 4], [2, 9, 8], [8, 1, 3], [3, 1, 8], [4, 1, 2], [6, 4, 2], [8, 9, 2]]), T = a * mm + b, s = Math.sqrt(T), r = Math.sqrt(b), W = (2 * (s ** 3 - r ** 3)) / 3, v = W / a;
        return QN("Calcule " + M("\\int_0^{" + mm + "} \\sqrt{" + lin(a, b) + "}\\,dx") + " avec la substitution " + M("u = " + lin(a, b)) + ".", v,
          M("du = " + a + "\\,dx") + ", " + M("u") + " va de " + M(b) + " à " + M(T) + " : " + M("\\frac{1}{" + a + "}\\left[\\frac{2}{3}u^{\\frac{3}{2}}\\right]_{" + b + "}^{" + T + "} = \\frac{2(" + s ** 3 + " - " + r ** 3 + ")}{" + 3 * a + "} = " + fT(v)) + ".",
          { ctx: "racine-affine",
            guide: [GS("Borne du haut " + M("u(" + mm + ")") + " ?", T, M(T) + "."), GS(M("\\left[\\frac{2}{3}u^{\\frac{3}{2}}\\right]_{" + b + "}^{" + T + "}") + " ?", W, M("\\frac{2}{3}(" + s ** 3 + " - " + r ** 3 + ") = " + fT(W)) + "."), GS("On divise par " + M(a) + " : intégrale ?", v, M(fT(v)) + ".")],
            traps: [TR(W, "du = " + a + " dx : divise par " + a + "."), TR((2 * s ** 3) / (3 * a), "Il faut soustraire la valeur en u = " + b + "."), TR((3 * (s ** 3 - r ** 3)) / (2 * a), "Primitive de u^(1/2) : u^(3/2) ÷ (3/2), soit (2/3)u^(3/2).")] }); },
    ],
    2: [
      () => { const c = pk([2, 3, 4]), q = pk([1, 2, 3, 5]), U = c * c + q, Rr = U / q, v = Math.log(Rr) / 2;
        return QN("Calcule " + M("\\int_0^{" + c + "} \\frac{x}{x^2 + " + q + "}\\,dx") + " (valeur exacte).", v,
          M("u = x^2 + " + q) + ", " + M("du = 2x\\,dx") + " : " + M("\\frac{1}{2}\\int_{" + q + "}^{" + U + "} \\frac{du}{u} = \\frac{1}{2}\\ln\\left(" + fT(Rr) + "\\right)") + ".",
          { ctx: "x-sur-quadratique", canon: "ln(" + fS(Rr) + ")/2",
            guide: [GS("Avec " + M("u = x^2 + " + q) + " : borne du haut ?", U, M(U) + "."), GS(M("\\int_{" + q + "}^{" + U + "} \\frac{du}{u}") + " ?", Math.log(Rr), M("\\ln(" + U + ") - \\ln(" + q + ") = \\ln\\left(" + fT(Rr) + "\\right)") + "."), GS("Avec le facteur " + M("\\frac{1}{2}") + " (car " + M("x\\,dx = \\frac{du}{2}") + ") ?", v, M("\\frac{1}{2}\\ln\\left(" + fT(Rr) + "\\right)") + ".")],
            traps: [TR(Math.log(Rr), "x dx = du ÷ 2 : il manque le facteur 1/2."), TR(Math.log(U) / 2, "Il faut soustraire ln(" + q + ")."), TR(2 * Math.log(Rr), "On divise par 2, on ne multiplie pas.")] }); },
      () => { const k = pk([2, 4, 5, 7]), n = pk([2, 3, 4]); if (k % (n + 1) === 0) return null; const v = k / (n + 1);
        return QN("Calcule " + M("\\int_0^{\\frac{\\pi}{2}} " + k + "\\sin^{" + n + "}(x)\\cos(x)\\,dx") + ".", v,
          M("u = \\sin(x)") + ", " + M("du = \\cos(x)\\,dx") + " ; " + M("u") + " va de " + M("\\sin(0) = 0") + " à " + M("\\sin\\left(\\frac{\\pi}{2}\\right) = 1") + " : " + M("\\int_0^{1} " + k + "u^{" + n + "}\\,du = \\frac{" + k + "}{" + (n + 1) + "}") + ".",
          { ctx: "trigo",
            guide: [GX("Avec " + M("u = \\sin(x)") + ", " + M("du = g(x)\\,dx") + ". Que vaut " + M("g(x)") + " ?", "cos(x)", M("\\cos(x)") + "."), GS("Borne du haut " + M("u\\left(\\frac{\\pi}{2}\\right)") + " ?", 1, M("\\sin\\left(\\frac{\\pi}{2}\\right) = 1") + "."), GS(M("\\int_0^{1} " + k + "u^{" + n + "}\\,du") + " ?", v, M(fT(v)) + ".")],
            traps: [TR((k * (Math.PI / 2) ** (n + 1)) / (n + 1), "Les bornes changent : u = sin(x) va de 0 à 1, pas de 0 à π/2."), TR(k / n, "Primitive de uⁿ : uⁿ⁺¹ ÷ (n + 1)."), TR(-v, "du = cos(x) dx (pas −cos(x) dx) : le résultat est positif.")] }); },
      () => { const k = pk([2, 3, 4, 5]), m = pk([1, 2, 3]), v = m * Math.log(k);
        return QN("Calcule " + M("\\int_{e}^{e^{" + k + "}} \\frac{" + m + "}{x\\ln(x)}\\,dx") + " (valeur exacte).", v,
          M("u = \\ln(x)") + ", " + M("du = \\frac{dx}{x}") + " ; " + M("u") + " va de " + M("\\ln(e) = 1") + " à " + M("\\ln(e^{" + k + "}) = " + k) + " : " + M("\\int_1^{" + k + "} \\frac{" + m + "}{u}\\,du = " + cT(m) + "\\ln(" + k + ")") + ".",
          { ctx: "un-sur-xlnx", canon: (m === 1 ? "" : m + "*") + "ln(" + k + ")",
            guide: [GS("Avec " + M("u = \\ln(x)") + " : borne du bas " + M("u(e)") + " ?", 1, M("1") + "."), GS("Borne du haut " + M("u(e^{" + k + "})") + " ?", k, M(k) + "."), GS(M("\\int_1^{" + k + "} \\frac{" + m + "}{u}\\,du") + " ?", v, M(cT(m) + "\\ln(" + k + ")") + ".")],
            traps: [TR(m * (k - 1), "La primitive de 1/u est ln(u), pas u."), TR(m * (1 - 1 / k), "La primitive de 1/u est ln(u) ; −1/u est celle de 1/u²."), TR(m * Math.log(k) - m, "ln(1) = 0 : rien à soustraire en bas.")] }); },
    ],
    3: [
      () => { const [c, q] = pk([[3, 16], [4, 9], [6, 64], [8, 36], [12, 25], [5, 144]]), U = c * c + q, s = Math.sqrt(U), r = Math.sqrt(q), v = (s ** 3 - r ** 3) / 3;
        return QN("Calcule " + M("\\int_0^{" + c + "} x\\sqrt{x^2 + " + q + "}\\,dx") + ".", v,
          M("u = x^2 + " + q) + ", " + M("x\\,dx = \\frac{du}{2}") + " ; " + M("u") + " va de " + M(q) + " à " + M(U) + " : " + M("\\frac{1}{2}\\left[\\frac{2}{3}u^{\\frac{3}{2}}\\right]_{" + q + "}^{" + U + "} = \\frac{" + s ** 3 + " - " + r ** 3 + "}{3} = " + fT(v)) + ".",
          { ctx: "x-racine",
            guide: [GS("Borne du haut " + M("u(" + c + ")") + " ?", U, M(U) + "."), GS("Que vaut " + M("u^{\\frac{3}{2}}") + " en " + M("u = " + U) + " ?", s ** 3, M(s + "^3 = " + s ** 3) + "."), GS("Intégrale " + M("\\frac{1}{3}\\left[u^{\\frac{3}{2}}\\right]_{" + q + "}^{" + U + "}") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(2 * v, "x dx = du ÷ 2 : il manque le facteur 1/2."), TR(s ** 3 / 3, "Il faut soustraire la valeur en u = " + q + " : " + r + "³."), TR(((s ** 3 - r ** 3) * 3) / 4, "Primitive de √u : (2/3)u^(3/2), pas (3/2)u^(3/2).")] }); },
      () => { const m = pk([2, 3, 5, 7]), q = pk([1, 2, 3]), Rr = (m + q) / (1 + q), v = Math.log(Rr);
        return QN("Calcule " + M("\\int_0^{\\ln(" + m + ")} \\frac{e^{x}}{e^{x} + " + q + "}\\,dx") + " (valeur exacte).", v,
          M("u = e^x + " + q) + ", " + M("du = e^x\\,dx") + " ; " + M("u") + " va de " + M("e^0 + " + q + " = " + (1 + q)) + " à " + M("e^{\\ln " + m + "} + " + q + " = " + (m + q)) + " : " + M("\\left[\\ln(u)\\right]_{" + (1 + q) + "}^{" + (m + q) + "} = \\ln\\left(" + fT(Rr) + "\\right)") + ".",
          { ctx: "exp-sur-exp", canon: "ln(" + fS(Rr) + ")",
            guide: [GS("Avec " + M("u = e^x + " + q) + " : borne du bas ?", 1 + q, M("e^0 + " + q + " = " + (1 + q)) + "."), GS("Borne du haut ?", m + q, M(m + " + " + q + " = " + (m + q)) + "."), GS("Intégrale ?", v, M("\\ln\\left(" + fT(Rr) + "\\right)") + ".")],
            traps: [TR(Math.log(m + q), "Il faut soustraire ln(" + (1 + q) + ")."), TR(Math.log((m + q) / q), "En x = 0, u = e⁰ + " + q + " = " + (1 + q) + " (e⁰ = 1, pas 0)."), TR(Math.log(m), "Les bornes changent avec u = eˣ + " + q + ".")] }); },
      () => { const [c, q] = pk([[8, 36], [12, 25], [15, 64], [12, 81]]), k = pk([1, 3]), U = c * c + q, s = Math.sqrt(U), r = Math.sqrt(q), v = k * (s - r);
        return QN("Calcule " + M("\\int_0^{" + c + "} \\frac{" + (k === 1 ? "" : k) + "x}{\\sqrt{x^2 + " + q + "}}\\,dx") + ".", v,
          M("u = x^2 + " + q) + ", " + M("x\\,dx = \\frac{du}{2}") + " : " + M("\\frac{" + k + "}{2}\\int_{" + q + "}^{" + U + "} u^{-\\frac{1}{2}}\\,du = " + cT(k) + "\\left[\\sqrt{u}\\right]_{" + q + "}^{" + U + "} = " + (k === 1 ? "" : k) + "(" + s + " - " + r + ") = " + v) + ".",
          { ctx: "x-sur-racine",
            guide: [GS("Borne du haut " + M("u(" + c + ")") + " ?", U, M(U) + "."), GS("Une primitive de " + M("\\frac{1}{2\\sqrt{u}}") + " est " + M("\\sqrt{u}") + ". Que vaut " + M("\\left[\\sqrt{u}\\right]_{" + q + "}^{" + U + "}") + " ?", s - r, M(s + " - " + r + " = " + (s - r)) + "."), GS("Intégrale ?", v, M(v) + ".")],
            traps: [TR(2 * v, "x dx = du ÷ 2 : on divise par 2."), TR(k * s, "Il faut soustraire √" + q + " = " + r + "."), TR(v / 2, "Primitive de u^(−1/2) : 2√u ; avec le 1/2 de du, il reste √u.")] }); },
    ],
  };

  // ======================= etudelnexp : étude de fonctions avec ln et exp (4.AN.06d) =======================
  const EL = {
    1: [
      () => { const a = pk([2, 3, 4, 5]); let b; do b = nz(-9, 9); while (Math.abs(b) === a);
        const inv = R.rand() < 0.5, v = inv ? b / a : -b / a, arg = inv ? b + " - " + (a === 1 ? "" : a) + "x" : lin(a, b);
        return QN("La fonction " + M("f(x) = \\ln(" + arg + ")") + " est définie pour " + M(inv ? "x < c" : "x > c") + ". Donne " + M("c") + ".", v,
          "Le logarithme n'existe que pour un argument strictement positif : " + M(arg + " > 0 \\iff x " + (inv ? "<" : ">") + " " + fT(v)) + ".",
          { ctx: "domaine-ln",
            guide: [GS("Pour quelle valeur de " + M("x") + " l'argument " + M(arg) + " s'annule-t-il ?", v, M("x = " + fT(v)) + "."), GS(M("c") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(-v, "Isole x avec soin : attention au signe."), TR(inv ? b : -b, "Divise aussi par " + a + "."), TR(inv ? a / b : -a / b, "x = " + (inv ? "" : "−") + "b ÷ a, pas a ÷ b.")] }); },
      () => { const a = pk([2, 3, 4]); let b; do b = nz(-6, 6); while (Math.abs(b) === a); const p = -b / a, v = Math.exp(p);
        return QN("Trouve le zéro de " + M("f(x) = " + a + "\\ln(x)" + sg(b)) + " (valeur exacte).", v,
          M(a + "\\ln(x)" + sg(b) + " = 0 \\iff \\ln(x) = " + fT(p) + " \\iff x = " + eT(p)) + ".",
          { ctx: "zero-ln", canon: eS(p),
            guide: [GS("Que vaut " + M("\\ln(x)") + " ?", p, M(fT(p)) + "."), GS(M("x") + " ?", v, M(eT(p)) + ".")],
            traps: [TR(p, "C'est ln(x) ; applique l'exponentielle pour trouver x."), TR(Math.exp(-p), "Attention au signe : ln(x) = " + fS(p) + "."), TR(Math.exp(-b) / a, "Isole d'abord ln(x) en divisant par " + a + ".")] }); },
      () => { let a, c; do { a = pk([2, 3, 5, -2, -3]); c = pk([3, 4, 6, 5]); } while (Math.abs(a) === c); const b = nz(-9, 9), v = a / c;
        if (R.rand() < 0.5) { const n = pk([2, 3, 5]), mm = pk([2, 4]);
          return QN("Calcule " + M("\\lim_{x \\to +\\infty} \\frac{" + cT(a) + "e^{x}" + sg(b) + "x^{" + n + "}}{" + c + "e^{x} + x^{" + mm + "}}") + ".", v,
            "Croissances comparées : " + M("x^{" + n + "}") + " et " + M("x^{" + mm + "}") + " sont négligeables devant " + M("e^x") + ". On divise par " + M("e^x") + " : " + M("\\frac{" + a + sg(b) + "\\frac{x^{" + n + "}}{e^x}}{" + c + " + \\frac{x^{" + mm + "}}{e^x}} \\to \\frac{" + a + "}{" + c + "} = " + fT(v)) + ".",
            { ctx: "lim-exp-puissance",
              guide: [GS("Limite de " + M("\\frac{x^{" + n + "}}{e^x}") + " en " + M("+\\infty") + " ?", 0, M("0") + " (l'exponentielle l'emporte)."), GS("Limite cherchée ?", v, M(fT(v)) + ".")],
              traps: [TR(0, "Les deux exponentielles se compensent : on divise par eˣ en haut et en bas."), TR(b, "x^" + n + " est négligeable devant eˣ."), TR(c / a, "Numérateur sur dénominateur : " + a + " ÷ " + c + ".")] }); }
        return QN("Calcule " + M("\\lim_{x \\to +\\infty} \\frac{" + cT(a) + "x" + sg(b) + "\\ln(x)}{" + c + "x - \\ln(x)}") + ".", v,
          "Croissances comparées : " + M("\\frac{\\ln x}{x} \\to 0") + ". On divise par " + M("x") + " : " + M("\\frac{" + a + sg(b) + "\\frac{\\ln x}{x}}{" + c + " - \\frac{\\ln x}{x}} \\to \\frac{" + a + "}{" + c + "} = " + fT(v)) + ".",
          { ctx: "lim-ln-x",
            guide: [GS("Limite de " + M("\\frac{\\ln(x)}{x}") + " en " + M("+\\infty") + " ?", 0, M("0") + "."), GS("Limite cherchée ?", v, M(fT(v)) + ".")],
            traps: [TR(0, "On divise par x en haut et en bas : il reste " + a + " ÷ " + c + "."), TR(-b, "ln(x) est négligeable devant x."), TR(c / a, "Numérateur sur dénominateur.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, -2, -3]), p = k - 1, x0 = Math.exp(p), v = -x0;
        return QN("Quelle est la valeur minimale de " + M("f(x) = x\\ln(x)" + sg(-k) + "x") + " sur " + M("]0 \\,;\\, +\\infty[") + " (valeur exacte) ?", v,
          M("f'(x) = \\ln(x) + 1" + sg(-k) + " = \\ln(x)" + sg(1 - k)) + " s'annule en " + M("x = " + eT(p)) + " (− puis +) : " + M("f(" + eT(p) + ") = " + eT(p) + " \\cdot " + par(p) + sg(-k) + "\\cdot " + eT(p) + " = -" + eT(p)) + ".",
          { ctx: "min-xlnx", canon: "-" + eS(p),
            guide: [GX(M("f'(x)") + " ?", "ln(x)" + (1 - k > 0 ? " + " + (1 - k) : " - " + (k - 1)), M("\\ln(x)" + sg(1 - k)) + ".", true), GS("Où " + M("f'") + " s'annule-t-elle ?", x0, M(eT(p)) + "."), GS("Valeur minimale ?", v, M("-" + eT(p)) + ".")],
            traps: [TR(x0, "C'est l'abscisse du minimum ; calcule f(" + eS(p) + ")."), TR(p * x0, "N'oublie pas le terme " + (-k) + "x."), TR(-Math.exp(k), "(x ln x)' = ln(x) + 1 : le zéro de f' est e^(" + p + ").")] }); },
      () => { const b = pk([-4, -3, 1, 2, 3]), x0 = -b - 1;
        return QN("En quelle abscisse " + M("f(x) = (" + lin(1, b) + ")e^{x}") + " atteint-elle son minimum ?", x0,
          M("f'(x) = e^x + (" + lin(1, b) + ")e^x = (" + lin(1, b + 1) + ")e^x") + " ; " + M("e^x > 0") + ", donc " + M("f'") + " a le signe de " + M(lin(1, b + 1)) + " : − puis +, minimum en " + M("x = " + x0) + ".",
          { ctx: "min-affine-exp",
            guide: [GX(M("f'(x)") + " ?", "(" + linS(1, b + 1) + ")*exp(x)", M("(" + lin(1, b + 1) + ")e^x") + "."), GS("Zéro de " + M("f'") + " ?", x0, M(x0) + ".")],
            traps: [TR(-b, "C'est le zéro de f ; l'extremum annule f'."), TR(1 - b, "(uv)' = u'v + uv' : f'(x) = (" + linS(1, b + 1) + ")eˣ."), TR(-Math.exp(x0), "C'est la valeur du minimum ; on demande l'abscisse.")] }); },
      () => { const k = pk([2, 3, 4, 5]), yQ = R.rand() < 0.5, x0 = Math.E / k, y0 = k / Math.E;
        const base = { guide: [GX(M("f'(x)") + " ?", "(1 - ln(" + k + "x))/x^2", M("\\frac{1 - \\ln(" + k + "x)}{x^2}") + ".", true), GS("Où " + M("f'") + " s'annule-t-elle ?", x0, M("\\ln(" + k + "x) = 1 \\iff x = \\frac{e}{" + k + "}") + ".")] };
        const q = "Soit " + M("f(x) = \\frac{\\ln(" + k + "x)}{x}") + " pour " + M("x > 0") + ". ";
        const sol = M("f'(x) = \\frac{1 - \\ln(" + k + "x)}{x^2}") + " s'annule en " + M("x = \\frac{e}{" + k + "}") + " (+ puis −) : maximum " + M("f\\left(\\frac{e}{" + k + "}\\right) = \\frac{1}{e/" + k + "} = \\frac{" + k + "}{e}") + ".";
        if (yQ) return QN(q + "Quelle est sa valeur maximale (valeur exacte) ?", y0, sol,
          { ctx: "max-ln-sur-x", canon: k + "/e", guide: base.guide.concat([GS("Valeur maximale ?", y0, M("\\frac{" + k + "}{e}") + ".")]),
            traps: [TR(x0, "C'est l'abscisse du maximum ; calcule f(e/" + k + ")."), TR(1 / Math.E, "ln(" + k + " · e/" + k + ") = 1, mais on divise par e/" + k + "."), TR(k * Math.E, "1 ÷ (e/" + k + ") = " + k + "/e.")] });
        return QN(q + "En quelle abscisse atteint-elle son maximum (valeur exacte) ?", x0, sol,
          { ctx: "max-ln-sur-x", canon: "e/" + k, guide: base.guide,
            traps: [TR(Math.E, "f'(x) = 0 donne ln(" + k + "x) = 1, soit " + k + "x = e."), TR(y0, "C'est la valeur du maximum ; on demande l'abscisse."), TR(1 / k, "ln(" + k + "x) = 1 (pas 0) : " + k + "x = e.")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, 4, 5]), b = nz(-5, 5), v = a - a * Math.log(a) + b;
        return QN("Quelle est la valeur minimale de " + M("f(x) = e^{x} - " + a + "x" + sg(b)) + " (valeur exacte) ?", v,
          M("f'(x) = e^x - " + a) + " s'annule en " + M("x = \\ln(" + a + ")") + " (− puis +) : " + M("f(\\ln " + a + ") = " + a + " - " + a + "\\ln(" + a + ")" + sg(b)) + ".",
          { ctx: "min-exp-param", canon: (a + b === 0 ? "-" : (a + b) + " - ") + a + "*ln(" + a + ")",
            guide: [GX(M("f'(x)") + " ?", "exp(x) - " + a, M("e^x - " + a) + "."), GS("Abscisse du minimum ?", Math.log(a), M("\\ln(" + a + ")") + "."), GS("Valeur minimale ?", v, M(a + " - " + a + "\\ln(" + a + ")" + sg(b)) + ".")],
            traps: [TR(Math.log(a), "C'est l'abscisse ; on demande f(ln " + a + ")."), TR(a - a * Math.log(a), "N'oublie pas la constante " + b + "."), TR(1 - a * Math.log(a) + b, "e^(ln " + a + ") = " + a + ".")] }); },
      () => { const n = pk([2, 3, 4]), a = pk([1, 2, 3, 6]), g = gcd(a, n), nu = a / g, de = n / g, v = -a / (n * Math.E), x0 = Math.exp(-1 / n);
        const vT = "-\\frac{" + nu + "}{" + (de === 1 ? "" : de) + "e}", vS = "-" + nu + (de === 1 ? "/e" : "/(" + de + "e)");
        return QN("Quelle est la valeur minimale de " + M("f(x) = " + (a === 1 ? "" : a) + "x^{" + n + "}\\ln(x)") + " sur " + M("]0 \\,;\\, +\\infty[") + " (valeur exacte) ?", v,
          M("f'(x) = " + mT(a, n - 1) + "(" + n + "\\ln(x) + 1)") + " s'annule en " + M("x = e^{-\\frac{1}{" + n + "}}") + " (− puis +) ; " + M("x^{" + n + "} = e^{-1}") + " et " + M("\\ln(x) = -\\frac{1}{" + n + "}") + ", donc " + M("f = " + vT) + ".",
          { ctx: "min-xn-ln", canon: vS,
            guide: [GX(M("f'(x)") + " ?", mS(a, n - 1) + "*(" + n + "*ln(x) + 1)", M(mT(a, n - 1) + "(" + n + "\\ln(x) + 1)") + ".", true), GS("Abscisse du minimum ?", x0, M("e^{-\\frac{1}{" + n + "}}") + "."), GS("Valeur minimale ?", v, M(vT) + ".")],
            traps: [TR(x0, "C'est l'abscisse ; calcule f(e^(−1/" + n + "))."), TR(-a / Math.E, "ln(x) = −1/" + n + " : n'oublie pas de diviser par " + n + "."), TR(-a / n, "x^" + n + " = e^(−1), pas 1.")] }); },
      () => { const [p, q] = pk([[1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 1], [-1, -2]]), S = p + q, Pp = p * q;
        const lnT = (S === 1 || S === -1 ? " " + (S === 1 ? "-" : "+") + " \\ln(x)" : sg(-S) + "\\ln(x)");
        return QSet("Résous " + M("(\\ln x)^2" + lnT + sg(Pp) + " = 0") + " (valeurs exactes ; sépare-les par « ; »).", [Math.exp(p), Math.exp(q)],
          "Avec " + M("X = \\ln(x)") + " : " + M("X^2" + (S === 1 ? " - X" : S === -1 ? " + X" : sg(-S) + "X") + sg(Pp) + " = (X" + sg(-p) + ")(X" + sg(-q) + ") = 0") + ", donc " + M("\\ln(x) = " + p) + " ou " + M("\\ln(x) = " + q) + " : " + M("x = " + eT(p)) + " ou " + M("x = " + eT(q)) + ".",
          { ctx: "zero-ln-quadratique",
            guide: [GSet("Avec " + M("X = \\ln(x)") + ", valeurs de " + M("X") + " ?", [p, q], M(p) + " et " + M(q) + "."), GSet("Valeurs de " + M("x") + " ?", [Math.exp(p), Math.exp(q)], M(eT(p)) + " et " + M(eT(q)) + ".")],
            traps: [TSt([p, q], "Ce sont les valeurs de ln(x) : il reste à prendre l'exponentielle."), TSt([10 ** p, 10 ** q], "ln est le logarithme de base e : x = e^X."), TSt([Math.exp(-p), Math.exp(-q)], "Attention aux signes des racines de X² − (somme)X + (produit).")] }); },
    ],
  };

  // ======================= eqdiff : équations différentielles (4.AN.08a–c, 09a–b, renforcé) =======================
  const ED = {
    1: [
      () => { const k = pk([2, 3, -2, -3, 0.5, -0.5]), y0 = pk([2, 3, 4, 5, -2]), kx_ = mS(k, 1), ans = y0 + "*exp(" + kx_ + ")";
        return QX("Donne la solution de " + M("y' = " + cT(k) + "y") + " qui vérifie " + M("y(0) = " + y0) + ".", ans,
          "Les solutions de " + M("y' = ky") + " sont " + M("y = Ce^{kx}") + ". Ici " + M("y = Ce^{" + mT(k, 1) + "}") + " et " + M("y(0) = C = " + y0) + " : " + M("y(x) = " + y0 + "e^{" + mT(k, 1) + "}") + ".",
          { ctx: "y-egal-ky",
            guide: [GX("Solution qui vaut 1 en 0 ?", "exp(" + kx_ + ")", M("e^{" + mT(k, 1) + "}") + "."), GX(M("y(x)") + " avec " + M("y(0) = " + y0) + " ?", ans, M(y0 + "e^{" + mT(k, 1) + "}") + ".")],
            traps: [TX(y0 + "*exp(x)", "Le coefficient " + fS(k) + " va dans l'exposant : e^(" + kx_ + ")."), TX(fS(k) + "*exp(" + y0 + "x)", "C'est y(0) = " + y0 + " qui multiplie, et k = " + fS(k) + " qui va dans l'exposant."), TX(y0 + " + exp(" + kx_ + ")", "La condition initiale multiplie l'exponentielle : y = Ce^(kx).")] }); },
      () => { const [y0, mm] = pk([[3, 2], [4, 3], [5, 2], [2, 5], [6, 0.5], [9, 1 / 3], [8, 0.25]]), t1 = pk([2, 3, 4]), y1 = y0 * mm, v = Math.log(mm) / t1;
        return QN("La fonction " + M("y") + " vérifie " + M("y' = ky") + ", " + M("y(0) = " + y0) + " et " + M("y(" + t1 + ") = " + fT(y1)) + ". Trouve " + M("k") + " (valeur exacte).", v,
          M("y = " + y0 + "e^{kx}") + " ; " + M(y0 + "e^{" + t1 + "k} = " + fT(y1) + " \\iff e^{" + t1 + "k} = " + fT(mm) + " \\iff k = \\frac{\\ln\\left(" + fT(mm) + "\\right)}{" + t1 + "}") + ".",
          { ctx: "trouver-k", canon: "ln(" + fS(mm) + ")/" + t1,
            guide: [GS("Que vaut " + M("e^{" + t1 + "k}") + " ?", mm, M(fT(y1) + " \\div " + y0 + " = " + fT(mm)) + "."), GS(M("k") + " ?", v, M("\\frac{\\ln\\left(" + fT(mm) + "\\right)}{" + t1 + "}") + ".")],
            traps: [TR(mm / t1, "e^(" + t1 + "k) = " + fS(mm) + " : applique ln avant de diviser."), TR(Math.log(mm) * t1, "On divise par " + t1 + "."), TR(Math.log(y1) / t1, "Divise d'abord par y(0) = " + y0 + ".")] }); },
      () => { const a = pk([2, 3, -2, -3, 4]); let m; do m = nz(-6, 6); while (Math.abs(m) === 1 || m === a || m === -a); const v = -a * m;
        return QN("Pour toute constante " + M("C") + ", la fonction " + M("y(x) = Ce^{" + mT(a, 1) + "}" + sg(m)) + " est solution de " + M("y' = " + cT(a) + "y + b") + ". Trouve " + M("b") + ".", v,
          M("y' = " + cT(a) + "Ce^{" + mT(a, 1) + "}") + " et " + M(cT(a) + "y = " + cT(a) + "Ce^{" + mT(a, 1) + "}" + sg(a * m)) + ", donc " + M("b = y' - " + par(a) + "y = " + fT(v)) + ". (La constante " + M(m) + " est la solution d'équilibre : " + M(cT(a) + "\\cdot " + par(m) + " + b = 0") + ".)",
          { ctx: "verifier",
            guide: [GS("La fonction constante " + M("y = " + m) + " est solution (" + M("C = 0") + ") : " + M("y' = 0") + ". Que vaut " + M(par(a) + " \\cdot " + par(m)) + " ?", a * m, M(fT(a * m)) + "."), GS(M("0 = " + fT(a * m) + " + b") + " : " + M("b") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(a * m, "y' − ay = b : b = −a·m (attention au signe)."), TR(m, "b n'est pas la constante " + m + " : remplace y dans l'équation."), TR(-m / a, "On multiplie par a : b = −a·m.")] }); },
    ],
    2: [
      () => { const a = pk([2, -2, 3, -3]); let m, y0; do { m = nz(-5, 5); y0 = nz(-5, 5); } while (Math.abs(m) === 1 || y0 === m || m === a || y0 + m === 0 || y0 === -a * m); const b = -a * m, c = y0 - m;
        const ans = cS(c) + "exp(" + mS(a, 1) + ")" + (m > 0 ? " + " + m : " - " + -m);
        return QX("Donne la solution de " + M("y' = " + cT(a) + "y" + sg(b)) + " qui vérifie " + M("y(0) = " + y0) + ".", ans,
          "Équilibre : " + M("y' = 0 \\iff y = " + m) + ". Les solutions sont " + M("y = Ce^{" + mT(a, 1) + "}" + sg(m)) + " ; " + M("y(0) = C" + sg(m) + " = " + y0) + " donne " + M("C = " + c) + " : " + M("y(x) = " + cT(c) + "e^{" + mT(a, 1) + "}" + sg(m)) + ".",
          { ctx: "ay-plus-b",
            guide: [GS("Solution constante (équilibre) " + M("y = ") + " ?", m, M(cT(a) + "y" + sg(b) + " = 0 \\iff y = " + m) + "."), GS("Constante " + M("C") + " (avec " + M("y(0) = C" + sg(m) + " = " + y0) + ") ?", c, M(c) + "."), GX(M("y(x)") + " ?", ans, M(cT(c) + "e^{" + mT(a, 1) + "}" + sg(m)) + ".")],
            traps: [TX(cS(y0) + "exp(" + mS(a, 1) + ")" + (m > 0 ? " + " + m : " - " + -m), "Avec y(0) = C + " + m + " = " + y0 + ", la constante C vaut " + c + ", pas " + y0 + "."), TX(cS(y0 + m) + "exp(" + mS(a, 1) + ")" + (m > 0 ? " - " + m : " + " + -m), "L'équilibre vaut −b ÷ a = " + m + " (attention au signe)."), TX(cS(y0 - b) + "exp(" + mS(a, 1) + ")" + (b > 0 ? " + " + b : " - " + -b), "La solution constante est −b ÷ a, pas b.")] }); },
      () => { if (R.rand() < 0.5) { const k = pk([0.2, 0.25, 0.4, 0.5, 0.7]), g = 9.8, v = g / k;
          return QN("La vitesse " + M("v") + " (en m/s) d'un parachutiste vérifie " + M("v' = " + dT(g) + " - " + dT(k) + "v") + ". Vers quelle vitesse limite " + M("v(t)") + " tend-elle ?", v,
            "À la limite, la vitesse ne change plus : " + M("v' = 0 \\iff " + dT(k) + "v = " + dT(g) + " \\iff v = " + dT(v)) + " m/s.",
            { ctx: "equilibre", guide: [GS("À la limite, " + M("v' = 0") + ". Que vaut alors " + M(dT(k) + "v") + " ?", g, M(dT(g)) + "."), GS("Vitesse limite ?", v, M(dT(v)) + " m/s.")],
              traps: [TR(k / g, "v = 9,8 ÷ " + dS(k) + ", pas l'inverse."), TR(g * k, "On divise par " + dS(k) + "."), TR(g, "La vitesse limite annule v' = 9,8 − " + dS(k) + "v.")] }); }
        let k, b; do { k = pk([2, 3, 4, 5]); b = pk([3, 5, 7, 9, 10]); } while (b % k === 0); const y0 = nz(-4, 4), v = b / k;
        return QN("La fonction " + M("y") + " vérifie " + M("y' = -" + k + "y + " + b) + " et " + M("y(0) = " + y0) + ". Vers quelle valeur " + M("y(x)") + " tend-elle quand " + M("x \\to +\\infty") + " ?", v,
          M("y = Ce^{-" + k + "x} + \\frac{" + b + "}{" + k + "}") + " et " + M("e^{-" + k + "x} \\to 0") + " : la limite est la solution d'équilibre " + M("\\frac{" + b + "}{" + k + "}") + ", quelle que soit " + M("y(0)") + ".",
          { ctx: "equilibre", guide: [GS("Solution constante : " + M("0 = -" + k + "y + " + b) + ", " + M("y = ") + " ?", v, M("\\frac{" + b + "}{" + k + "}") + "."), GS("Limite ?", v, M(fT(v)) + ".")],
            traps: [TR(k / b, "y = " + b + " ÷ " + k + ", pas l'inverse."), TR(y0, "e^(−" + k + "x) → 0 : la condition initiale s'efface."), TR(-v, "Attention au signe : " + k + "y = " + b + ".")] }); },
      () => { const a = pk([0.5, 1, 2, -1, -0.5, 1.5]), y0 = pk([2, 3, 4, -3]), ax2 = mS(a, 2), ans = y0 + "*exp(" + ax2 + ")", c2 = 2 * a;
        return QX("Résous " + M("y' = " + (c2 === 1 ? "" : c2 === -1 ? "-" : fT(c2)) + "xy") + " avec " + M("y(0) = " + y0) + " (variables séparables).", ans,
          "On sépare : " + M("\\frac{dy}{y} = " + (c2 === 1 ? "" : c2 === -1 ? "-" : fT(c2)) + "x\\,dx") + ", donc " + M("\\ln|y| = " + mT(a, 2) + " + C") + " et " + M("y = Ke^{" + mT(a, 2) + "}") + " ; " + M("y(0) = K = " + y0) + ", donc " + M("y = " + y0 + "e^{" + mT(a, 2) + "}") + ".",
          { ctx: "separable-xy",
            guide: [GX("En intégrant " + M("\\frac{dy}{y} = " + (c2 === 1 ? "" : c2 === -1 ? "-" : fT(c2)) + "x\\,dx") + " : " + M("\\ln|y| = g(x) + C") + ". Que vaut " + M("g(x)") + " ?", ax2, M(mT(a, 2)) + "."), GX(M("y(x)") + " ?", ans, M(y0 + "e^{" + mT(a, 2) + "}") + ".")],
            traps: [TX(y0 + "*exp(" + mS(c2, 1) + ")", "On intègre " + fS(c2) + "x : la primitive est " + ax2 + "."), TX(y0 + "*exp(" + mS(c2, 2) + ")", "Primitive de " + fS(c2) + "x : " + fS(c2) + "x² ÷ 2."), TX("exp(" + ax2 + ")" + (y0 - 1 > 0 ? " + " + (y0 - 1) : " - " + (1 - y0)), "ln|y| = … + C donne y = K·e^(…) : la constante multiplie.")] }); },
    ],
    3: [
      () => { const Ta = pk([18, 20, 22]), D0 = pk([60, 72]), r = pk([2, 3, 4]), t1 = pk([5, 10, 15]), T0 = Ta + D0, T1 = Ta + D0 / r, v = Math.log(r) / t1;
        return QN("Un café refroidit dans une pièce à " + Ta + " °C selon la loi de Newton " + M("T' = -k(T - " + Ta + ")") + " (t en minutes). Il est à " + T0 + " °C au départ et à " + T1 + " °C après " + t1 + " minutes. Trouve " + M("k") + " (valeur exacte).", v,
          M("T - " + Ta + " = " + D0 + "e^{-kt}") + " ; " + M(D0 + "e^{-" + t1 + "k} = " + (D0 / r)) + " donne " + M("e^{" + t1 + "k} = " + r) + ", donc " + M("k = \\frac{\\ln(" + r + ")}{" + t1 + "}") + ".",
          { ctx: "refroidissement", canon: "ln(" + r + ")/" + t1,
            guide: [GS("Écart avec la pièce au départ ?", D0, M(T0 + " - " + Ta + " = " + D0) + "."), GS("Écart après " + t1 + " minutes ?", D0 / r, M(T1 + " - " + Ta + " = " + D0 / r) + "."), GS(M("k") + " ?", v, M("\\frac{\\ln(" + D0 + " \\div " + D0 / r + ")}{" + t1 + "} = \\frac{\\ln(" + r + ")}{" + t1 + "}") + ".")],
            traps: [TR(Math.log(T0 / T1) / t1, "Le café tend vers " + Ta + " °C : on travaille avec l'écart T − " + Ta + "."), TR(Math.log(r), "Divise par la durée, " + t1 + " minutes."), TR((r - 1) / t1, "La décroissance est exponentielle : utilise ln.")] }); },
      () => { const a = pk([1, 2, -1]), y0 = pk([2, 3, 4, -2, -3]), p = a * y0, ans = y0 + "/(" + tp([-p, 1]) + ")";
        return QX("Résous " + M("y' = " + cT(a) + "y^2") + " avec " + M("y(0) = " + y0) + " (variables séparables ; donne " + M("y(x)") + " près de " + M("x = 0") + ").", ans,
          M("\\frac{dy}{y^2} = " + cT(a) + "dx") + " donne " + M("-\\frac{1}{y} = " + mT(a, 1) + " + C") + " ; en " + M("x = 0") + " : " + M("C = " + fT(-1 / y0)) + ". Donc " + M("y = \\frac{-1}{" + mT(a, 1) + sg(-1 / y0) + "} = \\frac{" + y0 + "}{" + P2([-p, 1]) + "}") + ".",
          { ctx: "separable-y2",
            guide: [GS("On intègre : " + M("-\\frac{1}{y} = " + mT(a, 1) + " + C") + ". Que vaut " + M("C") + " ?", -1 / y0, M("-\\frac{1}{y(0)} = " + fT(-1 / y0)) + "."), GX(M("y(x)") + " ?", ans, M("\\frac{" + y0 + "}{" + P2([-p, 1]) + "}") + ".")],
            traps: [TX(y0 + "*exp(" + mS(a, 1) + ")", "y' = ay² n'est pas linéaire : sépare dy/y² = a dx."), TX(y0 + "/(" + tp([p, 1]) + ")", "Primitive de 1/y² : −1/y (attention au signe)."), TX("1/(" + tp([-a, 1]) + ")", "La condition y(0) = " + y0 + " fixe la constante.")] }); },
      () => { const k = pk([0.2, 0.4, 0.5]), t = pk([2, 3, 5]), g = 9.8, L = g / k, v = L * (1 - Math.exp(-k * t));
        return QR("Une bille tombe dans l'huile avec " + M("v' = " + dT(g) + " - " + dT(k) + "v") + " et " + M("v(0) = 0") + " (" + M("v") + " en m/s, " + M("t") + " en s). Calcule " + M("v(" + t + ")") + " (au dixième).", v, 0.1,
          "Équilibre " + M("v = \\frac{" + dT(g) + "}{" + dT(k) + "} = " + dT(L)) + " ; " + M("v(t) = " + dT(L) + "\\left(1 - e^{-" + dT(k) + "t}\\right)") + " ; " + M("v(" + t + ") = " + dT(L) + "\\left(1 - e^{-" + dT(k * t) + "}\\right) \\approx " + dT(rd(v, 0.1))) + " m/s.",
          { ctx: "chute",
            guide: [GS("Vitesse limite (équilibre) ?", L, M(dT(L)) + "."), GS(M("v(" + t + ")") + " (au dixième) ?", v, M(dT(L) + "\\left(1 - e^{-" + dT(k * t) + "}\\right) \\approx " + dT(rd(v, 0.1))) + ".", 0.1)],
            traps: [TR(g * t, "Sans frottement on aurait 9,8t ; ici v' dépend de v."), TR(L, "C'est la vitesse limite, atteinte seulement quand t → +∞."), TR(L * Math.exp(-k * t), "v(0) = 0 : v(t) = " + dS(L) + "(1 − e^(−" + dS(k) + "t)).")] }); },
    ],
  };
  /* 25.11 (agent trous) : y' = ay + f(x) avec un second membre qui n'est pas constant (4.AN.08a, « vérifier » ; programme
     français Tle.AN.21 : « à partir d'une solution particulière, déterminer toutes les solutions »). */
  ED[2].push(() => { const a = pk([2, -2, 3, -3, 1, -1]), m = nz(-4, 4), q = nz(-5, 5); let y0; do y0 = nz(-6, 6); while (y0 === q); const C = y0 - q, c1 = -a * m, c0 = m - a * q;
    if (!c0) return null;
    const pT = P2([m, q]), pS = tp([m, q]), ans = cS(C) + "exp(" + mS(a, 1) + ") + (" + pS + ")";
    return QX("On considère l'équation " + M("y' = " + cT(a) + "y + f(x)") + " avec " + M("f(x) = " + P2([c1, c0])) + ". La fonction " + M("p(x) = " + pT) + " en est une solution particulière. Donne la solution qui vérifie " + M("y(0) = " + y0) + ".", ans,
      "Les solutions de " + M("y' = " + cT(a) + "y") + " sont " + M("Ce^{" + mT(a, 1) + "}") + " ; celles de l'équation complète : " + M("y = Ce^{" + mT(a, 1) + "} + " + pT) + ". " + M("y(0) = C" + sg(q) + " = " + y0) + " donne " + M("C = " + C) + " : " + M("y(x) = " + cT(C) + "e^{" + mT(a, 1) + "} + " + pT) + ".",
      { ctx: "ay-plus-f-donnee",
        guide: [GS(M("p(0)") + " ?", q, M(q) + "."), GS("Constante " + M("C") + " (avec " + M("y(0) = C + p(0) = " + y0) + ") ?", C, M(C) + "."), GX(M("y(x)") + " ?", ans, M(cT(C) + "e^{" + mT(a, 1) + "} + " + pT) + ".")],
        traps: [TX(cS(y0) + "exp(" + mS(a, 1) + ") + (" + pS + ")", "y(0) = C + p(0) : C vaut " + y0 + " − (" + q + "), pas " + y0 + "."), TX(cS(y0) + "exp(" + mS(a, 1) + ")", "Il manque la solution particulière : y = Ce^(ax) + p(x)."), TX(cS(C) + "exp(" + mS(-a, 1) + ") + (" + pS + ")", "Les solutions de y' = ay sont Ce^(ax), avec le même signe que a.")] }); });
  ED[3].push(() => { const a = pk([2, -2, 3, -3, 4, -1]), m = nz(-3, 3), q = nz(-4, 4), c = -a * m, d = m - a * q, ans = tp([m, q]);
    return QX("Trouve la solution particulière de la forme " + M("p(x) = mx + q") + " de l'équation " + M("y' = " + cT(a) + "y + g(x)") + " avec " + M("g(x) = " + P2([c, d])) + ". Donne " + M("p(x)") + ".", ans,
      M("p' = m") + " et " + M(cT(a) + "p + g(x) = " + cT(a) + "(mx + q) + " + (c < 0 ? "(" + P2([c, d]) + ")" : P2([c, d]))) + " : on identifie. Coefficient de " + M("x") + " : " + M("0 = " + fT(a) + "m" + sg(c)) + ", donc " + M("m = " + m) + " ; constante : " + M("m = " + fT(a) + "q" + (d ? sg(d) : "")) + ", donc " + M("q = " + q) + ". " + M("p(x) = " + P2([m, q])) + ".",
      { ctx: "ay-plus-f-affine",
        guide: [GS("Coefficient de " + M("x") + " : " + M("0 = " + fT(a) + "m" + sg(c)) + ". Que vaut " + M("m") + " ?", m, M(m) + "."), GS("Constante : " + M("m = " + fT(a) + "q" + (d ? sg(d) : "")) + ". Que vaut " + M("q") + " ?", q, M(q) + "."), GX(M("p(x)") + " ?", ans, M(P2([m, q])) + ".")],
        traps: [TX(tp([c, d || 0]), "p n'est pas le second membre : remplace y par mx + q dans l'équation et identifie."), TX(tp([-m, q]), "0 = am + c : attention au signe de m."), TX(tp([m, -q]), "Constante : m = aq + d, attention au signe de q.")] }); });
  ED[3].push(() => { const a = pk([1, 2, -1, -2, 3]); let b; do b = pk([1, 2, 3, -1, -2]); while (b === a); const k = pk([2, 3, 4, -2, -3, -4]), c = k * (b - a);
    return QN("On cherche une solution particulière de la forme " + M("p(x) = ke^{" + mT(b, 1) + "}") + " de l'équation " + M("y' = " + cT(a) + "y" + (c < 0 ? " - " + cT(-c) : " + " + cT(c)) + "e^{" + mT(b, 1) + "}") + ". Que vaut " + M("k") + " ?", k,
      M("p' = " + cT(b) + "ke^{" + mT(b, 1) + "}") + ". En remplaçant : " + M(cT(b) + "k = " + cT(a) + "k" + sg(c)) + ", donc " + M("(" + fT(b) + sg(-a) + ")k = " + c) + " et " + M("k = " + k) + ".",
      { ctx: "ay-plus-f-exp",
        guide: [GS("En remplaçant, " + M("(b - a)k") + " vaut le coefficient du second membre. Que vaut " + M("b - a") + " ?", b - a, M(fT(b) + sg(-a) + " = " + (b - a)) + "."), GS(M("k") + " ?", k, M("\\frac{" + c + "}{" + (b - a) + "} = " + k) + ".")],
        traps: [TR(c / b, "La dérivée de ke^(" + b + "x) est " + b + "ke^(" + b + "x) ; il faut aussi retirer le terme " + a + "k."), TR(-k, "(b − a)k = c : attention à l'ordre de la soustraction."), TR(c, "c est le coefficient du second membre ; divise par b − a.")] }); });

  // ======================= statdesc : statistique descriptive de 4e (4.PS.01a–d) =======================
  /* 25.11 (audit niveau 4e) : « stats » et « quartiles » (moyenne de 5 nombres, mode, étendue…) avaient été ouverts à la
     4e le 24.11 ; c'est le niveau du CO. Ils restent pour la MP et la France ; la 4e reçoit cette notion : séries en
     classes, écart-type, moyenne des carrés, transformation affine, médiane par interpolation, regroupement de séries. */
  /* [début de la phrase, individus, en-tête, largeurs possibles, premières bornes possibles] : valeurs réalistes */
  const SDC = [["le temps de trajet (en minutes) de", "élèves", "temps (min)", [5, 10], [5, 10, 15]], ["la masse (en g) de", "pommes", "masse (g)", [10, 20], [100, 120, 140]], ["la taille (en cm) de", "plants de tournesol", "taille (cm)", [20, 25], [100, 125, 150]], ["la durée (en minutes) de", "appels téléphoniques", "durée (min)", [2, 4], [0, 2, 4]]];
  const sdClasses = () => { const c0 = pk(SDC), w = pk(c0[3]), a0 = pk(c0[4]), ns = [R.int(2, 9), R.int(5, 14), R.int(4, 12), R.int(1, 7)], c = c0;
    const lo = ns.map((_, i) => a0 + i * w), ce = lo.map((a) => a + w / 2), N = ns.reduce((s, x) => s + x, 0), S = ce.reduce((s, x, i) => s + x * ns[i], 0), m = S / N;
    const S2 = ce.reduce((s, x, i) => s + ns[i] * (x - m) ** 2, 0), sd = Math.sqrt(S2 / N);
    /* 25.11 (tableau de 381 px sur téléphone, 394 px même en \\small) : tableau transposé, une classe par ligne. */
    const tab = "<br>" + M("\\begin{array}{c|c} \\text{" + c[2] + "} & \\text{effectif} \\\\ \\hline " + lo.map((a, i) => "[" + a + " \\,;\\, " + (a + w) + "[ & " + ns[i]).join(" \\\\ ") + " \\end{array}") + "<br>";
    return { w, lo, ce, ns, N, S, m, sd, c, tab }; };
  const SD = {
    1: [
      () => { const o = sdClasses(), v = o.m;
        return chk(QR("On a relevé " + o.c[0] + " " + o.N + " " + o.c[1] + " : " + o.tab + " Calcule la moyenne de la série (avec les centres des classes, " + RND[0.01] + ").", v, 0.01,
          "Centres : " + M(o.ce.map(nb).join(" ; ")) + ". " + M("\\bar x = \\frac{" + o.ce.map((x, i) => nb(x) + " \\cdot " + o.ns[i]).join(" + ") + "}{" + o.N + "} = \\frac{" + nb(o.S) + "}{" + o.N + "} \\approx " + dT(v, 2)) + ".",
          { ctx: "moyenne-classes", guide: [GS("Somme des produits centre × effectif ?", o.S, M(nb(o.S)) + "."), GS("Effectif total ?", o.N, M(o.N) + "."), GS("Moyenne (" + RND[0.01] + ") ?", v, M("\\approx " + dT(v, 2)) + ".", 0.01)],
            traps: [TR(o.ce.reduce((s, x) => s + x, 0) / 4, "Chaque centre compte autant de fois que l'effectif de sa classe : moyenne pondérée."), TR(v - o.w / 2, "On prend le centre de chaque classe, pas sa borne inférieure."), TR(o.S / 4, "On divise par l'effectif total " + o.N + ", pas par le nombre de classes.")] })); },
      () => { const c = pk([["Nombre de buts marqués par match", "buts", 0, 1, 3], ["Nombre de frères et sœurs des élèves d'une classe", "nombre", 0, 1, 3], ["Points obtenus à un test sur 20", "points", 6, 3, 6]]); let xs, ns, N, m, sd; do { const x0 = c[2] + R.int(0, 2); xs = [x0, x0 + R.int(1, c[3]), x0 + c[3] + R.int(1, c[4])]; ns = [R.int(1, 6), R.int(2, 8), R.int(1, 6)]; N = ns[0] + ns[1] + ns[2]; m = (xs[0] * ns[0] + xs[1] * ns[1] + xs[2] * ns[2]) / N; sd = Math.sqrt(xs.reduce((s, x, i) => s + ns[i] * (x - m) ** 2, 0) / N); } while (den(m) > 20 || den(m) === 0);
        const V = sd * sd;
        return chk(QR(c[0] + " : " + M("\\begin{array}{c|ccc} \\text{" + c[1] + "} & " + xs.join(" & ") + " \\\\ \\hline \\text{effectif} & " + ns.join(" & ") + " \\end{array}") + " Calcule l'écart-type " + M("\\sigma") + " de cette série (" + RND[0.01] + ").", sd, 0.01,
          M("\\bar x = " + fT(m)) + " ; " + M("\\sigma^2 = \\frac{1}{" + N + "}\\sum n_i (x_i - \\bar x)^2 \\approx " + dT(V, 4)) + ", " + M("\\sigma \\approx " + dT(sd, 2)) + ".",
          { ctx: "ecart-type-" + c[1], guide: [GS("Moyenne " + M("\\bar x") + " ?", m, M(fT(m)) + "."), GS("Variance " + M("\\sigma^2") + " (" + RND[0.0001] + ") ?", V, M("\\approx " + dT(V, 4)) + ".", 0.0001), GS(M("\\sigma") + " (" + RND[0.01] + ") ?", sd, M("\\approx " + dT(sd, 2)) + ".", 0.01)],
            traps: [TR(V, "C'est la variance σ² : prends la racine."), TR(Math.sqrt(V * N / (N - 1)), "Pour une série statistique, on divise par l'effectif N = " + N + " (pas N − 1)."), TR(Math.sqrt(xs.reduce((s, x) => s + (x - (xs[0] + xs[1] + xs[2]) / 3) ** 2, 0) / 3), "Chaque valeur compte autant de fois que son effectif.")] })); },
      () => { const m = R.int(12, 60), s = R.int(2, 9), q = s * s + m * m, c = pk(["Une série de notes de concours", "Une série de masses (en g)", "Une série de températures (en °C)"]), ask = pk(["s", "V"]), v = ask === "s" ? s : s * s;
        return chk(QN(c + " a pour moyenne " + M("\\bar x = " + m) + " ; la moyenne des carrés des valeurs vaut " + M("\\overline{x^2} = " + nb(q)) + ". Calcule " + (ask === "s" ? "son écart-type " + M("\\sigma") : "sa variance " + M("\\sigma^2")) + ".", v,
          "Formule de König : " + M("\\sigma^2 = \\overline{x^2} - \\bar x^2 = " + nb(q) + " - " + nb(m * m) + " = " + s * s) + (ask === "s" ? ", donc " + M("\\sigma = " + s) : "") + ".",
          { ctx: "konig-" + ask, guide: [GS(M("\\bar x^2") + " ?", m * m, M(nb(m * m)) + "."), GS(M("\\sigma^2 = \\overline{x^2} - \\bar x^2") + " ?", s * s, M(s * s) + ".")].concat(ask === "s" ? [GS(M("\\sigma") + " ?", s, M(s) + ".")] : []),
            traps: [TR(ask === "s" ? s * s : s, ask === "s" ? "C'est la variance : prends la racine." : "C'est l'écart-type ; on demande la variance."), TR(Math.sqrt(q) - m, "On soustrait les carrés : σ² = moyenne des carrés − carré de la moyenne."), TR(q - m, "Il faut le carré de la moyenne : " + m + "² = " + m * m + ".")] })); },
    ],
    2: [
      () => { const c = pk([["températures relevées à midi", "°C", "en °F", 1.8, 32, "On les convertit en degrés Fahrenheit : F = 1,8 C + 32."], ["salaires mensuels d'un atelier", "CHF", "en CHF", 1.02, 150, "Chaque salaire est augmenté de 2 %, puis d'une prime de 150 CHF."], ["résultats sur 50 points d'un test", "points", "sur l'échelle de 1 à 6", 0.1, 1, "On les convertit en notes de 1 à 6 : n = 0,1 · p + 1."]]);
        const m = c[1] === "CHF" ? R.int(45, 70) * 100 : c[1] === "°C" ? R.int(12, 28) : R.int(30, 45), s = c[1] === "CHF" ? R.int(3, 9) * 100 : c[1] === "°C" ? pk([2.5, 3, 3.5, 4, 4.5]) : R.int(5, 12), ask = pk(["m", "s"]);
        const v = ask === "m" ? r6(c[3] * m + c[4]) : r6(Math.abs(c[3]) * s);
        return chk(QN("Les " + c[0] + " ont pour moyenne " + M(nb(m)) + " " + c[1] + " et pour écart-type " + M(nb(s)) + " " + c[1] + ". " + c[5] + " " + (ask === "m" ? "Quelle est la nouvelle moyenne" : "Quel est le nouvel écart-type") + " (" + c[2] + ") ?", v,
          "Pour " + M("y = ax + b") + " : " + M("\\bar y = a\\bar x + b") + " et " + M("\\sigma_y = |a|\\,\\sigma_x") + " (ajouter " + M("b") + " décale tout, sans changer la dispersion). " + (ask === "m" ? M("\\bar y = " + nb(c[3]) + " \\cdot " + nb(m) + " + " + c[4] + " = " + nb(v)) : M("\\sigma_y = " + nb(c[3]) + " \\cdot " + nb(s) + " = " + nb(v))) + ".",
          { ctx: "affine-" + ask + "-" + c[1], guide: [GS("Coefficient " + M("a") + " de la transformation ?", c[3], M(nb(c[3])) + "."), GS(ask === "m" ? "Nouvelle moyenne ?" : "Nouvel écart-type ?", v, M(nb(v)) + ".")],
            traps: ask === "m" ? [TR(r6(c[3] * m), "On ajoute aussi " + c[4] + " à la moyenne."), TR(r6(m + c[4]), "On multiplie aussi par " + dS(c[3]) + ".")] : [TR(r6(c[3] * s + c[4]), "Ajouter une constante ne change pas l'écart-type."), TR(s, "Multiplier par " + dS(c[3]) + " multiplie l'écart-type."), TR(r6(c[3] * c[3] * s), "C'est la variance qui est multipliée par a² ; l'écart-type, par |a|.")] })); },
      () => { let xs, ns, k, m; for (let t = 0; t < 40; t++) { const x0 = R.int(1, 5); xs = [x0, x0 + R.int(1, 3), x0 + R.int(4, 7)]; ns = [R.int(3, 12), R.int(3, 12)]; k = R.int(2, 15); const N = ns[0] + ns[1] + k; m = (xs[0] * ns[0] + xs[1] * ns[1] + xs[2] * k) / N; if ([1, 2, 4, 5, 10, 20, 25].includes(den(m)) && k !== ns[0] && k !== ns[1]) break; m = null; }
        if (m === null) return null; const S12 = xs[0] * ns[0] + xs[1] * ns[1];
        return chk(QN("Notes d'une classe à un quiz (nombre de bonnes réponses) : " + M("\\begin{array}{c|ccc} \\text{note} & " + xs.join(" & ") + " \\\\ \\hline \\text{effectif} & " + ns[0] + " & " + ns[1] + " & k \\end{array}") + " La moyenne vaut " + M(nb(m)) + ". Que vaut l'effectif " + M("k") + " ?", k,
          M("\\frac{" + S12 + " + " + xs[2] + "k}{" + (ns[0] + ns[1]) + " + k} = " + nb(m)) + " ⟺ " + M(S12 + " + " + xs[2] + "k = " + nb(r6(m * (ns[0] + ns[1]))) + " + " + nb(m) + "k") + " ⟺ " + M(nb(r6(xs[2] - m)) + "k = " + nb(r6(m * (ns[0] + ns[1]) - S12))) + ", donc " + M("k = " + k) + ".",
          { ctx: "effectif-inconnu", guide: [GS("Somme des notes des deux premières colonnes ?", S12, M(S12) + "."), GS("Coefficient de " + M("k") + " après regroupement (" + M(xs[2] + " - " + nb(m)) + ") ?", r6(xs[2] - m), M(nb(r6(xs[2] - m))) + "."), GS(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(Math.round((m * (ns[0] + ns[1] + 1) - S12) / xs[2]), "L'effectif total contient aussi k : N = " + (ns[0] + ns[1]) + " + k."), TR(r6((m * (ns[0] + ns[1]) - S12) / xs[2]), "Développe m(" + (ns[0] + ns[1]) + " + k) : le terme " + dS(m) + "k passe à gauche.")] })); },
      () => { let o, half, i, F; for (let t = 0; t < 30; t++) { o = sdClasses(); if (o.N % 2) continue; half = o.N / 2; F = 0; i = 0; while (F + o.ns[i] < half) { F += o.ns[i]; i++; } if (F + o.ns[i] > half && F < half) break; o = null; }
        if (!o) return null; const L = o.lo[i], v = L + ((half - F) / o.ns[i]) * o.w;
        return chk(QR("On a relevé " + o.c[0] + " " + o.N + " " + o.c[1] + " : " + o.tab + " Estime la médiane par interpolation linéaire dans la classe médiane (" + RND[0.01] + ").", v, 0.01,
          "Effectifs cumulés : " + M(o.ns.map((_, j) => o.ns.slice(0, j + 1).reduce((s, x) => s + x, 0)).join(" ; ")) + ". La " + M(half) + "e valeur est dans " + M("[" + L + " \\,;\\, " + (L + o.w) + "[") + " ; " + M(F) + " valeurs avant. " + M("Me \\approx " + L + " + \\frac{" + half + " - " + F + "}{" + o.ns[i] + "} \\cdot " + o.w + " \\approx " + dT(v, 2)) + ".",
          { ctx: "mediane-classes", guide: [GS("Borne inférieure de la classe médiane ?", L, M(L) + "."), GS("Effectif cumulé avant cette classe ?", F, M(F) + "."), GS("Médiane (" + RND[0.01] + ") ?", v, M("\\approx " + dT(v, 2)) + ".", 0.01)],
            traps: [TR(L + o.w / 2, "Le centre de la classe médiane est une première idée ; l'interpolation est plus précise."), TR(L, "Il faut avancer dans la classe proportionnellement à (N/2 − " + F + ")."), TR(o.m, "C'est la moyenne, pas la médiane.")] })); },
    ],
    3: [
      () => { const n = pk([9, 11, 14, 19, 24]), m = R.int(20, 40), s = R.int(3, 8), vv = m + pk([-1, 1]) * R.int(s + 2, 3 * s), q = s * s + m * m, m2 = (n * m + vv) / (n + 1), q2 = (n * q + vv * vv) / (n + 1), v = Math.sqrt(q2 - m2 * m2);
        return chk(QR("Une série de " + n + " valeurs a pour moyenne " + M(m) + " et pour écart-type " + M(s) + ". On ajoute la valeur " + M(vv) + ". Quel est le nouvel écart-type (" + RND[0.01] + ") ?", v, 0.01,
          "Moyenne des carrés : " + M("\\overline{x^2} = \\sigma^2 + \\bar x^2 = " + nb(q)) + ". Après l'ajout : " + M("\\bar x' = \\frac{" + n + " \\cdot " + m + " + " + vv + "}{" + (n + 1) + "} \\approx " + dT(m2, 4)) + ", " + M("\\overline{x^2}' = \\frac{" + n + " \\cdot " + nb(q) + " + " + nb(vv * vv) + "}{" + (n + 1) + "} \\approx " + dT(q2, 4)) + ", " + M("\\sigma' = \\sqrt{\\overline{x^2}' - \\bar x'^2} \\approx " + dT(v, 2)) + ".",
          { ctx: "ajout-valeur", guide: [GS("Moyenne des carrés de la série initiale ?", q, M(nb(q)) + "."), GS("Nouvelle moyenne (" + RND[0.0001] + ") ?", m2, M("\\approx " + dT(m2, 4)) + ".", 0.0001), GS("Nouvel écart-type (" + RND[0.01] + ") ?", v, M("\\approx " + dT(v, 2)) + ".", 0.01)],
            traps: [TR(s, "La valeur ajoutée est loin de la moyenne : l'écart-type change."), TR(Math.sqrt((n * s * s + (vv - m) ** 2) / (n + 1)), "La moyenne a changé aussi : passe par la moyenne des carrés."), TR((n * s + Math.abs(vv - m)) / (n + 1), "On ne fait pas la moyenne des écarts : on regroupe les carrés.")] })); },
      () => { const n1 = R.int(12, 25), n2 = R.int(12, 25), m1 = R.int(40, 55), m2 = m1 + pk([-1, 1]) * R.int(4, 12), s1 = R.int(3, 8), s2 = R.int(3, 8), N = n1 + n2, mg = (n1 * m1 + n2 * m2) / N, qg = (n1 * (s1 * s1 + m1 * m1) + n2 * (s2 * s2 + m2 * m2)) / N, v = Math.sqrt(qg - mg * mg);
        return chk(QR("Deux classes passent le même test. Classe A : " + n1 + " élèves, moyenne " + M(m1) + ", écart-type " + M(s1) + ". Classe B : " + n2 + " élèves, moyenne " + M(m2) + ", écart-type " + M(s2) + ". Quel est l'écart-type de l'ensemble des " + N + " élèves (" + RND[0.01] + ") ?", v, 0.01,
          M("\\bar x = \\frac{" + n1 + " \\cdot " + m1 + " + " + n2 + " \\cdot " + m2 + "}{" + N + "} \\approx " + dT(mg, 4)) + ". Moyenne des carrés : " + M("\\frac{" + n1 + "(" + s1 * s1 + " + " + m1 * m1 + ") + " + n2 + "(" + s2 * s2 + " + " + m2 * m2 + ")}{" + N + "} \\approx " + dT(qg, 4)) + ". " + M("\\sigma = \\sqrt{" + dT(qg, 4) + " - " + dT(mg, 4) + "^2} \\approx " + dT(v, 2)) + ".",
          { ctx: "deux-groupes", guide: [GS("Moyenne de l'ensemble (" + RND[0.0001] + ") ?", mg, M("\\approx " + dT(mg, 4)) + ".", 0.0001), GS("Moyenne des carrés de l'ensemble (" + RND[0.0001] + ") ?", qg, M("\\approx " + dT(qg, 4)) + ".", 0.0001), GS("Écart-type (" + RND[0.01] + ") ?", v, M("\\approx " + dT(v, 2)) + ".", 0.01)],
            traps: [TR((n1 * s1 + n2 * s2) / N, "On ne fait pas la moyenne des écarts-types : l'écart entre les deux moyennes ajoute de la dispersion."), TR(Math.sqrt((n1 * s1 * s1 + n2 * s2 * s2) / N), "Il manque la dispersion entre les groupes (les moyennes " + m1 + " et " + m2 + " diffèrent)."), TR((s1 + s2) / 2, "Les effectifs et l'écart entre les moyennes comptent.")] })); },
      () => { const muA = R.int(40, 60), sA = R.int(4, 8), xA = muA + pk([-1, 1]) * R.int(1, 2 * sA), muB = R.int(60, 80), sB = pk([6, 9, 10, 12, 15].filter((x) => x !== sA)), z = (xA - muA) / sA, v = muB + sB * z, nmA = pk(["Léa", "Noé", "Inès"]);
        if (Math.abs(z) < 0.2) return null;
        /* 27.11 (recalcul, agent recalc34) : v tombait parfois pile entre deux dixièmes (72 − 1,25 · 15 = 53,25) et 53,2 était aussi
           accepté : réponse attendue = l'arrondi au dixième (demi vers le haut, comme le corrigé). */
        const v1 = Math.round(+(v * 10).toFixed(6)) / 10;
        return chk(QR(nmA + " obtient " + M(xA) + " points à un test A (moyenne " + M(muA) + ", écart-type " + M(sA) + "). Quel score au test B (moyenne " + M(muB) + ", écart-type " + M(sB) + ") correspond à la même position par rapport aux autres candidats, c'est-à-dire à la même valeur centrée réduite (" + RND[0.1] + ") ?", v1, 0.1,
          M("z = \\frac{" + xA + " - " + muA + "}{" + sA + "} = " + fT(z)) + " ; au test B : " + M(muB + " + " + fT(z) + " \\cdot " + sB + " \\approx " + dT(v, 1)) + " points.",
          { ctx: "centree-reduite", guide: [GS("Valeur centrée réduite " + M("z") + " au test A ?", z, M(fT(z)) + "."), GS("Score équivalent au test B (" + RND[0.1] + ") ?", v1, M("\\approx " + dT(v, 1)) + ".", 0.1)],
            traps: [TR(xA + muB - muA, "Il faut aussi tenir compte de la dispersion : z = (x − μ) ÷ σ."), TR((muB * xA) / muA, "Ce n'est pas une proportion : on garde le même nombre d'écarts-types."), TR(z, "C'est la valeur centrée réduite z ; convertis-la en score du test B.")] })); },
    ],
  };

  // ---------- problèmes en plusieurs étapes (niveau 4) ----------
  // ======================= 25.11 (agent col34) : bayes, syslin, bases (MA1 + MA2) ; complexes, suites et séries (MA2) =======================
  // bayes (4.PS.02d) complète condbayes (conditionnelles, totales, indépendance) ; syslin (4.GV.02e) et bases (4.GV.03a–d)
  // complètent matrices et appllin ; cplxalg, cplxtrig, cplxeq (4.NC.01–04) et suitegeom, serie (4.AN.10–11) : niv "R".
  const pct = (v, k = 2) => dT(r6(v * 100), k) + "\\,\\%";
  /* combinaison linéaire en TeX et au clavier : [2, -1] et ["x", "y"] → « 2x - y » */
  const lc = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), t = (vs[i] && a === 1 ? "" : fT(a)) + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };
  const sysT = (rows, vs) => M("\\begin{cases} " + rows.map((r) => lc(r.slice(0, -1), vs) + " = " + fT(r[r.length - 1])).join(" \\\\ ") + " \\end{cases}");
  const v2 = (u) => "\\begin{pmatrix} " + u.map(fT).join(" \\\\ ") + " \\end{pmatrix}";
  const crs = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const dt3 = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
  const m3 = (R3) => "\\begin{pmatrix} " + R3.map((r) => r.map(fT).join(" & ")).join(" \\\\ ") + " \\end{pmatrix}";
  const lin3 = (al, U) => U[0].map((_, k) => al.reduce((s, a, j) => s + a * U[j][k], 0));
  const TRI3 = " Réponds « x ; y ; z ».";

  // ======================= bayes : théorème de Bayes (4.PS.02d) =======================
  const BAY_ARBRE = [["Il pleut un jour donné avec la probabilité", "pluie", "l'application météo annonce la pluie", "l'application annonce la pluie", "qu'il pleuve vraiment", "meteo"],
    ["Un message reçu est un pourriel avec la probabilité", "pourriel", "le filtre le bloque", "le filtre bloque un message", "que ce soit un pourriel", "filtre"],
    ["Un athlète est dopé avec la probabilité", "dopé", "le contrôle est positif", "le contrôle d'un athlète est positif", "qu'il soit dopé", "dopage"],
    ["Un randonneur part sur une pente dangereuse avec la probabilité", "pente dangereuse", "son détecteur sonne", "le détecteur sonne", "que la pente soit dangereuse", "avalanche"]];
  const BY = {
    1: [
      () => { const pa = pk([0.2, 0.3, 0.4, 0.6]), q1 = pk([0.5, 0.7, 0.8, 0.9]), q2 = pk([0.1, 0.2, 0.3]), pb = r6(pa * q1 + (1 - pa) * q2), v = (pa * q1) / pb;
        return QR("On sait que " + M("P(A) = " + dT(pa)) + ", " + M("P_A(B) = " + dT(q1)) + " et " + M("P(B) = " + dT(pb)) + ". Calcule " + M("P_B(A)") + " (" + RND[0.01] + ").", v, 0.01,
          "Bayes : " + M("P_B(A) = \\frac{P(A) \\cdot P_A(B)}{P(B)} = \\frac{" + dT(pa) + " \\cdot " + dT(q1) + "}{" + dT(pb) + "} = \\frac{" + dT(r6(pa * q1)) + "}{" + dT(pb) + "} \\approx " + dT(rd(v, 0.01))) + ".",
          { ctx: "formule", guide: [GS(M("P(A \\cap B) = P(A) \\cdot P_A(B)") + " ?", r6(pa * q1), M(dT(r6(pa * q1))) + "."), GS(M("P_B(A) = \\frac{P(A \\cap B)}{P(B)}") + " (" + RND[0.01] + ") ?", v, M("\\approx " + dT(rd(v, 0.01))) + ".", 0.01)],
            traps: [TR(q1, "C'est P_A(B) : on demande la condition inverse, A sachant B."), TR(r6(pa * q1), "C'est P(A ∩ B) ; divise encore par P(B)."), TR(r6(pa * pb / q1), "Bayes : P(A)·P_A(B) ÷ P(B).")] }); },
      () => { const c = pk([["un test rapide", "Malade", "Sain", "Positif", "Négatif", "le test est positif", "que la personne soit malade", "test"],
          ["un filtre à pourriels", "Pourriel", "Normal", "Bloqué", "Accepté", "le message est bloqué", "que ce soit un pourriel", "pourriel"],
          ["un détecteur de métaux à l'entrée d'un stade", "Objet interdit", "Rien", "Sonne", "Ne sonne pas", "le détecteur sonne", "que la personne porte un objet interdit", "stade"]]);
        const a = R.int(12, 45), b = R.int(2, 9), cc = R.int(15, 60), d = R.int(150, 400);
        const tab = M("\\begin{array}{l|c|c} & \\text{" + c[3] + "} & \\text{" + c[4] + "} \\\\ \\hline \\text{" + c[1] + "} & " + a + " & " + b + " \\\\ \\text{" + c[2] + "} & " + cc + " & " + d + " \\end{array}"), v = a / (a + cc);
        return QN("Résultats d'" + c[0] + " sur " + (a + b + cc + d) + " cas :<br>" + tab + "<br>On sait que " + c[5] + ". Quelle est la probabilité " + c[6] + " ? (fraction acceptée)", v,
          "Sachant que " + c[5] + ", on se place dans la colonne " + M("\\text{" + c[3] + "}") + " : " + M(a + cc) + " cas, dont " + M(a) + " favorables : " + M("\\frac{" + a + "}{" + (a + cc) + "}" + (den(v) < a + cc ? " = " + fT(v) : "")) + ". Ce n'est pas " + M("\\frac{" + a + "}{" + (a + b) + "}") + ", la probabilité dans l'autre sens.",
          { ctx: "tableau-" + c[7], guide: [GS("Nombre de cas dans la colonne « " + c[3] + " » ?", a + cc, M(a + cc) + "."), GS("Probabilité cherchée ?", v, M(fT(v)) + ".")],
            traps: [TR(a / (a + b), "C'est la probabilité dans l'autre sens (" + c[3].toLowerCase() + " sachant " + c[1].toLowerCase() + ") : on se place dans la colonne."), TR(a / (a + b + cc + d), "On sait déjà dans quelle colonne on est : divise par son total."), TR(cc / (a + cc), "Tu as compté l'autre ligne.")] }); },
      () => { const c = pk(BAY_ARBRE), p = pk([0.1, 0.2, 0.25, 0.3]), q1 = pk([0.8, 0.85, 0.9, 0.95]), q2 = pk([0.05, 0.1, 0.15, 0.2]), a = r6(p * q1), b = r6((1 - p) * q2), v = a / (a + b);
        return QR(c[0] + " " + M(dT(p)) + ". Dans ce cas, " + c[2] + " avec la probabilité " + M(dT(q1)) + " ; sinon, avec la probabilité " + M(dT(q2)) + ". Sachant que " + c[3] + ", quelle est la probabilité " + c[4] + " (" + RND[0.01] + ") ?", v, 0.01,
          "Arbre : " + M("P(" + "\\text{" + c[1] + "} \\cap \\text{alerte}) = " + dT(p) + " \\cdot " + dT(q1) + " = " + dT(a)) + " ; fausses alertes " + M(dT(r6(1 - p)) + " \\cdot " + dT(q2) + " = " + dT(b)) + ". Bayes : " + M("\\frac{" + dT(a) + "}{" + dT(a) + " + " + dT(b) + "} \\approx " + dT(rd(v, 0.01))) + ".",
          { ctx: "arbre-" + c[5], guide: [GS("Chemin « " + c[1] + " puis alerte » ?", a, M(dT(a)) + "."), GS("Chemin « pas " + c[1] + " puis alerte » ?", b, M(dT(b)) + "."), GS("Probabilité totale de l'alerte ?", r6(a + b), M(dT(r6(a + b))) + "."), GS("Probabilité cherchée (" + RND[0.01] + ") ?", v, M("\\approx " + dT(rd(v, 0.01))) + ".", 0.01)],
            traps: [TR(q1, "C'est la probabilité de l'alerte sachant « " + c[1] + " » ; on cherche l'inverse."), TR(a, "C'est P(" + c[1] + " et alerte) ; divise par la probabilité totale de l'alerte."), TR(p, "C'est la probabilité avant l'alerte : l'alerte change l'information.")] }); },
    ],
    2: [
      () => { const c = pk([["Une entreprise achète ses puces à trois fournisseurs", "Une puce", "défectueuse", "F", "elle", "ils"], ["Une usine fabrique ses pièces dans trois ateliers", "Une pièce", "défectueuse", "A", "elle", "ils"], ["Une compagnie exploite trois lignes de bus", "Un trajet", "en retard", "L", "il", "elles"]]); /* 26.11 : plus de « Un(e) … il ou elle » */
        const S = pk([[0.5, 0.3, 0.2], [0.4, 0.35, 0.25], [0.45, 0.4, 0.15], [0.6, 0.25, 0.15]]), dd = [pk([0.01, 0.02, 0.03]), pk([0.04, 0.05]), pk([0.06, 0.08, 0.1])], k = R.int(0, 2);
        const ab = S.map((s, i) => r6(s * dd[i])), tot = r6(ab[0] + ab[1] + ab[2]), v = ab[k] / tot, nm = c[3];
        return QR(c[0] + " " + M(nm + "_1, " + nm + "_2, " + nm + "_3") + " : " + c[5] + " représentent " + S.map((s) => M(pct(s, 0))).join(", ") + " de l'ensemble, avec " + dd.map((x) => M(pct(x, 0))).join(", ") + " de cas « " + c[2] + " ». " + c[1] + " est " + c[2] + " : quelle est la probabilité qu'" + c[4] + " vienne de " + M(nm + "_" + (k + 1)) + " (" + RND[0.001] + ") ?", v, 0.001,
          "Probabilités totales : " + M("P(D) = " + S.map((s, i) => dT(s) + " \\cdot " + dT(dd[i])).join(" + ") + " = " + dT(tot, 5)) + ". Bayes : " + M("\\frac{" + dT(ab[k], 5) + "}{" + dT(tot, 5) + "} \\approx " + dT(rd(v, 0.001))) + ".",
          { ctx: "trois-causes-" + nm, guide: [GS("Chemin passant par " + M(nm + "_" + (k + 1)) + " ?", ab[k], M(dT(ab[k], 5)) + "."), GS("Probabilité totale " + M("P(D)") + " (trois chemins) ?", tot, M(dT(tot, 5)) + "."), GS("Probabilité cherchée (" + RND[0.001] + ") ?", v, M("\\approx " + dT(rd(v, 0.001))) + ".", 0.001)],
            traps: [TR(S[k], "C'est la part de " + nm + (k + 1) + " avant de savoir qu'il y a un problème."), TR(dd[k], "C'est la probabilité d'un problème sachant " + nm + (k + 1) + " : on cherche l'inverse."), TR(ab[k], "C'est P(" + nm + (k + 1) + " ∩ D) : divise par P(D).")] }); },
      () => { const p = pk([0.02, 0.05, 0.1, 0.15]), se = pk([0.8, 0.85, 0.9]), sp = pk([0.9, 0.95, 0.98]), a = r6(p * (1 - se)), b = r6((1 - p) * sp), v = (100 * a) / (a + b);
        return QR("Une maladie touche " + M(pct(p, 0)) + " d'une population. Le test détecte " + M(pct(se, 0)) + " des malades et il est négatif chez " + M(pct(sp, 0)) + " des personnes saines. Le test d'une personne est négatif : quelle est la probabilité qu'elle soit quand même malade (en %, " + RND[0.01] + ") ?", v, 0.01,
          "Faux négatifs : " + M(dT(p) + " \\cdot " + dT(r6(1 - se)) + " = " + dT(a, 5)) + " ; vrais négatifs : " + M(dT(r6(1 - p)) + " \\cdot " + dT(sp) + " = " + dT(b, 5)) + ". Bayes : " + M("\\frac{" + dT(a, 5) + "}{" + dT(a, 5) + " + " + dT(b, 5) + "} \\approx " + dT(rd(v, 0.01)) + "\\,\\%") + ".",
          { ctx: "faux-negatif", guide: [GS("Probabilité « malade et test négatif » ?", a, M(dT(a, 5)) + "."), GS("Probabilité « sain et test négatif » ?", b, M(dT(b, 5)) + "."), GS("Probabilité cherchée, en % (" + RND[0.01] + ") ?", v, M("\\approx " + dT(rd(v, 0.01)) + "\\,\\%") + ".", 0.01)],
            traps: [TR(100 * (1 - se), "C'est la probabilité d'un test négatif sachant malade : on cherche malade sachant négatif."), TR(100 * a, "C'est P(malade ∩ négatif) : divise par P(négatif)."), TR(100 * p, "C'est la proportion de malades avant le test.")] }); },
      () => { const N = 10000, p = pk([0.01, 0.02, 0.04, 0.05]), se = pk([0.9, 0.95, 0.8]), fp = pk([0.02, 0.05, 0.1]), mal = N * p, vp = r6(mal * se), fpN = r6((N - mal) * fp), v = (100 * vp) / (vp + fpN);
        return QR("On teste " + M("10\\text{'}000") + " personnes ; " + M(pct(p, 0)) + " sont malades. Le test est positif chez " + M(pct(se, 0)) + " des malades et chez " + M(pct(fp, 0)) + " des personnes saines. Parmi les personnes au test positif, quel pourcentage est vraiment malade (" + RND[0.1] + ") ?", v, 0.1,
          "Malades : " + M(nb(mal)) + ", dont " + M(nb(vp)) + " positifs ; saines : " + M(nb(N - mal)) + ", dont " + M(nb(fpN)) + " positifs (faux positifs). " + M("\\frac{" + nb(vp) + "}{" + nb(vp) + " + " + nb(fpN) + "} \\approx " + dT(rd(v, 0.1)) + "\\,\\%") + ".",
          { ctx: "effectifs", guide: [GS("Nombre de malades au test positif ?", vp, M(nb(vp)) + "."), GS("Nombre de personnes saines au test positif ?", fpN, M(nb(fpN)) + "."), GS("Pourcentage cherché (" + RND[0.1] + ") ?", v, M("\\approx " + dT(rd(v, 0.1)) + "\\,\\%") + ".", 0.1)],
            traps: [TR(100 * se, "C'est le pourcentage de positifs chez les malades : on cherche les malades parmi les positifs."), TR((100 * vp) / N, "Divise par le nombre de positifs, pas par 10'000."), TR(100 - 100 * fp, "Ce n'est pas lié qu'au taux de faux positifs : compte les deux groupes de positifs.")] }); },
    ],
    3: [
      () => { const p = pk([0.01, 0.02, 0.05]), se = pk([0.9, 0.95, 0.99]), fp = pk([0.05, 0.1]), a = p * se * se, b = (1 - p) * fp * fp, v = a / (a + b), v1 = (p * se) / (p * se + (1 - p) * fp);
        return QR("Une maladie touche " + M(pct(p, 0)) + " de la population. Un test est positif chez " + M(pct(se, 0)) + " des malades et chez " + M(pct(fp, 0)) + " des personnes saines. Une personne passe deux fois le test (résultats indépendants) : deux fois positif. Quelle est la probabilité qu'elle soit malade (" + RND[0.001] + ") ?", v, 0.001,
          "Après un test positif : " + M("\\frac{" + dT(p) + " \\cdot " + dT(se) + "}{" + dT(p) + " \\cdot " + dT(se) + " + " + dT(r6(1 - p)) + " \\cdot " + dT(fp) + "} \\approx " + dT(rd(v1, 0.001))) + " ; ce nombre sert de nouvelle probabilité de départ. Directement : " + M("\\frac{" + dT(p) + " \\cdot " + dT(se) + "^2}{" + dT(p) + " \\cdot " + dT(se) + "^2 + " + dT(r6(1 - p)) + " \\cdot " + dT(fp) + "^2} \\approx " + dT(rd(v, 0.001))) + ".",
          { ctx: "deux-tests", guide: [GS("Probabilité d'être malade après un seul test positif (" + RND[0.001] + ") ?", v1, M("\\approx " + dT(rd(v1, 0.001))) + ".", 0.001), GS(M("P(M \\cap ++) = " + dT(p) + " \\cdot " + dT(se) + "^2") + " (" + RND[0.0001] + ") ?", a, M("\\approx " + dT(rd(a, 0.0001))) + ".", 0.0001), GS("Probabilité cherchée (" + RND[0.001] + ") ?", v, M("\\approx " + dT(rd(v, 0.001))) + ".", 0.001)],
            traps: [TR(v1, "C'est après un seul test : le second test positif renforce encore la probabilité."), TR(se * se, "C'est P(deux positifs sachant malade) ; on cherche malade sachant deux positifs."), TR(p * se * se, "C'est P(M ∩ deux positifs) : divise par la probabilité totale de deux positifs.")] }); },
      () => { const se = pk([0.8, 0.9, 0.95, 0.99]), fp = pk([0.01, 0.02, 0.05, 0.1]), v = (100 * fp) / (se + fp);
        return QR("Un test est positif chez " + M(pct(se, 0)) + " des malades et chez " + M(pct(fp, 0)) + " des personnes saines. Quelle devrait être la proportion de malades dans la population (en %, " + RND[0.01] + ") pour qu'une personne au test positif ait exactement une chance sur deux d'être malade ?", v, 0.01,
          "Avec " + M("p") + " la proportion de malades : " + M("P_+(M) = \\frac{1}{2}") + " quand " + M(dT(se) + "p = " + dT(fp) + "(1 - p)") + ", soit " + M("p = \\frac{" + dT(fp) + "}{" + dT(se) + " + " + dT(fp) + "} \\approx " + dT(rd(v / 100, 0.0001))) + ", environ " + M(dT(rd(v, 0.01)) + "\\,\\%") + ".",
          { ctx: "prevalence", guide: [GS("Une chance sur deux : vrais positifs = faux positifs, " + M(dT(se) + "p = " + dT(fp) + "(1 - p)") + ". Coefficient de " + M("p") + " après regroupement ?", r6(se + fp), M(dT(se) + " + " + dT(fp) + " = " + dT(r6(se + fp))) + "."), GS("Proportion en % (" + RND[0.01] + ") ?", v, M("\\approx " + dT(rd(v, 0.01)) + "\\,\\%") + ".", 0.01)],
            traps: [TR(100 * fp, "Les vrais positifs (" + dS(se) + "·p) doivent égaler les faux positifs (" + dS(fp) + "·(1 − p)) : résous l'équation."), TR(50, "C'est la probabilité visée après le test, pas la proportion de malades."), TR((100 * fp) / se, "N'oublie pas le facteur (1 − p) des personnes saines.")] }); },
      () => { const pa = pk([0.3, 0.4, 0.6]), q1 = pk([0.2, 0.5, 0.7]), q2 = pk([0.1, 0.3, 0.4, 0.8]), pb = r6(pa * q1 + (1 - pa) * q2), v = ((1 - pa) * q2) / pb; if (q1 === q2) return null;
        return QR("On sait que " + M("P(A) = " + dT(pa)) + ", " + M("P_A(B) = " + dT(q1)) + " et " + M("P(B) = " + dT(pb)) + ". Calcule " + M("P_B(\\overline{A})") + " (" + RND[0.01] + ").", v, 0.01,
          M("P(\\overline{A} \\cap B) = P(B) - P(A \\cap B) = " + dT(pb) + " - " + dT(r6(pa * q1)) + " = " + dT(r6(pb - pa * q1))) + ", puis " + M("P_B(\\overline{A}) = \\frac{" + dT(r6(pb - pa * q1)) + "}{" + dT(pb) + "} \\approx " + dT(rd(v, 0.01))) + ". (Ou : " + M("1 - P_B(A)") + ".)",
          { ctx: "inconnue", guide: [GS(M("P(A \\cap B)") + " ?", r6(pa * q1), M(dT(r6(pa * q1))) + "."), GS(M("P(\\overline{A} \\cap B) = P(B) - P(A \\cap B)") + " ?", r6(pb - pa * q1), M(dT(r6(pb - pa * q1))) + "."), GS(M("P_B(\\overline{A})") + " (" + RND[0.01] + ") ?", v, M("\\approx " + dT(rd(v, 0.01))) + ".", 0.01)],
            traps: [TR(q2, "C'est P_Ā(B) : on cherche Ā sachant B."), TR((pa * q1) / pb, "C'est P_B(A) ; on demande le contraire, Ā sachant B."), TR(r6(pb - pa * q1), "C'est P(Ā ∩ B) : divise par P(B).")] }); },
    ],
  };

  // ======================= syslin : systèmes linéaires par les matrices (4.GV.02e) =======================
  const SYS_VAR = ["x", "y"], SYS_VAR3 = ["x", "y", "z"];
  /* système 2 × 2 de solution entière (x0 ; y0) et de déterminant |D| ≥ 2 */
  const sys2r = () => { const A = rnd4(-6, 6), D = dt(A), x0 = nz(-6, 6), y0 = nz(-6, 6); if (Math.abs(D) < 2 || Math.abs(x0) === Math.abs(y0)) return null; const [e, f] = mv(A, [x0, y0]); if (!e || !f) return null; return { A, D, x0, y0, e, f, Dx: e * A[3] - A[1] * f, Dy: A[0] * f - e * A[2] }; };
  const sysS = (o) => sysT([[o.A[0], o.A[1], o.e], [o.A[2], o.A[3], o.f]], SYS_VAR);
  const SL = {
    1: [
      () => { const o = sys2r(); if (!o) return null;
        return chk(QN("Le système " + sysS(o) + " s'écrit " + M("A\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} " + o.e + " \\\\ " + o.f + " \\end{pmatrix}") + ". Calcule " + M("\\det A") + ".", o.D,
          M("A = " + mX(o.A)) + " (coefficients de x et de y), " + M("\\det A = " + par(o.A[0]) + " \\cdot " + par(o.A[3]) + " - " + par(o.A[1]) + " \\cdot " + par(o.A[2]) + " = " + o.D) + ". Il n'est pas nul : une seule solution.",
          { ctx: "det-systeme", guide: [GP2("Première ligne de " + M("A") + " (coefficients de x et de y) ?", [o.A[0], o.A[1]], M("(" + o.A[0] + " \\,;\\, " + o.A[1] + ")") + "."), GS(M("\\det A") + " ?", o.D, M(o.D) + ".")],
            traps: [TR(o.A[0] * o.e - o.A[1] * o.f, "La matrice A ne contient que les coefficients de x et de y, pas le second membre."), TR(o.A[0] * o.A[3] + o.A[1] * o.A[2], "ad − bc : on soustrait."), TR(-o.D, "Diagonale principale moins l'autre.")] })); },
      () => { const o = sys2r(); if (!o) return null; const X = R.rand() < 0.5, v = X ? o.Dx : o.Dy; if (Math.abs(v) < 2) return null;
        return chk(QN("Pour résoudre " + sysS(o) + " par la règle de Cramer, calcule le déterminant " + M(X ? "D_x" : "D_y") + ".", v,
          M(X ? "D_x" : "D_y") + " : on remplace la colonne des " + (X ? "x" : "y") + " par le second membre. " + M((X ? "D_x = " + mat(o.e, o.A[1], o.f, o.A[3]) + " = " + par(o.e) + " \\cdot " + par(o.A[3]) + " - " + par(o.A[1]) + " \\cdot " + par(o.f) : "D_y = " + mat(o.A[0], o.e, o.A[2], o.f) + " = " + par(o.A[0]) + " \\cdot " + par(o.f) + " - " + par(o.e) + " \\cdot " + par(o.A[2])) + " = " + v) + ".",
          { ctx: X ? "determinant-Dx" : "determinant-Dy", guide: [GP2("Première ligne de la matrice de " + M(X ? "D_x" : "D_y") + " ?", X ? [o.e, o.A[1]] : [o.A[0], o.e], M(X ? "(" + o.e + " \\,;\\, " + o.A[1] + ")" : "(" + o.A[0] + " \\,;\\, " + o.e + ")") + "."), GS(M(X ? "D_x" : "D_y") + " ?", v, M(v) + ".")],
            traps: [TR(o.D, "C'est le déterminant D du système ; dans " + (X ? "Dx" : "Dy") + ", le second membre remplace la colonne des " + (X ? "x" : "y") + "."), TR(X ? o.Dy : o.Dx, "Tu as remplacé l'autre colonne."), TR(-v, "Attention à l'ordre : diagonale principale moins l'autre.")] })); },
      () => { const o = sys2r(); if (!o) return null; const X = R.rand() < 0.5, v = X ? o.x0 : o.y0;
        return QN("Résous " + sysS(o) + " avec la règle de Cramer et donne " + M(X ? "x" : "y") + ".", v,
          M("D = " + o.D) + ", " + M((X ? "D_x = " + o.Dx : "D_y = " + o.Dy)) + ", donc " + M((X ? "x = \\frac{D_x}{D}" : "y = \\frac{D_y}{D}") + " = \\frac{" + (X ? o.Dx : o.Dy) + "}{" + o.D + "} = " + v) + ".",
          { ctx: "cramer-" + (X ? "x" : "y"), guide: [GS(M("D = \\det A") + " ?", o.D, M(o.D) + "."), GS(M(X ? "D_x" : "D_y") + " ?", X ? o.Dx : o.Dy, M(X ? o.Dx : o.Dy) + "."), GS(M(X ? "x" : "y") + " ?", v, M(v) + ".")],
            traps: [TR(r6(o.D / (X ? o.Dx : o.Dy)), "C'est l'inverse : " + (X ? "Dx" : "Dy") + " ÷ D."), TR(X ? o.Dx : o.Dy, "Divise encore par D = " + o.D + "."), TR(X ? o.y0 : o.x0, "C'est l'autre inconnue.")] }); },
    ],
    2: [
      () => { const D = pk([1, -1]), a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5); if ((D + b * c) % a) return null; const d = (D + b * c) / a; if (!d) return null; const A = [a, b, c, d], inv = [d / D, -b / D, -c / D, a / D], x0 = nz(-6, 6), y0 = nz(-6, 6); if (Math.abs(x0) === Math.abs(y0)) return null; const [e, f] = mv(A, [x0, y0]); if (!e || !f) return null;
        return QP2("Le système " + sysT([[a, b, e], [c, d, f]], SYS_VAR) + " s'écrit " + M("AX = B") + ". Calcule " + M("A^{-1}") + ", puis " + M("X = A^{-1}B") + "." + PAIR2, [x0, y0],
          M("\\det A = " + D) + ", " + M("A^{-1} = " + mX(inv)) + " et " + M("X = " + mX(inv) + col(e, f) + " = " + col(x0, y0)) + ".",
          { ctx: "inverse", guide: [GS(M("\\det A") + " ?", D, M(D) + "."), GP2("Première ligne de " + M("A^{-1}") + " ?", [inv[0], inv[1]], M("(" + fT(inv[0]) + " \\,;\\, " + fT(inv[1]) + ")") + "."), GP2(M("X = A^{-1}B") + " ?", [x0, y0], M("(" + x0 + " \\,;\\, " + y0 + ")") + ".")],
            traps: [TP2(mv(A, [e, f]), "On multiplie B par l'inverse A⁻¹, pas par A."), TP2([y0, x0], "x d'abord, puis y."), TP2(mv([a, -b, -c, d], [e, f]).map((t) => t / D), "Dans l'inverse, on échange a et d (et on change le signe de b et c).")] }); },
      () => { const a = nz(-5, 5), b = nz(-6, 6), c = nz(-6, 6); if ((b * c) % a) return null; const m = (b * c) / a; if (Math.abs(m) < 2) return null; const e = nz(-9, 9), f = nz(-9, 9);
        return chk(QN("Pour quelle valeur de " + M("m") + " le système " + M("\\begin{cases} " + lc([a, b], SYS_VAR) + " = " + e + " \\\\ " + lc([c], ["x"]) + " + my = " + f + " \\end{cases}") + " n'a-t-il pas une solution unique ?", m,
          "Pas de solution unique quand le déterminant est nul : " + M(fT(a) + "m - " + par(b) + " \\cdot " + par(c) + " = 0") + ", donc " + M("m = \\frac{" + b * c + "}{" + a + "} = " + m) + ".",
          { ctx: "parametre-m", guide: [GS("Le déterminant vaut " + M(lc([a], ["m"]) + " - " + par(b) + " \\cdot " + par(c)) + ". Que vaut " + M(par(b) + " \\cdot " + par(c)) + " ?", b * c, M(b * c) + "."), GS(M("m") + " (déterminant nul) ?", m, M(m) + ".")],
            traps: [TR(-m, "a·m − b·c = 0 donne a·m = b·c : attention au signe."), TR(b * c, "Divise encore par " + a + "."), TR(r6(a / (b * c)), "m = b·c ÷ a.")] })); },
      () => { const A3 = [[nz(-3, 3), R.int(-3, 3), R.int(-3, 3)], [R.int(-3, 3), nz(-3, 3), R.int(-3, 3)], [R.int(-3, 3), R.int(-3, 3), nz(-3, 3)]], d = dt3(...A3); if (Math.abs(d) < 2) return null;
        const p = A3[0][0] * A3[1][1] * A3[2][2] + A3[0][1] * A3[1][2] * A3[2][0] + A3[0][2] * A3[1][0] * A3[2][1], n = A3[0][2] * A3[1][1] * A3[2][0] + A3[0][0] * A3[1][2] * A3[2][1] + A3[0][1] * A3[1][0] * A3[2][2];
        return chk(QN("Calcule le déterminant de la matrice des coefficients " + M(m3(A3)) + " (règle de Sarrus ou développement selon une ligne).", d,
          "Sarrus : diagonales descendantes " + M(p) + ", montantes " + M(n) + " ; " + M("\\det = " + p + " - " + par(n) + " = " + d) + ".",
          { ctx: "det3", guide: [GS("Somme des trois produits « descendants » ?", p, M(p) + "."), GS("Somme des trois produits « montants » ?", n, M(n) + "."), GS("Déterminant ?", d, M(d) + ".")],
            traps: [TR(p + n, "Sarrus : descendants MOINS montants."), TR(n - p, "Descendants moins montants, pas l'inverse."), TR(A3[0][0] * A3[1][1] * A3[2][2], "Il y a six produits (trois descendants, trois montants).")] })); },
    ],
    3: [
      () => { const A3 = [[nz(-3, 3), R.int(-2, 2), R.int(-2, 2)], [R.int(-2, 2), nz(-3, 3), R.int(-2, 2)], [R.int(-2, 2), R.int(-2, 2), nz(-3, 3)]], d = dt3(...A3), s = [nz(-4, 4), nz(-4, 4), nz(-4, 4)]; if (Math.abs(d) < 2 || new Set(s.map(Math.abs)).size < 3) return null;
        const B = A3.map((r) => r[0] * s[0] + r[1] * s[1] + r[2] * s[2]); if (B.some((x) => !x)) return null; const Dx = dt3(...A3.map((r, i) => [B[i], r[1], r[2]]));
        return QP2("Résous le système " + sysT(A3.map((r, i) => r.concat([B[i]])), SYS_VAR3) + " (règle de Cramer ou inverse)." + TRI3, s,
          M("D = " + d) + ", " + M("D_x = " + Dx) + ", donc " + M("x = \\frac{" + Dx + "}{" + d + "} = " + s[0]) + " ; de même " + M("y = " + s[1]) + " et " + M("z = " + s[2]) + ". Vérifie dans les trois équations.",
          { ctx: "cramer3", guide: [GS(M("D") + " (déterminant des coefficients) ?", d, M(d) + "."), GS(M("D_x") + " (colonne des x remplacée par le second membre) ?", Dx, M(Dx) + "."), GS(M("x") + " ?", s[0], M(s[0]) + "."), GP2("Solution ?", s, M("(" + s.join(" \\,;\\, ") + ")") + ".")],
            traps: [TP2([s[0], s[2], s[1]], "Respecte l'ordre x ; y ; z."), TP2([-s[0], -s[1], -s[2]], "Vérifie les signes dans une équation.")] }); },
      () => { const c = pk([["Un cinéma vend des billets adultes et des billets enfants", "billets adultes", "billets enfants", "CHF", "billets vendus", "une recette"], ["Un fleuriste compose des bouquets avec des roses et des tulipes", "roses", "tulipes", "CHF", "fleurs", "un prix total"], ["Un traiteur prépare des plateaux salés et des plateaux sucrés", "plateaux salés", "plateaux sucrés", "CHF", "plateaux", "un montant"]]);
        const p1 = pk([12, 14, 15, 18]), p2 = pk([6, 7, 8, 9]), x0 = R.int(25, 90), y0 = R.int(20, 80); if (x0 === y0) return null; const N = x0 + y0, T = p1 * x0 + p2 * y0, D = p2 - p1, Dx = N * p2 - T;
        return QP2(c[0] + " : " + c[1] + " à " + p1 + " " + c[3] + ", " + c[2] + " à " + p2 + " " + c[3] + ". On a " + M(N) + " " + c[4] + " pour " + c[5] + " de " + M(nb(T)) + " " + c[3] + ". Combien de " + c[1] + " et de " + c[2] + " ? Réponds « x ; y » (x : " + c[1] + ").", [x0, y0],
          M("\\begin{cases} x + y = " + N + " \\\\ " + p1 + "x + " + p2 + "y = " + T + " \\end{cases}") + " ; " + M("D = " + p2 + " - " + p1 + " = " + D) + ", " + M("D_x = " + N + " \\cdot " + p2 + " - " + T + " = " + Dx) + ", " + M("x = " + x0) + " et " + M("y = " + N + " - " + x0 + " = " + y0) + ".",
          { ctx: "probleme-" + c[4].split(" ")[0], guide: [GS("Déterminant " + M("D") + " du système " + M("x + y = " + N) + ", " + M(p1 + "x + " + p2 + "y = " + T) + " ?", D, M("1 \\cdot " + p2 + " - 1 \\cdot " + p1 + " = " + D) + "."), GS(M("D_x") + " ?", Dx, M(Dx) + "."), GP2("Solution ?", [x0, y0], M("(" + x0 + " \\,;\\, " + y0 + ")") + ".")],
            traps: [TP2([y0, x0], "x désigne les " + c[1] + " : vérifie l'ordre."), TP2([Math.round(T / (p1 + p2)), N - Math.round(T / (p1 + p2))], "Ce n'est pas un partage : résous le système.")] }); },
      () => { const a = pk([1, 2, -1]), b = nz(-4, 4), e = nz(-7, 7), k = pk([2, 3, -2, -3]), c = k * a, m = k * b, kk = k * e;
        return QP2("Système " + M("\\begin{cases} " + lc([a, b], SYS_VAR) + " = " + e + " \\\\ " + lc([c], ["x"]) + " + my = k \\end{cases}") + ". Pour quelles valeurs de " + M("m") + " et de " + M("k") + " a-t-il une infinité de solutions ? Réponds « m ; k ».", [m, kk],
          "Il faut " + M("\\det = 0") + " : " + M(fT(a) + "m - " + par(b) + " \\cdot " + par(c) + " = 0") + ", " + M("m = " + m) + " ; la seconde équation est alors " + M(k) + " fois la première, donc " + M("k = " + k + " \\cdot " + par(e) + " = " + kk) + " (sinon, aucune solution).",
          { ctx: "infinite", guide: [GS(M("m") + " (déterminant nul) ?", m, M(m) + "."), GS("Par quel nombre faut-il multiplier la première équation pour obtenir les coefficients de la seconde ?", k, M(k) + "."), GP2("Réponse « m ; k » ?", [m, kk], M("(" + m + " \\,;\\, " + kk + ")") + ".")],
            traps: [TP2([m, e], "Le second membre doit aussi être multiplié par " + k + "."), TP2([-m, kk], "a·m − b·c = 0 : attention au signe."), TP2([m, -kk], "k = " + k + " · (" + e + ").")] }); },
    ],
  };

  // ======================= bases : familles libres, bases, composantes (4.GV.03a–d) =======================
  const r3 = (k = 3) => [nz(-k, k), R.int(-k, k), nz(-k, k)];
  const BA = {
    1: [
      () => { const u = [nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4)], D = u[0] * v[1] - u[1] * v[0]; if (Math.abs(D) < 2) return null; const al = nz(-4, 4), be = nz(-4, 4); if (Math.abs(al) === 1 && Math.abs(be) === 1) return null; const w = [al * u[0] + be * v[0], al * u[1] + be * v[1]];
        return QP2("Les vecteurs " + M("\\vec u = " + v2(u)) + " et " + M("\\vec v = " + v2(v)) + " forment une base du plan. Donne les composantes de " + M("\\vec w = " + v2(w)) + " dans cette base, c'est-à-dire " + M("(\\alpha \\,;\\, \\beta)") + " avec " + M("\\vec w = \\alpha\\vec u + \\beta\\vec v") + ". Réponds « α ; β ».", [al, be],
          M("\\alpha" + v2(u) + " + \\beta" + v2(v) + " = " + v2(w)) + " donne un système ; Cramer (" + M("D = " + D) + ") : " + M("\\alpha = " + al) + ", " + M("\\beta = " + be) + ". Vérifie : " + M(al + v2(u) + (be < 0 ? " - " + -be : " + " + be) + v2(v) + " = " + v2(w)) + ".",
          { ctx: "composantes-plan", guide: [GS("Déterminant " + M("\\det(\\vec u \\,;\\, \\vec v)") + " ?", D, M(D) + "."), GS(M("\\alpha") + " ?", al, M(al) + "."), GP2("Composantes « α ; β » ?", [al, be], M("(" + al + " \\,;\\, " + be + ")") + ".")],
            traps: [TP2(w, "Ce sont les coordonnées dans la base usuelle ; dans la base (u ; v), on résout αu + βv = w."), TP2([be, al], "α va avec u, β avec v.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5), d = nz(-6, 6); if ((a * d) % b) return null; const m = (a * d) / b; if (Math.abs(m) < 2 || Math.abs(a) === Math.abs(b)) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec u = " + v2([a, b])) + " et " + M("\\vec v = \\begin{pmatrix} m \\\\ " + d + " \\end{pmatrix}") + " sont-ils liés (ne forment pas une base) ?", m,
          "Famille liée quand " + M("\\det(\\vec u \\,;\\, \\vec v) = 0") + " : " + M(par(a) + " \\cdot " + par(d) + " - " + par(b) + "m = 0") + ", donc " + M("m = \\frac{" + a * d + "}{" + b + "} = " + m) + " : " + M("\\vec v") + " est alors un multiple de " + M("\\vec u") + ".",
          { ctx: "liee-plan", guide: [GS("Le déterminant vaut " + M(par(a) + " \\cdot " + par(d) + " - " + par(b) + "m") + ". Que vaut " + M(par(a) + " \\cdot " + par(d)) + " ?", a * d, M(a * d) + "."), GS(M("m") + " ?", m, M(m) + ".")],
            traps: [TR(-m, "a·d − b·m = 0 donne m = a·d ÷ b : attention au signe."), TR(r6((b * d) / a), "Les composantes doivent être proportionnelles : m ÷ " + a + " = " + d + " ÷ " + b + "."), TR(a * d, "Divise encore par " + b + ".")] })); },
      () => { const u = [nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4)]; if (Math.abs(u[0] * v[1] - u[1] * v[0]) < 1) return null; const al = nz(-4, 4), be = nz(-4, 4); if (Math.abs(al) === 1 && Math.abs(be) === 1) return null; const w = [al * u[0] + be * v[0], al * u[1] + be * v[1]]; if (w.some((x) => !x)) return null;
        return QP2("Dans la base " + M("(\\vec u \\,;\\, \\vec v)") + " avec " + M("\\vec u = " + v2(u)) + " et " + M("\\vec v = " + v2(v)) + ", le vecteur " + M("\\vec w") + " a pour composantes " + M("(" + al + " \\,;\\, " + be + ")") + ". Donne ses coordonnées dans la base usuelle." + PAIR2, w,
          M("\\vec w = " + al + "\\vec u " + (be < 0 ? "- " + -be : "+ " + be) + "\\vec v = " + v2([al * u[0], al * u[1]]) + " + " + v2([be * v[0], be * v[1]]) + " = " + v2(w)) + ".",
          { ctx: "vers-usuelle", guide: [GP2("Coordonnées de " + M(al + "\\vec u") + " ?", [al * u[0], al * u[1]], M(v2([al * u[0], al * u[1]])) + "."), GP2("Coordonnées de " + M(be + "\\vec v") + " ?", [be * v[0], be * v[1]], M(v2([be * v[0], be * v[1]])) + "."), GP2(M("\\vec w") + " ?", w, M(v2(w)) + ".")],
            traps: [TP2([al * u[0] + be * u[1], al * v[0] + be * v[1]], "On combine les vecteurs : α·u + β·v, composante par composante."), TP2([al, be], "Ce sont les composantes dans la base (u ; v) ; on demande les coordonnées usuelles.")] }); },
    ],
    2: [
      () => { const u = r3(), v = r3(), n = crs(u, v); if (!n[0] || n.every((x) => !x)) return null; const al = nz(-3, 3), be = nz(-3, 3), w = lin3([al, be], [u, v]); if (Math.abs(w[0]) < 2 || !w[1] || !w[2]) return null; const c1 = n[0];
        const m = w[0];
        return chk(QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec u = " + v2(u)) + ", " + M("\\vec v = " + v2(v)) + " et " + M("\\vec w = \\begin{pmatrix} m \\\\ " + w[1] + " \\\\ " + w[2] + " \\end{pmatrix}") + " sont-ils coplanaires (famille liée) ?", m,
          "Famille liée quand " + M("\\det(\\vec u \\,;\\, \\vec v \\,;\\, \\vec w) = 0") + " : ce déterminant est du premier degré en " + M("m") + " (coefficient " + M(c1) + "), il s'annule pour " + M("m = " + m) + ". En effet " + M("\\vec w = " + al + "\\vec u " + (be < 0 ? "- " + -be : "+ " + be) + "\\vec v") + ".",
          { ctx: "liee-espace", guide: [GS("Le coefficient de " + M("m") + " dans le déterminant (développement selon la colonne de " + M("\\vec w") + ") vaut " + M("u_2v_3 - u_3v_2") + ". Combien ?", c1, M(c1) + "."), GS(M("m") + " ?", m, M(m) + ".")],
            traps: [TR(-m, "Vérifie le signe : avec cette valeur, le déterminant doit être nul."), TR(al + be, "Écris w = αu + βv avec les deux dernières composantes, puis calcule la première.")] })); },
      () => { const U = [r3(2), r3(2), r3(2)], d = dt3(...U); if (Math.abs(d) < 1) return null; const s = [nz(-3, 3), nz(-3, 3), nz(-3, 3)]; if (new Set(s.map(Math.abs)).size < 2) return null; const t = lin3(s, U); if (t.some((x) => !x)) return null;
        return QP2("Les vecteurs " + M("\\vec u = " + v2(U[0])) + ", " + M("\\vec v = " + v2(U[1])) + ", " + M("\\vec w = " + v2(U[2])) + " forment une base de l'espace. Donne les composantes de " + M("\\vec t = " + v2(t)) + " dans cette base. Réponds « α ; β ; γ ».", s,
          M("\\alpha\\vec u + \\beta\\vec v + \\gamma\\vec w = \\vec t") + " : système de trois équations (" + M("D = " + d) + ") ; solution " + M("(" + s.join(" \\,;\\, ") + ")") + ".",
          { ctx: "composantes-espace", guide: [GS("Déterminant de la famille " + M("(\\vec u \\,;\\, \\vec v \\,;\\, \\vec w)") + " ?", d, M(d) + "."), GS(M("\\alpha") + " ?", s[0], M(s[0]) + "."), GP2("Composantes « α ; β ; γ » ?", s, M("(" + s.join(" \\,;\\, ") + ")") + ".")],
            traps: [TP2(t, "Ce sont les coordonnées usuelles de t ; dans la base (u ; v ; w), résous αu + βv + γw = t."), TP2([s[2], s[1], s[0]], "α va avec u, β avec v, γ avec w.")] }); },
      () => { const u = r3(), v = r3(); if (crs(u, v).every((x) => !x)) return null; const al = nz(-4, 4), be = nz(-4, 4); if (Math.abs(al) === Math.abs(be)) return null; const w = lin3([al, be], [u, v]); if (w.some((x) => !x)) return null;
        return QP2("Les vecteurs " + M("\\vec u = " + v2(u)) + ", " + M("\\vec v = " + v2(v)) + " et " + M("\\vec w = " + v2(w)) + " sont coplanaires. Trouve " + M("\\alpha") + " et " + M("\\beta") + " tels que " + M("\\vec w = \\alpha\\vec u + \\beta\\vec v") + ". Réponds « α ; β ».", [al, be],
          "Deux équations suffisent pour trouver " + M("\\alpha") + " et " + M("\\beta") + " ; la troisième sert de vérification : " + M("\\vec w = " + al + "\\vec u " + (be < 0 ? "- " + -be : "+ " + be) + "\\vec v") + ".",
          { ctx: "combinaison-coplanaire", guide: [GS(M("\\alpha") + " ?", al, M(al) + "."), GS(M("\\beta") + " ?", be, M(be) + "."), GP2("Réponse « α ; β » ?", [al, be], M("(" + al + " \\,;\\, " + be + ")") + ".")],
            traps: [TP2([be, al], "α multiplie u, β multiplie v."), TP2([-al, -be], "Vérifie les signes dans une équation.")] }); },
    ],
    3: [
      () => { const u = r3(), v = r3(); if (crs(u, v).every((x) => !x)) return null; const t = pk([2, 3]); let w;
        if (t === 2) { const al = nz(-2, 2), be = nz(-2, 2); w = lin3([al, be], [u, v]); } else { w = r3(); if (!dt3(u, v, w)) return null; }
        if (w.every((x) => !x)) return null;
        return QN("Quelle est la dimension du sous-espace engendré par " + M("\\vec u = " + v2(u)) + ", " + M("\\vec v = " + v2(v)) + " et " + M("\\vec w = " + v2(w)) + " ?", t,
          t === 3 ? M("\\det(\\vec u \\,;\\, \\vec v \\,;\\, \\vec w) = " + dt3(u, v, w) + " \\neq 0") + " : la famille est libre, c'est une base de l'espace, dimension 3." : M("\\det = 0") + " et " + M("\\vec u") + ", " + M("\\vec v") + " ne sont pas colinéaires : " + M("\\vec w") + " est une combinaison de " + M("\\vec u") + " et " + M("\\vec v") + " ; ils engendrent un plan, dimension 2.",
          { ctx: "dimension", guide: [GS("Déterminant " + M("\\det(\\vec u \\,;\\, \\vec v \\,;\\, \\vec w)") + " ?", dt3(u, v, w), M(dt3(u, v, w)) + "."), GS("Dimension ?", t, M(t) + ".")],
            traps: [TR(t === 3 ? 2 : 3, t === 3 ? "Le déterminant n'est pas nul : la famille est libre." : "Le déterminant est nul : un des vecteurs est combinaison des autres."), TR(1, "u et v ne sont pas colinéaires : au moins un plan.")] }); },
      () => { const u = r3(), v = r3(), n = crs(u, v); if (!n[2] || n.every((x) => !x)) return null; const al = nz(-3, 3), be = nz(-3, 3), w = lin3([al, be], [u, v]); if (w.some((x) => !x) || Math.abs(w[2]) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("r") + " le vecteur " + M("\\begin{pmatrix} " + w[0] + " \\\\ " + w[1] + " \\\\ r \\end{pmatrix}") + " appartient-il au sous-espace engendré par " + M("\\vec u = " + v2(u)) + " et " + M("\\vec v = " + v2(v)) + " ?", w[2],
          "Avec les deux premières composantes : " + M("\\alpha = " + al) + ", " + M("\\beta = " + be) + " ; la troisième vaut alors " + M(al + " \\cdot " + par(u[2]) + " + " + par(be) + " \\cdot " + par(v[2]) + " = " + w[2]) + ".",
          { ctx: "appartenance", guide: [GS(M("\\alpha") + " (deux premières composantes) ?", al, M(al) + "."), GS(M("\\beta") + " ?", be, M(be) + "."), GS(M("r") + " ?", w[2], M(w[2]) + ".")],
            traps: [TR(u[2] + v[2], "Il faut d'abord trouver α et β avec les deux premières composantes."), TR(-w[2], "Vérifie le signe : r = α·u₃ + β·v₃.")] })); },
      () => { const u = [nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3)]; if (Math.abs(u[0] * v[1] - u[1] * v[0]) < 1) return null; const ka = nz(-2, 2), kb = nz(-2, 2), u2 = [1, ka], v2v = [kb, 1 + ka * kb], Dd = 1;
        const al = nz(-3, 3), be = nz(-3, 3), w = [al * u[0] + be * v[0], al * u[1] + be * v[1]];
        const g = (w[0] * v2v[1] - w[1] * v2v[0]) / Dd, h = (u2[0] * w[1] - u2[1] * w[0]) / Dd; if (!Number.isInteger(g) || !Number.isInteger(h) || (g === al && h === be)) return null;
        return QP2("Le vecteur " + M("\\vec w") + " a pour composantes " + M("(" + al + " \\,;\\, " + be + ")") + " dans la base " + M("\\vec u = " + v2(u)) + ", " + M("\\vec v = " + v2(v)) + ". Donne ses composantes dans la base " + M("\\vec u' = " + v2(u2)) + ", " + M("\\vec v' = " + v2(v2v)) + ". Réponds « α' ; β' ».", [g, h],
          "Coordonnées usuelles : " + M("\\vec w = " + v2(w)) + ". Puis " + M("\\alpha'\\vec u' + \\beta'\\vec v' = \\vec w") + " : " + M("\\beta' = " + h) + " (seconde ligne), " + M("\\alpha' = " + g) + ".",
          { ctx: "changement-base", guide: [GP2("Coordonnées usuelles de " + M("\\vec w") + " ?", w, M(v2(w)) + "."), GP2("Composantes dans " + M("(\\vec u' \\,;\\, \\vec v')") + " ?", [g, h], M("(" + g + " \\,;\\, " + h + ")") + ".")],
            traps: [TP2(w, "Ce sont les coordonnées usuelles : il reste à les écrire dans la base (u' ; v')."), TP2([al, be], "Les composantes changent avec la base.")] }); },
    ],
  };

  // ======================= nombres complexes (MA2) : outils =======================
  /* z = a + bi en TeX (« 3 - 2i ») et au clavier (« 3 - 2i », fractions entre parenthèses : « (3/2)i ») */
  const zT = (a, b) => { a = r6(a); b = r6(b); if (!b) return fT(a); const im = (Math.abs(b) === 1 ? "" : fT(Math.abs(b))) + "i"; if (!a) return (b < 0 ? "-" : "") + im; return fT(a) + (b < 0 ? " - " : " + ") + im; };
  const zS = (a, b) => { a = r6(a); b = r6(b); const bb = Math.abs(b), im = bb === 1 ? "i" : Number.isInteger(bb) ? bb + "i" : "(" + fS(bb) + ")i"; if (!b) return fS(a); if (!a) return (b < 0 ? "-" : "") + im; return fS(a) + (b < 0 ? " - " : " + ") + im; };
  const zP = (a, b) => (r6(a) && r6(b) ? "(" + zT(a, b) + ")" : r6(b) && r6(b) < 0 ? "(" + zT(a, b) + ")" : zT(a, b));
  const zm = (z, w) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
  const zpow = (z, n) => { let p = [1, 0]; for (let k = 0; k < n; k++) p = zm(p, z); return p; };
  const gz = () => [nz(-6, 6), nz(-6, 6)];
  const QZ = (q, z, sol, o) => QX(q, zS(...z), sol, o);
  const GZ = (ask, z, sol) => GX(ask, zS(...z), sol);
  const TZ = (z, m) => TX(zS(...z), m);
  /* argument en unités de π, ramené dans ]−1 ; 1] */
  const q12 = (c) => Math.round(c * 12) / 12;
  const princ = (c) => { c = Math.round(c * 12); c = ((c % 24) + 24) % 24; if (c > 12) c -= 24; return c / 12; };
  const ePi = (c) => (r6(c) ? "e^{" + (c < 0 ? "-" : "") + "i" + piT(Math.abs(c)).replace(/^\\frac\{\\pi\}/, "\\frac{\\pi}") + "}" : "");
  /* nombres complexes remarquables : k(±1 ± i), k(±√3 ± i), k(±1 ± √3 i) — tex, saisie, module, argument (en π) */
  const kq = (k, n) => (k === 1 ? "" : k) + "\\sqrt{" + n + "}", kqS = (k, n) => (k === 1 ? "" : k + "*") + "sqrt(" + n + ")";
  const notable = (kMax = 3) => { const k = R.int(1, kMax), sx = pk([1, -1]), sy = pk([1, -1]), f = pk(["4", "6", "3"]);
    if (f === "4") return { tex: zT(sx * k, sy * k), ex: zS(sx * k, sy * k), r: k * Math.SQRT2, rT: kq(k, 2), rS: kqS(k, 2), th: princ(sx > 0 ? sy * 0.25 : sy * 0.75), x: sx * k, y: sy * k, f };
    if (f === "6") return { tex: (sx < 0 ? "-" : "") + kq(k, 3) + (sy < 0 ? " - " : " + ") + (k === 1 ? "" : k) + "i", ex: (sx < 0 ? "-" : "") + kqS(k, 3) + (sy < 0 ? " - " : " + ") + (k === 1 ? "" : k) + "i", r: 2 * k, rT: String(2 * k), rS: String(2 * k), th: princ(sx > 0 ? sy / 6 : sy * 5 / 6), x: sx * k * Math.sqrt(3), y: sy * k, f };
    return { tex: fT(sx * k) + (sy < 0 ? " - " : " + ") + kq(k, 3) + "i", ex: fS(sx * k) + (sy < 0 ? " - " : " + ") + kqS(k, 3) + "*i", r: 2 * k, rT: String(2 * k), rS: String(2 * k), th: princ(sx > 0 ? sy / 3 : sy * 2 / 3), x: sx * k, y: sy * k * Math.sqrt(3), f }; };
  const cosPi = (c) => r6(Math.cos(c * Math.PI)), sinPi = (c) => r6(Math.sin(c * Math.PI));

  // ======================= cplxalg : forme algébrique, opérations (4.NC.01a–c) =======================
  const CA = {
    1: [
      () => { const z = gz(), w = gz(), k = pk([2, 3, -2, -3]), r = [z[0] + k * w[0], z[1] + k * w[1]]; if (r.some((x) => !x)) return null;
        return QZ("Avec " + M("z = " + zT(...z)) + " et " + M("w = " + zT(...w)) + ", donne " + M("z " + (k < 0 ? "- " + -k : "+ " + k) + "w") + " sous la forme " + M("a + bi") + ".", r,
          "Parties réelles et parties imaginaires séparément : " + M(z[0] + " + " + par(k) + " \\cdot " + par(w[0]) + " = " + r[0]) + " et " + M(z[1] + " + " + par(k) + " \\cdot " + par(w[1]) + " = " + r[1]) + " : " + M(zT(...r)) + ".",
          { ctx: "somme", guide: [GS("Partie réelle ?", r[0], M(r[0]) + "."), GS("Partie imaginaire ?", r[1], M(r[1]) + "."), GZ("Résultat ?", r, M(zT(...r)) + ".")],
            traps: [TZ([z[0] + w[0], z[1] + w[1]], "Multiplie aussi w par " + k + "."), TZ([z[0] + k * w[0], z[1] - k * w[1]], "Le facteur " + k + " multiplie aussi la partie imaginaire de w."), TZ([r[1], r[0]], "Partie réelle d'abord, puis partie imaginaire (le nombre devant i).")] }); },
      () => { const z = gz(), w = gz(), p = zm(z, w); if (p.some((x) => !x)) return null;
        return QZ("Calcule le produit " + M(zP(...z) + zP(...w)) + " et écris-le sous la forme " + M("a + bi") + ".", p,
          "On développe : " + M(zP(...z) + zP(...w) + " = " + (z[0] * w[0]) + (z[0] * w[1] + z[1] * w[0] < 0 ? " - " : " + ") + Math.abs(z[0] * w[1] + z[1] * w[0]) + "i " + (z[1] * w[1] < 0 ? "- " : "+ ") + Math.abs(z[1] * w[1]) + "i^2") + ", et " + M("i^2 = -1") + " : " + M(zT(...p)) + ".",
          { ctx: "produit", guide: [GS("Produit des parties réelles " + M(par(z[0]) + " \\cdot " + par(w[0])) + " ?", z[0] * w[0], M(z[0] * w[0]) + "."), GS("Coefficient de " + M("i^2") + " (produit des parties imaginaires) ?", z[1] * w[1], M(z[1] * w[1]) + " ; avec " + M("i^2 = -1") + ", il passe dans la partie réelle avec le signe opposé."), GZ("Résultat ?", p, M(zT(...p)) + ".")],
            traps: [TZ([z[0] * w[0], z[1] * w[1]], "On ne multiplie pas partie par partie : développe (quatre produits)."), TZ([z[0] * w[0] + z[1] * w[1], p[1]], "i² = −1 : le produit des parties imaginaires change de signe."), TZ([z[0] * w[0] - z[1] * w[1], z[0] * w[1] - z[1] * w[0]], "Les deux termes en i s'additionnent.")] }); },
      () => { const t = R.rand() < 0.6, z = gz();
        if (t) { const v = z[0] * z[0] + z[1] * z[1];
          return QN("Soit " + M("z = " + zT(...z)) + ". Calcule " + M("z \\cdot \\bar z") + ".", v, M("\\bar z = " + zT(z[0], -z[1])) + " ; " + M("z\\bar z = " + par(z[0]) + "^2 + " + par(z[1]) + "^2 = " + v) + " : c'est un réel (le carré du module).",
            { ctx: "conjugue", guide: [GZ("Conjugué " + M("\\bar z") + " ?", [z[0], -z[1]], M(zT(z[0], -z[1])) + "."), GS(M("z\\bar z = a^2 + b^2") + " ?", v, M(v) + ".")],
              traps: [TR(z[0] * z[0] - z[1] * z[1], "(a + bi)(a − bi) = a² − (bi)² = a² + b², car i² = −1."), TR(Math.abs(z[0]) + Math.abs(z[1]), "On additionne les carrés."), TR(Math.hypot(z[0], z[1]), "C'est le module |z| ; z·z̄ = |z|².")] }); }
        const n = R.int(10, 99), r = n % 4, ans = [[1, 0], [0, 1], [-1, 0], [0, -1]][r]; if (!r) return null;
        return QZ("Calcule " + M("i^{" + n + "}") + ".", ans, M(n + " = 4 \\cdot " + Math.floor(n / 4) + " + " + r) + " et " + M("i^4 = 1") + ", donc " + M("i^{" + n + "} = i^{" + r + "} = " + zT(...ans)) + ".",
          { ctx: "puissance-i", guide: [GS("Reste de la division de " + M(n) + " par 4 ?", r, M(r) + "."), GZ(M("i^{" + n + "}") + " ?", ans, M(zT(...ans)) + ".")],
            traps: [TZ([[1, 0], [0, 1], [-1, 0], [0, -1]][(r + 2) % 4], "Les puissances de i se répètent de 4 en 4 : i, −1, −i, 1."), TZ([0, 1], "i^" + n + " ≠ i : regarde le reste de " + n + " ÷ 4."), TZ([0, -1], "i³ = −i, mais i² = −1 et i⁴ = 1.")] }); },
    ],
    2: [
      () => { const q = gz(), w = gz(), z = zm(q, w); if (q.some((x) => !x) || Math.abs(w[1]) === 0) return null; const n2 = w[0] * w[0] + w[1] * w[1], num = zm(z, [w[0], -w[1]]);
        return QZ("Calcule " + M("\\frac{" + zT(...z) + "}{" + zT(...w) + "}") + " sous la forme " + M("a + bi") + ".", q,
          "On multiplie en haut et en bas par le conjugué " + M(zT(w[0], -w[1])) + " : dénominateur " + M(n2) + ", numérateur " + M(zT(...num)) + " ; " + M("\\frac{" + zT(...num) + "}{" + n2 + "} = " + zT(...q)) + ".",
          { ctx: "quotient", guide: [GS("Dénominateur multiplié par son conjugué, " + M(par(w[0]) + "^2 + " + par(w[1]) + "^2") + " ?", n2, M(n2) + "."), GZ("Numérateur multiplié par " + M(zT(w[0], -w[1])) + " ?", num, M(zT(...num)) + "."), GZ("Quotient ?", q, M(zT(...q)) + ".")],
            traps: [TZ([z[0] / w[0], z[1] / w[1]], "On ne divise pas partie par partie : multiplie par le conjugué du dénominateur."), TZ([q[0], -q[1]], "Le conjugué va au numérateur ET au dénominateur ; vérifie le signe de la partie imaginaire."), TZ(num, "Divise encore par " + n2 + ".")] }); },
      () => { const a = gz(), zz = gz(), c = gz(), e = [zm(a, zz)[0] + c[0], zm(a, zz)[1] + c[1]]; if (e.some((x) => !x)) return null; const rhs = [e[0] - c[0], e[1] - c[1]];
        /* 27.11 (recalcul, agent recalc34) : avec c = -3 + 6i, l'énoncé affichait « - 3 - 6i » (zT(-c[0], -c[1]) : partie imaginaire
           de signe inversé) alors que la réponse attendue utilisait -3 + 6i : réponse fausse dès que c[0] < 0 et c[1] ≠ 0. */
        return QZ("Résous dans " + M("\\mathbb{C}") + " : " + M(zP(...a) + "z " + (c[0] < 0 ? "- " + zT(-c[0], c[1]) : "+ " + zP(...c)) + " = " + zT(...e)) + ". Donne " + M("z") + " sous la forme " + M("a + bi") + ".", zz,
          M(zP(...a) + "z = " + zT(...e) + " - " + zP(...c) + " = " + zT(...rhs)) + ", puis on divise par " + M(zT(...a)) + " (conjugué) : " + M("z = " + zT(...zz)) + ".",
          { ctx: "equation-lineaire", guide: [GZ("Isole le terme en z : " + M(zP(...a) + "z") + " = ?", rhs, M(zT(...rhs)) + "."), GZ(M("z") + " ?", zz, M(zT(...zz)) + ".")],
            traps: [TZ(rhs, "Il reste à diviser par " + zT(...a) + "."), TZ([zz[0], -zz[1]], "Vérifie le signe de la partie imaginaire (le conjugué sert au dénominateur seulement)."), TZ(zm(rhs, a), "On divise par " + zT(...a) + ", on ne multiplie pas.")] }); },
      () => { const z = gz(), n2 = z[0] * z[0] + z[1] * z[1], re = R.rand() < 0.5, v = re ? z[0] / n2 : -z[1] / n2;
        return QN("Donne la partie " + (re ? "réelle" : "imaginaire") + " de " + M("\\frac{1}{" + zT(...z) + "}") + " (fraction acceptée).", v,
          M("\\frac{1}{" + zT(...z) + "} = \\frac{" + zT(z[0], -z[1]) + "}{" + n2 + "}") + " : partie " + (re ? "réelle " + M(fT(v)) : "imaginaire " + M(fT(v))) + ".",
          { ctx: "inverse-" + (re ? "re" : "im"), guide: [GS(M("z \\bar z") + " ?", n2, M(n2) + "."), GS("Partie " + (re ? "réelle" : "imaginaire") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(re ? 1 / z[0] : 1 / z[1], "1 ÷ (a + bi) n'est pas 1/a + (1/b)i : multiplie par le conjugué."), TR(-v, "Le conjugué de " + zS(...z) + " est " + zS(z[0], -z[1]) + " : attention au signe."), TR(re ? z[0] : -z[1], "Divise encore par a² + b² = " + n2 + ".")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, -2, -3]), x = nz(-6, 6), y = nz(-6, 6), rhs = [(1 + k) * x, (1 - k) * y], z = [x, y];
        return QZ("Trouve le nombre complexe " + M("z") + " tel que " + M("z " + (k < 0 ? "- " + -k : "+ " + k) + "\\bar z = " + zT(...rhs)) + ".", z,
          "Avec " + M("z = x + yi") + " : " + M("z " + (k < 0 ? "- " + -k : "+ " + k) + "\\bar z = " + (1 + k) + "x + " + par(1 - k) + "yi") + ". Donc " + M((1 + k) + "x = " + rhs[0]) + " et " + M(par(1 - k) + "y = " + rhs[1]) + " : " + M("z = " + zT(...z)) + ".",
          { ctx: "conjugue-equation", guide: [GS("Partie réelle de " + M("z " + (k < 0 ? "- " + -k : "+ " + k) + "\\bar z") + " : " + M("c \\cdot x") + ". Que vaut " + M("c") + " ?", 1 + k, M(1 + k) + "."), GS(M("x") + " ?", x, M(x) + "."), GS(M("y") + " ?", y, M(y) + "."), GZ(M("z") + " ?", z, M(zT(...z)) + ".")],
            traps: [TZ([x, -y], "z̄ = x − yi : la partie imaginaire de z + k·z̄ est (1 − k)y."), TZ([rhs[0] / (1 + k), rhs[1] / (1 + k)], "Les parties réelle et imaginaire n'ont pas le même coefficient.")] }); },
      () => { const z = [nz(-3, 3), nz(-3, 3)], c = zpow(z, 3); if (c.some((x) => !x)) return null; const s = zpow(z, 2);
        return QZ("Calcule " + M("(" + zT(...z) + ")^3") + " sous la forme " + M("a + bi") + ".", c,
          M("(" + zT(...z) + ")^2 = " + zT(...s)) + ", puis " + M("(" + zT(...s) + ")(" + zT(...z) + ") = " + zT(...c)) + ".",
          { ctx: "cube", guide: [GZ("Carré " + M("(" + zT(...z) + ")^2") + " ?", s, M(zT(...s)) + "."), GZ("Cube ?", c, M(zT(...c)) + ".")],
            traps: [TZ([z[0] ** 3, z[1] ** 3], "(a + bi)³ ≠ a³ + b³i : développe (ou passe par le carré)."), TZ([z[0] ** 3 + 3 * z[0] * z[1] ** 2, 3 * z[0] ** 2 * z[1] + z[1] ** 3], "(bi)² = −b² et (bi)³ = −b³i : i² = −1."), TZ(s, "C'est le carré ; multiplie encore par " + zS(...z) + ".")] }); },
      () => { const p = R.int(1, 5), q = nz(-5, 5); if (p === Math.abs(q)) return null; const w = zm([p, q], [p, q]);
        return QZ("Trouve la racine carrée de " + M(zT(...w)) + " dont la partie réelle est positive : le nombre " + M("z = x + yi") + " tel que " + M("z^2 = " + zT(...w)) + " et " + M("x > 0") + ".", [p, q],
          M("(x + yi)^2 = x^2 - y^2 + 2xyi") + " : " + M("x^2 - y^2 = " + w[0]) + " et " + M("2xy = " + w[1]) + " ; avec " + M("x^2 + y^2 = |z|^2 = " + (p * p + q * q)) + " : " + M("x^2 = " + p * p) + ", " + M("x = " + p) + ", " + M("y = " + q) + ", donc " + M("z = " + zT(p, q)) + ".",
          { ctx: "racine-carree", guide: [GS(M("x^2 + y^2 = |" + zT(...w) + "|") + " ?", p * p + q * q, M("\\sqrt{" + par(w[0]) + "^2 + " + par(w[1]) + "^2} = " + (p * p + q * q)) + "."), GS(M("x") + " (avec " + M("x^2 - y^2 = " + w[0]) + ") ?", p, M(p) + "."), GZ(M("z") + " ?", [p, q], M(zT(p, q)) + ".")],
            traps: [TZ([-p, -q], "C'est l'autre racine : on veut x > 0."), TZ([p, -q], "2xy = " + w[1] + " fixe le signe de y."), TZ([q, p], "Partie réelle x, partie imaginaire y : vérifie x² − y² = " + w[0] + ".")] }); },
    ],
  };

  // ======================= cplxtrig : module, argument, formes trigonométrique et exponentielle, Moivre (4.NC.02a–d) =======================
  const CT = {
    1: [
      () => { const z = gz(), v = Math.hypot(...z); if (Math.abs(z[0]) === Math.abs(z[1])) return null;
        return QN("Calcule le module de " + M("z = " + zT(...z)) + " (valeur exacte).", v, M("|z| = \\sqrt{" + par(z[0]) + "^2 + " + par(z[1]) + "^2} = \\sqrt{" + (z[0] * z[0] + z[1] * z[1]) + "}" + (Number.isInteger(r6(v)) ? " = " + v : "")) + ".",
          { ctx: "module", guide: [GS(M("a^2 + b^2") + " ?", z[0] * z[0] + z[1] * z[1], M(z[0] * z[0] + z[1] * z[1]) + "."), GS(M("|z|") + " ?", v, M(Number.isInteger(r6(v)) ? String(v) : "\\sqrt{" + (z[0] * z[0] + z[1] * z[1]) + "}") + ".")],
            traps: [TR(Math.abs(z[0]) + Math.abs(z[1]), "Module = √(a² + b²), pas a + b."), TR(z[0] * z[0] + z[1] * z[1], "N'oublie pas la racine carrée."), TR(Math.sqrt(Math.abs(z[0] * z[0] - z[1] * z[1])), "On additionne les carrés (Pythagore).")] }); },
      () => { const N = notable(); if (N.th === 1 || N.th === 0) return null;
        return QPi("Donne l'argument principal (dans " + M("]-\\pi \\,;\\, \\pi]") + ") de " + M("z = " + N.tex) + ".", N.th,
          M("|z| = " + N.rT) + " ; " + M("\\cos\\theta = " + (N.x < 0 ? "-" : "") + { 4: "\\frac{\\sqrt{2}}{2}", 6: "\\frac{\\sqrt{3}}{2}", 3: "\\frac{1}{2}" }[N.f]) + " et " + M("\\sin\\theta") + (N.y > 0 ? " > 0" : " < 0") + " : " + M("\\theta = " + piT(N.th)) + ", point du " + (N.x > 0 ? (N.y > 0 ? "1er" : "4e") : N.y > 0 ? "2e" : "3e") + " quadrant.",
          { ctx: "argument", guide: [GS("Module " + M("|z|") + " ?", N.r, M(N.rT) + "."), GPi("Argument principal ?", N.th, M(piT(N.th)) + ".")],
            traps: [TR(-N.th * Math.PI, "Regarde le signe de la partie imaginaire : il donne le signe de l'argument."), TR(princ(N.th > 0 ? 1 - N.th : -1 - N.th) * Math.PI, "Regarde le signe de la partie réelle : quel quadrant ?"), TR(Math.atan(N.y / N.x), "arctan(b ÷ a) ne suffit pas quand a < 0 : place le point dans le bon quadrant.")] }); },
      () => { const t = pk(["4", "3"]), sx = pk([1, -1]), sy = pk([1, -1]); let x, k, th, rT, ex, tx, tr1, tr2;
        if (t === "4") { k = pk([2, 3, 4, 5]); th = princ(sx > 0 ? sy * 0.25 : sy * 0.75); rT = kq(k, 2); x = sx * k; ex = zS(x, sy * k); tx = zT(x, sy * k); tr1 = zS(x, -sy * k); tr2 = zS(-x, sy * k); }
        else { k = pk([1, 2, 3]); th = princ(sx > 0 ? sy / 3 : sy * 2 / 3); rT = String(2 * k); x = sx * k; ex = fS(x) + (sy < 0 ? " - " : " + ") + kqS(k, 3) + "*i"; tx = fT(x) + (sy < 0 ? " - " : " + ") + kq(k, 3) + "i";
          tr1 = (sx < 0 ? "-" : "") + kqS(k, 3) + (sy < 0 ? " - " : " + ") + (k === 1 ? "" : k + "*") + "i"; tr2 = fS(x) + (sy < 0 ? " + " : " - ") + kqS(k, 3) + "*i"; }
        const c0 = t === "4" ? "\\frac{\\sqrt{2}}{2}" : "\\frac{1}{2}";
        return QX("Écris " + M("z = " + rT + "\\left(\\cos\\left(" + piT(th) + "\\right) + i\\sin\\left(" + piT(th) + "\\right)\\right)") + " sous la forme " + M("a + bi") + ".", ex,
          M("\\cos\\left(" + piT(th) + "\\right) = " + (sx < 0 ? "-" : "") + c0) + " et " + M("\\sin\\left(" + piT(th) + "\\right)") + (sy < 0 ? " est négatif" : " est positif") + " ; on multiplie par " + M(rT) + " : " + M("z = " + tx) + ".",
          { ctx: "forme-algebrique-" + t, guide: [GS("Partie réelle " + M(rT + "\\cos\\left(" + piT(th) + "\\right)") + " ?", x, M(fT(x)) + "."), GX(M("z") + " ?", ex, M(tx) + ".")],
            traps: [TX(tr1, t === "4" ? "Vérifie le signe de sin θ." : "Partie réelle = r·cos θ, partie imaginaire = r·sin θ : ne les échange pas."), TX(tr2, t === "4" ? "Vérifie le signe de cos θ." : "Vérifie le signe de sin θ.")] }); },
    ],
    2: [
      () => { const b = pk([[1, 1], [1, -1], [-1, 1], [-1, -1]]), n = R.int(3, 10), p = zpow(b, n); if (!p[0] && !p[1]) return null;
        return QZ("Calcule " + M("(" + zT(...b) + ")^{" + n + "}") + " sous la forme " + M("a + bi") + " (formule de Moivre).", p,
          M(zT(...b) + " = \\sqrt{2}\\," + ePi(princ(b[0] > 0 ? b[1] * 0.25 : b[1] * 0.75))) + " ; " + M("(\\sqrt{2})^{" + n + "} = " + (n % 2 ? kq(2 ** ((n - 1) / 2), 2) : 2 ** (n / 2))) + " et l'argument est multiplié par " + M(n) + " : " + M(zT(...p)) + ".",
          { ctx: "moivre", guide: [GS("Module de " + M("(" + zT(...b) + ")^{" + n + "}") + " ?", Math.SQRT2 ** n, M(n % 2 ? kq(2 ** ((n - 1) / 2), 2) : String(2 ** (n / 2))) + "."), GPi("Argument principal de " + M("(" + zT(...b) + ")^{" + n + "}") + " ?", princ(n * (b[0] > 0 ? b[1] * 0.25 : b[1] * 0.75)), M(piT(princ(n * (b[0] > 0 ? b[1] * 0.25 : b[1] * 0.75)))) + "."), GZ("Résultat ?", p, M(zT(...p)) + ".")],
            traps: [TZ([b[0] ** n, b[1] ** n], "(a + bi)ⁿ ≠ aⁿ + bⁿi : passe par le module et l'argument."), TZ([p[0], -p[1]], "Vérifie le signe : l'argument est multiplié par " + n + "."), TZ([-p[0], -p[1]], "Vérifie l'argument final (multiple de π/4).")] }); },
      () => { const r1 = pk([2, 3, 4, 6]), r2 = pk([2, 3, 5]), c1 = pk([1 / 6, 1 / 4, 1 / 3, 2 / 3, 3 / 4, 5 / 6, -1 / 3, -3 / 4]), c2 = pk([1 / 6, 1 / 4, 1 / 3, 1 / 2, -1 / 6, -1 / 4, 2 / 3]), t = pk(["mod-prod", "arg-prod", "arg-quot", "mod-quot"]);
        const z1 = M("z_1 = " + r1 + ePi(c1)), z2 = M("z_2 = " + r2 + ePi(c2)), prod = t.endsWith("prod"), arg = t.startsWith("arg"), ca = princ(prod ? c1 + c2 : c1 - c2), mod = prod ? r1 * r2 : r1 / r2;
        if (arg && (ca === 0 || ca === 1)) return null; if (r1 === r2) return null;
        const ex = prod ? "z_1 z_2" : "\\frac{z_1}{z_2}";
        if (arg) return QPi("Avec " + z1 + " et " + z2 + ", donne l'argument principal de " + M(ex) + ".", ca, "Les arguments " + (prod ? "s'additionnent" : "se soustraient") + " : " + M(piT(c1) + (prod ? " + " : " - ") + "\\left(" + piT(c2) + "\\right)") + ", ramené dans " + M("]-\\pi \\,;\\, \\pi]") + " : " + M(piT(ca)) + ".",
          { ctx: prod ? "argument-produit" : "argument-quotient", guide: [GPi("Argument (pas encore ramené) ?", q12(prod ? c1 + c2 : c1 - c2), M(piT(q12(prod ? c1 + c2 : c1 - c2))) + "."), GPi("Argument principal ?", ca, M(piT(ca)) + ".")],
            traps: [TR(princ(prod ? c1 - c2 : c1 + c2) * Math.PI, prod ? "Pour un produit, les arguments s'additionnent." : "Pour un quotient, les arguments se soustraient."), TR(princ(prod ? c1 * c2 : c1 / c2) * Math.PI, "On ne multiplie pas les arguments.")] });
        return QN("Avec " + z1 + " et " + z2 + ", donne le module de " + M(ex) + ".", mod, "Les modules " + (prod ? "se multiplient" : "se divisent") + " : " + M(prod ? r1 + " \\cdot " + r2 + " = " + mod : "\\frac{" + r1 + "}{" + r2 + "}" + (den(mod) < r2 ? " = " + fT(mod) : "")) + ".",
          { ctx: prod ? "module-produit" : "module-quotient", guide: [GS("Module ?", mod, M(fT(mod)) + ".")], traps: [TR(prod ? r1 + r2 : r1 - r2, prod ? "Les modules se multiplient." : "Les modules se divisent."), TR(prod ? r1 / r2 : r1 * r2, prod ? "C'est un produit, pas un quotient." : "C'est un quotient.")] }); },
      () => { const N = notable(2), n = R.int(3, 9), ca = princ(n * N.th); if (ca === 0 || ca === 1) return null;
        return QPi("Donne l'argument principal de " + M("z^{" + n + "}") + " avec " + M("z = " + N.tex) + ".", ca,
          M("\\arg z = " + piT(N.th)) + " ; " + M("\\arg z^{" + n + "} = " + n + " \\cdot " + "\\left(" + piT(N.th) + "\\right) = " + piT(q12(n * N.th))) + ", ramené dans " + M("]-\\pi \\,;\\, \\pi]") + " : " + M(piT(ca)) + ".",
          { ctx: "argument-puissance", guide: [GPi("Argument de " + M("z") + " ?", N.th, M(piT(N.th)) + "."), GPi(M(n) + " fois cet argument ?", q12(n * N.th), M(piT(q12(n * N.th))) + "."), GPi("Argument principal ?", ca, M(piT(ca)) + ".")],
            traps: [TR(N.th * Math.PI, "L'argument de zⁿ est n fois celui de z."), TR(q12(n * N.th) * Math.PI, "Ramène dans ]−π ; π] en ajoutant ou retirant des multiples de 2π."), TR(-ca * Math.PI, "Vérifie le signe de l'argument de z.")] }); },
    ],
    3: [
      () => { const t = pk(["3", "6"]), n = R.int(4, 9), c = t === "3" ? 1 / 3 : 1 / 6, re = R.rand() < 0.6, v = r6(2 ** n * (re ? Math.cos(n * c * Math.PI) : Math.sin(n * c * Math.PI))); if (!v) return null;
        const zz = t === "3" ? "1 + \\sqrt{3}i" : "\\sqrt{3} + i";
        return QN("Donne la partie " + (re ? "réelle" : "imaginaire") + " de " + M("(" + zz + ")^{" + n + "}") + " (valeur exacte).", v,
          M(zz + " = 2" + ePi(c)) + " ; Moivre : " + M("(" + zz + ")^{" + n + "} = 2^{" + n + "}" + ePi(princ(n * c))) + ", partie " + (re ? "réelle " + M("2^{" + n + "}\\cos\\left(" + piT(princ(n * c)) + "\\right)") : "imaginaire " + M("2^{" + n + "}\\sin\\left(" + piT(princ(n * c)) + "\\right)")) + " " + M("= " + (Number.isInteger(v) ? v : (v < 0 ? "-" : "") + kq(Math.round(Math.abs(v) / Math.sqrt(3)), 3))) + ".",
          { ctx: "partie-puissance-" + t, guide: [GS("Module de " + M(zz) + " ?", 2, M(2) + "."), GPi("Argument de " + M("(" + zz + ")^{" + n + "}") + " (ramené) ?", princ(n * c), M(piT(princ(n * c))) + "."), GS("Partie " + (re ? "réelle" : "imaginaire") + " ?", v, M(Number.isInteger(v) ? String(v) : "\\approx " + dT(v, 3)) + ".")],
            traps: [TR(-v, "Vérifie le signe du " + (re ? "cosinus" : "sinus") + " de l'argument final."), TR(r6(2 ** n * (re ? Math.sin(n * c * Math.PI) : Math.cos(n * c * Math.PI))), re ? "Partie réelle : r·cos θ (pas sin θ)." : "Partie imaginaire : r·sin θ (pas cos θ)."), TR(2 ** n, "Le module est 2ⁿ, mais il faut encore le cosinus ou le sinus de l'argument.")] }); },
      () => { const N = notable(2), pos = R.rand() < 0.5, p = Math.round(N.th * 12), g = (a, b) => (b ? g(b, a % b) : Math.abs(a)), d = 12 / g(p, 12), pn = p / g(p, 12), n = pos ? (Math.abs(pn) % 2 ? 2 * d : d) : d;
        return QN("Quel est le plus petit entier " + M("n \\geq 1") + " tel que " + M("(" + N.tex + ")^n") + " soit un nombre réel" + (pos ? " positif" : "") + " ?", n,
          M("\\arg = " + piT(N.th)) + " ; " + M("z^n") + " est réel" + (pos ? " positif" : "") + " quand " + M("n \\cdot " + piT(N.th)) + " est un multiple de " + M(pos ? "2\\pi" : "\\pi") + " : le plus petit " + M("n") + " est " + M(n) + ".",
          { ctx: pos ? "plus-petit-n-positif" : "plus-petit-n-reel", guide: [GPi("Argument de " + M(N.tex) + " ?", N.th, M(piT(N.th)) + "."), GS(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(pos ? (n === d ? 2 * d : d) : 2 * d, pos ? "Réel positif : l'argument doit être un multiple de 2π (réel seulement : multiple de π)." : "Réel : un multiple de π suffit (pas forcément 2π)."), TR(Math.abs(p), "Cherche n tel que n·θ soit un multiple de π.")] }); },
      () => { const N1 = notable(1), N2 = notable(1), a = R.int(2, 4), b = R.int(2, 3), ca = princ(a * N1.th - b * N2.th); if (ca === 0 || ca === 1 || N1.tex === N2.tex) return null;
        return QPi("Donne l'argument principal de " + M("\\frac{(" + N1.tex + ")^{" + a + "}}{(" + N2.tex + ")^{" + b + "}}") + ".", ca,
          M("\\arg = " + a + " \\cdot \\left(" + piT(N1.th) + "\\right) - " + b + " \\cdot \\left(" + piT(N2.th) + "\\right) = " + piT(q12(a * N1.th - b * N2.th))) + ", ramené dans " + M("]-\\pi \\,;\\, \\pi]") + " : " + M(piT(ca)) + ".",
          { ctx: "argument-quotient-puissances", guide: [GPi("Argument de " + M(N1.tex) + " ?", N1.th, M(piT(N1.th)) + "."), GPi("Argument de " + M(N2.tex) + " ?", N2.th, M(piT(N2.th)) + "."), GPi("Argument principal du quotient ?", ca, M(piT(ca)) + ".")],
            traps: [TR(princ(a * N1.th + b * N2.th) * Math.PI, "Pour un quotient, on soustrait l'argument du dénominateur."), TR(princ(N1.th - N2.th) * Math.PI, "Les exposants multiplient les arguments.")] }); },
    ],
  };

  // ======================= cplxeq : équations dans ℂ, racines n-ièmes, lieux (4.NC.03a–c, 04a–b) =======================
  const CE = {
    1: [
      () => { const sq = R.rand() < 0.5, k = R.int(2, 9), c = sq ? k * k : pk([2, 3, 5, 6, 7, 10, 11]), form = R.rand() < 0.5;
        const ans = sq ? zS(0, k) : "sqrt(" + c + ")*i", aT = sq ? zT(0, k) : "\\sqrt{" + c + "}\\,i";
        return QX("Résous " + M(form ? "z^2 + " + c + " = 0" : "z^2 = -" + c) + " dans " + M("\\mathbb{C}") + " et donne la solution de partie imaginaire positive.", ans,
          M("z^2 = -" + c + " = (" + aT + ")^2") + " car " + M("i^2 = -1") + " : solutions " + M("\\pm " + aT) + ".",
          { ctx: "carre-negatif", guide: [GX("Solution de partie imaginaire positive ?", ans, M(aT) + ".")],
            traps: [TX(sq ? String(k) : "sqrt(" + c + ")", "Dans ℝ, pas de solution ; dans ℂ, i² = −1 donne des solutions imaginaires."), TX(sq ? zS(0, -k) : "-sqrt(" + c + ")*i", "On demande la solution de partie imaginaire positive."), TX(zS(0, c), "N'oublie pas la racine carrée.")] }); },
      () => { const p = nz(-5, 5), q = R.int(1, 5), b = -2 * p, c = p * p + q * q, D = b * b - 4 * c;
        return chk(QN("Calcule le discriminant de " + M("z^2 " + (b < 0 ? "- " + (-b === 1 ? "" : -b) : "+ " + (b === 1 ? "" : b)) + "z + " + c + " = 0") + ".", D,
          M("\\Delta = b^2 - 4ac = " + par(b) + "^2 - 4 \\cdot " + c + " = " + D) + " < 0 : deux solutions complexes conjuguées.",
          { ctx: "discriminant", guide: [GS(M("b^2") + " ?", b * b, M(b * b) + "."), GS(M("\\Delta") + " ?", D, M(D) + ".")],
            traps: [TR(b * b + 4 * c, "Δ = b² − 4ac : on soustrait."), TR(-b * b - 4 * c, "b² est positif, même si b < 0."), TR(b * b - 2 * c, "Δ = b² − 4ac.")] })); },
      () => { const p = nz(-5, 5), q = R.int(2, 6), b = -2 * p, c = p * p + q * q;
        return QZ("Résous " + M("z^2 " + (b < 0 ? "- " + -b : "+ " + b) + "z + " + c + " = 0") + " dans " + M("\\mathbb{C}") + " et donne la solution de partie imaginaire positive.", [p, q],
          M("\\Delta = " + b * b + " - " + 4 * c + " = " + (b * b - 4 * c) + " = (" + 2 * q + "i)^2") + " ; " + M("z = \\frac{" + -b + " \\pm " + 2 * q + "i}{2}") + ", soit " + M(zT(p, q)) + " et " + M(zT(p, -q)) + ".",
          { ctx: "trinome", guide: [GS(M("\\Delta") + " ?", b * b - 4 * c, M(b * b - 4 * c) + "."), GZ("Une racine carrée de " + M("\\Delta") + " (partie imaginaire positive) ?", [0, 2 * q], M(2 * q + "i") + "."), GZ("Solution ?", [p, q], M(zT(p, q)) + ".")],
            traps: [TZ([p, -q], "On demande celle de partie imaginaire positive."), TZ([-p, q], "z = (−b ± √Δ) ÷ 2 : attention au signe de −b."), TZ([p, 2 * q], "Divise aussi la partie imaginaire par 2.")] }); },
    ],
    2: [
      () => { const a = pk([2, 3]), p = nz(-4, 4), q = R.int(1, 4), b = -2 * a * p, c = a * (p * p + q * q);
        return QZ("Résous " + M(a + "z^2 " + (b < 0 ? "- " + -b : "+ " + b) + "z + " + c + " = 0") + " dans " + M("\\mathbb{C}") + " ; donne la solution de partie imaginaire positive.", [p, q],
          M("\\Delta = " + b * b + " - " + 4 * a * c + " = " + (b * b - 4 * a * c) + " = (" + 2 * a * q + "i)^2") + ", " + M("z = \\frac{" + -b + " \\pm " + 2 * a * q + "i}{" + 2 * a + "} = " + zT(p, q) + " \\text{ ou } " + zT(p, -q)) + ".",
          { ctx: "trinome-a", guide: [GS(M("\\Delta") + " ?", b * b - 4 * a * c, M(b * b - 4 * a * c) + "."), GZ("Solution ?", [p, q], M(zT(p, q)) + ".")],
            traps: [TZ([p * a, q * a], "Divise par 2a = " + 2 * a + ", pas par 2."), TZ([p, -q], "On demande la solution de partie imaginaire positive."), TZ([-p, q], "z = (−b ± √Δ) ÷ 2a : attention au signe.")] }); },
      () => { const p = nz(-5, 5), q = nz(-5, 5), cAsk = R.rand() < 0.5, b = -2 * p, c = p * p + q * q, v = cAsk ? c : b; if (Math.abs(p) === Math.abs(q)) return null;
        return chk(QN("Le nombre " + M(zT(p, q)) + " est solution de " + M("z^2 + bz + c = 0") + " avec " + M("b") + " et " + M("c") + " réels. Donne " + M(cAsk ? "c" : "b") + ".", v,
          "Les coefficients sont réels : l'autre solution est le conjugué " + M(zT(p, -q)) + ". " + (cAsk ? "Produit des solutions : " + M("c = (" + zT(p, q) + ")(" + zT(p, -q) + ") = " + par(p) + "^2 + " + par(q) + "^2 = " + c) : "Somme des solutions : " + M("-b = " + 2 * p) + ", donc " + M("b = " + b)) + ".",
          { ctx: cAsk ? "coefficients-c" : "coefficients-b", guide: [GZ("Autre solution ?", [p, -q], M(zT(p, -q)) + "."), GS(cAsk ? "Produit des solutions (" + M("c") + ") ?" : M("b") + " (opposé de la somme) ?", v, M(v) + ".")],
            traps: cAsk ? [TR(p * p - q * q, "(a + bi)(a − bi) = a² + b²."), TR(-c, "Le produit des solutions vaut c.")] : [TR(2 * p, "La somme des solutions vaut −b."), TR(-p, "La somme des deux solutions conjuguées vaut 2a.")] })); },
      () => { const a = nz(-5, 5), b = nz(-5, 5), r = R.int(2, 6), t = R.rand() < 0.5;
        if (t) { const v = a + r;
          return chk(QN("Dans le plan complexe, l'ensemble des points d'affixe " + M("z") + " tels que " + M("|z - (" + zT(a, b) + ")| = " + r) + " est un cercle. Quelle est la plus grande partie réelle d'un point de ce cercle ?", v,
            "Cercle de centre " + M("(" + a + " \\,;\\, " + b + ")") + " et de rayon " + M(r) + " : le point le plus à droite a pour partie réelle " + M(a + " + " + r + " = " + v) + ".",
            { ctx: "lieu-cercle", guide: [GS("Partie réelle du centre ?", a, M(a) + "."), GS("Plus grande partie réelle ?", v, M(v) + ".")],
              traps: [TR(a - r, "C'est le point le plus à gauche."), TR(b + r, "La partie réelle se lit sur l'axe horizontal : centre " + a + "."), TR(-a + r, "|z − (a + bi)| : le centre est (a ; b), pas (−a ; −b).")] })); }
        const c = nz(-5, 5), d = nz(-5, 5); if (d === b) return null; const k = ((c * c + d * d) - (a * a + b * b)) / 2, y0 = k / (d - b); if (c === a) return null;
        return QN("L'ensemble des points d'affixe " + M("z") + " tels que " + M("|z - (" + zT(a, b) + ")| = |z - (" + zT(c, d) + ")|") + " est une droite. Donne son ordonnée à l'origine (fraction acceptée).", y0,
          "C'est la médiatrice de " + M("A(" + a + " \\,;\\, " + b + ")") + " et " + M("B(" + c + " \\,;\\, " + d + ")") + " : " + M(lc([2 * (c - a), 2 * (d - b)], ["x", "y"]) + " = " + (2 * k)) + " ; pour " + M("x = 0") + " : " + M("y = " + fT(y0)) + ".",
          { ctx: "lieu-mediatrice", guide: [GS("Coefficient de " + M("y") + " dans l'équation " + M(lc([2 * (c - a)], ["x"]) + " + \\ldots y = " + 2 * k) + " ?", 2 * (d - b), M(2 * (d - b)) + "."), GS("Ordonnée à l'origine ?", y0, M(fT(y0)) + ".")],
            traps: [TR((b + d) / 2, "La médiatrice passe par le milieu, mais elle n'est pas horizontale : écris son équation."), TR(-y0, "Développe |z − a|² = |z − b|² avec soin (signes).")] }); },
    ],
    3: [
      () => { const n = pk([3, 4, 5, 6]), s = pk([2, 3]), R0 = s ** n, phi = pk([0.5, 1, -0.5, 1 / 3, 2 / 3, 0.25]), mod = R.rand() < 0.35;
        if (mod) return QN("On résout " + M("z^{" + n + "} = " + nb(R0) + ePi(phi)) + ". Quel est le module commun des solutions ?", s, "Chaque solution a pour module " + M("\\sqrt[" + n + "]{" + nb(R0) + "} = " + s) + ".",
          { ctx: "racines-n-module", guide: [GS("Module ?", s, M(s) + ".")], traps: [TR(R0 / n, "Le module est la racine " + n + "-ième, pas une division par " + n + "."), TR(R0, "Prends la racine " + n + "-ième du module.")] });
        const th0 = phi / n, small = th0 > 0 ? th0 : th0 + 2 / n;
        return QPi("On résout " + M("z^{" + n + "} = " + nb(R0) + ePi(phi)) + ". Parmi les " + n + " solutions, quel est le plus petit argument strictement positif ?", small,
          "Solutions " + M("z_k = " + s + "e^{i\\left(" + piT(th0) + " + \\frac{2k\\pi}{" + n + "}\\right)}") + " ; arguments espacés de " + M(piT(2 / n)) + " : le plus petit positif est " + M(piT(small)) + ".",
          { ctx: "racines-n-argument", guide: [GPi("Argument divisé par " + M(n) + " ?", th0, M(piT(th0)) + "."), GPi("Écart entre deux solutions ?", r6(2 / n), M(piT(r6(2 / n))) + "."), GPi("Plus petit argument positif ?", small, M(piT(small)) + ".")],
            traps: [TR(phi * Math.PI, "On divise l'argument par " + n + "."), TR(r6(2 / n) * Math.PI, "Les solutions sont espacées de 2π ÷ " + n + ", mais la première a l'argument φ ÷ " + n + "."), TR(r6(phi / n + 2 / n) * Math.PI, "Vérifie s'il existe un argument positif plus petit.")] }); },
      () => { const k = R.int(2, 5), t = pk(["i", "-i", "1", "-1"]), K = k ** 3;
        const rhs = t === "i" ? zT(0, K) : t === "-i" ? zT(0, -K) : t === "1" ? String(K) : String(-K), imag = t.includes("i"), ans = t === "i" ? [0, -k] : t === "-i" ? [0, k] : t === "1" ? [k, 0] : [-k, 0];
        return QZ("Résous " + M("z^3 = " + rhs) + " dans " + M("\\mathbb{C}") + ". Donne la solution " + (imag ? "imaginaire pure" : "réelle") + ".", ans,
          "Module " + M("\\sqrt[3]{" + K + "} = " + k) + " ; " + (imag ? M("(" + zT(...ans) + ")^3 = " + fT(ans[1] ** 3) + "i^3 = " + rhs) + " (car " + M("i^3 = -i") + ")" : M("(" + ans[0] + ")^3 = " + rhs)) + ", donc " + M("z = " + zT(...ans)) + ". Les deux autres solutions s'obtiennent en tournant de " + M("\\frac{2\\pi}{3}") + ".",
          { ctx: "racine-cubique", guide: [GS("Module des solutions ?", k, M(k) + "."), GZ("Solution " + (imag ? "imaginaire pure" : "réelle") + " ?", ans, M(zT(...ans)) + ".")],
            traps: [TZ(ans.map((x) => -x), imag ? "i³ = −i : vérifie le signe en calculant le cube." : "Le cube d'un négatif est négatif."), TZ(imag ? [k, 0] : [0, k], imag ? "On cherche la solution imaginaire pure." : "On cherche la solution réelle.")] }); },
      () => { const z1 = nz(-4, 4), z2 = [nz(-4, 4), nz(-4, 4)], S = [z1 + z2[0], z2[1]], Pp = [z1 * z2[0], z1 * z2[1]];
        return QZ("Le nombre " + M(z1) + " est solution de " + M("z^2 - (" + zT(...S) + ")z + " + zP(...Pp) + " = 0") + ". Trouve l'autre solution.", z2,
          "La somme des solutions vaut " + M(zT(...S)) + " (coefficient de z changé de signe) : l'autre solution est " + M(zT(...S) + " - " + par(z1) + " = " + zT(...z2)) + ". Vérifie : produit " + M(z1 + " \\cdot (" + zT(...z2) + ") = " + zT(...Pp)) + ".",
          { ctx: "autre-racine", guide: [GZ("Somme des deux solutions ?", S, M(zT(...S)) + "."), GZ("Autre solution ?", z2, M(zT(...z2)) + ".")],
            traps: [TZ([z2[0], -z2[1]], "Les coefficients ne sont pas réels : l'autre solution n'est pas forcément le conjugué."), TZ([S[0] + z1, S[1]], "Somme des solutions = " + zS(...S) + " : on soustrait " + z1 + "."), TZ([-z2[0], -z2[1]], "z² − Sz + P : la somme vaut S (pas −S).")] }); },
    ],
  };

  // ======================= suitegeom : suites arithmétiques et géométriques (4.AN.10a–c) =======================
  const SG = {
    1: [
      () => { const u1 = R.int(-20, 40), r = pk([3, 4, 5, 7, -2, -3, -4, 2.5, 1.5]), n = R.int(15, 60), v = r6(u1 + (n - 1) * r); if (!u1) return null;
        return QN("Suite arithmétique de premier terme " + M("u_1 = " + u1) + " et de raison " + M("r = " + dT(r)) + ". Calcule " + M("u_{" + n + "}") + ".", v,
          M("u_n = u_1 + (n - 1)r") + " : " + M("u_{" + n + "} = " + u1 + " + " + (n - 1) + " \\cdot " + par(r) + " = " + dT(v)) + ".",
          { ctx: "arith-terme", guide: [GS("Combien de fois ajoute-t-on la raison pour aller de " + M("u_1") + " à " + M("u_{" + n + "}") + " ?", n - 1, M(n - 1) + "."), GS(M("u_{" + n + "}") + " ?", v, M(dT(v)) + ".")],
            traps: [TR(r6(u1 + n * r), "De u₁ à u_" + n + ", on ajoute la raison " + (n - 1) + " fois (pas " + n + ")."), TR(r6(n * r), "N'oublie pas le premier terme."), TR(r6(u1 * r ** (n - 1)), "Suite arithmétique : on ajoute la raison, on ne multiplie pas.")] }); },
      () => { const q = pk([2, 3, -2, 0.5]), n = q === 0.5 ? R.int(4, 7) : R.int(5, 9), u1 = q === 0.5 ? pk([3, 5, 7]) * 2 ** (n - 1) : pk([2, 3, 5, -3, 7]), v = r6(u1 * q ** (n - 1));
        return QN("Suite géométrique de premier terme " + M("u_1 = " + nb(u1)) + " et de raison " + M("q = " + dT(q)) + ". Calcule " + M("u_{" + n + "}") + ".", v,
          M("u_n = u_1 \\cdot q^{n - 1}") + " : " + M("u_{" + n + "} = " + nb(u1) + " \\cdot " + par(q) + "^{" + (n - 1) + "} = " + nb(v)) + ".",
          { ctx: "geo-terme", guide: [GS("Exposant de " + M("q") + " ?", n - 1, M(n - 1) + "."), GS(M("u_{" + n + "}") + " ?", v, M(nb(v)) + ".")],
            traps: [TR(r6(u1 * q ** n), "De u₁ à u_" + n + ", on multiplie " + (n - 1) + " fois par q."), TR(r6(u1 + (n - 1) * q), "Suite géométrique : on multiplie par la raison."), TR(-v, "Avec une raison négative, le signe alterne : vérifie la parité de l'exposant.")] }); },
      () => { const geo = R.rand() < 0.5;
        if (geo) { const q = pk([2, 3, -2, -3]), a = R.int(1, 3), gap = pk([2, 3]), u1 = pk([1, 2, 3, 5]), ua = u1 * q ** (a - 1), ub = ua * q ** gap, v = q; if (gap === 2 && q < 0) return null;
          return QN("Dans une suite géométrique, " + M("u_{" + a + "} = " + nb(ua)) + " et " + M("u_{" + (a + gap) + "} = " + nb(ub)) + ". Quelle est la raison " + M("q") + " ?", v,
            M("u_{" + (a + gap) + "} = u_{" + a + "} \\cdot q^{" + gap + "}") + ", donc " + M("q^{" + gap + "} = \\frac{" + nb(ub) + "}{" + nb(ua) + "} = " + q ** gap) + " et " + M("q = " + q) + ".",
            { ctx: "raison-geo", guide: [GS(M("q^{" + gap + "}") + " ?", q ** gap, M(q ** gap) + "."), GS(M("q") + " ?", q, M(q) + ".")],
              traps: [TR(q ** gap, "C'est q^" + gap + " : prends la racine."), TR(r6((ub - ua) / gap), "Suite géométrique : on divise les termes, on ne les soustrait pas."), TR(-q, "Vérifie le signe avec u_" + a + " et u_" + (a + gap) + ".")] }); }
        const r = pk([3, 4, 6, -5, 2.5]), a = R.int(2, 6), b = a + R.int(4, 9), ua = R.int(-10, 30), ub = r6(ua + (b - a) * r);
        return QN("Dans une suite arithmétique, " + M("u_{" + a + "} = " + ua) + " et " + M("u_{" + b + "} = " + dT(ub)) + ". Quelle est la raison " + M("r") + " ?", r,
          M("u_{" + b + "} - u_{" + a + "} = (" + b + " - " + a + ")r") + " : " + M("r = \\frac{" + dT(r6(ub - ua)) + "}{" + (b - a) + "} = " + dT(r)) + ".",
          { ctx: "raison-arith", guide: [GS(M("u_{" + b + "} - u_{" + a + "}") + " ?", r6(ub - ua), M(dT(r6(ub - ua))) + "."), GS(M("r") + " ?", r, M(dT(r)) + ".")],
            traps: [TR(r6((ub - ua) / (b - a + 1)), "Entre u_" + a + " et u_" + b + ", il y a " + (b - a) + " pas (pas " + (b - a + 1) + ")."), TR(r6(ub - ua), "Divise par le nombre de pas, " + (b - a) + ".")] }); },
    ],
    2: [
      () => { const c = pk([["Les gradins d'une salle : la première rangée compte", "places, chaque rangée en a", "de plus que la précédente. Combien de places en tout dans les", "rangées ?", "gradins"], ["Un coureur s'entraîne : le premier jour, il court", "minutes, puis chaque jour", "minutes de plus. Combien de minutes en tout sur les", "premiers jours ?", "course"], ["Une élève épargne : le premier mois, elle met de côté", "CHF, puis chaque mois", "CHF de plus. Combien a-t-elle épargné en tout après", "mois ?", "epargne"]]);
        const u1 = R.int(12, 30), r = R.int(2, 5), n = R.int(12, 30), un = u1 + (n - 1) * r, S = (n * (u1 + un)) / 2;
        return QN(c[0] + " " + u1 + " " + c[1] + " " + r + " " + c[2] + " " + n + " " + c[3], S,
          "Suite arithmétique : " + M("u_{" + n + "} = " + u1 + " + " + (n - 1) + " \\cdot " + r + " = " + un) + " ; " + M("S = \\frac{" + n + "(u_1 + u_{" + n + "})}{2} = \\frac{" + n + " \\cdot " + (u1 + un) + "}{2} = " + nb(S)) + ".",
          { ctx: "somme-arith-" + c[4], guide: [GS("Dernier terme " + M("u_{" + n + "}") + " ?", un, M(un) + "."), GS("Somme ?", S, M(nb(S)) + ".")],
            traps: [TR(n * u1, "Les termes augmentent : la somme est n × (premier + dernier) ÷ 2."), TR(n * (u1 + un), "N'oublie pas de diviser par 2."), TR((n * (u1 + u1 + n * r)) / 2, "Le dernier terme est u₁ + (n − 1)r.")] }); },
      () => { const c = pk([["Un message est transféré : le premier jour,", "personnes le reçoivent ; chaque jour, chacune le transmet à", "nouvelles personnes. Combien de personnes l'ont reçu en tout après", "jours ?", "message"], ["Sur un échiquier, on pose", "grains sur la première case, puis on multiplie par", "à chaque case. Combien de grains en tout sur les", "premières cases ?", "grains"], ["Une plante a", "feuilles la première semaine ; leur nombre est multiplié par", "chaque semaine. Combien de feuilles sont apparues en tout en", "semaines ?", "plante"]]);
        const u1 = pk([2, 3, 5]), q = pk([2, 3]), n = R.int(5, 9), S = (u1 * (q ** n - 1)) / (q - 1);
        return QN(c[0] + " " + u1 + " " + c[1] + " " + q + " " + c[2] + " " + n + " " + c[3], S,
          "Suite géométrique de raison " + M(q) + " : " + M("S = u_1 \\cdot \\frac{q^n - 1}{q - 1} = " + u1 + " \\cdot \\frac{" + q + "^{" + n + "} - 1}{" + (q - 1) + "} = " + nb(S)) + ".",
          { ctx: "somme-geo-" + c[4], guide: [GS(M(q + "^{" + n + "}") + " ?", q ** n, M(nb(q ** n)) + "."), GS("Somme ?", S, M(nb(S)) + ".")],
            traps: [TR(u1 * q ** (n - 1), "C'est le dernier terme ; on demande la somme."), TR((u1 * (q ** (n + 1) - 1)) / (q - 1), "Il y a " + n + " termes : exposant " + n + "."), TR(u1 * n * q, "Suite géométrique : utilise la formule de la somme.")] }); },
      () => { const u1 = pk([100, 200, 500, 800, 50]), q = pk([1.05, 1.08, 1.1, 1.2, 1.5, 2]), S = u1 * pk([3, 5, 10, 20]), n = Math.floor(Math.log(S / u1) / Math.log(q)) + 2; if (u1 * q ** (n - 2) > S || u1 * q ** (n - 1) <= S) return null;
        return QN("Suite géométrique : " + M("u_1 = " + u1) + ", " + M("q = " + dT(q)) + ". À partir de quel rang " + M("n") + " a-t-on " + M("u_n > " + nb(S)) + " ?", n,
          M(u1 + " \\cdot " + dT(q) + "^{n - 1} > " + nb(S) + " \\iff n - 1 > \\frac{\\ln(" + nb(S / u1) + ")}{\\ln(" + dT(q) + ")} \\approx " + dT(Math.log(S / u1) / Math.log(q), 2)) + " ; donc " + M("n = " + n) + ".",
          { ctx: "seuil", guide: [GS(M("\\frac{\\ln(" + nb(S / u1) + ")}{\\ln(" + dT(q) + ")}") + " (" + RND[0.01] + ") ?", Math.log(S / u1) / Math.log(q), M("\\approx " + dT(Math.log(S / u1) / Math.log(q), 2)) + ".", 0.01), GS("Rang " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "C'est n − 1 qui dépasse " + dS(Math.log(S / u1) / Math.log(q), 2) + " : ajoute 1."), TR(n + 1, "Vérifie : u_" + n + " dépasse déjà " + S + "."), TR(Math.ceil(S / u1), "Utilise le logarithme pour isoler l'exposant.")] }); },
    ],
    3: [
      () => { const u1 = R.int(2, 9), r = pk([2, 3, 4]), n = R.int(10, 30), S = (n * (2 * u1 + (n - 1) * r)) / 2;
        return QN("Suite arithmétique : " + M("u_1 = " + u1) + ", " + M("r = " + r) + ". Combien de termes faut-il additionner pour obtenir " + M("S_n = " + nb(S)) + " ?", n,
          M("S_n = \\frac{n(2u_1 + (n - 1)r)}{2}") + " : " + M(r + "n^2" + (2 * u1 - r ? " + " + (2 * u1 - r) + "n" : "") + " - " + 2 * S + " = 0") /* 27.11 : 2u₁ = r sans « + 0n » */ + " ; la solution positive est " + M("n = " + n) + ".",
          { ctx: "nombre-termes", guide: [GS("Équation " + M(r + "n^2" + (2 * u1 - r ? " + " + (2 * u1 - r) + "n" : "") + " - c = 0") + " : que vaut " + M("c = 2S_n") + " ?", 2 * S, M(nb(2 * S)) + "."), GS(M("n") + " (solution positive) ?", n, M(n) + ".")],
            traps: [TR(Math.round(S / u1), "Les termes augmentent : résous l'équation du second degré."), TR(Math.round(Math.sqrt(S)), "Résous r·n² + (2u₁ − r)·n − 2S = 0."), TR(n + 1, "Vérifie avec la formule de la somme.")] }); },
      () => { const D = pk([1000, 1200, 1500, 2000, 2400]), t = pk([0.01, 0.015, 0.02, 0.025]), n = R.int(5, 15), V = (D * ((1 + t) ** n - 1)) / t;
        return QR("Chaque 1er janvier, on verse " + M(nb(D)) + " CHF sur un compte rémunéré à " + M(dT(t * 100) + "\\,\\%") + " par an (intérêts composés). Combien vaut le compte juste après le " + n + "e versement (" + RND[0.01] + ") ?", V, 0.01,
          "Le premier versement a gagné des intérêts pendant " + M(n - 1) + " ans, …, le dernier pas encore : " + M("S = " + nb(D) + " \\cdot \\frac{" + dT(1 + t) + "^{" + n + "} - 1}{" + dT(t) + "} \\approx " + dT(rd(V, 0.01), 2)) + " CHF.",
          { ctx: "epargne", guide: [GS("Valeur du premier versement après " + M(n - 1) + " ans (" + RND[0.01] + ") ?", D * (1 + t) ** (n - 1), M("\\approx " + dT(rd(D * (1 + t) ** (n - 1), 0.01), 2)) + ".", 0.01), GS("Somme des " + M(n) + " termes (" + RND[0.01] + ") ?", V, M("\\approx " + dT(rd(V, 0.01), 2)) + ".", 0.01)],
            traps: [TR(n * D, "Les intérêts s'ajoutent : c'est une somme géométrique de raison " + dS(1 + t) + "."), TR(D * (1 + t) ** n, "C'est la valeur d'un seul versement."), TR((D * ((1 + t) ** (n + 1) - 1)) / t, "Il y a " + n + " versements : exposant " + n + ".")] }); },
      () => { const a = pk([2, 3, 0.5]), l = nz(-6, 6), u0 = l + nz(-4, 4) * (a === 0.5 ? 8 : 1), b = r6(l * (1 - a)), n = a === 0.5 ? R.int(2, 3) : R.int(3, 5), v = r6(l + (u0 - l) * a ** n); if (!b || u0 === l) return null;
        return QN("On définit " + M("u_0 = " + u0) + " et " + M("u_{n + 1} = " + dT(a) + "u_n " + (b < 0 ? "- " + dT(-b) : "+ " + dT(b))) + ". En posant " + M("v_n = u_n - " + par(l)) + " (suite géométrique), calcule " + M("u_{" + n + "}") + ".", v,
          "Point fixe " + M("\\ell = " + dT(a) + "\\ell " + (b < 0 ? "- " + dT(-b) : "+ " + dT(b)) + " \\iff \\ell = " + l) + " ; " + M("v_n = u_n - \\ell") + " est géométrique de raison " + M(dT(a)) + " et " + M("v_0 = " + (u0 - l)) + " : " + M("u_{" + n + "} = " + l + " + " + par(u0 - l) + " \\cdot " + dT(a) + "^{" + n + "} = " + dT(v)) + ".",
          { ctx: "arithmetico-geometrique", guide: [GS(M("v_0 = u_0 - " + par(l)) + " ?", u0 - l, M(u0 - l) + "."), GS(M("v_{" + n + "} = v_0 \\cdot " + dT(a) + "^{" + n + "}") + " ?", r6((u0 - l) * a ** n), M(dT(r6((u0 - l) * a ** n))) + "."), GS(M("u_{" + n + "}") + " ?", v, M(dT(v)) + ".")],
            traps: [TR(r6((u0 - l) * a ** n), "C'est v_" + n + " : u_n = v_n + " + l + "."), TR(r6(u0 * a ** n), "La suite u n'est pas géométrique (à cause du + " + dS(b) + ") : passe par v."), TR(r6(l + (u0 - l) * a ** (n - 1)), "v_n = v₀·qⁿ (on part de l'indice 0).")] }); },
    ],
  };

  // ======================= serie : séries géométriques, convergence, Taylor (4.AN.10d, 4.AN.11a–c) =======================
  const SE = {
    1: [
      () => { const a = pk([2, 3, 4, 5, 6, 8, 9, 12]), q = pk([0.5, 0.25, 0.2, -0.5, 1 / 3, 2 / 3, 0.75, -1 / 3]), S = a / (1 - q);
        return QN("Calcule la somme de la série géométrique " + M(a + " + " + par(a * q) + " + " + par(r6(a * q * q)) + " + \\ldots") + " (raison " + M(fT(q)) + ", fraction acceptée).", S,
          M("|q| < 1") + " : la série converge et " + M("S = \\frac{u_0}{1 - q} = \\frac{" + a + "}{1 - " + par(q) + "} = " + fT(S)) + ".",
          { ctx: "somme-infinie", guide: [GS(M("1 - q") + " ?", r6(1 - q), M(fT(r6(1 - q))) + "."), GS("Somme ?", S, M(fT(S)) + ".")],
            traps: [TR(a / (1 + q), "S = u₀ ÷ (1 − q)."), TR(a * q / (1 - q), "Le premier terme est " + a + " (il compte aussi)."), TR(a / q, "S = u₀ ÷ (1 − q).")] }); },
      () => { const two = R.rand() < 0.6, ab = two ? R.int(10, 98) : R.int(1, 9); if (ab % 11 === 0 || (two && ab < 10)) return null; const pre = R.rand() < 0.4 ? R.int(1, 9) : 0, d = two ? 99 : 9, v = r6(pre / 10 + (pre ? ab / (10 * d) : ab / d));
        const tx = pre ? "0{,}" + pre + "\\overline{" + ab + "}" : "0{,}\\overline{" + ab + "}";
        return QN("Écris le nombre périodique " + M(tx) + " sous forme de fraction irréductible.", v,
          M(pre ? tx + " = \\frac{" + pre + "}{10} + \\frac{1}{10} \\cdot 0{,}\\overline{" + ab + "}" : tx) + " ; " + M("0{,}\\overline{" + ab + "} = \\frac{" + ab + "}{" + nb(10 ** (two ? 2 : 1)) + "} \\cdot \\frac{1}{1 - \\frac{1}{" + nb(10 ** (two ? 2 : 1)) + "}} = \\frac{" + ab + "}{" + d + "}") + (pre ? "" : "") + " ; résultat " + M(fT(v)) + ".",
          { ctx: pre ? "periodique-decale" : "periodique", guide: [GS(M("0{,}\\overline{" + ab + "}") + " en fraction ?", ab / d, M(fT(ab / d)) + "."), GS("Résultat ?", v, M(fT(v)) + ".")],
            traps: [TR(pre ? pre / 10 + ab / (10 * 10 ** (two ? 2 : 1)) : ab / 10 ** (two ? 2 : 1), "La période se répète sans fin : c'est une série géométrique de raison 1/" + (two ? 100 : 10) + "."), TR(pre ? pre / 10 + ab / d : ab / (d + 1), pre ? "La période commence au 2e chiffre après la virgule : divise aussi par 10." : "Divise par " + d + " (autant de 9 que de chiffres dans la période).")] }); },
      () => { const h = pk([1, 1.5, 2, 3, 4]), q = pk([0.5, 0.6, 0.75, 0.8, 0.4]), D = h + (2 * h * q) / (1 - q);
        return QN("On lâche une balle d'une hauteur de " + M(dT(h) + "\\text{ m}") + ". À chaque rebond, elle remonte à " + M(pct(q, 0)) + " de la hauteur précédente. Quelle distance totale (montées et descentes) parcourt-elle avant de s'arrêter (en m, fraction acceptée) ?", D,
          "Descente " + M(dT(h)) + ", puis chaque rebond compte deux fois (montée et descente) : " + M(dT(h) + " + 2 \\cdot \\frac{" + dT(h) + " \\cdot " + dT(q) + "}{1 - " + dT(q) + "} = " + fT(D)) + " m.",
          { ctx: "balle", guide: [GS("Somme des hauteurs des rebonds " + M(dT(h * q) + " + " + dT(r6(h * q * q)) + " + \\ldots") + " ?", (h * q) / (1 - q), M(fT((h * q) / (1 - q))) + "."), GS("Distance totale ?", D, M(fT(D)) + " m.")],
            traps: [TR(h / (1 - q), "Chaque rebond est parcouru deux fois (montée et descente)."), TR((2 * h) / (1 - q), "La première chute n'est parcourue qu'une fois."), TR((h * q) / (1 - q), "Ajoute la première chute et compte chaque rebond deux fois.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4, 5, 6]), S = pk([2, 3, 4, 5, 1.5, 2.5]), x = r6(k * (1 - 1 / S)); if (!x) return null;
        return QN("Pour quelle valeur de " + M("x") + " (avec " + M("|x| < " + k) + ") a-t-on " + M("\\sum_{n = 0}^{+\\infty} \\left(\\frac{x}{" + k + "}\\right)^n = " + dT(S)) + " ? (fraction acceptée)", x,
          "Série géométrique de raison " + M("\\frac{x}{" + k + "}") + " : " + M("\\frac{1}{1 - \\frac{x}{" + k + "}} = " + dT(S)) + ", donc " + M("1 - \\frac{x}{" + k + "} = " + fT(1 / S)) + " et " + M("x = " + fT(x)) + ".",
          { ctx: "parametre", guide: [GS("Raison " + M("\\frac{x}{" + k + "}") + " ?", r6(1 - 1 / S), M(fT(r6(1 - 1 / S))) + "."), GS(M("x") + " ?", x, M(fT(x)) + ".")],
            traps: [TR(r6(1 - 1 / S), "C'est x ÷ " + k + " : multiplie par " + k + "."), TR(r6(k * (S - 1)), "Somme = 1 ÷ (1 − q) : isole q correctement."), TR(r6(k / S), "1 − x/" + k + " = 1/" + dS(S) + ".")] }); },
      () => { const c = pk([2, 3, 4, 5]), d = pk([3, 5, 7, 2]), p = pk([1, 2, 3]), L = c / d; if (c === d || c % d === 0) return null;
        return QN("Pour la série de terme général " + M("a_n = \\frac{n^{" + p + "} \\cdot " + c + "^n}{" + d + "^n}") + ", calcule " + M("\\lim_{n \\to +\\infty} \\frac{a_{n + 1}}{a_n}") + " (critère de d'Alembert ; fraction acceptée).", L,
          M("\\frac{a_{n + 1}}{a_n} = \\left(\\frac{n + 1}{n}\\right)^{" + p + "} \\cdot \\frac{" + c + "}{" + d + "} \\to \\frac{" + c + "}{" + d + "}") + " ; " + (L < 1 ? "limite < 1 : la série converge." : "limite > 1 : la série diverge."),
          { ctx: "dalembert", guide: [GS("Limite de " + M("\\left(\\frac{n + 1}{n}\\right)^{" + p + "}") + " ?", 1, M(1) + "."), GS("Limite du quotient ?", L, M(fT(L)) + ".")],
            traps: [TR(d / c, "a_(n+1) ÷ a_n : " + c + "ⁿ⁺¹ ÷ " + c + "ⁿ = " + c + " au numérateur."), TR(r6((2 ** p) * L), "(n + 1)/n tend vers 1, donc sa puissance aussi."), TR(0, "Le facteur polynomial tend vers 1 dans le quotient ; il reste " + c + "/" + d + ".")] }); },
      () => { const a = pk([1, 2, 5, 10]), q = pk([0.5, 0.8, 0.9, 0.6, 0.75]), eps = pk([0.01, 0.001]), S = a / (1 - q), n = Math.ceil(Math.log((eps * (1 - q)) / a) / Math.log(q)); if (n < 2) return null;
        return QN("Série " + M("\\sum_{k = 0}^{+\\infty} " + (a === 1 ? "" : a + " \\cdot ") + dT(q) + "^k") + " de somme " + M("S") + ". Quel est le plus petit " + M("n") + " tel que l'écart " + M("S - S_n = \\frac{" + (a === 1 ? "" : a + " \\cdot ") + dT(q) + "^n}{1 - " + dT(q) + "}") + " soit inférieur à " + M(dT(eps)) + " ?", n,
          M("\\frac{" + (a === 1 ? "" : a + " \\cdot ") + dT(q) + "^n}{" + dT(r6(1 - q)) + "} < " + dT(eps) + " \\iff n > \\frac{\\ln(" + dT(r6((eps * (1 - q)) / a), 6) + ")}{\\ln(" + dT(q) + ")} \\approx " + dT(Math.log((eps * (1 - q)) / a) / Math.log(q), 2)) + " (on divise par " + M("\\ln(" + dT(q) + ") < 0") + " : le sens change) ; " + M("n = " + n) + ".",
          { ctx: "rang-precision", guide: [GS("Borne " + M("\\frac{\\ln(\\ldots)}{\\ln(" + dT(q) + ")}") + " (" + RND[0.01] + ") ?", Math.log((eps * (1 - q)) / a) / Math.log(q), M("\\approx " + dT(Math.log((eps * (1 - q)) / a) / Math.log(q), 2)) + ".", 0.01), GS(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Il faut un écart strictement inférieur : vérifie avec n − 1."), TR(Math.ceil(Math.log(eps / a) / Math.log(q)), "N'oublie pas le facteur 1 ÷ (1 − q)."), TR(n + 1, "n = " + n + " suffit déjà.")] }); },
    ],
    3: [
      () => { const koch = R.rand() < 0.5;
        if (koch) { const A0 = pk([9, 18, 27, 45, 90]), A = (8 * A0) / 5;
          return QN("Flocon de Koch : on part d'un triangle équilatéral d'aire " + M(A0 + "\\text{ cm}^2") + ". À chaque étape, sur chaque côté, on ajoute un triangle d'aire " + M("\\frac{1}{9}") + " de celle des triangles ajoutés à l'étape précédente, et le nombre de côtés est multiplié par 4. À la première étape, on ajoute 3 triangles d'aire " + M("\\frac{" + A0 + "}{9}") + ". Quelle est l'aire limite (en cm², fraction acceptée) ?", A,
            "Aires ajoutées : " + M("\\frac{" + A0 + "}{3}\\left(1 + \\frac{4}{9} + \\left(\\frac{4}{9}\\right)^2 + \\ldots\\right) = \\frac{" + A0 + "}{3} \\cdot \\frac{9}{5} = " + fT((3 * A0) / 5)) + " ; total " + M(A0 + " + " + fT((3 * A0) / 5) + " = " + fT(A)) + ".",
            { ctx: "flocon", guide: [GS("Aire ajoutée à la première étape ?", A0 / 3, M(fT(A0 / 3)) + "."), GS("Raison de la suite des aires ajoutées ?", 4 / 9, M("\\frac{4}{9}") + " (4 fois plus de triangles, 9 fois plus petits)."), GS("Aire limite ?", A, M(fT(A)) + ".")],
              traps: [TR(A0 + (A0 / 3) / (1 - 1 / 9), "Le nombre de triangles est multiplié par 4 : raison 4/9."), TR((A0 / 3) / (1 - 4 / 9), "Ajoute l'aire du triangle de départ."), TR(A0 / (1 - 4 / 9), "Le premier ajout vaut A₀ ÷ 3, puis raison 4/9.")] }); }
        const c = pk([4, 6, 8, 10, 12]), A = 2 * c * c;
        return QN("On dessine un carré de côté " + M(c + "\\text{ cm}") + ", puis le carré dont les sommets sont les milieux de ses côtés, et ainsi de suite sans fin. Quelle est la somme des aires de tous les carrés (en cm²) ?", A,
          "Chaque carré a une aire deux fois plus petite que le précédent : " + M(c * c + " \\cdot \\left(1 + \\frac{1}{2} + \\frac{1}{4} + \\ldots\\right) = " + c * c + " \\cdot 2 = " + A) + ".",
          { ctx: "carres-imbriques", guide: [GS("Aire du deuxième carré ?", (c * c) / 2, M(fT((c * c) / 2)) + "."), GS("Somme des aires ?", A, M(A) + ".")],
            traps: [TR((4 * c * c) / 3, "Chaque aire est la moitié de la précédente (raison 1/2, pas 1/4)."), TR(c * c, "Additionne les aires de tous les carrés."), TR(4 * c * 2, "On additionne des aires, pas des périmètres.")] }); },
      () => { const N = R.int(9, 99), two = R.rand() < 0.5, v = two ? 0.5 * (1.5 - 1 / (N + 1) - 1 / (N + 2)) : N / (N + 1);
        return QN("Calcule " + M(two ? "\\sum_{n = 1}^{" + N + "} \\frac{1}{n(n + 2)}" : "\\sum_{n = 1}^{" + N + "} \\frac{1}{n(n + 1)}") + " (fraction acceptée).", v,
          (two ? M("\\frac{1}{n(n + 2)} = \\frac{1}{2}\\left(\\frac{1}{n} - \\frac{1}{n + 2}\\right)") + " : presque tout se simplifie, il reste " + M("\\frac{1}{2}\\left(1 + \\frac{1}{2} - \\frac{1}{" + (N + 1) + "} - \\frac{1}{" + (N + 2) + "}\\right)") : M("\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}") + " : somme télescopique, il reste " + M("1 - \\frac{1}{" + (N + 1) + "}")) + " " + M("= " + fT(v)) + ".",
          { ctx: two ? "telescopique-2" : "telescopique", guide: [GS(two ? "Coefficient " + M("c") + " dans " + M("\\frac{1}{n(n + 2)} = c\\left(\\frac{1}{n} - \\frac{1}{n + 2}\\right)") + " ?" : "Premier terme qui reste, " + M("\\frac{1}{1}") + " ?", two ? 0.5 : 1, M(two ? "\\frac{1}{2}" : "1") + "."), GS("Somme ?", v, M(fT(v)) + ".")],
            traps: [TR(two ? 1.5 - 1 / (N + 1) - 1 / (N + 2) : 1, two ? "N'oublie pas le facteur 1/2." : "C'est la somme infinie ; ici on s'arrête à n = " + N + "."), TR(two ? 0.75 : 1 / (N + 1), two ? "C'est la somme infinie ; ici on s'arrête à n = " + N + "." : "Il reste 1 − 1/(N + 1)."), TR(two ? 0.5 * (1 - 1 / (N + 2)) : (N - 1) / N, "Écris les premiers et derniers termes : lesquels ne se simplifient pas ?")] }); },
      () => { const t = pk(["exp", "geo", "ln"]), a = pk([2, 3, -2, -3]), k = R.int(2, 5), fact = (m) => (m <= 1 ? 1 : m * fact(m - 1)); let v, fx, sol;
        if (t === "exp") { v = a ** k / fact(k); fx = "e^{" + a + "x}"; sol = M("e^{u} = \\sum \\frac{u^k}{k!}") + " avec " + M("u = " + a + "x") + " : coefficient " + M("\\frac{" + par(a) + "^{" + k + "}}{" + k + "!} = " + fT(v)); }
        else if (t === "geo") { v = a ** k; fx = "\\frac{1}{1 " + (a < 0 ? "+ " + -a : "- " + a) + "x}"; sol = M("\\frac{1}{1 - u} = 1 + u + u^2 + \\ldots") + " avec " + M("u = " + a + "x") + " : coefficient " + M(par(a) + "^{" + k + "} = " + v); }
        else { v = ((-1) ** (k + 1) * a ** k) / k; fx = "\\ln(1 " + (a < 0 ? "- " + -a : "+ " + a) + "x)"; sol = M("\\ln(1 + u) = u - \\frac{u^2}{2} + \\frac{u^3}{3} - \\ldots") + " avec " + M("u = " + a + "x") + " : coefficient " + M(fT(v)); }
        return QN("Dans le développement de Mac-Laurin de " + M("f(x) = " + fx) + ", quel est le coefficient de " + M("x^{" + k + "}") + " ? (fraction acceptée)", v, sol + ".",
          { ctx: "maclaurin-" + t, guide: [GS("Coefficient de " + M("x^{" + k + "}") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(t === "exp" ? a ** k : t === "geo" ? a ** k / fact(k) : a ** k / k, t === "exp" ? "N'oublie pas la factorielle : uᵏ/k!." : t === "geo" ? "Pour 1/(1 − u), les coefficients sont uᵏ, sans factorielle." : "Les signes alternent : (−1)ᵏ⁺¹·uᵏ/k."), TR(t === "exp" ? a / fact(k) : t === "geo" ? -(a ** k) : -v, "Le facteur " + a + " est élevé à la puissance " + k + "."), TR(t === "exp" ? 1 / fact(k) : t === "geo" ? a * k : a ** k / fact(k), "Remplace u par " + a + "x dans le développement connu.")] }); },
    ],
  };

  const PROBS = {
    statdesc: [() => { const o = sdClasses(); return P("On a relevé " + o.c[0] + " " + o.N + " " + o.c[1] + " (classes de largeur " + o.w + ").", [["a) Effectif total", o.N], ["b) Moyenne, avec les centres des classes (au centième)", rd(o.m, 0.01), 0.01], ["c) Écart-type (au centième)", rd(o.sd, 0.01), 0.01]],
      ["Centres des classes : " + o.ce.join(" ; ") + ".", "σ = √(moyenne des carrés − carré de la moyenne)."],
      "a) " + M(o.N) + " ; b) " + M("\\bar x = \\frac{" + nb(o.S) + "}{" + o.N + "} \\approx " + dT(o.m, 2)) + " ; c) " + M("\\sigma \\approx " + dT(o.sd, 2)) + ".", o.tab); }],
    intparties: [() => { const tau = pk([2, 3, 4]), k = pk([3, 4, 5, 6]), T = pk([2, 3]) * tau, cmax = (k * tau) / Math.E, A = k * tau * tau * (1 - (1 + T / tau) * Math.exp(-T / tau));
      return P("La concentration d'un médicament dans le sang vaut C(t) = " + k + "t·e^(−t/" + tau + ") (en mg/L, t en heures).", [["a) Instant du maximum (h)", tau], ["b) Concentration maximale (mg/L, au centième)", cmax, 0.01], ["c) ∫ de 0 à " + T + " de C(t) dt (au dixième)", A, 0.1]],
        ["C'(t) = " + k + "(1 − t/" + tau + ")e^(−t/" + tau + ").", "Par parties : u = " + k + "t, v' = e^(−t/" + tau + "), v = −" + tau + "e^(−t/" + tau + ")."],
        "a) " + M("C'(t) = 0") + " pour " + M("t = " + tau) + " ; b) " + M("C(" + tau + ") = \\frac{" + k * tau + "}{e} \\approx " + dT(rd(cmax, 0.01))) + " ; c) primitive " + M("-" + k * tau + "\\left(t + " + tau + "\\right)e^{-\\frac{t}{" + tau + "}}") + ", d'où " + M(k * tau * tau + "\\left(1 - " + (1 + T / tau) + "e^{-" + T / tau + "}\\right) \\approx " + dT(rd(A, 0.1))) + ".");
    }],
    intsubst: [() => { const T = pk([2, 3, 4]), q = pk([1, 4, 5, 9]), U = T * T + q, dT_ = (6 * T) / U, V = 3 * Math.log(U / q);
      return P("Le débit d'une fuite vaut d(t) = 6t ÷ (t² + " + q + ") litres par minute. On calcule le volume perdu entre t = 0 et t = " + T + " minutes avec la substitution u = t² + " + q + ".", [["a) Débit à t = " + T + " (L/min, au centième)", dT_, 0.01], ["b) Borne du haut u(" + T + ")", U], ["c) Volume perdu (L, au centième)", V, 0.01]],
        ["du = 2t dt, donc 6t dt = 3 du.", "∫ 3 du/u = 3 ln(u)."],
        "a) " + M("\\frac{" + 6 * T + "}{" + U + "} \\approx " + dT(rd(dT_, 0.01))) + " ; b) " + M(T + "^2 + " + q + " = " + U) + " ; c) " + M("3\\int_{" + q + "}^{" + U + "} \\frac{du}{u} = 3\\ln\\left(" + fT(U / q) + "\\right) \\approx " + dT(rd(V, 0.01))) + " L.");
    }],
    /* 26.11 soir (agent defis3) : trois familles (x·e^(−x/k), x²·e^(−x/k), ln(x)/x) et un facteur tirés au hasard (avant : 3 énoncés). */
    etudelnexp: [() => { const a = pk([1, 2, 3, 4, 5]), k = pk([2, 3, 4, 5]), cx = pk(["xexp", "x2exp", "lnx"]), aT = a === 1 ? "" : a;
      if (cx === "xexp") { const ym = (a * k) / Math.E;
        return Object.assign(P("Soit f(x) = " + aT + "x·e^(−x/" + k + ") pour x ≥ 0.", [["a) Abscisse du maximum local", k], ["b) Valeur du maximum (au centième)", rd(ym, 0.01), 0.01], ["c) Limite de f en +∞", 0]],
          ["f'(x) = " + (a === 1 ? "" : a) + "(1 − x/" + k + ")e^(−x/" + k + ").", "Croissances comparées : x ÷ e^(x/" + k + ") tend vers 0."],
          "a) " + M("f'(x) = 0") + " pour " + M("x = " + k) + " (+ puis −) ; b) " + M("f(" + k + ") = " + a * k + "e^{-1} \\approx " + dT(rd(ym, 0.01))) + " ; c) l'exponentielle l'emporte : " + M("0") + "."), { ctx: cx }); }
      if (cx === "x2exp") { const xm = 2 * k, ym = 4 * a * k * k * Math.exp(-2);
        return Object.assign(P("Soit f(x) = " + aT + "x²·e^(−x/" + k + ") pour x ≥ 0.", [["a) Abscisse du maximum local", xm], ["b) Valeur du maximum (au centième)", rd(ym, 0.01), 0.01], ["c) Limite de f en +∞", 0]],
          ["f'(x) = " + (a === 1 ? "" : a) + "x(2 − x/" + k + ")e^(−x/" + k + ").", "Croissances comparées : x² ÷ e^(x/" + k + ") tend vers 0."],
          "a) " + M("f'(x) = 0") + " pour " + M("x = " + xm) + " (+ puis −) ; b) " + M("f(" + xm + ") = " + 4 * a * k * k + "e^{-2} \\approx " + dT(rd(ym, 0.01))) + " ; c) l'exponentielle l'emporte : " + M("0") + "."), { ctx: cx }); }
      const ym = a / Math.E;
      return Object.assign(P("Soit f(x) = " + aT + "ln(x)/x pour x > 0.", [["a) Abscisse du maximum (au centième)", rd(Math.E, 0.01), 0.01], ["b) Valeur du maximum (au centième)", rd(ym, 0.01), 0.01], ["c) Limite de f en +∞", 0]],
        ["f'(x) = " + (a === 1 ? "" : a) + "(1 − ln x)/x².", "Croissances comparées : ln(x) ÷ x tend vers 0."],
        "a) " + M("f'(x) = 0 \\iff \\ln x = 1 \\iff x = e \\approx 2{,}72") + " (+ puis −) ; b) " + M("f(e) = \\frac{" + a + "}{e} \\approx " + dT(rd(ym, 0.01))) + " ; c) le logarithme croît moins vite que " + M("x") + " : " + M("0") + "."), { ctx: cx }); }],
    eqdiff: [() => { const d = pk([2, 3, 4, 5, 6]), k = pk([0.2, 0.25, 0.4, 0.5]), t1 = pk([2, 4, 5]), L = d / k, Q1 = L * (1 - Math.exp(-k * t1)), T90 = Math.log(10) / k;
      return P("Un médicament est perfusé : la quantité Q (en mg) dans le sang vérifie Q' = " + d + " − " + dS(k) + "Q et Q(0) = 0 (t en heures).", [["a) Quantité d'équilibre (mg)", L], ["b) Q(" + t1 + ") (mg, au dixième)", Q1, 0.1], ["c) Temps pour atteindre 90 % de l'équilibre (h, au dixième)", T90, 0.1]],
        ["Équilibre : Q' = 0.", "Q(t) = " + dS(L) + "(1 − e^(−" + dS(k) + "t)) ; 90 % : e^(−" + dS(k) + "t) = 0,1."],
        "a) " + M("\\frac{" + d + "}{" + dT(k) + "} = " + dT(L)) + " mg ; b) " + M(dT(L) + "\\left(1 - e^{-" + dT(k * t1) + "}\\right) \\approx " + dT(rd(Q1, 0.1))) + " mg ; c) " + M("t = \\frac{\\ln(10)}{" + dT(k) + "} \\approx " + dT(rd(T90, 0.1))) + " h.");
    }],
    appllin: [() => { const b = pk([2, 3, -2]), m = pk([-3, -2, 2, 3]), a = -b * m, k = pk([2, 3, -2]); /* 26.11 soir (agent defisch3, oracle) : b = −a·m donnait a + b·m ≠ 0, le noyau annoncé était faux */
      return P("L'application linéaire f a pour matrice A = (" + a + " ; " + b + " | " + k * a + " ; " + k * b + ") (lignes séparées par |).", [["a) Le noyau est engendré par (1 ; m) : m", m], ["b) L'image est la droite y = px : p", k], ["c) Image de (1 ; 1) : première coordonnée", a + b], ["d) Image de (1 ; 1) : seconde coordonnée", k * (a + b)]], ["det A = 0 : les deux lignes sont proportionnelles.", "Noyau : " + a + " + (" + b + ")m = 0 ; image : engendrée par la première colonne (" + a + " ; " + k * a + ")."], "a) m = " + m + " ; b) p = " + k * a + " ÷ " + a + " = " + k + " ; c) " + a + " + (" + b + ") = " + (a + b) + " ; d) " + k * a + " + (" + k * b + ") = " + k * (a + b) + " : l'image est bien sur la droite y = " + k + "x.");
    }],
    normale: [() => P("La masse des paquets de pâtes remplis par une machine suit une loi normale de moyenne 500 g et d'écart-type 5 g. On contrôle 400 paquets.", [["a) P(495 ≤ X ≤ 505), en %", 68], ["b) P(X < 490), en %", 2.5], ["c) Nombre de paquets attendus sous 490 g", 10]], ["495 et 505 sont à un écart-type de la moyenne.", "490 est à deux écarts-types : (100 − 95) ÷ 2."], "a) 68 % ; b) " + M("\\frac{100 - 95}{2} = 2{,}5") + " % ; c) " + M("400 \\cdot 0{,}025 = 10") + " paquets.")],
    matrices: [() => P("On résout le système 2x + y = 7 et 5x + 3y = 19 ; sa matrice est A = (2 1 ; 5 3).", [["a) det A", 1], ["b) x", 2], ["c) y", 3]], ["det A = 2 · 3 − 1 · 5.", "Cramer : x = (7 · 3 − 1 · 19) ÷ det A."], "a) 1 (A est inversible) ; b) " + M("x = \\frac{21 - 19}{1} = 2") + " ; c) " + M("y = \\frac{2 \\cdot 19 - 7 \\cdot 5}{1} = 3") + ".")],
    translin: [() => P("f est la rotation de 90° autour de O (sens trigonométrique), puis g l'homothétie de centre O et de rapport 3. Le triangle A(1 ; 0), B(4 ; 0), C(1 ; 2) a une aire de 3.", [["a) Ordonnée de f(B)", 4], ["b) Déterminant de la matrice de g ∘ f", 9], ["c) Aire de l'image du triangle par g ∘ f", 27]], ["Rotation de 90° : (x ; y) devient (−y ; x).", "det(g ∘ f) = det g · det f = 9 · 1."], "a) " + M("f(B) = (0 \\,;\\, 4)") + " ; b) " + M("9 \\cdot 1 = 9") + " ; c) " + M("9 \\cdot 3 = 27") + ".")],
    primitives: [() => P("Un ballon est lancé verticalement : sa vitesse vaut v(t) = 15 − 10t (m/s) ; il part d'une hauteur de 2 m.", [["a) Hauteur h(t) au temps t = 1 (m)", 12], ["b) Instant où la vitesse s'annule (s)", 1.5], ["c) Hauteur maximale (m)", 13.25]], ["h(t) = 15t − 5t² + 2 : une primitive de v avec h(0) = 2.", "Le ballon est au plus haut quand v(t) = 0."], "a) " + M("h(1) = 15 - 5 + 2 = 12") + " ; b) " + M("15 - 10t = 0") + " pour " + M("t = 1{,}5") + " ; c) " + M("h(1{,}5) = 22{,}5 - 11{,}25 + 2 = 13{,}25") + " m.")],
    integrale: [() => P("Le débit d'une source vaut r(t) = 3t² − 12t + 15 litres par heure (t en heures, de 0 à 4).", [["a) Débit au départ (L/h)", 15], ["b) Volume écoulé entre 0 h et 4 h (L)", 28], ["c) Débit moyen sur ces 4 heures (L/h)", 7]], ["Primitive : t³ − 6t² + 15t.", "Débit moyen = volume ÷ durée."], "a) 15 ; b) " + M("64 - 96 + 60 = 28") + " L ; c) " + M("28 \\div 4 = 7") + " L/h.")],
    aireint: [() => P("On étudie f(x) = 4 − x² et g(x) = x + 2.", [["a) Plus petite abscisse d'intersection", -2], ["b) Plus grande abscisse d'intersection", 1], ["c) Aire du domaine compris entre les deux courbes", 4.5]], ["4 − x² = x + 2 ⇔ x² + x − 2 = 0.", "Intègre (4 − x²) − (x + 2) = −x² − x + 2 de −2 à 1."], "a) −2 et b) 1 ; c) " + M("\\int_{-2}^{1} (-x^2 - x + 2)\\,dx = \\frac{9}{2}") + ".")],
    volrev: [() => P("Un verre a la forme du solide engendré par f(x) = √(2x) tournant autour de l'axe des abscisses, pour x de 0 à 10 (en cm).", [["a) f(x)² en x = 10", 20], ["b) Volume, divisé par π (cm³)", 100], ["c) Volume en cm³ (à l'unité)", 314, 1]], ["V = π∫₀¹⁰ 2x dx.", "Primitive : x²."], "a) 20 ; b) " + M("\\int_0^{10} 2x\\,dx = 100") + " ; c) " + M("100\\pi \\approx 314") + " cm³.")],
    lnexp: [() => P("Soit f(x) = x − 2ln(x) pour x > 0.", [["a) f'(1)", -1], ["b) Abscisse du minimum", 2], ["c) Valeur du minimum (au centième)", 0.614, 0.01]], ["f'(x) = 1 − 2/x.", "f(2) = 2 − 2ln 2."], "a) " + M("1 - 2 = -1") + " ; b) " + M("f'(x) = 0") + " pour " + M("x = 2") + " ; c) " + M("2 - 2\\ln 2 \\approx 0{,}61") + ".")],
    croissance: [() => P("Une population de bactéries suit N(t) = 400·e^(0,25t) (t en heures).", [["a) Population initiale", 400], ["b) Temps de doublement (h, au dixième)", 2.8, 0.1], ["c) Population après 8 heures (à l'unité)", 2956, 1]], ["Doublement : e^(0,25T) = 2.", "N(8) = 400·e²."], "a) 400 ; b) " + M("T = \\frac{\\ln 2}{0{,}25} \\approx 2{,}8") + " h ; c) " + M("400e^2 \\approx 2\\text{'}956") + ".")],
    condbayes: [() => P("Un détecteur de fumée sonne avec la probabilité 0,98 s'il y a un feu, et 0,01 sinon (fausse alerte). Un jour donné, il y a un feu avec la probabilité 0,002.", [["a) P(feu et alarme)", 0.00196], ["b) P(alarme)", 0.01194], ["c) P(feu sachant alarme) (au centième)", 0.16, 0.01]], ["P(alarme) = 0,002 · 0,98 + 0,998 · 0,01.", "Bayes : a) ÷ b)."], "a) " + M("0{,}002 \\cdot 0{,}98 = 0{,}00196") + " ; b) " + M("0{,}00196 + 0{,}00998 = 0{,}01194") + " ; c) " + M("\\frac{0{,}00196}{0{,}01194} \\approx 0{,}16") + ".")],
    varalea: [() => P("Un jeu : on paie un prix d'entrée, puis on lance deux pièces. Deux piles : on reçoit 6 CHF ; un seul pile : 2 CHF ; aucun : rien. Le prix d'entrée est 3 CHF ; G = gain net.", [["a) P(G = 3)", 0.25], ["b) E(G) (CHF)", -0.5], ["c) Prix d'entrée qui rendrait le jeu équitable (CHF)", 2.5]], ["G vaut 3, −1 ou −3 avec les probabilités 1/4, 1/2, 1/4.", "Équitable : prix = espérance de la somme reçue."], "a) " + M("\\frac{1}{4}") + " ; b) " + M("3 \\cdot \\frac{1}{4} - 1 \\cdot \\frac{1}{2} - 3 \\cdot \\frac{1}{4} = -0{,}5") + " ; c) on reçoit en moyenne " + M("6 \\cdot \\frac{1}{4} + 2 \\cdot \\frac{1}{2} = 2{,}5") + " CHF : prix équitable 2,5 CHF.")],
    binomiale: [() => P("Une petite compagnie vend 12 billets pour un avion de 10 places ; chaque passager se présente avec la probabilité 0,8, indépendamment. X = nombre de passagers présents.", [["a) E(X)", 9.6], ["b) P(X = 12) (au centième)", 0.8 ** 12, 0.01], ["c) P(X = 11) (au centième)", 12 * 0.8 ** 11 * 0.2, 0.01]], ["X ∼ B(12 ; 0,8).", "P(X = 11) = 12 · 0,8¹¹ · 0,2."], "a) " + M("12 \\cdot 0{,}8 = 9{,}6") + " ; b) " + M("0{,}8^{12} \\approx 0{,}07") + " ; c) " + M("12 \\cdot 0{,}8^{11} \\cdot 0{,}2 \\approx 0{,}21") + " : la compagnie a environ 28 % de risque d'avoir trop de passagers.")],
    /* 26.11 soir (agent defis3) : bayes, syslin, bases tirés au hasard, 3 contextes (avant : un seul énoncé chacun). */
    bayes: [() => { const rdd = (v, r) => +(Math.round(+(v / r).toFixed(8)) * r).toFixed(6), [cx, p, s, f, txt, c2] = pk([["depistage", pk([0.5, 1, 2]), pk([95, 98, 99]), pk([2, 3, 5]), "Un laboratoire teste un nouveau dépistage : # % de la population est porteuse d'un virus. Le test est positif chez # % des porteurs et chez # % des non-porteurs.", "Après un second test positif (indépendant), P(porteur) en % (au dixième)"],
        ["spam", pk([20, 30, 40]), pk([90, 95, 97]), pk([1, 2, 4]), "Dans une messagerie, # % des courriels reçus sont des spams. Le filtre marque comme spam # % des spams et, par erreur, # % des courriels normaux.", "Un second filtre indépendant, identique, marque aussi ce courriel : P(spam) en % (au dixième)"],
        ["qualite", pk([2, 3, 4]), pk([90, 95, 98]), pk([1, 2, 3]), "Dans une usine, # % des pièces sont défectueuses. Un détecteur signale # % des pièces défectueuses et, à tort, # % des pièces correctes.", "Un second détecteur indépendant, identique, signale aussi la pièce : P(défectueuse) en % (au dixième)"]]);
      const P0 = p / 100, S = s / 100, F = f / 100, pos = P0 * S + (1 - P0) * F, b = (P0 * S) / pos, c = (P0 * S * S) / (P0 * S * S + (1 - P0) * F * F), qs = ["P(positif)", "P(porteur sachant positif)"], L = cx === "spam" ? ["P(marqué)", "P(spam sachant marqué)"] : cx === "qualite" ? ["P(signalée)", "P(défectueuse sachant signalée)"] : qs;
      let i = 0; const q = txt.replace(/#/g, () => nb([p, s, f][i++]));
      return Object.assign(P(q, [["a) " + L[0] + ", en % (au centième)", rdd(100 * pos, 0.01), 0.01], ["b) " + L[1] + ", en % (au dixième)", rdd(100 * b, 0.1), 0.1], ["c) " + c2, rdd(100 * c, 0.1), 0.1]],
        ["Probabilités totales : " + dT(P0) + " · " + dT(S).replace("{,}", ",") + " + " + dT(1 - P0).replace("{,}", ",") + " · " + dT(F).replace("{,}", ",") + ".", "Pour c), remplace la proportion de départ par le résultat de b), ou mets les deux probabilités au carré."].map((t) => t.replace(/\{,\}/g, ",")),
        "a) " + M(dT(P0 * S, 6) + " + " + dT((1 - P0) * F, 6) + " = " + dT(pos, 6)) + ", soit " + M(dT(rdd(100 * pos, 0.01)) + "\\,\\%") + " ; b) " + M("\\frac{" + dT(P0 * S, 6) + "}{" + dT(pos, 6) + "} \\approx " + dT(rdd(100 * b, 0.1)) + "\\,\\%") + " ; c) " + M("\\frac{" + dT(P0) + " \\cdot " + dT(S) + "^2}{" + dT(P0) + " \\cdot " + dT(S) + "^2 + " + dT(1 - P0) + " \\cdot " + dT(F) + "^2} \\approx " + dT(rdd(100 * c, 0.1)) + "\\,\\%") + " : un seul signal ne suffit pas toujours, deux changent beaucoup."), { ctx: cx }); }],
    syslin: [() => { const [cx, it, pr, tot] = pk([["boulangerie", [["croissant", "croissants"], ["pain au chocolat", "pains au chocolat"], ["tresse", "tresses"]], [1.5, 2, 2.5, 3, 3.5, 4], "CHF"],
        ["cinema", [["billet adulte", "billets adultes"], ["billet enfant", "billets enfants"], ["billet senior", "billets seniors"]], [10, 12, 14, 15, 16, 18], "CHF"],
        ["papeterie", [["cahier", "cahiers"], ["stylo", "stylos"], ["classeur", "classeurs"]], [1.5, 2, 2.5, 3, 4.5, 5], "CHF"]]);
      let A, X, D; do { A = [0, 1, 2].map(() => [0, 1, 2].map(() => R.int(1, 4))); X = [pk(pr), pk(pr), pk(pr)]; D = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]); } while (D === 0 || Math.abs(D) > 30 || new Set(X).size < 2);
      const B = A.map((r) => r6(r[0] * X[0] + r[1] * X[1] + r[2] * X[2])), jr = ["Lundi", "mardi", "mercredi"], w = (n, k) => n + " " + (n > 1 ? it[k][1] : it[k][0]);
      const ln = A.map((r, i) => jr[i] + " : " + w(r[0], 0) + ", " + w(r[1], 1) + " et " + w(r[2], 2) + " coûtent " + nb(B[i]) + " CHF").join(" ; "), mat = "\\begin{pmatrix} " + A.map((r) => r.join(" & ")).join(" \\\\ ") + " \\end{pmatrix}";
      return Object.assign(P((cx === "cinema" ? "Un cinéma vend des billets adultes, enfants et seniors. " : cx === "papeterie" ? "Une papeterie vend des cahiers, des stylos et des classeurs. " : "Une boulangerie vend des croissants, des pains au chocolat et des tresses. ") + ln + ".",
        [["a) Déterminant du système", D], ["b) Prix d'un " + it[0][0] + " (CHF)", X[0], 0.01], ["c) Prix d'un" + (cx === "boulangerie" ? "e " : " ") + it[2][0] + " (CHF)", X[2], 0.01]],
        ["Système 3 × 3 : x = " + it[0][0] + ", y = " + it[1][0] + ", z = " + it[2][0] + ".", "Cramer : x = Dx ÷ D."],
        "a) " + M("\\det" + mat + " = " + D) + " ; b) " + M("x = \\frac{D_x}{D} = " + nb(X[0])) + " CHF ; c) " + M("z = \\frac{D_z}{D} = " + nb(X[2])) + " CHF (et " + M("y = " + nb(X[1])) + " CHF)."), { ctx: cx }); }],
    bases: [() => { let u, v, w1, w3, al, be, ga, c0, cm; do { u = [R.int(-2, 3), R.int(-2, 3), R.int(-2, 3)]; v = [R.int(-2, 3), R.int(-2, 3), R.int(-2, 3)]; w1 = R.int(-2, 3); w3 = R.int(-2, 3);
          cm = -(u[0] * v[2] - u[2] * v[0]); c0 = w1 * (u[1] * v[2] - u[2] * v[1]) + w3 * (u[0] * v[1] - u[1] * v[0]); al = R.int(-2, 3); be = R.int(-2, 3); ga = nz(-2, 3); } while (!cm || !c0 || !al || !be || u.every((t) => !t) || v.every((t) => !t));
      const w = [w1, 0, w3], t = [0, 1, 2].map((i) => al * u[i] + be * v[i] + ga * w[i]), [k, nmK] = pk([[0, "α"], [1, "β"], [2, "γ"]]), V = (x) => "(" + x.join(" ; ") + ")";
      return Object.assign(P("Dans l'espace, u = " + V(u) + ", v = " + V(v) + " et w = (" + w1 + " ; m ; " + w3 + ").", [["a) Coefficient de m dans det(u ; v ; w)", cm], ["b) Valeur de m pour laquelle la famille est liée (fraction acceptée)", -c0 / cm], ["c) Pour m = 0, composante " + nmK + " de t = " + V(t) + " dans la base (u ; v ; w), avec t = αu + βv + γw", [al, be, ga][k]]],
        ["Développe le déterminant selon la colonne de w : seul le terme en m dépend de m.", "Pour c), résous αu + βv + γw = t (trois équations)."],
        "a) " + M("\\det(u ; v ; w) = " + (cm === 1 ? "" : cm === -1 ? "-" : cm) + "m" + (c0 < 0 ? " - " + -c0 : " + " + c0)) + " : coefficient " + M(cm) + " ; b) " + M("m = " + fT(-c0 / cm)) + " ; c) " + M("\\vec t = " + [[al, "\\vec u"], [be, "\\vec v"], [ga, "\\vec w"]].map(([c, n], i) => (i && c >= 0 ? " + " : c < 0 ? " - " : "") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + n).join("")) + ", donc " + M(nmK.replace("α", "\\alpha").replace("β", "\\beta").replace("γ", "\\gamma") + " = " + [al, be, ga][k]) + "."), { ctx: ["alpha", "beta", "gamma"][k] }); }],
    cplxalg: [() => P("Soit z = 3 + 4i et w = 1 − 2i.", [["a) Partie réelle de z·w", 11], ["b) Partie imaginaire de z ÷ w", 2], ["c) z·z̄", 25]], ["(3 + 4i)(1 − 2i) = 3 − 6i + 4i − 8i².", "Multiplie z et w par le conjugué de w."], "a) " + M("(3 + 4i)(1 - 2i) = 11 - 2i") + " ; b) " + M("\\frac{(3 + 4i)(1 + 2i)}{5} = \\frac{-5 + 10i}{5} = -1 + 2i") + " ; c) " + M("9 + 16 = 25") + ".")],
    cplxtrig: [() => P("Soit z = 1 − i.", [["a) Module de z, au carré", 2], ["b) Argument principal de z, en multiples de π (par exemple −0,25)", -0.25], ["c) Partie réelle de z¹⁰", 0]], ["z = √2·e^(−iπ/4).", "z¹⁰ = 32·e^(−10iπ/4) = 32·e^(−iπ/2)."], "a) " + M("|z|^2 = 2") + " ; b) " + M("-\\frac{\\pi}{4}") + ", soit " + M("-0{,}25") + " ; c) " + M("z^{10} = 32e^{-i\\frac{\\pi}{2}} = -32i") + " : partie réelle 0.")],
    cplxeq: [() => P("On résout z² − 6z + 13 = 0 dans ℂ.", [["a) Discriminant", -16], ["b) Partie imaginaire de la solution de partie imaginaire positive", 2], ["c) Module commun des deux solutions, au carré", 13]], ["Δ = 36 − 52.", "z = (6 ± 4i) ÷ 2 ; produit des solutions = 13."], "a) " + M("\\Delta = -16 = (4i)^2") + " ; b) " + M("z = 3 \\pm 2i") + " : 2 ; c) " + M("|3 + 2i|^2 = 9 + 4 = 13") + " (c'est aussi le produit des solutions).")],
    suitegeom: [() => P("Une ville compte 12'000 habitants en 2026 ; sa population augmente de 2 % par an.", [["a) Population en 2031 (à l'unité)", 12000 * 1.02 ** 5, 1], ["b) Rang n (avec u₁ = 2026) de la première année où elle dépasse 15'000", 13], ["c) Somme des populations de 2026 à 2035 (à l'unité)", (12000 * (1.02 ** 10 - 1)) / 0.02, 1]], ["Suite géométrique de raison 1,02.", "Seuil : 1,02^(n − 1) > 1,25."], "a) " + M("12\\text{'}000 \\cdot 1{,}02^5 \\approx 13\\text{'}249") + " ; b) " + M("n - 1 > \\frac{\\ln 1{,}25}{\\ln 1{,}02} \\approx 11{,}27") + ", donc " + M("n = 13") + " (l'an 2038) ; c) " + M("12\\text{'}000 \\cdot \\frac{1{,}02^{10} - 1}{0{,}02} \\approx 131\\text{'}397") + ".")],
    serie: [() => P("Un médicament : on injecte 10 mg chaque jour ; d'un jour à l'autre, 40 % de la quantité présente reste dans le sang.", [["a) Quantité juste après la 2e injection (mg)", 14], ["b) Quantité juste après la 5e injection (mg, au centième)", (10 * (1 - 0.4 ** 5)) / 0.6, 0.01], ["c) Quantité limite juste après une injection (mg, fraction acceptée)", 50 / 3]], ["Juste après la n-ième injection : 10 + 10·0,4 + … + 10·0,4ⁿ⁻¹.", "Limite : série géométrique 10 ÷ (1 − 0,4)."], "a) " + M("10 + 4 = 14") + " ; b) " + M("10 \\cdot \\frac{1 - 0{,}4^5}{0{,}6} \\approx 16{,}50") + " ; c) " + M("\\frac{10}{0{,}6} = \\frac{50}{3} \\approx 16{,}67") + " mg.")],
  };

  // ---------- catalogue ----------
  const NEW = [
    { id: "primitives", theme: "fa", label: "Primitives", ex: "F' = f", CH: [15], codesMATU: "4\\.AN\\.01[abc]", lv: PR,
      hint: "F est une primitive de f si F' = f. Pour xⁿ : xⁿ⁺¹ ÷ (n + 1). Une condition comme F(0) = 0 fixe la constante.",
      lesson: ["Primitives", "Faire le chemin inverse de la dérivée.", "\\(F\\) est une primitive de \\(f\\) si \\(F'(x) = f(x)\\). Primitives de référence : \\(x^n \\to \\frac{x^{n + 1}}{n + 1}\\) (\\(n \\neq -1\\)), \\(\\frac{1}{x^2} \\to -\\frac{1}{x}\\), \\(\\cos x \\to \\sin x\\), \\(\\sin x \\to -\\cos x\\). On primitive terme à terme. Toutes les primitives diffèrent d'une constante \\(C\\) : une condition (\\(F(a) = b\\)) la fixe.",
        ["\\(f(x) = 6x^2 - 4x + 1\\) : \\(F(x) = 2x^3 - 2x^2 + x + C\\).", "Avec \\(F(1) = 5\\) : \\(1 + C = 5\\), donc \\(C = 4\\)."], "Vérifie toujours en dérivant : \\(F'\\) doit redonner \\(f\\). Et pour \\((ax + b)^n\\), divise aussi par \\(a\\)."],
      comps: ["Trouver une primitive d'un polynôme ; vérifier par dérivation", "Primitives de référence (puissances, racines, cosinus, composée affine)", "Déterminer la primitive qui vérifie une condition (position, coût)"] },
    { id: "integrale", theme: "fa", label: "Intégrale définie", ex: "\\int_a^b f(x)\\,dx = F(b) - F(a)", CH: [15], codesMATU: "4\\.AN\\.02[abc]|4\\.AN\\.03a", lv: IN,
      hint: "∫ de a à b de f = F(b) − F(a), avec F une primitive de f. Valeur moyenne : l'intégrale divisée par b − a.",
      lesson: ["Intégrale définie", "Une aire algébrique, calculée avec une primitive.", "Théorème fondamental : \\(\\int_a^b f(x)\\,dx = F(b) - F(a)\\) où \\(F\\) est une primitive de \\(f\\). Si \\(f \\geq 0\\), c'est l'aire sous la courbe ; les parties sous l'axe comptent négativement. Propriétés : linéarité, Chasles \\(\\int_a^b + \\int_b^c = \\int_a^c\\), \\(\\int_b^a = -\\int_a^b\\). Valeur moyenne : \\(\\frac{1}{b - a}\\int_a^b f(x)\\,dx\\).",
        ["\\(\\int_1^3 2x\\,dx = \\left[x^2\\right]_1^3 = 9 - 1 = 8\\)", "Valeur moyenne de \\(x^2\\) sur \\([0 \\,;\\, 3]\\) : \\(\\frac{9}{3} = 3\\)."], "Borne du haut moins borne du bas, et une primitive (pas \\(f\\))."],
      comps: ["Calculer une intégrale avec une primitive ; propriétés (Chasles, linéarité)", "Intégrales de référence ; valeur moyenne", "Trouver une borne ; intégrer une vitesse ou un débit"] },
    { id: "aireint", theme: "fa", label: "Aires avec une intégrale", ex: "\\int_a^b \\left(g(x) - f(x)\\right) dx", CH: [15], codesMATU: "4\\.AN\\.05[ab]", lv: AI,
      hint: "Aire entre deux courbes : intégrale de (courbe du haut − courbe du bas) entre les intersections. Si f change de signe, on coupe aux zéros.",
      lesson: ["Aires avec une intégrale", "Une aire est toujours positive.", "Aire entre la courbe de \\(f\\) et l'axe : on cherche les zéros, on intègre morceau par morceau et on additionne les valeurs absolues. Aire entre deux courbes : on cherche les abscisses d'intersection \\(a\\) et \\(b\\), puis \\(\\int_a^b (\\text{haut} - \\text{bas})\\,dx\\).",
        ["Entre \\(y = x^2\\) et \\(y = 2x\\) : intersections 0 et 2, aire \\(\\int_0^2 (2x - x^2)\\,dx = 4 - \\frac{8}{3} = \\frac{4}{3}\\)."], "Une intégrale peut valoir 0 alors que l'aire n'est pas nulle (exemple : \\(x^3\\) entre −1 et 1)."],
      comps: ["Aire sous une courbe positive", "Aire entre deux courbes ; fonction qui change de signe", "Problèmes d'aire (paramètre, corde)"] },
    { id: "volrev", theme: "fa", label: "Volume d'un corps de révolution", ex: "V = \\pi\\int_a^b f(x)^2\\,dx", CH: [15], codesMATU: "4\\.AN\\.05c", lv: VR,
      hint: "En tournant autour de l'axe des abscisses : V = π · ∫ de a à b de f(x)². On intègre le carré de f.",
      lesson: ["Volume de révolution", "Empiler des disques très fins.", "Quand le graphe de \\(f\\) tourne autour de l'axe des abscisses entre \\(a\\) et \\(b\\), chaque tranche est un disque de rayon \\(f(x)\\) : \\(V = \\pi \\int_a^b f(x)^2\\,dx\\). Entre deux courbes (solide creux) : \\(\\pi \\int_a^b \\left(R(x)^2 - r(x)^2\\right) dx\\).",
        ["Cône : \\(f(x) = \\frac{r}{h}x\\) sur \\([0 \\,;\\, h]\\) donne \\(\\frac{1}{3}\\pi r^2 h\\).", "Boule : \\(f(x) = \\sqrt{r^2 - x^2}\\) sur \\([-r \\,;\\, r]\\) donne \\(\\frac{4}{3}\\pi r^3\\)."], "On intègre \\(f(x)^2\\), pas \\(f(x)\\) ; et le facteur \\(\\pi\\) reste."],
      comps: ["Volume d'un cône, d'un cylindre, d'un paraboloïde", "Volume d'une boule et d'autres solides de révolution", "Solide creux ; volume arrondi ; paramètre"] },
    { id: "lnexp", theme: "fa", label: "Logarithme et exponentielle", ex: "(\\ln x)' = \\frac{1}{x}, \\ (e^x)' = e^x", CH: [15], codesMATU: "4\\.AN\\.06[abcd]", lv: LE,
      hint: "ln et exp sont réciproques : e^x = a ⇔ x = ln a. (e^u)' = u'·e^u, (ln u)' = u'/u ; une primitive de 1/x est ln(x) (x > 0).",
      lesson: ["Logarithme naturel et exponentielle", "Deux fonctions réciproques, base e ≈ 2,718.", "\\(\\ln\\) est la primitive de \\(\\frac{1}{x}\\) qui s'annule en 1 ; \\(e^x\\) est sa réciproque : \\(e^x = a \\iff x = \\ln a\\) (\\(a > 0\\)). Propriétés : \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln(a^n) = n\\ln a\\). Dérivées : \\((e^{u})' = u'e^{u}\\), \\((\\ln u)' = \\frac{u'}{u}\\). Primitives : \\(\\frac{u'}{u} \\to \\ln(u)\\) (\\(u > 0\\)), \\(u'e^u \\to e^u\\).",
        ["\\(e^{2x - 1} = 5 \\iff x = \\frac{\\ln 5 + 1}{2}\\)", "\\((x\\ln x)' = \\ln x + 1\\)", "\\(\\int_1^{e} \\frac{dx}{x} = 1\\)"], "\\(e^x\\) n'est pas une puissance de \\(x\\) : sa dérivée est \\(e^x\\), pas \\(x e^{x - 1}\\). Au clavier : x*e^x ou x*exp(x)."],
      comps: ["Résoudre une équation ; dériver et intégrer ln et exp", "Dérivées de produits et de composées ; équations", "Tangente, extremum, intégrales u'/u et u'e^u"] },
    { id: "croissance", theme: "fa", label: "Modèles de croissance exponentielle", ex: "N(t) = N_0\\,e^{kt}", CH: [15], codesMATU: "4\\.AN\\.07[abc]", lv: CR,
      hint: "N(t) = N₀·e^(kt) : doublement T = ln 2 ÷ k ; pour trouver un temps, isole l'exponentielle puis applique ln.",
      lesson: ["Croissance et décroissance exponentielles", "Une quantité qui varie proportionnellement à elle-même.", "Modèle \\(N(t) = N_0 e^{kt}\\) : croissance si \\(k > 0\\), décroissance si \\(k < 0\\). Temps de doublement \\(T = \\frac{\\ln 2}{k}\\) ; demi-vie \\(\\frac{\\ln 2}{|k|}\\). Pour trouver \\(t\\) : isoler \\(e^{kt}\\), puis appliquer \\(\\ln\\). Autres modèles : refroidissement \\(T(t) = T_a + (T_0 - T_a)e^{-kt}\\), croissance limitée \\(L(1 - e^{-kt})\\).",
        ["\\(N(t) = 500e^{0{,}2t}\\) atteint 2'000 quand \\(e^{0{,}2t} = 4\\), soit \\(t = \\frac{\\ln 4}{0{,}2} \\approx 6{,}9\\).", "Après 3 demi-vies, il reste \\(\\frac{1}{8}\\) de la quantité."], "Une croissance de \\(p\\,\\%\\) par an correspond à \\(k = \\ln(1 + p/100)\\), pas à \\(p/100\\)."],
      comps: ["Utiliser un modèle exponentiel ; doublement, demi-vie", "Trouver k ou un temps à partir de données ; datation", "Refroidissement, croissance limitée, taux annuel et continu"] },
    { id: "intparties", niv: "R", theme: "fa", label: "Intégration par parties", ex: "\\int u v' = \\left[uv\\right] - \\int u' v", CH: [15], codesMATU: "4\\.AN\\.04a", lv: IP,
      hint: "∫ u·v' dx = [u·v] − ∫ u'·v dx. Choisis pour u le facteur qui se simplifie en dérivant (x, x², ln x) et pour v' celui qu'on sait primitiver (eˣ, cos x, sin x, 1).",
      lesson: ["Intégration par parties", "La règle du produit, lue à l'envers.", "Comme \\((uv)' = u'v + uv'\\) : \\(\\int_a^b u(x)v'(x)\\,dx = \\left[u(x)v(x)\\right]_a^b - \\int_a^b u'(x)v(x)\\,dx\\). On choisit \\(u\\) qui devient plus simple en dérivant (\\(x\\), \\(x^2\\), \\(\\ln x\\)) et \\(v'\\) dont on connaît une primitive (\\(e^x\\), \\(\\cos x\\), \\(\\sin x\\), \\(1\\)). Parfois il faut le faire deux fois (\\(x^2e^x\\)), ou on retombe sur l'intégrale de départ (\\(e^x\\sin x\\)) : on résout alors une équation.",
        ["\\(\\int_0^{2} x e^x\\,dx = \\left[xe^x\\right]_0^2 - \\int_0^2 e^x\\,dx = 2e^2 - (e^2 - 1) = e^2 + 1\\)", "\\(\\int \\ln x\\,dx = x\\ln x - x + C\\) (avec \\(u = \\ln x\\), \\(v' = 1\\))"], "C'est « [uv] MOINS ∫ u'v » ; et on ne primitive jamais les deux facteurs séparément."],
      comps: ["Intégrer par parties x·eˣ, ln x ; trouver une primitive", "Choisir u et v' (x·cos x, x·e^(−x), polynôme · eˣ)", "Deux intégrations par parties ; intégrale qui revient ; xⁿ·ln x"] },
    { id: "intsubst", niv: "R", theme: "fa", label: "Intégration par substitution", ex: "u = g(x), \\ du = g'(x)\\,dx", CH: [15], codesMATU: "4\\.AN\\.04b", lv: IS,
      hint: "Pose u = g(x), calcule du = g'(x) dx et remplace tout (y compris dx). Change les bornes : u va de g(a) à g(b). Puis intègre en u.",
      lesson: ["Intégration par substitution", "La dérivée d'une composée, lue à l'envers.", "Si l'intégrande contient \\(g(x)\\) et (à un facteur près) \\(g'(x)\\), on pose \\(u = g(x)\\), \\(du = g'(x)\\,dx\\) : \\(\\int_a^b f(g(x))g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du\\). Les bornes changent avec la variable. Cas fréquents : \\(u = ax + b\\) (\\(dx = \\frac{du}{a}\\)), \\(u = x^2 + c\\) (\\(x\\,dx = \\frac{du}{2}\\)), \\(u = \\sin x\\), \\(u = \\ln x\\), \\(u = e^x + c\\).",
        ["\\(\\int_0^{2} 2x(x^2 + 1)^2\\,dx = \\int_1^{5} u^2\\,du = \\frac{125 - 1}{3} = \\frac{124}{3}\\)", "\\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx = \\int_0^1 u^2\\,du = \\frac{1}{3}\\)"], "On change les bornes (ou on revient à x avant de les utiliser), et on n'oublie pas le facteur de dx (\\(\\frac{1}{a}\\), \\(\\frac{1}{2}\\))."],
      comps: ["Substitution affine u = ax + b ; u = x² + c avec 2x dx = du", "Facteur à ajuster (x dx = du/2) ; u = sin x ; u = ln x", "Racines et quotients (x√(x² + c), eˣ ÷ (eˣ + c))"] },
    { id: "etudelnexp", theme: "fa", label: "Étude de fonctions avec ln et exp", ex: "\\lim_{x \\to +\\infty} \\frac{x^n}{e^x} = 0", CH: [15], codesMATU: "4\\.AN\\.06d", lv: EL,
      hint: "Domaine de ln(u) : u > 0. Extremum : zéro de f' (eˣ > 0 ne change pas le signe). Croissances comparées : eˣ l'emporte sur toute puissance, toute puissance l'emporte sur ln x.",
      lesson: ["Étudier une fonction avec ln et exp", "Domaine, zéros, variations, limites.", "Domaine : \\(\\ln(u)\\) exige \\(u > 0\\) ; \\(e^u\\) existe toujours et \\(e^u > 0\\). Zéros : \\(\\ln(x) = c \\iff x = e^c\\). Variations : on dérive (\\((\\ln u)' = \\frac{u'}{u}\\), \\((e^u)' = u'e^u\\)) et on étudie le signe ; dans \\((x + b)e^x\\), le facteur \\(e^x\\) est positif. Croissances comparées en \\(+\\infty\\) : \\(\\frac{x^n}{e^x} \\to 0\\), \\(\\frac{\\ln x}{x} \\to 0\\) ; en \\(0^+\\) : \\(x\\ln x \\to 0\\).",
        ["\\(f(x) = x\\ln x\\) : \\(f'(x) = \\ln x + 1 = 0\\) en \\(x = e^{-1}\\), minimum \\(-\\frac{1}{e}\\)", "\\(\\lim_{x \\to +\\infty} \\frac{2e^x + x^3}{5e^x} = \\frac{2}{5}\\)"], "Dans un quotient où \\(e^x\\) est en haut ET en bas, la limite n'est pas 0 : on divise par \\(e^x\\)."],
      comps: ["Domaine d'une fonction avec ln ; zéro ; limite par croissances comparées", "Extremum de x·ln x, (x + b)eˣ, ln(kx) ÷ x", "Minimum avec paramètre ; équation en ln x du second degré"] },
    { id: "eqdiff", niv: "R", theme: "fa", label: "Équations différentielles", ex: "y' = ay + b", CH: [15], codesMATU: "4\\.AN\\.0[89][abc]", lv: ED,
      hint: "y' = ky : y = Ce^(kx), C = y(0). y' = ay + b : y = Ce^(ax) − b/a (équilibre −b/a). Variables séparables : dy/g(y) = f(x) dx, puis on intègre les deux côtés.",
      lesson: ["Équations différentielles", "Une équation dont l'inconnue est une fonction.", "\\(y' = ky\\) a pour solutions \\(y = Ce^{kx}\\) ; la condition initiale donne \\(C = y(0)\\). \\(y' = ay + b\\) : la solution constante (équilibre) est \\(y = -\\frac{b}{a}\\), et \\(y = Ce^{ax} - \\frac{b}{a}\\) ; si \\(a < 0\\), \\(y\\) tend vers l'équilibre. Variables séparables \\(y' = f(x)g(y)\\) : \\(\\int \\frac{dy}{g(y)} = \\int f(x)\\,dx\\). Modèles : croissance, refroidissement de Newton, chute avec frottement, perfusion.",
        ["\\(y' = -2y + 6\\), \\(y(0) = 1\\) : équilibre 3, \\(y = 3 - 2e^{-2x}\\)", "\\(y' = 2xy\\), \\(y(0) = 5\\) : \\(\\ln|y| = x^2 + C\\), \\(y = 5e^{x^2}\\)"], "La condition initiale fixe la constante après l'intégration ; dans \\(y' = ay + b\\), \\(C = y(0) + \\frac{b}{a}\\), pas \\(y(0)\\)."],
      comps: ["Résoudre y' = ky avec une condition initiale ; trouver k", "y' = ay + b, équilibre et limite ; variables séparables simples", "Modèles (refroidissement, chute) ; équations non linéaires séparables"] },
    { id: "matrices", theme: "fa", label: "Matrices 2 × 2 : calcul, déterminant, inverse", ex: "\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc", CH: [15], codesMATU: "4\\.GV\\.02[bce]", lv: MA,
      hint: "Produit : ligne de la première matrice × colonne de la seconde. det = ad − bc. Inverse : (1 ÷ det) · (d −b ; −c a), si det ≠ 0. Système : x = Dx ÷ D, y = Dy ÷ D (Cramer).",
      lesson: ["Matrices 2 × 2", "Un tableau de nombres qui calcule.", "On additionne et on multiplie par un nombre coefficient par coefficient. Produit \\(AB\\) : chaque coefficient est « ligne de \\(A\\) × colonne de \\(B\\) » ; en général \\(AB \\neq BA\\). Déterminant \\(\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc\\). Si \\(\\det A \\neq 0\\), \\(A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}\\). Système \\(A\\binom{x}{y} = \\binom{e}{f}\\) : \\(x = \\frac{D_x}{D}\\), \\(y = \\frac{D_y}{D}\\) (Cramer), où \\(D_x\\) remplace la colonne des x par le second membre. \\(\\det(AB) = \\det A \\cdot \\det B\\), \\(\\det(kA) = k^2 \\det A\\).",
        ["\\(\\det\\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix} = 6 - 5 = 1\\), inverse \\(\\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}\\)"], "Le produit matriciel ne se fait pas coefficient par coefficient, et l'inverse non plus."],
      comps: ["Déterminant ; combinaison de matrices ; matrice × vecteur", "Produit de matrices ; inverse ; matrice non inversible", "Système par Cramer ; propriétés du déterminant ; A²"] },
    { id: "translin", theme: "es", label: "Transformations linéaires du plan", ex: "f(P) = A \\cdot P", CH: [15], codesMATU: "4\\.GV\\.01[abcd]", lv: TL,
      hint: "Image d'un point : matrice × coordonnées. Les colonnes de la matrice sont les images de (1 ; 0) et (0 ; 1). Les aires sont multipliées par |det|. Composer : d'abord f puis g, matrice BA.",
      lesson: ["Transformations linéaires", "Une matrice déplace tous les points du plan à la fois.", "L'image de \\(P(x ; y)\\) par l'application de matrice \\(A\\) est \\(A\\binom{x}{y}\\). Les colonnes de \\(A\\) sont les images de \\((1 ; 0)\\) et \\((0 ; 1)\\) : rotation de 90° \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\), symétrie d'axe Ox \\(\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\), homothétie de rapport k \\(\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}\\), rotation d'angle θ \\(\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}\\). Les aires sont multipliées par \\(|\\det A|\\). Appliquer \\(f\\) (matrice A) puis \\(g\\) (matrice B) : matrice \\(BA\\).",
        ["Rotation de 90° : \\((3 ; 1) \\mapsto (-1 ; 3)\\)", "\\(\\det = -6\\) : les aires sont multipliées par 6"], "Pour composer, l'ordre compte : d'abord f, puis g, c'est \\(B \\cdot A\\)."],
      comps: ["Image d'un point ; transformations usuelles ; rapport des aires", "Antécédent ; composition ; matrice à partir des images", "Rotation d'angle quelconque ; aire avec paramètre ; aires et composition"] },
    { id: "appllin", theme: "fa", label: "Applications linéaires : noyau, image, bases", ex: "\\ker f = \\{\\vec v : A\\vec v = \\vec 0\\}", CH: [15], codesMATU: "4\\.GV\\.02[ad]", lv: AL,
      hint: "Noyau : vecteurs envoyés sur 0 (résoudre Av = 0) ; il n'est pas réduit à 0 exactement quand det A = 0. Image : si det A = 0, droite engendrée par une colonne non nulle. Composantes dans une base (u ; v) : résoudre αu + βv = w.",
      lesson: ["Noyau, image, bases", "Ce qu'une matrice écrase, et ce qu'elle atteint.", "Le noyau de \\(f\\) est l'ensemble des vecteurs \\(\\vec v\\) tels que \\(A\\vec v = \\vec 0\\). Si \\(\\det A \\neq 0\\), il est réduit à \\(\\vec 0\\) et l'image est tout le plan ; si \\(\\det A = 0\\), le noyau est une droite et l'image est la droite engendrée par une colonne non nulle. Deux vecteurs non colinéaires \\((\\vec u ; \\vec v)\\) forment une base : tout \\(\\vec w\\) s'écrit de façon unique \\(\\alpha\\vec u + \\beta\\vec v\\) (composantes \\((\\alpha ; \\beta)\\)), et \\(f(\\vec w) = \\alpha f(\\vec u) + \\beta f(\\vec v)\\).",
        ["\\(A = \\begin{pmatrix} 2 & -4 \\\\ 3 & -6 \\end{pmatrix}\\) : noyau engendré par \\((2 ; 1)\\), image : la droite \\(y = 1{,}5x\\)."], "Le noyau se cherche au départ (Av = 0) ; l'image est formée des vecteurs d'arrivée (engendrée par les colonnes)."],
      comps: ["Noyau d'une matrice non inversible ; paramètre pour un noyau non nul ; composantes vers coordonnées", "Image d'une matrice non inversible ; composantes dans une base ; appartenance à l'image", "Paramètre puis noyau ; image par linéarité ; changement de base"] },
    { id: "condbayes", theme: "no", label: "Probabilités conditionnelles, totales, indépendance", ex: "P_A(B) = \\frac{P(A \\cap B)}{P(A)}", CH: [15], codesMATU: "4\\.PS\\.02[abc]", lv: CB,
      hint: "P_A(B) = P(A ∩ B) ÷ P(A). Arbre : on multiplie le long d'un chemin, on additionne les chemins. Bayes : P_B(A) = P(A)·P_A(B) ÷ P(B).",
      lesson: ["Probabilités conditionnelles", "Recalculer une probabilité quand on sait quelque chose.", "\\(P_A(B) = \\frac{P(A \\cap B)}{P(A)}\\). Dans un arbre : \\(P(A \\cap B) = P(A) \\cdot P_A(B)\\) ; probabilités totales \\(P(B) = P(A)P_A(B) + P(\\overline{A})P_{\\overline{A}}(B)\\). Bayes : \\(P_B(A) = \\frac{P(A)P_A(B)}{P(B)}\\). \\(A\\) et \\(B\\) indépendants : \\(P(A \\cap B) = P(A)P(B)\\).",
        ["Test : \\(P(M) = 0{,}01\\), \\(P_M(+) = 0{,}99\\), \\(P_{\\overline{M}}(+) = 0{,}05\\) : \\(P_+(M) = \\frac{0{,}0099}{0{,}0099 + 0{,}0495} \\approx 0{,}17\\)."], "Ne confonds pas \\(P_A(B)\\) et \\(P_B(A)\\) : un test fiable peut donner beaucoup de faux positifs quand la maladie est rare."],
      comps: ["Probabilité conditionnelle (tableau, arbre) ; indépendance", "Probabilités totales ; tirages sans remise", "Théorème de Bayes ; indépendance avec une inconnue"] },
    { id: "varalea", theme: "no", label: "Variable aléatoire : espérance, variance", ex: "E(X) = \\sum x_i p_i", CH: [15], codesMATU: "4\\.PS\\.03[ab]", lv: VA,
      hint: "Somme des probabilités = 1. E(X) = Σ xᵢ·pᵢ ; V(X) = E(X²) − E(X)² ; σ = √V. Jeu équitable : espérance du gain nulle.",
      lesson: ["Variable aléatoire", "Un nombre qui dépend du hasard.", "Loi de \\(X\\) : valeurs \\(x_i\\) et probabilités \\(p_i\\) (somme 1). Espérance (moyenne à long terme) \\(E(X) = \\sum x_i p_i\\). Variance \\(V(X) = E(X^2) - E(X)^2\\), écart-type \\(\\sigma = \\sqrt{V}\\). Pour \\(Y = aX + b\\) : \\(E(Y) = aE(X) + b\\), \\(V(Y) = a^2V(X)\\).",
        ["Gains 10, 0, −2 avec 0,1 ; 0,5 ; 0,4 : \\(E = 1 - 0{,}8 = 0{,}2\\)."], "L'espérance pondère chaque valeur par sa probabilité : ce n'est pas la moyenne des valeurs."],
      comps: ["Compléter une loi ; calculer une espérance", "Variance, écart-type ; jeu équitable", "Établir une loi ; transformation aX + b ; valeur inconnue"] },
    { id: "binomiale", theme: "no", label: "Loi binomiale", ex: "P(X = k) = \\binom{n}{k}p^k(1 - p)^{n - k}", CH: [15], codesMATU: "4\\.PS\\.03[cd]", lv: BN,
      hint: "n épreuves indépendantes, succès p : P(X = k) = (n k)·pᵏ·(1 − p)ⁿ⁻ᵏ. E = np, V = np(1 − p). « Au moins un » : 1 − (1 − p)ⁿ.",
      lesson: ["Loi binomiale", "Compter les succès dans des épreuves répétées.", "Schéma de Bernoulli : \\(n\\) épreuves identiques et indépendantes, chacune un succès avec la probabilité \\(p\\). \\(X\\) = nombre de succès suit \\(B(n \\,;\\, p)\\) : \\(P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}\\), où \\(\\binom{n}{k}\\) compte les chemins de l'arbre avec \\(k\\) succès. \\(E(X) = np\\), \\(V(X) = np(1 - p)\\).",
        ["\\(B(5 \\,;\\, 0{,}3)\\) : \\(P(X = 2) = 10 \\cdot 0{,}09 \\cdot 0{,}343 \\approx 0{,}309\\).", "Au moins un 6 en 4 lancers : \\(1 - \\left(\\frac{5}{6}\\right)^4 \\approx 0{,}518\\)."], "N'oublie pas le coefficient \\(\\binom{n}{k}\\) : \\(p^k(1 - p)^{n - k}\\) n'est la probabilité que d'un seul chemin."],
      comps: ["Calculer P(X = k) ; espérance ; « au moins un »", "P(X ≤ 1), P(X ≥ 2) ; variance, écart-type ; coefficient binomial", "Taille minimale d'un échantillon ; retrouver n et p ; QCM au hasard"] },
    { id: "normale", theme: "no", label: "Loi normale (règle 68-95-99,7)", ex: "P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx 68\\,\\%", CH: [15], codesMATU: "4\\.PS\\.04[abc]", lv: NO,
      hint: "À 1, 2, 3 écarts-types de la moyenne : 68 %, 95 %, 99,7 % (intervalle centré). La courbe est symétrique : chaque moitié vaut la moitié ; ce qui reste dehors se partage également entre les deux côtés.",
      lesson: ["Loi normale", "La courbe en cloche, symétrique autour de la moyenne.", "Si \\(X\\) suit une loi normale de moyenne \\(\\mu\\) et d'écart-type \\(\\sigma\\) : \\(P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx 68\\,\\%\\), \\(P(\\mu - 2\\sigma \\le X \\le \\mu + 2\\sigma) \\approx 95\\,\\%\\), \\(P(\\mu - 3\\sigma \\le X \\le \\mu + 3\\sigma) \\approx 99{,}7\\,\\%\\). Par symétrie, chaque moitié d'intervalle vaut la moitié (34 %, 47,5 %, 49,85 %) et chaque « queue » la moitié du reste (16 %, 2,5 %, 0,15 %). Valeur centrée réduite \\(z = \\frac{x - \\mu}{\\sigma}\\) : à combien d'écarts-types \\(x\\) se trouve de la moyenne.",
        ["\\(\\mu = 170\\), \\(\\sigma = 8\\) : \\(P(X \\ge 186) = \\frac{100 - 95}{2} = 2{,}5\\,\\%\\)", "\\(P(162 \\le X \\le 186) = 34 + 47{,}5 = 81{,}5\\,\\%\\)"], "Pour un intervalle qui n'est pas centré, coupe à la moyenne et additionne les deux moitiés."],
      comps: ["Intervalles centrés, demi-intervalles, queues (68-95-99,7)", "Intervalle non centré ; effectif attendu ; retrouver σ ; valeur centrée réduite", "Deux queues ; retrouver μ ; seuil ; probabilité conditionnelle"] },
    { id: "statdesc", theme: "no", label: "Statistique descriptive : classes, écart-type", ex: "\\sigma = \\sqrt{\\overline{x^2} - \\bar x^2}", CH: [15], codesMATU: "4\\.PS\\.01[a-d]", lv: SD,
      hint: "Série en classes : on remplace chaque classe par son centre. σ² = moyenne des carrés − carré de la moyenne. Pour y = ax + b : moyenne a·x̄ + b, écart-type |a|·σ.",
      lesson: ["Statistique descriptive", "Résumer une série : sa position et sa dispersion.", "Moyenne pondérée \\(\\bar x = \\frac{1}{N}\\sum n_i x_i\\) (série en classes : \\(x_i\\) = centre de la classe). Écart-type \\(\\sigma = \\sqrt{\\frac{1}{N}\\sum n_i (x_i - \\bar x)^2} = \\sqrt{\\overline{x^2} - \\bar x^2}\\). Si \\(y = ax + b\\) : \\(\\bar y = a\\bar x + b\\) et \\(\\sigma_y = |a|\\,\\sigma_x\\). Médiane d'une série en classes : interpolation linéaire dans la classe qui contient la valeur de rang \\(\\frac{N}{2}\\).",
        ["Classes \\([10 \\,;\\, 20[\\), \\([20 \\,;\\, 30[\\) d'effectifs 4 et 6 : \\(\\bar x = \\frac{15 \\cdot 4 + 25 \\cdot 6}{10} = 21\\).", "\\(\\bar x = 30\\), \\(\\overline{x^2} = 925\\) : \\(\\sigma = \\sqrt{925 - 900} = 5\\)."], "Regrouper deux séries : on ne fait pas la moyenne des écarts-types ; on regroupe les moyennes des carrés."],
      comps: ["Moyenne d'une série en classes ; écart-type ; formule de König", "Transformation affine ; effectif inconnu ; médiane par interpolation", "Ajouter une valeur ; regrouper deux séries ; comparer par la valeur centrée réduite"] },
    // 25.11 (agent col34) : Bayes, systèmes, bases (MA1 + MA2) ; complexes, suites et séries (MA2, niv "R").
    { id: "bayes", theme: "no", label: "Théorème de Bayes", ex: "P_B(A) = \\frac{P(A)\\,P_A(B)}{P(B)}", CH: [15], codesMATU: "4\\.PS\\.02d", lv: BY,
      hint: "P_B(A) = P(A)·P_A(B) ÷ P(B), et P(B) se calcule par les probabilités totales (tous les chemins qui mènent à B). Avec des effectifs : vrais positifs ÷ (vrais + faux positifs).",
      lesson: ["Théorème de Bayes", "Retourner une probabilité conditionnelle.", "On connaît \\(P_A(B)\\) (le test sachant la maladie) et on veut \\(P_B(A)\\) (la maladie sachant le test). Bayes : \\(P_B(A) = \\frac{P(A) \\cdot P_A(B)}{P(B)}\\), où \\(P(B) = P(A)P_A(B) + P(\\overline{A})P_{\\overline{A}}(B)\\) (probabilités totales ; avec trois causes, trois chemins). Avec des effectifs (sur 10'000 personnes), on compte les vrais et les faux positifs. Deux tests positifs indépendants : la probabilité obtenue après le premier sert de point de départ au second.",
        ["\\(P(M) = 0{,}01\\), \\(P_M(+) = 0{,}9\\), \\(P_{\\overline{M}}(+) = 0{,}05\\) : \\(P_+(M) = \\frac{0{,}009}{0{,}009 + 0{,}0495} \\approx 0{,}154\\)", "Sur 10'000 personnes : 90 vrais positifs, 495 faux positifs, \\(\\frac{90}{585} \\approx 15{,}4\\,\\%\\)"], "\\(P_B(A)\\) et \\(P_A(B)\\) ne sont pas égales : quand \\(A\\) est rare, la plupart des alertes sont fausses."],
      comps: ["Appliquer la formule de Bayes (arbre à deux branches, tableau d'effectifs)", "Bayes avec trois causes ; faux négatifs ; raisonner sur des effectifs", "Deux tests successifs ; prévalence pour une probabilité donnée ; probabilité inconnue"] },
    { id: "syslin", theme: "fa", label: "Systèmes linéaires et matrices (Cramer, inverse)", ex: "x = \\frac{D_x}{D}", CH: [15], codesMATU: "4\\.GV\\.02e", lv: SL,
      hint: "AX = B. Si D = det A ≠ 0 : une seule solution, x = Dx ÷ D (Dx : colonne des x remplacée par le second membre), ou X = A⁻¹B. Si D = 0 : aucune solution ou une infinité.",
      lesson: ["Systèmes linéaires et matrices", "Résoudre un système avec des déterminants.", "Le système \\(\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}\\) s'écrit \\(AX = B\\) avec \\(A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\\). Si \\(D = \\det A \\neq 0\\), une seule solution : \\(x = \\frac{D_x}{D}\\), \\(y = \\frac{D_y}{D}\\) (règle de Cramer ; \\(D_x\\) : la colonne des \\(x\\) remplacée par \\(\\binom{e}{f}\\)), ou \\(X = A^{-1}B\\). Si \\(D = 0\\) : aucune solution, ou une infinité si les équations sont proportionnelles. En 3 × 3 : même règle, déterminants par Sarrus.",
        ["\\(\\begin{cases} 2x + y = 7 \\\\ x - 3y = 7 \\end{cases}\\) : \\(D = -7\\), \\(D_x = -28\\), \\(x = 4\\) ; \\(D_y = 7\\), \\(y = -1\\)."], "Dans \\(D_x\\), on remplace la colonne des \\(x\\), pas une ligne ; et \\(x = \\frac{D_x}{D}\\), pas \\(\\frac{D}{D_x}\\)."],
      comps: ["Écrire un système sous forme matricielle ; déterminants D, Dx, Dy ; règle de Cramer", "Résoudre avec l'inverse ; système avec paramètre ; déterminant 3 × 3", "Système 3 × 3 ; problème mis en équations ; infinité de solutions"] },
    { id: "bases", theme: "es", label: "Familles libres, bases, composantes", ex: "\\vec w = \\alpha\\vec u + \\beta\\vec v", CH: [15], codesMATU: "4\\.GV\\.03[abcd]", lv: BA,
      hint: "Une famille est libre si aucun vecteur n'est combinaison des autres : det ≠ 0 (2 vecteurs du plan, 3 de l'espace). Composantes dans une base : résoudre αu + βv (+ γw) = vecteur.",
      lesson: ["Familles libres et bases", "Écrire chaque vecteur avec quelques vecteurs de référence.", "Une combinaison linéaire de \\(\\vec u\\) et \\(\\vec v\\) est un vecteur \\(\\alpha\\vec u + \\beta\\vec v\\). La famille est liée si un vecteur est combinaison des autres (dans le plan : \\(\\det(\\vec u \\,;\\, \\vec v) = 0\\) ; dans l'espace : \\(\\det(\\vec u \\,;\\, \\vec v \\,;\\, \\vec w) = 0\\), vecteurs coplanaires), libre sinon. Une famille libre de 2 vecteurs du plan (3 de l'espace) est une base : tout vecteur s'y écrit de façon unique, ses composantes \\((\\alpha \\,;\\, \\beta)\\) se trouvent en résolvant un système. La dimension du sous-espace engendré est le nombre maximal de vecteurs libres.",
        ["\\(\\vec u = \\binom{1}{2}\\), \\(\\vec v = \\binom{3}{1}\\), \\(\\vec w = \\binom{5}{5}\\) : \\(\\vec w = 2\\vec u + \\vec v\\), composantes \\((2 \\,;\\, 1)\\)."], "Les composantes dépendent de la base : dans la base \\((\\vec u \\,;\\, \\vec v)\\), \\(\\vec w = \\binom{5}{5}\\) a pour composantes \\((2 \\,;\\, 1)\\), pas \\((5 \\,;\\, 5)\\)."],
      comps: ["Composantes dans une base du plan ; famille liée ; retour aux coordonnées usuelles", "Coplanarité avec un paramètre ; composantes dans une base de l'espace ; combinaison", "Dimension d'un sous-espace engendré ; appartenance ; changement de base"] },
    { id: "cplxalg", niv: "R", theme: "no", label: "Nombres complexes : forme algébrique", ex: "i^2 = -1", CH: [15], codesMATU: "4\\.NC\\.01[abc]", lv: CA,
      hint: "Calcule comme avec des polynômes en i, puis remplace i² par −1. Quotient : multiplie en haut et en bas par le conjugué du dénominateur. Réponse : a + bi (touche i du clavier).",
      lesson: ["Nombres complexes", "Un nombre i tel que i² = −1.", "Un nombre complexe s'écrit \\(z = a + bi\\) (\\(a\\) : partie réelle, \\(b\\) : partie imaginaire). On additionne partie par partie ; on multiplie en développant, avec \\(i^2 = -1\\). Conjugué : \\(\\bar z = a - bi\\), et \\(z\\bar z = a^2 + b^2\\) est réel. Pour diviser, on multiplie numérateur et dénominateur par le conjugué du dénominateur. Puissances de \\(i\\) : \\(i, -1, -i, 1\\), puis ça recommence.",
        ["\\((2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 5 + i\\)", "\\(\\frac{5 + 5i}{1 + 2i} = \\frac{(5 + 5i)(1 - 2i)}{5} = 3 - i\\)"], "\\(i^2 = -1\\) : le produit des parties imaginaires passe dans la partie réelle avec le signe opposé."],
      comps: ["Somme, produit, conjugué ; puissances de i", "Quotient ; équation du premier degré ; inverse d'un complexe", "Équation avec le conjugué ; puissance ; racine carrée d'un complexe"] },
    { id: "cplxtrig", niv: "R", theme: "no", label: "Complexes : module, argument, Moivre", ex: "z = r\\,e^{i\\theta}", CH: [15], codesMATU: "4\\.NC\\.02[abcd]", lv: CT,
      hint: "Module |a + bi| = √(a² + b²) ; argument : angle du point (a ; b), ramené dans ]−π ; π]. En multipliant, les modules se multiplient et les arguments s'additionnent ; zⁿ = rⁿe^(inθ) (Moivre).",
      lesson: ["Forme trigonométrique et exponentielle", "Une longueur et un angle.", "Le point \\((a \\,;\\, b)\\) d'affixe \\(z = a + bi\\) est à la distance \\(r = |z| = \\sqrt{a^2 + b^2}\\) de l'origine, dans la direction \\(\\theta = \\arg z\\) : \\(z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}\\). Produit : \\(r_1e^{i\\theta_1} \\cdot r_2e^{i\\theta_2} = r_1r_2e^{i(\\theta_1 + \\theta_2)}\\) ; quotient : modules divisés, arguments soustraits. Moivre : \\((re^{i\\theta})^n = r^ne^{in\\theta}\\). L'argument principal est ramené dans \\(]-\\pi \\,;\\, \\pi]\\).",
        ["\\(1 + i = \\sqrt{2}e^{i\\frac{\\pi}{4}}\\), donc \\((1 + i)^8 = 16e^{2i\\pi} = 16\\)", "\\(\\arg(-1 + \\sqrt{3}i) = \\frac{2\\pi}{3}\\) (2e quadrant)"], "L'argument n'est pas toujours \\(\\arctan\\frac{b}{a}\\) : si \\(a < 0\\), le point est à gauche, on ajoute ou retire \\(\\pi\\)."],
      comps: ["Module, argument ; passer à la forme algébrique", "Moivre ; produit et quotient sous forme exponentielle ; argument d'une puissance", "Parties d'une puissance ; plus petit n pour un réel ; argument d'un quotient de puissances"] },
    { id: "cplxeq", niv: "R", theme: "no", label: "Équations dans ℂ, racines n-ièmes, lieux", ex: "z = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a}", CH: [15], codesMATU: "4\\.NC\\.0[34][abc]", lv: CE,
      hint: "az² + bz + c = 0 avec Δ < 0 : z = (−b ± i√(−Δ)) ÷ 2a, deux solutions conjuguées. zⁿ = Re^(iφ) : module ⁿ√R, arguments φ/n + 2kπ/n. |z − a| = r : cercle de centre a.",
      lesson: ["Équations dans ℂ", "Toute équation du second degré a des solutions.", "Si \\(\\Delta = b^2 - 4ac < 0\\), on écrit \\(\\Delta = (i\\sqrt{-\\Delta})^2\\) : \\(z = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a}\\), deux solutions conjuguées (coefficients réels). Somme des solutions \\(-\\frac{b}{a}\\), produit \\(\\frac{c}{a}\\). L'équation \\(z^n = Re^{i\\varphi}\\) a \\(n\\) solutions de module \\(\\sqrt[n]{R}\\) et d'arguments \\(\\frac{\\varphi}{n} + \\frac{2k\\pi}{n}\\) : un polygone régulier. Lieux : \\(|z - a| = r\\) est le cercle de centre \\(a\\) et de rayon \\(r\\) ; \\(|z - a| = |z - b|\\) est la médiatrice de \\([ab]\\).",
        ["\\(z^2 - 4z + 13 = 0\\) : \\(\\Delta = -36 = (6i)^2\\), \\(z = 2 \\pm 3i\\)", "\\(z^3 = 8i\\) : \\(-2i\\), \\(\\sqrt{3} + i\\), \\(-\\sqrt{3} + i\\)"], "Avec des coefficients complexes, l'autre solution n'est pas forcément le conjugué : utilise la somme des solutions."],
      comps: ["Équation z² = −c ; discriminant ; trinôme à coefficients réels", "Trinôme avec a ≠ 1 ; coefficients à partir d'une solution ; lieux (cercle, médiatrice)", "Racines n-ièmes ; racines cubiques ; équation à coefficients complexes"] },
    { id: "suitegeom", niv: "R", theme: "fa", label: "Suites arithmétiques et géométriques", ex: "u_n = u_1 \\cdot q^{n - 1}", CH: [15], codesMATU: "4\\.AN\\.10[abc]", lv: SG,
      hint: "Arithmétique : u_n = u₁ + (n − 1)r, S = n(u₁ + u_n) ÷ 2. Géométrique : u_n = u₁·qⁿ⁻¹, S = u₁·(qⁿ − 1) ÷ (q − 1). Seuil : on isole l'exposant avec ln.",
      lesson: ["Suites arithmétiques et géométriques", "Ajouter toujours la même chose, ou multiplier.", "Suite arithmétique de raison \\(r\\) : \\(u_{n + 1} = u_n + r\\), \\(u_n = u_1 + (n - 1)r\\), somme des \\(n\\) premiers termes \\(S_n = \\frac{n(u_1 + u_n)}{2}\\). Suite géométrique de raison \\(q\\) : \\(u_{n + 1} = q \\cdot u_n\\), \\(u_n = u_1q^{n - 1}\\), \\(S_n = u_1\\frac{q^n - 1}{q - 1}\\) (\\(q \\neq 1\\)). Pour trouver un rang, on isole \\(q^{n - 1}\\), puis on applique \\(\\ln\\). Une suite \\(u_{n + 1} = au_n + b\\) devient géométrique en retirant son point fixe \\(\\ell = \\frac{b}{1 - a}\\).",
        ["\\(1 + 3 + 5 + \\ldots + 99\\) : 50 termes, \\(S = \\frac{50 \\cdot 100}{2} = 2\\text{'}500\\)", "\\(3 + 6 + 12 + \\ldots\\) (8 termes) : \\(3 \\cdot \\frac{2^8 - 1}{1} = 765\\)"], "De \\(u_1\\) à \\(u_n\\), il y a \\(n - 1\\) pas (pas \\(n\\))."],
      comps: ["Terme général d'une suite arithmétique ou géométrique ; trouver la raison", "Sommes de termes ; rang de dépassement d'un seuil", "Nombre de termes pour une somme ; épargne à versements réguliers ; suites u(n+1) = a·u(n) + b"] },
    { id: "serie", niv: "R", theme: "fa", label: "Séries : géométriques, convergence, Taylor", ex: "\\sum_{n = 0}^{+\\infty} q^n = \\frac{1}{1 - q}", CH: [15], codesMATU: "4\\.AN\\.10d|4\\.AN\\.11[abc]", lv: SE,
      hint: "Si |q| < 1 : u₀ + u₀q + u₀q² + … = u₀ ÷ (1 − q). D'Alembert : si a(n+1)/a(n) tend vers L < 1, la série converge. Mac-Laurin : eᵘ = Σ uᵏ/k!, 1/(1 − u) = Σ uᵏ.",
      lesson: ["Séries", "Additionner une infinité de termes.", "Une série est la limite des sommes partielles \\(S_n\\). Série géométrique de raison \\(q\\) : elle converge si \\(|q| < 1\\), vers \\(\\frac{u_0}{1 - q}\\) ; sinon elle diverge. Critère de d'Alembert (termes positifs) : si \\(\\frac{a_{n + 1}}{a_n} \\to L\\), la série converge si \\(L < 1\\) et diverge si \\(L > 1\\). Série télescopique : les termes se simplifient deux à deux. Développements de Mac-Laurin : \\(e^u = \\sum \\frac{u^k}{k!}\\), \\(\\frac{1}{1 - u} = \\sum u^k\\) (\\(|u| < 1\\)), \\(\\ln(1 + u) = u - \\frac{u^2}{2} + \\frac{u^3}{3} - \\ldots\\)",
        ["\\(0{,}\\overline{36} = \\frac{36}{100} \\cdot \\frac{1}{1 - \\frac{1}{100}} = \\frac{36}{99} = \\frac{4}{11}\\)", "\\(\\sum_{n = 1}^{N} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{N + 1}\\)"], "La formule \\(\\frac{u_0}{1 - q}\\) n'a de sens que si \\(|q| < 1\\) ; et \\(u_0\\) est le premier terme de la série."],
      comps: ["Somme d'une série géométrique ; nombre périodique ; balle qui rebondit", "Paramètre pour une somme donnée ; critère de d'Alembert ; rang pour une précision", "Aires limites (carrés, flocon de Koch) ; séries télescopiques ; coefficients de Mac-Laurin"] },
  ];

  // ---------- enregistrement (additif : aucune notion existante n'est modifiée) ----------
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push(Object.assign({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null }, n.niv ? { niv: n.niv } : {}));
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
  }
  // Figures de leçon : aire sous une courbe (intégrale) et entre deux courbes.
  if (typeof LESSON_FIGS !== "undefined") {
    const fq = (x) => 0.5 * x * x + 1;
    LESSON_FIGS.integrale = () => PL([{ f: fq }], [], { xr: [-1, 4], yr: [-1, 6], polys: [shade(fq, z0, 0.5, 2.5)], label: "aire sous la courbe entre a et b" });
    LESSON_FIGS.aireint = () => PL([{ f: (x) => x * x }, { f: (x) => 2 * x, cls: "f-line" }], [], { xr: [-1, 3], yr: [-1, 5], polys: [shade((x) => 2 * x, (x) => x * x, 0, 2)], label: "aire entre y = 2x et y = x²" });
  }
})();
