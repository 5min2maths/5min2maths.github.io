// Chantier 11e · 5. Calcul littéral (15.11) : leçons actives (devine / manipule / retiens) et rappels de cours
// pour litelab, valnum, reduire, monomes, parenth, distrib, idrem, factor. Chargé après active.js et lessons2.js.
// Pas de TeX dans ce qui est redessiné (exposants en caractères ², ³…).
(function () {
  const R2 = {
    litelab: ["Écrire une expression littérale", "Une lettre remplace un nombre qu'on ne connaît pas, ou n'importe quel nombre.",
      "On repère la dernière opération de la phrase : elle donne la forme de l'expression. « Le triple de la somme de x et 5 » se termine par « le triple de » : c'est \\(3(x + 5)\\). « La somme du triple de x et de 5 » se termine par une somme : c'est \\(3x + 5\\). Avec \\(n\\) entier : \\(2n\\) est pair, \\(2n + 1\\) est impair, \\(n\\) et \\(n + 1\\) sont consécutifs.",
      ["Le double de \\(x\\), diminué de 7 : \\(2x - 7\\).", "Le carré de la somme de \\(a\\) et \\(b\\) : \\((a + b)^2\\).", "Périmètre d'un rectangle \\(x\\) sur \\(x + 3\\) : \\(2x + 2(x + 3) = 4x + 6\\)."],
      "Sans parenthèses, la multiplication passe avant l'addition : \\(3x + 5\\) n'est pas \\(3(x + 5)\\)."],
    valnum: ["Calculer la valeur d'une expression", "Remplacer une lettre par un nombre, c'est substituer.",
      "On remplace chaque lettre par sa valeur, entre parenthèses si elle est négative. Puis on respecte les priorités : puissances, puis multiplications et divisions, puis additions et soustractions.",
      ["\\(3x^2 - 2x\\) pour \\(x = -2\\) : \\(3 \\cdot (-2)^2 - 2 \\cdot (-2) = 12 + 4 = 16\\).", "\\(a^2 - 3ab\\) pour \\(a = -1\\), \\(b = 2\\) : \\(1 + 6 = 7\\)."],
      "\\((-2)^2 = 4\\), mais \\(-2^2 = -4\\) : sans parenthèses, le carré ne porte que sur 2."],
    reduire: ["Réduire une expression", "Réduire, c'est regrouper les termes semblables.",
      "Deux termes sont semblables s'ils ont exactement la même partie littérale (mêmes lettres, mêmes exposants). On additionne leurs coefficients. On ordonne ensuite du plus grand exposant au plus petit.",
      ["\\(5x + 3 - 2x + 7 = 3x + 10\\).", "\\(3x^2 - 5x + 2x^2 + 7x = 5x^2 + 2x\\).", "\\(2xy + 3x - xy = xy + 3x\\)."],
      "\\(x\\) et \\(x^2\\) ne sont pas semblables : \\(3x + 2x^2\\) ne se réduit pas, et \\(x^2 + x^2 = 2x^2\\) (pas \\(x^4\\))."],
    monomes: ["Multiplier des monômes", "Un monôme est un produit d'un nombre (le coefficient) et de lettres.",
      "Pour multiplier des monômes, on multiplie les coefficients entre eux, puis les lettres entre elles : pour une même lettre, on additionne les exposants. Une lettre sans exposant a l'exposant 1. Pour une puissance, chaque facteur est élevé à cette puissance.",
      ["\\(3x \\cdot 4x = 12x^2\\).", "\\(2x^3 \\cdot 5x^2 = 10x^5\\).", "\\((-3x^2)^2 = 9x^4\\)."],
      "On additionne les exposants quand on multiplie : \\(x^2 \\cdot x^3 = x^5\\), pas \\(x^6\\)."],
    parenth: ["Supprimer des parenthèses", "Le signe devant une parenthèse décide de ce qui arrive aux termes à l'intérieur.",
      "Précédée de « + », une parenthèse disparaît sans rien changer. Précédée de « − », elle disparaît et chaque terme à l'intérieur change de signe. Avec des crochets, on commence par l'intérieur.",
      ["\\(x + (3 - 2x) = x + 3 - 2x = -x + 3\\).", "\\(x - (3 - 2x) = x - 3 + 2x = 3x - 3\\).", "\\(-(4x - 7 + y) = -4x + 7 - y\\)."],
      "Le « − » change le signe de <b>tous</b> les termes, pas seulement du premier."],
    distrib: ["Développer", "Développer, c'est transformer un produit en somme.",
      "Simple distributivité : \\(k(a + b) = ka + kb\\). Double distributivité : chaque terme de la première parenthèse multiplie chaque terme de la deuxième, \\((a + b)(c + d) = ac + ad + bc + bd\\). On réduit ensuite.",
      ["\\(3(2x - 5) = 6x - 15\\).", "\\((x + 2)(x - 5) = x^2 - 5x + 2x - 10 = x^2 - 3x - 10\\).", "\\(2x(4x^2 + x - 3) = 8x^3 + 2x^2 - 6x\\)."],
      "Dans \\((x + 2)(x - 5)\\), il y a 4 produits : n'oublie pas les produits « croisés »."],
    idrem: ["Identités remarquables", "Trois produits reviennent si souvent qu'on les connaît par cœur.",
      "\\((a + b)^2 = a^2 + 2ab + b^2\\). \\((a - b)^2 = a^2 - 2ab + b^2\\). \\((a + b)(a - b) = a^2 - b^2\\). Le terme du milieu, \\(2ab\\), s'appelle le double produit.",
      ["\\((x + 3)^2 = x^2 + 6x + 9\\).", "\\((2x - 5)^2 = 4x^2 - 20x + 25\\).", "\\((x + 4)(x - 4) = x^2 - 16\\)."],
      "\\((x + 3)^2\\) n'est pas \\(x^2 + 9\\) : il manque le double produit \\(6x\\)."],
    factor: ["Factoriser", "Factoriser, c'est transformer une somme en produit : le contraire de développer.",
      "Mise en évidence : on cherche le facteur commun (nombre, lettre ou parenthèse) et on l'écrit devant, \\(ka + kb = k(a + b)\\). Sinon, on reconnaît une identité : \\(a^2 - b^2 = (a - b)(a + b)\\), \\(a^2 + 2ab + b^2 = (a + b)^2\\). Factoriser au maximum : on continue tant qu'un facteur se factorise encore. On vérifie toujours en développant.",
      ["\\(6x + 9 = 3(2x + 3)\\).", "\\(x^2 - 25 = (x - 5)(x + 5)\\).", "\\(2x^2 - 8 = 2(x^2 - 4) = 2(x - 2)(x + 2)\\)."],
      "Dans \\(3x(2x + 1) - (2x + 1)\\), le deuxième terme vaut \\(-1 \\cdot (2x + 1)\\) : il reste \\(-1\\), donc \\((2x + 1)(3x - 1)\\)."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = (n) => String(n).split("").map((d) => SUP[+d]).join("");
  const nb = (v) => String(+(+v).toFixed(3)).replace(".", ",").replace("-", "−");
  const term = (c, l, first) => { const s = c < 0 ? (first ? "−" : " − ") : first ? "" : " + "; const a = Math.abs(c); return s + (l ? (a === 1 ? "" : a) + l : a); };
  const poly = (ts) => { const f = ts.filter(([c]) => c !== 0); return f.length ? f.map(([c, l], i) => term(c, l, i === 0)).join("") : "0"; };

  Object.assign(ACTIVE, {
    // ---- Écrire une expression : deux machines ----
    litelab: {
      predict: { q: "« Le triple de la somme de x et 5 » s'écrit…", choices: ["3x + 5", "3(x + 5)"], good: 1, why: "La phrase se termine par « le triple de… » : on calcule d'abord la somme x + 5, puis on la triple. Il faut des parenthèses." },
      defis: ["Machine A : « × 3, puis + 5 ». Trouve le nombre qui donne 20.", "Machine B : « + 5, puis × 3 ». Trouve le nombre qui donne 30.", "Essaie trois nombres différents : que vaut toujours B − A ?"],
      play(box, onWin) {
        let n = 2, step = 0; const seen = new Set();
        const draw = () => {
          const A = 3 * n + 5, B = 3 * (n + 5);
          box.innerHTML = actStepper("Nombre choisi", n, "n") + `<div class="act-out">Machine A : 3 · ${nb(n)} + 5 = <b>${nb(A)}</b> &nbsp;·&nbsp; Machine B : 3 · (${nb(n)} + 5) = <b>${nb(B)}</b></div>
            <div class="small muted">A s'écrit 3n + 5 ; B s'écrit 3(n + 5). B − A = ${nb(B - A)}</div>`;
          actBindStepper(box, "n", () => n, (v) => { n = v; seen.add(v); draw(); check(); }, -10, 20);
        };
        const check = () => {
          if (step === 0 && 3 * n + 5 === 20) { onWin(0, "n = 5 : 3 · 5 + 5 = 20."); step = 1; seen.clear(); }
          else if (step === 1 && 3 * (n + 5) === 30) { onWin(1, "n = 5 : 3 · (5 + 5) = 30. Même nombre de départ, résultats différents : l'ordre des opérations compte."); step = 2; seen.clear(); }
          else if (step === 2 && seen.size >= 3) { onWin(2, "B − A vaut toujours 10 : 3(n + 5) − (3n + 5) = 3n + 15 − 3n − 5 = 10. Le calcul littéral le prouve pour tous les nombres."); step = 3; }
        };
        draw();
      },
    },
    // ---- Valeur numérique : curseur ----
    valnum: {
      predict: { q: "Combien vaut x² pour x = −3 ?", choices: ["−9", "9", "−6"], good: 1, why: "(−3)² = (−3) · (−3) = 9 : le carré d'un nombre négatif est positif." },
      defis: ["Trouve un nombre x qui donne 9 pour 2x² − 3x.", "Trouve un nombre négatif x qui donne 14.", "Trouve un nombre x non nul qui donne 0."],
      play(box, onWin) {
        let k = 2, step = 0; const x = () => k / 2;
        const draw = () => {
          const v = 2 * x() * x() - 3 * x();
          box.innerHTML = actStepper("x", nb(x()), "x") + `<div class="act-out">2 · (${nb(x())})² − 3 · (${nb(x())}) = 2 · ${nb(x() * x())} ${-3 * x() < 0 ? "−" : "+"} ${nb(Math.abs(3 * x()))} = <b>${nb(v)}</b></div>`;
          box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { k = Math.max(-8, Math.min(8, k + +b.dataset.d)); draw(); check(); }));
          $hint(box, "Chaque clic change x de 0,5.");
        };
        const check = () => {
          const v = 2 * x() * x() - 3 * x();
          if (step === 0 && v === 9) { onWin(0, "x = " + nb(x()) + " : 2 · " + nb(x() * x()) + " − " + nb(3 * x()).replace("−", "(−") + (x() < 0 ? ")" : "") + " = 9."); step = 1; }
          else if (step === 1 && v === 14 && x() < 0) { onWin(1, "x = −2 : 2 · 4 + 6 = 14. Le carré de −2 est positif, et −3 · (−2) = +6."); step = 2; }
          else if (step === 2 && v === 0 && x() !== 0) { onWin(2, "x = 1,5 : 2 · 2,25 − 4,5 = 0."); step = 3; }
        };
        draw();
      },
    },
    // ---- Réduire : tuiles ----
    reduire: {
      predict: { q: "3x + 2x² se réduit en…", choices: ["5x³", "5x²", "on ne peut pas réduire"], good: 2, why: "x et x² ne sont pas semblables (comme des carrés et des barres de tailles différentes) : on ne peut pas les additionner." },
      defis: ["Compte les tuiles : écris 3x + 5 − x + 2 − 4 sous forme réduite.", "Même chose : 2x² + 3x − x² + x − 6.", "Et : −x² + 4x + 3x² − 7x + 1."],
      play(box, onWin) {
        const E = [[[3, "x"], [5, ""], [-1, "x"], [2, ""], [-4, ""]], [[2, "x²"], [3, "x"], [-1, "x²"], [1, "x"], [-6, ""]], [[-1, "x²"], [4, "x"], [3, "x²"], [-7, "x"], [1, ""]]];
        let step = 0, c2 = 0, c1 = 0, c0 = 0;
        const want = () => { const s = { "x²": 0, x: 0, "": 0 }; E[step].forEach(([c, l]) => (s[l] += c)); return s; };
        const draw = () => {
          if (step >= E.length) return;
          let g = "", x0 = 6;
          E[step].forEach(([c, l]) => { for (let i = 0; i < Math.abs(c); i++) { const w = l === "x²" ? 30 : l === "x" ? 30 : 12, h = l === "x²" ? 30 : 12, y = l === "x²" ? 8 : l === "x" ? 26 : 26; g += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" class="' + (c < 0 ? "f-soft" : "f-fill") + '" stroke="var(--ink)" stroke-width="1"' + (c < 0 ? ' stroke-dasharray="3 2"' : "") + "/>"; x0 += w + 3; } x0 += 8; });
          box.innerHTML = `<div class="act-out">${poly(E[step])}</div>
            <svg class="fig" viewBox="0 0 ${Math.max(320, x0)} 46" role="img" aria-label="tuiles">${g}</svg>
            <div class="small muted">Grand carré = x², barre = x, petit carré = 1 ; en pointillé : à retirer.</div>
            ${actStepper("x²", c2, "c2")}${actStepper("x", c1, "c1")}${actStepper("nombre", c0, "c0")}
            <div class="act-out">Ta réponse : <b>${poly([[c2, "x²"], [c1, "x"], [c0, ""]])}</b></div>`;
          actBindStepper(box, "c2", () => c2, (v) => { c2 = v; draw(); check(); }, -9, 9);
          actBindStepper(box, "c1", () => c1, (v) => { c1 = v; draw(); check(); }, -9, 9);
          actBindStepper(box, "c0", () => c0, (v) => { c0 = v; draw(); check(); }, -9, 9);
        };
        const check = () => {
          const w = want();
          if (c2 === w["x²"] && c1 === w.x && c0 === w[""]) {
            onWin(step, poly(E[step]) + " = " + poly([[c2, "x²"], [c1, "x"], [c0, ""]]) + " : on a regroupé les tuiles de même forme.");
            step++; c2 = c1 = c0 = 0; draw();
          }
        };
        draw();
      },
    },
    // ---- Monômes : empiler les facteurs x ----
    monomes: {
      predict: { q: "x² · x³ = ?", choices: ["x⁶", "x⁵", "2x⁵"], good: 1, why: "x² · x³ = (x · x) · (x · x · x) : cinq facteurs x, donc x⁵. On additionne les exposants." },
      defis: ["Obtiens x⁷ avec xᵐ · xⁿ, où m = 3.", "Obtiens x⁵ avec m = n + 1.", "Obtiens x⁸ avec m = n."],
      play(box, onWin) {
        let m = 2, n = 2, step = 0;
        const draw = () => {
          const xs = (k, cls) => Array.from({ length: k }, () => `<span class="act-prime ${cls}" style="min-width:30px;height:30px">x</span>`).join("");
          box.innerHTML = actStepper("m", m, "m") + actStepper("n", n, "n") + `<div class="act-lamps">${xs(m, "")}<b style="align-self:center">·</b>${xs(n, "")}</div>
            <div class="act-out">x${sup(m)} · x${sup(n)} = x${sup(m + n)} &nbsp;(${m} + ${n} = ${m + n} facteurs x)</div>`;
          actBindStepper(box, "m", () => m, (v) => { m = v; draw(); check(); }, 1, 8);
          actBindStepper(box, "n", () => n, (v) => { n = v; draw(); check(); }, 1, 8);
        };
        const check = () => {
          if (step === 0 && m === 3 && m + n === 7) { onWin(0, "x³ · x⁴ = x⁷ : 3 + 4 = 7."); step = 1; }
          else if (step === 1 && m === n + 1 && m + n === 5) { onWin(1, "x³ · x² = x⁵."); step = 2; }
          else if (step === 2 && m === n && m + n === 8) { onWin(2, "x⁴ · x⁴ = x⁸, c'est aussi (x⁴)²."); step = 3; }
        };
        draw();
      },
    },
    // ---- Parenthèses : retourner les signes ----
    parenth: {
      predict: { q: "x − (3 − 2x) = ?", choices: ["x − 3 − 2x", "x − 3 + 2x"], good: 1, why: "Le « − » devant la parenthèse change le signe de chaque terme : −(3 − 2x) = −3 + 2x." },
      defis: ["Enlève la parenthèse de 7 − (2x − 5 + y) : touche les termes dont le signe change.", "Même chose avec 4x + (3 − x).", "Et avec −(−a + 2b − 6)."],
      play(box, onWin) {
        const E = [{ head: "7 − (", terms: [2, -5, 1], lit: ["x", "", "y"], minus: true }, { head: "4x + (", terms: [3, -1], lit: ["", "x"], minus: false }, { head: "−(", terms: [-1, 2, -6], lit: ["a", "b", ""], minus: true }];
        let step = 0, flip = [];
        const draw = () => {
          if (step >= E.length) return;
          const e = E[step]; if (flip.length !== e.terms.length) flip = e.terms.map(() => false);
          const shown = e.terms.map((c, i) => (flip[i] ? -c : c)), pre = e.head.replace(/[−+]\s*\($/, "").trim();
          box.innerHTML = `<div class="act-out">${e.head}${poly(e.terms.map((c, i) => [c, e.lit[i]]))})</div>
            <div class="small muted">Sans parenthèse : touche un terme pour changer son signe.</div>
            <div class="act-expr">${pre ? `<span class="act-op">${pre}</span>` : ""}${shown.map((c, i) => `<button type="button" class="act-num" data-i="${i}">${term(c, e.lit[i], i === 0 && !pre).trim()}</button>`).join("")}</div>
            <button type="button" class="btn-primary small" id="actok">C'est bon</button>`;
          box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { flip[+b.dataset.i] = !flip[+b.dataset.i]; draw(); }));
          box.querySelector("#actok").onclick = check;
        };
        const check = () => {
          const e = E[step], ok = flip.every((f) => f === e.minus);
          if (ok) { onWin(step, e.minus ? "Précédée de « − », la parenthèse change le signe de <b>tous</b> les termes." : "Précédée de « + », rien ne change : on enlève simplement la parenthèse."); step++; flip = []; draw(); }
          else $hint(box, e.minus ? "Un « − » devant la parenthèse change le signe de chaque terme : vérifie-les tous." : "Un « + » devant la parenthèse ne change aucun signe.");
        };
        draw();
      },
    },
    // ---- Développer : le rectangle découpé ----
    distrib: {
      predict: { q: "3(2x + 5) = ?", choices: ["6x + 5", "6x + 15", "5x + 8"], good: 1, why: "Le 3 multiplie les deux termes : 3 · 2x = 6x et 3 · 5 = 15. Comme l'aire d'un rectangle coupé en deux." },
      defis: ["Règle le rectangle pour obtenir 6x + 15.", "Obtiens 12x + 8 avec une largeur de 4.", "Obtiens 10x + 10."],
      play(box, onWin) {
        let k = 2, a = 1, b = 3, step = 0;
        const draw = () => {
          const W1 = 40 + a * 30, W2 = 12 + b * 10, H = 20 + k * 12, x0 = 30;
          let g = '<rect x="' + x0 + '" y="10" width="' + W1 + '" height="' + H + '" class="f-fill" opacity="0.5" stroke="var(--ink)"/><rect x="' + (x0 + W1) + '" y="10" width="' + W2 + '" height="' + H + '" class="f-soft" stroke="var(--ink)"/>';
          g += '<text x="' + (x0 + W1 / 2) + '" y="' + (16 + H / 2) + '" class="f-txt" text-anchor="middle" font-size="13">' + k * a + 'x</text><text x="' + (x0 + W1 + W2 / 2) + '" y="' + (16 + H / 2) + '" class="f-txt" text-anchor="middle" font-size="13">' + k * b + "</text>";
          g += '<text x="' + (x0 + W1 / 2) + '" y="' + (H + 26) + '" class="f-txt" text-anchor="middle" font-size="12">' + (a === 1 ? "" : a) + 'x</text><text x="' + (x0 + W1 + W2 / 2) + '" y="' + (H + 26) + '" class="f-txt" text-anchor="middle" font-size="12">' + b + '</text><text x="' + (x0 - 8) + '" y="' + (14 + H / 2) + '" class="f-txt" text-anchor="end" font-size="12">' + k + "</text>";
          box.innerHTML = `<svg class="fig" viewBox="0 0 ${Math.max(320, x0 + W1 + W2 + 10)} ${H + 34}" role="img" aria-label="rectangle">${g}</svg>
            ${actStepper("largeur", k, "k")}${actStepper("coefficient de x", a, "a")}${actStepper("nombre", b, "b")}
            <div class="act-out">${k}(${a === 1 ? "" : a}x + ${b}) = <b>${k * a}x + ${k * b}</b></div>`;
          actBindStepper(box, "k", () => k, (v) => { k = v; draw(); check(); }, 1, 6);
          actBindStepper(box, "a", () => a, (v) => { a = v; draw(); check(); }, 1, 5);
          actBindStepper(box, "b", () => b, (v) => { b = v; draw(); check(); }, 1, 9);
        };
        const check = () => {
          if (step === 0 && k * a === 6 && k * b === 15) { onWin(0, k + "(" + (a === 1 ? "" : a) + "x + " + b + ") = 6x + 15 : chaque morceau du rectangle est un produit."); step = 1; }
          else if (step === 1 && k === 4 && k * a === 12 && k * b === 8) { onWin(1, "4(3x + 2) = 12x + 8."); step = 2; }
          else if (step === 2 && k * a === 10 && k * b === 10) { onWin(2, k + "(" + (a === 1 ? "" : a) + "x + " + b + ") = 10x + 10. Il y a plusieurs réponses : 5(2x + 2), 2(5x + 5)…"); step = 3; }
        };
        draw();
      },
    },
    // ---- Identités : le carré (x + a)² ----
    idrem: {
      predict: { q: "(x + 3)² = ?", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(x + 3)² = (x + 3)(x + 3) : 4 morceaux, x², 3x, 3x et 9. Le terme du milieu est le double produit 6x." },
      defis: ["Règle a pour obtenir x² + 10x + 25.", "Trouve a pour que le double produit soit 14x.", "Trouve a pour que le dernier terme soit 36."],
      play(box, onWin) {
        let a = 2, step = 0;
        const draw = () => {
          const X = 90, A = 14 * a, o = 20;
          let g = '<rect x="' + o + '" y="' + o + '" width="' + X + '" height="' + X + '" class="f-fill" opacity="0.55" stroke="var(--ink)"/>';
          g += '<rect x="' + (o + X) + '" y="' + o + '" width="' + A + '" height="' + X + '" class="f-soft" stroke="var(--ink)"/><rect x="' + o + '" y="' + (o + X) + '" width="' + X + '" height="' + A + '" class="f-soft" stroke="var(--ink)"/>';
          g += '<rect x="' + (o + X) + '" y="' + (o + X) + '" width="' + A + '" height="' + A + '" class="f-fill" stroke="var(--ink)"/>';
          g += '<text x="' + (o + X / 2) + '" y="' + (o + X / 2 + 5) + '" class="f-txt" text-anchor="middle" font-size="14">x²</text>';
          g += '<text x="' + (o + X + A / 2) + '" y="' + (o + X / 2 + 5) + '" class="f-txt" text-anchor="middle" font-size="11">' + a + 'x</text><text x="' + (o + X / 2) + '" y="' + (o + X + A / 2 + 4) + '" class="f-txt" text-anchor="middle" font-size="11">' + a + "x</text>";
          g += '<text x="' + (o + X / 2) + '" y="14" class="f-txt" text-anchor="middle" font-size="12">x</text><text x="' + (o + X + A / 2) + '" y="14" class="f-txt" text-anchor="middle" font-size="12">' + a + "</text>";
          box.innerHTML = `<svg class="fig" viewBox="0 0 320 ${o + X + A + 10}" role="img" aria-label="carré de côté x + ${a}">${g}</svg>
            ${actStepper("a", a, "a")}<div class="act-out">(x + ${a})² = x² + ${a}x + ${a}x + ${a * a} = <b>x² + ${2 * a}x + ${a * a}</b></div>`;
          actBindStepper(box, "a", () => a, (v) => { a = v; draw(); check(); }, 1, 9);
        };
        const check = () => {
          if (step === 0 && a === 5) { onWin(0, "(x + 5)² = x² + 10x + 25 : deux rectangles de 5x."); step = 1; }
          else if (step === 1 && a === 7) { onWin(1, "2 · 7 = 14 : le double produit est 2 · x · 7."); step = 2; }
          else if (step === 2 && a === 6) { onWin(2, "6² = 36 : le dernier terme est le carré de a."); step = 3; }
        };
        draw();
      },
    },
    // ---- Factoriser : le rectangle à l'envers ----
    factor: {
      predict: { q: "Factoriser 6x + 9, c'est l'écrire…", choices: ["comme un produit", "comme une somme plus courte"], good: 0, why: "Factoriser = écrire un produit : 6x + 9 = 3(2x + 3). C'est l'inverse de développer." },
      defis: ["Factorise 6x + 9 : choisis la largeur du rectangle.", "Factorise 10x − 15.", "Factorise 12x + 18 au maximum."],
      play(box, onWin) {
        const E = [[6, 9], [10, -15], [12, 18]];
        let k = 2, step = 0;
        const draw = () => {
          if (step >= E.length) return;
          const [p, q] = E[step], okDiv = p % k === 0 && q % k === 0;
          box.innerHTML = `<div class="act-out">Aire : <b>${poly([[p, "x"], [q, ""]])}</b></div>${actStepper("largeur (facteur)", k, "k")}
            <div class="act-out">${okDiv ? `${p}x ${q < 0 ? "−" : "+"} ${Math.abs(q)} = <b>${k}(${poly([[p / k, "x"], [q / k, ""]])})</b>` : `${k} ne divise pas ${p} et ${Math.abs(q)} : pas de rectangle entier.`}</div>
            <button type="button" class="btn-primary small" id="actok">C'est factorisé</button>`;
          actBindStepper(box, "k", () => k, (v) => { k = v; draw(); }, 1, 12);
          box.querySelector("#actok").onclick = check;
        };
        const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
        const check = () => {
          const [p, q] = E[step], G = g(p, q);
          if (p % k || q % k || k === 1) { $hint(box, "Choisis un facteur qui divise les deux nombres (et pas 1)."); return; }
          if (k !== G) { $hint(box, k + "(" + poly([[p / k, "x"], [q / k, ""]]) + ") est factorisé, mais pas au maximum : il reste un facteur commun dans la parenthèse."); return; }
          onWin(step, p + "x " + (q < 0 ? "−" : "+") + " " + Math.abs(q) + " = " + G + "(" + poly([[p / G, "x"], [q / G, ""]]) + ") : " + G + " est le plus grand facteur commun."); step++; k = 2; draw();
        };
        draw();
      },
    },
  });
})();
