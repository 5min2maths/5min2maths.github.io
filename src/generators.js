// Générateurs de questions : un par notion, 3 niveaux de difficulté (1 = bases, 3 = approfondi).
// Chaque générateur rend { q, spec, sol } : énoncé (HTML + TeX entre \( \)), spécification de la
// réponse pour checkAnswer(), corrigé court. Les nombres sont tirés au hasard ; les réponses sont
// calculées, jamais saisies à la main.

const R = {
  int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  nz: (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; },
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  sign: () => (Math.random() < 0.5 ? -1 : 1),
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const M = (t) => "\\(" + t + "\\)";
const dec = (v) => String(+(+v).toFixed(10)).replace(".", "{,}");
const decTxt = (v) => String(+(+v).toFixed(10)).replace(".", ",");
const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  if (d === 1) return String(n);
  return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}";
}
// Polynôme en x à partir de coefficients [a_n … a_0] (degré = longueur - 1).
function poly(cs, x = "x") {
  const deg = cs.length - 1;
  let out = "";
  cs.forEach((c, i) => {
    const p = deg - i;
    if (c === 0) return;
    const abs = Math.abs(c);
    const coef = p === 0 ? String(abs) : abs === 1 ? "" : String(abs);
    const term = coef + (p === 0 ? "" : p === 1 ? x : x + "^" + p);
    out += out === "" ? (c < 0 ? "-" : "") + term : (c < 0 ? " - " : " + ") + term;
  });
  return out || "0";
}
const plain = (t) => t.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)").replace(/\\cdot/g, "*").replace(/[{}\\]/g, "").replace(/ /g, "");

const GEN = {
  prio(d) {
    if (d === 1) {
      const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
      return { fig: FIG.blocks(b + " groupes de " + c + ", puis + " + a), q: "Calcule : " + M(a + " + " + b + " \\cdot " + c), spec: { kind: "value", value: a + b * c }, sol: M(a + " + " + b * c + " = " + (a + b * c)) + " : la multiplication passe avant l'addition." };
    }
    if (d === 2) {
      const a = R.int(10, 30), b = R.int(2, 6), c = R.int(5, 9), e = R.int(1, 4);
      return { q: "Calcule : " + M(a + " - " + b + " \\cdot (" + c + " - " + e + ")"), spec: { kind: "value", value: a - b * (c - e) }, sol: M(a + " - " + b + " \\cdot " + (c - e) + " = " + a + " - " + b * (c - e) + " = " + (a - b * (c - e))) };
    }
    const a = R.int(2, 6), b = R.int(1, 5), e = R.int(2, 5), k = R.int(2, 6), c = e * k, dd = R.int(2, 5);
    const v = (a + b) ** 2 - c * dd / e;
    return { q: "Calcule : " + M("(" + a + " + " + b + ")^2 - " + c + " \\cdot " + dd + " : " + e), spec: { kind: "value", value: v }, sol: M((a + b) ** 2 + " - " + c * dd + " : " + e + " = " + (a + b) ** 2 + " - " + c * dd / e + " = " + v) };
  },

  rel(d) {
    if (d === 1) {
      const a = R.nz(-12, 12), b = R.nz(-12, 12);
      return { fig: FIG.numberLine(a, [b]), q: "Calcule : " + M(par(a) + " + " + par(b)), spec: { kind: "value", value: a + b }, sol: M(par(a) + " + " + par(b) + " = " + (a + b)) };
    }
    if (d === 2) {
      const a = R.nz(-9, 9), b = R.int(2, 6), c = R.nz(-6, 6);
      return { fig: FIG.numberLine(a, [-b * c]), q: "Calcule : " + M(par(a) + " - " + b + " \\cdot " + par(c)), spec: { kind: "value", value: a - b * c }, sol: M(par(a) + " - " + par(b * c) + " = " + (a - b * c)) };
    }
    const a = R.int(2, 5), b = R.int(2, 3);
    const v = -(a ** 2) + (-a) ** 2 - (-b) ** 3;
    return { q: "Calcule : " + M("-" + a + "^2 + (-" + a + ")^2 - (-" + b + ")^3"), spec: { kind: "value", value: v }, sol: M("-" + a * a + " + " + a * a + " - (" + (-(b ** 3)) + ") = " + v) + " : " + M("-" + a + "^2") + " vaut " + M("-" + a * a) + ", mais " + M("(-" + a + ")^2 = " + a * a) + "." };
  },

  fracadd(d) {
    if (d === 1) {
      const b = R.int(3, 9), a = R.int(1, b - 1), c = R.int(1, b - 1);
      return { fig: FIG.fractionBars([[a, b], [c, b]]), q: "Calcule et simplifie : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + b + "}"), spec: { kind: "value", value: (a + c) / b }, sol: M("\\frac{" + (a + c) + "}{" + b + "}" + (gcd(a + c, b) > 1 ? " = " + frac(a + c, b) : "")) };
    }
    if (d === 2) {
      let b, e; do { b = R.int(2, 9); e = R.int(2, 9); } while (b === e);
      const a = R.int(1, b - 1), c = R.int(1, e - 1);
      return { fig: FIG.fractionBars([[a, b], [c, e]]), q: "Calcule et simplifie : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + e + "}"), spec: { kind: "value", value: a / b + c / e }, sol: M("\\frac{" + a * e + " + " + c * b + "}{" + b * e + "} = " + frac(a * e + c * b, b * e)) + " (dénominateur commun)." };
    }
    const b = R.pick([2, 3, 4]), e = R.pick([3, 4, 6]), f = 12;
    const a = R.int(1, b), c = R.int(1, e), g = R.int(1, 11);
    const num = a * (f / b) - c * (f / e) + g;
    return { q: "Calcule et simplifie : " + M("\\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + e + "} + \\frac{" + g + "}{12}"), spec: { kind: "value", value: num / 12 }, sol: M("\\frac{" + a * (f / b) + " - " + c * (f / e) + " + " + g + "}{12} = " + frac(num, 12)) };
  },

  fracmul(d) {
    if (d === 1) {
      const a = R.int(1, 9), b = R.int(2, 9), c = R.int(1, 9), e = R.int(2, 9);
      return { fig: FIG.fractionBars([[a, b], [c, e]]), q: "Calcule et simplifie : " + M("\\frac{" + a + "}{" + b + "} \\cdot \\frac{" + c + "}{" + e + "}"), spec: { kind: "value", value: (a * c) / (b * e) }, sol: M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "} = " + frac(a * c, b * e)) };
    }
    if (d === 2) {
      const a = R.int(1, 9), b = R.int(2, 9), c = R.int(1, 9), e = R.int(2, 9);
      return { q: "Calcule et simplifie : " + M("\\frac{" + a + "}{" + b + "} : \\frac{" + c + "}{" + e + "}"), spec: { kind: "value", value: (a * e) / (b * c) }, sol: "Diviser, c'est multiplier par l'inverse : " + M("\\frac{" + a + "}{" + b + "} \\cdot \\frac{" + e + "}{" + c + "} = " + frac(a * e, b * c)) };
    }
    const a = R.int(1, 3), b = 4, c = R.int(1, 2), e = 3, f = R.int(2, 5), g = R.int(2, 7);
    const inner = a / b - c / e;
    return { q: "Calcule et simplifie : " + M("\\left(\\frac{" + a + "}{4} - \\frac{" + c + "}{3}\\right) : \\frac{" + f + "}{" + g + "}"), spec: { kind: "value", value: inner * g / f }, sol: M("\\frac{" + (3 * a - 4 * c) + "}{12} \\cdot \\frac{" + g + "}{" + f + "} = " + frac((3 * a - 4 * c) * g, 12 * f)) };
  },

  pct(d) {
    if (d === 1) {
      const p = R.pick([10, 20, 25, 50, 75]), n = 20 * R.int(2, 15);
      return { fig: FIG.percentBar(p, n), q: "Calcule " + M(p + "\\,\\%") + " de " + M(n) + ".", spec: { kind: "value", value: (p * n) / 100 }, sol: M("\\frac{" + p + "}{100} \\cdot " + n + " = " + dec((p * n) / 100)) };
    }
    if (d === 2) {
      const p = R.pick([10, 20, 25, 30, 40]), n = 10 * R.int(3, 20), up = Math.random() < 0.5;
      const v = n * (1 + (up ? p : -p) / 100);
      return { fig: FIG.percentBar(p, n, " CHF"), q: "Un article coûte " + M(n) + " CHF. Son prix " + (up ? "augmente" : "baisse") + " de " + M(p + "\\,\\%") + ". Quel est le nouveau prix ?", spec: { kind: "value", value: v }, sol: M(n + " \\cdot " + dec(1 + (up ? p : -p) / 100) + " = " + dec(v)) + " CHF." };
    }
    const p = R.pick([10, 20, 25, 50]), n = 4 * R.int(5, 30), f = n * (1 + p / 100);
    return { q: "Après une hausse de " + M(p + "\\,\\%") + ", un prix vaut " + M(dec(f)) + " CHF. Quel était le prix de départ ?", spec: { kind: "value", value: n }, sol: M(dec(f) + " : " + dec(1 + p / 100) + " = " + n) + " CHF (on divise, on ne retire pas " + p + " %)." };
  },

  puiss(d) {
    if (d === 1) {
      const a = R.pick([2, 3, 10]), m = R.int(1, 3), n = R.int(1, 3);
      return { fig: FIG.blocks(a + "^" + m + " · " + a + "^" + n), q: "Calcule : " + M(a + "^" + m + " \\cdot " + a + "^" + n), spec: { kind: "value", value: a ** (m + n) }, sol: M(a + "^{" + (m + n) + "} = " + a ** (m + n)) };
    }
    if (d === 2) {
      const m = R.int(2, 7), n = R.int(-6, -1);
      return { q: "Écris sous la forme d'une puissance de 10, puis calcule si tu veux : " + M("10^{" + m + "} \\cdot 10^{" + n + "}"), spec: { kind: "value", value: 10 ** (m + n) }, sol: M("10^{" + m + " + (" + n + ")} = 10^{" + (m + n) + "}") + " (on accepte aussi " + M(dec(10 ** (m + n))) + ")." };
    }
    const a = R.pick([2, 3]), m = R.int(2, 3), n = 2, k = R.int(2, 5);
    return { q: "Calcule : " + M("\\frac{(" + a + "^" + m + ")^" + n + "}{" + a + "^" + k + "}"), spec: { kind: "value", value: a ** (m * n - k) }, sol: M(a + "^{" + m * n + " - " + k + "} = " + a + "^{" + (m * n - k) + "}" + " = " + frac(m * n - k >= 0 ? a ** (m * n - k) : 1, m * n - k >= 0 ? 1 : a ** (k - m * n))) };
  },

  sci(d) {
    if (d === 1) {
      const m = R.int(11, 99) / 10, e = R.int(-5, -2);
      const v = m * 10 ** e;
      return { fig: FIG.sciScale(e), q: "Écris " + M(dec(v)) + " en notation scientifique (par exemple " + M("2{,}5 \\cdot 10^{-3}") + ").", spec: { kind: "value", value: v }, sol: M(dec(v) + " = " + dec(m) + " \\cdot 10^{" + e + "}") };
    }
    if (d === 2) {
      const a = R.int(2, 9), b = R.int(2, 9), m = R.int(3, 8), n = R.int(-6, -2);
      const v = a * b * 10 ** (m + n);
      const mant = a * b >= 10 ? a * b / 10 : a * b, ex = a * b >= 10 ? m + n + 1 : m + n;
      return { q: "Calcule et donne le résultat en notation scientifique : " + M("(" + a + " \\cdot 10^{" + m + "}) \\cdot (" + b + " \\cdot 10^{" + n + "})"), spec: { kind: "value", value: v }, sol: M(a * b + " \\cdot 10^{" + (m + n) + "} = " + dec(mant) + " \\cdot 10^{" + ex + "}") };
    }
    const b = R.pick([2, 4, 5]), q = R.int(1, 9) * b, m = R.int(5, 9), n = R.int(-4, -1);
    const v = (q / b) * 10 ** (m - n);
    return { q: "Calcule : " + M("(" + q + " \\cdot 10^{" + m + "}) : (" + b + " \\cdot 10^{" + n + "})"), spec: { kind: "value", value: v }, sol: M(q / b + " \\cdot 10^{" + m + " - (" + n + ")} = " + q / b + " \\cdot 10^{" + (m - n) + "}") };
  },

  rac(d) {
    if (d === 1) {
      const k = R.int(2, 20);
      return { fig: FIG.areaSquare("aire " + k * k), q: "Calcule " + M("\\sqrt{" + k * k + "}") + ".", spec: { kind: "value", value: k }, sol: M("\\sqrt{" + k * k + "} = " + k) + " car " + M(k + "^2 = " + k * k) + "." };
    }
    if (d === 2) {
      const k = R.int(2, 7), m = R.pick([2, 3, 5, 6, 7]);
      return { fig: FIG.areaSquare("aire " + k * k * m), q: "Écris " + M("\\sqrt{" + k * k * m + "}") + " sous la forme " + M("a\\sqrt{b}") + " (tape par exemple " + M("3\\sqrt{2}") + " avec la touche √).", spec: { kind: "value", value: k * Math.sqrt(m) }, sol: M("\\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}") };
    }
    const m = R.pick([2, 3, 5]), a = R.int(2, 4), b = R.int(2, 5);
    return { q: "Simplifie : " + M("\\sqrt{" + a * a * m + "} + \\sqrt{" + b * b * m + "}"), spec: { kind: "value", value: (a + b) * Math.sqrt(m) }, sol: M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}") };
  },

  valnum(d) {
    const x = R.nz(-5, 5);
    if (d === 1) {
      const a = R.nz(-6, 6), b = R.nz(-9, 9);
      return { fig: FIG.numberLine(0, [x]), q: "Calcule " + M(poly([a, b])) + " pour " + M("x = " + x) + ".", spec: { kind: "value", value: a * x + b }, sol: M(a + " \\cdot " + par(x) + (b < 0 ? " - " + -b : " + " + b) + " = " + (a * x + b)) };
    }
    if (d === 2) {
      const a = R.nz(-4, 4), b = R.nz(-6, 6);
      return { q: "Calcule " + M(poly([a, b, 0])) + " pour " + M("x = " + x) + ".", spec: { kind: "value", value: a * x * x + b * x }, sol: M(a + " \\cdot " + par(x) + "^2 " + (b < 0 ? "- " + -b : "+ " + b) + " \\cdot " + par(x) + " = " + (a * x * x + b * x)) };
    }
    let a, b; do { a = R.int(-6, 8); b = R.nz(-6, 6); } while (a + b === 0);
    return { q: "Calcule " + M("\\frac{(a - b)^2}{a + b}") + " pour " + M("a = " + a) + " et " + M("b = " + b) + ".", spec: { kind: "value", value: (a - b) ** 2 / (a + b) }, sol: M("\\frac{" + par(a - b) + "^2}{" + (a + b) + "} = " + frac((a - b) ** 2, a + b)) };
  },

  reduire(d) {
    if (d === 1) {
      const a = R.int(2, 9), b = R.nz(-9, 9), c = R.nz(-5, 5), e = R.nz(-9, 9);
      const t = poly([a, b]) + (c < 0 ? " - " : " + ") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + "x" + (e < 0 ? " - " : " + ") + Math.abs(e);
      return { q: "Réduis : " + M(t), spec: { kind: "expr", expr: (a + c) + "x+(" + (b + e) + ")", form: "expanded" }, sol: M(poly([a + c, b + e])) };
    }
    if (d === 2) {
      const a = R.int(2, 6), b = R.nz(-6, 6), c = R.nz(-5, 5), e = R.nz(-6, 6), f = R.nz(-9, 9);
      const t = poly([a, b, 0]) + (c < 0 ? " - " : " + ") + Math.abs(c) + "x^2" + (e < 0 ? " - " : " + ") + Math.abs(e) + "x" + (f < 0 ? " - " : " + ") + Math.abs(f);
      return { q: "Réduis : " + M(t), spec: { kind: "expr", expr: (a + c) + "x^2+(" + (b + e) + ")x+(" + f + ")", form: "expanded" }, sol: M(poly([a + c, b + e, f])) };
    }
    const a = R.int(2, 5), b = R.int(1, 7), c = R.int(2, 5), e = R.int(1, 7);
    return { q: "Réduis : " + M("-(" + a + "x - " + b + ") + " + c + "(x - " + e + ")"), spec: { kind: "expr", expr: "-" + a + "x+" + b + "+" + c + "x-" + c * e, form: "expanded" }, sol: M("-" + a + "x + " + b + " + " + c + "x - " + c * e + " = " + poly([c - a, b - c * e])) };
  },

  distrib(d) {
    if (d === 1) {
      const k = R.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), a = R.int(1, 6), b = R.nz(-9, 9);
      return { fig: FIG.tiles(160, 70, poly([a, b]).replace(/\^2/g,"²"), String(k)), q: "Développe : " + M(k + "(" + poly([a, b]) + ")"), spec: { kind: "expr", expr: k + "*(" + a + "x+(" + b + "))", form: "expanded" }, sol: M(poly([k * a, k * b])) };
    }
    if (d === 2) {
      const a = R.nz(-8, 8), b = R.nz(-8, 8);
      return { fig: FIG.tiles(170, 90, "x " + (a < 0 ? "− " + -a : "+ " + a), "x " + (b < 0 ? "− " + -b : "+ " + b)), q: "Développe et réduis : " + M("(" + poly([1, a]) + ")(" + poly([1, b]) + ")"), spec: { kind: "expr", expr: "(x+(" + a + "))(x+(" + b + "))", form: "expanded" }, sol: M("x^2 " + (b < 0 ? "- " + -b : "+ " + b) + "x " + (a < 0 ? "- " + -a : "+ " + a) + "x " + (a * b < 0 ? "- " + -a * b : "+ " + a * b) + " = " + poly([1, a + b, a * b])) };
    }
    const a = R.int(2, 5), b = R.nz(-7, 7), c = R.int(2, 5), e = R.nz(-7, 7);
    return { q: "Développe et réduis : " + M("(" + poly([a, b]) + ")(" + poly([c, e]) + ")"), spec: { kind: "expr", expr: "(" + a + "x+(" + b + "))(" + c + "x+(" + e + "))", form: "expanded" }, sol: M(poly([a * c, a * e + b * c, b * e])) };
  },

  idrem(d) {
    const a = R.int(1, 9);
    if (d === 1) return { fig: FIG.tiles(120, 120, "x + " + a, "x + " + a), q: "Développe : " + M("(x + " + a + ")^2"), spec: { kind: "expr", expr: "(x+" + a + ")^2", form: "expanded" }, sol: M("x^2 + 2 \\cdot " + a + "x + " + a + "^2 = " + poly([1, 2 * a, a * a])) };
    if (d === 2) {
      if (Math.random() < 0.5) return { q: "Développe : " + M("(x - " + a + ")^2"), spec: { kind: "expr", expr: "(x-" + a + ")^2", form: "expanded" }, sol: M(poly([1, -2 * a, a * a])) + " (n'oublie pas le double produit)." };
      return { q: "Développe : " + M("(x + " + a + ")(x - " + a + ")"), spec: { kind: "expr", expr: "x^2-" + a * a, form: "expanded" }, sol: M("x^2 - " + a * a) };
    }
    const k = R.int(2, 5), b = R.int(1, 7);
    return { q: "Développe : " + M("(" + k + "x - " + b + ")^2"), spec: { kind: "expr", expr: "(" + k + "x-" + b + ")^2", form: "expanded" }, sol: M(k * k + "x^2 - " + 2 * k * b + "x + " + b * b) };
  },

  factor(d) {
    if (d === 1) {
      const g = R.int(2, 6), a = R.int(1, 5), b = R.nz(-7, 7);
      if (gcd(a, b) !== 1) return GEN.factor(1);
      return { fig: FIG.tiles(170, 70, "?", "?"), q: "Factorise : " + M(poly([g * a, g * b, 0])), spec: { kind: "expr", expr: g + "x(" + a + "x+(" + b + "))", form: "product" }, sol: M(g + "x(" + poly([a, b]) + ")") + " : mise en évidence de " + M(g + "x") + "." };
    }
    if (d === 2) {
      const a = R.int(1, 9), k = R.pick([1, 1, 2, 3]);
      const t = (k === 1 ? "" : k * k) + "x^2 - " + a * a;
      return { q: "Factorise : " + M(t), spec: { kind: "expr", expr: "(" + k + "x-" + a + ")(" + k + "x+" + a + ")", form: "product" }, sol: M("(" + (k === 1 ? "" : k) + "x - " + a + ")(" + (k === 1 ? "" : k) + "x + " + a + ")") + " : identité " + M("a^2 - b^2") + "." };
    }
    if (Math.random() < 0.5) {
      const a = R.nz(-9, 9);
      return { q: "Factorise : " + M(poly([1, 2 * a, a * a])), spec: { kind: "expr", expr: "(x+(" + a + "))^2", form: "product" }, sol: M("(" + poly([1, a]) + ")^2") };
    }
    let a, b; do { a = R.nz(-8, 8); b = R.nz(-8, 8); } while (a === -b || a === b);
    return { q: "Factorise : " + M(poly([1, a + b, a * b])), spec: { kind: "expr", expr: "(x+(" + a + "))(x+(" + b + "))", form: "product" }, sol: M("(" + poly([1, a]) + ")(" + poly([1, b]) + ")") + " : deux nombres de somme " + M(a + b) + " et de produit " + M(a * b) + "." };
  },

  eq1(d) {
    if (d === 1) {
      const a = R.nz(-6, 7), x = R.nz(-9, 9), b = R.nz(-12, 12);
      return { fig: FIG.balance(poly([a, b]).replace(/\^2/g,"²"), String(a * x + b)), q: "Résous : " + M(poly([a, b]) + " = " + (a * x + b)), spec: { kind: "value", value: x }, sol: M(a + "x = " + (a * x + b - b) + " \\iff x = " + x) };
    }
    if (d === 2) {
      let a, c; do { a = R.int(2, 6); c = R.int(1, 5); } while (a === c);
      const b = R.nz(-6, 6), e = R.nz(-9, 9);
      const x = (e - a * b) / (a - c);
      return { fig: FIG.balance(a + "(x " + (b < 0 ? "− " + -b : "+ " + b) + ")", poly([c, e])), q: "Résous : " + M(a + "(x " + (b < 0 ? "- " + -b : "+ " + b) + ") = " + poly([c, e])), spec: { kind: "value", value: x }, sol: M(a + "x " + (a * b < 0 ? "- " + -a * b : "+ " + a * b) + " = " + poly([c, e]) + " \\iff " + (a - c) + "x = " + (e - a * b) + " \\iff x = " + frac(e - a * b, a - c)) };
    }
    const p = R.pick([2, 3, 4]), r = R.pick([3, 5, 6]), b = R.nz(-5, 5);
    if (p === r) return GEN.eq1(3);
    // x/p + b = x/r  →  x(1/p - 1/r) = -b
    const x = -b / (1 / p - 1 / r);
    return { q: "Résous : " + M("\\frac{x}{" + p + "} " + (b < 0 ? "- " + -b : "+ " + b) + " = \\frac{x}{" + r + "}"), spec: { kind: "value", value: x }, sol: "On multiplie par " + M(p * r / gcd(p, r)) + " : la solution est " + M("x = " + frac(-b * p * r, r - p)) + "." };
  },

  eq2(d) {
    if (d === 1) {
      const a = R.nz(-9, 9), b = R.nz(-9, 9);
      return { q: "Résous : " + M("(" + poly([1, -a]) + ")(" + poly([1, b]) + ") = 0") + ". Sépare les solutions par « ; ».", spec: { kind: "set", values: [...new Set([a, -b])] }, sol: "Un produit est nul si l'un des facteurs est nul : " + M("x = " + a) + " ou " + M("x = " + -b) + "." };
    }
    if (d === 2) {
      const k = R.int(2, 12);
      return { q: "Résous : " + M("x^2 - " + k + "x = 0") + ". Sépare les solutions par « ; ».", spec: { kind: "set", values: [0, k] }, sol: M("x(x - " + k + ") = 0") + " : " + M("x = 0") + " ou " + M("x = " + k) + "." };
    }
    const a = R.int(2, 5), b = R.int(1, 9);
    if (gcd(a, b) !== 1) return GEN.eq2(3);
    return { q: "Résous : " + M(a * a + "x^2 - " + b * b + " = 0") + ". Sépare les solutions par « ; ».", spec: { kind: "set", values: [b / a, -b / a] }, sol: M("(" + a + "x - " + b + ")(" + a + "x + " + b + ") = 0") + " : " + M("x = " + frac(b, a)) + " ou " + M("x = -" + frac(b, a)) + "." };
  },

  prop(d) {
    if (d === 1) {
      const k = R.int(2, 6), u = R.int(2, 9), n = R.int(2, 12);
      return { fig: FIG.items(k, k + " cahiers → " + k * u + " CHF"), q: M(k) + " cahiers coûtent " + M(k * u) + " CHF. Combien coûtent " + M(n) + " cahiers ?", spec: { kind: "value", value: n * u }, sol: "Un cahier coûte " + M(u) + " CHF, donc " + M(n + " \\cdot " + u + " = " + n * u) + " CHF." };
    }
    if (d === 2) {
      const g = 25 * R.int(4, 16), p1 = R.pick([4, 6, 8]), p2 = R.pick([3, 5, 10, 12]);
      return { fig: FIG.items(p1, p1 + " personnes → " + g + " g"), q: "Pour " + M(p1) + " personnes, une recette demande " + M(g) + " g de farine. Combien en faut-il pour " + M(p2) + " personnes ?", spec: { kind: "value", value: (g * p2) / p1 }, sol: M("\\frac{" + g + "}{" + p1 + "} \\cdot " + p2 + " = " + dec((g * p2) / p1)) + " g." };
    }
    const rate = R.pick([0.92, 0.94, 0.95, 1.05, 1.08]), e = 10 * R.int(2, 30);
    return { q: "1 euro vaut " + M(dec(rate)) + " CHF. Combien d'euros obtient-on pour " + M(dec(e * rate)) + " CHF ?", spec: { kind: "value", value: e }, sol: M(dec(e * rate) + " : " + dec(rate) + " = " + e) + " euros." };
  },

  vitesse(d) {
    if (d === 1) {
      const v = 10 * R.int(3, 12), t = R.int(2, 5);
      return { fig: FIG.road(v * t + " km", t + " h"), q: "Une voiture parcourt " + M(v * t) + " km en " + M(t) + " h. Quelle est sa vitesse moyenne (en km/h) ?", spec: { kind: "value", value: v }, sol: M("v = \\frac{" + v * t + "}{" + t + "} = " + v) + " km/h." };
    }
    if (d === 2) {
      const v = R.pick([60, 72, 80, 90, 120]), mins = R.pick([15, 20, 30, 40, 45]), dist = (v * mins) / 60;
      return { fig: FIG.road(FIG.fmt(dist) + " km", v + " km/h"), q: "À " + M(v) + " km/h, combien de minutes faut-il pour parcourir " + M(dec(dist)) + " km ?", spec: { kind: "value", value: mins }, sol: M("t = \\frac{" + dec(dist) + "}{" + v + "} \\text{ h} = " + mins) + " min." };
    }
    const v = 18 * R.int(1, 7);
    return { q: "Convertis " + M(v) + " km/h en m/s.", spec: { kind: "value", value: v / 3.6 }, sol: M(v + " : 3{,}6 = " + dec(v / 3.6)) + " m/s." };
  },

  echelle(d) {
    if (d === 1) {
      const k = R.pick([100, 200, 500, 1000]), c = R.int(2, 12);
      return { fig: FIG.scaling(k, "1:" + k), q: "Sur un plan à l'échelle " + M("1 : " + k) + ", un mur mesure " + M(c) + " cm. Quelle est sa longueur réelle, en mètres ?", spec: { kind: "value", value: (c * k) / 100 }, sol: M(c + " \\cdot " + k + " = " + c * k) + " cm, soit " + M(dec((c * k) / 100)) + " m." };
    }
    if (d === 2) {
      const k = R.int(2, 5), A = R.int(2, 12);
      return { fig: FIG.scaling(k, "aires × " + k * k), q: "On agrandit une figure de rapport " + M(k) + ". Son aire était de " + M(A) + " cm². Quelle est sa nouvelle aire (en cm²) ?", spec: { kind: "value", value: A * k * k }, sol: "Les aires sont multipliées par " + M(k + "^2 = " + k * k) + " : " + M(A * k * k) + " cm²." };
    }
    const k = R.int(2, 4), V = R.int(2, 9);
    return { fig: FIG.scaling(k, "volumes × " + k ** 3), q: "Une maquette est " + M(k) + " fois plus petite que l'objet réel. Son volume est de " + M(V) + " dm³. Quel est le volume de l'objet réel (en dm³) ?", spec: { kind: "value", value: V * k ** 3 }, sol: "Les volumes sont multipliés par " + M(k + "^3 = " + k ** 3) + " : " + M(V * k ** 3) + " dm³." };
  },

  aires(d) {
    if (d === 1) {
      const b = R.int(3, 15), h = 2 * R.int(2, 8);
      return { fig: FIG.triangleFig(b + " cm", h + " cm"), q: "Calcule l'aire d'un triangle de base " + M(b) + " cm et de hauteur " + M(h) + " cm (en cm²).", spec: { kind: "value", value: (b * h) / 2 }, sol: M("\\frac{" + b + " \\cdot " + h + "}{2} = " + (b * h) / 2) + " cm²." };
    }
    if (d === 2) {
      const B = R.int(6, 14), b = R.int(2, B - 2), h = 2 * R.int(2, 6);
      return { fig: FIG.trapezoid(B + " cm", b + " cm", h + " cm"), q: "Calcule l'aire d'un trapèze de bases " + M(B) + " cm et " + M(b) + " cm, de hauteur " + M(h) + " cm (en cm²).", spec: { kind: "value", value: ((B + b) * h) / 2 }, sol: M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + ((B + b) * h) / 2) + " cm²." };
    }
    const r = R.int(2, 9);
    return { fig: FIG.disk("r = " + r + " cm"), q: "Calcule l'aire d'un disque de rayon " + M(r) + " cm (valeur exacte avec π, ou arrondie au centième).", spec: { kind: "value", value: Math.PI * r * r, round: 0.01, exactOk: true }, sol: M("\\pi \\cdot " + r + "^2 = " + r * r + "\\pi \\approx " + dec((Math.PI * r * r).toFixed(2))) + " cm²." };
  },

  pyth(d) {
    const tr = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10]]), k = R.int(1, 3);
    const [a, b, c] = tr.map((v) => v * k);
    if (d === 1) return { fig: FIG.rightTriangle([a + " cm", b + " cm", "?"]), q: "Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Calcule l'hypoténuse (en cm).", spec: { kind: "value", value: c }, sol: M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm." };
    if (d === 2) return { fig: FIG.rightTriangle([a + " cm", "?", c + " cm"]), q: "Dans un triangle rectangle, l'hypoténuse mesure " + M(c) + " cm et une cathète " + M(a) + " cm. Calcule l'autre cathète (en cm).", spec: { kind: "value", value: b }, sol: M("\\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + b * b + "} = " + b) + " cm." };
    const s = R.int(2, 9);
    return { fig: FIG.square(s + " cm"), q: "Calcule la diagonale d'un carré de côté " + M(s) + " cm (valeur exacte, ou arrondie au centième).", spec: { kind: "value", value: s * Math.SQRT2, round: 0.01, exactOk: true }, sol: M("\\sqrt{" + s + "^2 + " + s + "^2} = " + s + "\\sqrt{2} \\approx " + dec((s * Math.SQRT2).toFixed(2))) + " cm." };
  },

  vol(d) {
    if (d === 1) {
      const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
      return { fig: FIG.box(a + " cm", b + " cm", c + " cm"), q: "Calcule le volume d'un pavé droit de " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm (en cm³).", spec: { kind: "value", value: a * b * c }, sol: M(a + " \\cdot " + b + " \\cdot " + c + " = " + a * b * c) + " cm³." };
    }
    if (d === 2) {
      const c = R.int(2, 9), h = 3 * R.int(1, 5);
      return { fig: FIG.pyramid(c + " cm", "h = " + h), q: "Calcule le volume d'une pyramide à base carrée de côté " + M(c) + " cm et de hauteur " + M(h) + " cm (en cm³).", spec: { kind: "value", value: (c * c * h) / 3 }, sol: M("\\frac{" + c + "^2 \\cdot " + h + "}{3} = " + (c * c * h) / 3) + " cm³." };
    }
    const r = R.int(1, 6), h = 3 * R.int(1, 4);
    return { fig: FIG.cone("r = " + r, "h = " + h), q: "Calcule le volume d'un cône de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm (valeur exacte avec π, ou arrondie au centième).", spec: { kind: "value", value: (Math.PI * r * r * h) / 3, round: 0.01, exactOk: true }, sol: M("\\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} = " + (r * r * h) / 3 + "\\pi \\approx " + dec(((Math.PI * r * r * h) / 3).toFixed(2))) + " cm³." };
  },

  thales(d) {
    const k = R.pick([2, 3, 4]), ad = R.int(2, 6), ae = R.int(2, 6), de = R.int(2, 7);
    const ab = ad * k, ac = ae * k, bc = de * k;
    if (d === 1) return { fig: FIG.thales([[95, 96, "?"], [165, 168, String(bc)]]), q: "Dans un triangle " + M("ABC") + ", " + M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)") + ". On sait que " + M("AD = " + ad) + ", " + M("AB = " + ab) + " et " + M("BC = " + bc) + ". Calcule " + M("DE") + ".", spec: { kind: "value", value: de }, sol: M("\\frac{DE}{BC} = \\frac{AD}{AB} = \\frac{" + ad + "}{" + ab + "}") + ", donc " + M("DE = " + bc + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + de) + "." };
    if (d === 2) return { fig: FIG.thales([[110, 52, String(ad)], [80, 124, String(ab - ad)], [205, 52, String(ae)]]), q: "Même configuration de Thalès : " + M("AD = " + ad) + ", " + M("DB = " + (ab - ad)) + " et " + M("AE = " + ae) + ". Calcule " + M("AC") + ".", spec: { kind: "value", value: ac }, sol: M("AB = " + ab) + " ; " + M("AC = " + ae + " \\cdot \\frac{" + ab + "}{" + ad + "} = " + ac) + "." };
    const b = R.pick([1, 1.2, 1.5, 2]), o = R.pick([1.5, 2, 2.5]), O = R.int(4, 12) * o;
    return { q: "Un bâton vertical de " + M(dec(b)) + " m a une ombre de " + M(dec(o)) + " m. Au même moment, l'ombre d'un arbre mesure " + M(dec(O)) + " m. Quelle est la hauteur de l'arbre (en m) ?", spec: { kind: "value", value: (b * O) / o }, sol: M("h = " + dec(b) + " \\cdot \\frac{" + dec(O) + "}{" + dec(o) + "} = " + dec((b * O) / o)) + " m." };
  },

  affine(d) {
    const a = R.nz(-5, 5), b = R.nz(-9, 9);
    if (d === 1) {
      const x = R.nz(-6, 6);
      return { fig: FIG.lineGraph(a, b, [[x, a * x + b, "?"]]), q: "Soit " + M("f(x) = " + poly([a, b])) + ". Calcule " + M("f(" + x + ")") + ".", spec: { kind: "value", value: a * x + b }, sol: M("f(" + x + ") = " + a + " \\cdot " + par(x) + (b < 0 ? " - " + -b : " + " + b) + " = " + (a * x + b)) };
    }
    if (d === 2) {
      const x1 = R.int(-4, 1), x2 = x1 + R.int(1, 4);
      return { fig: FIG.lineGraph(a, b, [[x1, a * x1 + b, "A"], [x2, a * x2 + b, "B"]]), q: "Une droite passe par " + M("A(" + x1 + " ; " + (a * x1 + b) + ")") + " et " + M("B(" + x2 + " ; " + (a * x2 + b) + ")") + ". Calcule sa pente.", spec: { kind: "value", value: a }, sol: M("\\frac{" + (a * x2 + b) + " - " + par(a * x1 + b) + "}{" + x2 + " - " + par(x1) + "} = " + a) };
    }
    const x = R.nz(-6, 6), y = a * x + b;
    return { q: "Soit " + M("f(x) = " + poly([a, b])) + ". Pour quelle valeur de " + M("x") + " a-t-on " + M("f(x) = " + y) + " ?", spec: { kind: "value", value: x }, sol: M(poly([a, b]) + " = " + y + " \\iff x = " + x) };
  },
};
