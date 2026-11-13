// Générateurs de questions : un par notion, 3 niveaux de difficulté (1 = bases, 3 = approfondi).
// Chaque générateur rend { q, spec, sol } : énoncé (HTML + TeX entre \( \)), spécification de la
// réponse pour checkAnswer(), corrigé court. Les nombres sont tirés au hasard ; les réponses sont
// calculées, jamais saisies à la main.

// Hasard reproductible : chaque question a une graine (notée dans son code), pour retrouver
// exactement la question qu'un élève a vue (mulberry32).
const R = {
  _s: 1,
  seed(n) { R._s = (n >>> 0) || 1; },
  rand() { let t = (R._s = (R._s + 0x6d2b79f5) >>> 0); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; },
  int: (a, b) => a + Math.floor(R.rand() * (b - a + 1)),
  nz: (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; },
  pick: (arr) => arr[Math.floor(R.rand() * arr.length)],
  sign: () => (R.rand() < 0.5 ? -1 : 1),
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
      return { fig: FIG.numberLine(a, []), q: "Calcule : " + M(par(a) + " + " + par(b)), spec: { kind: "value", value: a + b }, sol: M(par(a) + " + " + par(b) + " = " + (a + b)) };
    }
    if (d === 2) {
      const a = R.nz(-9, 9), b = R.int(2, 6), c = R.nz(-6, 6);
      return { q: "Calcule : " + M(par(a) + " - " + b + " \\cdot " + par(c)), spec: { kind: "value", value: a - b * c }, sol: M(par(a) + " - " + par(b * c) + " = " + (a - b * c)) };
    }
    // Niveau 3 varié (audit 13.11) : puissances de relatifs et priorités, le résultat change à chaque fois.
    const a = R.int(2, 5), b = R.int(2, 4), c = R.int(2, 3), form = R.int(0, 2);
    if (form === 0) { const v = -(a ** 2) - (-b) ** 2 + c * (-2) ** 3;
      return { q: "Calcule : " + M("-" + a + "^2 - (-" + b + ")^2 + " + c + " \\cdot (-2)^3"), spec: { kind: "value", value: v }, sol: M("-" + a * a + " - " + b * b + " + " + c + " \\cdot (-8) = " + v) + " : " + M("-" + a + "^2 = -" + a * a) + " (le carré ne porte que sur " + M(a) + "), " + M("(-" + b + ")^2 = " + b * b) + "." }; }
    if (form === 1) { const v = (-a) ** 3 * (-b) ** 2;
      return { q: "Calcule : " + M("(-" + a + ")^3 \\cdot (-" + b + ")^2"), spec: { kind: "value", value: v }, sol: M("(-" + a + ")^3 = " + (-(a ** 3))) + " (exposant impair : négatif), " + M("(-" + b + ")^2 = " + b * b) + " ; produit : " + M(String(v)) + "." }; }
    const k = R.int(2, 6), v = -(b ** 2) * k / -b + (-c) ** 2;
    return { q: "Calcule : " + M("-" + b + "^2 \\cdot " + k + " : (-" + b + ") + (-" + c + ")^2"), spec: { kind: "value", value: v }, sol: M("-" + b * b + " \\cdot " + k + " : (-" + b + ") + " + c * c + " = " + (-(b * b) * k) + " : (-" + b + ") + " + c * c + " = " + (b * k) + " + " + c * c + " = " + v) + "." };
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
      if (a === b || c === e) return GEN.fracmul(1);
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
      const p = R.pick([10, 20, 25, 30, 40]), n = 10 * R.int(3, 20), up = R.rand() < 0.5;
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
      return { fig: FIG.areaSquare("aire " + k * k * m), q: "Écris " + M("\\sqrt{" + k * k * m + "}") + " sous la forme " + M("a\\sqrt{b}") + " (tape par exemple " + M("3\\sqrt{2}") + " avec la touche √).", spec: { kind: "value", value: k * Math.sqrt(m), radical: true }, canon: k + "√" + m, sol: M("\\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}") };
    }
    const m = R.pick([2, 3, 5]), a = R.int(2, 4), b = R.int(2, 5);
    return { q: "Simplifie : " + M("\\sqrt{" + a * a * m + "} + \\sqrt{" + b * b * m + "}") + " (réponse sous la forme " + M("a\\sqrt{b}") + ").", spec: { kind: "value", value: (a + b) * Math.sqrt(m), radical: true }, canon: (a + b) + "√" + m, sol: M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}") };
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
      if (R.rand() < 0.5) return { q: "Développe : " + M("(x - " + a + ")^2"), spec: { kind: "expr", expr: "(x-" + a + ")^2", form: "expanded" }, sol: M(poly([1, -2 * a, a * a])) + " (n'oublie pas le double produit)." };
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
    if (R.rand() < 0.5) {
      const a = R.nz(-9, 9);
      return { q: "Factorise : " + M(poly([1, 2 * a, a * a])), spec: { kind: "expr", expr: "(x+(" + a + "))^2", form: "product" }, sol: M("(" + poly([1, a]) + ")^2") };
    }
    let a, b; do { a = R.nz(-8, 8); b = R.nz(-8, 8); } while (a === -b || a === b);
    return { q: "Factorise : " + M(poly([1, a + b, a * b])), spec: { kind: "expr", expr: "(x+(" + a + "))(x+(" + b + "))", form: "product" }, sol: M("(" + poly([1, a]) + ")(" + poly([1, b]) + ")") + " : deux nombres de somme " + M(a + b) + " et de produit " + M(a * b) + "." };
  },

  eq1(d) {
    if (d === 1) {
      const a = R.nz(-6, 7), x = R.nz(-9, 9), b = R.nz(-12, 12);
      return { fig: FIG.balance(poly([a, b]).replace(/\^2/g,"²"), String(a * x + b)), q: "Résous : " + M(poly([a, b]) + " = " + (a * x + b)), spec: { kind: "value", value: x }, sol: "On " + (b > 0 ? "soustrait " + b : "ajoute " + -b) + " des deux côtés : " + M((a === 1 ? "" : a === -1 ? "-" : a) + "x = " + (a * x + b) + (b > 0 ? " - " + b : " + " + -b) + " = " + a * x) + (a === 1 ? "." : ", puis on divise par " + M(par(a)) + " : " + M("x = " + x) + ".") };
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
      return { fig: FIG.scaling(k, ""), q: "On agrandit une figure de rapport " + M(k) + ". Son aire était de " + M(A) + " cm². Quelle est sa nouvelle aire (en cm²) ?", spec: { kind: "value", value: A * k * k }, sol: "Les aires sont multipliées par " + M(k + "^2 = " + k * k) + " : " + M(A * k * k) + " cm²." };
    }
    const k = R.int(2, 4), V = R.int(2, 9);
    return { fig: FIG.scaling(k, ""), q: "Une maquette est " + M(k) + " fois plus petite que l'objet réel. Son volume est de " + M(V) + " dm³. Quel est le volume de l'objet réel (en dm³) ?", spec: { kind: "value", value: V * k ** 3 }, sol: "Les volumes sont multipliés par " + M(k + "^3 = " + k ** 3) + " : " + M(V * k ** 3) + " dm³." };
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
    if (d === 2) return { fig: FIG.thales([[110, 52, String(ad)], [80, 124, String(ab - ad)], [205, 52, String(ae)]]), q: "Dans un triangle " + M("ABC") + ", " + M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)") + ". On sait que " + M("AD = " + ad) + ", " + M("DB = " + (ab - ad)) + " et " + M("AE = " + ae) + ". Calcule " + M("AC") + ".", spec: { kind: "value", value: ac }, sol: M("AB = AD + DB = " + ab) + " ; Thalès : " + M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AC = " + ae + " \\cdot \\frac{" + ab + "}{" + ad + "} = " + ac) + "." };
    const b = R.pick([1, 1.2, 1.5, 2]), o = R.pick([1.5, 2, 2.5]), O = R.int(4, 12) * o;
    return { fig: GF.shadows(b, o, O, { h: decTxt(b) + " m", s: decTxt(o) + " m", S: decTxt(O) + " m", H: "?" }), q: "Un bâton vertical de " + M(dec(b)) + " m a une ombre de " + M(dec(o)) + " m. Au même moment, l'ombre d'un arbre mesure " + M(dec(O)) + " m. Quelle est la hauteur de l'arbre (en m) ?", spec: { kind: "value", value: (b * O) / o }, sol: M("h = " + dec(b) + " \\cdot \\frac{" + dec(O) + "}{" + dec(o) + "} = " + dec((b * O) / o)) + " m." };
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

// ---------- Secondaire II : 1re du Collège ----------
Object.assign(GEN, {
  eq3(d) {
    if (d === 1) {
      const k = R.int(1, 9);
      return { fig: FIG.balance("x³ − " + k * k + "x", "0"), q: "Résous : " + M("x^3 - " + k * k + "x = 0") + ". Sépare les solutions par « ; ».", spec: { kind: "set", values: [0, k, -k] }, sol: M("x(x^2 - " + k * k + ") = x(x - " + k + ")(x + " + k + ") = 0") + " : " + M("S = \\{-" + k + " ; 0 ; " + k + "\\}") };
    }
    if (d === 2) {
      const b = R.nz(-9, 9);
      return { q: "Résous : " + M("x^3 " + (b < 0 ? "- " + -b : "+ " + b) + "x^2 = 0") + ".", spec: { kind: "set", values: [0, -b] }, sol: M("x^2(x " + (b < 0 ? "- " + -b : "+ " + b) + ") = 0") + " : " + M("S = \\{0 ; " + -b + "\\}") + " (0 est une solution double)." };
    }
    const a = R.nz(-5, 5), b = R.int(1, 6);
    if (a === b || a === -b) return GEN.eq3(3);
    return { q: "Résous : " + M("(x " + (a < 0 ? "+ " + -a : "- " + a) + ")(x^2 - " + b * b + ") = 0") + ".", spec: { kind: "set", values: [a, b, -b] }, sol: M("(x " + (a < 0 ? "+ " + -a : "- " + a) + ")(x - " + b + ")(x + " + b + ") = 0") + " : " + M("S = \\{" + [a, b, -b].sort((u, v) => u - v).join(" ; ") + "\\}") };
  },

  eq2disc(d) {
    if (d === 1) {
      const p = R.nz(-8, 8), q = R.nz(-8, 8), b = -(p + q), c = p * q;
      return { fig: FIG.balance(poly([1, b, c]).replace(/\^2/g, "²"), "0"), q: "Résous : " + M(poly([1, b, c]) + " = 0") + ".", spec: { kind: "set", values: [...new Set([p, q])] }, sol: M("\\Delta = " + par(b) + "^2 - 4 \\cdot " + par(c) + " = " + (b * b - 4 * c)) + " ; " + M("x = \\frac{" + -b + " \\pm " + Math.abs(p - q) + "}{2}") + " : " + (p === q ? "discriminant nul, une seule solution : " : "") + M("S = \\{" + [...new Set([p, q])].sort((u, v) => u - v).join(" ; ") + "\\}") };
    }
    if (d === 2) {
      if (R.rand() < 0.3) {
        const a = R.int(1, 3), b = R.int(-3, 3), c = R.int(Math.ceil((b * b) / (4 * a)) + 1, 9);
        return { fig: FIG.balance(poly([a, b, c]).replace(/\^2/g, "²"), "0"), q: "Résous : " + M(poly([a, b, c]) + " = 0") + ". (S'il n'y a pas de solution, écris « aucune ».)", spec: { kind: "set", values: [] }, sol: M("\\Delta = " + (b * b - 4 * a * c) + " < 0") + " : aucune solution réelle, la parabole ne coupe pas l'axe des x." };
      }
      const a = R.int(2, 4), p = R.nz(-5, 5), q = R.int(1, 5);
      // a(x - p)(x - q/a) = a x² - (a p + q) x + p q
      const B = -(a * p + q), C = p * q;
      return { q: "Résous : " + M(poly([a, B, C]) + " = 0") + ".", spec: { kind: "set", values: [...new Set([p, q / a])] }, sol: M("\\Delta = " + (B * B - 4 * a * C)) + " ; " + M("x = \\frac{" + -B + " \\pm " + Math.round(Math.sqrt(B * B - 4 * a * C)) + "}{" + 2 * a + "}") + " : " + (p * a === q ? "discriminant nul, une seule solution : " + M("S = \\{" + p + "\\}") : M("S = \\{" + p + " ; " + frac(q, a) + "\\}")) };
    }
    let b, c, D;
    do { b = R.int(-6, 6); c = R.int(-6, 4); D = b * b - 4 * c; } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
    return { fig: FIG.balance(poly([1, b, c]).replace(/\^2/g, "²"), "0"), q: "Résous : " + M(poly([1, b, c]) + " = 0") + " (valeurs exactes, par exemple " + M("(3 + \\sqrt{5})/2") + ").", spec: { kind: "set", values: [(-b + Math.sqrt(D)) / 2, (-b - Math.sqrt(D)) / 2] }, sol: M("\\Delta = " + D) + " ; " + M("x = \\frac{" + -b + " \\pm \\sqrt{" + D + "}}{2}") };
  },

  sys2(d) {
    const x = R.nz(-6, 8), y = R.nz(-6, 8);
    if (d === 1) return { q: "Résous le système " + M("\\begin{cases} x + y = " + (x + y) + " \\\\ x - y = " + (x - y) + " \\end{cases}") + ". Réponds « x ; y ».", spec: { kind: "pair", values: [x, y] }, sol: "En additionnant : " + M("2x = " + 2 * x) + ", donc " + M("x = " + x) + " et " + M("y = " + y) + "." };
    if (d === 2) {
      let a, b, c, e; do { a = R.nz(-5, 5); b = R.nz(-5, 5); c = R.nz(-5, 5); e = R.nz(-5, 5); } while (a * e - b * c === 0);
      return { q: "Résous le système " + M("\\begin{cases} " + poly([a, 0]).replace("x", "x") + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "y = " + (a * x + b * y) + " \\\\ " + poly([c, 0]) + (e < 0 ? " - " + (e === -1 ? "" : -e) : " + " + (e === 1 ? "" : e)) + "y = " + (c * x + e * y) + " \\end{cases}") + ". Réponds « x ; y ».", spec: { kind: "pair", values: [x, y] }, sol: "Par combinaison ou substitution : " + M("(x ; y) = (" + x + " ; " + y + ")") + "." };
    }
    const pa = R.int(12, 20), pe = R.int(5, 10), na = R.int(2, 6), ne = R.int(2, 6), nb = R.int(1, 5), nf = R.int(1, 5);
    if (na * nf === nb * ne) return GEN.sys2(3);
    return { q: M(na) + " billets adultes et " + M(ne) + " billets enfants coûtent " + M(na * pa + ne * pe) + " CHF ; " + M(nb) + " adultes et " + M(nf) + " enfants coûtent " + M(nb * pa + nf * pe) + " CHF. Prix d'un billet adulte et d'un billet enfant ? Réponds « adulte ; enfant ».", spec: { kind: "pair", values: [pa, pe] }, sol: M("\\begin{cases} " + na + "a + " + ne + "e = " + (na * pa + ne * pe) + " \\\\ " + nb + "a + " + nf + "e = " + (nb * pa + nf * pe) + " \\end{cases}") + " : " + M("a = " + pa) + " CHF, " + M("e = " + pe) + " CHF." };
  },

  fimg(d) {
    if (d === 1) {
      const b = R.nz(-5, 5), c = R.nz(-6, 6), x = R.nz(-4, 4);
      return { fig: FIG.parabola((t) => (t * t + b * t + c) / 3, [[x, (x * x + b * x + c) / 3, "?"]]), q: "Soit " + M("f(x) = " + poly([1, b, c])) + ". Calcule " + M("f(" + x + ")") + ".", spec: { kind: "value", value: x * x + b * x + c }, sol: M(par(x) + "^2 " + (b < 0 ? "- " + -b : "+ " + b) + " \\cdot " + par(x) + (c < 0 ? " - " + -c : " + " + c) + " = " + (x * x + b * x + c)) };
    }
    if (d === 2) {
      const k = R.int(-5, 5), r = R.int(1, 6);
      return { q: "Soit " + M("f(x) = \\sqrt{x " + (k < 0 ? "- " + -k : "+ " + k) + "}") + ". Calcule " + M("f(" + (r * r - k) + ")") + ".", spec: { kind: "value", value: r }, sol: M("\\sqrt{" + (r * r - k) + " " + (k < 0 ? "- " + -k : "+ " + k) + "} = \\sqrt{" + r * r + "} = " + r) };
    }
    const c = R.int(-6, 4), v = R.int(1, 7), y = v * v + c;
    return { fig: FIG.parabola((t) => (t * t + c) / 3, [], null, false), q: "Soit " + M("f(x) = x^2 " + (c < 0 ? "- " + -c : c > 0 ? "+ " + c : "")) + ". Détermine les préimages de " + M(y) + ".", spec: { kind: "set", values: [v, -v] }, sol: M("x^2 = " + v * v) + " : " + M("x = " + v) + " ou " + M("x = -" + v) + "." };
  },

  f2(d) {
    if (d === 1) {
      const p = R.nz(-5, 5), q = R.nz(-5, 5);
      return { fig: FIG.parabola((x) => (x - p) * (x - q) / 3, [], null, false), q: "Quels sont les zéros de " + M("f(x) = (x " + (p < 0 ? "+ " + -p : "- " + p) + ")(x " + (q < 0 ? "+ " + -q : "- " + q) + ")") + " ?", spec: { kind: "set", values: [...new Set([p, q])] }, sol: "Un produit est nul si un facteur est nul : " + M(p) + " et " + M(q) + "." };
    }
    if (d === 2) {
      const h = R.nz(-4, 4), k = R.int(-6, 6);
      const b = -2 * h, c = h * h + k;
      return { fig: FIG.parabola((x) => (x * x + b * x + c) / 3, [], null, false), q: "Détermine le sommet de " + M("f(x) = " + poly([1, b, c])) + ". Réponds « x ; y ».", spec: { kind: "pair", values: [h, k] }, sol: M("x_S = -\\frac{b}{2a} = " + h) + " ; " + M("f(" + h + ") = " + k) + " : " + M("S(" + h + " ; " + k + ")") };
    }
    const a = R.pick([-2, -1, 2, 3]), b = R.nz(-6, 6), c = R.int(-5, 5);
    const xs = -b / (2 * a), ys = a * xs * xs + b * xs + c;
    return { fig: FIG.parabola((x) => (a * x * x + b * x + c) / 4, [], null, false), q: "Détermine le sommet de " + M("f(x) = " + poly([a, b, c])) + ". Réponds « x ; y » (fractions acceptées).", spec: { kind: "pair", values: [xs, ys] }, sol: M("x_S = -\\frac{" + b + "}{" + 2 * a + "} = " + frac(-b, 2 * a)) + " ; " + M("y_S = f(x_S) = " + frac(Math.round(ys * 4 * a * a), 4 * a * a)) };
  },

  inter(d) {
    if (d === 1) {
      const p = R.int(-3, 0), q = R.int(1, 4);
      // x² = (p + q) x - p q
      return { fig: FIG.parabola((x) => x * x / 3, [], (x) => ((p + q) * x - p * q) / 3, false), q: "Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = x^2") + " et " + M("g(x) = " + poly([p + q, -p * q])) + " se coupent-ils ?", spec: { kind: "set", values: [...new Set([p, q])] }, sol: M("x^2 = " + poly([p + q, -p * q]) + " \\iff " + poly([1, -(p + q), p * q]) + " = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + "." };
    }
    // f(x) = x² + B x + c et g(x) = m x + k, choisis pour que f(x) - g(x) = (x - p)(x - q)
    const p = R.nz(-4, 3), q = p + R.int(1, 5), m = R.nz(-3, 3), c = R.int(-5, 5);
    const B = m - (p + q), k = c - p * q;
    return { fig: FIG.parabola((x) => (x * x + B * x + c) / 4, [], (x) => (m * x + k) / 4, false), q: "Détermine les abscisses des points d'intersection de " + M("f(x) = " + poly([1, B, c])) + " et " + M("g(x) = " + poly([m, k])) + ".", spec: { kind: "set", values: [p, q] }, sol: M("f(x) = g(x) \\iff " + poly([1, -(p + q), p * q]) + " = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + "." };
  },

  angles(d) {
    const ins = R.int(15, 80);
    if (d === 1) return { fig: FIG.circleAngles("?", ins + "°"), q: "Dans un cercle de centre " + M("O") + ", l'angle inscrit " + M("\\widehat{ACB}") + " mesure " + M(ins + "°") + ". Que mesure l'angle au centre " + M("\\widehat{AOB}") + " (en degrés) ?", spec: { kind: "value", value: 2 * ins }, sol: "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc : " + M(2 * ins + "°") + "." };
    if (d === 2) return { fig: FIG.circleAngles(2 * ins + "°", "?"), q: "L'angle au centre " + M("\\widehat{AOB}") + " mesure " + M(2 * ins + "°") + ". Que mesure l'angle inscrit " + M("\\widehat{ACB}") + " ?", spec: { kind: "value", value: ins }, sol: M(2 * ins + "° : 2 = " + ins + "°") };
    const a = R.int(20, 70);
    return { fig: GF.diam(2 * a, { lA: a + "°", lB: "?" }), q: M("[AB]") + " est un diamètre d'un cercle et " + M("C") + " un point du cercle. Si " + M("\\widehat{CAB} = " + a + "°") + ", que mesure " + M("\\widehat{CBA}") + " ?", spec: { kind: "value", value: 90 - a }, sol: "Un angle inscrit dans un demi-cercle est droit : " + M("\\widehat{ACB} = 90°") + ", donc " + M("180° - 90° - " + a + "° = " + (90 - a) + "°") + "." };
  },

  euclide(d) {
    const p = R.int(1, 9), q = R.int(1, 9), h2 = p * q;
    if (d === 1) {
      const pp = R.pick([1, 2, 3, 4]), qq = R.pick([4, 9, 16, 1]) * pp;
      return { fig: FIG.trigTriangle(["p = " + pp + " ; q = " + qq, "", "h = ?"], ""), q: "Dans un triangle rectangle, la hauteur issue de l'angle droit découpe l'hypoténuse en " + M("p = " + pp) + " et " + M("q = " + qq) + ". Calcule la hauteur " + M("h") + ".", spec: { kind: "value", value: Math.sqrt(pp * qq) }, sol: M("h^2 = p \\cdot q = " + pp * qq) + ", donc " + M("h = " + dec(Math.sqrt(pp * qq))) + "." };
    }
    if (d === 2) return { q: "Dans un triangle rectangle d'hypoténuse " + M("c = " + (p + q)) + ", la projection d'une cathète " + M("a") + " sur l'hypoténuse mesure " + M(p) + ". Calcule " + M("a") + " (valeur exacte ou au centième).", spec: { kind: "value", value: Math.sqrt(p * (p + q)), round: 0.01, exactOk: true }, sol: "Euclide : " + M("a^2 = " + p + " \\cdot " + (p + q) + " = " + p * (p + q)) + ", donc " + M("a = \\sqrt{" + p * (p + q) + "} \\approx " + dec(Math.sqrt(p * (p + q)).toFixed(2))) + "." };
    return { fig: GF.altitude(p, q, { lp: p + " cm", lq: "?", lh: "h = √" + h2 }), q: "Dans un triangle rectangle, la hauteur sur l'hypoténuse mesure " + M("h = \\sqrt{" + h2 + "}") + " et découpe l'hypoténuse en deux segments dont l'un mesure " + M(p) + ". Que mesure l'autre ?", spec: { kind: "value", value: q }, sol: M("h^2 = p \\cdot q") + " : " + M(h2 + " = " + p + " \\cdot q") + ", donc " + M("q = " + q) + "." };
  },

  trigo(d) {
    const a = R.int(20, 70), hyp = R.int(4, 15);
    if (d === 1) return { fig: FIG.trigTriangle(["", "?", hyp + " cm"], a + "°"), q: "Dans un triangle rectangle, l'hypoténuse mesure " + M(hyp) + " cm et un angle aigu " + M(a + "°") + ". Calcule le côté opposé à cet angle, au centième.", spec: { kind: "value", value: hyp * Math.sin((a * Math.PI) / 180), round: 0.01 }, sol: M("\\text{opposé} = " + hyp + " \\cdot \\sin " + a + "° \\approx " + dec((hyp * Math.sin((a * Math.PI) / 180)).toFixed(2))) + " cm." };
    if (d === 2) {
      const o = R.int(3, 12), ad = R.int(3, 12), ang = (Math.atan(o / ad) * 180) / Math.PI;
      return { fig: FIG.trigTriangle([ad + " cm", o + " cm", ""], "α ?"), q: "Les cathètes d'un triangle rectangle mesurent " + M(o) + " cm (opposée à " + M("\\alpha") + ") et " + M(ad) + " cm (adjacente). Calcule " + M("\\alpha") + " en degrés, au centième.", spec: { kind: "value", value: ang, round: 0.01 }, sol: M("\\tan \\alpha = \\frac{" + o + "}{" + ad + "}") + ", " + M("\\alpha \\approx " + dec(ang.toFixed(2)) + "°") };
    }
    const dist = R.int(10, 60);
    return { fig: FIG.trigTriangle([dist + " m", "?", ""], a + "°"), q: "À " + M(dist) + " m du pied d'un immeuble, on voit son sommet sous un angle de " + M(a + "°") + ". Quelle est sa hauteur, au centième ?", spec: { kind: "value", value: dist * Math.tan((a * Math.PI) / 180), round: 0.01 }, sol: M("h = " + dist + " \\cdot \\tan " + a + "° \\approx " + dec((dist * Math.tan((a * Math.PI) / 180)).toFixed(2))) + " m." };
  },
});

// ---------- Secondaire II : 2e du Collège et MP2 ----------
const deg = (x) => (x * 180) / Math.PI, rad = (x) => (x * Math.PI) / 180;
Object.assign(GEN, {
  cart(d) {
    const xa = R.int(-5, 3), ya = R.int(-4, 4);
    if (d === 1) {
      const tr = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), sx = R.sign(), sy = R.sign();
      const xb = xa + sx * tr[0], yb = ya + sy * tr[1];
      return { fig: FIG.lineGraph((yb - ya) / (xb - xa), ya - ((yb - ya) / (xb - xa)) * xa, [[xa, ya, "A"], [xb, yb, "B"]]), q: "Calcule la distance entre " + M("A(" + xa + " ; " + ya + ")") + " et " + M("B(" + xb + " ; " + yb + ")") + ".", spec: { kind: "value", value: tr[2] }, sol: M("\\sqrt{" + par(xb - xa) + "^2 + " + par(yb - ya) + "^2} = \\sqrt{" + tr[2] ** 2 + "} = " + tr[2]) };
    }
    if (d === 2) {
      const xb = xa + 2 * R.nz(-3, 3), yb = ya + 2 * R.nz(-3, 3);
      return { q: "Donne les coordonnées du milieu de " + M("[AB]") + " avec " + M("A(" + xa + " ; " + ya + ")") + " et " + M("B(" + xb + " ; " + yb + ")") + ". Réponds « x ; y ».", spec: { kind: "pair", values: [(xa + xb) / 2, (ya + yb) / 2] }, sol: M("M\\left(\\frac{" + xa + " + " + par(xb) + "}{2} ; \\frac{" + ya + " + " + par(yb) + "}{2}\\right) = (" + (xa + xb) / 2 + " ; " + (ya + yb) / 2 + ")") };
    }
    const m = R.nz(-3, 3), hh = R.nz(-5, 5), x1 = R.int(-3, 0), x2 = x1 + R.int(1, 3);
    return { fig: FIG.lineGraph(m, hh, [[x1, m * x1 + hh, "A"], [x2, m * x2 + hh, "B"]]), q: "Donne l'équation de la droite passant par " + M("A(" + x1 + " ; " + (m * x1 + hh) + ")") + " et " + M("B(" + x2 + " ; " + (m * x2 + hh) + ")") + " (par exemple « y = 2x + 1 »).", spec: { kind: "expr", expr: m + "x+(" + hh + ")" }, sol: "Pente " + M("\\frac{" + (m * x2 + hh) + " - " + par(m * x1 + hh) + "}{" + x2 + " - " + par(x1) + "} = " + m) + ", puis " + M("y = " + poly([m, hh])) + "." };
  },

  recip(d) {
    const a = R.nz(-4, 5), b = R.nz(-6, 6);
    if (d === 1) {
      const x = R.nz(-5, 5), y = a * x + b;
      return { q: "Soit " + M("f(x) = " + poly([a, b])) + ". Calcule " + M("f^{-1}(" + y + ")") + ".", spec: { kind: "value", value: x }, sol: "On cherche " + M("x") + " tel que " + M(poly([a, b]) + " = " + y) + " : " + M("x = " + x) + "." };
    }
    if (d === 2) {
      const c = R.nz(-3, 3), x = R.nz(-3, 3);
      return { q: "Soit " + M("f(x) = " + poly([a, b])) + " et " + M("g(x) = x^2 " + (c < 0 ? "- " + -c : "+ " + c)) + ". Calcule " + M("(f \\circ g)(" + x + ")") + ".", spec: { kind: "value", value: a * (x * x + c) + b }, sol: M("g(" + x + ") = " + (x * x + c)) + ", puis " + M("f(" + (x * x + c) + ") = " + (a * (x * x + c) + b)) + "." };
    }
    return { q: "Soit " + M("f(x) = " + poly([a, b])) + ". Donne l'expression de " + M("f^{-1}(x)") + ".", spec: { kind: "expr", expr: "(x-(" + b + "))/(" + a + ")" }, sol: M("y = " + poly([a, b]) + " \\iff x = \\frac{y " + (b < 0 ? "+ " + -b : "- " + b) + "}{" + a + "}") + ", donc " + M("f^{-1}(x) = \\frac{x " + (b < 0 ? "+ " + -b : "- " + b) + "}{" + a + "}") + "." };
  },

  sinlaw(d) {
    if (d === 1) {
      const a = R.int(5, 15), al = R.int(30, 70), be = R.int(30, 70);
      const b = (a * Math.sin(rad(be))) / Math.sin(rad(al));
      return { fig: FIG.anyTriangle(["a = " + a, "b = ?", "", "α = " + al + "°, β = " + be + "°", "A"]), q: "Dans le triangle " + M("ABC") + ", " + M("a = " + a) + " (côté opposé à " + M("\\alpha") + "), " + M("\\alpha = " + al + "°") + " et " + M("\\beta = " + be + "°") + ". Calcule " + M("b") + " (côté opposé à " + M("\\beta") + ") au centième.", spec: { kind: "value", value: b, round: 0.01 }, sol: "Théorème du sinus : " + M("b = \\frac{" + a + " \\sin " + be + "°}{\\sin " + al + "°} \\approx " + dec(b.toFixed(2))) };
    }
    const a = R.int(4, 12), b = R.int(4, 12), g = R.int(35, 120);
    const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(g)));
    if (d === 2) return { fig: FIG.anyTriangle(["a = " + a, "b = " + b, "c = ?", "γ = " + g + "°", "C"]), q: "Dans le triangle " + M("ABC") + ", " + M("a = " + a) + ", " + M("b = " + b) + " et " + M("\\gamma = " + g + "°") + ". Calcule " + M("c") + " au centième.", spec: { kind: "value", value: c, round: 0.01 }, sol: "Théorème du cosinus : " + M("c^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + g + "°") + ", " + M("c \\approx " + dec(c.toFixed(2))) };
    const A = R.int(4, 9), B = R.int(4, 9), C = R.int(Math.abs(A - B) + 1, A + B - 1);
    const gam = deg(Math.acos((A * A + B * B - C * C) / (2 * A * B)));
    return { fig: FIG.anyTriangle(["a = " + A, "b = " + B, "c = " + C, "γ = ?", "C"]), q: "Un triangle a pour côtés " + M("a = " + A) + ", " + M("b = " + B) + " et " + M("c = " + C) + ". Calcule l'angle " + M("\\gamma") + " (opposé à " + M("c") + ") en degrés, au centième.", spec: { kind: "value", value: gam, round: 0.01 }, sol: M("\\cos\\gamma = \\frac{" + A * A + " + " + B * B + " - " + C * C + "}{2 \\cdot " + A + " \\cdot " + B + "}") + ", " + M("\\gamma \\approx " + dec(gam.toFixed(2)) + "°") };
  },

  expo(d) {
    if (d === 1) {
      const b = R.pick([2, 3, 5]), n = R.int(2, b === 2 ? 7 : 4);
      return { fig: FIG.parabola((x) => Math.pow(b, x) / 3, [], null, false), q: "Résous : " + M(b + "^x = " + b ** n) + ".", spec: { kind: "value", value: n }, sol: M(b ** n + " = " + b + "^" + n) + ", donc " + M("x = " + n) + "." };
    }
    if (d === 2) {
      const b = R.pick([2, 3]), k = R.nz(-3, 3), n = R.int(2, b === 2 ? 6 : 4);
      return { q: "Résous : " + M(b + "^{x " + (k < 0 ? "- " + -k : "+ " + k) + "} = " + b ** n) + ".", spec: { kind: "value", value: n - k }, sol: M("x " + (k < 0 ? "- " + -k : "+ " + k) + " = " + n) + ", donc " + M("x = " + (n - k)) + "." };
    }
    const C = 1000 * R.int(1, 9), t = R.pick([1, 1.5, 2, 2.5, 3]), n = R.int(3, 12);
    const v = C * Math.pow(1 + t / 100, n);
    return { fig: FIG.parabola((x) => Math.pow(1.3, x)), q: "Un capital de " + M(C) + " CHF est placé à " + M(dec(t) + "\\,\\%") + " d'intérêt composé par an. Que vaut-il après " + M(n) + " ans (au centime) ?", spec: { kind: "value", value: v, round: 0.01 }, sol: M(C + " \\cdot " + dec(1 + t / 100) + "^{" + n + "} \\approx " + dec(v.toFixed(2))) + " CHF." };
  },

  log(d) {
    if (d === 1) {
      const b = R.pick([2, 3, 10]), n = R.int(-2, b === 2 ? 6 : 4);
      const x = Math.pow(b, n), xs = n >= 0 ? String(x) : "\\frac{1}{" + b ** -n + "}";
      return { q: "Calcule " + M("\\log_{" + b + "} " + xs) + ".", spec: { kind: "value", value: n }, sol: M(b + "^{" + n + "} = " + xs) + ", donc " + M("\\log_{" + b + "} " + xs + " = " + n) + "." };
    }
    if (d === 2) {
      const b = R.pick([2, 3, 5]), c = R.pick([7, 10, 15, 20, 50].filter((v) => v !== b));
      return { fig: FIG.parabola((x) => Math.pow(b, x) / 4, [], null, false), q: "Résous " + M(b + "^x = " + c) + " (valeur exacte avec ln, ou au centième).", spec: { kind: "value", value: Math.log(c) / Math.log(b), round: 0.01, exactOk: true }, sol: M("x = \\frac{\\ln " + c + "}{\\ln " + b + "} \\approx " + dec((Math.log(c) / Math.log(b)).toFixed(2))) };
    }
    const a = R.pick([2, 4, 5, 20, 25]), b2 = 100 / a * R.pick([1, 10]);
    return { q: "Calcule sans calculatrice : " + M("\\log " + a + " + \\log " + b2) + ".", spec: { kind: "value", value: Math.log10(a * b2) }, sol: M("\\log(" + a + " \\cdot " + b2 + ") = \\log " + a * b2 + " = " + Math.round(Math.log10(a * b2))) + "." };
  },

  absval(d) {
    const a = R.nz(-6, 6), b = R.int(1, 8);
    if (d === 1) return { fig: FIG.numberLine(a, []), q: "Résous : " + M("|x " + (a < 0 ? "+ " + -a : "- " + a) + "| = " + b) + ".", spec: { kind: "set", values: [a - b, a + b] }, sol: M("x " + (a < 0 ? "+ " + -a : "- " + a) + " = " + b) + " ou " + M("= -" + b) + " : " + M("x = " + (a + b)) + " ou " + M("x = " + (a - b)) + "." };
    if (d === 2) {
      const k = R.pick([2, 3]), c = R.nz(-6, 6);
      return { q: "Résous : " + M("|" + k + "x " + (c < 0 ? "- " + -c : "+ " + c) + "| = " + b) + ".", spec: { kind: "set", values: [(b - c) / k, (-b - c) / k] }, sol: M(k + "x " + (c < 0 ? "- " + -c : "+ " + c) + " = \\pm " + b) + " : " + M("x = " + frac(b - c, k)) + " ou " + M("x = " + frac(-b - c, k)) + "." };
    }
    // Niveau 3 varié (audit 13.11) : isoler la valeur absolue (2 solutions), égalité de deux valeurs absolues, ou impossible.
    const absT = (r) => "|x" + (r < 0 ? " + " + -r : " - " + r) + "|", kind3 = R.pick(["iso", "iso", "deux", "imp"]);
    if (kind3 === "iso") { const c = b + R.int(1, 6), k = R.pick([1, 2, 3]), r = c - b; if ((r % k) !== 0 && k > 1) return GEN.absval(3);
      return { q: "Résous : " + M((k === 1 ? "" : k) + absT(a) + " + " + b + " = " + (k === 1 ? c : k * 0 + c)) + ".", spec: { kind: "set", values: [a - r / k, a + r / k] }, sol: "On isole la valeur absolue : " + M((k === 1 ? "" : k) + absT(a) + " = " + r) + (k === 1 ? "" : ", " + M(absT(a) + " = " + r / k)) + ", donc " + M("x = " + (a + r / k)) + " ou " + M("x = " + (a - r / k)) + "." }; }
    if (kind3 === "deux") { let e; do e = R.nz(-6, 6); while (e === a || (a + e) % 2 !== 0);
      return { q: "Résous : " + M(absT(a) + " = " + absT(e)) + ".", spec: { kind: "set", values: [(a + e) / 2] }, sol: "Les distances de " + M("x") + " à " + M(a) + " et à " + M(e) + " sont égales : " + M("x") + " est le milieu, " + M("x = \\frac{" + a + " + " + par(e) + "}{2} = " + (a + e) / 2) + ". (Ou : " + M(xm(a) + " = -(" + xm(e) + ")") + ".)" }; }
    return { q: "Résous : " + M("|x " + (a < 0 ? "+ " + -a : "- " + a) + "| + " + b + " = " + (b > 1 ? R.int(0, b - 1) : 0)) + ". (S'il n'y a pas de solution, écris « aucune ».)", spec: { kind: "set", values: [] }, sol: "Une valeur absolue est positive ou nulle : " + M("|\\ldots| = " + "\\text{un nombre négatif}") + " est impossible. Aucune solution." };
  },

  ineq(d) {
    const x0 = R.nz(-6, 6);
    if (d === 1) {
      const a = R.int(2, 6), b = R.nz(-9, 9), op = R.pick([">", "<", ">=", "<="]);
      const tx = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" }[op];
      return { q: "Résous : " + M(poly([a, b]) + " " + tx + " " + (a * x0 + b)) + ". Réponds par exemple « x > 4 » ou « x <= -3 ».", spec: { kind: "ineq", op, value: x0 }, sol: M(a + "x " + tx + " " + a * x0 + " \\iff x " + tx + " " + x0) };
    }
    const a = -R.int(2, 6), b = R.nz(-9, 9), op = R.pick([">", "<", ">=", "<="]);
    const flip = { ">": "<", "<": ">", ">=": "<=", "<=": ">=" }[op];
    const tx = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" };
    return { q: "Résous : " + M(poly([a, b]) + " " + tx[op] + " " + (a * x0 + b)) + ". Réponds par exemple « x > 4 » ou « x <= -3 ».", spec: { kind: "ineq", op: flip, value: x0 }, sol: M(a + "x " + tx[op] + " " + a * x0) + " ; on divise par " + M(a) + " (négatif) et on retourne le signe : " + M("x " + tx[flip] + " " + x0) + "." };
  },

  trigcercle(d) {
    if (d === 1) {
      const dg = R.pick([30, 45, 60, 90, 120, 135, 150, 180, 210, 270, 300, 360]);
      const g = gcd(dg, 180);
      return { fig: FIG.unitCircle(dg), q: "Convertis " + M(dg + "°") + " en radians (par exemple « π/4 »).", spec: { kind: "value", value: rad(dg) }, sol: M(dg + "° = " + dg + " \\cdot \\frac{\\pi}{180} = " + (dg / g === 1 ? "" : dg / g) + "\\pi" + (180 / g === 1 ? "" : "/" + 180 / g)) };
    }
    const angles = [[30, "1/2", "√3/2"], [45, "√2/2", "√2/2"], [60, "√3/2", "1/2"], [120, "√3/2", "-1/2"], [135, "√2/2", "-√2/2"], [150, "1/2", "-√3/2"], [210, "-1/2", "-√3/2"], [225, "-√2/2", "-√2/2"], [240, "-√3/2", "-1/2"], [300, "-√3/2", "1/2"], [315, "-√2/2", "√2/2"], [330, "-1/2", "√3/2"]];
    const [dg, sn, cs] = R.pick(angles);
    if (d === 2) {
      const f = R.pick(["sin", "cos"]);
      return { fig: FIG.unitCircle(dg), q: "Donne la valeur exacte de " + M("\\" + f + " " + dg + "°") + " (par exemple « √3/2 »).", spec: { kind: "value", value: f === "sin" ? Math.sin(rad(dg)) : Math.cos(rad(dg)) }, sol: M("\\" + f + " " + dg + "° = " + (f === "sin" ? sn : cs).replace("√", "\\sqrt{").replace(/\{(\d)/, "{$1}")) + " (lis l'" + (f === "sin" ? "ordonnée" : "abscisse") + " du point)." };
    }
    // Niveau 3 : hors du premier quadrant (audit 13.11).
    const [dg3, sn3, cs3] = R.pick(angles.filter((x) => x[0] > 90));
    if (R.rand() < 0.4) { const tn = Math.tan(rad(dg3)); return { q: "Donne la valeur exacte de " + M("\\tan " + dg3 + "°") + ".", spec: { kind: "value", value: tn }, sol: M("\\tan " + dg3 + "° = \\frac{\\sin " + dg3 + "°}{\\cos " + dg3 + "°}") + " = " + "(" + sn3 + ") / (" + cs3 + ") = " + M(Math.abs(Math.abs(tn) - 1) < 1e-9 ? String(Math.round(tn)) : (tn < 0 ? "-" : "") + (Math.abs(tn) > 1 ? "\\sqrt{3}" : "\\frac{\\sqrt{3}}{3}")) + "." }; }
    return { fig: FIG.unitCircle(dg3, "?"), q: "Donne les coordonnées exactes du point du cercle trigonométrique associé à " + M(dg3 + "°") + ". Réponds « x ; y ».", spec: { kind: "pair", values: [Math.cos(rad(dg3)), Math.sin(rad(dg3))] }, sol: M("(\\cos " + dg3 + "° ; \\sin " + dg3 + "°)") + " = (" + cs3 + " ; " + sn3 + ")" };
    return { fig: FIG.unitCircle(dg, "?"), q: "Donne les coordonnées exactes du point du cercle trigonométrique associé à " + M(dg + "°") + ". Réponds « x ; y ».", spec: { kind: "pair", values: [Math.cos(rad(dg)), Math.sin(rad(dg))] }, sol: M("(\\cos " + dg + "° ; \\sin " + dg + "°)") + " = (" + cs + " ; " + sn + ")" };
  },

  trigeq(d) {
    if (d === 1) {
      const [v, a] = R.pick([["1/2", 30], ["√2/2", 45], ["√3/2", 60], ["-1/2", 210], ["-√2/2", 225], ["-√3/2", 240]]);
      const sols = a < 180 ? [a, 180 - a] : [a, 540 - a];
      return { fig: FIG.unitLine("y", (a < 180 ? 1 : -1) * Math.abs(Math.sin(rad(a))), "y = " + v), q: "Résous " + M("\\sin x = " + v.replace("√", "\\sqrt{").replace(/\{(\d)/, "{$1}")) + " pour " + M("x \\in [0° ; 360°[") + " (en degrés, sépare par « ; »).", spec: { kind: "set", values: sols }, sol: M("x = " + sols[0] + "°") + " ou " + M("x = " + sols[1] + "°") + " (symétrie par rapport à l'axe vertical)." };
    }
    if (d === 2) {
      const [v, a] = R.pick([["1/2", 60], ["√2/2", 45], ["√3/2", 30], ["-1/2", 120], ["-√2/2", 135], ["-√3/2", 150]]);
      return { fig: FIG.unitLine("x", Math.cos(rad(a)), "x = " + v), q: "Résous " + M("\\cos x = " + v.replace("√", "\\sqrt{").replace(/\{(\d)/, "{$1}")) + " pour " + M("x \\in [0° ; 360°[") + " (en degrés).", spec: { kind: "set", values: [a, 360 - a] }, sol: M("x = " + a + "°") + " ou " + M("x = " + (360 - a) + "°") + " (symétrie par rapport à l'axe horizontal)." };
    }
    const [v, a] = R.pick([["1", 45], ["√3", 60], ["√3/3", 30], ["-1", 135], ["-√3", 120]]);
    return { fig: FIG.unitLine("x", 1, "tan"), q: "Résous " + M("\\tan x = " + v.replace("√", "\\sqrt{").replace(/\{(\d)/, "{$1}")) + " pour " + M("x \\in [0° ; 360°[") + ".", spec: { kind: "set", values: [a, a + 180] }, sol: M("x = " + a + "°") + " ou " + M("x = " + (a + 180) + "°") + " (la tangente a une période de 180°)." };
  },

  stats(d) {
    const n = d === 2 ? 2 * R.int(3, 4) : R.int(5, 7);
    const xs = Array.from({ length: n }, () => R.int(2, 20));
    const sum = xs.reduce((a, b) => a + b, 0), mean = sum / n;
    if (d === 1) return { fig: FIG.barChart(xs), q: "Calcule la moyenne de la série : " + M(xs.join(" ; ")) + (Number.isInteger(mean * 100) ? "." : " (arrondie au centième)."), spec: Number.isInteger(mean * 100) ? { kind: "value", value: mean } : { kind: "value", value: mean, round: 0.01 }, sol: M("\\frac{" + sum + "}{" + n + "} = " + frac(sum, n)) + (Number.isInteger(mean) ? "" : " " + M("\\approx " + dec(mean.toFixed(2)))) };
    if (d === 2) {
      const so = [...xs].sort((a, b) => a - b), med = (so[n / 2 - 1] + so[n / 2]) / 2;
      return { fig: FIG.barChart(xs), q: "Donne la médiane de la série : " + M(xs.join(" ; ")) + ".", spec: { kind: "value", value: med }, sol: "Série triée : " + M(so.join(" ; ")) + " ; médiane " + M("\\frac{" + so[n / 2 - 1] + " + " + so[n / 2] + "}{2} = " + dec(med)) };
    }
    const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / n);
    return { fig: FIG.barChart(xs), q: "Calcule l'écart-type " + M("\\sigma") + " de la série " + M(xs.join(" ; ")) + ", au centième.", spec: { kind: "value", value: sd, round: 0.01 }, sol: "Moyenne " + M(dec(mean.toFixed(2))) + " ; " + M("\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{" + n + "}} \\approx " + dec(sd.toFixed(2))) };
  },
});

// ---------- Niveau 4 : problèmes en plusieurs parties (modélisation, plusieurs étapes) ----------
// Chaque problème : { q, fig, parts: [{ label, spec }], hints: [outil, calcul], sol }.
const r2 = (v) => Math.round(v * 100) / 100;
const PROB = {
  f2() {
    const p = R.pick([2, 3]), q = R.pick([0.4, 0.6, 0.8, 1]), c = 5 * p * q, b = 5 * (p - q);
    const tm = (p - q) / 2, hm = -5 * (tm - p) * (tm + q);
    return { fig: FIG.parabola((t) => (-5 * (t - p) * (t + q)) / 3, [], null, false), q: "Une plongeuse saute d'un plongeoir. Sa hauteur au-dessus de l'eau (en m) après " + M("t") + " secondes est " + M("h(t) = -5t^2 + " + dec(b) + "t + " + dec(c)) + ".",
      parts: [{ label: "a) Hauteur du plongeoir (m)", spec: { kind: "value", value: c } }, { label: "b) Instant où elle entre dans l'eau (s)", spec: { kind: "value", value: p } }, { label: "c) Hauteur maximale atteinte (m)", spec: { kind: "value", value: hm, round: 0.01, exactOk: true } }],
      hints: ["Associe chaque question à un outil : départ → t = 0 ; entrée dans l'eau → h(t) = 0 ; hauteur max → sommet.", "a) h(0). b) Résous −5t² + " + dec(b) + "t + " + dec(c) + " = 0 et garde la solution positive. c) t = −b / 2a, puis h(t)."],
      sol: "a) " + M("h(0) = " + dec(c)) + " m. b) " + M("h(t) = -5(t - " + p + ")(t + " + dec(q) + ") = 0") + " : " + M("t = " + p) + " s. c) " + M("t = " + dec(tm)) + " s, " + M("h = " + dec(r2(hm))) + " m." };
  },
  factor() {
    const L = 20 * R.int(2, 6), k = R.int(5, L / 4 - 1);
    return { fig: FIG.rectFig(2, 1, "mur (pas de clôture)", "x"), q: "Avec " + M(L) + " m de clôture, on entoure un enclos rectangulaire le long d'un mur (le mur forme un côté). On note " + M("x") + " la largeur (perpendiculaire au mur).",
      parts: [{ label: "a) Aire (m²) si x = " + k, spec: { kind: "value", value: k * (L - 2 * k) } }, { label: "b) Largeur x qui donne l'aire maximale (m)", spec: { kind: "value", value: L / 4 } }, { label: "c) Aire maximale (m²)", spec: { kind: "value", value: (L / 4) * (L / 2) } }],
      hints: ["Exprime l'aire en fonction de x : la longueur vaut " + L + " − 2x. L'aire maximale est au sommet de la parabole.", "A(x) = x(" + L + " − 2x) = −2x² + " + L + "x ; sommet en x = −b / 2a."],
      sol: M("A(x) = x(" + L + " - 2x)") + ". a) " + M(k * (L - 2 * k)) + " m². b) " + M("x = \\frac{" + L + "}{4} = " + L / 4) + " m. c) " + M(L / 4 + " \\cdot " + L / 2 + " = " + (L / 4) * (L / 2)) + " m²." };
  },
  pct() {
    const P = 20 * R.int(3, 25), up = R.pick([10, 20, 25, 30, 50]), dn = R.pick([10, 20, 25, 40]);
    const p1 = P * (1 + up / 100), p2 = p1 * (1 - dn / 100), glob = (p2 / P - 1) * 100;
    return { fig: FIG.percentBar(up, P, " CHF"), q: "Un vélo coûte " + M(P) + " CHF. Son prix augmente de " + M(up + "\\,\\%") + ", puis baisse de " + M(dn + "\\,\\%") + " pendant les soldes.",
      parts: [{ label: "a) Prix après la hausse (CHF)", spec: { kind: "value", value: p1 } }, { label: "b) Prix soldé (CHF)", spec: { kind: "value", value: p2 } }, { label: "c) Variation globale en % (négative si baisse)", spec: { kind: "value", value: glob, round: 0.01 } }],
      hints: ["Les pourcentages successifs se multiplient : on ne les additionne pas.", "Multiplie par " + dec(1 + up / 100) + " puis par " + dec(1 - dn / 100) + " ; variation globale = (prix final / prix initial − 1) · 100."],
      sol: "a) " + M(P + " \\cdot " + dec(1 + up / 100) + " = " + dec(p1)) + ". b) " + M(dec(p1) + " \\cdot " + dec(1 - dn / 100) + " = " + dec(r2(p2))) + ". c) " + M(dec(r2(glob)) + "\\,\\%") + " (et non " + (up - dn) + " %)." };
  },
  pyth() {
    const [a, b, c] = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]).map((v) => v * R.int(2, 5));
    return { fig: GEO().pt("A", 0, 0, false).pt("B", b, 0, false).pt("C", b, a, false).pt("D", 0, a, false).poly(["A", "B", "C", "D"]).side("A", "B", "?").side("B", "C", a + " m").seg("A", "C", { cls: "f-accent", dash: true }).side("A", "C", c + " m", { inside: true }).svg("terrain rectangulaire"), q: "Un terrain rectangulaire a une diagonale de " + M(c) + " m et un côté de " + M(a) + " m.",
      parts: [{ label: "a) Autre côté (m)", spec: { kind: "value", value: b } }, { label: "b) Aire du terrain (m²)", spec: { kind: "value", value: a * b } }, { label: "c) Longueur de clôture pour en faire le tour (m)", spec: { kind: "value", value: 2 * (a + b) } }],
      hints: ["La diagonale découpe le rectangle en deux triangles rectangles : Pythagore.", "Autre côté = √(" + c + "² − " + a + "²), puis aire = longueur · largeur et périmètre = 2(longueur + largeur)."],
      sol: "a) " + M("\\sqrt{" + c * c + " - " + a * a + "} = " + b) + " m. b) " + M(a * b) + " m². c) " + M(2 * (a + b)) + " m." };
  },
  vol() {
    const r = R.int(2, 6), hh = R.int(5, 15), rho = R.pick([2.7, 7.8, 8.9, 0.9]), mat = { 2.7: "aluminium", 7.8: "acier", 8.9: "cuivre", 0.9: "glace" }[rho];
    const V = Math.PI * r * r * hh, m = V * rho;
    return { fig: FIG.cylinder("r = " + r, "h = " + hh), q: "Une pièce en " + mat + " (" + M("\\rho = " + dec(rho)) + " g/cm³) est un cylindre de rayon " + M(r) + " cm et de hauteur " + M(hh) + " cm.",
      parts: [{ label: "a) Volume (cm³, au centième)", spec: { kind: "value", value: V, round: 0.01, exactOk: true } }, { label: "b) Masse (g, au centième)", spec: { kind: "value", value: m, round: 0.01 } }, { label: "c) Nombre de pièces complètes dans 10 kg", spec: { kind: "value", value: Math.floor(10000 / m) } }],
      hints: ["Volume du cylindre, puis masse = masse volumique · volume. Attention : 10 kg = 10 000 g.", "V = π · " + r + "² · " + hh + " ; m = " + dec(rho) + " · V ; pièces = partie entière de 10 000 / m."],
      sol: "a) " + M(r * r * hh + "\\pi \\approx " + dec(r2(V))) + " cm³. b) " + M("\\approx " + dec(r2(m))) + " g. c) " + M("10\\,000 : " + dec(r2(m)) + " \\approx " + dec(r2(10000 / m))) + ", donc " + M(Math.floor(10000 / m)) + " pièces." };
  },
  sys2() {
    const pa = R.int(12, 20), pe = R.int(5, 10), na = R.int(2, 5), ne = R.int(2, 5), nb = R.int(1, 4), nf = R.int(3, 7);
    if (na * nf === nb * ne) return PROB.sys2();
    const ga = R.int(2, 6), ge = R.int(10, 25);
    return { q: "Au musée, " + M(na) + " adultes et " + M(ne) + " enfants paient " + M(na * pa + ne * pe) + " CHF ; " + M(nb) + " adultes et " + M(nf) + " enfants paient " + M(nb * pa + nf * pe) + " CHF.",
      parts: [{ label: "a) Prix d'un billet adulte (CHF)", spec: { kind: "value", value: pa } }, { label: "b) Prix d'un billet enfant (CHF)", spec: { kind: "value", value: pe } }, { label: "c) Prix pour une classe : " + ga + " adultes et " + ge + " enfants (CHF)", spec: { kind: "value", value: ga * pa + ge * pe } }],
      hints: ["Deux inconnues (prix adulte a, prix enfant e), deux informations : un système.", na + "a + " + ne + "e = " + (na * pa + ne * pe) + " et " + nb + "a + " + nf + "e = " + (nb * pa + nf * pe) + " : élimine une inconnue."],
      sol: "a) " + M("a = " + pa) + " CHF. b) " + M("e = " + pe) + " CHF. c) " + M(ga + " \\cdot " + pa + " + " + ge + " \\cdot " + pe + " = " + (ga * pa + ge * pe)) + " CHF." };
  },
  log() {
    const C = 1000 * R.int(2, 9), t = R.pick([2, 3, 4, 5]), n0 = R.int(3, 8);
    const v = C * Math.pow(1 + t / 100, n0), years = Math.ceil(Math.log(2) / Math.log(1 + t / 100));
    return { fig: FIG.parabola((x) => Math.pow(1 + t / 100, x * 3) * 2 - 2), q: "On place " + M(C) + " CHF à " + M(t + "\\,\\%") + " d'intérêt composé par an.",
      parts: [{ label: "a) Capital après " + n0 + " ans (CHF, au centime)", spec: { kind: "value", value: v, round: 0.01 } }, { label: "b) Nombre d'années pour que le capital double (années entières)", spec: { kind: "value", value: years } }],
      hints: ["Chaque année, le capital est multiplié par " + dec(1 + t / 100) + ". Doubler : résoudre " + dec(1 + t / 100) + "ⁿ = 2.", "n = ln 2 / ln " + dec(1 + t / 100) + ", puis arrondir à l'année supérieure."],
      sol: "a) " + M(C + " \\cdot " + dec(1 + t / 100) + "^{" + n0 + "} \\approx " + dec(r2(v))) + " CHF. b) " + M("n = \\frac{\\ln 2}{\\ln " + dec(1 + t / 100) + "} \\approx " + dec(r2(Math.log(2) / Math.log(1 + t / 100)))) + ", donc " + M(years) + " ans." };
  },
  eq2() {
    const x = R.int(3, 12), k = R.int(2, 8);
    return { fig: FIG.rectFig(x + k, x, "x + " + k, "x"), q: "Un rectangle a une longueur qui dépasse sa largeur " + M("x") + " de " + M(k) + " cm. Son aire vaut " + M(x * (x + k)) + " cm².",
      parts: [{ label: "a) Largeur (cm)", spec: { kind: "value", value: x } }, { label: "b) Longueur (cm)", spec: { kind: "value", value: x + k } }, { label: "c) Périmètre (cm)", spec: { kind: "value", value: 2 * (2 * x + k) } }],
      hints: ["Traduis l'aire en équation : x(x + " + k + ") = " + x * (x + k) + ".", "Mets tout d'un côté : x² + " + k + "x − " + x * (x + k) + " = 0, puis factorise et garde la solution positive."],
      sol: M("x^2 + " + k + "x - " + x * (x + k) + " = (x - " + x + ")(x + " + (x + k) + ") = 0") + " : a) " + M(x) + " cm, b) " + M(x + k) + " cm, c) " + M(2 * (2 * x + k)) + " cm." };
  },
  trigo() {
    const Lr = R.int(4, 12), a = R.int(4, 15), hgt = Lr * Math.sin(rad(a)), hor = Lr * Math.cos(rad(a));
    return { fig: FIG.trigTriangle(["?", "?", Lr + " m"], a + "°"), q: "Une rampe d'accès de " + M(Lr) + " m de long fait un angle de " + M(a + "°") + " avec le sol.",
      parts: [{ label: "a) Hauteur atteinte (m, au centième)", spec: { kind: "value", value: hgt, round: 0.01 } }, { label: "b) Distance horizontale (m, au centième)", spec: { kind: "value", value: hor, round: 0.01 } }, { label: "c) Pente en % (au centième)", spec: { kind: "value", value: Math.tan(rad(a)) * 100, round: 0.01 } }],
      hints: ["La rampe est l'hypoténuse d'un triangle rectangle : hauteur → sinus, horizontale → cosinus.", "Pente en % = hauteur / horizontale · 100 = tan α · 100."],
      sol: "a) " + M(Lr + " \\sin " + a + "° \\approx " + dec(r2(hgt))) + " m. b) " + M(Lr + " \\cos " + a + "° \\approx " + dec(r2(hor))) + " m. c) " + M("\\tan " + a + "° \\cdot 100 \\approx " + dec(r2(Math.tan(rad(a)) * 100)) + "\\,\\%") };
  },
  stats() {
    const notes = Array.from({ length: 4 }, () => R.int(7, 11) / 2), target = R.pick([4.5, 5]);
    const s = notes.reduce((a, b) => a + b, 0), need = target * 5 - s;
    if (need > 6 || need < 1) return PROB.stats();
    return { fig: FIG.barChart(notes), q: "Tes quatre premières notes sont " + M(notes.map(dec).join(" ; ")) + ". Il reste une épreuve, de même coefficient.",
      parts: [{ label: "a) Moyenne actuelle", spec: { kind: "value", value: s / 4 } }, { label: "b) Note à obtenir pour finir avec " + decTxt(target) + " de moyenne", spec: { kind: "value", value: need } }],
      hints: ["La moyenne finale = (somme des 5 notes) / 5.", "Il faut une somme de " + decTxt(target) + " · 5 = " + decTxt(target * 5) + " : retire la somme actuelle."],
      sol: "a) " + M("\\frac{" + dec(s) + "}{4} = " + dec(s / 4)) + ". b) " + M(dec(target * 5) + " - " + dec(s) + " = " + dec(need)) + "." };
  },
  vitesse() {
    const d = 10 * R.int(6, 18), v1 = R.pick([60, 80, 90, 100, 120]), v2 = R.pick([40, 50, 60, 75].filter((v) => v !== v1));
    const t1 = d / v1, t2 = d / v2, vm = (2 * d) / (t1 + t2);
    return { fig: FIG.road(d + " km", v1 + " km/h → " + v2 + " km/h"), q: "Une voiture fait l'aller de " + M(d) + " km à " + M(v1) + " km/h et le retour à " + M(v2) + " km/h.",
      parts: [{ label: "a) Durée de l'aller (min)", spec: { kind: "value", value: t1 * 60, round: 0.01 } }, { label: "b) Durée du retour (min)", spec: { kind: "value", value: t2 * 60, round: 0.01 } }, { label: "c) Vitesse moyenne sur l'aller-retour (km/h, au centième)", spec: { kind: "value", value: vm, round: 0.01 } }],
      hints: ["La vitesse moyenne n'est pas la moyenne des vitesses : c'est la distance totale divisée par la durée totale.", "t = d / v pour chaque trajet ; v moyenne = " + 2 * d + " km / (durée aller + durée retour)."],
      sol: "a) " + M(dec(r2(t1 * 60))) + " min. b) " + M(dec(r2(t2 * 60))) + " min. c) " + M("\\frac{" + 2 * d + "}{" + dec(r2(t1 + t2)) + "} \\approx " + dec(r2(vm))) + " km/h (et non " + (v1 + v2) / 2 + ")." };
  },
  echelle() {
    const k = R.pick([20, 25, 50, 100]), lm = R.int(4, 15), am = R.int(6, 40), vm = R.int(2, 9);
    return { fig: FIG.scaling(3, "1 : " + k), q: "Une maquette de bâtiment est à l'échelle " + M("1 : " + k) + ".",
      parts: [{ label: "a) Un mur mesure " + lm + " cm sur la maquette : longueur réelle (m)", spec: { kind: "value", value: (lm * k) / 100 } }, { label: "b) Une pièce mesure " + am + " cm² sur la maquette : aire réelle (m²)", spec: { kind: "value", value: (am * k * k) / 10000 } }, { label: "c) Une cuve de " + vm + " cm³ sur la maquette : volume réel (m³)", spec: { kind: "value", value: (vm * k ** 3) / 1e6 } }],
      hints: ["Longueurs × " + decTxt(k) + ", aires × " + decTxt(k) + "², volumes × " + decTxt(k) + "³.", "Puis convertis : 1 m = 100 cm, 1 m² = 10 000 cm², 1 m³ = 1 000 000 cm³."],
      sol: "a) " + M(lm * k + " \\text{ cm} = " + dec((lm * k) / 100)) + " m. b) " + M(am + " \\cdot " + k * k + " = " + am * k * k + " \\text{ cm}^2 = " + dec((am * k * k) / 10000)) + " m². c) " + M(vm + " \\cdot " + k ** 3 + " = " + vm * k ** 3 + " \\text{ cm}^3 = " + dec((vm * k ** 3) / 1e6)) + " m³." };
  },
};

// ---------- Défis supplémentaires (1re et 2e du secondaire II) : plusieurs problèmes par notion ----------
const PROB_EXTRA = {
  eq2disc: [() => {
    const k = R.int(2, 9);
    return { q: "On considère l'équation " + M("x^2 + m x + " + k * k + " = 0") + ", avec " + M("m > 0") + ".",
      parts: [{ label: "a) Valeur de m pour laquelle l'équation a une seule solution", spec: { kind: "value", value: 2 * k } }, { label: "b) Cette solution unique", spec: { kind: "value", value: -k } }, { label: "c) Plus petite valeur entière de m > 0 pour laquelle il y a deux solutions", spec: { kind: "value", value: 2 * k + 1 } }],
      hints: ["Une seule solution ⇔ Δ = 0. Deux solutions ⇔ Δ > 0.", "Δ = m² − " + 4 * k * k + " ; Δ = 0 ⇔ m = " + 2 * k + " ; la solution vaut alors −m / 2."],
      sol: "a) " + M("m^2 - " + 4 * k * k + " = 0") + ", " + M("m = " + 2 * k) + ". b) " + M("x = -\\frac{m}{2} = " + -k) + ". c) " + M("m^2 > " + 4 * k * k + " \\iff m > " + 2 * k) + ", donc " + M(2 * k + 1) + "." };
  }],
  inter: [() => {
    const a = R.nz(-3, 3), m = 2 * a, k = -a * a;
    return { fig: FIG.parabola((x) => x * x / 3, [], null, false), q: "La droite " + M("g(x) = " + m + "x + k") + " et la parabole " + M("f(x) = x^2") + ".",
      parts: [{ label: "a) Valeur de k pour que la droite soit tangente à la parabole (un seul point commun)", spec: { kind: "value", value: k } }, { label: "b) Abscisse du point de contact", spec: { kind: "value", value: a } }, { label: "c) Ordonnée du point de contact", spec: { kind: "value", value: a * a } }],
      hints: ["Les points communs vérifient x² = " + m + "x + k. Un seul point commun ⇔ cette équation a une seule solution.", "x² − " + m + "x − k = 0 : Δ = " + m * m + " + 4k = 0."],
      sol: M("x^2 - " + m + "x - k = 0") + ", " + M("\\Delta = " + m * m + " + 4k = 0") + " : a) " + M("k = " + k) + ". b) " + M("x = " + a) + ". c) " + M("y = " + a * a) + "." };
  }],
  expo: [() => {
    const m0 = 100 * R.pick([2, 4, 8, 16]), T = R.pick([3, 5, 8, 10, 12]), t = R.int(1, 4) * T + R.int(1, T - 1), seuil = m0 / R.pick([10, 20, 50]);
    const mt = m0 * Math.pow(0.5, t / T), n = Math.ceil((T * Math.log(m0 / seuil)) / Math.log(2));
    return { q: "Une substance radioactive a une demi-vie de " + M(T) + " ans : sa masse est divisée par 2 tous les " + M(T) + " ans. On part de " + M(m0) + " g.",
      parts: [{ label: "a) Masse après " + 2 * T + " ans (g)", spec: { kind: "value", value: m0 / 4 } }, { label: "b) Masse après " + t + " ans (g, au centième)", spec: { kind: "value", value: mt, round: 0.01 } }, { label: "c) Après combien d'années entières la masse devient-elle inférieure à " + decTxt(seuil) + " g ?", spec: { kind: "value", value: n } }],
      hints: ["m(t) = " + m0 + " · 0,5^(t / " + T + ").", "c) Résous " + m0 + " · 0,5^(t/" + T + ") < " + decTxt(seuil) + " avec les logarithmes, puis arrondis à l'année supérieure."],
      sol: "a) " + M(m0 + " \\cdot 0{,}5^2 = " + m0 / 4) + " g. b) " + M(m0 + " \\cdot 0{,}5^{" + t + "/" + T + "} \\approx " + dec(r2(mt))) + " g. c) " + M("t > " + T + " \\cdot \\frac{\\ln " + dec(m0 / seuil) + "}{\\ln 2} \\approx " + dec(r2((T * Math.log(m0 / seuil)) / Math.log(2)))) + " : " + M(n) + " ans." };
  }],
  log: [() => {
    const n = R.pick([5, 8, 10, 12, 15, 20]), t = (Math.pow(2, 1 / n) - 1) * 100;
    return { q: "La population d'une ville double en " + M(n) + " ans, avec un taux de croissance annuel constant.",
      parts: [{ label: "a) Taux de croissance annuel (en %, au centième)", spec: { kind: "value", value: t, round: 0.01 } }, { label: "b) Facteur de multiplication en " + 3 * n + " ans", spec: { kind: "value", value: 8 } }],
      hints: ["Si le facteur annuel est q, alors qⁿ = 2.", "q = 2^(1/" + n + ") ; taux = (q − 1) · 100. b) " + 3 * n + " ans = 3 doublements."],
      sol: "a) " + M("q = 2^{1/" + n + "} \\approx " + dec(Math.pow(2, 1 / n).toFixed(4))) + ", taux " + M("\\approx " + dec(r2(t)) + "\\,\\%") + ". b) " + M("2^3 = 8") + "." };
  }],
  sinlaw: [() => {
    const d = 10 * R.int(5, 20), al = R.int(40, 75), be = R.int(40, 75), ga = 180 - al - be;
    const AC = (d * Math.sin(rad(be))) / Math.sin(rad(ga)), h = AC * Math.sin(rad(al));
    return { fig: FIG.anyTriangle(["", "", "AB = " + d + " m", "α = " + al + "°, β = " + be + "°", "A"]), q: "Deux géomètres en " + M("A") + " et " + M("B") + ", distants de " + M(d) + " m, visent un arbre " + M("C") + " de l'autre côté d'une rivière : " + M("\\widehat{CAB} = " + al + "°") + " et " + M("\\widehat{CBA} = " + be + "°") + ".",
      parts: [{ label: "a) Angle en C (°)", spec: { kind: "value", value: ga } }, { label: "b) Distance AC (m, au centième)", spec: { kind: "value", value: AC, round: 0.01 } }, { label: "c) Largeur de la rivière, distance de C à la droite (AB) (m, au centième)", spec: { kind: "value", value: h, round: 0.01 } }],
      hints: ["Somme des angles, puis théorème du sinus (le côté AB est en face de C).", "AC = AB · sin β / sin γ ; la distance à (AB) est AC · sin α."],
      sol: "a) " + M(ga + "°") + ". b) " + M("AC = \\frac{" + d + " \\sin " + be + "°}{\\sin " + ga + "°} \\approx " + dec(r2(AC))) + " m. c) " + M("AC \\sin " + al + "° \\approx " + dec(r2(h))) + " m." };
  }],
  cart: [() => {
    const [p, q] = R.pick([[3, 4], [6, 8], [5, 12], [8, 6]]), xa = R.int(-4, 1), ya = R.int(-3, 2);
    const B = [xa + p, ya], C = [xa, ya + q];
    return { fig: FIG.lineGraph(0, ya, [[xa, ya, "A"], [B[0], B[1], "B"], [C[0], C[1], "C"]]), q: "Soit " + M("A(" + xa + " ; " + ya + ")") + ", " + M("B(" + B[0] + " ; " + B[1] + ")") + " et " + M("C(" + C[0] + " ; " + C[1] + ")") + ".",
      parts: [{ label: "a) Longueur BC", spec: { kind: "value", value: Math.hypot(p, q) } }, { label: "b) Aire du triangle ABC", spec: { kind: "value", value: (p * q) / 2 } }, { label: "c) Distance de A à la droite (BC), au centième", spec: { kind: "value", value: (p * q) / Math.hypot(p, q), round: 0.01 } }],
      hints: ["Le triangle est rectangle en A (un côté horizontal, un côté vertical).", "Aire = AB · AC / 2 = BC · d / 2, d'où la distance d."],
      sol: "a) " + M("\\sqrt{" + p * p + " + " + q * q + "} = " + Math.hypot(p, q)) + ". b) " + M("\\frac{" + p + " \\cdot " + q + "}{2} = " + (p * q) / 2) + ". c) " + M("d = \\frac{2 \\cdot " + (p * q) / 2 + "}{" + Math.hypot(p, q) + "} = " + dec(r2((p * q) / Math.hypot(p, q)))) + "." };
  }],
  trigeq: [() => {
    const [v, a] = R.pick([["1/2", 30], ["√2/2", 45], ["√3/2", 60]]);
    const sols = [a / 2, (180 - a) / 2, a / 2 + 180, (180 - a) / 2 + 180];
    return { fig: FIG.unitLine("y", Math.sin(rad(a)), "y = " + v), q: "On résout " + M("\\sin(2x) = " + v.replace("√", "\\sqrt{").replace(/\{(\d)/, "{$1}")) + " pour " + M("x \\in [0° ; 360°[") + ".",
      parts: [{ label: "a) Nombre de solutions", spec: { kind: "value", value: 4 } }, { label: "b) Toutes les solutions (en degrés, séparées par « ; »)", spec: { kind: "set", values: sols } }],
      hints: ["Pose u = 2x : u parcourt [0° ; 720°[, donc deux tours de cercle.", "sin u = " + v + " donne u = " + a + "° ou " + (180 - a) + "° (+ 360°), puis x = u / 2."],
      sol: M("2x \\in \\{" + a + "° ; " + (180 - a) + "° ; " + (a + 360) + "° ; " + (540 - a) + "°\\}") + ", donc " + M("x \\in \\{" + sols.join("° ; ") + "°\\}") + " : 4 solutions." };
  }],
  euclide: [() => {
    const [p, q] = R.pick([[4, 9], [1, 4], [9, 16], [4, 1], [16, 9], [2, 8]]), c = p + q, h = Math.sqrt(p * q);
    return { fig: FIG.trigTriangle(["c = " + c, "", ""], ""), q: "Dans un triangle rectangle, la hauteur issue de l'angle droit découpe l'hypoténuse (" + M("c = " + c) + ") en deux segments, dont l'un mesure " + M(p) + ".",
      parts: [{ label: "a) Hauteur h", spec: { kind: "value", value: h } }, { label: "b) Cathète adjacente au segment de " + p, spec: { kind: "value", value: Math.sqrt(p * c), round: 0.01, exactOk: true } }, { label: "c) Aire du triangle", spec: { kind: "value", value: (c * h) / 2 } }],
      hints: ["L'autre segment vaut " + c + " − " + p + " = " + q + ". Hauteur : h² = p · q. Euclide : cathète² = projection · hypoténuse.", "Aire = hypoténuse · hauteur / 2."],
      sol: "a) " + M("h = \\sqrt{" + p + " \\cdot " + q + "} = " + dec(h)) + ". b) " + M("\\sqrt{" + p + " \\cdot " + c + "} \\approx " + dec(r2(Math.sqrt(p * c)))) + ". c) " + M("\\frac{" + c + " \\cdot " + dec(h) + "}{2} = " + dec((c * h) / 2)) + "." };
  }],
  eq3: [() => {
    const L = R.pick([12, 18, 24, 30]), V = (x) => x * (L - 2 * x) ** 2, xs = Array.from({ length: L / 2 - 1 }, (_, i) => i + 1), best = xs.reduce((a, b) => (V(b) > V(a) ? b : a));
    const x1 = R.int(1, L / 2 - 1);
    return { fig: FIG.rectFig(1, 1, L + " cm", L + " cm"), q: "Dans un carton carré de " + M(L) + " cm de côté, on découpe un carré de côté " + M("x") + " cm à chaque coin, puis on plie pour obtenir une boîte sans couvercle.",
      parts: [{ label: "a) Volume (cm³) si x = " + x1, spec: { kind: "value", value: V(x1) } }, { label: "b) Valeur entière de x qui donne le plus grand volume", spec: { kind: "value", value: best } }, { label: "c) Ce volume maximal (cm³)", spec: { kind: "value", value: V(best) } }],
      hints: ["La base est un carré de côté " + L + " − 2x, la hauteur vaut x.", "V(x) = x(" + L + " − 2x)² ; calcule V pour x = 1, 2, 3… et compare."],
      sol: M("V(x) = x(" + L + " - 2x)^2") + ". a) " + M(V(x1)) + " cm³. b) On calcule le volume pour les valeurs entières possibles : " + [1, 2, 3, 4, 5, 6, 7, 8].filter((t) => 2 * t < L).map((t) => M("V(" + t + ") = " + V(t))).join(", ") + " ; le plus grand est pour " + M("x = " + best) + ". c) " + M(V(best)) + " cm³." };
  }],
  ineq: [() => {
    const a = R.int(5, 20), b = R.int(15, 30) / 10, c = a + R.int(15, 40), d = b - R.int(5, 10) / 10, k = (c - a) / (b - d);
    return { q: "Forfait A : " + M(a) + " CHF par mois + " + M(dec(b)) + " CHF par Go. Forfait B : " + M(c) + " CHF par mois + " + M(dec(d)) + " CHF par Go. On note " + M("x") + " le nombre de Go consommés.",
      parts: [{ label: "a) Pour quels x le forfait B est-il moins cher ? (réponds « x > … »)", spec: { kind: "ineq", op: ">", value: k } }, { label: "b) Coût du forfait A pour 20 Go (CHF)", spec: { kind: "value", value: a + 20 * b } }],
      hints: ["Écris le coût de chaque forfait en fonction de x, puis l'inéquation B < A.", c + " + " + dec(d) + "x < " + a + " + " + dec(b) + "x ⇔ " + (c - a) + " < " + dec(r2(b - d)) + "x."],
      sol: "a) " + M(c + " + " + dec(d) + "x < " + a + " + " + dec(b) + "x \\iff x > \\frac{" + (c - a) + "}{" + dec(r2(b - d)) + "} \\approx " + dec(r2(k))) + ". b) " + M(dec(a + 20 * b)) + " CHF." };
  }],
  thales: [() => {
    const ad = R.int(3, 8), db = R.int(10, 40), de = R.int(4, 12), bc = (de * (ad + db)) / ad;
    return { fig: FIG.thales([[110, 52, ad + " m"], [80, 124, db + " m"], [150, 70, de + " m"]]), q: "Pour mesurer la largeur " + M("BC") + " d'un étang, on plante des piquets : " + M("(DE) \\parallel (BC)") + ", " + M("AD = " + ad) + " m, " + M("DB = " + db) + " m et " + M("DE = " + de) + " m.",
      parts: [{ label: "a) Longueur AB (m)", spec: { kind: "value", value: ad + db } }, { label: "b) Largeur BC de l'étang (m, au centième)", spec: { kind: "value", value: bc, round: 0.01 } }],
      hints: ["Thalès : le petit triangle ADE et le grand triangle ABC.", "BC / DE = AB / AD."],
      sol: "a) " + M(ad + db) + " m. b) " + M("BC = " + de + " \\cdot \\frac{" + (ad + db) + "}{" + ad + "} \\approx " + dec(r2(bc))) + " m." };
  }],
};
const probList = (id) => [...(PROB[id] ? [PROB[id]] : []), ...(PROB_EXTRA[id] || [])];
const hasProb = (id) => probList(id).length > 0;
const probFor = (id) => R.pick(probList(id));
