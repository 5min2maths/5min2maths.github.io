// Chantier 11e · 1. Nombres et opérations (17.11, demande de l'utilisateur : suivre le plan de cheminement de 11e,
// en comblant d'abord le début d'année). Une seule source pour prio, fracadd, fracmul, fracconv, puiss, sci, scicalc.
// Même standard que ch11_prop.js / ch11_litt.js : au moins 3 formes par niveau, pas à pas (guide) sur toutes les
// questions, erreurs typiques (traps), étiquette ctx ; défi = problèmes en plusieurs étapes. Formes et contextes
// modelés sur un dossier d'exercices de 11e (fractions irréductibles, puissances, notation scientifique en contexte :
// lumière, fourmis et baleine, pile de billets, globules rouges), jamais recopiés.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  const lcm = (a, b) => (a * b) / gcd2(a, b);
  // ---------- rationnels exacts [n, d] ----------
  const rq = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd2(n, d) || 1; return [n / g, d / g]; };
  const qa = (x, y) => rq(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const qs = (x, y) => qa(x, [-y[0], y[1]]);
  const qm = (x, y) => rq(x[0] * y[0], x[1] * y[1]);
  const qd = (x, y) => rq(x[0] * y[1], x[1] * y[0]);
  const qv = (x) => x[0] / x[1];
  const qT = (x) => frac(x[0], x[1]); // TeX simplifié
  const fT = (n, d) => (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; // TeX tel quel
  const fP = (n, d) => (n < 0 ? "\\left(-\\frac{" + -n + "}{" + d + "}\\right)" : "\\frac{" + n + "}{" + d + "}"); // entre parenthèses si négatif
  const sg = (n) => (n < 0 ? " - " : " + ");
  // ---------- nombres ----------
  const r12 = (v) => +(+v).toPrecision(12);
  const N = (v) => { // virgule décimale, ' pour les milliers, jamais d'écriture 1e-7
    v = r12(v); let s = Math.abs(v) < 1e-6 && v !== 0 ? Math.abs(v).toFixed(15).replace(/0+$/, "") : String(Math.abs(v));
    let [i, f] = s.split(".");
    if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}");
    return (v < 0 ? "-" : "") + i + (f ? "{,}" + f : "");
  };
  const T = (v) => M(N(v));
  const S = (m, e) => N(m) + " \\cdot 10^{" + e + "}"; // notation scientifique en TeX
  const sv = (m, e) => r12(m * 10 ** e);
  const norm = (v) => { const e = Math.floor(Math.log10(Math.abs(v)) + 1e-9); return [r12(v / 10 ** e), e]; };
  const u = (s) => "\\ \\text{" + s + "}";
  // ---------- constructeurs ----------
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => { if (!t || !isFinite(t.v) || Math.abs(t.v - value) <= 1e-9 * Math.max(1, Math.abs(value))) return false; const k = r12(t.v); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const Qv = (q, value, sol, o = {}) => {
    const spec = Object.assign({ kind: "value", value }, o.plain ? { plain: true } : {}, o.sci ? { sci: true } : {}, o.final ? { final: true } : {}, o.round ? { round: o.round } : {});
    const x = { q, spec, sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx };
    if (o.fig) x.fig = o.fig;
    if (o.sci) { const [m, e] = norm(value); x.canon = String(m).replace(".", ",") + "*10^" + e; } // réponse type (affichage, tests)
    return x;
  };
  const GSci = (ask, value, sol) => ({ ask, spec: { kind: "value", value, sci: true }, sol });
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const irr = (d, hi = 12) => { let a; do a = R.int(1, hi); while (gcd2(a, d) !== 1 || a === d); return a; }; // numérateur premier avec d
  const ne1 = (a, b) => { let v; do v = R.int(a, b); while (v === 0 || v === 1); return v; };
  const FI = "Calcule et donne le résultat sous forme de fraction irréductible : ";

  // ===================== prio : priorités des opérations =====================
  const PRIO = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
        return Qv("Calcule : " + M(a + " + " + b + " \\cdot " + c), a + b * c, M(a + " + " + b * c + " = " + (a + b * c)) + " : la multiplication passe avant l'addition.",
          { ctx: "pm", guide: [GS("D'abord la multiplication : " + M(b + " \\cdot " + c) + " = ?", b * c, M(b + " \\cdot " + c + " = " + b * c) + "."), GS("Puis l'addition : " + M(a + " + " + b * c) + " = ?", a + b * c, M(a + " + " + b * c + " = " + (a + b * c)) + ".")],
            traps: [TR((a + b) * c, "Tu as calculé de gauche à droite. La multiplication passe avant l'addition.")] }); },
      () => { let a = R.int(3, 9), b = R.int(3, 9), c = R.int(2, 9), d = R.int(2, 6); if (a * b <= c * d) [a, b, c, d] = [c + 2, d + 1, a - 1, b - 1];
        const v = a * b - c * d;
        return Qv("Calcule : " + M(a + " \\cdot " + b + " - " + c + " \\cdot " + d), v, M(a * b + " - " + c * d + " = " + v) + " : les deux produits d'abord.",
          { ctx: "2prod", guide: [GS("Premier produit : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS("Deuxième produit : " + M(c + " \\cdot " + d) + " = ?", c * d, M(c * d) + "."), GS("Soustraction : " + M(a * b + " - " + c * d) + " = ?", v, M(a * b + " - " + c * d + " = " + v) + ".")],
            traps: [TR((a * b - c) * d, "Après " + M(a * b) + ", tu as fait la soustraction avant le deuxième produit. Les deux multiplications passent avant.")] }); },
      () => { const a = R.int(15, 40), c = R.int(2, 6), k = R.int(2, 9), b = c * k;
        return Qv("Calcule : " + M(a + " - " + b + " : " + c), a - k, M(a + " - " + k + " = " + (a - k)) + " : la division passe avant la soustraction.",
          { ctx: "div", guide: [GS("D'abord la division : " + M(b + " : " + c) + " = ?", k, M(b + " : " + c + " = " + k) + "."), GS("Puis " + M(a + " - " + k) + " = ?", a - k, M(a - k) + ".")],
            traps: [TR((a - b) / c, "Tu as soustrait avant de diviser. La division passe avant la soustraction.")] }); },
      () => { const a = R.int(2, 9), b = R.int(3, 8), c = R.int(2, 9), x = pk([
          ["Léa achète " + b + " cahiers à " + c + " CHF et une gomme à " + a + " CHF.", "achat"],
          ["Au cinéma, une famille paie " + b + " billets à " + c + " CHF et un grand pop-corn à " + a + " CHF.", "cine"],
          ["Un taxi facture " + a + " CHF de prise en charge, puis " + c + " CHF par kilomètre. La course fait " + b + " km.", "taxi"]]);
        return Qv(x[0] + " Écris le calcul en une seule ligne, puis calcule le prix total (en CHF).", a + b * c, "Calcul : " + M(a + " + " + b + " \\cdot " + c + " = " + a + " + " + b * c + " = " + (a + b * c)) + " CHF.",
          { ctx: x[1], guide: [GS("Prix des " + b + " éléments au même prix : " + M(b + " \\cdot " + c) + " = ?", b * c, M(b * c) + " CHF."), GS("Ajoute les " + a + " CHF : total ?", a + b * c, M(b * c + " + " + a + " = " + (a + b * c)) + " CHF.")],
            traps: [TR(a + b + c, "On ne peut pas additionner un nombre d'objets et un prix : multiplie d'abord " + b + " par " + c + "."), TR((a + b) * c, "Seuls les " + b + " éléments coûtent " + c + " CHF chacun : " + M(a + " + " + b + " \\cdot " + c) + ".")] }); },
    ],
    2: [
      () => { const a = R.int(20, 45), b = R.int(2, 6), c = R.int(6, 9), e = R.int(1, 4), v = a - b * (c - e);
        return Qv("Calcule : " + M(a + " - " + b + " \\cdot (" + c + " - " + e + ")"), v, M(a + " - " + b + " \\cdot " + (c - e) + " = " + a + " - " + b * (c - e) + " = " + v) + ".",
          { ctx: "paren", guide: [GS("D'abord la parenthèse : " + M(c + " - " + e) + " = ?", c - e, M(c - e) + "."), GS("Puis la multiplication : " + M(b + " \\cdot " + (c - e)) + " = ?", b * (c - e), M(b * (c - e)) + "."), GS("Enfin " + M(a + " - " + b * (c - e)) + " = ?", v, M(v) + ".")],
            traps: [TR((a - b) * (c - e), "Tu as fait la soustraction avant la multiplication."), TR(a - b * c - e, "La parenthèse se calcule d'abord : " + M(b + " \\cdot (" + c + " - " + e + ")") + ", pas " + M(b + " \\cdot " + c + " - " + e) + ".")] }); },
      () => { const k = R.int(2, 6), m = R.int(2, 9), s = k * m, a = R.int(1, s - 1), b = s - a, c = R.int(k + 2, k + 9), e = c - k;
        return Qv("Calcule : " + M("\\frac{" + a + " + " + b + "}{" + c + " - " + e + "}"), m, M("\\frac{" + s + "}{" + k + "} = " + m) + " : la barre de fraction agit comme des parenthèses.",
          { ctx: "barre", guide: [GS("Le numérateur : " + M(a + " + " + b) + " = ?", s, M(s) + "."), GS("Le dénominateur : " + M(c + " - " + e) + " = ?", k, M(k) + "."), GS("Le quotient : " + M(s + " : " + k) + " = ?", m, M(m) + ".")],
            traps: [TR(a + b / c - e, "La barre de fraction groupe tout le haut et tout le bas : calcule-les d'abord, puis divise.")] }); },
      () => { const a = R.int(2, 5), c = R.int(6, 12), d = R.int(1, 5), b = R.int(c - d + 2, c - d + 9), v = a * (b - (c - d));
        return Qv("Calcule : " + M(a + " \\cdot [" + b + " - (" + c + " - " + d + ")]"), v, M(a + " \\cdot [" + b + " - " + (c - d) + "] = " + a + " \\cdot " + (b - c + d) + " = " + v) + ".",
          { ctx: "crochet", guide: [GS("La parenthèse intérieure : " + M(c + " - " + d) + " = ?", c - d, M(c - d) + "."), GS("Le crochet : " + M(b + " - " + (c - d)) + " = ?", b - c + d, M(b - c + d) + "."), GS("Le produit : " + M(a + " \\cdot " + (b - c + d)) + " = ?", v, M(v) + ".")],
            traps: [TR(a * (b - c - d), "Le « − » devant la parenthèse change le signe de " + M(d) + " : " + M(b + " - (" + c + " - " + d + ") = " + b + " - " + c + " + " + d) + "."), TR(a * b - (c - d), "Le crochet entier est multiplié par " + M(a) + ".")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 9), d = R.int(1, 9), v = -a + b * c + d;
        return Qv("Calcule : " + M("(-" + a + ") - " + b + " \\cdot (-" + c + ") + " + d), v, M("(-" + a + ") - (-" + b * c + ") + " + d + " = -" + a + " + " + b * c + " + " + d + " = " + v) + ".",
          { ctx: "rel", guide: [GS("Le produit : " + M(b + " \\cdot (-" + c + ")") + " = ?", -b * c, M(-b * c) + "."), GS(M("(-" + a + ") - (-" + b * c + ")") + " = ? (soustraire un négatif, c'est ajouter)", b * c - a, M("-" + a + " + " + b * c + " = " + (b * c - a)) + "."), GS("Ajoute " + M(d) + " : résultat ?", v, M(v) + ".")],
            traps: [TR(-a - b * c + d, "Soustraire " + M("(-" + b * c + ")") + ", c'est ajouter " + M(b * c) + "."), TR((-a - b) * -c + d, "La multiplication passe avant la soustraction.")] }); },
    ],
    3: [
      () => { const k = R.int(2, 4), b = R.int(1, 6), c = b + k, a = R.int(2 * k * k + 1, 2 * k * k + 20), v = a - 2 * k * k;
        return Qv("Calcule : " + M(a + " - 2 \\cdot (" + b + " - " + c + ")^2"), v, M(a + " - 2 \\cdot (-" + k + ")^2 = " + a + " - 2 \\cdot " + k * k + " = " + a + " - " + 2 * k * k + " = " + v) + ".",
          { ctx: "carre", guide: [GS("La parenthèse : " + M(b + " - " + c) + " = ?", -k, M(-k) + "."), GS("Son carré : " + M("(-" + k + ")^2") + " = ?", k * k, M(k * k) + " (un carré est positif)."), GS("Puis " + M(a + " - 2 \\cdot " + k * k) + " = ?", v, M(a + " - " + 2 * k * k + " = " + v) + ".")],
            traps: [TR(a - 4 * k * k, "Le carré porte seulement sur la parenthèse, pas sur le 2 : " + M("2 \\cdot " + k * k) + "."), TR((a - 2) * k * k, "La multiplication passe avant la soustraction."), TR(a + 2 * k * k, "On retire " + M("2 \\cdot " + k * k) + " : le carré est positif, mais le signe « − » devant reste.")] }); },
      () => { const a = R.int(2, 6), k = R.int(2, 3), b = R.int(1, 7), c = b + k, v = -(a * a) - k ** 3;
        return Qv("Calcule : " + M("-" + a + "^2 + (" + b + " - " + c + ")^3"), v, M("-" + a * a + " + (-" + k + ")^3 = -" + a * a + " + (-" + k ** 3 + ") = " + v) + ".",
          { ctx: "puiss", guide: [GS(M("-" + a + "^2") + " = ? (le carré ne porte que sur " + M(a) + ")", -(a * a), M(-(a * a)) + "."), GS(M("(" + b + " - " + c + ")^3 = (-" + k + ")^3") + " = ?", -(k ** 3), M(-(k ** 3)) + " (exposant impair : négatif)."), GS("Somme : " + M("-" + a * a + " + (-" + k ** 3 + ")") + " = ?", v, M(v) + ".")],
            traps: [TR(a * a - k ** 3, M("-" + a + "^2") + " vaut " + M(-(a * a)) + " : le carré ne porte que sur " + M(a) + ", pas sur le signe."), TR(-(a * a) + k ** 3, "Le cube d'un nombre négatif est négatif.")] }); },
      () => { let a, m, k, b, d, e, c; do { a = R.int(2, 6); k = pk([-5, -4, -3, -2, 2, 3, 4, 5]); m = nz(-6, 6); b = k * m - a * a; d = R.int(2, 5); e = R.int(2, 5); c = k + d * e; } while (b < 1 || b > 40 || Math.abs(m) === 1 || c < 2);
        return Qv("Calcule : " + M("\\frac{(-" + a + ")^2 + " + b + "}{" + c + " - " + d + " \\cdot " + e + "}"), m, M("\\frac{" + a * a + " + " + b + "}{" + c + " - " + d * e + "} = \\frac{" + (a * a + b) + "}{" + k + "} = " + m) + ".",
          { ctx: "frac", guide: [GS("Numérateur : " + M("(-" + a + ")^2 + " + b) + " = ?", a * a + b, M(a * a + " + " + b + " = " + (a * a + b)) + "."), GS("Dénominateur : " + M(c + " - " + d + " \\cdot " + e) + " = ?", k, M(c + " - " + d * e + " = " + k) + "."), GS("Le quotient : " + M(par(a * a + b) + " : " + par(k)) + " = ?", m, M(m) + ".")],
            traps: [TR((b - a * a) / k, M("(-" + a + ")^2") + " est positif : " + M(a * a) + "."), TR((a * a + b) / ((c - d) * e), "Au dénominateur, la multiplication passe avant la soustraction.")] }); },
      () => { const d = R.int(2, 4), e = R.int(2, 5), c = R.int(1, 9), inner = c - d * e, b = R.int(1, 8), mid = b - inner, f = R.int(2, 4), a = Math.max(2, R.int(mid * f - 15, mid * f + 15)), v = a - mid * f;
        return Qv("Calcule : " + M(a + " - [" + b + " - (" + c + " - " + d + " \\cdot " + e + ")] \\cdot " + f), v, M(a + " - [" + b + " - (" + inner + ")] \\cdot " + f + " = " + a + " - " + mid + " \\cdot " + f + " = " + v) + ".",
          { ctx: "crochet3", guide: [GS("Parenthèse : " + M(c + " - " + d + " \\cdot " + e) + " = ?", inner, M(c + " - " + d * e + " = " + inner) + "."), GS("Crochet : " + M(b + " - " + par(inner)) + " = ?", mid, M(mid) + "."), GS("Produit : " + M(par(mid) + " \\cdot " + f) + " = ?", mid * f, M(mid * f) + "."), GS("Enfin " + M(a + " - " + par(mid * f)) + " = ?", v, M(v) + ".")],
            traps: [TR((a - mid) * f, "La multiplication par " + M(f) + " passe avant la soustraction."), TR(a - (b - c - d * e) * f, "Le « − » devant la parenthèse change le signe de chaque terme.")] }); },
    ],
  };

  // ===================== fracadd : additionner et soustraire des fractions =====================
  const cop = (lo, d) => { let a; do a = R.int(lo, d - 1); while (gcd2(a, d) !== 1); return a; }; // numérateur premier avec d, 1 ≤ a < d
  const PAIRS = [[4, 6], [6, 8], [6, 9], [10, 15], [8, 12], [9, 12], [12, 18], [4, 10], [6, 10], [8, 10], [12, 16], [15, 20]];
  const TRIPLES = [[2, 3, 4], [3, 4, 6], [2, 5, 10], [4, 6, 12], [3, 5, 15], [2, 3, 8], [4, 5, 10], [3, 4, 12]];
  const addGuide = (fs, res) => { // fs : liste de [n, d] signés ; pas à pas : dénominateur commun, numérateurs, résultat
    const L = fs.reduce((l, f) => lcm(l, f[1]), 1), nums = fs.map(([n, d]) => n * (L / d)), sum = nums.reduce((s, x) => s + x, 0);
    return [GS("Plus petit dénominateur commun de " + fs.map((f) => M(f[1])).join(", ").replace(/, ([^,]*)$/, " et $1") + " ?", L, M(L) + "."),
      ...fs.length === 2 ? [GS("Numérateur de " + M(fT(...fs[0])) + " avec le dénominateur " + M(L) + " ?", nums[0], M(fT(...fs[0]) + " = " + fT(nums[0], L)) + ".")] : [],
      GS("Additionne les numérateurs (avec leurs signes) : " + M(nums.map((x, i) => (i ? sg(x) : x < 0 ? "-" : "") + Math.abs(x)).join("")) + " = ?", sum, M(sum) + ", donc " + M(fT(sum, L)) + "."),
      GS("Simplifie si possible : résultat ?", qv(res), M(fT(sum, L) + (gcd2(sum, L) > 1 ? " = " + qT(res) : "")) + ".")]; };
  const FADD = {
    1: [
      () => { const b = R.int(5, 15); let a, c; do { a = R.int(1, b - 1); c = R.int(1, b - 1); } while (a === c || a + c === b);
        const res = rq(a + c, b);
        return Qv(FI + M(fT(a, b) + " + " + fT(c, b)), qv(res), M(fT(a + c, b) + (gcd2(a + c, b) > 1 ? " = " + qT(res) : "")) + " : même dénominateur, on additionne les numérateurs.",
          { ctx: "meme", guide: [GS("Les dénominateurs sont égaux. Somme des numérateurs : " + M(a + " + " + c) + " = ?", a + c, M(fT(a + c, b)) + "."), GS("Simplifie si possible : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR((a + c) / (2 * b), "On garde le dénominateur " + M(b) + " : on n'additionne que les numérateurs.")] }); },
      () => { const b = pk([2, 3, 4, 5]), k = pk([2, 3, 4]), B = b * k, a = cop(1, b), c = cop(1, B), minus = R.rand() < 0.5;
        const res = minus ? qs([a, b], [c, B]) : qa([a, b], [c, B]);
        return Qv(FI + M(fT(a, b) + (minus ? " - " : " + ") + fT(c, B)), qv(res), M(fT(a * k, B) + (minus ? " - " : " + ") + fT(c, B) + " = " + fT(res[0] * (B / res[1]), B) + (res[1] !== B ? " = " + qT(res) : "")) + ".",
          { ctx: "multiple", guide: [GS(M(B) + " est un multiple de " + M(b) + ". Écris " + M(fT(a, b)) + " avec le dénominateur " + M(B) + " : numérateur ?", a * k, M(fT(a, b) + " = " + fT(a * k, B)) + "."), GS((minus ? "Soustrais" : "Additionne") + " les numérateurs, puis simplifie : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(minus ? (a - c) / (b - B) : (a + c) / (b + B), "On n'opère jamais sur les dénominateurs : on les rend égaux, puis on " + (minus ? "soustrait" : "additionne") + " les numérateurs."), TR(minus ? (a - c) / B : (a + c) / B, "Le dénominateur commun est bon, mais il faut aussi multiplier le numérateur de " + M(fT(a, b)) + " par " + M(k) + ".")] }); },
      () => { const n = R.int(1, 4), b = R.int(3, 9), a = cop(1, b), minus = R.rand() < 0.6, res = minus ? rq(n * b - a, b) : rq(n * b + a, b);
        return Qv(FI + M(n + (minus ? " - " : " + ") + fT(a, b)), qv(res), M(fT(n * b, b) + (minus ? " - " : " + ") + fT(a, b) + " = " + qT(res)) + ".",
          { ctx: "entier", guide: [GS("Écris " + M(n) + " comme une fraction de dénominateur " + M(b) + " : numérateur ?", n * b, M(n + " = " + fT(n * b, b)) + "."), GS("Résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(minus ? (n - a) / b : (n + a) / b, M(n) + " vaut " + M(fT(n * b, b)) + " : écris-le d'abord sur " + M(b) + ".")] }); },
      () => { let b, e, a, c; do { [b, e] = pk([[2, 3], [3, 4], [4, 6], [3, 8], [5, 10], [4, 5], [6, 8], [2, 5]]); if (R.rand() < 0.5) [b, e] = [e, b]; a = cop(1, b); c = cop(1, e); } while (a / b + c / e >= 1);
        const res = qa([a, b], [c, e]), x = pk([
          ["Pour une fête, Lina prépare les " + M(fT(a, b)) + " des sandwichs et Tom les " + M(fT(c, e)) + ". Quelle fraction des sandwichs ont-ils préparée ensemble ?", "fete"],
          ["Un réservoir est rempli aux " + M(fT(a, b)) + ". On ajoute " + M(fT(c, e)) + " du réservoir. À quelle fraction est-il rempli ?", "reservoir"],
          ["Noé fait " + M(fT(a, b)) + " de son trajet à vélo et " + M(fT(c, e)) + " en bus. Quelle fraction du trajet a-t-il faite ?", "trajet"]]);
        return Qv(x[0] + " (fraction irréductible)", qv(res), M(fT(a, b) + " + " + fT(c, e) + " = " + qT(res)) + ".", { ctx: x[1], guide: addGuide([[a, b], [c, e]], res),
          traps: [TR((a + c) / (b + e), "On n'additionne pas les dénominateurs : mets d'abord les deux fractions sur le même dénominateur.")] }); },
    ],
    2: [
      () => { const [b, e] = pk(PAIRS), a = cop(1, b), c = cop(1, e), minus = R.rand() < 0.4, res = minus ? qs([a, b], [c, e]) : qa([a, b], [c, e]), L = lcm(b, e);
        return Qv(FI + M(fT(a, b) + (minus ? " - " : " + ") + fT(c, e)), qv(res), "Dénominateur commun " + M(L) + " (et non " + M(b * e) + ") : " + M(fT(a * L / b, L) + (minus ? " - " : " + ") + fT(c * L / e, L) + " = " + qT(res)) + ".",
          { ctx: "ppcm", guide: addGuide([[a, b], [minus ? -c : c, e]], res),
            traps: [TR(minus ? (a - c) / (b - e) : (a + c) / (b + e), "On n'opère pas sur les dénominateurs : il faut un dénominateur commun."), TR(minus ? (a - c) / L : (a + c) / L, "Le dénominateur commun est bon, mais les numérateurs doivent être multipliés par le même nombre que leur dénominateur.")] }); },
      () => { let b, e, a, c; do { [b, e] = pk(PAIRS); if (R.rand() < 0.5) [b, e] = [e, b]; a = cop(1, b); c = cop(1, e); } while (a / b >= c / e);
        const res = qs([a, b], [c, e]);
        return Qv(FI + M(fT(a, b) + " - " + fT(c, e)), qv(res), M(fT(a * lcm(b, e) / b, lcm(b, e)) + " - " + fT(c * lcm(b, e) / e, lcm(b, e)) + " = " + qT(res)) + " (résultat négatif : " + M(fT(c, e)) + " est plus grand).",
          { ctx: "negatif", guide: addGuide([[a, b], [-c, e]], res),
            traps: [TR(-qv(res), "Attention au signe : " + M(fT(c, e)) + " est plus grand que " + M(fT(a, b)) + ", le résultat est négatif."), TR((a - c) / (b - e), "On n'opère pas sur les dénominateurs.")] }); },
      () => { const [b, e, h] = pk(TRIPLES), a = cop(1, b), c = cop(1, e), g = cop(1, h), res = qs(qa([a, b], [c, e]), [g, h]);
        return Qv(FI + M(fT(a, b) + " + " + fT(c, e) + " - " + fT(g, h)), qv(res), "Dénominateur commun " + M(lcm(lcm(b, e), h)) + " : " + M(qT(res)) + ".",
          { ctx: "trois", guide: addGuide([[a, b], [c, e], [-g, h]], res),
            traps: [TR((a + c - g) / (b + e + h), "On n'additionne pas les dénominateurs : il faut un dénominateur commun aux trois fractions.")] }); },
      () => { let b, e, a, c; do { [b, e] = pk([[3, 4], [4, 6], [3, 5], [5, 10], [6, 8], [4, 5], [3, 8], [2, 5], [6, 9]]); a = cop(1, b); c = cop(1, e); } while (a / b + c / e >= 0.95);
        const used = qa([a, b], [c, e]), res = qs([1, 1], used), x = pk([
          ["Sur un trajet, Mia fait " + M(fT(a, b)) + " à vélo, " + M(fT(c, e)) + " en bus et le reste à pied. Quelle fraction du trajet fait-elle à pied ?", "pied"],
          ["Une famille consacre " + M(fT(a, b)) + " de son budget au loyer et " + M(fT(c, e)) + " à la nourriture. Quelle fraction du budget reste-t-il ?", "budget"],
          ["Dans un jardin, " + M(fT(a, b)) + " de la surface est un potager et " + M(fT(c, e)) + " une pelouse. Le reste est une terrasse. Quelle fraction occupe la terrasse ?", "jardin"]]);
        return Qv(x[0] + " (fraction irréductible)", qv(res), M("1 - \\left(" + fT(a, b) + " + " + fT(c, e) + "\\right) = 1 - " + qT(used) + " = " + qT(res)) + ".",
          { ctx: x[1], guide: [GS("Fraction déjà utilisée : " + M(fT(a, b) + " + " + fT(c, e)) + " = ?", qv(used), M(qT(used)) + "."), GS("Le tout vaut 1 : reste " + M("1 - " + qT(used)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(used), "C'est la partie déjà utilisée ; on demande ce qui reste : " + M("1 - " + qT(used)) + "."), TR(1 - (a + c) / (b + e), "On n'additionne pas les dénominateurs.")] }); },
    ],
    3: [
      () => { const [b, e, h] = pk(TRIPLES), a = irr(b), c = irr(e), g = irr(h), A = -a, res = qs(qa([A, b], [c, e]), [g, h]);
        return Qv(FI + M(fT(A, b) + " + " + fT(c, e) + " - " + fT(g, h)), qv(res), "Dénominateur commun " + M(lcm(lcm(b, e), h)) + " : " + M(qT(res)) + ".",
          { ctx: "rel3", guide: addGuide([[A, b], [c, e], [-g, h]], res),
            traps: [TR(qv(qs(qa([a, b], [c, e]), [g, h])), "La première fraction est négative : son numérateur compte avec le signe « − »."), TR(-qv(res), "Vérifie le signe du résultat.")] }); },
      () => { const [b, e, h] = pk(TRIPLES), a = cop(1, b), c = cop(1, e), g = cop(1, h), inner = qs([c, e], [g, h]), res = qs([a, b], inner);
        if (inner[0] === 0) return null;
        return Qv(FI + M(fT(a, b) + " - \\left(" + fT(c, e) + " - " + fT(g, h) + "\\right)"), qv(res), M(fT(a, b) + " - " + fP(...inner) + " = " + qT(res)) + ". Le « − » devant la parenthèse change le signe de " + M(fT(g, h)) + ".",
          { ctx: "parmoins", guide: [GS("D'abord la parenthèse : " + M(fT(c, e) + " - " + fT(g, h)) + " = ?", qv(inner), M(qT(inner)) + "."), GS("Puis " + M(fT(a, b) + " - " + fP(...inner)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qs(qs([a, b], [c, e]), [g, h])), "Le « − » devant la parenthèse change le signe de chaque terme : " + M("-\\left(" + fT(c, e) + " - " + fT(g, h) + "\\right) = -" + fT(c, e) + " + " + fT(g, h)) + ".")] }); },
      () => { let b, e, a, c; do { [b, e] = pk(PAIRS); if (R.rand() < 0.5) [b, e] = [e, b]; a = cop(1, b); c = cop(1, e); } while (a / b >= c / e);
        const res = qs([c, e], [a, b]);
        return Qv("Quelle fraction faut-il ajouter à " + M(fT(a, b)) + " pour obtenir " + M(fT(c, e)) + " ? (fraction irréductible)", qv(res), M(fT(c, e) + " - " + fT(a, b) + " = " + qT(res)) + ". Vérification : " + M(fT(a, b) + " + " + qT(res) + " = " + fT(c, e)) + ".",
          { ctx: "manquant", guide: [GS("On cherche " + M("x") + " tel que " + M(fT(a, b) + " + x = " + fT(c, e)) + ". Donc " + M("x = " + fT(c, e) + " - " + fT(a, b)) + ". Dénominateur commun ?", lcm(b, e), M(lcm(b, e)) + "."), GS("Calcule " + M(fT(c, e) + " - " + fT(a, b)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(a / b + c / e, "Tu as additionné les deux fractions. On cherche l'écart entre elles : " + M(fT(c, e) + " - " + fT(a, b)) + "."), TR(-qv(res), "Dans l'ordre : on part de " + M(fT(a, b)) + " pour arriver à " + M(fT(c, e)) + " (plus grand), on ajoute donc une quantité positive.")] }); },
    ],
  };

  // ===================== fracmul : multiplier et diviser des fractions =====================
  const FMUL = {
    1: [
      () => { let a, b, c, e; do { b = R.int(3, 12); e = R.int(3, 12); a = cop(1, b); c = cop(1, e); } while (gcd2(a * c, b * e) === 1 || a * c === b * e);
        const res = rq(a * c, b * e);
        return Qv(FI + M(fT(a, b) + " \\cdot " + fT(c, e)), qv(res), M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "} = " + fT(a * c, b * e) + " = " + qT(res)) + " (on peut aussi simplifier avant de multiplier).",
          { ctx: "produit", guide: [GS("Numérateur : " + M(a + " \\cdot " + c) + " = ?", a * c, M(a * c) + "."), GS("Dénominateur : " + M(b + " \\cdot " + e) + " = ?", b * e, M(b * e) + "."), GS("Simplifie " + M(fT(a * c, b * e)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR((a * e) / (b * c), "Ça, c'est la division. Pour multiplier : numérateur fois numérateur, dénominateur fois dénominateur."), TR((a + c) / (b + e), "On multiplie les numérateurs entre eux et les dénominateurs entre eux, on n'additionne pas.")] }); },
      () => { let n, b, a; do { n = R.int(2, 12); b = R.int(3, 12); a = cop(1, b); } while (gcd2(n, b) === 1 || (n * a) % b === 0);
        const res = rq(n * a, b);
        return Qv(FI + M(n + " \\cdot " + fT(a, b)), qv(res), M(fT(n * a, b) + " = " + qT(res)) + " : seul le numérateur est multiplié par " + M(n) + ".",
          { ctx: "entierx", guide: [GS(M(n + " \\cdot " + fT(a, b) + " = \\frac{" + n + " \\cdot " + a + "}{" + b + "}") + ". Numérateur ?", n * a, M(n * a) + "."), GS("Simplifie " + M(fT(n * a, b)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(a / b, "Tu as multiplié aussi le dénominateur par " + M(n) + " : seul le numérateur l'est (" + M(n + " = " + fT(n, 1)) + ")."), TR(a / (n * b), "Multiplier par " + M(n) + " agrandit : c'est le numérateur qu'on multiplie.")] }); },
      () => { const b = pk([3, 4, 5, 6, 8, 10]), a = cop(2, b), m = R.int(3, 25), x = pk([
          ["Les " + M(fT(a, b)) + " des " + M(b * m) + " élèves d'une école mangent à la cantine. Combien d'élèves mangent à la cantine ?", "cantine", ""],
          ["Un randonneur a parcouru les " + M(fT(a, b)) + " d'un sentier de " + M(b * m) + " km. Combien de kilomètres a-t-il parcourus ?", "sentier", " km"],
          ["Sara dépense les " + M(fT(a, b)) + " de ses " + M(b * m * 10) + " CHF d'économies pour un vélo. Combien coûte le vélo (CHF) ?", "velo", " CHF"]]);
        const N0 = x[1] === "velo" ? b * m * 10 : b * m, part = N0 / b;
        return Qv(x[0], a * part, M(fT(a, b) + " \\cdot " + N(N0) + " = " + N(N0) + " : " + b + " \\cdot " + a + " = " + N(a * part)) + x[2] + ".",
          { ctx: x[1], guide: [GS("Un " + ({ 3: "tiers", 4: "quart", 5: "cinquième", 6: "sixième", 8: "huitième", 10: "dixième" })[b] + " : " + M(N(N0) + " : " + b) + " = ?", part, M(N(part)) + "."), GS("Les " + M(fT(a, b)) + " : " + M(a + " \\cdot " + N(part)) + " = ?", a * part, M(N(a * part)) + x[2] + ".")],
            traps: [TR(part, "Ça, c'est " + M(fT(1, b)) + " seulement : il faut encore multiplier par " + M(a) + "."), TR((N0 * b) / a, "Prendre les " + M(fT(a, b)) + " de " + M(N(N0)) + ", c'est " + M(N(N0) + " : " + b + " \\cdot " + a) + ".")] }); },
    ],
    2: [
      () => { let a, b, c, e; do { b = R.int(2, 10); e = R.int(2, 10); a = irr(b); c = irr(e); } while (a * e === b * c || a * c === b * e);
        const res = rq(a * e, b * c);
        return Qv(FI + M(fT(a, b) + " : " + fT(c, e)), qv(res), "Diviser, c'est multiplier par l'inverse : " + M(fT(a, b) + " \\cdot " + fT(e, c) + " = " + qT(res)) + ".",
          { ctx: "division", guide: [GS("L'inverse de " + M(fT(c, e)) + " est " + M(fT(e, c)) + ". Sa valeur ? (tape la fraction)", e / c, M(fT(e, c)) + "."), GS("Calcule " + M(fT(a, b) + " \\cdot " + fT(e, c)) + " : résultat ?", qv(res), M(fT(a * e, b * c) + (gcd2(a * e, b * c) > 1 ? " = " + qT(res) : "")) + ".")],
            traps: [TR((a * c) / (b * e), "Tu as multiplié sans inverser la deuxième fraction."), TR((b * c) / (a * e), "On inverse la deuxième fraction (le diviseur), pas la première.")] }); },
      () => { let a, b, n; do { b = R.int(2, 9); a = R.int(2, 15); n = R.int(2, 9); } while (gcd2(a, b) !== 1 || gcd2(a, n) === 1);
        const res = rq(a, b * n);
        return Qv(FI + M(fT(a, b) + " : " + n), qv(res), M(fT(a, b) + " \\cdot " + fT(1, n) + " = " + fT(a, b * n) + " = " + qT(res)) + ".",
          { ctx: "parentier", guide: [GS("Diviser par " + M(n) + ", c'est multiplier par son inverse. L'inverse de " + M(n) + " ?", 1 / n, M(fT(1, n)) + "."), GS("Calcule " + M(fT(a, b) + " \\cdot " + fT(1, n)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR((a * n) / b, "Tu as multiplié par " + M(n) + " au lieu de diviser."), TR(a / n / b * n * n, "Diviser par " + M(n) + " : le dénominateur est multiplié par " + M(n) + ".")] }); },
      () => { let a, b, c, e; do { b = R.int(2, 9); e = R.int(2, 9); a = irr(b); c = irr(e); } while (a * c === b * e || a * e === b * c);
        const div = R.rand() < 0.5, sA = -1, sC = pk([1, -1]), res = div ? qd([sA * a, b], [sC * c, e]) : qm([sA * a, b], [sC * c, e]);
        return Qv(FI + M(fP(sA * a, b) + (div ? " : " : " \\cdot ") + fP(sC * c, e)), qv(res), "Signe : " + (sC < 0 ? "deux négatifs donnent un positif" : "un seul négatif, le résultat est négatif") + ". " + M(qT(res)) + ".",
          { ctx: "signes", guide: [GS("Le signe du résultat : tape " + M("1") + " s'il est positif, " + M("-1") + " s'il est négatif.", sC < 0 ? 1 : -1, sC < 0 ? "Positif (− par − donne +)." : "Négatif (− par + donne −)."), GS("Le résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(-qv(res), "Vérifie le signe : " + (sC < 0 ? "deux facteurs négatifs donnent un résultat positif." : "un seul facteur négatif donne un résultat négatif.")), TR(div ? qv(qm([sA * a, b], [sC * c, e])) : qv(qd([sA * a, b], [sC * c, e])), div ? "Pour diviser, il faut inverser la deuxième fraction." : "Pour multiplier, on n'inverse rien.")] }); },
      () => { const [a, b] = pk([[3, 4], [1, 4], [2, 5], [3, 2], [1, 3], [3, 5], [5, 4]]), k = R.int(2, 8), N0 = a * k, x = pk([
          ["Avec " + M(N0) + " litres de jus, combien de bouteilles de " + M(fT(a, b) + u("L")) + " peut-on remplir ?", "bouteilles"],
          ["On coupe un ruban de " + M(N0) + " m en morceaux de " + M(fT(a, b) + u("m")) + ". Combien de morceaux obtient-on ?", "ruban"],
          ["Une recette demande " + M(fT(a, b)) + " de kilo de farine. Combien de recettes peut-on faire avec " + M(N0) + " kg ?", "recette"]]);
        return Qv(x[0], k * b, M(N0 + " : " + fT(a, b) + " = " + N0 + " \\cdot " + fT(b, a) + " = " + k * b) + ".",
          { ctx: x[1], guide: [GS("On cherche combien de fois " + M(fT(a, b)) + " entre dans " + M(N0) + " : c'est une division. L'inverse de " + M(fT(a, b)) + " ?", b / a, M(fT(b, a)) + "."), GS("Calcule " + M(N0 + " \\cdot " + fT(b, a)) + " = ?", k * b, M(k * b) + ".")],
            traps: [TR((N0 * a) / b, "Tu as multiplié par " + M(fT(a, b)) + " : on cherche combien de fois la portion entre dans le total, c'est une division.")] }); },
    ],
    3: [
      () => { const [b, e] = pk([[4, 3], [6, 4], [2, 5], [3, 5], [6, 9], [4, 6]]), a = cop(1, b), c = cop(1, e), g = R.int(2, 7), h = irr(g, 9), inner = qs([a, b], [c, e]);
        if (inner[0] === 0 || h === 1) return null;
        const res = qd(inner, [g, h]);
        return Qv(FI + M("\\left(" + fT(a, b) + " - " + fT(c, e) + "\\right) : " + fT(g, h)), qv(res), M(qT(inner) + " \\cdot " + fT(h, g) + " = " + qT(res)) + ".",
          { ctx: "parendiv", guide: [GS("La parenthèse : " + M(fT(a, b) + " - " + fT(c, e)) + " = ?", qv(inner), M(qT(inner)) + "."), GS("L'inverse de " + M(fT(g, h)) + " ?", h / g, M(fT(h, g)) + "."), GS("Le produit : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qm(inner, [g, h])), "Diviser par " + M(fT(g, h)) + ", c'est multiplier par son inverse " + M(fT(h, g)) + ".")] }); },
      () => { const b = R.int(2, 6), a = cop(1, b), c = R.int(1, 5), e = R.int(2, 7), g = R.int(2, 9), h = R.int(2, 9); if (gcd2(c, e) > 1 || gcd2(g, h) > 1 || c * g === e * h) return null;
        const prod = qm([c, e], [g, h]), res = qa([a, b], prod);
        return Qv(FI + M(fT(a, b) + " + " + fT(c, e) + " \\cdot " + fT(g, h)), qv(res), "La multiplication d'abord : " + M(fT(a, b) + " + " + qT(prod) + " = " + qT(res)) + ".",
          { ctx: "priofrac", guide: [GS("D'abord le produit : " + M(fT(c, e) + " \\cdot " + fT(g, h)) + " = ?", qv(prod), M(qT(prod)) + "."), GS("Puis " + M(fT(a, b) + " + " + qT(prod)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qm(qa([a, b], [c, e]), [g, h])), "La multiplication passe avant l'addition, avec des fractions aussi.")] }); },
      () => { const n = R.int(1, 3), b = R.int(2, 6), a = cop(1, b), e = R.int(2, 7), c = cop(1, e);
        const top = rq(n * b + a, b), res = qd(top, [c, e]);
        return Qv(FI + M("\\frac{" + n + " + " + fT(a, b) + "}{" + fT(c, e) + "}"), qv(res), M("\\frac{" + qT(top) + "}{" + fT(c, e) + "} = " + qT(top) + " \\cdot " + fT(e, c) + " = " + qT(res)) + ".",
          { ctx: "etagee", guide: [GS("Le numérateur : " + M(n + " + " + fT(a, b)) + " = ?", qv(top), M(qT(top)) + "."), GS("Puis on divise par " + M(fT(c, e)) + " (on multiplie par " + M(fT(e, c)) + ") : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qm(top, [c, e])), "La grande barre est une division : on multiplie par l'inverse " + M(fT(e, c)) + "."), TR(qv(qd([n + a, b], [c, e])), M(n) + " vaut " + M(fT(n * b, b)) + " : écris-le sur " + M(b) + " avant d'additionner.")] }); },
      () => { const [a, b] = pk([[2, 5], [3, 4], [2, 3], [3, 5], [5, 8]]), [c, e] = pk([[3, 4], [1, 3], [2, 5], [1, 4], [3, 8], [2, 3]]), m = pk([200, 400, 600, 1200, 2400, 3000]), N0 = b * e * m, got = N0 / b * a, spent = got / e * c;
        if (!Number.isInteger(spent)) return null;
        return Qv("Ana reçoit les " + M(fT(a, b)) + " d'un héritage de " + M(N(N0)) + " CHF. Elle en dépense les " + M(fT(c, e)) + ". Combien lui reste-t-il (CHF) ?", got - spent,
          "Elle reçoit " + M(fT(a, b) + " \\cdot " + N(N0) + " = " + N(got)) + " CHF, dépense " + M(fT(c, e) + " \\cdot " + N(got) + " = " + N(spent)) + " CHF ; il reste " + M(N(got - spent)) + " CHF.",
          { ctx: "heritage", guide: [GS("Part reçue : " + M(fT(a, b) + " \\cdot " + N(N0)) + " = ?", got, M(N(got)) + " CHF."), GS("Dépense : les " + M(fT(c, e)) + " de " + M(N(got)) + " = ?", spent, M(N(spent)) + " CHF."), GS("Reste ?", got - spent, M(N(got) + " - " + N(spent) + " = " + N(got - spent)) + " CHF.")],
            traps: [TR(spent, "C'est ce qu'elle dépense ; on demande ce qui reste."), TR(N0 * (a / b - c / e), "Les " + M(fT(c, e)) + " portent sur sa part, pas sur tout l'héritage.")] }); },
    ],
  };

  // ===================== fracconv : fraction, nombre décimal, pourcentage, nombres périodiques =====================
  const per = (s) => "0{,}\\overline{" + s + "}";
  const FCONV = {
    1: [
      () => { const [a, b] = pk([[3, 4], [1, 8], [3, 8], [7, 8], [9, 20], [13, 25], [3, 40], [17, 50], [7, 20], [11, 25], [5, 16]]);
        return Qv("Écris " + M(fT(a, b)) + " en nombre décimal.", a / b, M(a + " : " + b + " = " + N(a / b)) + ".",
          { plain: true, ctx: "f2d", guide: 100 % b === 0 ? [GS("Écris la fraction sur 100 : " + M(fT(a, b) + " = \\frac{?}{100}") + ". Numérateur ?", a * 100 / b, M(fT(a * 100 / b, 100)) + "."), GS("Écriture décimale ?", a / b, M(N(a / b)) + ".")]
            : [GS("Divise " + M(a) + " par " + M(b) + " (pose la division). Le chiffre des dixièmes ?", Math.floor(a / b * 10) % 10, "Premier chiffre après la virgule."), GS("Écriture décimale complète ?", a / b, M(N(a / b)) + ".")],
            traps: [TR(+(a + "." + b), "La barre de fraction n'est pas une virgule : " + M(fT(a, b)) + " veut dire " + M(a + " : " + b) + "."), TR(b / a, "C'est le numérateur qu'on divise par le dénominateur : " + M(a + " : " + b) + ".")] }); },
      () => { const v = pk([0.35, 0.24, 0.125, 0.4, 0.08, 0.45, 0.6, 0.375, 0.65, 1.25, 0.15, 0.025, 2.4]), s = String(v).split(".")[1].length, p = 10 ** s, n = Math.round(v * p), res = rq(n, p);
        return Qv("Écris " + T(v) + " sous forme de fraction irréductible.", v, M(N(v) + " = " + fT(n, p) + " = " + qT(res)) + ".",
          { ctx: "d2f", guide: [GS(M(N(v) + " = \\frac{?}{" + p + "}") + " (" + s + " chiffre" + (s > 1 ? "s" : "") + " après la virgule). Numérateur ?", n, M(fT(n, p)) + "."), GS("Simplifie par " + M(gcd2(n, p)) + " : fraction irréductible ?", v, M(qT(res)) + ".")],
            traps: [TR(n / 10 ** (s + 1), "Le nombre de zéros du dénominateur est le nombre de chiffres après la virgule : ici " + M(p) + ".")] }); },
      () => { const p = pk([7, 45, 120, 2.5, 3, 0.5, 150, 85, 12.5, 4]);
        return Qv("Écris " + M(N(p) + "\\,\\%") + " en nombre décimal.", p / 100, M(N(p) + "\\,\\% = \\frac{" + N(p) + "}{100} = " + N(p / 100)) + ".",
          { plain: true, ctx: "p2d", guide: [GS("Pour cent veut dire « sur 100 » : " + M(N(p) + "\\,\\% = \\frac{?}{100}") + ". Numérateur ?", p, M("\\frac{" + N(p) + "}{100}") + "."), GS("Divise par 100 : écriture décimale ?", p / 100, M(N(p) + " : 100 = " + N(p / 100)) + ".")],
            traps: [TR(p / 10, "Pour cent : on divise par 100, pas par 10."), TR(p, "Il faut diviser par 100.")] }); },
      () => { const [n, k] = pk([[20, 7], [25, 9], [40, 14], [50, 17], [20, 13], [25, 16], [40, 26], [50, 33], [80, 28]]), x = pk([
          ["Dans une classe de " + n + " élèves, " + k + " font partie d'un club de sport.", "Quel pourcentage des élèves fait partie d'un club ?", "sport"],
          ["À un test de " + n + " questions, Liam répond juste à " + k + " questions.", "Quel est son pourcentage de réponses justes ?", "test"],
          ["Un sac contient " + n + " billes, dont " + k + " rouges.", "Quel pourcentage des billes est rouge ?", "billes"]]);
        return Qv(x[0] + " " + x[1] + " (donne seulement le nombre)", k / n * 100, M(fT(k, n) + " = " + N(k / n) + " = " + N(k / n * 100) + "\\,\\%") + ".",
          { plain: true, ctx: x[2], guide: [GS("La fraction " + M(fT(k, n)) + " en nombre décimal ?", k / n, M(N(k / n)) + "."), GS("En pourcentage (multiplie par 100) ?", k / n * 100, M(N(k / n * 100) + "\\,\\%") + ".")],
            traps: [TR(k / n, "C'est l'écriture décimale ; pour un pourcentage, multiplie par 100."), TR(k, "Le nombre " + k + " n'est un pourcentage que si le total vaut 100.")] }); },
    ],
    2: [
      () => { const [a, b] = pk([[1, 8], [3, 8], [5, 8], [7, 40], [9, 40], [3, 16], [13, 40], [7, 8], [11, 20], [3, 125], [21, 25]]);
        return Qv("Écris " + M(fT(a, b)) + " en pourcentage (donne seulement le nombre).", a / b * 100, M(fT(a, b) + " = " + N(a / b) + " = " + N(a / b * 100) + "\\,\\%") + ".",
          { plain: true, ctx: "f2p", guide: [GS("Écriture décimale de " + M(fT(a, b)) + " ?", a / b, M(N(a / b)) + "."), GS("En pourcentage (multiplie par 100) ?", a / b * 100, M(N(a / b * 100) + "\\,\\%") + ".")],
            traps: [TR(a / b, "C'est l'écriture décimale ; multiplie par 100 pour le pourcentage.")] }); },
      () => { const a = pk([1, 2, 4, 5, 7, 8, 3, 6]), res = rq(a, 9);
        return Qv("Écris " + M(per(a)) + " (soit " + M("0{,}" + String(a).repeat(4) + "\\ldots") + ") sous forme de fraction irréductible.", a / 9, "Avec " + M("x = " + per(a)) + " : " + M("10x - x = " + a) + ", donc " + M("9x = " + a) + " et " + M("x = " + fT(a, 9) + (res[1] !== 9 ? " = " + qT(res) : "")) + ".",
          { ctx: "per1", guide: [GS("Pose " + M("x = 0{,}" + String(a).repeat(3) + "\\ldots") + ". Alors " + M("10x = " + a + "{,}" + String(a).repeat(3) + "\\ldots") + ". Combien vaut " + M("10x - x") + " ?", a, M("10x - x = " + a) + " : les décimales s'annulent."), GS("Donc " + M("9x = " + a) + ". Que vaut " + M("x") + " (fraction irréductible) ?", a / 9, M("x = " + qT(res)) + ".")],
            traps: [TR(a / 10, M(fT(a, 10) + " = 0{," + "}" + a) + " s'arrête après un chiffre ; " + M(per(a)) + " continue : c'est " + M(fT(a, 9)) + ".")] }); },
      () => { let f, d, p; do { f = pk([[3, 8], [2, 5], [5, 8], [3, 4], [7, 20], [9, 25], [1, 3], [2, 3]]); d = pk([0.38, 0.4, 0.62, 0.72, 0.36, 0.35, 0.3, 0.65]); p = pk([37, 41, 60, 74, 33, 66, 39]); } while (new Set([f[0] / f[1], d, p / 100]).size < 3 || [f[0] / f[1], d, p / 100].sort((x, y) => y - x)[0] - [f[0] / f[1], d, p / 100].sort((x, y) => y - x)[1] < 0.004);
        const vals = [f[0] / f[1], d, p / 100], best = Math.max(...vals), second = vals.sort((x, y) => y - x)[1];
        return Qv("Quel est le plus grand de ces nombres : " + M(fT(f[0], f[1])) + ", " + T(d) + " ou " + M(p + "\\,\\%") + " ? Donne sa valeur en nombre décimal" + (f[1] === 3 ? " (arrondie au millième s'il le faut)" : "") + ".", r12(best),
          M(fT(f[0], f[1]) + (f[1] === 3 ? " \\approx " + N(+(f[0] / f[1]).toFixed(3)) : " = " + N(f[0] / f[1]))) + ", " + M(p + "\\,\\% = " + N(p / 100)) + " : le plus grand vaut " + M(N(+best.toFixed(3))) + ".",
          { plain: true, ctx: "compare", round: f[1] === 3 && best === f[0] / f[1] ? 0.001 : undefined, guide: [GS("Écris " + M(fT(f[0], f[1])) + " en décimal" + (f[1] === 3 ? " (au millième)" : "") + ".", f[0] / f[1], M(N(+(f[0] / f[1]).toFixed(3))) + ".", f[1] === 3 ? 0.001 : undefined), GS("Écris " + M(p + "\\,\\%") + " en décimal.", p / 100, M(N(p / 100)) + "."), GS("Le plus grand des trois ?", r12(best), M(N(+best.toFixed(3))) + ".", f[1] === 3 && best === f[0] / f[1] ? 0.001 : undefined)],
            traps: [TR(r12(second), "Compare les trois écritures décimales : il y a plus grand.")] }); },
      () => { const p = pk([35, 12, 24, 36, 45, 64, 85, 4, 15, 125, 8, 140]), res = rq(p, 100), g = gcd2(p, 100);
        return Qv("Écris " + M(p + "\\,\\%") + " sous forme de fraction irréductible.", p / 100, M(p + "\\,\\% = " + fT(p, 100) + " = " + qT(res)) + " (simplifiée par " + M(g) + ").",
          { ctx: "p2f", guide: [GS(M(p + "\\,\\% = " + fT(p, 100)) + ". Par quel nombre (le plus grand possible) peut-on simplifier ?", g, "PGDC de " + M(p) + " et " + M(100) + " : " + M(g) + "."), GS("Fraction irréductible ?", p / 100, M(qT(res)) + ".")],
            traps: [TR(100 / p, "La fraction est " + M(fT(p, 100)) + " : " + M(p) + " au numérateur."), TR(p / 10, "Pour cent : sur 100.")] }); },
    ],
    3: [
      () => { const ab = pk([12, 27, 36, 45, 18, 54, 81, 15, 24, 63, 9, 72]), s = ab < 10 ? "0" + ab : String(ab), res = rq(ab, 99);
        return Qv("Écris " + M(per(s)) + " sous forme de fraction irréductible.", ab / 99, "Avec " + M("x = " + per(s)) + " : " + M("100x - x = " + ab) + ", donc " + M("x = " + fT(ab, 99) + " = " + qT(res)) + ".",
          { ctx: "per2", guide: [GS("La période a 2 chiffres : on multiplie par 100. Avec " + M("x = 0{,}" + s + s + "\\ldots") + ", combien vaut " + M("100x - x") + " ?", ab, M("100x - x = " + ab) + "."), GS("Donc " + M("99x = " + ab) + ". Que vaut " + M("x") + " (fraction irréductible) ?", ab / 99, M(qT(res)) + ".")],
            traps: [TR(ab / 100, M(fT(ab, 100)) + " s'arrête ; " + M(per(s)) + " se répète : on divise par 99."), TR(ab / 9, "La période a deux chiffres : multiplie par 100 (et non 10), d'où 99.")] }); },
      () => { const [a, b] = pk([[1, 6], [8, 3], [4, 6], [2, 3], [1, 3], [5, 8], [3, 8], [7, 2], [5, 4]]), top = 10 * a + b - a, res = rq(top, 90);
        return Qv("Écris " + M("0{," + "}" + a + "\\overline{" + b + "}") + " (soit " + M("0{,}" + a + String(b).repeat(4) + "\\ldots") + ") sous forme de fraction irréductible.", top / 90,
          "Avec " + M("x = 0{,}" + a + "\\overline{" + b + "}") + " : " + M("100x - 10x = " + (10 * a + b) + " - " + a + " = " + top) + ", donc " + M("90x = " + top) + " et " + M("x = " + qT(res)) + ".",
          { ctx: "permixte", guide: [GS(M("10x = " + a + "{,}" + String(b).repeat(3) + "\\ldots") + " et " + M("100x = " + (10 * a + b) + "{,}" + String(b).repeat(3) + "\\ldots") + ". Combien vaut " + M("100x - 10x") + " ?", top, M((10 * a + b) + " - " + a + " = " + top) + "."), GS("Donc " + M("90x = " + top) + ". Que vaut " + M("x") + " (fraction irréductible) ?", top / 90, M(qT(res)) + ".")],
            traps: [TR((10 * a + b) / 99, "La période ne commence pas tout de suite : le chiffre " + M(a) + " ne se répète pas."), TR((10 * a + b) / 90, "Il faut retirer la partie qui ne se répète pas : " + M((10 * a + b) + " - " + a) + ".")] }); },
      () => { const p = pk([20, 25, 40, 50, 60, 75, 30, 80]), b = pk([3, 4, 5, 7, 8, 9]), a = cop(1, b), res = qm([p, 100], [a, b]);
        return Qv("Calcule " + M(p + "\\,\\%") + " de " + M(fT(a, b)) + " (fraction irréductible).", qv(res), M(fT(p, 100) + " \\cdot " + fT(a, b) + " = " + qT(rq(p, 100)) + " \\cdot " + fT(a, b) + " = " + qT(res)) + ".",
          { ctx: "pdefrac", guide: [GS(M(p + "\\,\\%") + " en fraction irréductible ?", p / 100, M(fT(p, 100) + " = " + qT(rq(p, 100))) + "."), GS("« De » veut dire « fois » : " + M(qT(rq(p, 100)) + " \\cdot " + fT(a, b)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(p * a / b, "Il faut d'abord écrire " + M(p + "\\,\\%") + " comme " + M(fT(p, 100)) + "."), TR(a / b - p / 100, "« " + p + " % de » est une multiplication.")] }); },
      () => { const [a, b] = pk([[1, 5], [1, 4], [1, 10], [1, 2], [2, 5], [3, 10]]), p = pk([10, 20, 25, 50, 30]), k1 = 1 - a / b, k2 = 1 - p / 100, tot = r12(100 * (1 - k1 * k2));
        return Qv("Un prix baisse d'abord de " + M(fT(a, b)) + ", puis le nouveau prix baisse de " + M(p + "\\,\\%") + ". De quel pourcentage le prix a-t-il baissé en tout ? (donne seulement le nombre)", tot,
          "Il reste " + M(N(r12(k1)) + " \\cdot " + N(k2) + " = " + N(r12(k1 * k2))) + " du prix, soit une baisse de " + M(N(tot) + "\\,\\%") + " (et non " + M(N(r12(100 * a / b + p)) + "\\,\\%") + ").",
          { plain: true, ctx: "soldes", guide: [GS("Après la première baisse, quelle part du prix reste-t-il ? (décimal)", r12(k1), M("1 - " + fT(a, b) + " = " + N(r12(k1)))), GS("Après la deuxième, quelle part reste-t-il ? (" + M(N(r12(k1)) + " \\cdot " + N(k2)) + ")", r12(k1 * k2), M(N(r12(k1 * k2))) + "."), GS("Baisse totale en % ?", tot, M("1 - " + N(r12(k1 * k2)) + " = " + N(r12(1 - k1 * k2))) + ", soit " + M(N(tot) + "\\,\\%") + ".")],
            traps: [TR(r12(100 * a / b + p), "Les baisses ne s'additionnent pas : la deuxième porte sur le prix déjà baissé.")] }); },
    ],
  };

  // ===================== puiss : puissances (exposants entiers relatifs) =====================
  const B = () => pk([2, 3, 5, 7, 10, 4, 6]);
  const box = "\\square";
  const PUISS = {
    1: [
      () => { const a = B(), m = R.int(2, 6), n = R.int(2, 6);
        return Qv("Complète : " + M(a + "^{" + m + "} \\cdot " + a + "^{" + n + "} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m + n, "Même base : on additionne les exposants. " + M(a + "^{" + m + "+" + n + "} = " + a + "^{" + (m + n) + "}") + ".",
          { final: true, ctx: "prod", guide: [GS(M(a + "^{" + m + "}") + " contient " + M(m) + " facteurs " + M(a) + ", et " + M(a + "^{" + n + "}") + " en contient " + M(n) + ". Combien de facteurs " + M(a) + " en tout ?", m + n, M(m + " + " + n + " = " + (m + n)) + "."), GS("Donc l'exposant ?", m + n, M(a + "^{" + (m + n) + "}") + ".")],
            traps: [TR(m * n, "On ne multiplie pas les exposants : " + M(a + "^{" + m + "} \\cdot " + a + "^{" + n + "}") + " compte " + M(m + " + " + n) + " facteurs.")] }); },
      () => { const a = B(), m = R.int(2, 5), n = R.int(2, 4);
        return Qv("Complète : " + M("(" + a + "^{" + m + "})^{" + n + "} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m * n, "Puissance d'une puissance : on multiplie les exposants. " + M(a + "^{" + m + " \\cdot " + n + "} = " + a + "^{" + m * n + "}") + ".",
          { final: true, ctx: "pp", guide: [GS(M("(" + a + "^{" + m + "})^{" + n + "}") + " = " + M(n) + " fois le facteur " + M(a + "^{" + m + "}") + ". Combien de facteurs " + M(a) + " en tout ? (" + M(n + " \\cdot " + m) + ")", m * n, M(m * n) + "."), GS("Donc l'exposant ?", m * n, M(a + "^{" + m * n + "}") + ".")],
            traps: [TR(m + n, "Ici, on n'additionne pas : " + M(n) + " fois " + M(m) + " facteurs, c'est " + M(m + " \\cdot " + n) + ".")] }); },
      () => { const a = R.int(2, 5), n = pk([2, 3, 4]), kind = R.int(0, 1), v = kind ? (-a) ** n : -(a ** n);
        return Qv("Calcule : " + M(kind ? "(-" + a + ")^{" + n + "}" : "-" + a + "^{" + n + "}"), v, kind ? M("(-" + a + ")^{" + n + "} = " + v) + " : exposant " + (n % 2 ? "impair, résultat négatif" : "pair, résultat positif") + "." : M("-" + a + "^{" + n + "} = -(" + a + "^{" + n + "}) = " + v) + " : la puissance ne porte que sur " + M(a) + ".",
          { final: true, ctx: "signe", guide: [GS("D'abord " + M(a + "^{" + n + "}") + " = ?", a ** n, M(a ** n) + "."), GS(kind ? "Le signe : " + M(n) + " facteurs négatifs. Résultat ?" : "Le « − » devant n'est pas dans la puissance. Résultat ?", v, M(v) + ".")],
            traps: [TR(-v, kind ? "Un nombre pair de facteurs négatifs donne un résultat positif, un nombre impair un résultat négatif." : "Sans parenthèses, la puissance ne porte que sur " + M(a) + " : le signe « − » reste devant."), TR(kind ? -a * n : -(a * n), M(a + "^{" + n + "}") + " n'est pas " + M(a + " \\cdot " + n) + " : c'est " + M(a) + " multiplié " + M(n) + " fois par lui-même.")] }); },
      () => { const a = B(), n = R.int(2, 5), m = n + R.int(2, 6);
        return Qv("Complète : " + M("\\frac{" + a + "^{" + m + "}}{" + a + "^{" + n + "}} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m - n, "Quotient de même base : on soustrait les exposants. " + M(a + "^{" + m + " - " + n + "} = " + a + "^{" + (m - n) + "}") + ".",
          { final: true, ctx: "quot", guide: [GS("On simplifie " + M(n) + " facteurs " + M(a) + " en haut et en bas. Combien en reste-t-il en haut ? (" + M(m + " - " + n) + ")", m - n, M(m - n) + "."), GS("Donc l'exposant ?", m - n, M(a + "^{" + (m - n) + "}") + ".")],
            traps: [TR(m / n, "Pour un quotient, on soustrait les exposants (on ne les divise pas)."), TR(m + n, "Pour un quotient, on soustrait les exposants.")] }); },
    ],
    2: [
      () => { const a = B(), m = R.int(2, 5), n = m + R.int(2, 5);
        return Qv("Complète : " + M("\\frac{" + a + "^{" + m + "}}{" + a + "^{" + n + "}} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m - n, M(a + "^{" + m + " - " + n + "} = " + a + "^{" + (m - n) + "}") + " : il reste plus de facteurs en bas, l'exposant est négatif.",
          { final: true, ctx: "quotneg", guide: [GS("On soustrait les exposants : " + M(m + " - " + n) + " = ?", m - n, M(m - n) + "."), GS("Donc l'exposant ?", m - n, M(a + "^{" + (m - n) + "} = \\frac{1}{" + a + "^{" + (n - m) + "}}") + ".")],
            traps: [TR(n - m, "Il y a plus de facteurs au dénominateur : l'exposant est négatif (" + M(m + " - " + n) + ")."), TR(m + n, "Pour un quotient, on soustrait les exposants.")] }); },
      () => { const a = R.int(2, 5), n = pk([1, 2, 3]), v = 1 / a ** n;
        return Qv("Calcule " + M(a + "^{-" + n + "}") + " (fraction).", v, M(a + "^{-" + n + "} = \\frac{1}{" + a + "^{" + n + "}} = " + fT(1, a ** n)) + ".",
          { final: true, ctx: "negexp", guide: [GS("Un exposant négatif donne l'inverse : " + M(a + "^{-" + n + "} = \\frac{1}{" + a + "^{" + n + "}}") + ". Combien vaut " + M(a + "^{" + n + "}") + " ?", a ** n, M(a ** n) + "."), GS("Donc " + M(a + "^{-" + n + "}") + " = ?", v, M(fT(1, a ** n)) + ".")],
            traps: [TR(-(a ** n), "Un exposant négatif ne rend pas le nombre négatif : il donne l'inverse, " + M(fT(1, a ** n)) + "."), TR(-a * n, M(a + "^{-" + n + "}") + " n'est pas " + M(a + " \\cdot (-" + n + ")") + ".")] }); },
      () => { const [a, b] = pk([[2, 5], [4, 25], [5, 20], [2, 50]]), n = R.int(2, 4), v = (a * b) ** n;
        return Qv("Calcule astucieusement : " + M(a + "^{" + n + "} \\cdot " + b + "^{" + n + "}"), v, "Même exposant : " + M("(" + a + " \\cdot " + b + ")^{" + n + "} = " + a * b + "^{" + n + "} = " + N(v)) + ".",
          { final: true, ctx: "astuce", guide: [GS("Même exposant : on regroupe les bases. " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS(M(a * b + "^{" + n + "}") + " = ?", v, M(N(v)) + ".")],
            traps: [TR((a * b) ** (2 * n), "On n'additionne les exposants que si la base est la même ; ici les bases diffèrent mais les exposants sont égaux."), TR(a * b * n, M(a * b + "^{" + n + "}") + " n'est pas " + M(a * b + " \\cdot " + n) + ".")] }); },
      () => { const m = nz(-6, 7), n = nz(-6, 6), p = nz(-5, 5), e = m + n - p; if (e === 0 || e === 1) return null;
        return Qv("Complète : " + M("\\frac{10^{" + m + "} \\cdot 10^{" + n + "}}{10^{" + p + "}} = 10^{" + box + "}") + ". Quel est l'exposant ?", e, M("10^{" + m + " + (" + n + ") - (" + p + ")} = 10^{" + e + "}") + ".",
          { final: true, ctx: "dix", guide: [GS("Numérateur : " + M("10^{" + m + "} \\cdot 10^{" + n + "} = 10^{" + box + "}") + ". Exposant ?", m + n, M(m + " + (" + n + ") = " + (m + n)) + "."), GS("Divise par " + M("10^{" + p + "}") + " : exposant final ?", e, M((m + n) + " - (" + p + ") = " + e) + ".")],
            traps: [TR(m + n + p, "On divise par " + M("10^{" + p + "}") + " : on soustrait son exposant."), TR(m - n - p, "Attention aux signes : " + M(m + " + (" + n + ")") + ", puis on soustrait " + M(par(p)) + ".")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, 5, 7]), m = nz(-3, 4), n = R.int(2, 3), p = nz(-5, 5), q = nz(-5, 5), e = m * n + p - q; if (e === 0 || e === 1 || m === 1) return null;
        return Qv("Complète : " + M("\\frac{(" + a + "^{" + m + "})^{" + n + "} \\cdot " + a + "^{" + p + "}}{" + a + "^{" + q + "}} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", e,
          M(a + "^{" + m * n + "} \\cdot " + a + "^{" + p + "} : " + a + "^{" + q + "} = " + a + "^{" + (m * n) + " + (" + p + ") - (" + q + ")} = " + a + "^{" + e + "}") + ".",
          { final: true, ctx: "mix", guide: [GS(M("(" + a + "^{" + m + "})^{" + n + "} = " + a + "^{" + box + "}") + " : exposant ?", m * n, M(m + " \\cdot " + n + " = " + m * n) + "."), GS("Fois " + M(a + "^{" + p + "}") + " : exposant ?", m * n + p, M(m * n + " + (" + p + ") = " + (m * n + p)) + "."), GS("Divisé par " + M(a + "^{" + q + "}") + " : exposant final ?", e, M((m * n + p) + " - (" + q + ") = " + e) + ".")],
            traps: [TR(m + n + p - q, "Puissance d'une puissance : on multiplie les exposants (" + M(m + " \\cdot " + n) + ")."), TR(m * n + p + q, "On divise : on soustrait l'exposant du dénominateur.")] }); },
      () => { const [a, n, b, k] = pk([[2, 1, 4, 1], [2, 2, 3, 1], [3, 1, 6, 1], [2, 1, 3, 2], [5, 1, 2, 2], [4, 1, 2, 3], [3, 2, 2, 1], [10, 1, 5, 1]]), res = qa([1, a ** n], [1, b ** k]);
        return Qv(FI + M(a + "^{-" + n + "} + " + b + "^{-" + k + "}"), qv(res), M(fT(1, a ** n) + " + " + fT(1, b ** k) + " = " + qT(res)) + ".",
          { final: true, ctx: "sommeneg", guide: [GS(M(a + "^{-" + n + "}") + " = ? (fraction)", 1 / a ** n, M(fT(1, a ** n)) + "."), GS(M(b + "^{-" + k + "}") + " = ? (fraction)", 1 / b ** k, M(fT(1, b ** k)) + "."), GS("Somme ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(-(a ** n) - b ** k, "Un exposant négatif donne l'inverse, pas un nombre négatif."), TR(1 / (a ** n + b ** k), "On n'additionne pas les dénominateurs : mets les fractions au même dénominateur.")] }); },
      () => { const [a, b] = pk([[2, 3], [2, 5], [3, 5]]), n = R.int(3, 5), p = R.int(1, n - 1), q = R.int(1, n), v = a ** (n - p) * b ** (n - q); if (n - p === 1 && n - q <= 1) return null;
        return Qv("Calcule sans calculatrice : " + M("\\frac{" + a * b + "^{" + n + "}}{" + a + "^{" + p + "} \\cdot " + b + "^{" + q + "}}").replace(/\^\{1\}/g, ""), v,
          M(a * b + "^{" + n + "} = " + a + "^{" + n + "} \\cdot " + b + "^{" + n + "}") + ", donc " + M(a + "^{" + (n - p) + "} \\cdot " + b + "^{" + (n - q) + "} = " + v).replace(/\^\{1\}/g, "").replace(/ \\cdot [235]\^\{0\}/, "") + ".",
          { final: true, ctx: "decomp", guide: [GS(M(a * b + "^{" + n + "} = " + a + "^{" + n + "} \\cdot " + b + "^{" + n + "}") + ". Il reste " + M(a + "^{" + box + "}") + " : exposant ?", n - p, M(n + " - " + p + " = " + (n - p)) + "."), GS("Et " + M(b + "^{" + box + "}") + " : exposant ?", n - q, M(n + " - " + q + " = " + (n - q)) + "."), GS("Valeur ?", v, M(v) + ".")],
            traps: [TR(a * b, "Simplifie facteur par facteur : décompose " + M(a * b + "^{" + n + "}") + " en " + M(a + "^{" + n + "} \\cdot " + b + "^{" + n + "}") + "."), TR((a * b) ** (n - p - q), "Les bases " + M(a) + " et " + M(b) + " se traitent séparément.")] }); },
      () => { let a, b; do { a = R.int(2, 5); b = R.int(2, 7); } while (gcd2(a, b) !== 1 || a === b); const n = pk([2, 3]), v = b ** n / a ** n;
        return Qv("Calcule " + M("\\left(" + fT(a, b) + "\\right)^{-" + n + "}") + " (fraction).", v, "Exposant négatif : on inverse. " + M("\\left(" + fT(b, a) + "\\right)^{" + n + "} = " + fT(b ** n, a ** n)) + ".",
          { final: true, ctx: "fracneg", guide: [GS("On inverse la fraction : " + M("\\left(" + fT(a, b) + "\\right)^{-" + n + "} = \\left(" + fT(b, a) + "\\right)^{" + n + "}") + ". Numérateur " + M(b + "^{" + n + "}") + " = ?", b ** n, M(b ** n) + "."), GS("Résultat ?", v, M(fT(b ** n, a ** n)) + ".")],
            traps: [TR(a ** n / b ** n, "L'exposant négatif inverse la fraction."), TR(-(a ** n) / b ** n, "Un exposant négatif ne change pas le signe : il inverse.")] }); },
    ],
  };

  // ===================== sci : notation scientifique =====================
  const mant = () => pk([1.2, 1.5, 2.4, 3.6, 4.2, 4.5, 5.8, 6.3, 7.25, 8.1, 9.4, 2.05, 3.08, 1.75, 6.02]);
  const sciGuide = (v, m, e, what) => [
    GS("Le nombre entre 1 et 10 (on garde les chiffres significatifs" + (what ? ", " + what : "") + ") ?", m, M(N(m)) + "."),
    GS("De combien de rangs faut-il déplacer la virgule pour passer de " + M(N(m)) + " à " + M(N(v)) + " ? L'exposant (" + (e < 0 ? "négatif : le nombre est plus petit que 1" : "positif : le nombre est plus grand que 10") + ") ?", e, M("10^{" + e + "}") + "."),
    GSci("Écris le résultat en notation scientifique (par exemple " + M("4{,}5 \\cdot 10^{-3}") + ").", v, M(S(m, e)) + ".")];
  const SCI = {
    1: [
      () => { const m = mant(), e = R.int(4, 9), v = sv(m, e);
        return Qv("Écris " + T(v) + " en notation scientifique.", v, M(N(v) + " = " + S(m, e)) + ".", { sci: true, ctx: "grand", guide: sciGuide(v, m, e),
          traps: [TR(sv(m, e + 1), "Compte les rangs : de " + M(N(m)) + " à " + M(N(v)) + ", la virgule se déplace de " + M(e) + " rangs."), TR(sv(m, e - 1), "Compte les rangs : il en faut " + M(e) + "."), TR(sv(m, -e), "Le nombre est plus grand que 10 : l'exposant est positif.")] }); },
      () => { const m = mant(), e = -R.int(2, 7), v = sv(m, e);
        return Qv("Écris " + T(v) + " en notation scientifique.", v, M(N(v) + " = " + S(m, e)) + ".", { sci: true, ctx: "petit", guide: sciGuide(v, m, e),
          traps: [TR(sv(m, -e), "Le nombre est plus petit que 1 : l'exposant est négatif."), TR(sv(m, e + 1), "Compte les rangs : de " + M(N(m)) + " à " + M(N(v)) + ", la virgule se déplace de " + M(-e) + " rangs."), TR(sv(m, e - 1), "Compte les rangs : il en faut " + M(-e) + ".")] }); },
      () => { const m = mant(), e = pk([-4, -3, -2, 3, 4, 5]), v = sv(m, e);
        return Qv("Écris " + M(S(m, e)) + " en nombre décimal.", v, M(S(m, e) + " = " + N(v)) + " (virgule déplacée de " + Math.abs(e) + " rangs vers la " + (e > 0 ? "droite" : "gauche") + ").",
          { plain: true, ctx: "versdec", guide: [GS("L'exposant est " + M(e) + " : la virgule se déplace de " + M(Math.abs(e)) + " rangs vers la " + (e > 0 ? "droite (le nombre grandit)" : "gauche (le nombre devient plus petit que 1)") + ". Dans quel sens ? Tape " + M("1") + " pour la droite, " + M("-1") + " pour la gauche.", e > 0 ? 1 : -1, e > 0 ? "Vers la droite." : "Vers la gauche."), GS("Écriture décimale ?", v, M(N(v)) + ".")],
            traps: [TR(sv(m, -e), "Exposant " + (e > 0 ? "positif : le nombre est grand" : "négatif : le nombre est plus petit que 1") + "."), TR(sv(m, e > 0 ? e - 1 : e + 1), "Compte bien : " + Math.abs(e) + " rangs.")] }); },
      () => { const x = pk([
          ["La distance moyenne de la Terre au Soleil est d'environ 150 millions de km.", 1.5, 8, "km", "dist"],
          ["Un cheveu a une épaisseur d'environ " + M("0{,}00007") + " m.", 7, -5, "m", "cheveu"],
          ["Un virus de la grippe mesure environ " + M("0{,}0000001") + " m.", 1, -7, "m", "virus"],
          ["La Terre compte environ 8,1 milliards d'habitants.", 8.1, 9, "", "pop"],
          ["Une bactérie mesure environ " + M("0{,}000002") + " m.", 2, -6, "m", "bacterie"],
          ["La masse de la Lune est d'environ 73 milliards de milliards de tonnes, soit " + M("73\\text{'}000\\text{'}000\\text{'}000\\text{'}000\\text{'}000\\text{'}000") + " t.", 7.3, 19, "t", "lune"],
          ["Le cœur humain bat environ 3 milliards de fois au cours d'une vie.", 3, 9, "", "coeur"]]);
        const v = sv(x[1], x[2]);
        return Qv(x[0] + " Écris ce nombre en notation scientifique" + (x[3] ? " (en " + x[3] + ")" : "") + ".", v, M(S(x[1], x[2])) + (x[3] ? " " + x[3] : "") + ".",
          { sci: true, ctx: x[4], guide: x[0].includes("\\(") ? sciGuide(v, x[1], x[2]) : [GS("Écris d'abord ce nombre en chiffres" + (x[3] ? " (en " + x[3] + ")" : "") + ".", v, M(N(v)) + "."), ...sciGuide(v, x[1], x[2]).slice(1)],
            traps: [TR(sv(x[1], -x[2]), "Vérifie le signe de l'exposant : " + (x[2] > 0 ? "nombre plus grand que 10, exposant positif." : "nombre plus petit que 1, exposant négatif.")), TR(sv(x[1], x[2] + (x[2] > 0 ? 1 : -1)), "Compte les rangs un par un.")] }); },
    ],
    2: [
      () => { const m = mant(), sh = pk([1, 2, -1, -2, -3]), e = nz(-6, 8), shown = r12(m * 10 ** sh), e0 = e - sh, v = sv(m, e);
        if (e0 === 0 || e0 === 1) return null;
        return Qv("Écris en notation scientifique : " + M(N(shown) + " \\cdot 10^{" + e0 + "}"), v, M(N(shown) + " = " + S(m, sh)) + ", donc " + M(S(m, sh) + " \\cdot 10^{" + e0 + "} = " + S(m, e)) + ".",
          { sci: true, ctx: "renorm", guide: [GS("Écris " + M(N(shown)) + " en notation scientifique : " + M(N(m) + " \\cdot 10^{" + box + "}") + ". Exposant ?", sh, M(N(shown) + " = " + S(m, sh)) + "."), GS("Additionne les exposants : " + M(sh + " + (" + e0 + ")") + " = ?", e, M(e) + "."), GSci("Résultat en notation scientifique ?", v, M(S(m, e)) + ".")],
            traps: [TR(sv(m, e0 - sh), "Si le premier nombre devient " + (sh > 0 ? "plus petit" : "plus grand") + ", l'exposant doit " + (sh > 0 ? "augmenter" : "diminuer") + " d'autant : on additionne " + M(par(sh)) + "."), TR(sv(m, e0), "Le premier facteur a changé : il faut corriger l'exposant.")] }); },
      () => { let m1, e1, m2, e2; do { m1 = mant(); m2 = mant(); e1 = nz(-6, 9); e2 = e1 + pk([-1, 1, 0]); } while (sv(m1, e1) === sv(m2, e2));
        const a = sv(m1, e1), b = sv(m2, e2), big = Math.max(a, b), small = Math.min(a, b);
        return Qv("Quel est le plus grand nombre : " + M(S(m1, e1)) + " ou " + M(S(m2, e2)) + " ? Recopie-le.", big, "On compare d'abord les exposants" + (e1 === e2 ? " (égaux), puis les nombres devant" : "") + " : le plus grand est " + M(S(...norm(big))) + ".",
          { sci: true, ctx: "comparer", guide: [GS("Le plus grand exposant ?", Math.max(e1, e2), e1 === e2 ? "Les exposants sont égaux : on compare les nombres devant." : "Le plus grand exposant l'emporte, quel que soit le nombre devant."), GSci("Le plus grand nombre ?", big, M(S(...norm(big))) + ".")],
            traps: [TR(small, e1 === e2 ? "Même exposant : compare les nombres devant." : "C'est l'exposant qui compte d'abord : " + M("10^{" + Math.max(e1, e2) + "}") + " est " + (10 ** Math.abs(e1 - e2)) + " fois plus grand que " + M("10^{" + Math.min(e1, e2) + "}") + ".")] }); },
      () => { const x = pk([
          [R.int(15, 95) / 10, 5, "km", "m", 3, "dist-km"],
          [pk([450, 520, 680, 380, 700]), 0, "nm", "m", -9, "nm"],
          [pk([7, 12, 25, 80, 3.5]), 0, "µm", "m", -6, "um"],
          [pk([1.5, 3.2, 6.4, 2.8]), 6, "km", "m", 3, "km6"],
          [pk([2.5, 4, 7.5, 1.2, 35]), 0, "mg", "kg", -6, "mg"]]);
        const val = x[1] ? sv(x[0], x[1]) : x[0], v = r12(val * 10 ** x[4]), [mm, ee] = norm(v);
        return Qv("Convertis " + M((x[1] ? S(x[0], x[1]) : N(x[0])) + u(x[2])) + " en " + x[3] + ". Écris le résultat en notation scientifique.", v,
          M("1" + u(x[2]) + " = 10^{" + x[4] + "}" + u(x[3])) + " ; " + M((x[1] ? S(x[0], x[1]) : N(x[0])) + " \\cdot 10^{" + x[4] + "} = " + S(mm, ee)) + " " + x[3] + ".",
          { sci: true, ctx: x[5], guide: [GS("Combien de " + x[3] + " dans 1 " + x[2] + " ? Donne l'exposant de 10.", x[4], M("1" + u(x[2]) + " = 10^{" + x[4] + "}" + u(x[3])) + "."), GSci("Multiplie et écris en notation scientifique.", v, M(S(mm, ee)) + ".")],
            traps: [TR(r12(val * 10 ** -x[4]), "Tu as converti dans le mauvais sens : " + x[2] + " → " + x[3] + (x[4] > 0 ? ", le nombre grandit." : ", le nombre devient plus petit."))] }); },
    ],
    3: [
      () => { const x = pk([[2.5, "km²", "m²", 6, "km2"], [35, "mm²", "m²", -6, "mm2"], [4.2, "cm³", "m³", -6, "cm3"], [1.8, "km³", "m³", 9, "km3"], [450, "cm²", "m²", -4, "cm2"], [6, "dm³", "m³", -3, "dm3"]]), v = r12(x[0] * 10 ** x[3]), [mm, ee] = norm(v);
        return Qv("Convertis " + M(N(x[0])) + " " + x[1] + " en " + x[2] + ". Écris le résultat en notation scientifique.", v, M("1" + u(x[1].replace(/[²³]/, "")) + " = 10^{" + x[3] / (x[1].includes("³") ? 3 : 2) + "}" + u(x[2].replace(/[²³]/, ""))) + ", donc 1 " + x[1] + " " + M("= 10^{" + x[3] + "}") + " " + x[2] + " ; " + M(N(x[0]) + " \\cdot 10^{" + x[3] + "} = " + S(mm, ee)) + " " + x[2] + ".",
          { sci: true, ctx: x[4], guide: [GS("Combien de " + x[2] + " dans 1 " + x[1] + " ? Donne l'exposant de 10 (pense " + (x[1].includes("³") ? "au cube" : "au carré") + ").", x[3], M("10^{" + x[3] + "}") + " : l'exposant de la conversion des longueurs, " + (x[1].includes("³") ? "multiplié par 3." : "multiplié par 2.")), GSci("Multiplie et écris en notation scientifique.", v, M(S(mm, ee)) + ".")],
            traps: [TR(r12(x[0] * 10 ** (x[3] / (x[1].includes("³") ? 3 : 2))), "Pour des " + (x[1].includes("³") ? "volumes, l'exposant est triplé" : "aires, l'exposant est doublé") + " : 1 " + x[1] + " = " + M("10^{" + x[3] + "}") + " " + x[2] + ".")] }); },
      () => { const m1 = pk([3, 4, 5, 6, 2]), e1 = R.int(3, 6), m2 = pk([2, 1.5, 5, 4]), e2 = e1 - R.int(0, 2), v = sv(m1, e1) + sv(m2, e2), [mm, ee] = norm(v);
        return Qv("Calcule et donne le résultat en notation scientifique : " + M(S(m1, e1) + " + " + S(m2, e2)), v, "Pour additionner, on écrit les deux nombres avec la même puissance de 10 (ou en décimal) : " + M(N(sv(m1, e1)) + " + " + N(sv(m2, e2)) + " = " + N(v) + " = " + S(mm, ee)) + ".",
          { sci: true, ctx: "somme", guide: [GS("Écris " + M(S(m1, e1)) + " en nombre décimal.", sv(m1, e1), M(N(sv(m1, e1))) + "."), GS("Et " + M(S(m2, e2)) + " ?", sv(m2, e2), M(N(sv(m2, e2))) + "."), GSci("Additionne et écris en notation scientifique.", v, M(N(v) + " = " + S(mm, ee)) + ".")],
            traps: [TR(sv(m1 + m2, e1 + e2), "Pour une somme, on n'additionne pas les exposants : il faut la même puissance de 10."), TR(sv(m1 + m2, e1), "Les puissances de 10 sont différentes : on ne peut pas additionner directement les nombres devant.")] }); },
      () => { const m = pk([6, 4.5, 3, 2.4, 8, 7.2]), e = ne1(-4, 9), sh = R.int(1, 3);
        if (e - sh === 0 || e - sh === 1) return null;
        const shownM = r12(m / 10 ** sh), v = sv(m, e - sh);
        return Qv("Écris en notation scientifique : " + M(N(shownM) + " \\cdot 10^{" + e + "}"), v, M(N(shownM) + " = " + S(m, -sh)) + ", donc " + M(S(m, -sh) + " \\cdot 10^{" + e + "} = " + S(m, e - sh)) + ".",
          { sci: true, ctx: "renorm-petit", guide: [GS(M(N(shownM) + " = " + N(m) + " \\cdot 10^{" + box + "}") + " : exposant ?", -sh, M(-sh) + "."), GS("Additionne les exposants : " + M("-" + sh + " + " + e) + " = ?", e - sh, M(e - sh) + "."), GSci("Résultat ?", v, M(S(m, e - sh)) + ".")],
            traps: [TR(sv(m, e + sh), "Le premier facteur grandit (" + M(N(shownM) + " \\to " + N(m)) + ") : l'exposant doit diminuer."), TR(sv(m, e), "Le premier facteur a changé : corrige l'exposant.")] }); },
    ],
  };

  // ===================== scicalc : calculer en notation scientifique =====================
  const SC = (a, m, b, n, op) => { const v = op === "*" ? sv(a * b, m + n) : sv(a / b, m - n); return [v, ...norm(v)]; };
  const scGuide = (a, m, b, n, op, v, mm, ee) => [
    GS("Les nombres devant : " + M(N(a) + (op === "*" ? " \\cdot " : " : ") + N(b)) + " = ?", r12(op === "*" ? a * b : a / b), M(N(r12(op === "*" ? a * b : a / b))) + "."),
    GS("Les puissances de 10 : exposant de " + M("10^{" + m + "}" + (op === "*" ? " \\cdot " : " : ") + "10^{" + n + "}") + " ?", op === "*" ? m + n : m - n, M(op === "*" ? m + " + (" + n + ") = " + (m + n) : m + " - (" + n + ") = " + (m - n)) + "."),
    GSci("Écris le résultat en notation scientifique (le nombre devant entre 1 et 10).", v, M(S(mm, ee)) + ".")];
  const SCALC = {
    1: [
      () => { const [a, b] = pk([[2, 3], [2, 4], [1.5, 2], [2.5, 2], [1.2, 3], [3, 3], [1.5, 4], [2, 4.5], [1.1, 5]]), m = R.int(2, 6), n = R.int(2, 6), [v, mm, ee] = SC(a, m, b, n, "*");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") \\cdot (" + S(b, n) + ")"), v, M(N(a) + " \\cdot " + N(b) + " = " + N(r12(a * b))) + " et " + M("10^{" + m + "} \\cdot 10^{" + n + "} = 10^{" + (m + n) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "prod", guide: scGuide(a, m, b, n, "*", v, mm, ee), traps: [TR(sv(a * b, m * n), "On additionne les exposants (on ne les multiplie pas)."), TR(sv(a + b, m + n), "Les nombres devant se multiplient.")] }); },
      () => { const [a, b] = pk([[8, 2], [9, 3], [6, 4], [7.5, 2.5], [8.4, 2], [9.6, 3], [6, 1.5], [4.8, 1.6]]), m = R.int(5, 9), n = R.int(2, 4), [v, mm, ee] = SC(a, m, b, n, "/");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") : (" + S(b, n) + ")"), v, M(N(a) + " : " + N(b) + " = " + N(r12(a / b))) + " et " + M("10^{" + m + " - " + n + "} = 10^{" + (m - n) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "quot", guide: scGuide(a, m, b, n, "/", v, mm, ee), traps: [TR(sv(a / b, m + n), "Pour une division, on soustrait les exposants."), TR(sv(a / b, m / n), "On soustrait les exposants, on ne les divise pas.")] }); },
      () => { const [a, b] = pk([[4, 5], [5, 6], [2.5, 8], [6, 7], [8, 5], [4, 7.5], [3, 9], [5, 5]]), m = R.int(2, 5), n = R.int(2, 5), [v, mm, ee] = SC(a, m, b, n, "*");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") \\cdot (" + S(b, n) + ")"), v, M(N(a) + " \\cdot " + N(b) + " = " + N(r12(a * b))) + " : plus grand que 10, on le réécrit " + M(S(mm, 1)) + ", donc " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "prod-renorm", guide: scGuide(a, m, b, n, "*", v, mm, ee), traps: [TR(sv(mm, m + n), "Le produit " + M(N(r12(a * b))) + " vaut " + M(S(mm, 1)) + " : l'exposant augmente de 1.")] }); },
      () => { const x = pk([
          ["Un ordinateur effectue " + M(S(3, 9)) + " opérations par seconde. Combien d'opérations effectue-t-il en " + M(S(2, 3)) + " secondes ?", 3, 9, 2, 3, "ordi"],
          ["Un pays compte " + M(S(8, 6)) + " habitants. Chacun produit environ " + M(S(4, 2)) + " kg de déchets par an. Combien de kilos de déchets par an au total ?", 8, 6, 4, 2, "dechets"],
          ["Une colonie compte " + M(S(1.5, 4)) + " abeilles. Chacune visite environ " + M(S(2, 3)) + " fleurs par jour. Combien de fleurs sont visitées par jour ?", 1.5, 4, 2, 3, "abeilles"],
          ["Un câble de fibre optique transporte " + M(S(2.5, 9)) + " bits par seconde. Combien de bits en " + M(S(3, 2)) + " secondes ?", 2.5, 9, 3, 2, "fibre"]]);
        const [v, mm, ee] = SC(x[1], x[2], x[3], x[4], "*");
        return Qv(x[0] + " Réponds en notation scientifique.", v, M("(" + S(x[1], x[2]) + ") \\cdot (" + S(x[3], x[4]) + ") = " + S(mm, ee)) + ".",
          { sci: true, ctx: x[5], guide: scGuide(x[1], x[2], x[3], x[4], "*", v, mm, ee), traps: [TR(sv(x[1] * x[3], x[2] * x[4]), "On additionne les exposants (on ne les multiplie pas)."), TR(sv(x[1] + x[3], x[2] + x[4]), "Les nombres devant se multiplient.")] }); },
    ],
    2: [
      () => { const [a, b] = pk([[2, 3], [1.5, 4], [2.5, 3], [3, 3], [1.2, 4], [4, 2], [6, 5], [8, 2.5]]), m = ne1(-8, 5), n = nz(-6, -2), [v, mm, ee] = SC(a, m, b, n, "*");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") \\cdot (" + S(b, n) + ")"), v, M(N(r12(a * b)) + " \\cdot 10^{" + m + " + (" + n + ")} = " + S(mm, ee)) + ".",
          { sci: true, ctx: "prodneg", guide: scGuide(a, m, b, n, "*", v, mm, ee), traps: [TR(sv(r12(a * b), m - n), "Attention aux signes : " + M(m + " + (" + n + ") = " + (m + n)) + "."), TR(sv(a * b, m * n), "On additionne les exposants.")] }); },
      () => { const [a, b] = pk([[2, 5], [1.2, 4], [3, 6], [1.5, 2.5], [2.4, 8], [1, 4], [3.6, 9]]), m = R.int(2, 6), n = ne1(-4, 3), [v, mm, ee] = SC(a, m, b, n, "/");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") : (" + S(b, n) + ")"), v, M(N(a) + " : " + N(b) + " = " + N(r12(a / b))) + " (plus petit que 1, on le réécrit " + M(S(mm, -1)) + ") et " + M("10^{" + m + " - (" + n + ")} = 10^{" + (m - n) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "quot-renorm", guide: scGuide(a, m, b, n, "/", v, mm, ee), traps: [TR(sv(mm, m - n), M(N(r12(a / b))) + " est plus petit que 1 : " + M(N(r12(a / b)) + " = " + S(mm, -1)) + ", l'exposant baisse de 1."), TR(sv(a / b, m + n), "Pour une division, on soustrait les exposants.")] }); },
      () => { const a = pk([2, 3, 4, 1.5, 5, 1.2, 6]), m = ne1(-5, 6), k = 2, v = sv(a * a, 2 * m), [mm, ee] = norm(v);
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ")^{2}"), v, M(N(a) + "^2 = " + N(r12(a * a))) + " et " + M("(10^{" + m + "})^2 = 10^{" + 2 * m + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "carre", guide: [GS(M(N(a) + "^2") + " = ?", r12(a * a), M(N(r12(a * a))) + "."), GS("Exposant de " + M("(10^{" + m + "})^2") + " ?", 2 * m, M(2 * m) + "."), GSci("Résultat en notation scientifique ?", v, M(S(mm, ee)) + ".")],
            traps: [TR(sv(a * a, m + k), "Puissance d'une puissance : on multiplie l'exposant par 2."), TR(sv(2 * a, 2 * m), "Le nombre devant est aussi élevé au carré.")] }); },
      () => { const x = pk([
          ["Une feuille de papier a une épaisseur de " + M(S(1, -4)) + " m. Quelle est l'épaisseur d'une rame de " + M(S(5, 2)) + " feuilles (en m) ?", 1, -4, 5, 2, "feuille"],
          ["Un globule rouge mesure environ " + M(S(7, -6)) + " m de diamètre. On en aligne " + M(S(2.5, 13)) + " (le nombre de globules rouges d'un adulte). Quelle longueur obtient-on (en m) ?", 7, -6, 2.5, 13, "globules"],
          ["Une goutte d'eau contient environ " + M(S(1.7, 21)) + " molécules. Combien de molécules y a-t-il dans " + M(S(2, 4)) + " gouttes ?", 1.7, 21, 2, 4, "gouttes"],
          ["Un grain de sable a une masse d'environ " + M(S(6, -5)) + " kg. Quelle est la masse de " + M(S(4, 8)) + " grains (en kg) ?", 6, -5, 4, 8, "sable"]]);
        const [v, mm, ee] = SC(x[1], x[2], x[3], x[4], "*");
        return Qv(x[0] + " Réponds en notation scientifique.", v, M("(" + S(x[1], x[2]) + ") \\cdot (" + S(x[3], x[4]) + ") = " + S(mm, ee)) + ".",
          { sci: true, ctx: x[5], guide: scGuide(x[1], x[2], x[3], x[4], "*", v, mm, ee), traps: [TR(sv(x[1] * x[3], x[2] * x[4]), "On additionne les exposants."), TR(sv(x[1] / x[3], x[2] - x[4]), "Il faut multiplier : la quantité totale, c'est la valeur d'un élément fois le nombre d'éléments.")] }); },
    ],
    3: [
      () => { const x = pk([["la Terre au Soleil", 1.5, 8], ["la Terre à la Lune", 3.84, 5], ["la Terre à Mars (au plus près)", 5.4, 7], ["Jupiter au Soleil", 7.8, 8], ["la Terre à Vénus (au plus près)", 3.9, 7]]), [v, mm, ee] = SC(x[1], x[2], 3, 5, "/");
        return Qv("La lumière parcourt " + M(S(3, 5)) + " km par seconde. La distance de " + x[0] + " vaut environ " + M(S(x[1], x[2])) + " km. Combien de secondes la lumière met-elle pour la parcourir ? (notation scientifique)", v,
          "Durée = distance : vitesse = " + M("(" + S(x[1], x[2]) + ") : (" + S(3, 5) + ") = " + S(mm, ee)) + " s" + (ee >= 2 ? " (environ " + N(Math.round(v / 60)) + " min)" : "") + ".",
          { sci: true, ctx: "lumiere", guide: [GS("Durée = distance : vitesse. Les nombres devant : " + M(N(x[1]) + " : 3") + " = ?", r12(x[1] / 3), M(N(r12(x[1] / 3))) + "."), GS("Les puissances : exposant de " + M("10^{" + x[2] + "} : 10^{5}") + " ?", x[2] - 5, M(x[2] - 5) + "."), GSci("La durée en secondes, en notation scientifique ?", v, M(S(mm, ee)) + " s.")],
            traps: [TR(sv(x[1] * 3, x[2] + 5), "Durée = distance divisée par la vitesse, pas multipliée."), TR(sv(r12(x[1] / 3), x[2] - 5), "Le nombre devant doit être entre 1 et 10 : réécris " + M(N(r12(x[1] / 3))) + ".")] }); },
      () => { const x = pk([["une baleine bleue", 1.5, 5, "une fourmi", 3, -6, "fourmi"], ["un éléphant", 6, 3, "une abeille", 1.2, -4, "abeille"], ["la Terre", 6, 24, "la Lune", 7.5, 22, "terrelune"], ["un camion", 4, 4, "un grain de riz", 2.5, -5, "riz"]]), [v, mm, ee] = SC(x[1], x[2], x[4], x[5], "/");
        return Qv("La masse de " + x[0] + " est d'environ " + M(S(x[1], x[2])) + " kg, celle de " + x[3] + " d'environ " + M(S(x[4], x[5])) + " kg. Combien de fois " + x[0] + " est-elle plus lourde ? (notation scientifique)".replace(/est-elle plus lourde/, x[0].startsWith("un ") ? "est-il plus lourd" : "est-elle plus lourde"), v,
          M("(" + S(x[1], x[2]) + ") : (" + S(x[4], x[5]) + ") = " + S(mm, ee)) + ".",
          { sci: true, ctx: x[6], guide: scGuide(x[1], x[2], x[4], x[5], "/", v, mm, ee), traps: [TR(sv(x[4] / x[1], x[5] - x[2]), "On divise la grande masse par la petite."), TR(sv(r12(x[1] / x[4]), x[2] + x[5]), "Pour une division, on soustrait les exposants : " + M(x[2] + " - (" + x[5] + ")") + ".")] }); },
      () => { const x = pk([[1000, 1, 9, "un milliard"], [200, 5, 8, "500 millions"], [100, 2, 8, "200 millions"], [50, 1, 7, "10 millions"]]), billets = sv(x[1], x[2]) / x[0], ep = 1e-4, v = r12(billets * ep), [mm, ee] = norm(v), [bm, be] = norm(billets);
        return Qv("Un billet de " + x[0] + " CHF a une épaisseur d'environ " + M(S(1, -4)) + " m. Quelle serait la hauteur d'une pile de " + x[3] + " de francs en billets de " + x[0] + " CHF (en m, notation scientifique) ?", v,
          "Nombre de billets : " + M("(" + S(x[1], x[2]) + ") : " + N(x[0]) + " = " + S(bm, be)) + " ; hauteur : " + M("(" + S(bm, be) + ") \\cdot 10^{-4} = " + S(mm, ee)) + " m.",
          { sci: true, ctx: "billets", guide: [GSci("Combien de billets ? (notation scientifique)", billets, M(S(bm, be)) + "."), GSci("Hauteur de la pile en m ?", v, M(S(mm, ee)) + " m.")],
            traps: [TR(r12(sv(x[1], x[2]) * ep), "Il faut d'abord le nombre de billets : divise la somme par " + x[0] + " CHF."), TR(sv(bm, be + 4), "L'épaisseur vaut " + M("10^{-4}") + " m : on ajoute −4 à l'exposant.")] }); },
      () => { const [a, b, c] = pk([[6, 4, 3], [8, 3, 4], [2, 9, 6], [5, 6, 2], [4, 4.5, 3], [9, 2, 6]]), m = ne1(-4, 6), n = ne1(-5, 5), p = ne1(-6, 4), v = sv(a * b / c, m + n - p), [mm, ee] = norm(v);
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("\\frac{(" + S(a, m) + ") \\cdot (" + S(b, n) + ")}{" + S(c, p) + "}"), v, M("\\frac{" + N(a * b) + "}{" + c + "} = " + N(r12(a * b / c))) + " et " + M("10^{" + m + " + (" + n + ") - (" + p + ")} = 10^{" + (m + n - p) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "frac", guide: [GS("Les nombres : " + M("\\frac{" + a + " \\cdot " + N(b) + "}{" + c + "}") + " = ?", r12(a * b / c), M(N(r12(a * b / c))) + "."), GS("L'exposant : " + M(m + " + (" + n + ") - (" + p + ")") + " = ?", m + n - p, M(m + n - p) + "."), GSci("Résultat en notation scientifique ?", v, M(S(mm, ee)) + ".")],
            traps: [TR(sv(a * b / c, m + n + p), "On divise par " + M("10^{" + p + "}") + " : on soustrait son exposant."), TR(sv(a * b * c, m + n - p), "On divise par " + M(c) + " : le nombre du dénominateur divise.")] }); },
    ],
  };

  // ===================== Défis (niveau 4) : problèmes en plusieurs étapes =====================
  const PROBS = {
    prio: [
      () => { const n = R.int(3, 6), p = pk([12, 15, 18]), r = R.int(2, 4), s = pk([4, 5, 6]);
        return P("Une classe va au musée. Le bus coûte " + M(n * 40) + " CHF pour tout le groupe. L'entrée coûte " + M(p) + " CHF par élève, avec une réduction de " + M(r) + " CHF par élève. Il y a " + M(s * 4) + " élèves.",
          [["a) Prix d'entrée par élève après réduction (CHF)", p - r], ["b) Prix total des entrées (CHF)", (p - r) * s * 4], ["c) Coût total de la sortie (CHF)", n * 40 + (p - r) * s * 4]],
          ["Écris le calcul en une ligne avec des parenthèses : " + n * 40 + " + " + s * 4 + " · (" + p + " − " + r + ").", "La parenthèse d'abord, puis la multiplication, puis l'addition."],
          "c) " + M(n * 40 + " + " + s * 4 + " \\cdot (" + p + " - " + r + ") = " + n * 40 + " + " + (p - r) * s * 4 + " = " + (n * 40 + (p - r) * s * 4)) + " CHF."); },
      () => { const a = R.int(2, 5), b = R.int(6, 9), c = R.int(2, 4);
        return P("Place des parenthèses dans " + M(a + " + " + b + " \\cdot " + c + " - 1") + " pour obtenir différents résultats. Calcule :",
          [["a) " + a + " + " + b + " · " + c + " − 1 (sans parenthèses)", a + b * c - 1], ["b) (" + a + " + " + b + ") · " + c + " − 1", (a + b) * c - 1], ["c) " + a + " + " + b + " · (" + c + " − 1)", a + b * (c - 1)], ["d) (" + a + " + " + b + ") · (" + c + " − 1)", (a + b) * (c - 1)]],
          ["Sans parenthèses : la multiplication d'abord.", "Les parenthèses changent l'ordre des calculs."], "a) " + (a + b * c - 1) + " ; b) " + ((a + b) * c - 1) + " ; c) " + (a + b * (c - 1)) + " ; d) " + (a + b) * (c - 1) + "."); },
    ],
    fracadd: [
      () => { const [a, b, c, e] = pk([[1, 3, 1, 4], [2, 5, 1, 3], [1, 4, 1, 6], [3, 8, 1, 4]]), rest = qs([1, 1], qa([a, b], [c, e])), tot = pk([120, 240, 360]) ;
        return P("Lors d'une élection de délégué, " + M(fT(a, b)) + " des élèves votent pour Ana, " + M(fT(c, e)) + " pour Ben, et le reste pour Chloé. L'école compte " + tot + " élèves.",
          [["a) Fraction des voix pour Chloé (tape la fraction)", qv(rest)], ["b) Nombre de voix pour Ana", tot * a / b], ["c) Nombre de voix pour Chloé", tot * qv(rest)]],
          ["a) 1 − (" + a + "/" + b + " + " + c + "/" + e + ").", "b) et c) : fraction × nombre d'élèves."], "a) " + M(qT(rest)) + " ; b) " + M(tot * a / b) + " ; c) " + M(r12(tot * qv(rest))) + "."); },
      () => P("Un sirop se dilue ainsi : " + M(fT(1, 6)) + " de sirop, " + M(fT(2, 3)) + " d'eau plate et le reste d'eau gazeuse.",
          [["a) Fraction d'eau gazeuse (tape la fraction)", 1 / 6], ["b) Pour 1,2 L de boisson, volume de sirop (L)", 0.2], ["c) Volume d'eau plate (L)", 0.8]],
          ["a) 1 − 1/6 − 2/3, au dénominateur 6.", "b) 1/6 de 1,2 L."], "a) " + M("1 - \\frac{1}{6} - \\frac{4}{6} = \\frac{1}{6}") + " ; b) " + M("0{,}2") + " L ; c) " + M("0{,}8") + " L."),
    ],
    fracmul: [
      () => { const N0 = pk([360, 480, 600, 720]);
        return P("Une ville de " + N0 + " hectares : les " + M(fT(2, 5)) + " sont des forêts ; les " + M(fT(3, 4)) + " des forêts sont des feuillus.",
          [["a) Surface de forêt (ha)", N0 * 2 / 5], ["b) Fraction de la ville couverte de feuillus (tape la fraction)", 3 / 10], ["c) Surface de feuillus (ha)", N0 * 3 / 10]],
          ["b) Les 3/4 des 2/5, c'est 3/4 · 2/5.", "c) Cette fraction de " + N0 + " ha."], "a) " + M(N0 * 2 / 5) + " ha ; b) " + M("\\frac{3}{4} \\cdot \\frac{2}{5} = \\frac{3}{10}") + " ; c) " + M(N0 * 3 / 10) + " ha."); },
      () => { const L0 = pk([12, 15, 18]);
        return P("Un ruban de " + L0 + " m. On en coupe les " + M(fT(1, 3)) + ", puis on coupe le reste en morceaux de " + M(fT(2, 5)) + " m.",
          [["a) Longueur coupée d'abord (m)", L0 / 3], ["b) Longueur restante (m)", L0 * 2 / 3], ["c) Nombre de morceaux de 2/5 m", L0 * 2 / 3 * 5 / 2]],
          ["b) " + L0 + " − " + L0 / 3 + ".", "c) Divise par 2/5 : multiplie par 5/2."], "c) " + M(L0 * 2 / 3 + " : \\frac{2}{5} = " + L0 * 2 / 3 + " \\cdot \\frac{5}{2} = " + L0 * 2 / 3 * 5 / 2) + " morceaux."); },
    ],
    fracconv: [
      () => P("Trois magasins proposent le même article à 80 CHF : le premier fait " + M(fT(1, 4)) + " de rabais, le deuxième " + M("22\\,\\%") + ", le troisième " + M("0{,}3") + " du prix en moins après une hausse de 10 %.",
          [["a) Prix au premier magasin (CHF)", 60], ["b) Prix au deuxième (CHF)", 62.4], ["c) Prix au troisième (CHF)", 61.6]],
          ["a) 80 · (1 − 1/4).", "c) 80 · 1,1 · 0,7."], "a) " + M("60") + " ; b) " + M("80 \\cdot 0{,}78 = 62{,}4") + " ; c) " + M("80 \\cdot 1{,}1 \\cdot 0{,}7 = 61{,}6") + " : le premier est le moins cher."),
      () => P("Nombres périodiques.", [["a) 0,777… en fraction (tape la fraction)", 7 / 9], ["b) 0,1818… en fraction", 2 / 11], ["c) 0,999… = ?", 1]],
          ["a) 10x − x = 7.", "c) 10x − x = 9, donc 9x = 9."], "a) " + M("\\frac{7}{9}") + " ; b) " + M("\\frac{18}{99} = \\frac{2}{11}") + " ; c) " + M("x = 1") + " : " + M("0{,}\\overline{9} = 1") + "."),
    ],
    puiss: [
      () => P("Une feuille pliée en deux double d'épaisseur à chaque pliage. Elle mesure " + M("0{,}1") + " mm d'épaisseur.",
          [["a) Nombre de couches après 5 pliages", 32], ["b) Épaisseur après 10 pliages (mm, arrondi à l'unité)", 102.4, 1], ["c) Combien de pliages pour dépasser 1 m (1000 mm) ?", 14]],
          ["Après n pliages : 2ⁿ couches.", "c) 2ⁿ · 0,1 > 1000, donc 2ⁿ > 10'000."], "a) " + M("2^5 = 32") + " ; b) " + M("2^{10} \\cdot 0{,}1 = 102{,}4") + " mm ; c) " + M("2^{13} = 8192 < 10\\text{'}000 < 2^{14}") + " : 14 pliages."),
      () => P("Calcule sans calculatrice, en utilisant les propriétés des puissances.", [["a) 2⁵ · 2⁻³", 4], ["b) (3²)³ ÷ 3⁵", 3], ["c) 5⁻² · 10²", 4], ["d) 2¹⁰ ÷ 4⁴", 4]],
          ["Même base : additionne ou soustrais les exposants.", "d) 4⁴ = (2²)⁴ = 2⁸."], "a) " + M("2^2 = 4") + " ; b) " + M("3^6 : 3^5 = 3") + " ; c) " + M("\\frac{100}{25} = 4") + " ; d) " + M("2^{10} : 2^8 = 4") + "."),
    ],
    sci: [
      () => P("Un atome d'hydrogène a un diamètre d'environ " + M("1{,}06 \\cdot 10^{-10}") + " m.",
          [["a) Ce diamètre en nm (1 nm = 10⁻⁹ m)", 0.106], ["b) Combien d'atomes alignés pour faire 1 mm ? (arrondi au million)", 1e-3 / 1.06e-10, 1e6]],
          ["a) Divise par 10⁻⁹.", "b) 10⁻³ ÷ (1,06 · 10⁻¹⁰)."], "a) " + M("0{,}106") + " nm ; b) " + M("\\frac{10^{-3}}{1{,}06 \\cdot 10^{-10}} \\approx 9{,}4 \\cdot 10^6") + " atomes."),
      () => P("La Terre a un rayon d'environ " + M("6{,}4 \\cdot 10^3") + " km.", [["a) Rayon en m (nombre entier)", 6400000], ["b) Circonférence de l'équateur en km (2πr, arrondie au millier)", 2 * Math.PI * 6400, 1000]],
          ["1 km = 10³ m.", "b) 2 · π · 6400."], "a) " + M("6{,}4 \\cdot 10^6 = 6\\text{'}400\\text{'}000") + " m ; b) " + M("2\\pi \\cdot 6400 \\approx 40\\text{'}000") + " km."),
    ],
    scicalc: [
      () => P("Une année-lumière est la distance parcourue par la lumière en un an. La lumière va à " + M("3 \\cdot 10^5") + " km/s, et une année compte environ " + M("3{,}15 \\cdot 10^7") + " s.",
          [["a) Une année-lumière en km (notation scientifique)", 9.45e12], ["b) L'étoile Proxima est à 4,2 années-lumière : distance en km (notation scientifique, deux décimales)", 3.969e13, 1e11]],
          ["a) Vitesse × durée.", "b) 4,2 × le résultat a)."], "a) " + M("9{,}45 \\cdot 10^{12}") + " km ; b) " + M("\\approx 3{,}97 \\cdot 10^{13}") + " km."),
      () => P("Le corps humain contient environ " + M("5") + " L de sang, et chaque mm³ de sang contient environ " + M("5 \\cdot 10^6") + " globules rouges.",
          [["a) Nombre de mm³ dans 1 L (tape la puissance de 10, ex. 10^6)", 1e6], ["b) Nombre de globules rouges dans 5 L (notation scientifique)", 2.5e13]],
          ["1 L = 1 dm³ = 10⁶ mm³.", "b) 5 · 10⁶ · 5 · 10⁶."], "a) " + M("10^6") + " ; b) " + M("5 \\cdot 10^6 \\cdot 5 \\cdot 10^6 = 2{,}5 \\cdot 10^{13}") + "."),
    ],
  };

  // ===================== Enregistrement =====================
  const ALL = { prio: PRIO, fracadd: FADD, fracmul: FMUL, fracconv: FCONV, puiss: PUISS, sci: SCI, scicalc: SCALC };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    prio: "Ordre des calculs : parenthèses (et barres de fraction), puis puissances, puis · et ÷, enfin + et −, de gauche à droite.",
    fracadd: "Même dénominateur d'abord (le plus petit possible), puis on additionne les numérateurs ; on simplifie à la fin.",
    fracmul: "Numérateurs entre eux, dénominateurs entre eux ; diviser, c'est multiplier par l'inverse. Simplifie avant de multiplier.",
    fracconv: "Fraction → décimal : divise. Décimal → fraction : sur 10, 100, 1000…, puis simplifie. Pour cent = sur 100. Période de 1 chiffre : sur 9 ; de 2 chiffres : sur 99.",
    puiss: "Même base : on additionne les exposants (produit), on les soustrait (quotient), on les multiplie (puissance d'une puissance). Exposant négatif : inverse.",
    sci: "a · 10ⁿ avec 1 ≤ a < 10 ; n compte les rangs dont on déplace la virgule (n < 0 pour un nombre plus petit que 1).",
    scicalc: "On calcule séparément les nombres devant et les puissances de 10, puis on remet le nombre devant entre 1 et 10.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    prio: ["Respecter les priorités (· avant +)", "Parenthèses, crochets, barre de fraction", "Puissances et nombres relatifs"],
    fracadd: ["Additionner des fractions simples", "Dénominateur commun, plusieurs fractions", "Fractions relatives et parenthèses"],
    fracmul: ["Multiplier des fractions, fraction d'un nombre", "Diviser des fractions", "Calculs mêlés et problèmes"],
    fracconv: ["Fraction, décimal, pourcentage", "Pourcentages et nombres périodiques", "Périodes longues, pourcentages successifs"],
    puiss: ["Produit, quotient, puissance d'une puissance", "Exposants négatifs", "Calculer avec plusieurs propriétés"],
    sci: ["Écrire en notation scientifique", "Comparer, convertir des unités", "Aires, volumes, sommes"],
    scicalc: ["Multiplier et diviser", "Exposants négatifs, carrés, contextes", "Problèmes en plusieurs étapes"],
  });
})();
