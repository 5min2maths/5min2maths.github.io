// Calculateur d'expressions : lecture souple de la réponse de l'élève, calcul, mise en forme TeX,
// équivalence d'expressions (par évaluation en plusieurs points) et contrôle de forme.
// Inspiré de Probability Puzzles (atorch) : on ne fixe pas le format de la réponse.

const Expr = (() => {
  function tokenize(src) {
    const s = src
      .replace(/[−–]/g, "-").replace(/[×·∙⋅]/g, "*").replace(/[÷:]/g, "/")
      .replace(/²/g, "^2").replace(/³/g, "^3")
      .replace(/(\d)'(?=\d{3})/g, "$1")          // séparateur de milliers 1'200
      .replace(/(\d)\s+(?=\d{3}\b)/g, "$1")      // 1 200
      .replace(/\[/g, "(").replace(/\]/g, ")");
    const toks = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.,]/.test(c)) {
        let j = i, seenSep = false;
        while (j < s.length && (/[0-9]/.test(s[j]) || (!seenSep && /[.,]/.test(s[j]) && /[0-9]/.test(s[j + 1] || "")))) {
          if (/[.,]/.test(s[j])) seenSep = true;
          j++;
        }
        if (j === i) throw new Error("Nombre mal écrit");
        toks.push({ t: "num", v: parseFloat(s.slice(i, j).replace(",", ".")) });
        i = j; continue;
      }
      if (c === "√") { toks.push({ t: "fn", v: "sqrt" }); i++; continue; }
      if (c === "∛") { toks.push({ t: "fn", v: "cbrt" }); i++; continue; }
      if (c === "π") { toks.push({ t: "const", v: "pi" }); i++; continue; }
      if (/[a-zA-Zéè]/.test(c)) {
        let j = i;
        while (j < s.length && /[a-zA-Zéè]/.test(s[j])) j++;
        const w = s.slice(i, j).toLowerCase();
        if (w === "sqrt" || w === "racine" || w === "rac") toks.push({ t: "fn", v: "sqrt" });
        else if (w === "cbrt") toks.push({ t: "fn", v: "cbrt" });
        else if (w === "pi") toks.push({ t: "const", v: "pi" });
        else for (const ch of w) toks.push({ t: "var", v: ch }); // xy = x·y
        i = j; continue;
      }
      if ("+-*/^();=".includes(c)) { toks.push({ t: "op", v: c }); i++; continue; }
      throw new Error("Caractère non reconnu : « " + c + " »");
    }
    return toks;
  }

  function parse(src) {
    const toks = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const isOp = (v) => peek() && peek().t === "op" && peek().v === v;
    const startsFactor = () => {
      const k = peek();
      return k && (k.t === "num" || k.t === "var" || k.t === "const" || k.t === "fn" || (k.t === "op" && k.v === "("));
    };
    function list() {
      const items = [stripEq(expr())];
      while (isOp(";")) { p++; items.push(stripEq(expr())); }
      return items.length === 1 ? items[0] : { t: "list", items };
    }
    // « x = 4 » : on garde le membre de droite si le gauche est une variable seule.
    function stripEq(e) {
      if (isOp("=")) {
        p++;
        const r = expr();
        if (e.t === "var") return r;
        return { t: "eq", a: e, b: r };
      }
      return e;
    }
    function expr() {
      let a = term();
      while (isOp("+") || isOp("-")) {
        const o = toks[p++].v;
        a = { t: o === "+" ? "add" : "sub", a, b: term() };
      }
      return a;
    }
    function term() {
      let a = unary();
      for (;;) {
        if (isOp("*") || isOp("/")) {
          const o = toks[p++].v;
          a = { t: o === "*" ? "mul" : "div", a, b: unary() };
        } else if (startsFactor()) {
          a = { t: "mul", a, b: power(), implicit: true };
        } else break;
      }
      return a;
    }
    function unary() {
      if (isOp("-")) { p++; return { t: "neg", a: unary() }; }
      if (isOp("+")) { p++; return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (isOp("^")) { p++; return { t: "pow", a: base, b: unary() }; }
      return base;
    }
    function primary() {
      const k = peek();
      if (!k) throw new Error("Expression incomplète");
      if (k.t === "num") { p++; return { t: "num", v: k.v }; }
      if (k.t === "var") { p++; return { t: "var", v: k.v }; }
      if (k.t === "const") { p++; return { t: "const", v: k.v }; }
      if (k.t === "fn") {
        p++;
        // √2, √(x+1), √x : l'argument est un facteur (avec sa puissance éventuelle)
        return { t: "fn", f: k.v, a: power() };
      }
      if (isOp("(")) {
        p++;
        const e = expr();
        if (!isOp(")")) throw new Error("Parenthèse non fermée");
        p++;
        return { t: "par", a: e };
      }
      throw new Error("Symbole inattendu : « " + k.v + " »");
    }
    const tree = list();
    if (p < toks.length) throw new Error("Symbole en trop : « " + toks[p].v + " »");
    return tree;
  }

  function evaluate(n, env = {}) {
    switch (n.t) {
      case "num": return n.v;
      case "const": return Math.PI;
      case "var": return env[n.v] !== undefined ? env[n.v] : NaN;
      case "par": return evaluate(n.a, env);
      case "neg": return -evaluate(n.a, env);
      case "add": return evaluate(n.a, env) + evaluate(n.b, env);
      case "sub": return evaluate(n.a, env) - evaluate(n.b, env);
      case "mul": return evaluate(n.a, env) * evaluate(n.b, env);
      case "div": return evaluate(n.a, env) / evaluate(n.b, env);
      case "pow": return Math.pow(evaluate(n.a, env), evaluate(n.b, env));
      case "fn": { const v = evaluate(n.a, env); return n.f === "sqrt" ? Math.sqrt(v) : Math.cbrt(v); }
      default: return NaN;
    }
  }

  const fmtNum = (v) => String(+v.toPrecision(12)).replace(".", "{,}");
  function tex(n) {
    switch (n.t) {
      case "num": return fmtNum(n.v);
      case "const": return "\\pi";
      case "var": return n.v;
      case "par": return "\\left(" + tex(n.a) + "\\right)";
      case "neg": return "-" + tex(n.a);
      case "add": return tex(n.a) + " + " + tex(n.b);
      case "sub": return tex(n.a) + " - " + tex(n.b);
      case "mul": return tex(n.a) + (n.implicit ? " " : " \\cdot ") + tex(n.b);
      case "div": return "\\frac{" + tex(unpar(n.a)) + "}{" + tex(unpar(n.b)) + "}";
      case "pow": return "{" + tex(n.a) + "}^{" + tex(unpar(n.b)) + "}";
      case "fn": return n.f === "sqrt" ? "\\sqrt{" + tex(unpar(n.a)) + "}" : "\\sqrt[3]{" + tex(unpar(n.a)) + "}";
      case "list": return n.items.map(tex).join(" \\; ; \\; ");
      case "eq": return tex(n.a) + " = " + tex(n.b);
      default: return "?";
    }
  }
  const unpar = (n) => (n.t === "par" ? n.a : n);

  const vars = (n, s = new Set()) => {
    if (!n) return s;
    if (n.t === "var") s.add(n.v);
    for (const k of ["a", "b"]) if (n[k]) vars(n[k], s);
    if (n.items) n.items.forEach((i) => vars(i, s));
    return s;
  };
  const hasSum = (n) => {
    n = unpar(n);
    if (n.t === "add" || n.t === "sub") return vars(n).size > 0;
    if (n.t === "neg") return hasSum(n.a);
    return false;
  };
  // Forme « produit » : le nœud principal est un produit ou une puissance (signe moins mis à part).
  function isProduct(n) {
    n = unpar(n);
    while (n.t === "neg") n = unpar(n.a);
    return n.t === "mul" || (n.t === "pow" && hasSum(n.a));
  }
  // Forme « développée » : aucun produit ni puissance d'une somme contenant une lettre.
  function isExpanded(n) {
    if (!n) return true;
    if (n.t === "mul" && (hasSum(n.a) || hasSum(n.b))) return false;
    if (n.t === "pow" && hasSum(n.a)) return false;
    if (n.t === "div" && vars(n.b).size > 0) return false;
    return ["a", "b"].every((k) => isExpanded(n[k]));
  }

  const SAMPLES = [-3.7, -1.3, 0.6, 2.2, 4.1];
  function sameValue(u, v, rel = 1e-9) {
    if (!isFinite(u) || !isFinite(v)) return false;
    return Math.abs(u - v) <= rel * Math.max(1, Math.abs(v));
  }
  function equivalent(a, b) {
    const vs = [...new Set([...vars(a), ...vars(b)])];
    return SAMPLES.every((s, i) => {
      const env = {};
      vs.forEach((v, j) => (env[v] = SAMPLES[(i + j) % SAMPLES.length]));
      return sameValue(evaluate(a, env), evaluate(b, env), 1e-8);
    });
  }

  return { parse, evaluate, tex, vars, isProduct, isExpanded, equivalent, sameValue, unpar };
})();

// Vérifie la réponse de l'élève selon la spécification de la question.
// spec.kind : "value" (valeur numérique, round = précision demandée), "expr" (expression en x,
// form = "product" | "expanded"), "set" (liste de solutions), "choice" (index d'option).
// Résultat : { status: "correct" | "close" | "wrong" | "invalid" | "form", message }
function checkAnswer(spec, input) {
  if (spec.kind === "choice") return { status: input === spec.index ? "correct" : "wrong" };
  const none = /aucun|∅|vide|pas de solution|impossible/i.test(String(input));
  if (spec.kind === "set" && (none || spec.values.length === 0)) return { status: none && spec.values.length === 0 ? "correct" : spec.values.length === 0 ? "wrong" : "wrong" };
  let tree;
  try { tree = Expr.parse(String(input)); }
  catch (e) { return { status: "invalid", message: e.message }; }
  if (spec.kind === "value") {
    if (Expr.vars(tree).size) return { status: "invalid", message: "La réponse est un nombre : pas de lettre." };
    const v = Expr.evaluate(tree);
    if (!isFinite(v)) return { status: "invalid", message: "Ce calcul n'a pas de valeur (division par zéro ?)." };
    if (spec.round) {
      if (Math.abs(v - spec.value) <= spec.round / 2 + 1e-9) return { status: "correct" };
      if (Math.abs(v - spec.value) <= spec.round * 5) return { status: "close", message: "Presque : vérifie l'arrondi (au " + (spec.round === 0.01 ? "centième" : spec.round === 0.1 ? "dixième" : "près") + ")." };
      return { status: "wrong" };
    }
    if (Expr.sameValue(v, spec.value)) return { status: "correct" };
    if (Math.abs(v - spec.value) <= 1e-3 * Math.max(1, Math.abs(spec.value))) return { status: "close", message: "Très proche : donne la valeur exacte (fraction, racine, π…)." };
    return { status: "wrong" };
  }
  if (spec.kind === "set") {
    const items = tree.t === "list" ? tree.items : [tree];
    if (items.some((i) => Expr.vars(i).size)) return { status: "invalid", message: "Sépare les solutions par « ; »." };
    const got = items.map((i) => Expr.evaluate(i));
    const want = spec.values;
    const okAll = want.every((w) => got.some((g) => Expr.sameValue(g, w))) && got.every((g) => want.some((w) => Expr.sameValue(g, w)));
    if (okAll) return { status: "correct" };
    if (want.some((w) => got.some((g) => Expr.sameValue(g, w)))) return { status: "close", message: "Il manque une solution, ou il y en a une en trop." };
    return { status: "wrong" };
  }
  if (spec.kind === "pair") {
    const items = tree.t === "list" ? tree.items : [tree];
    if (items.length !== 2 || items.some((i) => Expr.vars(i).size)) return { status: "invalid", message: "Donne deux nombres séparés par « ; » (x d'abord, puis y)." };
    const [u, v] = items.map((i) => Expr.evaluate(i));
    if (Expr.sameValue(u, spec.values[0]) && Expr.sameValue(v, spec.values[1])) return { status: "correct" };
    if (Expr.sameValue(u, spec.values[1]) && Expr.sameValue(v, spec.values[0])) return { status: "close", message: "Les deux valeurs sont justes, mais dans le mauvais ordre : x d'abord." };
    return { status: "wrong" };
  }
  if (spec.kind === "expr") {
    const target = Expr.parse(spec.expr);
    if (!Expr.equivalent(tree, target)) return { status: "wrong" };
    if (spec.form === "product" && !Expr.isProduct(tree)) return { status: "form", message: "C'est égal, mais ce n'est pas factorisé : écris un produit." };
    if (spec.form === "expanded" && !Expr.isExpanded(tree)) return { status: "form", message: "C'est égal, mais il reste des parenthèses : développe complètement." };
    return { status: "correct" };
  }
  return { status: "invalid" };
}
