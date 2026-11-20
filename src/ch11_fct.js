// Chantier 11e · 10. Fonctions (18.11, lot suivant du plan de cheminement) : repere (se repérer dans le plan) et tabval
// (tableau de valeurs). Même standard que les autres modules 11e : au moins 3 formes par niveau, pas à pas, erreurs
// typiques, ctx ; défis. (affine est déjà traité dans ch1c_sys.js.)
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const nz2 = (a, b) => { let v; do v = R.int(a, b); while (Math.abs(v) < 2); return v; }; // ni 0 ni ±1 (questions triviales)
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(t.v) && seen.add(t.v)); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value }, sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const pt = (n, x, y) => M(n + "(" + x + " \\,;\\, " + y + ")");
  const pr = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? (b < 0 ? " - " + -b : " + " + b) : "");
  const table = (xs, ys) => M("\\begin{array}{c|" + xs.map(() => "c").join("|") + "} x & " + xs.join(" & ") + " \\\\ \\hline f(x) & " + ys.join(" & ") + " \\end{array}");

  // ===================== repere =====================
  const REP = {
    1: [
      () => { const x = nz2(-5, 5), y = nz2(-4, 4), ask = R.int(0, 1);
        return Qv("Lis sur le graphique " + (ask ? "l'ordonnée" : "l'abscisse") + " du point " + M("A") + ".", ask ? y : x, M("A") + " a pour coordonnées " + pt("A", x, y) + " : " + (ask ? "ordonnée (lue sur l'axe vertical) " + y : "abscisse (lue sur l'axe horizontal) " + x) + ".",
          { ctx: ask ? "ordonnee" : "abscisse", fig: FIG.plot([], [[x, y, "A"]], { numbers: true }), guide: [GS((ask ? "L'ordonnée se lit sur l'axe vertical" : "L'abscisse se lit sur l'axe horizontal") + " : descends ou va horizontalement jusqu'à l'axe. Valeur ?", ask ? y : x, M(ask ? y : x) + ".")],
            traps: [TR(ask ? x : y, ask ? "Ça, c'est l'abscisse (axe horizontal). L'ordonnée se lit sur l'axe vertical." : "Ça, c'est l'ordonnée. L'abscisse se lit sur l'axe horizontal (on la donne en premier)."), TR(ask ? -y : -x, "Attention au signe : le point est " + (ask ? (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal." : (x < 0 ? "à gauche" : "à droite") + " de l'axe vertical."))] }); },
      () => { const x = nz2(-7, 7), y = nz2(-7, 7), axe = R.int(0, 1);
        return Qv("À quelle distance le point " + pt("P", x, y) + " est-il de l'axe " + (axe ? "des ordonnées (vertical)" : "des abscisses (horizontal)") + " ?", Math.abs(axe ? x : y), "La distance à l'axe " + (axe ? "vertical est la valeur absolue de l'abscisse" : "horizontal est la valeur absolue de l'ordonnée") + " : " + Math.abs(axe ? x : y) + ".",
          { ctx: axe ? "dist-y" : "dist-x", guide: [GS("Quelle coordonnée mesure l'écart à l'axe " + (axe ? "vertical : l'abscisse" : "horizontal : l'ordonnée") + ". Sa valeur ?", axe ? x : y, M(axe ? x : y) + "."), GS("Une distance est positive : ?", Math.abs(axe ? x : y), M(Math.abs(axe ? x : y)) + ".")],
            traps: [TR(Math.abs(axe ? y : x), "On s'éloigne de l'axe " + (axe ? "vertical en se déplaçant horizontalement : c'est l'abscisse qui compte." : "horizontal en se déplaçant verticalement : c'est l'ordonnée qui compte.")), TR(axe ? x : y, "Une distance est toujours positive.")] }); },
      () => { const x = nz2(-6, 6), y = nz2(-6, 6), s = pk(["o", "x", "y"]), img = s === "o" ? [-x, -y] : s === "x" ? [x, -y] : [-x, y], ask = R.int(0, 1);
        return Qv("Quel est " + (ask ? "l'ordonnée" : "l'abscisse") + " du symétrique de " + pt("A", x, y) + (s === "o" ? " par rapport à l'origine" : s === "x" ? " par rapport à l'axe des abscisses" : " par rapport à l'axe des ordonnées") + " ?", img[ask],
          "Symétrique " + (s === "o" ? "par rapport à l'origine : les deux coordonnées changent de signe" : s === "x" ? "par rapport à l'axe horizontal : seule l'ordonnée change de signe" : "par rapport à l'axe vertical : seule l'abscisse change de signe") + " : " + pt("A'", img[0], img[1]) + ".",
          { ctx: "sym-" + s, guide: [GS("Abscisse du symétrique ?", img[0], M(img[0]) + "."), GS("Ordonnée du symétrique ?", img[1], M(img[1]) + ". On demande " + (ask ? "l'ordonnée" : "l'abscisse") + " : " + M(img[ask]) + "."), GS("Réponse ?", img[ask], M(img[ask]) + ".")],
            traps: [TR(ask ? y : x, "Pour cette symétrie, " + (ask ? "l'ordonnée" : "l'abscisse") + " change " + (img[ask] === (ask ? y : x) ? "pas" : "de signe") + "."), TR(-img[ask], "Revois quelle coordonnée change de signe.")] }); },
    ],
    2: [
      () => { const x1 = R.int(-5, -1), y1 = R.int(-4, -1), w = R.int(3, 6), h = R.int(2, 5), s = R.int(1, 3), D = [x1 + s, y1 + h];
        return Qv("Trois sommets d'un parallélogramme " + M("ABCD") + " sont " + pt("A", x1, y1) + ", " + pt("B", x1 + w, y1) + " et " + pt("C", x1 + w + s, y1 + h) + ". Quelle est l'abscisse du sommet " + M("D") + " ?", D[0],
          "Pour aller de " + M("B") + " à " + M("C") + ", on avance de " + M(s) + " et on monte de " + M(h) + " ; de même de " + M("A") + " à " + M("D") + " : " + pt("D", D[0], D[1]) + ".",
          { ctx: "parallelogramme", fig: FIG.plot([], [[x1, y1, "A"], [x1 + w, y1, "B"], [x1 + w + s, y1 + h, "C"]], { numbers: true }), guide: [GS("De " + M("B") + " à " + M("C") + ", de combien avance-t-on horizontalement ?", s, M(s) + "."), GS("On fait le même déplacement depuis " + M("A") + " : abscisse de " + M("D") + " ?", D[0], M(x1 + " + " + s + " = " + D[0]) + ".")],
            traps: [TR(x1, "C'est l'abscisse de A ; dans un parallélogramme, D est décalé comme C l'est par rapport à B."), TR(x1 + w + s - w - s - s, "Le déplacement de B à C se reporte de A à D (même sens).")] }); },
      () => { let a, b, c, d; do { a = R.int(-6, 6); b = R.int(-6, 6); c = R.int(-6, 6); d = R.int(-6, 6); } while ((a + c) % 2 || (b + d) % 2 || (a === c && b === d) || Math.abs((a + c) / 2) < 2 || Math.abs((b + d) / 2) < 2); const ask = R.int(0, 1), m = [(a + c) / 2, (b + d) / 2];
        return Qv("Quelle est " + (ask ? "l'ordonnée" : "l'abscisse") + " du milieu " + M("M") + " du segment " + M("[AB]") + ", avec " + pt("A", a, b) + " et " + pt("B", c, d) + " ?", m[ask], "On fait la moyenne des coordonnées : " + pt("M", m[0], m[1]) + ".",
          { ctx: "milieu", guide: [GS("Somme des " + (ask ? "ordonnées" : "abscisses") + " ?", ask ? b + d : a + c, M(ask ? b + d : a + c) + "."), GS("Divisée par 2 ?", m[ask], M(m[ask]) + ".")], traps: [TR(ask ? b + d : a + c, "Il faut diviser la somme par 2."), TR(ask ? (d - b) / 2 : (c - a) / 2, "Le milieu, c'est la moyenne (somme ÷ 2), pas la demi-différence.")] }); },
      () => { const y = nz(-5, 5), x1 = R.int(-6, -1), x2 = x1 + R.int(2, 9);
        return Qv("Quelle est la longueur du segment d'extrémités " + pt("A", x1, y) + " et " + pt("B", x2, y) + " (unité : 1 carreau) ?", x2 - x1, "Même ordonnée : segment horizontal, longueur " + M(x2 + " - " + pr(x1) + " = " + (x2 - x1)) + ".",
          { ctx: "longueur", guide: [GS("Les deux points ont la même ordonnée : on soustrait les abscisses. " + M(x2 + " - " + pr(x1)) + " = ?", x2 - x1, M(x2 - x1) + ".")].concat([GS("Longueur ?", x2 - x1, M(x2 - x1) + ".")]), traps: [TR(x2 + x1, "On soustrait les abscisses (attention au signe de " + x1 + ")."), TR(Math.abs(x2) - Math.abs(x1), "Soustraire " + pr(x1) + ", c'est ajouter " + -x1 + ".")] }); },
    ],
    3: [
      () => { const x1 = R.int(-5, 0), y1 = R.int(-5, 0), w = R.int(3, 8), h = R.int(2, 6);
        return Qv("Calcule l'aire du rectangle de sommets " + pt("A", x1, y1) + ", " + pt("B", x1 + w, y1) + ", " + pt("C", x1 + w, y1 + h) + ", " + pt("D", x1, y1 + h) + " (en carreaux).", w * h, "Largeur " + M((x1 + w) + " - " + pr(x1) + " = " + w) + ", hauteur " + M((y1 + h) + " - " + pr(y1) + " = " + h) + ", aire " + M(w * h) + ".",
          { ctx: "aire", guide: [GS("Largeur " + M("AB") + " ?", w, M(w) + "."), GS("Hauteur " + M("BC") + " ?", h, M(h) + "."), GS("Aire ?", w * h, M(w * h) + ".")], traps: [TR(2 * (w + h), "Ça, c'est le périmètre."), TR((x1 + w) * (y1 + h), "Calcule les longueurs des côtés (différences des coordonnées), pas le produit des coordonnées de C.")] }); },
      () => { const a = nz(-3, 3), b = R.int(-4, 4), x = nz(-4, 4), y = a * x + b;
        return Qv("Le point " + pt("P", x, "y") + " est sur la droite d'équation " + M("y = " + lin(a, b)) + ". Que vaut " + M("y") + " ?", y, M("y = " + pr(a) + " \\cdot " + pr(x) + (b < 0 ? " - " + -b : " + " + b) + " = " + y) + ".",
          { ctx: "sur-droite", guide: [GS(M(pr(a) + " \\cdot " + pr(x)) + " = ?", a * x, M(a * x) + "."), GS(M("y") + " = ?", y, M(y) + ".")], traps: [TR(a + x + b, "On multiplie a par x."), TR(a * x - b, "Attention au signe de " + b + ".")] }); },
      () => { const x1 = R.int(-4, 1), y1 = R.int(-3, 2), x2 = x1 + R.int(2, 6), y3 = y1 + R.int(2, 6), xc = R.int(x1, x2);
        return Qv("Calcule l'aire du triangle de sommets " + pt("A", x1, y1) + ", " + pt("B", x2, y1) + " et " + pt("C", xc, y3) + " (en carreaux).", ((x2 - x1) * (y3 - y1)) / 2, "Base " + M("AB = " + (x2 - x1)) + " (horizontale), hauteur " + M((y3 - y1)) + " (écart vertical de C) : aire " + M("\\frac{" + (x2 - x1) + " \\cdot " + (y3 - y1) + "}{2} = " + String(((x2 - x1) * (y3 - y1)) / 2).replace(".", "{,}")) + ".",
          { ctx: "triangle", guide: [GS("Base " + M("AB") + " ?", x2 - x1, M(x2 - x1) + "."), GS("Hauteur (écart vertical entre C et [AB]) ?", y3 - y1, M(y3 - y1) + "."), GS("Aire ?", ((x2 - x1) * (y3 - y1)) / 2, M(String(((x2 - x1) * (y3 - y1)) / 2).replace(".", "{,}")) + ".")], traps: [TR((x2 - x1) * (y3 - y1), "Aire d'un triangle : base × hauteur ÷ 2.")] }); },
    ],
  };

  // ===================== tabval =====================
  const TAB = {
    1: [
      () => { const a = nz(-4, 5), b = nz(-8, 8), x = nz(-5, 5), v = a * x + b;
        return Qv("Soit " + M("f(x) = " + lin(a, b)) + ". Calcule " + M("f(" + x + ")") + " pour compléter le tableau de valeurs.", v, M("f(" + x + ") = " + pr(a) + " \\cdot " + pr(x) + (b < 0 ? " - " + -b : " + " + b) + " = " + v) + ".",
          { ctx: "affine", guide: [GS(M(pr(a) + " \\cdot " + pr(x)) + " = ?", a * x, M(a * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")], traps: [TR(a + x + b, "On remplace x par " + x + " et on multiplie."), TR(-a * x + b, "Attention aux signes du produit.")] }); },
      () => { const c = R.int(1, 9), x = -R.int(2, 6), v = x * x - c;
        return Qv("Soit " + M("f(x) = x^2 - " + c) + ". Calcule " + M("f(" + x + ")") + ".", v, M("f(" + x + ") = (" + x + ")^2 - " + c + " = " + x * x + " - " + c + " = " + v) + ".",
          { ctx: "carre", guide: [GS(M("(" + x + ")^2") + " = ? (un carré est positif)", x * x, M(x * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")], traps: [TR(-x * x - c, "(" + x + ")² est positif : " + x * x + "."), TR(2 * x - c, "x² n'est pas 2x.")] }); },
      () => { const a = nz(-3, 4), b = R.int(-5, 5), xs = [-2, -1, 0, 1, 2], k = R.int(0, 4), ys = xs.map((x, i) => (i === k ? "?" : a * x + b));
        return Qv("Ce tableau est celui d'une fonction affine. Complète la case « ? ». " + table(xs, ys), a * xs[k] + b, "Les valeurs augmentent de " + M(a) + " à chaque pas : la case vaut " + M(a * xs[k] + b) + ".",
          { ctx: "tableau", guide: [GS("De combien augmente " + M("f(x)") + " quand " + M("x") + " augmente de 1 ? (lis deux cases voisines connues)", a, M(a) + "."), GS("Valeur de la case « ? » ?", a * xs[k] + b, M(a * xs[k] + b) + ".")], traps: [TR(a * xs[k] + b + a, "Compte bien les pas entre la case connue et la case cherchée."), TR(a * xs[k] + b - a, "Compte bien les pas entre la case connue et la case cherchée.")] }); },
    ],
    2: [
      () => { const a = nz2(-4, 5), b = nz(-8, 8), x = nz2(-6, 7), v = a * x + b;
        return Qv("Soit " + M("f(x) = " + lin(a, b)) + ". Quel nombre a pour image " + M(v) + " ? (on cherche son antécédent)", x, M(lin(a, b) + " = " + v) + ", " + M(a + "x = " + (v - b)) + ", " + M("x = " + x) + ".",
          { ctx: "antecedent", guide: [GS("Résous " + M(lin(a, b) + " = " + v) + " : " + M(a + "x") + " = ?", v - b, M(a + "x = " + (v - b)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")], traps: [TR(a * v + b, "On cherche le x dont l'image vaut " + v + " (antécédent), pas l'image de " + v + "."), TR((v + b) / a, "Pour isoler ax, on soustrait " + b + ".")] }); },
      () => { const a = pk([2, 3, -2]), b = pk([-3, -1, 1, 4]), x = nz(-3, 3), v = a * x * x + b * x;
        return Qv("Soit " + M("f(x) = " + a + "x^2" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "x") + ". Calcule " + M("f(" + x + ")") + ".", v, M("f(" + x + ") = " + a + " \\cdot " + pr(x) + "^2 " + (b < 0 ? "-" : "+") + " " + Math.abs(b) + " \\cdot " + pr(x) + " = " + a * x * x + (b * x < 0 ? " - " + -b * x : " + " + b * x) + " = " + v) + ".",
          { ctx: "second-degre", guide: [GS(M(a + " \\cdot " + pr(x) + "^2") + " = ?", a * x * x, M(a * x * x) + "."), GS(M(b + " \\cdot " + pr(x)) + " = ?", b * x, M(b * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")], traps: [TR((a * x) ** 2 + b * x, "Le carré porte sur x seulement : a · x², pas (a · x)²."), TR(-a * x * x + b * x, "x² est positif.")] }); },
      () => { const pc = pk([5, 6, 8]), p = pk([2, 3, 2.5]), xs = [0, 5, 10, 20], k = R.int(1, 3), ys = xs.map((x, i) => (i === k ? "?" : String(+(pc + p * x).toFixed(2)).replace(".", "{,}")));
        return Qv("Une location coûte " + pc + " CHF plus " + String(p).replace(".", ",") + " CHF par heure. Complète le tableau (heures → prix en CHF). " + M("\\begin{array}{c|c|c|c|c} \\text{h} & " + xs.join(" & ") + " \\\\ \\hline \\text{CHF} & " + ys.join(" & ") + " \\end{array}"), pc + p * xs[k],
          M(pc + " + " + String(p).replace(".", "{,}") + " \\cdot " + xs[k] + " = " + String(pc + p * xs[k]).replace(".", "{,}")) + " CHF.",
          { ctx: "location", guide: [GS("Partie variable pour " + xs[k] + " h ?", p * xs[k], M(String(p * xs[k]).replace(".", "{,}")) + " CHF."), GS("Prix total ?", pc + p * xs[k], M(String(pc + p * xs[k]).replace(".", "{,}")) + " CHF.")], traps: [TR(p * xs[k], "N'oublie pas les " + pc + " CHF de base."), TR((pc + p) * xs[k], "La partie fixe ne se paie qu'une fois.")] }); },
    ],
    3: [
      () => { const a = nz(-4, 4), b = R.int(-6, 6), xs = [-2, 1, 3, 6], ys = xs.map((x) => a * x + b);
        return Qv("Ce tableau est celui d'une fonction affine " + M("f(x) = ax + b") + ". " + table(xs, ys) + " Que vaut la pente " + M("a") + " ?", a, "Entre " + M("x = 1") + " et " + M("x = 3") + " : " + M("a = \\frac{" + ys[2] + " - " + pr(ys[1]) + "}{3 - 1} = " + a) + ".",
          { ctx: "pente", guide: [GS("Écart des images entre " + M("x = 1") + " et " + M("x = 3") + " ?", ys[2] - ys[1], M(ys[2] - ys[1]) + "."), GS("Divisé par l'écart des " + M("x") + " (2) : " + M("a") + " = ?", a, M(a) + ".")], traps: [TR(ys[2] - ys[1], "Divise par l'écart des x (ici 2) : les colonnes ne sont pas espacées de 1."), TR(ys[1], "C'est une image, pas la pente.")] }); },
      () => { const a = nz(-4, 4), b = nz(-6, 6), xs = [-2, 1, 3], ys = xs.map((x) => a * x + b);
        return Qv("Ce tableau est celui d'une fonction affine " + M("f(x) = ax + b") + ". " + table(xs, ys) + " Que vaut " + M("b = f(0)") + " ?", b, "Pente " + M("\\frac{" + ys[2] + " - " + pr(ys[1]) + "}{2} = " + a) + " ; " + M("b = f(1) - a = " + ys[1] + " - " + pr(a) + " = " + b) + ".",
          { ctx: "ordonnee", guide: [GS("Pente " + M("a") + " ?", a, M(a) + "."), GS(M("f(0) = f(1) - a") + " = ?", b, M(b) + ".")], traps: [TR(ys[1] + a, "De x = 1 à x = 0, on recule d'un pas : on retire a."), TR(ys[0], "C'est f(−2), pas f(0).")] }); },
      () => { const r = R.int(1, 4), s = R.int(1, 4), x = -R.int(1, 5), v = (x - r) * (x + s);
        return Qv("Soit " + M("f(x) = (x - " + r + ")(x + " + s + ")") + ". Calcule " + M("f(" + x + ")") + ".", v, M("f(" + x + ") = (" + x + " - " + r + ")(" + x + " + " + s + ") = " + pr(x - r) + " \\cdot " + pr(x + s) + " = " + v) + ".",
          { ctx: "produit", guide: [GS("Premier facteur " + M(x + " - " + r) + " ?", x - r, M(x - r) + "."), GS("Deuxième facteur " + M(x + " + " + s) + " ?", x + s, M(x + s) + "."), GS("Produit ?", v, M(v) + ".")], traps: [TR(-v, "Attention au signe du produit (règle des signes)."), TR((x - r) + (x + s), "C'est un produit, pas une somme.")] }); },
    ],
  };

  const PROBS = {
    repere: [
      () => P("Un parallélogramme ABCD a pour sommets A(1 ; 1), B(6 ; 1) et C(8 ; 4).", [["a) Abscisse de D", 3], ["b) Ordonnée de D", 4], ["c) Aire (en carreaux)", 15]], ["Le vecteur AB se reporte de D à C : D = C − (B − A).", "Aire = base × hauteur."], "a) b) D(3 ; 4) ; c) " + M("5 \\cdot 3 = 15") + "."),
      () => P("Le point M(2 ; 3) est le milieu de [AB], avec A(−1 ; 5).", [["a) Abscisse de B", 5], ["b) Ordonnée de B", 1]], ["Le milieu est la moyenne : (−1 + x_B) ÷ 2 = 2.", "Idem pour les ordonnées."], "B(5 ; 1)."),
    ],
    tabval: [
      () => P("Une bougie de 20 cm diminue de 1,5 cm par heure. On note h(t) sa hauteur après t heures.", [["a) h(2)", 17], ["b) h(6)", 11], ["c) Après combien d'heures mesure-t-elle 8 cm ?", 8]], ["h(t) = 20 − 1,5 t.", "c) Résous 20 − 1,5 t = 8."], "a) 17 ; b) 11 ; c) 8 h."),
      () => P("Soit f(x) = x² − 4x.", [["a) f(−1)", 5], ["b) f(2)", -4], ["c) f(5)", 5], ["d) Un autre nombre que 5 qui a pour image 5", -1]], ["Remplace x et calcule.", "d) Regarde a)."], "a) 5 ; b) −4 ; c) 5 ; d) −1."),
    ],
  };

  const ALL = { repere: REP, tabval: TAB };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    repere: "Un point s'écrit (abscisse ; ordonnée) : l'abscisse se lit sur l'axe horizontal, l'ordonnée sur l'axe vertical. Milieu : moyenne des coordonnées.",
    tabval: "Pour compléter un tableau, remplace x par la valeur de la colonne et calcule. Pour un antécédent, cherche la colonne où f(x) vaut le nombre donné.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    repere: ["Lire des coordonnées, distance aux axes, symétries", "Sommet d'un rectangle, milieu, longueur", "Aires, point sur une droite"],
    tabval: ["Calculer une image, compléter un tableau", "Antécédent, 2e degré, situation", "Pente et ordonnée à l'origine depuis un tableau"],
  });
})();
