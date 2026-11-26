// ===================== 25.11 : défis (niveau 4) de 9e et 10e, suite =====================
// Sonde de couverture du 25.11 : 10 notions de 9e et 13 de 10e n'avaient aucun défi (le niveau 4 retombait sur le
// niveau 3). Même principe que src/defis_9.js : 2–3 étapes qui s'enchaînent, valeurs tirées au hasard, programme de la
// classe (plan de cheminement genevois), proposés à la classe et à la suivante (co ; 25.11 : savoir refaire ce qui est d'avant tant que ce n'est pas trivial). Chargé après variantes.js (PROBX).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick;
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const X = (v) => M(N(v));
  const PX = (id, co, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), { co })); };
  const sp = (v, rd) => (Array.isArray(v) ? { kind: "pair", values: v } : Object.assign({ kind: "value", value: rd ? v : +(+v).toPrecision(15) }, rd ? { round: rd } : {})); /* 26.11 (recalcul) : valeur exacte dans la réponse attendue (r6 donnait 0,666667 pour 2/3 : la fraction tapée était refusée) ; r6 reste pour l'affichage */
  const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: sp(v, rd) })) });
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const pt = (x, y) => M("(" + N(x) + "\\,;\\," + N(y) + ")");
  const PAIRL = " (réponds « x ; y »)";
  /* 26.11 soir (agent defisch) : contexte du défi (tag ctx, anti-répétition) */
  const CX = (cx, q) => Object.assign(q, { ctx: cx });

  // ======================= 9e et 10e =======================
  // 26.11 (vraisemblance, décision de l'enseignant) : un seul contexte par énoncé. Le défi « bus et croissants » est
  // séparé en deux défis : les bus (multiple commun), les corbeilles (diviseur commun).
  PX("arith", [9, 10, 11], () => {
    let a, b, m; do { a = pk([6, 8, 9, 10, 12, 15]); b = pk([8, 10, 12, 15, 18, 20]); m = (a * b) / gcd(a, b); } while (a >= b || gcd(a, b) === 1 || m > 120 || m === b);
    return PB("Deux bus partent ensemble du terminus à 7 h. Le premier repasse au terminus toutes les " + a + " minutes, le second toutes les " + b + " minutes.",
      [["a) Après combien de minutes les deux bus repartent-ils de nouveau ensemble ?", m], ["b) Combien de tours le premier bus a-t-il faits pendant ce temps ?", m / a], ["c) Et le second ?", m / b]],
      ["« Ensemble de nouveau » : un multiple commun aux deux durées, le plus petit (PPMC).", "Nombre de tours : la durée divisée par la durée d'un tour."],
      "a) PPMC(" + a + " ; " + b + ") = " + m + " minutes. b) " + M(m + " \\div " + a + " = " + m / a) + " tours. c) " + M(m + " \\div " + b + " = " + m / b) + " tours.");
  });
  PX("arith", [9, 10, 11], () => {
    let a, b, g; do { g = pk([4, 6, 8, 12]); a = g * ri(3, 9); b = g * ri(3, 9); } while (gcd(a / g, b / g) !== 1 || a === b || a > 80 || b > 80);
    return PB("Pour une fête, on veut répartir " + a + " croissants et " + b + " pains au chocolat dans des corbeilles identiques (même contenu dans chaque corbeille), avec le plus grand nombre de corbeilles possible.",
      [["a) Combien de corbeilles peut-on faire ?", g], ["b) Combien de croissants dans chaque corbeille ?", a / g], ["c) Combien de pains au chocolat dans chaque corbeille ?", b / g]],
      ["« Le plus grand nombre de corbeilles identiques » : un diviseur commun, le plus grand (PGDC).", "Chaque corbeille reçoit la même part : divise par le nombre de corbeilles."],
      "a) PGDC(" + a + " ; " + b + ") = " + g + " corbeilles. b) " + M(a + " \\div " + g + " = " + a / g) + " croissants. c) " + M(b + " \\div " + g + " = " + b / g) + " pains au chocolat.");
  });
  PX("diagr", [9, 10, 11], () => {
    /* 26.11 soir (agent defisch) : notes du semestre, points au basket, températures à midi */
    const cx = pk(["notes", "basket", "temperatures"]);
    if (cx !== "notes") {
      const B = cx === "basket" ? { v: [6, 24], lo: 4, hi: 32, t: [12, 14, 15, 16, 18] } : { v: [-4, 9], lo: -6, hi: 12, t: [1, 2, 3, 4, 5] };
      let n, xs, k, tgt; do { n = pk([5, 6]); xs = Array.from({ length: n - 1 }, () => ri(B.v[0], B.v[1])); tgt = pk(B.t); k = tgt * n - xs.reduce((s, x) => s + x, 0); } while (k < B.lo || k > B.hi || k === 0 || k === 1 || Number.isInteger(xs.reduce((s, x) => s + x, 0) / (n - 1)) || new Set(xs).size < n - 2);
      const S = xs.reduce((s, x) => s + x, 0), m0 = S / (n - 1), mr = Math.round(+(m0 * 100).toPrecision(12)) / 100;
      const q = cx === "basket" ? "Lors de ses " + (n - 1) + " premiers matchs de basket, Yanis a marqué " + xs.map(X).join(" ; ") + " points. Il reste un match dans la saison."
        : "En montagne, on a relevé la température à midi pendant " + (n - 1) + " jours de janvier : " + xs.map((x) => X(x) + " °C").join(" ; ") + ". On attend le relevé du jour suivant.";
      const [la, lb, lc, u] = cx === "basket" ? ["a) Moyenne actuelle de points par match (au centième)", "b) Total de ses points", "c) Combien de points doit-il marquer au dernier match pour finir avec exactement " + tgt + " points de moyenne ?", " points"]
        : ["a) Température moyenne actuelle, en °C (au centième)", "b) Somme des températures relevées", "c) Quelle température faudrait-il le jour suivant pour que la moyenne des " + n + " jours soit exactement " + tgt + " °C ?", " °C"];
      return CX(cx, PB(q, [[la, m0, 0.01], [lb, S], [lc, k]],
        ["Moyenne = somme des valeurs ÷ nombre de valeurs" + (cx === "basket" ? "." : " ; attention aux nombres négatifs."), "c) Avec " + n + " valeurs et une moyenne de " + tgt + ", quelle doit être la somme des " + n + " valeurs ?"],
        "a) " + M(N(S) + " \\div " + (n - 1) + (Number.isInteger(r6(m0 * 100)) ? " = " : " \\approx ") + N(mr)) + ". b) " + X(S) + ". c) Somme nécessaire : " + M(n + " \\cdot " + tgt + " = " + n * tgt) + " ; dernière valeur : " + M(n * tgt + " - " + (S < 0 ? "(" + N(S) + ")" : N(S)) + " = " + N(k)) + u + "."));
    }
    let n, notes, k, tgt; do { n = pk([5, 6]); notes = Array.from({ length: n - 1 }, () => pk([3.5, 4, 4.5, 5, 5.5, 6])); tgt = pk([4.5, 5, 5.5]); k = r6(tgt * n - notes.reduce((s, x) => s + x, 0)); } while (k < 3 || k > 6 || Math.abs(k * 2 - Math.round(k * 2)) > 1e-9);
    const S = r6(notes.reduce((s, x) => s + x, 0)), m0 = r6(S / (n - 1));
    return CX(cx, PB("Léa a obtenu ces notes en maths : " + notes.map(X).join(" ; ") + ". Il reste un test avant la fin du semestre.",
      [["a) Moyenne actuelle (au centième)", Math.round(+(m0 * 100).toPrecision(12)) / 100, 0.01] /* 26.11 soir (agent defisch, recalcul) : 4,625 acceptait 4,62 et 4,63 */, ["b) Somme de ses notes actuelles", S], ["c) Quelle note doit-elle obtenir au dernier test pour avoir exactement " + N(tgt).replace("{,}", ",") + " de moyenne ?", k]],
      ["Moyenne = somme des notes ÷ nombre de notes.", "c) Avec " + n + " notes et une moyenne de " + N(tgt).replace("{,}", ",") + ", quelle doit être la somme des " + n + " notes ?"],
      "a) " + M(N(S) + " \\div " + (n - 1) + (Number.isInteger(r6(m0 * 100)) ? " = " : " \\approx ") + N(Math.round(m0 * 100) / 100)) + ". b) " + X(S) + ". c) Somme nécessaire : " + M(n + " \\cdot " + N(tgt) + " = " + N(r6(n * tgt))) + " ; note : " + M(N(r6(n * tgt)) + " - " + N(S) + " = " + N(k)) + "."));
  });
  PX("premiers", [9, 10, 11], () => {
    /* 26.11 soir (agent defisch) : nombre seul, fanfare en rangs, dalles en rectangle */
    const cx = pk(["nombre", "fanfare", "dalles"]);
    const P = [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]];
    let p, q, a, b, n; do { [p, q] = pk(P); a = pk([2, 3, 4]); b = a % 2 ? ri(1, 2) : 1; n = p ** a * q ** b; } while (cx !== "nombre" && (n < 24 || n > 200));
    const nd = (a + 1) * (b + 1), sq = (a % 2 ? p : 1) * (b % 2 ? q : 1), dec = M(N(n) + " = " + p + "^{" + a + "} \\cdot " + q + (b > 1 ? "^{" + b + "}" : ""));
    if (cx === "fanfare") { const s = Math.ceil(Math.sqrt(n) - 1e-9), add = s * s - n;
      return CX(cx, PB("Une fanfare de " + X(n) + " musiciens veut défiler en rangs complets, tous de la même longueur.",
        [["a) Combien de diviseurs le nombre " + n + " a-t-il en tout ?", nd], ["b) Combien de façons de défiler y a-t-il, avec au moins 2 rangs et au moins 2 musiciens par rang ?", nd - 2], ["c) Combien de musiciens faudrait-il ajouter au minimum pour pouvoir défiler en carré (autant de rangs que de musiciens par rang) ?", add]],
        ["Décompose " + n + " en facteurs premiers : chaque diviseur est un nombre de musiciens par rang possible.", "b) Enlève les deux cas exclus : un seul rang, ou un seul musicien par rang."],
        dec + ". a) " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + " diviseurs. b) Sans 1 et " + n + " : " + (nd - 2) + " façons. c) Le plus petit carré qui n'est pas plus petit que " + n + " : " + M(s + "^2 = " + s * s) + ", donc " + add + " musiciens de plus" + (add === 0 ? " (c'est déjà un carré)" : "") + ".")); }
    if (cx === "dalles") { const nr = Math.ceil(nd / 2);
      return CX(cx, PB("On dispose de " + X(n) + " dalles carrées identiques et on veut les poser toutes, sans les couper, pour former un rectangle plein.",
        [["a) Combien de diviseurs le nombre " + n + " a-t-il ?", nd], ["b) Combien de rectangles différents peut-on former (un rectangle de 2 sur 3 et un de 3 sur 2 comptent pour un seul ; une seule rangée compte) ?", nr], ["c) Par quel plus petit entier faut-il multiplier le nombre de dalles pour pouvoir former un carré ?", sq]],
        ["Chaque rectangle correspond à une paire de diviseurs dont le produit vaut " + n + ".", "c) Un carré parfait : chaque facteur premier y apparaît un nombre pair de fois."],
        dec + ". a) " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + ". b) Les diviseurs vont par paires (produit " + n + ") : " + nr + " rectangles" + (nd % 2 ? " (dont un carré)" : "") + ". c) Exposants à rendre pairs : multiplier par " + sq + ".")); }
    return CX(cx, PB("On considère le nombre " + X(n) + ".",
      [["a) Combien de facteurs premiers (comptés avec répétition) dans sa décomposition ?", a + b], ["b) Combien de diviseurs a-t-il en tout ?", nd], ["c) Par quel plus petit entier faut-il le multiplier pour obtenir un carré parfait ?", sq]],
      ["Décompose en divisant par 2, puis 3, puis 5, puis 7… tant que c'est possible.", "Un carré parfait : chaque facteur premier y apparaît un nombre pair de fois."],
      dec + ". a) " + (a + b) + " facteurs. b) Un diviseur prend " + p + " de 0 à " + a + " fois et " + q + " de 0 à " + b + " fois : " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + ". c) Il faut rendre les exposants pairs : multiplier par " + sq + "."));
  });
  PX("fracper", [9, 10, 11], () => {
    /* 26.11 soir (agent defisch) : trois formes de périodes (2 chiffres après un chiffre fixe, période pure de 2 chiffres, période d'un chiffre après un chiffre fixe) */
    const cx = pk(["mixte2", "pure2", "mixte1"]);
    if (cx === "pure2") { let bc; do { bc = ri(12, 98); } while (bc % 11 === 0 || gcd(bc, 99) === 1);
      const g = gcd(bc, 99), s = "0{,}" + bc + bc + bc + "\\ldots", B = String(bc);
      return CX(cx, PB("La calculatrice affiche " + M(s) + " (le groupe « " + B + " » se répète sans fin). On veut écrire ce nombre sous forme de fraction irréductible.",
        [["a) Combien vaut " + M("100 \\cdot x - x") + " si " + M("x = " + s) + " ?", bc], ["b) Numérateur de la fraction irréductible", bc / g], ["c) Dénominateur de la fraction irréductible", 99 / g]],
        ["Multiplie x par 100 pour décaler d'une période : les parties décimales sont les mêmes.", "Soustrais, puis simplifie la fraction obtenue."],
        M("100x = " + B + "{,}" + B + B + "\\ldots") + " ; " + M("99x = " + bc) + ", donc " + M("x = \\frac{" + bc + "}{99} = \\frac{" + bc / g + "}{" + 99 / g + "}") + ".")); }
    if (cx === "mixte1") { let a, c; do { a = ri(1, 9); c = ri(1, 9); } while (a === c || gcd(a * 9 + c, 90) === 1);
      const nu = a * 9 + c, g = gcd(nu, 90), s = "0{,}" + a + c + c + c + "\\ldots";
      return CX(cx, PB("On veut écrire " + M(s) + " (seul le chiffre « " + c + " » se répète) sous forme de fraction irréductible.",
        [["a) Combien vaut " + M("100 \\cdot x - 10 \\cdot x") + " si " + M("x = " + s) + " ?", nu], ["b) Numérateur de la fraction irréductible", nu / g], ["c) Dénominateur de la fraction irréductible", 90 / g]],
        ["Multiplie x par 10 pour amener la période juste après la virgule, puis par 100 pour la décaler d'un chiffre.", "Soustrais, puis simplifie la fraction obtenue."],
        M("100x = " + a + c + "{,}" + c + c + "\\ldots") + " et " + M("10x = " + a + "{,}" + c + c + "\\ldots") + " ; " + M("90x = " + (10 * a + c) + " - " + a + " = " + nu) + ", donc " + M("x = \\frac{" + nu + "}{90} = \\frac{" + nu / g + "}{" + 90 / g + "}") + ".")); }
    const a = ri(1, 9), bc = pk([12, 27, 36, 45, 63, 81]), v = a / 10 + bc / 990;
    let num = a * 99 + bc, den = 990; const g = gcd(num, den); num /= g; den /= g;
    const s = "0{,}" + a + String(bc).padStart(2, "0") + String(bc).padStart(2, "0") + "\\ldots";
    return CX(cx, PB("On veut écrire " + M(s) + " (le groupe « " + String(bc).padStart(2, "0") + " » se répète) sous forme de fraction irréductible.",
      [["a) Combien vaut " + M("1000 \\cdot x - 10 \\cdot x") + " si " + M("x = " + s) + " ?", r6(990 * v)], ["b) Numérateur de la fraction irréductible", num], ["c) Dénominateur de la fraction irréductible", den]],
      ["Multiplie x par 10 pour amener la période juste après la virgule, puis par 1000 pour décaler d'une période : les parties décimales sont les mêmes.", "Soustrais, puis simplifie la fraction obtenue."],
      M("1000x = " + a + String(bc).padStart(2, "0") + "{,}" + String(bc).padStart(2, "0") + "\\ldots") + " et " + M("10x = " + a + "{,}" + String(bc).padStart(2, "0") + "\\ldots") + " ; " + M("990x = " + (a * 99 + bc)) + ", donc " + M("x = \\frac{" + (a * 99 + bc) + "}{990} = \\frac{" + num + "}{" + den + "}") + "."));
  });

  // ======================= 9e =======================
  PX("decarr", [9, 10], () => {
    let p; do { p = r6(ri(4, 24) + ri(1, 9) / 10 + pk([0, 5]) / 100); } /* prix au 5 centimes près (romand) */ while (Math.abs(p - Math.round(p)) < 0.15 || Math.round((p % 1) * 10) === 5);
    const n = pk([3, 4, 6, 7, 8].filter((k) => ![0, 1].includes(r6(Math.abs(k * Math.round(p) - k * p))))) || 3, t = r6(p * n), [cx, txt] = pk([["supermarche", "Au supermarché, Tom achète # articles à @ CHF pièce."], ["librairie", "À la librairie, Inès achète # livres de poche à @ CHF pièce."], ["papeterie", "Pour la rentrée, Noé achète # classeurs à @ CHF pièce."]]);
    return Object.assign(PB(txt.replace("#", n).replace("@", N(p)) + " Pour calculer de tête, on arrondit le prix à l'unité.",
      [["a) Prix total exact, en CHF", t, 0.01], ["b) Total estimé avec le prix arrondi à l'unité", n * Math.round(p)], ["c) Différence entre l'estimation et le prix exact (en CHF, valeur positive)", r6(Math.abs(n * Math.round(p) - t)), 0.01]],
      ["Arrondir à l'unité : regarde le chiffre des dixièmes.", "c) L'arrondi fait une petite erreur sur chaque article ; elle est multipliée par " + n + "."],
      "a) " + M(n + " \\cdot " + N(p) + " = " + N(t)) + " CHF. b) " + N(p) + " ≈ " + Math.round(p) + " ; " + M(n + " \\cdot " + Math.round(p) + " = " + n * Math.round(p)) + " CHF. c) " + M("|" + n * Math.round(p) + " - " + N(t) + "| = " + N(r6(Math.abs(n * Math.round(p) - t)))) + " CHF."), { ctx: cx });
  });
  PX("decprob", [9, 10], () => {
    /* 26.11 soir (agent defisch) : jus pour un pique-nique, peinture d'une chambre, graines de gazon */
    const cx = pk(["piquenique", "peinture", "gazon"]);
    let L, pl, pu, bott, cost, bil, q, la, lb, a1;
    for (let essai = 0; essai < 50; essai++) {
    if (cx === "peinture") { const S = pk([24, 28, 32, 36]), c = 2, d = pk([0.1, 0.125, 0.15]); pl = 2.5; pu = pk([29.9, 34.5, 39.9]);
      L = r6(S * c * d); bott = Math.ceil(r6(L / pl) - 1e-9); cost = r6(bott * pu); bil = [50, 100, 200].find((b) => b > cost);
      q = "On repeint les murs d'une chambre : " + X(S) + " m² à couvrir, en deux couches. Il faut " + X(d) + " L de peinture par m² et par couche. La peinture est vendue en pots de " + X(pl) + " L à " + X(pu) + " CHF le pot. On paie avec un billet de " + bil + " CHF.";
      la = "a) Quantité de peinture nécessaire, en L"; lb = "b) Nombre de pots à acheter"; a1 = M(N(S) + " \\cdot 2 \\cdot " + N(d) + " = " + N(L)) + " L"; }
    else if (cx === "gazon") { const S = pk([60, 75, 90, 120, 150]), d = pk([25, 30, 40]); pl = pk([1, 2.5]); pu = pl === 1 ? pk([12.9, 15.5, 18.9]) : pk([29.9, 34.5, 39.9]);
      L = r6((S * d) / 1000); bott = Math.ceil(r6(L / pl) - 1e-9); cost = r6(bott * pu); bil = [20, 50, 100, 200].find((b) => b > cost);
      q = "Pour semer une pelouse de " + X(S) + " m², il faut " + d + " g de graines par m². Les graines sont vendues en sacs de " + X(pl) + " kg à " + X(pu) + " CHF le sac. On paie avec un billet de " + bil + " CHF.";
      la = "a) Masse de graines nécessaire, en kg"; lb = "b) Nombre de sacs à acheter"; a1 = M(N(S) + " \\cdot " + d + " = " + N(S * d)) + " g = " + X(L) + " kg"; }
    else { const l = pk([0.75, 0.5, 0.4]) /* 26.11 : et non 1,5 L de jus par personne */, n = pk([12, 18, 24]); pl = pk([1.8, 2.4, 3.6]); pu = pk([2.9, 3.45, 4.2]);
      L = r6(l * n); bott = Math.ceil(r6(L / pl) - 1e-9); cost = r6(bott * pu); bil = [20, 50, 100].find((b) => b > cost);
      q = "Pour un pique-nique de " + n + " personnes, on prévoit " + X(l) + " L de jus par personne. Le jus est vendu en bouteilles de " + X(pl) + " L à " + X(pu) + " CHF la bouteille. On paie avec un billet de " + bil + " CHF.";
      la = "a) Quantité de jus nécessaire, en L"; lb = "b) Nombre de bouteilles à acheter"; a1 = M(n + " \\cdot " + N(l) + " = " + N(L)) + " L"; }
    if (!Number.isInteger(r6(L / pl)) && bott >= 2) break;
    }
    return CX(cx, PB(q, [[la, L], [lb, bott], ["c) Monnaie rendue, en CHF", r6(bil - cost), 0.01]],
      ["b) On ne peut acheter qu'un nombre entier de " + (cx === "piquenique" ? "bouteilles" : cx === "peinture" ? "pots" : "sacs") + " : arrondis vers le haut.", "c) Prix total, puis soustrais du billet."],
      "a) " + a1 + ". b) " + M(N(L) + " \\div " + N(pl) + " \\approx " + N(Math.round((L / pl) * 100) / 100)) + " : il en faut " + bott + ". c) " + M(bott + " \\cdot " + N(pu) + " = " + N(cost)) + " CHF ; " + M(bil + " - " + N(cost) + " = " + N(r6(bil - cost))) + " CHF."));
  });
  PX("multdiv", [9, 10], () => {
    /* 26.11 soir (agent defisch) : liste d'entiers, deux lignes de bus, deux phares */
    const cx = pk(["liste", "bus", "phares"]);
    let a, b; do { a = pk([4, 6, 8, 9, 12]); b = pk([6, 10, 15, 14, 21]); } while (a === b || gcd(a, b) === 1 || gcd(a, b) === Math.min(a, b));
    const L = (a * b) / gcd(a, b);
    if (cx === "bus") { const H = pk([2, 3]), T = 60 * H, cA = Math.floor(T / a) + 1, cL = Math.floor(T / L) + 1, h0 = pk([6, 7]);
      return CX(cx, PB("À " + h0 + " h 00, deux bus partent ensemble de la gare : la ligne A repart ensuite toutes les " + a + " minutes, la ligne B toutes les " + b + " minutes. On observe les départs de " + h0 + " h 00 à " + (h0 + H) + " h 00 (bornes comprises).",
        [["a) Combien de départs de la ligne A pendant cette période ?", cA], ["b) Après combien de minutes les deux lignes repartent-elles ensemble pour la première fois ?", L], ["c) Combien de fois partent-elles ensemble pendant cette période (le départ de " + h0 + " h 00 compris) ?", cL]],
        ["Les départs de la ligne A ont lieu aux multiples de " + a + " minutes (0 compris).", "Départs communs : multiples communs de " + a + " et de " + b + " (pas forcément " + a * b + ")."],
        "a) " + T + " min : multiples de " + a + " de 0 à " + T + " : " + M(Math.floor(T / a) + " + 1 = " + cA) + ". b) Plus petit multiple commun : " + L + " min (et non " + a * b + "). c) Multiples de " + L + " de 0 à " + T + " : " + M(Math.floor(T / L) + " + 1 = " + cL) + ".")); }
    if (cx === "phares") { const T = pk([300, 360, 600]), cA = Math.floor(T / a), cL = Math.floor(T / L);
      return CX(cx, PB("Deux phares viennent de s'allumer en même temps. Le premier envoie un éclair toutes les " + a + " secondes, le second toutes les " + b + " secondes. On compte les éclairs pendant les " + T + " secondes qui suivent (sans compter l'éclair du départ).",
        [["a) Combien d'éclairs du premier phare ?", cA], ["b) Après combien de secondes les deux phares brillent-ils de nouveau ensemble ?", L], ["c) Combien de fois brillent-ils ensemble pendant ces " + T + " secondes ?", cL]],
        ["Les éclairs du premier phare ont lieu aux multiples de " + a + " secondes.", "Ensemble : aux multiples communs de " + a + " et de " + b + "."],
        "a) " + M(T + " \\div " + a + (T % a ? " \\approx " : " = ") + N(Math.floor((T / a) * 100) / 100)) + " : " + cA + " éclairs. b) " + L + " s (et non " + a * b + "). c) Multiples de " + L + " jusqu'à " + T + " : " + cL + ".")); }
    const lo = ri(1, 3) * 50, hi = lo + pk([200, 300]), cA = Math.floor(hi / a) - Math.floor((lo - 1) / a), cL = Math.floor(hi / L) - Math.floor((lo - 1) / L);
    return CX(cx, PB("On considère les nombres entiers de " + lo + " à " + hi + " (bornes comprises).",
      [["a) Combien sont des multiples de " + a + " ?", cA], ["b) Quel est le plus petit nombre non nul multiple à la fois de " + a + " et de " + b + " ?", L], ["c) Combien de nombres de la liste sont multiples à la fois de " + a + " et de " + b + " ?", cL]],
      ["Compte les multiples de " + a + " jusqu'à " + hi + ", puis enlève ceux qui sont avant " + lo + ".", "Multiple de " + a + " et de " + b + " : multiple de leur plus petit multiple commun (pas forcément " + a * b + ")."],
      "a) Jusqu'à " + hi + " : " + Math.floor(hi / a) + " multiples ; avant " + lo + " : " + Math.floor((lo - 1) / a) + " ; donc " + cA + ". b) " + L + " (et non " + a * b + "). c) Multiples de " + L + " : " + Math.floor(hi / L) + " − " + Math.floor((lo - 1) / L) + " = " + cL + "."));
  });
  PX("relrep", [9, 10], () => {
    /* 26.11 soir (agent defisch) : droite graduée, ascenseur (étages et sous-sols), plongée (altitudes) */
    const cx = pk(["droite", "ascenseur", "plongee"]);
    if (cx === "ascenseur") { let a, b, c; do { a = -ri(1, 4); b = ri(3, 12); c = -ri(1, 4); } while (a === c || (a + b) % 2 !== 0 || [0, 1].includes((a + b) / 2));
      return CX(cx, PB("Dans un immeuble, les sous-sols portent des numéros négatifs (−1, −2…) et le rez-de-chaussée le numéro 0. Léa prend l'ascenseur du niveau " + X(a) + " (parking) au niveau " + X(b) + ", puis redescend au niveau " + X(c) + " (cave).",
        [["a) De combien d'étages monte-t-elle d'abord ?", b - a], ["b) Quel niveau est exactement à mi-chemin entre le parking et le niveau " + b + " ?", (a + b) / 2], ["c) De combien d'étages descend-elle ensuite ?", b - c]],
        ["Nombre d'étages entre deux niveaux : le plus haut moins le plus bas.", "b) Milieu : moyenne des deux niveaux."],
        "a) " + M(b + " - (" + a + ") = " + (b - a)) + ". b) " + M("(" + a + " + " + b + ") \\div 2 = " + (a + b) / 2) + ". c) " + M(b + " - (" + c + ") = " + (b - c)) + ".")); }
    if (cx === "plongee") { let a, b, c; do { a = -ri(6, 30); b = ri(4, 25); c = -ri(2, 18); } while (a === c || c - a < 2 || (a + b) % 2 !== 0 || [0, 1].includes((a + b) / 2));
      return CX(cx, PB("Au bord d'un lac, une plongeuse est à l'altitude " + X(a) + " m par rapport à la surface, une truite nage à " + X(c) + " m et un goéland vole à " + X(b) + " m au-dessus de l'eau.",
        [["a) Distance verticale entre la plongeuse et le goéland, en m", b - a], ["b) Altitude du point situé à mi-hauteur entre la plongeuse et le goéland, en m", (a + b) / 2], ["c) De combien de mètres la plongeuse doit-elle remonter pour être à la hauteur de la truite ?", c - a]],
        ["Distance : la plus grande altitude moins la plus petite.", "b) Milieu : moyenne des deux altitudes."],
        "a) " + M(b + " - (" + a + ") = " + (b - a)) + " m. b) " + M("(" + a + " + " + b + ") \\div 2 = " + (a + b) / 2) + " m. c) " + M(c + " - (" + a + ") = " + (c - a)) + " m.")); }
    let a, b, c; do { a = -ri(4, 12); b = ri(3, 11); c = -ri(2, 9); } while (a === c || Math.abs(a + b) < 3);
    const m = r6((a + b) / 2), d = b - a;
    return CX(cx, PB("Sur une droite graduée, le point " + M("A") + " a pour abscisse " + X(a) + ", le point " + M("B") + " a pour abscisse " + X(b) + " et le point " + M("C") + " a pour abscisse " + X(c) + ".",
      [["a) Distance entre " + M("A") + " et " + M("B"), d], ["b) Abscisse du milieu de " + M("[AB]"), m], ["c) De combien d'unités faut-il déplacer " + M("C") + " vers la droite pour qu'il soit à la même distance de " + M("B") + " que " + M("A") + " l'est de " + M("B") + ", de l'autre côté de " + M("B") + " ?", b + d - c]],
      ["Distance entre deux points : la plus grande abscisse moins la plus petite.", "c) Le point cherché est à " + d + " unités à droite de B."],
      "a) " + M(b + " - (" + a + ") = " + d) + ". b) " + M("(" + a + " + " + b + ") \\div 2 = " + N(m)) + ". c) Point cherché : " + M(b + " + " + d + " = " + (b + d)) + " ; déplacement : " + M((b + d) + " - (" + c + ") = " + (b + d - c)) + " unités."));
  });
  /* 26.11 soir (agent defis3) : quadri, decarr, airelat : 3 contextes chacun (avant : 1 ou 2). */
  PX("quadri", [9, 10], () => {
    const al = pk([32, 38, 44, 52, 58, 64]), b = (180 - 2 * al) / 2, kind = pk(["losange", "rectangle", "parallelogramme"]);
    if (kind === "parallelogramme") { const A = pk([62, 68, 74, 108, 116, 124]), be = pk([20, 24, 28, 32, 36].filter((z) => z < A - 15));
      return Object.assign(PB("Dans un parallélogramme " + M("ABCD") + ", l'angle " + M("\\widehat{BAD}") + " mesure " + A + "° et la diagonale [AC] fait avec le côté [AB] un angle " + M("\\widehat{BAC}") + " de " + be + "°.",
        [["a) Angle " + M("\\widehat{ABC}") + " (en degrés)", 180 - A], ["b) Angle " + M("\\widehat{CAD}") + " (en degrés)", A - be], ["c) Angle " + M("\\widehat{ACD}") + " (en degrés)", be]],
        ["Deux angles consécutifs d'un parallélogramme sont supplémentaires (somme 180°).", "(AB) et (CD) sont parallèles : les angles BAC et ACD sont alternes-internes."],
        "a) " + M("180° - " + A + "° = " + (180 - A) + "°") + ". b) " + M(A + "° - " + be + "° = " + (A - be) + "°") + ". c) Alternes-internes avec " + M("\\widehat{BAC}") + " : " + be + "°."), { ctx: kind }); }
    return Object.assign(kind === "losange" ? PB("Dans un losange " + M("ABCD") + ", l'angle " + M("\\widehat{BAC}") + " (entre le côté et la diagonale) mesure " + al + "°. Les diagonales se coupent en " + M("O") + ".",
      [["a) Angle " + M("\\widehat{BAD}") + " (en degrés)", 2 * al], ["b) Angle " + M("\\widehat{AOB}") + " (en degrés)", 90], ["c) Angle " + M("\\widehat{ABC}") + " (en degrés)", 180 - 2 * al]],
      ["Dans un losange, les diagonales sont les bissectrices des angles et elles sont perpendiculaires.", "Deux angles consécutifs d'un losange sont supplémentaires (somme 180°)."],
      "a) La diagonale [AC] est bissectrice : " + M("2 \\cdot " + al + "° = " + 2 * al + "°") + ". b) Diagonales perpendiculaires : 90°. c) " + M("180° - " + 2 * al + "° = " + (180 - 2 * al) + "°") + ".")
      : PB("Dans un rectangle " + M("ABCD") + ", les diagonales se coupent en " + M("O") + " et l'angle " + M("\\widehat{OAB}") + " mesure " + al + "°.",
      [["a) Angle " + M("\\widehat{OBA}") + " (en degrés)", al], ["b) Angle " + M("\\widehat{AOB}") + " (en degrés)", 180 - 2 * al], ["c) Angle " + M("\\widehat{BOC}") + " (en degrés)", 2 * al]],
      ["Dans un rectangle, les diagonales ont la même longueur et se coupent en leur milieu : OA = OB.", "Les angles AOB et BOC sont adjacents et forment un angle plat."],
      "a) OA = OB : le triangle AOB est isocèle, donc " + al + "°. b) " + M("180° - 2 \\cdot " + al + "° = " + (180 - 2 * al) + "°") + ". c) " + M("180° - " + (180 - 2 * al) + "° = " + 2 * al + "°") + "."), { ctx: kind });
  });
  PX("symetries", [9, 10], () => {
    /* 26.11 soir (agent defisch) : repère, carte d'un jeu vidéo (cases), plan d'un parc (en m) */
    const cx = pk(["repere", "jeu", "parc"]);
    let ax, ay, cx0, cy, tx, ty; do { ax = ri(-5, 5); ay = ri(-5, 5); cx0 = ri(-3, 3); cy = ri(-3, 3); tx = ri(-4, 4); ty = ri(-4, 4); } while ((ax === cx0 && ay === cy) || !tx || !ty || !ax || !ay);
    const k = cx === "parc" ? pk([10, 20]) : 1, S = (v) => v * k, bx = 2 * cx0 - ax, by = 2 * cy - ay;
    const P2 = (x, y) => pt(S(x), S(y));
    const q = cx === "jeu" ? "Sur la carte d'un jeu vidéo (repère, une unité = une case), le héros est en " + M("A") + P2(ax, ay) + " et un portail en " + M("C") + P2(cx0, cy) + ". Le portail envoie le héros en " + M("B") + ", symétrique de " + M("A") + " par rapport à " + M("C") + ". Puis un tapis roulant le déplace comme la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + P2(tx, ty) + " : il arrive en " + M("D") + "."
      : cx === "parc" ? "Sur le plan d'un parc (repère, unités en mètres), une statue est en " + M("A") + P2(ax, ay) + " et la fontaine en " + M("C") + P2(cx0, cy) + ". On place une deuxième statue en " + M("B") + ", symétrique de " + M("A") + " par rapport à " + M("C") + ", puis un banc en " + M("D") + ", image de " + M("B") + " par la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + P2(tx, ty) + "."
      : "Dans un repère, " + M("A") + P2(ax, ay) + " et " + M("C") + P2(cx0, cy) + ". " + M("B") + " est l'image de " + M("A") + " par la symétrie de centre " + M("C") + ", puis " + M("D") + " est l'image de " + M("B") + " par la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + P2(tx, ty) + ".";
    return CX(cx, PB(q,
      [["a) Coordonnées de " + M("B") + PAIRL, [S(bx), S(by)]], ["b) Coordonnées de " + M("D") + PAIRL, [S(bx + tx), S(by + ty)]], ["c) Coordonnées de l'image de " + M("A") + " par la symétrie d'axe des ordonnées" + PAIRL, [-S(ax), S(ay)]]],
      ["C est le milieu de [AB] : pour passer de A à C, et de C à B, on fait le même déplacement.", "Translation : on ajoute " + S(tx) + " à l'abscisse et " + S(ty) + " à l'ordonnée."],
      "a) De A à C : " + M("(" + S(cx0 - ax) + "\\,;\\," + S(cy - ay) + ")") + " ; on recommence depuis C : " + M("B") + P2(bx, by) + ". b) " + M("D") + P2(bx + tx, by + ty) + ". c) L'abscisse change de signe : " + pt(-S(ax), S(ay)) + "."));
  });

  // ======================= 10e =======================
  PX("rac", [10, 11], () => {
    /* 26.11 soir (agent defisch) : cube et carré, terrain carré (clôture), aquarium cubique (litres) */
    const cx = pk(["cube", "terrain", "aquarium"]);
    if (cx === "terrain") { const s = pk([18, 24, 25, 32, 35, 45]), k = pk([4, 9]), p = pk([12, 15, 25]);
      return CX(cx, PB("Un terrain carré a une aire de " + X(s * s) + " m². On veut l'entourer d'une clôture à " + p + " CHF le mètre.",
        [["a) Côté du terrain, en m", s], ["b) Prix de la clôture, en CHF", 4 * s * p], ["c) Côté d'un terrain carré " + k + " fois plus grand en aire, en m", Math.sqrt(k) * s]],
        ["Le côté est la racine carrée de l'aire : quel nombre multiplié par lui-même donne " + N(s * s) + " ?", "c) Aire " + k + " fois plus grande : le côté n'est pas multiplié par " + k + "."],
        "a) " + M("\\sqrt{" + N(s * s) + "} = " + s) + " m. b) " + M("4 \\cdot " + s + " \\cdot " + p + " = " + N(4 * s * p)) + " CHF. c) " + M("\\sqrt{" + k + " \\cdot " + N(s * s) + "} = \\sqrt{" + N(k * s * s) + "} = " + Math.sqrt(k) * s) + " m.")); }
    if (cx === "aquarium") { const s = pk([30, 40, 50, 60]), V = s ** 3;
      return CX(cx, PB("Un aquarium cubique (sans couvercle) contient exactement " + X(V / 1000) + " litres quand il est plein.",
        [["a) Arête de l'aquarium, en cm", s], ["b) Aire de verre utilisée (fond et quatre côtés), en cm²", 5 * s * s], ["c) Arête d'un aquarium cubique qui contient 8 fois plus d'eau, en cm", 2 * s]],
        ["1 L = 1'000 cm³ : convertis d'abord le volume en cm³, puis cherche le nombre qui, multiplié trois fois par lui-même, donne ce volume.", "c) Volume 8 fois plus grand : l'arête est multipliée par la racine cubique de 8."],
        "a) " + M(N(V / 1000) + " \\text{ L} = " + N(V) + " \\text{ cm}^3 = " + s + "^3") + ", donc " + s + " cm. b) " + M("5 \\cdot " + s + "^2 = " + N(5 * s * s)) + " cm². c) " + M("\\sqrt[3]{8} = 2") + " : " + M("2 \\cdot " + s + " = " + 2 * s) + " cm.")); }
    const s = pk([7, 9, 11, 12, 13, 15]), V = s ** 3, k = pk([4, 9, 16, 25]);
    return CX(cx, PB("Un cube a un volume de " + X(V) + " cm³. Un carré a une aire égale à l'aire totale du cube.",
      [["a) Arête du cube, en cm", s], ["b) Aire totale du cube, en cm²", 6 * s * s], ["c) Côté d'un carré dont l'aire est " + k + " fois celle d'une face du cube, en cm", Math.sqrt(k) * s]],
      ["L'arête est la racine cubique du volume : quel nombre multiplié trois fois par lui-même donne " + N(V) + " ?", "c) Aire du carré = " + k + " · " + s * s + " ; son côté est la racine carrée de cette aire."],
      "a) " + M(s + "^3 = " + N(V)) + ", donc " + s + " cm. b) " + M("6 \\cdot " + s + "^2 = " + N(6 * s * s)) + " cm². c) " + M("\\sqrt{" + k + " \\cdot " + s * s + "} = \\sqrt{" + N(k * s * s) + "} = " + Math.sqrt(k) * s) + " cm."));
  });
  PX("disque", [10, 11], () => {
    /* 26.11 soir (agent defisch) : part de pizza, arroseur de jardin, aiguille des minutes */
    const cx = pk(["pizza", "arroseur", "horloge"]);
    const R2 = (v) => Math.round(v * 100) / 100;
    let r, a, u, q, la, lb, lc;
    if (cx === "arroseur") { r = pk([4, 5, 6, 7.5, 8]); a = pk([90, 120, 150, 210, 270]); u = "m";
      q = "Un arroseur de jardin tourne sur place et arrose un secteur de disque de rayon " + X(r) + " m et d'angle " + a + "°.";
      la = "a) Longueur du bord courbe de la zone arrosée, en m (au centième)"; lb = "b) Périmètre de la zone arrosée, en m (au centième)"; lc = "c) Aire arrosée, en m² (au centième)"; }
    else if (cx === "horloge") { r = pk([6, 8, 10, 12, 15]); const m = pk([10, 15, 20, 25, 40, 45]); a = 6 * m; u = "cm";
      q = "L'aiguille des minutes d'une horloge mesure " + r + " cm. On observe son mouvement pendant " + m + " minutes.";
      la = "a) Distance parcourue par la pointe de l'aiguille, en cm (au centième)"; lb = "b) Périmètre du secteur balayé (arc et deux rayons), en cm (au centième)"; lc = "c) Aire balayée par l'aiguille, en cm² (au centième)"; }
    else { r = pk([3, 4, 5, 6, 8]); a = pk([60, 72, 120, 135, 150, 240]); u = "cm";
      q = "Une part de pizza est un secteur de disque de rayon " + r + " cm et d'angle " + a + "°.";
      la = "a) Longueur de l'arc de croûte, en cm (au centième)"; lb = "b) Périmètre total de la part, en cm (au centième)"; lc = "c) Aire de la part, en cm² (au centième)"; }
    const L = (a / 360) * 2 * Math.PI * r, A = (a / 360) * Math.PI * r * r;
    return CX(cx, PB(q, [[la, L, 0.01], [lb, L + 2 * r, 0.01], [lc, A, 0.01]],
      [(cx === "horloge" ? "En 60 minutes, l'aiguille fait un tour complet (360°) : en " + a / 6 + " minutes, elle tourne de " + a + "°. " : "") + "Le secteur représente " + a + "/360 du disque entier.", "Le périmètre du secteur : l'arc et deux rayons."],
      "Fraction du disque : " + M("\\frac{" + a + "}{360}") + ". a) " + M("\\frac{" + a + "}{360} \\cdot 2\\pi \\cdot " + N(r) + " \\approx " + N(R2(L))) + " " + u + ". b) " + M(N(R2(L)) + " + 2 \\cdot " + N(r) + " \\approx " + N(R2(L + 2 * r))) + " " + u + ". c) " + M("\\frac{" + a + "}{360} \\cdot \\pi \\cdot " + N(r) + "^2 \\approx " + N(R2(A))) + " " + u + "²."));
  });
  /* 26.11 soir (agent defis3) : 3 contextes (somme des angles donnée, kiosque dont on connaît l'angle intérieur, bassin à n côtés). */
  PX("polyreg", [10, 11], () => {
    const n = pk([5, 6, 8, 9, 10, 12, 15]), S = (n - 2) * 180, ai = S / n, ae = 360 / n, cx = pk(["somme", "kiosque", "bassin"]);
    if (cx === "kiosque") { const m = pk([5, 6, 8, 9, 10, 12]), S2 = (m - 2) * 180, ai2 = S2 / m, ae2 = 360 / m;
      return Object.assign(PB("Le toit d'un kiosque à musique repose sur un plancher en forme de polygone régulier. Chaque angle intérieur du plancher mesure " + X(ai2) + "°.",
        [["a) Mesure de l'angle au centre (en degrés)", ae2], ["b) Nombre de côtés du plancher", m], ["c) Somme des angles intérieurs (en degrés)", S2]],
        ["Angle intérieur et angle au centre sont supplémentaires : leur somme vaut 180°.", "Le tour complet (360°) est partagé en n angles au centre égaux."],
        "a) " + M("180° - " + N(ai2) + "° = " + N(ae2) + "°") + ". b) " + M("360 \\div " + N(ae2) + " = " + m) + " côtés. c) " + M("(" + m + " - 2) \\cdot 180° = " + N(S2) + "°") + "."), { ctx: cx }); }
    if (cx === "bassin") { const m = pk([5, 6, 8, 10, 12, 18, 20]), S2 = (m - 2) * 180;
      return Object.assign(PB("Le bassin d'une fontaine a la forme d'un polygone régulier à " + m + " côtés. Depuis le jet d'eau, au centre, on tend une corde vers chaque sommet.",
        [["a) Angle entre deux cordes voisines (angle au centre, en degrés)", 360 / m], ["b) Mesure d'un angle intérieur du bassin (en degrés)", S2 / m], ["c) Somme des angles intérieurs (en degrés)", S2]],
        ["Les cordes partagent le tour complet (360°) en " + m + " angles égaux.", "Chaque triangle formé est isocèle : angle intérieur = 180° − angle au centre."],
        "a) " + M("360° \\div " + m + " = " + N(360 / m) + "°") + ". b) " + M("180° - " + N(360 / m) + "° = " + N(S2 / m) + "°") + ". c) " + M(m + " \\cdot " + N(S2 / m) + "° = " + N(S2) + "°") + " (ou " + M("(" + m + " - 2) \\cdot 180°") + ")."), { ctx: cx }); }
    return Object.assign(PB("Un polygone régulier a des angles intérieurs dont la somme vaut " + X(S) + "°.",
      [["a) Nombre de côtés", n], ["b) Mesure d'un angle intérieur (en degrés)", ai], ["c) Mesure de l'angle au centre (en degrés)", ae]],
      ["Somme des angles intérieurs d'un polygone à n côtés : (n − 2) · 180°.", "L'angle au centre partage le tour complet (360°) en n parts égales."],
      "a) " + M("(n - 2) \\cdot 180 = " + N(S)) + ", donc " + M("n - 2 = " + (n - 2)) + " et " + M("n = " + n) + ". b) " + M(N(S) + " \\div " + n + " = " + N(ai) + "°") + ". c) " + M("360° \\div " + n + " = " + N(ae) + "°") + " (et " + M(N(ai) + "° + " + N(ae) + "° = 180°") + ")."), { ctx: cx });
  });
  PX("grandmanq", [10, 11], () => {
    /* 26.11 soir (agent defisch) : trapèze, champ en trapèze (semis à l'are), canal d'irrigation (section en trapèze) */
    const cx = pk(["trapeze", "champ", "canal"]);
    if (cx === "champ") { const b1 = 2 * ri(15, 30), b2 = b1 + 2 * ri(5, 20), h = ri(20, 45), A = ((b1 + b2) * h) / 2, w = pk([20, 25, 30, 40].filter((x) => A % x === 0)) || 10, p = pk([8, 12, 15]);
      return CX(cx, PB("Un champ a la forme d'un trapèze dont les côtés parallèles mesurent " + b1 + " m et " + b2 + " m. Son aire vaut " + X(A) + " m².",
        [["a) Distance entre les deux côtés parallèles (hauteur), en m", h], ["b) Longueur d'un champ rectangulaire de " + w + " m de large et de même aire, en m", A / w], ["c) Le semis coûte " + p + " CHF par are (1 are = 100 m²). Prix du semis, en CHF", (A / 100) * p]],
        ["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : isole la hauteur.", "c) Convertis l'aire en ares."],
        "a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + b1 + " + " + b2 + ") = " + h) + " m. b) " + M(N(A) + " \\div " + w + " = " + N(A / w)) + " m. c) " + M(N(A) + " \\text{ m}^2 = " + N(A / 100) + " \\text{ a}") + " ; " + M(N(A / 100) + " \\cdot " + p + " = " + N((A / 100) * p)) + " CHF.")); }
    if (cx === "canal") { const b1 = pk([1, 1.2, 1.5, 2]), b2 = r6(b1 + pk([0.8, 1, 1.2, 1.6])), h = pk([0.5, 0.6, 0.8, 0.9]), A = r6(((b1 + b2) * h) / 2), Lc = pk([50, 120, 250]);
      return CX(cx, PB("La section d'un canal d'irrigation est un trapèze : largeur " + X(b1) + " m au fond, " + X(b2) + " m en haut. L'aire de cette section vaut " + X(A) + " m² quand le canal est plein.",
        [["a) Profondeur du canal, en m", h], ["b) Volume d'eau dans " + Lc + " m de canal plein, en m³", r6(A * Lc)], ["c) Volume d'eau dans " + Lc + " m de canal plein, en litres", r6(A * Lc * 1000)]],
        ["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : ici, la hauteur est la profondeur.", "b) Le canal est un prisme : volume = aire de la section · longueur."],
        "a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + N(b1) + " + " + N(b2) + ") = " + N(h)) + " m. b) " + M(N(A) + " \\cdot " + Lc + " = " + N(r6(A * Lc))) + " m³. c) " + X(r6(A * Lc * 1000)) + " L.")); }
    const b1 = pk([6, 8, 10]), b2 = pk([12, 14, 16]), h = pk([5, 6, 7, 9]), A = ((b1 + b2) * h) / 2, w = pk([3, 4, 5, 6, 8].filter((x) => A % x === 0 && A / x !== x)) || 2;
    return CX(cx, PB("Un trapèze a des bases de " + b1 + " cm et " + b2 + " cm. Son aire vaut " + X(A) + " cm². Un rectangle de largeur " + w + " cm a la même aire.",
      [["a) Hauteur du trapèze, en cm", h], ["b) Longueur du rectangle, en cm", A / w], ["c) Côté d'un triangle rectangle isocèle de même aire (côtés de l'angle droit), en cm (au centième)", Math.sqrt(2 * A), 0.01]],
      ["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : isole la hauteur.", "c) Triangle rectangle isocèle de côté c : aire = c · c ÷ 2."],
      "a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + b1 + " + " + b2 + ") = " + h) + " cm. b) " + M(N(A) + " \\div " + w + " = " + N(A / w)) + " cm. c) " + M("c^2 = 2 \\cdot " + N(A) + " = " + N(2 * A)) + ", " + M("c = \\sqrt{" + N(2 * A) + "} \\approx " + N(Math.round(Math.sqrt(2 * A) * 100) / 100)) + " cm."));
  });
  PX("airelat", [10, 11], () => {
    const [cx, txt, ds, hs] = pk([["conserve", "Une boîte de conserve cylindrique a un diamètre de # cm et une hauteur de @ cm. L'étiquette recouvre toute la surface latérale.", [6, 8, 10, 12], [9, 11, 14, 15]],
      ["tube", "Un tube d'affiche en carton (un cylindre) a un diamètre de # cm et une longueur de @ cm. On le recouvre entièrement de papier cadeau sur sa surface latérale.", [6, 8, 10], [60, 70, 80, 100]],
      ["bidon", "Un bidon cylindrique a un diamètre de # cm et une hauteur de @ cm. On peint toute sa surface latérale.", [20, 24, 30], [30, 35, 40, 45]]]);
    const d = pk(ds), h = pk(hs), r = d / 2, AL = 2 * Math.PI * r * h, AT = AL + 2 * Math.PI * r * r, lab = cx === "conserve" ? "de l'étiquette" : cx === "tube" ? "du papier" : "peinte";
    return Object.assign(PB(txt.replace("#", d).replace("@", h),
      [["a) Aire " + lab + ", en cm² (au centième)", AL, 0.01], ["b) Aire totale (surface latérale et les deux disques), en cm² (au centième)", AT, 0.01], ["c) Déroulée, la surface latérale est un rectangle : sa longueur, en cm (au centième)", Math.PI * d, 0.01]],
      ["Déroulée, la surface latérale est un rectangle : sa longueur est le périmètre du disque, sa largeur la hauteur.", "Aire d'un disque : π · r² ; attention, r = " + r + " cm."],
      "c) Longueur : " + M("\\pi \\cdot " + d + " \\approx " + N(Math.round(Math.PI * d * 100) / 100)) + " cm. a) " + M("\\pi \\cdot " + d + " \\cdot " + h + " \\approx " + N(Math.round(AL * 100) / 100)) + " cm². b) " + M(N(Math.round(AL * 100) / 100) + " + 2 \\cdot \\pi \\cdot " + r + "^2 \\approx " + N(Math.round(AT * 100) / 100)) + " cm²."), { ctx: cx });
  });
  PX("voldecomp", [10, 11], () => {
    /* 26.11 soir (agent defisch) : piscine à deux profondeurs, escalier en béton, plate-bande en L */
    const cx = pk(["piscine", "escalier", "platebande"]);
    if (cx === "escalier") { const n = pk([3, 4, 5]), w = pk([1, 1.2, 1.5]), h = pk([0.15, 0.18, 0.2]), V = r6(w * 0.3 * h * ((n * (n + 1)) / 2)), m = r6(V * 2400), s = Math.ceil(m / 40 - 1e-9);
      return CX(cx, PB("Un escalier extérieur en béton plein a " + n + " marches. Vu de côté, il est formé de colonnes de blocs : 1 bloc devant, puis 2, puis 3, … jusqu'à " + n + " au fond. Chaque bloc est un pavé de " + X(w) + " m de large, 30 cm de profondeur et " + X(h * 100) + " cm de haut.",
        [["a) Volume de béton, en m³", V], ["b) Masse de l'escalier, en kg (1 m³ de béton pèse 2'400 kg)", m], ["c) Combien de sacs de béton de 40 kg faut-il au minimum ?", s]],
        ["Compte d'abord les blocs : 1 + 2 + … + " + n + ".", "Chaque bloc mesure " + N(w) + " m · 0,3 m · " + N(h) + " m."],
        "a) Blocs : " + M(Array.from({ length: n }, (_, i) => i + 1).join(" + ") + " = " + (n * (n + 1)) / 2) + " ; " + M((n * (n + 1)) / 2 + " \\cdot " + N(w) + " \\cdot 0{,}3 \\cdot " + N(h) + " = " + N(V)) + " m³. b) " + M(N(V) + " \\cdot 2\\text{'}400 = " + N(m)) + " kg. c) " + M(N(m) + " \\div 40 \\approx " + N(Math.floor((m / 40) * 100) / 100)) + " : " + s + " sacs.")); }
    if (cx === "platebande") { const a = pk([3, 4, 5]), b = pk([0.8, 1, 1.2]), c = pk([2, 2.5, 3]), h = pk([0.3, 0.4, 0.5]), V = r6((a * b + (c - b) * b) * h), sac = pk([40, 50]), ns = Math.ceil((V * 1000) / sac - 1e-9);
      return CX(cx, PB("Une plate-bande surélevée en forme de L est formée de deux bacs pavés accolés, de " + X(h) + " m de haut : l'un de " + X(a) + " m sur " + X(b) + " m, l'autre de " + X(r6(c - b)) + " m sur " + X(b) + " m. On la remplit de terre, vendue en sacs de " + sac + " L.",
        [["a) Volume de terre, en m³", V], ["b) Ce volume, en litres", r6(V * 1000)], ["c) Combien de sacs faut-il au minimum ?", ns]],
        ["Calcule le volume de chaque bac, puis additionne.", "1 m³ = 1'000 L ; un sac entamé compte."],
        "a) " + M(N(a) + " \\cdot " + N(b) + " \\cdot " + N(h) + " + " + N(r6(c - b)) + " \\cdot " + N(b) + " \\cdot " + N(h) + " = " + N(V)) + " m³. b) " + X(r6(V * 1000)) + " L. c) " + M(N(r6(V * 1000)) + " \\div " + sac + " \\approx " + N(Math.floor(((V * 1000) / sac) * 100) / 100)) + " : " + ns + " sacs.")); }
    const L = pk([8, 10, 12]), l = pk([4, 5, 6]), h1 = pk([1.2, 1.5, 1.8]), h2 = pk([2.2, 2.5, 3]), V = r6(L * l * h1 + (L / 2) * l * (h2 - h1)), t = pk([20, 25, 40]);
    return CX(cx, PB("Une piscine a la forme d'un pavé de " + L + " m sur " + l + " m. Sur la moitié de sa longueur, la profondeur est de " + X(h1) + " m ; sur l'autre moitié, elle est de " + X(h2) + " m (deux pavés accolés).",
      [["a) Volume d'eau quand elle est pleine, en m³", V], ["b) Ce volume en litres", V * 1000], ["c) On la remplit avec un débit de " + t + " m³ par heure : durée en heures (au dixième)", Math.round(+((V / t) * 10).toPrecision(12)) / 10, 0.1] /* 26.11 soir (recalcul) : 1,95 acceptait 1,9 et 2 */],
      ["Découpe en deux pavés : chacun mesure " + L / 2 + " m sur " + l + " m.", "1 m³ = 1'000 L."],
      "a) " + M(N(L / 2) + " \\cdot " + l + " \\cdot " + N(h1) + " + " + N(L / 2) + " \\cdot " + l + " \\cdot " + N(h2) + " = " + N(r6((L / 2) * l * h1)) + " + " + N(r6((L / 2) * l * h2)) + " = " + N(r6((L / 2) * l * (h1 + h2)))) + " m³. b) " + X(r6((L / 2) * l * (h1 + h2) * 1000)) + " L. c) " + M(N(r6((L / 2) * l * (h1 + h2))) + " \\div " + t + " \\approx " + N(Math.round(((L / 2) * l * (h1 + h2) / t) * 10) / 10)) + " h."));
  });
  PX("eqverif", [10, 11], () => {
    /* 26.11 soir (agent defisch) : équation et nombres proposés, rectangle (largeur), nombre pensé */
    const cx = pk(["equation", "rectangle", "pense"]);
    const shuf = (L) => L.map((v) => [R.rand(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
    if (cx === "rectangle") { let r, d, c; do { r = ri(3, 9); d = ri(2, 7); c = shuf([r, -(r + d), r + 1, d, r + d]); } while (new Set(c).size < 5);
      const A = r * (r + d), ok = c.filter((x) => x * (x + d) === A);
      return CX(cx, PB("Un rectangle a une largeur de " + M("x") + " cm et une longueur de " + M("x + " + d) + " cm. Son aire vaut " + X(A) + " cm². On propose pour " + M("x") + " les nombres " + c.map(X).join(" ; ") + ".",
        [["a) Combien de ces nombres sont solutions de l'équation " + M("x(x + " + d + ") = " + A) + " ?", ok.length], ["b) Lequel de ces nombres est la largeur du rectangle, en cm ?", r], ["c) Périmètre du rectangle, en cm", 2 * (2 * r + d)]],
        ["Remplace x par chaque nombre dans x(x + " + d + ") et compare à " + A + ".", "b) Une largeur est positive : parmi les solutions, garde celle qui a un sens."],
        c.map((x) => M("x = " + x) + " : " + M(N(x * (x + d)) + (x * (x + d) === A ? " = " : " \\neq ") + A)).join(" ; ") + ". a) " + ok.length + ". b) " + r + " cm (l'autre solution est négative). c) " + M("2 \\cdot (" + r + " + " + (r + d) + ") = " + 2 * (2 * r + d)) + " cm.")); }
    if (cx === "pense") { let a, b, c; do { a = ri(4, 9); b = ri(2, a - 1); c = shuf([a, b, -a, a - b, -b]); } while (new Set(c).size < 5 || a - b < 2);
      const s = a - b, p = a * b, ok = c.filter((x) => x * x - p === s * x), z = pk([s + 1, s + 2, s + 3, s + 4, s + 5].filter((t) => t !== a)), k = z * z - s * z, nm = pk(["Lina", "Mia", "Zoé", "Nora"]);
      return CX(cx, PB(nm + " pense à un nombre entier. Le carré de ce nombre, diminué de " + p + ", est égal à " + s + " fois ce nombre. Elle propose à son frère les nombres " + c.map(X).join(" ; ") + ".",
        [["a) Combien de ces nombres vérifient " + M("x^2 - " + p + " = " + s + "x") + " ?", ok.length], ["b) " + nm + " précise que son nombre est positif. Lequel est-ce ?", a], ["c) Pour quelle valeur de " + M("k") + " le nombre " + z + " vérifie-t-il " + M("x^2 - k = " + s + "x") + " ?", k]],
        ["Remplace x par chaque nombre : calcule le membre de gauche, puis celui de droite, et compare.", "c) Remplace x par " + z + " : il reste une équation en k."],
        c.map((x) => M("x = " + x) + " : " + M(N(x * x - p) + (x * x - p === s * x ? " = " : " \\neq ") + N(s * x))).join(" ; ") + ". a) " + ok.length + ". b) " + a + ". c) " + M(z + "^2 - k = " + s + " \\cdot " + z) + ", donc " + M("k = " + z * z + " - " + s * z + " = " + k) + ".")); }
    let a, b; do { a = ri(2, 9); b = ri(2, 9); } while (a === b);
    const s = a + b, p = a * b, cands = [a, b, s, -a, p > 30 ? b + 1 : p].sort(() => R.rand() - 0.5), ok = cands.filter((x) => x * x + p === s * x);
    const c = ri(2, 5);
    return CX(cx, PB("On considère l'équation " + M("x^2 + " + p + " = " + s + "x") + " et les nombres " + cands.map(X).join(" ; ") + ".",
      [["a) Combien de ces nombres sont solutions ?", ok.length], ["b) La somme des solutions trouvées", ok.reduce((t, x) => t + x, 0)], ["c) Pour quelle valeur de " + M("k") + " le nombre " + c + " est-il solution de " + M("x^2 + k = " + s + "x") + " ?", s * c - c * c]],
      ["Remplace x par chaque nombre, calcule les deux membres séparément, et compare.", "c) Remplace x par " + c + " : il reste une équation en k."],
      cands.map((x) => M("x = " + x) + " : " + M(N(x * x + p) + (x * x + p === s * x ? " = " : " \\neq ") + N(s * x))).join(" ; ") + ". a) " + ok.length + ". b) " + ok.reduce((t, x) => t + x, 0) + ". c) " + M(c + "^2 + k = " + s + " \\cdot " + c) + ", donc " + M("k = " + s * c + " - " + c * c + " = " + (s * c - c * c)) + "."));
  });
  PX("pente", [10, 11], () => {
    /* 26.11 soir (agent defisch) : route de montagne, rampe pour fauteuil roulant (6 % au plus), funiculaire */
    const cx = pk(["route", "rampe", "funiculaire"]);
    if (cx === "rampe") { const h = pk([12, 15, 18, 24, 30]), Lr = pk([1.5, 2, 2.5, 4].filter((x) => h / x !== 6)), L2 = pk([3, 4.5, 6]);
      return CX(cx, PB("Pour qu'une personne en fauteuil roulant puisse l'utiliser seule, une rampe d'accès doit avoir une pente de 6 % au plus. Il faut franchir une marche de " + h + " cm.",
        [["a) Longueur horizontale minimale de la rampe, en m", h / 6], ["b) Avec une rampe de " + X(Lr) + " m de longueur horizontale, quelle serait la pente, en % ?", h / Lr], ["c) Avec une pente de 6 %, quel dénivelé (en cm) franchit-on sur " + X(L2) + " m de longueur horizontale ?", r6(6 * L2)]],
        ["Pente en % = dénivelé ÷ longueur horizontale · 100 (mêmes unités).", "a) Isole la longueur horizontale : " + h + " cm ÷ 0,06."],
        "a) " + M(h + " \\div 0{,}06 = " + N(r6(h / 0.06))) + " cm = " + X(h / 6) + " m. b) " + M(h + " \\div " + N(Lr * 100) + " \\cdot 100 = " + N(h / Lr)) + " %. c) " + M("0{,}06 \\cdot " + N(L2 * 100) + " = " + N(r6(6 * L2))) + " cm.")); }
    if (cx === "funiculaire") { const p = pk([30, 40, 45, 50, 60]), d = pk([400, 500, 800, 1200]), q = pk([35, 55, 62, 70].filter((x) => x !== p)), d2 = pk([200, 300, 500]), D = (q * d2) / 100;
      return CX(cx, PB("Un funiculaire monte avec une pente moyenne de " + p + " % sur une distance horizontale de " + X(d) + " m. Plus haut, un deuxième tronçon s'élève de " + X(D) + " m sur " + X(d2) + " m de distance horizontale.",
        [["a) Dénivelé du premier tronçon, en m", (p * d) / 100], ["b) Distance horizontale nécessaire pour monter de 100 m avec la pente du premier tronçon, en m (au dixième)", 10000 / p, 0.1], ["c) Pente du deuxième tronçon, en %", q]],
        ["Pente en % = dénivelé ÷ distance horizontale · 100.", "b) Distance horizontale = dénivelé ÷ pente · 100."],
        "a) " + M(N(p / 100) + " \\cdot " + N(d) + " = " + N((p * d) / 100)) + " m. b) " + M("100 \\div " + N(p / 100) + " \\approx " + N(Math.round((10000 / p) * 10) / 10)) + " m. c) " + M(N(D) + " \\div " + N(d2) + " \\cdot 100 = " + q) + " %.")); }
    const p = pk([8, 12, 15, 18, 24]), d = pk([250, 400, 600, 750]), dh = r6((p / 100) * d), t = pk([10, 12, 15]);
    return CX(cx, PB("Une route de montagne a une pente constante de " + p + " %. Elle franchit une distance horizontale de " + X(d) + " m. Un panneau prévient : « dénivelé de " + t + " % sur la descente suivante ».",
      [["a) Dénivelé de cette route, en m", dh], ["b) Distance horizontale pour monter de 100 m avec cette pente, en m (au dixième)", 10000 / p, 0.1], ["c) Sur la descente à " + t + " %, quelle distance horizontale pour descendre de " + X(dh) + " m ?", r6((dh * 100) / t), 0.1]],
      ["Pente en % = dénivelé ÷ distance horizontale · 100.", "b) et c) Isole la distance horizontale : dénivelé ÷ pente · 100."],
      "a) " + M(N(p / 100) + " \\cdot " + N(d) + " = " + N(dh)) + " m. b) " + M("100 \\div " + N(p / 100) + " \\approx " + N(Math.round((10000 / p) * 10) / 10)) + " m. c) " + M(N(dh) + " \\div " + N(t / 100) + " = " + N(r6((dh * 100) / t))) + " m."));
  });
  PX("rotation", [10, 11], () => {
    /* 26.11 soir (agent defisch) : repère, robot sur un quadrillage, logiciel de dessin (pixels) */
    const cx = pk(["repere", "robot", "dessin"]);
    let x, y, cx0, cy; do { x = ri(-5, 5); y = ri(-5, 5); cx0 = ri(-2, 2); cy = ri(-2, 2); } while (!x || !y || (x === cx0 && y === cy) || Math.abs(x) === Math.abs(y));
    const k = cx === "dessin" ? pk([10, 20, 50]) : 1, S = (v) => v * k, P2 = (a, b) => pt(S(a), S(b));
    const r90 = [-y, x], r180 = [-x, -y], u = x - cx0, v = y - cy, rc = [cx0 - v, cy + u];
    const q = cx === "robot" ? "Un robot aspirateur est posé sur un sol quadrillé, repéré par un repère (unité : une dalle). Il se trouve en " + M("A") + P2(x, y) + ". Le bras de la station de charge le fait tourner dans le sens inverse des aiguilles d'une montre."
      : cx === "dessin" ? "Dans un logiciel de dessin, l'écran est repéré en pixels, l'origine " + M("O") + " au centre. Un sommet d'une figure est en " + M("A") + P2(x, y) + ". L'outil « rotation » tourne dans le sens inverse des aiguilles d'une montre."
      : "Dans un repère, on considère le point " + M("A") + P2(x, y) + ". Les rotations tournent dans le sens inverse des aiguilles d'une montre.";
    return CX(cx, PB(q,
      [["a) Image de " + M("A") + " par la rotation de centre " + M("O(0\\,;\\,0)") + " et d'angle 90°" + PAIRL, [S(r90[0]), S(r90[1])]], ["b) Image de " + M("A") + " par la rotation de centre " + M("O") + " et d'angle 180°" + PAIRL, [S(r180[0]), S(r180[1])]], ["c) Image de " + M("A") + " par la rotation de centre " + M("C") + P2(cx0, cy) + " et d'angle 90°" + PAIRL, [S(rc[0]), S(rc[1])]]],
      ["Rotation de 90° autour de l'origine : (x ; y) devient (−y ; x). Fais un dessin pour vérifier.", "c) Travaille avec le déplacement de C vers A, fais-le tourner de 90°, puis repars de C."],
      "a) " + P2(r90[0], r90[1]) + ". b) " + P2(r180[0], r180[1]) + " (symétrie de centre O). c) De C à A : " + M("(" + S(u) + "\\,;\\," + S(v) + ")") + " ; tourné de 90° : " + M("(" + S(-v) + "\\,;\\," + S(u) + ")") + " ; image : " + P2(rc[0], rc[1]) + "."));
  });
})();
