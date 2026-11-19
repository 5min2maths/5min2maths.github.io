// Chantier 11e · 1. Nombres et opérations, fin (19.11, « on se concentre sur la 11e ») : rel, fracops, rac, les trois
// dernières notions de 11e encore sur les anciens générateurs. Même standard que ch11_no.js : au moins 3 formes par
// niveau, pas à pas, erreurs typiques, étiquette ctx ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  const r6 = (v) => +(+v).toFixed(6);
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const N = (v) => String(r6(v)).replace(".", "{,}");
  // rationnels exacts [n, d]
  const rq = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd2(n, d) || 1; return [n / g, d / g]; };
  const qa = (x, y) => rq(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const qs = (x, y) => qa(x, [-y[0], y[1]]);
  const qm = (x, y) => rq(x[0] * y[0], x[1] * y[1]);
  const qd = (x, y) => rq(x[0] * y[1], x[1] * y[0]);
  const qv = (x) => x[0] / x[1];
  const qT = (x) => frac(x[0], x[1]);
  const fT = (n, d) => (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}";
  const fP = (n, d) => (n < 0 ? "\\left(-\\frac{" + -n + "}{" + d + "}\\right)" : "\\frac{" + n + "}{" + d + "}");
  const irr = () => { let n, d; do { d = R.int(2, 9); n = R.int(1, 2 * d); } while (gcd2(n, d) !== 1 || n === d); return [n, d]; };
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.radical ? { radical: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const FA = " (fraction acceptée)";

  // ===================== rel =====================
  const RE = {
    1: [
      () => { const a = nz(-12, 12), b = nz(-12, 12), A = Math.abs(a), B = Math.abs(b), same = a * b > 0;
        return Qv("Calcule : " + M(par(a) + " + " + par(b)), a + b, M(par(a) + " + " + par(b) + " = " + (a + b)) + ".",
          { ctx: "addition", fig: FIG.numberLine(a, []), guide: [same ? GS("Même signe : on additionne les distances à zéro. " + M(A + " + " + B) + " = ?", A + B, M(A + B) + ".") : GS("Signes contraires : la plus grande distance moins la plus petite. " + M(Math.max(A, B) + " - " + Math.min(A, B)) + " = ?", Math.abs(A - B), M(Math.abs(A - B)) + "."), GS("Résultat (avec son signe) ?", a + b, M(a + b) + ".")],
            traps: [TR(-(a + b), "Signe du résultat : celui du nombre le plus loin de zéro."), TR(A + B === Math.abs(a + b) ? a - b : (a < 0 ? -1 : 1) * (A + B), "Signes contraires : on soustrait les distances.")] }); },
      () => { const a = nz(-12, 12), b = -R.int(2, 12);
        return Qv("Calcule : " + M(par(a) + " - " + par(b)), a - b, "Soustraire un nombre négatif, c'est ajouter son opposé : " + M(par(a) + " + " + -b + " = " + (a - b)) + ".",
          { ctx: "moins-negatif", guide: [GS("On remplace " + M("- " + par(b)) + " par " + M("+ " + -b) + ". " + M(par(a) + " + " + -b) + " = ?", a - b, M(a - b) + ".")], traps: [TR(a + b, "« − (" + b + ") » devient « + " + -b + " »."), TR(-(a - b), "Vérifie le signe du résultat.")] }); },
      () => { const a = nz(-9, 9), b = nz(-9, 9), div = R.rand() < 0.5, p = a * b;
        return div ? Qv("Calcule : " + M(par(p) + " : " + par(b)), a, "Signe : " + (p * b > 0 ? "même signe → +" : "signes contraires → −") + " ; " + M(Math.abs(p) + " : " + Math.abs(b) + " = " + Math.abs(a)) + " : " + M(a) + ".", { ctx: "division", guide: [GS("Le résultat est-il positif (1) ou négatif (−1) ?", Math.sign(a), p * b > 0 ? "Même signe : positif." : "Signes contraires : négatif."), GS("Résultat ?", a, M(a) + ".")], traps: [TR(-a, "Règle des signes : même signe → +, signes contraires → −.")] })
          : Qv("Calcule : " + M(par(a) + " \\cdot " + par(b)), p, "Signe : " + (a * b > 0 ? "même signe → +" : "signes contraires → −") + " ; " + M(Math.abs(a) + " \\cdot " + Math.abs(b) + " = " + Math.abs(p)) + " : " + M(p) + ".", { ctx: "produit", guide: [GS("Le résultat est-il positif (1) ou négatif (−1) ?", Math.sign(p), a * b > 0 ? "Même signe : positif." : "Signes contraires : négatif."), GS("Résultat ?", p, M(p) + ".")], traps: [TR(-p, "Règle des signes : même signe → +, signes contraires → −."), TR(a + b, "C'est un produit.")] }); },
      () => { const t0 = -R.int(2, 15), d = R.int(5, 20), up = R.rand() < 0.5, x = pk([["Le matin, il fait " + M(t0) + " °C. La température " + (up ? "monte" : "baisse") + " de " + M(d) + " °C. Quelle température fait-il ensuite (en °C) ?", "temperature"], ["Un plongeur est à " + M(t0) + " m (sous la surface). Il " + (up ? "remonte" : "descend") + " de " + M(d) + " m. À quelle altitude est-il ensuite (en m) ?", "plongeur"]]), v = up ? t0 + d : t0 - d;
        return Qv(x[0], v, M(t0 + (up ? " + " : " - ") + d + " = " + v) + ".",
          { ctx: x[1], guide: [GS("Calcul " + M(par(t0) + (up ? " + " : " - ") + d) + " = ?", v, M(v) + ".")], traps: [TR(up ? -(Math.abs(t0) + d) : Math.abs(t0) - d, up ? "Monter, c'est ajouter : " + t0 + " + " + d + "." : "Descendre, c'est soustraire : on s'éloigne encore de zéro."), TR(-v, "Vérifie le signe.")] }); },
    ],
    2: [
      () => { const a = nz(-9, 9), b = R.int(2, 6), c = nz(-6, 6);
        return Qv("Calcule : " + M(par(a) + " - " + b + " \\cdot " + par(c)), a - b * c, M(par(a) + " - " + par(b * c) + " = " + (a - b * c)) + ".",
          { ctx: "priorite", guide: [GS("D'abord le produit " + M(b + " \\cdot " + par(c)) + " ?", b * c, M(b * c) + "."), GS("Puis " + M(par(a) + " - " + par(b * c)) + " ?", a - b * c, M(a - b * c) + ".")], traps: [TR((a - b) * c, "La multiplication passe avant la soustraction."), TR(a + b * c, "Soustraire " + par(b * c) + " : attention au signe.")] }); },
      () => { const ns = [nz(-9, 9), nz(-12, 12), nz(-9, 9), nz(-12, 12)], ops = [pk(["+", "-"]), pk(["+", "-"]), pk(["+", "-"])], v = ns.reduce((s, n, i) => (i ? (ops[i - 1] === "+" ? s + n : s - n) : n), 0);
        const txt = ns.map((n, i) => (i ? " " + ops[i - 1] + " " : "") + (i ? par(n) : n)).join(""), simp = ns.map((n, i) => (i ? (ops[i - 1] === "+" ? n : -n) : n));
        return Qv("Calcule : " + M(txt), v, "On écrit tout en additions : " + M(simp.map((n, i) => (i ? (n < 0 ? " - " + -n : " + " + n) : n)).join("")) + " = " + M(v) + ".",
          { ctx: "suite", guide: [GS("Somme des termes positifs (après avoir transformé les « − (−) ») ?", simp.filter((n) => n > 0).reduce((s, n) => s + n, 0), "Termes positifs : " + simp.filter((n) => n > 0).join(", ") + "."), GS("Somme des termes négatifs ?", simp.filter((n) => n < 0).reduce((s, n) => s + n, 0), "Termes négatifs : " + simp.filter((n) => n < 0).join(", ") + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(ns.reduce((s, n, i) => (i ? (ops[i - 1] === "+" ? s + n : s + n) : n), 0), "« − (−a) » devient « + a » : le signe compte."), TR(-v, "Vérifie le signe final.")] }); },
      () => { const a = pk([2, 3, 4, 5]), n = pk([2, 3, 4]), neg = R.rand() < 0.5, v = neg ? -(a ** n) : (-a) ** n;
        return Qv("Calcule : " + M(neg ? "-" + a + "^" + n : "(-" + a + ")^" + n), v, neg ? "L'exposant porte seulement sur " + M(a) + " : " + M("-(" + a + "^" + n + ") = " + v) + "." : "Le négatif est multiplié " + n + " fois : " + (n % 2 ? "nombre impair de facteurs négatifs, résultat négatif" : "nombre pair de facteurs, résultat positif") + " : " + M(v) + ".",
          { ctx: neg ? "puiss-sans-par" : "puiss-par", guide: [GS(M(a + "^" + n) + " = ?", a ** n, M(a ** n) + "."), GS("Avec le signe ?", v, M(v) + ".")], traps: [TR(-v, neg ? "Sans parenthèses, −" + a + "^" + n + " = −(" + a + "^" + n + ")." : "(−" + a + ")^" + n + " : signe + si l'exposant est pair, − s'il est impair."), TR(-a * n, "Une puissance n'est pas un produit par l'exposant.")] }); },
      () => { const lo = -R.int(3, 15), hi = R.int(2, 20), x = pk([["La température la plus basse de la journée est " + M(lo) + " °C et la plus haute " + M(hi) + " °C. Quel est l'écart de température (en °C) ?", "ecart-temp"], ["Le point le plus bas d'un lac est à " + M(lo * 10) + " m et le sommet voisin à " + M(hi * 100) + " m d'altitude. Quel est le dénivelé (en m) ?", "denivele"]]), v = x[1] === "denivele" ? hi * 100 - lo * 10 : hi - lo;
        return Qv(x[0], v, "Écart = plus grand − plus petit : " + M((x[1] === "denivele" ? hi * 100 : hi) + " - " + par(x[1] === "denivele" ? lo * 10 : lo) + " = " + v) + ".",
          { ctx: x[1], guide: [GS("Écart " + M((x[1] === "denivele" ? hi * 100 : hi) + " - " + par(x[1] === "denivele" ? lo * 10 : lo)) + " ?", v, M(v) + ".")], traps: [TR(x[1] === "denivele" ? hi * 100 + lo * 10 : hi + lo, "Soustraire un négatif, c'est ajouter : l'écart est plus grand que " + (x[1] === "denivele" ? hi * 100 : hi) + ".")] }); },
    ],
    3: [
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6), e = pk([1, 2, -1, -2, 3]); const t = (a - b) * (c - d); if (t % e) return null; const v = t / e;
        return Qv("Calcule : " + M("\\frac{(" + a + " - " + par(b) + ") \\cdot (" + c + " - " + par(d) + ")}{" + e + "}"), v, M("(" + (a - b) + ") \\cdot (" + (c - d) + ") = " + t) + ", puis " + M(t + " : " + par(e) + " = " + v) + ".",
          { ctx: "fraction-rel", guide: [GS(M(a + " - " + par(b)) + " ?", a - b, M(a - b) + "."), GS(M(c + " - " + par(d)) + " ?", c - d, M(c - d) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(-v, "Compte les facteurs négatifs pour le signe."), TR(((a + b) * (c + d)) / e, "Soustraire un négatif, c'est ajouter.")] }); },
      () => { const x = -R.int(1, 4), a = pk([2, 3, -1]), b = nz(-5, 5), c = nz(-6, 6), v = a * x * x + b * x + c;
        return Qv("Calcule la valeur de " + M((a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + (b < 0 ? " - " + -b : " + " + b) + "x" + (c < 0 ? " - " + -c : " + " + c)) + " pour " + M("x = " + x) + ".", v, M(a + " \\cdot " + par(x) + "^2" + (b < 0 ? " - " + -b : " + " + b) + " \\cdot " + par(x) + (c < 0 ? " - " + -c : " + " + c) + " = " + a * x * x + (b * x < 0 ? " - " + -b * x : " + " + b * x) + (c < 0 ? " - " + -c : " + " + c) + " = " + v) + ".",
          { ctx: "valeur-x", guide: [GS(M(par(x) + "^2") + " ?", x * x, M(x * x) + " (positif)."), GS(M(b + " \\cdot " + par(x)) + " ?", b * x, M(b * x) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(-a * x * x + b * x + c, "(" + x + ")² = " + x * x + " est positif."), TR(a * x * x - b * x + c, "Attention au signe de " + b + " · (" + x + ").")] }); },
      () => { const ts = Array.from({ length: pk([4, 5]) }, () => R.int(-8, 6)), s = ts.reduce((a, b) => a + b, 0); if (s % ts.length) return null; const v = s / ts.length;
        return Qv("Températures relevées à midi pendant " + M(ts.length) + " jours : " + ts.map((t) => M(t)).join(" ; ") + " (en °C). Quelle est la température moyenne ?", v, "Somme " + M(s) + ", divisée par " + M(ts.length) + " : " + M(v) + " °C.",
          { ctx: "moyenne", guide: [GS("Somme des températures ?", s, M(s) + "."), GS("Moyenne ?", v, M(s + " : " + ts.length + " = " + v) + ".")], traps: [TR(ts.reduce((a, b) => a + Math.abs(b), 0) / ts.length, "Les températures négatives se soustraient."), TR(-v, "Vérifie le signe de la somme.")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 5), c = R.int(2, 4), sgn = [pk([1, -1]), pk([1, -1]), pk([1, -1])], A = sgn[0] * a * b * c, v = (A / (sgn[1] * b)) * (sgn[2] * c);
        return Qv("Calcule de gauche à droite : " + M(par(A) + " : " + par(sgn[1] * b) + " \\cdot " + par(sgn[2] * c)), v, M(par(A) + " : " + par(sgn[1] * b) + " = " + A / (sgn[1] * b)) + ", puis " + M(par(A / (sgn[1] * b)) + " \\cdot " + par(sgn[2] * c) + " = " + v) + ".",
          { ctx: "gauche-droite", guide: [GS("D'abord la division ?", A / (sgn[1] * b), M(A / (sgn[1] * b)) + "."), GS("Puis la multiplication ?", v, M(v) + ".")], traps: [TR(A / (sgn[1] * b * sgn[2] * c), "Multiplications et divisions : de gauche à droite."), TR(-v, "Compte les signes négatifs.")] }); },
    ],
  };

  // ===================== fracops =====================
  const FO = {
    1: [
      () => { let b, e; do { b = R.int(2, 6); e = R.int(2, 8); } while (b === e); const a = R.int(1, b - 1), c = R.int(1, 2 * e), n = a * e - c * b, d = b * e; if (n >= 0 || gcd2(a, b) !== 1 || gcd2(c, e) !== 1) return null;
        return Qv("Calcule et simplifie : " + M(fT(a, b) + " - " + fT(c, e)) + FA, n / d, M("\\frac{" + a * e + "}{" + d + "} - \\frac{" + c * b + "}{" + d + "} = " + frac(n, d)) + " : le résultat est négatif.",
          { ctx: "diff-negative", guide: [GS("Dénominateur commun " + M(b + " \\cdot " + e) + " ?", d, M(d) + "."), GS("Numérateur " + M(a * e + " - " + c * b) + " ?", n, M(n) + "."), GS("Résultat simplifié" + FA + " ?", n / d, M(frac(n, d)) + ".")], traps: [TR(-n / d, "Le résultat est négatif : la 2e fraction est plus grande."), TR((a - c) / (b - e || 1), "On ne soustrait pas les dénominateurs.")] }); },
      () => { const [a, b] = irr(), [c, e] = irr(), x = rq(-a * c, b * e);
        return Qv("Calcule et simplifie : " + M(fP(-a, b) + " \\cdot " + fT(c, e)) + FA, qv(x), "Signe − ; " + M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "} = " + qT([a * c, b * e])) + " : " + M(qT(x)) + ".",
          { ctx: "produit", guide: [GS("Signe : positif (1) ou négatif (−1) ?", -1, "Négatif fois positif : négatif."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(-qv(x), "Négatif fois positif : le résultat est négatif."), TR(-(a * e) / (b * c), "Pour multiplier, on ne prend pas l'inverse.")] }); },
      () => { const [a, b] = irr(), [c, e] = irr(), x = qd([-a, b], [c, e]);
        return Qv("Calcule et simplifie : " + M(fP(-a, b) + " : " + fT(c, e)) + FA, qv(x), "Diviser, c'est multiplier par l'inverse : " + M(fP(-a, b) + " \\cdot \\frac{" + e + "}{" + c + "} = " + qT(x)) + ".",
          { ctx: "quotient", guide: [GS("Inverse de " + M(fT(c, e)) + FA + " ?", e / c, M("\\frac{" + e + "}{" + c + "}") + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(-(a * c) / (b * e), "Diviser, c'est multiplier par l'INVERSE."), TR(-qv(x), "Négatif divisé par positif : négatif.")] }); },
    ],
    2: [
      () => { const [a, b] = irr(), [c, e] = irr(), [f, g] = irr(), sgn = pk([1, -1]), x = qa([a, b], qm([sgn * c, e], [f, g]));
        return Qv("Calcule et simplifie : " + M(fT(a, b) + (sgn < 0 ? " - " : " + ") + fT(c, e) + " \\cdot " + fT(f, g)) + FA, qv(x), "Le produit d'abord : " + M(fT(c, e) + " \\cdot " + fT(f, g) + " = " + qT(qm([c, e], [f, g]))) + ", puis " + M(qT(x)) + ".",
          { ctx: "priorite", guide: [GS("Produit " + M(fT(c, e) + " \\cdot " + fT(f, g)) + FA + " ?", qv(qm([c, e], [f, g])), M(qT(qm([c, e], [f, g]))) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(qa([a, b], [sgn * c, e]), [f, g])), "La multiplication passe avant l'addition.")] }); },
      () => { const [a, b] = irr(), [c, e] = irr(), [f, g] = irr(), x = qs([a, b], qs([c, e], [f, g]));
        return Qv("Calcule et simplifie : " + M(fT(a, b) + " - \\left(" + fT(c, e) + " - " + fT(f, g) + "\\right)") + FA, qv(x), "Parenthèse : " + M(qT(qs([c, e], [f, g]))) + " ; puis " + M(fT(a, b) + " - " + (qv(qs([c, e], [f, g])) < 0 ? "\\left(" + qT(qs([c, e], [f, g])) + "\\right)" : qT(qs([c, e], [f, g]))) + " = " + qT(x)) + ".",
          { ctx: "parenthese", guide: [GS("Parenthèse" + FA + " ?", qv(qs([c, e], [f, g])), M(qT(qs([c, e], [f, g]))) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qs(qs([a, b], [c, e]), [f, g])), "Le « − » devant la parenthèse change le signe de " + fT(f, g).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2") + ".")] }); },
      () => { const [a, b] = irr(), [c, d] = irr(), k = pk([2, 3, -2, 4]), x = qd(qs([a, b], [c, d]), [k, 1]);
        return Qv("Calcule et simplifie : " + M("\\left(" + fT(a, b) + " - " + fT(c, d) + "\\right) : " + par(k)) + FA, qv(x), "Parenthèse : " + M(qT(qs([a, b], [c, d]))) + ", divisée par " + M(par(k)) + " : " + M(qT(x)) + ".",
          { ctx: "div-entier", guide: [GS("Parenthèse" + FA + " ?", qv(qs([a, b], [c, d])), M(qT(qs([a, b], [c, d]))) + "."), GS("Divisée par " + M(par(k)) + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(qs([a, b], [c, d]), [k, 1])), "Diviser par " + k + ", c'est multiplier par 1/" + k + "."), TR(-qv(x), "Attention au signe.")] }); },
    ],
    3: [
      () => { const [a, b] = irr(), [c, d] = irr(), [e, f] = irr(), [g, h] = irr(), num = qs([a, b], [c, d]), den = qa([e, f], [g, h]); if (num[0] === 0) return null; const x = qd(num, den);
        return Qv("Calcule et simplifie : " + M("\\dfrac{" + fT(a, b) + " - " + fT(c, d) + "}{" + fT(e, f) + " + " + fT(g, h) + "}") + FA, qv(x), "Numérateur " + M(qT(num)) + ", dénominateur " + M(qT(den)) + " ; quotient " + M(qT(x)) + ".",
          { ctx: "fraction-etagee", guide: [GS("Numérateur" + FA + " ?", qv(num), M(qT(num)) + "."), GS("Dénominateur" + FA + " ?", qv(den), M(qT(den)) + "."), GS("Quotient" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(num, den)), "Une fraction de fractions est un quotient : multiplie par l'inverse du dénominateur.")] }); },
      () => { const [a, b] = irr(), [c, d] = irr(), x = qs(qm([-a, b], [-a, b]), [c, d]);
        return Qv("Calcule et simplifie : " + M("\\left(" + fT(-a, b) + "\\right)^2 - " + fT(c, d)) + FA, qv(x), M("\\left(" + fT(-a, b) + "\\right)^2 = " + fT(a * a, b * b)) + " (positif) ; puis " + M(qT(x)) + ".",
          { ctx: "carre", guide: [GS("Carré" + FA + " ?", (a * a) / (b * b), M(fT(a * a, b * b)) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qs([-a * a, b * b], [c, d])), "Le carré d'un nombre négatif est positif."), TR(qv(qs([2 * a, b], [c, d])), "Au carré, on multiplie le nombre par lui-même (pas par 2).")] }); },
      () => { const [p1, q1] = pk([[1, 3], [1, 4], [2, 5], [1, 5]]), [p2, q2] = pk([[1, 2], [1, 3], [3, 4], [2, 3]]), rest = qm(qs([1, 1], [p1, q1]), qs([1, 1], [p2, q2])), V = pk([60, 120, 240, 300]), v = qv(rest) * V; if (!Number.isInteger(v)) return null;
        return Qv("Un réservoir contient " + M(V) + " L. On utilise " + M(fT(p1, q1)) + " du contenu, puis " + M(fT(p2, q2)) + " de ce qui reste. Combien de litres reste-t-il ?", v, "Il reste " + M("\\left(1 - " + fT(p1, q1) + "\\right) \\cdot \\left(1 - " + fT(p2, q2) + "\\right) = " + qT(rest)) + " du contenu, soit " + M(v) + " L.",
          { ctx: "reservoir", guide: [GS("Fraction restante après le 1er prélèvement" + FA + " ?", 1 - p1 / q1, M(qT(qs([1, 1], [p1, q1]))) + "."), GS("Fraction finale" + FA + " ?", qv(rest), M(qT(rest)) + "."), GS("Litres restants ?", v, M(v) + " L.")], traps: [TR(V * (1 - p1 / q1 - p2 / q2), "« De ce qui reste » : la 2e fraction porte sur le reste, pas sur le tout."), TR(V * qv(qm([p1, q1], [p2, q2])), "On demande ce qui RESTE.")] }); },
    ],
  };

  // ===================== rac =====================
  const RA = {
    1: [
      () => { const k = R.int(2, 20);
        return Qv("Calcule " + M("\\sqrt{" + k * k + "}") + ".", k, M("\\sqrt{" + k * k + "} = " + k) + " car " + M(k + "^2 = " + k * k) + ".",
          { ctx: "carre-parfait", fig: FIG.areaSquare("aire " + k * k), guide: [GS("Essaie " + M(k - 1) + " : " + M((k - 1) + "^2") + " = ?", (k - 1) ** 2, M((k - 1) ** 2) + " : un peu moins que " + M(k * k) + "."), GS("Donc " + M("\\sqrt{" + k * k + "}") + " = ?", k, M(k) + ".")], traps: [TR((k * k) / 2, "La racine n'est pas la moitié."), TR(k * k, "Il faut le nombre qui, au carré, donne " + k * k + ".")] }); },
      () => { const [k, kind] = pk([[pk([3, 4, 5, 6, 7, 8, 9]) / 10, "dec"], [pk([1, 2, 3]) / 10, "dec"], [0, "frac"]]); if (kind === "frac") { const n = R.int(1, 6), d = n + R.int(1, 6); return Qv("Calcule " + M("\\sqrt{\\frac{" + n * n + "}{" + d * d + "}}") + FA + ".", n / d, M("\\frac{\\sqrt{" + n * n + "}}{\\sqrt{" + d * d + "}} = \\frac{" + n + "}{" + d + "}") + ".", { ctx: "racine-fraction", guide: [GS(M("\\sqrt{" + n * n + "}") + " ?", n, M(n) + "."), GS(M("\\sqrt{" + d * d + "}") + " ?", d, M(d) + "."), GS("Résultat" + FA + " ?", n / d, M("\\frac{" + n + "}{" + d + "}") + ".")], traps: [TR((n * n) / (d * d) / 2, "On prend la racine du numérateur et du dénominateur."), TR(n * n / d, "Racine du dénominateur aussi.")] }); }
        const sq = r6(k * k);
        return Qv("Calcule " + M("\\sqrt{" + N(sq) + "}") + ".", k, M(N(k) + "^2 = " + N(sq)) + ", donc " + M("\\sqrt{" + N(sq) + "} = " + N(k)) + ".",
          { ctx: "racine-decimal", guide: [GS(M(N(sq)) + " = " + M(N(sq * 100)) + " : 100. Racine de " + M(N(sq * 100)) + " ?", r6(k * 10), M(N(k * 10)) + "."), GS("Divisée par 10 (racine de 100) ?", k, M(N(k)) + ".")], traps: [TR(r6(Math.sqrt(sq * 10)), "Attention à la virgule : vérifie en élevant au carré."), TR(r6(k / 10), "Vérifie : " + N(k / 10) + "² = " + N(k * k / 100) + ".")] }); },
      () => { const s = R.int(4, 15), x = pk([["Un jardin carré a une aire de " + M(s * s) + " m². Quelle est la longueur de son côté (en m) ?", "jardin"], ["Un carrelage carré a une aire de " + M(s * s) + " cm². Combien mesure son côté (en cm) ?", "carrelage"], ["Un terrain carré a une aire de " + M(s * s * 100) + " m². Quelle est la longueur de son côté (en m) ?", "terrain"]]), v = x[1] === "terrain" ? s * 10 : s;
        return Qv(x[0], v, "Côté " + M("= \\sqrt{" + (x[1] === "terrain" ? s * s * 100 : s * s) + "} = " + v) + ".",
          { ctx: x[1], fig: FIG.areaSquare("aire " + (x[1] === "terrain" ? s * s * 100 : s * s)), guide: [GS("Côté = racine de l'aire : ?", v, M(v) + ".")], traps: [TR((x[1] === "terrain" ? s * s * 100 : s * s) / 4, "Diviser par 4 donne le côté à partir du PÉRIMÈTRE, pas de l'aire."), TR((x[1] === "terrain" ? s * s * 100 : s * s) / 2, "La racine n'est pas la moitié.")] }); },
    ],
    2: [
      () => { const k = R.int(2, 7), m = pk([2, 3, 5, 6, 7]);
        return Qv("Écris " + M("\\sqrt{" + k * k * m + "}") + " sous la forme " + M("a\\sqrt{b}") + " (touche √).", k * Math.sqrt(m), M("\\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}") + ".",
          { ctx: "simplifier", radical: true, canon: k + "√" + m, guide: [GS("Plus grand carré parfait qui divise " + M(k * k * m) + " ?", k * k, M(k * k * m + " = " + k * k + " \\cdot " + m) + "."), GSR("Résultat ?", k * Math.sqrt(m), M(k + "\\sqrt{" + m + "}") + ".")], traps: [TR(k * k * Math.sqrt(m), "On sort la racine du carré : √" + k * k + " = " + k + "."), TR(m * Math.sqrt(k * k), "Le facteur qui sort est la racine du carré parfait.")] }); },
      () => { const [a, b, r] = pk([[2, 8, 4], [3, 12, 6], [2, 18, 6], [3, 27, 9], [5, 20, 10], [2, 32, 8], [6, 24, 12], [3, 48, 12]]), sw = R.rand() < 0.5;
        return Qv("Calcule " + M("\\sqrt{" + (sw ? b : a) + "} \\cdot \\sqrt{" + (sw ? a : b) + "}") + ".", r, M("\\sqrt{" + a + " \\cdot " + b + "} = \\sqrt{" + a * b + "} = " + r) + ".",
          { ctx: "produit-entier", guide: [GS("Produit sous la racine " + M(a + " \\cdot " + b) + " ?", a * b, M(a * b) + "."), GS("Racine ?", r, M(r) + ".")], traps: [TR(r6(Math.sqrt(a) + Math.sqrt(b)), "√a · √b = √(a · b), pas √a + √b."), TR(a * b, "N'oublie pas la racine.")] }); },
      () => { const [n, d, r] = pk([[72, 2, 6], [75, 3, 5], [98, 2, 7], [48, 3, 4], [80, 5, 4], [128, 2, 8], [63, 7, 3], [50, 2, 5]]);
        return Qv("Calcule " + M("\\frac{\\sqrt{" + n + "}}{\\sqrt{" + d + "}}") + ".", r, M("\\sqrt{\\frac{" + n + "}{" + d + "}} = \\sqrt{" + n / d + "} = " + r) + ".",
          { ctx: "quotient", guide: [GS(M(n + " : " + d) + " ?", n / d, M(n / d) + "."), GS("Racine ?", r, M(r) + ".")], traps: [TR(n / d, "N'oublie pas la racine."), TR(r6(Math.sqrt(n) - Math.sqrt(d)), "√a : √b = √(a : b).")] }); },
    ],
    3: [
      () => { const m = pk([2, 3, 5]), a = R.int(2, 4), b = R.int(2, 5);
        return Qv("Simplifie : " + M("\\sqrt{" + a * a * m + "} + \\sqrt{" + b * b * m + "}") + " (forme " + M("a\\sqrt{b}") + ").", (a + b) * Math.sqrt(m), M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}") + ".",
          { ctx: "somme", radical: true, canon: (a + b) + "√" + m, guide: [GSR("Première racine simplifiée ?", a * Math.sqrt(m), M(a + "\\sqrt{" + m + "}") + "."), GSR("Seconde ?", b * Math.sqrt(m), M(b + "\\sqrt{" + m + "}") + "."), GSR("Somme ?", (a + b) * Math.sqrt(m), M((a + b) + "\\sqrt{" + m + "}") + ".")], traps: [TR(r6(Math.sqrt(a * a * m + b * b * m)), "√x + √y n'est pas √(x + y) : simplifie chaque racine d'abord.")] }); },
      () => { const k = R.int(2, 6), m = pk([2, 3, 5, 7]), v = k * k * m;
        return Qv("Calcule " + M("\\left(" + k + "\\sqrt{" + m + "}\\right)^2") + ".", v, M(k + "^2 \\cdot \\left(\\sqrt{" + m + "}\\right)^2 = " + k * k + " \\cdot " + m + " = " + v) + ".",
          { ctx: "carre-radical", guide: [GS(M(k + "^2") + " ?", k * k, M(k * k) + "."), GS(M("\\left(\\sqrt{" + m + "}\\right)^2") + " ?", m, M(m) + "."), GS("Produit ?", v, M(v) + ".")], traps: [TR(k * m, "Le " + k + " est aussi élevé au carré."), TR(2 * k * m, "Au carré, on multiplie par lui-même.")] }); },
      () => { const c = R.int(2, 12), x = pk([["la diagonale d'un carré de côté " + M(c) + " cm", 2, "diag-carre"], ["la diagonale d'un rectangle de " + M(c) + " cm sur " + M(c) + " cm", 2, "diag-carre"], ["la hauteur d'un triangle équilatéral de côté " + M(2 * c) + " cm", 3, "hauteur"]]), v = c * Math.sqrt(x[1]);
        return Qv("Calcule la valeur exacte de " + x[0] + " (forme " + M("a\\sqrt{b}") + ").", v, x[2] === "hauteur" ? M("h^2 = " + (2 * c) + "^2 - " + c + "^2 = " + 3 * c * c) + ", donc " + M("h = " + c + "\\sqrt{3}") + " cm." : M("d^2 = " + c + "^2 + " + c + "^2 = " + 2 * c * c) + ", donc " + M("d = " + c + "\\sqrt{2}") + " cm.",
          { ctx: x[2], radical: true, canon: c + "√" + x[1], guide: [GS("Pythagore : carré de la longueur cherchée ?", x[1] * c * c, M(x[1] * c * c) + "."), GSR("Valeur exacte ?", v, M(c + "\\sqrt{" + x[1] + "}") + ".")], traps: [TR(x[1] * c, "On prend la racine de " + x[1] * c * c + " : " + c + "√" + x[1] + "."), TR(r6(c * x[1] / 2), "Utilise Pythagore.")] }); },
    ],
  };

  const PROBS = {
    rel: [() => P("À Genève, la température passe de −6 °C à 7 h à +9 °C à 14 h, puis baisse de 11 °C jusqu'à minuit.", [["a) Hausse entre 7 h et 14 h (°C)", 15], ["b) Température à minuit (°C)", -2], ["c) Moyenne des trois relevés (°C)", 1 / 3]], ["9 − (−6).", "9 − 11."], "a) " + M("9 - (-6) = 15") + " ; b) " + M("9 - 11 = -2") + " ; c) " + M("\\frac{-6 + 9 - 2}{3} = \\frac{1}{3}") + ".")],
    fracops: [() => P("Calcule A = 1/2 − 3/4 · 2/3 et B = (1/2 − 3/4) · 2/3 (fractions acceptées).", [["a) A", 0], ["b) B", -1 / 6], ["c) A − B", 1 / 6]], ["A : le produit d'abord.", "B : la parenthèse d'abord."], "a) " + M("\\frac{1}{2} - \\frac{1}{2} = 0") + " ; b) " + M("-\\frac{1}{4} \\cdot \\frac{2}{3} = -\\frac{1}{6}") + " ; c) " + M("\\frac{1}{6}") + ".")],
    rac: [() => P("Un carré a une aire de 50 cm².", [["a) Son côté vaut a√2 : a ?", 5], ["b) Sa diagonale (cm)", 10], ["c) Aire du carré construit sur la diagonale (cm²)", 100]], ["√50 = √(25 · 2).", "Diagonale = côté · √2."], "a) " + M("5\\sqrt{2}") + " ; b) " + M("5\\sqrt{2} \\cdot \\sqrt{2} = 10") + " ; c) " + M("100") + ".")],
  };

  const ALL = { rel: RE, fracops: FO, rac: RA };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => { const L0 = lv[Math.min(Math.max(d, 1), 3)]; let q = null; for (let k = 0; k < 40 && !(q && q.traps && q.traps.length); k++) q = pk(L0)(); return q; };
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    rel: "Addition : même signe → on additionne les distances ; signes contraires → on soustrait. Soustraire, c'est ajouter l'opposé. Produit : même signe → +.",
    fracops: "Signe d'abord, puis priorités : × et : avant + et −. Diviser, c'est multiplier par l'inverse. Simplifie à la fin (ou avant de multiplier).",
    rac: "√(a · b) = √a · √b ; sors les carrés parfaits : √72 = √(36 · 2) = 6√2. Mais √(a + b) ≠ √a + √b.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    rel: ["Additionner, soustraire, multiplier", "Priorités, puissances, écarts", "Expressions, moyennes, enchaînements"],
    fracops: ["Différence négative, produit, quotient", "Priorités, parenthèses", "Fractions étagées, carrés, problèmes"],
    rac: ["Carrés parfaits, décimaux, côté d'un carré", "Simplifier, produits, quotients", "Sommes, carrés, longueurs exactes"],
  });
})();
