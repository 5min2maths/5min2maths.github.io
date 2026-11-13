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
        else if (w === "ln") toks.push({ t: "fn", v: "ln" });
        else if (w === "log") toks.push({ t: "fn", v: "log" });
        else if (w === "e" && !/[a-z]/i.test(s[j] || "")) toks.push({ t: "const", v: "e" });
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
      case "const": return n.v === "e" ? Math.E : Math.PI;
      case "var": return env[n.v] !== undefined ? env[n.v] : NaN;
      case "par": return evaluate(n.a, env);
      case "neg": return -evaluate(n.a, env);
      case "add": return evaluate(n.a, env) + evaluate(n.b, env);
      case "sub": return evaluate(n.a, env) - evaluate(n.b, env);
      case "mul": return evaluate(n.a, env) * evaluate(n.b, env);
      case "div": return evaluate(n.a, env) / evaluate(n.b, env);
      case "pow": return Math.pow(evaluate(n.a, env), evaluate(n.b, env));
      case "fn": { const v = evaluate(n.a, env); return n.f === "sqrt" ? Math.sqrt(v) : n.f === "cbrt" ? Math.cbrt(v) : n.f === "ln" ? Math.log(v) : Math.log10(v); }
      default: return NaN;
    }
  }

  const fmtNum = (v) => String(+v.toPrecision(12)).replace(".", "{,}");
  function tex(n) {
    switch (n.t) {
      case "num": return fmtNum(n.v);
      case "const": return n.v === "e" ? "e" : "\\pi";
      case "var": return n.v;
      case "par": return "\\left(" + tex(n.a) + "\\right)";
      case "neg": return "-" + tex(n.a);
      case "add": return tex(n.a) + " + " + tex(n.b);
      case "sub": return tex(n.a) + " - " + tex(n.b);
      case "mul": return tex(n.a) + (n.implicit ? " " : " \\cdot ") + tex(n.b);
      case "div": return "\\frac{" + tex(unpar(n.a)) + "}{" + tex(unpar(n.b)) + "}";
      case "pow": return "{" + tex(n.a) + "}^{" + tex(unpar(n.b)) + "}";
      case "fn": return n.f === "sqrt" ? "\\sqrt{" + tex(unpar(n.a)) + "}" : n.f === "cbrt" ? "\\sqrt[3]{" + tex(unpar(n.a)) + "}" : "\\" + n.f + "\\left(" + tex(unpar(n.a)) + "\\right)";
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
  // pos : lettres positives (formules de géométrie : racines définies).
  function equivalent(a, b, pos) {
    const vs = [...new Set([...vars(a), ...vars(b)])], S = pos ? [0.7, 1.3, 2.2, 3.7, 4.1, 5.9, 0.4] : SAMPLES;
    let valid = 0;
    for (let i = 0; i < S.length; i++) {
      const env = {};
      vs.forEach((v, j) => (env[v] = S[(i + 2 * j) % S.length] + (pos ? j * 0.37 : 0)));
      const want = evaluate(b, env);
      if (!isFinite(want)) continue; // point hors domaine de la réponse attendue
      valid++;
      if (!sameValue(evaluate(a, env), want, 1e-8)) return false;
    }
    return valid >= 2;
  }

  // Nombre de nœuds et présence d'une division par une expression littérale.
  const nodes = (n) => (!n || typeof n !== "object" ? 0 : 1 + nodes(n.a) + nodes(n.b));
  const hasDiv = (n) => !!n && typeof n === "object" && ((n.t === "div" && vars(n.b).size > 0) || hasDiv(n.a) || hasDiv(n.b));
  // « Une seule fraction » : un quotient (éventuellement précédé d'un signe), sans autre division littérale.
  function isOneFrac(n) {
    n = unpar(n);
    while (n.t === "neg") n = unpar(n.a);
    return n.t === "div" && !hasDiv(n.a) && !hasDiv(n.b);
  }
  return { parse, evaluate, tex, vars, isProduct, isExpanded, equivalent, sameValue, unpar, nodes, hasDiv, isOneFrac };
})();

// Ensembles de solutions (inéquations, domaines) : réunion d'intervalles [a, aIncl, b, bIncl].
const SolSet = (() => {
  const INF = /^\s*(\+?\s*(∞|inf(ini)?|oo))\s*$/i, NINF = /^\s*-\s*(∞|inf(ini)?|oo)\s*$/i;
  const num = (s) => {
    if (INF.test(s)) return Infinity;
    if (NINF.test(s)) return -Infinity;
    const t = Expr.parse(s);
    if (Expr.vars(t).size) throw new Error("Borne illisible : " + s);
    return Expr.evaluate(t);
  };
  const inside = (ivs, x) => ivs.some(([a, ai, b, bi]) => (x > a || (ai && x === a) || (ai && Expr.sameValue(x, a))) && (x < b || (bi && x === b) || (bi && Expr.sameValue(x, b))));
  // Lecture de la réponse de l'élève → liste d'intervalles (ou exclusions).
  function parse(input) {
    let s = String(input).trim().replace(/≤|=</g, "<=").replace(/≥|=>/g, ">=").replace(/≠|=\/=|<>/g, "!=").replace(/−/g, "-").replace(/\s+/g, " ");
    if (/^(aucune?s?|∅|\{\s*\}|vide|pas de solution|impossible)/i.test(s)) return [];
    const ALL = "(?:ℝ|R|IR|tous|tout)";
    if (new RegExp("^" + ALL + "$", "i").test(s)) return [[-Infinity, false, Infinity, false]];
    let m = s.match(new RegExp("^" + ALL + "\\s*(?:\\\\|\\-|privé de|sauf)\\s*\\{?([^}]*)\\}?$", "i"));
    if (m) return excl(m[1].split(/;|\s+et\s+/).map((x) => num(x)));
    const pieces = s.split(/\s*(?:∪|\bU\b|\bou\b|\bor\b)\s*/i);
    let out = [], ex = [];
    for (const pc of pieces) {
      let q = pc.trim();
      if (!q) continue;
      if ((m = q.match(/^([\[\]\(])\s*(.+?)\s*;\s*(.+?)\s*([\[\]\)])$/)) || (m = q.match(/^([\[\]\(])\s*([^,;]+?)\s*,\s*([^,;]+?)\s*([\[\]\)])$/))) {
        out.push([num(m[2]), m[1] === "[", num(m[3]), m[4] === "]"]); continue;
      }
      if ((m = q.match(/^(.+?)\s*(<=|<)\s*x\s*(<=|<)\s*(.+)$/i))) { out.push([num(m[1]), m[2] === "<=", num(m[4]), m[3] === "<="]); continue; }
      if ((m = q.match(/^(.+?)\s*(>=|>)\s*x\s*(>=|>)\s*(.+)$/i))) { out.push([num(m[4]), m[3] === ">=", num(m[1]), m[2] === ">="]); continue; }
      if ((m = q.match(/^x\s*(<=|>=|<|>|!=|=)\s*(.+)$/i))) { add(out, ex, m[1], num(m[2])); continue; }
      if ((m = q.match(/^(.+?)\s*(<=|>=|<|>)\s*x$/i))) { add(out, ex, { "<=": ">=", ">=": "<=", "<": ">", ">": "<" }[m[2]], num(m[1])); continue; }
      throw new Error("Écris par exemple « x <= -2 ou x > 3 », « -1 < x <= 4 » ou « ]-∞ ; 2] ∪ [5 ; +∞[ ».");
    }
    if (ex.length) { const e = excl(ex); return out.length ? out.concat(e) : e; }
    return out;
  }
  function add(out, ex, op, v) {
    if (op === "<") out.push([-Infinity, false, v, false]);
    else if (op === "<=") out.push([-Infinity, false, v, true]);
    else if (op === ">") out.push([v, false, Infinity, false]);
    else if (op === ">=") out.push([v, true, Infinity, false]);
    else if (op === "=") out.push([v, true, v, true]);
    else ex.push(v);
  }
  function excl(vals) {
    const v = [...vals].sort((a, b) => a - b), out = [];
    let lo = -Infinity;
    v.forEach((x) => { out.push([lo, false, x, false]); lo = x; });
    out.push([lo, false, Infinity, false]);
    return out;
  }
  // Points de test : bornes des deux ensembles, voisins immédiats, milieux, au-delà.
  function check(want, got) {
    const bs = [...new Set(want.concat(got).flatMap(([a, , b]) => [a, b]).filter(isFinite))].sort((a, b) => a - b);
    const pts = [], edges = new Set(bs);
    if (!bs.length) pts.push(0, 1e4, -1e4);
    bs.forEach((b, i) => { pts.push(b, b - 1e-6, b + 1e-6); if (i < bs.length - 1) pts.push((b + bs[i + 1]) / 2); });
    if (bs.length) pts.push(bs[0] - 1.7, bs[bs.length - 1] + 1.7, -1e5, 1e5);
    let edgeOnly = true, bad = false;
    for (const x of pts) if (inside(want, x) !== inside(got, x)) { bad = true; if (!edges.has(x)) edgeOnly = false; }
    if (!bad) return { status: "correct" };
    if (edgeOnly) return { status: "close", message: "Les intervalles sont justes : vérifie si les bornes sont comprises ou exclues." };
    return { status: "wrong" };
  }
  // Écriture : fraction simple si possible.
  const nstr = (v, tex) => {
    if (v === Infinity) return tex ? "+\\infty" : "+∞";
    if (v === -Infinity) return tex ? "-\\infty" : "-∞";
    if (Number.isInteger(v)) return String(v);
    for (let d = 2; d <= 30; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return tex ? (v < 0 ? "-" : "") + "\\frac{" + Math.abs(Math.round(v * d)) + "}{" + d + "}" : Math.round(v * d) + "/" + d;
    return tex ? String(+v.toFixed(3)).replace(".", "{,}") : String(v);
  };
  function show(ivs, tex = true) {
    if (!ivs.length) return tex ? "\\varnothing" : "aucune";
    const sep = tex ? " \\cup " : " ∪ ";
    return ivs.map(([a, ai, b, bi]) => a === b ? (tex ? "\\{" + nstr(a, tex) + "\\}" : "[" + nstr(a) + " ; " + nstr(a) + "]") : (ai ? "[" : "]") + nstr(a, tex) + (tex ? " \\, ; \\, " : " ; ") + nstr(b, tex) + (bi ? "]" : "[")).join(sep);
  }
  return { parse, check, show, inside };
})();

// Diagnostic d'une réponse fausse (13.11, élèves en difficulté) : pièges propres à la question (q.traps), puis erreurs
// typiques reconnues sur la valeur : signe, virgule ou unité, fraction inversée, racine ou carré oublié.
function diagnose(q, input) {
  const spec = q.spec;
  if (!spec || spec.kind !== "value") return null;
  let v; try { const t = Expr.parse(input); if (Expr.vars(t).size) return null; v = Expr.evaluate(t); } catch (e) { return null; }
  if (!isFinite(v)) return null;
  const w = spec.value, tol = (x, y) => Math.abs(x - y) <= Math.max(spec.round ? spec.round * 0.6 : 0, 1e-6 * Math.max(1, Math.abs(y)));
  for (const tr of q.traps || []) if (tol(v, tr.v)) return tr.m;
  if (w !== 0 && tol(v, -w)) return "Le nombre est bon, mais pas le signe : vérifie les règles des signes.";
  for (const k of [1, 2, 3]) if (w !== 0 && (tol(v, w * 10 ** k) || tol(v, w / 10 ** k))) return "Les chiffres sont bons, mais pas la virgule (ou l'unité) : vérifie la conversion ou le rang.";
  if (w !== 0 && Math.abs(w) !== 1 && tol(v, 1 / w)) return "Tu as inversé : c'est l'inverse de la bonne réponse (numérateur et dénominateur échangés ?).";
  if (Math.abs(w) > 1 && tol(v, w * w)) return "Il manque une étape : n'oublie pas la racine carrée à la fin.";
  if (w > 1 && tol(v, Math.sqrt(w))) return "Il manque une étape : pense à élever au carré.";
  return null;
}

// Vérifie la réponse de l'élève selon la spécification de la question.
// spec.kind : "value" (valeur numérique, round = précision demandée), "expr" (expression en x,
// form = "product" | "expanded"), "set" (liste de solutions), "choice" (index d'option).
// Résultat : { status: "correct" | "close" | "wrong" | "invalid" | "form", message }
function checkAnswer(spec, input) {
  if (spec.kind === "choice") return { status: input === spec.index ? "correct" : "wrong" };
  if (spec.kind === "ineq") {
    const m = String(input).replace(/≤/g, "<=").replace(/≥/g, ">=").match(/^\s*x\s*(<=|>=|<|>)\s*(.+)$/i);
    if (!m) {
      // Écriture en intervalle (« [3 ; +∞[ ») : même ensemble que l'inégalité attendue.
      const v = spec.value, want = { "<": [[-Infinity, false, v, false]], "<=": [[-Infinity, false, v, true]], ">": [[v, false, Infinity, false]], ">=": [[v, true, Infinity, false]] }[spec.op];
      if (want && /[\[\]∞]/.test(String(input))) return checkAnswer({ kind: "solset", ivs: want }, input);
      return { status: "invalid", message: "Écris par exemple « x > 4 », « x <= -3 » ou « [3 ; +∞[ »." };
    }
    let v;
    try { const t = Expr.parse(m[2]); v = Expr.evaluate(t); } catch (e) { return { status: "invalid", message: e.message }; }
    const okVal = Expr.sameValue(v, spec.value), okOp = m[1] === spec.op;
    if (okVal && okOp) return { status: "correct" };
    if (okVal) return { status: "close", message: "La borne est juste ; vérifie le sens de l'inégalité (et s'il faut retourner le signe)." };
    return { status: "wrong" };
  }
  if (spec.kind === "solset") {
    let got;
    try { got = SolSet.parse(input); } catch (e) { return { status: "invalid", message: e.message }; }
    return SolSet.check(spec.ivs, got);
  }
  const none = /aucun|∅|vide|pas de solution|impossible/i.test(String(input));
  if (spec.kind === "set" && (none || spec.values.length === 0)) return { status: none && spec.values.length === 0 ? "correct" : spec.values.length === 0 ? "wrong" : "wrong" };
  let tree;
  try { tree = Expr.parse(String(input)); }
  catch (e) { return { status: "invalid", message: e.message }; }
  if (spec.kind === "value") {
    // plain : on attend un nombre écrit en chiffres (conversion, écriture décimale), pas une fraction ni un calcul
    if (spec.plain && !/^\s*-?\s*\d[\d'’ ]*([.,]\d+)?\s*$/.test(String(input))) return { status: "invalid", message: "Écris le résultat comme un nombre décimal (pas de fraction ni de calcul)." };
    if (Expr.vars(tree).size) return { status: "invalid", message: "La réponse est un nombre : pas de lettre." };
    const v = Expr.evaluate(tree);
    if (!isFinite(v)) return { status: "invalid", message: "Ce calcul n'a pas de valeur (division par zéro ?)." };
    if (spec.round) {
      if (Math.abs(v - spec.value) <= spec.round / 2 + 1e-9) return { status: "correct" };
      if (Math.abs(v - spec.value) <= spec.round * 5) return { status: "close", message: "Presque : vérifie l'arrondi (au " + (spec.round === 0.01 ? "centième" : spec.round === 0.1 ? "dixième" : "près") + ")." };
      return { status: "wrong" };
    }
    if (Expr.sameValue(v, spec.value)) {
      // Forme exigée par la consigne (audit 13.11) : notation scientifique, racine simplifiée a√b.
      const raw = String(input).replace(/\s+/g, "").replace(/[·×]/g, "*").replace(/,/g, ".");
      if (spec.sci) {
        const m = raw.match(/^(-?\d+(?:\.\d+)?)\*10\^\(?(-?\d+)\)?$/), a = m ? Math.abs(+m[1]) : 0;
        if (!(m && a >= 1 && a < 10) && !(/^-?\d+(\.\d+)?$/.test(raw) && Math.abs(v) >= 1 && Math.abs(v) < 10)) return { status: "form", message: "La valeur est juste ; écris-la en notation scientifique : a · 10^n avec 1 ≤ a < 10 (par exemple 4,5*10^-3)." };
      }
      if (spec.radical) {
        const m = raw.match(/^-?(\d*)\*?√\(?(\d+)\)?$/), sqf = (n) => { for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false; return true; };
        if (!(/^-?\d+$/.test(raw) || (m && sqf(+m[2])))) return { status: "form", message: "La valeur est juste ; simplifie : écris a√b avec b le plus petit possible (par exemple 6√3)." };
      }
      return { status: "correct" };
    }
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
    const n = spec.values.length;
    if (items.length !== n || items.some((i) => Expr.vars(i).size)) return { status: "invalid", message: n === 3 ? "Donne trois nombres séparés par « ; » (x, puis y, puis z)." : "Donne deux nombres séparés par « ; » (x d'abord, puis y)." };
    if (n === 3) { const g = items.map((i) => Expr.evaluate(i)); if (g.every((v, k) => Expr.sameValue(v, spec.values[k]))) return { status: "correct" }; return g.filter((v, k) => Expr.sameValue(v, spec.values[k])).length >= 1 ? { status: "close", message: "Une partie est juste : vérifie chaque valeur dans les trois équations." } : { status: "wrong" }; }
    const [u, v] = items.map((i) => Expr.evaluate(i));
    if (Expr.sameValue(u, spec.values[0]) && Expr.sameValue(v, spec.values[1])) return { status: "correct" };
    if (Expr.sameValue(u, spec.values[1]) && Expr.sameValue(v, spec.values[0])) return { status: "close", message: "Les deux valeurs sont justes, mais dans le mauvais ordre : x d'abord." };
    return { status: "wrong" };
  }
  if (spec.kind === "expr") {
    const target = Expr.parse(spec.expr);
    if (tree.t === "list" || tree.t === "eq") return { status: "invalid", message: "Donne une seule expression." };
    if (!Expr.equivalent(tree, target, spec.pos)) return { status: "wrong" };
    if (spec.form === "nodiv" && Expr.hasDiv(tree)) return { status: "form", message: "C'est égal, mais on peut encore simplifier : il ne doit plus rester de fraction." };
    if (spec.form === "onefrac" && !Expr.isOneFrac(tree)) return { status: "form", message: "C'est égal, mais écris le résultat comme une seule fraction." };
    if (spec.maxNodes && Expr.nodes(tree) > spec.maxNodes) return { status: "form", message: "C'est égal, mais la fraction n'est pas simplifiée." };
    if (spec.form === "product" && !Expr.isProduct(tree)) return { status: "form", message: "C'est égal, mais ce n'est pas factorisé : écris un produit." };
    if (spec.form === "expanded" && !Expr.isExpanded(tree)) return { status: "form", message: "C'est égal, mais il reste des parenthèses : développe complètement." };
    return { status: "correct" };
  }
  return { status: "invalid" };
}
