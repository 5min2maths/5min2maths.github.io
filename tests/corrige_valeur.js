/* Garde-fou « la réponse est dans le corrigé » (27.11, agent corrige ; rapport tools/corrige_valeur.md).
   Constat : des corrigés s'arrêtaient avant la réponse demandée (« 2a = −6 » sans « a = −3 »), oubliaient le nombre de
   solutions, donnaient un signe faux alors que la réponse attendue était juste. Méthode reprise de tests/primaire.html
   (le corrigé contient la réponse), étendue à tout le catalogue et à toutes les formes de réponse :
   - le corrigé (q.sol, HTML + TeX) est mis en texte calculable (fractions imbriquées, racines, π, virgule décimale,
     milliers 1'200 ou 1 200, × ou ·) ;
   - value : un nombre du corrigé vaut la réponse (signe compris : un « − » binaire n'est pas un signe), à l'arrondi
     annoncé près (spec.round) ou affiché arrondi (≈, 2 décimales et plus) ; formes : entier, décimal, fraction, a√b,
     (a ± √b)/c, aπ, a · 10^n, pourcentage ;
   - set / pair : chaque valeur attendue est dans le corrigé ; ensemble vide ou « tous les nombres » écrit en toutes lettres ;
   - expr : une expression du corrigé est acceptée par le correcteur de l'app (checkAnswer, avec la forme exigée :
     réduite, développée, factorisée…), comme si l'élève l'avait tapée ;
   - ineq / solset : chaque borne finie est dans le corrigé, avec un symbole d'inégalité ou un intervalle ;
   - fin contradictoire : un corrigé qui se termine par « lettre = nombre » doit finir sur la réponse (ou une des valeurs).
   CV.check(q) rend la liste des écarts [{ key, msg }] ; CV.kinds compte les formes contrôlées et ignorées. */
const CV = (() => {
  /* ---------- lecture d'un groupe {…} équilibré ---------- */
  const group = (s, i) => {
    while (s[i] === " ") i++;
    if (s[i] !== "{") { const m = /^(\\[a-zA-Z]+|.)/.exec(s.slice(i)); return m ? [m[0], i + m[0].length] : ["", i]; }
    let d = 0;
    for (let j = i; j < s.length; j++) { if (s[j] === "{" && s[j - 1] !== "\\") d++; else if (s[j] === "}" && s[j - 1] !== "\\") { d--; if (!d) return [s.slice(i + 1, j), j + 1]; } }
    return [s.slice(i + 1), s.length];
  };
  /* \frac{A}{B} → (A)/(B), \sqrt{A} → √(A), \sqrt[3]{A} → ∛(A), ^{A} → ^(A), du plus profond au plus haut */
  const macros = (s) => {
    for (let guard = 0; guard < 200; guard++) {
      const m = /\\[dt]?frac(?![a-zA-Z])|\\sqrt(?![a-zA-Z])|\^\{|_\{/.exec(s); if (!m) break;
      const i = m.index;
      if (m[0] === "^{") { const [a, j] = group(s, i + 1); s = s.slice(0, i) + "^(" + a + ")" + s.slice(j); continue; }
      if (m[0] === "_{") { const [, j] = group(s, i + 1); s = s.slice(0, i) + s.slice(j); continue; }
      if (/frac/.test(m[0])) { const [a, j] = group(s, i + m[0].length), [b, k] = group(s, j); s = s.slice(0, i) + "(" + a + ")/(" + b + ")" + s.slice(k); continue; }
      let j = i + 5, idx = "";
      if (s[j] === "[") { const e = s.indexOf("]", j); idx = s.slice(j + 1, e).trim(); j = e + 1; }
      const [a, k] = group(s, j);
      s = s.slice(0, i) + (idx === "3" ? "∛(" : idx ? "(" : "√(") + a + ")" + (idx && idx !== "3" ? "^(1/" + idx + ")" : "") + s.slice(k);
    }
    return s;
  };
  /* HTML + TeX → texte calculable */
  const text = (raw) => {
    let s = String(raw == null ? "" : raw)
      .replace(/<svg[\s\S]*?<\/svg>/g, " ; ").replace(/<br\s*\/?>/g, " ; ").replace(/<\/(li|p|div|tr|td|th)>/g, " ; ").replace(/<\/?[a-zA-Z][^<>]*>/g, " ")
      .replace(/\\text\s*\{'\}|\{'\}/g, "'").replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, " C($1 ; $2) ")
      .replace(/&nbsp;|&#160;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&minus;/g, "-")
      .replace(/\\\(|\\\)|\\\[|\\\]/g, " ")
      .replace(/\\begin\{[a-z*]+\}|\\end\{[a-z*]+\}/g, " ; ").replace(/\\\\/g, " ; ").replace(/&(?=\s*[=<>≤≥≈])|(?<=[=<>≤≥≈]\s*)&/g, " ").replace(/&/g, " ; ") /* matrices : une case = un nombre */
      .replace(/(\d)\\,(?=\d{3}(?!\d))/g, "$1") /* milliers 1\,200 (France) */
      .replace(/\\mathbb\{R\}|\\R\b/g, "ℝ").replace(/\\(?:text|mathrm|textbf|mathbf|operatorname|mbox|textit|mathit|boldsymbol)\s*\{([^{}]*)\}/g, " $1 ")
      .replace(/\{,\}/g, ".")
      .replace(/\\left|\\right|\\big|\\Big|\\displaystyle/g, "");
    s = macros(s);
    s = s.replace(/\\cdot|\\times|×|∙|⋅/g, "·").replace(/\\div|÷/g, ":").replace(/\\pi\b/g, "π").replace(/\\infty/g, "∞")
      .replace(/\\cup/g, "∪").replace(/\\cap/g, "∩").replace(/\\emptyset|\\varnothing/g, "∅").replace(/\\\{/g, "⦃").replace(/\\\}/g, "⦄")
      .replace(/\\leq?\b|\\leqslant/g, "≤").replace(/\\geq?\b|\\geqslant/g, "≥").replace(/\\lt\b/g, "<").replace(/\\gt\b/g, ">").replace(/\\neq?\b/g, "≠")
      .replace(/\\approx|\\simeq/g, "≈").replace(/\\pm/g, "±").replace(/\\mp/g, "∓")
      .replace(/\\(?:iff|Leftrightarrow|Rightarrow|implies|Longrightarrow|longrightarrow|rightarrow|to|mapsto|quad|qquad)\b/g, " ⇒ ")
      .replace(/\^\(?\\circ\)?|\\circ|\\degree/g, "°").replace(/\\%/g, "%").replace(/\\[,;:! ]|~/g, " ")
      .replace(/\\[lr]?vert|\\mid/g, "|").replace(/\\setminus|\\backslash/g, " ∖ ").replace(/\\(ln|sin|cos|tan|exp|log)(?![a-zA-Z])/g, " $1 ").replace(/\\[a-zA-Z]+/g, " ").replace(/[{}]/g, "").replace(/⦃/g, "{").replace(/⦄/g, "}")
      .replace(/[−–]/g, "-").replace(/(\d)[   ](?=\d{3}(?!\d))/g, "$1").replace(/[   ]/g, " ");
    s = s.replace(/(\d)'(?=\d{3})/g, "$1").replace(/(\d)’(?=\d{3})/g, "$1")
      .replace(/(\d),(\d)/g, "$1.$2")
      .replace(/(^|[;.:]\s|\s;)\s*[a-h]\)\s/g, "$1 ; ") /* étiquettes de parties a) b) */
      .replace(/\s+/g, " ").trim();
    return s;
  };

  /* ---------- nombres du corrigé ---------- */
  const N = String.raw`\d+(?:\.\d+)?`, PF = String.raw`\((?:[^()]|\([^()]*\))*\)\s*\/\s*\((?:[^()]|\([^()]*\))*\)`, NP = String.raw`(?:\(\s*-?\s*${N}\s*\)|${N})`;
  const FORMS = [
    PF,                                                                                 /* (a)/(b), (3 ± √(5))/(2) */
    String.raw`${N}\s*[+\-±]\s*(?:${N}\s*·?\s*)?√\s*${NP}`,                            /* 2 + √3, 1 − 2√2 */
    String.raw`${N}\s*·\s*10\s*\^\s*\(?\s*-?\d+\s*\)?`,                              /* a · 10^n */
    String.raw`(?:(?:${PF}|${N}\s*\/\s*${N}|${N})\s*·?\s*)?(?:[√∛]\s*${NP}|π)(?:\s*\/\s*${NP})?`,  /* a√b, √b/c, (5)/(2)π, aπ, π/b */
    String.raw`${N}\s*\/\s*${N}`,                                                       /* a/b */
    N,
  ];
  const FRE = new RegExp(FORMS.map((f) => "(?:" + f + ")").join("|"), "g");
  const OKCH = /^[\d.\s+\-±·*/^()√∛π]*$/;
  const evalStr = (s) => {
    const vs = /±/.test(s) ? [s.replace(/±/g, "+"), s.replace(/±/g, "-")] : [s];
    const out = [];
    for (const v of vs) { try { const t = Expr.parse(v.replace(/·/g, "*")); if (!Expr.vars(t).size) { const x = Expr.evaluate(t); if (isFinite(x)) out.push(x); } } catch (e) {} }
    return out;
  };
  /* signe : un « - » est unaire s'il suit un début, un symbole, ou un mot de 2 lettres ou plus (« vaut -3 ») */
  const unary = (T, i) => {
    let k = i - 1; while (k >= 0 && (T[k] === " " || T[k] === "(")) k--;
    if (k < 0) return 0;
    if (T[k] !== "-" && T[k] !== "∓") return T[k] === "±" ? 2 : 0;
    let j = k - 1; while (j >= 0 && T[j] === " ") j--;
    if (j < 0) return 1;
    if (/[\d)π°%²³!]/.test(T[j])) return 0;
    if (/[A-Za-zÀ-ÿ]/.test(T[j])) { let w = j; while (w > 0 && /[A-Za-zÀ-ÿ]/.test(T[w - 1])) w--; return j - w + 1 >= 2 && !/^(?:sin|cos|tan|ln|log|exp)$/.test(T.slice(w, j + 1)) ? 1 : 0; }
    return 1;
  };
  const nums = (T) => {
    const out = [];
    for (const m of T.matchAll(FRE)) {
      const s = m[0]; if (!OKCH.test(s)) continue;
      const sg = unary(T, m.index), vals = evalStr(s), dec = (/\.(\d+)(?![\d.])\s*$/.exec(s) || ["", ""])[1].length;
      const before = T.slice(Math.max(0, m.index - 14), m.index), approx = /≈|environ|arrondi|~|à peu près/.test(before) || dec >= 2;
      const after = T.slice(m.index + s.length, m.index + s.length + 3);
      for (let v of vals) {
        const add = (x) => out.push({ v: x, s, dec, approx, at: m.index });
        if (sg === 2) { add(v); add(-v); } else add(sg ? -v : v);
        if (/^\s*%/.test(after)) add((sg ? -v : v) / 100);
      }
      /* numérateur et dénominateur d'une fraction (« ?/21 » : 9 dans 9/21), coefficient d'une racine (−2 dans −2∛3) : rôle « part » */
      const fr = /^\(\s*(-?\s*[\d.]+)\s*\)\s*\/\s*\(\s*([\d.]+)\s*\)$/.exec(s) || /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(s);
      if (fr) { out.push({ v: (sg ? -1 : 1) * +fr[1].replace(/\s/g, ""), s, dec: 0, approx: false, part: true }); out.push({ v: +fr[2], s, dec: 0, approx: false, part: true }); }
      const co = /^\(?\s*(\d+(?:\.\d+)?)\s*·?\s*[√∛π]/.exec(s); if (co) out.push({ v: (sg ? -1 : 1) * +co[1], s, dec: 0, approx: false, part: true }); /* 49 dans 49π, k dans (kπ)/4 */
      const ex = /10\s*\^\s*\(?\s*(-?\d+)\s*\)?$/.exec(s); if (ex) out.push({ v: +ex[1], s, dec: 0, approx: false, part: true }); /* exposant de a · 10^n */
    }
    return out;
  };
  /* nombres écrits en lettres (« aucun zéro », « deux solutions ») et formes exactes non rationnelles (e, ln, sin, √, π)
     prises en entier dans un membre d'égalité (« 2 − 10e^(−2) », « 4 − 4 ln 4 », « 36 − 9π cm² ») */
  const WORDS = [[/\baucun(?:e)?\b|\bpas de (?:solution|zéro|racine)/i, 0], [/\bune? seul(?:e)?\b|\bunique\b/i, 1], [/\bdeux\b/i, 2], [/\btrois\b/i, 3], [/\bquatre\b/i, 4], [/\bcinq\b/i, 5], [/\bsix\b/i, 6]];
  const closed = (T, ctx) => {
    const out = [];
    if (/\boui\b/i.test(ctx || "")) { if (/\boui\b/i.test(T)) out.push({ v: 1, s: "oui", dec: 0, part: true }); if (/\bnon\b|\bpas\b/i.test(T)) out.push({ v: 0, s: "non", dec: 0, part: true }); } /* réponse « 1 = oui, 0 = non » */
    for (const w of WORDS) if (w[0].test(T)) out.push({ v: w[1], s: "mot", dec: 0, approx: false, part: true });
    /* coefficients et terme constant d'une expression donnée comme résultat (« y = 10x − 16 », « P(x) = x³ − x² − 9x + 9 ») :
       seulement à droite de « lettre = » ou « f(x) = » (jamais dans un facteur (x − 3), où le signe est l'inverse de la racine) */
    for (const m of T.matchAll(/(?:^|[\s;:,])[A-Za-z](?:\([a-z]\))?\s*=\s*([^;,]+?)(?=\s*(?:[;,]|\.\s|\.$|$))/g)) for (let rhs of m[1].split("=")) {
      rhs = rhs.trim(); if (!/[a-z]/.test(rhs) || /[A-Za-zÀ-ÿ]{2,}/.test(rhs.replace(/\b(?:ln|sin|cos|tan|exp)\b/g, ""))) continue;
      let d = 0, cur = "", terms = [];
      for (const ch of rhs) { if (ch === "(") d++; if (ch === ")") d--; if (!d && (ch === "+" || ch === "-") && cur.trim()) { terms.push(cur); cur = ch; } else cur += ch; }
      terms.push(cur);
      for (let t of terms) { t = t.replace(/\s/g, ""); const k = /^([+-]?)(\d+(?:\.\d+)?)?(·?[a-z(]|$)/.exec(t); if (!k) continue; const v = (k[1] === "-" ? -1 : 1) * (k[2] ? +k[2] : 1); if (!k[3] && !k[2]) continue; out.push({ v, s: t, dec: 0, approx: false, part: true }); }
    }
    for (const sd of sides(T)) {
      if (!/[√∛π]|\bln\b|\blog\b|(?<![A-Za-zÀ-ÿ])e(?![A-Za-zÀ-ÿ])|\bsin\b|\bcos\b|\btan\b|\bexp\b/.test(sd)) continue;
      const rest = sd.replace(/\b(?:ln|log|sin|cos|tan|exp)\b/g, "").replace(/e(?=\^|\s|$|[)+\-·*/])/g, "").replace(/\b(?:cm|mm|km|dm|m|kg|g|L|dL|mL|min|h|s|CHF|EUR)\b[²³]?/g, "");
      if (/[A-Za-zÀ-ÿ]/.test(rest)) continue;
      const k = T.indexOf(sd), sg = k >= 0 && /-\s*$/.test(T.slice(0, k)) && unary(T, k) ? -1 : 1;
      for (const v of evalStr(sd.replace(/\b(?:cm|mm|km|dm|m|kg|g|L|dL|mL|min|h|s|CHF|EUR)\b[²³]?/g, ""))) out.push({ v: sg * v, s: sd, dec: 0, approx: false });
    }
    return out;
  };
  const same = (c, v, sp) => {
    if (Expr.sameValue(c.v, v, 1e-7)) return true;
    if (sp && sp.round && Math.abs(c.v - v) <= sp.round / 2 + 1e-9) return true;
    if (c.approx && Math.abs(c.v - v) <= 0.5 * 10 ** -c.dec + 1e-9 * Math.max(1, Math.abs(v))) return true;
    return false;
  };
  const has = (C, v, sp) => C.some((c) => same(c, v, sp));
  const fmt = (v) => String(+(+v).toFixed(6)).replace(".", ",");

  /* ---------- expressions (expr) : morceaux du corrigé essayés comme réponses tapées ---------- */
  const sides = (T0) => {
    const out = new Set();
    /* apartés entre parenthèses (« (+ puis −) », « (ou, développé, …) », « (et x − 4 > 0 ; c'est bien le cas) ») retirés */
    let T = T0; for (let k = 0; k < 4; k++) T = T.replace(/\s\((?=[^()]*\b[A-Za-zÀ-ÿ']{2,})[^()]*\)/g, (m) => /\b(?:ln|sin|cos|tan|exp|log)\b/.test(m) && !/[A-Za-zÀ-ÿ]{5,}/.test(m) ? m : " ");
    T = T + " ; " + T0;
    for (const piece of T.split(/\s;\s|;|\.\s|\.$|\bdonc\b|\bsoit\b|\bd'où\b|\bet\b|\bou\b|⇒|:\s|,\s|\bpuis\b|\balors\b/i)) {
      for (let side of piece.split(/=|≈/)) {
        side = side.trim().replace(/\.$/, ""); if (!side) continue;
        out.add(side);
        const a0 = side.replace(/^(?:(?!(?:ln|sin|cos|tan|exp|log)\b)[A-Za-zÀ-ÿ'’]{1,}\s+)+/, "").replace(/\s\([^()]*(?:\([^()]*\)[^()]*)*\)\s*$/, "").trim();
        if (a0) { out.add(a0); const c0 = a0.replace(/\s+(?!(?:ln|sin|cos|tan|exp|log)\b)[A-Za-zÀ-ÿ'’]{2,}(?![(\w]).*$/, "").trim(); if (c0) out.add(c0); } /* « 40x + 38 est de degré 1 » */ /* « ordonnée à l'origine ln 5 − 1 », « 5/(5x + 3) (u'/u) » */
        const a = side.replace(/^(?:[A-Za-zÀ-ÿ'’]{2,}\s+)+/, "").replace(/(?:\s+[A-Za-zÀ-ÿ'’]{2,})+\.?$/, "").trim();
        if (a) out.add(a);
        const b = a.replace(/\s*\((?:[^()]*[A-Za-zÀ-ÿ]{3,}[^()]*)\)\s*$/, "").replace(/\s\((?=[A-Za-zÀ-ÿ]{2,}).*$/, "").replace(/(?:\s+[A-Za-zÀ-ÿ'’]{1,4}[²³])+\.?$/, "").replace(/(?:\s+[A-Za-zÀ-ÿ'’]{2,})+\.?$/, "").trim(); if (b) out.add(b); /* « (forme réduite) », « cm³ (ou … » */
        for (const g of side.matchAll(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)) if (/[a-z]/.test(g[1])) out.add(g[1].trim()); /* « 2(2km + k + m) + 1 » : contenu d'une parenthèse */
      }
    }
    return [...out].filter((x) => x.length < 160);
  };
  const exprOK = (T, sp) => sides(T).some((s) => (/±/.test(s) ? [s.replace(/±/g, "+"), s.replace(/±/g, "-")] : [s]).some((x) => { try { return checkAnswer(sp, x.replace(/·/g, "*").replace(/∛/g, "cbrt")).status === "correct"; } catch (e) { return false; } }));

  /* ---------- une réponse (spec) dans un texte T ---------- */
  const NONE = /aucune?\b|∅|\{\s*\}|pas de solution|impossible|n'a pas de solution|ensemble vide/i, ALL = /tous les (?:nombres|réels)|tout (?:nombre|réel)|ℝ|infinité|une infinité|toujours vraie|indéterminée/i;
  const IQ = /[<>≤≥]|\]|\[|ℝ\s*∖|∖/;
  /* inégalité : « x > 4 », « 4 < x », « ]4 ; +∞[ » avec le bon sens et la bonne borne */
  const OPN = { "<": "<", ">": ">", "≤": "<=", "≥": ">=", "<=": "<=", ">=": ">=" }, FLIP = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
  const BND = String.raw`-?\s*(?:` + FORMS.slice(0, 6).join("|") + String.raw`|\d+(?:\.\d+)?)`;
  function ineqOK(T, sp) {
    const rel = [], ok = (op, s) => evalStr(s.replace(/^-\s*/, "-")).some((v) => same({ v, dec: 0 }, sp.value, sp)) && OPN[op] === sp.op;
    for (const m of T.matchAll(new RegExp(String.raw`(?:^|[^A-Za-z])[a-zA-Z]\s*(<=|>=|<|>|≤|≥)\s*(` + BND + ")", "g"))) rel.push(ok(m[1], m[2]));
    for (const m of T.matchAll(new RegExp("(" + BND + String.raw`)\s*(<=|>=|<|>|≤|≥)\s*[a-zA-Z](?![A-Za-z])`, "g"))) rel.push(ok(FLIP[OPN[m[2]]] || m[2], m[1]));
    for (const m of T.matchAll(new RegExp(String.raw`([\[\]])\s*(` + BND + String.raw`|-\s*∞)\s*;\s*(\+?\s*∞|` + BND + String.raw`)\s*([\[\]])`, "g"))) {
      if (/∞/.test(m[3]) && !/∞/.test(m[2])) rel.push(ok(m[1] === "[" ? ">=" : ">", m[2]));
      if (/∞/.test(m[2]) && !/∞/.test(m[3])) rel.push(ok(m[4] === "]" ? "<=" : "<", m[3]));
    }
    return rel.some(Boolean);
  }
  function present(T, sp, C) {
    switch (sp.kind) {
      case "value": return has(C, sp.value, sp) ? null : "valeur " + fmt(sp.value) + (sp.round ? " (à " + String(sp.round).replace(".", ",") + " près)" : "") + " absente";
      case "set": {
        if (sp.all) return ALL.test(T) ? null : "« tous les nombres » absent";
        if (!sp.values.length) return NONE.test(T) ? null : "ensemble vide (aucune solution) absent";
        const miss = sp.values.filter((v) => !has(C, v, sp));
        return miss.length ? "solution(s) " + miss.map(fmt).join(" ; ") + " absente(s) (attendu " + sp.values.map(fmt).join(" ; ") + ")" : null;
      }
      case "pair": { const miss = sp.values.filter((v) => !has(C, v, sp)); return miss.length ? "valeur(s) " + miss.map(fmt).join(" ; ") + " absente(s) (attendu " + sp.values.map(fmt).join(" ; ") + ")" : null; }
      case "expr": return exprOK(T, sp) ? null : "expression " + sp.expr + (sp.form ? " (forme " + sp.form + ")" : "") + " absente";
      case "ineq": return ineqOK(T, sp) ? null : "inégalité x " + sp.op + " " + fmt(sp.value) + " absente";
      case "solset": {
        const b = []; for (const iv of sp.ivs) for (const x of [iv[0], iv[2]]) if (x != null && isFinite(x)) b.push(x);
        if (!sp.ivs.length) return NONE.test(T) ? null : "ensemble vide absent";
        if (!b.length) return ALL.test(T) || /\]\s*-\s*∞\s*;\s*\+?\s*∞\s*\[/.test(T) ? null : "ℝ absent";
        const miss = b.filter((v) => !has(C, v, sp)); return miss.length || !IQ.test(T) ? "borne(s) " + (miss.length ? miss.map(fmt).join(" ; ") : "") + " ou symbole absents (intervalle(s) " + JSON.stringify(sp.ivs) + ")" : null;
      }
    }
    return null;
  }
  /* fin contradictoire : texte terminé par « lettre = nombre » qui n'est pas la réponse */
  const ENDRE = new RegExp(String.raw`(?:^|[\s;(,])([A-Za-z](?:\d|')?)\s*(=|≈)\s*(` + FORMS.slice(0, 6).map((f) => "(?:-\\s*)?(?:" + f + ")").join("|") + String.raw`|-?\s*${N})\s*(?:[A-Za-zÀ-ÿ°%²³/ ]{0,12})?\s*[.;]?\s*$`);
  function ending(T, sp) {
    const m = ENDRE.exec(T); if (!m) return null;
    /* dernière phrase : une vérification (« Vérification : A = B = 12 ») n'est pas la réponse ; la réponse dite dans la même
       phrase (« Donc a = −4 et b = 6 ») suffit */
    const last = T.split(/\.\s|\s;\s/).filter((x) => x.trim()).pop() || "";
    if (/^\s*(?:vérif|contrôle|on vérifie|check)/i.test(last)) return null;
    const LC = nums(last).concat(closed(last)).filter((c) => !c.part);
    const want0 = sp.kind === "value" || sp.kind === "ineq" ? [sp.value] : sp.values || [];
    if (want0.length && want0.every((v) => LC.some((c) => same(c, v, sp))) && sp.kind !== "value") return null;
    if (sp.kind === "value" && LC.some((c) => same(c, sp.value, sp))) return null;
    const vs = evalStr(m[3].replace(/^-\s*/, "-")); if (!vs.length) return null;
    const c = { v: vs[0], dec: (/\.(\d+)\s*$/.exec(m[3]) || ["", ""])[1].length, approx: m[2] === "≈" || /\.\d{2,}/.test(m[3]) };
    const want = sp.kind === "value" || sp.kind === "ineq" ? [sp.value] : sp.kind === "set" || sp.kind === "pair" ? sp.values : null;
    if (!want || !want.length) return null;
    return want.some((v) => same(c, v, sp)) ? null : "le corrigé se termine par « " + m[1] + " " + m[2] + " " + m[3].trim() + " » (réponse " + want.map(fmt).join(" ; ") + ")";
  }
  /* 27.11 après-midi (testeur, FR 1re : corrigé « y = 2x + 0 » alors que l'app refuse « 2x+0 », non réduit) : le corrigé
     n'écrit ni « + 0 » / « − 0 » (terme nul), ni « 1x » / « 0x » (coefficient 1 ou 0 écrit devant une lettre). */
  function reduit(T) {
    const m = /(?:^|[^A-Za-z_])((?:\d*[a-z]|[a-z][²³]|[a-z]\^\(?\d+\)?)\s*[+-]\s*0)(?![\d.,'])(?!\s*[·:/^(])/.exec(T) || /(?:^|[^\d.,'A-Za-z_])([01]·?[a-z])(?![A-Za-z(])/.exec(T);
    return m ? m[1] : null;
  }
  const CHECKED = new Set(["value", "set", "pair", "expr", "ineq", "solset"]);
  const kinds = {};
  /* q : question construite (Engine.build ou finalize). Rend [{ key, msg }]. */
  function check(q) {
    const res = [], T = text(q.sol), C = nums(T).concat(closed(T, text(q.q) + " " + (q.parts || []).map((p) => text(p.label)).join(" ")));
    const one = (sp, lab, last) => {
      const k = sp && sp.kind; kinds[k] = (kinds[k] || 0) + 1;
      if (!CHECKED.has(k)) return;
      const p = present(T, sp, C); if (p) res.push({ key: "absente", msg: lab + p });
      if (last) { const e = ending(T, sp); if (e) res.push({ key: "fin", msg: lab + e }); }
    };
    if (q.parts && q.parts.length) q.parts.forEach((p, i) => one(p.spec, "partie " + (i + 1) + " : ", i === q.parts.length - 1));
    else one(q.spec, "", true);
    const nr = reduit(T); if (nr) res.push({ key: "non réduit", msg: "le corrigé écrit « " + nr + " » (l'app refuse une réponse non réduite)" });
    return res;
  }
  /* contre-épreuve : réponse faussée (signe inversé, ou valeur décalée) → doit être déclarée absente. Rend
     [nb de mutations, nb détectées] pour la question (parties comprises). */
  function contre(q) {
    const T = text(q.sol), C = nums(T).concat(closed(T, text(q.q) + " " + (q.parts || []).map((p) => text(p.label)).join(" "))); let n = 0, d = 0;
    const specs = q.parts && q.parts.length ? q.parts.map((p) => p.spec) : [q.spec];
    for (const sp of specs) {
      if (!sp) continue;
      const muts = [];
      if (sp.kind === "value" && Math.abs(sp.value) > 1e-9) muts.push({ ...sp, value: -sp.value }, { ...sp, value: sp.value * 1.5 + 7 });
      if ((sp.kind === "set" || sp.kind === "pair") && sp.values && sp.values.length) { const i = sp.values.findIndex((v) => Math.abs(v) > 1e-9 && !sp.values.some((w) => Math.abs(w + v) < 1e-9)); if (i >= 0) muts.push({ ...sp, values: sp.values.map((v, k) => (k === i ? -v : v)) }); }
      if (sp.kind === "ineq") muts.push({ ...sp, op: FLIP[sp.op] }, { ...sp, value: sp.value + 1 });
      if (sp.kind === "expr" && /x/.test(sp.expr)) muts.push({ ...sp, expr: "(" + sp.expr + ")+1" });
      for (const m of muts) { n++; if (present(T, m, C)) d++; }
    }
    return [n, d];
  }
  return { check, text, nums, kinds, sides, contre, reduit };
})();
/* Classes couvertes : notions du catalogue de chaque classe (Engine.catalog), toutes construites par GEN. */
const CV_PROFILS = [[9, "CH", "9e", {}], [10, "CH", "10e", {}], [11, "CH", "11e", {}], [12, "CH", "1re Collège", { track: "college" }], [13, "CH", "2e Collège", { track: "college" }],
  [14, "CH", "3e Collège MA1", { track: "college" }], [14, "CH", "3e Collège MA2", { track: "college", niv: "R" }], [15, "CH", "4e Collège MA1", { track: "college" }], [15, "CH", "4e Collège MA2", { track: "college", niv: "R" }],
  [12, "CH", "MP 1re", { track: "mp" }], [13, "CH", "MP 2e", { track: "mp" }], [14, "CH", "MP 3e", { track: "mp" }], [15, "CH", "MP 4e", { track: "mp" }],
  [6, "FR", "6e", {}], [7, "FR", "5e", {}], [8, "FR", "4e", {}], [9, "FR", "3e", {}], [10, "FR", "2nde", {}], [11, "FR", "1re", {}], [12, "FR", "Tle", {}]];
function CV_COUV(sys) {
  return CV_PROFILS.filter((p) => p[1] === sys).map(([g, s, lab, o]) => { const ids = Engine.catalog({ system: s, grade: g, minutes: 5, ...o }).map((c) => c.id), miss = ids.filter((id) => !GEN[id]);
    return "  " + lab + " : " + ids.length + " notions" + (miss.length ? " — ÉCHEC hors GEN : " + miss.join(", ") : ""); });
}
/* Exceptions relues : clé « écart|notion-niveau » ou « écart|notion » → raison. Aussi étroites que possible. */
const CV_OK = {};
/* Seuil de la contre-épreuve (part des réponses faussées que le contrôle doit repérer). */
const CV_TAUX = 0.9;
