// Chantier 1re Collège (bêta-testeurs) · lot 3 du plan pas à pas (19.11) : une seule source pour fimg, lectgraph,
// racinv, modaff, transf ; absval et morceaux ajoutés le 20.11 (dernières notions de 1re sans pas à pas). Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs typiques,
// étiquette ctx, figures (repère gradué) ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(6)); return Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(4)).replace(".", "{,}"); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const sg = (v) => (v < 0 ? " - " + -v : " + " + v);
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? sg(b) : "");
  const tri = (a, b, c) => (a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + (b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x" : "") + (c ? sg(c) : "");
  const IT = (ivs) => ivs.map(([a, ac, b, bc]) => (ac ? "[" : "]") + (a === -Infinity ? "-\\infty" : a) + " \\,;\\, " + (b === Infinity ? "+\\infty" : b) + (bc ? "]" : "[")).join(" \\cup ");
  // ---------- constructeurs ----------
  const show = (spec) => spec.kind === "pair" ? spec.values.map(fS).join(" ; ") : spec.kind === "set" ? spec.values.map(fS).join(" ; ") : SolSet.show(spec.ivs, false);
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({}, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const FA = " (fraction acceptée)";
  const PL = (fns, o = {}) => FIG.plot(fns, [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));

  // ===================== fimg =====================
  const FI = {
    1: [
      () => { const b = nz(-5, 5), c = nz(-6, 6), x = -R.int(1, 4), v = x * x + b * x + c;
        return QN("Soit " + M("f(x) = " + tri(1, b, c)) + ". Calcule " + M("f(" + x + ")") + ".", v, M(par(x) + "^2" + (b < 0 ? " - " + -b : " + " + b) + " \\cdot " + par(x) + sg(c) + " = " + x * x + sg(b * x) + sg(c) + " = " + v) + ".",
          { ctx: "image-poly", guide: [GS(M(par(x) + "^2") + " = ?", x * x, M(x * x) + " (un carré est positif)."), GS(M(b + " \\cdot " + par(x)) + " = ?", b * x, M(b * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")],
            traps: [TR(-x * x + b * x + c, M(par(x) + "^2 = " + x * x) + " : avec les parenthèses, le carré est positif."), TR(x * x - b * x + c, "Attention au signe de " + b + " · (" + x + ").")] }); },
      () => { const a = nz(-4, 5), b = nz(-8, 8), y = R.int(-15, 15), x = (y - b) / a; if (!Number.isInteger(x) || a === 1) return null;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Détermine la préimage de " + M(y) + ".", x, M(lin(a, b) + " = " + y + " \\iff " + a + "x = " + (y - b) + " \\iff x = " + x) + ".",
          { ctx: "preimage-aff", guide: [GS("On résout " + M(lin(a, b) + " = " + y) + ". D'abord " + M(a + "x") + " = ?", y - b, M(y - b) + "."), GS(M("x") + " = ?", x, M(x) + ".")],
            traps: [TR(a * y + b, "Ça, c'est l'image de " + y + " ; on cherche x tel que f(x) = " + y + "."), TR((y + b) / a, "On soustrait " + b + " des deux côtés.")] }); },
      () => { const a = pk([0.5, 1, -1, -0.5]), p = R.int(-3, 0), q = p + R.int(2, 4), f = (x) => a * (x - p) * (x - q), xs = [-3, -2, -1, 0, 1, 2, 3, 4].filter((x) => Number.isInteger(f(x)) && Math.abs(f(x)) <= 5 && x !== p && x !== q && x !== 0); if (!xs.length) return null; const x = pk(xs);
        return QN("La courbe représente une fonction " + M("f") + ". Lis " + M("f(" + x + ")") + " sur le graphique.", f(x), "On part de " + M("x = " + x) + " sur l'axe horizontal, on monte (ou descend) jusqu'à la courbe, puis on lit l'ordonnée : " + M("f(" + x + ") = " + f(x)) + ".",
          { ctx: "lire-image", fig: PL([{ f }]), guide: [GS("Ordonnée du point de la courbe d'abscisse " + M(x) + " ?", f(x), M(f(x)) + ".")], traps: [TR(x, "f(" + x + ") est une ordonnée (hauteur), pas une abscisse."), TR(-f(x), "Vérifie si le point est au-dessus ou en dessous de l'axe.")] }); },
    ],
    2: [
      () => { const k = R.int(-5, 5), r = R.int(2, 7);
        return QN("Soit " + M("f(x) = \\sqrt{" + xm(-k) + "}") + ". Calcule " + M("f(" + (r * r - k) + ")") + ".", r, M("\\sqrt{" + (r * r - k) + sg(k) + "} = \\sqrt{" + r * r + "} = " + r) + ".",
          { ctx: "image-racine", guide: [GS("Sous la racine, " + M((r * r - k) + sg(k)) + " = ?", r * r, M(r * r) + "."), GS("Racine ?", r, M(r) + ".")], traps: [TR(Math.sqrt(r * r - k) + k, "On calcule d'abord tout ce qui est sous la racine."), TR(r * r, "N'oublie pas la racine.")] }); },
      () => { const c = R.int(-6, 4), v = R.int(2, 7), y = v * v + c;
        return QSet("Soit " + M("f(x) = x^2" + (c ? sg(c) : "")) + ". Détermine les préimages de " + M(y) + ".", [v, -v], M("x^2" + (c ? sg(c) : "") + " = " + y + " \\iff x^2 = " + v * v) + " : " + M("x = " + v) + " ou " + M("x = -" + v) + ".",
          { ctx: "preimage-carre", fig: FIG.parabola((t) => (t * t + c) / 3, [], null, false), guide: [GS(M("x^2") + " = ?", v * v, M(v * v) + "."), GSet("Préimages ?", [v, -v], M(v) + " et " + M(-v) + ".")], traps: [TSet([v], "Un carré a deux racines : " + v + " et −" + v + "."), TSet([y * y + c], "On cherche x tel que f(x) = " + y + ", pas f(" + y + ").")] }); },
      () => { const p = R.int(-4, 1), q = p + R.int(2, 5), f = (x) => 0.5 * (x - p) * (x - q), xs = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x < (p + q) / 2 && Number.isInteger(f(x)) && f(x) > 0 && f(x) <= 5); if (!xs.length) return null; const x1 = pk(xs), k = f(x1), x2 = p + q - x1;
        return QSet("La courbe représente une fonction " + M("f") + ". Lis les solutions de " + M("f(x) = " + k) + " (la droite " + M("y = " + k) + " est en pointillé).", [x1, x2], "La droite horizontale " + M("y = " + k) + " coupe la courbe en " + M("x = " + x1) + " et " + M("x = " + x2) + ".",
          { ctx: "lire-preimages", fig: PL([{ f }], { hlines: [k] }), guide: [GS("Abscisse du point d'intersection de gauche ?", x1, M(x1) + "."), GSet("Solutions ?", [x1, x2], M(x1) + " et " + M(x2) + ".")], traps: [TSet([x1], "La droite coupe la courbe deux fois."), TSet([p, q], "Ça, ce sont les zéros (f(x) = 0) ; on cherche f(x) = " + k + ".")] }); },
    ],
    3: [
      () => { const p = nz(-5, 4), q = p + R.int(1, 6), y = nz(-8, 8), b = -(p + q), c = p * q + y;
        return QSet("Soit " + M("f(x) = " + tri(1, b, c)) + ". Détermine les préimages de " + M(y) + ".", [p, q], M(tri(1, b, c) + " = " + y + " \\iff " + tri(1, b, p * q) + " = 0 \\iff (" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + ".",
          { ctx: "preimage-tri", guide: [GX("Ramène à « … = 0 » : expression ?", "x^2" + (b < 0 ? "-" + -b : "+" + b) + "*x" + (p * q < 0 ? "-" + -p * q : "+" + p * q), M(tri(1, b, p * q) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Les zéros de (x − p)(x − q) sont p et q : attention aux signes.")] }); },
      () => { const a = nz(-3, 3), b = nz(-5, 5), x = R.int(-3, 4), fx = a * x + b, v = a * fx + b; if (a === 1 || Math.abs(v) > 60) return null;
        return QN("Soit " + M("f(x) = " + lin(a, b)) + ". Calcule " + M("f(f(" + x + "))") + ".", v, M("f(" + x + ") = " + fx) + ", puis " + M("f(" + fx + ") = " + a + " \\cdot " + par(fx) + sg(b) + " = " + v) + ".",
          { ctx: "compose", guide: [GS("D'abord " + M("f(" + x + ")") + " ?", fx, M(fx) + "."), GS("Puis " + M("f(" + fx + ")") + " ?", v, M(v) + ".")], traps: [TR(fx, "Il faut appliquer f deux fois."), TR(fx * fx, "f(f(x)) n'est pas f(x)².")] }); },
      () => { const a = nz(-4, 5), x = pk([2, 3, -2, -1]), y = a * x * x, r = pk([1, 4, -3, 5].filter((t) => t !== x));
        return QN("Soit " + M("f(x) = ax^2") + " avec " + M("f(" + x + ") = " + y) + ". Calcule " + M("f(" + r + ")") + ".", a * r * r, M(a + " \\cdot " + par(x) + "^2 = " + y) + " donne " + M("a = " + a) + " ; " + M("f(" + r + ") = " + a + " \\cdot " + par(r) + "^2 = " + a * r * r) + ".",
          { ctx: "parametre", guide: [GS("Valeur de " + M("a") + " ?", a, M(y + " : " + par(x * x) + " = " + a) + "."), GS(M("f(" + r + ")") + " ?", a * r * r, M(a * r * r) + ".")], traps: [TR(y / x, "f(" + x + ") = a · " + x + "², donc a = " + y + " ÷ " + x * x + "."), TR(-a * r * r, "Un carré est positif : (" + r + ")² = " + r * r + ".")] }); },
    ],
  };

  // ===================== lectgraph =====================
  const LG = {
    1: [
      () => { const a = pk([0.5, -0.5, 1, -1]), p = R.int(-4, 1), q = p + (Math.abs(a) === 1 ? pk([2, 3, 4]) : pk([2, 3, 4, 5, 6])); if (q > 5) return null; const big = R.rand() < 0.5;
        return QN("La courbe représente une fonction " + M("f") + ". Quel est son plus " + (big ? "grand" : "petit") + " zéro ?", big ? q : p, "La courbe coupe l'axe des " + M("x") + " en " + M(p) + " et en " + M(q) + ".",
          { ctx: "zero", fig: PL([{ f: (x) => a * (x - p) * (x - q) }]), guide: [GS("Plus " + (big ? "grand" : "petit") + " zéro ?", big ? q : p, M(big ? q : p) + ".")], traps: [TR(a * p * q, "Ça, c'est l'ordonnée à l'origine (axe vertical) ; un zéro se lit sur l'axe horizontal."), TR(big ? p : q, "On demande le plus " + (big ? "grand" : "petit") + ".")] }); },
      () => { const a = pk([-1, 1, 0.5]), p = R.int(-3, 0), q = p + 2 * R.int(1, 2), f = (x) => a * (x - p) * (x - q), y0 = f(0); if (!Number.isInteger(y0) || Math.abs(y0) > 5 || y0 === 0) return null;
        return QN("La courbe représente une fonction " + M("f") + ". Quelle est son ordonnée à l'origine " + M("f(0)") + " ?", y0, "La courbe coupe l'axe vertical en " + M(y0) + ".",
          { ctx: "ordonnee", fig: PL([{ f }]), guide: [GS("Où la courbe coupe-t-elle l'axe vertical ?", y0, M(y0) + ".")], traps: [TR(p, "Ça, c'est un zéro (axe horizontal)."), TR(-y0, "Au-dessus ou en dessous de l'axe ?")] }); },
      () => { const m = R.int(-1, 1), s = pk([1, 1.5]), c = pk([-3, -2, 0, 2, 3]), f = cubicF(m, s, c), xs = [], hi = 2 * s + c, lo = -2 * s + c; const n = hi > 0 && lo < 0 ? 3 : 1; if (hi === 0 || lo === 0) return null;
        return QN("La courbe représente une fonction " + M("f") + " (elle continue de monter à droite et de descendre à gauche). Combien de zéros " + M("f") + " a-t-elle ?", n, "La courbe coupe l'axe horizontal " + M(n) + " fois.",
          { ctx: "nb-zeros", fig: PL([{ f }]), guide: [GS("Nombre de points d'intersection avec l'axe horizontal ?", n, M(n) + ".")], traps: [TR(n === 3 ? 1 : 3, "Compte les passages de la courbe sur l'axe horizontal (y = 0)."), TR(2, "Compte bien tous les points.")] }); },
    ],
    2: [
      () => { const m = R.int(-2, 2), s = pk([1, 1.5]), c = R.int(-1, 1), mx = R.rand() < 0.5;
        return QN("La courbe représente une fonction " + M("f") + ". " + (mx ? "Pour quelle valeur de " + M("x") + " atteint-elle son maximum local (le sommet de la « bosse ») ?" : "Elle est décroissante entre deux valeurs de " + M("x") + ". Quelle est la plus grande des deux ?"), mx ? m - 1 : m + 1, "La courbe monte jusqu'en " + M("x = " + (m - 1)) + ", descend jusqu'en " + M("x = " + (m + 1)) + ", puis remonte.",
          { ctx: mx ? "max-local" : "decroissance", fig: PL([{ f: cubicF(m, s, c) }]), guide: [GS("Abscisse de la bosse ?", m - 1, M(m - 1) + "."), GS("Réponse ?", mx ? m - 1 : m + 1, M(mx ? m - 1 : m + 1) + ".")], traps: [TR(mx ? 2 * s + c : m - 1, mx ? "Ça, c'est la valeur du maximum (ordonnée) ; on demande l'abscisse." : "La courbe descend après la bosse, jusqu'au creux."), TR(mx ? m + 1 : -2 * s + c, mx ? "C'est le creux (minimum local)." : "On demande une valeur de x, pas une ordonnée.")] }); },
      () => { const m = R.int(-2, 2), s = pk([1, 1.5]), c = R.int(-1, 1), hi = 2 * s + c, lo = -2 * s + c; let k; do k = R.int(-5, 5); while (k === hi || k === lo); const n = k < hi && k > lo ? 3 : 1;
        return QN("La courbe représente une fonction " + M("f") + " (elle continue de monter à droite et de descendre à gauche). Combien de solutions l'équation " + M("f(x) = " + k) + " a-t-elle ? La droite " + M("y = " + k) + " est tracée en pointillé.", n, "La droite horizontale " + M("y = " + k) + " coupe la courbe en " + M(n) + " point" + (n > 1 ? "s" : "") + ".",
          { ctx: "nb-solutions", fig: PL([{ f: cubicF(m, s, c) }], { hlines: [k] }), guide: [GS("Points d'intersection avec la droite ?", n, M(n) + ".")], traps: [TR(n === 3 ? 1 : 3, "Compte les points d'intersection de la courbe avec la droite pointillée."), TR(k, "On demande un nombre de solutions.")] }); },
      () => { const h = R.int(-3, 3), k = R.int(1, 5), down = R.rand() < 0.5, a = down ? -1 : 1, kk = down ? k : -k, f = (x) => a * (x - h) ** 2 + kk;
        return QN("La courbe représente une fonction " + M("f") + ". Quelle est la valeur " + (down ? "maximale" : "minimale") + " de " + M("f") + " ?", kk, "Le sommet de la parabole est " + M("(" + h + " ; " + kk + ")") + " : la valeur " + (down ? "maximale" : "minimale") + " est " + M(kk) + ".",
          { ctx: down ? "valeur-max" : "valeur-min", fig: PL([{ f }]), guide: [GP("Sommet ? (« x ; y »)", [h, kk], M("(" + h + " ; " + kk + ")") + "."), GS("Valeur " + (down ? "maximale" : "minimale") + " ?", kk, M(kk) + ".")], traps: [TR(h, "La valeur d'une fonction est une ordonnée ; " + h + " est l'abscisse où elle est atteinte.")] }); },
    ],
    3: [
      () => { const p = R.int(-4, 0), q = p + R.int(2, 5), up = R.rand() < 0.5, a = up ? 0.5 : -0.5, f = (x) => a * (x - p) * (x - q), pos = R.rand() < 0.5, inside = up !== pos, ivs = inside ? [[p, false, q, false]] : [[-Infinity, false, p, false], [q, false, Infinity, false]];
        if (q > 5) return null;
        return QS("La courbe représente une fonction " + M("f") + ". Résous " + M("f(x) " + (pos ? ">" : "<") + " 0") + " (où la courbe est-elle " + (pos ? "au-dessus" : "en dessous") + " de l'axe ?).", ivs, "La courbe est " + (pos ? "au-dessus" : "en dessous") + " de l'axe " + (inside ? "entre les zéros" : "à l'extérieur des zéros") + " " + M(p) + " et " + M(q) + " : " + M("S = " + IT(ivs)) + ".",
          { ctx: "signe-graph", fig: PL([{ f }]), guide: [GS("Plus petit zéro ?", p, M(p) + "."), GSS("Solution ?", ivs, M(IT(ivs)) + ".")], traps: [TS(inside ? [[-Infinity, false, p, false], [q, false, Infinity, false]] : [[p, false, q, false]], "Regarde où la courbe est " + (pos ? "au-dessus" : "en dessous") + " de l'axe horizontal."), TS(inside ? [[p, true, q, true]] : [[-Infinity, false, p, true], [q, true, Infinity, false]], "Inégalité stricte : les zéros sont exclus.")] }); },
      () => { const h = R.int(-3, 3), k = R.int(-4, 2), up = R.rand() < 0.5, f = (x) => (up ? 0.5 : -0.5) * (x - h) ** 2 + k, inc = R.rand() < 0.5, ivs = up === inc ? [[h, true, Infinity, false]] : [[-Infinity, false, h, true]];
        return QS("La courbe représente une fonction " + M("f") + ". Sur quel intervalle " + M("f") + " est-elle " + (inc ? "croissante" : "décroissante") + " ?", ivs, "La parabole " + (up ? "descend puis monte" : "monte puis descend") + ", avec son sommet en " + M("x = " + h) + " : " + M(IT(ivs)) + ".",
          { ctx: "variations", fig: PL([{ f }]), guide: [GS("Abscisse du sommet ?", h, M(h) + "."), GSS("Intervalle ?", ivs, M(IT(ivs)) + ".")], traps: [TS(up === inc ? [[-Infinity, false, h, true]] : [[h, true, Infinity, false]], "Croissante = la courbe monte quand on va vers la droite."), TS(up === inc ? [[k, true, Infinity, false]] : [[-Infinity, false, k, true]], "Un intervalle de variation se lit sur l'axe des x.")] }); },
      () => { const p = R.int(-3, 0), q = p + R.int(2, 4), m = pk([1, -1, 0.5]), b0 = R.int(-2, 2), f = (x) => 0.5 * (x - p) * (x - q) + m * x + b0, g = (x) => m * x + b0; if (q > 4 || Math.abs(g(p)) > 5 || Math.abs(g(q)) > 5 || !Number.isInteger(g(p)) || !Number.isInteger(g(q))) return null;
        return QSet("On a tracé les graphes de " + M("f") + " (courbe) et " + M("g") + " (droite). Résous " + M("f(x) = g(x)") + ".", [p, q], "Les deux graphes se coupent en " + M("x = " + p) + " et " + M("x = " + q) + ".",
          { ctx: "f-egal-g", fig: PL([{ f }, { f: g }]), guide: [GS("Abscisse du point d'intersection de gauche ?", p, M(p) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([g(p), g(q)], "On demande les abscisses x, pas les ordonnées."), TSet([p], "Les graphes se coupent deux fois.")] }); },
    ],
  };

  // ===================== racinv =====================
  const RI = {
    1: [
      () => { const a = pk([1, -1]) * R.int(2, 12), x = nz(-6, 6); if (Number.isInteger(a / x) && Math.abs(x) === 1) return null;
        return QN("Soit " + M("f(x) = \\frac{" + a + "}{x}") + ". Calcule " + M("f(" + x + ")") + FA + ".", a / x, M("\\frac{" + a + "}{" + x + "} = " + fT(a / x)) + ".",
          { ctx: "image-inv", fig: FIG.plot([{ f: (t) => a / t }], [], { ticks: true }), guide: [GS("Image" + FA + " ?", a / x, M(fT(a / x)) + ".")], traps: [TR(x / a, "C'est " + a + " divisé par x, pas l'inverse."), TR(a * x, "On divise par x.")] }); },
      () => { const a = pk([1, -1]) * R.int(2, 12), y = pk([2, 3, 4, 6, -2, -3, 5]);
        return QN("Soit " + M("f(x) = \\frac{" + a + "}{x}") + ". Détermine la préimage de " + M(y) + FA + ".", a / y, M("\\frac{" + a + "}{x} = " + y + " \\iff x = \\frac{" + a + "}{" + y + "} = " + fT(a / y)) + ".",
          { ctx: "preimage-inv", guide: [GS("On résout " + M("\\frac{" + a + "}{x} = " + y) + " : " + M("x") + FA + " ?", a / y, M(fT(a / y)) + ".")], traps: [TR(y / a, "x = " + a + " ÷ " + y + " (on multiplie par x puis divise par " + y + ")."), TR(a * y, "Ça, c'est a · y ; il faut diviser.")] }); },
      () => { const c = nz(-5, 5), r = R.int(2, 9);
        return QN("Soit " + M("f(x) = \\sqrt{x}" + sg(c)) + ". Calcule " + M("f(" + r * r + ")") + ".", r + c, M("\\sqrt{" + r * r + "}" + sg(c) + " = " + r + sg(c) + " = " + (r + c)) + ".",
          { ctx: "image-sqrt", fig: FIG.plot([{ f: (t) => Math.sqrt(t) + c, from: 0 }], [], { xr: [-2, 30], yr: [-6, 10], grid: false, ticks: false }), guide: [GS(M("\\sqrt{" + r * r + "}") + " = ?", r, M(r) + "."), GS("Image ?", r + c, M(r + c) + ".")], traps: [TR(Math.sqrt(r * r + c), "La racine porte seulement sur x : on ajoute " + c + " après."), TR(r * r + c, "N'oublie pas la racine.")] }); },
    ],
    2: [
      () => { const t = R.int(2, 5), c = t * t - t;
        return QSet("Résous " + M("\\sqrt{x} = x - " + c) + ". (Attention aux solutions parasites.)", [t * t], "On élève au carré : " + M("x = (x - " + c + ")^2") + ", d'où " + M(t * t) + " et " + M((1 - t) ** 2) + ". Vérification : seule " + M("x = " + t * t) + " convient.",
          { ctx: "sqrt-lin", fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }, { f: (x) => x - c }], [], { xr: [-2, 30], yr: [-3, 7], grid: false, ticks: false }), guide: [GSet("Solutions de " + M("x = (x - " + c + ")^2") + " ?", [t * t, (1 - t) ** 2], M(t * t) + " et " + M((1 - t) ** 2) + "."), GSet("Celles qui vérifient l'équation de départ ?", [t * t], M("\\sqrt{" + (1 - t) ** 2 + "} = " + (t - 1) + " \\ne " + ((1 - t) ** 2 - c)) + " : seule " + M(t * t) + ".")], traps: [TSet([t * t, (1 - t) ** 2], "Vérifie chaque solution : élever au carré peut ajouter des solutions parasites.")] }); },
      () => { const k = nz(-6, 8), m = R.int(2, 7), x = m * m - k;
        return QN("Résous " + M("\\sqrt{" + xm(-k) + "} = " + m) + ".", x, "On élève au carré : " + M(xm(-k) + " = " + m * m) + ", donc " + M("x = " + x) + ".",
          { ctx: "sqrt-const", guide: [GS("Après avoir élevé au carré : " + M(xm(-k)) + " = ?", m * m, M(m * m) + "."), GS(M("x") + " = ?", x, M(x) + ".")], traps: [TR(m - k, "Il faut élever au carré pour enlever la racine."), TR(m * m + k, "Attention au signe : " + xm(-k) + " = " + m * m + ".")] }); },
      () => { const r = R.int(2, 6), k = r * r, a = R.rand() < 0.5 ? 1 : 4, kk = k * a;
        return QSet("Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = \\frac{" + kk + "}{x}") + " et " + M("g(x) = " + (a === 1 ? "" : a) + "x") + " se coupent-ils ?", [r, -r], M("\\frac{" + kk + "}{x} = " + (a === 1 ? "" : a) + "x \\iff x^2 = " + k) + " : " + M("x = \\pm " + r) + ".",
          { ctx: "inv-lin", fig: FIG.plot([{ f: (x) => kk / x }, { f: (x) => a * x }], [], { grid: false, ticks: false, fit: [r, -r, 2 * r, -2 * r, r / 2, -r / 2], maxH: 280 }), guide: [GS("Après avoir multiplié par x : " + M("x^2") + " = ?", k, M(k) + "."), GSet("Solutions ?", [r, -r], M(r) + " et " + M(-r) + ".")], traps: [TSet([r], "x² = " + k + " a deux solutions."), TSet([k, -k], "On cherche x tel que x² = " + k + ".")] }); },
    ],
    3: [
      () => { let p, q; do { p = nz(-5, 5); q = nz(-5, 5); } while (p === q || p + q === 0); const k = p * q, m = -(p + q);
        return QSet("Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = \\frac{" + -k + "}{x}") + " et " + M("g(x) = " + lin(1, m)) + " se coupent-ils ?", [p, q], M("\\frac{" + -k + "}{x} = " + lin(1, m) + " \\iff " + tri(1, m, k) + " = 0") + " ; " + M("x = " + p) + " ou " + M("x = " + q) + ".",
          { ctx: "inv-aff", fig: FIG.plot([{ f: (x) => -k / x }, { f: (x) => x + m }], [], { grid: false, ticks: false, fit: [p, q, 2 * p, 2 * q, p / 2, q / 2], maxH: 280 }), guide: [GX("Multiplie par x et ramène à « … = 0 »", "x^2" + (m < 0 ? "-" + -m : "+" + m) + "*x" + (k < 0 ? "-" + -k : "+" + k), M(tri(1, m, k) + " = 0") + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes en factorisant.")] }); },
      () => { const b = R.int(1, 4), t = b + R.int(2, 5), a = (t - b) ** 2 - t, t2 = 2 * b + 1 - t;
        return QSet("Résous " + M("\\sqrt{" + xm(-a) + "} = x - " + b) + ". (Attention aux solutions parasites.)", [t], "Au carré : " + M(xm(-a) + " = (x - " + b + ")^2 \\iff " + tri(1, -(2 * b + 1), b * b - a) + " = 0") + ", d'où " + M(t) + " et " + M(t2) + ". Or " + M(t2 + " - " + b + " < 0") + " : seule " + M("x = " + t) + " convient.",
          { ctx: "sqrt-param", guide: [GSet("Solutions après avoir élevé au carré ?", [t, t2], M(t) + " et " + M(t2) + "."), GSet("Solutions de l'équation de départ ?", [t], M(t2 + " - " + b + " = " + (t2 - b)) + " < 0 : parasite.")], traps: [TSet([t, t2], "Une racine carrée n'est jamais négative : " + t2 + " − " + b + " < 0, donc " + t2 + " est parasite.")] }); },
      () => { const p = pk([1, 2, 3, -2, 4]), q = pk([6, -4, 3, 12, 2]), a = p * q, r = pk([3, 4, -6, 5, 8].filter((x) => x !== p));
        return QN("La courbe de " + M("f(x) = \\frac{a}{x}") + " passe par " + M("P(" + p + " ; " + q + ")") + ". Calcule " + M("f(" + r + ")") + FA + ".", a / r, M("a = " + p + " \\cdot " + par(q) + " = " + a) + ", puis " + M("f(" + r + ") = \\frac{" + a + "}{" + r + "} = " + fT(a / r)) + ".",
          { ctx: "inv-param", guide: [GS(M("a = x \\cdot f(x)") + " = ?", a, M(a) + "."), GS(M("f(" + r + ")") + FA + " ?", a / r, M(fT(a / r)) + ".")], traps: [TR(q / p / r, "a = x · y (on multiplie les coordonnées)."), TR(a * r, "f(" + r + ") = a ÷ " + r + ".")] }); },
    ],
  };

  // ===================== modaff =====================
  const MA = {
    1: [
      () => { const x = pk([["Une piscine propose un abonnement à ", " CHF, puis ", " CHF par entrée. Combien paie-t-on en tout pour ", " entrées (en CHF) ?", "piscine"], ["Un cours de musique coûte une inscription de ", " CHF, puis ", " CHF par leçon. Combien coûtent ", " leçons en tout (en CHF) ?", "musique"], ["Un forfait de téléphone coûte ", " CHF par mois, plus ", " CHF par Go supplémentaire. Combien paie-t-on pour ", " Go supplémentaires (en CHF) ?", "forfait"]]), F = 5 * R.int(4, 16), p = R.int(3, 9), n = R.int(5, 20), v = F + p * n;
        return QN(x[0] + M(F) + x[1] + M(p) + x[2] + M(n) + x[3], v, M("C(n) = " + F + " + " + p + "n") + " : " + M("C(" + n + ") = " + F + " + " + p + " \\cdot " + n + " = " + v) + " CHF.",
          { ctx: x[4], guide: [GS("Part variable (" + M(p + " \\cdot " + n) + ") ?", p * n, M(p * n) + "."), GS("Total ?", v, M(v) + " CHF.")], traps: [TR((F + p) * n, "La part fixe se paie une seule fois."), TR(p * n, "N'oublie pas la part fixe de " + F + " CHF.")] }); },
      () => { const F = 5 * R.int(2, 10), p = R.int(2, 9), n1 = R.int(2, 5), n2 = n1 + R.int(2, 6), x = pk([["Une imprimerie facture ", " cartes", "cartes"], ["Un loueur de vélos facture ", " heures", "velos"]]);
        return QN(x[0] + M(F + p * n1) + " CHF pour " + M(n1) + x[1] + " et " + M(F + p * n2) + " CHF pour " + M(n2) + x[1] + " (part fixe + prix par unité). Quel est le prix par unité (en CHF) ?", p, M("\\frac{" + (F + p * n2) + " - " + (F + p * n1) + "}{" + n2 + " - " + n1 + "} = \\frac{" + p * (n2 - n1) + "}{" + (n2 - n1) + "} = " + p) + " CHF.",
          { ctx: x[2], guide: [GS("Différence de prix ?", p * (n2 - n1), M(p * (n2 - n1)) + " CHF."), GS("Pour combien d'unités en plus ?", n2 - n1, M(n2 - n1) + "."), GS("Prix par unité ?", p, M(p) + " CHF.")], traps: [TR(+((F + p * n2) / n2).toFixed(4), "Le prix total contient une part fixe : compare deux commandes."), TR(F, "Ça, c'est la part fixe.")] }); },
      () => { const F = pk([4, 5, 6, 7]), p = pk([2, 3, 4]), k = R.int(6, 20), B = F + p * k + R.int(0, p - 1);
        return QN("Un taxi coûte " + M(F) + " CHF de prise en charge, puis " + M(p) + " CHF par km. Avec " + M(B) + " CHF, combien de km entiers peut-on parcourir au maximum ?", k, M(F + " + " + p + "x \\le " + B + " \\iff x \\le " + fT((B - F) / p)) + " : au plus " + M(k) + " km.",
          { ctx: "taxi", guide: [GS("Budget après la prise en charge ?", B - F, M(B - F) + " CHF."), GS("Nombre de km entiers ?", k, M(k) + ".")], traps: [TR(Math.floor(B / p), "Retire d'abord la prise en charge."), TR(k + 1, "On ne peut pas dépasser le budget.")] }); },
    ],
    2: [
      () => { const p1 = R.int(8, 14), p2 = p1 - R.int(2, 5), F = R.int(25, 90), n = Math.floor(F / (p1 - p2)) + 1;
        return QN("Sans abonnement, l'entrée coûte " + M(p1) + " CHF. Avec un abonnement à " + M(F) + " CHF, elle coûte " + M(p2) + " CHF. À partir de combien d'entrées l'abonnement est-il strictement plus avantageux ?", n, M(F + " + " + p2 + "n < " + p1 + "n \\iff n > " + fT(F / (p1 - p2))) + " : à partir de " + M(n) + " entrées.",
          { ctx: "abonnement", guide: [GS("Économie par entrée avec l'abonnement ?", p1 - p2, M(p1 - p2) + " CHF."), GS("Plus petit entier " + M("n") + " avec " + M(n + " \\cdot " + (p1 - p2)) + " > " + M(F) + " ?", n, M(n) + ".")], traps: [TR(F / (p1 - p2), "Le nombre d'entrées est un entier, et il faut « strictement » plus avantageux."), TR(Math.ceil(F / p2), "Compare les deux tarifs : n > " + F + " ÷ " + (p1 - p2) + ".")] }); },
      () => { const x = 50 * R.int(1, 8), fa = 10 * R.int(3, 9), fb = fa + x / 5;
        return QN("Location d'une voiture pour un jour. Offre A : " + M(fa) + " CHF plus " + M("0{,}50") + " CHF par km. Offre B : " + M(fb) + " CHF plus " + M("0{,}30") + " CHF par km. Pour quelle distance (en km) les deux offres coûtent-elles le même prix ?", x, M(fa + " + 0{,}5x = " + fb + " + 0{,}3x \\iff 0{,}2x = " + (fb - fa)) + ", donc " + M("x = " + x) + " km.",
          { ctx: "location", guide: [GS("Différence des parts fixes ?", fb - fa, M(fb - fa) + " CHF."), GS("Distance ?", x, M((fb - fa) + " : 0{,}2 = " + x) + " km.")], traps: [TR((fb - fa) / 0.8, "On soustrait : 0,5x − 0,3x = 0,2x."), TR((fb - fa) * 0.2, "On divise par 0,2.")] }); },
      () => { const F = 5 * R.int(2, 12), p = R.int(2, 9), x = pk([["un abonnement de " + M(F) + " CHF puis " + M(p) + " CHF par séance", "seance"], ["une prise en charge de " + M(F) + " CHF puis " + M(p) + " CHF par km", "km"]]);
        return QX("Un tarif comprend " + x[0] + ". Écris le coût " + M("C(x)") + " pour " + M("x") + " " + (x[1] === "km" ? "km" : "séances") + ".", F + "+" + p + "*x", M("C(x) = " + F + " + " + p + "x") + ".",
          { ctx: "expr-" + x[1], guide: [GX("Expression de " + M("C(x)"), F + "+" + p + "*x", M(F + " + " + p + "x") + ".")], traps: [TX(p + "+" + F + "*x", "La part fixe ne dépend pas de x ; c'est le prix unitaire qui multiplie x."), TX("(" + F + "+" + p + ")*x", "La part fixe se paie une seule fois.")] }); },
    ],
    3: [
      () => { const v = R.int(2, 4), h1 = R.int(1, 3), h2 = h1 + R.int(2, 4), L0 = v * R.int(8, 14), L1 = L0 - v * h1, L2 = L0 - v * h2, T = L0 / v;
        return QN("Une bougie brûle régulièrement. Elle mesure " + M(L1) + " cm après " + M(h1) + " h et " + M(L2) + " cm après " + M(h2) + " h. Après combien d'heures (depuis l'allumage) sera-t-elle entièrement consumée ?", T, "Elle perd " + M("\\frac{" + (L1 - L2) + "}{" + (h2 - h1) + "} = " + v) + " cm/h ; au départ " + M(L1 + " + " + v + " \\cdot " + h1 + " = " + L0) + " cm ; " + M(L0 + " : " + v + " = " + T) + " h.",
          { ctx: "bougie", guide: [GS("Vitesse de combustion (cm/h) ?", v, M(v) + "."), GS("Longueur au départ ?", L0, M(L0) + " cm."), GS("Durée totale ?", T, M(T) + " h.")], traps: [TR(L2 / v + h2 - h1, "Compte depuis l'allumage (t = 0)."), TR(L1 / v, "La bougie mesurait plus au départ : remonte à t = 0."), TR(L2 / v, "On demande la durée depuis l'allumage : ajoute les " + h2 + " h déjà passées.")] }); },
      () => { const fix = 100 * R.int(6, 20), c = R.int(2, 6), pv = c + R.int(2, 6), n = Math.floor(fix / (pv - c)) + 1;
        return QN("Un artisan a " + M(fix) + " CHF de frais fixes. Chaque objet lui coûte " + M(c) + " CHF et il le vend " + M(pv) + " CHF. Combien d'objets doit-il vendre au minimum pour faire un bénéfice (strictement positif) ?", n, "Bénéfice " + M("B(n) = " + (pv - c) + "n - " + fix) + " ; " + M("B(n) > 0 \\iff n > " + fT(fix / (pv - c))) + " : " + M(n) + " objets.",
          { ctx: "benefice", guide: [GS("Gain par objet vendu ?", pv - c, M(pv - c) + " CHF."), GS("Nombre minimum d'objets ?", n, M(n) + ".")], traps: [TR(fix / (pv - c), "Il faut un bénéfice strictement positif, et un nombre entier d'objets."), TR(Math.floor(fix / pv) + 1, "Chaque objet ne rapporte que " + (pv - c) + " CHF (prix de vente − coût).")] }); },
      () => { const V = 10 * R.int(4, 7), c = pk([5, 6, 8]), r = R.int(5, 10), d = ((V - r) / c) * 100; if (!Number.isInteger(d)) return null;
        return QN("Le réservoir d'une voiture contient " + M(V) + " L. Elle consomme " + M(c) + " L aux 100 km. Après combien de km reste-t-il " + M(r) + " L ?", d, M("R(x) = " + V + " - " + fT(c / 100) + "x") + " ; " + M("R(x) = " + r + " \\iff x = \\frac{" + (V - r) + "}{" + fT(c / 100) + "} = " + d) + " km.",
          { ctx: "reservoir", guide: [GS("Litres consommés ?", V - r, M(V - r) + " L."), GS("Distance (km) ?", d, M((V - r) + " : " + c + " \\cdot 100 = " + d) + " km.")], traps: [TR((r / c) * 100, "On cherche quand il RESTE " + r + " L : il a consommé " + (V - r) + " L."), TR((V / c) * 100, "Ça, c'est la distance jusqu'à la panne sèche.")] }); },
    ],
  };

  // ===================== transf =====================
  const xmT = (a) => "(" + xm(a) + ")";
  const TF = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5);
        return QP("Le graphe de " + M("g(x) = " + xmT(a) + "^2" + sg(b)) + " est obtenu en déplaçant celui de " + M("f(x) = x^2") + ". Quel est le sommet de la parabole de " + M("g") + " ? Réponds « x ; y ».", [a, b], M(xmT(a) + "^2") + " décale de " + M(a) + " horizontalement, " + M(sg(b).trim()) + " de " + M(b) + " verticalement : " + M("(0 ; 0) \\to (" + a + " ; " + b + ")") + ".",
          { ctx: "sommet", fig: PL([{ f: (x) => x * x, dash: true }]), guide: [GS("Décalage horizontal (négatif = vers la gauche) ?", a, M(xmT(a)) + " : " + M(a) + "."), GP("Sommet ?", [a, b], M("(" + a + " ; " + b + ")") + ".")], traps: [TP([-a, b], M(xm(a)) + " décale de " + a + " : le signe dans la parenthèse est inversé."), TP([b, a], "Abscisse d'abord (horizontal), puis ordonnée.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5);
        return QX("On décale la parabole " + M("y = x^2") + " de " + M(Math.abs(a)) + " vers la " + (a > 0 ? "droite" : "gauche") + " et de " + M(Math.abs(b)) + " vers le " + (b > 0 ? "haut" : "bas") + ". Écris l'expression de la nouvelle fonction " + M("g(x)") + ".", "(x" + (a > 0 ? "-" + a : "+" + -a) + ")^2" + (b > 0 ? "+" + b : "-" + -b), M("g(x) = " + xmT(a) + "^2" + sg(b)) + ".",
          { ctx: "ecrire-g", guide: [GX("Expression de " + M("g(x)"), "(x" + (a > 0 ? "-" + a : "+" + -a) + ")^2" + (b > 0 ? "+" + b : "-" + -b), M(xmT(a) + "^2" + sg(b)) + ".")], traps: [TX("(x" + (a > 0 ? "+" + a : "-" + -a) + ")^2" + (b > 0 ? "+" + b : "-" + -b), "Vers la droite de " + Math.abs(a) + " : on remplace x par x − " + Math.abs(a) + " (signe inversé)."), TX("x^2" + (a > 0 ? "-" + a : "+" + -a) + (b > 0 ? "+" + b : "-" + -b), "Le décalage horizontal se fait dans la parenthèse : (x − a)².")] }); },
      () => { const a = nz(-5, 5), b = nz(-4, 4), f = pk([["|x|", "abs"], ["x^2", "carre"]]);
        return QN("Le graphe de " + M("g(x) = " + (f[1] === "abs" ? "|" + xm(a) + "|" : xmT(a) + "^2") + sg(b)) + " est celui de " + M("f(x) = " + f[0]) + " déplacé. De combien d'unités est-il décalé horizontalement (vers la droite : positif, vers la gauche : négatif) ?", a, M(xm(a)) + " : décalage de " + M(a) + ".",
          { ctx: "decalage-h-" + f[1], guide: [GS("Décalage horizontal ?", a, "On remplace x par " + M(xm(a)) + " : " + M(a) + ".")], traps: [TR(-a, M(xm(a)) + " décale de " + a + " (le signe est inversé dans la parenthèse)."), TR(b, "Ça, c'est le décalage vertical.")] }); },
    ],
    2: [
      () => { const p = R.int(-4, 4), q = R.int(-4, 4), a = nz(-4, 4), b = nz(-4, 4);
        return QP("Le point " + M("P(" + p + " ; " + q + ")") + " est sur le graphe de " + M("f") + ". On pose " + M("g(x) = f" + xmT(a) + sg(b)) + ". Quel point du graphe de " + M("g") + " correspond à " + M("P") + " ? Réponds « x ; y ».", [p + a, q + b], "Translation de " + M(a) + " horizontalement et " + M(b) + " verticalement : " + M("(" + (p + a) + " ; " + (q + b) + ")") + ".",
          { ctx: "point", guide: [GS("Nouvelle abscisse (" + M(p + sg(a)) + ") ?", p + a, M(p + a) + "."), GP("Point ?", [p + a, q + b], M("(" + (p + a) + " ; " + (q + b) + ")") + ".")], traps: [TP([p - a, q + b], "f(x − a) décale de +a horizontalement."), TP([p + b, q + a], "Le décalage horizontal est dans la parenthèse, le vertical à l'extérieur.")] }); },
      () => { const h = nz(-3, 3), k = nz(-4, 4), a = nz(-3, 3), b = nz(-3, 3);
        return QP("Soit " + M("f(x) = " + xmT(h) + "^2" + sg(k)) + " et " + M("g(x) = f" + xmT(a) + sg(b)) + ". Quel est le sommet de la parabole de " + M("g") + " ? Réponds « x ; y ».", [h + a, k + b], "Sommet de " + M("f") + " : " + M("(" + h + " ; " + k + ")") + " ; translation " + M("(" + a + " ; " + b + ")") + " : " + M("(" + (h + a) + " ; " + (k + b) + ")") + ".",
          { ctx: "sommet-compose", guide: [GP("Sommet de " + M("f") + " ?", [h, k], M("(" + h + " ; " + k + ")") + "."), GP("Sommet de " + M("g") + " ?", [h + a, k + b], M("(" + (h + a) + " ; " + (k + b) + ")") + ".")], traps: [TP([h - a, k + b], "f(x − a) décale de +a vers la droite."), TP([a, b], "Pars du sommet de f, pas de (0 ; 0).")] }); },
      () => { const h = nz(-4, 4), k = nz(-4, 4), a = nz(-3, 3), b = nz(-3, 3), min = R.rand() < 0.5, X = h + a, Y = k + b; if (X === 0 || Y === 0 || X === h || Y === k) return null;
        return QN("Soit " + M("f(x) = |" + xm(h) + "|" + sg(k)) + " et " + M("g(x) = f" + xmT(a) + sg(b)) + ". " + (min ? "Quelle est la valeur minimale de " + M("g") + " ?" : "Pour quelle valeur de " + M("x") + " le minimum de " + M("g") + " est-il atteint ?"), min ? Y : X, "La pointe du « V » de " + M("f") + " est en " + M("(" + h + " ; " + k + ")") + " ; la translation " + M("(" + a + " ; " + b + ")") + " l'amène en " + M("(" + X + " ; " + Y + ")") + ". " + (min ? "Minimum de " + M("g") + " : " + M(Y) : "Minimum atteint en " + M("x = " + X)) + ".",
          { ctx: min ? "abs-min" : "abs-xmin", fig: PL([{ f: (x) => Math.abs(x - h) + k, dash: true }]), guide: [GP("Pointe du V de " + M("f") + " ? (« x ; y »)", [h, k], M("(" + h + " ; " + k + ")") + "."), GP("Pointe du V de " + M("g") + " ?", [X, Y], M("(" + h + sg(a) + " \\,;\\, " + k + sg(b) + ") = (" + X + " ; " + Y + ")") + "."), GS("Réponse ?", min ? Y : X, M(min ? Y : X) + ".")],
            traps: [TR(min ? X : Y, min ? "La valeur minimale est une ordonnée." : "On demande l'abscisse x."), TR(min ? k - b : h - a, min ? "+ " + b + " à l'extérieur : on monte (ou descend) de " + b + "." : "f(x − a) décale de +a vers la droite."), TR(min ? k : h, "C'est le sommet de f ; il faut encore appliquer la translation.")] }); },
    ],
    3: [
      () => { const p = R.int(-3, 3), q = nz(-4, 4), a = nz(-3, 3), b = nz(-4, 4), k = pk([-1, 2, -2, 3]);
        return QP("Le point " + M("P(" + p + " ; " + q + ")") + " est sur le graphe de " + M("f") + ". On pose " + M("g(x) = " + (k === -1 ? "-" : k) + "f" + xmT(a) + sg(b)) + ". Quel point du graphe de " + M("g") + " correspond à " + M("P") + " ? Réponds « x ; y ».", [p + a, k * q + b], "Abscisse : " + M(p + sg(a) + " = " + (p + a)) + ". Ordonnée : " + M(k + " \\cdot " + par(q) + sg(b) + " = " + (k * q + b)) + ".",
          { ctx: "point-k", guide: [GS("Nouvelle abscisse ?", p + a, M(p + a) + "."), GS("Nouvelle ordonnée (" + M(k + " \\cdot " + par(q) + sg(b)) + ") ?", k * q + b, M(k * q + b) + "."), GP("Point ?", [p + a, k * q + b], M("(" + (p + a) + " ; " + (k * q + b) + ")") + ".")], traps: [TP([p + a, k * (q + b)], "On multiplie d'abord par " + k + ", puis on ajoute " + b + "."), TP([p - a, k * q + b], "f(x − a) décale de +a.")] }); },
      () => { const x0 = R.int(-2, 4), a = nz(-3, 3), y0 = nz(-6, 6), k = pk([2, 3, -1, -2]), b = nz(-5, 5), X = x0 + a, v = k * y0 + b;
        return QN("On sait que " + M("f(" + x0 + ") = " + y0) + ". Soit " + M("g(x) = " + (k === -1 ? "-" : k) + "f" + xmT(a) + sg(b)) + ". Calcule " + M("g(" + X + ")") + ".", v, M("g(" + X + ") = " + (k === -1 ? "-" : k) + "f(" + X + sg(-a) + ")" + sg(b) + " = " + (k === -1 ? "-" : k) + "f(" + x0 + ")" + sg(b) + " = " + k + " \\cdot " + par(y0) + sg(b) + " = " + v) + ".",
          { ctx: "calcul-g", guide: [GS("Dans la parenthèse : " + M(X + sg(-a)) + " = ?", x0, M(x0) + "."), GS(M("g(" + X + ")") + " = ?", v, M(v) + ".")], traps: [TR(k * (y0 + b), "On multiplie f(" + x0 + ") par " + k + ", puis on ajoute " + b + "."), TR(y0 + b, "N'oublie pas le facteur " + k + ".")] }); },
      () => { const h = nz(-4, 4), k = nz(-5, 5), b = -2 * h, c = h * h + k;
        return QP("Quelle translation (« horizontal ; vertical ») envoie la parabole " + M("y = x^2") + " sur " + M("y = " + tri(1, b, c)) + " ?", [h, k], "Forme canonique : " + M(tri(1, b, c) + " = " + xmT(h) + "^2" + sg(k)) + " : translation " + M("(" + h + " ; " + k + ")") + ".",
          { ctx: "canonique", guide: [GS("Abscisse du sommet " + M("-\\frac{b}{2}") + " ?", h, M(h) + "."), GS("Ordonnée du sommet " + M("f(" + h + ")") + " ?", k, M(k) + "."), GP("Translation ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "x_S = −b ÷ 2 = " + h + "."), TP([h, c], c + " est l'ordonnée à l'origine, pas celle du sommet.")] }); },
    ],
  };

  // ===================== absval : valeur absolue (20.11, dernier lot de 1re Collège) =====================
  const opA = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
  const AB = (r) => "|" + xm(r) + "|";
  const setT = (vs) => vs.length ? M("S = \\{" + vs.map(fT).join(" \\,;\\, ") + "\\}") : M("S = \\varnothing");
  const AV = {
    1: [
      () => { const a = -R.int(2, 9), p = R.int(1, 6), q = p + R.int(2, 9), v = -a - (q - p); if (v === 0) return null;
        return QN("Calcule " + M("|" + a + "| - |" + p + " - " + q + "|") + ".", v, M("|" + a + "| = " + -a) + " et " + M("|" + p + " - " + q + "| = |" + (p - q) + "| = " + (q - p)) + ", donc " + M(-a + " - " + (q - p) + " = " + v) + ".",
          { ctx: "calcul", guide: [GS(M("|" + a + "|") + " = ?", -a, M(-a) + " : la distance de " + M(a) + " à 0."), GS(M(p + " - " + q) + " = ?", p - q, M(p - q) + "."), GS(M("|" + (p - q) + "|") + " = ?", q - p, M(q - p) + "."), GS("Résultat ?", v, M(-a + " - " + (q - p) + " = " + v) + ".")],
            traps: [TR(a - (p - q), "Une valeur absolue n'est jamais négative : " + M("|" + a + "| = " + -a) + "."), TR(-a + (p - q), M("|" + (p - q) + "| = " + (q - p)) + ", pas " + M(p - q) + "."), TR(Math.abs(a - p + q), "On calcule chaque valeur absolue séparément, puis on soustrait.")] }); },
      () => { const a = -R.int(2, 12), b = R.int(1, 12), d = b - a, c = pk([
          ["temperature", "Le matin, le thermomètre indique " + M(a + "\\,°\\text{C}") + " ; l'après-midi, " + M(b + "\\,°\\text{C}") + ". De combien de degrés la température a-t-elle monté ?"],
          ["droite", "Sur une droite graduée, quelle est la distance entre les points d'abscisses " + M(a) + " et " + M(b) + " ?"],
          ["altitude", "Une plongeuse est à " + M(-a + " \\text{ m}") + " sous le niveau de la mer (altitude " + M(a + " \\text{ m}") + "), une mouette vole à " + M(b + " \\text{ m}") + " au-dessus. Quelle distance verticale les sépare (en m) ?"]]);
        return QN(c[1], d, (c[0] === "temperature" ? "Écart " : "Distance ") + M("= |" + b + " - " + par(a) + "| = |" + b + " + " + -a + "| = " + d) + ".",
          { ctx: c[0], guide: [GS(M(b + " - " + par(a)) + " = ?", d, M(b + " + " + -a + " = " + d) + " : soustraire un négatif, c'est ajouter."), GS("Et dans l'autre sens, " + M(a + " - " + b) + " = ?", a - b, M(a - b) + " : même distance, au signe près ; la distance est la valeur absolue."), GS("Distance ?", d, M(d) + ".")],
            traps: [TR(b + a, M(b + " - " + par(a)) + " = " + M(b + " + " + -a) + " : soustraire un négatif, c'est ajouter."), TR(a - b, "Une distance est positive : on prend la valeur absolue.")] }); },
      () => { const a = nz(-6, 6), b = R.int(1, 8);
        return QSet("Résous " + M(AB(a) + " = " + b) + ". Sépare les solutions par « ; ».", [a - b, a + b], M(xm(a) + " = " + b) + " donne " + M("x = " + (a + b)) + " ; " + M(xm(a) + " = -" + b) + " donne " + M("x = " + (a - b)) + ". " + setT([a - b, a + b]) + " : les deux nombres à distance " + M(b) + " de " + M(a) + ".",
          { ctx: "eq-simple", guide: [GS("Premier cas, " + M(xm(a) + " = " + b) + " : " + M("x") + " = ?", a + b, M(a + b) + "."), GS("Deuxième cas, " + M(xm(a) + " = -" + b) + " : " + M("x") + " = ?", a - b, M(a - b) + "."), GSet("Les solutions ?", [a - b, a + b], setT([a - b, a + b]) + ".")],
            traps: [TSet([a + b], "Il y a deux nombres à distance " + b + " de " + a + " : n'oublie pas le cas « = −" + b + " »."), TSet([b - a, -b - a], M(AB(a) + " = " + b) + " : " + M(xm(a) + " = \\pm " + b) + ", donc " + M("x = " + a + " \\pm " + b) + " (attention au signe).")] }); },
      () => { const a = nz(-5, 5), c = nz(-4, 4), k = a + pk([-1, 1]) * R.int(2, 6), v = Math.abs(k - a) + c;
        return QN("Soit " + M("f(x) = " + AB(a) + sg(c)) + ". Calcule " + M("f(" + k + ")") + ".", v, M("f(" + k + ") = |" + k + sg(-a) + "|" + sg(c) + " = |" + (k - a) + "|" + sg(c) + " = " + Math.abs(k - a) + sg(c) + " = " + v) + ".",
          { ctx: "image", guide: [GS(M(k + sg(-a)) + " = ?", k - a, M(k - a) + "."), GS(M("|" + (k - a) + "|") + " = ?", Math.abs(k - a), M(Math.abs(k - a)) + "."), GS(M("f(" + k + ")") + " = ?", v, M(Math.abs(k - a) + sg(c) + " = " + v) + ".")],
            traps: [TR(k - a + c, "La valeur absolue rend positif : " + M("|" + (k - a) + "| = " + Math.abs(k - a)) + "."), TR(Math.abs(k + a) + c, "On remplace x par " + k + " dans " + M(xm(a)) + " : attention au signe.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4, -2]), c = nz(-7, 7), b = R.int(1, 9), s1 = (b - c) / k, s2 = (-b - c) / k; if (den(s1) > 4 || den(s2) > 4) return null;
        const e = (k === -2 ? "-2" : k) + "x" + sg(c);
        return QSet("Résous " + M("|" + e + "| = " + b) + ". Sépare les solutions par « ; »" + FA + ".", [s1, s2], M(e + " = " + b) + " donne " + M("x = " + fT(s1)) + " ; " + M(e + " = -" + b) + " donne " + M("x = " + fT(s2)) + ".",
          { ctx: "eq-lin", guide: [GS("Cas " + M(e + " = " + b) + " : " + M("x") + " = ?", s1, M(k + "x = " + (b - c)) + ", " + M("x = " + fT(s1)) + "."), GS("Cas " + M(e + " = -" + b) + " : " + M("x") + " = ?", s2, M(k + "x = " + (-b - c)) + ", " + M("x = " + fT(s2)) + "."), GSet("Les solutions ?", [s1, s2], setT([s1, s2]) + ".")],
            traps: [TSet([s1], "Deux cas : " + M(e + " = " + b) + " ou " + M(e + " = -" + b) + "."), TSet([(b + c) / k, (-b + c) / k], "On retire " + M(c) + " (on ne l'ajoute pas) avant de diviser par " + M(k) + ".")] }); },
      () => { const m = pk([2, 3, 4]), a = nz(-6, 6), r = R.int(1, 6), c = nz(-8, 8), d = m * r + c;
        return QSet("Résous " + M(m + AB(a) + sg(c) + " = " + d) + ". Sépare les solutions par « ; ».", [a - r, a + r], "On isole la valeur absolue : " + M(m + AB(a) + " = " + (d - c)) + ", " + M(AB(a) + " = " + r) + ". Puis " + M("x = " + a + " \\pm " + r) + " : " + setT([a - r, a + r]) + ".",
          { ctx: "isoler", guide: [GS("On isole d'abord la valeur absolue : " + M(AB(a)) + " = ?", r, M(m + AB(a) + " = " + (d - c)) + ", on divise par " + M(m) + " : " + M(r) + "."), GS("Plus petite solution ?", a - r, M(a + " - " + r + " = " + (a - r)) + "."), GSet("Les solutions ?", [a - r, a + r], setT([a - r, a + r]) + ".")],
            traps: [TSet([a - (d - c), a + (d - c)], "Divise par " + m + " avant de séparer les deux cas."), TSet([a + r], "Deux nombres sont à distance " + r + " de " + a + ".")] }); },
      () => { const a = nz(-6, 6), c = R.int(3, 9), d = c - R.int(1, c + 3), r = d - c;
        return QSet("Résous " + M(AB(a) + " + " + c + " = " + d) + ". (Écris « aucune » s'il n'y a pas de solution.)", [], "On isole : " + M(AB(a) + " = " + r) + ". Une valeur absolue est toujours positive ou nulle : aucune solution, " + M("S = \\varnothing") + ".",
          { ctx: "impossible", guide: [GS("On isole : " + M(AB(a)) + " = ?", r, M(d + " - " + c + " = " + r) + "."), GSet("Une valeur absolue peut-elle valoir " + M(r) + " ? Solutions (« aucune » s'il n'y en a pas) ?", [], "Non : une distance n'est jamais négative. Aucune solution.")],
            traps: [TSet([a + r, a - r], "Une valeur absolue ne peut pas être négative : " + M(AB(a) + " = " + r) + " est impossible.")] }); },
      () => { const a = nz(-5, 5), c = nz(-4, 4), r = R.int(1, 6), y = c + r;
        return QSet("Soit " + M("f(x) = " + AB(a) + sg(c)) + ". Détermine les préimages de " + M(y) + ". Sépare-les par « ; ».", [a - r, a + r], M(AB(a) + sg(c) + " = " + y) + " donne " + M(AB(a) + " = " + r) + ", donc " + M("x = " + a + " \\pm " + r) + " : " + setT([a - r, a + r]) + ".",
          { ctx: "preimage", guide: [GS("On résout " + M("f(x) = " + y) + ". " + M(AB(a)) + " = ?", r, M(y + sg(-c) + " = " + r) + "."), GSet("Préimages ?", [a - r, a + r], setT([a - r, a + r]) + ".")],
            traps: [TSet([a - y, a + y], "On retire d'abord " + M(c) + " : " + M(AB(a) + " = " + r) + "."), TSet([a + r], "Il y a deux préimages.")] }); },
    ],
    3: [
      () => { let e; const a = nz(-6, 6); do e = nz(-6, 6); while (e === a || (a + e) % 2 !== 0); const mid = (a + e) / 2;
        return QSet("Résous " + M(AB(a) + " = " + AB(e)) + ".", [mid], "La distance de " + M("x") + " à " + M(a) + " égale sa distance à " + M(e) + " : " + M("x") + " est le milieu, " + M("x = \\frac{" + a + " + " + par(e) + "}{2} = " + mid) + ". (Par le calcul : " + M(xm(a) + " = " + xm(e)) + " est impossible, " + M(xm(a) + " = -(" + xm(e) + ")") + " donne " + M("x = " + mid) + ".)",
          { ctx: "milieu", guide: [GS("Le nombre cherché est à égale distance de " + M(a) + " et de " + M(e) + " : c'est leur milieu. Milieu = ?", mid, M("\\frac{" + a + " + " + par(e) + "}{2} = " + mid) + "."), GSet("Solutions ?", [mid], setT([mid]) + ".")],
            traps: [TSet([a, e], "Les solutions sont les x à égale distance de " + a + " et de " + e + " : un seul nombre, le milieu."), TSet([-mid], "Milieu : demi-somme " + M("\\frac{" + a + " + " + par(e) + "}{2}") + ".")] }); },
      () => { const a = nz(-6, 6), k = pk([2, 3, -2, -3]), c = R.int(-6, 6), x1 = (c + a) / (1 - k), x2 = (a - c) / (1 + k);
        if (!Number.isInteger(x1) || !Number.isInteger(x2) || x1 === x2) return null; const v1 = k * x1 + c >= 0, v2 = k * x2 + c >= 0; if (v1 === v2) return null; const s = v1 ? x1 : x2, bad = v1 ? x2 : x1, rhs = lin(k, c);
        return QSet("Résous " + M(AB(a) + " = " + rhs) + ".", [s], "Cas 1 : " + M(xm(a) + " = " + rhs) + " donne " + M("x = " + x1) + ". Cas 2 : " + M("-(" + xm(a) + ") = " + rhs) + " donne " + M("x = " + x2) + ". Le membre de droite est une distance, il doit être positif : en " + M("x = " + bad) + ", " + M(rhs) + " vaut " + M(k * bad + c) + " (rejeté). " + setT([s]) + ".",
          { ctx: "verif", guide: [GS("Cas 1, " + M(xm(a) + " = " + rhs) + " : " + M("x") + " = ?", x1, M("x = " + x1) + "."), GS("Cas 2, " + M("-(" + xm(a) + ") = " + rhs) + " : " + M("x") + " = ?", x2, M("x = " + x2) + "."), GSet("Le membre de droite doit être positif ou nul (c'est une distance). Solutions retenues ?", [s], "En " + M("x = " + bad) + ", " + M(rhs + " = " + (k * bad + c)) + " < 0 : rejeté. " + setT([s]) + ".")],
            traps: [TSet([x1, x2], "Vérifie chaque valeur : " + M(rhs) + " doit être positif ou nul. L'une des deux est à rejeter.")] }); },
      () => { const a = nz(-5, 5), b = R.int(1, 6), op = pk(["<", "<=", ">", ">="]), inside = op[0] === "<", inc = op.length === 2;
        const ivs = inside ? [[a - b, inc, a + b, inc]] : [[-Infinity, false, a - b, inc], [a + b, inc, Infinity, false]], wrong = inside ? [[-Infinity, false, a - b, !inc], [a + b, !inc, Infinity, false]] : [[a - b, !inc, a + b, !inc]];
        return QS("Résous " + M(AB(a) + " " + opA[op] + " " + b) + ". Donne l'ensemble des solutions (intervalle ou réunion d'intervalles).", ivs, M(AB(a)) + " est la distance de " + M("x") + " à " + M(a) + ". Elle est " + (inside ? "inférieure" : "supérieure") + " à " + M(b) + (inside ? " entre " : " à l'extérieur de ") + M(a - b) + " et " + M(a + b) + " : " + M("S = " + SolSet.show(ivs)) + ".",
          { ctx: "inequation", guide: [GS("Nombres à distance exactement " + M(b) + " de " + M(a) + " : le plus petit ?", a - b, M(a + " - " + b + " = " + (a - b)) + "."), GS("Le plus grand ?", a + b, M(a + b) + "."), GSS("Les x " + (inside ? "plus proches" : "plus éloignés") + " de " + M(a) + " (distance " + M(opA[op] + " " + b) + ") : ensemble ?", ivs, M("S = " + SolSet.show(ivs)) + ".")],
            traps: [TS(wrong, inside ? "Distance plus petite que " + b + " : entre les deux bornes." : "Distance plus grande que " + b + " : à l'extérieur des deux bornes."), TS(inside ? [[a - b, !inc, a + b, !inc]] : [[-Infinity, false, a - b, !inc], [a + b, !inc, Infinity, false]], "Crochets : « ≤ » et « ≥ » gardent les bornes, « < » et « > » les excluent.")] }); },
    ],
  };

  // ===================== morceaux : fonctions définies par morceaux (20.11) =====================
  const PCW = (p1, c, p2) => M("f(x) = \\begin{cases} " + p1 + " & \\text{si } x < " + c + " \\\\ " + p2 + " & \\text{si } x \\ge " + c + " \\end{cases}");
  // Prix en CHF : décimales (« 1,50 »), jamais en fraction. T : [ctx, énoncé, unité, question, « d'heures » / « de km », « premières » / « premiers »]
  const chf = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", "{,}"));
  const TARIFS = [
    ["parking", (F, s, p) => "Un parking coûte " + M(chf(F)) + " CHF pour les " + s + " premières heures (ou moins), puis " + M(chf(p)) + " CHF par heure supplémentaire.", "heures", "Combien paie-t-on pour", "d'heures", "premières"],
    ["taxi", (F, s, p) => "Un taxi facture " + M(chf(F)) + " CHF pour les " + s + " premiers kilomètres (ou moins), puis " + M(chf(p)) + " CHF par kilomètre supplémentaire.", "km", "Prix d'une course de", "de km", "premiers"],
    ["forfait", (F, s, p) => "Un abonnement mobile coûte " + M(chf(F)) + " CHF par mois avec " + s + " Go inclus, puis " + M(chf(p)) + " CHF par Go supplémentaire.", "Go", "Facture d'un mois avec", "de Go", "premiers"],
    ["velo", (F, s, p) => "La location d'un vélo coûte " + M(chf(F)) + " CHF pour les " + s + " premières heures (ou moins), puis " + M(chf(p)) + " CHF par heure en plus.", "heures", "Prix pour", "d'heures", "premières"],
  ];
  const tarif = () => { const T = pk(TARIFS), F = R.int(3, 25), s = R.int(2, 5), p = pk([1.5, 2, 2.5, 3, 4]); return { T, F, s, p }; };
  const MO = {
    1: [
      () => { const a = nz(-3, 3), b = nz(-4, 4), c = R.int(-1, 2), e = nz(-4, 3), k = pk([c - R.int(1, 3), c, c + R.int(1, 2)]), first = k < c, v = first ? a * k + b : k * k + e, other = first ? k * k + e : a * k + b;
        if (other === v) return null;
        return QN("On donne " + PCW(lin(a, b), c, tri(1, 0, e)) + ". Calcule " + M("f(" + k + ")") + ".", v, M(k) + (first ? " est plus petit que " + M(c) + " : premier morceau, " + M("f(" + k + ") = " + a + " \\cdot " + par(k) + sg(b) + " = " + v) : " n'est pas plus petit que " + M(c) + " : second morceau, " + M("f(" + k + ") = " + par(k) + "^2" + sg(e) + " = " + v)) + ".",
          { ctx: "image", fig: PL([{ f: (x) => a * x + b, to: c - 0.001 }, { f: (x) => x * x + e, from: c }], { yr: [-6, 8] }), guide: [GS("On compare " + M(k) + " à la frontière " + M(c) + ". Numéro du morceau à utiliser (1 ou 2) ?", first ? 1 : 2, first ? M(k + " < " + c) + " : morceau 1." : M(k + " \\ge " + c) + " : morceau 2" + (k === c ? " (à la frontière, « ≥ » : c'est le second)." : ".")), GS(M("f(" + k + ")") + " = ?", v, M(v) + ".")],
            traps: [TR(other, k === c ? "À la frontière x = " + c + ", c'est « x ≥ " + c + " » qui s'applique : le second morceau." : "Mauvais morceau : compare d'abord " + k + " à " + c + ".")] }); },
      () => { const c = R.int(-1, 2), a = pk([1, -1, 2]), b = R.int(-2, 3), d = pk([-1, 1, -2, 0.5]), g = a * c + b + pk([0, 2, -2]) - d * c, f = (x) => (x < c ? a * x + b : d * x + g);
        const xs = [-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((x) => Number.isInteger(f(x)) && Math.abs(f(x)) <= 5 && x !== c); if (!xs.length) return null; const k = pk(xs), v = f(k), wrongPiece = k < c ? d * k + g : a * k + b;
        return QN("La fonction " + M("f") + " est définie par morceaux (graphique). Lis " + M("f(" + k + ")") + ".", v, "En " + M("x = " + k) + ", on est sur la partie " + (k < c ? "gauche" : "droite") + " de la courbe : on lit " + M("f(" + k + ") = " + v) + ".",
          { ctx: "lecture", fig: PL([{ f: (x) => a * x + b, to: c - 0.001 }, { f: (x) => d * x + g, from: c }]), guide: [GS("En " + M("x = " + k) + ", la courbe est-elle sur la partie gauche (1) ou droite (2) ?", k < c ? 1 : 2, k < c ? "Gauche : " + M(k + " < " + c) + "." : "Droite : " + M(k + " \\ge " + c) + "."), GS("Ordonnée lue ?", v, M(v) + ".")],
            traps: [TR(wrongPiece, "Ce morceau-là ne vaut que de l'autre côté de x = " + c + "."), TR(k, "f(" + k + ") est une ordonnée (hauteur), pas une abscisse.")] }); },
      () => { const { T, F, s, p } = tarif(), t = R.rand() < 0.25 ? R.int(1, s) : s + R.int(1, 6), extra = Math.max(0, t - s), v = F + p * extra;
        return QN(T[1](F, s, p, t) + " " + T[3] + " " + t + " " + T[2] + " ? (en CHF)", v, extra ? M(t + " - " + s + " = " + extra) + " " + T[2] + " en plus : " + M(chf(F) + " + " + extra + " \\cdot " + chf(p) + " = " + chf(v)) + " CHF." : M(t + " \\le " + s) + " : seulement le prix de base, " + M(chf(F)) + " CHF.",
          { ctx: "tarif-" + T[0], guide: [GS("Combien " + T[4] + " au-delà des " + s + " " + T[5] + " ?", extra, extra ? M(t + " - " + s + " = " + extra) + "." : "Aucune : " + M(t + " \\le " + s) + "."), GS("Supplément (CHF) ?", p * extra, M(extra + " \\cdot " + chf(p) + " = " + chf(p * extra)) + "."), GS("Total (CHF) ?", v, M(chf(v)) + ".")],
            traps: [TR(F + p * t, "Le supplément ne compte qu'au-delà des " + s + " " + T[5] + "."), TR(p * extra, "N'oublie pas le prix de base, " + chf(F).replace("{,}", ",") + " CHF."), TR(p * t, "Fonction par morceaux : prix de base jusqu'à " + s + ", puis supplément.")] }); },
    ],
    2: [
      () => { const c = R.int(0, 2), a = nz(-3, 3), b = R.int(-4, 4), x1 = R.int(c - 4, c + 2), y = a * x1 + b, r = R.int(1, 4), e = y - r * r;
        const sols = [...new Set([...(x1 < c ? [x1] : []), ...[r, -r].filter((x) => x >= c)])], all = [...new Set([x1, r, -r])];
        if (all.length === sols.length) return null;
        return QSet("On donne " + PCW(lin(a, b), c, tri(1, 0, e)) + ". Résous " + M("f(x) = " + y) + ". (Sépare les solutions par « ; » ; « aucune » s'il n'y en a pas.)", sols,
          "Morceau 1 : " + M(lin(a, b) + " = " + y + " \\Rightarrow x = " + x1) + (x1 < c ? " (gardé, " + M(x1 + " < " + c) + ")" : " (rejeté, " + M(x1 + " \\ge " + c) + ")") + ". Morceau 2 : " + M("x^2 = " + r * r + " \\Rightarrow x = \\pm " + r) + ", on garde ceux qui sont " + M("\\ge " + c) + ". " + setT(sols) + ".",
          { ctx: "equation", guide: [GS("Morceau 1 : " + M(lin(a, b) + " = " + y) + ", " + M("x") + " = ?", x1, M("x = " + x1) + (x1 < c ? " : il est bien " + M("< " + c) + ", on le garde." : " : il n'est pas " + M("< " + c) + ", on le rejette.")), GS("Morceau 2 : " + M(tri(1, 0, e) + " = " + y) + ". " + M("x^2") + " = ?", r * r, M("x = " + r) + " ou " + M("x = -" + r) + " ; on garde ceux qui sont " + M("\\ge " + c) + "."), GSet("Solutions retenues ?", sols, setT(sols) + ".")],
            traps: [TSet(all, "Chaque solution doit être dans l'intervalle de son morceau : vérifie avec la frontière " + c + ".")] }); },
      () => { const a = nz(-6, 6), left = R.rand() < 0.5;
        const e = left ? "-x" + sg(a) : xm(a), ex = left ? a + "-x" : "x" + (a < 0 ? "+" + -a : "-" + a), t = left ? a - R.int(1, 4) : a + R.int(1, 4);
        return QX("Pour " + M(left ? "x < " + a : "x \\ge " + a) + ", écris " + M(AB(a)) + " sans valeur absolue.", ex, (left ? "Si " + M("x < " + a) + ", " + M(xm(a)) + " est négatif : " + M(AB(a) + " = -(" + xm(a) + ") = " + e) : "Si " + M("x \\ge " + a) + ", " + M(xm(a)) + " est positif ou nul : " + M(AB(a) + " = " + e)) + ". Donc " + M(AB(a)) + " est une fonction par morceaux.",
          { ctx: "absmorceaux", guide: [GS("Exemple : pour " + M("x = " + t) + ", " + M(t + sg(-a)) + " = ?", t - a, M(t - a) + (left ? " : négatif, la valeur absolue change son signe." : " : positif, la valeur absolue ne change rien.")), GX("Pour " + M(left ? "x < " + a : "x \\ge " + a) + ", " + M(AB(a)) + " = ?", ex, M(e) + ".")],
            traps: left ? [TX("x" + (a < 0 ? "+" + -a : "-" + a), "Pour x < " + a + ", " + xm(a) + " est négatif : on prend son opposé."), TX("-x" + (a < 0 ? "+" + -a : "-" + a), "L'opposé de " + xm(a) + " est " + (a < 0 ? "−x − " + -a : "−x + " + a) + " : on change le signe des deux termes.")] : [TX(a + "-x", "Pour x ≥ " + a + ", " + xm(a) + " est déjà positif ou nul : on le garde tel quel.")] }); },
      () => { const { T, F, s, p } = tarif(), extra = R.int(2, 8), tot = F + p * extra, t = s + extra;
        return QN(T[1](F, s, p) + " On a payé " + M(chf(tot)) + " CHF. Combien " + T[4] + " ?", t, M(chf(tot) + " - " + chf(F) + " = " + chf(p * extra)) + " CHF de supplément, soit " + M(chf(p * extra) + " \\div " + chf(p) + " = " + extra) + " " + T[2] + " en plus des " + s + " " + T[5] + " : " + M(t) + " " + T[2] + ".",
          { ctx: "tarifinv-" + T[0], guide: [GS("Supplément payé (CHF) ?", p * extra, M(chf(tot) + " - " + chf(F) + " = " + chf(p * extra)) + "."), GS("Nombre " + T[4] + " en plus ?", extra, M(chf(p * extra) + " \\div " + chf(p) + " = " + extra) + "."), GS("Nombre total " + T[4] + " ?", t, M(s + " + " + extra + " = " + t) + ".")],
            traps: [TR(extra, "Ce sont les " + T[2] + " au-delà des " + s + " " + T[5] + " : ajoute-les."), TR(tot / p, "Le prix de base couvre les " + s + " " + T[5] + " : retire-le d'abord.")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), c = R.int(-2, 3), e = R.int(-4, 4), m = c * c + e - a * c;
        return QN("On donne " + M("f(x) = \\begin{cases} " + (a === 1 ? "" : a === -1 ? "-" : a) + "x + m & \\text{si } x < " + c + " \\\\ " + tri(1, 0, e) + " & \\text{si } x \\ge " + c + " \\end{cases}") + ". Quelle valeur de " + M("m") + " rend le graphe de " + M("f") + " continu (sans saut) ?", m,
          "Les deux morceaux doivent donner la même valeur en " + M("x = " + c) + " : " + M(a + " \\cdot " + par(c) + " + m = " + par(c) + "^2" + sg(e)) + ", donc " + M("m = " + m) + ".",
          { ctx: "continuite", guide: [GS("Valeur du second morceau en " + M("x = " + c) + " ?", c * c + e, M(par(c) + "^2" + sg(e) + " = " + (c * c + e)) + "."), GS("Le premier morceau doit arriver à la même hauteur : " + M(a + " \\cdot " + par(c) + " + m = " + (c * c + e)) + ". " + M("m") + " = ?", m, M("m = " + (c * c + e) + sg(-a * c) + " = " + m) + ".")],
            traps: [TR(c * c + e, "C'est la hauteur au raccord ; il faut encore en déduire m."), TR(c * c + e + a * c, "On retire " + a + " · " + par(c) + " = " + a * c + " (attention au signe).")] }); },
      () => { const c = R.int(-1, 2), a1 = nz(-3, 3), b1 = R.int(-4, 4), a2 = nz(-3, 3), b2 = R.int(-4, 4), y = R.int(-5, 6), x1 = (y - b1) / a1, x2 = (y - b2) / a2;
        if (!Number.isInteger(x1) || !Number.isInteger(x2) || x1 === x2) return null; const sols = [...(x1 < c ? [x1] : []), ...(x2 >= c ? [x2] : [])]; if (sols.length === 2) return null;
        return QSet("On donne " + PCW(lin(a1, b1), c, lin(a2, b2)) + ". Résous " + M("f(x) = " + y) + ". (« aucune » s'il n'y a pas de solution.)", sols,
          "Morceau 1 : " + M("x = " + x1) + (x1 < c ? " (gardé)" : " (rejeté, pas " + M("< " + c) + ")") + ". Morceau 2 : " + M("x = " + x2) + (x2 >= c ? " (gardé)" : " (rejeté, pas " + M("\\ge " + c) + ")") + ". " + setT(sols) + ".",
          { ctx: "deux-affines", guide: [GS("Morceau 1, " + M(lin(a1, b1) + " = " + y) + " : " + M("x") + " = ?", x1, M("x = " + x1) + (x1 < c ? ", il est " + M("< " + c) + " : gardé." : ", il n'est pas " + M("< " + c) + " : rejeté.")), GS("Morceau 2, " + M(lin(a2, b2) + " = " + y) + " : " + M("x") + " = ?", x2, M("x = " + x2) + (x2 >= c ? ", il est " + M("\\ge " + c) + " : gardé." : ", il n'est pas " + M("\\ge " + c) + " : rejeté.")), GSet("Solutions retenues ?", sols, setT(sols) + ".")],
            traps: [TSet([x1, x2], "Une solution de morceau ne compte que si elle est dans l'intervalle de ce morceau.")] }); },
      () => { const c = R.int(0, 2), a = nz(-2, 3), b = R.int(-3, 3), e = R.int(-4, 2), f = (x) => (x < c ? a * x + b : x * x + e), k = R.int(-3, 3), y1 = f(k), v = f(y1); if (Math.abs(v) > 60 || y1 === k) return null;
        return QN("On donne " + PCW(lin(a, b), c, tri(1, 0, e)) + ". Calcule " + M("f(f(" + k + "))") + ".", v, M("f(" + k + ") = " + y1) + " (morceau " + (k < c ? 1 : 2) + "), puis " + M("f(" + y1 + ") = " + v) + " (morceau " + (y1 < c ? 1 : 2) + ").",
          { ctx: "fof", guide: [GS(M("f(" + k + ")") + " = ?", y1, "Morceau " + (k < c ? 1 : 2) + " : " + M(y1) + "."), GS(M("f(" + y1 + ")") + " = ?", v, "Morceau " + (y1 < c ? 1 : 2) + " (compare " + y1 + " à " + c + ") : " + M(v) + ".")],
            traps: [TR(y1, "C'est f(" + k + ") ; il faut encore calculer f de ce résultat."), TR(y1 < c ? y1 * y1 + e : a * y1 + b, "Pour f(" + y1 + "), compare " + y1 + " à la frontière " + c + " : autre morceau.")] }); },
    ],
  };

  const PROBS = {
    absval: [() => P("Sur une route droite, deux bornes sont aux kilomètres 12 et 30. On cherche les points (kilomètre x) dont la somme des distances aux deux bornes vaut 26 km : " + M("|x - 12| + |x - 30| = 26") + ".", [["a) Distance entre les deux bornes (km)", 18], ["b) Plus petite solution x", 8], ["c) Plus grande solution x", 34]], ["Entre les bornes, la somme vaut toujours 18 : trop peu.", "À gauche de 12, la somme vaut (12 − x) + (30 − x)."], "a) 18 ; b) " + M("42 - 2x = 26") + ", " + M("x = 8") + " ; c) par symétrie, " + M("x = 34") + ".")],
    morceaux: [() => P("Un parking : 4 CHF pour les 2 premières heures (ou moins), puis 2,50 CHF par heure supplémentaire, avec un maximum de 20 CHF par jour.", [["a) Prix pour 5 heures (CHF)", 11.5], ["b) Dès combien d'heures paie-t-on le maximum ?", 9], ["c) Prix pour 12 heures (CHF)", 20]], ["5 h = 2 h + 3 h en plus.", "4 + 2,5 · (t − 2) ≥ 20."], "a) " + M("4 + 3 \\cdot 2{,}5 = 11{,}5") + " ; b) " + M("2{,}5(t - 2) \\ge 16") + ", " + M("t \\ge 8{,}4") + " : dès 9 heures ; c) le maximum, 20 CHF.")],
    fimg: [() => P("Soit f(x) = x² − 2x − 3.", [["a) f(−2)", 5], ["b) f(0)", -3], ["c) Plus grande préimage de 0", 3]], ["(−2)² = 4.", "x² − 2x − 3 = (x − 3)(x + 1)."], "a) " + M("4 + 4 - 3 = 5") + " ; b) −3 ; c) zéros −1 et 3 : 3.")],
    lectgraph: [() => P("Une parabole a pour sommet S(2 ; −4) et coupe l'axe des x en 0 et 4.", [["a) Valeur minimale de f", -4], ["b) Plus grand zéro", 4], ["c) Nombre de solutions de f(x) = −2", 2]], ["Le sommet est le point le plus bas.", "y = −2 est au-dessus du sommet."], "a) −4 ; b) 4 ; c) la droite coupe la parabole 2 fois.")],
    racinv: [() => P("f(x) = 12/x et g(x) = x + 1.", [["a) f(3)", 4], ["b) Préimage de 6 par f", 2], ["c) Plus grande abscisse d'intersection de f et g", 3]], ["12/x = x + 1 ⇔ x² + x − 12 = 0.", "(x + 4)(x − 3) = 0."], "a) 4 ; b) 2 ; c) x = 3 (et x = −4).")],
    modaff: [() => P("Club de fitness : A = 15 CHF par séance ; B = 120 CHF d'abonnement + 7 CHF par séance.", [["a) Coût de 10 séances avec A", 150], ["b) Coût de 10 séances avec B", 190], ["c) Nombre minimum de séances pour que B soit strictement moins cher", 16]], ["15n < 120 + 7n ?", "8n > 120 ⇔ n > 15."], "a) 150 ; b) 190 ; c) 16.")],
    transf: [() => P("f(x) = x² ; g(x) = (x − 3)² − 5.", [["a) Abscisse du sommet de g", 3], ["b) Ordonnée du sommet de g", -5], ["c) g(5)", -1]], ["(x − 3) : 3 vers la droite.", "g(5) = 2² − 5."], "a) 3 ; b) −5 ; c) −1.")],
  };

  const ALL = { fimg: FI, lectgraph: LG, racinv: RI, modaff: MA, transf: TF, absval: AV, morceaux: MO };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    fimg: "Image : remplace x par le nombre (avec des parenthèses). Préimage : résous f(x) = valeur ; il peut y en avoir plusieurs.",
    lectgraph: "Zéros : sur l'axe horizontal. Valeurs : sur l'axe vertical. f(x) = k : abscisses des points de la courbe à la hauteur k.",
    racinv: "√x : élève au carré puis vérifie (solutions parasites). a/x : multiplie par x. Intersection : égalise les deux expressions.",
    modaff: "Coût = part fixe + prix unitaire · quantité. Pour comparer deux offres, égalise-les ; le résultat est souvent un entier à arrondir.",
    transf: "f(x − a) + b : a vers la droite, b vers le haut ; le point (p ; q) devient (p + a ; q + b). k · f(x) multiplie les ordonnées.",
    absval: "|A| est la distance de A à 0. |A| = b (b ≥ 0) : A = b ou A = −b ; isole d'abord la valeur absolue ; si elle doit être négative, aucune solution.",
    morceaux: "Compare d'abord x à la frontière pour choisir le morceau. Pour résoudre, résous dans chaque morceau et garde ce qui est dans le bon intervalle.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    fimg: ["Image, préimage, lecture", "Racine, deux préimages, lecture", "Trinôme, f(f(x)), paramètre"],
    lectgraph: ["Zéros, ordonnée à l'origine", "Extremums, nombre de solutions", "Signe, variations, f(x) = g(x)"],
    racinv: ["Images et préimages", "Équations avec racine, intersections", "Parasites, paramètre"],
    modaff: ["Coût total, prix unitaire, budget", "Seuil, égalité d'offres, expression", "Bougie, bénéfice, réservoir"],
    transf: ["Sommet, expression, décalage", "Point, sommet composé, valeur absolue", "Étirement, calcul de g, forme canonique"],
    absval: ["Calculer, distance, équation simple", "Isoler, deux cas, aucune solution", "Milieu, vérification, inéquation"],
    morceaux: ["Image, lecture, tarif", "Équation, |x − a| par morceaux, tarif inverse", "Continuité, deux morceaux affines, f(f(x))"],
  });
})();
