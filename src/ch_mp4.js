// MP 4e (grade 15, filière « mp ») · chantier G du 24.11 (agent mp34). Calé sur les polycopiés CFPT MP4
// (CFPT/MP4/Polycops de cours, chapitres E à J) et le référentiel MP (S7.CO, S7.VE, S7.DP, S8.IN, S8.FP, S8.FS).
// Neuf notions nouvelles (identifiants propres à la MP) :
//   E. coordmp (distance, milieu, polaires, espace) ; F. vectmp (composantes, opérations, norme, colinéarité),
//   scalmp (produit scalaire, angle, orthogonalité, travail) ; G. droiteparam (droites paramétriques) ;
//   H. ineqmp (inéquations, tableau des signes) ; I. fctmp (réciproque, parité, transformations, composition),
//   polymp (polynômes : zéros, division, signe) ; J. sinusmp (fonctions sinusoïdales), explogfn (fonctions exp. et log.).
// Ajout du 24.11 (agent mp4plus) : pvectmp (produit vectoriel, « facultatif » dans le polycopié MP4, chap. F, leçon 5) ;
//   question avec graphique « signe lu sur la courbe » dans ineqmp (N2) et polymp (N3).
// Ajouts du 24.11 (agent greste) : projmp (projection orthogonale), posdroites (position relative de deux droites),
//   fratmp (fonctions rationnelles simples) ; questions avec graphique (sinusoïde, exponentielle, hyperbole : FIG.plot).
// Même standard que src/ch_mp3.js, dont il reprend les outils (MP34H).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof window === "undefined" || !window.MP34H) return;
  const { pk, nz, r6, den, fS, N, T, fT, pT, sg, tm, polyT, lin, D, sortU, setT, mk, QN, QS, QX, QP, G, GSet, GX, GP, TR, TS, TX, TP, P } = window.MP34H;
  const l10 = Math.log10, PI = Math.PI, DEG = 180 / PI;
  const v2 = (a, b) => "\\begin{pmatrix} " + a + " \\\\ " + b + " \\end{pmatrix}";
  const v3 = (a, b, c) => "\\begin{pmatrix} " + a + " \\\\ " + b + " \\\\ " + c + " \\end{pmatrix}";
  const pt = (...c) => M("(" + c.map(fT).join(" \\,;\\, ") + ")");
  const ptN = (name, ...c) => M(name + "(" + c.map(fT).join(" \\,;\\, ") + ")");
  const PAIR = " Réponds « x ; y ».", TRIP = " Réponds « x ; y ; z ».";
  // inégalités et intervalles
  const QI = (q, op, value, sol, o) => mk(q, { kind: "ineq", op, value }, sol, o);
  const QSS = (q, ivs, sol, o) => mk(q, { kind: "solset", ivs }, sol, o);
  const GI = (ask, op, value, sol) => ({ ask, spec: { kind: "ineq", op, value }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: { kind: "solset", ivs }, sol });
  const TI = (op, value, m) => ({ spec: { kind: "ineq", op, value }, m });
  const TSS = (ivs, m) => ({ spec: { kind: "solset", ivs }, m });
  const opT = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" }, flip = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };
  const ivT = (ivs) => (typeof SolSet !== "undefined" ? SolSet.show(ivs, true) : "");
  const INF = Infinity;
  const TRI2 = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [8, 15, 17], [9, 12, 15]];
  const TRI3 = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 2, 1, 3]];
  const sgn = () => (R.rand() < 0.5 ? -1 : 1);
  const perm = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));

  // ===================================== E. coordmp : coordonnées =====================================
  const CO = {
    1: [
      () => { const [a, b, c] = pk(TRI2), dx = a * sgn(), dy = b * sgn(), x1 = R.int(-5, 5), y1 = R.int(-5, 5), x2 = x1 + dx, y2 = y1 + dy;
        return QN("Calcule la distance entre " + ptN("A", x1, y1) + " et " + ptN("B", x2, y2) + ".", c, M("AB = \\sqrt{(" + x2 + " - " + pT(x1) + ")^2 + (" + y2 + " - " + pT(y1) + ")^2} = \\sqrt{" + a * a + " + " + b * b + "} = " + c) + ".",
          { ctx: "distance-plan", guide: [G("Écart horizontal " + M("x_B - x_A") + " ?", dx, M(dx) + "."), G("Écart vertical " + M("y_B - y_A") + " ?", dy, M(dy) + "."), G("Distance ?", c, M("\\sqrt{" + dx * dx + " + " + dy * dy + "} = " + c) + ".")],
            traps: [TR(Math.abs(dx) + Math.abs(dy), "On n'additionne pas les écarts : Pythagore, √(Δx² + Δy²)."), TR(c * c, "N'oublie pas la racine carrée."), TR(Math.hypot(x1 + x2, y1 + y2), "On soustrait les coordonnées (écarts), on ne les additionne pas.")] }); },
      () => { const x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = R.int(-6, 6), y2 = R.int(-6, 6); if (x1 === x2 || y1 === y2) return null; const m = [(x1 + x2) / 2, (y1 + y2) / 2];
        return QP("Donne le milieu " + M("M") + " de " + M("[AB]") + " avec " + ptN("A", x1, y1) + " et " + ptN("B", x2, y2) + "." + PAIR + " (fractions ou décimaux acceptés)", m, "Moyenne des coordonnées : " + M("M = \\left(\\frac{" + x1 + sg(x2) + "}{2} \\,;\\, \\frac{" + y1 + sg(y2) + "}{2}\\right)") + " = " + pt(...m) + ".",
          { ctx: "milieu-plan", guide: [G("Abscisse du milieu ?", m[0], M(fT(m[0])) + "."), G("Ordonnée du milieu ?", m[1], M(fT(m[1])) + "."), GP("Milieu ?", m, pt(...m) + ".")],
            traps: [TP([(x2 - x1) / 2, (y2 - y1) / 2], "Le milieu est la moyenne : (x_A + x_B) ÷ 2."), TP([x1 + x2, y1 + y2], "N'oublie pas de diviser par 2."), TP([m[1], m[0]], "Le point s'écrit (x ; y).")] }); },
      () => { const [a, b, c, d] = pk(TRI3), p = perm([a, b, c]).map((v) => v * sgn()), A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], B = A.map((v, i) => v + p[i]);
        return QN("Calcule la distance entre " + ptN("A", ...A) + " et " + ptN("B", ...B) + " (dans l'espace).", d, M("AB = \\sqrt{" + p.map((v) => pT(v) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "distance-espace", guide: [G("Somme des carrés des trois écarts ?", d * d, M(p.map((v) => v * v).join(" + ") + " = " + d * d) + "."), G("Distance ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")],
            traps: [TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Pythagore dans l'espace : √(Δx² + Δy² + Δz²)."), TR(d * d, "N'oublie pas la racine."), TR(Math.hypot(p[0], p[1]), "Il y a trois coordonnées : n'oublie pas Δz.")] }); },
    ],
    2: [
      () => { const xa = R.int(-6, 6), ya = R.int(-6, 6), xm = R.int(-5, 5), ym = R.int(-5, 5); if (xa === xm || ya === ym) return null; const B = [2 * xm - xa, 2 * ym - ya];
        return QP(ptN("M", xm, ym) + " est le milieu de " + M("[AB]") + " avec " + ptN("A", xa, ya) + ". Donne les coordonnées de " + M("B") + "." + PAIR, B, M("x_B = 2x_M - x_A = " + B[0]) + ", " + M("y_B = 2y_M - y_A = " + B[1]) + " : " + ptN("B", ...B) + ".",
          { ctx: "symetrique", guide: [G(M("x_B = 2x_M - x_A") + " = ?", B[0], M("2 \\cdot " + pT(xm) + " - " + pT(xa) + " = " + B[0]) + "."), G(M("y_B") + " = ?", B[1], M(B[1]) + "."), GP("Point " + M("B") + " ?", B, ptN("B", ...B) + ".")],
            traps: [TP([(xa + xm) / 2, (ya + ym) / 2], "M est le milieu de [AB] : on cherche B tel que (x_A + x_B) ÷ 2 = x_M."), TP([xm - xa, ym - ya], "B = 2M − A (on reporte le vecteur AM à partir de M).")] }); },
      () => { const t = R.int(0, 2), th = pk([[0, 90, 180, 270], [30, 60, 120, 150, 210, 240, 300, 330], [45, 135, 225, 315]][t]), r = t === 0 ? R.int(2, 9) : 2 * R.int(1, 4), k = t === 2 ? R.int(1, 4) : 0;
        const rr = k ? k * Math.SQRT2 : r, cl = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v), X = cl(rr * Math.cos(th / DEG)), Y = cl(rr * Math.sin(th / DEG));
        const rT = k ? (k === 1 ? "" : k) + "\\sqrt{2}" : r, ex = (v) => { const a = Math.abs(v), s = v < 0 ? "-" : ""; if (Number.isInteger(a)) return s + a; const q3 = a / Math.sqrt(3); return Math.abs(q3 - Math.round(q3)) < 1e-9 ? s + (Math.round(q3) === 1 ? "" : Math.round(q3)) + "\\sqrt{3}" : s + N(a); };
        return QP("Convertis en coordonnées cartésiennes le point de coordonnées polaires " + M("(r \\,;\\, \\theta) = (" + rT + " \\,;\\, " + th + "°)") + "." + PAIR + " (√ accepté)", [X, Y], M("x = r\\cos\\theta = " + ex(X)) + ", " + M("y = r\\sin\\theta = " + ex(Y)) + " : " + M("(" + ex(X) + " \\,;\\, " + ex(Y) + ")") + ".",
          { ctx: "polaire-vers-cart", guide: [G(M("x = r \\cos \\theta") + " = ?", X, M(ex(X)) + "."), G(M("y = r \\sin \\theta") + " = ?", Y, M(ex(Y)) + "."), GP("Point ?", [X, Y], M("(" + ex(X) + " \\,;\\, " + ex(Y) + ")") + ".")],
            traps: [TP([Y, X], "x = r cos θ et y = r sin θ (le cosinus pour x)."), TP([Math.abs(X), Math.abs(Y)], "Attention aux signes selon le quadrant.")] }); },
      () => { const t = R.int(0, 2); let x, y, r, th, rT;
        if (t === 0) { const k = R.int(1, 5); th = pk([45, 135, 225, 315]); x = k * Math.sign(Math.cos(th / DEG)); y = k * Math.sign(Math.sin(th / DEG)); r = k * Math.SQRT2; rT = (k === 1 ? "" : k) + "\\sqrt{2}"; }
        else if (t === 1) { const a = R.int(2, 9); th = pk([0, 90, 180, 270]); x = Math.round(a * Math.cos(th / DEG)); y = Math.round(a * Math.sin(th / DEG)); r = a; rT = a; }
        else { const m = R.int(1, 3); th = pk([60, 120, 240, 300]); x = m * Math.sign(Math.cos(th / DEG)); y = m * Math.sqrt(3) * Math.sign(Math.sin(th / DEG)); r = 2 * m; rT = 2 * m; }
        const yT = t === 2 ? (y < 0 ? "-" : "") + (Math.abs(x) === 1 ? "" : Math.abs(x)) + "\\sqrt{3}" : fT(y);
        return QP("Convertis en coordonnées polaires le point " + M("(" + fT(x) + " \\,;\\, " + yT + ")") + ". Réponds « r ; θ » (θ en degrés, entre 0° et 360°).", [r, th], M("r = \\sqrt{x^2 + y^2} = " + rT) + " ; le point est " + (th % 90 === 0 ? "sur un axe" : "dans le quadrant " + (Math.floor(th / 90) + 1)) + ", donc " + M("\\theta = " + th + "°") + ".",
          { ctx: "cart-vers-polaire", guide: [G(M("r = \\sqrt{x^2 + y^2}") + " = ?", r, M(rT) + "."), G("Angle " + M("\\theta") + " (en degrés, attention au quadrant) ?", th, M(th + "°") + "."), GP("Coordonnées polaires ?", [r, th], M("(" + rT + " \\,;\\, " + th + "°)") + ".")],
            traps: [TP([r * r, th], "N'oublie pas la racine : r = √(x² + y²)."), TP([r, (th + 180) % 360], "Vérifie le quadrant : regarde les signes de x et de y.")] }); },
    ],
    3: [
      () => { const xa = R.int(-5, 5), ya = R.int(1, 6), xb = R.int(-5, 5), yb = R.int(1, 6); if (xa === xb || ya === yb) return null; const x = r6((xb * xb + yb * yb - xa * xa - ya * ya) / (2 * (xb - xa))); if (den(x) > 4) return null;
        return QN("Trouve le point " + M("P(x \\,;\\, 0)") + " de l'axe des abscisses situé à égale distance de " + ptN("A", xa, ya) + " et de " + ptN("B", xb, yb) + ". Que vaut " + M("x") + " ? (fraction acceptée)", x, M("PA^2 = PB^2") + " : " + M("(x" + sg(-xa) + ")^2 + " + ya * ya + " = (x" + sg(-xb) + ")^2 + " + yb * yb) + " ; les " + M("x^2") + " s'éliminent, " + M("x = " + fT(x)) + ".",
          { ctx: "equidistant", guide: [G("On écrit " + M("PA^2 = PB^2") + " ; après simplification des " + M("x^2") + ", coefficient de x, " + M("2(x_B - x_A)") + " ?", 2 * (xb - xa), M(2 * (xb - xa)) + "."), G("Membre de droite " + M("x_B^2 + y_B^2 - x_A^2 - y_A^2") + " ?", xb * xb + yb * yb - xa * xa - ya * ya, M(xb * xb + yb * yb - xa * xa - ya * ya) + "."), G(M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR((xa + xb) / 2, "Ce serait vrai si A et B avaient la même ordonnée : écris PA² = PB²."), TR(-x, "Attention au signe en isolant x.")] }); },
      () => { const a = R.int(2, 8), b = R.int(2, 8), c = R.int(1, 6), d = Math.sqrt(a * a + b * b + c * c); if (Number.isInteger(d) || a === b) return null;
        return QN("Un pavé droit mesure " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm et a un sommet à l'origine. Longueur de sa grande diagonale (au centième) ?", d, "De " + pt(0, 0, 0) + " à " + pt(a, b, c) + " : " + M("\\sqrt{" + a * a + " + " + b * b + " + " + c * c + "} = \\sqrt{" + (a * a + b * b + c * c) + "} \\approx " + D(d, 0.01)) + " cm.",
          { ctx: "diagonale", round: 0.01, guide: [G("Somme des carrés des trois dimensions ?", a * a + b * b + c * c, M(a * a + b * b + c * c) + "."), G("Diagonale (au centième) ?", d, M(D(d, 0.01)) + " cm.", 0.01)],
            traps: [TR(Math.hypot(a, b), "C'est la diagonale de la base ; dans l'espace, ajoute c²."), TR(a + b + c, "Pythagore dans l'espace : √(a² + b² + c²).")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], B = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)]; if (A.some((v, i) => v === B[i])) return null; const m = A.map((v, i) => (v + B[i]) / 2);
        return QP("Donne le milieu de " + M("[AB]") + " avec " + ptN("A", ...A) + " et " + ptN("B", ...B) + "." + TRIP + " (décimaux acceptés)", m, "Moyenne de chaque coordonnée : " + pt(...m) + ".",
          { ctx: "milieu-espace", guide: [G("Abscisse " + M("x") + " ?", m[0], M(fT(m[0])) + "."), G("Ordonnée " + M("y") + " ?", m[1], M(fT(m[1])) + "."), GP("Milieu ?", m, pt(...m) + ".")],
            traps: [TP(A.map((v, i) => (B[i] - v) / 2), "Le milieu est la moyenne : (A + B) ÷ 2."), TP(A.map((v, i) => v + B[i]), "N'oublie pas de diviser par 2.")] }); },
    ],
  };

  // ===================================== F1. vectmp : vecteurs =====================================
  const VE = {
    1: [
      () => { const A = [R.int(-6, 6), R.int(-6, 6)], B = [R.int(-6, 6), R.int(-6, 6)]; if (A[0] === B[0] || A[1] === B[1]) return null; const u = [B[0] - A[0], B[1] - A[1]];
        return QP("Donne les composantes du vecteur " + M("\\overrightarrow{AB}") + " avec " + ptN("A", ...A) + " et " + ptN("B", ...B) + "." + PAIR, u, M("\\overrightarrow{AB} = " + v2("x_B - x_A", "y_B - y_A") + " = " + v2(u[0], u[1])) + ".",
          { ctx: "composantes", guide: [G(M("x_B - x_A") + " ?", u[0], M(B[0] + " - " + pT(A[0]) + " = " + u[0]) + "."), G(M("y_B - y_A") + " ?", u[1], M(u[1]) + "."), GP("Composantes ?", u, M(v2(u[0], u[1])) + ".")],
            traps: [TP([-u[0], -u[1]], "C'est le vecteur BA : on calcule arrivée − départ."), TP([A[0] + B[0], A[1] + B[1]], "On soustrait les coordonnées : B − A.")] }); },
      () => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], a = pk([2, 3, -2]), b = pk([1, -1, 2, -3]), w = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
        const comb = co(a) + "\\vec{u}" + (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "\\vec{v}";
        return QP("Avec " + M("\\vec{u} = " + v2(u[0], u[1])) + " et " + M("\\vec{v} = " + v2(v[0], v[1])) + ", calcule " + M(comb) + "." + PAIR, w, "Composante par composante : " + M(comb + " = " + v2(w[0], w[1])) + ".",
          { ctx: "combinaison", guide: [G("Première composante ?", w[0], M(a + " \\cdot " + pT(u[0]) + " + " + pT(b) + " \\cdot " + pT(v[0]) + " = " + w[0]) + "."), G("Seconde composante ?", w[1], M(a + " \\cdot " + pT(u[1]) + " + " + pT(b) + " \\cdot " + pT(v[1]) + " = " + w[1]) + "."), GP("Vecteur ?", w, M(v2(w[0], w[1])) + ".")],
            traps: [TP([a * u[0] + v[0], a * u[1] + v[1]], "Le coefficient " + b + " multiplie aussi v."), TP([u[0] + b * v[0], u[1] + b * v[1]], "Le coefficient " + a + " multiplie chaque composante de u.")] }); },
      () => { const [a, b, c] = pk(TRI2), u = [a * sgn(), b * sgn()];
        return QN("Calcule la norme du vecteur " + M("\\vec{u} = " + v2(u[0], u[1])) + ".", c, M("\\|\\vec{u}\\| = \\sqrt{" + pT(u[0]) + "^2 + " + pT(u[1]) + "^2} = \\sqrt{" + c * c + "} = " + c) + ".",
          { ctx: "norme", guide: [G("Somme des carrés des composantes ?", c * c, M(a * a + " + " + b * b + " = " + c * c) + "."), G("Norme ?", c, M(c) + ".")],
            traps: [TR(Math.abs(u[0]) + Math.abs(u[1]), "La norme se calcule avec Pythagore."), TR(c * c, "N'oublie pas la racine."), TR(u[0] + u[1], "La norme est √(x² + y²).")] }); },
    ],
    2: [
      () => { const [a, b, c, d] = pk(TRI3), u = perm([a, b, c]).map((v) => v * sgn());
        return QN("Calcule la norme du vecteur " + M("\\vec{u} = " + v3(...u)) + ".", d, M("\\|\\vec{u}\\| = \\sqrt{" + u.map((v) => pT(v) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "norme-espace", guide: [G("Somme des carrés des trois composantes ?", d * d, M(u.map((v) => v * v).join(" + ") + " = " + d * d) + "."), G("Norme ?", d, M(d) + ".")],
            traps: [TR(Math.abs(u[0]) + Math.abs(u[1]) + Math.abs(u[2]), "La norme se calcule avec Pythagore."), TR(d * d, "N'oublie pas la racine.")] }); },
      () => { const a = nz(-4, 4), b = nz(-5, 5), k = pk([2, 3, -2, 1.5, -3]), c = r6(a * k), dd = r6(b * k); if (!Number.isInteger(c) || !Number.isInteger(dd)) return null;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M(v2(a, "m")) + " et " + M(v2(c, dd)) + " sont-ils colinéaires ?", b, "Colinéaires : le second vaut " + M(fT(k)) + " fois le premier (car " + M(c + " = " + fT(k) + " \\cdot " + pT(a)) + "), donc " + M("m = " + dd + " \\div " + pT(k) + " = " + b) + ".",
          { ctx: "colineaire", guide: [G("Rapport " + M("k") + " entre les premières composantes, " + M(c + " \\div " + pT(a)) + " ?", k, M(fT(k)) + "."), G(M("m") + " = ?", b, M(dd + " \\div " + pT(k) + " = " + b) + ".")],
            traps: [TR(dd * k, "On divise par k : la seconde composante du second vecteur vaut k · m."), TR(-b, "Attention au signe du rapport k.")] }); },
      () => { const A = [R.int(-5, 3), R.int(-5, 3)], B = [A[0] + R.int(2, 5), A[1] + R.int(-2, 3)], C = [B[0] + R.int(-2, 2), B[1] + R.int(2, 5)], Dp = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
        return QP("ABCD est un parallélogramme avec " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + ptN("C", ...C) + ". Donne les coordonnées de " + M("D") + "." + PAIR, Dp, M("\\overrightarrow{AD} = \\overrightarrow{BC} = " + v2(C[0] - B[0], C[1] - B[1])) + ", donc " + ptN("D", ...Dp) + ".",
          { ctx: "parallelogramme", guide: [GP("Composantes de " + M("\\overrightarrow{BC}") + " ?", [C[0] - B[0], C[1] - B[1]], M(v2(C[0] - B[0], C[1] - B[1])) + "."), GP(M("D = A + \\overrightarrow{BC}") + " ?", Dp, ptN("D", ...Dp) + ".")],
            traps: [TP([B[0] + C[0] - A[0], B[1] + C[1] - A[1]], "Dans ABCD, AD = BC : D = A + BC."), TP([A[0] + B[0] - C[0], A[1] + B[1] - C[1]], "Respecte l'ordre des sommets : ABCD.")] }); },
    ],
    3: [
      () => { /* audit niveau 25.11 : « exprimer w comme combinaison linéaire de u et v » (examen TASV spécifique 2024 p. 2, 2023 p. 7) */
        const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], det = u[0] * v[1] - u[1] * v[0], a = nz(-4, 4), b = nz(-4, 4); if (!det || Math.abs(a) === Math.abs(b) || (Math.abs(a) === 1 && Math.abs(b) === 1)) return null; const w = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
        return QP("Avec " + M("\\vec{u} = " + v2(...u)) + ", " + M("\\vec{v} = " + v2(...v)) + " et " + M("\\vec{w} = " + v2(...w)) + ", trouve les nombres " + M("a") + " et " + M("b") + " tels que " + M("\\vec{w} = a\\,\\vec{u} + b\\,\\vec{v}") + ". Réponds « a ; b ».", [a, b], "On résout le système " + M("\\begin{cases} " + u[0] + "a" + sg(v[0]) + "b = " + w[0] + " \\\\ " + u[1] + "a" + sg(v[1]) + "b = " + w[1] + " \\end{cases}") + " : " + M("a = " + a) + ", " + M("b = " + b) + ". Donc " + M("\\vec{w} = " + fT(a) + "\\,\\vec{u}" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "\\,\\vec{v}") + ".",
          { ctx: "combinaison-lineaire", guide: [G("Système : " + M(u[0] + "a" + sg(v[0]) + "b = " + w[0]) + " et " + M(u[1] + "a" + sg(v[1]) + "b = " + w[1]) + ". Que vaut " + M("a") + " ?", a, M("a = " + a) + "."), G("Que vaut " + M("b") + " ?", b, M("b = " + b) + "."), GP("Réponse « a ; b » ?", [a, b], M("a = " + a) + ", " + M("b = " + b) + ".")],
            traps: [TP([b, a], "a multiplie u et b multiplie v : respecte l'ordre."), TP([-a, -b], "Vérifie les signes en recalculant a·u + b·v.")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = pk([2, 3, -1, -2, 1.5, 0.5]), Cc = [A[0] + k * u[0], A[1] + k * u[1]]; if (!Number.isInteger(Cc[0] * 2) || !Number.isInteger(Cc[1] * 2)) return null; const B = [A[0] + u[0], A[1] + u[1]];
        return QP("Avec " + ptN("A", ...A) + " et " + ptN("B", ...B) + ", trouve le point " + M("C") + " tel que " + M("\\overrightarrow{AC} = " + fT(k) + "\\,\\overrightarrow{AB}") + "." + PAIR, Cc, M("\\overrightarrow{AB} = " + v2(u[0], u[1])) + ", " + M("\\overrightarrow{AC} = " + v2(fT(k * u[0]), fT(k * u[1]))) + ", " + ptN("C", ...Cc) + ".",
          { ctx: "point-vecteur", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?", u, M(v2(u[0], u[1])) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?", [k * u[0], k * u[1]], M(v2(fT(k * u[0]), fT(k * u[1]))) + "."), GP("Point " + M("C = A + \\overrightarrow{AC}") + " ?", Cc, ptN("C", ...Cc) + ".")],
            traps: [TP([k * u[0], k * u[1]], "C'est le vecteur AC ; le point C vaut A + AC."), TP([B[0] + k * u[0], B[1] + k * u[1]], "On part de A, pas de B.")] }); },
      () => { const u = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], a = pk([2, 3, -2]), w = u.map((x, i) => a * x - v[i]);
        return QP("Avec " + M("\\vec{u} = " + v3(...u)) + " et " + M("\\vec{v} = " + v3(...v)) + ", calcule " + M(a + "\\vec{u} - \\vec{v}") + "." + TRIP, w, M(a + "\\vec{u} - \\vec{v} = " + v3(...w)) + ".",
          { ctx: "combinaison-espace", guide: [G("Première composante ?", w[0], M(a + " \\cdot " + pT(u[0]) + " - " + pT(v[0]) + " = " + w[0]) + "."), G("Deuxième ?", w[1], M(w[1]) + "."), GP("Vecteur ?", w, M(v3(...w)) + ".")],
            traps: [TP(u.map((x, i) => a * x + v[i]), "On soustrait v."), TP(u.map((x, i) => a * (x - v[i])), "Le coefficient " + a + " ne multiplie que u.")] }); },
      () => { const A = [R.int(-6, 6), R.int(-6, 6)], B = [R.int(-6, 6), R.int(-6, 6)], C = [R.int(-6, 6), R.int(-6, 6)], Gc = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]; if (A[0] === B[0] && B[0] === C[0]) return null;
        return QP("Le centre de gravité d'un triangle est " + M("G = \\frac{A + B + C}{3}") + " (moyenne des sommets). Donne " + M("G") + " pour " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + "." + PAIR + " (fractions acceptées)", Gc, M("x_G = \\frac{" + (A[0] + B[0] + C[0]) + "}{3}") + ", " + M("y_G = \\frac{" + (A[1] + B[1] + C[1]) + "}{3}") + " : " + ptN("G", ...Gc) + ".",
          { ctx: "centre-gravite", guide: [G("Somme des abscisses ?", A[0] + B[0] + C[0], M(A[0] + B[0] + C[0]) + "."), G("Somme des ordonnées ?", A[1] + B[1] + C[1], M(A[1] + B[1] + C[1]) + "."), GP(M("G") + " ?", Gc, ptN("G", ...Gc) + ".")],
            traps: [TP([A[0] + B[0] + C[0], A[1] + B[1] + C[1]], "Divise par 3 (moyenne)."), TP([(A[0] + B[0] + C[0]) / 2, (A[1] + B[1] + C[1]) / 2], "Il y a trois sommets : divise par 3.")] }); },
    ],
  };

  // ===================================== F2. scalmp : produit scalaire =====================================
  const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
  const angDeg = (u, v) => DEG * Math.acos(dot(u, v) / (Math.hypot(...u) * Math.hypot(...v)));
  const SC = {
    1: [
      () => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], p = dot(u, v); if (!p) return null;
        return QN("Calcule le produit scalaire " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + M("\\vec{u} = " + v2(u[0], u[1])) + " et " + M("\\vec{v} = " + v2(v[0], v[1])) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + pT(u[0]) + " \\cdot " + pT(v[0]) + " + " + pT(u[1]) + " \\cdot " + pT(v[1]) + " = " + p) + ".",
          { ctx: "calcul-2d", guide: [G("Produit des premières composantes ?", u[0] * v[0], M(u[0] * v[0]) + "."), G("Produit des secondes ?", u[1] * v[1], M(u[1] * v[1]) + "."), G("Produit scalaire ?", p, M(p) + ".")],
            traps: [TR(u[0] * v[1] + u[1] * v[0], "On multiplie composante par composante : x avec x, y avec y."), TR(u[0] * v[0] - u[1] * v[1], "On additionne les deux produits.")] }); },
      () => { const u = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], p = dot(u, v); if (!p) return null;
        return QN("Calcule " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + M("\\vec{u} = " + v3(...u)) + " et " + M("\\vec{v} = " + v3(...v)) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + u.map((x, i) => pT(x) + " \\cdot " + pT(v[i])).join(" + ") + " = " + p) + ".",
          { ctx: "calcul-3d", guide: [G("Somme des deux premiers produits ?", u[0] * v[0] + u[1] * v[1], M(u[0] * v[0] + u[1] * v[1]) + "."), G("Produit scalaire (avec le troisième) ?", p, M(p) + ".")],
            traps: [TR(u[0] * v[0] + u[1] * v[1], "Il y a trois composantes dans l'espace."), TR(p - 2 * u[2] * v[2], "Attention aux signes du dernier produit.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5), k = r6(-(b * c) / a); if (!Number.isInteger(k * 2) || !k) return null;
        return QN("Pour quelle valeur de " + M("k") + " les vecteurs " + M(v2("k", b)) + " et " + M(v2(a, c)) + " sont-ils orthogonaux ? (fraction acceptée)", k, "Orthogonaux : produit scalaire nul, " + M(a + "k + " + pT(b) + " \\cdot " + pT(c) + " = 0") + ", " + M("k = " + fT(k)) + ".",
          { ctx: "orthogonal", guide: [G("Le produit scalaire vaut " + M(a + "k + " + pT(b) + " \\cdot " + pT(c)) + ". Que vaut " + M(pT(b) + " \\cdot " + pT(c)) + " ?", b * c, M(b * c) + "."), G(M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(-k, "Attention au signe en isolant k."), TR(r6(b * c), "Divise par " + a + ".")] }); },
    ],
    2: [
      () => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)]; if (u[0] * v[1] === u[1] * v[0] || !dot(u, v)) return null; const ang = angDeg(u, v), cs = Math.cos(ang / DEG);
        return QN("Calcule l'angle entre " + M("\\vec{u} = " + v2(u[0], u[1])) + " et " + M("\\vec{v} = " + v2(v[0], v[1])) + " (en degrés, au dixième).", ang, M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\cdot \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + D(ang, 0.1) + "°") + ".",
          { ctx: "angle", round: 0.1, guide: [G("Produit scalaire ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\cos\\alpha") + " (au millième) ?", cs, M(D(cs, 0.001)) + ".", 0.001), G("Angle (au dixième) ?", ang, M(D(ang, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - ang, "Un produit scalaire " + (dot(u, v) < 0 ? "négatif donne un angle obtus." : "positif donne un angle aigu."))] }); },
      () => { const a = R.int(2, 8), b = R.int(2, 8), th = pk([60, 120, 180, 45, 135]), c = Math.cos(th / DEG), p = a * b * c, rad = th === 45 || th === 135, cT = { 60: "\\frac{1}{2}", 120: "-\\frac{1}{2}", 180: "-1", 45: "\\frac{\\sqrt{2}}{2}", 135: "-\\frac{\\sqrt{2}}{2}" }[th];
        const pTx = rad ? (th === 135 ? "-" : "") + (a * b === 2 ? "" : fT((a * b) / 2)) + "\\sqrt{2}" : fT(r6(p));
        return QN("Deux vecteurs ont des normes " + M(a) + " et " + M(b) + " et forment un angle de " + M(th + "°") + ". Calcule leur produit scalaire" + (rad ? " (√ accepté)." : "."), p, M("\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha = " + a + " \\cdot " + b + " \\cdot " + (th === 180 ? "(-1)" : cT) + " = " + pTx) + ".",
          { ctx: "normes-angle", guide: [G(M("\\cos " + th + "°") + " (valeur exacte) ?", c, M(cT) + "."), G("Produit scalaire ?", p, M(pTx) + ".")],
            traps: [TR(a * b, "N'oublie pas le facteur cos α."), TR(a * b * Math.sin(th / DEG), "Produit scalaire : cosinus (pas sinus).")] }); },
      () => { const F = pk([30, 40, 50, 60, 80]) /* 26.11 (vraisemblance) : une luge se tire avec quelques dizaines de N */, dd = pk([5, 10, 12, 20, 25, 30]), th = pk([20, 25, 30, 35, 40, 45, 60]), W = F * dd * Math.cos(th / DEG);
        return QN("On tire une luge avec une force de " + M(F + "\\text{ N}") + " qui fait un angle de " + M(th + "°") + " avec le sol, sur " + M(dd + "\\text{ m}") + ". Calcule le travail " + M("W = \\vec{F} \\cdot \\vec{d}") + " (en J, au dixième).", W, M("W = " + F + " \\cdot " + dd + " \\cdot \\cos " + th + "° \\approx " + D(W, 0.1)) + " J.",
          { ctx: "travail", round: 0.1, guide: [G(M("\\cos " + th + "°") + " (au millième) ?", Math.cos(th / DEG), M(D(Math.cos(th / DEG), 0.001)) + ".", 0.001), G("Travail (au dixième) ?", W, M(D(W, 0.1)) + " J.", 0.1)],
            traps: [TR(F * dd, "Seule la composante de la force dans le sens du déplacement travaille : × cos α."), TR(F * dd * Math.sin(th / DEG), "C'est le cosinus de l'angle (projection sur le déplacement).")] }); },
    ],
    3: [
      () => { const A = [R.int(-4, 4), R.int(-4, 4)], B = [R.int(-4, 6), R.int(-4, 6)], C = [R.int(-4, 6), R.int(-4, 6)], u = [B[0] - A[0], B[1] - A[1]], v = [C[0] - A[0], C[1] - A[1]]; if (u[0] * v[1] === u[1] * v[0] || !dot(u, v)) return null; const ang = angDeg(u, v);
        return QN("Calcule l'angle " + M("\\widehat{BAC}") + " du triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + " (en degrés, au dixième).", ang, M("\\overrightarrow{AB} = " + v2(u[0], u[1])) + ", " + M("\\overrightarrow{AC} = " + v2(v[0], v[1])) + " ; " + M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "}\\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + D(ang, 0.1) + "°") + ".",
          { ctx: "angle-triangle", round: 0.1, guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?", u, M(v2(u[0], u[1])) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?", v, M(v2(v[0], v[1])) + "."), G("Produit scalaire ?", dot(u, v), M(dot(u, v)) + "."), G("Angle (au dixième) ?", ang, M(D(ang, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - ang, "Le signe du produit scalaire décide : " + (dot(u, v) < 0 ? "négatif, angle obtus." : "positif, angle aigu.")), TR(angDeg(u, [C[0] - B[0], C[1] - B[1]]), "L'angle en A utilise les vecteurs AB et AC (tous deux partant de A).")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = nz(-4, 4), d = nz(-4, 4), e = nz(-4, 4), k = r6(-(a * d + b * e) / c); if (!Number.isInteger(k * 2) || !k) return null;
        return QN("Pour quelle valeur de " + M("k") + " les vecteurs " + M(v3(a, b, c)) + " et " + M(v3(d, e, "k")) + " sont-ils orthogonaux ? (fraction acceptée)", k, M(a + " \\cdot " + pT(d) + " + " + pT(b) + " \\cdot " + pT(e) + " + " + pT(c) + "k = 0") + ", " + M("k = " + fT(k)) + ".",
          { ctx: "orthogonal-espace", guide: [G("Somme des deux premiers produits ?", a * d + b * e, M(a * d + b * e) + "."), G(M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(-k, "Attention au signe en isolant k."), TR(r6(-(a * d + b * e)), "Divise par " + c + ".")] }); },
      () => { const A = [R.int(-3, 3), R.int(-3, 3)], u = [nz(-4, 4), nz(-4, 4)], B = [A[0] + u[0], A[1] + u[1]], yc = A[1] + nz(-5, 5), x = r6(A[0] - (u[1] * (yc - A[1])) / u[0]); if (!Number.isInteger(x * 2)) return null;
        return QN("Le triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + M("C(x \\,;\\, " + yc + ")") + " est rectangle en " + M("A") + ". Que vaut " + M("x") + " ? (fraction acceptée)", x, "Rectangle en A : " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 0") + ", " + M((u[0] === 1 ? "" : u[0] === -1 ? "-" : u[0]) + (A[0] ? "(x" + sg(-A[0]) + ")" : "x") + " + " + pT(u[1]) /* 27.11 : ni « 1(x », ni « (x + 0) » */ + " \\cdot " + pT(yc - A[1]) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "angle-droit", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?", u, M(v2(u[0], u[1])) + "."), G("Seconde composante de " + M("\\overrightarrow{AC}") + " ?", yc - A[1], M(yc - A[1]) + "."), G("Produit scalaire nul : " + M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR(r6(-(u[1] * (yc - A[1])) / u[0]), "C'est x − x_A ; ajoute encore x_A = " + A[0] + "."), TR(r6(A[0] + (u[1] * (yc - A[1])) / u[0]), "Attention au signe.")] }); },
    ],
  };

  // ===================================== G. droiteparam : droites paramétriques =====================================
  const cT1 = (a, dd, s) => (a ? a + tm(dd, s) : tm(dd, s, true)); /* « y = -3t » plutôt que « y = 0 - 3t » */
  const eqP = (A, d, s = "t") => M("\\begin{cases} x = " + cT1(A[0], d[0], s) + " \\\\ y = " + cT1(A[1], d[1], s) + (A.length > 2 ? " \\\\ z = " + cT1(A[2], d[2], s) : "") + " \\end{cases}");
  const DP = {
    1: [
      () => { /* audit niveau 25.11 : « équations paramétriques de la droite passant par A et B » (examen TASV spécifique 2024 p. 4c) */
        const A = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], B = A.map((x, i) => x + d[i]), t = pk([2, 3, -2, -1]), P = A.map((x, i) => x + t * d[i]);
        return QP("On écrit la droite " + M("(AB)") + " avec " + ptN("A", ...A) + " comme point de départ et " + M("\\overrightarrow{AB}") + " comme vecteur directeur, pour " + ptN("B", ...B) + ". Quel point obtient-on pour " + M("t = " + t) + " ?" + TRIP, P, M("\\overrightarrow{AB} = " + v3(...d)) + ", donc " + eqP(A, d) + " ; pour " + M("t = " + t) + " : " + pt(...P) + ".",
          { ctx: "deux-points", guide: [GP("Vecteur directeur " + M("\\overrightarrow{AB}") + " (« x ; y ; z ») ?", d, M(v3(...d)) + "."), G(M("x = " + A[0] + " + " + pT(d[0]) + "t") + " pour " + M("t = " + t) + " ?", P[0], M(P[0]) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP(B.map((x, i) => x + t * d[i]), "Le point de départ est A (pour t = 0), pas B."), TP(A.map((x, i) => x + t * B[i]), "Le vecteur directeur est AB = B − A, pas les coordonnées de B."), TP(A.map((x, i) => x - t * d[i]), "AB = B − A (arrivée − départ).")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4)], t = pk([2, 3, -1, -2, 4]), P = [A[0] + t * d[0], A[1] + t * d[1]];
        return QP("La droite " + M("d") + " a pour équations paramétriques " + eqP(A, d) + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + PAIR, P, M("x = " + A[0] + sg(d[0]) + " \\cdot " + pT(t) + " = " + P[0]) + ", " + M("y = " + A[1] + sg(d[1]) + " \\cdot " + pT(t) + " = " + P[1]) + " : " + pt(...P) + ".",
          { ctx: "point-t", guide: [G(M("x") + " pour " + M("t = " + t) + " ?", P[0], M(P[0]) + "."), G(M("y") + " ?", P[1], M(P[1]) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP([t * d[0], t * d[1]], "On part du point de départ : x = " + A[0] + " + (" + d[0] + ")t."), TP([A[0] + d[0], A[1] + d[1]], "Remplace t par " + t + ".")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4)], t = pk([2, 3, -2, 4, 5, -3]), P = [A[0] + t * d[0], A[1] + t * d[1]];
        return QN("Le point " + ptN("P", ...P) + " est sur la droite " + eqP(A, d) + ". Pour quelle valeur du paramètre " + M("t") + " ?", t, M(P[0] + " = " + A[0] + tm(d[0], "t")) + " donne " + M("t = " + t) + " ; on vérifie avec y : " + M(A[1] + sg(d[1]) + " \\cdot " + pT(t) + " = " + P[1]) + ".",
          { ctx: "parametre", shownOk: true, guide: [G("Avec la première équation : " + M(d[0] + "t") + " = ?", P[0] - A[0], M(P[0] + " - " + pT(A[0]) + " = " + (P[0] - A[0])) + "."), G(M("t") + " = ?", t, M(t) + " (la seconde équation donne la même valeur).")],
            traps: [TR(P[0] - A[0], "Divise encore par " + d[0] + "."), TR(-t, "Attention au signe.")] }); },
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], d = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t = pk([2, 3, -1, -2]), P = A.map((v, i) => v + t * d[i]);
        return QP("Donne le point de la droite " + eqP(A, d) + " obtenu pour " + M("t = " + t) + "." + TRIP, P, "On remplace " + M("t") + " par " + M(t) + " : " + pt(...P) + ".",
          { ctx: "point-espace", guide: [G(M("x") + " ?", P[0], M(P[0]) + "."), G(M("y") + " ?", P[1], M(P[1]) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP(d.map((v) => v * t), "N'oublie pas le point de départ."), TP(A.map((v, i) => v + d[i]), "Remplace t par " + t + ".")] }); },
    ],
    2: [
      () => { const A = [R.int(-5, 5), nz(-6, 6)], d = [nz(-4, 4), nz(-3, 3)], t = r6(-A[1] / d[1]), x = r6(A[0] + t * d[0]); if (!Number.isInteger(x * 2)) return null;
        return QP("En quel point la droite " + eqP(A, d) + " coupe-t-elle l'axe des abscisses ?" + PAIR + " (fractions acceptées)", [x, 0], "Sur l'axe des abscisses " + M("y = 0") + " : " + M(A[1] + tm(d[1], "t") + " = 0") + ", " + M("t = " + fT(t)) + ", " + M("x = " + fT(x)) + ". Point " + pt(x, 0) + ".",
          { ctx: "axe", guide: [G("On pose " + M("y = 0") + " : " + M("t") + " = ?", t, M(fT(t)) + "."), G(M("x") + " = ?", x, M(fT(x)) + "."), GP("Point ?", [x, 0], pt(x, 0) + ".")],
            traps: [TP([A[0], 0], "Calcule t avec y = 0, puis x."), TP([r6(A[0] - t * d[0]), 0], "Attention au signe de t.")] }); },
      () => { const A = [nz(-6, 6), nz(-6, 6), nz(-6, 6)], d = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], k = R.int(0, 2), name = ["yOz", "xOz", "xOy"][k], vr = ["x", "y", "z"][k], t = r6(-A[k] / d[k]); if (!Number.isInteger(t)) return null; const P = A.map((v, i) => (i === k ? 0 : v + t * d[i]));
        return QP("Donne le point d'intersection de la droite " + eqP(A, d) + " avec le plan " + M(name) + " (" + M(vr + " = 0") + ")." + TRIP, P, M(vr + " = 0") + " donne " + M("t = " + t) + " : " + pt(...P) + ".",
          { ctx: "plan-coordonnees", guide: [G("On pose " + M(vr + " = 0") + " : " + M("t") + " = ?", t, M(t) + "."), GP("Point ?", P, pt(...P) + ".")],
            traps: [TP(A.map((v, i) => (i === k ? 0 : v)), "Calcule t, puis les deux autres coordonnées."), TP(A.map((v, i) => (i === k ? 0 : v - t * d[i])), "Attention au signe de t.")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], d = [nz(-4, 4), nz(-4, 4)], t = pk([2, 3, -1, -2, 4]), P = [A[0] + t * d[0], A[1] + t * d[1]];
        return QN("Le point " + M("P(" + P[0] + " \\,;\\, y)") + " est sur la droite " + eqP(A, d) + ". Que vaut " + M("y") + " ?", P[1], "Avec x : " + M(P[0] + " = " + A[0] + tm(d[0], "t")) + ", " + M("t = " + t) + " ; puis " + M("y = " + A[1] + sg(d[1]) + " \\cdot " + pT(t) + " = " + P[1]) + ".",
          { ctx: "coordonnee-manquante", guide: [G(M("t") + " (avec l'équation de x) ?", t, M(t) + "."), G(M("y") + " ?", P[1], M(P[1]) + ".")],
            traps: [TR(A[1] + d[1] * P[0], "Remplace t (pas x) dans l'équation de y."), TR(A[1] + d[1], "Calcule d'abord t avec x.")] }); },
    ],
    3: [
      () => { const P = [R.int(-4, 4), R.int(-4, 4)], d1 = [nz(-3, 3), nz(-3, 3)], d2 = [nz(-3, 3), nz(-3, 3)]; if (d1[0] * d2[1] === d1[1] * d2[0]) return null; const t0 = pk([1, -1, 2]), s0 = pk([1, -2, 2, -1]), A = [P[0] - t0 * d1[0], P[1] - t0 * d1[1]], B = [P[0] - s0 * d2[0], P[1] - s0 * d2[1]];
        return QP("Donne le point d'intersection des droites " + M("d_1") + " : " + eqP(A, d1) + " et " + M("d_2") + " : " + eqP(B, d2, "s") + "." + PAIR, P, "On résout " + M(A[0] + tm(d1[0], "t") + " = " + B[0] + tm(d2[0], "s")) + " et " + M(A[1] + tm(d1[1], "t") + " = " + B[1] + tm(d2[1], "s")) + ", d'où " + M("t = " + t0) + " et " + M("s = " + s0) + ". Point " + pt(...P) + ".",
          { ctx: "intersection", guide: [G("On égalise les x et les y (système en t et s). " + M("t") + " = ?", t0, M(t0) + "."), G(M("s") + " = ?", s0, M(s0) + "."), GP("Point (avec t dans " + M("d_1") + ") ?", P, pt(...P) + ".")],
            traps: [TP([t0, s0], "Ce sont les paramètres ; remplace t dans d₁ pour obtenir le point."), TP([P[1], P[0]], "Le point s'écrit (x ; y).")] }); },
      () => { const d1 = [nz(-3, 3), nz(-3, 3), R.int(-3, 3)], d2 = [nz(-3, 3), R.int(-3, 3), nz(-3, 3)], c = Math.abs(dot(d1, d2)) / (Math.hypot(...d1) * Math.hypot(...d2)); if (c > 0.999 || c < 1e-9) return null; const ang = DEG * Math.acos(c);
        return QN("Calcule l'angle aigu entre deux droites de vecteurs directeurs " + M(v3(...d1)) + " et " + M(v3(...d2)) + " (en degrés, au dixième).", ang, M("\\cos\\alpha = \\frac{|" + dot(d1, d2) + "|}{\\sqrt{" + dot(d1, d1) + "} \\cdot \\sqrt{" + dot(d2, d2) + "}}") + ", " + M("\\alpha \\approx " + D(ang, 0.1) + "°") + ".",
          { ctx: "angle-droites", round: 0.1, guide: [G("Produit scalaire des vecteurs directeurs ?", dot(d1, d2), M(dot(d1, d2)) + "."), G(M("\\cos\\alpha") + " avec la valeur absolue (au millième) ?", c, M(D(c, 0.001)) + ".", 0.001), G("Angle aigu (au dixième) ?", ang, M(D(ang, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - ang, "Entre deux droites, on donne l'angle aigu (valeur absolue du produit scalaire).")] }); },
      () => { const [a, b, c, n] = pk(TRI3), d = perm([a, b, c]), t = R.int(2, 8), P = d.map((v) => v * t);
        return QN("Un drone part de l'origine et vole en ligne droite : sa position après " + M("t") + " secondes est " + M("(x \\,;\\, y \\,;\\, z) = t \\cdot " + v3(...d)) + " (en m). Quelle distance a-t-il parcourue après " + M(t) + " s ?", n * t, "Position " + pt(...P) + " ; distance " + M(t + " \\cdot \\sqrt{" + dot(d, d) + "} = " + t + " \\cdot " + n + " = " + n * t) + " m.",
          { ctx: "drone", guide: [G("Norme du vecteur directeur (vitesse en m/s) ?", n, M("\\sqrt{" + dot(d, d) + "} = " + n) + "."), G("Distance après " + t + " s ?", n * t, M(n * t) + " m.")],
            traps: [TR((a + b + c) * t, "La distance se calcule avec la norme (Pythagore)."), TR(n, "C'est la distance parcourue en 1 s.")] }); },
    ],
  };

  // ===================================== H. ineqmp : inéquations et tableau des signes =====================================
  // Signe lu sur un graphique (24.11, agent mp4plus) : intervalles où a(x − r₁)(x − r₂)… vérifie « op 0 » (zéros simples, triés).
  const sgnIv = (rs, a, op) => { const b = [-INF].concat(rs, [INF]), pos = op[0] === ">", inc = op.length === 2, out = [];
    for (let i = 0; i < b.length - 1; i++) { const s = Math.sign(a) * (((rs.length - i) % 2) ? -1 : 1); if ((s > 0) === pos) out.push([b[i], isFinite(b[i]) && inc, b[i + 1], isFinite(b[i + 1]) && inc]); }
    return out; };
  const sgnFig = (f, rs, lab) => { let lo = 0, hi = 0; for (let x = -6; x <= 6; x += 0.05) { const y = f(x); if (x > rs[0] - 1.2 && x < rs[rs.length - 1] + 1.2) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
    const yr = [Math.max(-9, Math.floor(lo) - 1), Math.min(9, Math.ceil(hi) + 1)]; return FIG.plot([{ f }], [], { xr: [-6, 6], yr, numbers: true, step: yr[1] - yr[0] > 12 ? 2 : 1, maxH: 300, label: lab }); };
  const bel = { ">": "strictement au-dessus de", ">=": "au-dessus de (ou sur)", "<": "strictement au-dessous de", "<=": "au-dessous de (ou sur)" };
  const IQ = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-9, 9), x0 = nz(-6, 6), c = a * x0 + b, op = pk(["<", "<=", ">", ">="]), fop = a < 0 ? flip[op] : op;
        return QI("Résous " + M(lin(a, b) + " " + opT[op] + " " + c) + ". Réponds par exemple « x > 4 ».", fop, x0, M(a + "x " + opT[op] + " " + (c - b)) + (a < 0 ? " ; on divise par " + M(a) + " (négatif), le sens change" : "") + " : " + M("x " + opT[fop] + " " + x0) + ".",
          { ctx: "lineaire", guide: [G("On retire " + M(b) + " des deux côtés : que vaut le membre de droite ?", c - b, M(c + sg(-b) + " = " + (c - b)) + "."), GI("On divise par " + M(a) + (a < 0 ? " (négatif : on retourne le signe)" : "") + ". Solution ?", fop, x0, M("x " + opT[fop] + " " + x0) + ".")],
            traps: [TI(op, x0, "En divisant par un nombre négatif, on retourne le sens de l'inégalité."), TI(fop, r6((c + b) / a), "On retire " + b + " (opération inverse).")] }); },
      () => { const p = pk([2, 3, 4]), q = pk([2, 3, 5]); if (p === q) return null; const a = nz(-5, 5), b = nz(-5, 5), k = nz(-3, 3), op = pk(["<=", ">=", "<", ">"]);
        const cf = q - p, cst = q * a - p * b, x0 = r6((p * q * k - cst) / cf), fop = cf < 0 ? flip[op] : op; if (den(x0) > 6) return null;
        return QI("Résous " + M("\\frac{" + lin(1, a) + "}{" + p + "} - \\frac{" + lin(1, b) + "}{" + q + "} " + opT[op] + " " + k) + ". (fractions acceptées)", fop, x0, "On multiplie par " + M(p * q) + " : " + M(q + "(" + lin(1, a) + ") - " + p + "(" + lin(1, b) + ") " + opT[op] + " " + p * q * k) + ", " + M(lin(cf, cst) + " " + opT[op] + " " + p * q * k) + ", " + M("x " + opT[fop] + " " + fT(x0)) + ".",
          { ctx: "fractions", guide: [G("On multiplie par " + M(p * q) + " et on développe. Coefficient de x ?", cf, M(q + " - " + p + " = " + cf) + "."), G("Terme constant (à gauche) ?", cst, M(q + " \\cdot " + pT(a) + " - " + p + " \\cdot " + pT(b) + " = " + cst) + "."), GI("Solution ?", fop, x0, M("x " + opT[fop] + " " + fT(x0)) + ".")],
            traps: [TI(op === fop ? flip[op] : op, x0, cf < 0 ? "Le coefficient de x est négatif : on retourne le sens." : "On ne retourne le sens que si on divise par un nombre négatif."), TI(fop, r6((k - cst) / cf), "Multiplie aussi le membre de droite par " + p * q + ".")] }); },
      () => { const a = pk([2, 3, 4, 5]), b = nz(-7, 7), lo = R.int(-5, 1), hi = lo + R.int(2, 6), L = a * lo + b, H = a * hi + b, li = R.rand() < 0.5, hiI = R.rand() < 0.5, ivs = [[lo, li, hi, hiI]];
        return QSS("Résous " + M(L + " " + (li ? "\\le" : "<") + " " + lin(a, b) + " " + (hiI ? "\\le" : "<") + " " + H) + " et écris la solution comme un intervalle.", ivs, "On retire " + M(b) + " puis on divise par " + M(a) + " dans les trois membres : " + M(lo + " " + (li ? "\\le" : "<") + " x " + (hiI ? "\\le" : "<") + " " + hi) + ", soit " + M(ivT(ivs)) + ".",
          { ctx: "encadrement", guide: [G("Borne de gauche ?", lo, M("(" + L + sg(-b) + ") \\div " + a + " = " + lo) + "."), G("Borne de droite ?", hi, M("(" + H + sg(-b) + ") \\div " + a + " = " + hi) + "."), GSS("Intervalle (crochet fermé si la borne est comprise) ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS([[lo, !li, hi, !hiI]], "Crochet fermé pour ≤, ouvert pour < : vérifie chaque borne."), TSS([[L - b, li, H - b, hiI]], "Divise aussi par " + a + ".")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), b = nz(-6, 6); if (a === b) return null; const lo = Math.min(a, b), hi = Math.max(a, b), op = pk(["<", "<=", ">", ">="]), inc = op.length === 2, inside = op[0] === "<";
        const ivs = inside ? [[lo, inc, hi, inc]] : [[-INF, false, lo, inc], [hi, inc, INF, false]], other = inside ? [[-INF, false, lo, inc], [hi, inc, INF, false]] : [[lo, inc, hi, inc]];
        return QSS("Résous " + M("(" + lin(1, -a) + ")(" + lin(1, -b) + ") " + opT[op] + " 0") + ".", ivs, "Zéros " + M(lo) + " et " + M(hi) + " ; le produit est positif à l'extérieur, négatif entre les zéros. " + M("S = " + ivT(ivs)) + ".",
          { ctx: "produit", guide: [G("Plus petit zéro ?", lo, M(lo) + "."), G("Plus grand zéro ?", hi, M(hi) + "."), GSS("Tableau des signes : ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Le produit est " + (inside ? "négatif entre les zéros." : "positif à l'extérieur des zéros.")), TSS(inside ? [[-hi, inc, -lo, inc]] : [[-INF, false, -hi, inc], [-lo, inc, INF, false]], "(x − a) s'annule en x = a : attention aux signes.")] }); },
      () => { const k = nz(-8, 8), op = pk(["<=", ">=", "<", ">"]), inc = op.length === 2, inside = op[0] === "<", lo = Math.min(0, k), hi = Math.max(0, k);
        const ivs = inside ? [[lo, inc, hi, inc]] : [[-INF, false, lo, inc], [hi, inc, INF, false]];
        return QSS("Résous " + M("x^2" + tm(-k, "x") + " " + opT[op] + " 0") + ".", ivs, M("x(" + lin(1, -k) + ") " + opT[op] + " 0") + " ; zéros " + M(lo) + " et " + M(hi) + ", donc " + M("S = " + ivT(ivs)) + ".",
          { ctx: "mise-en-evidence", guide: [G("On factorise " + M("x(" + lin(1, -k) + ")") + ". Plus petit zéro ?", lo, M(lo) + "."), G("Plus grand ?", hi, M(hi) + "."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(inside ? [[-INF, false, lo, inc], [hi, inc, INF, false]] : [[lo, inc, hi, inc]], "Coefficient de x² positif : la parabole est négative entre les zéros.")] }); },
      () => { const r1 = nz(-6, 6), r2 = nz(-6, 6); if (r1 === r2) return null; const lo = Math.min(r1, r2), hi = Math.max(r1, r2), op = pk(["<", ">"]), inside = op === "<";
        const ivs = inside ? [[lo, false, hi, false]] : [[-INF, false, lo, false], [hi, false, INF, false]];
        return QSS("Résous " + M(polyT([1, -(r1 + r2), r1 * r2]) + " " + op + " 0") + ".", ivs, M(polyT([1, -(r1 + r2), r1 * r2]) + " = (x" + sg(-lo) + ")(x" + sg(-hi) + ")") + ", donc " + M("S = " + ivT(ivs)) + ".",
          { ctx: "trinome", guide: [G("Plus petit zéro du trinôme ?", lo, M(lo) + "."), G("Plus grand ?", hi, M(hi) + "."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(inside ? [[-INF, false, lo, false], [hi, false, INF, false]] : [[lo, false, hi, false]], "Le trinôme (a > 0) est négatif entre ses zéros, positif à l'extérieur."), TSS(inside ? [[lo, true, hi, true]] : [[-INF, false, lo, true], [hi, true, INF, false]], "Inégalité stricte : les zéros sont exclus.")] }); },
      () => { const r1 = nz(-5, 5), r2 = nz(-5, 5); if (Math.abs(r1 - r2) < 2) return null; const rs = [Math.min(r1, r2), Math.max(r1, r2)], a = pk([1, -1, 0.5, -0.5]), vy = (-a * (rs[1] - rs[0]) ** 2) / 4; if (Math.abs(vy) > 8 || Math.abs(vy) < 1) return null;
        const op = pk(["<", "<=", ">", ">="]), f = (x) => a * (x - rs[0]) * (x - rs[1]), ivs = sgnIv(rs, a, op), other = sgnIv(rs, -a, op), fig = sgnFig(f, rs, "parabole");
        return QSS("Le graphique montre la parabole d'une fonction " + M("f") + ". Sans calcul, résous " + M("f(x) " + opT[op] + " 0") + " en lisant le signe sur le graphique, et écris la solution avec des intervalles.", ivs,
          "La parabole coupe l'axe des x en " + M(rs[0]) + " et " + M(rs[1]) + " ; elle est tournée vers le " + (a > 0 ? "haut" : "bas") + ", donc " + (a > 0 ? "négative entre les zéros et positive à l'extérieur" : "positive entre les zéros et négative à l'extérieur") + ". On garde les x où la courbe est " + bel[op] + " l'axe : " + M("S = " + ivT(ivs)) + ".",
          { ctx: "signe-graphe-parabole", fig, guide: [G("Plus petit zéro (où la courbe coupe l'axe des x) ?", rs[0], M(rs[0]) + "."), G("Plus grand zéro ?", rs[1], M(rs[1]) + "."), GSS("Où la courbe est-elle " + bel[op] + " l'axe des x ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Relis le graphique : f(x) " + (op[0] === ">" ? "> 0" : "< 0") + " là où la courbe est " + (op[0] === ">" ? "au-dessus" : "au-dessous") + " de l'axe."), TSS(sgnIv(rs, a, op.length === 2 ? op[0] : op + "="), op.length === 2 ? "Avec ≤ ou ≥, les zéros sont compris (crochets fermés)." : "Inégalité stricte : les zéros sont exclus (crochets ouverts)."), TSS(sgnIv([-rs[1], -rs[0]], a, op), "Lis les zéros sur l'axe horizontal : attention aux signes.")] }); },
    ],
    3: [
      () => { const a = pk([1, 2, 3]), b = nz(-6, 6), c = pk([1, 2]), d = nz(-6, 6), z = r6(-b / a), p = r6(-d / c); if (z === p || den(z) > 3 || den(p) > 2) return null; const op = pk([">=", "<="]), lo = Math.min(z, p), hi = Math.max(z, p), zl = z < p;
        const ivs = op === ">=" ? [[-INF, false, lo, zl], [hi, !zl, INF, false]] : [[lo, zl, hi, !zl]];
        return QSS("Résous " + M("\\frac{" + lin(a, b) + "}{" + lin(c, d) + "} " + opT[op] + " 0") + ". (fractions acceptées)", ivs, "Zéro du numérateur " + M(fT(z)) + " (compris), valeur interdite " + M(fT(p)) + " (exclue). Tableau des signes : " + M("S = " + ivT(ivs)) + ".",
          { ctx: "quotient", guide: [G("Zéro du numérateur ?", z, M(fT(z)) + "."), G("Valeur interdite (zéro du dénominateur) ?", p, M(fT(p)) + " : toujours exclue."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(op === ">=" ? [[-INF, false, lo, true], [hi, true, INF, false]] : [[lo, true, hi, true]], "La valeur interdite " + T(p) + " est toujours exclue (crochet ouvert)."), TSS(op === ">=" ? [[lo, zl, hi, !zl]] : [[-INF, false, lo, zl], [hi, !zl, INF, false]], "Refais le tableau des signes : le quotient est " + (op === ">=" ? "positif à l'extérieur." : "négatif entre les deux valeurs."))] }); },
      () => { const rs = sortU([nz(-6, 6), nz(-6, 6), nz(-6, 6)]); if (rs.length < 3) return null; const pole = pk(rs), zs = rs.filter((r) => r !== pole), [a, b, c] = rs;
        const ivs = [[-INF, false, a, a !== pole], [b, b !== pole, c, c !== pole]], other = [[a, a !== pole, b, b !== pole], [c, c !== pole, INF, false]];
        return QSS("Résous " + M("\\frac{(" + lin(1, -zs[0]) + ")(" + lin(1, -zs[1]) + ")}{" + lin(1, -pole) + "} \\le 0") + ".", ivs, "Zéros " + M(zs[0]) + " et " + M(zs[1]) + ", valeur interdite " + M(pole) + ". Signes de gauche à droite : − + − +. " + M("S = " + ivT(ivs)) + ".",
          { ctx: "tableau-signes", guide: [G("Plus petite valeur remarquable (zéro ou valeur interdite) ?", a, M(a) + "."), G("Signe tout à gauche (−1 ou 1) ?", -1, "Négatif : trois facteurs négatifs."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Tout à gauche, les trois facteurs sont négatifs : le quotient est négatif."), TSS([[-INF, false, a, true], [b, true, c, true]], "La valeur interdite " + pole + " est exclue.")] }); },
      () => { const k = pk([2, 3, 4, 5, 0.5]), op = pk(["<", ">"]), z = r6(1 / k);
        const ivs = op === "<" ? [[-INF, false, 0, false], [z, false, INF, false]] : [[0, false, z, false]];
        return QSS("Résous " + M("\\frac{1}{x} " + op + " " + fT(k)) + ". (fractions acceptées)", ivs, "On ne multiplie pas par x (signe inconnu) : " + M("\\frac{1 - " + fT(k) + "x}{x} " + op + " 0") + ", zéro " + M(fT(z)) + ", valeur interdite " + M(0) + ", donc " + M("S = " + ivT(ivs)) + ".",
          { ctx: "inverse", guide: [G("On écrit " + M("\\frac{1 - " + fT(k) + "x}{x}") + ". Zéro du numérateur ?", z, M(fT(z)) + "."), G("Valeur interdite ?", 0, "0."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(op === "<" ? [[z, false, INF, false]] : [[-INF, false, z, false]], "Pense aux x négatifs : 1/x y est négatif."), TSS(op === "<" ? [[0, false, z, false]] : [[-INF, false, 0, false], [z, false, INF, false]], "Refais le tableau des signes de (1 − " + T(k) + "x) ÷ x.")] }); },
    ],
  };

  // ===================================== I1. fctmp : réciproque, parité, transformations, composition =====================================
  const FC = {
    1: [
      () => { /* audit niveau 25.11 : « f paire, f(2) = 8, f(−2) ? » (parité facultative, réponse lue dans l'énoncé) -> réciproque d'une fonction bijective restreinte (examen TASV 2023, p. 6) */
        const c = nz(-9, 12), s0 = R.int(2, 7), neg = R.rand() < 0.5, v = neg ? c - s0 * s0 : s0 * s0 + c, x0 = neg ? -s0 : s0;
        const fx = neg ? c + " - x^2" : "x^2" + sg(c), dom = neg ? "]-\\infty \\,;\\, 0]" : "[0 \\,;\\, +\\infty[", img = neg ? "]-\\infty \\,;\\, " + c + "]" : "[" + c + " \\,;\\, +\\infty[";
        return QN("La fonction " + M("f(x) = " + fx) + " est bijective de " + M(dom) + " vers " + M(img) + ". Calcule " + M("f^{-1}(" + v + ")") + ".", x0, M("f^{-1}(" + v + ")") + " est le nombre " + M("x") + " de " + M(dom) + " tel que " + M(fx + " = " + v) + " : " + M("x^2 = " + s0 * s0) + ", " + M("x = \\pm " + s0) + " ; on garde " + M("x = " + x0) + (neg ? " (négatif)" : " (positif)") + ".",
          { ctx: "reciproque-restreinte", guide: [G("On résout " + M(fx + " = " + v) + " : " + M("x^2") + " = ?", s0 * s0, M("x^2 = " + s0 * s0) + "."), G(M("x") + " dans " + M(dom) + " ?", x0, M("x = " + x0) + " (" + M("-" + s0) + " et " + M(s0) + " ont la même image ; seul " + M(x0) + " est dans l'ensemble de départ).")],
            traps: [TR(-x0, "Les deux nombres ±" + s0 + " ont la même image ; f est définie sur " + (neg ? "les négatifs" : "les positifs") + " seulement."), TR(neg ? c - v * v : v * v + c, "C'est f(" + v + ") ; la réciproque fait le chemin inverse."), TR(s0 * s0, "On cherche x, pas x².")] }); },
      () => { /* audit niveau 25.11 : réciproque d'une fonction affine = MP 2e (S3.FA.06) -> fonction cubique bijective de ℝ vers ℝ (S8.FP.03) */
        const a = pk([2, 3, 4, -2, -1]), b = nz(-9, 9), x0 = pk([-3, -2, 2, 3]), y = a * x0 ** 3 + b, ax = a === 1 ? "" : a === -1 ? "-" : a;
        return QN("La fonction " + M("f(x) = " + ax + "x^3" + sg(b)) + " est bijective de " + M("\\mathbb{R}") + " vers " + M("\\mathbb{R}") + ". Calcule " + M("f^{-1}(" + y + ")") + ".", x0, "On résout " + M(ax + "x^3" + sg(b) + " = " + y) + " : " + M(a + "x^3 = " + (y - b)) + ", " + M("x^3 = " + x0 ** 3) + ", " + M("x = \\sqrt[3]{" + x0 ** 3 + "} = " + x0) + ".",
          { ctx: "reciproque-cube-valeur", guide: [G("On isole : " + M("x^3") + " = ?", x0 ** 3, M("x^3 = " + (y - b) + " \\div " + pT(a) + " = " + x0 ** 3) + "."), G(M("x") + " (racine cubique) ?", x0, M("\\sqrt[3]{" + x0 ** 3 + "} = " + x0) + ".")],
            traps: [TR(a * y ** 3 + b, "C'est f(" + y + ") ; la réciproque fait le chemin inverse."), TR(x0 ** 3, "On cherche x : prends encore la racine cubique de x³."), TR(-x0, "Une racine cubique garde le signe : ∛(" + x0 ** 3 + ") = " + x0 + ".")] }); },
      () => { const h = nz(-4, 4), k = nz(-5, 5), x1 = R.int(-3, 3), v1 = nz(-6, 6), x = x1 + h, val = v1 + k; if (!val) return null;
        return QN("On sait que " + M("f(" + x1 + ") = " + v1) + ". Soit " + M("g(x) = f(" + lin(1, -h) + ")" + sg(k)) + ". Que vaut " + M("g(" + x + ")") + " ?", val, M("g(" + x + ") = f(" + x + sg(-h) + ")" + sg(k) + " = f(" + x1 + ")" + sg(k) + " = " + val) + ". (Le graphe de f est translaté de " + M(h) + " horizontalement et de " + M(k) + " verticalement.)",
          { ctx: "translation", guide: [G("Argument de f, " + M(x + sg(-h)) + " ?", x1, M(x1) + "."), G(M("g(" + x + ")") + " = ?", val, M(v1 + sg(k) + " = " + val) + ".")],
            traps: [TR(v1 - k, "On ajoute " + k + " (translation verticale)."), TR(r6(v1 + k + h), "Le décalage dans la parenthèse agit sur x, il ne s'ajoute pas au résultat.")] }); },
    ],
    2: [
      () => { const t = R.rand() < 0.5, b = nz(-8, 8), mb = b < 0 ? "+" + -b : "-" + b;
        if (t) return QX("Soit " + M("f(x) = x^3" + sg(b)) + ". Donne l'expression de " + M("f^{-1}(x)") + " (racine cubique : écris cbrt(…) ou ∛).", "cbrt(x" + mb + ")", M("y = x^3" + sg(b) + " \\iff x = \\sqrt[3]{y" + sg(-b) + "}") + ", donc " + M("f^{-1}(x) = \\sqrt[3]{x" + sg(-b) + "}") + ".",
          { ctx: "reciproque-cube", guide: [GX("On isole " + M("x^3") + " dans " + M("y = x^3" + sg(b)) + " : " + M("x^3") + " = ? (en fonction de y)", "y" + mb, M("y" + sg(-b)) + "."), GX("Racine cubique, puis on renomme y en x : " + M("f^{-1}(x)") + " = ?", "cbrt(x" + mb + ")", M("\\sqrt[3]{x" + sg(-b) + "}") + ".")],
            traps: [TX("cbrt(x)" + mb, "On retire " + b + " AVANT de prendre la racine cubique."), TX("1/(x^3" + (b < 0 ? "-" + -b : "+" + b) + ")", "La réciproque n'est pas l'inverse 1/f.")] });
        const a = R.int(1, 6);
        return QX("Soit " + M("f(x) = \\sqrt{x - " + a + "}") + " (pour " + M("x \\ge " + a) + "). Donne l'expression de " + M("f^{-1}(x)") + " (pour " + M("x \\ge 0") + ").", "x^2+" + a, M("y = \\sqrt{x - " + a + "} \\iff y^2 = x - " + a + " \\iff x = y^2 + " + a) + " : " + M("f^{-1}(x) = x^2 + " + a) + ".",
          { ctx: "reciproque-racine", pos: true, guide: [GX("On élève " + M("y = \\sqrt{x - " + a + "}") + " au carré et on isole x : x = ? (en fonction de y)", "y^2+" + a, M("y^2 + " + a) + "."), GX("On renomme y en x : " + M("f^{-1}(x)") + " = ?", "x^2+" + a, M("x^2 + " + a) + ".")],
            traps: [TX("x^2-" + a, "y² = x − " + a + " donne x = y² + " + a + "."), TX("(x+" + a + ")^2", "On élève d'abord au carré, puis on ajoute " + a + ".")] }); },
      () => { const a = nz(-3, 3), b = nz(-5, 5), c = R.int(1, 3), x0 = nz(-3, 3), g0 = a * x0 + b; if (!g0 || Math.abs(g0) === 1) return null; const val = c * g0 * g0, fx = c === 1 ? "x^2" : c + "x^2";
        return QN("Soit " + M("f(x) = " + fx) + " et " + M("g(x) = " + lin(a, b)) + ". Calcule " + M("(f \\circ g)(" + x0 + ") = f(g(" + x0 + "))") + ".", val, M("g(" + x0 + ") = " + g0) + ", puis " + M("f(" + g0 + ") = " + (c === 1 ? "" : c + " \\cdot ") + pT(g0) + "^2 = " + val) + ".",
          { ctx: "composition", guide: [G("D'abord " + M("g(" + x0 + ")") + " ?", g0, M(g0) + "."), G("Puis " + M("f(" + g0 + ")") + " ?", val, M(val) + ".")],
            traps: [TR(a * c * x0 * x0 + b, "f ∘ g : on applique g d'abord, puis f."), TR(c * x0 * x0 + g0, "C'est f(g(x)), une composition, pas une somme.")] }); },
      () => { const px = nz(-4, 4), py = nz(-6, 6), k = pk([2, 3, -1, 0.5]), hor = R.rand() < 0.5, Q = hor ? [r6(px / k), py] : [px, r6(k * py)]; if (Q.some((v) => !Number.isInteger(v * 2))) return null;
        return QP("Le point " + pt(px, py) + " est sur le graphe de " + M("f") + ". Donne le point correspondant du graphe de " + M("g(x) = " + (hor ? "f(" + co(k) + "x)" : co(k) + "f(x)")) + "." + PAIR + " (fractions acceptées)", Q, hor ? M("g(x) = f(" + co(k) + "x)") + " : les abscisses sont divisées par " + M(fT(k)) + ", d'où " + pt(...Q) + "." : M("g(x) = " + co(k) + "f(x)") + " : les ordonnées sont multipliées par " + M(fT(k)) + ", d'où " + pt(...Q) + ".",
          { ctx: hor ? "compression-x" : "etirement-y", guide: [G(hor ? "Nouvelle abscisse (" + M(co(k) + "x = " + px) + ") ?" : "Abscisse (inchangée) ?", Q[0], M(fT(Q[0])) + "."), G(hor ? "Ordonnée (inchangée) ?" : "Nouvelle ordonnée ?", Q[1], M(fT(Q[1])) + "."), GP("Point ?", Q, pt(...Q) + ".")],
            traps: [TP(hor ? [r6(px * k), py] : [r6(px / k), py], hor ? "f(kx) : on cherche x tel que kx = " + px + ", on divise par k." : "k · f(x) agit sur les ordonnées, pas sur les abscisses."), TP(hor ? [px, r6(py * k)] : [px, r6(py / k)], hor ? "f(kx) agit sur les abscisses." : "k · f(x) multiplie l'ordonnée par k.")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), b = nz(-5, 5), c = nz(-3, 3), d = nz(-5, 5), ex = "(" + c + ")*(" + a + "*x+(" + b + "))^2+(" + d + ")", cT = c === 1 ? "" : c === -1 ? "-" : c;
        return QX("Soit " + M("f(x) = " + cT + "x^2" + sg(d)) + " et " + M("g(x) = " + lin(a, b)) + ". Donne l'expression de " + M("(f \\circ g)(x)") + ".", ex, M("(f \\circ g)(x) = f(" + lin(a, b) + ") = " + cT + "(" + lin(a, b) + ")^2" + sg(d)) + " (développée ou non).",
          { ctx: "composee-expr", guide: [G("Terme constant de " + M("g(x)") + " ?", b, M(b) + "."), GX("On remplace x par " + M("g(x)") + " dans f : résultat ?", ex, M(cT + "(" + lin(a, b) + ")^2" + sg(d)) + ".")],
            traps: [TX("(" + a + ")*((" + c + ")*x^2+(" + d + "))+(" + b + ")", "Ça, c'est g ∘ f : ici on applique g d'abord."), TX("(" + c + ")*(" + a + "*x+(" + b + "))+(" + d + ")", "N'oublie pas le carré de g(x).")] }); },
      () => { const a = pk([2, 3, 4, -2, -3]), b = nz(-9, 9), x0 = r6(-b / a); if (den(x0) > 4) return null; const op = a > 0 ? ">=" : "<=";
        return QI("Quel est l'ensemble de définition de " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + " ? Réponds par exemple « x >= 3 ».", op, x0, "Il faut " + M(lin(a, b) + " \\ge 0") + ", soit " + M("x " + opT[op] + " " + fT(x0)) + (a < 0 ? " (on divise par un négatif : le sens change)" : "") + ".",
          { ctx: "domaine-racine", guide: [G("Pour quelle valeur de x le radicand s'annule-t-il ?", x0, M(fT(x0)) + "."), GI("On résout " + M(lin(a, b) + " \\ge 0") + " : solution ?", op, x0, M("x " + opT[op] + " " + fT(x0)) + ".")],
            traps: [TI(a > 0 ? ">" : "<", x0, "La racine de 0 existe : l'inégalité est large."), TI(flip[op], x0, a < 0 ? "On divise par " + a + " (négatif) : le sens change." : "Le radicand doit être positif ou nul.")] }); },
      () => { /* audit niveau 25.11 : intersection parabole-droite = MP 2e (S3.FQ.06) -> racine et droite, solution parasite (examens TASV spécifique 2022 p. 4, 2024 p. 5) */
        const x0 = R.int(-3, 8), s0 = R.int(1, 6), q = s0 - x0, pp = s0 * s0 - x0, x1 = 1 - 2 * q - x0; if (x1 === x0 || x1 + q >= 0 || x1 + pp < 0 || !pp || !q) return null;
        const rad = "\\sqrt{" + lin(1, pp) + "}", gx = lin(1, q);
        return QP("Détermine les coordonnées du point d'intersection des graphes de " + M("f(x) = " + rad) + " et " + M("g(x) = " + gx) + "." + PAIR, [x0, s0], "On résout " + M(rad + " = " + gx) + " : au carré, " + M(lin(1, pp) + " = (" + gx + ")^2") + ", soit " + M(polyT([1, 2 * q - 1, q * q - pp]) + " = 0") + ", d'où " + M("x = " + x0) + " ou " + M("x = " + x1) + ". Vérification : pour " + M("x = " + x1) + ", " + M("g(" + x1 + ") = " + (x1 + q) + " < 0") + " alors qu'une racine est positive : solution parasite. Point " + pt(x0, s0) + ".",
          { ctx: "intersection-racine", guide: [GSet("Après élévation au carré : solutions de " + M(polyT([1, 2 * q - 1, q * q - pp]) + " = 0") + " ?", [x0, x1], M(setT([x0, x1])) + "."), G("Abscisse retenue (vérifie " + M("g(x) \\ge 0") + ") ?", x0, M("x = " + x0) + " ; " + M("x = " + x1) + " est parasite."), GP("Point d'intersection ?", [x0, s0], pt(x0, s0) + ".")],
            traps: [TP([x1, x1 + q], "Vérifie dans l'équation de départ : pour x = " + x1 + ", la droite est sous l'axe, la racine non (solution parasite)."), TP([s0, x0], "Un point s'écrit (abscisse ; ordonnée)."), TP([x0, s0 * s0], "L'ordonnée est f(" + x0 + ") = √" + (x0 + pp) + " = " + s0 + ".")] }); },
    ],
  };

  // ===================================== I2. polymp : polynômes =====================================
  const expand = (roots, a = 1) => roots.reduce((cs, r) => { const o = cs.concat(0); for (let i = o.length - 1; i > 0; i--) o[i] -= r * o[i - 1]; return o; }, [a]);
  const pv = (cs, x) => cs.reduce((s, c) => s * x + c, 0);
  const pE = (cs) => polyT(cs).replace(/\^\{(\d+)\}/g, "^$1").replace(/(\d)x/g, "$1*x").replace(/\s+/g, "");
  const PO = {
    1: [
      () => { /* audit niveau 25.11 : « calcule P(2) » (substitution : niveau CO) -> mise en évidence de x puis trinôme (S8.FP.07) */
        const r1 = nz(-6, 6), r2 = nz(-6, 6), a = pk([1, 1, 2, -1]); if (r1 === r2 || r1 === -r2) return null; const cs = [a, -a * (r1 + r2), a * r1 * r2, 0], sol = [0, r1, r2];
        return QS("Trouve les zéros de " + M("P(x) = " + polyT(cs)) + ".", sol, "Mise en évidence : " + M("P(x) = x\\left(" + polyT([a, -a * (r1 + r2), a * r1 * r2]) + "\\right)") + ", puis le trinôme : " + M("x = " + r1) + " ou " + M("x = " + r2) + ". " + M(setT(sol)) + ".",
          { ctx: "mise-en-evidence", guide: [GSet("On met " + M("x") + " en évidence ; zéros du trinôme " + M(polyT([a, -a * (r1 + r2), a * r1 * r2])) + " ?", [r1, r2], M(setT([r1, r2])) + "."), GSet("Tous les zéros de " + M("P") + " ?", sol, M(setT(sol)) + " (n'oublie pas " + M("x = 0") + ").")],
            traps: [TS([r1, r2], "La mise en évidence donne aussi le zéro x = 0."), TS([0, -r1, -r2], "Attention aux signes : (x − a) s'annule en x = a.")] }); },
      () => { const a = nz(-5, 5), b = nz(-5, 5), k = pk([2, 3]), c = nz(-5, 5), z3 = r6(c / k); if (a === b || z3 === a || z3 === b || Number.isInteger(z3)) return null; const sol = [a, b, z3];
        return QS("Donne les zéros de " + M("P(x) = (" + lin(1, -a) + ")(" + lin(1, -b) + ")(" + lin(k, -c) + ")") + ". (fractions acceptées)", sol, "Un produit est nul si un facteur est nul : " + M(setT(sol)) + ".",
          { ctx: "produit-nul", guide: [G("Zéro du troisième facteur " + M(lin(k, -c)) + " ?", z3, M(fT(z3)) + "."), GSet("Tous les zéros ?", sol, M(setT(sol)) + ".")],
            traps: [TS([-a, -b, -z3], "x − a = 0 donne x = a : attention aux signes."), TS([a, b, c], k + "x − " + c + " = 0 donne x = " + c + " ÷ " + k + ".")] }); },
      () => { const r = nz(-3, 3), b = R.int(-4, 4), d = nz(-9, 9), s0 = r ** 3 + b * r * r + d, c = r6(-s0 / r); if (!Number.isInteger(c) || !c || Math.abs(r) === 1 && Math.abs(c) > 12) return null;
        return QN("Le nombre " + M(r) + " est un zéro de " + M("P(x) = x^3" + tm(b, "x^{2}") + " + cx" + sg(d)) + ". Que vaut " + M("c") + " ?", c, M("P(" + r + ") = 0") + " : " + M(pT(r) + "^3" + (b ? sg(b) + " \\cdot " + pT(r) + "^2" : "") + " + " + pT(r) + " c" + sg(d) + " = 0") + ", " + M("c = " + c) + ".",
          { ctx: "coefficient", guide: [G("Valeur de " + M("P(" + r + ")") + " sans le terme en c ?", s0, M(s0) + "."), G(M("c") + " = ?", c, M(c) + ".")],
            traps: [TR(-c, "Attention au signe en isolant c."), TR(-s0, "Divise par " + r + ".")] }); },
    ],
    2: [
      () => { const a = nz(-4, 4), q = [1, R.int(-4, 4), R.int(-6, 6)], rest = nz(-6, 6), Pcs = [q[0], q[1] - a * q[0], q[2] - a * q[1], -a * q[2] + rest];
        return QX("Effectue la division de " + M("P(x) = " + polyT(Pcs)) + " par " + M(lin(1, -a)) + ". Donne le quotient.", pE(q), "Division (ou schéma de Horner) : quotient " + M(polyT(q)) + ", reste " + M(rest) + ".",
          { ctx: "division", guide: [G("Coefficient de " + M("x") + " dans le quotient ?", q[1], M(q[1]) + "."), G("Terme constant du quotient ?", q[2], M(q[2]) + "."), GX("Quotient ?", pE(q), M(polyT(q)) + ".")],
            traps: [TX(pE([q[0], q[1] + 2 * a * q[0], q[2]]), "Divise par (x − " + a + ") : à chaque étape, on multiplie par " + a + " et on soustrait."), TX(pE(Pcs.slice(0, 3)), "Le quotient n'est pas le début de P : il faut faire la division.")] }); },
      () => { const cs = [pk([1, 2, -1, 3]), R.int(-5, 5), R.int(-6, 6), nz(-9, 9)], a = nz(-3, 3), rst = pv(cs, a); if ([0, 1, -1].includes(rst)) return null;
        return QN("Quel est le reste de la division de " + M("P(x) = " + polyT(cs)) + " par " + M(lin(1, -a)) + " ?", rst, "Théorème du reste : le reste vaut " + M("P(" + a + ") = " + rst) + ".",
          { ctx: "reste", guide: [G("Le reste de la division par " + M(lin(1, -a)) + " est " + M("P(" + a + ")") + ". Terme en " + M("x^3") + " ?", cs[0] * a ** 3, M(cs[0] * a ** 3) + "."), G(M("P(" + a + ")") + " = ?", rst, M(rst) + ".")],
            traps: [TR(pv(cs, -a), "On divise par (x − " + a + ") : le reste est P(" + a + "), pas P(" + -a + ")."), TR(cs[3], "Le reste n'est pas le terme constant : calcule P(" + a + ").")] }); },
      () => { const r1 = pk([1, -1, 2, -2]), r2 = nz(-5, 5), r3 = nz(-5, 5); if (new Set([r1, r2, r3]).size < 3) return null; const cs = expand([r1, r2, r3]), others = [r2, r3];
        return QS("Le nombre " + M(r1) + " est un zéro de " + M("P(x) = " + polyT(cs)) + ". Trouve les autres zéros.", others, "On divise par " + M(lin(1, -r1)) + " : " + M(polyT(expand([r2, r3]))) + ", dont les zéros sont " + M(Math.min(r2, r3)) + " et " + M(Math.max(r2, r3)) + ".",
          { ctx: "zero-connu", guide: [GX("Quotient de la division par " + M(lin(1, -r1)) + " ?", pE(expand([r2, r3])), M(polyT(expand([r2, r3]))) + "."), GSet("Zéros de ce quotient ?", others, M(setT(others)) + ".")],
            traps: [TS([-r2, -r3], "Attention aux signes des zéros."), TS([r1, r2, r3], "On demande les autres zéros (sans " + r1 + ").")] }); },
    ],
    3: [
      () => { const r1 = pk([1, -1, 2, -2, 3]), r2 = nz(-4, 4), r3 = nz(-4, 4); if (new Set([r1, r2, r3]).size < 3) return null; const cs = expand([r1, r2, r3]), sol = [r1, r2, r3];
        return QS("Trouve tous les zéros de " + M("P(x) = " + polyT(cs)) + " (cherche d'abord un zéro « évident » parmi les diviseurs du terme constant).", sol, "Essai : " + M("P(" + r1 + ") = 0") + ". Division par " + M(lin(1, -r1)) + " : " + M(polyT(expand([r2, r3]))) + ". " + M(setT(sol)) + ".",
          { ctx: "racine-evidente", guide: [G("Un zéro évident (essaie ±1, ±2, ±3) ?", r1, M("P(" + r1 + ") = 0") + "."), GX("Quotient par " + M(lin(1, -r1)) + " ?", pE(expand([r2, r3])), M(polyT(expand([r2, r3]))) + "."), GSet("Tous les zéros ?", sol, M(setT(sol)) + ".")],
          traps: [TS(sol.map((v) => -v), "Attention aux signes."), TS([r2, r3], "N'oublie pas le zéro évident " + r1 + ".")] }); },
      () => { const rs = sortU([nz(-5, 5), nz(-5, 5), nz(-5, 5)]); if (rs.length < 3) return null; const [a, b, c] = rs, op = pk([">=", "<="]);
        const ivs = op === ">=" ? [[a, true, b, true], [c, true, INF, false]] : [[-INF, false, a, true], [b, true, c, true]];
        return QSS("Résous " + M("(" + lin(1, -a) + ")(" + lin(1, -b) + ")(" + lin(1, -c) + ") " + opT[op] + " 0") + ".", ivs, "Zéros " + M(a) + ", " + M(b) + ", " + M(c) + " ; signes de gauche à droite : − + − +. " + M("S = " + ivT(ivs)) + ".",
          { ctx: "signe-degre3", guide: [G("Plus petit zéro ?", a, M(a) + "."), G("Signe du produit tout à gauche (−1 ou 1) ?", -1, "Négatif : trois facteurs négatifs."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(op === ">=" ? [[-INF, false, a, true], [b, true, c, true]] : [[a, true, b, true], [c, true, INF, false]], "Tout à gauche, le produit de trois facteurs négatifs est négatif."), TSS(op === ">=" ? [[c, true, INF, false]] : [[-INF, false, a, true]], "Il y a deux intervalles : le signe change à chaque zéro.")] }); },
      () => { const rs = sortU([nz(-4, 4), nz(-4, 4), nz(-4, 4)]); if (rs.length < 3) return null; const a = pk([2, -1, -2, 3, 0.5]), pr = -rs[0] * rs[1] * rs[2], y0 = a * pr;
        return QN("Un polynôme de degré 3 a pour zéros " + M(rs.join(" \\,;\\, ")) + " et son graphe coupe l'axe vertical en " + M(fT(y0)) + ". Il s'écrit " + M("P(x) = a(" + rs.map((r) => lin(1, -r)).join(")(") + ")") + ". Que vaut " + M("a") + " ? (fraction acceptée)", a, M("P(0) = a \\cdot " + rs.map((r) => pT(-r)).join(" \\cdot ") + " = " + fT(pr) + "a") + " ; " + M(fT(pr) + "a = " + fT(y0)) + ", " + M("a = " + fT(a)) + ".",
          { ctx: "depuis-graphe", guide: [G("Produit " + M(rs.map((r) => pT(-r)).join(" \\cdot ")) + " ?", pr, M(fT(pr)) + "."), G(M("a") + " = ?", a, M(fT(y0) + " \\div " + pT(pr) + " = " + fT(a)) + ".")],
            traps: [TR(y0, "C'est P(0) ; divise par le produit."), TR(-a, "Attention aux signes : P(0) = a · (−r₁)(−r₂)(−r₃).")] }); },
      () => { const rs = sortU([nz(-4, 4), nz(-4, 4), nz(-4, 4)]); if (rs.length < 3 || rs[1] - rs[0] < 2 && rs[2] - rs[1] < 2) return null; const a = pk([0.5, 1, -0.5, -1]), op = pk(["<", "<=", ">", ">="]), f = (x) => a * (x - rs[0]) * (x - rs[1]) * (x - rs[2]);
        if ([0, 1].some((i) => Math.abs(f((rs[i] + rs[i + 1]) / 2)) < 0.8 || Math.abs(f((rs[i] + rs[i + 1]) / 2)) > 9)) return null;
        const ivs = sgnIv(rs, a, op), other = sgnIv(rs, -a, op), fig = sgnFig(f, rs, "courbe d'un polynôme de degré 3"), sgL = (a > 0 ? ["−", "+", "−", "+"] : ["+", "−", "+", "−"]).join(" ");
        return QSS("Le graphique montre la courbe d'un polynôme " + M("P") + " de degré 3. Dresse son tableau des signes à partir du graphique, puis résous " + M("P(x) " + opT[op] + " 0") + " (avec des intervalles).", ivs,
          "Zéros lus sur l'axe des x : " + M(rs.join(" \\,;\\, ")) + ". Signes de gauche à droite : " + sgL + ". On garde les x où la courbe est " + bel[op] + " l'axe : " + M("S = " + ivT(ivs)) + ".",
          { ctx: "signe-graphe-degre3", fig, guide: [G("Plus petit zéro ?", rs[0], M(rs[0]) + "."), G("Signe de " + M("P(x)") + " tout à gauche (−1 ou 1) ?", a > 0 ? -1 : 1, a > 0 ? "Négatif : la courbe arrive d'en bas." : "Positif : la courbe arrive d'en haut."), GSS("Ensemble des solutions ?", ivs, M(ivT(ivs)) + ".")],
            traps: [TSS(other, "Relis le tableau des signes : la courbe " + (a > 0 ? "arrive d'en bas (négative tout à gauche)." : "arrive d'en haut (positive tout à gauche).")), TSS(sgnIv(rs, a, op.length === 2 ? op[0] : op + "="), op.length === 2 ? "Avec ≤ ou ≥, les zéros sont compris (crochets fermés)." : "Inégalité stricte : les zéros sont exclus."), TSS(ivs.slice(0, 1), "Il y a deux intervalles : le signe change à chaque zéro.")] }); },
    ],
  };

  // ===================================== J1. sinusmp : fonctions sinusoïdales =====================================
  const piT = (k) => { const d = den(k), n = Math.round(k * d); return (n < 0 ? "-" : "") + (d === 1 ? (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\pi" : "\\frac{" + (Math.abs(n) === 1 ? "" : Math.abs(n)) + "\\pi}{" + d + "}"); };
  const sinT = (a, b, d) => co(a) + "\\sin(" + (b === 1 ? "" : fT(b)) + "x)" + (d ? sg(d) : "");
  const SN = {
    1: [
      () => { const lo = R.int(-10, 10), A = R.int(2, 15), axe = R.rand() < 0.5, roue = R.rand() < 0.5, L = roue ? lo + 22 : lo, H = L + 2 * A;
        const txt = roue ? "La hauteur d'une nacelle de grande roue varie entre " + M(L) + " m et " + M(H) + " m." : "La température d'une ville varie au cours de l'année entre " + M(L + "°") + " C et " + M(H + "°") + " C.";
        return QN(txt + " On la modélise par " + M("f(x) = a \\sin(b x) + d") + ". " + (axe ? "Que vaut " + M("d") + " (l'axe) ?" : "Que vaut l'amplitude " + M("a") + " (positive) ?"), axe ? (L + H) / 2 : A, (axe ? "Axe : moyenne du maximum et du minimum, " + M("d = \\frac{" + H + sg(L) + "}{2} = " + fT((L + H) / 2)) : "Amplitude : demi-écart, " + M("a = \\frac{" + H + " - " + pT(L) + "}{2} = " + A)) + ".",
          { ctx: (roue ? "grande-roue" : "temperature") + (axe ? "-axe" : "-amplitude"), guide: [G("Écart entre le maximum et le minimum ?", H - L, M(H - L) + "."), axe ? G("Axe " + M("d") + " (moyenne) ?", (L + H) / 2, M(fT((L + H) / 2)) + ".") : G("Amplitude (demi-écart) ?", A, M(A) + ".")],
            traps: axe ? [TR(A, "C'est l'amplitude ; l'axe est la moyenne du max et du min."), TR(H - L, "L'axe est au milieu : (max + min) ÷ 2.")] : [TR(H - L, "L'amplitude est la moitié de l'écart."), TR((L + H) / 2, "C'est l'axe ; l'amplitude est (max − min) ÷ 2.")] }); },
      () => { const b = pk([2, 3, 4, 0.5, 1.5]), a = nz(-5, 5), d = R.int(-3, 3), Pd = 2 / b;
        return QN("Quelle est la période de " + M("f(x) = " + sinT(a, b, d)) + " (x en radians) ? (écris π)", Pd * PI, "Période " + M("\\frac{2\\pi}{" + fT(b) + "} = " + piT(Pd)) + ".",
          { ctx: "periode", guide: [G("Coefficient " + M("b") + " devant x ?", b, M(fT(b)) + "."), G("Période " + M("\\frac{2\\pi}{b}") + " ?", Pd * PI, M(piT(Pd)) + ".")],
            traps: [TR(2 * PI * b, "La période est 2π ÷ b."), TR(PI / b, "La période d'un sinus est 2π (divisé par b)."), TR(2 * PI, "Le coefficient " + T(b) + " change la période.")] }); },
      () => { const a = nz(-6, 6), d = nz(-5, 5), b = pk([2, 3, 0.5]), mx = R.rand() < 0.5, v = mx ? d + Math.abs(a) : d - Math.abs(a); if ([0, 1, -1].includes(v)) return null;
        return QN("Quelle est la valeur " + (mx ? "maximale" : "minimale") + " de " + M("f(x) = " + sinT(a, b, d)) + " ?", v, "Le sinus varie entre −1 et 1 ; " + M("f") + " varie donc entre " + M(d - Math.abs(a)) + " et " + M(d + Math.abs(a)) + ".",
          { ctx: mx ? "maximum" : "minimum", guide: [G("Amplitude " + M("|a|") + " ?", Math.abs(a), M(Math.abs(a)) + "."), G((mx ? "Maximum " + M("d + |a|") : "Minimum " + M("d - |a|")) + " ?", v, M(v) + ".")],
            traps: [TR(mx ? d - Math.abs(a) : d + Math.abs(a), mx ? "Le maximum est d + |a|." : "Le minimum est d − |a|."), TR(mx ? Math.abs(a) : -Math.abs(a), "N'oublie pas l'axe d = " + d + ".")] }); },
    ],
    2: [
      /* 24.11 (chantier G) : lecture sur un graphique */
      () => { const Pd = pk([4, 8]), a = pk([2, 3, 4, -2, -3, -4]), d = pk([-2, 2, 3, -3]), kind = R.int(0, 2), A = Math.abs(a), f = (x) => a * Math.sin((2 * PI * x) / Pd) + d, x1 = a > 0 ? Pd / 4 : (3 * Pd) / 4;
        const yr = [Math.min(0, d - A) - 1, Math.max(0, d + A) + 1], fig = FIG.plot([{ f }], [], { xr: [-1, 2 * Pd], yr, numbers: true, step: Pd === 8 || yr[1] - yr[0] > 9 ? 2 : 1, maxH: 300, label: "sinusoïde" });
        const ask = ["Lis son amplitude (positive).", "Son axe est la droite " + M("y = d") + " : lis " + M("d") + ".", "Lis sa période."][kind], ans = [A, d, Pd][kind];
        const fin = [G("Amplitude, " + M("\\frac{\\max - \\min}{2}") + " ?", A, M("\\frac{" + (d + A) + " - " + pT(d - A) + "}{2} = " + A) + "."), G("Axe, " + M("\\frac{\\max + \\min}{2}") + " ?", d, M("\\frac{" + (d + A) + sg(d - A) + "}{2} = " + d) + "."), G("Période (écart entre deux maximums) ?", Pd, M((x1 + Pd) + " - " + x1 + " = " + Pd) + ".")][kind];
        const guide = kind === 2 ? [G("Abscisse du premier maximum (x > 0) ?", x1, M(x1) + "."), G("Abscisse du maximum suivant ?", x1 + Pd, M(x1 + Pd) + "."), fin] : [G("Valeur maximale lue ?", d + A, M(d + A) + "."), G("Valeur minimale lue ?", d - A, M(d - A) + "."), fin];
        const traps = [[TR(2 * A, "L'amplitude est la moitié de l'écart entre le maximum et le minimum."), TR(d + A, "C'est le maximum ; l'amplitude est (max − min) ÷ 2.")], [TR(A, "C'est l'amplitude ; l'axe est au milieu, (max + min) ÷ 2."), TR(d + A, "C'est le maximum ; l'axe est au milieu.")], [TR(Pd / 2, "D'un maximum au maximum suivant (pas jusqu'au minimum)."), TR(2 * Pd, "Une période = un motif complet, d'un maximum au suivant.")]][kind];
        return QN("Le graphique montre une fonction sinusoïdale " + M("f(x) = a\\sin(bx) + d") + ". " + ask, ans, ["Amplitude : (max − min) ÷ 2 = " + M(A), "Axe : (max + min) ÷ 2, " + M("d = " + d), "Période : d'un maximum au suivant, " + M(Pd)][kind] + ".",
          { ctx: ["graphe-amplitude", "graphe-axe", "graphe-periode"][kind], fig, guide, traps }); },
      () => { const Pd = pk([1, 4, 0.5, 1 / 3, 2 / 3, 4 / 3, 6]), b = 2 / Pd;
        return QN("Une fonction " + M("f(x) = a\\sin(bx) + d") + " a une période de " + M(piT(Pd)) + ". Que vaut " + M("b") + " (positif) ? (fraction acceptée)", b, M("b = \\frac{2\\pi}{\\text{période}} = \\frac{2\\pi}{" + piT(Pd) + "} = " + fT(b)) + ".",
          { ctx: "b-depuis-periode", guide: [G("Que vaut la période divisée par " + M("\\pi") + " ?", Pd, M(fT(Pd)) + "."), G(M("b = \\frac{2\\pi}{\\text{période}}") + " : " + M("b") + " = ?", b, M(fT(b)) + ".")],
            traps: [TR(Pd, "b = 2π ÷ période (les π se simplifient)."), TR(Pd / 2, "C'est l'inverse : b = 2π ÷ période."), TR(1 / Pd, "Avec un sinus, la période de base est 2π.")] }); },
      () => { const b = pk([1, 2, 3, 0.5]), c = pk([1 / 4, 1 / 3, 1 / 6, 1 / 2]), Pd = 2 / b, xm = c + Pd / 4, a = R.int(1, 5), d = R.int(-3, 3);
        return QN("Pour " + M("f(x) = " + (a === 1 ? "" : a) + "\\sin\\left(" + (b === 1 ? "x - " + piT(c) : fT(b) + "\\left(x - " + piT(c) + "\\right)") + "\\right)" + (d ? sg(d) : "")) + ", donne le premier " + M("x > " + piT(c)) + " où " + M("f") + " est maximale. (écris π)", xm * PI, "Le sinus est maximal quand son argument vaut " + M("\\frac{\\pi}{2}") + " : " + M((b === 1 ? "" : fT(b)) + "\\left(x - " + piT(c) + "\\right) = \\frac{\\pi}{2}") + ", " + M("x = " + piT(c) + " + " + piT(Pd / 4) + " = " + piT(xm)) + ".",
          { ctx: "dephasage", guide: [G("Déphasage (où la courbe coupe l'axe en montant) ?", c * PI, M(piT(c)) + "."), G("Quart de période ?", (Pd / 4) * PI, M(piT(Pd / 4)) + "."), G("Premier maximum ?", xm * PI, M(piT(xm)) + ".")],
            traps: [TR(c * PI, "Au déphasage, f vaut d (montée) ; le maximum vient un quart de période plus tard."), TR((c + Pd / 2) * PI, "Un quart de période (pas une demi) après le déphasage."), TR((Pd / 4 - c) * PI, "x − c = …, donc on ajoute le déphasage.")] }); },
      () => { const a = nz(-4, 4), b = pk([2, 3]), d = R.int(-3, 3), [k, s] = pk([[1 / 6, 0.5], [1 / 2, 1], [3 / 2, -1], [5 / 6, 0.5], [7 / 6, -0.5]]), x0 = k / b, v = r6(a * s + d); if ([0, 1, -1].includes(v)) return null;
        return QN("Soit " + M("f(x) = " + sinT(a, b, d)) + ". Calcule " + M("f\\left(" + piT(x0) + "\\right)") + ".", v, M(b + " \\cdot " + piT(x0) + " = " + piT(k)) + ", " + M("\\sin " + piT(k) + " = " + fT(s)) + ", donc " + M("f = " + a + " \\cdot " + pT(s) + (d ? sg(d) : "") + " = " + fT(v)) + ".",
          { ctx: "image", guide: [G(M("\\sin\\left(" + b + " \\cdot " + piT(x0) + "\\right) = \\sin " + piT(k)) + " = ?", s, M(fT(s)) + "."), G(M("f\\left(" + piT(x0) + "\\right)") + " = ?", v, M(fT(v)) + ".")],
            traps: [TR(r6(a * Math.sin(x0 * PI) + d), "Multiplie d'abord x par " + b + "."), TR(r6(a * s), "N'oublie pas + d.")] }); },
    ],
    3: [
      () => { const lo = R.int(-6, 2), A = R.int(1, 5), hi = lo + 2 * A, Pd = pk([2, 4, 1, 6]), b = 2 / Pd, d = (lo + hi) / 2, ex = A + "*sin(" + fS(b) + "*x)+(" + fS(d) + ")";
        return QX("Une sinusoïde coupe son axe en montant en " + M("x = 0") + ", varie entre " + M(lo) + " et " + M(hi) + " et a une période de " + M(piT(Pd)) + ". Donne son expression " + M("f(x) = a\\sin(bx) + d") + " (x en radians).", ex, M("a = " + A) + ", " + M("b = \\frac{2\\pi}{" + piT(Pd) + "} = " + fT(b)) + ", " + M("d = " + fT(d)) + " : " + M("f(x) = " + sinT(A, b, d)) + ".",
          { ctx: "depuis-graphe", guide: [G("Amplitude " + M("a") + " ?", A, M(A) + "."), G(M("b") + " ?", b, M(fT(b)) + "."), G("Axe " + M("d") + " ?", d, M(fT(d)) + "."), GX("Expression ?", ex, M(sinT(A, b, d)) + ".")],
            traps: [TX(A + "*sin(" + fS(Pd) + "*x)+(" + fS(d) + ")", "b = 2π ÷ période."), TX(2 * A + "*sin(" + fS(b) + "*x)+(" + fS(d) + ")", "L'amplitude est la moitié de l'écart max − min.")] }); },
      () => { const b = pk([1, 2, 3, 0.5]), c = pk([0, 1 / 4, 1 / 3, 1 / 6]), a = nz(-4, 4), Pd = 2 / b, first = a > 0 ? c + Pd / 4 : c + (3 * Pd) / 4;
        return QN("Pour " + M("f(x) = " + co(a) + "\\sin\\left(" + (b === 1 ? (c ? "x - " + piT(c) : "x") : fT(b) + (c ? "\\left(x - " + piT(c) + "\\right)" : "x")) + "\\right)") + ", donne le premier " + M("x > " + (c ? piT(c) : "0")) + " où " + M("f") + " est maximale. (écris π)", first * PI, (a > 0 ? "Maximum quand le sinus vaut 1, un quart de période après " : "Avec a < 0, le maximum arrive quand le sinus vaut −1, trois quarts de période après ") + M(c ? piT(c) : "0") + " : " + M("x = " + piT(first)) + ".",
          { ctx: "premier-max", guide: [G("Période ?", Pd * PI, M(piT(Pd)) + "."), G("Premier maximum ?", first * PI, M(piT(first)) + ".")],
            traps: [TR((a > 0 ? c + (3 * Pd) / 4 : c + Pd / 4) * PI, a > 0 ? "a > 0 : le maximum suit la montée d'un quart de période." : "a < 0 : la courbe commence par descendre ; le maximum arrive aux trois quarts de la période."), TR((c + Pd / 2) * PI, "À une demi-période, le sinus revient à 0.")] }); },
      () => { const dd = pk([3, 4, 5]), A = pk([1.5, 2, 2.5]), rr = pk([0.3, 0.5, 0.6, 0.8, -0.4, -0.5]), Lv = r6(dd + A * rr), t = (Math.asin(rr) * 6) / PI, tt = t < 0 ? 6 - t : t;
        return QN("La hauteur d'eau d'un port vaut " + M("h(t) = " + dd + " + " + N(A) + "\\sin\\left(\\frac{\\pi}{6} t\\right)") + " (en m, t en heures depuis minuit). À quelle heure la hauteur vaut-elle " + M(N(Lv)) + " m pour la première fois ? (au centième d'heure)", tt, M("\\sin\\left(\\frac{\\pi}{6} t\\right) = \\frac{" + N(Lv) + " - " + dd + "}{" + N(A) + "} = " + N(rr)) + (rr < 0 ? " (négatif : la marée descend sous l'axe après 6 h)" : "") + ", " + M("t \\approx " + D(tt, 0.01)) + " h.",
          { ctx: "maree", round: 0.01, guide: [G("Valeur du sinus " + M("\\frac{h - " + dd + "}{" + N(A) + "}") + " ?", rr, M(N(rr)) + "."), G("Heure (au centième) ?", tt, M(D(tt, 0.01)) + " h.", 0.01)],
            traps: [TR(Math.asin(Math.abs(rr)), "C'est l'argument π t ÷ 6 : multiplie par 6 ÷ π."), TR(rr > 0 ? 6 - t : 12 + t, "C'est le second passage : on demande le premier.")] }); },
    ],
  };

  // ===================================== J2. explogfn : fonctions exponentielles et logarithmiques =====================================
  const EL = {
    1: [
      () => { const a = R.int(2, 6), b = pk([2, 3, 4, 5, 0.5]), n = pk([1, 2]), y = a * b ** n; if (b === a) return null;
        return QN("La fonction " + M("f(x) = a \\cdot b^x") + " passe par " + pt(0, a) + " et " + pt(n, y) + ". Que vaut " + M("b") + " ? (" + M("b > 0") + ")", b, M("f(0) = a = " + a) + " ; " + M(a + " \\cdot b^{" + n + "} = " + N(y)) + ", " + M("b^{" + n + "} = " + N(b ** n)) + ", " + M("b = " + N(b)) + ".",
          { ctx: "base", guide: [G(M("a = f(0)") + " ?", a, M(a) + "."), G(M("b^{" + n + "}") + " = ?", b ** n, M(N(y) + " \\div " + a + " = " + N(b ** n)) + "."), G(M("b") + " = ?", b, M(N(b)) + ".")],
            traps: [TR(y / a / n, "b^" + n + " = " + T(b ** n) + " : on prend la racine, on ne divise pas."), TR(y, "On divise d'abord par a = " + a + ".")] }); },
      () => { const b = pk([2, 3, 10]), a = nz(-6, 6);
        return QI("Quel est l'ensemble de définition de " + M("f(x) = " + (b === 10 ? "\\log" : "\\log_{" + b + "}") + "(" + lin(1, -a) + ")") + " ? Réponds par exemple « x > 3 ».", ">", a, "Un logarithme n'existe que pour un argument strictement positif : " + M(lin(1, -a) + " > 0") + ", " + M("x > " + a) + ".",
          { ctx: "domaine-log", guide: [G("Pour quel x l'argument s'annule-t-il ?", a, M(a) + "."), GI("On résout " + M(lin(1, -a) + " > 0") + " : solution ?", ">", a, M("x > " + a) + ".")],
            traps: [TI(">=", a, "Le logarithme de 0 n'existe pas : inégalité stricte."), TI(">", -a, "x − " + a + " > 0 donne x > " + a + " : attention au signe.")] }); },
      () => { const b = pk([2, 3, 10]), a = nz(-6, 6), k = nz(-2, 2), z = r6(a + b ** -k); if (b === 3 && k > 0) return null; if (!z) return null; const lg = b === 10 ? "\\log" : "\\log_{" + b + "}";
        return QN("Quel est le zéro de " + M("f(x) = " + lg + "(" + lin(1, -a) + ")" + sg(k)) + " ? (fraction ou décimal)", z, M(lg + "(" + lin(1, -a) + ") = " + -k) + ", " + M(lin(1, -a) + " = " + b + "^{" + -k + "} = " + fT(b ** -k)) + ", " + M("x = " + fT(z)) + ".",
          { ctx: "zero-log", guide: [G("On isole le log : " + M(lg + "(" + lin(1, -a) + ")") + " = ?", -k, M(-k) + "."), G(M(lin(1, -a)) + " = ?", b ** -k, M(b + "^{" + -k + "} = " + fT(b ** -k)) + "."), G(M("x") + " = ?", z, M(fT(z)) + ".")],
            traps: [TR(a + b ** k, "Le logarithme vaut " + -k + " (on change le signe en isolant)."), TR(a - k, "Par définition, log_b(A) = c donne A = b^c.")] }); },
    ],
    2: [
      /* 24.11 (chantier G) : lecture sur un graphique */
      () => { const a = pk([2, 3, 4]), b = pk([2, 3, 0.5]), kind = R.int(0, 2), y1 = a * b; if (!Number.isInteger(y1)) return null; const v = [b, a * b ** 3, a / b][kind], bT = b === 0.5 ? "\\left(\\frac{1}{2}\\right)" : String(b); if (Math.abs(v) === 1) return null;
        const yr = [-1, Math.max(a, y1) + 1], fig = FIG.plot([{ f: (x) => a * b ** x }], [[0, a, "A"], [1, y1, "B"]], { xr: [-3, 4], yr, numbers: true, step: yr[1] > 10 ? 2 : 1, maxH: 300, label: "courbe exponentielle" });
        const ask = ["Que vaut " + M("b") + " ?", "Calcule " + M("f(3)") + ". (fraction acceptée)", "Calcule " + M("f(-1)") + ". (fraction acceptée)"][kind];
        const g0 = [G(M("f(0)") + ", lu au point A ?", a, M(a) + "."), G(M("f(1)") + ", lu au point B ?", y1, M(y1) + "."), G(M("b = f(1) \\div f(0)") + " ?", b, M(y1 + " \\div " + a + " = " + fT(b)) + ".")];
        const guide = kind === 0 ? g0 : g0.concat([kind === 1 ? G(M("f(3) = " + a + " \\cdot " + bT + "^3") + " ?", v, M(fT(v)) + ".") : G(M("f(-1) = " + a + " \\div " + fT(b)) + " ?", v, M(fT(v)) + ".")]);
        const traps = [[TR(y1 - a, "Exponentielle : on multiplie par b à chaque pas, b = f(1) ÷ f(0)."), TR(y1, "b = f(1) ÷ f(0) (et f(0) = " + a + ").")], [TR(a * b * 3, "C'est une puissance : b³, pas 3b."), TR(y1 + 2 * (y1 - a), "La croissance n'est pas linéaire : on multiplie par b à chaque pas.")], [TR(a * b, "f(−1) = a · b⁻¹ = a ÷ b."), TR(a - (y1 - a), "La croissance n'est pas linéaire : on divise par b quand x recule de 1.")]][kind];
        return QN("Le graphique montre la courbe de " + M("f(x) = a \\cdot b^x") + " ; elle passe par les points A et B. " + ask, v, M("a = f(0) = " + a) + ", " + M("b = \\frac{f(1)}{f(0)} = " + fT(b)) + (kind ? ", " + (kind === 1 ? M("f(3) = " + a + " \\cdot " + bT + "^3 = " + fT(v)) : M("f(-1) = \\frac{" + a + "}{" + fT(b) + "} = " + fT(v))) : "") + ".",
          { ctx: ["graphe-exp-base", "graphe-exp-image", "graphe-exp-negatif"][kind], fig, guide, traps }); },
      () => { const a = R.int(2, 5), b = pk([2, 3]), y2 = a * b * b, x3 = pk([3, 4, -1]), v = a * b ** x3; if (a === b) return null;
        return QN("La fonction " + M("f(x) = a \\cdot b^x") + " passe par " + pt(0, a) + " et " + pt(2, y2) + ". Calcule " + M("f(" + x3 + ")") + ". (fraction acceptée)", v, M("a = " + a) + ", " + M("b^2 = " + b * b) + ", " + M("b = " + b) + " ; " + M("f(" + x3 + ") = " + a + " \\cdot " + b + "^{" + x3 + "} = " + fT(v)) + ".",
          { ctx: "deux-points", guide: [G(M("b") + " ?", b, M(b) + "."), G(M("f(" + x3 + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(a * b * x3, "C'est une puissance : b^" + x3 + "."), TR(r6(a + ((y2 - a) / 2) * x3), "La croissance n'est pas linéaire.")] }); },
      () => { const b = pk([2, 3, 5]), k = nz(-5, 5), n = R.int(2, 4), y = b ** n + k;
        return QN("Soit " + M("f(x) = " + b + "^x" + sg(k)) + ". Calcule " + M("f^{-1}(" + y + ")") + ".", n, M(b + "^x" + sg(k) + " = " + y) + ", " + M(b + "^x = " + b ** n) + ", " + M("x = " + n) + ". (Réciproque " + M("f^{-1}(x) = \\log_{" + b + "}(x" + sg(-k) + ")") + ".)",
          { ctx: "reciproque", guide: [G("On résout " + M(b + "^x" + sg(k) + " = " + y) + " : " + M(b + "^x") + " = ?", b ** n, M(b ** n) + "."), G(M("x") + " = ?", n, M(n) + ".")],
            traps: [TR(b ** y + k, "C'est f(" + y + ") ; la réciproque fait le chemin inverse."), TR(b ** n, "C'est " + b + "^x ; x est l'exposant.")] }); },
      () => { const N0 = pk([20000, 50000, 80000, 120000]), p = pk([1.5, 2, 3, 4]), t = R.int(5, 20), f = 1 + p / 100, v = N0 * f ** t;
        return QN("Une ville de " + M(N(N0)) + " habitants croît de " + M(N(p) + "\\,\\%") + " par an : " + M("N(t) = " + N(N0) + " \\cdot " + N(f) + "^{t}") + ". Estime la population après " + M(t) + " ans (à l'unité).", v, M("N(" + t + ") = " + N(N0) + " \\cdot " + N(f) + "^{" + t + "} \\approx " + N(Math.round(v))) + ".",
          { ctx: "population", round: 1, guide: [G("Facteur " + M(N(f) + "^{" + t + "}") + " (au millième) ?", f ** t, M(D(f ** t, 0.001)) + ".", 0.001), G("Population (à l'unité) ?", v, M(N(Math.round(v))) + ".", 1)],
            traps: [TR(N0 * (1 + (p * t) / 100), "Croissance exponentielle : puissance du facteur, pas t fois le pourcentage."), TR(N0 * (p / 100) ** t, "Le facteur annuel est 1 + p.")] }); },
    ],
    3: [
      () => { const b = pk([2, 3]), h = nz(-5, 5), k = nz(-3, 3), z = r6(h + b ** -k);
        return QN("Le graphe de " + M("g(x) = \\log_{" + b + "}(x" + sg(-h) + ")" + sg(k)) + " est celui de " + M("\\log_{" + b + "} x") + " translaté. Quel est son zéro ? (fraction acceptée)", z, "Asymptote " + M("x = " + h) + ". " + M("\\log_{" + b + "}(x" + sg(-h) + ") = " + -k) + ", donc " + M("x = " + h + " + " + b + "^{" + -k + "} = " + fT(z)) + ".",
          { ctx: "translation-log", guide: [G("Asymptote verticale : " + M("x") + " = ?", h, M(h) + "."), G(M("x" + sg(-h)) + " = " + M(b + "^{" + -k + "}") + " = ?", b ** -k, M(fT(b ** -k)) + "."), G("Zéro ?", z, M(fT(z)) + ".")],
            traps: [TR(h + 1, "Le zéro de log(x − " + h + ") seul serait " + (h + 1) + " ; ici il y a aussi " + (k < 0 ? "− " + -k : "+ " + k) + "."), TR(r6(h + b ** k), "On isole le log : il vaut " + -k + ".")] }); },
      () => { const a = R.int(2, 6), b = pk([2, 3, 4, 0.5]), x1 = pk([1, 2]), x2 = x1 + pk([1, 2]), y1 = a * b ** x1, y2 = a * b ** x2;
        return QN("La fonction " + M("f(x) = a \\cdot b^x") + " passe par " + pt(x1, y1) + " et " + pt(x2, y2) + ". Que vaut " + M("a") + " ?", a, M("\\frac{f(" + x2 + ")}{f(" + x1 + ")} = b^{" + (x2 - x1) + "} = " + fT(y2 / y1)) + ", " + M("b = " + N(b)) + " ; " + M("a = \\frac{" + fT(y1) + "}{" + N(b) + "^{" + x1 + "}} = " + a) + ".",
          { ctx: "deux-points-a", guide: [G("Quotient " + M("\\frac{f(" + x2 + ")}{f(" + x1 + ")} = b^{" + (x2 - x1) + "}") + " ?", y2 / y1, M(fT(y2 / y1)) + "."), G(M("b") + " ?", b, M(N(b)) + "."), G(M("a") + " ?", a, M(a) + ".")],
            traps: [TR(y1, "a = f(0), pas f(" + x1 + ")."), TR(r6(y1 / b), "Divise par b^" + x1 + ".")] }); },
      () => { const N0 = pk([10, 20, 50]), b = pk([2, 3, 4]), target = pk([1000, 10000, 100000, 1000000]), t = l10(target / N0) / l10(b); if (Number.isInteger(r6(t))) return null;
        return QN("Une épidémie suit le modèle " + M("N(t) = " + N0 + " \\cdot " + b + "^{t}") + " (t en jours). Après combien de jours y a-t-il " + M(N(target)) + " malades ? (au centième)", t, M(b + "^{t} = " + N(target / N0)) + ", " + M("t = \\frac{\\log " + N(target / N0) + "}{\\log " + b + "} \\approx " + D(t, 0.01)) + " jours.",
          { ctx: "epidemie", round: 0.01, guide: [G("On divise par " + M(N0) + " : " + M(b + "^{t}") + " = ?", target / N0, M(N(target / N0)) + "."), G(M("t") + " (au centième) ?", t, M(D(t, 0.01)) + ".", 0.01)],
            traps: [TR(l10(target) / l10(b), "Divise d'abord par " + N0 + "."), TR(target / N0 / b, "t est un exposant : utilise le logarithme.")] }); },
    ],
  };


  // ===================================== G2. posdroites : position relative de deux droites (S7.DP.03, 24.11) =====================================
  /* Pas de réponse « par mot » dans l'app : on fait calculer ce qui décide de la position (paramètre m, point commun, écart des cotes). */
  const det2 = (a, b, c, d) => a * d - b * c;
  /* réponse lisible dans l'énoncé ou triviale : on retire (pickForm refait un tirage) */
  const chk = (q) => (q && typeof answerShown === "function" && (answerShown(q) || trivialQ(q, 0)) ? null : q);
  /* équations paramétriques dont une composante du vecteur directeur est une lettre (m) */
  const cTs = (a, dd, s) => (typeof dd === "string" ? (a === 0 ? dd + s : a + " + " + dd + s) : cT1(a, dd, s));
  const eqS = (A, d, s = "t") => M("\\begin{cases} x = " + cTs(A[0], d[0], s) + " \\\\ y = " + cTs(A[1], d[1], s) + (A.length > 2 ? " \\\\ z = " + cTs(A[2], d[2], s) : "") + " \\end{cases}");
  const PD = {
    1: [
      () => { const u = [nz(-4, 4), nz(-4, 4)], k = pk([2, 3, -2, -3]), m = k * u[1], A = [R.int(-5, 5), R.int(-5, 5)], B = [R.int(-5, 5), R.int(-5, 5)]; if (Math.abs(m) < 2 || Math.abs(u[0]) === Math.abs(u[1])) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqS(B, [k * u[0], "m"], "s") + " sont-elles parallèles ?", m,
          "Parallèles : vecteurs directeurs colinéaires. " + M(v2(k * u[0], "m") + " = " + fT(k) + " \\cdot " + v2(u[0], u[1])) + " (car " + M(k * u[0] + " = " + fT(k) + " \\cdot " + pT(u[0])) + "), donc " + M("m = " + fT(k) + " \\cdot " + pT(u[1]) + " = " + m) + ".",
          { ctx: "parallele-m", guide: [G("Rapport " + M("k") + " entre les premières composantes des vecteurs directeurs, " + M(k * u[0] + " \\div " + pT(u[0])) + " ?", k, M(fT(k)) + "."), G(M("m = k \\cdot " + pT(u[1])) + " = ?", m, M(m) + ".")],
            traps: [TR(u[1], "Le vecteur de g est " + k + " fois celui de d : multiplie aussi la seconde composante."), TR(r6(u[1] / k), "On multiplie par k, on ne divise pas."), TR(-m, "Attention au signe de k.")] })); },
      () => { /* audit niveau 25.11 : « deux droites cartésiennes parallèles » (pentes égales : MP 2e, S3.FA) -> droite paramétrique parallèle à une droite cartésienne (vecteur directeur (b ; −a), S7.DP.03) */
        const a = nz(-5, 5), b = nz(-5, 5), k = pk([2, 3, -2, -1, 0.5]), A = [R.int(-5, 5), R.int(-5, 5)], c = nz(-9, 9), u1 = k * b, m = k * -a; if (Math.abs(a) === Math.abs(b) || !Number.isInteger(u1) || !Number.isInteger(m) || Math.abs(m) < 2) return null;
        const e = tm(a, "x", true) + tm(b, "y") + " = " + c;
        return chk(QN("Pour quelle valeur de " + M("m") + " la droite " + M("d") + " : " + eqS(A, [u1, "m"], "t") + " est-elle parallèle à la droite " + M("g : " + e) + " ?", m,
          "Un vecteur directeur de " + M("g : ax + by = c") + " est " + M(v2("b", "-a") + " = " + v2(b, -a)) + ". " + M(v2(u1, "m")) + " doit lui être colinéaire : " + M(fT(u1) + " = " + fT(k) + " \\cdot " + pT(b)) + ", donc " + M("m = " + fT(k) + " \\cdot " + pT(-a) + " = " + m) + ".",
          { ctx: "parallele-param-cartesienne", guide: [GP("Vecteur directeur de " + M("g") + " (" + M(v2("b", "-a")) + ", « x ; y ») ?", [b, -a], M(v2(b, -a)) + "."), G("Rapport " + M(fT(u1) + " \\div " + pT(b)) + " ?", k, M(fT(k)) + "."), G(M("m") + " = ?", m, M(fT(k) + " \\cdot " + pT(-a) + " = " + m) + ".")],
            traps: [TR(k * a, "Le vecteur directeur de ax + by = c est (b ; −a) : attention au signe."), TR(r6(u1 * b / a), "(a ; b) est un vecteur normal de g (perpendiculaire) ; le vecteur directeur est (b ; −a)."), TR(-a, "Multiplie −a par le même rapport que b.")] })); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-3, 3), nz(-3, 3)], t0 = pk([2, -2, 3, -3]), P = [A[0] + t0 * u[0], A[1] + t0 * u[1]], m = pk([2, 3, -2, -3, 4]), p = P[1] - m * P[0]; if (u[1] === m * u[0] || !p) return null;
        return QP("La droite " + M("d") + " : " + eqP(A, u) + " coupe la droite " + M("g") + " : " + M("y = " + lin(m, p)) + ". Donne leur point d'intersection." + PAIR, P,
          "On remplace x et y de d dans l'équation de g : " + M(cT1(A[1], u[1], "t") + " = " + m + "(" + cT1(A[0], u[0], "t") + ")" + sg(p)) + ", d'où " + M("t = " + t0) + " et le point " + pt(...P) + ".",
          { ctx: "param-cartesienne", guide: [G("On remplace " + M("x") + " et " + M("y") + " de " + M("d") + " dans l'équation de " + M("g") + " : " + M("t") + " = ?", t0, M("t = " + t0) + "."), GP("Point d'intersection ?", P, pt(...P) + ".")],
            traps: [TP(A, "C'est le point de départ de d (t = 0) : calcule t d'abord."), TP([A[0] - t0 * u[0], A[1] - t0 * u[1]], "Attention au signe de t."), TP([t0, P[1]], "Remplace t dans x aussi.")] }); },
    ],
    2: [
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = pk([2, -2, 3, -1]), t0 = pk([2, 3, -2, -3]), y0 = A[1] + t0 * u[1], c = A[0] + t0 * u[0]; if (Math.abs(c) < 2 || c === y0 || !y0 || Math.abs(u[0]) === Math.abs(u[1])) return null;
        return chk(QN("Les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP(["c", y0], [k * u[0], k * u[1]], "s") + " sont parallèles. Pour quelle valeur de " + M("c") + " sont-elles confondues ?", c,
          "Confondues : le point " + M("(c \\,;\\, " + y0 + ")") + " de g doit être sur d. " + M(y0 + " = " + cT1(A[1], u[1], "t")) + " donne " + M("t = " + t0) + ", puis " + M("c = " + A[0] + sg(u[0]) + " \\cdot " + pT(t0) + " = " + c) + ".",
          { ctx: "confondues", guide: [G("Le point " + M("(c \\,;\\, " + y0 + ")") + " doit être sur " + M("d") + ". Avec l'ordonnée, " + M("t") + " = ?", t0, M(y0 + " = " + cT1(A[1], u[1], "t")) + ", " + M("t = " + t0) + "."), G(M("c") + " = ?", c, M(c) + ".")],
            traps: [TR(A[0] - t0 * u[0], "Attention au signe de t."), TR(A[0], "Le point de g doit être sur d : calcule t avec l'ordonnée."), TR(A[0] + t0 * k * u[0], "On utilise le vecteur directeur de d (pas celui de g).")] })); },
      () => { const u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], k = pk([2, -2, 3, -3]), m = k * u[1], A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], B = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)]; if (Math.abs(m) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites de l'espace " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqS(B, [k * u[0], "m", k * u[2]], "s") + " sont-elles parallèles ?", m,
          "Vecteurs directeurs colinéaires : " + M(k * u[0] + " = " + fT(k) + " \\cdot " + pT(u[0])) + " et " + M(k * u[2] + " = " + fT(k) + " \\cdot " + pT(u[2])) + " ; donc " + M("m = " + fT(k) + " \\cdot " + pT(u[1]) + " = " + m) + ".",
          { ctx: "parallele-espace", guide: [G("Rapport " + M("k") + " (première et troisième composantes) ?", k, M(fT(k)) + "."), G(M("m") + " = ?", m, M(m) + ".")],
            traps: [TR(u[1], "Multiplie aussi la deuxième composante par k."), TR(r6(u[1] / k), "On multiplie par k, on ne divise pas."), TR(-m, "Attention au signe de k.")] })); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-3, 3), nz(-3, 3)], t0 = pk([2, 3, -2, -3, 4]), P = [A[0] + t0 * u[0], A[1] + t0 * u[1]], a = nz(-4, 4), b = nz(-4, 4), c = a * P[0] + b * P[1], den2 = a * u[0] + b * u[1]; if (!den2 || !c || Math.abs(a) === Math.abs(b)) return null;
        return chk(QN("Pour quelle valeur du paramètre " + M("t") + " la droite " + M("d") + " : " + eqP(A, u) + " coupe-t-elle la droite " + M(tm(a, "x", true) + tm(b, "y") + " = " + c) + " ?", t0,
          M(co(a) + "(" + cT1(A[0], u[0], "t") + ")" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "(" + cT1(A[1], u[1], "t") + ") = " + c) + ", soit " + M(tm(den2, "t", true) + (a * A[0] + b * A[1] ? sg(a * A[0] + b * A[1]) : "") + " = " + c) + ", d'où " + M("t = " + t0) + ".",
          { ctx: "parametre-intersection", guide: [G("Après remplacement, coefficient de " + M("t") + " ?", den2, M(a + " \\cdot " + pT(u[0]) + " + " + pT(b) + " \\cdot " + pT(u[1]) + " = " + den2) + "."), ].concat(a * A[0] + b * A[1] ? [G("Terme constant ?", a * A[0] + b * A[1], M(a * A[0] + b * A[1]) + ".")] : [], [G(M("t") + " = ?", t0, M(t0) + ".")]),
            traps: [TR(-t0, "Attention au signe en isolant t."), TR(r6(c / den2), "Fais passer le terme constant de l'autre côté avant de diviser.")] })); },
    ],
    3: [
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = pk([2, -1, 3, -2]), s0 = pk([2, -2, 3, 1, -1]); if (!det2(u[0], -v[0], u[1], -v[1]) || u[0] * v[2] === u[2] * v[0]) return null;
        const P = A.map((x, i) => x + t0 * u[i]), B = P.map((x, i) => x - s0 * v[i]);
        return QP("Les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP(B, v, "s") + " sont sécantes. Donne leur point d'intersection." + TRIP, P,
          "Avec x et y : " + M(cT1(A[0], u[0], "t") + " = " + cT1(B[0], v[0], "s")) + " et " + M(cT1(A[1], u[1], "t") + " = " + cT1(B[1], v[1], "s")) + " donnent " + M("t = " + t0) + ", " + M("s = " + s0) + " ; z concorde (" + M(P[2]) + ") : point " + pt(...P) + ".",
          { ctx: "secantes-espace", guide: [G("Système en " + M("x") + " et " + M("y") + " : " + M("t") + " = ?", t0, M("t = " + t0) + "."), G(M("s") + " = ?", s0, M("s = " + s0) + "."), G("Vérification en z : cote du point ?", P[2], M(P[2]) + " des deux côtés."), GP("Point d'intersection ?", P, pt(...P) + ".")],
            traps: [TP(A, "C'est le point de départ de d : calcule t d'abord."), TP(B, "C'est le point de départ de g."), TP(A.map((x, i) => x + s0 * u[i]), "Dans d, on remplace t (pas s).")] }); },
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = pk([2, -1, 3, -2]), s0 = pk([2, -2, 3, -1]), dz = pk([2, 3, 4, -2, -3, 5]); if (!det2(u[0], -v[0], u[1], -v[1]) || u[0] * v[2] === u[2] * v[0]) return null;
        const P = A.map((x, i) => x + t0 * u[i]), B = P.map((x, i) => x - s0 * v[i] + (i === 2 ? dz : 0)), zd = P[2], zg = P[2] + dz;
        return chk(QN("On veut savoir si les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP(B, v, "s") + " se coupent. On résout le système formé par les équations en x et en y, puis on compare les cotes. Que vaut " + M("z_g - z_d") + " pour les valeurs de t et s trouvées ?", dz,
          "Avec x et y : " + M("t = " + t0) + ", " + M("s = " + s0) + ". Alors " + M("z_d = " + zd) + " et " + M("z_g = " + zg) + " : " + M("z_g - z_d = " + dz) + ". La différence n'est pas nulle : aucun point commun ; les directions n'étant pas parallèles, les droites sont gauches.",
          { ctx: "gauches", guide: [G(M("t") + " = ?", t0, M("t = " + t0) + "."), G(M("s") + " = ?", s0, M("s = " + s0) + "."), G(M("z_d") + " (avec t) ?", zd, M(zd) + "."), G(M("z_g") + " (avec s) ?", zg, M(zg) + "."), G(M("z_g - z_d") + " ?", dz, M(dz) + " : différent de 0, droites gauches.")],
            traps: [TR(-dz, "C'est z_g − z_d, dans cet ordre."), TR(zg, "On demande la différence des cotes."), TR(B[2] - s0 * v[2] - zd, "Recalcule z_g avec s = " + T(s0) + " : attention au signe.")] })); },
      () => { const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = pk([2, -1, 3, -2]), s0 = pk([2, -2, 3, -1]); if (!det2(u[0], -v[0], u[1], -v[1]) || u[0] * v[2] === u[2] * v[0]) return null;
        const P = A.map((x, i) => x + t0 * u[i]), B = P.map((x, i) => x - s0 * v[i]), m = B[2]; if (Math.abs(m) < 2) return null;
        return chk(QN("Pour quelle valeur de " + M("m") + " les droites " + M("d") + " : " + eqP(A, u) + " et " + M("g") + " : " + eqP([B[0], B[1], "m"], v, "s") + " sont-elles sécantes ?", m,
          "Avec x et y : " + M("t = " + t0) + ", " + M("s = " + s0) + ". En z : " + M(cT1(A[2], u[2], "t") + " = m" + tm(v[2], "s")) + " donne " + M(P[2] + " = m" + sg(s0 * v[2])) + ", donc " + M("m = " + m) + ".",
          { ctx: "secantes-m", guide: [G("Système en " + M("x") + " et " + M("y") + " : " + M("t") + " = ?", t0, M("t = " + t0) + "."), G(M("s") + " = ?", s0, M("s = " + s0) + "."), G("Cote du point de " + M("d") + " ?", P[2], M(P[2]) + "."), G(M("m") + " = ?", m, M(P[2] + " - " + pT(s0 * v[2]) + " = " + m) + ".")],
            traps: [TR(P[2] + s0 * v[2], "Isole m : m = " + T(P[2]) + " − (" + T(s0 * v[2]) + ")."), TR(P[2], "Il faut encore retrancher le terme en s.")] })); },
    ],
  };

  // ===================================== F3. projmp : projection orthogonale (S7.VE, 24.11) =====================================
  const SMALL = [[1, 2], [2, 1], [1, -2], [2, -1], [1, 3], [3, 1], [3, -1], [2, 3], [3, -2]];
  const perp = (d) => [-d[1], d[0]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const PJ = {
    1: [
      () => { const [a, b, c] = pk(TRI2), v = [a * sgn(), b * sgn()], u = [nz(-6, 6), nz(-6, 6)], p = dot(u, v), comp = r6(p / c); if (!p || Math.abs(comp) === 1 || den(comp) > 20) return null;
        return QN("Calcule la projection scalaire de " + M("\\vec{u} = " + v2(u[0], u[1])) + " sur la direction de " + M("\\vec{v} = " + v2(v[0], v[1])) + ", c'est-à-dire " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|}") + ". (fraction acceptée)", comp,
          M("\\vec{u} \\cdot \\vec{v} = " + p) + ", " + M("\\|\\vec{v}\\| = " + c) + ", projection " + M("\\frac{" + p + "}{" + c + "} = " + fT(comp)) + ".",
          { ctx: "projection-scalaire", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{v}\\|") + " ?", c, M(c) + "."), G("Projection scalaire ?", comp, M(fT(comp)) + ".")],
            traps: [TR(p, "Divise encore par la norme de v."), TR(r6(p / (c * c)), "On divise par ‖v‖ (pas par ‖v‖², qui sert au vecteur projeté)."), TR(r6(p / Math.hypot(...u)), "On divise par la norme du vecteur sur lequel on projette (v).")] }); },
      () => { const v = pk(SMALL), lam = pk([2, 3, -2, -3]), mu = nz(-2, 2), u = [lam * v[0] + mu * -v[1], lam * v[1] + mu * v[0]], n2 = v[0] ** 2 + v[1] ** 2, p = dot(u, v), w = [lam * v[0], lam * v[1]]; if (u.includes(0)) return null;
        return QP("Donne le vecteur projeté orthogonal de " + M("\\vec{u} = " + v2(u[0], u[1])) + " sur " + M("\\vec{v} = " + v2(v[0], v[1])) + " : " + M("\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2} \\, \\vec{v}") + "." + PAIR, w,
          M("\\vec{u} \\cdot \\vec{v} = " + p) + ", " + M("\\|\\vec{v}\\|^2 = " + n2) + ", coefficient " + M("\\frac{" + p + "}{" + n2 + "} = " + lam) + ", " + M("\\vec{p} = " + lam + " \\, \\vec{v} = " + v2(w[0], w[1])) + ".",
          { ctx: "vecteur-projete", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{v}\\|^2") + " ?", n2, M(n2) + "."), G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}") + " ?", lam, M(lam) + "."), GP("Vecteur projeté ?", w, M(v2(w[0], w[1])) + ".")],
            traps: [TP([p * v[0], p * v[1]], "Divise par ‖v‖² avant de multiplier par v."), TP(u, "C'est u lui-même : on garde seulement sa partie dans la direction de v."), TP([u[0] - w[0], u[1] - w[1]], "C'est la composante orthogonale ; le projeté est parallèle à v.")] }); },
      () => { const th = pk([15, 20, 25, 35, 40, 50]), it = pk([["On tire une valise avec une force de", "le sol", "valise", [30, 40, 50, 60]], ["Un cheval tire une péniche le long du canal avec une corde ; la force vaut", "le canal", "peniche", [400, 500, 600, 800, 1000]], ["Un remonte-pente tire un skieur avec une force de", "la piste", "skieur", [150, 200, 250, 300]]]), F = pk(it[3]) /* 26.11 (vraisemblance) : force selon le contexte (un cheval tire quelques centaines de N à 1000 N) */, h = F * Math.cos(th / DEG);
        return QN(it[0] + " " + M(F + "\\text{ N}") + ", inclinée de " + M(th + "°") + " par rapport " + (it[1].startsWith("le ") ? "au " + it[1].slice(3) : "à " + it[1]) + ". Calcule la composante de la force dans la direction " + (it[1].startsWith("le ") ? "du " + it[1].slice(3) : "de " + it[1]) + " (projection, en N, au dixième).", h,
          "Projection sur la direction du déplacement : " + M("F \\cos\\alpha = " + F + " \\cdot \\cos " + th + "° \\approx " + D(h, 0.1)) + " N.",
          { ctx: "force-" + it[2], round: 0.1, guide: [G(M("\\cos " + th + "°") + " (au millième) ?", Math.cos(th / DEG), M(D(Math.cos(th / DEG), 0.001)) + ".", 0.001), G("Composante (au dixième) ?", h, M(D(h, 0.1)) + " N.", 0.1)],
            traps: [TR(F * Math.sin(th / DEG), "La composante le long du déplacement utilise le cosinus (côté adjacent)."), TR(F, "Seule une partie de la force agit dans cette direction : × cos α."), TR(F / Math.cos(th / DEG), "On multiplie par cos α, on ne divise pas.")] }); },
    ],
    2: [
      () => { const d = pk(SMALL), A = [R.int(-4, 4), R.int(-4, 4)], lam = pk([2, -1, 3, -2, 0.5, 1.5]), mu = nz(-2, 2), H = [A[0] + lam * d[0], A[1] + lam * d[1]], P = [H[0] + mu * -d[1], H[1] + mu * d[0]], AP = [P[0] - A[0], P[1] - A[1]], n2 = d[0] ** 2 + d[1] ** 2; if (!Number.isInteger(H[0]) || !Number.isInteger(H[1])) return null;
        return QP("La droite " + M("d") + " passe par " + ptN("A", ...A) + " et a pour vecteur directeur " + M("\\vec{d} = " + v2(d[0], d[1])) + ". Donne le projeté orthogonal " + M("H") + " de " + ptN("P", ...P) + " sur " + M("d") + "." + PAIR, H,
          M("\\overrightarrow{AP} = " + v2(AP[0], AP[1])) + ", " + M("\\lambda = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2} = \\frac{" + dot(AP, d) + "}{" + n2 + "} = " + fT(lam)) + ", " + M("H = A + \\lambda \\vec{d}") + " = " + pt(...H) + ".",
          { ctx: "pied-perpendiculaire", guide: [GP("Composantes de " + M("\\overrightarrow{AP}") + " ?", AP, M(v2(AP[0], AP[1])) + "."), G(M("\\lambda = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}") + " ?", lam, M(fT(lam)) + "."), GP("Point " + M("H") + " ?", H, pt(...H) + ".")],
            traps: [TP([lam * d[0], lam * d[1]], "C'est le vecteur AH : ajoute les coordonnées de A."), TP(P, "H est sur d : on projette P."), TP([A[0] + dot(AP, d) * d[0], A[1] + dot(AP, d) * d[1]], "Divise le produit scalaire par ‖d‖².")] }); },
      () => { const d = pk([[3, 4], [4, 3], [1, 2], [2, 1], [1, 3], [3, -4], [2, -1]]), A = [R.int(-4, 4), R.int(-4, 4)], lam = pk([2, -1, 3, -2]), mu = pk([2, -2, 1, -1, 3]), H = [A[0] + lam * d[0], A[1] + lam * d[1]], P = [H[0] + mu * -d[1], H[1] + mu * d[0]], n = Math.hypot(...d), dist = Math.abs(mu) * n, ex = Number.isInteger(r6(dist));
        return QN("Calcule la distance du point " + ptN("P", ...P) + " à la droite passant par " + ptN("A", ...A) + " de vecteur directeur " + M(v2(d[0], d[1])) + (ex ? "." : " (au centième)."), dist,
          "Projeté orthogonal " + ptN("H", ...H) + " ; distance " + M("PH = \\sqrt{" + pT(P[0] - H[0]) + "^2 + " + pT(P[1] - H[1]) + "^2} " + (ex ? "= " + dist : "\\approx " + D(dist, 0.01))) + ".",
          Object.assign({ ctx: "distance-droite", guide: [GP("Projeté orthogonal " + M("H") + " de " + M("P") + " ?", H, ptN("H", ...H) + "."), G("Distance " + M("PH") + (ex ? "" : " (au centième)") + " ?", dist, M(ex ? dist : D(dist, 0.01)) + ".", ex ? undefined : 0.01)],
            traps: [TR(Math.hypot(P[0] - A[0], P[1] - A[1]), "PA est oblique : la distance se mesure perpendiculairement, PH."), TR(dist * dist, "N'oublie pas la racine."), TR(Math.abs(mu), "Multiplie par la norme du vecteur perpendiculaire.")] }, ex ? {} : { round: 0.01 })); },
      () => { const v = pk(SMALL), lam = pk([2, 3, -2, 0.5, 1.5]), mu = pk([2, -2, 3, -1]), u = [lam * v[0] + mu * -v[1], lam * v[1] + mu * v[0]]; if (u.includes(0) || !Number.isInteger(u[0]) || !Number.isInteger(u[1])) return null; const w = [mu * -v[1], mu * v[0]], p = [lam * v[0], lam * v[1]];
        return QP("Décompose " + M("\\vec{u} = " + v2(u[0], u[1])) + " en une partie parallèle à " + M("\\vec{v} = " + v2(v[0], v[1])) + " et une partie orthogonale. Donne la partie orthogonale " + M("\\vec{w} = \\vec{u} - \\vec{p}") + "." + PAIR, w,
          "Projeté " + M("\\vec{p} = \\frac{" + dot(u, v) + "}{" + (v[0] ** 2 + v[1] ** 2) + "} \\vec{v} = " + v2(fT(p[0]), fT(p[1]))) + ", " + M("\\vec{w} = \\vec{u} - \\vec{p} = " + v2(w[0], w[1])) + " (vérification : " + M("\\vec{w} \\cdot \\vec{v} = 0") + ").",
          { ctx: "composante-orthogonale", guide: [G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}") + " ?", lam, M(fT(lam)) + "."), GP("Vecteur projeté " + M("\\vec{p}") + " ?", p, M(v2(fT(p[0]), fT(p[1]))) + "."), GP(M("\\vec{w} = \\vec{u} - \\vec{p}") + " ?", w, M(v2(w[0], w[1])) + ".")],
            traps: [TP(p, "C'est la partie parallèle ; la partie orthogonale est u − p."), TP([u[0] + p[0], u[1] + p[1]], "On soustrait le projeté.")] }); },
    ],
    3: [
      () => { const v = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], e = [nz(-2, 2), nz(-2, 2), nz(-2, 2)], w = cross(v, e), lam = pk([2, -2, 3, -1]); if (w.every((x) => !x)) return null; const u = v.map((x, i) => lam * x + w[i]), p = v.map((x) => lam * x), n2 = dot(v, v); if (u.includes(0)) return null;
        return QP("Donne le vecteur projeté orthogonal de " + M("\\vec{u} = " + v3(...u)) + " sur " + M("\\vec{v} = " + v3(...v)) + "." + TRIP, p,
          M("\\vec{u} \\cdot \\vec{v} = " + dot(u, v)) + ", " + M("\\|\\vec{v}\\|^2 = " + n2) + ", coefficient " + M(fT(lam)) + " : " + M("\\vec{p} = " + v3(...p)) + ".",
          { ctx: "projete-espace", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\|\\vec{v}\\|^2") + " ?", n2, M(n2) + "."), G("Coefficient ?", lam, M(lam) + "."), GP("Vecteur projeté ?", p, M(v3(...p)) + ".")],
            traps: [TP(v.map((x) => dot(u, v) * x), "Divise le produit scalaire par ‖v‖²."), TP(w, "C'est la partie orthogonale."), TP(u, "On ne garde que la partie parallèle à v.")] }); },
      () => { const d = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], e = [nz(-2, 2), nz(-2, 2), nz(-2, 2)], w = cross(d, e), A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], lam = pk([2, -1, 3, -2]); if (w.every((x) => !x)) return null; const H = A.map((x, i) => x + lam * d[i]), P = H.map((x, i) => x + w[i]), AP = P.map((x, i) => x - A[i]);
        return QP("Donne le projeté orthogonal " + M("H") + " du point " + ptN("P", ...P) + " sur la droite " + eqP(A, d) + "." + TRIP, H,
          M("\\overrightarrow{AP} \\cdot \\vec{d} = " + dot(AP, d)) + ", " + M("\\|\\vec{d}\\|^2 = " + dot(d, d)) + ", " + M("t = " + lam) + " : " + ptN("H", ...H) + ".",
          { ctx: "pied-espace", guide: [G(M("\\overrightarrow{AP} \\cdot \\vec{d}") + " (A point de départ de la droite) ?", dot(AP, d), M(dot(AP, d)) + "."), G("Paramètre " + M("t = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}") + " ?", lam, M(lam) + "."), GP("Point " + M("H") + " ?", H, ptN("H", ...H) + ".")],
            traps: [TP(A, "C'est le point de départ (t = 0) : calcule t."), TP(A.map((x, i) => x - lam * d[i]), "Attention au signe de t."), TP(d.map((x) => lam * x), "Ajoute les coordonnées du point de départ.")] }); },
      () => { const d = pk(SMALL.concat([[3, 4], [4, -3]])), A = [R.int(-4, 3), R.int(-4, 3)], B = [A[0] + d[0], A[1] + d[1]], lam = pk([0.5, 2, -1, 1.5]), mu = pk([2, 3, -2, -3]), n2 = d[0] ** 2 + d[1] ** 2, H = [A[0] + lam * d[0], A[1] + lam * d[1]], C = [H[0] - mu * d[1], H[1] + mu * d[0]]; if (!C.every(Number.isInteger)) return null;
        const h = Math.abs(mu) * Math.sqrt(n2), aire = (Math.abs(mu) * n2) / 2, ex = Number.isInteger(r6(h));
        return QN("Triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + ". Calcule son aire avec la hauteur issue de " + M("C") + " (projeté orthogonal de C sur (AB)). (décimal accepté)", aire,
          "Projeté " + ptN("H", ...H) + ", hauteur " + M("CH " + (ex ? "= " + h : "= " + Math.abs(mu) + "\\sqrt{" + n2 + "}")) + ", base " + M("AB = \\sqrt{" + n2 + "}") + " : aire " + M("\\frac{1}{2} \\cdot AB \\cdot CH = " + fT(aire)) + ".",
          { ctx: "aire-hauteur", guide: [GP("Projeté " + M("H") + " de " + M("C") + " sur " + M("(AB)") + " ?", H, ptN("H", ...H) + "."), G("Hauteur " + M("CH") + " (au centième) ?", h, M(ex ? h : D(h, 0.01)) + ".", ex ? undefined : 0.01), G("Aire ?", aire, M(fT(aire)) + ".")],
            traps: [TR(aire * 2, "Aire d'un triangle : base × hauteur ÷ 2."), TR(Math.sqrt(n2) * Math.hypot(C[0] - A[0], C[1] - A[1]) / 2, "AC n'est pas la hauteur : prends la distance de C à (AB).")] }); },
    ],
  };

  // ===================================== F4. pvectmp : produit vectoriel (S7.VE, 24.11 ; « facultatif » dans le polycopié MP4, chap. F, leçon 5) =====================================
  const nrm = (w) => Math.hypot(...w);
  const ok2 = (v) => den(v) === 1 || den(v) === 2; /* valeur exacte (entière ou demi-entière) */
  const eqv = (v) => (ok2(v) ? "= " + N(v) : "\\approx " + D(v, 0.01));
  const rnd = (v) => (ok2(v) ? undefined : 0.01);
  const add3 = (a, b, k = 1) => a.map((x, i) => x + k * b[i]);
  /* 25.11 (corrigés de 332 à 373 px sur téléphone) : produit sans « · » devant une parenthèse ; le résultat passe à la ligne (M séparé). */
  const mulT = (a, b) => pT(a) + (b < 0 ? pT(b) : " \\cdot " + pT(b));
  const crT = (u, v) => v3(mulT(u[1], v[2]) + " - " + mulT(u[2], v[1]), mulT(u[2], v[0]) + " - " + mulT(u[0], v[2]), mulT(u[0], v[1]) + " - " + mulT(u[1], v[0]));
  const sq3 = (w) => w.map((x) => pT(x) + "^2").join(" + ");
  const PV = {
    1: [
      () => { const u = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], w = cross(u, v); if (w.includes(0)) return null;
        return QP("Calcule le produit vectoriel " + M("\\vec{u} \\times \\vec{v}") + " avec " + M("\\vec{u} = " + v3(...u)) + " et " + M("\\vec{v} = " + v3(...v)) + "." + TRIP, w,
          M("\\vec{u} \\times \\vec{v} = " + crT(u, v)) + " " + M("= " + v3(...w)) + ".",
          { ctx: "composantes", guide: [G("Première composante " + M("u_2 v_3 - u_3 v_2") + " ?", w[0], M(pT(u[1]) + " \\cdot " + pT(v[2]) + " - " + pT(u[2]) + " \\cdot " + pT(v[1]) + " = " + w[0]) + "."), G("Deuxième composante " + M("u_3 v_1 - u_1 v_3") + " ?", w[1], M(w[1]) + "."), G("Troisième composante " + M("u_1 v_2 - u_2 v_1") + " ?", w[2], M(w[2]) + "."), GP("Produit vectoriel ?", w, M(v3(...w)) + ".")],
            traps: [TP(w.map((x) => -x), "L'ordre compte : v × u = −(u × v). Première composante : u₂v₃ − u₃v₂, dans cet ordre."), TP(u.map((x, i) => x * v[i]), "Ce n'est pas un produit composante par composante : on croise les composantes (u₂v₃ − u₃v₂, …)."), TP([w[0], -w[1], w[2]], "Deuxième composante : u₃v₁ − u₁v₃ (attention à l'ordre des produits).")] }); },
      () => { const [a, b, c, d] = pk(TRI3), w = perm([a, b, c]).map((x) => x * sgn()), tri = R.rand() < 0.5, ar = tri ? d / 2 : d;
        return QN("On a calculé " + M("\\vec{u} \\times \\vec{v} = " + v3(...w)) + ". Quelle est l'aire du " + (tri ? "triangle" : "parallélogramme") + " construit sur " + M("\\vec{u}") + " et " + M("\\vec{v}") + " ?" + (tri ? " (décimal accepté)" : ""), ar,
          "L'aire du parallélogramme est la norme du produit vectoriel : " + M("\\sqrt{" + sq3(w) + "} = \\sqrt{" + d * d + "} = " + d) + (tri ? " ; le triangle en est la moitié, " + M(N(ar)) : "") + ".",
          { ctx: tri ? "aire-triangle-norme" : "aire-para-norme", guide: [G("Somme des carrés des composantes ?", d * d, M(w.map((x) => x * x).join(" + ") + " = " + d * d) + "."), G("Norme " + M("\\|\\vec{u} \\times \\vec{v}\\|") + " ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")].concat(tri ? [G("Aire du triangle ?", ar, M(d + " \\div 2 = " + N(ar)) + ".")] : []),
            traps: [TR(d * d, "N'oublie pas la racine carrée."), TR(tri ? d : d / 2, tri ? "Le triangle est la moitié du parallélogramme." : "C'est l'aire du triangle ; le parallélogramme vaut la norme entière."), TR(Math.abs(w[0]) + Math.abs(w[1]) + Math.abs(w[2]), "Norme : √(x² + y² + z²), pas la somme des composantes.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), e = nz(-6, 6), det = a * e - b * c, ar = Math.abs(det); if (ar < 2 || [a, b, c, e].map(Math.abs).includes(ar)) return null;
        const it = pk([["Une terrasse", "m"], ["Une parcelle de jardin", "dam"], ["Un vitrail", "dm"], ["Le tablier d'un petit pont", "m"]]);
        /* 25.11 (formule trop large sur téléphone) : calcul de la 3e composante sorti du vecteur colonne. */
        return QN(it[0] + " a la forme d'un parallélogramme construit sur " + M("\\vec{u} = " + v2(a, b)) + " et " + M("\\vec{v} = " + v2(c, e)) + " (en " + it[1] + "). On les écrit dans l'espace avec " + M("z = 0") + " : " + M("\\vec{u} \\times \\vec{v}") + " n'a qu'une composante non nulle. Calcule l'aire (en " + M("\\text{" + it[1] + "}^2") + ").", ar,
          "Troisième composante " + M("u_1 v_2 - u_2 v_1 = " + pT(a) + " \\cdot " + pT(e) + " - " + pT(b) + " \\cdot " + pT(c) + " = " + det) + ", donc " + M("\\vec{u} \\times \\vec{v} = " + v3(0, 0, det)) + " ; aire " + M("|" + det + "| = " + ar + "\\ \\text{" + it[1] + "}^2") + ".",
          { ctx: "aire-plan", guide: [G("Troisième composante " + M("u_1 v_2 - u_2 v_1") + " ?", det, M(pT(a) + " \\cdot " + pT(e) + " - " + pT(b) + " \\cdot " + pT(c) + " = " + det) + "."), G("Aire (une aire est positive) ?", ar, M(ar) + ".")],
            traps: [TR(Math.abs(a * c + b * e), "C'est le produit scalaire ; l'aire vient du produit vectoriel."), TR(Math.abs(a * e + b * c), "u₁v₂ − u₂v₁ : on soustrait les deux produits."), TR(ar / 2, "Pour le parallélogramme, on prend la norme entière (le triangle en serait la moitié)."), TR(det, "Une aire est positive : prends la valeur absolue.")] }); },
    ],
    2: [
      () => { const A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], u = [nz(-3, 3), nz(-3, 3), R.int(-3, 3)], v = [R.int(-3, 3), nz(-3, 3), nz(-3, 3)], w = cross(u, v); if (w.filter((x) => x).length < 2) return null;
        const B = add3(A, u), C = add3(A, v), n = nrm(w), ar = n / 2, ro = rnd(ar);
        return QN("Calcule l'aire du triangle " + ptN("A", ...A) + ", " + ptN("B", ...B) + ", " + ptN("C", ...C) + " dans l'espace" + (ro ? " (au centième)." : ". (décimal accepté)"), ar,
          M("\\overrightarrow{AB} = " + v3(...u)) + ", " + M("\\overrightarrow{AC} = " + v3(...v)) + ", " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC} = " + v3(...w)) + " ; aire " + M("\\frac{1}{2}\\sqrt{" + Math.round(n * n) + "} " + eqv(ar)) /* 26.11 : √(50.00000000000001) */ + ".",
          Object.assign({ ctx: "aire-triangle-espace", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?" + TRIP, v, M(v3(...v)) + "."), GP(M("\\overrightarrow{AB} \\times \\overrightarrow{AC}") + " ?" + TRIP, w, M(v3(...w)) + "."), G("Aire " + M("\\frac{1}{2}\\|\\overrightarrow{AB} \\times \\overrightarrow{AC}\\|") + (ro ? " (au centième)" : "") + " ?", ar, M(eqv(ar).replace(/^= /, "")) + ".", ro)],
            traps: [TR(n, "Pour le triangle, on prend la moitié de la norme."), TR((n * n) / 2, "N'oublie pas la racine carrée."), TR((nrm(u) * nrm(v)) / 2, "AB · AC ÷ 2 ne vaut que si l'angle en A est droit : passe par le produit vectoriel.")] }, ro ? { round: ro } : {})); },
      () => { const A = [R.int(0, 4), R.int(0, 4), R.int(0, 3)], u = [nz(-3, 3), nz(-3, 3), R.int(-2, 2)], v = [nz(-3, 3), R.int(-3, 3), nz(-2, 2)], w = cross(u, v); if (w.filter((x) => x).length < 2) return null;
        const B = add3(A, u), C = add3(A, v), it = pk([["Un panneau solaire triangulaire", "panneau"], ["Une voile d'ombrage tendue", "voile"], ["Un pan de toit triangulaire", "toit"]]);
        return QP(it[0] + " a ses coins en " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + ptN("C", ...C) + " (en m). Calcule le vecteur normal " + M("\\vec{n} = \\overrightarrow{AB} \\times \\overrightarrow{AC}") + ", perpendiculaire à la surface." + TRIP, w,
          M("\\overrightarrow{AB} = " + v3(...u)) + ", " + M("\\overrightarrow{AC} = " + v3(...v)) + ", " + M("\\vec{n} = " + crT(u, v)) + " " + M("= " + v3(...w)) + ". Vérification : " + M("\\vec{n} \\cdot \\overrightarrow{AB} = 0") + " et " + M("\\vec{n} \\cdot \\overrightarrow{AC} = 0") + ".",
          { ctx: "normal-" + it[1], guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), GP("Composantes de " + M("\\overrightarrow{AC}") + " ?" + TRIP, v, M(v3(...v)) + "."), GP("Vecteur normal " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC}") + " ?" + TRIP, w, M(v3(...w)) + ".")],
            traps: [TP(w.map((x) => -x), "C'est AC × AB : l'ordre compte, AC × AB = −(AB × AC)."), TP(u.map((x, i) => x * v[i]), "On ne multiplie pas composante par composante : formule « en croix »."), TP(cross(B, C), "Calcule d'abord les vecteurs AB et AC (pas les coordonnées des points).")] }); },
      () => { const it = pk([["On serre un écrou avec une clé", "clé"], ["On pousse une porte", "porte"], ["Un cycliste appuie sur sa pédale", "pedale"]]), rx = pk([0.2, 0.25, 0.3, 0.4]), ry = pk([0.1, 0.15, 0.2]), fx = pk([-40, -30, -20, 20, 30, 50]), fy = pk([60, 80, 100, 120, -60, -80]);
        const mz = r6(rx * fy - ry * fx), am = Math.abs(mz); if (am < 2 || [fx, fy].map(Math.abs).includes(am)) return null;
        /* 25.11 (formule trop large sur téléphone) : calcul de la 3e composante sorti du vecteur colonne. */
        return QN(it[0] + " : le bras de levier est " + M("\\vec{r} = " + v3(N(rx), N(ry), 0)) + " (en m) et la force " + M("\\vec{F} = " + v3(fx, fy, 0)) + " (en N). Calcule la norme du moment " + M("\\vec{M} = \\vec{r} \\times \\vec{F}") + " (en N·m).", am,
          "Troisième composante " + M("r_x F_y - r_y F_x = " + N(rx) + " \\cdot " + pT(fy) + " - " + N(ry) + " \\cdot " + pT(fx) + " = " + N(mz)) + ", donc " + M("\\vec{r} \\times \\vec{F} = " + v3(0, 0, N(mz))) + " ; norme " + M(N(am)) + " N·m.",
          { ctx: "moment-" + it[1], guide: [G("Troisième composante " + M("r_x F_y - r_y F_x") + " ?", mz, M(N(rx) + " \\cdot " + pT(fy) + " - " + N(ry) + " \\cdot " + pT(fx) + " = " + N(mz)) + "."), G("Norme du moment (positive) ?", am, M(N(am)) + " N·m.")],
            traps: [TR(Math.abs(r6(rx * fx + ry * fy)), "C'est le produit scalaire (le travail) ; le moment vient du produit vectoriel."), TR(Math.abs(r6(rx * fy + ry * fx)), "r_x F_y − r_y F_x : on soustrait."), TR(nrm([rx, ry]) * nrm([fx, fy]), "‖r‖ · ‖F‖ seulement si la force est perpendiculaire au bras de levier.")] }); },
    ],
    3: [
      () => { const [a, b, c, dn] = pk(TRI3.filter((t) => t[3] > 3 && t[3] < 10)), d = perm([a, b, c]).map((x) => x * sgn()), e = [nz(-1, 1), nz(-1, 1), nz(-1, 1)], wv = cross(d, e); if (wv.filter((x) => x).length < 2) return null;
        const A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], lam = pk([1, 2, -1, -2]), P = add3(add3(A, d, lam), wv), AP = P.map((x, i) => x - A[i]), cr = cross(AP, d), nc = nrm(cr), dist = nc / dn, ro = rnd(dist);
        return QN("Calcule la distance du point " + ptN("P", ...P) + " à la droite " + eqP(A, d) + (ro ? " (au centième)." : "."), dist,
          M("\\overrightarrow{AP} = " + v3(...AP)) + ", " + M("\\overrightarrow{AP} \\times \\vec{d} = " + v3(...cr)) + " ; distance " + M("\\frac{\\|\\overrightarrow{AP} \\times \\vec{d}\\|}{\\|\\vec{d}\\|} = \\frac{\\sqrt{" + Math.round(nc * nc) + "}}{" + dn + "} " + eqv(dist)) + ".",
          Object.assign({ ctx: "distance-point-droite", guide: [GP("Composantes de " + M("\\overrightarrow{AP}") + " (A, point de départ de la droite) ?" + TRIP, AP, M(v3(...AP)) + "."), GP(M("\\overrightarrow{AP} \\times \\vec{d}") + " ?" + TRIP, cr, M(v3(...cr)) + "."), G(M("\\|\\vec{d}\\|") + " ?", dn, M("\\sqrt{" + dn * dn + "} = " + dn) + "."), G("Distance " + M("\\frac{\\|\\overrightarrow{AP} \\times \\vec{d}\\|}{\\|\\vec{d}\\|}") + (ro ? " (au centième)" : "") + " ?", dist, M(eqv(dist).replace(/^= /, "")) + ".", ro)],
            traps: [TR(nrm(AP), "AP est oblique : la distance se mesure perpendiculairement à la droite."), TR(nc, "Divise encore par la norme de d."), TR(nc / (dn * dn), "On divise par ‖d‖, pas par ‖d‖².")] }, ro ? { round: ro } : {})); },
      () => { const u = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], t = pk([2, 3, -1, -2, 0.5, 1.5]), C = add3(A, u, t); if (!C.every(Number.isInteger)) return null; const B = add3(A, u), k = C[2];
        if ([0, 1, -1].includes(k) || A.includes(k) || B.includes(k) || C[0] === k || C[1] === k) return null;
        return QN("On donne " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, k)") + ". Trouve " + M("k") + " pour que les trois points soient alignés, c'est-à-dire " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC} = \\vec{0}") + ".", k,
          "Le produit vectoriel est nul quand les vecteurs sont colinéaires : " + M("\\overrightarrow{AC} = t \\, \\overrightarrow{AB}") + " avec " + M("\\overrightarrow{AB} = " + v3(...u)) + ". En x : " + M(pT(C[0] - A[0]) + " = " + pT(u[0]) + " t") + ", " + M("t = " + fT(t)) + " ; en z : " + M("k = " + fT(A[2]) + " + " + pT(t) + " \\cdot " + pT(u[2]) + " = " + k) + ".",
          { ctx: "alignement", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), G("Facteur " + M("t") + " tel que " + M("\\overrightarrow{AC} = t \\, \\overrightarrow{AB}") + " (lis-le sur les abscisses) ?", t, M(fT(C[0] - A[0]) + " \\div " + pT(u[0]) + " = " + fT(t)) + "."), G(M("k = z_A + t \\cdot u_z") + " ?", k, M(k) + ".")],
            traps: [TR(B[2], "C'est la cote de B : multiplie le vecteur AB par t = " + T(t) + "."), TR(r6(A[2] - t * u[2]), "Attention au signe : k = z_A + t · (z_B − z_A)."), TR(r6(t * u[2]), "Ajoute la cote de A.")] }); },
      () => { const A = [R.int(-2, 3), R.int(-2, 3), R.int(0, 3)], u = [nz(-3, 3), nz(-3, 3), R.int(-2, 2)], v = [R.int(-3, 3), nz(-3, 3), nz(-2, 2)], w = cross(u, v); if (w.filter((x) => x).length < 2) return null;
        const B = add3(A, u), C = add3(B, v), n = nrm(w), ro = rnd(n), it = pk(["Une rampe d'accès", "Un pare-soleil", "Une plaque de verre"]);
        return QN(it + " a la forme d'un parallélogramme " + M("ABCD") + " avec " + ptN("A", ...A) + ", " + ptN("B", ...B) + " et " + ptN("C", ...C) + " (en m). Calcule son aire (en m²" + (ro ? ", au centième" : "") + ").", n,
          "Dans " + M("ABCD") + ", " + M("\\overrightarrow{AD} = \\overrightarrow{BC}") + ". " + M("\\overrightarrow{AB} = " + v3(...u)) + ", " + M("\\overrightarrow{BC} = " + v3(...v)) + ", " + M("\\overrightarrow{AB} \\times \\overrightarrow{BC} = " + v3(...w)) + " ; aire " + M("\\sqrt{" + r6(n * n) + "} " + eqv(n)) + " m².",
          Object.assign({ ctx: "aire-parallelogramme", guide: [GP("Composantes de " + M("\\overrightarrow{AB}") + " ?" + TRIP, u, M(v3(...u)) + "."), GP("Composantes de " + M("\\overrightarrow{BC}") + " (égal à " + M("\\overrightarrow{AD}") + ") ?" + TRIP, v, M(v3(...v)) + "."), GP(M("\\overrightarrow{AB} \\times \\overrightarrow{BC}") + " ?" + TRIP, w, M(v3(...w)) + "."), G("Aire" + (ro ? " (au centième)" : "") + " ?", n, M(eqv(n).replace(/^= /, "")) + ".", ro)],
            traps: [TR(n / 2, "C'est l'aire du triangle ABC ; le parallélogramme vaut le double."), TR(nrm(u) * nrm(v), "AB · BC ne vaut que pour un rectangle : passe par le produit vectoriel."), TR(n * n, "N'oublie pas la racine carrée.")] }, ro ? { round: ro } : {})); },
    ],
  };

  // ===================================== J3. fratmp : fonctions rationnelles simples (S8.FS.06, 24.11) =====================================
  const fracT = (a, b, c, d) => "\\frac{" + lin(a, b) + "}{" + lin(c, d) + "}";
  const hyp = (k, h, v) => (x) => k / (x - h) + v;
  const RA = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-9, 9), c = pk([2, 3, 4, 5, -2, -3]), d = nz(-9, 9), x = r6(-d / c); if (a * d === b * c || Math.abs(x) === 1 || Math.abs(d) === Math.abs(x) || den(x) > 6) return null;
        return QN("Quelle est la valeur interdite de " + M("f(x) = " + fracT(a, b, c, d)) + " ? (fraction acceptée)", x, "Le dénominateur s'annule : " + M(lin(c, d) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "valeur-interdite", guide: [G("On résout " + M(lin(c, d) + " = 0") + " : " + M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR(-x, "Attention au signe en isolant x."), TR(r6(-b / a), "C'est le zéro (numérateur) ; la valeur interdite annule le dénominateur."), TR(-d, "Divise encore par " + c + ".")] }); },
      () => { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-9, 9), c = nz(-4, 4), d = nz(-9, 9), x = r6(-b / a); if (a * d === b * c || Math.abs(x) === 1 || Math.abs(b) === Math.abs(x) || den(x) > 6 || c * x + d === 0) return null;
        return QN("Quel est le zéro de " + M("f(x) = " + fracT(a, b, c, d)) + " ? (fraction acceptée)", x, "Un quotient est nul quand son numérateur est nul (et le dénominateur non nul) : " + M(lin(a, b) + " = 0") + ", " + M("x = " + fT(x)) + ".",
          { ctx: "zero", guide: [G("On résout " + M(lin(a, b) + " = 0") + " : " + M("x") + " = ?", x, M(fT(x)) + ".")],
            traps: [TR(r6(-d / c), "C'est la valeur interdite ; le zéro annule le numérateur."), TR(-x, "Attention au signe."), TR(r6(b / d), "On ne simplifie pas les termes constants : résous numérateur = 0.")] }); },
      () => { const a = nz(-9, 9), c = pk([2, 3, 4, 5, -2, -4]), b = nz(-9, 9), d = nz(-9, 9), y = r6(a / c); if (a * d === b * c || Math.abs(y) === 1 || den(y) > 5 || Math.abs(y) === Math.abs(a)) return null;
        return QN("La courbe de " + M("f(x) = " + fracT(a, b, c, d)) + " a une asymptote horizontale " + M("y = k") + ". Que vaut " + M("k") + " ? (fraction acceptée)", y, "Pour x très grand, seuls les termes en x comptent : " + M("f(x) \\approx \\frac{" + a + "x}{" + c + "x} = " + fT(y)) + ".",
          { ctx: "asymptote-horizontale", guide: [G("Coefficient de " + M("x") + " au numérateur ?", a, M(a) + "."), G("Au dénominateur ?", c, M(c) + "."), G(M("k") + " = ?", y, M(fT(y)) + ".")],
            traps: [TR(r6(b / d), "Pour x très grand, ce sont les termes en x qui comptent, pas les constantes."), TR(r6(-d / c), "C'est l'asymptote verticale (valeur interdite)."), TR(r6(c / a), "Numérateur divisé par dénominateur : a ÷ c.")] }); },
    ],
    2: [
      () => { const a = nz(-6, 6), b = nz(-9, 9), c = pk([2, 3, 4, -2, -3]), d = nz(-9, 9), X = r6(-d / c), Y = r6(a / c); if (a * d === b * c || den(X) > 4 || den(Y) > 4 || Math.abs(X) === Math.abs(Y)) return null;
        return QP("Donne les asymptotes de " + M("f(x) = " + fracT(a, b, c, d)) + " : verticale " + M("x = \\ldots") + " et horizontale " + M("y = \\ldots") + ". Réponds « x ; y » (fractions acceptées).", [X, Y],
          "Verticale : " + M(lin(c, d) + " = 0") + ", " + M("x = " + fT(X)) + ". Horizontale : " + M("y = \\frac{" + a + "}{" + c + "} = " + fT(Y)) + ".",
          { ctx: "asymptotes", guide: [G("Asymptote verticale : " + M("x") + " = ?", X, M(fT(X)) + "."), G("Asymptote horizontale : " + M("y") + " = ?", Y, M(fT(Y)) + "."), GP("Réponse ?", [X, Y], M("x = " + fT(X)) + ", " + M("y = " + fT(Y)) + ".")],
            traps: [TP([-X, Y], "Valeur interdite : attention au signe."), TP([X, r6(b / d)], "Asymptote horizontale : rapport des coefficients de x."), TP([r6(-b / a), Y], "L'asymptote verticale vient du dénominateur.")] }); },
      () => { let r1 = nz(-6, 6), r2 = nz(-6, 6); if (r1 === r2 || Math.abs(r1) === 1 || Math.abs(r2) === 1 || r1 === -r2) return null; const al = nz(-7, 7); if (-al === r1 || -al === r2) return null; const p = -(r1 + r2), q = r1 * r2;
        return QS("Quelles sont les valeurs interdites de " + M("f(x) = \\frac{" + lin(1, al) + "}{" + polyT([1, p, q]) + "}") + " ? Sépare-les par « ; ».", [r1, r2],
          "Le dénominateur " + M(polyT([1, p, q]) + " = (" + lin(1, -r1) + ")(" + lin(1, -r2) + ")") + " s'annule en " + M(fT(Math.min(r1, r2))) + " et " + M(fT(Math.max(r1, r2))) + ".",
          { ctx: "domaine-quadratique", guide: [G("Produit des deux racines du dénominateur ?", q, M(q) + "."), G("Somme des deux racines ?", r1 + r2, M(r1 + r2) + "."), GSet("Valeurs interdites ?", [r1, r2], M(setT([r1, r2]).replace("S = ", "")) + ".")],
            traps: [TS([-r1, -r2], "Signes : (x − a)(x − b) s'annule en a et b."), TS([-al], "C'est le zéro du numérateur ; les valeurs interdites annulent le dénominateur."), TS([r1, r2, -al], "Le zéro du numérateur n'est pas interdit.")] }); },
      () => { const a = nz(-5, 5), c = nz(-3, 3), d = nz(-6, 6), k = nz(-4, 4), x0 = pk([2, 3, -2, -3, 4, 5]), b = k * (c * x0 + d) - a * x0; if (a - k * c === 0 || c * x0 + d === 0 || !b || a * d === b * c || k === a) return null;
        return QN("Résous " + M(fracT(a, b, c, d) + " = " + k) + ".", x0,
          "On multiplie par " + M(lin(c, d)) + " (non nul) : " + M(lin(a, b) + " = " + k + "(" + lin(c, d) + ")") + ", " + M(lin(a - k * c, 0) + " = " + (k * d - b)) + ", " + M("x = " + x0) + " (pas une valeur interdite).",
          { ctx: "equation-rationnelle", guide: [G("Après " + M("ax + b = k(cx + d)") + ", coefficient de " + M("x") + " (" + M("a - kc") + ") ?", a - k * c, M(a - k * c) + "."), G("Membre de droite " + M("kd - b") + " ?", k * d - b, M(k * d - b) + "."), G(M("x") + " = ?", x0, M(x0) + ".")],
            traps: [TR(-x0, "Attention au signe en isolant x."), TR(r6((k * d - b) / a), "Développe aussi k(cx + d) : le terme en x passe à gauche."), TR(r6((k - b) / a), "Multiplie d'abord les deux membres par le dénominateur.")] }); },
    ],
    3: [
      () => { const h = nz(-3, 3), v = nz(-3, 3), k = pk([1, 2, 3, -1, -2]); if (Math.abs(h) === Math.abs(v)) return null; const fig = FIG.plot([{ f: hyp(k, h, v) }], [], { xr: [-6, 6], yr: [-6, 6], numbers: true, label: "hyperbole" });
        return QP("Le graphique montre la courbe de " + M("f(x) = \\frac{k}{x - h} + v") + ". Lis ses asymptotes : verticale " + M("x = \\ldots") + " et horizontale " + M("y = \\ldots") + ". Réponds « x ; y ».", [h, v],
          "La courbe s'approche de la droite verticale " + M("x = " + h) + " (valeur interdite) et de la droite horizontale " + M("y = " + v) + " (pour x très grand) : " + M("f(x) = \\frac{" + k + "}{" + lin(1, -h) + "}" + sg(v)) + ".",
          { ctx: "lecture-graphe", fig, guide: [G("Abscisse de la droite verticale dont la courbe s'approche ?", h, M("x = " + h) + "."), G("Ordonnée de la droite horizontale ?", v, M("y = " + v) + "."), GP("Réponse ?", [h, v], M("x = " + h) + ", " + M("y = " + v) + ".")],
            traps: [TP([-h, v], "Lis l'abscisse sur le graphique : la valeur interdite est " + h + "."), TP([h, -v], "Lis l'ordonnée de l'asymptote horizontale.")] }); },
      () => { const h = nz(-3, 3), v = nz(-3, 3), dl = pk([1, 2, -1, -2]), q = pk([2, 3, -2, -3]), k = dl * q, x0 = h + dl, y0 = v + q; if (Math.abs(k) < 2 || Math.abs(x0) > 5 || Math.abs(y0) > 5 || Math.abs(h) === Math.abs(v)) return null;
        const fig = FIG.plot([{ f: hyp(k, h, v) }], [[x0, y0, "P"]], { xr: [-6, 6], yr: [-6, 6], numbers: true, hlines: [v], vlines: [h], label: "hyperbole et ses asymptotes" });
        return QN("La courbe de " + M("f(x) = \\frac{k}{x - h} + v") + " a pour asymptotes " + M("x = " + h) + " et " + M("y = " + v) + " (en traitillé) et passe par le point " + M("P") + " du graphique. Que vaut " + M("k") + " ?", k,
          "On lit " + ptN("P", x0, y0) + " : " + M(y0 + " = \\frac{k}{" + pT(x0) + " - " + pT(h) + "}" + sg(v)) + ", " + M("\\frac{k}{" + dl + "} = " + q) + ", " + M("k = " + k) + ".",
          { ctx: "retrouver-k", fig, guide: [GP("Coordonnées de " + M("P") + " ?", [x0, y0], ptN("P", x0, y0) + "."), G(M("x_P - h") + " ?", dl, M(dl) + "."), G(M("y_P - v") + " ?", q, M(q) + "."), G(M("k = (x_P - h)(y_P - v)") + " ?", k, M(k) + ".")],
            traps: [TR(r6(q / dl), "k = (y − v)(x − h) : on multiplie."), TR(y0 * dl, "Soustrais d'abord v = " + v + "."), TR(-k, "Attention aux signes.")] }); },
      () => { const it = pk([["Une imprimante 3D coûte", "frais fixes", "pièces imprimées", "pièce", "imprimante"], ["Un club de sport facture une cotisation annuelle de", "cotisation", "séances", "séance", "club"], ["Un atelier de t-shirts paie", "frais de démarrage", "t-shirts", "t-shirt", "atelier"]]), c = pk([2, 3, 4, 5, 6]), dk = pk([2, 4, 5, 8]), x0 = pk([25, 40, 50, 60, 75, 120]), F = x0 * dk, k = c + dk;
        const txt = it[0] + " " + M(F + "\\text{ CHF}") + " (" + it[1] + "), puis " + M(c + "\\text{ CHF}") + " par " + it[3] + ". Le coût moyen par " + it[3] + " est " + M("C(x) = \\frac{" + F + " + " + c + "x}{x}") + ". Pour combien de " + it[2] + " le coût moyen descend-il à " + M(k + "\\text{ CHF}") + " ?";
        return QN(txt, x0, M("\\frac{" + F + " + " + c + "x}{x} = " + k) + " donne " + M(F + " + " + c + "x = " + k + "x") + ", " + M(dk + "x = " + F) + ", " + M("x = " + x0) + ". (Asymptote horizontale " + M("y = " + c) + " : le coût moyen ne descend jamais sous " + c + " CHF.)",
          { ctx: "cout-moyen-" + it[4], guide: [G("On multiplie par x : coefficient de x après regroupement, " + M(k + " - " + c) + " ?", dk, M(dk) + "."), G(M("x") + " = ?", x0, M(F + " \\div " + dk + " = " + x0) + ".")],
            traps: [TR(r6(F / k), "Le coût par " + it[3] + " s'ajoute : " + k + "x = " + F + " + " + c + "x."), TR(r6(F / (k + c)), "On soustrait " + c + "x des deux côtés."), TR(r6(F / c), "Pose C(x) = " + k + ".")] }); },
    ],
  };

  const PROBS = {
    posdroites: () => P("d : x = 1 + t, y = 2 − t, z = 3 + 2t ; g : x = 5 + 2s, y = 1 + s, z = m − s.", [["a) t obtenu avec les équations en x et y", 2], ["b) s obtenu avec les mêmes équations", -1], ["c) m pour que les droites soient sécantes", 6]], ["1 + t = 5 + 2s et 2 − t = 1 + s.", "En z : 3 + 2 · 2 = m − (−1)."], "a) " + M("t = 2") + " ; b) " + M("s = -1") + " ; c) " + M("7 = m + 1") + ", " + M("m = 6") + " : point commun " + M("(3 \\,;\\, 0 \\,;\\, 7)") + ". Pour une autre valeur de m, les droites seraient gauches."),
    projmp: () => P("On donne u = (4 ; 7) et v = (3 ; 4).", [["a) u · v", 40], ["b) Projection scalaire de u sur v", 8], ["c) Première composante du vecteur projeté de u sur v", 4.8]], ["4 · 3 + 7 · 4.", "40 ÷ ‖v‖ = 40 ÷ 5."], "a) 40 ; b) " + M("\\frac{40}{5} = 8") + " ; c) " + M("\\frac{40}{25} \\cdot 3 = 4{,}8") + " (projeté " + M("(4{,}8 \\,;\\, 6{,}4)") + ")."),
    pvectmp: () => P("On donne u = (1 ; 2 ; 2) et v = (2 ; −1 ; 2).", [["a) Première composante de u × v", 6], ["b) Troisième composante de u × v", -5], ["c) Aire du parallélogramme construit sur u et v (au centième)", Math.sqrt(65), 0.01]], ["u₂v₃ − u₃v₂ = 2 · 2 − 2 · (−1).", "u₁v₂ − u₂v₁ = 1 · (−1) − 2 · 2."], "a) 6 ; b) −5 (u × v = (6 ; 2 ; −5), orthogonal à u : 6 + 4 − 10 = 0) ; c) " + M("\\sqrt{36 + 4 + 25} = \\sqrt{65} \\approx 8{,}06") + "."),
    fratmp: () => P("Soit f(x) = (2x − 6) ÷ (x + 4).", [["a) Valeur interdite", -4], ["b) Zéro de f", 3], ["c) Asymptote horizontale y = …", 2]], ["x + 4 = 0.", "Pour x très grand : 2x ÷ x."], "a) −4 (asymptote verticale " + M("x = -4") + ") ; b) " + M("2x - 6 = 0") + ", " + M("x = 3") + " ; c) " + M("y = 2") + "."),
    coordmp: () => P("On donne A(1 ; 2) et B(4 ; 6).", [["a) Distance AB", 5], ["b) Abscisse du milieu de [AB]", 2.5], ["c) Rayon polaire r du point B (au centième)", Math.hypot(4, 6), 0.01]], ["√(3² + 4²).", "(1 + 4) ÷ 2."], "a) 5 ; b) 2,5 (milieu (2,5 ; 4)) ; c) " + M("\\sqrt{52} \\approx 7{,}21") + "."),
    vectmp: () => P("On donne u = (3 ; −4) et v = (1 ; 2).", [["a) Norme de u", 5], ["b) Première composante de 2u − v", 5], ["c) Seconde composante de 2u − v", -10]], ["√(9 + 16).", "2 · 3 − 1."], "a) 5 ; b) 5 ; c) " + M("2 \\cdot (-4) - 2 = -10") + "."),
    scalmp: () => P("On donne u = (2 ; 1) et v = (1 ; 3).", [["a) u · v", 5], ["b) cos de l'angle (au centième)", 5 / Math.sqrt(50), 0.01], ["c) Angle en degrés (au dixième)", 45, 0.1]], ["2 · 1 + 1 · 3.", "5 ÷ (√5 · √10)."], "a) 5 ; b) " + M("\\frac{5}{\\sqrt{50}} \\approx 0{,}71") + " ; c) 45°."),
    droiteparam: () => P("La droite d passe par A(2 ; −1) et B(5 ; 3) : x = 2 + 3t, y = −1 + 4t.", [["a) Seconde composante du vecteur directeur AB", 4], ["b) Abscisse du point de d pour t = 2", 8], ["c) Valeur de t pour le point (−1 ; −5)", -1]], ["3 − (−1).", "2 + 3 · 2."], "a) 4 (vecteur (3 ; 4)) ; b) 8 ; c) " + M("2 + 3t = -1") + ", " + M("t = -1") + "."),
    ineqmp: () => P("On étudie (2x − 1) ÷ (x + 3) ≥ 0.", [["a) Zéro du numérateur", 0.5], ["b) Valeur interdite", -3], ["c) Signe du quotient pour x = 0 (−1 ou 1)", -1]], ["2x − 1 = 0.", "x + 3 = 0."], "a) " + M("\\frac{1}{2}") + " ; b) −3 ; c) " + M("\\frac{-1}{3} < 0") + ". " + M("S = \\left]-\\infty \\,;\\, -3\\right[ \\cup \\left[\\frac{1}{2} \\,;\\, +\\infty\\right[") + "."),
    fctmp: () => P("Soit f(x) = 2x + 3 et g(x) = x².", [["a) f(g(2))", 11], ["b) g(f(2))", 49], ["c) f⁻¹(11)", 4]], ["g(2) = 4.", "f(2) = 7."], "a) " + M("f(4) = 11") + " ; b) " + M("g(7) = 49") + " ; c) " + M("2x + 3 = 11") + ", " + M("x = 4") + "."),
    polymp: () => P("Soit P(x) = x³ − 7x + 6.", [["a) P(2)", 0], ["b) Coefficient de x dans le quotient de P par (x − 1)", 1], ["c) Plus petit zéro de P", -3]], ["8 − 14 + 6.", "Quotient x² + x − 6."], "a) 0 ; b) quotient " + M("x^2 + x - 6") + " ; c) " + M("(x - 1)(x - 2)(x + 3)") + ", plus petit zéro −3."),
    sinusmp: () => P("La température d'une ville varie entre −2 °C et 24 °C sur une période de 12 mois.", [["a) Amplitude", 13], ["b) Axe d", 11], ["c) Coefficient b (x en mois), au centième", PI / 6, 0.01]], ["(24 − (−2)) ÷ 2.", "(24 + (−2)) ÷ 2."], "a) 13 ; b) 11 ; c) " + M("b = \\frac{2\\pi}{12} = \\frac{\\pi}{6} \\approx 0{,}52") + "."),
    explogfn: () => P("On cherche f(x) = a · b^x passant par (0 ; 3) et (2 ; 12).", [["a) a", 3], ["b) b", 2], ["c) f(5)", 96]], ["f(0) = a.", "3b² = 12."], "a) 3 ; b) 2 ; c) " + M("3 \\cdot 2^5 = 96") + "."),
  };

  const NEW = [
    { id: "coordmp", th: "CO", sem: "S7", theme: "es", label: "Coordonnées : distance, milieu, polaires", ex: "AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}", lv: CO,
      hint: "Distance : √(Δx² + Δy²) (+ Δz² dans l'espace). Milieu : moyenne des coordonnées. Polaires : x = r cos θ, y = r sin θ ; r = √(x² + y²), θ selon le quadrant.",
      lesson: ["Coordonnées", "Repérer un point dans le plan ou dans l'espace.", "Distance \\(AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\\) (ajouter \\((z_B - z_A)^2\\) dans l'espace). Milieu : \\(\\left(\\frac{x_A + x_B}{2} ; \\frac{y_A + y_B}{2}\\right)\\). Coordonnées polaires \\((r ; \\theta)\\) : \\(x = r\\cos\\theta\\), \\(y = r\\sin\\theta\\) ; inversement \\(r = \\sqrt{x^2 + y^2}\\) et \\(\\theta\\) d'après le quadrant.",
        ["\\(A(1 ; 2)\\), \\(B(4 ; 6)\\) : \\(AB = 5\\), milieu \\((2{,}5 ; 4)\\)", "\\((2 ; 60°)\\) en cartésiennes : \\((1 ; \\sqrt{3})\\)"], "Pour θ, vérifie le quadrant : \\((-4 ; -4)\\) donne 225°, pas 45°."],
      comps: ["Calculer une distance ou un milieu", "Retrouver un point ; passer des polaires aux cartésiennes", "Résoudre un problème de coordonnées (espace, équidistance)"] },
    { id: "vectmp", th: "VE", sem: "S7", theme: "es", label: "Vecteurs : composantes, opérations, norme", ex: "\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix}", lv: VE,
      hint: "AB = B − A (arrivée − départ). On additionne et on multiplie composante par composante. Norme : √(x² + y² (+ z²)). Colinéaires : l'un est un multiple de l'autre.",
      lesson: ["Vecteurs", "Un vecteur : une direction, un sens, une longueur.", "\\(\\overrightarrow{AB}\\) a pour composantes \\(B - A\\). Opérations composante par composante : \\(a\\vec{u} + b\\vec{v}\\). Norme \\(\\|\\vec{u}\\| = \\sqrt{x^2 + y^2}\\) (\\(+ z^2\\) dans l'espace). \\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires si \\(\\vec{v} = k\\vec{u}\\). ABCD parallélogramme \\(\\iff \\overrightarrow{AD} = \\overrightarrow{BC}\\).",
        ["\\(A(1 ; 2)\\), \\(B(4 ; -2)\\) : \\(\\overrightarrow{AB} = (3 ; -4)\\), norme 5"], "\\(\\overrightarrow{AB} = B - A\\), pas \\(A - B\\)."],
      comps: ["Calculer des composantes, une combinaison, une norme", "Utiliser la colinéarité ; parallélogramme ; norme dans l'espace", "Construire un point avec des vecteurs ; centre de gravité"] },
    { id: "scalmp", th: "VE", sem: "S7", theme: "es", label: "Produit scalaire, angle, orthogonalité", ex: "\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2", lv: SC,
      hint: "u · v = x₁x₂ + y₁y₂ (+ z₁z₂) = ‖u‖ ‖v‖ cos α. Orthogonaux ⟺ produit scalaire nul. Angle : cos α = u · v ÷ (‖u‖ ‖v‖).",
      lesson: ["Produit scalaire", "Un nombre qui dit si deux vecteurs « vont dans le même sens ».", "\\(\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2\\) (\\(+ z_1 z_2\\)) \\(= \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Nul : vecteurs orthogonaux ; positif : angle aigu ; négatif : angle obtus. Angle : \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\). Travail d'une force : \\(W = \\vec{F} \\cdot \\vec{d}\\).",
        ["\\((2 ; 1) \\cdot (1 ; 3) = 5\\), \\(\\cos\\alpha = \\frac{5}{\\sqrt{5}\\sqrt{10}}\\), \\(\\alpha = 45°\\)"], "On multiplie x avec x et y avec y, puis on additionne."],
      comps: ["Calculer un produit scalaire ; orthogonalité", "Calculer un angle ; utiliser normes et cosinus ; travail", "Angle d'un triangle ; angle droit ; orthogonalité dans l'espace"] },
    { id: "projmp", th: "VE", sem: "S7", theme: "es", label: "Projection orthogonale", ex: "\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}\\,\\vec{v}", lv: PJ,
      hint: "Projection scalaire de u sur v : u · v ÷ ‖v‖. Vecteur projeté : (u · v ÷ ‖v‖²) · v. Projeté d'un point P sur une droite (A ; d) : H = A + t · d avec t = AP · d ÷ ‖d‖².",
      lesson: ["Projection orthogonale", "L'ombre d'un vecteur sur une direction, quand la lumière tombe à angle droit.", "Projection scalaire de \\(\\vec{u}\\) sur la direction de \\(\\vec{v}\\) : \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|} = \\|\\vec{u}\\|\\cos\\alpha\\). Vecteur projeté : \\(\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|^2}\\,\\vec{v}\\) ; la partie \\(\\vec{u} - \\vec{p}\\) est orthogonale à \\(\\vec{v}\\). Projeté orthogonal d'un point \\(P\\) sur la droite passant par \\(A\\) de direction \\(\\vec{d}\\) : \\(H = A + t\\,\\vec{d}\\) avec \\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}\\) ; la distance de \\(P\\) à la droite est \\(PH\\).",
        ["\\(\\vec{u} = (4 ; 7)\\), \\(\\vec{v} = (3 ; 4)\\) : \\(\\vec{u} \\cdot \\vec{v} = 40\\), projection 8, projeté \\(\\frac{40}{25}(3 ; 4) = (4{,}8 ; 6{,}4)\\)"], "Pour le vecteur projeté, on divise par \\(\\|\\vec{v}\\|^2\\) ; pour la longueur projetée, par \\(\\|\\vec{v}\\|\\)."],
      comps: ["Projection scalaire, vecteur projeté, composante d'une force", "Projeté d'un point sur une droite ; distance point-droite", "Projection dans l'espace ; hauteur et aire d'un triangle"] },
    { id: "pvectmp", th: "VE", sem: "S7", theme: "es", label: "Produit vectoriel", ex: "\\vec{u} \\times \\vec{v} = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}", lv: PV,
      hint: "u × v = (u₂v₃ − u₃v₂ ; u₃v₁ − u₁v₃ ; u₁v₂ − u₂v₁) : un vecteur orthogonal à u et à v. Sa norme = aire du parallélogramme construit sur u et v (triangle : la moitié). L'ordre compte : v × u = −(u × v).",
      lesson: ["Produit vectoriel", "Un vecteur perpendiculaire à deux vecteurs de l'espace, dont la longueur mesure une aire.", "Dans l'espace, \\(\\vec{u} \\times \\vec{v} = \\begin{pmatrix} u_2 v_3 - u_3 v_2 \\\\ u_3 v_1 - u_1 v_3 \\\\ u_1 v_2 - u_2 v_1 \\end{pmatrix}\\) (on « croise » les composantes). C'est un vecteur orthogonal à \\(\\vec{u}\\) et à \\(\\vec{v}\\) : un vecteur normal au plan qu'ils engendrent. Sa norme \\(\\|\\vec{u} \\times \\vec{v}\\|\\) est l'aire du parallélogramme construit sur \\(\\vec{u}\\) et \\(\\vec{v}\\) ; le triangle en est la moitié. Il est nul si et seulement si les vecteurs sont colinéaires. L'ordre compte : \\(\\vec{v} \\times \\vec{u} = -\\vec{u} \\times \\vec{v}\\).",
        ["\\((1 ; 2 ; 2) \\times (2 ; -1 ; 2) = (6 ; 2 ; -5)\\) ; vérification : \\(6 + 4 - 10 = 0\\)", "Aire du parallélogramme : \\(\\sqrt{36 + 4 + 25} = \\sqrt{65} \\approx 8{,}06\\)"], "Le produit scalaire donne un nombre (angle, travail) ; le produit vectoriel donne un vecteur (normale, aire, moment)."],
      comps: ["Calculer les composantes d'un produit vectoriel ; aire à partir de sa norme", "Aire d'un triangle dans l'espace ; vecteur normal ; moment d'une force", "Distance d'un point à une droite ; alignement ; aire d'un parallélogramme dans l'espace"] },
    { id: "droiteparam", th: "DP", sem: "S7", theme: "es", label: "Droites paramétriques", ex: "\\begin{cases} x = 2 + 3t \\\\ y = -1 + 4t \\end{cases}", lv: DP,
      hint: "Point de départ A, vecteur directeur d : (x ; y) = A + t · d. Un point est sur la droite si le même t convient pour toutes les coordonnées. Intersection : égalise les coordonnées (deux paramètres t et s).",
      lesson: ["Droites paramétriques", "Une droite décrite par un point et une direction.", "La droite passant par \\(A\\) de vecteur directeur \\(\\vec{d}\\) : \\(x = x_A + t\\,d_x\\), \\(y = y_A + t\\,d_y\\) (\\(+ z\\) dans l'espace). Chaque valeur de \\(t\\) donne un point. Un point est sur la droite s'il existe un même \\(t\\) pour toutes les coordonnées. Angle entre deux droites : angle aigu entre leurs vecteurs directeurs.",
        ["Par \\(A(2 ; -1)\\) et \\(B(5 ; 3)\\) : \\(x = 2 + 3t\\), \\(y = -1 + 4t\\)"], "Pour l'intersection de deux droites, utilise deux paramètres différents (t et s)."],
      comps: ["Calculer un point d'une droite ; trouver le paramètre", "Intersection avec un axe ou un plan de coordonnées", "Intersection de deux droites ; angle ; problèmes"] },
    { id: "posdroites", th: "DP", sem: "S7", theme: "es", label: "Position relative de deux droites", ex: "d \\parallel g, \\ d \\cap g = \\{P\\}", lv: PD,
      hint: "Vecteurs directeurs colinéaires : parallèles (confondues si un point de l'une est sur l'autre). Sinon, dans le plan : sécantes. Dans l'espace : on résout avec x et y (t et s), puis on vérifie z ; si z ne concorde pas, les droites sont gauches.",
      lesson: ["Position relative de deux droites", "Parallèles, confondues, sécantes… ou gauches dans l'espace.", "On compare d'abord les vecteurs directeurs. Colinéaires : droites parallèles ; confondues si, en plus, un point de l'une est sur l'autre. Non colinéaires : dans le plan, les droites sont sécantes (on égale les coordonnées, avec deux paramètres t et s). Dans l'espace, on résout le système des équations en x et en y, puis on vérifie la troisième : si elle est satisfaite, les droites sont sécantes ; sinon, elles n'ont aucun point commun sans être parallèles : elles sont gauches.",
        ["\\((2 ; -1)\\) et \\((-6 ; 3)\\) sont colinéaires (facteur \\(-3\\)) : droites parallèles", "Avec x et y on trouve \\(t = 2\\), \\(s = -1\\) ; si les cotes diffèrent, les droites sont gauches"], "Deux droites de l'espace qui ne se coupent pas ne sont pas forcément parallèles."],
      comps: ["Reconnaître des droites parallèles ; point d'intersection dans le plan", "Droites confondues ; parallélisme dans l'espace ; paramètre du point commun", "Droites sécantes ou gauches dans l'espace"] },
    { id: "ineqmp", th: "IN", sem: "S8", theme: "fa", label: "Inéquations, tableau des signes", ex: "\\frac{2x - 1}{x + 3} \\ge 0", lv: IQ,
      hint: "Inéquation linéaire : comme une équation, en retournant le sens si on multiplie ou divise par un négatif. Sinon : tout à gauche, factoriser, tableau des signes ; les valeurs interdites sont toujours exclues.",
      lesson: ["Inéquations", "Trouver tous les x qui vérifient une inégalité.", "Linéaire : on isole x ; multiplier ou diviser par un nombre négatif retourne le sens. Non linéaire : on ramène tout à gauche (\\(\\ldots \\ge 0\\)), on factorise, on dresse le tableau des signes des facteurs, puis on lit les intervalles. Crochet fermé si la borne est comprise, ouvert sinon (toujours ouvert en une valeur interdite et en \\(\\pm\\infty\\)).",
        ["\\(-2x + 1 \\ge 5 \\iff x \\le -2\\)", "\\((x - 2)(x + 3) > 0\\) : \\(]-\\infty ; -3[ \\cup ]2 ; +\\infty[\\)"], "On ne multiplie pas par x (ni par un dénominateur) sans connaître son signe."],
      comps: ["Résoudre une inéquation linéaire ou un encadrement", "Résoudre une inéquation du 2e degré (tableau des signes)", "Résoudre une inéquation rationnelle ou de degré 3"] },
    { id: "fctmp", th: "FP", sem: "S8", theme: "fa", label: "Fonctions : réciproque, parité, transformations", ex: "g(x) = f(x - h) + k", lv: FC,
      hint: "f⁻¹ défait f. Paire : f(−x) = f(x) ; impaire : f(−x) = −f(x). f(x − h) + k : translation de h vers la droite et de k vers le haut. k·f(x) étire verticalement, f(kx) comprime horizontalement. (f ∘ g)(x) = f(g(x)).",
      lesson: ["Fonctions", "Transformer, inverser, composer.", "Réciproque : si \\(f(a) = b\\), alors \\(f^{-1}(b) = a\\) (on isole x, puis on renomme). Parité : \\(f(-x) = f(x)\\) (paire, symétrie d'axe vertical) ou \\(f(-x) = -f(x)\\) (impaire, symétrie centrale). Transformations : \\(f(x - h) + k\\) translate, \\(k f(x)\\) étire verticalement, \\(f(kx)\\) comprime horizontalement. Composition : \\((f \\circ g)(x) = f(g(x))\\).",
        ["\\(f(x) = 2^x + 1\\) : \\(f^{-1}(x) = \\log_2(x - 1)\\)", "\\(f(x) = x^3\\) est impaire"], "Dans \\(f(x - 2)\\), le graphe se décale vers la droite (pas vers la gauche)."],
      comps: ["Utiliser la parité, la réciproque ou une translation", "Exprimer une réciproque ; composer ; étirer ou comprimer", "Composée en expression ; domaine ; intersection de graphes"] },
    { id: "polymp", th: "FP", sem: "S8", theme: "fa", label: "Polynômes : zéros, division, signe", ex: "x^3 - 7x + 6 = (x - 1)(x - 2)(x + 3)", lv: PO,
      hint: "P(a) = 0 ⟺ (x − a) divise P. Le reste de la division par (x − a) vaut P(a). Zéro évident : essaie les diviseurs du terme constant. Signe : tableau des signes des facteurs.",
      lesson: ["Polynômes", "Trouver les zéros pour factoriser et étudier le signe.", "Si \\(P(a) = 0\\), on peut diviser \\(P\\) par \\((x - a)\\) (division ou schéma de Horner). Le reste de la division par \\((x - a)\\) est \\(P(a)\\). Un zéro entier divise le terme constant. Une fois factorisé, on lit le signe dans un tableau.",
        ["\\(x^3 - 7x + 6\\) : \\(P(1) = 0\\), quotient \\(x^2 + x - 6\\), zéros \\(1\\), \\(2\\), \\(-3\\)"], "Le reste de la division par \\((x - 2)\\) est \\(P(2)\\), pas \\(P(-2)\\)."],
      comps: ["Calculer une valeur, des zéros, un coefficient", "Diviser un polynôme ; théorème du reste", "Factoriser complètement ; signe ; retrouver un polynôme"] },
    { id: "sinusmp", th: "FS", sem: "S8", theme: "fa", label: "Fonctions sinusoïdales", ex: "f(x) = a\\sin(b(x - c)) + d", lv: SN,
      hint: "a sin(b(x − c)) + d : amplitude |a|, période 2π ÷ b, déphasage c, axe d. Max d + |a|, min d − |a|. Depuis le graphe : a = (max − min) ÷ 2, d = (max + min) ÷ 2.",
      lesson: ["Fonctions sinusoïdales", "Modéliser un phénomène périodique.", "\\(f(x) = a\\sin(b(x - c)) + d\\) : amplitude \\(|a|\\), période \\(\\frac{2\\pi}{b}\\), déphasage \\(c\\) (si \\(a > 0\\), la courbe coupe l'axe en montant en \\(x = c\\)), axe \\(y = d\\). Valeurs entre \\(d - |a|\\) et \\(d + |a|\\). D'un graphe : \\(a = \\frac{\\max - \\min}{2}\\), \\(d = \\frac{\\max + \\min}{2}\\).",
        ["\\(3\\sin\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1\\) : amplitude 3, période \\(\\pi\\), déphasage \\(\\frac{\\pi}{4}\\), max 4, min −2"], "La période est \\(2\\pi \\div b\\), pas \\(2\\pi \\cdot b\\)."],
      comps: ["Lire amplitude, axe, période, extremums", "Trouver b ; déphasage ; calculer une image", "Trouver l'expression ; premier maximum ; modèle de marée"] },
    { id: "explogfn", th: "FS", sem: "S8", theme: "fa", label: "Fonctions exponentielles et logarithmiques", ex: "f(x) = a \\cdot b^x", lv: EL,
      hint: "f(x) = a · b^x : a = f(0), b = facteur quand x augmente de 1. log_b(x − h) : domaine x > h, asymptote x = h. La réciproque de b^x est log_b x.",
      lesson: ["Exponentielles et logarithmes", "Deux fonctions réciproques l'une de l'autre.", "\\(f(x) = a \\cdot b^x\\) (\\(b > 0\\)) : \\(f(0) = a\\), multiplication par \\(b\\) quand x augmente de 1 ; croissante si \\(b > 1\\), décroissante si \\(0 < b < 1\\). \\(\\log_b x\\) est la réciproque de \\(b^x\\) : domaine \\(x > 0\\), zéro en 1, asymptote verticale \\(x = 0\\). \\(\\log_b(x - h) + k\\) : domaine \\(x > h\\).",
        ["Par \\((0 ; 3)\\) et \\((2 ; 12)\\) : \\(f(x) = 3 \\cdot 2^x\\)", "\\(\\log_2(x - 1)\\) : domaine \\(x > 1\\), zéro \\(x = 2\\)"], "Le logarithme n'existe que pour un argument strictement positif."],
      comps: ["Trouver la base ; domaine et zéro d'un logarithme", "Calculer une image, une réciproque ; modèle de croissance", "Retrouver a et b ; translation ; durée (logarithme)"] },
    { id: "fratmp", th: "FS", sem: "S8", theme: "fa", label: "Fonctions rationnelles simples", ex: "f(x) = \\frac{ax + b}{cx + d}", lv: RA,
      hint: "Valeur interdite (asymptote verticale) : le dénominateur s'annule. Zéro : le numérateur s'annule. Asymptote horizontale de (ax + b) ÷ (cx + d) : y = a ÷ c. f(x) = k ÷ (x − h) + v : asymptotes x = h et y = v.",
      lesson: ["Fonctions rationnelles", "Un quotient de deux polynômes, et des asymptotes.", "\\(f(x) = \\frac{ax + b}{cx + d}\\) n'existe pas quand \\(cx + d = 0\\) : valeur interdite, asymptote verticale \\(x = -\\frac{d}{c}\\). Zéro : \\(ax + b = 0\\). Pour x très grand, \\(f(x) \\approx \\frac{ax}{cx} = \\frac{a}{c}\\) : asymptote horizontale \\(y = \\frac{a}{c}\\). Forme \\(f(x) = \\frac{k}{x - h} + v\\) : hyperbole d'asymptotes \\(x = h\\) et \\(y = v\\). Pour résoudre \\(f(x) = k\\), on multiplie par le dénominateur, puis on vérifie que la solution n'est pas interdite.",
        ["\\(f(x) = \\frac{2x - 6}{x + 4}\\) : valeur interdite \\(-4\\), zéro 3, asymptote \\(y = 2\\)"], "Le zéro vient du numérateur, la valeur interdite du dénominateur : ne les confonds pas."],
      comps: ["Valeur interdite, zéro, asymptote horizontale", "Asymptotes ; domaine ; équation rationnelle", "Lire et retrouver une hyperbole ; coût moyen"] },
  ];
  NEW.forEach((n, i) => {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: null, MP: [15, n.sem], FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[n.id] = {};
    if (typeof HINTS_EXTRA !== "undefined") HINTS_EXTRA[n.id] = n.hint;
    if (typeof LESSONS_EXTRA !== "undefined") LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = [PROBS[n.id]];
    if (typeof ORDRE !== "undefined") ORDRE.MP[n.id] = 61 + i;
    if (typeof ORDRE_THEME !== "undefined") ORDRE_THEME.MP[n.id] = n.th;
  });
  window.MP4_IDS = NEW.map((n) => n.id);
})();
