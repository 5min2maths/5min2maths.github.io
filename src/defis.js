// ===================== Défis (niveau 4, « Problème de la semaine ») réécrits le 24.11 =====================
// Audit tools/audit_defis.py (rapport tools/defis.md) : la plupart des problèmes de niveau 4 avaient des valeurs fixes
// (le même énoncé à chaque fois, « Refaire avec d'autres valeurs » redonnait le même) et beaucoup étaient plus simples
// que le niveau 3 (ex. 4e Collège : « 2x³ − 18x », une factorisation en deux gestes). Ici, pour les notions les plus
// utilisées : valeurs tirées au hasard, 2 ou 3 étapes qui s'enchaînent (factoriser PUIS résoudre / étudier un signe,
// modéliser PUIS résoudre, deux théorèmes à combiner), contexte concret quand il a du sens.
// Chargé après les fichiers de chapitre (build.py) : remplace leurs problèmes de niveau 4 pour ces notions.
const DEFIS = (() => {
  const P = (q, parts, hints, sol, fig) => ({ fig, q, hints, sol,
    parts: parts.map(([label, v, o]) => ({ label, spec: v && typeof v === "object" ? v : Object.assign({ kind: "value", value: v }, typeof o === "number" ? { round: o } : {}) })) });
  const SET = (values) => ({ kind: "set", values: [...values].sort((a, b) => a - b) });
  const pk = R.pick, ri = R.int;
  const D = (v) => dec(+(+v).toFixed(10)), T = (v) => decTxt(+(+v).toFixed(10));
  const r1 = (v) => Math.round(v * 10) / 10, r2c = (v) => Math.round(v * 100) / 100;
  const fx = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 12; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return frac(Math.round(v * d), d); return D(v); };
  const fxT = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 12; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return (v < 0 ? "−" : "") + Math.abs(Math.round(v * d)) + "/" + d; return T(v); };
  const xm = (p) => (p === 0 ? "x" : p > 0 ? "x - " + p : "x + " + -p); /* (x − p) */
  const xmT = (p) => (p === 0 ? "x" : p > 0 ? "x − " + p : "x + " + -p);
  const pr = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const cntInt = (f, a = -10, b = 10) => { let c = 0; for (let x = a; x <= b; x++) if (f(x)) c++; return c; };
  const pT = (cs) => poly(cs).replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³").replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/-/g, "−");
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

  return {
    // ---------- 11e : factorisation (identités, mise en évidence) ----------
    factor: [
      () => { /* identité sur un binôme, puis mise en évidence dans chaque facteur, puis produit nul et signe */
        let a, b, c, z1, z2;
        do { a = pk([2, 2, 3]); b = R.nz(-9, 9); c = ri(3, 11); z1 = (c - b) / a; z2 = (-b - c) / a; }
        while (!Number.isInteger(z1) || !Number.isInteger(z2) || z1 === 0 || z2 === 0 || b === c || b === -c || Math.abs(z1 - z2) < 3);
        const k = a * a, lo = Math.min(z1, z2), hi = Math.max(z1, z2), neg = hi - lo - 1;
        const bin = a + "x" + (b < 0 ? " - " + -b : " + " + b);
        return P("On considère " + M("E(x) = (" + bin + ")^2 - " + c * c) + ".",
          [["a) Factorisée au maximum, " + M("E(x) = k(x - p)(x - q)") + ". Que vaut " + M("k") + " ?", k],
           ["b) Solutions de " + M("E(x) = 0") + " (séparées par « ; »)", SET([z1, z2])],
           ["c) Combien d'entiers " + M("x") + " vérifient " + M("E(x) < 0") + " ?", neg]],
          ["E(x) est une différence de deux carrés : A² − B² = (A − B)(A + B), avec A = " + bin.replace("-", "−") + " et B = " + c + ". Puis mets " + a + " en évidence dans CHAQUE parenthèse.",
           "Produit nul : chaque facteur peut valoir 0. Pour c) : k > 0, et un produit (x − p)(x − q) est négatif seulement quand x est ENTRE les deux solutions (un facteur positif, l'autre négatif)."],
          M("E(x) = (" + bin + " - " + c + ")(" + bin + " + " + c + ") = (" + a + "x" + sg(b - c) + ")(" + a + "x" + sg(b + c) + ") = " + k + "(" + xm(z1) + ")(" + xm(z2) + ")") + ". a) " + M("k = " + a + " \\cdot " + a + " = " + k) + " (piège : ne garder qu'un seul " + a + "). b) " + M("x = " + z1) + " ou " + M("x = " + z2) + ". c) " + M("E(x) < 0") + " entre " + M(lo) + " et " + M(hi) + " (exclus) : " + M(neg) + " entiers.");
      },
      () => { /* facteur commun binôme, puis différence de carrés : trois facteurs, tableau de signes */
        let m, n, p;
        do { m = pk([1, 2, 3]); n = ri(1, 7); p = R.nz(-6, 6); } while (gcd(m, n) !== 1 || (m === 1 && n < 2) || n === Math.abs(p) * m || n % m === 0 && Math.abs(n / m) === Math.abs(p));
        const E = (x) => (m * m * x * x - n * n) * (x - p), pos = cntInt((x) => E(x) > 0), zs = [p, n / m, -n / m];
        const c2 = m * m === 1 ? "" : m * m;
        return P("On considère " + M("E(x) = " + c2 + "x^2(" + xm(p) + ") - " + n * n + "(" + xm(p) + ")") + ".",
          [["a) Solutions de " + M("E(x) = 0") + " (séparées par « ; », fractions acceptées)", SET(zs)],
           ["b) Combien d'entiers " + M("x") + " de " + M("-10") + " à " + M("10") + " vérifient " + M("E(x) > 0") + " ?", pos]],
          ["Mets le facteur commun (" + xmT(p) + ") en évidence : E(x) = (" + xmT(p) + ")(" + c2 + "x² − " + n * n + "). Le second facteur est une différence de deux carrés.",
           "Trois facteurs du 1er degré, trois solutions. Pour b) : tableau de signes ; le signe de E(x) change à chaque solution. Teste une valeur dans chaque zone."],
          M("E(x) = (" + xm(p) + ")(" + c2 + "x^2 - " + n * n + ") = (" + xm(p) + ")(" + (m === 1 ? "" : m) + "x - " + n + ")(" + (m === 1 ? "" : m) + "x + " + n + ")") + ". a) " + M("x \\in \\{" + [...zs].sort((u, v) => u - v).map(fx).join(" ; ") + "\\}") + ". b) Signe : " + M("E(x) > 0") + " à droite de la plus grande solution et entre les deux plus petites ; " + M(pos) + " entiers de " + M("-10") + " à " + M("10") + ".");
      },
    ],
    // ---------- 1re–4e Collège : factorisation au maximum (plusieurs étapes) ----------
    factor2: [
      () => { /* groupement, puis identité, puis signe */
        let p, q;
        do { p = R.nz(-7, 7); q = ri(2, 7); } while (Math.abs(p) === q);
        const E = (x) => (x - p) * (x - q) * (x + q), neg = cntInt((x) => E(x) < 0);
        return P("On considère " + M("E(x) = " + poly([1, -p, -q * q, p * q * q])) + ".",
          [["a) Solutions de " + M("E(x) = 0") + " (séparées par « ; »)", SET([p, q, -q])],
           ["b) Combien d'entiers " + M("x") + " de " + M("-10") + " à " + M("10") + " vérifient " + M("E(x) < 0") + " ?", neg]],
          ["Pas de facteur commun aux 4 termes : groupe-les deux par deux, x³ " + (p < 0 ? "+ " + -p : "− " + p) + "x² et les deux derniers. Un facteur commun (" + xmT(p) + ") apparaît.",
           "E(x) = (" + xmT(p) + ")(x² − " + q * q + ") = (" + xmT(p) + ")(x − " + q + ")(x + " + q + "). Pour b) : tableau de signes avec les trois solutions."],
          M("E(x) = x^2(" + xm(p) + ") - " + q * q + "(" + xm(p) + ") = (" + xm(p) + ")(x^2 - " + q * q + ") = (" + xm(p) + ")(x - " + q + ")(x + " + q + ")") + ". a) " + M("x \\in \\{" + [p, q, -q].sort((u, v) => u - v).join(" ; ") + "\\}") + ". b) " + M("E(x) < 0") + " à gauche de la plus petite solution et entre les deux autres : " + M(neg) + " entiers.");
      },
      () => { /* mise en évidence (avec signe), puis trinôme somme-produit, puis signe */
        let k, r1_, r2_;
        do { k = pk([-3, -2, 2, 3, 4, 5]); r1_ = R.nz(-6, 6); r2_ = R.nz(-6, 6); } while (r1_ === r2_ || r1_ === -r2_);
        const E = (x) => k * x * (x - r1_) * (x - r2_), pos = cntInt((x) => E(x) > 0);
        return P("On considère " + M("E(x) = " + poly([k, -k * (r1_ + r2_), k * r1_ * r2_, 0])) + ".",
          [["a) Solutions de " + M("E(x) = 0") + " (séparées par « ; »)", SET([0, r1_, r2_])],
           ["b) Combien d'entiers " + M("x") + " de " + M("-10") + " à " + M("10") + " vérifient " + M("E(x) > 0") + " ?", pos]],
          ["Mets " + k + "x en évidence (le signe compris), puis factorise le trinôme qui reste : deux nombres de produit " + r1_ * r2_ + " et de somme " + (r1_ + r2_) + ".",
           "E(x) = " + k + "x(" + xmT(r1_) + ")(" + xmT(r2_) + "). Pour b) : tableau de signes, sans oublier le signe de " + k + " devant."],
          M("E(x) = " + k + "x(" + poly([1, -(r1_ + r2_), r1_ * r2_]) + ") = " + k + "x(" + xm(r1_) + ")(" + xm(r2_) + ")") + ". a) " + M("x \\in \\{" + [0, r1_, r2_].sort((u, v) => u - v).join(" ; ") + "\\}") + ". b) Tableau de signes (" + (k > 0 ? "coefficient positif : " + M("E(x) > 0") + " entre les deux plus petites solutions et à droite de la plus grande" : "coefficient négatif : " + M("E(x) > 0") + " à gauche de la plus petite solution et entre les deux plus grandes") + ") : " + M(pos) + " entiers.");
      },
    ],
    // ---------- 11e : équations du 2e degré (mise en équation) ----------
    eq2: [
      () => {
        const w = ri(4, 15), k = ri(2, 9), A = w * (w + k), L = w + k, dg = Math.sqrt(w * w + L * L);
        return P("Un rectangle a une longueur de " + M(k) + " cm de plus que sa largeur. Son aire vaut " + M(A) + " cm².",
          [["a) Largeur (cm)", w], ["b) Périmètre (cm)", 2 * (w + L)], ["c) Diagonale (cm, au dixième)", dg, 0.1]],
          ["Appelle x la largeur : la longueur vaut x + " + k + " et x(x + " + k + ") = " + A + ".",
           "x² + " + k + "x − " + A + " = 0 : deux nombres de produit −" + A + " et de somme " + k + " (ou Δ). Une largeur est positive. Diagonale : Pythagore."],
          M("x(x + " + k + ") = " + A + " \\iff x^2 + " + k + "x - " + A + " = 0 \\iff (x - " + w + ")(x + " + L + ") = 0") + ". a) " + M("x = " + w) + " cm (" + M(-L) + " est impossible). b) " + M("2(" + w + " + " + L + ") = " + 2 * (w + L)) + " cm. c) " + M("\\sqrt{" + w + "^2 + " + L + "^2} \\approx " + D(r1(dg))) + " cm.");
      },
      () => {
        let x, a, b, A, diff;
        do { a = ri(2, 9); b = ri(2, 9); x = ri(b + 3, 20); A = (x + a) * (x - b); diff = A - x * x; } while (a === b || diff === 0);
        return P("On allonge un côté d'un carré de " + M(a) + " cm et on raccourcit l'autre de " + M(b) + " cm. Le rectangle obtenu a une aire de " + M(A) + " cm².",
          [["a) Côté du carré (cm)", x], ["b) Aire du rectangle moins aire du carré (cm², négatif si elle diminue)", diff]],
          ["Appelle x le côté du carré : (x + " + a + ")(x − " + b + ") = " + A + ". Développe et ramène tout d'un côté.",
           "x² " + (a - b < 0 ? "− " + (b - a) : "+ " + (a - b)) + "x − " + (a * b + A) + " = 0 ; garde la solution positive. Puis compare " + A + " et x²."],
          M("(x + " + a + ")(x - " + b + ") = " + A + " \\iff " + poly([1, a - b, -(a * b + A)]) + " = 0 \\iff (x - " + x + ")(x + " + (x + a - b) + ") = 0") + ". a) " + M("x = " + x) + " cm. b) " + M(A + " - " + x * x + " = " + diff) + " cm²" + (diff < 0 ? " : l'aire diminue." : "."));
      },
    ],
    eq2fact: [
      () => { /* chute : mi-hauteur atteinte après plus de la moitié du temps */
        const Tt = pk([2, 3, 4, 5, 6]), H = 5 * Tt * Tt, tm = Tt / Math.SQRT2;
        return P("On lâche une bille du haut d'une tour de " + M(H) + " m. Sa hauteur vaut " + M("h(t) = " + H + " - 5t^2") + " (m, " + M("t") + " en s).",
          [["a) Instant où elle touche le sol (s)", Tt], ["b) Instant où elle passe à mi-hauteur (s, au centième)", tm, 0.01], ["c) Durée de la seconde moitié de la chute (s, au centième)", Tt - tm, 0.01]],
          ["Sol : h(t) = 0. Mi-hauteur : h(t) = " + T(H / 2) + ".", "5t² = " + H + " donne t² = " + Tt * Tt + ". Puis 5t² = " + T(H / 2) + " donne t² = " + T(Tt * Tt / 2) + " : garde la solution positive. La seconde moitié dure (temps total − temps à mi-hauteur)."],
          "a) " + M("5t^2 = " + H + " \\iff t^2 = " + Tt * Tt) + ", " + M("t = " + Tt) + " s. b) " + M("5t^2 = " + D(H / 2) + " \\iff t = \\sqrt{" + D(Tt * Tt / 2) + "} \\approx " + D(r2c(tm))) + " s. c) " + M(Tt + " - " + D(r2c(tm)) + " \\approx " + D(r2c(Tt - tm))) + " s : la bille accélère, la seconde moitié est plus rapide.");
      },
      () => { /* lancer vers le haut : factorisation, deux instants, hauteur max */
        let t1, t2; do { t1 = ri(1, 4); t2 = ri(t1 + 1, 6); } while (t1 + t2 > 9);
        const v = 5 * (t1 + t2), H1 = 5 * t1 * t2, s = (t1 + t2) / 2, hm = -5 * s * s + v * s;
        return P("On lance une balle vers le haut depuis le sol. Sa hauteur vaut " + M("h(t) = " + v + "t - 5t^2") + " (m, " + M("t") + " en s).",
          [["a) Durée du vol, jusqu'au retour au sol (s)", t1 + t2], ["b) Instants où la balle est à " + H1 + " m (séparés par « ; »)", SET([t1, t2])], ["c) Hauteur maximale (m)", hm]],
          ["Sol : h(t) = 0, factorise t(" + v + " − 5t). Pour b) : " + v + "t − 5t² = " + H1 + ", ramène tout d'un côté et divise par 5.",
           "t² − " + (t1 + t2) + "t + " + t1 * t2 + " = 0 : deux nombres de produit " + t1 * t2 + " et de somme " + (t1 + t2) + ". La hauteur est maximale au milieu des deux instants."],
          "a) " + M("t(" + v + " - 5t) = 0") + " : " + M("t = " + (t1 + t2)) + " s. b) " + M("t^2 - " + (t1 + t2) + "t + " + t1 * t2 + " = (t - " + t1 + ")(t - " + t2 + ") = 0") + " : " + M(t1) + " s (en montant) et " + M(t2) + " s (en descendant). c) Au milieu, " + M("t = " + D(s)) + " s : " + M("h = " + D(hm)) + " m.");
      },
    ],
    idrem: [
      () => {
        const k = ri(2, 9), N = pk([1999, 2001, 2026, 3001, 5004, 997]), n0 = ri(6, 40);
        return P("On étudie " + M("A = (n + " + k + ")^2 - (n - " + k + ")^2") + ".",
          [["a) Après réduction, " + M("A = c \\cdot n") + ". Que vaut " + M("c") + " ?", 4 * k],
           ["b) Calcule " + M("(" + N + " + " + k + ")^2 - (" + N + " - " + k + ")^2") + " sans développer les carrés", 4 * k * N],
           ["c) Pour quel nombre " + M("n") + " a-t-on " + M("A = " + 4 * k * n0) + " ?", n0]],
          ["Développe les deux carrés avec les identités, en mettant le second entre parenthèses (le signe moins s'applique à tout).",
           "A = " + 4 * k + "n. b) Remplace n par " + N + ". c) Résous " + 4 * k + "n = " + 4 * k * n0 + "."],
          "a) " + M("n^2 + " + 2 * k + "n + " + k * k + " - (n^2 - " + 2 * k + "n + " + k * k + ") = " + 4 * k + "n") + ". b) " + M(4 * k + " \\cdot " + N + " = " + nb(4 * k * N)) + ". c) " + M("n = " + n0) + ".");
      },
      () => {
        let k, n, A; do { k = ri(2, 8); n = ri(k + 4, 25); A = n * n - k * k; } while (false);
        return P("On transforme un carré en rectangle : un côté est allongé de " + M(k) + " cm, l'autre raccourci de " + M(k) + " cm. Le rectangle a une aire de " + M(A) + " cm².",
          [["a) De combien l'aire a-t-elle diminué (cm²) ?", k * k], ["b) Côté du carré (cm)", n], ["c) Périmètre du rectangle (cm)", 4 * n]],
          ["Avec x le côté du carré : (x + " + k + ")(x − " + k + ") = x² − " + k * k + " (identité).", "Donc x² = " + A + " + " + k * k + ". Périmètre : 2 · (longueur + largeur)."],
          "a) " + M("(x + " + k + ")(x - " + k + ") = x^2 - " + k * k) + " : l'aire diminue de " + M(k * k) + " cm², quel que soit le carré. b) " + M("x^2 = " + (A + k * k)) + ", " + M("x = " + n) + " cm. c) " + M("2(" + (n + k) + " + " + (n - k) + ") = " + 4 * n) + " cm (le même que le carré).");
      },
    ],
    // ---------- 1re Collège : calcul littéral, trinôme ----------
    polyop: [
      () => {
        let a, b, x0, Tg; do { a = R.nz(-6, 6); b = ri(2, 7); x0 = R.nz(-9, 9); Tg = 2 * a * x0 + a * a + b * b; } while (Math.abs(a) === b || Tg === 0);
        const ap = a < 0 ? "x - " + -a : "x + " + a;
        return P("On pose " + M("A(x) = (" + ap + ")^2 - (x - " + b + ")(x + " + b + ")") + ".",
          [["a) Coefficient de " + M("x") + " dans " + M("A(x)") + " réduit", 2 * a], ["b) Terme constant de " + M("A(x)") + " réduit", a * a + b * b], ["c) Solution de " + M("A(x) = " + Tg), x0]],
          ["Développe chaque produit (identités), puis soustrais en changeant TOUS les signes de la seconde parenthèse.", "Les x² s'éliminent : A(x) est du 1er degré, A(x) = " + Tg + " est une équation simple."],
          M("A(x) = x^2 " + (a < 0 ? "- " + -2 * a : "+ " + 2 * a) + "x + " + a * a + " - (x^2 - " + b * b + ") = " + poly([2 * a, a * a + b * b])) + ". c) " + M(poly([2 * a, a * a + b * b]) + " = " + Tg + " \\iff x = " + x0) + ".");
      },
      () => {
        let a, b, c, n0, Tg; do { a = ri(1, 7); b = ri(2, 9); c = ri(2, 12); n0 = ri(3, 30); Tg = (a + b - c) * n0 + a * b; } while (a === b || c === a + b || Tg <= 0);
        return P("On compare les aires de deux rectangles : l'un mesure " + M("(n + " + a + ")") + " sur " + M("(n + " + b + ")") + ", l'autre " + M("n") + " sur " + M("(n + " + c + ")") + ". On note " + M("D") + " la différence (premier moins second).",
          [["a) Coefficient de " + M("n") + " dans " + M("D") + " réduite", a + b - c], ["b) Pour quel " + M("n") + " a-t-on " + M("D = " + Tg) + " ?", n0]],
          ["Développe les deux produits, puis soustrais : les n² s'éliminent.", "D = " + (a + b - c) + "n + " + a * b + " ; résous D = " + Tg + "."],
          M("D = n^2 + " + (a + b) + "n + " + a * b + " - (n^2 + " + c + "n) = " + poly([a + b - c, a * b], "n")) + ". b) " + M(poly([a + b - c, a * b], "n") + " = " + Tg + " \\iff n = " + n0) + ".");
      },
    ],
    trinfact: [
      () => { /* bénéfice : seuils de rentabilité, production optimale, bénéfice max */
        let k, p, q; do { k = pk([2, 3, 4, 5]); p = ri(1, 6); q = ri(p + 2, 14); } while (false);
        const s = (p + q) / 2, bm = k * ((q - p) / 2) ** 2;
        return P("Une entreprise fabrique " + M("x") + " centaines d'objets. Son bénéfice vaut " + M("B(x) = " + poly([-k, k * (p + q), -k * p * q])) + " (en milliers de CHF).",
          [["a) Productions pour lesquelles le bénéfice est nul (séparées par « ; »)", SET([p, q])], ["b) Production qui donne le plus grand bénéfice (centaines)", s], ["c) Bénéfice maximal (milliers de CHF)", bm]],
          ["Factorise B(x) : mets " + -k + " en évidence, puis factorise le trinôme (somme-produit ou Δ).", "B(x) = " + -k + "(x − " + p + ")(x − " + q + "). La parabole est symétrique : le sommet est au milieu des deux zéros."],
          M("B(x) = -" + k + "(" + poly([1, -(p + q), p * q]) + ") = -" + k + "(x - " + p + ")(x - " + q + ")") + ". a) " + M(p) + " et " + M(q) + " centaines. b) " + M("\\frac{" + p + " + " + q + "}{2} = " + D(s)) + ". c) " + M("B(" + D(s) + ") = " + D(bm)) + " milliers de CHF.");
      },
    ],
    f2: [
      () => { /* recette : prix optimal et deux prix pour une recette donnée */
        let b, P0, d; do { b = pk([2, 4, 5, 10]); P0 = 2 * ri(15, 40); d = ri(3, P0 / 2 - 3); } while (false);
        const a = b * P0, pm = P0 / 2, Rm = b * pm * pm, p1 = pm - d, p2 = pm + d, Rv = p1 * (a - b * p1);
        return P("Un club vend des t-shirts. Au prix de " + M("p") + " CHF, il en vend " + M(a + " - " + b + "p") + ". La recette vaut " + M("R(p) = p(" + a + " - " + b + "p)") + ".",
          [["a) Prix qui donne la plus grande recette (CHF)", pm], ["b) Recette maximale (CHF)", Rm], ["c) Les deux prix qui donnent une recette de " + Rv + " CHF (séparés par « ; »)", SET([p1, p2])]],
          ["R(p) = 0 pour p = 0 et p = " + P0 + " ; le sommet de la parabole est au milieu.", "c) Résous " + -b + "p² + " + a + "p = " + Rv + " : divise par " + -b + " puis factorise (ou Δ)."],
          "a) Zéros " + M("0") + " et " + M(P0) + ", sommet au milieu : " + M("p = " + pm) + " CHF. b) " + M("R(" + pm + ") = " + pm + " \\cdot " + (a - b * pm) + " = " + nb(Rm)) + " CHF. c) " + M("p^2 - " + P0 + "p + " + p1 * p2 + " = (p - " + p1 + ")(p - " + p2 + ") = 0") + " : " + M(p1) + " CHF ou " + M(p2) + " CHF.");
      },
      () => { /* enclos le long d'un mur */
        const L = 8 * ri(4, 15), xm_ = L / 4, Am = L * L / 8; let d; do { d = ri(2, L / 4 - 2); } while (false);
        const x1 = xm_ - d, x2 = xm_ + d, A0 = x1 * (L - 2 * x1);
        return P("Avec " + M(L) + " m de clôture, on entoure un enclos rectangulaire le long d'un mur (pas de clôture côté mur). On note " + M("x") + " la largeur (les deux côtés perpendiculaires au mur).",
          [["a) Largeur x qui donne la plus grande aire (m)", xm_], ["b) Aire maximale (m²)", Am], ["c) Largeurs possibles pour une aire de " + A0 + " m² (séparées par « ; »)", SET([x1, x2])]],
          ["Le côté parallèle au mur mesure " + L + " − 2x, donc A(x) = x(" + L + " − 2x).", "A(x) = 0 pour x = 0 et x = " + L / 2 + " : sommet au milieu. c) Résous x(" + L + " − 2x) = " + A0 + "."],
          M("A(x) = x(" + L + " - 2x)") + ". a) Zéros " + M("0") + " et " + M(L / 2) + " : " + M("x = " + D(xm_)) + " m. b) " + M("A = " + D(xm_) + " \\cdot " + D(L / 2) + " = " + D(Am)) + " m². c) " + M("2x^2 - " + L + "x + " + A0 + " = 0 \\iff x^2 - " + L / 2 + "x + " + D(A0 / 2) + " = 0") + " : " + M("x = " + D(x1)) + " ou " + M("x = " + D(x2)) + " m.");
      },
    ],
    f2formes: [
      () => {
        let a, h, k, dd; do { a = pk([1, 2, -1, -2, 3]); h = R.nz(-5, 5); k = R.nz(-9, 9); dd = ri(1, 4); } while (Math.abs(a * dd * dd) > 30);
        const m = k + a * dd * dd, b = -2 * a * h, c = a * h * h + k;
        return P("On donne " + M("f(x) = " + poly([a, b, c])) + ".",
          [["a) Sommet : abscisse " + M("h"), h], ["b) Sommet : ordonnée " + M("k"), k], ["c) Solutions de " + M("f(x) = " + m) + " (séparées par « ; »)", SET([h - dd, h + dd])]],
          ["Forme canonique : " + (a === 1 ? "" : "mets " + a + " en évidence dans les termes en x, puis ") + "complète le carré, f(x) = " + (a === 1 ? "" : a === -1 ? "−" : a) + "(x − h)² + k.",
           "f(x) = " + m + " ⇔ " + (a === 1 ? "" : a + " · ") + "(x − h)² = " + (m - k) + " : isole le carré, puis x − h = ± …"],
          M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "(" + xm(h) + ")^2" + sg(k)) + ". c) " + (a === 1 ? "" : M((a === -1 ? "-" : a) + "(" + xm(h) + ")^2 = " + (m - k)) + ", ") + M("(" + xm(h) + ")^2 = " + dd * dd) + ", " + M("x = " + h + " \\pm " + dd) + " : " + M(h - dd) + " et " + M(h + dd) + ".");
      },
    ],
    ineq2: [
      () => { /* rectangle de périmètre donné, aire au moins A */
        let r1_, r2_; do { r1_ = ri(2, 9); r2_ = ri(r1_ + 3, 20); } while (false);
        const S = r1_ + r2_, A = r1_ * r2_;
        return P("Un rectangle a un périmètre de " + M(2 * S) + " m. On note " + M("x") + " sa longueur (en m). On veut une aire d'au moins " + M(A) + " m².",
          [["a) Plus petite valeur possible de x (m)", r1_], ["b) Plus grande valeur possible de x (m)", r2_], ["c) Aire maximale possible (m²)", (S / 2) ** 2]],
          ["L'autre côté mesure " + S + " − x, donc x(" + S + " − x) ≥ " + A + ".", "x² − " + S + "x + " + A + " ≤ 0 : factorise, puis signe (la parabole est sous l'axe entre ses zéros). L'aire est maximale pour un carré."],
          M("x(" + S + " - x) \\geq " + A + " \\iff x^2 - " + S + "x + " + A + " \\leq 0 \\iff (x - " + r1_ + ")(x - " + r2_ + ") \\leq 0") + " : " + M("x \\in [" + r1_ + " ; " + r2_ + "]") + ". c) Carré de côté " + M(D(S / 2)) + " : " + M(D((S / 2) ** 2)) + " m².");
      },
    ],
    // ---------- Géométrie : Pythagore, trigonométrie ----------
    pyth: [
      () => { /* échelle qui glisse : deux triplets de même hypoténuse */
        const [c, legs] = pk([[25, [7, 15]], [50, [14, 30]], [65, [16, 25, 33, 39]], [85, [13, 36, 40, 51]]]);
        const L = c / 10; let f1, f2; do { f1 = pk(legs); f2 = pk(legs); } while (f2 <= f1);
        const h = (f) => Math.sqrt(c * c - f * f) / 10, h1 = h(f1), h2 = h(f2);
        return P("Une échelle de " + M(D(L)) + " m est appuyée contre un mur vertical, son pied à " + M(D(f1 / 10)) + " m du mur. Le pied glisse et s'arrête à " + M(D(f2 / 10)) + " m du mur.",
          [["a) Hauteur atteinte au départ (m)", h1, 0.01], ["b) Hauteur atteinte à la fin (m)", h2, 0.01], ["c) De combien de cm le haut de l'échelle est-il descendu ?", (h1 - h2) * 100, 1]],
          ["Deux triangles rectangles : l'échelle (" + T(L) + " m) est toujours l'hypoténuse.", "hauteur² = " + T(L) + "² − (distance du pied)². Puis la différence des deux hauteurs, en cm."],
          "a) " + M("\\sqrt{" + D(L) + "^2 - " + D(f1 / 10) + "^2} = " + D(h1)) + " m. b) " + M("\\sqrt{" + D(L) + "^2 - " + D(f2 / 10) + "^2} = " + D(h2)) + " m. c) " + M(D(h1) + " - " + D(h2) + " = " + D(r2c(h1 - h2))) + " m, soit " + M(Math.round((h1 - h2) * 100)) + " cm (alors que le pied n'a reculé que de " + M(Math.round(f2 * 10 - f1 * 10)) + " cm).");
      },
      () => { /* raccourci en diagonale */
        const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = pk([4, 5, 6, 8, 10]);
        const Lg = k * q, lg = k * p, dg = k * r, gain = Lg + lg - dg, v = pk([1.25, 1.5, 2]), tg = gain / v;
        return P("Un parc rectangulaire mesure " + M(Lg) + " m sur " + M(lg) + " m. Pour aller d'un coin au coin opposé, Léa le traverse en diagonale ; Noé longe les bords. Ils marchent à " + M(D(v)) + " m/s.",
          [["a) Longueur de la diagonale (m)", dg], ["b) Distance économisée par Léa (m)", gain], ["c) Temps gagné par Léa (s, à l'unité)", tg, 1]],
          ["La diagonale est l'hypoténuse d'un triangle rectangle dont les cathètes sont les côtés du parc.", "Noé parcourt " + Lg + " + " + lg + " m. Temps = distance ÷ vitesse."],
          "a) " + M("\\sqrt{" + Lg + "^2 + " + lg + "^2} = " + dg) + " m. b) " + M(Lg + lg + " - " + dg + " = " + gain) + " m. c) " + M(gain + " \\div " + D(v) + " \\approx " + Math.round(tg)) + " s.");
      },
    ],
    trigo: [
      () => { /* deux angles d'élévation */
        let al, be, d; do { al = ri(20, 40); be = al + ri(10, 25); d = 10 * ri(3, 12); } while (be > 70);
        const ta = Math.tan(rad(al)), tb = Math.tan(rad(be)), x = (d * ta) / (tb - ta), H = x * tb;
        return P("Pour mesurer la hauteur d'une tour, Inès vise son sommet sous un angle de " + M(be + "°") + ". Elle recule de " + M(d) + " m (en ligne droite, en s'éloignant) et le vise alors sous " + M(al + "°") + ". On néglige la taille d'Inès.",
          [["a) Distance entre la tour et le premier point de visée (m, au dixième)", x, 0.1], ["b) Hauteur de la tour (m, au dixième)", H, 0.1]],
          ["Appelle x la distance du premier point au pied de la tour et H la hauteur : tan " + be + "° = H ÷ x et tan " + al + "° = H ÷ (x + " + d + ").",
           "H = x · tan " + be + "° = (x + " + d + ") · tan " + al + "°. Résous cette équation en x (regroupe les x d'un côté), puis calcule H."],
          M("x \\tan " + be + "° = (x + " + d + ")\\tan " + al + "° \\iff x = \\frac{" + d + " \\tan " + al + "°}{\\tan " + be + "° - \\tan " + al + "°} \\approx " + D(r1(x))) + " m. b) " + M("H = x \\tan " + be + "° \\approx " + D(r1(H))) + " m.");
      },
      () => { /* rampe : pente en %, longueur, angle */
        const h = pk([36, 42, 48, 54, 60, 75]), pc = pk([6, 8, 10, 12]), Lh = h / pc, Lr = Math.sqrt(Lh * Lh + (h / 100) ** 2), ang = deg(Math.atan(pc / 100));
        return P("Une rampe pour fauteuil roulant doit monter de " + M(h) + " cm. Sa pente vaut " + M(pc + "\\,\\%") + " (elle monte de " + M(pc) + " cm pour 100 cm à l'horizontale).",
          [["a) Longueur horizontale nécessaire (m, au centième)", Lh, 0.01], ["b) Longueur de la rampe elle-même (m, au centième)", Lr, 0.01], ["c) Angle de la rampe avec le sol (°, au dixième)", ang, 0.1]],
          ["Pente = dénivelé ÷ distance horizontale. Attention aux unités : passe tout en mètres.", "La rampe est l'hypoténuse (Pythagore). Angle : tan α = " + pc + " ÷ 100."],
          "a) " + M("0{,}" + String(h).padStart(2, "0") + " \\div 0{,}" + String(pc).padStart(2, "0") + " = " + D(Lh)) + " m. b) " + M("\\sqrt{" + D(Lh) + "^2 + " + D(h / 100) + "^2} \\approx " + D(r2c(Lr))) + " m. c) " + M("\\tan \\alpha = " + D(pc / 100)) + ", " + M("\\alpha \\approx " + D(r1(ang)) + "°") + ".");
      },
    ],
    trigexact: [
      () => { /* triangle équilatéral : hauteur, aire, cercle inscrit en valeurs exactes */
        const a = pk([6, 12, 18, 24, 30]), hq = a / 2, Aq = a * a / 4, rq = a / 6, s3 = Math.sqrt(3);
        const ex = (k) => (k === 1 ? "" : k) + "√3";
        return P("Un panneau a la forme d'un triangle équilatéral de " + M(a) + " cm de côté. On y peint le plus grand disque possible (cercle inscrit, dont le centre est au tiers de la hauteur depuis la base).",
          [["a) Hauteur du triangle (cm, valeur exacte, ex. " + ex(hq) + ")", hq * s3], ["b) Aire du triangle (cm², valeur exacte)", Aq * s3], ["c) Rayon du disque (cm, valeur exacte)", rq * s3]],
          ["La hauteur coupe le côté en deux : triangle rectangle d'angle 60°, sin 60° = √3/2 (ou Pythagore).", "Hauteur = " + a + " · √3/2. Aire = base · hauteur ÷ 2. Rayon = hauteur ÷ 3."],
          "a) " + M("h = " + a + " \\cdot \\frac{\\sqrt{3}}{2} = " + (hq === 1 ? "" : hq) + "\\sqrt{3}") + " cm. b) " + M("\\frac{" + a + " \\cdot " + hq + "\\sqrt{3}}{2} = " + Aq + "\\sqrt{3}") + " cm². c) " + M("r = \\frac{h}{3} = " + (rq === 1 ? "" : rq) + "\\sqrt{3}") + " cm.");
      },
    ],
    trigrel: [
      () => {
        const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = ri(2, 6);
        return P("Dans un triangle rectangle, un angle aigu " + M("\\alpha") + " vérifie " + M("\\tan \\alpha = " + frac(p, q)) + ". Le périmètre du triangle vaut " + M(k * (p + q + r)) + " cm.",
          [["a) " + M("\\sin \\alpha") + " (fraction)", p / r], ["b) Hypoténuse (cm)", k * r], ["c) Aire (cm²)", (k * p * k * q) / 2]],
          ["tan α = opposé ÷ adjacent : les côtés de l'angle droit sont " + p + "t et " + q + "t pour un certain t. Pythagore donne l'hypoténuse en fonction de t.",
           "Hypoténuse = " + r + "t, périmètre = " + (p + q + r) + "t = " + k * (p + q + r) + "."],
          "Opposé " + M(p + "t") + ", adjacent " + M(q + "t") + ", hypoténuse " + M("\\sqrt{" + p * p + " + " + q * q + "}\\,t = " + r + "t") + ". a) " + M("\\sin\\alpha = " + frac(p, r)) + ". b) " + M((p + q + r) + "t = " + k * (p + q + r)) + ", " + M("t = " + k) + " : " + M(k * r) + " cm. c) " + M("\\frac{" + k * p + " \\cdot " + k * q + "}{2} = " + (k * p * k * q) / 2) + " cm².");
      },
    ],
    sinlaw: [
      () => { /* deux bateaux : cosinus, puis sinus (angle aigu, en face du plus petit côté), puis proportionnalité */
        let v1, v2, g, t; do { v1 = ri(8, 20); v2 = ri(8, 20); g = 5 * ri(8, 26); t = pk([1.5, 2, 2.5, 3]); } while (v1 === v2);
        const a = v1 * t, b = v2 * t, c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(g))), sm = Math.min(a, b);
        const angS = deg(Math.asin((sm * Math.sin(rad(g))) / c)), Dd = 10 * Math.ceil((c / t) * 1.6 / 10), tD = Dd / (c / t);
        return P("Deux bateaux quittent le port " + M("O") + " en même temps, en ligne droite : " + M("A") + " à " + M(v1) + " km/h, " + M("B") + " à " + M(v2) + " km/h. Leurs routes forment un angle de " + M(g + "°") + ".",
          [["a) Distance AB après " + T(t) + " h (km, au dixième)", c, 0.1], ["b) Angle du triangle OAB en " + (a < b ? "B" : "A") + " (°, au dixième)", angS, 0.1], ["c) Après combien d'heures seront-ils à " + Dd + " km l'un de l'autre ? (h, au centième)", tD, 0.01]],
          ["Après " + T(t) + " h : OA = " + T(a) + " km, OB = " + T(b) + " km. Théorème du cosinus pour AB.",
           "b) Théorème du sinus : l'angle cherché est en face du plus petit côté, il est aigu. c) Le triangle s'agrandit proportionnellement au temps : AB = " + T(r2c(c / t)) + " km par heure."],
          "a) " + M("AB^2 = " + D(a) + "^2 + " + D(b) + "^2 - 2 \\cdot " + D(a) + " \\cdot " + D(b) + " \\cos " + g + "°") + ", " + M("AB \\approx " + D(r1(c))) + " km. b) " + M("\\sin = \\frac{" + D(sm) + " \\sin " + g + "°}{AB}") + ", angle " + M("\\approx " + D(r1(angS)) + "°") + ". c) " + M(Dd + " \\div " + D(r2c(c / t)) + " \\approx " + D(r2c(tD))) + " h.");
      },
    ],
    triaire: [
      () => {
        let a, b, g; do { a = 5 * ri(4, 14); b = 5 * ri(4, 14); g = 5 * ri(7, 26); } while (a === b);
        const A = 0.5 * a * b * Math.sin(rad(g)), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(g))), h = (2 * A) / c;
        return P("Un terrain triangulaire a deux côtés de " + M(a) + " m et " + M(b) + " m qui forment un angle de " + M(g + "°") + ".",
          [["a) Aire (m², à l'unité)", A, 1], ["b) Troisième côté (m, au dixième)", c, 0.1], ["c) Distance du sommet de l'angle de " + g + "° au troisième côté (m, au dixième)", h, 0.1]],
          ["Aire = ½ · a · b · sin γ. Pour c), calcule d'abord le troisième côté (théorème du cosinus).", "Cette distance est la hauteur relative au troisième côté : aire = ½ · côté · hauteur, donc hauteur = 2 · aire ÷ côté (valeurs non arrondies)."],
          "a) " + M("\\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\sin " + g + "° \\approx " + nb(Math.round(A))) + " m². b) " + M("c^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + g + "°") + ", " + M("c \\approx " + D(r1(c))) + " m. c) Hauteur " + M("\\frac{2 \\cdot " + nb(r1(A)) + "}{" + D(r1(c)) + "} \\approx " + D(r1(h))) + " m.");
      },
    ],
    // ---------- Probabilités, statistiques, pourcentages ----------
    proba: [
      () => {
        let r, v; do { r = ri(3, 8); v = ri(2, 7); } while (r === v);
        const n = r + v, Prr = (r * (r - 1)) / (n * (n - 1)), Pvv = (v * (v - 1)) / (n * (n - 1));
        return P("Une urne contient " + M(r) + " boules rouges et " + M(v) + " vertes. On tire deux boules sans remise. On gagne si elles sont de la même couleur. (fractions acceptées)",
          [["a) P(deux rouges)", Prr], ["b) P(gagner)", Prr + Pvv], ["c) P(au moins une verte)", 1 - Prr]],
          ["Arbre à deux étages : après un premier tirage, il reste " + (n - 1) + " boules, et une de moins de la couleur tirée.", "Gagner = deux rouges OU deux vertes (on additionne). « Au moins une verte » est le contraire de « deux rouges »."],
          "a) " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + frac(r * (r - 1), n * (n - 1))) + ". b) " + M(frac(r * (r - 1), n * (n - 1)) + " + " + frac(v * (v - 1), n * (n - 1)) + " = " + frac(r * (r - 1) + v * (v - 1), n * (n - 1))) + ". c) " + M("1 - " + frac(r * (r - 1), n * (n - 1)) + " = " + frac(n * (n - 1) - r * (r - 1), n * (n - 1))) + ".");
      },
      () => {
        const s = pk([4, 5, 6, 8, 9, 10]);
        let cs = 0, both = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) { if (i + j === s) { cs++; if (i === j) both++; } }
        return P("On lance deux dés équilibrés. On gagne si la somme vaut " + M(s) + " OU si on fait un double. (fractions acceptées)",
          [["a) P(somme = " + s + ")", cs / 36], ["b) P(double)", 1 / 6], ["c) P(gagner)", (cs + 6 - both) / 36]],
          ["Tableau à double entrée : 36 issues équiprobables. Compte les cases où la somme vaut " + s + ".", "Gagner : cases « somme " + s + " » plus cases « double », sans compter deux fois une case qui est les deux à la fois."],
          "a) " + M(cs) + " cases : " + M(frac(cs, 36)) + ". b) " + M("\\frac{6}{36} = \\frac{1}{6}") + ". c) " + (both ? "Le double " + M(s / 2 + " + " + s / 2) + " est compté une seule fois : " : "Aucun double ne fait " + M(s) + " : ") + M("\\frac{" + cs + " + 6" + (both ? " - 1" : "") + "}{36} = " + frac(cs + 6 - both, 36)) + ".");
      },
    ],
    stats: [
      () => { /* note nécessaire à un test qui compte double */
        let xs, Mg, need; do {
          xs = Array.from({ length: 5 }, () => ri(6, 11) / 2); Mg = pk([4.5, 5, 5.5]);
          need = ((7 * Mg) - xs.reduce((u, v) => u + v, 0)) / 2; } while (need < 3.5 || need > 6 || Math.abs(need * 10 - Math.round(need * 10)) > 1e-9);
        const sum = xs.reduce((u, v) => u + v, 0), so = [...xs].sort((u, v) => u - v);
        return P("Les notes de Yanis : " + M(xs.map(D).join(" \\,;\\, ")) + ". Le prochain test compte double. Il veut finir avec une moyenne de " + M(D(Mg)) + ".",
          [["a) Moyenne actuelle (au centième)", sum / 5, 0.01], ["b) Médiane actuelle", so[2]], ["c) Note à obtenir au prochain test", need]],
          ["Un test qui compte double compte comme deux notes : il y aura 7 notes en tout.", "Somme visée = 7 · " + T(Mg) + " ; la note x vérifie " + T(sum) + " + 2x = " + T(7 * Mg) + "."],
          "a) " + M("\\frac{" + D(sum) + "}{5} \\approx " + D(r2c(sum / 5))) + ". b) Série triée : " + M(so.map(D).join(" \\,;\\, ")) + ", médiane " + M(D(so[2])) + ". c) " + M(D(sum) + " + 2x = 7 \\cdot " + D(Mg) + " = " + D(7 * Mg)) + ", " + M("x = " + D(need)) + ".");
      },
    ],
    pctvar: [
      () => {
        const P0 = 20 * ri(10, 60); let h, b; do { h = pk([10, 15, 20, 25, 30]); b = pk([10, 20, 25, 30, 40]); } while (b <= h || (1 + h / 100) * (1 - b / 100) >= 1);
        const P1 = P0 * (1 + h / 100), P2 = P1 * (1 - b / 100), g = (P2 / P0 - 1) * 100, back = (P0 / P2 - 1) * 100;
        return P("Un vélo coûte " + M(nb(P0)) + " CHF. Son prix augmente de " + M(h + "\\,\\%") + ", puis il est soldé à " + M("-" + b + "\\,\\%") + ".",
          [["a) Prix soldé (CHF)", P2, 0.01], ["b) Variation globale (%, négatif pour une baisse)", g, 0.01], ["c) Après les soldes, de quel pourcentage faut-il augmenter le prix pour revenir à " + nb(P0) + " CHF ? (%, au dixième)", back, 0.1]],
          ["Hausse de " + h + " % : multiplier par " + T(1 + h / 100) + ". Baisse de " + b + " % : multiplier par " + T(1 - b / 100) + ". Les pourcentages ne s'additionnent pas.",
           "Variation globale : " + T(1 + h / 100) + " · " + T(1 - b / 100) + " = " + T(r2c((1 + h / 100) * (1 - b / 100) * 100) / 100) + ". c) Le pourcentage se calcule sur le prix soldé : " + nbT(P0) + " ÷ prix soldé."],
          "a) " + M(nb(P0) + " \\cdot " + D(1 + h / 100) + " \\cdot " + D(1 - b / 100) + " = " + nb(r2c(P2))) + " CHF. b) " + M("\\frac{" + nb(r2c(P2)) + "}{" + nb(P0) + "} = " + D(+(P2 / P0).toFixed(4))) + ", soit " + M(D(r2c(g)) + "\\,\\%") + " (et non " + M((h - b) + "\\,\\%") + "). c) " + M("\\frac{" + nb(P0) + "}{" + nb(r2c(P2)) + "} \\approx " + D(+(P0 / P2).toFixed(4))) + " : " + M("+" + D(r1(back)) + "\\,\\%") + ".");
      },
    ],
    // ---------- Fonctions affines, droites ----------
    affine: [
      () => { /* taxi : deux courses → tarif, puis budget */
        let p, f, d1, d2, B, km; do { p = pk([1.8, 2.2, 2.5, 3.2, 3.5]); f = pk([5, 6, 6.5, 7, 8]); d1 = ri(3, 9); d2 = d1 + ri(4, 15); B = 10 * ri(5, 12); km = Math.round(((B - f) / p) * 1e6) / 1e6; } while (Number.isInteger(km) || km < d2);
        const c1 = r2c(f + p * d1), c2 = r2c(f + p * d2);
        return P("Un taxi facture une prise en charge fixe plus un prix par km. Une course de " + M(d1) + " km a coûté " + M(D(c1)) + " CHF, une course de " + M(d2) + " km " + M(D(c2)) + " CHF.",
          [["a) Prix par km (CHF)", p], ["b) Prise en charge (CHF)", f], ["c) Nombre maximal de km entiers avec " + B + " CHF", Math.floor(km)]],
          ["La différence de prix correspond à la différence de km : prix par km = (" + T(c2) + " − " + T(c1) + ") ÷ (" + d2 + " − " + d1 + ").",
           "Prise en charge = " + T(c1) + " − " + d1 + " · (prix par km). c) Résous prise en charge + (prix par km) · x ≤ " + B + ", puis prends l'entier inférieur."],
          "a) " + M("\\frac{" + D(c2) + " - " + D(c1) + "}{" + (d2 - d1) + "} = " + D(p)) + " CHF/km. b) " + M(D(c1) + " - " + d1 + " \\cdot " + D(p) + " = " + D(f)) + " CHF. c) " + M(D(f) + " + " + D(p) + "x \\leq " + B + " \\iff x \\leq " + D(r2c(km))) + " : " + M(Math.floor(km)) + " km.");
      },
    ],
    droites: [
      () => { /* droite (AB), perpendiculaire passant par C, pied et distance */
        let m, F, s1, s2, t; do { m = pk([2, -2, 3, -3]); F = [ri(-3, 3), ri(-3, 3)]; s1 = ri(1, 3); s2 = ri(1, 2); t = R.nz(-2, 2); } while (F[1] - m * F[0] === 0);
        const A = [F[0] - s1, F[1] - m * s1], B = [F[0] + s2, F[1] + m * s2], C = [F[0] - m * t, F[1] + t], hh = F[1] - m * F[0], dist = Math.abs(t) * Math.sqrt(1 + m * m);
        return P("On donne " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + ", " + M("B(" + B[0] + " \\,;\\, " + B[1] + ")") + " et " + M("C(" + C[0] + " \\,;\\, " + C[1] + ")") + ". On cherche le point " + M("H") + " de la droite " + M("(AB)") + " le plus proche de " + M("C") + ".",
          [["a) Pente de (AB)", m], ["b) Ordonnée à l'origine de (AB)", hh], ["c) Abscisse de H", F[0]], ["d) Distance CH (au centième)", dist, 0.01]],
          ["H est le pied de la perpendiculaire à (AB) passant par C : sa pente est −1 ÷ " + m + ".",
           "Écris l'équation de la perpendiculaire passant par C, puis résous le système des deux droites. CH par la formule de la distance (Pythagore)."],
          "a) " + M("m = \\frac{" + B[1] + " - " + pr(A[1]) + "}{" + B[0] + " - " + pr(A[0]) + "} = " + m) + ". b) " + M("y = " + m + "x" + sg(hh)) + ". c) Perpendiculaire de pente " + M(frac(-1, m)) + " par " + M("C") + " ; intersection " + M("H(" + F[0] + " \\,;\\, " + F[1] + ")") + ". d) " + M("CH = \\sqrt{" + (C[0] - F[0]) ** 2 + " + " + (C[1] - F[1]) ** 2 + "} \\approx " + D(r2c(dist))) + ".");
      },
    ],
    inter: [
      () => { /* droite tangente à une parabole (Δ = 0) */
        const a = R.nz(-4, 4), m = 2 * a, k = -a * a;
        return P("La droite " + M("g(x) = " + m + "x + k") + " et la parabole " + M("f(x) = x^2") + ". On cherche " + M("k") + " pour que la droite touche la parabole en un seul point (tangente).",
          [["a) Valeur de k", k], ["b) Abscisse du point de contact", a], ["c) Pour k = " + (k + 4) + ", distance entre les deux points d'intersection (au centième)", 4 * Math.sqrt(1 + m * m), 0.01]],
          ["Points communs : x² = " + pT([m, 0]) + " + k, soit " + pT([1, -m, 0]) + " − k = 0. Un seul point ⇔ Δ = 0.", "Δ = " + m * m + " + 4k. c) Résous " + pT([1, -m, a * a - 4]) + " = 0 ; les deux points sont sur la droite : distance = Pythagore avec l'écart des x et l'écart des y."],
          M("\\Delta = " + m * m + " + 4k = 0") + " : a) " + M("k = " + k) + ". b) " + M("x = \\frac{" + m + "}{2} = " + a) + ". c) " + M(poly([1, -m, a * a - 4]) + " = 0") + " : " + M("x = " + (a - 2)) + " ou " + M(a + 2) + " ; écart en x " + M(4) + ", en y " + M(4 * Math.abs(m)) + " : " + M("\\sqrt{16 + " + 16 * m * m + "} \\approx " + D(r2c(4 * Math.sqrt(1 + m * m)))) + ".");
      },
      () => {
        let x1, x2, m, h; do { x1 = ri(-5, 1); x2 = ri(x1 + 2, 5); m = R.nz(-3, 3); h = R.nz(-6, 6); } while (x1 === 0 || x2 === 0);
        const b = -(x1 + x2) + m, c = x1 * x2 + h, L = (x2 - x1) * Math.sqrt(1 + m * m);
        return P("On donne " + M("f(x) = " + poly([1, b, c])) + " et " + M("g(x) = " + poly([m, h])) + ".",
          [["a) Abscisses des points d'intersection (séparées par « ; »)", SET([x1, x2])], ["b) Longueur du segment qui joint ces deux points (au centième)", L, 0.01]],
          ["f(x) = g(x) ⇔ " + pT([1, b - m, c - h]) + " = 0 : factorise ou Δ.", "Calcule les ordonnées avec g (c'est plus simple), puis la distance entre les deux points (Pythagore)."],
          M("f(x) = g(x) \\iff " + poly([1, b - m, c - h]) + " = 0 \\iff (" + xm(x1) + ")(" + xm(x2) + ") = 0") + ". b) Points " + M("(" + x1 + " \\,;\\, " + (m * x1 + h) + ")") + " et " + M("(" + x2 + " \\,;\\, " + (m * x2 + h) + ")") + " : " + M("\\sqrt{" + (x2 - x1) ** 2 + " + " + (m * (x2 - x1)) ** 2 + "} \\approx " + D(r2c(L))) + ".");
      },
    ],
    // ---------- MP (2e à 4e) ----------
    croissexp: [
      () => {
        const C0 = 500 * ri(4, 30), r = pk([1.5, 2, 2.5, 3, 3.5, 4]), n = ri(5, 15), N = pk([10, 12, 15, 20, 25]);
        const Vn = C0 * (1 + r / 100) ** n, nd = Math.ceil(Math.log(2) / Math.log(1 + r / 100)), rN = (Math.pow(2, 1 / N) - 1) * 100;
        return P("Un capital de " + M(nb(C0)) + " CHF est placé à " + M(D(r) + "\\,\\%") + " d'intérêts composés par an.",
          [["a) Valeur après " + n + " ans (CHF, au centime)", Vn, 0.01], ["b) Nombre d'années entières pour que le capital double", nd], ["c) Taux annuel qu'il faudrait pour doubler en " + N + " ans (%, au centième)", rN, 0.01]],
          ["Capital après n années : C₀ · " + T(1 + r / 100) + "ⁿ. Doubler : " + T(1 + r / 100) + "ⁿ ≥ 2 (logarithme), puis l'entier supérieur.", "c) Cherche q tel que q^" + N + " = 2 : q = 2^(1/" + N + "), taux = (q − 1) · 100."],
          "a) " + M(nb(C0) + " \\cdot " + D(1 + r / 100) + "^{" + n + "} \\approx " + nb(r2c(Vn))) + " CHF. b) " + M("n \\geq \\frac{\\log 2}{\\log " + D(1 + r / 100) + "} \\approx " + D(r2c(Math.log(2) / Math.log(1 + r / 100)))) + " : " + M(nd) + " ans. c) " + M("2^{1/" + N + "} \\approx " + D(+Math.pow(2, 1 / N).toFixed(5))) + " : " + M(D(r2c(rN)) + "\\,\\%") + ".");
      },
    ],
    eqexp: [
      () => {
        let a, X2; do { a = ri(1, 4); X2 = pk([-3, -2, -1, 3, 5, 6, 7]); } while (X2 === 2 ** a || X2 === -(2 ** a));
        const X1 = 2 ** a, s = X1 + X2, p = X1 * X2, sols = X2 > 0 ? [a, Math.log2(X2)] : [a];
        return P("On résout " + M("4^x " + (s < 0 ? "+ " + -s : "- " + s) + " \\cdot 2^x " + (p < 0 ? "- " + -p : "+ " + p) + " = 0") + " en posant " + M("X = 2^x") + ".",
          [["a) Nombre de solutions x", sols.length], ["b) Plus grande solution x (au centième)", Math.max(...sols), 0.01]],
          ["4^x = (2^x)² = X² : l'équation devient X² " + (s < 0 ? "+ " + -s : "− " + s) + "X " + (p < 0 ? "− " + -p : "+ " + p) + " = 0.", "Résous en X, puis 2^x = X : impossible si X ≤ 0 ; sinon x = log X ÷ log 2."],
          M("X^2 " + (s < 0 ? "+ " + -s : "- " + s) + "X " + (p < 0 ? "- " + -p : "+ " + p) + " = (X - " + X1 + ")(X " + (X2 < 0 ? "+ " + -X2 : "- " + X2) + ") = 0") + ". " + M("2^x = " + X1) + " donne " + M("x = " + a) + (X2 > 0 ? " ; " + M("2^x = " + X2) + " donne " + M("x = \\frac{\\log " + X2 + "}{\\log 2} \\approx " + D(r2c(Math.log2(X2)))) + " : 2 solutions." : " ; " + M("2^x = " + X2) + " est impossible (" + M("2^x > 0") + ") : une seule solution."));
      },
    ],
    eqlog: [
      () => {
        let i, j; do { i = ri(2, 5); j = ri(1, i - 1); } while (false);
        const n = i + j, r = 2 ** i, a = r - 2 ** j, rej = -(2 ** j);
        return P("On résout " + M("\\log_2 x + \\log_2(x - " + a + ") = " + n) + ".",
          [["a) Domaine : x doit être plus grand que", a], ["b) Solution retenue", r], ["c) Combien de solutions a l'équation " + M("\\log_2\\big(x(x - " + a + ")\\big) = " + n) + " ?", 2]],
          ["Domaine : les deux logarithmes doivent exister. Puis log₂ u + log₂ v = log₂(uv), et log₂ w = " + n + " ⇔ w = 2^" + n + " = " + 2 ** n + ".",
           "x(x − " + a + ") = " + 2 ** n + " ⇔ x² − " + a + "x − " + 2 ** n + " = 0. Vérifie chaque solution dans le domaine. c) Ici seul le produit doit être positif : le domaine est plus grand."],
          "a) " + M("x > 0") + " et " + M("x > " + a) + ". b) " + M("x^2 - " + a + "x - " + 2 ** n + " = (x - " + r + ")(x + " + -rej + ") = 0") + " : " + M(r) + " convient, " + M(rej) + " est rejetée. c) " + M("x(x - " + a + ") > 0") + " aussi pour " + M("x = " + rej) + " : 2 solutions (les deux équations ne sont pas équivalentes).");
      },
    ],
    scalmp: [
      () => {
        let A, B, C, u, v; do { A = [ri(-4, 3), ri(-4, 3)]; B = [ri(-5, 6), ri(-5, 6)]; C = [ri(-5, 6), ri(-5, 6)]; u = [B[0] - A[0], B[1] - A[1]]; v = [C[0] - A[0], C[1] - A[1]]; }
        while (u[0] * v[1] - u[1] * v[0] === 0 || Math.hypot(...u) < 3 || Math.hypot(...v) < 3 || u[0] * v[0] + u[1] * v[1] === 0);
        const ps = u[0] * v[0] + u[1] * v[1], ang = deg(Math.acos(ps / (Math.hypot(...u) * Math.hypot(...v)))), aire = Math.abs(u[0] * v[1] - u[1] * v[0]) / 2;
        return P("Triangle " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + ", " + M("B(" + B[0] + " \\,;\\, " + B[1] + ")") + ", " + M("C(" + C[0] + " \\,;\\, " + C[1] + ")") + ".",
          [["a) " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC}"), ps], ["b) Angle du triangle en A (°, au dixième)", ang, 0.1], ["c) Aire du triangle", aire]],
          ["Composantes de AB et AC, puis produit scalaire ; cos Â = (AB · AC) ÷ (‖AB‖ · ‖AC‖).", "Aire = ½ · ‖AB‖ · ‖AC‖ · sin Â, ou ½ · |déterminant de AB et AC|."],
          M("\\overrightarrow{AB} = (" + u[0] + " \\,;\\, " + u[1] + ")") + ", " + M("\\overrightarrow{AC} = (" + v[0] + " \\,;\\, " + v[1] + ")") + ". a) " + M(ps) + ". b) " + M("\\cos \\hat{A} = \\frac{" + ps + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\hat{A} \\approx " + D(r1(ang)) + "°") + (ps < 0 ? " (obtus : produit scalaire négatif)" : "") + ". c) " + M("\\frac{1}{2}|" + u[0] + " \\cdot " + pr(v[1]) + " - " + pr(u[1]) + " \\cdot " + pr(v[0]) + "| = " + D(aire)) + ".");
      },
    ],
    polymp: [
      () => {
        let r0, p, q; do { r0 = pk([1, -1, 2, -2]); p = R.nz(-6, 6); q = R.nz(-6, 6); } while (new Set([r0, p, q]).size < 3 || Math.abs(p) <= 2 && Math.abs(q) <= 2);
        const cs = [1, -(r0 + p + q), r0 * p + r0 * q + p * q, -r0 * p * q], E = (x) => (x - r0) * (x - p) * (x - q), neg = cntInt((x) => E(x) < 0);
        return P("Soit " + M("P(x) = " + poly(cs)) + ".",
          [["a) Plus petit zéro de P", Math.min(r0, p, q)], ["b) Plus grand zéro de P", Math.max(r0, p, q)], ["c) Combien d'entiers x de −10 à 10 vérifient " + M("P(x) < 0") + " ?", neg]],
          ["Cherche un zéro « évident » parmi ±1, ±2 (diviseurs du terme constant), puis divise P par (x − ce zéro) (Horner).", "Le quotient est un trinôme : factorise-le. Pour b) : tableau de signes avec les trois zéros."],
          M("P(" + r0 + ") = 0") + ", " + M("P(x) = (" + xm(r0) + ")(" + poly([1, -(p + q), p * q]) + ") = (" + xm(r0) + ")(" + xm(p) + ")(" + xm(q) + ")") + ". a) et b) Zéros " + M([r0, p, q].sort((u, v) => u - v).join(" \\,;\\, ")) + ". c) " + M("P(x) < 0") + " à gauche du plus petit zéro et entre les deux autres : " + M(neg) + " entiers.");
      },
    ],
  };
})();
// Texte simple : milliers avec ' (indices et étiquettes).
function nbT(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "'"); }
for (const [id, fns] of Object.entries(DEFIS)) {
  if (typeof GEN === "undefined" || !GEN[id]) continue;
  if (typeof PROB !== "undefined") delete PROB[id];
  PROB_EXTRA[id] = fns;
}
