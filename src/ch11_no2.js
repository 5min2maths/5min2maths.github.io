// Chantier 11e · 1. Nombres et opérations, fin (19.11, « on se concentre sur la 11e ») : rel, fracops, rac, les trois
// dernières notions de 11e encore sur les anciens générateurs ; carres et pctvar (révisions de 10e) ajoutés le 20.11. Même standard que ch11_no.js : au moins 3 formes par
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
  // 22.11 (« valeurs un peu hautes ») : fractions étagées et carrés avec de petits dénominateurs (2 à 6).
  const irrS = () => { let n, d; do { d = R.int(2, 6); n = R.int(1, d + 2); } while (gcd2(n, d) !== 1 || n === d); return [n, d]; };
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.radical ? { radical: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const FA = " (fraction acceptée)";

  // ===================== rel =====================
  const RE = {
    1: [
      () => { let a, b; do { a = nz(-12, 12); b = nz(-12, 12); } while (a > 0 && b > 0); const A = Math.abs(a), B = Math.abs(b), same = a * b > 0; // au moins un négatif (21.11)
        return Qv("Calcule : " + M(par(a) + " + " + par(b)), a + b, M(par(a) + " + " + par(b) + " = " + (a + b)) + ".",
          { ctx: "addition", fig: FIG.numberLine(a, [], { span: [a + b] }), guide: [same ? GS("Même signe : on additionne les distances à zéro. " + M(A + " + " + B) + " = ?", A + B, M(A + B) + ".") : GS("Signes contraires : la plus grande distance moins la plus petite. " + M(Math.max(A, B) + " - " + Math.min(A, B)) + " = ?", Math.abs(A - B), M(Math.abs(A - B)) + "."), GS("Résultat (avec son signe) ?", a + b, M(a + b) + ".")],
            traps: [TR(-(a + b), "Signe du résultat : celui du nombre le plus loin de zéro."), TR(A + B === Math.abs(a + b) ? a - b : (a < 0 ? -1 : 1) * (A + B), "Signes contraires : on soustrait les distances.")] }); },
      () => { const a = nz(-12, 12), b = -R.int(2, 12);
        return Qv("Calcule : " + M(par(a) + " - " + par(b)), a - b, "Soustraire un nombre négatif, c'est ajouter son opposé : " + M(par(a) + " + " + -b + " = " + (a - b)) + ".",
          { ctx: "moins-negatif", guide: [GS("On remplace " + M("- " + par(b)) + " par " + M("+ " + -b) + ". " + M(par(a) + " + " + -b) + " = ?", a - b, M(a - b) + ".")], traps: [TR(a + b, "« − (" + b + ") » devient « + " + -b + " »."), TR(-(a - b), "Vérifie le signe du résultat.")] }); },
      () => { let a, b; do { a = nz(-9, 9); b = nz(-9, 9); } while ((a > 0 && b > 0) || Math.abs(a) === 1 || Math.abs(b) === 1); const div = R.rand() < 0.5, p = a * b; // au moins un négatif, pas de facteur ±1 (21.11)
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
      () => { let ns, ops; do { ns = [nz(-9, 9), nz(-12, 12), nz(-9, 9), nz(-12, 12)]; ops = [pk(["+", "-"]), pk(["+", "-"]), pk(["+", "-"])]; } while (ns.filter((n) => n < 0).length < 2 || !ops.some((o, i) => o === "-" && ns[i + 1] < 0)); const v = ns.reduce((s, n, i) => (i ? (ops[i - 1] === "+" ? s + n : s - n) : n), 0);
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
      // 21.11 (niveau 2 relevé pour la 11e) : puissances et priorités mêlées.
      () => { const a = pk([2, 3]), n = pk([2, 3]), b = nz(-5, 5), c = -R.int(2, 6), k = pk([3, 5]), t1 = (-a) ** n, t2 = b * c, t3 = (-1) ** k, v = t1 - t2 + t3;
        return Qv("Calcule : " + M("(-" + a + ")^" + n + " - " + par(b) + " \\cdot " + par(c) + " + (-1)^" + k), v,
          M("(-" + a + ")^" + n + " = " + t1) + ", " + M(par(b) + " \\cdot " + par(c) + " = " + t2) + ", " + M("(-1)^" + k + " = " + t3) + " ; " + M(t1 + " - " + par(t2) + " + " + par(t3) + " = " + v) + ".",
          { ctx: "puiss-prio", guide: [GS(M("(-" + a + ")^" + n) + " = ?", t1, M(t1) + (n % 2 ? " (exposant impair : négatif)." : " (exposant pair : positif).")), GS(M(par(b) + " \\cdot " + par(c)) + " = ?", t2, M(t2) + "."), GS("Résultat ?", v, M(v) + ".")],
            traps: [TR(-(a ** n) - t2 + t3, "(−" + a + ")^" + n + " : les parenthèses comptent."), TR(t1 + t2 + t3, "Soustraire " + par(t2) + " : attention au signe."), TR(t1 - t2 - t3, "(−1)^" + k + " = −1 (exposant impair).")] }); },
      // Crochets : −[a − (b − c) · d] + e
      () => { const a = nz(-6, 6), b = R.int(1, 6), c = R.int(7, 12), d = pk([2, 3, -2]), e = nz(-9, 9), in1 = b - c, in2 = a - in1 * d, v = -in2 + e;
        return Qv("Calcule : " + M("-[" + a + " - (" + b + " - " + c + ") \\cdot " + par(d) + "] + " + par(e)), v,
          M(b + " - " + c + " = " + in1) + " ; " + M(a + " - " + par(in1) + " \\cdot " + par(d) + " = " + a + " - " + par(in1 * d) + " = " + in2) + " ; " + M("-" + par(in2) + " + " + par(e) + " = " + v) + ".",
          { ctx: "crochets", guide: [GS("D'abord la parenthèse " + M(b + " - " + c) + " ?", in1, M(in1) + "."), GS("Puis le crochet " + M("[" + a + " - " + par(in1) + " \\cdot " + par(d) + "]") + " ?", in2, M(in2) + "."), GS("Résultat ?", v, M("-" + par(in2) + " + " + par(e) + " = " + v) + ".")],
            traps: [TR(in2 + e, "Le signe − devant le crochet change le signe de tout le crochet."), TR(-((a - in1) * d) + e, "La multiplication passe avant la soustraction dans le crochet.")] }); },
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
        return Qv("Calcule : " + M(par(A) + " : " + par(sgn[1] * b) + " \\cdot " + par(sgn[2] * c)), v, "Division et multiplication ont la même priorité : on les effectue dans l'ordre, de gauche à droite. " + M(par(A) + " : " + par(sgn[1] * b) + " = " + A / (sgn[1] * b)) + ", puis " + M(par(A / (sgn[1] * b)) + " \\cdot " + par(sgn[2] * c) + " = " + v) + ".",
          { ctx: "gauche-droite", guide: [GS("· et : ont la même priorité : on commence par la gauche. La division d'abord ?", A / (sgn[1] * b), M(A / (sgn[1] * b)) + "."), GS("Puis la multiplication ?", v, M(v) + ".")], traps: [TR(A / (sgn[1] * b * sgn[2] * c), "Multiplications et divisions : de gauche à droite."), TR(-v, "Compte les signes négatifs.")] }); },
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
      () => { const [a, b] = irrS(), [c, d] = irrS(), [e, f] = irrS(), [g, h] = irrS(), num = qs([a, b], [c, d]), den = qa([e, f], [g, h]); if (num[0] === 0) return null; const x = qd(num, den); if (Math.abs(x[0]) > 60 || Math.abs(x[1]) > 60) return null;
        return Qv("Calcule et simplifie : " + M("\\dfrac{" + fT(a, b) + " - " + fT(c, d) + "}{" + fT(e, f) + " + " + fT(g, h) + "}") + FA, qv(x), "Numérateur " + M(qT(num)) + ", dénominateur " + M(qT(den)) + " ; quotient " + M(qT(x)) + ".",
          { ctx: "fraction-etagee", guide: [GS("Numérateur" + FA + " ?", qv(num), M(qT(num)) + "."), GS("Dénominateur" + FA + " ?", qv(den), M(qT(den)) + "."), GS("Quotient" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(num, den)), "Une fraction de fractions est un quotient : multiplie par l'inverse du dénominateur.")] }); },
      () => { const [a, b] = irrS(), [c, d] = irrS(), x = qs(qm([-a, b], [-a, b]), [c, d]);
        return Qv("Calcule et simplifie : " + M("\\left(" + fT(-a, b) + "\\right)^2 - " + fT(c, d)) + FA, qv(x), M("\\left(" + fT(-a, b) + "\\right)^2 = " + fT(a * a, b * b)) + " (positif) ; puis " + M(qT(x)) + ".",
          { ctx: "carre", guide: [GS("Carré" + FA + " ?", (a * a) / (b * b), M(fT(a * a, b * b)) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qs([-a * a, b * b], [c, d])), "Le carré d'un nombre négatif est positif."), TR(qv(qs([2 * a, b], [c, d])), "Au carré, on multiplie le nombre par lui-même (pas par 2).")] }); },
      () => { const [p1, q1] = pk([[1, 3], [1, 4], [2, 5], [1, 5]]), [p2, q2] = pk([[1, 2], [1, 3], [3, 4], [2, 3]]), rest = qm(qs([1, 1], [p1, q1]), qs([1, 1], [p2, q2])), V = pk([60, 120, 240, 300]), v = qv(rest) * V; if (!Number.isInteger(v)) return null;
        return Qv("Un réservoir contient " + M(V) + " L. On utilise " + M(fT(p1, q1)) + " du contenu, puis " + M(fT(p2, q2)) + " de ce qui reste. Combien de litres reste-t-il ?", v, "Il reste " + M("\\left(1 - " + fT(p1, q1) + "\\right) \\cdot \\left(1 - " + fT(p2, q2) + "\\right) = " + qT(rest)) + " du contenu, soit " + M(v) + " L.",
          { ctx: "reservoir", guide: [GS("Fraction restante après le 1er prélèvement" + FA + " ?", 1 - p1 / q1, M(qT(qs([1, 1], [p1, q1]))) + "."), GS("Fraction finale" + FA + " ?", qv(rest), M(qT(rest)) + "."), GS("Litres restants ?", v, M(v) + " L.")], traps: [TR(V * (1 - p1 / q1 - p2 / q2), "« De ce qui reste » : la 2e fraction porte sur le reste, pas sur le tout."), TR(V * qv(qm([p1, q1], [p2, q2])), "On demande ce qui RESTE.")] }); },
    ],
  };

  // ===================== rac =====================
  const CUB = (k) => (k < 0 ? "(" + k + ")" : k) + "^3"; // 22.11 : racines cubiques en 11e (MER 11e, Nombres réels › Racines, NO89–NO97)
  const RA0 = { // 22.11 : réservoir ; réparti ci-dessous entre rac (9e-10e) et racprop (11e)
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
      () => { const k = pk([2, 3, 4, 5, 6, 7, 8, 9, 10]) * (R.rand() < 0.35 ? -1 : 1), v = k ** 3;
        return Qv("Calcule " + M("\\sqrt[3]{" + TH(v) + "}") + ".", k, M(CUB(k) + " = " + TH(v)) + ", donc " + M("\\sqrt[3]{" + TH(v) + "} = " + k) + (k < 0 ? " : la racine cubique d'un nombre négatif est négative." : "."),
          { ctx: k < 0 ? "racine-cubique-neg" : "racine-cubique", guide: [GS("Quel nombre, multiplié trois fois par lui-même, donne " + M(TH(v)) + " ? Essaie " + M(Math.abs(k)) + " : " + M(Math.abs(k) + "^3") + " = ?", Math.abs(k) ** 3, M(TH(Math.abs(k) ** 3)) + "."), GS("Donc la racine cubique (attention au signe) ?", k, M(k) + ".")],
            traps: [TR(r6(v / 3), "La racine cubique n'est pas le tiers : on cherche le nombre dont le cube vaut " + TH(v) + "."), TR(-k, "Le cube garde le signe : " + M(CUB(k) + " = " + TH(v)) + ".")] }); },
      () => { const k = pk([3, 4, 5, 6, 8, 10, 12, 15, 20]), V = k ** 3, x = pk([["Une boîte cubique a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Combien mesure son arête (en cm) ?", "boite"], ["Un dé géant a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Quelle est la longueur de son arête (en cm) ?", "de"], ["Un aquarium cubique contient " + M(TH(V / 1000)) + " L quand il est plein (" + M("1\\text{ L} = 1\\,000\\text{ cm}^3") + "). Quelle est son arête intérieure (en cm) ?", "aquarium"]]);
        if (x[1] === "aquarium" && V % 1000) return RA0[1][0]();
        return Qv(x[0], k, "Arête " + M("= \\sqrt[3]{" + TH(V) + "} = " + k) + " cm, car " + M(k + "^3 = " + TH(V)) + ".",
          { ctx: "arete-" + x[1], guide: [GS("Volume en cm³ ?", V, M(TH(V)) + " cm³."), GS("Arête = racine cubique du volume :", k, M(k) + " cm.")], traps: [TR(r6(V / 3), "Le volume n'est pas trois fois l'arête : on prend la racine cubique."), TR(r6(Math.sqrt(V)), "Racine cubique, pas racine carrée : le volume est un cube.")] }); },
    ],
    2: [
      () => { const n = pk([20, 40, 70, 100, 150, 300, 500, 888, 1400, 2000, 3000]) * (R.rand() < 0.3 ? -1 : 1), lo = Math.floor(Math.cbrt(n)), lo2 = Number.isInteger(Math.cbrt(n)) ? null : lo;
        if (lo2 === null) return RA0[2][0]();
        return Qv("Sans calculatrice, " + M("\\sqrt[3]{" + TH(n) + "}") + " est compris entre deux entiers consécutifs. Donne le plus petit.", lo, M(CUB(lo) + " = " + TH(lo ** 3) + " < " + TH(n) + " < " + TH((lo + 1) ** 3) + " = " + CUB(lo + 1)) + ", donc " + M(lo + " < \\sqrt[3]{" + TH(n) + "} < " + (lo + 1)) + ".",
          { ctx: n < 0 ? "encadrer-cubique-neg" : "encadrer-cubique", guide: [GS("Le cube de " + M(lo + 1) + " ?", (lo + 1) ** 3, M(TH((lo + 1) ** 3)) + "."), GS("Le cube de " + M(lo) + " ?", lo ** 3, M(TH(lo ** 3)) + "."), GS("Plus petit entier ?", lo, M(lo) + ".")],
            traps: [TR(lo + 1, "C'est le plus grand des deux entiers."), TR(Math.floor(Math.sqrt(Math.abs(n))), "Racine cubique, pas racine carrée.")] }); },
      () => { const [c, m] = pk([[2, 3], [2, 5], [3, 2], [3, 4], [4, 2], [5, 2], [6, 5], [2, 7], [3, 5]]), n = c ** 3 * m;
        return Qv("On écrit " + M("\\sqrt[3]{" + TH(n) + "} = a\\sqrt[3]{" + m + "}") + ". Que vaut " + M("a") + " ?", c, M("\\sqrt[3]{" + TH(n) + "} = \\sqrt[3]{" + c ** 3 + " \\cdot " + m + "} = " + c + "\\sqrt[3]{" + m + "}") + ".",
          { ctx: "extraire-cubique", guide: [GS(M(TH(n) + " \\div " + m) + " ?", c ** 3, M(c ** 3) + ", un cube parfait."), GS("Racine cubique de " + M(c ** 3) + " ?", c, M(c) + ".")], traps: [TR(c ** 3, "On sort la racine cubique de " + c ** 3 + ", pas le nombre lui-même."), TR(n / m / 2, "C'est un cube, pas un carré : cherche le nombre dont le cube vaut " + c ** 3 + ".")] }); },
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
      () => { const [a, b, r] = pk([[4, 16, 4], [2, 32, 4], [9, 3, 3], [25, 5, 5], [3, 72, 6], [2, 4, 2], [4, 54, 6], [5, 200, 10]]), sw = R.rand() < 0.5;
        return Qv("Calcule " + M("\\sqrt[3]{" + (sw ? b : a) + "} \\cdot \\sqrt[3]{" + (sw ? a : b) + "}") + ".", r, M("\\sqrt[3]{" + a + " \\cdot " + b + "} = \\sqrt[3]{" + a * b + "} = " + r) + ".",
          { ctx: "produit-cubique", guide: [GS("Produit sous la racine " + M(a + " \\cdot " + b) + " ?", a * b, M(a * b) + "."), GS("Racine cubique ?", r, M(r) + " car " + M(r + "^3 = " + a * b) + ".")], traps: [TR(r6(Math.cbrt(a) + Math.cbrt(b)), "On multiplie les racines, on n'additionne pas."), TR(a * b, "N'oublie pas la racine cubique du produit.")] }); },
      () => { const s2 = R.int(3, 12), c = R.int(2, 6) * (R.rand() < 0.6 ? -1 : 1), v = s2 + c;
        if (v === 0 || v === 1) return RA0[3][RA0[3].length - 1]();
        return Qv("Calcule " + M("\\sqrt{" + s2 * s2 + "} + \\sqrt[3]{" + TH(c ** 3) + "}") + ".", v, M(s2 + (c < 0 ? " - " + -c : " + " + c) + " = " + v) + ", car " + M(CUB(c) + " = " + TH(c ** 3)) + ".",
          { ctx: "carree-cubique", guide: [GS(M("\\sqrt{" + s2 * s2 + "}") + " ?", s2, M(s2) + "."), GS(M("\\sqrt[3]{" + TH(c ** 3) + "}") + " ?", c, M(c) + "."), GS("Somme ?", v, M(v) + ".")], traps: [TR(s2 - c, "La racine cubique d'un négatif est négative : " + M("\\sqrt[3]{" + TH(c ** 3) + "} = " + c) + ".")] }); },
    ],
  };


  // 22.11 (programme, remarque de l'enseignant) : en 9e-10e, racines CARRÉES (calcul, décimaux, encadrement, côté d'un
  // carré) et calcul simple de racines cubiques (cubes parfaits positifs, arête d'un cube) ; AUCUNE propriété.
  // Les propriétés (√(a·b), √(a÷b), extraire, additionner) et les racines cubiques négatives, extractions et
  // encadrements de racines cubiques sont en 11e : notion racprop.
  const cubeSimple = () => { const k = pk([2, 3, 4, 5, 6, 10]), v = k ** 3;
    return Qv("Calcule " + M("\\sqrt[3]{" + TH(v) + "}") + ".", k, M(k + "^3 = " + TH(v)) + ", donc " + M("\\sqrt[3]{" + TH(v) + "} = " + k) + ".",
      { ctx: "racine-cubique", guide: [GS("Le cube de " + M(k) + " (" + M(k + " \\cdot " + k + " \\cdot " + k) + ") ?", v, M(TH(v)) + "."), GS("Donc la racine cubique ?", k, M(k) + ".")],
        traps: [TR(r6(v / 3), "La racine cubique n'est pas le tiers : on cherche le nombre dont le cube vaut " + TH(v) + "."), TR(r6(Math.sqrt(v)), "Racine cubique, pas racine carrée.")] }); };
  const RA = {
    1: [RA0[1][0], RA0[1][1], RA0[1][2], cubeSimple],
    2: [
      () => { const n = R.int(20, 300), f = Math.floor(Math.sqrt(n)); if (f * f === n) return RA[2][0]();
        return Qv("Sans calculatrice, " + M("\\sqrt{" + n + "}") + " est compris entre deux entiers consécutifs. Donne le plus petit.", f, M(f + "^2 = " + f * f + " < " + n + " < " + (f + 1) ** 2 + " = " + (f + 1) + "^2") + ", donc " + M(f + " < \\sqrt{" + n + "} < " + (f + 1)) + ".",
          { ctx: "encadrer", guide: [GS("Plus grand entier dont le carré est inférieur à " + M(n) + " ?", f, M(f + "^2 = " + f * f) + "."), GS("Donc le plus petit des deux entiers ?", f, M(f) + ".")], traps: [TR(f + 1, "C'est le plus grand des deux entiers."), TR(Math.round(n / 2), "La racine n'est pas la moitié.")] }); },
      () => { const s2 = R.int(6, 25), A = s2 * s2, x = pk([["Une salle carrée a une aire de " + M(A) + " m². Quel est son périmètre (en m) ?", "salle"], ["Un tapis carré mesure " + M(A) + " dm². Quelle longueur de galon faut-il pour en faire le tour (en dm) ?", "tapis"], ["Un champ carré a une aire de " + M(A) + " a (" + M("1\\text{ a} = 100\\text{ m}^2") + "). Quel est son périmètre (en m) ?", "champ"]]);
        const side = x[1] === "champ" ? s2 * 10 : s2, per = 4 * side;
        return Qv(x[0], per, "Côté " + M("= \\sqrt{" + (x[1] === "champ" ? A * 100 : A) + "} = " + side) + " ; périmètre " + M("4 \\cdot " + side + " = " + per) + ".",
          { ctx: "perimetre-" + x[1], guide: [GS("Côté (racine de l'aire) ?", side, M(side) + "."), GS("Périmètre ?", per, M(per) + ".")], traps: [TR(A / 4, "Le côté se trouve avec la racine carrée, pas en divisant l'aire par 4."), TR(side, "C'est le côté ; on demande le tour complet.")] }); },
      RA0[1][4],
    ],
    3: [
      () => { const [a, b] = pk([[2, 8], [3, 12], [4, 9], [2, 18], [5, 20], [3, 27], [4, 25], [8, 18]]), c = Math.sqrt(a * b), x = pk([["un rectangle de " + M(a) + " m sur " + M(b) + " m", "rectangle"], ["une terrasse rectangulaire de " + M(a) + " m sur " + M(b) + " m", "terrasse"]]);
        return Qv("Un carré a la même aire que " + x[0] + ". Quel est le côté du carré (en m) ?", c, "Aire " + M(a + " \\cdot " + b + " = " + a * b) + " m² ; côté " + M("\\sqrt{" + a * b + "} = " + c) + " m.",
          { ctx: "meme-aire-" + x[1], guide: [GS("Aire du rectangle ?", a * b, M(a * b) + " m²."), GS("Côté du carré (racine de l'aire) ?", c, M(c) + " m.")], traps: [TR((a + b) / 2, "La moyenne des côtés ne donne pas la même aire."), TR(a * b, "C'est l'aire ; le côté est sa racine.")] }); },
      () => { const [p1, p2, q] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
        return Qv("Deux carrés ont des côtés de " + M(p1) + " cm et " + M(p2) + " cm. Quel est le côté d'un carré dont l'aire est la somme de leurs aires (en cm) ?", q, "Aires " + M(p1 * p1 + " + " + p2 * p2 + " = " + q * q) + " cm² ; côté " + M("\\sqrt{" + q * q + "} = " + q) + " cm.",
          { ctx: "deux-carres", guide: [GS("Somme des aires ?", q * q, M(q * q) + " cm²."), GS("Côté (racine) ?", q, M(q) + " cm.")], traps: [TR(p1 + p2, "On additionne les aires, pas les côtés.")] }); },
      () => { const k = pk([3, 4, 5, 6, 10]), V = k ** 3, A = 6 * k * k;
        return Qv("Un cube a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Quelle est l'aire totale de ses six faces (en cm²) ?", A, "Arête " + M("\\sqrt[3]{" + TH(V) + "} = " + k) + " cm ; une face " + M(k + "^2 = " + k * k) + " cm² ; six faces " + M(TH(A)) + " cm².",
          { ctx: "cube-aire", guide: [GS("Arête (racine cubique du volume) ?", k, M(k) + " cm."), GS("Aire d'une face ?", k * k, M(k * k) + " cm²."), GS("Aire totale ?", A, M(TH(A)) + " cm².")], traps: [TR(k * k, "C'est une seule face : le cube en a six.")] }); },
    ],
  };
  // 11e : propriétés des racines (carrées et cubiques), MER 11e Nombres réels › Racines (NO89–NO97)
  const RP = {
    1: [RA0[1][3], RA0[2][3], RA0[3][1]],
    2: [RA0[2][2], RA0[2][4], RA0[2][1], RA0[2][0]],
    3: [RA0[3][0], RA0[3][2], RA0[3][3], RA0[3][4]],
  };

  // ===================== carres : carrés parfaits, cubes, racines exactes (20.11, révision de 10e en 11e) =====================
  const TH = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];
  const CA = {
    1: [
      () => { const k = R.int(6, 15);
        return Qv("Calcule : " + M("\\sqrt{" + k * k + "}"), k, M(k + "^2 = " + k * k) + ", donc " + M("\\sqrt{" + k * k + "} = " + k) + ".",
          { ctx: "racine", guide: [GS("Quel est le carré de " + M(k - 1) + " ?", (k - 1) ** 2, M((k - 1) ** 2) + " : trop petit."), GS("Et le carré de " + M(k) + " ?", k * k, M(k * k) + " : c'est le nombre sous la racine."), GS(M("\\sqrt{" + k * k + "}") + " = ?", k, M(k) + ".")],
            traps: [TR((k * k) / 2, "La racine carrée n'est pas la moitié : on cherche le nombre qui, multiplié par lui-même, donne " + k * k + "."), TR(k + 1, M((k + 1) + "^2 = " + (k + 1) ** 2) + ", trop grand.")] }); },
      () => { const k = R.int(11, 19);
        return Qv("Calcule de tête : " + M(k + "^2"), k * k, M(k + "^2 = " + k + " \\cdot " + k + " = " + k + " \\cdot 10 + " + k + " \\cdot " + (k - 10) + " = " + 10 * k + " + " + k * (k - 10) + " = " + k * k) + ".",
          { ctx: "carre", guide: [GS(M(k + " \\cdot 10") + " = ?", 10 * k, M(10 * k) + "."), GS(M(k + " \\cdot " + (k - 10)) + " = ?", k * (k - 10), M(k * (k - 10)) + "."), GS(M(k + "^2") + " = ?", k * k, M(10 * k + " + " + k * (k - 10) + " = " + k * k) + ".")],
            traps: [TR(2 * k, M(k + "^2") + ", c'est " + k + " · " + k + ", pas " + k + " · 2."), TR(100 + (k - 10) ** 2, "(10 + " + (k - 10) + ")² n'est pas 10² + " + (k - 10) + "² : il manque le double produit.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 10]);
        return Qv("Calcule : " + M("\\sqrt[3]{" + TH(k ** 3) + "}"), k, M(k + "^3 = " + k + " \\cdot " + k + " \\cdot " + k + " = " + TH(k ** 3)) + ", donc " + M("\\sqrt[3]{" + TH(k ** 3) + "} = " + k) + ".",
          { ctx: "cube", guide: [GS("Quel est le cube de " + M(k) + " (" + M(k + " \\cdot " + k + " \\cdot " + k) + ") ?", k ** 3, M(TH(k ** 3)) + "."), GS(M("\\sqrt[3]{" + TH(k ** 3) + "}") + " = ?", k, M(k) + ".")],
            traps: [TR(k ** 3 / 3, "La racine cubique n'est pas le tiers : on cherche le nombre dont le cube vaut " + k ** 3 + "."), TR(Math.sqrt(k ** 3), "Racine cubique, pas racine carrée.")] }); },
      () => { const k = R.int(5, 15), c = pk([["Un carré a une aire de " + M(k * k + "\\text{ cm}^2") + ". Quelle est la longueur de son côté (en cm) ?", "aire"], ["Un potager carré mesure " + M(k * k + "\\text{ m}^2") + ". Quelle longueur de clôture faut-il pour un seul de ses côtés (en m) ?", "potager"], ["On veut ranger " + M(k * k) + " chaises en un carré parfait (autant de rangées que de chaises par rangée). Combien de chaises par rangée ?", "chaises"]]);
        return Qv(c[0], k, "Côté " + M("= \\sqrt{" + k * k + "} = " + k) + " (car " + M(k + "^2 = " + k * k) + ").",
          { ctx: c[1], guide: [GS("Le côté au carré donne " + M(k * k) + " : côté " + M("= \\sqrt{" + k * k + "}") + " = ?", k, M(k) + ".")],
            traps: [TR((k * k) / 4, "On ne divise pas par 4 (ça, c'est pour le périmètre)."), TR((k * k) / 2, "La racine n'est pas la moitié.")] }); },
    ],
    2: [
      () => { const a = pk([4, 9, 16, 25, 36, 49]), b = pk([4, 9, 25, 64, 81, 100].filter((x) => x !== a)), v = Math.sqrt(a * b);
        return Qv("Calcule : " + M("\\sqrt{" + a + " \\cdot " + b + "}"), v, M("\\sqrt{" + a + " \\cdot " + b + "} = \\sqrt{" + a + "} \\cdot \\sqrt{" + b + "} = " + Math.sqrt(a) + " \\cdot " + Math.sqrt(b) + " = " + v) + ".",
          { ctx: "produit", guide: [GS(M("\\sqrt{" + a + "}") + " = ?", Math.sqrt(a), M(Math.sqrt(a)) + "."), GS(M("\\sqrt{" + b + "}") + " = ?", Math.sqrt(b), M(Math.sqrt(b)) + "."), GS("Produit ?", v, M(Math.sqrt(a) + " \\cdot " + Math.sqrt(b) + " = " + v) + ".")],
            traps: [TR(Math.sqrt(a) + Math.sqrt(b), "√(a · b) = √a · √b : on multiplie, on n'additionne pas."), TR(a * b, "N'oublie pas la racine.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 7, 8, 9, 11, 12]), big = k > 9, n = big ? k * k / 100 : k * k / 100, v = k / 10;
        return Qv("Calcule : " + M("\\sqrt{" + N(n) + "}"), v, M(N(n) + " = \\frac{" + k * k + "}{100}") + ", donc " + M("\\sqrt{" + N(n) + "} = \\frac{" + k + "}{10} = " + N(v)) + ".",
          { ctx: "decimal", guide: [GS("Écris " + M(N(n)) + " en centièmes : " + M(N(n) + " = \\frac{?}{100}") + ". Numérateur ?", k * k, M(k * k) + "."), GS(M("\\sqrt{" + k * k + "}") + " = ?", k, M(k) + "."), GS(M("\\sqrt{" + N(n) + "} = \\frac{" + k + "}{\\sqrt{100}}") + " = ?", v, M(N(v)) + ".")],
            traps: [TR(k / 100, M("\\sqrt{100} = 10") + ", pas 100 : " + M("\\sqrt{" + N(n) + "} = " + N(v)) + "."), TR(n / 2, "La racine n'est pas la moitié.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv("Calcule : " + M("\\sqrt{" + a + "^2 + " + b + "^2}"), c, M("\\sqrt{" + a * a + " + " + b * b + "} = \\sqrt{" + c * c + "} = " + c) + ".",
          { ctx: "somme-carres", guide: [GS(M(a + "^2 + " + b + "^2") + " = ?", c * c, M(a * a + " + " + b * b + " = " + c * c) + "."), GS(M("\\sqrt{" + c * c + "}") + " = ?", c, M(c) + ".")],
            traps: [TR(a + b, "√(a² + b²) ≠ a + b : on calcule d'abord la somme sous la racine."), TR(c * c, "N'oublie pas la racine.")] }); },
      () => { const [p, q] = pk([[1, 4], [4, 9], [9, 16], [1, 9], [16, 25], [4, 25], [9, 49], [25, 36]]), v = Math.sqrt(p) / Math.sqrt(q);
        return Qv("Calcule : " + M("\\sqrt{\\frac{" + p + "}{" + q + "}}") + FA + ".", v, M("\\frac{\\sqrt{" + p + "}}{\\sqrt{" + q + "}} = \\frac{" + Math.sqrt(p) + "}{" + Math.sqrt(q) + "}") + ".",
          { ctx: "fraction", canon: Math.sqrt(p) + "/" + Math.sqrt(q), guide: [GS("Racine du numérateur ?", Math.sqrt(p), M(Math.sqrt(p)) + "."), GS("Racine du dénominateur ?", Math.sqrt(q), M(Math.sqrt(q)) + "."), GS(M("\\sqrt{\\frac{" + p + "}{" + q + "}}") + " = ?", v, M("\\frac{" + Math.sqrt(p) + "}{" + Math.sqrt(q) + "}") + ".")],
            traps: [TR(p / q / 2, "La racine n'est pas la moitié."), TR(p / Math.sqrt(q), "Il faut prendre la racine du numérateur aussi.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, 4, 5]), neg = R.rand() < 0.5, dec = !neg, v = neg ? -k : k / 10, n = neg ? -(k ** 3) : (k ** 3) / 1000;
        return Qv("Calcule : " + M("\\sqrt[3]{" + N(n) + "}"), v, neg ? M("(" + -k + ")^3 = " + -(k ** 3)) + " : la racine cubique d'un nombre négatif existe, " + M("\\sqrt[3]{" + n + "} = " + -k) + "." : M(N(n) + " = \\frac{" + k ** 3 + "}{1000}") + " et " + M("\\sqrt[3]{1000} = 10") + " : " + M("\\sqrt[3]{" + N(n) + "} = " + N(v)) + ".",
          { ctx: neg ? "cube-negatif" : "cube-decimal", guide: neg ? [GS("Cube de " + M(k) + " ?", k ** 3, M(k ** 3) + "."), GS("Un cube garde le signe : " + M("(" + -k + ")^3") + " = ?", -(k ** 3), M(-(k ** 3)) + "."), GS(M("\\sqrt[3]{" + n + "}") + " = ?", v, M(v) + ".")] : [GS(M(N(n)) + " en millièmes : numérateur ?", k ** 3, M(N(n) + " = \\frac{" + k ** 3 + "}{1000}") + "."), GS(M("\\sqrt[3]{" + k ** 3 + "}") + " = ?", k, M(k) + "."), GS(M("\\sqrt[3]{" + N(n) + "}") + " = ?", v, M(N(v)) + " (car " + M("\\sqrt[3]{1000} = 10") + ").")],
            traps: neg ? [TR(k, "Le cube d'un négatif est négatif : la racine cubique de " + n + " est négative.")] : [TR(k / 100, M("\\sqrt[3]{1000} = 10") + ", donc on divise par 10."), TR(k / 1000, "La racine cubique de 1000 est 10, pas 1000.")] }); },
      () => { const n = R.int(30, 400), f = Math.floor(Math.sqrt(n)); if (f * f === n) return null; const v = (f + 1) ** 2;
        return Qv("Quel est le plus petit carré parfait strictement supérieur à " + M(n) + " ?", v, M(f + "^2 = " + f * f + " < " + n + " < " + (f + 1) + "^2 = " + v) + " : c'est " + M(v) + ".",
          { ctx: "encadrer", guide: [GS("Plus grand entier dont le carré est inférieur à " + M(n) + " ?", f, M(f + "^2 = " + f * f) + "."), GS("Carré suivant, " + M((f + 1) + "^2") + " = ?", v, M(v) + ".")],
            traps: [TR(f * f, M(f * f) + " est plus petit que " + n + "."), TR(f + 1, "On demande le carré parfait, pas sa racine.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 10]), V = k ** 3, A = 6 * k * k, c = pk([["Un dé cubique a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Quelle est l'aire totale de ses six faces (en cm²) ?", "de"], ["Une boîte cubique contient exactement " + M(TH(V) + "\\text{ cm}^3") + ". Combien de cm² de carton faut-il pour ses six faces ?", "boite"], ["Un bloc de glace cubique a un volume de " + M(TH(V) + "\\text{ dm}^3") + ". Quelle est l'aire de ses six faces (en dm²) ?", "glace"]]);
        return Qv(c[0], A, "Arête " + M("= \\sqrt[3]{" + TH(V) + "} = " + k) + " ; une face : " + M(k + "^2 = " + k * k) + " ; six faces : " + M("6 \\cdot " + k * k + " = " + A) + ".",
          { ctx: "cube-" + c[1], guide: [GS("Arête " + M("= \\sqrt[3]{" + TH(V) + "}") + " = ?", k, M(k) + "."), GS("Aire d'une face ?", k * k, M(k + "^2 = " + k * k) + "."), GS("Aire des six faces ?", A, M("6 \\cdot " + k * k + " = " + A) + ".")],
            traps: [TR(k * k, "C'est l'aire d'une seule face ; un cube en a six."), TR(V / 6, "On passe par l'arête : racine cubique du volume.")] }); },
      () => { const [a, b, v] = pk([[2, 8, 4], [3, 12, 6], [2, 18, 6], [5, 20, 10], [3, 27, 9], [2, 32, 8], [6, 24, 12]]);
        return Qv("Calcule : " + M("\\sqrt{" + a + "} \\cdot \\sqrt{" + b + "}"), v, M("\\sqrt{" + a + "} \\cdot \\sqrt{" + b + "} = \\sqrt{" + a + " \\cdot " + b + "} = \\sqrt{" + a * b + "} = " + v) + ".",
          { ctx: "produit-racines", guide: [GS("On regroupe sous une seule racine : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS(M("\\sqrt{" + a * b + "}") + " = ?", v, M(v) + ".")],
            traps: [TR(Math.sqrt(a + b), "√a · √b = √(a · b), pas √(a + b)."), TR(a * b, "N'oublie pas la racine.")] }); },
    ],
  };
  // 22.11 : en 10e, ni propriété (√a · √b, √(p ÷ q)) ni racine cubique négative ou décimale : formes retirées.
  CA[2] = [CA[2][1], CA[2][2], () => { const k = R.int(11, 30), v = k * k;
    return Qv("Quel nombre positif a pour carré " + M(TH(v)) + " ?", k, M(k + "^2 = " + TH(v)) + ", donc " + M("\\sqrt{" + TH(v) + "} = " + k) + ".",
      { ctx: "carre-3chiffres", guide: [GS("Le carré de " + M(Math.floor(k / 10) * 10) + " ?", (Math.floor(k / 10) * 10) ** 2, M((Math.floor(k / 10) * 10) ** 2) + " : on est proche."), GS("Le nombre ?", k, M(k) + ".")], traps: [TR(v / 2, "On cherche le nombre qui, multiplié par lui-même, donne " + TH(v) + ".")] }); }];
  CA[3] = [CA[3][1], CA[3][2], () => { const [a, b, c] = pk(TRIP), A = c * c;
    return Qv("Calcule " + M("\\sqrt{" + a + "^2 + " + b + "^2}") + ".", c, M(a + "^2 + " + b + "^2 = " + a * a + " + " + b * b + " = " + A) + ", et " + M("\\sqrt{" + A + "} = " + c) + ".",
      { ctx: "racine-somme", guide: [GS("Somme sous la racine ?", A, M(A) + "."), GS("Racine ?", c, M(c) + ".")], traps: [TR(a + b, "La racine d'une somme n'est pas la somme des racines.")] }); }];

  // ===================== pctvar : augmentation et diminution en pourcentage (20.11) =====================
  const PV = {
    1: [
      () => { const t = pk([5, 10, 15, 20, 25, 30, 50]), p = 20 * R.int(2, 15), inc = (p * t) / 100, v = p + inc, c = pk([["Un article coûte", "son prix augmente"], ["Un abonnement de fitness coûte", "son prix augmente"], ["Une place de concert coûte", "le prix augmente"]]);
        return Qv(c[0] + " " + M(p) + " CHF ; " + c[1] + " de " + M(t + "\\,\\%") + ". Nouveau prix (en CHF) ?", v, "Augmentation : " + M("\\frac{" + t + "}{100} \\cdot " + p + " = " + N(inc)) + " CHF ; nouveau prix " + M(p + " + " + N(inc) + " = " + N(v)) + " CHF.",
          { ctx: "hausse", guide: [GS("Montant de l'augmentation : " + M(t + "\\,\\%") + " de " + M(p) + " = ?", inc, M(N(inc)) + " CHF."), GS("Nouveau prix ?", v, M(p + " + " + N(inc) + " = " + N(v)) + " CHF.")],
            traps: [TR(inc, "C'est l'augmentation ; il faut l'ajouter au prix de départ."), TR(p + t, "On ajoute " + t + " %, pas " + t + " CHF.")] }); },
      () => { const t = pk([10, 15, 20, 25, 30, 40]), p = 20 * R.int(2, 15), red = (p * t) / 100, v = p - red, c = pk([["Un jean à", "est soldé"], ["Un vélo à", "bénéficie d'une réduction"], ["Une console à", "est en promotion"]]);
        return Qv(c[0] + " " + M(p) + " CHF " + c[1] + " de " + M(t + "\\,\\%") + ". Combien le paie-t-on (en CHF) ?", v, "Réduction : " + M("\\frac{" + t + "}{100} \\cdot " + p + " = " + N(red)) + " CHF ; prix " + M(p + " - " + N(red) + " = " + N(v)) + " CHF.",
          { ctx: "baisse", guide: [GS("Montant de la réduction ?", red, M(N(red)) + " CHF."), GS("Prix payé ?", v, M(p + " - " + N(red) + " = " + N(v)) + " CHF.")],
            traps: [TR(red, "C'est la réduction ; il faut la retirer du prix."), TR(p - t, "On retire " + t + " %, pas " + t + " CHF.")] }); },
      () => { const t = pk([3, 5, 8, 12, 15, 20, 25, 40, 60]), up = R.rand() < 0.5, v = 1 + (up ? t : -t) / 100;
        return Qv((up ? "Augmenter" : "Diminuer") + " une quantité de " + M(t + "\\,\\%") + " revient à la multiplier par quel nombre ?", v, M("100\\,\\% " + (up ? "+ " : "- ") + t + "\\,\\% = " + (100 + (up ? t : -t)) + "\\,\\%") + ", soit " + M(N(v)) + ".",
          { ctx: "coefficient", guide: [GS("On garde 100 % de la quantité, " + (up ? "plus" : "moins") + " " + M(t + "\\,\\%") + " : combien de % au total ?", 100 + (up ? t : -t), M(100 + (up ? t : -t) + "\\,\\%") + "."), GS("En nombre décimal (÷ 100) ?", v, M(N(v)) + ".")],
            traps: [TR(t / 100, "Multiplier par " + N(t / 100) + " donnerait seulement le montant de la variation."), TR(1 + (up ? -t : t) / 100, up ? "Augmenter : le coefficient est plus grand que 1." : "Diminuer : le coefficient est plus petit que 1.")] }); },
    ],
    2: [
      () => { const a = 20 * R.int(2, 15), t = pk([-40, -25, -20, -10, 10, 15, 20, 25, 50, 75]), b = (a * (100 + t)) / 100, c = pk(["Le prix d'un article passe", "Le nombre d'abonnés d'une chaîne passe", "La fréquentation d'une piscine passe"]);
        return Qv(c + " de " + M(a) + " à " + M(N(b)) + ". Quel est le pourcentage de variation ? (Réponds par un nombre, négatif pour une baisse.)", t, "Variation : " + M(N(b) + " - " + a + " = " + N(b - a)) + " ; " + M("\\frac{" + N(b - a) + "}{" + a + "} = " + N(t / 100)) + ", soit " + M(t + "\\,\\%") + ".",
          { ctx: "taux", guide: [GS("Variation (arrivée − départ) ?", b - a, M(N(b - a)) + "."), GS("On divise par la valeur de départ " + M(a) + " : ?", t / 100, M(N(t / 100)) + "."), GS("En pour cent ?", t, M(t + "\\,\\%") + ".")],
            traps: [TR(r6(((b - a) / b) * 100), "Le pourcentage se calcule sur la valeur de DÉPART, pas d'arrivée."), TR(-t, "Attention au signe : " + (t > 0 ? "c'est une hausse." : "c'est une baisse."))] }); },
      () => { const t = pk([10, 20, 25, 50, 60, 5]), p = 20 * R.int(2, 12), np = r6(p * (1 + t / 100));
        return Qv("Après une augmentation de " + M(t + "\\,\\%") + ", un article coûte " + M(N(np)) + " CHF. Quel était son prix avant (en CHF) ?", p, "Le prix a été multiplié par " + M(N(1 + t / 100)) + " ; on divise : " + M(N(np) + " \\div " + N(1 + t / 100) + " = " + p) + " CHF.",
          { ctx: "avant-hausse", guide: [GS("Par quel nombre le prix de départ a-t-il été multiplié ?", 1 + t / 100, M(N(1 + t / 100)) + "."), GS("Prix de départ " + M("= " + N(np) + " \\div " + N(1 + t / 100)) + " = ?", p, M(p) + " CHF.")],
            traps: [TR(r6(np * (1 - t / 100)), "On ne retire pas " + t + " % du nouveau prix : la hausse portait sur l'ancien."), TR(r6(np - t), "Ce sont des pourcents, pas des francs.")] }); },
      () => { const c = pk([["Un loyer mensuel de", "augmente de", 1, [1200, 1500, 1800, 2000, 2400]], ["Un salaire mensuel de", "augmente de", 1, [4000, 4500, 5000, 6000]], ["La facture d'électricité annuelle de", "baisse de", -1, [800, 900, 1200, 1500]]]), p = pk(c[3]), t = pk([2, 3, 4, 5, 8]), v = r6(p * (1 + (c[2] * t) / 100));
        return Qv(c[0] + " " + M(TH(p)) + " CHF " + c[1] + " " + M(t + "\\,\\%") + ". Nouveau montant (en CHF) ?", v, M(TH(p) + " \\cdot " + N(1 + (c[2] * t) / 100) + " = " + TH(v)) + " CHF.",
          { ctx: "quotidien", guide: [GS("Coefficient multiplicateur ?", 1 + (c[2] * t) / 100, M(N(1 + (c[2] * t) / 100)) + "."), GS("Nouveau montant ?", v, M(TH(p) + " \\cdot " + N(1 + (c[2] * t) / 100) + " = " + TH(v)) + " CHF.")],
            traps: [TR(r6((p * t) / 100), "C'est seulement la variation."), TR(r6(p * (1 - (c[2] * t) / 100)), c[2] > 0 ? "Le montant augmente." : "Le montant baisse.")] }); },
    ],
    3: [
      () => { const a = pk([10, 20, 25, 50]), b = pk([10, 20, 25, 40, 50]), v = r6(((1 + a / 100) * (1 - b / 100) - 1) * 100); if (v === 0 || a === b && R.rand() < 0.3) return null;
        return Qv("Un prix augmente de " + M(a + "\\,\\%") + ", puis baisse de " + M(b + "\\,\\%") + ". Quelle est la variation globale en pour cent ? (Négatif pour une baisse.)", v, "Coefficients " + M(N(1 + a / 100)) + " puis " + M(N(1 - b / 100)) + " ; " + M(N(1 + a / 100) + " \\cdot " + N(1 - b / 100) + " = " + N(r6((1 + a / 100) * (1 - b / 100)))) + ", soit " + M((v > 0 ? "+" : "") + N(v) + "\\,\\%") + ".",
          { ctx: "successives", guide: [GS("Coefficient de la hausse ?", 1 + a / 100, M(N(1 + a / 100)) + "."), GS("Coefficient de la baisse ?", 1 - b / 100, M(N(1 - b / 100)) + "."), GS("Coefficient global (produit) ?", r6((1 + a / 100) * (1 - b / 100)), M(N(r6((1 + a / 100) * (1 - b / 100)))) + "."), GS("Variation en % ?", v, M(N(v) + "\\,\\%") + ".")],
            traps: [TR(a - b, "Les pourcentages ne s'additionnent pas : la baisse porte sur le prix déjà augmenté."), TR(-v, "Attention au signe.")] }); },
      () => { const t = pk([10, 20, 25, 40]), x = 20 * R.int(3, 20), y = r6(x * (1 - t / 100));
        return Qv("Après une baisse de " + M(t + "\\,\\%") + ", un prix vaut " + M(N(y)) + " CHF. Quel était le prix de départ (en CHF) ?", x, M(N(y) + " \\div " + N(1 - t / 100) + " = " + x) + " CHF (on divise, on n'ajoute pas " + t + " %).",
          { ctx: "avant-baisse", guide: [GS("Coefficient de la baisse ?", 1 - t / 100, M(N(1 - t / 100)) + "."), GS("Prix de départ " + M("= " + N(y) + " \\div " + N(1 - t / 100)) + " = ?", x, M(x) + " CHF.")],
            traps: [TR(r6(y * (1 + t / 100)), "Ajouter " + t + " % au prix soldé ne redonne pas le prix de départ."), TR(r6(y + t), "Ce sont des pourcents, pas des francs.")] }); },
      () => { const ht = 10 * R.int(3, 60), ttc = r6(ht * 1.081), ask = pk(["ht", "tva"]), C = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", "{,}"));
        return Qv("En Suisse, la TVA normale est de " + M("8{,}1\\,\\%") + ". Un appareil coûte " + M(C(ttc)) + " CHF TVA comprise. " + (ask === "ht" ? "Quel est son prix hors taxe (en CHF) ?" : "Quel est le montant de la TVA (en CHF) ?"), ask === "ht" ? ht : r6(ttc - ht), "Prix hors taxe " + M("= " + C(ttc) + " \\div 1{,}081 = " + ht) + " CHF" + (ask === "tva" ? " ; TVA " + M("= " + C(ttc) + " - " + ht + " = " + C(r6(ttc - ht))) + " CHF" : "") + ".",
          { ctx: "tva-" + ask, guide: [GS("Coefficient de la TVA ?", 1.081, M("1 + 0{,}081 = 1{,}081") + "."), GS("Prix hors taxe ?", ht, M(C(ttc) + " \\div 1{,}081 = " + ht) + " CHF.")].concat(ask === "tva" ? [GS("Montant de la TVA ?", r6(ttc - ht), M(C(ttc) + " - " + ht + " = " + C(r6(ttc - ht))) + " CHF.")] : []),
            traps: [TR(r6(ttc * (1 - 0.081)), "Retirer 8,1 % du prix TTC ne donne pas le prix HT : la TVA est calculée sur le prix HT."), TR(r6(ttc * 0.081), "La TVA se calcule sur le prix hors taxe, pas sur le prix TTC.")] }); },
    ],
  };

  const PROBS = {
    carres: [() => P("Un carrelage carré est formé de 196 dalles carrées identiques de 30 cm de côté.", [["a) Nombre de dalles sur un côté", 14], ["b) Côté du carrelage (m)", 4.2], ["c) Aire du carrelage (m²)", 17.64]], ["√196.", "14 · 0,3 m."], "a) " + M("\\sqrt{196} = 14") + " ; b) " + M("14 \\cdot 0{,}3 = 4{,}2") + " m ; c) " + M("4{,}2^2 = 17{,}64") + " m².")],
    pctvar: [() => P("Un vélo coûte 800 CHF. Il augmente de 10 %, puis il est soldé à −20 %.", [["a) Prix après la hausse (CHF)", 880], ["b) Prix soldé (CHF)", 704], ["c) Variation globale (%, négatif pour une baisse)", -12]], ["800 · 1,1.", "880 · 0,8."], "a) 880 ; b) 704 ; c) " + M("1{,}1 \\cdot 0{,}8 = 0{,}88") + " : " + M("-12\\,\\%") + " (et non −10 %).")],
    rel: [() => P("À Genève, la température passe de −6 °C à 7 h à +9 °C à 14 h, puis baisse de 11 °C jusqu'à minuit.", [["a) Hausse entre 7 h et 14 h (°C)", 15], ["b) Température à minuit (°C)", -2], ["c) Moyenne des trois relevés (°C)", 1 / 3]], ["9 − (−6).", "9 − 11."], "a) " + M("9 - (-6) = 15") + " ; b) " + M("9 - 11 = -2") + " ; c) " + M("\\frac{-6 + 9 - 2}{3} = \\frac{1}{3}") + ".")],
    fracops: [() => P("Calcule A = 1/2 − 3/4 · 2/3 et B = (1/2 − 3/4) · 2/3 (fractions acceptées).", [["a) A", 0], ["b) B", -1 / 6], ["c) A − B", 1 / 6]], ["A : le produit d'abord.", "B : la parenthèse d'abord."], "a) " + M("\\frac{1}{2} - \\frac{1}{2} = 0") + " ; b) " + M("-\\frac{1}{4} \\cdot \\frac{2}{3} = -\\frac{1}{6}") + " ; c) " + M("\\frac{1}{6}") + ".")],
    racprop: [() => P("Un carré a une aire de 50 cm².", [["a) Son côté vaut a√2 : a ?", 5], ["b) Sa diagonale (cm)", 10], ["c) Aire du carré construit sur la diagonale (cm²)", 100]], ["√50 = √(25 · 2).", "Diagonale = côté · √2."], "a) " + M("5\\sqrt{2}") + " ; b) " + M("5\\sqrt{2} \\cdot \\sqrt{2} = 10") + " ; c) " + M("100") + ".")],
  };

  const ALL = { rel: RE, fracops: FO, rac: RA, racprop: RP, carres: CA, pctvar: PV };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    rel: "Addition : même signe → on additionne les distances ; signes contraires → on soustrait. Soustraire, c'est ajouter l'opposé. Produit : même signe → +.",
    fracops: "Signe d'abord, puis priorités : × et : avant + et −. Diviser, c'est multiplier par l'inverse. Simplifie à la fin (ou avant de multiplier).",
    rac: "La racine carrée de a est le nombre positif dont le carré vaut a : √49 = 7. Pour l'encadrer, cherche les carrés parfaits voisins : 7² = 49 < 55 < 64 = 8². La racine cubique de a est le nombre dont le cube vaut a : ∛125 = 5.",
    racprop: "√(a · b) = √a · √b et √(a ÷ b) = √a ÷ √b ; sors les carrés parfaits : √72 = √(36 · 2) = 6√2. On additionne seulement des racines semblables : 2√3 + 5√3 = 7√3. Mais √(a + b) ≠ √a + √b. Racine cubique : ∛(−8) = −2, ∛1080 = ∛(216 · 5) = 6∛5.",
    carres: "Carrés à connaître de 1 à 20 ; la racine carrée « défait » le carré, la racine cubique « défait » le cube. Attention : √(a + b) n'est pas √a + √b.",
    pctvar: "+t % : multiplier par 1 + t/100 ; −t % : par 1 − t/100. Pour revenir au départ, on divise. Variations successives : on multiplie les coefficients.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    rel: ["Additionner, soustraire, multiplier", "Priorités, puissances, écarts", "Expressions, moyennes, enchaînements"],
    fracops: ["Différence négative, produit, quotient", "Priorités, parenthèses", "Fractions étagées, carrés, problèmes"],
    rac: ["Carrés parfaits, décimaux, côté d'un carré, cubes parfaits", "Encadrer, périmètre à partir de l'aire, arête d'un cube", "Même aire, somme d'aires, aire d'un cube"],
    racprop: ["Racine cubique (aussi négative), produits, carré d'une racine", "Extraire, quotients, extraire une racine cubique, encadrer", "Sommes de racines, longueurs exactes, produits de racines cubiques, √ + ∛"],
    carres: ["Racines, carrés, cubes, côté d'un carré", "Décimaux, sommes de carrés, carrés à 3 chiffres", "Encadrer, aire d'un cube, racine d'une somme"],
    pctvar: ["Hausse, réduction, coefficient", "Taux de variation, prix avant hausse, quotidien", "Variations successives, prix avant baisse, TVA"],
  });
})();
