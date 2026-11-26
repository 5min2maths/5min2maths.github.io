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
        return Qv("Soit " + M("f(x) = " + lin(a, b)) + ". Quel nombre a pour image " + M(v) + " ? (on cherche sa préimage)" /* 26.11 soir : usage suisse (FR_WORDS → son antécédent) */, x, M(lin(a, b) + " = " + v) + ", " + M(a + "x = " + (v - b)) + ", " + M("x = " + x) + ".",
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
      () => { const a = R.pick([-4, -3, -2, 2, 3, 4]), b = R.int(-6, 6), xs = [-2, 1, 3, 6], ys = xs.map((x) => a * x + b); // 24.11 : pente ≠ ±1 (robot)
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

  // « Trouve l'erreur » (24.11, chantier I) : pente calculée « horizontal sur vertical ».
  TAB[2].push(() => { const a = R.pick([2, 3, -2, -3, 4]), x1 = R.int(-3, 1), dx = R.int(1, 3), y1 = R.int(-4, 4), x2 = x1 + dx, y2 = y1 + a * dx, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Une droite passe par " + M("A(" + x1 + " ; " + y1 + ")") + " et " + M("B(" + x2 + " ; " + y2 + ")") + ". " + w + " calcule sa pente : « " + M("\\frac{" + x2 + " - " + par(x1) + "}{" + y2 + " - " + par(y1) + "} = " + frac(dx, a * dx)) + " ». Trouve l'erreur, puis donne la bonne pente.", a,
      "Erreur : la pente, c'est la variation <b>verticale</b> divisée par la variation <b>horizontale</b> : " + M("\\frac{" + y2 + " - " + par(y1) + "}{" + x2 + " - " + par(x1) + "} = \\frac{" + a * dx + "}{" + dx + "} = " + a) + ".",
      { ctx: "erreur", guide: [GS("Variation verticale " + M("y_B - y_A") + " ?", a * dx, M(a * dx) + "."), GS("Variation horizontale " + M("x_B - x_A") + " ?", dx, M(dx) + "."), GS("Pente = vertical : horizontal ?", a, M(a) + ".")],
        traps: [TRAP(1 / a, "C'est le calcul de " + w + " : le quotient est à l'envers.")] }); });
  // ===================== Chantier X (24.11) : lecture sur figure =====================
  // L'élève LIT sur le repère (coordonnées, image, antécédent) ; les coordonnées ne sont jamais écrites sur la figure.
  // Points sur des valeurs entières (demi-unités signalées dans l'énoncé) ; FIG.plot agrandit son cadre pour les points.
  const PAIRQ = " Réponds « x ; y ».";
  const Qp = (q, vals, sol, o = {}) => { const same = (V) => V.length === vals.length && V.every((v, i) => Math.abs(v - vals[i]) < 1e-9), seen = new Set();
    const traps = (o.traps || []).filter((t) => t && t.spec && t.spec.values.every(isFinite) && !same(t.spec.values) && !seen.has(t.spec.values.join(";")) && seen.add(t.spec.values.join(";")));
    const x = { q, spec: { kind: "pair", values: vals }, sol, guide: o.guide, traps, ctx: o.ctx, canon: vals.join(" ; ") }; if (o.fig) x.fig = o.fig; return x; };
  const GPr = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const TPr = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const dT = (v) => String(v).replace(".", "{,}");
  const NOMS = ["A", "B", "C", "D", "E", "M", "P", "R"];
  // Points distincts aux coordonnées entières (ni sur les axes si noAxis).
  const lattice = (n, lo, hi, noAxis = true) => { const L = []; let g = 0; while (L.length < n && g++ < 500) { const x = R.int(lo, hi), y = R.int(lo, hi); if (noAxis && (!x || !y)) continue; if (L.some((p) => (p[0] === x && p[1] === y) || (p[0] === y && p[1] === x))) continue; L.push([x, y]); } return L; };
  const repFig = (pts, o = {}) => FIG.plot([], pts, Object.assign({ numbers: true, xr: [-5, 5], yr: [-5, 5] }, o));
  REP[1].push(
    () => { const P3 = lattice(3, -5, 5), k = R.int(0, 2), nm = pk([["A", "B", "C"], ["D", "E", "F"], ["P", "Q", "R"]]), [x, y] = P3[k]; if (Math.abs(x) === Math.abs(y) || Math.abs(x) < 2 && Math.abs(y) < 2) return null;
      return Qp("Lis sur le graphique les coordonnées du point " + M(nm[k]) + "." + PAIRQ, [x, y], M(nm[k]) + " est " + (x < 0 ? "à gauche" : "à droite") + " de l'axe vertical (abscisse " + M(x) + ") et " + (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal (ordonnée " + M(y) + ") : " + pt(nm[k], x, y) + ".",
        { ctx: "lire-coord", fig: repFig(P3.map((p, i) => [p[0], p[1], nm[i]])), guide: [GS("Abscisse de " + M(nm[k]) + " : descends (ou monte) jusqu'à l'axe horizontal. Valeur ?", x, M(x) + "."), GS("Ordonnée : va horizontalement jusqu'à l'axe vertical. Valeur ?", y, M(y) + "."), GPr("Coordonnées « x ; y » ?", [x, y], pt(nm[k], x, y) + ".")],
          traps: [TPr([y, x], "Un point s'écrit (abscisse ; ordonnée) : l'axe horizontal d'abord."), TPr([x, -y], "Le point est " + (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal : vérifie le signe de l'ordonnée."), TPr([-x, y], "Le point est " + (x < 0 ? "à gauche" : "à droite") + " de l'axe vertical : vérifie le signe de l'abscisse.")] }); },
    () => { const k = nz2(-5, 5), y = nz2(-5, 5); if (Math.abs(y) === Math.abs(k)) return null; let yd; do yd = nz2(-5, 5); while (Math.abs(yd) === Math.abs(k) || yd === y);
      const extra = lattice(1, -5, 5).filter((p) => p[0] !== k && p[1] !== k && p[0] !== yd), pts = [[k, y], [yd, k]].concat(extra).sort(() => R.rand() - 0.5).map((p, i) => [p[0], p[1], NOMS[i]]);
      const T = pts.find((p) => p[0] === k && p[1] === y);
      return Qv("Sur le graphique, un seul point a pour abscisse " + M(k) + ". Quelle est son ordonnée ?", y, "Le point d'abscisse " + M(k) + " est " + pt(T[2], k, y) + " : son ordonnée est " + M(y) + ".",
        { ctx: "abscisse-donnee", fig: repFig(pts), guide: [GS("L'abscisse se lit sur l'axe horizontal : repère " + M(k) + " sur cet axe et monte (ou descends) jusqu'au point. Puis lis la hauteur du point sur l'axe vertical : ?", y, M(y) + " (point " + M(T[2]) + ").")],
          traps: [TR(yd, "Tu as pris le point dont l'ORDONNÉE vaut " + k + ". On cherche celui dont l'abscisse (axe horizontal) vaut " + k + "."), TR(-y, "Attention au signe : le point est " + (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal."), TR(k, "On donne l'abscisse " + k + " ; on demande l'ordonnée du point.")] }); },
  );
  REP[2].push(
    () => { const hor = R.rand() < 0.5, c = nz2(-4, 4), a = -R.int(1, 5), b = R.int(1, 5), A = hor ? [a, c] : [c, a], B = hor ? [b, c] : [c, b];
      return Qv("Lis les coordonnées de " + M("A") + " et de " + M("B") + " sur le graphique, puis calcule la longueur " + M("AB") + " (unité : 1 carreau).", b - a, pt("A", A[0], A[1]) + " et " + pt("B", B[0], B[1]) + " : même " + (hor ? "ordonnée" : "abscisse") + ", segment " + (hor ? "horizontal" : "vertical") + ". " + M("AB = " + b + " - " + pr(a) + " = " + (b - a)) + ".",
        { ctx: "longueur-lue", fig: repFig([[A[0], A[1], "A"], [B[0], B[1], "B"]], { segs: [[A[0], A[1], B[0], B[1], "f-accent"]] }), guide: [GS((hor ? "Abscisse" : "Ordonnée") + " de " + M("A") + " ?", a, M(a) + "."), GS((hor ? "Abscisse" : "Ordonnée") + " de " + M("B") + " ?", b, M(b) + "."), GS("Longueur " + M(b + " - " + pr(a)) + " = ?", b - a, M(b - a) + " carreaux (compte-les pour vérifier).")],
          traps: [TR(b + a, "Soustrais les " + (hor ? "abscisses" : "ordonnées") + " : " + b + " − (" + a + ") = " + b + " + " + -a + "."), TR(Math.abs(c), "Ça, c'est la distance à l'axe ; on cherche la longueur du segment.")] }); },
    () => { let a, b, c, d; do { a = R.int(-5, 5); b = R.int(-5, 5); c = R.int(-5, 5); d = R.int(-5, 5); } while (!a || !b || !c || !d || (a + c) % 2 || (b + d) % 2 || Math.abs(a - c) < 2 || Math.abs(b - d) < 2 || Math.abs((a + c) / 2) < 2 && Math.abs((b + d) / 2) < 2); const ask = R.int(0, 1), m = [(a + c) / 2, (b + d) / 2]; if (Math.abs(m[ask]) < 2) return null;
      return Qv("Lis les coordonnées de " + M("A") + " et " + M("B") + " sur le graphique. Quelle est " + (ask ? "l'ordonnée" : "l'abscisse") + " du milieu " + M("M") + " de " + M("[AB]") + " ?", m[ask], pt("A", a, b) + ", " + pt("B", c, d) + " : moyenne des " + (ask ? "ordonnées" : "abscisses") + ", " + M("\\frac{" + (ask ? b : a) + " + " + pr(ask ? d : c) + "}{2} = " + m[ask]) + ".",
        { ctx: "milieu-lu", fig: repFig([[a, b, "A"], [c, d, "B"]], { segs: [[a, b, c, d]] }), guide: [GS((ask ? "Ordonnée" : "Abscisse") + " de " + M("A") + " ?", ask ? b : a, M(ask ? b : a) + "."), GS((ask ? "Ordonnée" : "Abscisse") + " de " + M("B") + " ?", ask ? d : c, M(ask ? d : c) + "."), GS("Moyenne des deux ?", m[ask], M(m[ask]) + ".")],
          traps: [TR(m[1 - ask], "Ça, c'est " + (ask ? "l'abscisse" : "l'ordonnée") + " du milieu."), TR(ask ? b + d : a + c, "Divise la somme par 2."), TR(ask ? (d - b) / 2 : (c - a) / 2, "Le milieu, c'est la moyenne (somme ÷ 2), pas la demi-différence.")] }); },
    () => { const ask = R.int(0, 1), hx = R.int(-4, 3) + 0.5, iy = nz2(-4, 4), P = ask ? [iy, hx] : [hx, iy], v = P[ask];
      return Qv("Le point " + M("P") + " est à mi-chemin entre deux lignes du quadrillage. Lis son " + (ask ? "ordonnée" : "abscisse") + " (nombre décimal).", v, M("P") + " est entre les graduations " + M(dT(Math.floor(v))) + " et " + M(dT(Math.ceil(v))) + " de l'axe " + (ask ? "vertical" : "horizontal") + ", au milieu : " + M(dT(v)) + ".",
        { ctx: "demi-unite", fig: repFig([[P[0], P[1], "P"]]), guide: [GS("Entre quelles graduations de l'axe " + (ask ? "vertical" : "horizontal") + " est " + M("P") + " ? La plus petite ?", Math.floor(v), M(Math.floor(v)) + " (et " + M(Math.ceil(v)) + ")."), GS("Le milieu des deux ?", v, M(dT(v)) + ".")],
          traps: [TR(Math.floor(v), "Le point est au milieu entre deux lignes : ajoute 0,5."), TR(Math.ceil(v), "Le point est au milieu entre deux lignes, pas sur la ligne."), TR(P[1 - ask], "Ça, c'est " + (ask ? "l'abscisse" : "l'ordonnée") + " (l'autre axe).")] }); },
  );
  REP[3].push(
    () => { const x1 = R.int(-5, -1), x2 = x1 + R.int(3, 7), y1 = R.int(-4, -1), xc = R.int(-4, 4), yc = y1 + R.int(3, 7), A = ((x2 - x1) * (yc - y1)) / 2;
      return Qv("Lis les coordonnées des sommets du triangle " + M("ABC") + " sur le graphique, puis calcule son aire (en carreaux).", A, pt("A", x1, y1) + ", " + pt("B", x2, y1) + ", " + pt("C", xc, yc) + ". Base " + M("AB = " + (x2 - x1)) + " (horizontale), hauteur " + M(yc + " - " + pr(y1) + " = " + (yc - y1)) + " : aire " + M("\\frac{" + (x2 - x1) + " \\cdot " + (yc - y1) + "}{2} = " + dT(A)) + ".",
        { ctx: "aire-lue", fig: repFig([[x1, y1, "A"], [x2, y1, "B"], [xc, yc, "C"]], { polys: [[[x1, y1], [x2, y1], [xc, yc]]] }), guide: [GS("Base " + M("AB") + " (écart des abscisses de A et B) ?", x2 - x1, M(x2 + " - " + pr(x1) + " = " + (x2 - x1)) + "."), GS("Hauteur : écart vertical entre " + M("C") + " et la droite " + M("(AB)") + " ?", yc - y1, M(yc + " - " + pr(y1) + " = " + (yc - y1)) + "."), GS("Aire ?", A, M(dT(A)) + " carreaux.")],
          traps: [TR((x2 - x1) * (yc - y1), "Aire d'un triangle : base × hauteur ÷ 2."), TR(((x2 - x1) * yc) / 2, "La hauteur se mesure depuis la base AB (ordonnée " + y1 + "), pas depuis l'axe horizontal.")] }); },
    () => { const P2 = lattice(2, -4, 4), [A, B] = P2, S = [2 * B[0] - A[0], 2 * B[1] - A[1]]; if (Math.abs(S[0]) > 9 || Math.abs(S[1]) > 9 || (A[0] === B[0] || A[1] === B[1])) return null;
      return Qp("Le point " + M("A'") + " est le symétrique de " + M("A") + " par rapport au point " + M("B") + " (" + M("B") + " est le milieu de " + M("[AA']") + "). Lis les coordonnées de " + M("A") + " et " + M("B") + ", puis donne celles de " + M("A'") + "." + PAIRQ, S,
        "De " + M("A") + " à " + M("B") + " : " + M((B[0] - A[0] < 0 ? "" : "+") + (B[0] - A[0])) + " horizontalement, " + M((B[1] - A[1] < 0 ? "" : "+") + (B[1] - A[1])) + " verticalement ; on refait le même déplacement depuis " + M("B") + " : " + pt("A'", S[0], S[1]) + ".",
        { ctx: "sym-centre", fig: repFig([[A[0], A[1], "A"], [B[0], B[1], "B"]]), guide: [GS("Déplacement horizontal de " + M("A") + " à " + M("B") + " (négatif vers la gauche) ?", B[0] - A[0], M(B[0] + " - " + pr(A[0]) + " = " + (B[0] - A[0])) + "."), GS("Déplacement vertical ?", B[1] - A[1], M(B[1] + " - " + pr(A[1]) + " = " + (B[1] - A[1])) + "."), GPr("On refait ce déplacement depuis " + M("B") + " : coordonnées de " + M("A'") + " ?", S, pt("A'", S[0], S[1]) + ".")],
          traps: [TPr([-A[0], -A[1]], "Ça, c'est le symétrique par rapport à l'origine ; ici le centre est B."), TPr([B[0] - A[0], B[1] - A[1]], "Ça, c'est le déplacement de A à B ; ajoute-le aux coordonnées de B."), TPr([S[1], S[0]], "x d'abord, puis y.")] }); },
  );

  const tabFig = (fns, pts = [], o = {}) => FIG.plot(fns, pts, Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  TAB[1].push(
    () => { const a = pk([2, -2, 3, -3, 1, -1]), b = R.int(-3, 3), xs = [-3, -2, -1, 1, 2, 3].filter((x) => Math.abs(a * x + b) <= 6 && Math.abs(a * x + b) >= 2 && Math.abs(a * x + b) !== Math.abs(x)); if (!xs.length) return null; const k = pk(xs), v = a * k + b;
      return Qv("La droite représente la fonction " + M("f") + ". Lis sur le graphique la valeur qui manque dans le tableau : " + table([k], ["?"]), v, "On part de " + M("x = " + k) + " sur l'axe horizontal, on va verticalement jusqu'à la droite, puis horizontalement jusqu'à l'axe vertical : " + M("f(" + k + ") = " + v) + ".",
        { ctx: "lire-image", fig: tabFig([{ f: (x) => a * x + b }]), guide: [GS("Repère " + M("x = " + k) + " sur l'axe horizontal, va jusqu'à la droite. À quelle hauteur est le point de la droite ?", v, M(v) + ".")],
          traps: [TR(k, "f(" + k + ") est une hauteur (axe vertical), pas l'abscisse " + k + "."), TR(-v, "Le point de la droite est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal."), TR(b, "Ça, c'est f(0), là où la droite coupe l'axe vertical.")] }); },
    () => { const a = pk([2, -2, 3, -3]), b = R.int(-3, 3), xs = [-3, -2, 2, 3].filter((x) => Math.abs(a * x + b) <= 6 && Math.abs(a * x + b) >= 2 && Math.abs(a * x + b) !== Math.abs(x)); if (!xs.length) return null; const k = pk(xs), v = a * k + b;
      return Qv("La droite représente la fonction " + M("f") + ". Pour quelle valeur de " + M("x") + " a-t-on " + M("f(x) = " + v) + " ? Lis-la sur le graphique.", k, "On part de " + M(v) + " sur l'axe vertical, on va horizontalement jusqu'à la droite, puis verticalement jusqu'à l'axe horizontal : " + M("x = " + k) + ".",
        { ctx: "lire-antecedent", fig: tabFig([{ f: (x) => a * x + b }]), guide: [GS("Repère " + M(v) + " sur l'axe VERTICAL, va horizontalement jusqu'à la droite. Abscisse du point atteint ?", k, M(k) + ".")],
          traps: [TR(a * v + b, "Ça, c'est f(" + v + ") (image). On cherche le x dont l'image vaut " + v + " : pars de l'axe vertical."), TR(-k, "Le point est " + (k < 0 ? "à gauche" : "à droite") + " de l'axe vertical."), TR(v, "On cherche une abscisse, pas la valeur " + v + " donnée.")] }); },
  );
  TAB[2].push(
    () => { const s = pk([1, -1]), h = R.int(-2, 2), c = s > 0 ? R.int(-6, -2) : R.int(2, 6), f = (x) => s * (x - h) ** 2 + c, xs = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].filter((x) => x !== h && Math.abs(f(x)) <= 6 && Math.abs(f(x)) >= 2); if (xs.length < 3) return null;
      const side = R.rand() < 0.5 ? xs.filter((x) => x > h) : xs.filter((x) => x < h); if (side.length < 3) return null; /* un seul côté du sommet : trois valeurs distinctes */
      const pick3 = side.sort(() => R.rand() - 0.5).slice(0, 3).sort((u, w) => u - w), k = R.int(0, 2), v = f(pick3[k]); if (pick3.some((x) => Math.abs(x) === Math.abs(v))) return null;
      return Qv("La courbe représente la fonction " + M("f") + ". Complète le tableau en lisant le graphique : " + table(pick3, pick3.map((x, i) => (i === k ? "?" : f(x)))), v, "Au-dessus (ou au-dessous) de " + M("x = " + pick3[k]) + ", le point de la courbe est à la hauteur " + M(v) + " : " + M("f(" + pick3[k] + ") = " + v) + ".",
        { ctx: "tableau-lu", fig: tabFig([{ f }], [], { yr: [-6, 6] }), guide: [GS("Vérifie une case connue : " + M("f(" + pick3[(k + 1) % 3] + ")") + " lu sur la courbe ?", f(pick3[(k + 1) % 3]), M(f(pick3[(k + 1) % 3])) + " : c'est bien la valeur du tableau."), GS("Même méthode pour " + M("x = " + pick3[k]) + " : hauteur du point de la courbe ?", v, M(v) + ".")],
          traps: [TR(pick3[k], "f(" + pick3[k] + ") se lit sur l'axe vertical."), TR(-v, "Le point est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5]), h = R.int(-3, 2), d = pk([1, 2, 3]), c = s > 0 ? R.int(-6, -2) : R.int(2, 6), f = (x) => s * (x - h) ** 2 + c, x2 = h + d, x1 = h - d, k = f(x2), big = R.rand() < 0.5, ans = big ? x2 : x1;
      if (!Number.isInteger(k) || Math.abs(k) < 2 || Math.abs(k) > 6 || Math.abs(ans) < 2 || x1 < -6 || x2 > 6 || Math.abs(ans) === Math.abs(k)) return null;
      return Qv("La courbe représente la fonction " + M("f") + ". L'équation " + M("f(x) = " + k) + " a deux solutions. Lis-les sur le graphique et donne la plus " + (big ? "grande" : "petite") + ".", ans, "La droite horizontale " + M("y = " + k) + " coupe la courbe en " + M("x = " + x1) + " et " + M("x = " + x2) + " : la plus " + (big ? "grande" : "petite") + " est " + M(ans) + ".",
        { ctx: "deux-antecedents", fig: tabFig([{ f }], [], { hlines: [k] }), guide: [GS("Repère " + M(k) + " sur l'axe vertical (droite en pointillé). Abscisse du point d'intersection de gauche ?", x1, M(x1) + "."), GS("Et de droite ?", x2, M(x2) + "."), GS("La plus " + (big ? "grande" : "petite") + " ?", ans, M(ans) + ".")],
          traps: [TR(big ? x1 : x2, "On demande la plus " + (big ? "grande" : "petite") + " des deux solutions."), TR(f(k), "Ça, c'est f(" + k + "). On cherche les x dont l'image vaut " + k + "."), TR(h, "Ça, c'est l'abscisse du sommet.")] }); },
  );
  TAB[3].push(
    () => { const a = pk([2, -2, 3, -3, 0.5, -0.5]), b = nz2(-3, 3), X = pk([8, 10, 12, -8, -10]), v = a * X + b; if (Math.abs(v) < 2) return null;
      return Qv("La droite représente une fonction affine " + M("f") + ". Lis deux valeurs sur le graphique, puis calcule " + M("f(" + X + ")") + " (hors du graphique).", v, "On lit " + M("f(0) = " + b) + " et " + M("f(2) = " + (2 * a + b)) + " : pente " + M("a = \\frac{" + (2 * a + b) + " - " + pr(b) + "}{2} = " + dT(a)) + ". Donc " + M("f(x) = " + dT(a) + "x" + (b < 0 ? " - " + -b : " + " + b)) + " et " + M("f(" + X + ") = " + dT(v)) + ".",
        { ctx: "prolonger", fig: tabFig([{ f: (x) => a * x + b }], [[0, b, ""], [2, 2 * a + b, ""]]), guide: [GS("Lis " + M("f(0)") + " (où la droite coupe l'axe vertical) :", b, M(b) + "."), GS("Lis " + M("f(2)") + " :", 2 * a + b, M(2 * a + b) + "."), GS("Pente (variation de f quand x augmente de 1) ?", a, M(dT(a)) + "."), GS(M("f(" + X + ") = a \\cdot " + pr(X) + " + b") + " = ?", v, M(dT(v)) + ".")],
          traps: [TR(a * X, "N'oublie pas l'ordonnée à l'origine " + b + "."), TR(b * X + a, "La pente multiplie x ; f(0) est le terme constant."), TR(-v, "Vérifie le signe de la pente : la droite " + (a > 0 ? "monte" : "descend") + ".")] }); },
    () => { const a = pk([2, -2, 3, -3]), b = nz2(-3, 3), x = pk([5, 6, 7, -5, -6, -7]), V = a * x + b;
      return Qv("La droite représente une fonction affine " + M("f") + ". Lis sa pente et son ordonnée à l'origine, puis trouve le nombre " + M("x") + " tel que " + M("f(x) = " + V) + " (hors du graphique).", x, "On lit " + M("b = " + b) + " et " + M("a = " + a) + " : " + M(lin(a, b) + " = " + V) + ", " + M(a + "x = " + (V - b)) + ", " + M("x = " + x) + ".",
        { ctx: "antecedent-hors", fig: tabFig([{ f: (t) => a * t + b }], [[0, b, ""], [1, a + b, ""]]), guide: [GS("Ordonnée à l'origine " + M("b") + " (lue sur l'axe vertical) ?", b, M(b) + "."), GS("Pente : de combien la droite monte-t-elle (négatif si elle descend) quand on avance de 1 ?", a, M(a) + "."), GS("Résous " + M(lin(a, b) + " = " + V) + " : " + M("x") + " = ?", x, M("x = " + x) + ".")],
          traps: [TR(a * V + b, "Ça, c'est f(" + V + ") ; on cherche le x dont l'image vaut " + V + "."), TR((V + b) / a, "Pour isoler ax, on soustrait b = " + b + "."), TR(-x, "Vérifie le signe de la pente.")] }); },
  );
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
