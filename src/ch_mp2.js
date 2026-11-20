// Chantier MP 2e (20.11 : « tout le dev MP2 », les classes MP2C et MP2D de l'auteur deviennent bêta-testeuses),
// calé sur le cours CFPT (plans_mp2.py) : A. fonctions affines (droites, droitesinter) et réciproque d'une fonction
// affine (recipaff, notion nouvelle) ; B. trigonométrie ; C. analyse de données. Niveau maturité professionnelle :
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
    if (tr.spec) { const c = pairS(tr.spec.values); try { if (seen.has(c) || !tr.spec.values.every(isFinite) || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status !== "wrong") return false; } catch (e) { return false; } seen.add(c); return true; }
    return isFinite(tr.v) && spec.kind === "value" && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value: r6(value) }, o.round ? { round: o.round } : {}), sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: pairS(vals) }, o));
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const G = (ask, value, sol) => GS(ask, r6(value), sol);
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TR = (v, m) => TRAP(r6(v), m);
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m });
  const TX = (e, m) => ({ e, m });
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
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

  const PROBS = {
    droites: [() => P("Une droite passe par A(−1 ; 5) et B(3 ; −3).", [["a) Pente", -2], ["b) Ordonnée à l'origine", 3], ["c) Pente d'une perpendiculaire (fraction acceptée)", 0.5]], ["Δy ÷ Δx.", "5 = −2 · (−1) + h."], "a) " + M("\\frac{-8}{4} = -2") + " ; b) " + M("h = 3") + " ; c) " + M("\\frac{1}{2}") + " (produit des pentes : −1).")],
    droitesinter: [() => P("Offre A : 20 CHF + 1,50 CHF par km. Offre B : 50 CHF + 0,90 CHF par km.", [["a) Prix de A pour 40 km (CHF)", 80], ["b) Nombre de km où les offres coûtent pareil", 50], ["c) Prix commun (CHF)", 95]], ["20 + 1,5 · 40.", "1,5x + 20 = 0,9x + 50."], "a) 80 ; b) " + M("0{,}6x = 30") + ", " + M("x = 50") + " ; c) " + M("20 + 75 = 95") + " CHF.")],
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

  const ALL = { droites: DR, droitesinter: DI, recipaff: RF };
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
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    droites: ["Pente, lecture graphique, équation par deux points", "Parallèle, perpendiculaire, paramètre", "Système, point sur une droite, modéliser"],
    droitesinter: ["Intersection, axes, droite horizontale", "Offres, droite par deux points, médiatrice", "Aire d'un triangle, rencontre, hauteur"],
    recipaff: ["f⁻¹(b), point symétrique, opération inverse", "Expression de f⁻¹, conversion °C/°F, symétrie", "Taxi, reconstruire f, intersection avec y = x"],
  });
})();
