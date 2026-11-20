// Chantier 1re Collège (bêta-testeurs) · lot 2 du plan pas à pas (19.11) : une seule source pour racenc, ensembles,
// tradexpr, divcrit, domaine. Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs
// typiques (pièges { spec, m } pour les intervalles), étiquette ctx ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dsum = (n) => String(n).split("").reduce((s, c) => s + +c, 0);
  const lst = (ns) => ns.map((n) => M(n)).join(" ; ");
  const inf = (v) => (v === Infinity ? "+\\infty" : v === -Infinity ? "-\\infty" : String(v));
  // Intervalle(s) en LaTeX : [[a, aFermé, b, bFermé], …]
  const IT = (ivs) => ivs.map(([a, ac, b, bc]) => (ac ? "[" : "]") + inf(a) + " \\,;\\, " + inf(b) + (bc ? "]" : "[")).join(" \\cup ");
  const RM = (vals) => "\\mathbb{R} \\setminus \\{" + vals.join(" \\,;\\, ") + "\\}";
  const sans = (vals) => { const v = [...vals].sort((a, b) => a - b), out = []; let lo = -Infinity; for (const x of v) { out.push([lo, false, x, false]); lo = x; } out.push([lo, false, Infinity, false]); return out; };
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? (b < 0 ? " - " + -b : " + " + b) : "");
  const tri = (b, c) => "x^2" + (b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x" : "") + (c ? (c < 0 ? " - " : " + ") + Math.abs(c) : "");
  // ---------- constructeurs (comme ch1c_sys.js) ----------
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { const c = SolSet.show(tr.spec.ivs, false);
      try { if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status !== "wrong") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({}, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  
  // ===================== tradexpr =====================
  const TE = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), v = 2 * (a + b);
        return QN("Calcule le double de la somme de " + M(a) + " et " + M(b) + ".", v, M("2 \\cdot (" + a + " + " + b + ") = 2 \\cdot " + (a + b) + " = " + v) + " : on calcule d'abord la somme.",
          { ctx: "double-somme", guide: [GS("D'abord la somme de " + M(a) + " et " + M(b) + " ?", a + b, M(a + b) + "."), GS("Son double ?", v, M(v) + ".")], traps: [TR(2 * a + b, "« Le double de la somme » : toute la somme est doublée, il faut des parenthèses.")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9), v = a + b * c;
        return QN("Calcule la somme de " + M(a) + " et du produit de " + M(b) + " par " + M(c) + ".", v, M(a + " + " + b + " \\cdot " + c + " = " + v) + ".",
          { ctx: "somme-produit", guide: [GS("Le produit de " + M(b) + " par " + M(c) + " ?", b * c, M(b * c) + "."), GS("La somme ?", v, M(v) + ".")], traps: [TR((a + b) * c, "C'est une somme dont un terme est un produit : " + a + " + (" + b + " · " + c + ").")] }); },
      () => { const b = R.int(2, 9), a = b + R.int(2, 9), v = 3 * (a - b);
        return QN("Calcule le triple de la différence entre " + M(a) + " et " + M(b) + ".", v, M("3 \\cdot (" + a + " - " + b + ") = " + v) + ".",
          { ctx: "triple-diff", guide: [GS("La différence ?", a - b, M(a - b) + "."), GS("Son triple ?", v, M(v) + ".")], traps: [TR(3 * a - b, "Toute la différence est triplée : parenthèses."), TR(a - 3 * b, "On triple la différence, pas seulement " + b + ".")] }); },
      () => { const c = R.int(3, 9), s = c * R.int(2, 9), a = R.int(1, s - 1), b = s - a; if (b % c === 0) return null;
        return QN("Calcule le quotient de la somme de " + M(a) + " et " + M(b) + " par " + M(c) + ".", s / c, M("(" + a + " + " + b + ") : " + c + " = " + s + " : " + c + " = " + s / c) + ".",
          { ctx: "quotient-somme", guide: [GS("La somme ?", s, M(s) + "."), GS("Divisée par " + M(c) + " ?", s / c, M(s / c) + ".")], traps: [TR(a + b / c, "Toute la somme est divisée : (" + a + " + " + b + ") : " + c + ".")] }); },
    ],
    2: [
      () => { const a = R.int(3, 9), b = R.int(3, 9), e = R.int(2, 6), c = e * R.int(2, 5), v = a * b - c / e;
        return QN("Calcule la différence entre le produit de " + M(a) + " par " + M(b) + " et le quotient de " + M(c) + " par " + M(e) + ".", v, M(a + " \\cdot " + b + " - " + c + " : " + e + " = " + a * b + " - " + c / e + " = " + v) + ".",
          { ctx: "diff-prod-quot", guide: [GS("Le produit ?", a * b, M(a * b) + "."), GS("Le quotient ?", c / e, M(c / e) + "."), GS("La différence ?", v, M(v) + ".")], traps: [TR(c / e - a * b, "« La différence entre A et B » : A − B, dans cet ordre.")] }); },
      () => { const a = 2 * R.int(2, 6), b = R.int(2, 9), c = R.int(2, 9), v = (a * (b + c)) / 2;
        return QN("Calcule la moitié du produit de " + M(a) + " par la somme de " + M(b) + " et " + M(c) + ".", v, M("\\frac{" + a + " \\cdot (" + b + " + " + c + ")}{2} = \\frac{" + a * (b + c) + "}{2} = " + v) + ".",
          { ctx: "moitie-produit", guide: [GS("La somme ?", b + c, M(b + c) + "."), GS("Le produit par " + M(a) + " ?", a * (b + c), M(a * (b + c)) + "."), GS("La moitié ?", v, M(v) + ".")], traps: [TR((a * b + c) / 2, "Le produit porte sur toute la somme : " + a + " · (" + b + " + " + c + ")."), TR(a * (b + c), "N'oublie pas de prendre la moitié.")] }); },
      () => { const a = R.int(2, 7), b = R.int(2, 7), d = R.int(2, 6), c = d + R.int(2, 6), v = (a + b) * (c - d);
        return QN("Calcule le produit de la somme de " + M(a) + " et " + M(b) + " par la différence entre " + M(c) + " et " + M(d) + ".", v, M("(" + a + " + " + b + ") \\cdot (" + c + " - " + d + ") = " + (a + b) + " \\cdot " + (c - d) + " = " + v) + ".",
          { ctx: "prod-somme-diff", guide: [GS("La somme ?", a + b, M(a + b) + "."), GS("La différence ?", c - d, M(c - d) + "."), GS("Le produit ?", v, M(v) + ".")], traps: [TR(a + b * c - d, "Deux groupes : deux paires de parenthèses.")] }); },
      () => { const k = R.int(2, 5), b = R.int(2, 9), x = pk([["le " + ["", "", "double", "triple", "quadruple", "quintuple"][k] + " de la somme de " + M("x") + " et " + M(b), k + "*(x+" + b + ")", k + "*x+" + b, k + " \\cdot (x + " + b + ")"], ["la somme du " + ["", "", "double", "triple", "quadruple", "quintuple"][k] + " de " + M("x") + " et de " + M(b), k + "*x+" + b, k + "*(x+" + b + ")", k + "x + " + b]]);
        return QX("Traduis en expression : " + x[0] + ".", x[1], M(x[3]) + ".",
          { ctx: "litteral", guide: [GX("Écris l'expression", x[1], M(x[3]) + ".")], traps: [TX(x[2], "Regarde le premier mot : il dit quelle opération se fait en dernier.")] }); },
    ],
    3: [
      () => { const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 7), v = (a + b) ** 2 - 3 * c;
        return QN("Calcule le carré de la somme de " + M(a) + " et " + M(b) + ", diminué du triple de " + M(c) + ".", v, M("(" + a + " + " + b + ")^2 - 3 \\cdot " + c + " = " + (a + b) ** 2 + " - " + 3 * c + " = " + v) + ".",
          { ctx: "carre-somme", guide: [GS("Le carré de la somme ?", (a + b) ** 2, M((a + b) ** 2) + "."), GS("Moins le triple de " + M(c) + " ?", v, M(v) + ".")], traps: [TR(a * a + b * b - 3 * c, "Le carré de la somme n'est pas la somme des carrés.")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 9), sum = R.rand() < 0.5, v = sum ? a * a + b * b : (a + b) ** 2;
        return QN("Calcule " + (sum ? "la somme des carrés" : "le carré de la somme") + " de " + M(a) + " et " + M(b) + ".", v, M(sum ? a + "^2 + " + b + "^2 = " + a * a + " + " + b * b + " = " + v : "(" + a + " + " + b + ")^2 = " + (a + b) + "^2 = " + v) + ".",
          { ctx: sum ? "somme-carres" : "carre-somme2", guide: [GS(sum ? "Les deux carrés, additionnés ?" : "D'abord la somme ?", sum ? v : a + b, sum ? M(v) + "." : M(a + b) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(sum ? (a + b) ** 2 : a * a + b * b, sum ? "« La somme des carrés » : on élève chacun au carré, puis on additionne." : "« Le carré de la somme » : on additionne d'abord, puis on élève au carré.")] }); },
      () => { const b = R.int(2, 9), x = pk([["le carré de la différence entre " + M("x") + " et " + M(b), "(x-" + b + ")^2", "x^2-" + b, "(x - " + b + ")^2", "carre-diff"], ["la différence entre le carré de " + M("x") + " et " + M(b), "x^2-" + b, "(x-" + b + ")^2", "x^2 - " + b, "diff-carre"], ["la moitié du carré de " + M("x") + ", diminuée de " + M(b), "x^2/2-" + b, "(x^2-" + b + ")/2", "\\frac{x^2}{2} - " + b, "moitie-carre"]]);
        return QX("Traduis en expression : " + x[0] + ".", x[1], M(x[3]) + ".",
          { ctx: x[4], guide: [GX("Écris l'expression", x[1], M(x[3]) + ".")], traps: [TX(x[2], "Lis la phrase de gauche à droite : le premier mot est la dernière opération faite.")] }); },
    ],
  };

  // ===================== divcrit =====================
  const DC = {
    1: [
      () => { const k = pk([3, 9]); let ns; do ns = [0, 0, 0, 0].map(() => R.int(101, 998)); while (ns.filter((n) => n % k === 0).length !== 1 || new Set(ns).size < 4); const ok = ns.find((n) => n % k === 0);
        return QN("Lequel de ces nombres est divisible par " + M(k) + " ? " + lst(ns), ok, "Somme des chiffres de " + M(ok) + " : " + M(String(ok).split("").join(" + ") + " = " + dsum(ok)) + ", divisible par " + M(k) + ".",
          { ctx: "lequel-" + k, guide: [GS("Somme des chiffres de " + M(ok) + " ?", dsum(ok), M(dsum(ok)) + "."), GS("Le nombre divisible par " + M(k) + " ?", ok, M(ok) + ".")], traps: ns.filter((n) => n !== ok).map((n) => TR(n, "Somme des chiffres de " + n + " : " + dsum(n) + ", pas un multiple de " + k + ".")) }); },
      () => { let n; do n = R.int(1000, 9990); while ([2, 3, 5, 9, 10].filter((d) => n % d === 0).length < 2); const ok = [2, 3, 5, 9, 10].filter((d) => n % d === 0);
        return QN("Par combien des nombres " + lst([2, 3, 5, 9, 10]) + " le nombre " + M(n) + " est-il divisible ?", ok.length, "Divisible par " + ok.join(", ") + " (unités : " + (n % 10) + " ; somme des chiffres : " + dsum(n) + ") : " + M(ok.length) + ".",
          { ctx: "combien-crit", guide: [GS("Somme des chiffres de " + M(n) + " ?", dsum(n), M(dsum(n)) + "."), GS("Nombre de diviseurs de la liste ?", ok.length, ok.join(", ") + ".")], traps: [TR(ok.length + 1, "Pour 3 et 9, c'est la somme des chiffres qui compte."), TR(ok.length - 1, "Vérifie chaque critère : 2 (pair), 3, 5, 9, 10.")] }); },
      () => { let a, c; do { a = R.int(1, 9); c = R.int(0, 9); } while ((a + c) % 3 === 0); const x = (3 - ((a + c) % 3)) % 3;
        return QN("Quel est le plus petit chiffre à écrire à la place de ■ pour que " + M(a + "\\,■\\," + c) + " soit divisible par " + M(3) + " ?", x, "Somme " + M(a + " + " + c + " + ■") + " multiple de 3 : le plus petit chiffre est " + M(x) + " (" + M(a + c + x) + ").",
          { ctx: "chiffre-3", guide: [GS("Somme des chiffres connus ?", a + c, M(a + c) + "."), GS("Plus petit chiffre ■ ?", x, M(x) + ".")], traps: [TR(x + 3, "Ça marche aussi, mais on demande le plus petit."), TR((3 - (c % 3)) % 3, "C'est la somme de TOUS les chiffres qui doit être un multiple de 3.")] }); },
      () => { let a, c; do { a = R.int(1, 9); c = R.int(0, 9); } while ((a + c) % 9 === 0); const x = 9 - ((a + c) % 9);
        return QN("Quel chiffre faut-il écrire à la place de ■ pour que " + M(a + "\\,■\\," + c) + " soit divisible par " + M(9) + " ?", x, "La somme des chiffres doit être un multiple de 9 : " + M(a + " + " + c + " + " + x + " = " + (a + c + x)) + ".",
          { ctx: "chiffre-9", guide: [GS("Somme des chiffres connus ?", a + c, M(a + c) + "."), GS("Chiffre ■ ?", x, M(x) + ".")], traps: [TR(x > 3 ? x - 3 : x + 3, "Pour 9, il faut un multiple de 9 (pas seulement de 3).")] }); },
    ],
    2: [
      () => { const [k, txt, why] = pk([[6, "à la fois par 2 et par 3", "pair et somme des chiffres multiple de 3"], [15, "à la fois par 3 et par 5", "finit par 0 ou 5 et somme multiple de 3"], [4, "par 4", "le nombre formé par les deux derniers chiffres est divisible par 4"], [25, "par 25", "finit par 00, 25, 50 ou 75"]]); let ns; do ns = [0, 0, 0, 0, 0].map(() => (R.rand() < 0.5 ? k * R.int(26, 249) : R.int(101, 998))); while (new Set(ns).size < 5 || ns.filter((n) => n % k === 0).length < 1 || ns.filter((n) => n % k === 0).length > 3); const ok = ns.filter((n) => n % k === 0);
        return QN("Combien de ces nombres sont divisibles " + txt + " ? " + lst(ns), ok.length, "Critère : " + why + ". Conviennent : " + ok.join(", ") + ".",
          { ctx: "compte-" + k, guide: [GS("Critère : " + why + ". Combien ?", ok.length, ok.join(", ") + ".")], traps: [TR(ns.filter((n) => n % (k === 6 ? 2 : k === 15 ? 5 : k === 4 ? 2 : 5) === 0).length, k === 4 ? "Pair ne suffit pas : regarde les deux derniers chiffres." : k === 25 ? "Finir par 5 ne suffit pas." : "Il faut les deux critères à la fois.")] }); },
      () => { const a = R.int(1, 9), b = R.int(0, 9), cand = [0, 2, 4, 6, 8].filter((x) => (a + b + x) % 3 === 0); if (!cand.length) return null; const x = cand[0];
        return QN("Quel est le plus petit chiffre ■ pour que " + M(a + "\\," + b + "\\,■") + " soit divisible par " + M(6) + " ?", x, "Divisible par 6 = pair ET divisible par 3 : ■ pair et " + M(a + " + " + b + " + ■") + " multiple de 3 → " + M(x) + ".",
          { ctx: "chiffre-6", guide: [GS("Somme des deux premiers chiffres ?", a + b, M(a + b) + "."), GS("Plus petit chiffre pair qui rend la somme multiple de 3 ?", x, M(x) + ".")], traps: [TR((3 - ((a + b) % 3)) % 3, "Divisible par 6 : le nombre doit aussi être pair.")] }); },
      () => { const [k, txt] = pk([[30, "par 2, par 3 et par 5"], [18, "par 2 et par 9"], [45, "par 5 et par 9"], [12, "par 3 et par 4"]]), L = R.int(130, 870), v = Math.floor(L / k) * k + k;
        return QN("Quel est le plus petit nombre strictement supérieur à " + M(L) + " divisible " + txt + " ?", v, "Divisible " + txt + " = divisible par " + M(k) + " : " + M(v) + ".",
          { ctx: "plus-petit-" + k, guide: [GS("Divisible " + txt + " revient à divisible par… ?", k, M(k) + "."), GS("Premier multiple de " + M(k) + " après " + M(L) + " ?", v, M(v) + ".")], traps: [TR(v - k, "Strictement supérieur à " + L + "."), TR(Math.floor(L / 6) * 6 + 6, "Vérifie tous les critères.")] }); },
    ],
    3: [
      () => { const a = R.int(1, 9), b = R.int(0, 9), k = pk([3, 9]), c = [...Array(10).keys()].filter((x) => (a + b + x) % k === 0).length;
        return QN("Combien de chiffres ■ (de 0 à 9) rendent " + M(a + "\\,■\\," + b) + " divisible par " + M(k) + " ?", c, "La somme " + M(a + " + " + b + " + ■") + " doit être un multiple de " + k + " : ■ ∈ {" + [...Array(10).keys()].filter((x) => (a + b + x) % k === 0).join(" ; ") + "}, soit " + M(c) + ".",
          { ctx: "combien-chiffres-" + k, guide: [GS("Plus petit ■ qui convient ?", [...Array(10).keys()].find((x) => (a + b + x) % k === 0), "On ajoute ensuite " + k + " à chaque fois."), GS("Nombre de chiffres ?", c, M(c) + ".")], traps: [TR(1, "Plusieurs chiffres conviennent : on peut ajouter " + k + " à ■ tant qu'on reste ≤ 9.")] }); },
      () => { const a = R.int(1, 9), b = R.int(0, 9), cand = [...Array(10).keys()].filter((x) => (a * 100 + b * 10 + x) % 12 === 0); if (!cand.length) return null; const x = cand[0];
        return QN("Quel est le plus petit chiffre ■ pour que " + M(a + "\\," + b + "\\,■") + " soit divisible par " + M(12) + " ?", x, "Divisible par 12 = par 3 et par 4 : " + M(b + "■") + " divisible par 4 et somme des chiffres multiple de 3 → " + M(a * 100 + b * 10 + x) + ".",
          { ctx: "chiffre-12", guide: [GS("12 = 3 · 4. Plus petit ■ qui marche ?", x, M(a * 100 + b * 10 + x) + " = " + M("12 \\cdot " + (a * 100 + b * 10 + x) / 12) + ".")], traps: [TR([...Array(10).keys()].find((y) => (a + b + y) % 3 === 0 && y % 2 === 0 && y !== x), "Pair ne suffit pas pour 4 : les deux derniers chiffres doivent former un multiple de 4.")] }); },
      () => { const k = pk([6, 15, 18]), lo = R.int(100, 400), hi = lo + R.int(40, 90), c = Math.floor(hi / k) - Math.floor((lo - 1) / k);
        return QN("Combien de nombres entre " + M(lo) + " et " + M(hi) + " (compris) sont divisibles à la fois par " + (k === 6 ? M(2) + " et " + M(3) : k === 15 ? M(3) + " et " + M(5) : M(2) + " et " + M(9)) + " ?", c, "Ce sont les multiples de " + M(k) + " : de " + M(Math.ceil(lo / k) * k) + " à " + M(Math.floor(hi / k) * k) + ", soit " + M(c) + ".",
          { ctx: "compte-intervalle-" + k, guide: [GS("Divisible par les deux revient à divisible par… ?", k, M(k) + "."), GS("Premier multiple de " + M(k) + " ≥ " + M(lo) + " ?", Math.ceil(lo / k) * k, M(Math.ceil(lo / k) * k) + "."), GS("Combien de multiples jusqu'à " + M(hi) + " ?", c, M(c) + ".")], traps: [TR(c + 1, "Compte bien : du premier au dernier multiple, pas à pas de " + k + "."), TR(Math.floor((hi - lo) / k), "Compte les multiples réellement présents (le premier n'est pas forcément " + lo + ").")] }); },
    ],
  };

  // ===================== racenc =====================
  const RC = {
    1: [
      () => { const n = R.int(5, 150), f = Math.floor(Math.sqrt(n)); if (f * f === n) return null; const lo = R.rand() < 0.5;
        return QN("Le nombre " + M("\\sqrt{" + n + "}") + " est compris entre deux entiers consécutifs. Quel est le plus " + (lo ? "petit" : "grand") + " des deux ?", lo ? f : f + 1, M(f * f + " < " + n + " < " + (f + 1) ** 2) + ", donc " + M(f + " < \\sqrt{" + n + "} < " + (f + 1)) + ".",
          { ctx: lo ? "encadre-bas" : "encadre-haut", guide: [GS("Plus grand carré parfait inférieur à " + M(n) + " ?", f * f, M(f * f + " = " + f + "^2") + "."), GS("Donc l'entier cherché ?", lo ? f : f + 1, M(f + " < \\sqrt{" + n + "} < " + (f + 1)) + ".")], traps: [TR(Math.round(n / 2), "La racine n'est pas la moitié."), TR(lo ? f + 1 : f, lo ? "On demande le plus petit des deux." : "On demande le plus grand des deux.")] }); },
      () => { const k = R.int(4, 12), d = pk([1, 2, -1, -2]), n = k * k + d; const near = k;
        return QN("Quel est l'entier le plus proche de " + M("\\sqrt{" + n + "}") + " ?", near, M(n) + " est tout près de " + M(k * k + " = " + k + "^2") + " : " + M("\\sqrt{" + n + "} \\approx " + k) + ".",
          { ctx: "proche", guide: [GS("Carré parfait le plus proche de " + M(n) + " ?", k * k, M(k * k) + "."), GS("Entier le plus proche ?", k, M(k) + ".")], traps: [TR(d > 0 ? k + 1 : k - 1, M(n) + " est bien plus proche de " + k * k + " que de " + (d > 0 ? (k + 1) ** 2 : (k - 1) ** 2) + "."), TR(Math.round(n / 2), "La racine n'est pas la moitié.")] }); },
      () => { const k = R.int(3, 12), n = k * k + pk([-3, -2, -1, 1, 2, 3]), big = R.rand() < 0.5, rb = n > k * k;
        return QN("Quel est le plus " + (big ? "grand" : "petit") + " de ces deux nombres : " + M(k) + " ou " + M("\\sqrt{" + n + "}") + " ?", rb === big ? Math.sqrt(n) : k, M(k + " = \\sqrt{" + k * k + "}") + " et " + M(k * k + (rb ? " < " : " > ") + n) + ", donc " + M(k + (rb ? " < " : " > ") + "\\sqrt{" + n + "}") + ".",
          { ctx: "comparer", guide: [GS(M(k + "^2") + " = ?", k * k, M(k * k) + "."), GS("Le plus " + (big ? "grand" : "petit") + " ?", rb === big ? Math.sqrt(n) : k, rb === big ? M("\\sqrt{" + n + "}") + "." : M(k) + ".")], traps: [TR(rb === big ? k : Math.sqrt(n), "Compare les carrés : " + k * k + " et " + n + ".")] }); },
    ],
    2: [
      () => { const n = R.int(5, 12), k = n * n + R.int(1, 2 * n), mid = Math.sqrt(k);
        return QN("On range " + M("\\sqrt{" + k + "}") + ", " + M(n) + " et " + M(n + 1) + " dans l'ordre croissant. Lequel est au milieu ?", mid, M(n * n + " < " + k + " < " + (n + 1) ** 2) + ", donc " + M(n + " < \\sqrt{" + k + "} < " + (n + 1)) + ".",
          { ctx: "ranger", guide: [GS(M(n + "^2") + " = ?", n * n, M(n * n) + "."), GS(M((n + 1) + "^2") + " = ?", (n + 1) ** 2, M((n + 1) ** 2) + "."), GS("Au milieu ?", mid, M("\\sqrt{" + k + "}") + ".")], traps: [TR(n, M(n) + " est plus petit que " + M("\\sqrt{" + k + "}") + "."), TR(n + 1, M(n + 1) + " est plus grand.")] }); },
      () => { const n = pk([2, 3, 5, 6, 7, 10, 11, 13]), v = Math.floor(Math.sqrt(n) * 10) / 10; if (Math.abs(Math.sqrt(n) * 10 - Math.round(Math.sqrt(n) * 10)) < 0.05) return null;
        return QN("Encadre " + M("\\sqrt{" + n + "}") + " au dixième : quel est le nombre " + M("a") + " (à un chiffre après la virgule) tel que " + M("a < \\sqrt{" + n + "} < a + 0{,}1") + " ?", v,
          M(String(v).replace(".", "{,}") + "^2 = " + String(+(v * v).toFixed(2)).replace(".", "{,}") + " < " + n + " < " + String(+((v + 0.1) ** 2).toFixed(2)).replace(".", "{,}") + " = " + String(+(v + 0.1).toFixed(1)).replace(".", "{,}") + "^2") + ".",
          { ctx: "dixieme", guide: [GS("Entier juste en dessous de " + M("\\sqrt{" + n + "}") + " ?", Math.floor(Math.sqrt(n)), M(Math.floor(Math.sqrt(n))) + "."), GS("Essaie les carrés de " + M(Math.floor(Math.sqrt(n)) + "{,}1") + ", " + M(Math.floor(Math.sqrt(n)) + "{,}2") + "… Valeur de " + M("a") + " ?", v, M(String(v).replace(".", "{,}")) + ".")], traps: [TR(+(v + 0.1).toFixed(1), "C'est la borne du dessus (son carré dépasse " + n + ")."), TR(n / 2, "La racine n'est pas la moitié.")] }); },
      () => { const a = pk([2, 3, 5]), b = pk([2, 3, 5, 6, 7]), A = a * a * b, d = pk([-1, 1, 2, -2]), C = A + d; if (C <= 0) return null; const big = A > C;
        return QN("Quel est le plus grand : " + M(a + "\\sqrt{" + b + "}") + " ou " + M("\\sqrt{" + C + "}") + " ?", big ? a * Math.sqrt(b) : Math.sqrt(C), M(a + "\\sqrt{" + b + "} = \\sqrt{" + a * a + " \\cdot " + b + "} = \\sqrt{" + A + "}") + ", et " + M(A + (big ? " > " : " < ") + C) + ".",
          { ctx: "comparer-coef", guide: [GS("Écris " + M(a + "\\sqrt{" + b + "}") + " sous la forme " + M("\\sqrt{n}") + " : " + M("n") + " = ?", A, M(a + "^2 \\cdot " + b + " = " + A) + "."), GS("Le plus grand ?", big ? a * Math.sqrt(b) : Math.sqrt(C), big ? M(a + "\\sqrt{" + b + "}") + "." : M("\\sqrt{" + C + "}") + ".")], traps: [TR(big ? Math.sqrt(C) : a * Math.sqrt(b), M(a + "\\sqrt{" + b + "}") + " vaut " + M("\\sqrt{" + A + "}") + " (on élève " + a + " au carré pour le rentrer).")] }); },
    ],
    3: [
      () => { const a = R.int(3, 12);
        return QN("Combien y a-t-il de nombres entiers " + M("n") + " tels que " + M(a + " < \\sqrt{n} < " + (a + 1)) + " ?", 2 * a, "Il faut " + M(a * a + " < n < " + (a + 1) ** 2) + " : de " + M(a * a + 1) + " à " + M((a + 1) ** 2 - 1) + ", soit " + M(2 * a) + " entiers.",
          { ctx: "compte-n", guide: [GS("Borne du bas (" + M(a + "^2") + ") ?", a * a, M(a * a) + "."), GS("Borne du haut (" + M((a + 1) + "^2") + ") ?", (a + 1) ** 2, M((a + 1) ** 2) + "."), GS("Entiers strictement entre les deux ?", 2 * a, M((a + 1) ** 2 + " - " + a * a + " - 1 = " + 2 * a) + ".")], traps: [TR(2 * a + 1, "Les bornes sont exclues (inégalités strictes)."), TR(1, "Il y a beaucoup d'entiers entre " + a * a + " et " + (a + 1) ** 2 + ".")] }); },
      () => { const p = R.int(10, 40), q = p + R.int(40, 90), lo = Math.ceil(Math.sqrt(p) + 1e-9), hi = Math.floor(Math.sqrt(q) - 1e-9), c = hi - lo + 1; if (Number.isInteger(Math.sqrt(p)) || Number.isInteger(Math.sqrt(q)) || c < 2) return null;
        return QN("Combien de nombres entiers sont compris entre " + M("\\sqrt{" + p + "}") + " et " + M("\\sqrt{" + q + "}") + " ?", c, M(lo - 1 + " < \\sqrt{" + p + "} < " + lo) + " et " + M(hi + " < \\sqrt{" + q + "} < " + (hi + 1)) + " : les entiers de " + M(lo) + " à " + M(hi) + ", soit " + M(c) + ".",
          { ctx: "entre-racines", guide: [GS("Premier entier après " + M("\\sqrt{" + p + "}") + " ?", lo, M(lo) + " (" + M(lo + "^2 = " + lo * lo) + ")."), GS("Dernier entier avant " + M("\\sqrt{" + q + "}") + " ?", hi, M(hi) + "."), GS("Combien ?", c, M(c) + ".")], traps: [TR(q - p - 1, "On compte les entiers entre les racines, pas entre " + p + " et " + q + "."), TR(c + 1, "Compte de " + lo + " à " + hi + " inclus.")] }); },
      () => { const k = R.int(4, 12), v = Math.ceil((k + 0.5) ** 2) - 1;
        return QN("Quel est le plus grand entier " + M("n") + " tel que " + M("\\sqrt{n} < " + k + "{,}5") + " ?", v, M("\\sqrt{n} < " + k + "{,}5 \\iff n < " + k + "{,}5^2 = " + String((k + 0.5) ** 2).replace(".", "{,}")) + " : " + M("n = " + v) + ".",
          { ctx: "plus-grand-n", guide: [GS(M(k + "{,}5^2") + " = ?", (k + 0.5) ** 2, M(String((k + 0.5) ** 2).replace(".", "{,}")) + "."), GS("Plus grand entier en dessous ?", v, M(v) + ".")], traps: [TR(k * k, "C'est pour √n < " + k + " ; ici la borne est " + k + ",5."), TR(2 * k + 1, "On élève au carré, on ne double pas.")] }); },
    ],
  };

  // ===================== ensembles =====================
  const EN = {
    1: [
      () => { const a = R.int(-9, -1), b = R.int(1, 9);
        return QN("Combien de nombres entiers l'intervalle " + M("[" + a + " \\,;\\, " + b + "]") + " contient-il ?", b - a + 1, "De " + M(a) + " à " + M(b) + ", bornes comprises : " + M(b + " - (" + a + ") + 1 = " + (b - a + 1)) + ".",
          { ctx: "compte-ferme", guide: [GS("Combien d'entiers de " + M(a) + " à " + M(-1) + " ?", -a, M(-a) + "."), GS("En comptant " + M(0) + " et les positifs jusqu'à " + M(b) + ", total ?", b - a + 1, M(b - a + 1) + ".")], traps: [TR(b - a, "Bornes comprises : n'oublie pas de compter les deux bouts (et 0)."), TR(b + a, "On compte de " + a + " à " + b + " : " + b + " − (" + a + ") + 1.")] }); },
      () => { const a = R.int(-9, -1), b = R.int(1, 9), t = R.int(0, 2), I = [["]", "]", b - a], ["[", "[", b - a], ["]", "[", b - a - 1]][t];
        return QN("Combien de nombres entiers l'intervalle " + M(I[0] + a + " \\,;\\, " + b + I[1]) + " contient-il ?", I[2], (t === 0 ? "La borne " + M(a) + " est exclue" : t === 1 ? "La borne " + M(b) + " est exclue" : "Les deux bornes sont exclues") + " : " + M(I[2]) + " entiers.",
          { ctx: "compte-ouvert", guide: [GS("Combien d'entiers si les deux bornes étaient comprises ?", b - a + 1, M(b - a + 1) + "."), GS("Moins les bornes exclues ?", I[2], M(I[2]) + ".")], traps: [TR(b - a + 1, "Crochet tourné vers l'extérieur : la borne est exclue.")] }); },
      () => { const a = R.int(-8, 3), b = a + R.int(2, 9), t = R.int(0, 3), w = [["\\le", "<", true, false], ["<", "\\le", false, true], ["\\le", "\\le", true, true], ["<", "<", false, false]][t];
        return QS("Écris sous forme d'intervalle l'ensemble des " + M("x") + " tels que " + M(a + " " + w[0] + " x " + w[1] + " " + b) + ".", [[a, w[2], b, w[3]]], M(IT([[a, w[2], b, w[3]]])) + " : crochet tourné vers le nombre s'il est compris.",
          { ctx: "ecrire-int", guide: [GSS("Intervalle ?", [[a, w[2], b, w[3]]], M(IT([[a, w[2], b, w[3]]])) + ".")], traps: [TS([[a, !w[2], b, !w[3]]], "« ≤ » : borne comprise, crochet tourné vers le nombre ; « < » : crochet tourné vers l'extérieur.")] }); },
      () => { const a = R.int(-9, 5), b = a + R.int(3, 9), lo = R.rand() < 0.5;
        return QN("Quel est le plus " + (lo ? "petit" : "grand") + " entier de l'intervalle " + M(lo ? "]" + a + " \\,;\\, " + b + "]" : "[" + a + " \\,;\\, " + b + "[") + " ?", lo ? a + 1 : b - 1, (lo ? M(a) + " est exclu : le plus petit entier est " + M(a + 1) : M(b) + " est exclu : le plus grand entier est " + M(b - 1)) + ".",
          { ctx: lo ? "plus-petit-entier" : "plus-grand-entier", guide: [GS("Réponse ?", lo ? a + 1 : b - 1, M(lo ? a + 1 : b - 1) + ".")], traps: [TR(lo ? a : b, "Le crochet est tourné vers l'extérieur : cette borne est exclue.")] }); },
    ],
    2: [
      () => { const a = R.int(-9, -3), c = a + R.int(2, 4), b = c + R.int(2, 6), d = b + R.int(2, 5);
        return QN("Combien de nombres entiers appartiennent à la fois à " + M("[" + a + " \\,;\\, " + b + "]") + " et à " + M("]" + c + " \\,;\\, " + d + "[") + " ?", b - c, "L'intersection est " + M("]" + c + " \\,;\\, " + b + "]") + " : de " + M(c + 1) + " à " + M(b) + ", soit " + M(b - c) + " entiers.",
          { ctx: "inter-compte", guide: [GSS("Intersection ?", [[c, false, b, true]], M("]" + c + " \\,;\\, " + b + "]") + "."), GS("Nombre d'entiers ?", b - c, M(b - c) + ".")], traps: [TR(b - c + 1, M(c) + " est exclu (crochet ouvert)."), TR(d - a, "Ça, c'est la réunion ; on veut les nombres communs.")] }); },
      () => { const a = R.int(-9, -2), c = a + R.int(1, 4), b = c + R.int(2, 6), d = b + R.int(1, 5), ac = R.rand() < 0.5, bc = R.rand() < 0.5, cc = R.rand() < 0.5, dc = R.rand() < 0.5, A = [a, ac, b, bc], B = [c, cc, d, dc];
        return QS("Écris " + M(IT([A]) + " \\cap " + IT([B])) + " sous forme d'intervalle.", [[c, cc, b, bc]], "Partie commune : de " + M(c) + " (borne de la 2e) à " + M(b) + " (borne de la 1re) : " + M(IT([[c, cc, b, bc]])) + ".",
          { ctx: "inter", guide: [GSS("Intersection ?", [[c, cc, b, bc]], M(IT([[c, cc, b, bc]])) + ".")], traps: [TS([[a, ac, d, dc]], "« ∩ » : les nombres communs aux deux (pas la réunion)."), TS([[a, ac, c, cc]], "Regarde où les deux intervalles se chevauchent.")] }); },
      () => { const a = R.int(-9, -2), c = a + R.int(1, 4), b = c + R.int(2, 6), d = b + R.int(1, 5);
        return QS("Écris " + M("[" + a + " \\,;\\, " + b + "] \\cup [" + c + " \\,;\\, " + d + "[") + " sous forme d'un seul intervalle.", [[a, true, d, false]], "Les deux intervalles se chevauchent : la réunion va de " + M(a) + " à " + M(d) + " : " + M("[" + a + " \\,;\\, " + d + "[") + ".",
          { ctx: "union", guide: [GSS("Réunion ?", [[a, true, d, false]], M("[" + a + " \\,;\\, " + d + "[") + ".")], traps: [TS([[c, true, b, true]], "Ça, c'est l'intersection ; « ∪ » réunit tout.")] }); },
      () => { const a = R.int(-9, 9), cl = R.rand() < 0.5, right = R.rand() < 0.5, I = right ? [a, cl, Infinity, false] : [-Infinity, false, a, cl], C = right ? [-Infinity, false, a, !cl] : [a, !cl, Infinity, false];
        return QS("Écris le complémentaire de " + M(IT([I])) + " dans " + M("\\mathbb{R}") + " (tous les réels qui n'y sont pas).", [C], "Tout le reste de la droite : " + M(IT([C])) + " ; la borne change de camp.",
          { ctx: "complement", guide: [GSS("Complémentaire ?", [C], M(IT([C])) + ".")], traps: [TS([right ? [-Infinity, false, a, cl] : [a, cl, Infinity, false]], "La borne " + a + " est déjà dans l'intervalle de départ : elle n'est pas dans le complémentaire (ou l'inverse).")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, 4]), b = R.int(-5, 5), lo = R.int(-6, 0), hi = lo + R.int(2, 6), L = a * lo + b, H = a * hi + b;
        return QS("Écris sous forme d'intervalle l'ensemble des " + M("x") + " tels que " + M(L + " < " + lin(a, b) + " \\le " + H) + ".", [[lo, false, hi, true]], M(L + (b ? (b > 0 ? " - " + b : " + " + -b) : "") + " < " + a + "x \\le " + H + (b ? (b > 0 ? " - " + b : " + " + -b) : "")) + ", puis on divise par " + M(a) + " : " + M(IT([[lo, false, hi, true]])) + ".",
          { ctx: "double-ineq", guide: [GS("Après avoir " + (b > 0 ? "soustrait " + b : b < 0 ? "ajouté " + -b : "rien fait") + ", borne de gauche pour " + M(a + "x") + " ?", L - b, M(L - b) + "."), GSS("Intervalle pour " + M("x") + " ?", [[lo, false, hi, true]], M(IT([[lo, false, hi, true]])) + ".")], traps: [TS([[L, false, H, true]], "Il faut isoler x : enlève " + b + " puis divise par " + a + "."), TS([[lo, true, hi, false]], "Garde les mêmes symboles : < à gauche (exclu), ≤ à droite (compris).")] }); },
      () => { const c = R.int(-6, 6), r = R.int(1, 6), le = R.rand() < 0.5;
        return QS("Écris sous forme d'intervalle l'ensemble des " + M("x") + " dont la distance à " + M(c) + " est " + (le ? "au plus" : "strictement inférieure à") + " " + M(r) + " (" + M("|" + xm(c) + "| " + (le ? "\\le" : "<") + " " + r) + ").", [[c - r, le, c + r, le]], "De " + M(c + " - " + r) + " à " + M(c + " + " + r) + " : " + M(IT([[c - r, le, c + r, le]])) + ".",
          { ctx: "distance", guide: [GS("Borne de gauche (" + M(c + " - " + r) + ") ?", c - r, M(c - r) + "."), GSS("Intervalle ?", [[c - r, le, c + r, le]], M(IT([[c - r, le, c + r, le]])) + ".")], traps: [TS([[-r, le, r, le]], "L'intervalle est centré en " + c + ", pas en 0."), TS([[c - r, !le, c + r, !le]], le ? "« Au plus » : bornes comprises." : "« Strictement » : bornes exclues.")] }); },
      () => { const b = R.int(-3, 8), c = b - R.int(3, 9), bc = R.rand() < 0.5, cc = R.rand() < 0.5, n = b - c + 1 - (bc ? 0 : 1) - (cc ? 0 : 1);
        return QN("Combien de nombres entiers appartiennent à " + M("]-\\infty \\,;\\, " + b + (bc ? "]" : "[") + " \\cap " + (cc ? "[" : "]") + c + " \\,;\\, +\\infty[") + " ?", n, "L'intersection est " + M((cc ? "[" : "]") + c + " \\,;\\, " + b + (bc ? "]" : "[")) + " : " + M(n) + " entiers.",
          { ctx: "inter-infini", guide: [GSS("Intersection ?", [[c, cc, b, bc]], M((cc ? "[" : "]") + c + " \\,;\\, " + b + (bc ? "]" : "[")) + "."), GS("Nombre d'entiers ?", n, M(n) + ".")], traps: [TR(b - c + 1, "Vérifie si chaque borne est comprise ou exclue.")] }); },
    ],
  };

  // ===================== domaine =====================
  const DO = {
    1: [
      () => { const r = nz(-7, 7), k = nz(-9, 9);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{" + k + "}{" + xm(r) + "}") + ".", sans([r]), "On ne divise pas par 0 : " + M(xm(r) + " = 0 \\iff x = " + r) + ", donc " + M("D = " + RM([r])) + ".",
          { ctx: "frac", guide: [GS("Valeur interdite (le dénominateur s'annule) ?", r, M(xm(r) + " = 0 \\iff x = " + r) + "."), GSS("Domaine ?", sans([r]), M(RM([r])) + ".")], traps: [TS(sans([-r]), "Résous " + xm(r) + " = 0 : attention au signe.")] }); },
      () => { const r = nz(-7, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + xm(r) + "}") + ".", [[r, true, Infinity, false]], "Sous une racine, il faut " + M(xm(r) + " \\ge 0") + " : " + M("D = [" + r + " \\,;\\, +\\infty[") + ".",
          { ctx: "racine", guide: [GS("Valeur où " + M(xm(r)) + " s'annule ?", r, M(r) + "."), GSS("Domaine (sous la racine ≥ 0) ?", [[r, true, Infinity, false]], M("[" + r + " \\,;\\, +\\infty[") + ".")], traps: [TS([[r, false, Infinity, false]], "√0 = 0 existe : la borne est comprise."), TS([[-Infinity, false, r, true]], "Il faut " + xm(r) + " ≥ 0, donc x ≥ " + r + "."), TS(sans([r]), "Pour une racine, on exige un nombre positif ou nul, pas seulement ≠ 0.")] }); },
      () => { const a = pk([2, 3, 4, 5]), z = nz(-5, 5), b = -a * z, k = nz(-9, 9);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{" + k + "}{" + lin(a, b) + "}") + ".", sans([z]), M(lin(a, b) + " = 0 \\iff x = " + z) + " : " + M("D = " + RM([z])) + ".",
          { ctx: "frac-lin", guide: [GS("Valeur interdite ?", z, M(a + "x = " + -b + " \\iff x = " + z) + "."), GSS("Domaine ?", sans([z]), M(RM([z])) + ".")], traps: [TS(sans([-b]), "Il faut diviser par " + a + " : " + a + "x = " + -b + "."), TS(sans([-z]), "Attention au signe.")] }); },
    ],
    2: [
      () => { const k = R.int(1, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{x}{x^2 - " + k * k + "}") + ".", sans([-k, k]), M("x^2 - " + k * k + " = 0 \\iff x = \\pm " + k) + " : " + M("D = " + RM([-k, k])) + ".",
          { ctx: "frac-carre", guide: [GS("Valeur interdite positive ?", k, M("x^2 = " + k * k + " \\iff x = \\pm " + k) + "."), GSS("Domaine ?", sans([-k, k]), M(RM([-k, k])) + ".")], traps: [TS(sans([k]), "x² = " + k * k + " a deux solutions : " + k + " et −" + k + "."), TS(sans([k * k]), "On cherche x tel que x² = " + k * k + ".")] }); },
      () => { const a = -R.int(2, 5), z = nz(-4, 4), b = -a * z;
        return QS("Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + ".", [[-Infinity, false, z, true]], M(lin(a, b) + " \\ge 0 \\iff " + a + "x \\ge " + -b + " \\iff x \\le " + z) + " (division par " + M(a) + " : on retourne le signe) : " + M("D = ]-\\infty \\,;\\, " + z + "]") + ".",
          { ctx: "racine-neg", guide: [GS("Valeur où " + M(lin(a, b)) + " s'annule ?", z, M(z) + "."), GSS("Domaine ?", [[-Infinity, false, z, true]], M("]-\\infty \\,;\\, " + z + "]") + " (sens retourné).")], traps: [TS([[z, true, Infinity, false]], "En divisant par " + a + " (négatif), on retourne le sens de l'inégalité.")] }); },
      () => { const r = nz(-7, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{1}{\\sqrt{" + xm(r) + "}}") + ".", [[r, false, Infinity, false]], "Racine : " + M(xm(r) + " \\ge 0") + " ; dénominateur non nul : " + M(xm(r) + " \\ne 0") + ". Donc " + M(xm(r) + " > 0") + " : " + M("D = ]" + r + " \\,;\\, +\\infty[") + ".",
          { ctx: "inv-racine", guide: [GS("Valeur où " + M(xm(r)) + " s'annule ?", r, M(r) + "."), GSS("Domaine (strictement positif) ?", [[r, false, Infinity, false]], M("]" + r + " \\,;\\, +\\infty[") + ".")], traps: [TS([[r, true, Infinity, false]], "En " + r + ", le dénominateur vaut √0 = 0 : borne exclue.")] }); },
      () => { const p = nz(-6, 5), q = p + R.int(1, 7);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{3}{(" + xm(p) + ")(" + xm(q) + ")}") + ".", sans([p, q]), "Un produit est nul si l'un des facteurs est nul : " + M("x = " + p) + " ou " + M("x = " + q) + ". " + M("D = " + RM([p, q])) + ".",
          { ctx: "frac-produit", guide: [GS("Plus petite valeur interdite ?", p, M(p) + "."), GSS("Domaine ?", sans([p, q]), M(RM([p, q])) + ".")], traps: [TS(sans([-p, -q]), "Résous chaque facteur = 0 : attention aux signes."), TS(sans([p]), "Il y a deux valeurs interdites.")] }); },
    ],
    3: [
      () => { const r = nz(-6, 4), s = r + R.int(1, 6);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{\\sqrt{" + xm(r) + "}}{" + xm(s) + "}") + ".", [[r, true, s, false], [s, false, Infinity, false]], "Il faut " + M("x \\ge " + r) + " et " + M("x \\ne " + s) + " : " + M("D = " + IT([[r, true, s, false], [s, false, Infinity, false]])) + ".",
          { ctx: "racine-frac", guide: [GSS("Condition de la racine ?", [[r, true, Infinity, false]], M("x \\ge " + r) + "."), GS("Valeur interdite du dénominateur ?", s, M(s) + "."), GSS("Domaine ?", [[r, true, s, false], [s, false, Infinity, false]], M(IT([[r, true, s, false], [s, false, Infinity, false]])) + ".")], traps: [TS([[r, true, Infinity, false]], "N'oublie pas d'exclure " + s + " (dénominateur nul)."), TS(sans([s]), "N'oublie pas la condition de la racine : x ≥ " + r + ".")] }); },
      () => { const p = nz(-6, 4), q = p + R.int(1, 6), ext = R.rand() < 0.5, sg = ext ? "" : "-";
        const expr = ext ? tri(-(p + q), p * q) : "-" + "(" + xm(p) + ")(" + xm(q) + ")", ivs = ext ? [[-Infinity, false, p, true], [q, true, Infinity, false]] : [[p, true, q, true]];
        return QS("Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + expr + "}") + ".", ivs, (ext ? M(tri(-(p + q), p * q) + " = (" + xm(p) + ")(" + xm(q) + ")") + " est positif à l'extérieur des racines" : "Le produit " + M("(" + xm(p) + ")(" + xm(q) + ")") + " est négatif entre les racines, donc son opposé y est positif") + " : " + M("D = " + IT(ivs)) + ".",
          { ctx: ext ? "racine-tri-ext" : "racine-tri-int", guide: [GS("Plus petit zéro de l'expression sous la racine ?", p, M(p) + "."), GS("L'autre zéro ?", q, M(q) + "."), GSS("Domaine (expression ≥ 0) ?", ivs, M(IT(ivs)) + ".")], traps: [TS(ext ? [[p, true, q, true]] : [[-Infinity, false, p, true], [q, true, Infinity, false]], ext ? "a > 0 : la parabole est positive à l'extérieur des racines." : "Avec le signe −, l'expression est positive entre les racines."), TS(ext ? [[-Infinity, false, p, false], [q, false, Infinity, false]] : [[p, false, q, false]], "≥ 0 : les zéros sont compris.")] }); },
      () => { const p = nz(-6, 4), q = p + R.int(1, 6);
        return QS("Détermine le domaine de définition de " + M("f(x) = \\frac{x + 1}{" + tri(-(p + q), p * q) + "}") + ".", sans([p, q]), "On factorise : " + M(tri(-(p + q), p * q) + " = (" + xm(p) + ")(" + xm(q) + ")") + ", nul pour " + M("x = " + p) + " ou " + M("x = " + q) + " : " + M("D = " + RM([p, q])) + ".",
          { ctx: "frac-tri", guide: [GS("Somme des deux valeurs interdites (" + M("-b") + ") ?", p + q, M(p + q) + "."), GS("Plus petite valeur interdite ?", p, M(p) + "."), GSS("Domaine ?", sans([p, q]), M(RM([p, q])) + ".")], traps: [TS(sans([-p, -q]), "Les zéros de (x − p)(x − q) sont p et q : attention aux signes."), TS([[p, false, q, false]], "Le dénominateur doit seulement être non nul : on retire deux points, pas un intervalle.")] }); },
    ],
  };

  const PROBS = {
    tradexpr: [
      () => P("Un nombre " + M("x") + " vaut " + M(4) + ".", [["a) Le double de la somme de x et 3", 14], ["b) La somme du double de x et de 3", 11], ["c) Le carré de la différence entre x et 7", 9]], ["Le premier mot dit la dernière opération.", "c) (4 − 7)² = (−3)²."], "a) " + M("2 \\cdot (4 + 3) = 14") + " ; b) " + M("2 \\cdot 4 + 3 = 11") + " ; c) " + M("(4 - 7)^2 = 9") + "."),
    ],
    divcrit: [
      () => P("On cherche le nombre " + M("74\\,■\\,■") + " (deux chiffres à trouver).", [["a) Chiffre des unités pour être divisible par 10", 0], ["b) Puis le chiffre des dizaines pour être divisible par 9", 7], ["c) Combien de nombres 74■0 sont divisibles par 3 ?", 3]], ["Par 10 : finit par 0.", "Par 9 : 7 + 4 + ■ + 0 multiple de 9."], "a) 0 ; b) " + M("7 + 4 + 7 = 18") + " ; c) ■ ∈ {1 ; 4 ; 7} : 3 nombres."),
    ],
    racenc: [
      () => P("On étudie " + M("\\sqrt{70}") + ".", [["a) Entier juste en dessous", 8], ["b) Entier juste au-dessus", 9], ["c) Combien d'entiers n vérifient 8 < √n < 9 ?", 16]], ["64 < 70 < 81.", "c) de 65 à 80."], "a) 8 ; b) 9 ; c) de 65 à 80 : 16 entiers."),
    ],
    ensembles: [
      () => P("A = [−4 ; 6[ et B = ]1 ; 10].", [["a) Nombre d'entiers de A", 10], ["b) Nombre d'entiers de A ∩ B", 4], ["c) Nombre d'entiers de A ∪ B", 15]], ["A : de −4 à 5.", "A ∩ B = ]1 ; 6[ ; A ∪ B = [−4 ; 10]."], "a) 10 ; b) 2, 3, 4, 5 : 4 ; c) de −4 à 10 : 15."),
    ],
    domaine: [
      () => P("f(x) = √(x + 3) / (x − 2).", [["a) Plus petite valeur de x permise par la racine", -3], ["b) Valeur interdite par le dénominateur", 2], ["c) Combien d'entiers de [−5 ; 5] sont dans le domaine ?", 8]], ["x + 3 ≥ 0.", "x ≠ 2."], "a) −3 ; b) 2 ; c) −3, −2, −1, 0, 1, 3, 4, 5 : 8."),
    ],
  };

  const ALL = { tradexpr: TE, divcrit: DC, racenc: RC, ensembles: EN, domaine: DO };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    tradexpr: "Le premier mot de la phrase dit l'opération faite en dernier : « le double de la somme » = 2 · (… + …).",
    divcrit: "Par 2 : pair ; par 5 : 0 ou 5 ; par 4 : deux derniers chiffres ; par 3 ou 9 : somme des chiffres. Par 6 = 2 et 3 ; par 12 = 3 et 4.",
    racenc: "Encadre par deux carrés parfaits : 49 < 50 < 64, donc 7 < √50 < 8. Pour comparer, compare les carrés.",
    ensembles: "Crochet tourné vers le nombre : compris ; vers l'extérieur : exclu. ∩ = partie commune, ∪ = tout réunir.",
    domaine: "Interdit : diviser par 0, racine d'un négatif. Cherche les valeurs qui annulent le dénominateur, puis où l'expression sous la racine est ≥ 0.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    tradexpr: ["Traduire une phrase en calcul", "Phrases à deux opérations, expressions", "Carrés, sommes de carrés, expressions"],
    divcrit: ["Critères par 2, 3, 5, 9, 10", "Par 4, 6, 15, 25 : combiner", "Chiffres manquants, compter"],
    racenc: ["Encadrer, comparer à un entier", "Ranger, au dixième, a√b", "Compter des entiers, plus grand n"],
    ensembles: ["Intervalles et entiers", "Intersection, réunion, complémentaire", "Inégalités, distance, infini"],
    domaine: ["Fraction, racine simple", "Deux valeurs interdites, sens retourné", "Racine et fraction, trinôme"],
  });
})();
