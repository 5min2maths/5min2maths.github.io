// ===================== 25.11 : défis (niveau 4) propres à la 2e du Collège =====================
// Audit de niveau 2e (tools/niveau_2c.md) : 19 notions de l'année n'avaient aucun « Problème de la semaine ». Ici, un vrai
// problème par notion (deux pour probrat, decomp, logbase), en 2 à 4 étapes qui s'enchaînent, au niveau des épreuves
// regroupées de 2e (Sismondi 2MA1 et 2MA2, étalons E… de tools/niveau_2c.md), valeurs tirées au hasard, jamais triviales.
// Proposés en 2e, 3e et 4e Collège (co: [13, 14, 15], décision de l'enseignant du 25.11 : « il faut toujours savoir refaire
// des choses d'avant tant que ce n'est pas trivial ») ; en 1re et en MP, Engine.make les écarte (horsCO).
// Ces notions n'existent pas en MP (MP: null). Chargé après variantes.js (PROBX).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick;
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  /* Nombres : virgule décimale, ' des milliers ; F = fraction exacte si possible ; T = texte simple (indices). */
  const N = (v) => { const [i, f] = String(r6(v)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const F = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 1000; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return frac(Math.round(v * d), d); return N(v); };
  const T = (v) => { let s; if (Number.isInteger(v)) s = String(v); else { s = null; for (let d = 2; d <= 1000 && !s; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) { const n = Math.round(v * d), g = gcd(n, d); s = n / g + "/" + d / g; } if (!s) s = String(r6(v)).replace(".", ","); } return s.replace(/^-/, "−"); };
  const X = (v) => M(F(v));
  const Td = (v) => String(r6(v)).replace(".", ",").replace(/^-/, "−");
  const sg = (v) => (v < 0 ? " - " + F(-v) : " + " + F(v));
  const xm = (p) => (p === 0 ? "x" : p > 0 ? "x - " + F(p) : "x + " + F(-p));
  const xmT = (p) => (p === 0 ? "x" : p > 0 ? "x − " + T(p) : "x + " + T(-p));
  const pr = (v) => (v < 0 ? "(" + F(v) + ")" : F(v));
  const pT = (cs) => poly(cs).replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³").replace(/\^\{?4\}?/g, "⁴").replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/-/g, "−");
  const pt = (a, b) => "(" + F(a) + " \\,;\\, " + F(b) + ")";
  const PX = (id, f) => { (PROBX[id] = PROBX[id] || []).push(() => { let p = null; for (let k = 0; k < 400 && !p; k++) p = f(); return Object.assign(p, { co: [13, 14, 15] }); }); };
  /* parts : [libellé, valeur (ou spec), arrondi facultatif] ; valeur exacte gardée telle quelle (fractions comparées à 1e-9). */
  const PB = (q, parts, hints, sol) => ({ q, hints, sol,
    parts: parts.map(([label, v, rd]) => ({ label, spec: v && typeof v === "object" ? v : Object.assign({ kind: "value", value: v }, rd ? { round: rd } : {}) })) });
  const SET = (vs) => ({ kind: "set", values: [...vs].sort((a, b) => a - b) });
  const PAIR = (x, y) => ({ kind: "pair", values: [x, y] }), SOLS = (ivs) => ({ kind: "solset", ivs });
  const EX = (expr, form) => Object.assign({ kind: "expr", expr }, form ? { form } : {});
  const mul = (A, B) => { const C = new Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { C[i + j] += a * b; })); return C; };
  const ev = (cs, x) => cs.reduce((s, c) => s * x + c, 0);
  const triv = (v) => v === 0 || Math.abs(v) === 1;
  /* Ensemble des x tels que f(x) op 0 (op : <, <=, >, >=), f continue de zéros zs : intervalles [a, a incl., b, b incl.]. */
  const signSet = (f, zs, op) => {
    const z = [...new Set(zs)].sort((a, b) => a - b), want = op[0] === ">" ? 1 : -1, strict = op.length === 1, els = [];
    for (let i = 0; i <= z.length; i++) {
      const lo = i ? z[i - 1] : -Infinity, hi = i < z.length ? z[i] : Infinity, mid = !isFinite(lo) ? hi - 1 : !isFinite(hi) ? lo + 1 : (lo + hi) / 2;
      els.push({ sel: Math.sign(f(mid)) === want, lo, loI: false, hi, hiI: false });
      if (i < z.length) els.push({ sel: !strict, lo: z[i], loI: true, hi: z[i], hiI: true });
    }
    const ivs = []; let cur = null;
    for (const e of els) { if (e.sel) { if (!cur) cur = [e.lo, e.loI, e.hi, e.hiI]; else { cur[2] = e.hi; cur[3] = e.hiI; } } else if (cur) { ivs.push(cur); cur = null; } }
    if (cur) ivs.push(cur);
    return ivs;
  };
  const OPT = { "<": "<", "<=": "\\leq", ">": ">", ">=": "\\geq" };
  /* Durée en heures → « 2 h 15 min » (minutes entières). */
  const hm = (h) => { const m = Math.round(h * 60), H = Math.floor(m / 60), mm = m % 60; return (H ? H + " h" : "") + (H && mm ? " " : "") + (mm ? mm + " min" : ""); };

  // ---------- Chapitre 3 : polynômes ----------
  PX("polydiv", () => { /* E3.1 : théorème du reste → système en p et q → Horner, trinôme */
    const C = [-5, -4, -3, -2, 2, 3, 4, 5], r1 = pk(C), r2 = pk(C), r3 = pk(C), s = pk([-3, -2, 2, 3]);
    if (new Set([r1, r2, r3, s]).size < 4) return null;
    const p = -(r1 + r2 + r3), q = r1 * r2 + r1 * r3 + r2 * r3, c = -r1 * r2 * r3, P = (x) => x ** 3 + p * x * x + q * x + c, Rs = P(s);
    if (Math.abs(p) <= 1 || Math.abs(q) <= 1 || Rs === 0 || Math.abs(c) > 60) return null;
    const rhs1 = -(r1 ** 3) - c, rhs2 = Rs - s ** 3 - c;
    return PB("Soit " + M("P(x) = x^3 + px^2 + qx" + sg(c)) + ", où " + M("p") + " et " + M("q") + " sont des nombres réels. On sait que " + M("P(x)") + " est divisible par " + M(xm(r1)) + " et que le reste de la division de " + M("P(x)") + " par " + M(xm(s)) + " vaut " + X(Rs) + ".",
      [["a) Valeur de " + M("p"), p], ["b) Valeur de " + M("q"), q], ["c) Les deux autres racines de " + M("P") + " (séparées par « ; »)", SET([r2, r3])]],
      ["Théorème du reste : le reste de la division de P(x) par x − a est P(a). Écris P(" + T(r1) + ") = 0 et P(" + T(s) + ") = " + T(Rs) + " : deux équations en p et q.",
        "Résous ce système, puis divise P(x) par " + xmT(r1) + " (schéma de Horner) : le quotient est un trinôme à factoriser."],
      M("P(" + r1 + ") = 0 \\iff " + r1 * r1 + "p" + sg(r1) + "q = " + rhs1) + " et " + M("P(" + s + ") = " + Rs + " \\iff " + s * s + "p" + sg(s) + "q = " + rhs2) + ". a) b) Le système donne " + M("p = " + p) + " et " + M("q = " + q) + ". c) " +
      M("P(x) = (" + xm(r1) + ")(" + poly([1, -(r2 + r3), r2 * r3]) + ") = (" + xm(r1) + ")(" + xm(r2) + ")(" + xm(r3) + ")") + " : les autres racines sont " + X(Math.min(r2, r3)) + " et " + X(Math.max(r2, r3)) + ".");
  });
  PX("polyfact", () => { /* E3.2 : factoriser complètement un polynôme de degré 4 (trois racines entières, une racine fractionnaire) */
    const C = [-4, -3, -2, 2, 3, 4], a = pk(C), b = pk(C), d = pk(C), k = pk([2, 3]), c = pk([-5, -4, -2, -1, 1, 2, 4, 5].filter((v) => v % k !== 0));
    if (new Set([a, b, d]).size < 3) return null;
    const cs = mul(mul(mul([1, -a], [1, -b]), [1, -d]), [k, -c]);
    if (cs.some((v) => Math.abs(v) > 150) || cs.includes(0)) return null;
    const z = [a, b, d].sort((u, v) => u - v);
    return PB("Soit " + M("P(x) = " + poly(cs)) + ".",
      [["a) Les racines entières de " + M("P") + " (séparées par « ; »)", SET(z)], ["b) La racine non entière de " + M("P") + " (fraction)", c / k],
        ["c) " + M("P(x)") + " complètement factorisé", EX("(x" + (-z[0] < 0 ? "" : "+") + -z[0] + ")(x" + (-z[1] < 0 ? "" : "+") + -z[1] + ")(x" + (-z[2] < 0 ? "" : "+") + -z[2] + ")(" + k + "x" + (-c < 0 ? "" : "+") + -c + ")", "product")]],
      ["Une racine entière de P divise le terme constant " + T(cs[4]) + " : teste ces diviseurs (P(a) = 0 ?).", "Chaque racine trouvée permet une division (Horner) : il reste à la fin un facteur du 1er degré " + k + "x − …"],
      "Par essais : " + z.map((r) => M("P(" + r + ") = 0")).join(", ") + ". Trois divisions de Horner donnent " + M("P(x) = (" + xm(z[0]) + ")(" + xm(z[1]) + ")(" + xm(z[2]) + ")(" + poly([k, -c]) + ")") + ". a) " + z.map(X).join(" ; ") + ". b) " + M(poly([k, -c]) + " = 0 \\iff x = " + F(c / k)) + ".");
  });
  PX("polyexpr", () => { /* E3.3 + E3.4 : retrouver un polynôme de degré 3 par ses zéros et un point, puis étudier son signe */
    const C = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], r = [pk(C), pk(C), pk(C)], a = pk([-3, -2, -0.5, 0.5, 2, 3]);
    if (new Set(r).size < 3) return null;
    r.sort((u, v) => u - v);
    const cs = mul(mul([a, -a * r[0]], [1, -r[1]]), [1, -r[2]]), f = (x) => ev(cs, x), v0 = cs[3], op = pk(["<", ">=", ">", "<="]);
    if (!cs.every(Number.isInteger) || triv(cs[2]) || triv(v0) || Math.abs(v0) > 90) return null;
    const ivs = signSet(f, r, op);
    return PB("Une fonction polynomiale " + M("f") + " de degré 3 a trois zéros : " + r.map(X).join(", ") + ". Son graphe coupe l'axe des ordonnées en " + M(pt(0, v0)) + ".",
      [["a) Coefficient dominant de " + M("f") + " (fraction acceptée)", a], ["b) Coefficient de " + M("x") + " dans la forme développée de " + M("f(x)"), cs[2]], ["c) Solutions de " + M("f(x) " + OPT[op] + " 0") + " (intervalles)", SOLS(ivs)]],
      ["Les zéros donnent la forme f(x) = a(" + r.map(xmT).join(")(") + ") ; remplace x par 0 pour trouver a.", "c) Tableau des signes : le signe change à chaque zéro simple ; à droite de tous les zéros, f a le signe de a."],
      M("f(x) = a(" + r.map(xm).join(")(") + ")") + " ; " + M("f(0) = a \\cdot " + pr(-r[0]) + " \\cdot " + pr(-r[1]) + " \\cdot " + pr(-r[2]) + " = " + v0) + ", a) " + M("a = " + F(a)) + ". b) " + M("f(x) = " + poly(cs)) + ", coefficient de " + M("x") + " : " + X(cs[2]) + ". c) " + M("S = " + SolSet.show(ivs, true)) + ".");
  });
  PX("ineqpoly", () => { /* E3.4 : racine évidente → factorisation → tableau des signes (zéro double = point isolé ou zéro sans changement de signe) */
    const C = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], dbl = R.rand() < 0.5, r1 = pk(C), r2 = pk(C), r3 = dbl ? r1 : pk(C), s = pk([1, -1, 2, -2]);
    if (dbl ? r1 === r2 : new Set([r1, r2, r3]).size < 3) return null;
    const cs = mul(mul([s, -s * r1], [1, -r2]), [1, -r3]), f = (x) => ev(cs, x), op = pk(["<", "<=", ">", ">="]);
    if (cs.some((v) => Math.abs(v) > 80) || cs[3] === 0) return null;
    const ivs = signSet(f, [r1, r2, r3], op), zs = [...new Set([r1, r2, r3])].sort((u, v) => u - v);
    let cnt = 0; for (let x = -10; x <= 10; x++) if ({ "<": f(x) < 0, "<=": f(x) <= 0, ">": f(x) > 0, ">=": f(x) >= 0 }[op]) cnt++;
    if (triv(cnt) || ivs.length === 0) return null;
    const fac = (Math.abs(s) === 1 ? (s < 0 ? "-" : "") : s) + (dbl ? "(" + xm(r1) + ")^2(" + xm(r2) + ")" : "(" + xm(r1) + ")(" + xm(r2) + ")(" + xm(r3) + ")");
    return PB("On considère l'inéquation " + M(poly(cs) + " " + OPT[op] + " 0") + ".",
      [["a) Zéros du membre de gauche (séparés par « ; »)", SET(zs)], ["b) Ensemble des solutions (intervalles ; un point isolé s'écrit {a})", SOLS(ivs)], ["c) Combien d'entiers de " + M("-10") + " à " + M("10") + " sont solutions ?", cnt]],
      ["Cherche une racine évidente parmi les diviseurs de " + T(cs[3]) + " (essaie ±1, ±2…), puis divise par x − a (Horner) et factorise le trinôme.",
        "Tableau des signes avec tous les facteurs." + (dbl ? " Attention : un facteur au carré ne change pas de signe." : "") + " Pour c), compte les entiers dans chaque intervalle."],
      M(poly(cs) + " = " + fac) + ". a) " + zs.map(X).join(" ; ") + ". b) Tableau des signes : " + M("S = " + SolSet.show(ivs, true)) + ". c) " + X(cnt) + " entiers.");
  });

  // ---------- Chapitre 4 : fractions rationnelles ----------
  PX("eqrat", () => { /* E4.1 : domaine, équation du 2e degré, solution étrangère écartée */
    const C = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6], p = pk(C), q = pk(C), b = pk([1, 2, 3]), a = R.nz(-8, 8), s1 = pk([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), z = pk([p, q]);
    if (p === q || s1 === p || s1 === q) return null;
    const c = a + b * p - b * (s1 + z), d = -a * q + c * p + b * s1 * z;
    if (c === 0 || d === 0) return null;
    return PB("Résous l'équation " + M("\\frac{" + a + "}{" + xm(p) + "} - \\frac{" + poly([b, c]) + "}{" + xm(q) + "} = \\frac{" + d + "}{" + poly([1, -(p + q), p * q]) + "}") + ".",
      [["a) Valeurs interdites (séparées par « ; »)", SET([p, q])], ["b) En multipliant par le dénominateur commun, on obtient une équation du 2e degré. Ses solutions (« ; »)", SET([s1, z])], ["c) Solution(s) de l'équation de départ", SET([s1])]],
      ["Factorise d'abord " + pT([1, -(p + q), p * q]) + " : c'est le dénominateur commun. Les valeurs qui l'annulent sont interdites.",
        "Multiplie chaque terme par (" + xmT(p) + ")(" + xmT(q) + "), développe, ramène tout à gauche et résous. Puis compare avec les valeurs interdites."],
      M(poly([1, -(p + q), p * q]) + " = (" + xm(p) + ")(" + xm(q) + ")") + ", a) " + M("D = \\mathbb{R} \\setminus \\{" + Math.min(p, q) + " \\,;\\, " + Math.max(p, q) + "\\}") + ". b) " + M(a + "(" + xm(q) + ") - (" + poly([b, c]) + ")(" + xm(p) + ") = " + d) + " devient " + M(poly([-b, b * (s1 + z), -b * s1 * z]) + " = 0") + ", soit " + M((b === 1 ? "-" : "-" + b) + "(" + xm(s1) + ")(" + xm(z) + ") = 0") + " : " + M("x = " + s1) + " ou " + M("x = " + z) + ". c) " + M(z) + " est interdite : " + M("S = \\{" + s1 + "\\}") + ".");
  });
  PX("fracetage", () => { /* fraction à étages : simplifier → domaine → équation (parfois sans solution) */
    const p = ri(2, 6), a = R.nz(-6, 6), b = R.nz(-6, 6), c = ri(2, 9), none = R.rand() < 0.3, xs = none ? pk([p, -p]) : pk([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    if (a + b === 0 || a === b || (!none && Math.abs(xs) === p)) return null;
    const A = a + b, B = (a - b) * p, w = (A * xs + B) / c, g = gcd(gcd(A, B), c);
    if (triv(w) || B === 0 || g === Math.abs(c)) return null;
    return PB("Soit " + M("F(x) = \\dfrac{\\frac{" + a + "}{" + xm(p) + "} " + (b < 0 ? "-" : "+") + " \\frac{" + Math.abs(b) + "}{x + " + p + "}}{\\frac{" + c + "}{x^2 - " + p * p + "}}") + ".",
      [["a) " + M("F(x)") + " simplifiée (sans fraction à étages)", EX("(" + A + "*x+(" + B + "))/" + c, "nodiv")], ["b) Valeurs interdites de " + M("F") + " (« ; »)", SET([-p, p])], ["c) Solution(s) de " + M("F(x) = " + F(w)) + " (« aucune » s'il n'y en a pas)", SET(none ? [] : [xs])]],
      ["Mets d'abord le numérateur au même dénominateur (x − " + p + ")(x + " + p + ") = x² − " + p * p + ", puis divise : diviser par une fraction, c'est multiplier par son inverse.",
        "Les valeurs interdites viennent de TOUS les dénominateurs de départ, même s'ils ont disparu après simplification."],
      "Numérateur : " + M("\\frac{" + a + "(x + " + p + ")" + sg(b) + "(" + xm(p) + ")}{x^2 - " + p * p + "} = \\frac{" + poly([A, B]) + "}{x^2 - " + p * p + "}") + ". a) " + M("F(x) = \\frac{" + poly([A, B]) + "}{x^2 - " + p * p + "} \\cdot \\frac{x^2 - " + p * p + "}{" + c + "} = \\frac{" + poly([A, B]) + "}{" + c + "}") + ". b) " + M("\\pm " + p) + ". c) " + M(poly([A, B]) + " = " + F(c * w) + " \\iff x = " + xs) + (none ? ", valeur interdite : aucune solution." : ", qui est permise : " + M("S = \\{" + xs + "\\}") + "."));
  });
  PX("homog", () => { /* E4.3 : asymptotes, puis intersection avec la droite y = x (équation du 2e degré) */
    const C = [-5, -4, -3, -2, 2, 3, 4, 5], c = pk([1, 2]), r1 = pk(C), r2 = pk(C), a = R.nz(-6, 6);
    if (r1 === r2) return null;
    const b = -c * r1 * r2, d = a - c * (r1 + r2);
    if (d === 0 || a * d - b * c === 0 || triv(-d / c) || triv(a / c) || r1 === -d / c || r2 === -d / c || Math.abs(b) > 30) return null;
    return PB("Soit " + M("f(x) = \\frac{" + poly([a, b]) + "}{" + poly([c, d]) + "}") + ".",
      [["a) Asymptote verticale : " + M("x = \\ldots"), -d / c], ["b) Asymptote horizontale : " + M("y = \\ldots"), a / c], ["c) Abscisses des points où le graphe de " + M("f") + " coupe la droite " + M("y = x") + " (« ; »)", SET([r1, r2])]],
      ["Asymptote verticale : là où le dénominateur s'annule. Asymptote horizontale : quotient des coefficients de x.", "c) Résous f(x) = x : multiplie par " + pT([c, d]) + " et ramène tout d'un côté."],
      "a) " + M(poly([c, d]) + " = 0 \\iff x = " + F(-d / c)) + ". b) " + M("y = " + (c === 1 ? F(a) : "\\frac{" + a + "}{" + c + "} = " + F(a / c))) + ". c) " + M(poly([a, b]) + " = x(" + poly([c, d]) + ") \\iff " + poly([c, d - a, -b]) + " = 0 \\iff " + (c === 1 ? "" : c) + "(" + xm(r1) + ")(" + xm(r2) + ") = 0") + ", soit " + M("x = " + r1) + " ou " + M("x = " + r2) + " (valeurs permises).");
  });
  PX("homogrec", () => { /* E4.3 : réciproque d'une homographique, son domaine, une valeur */
    const c = pk([1, 2]), a = R.nz(-6, 6), b = R.nz(-9, 9), d = R.nz(-6, 6), w = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    if (a * d - b * c === 0 || triv(a / c) || c * w + d === 0) return null;
    const v = (a * w + b) / (c * w + d);
    if (triv(v) || v === a / c) return null;
    const ex = "(" + -d + "*x+(" + b + "))/(" + c + "*x-(" + a + "))";
    return PB("Soit " + M("f(x) = \\frac{" + poly([a, b]) + "}{" + poly([c, d]) + "}") + ", bijection de " + M("\\mathbb{R} \\setminus \\{" + F(-d / c) + "\\}") + " vers " + M("\\mathbb{R} \\setminus \\{" + F(a / c) + "\\}") + ".",
      [["a) Expression de " + M("f^{-1}(x)"), EX(ex, "onefrac")], ["b) Valeur interdite de " + M("f^{-1}"), a / c], ["c) " + M("f^{-1}\\left(" + F(v) + "\\right)"), w]],
      ["Pose y = f(x), multiplie par le dénominateur et isole x : tous les termes en x d'un côté, puis mets x en évidence.", "c) Remplace x par " + T(v) + " dans f⁻¹(x), ou résous f(x) = " + T(v) + "."],
      M("y = \\frac{" + poly([a, b]) + "}{" + poly([c, d]) + "} \\iff " + (c === 1 ? "" : c) + "xy" + sg(d) + "y = " + poly([a, b]) + " \\iff x(" + poly([c, -a], "y") + ") = " + poly([-d, b], "y")) + ". a) " + M("f^{-1}(x) = \\frac{" + poly([-d, b]) + "}{" + poly([c, -a]) + "}") + ". b) " + M("x = " + F(a / c)) + " (c'est l'asymptote horizontale de " + M("f") + "). c) " + M("f(" + w + ") = " + F(v)) + ", donc " + M("f^{-1}\\left(" + F(v) + "\\right) = " + w) + ".");
  });
  /* probrat : deux problèmes (travail en commun, bateau sur une rivière) */
  PX("probrat", () => {
    const t = ri(2, 8), d = ri(1, 6), Th = (t * (t + d)) / (2 * t + d);
    if (!Number.isInteger(Math.round(Th * 60 * 1e6) / 1e6) || Th * 60 < 50) return null;
    const ctx = pk([{ intro: "Deux robinets remplissent une citerne.", n1: "le premier robinet", n2: "le second", e: "", job: "remplir la citerne", c: "Le premier robinet coule seul pendant 1 heure, puis on ouvre aussi le second. Combien de minutes faut-il encore pour finir de remplir la citerne ?" },
      { intro: "Deux imprimantes impriment le même lot de brochures.", n1: "la première imprimante", n2: "la seconde", e: "e", job: "imprimer le lot", c: "La première imprimante travaille seule pendant 1 heure, puis la seconde la rejoint. Combien de minutes faut-il encore pour finir le lot ?" }]);
    const rest = (60 * Th * (t - 1)) / t;
    return PB(ctx.intro + " Seul" + ctx.e + ", " + ctx.n1 + " met " + d + " h de moins que " + ctx.n2 + " pour " + ctx.job + ". Ensemble, il leur faut " + hm(Th) + ".",
      [["a) Durée pour " + ctx.n1 + " seul" + ctx.e + ", en heures", t], ["b) Durée pour " + ctx.n2 + " seul" + ctx.e + ", en heures", t + d], ["c) " + ctx.c + " (arrondi à la minute)", Math.round(rest), 1]],
      ["Avec x heures pour le premier : en 1 h, il fait 1/x du travail, l'autre 1/(x + " + d + "). Ensemble : 1/x + 1/(x + " + d + ") = 1/T, avec T en heures (" + T(r6(Th)) + ").", "Multiplie par le dénominateur commun : équation du 2e degré, garde la solution positive. c) Après 1 h, il reste 1 − 1/x du travail."],
      "Ensemble : " + hm(Th) + " = " + M(F(Th) + " \\text{ h}") + ". " + M("\\frac{1}{x} + \\frac{1}{x + " + d + "} = \\frac{1}{" + F(Th) + "}") + " donne " + M(poly([1, d - 2 * Th, -d * Th]) + " = 0") + ", a) " + M("x = " + t) + " h (l'autre solution est négative). b) " + M(t + d) + " h. c) Il reste " + M("1 - \\frac{1}{" + t + "} = " + F((t - 1) / t)) + " du travail, à " + M(F(1 / Th)) + " par heure : " + M(F((t - 1) / t) + " \\cdot " + F(Th) + " \\text{ h} " + (Number.isInteger(r6(rest)) ? "=" : "\\approx") + " " + Math.round(rest) + " \\text{ min}") + ".");
  });
  PX("probrat", () => {
    const v = ri(8, 20), c = ri(2, 5), D = pk([12, 15, 18, 20, 24, 30, 36, 40]), Tt = D / (v + c) + D / (v - c);
    if (2 * c >= v || Math.abs(Tt * 60 - Math.round(Tt * 60)) > 1e-9) return null;
    const up = (60 * D) / (v - c), vm = (2 * D) / Tt;
    if (!Number.isInteger(Math.round(up * 1e6) / 1e6)) return null;
    return PB("Un bateau descend une rivière sur " + M(D) + " km puis remonte au point de départ. Le courant a une vitesse de " + M(c) + " km/h. L'aller-retour dure " + hm(Tt) + " (sans arrêt).",
      [["a) Vitesse du bateau en eau calme (km/h)", v], ["b) Durée de la remontée, en minutes", up], ["c) Vitesse moyenne sur l'aller-retour (km/h, au centième)", r6(vm), 0.01]],
      ["Avec x la vitesse en eau calme : la descente se fait à x + " + c + " km/h, la remontée à x − " + c + " km/h. Durée = distance ÷ vitesse.", "L'équation " + D + "/(x + " + c + ") + " + D + "/(x − " + c + ") = " + T(r6(Tt)) + " mène au 2e degré ; garde la solution positive. c) Vitesse moyenne = distance totale ÷ durée totale (pas la moyenne des vitesses)."],
      M("\\frac{" + D + "}{x + " + c + "} + \\frac{" + D + "}{x - " + c + "} = " + F(Tt)) + " donne " + M(F(Tt) + "x^2 - " + 2 * D + "x - " + F(Tt * c * c) + " = 0") + ", a) " + M("x = " + v) + " km/h. b) " + M("\\frac{" + D + "}{" + (v - c) + "} \\text{ h} = " + N(up) + " \\text{ min}") + ". c) " + M("\\frac{" + 2 * D + "}{" + F(Tt) + "} \\approx " + N(Math.round(vm * 100) / 100)) + " km/h (moins que " + v + " km/h).");
  });

  // ---------- Chapitre 1 : cercles ----------
  const OFF = { 5: [], 10: [], 13: [] };
  for (const r of [5, 10, 13]) for (let u = -r; u <= r; u++) for (let v = -r; v <= r; v++) if (u * u + v * v === r * r) OFF[r].push([u, v]);
  const circ = (h, k, r) => "x^2 + y^2" + sg(-2 * h) + "x" + sg(-2 * k) + "y" + sg(h * h + k * k - r * r) + " = 0";
  PX("cercle", () => { /* E1.3 : centre et rayon par complétion du carré, intersection avec une droite, longueur de la corde */
    const C = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6], h = pk(C), k = pk(C), r = pk([5, 10, 13]), o1 = pk(OFF[r]), o2 = pk(OFF[r]);
    const P1 = [h + o1[0], k + o1[1]], P2 = [h + o2[0], k + o2[1]];
    if (P1[0] === P2[0] || P1[1] === P2[1] || [P1[0], P2[0]].some(triv) || h * h + k * k === r * r) return null;
    let A = P2[1] - P1[1], B = -(P2[0] - P1[0]); const g = gcd(A, B) * (A < 0 ? -1 : 1); A /= g; B /= g; const Cc = A * P1[0] + B * P1[1];
    if (Math.abs(A) > 9 || Math.abs(B) > 9 || Cc === 0) return null;
    const L = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]), L2 = (P2[0] - P1[0]) ** 2 + (P2[1] - P1[1]) ** 2;
    return PB("On donne le cercle " + M("\\Gamma : " + circ(h, k, r)) + " et la droite " + M("d : " + poly([A, 0]).replace(/^(-?\d*)x$/, "$1x") + (B < 0 ? " - " + (B === -1 ? "" : -B) : " + " + (B === 1 ? "" : B)) + "y = " + Cc) + ".",
      [["a) Centre de " + M("\\Gamma") + " (« x ; y »)", PAIR(h, k)], ["b) Rayon de " + M("\\Gamma"), r], ["c) Abscisses des points d'intersection de " + M("\\Gamma") + " et " + M("d") + " (« ; »)", SET([P1[0], P2[0]])], ["d) Longueur de la corde (valeur exacte ou au centième)", r6(L), Number.isInteger(r6(L)) ? 0 : 0.01]],
      ["Complète les carrés : x² " + (h > 0 ? "− " : "+ ") + Math.abs(2 * h) + "x = (" + xmT(h) + ")² − " + h * h + ", de même pour y.", "c) Isole une variable dans l'équation de d et remplace dans celle du cercle : équation du 2e degré. d) Distance entre les deux points d'intersection."],
      "a) b) " + M("(" + xm(h) + ")^2 + (" + xm(k).replace("x", "y") + ")^2 = " + r * r) + " : centre " + M(pt(h, k)) + ", rayon " + M(r) + ". c) La substitution donne les points " + M(pt(P1[0], P1[1])) + " et " + M(pt(P2[0], P2[1])) + ". d) " + M("\\sqrt{" + (P2[0] - P1[0]) ** 2 + " + " + (P2[1] - P1[1]) ** 2 + "} = \\sqrt{" + L2 + "}" + (Number.isInteger(r6(L)) ? " = " + r6(L) : " \\approx " + N(Math.round(L * 100) / 100))) + ".");
  });
  PX("cercletan", () => { /* E1.4 : tangente en un point du cercle (pente, ordonnée), puis cercle tangent à cette droite */
    const C = [-5, -4, -3, -2, 2, 3, 4, 5], h = pk(C), k = pk(C), r = pk([5, 13, 10]), o = pk(OFF[r].filter(([u, v]) => u && v)), P = [h + o[0], k + o[1]];
    const [u, v] = o, m = -u / v, p = (u * P[0] + v * P[1]) / v, Q = [ri(-8, 8), ri(-8, 8)], rho = Math.abs(u * (Q[0] - P[0]) + v * (Q[1] - P[1])) / r;
    if (triv(p) || triv(rho) || Math.abs(p) > 40 || (Q[0] === h && Q[1] === k) || triv(Q[0]) || triv(Q[1]) || P.some((x) => x === 0)) return null;
    return PB("Le point " + M("T" + pt(P[0], P[1])) + " est sur le cercle " + M("\\Gamma : " + circ(h, k, r)) + ".",
      [["a) Pente de la tangente à " + M("\\Gamma") + " en " + M("T"), m], ["b) Ordonnée à l'origine de cette tangente", p], ["c) Rayon du cercle de centre " + M("Q" + pt(Q[0], Q[1])) + " tangent à cette droite (exact ou au centième)", rho, Number.isInteger(r6(rho * 100)) ? 0 : 0.01]],
      ["Trouve le centre C du cercle (complète les carrés). La tangente en T est perpendiculaire au rayon CT : pente = −1 ÷ (pente de CT).", "c) Le rayon cherché est la distance de Q à la tangente : écris-la sous la forme ax + by + c = 0 et utilise |a·x_Q + b·y_Q + c| ÷ √(a² + b²)."],
      "Centre " + M("C" + pt(h, k)) + " ; " + M("\\overrightarrow{CT} = (" + u + " \\,;\\, " + v + ")") + ", pente de " + M("CT") + " : " + M(F(v / u)) + ". a) " + M("m = " + F(m)) + ". b) " + M("y = " + F(m) + "x + p") + " passe par " + M("T") + " : " + M("p = " + P[1] + " - " + pr(m) + " \\cdot " + pr(P[0]) + " = " + F(p)) + ". c) Tangente : " + M(poly([u, 0]).replace(/x$/, "x") + sg(v) + "y" + sg(-(u * P[0] + v * P[1])) + " = 0") + ", distance " + M("\\frac{|" + u + " \\cdot " + pr(Q[0]) + sg(v) + " \\cdot " + pr(Q[1]) + sg(-(u * P[0] + v * P[1])) + "|}{" + r + "} = " + F(rho)) + ".");
  });

  // ---------- Chapitre 5 : exponentielles ----------
  PX("modexp", () => { /* E5.2 : valeur après n années, année de dépassement d'un seuil (log), taux pour atteindre le seuil plus tard */
    const ctx = pk([{ w: "La population d'une ville", lab: "Nombre d'habitants", pro: "elle", u: "habitants", c0: pk([24000, 38500, 52000, 71000]), rd: 1, rdw: "à l'unité" },
      { w: "La consommation d'électricité d'une région", lab: "Consommation (GWh)", pro: "elle", u: "GWh", c0: pk([840, 1250, 2300, 3600]), rd: 1, rdw: "à l'unité" },
      { w: "Le nombre d'abonnés d'un service en ligne", lab: "Nombre d'abonnés", pro: "il", u: "abonnés", c0: pk([15000, 42000, 64000, 120000]), rd: 1, rdw: "à l'unité" }]);
    const t = pk([1.5, 2.4, 3.2, 4.5, 5.6, 6.5]), Y0 = ri(2015, 2023), n = ri(5, 9), k = pk([1.5, 1.8, 2, 2.5]), S = ctx.c0 * k, ns = Math.log(k) / Math.log(1 + t / 100);
    if (ns - Math.floor(ns) < 0.08 || ns - Math.floor(ns) > 0.92) return null;
    const Ny = Y0 + Math.ceil(ns), N2 = Math.ceil(ns) + pk([8, 12, 15, 20]), t2 = (Math.pow(k, 1 / N2) - 1) * 100, Vn = ctx.c0 * Math.pow(1 + t / 100, n);
    return PB(ctx.w + " était de " + M(N(ctx.c0)) + " " + ctx.u + " en " + Y0 + " ; " + ctx.pro + " augmente de " + M(N(t) + " \\,\\%") + " par an.",
      [["a) " + ctx.lab + " en " + (Y0 + n) + " (" + ctx.rdw + ")", Math.round(Vn), 1], ["b) En quelle année dépassera-t-on " + M(N(S)) + " " + ctx.u + " ?", Ny], ["c) Quel taux annuel (en %, au centième) ne ferait atteindre ce seuil qu'en " + (Y0 + N2) + " ?", Math.round(t2 * 100) / 100, 0.01]],
      ["Chaque année, on multiplie par 1 + " + Td(t) + "/100 = " + Td(1 + t / 100) + " : V(n) = " + Td(ctx.c0) + " · " + Td(1 + t / 100) + "ⁿ.", "b) Résous " + Td(1 + t / 100) + "ⁿ > " + Td(k) + " avec le logarithme. c) (1 + t)^" + N2 + " = " + Td(k) + " : prends la racine " + N2 + "-ième."],
      "a) " + M(N(ctx.c0) + " \\cdot " + N(r6(1 + t / 100)) + "^{" + n + "} \\approx " + N(Math.round(Vn))) + ". b) " + M(N(r6(1 + t / 100)) + "^n > \\frac{" + N(S) + "}{" + N(ctx.c0) + "} = " + N(k) + " \\iff n > \\frac{\\log " + N(k) + "}{\\log " + N(r6(1 + t / 100)) + "} \\approx " + N(Math.round(ns * 100) / 100)) + ", donc " + M("n = " + Math.ceil(ns)) + " : en " + Ny + ". c) " + M("(1 + t)^{" + N2 + "} = " + N(k) + " \\iff t = \\sqrt[" + N2 + "]{" + N(k) + "} - 1 \\approx " + N(Math.round(t2 * 100) / 100) + " \\,\\%") + ".");
  });
  PX("expfrac", () => { /* E5.3 : exposant rationnel d'un quotient de racines, écriture avec une racine, valeur numérique */
    const RT = () => { const n = pk([2, 3, 4, 5, 6]); let e = ri(1, 7); if (e % n === 0) e += 1; return [n, e]; };
    const t = [RT(), RT(), RT(), RT()], r = t[0][1] / t[0][0] + t[1][1] / t[1][0] - t[2][1] / t[2][0] - t[3][1] / t[3][0];
    let D = 0; for (let d = 2; d <= 60 && !D; d++) if (Math.abs(r * d - Math.round(r * d)) < 1e-9) D = d;
    if (!D || r <= 1 || D > 12) return null;
    const num = Math.round(r * D), n0 = Math.floor(num / D), m = num - n0 * D, an = n0 === 1 ? "a" : "a^{" + n0 + "}";
    if (m < 2 || num > 20) return null;
    const rt = ([n, e]) => (n === 2 ? "\\sqrt{" : "\\sqrt[" + n + "]{") + (e === 1 ? "a" : "a^{" + e + "}") + "}";
    const val = 2 ** num;
    return PB("Soit " + M("a > 0") + " et " + M("E = \\dfrac{" + rt(t[0]) + " \\cdot " + rt(t[1]) + "}{" + rt(t[2]) + " \\cdot " + rt(t[3]) + "}") + ".",
      [["a) " + M("E = a^r") + " : valeur de " + M("r") + " (fraction)", r], ["b) On écrit " + M("E = " + an + " \\cdot \\sqrt[" + D + "]{a^m}") + " avec " + M("0 < m < " + D) + " : valeur de " + M("m"), m], ["c) Valeur de " + M("E") + " pour " + M("a = " + 2 ** D), val]],
      ["Écris chaque racine comme une puissance : ⁿ√(a^e) = a^(e/n). Produit : on additionne les exposants ; quotient : on soustrait.", "b) Sépare l'exposant en partie entière et reste : " + T(r) + " = " + n0 + " + " + m + "/" + D + ". c) " + 2 ** D + " = 2^" + D + "."],
      M("E = a^{" + t.map(([n, e]) => frac(e, n)).slice(0, 2).join(" + ") + " - " + frac(t[2][1], t[2][0]) + " - " + frac(t[3][1], t[3][0]) + "}") + ", a) " + M("r = " + F(r)) + ". b) " + M("a^{" + F(r) + "} = " + an + " \\cdot a^{" + frac(m, D) + "} = " + an + " \\sqrt[" + D + "]{a^{" + m + "}}") + ", " + M("m = " + m) + ". c) " + M("(2^{" + D + "})^{" + F(r) + "} = 2^{" + num + "} = " + N(val)) + ".");
  });

  // ---------- Chapitre 6 : composition, bijection, réciproque ----------
  PX("compo", () => { /* E6.1 : domaine de h∘f, expression simplifiée, équation */
    const a = R.nz(-4, 5), b = R.nz(-6, 6), c = R.nz(-5, 5), d = R.nz(-4, 5), e = R.nz(-6, 6), k = R.nz(-5, 5);
    if (a * c - b === 0 || d * k - e === 0 || a + k === 0) return null;
    let A = d * a + e, B = d * b + e * c, Cc = a + k, Dd = b + k * c; const x2 = -Dd / Cc, gg = gcd(gcd(A, B), gcd(Cc, Dd)) * (Cc < 0 ? -1 : 1);
    if (gg) { A /= gg; B /= gg; Cc /= gg; Dd /= gg; }
    if (A === 0 || B === 0 || Dd === 0 || A * Dd === B * Cc || x2 === -c || triv(x2) || triv(-c) || Math.abs(A) > 30 || Math.abs(B) > 40) return null;
    const xs = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    if (xs === -c || xs === x2) return null;
    const w = (A * xs + B) / (Cc * xs + Dd);
    if (triv(w) || w === A / Cc) return null;
    return PB("Soit " + M("f(x) = \\frac{" + poly([a, b]) + "}{" + poly([1, c]) + "}") + " et " + M("h(x) = \\frac{" + poly([d, e]) + "}{" + poly([1, k]) + "}") + ".",
      [["a) Valeurs à exclure du domaine de " + M("h \\circ f") + " (« ; », fractions acceptées)", SET([-c, x2])], ["b) " + M("(h \\circ f)(x)") + " sous la forme d'une seule fraction simplifiée", EX("(" + A + "*x+(" + B + "))/(" + Cc + "*x+(" + Dd + "))", "onefrac")], ["c) Solution de " + M("(h \\circ f)(x) = " + F(w)), xs]],
      ["Deux conditions : f(x) doit exister (x ≠ " + T(-c) + "), et f(x) ne doit pas être la valeur interdite de h (f(x) ≠ " + T(-k) + ").", "b) Remplace x par f(x) dans h, puis multiplie numérateur et dénominateur par " + pT([1, c]) + "."],
      "a) " + M("x \\neq " + (-c)) + " et " + M("f(x) \\neq " + (-k) + " \\iff " + poly([a, b]) + " \\neq " + (-k) + "(" + poly([1, c]) + ") \\iff x \\neq " + F(x2)) + ". b) " + M("(h \\circ f)(x) = \\frac{" + d + " \\cdot \\frac{" + poly([a, b]) + "}{" + poly([1, c]) + "}" + sg(e) + "}{\\frac{" + poly([a, b]) + "}{" + poly([1, c]) + "}" + sg(k) + "} = \\frac{" + poly([A, B]) + "}{" + poly([Cc, Dd]) + "}") + ". c) " + M("\\frac{" + poly([A, B]) + "}{" + poly([Cc, Dd]) + "} = " + F(w) + " \\iff x = " + xs) + " (valeur permise).");
  });
  PX("decomp", () => { /* décomposer pour trouver un extremum : h = f∘g avec g(x) = (x − p)² */
    const p = pk([-5, -4, -3, -2, 2, 3, 4, 5]), q = ri(2, 9), a = ri(2, 12);
    if (a === q || a % q === 0 && triv(a / q)) return null;
    return PB("Soit " + M("h(x) = \\frac{" + a + "}{" + poly([1, -2 * p, p * p + q]) + "}") + ". On veut écrire " + M("h = f \\circ g") + " avec " + M("g(x) = (x - p)^2") + " et " + M("f(x) = \\frac{" + a + "}{x + q}") + ".",
      [["a) Valeur de " + M("p"), p], ["b) Valeur de " + M("q"), q], ["c) Valeur maximale de " + M("h") + " (fraction acceptée)", a / q]],
      ["Complète le carré : x² " + (p > 0 ? "− " : "+ ") + Math.abs(2 * p) + "x = (" + xmT(p) + ")² − " + p * p + ".", "c) g(x) ≥ 0, et f est décroissante sur [0 ; +∞[ : h est maximale quand g(x) = 0."],
      M(poly([1, -2 * p, p * p + q]) + " = (" + xm(p) + ")^2 + " + q) + ", a) " + M("p = " + p) + ", b) " + M("q = " + q) + ". c) " + M("(" + xm(p) + ")^2 \\geq 0") + ", donc " + M("h(x) \\leq \\frac{" + a + "}{" + q + "}" + (gcd(a, q) > 1 ? " = " + F(a / q) : "")) + ", atteint en " + M("x = " + p) + ".");
  });
  PX("decomp", () => {
    const p = pk([-5, -4, -3, -2, 2, 3, 4, 5]), q = ri(2, 4), b = pk([2, 3]);
    return PB("Soit " + M("h(x) = " + b + "^{" + poly([1, -2 * p, p * p + q]) + "}") + ". On veut écrire " + M("h = f \\circ g") + " avec " + M("g(x) = (x - p)^2 + q") + " et " + M("f(x) = " + b + "^x") + ".",
      [["a) Valeur de " + M("p"), p], ["b) Valeur de " + M("q"), q], ["c) Valeur minimale de " + M("h"), b ** q]],
      ["Complète le carré dans l'exposant : x² " + (p > 0 ? "− " : "+ ") + Math.abs(2 * p) + "x = (" + xmT(p) + ")² − " + p * p + ".", "c) g(x) ≥ " + q + " et f est croissante : h est minimale quand g est minimale."],
      M(poly([1, -2 * p, p * p + q]) + " = (" + xm(p) + ")^2 + " + q) + ", a) " + M("p = " + p) + ", b) " + M("q = " + q) + ". c) " + M("g(x) \\geq " + q) + " et " + M(b + "^x") + " est croissante : " + M("h(x) \\geq " + b + "^{" + q + "} = " + b ** q) + ", atteint en " + M("x = " + p) + ".");
  });
  PX("bijection", () => { /* E6.2 : plus grand intervalle d'injectivité, image, antécédent */
    const a = pk([-2, -1, 1, 2]), h = pk([-5, -4, -3, -2, 2, 3, 4, 5]), k = pk([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]), L = ri(2, 4), right = R.rand() < 0.5, q = right ? h + L : h - L;
    const f = (x) => a * (x - h) ** 2 + k, fq = f(q), tt = ri(1, L - 1), x0 = right ? h + tt : h - tt, v = f(x0), lo = Math.min(k, fq), hi = Math.max(k, fq);
    if (triv(lo) || triv(hi) || triv(x0) || triv(q) || Math.abs(fq) > 40) return null;
    const A = right ? "[m \\,;\\, " + q + "]" : "[" + q + " \\,;\\, m]";
    return PB("Soit " + M("f(x) = " + poly([a, -2 * a * h, a * h * h + k])) + ". On considère " + M("A = " + A) + " avec " + M("m") + " " + (right ? "le plus petit" : "le plus grand") + " possible pour que " + M("f") + " soit injective sur " + M("A") + ", et " + M("B = f(A) = [u \\,;\\, w]") + ".",
      [["a) Valeur de " + M("m"), h], ["b) Valeur de " + M("u"), lo], ["c) Valeur de " + M("w"), hi], ["d) Antécédent de " + X(v) + " dans " + M("A"), x0]],
      ["Mets f sous forme canonique a(x − h)² + k : la parabole change de sens de variation au sommet.", "Sur A, f est monotone : B a pour bornes les images des bornes de A. d) Résous f(x) = " + T(v) + " et garde la solution dans A."],
      M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "(" + xm(h) + ")^2" + sg(k)) + " : sommet en " + M("x = " + h) + ", a) " + M("m = " + h) + ". " + M("f(" + h + ") = " + k) + " et " + M("f(" + q + ") = " + fq) + " : b) c) " + M("B = [" + lo + " \\,;\\, " + hi + "]") + ". d) " + M("(" + xm(h) + ")^2 = " + tt * tt + " \\iff x = " + h + " \\pm " + tt) + " ; dans " + M("A") + " : " + M("x = " + x0) + ".");
  });
  PX("recip", () => { /* E6.2 : restriction d'une parabole, image, expression de la réciproque */
    const a = pk([-2, -1, 1, 2]), h = pk([-5, -4, -3, -2, 2, 3, 4, 5]), k = a > 0 ? -ri(2, 6) : ri(2, 6), right = R.rand() < 0.5, tt = pk([2, 3]), v = k + a * tt * tt, ans = right ? h + tt : h - tt;
    if (triv(ans) || triv(v)) return null;
    const ex = h + (right ? "+" : "-") + "sqrt((x-(" + k + "))/(" + a + "))";
    const rad = (v) => (a > 0 ? (a === 1 ? v + sg(-k) : "\\frac{" + v + sg(-k) + "}{" + a + "}") : a === -1 ? k + " - " + v : "\\frac{" + k + " - " + v + "}{" + -a + "}");
    const Atx = right ? "[m \\,;\\, +\\infty[" : "]-\\infty \\,;\\, m]", Btx = a > 0 ? "[" + k + " \\,;\\, +\\infty[" : "]-\\infty \\,;\\, " + k + "]";
    return PB("Soit " + M("f(x) = " + poly([a, -2 * a * h, a * h * h + k])) + ". On la restreint à " + M("A = " + Atx) + ", avec " + M("m") + " choisi pour que " + M("A") + " soit le plus grand possible et " + M("f") + " injective sur " + M("A") + ". Elle devient une bijection de " + M("A") + " vers " + M("B = f(A)") + ".",
      [["a) Valeur de " + M("m"), h], ["b) Borne finie de " + M("B"), k], ["c) " + M("f^{-1}(" + v + ")"), ans], ["d) Expression de " + M("f^{-1}(x)"), EX(ex)]],
      ["Forme canonique : f(x) = a(x − h)² + k. Le sommet donne m et la borne de B.", "Pose y = f(x) et isole (x − h)², puis prends la racine : son signe dépend de A (x ≥ m ou x ≤ m)."],
      M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "(" + xm(h) + ")^2" + sg(k)) + ". a) " + M("m = " + h) + ", b) " + M("B = " + Btx) + ". c) " + M("(" + xm(h) + ")^2 = " + tt * tt) + ", et " + M("x " + (right ? "\\geq" : "\\leq") + " " + h) + " : " + M("x = " + ans) + ". d) " + M("y = " + (a === 1 ? "" : a === -1 ? "-" : a) + "(" + xm(h) + ")^2" + sg(k) + " \\iff (" + xm(h) + ")^2 = " + rad("y")) + ", donc " + M("f^{-1}(x) = " + h + (right ? " + " : " - ") + "\\sqrt{" + rad("x") + "}") + ".");
  });

  // ---------- Chapitre 7 : logarithmes ----------
  PX("logbase", () => { /* changement de base dans une équation : log_{b^m} x ± log_b x = K */
    const b = pk([2, 3]), m = pk([2, 3]), plus = R.rand() < 0.6, j = b === 3 ? pk([1, 2]) : pk([1, 2, 3]), L = m * j, K = plus ? j * (m + 1) : j * (m - 1), y = plus ? L : -L, x = b ** y;
    if (triv(K) || L > 9) return null;
    return PB("Résous l'équation " + M("\\log_{" + b ** m + "} x " + (plus ? "+" : "-") + " \\log_{" + b + "} x = " + K) + ".",
      [["a) " + M("\\log_{" + b ** m + "} x = c \\cdot \\log_{" + b + "} x") + " : valeur de " + M("c") + " (fraction)", 1 / m], ["b) Valeur de " + M("\\log_{" + b + "} x"), y], ["c) Solution " + M("x") + " (fraction acceptée)", x]],
      ["Changement de base : log_" + b ** m + " x = log_" + b + " x ÷ log_" + b + " " + b ** m + ".", "Remplace, puis résous l'équation du 1er degré en y = log_" + b + " x. Enfin x = " + b + "^y."],
      "a) " + M("\\log_{" + b + "} " + b ** m + " = " + m) + ", donc " + M("\\log_{" + b ** m + "} x = \\frac{1}{" + m + "} \\log_{" + b + "} x") + ". b) " + M("\\left(\\frac{1}{" + m + "} " + (plus ? "+" : "-") + " 1\\right) y = " + K + " \\iff y = " + y) + ". c) " + M("x = " + b + "^{" + y + "} = " + F(x)) + ".");
  });
  PX("logbase", () => { /* E7.3 : a^(x + p) = b^x → x = log_{b/a}(a^p) */
    const [a, b] = pk([[2, 3], [2, 5], [3, 5], [3, 7], [2, 7], [5, 7], [3, 4], [4, 5]]), p = pk([2, 3]), x = (p * Math.log(a)) / (Math.log(b) - Math.log(a));
    return PB("Résous l'équation " + M(a + "^{x + " + p + "} = " + b + "^x") + ".",
      [["a) On écrit la solution " + M("x = \\log_c d") + " : valeur de " + M("c") + " (fraction acceptée)", b / a], ["b) Valeur de " + M("d"), a ** p], ["c) Valeur de " + M("x") + " (au millième)", Math.round(x * 1000) / 1000, 0.001]],
      ["Développe : " + a + "^(x + " + p + ") = " + a + "^x · " + a ** p + ". Regroupe les puissances d'exposant x d'un côté.", "(" + b + "/" + a + ")^x = " + a ** p + " ⟺ x = log_(" + b + "/" + a + ") " + a ** p + " = ln " + a ** p + " ÷ ln(" + b + "/" + a + ")."],
      M(a + "^x \\cdot " + a ** p + " = " + b + "^x \\iff \\left(\\frac{" + b + "}{" + a + "}\\right)^x = " + a ** p) + ", a) b) " + M("x = \\log_{" + frac(b, a) + "} " + a ** p) + ". c) " + M("x = \\frac{\\ln " + a ** p + "}{\\ln " + frac(b, a) + "} \\approx " + N(Math.round(x * 1000) / 1000)) + ".");
  });

  // ---------- Chapitre 10 : vecteurs ----------
  PX("vecteurs", () => { /* E1.1, E10.1 : parallélogramme, angle, aire */
    const A = [ri(-5, 5), ri(-5, 5)], B = [ri(-6, 6), ri(-6, 6)], Cp = [ri(-6, 6), ri(-6, 6)], D = [A[0] + Cp[0] - B[0], A[1] + Cp[1] - B[1]];
    const u = [B[0] - A[0], B[1] - A[1]], v = [D[0] - A[0], D[1] - A[1]], det = u[0] * v[1] - u[1] * v[0], dot = u[0] * v[0] + u[1] * v[1];
    if (Math.abs(det) < 6 || dot === 0 || D.some((z) => Math.abs(z) > 9 || z === 0) || u.some((z) => z === 0) || v.some((z) => z === 0)) return null;
    const ang = (Math.acos(dot / Math.hypot(...u) / Math.hypot(...v)) * 180) / Math.PI;
    return PB("On donne " + M("A" + pt(...A)) + ", " + M("B" + pt(...B)) + " et " + M("C" + pt(...Cp)) + ".",
      [["a) Coordonnées de " + M("D") + " pour que " + M("ABCD") + " soit un parallélogramme (« x ; y »)", PAIR(D[0], D[1])], ["b) Angle " + M("\\widehat{BAD}") + " (en degrés, au centième)", Math.round(ang * 100) / 100, 0.01], ["c) Aire du parallélogramme " + M("ABCD"), Math.abs(det)]],
      ["ABCD parallélogramme ⟺ vecteur AB = vecteur DC, donc D = A + C − B.", "b) cos α = (AB · AD) ÷ (‖AB‖ · ‖AD‖). c) Aire = ‖AB‖ · ‖AD‖ · sin α, ou |x₁y₂ − x₂y₁| avec les composantes de AB et AD."],
      "a) " + M("D = A + \\overrightarrow{BC} = " + pt(...D)) + ". b) " + M("\\overrightarrow{AB} = (" + u[0] + " \\,;\\, " + u[1] + ")") + ", " + M("\\overrightarrow{AD} = (" + v[0] + " \\,;\\, " + v[1] + ")") + ", " + M("\\cos\\alpha = \\frac{" + dot + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\cdot \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + N(Math.round(ang * 100) / 100) + "°") + ". c) " + M("|" + pr(u[0]) + " \\cdot " + pr(v[1]) + " - " + pr(u[1]) + " \\cdot " + pr(v[0]) + "| = " + Math.abs(det)) + ".");
  });
})();
