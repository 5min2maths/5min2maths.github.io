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
  const caT = (v) => (v === 0 ? "" : v === 1 ? "a + " : v === -1 ? "-a + " : pT(v) + "a + "); /* 27.11 : ni « 0a + b », ni « 1a » */
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
  const r6 = (v) => +(+v).toFixed(6);
  const PAIR = " Réponds « x ; y ».";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);

  // ===================== sys2 : systèmes de deux équations =====================
  const SYS2 = {
    1: [
      () => { const x = nz(-6, 7), y = nz(-6, 7), a = nz(-4, 4), b = y - a * x, c = nz(-4, 5), e = nz(-3, 4), r = c * x + e * y;
        if ((Math.abs(a) === 1 && b === 0) || c + e * a === 0 || Math.abs(c + e * a) === 1) return null; /* 27.11 : « 0x = 0 » (système sans solution unique) ou « 1x » */
        return QP("Résous par substitution : " + sys("y = " + lin(a, b), lhs([c, e]) + " = " + r) + "." + PAIR, [x, y],
          "On remplace " + M("y") + " dans la 2e équation : " + M(lhs([c]) + (e < 0 ? " - " : " + ") + (Math.abs(e) === 1 ? "" : Math.abs(e)) + "(" + lin(a, b) + ") = " + r) + ", donc " + M((c + e * a) + "x = " + (r - e * b)) + ", " + M("x = " + x) + " ; puis " + M("y = " + y) + ".",
          { ctx: "subst", guide: [GN("On remplace " + M("y") + " par " + M(lin(a, b)) + " dans la 2e équation. On obtient une équation en " + M("x") + " : " + M((c + e * a) + "x = " + (r - e * b)) + ". Que vaut " + M("x") + " ?", x, M("x = " + x) + "."), GN("Puis " + M("y = " + lin(a, b)) + " avec " + M("x = " + x) + " : " + M("y") + " = ?", y, M("y = " + y) + "."), GP("La solution (« x ; y ») ?", [x, y], pairT([x, y]) + ".")],
            traps: [TP([y, x], "x d'abord, puis y."), TP([x, a * x - b], "Attention au signe de l'ordonnée à l'origine en calculant y.")] }); },
      () => { const x = nz(-5, 9), y = nz(-5, 9), s = x + y, t = x - y; if (s === 0 || t === 0) return null;
        return QP("Résous par combinaison (addition) : " + sys("x + y = " + s, "x - y = " + t) + "." + PAIR, [x, y], "En additionnant : " + M("2x = " + (s + t)) + ", " + M("x = " + x) + ". Puis " + M("y = " + s + " - " + pT(x) + " = " + y) + ".",
          { ctx: "addition", guide: [GN("Additionne les deux équations : les " + M("y") + " disparaissent. " + M("2x") + " = ?", 2 * x, M("2x = " + s + " + " + pT(t) + " = " + 2 * x) + "."), GN(M("x") + " = ?", x, M("x = " + x) + "."), GP("Avec " + M("x + y = " + s) + " : solution « x ; y » ?", [x, y], pairT([x, y]) + ".")],
            traps: [TP([y, x], "x d'abord, puis y."), TP([x, -y], "Vérifie dans la 2e équation : " + M("x - y = " + t) + ".")] }); },
      () => { const cine = R.rand() < 0.5 /* 26.11 (vraisemblance) : cinéma 15 à 20 CHF, piscine 6 à 9 CHF */, pa = cine ? pk([15, 16, 18, 20]) : pk([6, 7, 8, 9]), pe = cine ? pk([9, 10, 12]) : pk([3, 4, 5]), [n1, m1, n2, m2] = pk([[2, 3, 1, 1], [1, 2, 1, 1], [3, 2, 1, 1], [2, 1, 1, 1]]);
        if (pa === pe) return null;
        const x = (cine ? (L) => L[0] : (L) => L[1])([
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
        return QP("Résous " + sys(a + "x = " + term(b, "y", true) + (r1 ? (r1 < 0 ? " - " : " + ") + Math.abs(r1) : ""), k + "(x + y) = " + (r2 ? r2 + " + " : "") + term(c, "y", true)) /* 26.11 : plus de « = 0 + 4y » */ + " (commence par ordonner chaque équation)." + PAIR, [x, y],
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
          "Système " + sys(caT(x1) + "b = " + y1, caT(x2) + "b = " + y2) + " ; on soustrait : " + M((x2 - x1 === 1 ? "" : x2 - x1) + "a = " + (y2 - y1)) + ", " + M("a = " + fT(a)) + ", puis " + M("b = " + fT(b)) + ".",
          { ctx: "droite", guide: [GN("En remplaçant les deux points, on soustrait les équations : " + M((x2 - x1 === 1 ? "" : x2 - x1) + "a = " + (y2 - y1)) + ". " + M("a") + " = ?", a, M("a = " + fT(a)) + "."), GN("Puis " + M("b = " + y1 + " - " + pT(a) + " \\cdot " + pT(x1)) + " = ?", b, M("b = " + fT(b)) + "."), GP("Réponse « a ; b » ?", [a, b], M("y = " + lin(a, b)) + ".")],
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
          "Ils se rapprochent de " + M((va + vb) + "\\ \\text{km/h}") + " : " + M("t = " + D + " : " + (va + vb) + " = " + t) + " h ; le premier a parcouru " + M(va + " \\cdot " + t + " = " + va * t) + " km.",
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
        return QT("Résous " + sys(row3([1, 1, 1], v), row3([1, -1, 0], v), row3([0, 1, -1], v)) + "." + TRI, v, "De la 2e, " + M("x = y + " + pT(v[0] - v[1])) + " ; de la 3e, " + M("z = y - " + pT(v[1] - v[2])) + " ; dans la 1re : " + M("3y = " + (v[0] + v[1] + v[2] - (v[0] - v[1]) + (v[1] - v[2]))) + ", " + M("y = " + v[1]) + ", puis " + M("x = " + v[0]) + " et " + M("z = " + v[2]) + ".",
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
          { ctx: "antecedent", guide: [GN(M(a + "x") + " = ? (on retire " + M(b) + ")", v - b, M(a + "x = " + (v - b)) + "."), GN(M("x") + " = ?", x, M("x = " + x) + ".")], traps: [{ v: a * v + b, m: "On cherche une préimage (le x), pas l'image de " /* 26.11 soir : « préimage » en Suisse (FR_WORDS → antécédent en France) */ + v + "." }, { v: (v + b) / a, m: "Pour isoler ax, on soustrait b." }] }); },
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
      () => { const n = R.int(1, 9), d = pk([2, 3, 4, 5]), c = nz(-6, 6), z = -c * d / n; if (gcd(n, d) !== 1 || n === 1) return null; /* 24.11 : coefficient irréductible (« 8/2 x » vu à l'audit) */
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
        const chf = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", "{,}")), c = pk([["cahiers", "un cahier coûte"], ["billets", "un billet de bus coûte"], ["glaces", "une glace coûte"], ["entrées à la piscine", "une entrée à la piscine coûte"]]) /* 26.11 (vraisemblance) : une place de cinéma ne coûte pas 7 CHF */;
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
    /* 26.11 soir (agent defis3) : sysprob, sysgraph, sysineq tirés au hasard, 3 contextes et plus (avant : deux énoncés fixes). */
    sysprob: [
      () => { const [cx, txt, n1, l1, n2, l2, tw, lw, lo, hi] = pk([["ferme", "Dans une ferme, il y a des poules et des lapins : on compte # têtes et # pattes.", "poules", 2, "lapins", 4, "têtes", "pattes", [8, 30], [5, 20]],
          ["parking", "Sur un parking, il y a des voitures et des motos : on compte # véhicules et # roues.", "motos", 2, "voitures", 4, "véhicules", "roues", [5, 25], [10, 40]],
          ["salle", "Dans une salle, il y a des tabourets à 3 pieds et des chaises à 4 pieds : on compte # sièges et # pieds.", "tabourets", 3, "chaises", 4, "sièges", "pieds", [6, 20], [10, 30]]]);
        const a = R.int(lo[0], lo[1]), b = R.int(hi[0], hi[1]), T = a + b, P0 = a * l1 + b * l2;
        let i = 0; const q = txt.replace(/#/g, () => [T, P0][i++]);
        return Object.assign(P(q, [["a) Nombre de " + n1, a], ["b) Nombre de " + n2, b]],
          ["Si tous étaient des " + n1 + " : " + T + " · " + l1 + " = " + T * l1 + " " + lw + ".", "Chaque " + n2.replace(/s$/, "") + " ajoute " + (l2 - l1) + " " + lw + " de plus."],
          "Avec x " + n1 + " et y " + n2 + " : " + sys("x + y = " + T, l1 + "x + " + l2 + "y = " + P0) + ". Si tous étaient des " + n1 + " : " + M(T * l1) + " " + lw + " ; il en manque " + M(P0 - T * l1) + ", donc " + M("y = " + (P0 - T * l1) + " : " + (l2 - l1) + " = " + b) + " " + n2 + " et " + M("x = " + T + " - " + b + " = " + a) + " " + n1 + "."), { ctx: cx }); },
      () => { const [cx, txt, u, mm, tt] = pk([["avion", "Un avion parcourt # km en # h avec le vent dans le dos, et en # h contre le vent.", "km/h", [170, 200, 10], [[4, 5]]],
          ["bateau", "Un bateau parcourt # km sur une rivière en # h en descendant le courant, et en # h en le remontant.", "km/h", [4, 10, 2], [[2, 3], [3, 4]]],
          ["kayak", "Une kayakiste parcourt # km en # h en descendant une rivière, et en # h en la remontant.", "km/h", [2, 4, 2], [[2, 3], [1, 2]]]]);
        const [t1, t2] = pk(tt), m = mm[0] + mm[2] * R.int(0, Math.floor((mm[1] - mm[0]) / mm[2])), D = m * t1 * t2, s1 = D / t1, s2 = D / t2, v = (s1 + s2) / 2, w = (s1 - s2) / 2, fl = cx === "avion" ? "du vent" : "du courant";
        let i = 0; const q = txt.replace(/#/g, () => [N(D), t1, t2][i++]);
        return Object.assign(P(q, [["a) Vitesse dans le sens favorable (" + u + ")", s1], ["b) Vitesse dans le sens contraire (" + u + ")", s2], ["c) Vitesse propre (sans " + (cx === "avion" ? "vent" : "courant") + ", " + u + ")", v], ["d) Vitesse " + fl + " (" + u + ")", w]],
          ["Avec v la vitesse propre et w celle " + fl + " : v + w = " + N(s1).replace(/\\text\{'\}/g, "'") + " et v − w = " + N(s2).replace(/\\text\{'\}/g, "'") + ".", "Additionne les deux équations, puis soustrais-les."],
          "a) " + M(N(D) + " : " + t1 + " = " + N(s1)) + " ; b) " + M(N(D) + " : " + t2 + " = " + N(s2)) + " ; " + sys("v + w = " + N(s1), "v - w = " + N(s2)) + " ; c) " + M("2v = " + N(s1 + s2)) + ", " + M("v = " + N(v)) + " " + u + " ; d) " + M("w = " + N(s1) + " - " + N(v) + " = " + N(w)) + " " + u + "."), { ctx: cx }); },
    ],
    sysgraph: [
      () => { let a1, b1, f, x0, y0, m0; do { a1 = R.int(1, 5); b1 = R.int(1, 5); f = pk([2, 3]); x0 = R.int(-3, 4); y0 = R.int(-3, 4); m0 = R.int(1, 9); } while (gcd2(a1, b1) !== 1 || m0 === f * b1 || x0 === 0 || y0 === 0);
        const c1 = a1 * x0 + b1 * y0, a2 = f * a1, k0 = a2 * x0 + m0 * y0;
        return Object.assign(P("On considère " + sys(lhs([a1, b1]) + " = " + c1, a2 + "x + my = k") + " (m et k sont des nombres).", [["a) Pour quel m les deux droites sont-elles parallèles ?", f * b1], ["b) Avec ce m, pour quel k y a-t-il une infinité de solutions ?", f * c1], ["c) Avec m = " + m0 + " et k = " + k0 + " : abscisse x de la solution", x0], ["d) Avec m = " + m0 + " et k = " + k0 + " : ordonnée y de la solution", y0]],
          ["Parallèles : coefficients de x et de y proportionnels (facteur " + f + ").", "c) Résous le système (par exemple par combinaison)."],
          "a) " + M(a2 + " = " + f + " \\cdot " + a1) + ", donc " + M("m = " + f + " \\cdot " + b1 + " = " + f * b1) + " ; b) confondues si aussi " + M("k = " + f + " \\cdot " + pT(c1) + " = " + f * c1) + " ; c) et d) " + sys(lhs([a1, b1]) + " = " + c1, a2 + "x + " + m0 + "y = " + k0) + " donne " + pairT([x0, y0]) + "."), { ctx: "parametre" }); },
      () => { const [cx, txt, unit, pAs, pBs] = pk([["operateur", "Deux opérateurs : A coûte # CHF par mois plus # CHF la minute ; B coûte # CHF la minute.", "minutes", [0.05, 0.1], [0.2, 0.25, 0.3]],
          ["velo", "Location de vélo : l'agence A demande # CHF de frais de dossier plus # CHF de l'heure ; l'agence B demande # CHF de l'heure.", "heures", [2, 3], [5, 6, 7]],
          ["sport", "Salle de sport : la formule A coûte # CHF par an plus # CHF la séance ; la formule B coûte # CHF la séance.", "séances", [4, 5, 6], [9, 10, 12]]]);
        let pA, pB, xe, F; for (let t = 0; t < 50; t++) { pA = pk(pAs); pB = pk(pBs); xe = unit === "minutes" ? 10 * R.int(5, 20) : unit === "heures" ? R.int(3, 8) : R.int(8, 20); F = r6((pB - pA) * xe); if (F >= 4 && Number.isInteger(r6(F * 100))) break; }
        const n = unit === "minutes" ? 10 * R.int(3, 25) : unit === "heures" ? R.int(2, 10) : R.int(5, 25), cA = r6(F + pA * n), cB = r6(pB * n);
        let i = 0; const q = txt.replace(/#/g, () => N([F, pA, pB][i++]));
        return Object.assign(P(q, [["a) Coût de A pour " + n + " " + unit + " (CHF)", cA], ["b) Coût de B pour " + n + " " + unit + " (CHF)", cB], ["c) Nombre de " + unit + " pour lequel les deux coûts sont égaux", xe]],
          ["Écris deux fonctions affines : A(x) = " + N(F).replace("{,}", ",") + " + " + N(pA).replace("{,}", ",") + "x et B(x) = " + N(pB).replace("{,}", ",") + "x.", "c) Résous A(x) = B(x) : les deux droites se coupent."],
          "a) " + M(N(F) + " + " + N(pA) + " \\cdot " + n + " = " + N(cA)) + " CHF ; b) " + M(N(pB) + " \\cdot " + n + " = " + N(cB)) + " CHF ; c) " + M(N(F) + " + " + N(pA) + "x = " + N(pB) + "x") + ", " + M(N(r6(pB - pA)) + "x = " + N(F)) + ", " + M("x = " + xe) + " " + unit + "."), { ctx: cx }); },
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
      () => { const [cx, txt, who, Cs, ps, mins] = pk([["sortie", "Pour une sortie, la classe dispose de # CHF. Le car coûte # CHF et l'entrée # CHF par élève. Il faut au moins # élèves pour que la sortie ait lieu.", "élèves", [180, 240, 300], [8, 10, 12, 15], [10, 12]],
          ["anniversaire", "Pour un anniversaire, Léa dispose de # CHF. La salle coûte # CHF et le repas # CHF par invité. Elle veut inviter au moins # personnes.", "invités", [60, 80, 100], [12, 15, 18, 20], [8, 10]],
          ["club", "Un club de foot dispose de # CHF pour un tournoi. La location du terrain coûte # CHF et l'inscription # CHF par joueur. Il faut au moins # joueurs.", "joueurs", [100, 150, 200], [6, 8, 10], [11, 14]]]);
        let B, C, p, mn, mx; for (let t = 0; t < 80; t++) { C = pk(Cs); p = pk(ps); mn = pk(mins); mx = mn + R.int(4, 14); B = C + p * mx + R.int(0, p - 1); if (Math.floor((B - C) / p) === mx && B % 10 === 0) break; }
        mx = Math.floor((B - C) / p); const dw = /^[éiaeou]/.test(who) ? "d'" : "de ", ex = (B - C) % p === 0;
        let i = 0; const q = txt.replace(/#/g, () => N([B, C, p, mn][i++]));
        return Object.assign(P(q, [["a) Nombre maximal " + dw + who, mx], ["b) Nombre minimal " + dw + who, mn], ["c) Combien de valeurs possibles pour le nombre " + dw + who + " ?", mx - mn + 1]],
          [C + " + " + p + "x ≤ " + B + ".", "c) Les entiers de " + mn + " à " + mx + "."],
          "a) " + M(C + " + " + p + "x \\le " + N(B)) + ", " + M(p + "x \\le " + (B - C)) + ", " + M("x \\le \\frac{" + (B - C) + "}{" + p + "}" + (ex ? " = " + mx : " \\approx " + N(Math.floor(((B - C) / p) * 10) / 10) + "\\ldots")) + ", donc au plus " + M(mx) + " ; b) " + M(mn) + " ; c) de " + mn + " à " + mx + " : " + M(mx + " - " + mn + " + 1 = " + (mx - mn + 1)) + " valeurs."), { ctx: cx }); },
      () => { let Lb, Rb, a, b, d; do { Lb = R.int(-4, 4); Rb = Lb + R.int(3, 8); a = R.int(2, 5); b = R.int(1, 9); d = R.int(1, 9); } while (d - Rb === 0 || a * Lb - b === 0);
        const strictL = R.rand() < 0.5, cnt = Rb - Lb + (strictL ? 0 : 1), c1 = a * Lb - b, e = d - Rb;
        return Object.assign(P("On cherche les nombres x qui vérifient à la fois " + M(a + "x - " + b + (strictL ? " > " : " \\ge ") + c1) + " et " + M(d + " - x \\ge " + e) + ".", [["a) Borne de gauche (" + (strictL ? "exclue" : "comprise") + ")", Lb], ["b) Borne de droite (comprise)", Rb], ["c) Combien d'entiers vérifient le système ?", cnt]],
          [M(a + "x" + (strictL ? " > " : " \\ge ") + (c1 + b)) + " ; " + M("-x \\ge " + (e - d)) + ", donc " + M("x \\le " + Rb) + " (on change le sens en divisant par −1).", "c) Compte les entiers de l'intervalle."],
          M(a + "x" + (strictL ? " > " : " \\ge ") + (c1 + b)) + ", " + M("x" + (strictL ? " > " : " \\ge ") + Lb) + " ; " + M("x \\le " + Rb) + " : " + M("S = \\," + (strictL ? "]" : "[") + Lb + " \\,;\\, " + Rb + "]") + " ; " + cnt + " entiers."), { ctx: "algebre" }); },
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
