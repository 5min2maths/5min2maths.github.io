// Chantier 11e · 2. Pythagore et 3. 3D (17.11, plan de cheminement de 11e, début d'année) : une seule source pour
// pyth, pythfig, pythrec (Pythagore) et vol, volcone, airepyr, volcomp, volmanq (volumes et aires).
// Même standard que ch11_prop.js / ch11_no.js : au moins 3 formes par niveau, pas à pas sur toutes les questions,
// erreurs typiques, ctx ; défis en plusieurs étapes. Formes modelées sur des dossiers de 11e (valeurs exactes a√b,
// distance dans un repère, carré inscrit dans un cercle, pyramide du Louvre, pyramide inscrite dans un cube, gélule,
// variations de volume, isoler une dimension), jamais recopiées. Réponses exactes : a√b (racine simplifiée) ou kπ.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r12 = (v) => +(+v).toPrecision(12);
  const N = (v) => { v = r12(v); let [i, f] = String(Math.abs(v)).split("."); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return (v < 0 ? "-" : "") + i + (f ? "{,}" + f : ""); };
  const T = (v) => M(N(v));
  const rd = (v, s) => Math.round(v / s) * s;
  const cm = (v, un = "cm") => M(N(v) + "\\ \\text{" + un + "}");
  // ---------- racines : n = k²·m ----------
  const simp = (n) => { let k = 1, m = n; for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return [k, m]; };
  const rT = (k, m) => (m === 1 ? String(k) : (k === 1 ? "" : k) + "\\sqrt{" + m + "}");
  const rC = (k, m) => (m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m);
  const piT = (k) => (k === 1 ? "" : N(k)) + "\\pi";
  // ---------- constructeurs ----------
  const keep = (value, traps, round) => { const seen = new Set(); return (traps || []).filter((t) => { if (!t || !isFinite(t.v) || Math.abs(t.v - value) <= Math.max(round || 0, 1e-9 * Math.max(1, Math.abs(value)))) return false; const k = r12(t.v); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const Qv = (q, value, sol, o = {}) => {
    const spec = Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}, o.radical ? { radical: true } : {});
    const x = { q, spec, sol, guide: o.guide, traps: keep(value, o.traps, o.round), ctx: o.ctx };
    if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon;
    return x;
  };
  const GSR = (ask, value, sol) => ({ ask, spec: { kind: "value", value, radical: true }, sol });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20], [9, 40, 41], [15, 20, 25]];
  const trip = (maxC = 41) => pk(TRIP.filter((t) => t[2] <= maxC));
  const EXA = " (valeur exacte : écris par exemple " + M("3\\sqrt{5}") + ")";
  const PIX = " (valeur exacte avec " + M("\\pi") + ", par exemple " + M("12\\pi") + ")";
  // Figures
  const RT = (a, b, la, lb, lc, names) => GF.rightTri(a, b, { la, lb, lc, ...(names ? { names } : {}) });

  // ===================== pyth : théorème de Pythagore =====================
  const radHyp = () => { let a, b, n; do { a = R.int(1, 9); b = R.int(2, 9); n = a * a + b * b; } while (a >= b || Number.isInteger(Math.sqrt(n)) || simp(n)[0] === 1 && R.rand() < 0.5); return [a, b, n]; };
  const radCat = () => { let c, a, n; do { c = R.int(4, 12); a = R.int(1, c - 1); n = c * c - a * a; } while (Number.isInteger(Math.sqrt(n)) || simp(n)[0] === 1 && R.rand() < 0.5); return [c, a, n]; };
  const PYTH = {
    1: [
      () => { const [a, b, c] = trip(), k = pk([1, 1, 2, 0.5]), [A, B, C] = [a * k, b * k, c * k];
        return Qv("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("BC = " + N(A)) + " cm et " + M("AC = " + N(B)) + " cm. Calcule " + M("AB") + " (en cm).", C, M("AB^2 = " + N(A) + "^2 + " + N(B) + "^2 = " + N(A * A) + " + " + N(B * B) + " = " + N(C * C)) + ", donc " + M("AB = " + N(C)) + " cm.",
          { ctx: "hyp", fig: RT(A, B, N(A) + " cm", N(B) + " cm", "?"), guide: [GS(M(N(A) + "^2") + " = ?", A * A, M(N(A * A)) + "."), GS(M(N(B) + "^2") + " = ?", B * B, M(N(B * B)) + "."), GS(M("AB^2") + " est la somme : " + M("AB^2") + " = ?", C * C, M(N(C * C)) + "."), GS("Racine carrée : " + M("AB") + " = ?", C, M("\\sqrt{" + N(C * C) + "} = " + N(C)) + ".")],
            traps: [TR(A + B, "On n'additionne pas les côtés : on additionne leurs carrés, puis on prend la racine."), TR(C * C, "C'est " + M("AB^2") + " : il manque la racine carrée.")] }); },
      () => { const [a, b, c] = trip(), k = pk([1, 1, 2]), [A, B, C] = [a * k, b * k, c * k];
        return Qv("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AB = " + C) + " cm et " + M("BC = " + A) + " cm. Calcule " + M("AC") + " (en cm).", B, M("AC^2 = " + C + "^2 - " + A + "^2 = " + C * C + " - " + A * A + " = " + B * B) + ", donc " + M("AC = " + B) + " cm.",
          { ctx: "cath", fig: RT(A, B, A + " cm", "?", C + " cm"), guide: [GS("L'hypoténuse est " + M("AB") + " (en face de l'angle droit). " + M(C + "^2") + " = ?", C * C, M(C * C) + "."), GS(M(A + "^2") + " = ?", A * A, M(A * A) + "."), GS("Pour une cathète, on soustrait : " + M("AC^2") + " = ?", B * B, M(C * C + " - " + A * A + " = " + B * B) + "."), GS(M("AC") + " = ?", B, M("\\sqrt{" + B * B + "} = " + B) + ".")],
            traps: [TR(Math.sqrt(C * C + A * A), "Ici on cherche une cathète : on soustrait, " + M("AC^2 = AB^2 - BC^2") + "."), TR(B * B, "C'est " + M("AC^2") + " : prends la racine."), TR(C - A, "On ne soustrait pas les longueurs, mais leurs carrés.")] }); },
      () => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [1.2, 1.6, 2], [1.5, 2, 2.5], [1.8, 2.4, 3], [2.4, 3.2, 4], [0.9, 1.2, 1.5], [2.1, 2.8, 3.5]]), x = pk([
          ["Une échelle de " + cm(c, "m") + " est appuyée contre un mur vertical. Son pied est à " + cm(a, "m") + " du mur. À quelle hauteur l'échelle touche-t-elle le mur (en m) ?", "echelle"],
          ["Un cerf-volant est retenu par une ficelle tendue de " + cm(c * 10, "m") + ". Il se trouve exactement au-dessus d'un arbre situé à " + cm(a * 10, "m") + " de l'enfant. À quelle hauteur vole-t-il (en m, sans compter la taille de l'enfant) ?", "cerfvolant"],
          ["Un mât vertical est tenu par un câble de " + cm(c, "m") + " fixé au sol à " + cm(a, "m") + " du pied du mât. À quelle hauteur le câble est-il attaché (en m) ?", "mat"]]);
        const f = x[1] === "cerfvolant" ? 10 : 1, C = c * f, A = a * f, B = r12(b * f);
        return Qv(x[0], B, "Triangle rectangle d'hypoténuse " + T(C) + " : " + M("h^2 = " + N(C) + "^2 - " + N(A) + "^2 = " + N(r12(C * C - A * A))) + ", donc " + M("h = " + N(B)) + " m.",
          { ctx: x[1], guide: [GS("L'hypoténuse est " + (x[1] === "echelle" ? "l'échelle" : x[1] === "mat" ? "le câble" : "la ficelle") + " : " + M(N(C) + "^2") + " = ?", r12(C * C), M(N(r12(C * C))) + "."), GS(M("h^2 = " + N(r12(C * C)) + " - " + N(r12(A * A))) + " = ?", r12(C * C - A * A), M(N(r12(C * C - A * A))) + "."), GS(M("h") + " = ?", B, M(N(B)) + " m.")],
            traps: [TR(Math.sqrt(C * C + A * A), "La longueur la plus grande est l'hypoténuse : on cherche une cathète, on soustrait."), TR(C - A, "On soustrait les carrés, pas les longueurs.")] }); },
    ],
    2: [
      () => { const [a, b, n] = radHyp(), [k, m] = simp(n);
        return Qv("Le triangle " + M("DEF") + " est rectangle en " + M("F") + ", avec " + M("DF = " + a) + " cm et " + M("EF = " + b) + " cm. Calcule " + M("DE") + EXA + ".", k * Math.sqrt(m), M("DE^2 = " + a * a + " + " + b * b + " = " + n) + ", donc " + M("DE = \\sqrt{" + n + "}" + (k > 1 ? " = " + rT(k, m) : "")) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "hyp-exact", fig: RT(b, a, b + " cm", a + " cm", "?", ["F", "E", "D"]), guide: [GS(M("DE^2 = " + a + "^2 + " + b + "^2") + " = ?", n, M(n) + "."), ...(k > 1 ? [GS("Le plus grand carré qui divise " + M(n) + " ?", k * k, M(n + " = " + k * k + " \\cdot " + m) + ".")] : []), GSR(M("DE = \\sqrt{" + n + "}") + (k > 1 ? " : simplifie" : "") + ".", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(a + b, "On additionne les carrés, pas les côtés."), TR(n, "C'est " + M("DE^2") + " : prends la racine.")] }); },
      () => { const [c, a, n] = radCat(), [k, m] = simp(n);
        return Qv("Le triangle " + M("RST") + " est rectangle en " + M("S") + ", avec " + M("RT = " + c) + " cm et " + M("RS = " + a) + " cm. Calcule " + M("ST") + EXA + ".", k * Math.sqrt(m), M("ST^2 = " + c * c + " - " + a * a + " = " + n) + ", donc " + M("ST = " + (k > 1 ? "\\sqrt{" + n + "} = " : "") + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "cath-exact", guide: [GS("L'hypoténuse est " + M("RT") + ". " + M("ST^2 = " + c + "^2 - " + a + "^2") + " = ?", n, M(n) + "."), GSR(M("ST = \\sqrt{" + n + "}") + (k > 1 ? " : simplifie" : "") + ".", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(Math.sqrt(c * c + a * a), M("RT") + " est l'hypoténuse : on soustrait."), TR(n, "C'est " + M("ST^2") + ".")] }); },
      () => { const a = pk([30, 40, 45, 60, 80, 50]), b = pk([25, 35, 55, 70, 90, 65]), d = Math.sqrt(a * a + b * b), g = a + b - d, x = pk([["Pour traverser un parc rectangulaire de " + a + " m sur " + b + " m, Léo coupe en diagonale au lieu de longer deux côtés.", "parc"], ["Un terrain de football improvisé mesure " + a + " m sur " + b + " m. Zoé va d'un coin au coin opposé en diagonale plutôt que par les bords.", "terrain"]]);
        return Qv(x[0] + " Combien de mètres économise-t-il" + (x[1] === "terrain" ? " (elle)" : "") + " ? (arrondi au dixième)", g, "Diagonale : " + M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + N(rd(d, 0.01))) + " m ; économie : " + M(a + b + " - " + N(rd(d, 0.01)) + " \\approx " + N(rd(g, 0.1))) + " m.",
          { round: 0.1, ctx: x[1], guide: [GS("Longueur du chemin par les bords ?", a + b, M(a + " + " + b + " = " + (a + b)) + " m."), GS("Longueur de la diagonale (au centième) ?", d, M("\\sqrt{" + (a * a + b * b) + "} \\approx " + N(rd(d, 0.01))) + " m.", 0.01), GS("Économie (au dixième) ?", g, M(N(rd(g, 0.1))) + " m.", 0.1)],
            traps: [TR(d, "C'est la longueur de la diagonale ; on demande la différence avec le chemin par les bords."), TR(a + b, "C'est le chemin par les bords.")] }); },
      () => { let x1, y1, x2, y2, n; do { x1 = R.int(-5, 5); y1 = R.int(-5, 5); x2 = R.int(-5, 6); y2 = R.int(-5, 6); n = (x2 - x1) ** 2 + (y2 - y1) ** 2; } while (x1 === x2 || y1 === y2 || Number.isInteger(Math.sqrt(n)) && R.rand() < 0.6);
        const [k, m] = simp(n), dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
        return Qv("Dans un repère orthonormé (unité : 1 cm), " + M("A(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + ". Calcule la distance " + M("AB") + EXA + ".", k * Math.sqrt(m), "Écart horizontal " + M(dx) + ", écart vertical " + M(dy) + " : " + M("AB^2 = " + dx + "^2 + " + dy + "^2 = " + n) + ", donc " + M("AB = " + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "repere", guide: [GS("Écart horizontal entre " + M("A") + " et " + M("B") + " (différence des abscisses, positive) ?", dx, M("|" + x2 + " - " + (x1 < 0 ? "(" + x1 + ")" : x1) + "| = " + dx) + "."), GS("Écart vertical ?", dy, M(dy) + "."), GS(M("AB^2 = " + dx + "^2 + " + dy + "^2") + " = ?", n, M(n) + "."), GSR(M("AB") + " = ?", k * Math.sqrt(m), M(rT(k, m)) + ".")],
            traps: [TR(dx + dy, "On additionne les carrés des écarts, puis on prend la racine."), TR(Math.sqrt((x2 + x1) ** 2 + (y2 + y1) ** 2), "Les écarts sont des différences de coordonnées, pas des sommes.")] }); },
    ],
    3: [
      () => { const c = pk([4, 6, 8, 10, 12, 14]), k = c / 2;
        return Qv("Un triangle rectangle isocèle a une hypoténuse de " + M(c) + " cm. Calcule la longueur de ses cathètes" + EXA + ".", k * Math.SQRT2, "Cathètes égales : " + M("2x^2 = " + c * c) + ", " + M("x^2 = " + c * c / 2) + ", donc " + M("x = \\sqrt{" + c * c / 2 + "} = " + rT(...simp(c * c / 2))) + " cm.",
          { radical: true, canon: rC(...simp(c * c / 2)), ctx: "isorect", guide: [GS("Les deux cathètes valent " + M("x") + " : " + M("x^2 + x^2 = " + c + "^2") + ". Combien vaut " + M("x^2") + " ?", c * c / 2, M("2x^2 = " + c * c) + ", donc " + M("x^2 = " + c * c / 2) + "."), GSR(M("x") + " = ? (simplifie la racine)", k * Math.SQRT2, M(rT(...simp(c * c / 2))) + " cm.")],
            traps: [TR(c / 2, "Les cathètes ne valent pas la moitié de l'hypoténuse : " + M("x^2 + x^2 = " + c + "^2") + "."), TR(c * c / 2, "C'est " + M("x^2") + ".")] }); },
      () => { const r = pk([3, 4, 5, 6, 7, 2.5]), A = 2 * r * r;
        return Qv("Un carré " + M("ABCD") + " est inscrit dans un cercle de rayon " + cm(r) + ". Calcule l'aire du carré (en cm²).", A, "La diagonale du carré est un diamètre : " + M(N(2 * r)) + " cm. Côté " + M("c") + " : " + M("c^2 + c^2 = " + N(2 * r) + "^2") + ", donc l'aire " + M("c^2 = " + N(4 * r * r) + " : 2 = " + N(A)) + " cm².",
          { ctx: "carrecercle", guide: [GS("La diagonale du carré est un diamètre du cercle. Sa longueur ?", 2 * r, M(N(2 * r)) + " cm."), GS("Pythagore dans un demi-carré : " + M("c^2 + c^2 = " + N(2 * r) + "^2") + ". Combien vaut " + M("2c^2") + " ?", 4 * r * r, M(N(4 * r * r)) + "."), GS("L'aire du carré est " + M("c^2") + " : combien ?", A, M(N(A)) + " cm².")],
            traps: [TR(4 * r * r, "C'est " + M("2c^2") + " ; l'aire vaut " + M("c^2") + ", la moitié."), TR(r * r, "Le côté du carré n'est pas le rayon : c'est la diagonale qui vaut " + M("2r") + "."), TR(Math.PI * r * r, "On demande l'aire du carré, pas celle du disque.")] }); },
      () => { const h = pk([0.8, 1.2, 0.9, 1.5, 0.6]), d = pk([6, 8, 10, 12, 9]), L = Math.sqrt(h * h + d * d), x = pk([["Une rampe d'accès pour fauteuils roulants monte de " + cm(h, "m") + " sur une distance horizontale de " + cm(d, "m") + ".", "rampe"], ["Un toboggan droit descend de " + cm(h * 2, "m") + " sur une distance horizontale de " + cm(d / 2, "m") + ".", "toboggan"]]);
        const H = x[1] === "toboggan" ? h * 2 : h, D = x[1] === "toboggan" ? d / 2 : d, LL = Math.sqrt(H * H + D * D);
        return Qv(x[0] + " Quelle est la longueur de la pente (en m, arrondie au centième) ?", LL, M("\\sqrt{" + N(D) + "^2 + " + N(H) + "^2} = \\sqrt{" + N(r12(D * D + H * H)) + "} \\approx " + N(rd(LL, 0.01))) + " m.",
          { round: 0.01, ctx: x[1], guide: [GS("La pente est l'hypoténuse. " + M(N(D) + "^2 + " + N(H) + "^2") + " = ?", r12(D * D + H * H), M(N(r12(D * D + H * H))) + "."), GS("Racine carrée, arrondie au centième ?", LL, M(N(rd(LL, 0.01))) + " m.", 0.01)],
            traps: [TR(D + H, "On additionne les carrés, puis on prend la racine."), TR(Math.sqrt(Math.abs(D * D - H * H)), "La pente est l'hypoténuse : on additionne les carrés.")] }); },
      () => { const [a, b, c] = trip(30), k = pk([1, 2, 3]);
        return Qv("Un triangle rectangle a des cathètes de " + M(a * k) + " cm et " + M(b * k) + " cm. Calcule son périmètre (en cm).", (a + b + c) * k, "Hypoténuse : " + M("\\sqrt{" + a * k + "^2 + " + b * k + "^2} = " + c * k) + " ; périmètre : " + M(a * k + " + " + b * k + " + " + c * k + " = " + (a + b + c) * k) + " cm.",
          { ctx: "perimetre", fig: RT(b * k, a * k, b * k + " cm", a * k + " cm", "", false), guide: [GS("Il manque l'hypoténuse : " + M(a * k + "^2 + " + b * k + "^2") + " = ?", (c * k) ** 2, M((c * k) ** 2) + "."), GS("Hypoténuse ?", c * k, M(c * k) + " cm."), GS("Périmètre ?", (a + b + c) * k, M((a + b + c) * k) + " cm.")],
            traps: [TR((a + b) * k, "Le périmètre compte les trois côtés : calcule d'abord l'hypoténuse."), TR(a * b * k * k / 2, "C'est l'aire ; on demande le périmètre.")] }); },
    ],
  };

  // ===================== pythfig : Pythagore dans une figure, dans l'espace =====================
  const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [2, 4, 4, 6], [4, 6, 12, 14], [3, 6, 6, 9], [4, 8, 8, 12]];
  const PFIG = {
    1: [
      () => { const [a, b, c] = trip(), k = pk([1, 2]), x = pk([["Un rectangle mesure " + M(b * k) + " cm sur " + M(a * k) + " cm. Calcule la longueur de sa diagonale (en cm).", "rect"], ["Un écran rectangulaire mesure " + M(b * k) + " cm de large et " + M(a * k) + " cm de haut. Calcule sa diagonale (en cm).", "ecran"], ["Un portail rectangulaire de " + M(b * k) + " dm sur " + M(a * k) + " dm est renforcé par une barre en diagonale. Quelle est la longueur de la barre (en dm) ?", "portail"]]);
        return Qv(x[0], c * k, "La diagonale coupe le rectangle en deux triangles rectangles : " + M("d^2 = " + b * k + "^2 + " + a * k + "^2 = " + (c * k) ** 2) + ", " + M("d = " + c * k) + ".",
          { ctx: x[1], fig: GF.rect(b, a, { lw: b * k + "", lh: a * k + "", diag: "?" }), guide: [GS("Le triangle rectangle : les deux côtés du rectangle et la diagonale. " + M(b * k + "^2 + " + a * k + "^2") + " = ?", (c * k) ** 2, M((c * k) ** 2) + "."), GS("Diagonale ?", c * k, M(c * k) + ".")],
            traps: [TR((a + b) * k, "On additionne les carrés des côtés, puis on prend la racine.")] }); },
      () => { const s = R.int(2, 12);
        return Qv("Calcule la diagonale d'un carré de côté " + M(s) + " cm" + EXA + ".", s * Math.SQRT2, M("d^2 = " + s + "^2 + " + s + "^2 = " + 2 * s * s) + ", donc " + M("d = \\sqrt{" + 2 * s * s + "} = " + rT(s, 2)) + " cm.",
          { radical: true, canon: rC(s, 2), ctx: "carre", fig: FIG.square(s + " cm"), guide: [GS(M(s + "^2 + " + s + "^2") + " = ?", 2 * s * s, M(2 * s * s) + "."), GSR("Diagonale : " + M("\\sqrt{" + 2 * s * s + "}") + " simplifiée ?", s * Math.SQRT2, M(rT(s, 2)) + " cm.")],
            traps: [TR(2 * s, "La diagonale n'est pas le double du côté : " + M("d^2 = c^2 + c^2") + "."), TR(2 * s * s, "C'est " + M("d^2") + ".")] }); },
      () => { const [a, h, c] = trip(29);
        return Qv("Un triangle isocèle a deux côtés de " + M(c) + " cm et une base de " + M(2 * a) + " cm. Calcule la hauteur relative à la base (en cm).", h, "La hauteur coupe la base en deux segments de " + M(a) + " cm : " + M("h^2 = " + c + "^2 - " + a + "^2 = " + h * h) + ", donc " + M("h = " + h) + " cm.",
          { ctx: "isocele", fig: GF.isoH(2 * a, c, { lb: 2 * a + " cm", ls: c + " cm", lh: "h" }), guide: [GS("La hauteur coupe la base en son milieu. Demi-base ?", a, M(2 * a + " : 2 = " + a) + " cm."), GS(M("h^2 = " + c + "^2 - " + a + "^2") + " = ?", h * h, M(h * h) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")],
            traps: [TR(c > 2 * a ? Math.sqrt(c * c - 4 * a * a) : NaN, "La hauteur coupe la base en deux : on utilise la demi-base " + M(a) + "."), TR(Math.sqrt(c * c + a * a), "Le côté " + M(c) + " est l'hypoténuse : on soustrait.")] }); },
    ],
    2: [
      () => { const [a, b, c, d] = pk(QUAD);
        return Qv("Un pavé droit mesure " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm. Calcule la longueur de sa grande diagonale (d'un sommet au sommet opposé, en cm).", d, "Diagonale de la base : " + M(a + "^2 + " + b + "^2 = " + (a * a + b * b)) + " ; puis " + M("d^2 = " + (a * a + b * b) + " + " + c + "^2 = " + d * d) + ", donc " + M("d = " + d) + " cm.",
          { ctx: "pave", fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Diagonale de la base, au carré : " + M(a + "^2 + " + b + "^2") + " = ?", a * a + b * b, M(a * a + b * b) + "."), GS("Avec la hauteur : " + M("d^2 = " + (a * a + b * b) + " + " + c + "^2") + " = ?", d * d, M(d * d) + "."), GS(M("d") + " = ?", d, M(d) + " cm.")],
            traps: [TR(Math.sqrt(a * a + b * b), "C'est la diagonale de la base ; la grande diagonale monte aussi de " + M(c) + " cm."), TR(a + b + c, "On additionne les carrés : " + M("d^2 = a^2 + b^2 + c^2") + ".")] }); },
      () => { const a = R.int(2, 9);
        return Qv("Calcule la longueur de la grande diagonale d'un cube d'arête " + M(a) + " cm" + EXA + ".", a * Math.sqrt(3), M("d^2 = " + a + "^2 + " + a + "^2 + " + a + "^2 = " + 3 * a * a) + ", donc " + M("d = " + rT(a, 3)) + " cm.",
          { radical: true, canon: rC(a, 3), ctx: "cube", fig: FIG.cube(a + " cm"), guide: [GS("Diagonale d'une face, au carré : " + M(a + "^2 + " + a + "^2") + " = ?", 2 * a * a, M(2 * a * a) + "."), GS("Grande diagonale au carré : " + M(2 * a * a + " + " + a + "^2") + " = ?", 3 * a * a, M(3 * a * a) + "."), GSR(M("d") + " = ? (simplifiée)", a * Math.sqrt(3), M(rT(a, 3)) + " cm.")],
            traps: [TR(a * Math.SQRT2, "C'est la diagonale d'une face ; la grande diagonale traverse le cube."), TR(3 * a, "On additionne les carrés : " + M("d^2 = 3a^2") + ".")] }); },
      () => { const c = 2 * R.int(1, 7);
        return Qv("Calcule la hauteur d'un triangle équilatéral de côté " + M(c) + " cm" + EXA + ".", (c / 2) * Math.sqrt(3), "La hauteur coupe le côté en deux : " + M("h^2 = " + c + "^2 - " + c / 2 + "^2 = " + 3 * c * c / 4) + ", donc " + M("h = " + rT(c / 2, 3)) + " cm.",
          { radical: true, canon: rC(c / 2, 3), ctx: "equi", fig: GF.isoH(c, c, { lb: c + " cm", ls: c + " cm", lh: "h" }), guide: [GS("Demi-côté ?", c / 2, M(c / 2) + " cm."), GS(M("h^2 = " + c + "^2 - " + c / 2 + "^2") + " = ?", 3 * c * c / 4, M(3 * c * c / 4) + "."), GSR(M("h") + " = ? (simplifiée)", (c / 2) * Math.sqrt(3), M(rT(c / 2, 3)) + " cm.")],
            traps: [TR(Math.sqrt(c * c + c * c / 4), "Le côté est l'hypoténuse : on soustrait."), TR(c, "La hauteur est plus courte que le côté.")] }); },
      () => { let a, b, n; do { a = R.int(2, 9); b = R.int(2, 9); n = a * a + b * b; } while (a === b || Number.isInteger(Math.sqrt(n)));
        const [k, m] = simp(n);
        return Qv("Calcule la diagonale d'un rectangle de " + M(a) + " cm sur " + M(b) + " cm" + EXA + ".", k * Math.sqrt(m), M("d^2 = " + a + "^2 + " + b + "^2 = " + n) + ", donc " + M("d = " + (k > 1 ? "\\sqrt{" + n + "} = " : "") + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "rect-exact", fig: GF.rect(a, b, { lw: a + " cm", lh: b + " cm", diag: "d" }), guide: [GS(M(a + "^2 + " + b + "^2") + " = ?", n, M(n) + "."), GSR(M("d") + " = ? (simplifiée)", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(a + b, "On additionne les carrés, puis on prend la racine."), TR(n, "C'est " + M("d^2") + ".")] }); },
    ],
    3: [
      () => { const [c, s, h] = pk([[8, 6, 2], [8, 9, 7], [12, 11, 7], [12, 9, 3], [16, 12, 4], [16, 18, 14], [12, 19, 17]]);
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et des arêtes latérales de " + M(s) + " cm. Calcule sa hauteur (en cm).", h,
          "Demi-diagonale de la base : " + M("\\frac{d}{2}") + " avec " + M("\\left(\\frac{d}{2}\\right)^2 = \\frac{" + c + "^2 + " + c + "^2}{4} = " + c * c / 2) + ". Puis " + M("h^2 = " + s + "^2 - " + c * c / 2 + " = " + h * h) + ", donc " + M("h = " + h) + " cm.",
          { ctx: "pyrhaut", fig: FIG.pyramid(c + " cm", "h"), guide: [GS("Diagonale de la base, au carré : " + M(c + "^2 + " + c + "^2") + " = ?", 2 * c * c, M(2 * c * c) + "."), GS("Le sommet est au-dessus du centre : la demi-diagonale au carré vaut le quart. Combien ?", c * c / 2, M(2 * c * c + " : 4 = " + c * c / 2) + "."), GS("Triangle rectangle (hauteur, demi-diagonale, arête) : " + M("h^2 = " + s + "^2 - " + c * c / 2) + " = ?", h * h, M(h * h) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")],
            traps: [TR(Math.sqrt(s * s - c * c / 4), "Sous l'arête latérale, il y a la demi-diagonale de la base, pas le demi-côté."), TR(Math.sqrt(s * s - 2 * c * c), "Il faut la demi-diagonale, pas la diagonale entière.")] }); },
      () => { const [r, h, g] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25]]), ask = R.int(0, 1);
        return ask ? Qv("Un cône a un rayon de " + M(r) + " cm et une hauteur de " + M(h) + " cm. Calcule sa génératrice (longueur de la pointe au bord de la base, en cm).", g, M("g^2 = " + r + "^2 + " + h + "^2 = " + g * g) + ", donc " + M("g = " + g) + " cm.",
            { ctx: "conegen", fig: FIG.cone("r = " + r, "h = " + h), guide: [GS("Triangle rectangle (rayon, hauteur, génératrice) : " + M(r + "^2 + " + h + "^2") + " = ?", g * g, M(g * g) + "."), GS(M("g") + " = ?", g, M(g) + " cm.")], traps: [TR(r + h, "On additionne les carrés.")] })
          : Qv("Un cône a une génératrice de " + M(g) + " cm et un rayon de " + M(r) + " cm. Calcule sa hauteur (en cm).", h, M("h^2 = " + g + "^2 - " + r + "^2 = " + h * h) + ", donc " + M("h = " + h) + " cm.",
            { ctx: "conehaut", fig: FIG.cone("r = " + r, "h"), guide: [GS("La génératrice est l'hypoténuse. " + M(g + "^2 - " + r + "^2") + " = ?", h * h, M(h * h) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")], traps: [TR(Math.sqrt(g * g + r * r), "La génératrice est l'hypoténuse : on soustrait."), TR(g - r, "On soustrait les carrés.")] }); },
      () => { let a, b, c, n; do { a = R.int(1, 6); b = R.int(2, 7); c = R.int(2, 8); n = a * a + b * b + c * c; } while (Number.isInteger(Math.sqrt(n)) || simp(n)[0] === 1 && R.rand() < 0.4);
        const [k, m] = simp(n);
        return Qv("Un pavé droit " + M("ABCDEFGH") + " a pour dimensions " + M(a) + " cm, " + M(b) + " cm et " + M(c) + " cm. Calcule la longueur de la diagonale " + M("[AG]") + EXA + ".", k * Math.sqrt(m), M("AG^2 = " + a + "^2 + " + b + "^2 + " + c + "^2 = " + n) + ", donc " + M("AG = " + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "pave-exact", fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Diagonale de la base au carré : " + M(a + "^2 + " + b + "^2") + " = ?", a * a + b * b, M(a * a + b * b) + "."), GS(M("AG^2") + " = ?", n, M(n) + "."), GSR(M("AG") + " = ? (simplifiée)", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(a + b + c, "On additionne les carrés des trois dimensions."), TR(Math.sqrt(a * a + b * b), "C'est la diagonale de la base seulement.")] }); },
      () => { const c = 35.4, h = 21.6, a = Math.sqrt(h * h + (c / 2) ** 2);
        return Qv("La pyramide du Louvre, à Paris, est une pyramide régulière à base carrée de côté " + cm(c, "m") + " et de hauteur " + cm(h, "m") + ". Calcule son apothème (hauteur d'une face triangulaire, en m, arrondie au centième).", a,
          M("a^2 = " + N(h) + "^2 + " + N(c / 2) + "^2 = " + N(r12(h * h + c * c / 4))) + ", donc " + M("a \\approx " + N(rd(a, 0.01))) + " m.",
          { round: 0.01, ctx: "louvre", fig: FIG.pyramid(N(c).replace("{,}", ",") + " m", "h"), guide: [GS("L'apothème, la hauteur et le demi-côté forment un triangle rectangle. Demi-côté ?", c / 2, M(N(c / 2)) + " m."), GS(M(N(h) + "^2 + " + N(c / 2) + "^2") + " = ?", r12(h * h + c * c / 4), M(N(r12(h * h + c * c / 4))) + "."), GS("Apothème (au centième) ?", a, M(N(rd(a, 0.01))) + " m.", 0.01)],
            traps: [TR(Math.sqrt(h * h + c * c), "Sous l'apothème, il y a le demi-côté, pas le côté entier."), TR(Math.sqrt(h * h + c * c / 2), "Sous l'apothème, il y a le demi-côté (pas la demi-diagonale, qui sert pour l'arête).")] }); },
    ],
  };

  // ===================== pythrec : réciproque de Pythagore =====================
  const shuf = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const PREC = {
    1: [
      () => { const [a, b, c] = trip(), s = shuf([a, b, c]);
        return Qv("Un triangle a pour côtés " + M(s[0]) + " cm, " + M(s[1]) + " cm et " + M(s[2]) + " cm. Pour savoir s'il est rectangle, calcule la somme des carrés des deux plus petits côtés.", a * a + b * b, "Plus petits côtés " + M(a) + " et " + M(b) + " : " + M(a * a + " + " + b * b + " = " + (a * a + b * b)) + ". C'est égal à " + M(c + "^2") + " : le triangle est rectangle (réciproque de Pythagore).",
          { ctx: "somme", guide: [GS(M(a + "^2") + " = ?", a * a, M(a * a) + "."), GS(M(b + "^2") + " = ?", b * b, M(b * b) + "."), GS("Somme ?", a * a + b * b, M(a * a + b * b) + ", égale à " + M(c + "^2") + ".")],
            traps: [TR(a * a + c * c, "Le plus grand côté est " + M(c) + " : on additionne les carrés des deux autres."), TR(a + b, "On additionne les carrés.")] }); },
      () => { const ts = [0, 1, 2, 3].map(() => { const t = trip(); return R.rand() < 0.5 ? t : [t[0], t[1], t[2] + pk([-1, 1])]; }), ok = ts.filter((t) => t[0] ** 2 + t[1] ** 2 === t[2] ** 2).length;
        return Qv("Combien de ces triangles sont rectangles ? Côtés (en cm) : " + ts.map((t) => M("(" + t.join(" \\,;\\, ") + ")")).join(", "), ok, ts.map((t) => M(t[0] ** 2 + " + " + t[1] ** 2 + (t[0] ** 2 + t[1] ** 2 === t[2] ** 2 ? " = " : " \\neq ") + t[2] ** 2)).join(" ; ") + " : " + ok + " rectangle" + (ok > 1 ? "s" : "") + ".",
          { ctx: "compter", guide: [...ts.slice(0, 2).map((t, i) => GS("Triangle " + (i + 1) + " : " + M(t[0] + "^2 + " + t[1] + "^2") + " = ? (à comparer avec " + M(t[2] + "^2 = " + t[2] ** 2) + ")", t[0] ** 2 + t[1] ** 2, M(t[0] ** 2 + t[1] ** 2) + (t[0] ** 2 + t[1] ** 2 === t[2] ** 2 ? " : rectangle." : " : pas rectangle."))), GS("Fais de même pour les deux autres. Nombre de triangles rectangles ?", ok, ok + ".")],
            traps: [TR(4, "Un triangle n'est rectangle que si l'égalité est exacte."), TR(ok + 1, "Vérifie chaque égalité exactement : un écart d'une unité suffit à rendre le triangle non rectangle.")] }); },
      /* 25.11 (revue : « 3, 4 et 4 cm » avec le calcul 4² − (3² + 4²) déjà écrit : trop guidé, sans plus grand côté net) :
         le plus grand côté dépasse nettement les deux autres, les côtés sont dans le désordre, et le calcul n'est pas
         écrit : l'élève repère le plus grand côté et compare son carré à la somme des deux autres. */
      () => { const [a, b, c] = trip(25), x = c + pk([1, 2, 3]), s = shuf([a, b, x]), e = x * x - a * a - b * b; if (x >= a + b) return null; /* 26.11 : 3, 4, 8 n'est pas un triangle */
        return Qv("Un triangle a pour côtés " + M(s[0]) + " cm, " + M(s[1]) + " cm et " + M(s[2]) + " cm. Est-il rectangle ? Pour le savoir, calcule de combien le carré du plus grand côté dépasse la somme des carrés des deux autres.", e, "Plus grand côté " + M(x) + " : " + M(x + "^2 - (" + a + "^2 + " + b + "^2) = " + x * x + " - " + (a * a + b * b) + " = " + e) + " : ce n'est pas 0, le triangle n'est pas rectangle (il a un angle obtus).",
          { ctx: "ecart", guide: [GS("Quel est le plus grand côté (en cm) ?", x, M(x) + " cm."), GS(M(x + "^2") + " = ?", x * x, M(x * x) + "."), GS("Somme des carrés des deux autres : " + M(a + "^2 + " + b + "^2") + " = ?", a * a + b * b, M(a * a + b * b) + "."), GS("Différence ?", e, M(e) + ".")],
            traps: [TR(x - a - b, "On compare les carrés, pas les longueurs."), TR(-e, "Dans l'ordre : le carré du plus grand côté moins la somme des deux autres."), TR(a * a - b * b - x * x, "Le plus grand côté est " + M(x) + " cm : c'est son carré qu'on compare."), TR(b * b - a * a - x * x, "Le plus grand côté est " + M(x) + " cm : c'est son carré qu'on compare.")] }); },
    ],
    2: [
      () => { const [a, b, c] = pk([[1.5, 2, 2.5], [0.9, 1.2, 1.5], [2.4, 3.2, 4], [1.2, 1.6, 2], [3.6, 4.8, 6], [0.6, 0.8, 1], [2.7, 3.6, 4.5]]);
        return Qv("Un triangle a pour côtés " + cm(a, "m") + ", " + cm(b, "m") + " et " + cm(c, "m") + ". Calcule la somme des carrés des deux plus petits côtés.", r12(a * a + b * b), M(N(r12(a * a)) + " + " + N(r12(b * b)) + " = " + N(r12(a * a + b * b))) + ", égal à " + M(N(c) + "^2") + " : le triangle est rectangle.",
          { ctx: "decimaux", guide: [GS(M(N(a) + "^2") + " = ?", r12(a * a), M(N(r12(a * a))) + "."), GS(M(N(b) + "^2") + " = ?", r12(b * b), M(N(r12(b * b))) + "."), GS("Somme ?", r12(a * a + b * b), M(N(r12(a * a + b * b))) + ".")],
            traps: [TR(a + b, "On additionne les carrés."), TR(r12(a * 2 + b * 2), "Le carré d'un nombre n'est pas son double : " + M(N(a) + "^2 = " + N(a) + " \\cdot " + N(a)) + ".")] }); },
      () => { const [p, q, r] = trip(15), x0 = R.int(-4, 2), y0 = R.int(-4, 2);
        const A = [x0, y0], B = [x0 + p, y0], C = [x0 + p, y0 + q], ab2 = p * p, bc2 = q * q, ac2 = p * p + q * q;
        return Qv("Dans un repère, " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + ", " + M("B(" + B[0] + " \\,;\\, " + B[1] + ")") + " et " + M("C(" + C[0] + " \\,;\\, " + C[1] + ")") + ". Calcule " + M("AC^2") + ".", ac2, "Écarts " + M(p) + " et " + M(q) + " : " + M("AC^2 = " + p + "^2 + " + q + "^2 = " + ac2) + ". Et " + M("AB^2 + BC^2 = " + ab2 + " + " + bc2 + " = " + ac2) + " : le triangle est rectangle en " + M("B") + ".",
          { ctx: "repere", guide: [GS("Écart horizontal entre " + M("A") + " et " + M("C") + " ?", p, M(p) + "."), GS("Écart vertical ?", q, M(q) + "."), GS(M("AC^2") + " = ?", ac2, M(ac2) + ".")],
            traps: [TR(p + q, "On additionne les carrés des écarts."), TR(Math.sqrt(ac2), "On demande " + M("AC^2") + ", pas " + M("AC") + ".")] }); },
      () => { const [a, b, c] = trip(30), k = pk([1, 2, 3]);
        return Qv("On veut qu'un triangle de côtés " + M(a * k) + " cm, " + M(b * k) + " cm et " + M("x") + " cm soit rectangle, " + M("x") + " étant le plus grand côté. Quelle doit être la valeur de " + M("x") + " (en cm) ?", c * k, M("x^2 = " + a * k + "^2 + " + b * k + "^2 = " + (c * k) ** 2) + ", donc " + M("x = " + c * k) + " cm.",
          { ctx: "trouverx", guide: [GS(M("x^2 = " + a * k + "^2 + " + b * k + "^2") + " = ?", (c * k) ** 2, M((c * k) ** 2) + "."), GS(M("x") + " = ?", c * k, M(c * k) + " cm.")],
            traps: [TR((a + b) * k, "On additionne les carrés, puis on prend la racine.")] }); },
    ],
    3: [
      () => { const [a, b, c] = pk([[30, 40, 50], [60, 80, 100], [45, 60, 75], [90, 120, 150]]);
        return Qv("Pour vérifier qu'un angle est droit, un menuisier marque " + M(a) + " cm sur un côté et " + M(b) + " cm sur l'autre, à partir du coin. Quelle distance doit-il mesurer entre les deux marques pour que l'angle soit droit (en cm) ?", c, M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm : si la mesure vaut " + M(c) + " cm, l'angle est droit (réciproque).",
          { ctx: "menuisier", guide: [GS(M(a + "^2 + " + b + "^2") + " = ?", c * c, M(c * c) + "."), GS("Distance ?", c, M(c) + " cm.")], traps: [TR(a + b, "On additionne les carrés.")] }); },
      () => { const [n1, n2, n3] = pk([[5, 20, 25], [2, 7, 9], [3, 13, 16], [8, 17, 25], [6, 10, 16], [5, 11, 16]]);
        return Qv("Un triangle a pour côtés " + M("\\sqrt{" + n1 + "}") + " cm, " + M("\\sqrt{" + n2 + "}") + " cm et " + M(Math.sqrt(n3) % 1 ? "\\sqrt{" + n3 + "}" : Math.sqrt(n3)) + " cm. Calcule la somme des carrés des deux plus petits côtés.", n1 + n2, M("(\\sqrt{" + n1 + "})^2 + (\\sqrt{" + n2 + "})^2 = " + n1 + " + " + n2 + " = " + (n1 + n2)) + ", égal au carré du plus grand côté : rectangle.",
          { ctx: "racines", guide: [GS(M("(\\sqrt{" + n1 + "})^2") + " = ?", n1, "Le carré d'une racine redonne le nombre : " + M(n1) + "."), GS("Somme des deux carrés ?", n1 + n2, M(n1 + n2) + ".")],
            traps: [TR(Math.sqrt(n1) + Math.sqrt(n2), "On additionne les carrés : " + M("(\\sqrt{" + n1 + "})^2 = " + n1) + "."), TR(2 * n1 + 2 * n2, "Le carré de " + M("\\sqrt{" + n1 + "}") + " est " + M(n1) + ", pas " + M(2 * n1) + ".")] }); },
      () => { const L = pk([120, 150, 200, 90]), l = pk([50, 80, 60, 40]), d = Math.sqrt(L * L + l * l), dm = rd(d, 1) + pk([2, 3, -2, -3]);
        return Qv("Un cadre rectangulaire doit mesurer " + M(L) + " cm sur " + M(l) + " cm. Le menuisier mesure une diagonale de " + M(dm) + " cm. Quelle devrait être la diagonale d'un cadre bien d'équerre (en cm, au dixième) ?", d, M("\\sqrt{" + L + "^2 + " + l + "^2} \\approx " + N(rd(d, 0.1))) + " cm : avec " + M(dm) + " cm, les angles ne sont pas droits.",
          { round: 0.1, ctx: "cadre", guide: [GS(M(L + "^2 + " + l + "^2") + " = ?", L * L + l * l, M(L * L + l * l) + "."), GS("Diagonale au dixième ?", d, M(N(rd(d, 0.1))) + " cm.", 0.1)], traps: [TR(dm, "C'est la mesure du menuisier ; on demande la diagonale théorique."), TR(L + l, "On additionne les carrés.")] }); },
    ],
  };

  // ===================== vol : pavé, prisme, cylindre (volumes, aires totales, contenances) =====================
  const VOL = {
    1: [
      () => { const a = R.int(3, 12), b = R.int(2, 9), c = R.int(2, 8);
        return Qv("Calcule le volume d'un pavé droit de " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm (en cm³).", a * b * c, M(a + " \\cdot " + b + " \\cdot " + c + " = " + a * b * c) + " cm³.",
          { ctx: "pave", fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Aire de la base : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + " cm²."), GS("Volume = aire de la base × hauteur : ?", a * b * c, M(a * b * c) + " cm³.")],
            traps: [TR(a + b + c, "Le volume se calcule en multipliant les trois dimensions."), TR(2 * (a * b + b * c + a * c), "C'est l'aire totale ; le volume est " + M("a \\cdot b \\cdot c") + ".")] }); },
      () => { const b = R.int(3, 12), h = 2 * R.int(1, 5), L = R.int(4, 15), Ab = b * h / 2;
        return Qv("Un prisme droit a pour base un triangle de base " + M(b) + " cm et de hauteur " + M(h) + " cm. La longueur du prisme est " + M(L) + " cm. Calcule son volume (en cm³).", Ab * L, "Aire de la base : " + M("\\frac{" + b + " \\cdot " + h + "}{2} = " + Ab) + " cm² ; volume : " + M(Ab + " \\cdot " + L + " = " + Ab * L) + " cm³.",
          { ctx: "prisme", fig: FIG.prism(b + " cm", h + " cm", L + " cm"), guide: [GS("Aire du triangle de base : " + M("\\frac{" + b + " \\cdot " + h + "}{2}") + " = ?", Ab, M(Ab) + " cm²."), GS("Volume = aire de la base × longueur : ?", Ab * L, M(Ab * L) + " cm³.")],
            traps: [TR(b * h * L, "La base est un triangle : son aire est " + M("\\frac{b \\cdot h}{2}") + "."), TR(Ab * L / 3, "Un prisme n'est pas une pyramide : pas de division par 3.")] }); },
      () => { const r = R.int(2, 8), h = R.int(2, 12);
        return Qv("Calcule le volume d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm" + PIX + ".", r * r * h * Math.PI, M("\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(r * r * h)) + " cm³ " + M("\\approx " + N(rd(r * r * h * Math.PI, 0.01))) + " cm³.",
          { canon: r * r * h + "π", ctx: "cylindre", fig: FIG.cylinder("r = " + r, "h = " + h), guide: [GS("Aire de la base " + M("\\pi r^2") + " : le nombre devant " + M("\\pi") + " (" + M(r + "^2") + ") ?", r * r, M(piT(r * r)) + " cm²."), GS("Volume en " + M("\\pi") + " : tape-le (par exemple " + M("12\\pi") + ").", r * r * h * Math.PI, M(piT(r * r * h)) + " cm³.")],
            traps: [TR(2 * r * h * Math.PI, M("2\\pi r h") + " est l'aire latérale ; le volume est " + M("\\pi r^2 h") + "."), TR(4 * r * r * h * Math.PI, "Tu as pris le diamètre comme rayon.")] }); },
    ],
    2: [
      () => { let B, b, hh; do { B = R.int(6, 14); b = R.int(3, B - 2); hh = R.int(2, 8); } while ((B + b) * hh % 2); const L = R.int(5, 20), Ab = (B + b) * hh / 2;
        return Qv("Un prisme droit a pour base un trapèze de bases " + M(B) + " cm et " + M(b) + " cm, et de hauteur " + M(hh) + " cm. La profondeur du prisme est " + M(L) + " cm. Calcule son volume (en cm³).", Ab * L, "Base : " + M("\\frac{(" + B + " + " + b + ") \\cdot " + hh + "}{2} = " + Ab) + " cm² ; volume : " + M(Ab + " \\cdot " + L + " = " + Ab * L) + " cm³.",
          { ctx: "trapeze", guide: [GS("Aire du trapèze : " + M("\\frac{(" + B + " + " + b + ") \\cdot " + hh + "}{2}") + " = ?", Ab, M(Ab) + " cm²."), GS("Volume ?", Ab * L, M(Ab * L) + " cm³.")],
            traps: [TR(B * b * hh * L, "L'aire du trapèze est " + M("\\frac{(B + b) \\cdot h}{2}") + "."), TR((B + b) * hh * L, "N'oublie pas de diviser par 2 dans l'aire du trapèze.")] }); },
      () => { const a = pk([40, 50, 60, 80, 100]), b = pk([25, 30, 40, 50]), c = pk([30, 35, 40, 45]), V = a * b * c, x = pk([["Un aquarium a la forme d'un pavé de " + a + " cm × " + b + " cm × " + c + " cm. Combien de litres d'eau contient-il quand il est plein ?", "aquarium"], ["Un bac à fleurs mesure " + a + " cm × " + b + " cm × " + c + " cm. Combien de litres de terre faut-il pour le remplir ?", "bac"]]);
        return Qv(x[0], V / 1000, M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(V)) + " cm³ ; " + M("1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3") + ", donc " + M(N(V / 1000)) + " L.",
          { ctx: x[1], fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Volume en cm³ ?", V, M(N(V)) + " cm³."), GS("En litres (1 L = 1000 cm³) ?", V / 1000, M(N(V / 1000)) + " L.")],
            traps: [TR(V / 100, "1 L = 1 dm³ = 1000 cm³ : on divise par 1000."), TR(V, "C'est le volume en cm³ ; convertis en litres.")] }); },
      () => { const [r, h] = pk([[3.3, 11.5], [3, 12], [4, 15], [2.5, 10], [5, 18]]), V = Math.PI * r * r * h, x = pk([["Une canette cylindrique", "canette"], ["Un verre cylindrique", "verre"], ["Une boîte de conserve", "conserve"]]);
        return Qv(x[0] + " a un rayon intérieur de " + cm(r) + " et une hauteur de " + cm(h) + ". Quelle est sa contenance, en cL (arrondie à l'unité) ?", V / 10, M("\\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + " \\approx " + N(rd(V, 0.1))) + " cm³ ; " + M("1\\ \\text{cL} = 10\\ \\text{cm}^3") + ", donc environ " + M(N(rd(V / 10, 1))) + " cL.",
          { round: 1, ctx: x[1], fig: FIG.cylinder("r = " + N(r).replace("{,}", ","), "h = " + N(h).replace("{,}", ",")), guide: [GS("Volume en cm³ (à l'unité) ?", V, M(N(rd(V, 1))) + " cm³.", 1), GS("En cL (1 cL = 10 cm³), à l'unité ?", V / 10, M(N(rd(V / 10, 1))) + " cL.", 1)],
            traps: [TR(V, "C'est le volume en cm³ : 1 cL = 10 cm³."), TR(V / 1000, "Ça, ce sont des litres ; on demande des centilitres.")] }); },
    ],
    3: [
      () => { const r = R.int(2, 7), h = R.int(3, 12), k = 2 * r * r + 2 * r * h;
        return Qv("Calcule l'aire totale d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm" + PIX + ".", k * Math.PI, "Deux disques : " + M("2\\pi \\cdot " + r + "^2 = " + piT(2 * r * r)) + " ; surface latérale (un rectangle) : " + M("2\\pi \\cdot " + r + " \\cdot " + h + " = " + piT(2 * r * h)) + " ; total " + M(piT(k)) + " cm².",
          { canon: k + "π", ctx: "airecyl", fig: FIG.cylinder("r = " + r, "h = " + h), guide: [GS("Les deux disques : " + M("2 \\cdot \\pi \\cdot " + r + "^2") + " ; nombre devant " + M("\\pi") + " ?", 2 * r * r, M(piT(2 * r * r)) + "."), GS("Surface latérale déroulée : un rectangle de " + M("2\\pi r") + " sur " + M("h") + ". Nombre devant " + M("\\pi") + " ?", 2 * r * h, M(piT(2 * r * h)) + "."), GS("Aire totale (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm².")],
            traps: [TR(2 * r * h * Math.PI, "C'est la surface latérale seule : ajoute les deux disques."), TR((r * r + 2 * r * h) * Math.PI, "Il y a deux disques (le haut et le bas)."), TR(r * r * h * Math.PI, "C'est le volume.")] }); },
      () => { const [a, b, c] = trip(17), L = R.int(4, 15), Ab = a * b / 2, At = 2 * Ab + (a + b + c) * L;
        return Qv("Un prisme droit a pour base un triangle rectangle de cathètes " + M(a) + " cm et " + M(b) + " cm. Sa longueur est " + M(L) + " cm. Calcule son aire totale (en cm²).", At, "Hypoténuse : " + M(c) + " cm (Pythagore). Deux bases : " + M("2 \\cdot " + Ab + " = " + 2 * Ab) + " ; trois rectangles : " + M("(" + a + " + " + b + " + " + c + ") \\cdot " + L + " = " + (a + b + c) * L) + " ; total " + M(At) + " cm².",
          { ctx: "aireprisme", fig: FIG.prism(a + " cm", b + " cm", L + " cm", { right: true }), guide: [GS("Hypoténuse du triangle (Pythagore) ?", c, M(c) + " cm."), GS("Aire des deux triangles ?", 2 * Ab, M(2 * Ab) + " cm²."), GS("Aire des trois rectangles (périmètre × longueur) ?", (a + b + c) * L, M((a + b + c) * L) + " cm²."), GS("Aire totale ?", At, M(At) + " cm².")],
            traps: [TR(Ab * L, "C'est le volume ; on demande l'aire totale."), TR(Ab + (a + b + c) * L, "Il y a deux bases triangulaires."), TR(2 * Ab + (a + b) * L, "N'oublie pas la face rectangulaire sur l'hypoténuse.")] }); },
      () => { const R0 = R.int(3, 8), r = R.int(1, R0 - 1), h = R.int(5, 20), k = (R0 * R0 - r * r) * h;
        return Qv("Un tuyau a la forme d'un cylindre creux : rayon extérieur " + M(R0) + " cm, rayon intérieur " + M(r) + " cm, longueur " + M(h) + " cm. Calcule le volume de matière" + PIX + ".", k * Math.PI, M("\\pi \\cdot " + R0 + "^2 \\cdot " + h + " - \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(R0 * R0 * h) + " - " + piT(r * r * h) + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "tuyau", guide: [GS("Volume du grand cylindre (nombre devant " + M("\\pi") + ") ?", R0 * R0 * h, M(piT(R0 * R0 * h)) + "."), GS("Volume du trou ?", r * r * h, M(piT(r * r * h)) + "."), GS("Volume de matière (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR((R0 - r) ** 2 * h * Math.PI, "On ne soustrait pas les rayons : on soustrait les volumes (" + M("R^2 - r^2") + ")."), TR(R0 * R0 * h * Math.PI, "Il faut retirer le volume du trou.")] }); },
    ],
  };

  // ===================== volcone : pyramide, cône, boule =====================
  const VCONE = {
    1: [
      () => { const c = R.int(2, 12), h = 3 * R.int(1, 5), V = c * c * h / 3;
        return Qv("Calcule le volume d'une pyramide à base carrée de côté " + M(c) + " cm et de hauteur " + M(h) + " cm (en cm³).", V, M("\\frac{1}{3} \\cdot " + c + "^2 \\cdot " + h + " = \\frac{" + c * c * h + "}{3} = " + V) + " cm³.",
          { ctx: "pyr", fig: FIG.pyramid(c + " cm", "h = " + h), guide: [GS("Aire de la base ?", c * c, M(c * c) + " cm²."), GS("Aire de la base × hauteur ?", c * c * h, M(c * c * h) + "."), GS("Divisé par 3 : volume ?", V, M(V) + " cm³.")],
            traps: [TR(c * c * h, "Pour une pyramide, on divise par 3."), TR(c * h / 3, "La base est un carré : son aire est " + M(c + "^2") + ".")] }); },
      () => { const r = R.int(2, 9), h = 3 * R.int(1, 5), k = r * r * h / 3;
        return Qv("Calcule le volume d'un cône de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm" + PIX + ".", k * Math.PI, M("\\frac{1}{3} \\cdot \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "cone", fig: FIG.cone("r = " + r, "h = " + h), guide: [GS("Nombre devant " + M("\\pi") + " pour l'aire de la base ?", r * r, M(piT(r * r)) + "."), GS("Volume (avec " + M("\\pi") + ") : " + M("\\frac{1}{3} \\cdot " + piT(r * r) + " \\cdot " + h) + " ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(r * r * h * Math.PI, "Un cône : on divise par 3 (comme une pyramide)."), TR(4 * k * Math.PI, "Tu as pris le diamètre comme rayon.")] }); },
      () => { const r = 3 * R.int(1, 3), k = 4 * r ** 3 / 3;
        return Qv("Calcule le volume d'une boule de rayon " + M(r) + " cm" + PIX + ".", k * Math.PI, M("\\frac{4}{3} \\cdot \\pi \\cdot " + r + "^3 = \\frac{4 \\cdot " + r ** 3 + "}{3}\\pi = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "boule", fig: FIG.sphere("r = " + r), guide: [GS(M(r + "^3") + " = ?", r ** 3, M(r ** 3) + "."), GS(M("\\frac{4}{3} \\cdot " + r ** 3) + " = ?", k, M(k) + "."), GS("Volume (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(4 * r * r * Math.PI, M("4\\pi r^2") + " est l'aire de la sphère ; le volume est " + M("\\frac{4}{3}\\pi r^3") + "."), TR(4 * r ** 3 * Math.PI, "N'oublie pas de diviser par 3.")] }); },
    ],
    2: [
      () => { const a = R.int(3, 12), b = R.int(2, 10), h = 3 * R.int(1, 5); if (a === b) return null; const V = a * b * h / 3;
        return Qv("Une pyramide a pour base un rectangle de " + M(a) + " cm sur " + M(b) + " cm, et une hauteur de " + M(h) + " cm. Calcule son volume (en cm³).", V, M("\\frac{1}{3} \\cdot " + a + " \\cdot " + b + " \\cdot " + h + " = " + V) + " cm³.",
          { ctx: "pyrrect", guide: [GS("Aire de la base ?", a * b, M(a * b) + " cm²."), GS("Volume ?", V, M(V) + " cm³.")], traps: [TR(a * b * h, "On divise par 3 pour une pyramide.")] }); },
      () => { const d = 2 * R.int(2, 7), h = 3 * R.int(1, 4), r = d / 2, k = r * r * h / 3;
        return Qv("Un cornet de glace a la forme d'un cône de diamètre " + M(d) + " cm et de hauteur " + M(h) + " cm. Calcule son volume" + PIX + ".", k * Math.PI, "Rayon : " + M(r) + " cm. " + M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "cornet", fig: FIG.cone("d = " + d, "h = " + h), guide: [GS("Le rayon ?", r, M(d + " : 2 = " + r) + " cm."), GS("Volume (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(d * d * h / 3 * Math.PI, "On a donné le diamètre : le rayon en est la moitié.")] }); },
      () => { const a = 3 * R.int(1, 4), V = a ** 3 / 3;
        return Qv("Une pyramide est inscrite dans un cube d'arête " + M(a) + " cm : sa base est une face du cube et son sommet est le centre de la face opposée. Calcule le volume de la pyramide (en cm³).", V, "Base " + M(a * a) + " cm², hauteur " + M(a) + " cm : " + M("\\frac{1}{3} \\cdot " + a * a + " \\cdot " + a + " = " + V) + " cm³, soit le tiers du cube.",
          { ctx: "pyrcube", fig: FIG.cube(a + " cm", true), guide: [GS("La hauteur de la pyramide ?", a, "L'arête du cube : " + M(a) + " cm."), GS("Volume ?", V, M(V) + " cm³.")],
            traps: [TR(a ** 3, "C'est le volume du cube ; la pyramide en vaut le tiers."), TR(a ** 3 / 6, "La hauteur est l'arête entière : le sommet est sur la face opposée.")] }); },
      () => { const r = 3 * R.int(1, 3), k = 2 * r ** 3 / 3;
        return Qv("Un bol a la forme d'une demi-boule de rayon intérieur " + M(r) + " cm. Calcule son volume" + PIX + ".", k * Math.PI, "Demi-boule : " + M("\\frac{1}{2} \\cdot \\frac{4}{3}\\pi \\cdot " + r + "^3 = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "demiboule", guide: [GS("Volume de la boule entière (nombre devant " + M("\\pi") + ") ?", 4 * r ** 3 / 3, M(piT(4 * r ** 3 / 3)) + "."), GS("La moitié (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(2 * k * Math.PI, "C'est la boule entière ; le bol en est la moitié.")] }); },
    ],
    3: [
      () => { const [r, h, g] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), k = r * r * h / 3;
        if (!Number.isInteger(k)) return null;
        return Qv("Un cône a un rayon de " + M(r) + " cm et une génératrice de " + M(g) + " cm. Calcule son volume" + PIX + ".", k * Math.PI, "Hauteur : " + M("\\sqrt{" + g + "^2 - " + r + "^2} = " + h) + " cm. Volume : " + M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "conegen", fig: FIG.cone("r = " + r, "h"), guide: [GS("Il faut la hauteur (Pythagore) : " + M(g + "^2 - " + r + "^2") + " = ?", h * h, M(h * h) + "."), GS("Hauteur ?", h, M(h) + " cm."), GS("Volume (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(r * r * g / 3 * Math.PI, "La génératrice n'est pas la hauteur : calcule " + M("h") + " avec Pythagore.")] }); },
      () => { const r = R.int(2, 9), k = 4 * r * r;
        return Qv("Calcule l'aire d'une sphère de rayon " + M(r) + " cm" + PIX + ".", k * Math.PI, M("4\\pi \\cdot " + r + "^2 = " + piT(k)) + " cm².",
          { canon: k + "π", ctx: "sphere", fig: FIG.sphere("r = " + r), guide: [GS(M(r + "^2") + " = ?", r * r, M(r * r) + "."), GS("Aire (avec " + M("\\pi") + ") : " + M("4\\pi r^2") + " ?", k * Math.PI, M(piT(k)) + " cm².")],
            traps: [TR(4 * r ** 3 / 3 * Math.PI, "C'est le volume de la boule ; l'aire est " + M("4\\pi r^2") + "."), TR(r * r * Math.PI, "C'est l'aire d'un disque ; la sphère vaut 4 disques.")] }); },
      () => { const x = pk([["le rayon d'une boule", 2, 3, "boule"], ["le rayon d'une boule", 3, 3, "boule3"], ["le rayon de la base d'un cône (même hauteur)", 2, 2, "conr"], ["la hauteur d'un cône (même base)", 3, 1, "coneh"], ["l'arête d'un cube", 2, 3, "cube"], ["le rayon d'un cylindre (même hauteur)", 3, 2, "cyl"], ["toutes les dimensions d'une pyramide", 2, 3, "pyr"]]), f = x[1] ** x[2];
        return Qv("On multiplie " + x[0] + " par " + M(x[1]) + ". Par combien son volume est-il multiplié ?", f, "Le volume dépend de cette longueur " + (x[2] === 1 ? "au premier degré" : x[2] === 2 ? "au carré" : "au cube") + " : " + M(x[1] + (x[2] > 1 ? "^" + x[2] : "") + " = " + f) + ".",
          { ctx: x[3], guide: [GS("Dans la formule, cette longueur apparaît avec quel exposant ? (" + (x[3].startsWith("boule") || x[3] === "cube" || x[3] === "pyr" ? M("r^3") + ", " + M("a^3") + "…" : M("r^2") + " ou " + M("h") + ")") + ")", x[2], "Exposant " + M(x[2]) + "."), GS("Facteur : " + M(x[1] + (x[2] > 1 ? "^" + x[2] : "")) + " = ?", f, M(f) + ".")],
            traps: [TR(x[1], "Le volume ne suit pas la longueur : la longueur est " + (x[2] === 2 ? "au carré" : "au cube") + " dans la formule."), TR(x[1] * x[2], "C'est une puissance : " + M(x[1] + "^" + x[2]) + ", pas " + M(x[1] + " \\cdot " + x[2]) + ".")] }); },
    ],
  };

  // ===================== airepyr : aire d'une pyramide, apothème =====================
  const APYR = {
    1: [
      () => { const c = R.int(4, 12), a = R.int(5, 15); if (a === c) return null;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et un apothème de " + M(a) + " cm. Calcule son aire latérale (en cm²).", 2 * c * a, "Quatre triangles : " + M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + 2 * c * a) + " cm².",
          { ctx: "lat", guide: [GS("Aire d'une face triangulaire : " + M("\\frac{" + c + " \\cdot " + a + "}{2}") + " = ?", c * a / 2, M(c * a / 2) + " cm²."), GS("Quatre faces ?", 2 * c * a, M(2 * c * a) + " cm².")],
            traps: [TR(c * a / 2, "C'est une seule face ; il y en a quatre."), TR(4 * c * a, "L'aire d'un triangle se divise par 2.")] }); },
      () => { const c = R.int(4, 12), a = R.int(5, 15); if (a === c) return null;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et un apothème de " + M(a) + " cm. Calcule son aire totale (en cm²).", c * c + 2 * c * a, "Base : " + M(c * c) + " cm² ; faces : " + M(2 * c * a) + " cm² ; total " + M(c * c + 2 * c * a) + " cm².",
          { ctx: "tot", guide: [GS("Aire de la base ?", c * c, M(c * c) + " cm²."), GS("Aire latérale (4 triangles) ?", 2 * c * a, M(2 * c * a) + " cm²."), GS("Aire totale ?", c * c + 2 * c * a, M(c * c + 2 * c * a) + " cm².")],
            traps: [TR(2 * c * a, "C'est l'aire latérale : ajoute la base."), TR(c * c + c * a / 2, "Il y a quatre faces triangulaires.")] }); },
      () => { const c = R.int(4, 16), a = R.int(5, 15), x = pk([["une tente en forme de pyramide", "tente"], ["le toit d'une tour, en forme de pyramide", "toit"]]); if (a === c) return null;
        return Qv("On veut recouvrir de toile les quatre faces " + (x[0].startsWith("le ") ? "du " + x[0].slice(3) : "d'" + x[0]) + " (base carrée de " + M(c) + " dm, apothème " + M(a) + " dm). Quelle surface de toile faut-il (en dm²) ?", 2 * c * a, M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + 2 * c * a) + " dm² (sans le sol).",
          { ctx: x[1], guide: [GS("Une face ?", c * a / 2, M(c * a / 2) + " dm²."), GS("Quatre faces ?", 2 * c * a, M(2 * c * a) + " dm².")], traps: [TR(c * c + 2 * c * a, "Le sol n'est pas recouvert de toile.")] }); },
    ],
    2: [
      () => { const [c2, h, a] = pk([[3, 4, 5], [5, 12, 13], [8, 6, 10], [6, 8, 10], [9, 12, 15], [12, 5, 13], [4, 3, 5], [8, 15, 17]]), c = 2 * c2;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et une hauteur de " + M(h) + " cm. Calcule son apothème (en cm).", a, "Triangle rectangle (hauteur, demi-côté, apothème) : " + M("a^2 = " + h + "^2 + " + c2 + "^2 = " + a * a) + ", " + M("a = " + a) + " cm.",
          { ctx: "apo", fig: FIG.pyramid(c + " cm", "h = " + h), guide: [GS("Demi-côté de la base ?", c2, M(c2) + " cm."), GS(M(h + "^2 + " + c2 + "^2") + " = ?", a * a, M(a * a) + "."), GS("Apothème ?", a, M(a) + " cm.")],
            traps: [TR(Math.sqrt(h * h + c * c), "Sous l'apothème, il y a le demi-côté."), TR(h + c2, "On additionne les carrés.")] }); },
      () => { const [c2, h, a] = pk([[3, 4, 5], [5, 12, 13], [8, 6, 10], [6, 8, 10], [9, 12, 15], [4, 3, 5]]), c = 2 * c2;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et une hauteur de " + M(h) + " cm. Calcule son aire latérale (en cm²).", 2 * c * a, "Apothème : " + M("\\sqrt{" + h + "^2 + " + c2 + "^2} = " + a) + " cm ; aire latérale : " + M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + 2 * c * a) + " cm².",
          { ctx: "lath", guide: [GS("Apothème (Pythagore avec le demi-côté) ?", a, M(a) + " cm."), GS("Aire latérale ?", 2 * c * a, M(2 * c * a) + " cm².")],
            traps: [TR(2 * c * h, "Les faces ont pour hauteur l'apothème, pas la hauteur de la pyramide.")] }); },
      () => { const [c2, a, s] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [4, 3, 5]]), c = 2 * c2;
        return Qv("Une pyramide régulière à base carrée a des arêtes latérales de " + M(s) + " cm et un côté de base de " + M(c) + " cm. Calcule son aire totale (en cm²).", c * c + 2 * c * a, "Apothème (dans une face) : " + M("\\sqrt{" + s + "^2 - " + c2 + "^2} = " + a) + " cm ; total : " + M(c * c + " + " + 2 * c * a + " = " + (c * c + 2 * c * a)) + " cm².",
          { ctx: "arete", guide: [GS("Dans une face, l'apothème coupe la base en deux : " + M(s + "^2 - " + c2 + "^2") + " = ?", a * a, M(a * a) + "."), GS("Apothème ?", a, M(a) + " cm."), GS("Aire totale ?", c * c + 2 * c * a, M(c * c + 2 * c * a) + " cm².")],
            traps: [TR(c * c + 2 * c * s, "L'arête n'est pas l'apothème : calcule l'apothème avec Pythagore."), TR(2 * c * a, "N'oublie pas la base.")] }); },
    ],
    3: [
      () => { const c = 35.4, h = 21.6, a = Math.sqrt(h * h + (c / 2) ** 2), A = 2 * c * a;
        return Qv("La pyramide du Louvre a une base carrée de côté " + cm(c, "m") + " et une hauteur de " + cm(h, "m") + ". Ses quatre faces sont en verre. Calcule la surface de verre (en m², arrondie à l'unité).", A, "Apothème : " + M("\\sqrt{" + N(h) + "^2 + " + N(c / 2) + "^2} \\approx " + N(rd(a, 0.01))) + " m ; surface : " + M("2 \\cdot " + N(c) + " \\cdot " + N(rd(a, 0.01)) + " \\approx " + N(rd(A, 1))) + " m².",
          { round: 1, ctx: "louvre", guide: [GS("Apothème (au centième) ?", a, M(N(rd(a, 0.01))) + " m.", 0.01), GS("Surface des quatre faces (à l'unité) ?", A, M(N(rd(A, 1))) + " m².", 1)],
            traps: [TR(c * c + A, "Le sol n'est pas en verre."), TR(2 * c * h, "La hauteur des faces est l'apothème.")] }); },
      // Aire du cône retirée (22.11) : hors programme 11e. Toit de tour : hauteur donnée, apothème à calculer, puis coût.
      () => { const [c2, h, a] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10], [9, 12, 15], [8, 15, 17]]), c = 2 * c2, p = pk([35, 40, 45, 60]), A = 2 * c * a;
        return Qv("Le toit d'une tour est une pyramide régulière à base carrée de " + M(c) + " m de côté et de " + M(h) + " m de haut. On couvre ses quatre pans d'ardoises à " + M(p) + " CHF le m². Combien coûtent les ardoises (en CHF) ?", A * p, "Apothème : " + M("\\sqrt{" + h + "^2 + " + c2 + "^2} = " + a) + " m ; pans : " + M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + A) + " m² ; prix : " + M(A + " \\cdot " + p + " = " + N(A * p)) + " CHF.",
          { ctx: "ardoises", guide: [GS("Apothème (Pythagore avec le demi-côté) ?", a, M(a) + " m."), GS("Aire des quatre pans (m²) ?", A, M(A) + " m²."), GS("Prix (CHF) ?", A * p, M(N(A * p)) + " CHF.")],
            traps: [TR(2 * c * h * p, "Les pans ont pour hauteur l'apothème, pas la hauteur du toit."), TR((c * c + A) * p, "Le plancher n'est pas couvert d'ardoises.")] }); },
      () => { const c = 2 * R.int(2, 8), a = R.int(c / 2 + 1, c + 8), A = c * c + 2 * c * a, cost = pk([12, 15, 18, 25]);
        return Qv("Un artisan fabrique une boîte en forme de pyramide régulière (base carrée de " + M(c) + " cm, apothème " + M(a) + " cm), entièrement fermée. Le carton coûte " + M(cost) + " CHF le m². Quel est le prix du carton pour une boîte (en CHF, au centime) ?", A / 10000 * cost, "Aire : " + M(c * c + " + " + 2 * c * a + " = " + A) + " cm² " + M("= " + N(A / 10000)) + " m² ; prix : " + M(N(A / 10000) + " \\cdot " + cost + " \\approx " + N(rd(A / 10000 * cost, 0.01))) + " CHF.",
          { round: 0.01, ctx: "boite", guide: [GS("Aire totale en cm² ?", A, M(A) + " cm²."), GS("En m² (1 m² = 10'000 cm²) ?", A / 10000, M(N(A / 10000)) + " m²."), GS("Prix (au centime) ?", A / 10000 * cost, M(N(rd(A / 10000 * cost, 0.01))) + " CHF.", 0.01)],
            traps: [TR(A / 100 * cost, "1 m² = 10'000 cm² (et non 100)."), TR(A * cost, "Convertis d'abord les cm² en m².")] }); },
    ],
  };

  // ===================== volcomp : solides composés =====================
  const VCOMP = {
    1: [
      () => { const a = R.int(3, 9), h = 3 * R.int(1, 4), V = a ** 3 + a * a * h / 3;
        return Qv("Un solide est formé d'un cube d'arête " + M(a) + " cm, surmonté d'une pyramide de même base et de hauteur " + M(h) + " cm. Calcule son volume (en cm³).", V, "Cube : " + M(a ** 3) + " ; pyramide : " + M("\\frac{1}{3} \\cdot " + a * a + " \\cdot " + h + " = " + a * a * h / 3) + " ; total " + M(V) + " cm³.",
          { ctx: "cubepyr", fig: GF.profile("pyr", a, a, h, { a: a + " cm", h1: a + " cm", h2: h + " cm" }), guide: [GS("Volume du cube ?", a ** 3, M(a ** 3) + " cm³."), GS("Volume de la pyramide ?", a * a * h / 3, M(a * a * h / 3) + " cm³."), GS("Total ?", V, M(V) + " cm³.")],
            traps: [TR(a ** 3 + a * a * h, "La pyramide vaut le tiers du prisme de même base."), TR(a ** 3 * h, "On additionne les deux volumes.")] }); },
      () => { const r = R.int(2, 6), h = R.int(3, 9), k3 = 3 * R.int(1, 3), K = r * r * h + r * r * k3 / 3;
        return Qv("Un solide est formé d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm, surmonté d'un cône de même base et de hauteur " + M(k3) + " cm. Calcule son volume" + PIX + ".", K * Math.PI, "Cylindre : " + M(piT(r * r * h)) + " ; cône : " + M(piT(r * r * k3 / 3)) + " ; total " + M(piT(K)) + " cm³.",
          { canon: K + "π", ctx: "cylcone", fig: GF.profile("cone", 2 * r, h, k3, { r: "r = " + r, h1: h + " cm", h2: k3 + " cm" }), guide: [GS("Cylindre : nombre devant " + M("\\pi") + " ?", r * r * h, M(piT(r * r * h)) + "."), GS("Cône : nombre devant " + M("\\pi") + " ?", r * r * k3 / 3, M(piT(r * r * k3 / 3)) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " cm³.")],
            traps: [TR((r * r * h + r * r * k3) * Math.PI, "Le cône vaut le tiers d'un cylindre.")] }); },
      () => { const L = R.int(6, 15), l = R.int(4, 10), h = R.int(3, 8), t = 2 * R.int(1, 3), V = L * l * h + l * t / 2 * L;
        return Qv("Une maison est formée d'un pavé de " + M(L) + " m × " + M(l) + " m × " + M(h) + " m, surmonté d'un toit en prisme dont la base est un triangle de base " + M(l) + " m et de hauteur " + M(t) + " m (sur toute la longueur " + M(L) + " m). Calcule le volume total (en m³).", V, "Pavé : " + M(L * l * h) + " ; toit : " + M("\\frac{" + l + " \\cdot " + t + "}{2} \\cdot " + L + " = " + l * t / 2 * L) + " ; total " + M(V) + " m³.",
          { ctx: "maison", fig: GF.house(l, h, t, { a: l + " m", b: h + " m", h: t + " m" }), guide: [GS("Volume du pavé ?", L * l * h, M(L * l * h) + " m³."), GS("Aire du triangle du toit ?", l * t / 2, M(l * t / 2) + " m²."), GS("Volume du toit ?", l * t / 2 * L, M(l * t / 2 * L) + " m³."), GS("Total ?", V, M(V) + " m³.")],
            traps: [TR(L * l * h + l * t * L, "Le toit a une base triangulaire : son aire se divise par 2."), TR(L * l * h + l * t / 2 * L / 3, "Le toit est un prisme, pas une pyramide.")] }); },
    ],
    2: [
      () => { const r = 3 * R.int(1, 3), h = R.int(4, 12), K = r * r * h + 2 * r ** 3 / 3;
        return Qv("Un silo est formé d'un cylindre de rayon " + M(r) + " m et de hauteur " + M(h) + " m, surmonté d'une demi-boule de même rayon. Calcule son volume" + PIX + ".", K * Math.PI, "Cylindre : " + M(piT(r * r * h)) + " ; demi-boule : " + M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + piT(2 * r ** 3 / 3)) + " ; total " + M(piT(K)) + " m³.",
          { canon: K + "π", ctx: "silo", fig: GF.profile("dome", 2 * r, h, 0, { r: "r = " + r, h1: h + " m" }), guide: [GS("Cylindre : nombre devant " + M("\\pi") + " ?", r * r * h, M(piT(r * r * h)) + "."), GS("Demi-boule : nombre devant " + M("\\pi") + " ?", 2 * r ** 3 / 3, M(piT(2 * r ** 3 / 3)) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " m³.")],
            traps: [TR((r * r * h + 4 * r ** 3 / 3) * Math.PI, "C'est une demi-boule : la moitié de " + M("\\frac{4}{3}\\pi r^3") + ".")] }); },
      () => { const r = 3, L = pk([8, 10, 12, 14]), K = 4 * r ** 3 / 3 + r * r * (L - 2 * r);
        return Qv("Une gélule a la forme d'un cylindre terminé par deux demi-boules. Son diamètre est " + M(2 * r) + " mm et sa longueur totale " + M(L) + " mm. Calcule son volume" + PIX + ".", K * Math.PI, "Les deux demi-boules forment une boule : " + M(piT(4 * r ** 3 / 3)) + ". Partie cylindrique : longueur " + M(L - 2 * r) + " mm, " + M(piT(r * r * (L - 2 * r))) + ". Total " + M(piT(K)) + " mm³.",
          { canon: K + "π", ctx: "gelule", guide: [GS("Longueur de la partie cylindrique (on retire deux rayons) ?", L - 2 * r, M(L + " - 2 \\cdot " + r + " = " + (L - 2 * r)) + " mm."), GS("Les deux demi-boules : nombre devant " + M("\\pi") + " ?", 4 * r ** 3 / 3, M(piT(4 * r ** 3 / 3)) + "."), GS("Cylindre : nombre devant " + M("\\pi") + " ?", r * r * (L - 2 * r), M(piT(r * r * (L - 2 * r))) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " mm³.")],
            traps: [TR((4 * r ** 3 / 3 + r * r * L) * Math.PI, "La partie cylindrique est plus courte : on retire les deux demi-boules (2 rayons)."), TR((r * r * L) * Math.PI, "Ajoute les deux demi-boules.")] }); },
      () => { const a = pk([6, 8, 10, 12]), r = pk([1, 2, 3].filter((x) => 2 * x < a)), V = a ** 3 - Math.PI * r * r * a;
        return Qv("On perce un trou cylindrique de rayon " + M(r) + " cm de part en part dans un cube d'arête " + M(a) + " cm (perpendiculairement à une face). Calcule le volume restant (en cm³, arrondi à l'unité).", V, M(a + "^3 - \\pi \\cdot " + r + "^2 \\cdot " + a + " \\approx " + a ** 3 + " - " + N(rd(Math.PI * r * r * a, 0.01)) + " \\approx " + N(rd(V, 1))) + " cm³.",
          { round: 1, ctx: "cubetrou", guide: [GS("Volume du cube ?", a ** 3, M(a ** 3) + " cm³."), GS("Volume du trou (au centième) ?", Math.PI * r * r * a, M("\\pi \\cdot " + r * r + " \\cdot " + a + " \\approx " + N(rd(Math.PI * r * r * a, 0.01))) + " cm³.", 0.01), GS("Volume restant (à l'unité) ?", V, M(N(rd(V, 1))) + " cm³.", 1)],
            traps: [TR(a ** 3 - Math.PI * 4 * r * r * a, "Le rayon est " + M(r) + " : l'aire du disque est " + M("\\pi \\cdot " + r * r) + "."), TR(a ** 3, "Il faut retirer le volume du trou.")] }); },
    ],
    3: [
      () => { const r = 3 * R.int(1, 2), h = 3 * R.int(2, 4), K = r * r * h / 3 + 2 * r ** 3 / 3;
        return Qv("Une glace : un cône de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm, rempli et surmonté d'une demi-boule de glace de même rayon. Calcule le volume total de glace" + PIX + ".", K * Math.PI, "Cône : " + M(piT(r * r * h / 3)) + " ; demi-boule : " + M(piT(2 * r ** 3 / 3)) + " ; total " + M(piT(K)) + " cm³.",
          { canon: K + "π", ctx: "glace", guide: [GS("Cône : nombre devant " + M("\\pi") + " ?", r * r * h / 3, M(piT(r * r * h / 3)) + "."), GS("Demi-boule : nombre devant " + M("\\pi") + " ?", 2 * r ** 3 / 3, M(piT(2 * r ** 3 / 3)) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " cm³.")],
            traps: [TR((r * r * h + 2 * r ** 3 / 3) * Math.PI, "Le cône vaut le tiers du cylindre."), TR((r * r * h / 3 + 4 * r ** 3 / 3) * Math.PI, "C'est une demi-boule.")] }); },
      () => { const a = 3 * R.int(1, 4), V = 2 * a ** 3 / 3;
        return Qv("On découpe dans un cube d'arête " + M(a) + " cm la plus grande pyramide possible (base = une face, sommet = centre de la face opposée). Quel volume de matière enlève-t-on (en cm³) ?", V, "Cube " + M(a ** 3) + ", pyramide " + M(a ** 3 / 3) + " : on enlève " + M(a ** 3 + " - " + a ** 3 / 3 + " = " + V) + " cm³, les deux tiers.",
          { ctx: "decoupe", fig: FIG.cube(a + " cm", true), guide: [GS("Volume du cube ?", a ** 3, M(a ** 3) + " cm³."), GS("Volume de la pyramide ?", a ** 3 / 3, M(a ** 3 / 3) + " cm³."), GS("Volume enlevé ?", V, M(V) + " cm³.")],
            traps: [TR(a ** 3 / 3, "C'est le volume de la pyramide qui reste ; on demande ce qu'on enlève.")] }); },
      () => { const [hb, s, b2] = pk([[4, 5, 3], [12, 13, 5], [8, 10, 6], [6, 10, 8]]), L = R.int(3, 8), b = 2 * b2, V = b * hb / 2 * L;
        return Qv("Une tente a la forme d'un prisme droit couché. Sa face avant est un triangle isocèle de base " + M(b) + " dm et de côtés " + M(s) + " dm ; la tente est longue de " + M(L) + " dm. Calcule son volume (en dm³).", V, "Hauteur du triangle : " + M("\\sqrt{" + s + "^2 - " + b2 + "^2} = " + hb) + " dm ; aire " + M("\\frac{" + b + " \\cdot " + hb + "}{2} = " + b * hb / 2) + " dm² ; volume " + M(V) + " dm³.",
          { ctx: "tente", fig: GF.isoH(b, s, { lb: b + " dm", ls: s + " dm", lh: "h" }), guide: [GS("Hauteur du triangle (Pythagore avec la demi-base) ?", hb, M(hb) + " dm."), GS("Aire du triangle ?", b * hb / 2, M(b * hb / 2) + " dm²."), GS("Volume ?", V, M(V) + " dm³.")],
            traps: [TR(b * s / 2 * L, "Le côté oblique n'est pas la hauteur du triangle : calcule-la avec Pythagore."), TR(b * hb * L, "L'aire du triangle se divise par 2.")] }); },
    ],
  };

  // ===================== volmanq : retrouver une dimension =====================
  const VMAN = {
    1: [
      () => { const a = R.int(3, 12), b = R.int(2, 8), h = R.int(2, 12); if (h === a || h === b || a === b) return null;
        return Qv("Un pavé droit a un volume de " + M(a * b * h) + " cm³ et une base de " + M(a) + " cm sur " + M(b) + " cm. Quelle est sa hauteur (en cm) ?", h, M(a * b + " \\cdot h = " + a * b * h) + ", donc " + M("h = " + a * b * h + " : " + a * b + " = " + h) + " cm.",
          { ctx: "pave", guide: [GS("Aire de la base ?", a * b, M(a * b) + " cm²."), GS(M("h") + " = volume divisé par l'aire de la base : ?", h, M(h) + " cm.")], traps: [TR(a * b * h / a, "Divise par l'aire de la base entière, " + M(a + " \\cdot " + b) + ".")] }); },
      () => { const r = R.int(2, 7), h = R.int(2, 12); if (h === r) return null;
        return Qv("Un cylindre de rayon " + M(r) + " cm a un volume de " + M(piT(r * r * h)) + " cm³. Quelle est sa hauteur (en cm) ?", h, M("\\pi \\cdot " + r + "^2 \\cdot h = " + piT(r * r * h)) + ", donc " + M("h = " + r * r * h + " : " + r * r + " = " + h) + " cm.",
          { ctx: "cyl", guide: [GS("Aire de la base : nombre devant " + M("\\pi") + " ?", r * r, M(piT(r * r)) + "."), GS(M("h") + " = ?", h, M(r * r * h + " : " + r * r + " = " + h) + " cm.")], traps: [TR(r * h, "L'aire de la base est " + M("\\pi r^2") + " : divise par " + M(r * r) + ".")] }); },
      () => { const b = R.int(3, 10), hh = 2 * R.int(1, 5), L = R.int(4, 15), Ab = b * hh / 2; if (L === b) return null;
        return Qv("Un prisme droit a pour base un triangle de base " + M(b) + " cm et de hauteur " + M(hh) + " cm. Son volume est " + M(Ab * L) + " cm³. Quelle est sa longueur (en cm) ?", L, "Aire de la base : " + M(Ab) + " cm² ; " + M("L = " + Ab * L + " : " + Ab + " = " + L) + " cm.",
          { ctx: "prisme", guide: [GS("Aire du triangle de base ?", Ab, M(Ab) + " cm²."), GS("Longueur ?", L, M(L) + " cm.")], traps: [TR(Ab * L / (b * hh), "L'aire du triangle se divise par 2 : " + M(Ab) + " cm².")] }); },
    ],
    2: [
      () => { const r = R.int(2, 6), h = 3 * R.int(1, 4); if (r === h) return null;
        return Qv("Un cône de hauteur " + M(h) + " cm a un volume de " + M(piT(r * r * h / 3)) + " cm³. Quel est le rayon de sa base (en cm) ?", r, M("\\frac{1}{3}\\pi r^2 \\cdot " + h + " = " + piT(r * r * h / 3)) + ", donc " + M("r^2 = " + r * r) + " et " + M("r = " + r) + " cm.",
          { ctx: "cone", guide: [GS(M("\\frac{1}{3} \\cdot r^2 \\cdot " + h + " = " + r * r * h / 3) + " : combien vaut " + M("r^2") + " ?", r * r, M(r * r * h / 3 + " \\cdot 3 : " + h + " = " + r * r) + "."), GS(M("r") + " = ?", r, M(r) + " cm.")], traps: [TR(r * r, "C'est " + M("r^2") + " : prends la racine."), TR(Math.sqrt(r * r / 3), "N'oublie pas de multiplier par 3 (le cône vaut le tiers du cylindre).")] }); },
      () => { const c = R.int(3, 10), h = R.int(2, 15), V = c * c * h; if (V % 3 || h === c) return null;
        return Qv("Une pyramide à base carrée de côté " + M(c) + " cm a un volume de " + M(V / 3) + " cm³. Quelle est sa hauteur (en cm) ?", h, M("\\frac{1}{3} \\cdot " + c * c + " \\cdot h = " + V / 3) + ", donc " + M("h = " + V / 3 + " \\cdot 3 : " + c * c + " = " + h) + " cm.",
          { ctx: "pyr", guide: [GS("Aire de la base ?", c * c, M(c * c) + " cm²."), GS("Volume × 3 ?", V, M(V) + "."), GS("Hauteur ?", h, M(V + " : " + c * c + " = " + h) + " cm.")], traps: [TR(V / 3 / (c * c), "Une pyramide : " + M("h = \\frac{3V}{A_{\\text{base}}}") + ", n'oublie pas le facteur 3.")] }); },
      () => { const r = pk([3, 6, 9]), k = 4 * r ** 3 / 3;
        return Qv("Une boule a un volume de " + M(piT(k)) + " cm³. Quel est son rayon (en cm) ?", r, M("\\frac{4}{3}\\pi r^3 = " + piT(k)) + ", donc " + M("r^3 = " + k + " \\cdot \\frac{3}{4} = " + r ** 3) + " et " + M("r = " + r) + " cm.",
          { ctx: "boule", guide: [GS("Combien vaut " + M("r^3") + " ? (" + M(k + " \\cdot 3 : 4") + ")", r ** 3, M(r ** 3) + "."), GS(M("r") + " = ? (racine cubique)", r, M(r + "^3 = " + r ** 3) + ", donc " + M("r = " + r) + " cm.")], traps: [TR(r ** 3, "C'est " + M("r^3") + " : cherche le nombre dont le cube vaut " + M(r ** 3) + "."), TR(Math.sqrt(r ** 3), "C'est un cube : racine cubique, pas carrée.")] }); },
    ],
    3: [
      () => { const a = pk([8, 10, 12, 15]), b = pk([4, 5, 6]), V = pk([96, 120, 150, 180, 240]), h = V / (a * b); if (h > 3 || h < 0.5) return null;
        return Qv("Une piscine rectangulaire de " + M(a) + " m sur " + M(b) + " m doit contenir " + M(N(V)) + " m³ d'eau. Quelle doit être la profondeur de l'eau (en m, au centième) ?", h, M("h = " + V + " : (" + a + " \\cdot " + b + ") = " + V + " : " + a * b + " \\approx " + N(rd(h, 0.01))) + " m.",
          { round: 0.01, ctx: "piscine", guide: [GS("Aire du fond ?", a * b, M(a * b) + " m²."), GS("Profondeur (au centième) ?", h, M(N(rd(h, 0.01))) + " m.", 0.01)], traps: [TR(V / a, "Divise par l'aire du fond, " + M(a + " \\cdot " + b) + ".")] }); },
      () => { const r = pk([3, 4, 5, 6, 3.5]), L = pk([0.5, 1, 1.5, 0.75, 2]), V = L * 1000, h = V / (Math.PI * r * r);
        return Qv("Une boîte cylindrique de rayon " + cm(r) + " doit contenir " + M(N(L)) + " L. Quelle doit être sa hauteur (en cm, au dixième) ?", h, M(N(L) + "\\ \\text{L} = " + N(V)) + " cm³ ; " + M("h = \\frac{" + N(V) + "}{\\pi \\cdot " + N(r) + "^2} \\approx " + N(rd(h, 0.1))) + " cm.",
          { round: 0.1, ctx: "boite", guide: [GS("Volume en cm³ (1 L = 1000 cm³) ?", V, M(N(V)) + " cm³."), GS("Aire de la base (au centième) ?", Math.PI * r * r, M("\\pi \\cdot " + N(r) + "^2 \\approx " + N(rd(Math.PI * r * r, 0.01))) + " cm².", 0.01), GS("Hauteur (au dixième) ?", h, M(N(rd(h, 0.1))) + " cm.", 0.1)],
            traps: [TR(L / (Math.PI * r * r), "Convertis d'abord les litres en cm³ (1 L = 1000 cm³)."), TR(V / (Math.PI * 2 * r), "L'aire de la base est " + M("\\pi r^2") + ".")] }); },
      () => { const d = 2 * R.int(2, 6), r = d / 2, h = 3 * R.int(1, 5), k = r * r * h / 3; if (!Number.isInteger(k)) return null;
        return Qv("Un entonnoir en forme de cône a un diamètre de " + M(d) + " cm et contient " + M(piT(k)) + " cm³. Quelle est sa profondeur (hauteur, en cm) ?", h, "Rayon " + M(r) + " : " + M("\\frac{1}{3}\\pi \\cdot " + r * r + " \\cdot h = " + piT(k)) + ", donc " + M("h = " + k + " \\cdot 3 : " + r * r + " = " + h) + " cm.",
          { ctx: "entonnoir", guide: [GS("Le rayon ?", r, M(r) + " cm."), GS(M("r^2 \\cdot h") + " vaut " + M(k + " \\cdot 3") + ". Combien ?", 3 * k, M(3 * k) + "."), GS("Hauteur ?", h, M(3 * k + " : " + r * r + " = " + h) + " cm.")],
            traps: [TR(3 * k / (d * d), "On a donné le diamètre : le rayon en est la moitié."), TR(k / (r * r), "N'oublie pas le facteur 3 du cône.")] }); },
    ],
  };

  // ===================== Défis (niveau 4) =====================
  const PROBS = {
    pyth: [
      () => P("Un écran de télévision 16:9 a une diagonale de 55 pouces (1 pouce = 2,54 cm). Sa largeur vaut " + M("16k") + " et sa hauteur " + M("9k") + ".",
          [["a) Diagonale en cm (au dixième)", 139.7, 0.1], ["b) k (au centième), sachant que (16k)² + (9k)² = diagonale²", 139.7 / Math.sqrt(337), 0.01], ["c) Largeur de l'écran en cm (à l'unité)", 16 * 139.7 / Math.sqrt(337), 1]],
          ["a) 55 · 2,54.", "b) 337k² = diagonale², donc k = diagonale ÷ √337."], "a) " + M("139{,}7") + " cm ; b) " + M("k \\approx 7{,}61") + " ; c) " + M("\\approx 122") + " cm."),
      () => P("Deux bateaux partent du même port : l'un vers le nord à 12 km/h, l'autre vers l'est à 16 km/h.",
          [["a) Distance parcourue vers le nord en 2 h (km)", 24], ["b) Distance vers l'est en 2 h (km)", 32], ["c) Distance entre les deux bateaux après 2 h (km)", 40]],
          ["Nord et est forment un angle droit.", "c) √(24² + 32²)."], "c) " + M("\\sqrt{24^2 + 32^2} = 40") + " km."),
    ],
    pythfig: [
      () => P("Une boîte en forme de pavé mesure 30 cm × 40 cm × 120 cm.", [["a) Diagonale du fond 30 × 40 (cm)", 50], ["b) Grande diagonale de la boîte (cm)", 130], ["c) Un bâton de 1,25 m entre-t-il ? Tape 1 pour oui, 0 pour non.", 1]],
          ["b) Avec la hauteur : √(50² + 120²).", "c) Compare 125 cm et la grande diagonale."], "a) 50 cm ; b) " + M("\\sqrt{2500 + 14\\text{'}400} = 130") + " cm ; c) oui, 125 < 130."),
      () => P("Un carré est inscrit dans un cercle de rayon 5 cm.", [["a) Diagonale du carré (cm)", 10], ["b) Aire du carré (cm²)", 50], ["c) Aire entre le cercle et le carré (cm², au centième)", 25 * Math.PI - 50, 0.01]],
          ["La diagonale est un diamètre.", "b) c² + c² = 10²."], "a) 10 ; b) " + M("c^2 = 50") + " ; c) " + M("25\\pi - 50 \\approx 28{,}54") + " cm²."),
    ],
    pythrec: [
      () => P("Un triangle a pour sommets A(1 ; 1), B(5 ; 3) et C(3 ; 7).", [["a) AB²", 20], ["b) BC²", 20], ["c) AC²", 40]],
          ["Écarts de coordonnées au carré, additionnés.", "Compare AC² et AB² + BC²."], "a) " + M("4^2 + 2^2 = 20") + " ; b) " + M("2^2 + 4^2 = 20") + " ; c) " + M("2^2 + 6^2 = 40 = 20 + 20") + " : rectangle (et isocèle) en " + M("B") + "."),
      () => P("Les côtés d'un triangle mesurent n² − 1, 2n et n² + 1 (n entier, n ≥ 2).", [["a) Pour n = 4 : le plus grand côté", 17], ["b) (n² − 1)² + (2n)² pour n = 4", 289], ["c) (n² + 1)² pour n = 4", 289]],
          ["Remplace n par 4.", "Ces triangles sont toujours rectangles : vérifie en développant."], "a) 17 ; b) " + M("15^2 + 8^2 = 289") + " ; c) " + M("17^2 = 289") + " : rectangle."),
    ],
    vol: [
      () => P("Une piscine de 25 m × 10 m a une profondeur de 1,2 m d'un côté et 2 m de l'autre (fond en pente régulière).", [["a) Aire de la face latérale (trapèze) en m²", 40], ["b) Volume de la piscine (m³)", 400], ["c) Nombre de litres", 400000]],
          ["La piscine est un prisme dont la base est un trapèze : (1,2 + 2) · 25 ÷ 2.", "1 m³ = 1000 L."], "a) " + M("\\frac{(1{,}2 + 2) \\cdot 25}{2} = 40") + " m² ; b) " + M("40 \\cdot 10 = 400") + " m³ ; c) " + M("400\\text{'}000") + " L."),
      () => P("Une canette de 33 cL a un rayon de 3,3 cm.", [["a) Volume en cm³", 330], ["b) Aire de la base (cm², au centième)", Math.PI * 3.3 * 3.3, 0.01], ["c) Hauteur minimale pour contenir les 33 cL (cm, au dixième supérieur)", Math.ceil(330 / (Math.PI * 3.3 * 3.3) * 10) / 10, 0.01]],
          ["1 cL = 10 cm³.", "c) Volume ÷ aire de la base, puis arrondir AU-DESSUS : une hauteur plus petite ne contiendrait pas tout."], "a) 330 ; b) " + M("\\approx 34{,}21") + " ; c) " + M("330 \\div 34{,}21 \\approx 9{,}646") + ", donc " + M("9{,}7") + " cm (avec " + M("9{,}6") + " cm, la canette ne contiendrait que " + M("\\approx 328") + " cm³)."), /* 25.11 soir (revue d'un testeur) : hauteur minimale = arrondi supérieur */
    ],
    volcone: [
      () => P("Une boule de rayon 3 cm est posée dans un cylindre de même rayon et de hauteur 6 cm.", [["a) Volume du cylindre (cm³, au centième)", 54 * Math.PI, 0.01], ["b) Volume de la boule (cm³, au centième)", 36 * Math.PI, 0.01], ["c) Quelle fraction du cylindre la boule occupe-t-elle ? (fraction)", 2 / 3]],
          ["Cylindre 54π, boule 36π.", "c) 36π ÷ 54π."], "c) " + M("\\frac{36\\pi}{54\\pi} = \\frac{2}{3}") + " : le résultat d'Archimède."),
      () => P("Un cône et un cylindre ont la même base (rayon 4 cm) et le même volume. Le cylindre mesure 5 cm de haut.", [["a) Volume du cylindre (cm³, au centième)", 80 * Math.PI, 0.01], ["b) Hauteur du cône (cm)", 15]],
          ["Le cône vaut le tiers d'un cylindre de même base et même hauteur.", "b) Il doit être 3 fois plus haut."], "b) " + M("3 \\cdot 5 = 15") + " cm."),
    ],
    airepyr: [
      () => P("Une pyramide régulière à base carrée a une base de 10 m de côté et une hauteur de 12 m.", [["a) Apothème (m)", 13], ["b) Aire latérale (m²)", 260], ["c) Volume (m³)", 400]],
          ["a) √(12² + 5²).", "c) Base × hauteur ÷ 3."], "a) 13 ; b) " + M("2 \\cdot 10 \\cdot 13 = 260") + " ; c) " + M("\\frac{100 \\cdot 12}{3} = 400") + "."),
      () => P("Patron d'une pyramide régulière : un carré de 16 cm de côté et quatre triangles isocèles d'apothème 10 cm.", [["a) Aire du patron (cm²)", 576], ["b) Hauteur de la pyramide montée (cm)", 6], ["c) Volume (cm³)", 512]],
          ["a) Carré + 4 triangles.", "b) √(10² − 8²) ; c) Base × hauteur ÷ 3."], "a) " + M("256 + 4 \\cdot \\frac{16 \\cdot 10}{2} = 576") + " ; b) " + M("\\sqrt{100 - 64} = 6") + " ; c) " + M("\\frac{256 \\cdot 6}{3} = 512") + "."),
    ],
    volcomp: [
      () => P("Un réservoir : cylindre de rayon 1 m et de hauteur 3 m, avec un fond en cône de même rayon et de hauteur 0,6 m.", [["a) Volume du cylindre (m³, au centième)", 3 * Math.PI, 0.01], ["b) Volume du cône (m³, au centième)", 0.2 * Math.PI, 0.01], ["c) Contenance totale en litres (à l'unité)", 3200 * Math.PI, 1]],
          ["Cône : ⅓ · π · r² · h.", "1 m³ = 1000 L."], "c) " + M("3{,}2\\pi \\approx 10{,}053") + " m³, soit environ " + M("10\\text{'}053") + " L."),
      () => P("Une bougie : un cube de 6 cm d'arête surmonté d'une pyramide de 6 cm de hauteur.", [["a) Volume du cube (cm³)", 216], ["b) Volume de la pyramide (cm³)", 72], ["c) Masse de cire si 1 cm³ pèse 0,9 g (g)", 259.2]],
          ["Pyramide : 36 · 6 ÷ 3.", "Masse = volume · 0,9."], "c) " + M("288 \\cdot 0{,}9 = 259{,}2") + " g."),
    ],
    volmanq: [
      () => P("Un verre conique de 6 cm de rayon doit contenir 20 cL.", [["a) 20 cL en cm³", 200], ["b) Hauteur du verre (cm, au dixième)", 600 / (36 * Math.PI), 0.1]],
          ["1 cL = 10 cm³.", "h = 3V ÷ (π r²)."], "b) " + M("h = \\frac{600}{36\\pi} \\approx 5{,}3") + " cm."),
      () => P("On fond une boule de métal de rayon 3 cm pour fabriquer un cylindre de rayon 2 cm.", [["a) Volume de la boule (cm³, au centième)", 36 * Math.PI, 0.01], ["b) Hauteur du cylindre (cm)", 9]],
          ["Même volume : π · 2² · h = 36π.", "h = 36 ÷ 4."], "b) " + M("h = 36 : 4 = 9") + " cm."),
    ],
  };

  // ===================== Enregistrement =====================
  // « Trouve l'erreur » (24.11, chantier I) : cathète calculée avec une somme de carrés au lieu d'une différence.
  PYTH[2].push(() => { const [p, q, r] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), k = R.pick([1, 2]), a = p * k, b = q * k, c = r * k, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Un triangle est rectangle ; son hypoténuse mesure " + M(c) + " cm et une cathète " + M(a) + " cm. " + w + " écrit : « " + M("b = \\sqrt{" + c + "^2 + " + a + "^2}") + " ». Trouve l'erreur, puis calcule l'autre cathète " + M("b") + " (en cm).", b,
      "Erreur : l'hypoténuse est le plus grand côté ; " + M("c^2 = a^2 + b^2") + " donne " + M("b^2 = c^2 - a^2 = " + c * c + " - " + a * a + " = " + b * b) + ", donc " + M("b = " + b) + " cm.",
      { ctx: "erreur", guide: [GS(M("b^2 = c^2 - a^2") + " : " + M(c * c + " - " + a * a) + " = ?", b * b, M(b * b) + "."), GS(M("b = \\sqrt{" + b * b + "}") + " = ?", b, M(b) + " cm.")],
        traps: [TRAP(+Math.sqrt(c * c + a * a).toFixed(2), "C'est le calcul de " + w + " : une cathète est plus courte que l'hypoténuse, on soustrait les carrés.")] }); });
  // « Trouve l'erreur » (24.11, chantier I, suite) : volume du cône sans le tiers.
  VCONE[2].push(() => { const r = R.int(2, 8), h = R.int(4, 15), v = (Math.PI * r * r * h) / 3, faux = Math.PI * r * r * h, base = Math.PI * r * r, w = pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Un cône a un rayon de " + cm(r) + " et une hauteur de " + cm(h) + ". " + w + " calcule son volume : « " + M("V = \\pi \\cdot " + r + "^2 \\cdot " + h + " \\approx " + N(Math.round(faux))) + " cm³ ». Trouve l'erreur, puis donne le bon volume (au cm³ près).", v,
      "Erreur : " + w + " a calculé le volume du <b>cylindre</b> de même base et même hauteur. Un cône (comme une pyramide) en contient le tiers : " + M("V = \\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} \\approx " + N(Math.round(v))) + " cm³.",
      { round: 1, ctx: "erreur", guide: [GS("Aire de la base " + M("\\pi \\cdot " + r + "^2") + " ≈ ? (au dixième, en cm²)", base, M("\\approx " + N(Math.round(base * 10) / 10)) + " cm².", 0.1), GS("Volume : aire de la base · hauteur, divisé par 3 ≈ ? (au cm³ près)", v, M("\\approx " + N(Math.round(v))) + " cm³.", 1)],
        traps: [TR(faux, "C'est le résultat de " + w + " : c'est le volume du cylindre ; celui du cône est 3 fois plus petit."), TR((2 * Math.PI * r * h) / 3, "La base est un disque : son aire est " + M("\\pi r^2") + ".")] }); });
  const ALL = { pyth: PYTH, pythfig: PFIG, pythrec: PREC, vol: VOL, volcone: VCONE, airepyr: APYR, volcomp: VCOMP, volmanq: VMAN };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    pyth: "Repère l'hypoténuse (en face de l'angle droit). Hypoténuse² = somme des carrés des cathètes ; pour une cathète, on soustrait.",
    pythfig: "Cherche le triangle rectangle caché : diagonale d'un rectangle, hauteur d'un triangle isocèle (demi-base), diagonale d'un pavé (a² + b² + c²), hauteur d'une pyramide.",
    pythrec: "Compare le carré du plus grand côté avec la somme des carrés des deux autres : égalité → rectangle ; sinon, pas rectangle.",
    vol: "Prisme et cylindre : V = aire de la base × hauteur. 1 L = 1 dm³ = 1000 cm³, 1 cL = 10 cm³.",
    volcone: "Pyramide et cône : V = ⅓ · aire de la base · hauteur. Boule : V = ⁴⁄₃ π r³ ; sphère : A = 4 π r².",
    airepyr: "Aire latérale d'une pyramide régulière : 4 triangles de base c et de hauteur l'apothème (Pythagore avec le demi-côté).",
    volcomp: "Découpe le solide en solides simples, calcule chaque volume (garde π), puis additionne ou soustrais.",
    volmanq: "Écris la formule du volume, remplace ce que tu connais, puis isole la dimension cherchée.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    pyth: ["Calculer un côté d'un triangle rectangle", "Valeur exacte, distance dans un repère", "Problèmes en plusieurs étapes"],
    pythfig: ["Diagonale, hauteur d'un triangle isocèle", "Diagonales d'un pavé, d'un cube, triangle équilatéral", "Pyramides et cônes (hauteur, apothème, génératrice)"],
    pythrec: ["Tester si un triangle est rectangle", "Décimaux, repère, côté manquant", "Équerre, racines, contrôle d'un cadre"],
    vol: ["Volume d'un pavé, d'un prisme, d'un cylindre", "Prisme à base trapèze, contenances", "Aires totales, cylindre creux"],
    volcone: ["Volume d'une pyramide, d'un cône, d'une boule", "Diamètre, demi-boule, pyramide dans un cube", "Génératrice, aire de la sphère, variations"],
    airepyr: ["Aire latérale et totale d'une pyramide", "Apothème avec Pythagore", "Problèmes : Louvre, toit, coût"],
    volcomp: ["Solides composés simples", "Silo, gélule, cube percé", "Glace, découpe, tente"],
    volmanq: ["Retrouver une hauteur, une longueur", "Rayon d'un cône, d'une boule ; hauteur d'une pyramide", "Problèmes avec conversions"],
  });
})();
