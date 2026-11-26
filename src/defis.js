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
  /* Nombres : virgule décimale et ' pour les milliers dès 1'000 (24.11 : « 7500 CHF » s'affichait sans séparateur,
     le nb() global ne groupe qu'à partir de 10'000). D et nb : en TeX ; T : en texte simple (signe moins typographique). */
  const grp = (v, sep, dp) => { const [i, f] = String(+(+v).toFixed(10)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i) + (f ? dp + f : ""); };
  const D = (v) => grp(v, "\\text{'}", "{,}"), T = (v) => grp(v, "'", ",").replace(/^-/, "−"), nb = (v) => grp(+(+v).toFixed(6), "\\text{'}", "{,}");
  const sgD = (v) => (v < 0 ? " - " + D(-v) : " + " + D(v)), tT = (v) => (v < 0 ? "(" + T(v) + ")" : T(v));
  const PAIR = (x, y) => ({ kind: "pair", values: [x, y] }), SOLS = (ivs) => ({ kind: "solset", ivs }), RAD = (v) => ({ kind: "value", value: v, radical: true });
  const cfD = (v) => (v === 1 ? "" : v === -1 ? "-" : D(v));
  const pl = (n, w) => n + " " + w + (n > 1 ? "s" : "");
  /* 26.11 (revue élèves, decmul-4-qkr : 523,075 → corrigé 523,08, « bonnes réponses » 523,07) : arrondi sur l'écriture
     décimale (523,075 · 100 = 52307,4999… en flottant). */
  const r1 = (v) => Math.round(+(v * 10).toPrecision(12)) / 10, r2c = (v) => Math.round(+(v * 100).toPrecision(12)) / 100;
  const fx = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 12; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return frac(Math.round(v * d), d); return D(v); };
  const fxT = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 12; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return (v < 0 ? "−" : "") + Math.abs(Math.round(v * d)) + "/" + d; return T(v); };
  const xm = (p) => (p === 0 ? "x" : p > 0 ? "x - " + p : "x + " + -p); /* (x − p) */
  const xmT = (p) => (p === 0 ? "x" : p > 0 ? "x − " + p : "x + " + -p);
  const pr = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const cntInt = (f, a = -10, b = 10) => { let c = 0; for (let x = a; x <= b; x++) if (f(x)) c++; return c; };
  const pT = (cs) => poly(cs).replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³").replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/-/g, "−");
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
  /* Prix en CHF : deux décimales quand le montant n'est pas entier (13,90 et non 13,9). */
  const CHF = (v) => (Number.isInteger(r2c(v)) ? D(r2c(v)) : grp(Math.trunc(r2c(v)), "\\text{'}", "{,}") + "{,}" + Math.abs(r2c(v)).toFixed(2).split(".")[1]);
  /* « = » si la valeur au centime est exacte, « ≈ » sinon (26.11, problèmes de decmul) */
  const eqa = (x, r) => (Math.abs(x - r) < 1e-9 ? " = " : " \\approx ");
  const CHFT = (v) => (Number.isInteger(r2c(v)) ? T(r2c(v)) : grp(Math.trunc(r2c(v)), "'", ",") + "," + Math.abs(r2c(v)).toFixed(2).split(".")[1]);

  const OUT = { /* 26.11 soir (agent defisch) : objet nommé, complété plus bas (défis à 3 contextes) */
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
      () => { /* facteur commun binôme, puis différence de carrés ; puis paramètre pour une solution double (24.11 : plus de tableau de signes à trois facteurs en 11e) */
        let m, n, p;
        do { m = pk([1, 2, 3]); n = ri(1, 7); p = R.nz(-6, 6); } while (gcd(m, n) !== 1 || (m === 1 && n < 2) || n === Math.abs(p) * m || n % m === 0 && Math.abs(n / m) === Math.abs(p));
        const zs = [p, n / m, -n / m], cc = m * m * p * p;
        const c2 = m * m === 1 ? "" : m * m;
        return P("On considère " + M("E(x) = " + c2 + "x^2(" + xm(p) + ") - " + n * n + "(" + xm(p) + ")") + ".",
          [["a) Solutions de " + M("E(x) = 0") + " (séparées par « ; », fractions acceptées)", SET(zs)],
           ["b) On remplace " + M(n * n) + " par un nombre " + M("c > 0") + " : " + M(c2 + "x^2(" + xm(p) + ") - c(" + xm(p) + ") = 0") + ". Pour quelle valeur de " + M("c") + " cette équation n'a-t-elle plus que deux solutions ?", cc]],
          ["Mets le facteur commun (" + xmT(p) + ") en évidence : E(x) = (" + xmT(p) + ")(" + c2 + "x² − " + n * n + "). Le second facteur est une différence de deux carrés.",
           "Trois facteurs du 1er degré, trois solutions (produit nul). Pour b) : les solutions sont " + p + " et ± √c" + (m === 1 ? "" : " ÷ " + m) + " ; il n'en reste que deux si l'une d'elles est égale à " + p + "."],
          M("E(x) = (" + xm(p) + ")(" + c2 + "x^2 - " + n * n + ") = (" + xm(p) + ")(" + (m === 1 ? "" : m) + "x - " + n + ")(" + (m === 1 ? "" : m) + "x + " + n + ")") + ". a) " + M("x \\in \\{" + [...zs].sort((u, v) => u - v).map(fx).join(" ; ") + "\\}") + ". b) " + M(c2 + "x^2 = c") + " donne " + M("x = \\pm" + (m === 1 ? "\\sqrt{c}" : "\\frac{\\sqrt{c}}{" + m + "}")) + " ; deux solutions seulement si l'une vaut " + M(p) + " : " + M("c = " + (m === 1 ? "" : m * m + " \\cdot ") + pr(p) + "^2 = " + cc) + ".");
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
          [["a) Longueur horizontale nécessaire (m, au centième)", r2c(Lh), 0.01], ["b) Longueur de la rampe elle-même (m, au centième)", r2c(Lr), 0.01], ["c) Angle de la rampe avec le sol (°, au dixième)", r1(ang), 0.1]],
          ["Pente = dénivelé ÷ distance horizontale. Attention aux unités : passe tout en mètres.", "La rampe est l'hypoténuse (Pythagore). Angle : tan α = " + pc + " ÷ 100."],
          "a) " + M("0{,}" + String(h).padStart(2, "0") + " \\div 0{,}" + String(pc).padStart(2, "0") + " = " + D(Lh)) + " m. b) " + M("\\sqrt{" + D(Lh) + "^2 + " + D(h / 100) + "^2} \\approx " + D(r2c(Lr))) + " m. c) " + M("\\tan \\alpha = " + D(pc / 100)) + ", " + M("\\alpha \\approx " + D(r1(ang)) + "°") + ".");
      },
    ],
    /* 26.11 soir (agent defis3) : + hexagone et chevron de toit (30°, 45°, 60°), 3 contextes. */
    trigexact: [
      () => { /* triangle équilatéral : hauteur, aire, cercle inscrit en valeurs exactes */
        const a = pk([6, 12, 18, 24, 30]), hq = a / 2, Aq = a * a / 4, rq = a / 6, s3 = Math.sqrt(3);
        const ex = (k) => (k === 1 ? "" : k) + "√3";
        return Object.assign(P("Un panneau a la forme d'un triangle équilatéral de " + M(a) + " cm de côté. On y peint le plus grand disque possible (cercle inscrit, dont le centre est au tiers de la hauteur depuis la base).",
          [["a) Hauteur du triangle (cm, valeur exacte, ex. " + ex(hq) + ")", hq * s3], ["b) Aire du triangle (cm², valeur exacte)", Aq * s3], ["c) Rayon du disque (cm, valeur exacte)", rq * s3]],
          ["La hauteur coupe le côté en deux : triangle rectangle d'angle 60°, sin 60° = √3/2 (ou Pythagore).", "Hauteur = " + a + " · √3/2. Aire = base · hauteur ÷ 2. Rayon = hauteur ÷ 3."],
          "a) " + M("h = " + a + " \\cdot \\frac{\\sqrt{3}}{2} = " + (hq === 1 ? "" : hq) + "\\sqrt{3}") + " cm. b) " + M("\\frac{" + a + " \\cdot " + hq + "\\sqrt{3}}{2} = " + Aq + "\\sqrt{3}") + " cm². c) " + M("r = \\frac{h}{3} = " + (rq === 1 ? "" : rq) + "\\sqrt{3}") + " cm."), { ctx: "panneau" });
      },
      () => { /* hexagone régulier : six triangles équilatéraux */
        const a = pk([30, 40, 50, 60, 80]), s3 = Math.sqrt(3), ap = a / 2, A = (3 * a * a) / 2;
        return Object.assign(P("Une table a la forme d'un hexagone régulier de " + M(a) + " cm de côté : elle est formée de six triangles équilatéraux qui se rejoignent au centre.",
          [["a) Distance du centre au milieu d'un côté (apothème, cm, valeur exacte, ex. " + ap + "√3)", ap * s3], ["b) Aire de la table (cm², valeur exacte)", A * s3], ["c) Distance entre deux sommets opposés (cm)", 2 * a]],
          ["L'apothème est la hauteur d'un des triangles équilatéraux : côté · sin 60° = côté · √3/2.", "Aire = 6 · (côté · apothème ÷ 2). Deux sommets opposés : deux côtés bout à bout en passant par le centre."],
          "a) " + M(a + " \\cdot \\frac{\\sqrt{3}}{2} = " + ap + "\\sqrt{3}") + " cm. b) " + M("6 \\cdot \\frac{" + a + " \\cdot " + ap + "\\sqrt{3}}{2} = " + D(A) + "\\sqrt{3}") + " cm². c) " + M("2 \\cdot " + a + " = " + 2 * a) + " cm."), { ctx: "hexagone" });
      },
      () => { /* chevron de toit incliné à 30°, 45° ou 60° : hauteur et largeur en valeurs exactes */
        const t = pk([30, 45, 60]), L = pk([4, 6, 8, 10]), r = (t * Math.PI) / 180, h = L * Math.sin(r), w = L * Math.cos(r), A = (h * w) / 2;
        const ex = { 30: [L / 2 + "", L / 2 + "\\sqrt{3}", "\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"], 45: [L / 2 + "\\sqrt{2}", L / 2 + "\\sqrt{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"], 60: [L / 2 + "\\sqrt{3}", L / 2 + "", "\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"] }[t];
        const At = t === 45 ? D((L * L) / 4) : Number.isInteger((L * L) / 8) ? (L * L) / 8 + "\\sqrt{3}" : "\\frac{" + (L * L) / 4 + "\\sqrt{3}}{2}";
        return Object.assign(P("Un chevron de toit de " + M(L) + " m est incliné à " + M(t + "°") + " par rapport à l'horizontale. Avec le plancher du grenier et un mur vertical, il forme un triangle rectangle.",
          [["a) Hauteur du mur (m, valeur exacte)", h], ["b) Largeur au sol, de l'angle de " + t + "° au mur (m, valeur exacte)", w], ["c) Aire du triangle (m², valeur exacte)", A]],
          ["Le chevron est l'hypoténuse : hauteur = " + L + " · sin " + t + "°, largeur = " + L + " · cos " + t + "°.", "sin " + t + "° et cos " + t + "° ont des valeurs exactes (√2/2, √3/2, 1/2). Aire = hauteur · largeur ÷ 2."],
          "a) " + M(L + " \\cdot " + ex[2] + " = " + ex[0]) + " m. b) " + M(L + " \\cdot " + ex[3] + " = " + ex[1]) + " m. c) " + M("\\frac{" + ex[0] + " \\cdot " + ex[1] + "}{2} = " + At + (t === 45 ? "" : " \\approx " + D(r2c(A)))) + " m²."), { ctx: "toit" });
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
      () => { /* 26.11 (référentiel du Collège 2.GE.02c) : résoudre complètement un triangle (deux côtés et l'angle compris) */
        let a, b; do { a = 10 * ri(4, 11); b = 10 * ri(5, 12); } while (b - a < 20);
        const g = pk([40, 50, 60, 70, 80, 100, 110]), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(g))), al = deg(Math.asin((a * Math.sin(rad(g))) / c)), be = 180 - g - al, A = 0.5 * a * b * Math.sin(rad(g));
        return P("Un terrain triangulaire " + M("ABC") + " a deux côtés " + M("a = BC = " + a) + " m et " + M("b = AC = " + b) + " m, qui forment l'angle " + M("\\gamma = " + g + "°") + " en " + M("C") + ". On veut le résoudre complètement.",
          [["a) Côté c = AB (m, au dixième)", c, 0.1], ["b) Angle α en A (°, au dixième)", al, 0.1], ["c) Angle β en B (°, au dixième)", be, 0.1], ["d) Aire du terrain (m², à l'unité)", A, 1]],
          ["Théorème du cosinus pour c ; puis théorème du sinus pour α, en face du plus petit côté a (α est donc aigu).", "c) Somme des angles. d) Aire = ½ · a · b · sin γ."],
          "a) " + M("c^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + g + "°") + ", " + M("c \\approx " + D(r1(c))) + " m. b) " + M("\\sin\\alpha = \\frac{" + a + " \\sin " + g + "°}{c}") + ", " + M("\\alpha \\approx " + D(r1(al)) + "°") + ". c) " + M("\\beta = 180° - " + g + "° - \\alpha \\approx " + D(r1(be)) + "°") + ". d) " + M("\\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\cdot \\sin " + g + "° \\approx " + nb(Math.round(A))) + " m².");
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
    /* 26.11 soir (agent defis3) : base 2 ou 3, et une équation-quotient ; 3 contextes (avant : 10 énoncés en base 2). */
    eqlog: [
      () => {
        const B = pk([2, 2, 3]); let i, j; do { i = ri(2, B === 2 ? 5 : 3); j = ri(1, i - 1); } while (false);
        const n = i + j, r = B ** i, a = r - B ** j, rej = -(B ** j);
        return Object.assign(P("On résout " + M("\\log_" + B + " x + \\log_" + B + "(x - " + a + ") = " + n) + ".",
          [["a) Domaine : x doit être plus grand que", a], ["b) Solution retenue", r], ["c) Combien de solutions a l'équation " + M("\\log_" + B + "\\big(x(x - " + a + ")\\big) = " + n) + " ?", 2]],
          ["Domaine : les deux logarithmes doivent exister. Puis log_" + B + " u + log_" + B + " v = log_" + B + "(uv), et log_" + B + " w = " + n + " ⇔ w = " + B + "^" + n + " = " + B ** n + ".",
           "x(x − " + a + ") = " + B ** n + " ⇔ x² − " + a + "x − " + B ** n + " = 0. Vérifie chaque solution dans le domaine. c) Ici seul le produit doit être positif : le domaine est plus grand."],
          "a) " + M("x > 0") + " et " + M("x > " + a) + ". b) " + M("x^2 - " + a + "x - " + B ** n + " = (x - " + r + ")(x + " + -rej + ") = 0") + " : " + M(r) + " convient, " + M(rej) + " est rejetée. c) " + M("x(x - " + a + ") > 0") + " aussi pour " + M("x = " + rej) + " : 2 solutions (les deux équations ne sont pas équivalentes)."), { ctx: "base" + B });
      },
      () => { /* quotient : log_2(x + b) − log_2(x − a) = k */
        let x0, a, b, k; do { k = ri(1, 3); a = ri(1, 6); x0 = a + ri(1, 4); b = 2 ** k * (x0 - a) - x0; } while (b <= 0 || b > 30);
        return Object.assign(P("On résout " + M("\\log_2(x + " + b + ") - \\log_2(x - " + a + ") = " + k) + ".",
          [["a) Domaine : x doit être plus grand que", a], ["b) Solution", x0], ["c) Valeur de " + M("\\frac{x + " + b + "}{x - " + a + "}") + " pour cette solution", 2 ** k]],
          ["Domaine : x + " + b + " > 0 et x − " + a + " > 0. Puis log₂ u − log₂ v = log₂(u/v).", "(x + " + b + ") ÷ (x − " + a + ") = 2^" + k + " = " + 2 ** k + " : produit en croix."],
          "a) " + M("x > " + a) + " (alors " + M("x + " + b + " > 0") + " aussi). b) " + M("x + " + b + " = " + 2 ** k + "(x - " + a + ") \\iff " + (2 ** k - 1 === 1 ? "" : 2 ** k - 1) + "x = " + (b + 2 ** k * a)) + ", " + M("x = " + x0) + " (dans le domaine). c) " + M("\\frac{" + (x0 + b) + "}{" + (x0 - a) + "} = " + 2 ** k) + "."), { ctx: "quotient" });
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
    // ===================== 2e lot (24.11) : 1re–4e Collège et MP =====================
    // ---------- 1re Collège, MP : fonctions du 2e degré ----------
    f2expr: [
      () => { /* arche parabolique : choisir le repère, trouver a, puis calculer et résoudre */
        let p, q, H, d, d1;
        do { p = pk([4, 5, 6, 8, 10, 12]); q = pk([2, 4, 5, 8, 10]); H = (p * p) / q; d = ri(1, p - 2); d1 = ri(1, p - 1); } while (!Number.isInteger(H) || H < 4 || H > 36 || d === d1);
        const hd = H - (d * d) / q, h1 = H - (d1 * d1) / q;
        return P("Une arche de pont a la forme d'une parabole. Ses deux pieds sont au sol, à " + M(2 * p) + " m l'un de l'autre, et son sommet est à " + M(H) + " m de haut. On place l'origine au sol, au milieu des deux pieds.",
          [["a) Dans " + M("f(x) = a(x - " + p + ")(x + " + p + ")") + ", que vaut " + M("a") + " ? (fraction acceptée)", -1 / q],
           ["b) Un camion large de " + M(2 * d) + " m passe au milieu. Hauteur de l'arche au-dessus de ses bords (m)", hd],
           ["c) À quelle distance du milieu l'arche est-elle à " + M(D(h1)) + " m de haut ? (m)", d1]],
          ["Les pieds sont les zéros de f : x = −" + p + " et x = " + p + ". Le sommet est sur l'axe de symétrie, au point (0 ; " + H + ") : f(0) = " + H + " donne a.",
           "b) Les bords du camion sont à " + d + " m du milieu : calcule f(" + d + "). c) Résous f(x) = " + T(h1) + " : isole x², puis garde la distance positive."],
          M("f(0) = a \\cdot (-" + p + ") \\cdot " + p + " = -" + p * p + "a = " + H) + ", donc " + M("a = " + frac(-1, q)) + ". b) " + M("f(" + d + ") = " + frac(-1, q) + "(" + d + " - " + p + ")(" + d + " + " + p + ") = " + D(hd)) + " m. c) " + M(frac(-1, q) + "(x^2 - " + p * p + ") = " + D(h1) + " \\iff x^2 = " + d1 * d1) + " : " + M("x = " + d1) + " m de chaque côté du milieu.");
      },
      () => { /* sommet + un point → a, puis zéros, puis ordonnée à l'origine */
        let a, h, d, x1;
        do { a = pk([2, 3, -2, -3, 0.5, -0.5]); h = R.nz(-5, 5); d = ri(1, 4); x1 = h + R.nz(-3, 3); } while (Math.abs(x1 - h) === d || x1 === 0 || Math.abs(h) === d);
        const k = -a * d * d, y1 = a * (x1 - h) ** 2 + k, f0 = a * h * h + k;
        return P("Une parabole a pour sommet " + M("S(" + h + " \\,;\\, " + D(k) + ")") + " et passe par le point " + M("(" + x1 + " \\,;\\, " + D(y1) + ")") + ".",
          [["a) Coefficient " + M("a") + " de " + M("f(x) = a(x - h)^2 + k"), a],
           ["b) Zéros de " + M("f") + " (séparés par « ; »)", SET([h - d, h + d])],
           ["c) Ordonnée à l'origine " + M("f(0)"), f0]],
          ["Forme canonique avec le sommet : f(x) = a(" + xmT(h) + ")² " + (k < 0 ? "− " + T(-k) : "+ " + T(k)) + ". Remplace x et f(x) par les coordonnées du point pour trouver a.",
           "b) f(x) = 0 ⇔ (" + xmT(h) + ")² = " + T(-k) + " ÷ " + tT(a) + " : isole le carré, puis « ± ». c) Remplace x par 0."],
          "a) " + M("a \\cdot (" + x1 + " - " + pr(h) + ")^2" + sgD(k) + " = " + D(y1)) + ", soit " + M(D(a) + " \\cdot " + (x1 - h) ** 2 + sgD(k) + " = " + D(y1)) + " : " + M("a = " + D(a)) + ". b) " + M("(" + xm(h) + ")^2 = " + d * d) + ", " + M("x = " + h + " \\pm " + d) + " : " + M(h - d) + " et " + M(h + d) + ". c) " + M("f(0) = " + D(a) + " \\cdot " + pr(h) + "^2" + sgD(k) + " = " + D(f0)) + ".");
      },
    ],
    f2trois: [
      () => { /* trois points sans abscisse 0 : système 3 × 3, puis sommet */
        let a, h, k, xs;
        do { a = pk([1, 2, 3, -1, -2, -3]); h = R.nz(-4, 4); k = R.nz(-9, 9); xs = [...new Set([R.nz(-3, 4), R.nz(-3, 4), R.nz(-3, 4)])]; } while (xs.length < 3 || a * h * h + k === 0);
        xs.sort((u, v) => u - v);
        const b = -2 * a * h, c = a * h * h + k, f = (x) => a * x * x + b * x + c;
        const eq = (x) => M((x * x === 1 ? "" : x * x) + "a" + (x < 0 ? " - " + (x === -1 ? "" : -x) : " + " + (x === 1 ? "" : x)) + "b + c = " + f(x));
        return P("Une parabole " + M("f(x) = ax^2 + bx + c") + " passe par les points " + xs.map((x) => M("(" + x + " \\,;\\, " + f(x) + ")")).join(", ") + ".",
          [["a) " + M("a"), a], ["b) " + M("b"), b], ["c) " + M("c"), c], ["d) Ordonnée du sommet (valeur extrême de " + M("f") + ")", k]],
          ["Chaque point donne une équation a · x² + b · x + c = y. Aucune abscisse ne vaut 0 : c ne se lit pas directement. Soustrais les équations deux à deux pour éliminer c.",
           "Il reste un système 2 × 2 en a et b. Puis le sommet : x = −b ÷ (2a), et son ordonnée est f(−b ÷ (2a))."],
          xs.map(eq).join(" ; ") + ". En éliminant " + M("c") + " puis " + M("b") + " : a) " + M("a = " + a) + ", b) " + M("b = " + b) + ", c) " + M("c = " + c) + " : " + M("f(x) = " + poly([a, b, c])) + ". d) Sommet en " + M("x = \\frac{" + -b + "}{" + 2 * a + "} = " + h) + " : " + M("f(" + h + ") = " + k) + ".");
      },
      () => { /* pierre lancée depuis une falaise : trois mesures → modèle, puis zéro et sommet */
        const T0 = pk([4, 5, 6]), s = pk([0.2, 0.4, 0.6, 0.8]);
        const b = 5 * (T0 - s), c = 5 * T0 * s, h = (t) => -5 * t * t + b * t + c, tm = (T0 - s) / 2, hm = (5 * (T0 + s) ** 2) / 4;
        return P("Depuis le haut d'une falaise, on lance une pierre vers le haut ; elle retombe dans la mer. Sa hauteur au-dessus de la mer vaut " + M(D(h(1))) + " m après 1 s, " + M(D(h(2))) + " m après 2 s et " + M(D(h(3))) + " m après 3 s. On modélise par " + M("h(t) = at^2 + bt + c") + ".",
          [["a) Hauteur de la falaise (m)", c], ["b) Instant où la pierre touche la mer (s)", T0], ["c) Hauteur maximale atteinte (m, au centième)", hm, 0.01]],
          ["Trois équations : a + b + c = " + T(h(1)) + ", 4a + 2b + c = " + T(h(2)) + ", 9a + 3b + c = " + T(h(3)) + ". Soustrais-les deux à deux : c s'élimine, puis b. La hauteur de la falaise est h(0) = c.",
           "b) Résous h(t) = 0 (Δ) et garde la solution positive. c) Le sommet de la parabole est en t = −b ÷ (2a)."],
          M("a = -5") + ", " + M("b = " + D(b)) + ", " + M("c = " + D(c)) + ". a) " + M(D(c)) + " m. b) " + M("-5t^2 + " + D(b) + "t + " + D(c) + " = -5(t - " + T0 + ")(t + " + D(s) + ") = 0") + " : " + M("t = " + T0) + " s (" + M("-" + D(s)) + " est rejeté). c) " + M("t = \\frac{" + D(b) + "}{10} = " + D(tm)) + " s, " + M("h(" + D(tm) + ") = " + D(hm)) + " m.");
      },
    ],
    fimg: [
      () => { /* préimages (2e degré), image d'une image, nombre à une seule préimage, comptage */
        let p, q, e, x0, fx0;
        do { p = 2 * R.nz(-4, 4); q = R.nz(-9, 9); e = ri(2, 5); x0 = R.nz(-3, 3); fx0 = x0 * x0 + p * x0 + q; } while (Math.abs(fx0) > 12 || fx0 === x0 || fx0 === 0 || q === (p * p) / 4);
        const h = -p / 2, k = q - (p * p) / 4, v = k + e * e, f = (x) => x * x + p * x + q;
        return P("Soit " + M("f(x) = " + poly([1, p, q])) + ".",
          [["a) Préimages de " + M(v) + " (séparées par « ; »)", SET([h - e, h + e])], ["b) " + M("f(f(" + x0 + "))"), f(fx0)],
           ["c) Quel nombre a exactement une préimage par " + M("f") + " ?", k], ["d) Combien de nombres entiers " + M("x") + " ont une image strictement inférieure à " + M(v) + " ?", 2 * e - 1]],
          ["a) Résous f(x) = " + v + " : ramène tout d'un côté, puis factorise (ou Δ). b) Calcule d'abord f(" + x0 + "), puis l'image de ce résultat.",
           "c) Forme canonique f(x) = (" + xmT(h) + ")² " + (k < 0 ? "− " + -k : "+ " + k) + " : un nombre a une seule préimage s'il est atteint au sommet seulement. d) f(x) < " + v + " entre les deux préimages de " + v + " (parabole tournée vers le haut)."],
          "a) " + M(poly([1, p, q - v]) + " = 0 \\iff (" + xm(h - e) + ")(" + xm(h + e) + ") = 0") + " : " + M(h - e) + " et " + M(h + e) + ". b) " + M("f(" + x0 + ") = " + fx0) + ", " + M("f(" + fx0 + ") = " + f(fx0)) + ". c) " + M("f(x) = (" + xm(h) + ")^2" + sg(k)) + " : le minimum " + M(k) + " n'est atteint qu'en " + M("x = " + h) + ". d) Entiers strictement entre " + M(h - e) + " et " + M(h + e) + " : " + M(2 * e - 1) + ".");
      },
    ],
    /* 26.11 soir (agent defis3) : abscisse calculée hors du dessin et sens de l'inégalité tirés au hasard (avant : f(10) et f < g toujours). */
    lectgraph: [
      () => { /* lire le sommet et un point → expression, calculer hors du dessin, résoudre f = g et f < g (ou >, ≤, ≥) */
        let a, h, k, p, q, f, m, n0;
        do { a = pk([1, -1, 0.5, -0.5]); h = ri(-3, 3); k = ri(-4, 4); p = ri(-5, 3); q = ri(p + 2, 5);
          f = (x) => a * (x - h) ** 2 + k; m = (f(q) - f(p)) / (q - p); n0 = f(p) - m * p;
        } while (Math.abs(f(p)) > 5 || Math.abs(f(q)) > 5 || !Number.isInteger(f(p)) || !Number.isInteger(f(q)) || Math.abs(m) > 4 || (p === h && q === h) || a * k > 0 && Math.abs(k) > 3);
        const [op, cx] = pk([["<", "inf"], [">", "sup"], ["\\le", "infeg"], ["\\ge", "supeg"]]), below = op === "<" || op === "\\le", cl = op.length > 1, x1 = pk([-9, -8, -7, 7, 8, 9, 10]);
        const xp = q !== h ? q : p, g = (x) => m * x + n0, f10 = f(x1), ivs = (a > 0) === below ? [[p, cl, q, cl]] : [[-Infinity, false, p, cl], [q, cl, Infinity, false]];
        const fig = FIG.plot([{ f }, { f: g }], [], { numbers: true, xr: [-6, 6], yr: [-6, 6] });
        return Object.assign(P("Le graphique montre une parabole (fonction " + M("f") + ") et une droite (fonction " + M("g") + "). Le sommet et les points d'intersection sont sur le quadrillage.",
          [["a) " + M("f(x) = a(x - h)^2 + k") + " : que vaut " + M("a") + " ?", a], ["b) " + M("f(" + x1 + ")") + " (hors du dessin)", f10],
           ["c) Solutions de " + M("f(x) = g(x)") + " (séparées par « ; »)", SET([p, q])], ["d) Solutions de " + M("f(x) " + op + " g(x)") + " (intervalle" + (a > 0 === below ? "" : "s") + ")", SOLS(ivs)]],
          ["Lis le sommet S(h ; k), puis un autre point de la parabole sur le quadrillage (par exemple un point d'intersection) : remplace ses coordonnées dans f(x) = a(x − h)² + k pour trouver a.",
           "b) Avec l'expression trouvée, calcule f(" + x1 + "). c) Lis les abscisses des points d'intersection. d) f(x) " + (below ? "<" : ">") + " g(x) là où la parabole est " + (below ? "SOUS" : "AU-DESSUS DE") + " la droite (bornes " + (cl ? "comprises" : "exclues") + ")."],
          "Sommet " + M("S(" + h + " \\,;\\, " + k + ")") + ", point " + M("(" + xp + " \\,;\\, " + f(xp) + ")") + " : " + M(f(xp) + " = a \\cdot " + (xp - h) ** 2 + sg(k)) + ", a) " + M("a = " + D(a)) + ". b) " + M("f(" + x1 + ") = " + D(a) + " \\cdot " + (x1 - h) ** 2 + sg(k) + " = " + D(f10)) + ". c) " + M(p) + " et " + M(q) + ". d) " + M(SolSet.show(ivs, true)) + ".", fig), { ctx: cx });
      },
    ],
    interpar: [
      () => { /* deux paraboles : intersections, écart vertical maximal, décalage pour un seul point commun */
        let x1, x2, b, c;
        do { x1 = ri(-5, 2); x2 = ri(x1 + 2, 5); b = R.nz(-6, 6); c = R.nz(-8, 8); } while (x1 === 0 || x2 === 0 || b + 2 * (x1 + x2) === 0 || c - 2 * x1 * x2 === 0);
        const d = b + 2 * (x1 + x2), e = c - 2 * x1 * x2, gap = (x2 - x1) ** 2 / 2;
        return P("On donne " + M("f(x) = " + poly([1, b, c])) + " et " + M("g(x) = " + poly([-1, d, e])) + ".",
          [["a) Abscisses des points d'intersection des deux paraboles (séparées par « ; »)", SET([x1, x2])],
           ["b) Entre ces deux abscisses, plus grand écart vertical " + M("g(x) - f(x)"), gap],
           ["c) On décale " + M("g") + " verticalement : " + M("g(x) + t") + ". Pour quelle valeur de " + M("t") + " les deux courbes n'ont-elles plus qu'un seul point commun ?", -gap]],
          ["f(x) = g(x) : ramène tout d'un côté, tu obtiens 2x² … = 0 ; divise par 2 et factorise (ou Δ).",
           "b) g(x) − f(x) = −2(" + xmT(x1) + ")(" + xmT(x2) + ") : parabole tournée vers le bas, maximum au milieu des deux zéros. c) f(x) = g(x) + t ⇔ 2(" + xmT(x1) + ")(" + xmT(x2) + ") = t : un seul point quand t est la valeur minimale du membre de gauche (Δ = 0)."],
          "a) " + M(poly([2, -2 * (x1 + x2), 2 * x1 * x2]) + " = 0 \\iff 2(" + xm(x1) + ")(" + xm(x2) + ") = 0") + " : " + M(x1) + " et " + M(x2) + ". b) Au milieu, " + M("x = " + D((x1 + x2) / 2)) + " : " + M("-2 \\cdot " + pr(D((x1 - x2) / 2)) + " \\cdot " + D((x2 - x1) / 2) + " = " + D(gap)) + ". c) Minimum de " + M("2(" + xm(x1) + ")(" + xm(x2) + ")") + " : " + M("-" + D(gap)) + ", donc " + M("t = -" + D(gap)) + ".");
      },
    ],
    eqirr: [
      () => { /* √(x + a) = x − b : solution parasite, puis la même équation avec b − x */
        let b, j; do { b = ri(-2, 7); j = ri(1, 4); } while (b === 0 || j * j + j - b === 0);
        const a = j * j + j - b, s1 = b - j, s2 = b + 1 + j;
        return P("On résout " + M("\\sqrt{x" + sg(a) + "} = " + xm(b)) + ".",
          [["a) Solutions de l'équation obtenue en élevant les deux membres au carré (séparées par « ; »)", SET([s1, s2])],
           ["b) Solution(s) de l'équation de départ", SET([s2])],
           ["c) Solution(s) de " + M("\\sqrt{x" + sg(a) + "} = " + b + " - x"), SET([s1])]],
          ["Élève au carré : x " + (a < 0 ? "− " + -a : "+ " + a) + " = (" + xmT(b) + ")². Développe, ramène tout d'un côté et résous.",
           "Une racine carrée n'est jamais négative : il faut " + xmT(b) + " ≥ 0. Vérifie chaque solution dans l'équation de départ. c) Même équation au carré, mais il faut cette fois " + b + " − x ≥ 0."],
          "a) " + M("x" + sg(a) + " = " + poly([1, -2 * b, b * b]) + " \\iff " + poly([1, -(2 * b + 1), b * b - a]) + " = 0 \\iff (" + xm(s1) + ")(" + xm(s2) + ") = 0") + ". b) En " + M("x = " + s1) + ", " + M(s1 + " - " + pr(b) + " = " + (s1 - b) + " < 0") + " : solution parasite. Seul " + M(s2) + " convient (" + M("\\sqrt{" + (s2 + a) + "} = " + (s2 - b)) + "). c) Cette fois, " + M(s1) + " convient (" + M("\\sqrt{" + (s1 + a) + "} = " + (b - s1)) + ") et " + M(s2) + " est rejeté.");
      },
    ],
    sys3: [
      () => { /* trois groupes au cinéma : système 3 × 3 */
        const d3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        let A, E, K, rows;
        do { K = ri(12, 24) / 2; E = K + ri(2, 8) / 2; A = E + ri(2, 8) / 2;
          rows = [[ri(1, 3), ri(1, 3), ri(1, 4)], [ri(1, 3), 0, ri(1, 4)], [0, ri(1, 4), ri(1, 4)]]; } while (d3(rows) === 0);
        const tot = rows.map((r) => r[0] * A + r[1] * E + r[2] * K);
        const grp_ = (r) => [r[0] ? pl(r[0], "adulte") : "", r[1] ? pl(r[1], "étudiant") : "", r[2] ? pl(r[2], "enfant") : ""].filter(Boolean).join(", ");
        return P("Au cinéma, trois groupes ont payé : " + rows.map((r, i) => grp_(r) + " pour " + M(D(tot[i])) + " CHF").join(" ; ") + ". On cherche les prix " + M("a") + " (adulte), " + M("e") + " (étudiant) et " + M("k") + " (enfant).",
          [["a) Prix adulte (CHF)", A], ["b) Prix étudiant (CHF)", E], ["c) Prix enfant (CHF)", K]],
          ["Écris une équation par groupe. Le 2e groupe n'a pas d'étudiant, le 3e pas d'adulte : exprime a (2e équation) et e (3e équation) en fonction de k.",
           "Remplace a et e dans la 1re équation : il ne reste que k. Puis remonte."],
          rows.map((r, i) => M([[r[0], "a"], [r[1], "e"], [r[2], "k"]].filter(([c]) => c).map(([c, v]) => (c === 1 ? "" : c) + v).join(" + ") + " = " + D(tot[i]))).join(" ; ") + ". On trouve " + M("k = " + D(K)) + ", puis " + M("a = " + D(A)) + " et " + M("e = " + D(E)) + " (vérifie dans les trois équations).");
      },
      () => { /* nombre de trois chiffres : trois conditions */
        let a, b, c, k;
        do { a = ri(2, 9); c = ri(1, a - 1); k = ri(1, 6); b = a + c - k; } while (b < 0 || b > 9 || b === a || b === c);
        const s = a + b + c, Dd = 99 * (a - c), N = 100 * a + 10 * b + c;
        return P("Un nombre s'écrit avec trois chiffres. La somme de ses chiffres vaut " + M(s) + ". Le chiffre des dizaines est égal à la somme des deux autres chiffres diminuée de " + M(k) + ". Si on écrit ses chiffres dans l'ordre inverse, le nombre diminue de " + M(Dd) + ".",
          [["a) Chiffre des centaines", a], ["b) Chiffre des dizaines", b], ["c) Le nombre", N]],
          ["Avec c le chiffre des centaines, d celui des dizaines, u celui des unités : le nombre vaut 100c + 10d + u, et le nombre inversé 100u + 10d + c.",
           "La différence vaut 99(c − u) = " + Dd + ", donc c − u = " + Dd / 99 + ". La 2e condition, d = c + u − " + k + ", dans la 1re donne c + u."],
          M("c + d + u = " + s) + ", " + M("d = c + u - " + k) + ", " + M("99(c - u) = " + Dd) + ". Donc " + M("2(c + u) - " + k + " = " + s) + " : " + M("c + u = " + (a + c)) + " et " + M("c - u = " + (a - c)) + ". a) " + M("c = " + a) + ", " + M("u = " + c) + ". b) " + M("d = " + b) + ". c) " + M(N) + ".");
      },
    ],
    // ---------- 2e Collège, MP : équations trigonométriques ----------
    trigeq: [
      () => { /* équation du 2e degré en sin x ou cos x, une valeur parfois impossible */
        const V = [0.5, -0.5, 1, -1, 2, -2, 1.5, -1.5];
        let u1, u2, fn, sc, cs;
        do { u1 = pk(V); u2 = pk(V); fn = pk(["sin", "cos"]); } while (u1 === u2 || (Math.abs(u1) > 1 && Math.abs(u2) > 1));
        for (sc of [1, 2, 4]) { cs = [sc, -sc * (u1 + u2), sc * u1 * u2]; if (cs.every(Number.isInteger)) break; }
        const sol = (u) => (fn === "sin" ? { 1: [90], "-1": [270], 0.5: [30, 150], "-0.5": [210, 330] } : { 1: [0], "-1": [180], 0.5: [60, 300], "-0.5": [120, 240] })[u] || [];
        const xs = [...sol(u1), ...sol(u2)], F = "\\" + fn;
        const eqT = (cs[0] === 1 ? "" : cs[0]) + F + "^2 x" + (cs[1] ? (cs[1] < 0 ? " - " : " + ") + (Math.abs(cs[1]) === 1 ? "" : Math.abs(cs[1])) + F + " x" : "") + (cs[2] ? sg(cs[2]) : "") + " = 0";
        return P("On résout " + M(eqT) + " pour " + M("0° \\leq x < 360°") + ".",
          [["a) Solutions de l'équation en " + M("X = " + F + " x") + " (séparées par « ; », fractions acceptées)", SET([u1, u2])],
           ["b) Nombre de solutions " + M("x") + " dans " + M("[0° \\,;\\, 360°["), xs.length],
           ["c) Les solutions " + M("x") + " en degrés (séparées par « ; »)", SET(xs)]],
          ["Pose X = " + fn + " x : l'équation devient " + pT(cs).replace(/x/g, "X") + " = 0, du 2e degré. Résous-la (Δ ou factorisation).",
           "Puis " + fn + " x = X : impossible si X > 1 ou X < −1. Sinon, cercle trigonométrique : " + (fn === "sin" ? "sin x = X a deux solutions x et 180° − x (une seule si X = ±1)." : "cos x = X a deux solutions x et 360° − x (une seule si X = ±1).")],
          M(poly(cs, "X") + " = 0") + " : " + M("X = " + fx(Math.min(u1, u2))) + " ou " + M("X = " + fx(Math.max(u1, u2))) + ". " + [u1, u2].map((u) => Math.abs(u) > 1 ? M(F + " x = " + fx(u)) + " est impossible" : M(F + " x = " + fx(u)) + " donne " + sol(u).map((x) => M(x + "°")).join(" et ")).join(" ; ") + ". b) " + M(xs.length) + " solution" + (xs.length > 1 ? "s" : "") + ".");
      },
      () => { /* 2cos²x + K sin x + m = 0 : identité sin² + cos² = 1, puis 2e degré */
        const [u1, u2] = pk([[0.5, -2], [0.5, -1], [-0.5, 2], [-0.5, 1], [1, -1.5], [-1, 1.5]]), fn = pk(["sin", "cos"]), other = fn === "sin" ? "cos" : "sin";
        const K = 2 * (u1 + u2), m = -2 - 2 * u1 * u2;
        const sol = (u) => (fn === "sin" ? { 1: [90], "-1": [270], 0.5: [30, 150], "-0.5": [210, 330] } : { 1: [0], "-1": [180], 0.5: [60, 300], "-0.5": [120, 240] })[u] || [];
        const xs = [...sol(u1), ...sol(u2)], F = "\\" + fn;
        const eqT = "2\\" + other + "^2 x" + (K < 0 ? " - " : " + ") + (Math.abs(K) === 1 ? "" : Math.abs(K)) + F + " x" + (m ? sg(m) : "") + " = 0";
        return P("On résout " + M(eqT) + " pour " + M("0° \\leq x < 360°") + ".",
          [["a) Solutions de l'équation en " + M("X = " + F + " x") + " (séparées par « ; », fractions acceptées)", SET([u1, u2])],
           ["b) Nombre de solutions " + M("x") + " dans " + M("[0° \\,;\\, 360°["), xs.length],
           ["c) Les solutions " + M("x") + " en degrés (séparées par « ; »)", SET(xs)]],
          ["Deux fonctions différentes : remplace " + other + "² x par 1 − " + fn + "² x (car sin² x + cos² x = 1). Il ne reste que " + fn + " x.",
           "Pose X = " + fn + " x : 2X² " + (K > 0 ? "− " + K : "+ " + -K) + "X " + (2 + m > 0 ? "− " + (2 + m) : "+ " + -(2 + m)) + " = 0. Une des solutions en X peut être impossible (hors de [−1 ; 1])."],
          M("2(1 - " + F + "^2 x)" + (K < 0 ? " - " : " + ") + (Math.abs(K) === 1 ? "" : Math.abs(K)) + F + " x" + (m ? sg(m) : "") + " = 0 \\iff " + poly([2, -K, -(2 + m)], "X") + " = 0") + " : " + M("X = " + fx(u1)) + " ou " + M("X = " + fx(u2)) + ". " + [u1, u2].map((u) => Math.abs(u) > 1 ? M(F + " x = " + fx(u)) + " est impossible" : M(F + " x = " + fx(u)) + " donne " + sol(u).map((x) => M(x + "°")).join(" et ")).join(" ; ") + ".");
      },
    ],
    trigeq2: [
      () => { /* grande roue : modèle, hauteur, premier passage, durée au-dessus d'une hauteur */
        let r, d, Tp, t0, H2;
        do { r = pk([15, 20, 25, 30, 40]); d = r + ri(2, 6); Tp = pk([6, 8, 10, 12, 15, 20]); t0 = ri(1, Tp - 1); H2 = ri(d - r + 3, d + r - 3); } while (((360 * t0) / Tp) % 90 === 0 || H2 === d);
        const w = 360 / Tp, ht = d - r * Math.cos(rad(w * t0)), th = deg(Math.acos((d - H2) / r)), tb = th / w, dur = (360 - 2 * th) / w;
        return P("Une grande roue a un rayon de " + M(r) + " m ; son axe est à " + M(d) + " m du sol et elle fait un tour en " + M(Tp) + " min. Une cabine part du point le plus bas à " + M("t = 0") + ". Sa hauteur vaut " + M("h(t) = " + d + " - " + r + "\\cos(\\omega t)") + " (m, " + M("t") + " en min, angle en degrés).",
          [["a) " + M("\\omega") + " (degrés par minute)", w], ["b) Hauteur de la cabine à " + M("t = " + t0) + " min (m, au dixième)", ht, 0.1],
           ["c) Premier instant où la cabine atteint " + M(H2) + " m (min, au dixième)", tb, 0.1], ["d) Pendant un tour, durée passée au-dessus de " + M(H2) + " m (min, au dixième)", dur, 0.1]],
          ["Un tour complet (360°) dure " + Tp + " min : ω = 360 ÷ " + Tp + ". Puis remplace t dans h(t).",
           "c) h(t) = " + H2 + " ⇔ cos(ωt) = (" + d + " − " + H2 + ") ÷ " + r + " : l'angle vaut arccos(…), puis t = angle ÷ ω. d) La cabine est au-dessus entre les angles θ et 360° − θ."],
          "a) " + M("\\omega = 360 \\div " + Tp + " = " + D(w)) + ". b) " + M("h(" + t0 + ") = " + d + " - " + r + "\\cos(" + D(w * t0) + "°) \\approx " + D(r1(ht))) + " m. c) " + M("\\cos\\theta = " + frac(d - H2, r)) + ", " + M("\\theta \\approx " + D(r2c(th)) + "°") + ", " + M("t \\approx " + D(r2c(th)) + " \\div " + D(w) + " \\approx " + D(r1(tb))) + " min. d) " + M("(360° - 2\\theta) \\div " + D(w) + " \\approx " + D(r1(dur))) + " min.");
      },
      () => { /* marée : modèle cosinus, durée où le bateau peut passer */
        let hn, hm, th, p;
        do { hn = ri(4, 20) / 10; hm = hn + ri(20, 60) / 10; th = ri(1, 9); p = ri(Math.round(hn * 10) + 3, Math.round(hm * 10) - 3) / 10; } while (Math.abs(p - (hm + hn) / 2) < 0.05);
        const d = (hm + hn) / 2, A = (hm - hn) / 2, c = (p - d) / A, ang = deg(Math.acos(c)), dur = (2 * ang) / 30, tq = th + ang / 30;
        return P("Dans un port, la marée haute (" + M(D(hm)) + " m d'eau) a lieu à " + M(th) + " h, la marée basse (" + M(D(hn)) + " m) six heures plus tard. On modélise la hauteur d'eau par " + M("h(t) = d + A\\cos\\big(30(t - " + th + ")\\big)") + " (m, " + M("t") + " en heures, angle en degrés). Un bateau a besoin d'au moins " + M(D(p)) + " m d'eau.",
          [["a) " + M("d") + " (m)", d], ["b) " + M("A") + " (m)", A], ["c) Durée (h, au centième) pendant laquelle le bateau peut naviguer, entre deux marées basses", dur, 0.01], ["d) Heure (au centième) à laquelle il doit être sorti, après la marée haute de " + th + " h", tq, 0.01]],
          ["d est le niveau moyen, A la moitié de l'écart entre marée haute et marée basse.",
           "h(t) ≥ " + T(p) + " ⇔ cos(30(t − " + th + ")) ≥ (" + T(p) + " − d) ÷ A. Avec θ = arccos(…), il faut −θ ≤ 30(t − " + th + ") ≤ θ."],
          "a) " + M("d = \\frac{" + D(hm) + " + " + D(hn) + "}{2} = " + D(d)) + ". b) " + M("A = \\frac{" + D(hm) + " - " + D(hn) + "}{2} = " + D(A)) + ". c) " + M("\\cos\\theta = \\frac{" + D(p) + " - " + D(d) + "}{" + D(A) + "}") + ", " + M("\\theta \\approx " + D(r2c(ang)) + "°") + " : durée " + M("\\frac{2\\theta}{30} \\approx " + D(r2c(dur))) + " h. d) " + M(th + " + \\frac{\\theta}{30} \\approx " + D(r2c(tq))) + " h.");
      },
    ],
    // ---------- 3e Collège : dérivées ----------
    derivregles: [
      () => { /* tangentes parallèles à une droite, tangente, pente minimale */
        let a1, a2, m, d0; do { a1 = ri(-4, 2); a2 = ri(a1 + 2, 5); m = R.nz(-6, 6); d0 = R.nz(-9, 9); } while ((a1 + a2) % 2 !== 0 || 3 * a1 * a2 + m === 0 || a1 + a2 === 0 || a1 * a2 === 0 || m === 3 * ((a2 - a1) / 2) ** 2);
        const B = -1.5 * (a1 + a2), C = 3 * a1 * a2 + m, f = (x) => x ** 3 + B * x * x + C * x + d0, mn = m - 3 * ((a2 - a1) / 2) ** 2, n2 = f(a2) - m * a2;
        return P("Soit " + M("f(x) = " + poly([1, B, C, d0])) + ".",
          [["a) Abscisses des points où la tangente est parallèle à la droite " + M("y = " + poly([m, 0])) + " (séparées par « ; »)", SET([a1, a2])],
           ["b) Ordonnée à l'origine de la tangente au point d'abscisse " + M(a2), n2], ["c) Plus petite pente possible d'une tangente au graphe de " + M("f"), mn]],
          ["Deux droites parallèles ont la même pente : résous f'(x) = " + m + ", avec f'(x) = 3x² " + (2 * B < 0 ? "− " + -2 * B : "+ " + 2 * B) + "x " + (C < 0 ? "− " + -C : "+ " + C) + ".",
           "b) Tangente : y = f'(" + a2 + ")(x − " + tT(a2) + ") + f(" + a2 + "), puis x = 0. c) f'(x) est un trinôme tourné vers le haut : sa plus petite valeur est à son sommet."],
          "a) " + M(poly([3, 2 * B, C]) + " = " + m + " \\iff " + poly([3, 2 * B, 3 * a1 * a2]) + " = 0 \\iff 3(" + xm(a1) + ")(" + xm(a2) + ") = 0") + ". b) " + M("f(" + a2 + ") = " + f(a2)) + ", " + M("y = " + m + "(" + xm(a2) + ")" + sg(f(a2)) + " = " + poly([m, n2])) + " : " + M(n2) + ". c) Sommet de " + M("f'") + " en " + M("x = " + D((a1 + a2) / 2)) + " : " + M("f'(" + D((a1 + a2) / 2) + ") = " + D(mn)) + ".");
      },
    ],
    derivcomp: [
      () => { /* dérivée de √(ax + b) : pente, tangente, point de pente donnée */
        let a, b, xs;
        do { a = ri(2, 6); b = R.nz(-9, 9); xs = []; for (let x = -4; x <= 20; x++) { const v = a * x + b, s = Math.round(Math.sqrt(Math.max(v, 0))); if (v > 0 && s * s === v && x !== 0) xs.push([x, s]); } } while (xs.length < 2);
        let i, j; do { i = ri(0, xs.length - 1); j = ri(0, xs.length - 1); } while (i === j || 2 * xs[i][1] ** 2 === a * xs[i][0] || a === 2 * xs[i][1]);
        const [x0, q] = xs[i], [x1, m] = xs[j], n0 = q - (a * x0) / (2 * q);
        return P("Soit " + M("f(x) = \\sqrt{" + poly([a, b]) + "}") + ".",
          [["a) " + M("f'(" + x0 + ")") + " (fraction acceptée)", a / (2 * q)], ["b) Ordonnée à l'origine de la tangente au point d'abscisse " + M(x0) + " (fraction acceptée)", n0],
           ["c) Abscisse du point où la tangente a une pente de " + M(frac(a, 2 * m)), x1]],
          ["Dérivée d'une composée : (√u)' = u' ÷ (2√u), avec u = " + pT([a, b]) + " et u' = " + a + ".",
           "b) Tangente : y = f'(" + x0 + ")(x − " + tT(x0) + ") + f(" + x0 + "), puis x = 0. c) Résous " + a + " ÷ (2√(" + pT([a, b]) + ")) = " + a / gcd(a, 2 * m) + "/" + (2 * m) / gcd(a, 2 * m) + " : d'abord √(…) = " + m + "."],
          M("f'(x) = \\frac{" + a + "}{2\\sqrt{" + poly([a, b]) + "}}") + ". a) " + M("f(" + x0 + ") = \\sqrt{" + q * q + "} = " + q) + ", " + M("f'(" + x0 + ") = \\frac{" + a + "}{" + 2 * q + "}" + (gcd(a, 2 * q) > 1 ? " = " + frac(a, 2 * q) : "")) + ". b) " + M("y = " + frac(a, 2 * q) + "(" + xm(x0) + ") + " + q) + " : en " + M("x = 0") + ", " + M("y = " + frac(2 * q * q - a * x0, 2 * q)) + ". c) " + M("\\sqrt{" + poly([a, b]) + "} = " + m + " \\iff " + poly([a, b]) + " = " + m * m + " \\iff x = " + x1) + ".");
      },
    ],
    derivprodquot: [
      () => { /* (x² + c) ÷ (x − p) : extremums, et maximum local plus petit que le minimum local */
        let a1, a2; do { a1 = ri(-5, 3); a2 = ri(a1 + 2, 7); } while ((a1 + a2) % 2 !== 0 || a1 * a2 === 0 || a1 + a2 === 0);
        const p = (a1 + a2) / 2, c = -a1 * a2;
        return P("Soit " + M("f(x) = \\frac{x^2" + sg(c) + "}{" + xm(p) + "}") + ", pour " + M("x \\neq " + p) + ".",
          [["a) Abscisses où " + M("f'(x) = 0") + " (séparées par « ; »)", SET([a1, a2])], ["b) Valeur du maximum local", 2 * a1], ["c) Valeur du minimum local", 2 * a2]],
          ["Dérivée d'un quotient : (u ÷ v)' = (u'v − uv') ÷ v². Le dénominateur (" + xmT(p) + ")² est positif : le signe de f' est celui du numérateur.",
           "Numérateur : 2x(" + xmT(p) + ") − (x² " + (c < 0 ? "− " + -c : "+ " + c) + ") = x² " + (p > 0 ? "− " + 2 * p : "+ " + -2 * p) + "x " + (c > 0 ? "− " + c : "+ " + -c) + ". Tableau de signes, sans oublier la valeur interdite " + p + "."],
          M("f'(x) = \\frac{" + poly([1, -2 * p, -c]) + "}{(" + xm(p) + ")^2} = \\frac{(" + xm(a1) + ")(" + xm(a2) + ")}{(" + xm(p) + ")^2}") + ". a) " + M(a1) + " et " + M(a2) + ". " + M("f'") + " est positive, négative, (valeur interdite " + M(p) + "), négative, positive. b) Maximum local " + M("f(" + a1 + ") = \\frac{" + (a1 * a1 + c) + "}{" + (a1 - p) + "} = " + 2 * a1) + ". c) Minimum local " + M("f(" + a2 + ") = \\frac{" + (a2 * a2 + c) + "}{" + (a2 - p) + "} = " + 2 * a2) + " : le maximum local est plus petit que le minimum local (deux branches séparées par la valeur interdite).");
      },
      () => { /* concentration d'un médicament : maximum, puis durée au-dessus d'un seuil */
        const [b, t1, t2] = pk([[6, 4, 9], [6, 3, 12], [6, 2, 18], [4, 2, 8], [10, 5, 20], [10, 4, 25], [12, 8, 18], [12, 9, 16], [12, 6, 24], [8, 4, 16], [9, 3, 27]]), k = ri(2, 6);
        const a = k * (t1 + t2), Cm = a / (2 * b);
        return P("Après une prise de médicament, la concentration dans le sang vaut " + M("C(t) = \\frac{" + a + "t}{t^2 + " + b * b + "}") + " (mg/L, " + M("t") + " en heures). Le traitement est efficace tant que " + M("C(t) \\geq " + k) + " mg/L.",
          [["a) Instant où la concentration est maximale (h)", b], ["b) Concentration maximale (mg/L, au centième)", Cm, 0.01], ["c) Pendant combien d'heures le traitement est-il efficace ?", t2 - t1]],
          ["Dérivée d'un quotient : le numérateur de C'(t) vaut " + a + "(t² + " + b * b + ") − " + a + "t · 2t = " + a + "(" + b * b + " − t²).",
           "c) Le dénominateur est positif : C(t) ≥ " + k + " ⇔ " + a + "t ≥ " + k + "(t² + " + b * b + "). Ramène tout d'un côté, divise par " + k + ", factorise."],
          "a) " + M("C'(t) = \\frac{" + a + "(" + b * b + " - t^2)}{(t^2 + " + b * b + ")^2}") + " s'annule en " + M("t = " + b) + " (positive avant, négative après). b) " + M("C(" + b + ") = \\frac{" + a * b + "}{" + 2 * b * b + "} \\approx " + D(r2c(Cm))) + " mg/L. c) " + M("t^2 - " + (t1 + t2) + "t + " + b * b + " \\leq 0 \\iff (t - " + t1 + ")(t - " + t2 + ") \\leq 0") + " : de " + M(t1) + " h à " + M(t2) + " h, soit " + M(t2 - t1) + " h.");
      },
    ],
    derivref: [
      () => { /* B(x) = a√x − bx : maximum, pente, zéro */
        let b, m, n; do { b = ri(1, 4); m = ri(2, 6); n = ri(1, 7); } while (n === m);
        const a = 2 * b * m;
        return P("Le bénéfice d'une petite entreprise (milliers de CHF) dépend de son budget de publicité " + M("x") + " (milliers de CHF) : " + M("B(x) = " + a + "\\sqrt{x}" + (b === 1 ? " - x" : " - " + b + "x")) + ".",
          [["a) Budget qui donne le plus grand bénéfice", m * m], ["b) Bénéfice maximal", b * m * m], ["c) " + M("B'(" + n * n + ")") + " (fraction acceptée)", (b * (m - n)) / n], ["d) Budget non nul pour lequel le bénéfice est nul", 4 * m * m]],
          ["(√x)' = 1 ÷ (2√x), donc B'(x) = " + a + " ÷ (2√x) − " + b + " = " + a / 2 + " ÷ √x − " + b + ".",
           "B'(x) = 0 ⇔ √x = " + a / 2 + " ÷ " + b + ". d) " + a + "√x = " + (b === 1 ? "" : b) + "x : divise par √x (x ≠ 0)."],
          M("B'(x) = \\frac{" + a / 2 + "}{\\sqrt{x}} - " + b) + ". a) " + M("\\sqrt{x} = " + m) + ", " + M("x = " + m * m) + " (B' positive avant, négative après). b) " + M("B(" + m * m + ") = " + a + " \\cdot " + m + " - " + b * m * m + " = " + b * m * m) + ". c) " + M("\\frac{" + a / 2 + "}{" + n + "} - " + b + " = " + frac(b * (m - n), n)) + ". d) " + M("\\sqrt{x} = " + 2 * m) + ", " + M("x = " + 4 * m * m) + ".");
      },
    ],
    tangente: [
      () => { /* tangente, puis triangle formé avec les axes */
        let a, b, c, x0, s, n;
        do { a = pk([1, -1, 2, -2, 0.5]); b = R.nz(-6, 6); c = R.nz(-8, 8); x0 = R.nz(-3, 3); s = 2 * a * x0 + b; n = c - a * x0 * x0; } while (s === 0 || n === 0);
        const y0 = a * x0 * x0 + b * x0 + c, A = (n * n) / (2 * Math.abs(s));
        return P("On trace la tangente à la courbe de " + M("f(x) = " + poly([a, b, c])) + " au point d'abscisse " + M(x0) + ".",
          [["a) Pente de la tangente", s], ["b) Ordonnée à l'origine de la tangente", n], ["c) Aire du triangle formé par la tangente et les deux axes (fraction acceptée)", A]],
          ["Pente = f'(" + x0 + "). Tangente : y = f'(" + x0 + ")(x − " + tT(x0) + ") + f(" + x0 + ").",
           "c) La tangente coupe l'axe vertical en son ordonnée à l'origine et l'axe horizontal là où y = 0 : triangle rectangle, aire = ½ · base · hauteur (longueurs positives)."],
          "a) " + M("f'(x) = " + poly([2 * a, b]) + "") + ", " + M("f'(" + x0 + ") = " + s) + ". b) " + M("f(" + x0 + ") = " + D(y0)) + ", " + M("y = " + s + "(" + xm(x0) + ")" + sgD(y0) + " = " + poly([s, n])) + ". c) Zéro : " + M("x = \\frac{" + D(-n) + "}{" + s + "}") + " ; aire " + M("\\frac{1}{2} \\cdot " + D(Math.abs(n)) + " \\cdot \\frac{" + D(Math.abs(n)) + "}{" + Math.abs(s) + "} = \\frac{" + D(n * n) + "}{" + 2 * Math.abs(s) + "}" + (Number.isInteger(n * n) && gcd(n * n, 2 * Math.abs(s)) > 1 ? " = " + frac(n * n, 2 * Math.abs(s)) : "")) + ".");
      },
      () => { /* deux tangentes issues d'un point extérieur */
        let a, c, t1, t2; do { a = pk([1, 2, -1, 0.5]); c = ri(-5, 5); t1 = ri(-4, 2); t2 = ri(t1 + 1, 5); } while (false);
        const p = (t1 + t2) / 2, q = c + a * t1 * t2, s1 = 2 * a * t1, s2 = 2 * a * t2;
        let ang = Math.abs(deg(Math.atan(s1)) - deg(Math.atan(s2))); if (ang > 90) ang = 180 - ang;
        return P("Par le point " + M("P(" + D(p) + " \\,;\\, " + D(q) + ")") + ", on mène les deux tangentes à la courbe de " + M("f(x) = " + poly([a, 0, c])) + ".",
          [["a) Abscisses des points de contact (séparées par « ; »)", SET([t1, t2])], ["b) Pente de la tangente au point de contact le plus à droite", s2], ["c) Angle aigu entre les deux tangentes (°, au dixième)", ang, 0.1]],
          ["Appelle t l'abscisse du point de contact : la tangente a pour équation y = f'(t)(x − t) + f(t). Elle doit passer par P.",
           "Remplace x et y par les coordonnées de P : équation du 2e degré en t. c) L'angle d'une droite de pente s avec l'axe horizontal vaut arctan s ; fais la différence."],
          "Tangente en " + M("t") + " : " + M("y = " + cfD(2 * a) + "t(x - t)" + (a < 0 ? " - " : " + ") + cfD(Math.abs(a)) + "t^2" + (c ? sg(c) : "")) + ". Par " + M("P") + " : " + M(poly([a, -2 * a * p, a * t1 * t2], "t") + " = 0") + ", a) " + M("t = " + t1) + " ou " + M("t = " + t2) + ". b) " + M("f'(" + t2 + ") = " + s2) + ". c) Pentes " + M(D(s1)) + " et " + M(D(s2)) + " : " + M("|\\arctan(" + D(s1) + ") - \\arctan(" + D(s2) + ")|") + ", angle aigu " + M("\\approx " + D(r1(ang)) + "°") + ".");
      },
    ],
    variations: [
      () => { /* extremums d'une cubique, puis nombre de k pour trois solutions */
        let a1, a2, sgn, d0; do { a1 = ri(-4, 2); a2 = ri(a1 + 2, 4); sgn = pk([1, -1]); d0 = R.nz(-9, 9); } while ((a1 + a2) % 2 !== 0);
        const cs = [sgn, -1.5 * sgn * (a1 + a2), 3 * sgn * a1 * a2, d0], f = (x) => cs[0] * x ** 3 + cs[1] * x * x + cs[2] * x + cs[3];
        const xM = sgn > 0 ? a1 : a2, xm_ = sgn > 0 ? a2 : a1, vM = f(xM), vm = f(xm_);
        return P("Soit " + M("f(x) = " + poly(cs)) + ".",
          [["a) Abscisse du maximum local", xM], ["b) Valeur du maximum local", vM], ["c) Pour combien de nombres entiers " + M("k") + " l'équation " + M("f(x) = k") + " a-t-elle trois solutions ?", vM - vm - 1]],
          ["f'(x) = " + pT([3 * cs[0], 2 * cs[1], cs[2]]) + " : factorise, puis tableau de signes de f' et des variations de f.",
           "c) Une droite horizontale y = k coupe la courbe trois fois quand k est strictement entre le minimum local et le maximum local."],
          M("f'(x) = " + poly([3 * cs[0], 2 * cs[1], cs[2]]) + " = " + (sgn > 0 ? "" : "-") + "3(" + xm(a1) + ")(" + xm(a2) + ")") + ". a) Maximum local en " + M("x = " + xM) + ". b) " + M("f(" + xM + ") = " + vM) + ". c) Minimum local " + M("f(" + xm_ + ") = " + vm) + " : trois solutions pour " + M(vm + " < k < " + vM) + ", soit " + M(vM - vm - 1) + " entiers.");
      },
    ],
    nbderive: [
      () => { /* quotient de Newton d'un trinôme : valeur, limite, et h pour une valeur donnée */
        let a, b, c, x0, h1, h2; do { a = pk([1, 2, 3, -1, -2]); b = R.nz(-6, 6); c = ri(-5, 5); x0 = R.nz(-3, 4); h1 = pk([0.1, 0.2, 0.5, -0.1]); h2 = pk([0.25, 0.5, 2, 3, -0.5]); } while (2 * a * x0 + b === 0);
        const fp = 2 * a * x0 + b, Qt = fp + a * h2;
        return P("On étudie " + M("f(x) = " + poly([a, b, c])) + " au point d'abscisse " + M(x0) + ", avec le quotient " + M("Q(h) = \\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h}") + ".",
          [["a) " + M("Q(" + D(h1) + ")"), fp + a * h1], ["b) " + M("f'(" + x0 + ")") + " (limite de " + M("Q(h)") + " quand " + M("h \\to 0") + ")", fp], ["c) Pour quelle valeur de " + M("h") + " a-t-on " + M("Q(h) = " + D(Qt)) + " ?", h2]],
          ["Développe f(" + x0 + " + h) − f(" + x0 + ") : tous les termes sans h s'éliminent. Divise par h (h ≠ 0).",
           "Tu dois obtenir Q(h) = " + fp + (a < 0 ? " − " : " + ") + (Math.abs(a) === 1 ? "" : Math.abs(a)) + "h. b) Fais tendre h vers 0. c) Résous Q(h) = " + T(Qt) + "."],
          M("f(" + x0 + " + h) - f(" + x0 + ") = " + poly([a, fp, 0], "h")) + ", donc " + M("Q(h) = " + poly([a, fp], "h")) + ". a) " + M(D(fp + a * h1)) + ". b) " + M(fp) + ". c) " + M(poly([a, fp], "h") + " = " + D(Qt) + " \\iff h = " + D(h2)) + ".");
      },
      () => { /* quotient de Newton de k ÷ x */
        let k, x0, h1, N; do { k = ri(2, 12); x0 = ri(1, 5); h1 = ri(1, 3); N = x0 + ri(2, 7); } while (N === x0 + h1);
        return P("On étudie " + M("f(x) = \\frac{" + k + "}{x}") + " au point d'abscisse " + M(x0) + ", avec le quotient " + M("Q(h) = \\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h}") + ". (fractions acceptées)",
          [["a) " + M("Q(" + h1 + ")"), -k / (x0 * (x0 + h1))], ["b) " + M("f'(" + x0 + ")"), -k / (x0 * x0)], ["c) Pour quelle valeur de " + M("h") + " a-t-on " + M("Q(h) = " + frac(-k, x0 * N)) + " ?", N - x0]],
          ["Mets " + k + " ÷ (" + x0 + " + h) − " + k + " ÷ " + x0 + " au même dénominateur, puis divise par h.",
           "Q(h) = −" + k + " ÷ (" + x0 + " · (" + x0 + " + h)). b) Fais tendre h vers 0. c) Compare les dénominateurs : " + x0 + "(" + x0 + " + h) = " + x0 * N + "."],
          M("\\frac{" + k + "}{" + x0 + " + h} - \\frac{" + k + "}{" + x0 + "} = \\frac{-" + k + "h}{" + x0 + "(" + x0 + " + h)}") + ", donc " + M("Q(h) = \\frac{-" + k + "}{" + x0 + "(" + x0 + " + h)}") + ". a) " + M(frac(-k, x0 * (x0 + h1))) + ". b) " + M(frac(-k, x0 * x0)) + ". c) " + M(x0 + " + h = " + N) + ", " + M("h = " + (N - x0)) + ".");
      },
    ],
    tauxvar: [
      () => { /* vitesse moyenne, instant où la vitesse instantanée l'égale, vitesse moyenne depuis le départ */
        /* 26.11 soir (revue des élèves joués, n° 6 : « démarre » à 8 m/s, 73 m/s soit 263 km/h) : accélération réaliste
           (a ≤ 1,5), vitesse moyenne visée en c) ≤ 20 m/s, vitesse instantanée ≤ 35 m/s (126 km/h) ; « accélère ». */
        let a, b, t1, t2, Tm; do { a = pk([0.5, 1, 1.5]); b = ri(1, 9); t1 = ri(1, 5); t2 = t1 + ri(2, 7); Tm = ri(5, 15); } while (Tm === t2 || Tm === t1 || a * Tm + b > 20 || 2 * a * Math.max(t2, Tm) + b > 35);
        const vm = a * (t1 + t2) + b, V = a * Tm + b, d = (t) => a * t * t + b * t;
        return P("Une voiture accélère ; depuis l'instant " + M("t = 0") + ", elle a parcouru " + M("d(t) = " + poly([a, b, 0], "t")) + " mètres après " + M("t") + " secondes.",
          [["a) Vitesse moyenne entre " + M(t1) + " s et " + M(t2) + " s (m/s)", vm], ["b) À quel instant la vitesse instantanée est-elle égale à cette vitesse moyenne ? (s)", (t1 + t2) / 2],
           ["c) Après combien de secondes la vitesse moyenne depuis le départ atteint-elle " + M(D(V)) + " m/s ?", Tm]],
          ["Vitesse moyenne = (d(" + t2 + ") − d(" + t1 + ")) ÷ (" + t2 + " − " + t1 + "). Vitesse instantanée = d'(t).",
           "b) Résous d'(t) = vitesse moyenne trouvée. c) Vitesse moyenne entre 0 et T : d(T) ÷ T ; simplifie par T, puis résous."],
          "a) " + M("\\frac{" + D(d(t2)) + " - " + D(d(t1)) + "}{" + (t2 - t1) + "} = " + D(vm)) + " m/s. b) " + M("d'(t) = " + poly([2 * a, b], "t") + " = " + D(vm) + " \\iff t = " + D((t1 + t2) / 2)) + " s, le milieu de l'intervalle. c) " + M("\\frac{d(T)}{T} = " + poly([a, b], "T") + " = " + D(V) + " \\iff T = " + Tm) + " s.");
      },
    ],
    // ---------- 4e Collège : intégrales ----------
    integrale: [
      () => { /* débit d'une source : volume, débit moyen, instant où débit instantané = débit moyen */
        let k, Tt; do { k = pk([1, 2, 3, 0.5]); Tt = pk([3, 6, 9, 12]); } while (k * Tt ** 3 / 6 > 900);
        const V = (k * Tt ** 3) / 6, dm = V / Tt, t1 = Tt / 2 - (Tt * Math.sqrt(3)) / 6;
        return P("Pendant un orage, un ruisseau a un débit de " + M("r(t) = " + poly([-k, k * Tt, 0], "t")) + " litres par minute, pour " + M("t") + " de " + M(0) + " à " + M(Tt) + " min.",
          [["a) Volume d'eau écoulé pendant ces " + Tt + " minutes (L)", V], ["b) Débit moyen (L/min)", dm], ["c) Premier instant où le débit est égal au débit moyen (min, au centième)", t1, 0.01]],
          ["Volume = intégrale du débit de 0 à " + Tt + ". Primitive de " + pT([-k, k * Tt, 0]).replace(/x/g, "t") + " : " + fxT(-k / 3) + " t³ + " + fxT((k * Tt) / 2) + " t².",
           "Débit moyen = volume ÷ durée. c) Résous r(t) = débit moyen : équation du 2e degré, garde la plus petite solution."],
          "a) " + M("\\int_0^{" + Tt + "} r(t)\\,dt = \\Big[-" + (k === 3 ? "" : fx(k / 3)) + "t^3 + " + fx((k * Tt) / 2) + "t^2\\Big]_0^{" + Tt + "} = " + D(V)) + " L. b) " + M(D(V) + " \\div " + Tt + " = " + D(dm)) + " L/min. c) " + M(poly([-k, k * Tt, -dm], "t") + " = 0") + " : " + M("t = \\frac{" + Tt + "}{2} - \\frac{" + Tt + "\\sqrt{3}}{6} \\approx " + D(r2c(t1))) + " min.");
      },
      () => { /* freinage : durée, distance, décélération pour une distance donnée */
        let v0, a, a2, D2; do { v0 = ri(12, 30); a = pk([4, 5, 6, 8]); a2 = pk([3, 3.5, 4, 4.5, 5, 6, 6.5, 7, 7.5, 9]); D2 = (v0 * v0) / (2 * a2); } while (a2 === a || Math.abs(D2 * 100 - Math.round(D2 * 100)) > 1e-9);
        const tf = v0 / a, dist = (v0 * v0) / (2 * a);
        return P("Une voiture roule à " + M(v0) + " m/s et freine : sa vitesse vaut " + M("v(t) = " + v0 + " - " + a + "t") + " (m/s) jusqu'à l'arrêt.",
          [["a) Durée du freinage (s, au centième)", tf, 0.01], ["b) Distance de freinage (m, au centième)", dist, 0.01], ["c) Quelle décélération (m/s²) faudrait-il pour s'arrêter en " + M(D(D2)) + " m ?", a2]],
          ["Arrêt : v(t) = 0. Distance = intégrale de la vitesse, de 0 jusqu'à l'arrêt.",
           "c) Avec v(t) = " + v0 + " − ct : arrêt en " + v0 + " ÷ c, distance " + v0 + "² ÷ (2c). Résous " + v0 * v0 + " ÷ (2c) = " + T(D2) + "."],
          "a) " + M(v0 + " - " + a + "t = 0 \\iff t = " + fx(tf)) + " s. b) " + M("\\int_0^{" + fx(tf) + "} (" + v0 + " - " + a + "t)\\,dt = \\Big[" + v0 + "t - " + fx(a / 2) + "t^2\\Big]_0^{" + fx(tf) + "} = " + frac(v0 * v0, 2 * a) + " \\approx " + D(r2c(dist))) + " m. c) " + M("\\frac{" + v0 * v0 + "}{2c} = " + D(D2) + " \\iff c = " + D(a2)) + " m/s².");
      },
    ],
    primitives: [
      () => { /* accélération → vitesse → position */
        const m = ri(1, 3), v0 = 3 * m * m + ri(2, 12), Tt = pk([m + 1, m + 3, m + 4].filter((t) => t !== 2 * m));
        const vT = 3 * Tt * Tt - 6 * m * Tt + v0, xT = Tt ** 3 - 3 * m * Tt * Tt + v0 * Tt;
        return P("Au labo de physique, un petit chariot roule sur un rail rectiligne. Son accélération vaut " + M("a(t) = 6t - " + 6 * m) + " (cm/s²), sa vitesse au départ " + M(v0) + " cm/s ; il part de la position " + M(0) + ".", /* 26.11 (vraisemblance) : chariot de labo en cm/s (et non 50 m/s) */
          [["a) Vitesse à " + M("t = " + Tt) + " s (cm/s)", vT], ["b) Position à " + M("t = " + Tt) + " s (cm)", xT], ["c) Vitesse minimale du chariot (cm/s)", v0 - 3 * m * m]],
          ["La vitesse est une primitive de l'accélération, avec v(0) = " + v0 + ". La position est une primitive de la vitesse, avec x(0) = 0.",
           "v(t) = 3t² − " + 6 * m + "t + " + v0 + ". c) La vitesse est minimale quand sa dérivée, a(t), s'annule."],
          M("v(t) = 3t^2 - " + 6 * m + "t + " + v0) + ", " + M("x(t) = t^3 - " + 3 * m + "t^2 + " + v0 + "t") + ". a) " + M("v(" + Tt + ") = " + vT) + " cm/s. b) " + M("x(" + Tt + ") = " + xT) + " cm. c) " + M("a(t) = 0") + " pour " + M("t = " + m) + " : " + M("v(" + m + ") = " + (v0 - 3 * m * m)) + " cm/s.");
      },
    ],
    aireint: [
      () => { /* aire entre parabole et droite, puis part de l'aire sous la parabole */
        let R0, x1, x2; do { R0 = ri(3, 5); x1 = ri(-R0 + 1, R0 - 4); x2 = ri(x1 + 3, R0 - 1); } while (false);
        const A = (x2 - x1) ** 3 / 6, Atot = (4 * R0 ** 3) / 3, pc = (100 * A) / Atot;
        return P("On donne " + M("f(x) = " + R0 * R0 + " - x^2") + " et " + M("g(x) = " + poly([-(x1 + x2), R0 * R0 + x1 * x2])) + ".",
          [["a) Abscisses des points d'intersection (séparées par « ; »)", SET([x1, x2])], ["b) Aire du domaine compris entre les deux courbes (fraction acceptée)", A],
           ["c) Quel pourcentage de l'aire comprise entre la parabole et l'axe des abscisses cela représente-t-il ? (%, au dixième)", pc, 0.1]],
          ["f(x) = g(x) : ramène à un trinôme et factorise. Entre les deux abscisses, la parabole est au-dessus de la droite.",
           "b) Intègre f(x) − g(x) entre les deux abscisses. c) La parabole coupe l'axe en ±" + R0 + " : intègre f de −" + R0 + " à " + R0 + "."],
          "a) " + M(poly([1, -(x1 + x2), x1 * x2]) + " = 0 \\iff (" + xm(x1) + ")(" + xm(x2) + ") = 0") + ". b) " + M("\\int_{" + x1 + "}^{" + x2 + "} \\big(" + poly([-1, x1 + x2, -x1 * x2]) + "\\big)\\,dx = " + fx(A)) + ". c) " + M("\\int_{-" + R0 + "}^{" + R0 + "} (" + R0 * R0 + " - x^2)\\,dx = " + frac(4 * R0 ** 3, 3)) + " ; " + M(fx(A) + " \\div " + frac(4 * R0 ** 3, 3) + " \\approx " + D(r1(pc)) + "\\,\\%") + ".");
      },
    ],
    volrev: [
      () => { /* verre de révolution y = √(kx) : volume, hauteur de liquide, verre à moitié plein */
        let k, H, V, V0; do { k = pk([2, 3, 4, 5, 6]); H = ri(6, 12); V = (Math.PI * k * H * H) / 2; V0 = 10 * ri(Math.ceil(V / 50), Math.floor((0.85 * V) / 10)); } while (Math.abs(V0 - V / 2) < 5 || k * H > 20); /* 26.11 (vraisemblance) : bord de rayon √(kH) ≤ 4,5 cm (et non un « verre » de 17 cm de diamètre et 1,1 L) */
        const h0 = Math.sqrt((2 * V0) / (Math.PI * k)), hm = H / Math.SQRT2;
        return P("Un verre a la forme du solide obtenu en faisant tourner la courbe " + M("y = \\sqrt{" + k + "x}") + " autour de l'axe des abscisses, pour " + M("x") + " de " + M(0) + " (le fond) à " + M(H) + " cm (le bord).",
          [["a) Contenance du verre (cm³, à l'unité)", V, 1], ["b) Hauteur du liquide quand on y verse " + M(V0) + " cm³ (cm, au dixième)", h0, 0.1], ["c) Hauteur du liquide quand le verre est à moitié plein (cm, au dixième)", hm, 0.1]],
          ["Volume de révolution : V = π ∫ y² dx. Ici y² = " + k + "x.",
           "Rempli jusqu'à la hauteur h : V(h) = π · " + k + "h² ÷ 2. b) et c) Résous V(h) = le volume voulu (garde h > 0)."],
          "a) " + M("\\pi \\int_0^{" + H + "} " + k + "x\\,dx = \\pi \\cdot " + fx((k * H * H) / 2) + " \\approx " + nb(Math.round(V))) + " cm³. b) " + M("\\frac{" + k + "\\pi h^2}{2} = " + V0 + " \\iff h = \\sqrt{\\frac{" + 2 * V0 + "}{" + k + "\\pi}} \\approx " + D(r1(h0))) + " cm. c) " + M("h^2 = \\frac{" + H * H + "}{2}") + ", " + M("h = \\frac{" + H + "}{\\sqrt{2}} \\approx " + D(r1(hm))) + " cm (et non " + M(D(H / 2)) + " : le verre s'évase).");
      },
    ],
    // ---------- MP 3e–4e ----------
    eqabs: [
      () => { /* |ax + b| = cx + d : condition sur le membre de droite, une solution parfois rejetée */
        let a, c, s1, s2, b, d, ok;
        do { a = pk([2, 3, 4]); c = pk([1, -1, 2, -2]); s1 = ri(-6, 6); s2 = ri(-6, 6);
          d = ((a - c) * s1 - (a + c) * s2) / 2; b = (-(a - c) * s1 - (a + c) * s2) / 2; ok = [s1, s2].filter((x) => c * x + d >= 0);
        } while (Math.abs(c) === a || s1 === s2 || !Number.isInteger(d) || !Number.isInteger(b) || b === 0 || d === 0 || ok.length === 0);
        const lim = -d / c;
        return P("On résout " + M("|" + poly([a, b]) + "| = " + poly([c, d])) + ".",
          [["a) Une valeur absolue n'est jamais négative : il faut " + M(poly([c, d]) + " \\geq 0") + ", c'est-à-dire " + M("x " + (c > 0 ? "\\geq" : "\\leq") + " \\ldots") + " Donne la borne (fraction acceptée).", lim],
           ["b) Solution(s) de l'équation (séparées par « ; »)", SET(ok)]],
          ["|A| = B ⇔ (A = B ou A = −B), à condition que B ≥ 0. Résous les deux équations du 1er degré.",
           "Puis garde seulement les solutions qui vérifient la condition de a) (le membre de droite positif ou nul)."],
          "a) " + M(poly([c, d]) + " \\geq 0 \\iff x " + (c > 0 ? "\\geq " : "\\leq ") + fx(lim)) + ". b) " + M(poly([a, b]) + " = " + poly([c, d])) + " donne " + M("x = " + s1) + (ok.includes(s1) ? " (convient)" : " (rejeté)") + " ; " + M(poly([a, b]) + " = " + poly([-c, -d])) + " donne " + M("x = " + s2) + (ok.includes(s2) ? " (convient)" : " (rejeté)") + ".");
      },
      () => { /* |x − p| + |x − q| = L : somme de deux distances */
        let p, q, L; do { p = ri(0, 15); q = p + ri(3, 12); L = q - p + ri(1, 12); } while (false);
        const xs = [(p + q - L) / 2, (p + q + L) / 2];
        return P("Sur une route rectiligne, le village A est au km " + M(p) + " et le village B au km " + M(q) + ". On veut construire une station au km " + M("x") + " de sorte que " + M("|x - " + p + "| + |x - " + q + "| = " + L) + " (somme des distances aux deux villages).",
          [["a) Plus petite somme possible des deux distances (km)", q - p], ["b) Positions " + M("x") + " possibles (séparées par « ; »)", SET(xs)]],
          ["Entre les deux villages, la somme vaut toujours " + (q - p) + " km. Pour " + L + " km, la station est donc à l'extérieur de [" + p + " ; " + q + "].",
           "À droite de B : (x − " + p + ") + (x − " + q + ") = " + L + ". À gauche de A : (" + p + " − x) + (" + q + " − x) = " + L + "."],
          "a) Si " + M(p + " \\leq x \\leq " + q) + ", " + M("(x - " + p + ") + (" + q + " - x) = " + (q - p)) + ". b) " + M("2x - " + (p + q) + " = " + L) + " : " + M("x = " + D(xs[1])) + " ; " + M((p + q) + " - 2x = " + L) + " : " + M("x = " + D(xs[0])) + ".");
      },
    ],
    logprop: [
      () => { /* simplifier une somme de logarithmes, puis équation avec domaine */
        const n = pk([3, 5, 6, 7]); let i, j; do { i = ri(0, 4); j = ri(0, 4); } while (i === j || i + j < 2);
        const m1 = n * 2 ** i, k1 = n * 2 ** j;
        const pairs = []; for (let u = 2; u <= 40; u++) for (let v = u + 1; v <= 40; v++) if ((u * v) % (u + v) === 0) pairs.push([u, v]);
        const [x1, x2] = pk(pairs), a = (x1 * x2) / (x1 + x2), b = x1 + x2;
        return P("Deux calculs avec les propriétés des logarithmes.",
          [["a) " + M("A = \\log_2 " + m1 + " + \\log_2 " + k1 + " - 2\\log_2 " + n) + " (sans calculatrice)", i + j],
           ["b) On résout " + M("2\\log x - \\log(x - " + a + ") = \\log " + b) + ". Domaine : " + M("x") + " doit être plus grand que", a],
           ["c) Solutions de cette équation (séparées par « ; »)", SET([x1, x2])]],
          ["log u + log v = log(uv), log u − log v = log(u ÷ v), k · log u = log(uᵏ). a) Regroupe tout en un seul log₂.",
           "b) Les deux logarithmes doivent exister. c) log(x² ÷ (x − " + a + ")) = log " + b + " ⇔ x² = " + b + "(x − " + a + "). Équation du 2e degré ; vérifie ensuite le domaine."],
          "a) " + M("A = \\log_2 \\frac{" + m1 + " \\cdot " + k1 + "}{" + n * n + "} = \\log_2 " + 2 ** (i + j) + " = " + (i + j)) + ". b) " + M("x > 0") + " et " + M("x > " + a) + ". c) " + M("x^2 = " + b + "x - " + a * b + " \\iff (x - " + x1 + ")(x - " + x2 + ") = 0") + " : les deux sont plus grandes que " + M(a) + ", " + M("S = \\{" + x1 + " \\,;\\, " + x2 + "\\}") + ".");
      },
    ],
    logdef: [
      () => { /* décibels : sources qui s'ajoutent */
        let L1, N, dl, j; do { L1 = ri(50, 85); N = ri(3, 12); dl = pk([4, 6, 7, 8, 9, 12, 13, 14]); j = ri(2, 4); } while (N === 10);
        const LN = L1 + 10 * Math.log10(N), Nreq = Math.ceil(10 ** (dl / 10));
        return P("Le niveau sonore vaut " + M("L = 10\\log\\frac{I}{I_0}") + " (en dB), où " + M("I") + " est l'intensité du son. Une machine produit " + M(L1) + " dB ; des machines identiques ajoutent leurs intensités.",
          [["a) Niveau sonore de " + M(N) + " machines (dB, au dixième)", LN, 0.1], ["b) Nombre minimal de machines pour atteindre " + M(L1 + dl) + " dB", Nreq],
           ["c) Un son de " + M(L1 + 10 * j) + " dB est combien de fois plus intense qu'une machine ?", 10 ** j]],
          ["N machines : intensité N · I, donc L = 10 log(N · I ÷ I₀) = " + L1 + " + 10 log N.",
           "b) " + L1 + " + 10 log N ≥ " + (L1 + dl) + " ⇔ log N ≥ " + T(dl / 10) + " ⇔ N ≥ 10^" + T(dl / 10) + " ; prends l'entier supérieur. c) +10 dB = intensité × 10."],
          "a) " + M(L1 + " + 10\\log " + N + " \\approx " + D(r1(LN))) + " dB. b) " + M("N \\geq 10^{" + D(dl / 10) + "} \\approx " + D(r2c(10 ** (dl / 10)))) + " : " + M(Nreq) + " machines. c) " + M("10\\log k = " + 10 * j + " \\iff k = 10^{" + j + "} = " + nb(10 ** j)) + ".");
      },
      () => { /* pH : définition, dilution, comparaison */
        let c, n, F, dp; do { c = pk([2, 3, 4, 5, 6, 8]); n = ri(2, 6); F = pk([4, 20, 50, 200]); dp = pk([0.5, 1.5, 2.5]); } while (false);
        const ph = n - Math.log10(c), ph2 = ph + Math.log10(F);
        return P("Le pH d'une solution vaut " + M("\\text{pH} = -\\log[\\text{H}_3\\text{O}^+]") + " (concentration en mol/L). Une solution contient " + M(c + " \\cdot 10^{-" + n + "}") + " mol/L d'ions " + M("\\text{H}_3\\text{O}^+") + ".",
          [["a) pH de la solution (au centième)", ph, 0.01], ["b) pH après l'avoir diluée " + M(F) + " fois (au centième)", ph2, 0.01],
           ["c) Une solution est plus acide de " + M(D(dp)) + " unité" + (dp >= 2 ? "s" : "") + " de pH : sa concentration est combien de fois plus grande ? (au dixième)", 10 ** dp, 0.1]],
          ["log(a · 10⁻ⁿ) = log a − n. Diluer " + F + " fois divise la concentration par " + F + ".",
           "b) −log(c ÷ " + F + ") = −log c + log " + F + " : le pH augmente de log " + F + ". c) pH plus petit de " + T(dp) + " : concentration multipliée par 10^" + T(dp) + "."],
          "a) " + M("-\\log(" + c + " \\cdot 10^{-" + n + "}) = " + n + " - \\log " + c + " \\approx " + D(r2c(ph))) + ". b) " + M(D(r2c(ph)) + " + \\log " + F + " \\approx " + D(r2c(ph2))) + ". c) " + M("10^{" + D(dp) + "} \\approx " + D(r1(10 ** dp))) + ".");
      },
    ],
    vectmp: [
      () => { /* parallélogramme : quatrième sommet, centre, diagonale, colinéarité */
        let A, B, C, u, v, q0;
        do { A = [ri(-5, 5), ri(-5, 5)]; B = [ri(-5, 6), ri(-5, 6)]; C = [ri(-5, 6), ri(-5, 6)]; u = [B[0] - A[0], B[1] - A[1]]; v = [C[0] - B[0], C[1] - B[1]]; q0 = R.nz(-6, 6); }
        while (u[0] * v[1] - u[1] * v[0] === 0 || u[0] === 0 || u[1] === 0 || Math.hypot(...u) < 3 || Math.hypot(...v) < 3 || Math.abs(q0) === Math.abs(u[1]));
        const Dp = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]], Ct = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], BD = Math.hypot(Dp[0] - B[0], Dp[1] - B[1]), k = (q0 * u[0]) / u[1];
        return P("On donne " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + ", " + M("B(" + B[0] + " \\,;\\, " + B[1] + ")") + " et " + M("C(" + C[0] + " \\,;\\, " + C[1] + ")") + ". On veut que " + M("ABCD") + " soit un parallélogramme.",
          [["a) Coordonnées de " + M("D") + " (« x ; y »)", PAIR(Dp[0], Dp[1])], ["b) Coordonnées du centre du parallélogramme (« x ; y »)", PAIR(Ct[0], Ct[1])],
           ["c) Longueur de la diagonale " + M("BD") + " (au centième)", BD, 0.01], ["d) Pour quelle valeur de " + M("k") + " le vecteur " + M("\\vec{w} = \\begin{pmatrix} k \\\\ " + q0 + " \\end{pmatrix}") + " est-il colinéaire à " + M("\\overrightarrow{AB}") + " ? (fraction acceptée)", k]],
          ["ABCD parallélogramme ⇔ vecteur AD = vecteur BC (attention à l'ordre des sommets). Le centre est le milieu des diagonales.",
           "c) Norme du vecteur BD. d) Deux vecteurs (a ; b) et (a' ; b') sont colinéaires ⇔ ab' − ba' = 0."],
          M("\\overrightarrow{BC} = \\begin{pmatrix} " + v[0] + " \\\\ " + v[1] + " \\end{pmatrix}") + ", a) " + M("D = A + \\overrightarrow{BC} = (" + Dp[0] + " \\,;\\, " + Dp[1] + ")") + ". b) Milieu de " + M("[AC]") + " : " + M("(" + D(Ct[0]) + " \\,;\\, " + D(Ct[1]) + ")") + ". c) " + M("\\sqrt{" + (Dp[0] - B[0]) ** 2 + " + " + (Dp[1] - B[1]) ** 2 + "} \\approx " + D(r2c(BD))) + ". d) " + M("\\overrightarrow{AB} = \\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + " : " + M(u[1] + "k - " + pr(u[0]) + " \\cdot " + pr(q0) + " = 0") + ", " + M("k = " + fx(k)) + ".");
      },
    ],
    droiteparam: [
      () => { /* deux droites paramétriques : intersection et angle */
        let I, u, v, t0, s0;
        do { I = [ri(-4, 4), ri(-4, 4)]; u = [R.nz(-3, 3), R.nz(-3, 3)]; v = [R.nz(-3, 3), ri(-3, 3)]; t0 = R.nz(-3, 3); s0 = R.nz(-3, 3); } while (u[0] * v[1] - u[1] * v[0] === 0);
        const A = [I[0] - t0 * u[0], I[1] - t0 * u[1]], B = [I[0] - s0 * v[0], I[1] - s0 * v[1]];
        const ang = deg(Math.acos(Math.abs(u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))));
        const lt = (P0, w, t) => { const tt = (Math.abs(w) === 1 ? "" : Math.abs(w)) + t; if (w === 0) return String(P0); if (P0 === 0) return (w < 0 ? "-" : "") + tt; return P0 + (w < 0 ? " - " : " + ") + tt; };
        const eqp = (P0, w, t) => M("\\begin{cases} x = " + lt(P0[0], w[0], t) + " \\\\ y = " + lt(P0[1], w[1], t) + " \\end{cases}");
        return P("On donne les droites " + M("d_1") + " : " + eqp(A, u, "t") + " et " + M("d_2") + " : " + eqp(B, v, "s") + ".",
          [["a) Valeur de " + M("t") + " au point d'intersection", t0], ["b) Point d'intersection (« x ; y »)", PAIR(I[0], I[1])], ["c) Angle aigu entre les deux droites (°, au dixième)", ang, 0.1]],
          ["Un point commun a les mêmes x et y sur les deux droites : égale les x, puis les y. Système de deux équations en t et s.",
           "b) Remplace t dans d₁. c) L'angle entre les droites est celui de leurs vecteurs directeurs : cos θ = |u · v| ÷ (‖u‖ · ‖v‖)."],
          M(lt(A[0], u[0], "t") + " = " + lt(B[0], v[0], "s")) + " et " + M(lt(A[1], u[1], "t") + " = " + lt(B[1], v[1], "s")) + " : a) " + M("t = " + t0) + " (et " + M("s = " + s0) + "). b) " + M("(" + I[0] + " \\,;\\, " + I[1] + ")") + ". c) " + M("\\cos\\theta = \\frac{|" + (u[0] * v[0] + u[1] * v[1]) + "|}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "}\\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\theta \\approx " + D(r1(ang)) + "°") + ".");
      },
    ],
    sinusmp: [
      () => { /* température annuelle : modèle cosinus, valeur, durée au-dessus d'un seuil */
        let Tn, Tx, mo, x1, S; do { Tn = ri(-8, 6); Tx = Tn + ri(12, 26); mo = pk([7, 8]); x1 = ri(1, 12); S = ri(Tn + 3, Tx - 3); } while ((((x1 - mo) % 3) + 3) % 3 === 0 || Math.abs(S - (Tx + Tn) / 2) < 1);
        const A = (Tx - Tn) / 2, d = (Tx + Tn) / 2, Tv = d + A * Math.cos((Math.PI * (x1 - mo)) / 6), dur = (12 / Math.PI) * Math.acos((S - d) / A);
        const MO = ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        return P("Dans une ville, la température moyenne varie entre " + M(Tn + "\\,°\\text{C}") + " et " + M(Tx + "\\,°\\text{C}") + ", avec le maximum en " + MO[mo] + " (mois " + M(mo) + "). On modélise par " + M("T(x) = d + A\\cos\\left(\\frac{\\pi}{6}(x - " + mo + ")\\right)") + ", " + M("x") + " en mois (radians).",
          [["a) Amplitude " + M("A"), A], ["b) Température prévue au mois " + M(x1) + " (" + MO[x1] + ", °C, au dixième)", Tv, 0.1], ["c) Pendant combien de mois par an la température dépasse-t-elle " + M(S + "\\,°\\text{C}") + " ? (au dixième)", dur, 0.1]],
          ["A = la moitié de l'écart entre maximum et minimum ; d = la moyenne des deux.",
           "c) T(x) ≥ " + S + " ⇔ cos(π(x − " + mo + ") ÷ 6) ≥ (" + S + " − d) ÷ A. Avec θ = arccos(…), il faut −θ ≤ π(x − " + mo + ") ÷ 6 ≤ θ : la durée vaut 2θ · 6 ÷ π."],
          "a) " + M("A = \\frac{" + Tx + " - " + pr(Tn) + "}{2} = " + D(A)) + ", " + M("d = " + D(d)) + ". b) " + M("T(" + x1 + ") = " + D(d) + " + " + D(A) + "\\cos\\left(\\frac{\\pi}{6} \\cdot " + pr(x1 - mo) + "\\right) \\approx " + D(r1(Tv))) + " °C. c) " + M("\\cos\\theta = \\frac{" + S + " - " + D(d) + "}{" + D(A) + "}") + ", " + M("\\theta \\approx " + D(+Math.acos((S - d) / A).toFixed(3))) + " : " + M("\\frac{12\\theta}{\\pi} \\approx " + D(r1(dur))) + " mois.");
      },
    ],
    explogfn: [
      () => { /* f(x) = a · b^x par deux points sans abscisse 0, puis équation exponentielle */
        let a, b, x1, x2, Y, xY; do { a = pk([2, 3, 5, 1.5, 4]); b = pk([2, 3, 1.5, 0.5]); x1 = ri(1, 3); x2 = x1 + ri(1, 3); Y = ri(5, 300); xY = Math.log(Y / a) / Math.log(b); } while (Math.abs(xY - Math.round(xY)) < 0.05 || Math.abs(xY) > 15 || (a * b ** x2) * 1000 % 1 !== 0);
        const y1 = a * b ** x1, y2 = a * b ** x2;
        return P("Une fonction " + M("f(x) = a \\cdot b^x") + " passe par les points " + M("(" + x1 + " \\,;\\, " + D(y1) + ")") + " et " + M("(" + x2 + " \\,;\\, " + D(y2) + ")") + ".",
          [["a) " + M("b"), b], ["b) " + M("a"), a], ["c) Solution de " + M("f(x) = " + Y) + " (au centième)", xY, 0.01]],
          ["Divise les deux égalités : a s'élimine et b^" + (x2 - x1) + " = " + T(y2) + " ÷ " + T(y1) + ".",
           "b) a = " + T(y1) + " ÷ b^" + x1 + ". c) a · b^x = " + Y + " ⇔ b^x = " + Y + " ÷ a ⇔ x = log(" + Y + " ÷ a) ÷ log b."],
          "a) " + M("b^{" + (x2 - x1) + "} = \\frac{" + D(y2) + "}{" + D(y1) + "} = " + D(b ** (x2 - x1))) + ", " + M("b = " + D(b)) + ". b) " + M("a = \\frac{" + D(y1) + "}{" + D(b) + "^{" + x1 + "}} = " + D(a)) + ". c) " + M(D(b) + "^x = \\frac{" + Y + "}{" + D(a) + "}") + ", " + M("x = \\frac{\\log(" + Y + " \\div " + D(a) + ")}{\\log " + D(b) + "} \\approx " + D(r2c(xY))) + ".");
      },
    ],
    /* 26.11 soir (agent defis3) : + deux nombres (produit et somme des carrés), triangle rectangle (hypoténuse et aire) ; 3 contextes. */
    eqbic: [
      () => { /* rectangle : diagonale et aire donnent une équation bicarrée */
        const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]), k = r < 20 ? ri(1, 3) : 1;
        const dg = k * r, A = k * k * p * q;
        return Object.assign(P("Un écran rectangulaire a une diagonale de " + M(dg) + " cm et une aire de " + M(nb(A)) + " cm². On note " + M("x") + " un de ses côtés (en cm).",
          [["a) En posant " + M("X = x^2") + ", solutions de l'équation en " + M("X") + " (séparées par « ; »)", SET([(k * p) ** 2, (k * q) ** 2])], ["b) Longueur (le plus grand côté, cm)", k * q], ["c) Périmètre de l'écran (cm)", 2 * k * (p + q)]],
          ["L'autre côté vaut " + nbT(A) + " ÷ x. Pythagore : x² + (" + nbT(A) + " ÷ x)² = " + dg + "². Multiplie par x².",
           "x⁴ − " + nbT(dg * dg) + "x² + " + nbT(A * A) + " = 0 : équation bicarrée. Avec X = x², trouve X, puis x = √X (x > 0) : les deux valeurs sont les deux côtés."],
          M("x^4 - " + nb(dg * dg) + "x^2 + " + nb(A * A) + " = 0") + ", a) " + M("X^2 - " + nb(dg * dg) + "X + " + nb(A * A) + " = 0") + " : " + M("X = " + nb((k * p) ** 2)) + " ou " + M("X = " + nb((k * q) ** 2)) + ". b) " + M("x = " + k * p) + " ou " + M(k * q) + " : les côtés mesurent " + M(k * p) + " et " + M(k * q) + " cm. c) " + M("2(" + k * p + " + " + k * q + ") = " + 2 * k * (p + q)) + " cm."), { ctx: "ecran" });
      },
      () => { /* deux nombres : produit et somme des carrés */
        let p, q; do { p = ri(2, 9); q = ri(3, 12); } while (p >= q);
        return Object.assign(P("Deux nombres positifs ont pour produit " + M(p * q) + " et la somme de leurs carrés vaut " + M(p * p + q * q) + ". On note " + M("x") + " l'un d'eux.",
          [["a) En posant " + M("X = x^2") + ", solutions de l'équation en " + M("X") + " (séparées par « ; »)", SET([p * p, q * q])], ["b) Le plus grand des deux nombres", q], ["c) Leur somme", p + q]],
          ["L'autre nombre vaut " + p * q + " ÷ x : x² + (" + p * q + " ÷ x)² = " + (p * p + q * q) + ". Multiplie par x².", "x⁴ − " + (p * p + q * q) + "x² + " + p * p * q * q + " = 0 : pose X = x²."],
          M("X^2 - " + (p * p + q * q) + "X + " + nb(p * p * q * q) + " = 0") + " : a) " + M("X = " + p * p) + " ou " + M("X = " + q * q) + ". b) " + M(q) + " (et l'autre vaut " + M(p) + "). c) " + M(p + " + " + q + " = " + (p + q)) + "."), { ctx: "nombres" });
      },
      () => { /* triangle rectangle : hypoténuse et aire */
        const [p, q, r] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]), A = (p * q) / 2;
        return Object.assign(P("Un triangle rectangle a une hypoténuse de " + M(r) + " cm et une aire de " + M(D(A)) + " cm². On note " + M("x") + " un des côtés de l'angle droit.",
          [["a) En posant " + M("X = x^2") + ", solutions de l'équation en " + M("X") + " (séparées par « ; »)", SET([p * p, q * q])], ["b) Le plus long côté de l'angle droit (cm)", q], ["c) Périmètre du triangle (cm)", p + q + r]],
          ["L'autre côté vaut " + 2 * A + " ÷ x (aire = produit des côtés ÷ 2). Pythagore : x² + (" + 2 * A + " ÷ x)² = " + r * r + ".", "x⁴ − " + r * r + "x² + " + nb(4 * A * A) + " = 0 : pose X = x²."],
          M("X^2 - " + r * r + "X + " + nb(4 * A * A) + " = 0") + " : a) " + M("X = " + p * p) + " ou " + M("X = " + q * q) + ". b) " + M(q) + " cm (l'autre côté : " + M(p) + " cm). c) " + M(p + " + " + q + " + " + r + " = " + (p + q + r)) + " cm."), { ctx: "triangle" });
      },
    ],
    eqirrmp: [
      () => { /* √(2x + a) = 1 + √(x + b) : isoler, élever deux fois au carré, vérifier */
        let m, x0, a, b, c, x1, okF;
        const chk = (x) => 2 * x + a >= 0 && x + b >= 0 && Math.abs(Math.sqrt(2 * x + a) - 1 - Math.sqrt(x + b)) < 1e-9;
        do { m = ri(2, 7); x0 = ri(-3, 10); a = m * m - 2 * x0; b = (m - 1) ** 2 - x0; c = a - b - 1; x1 = 4 - 2 * c - x0; } while (a === 0 || b === 0 || x1 === x0 || c === 0 || Math.abs(x1) > 40);
        okF = [x0, x1].filter(chk);
        return P("On résout " + M("\\sqrt{2x" + sg(a) + "} = 1 + \\sqrt{x" + sg(b) + "}") + ".",
          [["a) Après une première élévation au carré, l'équation s'écrit " + M("x + c = 2\\sqrt{x" + sg(b) + "}") + ". Que vaut " + M("c") + " ?", c],
           ["b) Solutions de l'équation du 2e degré obtenue après la seconde élévation au carré (séparées par « ; »)", SET([x0, x1])],
           ["c) Solution(s) de l'équation de départ", SET(okF)]],
          ["(1 + √u)² = 1 + 2√u + u. Isole la racine qui reste, puis élève à nouveau au carré.",
           "Élever au carré peut ajouter des solutions : remplace chaque solution dans l'équation de DÉPART (les deux racines doivent exister, et l'égalité doit être vraie)."],
          M("2x" + sg(a) + " = 1 + 2\\sqrt{x" + sg(b) + "} + x" + sg(b)) + ", a) " + M(poly([1, c]) + " = 2\\sqrt{x" + sg(b) + "}") + ". b) " + M("(" + poly([1, c]) + ")^2 = 4(x" + sg(b) + ") \\iff " + poly([1, 2 * c - 4, c * c - 4 * b]) + " = 0") + " : " + M(Math.min(x0, x1)) + " et " + M(Math.max(x0, x1)) + ". c) " + [x0, x1].map((x) => M("x = " + x) + (chk(x) ? " convient" : " ne convient pas")).join(", ") + ".");
      },
    ],
    eqratmp: [
      () => { /* deux robinets : équation rationnelle */
        const L = []; for (let x = 2; x <= 12; x++) for (let d = 1; d <= 10; d++) { const t = (x * (x + d)) / (2 * x + d); if (Math.abs(t * 10 - Math.round(t * 10)) < 1e-9) L.push([x, d, t]); }
        const [x, d, Tt] = pk(L);
        return P("Deux robinets remplissent ensemble une cuve en " + M(D(Tt)) + " h. Seul, le premier robinet met " + M(d) + " h de moins que le second.",
          [["a) Temps du premier robinet seul (h)", x], ["b) Temps du second robinet seul (h)", x + d], ["c) Quelle fraction de la cuve le premier robinet a-t-il remplie, quand ils travaillent ensemble ?", (x + d) / (2 * x + d)]],
          ["Avec x le temps du premier : en 1 h, il remplit 1/x de la cuve, le second 1/(x + " + d + "), les deux 1/" + T(Tt) + ".",
           "1/x + 1/(x + " + d + ") = 1/" + T(Tt) + " : multiplie par x(x + " + d + ") · " + T(Tt) + ", garde la solution positive. c) Le premier travaille " + T(Tt) + " h à la vitesse 1/x."],
          M("\\frac{1}{x} + \\frac{1}{x + " + d + "} = \\frac{1}{" + D(Tt) + "} \\iff " + D(Tt) + "(2x + " + d + ") = x(x + " + d + ") \\iff x^2" + (d - 2 * Tt ? sgD(d - 2 * Tt) + "x" : "") + sgD(-d * Tt) + " = 0") + " : a) " + M("x = " + x) + " h (l'autre solution est négative). b) " + M(x + d) + " h. c) " + M("\\frac{" + D(Tt) + "}{" + x + "} = " + frac(x + d, 2 * x + d)) + ".");
      },
    ],
    ineqmp: [
      () => { /* (ax + b) ÷ (x − p) ≥ k : tout d'un côté, puis tableau de signes */
        let a, k, p, z, b, op;
        do { a = ri(1, 5); k = ri(1, 4); p = R.nz(-5, 5); z = ri(-6, 6); op = pk([">=", "<="]); b = -(a - k) * z - k * p; } while (a === k || z === p || b === 0);
        const al = a - k, lo = Math.min(z, p), hi = Math.max(z, p), pos = op === ">=", outside = (al > 0) === pos;
        const ivs = outside ? [[-Infinity, false, lo, lo === z], [hi, hi === z, Infinity, false]] : [[lo, lo === z, hi, hi === z]];
        return P("On résout " + M("\\frac{" + poly([a, b]) + "}{" + xm(p) + "} " + (pos ? "\\geq " : "\\leq ") + k) + ".",
          [["a) Valeur interdite", p], ["b) En ramenant tout d'un côté : " + M("\\frac{" + "\\ldots" + "}{" + xm(p) + "} " + (pos ? "\\geq" : "\\leq") + " 0") + ". Zéro du nouveau numérateur", z], ["c) Ensemble des solutions (intervalles)", SOLS(ivs)]],
          ["Ne multiplie pas par (" + xmT(p) + ") : son signe change ! Soustrais " + k + " et mets au même dénominateur.",
           "Numérateur : " + pT([a, b]) + " − " + k + "(" + xmT(p) + "). Puis tableau de signes du quotient ; la valeur interdite est toujours exclue."],
          M("\\frac{" + poly([a, b]) + " - " + k + "(" + xm(p) + ")}{" + xm(p) + "} = \\frac{" + poly([al, -al * z]) + "}{" + xm(p) + "} " + (pos ? "\\geq" : "\\leq") + " 0") + ". a) " + M(p) + ". b) " + M(z) + ". c) " + M("S = " + SolSet.show(ivs, true)) + ".");
      },
    ],
    puisrat: [
      () => { /* équation exponentielle par la même base, puis 3e loi de Kepler */
        const [B, e1, e2] = pk([[2, 2, 3], [3, 2, 3], [2, 3, 4], [5, 2, 3], [2, 2, 5], [3, 3, 2], [2, 4, 3]]);
        let a, b, aU, T0; do { a = R.nz(-5, 5); b = R.nz(-5, 5); aU = ri(11, 96) / 10; T0 = ri(2, 30); } while (e1 * a + e2 * b === 0 || [8, 27].includes(T0) || Math.abs(aU - Math.round(aU)) < 1e-9 && [1, 4, 9].includes(Math.round(aU)));
        const xs = (e1 * a + e2 * b) / (e2 - e1), Tp = aU ** 1.5, ap = T0 ** (2 / 3);
        return P("Exposants fractionnaires. D'après la 3e loi de Kepler, une planète à la distance moyenne " + M("a") + " du Soleil (en unités astronomiques) en fait le tour en " + M("T = a^{3/2}") + " années.",
          [["a) Solution de " + M(B ** e1 + "^{x" + sg(a) + "} = " + B ** e2 + "^{x" + sg(-b) + "}") + " (fraction acceptée)", xs],
           ["b) Durée de révolution d'une planète à " + M(D(aU)) + " UA (années, au centième)", Tp, 0.01], ["c) Distance d'une planète qui fait le tour du Soleil en " + M(T0) + " ans (UA, au centième)", ap, 0.01]],
          ["a) " + B ** e1 + " = " + B + "^" + e1 + " et " + B ** e2 + " = " + B + "^" + e2 + " : écris tout en base " + B + ", puis égale les exposants.",
           "b) a^(3/2) = (√a)³. c) T = a^(3/2) ⇔ a = T^(2/3) (élève les deux membres à la puissance 2/3)."],
          "a) " + M(B + "^{" + e1 + "(x" + sg(a) + ")} = " + B + "^{" + e2 + "(x" + sg(-b) + ")} \\iff " + e1 + "x" + sg(e1 * a) + " = " + e2 + "x" + sg(-e2 * b) + " \\iff x = " + fx(xs)) + ". b) " + M(D(aU) + "^{3/2} \\approx " + D(r2c(Tp))) + " ans. c) " + M(T0 + "^{2/3} \\approx " + D(r2c(ap))) + " UA.");
      },
    ],
    // ---------- 11e ----------
    thalesrec: [
      () => { /* étagère pas tout à fait parallèle : réciproque, puis correction */
        let r, AB, AC, dl; do { r = pk([0.25, 0.4, 0.6, 0.75, 0.8, 0.3, 0.7]); AB = 20 * ri(2, 6); AC = 20 * ri(2, 6); dl = R.nz(-4, 4); } while (AB === AC);
        const AD = r * AB, AEp = r * AC, AE = AEp + dl;
        return P("Une étagère " + M("[DE]") + " relie deux montants " + M("[AB]") + " et " + M("[AC]") + " issus du même point " + M("A") + ". On mesure " + M("AD = " + AD) + " cm, " + M("AB = " + AB) + " cm, " + M("AE = " + AE) + " cm et " + M("AC = " + AC) + " cm. On voudrait " + M("(DE) \\parallel (BC)") + ".",
          [["a) " + M("AD \\div AB") + " (décimal)", r], ["b) " + M("AE \\div AC") + " (au centième)", r2c(AE / AC), 0.01], ["c) Longueur " + M("AE") + " qui rendrait l'étagère parallèle à " + M("(BC)") + " (cm)", AEp], ["d) De combien de cm faut-il déplacer " + M("E") + " ?", Math.abs(dl)]],
          ["Réciproque de Thalès : (DE) ∥ (BC) si et seulement si AD ÷ AB = AE ÷ AC (points dans le même ordre).",
           "c) Il faut AE ÷ " + AC + " = " + T(r) + ", donc AE = " + T(r) + " · " + AC + ". d) Compare avec la mesure actuelle."],
          "a) " + M(frac(AD, AB) + " = " + D(r)) + ". b) " + M(frac(AE, AC) + " \\approx " + D(Math.round((AE / AC) * 10000) / 10000)) + " : rapports différents, l'étagère n'est pas parallèle. c) " + M("AE = " + D(r) + " \\cdot " + AC + " = " + AEp) + " cm. d) " + M("|" + AE + " - " + AEp + "| = " + Math.abs(dl)) + " cm (" + (dl > 0 ? "vers A" : "vers C") + ").");
      },
      () => { /* triangle coupé par une parallèle : vérifier, puis périmètre du trapèze */
        let k, AB, AC, BC; do { k = pk([0.25, 0.4, 0.6, 0.75, 0.8]); AB = 20 * ri(2, 7); AC = 20 * ri(2, 7); BC = 20 * ri(2, 8); } while (AB + AC <= BC || AB + BC <= AC || AC + BC <= AB || AB === AC);
        const AD = k * AB, AE = k * AC, DE = k * BC, per = (1 - k) * AB + BC + (1 - k) * AC + DE;
        return P("Dans le triangle " + M("ABC") + ", " + M("AB = " + AB) + " mm, " + M("AC = " + AC) + " mm et " + M("BC = " + BC) + " mm. " + M("D") + " est sur " + M("[AB]") + " avec " + M("AD = " + AD) + " mm, " + M("E") + " sur " + M("[AC]") + " avec " + M("AE = " + AE) + " mm.",
          [["a) " + M("AD \\div AB") + " (décimal)", k], ["b) Longueur " + M("DE") + " (mm)", DE], ["c) Périmètre du trapèze " + M("DBCE") + " (mm)", per]],
          ["Compare AD ÷ AB et AE ÷ AC : s'ils sont égaux, (DE) ∥ (BC) (réciproque de Thalès).",
           "Puis Thalès : DE ÷ BC = AD ÷ AB. Le trapèze a pour côtés DB, BC, CE et ED, avec DB = AB − AD et CE = AC − AE."],
          "a) " + M("\\frac{" + AD + "}{" + AB + "} = \\frac{" + AE + "}{" + AC + "} = " + D(k)) + " : " + M("(DE) \\parallel (BC)") + ". b) " + M("DE = " + D(k) + " \\cdot " + BC + " = " + D(DE)) + " mm. c) " + M((AB - AD) + " + " + BC + " + " + (AC - AE) + " + " + D(DE) + " = " + D(per)) + " mm.");
      },
    ],
    volcone: [
      () => { /* cornet de glace : cône + demi-boule, cône équivalent */
        const r = ri(2, 4), h = ri(8, 14), Vc = (Math.PI * r * r * h) / 3, Vt = (Math.PI * r * r * (h + 2 * r)) / 3;
        return P("Un cornet de glace est formé d'un cône (rayon " + M(r) + " cm, hauteur " + M(h) + " cm) rempli de glace, surmonté d'une demi-boule de glace de même rayon.",
          [["a) Volume du cône (cm³, au dixième)", Vc, 0.1], ["b) Volume total de glace (cm³, au dixième)", Vt, 0.1], ["c) Hauteur d'un cône de même rayon qui contiendrait toute cette glace (cm)", h + 2 * r]],
          ["Cône : π r² h ÷ 3. Boule : 4πr³ ÷ 3, donc demi-boule : 2πr³ ÷ 3.",
           "c) π · " + r * r + " · H ÷ 3 = volume total : divise par π · " + r * r + " ÷ 3 (garde π dans les calculs, sans arrondir)."],
          "a) " + M("\\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} \\approx " + D(r1(Vc))) + " cm³. b) Demi-boule " + M("\\frac{2\\pi \\cdot " + r + "^3}{3}") + " ; total " + M("\\frac{\\pi \\cdot " + r * r + "(" + h + " + " + 2 * r + ")}{3} \\approx " + D(r1(Vt))) + " cm³. c) " + M("H = " + h + " + 2 \\cdot " + r + " = " + (h + 2 * r)) + " cm : la demi-boule vaut un cône de hauteur " + M(2 * r) + ".");
      },
      () => { /* boule fondue en petits cônes */
        let R0, r, h, ratio; do { R0 = ri(4, 10); r = ri(1, 3); h = ri(3, 8); ratio = (4 * R0 ** 3) / (r * r * h); } while (Number.isInteger(ratio) || ratio > 2000);
        const Vs = (4 * Math.PI * R0 ** 3) / 3, Vk = (Math.PI * r * r * h) / 3;
        return P("Une boule de pâte à modeler de rayon " + M(R0) + " cm sert à fabriquer de petits cônes pleins de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm.",
          [["a) Volume de la boule (cm³, au dixième)", Vs, 0.1], ["b) Volume d'un cône (cm³, au dixième)", Vk, 0.1], ["c) Nombre maximal de cônes complets", Math.floor(ratio)]],
          ["Boule : 4πR³ ÷ 3. Cône : π r² h ÷ 3.", "c) Divise les volumes non arrondis (π se simplifie), puis prends l'entier inférieur."],
          "a) " + M("\\frac{4\\pi \\cdot " + R0 + "^3}{3} \\approx " + D(r1(Vs))) + " cm³. b) " + M("\\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} \\approx " + D(r1(Vk))) + " cm³. c) " + M("\\frac{4 \\cdot " + R0 ** 3 + "}{" + r * r * h + "} \\approx " + D(r2c(ratio))) + " : " + M(Math.floor(ratio)) + " cônes.");
      },
    ],
    volmanq: [
      () => { /* boîte de conserve : hauteur, puis aire de l'étiquette */
        let d, V; do { d = pk([6, 7, 8, 10]); V = pk([33, 40, 50, 75, 100]); } while (false);
        const r = d / 2, Vc = 10 * V, h = Vc / (Math.PI * r * r), Al = (2 * Vc) / r;
        return P("Une boîte de conserve cylindrique de " + M(d) + " cm de diamètre doit contenir " + M(V) + " cL. Une étiquette recouvre toute sa surface latérale.",
          [["a) Contenance en cm³", Vc], ["b) Hauteur de la boîte (cm, au dixième)", h, 0.1], ["c) Aire de l'étiquette (cm², à l'unité)", Al, 1]],
          ["1 cL = 10 cm³. Volume d'un cylindre : π r² h ; ici r = " + T(r) + " cm.",
           "b) Isole h. c) Aire latérale = périmètre du disque × hauteur = 2π r h (avec h non arrondie)."],
          "a) " + M(V + " \\cdot 10 = " + Vc) + " cm³. b) " + M("h = \\frac{" + Vc + "}{\\pi \\cdot " + D(r) + "^2} \\approx " + D(r1(h))) + " cm. c) " + M("2\\pi \\cdot " + D(r) + " \\cdot h = \\frac{2 \\cdot " + Vc + "}{" + D(r) + "} \\approx " + nb(Math.round(Al))) + " cm².");
      },
      () => { /* verre conique : rayon, volume à mi-hauteur, hauteur pour la moitié du volume */
        let h, V; do { h = ri(8, 14); V = pk([10, 12, 15, 20]); } while (false);
        const rr = Math.sqrt((3 * 10 * V) / (Math.PI * h)), hm = h / Math.cbrt(2);
        return P("Un verre a la forme d'un cône (pointe en bas) de " + M(h) + " cm de profondeur. Plein, il contient " + M(V) + " cL.",
          [["a) Rayon de l'ouverture (cm, au dixième)", rr, 0.1], ["b) Volume (cL) quand le verre est rempli jusqu'à mi-hauteur", V / 8], ["c) Hauteur du liquide quand le verre contient la moitié de " + M(V) + " cL (cm, au dixième)", hm, 0.1]],
          ["V = π r² h ÷ 3, avec V = " + 10 * V + " cm³. Isole r² puis r.",
           "Le liquide forme un petit cône, réduction du grand : si les longueurs sont multipliées par k, le volume l'est par k³. b) k = 1/2. c) k³ = 1/2, donc k = ∛(1/2)."],
          "a) " + M("r = \\sqrt{\\frac{3 \\cdot " + 10 * V + "}{\\pi \\cdot " + h + "}} \\approx " + D(r1(rr))) + " cm. b) " + M(V + " \\cdot \\left(\\frac{1}{2}\\right)^3 = " + D(V / 8)) + " cL. c) " + M("k = \\sqrt[3]{0{,}5} \\approx 0{,}794") + ", " + M("h \\approx " + D(r1(hm))) + " cm (bien plus que la moitié de la profondeur).");
      },
    ],
    simil: [
      () => { /* agrandissement d'une photo : rapport, longueur, prix proportionnel à l'aire */
        const [w, l] = pk([[10, 15], [9, 13], [13, 18], [20, 30], [12, 16]]), k = pk([1.5, 2, 2.5, 3, 4]), Pp = pk([0.6, 0.8, 1.2, 1.5, 2.4]);
        return P("Une photo de " + M(w) + " cm sur " + M(l) + " cm est agrandie : sa largeur passe à " + M(D(k * w)) + " cm. Le prix d'un tirage est proportionnel à son aire ; l'original coûte " + M(D(Pp)) + " CHF.",
          [["a) Rapport d'agrandissement", k], ["b) Nouvelle longueur (cm)", k * l], ["c) Prix du tirage agrandi (CHF, au centime)", Pp * k * k, 0.01]],
          ["Rapport = nouvelle longueur ÷ ancienne longueur (même côté). Toutes les longueurs sont multipliées par ce rapport.",
           "Les aires sont multipliées par le CARRÉ du rapport : le prix aussi."],
          "a) " + M(D(k * w) + " \\div " + w + " = " + D(k)) + ". b) " + M(D(k) + " \\cdot " + l + " = " + D(k * l)) + " cm. c) Aire multipliée par " + M(D(k * k)) + " : " + M(D(Pp) + " \\cdot " + D(k * k) + " = " + D(r2c(Pp * k * k))) + " CHF.");
      },
      () => { /* maquette à l'échelle 1 : n : longueur, aire, volume réels */
        const n = pk([50, 100, 200, 250]), h = ri(8, 40), A = 2 * ri(10, 90), V = Math.max(40, 40 * Math.round((A * h * pk([0.7, 0.8, 0.9, 1])) / 40)); /* 26.11 soir (vraisemblance) : volume tiré à part (aire au sol 146 cm², hauteur 40 cm, volume 1'800 cm³ : impossible pour un bâtiment) ; maintenant 70 à 100 % de aire × hauteur (toit) */
        return P("La maquette d'un bâtiment est à l'échelle " + M("1 : " + n) + ". Sur la maquette : hauteur " + M(h) + " cm, aire au sol " + M(A) + " cm², volume " + M(nb(V)) + " cm³.",
          [["a) Hauteur réelle (m)", (h * n) / 100], ["b) Aire au sol réelle (m²)", (A * n * n) / 10000], ["c) Volume réel (m³)", (V * n ** 3) / 1e6]],
          ["Les longueurs sont multipliées par " + n + ", les aires par " + n + "², les volumes par " + n + "³.",
           "Conversions : 1 m = 100 cm, 1 m² = 10'000 cm², 1 m³ = 1'000'000 cm³."],
          "a) " + M(h + " \\cdot " + n + " = " + nb(h * n)) + " cm " + M("= " + D((h * n) / 100)) + " m. b) " + M(A + " \\cdot " + n + "^2 = " + nb(A * n * n)) + " cm² " + M("= " + D((A * n * n) / 10000)) + " m². c) " + M(nb(V) + " \\cdot " + n + "^3 = " + nb(V * n ** 3)) + " cm³ " + M("= " + D((V * n ** 3) / 1e6)) + " m³.");
      },
    ],
    sys2: [
      () => { /* billets : système, puis nouveau prix */
        let N, pa, pc, na, dl; do { N = 10 * ri(8, 30); pa = pk([12, 15, 18, 20, 25]); pc = pk([5, 6, 8, 10]); na = ri(20, N - 20); dl = pk([1, 2, 3, 5]); } while (pc >= pa);
        const nc = N - na, Rr = na * pa + nc * pc, R2 = Rr + na * dl;
        return P("Un spectacle a vendu " + M(N) + " billets : des billets adultes à " + M(pa) + " CHF et des billets enfants à " + M(pc) + " CHF. La recette vaut " + M(nb(Rr)) + " CHF.",
          [["a) Nombre de billets adultes", na], ["b) Nombre de billets enfants", nc], ["c) Avec la même fréquentation, quel prix adulte aurait donné " + M(nb(R2)) + " CHF ?", pa + dl]],
          ["Deux inconnues (adultes a, enfants e), deux équations : une pour le nombre de billets, une pour la recette.",
           "a + e = " + N + " et " + pa + "a + " + pc + "e = " + nbT(Rr) + ". Substitution : e = " + N + " − a. c) Les billets enfants rapportent toujours la même somme."],
          M("a + e = " + N) + ", " + M(pa + "a + " + pc + "e = " + nb(Rr)) + " : " + M(pa + "a + " + pc + "(" + N + " - a) = " + nb(Rr) + " \\iff " + (pa - pc) + "a = " + nb(Rr - pc * N)) + ", a) " + M(na) + ", b) " + M(nc) + ". c) " + M("\\frac{" + nb(R2) + " - " + nb(nc * pc) + "}{" + na + "} = " + (pa + dl)) + " CHF.");
      },
      () => { /* rectangle dont l'aire ne change pas */
        let l, a, b, L; do { l = ri(6, 20); a = ri(2, 6); b = ri(1, 5); L = (a * (l - b)) / b; } while (!Number.isInteger(L) || L <= l || L > 60 || a === b);
        return P("Un rectangle a un périmètre de " + M(2 * (L + l)) + " cm. Si on allonge sa longueur de " + M(a) + " cm et qu'on raccourcit sa largeur de " + M(b) + " cm, son aire ne change pas.",
          [["a) Longueur (cm)", L], ["b) Largeur (cm)", l], ["c) Aire (cm²)", L * l]],
          ["Avec L et l : L + l = " + (L + l) + " (demi-périmètre) et (L + " + a + ")(l − " + b + ") = L · l.",
           "Développe la 2e équation : le produit L · l s'élimine, il reste une équation du 1er degré. Système de deux équations du 1er degré."],
          M("(L + " + a + ")(l - " + b + ") = Ll \\iff -" + b + "L + " + a + "l = " + a * b) + " et " + M("L + l = " + (L + l)) + ". Substitution : " + M("-" + b + "(" + (L + l) + " - l) + " + a + "l = " + a * b + " \\iff " + (a + b) + "l = " + (a * b + b * (L + l))) + ", b) " + M("l = " + l) + ", a) " + M("L = " + L) + ". c) " + M(L * l) + " cm².");
      },
    ],
    formule: [
      () => { /* IMC : calculer, puis isoler une lettre (dont une racine) */
        let m, t, I2, m3, I3; do { m = ri(45, 95); t = ri(150, 195) / 100; I2 = pk([20, 22, 24, 25]); I3 = pk([19, 21, 23]); m3 = Math.round(I3 * (ri(155, 192) / 100) ** 2); } while (m / (t * t) < 17 || m / (t * t) > 32);
        const I = m / (t * t), m2 = I2 * t * t, t3 = Math.sqrt(m3 / I3);
        return P("L'indice de masse corporelle vaut " + M("I = \\frac{m}{t^2}") + " (" + M("m") + " : masse en kg, " + M("t") + " : taille en m).",
          [["a) " + M("I") + " pour " + M(m) + " kg et " + M(D(t)) + " m (au dixième)", r1(I), 0.1], ["b) Masse (kg, au dixième) d'une personne de " + M(D(t)) + " m dont l'indice vaut " + M(I2), r1(m2), 0.1],
           ["c) Taille (m, au centième) d'une personne de " + M(m3) + " kg dont l'indice vaut " + M(I3), t3, 0.01]],
          ["b) Isole m : multiplie les deux membres par t².", "c) Isole t² (t² = m ÷ I), puis prends la racine carrée (t > 0)."],
          "a) " + M("\\frac{" + m + "}{" + D(t) + "^2} \\approx " + D(r1(I))) + ". b) " + M("m = I \\cdot t^2 = " + I2 + " \\cdot " + D(t) + "^2 \\approx " + D(r1(m2))) + " kg. c) " + M("t = \\sqrt{\\frac{m}{I}} = \\sqrt{\\frac{" + m3 + "}{" + I3 + "}} \\approx " + D(r2c(t3))) + " m.");
      },
      () => { /* énergie cinétique : calculer, isoler v (racine), isoler m */
        let m1, v1, m2, v3; do { m1 = ri(40, 120); v1 = ri(4, 15); m2 = ri(40, 120); v3 = ri(4, 15); } while (m1 === m2 || v1 === v3);
        const E = (m1 * v1 * v1) / 2, v2 = Math.sqrt((2 * E) / m2), m3 = (2 * E) / (v3 * v3);
        return P("L'énergie cinétique vaut " + M("E = \\frac{m v^2}{2}") + " (en J, " + M("m") + " en kg, " + M("v") + " en m/s). Un cycliste et son vélo ont une masse de " + M(m1) + " kg et roulent à " + M(v1) + " m/s.",
          [["a) Énergie cinétique (J)", E], ["b) Vitesse (m/s, au dixième) d'un objet de " + M(m2) + " kg qui a la même énergie", r1(v2), 0.1], ["c) Masse (kg, au dixième) d'un objet à " + M(v3) + " m/s qui a la même énergie", r1(m3), 0.1]],
          ["b) Isole v² : v² = 2E ÷ m, puis la racine carrée.", "c) Isole m : m = 2E ÷ v²."],
          "a) " + M("\\frac{" + m1 + " \\cdot " + v1 + "^2}{2} = " + nb(E)) + " J. b) " + M("v = \\sqrt{\\frac{2 \\cdot " + nb(E) + "}{" + m2 + "}} \\approx " + D(r1(v2))) + " m/s. c) " + M("m = \\frac{2 \\cdot " + nb(E) + "}{" + v3 + "^2} \\approx " + D(r1(m3))) + " kg.");
      },
    ],
    racprop: [
      () => { /* carré d'aire a²k : côté, diagonale et périmètre en valeur exacte */
        const k = pk([2, 3, 5, 6, 7]), a = ri(2, 6), A = a * a * k, s = a * Math.sqrt(k);
        const dg = k === 2 ? String(2 * a) : k === 6 ? 2 * a + "\\sqrt{3}" : a + "\\sqrt{" + 2 * k + "}";
        return P("Un carré a une aire de " + M(A) + " cm². Donne les réponses en valeur exacte simplifiée (par exemple " + M("3\\sqrt{5}") + ").",
          [["a) Côté (cm)", RAD(s)], ["b) Diagonale (cm)", RAD(s * Math.SQRT2)], ["c) Périmètre (cm)", RAD(4 * s)]],
          ["Côté = √" + A + " ; décompose " + A + " = " + a * a + " · " + k + " pour sortir le carré de la racine.",
           "Diagonale = côté · √2 (Pythagore). Simplifie √" + 2 * k + " si possible."],
          "a) " + M("\\sqrt{" + A + "} = \\sqrt{" + a * a + "}\\sqrt{" + k + "} = " + a + "\\sqrt{" + k + "}") + " cm. b) " + M(a + "\\sqrt{" + k + "} \\cdot \\sqrt{2} = " + a + "\\sqrt{" + 2 * k + "}" + (k === 2 || k === 6 ? " = " + dg : "")) + " cm. c) " + M("4 \\cdot " + a + "\\sqrt{" + k + "} = " + 4 * a + "\\sqrt{" + k + "}") + " cm.");
      },
      () => { /* triangle rectangle à cathètes p√s et q√s */
        const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), s = pk([2, 3, 5, 7]), hgt = (p * q * Math.sqrt(s)) / r;
        return P("Un triangle rectangle a des cathètes de " + M(p + "\\sqrt{" + s + "}") + " cm et " + M(q + "\\sqrt{" + s + "}") + " cm. Réponses en valeur exacte simplifiée.",
          [["a) Hypoténuse (cm)", RAD(r * Math.sqrt(s))], ["b) Aire (cm²)", (p * q * s) / 2], ["c) Hauteur relative à l'hypoténuse (cm, par exemple " + M("\\frac{12\\sqrt{3}}{5}") + ")", RAD(hgt)]],
          ["Pythagore : (" + p + "√" + s + ")² = " + p * p + " · " + s + " = " + p * p * s + ".", "c) L'aire vaut aussi ½ · hypoténuse · hauteur : hauteur = 2 · aire ÷ hypoténuse ; puis rends le dénominateur entier."],
          "a) " + M("\\sqrt{" + p * p * s + " + " + q * q * s + "} = \\sqrt{" + r * r * s + "} = " + r + "\\sqrt{" + s + "}") + ". b) " + M("\\frac{" + p + "\\sqrt{" + s + "} \\cdot " + q + "\\sqrt{" + s + "}}{2} = " + fx((p * q * s) / 2)) + " cm². c) " + M("\\frac{" + p * q * s + "}{" + r + "\\sqrt{" + s + "}} = " + (Number.isInteger((p * q) / r) ? (p * q) / r + "\\sqrt{" + s + "}" : "\\frac{" + (p * q) / gcd(p * q, r) + "\\sqrt{" + s + "}}{" + r / gcd(p * q, r) + "}")) + " cm.");
      },
    ],
    denombr: [
      () => { /* codes : total, sans répétition, avec au moins une répétition */
        const [s, w] = pk([[10, "chiffres (0 à 9)"], [9, "touches (1 à 9)"], [6, "couleurs"], [8, "symboles"]]), n = pk([3, 4, 5]);
        let arr = 1; for (let i = 0; i < n; i++) arr *= s - i;
        return P("Un code est formé de " + M(n) + " symboles choisis parmi " + s + " " + w + " ; l'ordre compte.",
          [["a) Nombre de codes possibles", s ** n], ["b) Nombre de codes dont tous les symboles sont différents", arr], ["c) Nombre de codes avec au moins une répétition", s ** n - arr]],
          ["a) Chaque position a " + s + " possibilités : principe multiplicatif. b) Chaque position a une possibilité de moins que la précédente.",
           "c) « Au moins une répétition » est le contraire de « tous différents » : soustrais."],
          "a) " + M(s + "^" + n + " = " + nb(s ** n)) + ". b) " + M(Array.from({ length: n }, (_, i) => s - i).join(" \\cdot ") + " = " + nb(arr)) + ". c) " + M(nb(s ** n) + " - " + nb(arr) + " = " + nb(s ** n - arr)) + ".");
      },
      () => { /* club : bureau, poignées de main, et l'inverse */
        let N, N2; do { N = ri(8, 20); N2 = ri(9, 30); } while (N === N2);
        const P2 = (N2 * (N2 - 1)) / 2;
        return P("Un club de " + M(N) + " membres élit son bureau, puis tout le monde se serre la main.",
          [["a) Nombre de façons d'élire un président, un secrétaire et un caissier (trois personnes différentes)", N * (N - 1) * (N - 2)], ["b) Nombre de poignées de main (chaque paire une fois)", (N * (N - 1)) / 2],
           ["c) Dans un autre club, on a compté " + M(nb(P2)) + " poignées de main. Combien de membres a-t-il ?", N2]],
          ["a) Les postes sont différents : l'ordre compte. b) Chacun serre " + (N - 1) + " mains, mais chaque poignée est comptée deux fois.",
           "c) n(n − 1) ÷ 2 = " + nbT(P2) + " ⇔ n(n − 1) = " + nbT(2 * P2) + " : cherche deux nombres entiers consécutifs dont le produit vaut " + nbT(2 * P2) + "."],
          "a) " + M(N + " \\cdot " + (N - 1) + " \\cdot " + (N - 2) + " = " + nb(N * (N - 1) * (N - 2))) + ". b) " + M("\\frac{" + N + " \\cdot " + (N - 1) + "}{2} = " + (N * (N - 1)) / 2) + ". c) " + M("n(n - 1) = " + nb(2 * P2) + " = " + N2 + " \\cdot " + (N2 - 1)) + " : " + M(N2) + " membres.");
      },
    ],
    cercthales: [
      () => { /* deux tangentes depuis un point : longueur, aire, corde de contact */
        const [p, q, c] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]]), k = c <= 10 ? ri(1, 3) : 1, sw = R.rand() < 0.5;
        const r = k * (sw ? q : p), PT = k * (sw ? p : q), OP = k * c, TT = (2 * r * PT) / OP;
        return P("D'un point " + M("P") + " situé à " + M(OP) + " cm du centre " + M("O") + " d'un cercle de rayon " + M(r) + " cm, on trace les deux tangentes " + M("[PT]") + " et " + M("[PT']") + ".",
          [["a) Longueur " + M("PT") + " (cm)", PT], ["b) Aire du quadrilatère " + M("OTPT'") + " (cm²)", r * PT], ["c) Longueur de la corde " + M("TT'") + " (cm, au dixième)", TT, 0.1]],
          ["Une tangente est perpendiculaire au rayon au point de contact : le triangle OTP est rectangle en T.",
           "b) Le quadrilatère est formé de deux triangles rectangles identiques. c) [TT'] est perpendiculaire à (OP) ; sa moitié est la hauteur du triangle OTP issue de T : aire = ½ · OP · hauteur."],
          "a) " + M("PT = \\sqrt{" + OP + "^2 - " + r + "^2} = " + PT) + " cm. b) " + M("2 \\cdot \\frac{" + r + " \\cdot " + PT + "}{2} = " + r * PT) + " cm². c) Hauteur " + M("\\frac{" + r + " \\cdot " + PT + "}{" + OP + "} = " + D(r2c((r * PT) / OP))) + ", " + M("TT' = 2 \\cdot " + D(r2c((r * PT) / OP)) + " \\approx " + D(r1(TT))) + " cm.");
      },
      () => { /* triangle inscrit dans un demi-cercle : côté, aire, hauteur */
        const [a, b, c] = pk([[6, 8, 10], [10, 24, 26], [12, 16, 20], [16, 30, 34], [9, 12, 15], [5, 12, 13], [8, 15, 17]]), k = c < 15 ? ri(1, 2) : 1;
        const AB = k * c, AC = k * a, BC = k * b, hh = (AC * BC) / AB;
        return P("Le point " + M("C") + " est sur le cercle de diamètre " + M("[AB]") + ", de rayon " + M(D(AB / 2)) + " cm. On sait que " + M("AC = " + AC) + " cm.",
          [["a) Longueur " + M("BC") + " (cm)", BC], ["b) Aire du triangle " + M("ABC") + " (cm²)", (AC * BC) / 2], ["c) Distance de " + M("C") + " au diamètre " + M("[AB]") + " (cm, au centième)", hh, 0.01]],
          ["Un triangle inscrit dans un demi-cercle (un côté = diamètre) est rectangle : en quel sommet ? Le diamètre mesure " + T(AB) + " cm.",
           "b) Aire = ½ · produit des cathètes. c) Cette distance est la hauteur relative à l'hypoténuse [AB] : aire = ½ · AB · hauteur."],
          "Triangle rectangle en " + M("C") + ", " + M("AB = " + AB) + ". a) " + M("BC = \\sqrt{" + AB + "^2 - " + AC + "^2} = " + BC) + " cm. b) " + M("\\frac{" + AC + " \\cdot " + BC + "}{2} = " + (AC * BC) / 2) + " cm². c) " + M("\\frac{" + AC * BC + "}{" + AB + "} \\approx " + D(r2c(hh))) + " cm.");
      },
    ],
    angles: [
      () => { /* polygone régulier : nombre de côtés, somme des angles, angle entre diagonales */
        const n = pk([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 36]), al = 180 - 360 / n;
        return P("Chaque angle intérieur d'un polygone régulier mesure " + M(D(al) + "°") + ".",
          [["a) Nombre de côtés", n], ["b) Somme des angles intérieurs (°)", (n - 2) * 180], ["c) Angle entre deux diagonales voisines issues d'un même sommet (°)", 180 / n]],
          ["L'angle extérieur vaut 180° − " + T(al) + "° et les angles extérieurs d'un polygone font un tour complet (360°).",
           "c) Le polygone est inscrit dans un cercle : les diagonales issues d'un sommet partagent l'angle intérieur en " + (n - 2) + " angles inscrits égaux, qui interceptent chacun un côté."],
          "a) Angle extérieur " + M(D(360 / n) + "°") + ", " + M("n = 360 \\div " + D(360 / n) + " = " + n) + ". b) " + M("(" + n + " - 2) \\cdot 180° = " + nb((n - 2) * 180) + "°") + ". c) " + M(D(al) + "° \\div " + (n - 2) + " = " + D(180 / n) + "°") + ".");
      },
      () => { /* angles inscrits et au centre */
        const al = ri(20, 80);
        return P("Les points " + M("A") + ", " + M("B") + ", " + M("C") + " et " + M("D") + " sont sur un cercle de centre " + M("O") + " ; " + M("C") + " et " + M("O") + " sont du même côté de " + M("(AB)") + ", " + M("D") + " de l'autre côté. " + M("\\widehat{ACB} = " + al + "°") + ".",
          [["a) " + M("\\widehat{AOB}") + " (°)", 2 * al], ["b) " + M("\\widehat{OAB}") + " (°)", 90 - al], ["c) " + M("\\widehat{ADB}") + " (°)", 180 - al]],
          ["L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc. Le triangle AOB est isocèle (OA = OB = rayon).",
           "c) D est sur l'autre arc : ACBD est un quadrilatère inscrit, ses angles opposés sont supplémentaires (somme 180°)."],
          "a) " + M("2 \\cdot " + al + "° = " + 2 * al + "°") + ". b) " + M("\\frac{180° - " + 2 * al + "°}{2} = " + (90 - al) + "°") + ". c) " + M("180° - " + al + "° = " + (180 - al) + "°") + ".");
      },
    ],
    /* ===================== 3e lot (24.11 soir) ===================== */
    /* ---------- 1re Collège : inéquations du 1er degré ---------- */
    ineq: [
      () => { /* rectangle : périmètre maximal et largeur minimale, puis aire maximale avec une largeur entière */
        let k, Pm, m, xm_;
        do { k = ri(3, 12); Pm = 2 * ri(20, 60); m = ri(2, 5); xm_ = (Pm - 2 * k) / 4; } while (Number.isInteger(xm_) || xm_ < m + 4);
        const w = Math.floor(xm_), n = w - m + 1, A = w * (w + k);
        return P("Un rectangle a une largeur de " + M("x") + " cm et une longueur de " + M("(x + " + k + ")") + " cm. Son périmètre ne doit pas dépasser " + M(Pm) + " cm et sa largeur doit valoir au moins " + M(m) + " cm.",
          [["a) Largeur maximale (cm)", xm_], ["b) Combien de largeurs entières (en cm) sont possibles ?", n], ["c) Aire maximale si la largeur est un nombre entier de cm (cm²)", A]],
          ["Périmètre : 2x + 2(x + " + k + ") ≤ " + Pm + ". Réduis, puis isole x.",
           "4x + " + 2 * k + " ≤ " + Pm + " donne x ≤ " + T(xm_) + ". Les largeurs entières vont de " + m + " à la partie entière de " + T(xm_) + " ; l'aire x(x + " + k + ") augmente avec x."],
          M("2x + 2(x + " + k + ") = 4x + " + 2 * k + " \\le " + Pm + " \\iff x \\le " + D(xm_)) + ". a) " + M(D(xm_)) + " cm. b) " + M("x \\in \\{" + m + " ; \\ldots ; " + w + "\\}") + " : " + M(n) + " valeurs. c) " + M(w + " \\cdot " + (w + k) + " = " + nb(A)) + " cm².");
      },
      () => { /* deux tarifs, puis budget : double condition */
        let FA, pA, FB, pB, s, Bud, b;
        do { pA = ri(6, 14); pB = ri(2, pA - 2); FA = 5 * ri(1, 6); FB = FA + 5 * ri(3, 16); s = (FB - FA) / (pA - pB); Bud = 10 * ri(8, 30); b = (Bud - FB) / pB; }
        while (Number.isInteger(s) || Number.isInteger(b) || b < s + 3 || b > 60);
        const n1 = Math.floor(s) + 1, n2 = Math.floor(b), cnt = n2 - n1 + 1;
        return P("Location d'un vélo électrique. Agence A : " + M(FA) + " CHF de prise en charge et " + M(pA) + " CHF par heure. Agence B : " + M(FB) + " CHF de prise en charge et " + M(pB) + " CHF par heure. On loue un nombre entier d'heures.",
          [["a) À partir de combien d'heures B est-elle strictement moins chère que A ?", n1], ["b) Budget de " + M(Bud) + " CHF chez B : nombre maximal d'heures", n2], ["c) Combien de durées (en heures entières) sont à la fois moins chères chez B et dans le budget ?", cnt]],
          ["a) Écris l'inéquation " + FB + " + " + pB + "x < " + FA + " + " + pA + "x et isole x (attention au sens si tu divises par un négatif).",
           "a) x > " + T(r2c(s)) + "… : prends l'entier suivant. b) " + FB + " + " + pB + "x ≤ " + Bud + ". c) Compte les entiers entre les deux bornes."],
          "a) " + M(FB + " + " + pB + "x < " + FA + " + " + pA + "x \\iff " + (FB - FA) + " < " + (pA - pB) + "x \\iff x > \\frac{" + (FB - FA) + "}{" + (pA - pB) + "} \\approx " + D(r2c(s))) + " : dès " + M(n1) + " h. b) " + M(pB + "x \\le " + (Bud - FB) + " \\iff x \\le " + D(r2c(b))) + " : " + M(n2) + " h. c) De " + M(n1) + " à " + M(n2) + " h : " + M(cnt) + " durées.");
      },
    ],
    /* ---------- 1re Collège : inéquations fractionnaires ---------- */
    ineqfrac: [
      () => { /* 1/(x − a) ≥ 1/(x − b) : on ne croise pas les produits ! */
        let a, b; do { a = ri(-7, 4); b = ri(a + 3, 8); } while (a === 0 || b === 0);
        const ge = pk([true, false]);
        const ivs = ge ? [[a, false, b, false]] : [[-Infinity, false, a, false], [b, false, Infinity, false]];
        const cnt = ge ? b - a - 1 : cntInt((x) => x < a || x > b);
        return P("On résout " + M("\\frac{1}{" + xm(a) + "} " + (ge ? "\\geq" : "\\leq") + " \\frac{1}{" + xm(b) + "}") + ".",
          [["a) En ramenant tout à gauche et au même dénominateur, le numérateur est un nombre : lequel ?", a - b], ["b) Ensemble des solutions (intervalles)", SOLS(ivs)], ["c) Combien d'entiers de " + M("-10") + " à " + M("10") + " sont solutions ?", cnt]],
          ["Piège : on ne peut pas « croiser » (le signe des dénominateurs change). Soustrais la seconde fraction et mets au dénominateur commun (" + xmT(a) + ")(" + xmT(b) + ").",
           "Le numérateur vaut (" + xmT(b) + ") − (" + xmT(a) + ") = " + (a - b) + " < 0. Le quotient a donc le signe CONTRAIRE de (" + xmT(a) + ")(" + xmT(b) + ") : tableau de signes, valeurs interdites exclues."],
          M("\\frac{1}{" + xm(a) + "} - \\frac{1}{" + xm(b) + "} = \\frac{(" + xm(b) + ") - (" + xm(a) + ")}{(" + xm(a) + ")(" + xm(b) + ")} = \\frac{" + (a - b) + "}{(" + xm(a) + ")(" + xm(b) + ")}") + ". a) " + M(a - b) + ". b) Il faut " + M("(" + xm(a) + ")(" + xm(b) + ")" + (ge ? " < 0" : " > 0")) + " : " + M("S = " + SolSet.show(ivs, true)) + ". c) " + M(cnt) + " entiers.");
      },
      () => { /* coût moyen d'une production */
        let F, c, t1, t2, n1, n2;
        do { F = 50 * ri(10, 60); c = ri(3, 15); t1 = c + ri(2, 9); t2 = t1 + ri(1, 4); n1 = F / (t1 - c); n2 = F / (t2 - c); } while (Number.isInteger(n1) || Number.isInteger(n2) || n1 > 2000 || n1 - n2 < 5);
        const m1 = Math.ceil(n1), m2 = Math.ceil(n2);
        return P("Un atelier fabrique des lampes : " + M(nb(F)) + " CHF de frais fixes, puis " + M(c) + " CHF par lampe. Le coût moyen d'une lampe est " + M("C(n) = \\frac{" + nb(F) + " + " + c + "n}{n}") + " (" + M("n") + " lampes).",
          [["a) Nombre minimal de lampes pour un coût moyen d'au plus " + M(t1) + " CHF", m1], ["b) Et pour un coût moyen d'au plus " + M(t2) + " CHF", m2], ["c) Coût moyen (CHF, au centième) si l'on fabrique " + m2 + " lampes", (F + c * m2) / m2, 0.01]],
          ["C(n) ≤ " + t1 + " : n > 0, donc on peut multiplier les deux membres par n sans changer le sens.",
           nbT(F) + " + " + c + "n ≤ " + t1 + "n donne " + nbT(F) + " ≤ " + (t1 - c) + "n. Le nombre de lampes est entier : arrondis vers le haut."],
          "a) " + M(nb(F) + " + " + c + "n \\le " + t1 + "n \\iff n \\geq \\frac{" + nb(F) + "}{" + (t1 - c) + "} \\approx " + D(r2c(n1))) + " : " + M(nb(m1)) + " lampes. b) " + M("n \\geq \\frac{" + nb(F) + "}{" + (t2 - c) + "} \\approx " + D(r2c(n2))) + " : " + M(nb(m2)) + " lampes. c) " + M("\\frac{" + nb(F + c * m2) + "}{" + m2 + "} \\approx " + D(r2c((F + c * m2) / m2))) + " CHF (au plus " + t2 + ").");
      },
    ],
    /* ---------- 1re Collège : valeurs exactes (racines) ---------- */
    exactes: [
      () => { /* cube : diagonale d'une face, diagonale du cube, section diagonale */
        const a = pk([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        return P("Un cube a une arête de " + M(a) + " cm. On le coupe par le plan qui passe par deux arêtes opposées (la section est un rectangle).",
          [["a) Diagonale d'une face (cm, valeur exacte)", RAD(a * Math.SQRT2)], ["b) Diagonale du cube (cm, valeur exacte)", RAD(a * Math.sqrt(3))], ["c) Aire de la section (cm², valeur exacte)", RAD(a * a * Math.SQRT2)]],
          ["Pythagore dans une face, puis dans le triangle rectangle formé par une arête, une diagonale de face et la diagonale du cube.",
           "d² = " + a + "² + " + a + "² ; D² = d² + " + a + "². La section a pour côtés une arête et une diagonale de face. Simplifie √(" + 2 * a * a + ") = " + a + "√2."],
          "a) " + M("d = \\sqrt{" + a + "^2 + " + a + "^2} = \\sqrt{" + 2 * a * a + "} = " + a + "\\sqrt{2}") + " cm. b) " + M("D = \\sqrt{" + 2 * a * a + " + " + a * a + "} = \\sqrt{" + 3 * a * a + "} = " + a + "\\sqrt{3}") + " cm. c) " + M(a + " \\cdot " + a + "\\sqrt{2} = " + a * a + "\\sqrt{2}") + " cm².");
      },
      () => { /* hexagone régulier : six triangles équilatéraux */
        const a = pk([2, 4, 6, 8, 10, 12]), h = (a / 2) * Math.sqrt(3), Ah = 1.5 * a * a * Math.sqrt(3);
        return P("Un hexagone régulier a des côtés de " + M(a) + " cm (il est formé de six triangles équilatéraux).",
          [["a) Distance entre deux côtés opposés (cm, valeur exacte)", RAD(a * Math.sqrt(3))], ["b) Aire de l'hexagone (cm², valeur exacte)", RAD(Ah)], ["c) Aire du disque inscrit dans l'hexagone (cm², au dixième)", Math.PI * h * h, 0.1]],
          ["Hauteur d'un triangle équilatéral de côté " + a + " : Pythagore avec la moitié du côté, " + a / 2 + ".",
           "h = " + (a / 2 === 1 ? "" : a / 2) + "√3. La distance entre deux côtés opposés vaut deux hauteurs ; le rayon du disque inscrit vaut une hauteur."],
          M("h = \\sqrt{" + a + "^2 - " + a / 2 + "^2} = \\sqrt{" + 0.75 * a * a + "} = " + (a / 2 === 1 ? "" : a / 2) + "\\sqrt{3}") + ". a) " + M("2h = " + a + "\\sqrt{3}") + " cm. b) " + M("6 \\cdot \\frac{" + a + " \\cdot " + (a / 2 === 1 ? "" : a / 2) + "\\sqrt{3}}{2} = " + 1.5 * a * a + "\\sqrt{3}") + " cm². c) " + M("\\pi h^2 = " + 0.75 * a * a + "\\pi \\approx " + D(r1(Math.PI * h * h))) + " cm².");
      },
    ],
    /* ---------- 1re Collège : modéliser par une fonction affine ---------- */
    modaff: [
      () => { /* trois offres : à l'unité, abonnement, forfait illimité */
        let pA, pB, n1, FB, FC, s, best;
        do {
          pA = ri(12, 25); pB = ri(5, pA - 4); n1 = ri(6, 18); FB = (pA - pB) * n1; FC = 10 * ri(Math.ceil((FB + pB * (n1 + 4)) / 10), 120); s = (FC - FB) / pB;
          best = cntInt((n) => FB + pB * n < pA * n && FB + pB * n < FC, 1, 50);
        } while (Number.isInteger(s) || s > 45 || s < n1 + 4);
        return P("Piscine. Offre A : " + M(pA) + " CHF l'entrée. Offre B : carte annuelle à " + M(FB) + " CHF, puis " + M(pB) + " CHF l'entrée. Offre C : abonnement illimité à " + M(FC) + " CHF par an.",
          [["a) Nombre d'entrées pour lequel A et B coûtent la même chose", n1], ["b) À partir de combien d'entrées C est-elle strictement moins chère que B ?", Math.floor(s) + 1], ["c) Pour combien de nombres d'entrées de 1 à 50 l'offre B est-elle strictement la moins chère des trois ?", best]],
          ["Coûts pour n entrées : A(n) = " + pA + "n, B(n) = " + FB + " + " + pB + "n, C(n) = " + FC + ". Pour a) résous A(n) = B(n).",
           "b) " + FB + " + " + pB + "n > " + FC + ". c) B est la moins chère après le croisement avec A et avant le croisement avec C : compte les entiers entre les deux."],
          "a) " + M(pA + "n = " + FB + " + " + pB + "n \\iff " + (pA - pB) + "n = " + FB + " \\iff n = " + n1) + ". b) " + M(FB + " + " + pB + "n > " + FC + " \\iff n > \\frac{" + (FC - FB) + "}{" + pB + "} \\approx " + D(r2c(s))) + " : dès " + M(Math.floor(s) + 1) + " entrées. c) B est strictement la moins chère de " + M(n1 + 1) + " à " + M(Math.floor(s)) + " entrées : " + M(best) + " valeurs.");
      },
    ],
    /* ---------- 1re Collège : zéro, signe, comparaison de fonctions affines ---------- */
    affzero: [
      () => { /* deux bougies : zéros et intersection de deux fonctions affines décroissantes */
        let v1, v2, tc, h2, h1;
        do { v2 = ri(2, 5); v1 = v2 + ri(1, 4); tc = ri(2, 6); h2 = ri(v2 * tc + 4, 40); h1 = h2 + (v1 - v2) * tc; } while (h1 % v1 === 0 || h2 % v2 === 0 || h1 > 45);
        const hc = h2 - v2 * tc, e1 = h1 / v1, e2 = h2 / v2;
        return P("Deux bougies sont allumées en même temps. La première mesure " + M(h1) + " cm et raccourcit de " + M(v1) + " cm par heure ; la seconde mesure " + M(h2) + " cm et raccourcit de " + M(v2) + " cm par heure.",
          [["a) Après combien d'heures ont-elles la même hauteur ?", tc], ["b) Hauteur commune (cm)", hc], ["c) Pendant combien de temps (h, au centième) la seconde brûle-t-elle encore après l'extinction de la première ?", e2 - e1, 0.01]],
          ["Hauteurs après t heures : h₁(t) = " + h1 + " − " + v1 + "t et h₂(t) = " + h2 + " − " + v2 + "t. Pour a) résous h₁(t) = h₂(t).",
           "c) Chaque bougie s'éteint au zéro de sa fonction : h₁(t) = 0 et h₂(t) = 0. Fais la différence des deux instants."],
          "a) " + M(h1 + " - " + v1 + "t = " + h2 + " - " + v2 + "t \\iff " + (h1 - h2) + " = " + (v1 - v2) + "t \\iff t = " + tc) + " h. b) " + M(h2 + " - " + v2 + " \\cdot " + tc + " = " + hc) + " cm. c) Extinctions : " + M("t = \\frac{" + h1 + "}{" + v1 + "} \\approx " + D(r2c(e1))) + " h et " + M("t = \\frac{" + h2 + "}{" + v2 + "} \\approx " + D(r2c(e2))) + " h, écart " + M("\\approx " + D(r2c(e2 - e1))) + " h.");
      },
      () => { /* f et g affines : zéros fractionnaires, intersection, entiers où les deux sont positives */
        let a, b, c, d, xi, z1, z2;
        do { a = R.nz(-5, 5); b = R.nz(-9, 9); c = R.nz(-5, 5); d = R.nz(-9, 9); xi = (d - b) / (a - c); z1 = -b / a; z2 = -d / c; }
        while (a === c || Math.abs(a) === 1 || Number.isInteger(z1) || !Number.isInteger(xi) || xi === 0 || Math.abs(z1) > 9 || Math.abs(z2) > 9 || z1 === z2 || (a > 0) === (c > 0) || cntInt((x) => a * x + b > 0 && c * x + d > 0) < 2);
        const both = cntInt((x) => a * x + b > 0 && c * x + d > 0);
        return P("On donne " + M("f(x) = " + poly([a, b])) + " et " + M("g(x) = " + poly([c, d])) + ".",
          [["a) Zéro de " + M("f") + " (fraction)", z1], ["b) Abscisse du point où " + M("f(x) = g(x)"), xi], ["c) Combien d'entiers de " + M("-10") + " à " + M("10") + " vérifient à la fois " + M("f(x) > 0") + " et " + M("g(x) > 0") + " ?", both]],
          ["Le zéro de f est la solution de f(x) = 0. Pour c), résous les deux inéquations séparément (attention au sens quand tu divises par un nombre négatif).",
           "Une pente est positive, l'autre négative : l'une des inéquations donne x > …, l'autre x < … ; garde les entiers entre les deux bornes."],
          "a) " + M(poly([a, b]) + " = 0 \\iff x = " + fx(z1)) + ". b) " + M(poly([a, b]) + " = " + poly([c, d]) + " \\iff " + (a - c) + "x = " + (d - b) + " \\iff x = " + xi) + ". c) " + M("f(x) > 0 \\iff x " + (a > 0 ? ">" : "<") + " " + fx(z1)) + " et " + M("g(x) > 0 \\iff x " + (c > 0 ? ">" : "<") + " " + fx(z2)) + " : " + M(both) + " entiers.");
      },
    ],
    /* ---------- MP 2e : quartiles et valeurs extrêmes (série NON triée) ---------- */
    quartiles: [
      () => {
        let base, s, q1, q3, th, o, ext;
        do {
          base = Array.from({ length: 10 }, () => ri(8, 45)).sort((u, v) => u - v);
          const eiq0 = base[8] - base[2];
          o = Math.ceil(base[8] + 1.5 * eiq0) + ri(1, 12);
          s = [...base, o].sort((u, v) => u - v); q1 = s[2]; q3 = s[8]; th = q3 + 1.5 * (q3 - q1);
          ext = s.filter((v) => v > th || v < q1 - 1.5 * (q3 - q1)).length;
        } while (o <= base[9] || q3 - q1 < 6 || o > 140 || new Set(s).size < 9);
        const m = s[5], m2 = (base[4] + base[5]) / 2;
        const shown = [...s]; for (let i = shown.length - 1; i > 0; i--) { const j = ri(0, i); [shown[i], shown[j]] = [shown[j], shown[i]]; }
        return P("Temps de trajet (min) de 11 apprentis, dans l'ordre des réponses : " + shown.join(" ; ") + ".",
          [["a) Médiane (min)", m], ["b) Écart interquartile (min)", q3 - q1], ["c) Combien de valeurs extrêmes (au-delà de " + M("Q_3 + 1{,}5 \\cdot \\text{EIQ}") + " ou en deçà de " + M("Q_1 - 1{,}5 \\cdot \\text{EIQ}") + ") ?", ext], ["d) La plus grande valeur était une erreur de saisie : on la retire. Nouvelle médiane (min)", m2]],
          ["Commence par TRIER la série. 11 valeurs : la médiane est la 6e, Q1 la 3e et Q3 la 9e (médianes des 5 valeurs de chaque côté).",
           "Seuils : Q1 − 1,5 · EIQ et Q3 + 1,5 · EIQ. d) Il reste 10 valeurs : la médiane est la moyenne de la 5e et de la 6e."],
          "Série triée : " + s.join(" ; ") + ". a) " + M(m) + " min. b) " + M("Q_1 = " + q1) + ", " + M("Q_3 = " + q3) + ", " + M("\\text{EIQ} = " + (q3 - q1)) + " min. c) Seuils " + M(D(q1 - 1.5 * (q3 - q1))) + " et " + M(D(th)) + " : " + M(ext) + " valeur" + (ext > 1 ? "s" : "") + " extrême" + (ext > 1 ? "s" : "") + ". d) " + M("\\frac{" + base[4] + " + " + base[5] + "}{2} = " + D(m2)) + " min.");
      },
    ],
    /* ---------- MP 2e : fréquences, diagramme circulaire, puis équation sur une fréquence ---------- */
    statfreq: [
      () => {
        let n, c, ang, mm, p, ok;
        do {
          n = pk([40, 60, 80, 120]); c = ri(Math.round(n / 10), Math.round(n / 4)); ang = (c / n) * 360;
          ok = false;
          for (let t = 0; t < 40 && !ok; t++) { mm = ri(4, n); p = (100 * (c + mm)) / (n + mm); ok = Number.isInteger(p); }
        } while (!Number.isInteger(ang) || !ok || !Number.isInteger((1000 * c) / n));
        const fq = (100 * c) / n;
        return P("Sondage auprès de " + M(n) + " apprentis sur leur moyen de transport : " + M(c) + " viennent à vélo.",
          [["a) Fréquence du vélo (%)", fq], ["b) Angle du secteur « vélo » dans un diagramme circulaire (°)", ang], ["c) On interroge encore des apprentis, tous cyclistes. La part du vélo passe alors à " + M(p + "\\,\\%") + ". Combien d'apprentis a-t-on ajoutés ?", mm]],
          ["Fréquence = effectif ÷ total. Angle = fréquence · 360°.",
           "c) Appelle x le nombre ajouté : (" + c + " + x) ÷ (" + n + " + x) = " + T(p / 100) + ". Multiplie par (" + n + " + x) et isole x."],
          "a) " + M("\\frac{" + c + "}{" + n + "} = " + D(fq) + "\\,\\%") + ". b) " + M("\\frac{" + c + "}{" + n + "} \\cdot 360° = " + D(ang) + "°") + ". c) " + M(c + " + x = " + D(p / 100) + "(" + n + " + x) \\iff " + D(1 - p / 100) + "x = " + D(r2c((p / 100) * n - c)) + " \\iff x = " + mm) + " apprentis.");
      },
    ],
    /* ---------- MP 2e : cercle trigonométrique ---------- */
    /* 26.11 soir (agent defis3) : + grande roue et arroseur (coordonnées exactes), 3 contextes. */
    trigcercle: [
      () => {
        const th = pk([120, 135, 150, 210, 225, 240, 300, 315, 330]), d = th % 45 === 0 ? 4 : 6, k = (th * d) / 180;
        const ref = th < 180 ? 180 - th : th < 270 ? th - 180 : 360 - th, cq = th > 90 && th < 270 ? -1 : 1;
        const cx = { 30: "\\frac{\\sqrt{3}}{2}", 45: "\\frac{\\sqrt{2}}{2}", 60: "\\frac{1}{2}" }[ref];
        const sameSin = (540 - th) % 360, sameCos = 360 - th;
        return Object.assign(P("On considère l'angle " + M("\\theta = " + th + "°") + ".",
          [["a) En radians, " + M("\\theta = \\frac{k\\pi}{" + d + "}") + " : que vaut " + M("k") + " ?", k], ["b) " + M("\\cos\\theta") + " (valeur exacte)", RAD(Math.cos(rad(th)))], ["c) L'autre angle de " + M("[0° ; 360°[") + " qui a le même sinus (°)", sameSin], ["d) L'autre angle de " + M("[0° ; 360°[") + " qui a le même cosinus (°)", sameCos]],
          ["180° = π rad. Repère le quadrant de θ et son angle de référence (l'écart avec l'axe horizontal), ici " + ref + "°.",
           "Même sinus : symétrique par rapport à l'axe vertical (180° − θ, ramené dans [0° ; 360°[). Même cosinus : symétrique par rapport à l'axe horizontal (360° − θ)."],
          "a) " + M(th + "° = " + th + " \\cdot \\frac{\\pi}{180} = \\frac{" + k + "\\pi}{" + d + "}") + ". b) Angle de référence " + M(ref + "°") + ", cosinus " + (cq < 0 ? "négatif" : "positif") + " : " + M("\\cos\\theta = " + (cq < 0 ? "-" : "") + cx) + ". c) " + M("180° - " + th + "° = " + (180 - th) + "°") + (180 - th < 0 ? ", soit " + M(sameSin + "°") : "") + ". d) " + M("360° - " + th + "° = " + sameCos + "°") + "."), { ctx: "angle" });
      },
      () => { /* grande roue ou arroseur : coordonnées exactes d'un point du cercle de rayon R */
        const th = pk([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), d = th % 45 === 0 ? 4 : 6, k = (th * d) / 180, R0 = pk([10, 20, 30, 40]), c = R0 * Math.cos(rad(th)), sn = R0 * Math.sin(rad(th));
        const ref = th < 90 ? th : th < 180 ? 180 - th : th < 270 ? th - 180 : 360 - th, ex = (f, sg) => { const v = { 30: [R0 / 2, ""], 60: [R0 / 2, "\\sqrt{3}"], 45: [R0 / 2, "\\sqrt{2}"] }[f === "cos" ? (ref === 30 ? 60 : ref === 60 ? 30 : 45) : ref]; return (sg < 0 ? "-" : "") + v[0] + v[1]; };
        const [cx, txt, lx, ly] = pk([["roue", "Une grande roue a un rayon de " + R0 + " m. Une nacelle est repérée par l'angle " + M("\\theta = " + th + "°") + " (mesuré depuis l'horizontale, dans le sens inverse des aiguilles d'une montre, à partir du centre).", "Abscisse de la nacelle dans un repère centré sur l'axe de la roue (m, valeur exacte)", "Ordonnée de la nacelle dans ce repère (m, valeur exacte)"],
          ["arroseur", "Un arroseur rotatif a une portée de " + R0 + " m. Son jet fait l'angle " + M("\\theta = " + th + "°") + " avec la direction est (sens inverse des aiguilles d'une montre). On repère le point arrosé par ses coordonnées (est ; nord) en mètres.", "Coordonnée est du point arrosé (m, valeur exacte)", "Coordonnée nord du point arrosé (m, valeur exacte)"]]);
        return Object.assign(P(txt, [["a) En radians, " + M("\\theta = \\frac{k\\pi}{" + d + "}") + " : que vaut " + M("k") + " ?", k], ["b) " + lx, RAD(c)], ["c) " + ly, RAD(sn)]],
          ["Le point est " + M("(R\\cos\\theta \\,;\\, R\\sin\\theta)") + " avec R = " + R0 + ".", "Angle de référence " + ref + "° ; les signes dépendent du quadrant."],
          "a) " + M(th + "° = \\frac{" + k + "\\pi}{" + d + "}") + ". b) " + M(R0 + "\\cos " + th + "° = " + ex("cos", Math.sign(Math.round(c * 1e9)))) + ". c) " + M(R0 + "\\sin " + th + "° = " + ex("sin", Math.sign(Math.round(sn * 1e9)))) + "."), { ctx: cx });
      },
    ],
    /* ---------- 4e Collège : matrices et systèmes (Cramer, puis paramètre) ---------- */
    matrices: [
      () => {
        let a, b, c, d, x, y, det, m;
        do { a = R.nz(-6, 6); b = R.nz(-6, 6); c = R.nz(-6, 6); d = R.nz(-6, 6); x = R.nz(-7, 7); y = R.nz(-7, 7); det = a * d - b * c; m = (b * c) / a; }
        while (Math.abs(det) < 2 || Math.abs(det) > 15 || !Number.isInteger(m) || m === d || m === 0 || x === y || Math.abs(a) === 1 && Math.abs(b) === 1);
        const e = a * x + b * y, f = c * x + d * y;
        const sys = M("\\begin{cases} " + poly([a, 0]).replace(/x$/, "x") + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "y = " + e + " \\\\ " + poly([c, 0]).replace(/x$/, "x") + (d < 0 ? " - " + (d === -1 ? "" : -d) : " + " + (d === 1 ? "" : d)) + "y = " + f + " \\end{cases}");
        return P("On résout le système " + sys + " à l'aide de sa matrice " + M("A = \\begin{pmatrix} " + a + " & " + b + " \\\\ " + c + " & " + d + " \\end{pmatrix}") + ".",
          [["a) " + M("\\det A"), det], ["b) " + M("x"), x], ["c) " + M("y"), y], ["d) On remplace le coefficient " + M(d) + " de " + M("y") + " (2e équation) par " + M("m") + ". Pour quelle valeur de " + M("m") + " le système n'a-t-il plus une solution unique ?", m]],
          ["det A = " + tT(a) + " · " + tT(d) + " − " + tT(b) + " · " + tT(c) + ". Cramer : x = det(A remplacée colonne 1 par les seconds membres) ÷ det A, idem pour y avec la colonne 2.",
           "d) Il n'y a plus de solution unique quand le déterminant est nul : " + tT(a) + " · m − " + tT(b) + " · " + tT(c) + " = 0."],
          "a) " + M(pr(a) + " \\cdot " + pr(d) + " - " + pr(b) + " \\cdot " + pr(c) + " = " + det) + ". b) " + M("x = \\frac{" + pr(e) + " \\cdot " + pr(d) + " - " + pr(b) + " \\cdot " + pr(f) + "}{" + det + "} = \\frac{" + (e * d - b * f) + "}{" + det + "} = " + x) + ". c) " + M("y = \\frac{" + pr(a) + " \\cdot " + pr(f) + " - " + pr(e) + " \\cdot " + pr(c) + "}{" + det + "} = \\frac{" + (a * f - e * c) + "}{" + det + "} = " + y) + ". d) " + M(pr(a) + "m - " + pr(b * c) + " = 0 \\iff m = " + m) + ".");
      },
    ],
    /* ---------- MP 2e : angles associés (sinus donné, quadrant donné) ---------- */
    trigassoc: [
      () => {
        const [p, q, h] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]);
        const quad = pk([2, 3, 4]), sv = (quad === 2 ? 1 : -1) * p, cv = (quad === 4 ? 1 : -1) * q;
        const zone = { 2: "]90° ; 180°[", 3: "]180° ; 270°[", 4: "]270° ; 360°[" }[quad];
        const fr = (n) => (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + h + "}";
        return P("On sait que " + M("\\sin\\alpha = " + fr(sv)) + " et que " + M("\\alpha \\in " + zone) + ".",
          [["a) " + M("\\cos\\alpha") + " (fraction)", cv / h], ["b) " + M("\\tan\\alpha") + " (fraction)", sv / cv], ["c) " + M("\\sin(180° + \\alpha) + \\cos(180° - \\alpha)") + " (fraction)", (-sv - cv) / h]],
          ["sin²α + cos²α = 1 donne cos²α = 1 − " + p * p + "/" + h * h + ". Le signe de cos α dépend du quadrant de α.",
           "tan α = sin α ÷ cos α. Sur le cercle : 180° + α est le symétrique par rapport à l'origine (sinus opposé), 180° − α le symétrique par rapport à l'axe vertical (cosinus opposé)."],
          "a) " + M("\\cos^2\\alpha = 1 - \\frac{" + p * p + "}{" + h * h + "} = \\frac{" + q * q + "}{" + h * h + "}") + " ; dans " + M(zone) + " le cosinus est " + (cv < 0 ? "négatif" : "positif") + " : " + M("\\cos\\alpha = " + fr(cv)) + ". b) " + M("\\tan\\alpha = " + (sv * cv < 0 ? "-" : "") + "\\frac{" + p + "}{" + q + "}") + ". c) " + M("-\\sin\\alpha - \\cos\\alpha = " + fr(-sv - cv)) + ".");
      },
    ],
    /* ---------- MP 2e : fonction sinusoïdale (degrés) ---------- */
    trigfn: [
      () => {
        const A = ri(2, 6), b = pk([2, 3, 4, 5, 6]), d = R.nz(-3, 5), per = 360 / b, x1 = 30 / b, x2 = 150 / b;
        return P("On étudie " + M("f(x) = " + A + "\\sin(" + b + "x)" + sgD(d)) + " (" + M("x") + " en degrés).",
          [["a) Période (°)", per], ["b) Plus petite solution " + M("x > 0") + " de " + M("f(x) = " + fx(d + A / 2)) + " (°)", x1], ["c) Deuxième solution positive (°)", x2], ["d) Nombre de solutions de " + M("f(x) = " + fx(d + A / 2)) + " dans " + M("[0° ; 360°[") , 2 * b]],
          ["Période de sin(bx) : 360° ÷ b. Pour l'équation : isole sin(" + b + "x).",
           "sin(" + b + "x) = 1/2 : " + b + "x = 30° ou " + b + "x = 150° (+ un multiple de 360°). Deux solutions par période."],
          "a) " + M("360° \\div " + b + " = " + D(per) + "°") + ". " + M(A + "\\sin(" + b + "x)" + sgD(d) + " = " + fx(d + A / 2) + " \\iff \\sin(" + b + "x) = \\frac{1}{2}") + ". b) " + M(b + "x = 30° \\Rightarrow x = " + D(x1) + "°") + ". c) " + M(b + "x = 150° \\Rightarrow x = " + D(x2) + "°") + ". d) Deux solutions par période, " + M(b) + " périodes dans " + M("[0° ; 360°[") + " : " + M(2 * b) + " solutions.");
      },
    ],
    /* ---------- 4e Collège : loi normale (règle 68 – 95 – 99,7) ---------- */
    normale: [
      () => {
        const hh = { 1: 34, 2: 47.5, 3: 49.85 };
        const mu = pk([250, 500, 750, 1000]), s = ri(2, 8);
        let k1, k2; do { k1 = pk([1, 2, 3]); k2 = pk([1, 2, 3]); } while (k1 === k2);
        const k3 = pk([1, 2]), pa = hh[k1] + hh[k2], pb = 50 - hh[k3], N = 2000;
        return P("Une machine remplit des paquets ; leur masse " + M("X") + " suit une loi normale de moyenne " + M(mu + " \\text{ g}") + " et d'écart-type " + M(s + " \\text{ g}") + ".",
          [["a) " + M("P(" + (mu - k1 * s) + " \\leq X \\leq " + (mu + k2 * s) + ")") + " en %", pa], ["b) Sur " + M(nb(N)) + " paquets, combien pèsent plus de " + M(mu + k3 * s + " \\text{ g}") + " ?", (N * pb) / 100], ["c) On veut que seulement 2,5 % des paquets pèsent moins de " + M(mu - s + " \\text{ g}") + ", sans changer l'écart-type. Nouvelle moyenne (g)", mu + s]],
          ["Exprime chaque borne en écarts-types depuis la moyenne. Règle : 68 % à ±1σ, 95 % à ±2σ, 99,7 % à ±3σ, et la courbe est symétrique (moitiés : 34 %, 47,5 %, 49,85 %).",
           "b) Au-dessus de μ + " + k3 + "σ : 50 % − " + T(hh[k3]) + " %. c) 2,5 % en dessous, c'est μ − 2σ : il faut " + (mu - s) + " = μ' − 2 · " + s + "."],
          "a) " + M((mu - k1 * s) + " = \\mu - " + k1 + "\\sigma") + " et " + M((mu + k2 * s) + " = \\mu + " + k2 + "\\sigma") + " : " + M(D(hh[k1]) + " + " + D(hh[k2]) + " = " + D(pa) + "\\,\\%") + ". b) " + M(D(pb) + "\\,\\% \\cdot " + nb(N) + " = " + nb((N * pb) / 100)) + " paquets. c) " + M("\\mu' - 2 \\cdot " + s + " = " + (mu - s) + " \\iff \\mu' = " + (mu + s)) + " g.");
      },
    ],
    /* ---------- 4e Collège : loi binomiale (surréservation) ---------- */
    binomiale: [
      () => {
        const m = ri(8, 18), n = m + 2, p = pk([0.75, 0.8, 0.85, 0.9, 0.95]), q = 1 - p;
        const pn = p ** n, pn1 = n * p ** (n - 1) * q, risk = 100 * (pn + pn1);
        return P("Une compagnie vend " + M(n) + " billets pour un vol de " + M(m) + " places. Chaque passager se présente avec la probabilité " + M(D(p)) + ", indépendamment des autres. " + M("X") + " = nombre de passagers présents.",
          [["a) " + M("E(X)"), n * p], ["b) " + M("P(X = " + n + ")") + " en % (au dixième)", 100 * pn, 0.1], ["c) Probabilité que des passagers restent au sol, en % (au dixième)", risk, 0.1]],
          ["X suit une loi binomiale B(" + n + " ; " + T(p) + ") : E(X) = n · p. P(X = k) = C(n ; k) · pᵏ · (1 − p)ⁿ⁻ᵏ.",
           "c) Des passagers restent au sol si X > " + m + ", c'est-à-dire X = " + (n - 1) + " ou X = " + n + " : additionne les deux probabilités (C(" + n + " ; " + (n - 1) + ") = " + n + ")."],
          "a) " + M(n + " \\cdot " + D(p) + " = " + D(n * p)) + ". b) " + M(D(p) + "^{" + n + "} \\approx " + D(r1(100 * pn)) + "\\,\\%") + ". c) " + M("P(X = " + (n - 1) + ") = " + n + " \\cdot " + D(p) + "^{" + (n - 1) + "} \\cdot " + D(r2c(q)) + " \\approx " + D(r1(100 * pn1)) + "\\,\\%") + ", donc " + M("P(X > " + m + ") \\approx " + D(r1(risk)) + "\\,\\%") + ".");
      },
    ],
    /* ---------- 3e Collège : optimisation par la dérivée ---------- */
    /* 26.11 soir (agent defis3) : + potager le long d'un mur ; volumes de conserve plus variés ; 3 contextes. */
    optimderiv: [
      () => { /* boîte dans une feuille rectangulaire, comparée à la feuille carrée de même périmètre */
        const L = [];
        for (let a = 10; a <= 40; a++) for (let b = 6; b < a; b++) {
          const dd = 16 * (a + b) ** 2 - 48 * a * b, r = Math.round(Math.sqrt(dd));
          if (r * r !== dd) continue; const x = (4 * (a + b) - r) / 24; if (Number.isInteger(x) && x > 0 && 2 * x < b && (a + b) % 2 === 0) L.push([a, b, x]);
        }
        const [a, b, x] = pk(L), V = x * (a - 2 * x) * (b - 2 * x), c = (a + b) / 2, Vc = (2 * c ** 3) / 27;
        return Object.assign(P("Dans une feuille de " + M(a) + " cm sur " + M(b) + " cm, on découpe un carré de côté " + M("x") + " à chaque coin et on replie pour faire une boîte sans couvercle.",
          [["a) Valeur de " + M("x") + " qui rend le volume maximal (cm)", x], ["b) Volume maximal (cm³)", V], ["c) Avec une feuille CARRÉE de même périmètre, volume maximal (cm³, au dixième)", Vc, 0.1]],
          ["V(x) = x(" + a + " − 2x)(" + b + " − 2x), pour 0 < x < " + T(b / 2) + ". Développe, puis dérive.",
           "V'(x) = 12x² − " + 4 * (a + b) + "x + " + a * b + " ; résous V'(x) = 0 et garde la solution comprise entre 0 et " + T(b / 2) + ". Feuille carrée de côté " + T(c) + " : V(x) = x(" + T(c) + " − 2x)²."],
          M("V(x) = " + poly([4, -2 * (a + b), a * b, 0]) + ", \\; V'(x) = " + poly([12, -4 * (a + b), a * b])) + ", zéros " + M(x) + " et " + M(fx((4 * (a + b)) / 12 - x)) + " (hors domaine). a) " + M("x = " + x) + " cm. b) " + M(x + " \\cdot " + (a - 2 * x) + " \\cdot " + (b - 2 * x) + " = " + nb(V)) + " cm³. c) Côté " + M(D(c)) + ", " + M("x = " + fx(c / 6)) + ", " + M("V = \\frac{2 \\cdot " + D(c) + "^3}{27} \\approx " + D(r1(Vc))) + " cm³" + (Vc > V ? " : la feuille carrée donne une boîte plus grande." : ".")), { ctx: "boite" });
      },
      () => { /* boîte de conserve de volume donné, surface minimale */
        const V = pk([250, 330, 400, 500, 600, 750, 850, 1000, 1500, 2000]), r = Math.cbrt(V / (2 * Math.PI)), h = V / (Math.PI * r * r), S = 2 * Math.PI * r * r + 2 * V / r;
        return Object.assign(P("Une boîte de conserve cylindrique doit contenir " + M(nb(V) + " \\text{ cm}^3") + ". On veut utiliser le moins de métal possible (surface totale minimale).",
          [["a) Rayon optimal (cm, au dixième)", r, 0.1], ["b) Hauteur correspondante (cm, au dixième)", h, 0.1], ["c) Surface minimale (cm², à l'unité)", S, 1]],
          ["h = " + nbT(V) + " ÷ (πr²), donc S(r) = 2πr² + 2πrh = 2πr² + " + 2 * V + "/r. Dérive S.",
           "S'(r) = 4πr − " + 2 * V + "/r² = 0 donne r³ = " + V + " ÷ (2π). Calcule h avec le r non arrondi : tu trouveras h = 2r."],
          M("S(r) = 2\\pi r^2 + \\frac{" + 2 * V + "}{r}, \\; S'(r) = 4\\pi r - \\frac{" + 2 * V + "}{r^2} = 0 \\iff r = \\sqrt[3]{\\frac{" + V + "}{2\\pi}}") + ". a) " + M("r \\approx " + D(r1(r))) + " cm. b) " + M("h = \\frac{" + V + "}{\\pi r^2} = 2r \\approx " + D(r1(h))) + " cm. c) " + M("S \\approx " + nb(Math.round(S))) + " cm²."), { ctx: "conserve" });
      },
      () => { /* potager rectangulaire le long d'un mur : clôture sur trois côtés */
        const L = pk([24, 30, 36, 40, 48, 50, 60]), x = L / 4, A = (L * L) / 8, obj = pk(["un potager", "un enclos pour des poules", "une terrasse"]);
        return Object.assign(P("Avec " + M(L) + " m de clôture, on délimite " + obj + " rectangulaire le long d'un mur : la clôture ne fait que trois côtés. On note " + M("x") + " la largeur (les deux côtés perpendiculaires au mur, en m).",
          [["a) Valeur de " + M("x") + " qui rend l'aire maximale (m)", x], ["b) Longueur du côté parallèle au mur (m)", L - 2 * x], ["c) Aire maximale (m²)", A]],
          ["A(x) = x(" + L + " − 2x) pour 0 < x < " + L / 2 + ".", "A'(x) = " + L + " − 4x : il s'annule en x = " + T(x) + " (+ puis −)."],
          M("A(x) = " + L + "x - 2x^2, \; A'(x) = " + L + " - 4x = 0 \\iff x = " + D(x)) + ". a) " + M(D(x)) + " m. b) " + M(L + " - 2 \\cdot " + D(x) + " = " + D(L - 2 * x)) + " m. c) " + M(D(x) + " \\cdot " + D(L - 2 * x) + " = " + D(A)) + " m²."), { ctx: "potager" });
      },
    ],
    /* ---------- MP 4e : composition et réciproque ---------- */
    fctmp: [
      () => {
        let a, b, c, s, y0, K, xs;
        do { a = pk([-3, -2, 2, 3, 4, 5]); b = R.nz(-8, 8); c = R.nz(-9, 9); s = ri(2, 9); K = s * s + c; y0 = ri(-12, 12); xs = [(s - b) / a, (-s - b) / a]; }
        while (!xs.every(Number.isInteger) || Number.isInteger((y0 - b) / a) || y0 === b);
        const x0 = R.nz(-4, 4), fg = a * (x0 * x0 + c) + b;
        return P("On donne " + M("f(x) = " + poly([a, b])) + " et " + M("g(x) = x^2" + sgD(c)) + ".",
          [["a) " + M("(f \\circ g)(" + x0 + ")"), fg], ["b) " + M("f^{-1}(" + y0 + ")") + " (fraction)", (y0 - b) / a], ["c) Solutions de " + M("(g \\circ f)(x) = " + K) + " (séparées par « ; »)", SET(xs)]],
          ["(f ∘ g)(x) = f(g(x)) : on calcule d'abord g, puis f. f⁻¹(" + y0 + ") est le nombre x tel que f(x) = " + y0 + ".",
           "c) g(f(x)) = (" + pT([a, b]) + ")² " + (c < 0 ? "− " + -c : "+ " + c) + " = " + K + " donne (" + pT([a, b]) + ")² = " + s * s + " : deux cas, ± " + s + "."],
          "a) " + M("g(" + x0 + ") = " + (x0 * x0 + c) + ", \\; f(" + (x0 * x0 + c) + ") = " + fg) + ". b) " + M(poly([a, b]) + " = " + y0 + " \\iff x = " + fx((y0 - b) / a)) + ". c) " + M("(" + poly([a, b]) + ")^2 = " + s * s + " \\iff " + poly([a, b]) + " = \\pm " + s) + " : " + M("x = " + xs[0]) + " ou " + M("x = " + xs[1]) + ".");
      },
    ],
    /* ---------- MP 4e : fonction homographique ---------- */
    fratmp: [
      () => {
        let a, b, p, k, xk;
        do { a = R.nz(-4, 4); b = R.nz(-9, 9); p = R.nz(-5, 5); k = R.nz(-6, 6); xk = (-k * p - b) / (a - k); } while (a === k || b + a * p === 0 || !Number.isInteger(xk) || xk === p || xk === 0 || Number.isInteger(-b / a) || Math.abs(xk) > 12);
        const num = b + a * p, cnt = cntInt((x) => x !== p && (a * x + b) / (x - p) > a);
        return P("On étudie " + M("f(x) = \\frac{" + poly([a, b]) + "}{" + xm(p) + "}") + ".",
          [["a) Zéro de " + M("f") + " (fraction)", -b / a], ["b) Solution de " + M("f(x) = " + k), xk], ["c) Asymptote horizontale : " + M("y = a") + ". Combien d'entiers " + M("x") + " de " + M("-10") + " à " + M("10") + " vérifient " + M("f(x) > " + a) + " ?", cnt]],
          ["b) Multiplie par (" + xmT(p) + ") (x ≠ " + p + "), ce qui donne " + pT([a, b]) + " = " + k + "(" + xmT(p) + "). c) L'asymptote horizontale est y = " + a + " (rapport des coefficients de x).",
           "c) f(x) − " + a + " = (" + pT([a, b]) + " − " + a + "(" + xmT(p) + ")) ÷ (" + xmT(p) + ") = " + num + " ÷ (" + xmT(p) + ") : son signe ne dépend que du dénominateur."],
          "a) " + M(poly([a, b]) + " = 0 \\iff x = " + fx(-b / a)) + ". b) " + M(poly([a, b]) + " = " + cfD(k) + "(" + xm(p) + ") \\iff " + cfD(a - k) + "x = " + (-k * p - b) + " \\iff x = " + xk) + ". c) " + M("f(x) - " + pr(a) + " = \\frac{" + num + "}{" + xm(p) + "} > 0 \\iff x " + (num > 0 ? ">" : "<") + " " + p) + " : " + M(cnt) + " entiers.");
      },
    ],
    /* ---------- MP 4e : projection orthogonale, distance d'un point à une droite ---------- */
    projmp: [
      () => {
        let p, q, ax, ay, wx, wy, L, dot, cr;
        do { [p, q] = pk([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]).map((v) => v * pk([1, -1])); ax = ri(-5, 5); ay = ri(-5, 5); wx = R.nz(-8, 8); wy = R.nz(-8, 8); L = Math.hypot(p, q); dot = p * wx + q * wy; cr = Math.abs(p * wy - q * wx); } while (dot === 0 || cr === 0);
        const B = [ax + p, ay + q], C = [ax + wx, ay + wy];
        return P("On donne " + M("A(" + ax + " ; " + ay + ")") + ", " + M("B(" + B[0] + " ; " + B[1] + ")") + " et " + M("C(" + C[0] + " ; " + C[1] + ")") + ". " + M("H") + " est le projeté orthogonal de " + M("C") + " sur la droite " + M("(AB)") + ".",
          [["a) " + M("\\vec{AB} \\cdot \\vec{AC}"), dot], ["b) Distance " + M("AH") + " (projection scalaire, en valeur absolue, au centième)", Math.abs(dot) / L, 0.01], ["c) Distance " + M("CH") + " de " + M("C") + " à la droite " + M("(AB)") + " (au centième)", cr / L, 0.01], ["d) Aire du triangle " + M("ABC"), cr / 2]],
          ["AB→ = (" + p + " ; " + q + "), AC→ = (" + wx + " ; " + wy + "), ‖AB→‖ = " + L + ". AH = |AB→ · AC→| ÷ ‖AB→‖.",
           "CH par Pythagore dans ACH : CH² = AC² − AH². Aire = AB · CH ÷ 2."],
          "a) " + M(pr(p) + " \\cdot " + pr(wx) + " + " + pr(q) + " \\cdot " + pr(wy) + " = " + dot) + ". b) " + M("AH = \\frac{" + Math.abs(dot) + "}{" + L + "} \\approx " + D(r2c(Math.abs(dot) / L))) + ". c) " + M("CH = \\sqrt{" + (wx * wx + wy * wy) + " - " + D(r2c((dot / L) ** 2)) + "} \\approx " + D(r2c(cr / L))) + " (ou " + M("\\frac{" + cr + "}{" + L + "}") + "). d) " + M("\\frac{" + L + " \\cdot \\frac{" + cr + "}{" + L + "}}{2} = " + D(cr / 2)) + ".");
      },
    ],
    /* ---------- MP 4e : position de deux droites de l'espace (paramètre) ---------- */
    posdroites: [
      () => {
        let u, v, P0, t0, s0;
        do { u = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-3, 3)]; v = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-3, 3)]; t0 = R.nz(-4, 4); s0 = R.nz(-4, 4); P0 = [ri(-5, 5), ri(-5, 5), ri(-5, 5)]; }
        while (u[0] * v[1] - u[1] * v[0] === 0 || t0 === s0);
        const I = P0.map((c, i) => c + t0 * u[i]), Q = I.map((c, i) => c - s0 * v[i]), m = Q[2];
        const lin = (c, w, t) => (c === 0 ? (w < 0 ? "-" : "") : c + (w < 0 ? " - " : " + ")) + (Math.abs(w) === 1 ? "" : Math.abs(w)) + t;
        return P("On donne " + M("d : x = " + lin(P0[0], u[0], "t") + ", \\; y = " + lin(P0[1], u[1], "t") + ", \\; z = " + lin(P0[2], u[2], "t")) + " et " + M("g : x = " + lin(Q[0], v[0], "s") + ", \\; y = " + lin(Q[1], v[1], "s") + ", \\; z = m " + (v[2] < 0 ? "- " + (v[2] === -1 ? "" : -v[2]) : "+ " + (v[2] === 1 ? "" : v[2])) + "s") + ".",
          [["a) Valeur de " + M("t") + " donnée par les équations en " + M("x") + " et " + M("y"), t0], ["b) Valeur de " + M("s"), s0], ["c) " + M("m") + " pour que les droites soient sécantes", m], ["d) Cote " + M("z") + " du point d'intersection", I[2]]],
          ["Égalise les x et les y des deux droites : système de deux équations en t et s (combinaison ou substitution).",
           "Pour que les droites se coupent, la 3e équation (en z) doit aussi être vérifiée avec ces t et s : elle donne m."],
          "Système : " + M(lin(P0[0], u[0], "t") + " = " + lin(Q[0], v[0], "s")) + " et " + M(lin(P0[1], u[1], "t") + " = " + lin(Q[1], v[1], "s")) + ". a) " + M("t = " + t0) + ". b) " + M("s = " + s0) + ". c) " + M(lin(P0[2], u[2], "t") + " = m " + (v[2] < 0 ? "- " : "+ ") + (Math.abs(v[2]) === 1 ? "" : Math.abs(v[2])) + "s") + " avec ces valeurs : " + M(I[2] + " = m " + (v[2] * s0 < 0 ? "- " + -v[2] * s0 : "+ " + v[2] * s0)) + ", " + M("m = " + m) + ". d) Point commun " + M("(" + I.join(" ; ") + ")") + " ; pour une autre valeur de " + M("m") + " les droites sont gauches.");
      },
    ],
    /* ---------- MP 1re–2e : triangle rectangle dans un repère, cercle circonscrit ---------- */
    coordmp: [
      () => {
        const [p, q] = pk([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4]]), k = pk([2, 3]) * pk([1, -1]);
        const A = [ri(-4, 4), ri(-4, 4)], B = [A[0] + p, A[1] + q], C = [A[0] - k * q, A[1] + k * p];
        const AB2 = p * p + q * q, AC2 = k * k * AB2, BC2 = (B[0] - C[0]) ** 2 + (B[1] - C[1]) ** 2, Mx = (B[0] + C[0]) / 2, My = (B[1] + C[1]) / 2;
        return P("On donne " + M("A(" + A.join(" ; ") + ")") + ", " + M("B(" + B.join(" ; ") + ")") + " et " + M("C(" + C.join(" ; ") + ")") + ".",
          [["a) " + M("BC^2"), BC2], ["b) " + M("AB^2 + AC^2") + " (le triangle est-il rectangle ?)", AB2 + AC2], ["c) Centre du cercle circonscrit : abscisse", Mx], ["d) Aire du triangle", (Math.abs(k) * AB2) / 2]],
          ["Distance : AB² = (x_B − x_A)² + (y_B − y_A)². Compare BC² et AB² + AC² (réciproque de Pythagore).",
           "Triangle rectangle en A : le centre du cercle circonscrit est le milieu de l'hypoténuse [BC]. Aire = AB · AC ÷ 2 (cathètes)."],
          "a) " + M("BC^2 = " + pr(B[0] - C[0]) + "^2 + " + pr(B[1] - C[1]) + "^2 = " + BC2) + ". b) " + M("AB^2 = " + AB2 + ", \\; AC^2 = " + AC2 + ", \\; " + AB2 + " + " + AC2 + " = " + (AB2 + AC2)) + " : rectangle en " + M("A") + ". c) Milieu de " + M("[BC]") + " : " + M("(" + D(Mx) + " ; " + D(My) + ")") + ". d) " + M("\\frac{\\sqrt{" + AB2 + "} \\cdot \\sqrt{" + AC2 + "}}{2} = \\frac{" + Math.abs(k) + " \\cdot " + AB2 + "}{2} = " + D((Math.abs(k) * AB2) / 2)) + ".");
      },
    ],
    /* ---------- MP 3e : volumes composés ---------- */
    volmp: [
      () => {
        const r = ri(2, 5), H = ri(6, 14), hc = ri(2, 5), Vcyl = Math.PI * r * r * H, Vcone = (Math.PI * r * r * hc) / 3, Vb = (2 / 3) * Math.PI * r ** 3;
        let V1; do { V1 = 10 * ri(Math.ceil(0.03 * Vcyl), Math.floor(0.09 * Vcyl)); } while (V1 % (r * r) === 0);
        const lvl = V1 / (Math.PI * r * r);
        return P("Un silo est formé d'un cylindre de rayon " + M(r + " \\text{ m}") + " et de hauteur " + M(H + " \\text{ m}") + ", surmonté d'un cône de même rayon et de hauteur " + M(hc + " \\text{ m}") + ".",
          [["a) Volume total (m³, au dixième)", Vcyl + Vcone, 0.1], ["b) On y verse " + M(V1 + " \\text{ m}^3") + " de grain. Hauteur du grain (m, au centième)", lvl, 0.01], ["c) On remplace le cône par une demi-boule de même rayon. Gain de volume (m³, au dixième, négatif si perte)", Vb - Vcone, 0.1]],
          ["Cylindre : πr²h ; cône : πr²h ÷ 3 ; boule : 4πr³ ÷ 3.",
           "b) " + V1 + " m³ tiennent dans le cylindre : " + V1 + " = π · " + r + "² · h, isole h. c) Demi-boule − cône."],
          "a) " + M("\\pi \\cdot " + r + "^2 \\cdot " + H + " + \\frac{\\pi \\cdot " + r + "^2 \\cdot " + hc + "}{3} \\approx " + D(r1(Vcyl + Vcone))) + " m³. b) " + M("h = \\frac{" + V1 + "}{" + r * r + "\\pi} \\approx " + D(r2c(lvl))) + " m. c) " + M("\\frac{2}{3}\\pi \\cdot " + r + "^3 - \\frac{\\pi \\cdot " + r + "^2 \\cdot " + hc + "}{3} \\approx " + D(r1(Vb - Vcone))) + " m³.");
      },
    ],
    /* ---------- MP 3e : similitude et volumes (verre conique) ---------- */
    similmp: [
      () => {
        let H, V, h1; do { H = ri(8, 15); V = pk([15, 20, 25, 30, 40]); h1 = ri(Math.ceil(H / 2), H - 1); } while (h1 * 2 === H);
        const k = h1 / H, v1 = V * k ** 3, n = Math.floor(100 / v1), hh = H * Math.cbrt(0.5);
        return P("Un verre conique (pointe en bas) a une hauteur de " + M(H + " \\text{ cm}") + " et contient " + M(V + " \\text{ cL}") + " quand il est plein.",
          [["a) Volume (cL, au dixième) quand on le remplit jusqu'à " + M(h1 + " \\text{ cm}") + " de hauteur", v1, 0.1], ["b) Combien de verres remplis jusqu'à " + M(h1 + " \\text{ cm}") + " peut-on servir avec 1 L ?", n], ["c) Hauteur (cm, au dixième) du liquide quand le verre est à moitié plein", hh, 0.1]],
          ["Le liquide forme un petit cône semblable au verre, de rapport k = " + h1 + " ÷ " + H + ". Les volumes sont multipliés par k³.",
           "b) 1 L = 100 cL. c) On cherche k avec k³ = 0,5, donc k = ∛0,5 ≈ 0,794."],
          "a) " + M("k = \\frac{" + h1 + "}{" + H + "}, \\; " + V + " \\cdot k^3 \\approx " + D(r1(v1))) + " cL. b) " + M("100 \\div " + D(r2c(v1)) + " \\approx " + D(r2c(100 / v1))) + " : " + M(n) + " verres. c) " + M(H + " \\cdot \\sqrt[3]{0{,}5} \\approx " + D(r1(hh))) + " cm (et non " + M(D(H / 2)) + " cm !).");
      },
    ],
    /* ---------- 1re Collège : théorèmes d'Euclide et de la hauteur ---------- */
    euclide: [
      () => { /* hauteur et une projection connues */
        const [a, b, c] = pk([[3, 4, 5], [4, 3, 5], [5, 12, 13], [8, 15, 17], [15, 8, 17]]), k = c === 5 ? pk([1, 2, 3]) : 1;
        const p = a * a * k, q = b * b * k, h = a * b * k, hyp = c * c * k, cb = b * c * k, ca = a * c * k;
        return P("Dans un triangle rectangle, la hauteur relative à l'hypoténuse mesure " + M(h + " \\text{ cm}") + " et coupe l'hypoténuse en deux segments ; l'un mesure " + M(p + " \\text{ cm}") + ".",
          [["a) Longueur de l'autre segment (cm)", q], ["b) Cathète adjacente à cet autre segment (cm)", cb], ["c) Périmètre du triangle (cm)", ca + cb + hyp]],
          ["Théorème de la hauteur : h² = p · q. Puis l'hypoténuse vaut p + q.",
           "Théorème d'Euclide : cathète² = (sa projection) · hypoténuse. Calcule les deux cathètes."],
          "a) " + M("q = \\frac{h^2}{p} = \\frac{" + h * h + "}{" + p + "} = " + q) + " cm. Hypoténuse " + M(p + " + " + q + " = " + hyp) + " cm. b) " + M("\\sqrt{" + q + " \\cdot " + hyp + "} = \\sqrt{" + nb(q * hyp) + "} = " + cb) + " cm. c) Autre cathète " + M("\\sqrt{" + p + " \\cdot " + hyp + "} = " + ca) + " cm ; périmètre " + M(ca + " + " + cb + " + " + hyp + " = " + (ca + cb + hyp)) + " cm.");
      },
      () => { /* une cathète et sa projection connues */
        const [a, b, c] = pk([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17]]), k = c === 5 ? pk([2, 3, 4]) : 1;
        const p = a * a * k, hyp = c * c * k, ca = a * c * k, cb = b * c * k, h = a * b * k;
        return P("Dans un triangle " + M("ABC") + " rectangle en " + M("C") + ", la cathète " + M("AC") + " mesure " + M(ca + " \\text{ cm}") + " et sa projection sur l'hypoténuse mesure " + M(p + " \\text{ cm}") + ".",
          [["a) Hypoténuse (cm)", hyp], ["b) Hauteur issue de " + M("C") + " (cm)", h], ["c) Cathète " + M("BC") + " (cm)", cb]],
          ["Théorème d'Euclide : AC² = (projection de AC) · hypoténuse. Isole l'hypoténuse.",
           "Hauteur : Pythagore dans le petit triangle (AC est son hypoténuse), ou h² = p · q avec q = hypoténuse − p."],
          "a) " + M("AB = \\frac{" + ca + "^2}{" + p + "} = \\frac{" + nb(ca * ca) + "}{" + p + "} = " + hyp) + " cm. b) " + M("h = \\sqrt{" + ca + "^2 - " + p + "^2} = " + h) + " cm. c) " + M("BC = \\sqrt{" + hyp + "^2 - " + ca + "^2} = " + cb) + " cm.");
      },
    ],
    /* ---------- 1re Collège : géométrie combinée (Pythagore + aires + volumes) ---------- */
    geocomb: [
      () => {
        const [u, v, w] = pk([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 6, 10], [6, 8, 10]]), t = pk([0.2, 0.25, 0.3]), L = pk([2, 2.5, 3, 3.5, 4]);
        const hb = r2c(u * t), ht = r2c(v * t), sd = r2c(w * t);
        const Af = hb * ht, V = Af * L, S = 2 * Af + 2 * sd * L;
        return P("Une tente a la forme d'un prisme droit. Sa façade est un triangle isocèle de base " + M(D(2 * hb) + " \\text{ m}") + " et de côtés obliques " + M(D(sd) + " \\text{ m}") + " ; la tente est longue de " + M(D(L) + " \\text{ m}") + ". Le sol n'est pas en toile.",
          [["a) Hauteur de la façade (m)", ht], ["b) Volume de la tente (m³, au centième)", r2c(V), 0.01], ["c) Surface de toile (deux façades et deux pans, m², au centième)", r2c(S), 0.01]],
          ["Hauteur : Pythagore dans le demi-triangle (hypoténuse " + T(sd) + " m, un côté " + T(hb) + " m).",
           "Volume du prisme = aire de la façade · longueur. Toile : 2 triangles + 2 rectangles de " + T(sd) + " m sur " + T(L) + " m."],
          "a) " + M("\\sqrt{" + D(sd) + "^2 - " + D(hb) + "^2} = " + D(ht)) + " m. b) Façade " + M("\\frac{" + D(2 * hb) + " \\cdot " + D(ht) + "}{2} = " + D(r2c(Af))) + " m², " + M("V = " + D(r2c(Af)) + " \\cdot " + D(L) + " \\approx " + D(r2c(V))) + " m³. c) " + M("2 \\cdot " + D(r2c(Af)) + " + 2 \\cdot " + D(sd) + " \\cdot " + D(L) + " \\approx " + D(r2c(S))) + " m².");
      },
    ],
    /* ---------- 1re Collège : droites remarquables du triangle rectangle ---------- */
    /* 26.11 soir (agent defis3) : 3 contextes (triangle, jardin et arroseur, équerre donnée par son hypoténuse). */
    droitesrem: [
      () => {
        const [cx, u] = pk([["triangle", "cm"], ["jardin", "m"], ["equerre", "cm"]]), T0 = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 12, 15], [6, 8, 10]].filter((t) => cx === "equerre" ? t[2] <= 17 : t[2] <= 30)), k = cx === "equerre" ? (T0[2] <= 10 ? 2 : 1) : 1, [a, b, c] = T0.map((v) => v * k);
        const intro = cx === "jardin" ? "Un jardin a la forme d'un triangle " + M("ABC") + " rectangle en " + M("C") + ", avec " + M("AC = " + a + " \\text{ m}") + " et " + M("BC = " + b + " \\text{ m}") + ". On veut placer un arroseur à égale distance des trois coins."
          : cx === "equerre" ? "Une équerre de dessin est un triangle " + M("ABC") + " rectangle en " + M("C") + ", d'hypoténuse " + M("AB = " + c + " \\text{ cm}") + " et de côté " + M("AC = " + a + " \\text{ cm}") + "."
          : "Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AC = " + a + " \\text{ cm}") + " et " + M("BC = " + b + " \\text{ cm}") + ".";
        return Object.assign(P(intro,
          [[cx === "jardin" ? "a) Distance de l'arroseur à chaque coin (m)" : "a) Rayon du cercle circonscrit (" + u + ")", c / 2], ["b) Distance de " + M("C") + " au centre de gravité (" + u + ", fraction ou au centième)", c / 3, 0.01], ["c) Hauteur issue de " + M("C") + " (" + u + ", au centième)", (a * b) / c, 0.01]],
          [(cx === "jardin" ? "Le point à égale distance des trois coins est le centre du cercle circonscrit. " : "") + "Le centre du cercle circonscrit d'un triangle rectangle est le milieu de l'hypoténuse (cercle de Thalès). La médiane issue de C vaut donc la moitié de l'hypoténuse.",
           "Le centre de gravité est aux 2/3 de chaque médiane depuis le sommet. Hauteur : l'aire vaut AC · BC ÷ 2 = AB · h ÷ 2."],
          (cx === "equerre" ? "Côté " + M("BC = \\sqrt{" + c * c + " - " + a * a + "} = " + b) + " cm. " : "Hypoténuse " + M("AB = \\sqrt{" + a * a + " + " + b * b + "} = " + c) + " " + u + ". ") + "a) " + M(D(c / 2)) + " " + u + ". b) Médiane issue de " + M("C") + " : " + M(D(c / 2)) + " " + u + " ; " + M("\\frac{2}{3} \\cdot " + D(c / 2) + " = " + fx(c / 3)) + " " + u + ". c) " + M("h = \\frac{" + a + " \\cdot " + b + "}{" + c + "} " + (Number.isInteger((a * b * 100) / c) ? "= " : "\\approx ") + D(r2c((a * b) / c))) + " " + u + "."), { ctx: cx });
      },
    ],
    /* ---------- MP 2e : droites sécantes (deux factures) ---------- */
    droitesinter: [
      () => {
        let mA, mB, fA, fB, xi;
        do { mA = ri(8, 25); mB = ri(4, mA - 3); fA = 5 * ri(2, 8); fB = fA + 5 * ri(2, 12); xi = (10 * (fB - fA)) / (mA - mB); } while (!Number.isInteger(xi) || xi < 15 || xi > 150);
        const x1 = 10 * ri(2, 5), x2 = x1 + 10 * ri(2, 6), y1 = fA + (mA * x1) / 10, y2 = fA + (mA * x2) / 10, yi = fA + (mA * xi) / 10;
        return P("Location d'une voiture. Agence A : une course de " + M(x1 + " \\text{ km}") + " a coûté " + M(D(y1)) + " CHF et une course de " + M(x2 + " \\text{ km}") + " a coûté " + M(D(y2)) + " CHF (prix affine). Agence B : " + M(fB) + " CHF de base et " + M(D(mB / 10)) + " CHF par km.",
          [["a) Prix au km chez A (CHF)", mA / 10], ["b) Prix de base chez A (CHF)", fA], ["c) Nombre de km pour lequel les deux agences coûtent la même chose", xi], ["d) Prix commun (CHF)", yi]],
          ["Prix au km de A = (différence des prix) ÷ (différence des km). Puis prix de base = prix − (prix au km) · km.",
           "Égalise : " + fA + " + a · x = " + fB + " + " + T(mB / 10) + "x et isole x."],
          "a) " + M("\\frac{" + D(y2) + " - " + D(y1) + "}{" + x2 + " - " + x1 + "} = " + D(mA / 10)) + " CHF/km. b) " + M(D(y1) + " - " + D(mA / 10) + " \\cdot " + x1 + " = " + fA) + " CHF. c) " + M(fA + " + " + D(mA / 10) + "x = " + fB + " + " + D(mB / 10) + "x \\iff " + (mA - mB === 10 ? "" : D((mA - mB) / 10)) + "x = " + (fB - fA) + " \\iff x = " + xi) + " km. d) " + M(fA + " + " + D(mA / 10) + " \\cdot " + xi + " = " + D(yi)) + " CHF.");
      },
    ],
    /* ---------- MP 2e : fonction réciproque d'une fonction affine ---------- */
    recipaff: [
      () => {
        const m = pk([0.2, 0.25, 0.4, 0.5, 0.75, 1.5, 2.5]), p = 2 * ri(4, 15), x1 = 4 * ri(2, 5), x2 = x1 + 4 * ri(2, 5);
        const f = (x) => m * x + p, y0 = f(4 * ri(6, 15)), fix = p / (1 - m);
        return P("Un forfait de téléphone est affine : " + M(x1) + " Go coûtent " + M(D(f(x1))) + " CHF et " + M(x2) + " Go coûtent " + M(D(f(x2))) + " CHF. On note " + M("f(x)") + " le prix pour " + M("x") + " Go.",
          [["a) Prix d'un Go (CHF)", m], ["b) " + M("f^{-1}(" + D(y0) + ")") + " : nombre de Go pour une facture de " + D(y0) + " CHF", (y0 - p) / m], ["c) Abscisse du point où les graphes de " + M("f") + " et de " + M("f^{-1}") + " se coupent", fix]],
          ["Pente = différence des prix ÷ différence des Go ; ordonnée à l'origine = prix − pente · Go. Puis f⁻¹(y) : résous f(x) = y.",
           "c) Les graphes de f et f⁻¹ sont symétriques par rapport à la droite y = x : ils se coupent sur cette droite, donc là où f(x) = x."],
          "a) " + M("\\frac{" + D(f(x2)) + " - " + D(f(x1)) + "}{" + (x2 - x1) + "} = " + D(m)) + ", " + M("f(x) = " + D(m) + "x + " + p) + ". b) " + M(D(m) + "x + " + p + " = " + D(y0) + " \\iff x = " + D((y0 - p) / m)) + " Go. c) " + M(D(m) + "x + " + p + " = x \\iff " + D(r2c(1 - m)) + "x = " + -p + " \\iff x = " + fx(fix)) + ".");
      },
    ],
    /* ---------- 4e Collège : probabilités conditionnelles (dépistage, deux tests) ---------- */
    condbayes: [
      () => {
        const pi = pk([0.005, 0.01, 0.02, 0.04]), se = pk([0.9, 0.95, 0.98]), fp = pk([0.02, 0.03, 0.05, 0.08]);
        const pT = pi * se + (1 - pi) * fp, b1 = (pi * se) / pT, pTT = pi * se * se + (1 - pi) * fp * fp, b2 = (pi * se * se) / pTT;
        return P("Une maladie touche " + M(D(100 * pi) + "\\,\\%") + " de la population. Un test est positif chez " + M(D(100 * se) + "\\,\\%") + " des malades et chez " + M(D(100 * fp) + "\\,\\%") + " des personnes saines.",
          [["a) Probabilité qu'un test soit positif, en % (au centième)", 100 * pT, 0.01], ["b) Probabilité d'être malade sachant que le test est positif, en % (au dixième)", 100 * b1, 0.1], ["c) On refait un second test (indépendant) qui est aussi positif. Probabilité d'être malade, en % (au dixième)", 100 * b2, 0.1]],
          ["Arbre : malade / sain, puis positif / négatif. P(positif) = P(M) · P(+ | M) + P(S) · P(+ | S).",
           "Bayes : P(M | +) = P(M et +) ÷ P(+). c) Deux tests positifs : multiplie les probabilités sur chaque branche (" + T(se) + "² et " + T(fp) + "²)."],
          "a) " + M(D(pi) + " \\cdot " + D(se) + " + " + D(1 - pi) + " \\cdot " + D(fp) + " \\approx " + D(+(100 * pT).toFixed(2)) + "\\,\\%") + ". b) " + M("\\frac{" + D(+(pi * se).toFixed(6)) + "}{" + D(+pT.toFixed(6)) + "} \\approx " + D(r1(100 * b1)) + "\\,\\%") + " : la plupart des positifs sont sains ! c) " + M("\\frac{" + D(pi) + " \\cdot " + D(se) + "^2}{" + D(pi) + " \\cdot " + D(se) + "^2 + " + D(1 - pi) + " \\cdot " + D(fp) + "^2} \\approx " + D(r1(100 * b2)) + "\\,\\%") + ".");
      },
    ],
    /* ---------- 4e Collège : variable aléatoire, espérance, jeu équitable ---------- */
    varalea: [
      () => {
        let G1, G2, e, EG;
        do { G1 = ri(8, 20); G2 = ri(2, 6); e = ri(3, 8); EG = (G1 + 2 * G2) / 6 - e; } while (EG === 0 || Math.abs(EG) > 3 || 6 * e - 2 * G2 <= G2);
        const fair = 6 * e - 2 * G2;
        return P("Un jeu de fête foraine : on paie " + M(e) + " CHF, puis on lance un dé. Avec un 6, on reçoit " + M(G1) + " CHF ; avec un 4 ou un 5, " + M(G2) + " CHF ; sinon rien. " + M("G") + " = gain net (somme reçue moins la mise).",
          [["a) " + M("P(G > 0)"), (G1 > e ? 1 / 6 : 0) + (G2 > e ? 2 / 6 : 0)], ["b) " + M("E(G)") + " (CHF, au centime)", EG, 0.01], ["c) Somme à donner pour un 6 (le reste inchangé) pour que le jeu soit équitable (CHF)", fair]],
          ["G vaut " + (G1 - e) + ", " + (G2 - e) + " ou −" + e + " CHF, avec les probabilités 1/6, 2/6 et 3/6. Un gain net est positif si la somme reçue dépasse la mise.",
           "E(G) = somme des (valeur · probabilité). Équitable : E(G) = 0, soit s/6 + 2 · " + G2 + "/6 = " + e + " (s = somme pour un 6)."],
          "a) " + (G2 > e ? "Avec un 4, 5 ou 6 : " + M("\\frac{3}{6} = \\frac{1}{2}") : "Seulement avec un 6 : " + M("\\frac{1}{6}")) + ". b) " + M("E(G) = \\frac{" + (G1 - e) + "}{6} + \\frac{2 \\cdot " + pr(G2 - e) + "}{6} + \\frac{3 \\cdot (-" + e + ")}{6} \\approx " + D(r2c(EG))) + " CHF. c) " + M("\\frac{s}{6} + \\frac{" + 2 * G2 + "}{6} = " + e + " \\iff s = " + 6 * e + " - " + 2 * G2 + " = " + fair) + " CHF.");
      },
    ],
    /* ---------- 1re Collège : angles d'un polygone régulier, diagonales ---------- */
    angtri: [
      () => {
        const n = pk([5, 6, 8, 9, 10, 12]), S = (n - 2) * 180, ai = S / n;
        return P("Dans un polygone régulier " + M("ABCD\\ldots") + " à " + M(n) + " côtés, les diagonales " + M("[AC]") + " et " + M("[BD]") + " se coupent en " + M("X") + ".",
          [["a) Mesure de chaque angle intérieur (°)", ai], ["b) " + M("\\widehat{BAC}") + " (°)", 180 / n], ["c) " + M("\\widehat{AXB}") + " (°)", 360 / n]],
          ["Somme des angles d'un polygone à n côtés : (n − 2) · 180°. Le triangle ABC est isocèle en B (AB = BC).",
           "c) Le triangle BCD est isocèle en C : il donne l'angle CBD, donc ABD = angle intérieur − CBD. Puis la somme des angles du triangle ABX."],
          "a) " + M("\\frac{(" + n + " - 2) \\cdot 180°}{" + n + "} = " + D(ai) + "°") + ". b) " + M("\\frac{180° - " + D(ai) + "°}{2} = " + D(180 / n) + "°") + ". c) " + M("\\widehat{CBD} = " + D(180 / n) + "°") + ", donc " + M("\\widehat{ABD} = " + D(ai) + "° - " + D(180 / n) + "° = " + D(ai - 180 / n) + "°") + " et " + M("\\widehat{AXB} = 180° - " + D(180 / n) + "° - " + D(ai - 180 / n) + "° = " + D(360 / n) + "°") + ".");
      },
    ],
    /* ---------- 11e : carrés parfaits (carrelage) ---------- */
    carres: [
      () => {
        const n = ri(12, 29), s = pk([20, 25, 30, 40, 50]), k = ri(2, 5), side = (n * s) / 100;
        return P("Un carrelage carré est formé de " + M(nb(n * n)) + " dalles carrées identiques de " + M(s + " \\text{ cm}") + " de côté.",
          [["a) Nombre de dalles sur un côté", n], ["b) Aire du carrelage (m²)", side * side], ["c) On agrandit le carré en ajoutant " + M(k) + " dalles sur chaque côté. Combien de dalles faut-il en plus ?", (n + k) ** 2 - n * n]],
          ["Le nombre de dalles est un carré : n · n = " + nbT(n * n) + ". Côté du carrelage = n · " + s + " cm.",
           "c) Le nouveau carré a " + n + " + " + k + " dalles par côté : nouveau total − ancien total."],
          "a) " + M("\\sqrt{" + nb(n * n) + "} = " + n) + ". b) Côté " + M(n + " \\cdot " + D(s / 100) + " = " + D(side)) + " m, aire " + M(D(side) + "^2 = " + D(side * side)) + " m². c) " + M((n + k) + "^2 - " + n + "^2 = " + nb((n + k) ** 2) + " - " + nb(n * n) + " = " + nb((n + k) ** 2 - n * n)) + " dalles.");
      },
    ],
    /* ---------- 10e : division de décimaux ---------- */
    decdiv: [
      () => {
        let n, share, b, B, c;
        do { n = ri(3, 8); share = 0.05 * ri(240, 700); b = 0.1 * ri(25, 60); B = ri(10, 30); c = Math.floor(B / b + 1e-9); } while (Math.abs(B / b - Math.round(B / b)) < 1e-9 || c < 3);
        const tot = n * share;
        return P("Un groupe de " + M(n) + " amis paie " + M(CHF(tot)) + " CHF au restaurant et partage la note en parts égales. Chacun a pris une boisson à " + M(CHF(b)) + " CHF.",
          [["a) Part de chacun (CHF)", r2c(share)], ["b) Part de chacun sans la boisson (CHF)", r2c(share - b)], ["c) Combien de boissons à " + CHF(b) + " CHF peut-on payer avec " + B + " CHF ?", c]],
          ["a) Divise " + CHFT(tot) + " par " + n + ". c) " + B + " ÷ " + CHFT(b) + " : multiplie les deux nombres par 10 pour diviser par un entier.",
           "c) Le quotient n'est pas entier : on ne paie que des boissons entières, garde la partie entière."],
          "a) " + M(CHF(tot) + " \\div " + n + " = " + CHF(share)) + " CHF. b) " + M(CHF(share) + " - " + CHF(b) + " = " + CHF(share - b)) + " CHF. c) " + M(B + " \\div " + CHF(b) + " = " + B * 10 + " \\div " + Math.round(b * 10) + " \\approx " + D(r2c(B / b))) + " : " + M(c) + " boissons.");
      },
    ],
    /* ---------- 10e : multiplication de décimaux ---------- */
    decmul: [
      () => {
        const L = ri(31, 69) / 10, l = ri(21, 45) / 10, pu = pk([24.5, 32.9, 38.5, 42.5, 29.9, 45.8]), A = r2c(L * l), C = r2c(A * pu), C2 = r2c(A * 1.1 * pu);
        return P("On carrelle une pièce rectangulaire de " + M(D(L) + " \\text{ m}") + " sur " + M(D(l) + " \\text{ m}") + ". Le carrelage coûte " + M(CHF(pu)) + " CHF le m².",
          [["a) Aire de la pièce (m²)", A], ["b) Prix du carrelage (CHF, au centime)", C, 0.01], ["c) Prix si l'on achète 10 % de plus pour les chutes (CHF, au centime)", C2, 0.01]],
          ["Aire = longueur · largeur : multiplie sans la virgule, puis place-la (autant de décimales qu'au total dans les facteurs).",
           "c) 10 % de plus : on achète 1,1 fois l'aire."],
          "a) " + M(D(L) + " \\cdot " + D(l) + " = " + D(A)) + " m². b) " + M(D(A) + " \\cdot " + CHF(pu) + " \\approx " + CHF(C)) + " CHF. c) " + M(D(A) + " \\cdot 1{,}1 \\cdot " + CHF(pu) + " \\approx " + CHF(C2)) + " CHF.");
      },
      /* 26.11 (décision de l'enseignant, n° 6 : contextes élargis ; revue D4 : « On carrelle une pièce… » 3 fois en 4 jours) :
         six autres situations, chacune avec son ctx (anti-répétition sur 7 jours, Engine.make) et des grandeurs réalistes
         (prix du marché, puissance d'un appareil, tarif de location, salaire horaire d'un job d'été, masse d'une bouteille
         pleine, tissu au m²). Valeurs au centime quand le calcul en donne plus, et le corrigé écrit la même valeur. */
      () => { /* marché : masses × prix au kilo */
        const f1 = pk([["pommes", 2.9, 4.2], ["poires", 3.5, 4.9], ["carottes", 1.9, 2.9]]), f2 = pk([["tomates", 3.9, 5.9], ["courgettes", 3.2, 4.8], ["cerises", 9.5, 14.5]]);
        const p1 = ri(f1[1] * 10, f1[2] * 10) / 10, p2 = ri(f2[1] * 10, f2[2] * 10) / 10, m1 = ri(12, 35) / 10, m2 = ri(4, 18) / 10;
        const a = r2c(m1 * p1), b = r2c(m2 * p2), t = r2c(a + b), B = t < 20 ? 20 : 50, r = r2c(B - t);
        return Object.assign(P("Au marché, " + M(D(m1) + " \\text{ kg}") + " de " + f1[0] + " à " + M(CHF(p1)) + " CHF le kilo et " + M(D(m2) + " \\text{ kg}") + " de " + f2[0] + " à " + M(CHF(p2)) + " CHF le kilo.",
          [["a) Prix des " + f1[0] + " (CHF, au centime)", a, 0.01], ["b) Prix total (CHF, au centime)", t, 0.01], ["c) On paie avec un billet de " + B + " CHF : monnaie rendue (CHF, au centime)", r, 0.01]],
          ["Prix = masse · prix au kilo, pour chaque produit.", "c) Billet − prix total."],
          "a) " + M(D(m1) + " \\cdot " + CHF(p1) + eqa(m1 * p1, a) + CHF(a)) + " CHF. b) " + M(D(m2) + " \\cdot " + CHF(p2) + eqa(m2 * p2, b) + CHF(b)) + " CHF, total " + M(CHF(a) + " + " + CHF(b) + " = " + CHF(t)) + " CHF. c) " + M(B + " - " + CHF(t) + " = " + CHF(r)) + " CHF."), { ctx: "marche" });
      },
      () => { /* électricité : puissance · durée = énergie ; énergie · tarif */
        const ap = pk([["Un radiateur d'appoint", [1.5, 2]], ["Un sèche-linge", [2.5, 2.8]], ["Un four", [2.2, 2.4]]]), kw = pk(ap[1]), h = pk([0.5, 1.5, 2.5]), tf = pk([0.24, 0.28, 0.32]), j = pk([20, 30]);
        const e = +(kw * h).toFixed(6), c = r2c(e * tf), cj = r2c(e * tf * j);
        return Object.assign(P(ap[0] + " a une puissance de " + M(D(kw) + " \\text{ kW}") + ". Il fonctionne " + M(D(h) + " \\text{ h}") + " par jour. Le kilowattheure (kWh) coûte " + M(CHF(tf)) + " CHF.",
          [["a) Énergie consommée par jour (kWh)", e], ["b) Coût par jour (CHF, au centime)", c, 0.01], ["c) Coût sur " + j + " jours (CHF, au centime)", cj, 0.01]],
          ["Énergie (kWh) = puissance (kW) · durée (h).", "c) Calcule avec l'énergie de " + j + " jours, puis arrondis à la fin."],
          "a) " + M(D(kw) + " \\cdot " + D(h) + " = " + D(e)) + " kWh. b) " + M(D(e) + " \\cdot " + CHF(tf) + eqa(e * tf, c) + CHF(c)) + " CHF. c) " + M(D(e) + " \\cdot " + j + " = " + D(+(e * j).toFixed(6))) + " kWh, " + M(D(+(e * j).toFixed(6)) + " \\cdot " + CHF(tf) + eqa(e * j * tf, cj) + CHF(cj)) + " CHF."), { ctx: "electricite" });
      },
      () => { /* location de vélos : tarif horaire · durée · nombre */
        const tx = pk([4.5, 5.5, 6.5, 7.5]), h = pk([1.5, 2.5, 3.5]), n = ri(2, 4), u = r2c(tx * h), t = r2c(u * n), B = t < 50 ? 50 : t < 100 ? 100 : 200, r = r2c(B - t);
        return Object.assign(P("Une famille loue " + M(n) + " vélos pendant " + M(D(h) + " \\text{ h}") + ". La location coûte " + M(CHF(tx)) + " CHF de l'heure par vélo.",
          [["a) Prix pour un vélo (CHF)", u], ["b) Prix pour les " + n + " vélos (CHF)", t], ["c) Monnaie rendue sur " + B + " CHF (CHF)", r]],
          ["Un vélo : tarif horaire · nombre d'heures.", "b) Multiplie par le nombre de vélos."],
          "a) " + M(CHF(tx) + " \\cdot " + D(h) + " = " + CHF(u)) + " CHF. b) " + M(CHF(u) + " \\cdot " + n + " = " + CHF(t)) + " CHF. c) " + M(B + " - " + CHF(t) + " = " + CHF(r)) + " CHF."), { ctx: "location" });
      },
      () => { /* job d'été : salaire horaire · heures */
        const sh = pk([13.5, 14.5, 15.5, 16.5, 17.5]), hj = pk([3.5, 4.5, 5.5]), nj = ri(3, 5), hs = pk([1.5, 2.5]), w = pk([["Lina", "elle"], ["Noé", "il"], ["Inès", "elle"], ["Yanis", "il"], ["Mia", "elle"], ["Tom", "il"]]);
        const g = r2c(sh * hj), gs = r2c(g * nj), gt = r2c(gs + sh * hs);
        return Object.assign(P(w[0] + " a un job d'été payé " + M(CHF(sh)) + " CHF de l'heure. Pendant " + nj + " jours, " + w[1] + " travaille " + M(D(hj) + " \\text{ h}") + " par jour, puis encore " + M(D(hs) + " \\text{ h}") + " le samedi.",
          [["a) Salaire d'une journée (CHF, au centime)", g, 0.01], ["b) Salaire des " + nj + " journées (CHF, au centime)", gs, 0.01], ["c) Salaire total avec le samedi (CHF, au centime)", gt, 0.01]],
          ["Salaire = salaire horaire · nombre d'heures.", "c) Ajoute le salaire des heures du samedi."],
          "a) " + M(CHF(sh) + " \\cdot " + D(hj) + eqa(sh * hj, g) + CHF(g)) + " CHF. b) " + M(CHF(g) + " \\cdot " + nj + " = " + CHF(gs)) + " CHF. c) " + M(CHF(gs) + " + " + CHF(sh) + " \\cdot " + D(hs) + eqa(gs + sh * hs, gt) + CHF(gt)) + " CHF."), { ctx: "salaire" });
      },
      () => { /* livraison : masse d'une bouteille pleine · nombre, casiers */
        const b = pk([[12, "bouteilles de jus de 1 L", [1.48, 1.52, 1.55], [1.6, 1.8]], [20, "bouteilles d'eau de 0,5 L", [0.82, 0.85, 0.88], [1.9, 2.2]], [24, "bouteilles de 33 cl", [0.53, 0.55, 0.58], [1.8, 2.1]]]), mb = pk(b[2]), mc = pk(b[3]), nc = ri(3, 6);
        const m1 = +(b[0] * mb).toFixed(6), mcs = +(m1 + mc).toFixed(6), mt = +(mcs * nc).toFixed(6);
        return Object.assign(P("Un casier contient " + M(b[0]) + " " + b[1] + ". Une bouteille pleine pèse " + M(D(mb) + " \\text{ kg}") + " et le casier vide " + M(D(mc) + " \\text{ kg}") + ". On charge " + M(nc) + " casiers pleins dans une voiture.",
          [["a) Masse des bouteilles d'un casier (kg)", m1], ["b) Masse d'un casier plein (kg)", mcs], ["c) Masse des " + nc + " casiers (kg)", mt]],
          ["a) Masse d'une bouteille · nombre de bouteilles.", "c) Masse d'un casier plein · nombre de casiers."],
          "a) " + M(b[0] + " \\cdot " + D(mb) + " = " + D(m1)) + " kg. b) " + M(D(m1) + " + " + D(mc) + " = " + D(mcs)) + " kg. c) " + M(D(mcs) + " \\cdot " + nc + " = " + D(mt)) + " kg."), { ctx: "livraison" });
      },
      () => { /* rideaux : surface de tissu · prix au m² */
        const l = pk([1.2, 1.4, 1.5]), h = pk([2.25, 2.4, 2.6]), n = pk([2, 4]), pu = pk([9.9, 12.5, 14.9, 18.5]);
        const a = +(l * h).toFixed(6), at = +(a * n).toFixed(6), c = r2c(at * pu);
        return Object.assign(P("Pour " + M(n) + " rideaux, il faut pour chacun un rectangle de tissu de " + M(D(l) + " \\text{ m}") + " sur " + M(D(h) + " \\text{ m}") + ". Le tissu coûte " + M(CHF(pu)) + " CHF le m².",
          [["a) Aire de tissu pour un rideau (m²)", a], ["b) Aire de tissu pour les " + n + " rideaux (m²)", at], ["c) Prix du tissu (CHF, au centime)", c, 0.01]],
          ["Aire = longueur · largeur : place bien la virgule.", "c) Aire totale · prix au m²."],
          "a) " + M(D(l) + " \\cdot " + D(h) + " = " + D(a)) + " m². b) " + M(D(a) + " \\cdot " + n + " = " + D(at)) + " m². c) " + M(D(at) + " \\cdot " + CHF(pu) + eqa(at * pu, c) + CHF(c)) + " CHF."), { ctx: "rideaux" });
      },
    ],
    /* ---------- 10e : addition et soustraction de décimaux ---------- */
    decadd: [
      () => {
        let B, p1, p2, p3;
        do { B = pk([50, 60, 80, 100]); p1 = 0.05 * ri(200, 500); p2 = 0.05 * ri(40, 200); p3 = 0.05 * ri(300, 900); } while (p1 + p2 >= B - 2 || p3 <= B - p1 - p2 + 1);
        const t = r2c(p1 + p2), r = r2c(B - t), mq = r2c(p3 - r);
        return P("Léa a " + M(B) + " CHF. Elle achète un livre à " + M(CHF(p1)) + " CHF et un stylo à " + M(CHF(p2)) + " CHF.",
          [["a) Dépense totale (CHF)", t], ["b) Argent restant (CHF)", r], ["c) Il lui manque combien pour un jeu à " + CHF(p3) + " CHF ?", mq]],
          ["Aligne les virgules (complète par des 0 : " + B + " = " + B + ",00).", "c) Prix du jeu − argent restant."],
          "a) " + M(CHF(p1) + " + " + CHF(p2) + " = " + CHF(t)) + " CHF. b) " + M(B + " - " + CHF(t) + " = " + CHF(r)) + " CHF. c) " + M(CHF(p3) + " - " + CHF(r) + " = " + CHF(mq)) + " CHF.");
      },
    ],
    /* ---------- 10e : relatifs (altitudes) ---------- */
    reladd: [
      function DEFIS_RELADD() {
        const h0 = ri(193, 690), u1 = 5 * ri(120, 300), d1 = 5 * ri(40, 110), u2 = 5 * ri(20, 80), d2 = 5 * ri(100, 250);
        const a1 = h0 + u1, fin = a1 - d1 + u2 - d2;
        if (fin < Math.max(193, h0 - 200) || fin === h0) return DEFIS_RELADD(); /* 26.11 (vraisemblance) : pas d'arrivée à 199 m (plus bas que tout lac suisse, 193 m) ni très au-dessous du départ */
        return P("Un randonneur part d'un lac à l'altitude " + M(h0 + " \\text{ m}") + ". Il monte de " + M(nb(u1) + " \\text{ m}") + ", redescend de " + M(d1 + " \\text{ m}") + ", remonte de " + M(u2 + " \\text{ m}") + " puis redescend de " + M(nb(d2) + " \\text{ m}") + ".",
          [["a) Altitude du point le plus haut (m)", Math.max(a1, a1 - d1 + u2)], ["b) Altitude finale (m)", fin], ["c) Dénivelé total à la montée (m)", u1 + u2], ["d) Variation d'altitude entre le départ et l'arrivée (m, négative si plus bas)", fin - h0]],
          ["Écris la suite des altitudes : chaque montée s'ajoute, chaque descente se soustrait.",
           "d) Variation = altitude finale − altitude de départ (ou somme des montées − somme des descentes)."],
          "Altitudes : " + [h0, a1, a1 - d1, a1 - d1 + u2, fin].map(nb).join(" ; ") + " m. a) " + M(nb(Math.max(a1, a1 - d1 + u2))) + " m. b) " + M(nb(fin)) + " m. c) " + M(nb(u1) + " + " + u2 + " = " + nb(u1 + u2)) + " m. d) " + M(nb(u1 + u2) + " - " + nb(d1 + d2) + " = " + nb(fin - h0)) + " m.");
      },
    ],
    /* ---------- 11e : relatifs (températures) ---------- */
    rel: [
      () => {
        let t1, t2, d; do { t1 = -ri(3, 12); t2 = ri(4, 15); d = ri(t2 + 2, t2 + 12); } while ((t1 + t2 + t2 - d) % 3 === 0);
        const t3 = t2 - d, mo = (t1 + t2 + t3) / 3;
        return P("À La Brévine, la température passe de " + M(t1 + " \\text{ °C}") + " à 7 h à " + M(t2 + " \\text{ °C}") + " à 14 h, puis baisse de " + M(d + " \\text{ °C}") + " jusqu'à minuit.",
          [["a) Hausse entre 7 h et 14 h (°C)", t2 - t1], ["b) Température à minuit (°C)", t3], ["c) Moyenne des trois relevés (°C, fraction)", mo], ["d) Écart entre la température de minuit et celle de 7 h (°C, négatif si plus froid)", t3 - t1]],
          ["Hausse = température d'arrivée − température de départ ; soustraire un négatif, c'est additionner son opposé.",
           "c) Somme des trois relevés ÷ 3 ; elle n'est pas entière."],
          "a) " + M(t2 + " - (" + t1 + ") = " + (t2 - t1)) + " °C. b) " + M(t2 + " - " + d + " = " + t3) + " °C. c) " + M("\\frac{" + t1 + " + " + t2 + " + (" + t3 + ")}{3} = " + fx(mo)) + " °C. d) " + M(pr(t3) + " - (" + t1 + ") = " + (t3 - t1)) + " °C.");
      },
    ],
    /* ---------- 11e : priorités avec des fractions ---------- */
    fracops: [
      () => {
        const fxOk = (v) => { for (let q = 1; q <= 12; q++) if (Math.abs(v * q - Math.round(v * q)) < 1e-9) return true; return false; };
        let a, b, c, d, e, f, A, B;
        do { b = pk([2, 3, 4, 5, 6]); a = ri(1, b - 1); d = pk([2, 3, 4, 5, 6, 8]); c = ri(1, d - 1); f = pk([2, 3, 4, 5, 7]); e = ri(1, f + 3); A = a / b - (c / d) * (e / f); B = (a / b - c / d) * (e / f); }
        while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || gcd(e, f) !== 1 || e === f || b === d || Math.abs(A) < 1e-9 || Math.abs(B) < 1e-9 || Math.abs(A - B) < 1e-9 || !fxOk((c * e) / (d * f)) || !fxOk(a / b - c / d) || !fxOk(A) || !fxOk(B) || !fxOk(A - B));
        const F = (n, m) => "\\frac{" + n + "}{" + m + "}";
        return P("On pose " + M("A = " + F(a, b) + " - " + F(c, d) + " \\cdot " + F(e, f)) + " et " + M("B = \\left(" + F(a, b) + " - " + F(c, d) + "\\right) \\cdot " + F(e, f)) + " (fractions acceptées).",
          [["a) " + M("A"), A], ["b) " + M("B"), B], ["c) " + M("A - B"), A - B]],
          ["A : la multiplication passe avant la soustraction. B : la parenthèse d'abord (dénominateur commun).",
           "Simplifie avant de multiplier quand c'est possible ; pour c), dénominateur commun."],
          "a) " + M("A = " + F(a, b) + " - " + fx((c * e) / (d * f)) + " = " + fx(A)) + ". b) " + M("B = " + fx(a / b - c / d) + " \\cdot " + F(e, f) + " = " + fx(B)) + ". c) " + M(fx(A) + " - \\left(" + fx(B) + "\\right) = " + fx(A - B)) + ".");
      },
    ],
    /* ---------- 11e : puissances ---------- */
    puiss: [
      () => { /* pliages : croissance exponentielle */
        const e = pk([0.05, 0.08, 0.1, 0.12, 0.2]), n = ri(4, 7), m = ri(9, 12), [nom, H] = pk([["la hauteur d'une porte (2 m)", 2], ["le Jet d'eau de Genève (140 m)", 140], ["la tour Eiffel (330 m)", 330], ["le Cervin (4'478 m)", 4478]]);
        let k = 0; while (2 ** k * e <= H * 1000) k++;
        return P("Une feuille de " + M(D(e) + " \\text{ mm}") + " d'épaisseur double d'épaisseur à chaque pliage (on imagine qu'on peut la plier autant qu'on veut).",
          [["a) Nombre de couches après " + n + " pliages", 2 ** n], ["b) Épaisseur après " + m + " pliages (mm, au dixième)", 2 ** m * e, 0.1], ["c) Combien de pliages pour dépasser " + nom + " ?", k]],
          ["Après n pliages : 2ⁿ couches, donc une épaisseur de 2ⁿ · " + T(e) + " mm.",
           "c) Convertis en mm : il faut 2ⁿ · " + T(e) + " > " + nbT(H * 1000) + ", soit 2ⁿ > " + T(r1((H * 1000) / e)) + ". Essaie des puissances de 2 (2¹⁰ = 1'024)."],
          "a) " + M("2^{" + n + "} = " + 2 ** n) + ". b) " + M("2^{" + m + "} \\cdot " + D(e) + " = " + nb(2 ** m) + " \\cdot " + D(e) + " \\approx " + D(r1(2 ** m * e))) + " mm. c) " + M("2^{" + (k - 1) + "} \\cdot " + D(e) + " \\approx " + nb(r1(2 ** (k - 1) * e)) + " \\le " + nb(H * 1000)) + " mais " + M("2^{" + k + "} \\cdot " + D(e) + " \\approx " + nb(r1(2 ** k * e)) + " > " + nb(H * 1000)) + " mm : " + M(k) + " pliages.");
      },
      () => { /* tout écrire avec la même base */
        let a, b, c, p, q, r;
        do { a = ri(2, 9); b = ri(2, 6); c = ri(2, 6); p = ri(2, 7); q = ri(1, 5); r = ri(3, 12); } while (a + 2 * b - 3 * c === 0 || Math.abs(a + 2 * b - 3 * c) === 1 || 2 * p + 3 * q - r === 0 || Math.abs(2 * p + 3 * q - r) === 1 || a + 2 * b - 3 * c === 2 * p + 3 * q - r);
        const e1 = a + 2 * b - 3 * c, e2 = 2 * p + 3 * q - r;
        return P("On écrit chaque nombre comme une puissance d'un nombre premier : " + M("A = \\frac{2^{" + a + "} \\cdot 4^{" + b + "}}{8^{" + c + "}} = 2^m") + " et " + M("B = \\frac{9^{" + p + "} \\cdot 27^{" + q + "}}{3^{" + r + "}} = 3^n") + ".",
          [["a) " + M("m") + " (négatif possible)", e1], ["b) " + M("n"), e2]],
          ["4 = 2², 8 = 2³, 9 = 3², 27 = 3³. (aᵖ)^q = a^(p·q).",
           "Produit : on additionne les exposants ; quotient : on soustrait."],
          "a) " + M("\\frac{2^{" + a + "} \\cdot 2^{" + 2 * b + "}}{2^{" + 3 * c + "}} = 2^{" + e1 + "}") + ". b) " + M("\\frac{3^{" + 2 * p + "} \\cdot 3^{" + 3 * q + "}}{3^{" + r + "}} = 3^{" + e2 + "}")+ ".");
      },
    ],
    /* ---------- 11e : notation scientifique (vitesse de la lumière ; 26.11 soir, agent defis3 : + objets microscopiques
       et rayons des astres, 3 contextes et plus) ---------- */
    sci: [
      () => {
        const [pl, man, ex] = pk([["Mars", 2.28, 8], ["Jupiter", 7.78, 8], ["Saturne", 1.43, 9], ["Uranus", 2.87, 9], ["Neptune", 4.5, 9], ["Mercure", 5.79, 7], ["Vénus", 1.08, 8]]);
        const dkm = man * 10 ** ex, t = dkm / 3e5;
        return Object.assign(P("La planète " + pl + " est à environ " + M(D(man) + " \\cdot 10^{" + ex + "} \\text{ km}") + " du Soleil. La lumière parcourt " + M("3 \\cdot 10^5 \\text{ km}") + " par seconde.",
          [["a) Cette distance en m s'écrit " + M("a \\cdot 10^n") + " : que vaut " + M("n") + " ?", ex + 3], ["b) Durée du trajet de la lumière du Soleil à " + pl + " (s, à l'unité)", t, 1], ["c) Cette durée en minutes (au dixième)", t / 60, 0.1]],
          ["1 km = 10³ m : multiplie par 10³, donc ajoute 3 à l'exposant.",
           "Temps = distance ÷ vitesse : divise les nombres devant (" + T(man) + " ÷ 3) et soustrais les exposants (" + ex + " − 5)."],
          "a) " + M(D(man) + " \\cdot 10^{" + ex + "} \\cdot 10^3 = " + D(man) + " \\cdot 10^{" + (ex + 3) + "}") + " m. b) " + M("\\frac{" + D(man) + " \\cdot 10^{" + ex + "}}{3 \\cdot 10^5} \\approx " + D(r2c((man / 3) * 10 ** (ex - 5 - Math.floor(Math.log10(t))))) + " \\cdot 10^{" + Math.floor(Math.log10(t)) + "} \\approx " + nb(Math.round(t))) + " s. c) " + M(nb(Math.round(t)) + " \\div 60 \\approx " + D(r1(t / 60))) + " min."), { ctx: "lumiere" });
      },
      () => { /* objets microscopiques : diamètre en nm ou µm, nombre d'objets alignés sur 1 mm */
        const o = pk([["atome", "Un atome d'hydrogène a un diamètre d'environ", [1.06], -10, "nm", -9], ["virus", "Un virus de la grippe a un diamètre d'environ", [1, 1.2, 1.4], -7, "nm", -9],
          ["cellule", "Une bactérie mesure environ", [2, 3, 4], -6, "µm", -6], ["cellule", "Un globule rouge a un diamètre d'environ", [7, 7.5, 8], -6, "µm", -6], ["cellule", "Un grain de pollen de bouleau mesure environ", [2, 2.5], -5, "µm", -6]]);
        const m = pk(o[2]), sc = (a, e) => D(a) + " \\cdot 10^{" + e + "}", d = +(m * 10 ** o[3]).toPrecision(12), inU = +(m * 10 ** (o[3] - o[5])).toPrecision(12), n = 1e-3 / d, e = Math.floor(Math.log10(n) + 1e-9), st = e >= 2 ? 10 ** (e - 1) : 1;
        const W = { 1: "à l'unité", 10: "à la dizaine", 100: "à la centaine", 1000: "au millier", 10000: "à la dizaine de milliers", 100000: "à la centaine de milliers", 1000000: "au million" }[st], ar = Math.round(n / st) * st;
        return Object.assign(P(o[1] + " " + M(sc(m, o[3])) + " m.",
          [["a) " + (o[0] === "cellule" ? "Cette mesure" : "Ce diamètre") + " en " + o[4] + " (1 " + o[4] + " = 10" + (o[5] === -9 ? "⁻⁹" : "⁻⁶") + " m)", inU], ["b) Combien de ces objets faut-il aligner pour faire 1 mm ? (arrondi " + W + ")", ar, st]],
          ["a) Divise par " + M("10^{" + o[5] + "}") + " : on soustrait les exposants.", "b) " + M("10^{-3} : (" + sc(m, o[3]) + ")") + "."],
          "a) " + M(sc(m, o[3]) + " : 10^{" + o[5] + "} = " + D(inU)) + " " + o[4] + " ; b) " + M("\\frac{10^{-3}}{" + sc(m, o[3]) + "} \\approx " + D(n >= 1000 ? Math.round(n) : r1(n))) + ", soit environ " + M(D(ar)) + "."), { ctx: o[0] });
      },
      () => { /* rayon d'un astre : conversion en m, longueur de l'équateur */
        const [nm, r] = pk([["la Terre", 6.37], ["Mars", 3.39], ["Vénus", 6.05], ["la Lune", 1.74], ["Mercure", 2.44]]), C = 2 * Math.PI * r * 1000, st = r >= 5 ? 1000 : 100, ar = Math.round(C / st) * st;
        return Object.assign(P("Le rayon de " + nm + " vaut environ " + M(D(r) + " \\cdot 10^3") + " km.", [["a) Ce rayon en m (nombre entier)", Math.round(r * 1e6)], ["b) Longueur de l'équateur en km (2πr, arrondie " + (st === 1000 ? "au millier" : "à la centaine") + ")", ar, st]],
          ["1 km = 10³ m : " + M(D(r) + " \\cdot 10^3 \\cdot 10^3") + ".", "b) " + M("2 \\cdot \\pi \\cdot " + D(r * 1000)) + "."],
          "a) " + M(D(r) + " \\cdot 10^6 = " + D(Math.round(r * 1e6))) + " m ; b) " + M("2\\pi \\cdot " + D(r * 1000) + " \\approx " + D(Math.round(C))) + ", soit environ " + M(D(ar)) + " km."), { ctx: "planete" });
      },
    ],
    /* ---------- 1re Collège : critères de divisibilité ---------- */
    divcrit: [
      () => {
        let a, b; do { a = ri(1, 9); b = ri(0, 9); } while ((a + b) % 9 === 0);
        const ok45 = [], ok36 = [];
        for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) { const N = 1000 * a + 100 * b + 10 * x + y; if (N % 45 === 0) ok45.push(N); if (N % 36 === 0) ok36.push(N); }
        return P("On cherche les nombres de quatre chiffres " + M(a + "\\," + b + "\\,■\\,■") + " (les deux derniers chiffres sont à trouver).",
          [["a) Combien de ces nombres sont divisibles par 45 ?", ok45.length], ["b) Le plus grand d'entre eux", Math.max(...ok45)], ["c) Combien sont divisibles par 36 ?", ok36.length]],
          ["45 = 5 · 9 (5 et 9 n'ont pas de diviseur commun) : le nombre doit finir par 0 ou 5 ET la somme de ses chiffres doit être un multiple de 9.",
           "36 = 4 · 9 : les deux derniers chiffres forment un multiple de 4, et la somme des chiffres est un multiple de 9. Teste les multiples de 4 de 00 à 96."],
          "a) Unités 0 ou 5, puis somme des chiffres multiple de 9 : " + ok45.map(nb).join(" ; ") + ", soit " + M(ok45.length) + ". b) " + M(nb(Math.max(...ok45))) + ". c) " + ok36.map(nb).join(" ; ") + " : " + M(ok36.length) + " nombres.");
      },
    ],
    /* ---------- 1re Collège : encadrer une racine ---------- */
    racenc: [
      () => {
        let n; do { n = ri(20, 300); } while (Number.isInteger(Math.sqrt(n)) || Math.abs(Math.sqrt(n) * 10 - Math.round(Math.sqrt(n) * 10) - 0.5) < 0.05);
        const k = Math.floor(Math.sqrt(n)), g = ri(2, 4);
        return P("On étudie " + M("\\sqrt{" + n + "}") + " sans calculatrice.",
          [["a) Entier juste en dessous de " + M("\\sqrt{" + n + "}"), k], ["b) " + M("\\sqrt{" + n + "}") + " au dixième (encadre avec les carrés de " + k + ",1 ; " + k + ",2…)", Math.sqrt(n), 0.1], ["c) Combien d'entiers " + M("m") + " vérifient " + M(k + " < \\sqrt{m} < " + (k + g)) + " ?", (k + g) ** 2 - k * k - 1]],
          [k + "² = " + k * k + " et " + (k + 1) + "² = " + (k + 1) ** 2 + ". Pour le dixième, calcule les carrés des nombres " + k + ",1 ; " + k + ",2 ; … jusqu'à dépasser " + n + ".",
           "Au dixième : compare aussi " + n + " au carré du nombre « du milieu » (…,…5) pour savoir s'il faut arrondir vers le haut. c) Élève au carré : " + k * k + " < m < " + (k + g) ** 2 + "."],
          "a) " + M(k * k + " < " + n + " < " + (k + 1) ** 2) + " : " + M(k) + ". b) " + M("\\sqrt{" + n + "} \\approx " + D(r1(Math.sqrt(n)))) + " (" + M(D(r1(Math.sqrt(n)) - 0.05) + "^2 < " + n + " < " + D(r1(Math.sqrt(n)) + 0.05) + "^2") + "). c) " + M(k * k + " < m < " + (k + g) ** 2) + " : de " + M(k * k + 1) + " à " + M((k + g) ** 2 - 1) + ", soit " + M((k + g) ** 2 - k * k - 1) + " entiers.");
      },
    ],
    /* ---------- 1re Collège : traduire une phrase en expression ---------- */
    tradexpr: [
      () => {
        let x, a, b; do { x = R.nz(-6, 9); a = ri(2, 9); b = ri(2, 9); } while (x === b || x === a || x === -a || Math.abs(x) === b);
        return P("Un nombre " + M("x") + " vaut " + M(x) + ".",
          [["a) Le double de la somme de " + M("x") + " et " + M(a), 2 * (x + a)], ["b) La somme du double de " + M("x") + " et de " + M(a), 2 * x + a], ["c) Le carré de la différence entre " + M("x") + " et " + M(b), (x - b) ** 2], ["d) La différence entre le carré de " + M("x") + " et le carré de " + M(b), x * x - b * b]],
          ["Le premier mot de la phrase dit la DERNIÈRE opération : « le double de la somme » = 2 · ( … + … ).",
           "« Le carré de la différence » = ( … − … )² ; « la différence des carrés » = …² − …². Attention aux parenthèses autour de " + x + (x < 0 ? " (négatif)" : "") + "."],
          "a) " + M("2 \\cdot (" + x + " + " + a + ") = " + 2 * (x + a)) + ". b) " + M("2 \\cdot " + pr(x) + " + " + a + " = " + (2 * x + a)) + ". c) " + M("(" + x + " - " + b + ")^2 = " + pr(x - b) + "^2 = " + (x - b) ** 2) + ". d) " + M(pr(x) + "^2 - " + b + "^2 = " + x * x + " - " + b * b + " = " + (x * x - b * b)) + ".");
      },
    ],
    /* ---------- 4e Collège : croissance exponentielle (base e) ---------- */
    croissance: [
      () => {
        const N0 = 50 * ri(4, 20), k = pk([0.15, 0.2, 0.25, 0.3, 0.35, 0.4]), t1 = ri(5, 12), M_ = N0 * pk([10, 20, 50]);
        const Td = Math.log(2) / k, N1 = N0 * Math.exp(k * t1), tM = Math.log(M_ / N0) / k;
        return P("Une population de bactéries suit " + M("N(t) = " + N0 + " \\cdot e^{" + D(k) + "t}") + " (" + M("t") + " en heures).",
          [["a) Temps de doublement (h, au centième)", Td, 0.01], ["b) Population après " + t1 + " heures (à l'unité)", N1, 1], ["c) Après combien d'heures dépasse-t-elle " + nbT(M_) + " bactéries ? (h, au centième)", tM, 0.01]],
          ["Doublement : N(T) = 2 · " + N0 + ", donc e^(" + T(k) + "T) = 2, puis applique ln aux deux membres.",
           "c) " + N0 + " · e^(" + T(k) + "t) = " + nbT(M_) + " donne e^(" + T(k) + "t) = " + M_ / N0 + ", puis t = ln(" + M_ / N0 + ") ÷ " + T(k) + "."],
          "a) " + M("T = \\frac{\\ln 2}{" + D(k) + "} \\approx " + D(r2c(Td))) + " h. b) " + M(N0 + " \\cdot e^{" + D(r2c(k * t1)) + "} \\approx " + nb(Math.round(N1))) + ". c) " + M("t = \\frac{\\ln " + M_ / N0 + "}{" + D(k) + "} \\approx " + D(r2c(tM))) + " h.");
      },
    ],
    /* ---------- 4e Collège : étude de x − a ln x ---------- */
    lnexp: [
      () => {
        const a = pk([2, 3, 4, 5, 6]), b = pk([1, 2, 3]);
        const f = (x) => b * x - a * Math.log(x), mn = f(a / b), x1 = pk([2, 3, 4, 5, 6, 8].filter((v) => v * b !== a));
        return P("Soit " + M("f(x) = " + (b === 1 ? "" : b) + "x - " + a + "\\ln x") + " pour " + M("x > 0") + ".",
          [["a) " + M("f'(" + x1 + ")") + " (fraction)", b - a / x1], ["b) Abscisse du minimum (fraction)", a / b], ["c) Valeur du minimum (au centième)", mn, 0.01], ["d) Équation de la tangente en " + M("x = 1") + " : " + M("y = mx + p") + ". Que vaut " + M("p") + " ?", f(1) - (b - a)]],
          ["(ln x)' = 1/x, donc f'(x) = " + b + " − " + a + "/x. Le minimum est atteint où f' s'annule (f' négative avant, positive après).",
           "d) La tangente en 1 a pour équation y = f'(1)(x − 1) + f(1), avec f(1) = " + b + " (ln 1 = 0)."],
          M("f'(x) = " + b + " - \\frac{" + a + "}{x}") + ". a) " + M("f'(" + x1 + ") = " + fx(b - a / x1)) + ". b) " + M("f'(x) = 0 \\iff x = " + fx(a / b)) + ". c) " + M("f\\left(" + fx(a / b) + "\\right) = " + a + " - " + a + "\\ln " + fx(a / b) + " \\approx " + D(r2c(mn))) + ". d) " + M("f'(1) = " + (b - a) + ", \\; f(1) = " + b + ", \\; y = " + (b - a) + "(x - 1) + " + b) + " : " + M("p = " + (f(1) - (b - a))) + ".");
      },
    ],
    /* ---------- MP 1re : valeur absolue et distance ---------- */
    vabs: [
      () => {
        let a, b, c; do { a = ri(-9, 2); b = ri(a + 3, 12); c = ri(1, 6); } while ((a + b) % 2 !== 0 || a === 0 || b === 0 || c >= (b - a) / 2 - 1);
        const m = (a + b) / 2, r = (b - a) / 2;
        const cnt = cntInt((x) => Math.abs(x - m) <= r && Math.abs(x - m) > c, -20, 20);
        return P("Sur la droite des nombres, " + M("A = " + a) + " et " + M("B = " + b) + ".",
          [["a) Distance " + M("AB"), b - a], ["b) Les points de " + M("[AB]") + " sont les " + M("x") + " tels que " + M("|x - m| \\leq r") + ". Que vaut " + M("m") + " ?", m], ["c) Combien d'entiers " + M("x") + " vérifient à la fois " + M("|x - " + pr(m) + "| \\leq " + r) + " et " + M("|x - " + pr(m) + "| > " + c) + " ?", cnt]],
          ["|x − m| est la distance entre x et m. Le segment [AB] est l'ensemble des points à distance au plus (AB ÷ 2) de son milieu.",
           "c) Les entiers à distance au plus " + r + " de " + m + " mais à distance strictement plus grande que " + c + " : deux morceaux, de chaque côté de " + m + "."],
          "a) " + M("|" + b + " - (" + a + ")| = " + (b - a)) + ". b) Milieu " + M("m = \\frac{" + a + " + " + b + "}{2} = " + m) + ", rayon " + M("r = " + r) + ". c) " + (c >= r ? "Aucun entier : " + M(c + " \\geq " + r) : M("x \\in [" + a + " ; " + (m - c) + "[ \\cup ]" + (m + c) + " ; " + b + "]") + " : " + M(cnt) + " entiers") + ".");
      },
    ],
    /* ---------- MP 4e : produit vectoriel (aire, volume) ---------- */
    pvectmp: [
      () => {
        let u, v, w, cr, vol;
        do { u = [ri(-3, 3), ri(-3, 3), ri(-3, 3)]; v = [ri(-3, 3), ri(-3, 3), ri(-3, 3)]; w = [ri(-3, 3), ri(-3, 3), R.nz(1, 4)];
          cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; vol = Math.abs(cr[0] * w[0] + cr[1] * w[1] + cr[2] * w[2]); }
        while (cr.filter((c) => c !== 0).length < 3 || vol === 0 || u.filter((c) => c === 0).length > 1 || v.filter((c) => c === 0).length > 1);
        const A = Math.hypot(...cr), vec = (z) => "(" + z.join(" ; ") + ")";
        return P("On donne " + M("\\vec u = " + vec(u)) + ", " + M("\\vec v = " + vec(v)) + " et " + M("\\vec w = " + vec(w)) + ".",
          [["a) Première composante de " + M("\\vec u \\times \\vec v"), cr[0]], ["b) Troisième composante de " + M("\\vec u \\times \\vec v"), cr[2]], ["c) Aire du triangle construit sur " + M("\\vec u") + " et " + M("\\vec v") + " (au centième)", A / 2, 0.01], ["d) Volume du parallélépipède construit sur " + M("\\vec u") + ", " + M("\\vec v") + " et " + M("\\vec w"), vol]],
          ["u × v = (u₂v₃ − u₃v₂ ; u₃v₁ − u₁v₃ ; u₁v₂ − u₂v₁). Sa norme est l'aire du parallélogramme ; le triangle en est la moitié.",
           "c) Volume = |(u × v) · w| (produit mixte)."],
          "a) et b) " + M("\\vec u \\times \\vec v = " + vec(cr)) + ". c) " + M("\\frac{\\sqrt{" + (cr[0] ** 2 + cr[1] ** 2 + cr[2] ** 2) + "}}{2} \\approx " + D(r2c(A / 2))) + ". d) " + M("|" + pr(cr[0]) + " \\cdot " + pr(w[0]) + " + " + pr(cr[1]) + " \\cdot " + pr(w[1]) + " + " + pr(cr[2]) + " \\cdot " + pr(w[2]) + "| = " + vol) + ".");
      },
    ],
    /* ---------- 1re Collège : domaine de définition (racine et trinôme) ---------- */
    domaine: [
      () => {
        let a, r1, r2; do { a = ri(-4, 6); r1 = ri(-9, 6); r2 = ri(r1 + 1, 9); } while (r1 === -a || r2 === -a || r2 < -a || r1 + r2 === 0 || r1 * r2 === 0);
        const s = r1 + r2, pp = r1 * r2, inter = [r1, r2].filter((r) => r >= -a), cnt = cntInt((x) => x >= -a && x !== r1 && x !== r2);
        return P("On étudie " + M("f(x) = \\frac{\\sqrt{" + xm(-a) + "}}{" + poly([1, -s, pp]) + "}") + ".",
          [["a) Plus petite valeur de " + M("x") + " permise par la racine", -a], ["b) Combien de valeurs interdites par le dénominateur sont dans cette zone ?", inter.length], ["c) Combien d'entiers de " + M("-10") + " à " + M("10") + " sont dans le domaine ?", cnt]],
          ["Racine : il faut " + xmT(-a) + " ≥ 0. Dénominateur : il ne doit pas s'annuler ; factorise le trinôme (somme " + s + ", produit " + pp + ").",
           "Une valeur interdite par le dénominateur ne compte que si elle est déjà permise par la racine. c) Compte les entiers à partir de " + -a + " jusqu'à 10, sans les valeurs interdites."],
          "a) " + M(xm(-a) + " \\geq 0 \\iff x \\geq " + -a) + ". b) " + M(poly([1, -s, pp]) + " = (" + xm(r1) + ")(" + xm(r2) + ")") + " : valeurs " + M(r1) + " et " + M(r2) + ", dont " + M(inter.length) + " dans " + M("[" + -a + " ; +\\infty[") + ". c) De " + M(-a) + " à " + M(10) + " : " + M(11 + a) + " entiers, moins " + M(inter.filter((r) => r <= 10).length) + " : " + M(cnt) + ".");
      },
    ],
    /* ---------- 1re Collège : intervalles, intersection, réunion, différence ---------- */
    ensembles: [
      () => {
        let a, b, c, d; do { a = ri(-9, 0); c = ri(a + 2, 5); b = ri(c + 2, 9); d = ri(b + 1, 14); } while (b - c < 2);
        const inA = (x) => x >= a && x < b, inB = (x) => x > c && x <= d;
        const nA = cntInt(inA, -20, 20), nI = cntInt((x) => inA(x) && inB(x), -20, 20), nU = cntInt((x) => inA(x) || inB(x), -20, 20), nD = cntInt((x) => inA(x) && !inB(x), -20, 20);
        return P("On donne " + M("A = [" + a + " ; " + b + "[") + " et " + M("B = \\,]" + c + " ; " + d + "]") + ".",
          [["a) Nombre d'entiers de " + M("A"), nA], ["b) Nombre d'entiers de " + M("A \\cap B"), nI], ["c) Nombre d'entiers de " + M("A \\cup B"), nU], ["d) Nombre d'entiers de " + M("A \\setminus B") + " (dans A mais pas dans B)", nD]],
          ["Dessine les deux intervalles sur une même droite. Crochet tourné vers l'intérieur : borne comprise ; vers l'extérieur : exclue.",
           "A ∩ B = ]" + c + " ; " + b + "[ ; A ∪ B = [" + a + " ; " + d + "] ; A \\ B = [" + a + " ; " + c + "]."],
          "a) De " + M(a) + " à " + M(b - 1) + " : " + M(nA) + ". b) " + M("A \\cap B = \\,]" + c + " ; " + b + "[") + " : de " + M(c + 1) + " à " + M(b - 1) + ", " + M(nI) + ". c) " + M("A \\cup B = [" + a + " ; " + d + "]") + " : " + M(nU) + ". d) " + M("A \\setminus B = [" + a + " ; " + c + "]") + " : " + M(nD) + ".");
      },
    ],
    /* ---------- 11e : tableau de valeurs, images et antécédents ---------- */
    tabval: [
      () => {
        let s, c, x0; do { s = 2 * R.nz(-4, 4); c = R.nz(-9, 9); x0 = R.nz(-5, 5); } while (x0 === s / 2 || s - x0 === x0);
        const f = (x) => x * x - s * x + c;
        return P("Soit " + M("f(x) = " + poly([1, -s, c])) + ".",
          [["a) " + M("f(" + x0 + ")"), f(x0)], ["b) Un autre nombre que " + M(x0) + " qui a la même image", s - x0], ["c) Plus petite image possible (calcule un tableau de valeurs autour de " + M(s / 2) + ")", f(s / 2)]],
          ["Remplace x par " + x0 + " (avec des parenthèses s'il est négatif) : les puissances d'abord.",
           "Le tableau de valeurs est symétrique autour de x = " + s / 2 + " : f(" + s / 2 + " − k) = f(" + s / 2 + " + k). La plus petite image est au centre."],
          "a) " + M("f(" + x0 + ") = " + pr(x0) + "^2" + sgD(-s) + " \\cdot " + pr(x0) + sgD(c) + " = " + f(x0)) + ". b) Symétrie autour de " + M(s / 2) + " : " + M("f(" + (s - x0) + ") = " + f(s - x0)) + ". c) " + M("f(" + s / 2 + ") = " + f(s / 2)) + ".");
      },
    ],
    /* ---------- 11e : monômes (pavé) ---------- */
    monomes: [
      () => {
        let a, b, c; do { a = ri(1, 5); b = ri(2, 6); c = ri(2, 7); } while (a === b || b === c || a === c);
        const v = ri(2, 5), V = a * b * c, S = 2 * (a * b + b * c + a * c);
        const cf = (k) => (k === 1 ? "" : k);
        return P("Un pavé droit a pour dimensions " + M(cf(a) + "x") + ", " + M(b + "x") + " et " + M(c + "x") + " (en cm).",
          [["a) Coefficient du volume écrit sous forme de monôme " + M("kx^3"), V], ["b) Coefficient de l'aire totale (6 faces) écrite " + M("kx^2"), S], ["c) Volume pour " + M("x = " + v) + " (cm³)", V * v ** 3], ["d) Si " + M("x") + " double, le volume est multiplié par…", 8]],
          ["Multiplie les coefficients entre eux et les x entre eux : x · x · x = x³.",
           "Aire : trois paires de faces, 2(" + cf(a) + "x · " + b + "x + " + b + "x · " + c + "x + " + cf(a) + "x · " + c + "x). d) (2x)³ = 8x³."],
          "a) " + M(cf(a) + "x \\cdot " + b + "x \\cdot " + c + "x = " + V + "x^3") + ". b) " + M("2(" + a * b + "x^2 + " + b * c + "x^2 + " + a * c + "x^2) = " + S + "x^2") + ". c) " + M(V + " \\cdot " + v + "^3 = " + nb(V * v ** 3)) + " cm³. d) " + M(V + "(2x)^3 = 8 \\cdot " + V + "x^3") + " : multiplié par 8.");
      },
    ],
    /* ---------- 11e : réduire (périmètre d'un triangle) ---------- */
    reduire: [
      () => {
        let a1, b1, a2, b2, a3, b3, xi, xp, Pp;
        do { a1 = ri(1, 4); b1 = ri(1, 9); a2 = ri(2, 5); b2 = ri(1, 9); a3 = ri(2, 6); b3 = ri(1, 9); xi = (b1 + b3) / (a3 - a1); xp = ri(3, 9); Pp = (a1 + a2 + a3) * xp + b1 + b2 - b3; }
        while (a3 <= a1 || !Number.isInteger(xi) || xi < 2 || xi > 12 || b1 + b2 === b3 || a3 * xp - b3 <= 0 || a3 * xi - b3 <= 0);
        const A = a1 + a2 + a3, B = b1 + b2 - b3, cf = (k) => (k === 1 ? "" : k);
        return P("Un triangle a des côtés de " + M(cf(a1) + "x + " + b1) + ", " + M(a2 + "x + " + b2) + " et " + M(a3 + "x - " + b3) + " (en cm).",
          [["a) Coefficient de " + M("x") + " dans le périmètre réduit", A], ["b) Terme constant du périmètre réduit", B], ["c) Valeur de " + M("x") + " pour un périmètre de " + M(Pp) + " cm", xp], ["d) Valeur de " + M("x") + " pour laquelle le premier et le troisième côté sont égaux", xi]],
          ["Additionne les trois côtés, puis regroupe les termes en x et les nombres (attention au « − " + b3 + " »).",
           "c) Résous " + A + "x " + (B < 0 ? "− " + -B : "+ " + B) + " = " + Pp + ". d) Résous " + cf(a1) + "x + " + b1 + " = " + a3 + "x − " + b3 + "."],
          "a) et b) " + M("P = " + poly([A, B])) + ". c) " + M(poly([A, B]) + " = " + Pp + " \\iff " + A + "x = " + (Pp - B) + " \\iff x = " + xp) + ". d) " + M(cf(a1) + "x + " + b1 + " = " + a3 + "x - " + b3 + " \\iff " + (b1 + b3) + " = " + cfD(a3 - a1) + "x \\iff x = " + xi) + ".");
      },
    ],
    /* ---------- 11e : valeur numérique (distance de freinage) ---------- */
    valnum: [
      () => {
        const k = pk([100, 150, 200, 250]), v1 = pk([30, 40, 50, 60]), m = pk([2, 3]), v3 = pk([70, 80, 90, 100, 110, 120].filter((v) => v !== v1 * m && Number.isInteger((v * v * 100) / k)));
        const d = (v) => (v * v) / k, D3 = d(v3);
        return P("La distance de freinage d'une voiture (en m) vaut environ " + M("d = \\frac{v^2}{" + k + "}") + ", avec " + M("v") + " en km/h.",
          [["a) " + M("d") + " pour " + M("v = " + v1) + " km/h (m, au dixième)", d(v1), 0.1], ["b) Si la vitesse est multipliée par " + m + ", la distance est multipliée par…", m * m], ["c) Vitesse (km/h) pour laquelle la distance de freinage vaut " + M(D(r2c(D3))) + " m", v3]],
          ["Remplace v par sa valeur, calcule le carré, puis divise par " + k + ".",
           "b) (" + m + "v)² = " + m * m + "v². c) v² = " + k + " · " + T(r2c(D3)) + " : cherche le nombre dont le carré vaut ce résultat."],
          "a) " + M("\\frac{" + v1 + "^2}{" + k + "} = \\frac{" + nb(v1 * v1) + "}{" + k + "} " + (Number.isInteger(d(v1) * 10) ? "= " : "\\approx ") + D(r1(d(v1)))) + " m. b) " + M("(" + m + "v)^2 = " + m * m + "v^2") + " : multipliée par " + M(m * m) + ". c) " + M("v^2 = " + k + " \\cdot " + D(r2c(D3)) + " = " + nb(v3 * v3)) + ", " + M("v = " + v3) + " km/h.");
      },
    ],
    /* ---------- 1re Collège : fonction définie par morceaux (tarif de parking) ---------- */
    morceaux: [
      () => {
        let B, h0, p, Mx, tM, t1, Bud;
        do { B = ri(3, 6); h0 = pk([1, 2]); p = pk([1.5, 2, 2.5, 3]); Mx = ri(15, 30); tM = Math.ceil(h0 + (Mx - B) / p - 1e-9); t1 = ri(h0 + 2, tM - 1); Bud = ri(B + 4, Mx - 2); }
        while (tM - h0 < 4 || Number.isInteger((Mx - B) / p) || Number.isInteger((Bud - B) / p) || t1 <= h0);
        const pr1 = B + p * (t1 - h0), hb = h0 + Math.floor((Bud - B) / p + 1e-9);
        return P("Un parking coûte " + M(B) + " CHF pour " + (h0 === 1 ? "la première heure" : "les " + h0 + " premières heures") + " (ou moins), puis " + M(CHF(p)) + " CHF par heure supplémentaire commencée, avec un maximum de " + M(Mx) + " CHF par jour.",
          [["a) Prix pour " + t1 + " heures (CHF)", pr1], ["b) À partir de combien d'heures paie-t-on le maximum ?", tM], ["c) Avec " + Bud + " CHF, combien d'heures entières peut-on rester au plus ?", hb]],
          ["Pour t heures (t > " + h0 + ") : prix = " + B + " + " + CHFT(p) + " · (t − " + h0 + "), tant qu'il ne dépasse pas " + Mx + " CHF.",
           "b) Résous " + B + " + " + CHFT(p) + "(t − " + h0 + ") ≥ " + Mx + " et prends l'entier suivant. c) " + B + " + " + CHFT(p) + "(t − " + h0 + ") ≤ " + Bud + "."],
          "a) " + M(B + " + " + CHF(p) + " \\cdot " + (t1 - h0) + " = " + CHF(pr1)) + " CHF. b) " + M("t - " + h0 + " \\geq \\frac{" + (Mx - B) + "}{" + CHF(p) + "} \\approx " + D(r2c((Mx - B) / p))) + " : dès " + M(tM) + " h. c) " + M("t - " + h0 + " \\leq \\frac{" + (Bud - B) + "}{" + CHF(p) + "} \\approx " + D(r2c((Bud - B) / p))) + " : " + M(hb) + " h.");
      },
    ],
    /* ---------- 1re Collège : transformations de la parabole ---------- */
    transf: [
      () => {
        let a, h, s; do { a = pk([-2, -1, 2, 3]); h = R.nz(-5, 5); s = ri(1, 4); } while (h === s || h === -s);
        const k = -a * s * s, g = (x) => a * (x - h) ** 2 + k;
        return P("On obtient le graphe de " + M("g") + " à partir de celui de " + M("f(x) = x^2") + " : on le décale de " + M(Math.abs(h)) + " vers la " + (h > 0 ? "droite" : "gauche") + ", on multiplie les ordonnées par " + M(a) + ", puis on le décale de " + M(Math.abs(k)) + " vers le " + (k > 0 ? "haut" : "bas") + ".",
          [["a) Sommet de " + M("g") + " : ordonnée", k], ["b) Plus grand zéro de " + M("g"), h + s], ["c) " + M("g(0)"), g(0)]],
          ["Chaque geste se traduit dans l'expression : décalage horizontal → (x − h)², facteur a devant, décalage vertical → + k. Écris g(x) = a(x − h)² + k.",
           "b) g(x) = 0 donne (x − h)² = " + T(-k / a) + " : deux solutions h ± " + s + ". c) Remplace x par 0."],
          M("g(x) = " + a + "(" + xm(h) + ")^2" + sgD(k)) + ". a) " + M(k) + ". b) " + M("(" + xm(h) + ")^2 = " + s * s + " \\iff x = " + h + " \\pm " + s) + " : " + M(h + s) + ". c) " + M(a + " \\cdot " + pr(-h) + "^2" + sgD(k) + " = " + g(0)) + ".");
      },
    ],
    /* ---------- 1re Collège : fonction inverse et droite ---------- */
    racinv: [
      () => {
        let r1, r2; do { r1 = ri(2, 7); r2 = -ri(2, 8); } while (r1 === -r2);
        const Pq = -r1 * r2, c = -(r1 + r2), x0 = pk([2, 3, 4, 5, 6, 8, 9].filter((v) => Pq % v !== 0)), yl = [2, 3, 4, 6, 7].filter((v) => Pq % v === 0 && Pq / v !== r1 && Pq / v !== v), y0 = yl.length ? pk(yl) : 1;
        return P("On donne " + M("f(x) = \\frac{" + Pq + "}{x}") + " et " + M("g(x) = x" + sgD(c)) + ".",
          [["a) " + M("f(" + x0 + ")") + " (fraction)", Pq / x0], ["b) Préimage de " + M(y0) + " par " + M("f"), Pq / y0], ["c) Plus grande abscisse d'intersection des graphes", r1], ["d) Ordonnée de l'autre point d'intersection", r2 + c]],
          ["Préimage de " + y0 + " : résous " + Pq + "/x = " + y0 + ". Intersection : " + Pq + "/x = x" + (c < 0 ? " − " + -c : " + " + c) + ", multiplie par x (x ≠ 0).",
           "x² " + (c < 0 ? "− " + -c : "+ " + c) + "x − " + Pq + " = 0 : deux nombres de produit −" + Pq + " et de somme " + -c + ". L'ordonnée se lit sur g (ou f)."],
          "a) " + M(fx(Pq / x0)) + ". b) " + M("x = \\frac{" + Pq + "}{" + y0 + "} = " + Pq / y0) + ". c) " + M(poly([1, c, -Pq]) + " = (" + xm(r1) + ")(" + xm(r2) + ") = 0") + " : " + M("x = " + r1) + " ou " + M("x = " + r2) + ". d) " + M("g(" + r2 + ") = " + (r2 + c)) + ".");
      },
    ],
    /* ---------- MP 1re : fraction rationnelle à simplifier ---------- */
    fracrat: [
      () => {
        let a, k, x1, xs; do { a = ri(2, 9); k = R.nz(-4, 4); x1 = R.nz(-6, 6); xs = a / (1 - k); } while (k === 1 || x1 === a || x1 === -a || !Number.isInteger(xs) || xs === 0 || xs === -a || xs === a);
        const F = (x) => (x - a) / x;
        return P("On étudie " + M("F(x) = \\frac{x^2 - " + a * a + "}{x^2 + " + a + "x}") + ".",
          [["a) Somme des valeurs interdites", -a], ["b) " + M("F(" + x1 + ")") + " (fraction)", F(x1)], ["c) Solution de " + M("F(x) = " + k), xs]],
          ["Factorise le numérateur (différence de carrés) et le dénominateur (mise en évidence de x) ; les valeurs interdites annulent le dénominateur de DÉPART.",
           "Après simplification, F(x) = (x − " + a + ")/x pour x ≠ −" + a + ". c) (x − " + a + ")/x = " + k + " : multiplie par x, puis vérifie que la solution n'est pas interdite."],
          M("F(x) = \\frac{(x - " + a + ")(x + " + a + ")}{x(x + " + a + ")} = \\frac{x - " + a + "}{x}") + " (" + M("x \\neq 0") + ", " + M("x \\neq -" + a) + "). a) " + M("0 + (-" + a + ") = -" + a) + ". b) " + M("\\frac{" + x1 + " - " + a + "}{" + x1 + "} = " + fx(F(x1))) + ". c) " + M("x - " + a + " = " + cfD(k) + "x \\iff " + (1 - k) + "x = " + a + " \\iff x = " + xs) + ".");
      },
    ],
    /* ---------- MP 1re : équation du 2e degré à paramètre ---------- */
    eqparam: [
      () => {
        let s, t; do { s = R.nz(-6, 6); t = R.nz(-8, 8); } while (Math.abs(s) < 2 || t === s || 2 * s - t === 0 || t === 2 * s - t);
        const mt = t * (2 * s - t);
        return P("On étudie l'équation " + M("x^2 " + (s > 0 ? "- " + 2 * s : "+ " + -2 * s) + "x + m = 0") + ".",
          [["a) Valeur de " + M("m") + " pour une seule solution", s * s], ["b) Plus grand entier " + M("m") + " pour lequel il y a deux solutions", s * s - 1], ["c) Valeur de " + M("m") + " pour que " + M(t) + " soit solution", mt], ["d) L'autre solution quand " + M(t) + " est solution", 2 * s - t]],
          ["Δ = " + 4 * s * s + " − 4m. Une solution : Δ = 0 ; deux solutions : Δ > 0.",
           "c) Remplace x par " + t + " et résous en m. d) La somme des deux solutions vaut " + 2 * s + " (ou factorise)."],
          M("\\Delta = " + 4 * s * s + " - 4m") + ". a) " + M("\\Delta = 0 \\iff m = " + s * s) + ". b) " + M("\\Delta > 0 \\iff m < " + s * s) + " : " + M(s * s - 1) + ". c) " + M(pr(t) + "^2 " + (s > 0 ? "- " + 2 * s : "+ " + -2 * s) + " \\cdot " + pr(t) + " + m = 0 \\iff m = " + mt) + ". d) " + M(2 * s + " - " + pr(t) + " = " + (2 * s - t)) + ".");
      },
    ],
    /* ---------- MP 1re : valeurs interdites et signe ---------- */
    valint: [
      () => {
        let r1, r2, x0; do { r1 = ri(-7, 3); r2 = ri(r1 + 2, 8); x0 = R.nz(-6, 6); } while (x0 === r1 || x0 === r2 || r1 + r2 === 0 || r1 * r2 === 0);
        const s = r1 + r2, p = r1 * r2, f0 = 1 / ((x0 - r1) * (x0 - r2));
        return P("On étudie " + M("f(x) = \\frac{1}{" + poly([1, -s, p]) + "}") + ".",
          [["a) Valeurs interdites (séparées par « ; »)", SET([r1, r2])], ["b) " + M("f(" + x0 + ")") + " (fraction)", f0], ["c) Combien d'entiers " + M("x") + " vérifient " + M("f(x) < 0") + " ?", r2 - r1 - 1]],
          ["Factorise le dénominateur : deux nombres de produit " + p + " et de somme " + s + ".",
           "c) Le numérateur 1 est positif : f(x) < 0 quand le dénominateur est négatif, c'est-à-dire strictement entre les deux valeurs interdites."],
          M(poly([1, -s, p]) + " = (" + xm(r1) + ")(" + xm(r2) + ")") + ". a) " + M(r1) + " et " + M(r2) + ". b) " + M("\\frac{1}{(" + x0 + sgD(-r1) + ")(" + x0 + sgD(-r2) + ")} = " + (f0 < 0 ? "-" : "") + "\\frac{1}{" + Math.abs((x0 - r1) * (x0 - r2)) + "}") + ". c) Entre " + M(r1) + " et " + M(r2) + " (exclus) : " + M(r2 - r1 - 1) + " entiers.");
      },
    ],
    /* ---------- 1re Collège : valeur absolue (somme de distances) ---------- */
    absval: [
      () => {
        let p, q, e; do { p = ri(2, 30); q = p + ri(6, 25); e = ri(2, 9); } while (q > 60 || p - e < 1);
        const d = q - p, L = d + 2 * e;
        return P("Sur une route droite, deux bornes sont aux kilomètres " + M(p) + " et " + M(q) + ". On cherche les points (kilomètre " + M("x") + ") dont la somme des distances aux deux bornes vaut " + M(L) + " km : " + M("|x - " + p + "| + |x - " + q + "| = " + L) + ".",
          [["a) Distance entre les deux bornes (km)", d], ["b) Plus petite solution " + M("x"), p - e], ["c) Plus grande solution " + M("x"), q + e], ["d) Combien de kilomètres entiers " + M("x") + " vérifient " + M("|x - " + p + "| + |x - " + q + "| \\leq " + L) + " ?", d + 2 * e + 1]],
          ["Entre les deux bornes, la somme des distances vaut toujours " + d + " km : les solutions sont à l'extérieur.",
           "À gauche de " + p + " : (" + p + " − x) + (" + q + " − x) = " + L + ". À droite de " + q + " : (x − " + p + ") + (x − " + q + ") = " + L + ". d) Les solutions de l'inéquation vont de l'une à l'autre."],
          "a) " + M(q + " - " + p + " = " + d) + ". b) " + M(p + q + " - 2x = " + L + " \\iff x = " + (p - e)) + ". c) " + M("2x - " + (p + q) + " = " + L + " \\iff x = " + (q + e)) + ". d) De " + M(p - e) + " à " + M(q + e) + " : " + M(d + 2 * e + 1) + " valeurs.");
      },
    ],
    /* ---------- 4e Collège : transformations linéaires (matrices) ---------- */
    translin: [
      () => {
        const [nom, fm, df] = pk([["la rotation de 90° autour de O (sens trigonométrique)", (x, y) => [-y, x], 1], ["la rotation de −90° autour de O", (x, y) => [y, -x], 1], ["la symétrie d'axe Ox", (x, y) => [x, -y], -1], ["la symétrie d'axe y = x", (x, y) => [y, x], -1]]);
        const k = pk([-3, -2, 2, 3, 4]);
        let A, B, C, ar; do { A = [ri(-3, 3), ri(-3, 3)]; B = [ri(-4, 5), ri(-4, 5)]; C = [ri(-4, 5), ri(-4, 5)]; ar = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2; } while (ar < 2 || B[0] === 0 || B[1] === 0 || Math.abs(B[0]) === Math.abs(B[1]));
        const fB = fm(...B), gfB = fB.map((v) => k * v), det = k * k * df;
        return P(M("f") + " est " + nom + ", puis " + M("g") + " l'homothétie de centre O et de rapport " + M(k) + ". On considère le triangle " + M("A(" + A.join(" ; ") + ")") + ", " + M("B(" + B.join(" ; ") + ")") + ", " + M("C(" + C.join(" ; ") + ")") + ".",
          [["a) Abscisse de " + M("(g \\circ f)(B)"), gfB[0]], ["b) Déterminant de la matrice de " + M("g \\circ f"), det], ["c) Aire de l'image du triangle par " + M("g \\circ f"), Math.abs(det) * ar]],
          ["Écris la matrice de f (images de (1 ; 0) et (0 ; 1)), celle de g (" + k + " · identité), puis applique f d'abord, g ensuite.",
           "det(g ∘ f) = det g · det f. L'aire est multipliée par |det| ; aire de ABC : |det(AB→, AC→)| ÷ 2."],
          "a) " + M("f(B) = (" + fB.join(" ; ") + ")") + ", " + M("(g \\circ f)(B) = (" + gfB.join(" ; ") + ")") + ". b) " + M(k * k + " \\cdot " + pr(df) + " = " + det)  + ". c) Aire de " + M("ABC") + " : " + M(D(ar)) + " ; image : " + M(Math.abs(det) + " \\cdot " + D(ar) + " = " + D(Math.abs(det) * ar)) + ".");
      },
    ],
    /* ---------- MP 1re : rendre rationnel un dénominateur ---------- */
    ratden: [
      () => {
        const m = pk([2, 3, 5, 6, 7]), t = ri(2, 5), [p, q] = pk([[2, 3], [3, 7], [3, 8], [4, 13], [4, 15], [5, 23], [3, 5], [5, 21]]), r = p * p - q, u = ri(1, 3), c = r * u;
        return P("On donne " + M("A = \\frac{" + t * m + "}{\\sqrt{" + m + "}}") + " et " + M("B = \\frac{" + c + "}{" + p + " - \\sqrt{" + q + "}}") + ".",
          [["a) " + M("A^2"), t * t * m], ["b) Dénominateur de " + M("B") + " après multiplication par le conjugué " + M(p + " + \\sqrt{" + q + "}"), r], ["c) " + M("B - " + (u === 1 ? "" : u) + "\\sqrt{" + q + "}"), u * p]],
          ["A : multiplie le numérateur et le dénominateur par √" + m + ". B : (a − √b)(a + √b) = a² − b.",
           "Le dénominateur de B devient " + p + "² − " + q + " = " + r + " ; simplifie ensuite la fraction."],
          "a) " + M("A = \\frac{" + t * m + "\\sqrt{" + m + "}}{" + m + "} = " + t + "\\sqrt{" + m + "}") + ", " + M("A^2 = " + t * t + " \\cdot " + m + " = " + t * t * m) + ". b) " + M("(" + p + " - \\sqrt{" + q + "})(" + p + " + \\sqrt{" + q + "}) = " + p * p + " - " + q + " = " + r) + ". c) " + M("B = \\frac{" + c + "(" + p + " + \\sqrt{" + q + "})}{" + r + "} = " + (u === 1 ? "" : u) + "(" + p + " + \\sqrt{" + q + "})") + ", donc " + M(u * p) + ".");
      },
    ],
    /* ---------- 10e : ordres de grandeur (course d'école) ---------- */
    ordgr: [
      () => {
        let n, Cc, e; do { n = ri(17, 27); Cc = 10 * ri(95, 160); e = ri(12, 28); } while (n % 10 === 0 || e % 10 === 0 || Cc % 100 === 0);
        const n10 = Math.round(n / 10) * 10, e10 = Math.round(e / 10) * 10, C100 = Math.round(Cc / 100) * 100, tot = Cc + n * e, pe = Math.ceil(tot / n);
        return P("Une classe de " + M(n) + " élèves part en course d'école. Le car coûte " + M(nb(Cc)) + " CHF et l'entrée au musée " + M(e) + " CHF par élève.",
          [["a) Estimation du prix des entrées (" + n10 + " élèves à " + e10 + " CHF)", n10 * e10], ["b) Estimation du coût total (car arrondi à la centaine)", C100 + n10 * e10], ["c) Coût exact (CHF)", tot], ["d) Participation par élève, arrondie au franc supérieur (CHF)", pe]],
          ["Arrondis chaque nombre à un nombre « rond » avant de calculer de tête ; puis compare l'estimation au calcul exact.",
           "d) Coût exact ÷ " + n + ", arrondi vers le haut pour que tout soit payé."],
          "a) " + M(n10 + " \\cdot " + e10 + " = " + nb(n10 * e10)) + ". b) " + M(nb(C100) + " + " + nb(n10 * e10) + " = " + nb(C100 + n10 * e10)) + ". c) " + M(nb(Cc) + " + " + n + " \\cdot " + e + " = " + nb(tot)) + ". d) " + M(nb(tot) + " \\div " + n + " \\approx " + D(r2c(tot / n))) + " : " + M(pe) + " CHF.");
      },
    ],
  };
  /* ==== 26.11 soir (agent defisch) : défis à un seul contexte passés à trois (tools/vraisemblance_26-11.md, liste « Restent
     à 1 ou 2 contextes »). Le gabarit d'origine reçoit son ctx (CX0) ; deux gabarits ajoutés par notion, valeurs tirées,
     corrigé calculé, oracle par contexte dans tests/recalc_oracles.js (section « agent defisch »). Notions communes avec la
     France : aucun lieu suisse dans les énoncés (CHF devient € par frLocal). ==== */
  const CXP = (cx, q) => Object.assign(q, { ctx: cx });
  const ADD = (id, cx0, ...fns) => { const c = [].concat(cx0); OUT[id] = [...OUT[id].map((f, i) => (c[i] ? () => CXP(c[i], f()) : f)), ...fns]; };
  const prn = (v) => (v < 0 ? "(" + v + ")" : String(v));
  ADD("rel", "temperatures",
    () => { /* golf : scores par rapport au par */
      let a, b, c, s; do { a = -ri(2, 6); b = ri(1, 5); c = -ri(1, 7); s = a + b + c; } while (a === c || s % 3 === 0 || s >= 0);
      const tg = s - ri(2, 5), nm = pk(["Mia", "Lina", "Zoé", "Nora"]);
      return CXP("golf", P("Au golf, on compte les coups par rapport au « par » : −2 veut dire deux coups de moins que prévu. Lors d'un tournoi, " + nm + " termine ses trois premiers tours à " + M(a) + ", " + M("+" + b) + " et " + M(c) + ".",
        [["a) Score total des trois tours", s], ["b) Écart entre son moins bon tour et son meilleur tour", b - Math.min(a, c)], ["c) Score moyen par tour (fraction)", s / 3], ["d) Quel score doit-elle faire au 4e tour pour terminer à " + T(tg) + " au total ?", tg - s]],
        ["Additionne des relatifs : regroupe les négatifs, puis ajoute le positif.", "d) Score du 4e tour = total visé − total des trois tours."],
        "a) " + M(a + " + " + b + " + " + prn(c) + " = " + s) + ". b) " + M(b + " - " + prn(Math.min(a, c)) + " = " + (b - Math.min(a, c))) + ". c) " + M("\\frac{" + s + "}{3}") + ". d) " + M(tg + " - " + prn(s) + " = " + (tg - s)) + "."));
    },
    () => { /* compte d'un club : solde négatif (découvert) */
      let a, b, c; do { a = 10 * ri(12, 48); b = 10 * ri(20, 90); c = 10 * ri(15, 80); } while (b - a === 0 || b - a - c === 0 || Math.abs(b - a - c) < 30 || b <= a || b - a - c > 400);
      const s1 = b - a, s2 = s1 - c;
      return CXP("compte", P("Le compte du club de basket est à découvert : son solde vaut " + M("-" + a) + " CHF le 1er avril. Le club encaisse " + M(nb(b)) + " CHF de cotisations, puis paie une facture de " + M(c) + " CHF pour des ballons.",
        [["a) Solde après les cotisations (CHF)", s1], ["b) Solde final (CHF, négatif si découvert)", s2], ["c) Variation du solde entre le 1er avril et la fin (CHF)", s2 + a], ["d) Combien le club doit-il encore encaisser pour avoir un solde de 500 CHF ?", 500 - s2]],
        ["Solde = ancien solde + recettes − dépenses : attention au signe du départ.", "c) Variation = solde final − solde de départ."],
        "a) " + M("-" + a + " + " + nb(b) + " = " + nb(s1)) + " CHF. b) " + M(nb(s1) + " - " + c + " = " + nb(s2)) + " CHF. c) " + M(nb(s2) + " - (-" + a + ") = " + nb(s2 + a)) + " CHF. d) " + M("500 - " + prn(s2) + " = " + nb(500 - s2)) + " CHF."));
    });
  ADD("reladd", "randonnee",
    () => { /* plongée : profondeurs (altitudes négatives) */
      let a, b, c, d; do { a = ri(12, 30); b = ri(4, 10); c = ri(5, 15); d = ri(3, 9); } while (a - b + c <= a || -a + b - c + d >= -2);
      const z = [0, -a, -a + b, -a + b - c, -a + b - c + d];
      return CXP("plongee", P("Une plongeuse part de la surface du lac (altitude 0 m). Elle descend de " + M(a + " \\text{ m}") + ", remonte de " + M(b + " \\text{ m}") + ", redescend de " + M(c + " \\text{ m}") + " puis remonte de " + M(d + " \\text{ m}") + ".",
        [["a) Altitude la plus basse atteinte (m)", Math.min(...z)], ["b) Altitude finale (m)", z[4]], ["c) Total des descentes (m)", a + c], ["d) De combien de mètres doit-elle encore remonter pour revenir à la surface ?", -z[4]]],
        ["Écris la suite des altitudes : chaque descente se soustrait, chaque remontée s'ajoute.", "d) Distance entre son altitude finale et 0."],
        "Altitudes : " + z.join(" ; ") + " m. a) " + M(Math.min(...z)) + " m. b) " + M(z[4]) + " m. c) " + M(a + " + " + c + " = " + (a + c)) + " m. d) " + M("0 - " + prn(z[4]) + " = " + -z[4]) + " m."));
    },
    () => { /* températures d'une journée d'hiver */
      let t0, u1, d1, u2, d2; do { t0 = -ri(3, 12); u1 = ri(5, 14); d1 = ri(2, 6); u2 = ri(1, 4); d2 = ri(6, 15); } while (t0 + u1 - d1 + u2 - d2 === t0 || t0 + u1 <= 0);
      const z = [t0, t0 + u1, t0 + u1 - d1, t0 + u1 - d1 + u2, t0 + u1 - d1 + u2 - d2];
      return CXP("temperatures", P("Un matin d'hiver en montagne, il fait " + M(t0 + " \\text{ °C}") + " à 7 h. La température monte de " + M(u1 + " \\text{ °C}") + " jusqu'à midi, baisse de " + M(d1 + " \\text{ °C}") + " avec un nuage, remonte de " + M(u2 + " \\text{ °C}") + ", puis baisse de " + M(d2 + " \\text{ °C}") + " jusqu'à la nuit.",
        [["a) Température la plus haute de la journée (°C)", Math.max(...z)], ["b) Température à la nuit (°C)", z[4]], ["c) Total des hausses (°C)", u1 + u2], ["d) Variation entre 7 h et la nuit (°C, négative si plus froid)", z[4] - t0]],
        ["Écris la suite des températures : chaque hausse s'ajoute, chaque baisse se soustrait.", "d) Variation = température finale − température de départ."],
        "Températures : " + z.join(" ; ") + " °C. a) " + M(Math.max(...z)) + " °C. b) " + M(z[4]) + " °C. c) " + M(u1 + " + " + u2 + " = " + (u1 + u2)) + " °C. d) " + M(prn(z[4]) + " - " + prn(t0) + " = " + (z[4] - t0)) + " °C."));
    });
  ADD("decadd", "achats",
    () => { /* relais 4 × 100 m : temps au centième */
      let t; do { t = [0, 0, 0, 0].map(() => ri(1180, 1450) / 100); } while (new Set(t).size < 4 || t.some((x) => Math.round(x * 100) % 10 === 0) === false);
      const S = r2c(t[0] + t[1] + t[2] + t[3]), rec = r2c(S - ri(80, 300) / 100), mx = Math.max(...t), mn = Math.min(...t);
      return CXP("relais", P("Au relais 4 × 100 m, les quatre coureurs de la classe réalisent " + t.map((x) => M(D(x) + " \\text{ s}")).join(", ") + ". Le record de l'école est de " + M(D(rec) + " \\text{ s}") + ".",
        [["a) Temps total de l'équipe (s)", S], ["b) Écart avec le record de l'école (s)", r2c(S - rec)], ["c) Avance du coureur le plus rapide sur le plus lent (s)", r2c(mx - mn)]],
        ["Aligne les virgules ; complète par des 0 si besoin.", "b) et c) Une soustraction : le plus grand temps moins le plus petit."],
        "a) " + M(t.map(D).join(" + ") + " = " + D(S)) + " s. b) " + M(D(S) + " - " + D(rec) + " = " + D(r2c(S - rec))) + " s. c) " + M(D(mx) + " - " + D(mn) + " = " + D(r2c(mx - mn))) + " s."));
    },
    () => { /* randonnée en étapes */
      let L, e1, e2, e3; do { L = ri(25, 48) / 2; e1 = ri(300, 650) / 100; e2 = ri(30, 75) / 10; e3 = ri(20, 60) / 10; } while (e1 + e2 + e3 >= L - 0.5 || Math.round(e1 * 100) % 10 === 0);
      const f = r2c(e1 + e2), r = r2c(L - f), r3 = r2c(r - e3);
      return CXP("randonnee", P("Un sentier de randonnée mesure " + M(D(L) + " \\text{ km}") + ". Le matin, un groupe parcourt deux étapes de " + M(D(e1) + " \\text{ km}") + " et " + M(D(e2) + " \\text{ km}") + ".",
        [["a) Distance parcourue le matin (km)", f], ["b) Distance qu'il reste à parcourir (km)", r], ["c) L'après-midi, le groupe fait encore " + T(e3) + " km. Distance restante pour finir le sentier (km)", r3]],
        ["Aligne les virgules (" + T(e2) + " = " + T(e2) + "0).", "b) Longueur du sentier − distance parcourue."],
        "a) " + M(D(e1) + " + " + D(e2) + " = " + D(f)) + " km. b) " + M(D(L) + " - " + D(f) + " = " + D(r)) + " km. c) " + M(D(r) + " - " + D(e3) + " = " + D(r3)) + " km."));
    });
  ADD("decdiv", "restaurant",
    () => { /* marché : prix au kilo, puis masse pour un budget */
      let m, u, B, kg; do { m = pk([1.5, 2.5, 3.5, 0.75]); u = pk([6.4, 7.2, 8.6, 9.8, 12.4]); B = pk([20, 25, 30, 40]); kg = B / u; } while (Math.abs(kg * 10 - Math.round(kg * 10) - 0.5) < 0.02 || Math.abs(r2c(m * u) * 20 - Math.round(r2c(m * u) * 20)) > 1e-6);
      const P0 = r2c(m * u), fr = pk(["fraises", "abricots", "cerises", "framboises"]);
      return CXP("marche", P("Au marché, " + M(D(m) + " \\text{ kg}") + " de " + fr + " coûtent " + M(CHF(P0)) + " CHF.",
        [["a) Prix d'un kilo (CHF)", u], ["b) Combien de kilos peut-on acheter avec " + B + " CHF ? (au dixième de kg)", r1(kg), 0.1], ["c) Combien de barquettes de 0,25 kg remplit-on avec " + T(m) + " kg ?", m / 0.25]],
        ["Prix d'un kilo = prix ÷ masse : multiplie les deux par 10 (ou 100) pour diviser par un entier.", "b) Budget ÷ prix d'un kilo, puis arrondis au dixième."],
        "a) " + M(CHF(P0) + " \\div " + D(m) + " = " + CHF(u)) + " CHF. b) " + M(B + " \\div " + CHF(u) + " \\approx " + D(r2c(kg))) + ", soit environ " + M(D(r1(kg))) + " kg. c) " + M(D(m) + " \\div 0{,}25 = " + D(m / 0.25)) + " barquettes."));
    },
    () => { /* vélo : vitesse moyenne, puis durée */
      let v, t, d2, tt; do { v = pk([14.4, 16.8, 18.6, 20.4, 22.8]); t = pk([1.5, 2.5, 0.75, 1.25]); d2 = pk([27, 33, 45, 51]); tt = d2 / v; } while (Math.abs(tt * 100 - Math.round(tt * 100) - 0.5) < 0.02);
      const d = r2c(v * t), Lp = pk([1.2, 2.4, 3.6]), tours = Math.floor(d / Lp + 1e-9);
      return CXP("velo", P("Une cycliste parcourt " + M(D(d) + " \\text{ km}") + " en " + M(D(t) + " \\text{ h}") + ", à vitesse constante.",
        [["a) Sa vitesse moyenne (km/h)", v], ["b) Combien d'heures lui faut-il pour " + d2 + " km à cette vitesse ? (au centième)", r2c(tt), 0.01], ["c) Combien de tours complets d'une boucle de " + T(Lp) + " km fait-elle avec ses " + T(d) + " km ?", tours]],
        ["Vitesse = distance ÷ durée : multiplie les deux par 10 ou 100 pour diviser par un entier.", "c) Distance ÷ longueur d'un tour, puis garde la partie entière."],
        "a) " + M(D(d) + " \\div " + D(t) + " = " + D(v)) + " km/h. b) " + M(d2 + " \\div " + D(v) + " \\approx " + D(r2c(tt))) + " h. c) " + M(D(d) + " \\div " + D(Lp) + " \\approx " + D(r2c(d / Lp))) + " : " + tours + " tours."));
    });
  ADD("carres", "carrelage",
    () => { /* chorale disposée en carré */
      const n = ri(5, 14), k = ri(1, 3);
      return CXP("chorale", P("Pour la photo de fin d'année, " + M(nb(n * n)) + " élèves se placent en carré plein : autant de rangées que d'élèves par rangée.",
        [["a) Nombre d'élèves par rangée", n], ["b) Nombre d'élèves sur le bord du carré (pourtour)", 4 * n - 4], ["c) Pour former un carré avec " + k + " élève" + (k > 1 ? "s" : "") + " de plus par rangée, combien d'élèves faudrait-il en plus ?", (n + k) ** 2 - n * n]],
        ["Le nombre d'élèves est un carré : n · n = " + nbT(n * n) + ".", "b) Quatre côtés de " + n + " élèves, mais les coins sont comptés deux fois."],
        "a) " + M("\\sqrt{" + nb(n * n) + "} = " + n) + ". b) " + M("4 \\cdot " + n + " - 4 = " + (4 * n - 4)) + ". c) " + M((n + k) + "^2 - " + n + "^2 = " + (n + k) ** 2 + " - " + n * n + " = " + ((n + k) ** 2 - n * n)) + " élèves."));
    },
    () => { /* verger : arbres en carré */
      const n = ri(8, 25), s = pk([4, 5, 6, 8]), k = ri(2, 4);
      return CXP("verger", P("Un verger compte " + M(nb(n * n)) + " pommiers plantés en carré : autant de rangées que d'arbres par rangée, " + M(s + " \\text{ m}") + " entre deux arbres voisins.",
        [["a) Nombre d'arbres par rangée", n], ["b) Distance entre le premier et le dernier arbre d'une rangée (m)", (n - 1) * s], ["c) On ajoute " + k + " arbres à chaque rangée et " + k + " rangées. Combien d'arbres plante-t-on en plus ?", (n + k) ** 2 - n * n]],
        ["Le nombre d'arbres est un carré : n · n = " + nbT(n * n) + ".", "b) Entre " + n + " arbres alignés, il y a " + (n - 1) + " intervalles."],
        "a) " + M("\\sqrt{" + nb(n * n) + "} = " + n) + ". b) " + M((n - 1) + " \\cdot " + s + " = " + (n - 1) * s) + " m. c) " + M((n + k) + "^2 - " + n + "^2 = " + nb((n + k) ** 2) + " - " + nb(n * n) + " = " + nb((n + k) ** 2 - n * n)) + " arbres."));
    });
  ADD("ordgr", "course",
    () => { /* camp de ski */
      let n, Cc, e; do { n = ri(17, 27); Cc = 10 * ri(180, 360); e = ri(42, 78); } while (n % 10 === 0 || e % 10 === 0 || Cc % 100 === 0 || (e % 10) === 5);
      const n10 = Math.round(n / 10) * 10, e10 = Math.round(e / 10) * 10, C100 = Math.round(Cc / 100) * 100, tot = Cc + n * e, pe = Math.ceil(tot / n);
      return CXP("camp", P("Une classe de " + M(n) + " élèves part en camp de ski. Le chalet coûte " + M(nb(Cc)) + " CHF pour la semaine et le forfait de ski " + M(e) + " CHF par élève.",
        [["a) Estimation du prix des forfaits (" + n10 + " élèves à " + e10 + " CHF)", n10 * e10], ["b) Estimation du coût total (chalet arrondi à la centaine)", C100 + n10 * e10], ["c) Coût exact (CHF)", tot], ["d) Participation par élève, arrondie au franc supérieur (CHF)", pe]],
        ["Arrondis chaque nombre à un nombre « rond » avant de calculer de tête ; puis compare l'estimation au calcul exact.", "d) Coût exact ÷ " + n + ", arrondi vers le haut pour que tout soit payé."],
        "a) " + M(n10 + " \\cdot " + e10 + " = " + nb(n10 * e10)) + ". b) " + M(nb(C100) + " + " + nb(n10 * e10) + " = " + nb(C100 + n10 * e10)) + ". c) " + M(nb(Cc) + " + " + n + " \\cdot " + e + " = " + nb(tot)) + ". d) " + M(nb(tot) + " \\div " + n + " \\approx " + D(r2c(tot / n))) + " : " + M(pe) + " CHF."));
    },
    () => { /* tournoi de foot : location du terrain et maillots */
      let n, Cc, e; do { n = ri(31, 69); Cc = 10 * ri(25, 75); e = ri(12, 38); } while (n % 10 === 0 || e % 10 === 0 || Cc % 100 === 0 || (e % 10) === 5 || (n % 10) === 5);
      const n10 = Math.round(n / 10) * 10, e10 = Math.round(e / 10) * 10, C100 = Math.round(Cc / 100) * 100, tot = Cc + n * e, pe = Math.ceil(tot / n);
      return CXP("tournoi", P("Pour un tournoi de football, " + M(n) + " joueurs s'inscrivent. La location du terrain coûte " + M(nb(Cc)) + " CHF et chaque joueur reçoit un maillot à " + M(e) + " CHF.",
        [["a) Estimation du prix des maillots (" + n10 + " maillots à " + e10 + " CHF)", n10 * e10], ["b) Estimation du coût total (terrain arrondi à la centaine)", C100 + n10 * e10], ["c) Coût exact (CHF)", tot], ["d) Inscription par joueur, arrondie au franc supérieur (CHF)", pe]],
        ["Arrondis chaque nombre à un nombre « rond » avant de calculer de tête ; puis compare l'estimation au calcul exact.", "d) Coût exact ÷ " + n + ", arrondi vers le haut pour que tout soit payé."],
        "a) " + M(n10 + " \\cdot " + e10 + " = " + nb(n10 * e10)) + ". b) " + M(nb(C100) + " + " + nb(n10 * e10) + " = " + nb(C100 + n10 * e10)) + ". c) " + M(nb(Cc) + " + " + n + " \\cdot " + e + " = " + nb(tot)) + ". d) " + M(nb(tot) + " \\div " + n + " \\approx " + D(r2c(tot / n))) + " : " + M(pe) + " CHF."));
    });
  ADD("fracops", "priorites",
    () => { /* division prioritaire */
      const fxOk = (v) => { for (let q = 1; q <= 12; q++) if (Math.abs(v * q - Math.round(v * q)) < 1e-9) return true; return false; };
      let a, b, c, d, e, f, A, B;
      do { b = pk([2, 3, 4, 5, 6]); a = ri(1, b - 1); d = pk([2, 3, 4, 5, 6]); c = ri(1, d + 2); f = pk([2, 3, 4, 5]); e = ri(1, f + 2); A = a / b + (c / d) / (e / f); B = (a / b + c / d) / (e / f); }
      while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || gcd(e, f) !== 1 || e === f || c === d || b === d || Math.abs(A - B) < 1e-9 || !fxOk(A) || !fxOk(B) || !fxOk(A - B) || !fxOk((c * f) / (d * e)) || !fxOk(a / b + c / d));
      const F = (n, m) => "\\frac{" + n + "}{" + m + "}";
      return CXP("division", P("On pose " + M("A = " + F(a, b) + " + " + F(c, d) + " \\div " + F(e, f)) + " et " + M("B = \\left(" + F(a, b) + " + " + F(c, d) + "\\right) \\div " + F(e, f)) + " (fractions acceptées).",
        [["a) " + M("A"), A], ["b) " + M("B"), B], ["c) " + M("B - A"), B - A]],
        ["A : la division passe avant l'addition. Diviser par une fraction, c'est multiplier par son inverse.", "B : la parenthèse d'abord (dénominateur commun), puis la division."],
        "a) " + M(F(c, d) + " \\div " + F(e, f) + " = " + F(c, d) + " \\cdot " + F(f, e) + " = " + fx((c * f) / (d * e))) + ", donc " + M("A = " + fx(A)) + ". b) " + M(F(a, b) + " + " + F(c, d) + " = " + fx(a / b + c / d)) + ", donc " + M("B = " + fx(B)) + ". c) " + M(fx(B) + " - " + (A < 0 ? "\\left(" + fx(A) + "\\right)" : fx(A)) + " = " + fx(B - A)) + "."));
    },
    () => { /* emploi du temps : fractions d'heure */
      let a, b, c, d, e, f, p, T;
      do { b = pk([2, 3, 4, 5, 6]); a = ri(1, b - 1); d = pk([2, 3, 4]); c = ri(1, d - 1); f = pk([3, 4, 6]); e = ri(1, f - 1); p = (a / b) * (c / d); T = a / b + p + e / f; }
      while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || gcd(e, f) !== 1 || !Number.isInteger(+(p * 60).toFixed(9)) || !Number.isInteger(+(T * 60).toFixed(9)) || T >= 3);
      const F = (n, m) => "\\frac{" + n + "}{" + m + "}", nm = pk(["Lina", "Noé", "Mia", "Tom", "Zoé", "Sam"]);
      return CXP("temps", P("Mercredi, " + nm + " fait ses devoirs pendant " + M(F(a, b)) + " h, puis joue du piano pendant les " + M(F(c, d)) + " de ce temps, et enfin s'entraîne au basket pendant " + M(F(e, f)) + " h.",
        [["a) Durée du piano (h, fraction)", p], ["b) Durée totale des trois activités (h, fraction)", T], ["c) Durée totale en minutes", Math.round(T * 60)]],
        ["« Les " + c + "/" + d + " de ce temps » : une multiplication de fractions.", "b) Dénominateur commun pour additionner. c) 1 h = 60 min."],
        "a) " + M(F(c, d) + " \\cdot " + F(a, b) + " = " + fx(p)) + " h. b) " + M(F(a, b) + " + " + fx(p) + " + " + F(e, f) + " = " + fx(T)) + " h. c) " + M(fx(T) + " \\cdot 60 = " + Math.round(T * 60)) + " min."));
    });
  ADD("divcrit", "45-36",
    () => { /* casiers à trois chiffres */
      let a, b; do { a = ri(1, 9); b = ri(0, 9); } while ((a + b) % 3 === 0);
      const L = Array.from({ length: 10 }, (_, y) => 100 * a + 10 * b + y), d3 = L.filter((N) => N % 3 === 0), d9 = L.filter((N) => N % 9 === 0), d6 = L.filter((N) => N % 6 === 0);
      if (!d9.length) return OUT.divcrit[1]();
      return CXP("casiers", P("Dans un vestiaire, les casiers portent des numéros de trois chiffres. Ceux d'une rangée commencent tous par " + M(a + "\\," + b + "\\,■") + " (le chiffre des unités varie de 0 à 9).",
        [["a) Combien de numéros de cette rangée sont divisibles par 3 ?", d3.length], ["b) Le plus grand numéro de la rangée divisible par 9", Math.max(...d9)], ["c) Combien de numéros de la rangée sont divisibles par 6 ?", d6.length]],
        ["Divisible par 3 : la somme des chiffres est un multiple de 3 ; par 9 : un multiple de 9.", "6 = 2 · 3 : le numéro doit être pair ET divisible par 3."],
        "a) Somme " + (a + b) + " + unités multiple de 3 : " + d3.join(" ; ") + ", soit " + M(d3.length) + ". b) " + M(Math.max(...d9)) + ". c) Les pairs parmi eux : " + (d6.join(" ; ") || "aucun") + ", soit " + M(d6.length) + "."));
    },
    () => { /* quatre chiffres a ■ b ■ : par 15 et par 18 */
      let a, b; do { a = ri(1, 9); b = ri(0, 9); } while ((a + b) % 3 === 0);
      const ok15 = [], ok18 = [];
      for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) { const N = 1000 * a + 100 * x + 10 * b + y; if (N % 15 === 0) ok15.push(N); if (N % 18 === 0) ok18.push(N); }
      return CXP("15-18", P("On cherche les nombres de quatre chiffres " + M(a + "\\,■\\," + b + "\\,■") + " (le chiffre des centaines et celui des unités sont à trouver).",
        [["a) Combien de ces nombres sont divisibles par 15 ?", ok15.length], ["b) Le plus petit d'entre eux", Math.min(...ok15)], ["c) Combien sont divisibles par 18 ?", ok18.length]],
        ["15 = 3 · 5 : le nombre finit par 0 ou 5 ET la somme de ses chiffres est un multiple de 3.", "18 = 2 · 9 : le nombre est pair ET la somme de ses chiffres est un multiple de 9."],
        "a) " + ok15.map(nb).join(" ; ") + " : " + M(ok15.length) + " nombres. b) " + M(nb(Math.min(...ok15))) + ". c) " + ok18.map(nb).join(" ; ") + " : " + M(ok18.length) + " nombres."));
    });
  ADD("racenc", "racine",
    () => { /* terrain carré : côté au dixième, clôture au mètre supérieur */
      let A; do { A = ri(30, 400); } while (Number.isInteger(Math.sqrt(A)) || Math.abs(Math.sqrt(A) * 10 - Math.round(Math.sqrt(A) * 10) - 0.5) < 0.05 || Number.isInteger(4 * Math.sqrt(A)));
      const k = Math.floor(Math.sqrt(A)), cl = Math.ceil(4 * Math.sqrt(A));
      return CXP("terrain", P("Un jardin carré a une aire de " + M(A) + " m².",
        [["a) Entier juste en dessous de la longueur du côté (m)", k], ["b) Longueur du côté au dixième de mètre", Math.sqrt(A), 0.1], ["c) Longueur de grillage pour en faire le tour, arrondie au mètre supérieur", cl]],
        ["Côté = racine carrée de l'aire. " + k + "² = " + k * k + " et " + (k + 1) + "² = " + (k + 1) ** 2 + ".", "c) Quatre côtés ; on achète un nombre entier de mètres, sans en manquer."],
        "a) " + M(k * k + " < " + A + " < " + (k + 1) ** 2) + " : " + M(k) + " m. b) " + M("\\sqrt{" + A + "} \\approx " + D(r1(Math.sqrt(A)))) + " m. c) " + M("4 \\cdot \\sqrt{" + A + "} \\approx " + D(r2c(4 * Math.sqrt(A)))) + " : " + M(cl) + " m."));
    },
    () => { /* chute libre : t = √(h/5) */
      let h; do { h = ri(25, 300); } while (Number.isInteger(Math.sqrt(h / 5)) || Math.abs(Math.sqrt(h / 5) * 10 - Math.round(Math.sqrt(h / 5) * 10) - 0.5) < 0.05);
      const t = Math.sqrt(h / 5), k = Math.floor(t), s = ri(3, 8);
      return CXP("chute", P("Sans frottement de l'air, un caillou lâché d'une hauteur de " + M("h") + " mètres met environ " + M("t = \\sqrt{\\frac{h}{5}}") + " secondes pour tomber. On le lâche du haut d'une falaise de " + M(h + " \\text{ m}") + ".",
        [["a) Entier juste en dessous de la durée de chute (s)", k], ["b) Durée de chute au dixième de seconde", t, 0.1], ["c) Hauteur d'une falaise (m) d'où la chute dure exactement " + s + " s", 5 * s * s]],
        ["Calcule h ÷ 5, puis encadre sa racine entre deux entiers consécutifs.", "c) t = " + s + " : élève au carré, " + s + "² = h ÷ 5."],
        "a) " + M("\\frac{" + h + "}{5} = " + D(h / 5)) + " et " + M(k + "^2 < " + D(h / 5) + " < " + (k + 1) + "^2") + " : " + M(k) + " s. b) " + M("t \\approx " + D(r1(t))) + " s. c) " + M("h = 5 \\cdot " + s + "^2 = " + 5 * s * s) + " m."));
    });
  ADD("tradexpr", "phrases",
    () => { /* programme de calcul */
      let x1, x2, a, b, V; do { x1 = ri(2, 9); x2 = -ri(2, 7); a = ri(2, 8); b = ri(2, 5); V = b * ri(a + 2, a + 12); } while (x1 === a || V / b - a === x1 || b * (x1 + a) - x1 * x1 === b * (x2 + a) - x2 * x2);
      const f = (x) => b * (x + a) - x * x;
      return CXP("programme", P("Programme de calcul : choisis un nombre, ajoute-lui " + a + ", multiplie le résultat par " + b + ", puis soustrais le carré du nombre choisi.",
        [["a) Résultat avec le nombre " + x1, f(x1)], ["b) Résultat avec le nombre " + T(x2), f(x2)], ["c) Avant la soustraction (après « multiplie par " + b + " »), on lit " + V + ". Quel nombre avait-on choisi ?", V / b - a]],
        ["Écris l'expression : " + b + " · (x + " + a + ") − x². Attention aux parenthèses avec un nombre négatif.", "c) Remonte le programme : divise par " + b + ", puis enlève " + a + "."],
        "a) " + M(b + " \\cdot (" + x1 + " + " + a + ") - " + x1 + "^2 = " + b * (x1 + a) + " - " + x1 * x1 + " = " + f(x1)) + ". b) " + M(b + " \\cdot (" + x2 + " + " + a + ") - (" + x2 + ")^2 = " + b * (x2 + a) + " - " + x2 * x2 + " = " + f(x2)) + ". c) " + M(V + " \\div " + b + " - " + a + " = " + (V / b - a)) + "."));
    },
    () => { /* rectangle décrit par des phrases */
      let x, a; do { x = ri(3, 12); a = ri(2, 9); } while (x === a);
      return CXP("rectangle", P("Un rectangle a une largeur de " + M("x") + " cm. Sa longueur dépasse le double de sa largeur de " + M(a) + " cm. On prend " + M("x = " + x) + ".",
        [["a) Longueur (cm)", 2 * x + a], ["b) Périmètre (cm)", 2 * (3 * x + a)], ["c) Aire (cm²)", x * (2 * x + a)]],
        ["« Dépasse le double de la largeur de " + a + " » : longueur = 2x + " + a + ".", "Périmètre = 2 · (longueur + largeur) ; aire = longueur · largeur."],
        "a) " + M("2 \\cdot " + x + " + " + a + " = " + (2 * x + a)) + " cm. b) " + M("2 \\cdot (" + (2 * x + a) + " + " + x + ") = " + 2 * (3 * x + a)) + " cm. c) " + M((2 * x + a) + " \\cdot " + x + " = " + x * (2 * x + a)) + " cm²."));
    });
  ADD("valnum", "freinage",
    () => { /* chute libre : d = 5t² */
      const t1 = pk([1.5, 2.5, 3.5, 1.2, 2.4]), m = pk([2, 3]), t3 = pk([2, 3, 4, 5, 6].filter((v) => Math.abs(v - t1 * m) > 1e-9)), d = (t) => 5 * t * t;
      return CXP("chute", P("Un objet lâché sans vitesse tombe d'environ " + M("d = 5t^2") + " mètres en " + M("t") + " secondes (sans frottement de l'air).",
        [["a) " + M("d") + " pour " + M("t = " + D(t1)) + " s (m)", +d(t1).toFixed(6)], ["b) Si la durée de chute est multipliée par " + m + ", la distance est multipliée par…", m * m], ["c) Durée (s) pour une chute de " + M(d(t3)) + " m", t3]],
        ["Calcule d'abord le carré, puis multiplie par 5.", "b) (" + m + "t)² = " + m * m + "t². c) t² = " + d(t3) + " ÷ 5 : cherche le nombre dont le carré vaut ce résultat."],
        "a) " + M("5 \\cdot " + D(t1) + "^2 = 5 \\cdot " + D(+(t1 * t1).toFixed(6)) + " = " + D(+d(t1).toFixed(6))) + " m. b) " + M("5(" + m + "t)^2 = " + m * m + " \\cdot 5t^2") + " : multipliée par " + M(m * m) + ". c) " + M("t^2 = " + d(t3) + " \\div 5 = " + t3 * t3) + ", " + M("t = " + t3) + " s."));
    },
    () => { /* degrés Fahrenheit : F = 1,8C + 32 */
      const c1 = -ri(4, 25), c2 = 5 * ri(3, 8), k = pk([5, 15, 25, 35]), F = (c) => +(1.8 * c + 32).toFixed(6);
      return CXP("fahrenheit", P("Aux États-Unis, on mesure la température en degrés Fahrenheit : " + M("F = 1{,}8 \\cdot C + 32") + ", où " + M("C") + " est la température en degrés Celsius.",
        [["a) " + M("F") + " pour " + M("C = " + c1), F(c1)], ["b) Température en °C quand le thermomètre américain indique " + M(D(F(c2))) + " °F", c2], ["c) Une hausse de " + k + " °C correspond à une hausse de combien de °F ?", +(1.8 * k).toFixed(6)]],
        ["Remplace C par sa valeur ; attention au signe.", "b) Résous " + T(F(c2)) + " = 1,8 · C + 32. c) Le 32 ne joue pas pour un écart."],
        "a) " + M("1{,}8 \\cdot (" + c1 + ") + 32 = " + D(+(1.8 * c1).toFixed(6)) + " + 32 = " + D(F(c1))) + ". b) " + M("C = (" + D(F(c2)) + " - 32) \\div 1{,}8 = " + c2) + " °C. c) " + M("1{,}8 \\cdot " + k + " = " + D(+(1.8 * k).toFixed(6))) + " °F."));
    });
  ADD("pctvar", "velo",
    () => { /* abonnés d'une chaîne */
      let P0, h, b; do { P0 = 400 * ri(5, 40); h = pk([10, 15, 20, 25, 30]); b = pk([10, 20, 25, 30, 40]); } while (b <= h || (1 + h / 100) * (1 - b / 100) >= 1);
      const P1 = Math.round(P0 * (1 + h / 100)), P2 = Math.round((P1 * (100 - b)) / 100), g = r2c((P2 / P0 - 1) * 100), back = (P0 / P2 - 1) * 100;
      return CXP("abonnes", P("Une chaîne de vidéos compte " + M(nb(P0)) + " abonnés au 1er janvier. Leur nombre augmente de " + M(h + "\\,\\%") + " en janvier, puis baisse de " + M(b + "\\,\\%") + " en février.",
        [["a) Nombre d'abonnés fin février", P2], ["b) Variation globale (%, négatif pour une baisse)", g, 0.01], ["c) De quel pourcentage doit-il augmenter en mars pour revenir à " + nbT(P0) + " abonnés ? (%, au dixième)", r1(back), 0.1]],
        ["Hausse de " + h + " % : multiplier par " + T(1 + h / 100) + ". Baisse de " + b + " % : multiplier par " + T(1 - b / 100) + ".", "c) Le pourcentage se calcule sur le nombre de fin février."],
        "a) " + M(nb(P0) + " \\cdot " + D(1 + h / 100) + " \\cdot " + D(1 - b / 100) + " = " + nb(P2)) + ". b) " + M(D(1 + h / 100) + " \\cdot " + D(1 - b / 100) + " = " + D(r2c((1 + h / 100) * (1 - b / 100) * 100) / 100)) + ", soit " + M(D(g) + "\\,\\%") + " (et non " + M((h - b) + "\\,\\%") + "). c) " + M("\\frac{" + nb(P0) + "}{" + nb(P2) + "} \\approx " + D(+(P0 / P2).toFixed(4))) + " : " + M("+" + D(r1(back)) + "\\,\\%") + "."));
    },
    () => { /* récolte d'un verger */
      let P0, h, b; do { P0 = 400 * ri(4, 30); h = pk([10, 15, 20, 25, 30]); b = pk([20, 25, 30, 40]); } while (b <= h || (1 + h / 100) * (1 - b / 100) >= 1);
      const P1 = Math.round(P0 * (1 + h / 100)), P2 = Math.round((P1 * (100 - b)) / 100), g = r2c((P2 / P0 - 1) * 100), back = (P0 / P2 - 1) * 100;
      return CXP("recolte", P("Un verger a produit " + M(nb(P0) + " \\text{ kg}") + " de pommes. L'année suivante, la récolte augmente de " + M(h + "\\,\\%") + " ; l'année d'après, la grêle la fait baisser de " + M(b + "\\,\\%") + ".",
        [["a) Récolte de la troisième année (kg)", P2], ["b) Variation globale sur les deux années (%, négatif pour une baisse)", g, 0.01], ["c) De quel pourcentage la récolte doit-elle augmenter ensuite pour revenir à " + nbT(P0) + " kg ? (%, au dixième)", r1(back), 0.1]],
        ["Les pourcentages successifs se multiplient : on ne les additionne pas.", "c) Le pourcentage se calcule sur la dernière récolte."],
        "a) " + M(nb(P0) + " \\cdot " + D(1 + h / 100) + " = " + nb(P1)) + " kg, puis " + M(nb(P1) + " \\cdot " + D(1 - b / 100) + " = " + nb(P2)) + " kg. b) " + M("\\frac{" + nb(P2) + "}{" + nb(P0) + "} = " + D(+(P2 / P0).toFixed(4))) + ", soit " + M(D(g) + "\\,\\%") + ". c) " + M("\\frac{" + nb(P0) + "}{" + nb(P2) + "} \\approx " + D(+(P0 / P2).toFixed(4))) + " : " + M("+" + D(r1(back)) + "\\,\\%") + "."));
    });
  ADD("affine", "taxi",
    () => { /* location de vélo électrique */
      let p, f, d1, d2, B, hmax; do { p = pk([4.5, 5.5, 6, 7.5, 8]); f = pk([10, 12, 15, 18]); d1 = ri(1, 3); d2 = d1 + ri(2, 5); B = 10 * ri(6, 12); hmax = (B - f) / p; } while (Number.isInteger(+hmax.toFixed(9)) || hmax < d2);
      const c1 = r2c(f + p * d1), c2 = r2c(f + p * d2);
      return CXP("velo", P("Une location de vélos électriques facture un forfait fixe plus un prix par heure. Une location de " + M(d1) + " h a coûté " + M(CHF(c1)) + " CHF, une location de " + M(d2) + " h " + M(CHF(c2)) + " CHF.",
        [["a) Prix par heure (CHF)", p], ["b) Forfait (CHF)", f], ["c) Nombre maximal d'heures entières avec " + B + " CHF", Math.floor(hmax)]],
        ["La différence de prix correspond à la différence d'heures.", "c) Résous forfait + (prix par heure) · x ≤ " + B + ", puis prends l'entier inférieur."],
        "a) " + M("\\frac{" + CHF(c2) + " - " + CHF(c1) + "}{" + (d2 - d1) + "} = " + D(p)) + " CHF/h. b) " + M(CHF(c1) + " - " + d1 + " \\cdot " + D(p) + " = " + D(f)) + " CHF. c) " + M(D(f) + " + " + D(p) + "x \\leq " + B + " \\iff x \\leq " + D(r2c(hmax))) + " : " + M(Math.floor(hmax)) + " h."));
    },
    () => { /* plombier : déplacement + tarif horaire */
      const p = pk([85, 95, 110, 120]), f = pk([40, 50, 65, 80]), [d1, d2] = pk([[1, 2.5], [1.5, 3], [2, 3.5], [1, 3]]), t3 = pk([0.5, 4, 4.5, 5].filter((t) => t !== d1 && t !== d2));
      const c1 = f + p * d1, c2 = f + p * d2;
      return CXP("plombier", P("Un plombier facture un déplacement fixe plus un tarif horaire. Une intervention de " + M(D(d1)) + " h a coûté " + M(CHF(c1)) + " CHF, une intervention de " + M(D(d2)) + " h " + M(CHF(c2)) + " CHF.",
        [["a) Tarif horaire (CHF)", p], ["b) Prix du déplacement (CHF)", f], ["c) Prix d'une intervention de " + T(t3) + " h (CHF)", f + p * t3]],
        ["La différence de prix correspond à la différence de durée.", "b) Prix − durée · tarif horaire."],
        "a) " + M("\\frac{" + CHF(c2) + " - " + CHF(c1) + "}{" + D(d2 - d1) + "} = " + p) + " CHF/h. b) " + M(CHF(c1) + " - " + D(d1) + " \\cdot " + p + " = " + f) + " CHF. c) " + M(f + " + " + p + " \\cdot " + D(t3) + " = " + CHF(f + p * t3)) + " CHF."));
    });
  ADD("pyth", ["echelle", "parc"],
    () => { /* cerf-volant */
      const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = pk([2, 3, 4, 5]), sw = R.rand() < 0.5, L = k * r, d = k * (sw ? p : q), h = k * (sw ? q : p);
      if (L > 100) return OUT.pyth[2]();
      return CXP("cerfvolant", P("Lina tient la ficelle tendue de son cerf-volant à 1,2 m du sol. La ficelle mesure " + M(L) + " m, et le cerf-volant est à la verticale d'un arbre situé à " + M(d) + " m d'elle (distance horizontale).",
        [["a) Hauteur du cerf-volant au-dessus de sa main (m)", h], ["b) Hauteur du cerf-volant au-dessus du sol (m)", +(h + 1.2).toFixed(6)], ["c) Aire du triangle formé par la ficelle, l'horizontale et la verticale (m²)", (d * h) / 2]],
        ["La ficelle est l'hypoténuse d'un triangle rectangle : hauteur² = " + L + "² − " + d + "².", "b) Ajoute la hauteur de la main. c) Triangle rectangle : côté · côté ÷ 2."],
        "a) " + M("\\sqrt{" + L + "^2 - " + d + "^2} = \\sqrt{" + nb(L * L - d * d) + "} = " + h) + " m. b) " + M(h + " + 1{,}2 = " + D(+(h + 1.2).toFixed(6))) + " m. c) " + M(d + " \\cdot " + h + " \\div 2 = " + D((d * h) / 2)) + " m²."));
    });
  ADD("simil", ["photo", "maquette"],
    () => { /* pizzas : prix proportionnel à l'aire */
      const d1 = pk([24, 26, 28, 30, 32]), k = pk([1.25, 1.5]), d2 = d1 * k, Pp = pk([12, 14, 16, 18]), g = pk([80, 100, 120]);
      return CXP("pizza", P("Une pizzeria fixe des prix proportionnels à l'aire des pizzas. La petite pizza a un diamètre de " + M(d1) + " cm et coûte " + M(CHF(Pp)) + " CHF ; la grande a un diamètre de " + M(D(d2)) + " cm.",
        [["a) Rapport de similitude (grande ÷ petite)", k], ["b) Prix de la grande pizza (CHF, au centime)", r2c(Pp * k * k), 0.01], ["c) La petite est garnie de " + g + " g de fromage. Masse de fromage sur la grande, à la même épaisseur (g)", +(g * k * k).toFixed(6)]],
        ["Rapport = diamètre de la grande ÷ diamètre de la petite.", "Les aires (donc le prix et le fromage) sont multipliées par le CARRÉ du rapport."],
        "a) " + M(D(d2) + " \\div " + d1 + " = " + D(k)) + ". b) " + M(CHF(Pp) + " \\cdot " + D(k) + "^2 = " + CHF(Pp) + " \\cdot " + D(k * k) + eqa(Pp * k * k, r2c(Pp * k * k)) + CHF(r2c(Pp * k * k))) + " CHF. c) " + M(g + " \\cdot " + D(k * k) + " = " + D(+(g * k * k).toFixed(6))) + " g."));
    });
  ADD("monomes", "pave",
    () => { /* cube */
      const a = ri(2, 6), v = ri(2, 5), m = pk([2, 3]);
      return CXP("cube", P("Un cube a des arêtes de " + M(a + "x") + " cm.",
        [["a) Coefficient du volume écrit sous forme de monôme " + M("kx^3"), a ** 3], ["b) Coefficient de l'aire totale (6 faces) écrite " + M("kx^2"), 6 * a * a], ["c) Volume pour " + M("x = " + v) + " (cm³)", a ** 3 * v ** 3], ["d) Si " + M("x") + " est multiplié par " + m + ", l'aire totale est multipliée par…", m * m]],
        ["(" + a + "x)³ = " + a + "³ · x³ : le coefficient aussi est élevé au cube.", "Une face : (" + a + "x)² ; six faces. d) (" + m + "x)² = " + m * m + "x²."],
        "a) " + M("(" + a + "x)^3 = " + a ** 3 + "x^3") + ". b) " + M("6 \\cdot (" + a + "x)^2 = 6 \\cdot " + a * a + "x^2 = " + 6 * a * a + "x^2") + ". c) " + M(a ** 3 + " \\cdot " + v + "^3 = " + nb(a ** 3 * v ** 3)) + " cm³. d) " + M("(" + m + "x)^2 = " + m * m + "x^2") + " : multipliée par " + m * m + "."));
    },
    () => { /* terrain : rectangle et carré */
      let a, b, c; do { a = ri(2, 6); b = ri(3, 9); c = ri(2, 5); } while (a === b);
      const v = ri(2, 6);
      return CXP("terrain", P("Un terrain de sport est formé d'un rectangle de " + M(a + "x") + " m sur " + M(b + "x") + " m, accolé à un carré de " + M(c + "x") + " m de côté.",
        [["a) Coefficient de l'aire du rectangle écrite " + M("kx^2"), a * b], ["b) Coefficient de l'aire totale du terrain écrite " + M("kx^2"), a * b + c * c], ["c) Aire totale pour " + M("x = " + v) + " (m²)", (a * b + c * c) * v * v], ["d) Si " + M("x") + " est multiplié par 3, l'aire totale est multipliée par…", 9]],
        ["Multiplie les coefficients entre eux et les x entre eux : x · x = x².", "b) Additionne deux monômes semblables (en x²)."],
        "a) " + M(a + "x \\cdot " + b + "x = " + a * b + "x^2") + ". b) " + M(a * b + "x^2 + (" + c + "x)^2 = " + a * b + "x^2 + " + c * c + "x^2 = " + (a * b + c * c) + "x^2") + ". c) " + M((a * b + c * c) + " \\cdot " + v + "^2 = " + nb((a * b + c * c) * v * v)) + " m². d) " + M("(3x)^2 = 9x^2") + " : multipliée par 9."));
    });
  ADD("reduire", "triangle",
    () => { /* rectangle : périmètre, puis carré */
      let a1, b1, a2, b2, xi, xp; do { a1 = ri(1, 4); b1 = ri(1, 9); a2 = ri(2, 6); b2 = ri(1, 9); xi = (b1 + b2) / (a2 - a1); xp = ri(3, 9); } while (a2 <= a1 || !Number.isInteger(xi) || xi < 2 || xi > 12 || b1 === b2 || a2 * xp - b2 <= 0 || xp === xi);
      const A = 2 * (a1 + a2), B = 2 * (b1 - b2), Pp = A * xp + B, cf = (k) => (k === 1 ? "" : k);
      return CXP("rectangle", P("Un rectangle a des côtés de " + M(cf(a1) + "x + " + b1) + " et " + M(a2 + "x - " + b2) + " (en cm).",
        [["a) Coefficient de " + M("x") + " dans le périmètre réduit", A], ["b) Terme constant du périmètre réduit", B], ["c) Valeur de " + M("x") + " pour un périmètre de " + M(Pp) + " cm", xp], ["d) Valeur de " + M("x") + " pour laquelle ce rectangle est un carré", xi]],
        ["Périmètre = 2 · (longueur + largeur) : réduis la parenthèse, puis distribue le 2.", "d) Un carré : les deux côtés sont égaux. Résous " + cf(a1) + "x + " + b1 + " = " + a2 + "x − " + b2 + "."],
        "a) et b) " + M("P = 2(" + (a1 + a2) + "x " + (b1 - b2 < 0 ? "- " + (b2 - b1) : "+ " + (b1 - b2)) + ") = " + poly([A, B])) + ". c) " + M(poly([A, B]) + " = " + Pp + " \\iff " + A + "x = " + (Pp - B) + " \\iff x = " + xp) + ". d) " + M(cf(a1) + "x + " + b1 + " = " + a2 + "x - " + b2 + " \\iff " + (b1 + b2) + " = " + cfD(a2 - a1) + "x \\iff x = " + xi) + "."));
    },
    () => { /* course d'orientation : trois étapes */
      let a1, b1, a2, b2, a3, b3, xi, xp; do { a1 = ri(2, 5); b1 = 10 * ri(1, 9); a2 = ri(2, 6); b2 = 10 * ri(1, 9); a3 = ri(3, 8); b3 = 10 * ri(1, 9); xi = (b1 + b3) / (a3 - a1); xp = 10 * ri(5, 20); } while (a3 <= a1 || !Number.isInteger(xi) || xi < 20 || xi > 200 || b1 + b2 === b3 || a3 * xp - b3 <= 0 || xp === xi);
      const A = a1 + a2 + a3, B = b1 + b2 - b3, Pp = A * xp + B;
      return CXP("orientation", P("Une course d'orientation compte trois étapes de " + M(a1 + "x + " + b1) + " m, " + M(a2 + "x + " + b2) + " m et " + M(a3 + "x - " + b3) + " m.",
        [["a) Coefficient de " + M("x") + " dans la longueur totale réduite", A], ["b) Terme constant de la longueur totale réduite", B], ["c) Valeur de " + M("x") + " pour une longueur totale de " + M(nb(Pp)) + " m", xp], ["d) Valeur de " + M("x") + " pour laquelle la première et la troisième étape ont la même longueur", xi]],
        ["Additionne les trois étapes, puis regroupe les termes en x et les nombres (attention au « − " + b3 + " »).", "c) Résous " + A + "x " + (B < 0 ? "− " + -B : "+ " + B) + " = " + nbT(Pp) + "."],
        "a) et b) " + M(poly([A, B])) + ". c) " + M(poly([A, B]) + " = " + nb(Pp) + " \\iff " + A + "x = " + nb(Pp - B) + " \\iff x = " + xp) + ". d) " + M(a1 + "x + " + b1 + " = " + a3 + "x - " + b3 + " \\iff " + (b1 + b3) + " = " + cfD(a3 - a1) + "x \\iff x = " + xi) + "."));
    });
  /* ==== 26.11 soir (agent defisch2) : suite de la liste « Restent à 1 ou 2 contextes » (9e–11e). Les gabarits existants
     reçoivent leur ctx ; un contexte de plus par notion (deux pour distrib et litconv), valeurs tirées, corrigé calculé,
     oracle par contexte dans tests/recalc_oracles.js (section « agent defisch2 »). Aucun lieu suisse (notions communes
     avec la France : CHF devient € par frLocal). ==== */
  const TAGX = (fn, cx) => () => { const q = fn(); if (!q.ctx) q.ctx = cx; return q; };
  const RSIMP = (a, n) => { let o = a, r = n; for (let k = 2; k * k <= r; k++) while (r % (k * k) === 0) { r /= k * k; o *= k; } return r === 1 ? String(o) : (o === 1 ? "" : o) + "\\sqrt{" + r + "}"; };
  ADD("eq2", ["rectangle", "carre"],
    () => { /* tournoi : chaque équipe rencontre une fois chacune des autres */
      const n = ri(6, 16), Mm = (n * (n - 1)) / 2, sp = pk(["volleyball", "basket", "handball", "football", "water-polo"]);
      return CXP("tournoi", P("Dans un tournoi de " + sp + ", chaque équipe rencontre une seule fois chacune des autres. En tout, " + M(Mm) + " matchs ont été joués.",
        [["a) Nombre d'équipes", n], ["b) Nombre de matchs si chaque rencontre se jouait en aller et retour", n * (n - 1)], ["c) Nombre de matchs (une rencontre par paire) si une équipe de plus s'était inscrite", (n * (n + 1)) / 2]],
        ["Avec x équipes, chacune joue x − 1 matchs, mais chaque match est alors compté deux fois : x(x − 1) ÷ 2 = " + Mm + ".",
         "x² − x − " + 2 * Mm + " = 0 : cherche deux nombres de produit −" + 2 * Mm + " et de somme −1 (ou utilise Δ). Un nombre d'équipes est positif."],
        M("\\frac{x(x - 1)}{2} = " + Mm + " \\iff x^2 - x - " + 2 * Mm + " = 0 \\iff (x - " + n + ")(x + " + (n - 1) + ") = 0") + ". a) " + M(n) + " équipes (" + M(-(n - 1)) + " est impossible). b) " + M(n + " \\cdot " + (n - 1) + " = " + n * (n - 1)) + " matchs. c) " + M("\\frac{" + (n + 1) + " \\cdot " + n + "}{2} = " + (n * (n + 1)) / 2) + " matchs."));
    });
  ADD("eq2fact", ["chute", "lancer"],
    () => { /* nappe carrée qui dépasse d'une table carrée : différence de deux carrés */
      let s, a, x; do { s = 10 * ri(10, 18); a = ri(10, 25); x = s - 2 * a; } while (x < 60 || a % 10 === 0);
      const N = s * s, lab = pk(["la table du salon", "la table de la terrasse", "la table de la cuisine"]);
      return CXP("nappe", P("Une nappe carrée de " + M(nb(N)) + " cm² recouvre " + lab + ", carrée elle aussi, et dépasse de " + M(a) + " cm de chaque côté. On note " + M("x") + " le côté de la table (cm) : " + M("(x + " + 2 * a + ")^2 = " + nb(N)) + ".",
        [["a) Côté de la table (cm)", x], ["b) Aire de la partie de la nappe qui dépasse (cm²)", N - x * x], ["c) L'équation a une autre solution, négative : laquelle ?", -s - 2 * a]],
        ["Ramène tout d'un côté : (x + " + 2 * a + ")² − " + nbT(N) + " = 0, puis reconnais une différence de deux carrés (" + nbT(N) + " = " + s + "²).",
         "A² − B² = (A − B)(A + B) ; produit nul : chaque facteur peut valoir 0. Un côté est positif."],
        M("(x + " + 2 * a + ")^2 - " + s + "^2 = (x + " + 2 * a + " - " + s + ")(x + " + 2 * a + " + " + s + ") = (x - " + x + ")(x + " + (s + 2 * a) + ") = 0") + ". a) " + M(x) + " cm. b) " + M(nb(N) + " - " + x + "^2 = " + nb(N - x * x)) + " cm². c) " + M(-s - 2 * a) + "."));
    });
  ADD("idrem", ["nombre", "carre"],
    () => { /* calcul mental avec les identités */
      const m = 10 * ri(3, 9), d = ri(2, 4), u = m + d, v = m - d;
      return CXP("calcmental", P("Sans calculatrice, on calcule des carrés et un produit grâce aux identités remarquables, en écrivant " + M(u + " = " + m + " + " + d) + " et " + M(v + " = " + m + " - " + d) + ".",
        [["a) " + M(u + "^2"), u * u], ["b) " + M(v + "^2"), v * v], ["c) " + M(u + " \\cdot " + v), u * v], ["d) " + M(u + "^2 - " + v + "^2"), 4 * m * d]],
        ["(a + b)² = a² + 2ab + b² et (a − b)² = a² − 2ab + b², avec a = " + m + " et b = " + d + ".", "(a + b)(a − b) = a² − b². Pour d) : différence de deux carrés, ou soustrais a) et b)."],
        "a) " + M("(" + m + " + " + d + ")^2 = " + nb(m * m) + " + " + 2 * m * d + " + " + d * d + " = " + nb(u * u)) + ". b) " + M("(" + m + " - " + d + ")^2 = " + nb(m * m) + " - " + 2 * m * d + " + " + d * d + " = " + nb(v * v)) + ". c) " + M("(" + m + " + " + d + ")(" + m + " - " + d + ") = " + nb(m * m) + " - " + d * d + " = " + nb(u * v)) + ". d) " + M("4 \\cdot " + m + " \\cdot " + d + " = " + 4 * m * d) + "."));
    });
  ADD("sys2", ["billets", "rectangle"],
    () => { /* QCM : points gagnés et perdus */
      let n, g, p, x, S, g2, p2; do { n = pk([20, 24, 25, 30, 40]); [g, p] = pk([[4, 1], [3, 1], [5, 2], [3, 2]]); [g2, p2] = pk([[2, 1], [4, 2], [5, 1], [3, 1]]); x = ri(Math.ceil(n / 2), n - 2); S = g * x - p * (n - x); } while (S <= 0 || (g2 === g && p2 === p) || g2 * x - p2 * (n - x) <= 0);
      const nm = pk(["Noé", "Lina", "Elias", "Maëlle", "Liam"]);
      return CXP("qcm", P("Un QCM compte " + M(n) + " questions et " + nm + " a répondu à toutes. Une réponse juste rapporte " + M(g) + " points, une réponse fausse en enlève " + M(p) + ". " + nm + " obtient " + M(S) + " points.",
        [["a) Nombre de réponses justes", x], ["b) Nombre de réponses fausses", n - x], ["c) Score avec le barème +" + g2 + " / −" + p2, g2 * x - p2 * (n - x)]],
        ["Deux inconnues : j (justes) et f (fausses). Une équation pour le nombre de questions, une pour le score.",
         "j + f = " + n + " et " + g + "j − " + p + "f = " + S + ". Substitution : f = " + n + " − j."],
        M("j + f = " + n) + ", " + M(g + "j - " + p + "f = " + S) + " : " + M(g + "j - " + p + "(" + n + " - j) = " + S + " \\iff " + (g + p) + "j = " + (S + p * n)) + ". a) " + M("j = " + x) + ". b) " + M("f = " + (n - x)) + ". c) " + M(g2 + " \\cdot " + x + " - " + p2 + " \\cdot " + (n - x) + " = " + (g2 * x - p2 * (n - x))) + " points."));
    });
  ADD("angles", ["polygone", "inscrits"],
    () => { /* grande roue : angle au centre, angle inscrit, triangle isocèle */
      let n, k; do { n = pk([8, 10, 12, 15, 18, 20, 24, 30, 36]); k = ri(2, Math.floor((n - 1) / 2)); } while ((180 * k) % n !== 0 || (360 * k) / n >= 170);
      const c = (360 * k) / n, i = c / 2;
      return CXP("granderoue", P("Une grande roue porte " + M(n) + " nacelles régulièrement réparties sur un cercle de centre " + M("O") + ". Entre les nacelles " + M("A") + " et " + M("B") + ", il y a " + M(k) + " intervalles (" + (k - 1 === 1 ? "une nacelle" : k - 1 + " nacelles") + " entre elles). Une nacelle " + M("C") + " est sur le grand arc " + M("AB") + ".",
        [["a) " + M("\\widehat{AOB}") + " (°)", c], ["b) " + M("\\widehat{ACB}") + " (°)", i], ["c) " + M("\\widehat{OAB}") + " (°)", 90 - i]],
        ["Les " + n + " nacelles partagent le tour complet (360°) en " + n + " angles au centre égaux.",
         "b) Un angle inscrit vaut la moitié de l'angle au centre qui intercepte le même arc. c) Le triangle AOB est isocèle en O (OA = OB = rayon)."],
        "a) " + M(k + " \\cdot \\frac{360°}{" + n + "} = " + c + "°") + ". b) " + M("\\frac{" + c + "°}{2} = " + i + "°") + ". c) " + M("\\frac{180° - " + c + "°}{2} = " + (90 - i) + "°") + "."));
    });
  ADD("angtri", "polygone",
    () => { /* cerf-volant : quadrilatère à deux paires de côtés égaux */
      let a, c; do { a = 2 * ri(30, 60); c = 2 * ri(20, 50); } while (a === c || a + c > 220 || a + c < 120);
      const b = (360 - a - c) / 2;
      return Object.assign(CXP("cerfvolant", P("L'armature d'un cerf-volant forme un quadrilatère " + M("ABCD") + " avec " + M("AB = AD") + " et " + M("CB = CD") + ". On mesure " + M("\\widehat{DAB} = " + a + "°") + " et " + M("\\widehat{BCD} = " + c + "°") + ".",
        [["a) " + M("\\widehat{ABC}") + " (°)", b], ["b) " + M("\\widehat{BAC}") + " (°)", a / 2], ["c) " + M("\\widehat{ABD}") + " (°)", 90 - a / 2]],
        ["Somme des angles d'un quadrilatère : 360°. La diagonale (AC) est un axe de symétrie : les angles en B et en D sont égaux, et (AC) partage les angles en A et en C en deux.",
         "c) Le triangle ABD est isocèle en A (AB = AD) : ses angles à la base sont égaux."],
        "a) " + M("\\frac{360° - " + a + "° - " + c + "°}{2} = " + b + "°") + ". b) " + M("\\frac{" + a + "°}{2} = " + a / 2 + "°") + ". c) " + M("\\frac{180° - " + a + "°}{2} = " + (90 - a / 2) + "°") + ".")), { co: [9, 12] });
    });
  if (PROBX.angtri) PROBX.angtri = PROBX.angtri.map((f) => TAGX(f, "bissectrice"));
  ADD("volcone", ["cornet", "boule"],
    () => { /* tas de sable conique : volume, camions, couche étalée */
      let d, h, c, V; do { d = pk([3, 4, 5, 6]); h = pk([1.2, 1.5, 1.8, 2, 2.4]); c = pk([6, 8, 10]); V = (Math.PI * (d / 2) ** 2 * h) / 3; } while (V / c - Math.floor(V / c) < 0.1 || V < c);
      const e = pk([5, 10]), mat = pk([["sable", "Sur un chantier"], ["gravier", "Sur un chantier"], ["compost", "Dans un jardin communautaire"]]);
      return CXP("tas", P(mat[1] + ", un tas de " + mat[0] + " a la forme d'un cône de " + M(d + " \\text{ m}") + " de diamètre et de " + M(D(h) + " \\text{ m}") + " de haut.",
        [["a) Volume du tas (m³, au dixième)", V, 0.1], ["b) Nombre minimal de chargements d'une remorque de " + c + " m³ pour tout transporter", Math.ceil(V / c)], ["c) On l'étale en une couche de " + e + " cm d'épaisseur : aire couverte (m², à l'unité)", V / (e / 100), 1]],
        ["Cône : π r² h ÷ 3, avec r = " + T(d / 2) + " m (la moitié du diamètre).", "b) Divise par " + c + " et arrondis vers le HAUT. c) La couche est un pavé : aire = volume ÷ épaisseur (en m : " + T(e / 100) + " m)."],
        "a) " + M("\\frac{\\pi \\cdot " + D(d / 2) + "^2 \\cdot " + D(h) + "}{3} \\approx " + D(r1(V))) + " m³. b) " + M(D(r1(V)) + " \\div " + c + " \\approx " + D(r2c(V / c))) + " : " + M(Math.ceil(V / c)) + " chargements. c) " + M("V \\div " + D(e / 100) + " \\approx " + Math.round(V / (e / 100))) + " m²."));
    });
  ADD("formule", ["imc", "energie"],
    () => { /* distance de l'horizon */
      const tie = (v, st) => Math.abs(v / st - Math.floor(v / st) - 0.5) < 0.05;
      let h, Dk, k, pt; do { pt = pk([["d'un phare", 2, 6], ["d'une tour d'observation", 2, 9], ["d'une falaise", 5, 15]]); h = 10 * ri(pt[1], pt[2]); Dk = 5 * ri(6, 16); k = pk([2, 3]); } while (tie(3.57 * Math.sqrt(h), 0.1) || tie((Dk / 3.57) ** 2, 1));
      const d = 3.57 * Math.sqrt(h), hh = (Dk / 3.57) ** 2;
      return CXP("horizon", P("Par temps clair, on voit jusqu'à l'horizon à une distance " + M("d = 3{,}57\\sqrt{h}") + " (" + M("d") + " en km, " + M("h") + " : hauteur des yeux en m, au-dessus de la mer).",
        [["a) Distance de l'horizon depuis le sommet " + pt[0] + " de " + h + " m (km, au dixième)", d, 0.1], ["b) Hauteur nécessaire pour voir à " + Dk + " km (m, à l'unité)", hh, 1], ["c) Par combien faut-il multiplier la hauteur pour voir " + (k === 2 ? "deux" : "trois") + " fois plus loin ?", k * k]],
        ["b) Isole √h (divise par 3,57), puis élève au carré.", "c) Si h est multipliée par m, d est multipliée par √m : il faut √m = " + k + "."],
        "a) " + M("3{,}57\\sqrt{" + h + "} \\approx " + D(r1(d))) + " km. b) " + M("\\sqrt{h} = \\frac{" + Dk + "}{3{,}57}") + ", " + M("h = \\left(\\frac{" + Dk + "}{3{,}57}\\right)^2 \\approx " + nb(Math.round(hh))) + " m. c) " + M(k + "^2 = " + k * k) + "."));
    });
  ADD("proba", ["urne", "des"],
    () => { /* QCM répondu au hasard */
      const c = pk([3, 4, 5]), n = pk([2, 3]), nm = pk(["Mia", "Tom", "Inès", "Hugo"]), w = n === 2 ? "deux" : "trois";
      const all = 1 / c ** n, one = (n * (c - 1) ** (n - 1)) / c ** n, some = 1 - ((c - 1) / c) ** n;
      return CXP("qcm", P(nm + " n'a pas révisé et répond au hasard aux " + w + " questions d'un QCM ; chaque question propose " + c + " réponses, dont une seule est juste. (fractions acceptées)",
        [["a) P(les " + w + " réponses sont justes)", all], ["b) P(exactement une réponse juste)", one], ["c) P(au moins une réponse juste)", some]],
        ["Arbre à " + n + " étages : à chaque question, P(juste) = 1/" + c + " et P(fausse) = " + (c - 1) + "/" + c + " ; on multiplie le long d'un chemin.",
         "b) Une seule juste : " + n + " chemins (la juste peut être à n'importe quelle question). c) Contraire de « toutes fausses »."],
        "a) " + M("\\left(\\frac{1}{" + c + "}\\right)^" + n + " = " + frac(1, c ** n)) + ". b) " + M(n + " \\cdot \\frac{1}{" + c + "} \\cdot \\left(\\frac{" + (c - 1) + "}{" + c + "}\\right)^{" + (n - 1) + "} = " + frac(n * (c - 1) ** (n - 1), c ** n)) + ". c) " + M("1 - \\left(\\frac{" + (c - 1) + "}{" + c + "}\\right)^" + n + " = " + frac(c ** n - (c - 1) ** n, c ** n)) + "."));
    });
  ADD("volmanq", ["conserve", "verre"],
    () => { /* piscine ronde hors-sol : hauteur d'eau, durée de remplissage */
      let d, V, q, H; do { d = pk([3, 3.6, 4.2, 4.6, 5.5]); V = pk([6, 8, 10, 12, 15, 20]); q = pk([12, 15, 20, 25]); H = (100 * V) / (Math.PI * (d / 2) ** 2); } while (H < 60 || H > 120);
      const A = Math.PI * (d / 2) ** 2, t = (1000 * V) / q / 60;
      return CXP("piscine", P("Une piscine ronde hors-sol a un fond de " + M(D(d) + " \\text{ m}") + " de diamètre. On y verse " + M(V + " \\text{ m}^3") + " d'eau avec un tuyau d'arrosage qui débite " + M(q) + " litres par minute.",
        [["a) Aire du fond (m², au centième)", A, 0.01], ["b) Hauteur de l'eau (cm, à l'unité)", H, 1], ["c) Durée du remplissage (h, au dixième)", r1(t), 0.1]],
        ["Aire du disque : π r², avec r = " + T(d / 2) + " m. Volume d'un cylindre = aire du fond · hauteur.",
         "b) Isole la hauteur (en m), puis convertis en cm. c) 1 m³ = 1'000 L ; durée en minutes, puis en heures."],
        "a) " + M("\\pi \\cdot " + D(d / 2) + "^2 \\approx " + D(r2c(A))) + " m². b) " + M("h = \\frac{" + V + "}{\\pi \\cdot " + D(d / 2) + "^2} \\approx " + D(+(H / 100).toFixed(3))) + " m, soit environ " + M(Math.round(H)) + " cm. c) " + M(nb(1000 * V) + " \\div " + q + " \\approx " + nb(Math.round((1000 * V) / q))) + " min " + M("\\approx " + D(r1(t))) + " h."));
    });
  ADD("cercthales", ["tangentes", "demicercle"],
    () => { /* tunnel à voûte en demi-cercle */
      const L = []; for (let dd = 8; dd <= 26; dd++) for (let x = 1; 2 * x < dd; x++) { const s = Math.sqrt(x * (dd - x)); if (Number.isInteger(s) && s >= 3) L.push([dd, x, s]); }
      const [d, x, h] = pk(L), AC = Math.sqrt(x * d), BC = Math.sqrt((d - x) * d);
      return CXP("tunnel", P("Un tunnel a une voûte en demi-cercle ; au sol, elle s'appuie sur le diamètre " + M("[AB]") + " de " + M(d) + " m. Un point " + M("C") + " de la voûte est à la verticale du point " + M("H") + " du sol, avec " + M("AH = " + x) + " m.",
        [["a) Hauteur " + M("CH") + " (m)", h], ["b) Longueur " + M("AC") + " (m, au centième)", AC, 0.01], ["c) Longueur " + M("BC") + " (m, au centième)", BC, 0.01]],
        ["Le centre O est le milieu de [AB] : OC = " + T(d / 2) + " m (rayon) et OH = " + T(Math.abs(d / 2 - x)) + " m. Pythagore dans le triangle OHC, rectangle en H.",
         "b) et c) Pythagore dans AHC puis dans BHC. Contrôle : C est sur le cercle de diamètre [AB], donc le triangle ABC est rectangle en C et AC² + BC² = AB²."],
        "a) " + M("CH = \\sqrt{" + D(d / 2) + "^2 - " + D(Math.abs(d / 2 - x)) + "^2} = " + h) + " m. b) " + M("AC = \\sqrt{" + x + "^2 + " + h + "^2} = \\sqrt{" + x * d + "} \\approx " + D(r2c(AC))) + " m. c) " + M("BC = \\sqrt{" + (d - x) + "^2 + " + h + "^2} = \\sqrt{" + (d - x) * d + "} \\approx " + D(r2c(BC))) + " m ; " + M(x * d + " + " + (d - x) * d + " = " + d * d + " = " + d + "^2") + " : angle droit en " + M("C") + "."));
    });
  ADD("thalesrec", ["etagere", "triangle"],
    () => { /* escabeau : sangle parallèle au sol */
      let L, r, BC, q; do { L = pk([150, 160, 180, 200]); r = pk([0.4, 0.6, 0.75, 0.8]); BC = 10 * ri(6, 11); q = pk([0.3, 0.4, 0.45, 0.6, 0.7, 0.75, 0.8]); } while (q === r || !Number.isInteger(r * L) || !Number.isInteger(q * L) || !Number.isInteger(q * BC) || !Number.isInteger(r * BC));
      const AD = r * L, s = q * BC;
      return CXP("escabeau", P("Les deux montants " + M("[AB]") + " et " + M("[AC]") + " d'un escabeau mesurent " + M(L) + " cm ; ses pieds " + M("B") + " et " + M("C") + " sont écartés de " + M(BC) + " cm. Une sangle " + M("[DE]") + " est fixée à " + M("AD = AE = " + AD) + " cm du sommet " + M("A") + ".",
        [["a) " + M("AD \\div AB") + " (décimal)", r], ["b) Longueur de la sangle " + M("DE") + " (cm)", r * BC], ["c) Une autre sangle mesure " + M(s) + " cm : à quelle distance de " + M("A") + " faut-il la fixer pour qu'elle soit parallèle au sol (cm) ?", q * L]],
        ["AD ÷ AB = AE ÷ AC : par la réciproque de Thalès, la sangle est parallèle au sol (BC).",
         "b) Thalès : DE ÷ BC = AD ÷ AB. c) Il faut x ÷ " + L + " = " + s + " ÷ " + BC + "."],
        "a) " + M(frac(AD, L) + " = " + D(r)) + " ; " + M("\\frac{AE}{AC}") + " aussi, donc " + M("(DE) \\parallel (BC)") + ". b) " + M(D(r) + " \\cdot " + BC + " = " + D(r * BC)) + " cm. c) " + M("x = " + L + " \\cdot \\frac{" + s + "}{" + BC + "} = " + q * L) + " cm."));
    });
  ADD("racprop", ["carre", "triangle"],
    () => { /* cube d'arête a√k : diagonales en valeur exacte */
      const k = pk([2, 3, 5, 6, 7]), a = ri(2, 6), e = a * Math.sqrt(k);
      return CXP("cube", P("Un cube a des arêtes de " + M(a + "\\sqrt{" + k + "}") + " cm. Donne les réponses en valeur exacte simplifiée.",
        [["a) Diagonale d'une face (cm)", RAD(e * Math.SQRT2)], ["b) Diagonale du cube (cm)", RAD(e * Math.sqrt(3))], ["c) Aire totale des six faces (cm²)", 6 * a * a * k]],
        ["Diagonale d'une face : Pythagore dans un carré, d = arête · √2. Simplifie √" + 2 * k + " si possible.",
         "Diagonale du cube : Pythagore dans le triangle formé d'une arête et d'une diagonale de face, D = arête · √3. Aire d'une face : (" + a + "√" + k + ")² = " + a * a + " · " + k + "."],
        "a) " + M(a + "\\sqrt{" + k + "} \\cdot \\sqrt{2} = " + a + "\\sqrt{" + 2 * k + "}" + (RSIMP(a, 2 * k) !== a + "\\sqrt{" + 2 * k + "}" ? " = " + RSIMP(a, 2 * k) : "")) + " cm. b) " + M(a + "\\sqrt{" + k + "} \\cdot \\sqrt{3} = " + a + "\\sqrt{" + 3 * k + "}" + (RSIMP(a, 3 * k) !== a + "\\sqrt{" + 3 * k + "}" ? " = " + RSIMP(a, 3 * k) : "")) + " cm. c) " + M("6 \\cdot (" + a + "\\sqrt{" + k + "})^2 = 6 \\cdot " + a * a * k + " = " + 6 * a * a * k) + " cm²."));
    });
  /* distrib, echelle, litconv : défis hors de cet objet (PROB, PROB_EXTRA, PROBX des fichiers de chapitre) */
  if (typeof PROB_EXTRA !== "undefined") {
    if (PROB_EXTRA.distrib) PROB_EXTRA.distrib = PROB_EXTRA.distrib.map((f) => TAGX(f, "difference")).concat([
      () => { /* 11e : double distributivité (ctx « double », écarté en 10e par HORS_CO) */
        let a, b, n; do { a = ri(2, 7); b = ri(2, 7); n = ri(4, 12); } while (a === b);
        const obj = pk([["potager", "m"], ["poulailler", "m"], ["tapis de jeu", "dm"]]), u = obj[1];
        return CXP("double", P("Un " + obj[0] + " carré de " + M("x") + " " + u + " de côté est agrandi : on allonge un côté de " + M(a) + " " + u + " et l'autre de " + M(b) + " " + u + ". Son aire devient " + M("(x + " + a + ")(x + " + b + ")") + ".",
          [["a) Développée et réduite, la nouvelle aire s'écrit " + M("x^2 + \\ldots x + \\ldots") + " : coefficient de " + M("x"), a + b], ["b) Terme constant", a * b], ["c) Augmentation de l'aire pour " + M("x = " + n) + " (" + u + "²)", (a + b) * n + a * b]],
          ["Double distributivité : chaque terme de la première parenthèse multiplie chaque terme de la seconde (4 produits), puis regroupe les termes en x.",
           "c) Augmentation = nouvelle aire − x² = " + (a + b) + "x + " + a * b + " ; remplace x par " + n + "."],
          M("(x + " + a + ")(x + " + b + ") = x^2 + " + b + "x + " + a + "x + " + a * b + " = x^2 + " + (a + b) + "x + " + a * b) + ". a) " + M(a + b) + ". b) " + M(a * b) + ". c) " + M((a + b) + " \\cdot " + n + " + " + a * b + " = " + ((a + b) * n + a * b)) + " " + u + "²."));
      },
      () => { /* simple distributivité : sortie de classe */
        let k, g, a, v; do { k = ri(17, 25); g = pk([2, 3]); a = ri(3, 9); v = ri(6, 18); } while (v === a);
        const lieu = pk(["au zoo", "à la patinoire", "au musée des sciences", "au parc d'attractions"]);
        return Object.assign(CXP("sortie", P("Une classe de " + M(k) + " élèves part " + lieu + " avec " + g + " accompagnants. Chaque personne paie l'entrée, " + M("x") + " CHF, plus " + M(a) + " CHF de transport. Le coût total s'écrit " + M((k + g) + "(x + " + a + ")") + ".",
          [["a) Développé, le coût total s'écrit " + M("\\ldots x + \\ldots") + " : coefficient de " + M("x"), k + g], ["b) Terme constant (CHF)", (k + g) * a], ["c) Coût total si l'entrée coûte " + M(v) + " CHF (CHF)", (k + g) * (v + a)]],
          ["Distributivité : le nombre devant la parenthèse multiplie CHAQUE terme de la parenthèse.", "c) Remplace x par " + v + " dans la forme développée (ou dans la forme factorisée : même résultat)."],
          M((k + g) + "(x + " + a + ") = " + (k + g) + "x + " + (k + g) * a) + ". a) " + M(k + g) + ". b) " + M((k + g) * a) + " CHF (le transport de tout le monde). c) " + M((k + g) + " \\cdot " + v + " + " + (k + g) * a + " = " + (k + g) * (v + a)) + " CHF.")), { co: [10, 11] }); /* 10e : défi propre de la classe (tests/defis9.html) */
      }]);
    if (PROBX.distrib) PROBX.distrib = PROBX.distrib.map((f) => TAGX(f, "accoles"));
    if (PROB.echelle) PROB.echelle = TAGX(PROB.echelle, "maquette");
    if (PROBX.echelle) PROBX.echelle = PROBX.echelle.map((f) => TAGX(f, "carte"));
    if (GEN.echelle) (PROB_EXTRA.echelle = PROB_EXTRA.echelle || []).push(() => { /* modèle réduit de train : longueurs et vitesse */
      const [E, nmE] = pk([[87, "H0"], [160, "N"], [120, "TT"]]), Lm = ri(Math.ceil(1500 / E), Math.floor(2500 / E)), W = ri(18, 27), v = pk([60, 80, 100, 120]);
      const Lr = (Lm * E) / 100, Wm = (W * 100) / E, vm = (v * 100000) / 3600 / E;
      return Object.assign(CXP("train", P("Un réseau de trains miniatures est à l'échelle " + nmE + ", soit " + M("1\\,:\\," + E) + ".",
        [["a) La locomotive miniature mesure " + M(Lm) + " cm : longueur de la vraie locomotive (m)", Lr], ["b) Un vrai wagon mesure " + M(W) + " m : longueur de sa maquette (cm, au dixième)", r1(Wm), 0.1],
         ["c) Un vrai train roule à " + M(v) + " km/h. À quelle vitesse la maquette doit-elle rouler pour paraître aussi rapide (cm/s, au dixième) ?", r1(vm), 0.1]],
        ["Longueur réelle = longueur de la maquette · " + E + " ; maquette = longueur réelle ÷ " + E + ". Attention aux unités : 1 m = 100 cm.",
         "c) Convertis d'abord " + v + " km/h en cm/s (1 km = 100'000 cm, 1 h = 3'600 s), puis divise par " + E + "."],
        "a) " + M(Lm + " \\cdot " + E + " = " + nb(Lm * E)) + " cm " + M("= " + D(Lr)) + " m. b) " + M(nb(W * 100) + " \\div " + E + " \\approx " + D(r1(Wm))) + " cm. c) " + M(v + " \\text{ km/h} = \\frac{" + nb(v * 100000) + "}{3\\text{'}600} \\approx " + D(r1((v * 100000) / 3600)) + " \\text{ cm/s}") + ", puis " + M("\\div " + E + " \\approx " + D(r1(vm))) + " cm/s.")), { co: [10] });
    });
    if (PROB_EXTRA.litconv) PROB_EXTRA.litconv = PROB_EXTRA.litconv.map((f) => TAGX(f, "comparer")).concat([
      () => { /* périmètre écrit de deux façons */
        let k, a, b, v; do { k = pk([2, 3]); a = ri(2, 9); b = ri(1, 6); v = ri(b + 2, 12); } while (a === b);
        const tri = R.rand() < 0.5, s1 = tri ? "x + " + a : k + "x + " + a, s2 = tri ? "2x - " + b : "x - " + b;
        const cx = tri ? 4 : 2 * k + 2, c0 = tri ? 2 * a - b : 2 * (a - b);
        const fig = tri ? "Un triangle isocèle a deux côtés de " + M(s1) + " cm et une base de " + M(s2) + " cm." : "Un rectangle a une longueur de " + M(s1) + " cm et une largeur de " + M(s2) + " cm.";
        const P0 = tri ? "2(" + s1 + ") + " + s2 : "2(" + s1 + ") + 2(" + s2 + ")";
        return CXP("perimetre", P(fig + " Léa écrit son périmètre " + M("P = " + P0) + ".",
          [["a) Écrit selon les conventions et réduit, " + M("P = \\ldots x + \\ldots") + " : coefficient de " + M("x"), cx], ["b) Terme constant (négatif s'il est soustrait)", c0], ["c) Périmètre pour " + M("x = " + v) + " (cm)", cx * v + c0]],
          ["Supprime les parenthèses (le facteur 2 multiplie chaque terme), puis regroupe les termes en x et les nombres.", "c) Remplace x par " + v + " dans la forme réduite, et vérifie avec l'écriture de Léa : deux expressions équivalentes donnent la même valeur."],
          M("P = " + (tri ? "2x + " + 2 * a + " + 2x - " + b : 2 * k + "x + " + 2 * a + " + 2x - " + 2 * b) + " = " + cx + "x" + (c0 < 0 ? " - " + -c0 : " + " + c0)) + ". a) " + M(cx) + ". b) " + M(c0) + ". c) " + M(cx + " \\cdot " + v + (c0 < 0 ? " - " + -c0 : " + " + c0) + " = " + (cx * v + c0)) + " cm."));
      },
      () => { /* conventions d'écriture : produits sans signe, puissances */
        let k, j, m, v; do { k = ri(2, 6); j = ri(2, 5); m = ri(2, 9); v = ri(2, 5); } while (k === j || m === k + j);
        return CXP("conventions", P("Tom a écrit " + M("C = " + k + " \\cdot x \\cdot x - " + m + " \\cdot x + x \\cdot " + j + " \\cdot x") + ", sans les conventions d'écriture.",
          [["a) Écrite avec les conventions et réduite, " + M("C = ax^2 + bx") + ". Que vaut " + M("a") + " ?", k + j], ["b) Que vaut " + M("b") + " ?", -m], ["c) Valeur de " + M("C") + " pour " + M("x = " + v), (k + j) * v * v - m * v]],
          ["x · x s'écrit x² ; le nombre se place devant la lettre et le signe · disparaît : " + k + " · x · x = " + k + "x², x · " + j + " · x = " + j + "x².", "Regroupe les termes en x² ; c) calcule x² avant de multiplier."],
          M("C = " + k + "x^2 - " + m + "x + " + j + "x^2 = " + (k + j) + "x^2 - " + m + "x") + ". a) " + M(k + j) + ". b) " + M(-m) + ". c) " + M((k + j) + " \\cdot " + v + "^2 - " + m + " \\cdot " + v + " = " + ((k + j) * v * v - m * v)) + "."));
      }]);
  }
  /* ---- 1re Collège (agent defisch2) ---- */
  const TAGR = (fn, L) => () => { const q = fn(); if (!q.ctx) { const t = String(q.q || ""); const hit = L.find(([re]) => re.test(t)); if (hit) q.ctx = hit[1]; } return q; };
  const TAGALL = (id, L) => { for (const S of [PROB_EXTRA, PROBX]) if (S && S[id]) S[id] = S[id].map((f) => TAGR(f, L)); };
  const ADDX = (id, ...fns) => { if (PROB_EXTRA[id]) PROB_EXTRA[id] = PROB_EXTRA[id].concat(fns); };
  const sgn = (v) => (v < 0 ? " - " + -v : " + " + v);
  const r6 = (v) => +(+v).toFixed(6);
  TAGALL("eq3", [[/x\^3/, "polynome"]]);
  ADDX("eq3",
    () => { /* facteur commun x, puis identité : a·x³ = b·x */
      let a, k; do { a = pk([2, 3, 5]); k = ri(2, 9); } while (false);
      return CXP("evidence", P("On considère " + M(a + "x^3 = " + a * k * k + "x") + ".",
        [["a) Nombre de solutions", 3], ["b) Plus grande solution", k], ["c) Produit des deux solutions non nulles", -k * k]],
        ["Ramène tout d'un côté, puis mets " + a + "x en évidence (ne divise pas par x : tu perdrais une solution).", "Il reste x² − " + k * k + " : une différence de deux carrés."],
        M(a + "x^3 - " + a * k * k + "x = " + a + "x(x^2 - " + k * k + ") = " + a + "x(x - " + k + ")(x + " + k + ") = 0") + " : " + M("S = \\{-" + k + " \\,;\\, 0 \\,;\\, " + k + "\\}") + ". a) 3. b) " + M(k) + ". c) " + M(k + " \\cdot (-" + k + ") = " + -k * k) + "."));
    },
    () => { /* groupement : x³ + a x² − b² x − a b² = 0 */
      let a, b; do { a = R.nz(-8, 8); b = ri(2, 7); } while (Math.abs(a) === b || Math.abs(a) < 2);
      const S = [-a, -b, b].sort((u, v) => u - v);
      return CXP("groupement", P("On considère " + M("x^3" + sgn(a) + "x^2 - " + b * b + "x" + sgn(-a * b * b) + " = 0") + ". Indication : regroupe les termes deux par deux.",
        [["a) Plus petite solution", S[0]], ["b) Plus grande solution", S[2]], ["c) Somme des solutions", -a]],
        ["x³ " + (a < 0 ? "− " + -a : "+ " + a) + "x² = x²(x " + (a < 0 ? "− " + -a : "+ " + a) + ") ; puis − " + b * b + "x " + (a < 0 ? "+ " : "− ") + Math.abs(a * b * b) + " = −" + b * b + "(x " + (a < 0 ? "− " + -a : "+ " + a) + ").", "Mets (x " + (a < 0 ? "− " + -a : "+ " + a) + ") en évidence, puis factorise x² − " + b * b + "."],
        M("x^2(x" + sgn(a) + ") - " + b * b + "(x" + sgn(a) + ") = (x" + sgn(a) + ")(x - " + b + ")(x + " + b + ") = 0") + " : " + M("S = \\{" + S.join(" \\,;\\, ") + "\\}") + ". a) " + M(S[0]) + ". b) " + M(S[2]) + ". c) " + M(-a) + "."));
    });
  TAGALL("eqspec", [[/Programme/, "programme"]]);
  ADDX("eqspec",
    () => { /* deux tarifs qui sont en fait identiques */
      let F, m, k; do { m = ri(8, 15); k = pk([2, 3, 4]); F = 5 * ri(4, 12); } while (F % k !== 0);
      const n = ri(3, 10), sal = pk(["salle de sport", "salle d'escalade", "école de danse"]);
      return CXP("tarifs", P("Une " + sal + " propose deux formules pour " + M("n") + " mois : formule A, " + M(F + " + " + k * m + "n") + " CHF ; formule B, " + M(k + "(" + m + "n + " + F / k + ")") + " CHF.",
        [["a) Prix de la formule A pour " + n + " mois (CHF)", F + k * m * n], ["b) Prix de la formule B pour " + n + " mois (CHF)", F + k * m * n], ["c) Pour combien de durées de 1 à 12 mois les deux formules coûtent-elles autant ?", 12]],
        ["Développe la formule B, puis compare-la à la formule A.", "Une égalité vraie pour tout n : toutes les durées conviennent."],
        "a) " + M(F + " + " + k * m + " \\cdot " + n + " = " + (F + k * m * n)) + " CHF. b) " + M(k + "(" + m * n + " + " + F / k + ") = " + (F + k * m * n)) + " CHF. c) " + M(k + "(" + m + "n + " + F / k + ") = " + F + " + " + k * m + "n") + " pour tout n : les 12 durées."));
    },
    () => { /* périmètre impossible */
      let a, b, c, v; do { a = ri(2, 9); b = ri(1, 8); c = ri(5, 30); v = ri(4, 12); } while (c === 2 * (a + b) || a === b);
      return CXP("perimetre", P("Un rectangle a pour côtés " + M("x + " + a) + " cm et " + M("x + " + b) + " cm. Tom affirme que son périmètre peut valoir " + M("4x + " + c) + " cm.",
        [["a) Périmètre du rectangle pour " + M("x = " + v) + " (cm)", 4 * v + 2 * (a + b)], ["b) Valeur de " + M("4x + " + c) + " pour " + M("x = " + v), 4 * v + c], ["c) Combien de valeurs de x donnent " + M("P = 4x + " + c) + " ?", 0]],
        ["P = 2(x + " + a + ") + 2(x + " + b + ") : développe et réduis.", "Résous 4x + " + 2 * (a + b) + " = 4x + " + c + " : que reste-t-il après avoir soustrait 4x ?"],
        "a) " + M("P = 4x + " + 2 * (a + b)) + ", pour " + M("x = " + v) + " : " + M(4 * v + 2 * (a + b)) + " cm. b) " + M(4 * v + c) + ". c) " + M(2 * (a + b) + " = " + c) + " est faux : aucune valeur, donc 0."));
    });
  ADD("absval", "route",
    () => { /* tolérance d'usinage */
      let L0, e, ms; do { L0 = ri(20, 80); e = pk([0.2, 0.3, 0.4, 0.5]); ms = Array.from({ length: 5 }, () => r2c(L0 + R.nz(-9, 9) / 10)); } while (new Set(ms).size < 5 || ms.some((m) => Math.abs(Math.abs(m - L0) - e) < 1e-9));
      const ok = ms.filter((m) => Math.abs(m - L0) <= e + 1e-9).length, obj = pk(["Une vis", "Un axe de trottinette", "Une tige métallique"]);
      return CXP("tolerance", P(obj + " doit mesurer " + M(L0) + " mm avec une tolérance de " + M(D(e)) + " mm : sa longueur " + M("x") + " doit vérifier " + M("|x - " + L0 + "| \\leq " + D(e)) + ". On a mesuré cinq pièces : " + ms.map((m) => M(D(m))).join(" ; ") + " mm.",
        [["a) Plus petite longueur acceptée (mm)", r2c(L0 - e)], ["b) Plus grande longueur acceptée (mm)", r2c(L0 + e)], ["c) Combien des cinq pièces sont acceptées ?", ok]],
        ["|x − " + L0 + "| est la distance entre x et " + L0 + " : elle doit être au plus " + T(e) + ".", "c) Calcule l'écart de chaque pièce à " + L0 + " mm."],
        "a) " + M(L0 + " - " + D(e) + " = " + D(r2c(L0 - e))) + " mm. b) " + M(L0 + " + " + D(e) + " = " + D(r2c(L0 + e))) + " mm. c) " + M(ok) + " pièce" + (ok > 1 ? "s" : "") + " entre ces deux bornes."));
    },
    () => { /* point deux fois plus proche d'un arrêt que de l'autre */
      let a, b; do { a = ri(2, 40); b = a + 3 * ri(2, 12); } while (false);
      const x1 = (a + 2 * b) / 3, x2 = 2 * b - a;
      return CXP("bus", P("Sur une route droite, l'arrêt de bus A est au kilomètre " + M(a) + " et l'arrêt B au kilomètre " + M(b) + ". On cherche les points (kilomètre " + M("x") + ") deux fois plus éloignés de A que de B : " + M("|x - " + a + "| = 2|x - " + b + "|") + ".",
        [["a) Solution située entre A et B (km)", x1], ["b) Solution située au-delà de B (km)", x2], ["c) Distance entre ces deux points (km)", x2 - x1]],
        ["Entre A et B : x − " + a + " = 2(" + b + " − x). Au-delà de B : x − " + a + " = 2(x − " + b + ").", "Avant A, il n'y a pas de solution : on y est toujours plus près de A que de B."],
        "a) " + M("x - " + a + " = " + 2 * b + " - 2x \\iff 3x = " + (a + 2 * b) + " \\iff x = " + x1) + ". b) " + M("x - " + a + " = 2x - " + 2 * b + " \\iff x = " + x2) + ". c) " + M(x2 + " - " + x1 + " = " + (x2 - x1)) + " km."));
    });
  ADD("ineq2", "rectangle",
    () => { /* balle au-dessus d'une hauteur */
      let t1, t2; do { t1 = ri(1, 3); t2 = ri(t1 + 1, 6); } while (t1 + t2 > 8);
      const v = 5 * (t1 + t2), H = 5 * t1 * t2, s = (t1 + t2) / 2;
      return CXP("balle", P("Une balle lancée vers le haut depuis le sol a une hauteur " + M("h(t) = " + v + "t - 5t^2") + " (m, " + M("t") + " en s). Un drone filme la balle quand elle est à au moins " + M(H) + " m.",
        [["a) Début de la période filmée (s)", t1], ["b) Fin de la période filmée (s)", t2], ["c) Hauteur maximale de la balle (m)", v * s - 5 * s * s]],
        ["Résous " + v + "t − 5t² ≥ " + H + " : ramène tout d'un côté et divise par −5 (le sens change).", "t² − " + (t1 + t2) + "t + " + t1 * t2 + " ≤ 0 : factorise ; un produit est négatif entre ses zéros. La hauteur est maximale au milieu."],
        M(v + "t - 5t^2 \\geq " + H + " \\iff t^2 - " + (t1 + t2) + "t + " + t1 * t2 + " \\leq 0 \\iff (t - " + t1 + ")(t - " + t2 + ") \\leq 0") + " : " + M("t \\in [" + t1 + " ; " + t2 + "]") + ". c) " + M("h(" + D(s) + ") = " + D(v * s - 5 * s * s)) + " m."));
    },
    () => { /* prix de vente : recette au moins R0 */
      let b, p1, p2; do { b = pk([2, 4, 5, 10]); p1 = ri(5, 20); p2 = ri(p1 + 4, 45); } while ((p1 + p2) % 2 !== 0);
      const N = b * (p1 + p2), R0 = b * p1 * p2, pm = (p1 + p2) / 2, obj = pk(["des gourdes", "des billets de tombola", "des sweat-shirts"]);
      return CXP("recette", P("Un club vend " + obj + ". Au prix de " + M("p") + " CHF, il en vend " + M(N + " - " + b + "p") + ". Il veut une recette d'au moins " + M(nb(R0)) + " CHF.",
        [["a) Prix minimal possible (CHF)", p1], ["b) Prix maximal possible (CHF)", p2], ["c) Recette au prix " + M(pm) + " CHF (la plus grande possible)", pm * (N - b * pm)]],
        ["Recette : p(" + N + " − " + b + "p) ≥ " + nbT(R0) + ". Ramène tout d'un côté et divise par −" + b + " (le sens change).", "p² − " + (p1 + p2) + "p + " + p1 * p2 + " ≤ 0 : factorise ; le produit est négatif entre les zéros."],
        M("p(" + N + " - " + b + "p) \\geq " + nb(R0) + " \\iff p^2 - " + (p1 + p2) + "p + " + p1 * p2 + " \\leq 0 \\iff (p - " + p1 + ")(p - " + p2 + ") \\leq 0") + " : " + M("p \\in [" + p1 + " ; " + p2 + "]") + ". c) " + M(pm + " \\cdot " + (N - b * pm) + " = " + nb(pm * (N - b * pm))) + " CHF."));
    });
  const ENS = (cx, intro, A, B, un, wA, wB) => { const [a, b] = A, [c, d] = B, inA = (n) => n >= a && n < b, inB = (n) => n > c && n <= d, cnt = (f) => cntInt(f, -50, 50);
    return CXP(cx, P(intro, [["a) Combien " + un + " " + wA + " ?", cnt(inA)], ["b) Combien " + un + " " + wA + " et " + wB + " ?", cnt((n) => inA(n) && inB(n))], ["c) Combien " + un + " " + wA + " ou " + wB + " ?", cnt((n) => inA(n) || inB(n))], ["d) Combien " + un + " " + wA + " mais pas " + wB + " ?", cnt((n) => inA(n) && !inB(n))]],
      ["Traduis chaque condition par un intervalle : A = [" + a + " ; " + b + "[, B = ]" + c + " ; " + d + "]. Attention aux crochets (borne comprise ou non).", "« et » : intersection A ∩ B ; « ou » : réunion A ∪ B ; « mais pas » : A \\ B."],
      "A = " + M("[" + a + " ; " + b + "[") + ", B = " + M("]" + c + " ; " + d + "]") + ". a) " + M(cnt(inA)) + ". b) " + M(cnt((n) => inA(n) && inB(n))) + ". c) " + M(cnt((n) => inA(n) || inB(n))) + ". d) " + M(cnt((n) => inA(n) && !inB(n))) + ".")); };
  ADD("ensembles", "intervalles",
    () => { let a, b, c, d; do { a = ri(6, 10); b = ri(12, 17); c = ri(a + 1, b - 2); d = ri(b + 1, 22); } while (false);
      return ENS("horaires", "Un magasin est ouvert de " + a + " h (compris) à " + b + " h (non compris) ; Léo est libre après " + c + " h (non compris) et jusqu'à " + d + " h (compris). On ne considère que les heures pile.", [a, b], [c, d], "d'heures entières", "où le magasin est ouvert", "où Léo est libre"); },
    () => { let a, b, c, d; do { a = ri(6, 12); b = ri(15, 20); c = ri(a + 1, b - 2); d = ri(b + 1, 30); } while (false);
      return ENS("ages", "Un camp de vacances accepte les jeunes de " + a + " ans (compris) à " + b + " ans (non compris). Le tarif « jeune adulte » s'applique au-delà de " + c + " ans (non compris) et jusqu'à " + d + " ans (compris).", [a, b], [c, d], "d'âges entiers", "acceptés au camp", "au tarif « jeune adulte »"); });
  ADD("trinfact", "benefice",
    () => { /* jet d'eau d'une fontaine */
      let k, p, q; do { k = pk([0.5, 1, 2]); p = pk([1, 2]); q = ri(3, 9); } while (k * p * q > 3 || k * p * q < 1);
      const s = (q - p) / 2, hm = k * (s + p) * (q - s);
      return CXP("jet", P("Un jet d'eau sort d'un bec placé à " + M(D(k * p * q)) + " m du sol. À la distance horizontale " + M("x") + " (m) du bec, sa hauteur vaut " + M("h(x) = " + (k === 1 ? "-" : "-" + D(k)) + "x^2 + " + D(k * (q - p)) + "x + " + D(k * p * q)) + " (m).",
        [["a) À quelle distance du bec l'eau touche-t-elle le sol (m) ?", q], ["b) Distance du bec où le jet est le plus haut (m)", s], ["c) Hauteur maximale du jet (m)", hm]],
        ["Mets " + (k === 1 ? "−1" : "−" + T(k)) + " en évidence, puis factorise le trinôme x² − " + (q - p) + "x − " + p * q + " (produit −" + p * q + ", somme " + (q - p) + ").", "Garde le zéro positif. Le sommet est au milieu des deux zéros."],
        M("h(x) = -" + (k === 1 ? "" : D(k)) + "(x^2 - " + (q - p) + "x - " + p * q + ") = -" + (k === 1 ? "" : D(k)) + "(x + " + p + ")(x - " + q + ")") + ". a) " + M(q) + " m (" + M(-p) + " est derrière le bec). b) " + M("\\frac{-" + p + " + " + q + "}{2} = " + D(s)) + " m. c) " + M("h(" + D(s) + ") = " + D(hm)) + " m."));
    },
    () => { /* signe d'un trinôme */
      let k, p, q, m; do { k = pk([2, 3, 4, 5]); p = R.nz(-6, 4); q = ri(p + 2, 9); m = R.nz(-8, 8); } while (q === 0 || p + q === 0 || m === p || m === q);
      return CXP("signe", P("On considère " + M("P(x) = " + k + "x^2" + sgn(-k * (p + q)) + "x" + sgn(k * p * q)) + ".",
        [["a) Somme des zéros de " + M("P"), p + q], ["b) Combien d'entiers " + M("x") + " vérifient " + M("P(x) < 0") + " ?", q - p - 1], ["c) " + M("P(" + m + ")"), k * (m - p) * (m - q)]],
        ["Mets " + k + " en évidence, puis factorise : deux nombres de produit " + p * q + " et de somme " + (p + q) + ".", "k > 0 : P(x) est négatif seulement ENTRE ses zéros (exclus)."],
        M("P(x) = " + k + "(x" + sgn(-p) + ")(x" + sgn(-q) + ")") + ". a) " + M(p + " + " + pr(q) + " = " + (p + q)) + ". b) Entre " + M(p) + " et " + M(q) + " exclus : " + M(q - p - 1) + ". c) " + M(k + " \\cdot " + pr(m - p) + " \\cdot " + pr(m - q) + " = " + k * (m - p) * (m - q)) + "."));
    });
  const MODA = (cx, lieu, unite, carte, illim) => { let pA, pB, n1, FB, FC, s, best;
    do { pA = ri(12, 25); pB = ri(5, pA - 4); n1 = ri(6, 18); FB = (pA - pB) * n1; FC = 10 * ri(Math.ceil((FB + pB * (n1 + 4)) / 10), 120); s = (FC - FB) / pB; best = cntInt((n) => FB + pB * n < pA * n && FB + pB * n < FC, 1, 50); }
    while (Number.isInteger(s) || s > 45 || s < n1 + 4);
    return CXP(cx, P(lieu + ". Offre A : " + M(pA) + " CHF " + unite + ". Offre B : " + carte + " à " + M(FB) + " CHF, puis " + M(pB) + " CHF " + unite + ". Offre C : " + illim + " à " + M(FC) + " CHF par an.",
      [["a) Nombre de " + (unite === "la séance" ? "séances" : "entrées") + " pour lequel A et B coûtent la même chose", n1], ["b) À partir de combien de " + (unite === "la séance" ? "séances" : "entrées") + " C est-elle strictement moins chère que B ?", Math.floor(s) + 1], ["c) Pour combien de nombres de " + (unite === "la séance" ? "séances" : "entrées") + " de 1 à 50 l'offre B est-elle strictement la moins chère des trois ?", best]],
      ["Coûts pour n : A(n) = " + pA + "n, B(n) = " + FB + " + " + pB + "n, C(n) = " + FC + ". Pour a) résous A(n) = B(n).", "b) " + FB + " + " + pB + "n > " + FC + ". c) B est la moins chère après le croisement avec A et avant le croisement avec C."],
      "a) " + M(pA + "n = " + FB + " + " + pB + "n \\iff n = " + n1) + ". b) " + M("n > \\frac{" + (FC - FB) + "}{" + pB + "} \\approx " + D(r2c(s))) + " : dès " + M(Math.floor(s) + 1) + ". c) De " + M(n1 + 1) + " à " + M(Math.floor(s)) + " : " + M(best) + " valeurs.")); };
  ADD("modaff", "piscine",
    () => MODA("cinema", "Cinéma", "la séance", "carte de fidélité", "abonnement illimité"),
    () => MODA("escalade", "Salle d'escalade", "l'entrée", "carte de membre", "abonnement illimité"));
  ADD("geocomb", "tente",
    () => { /* rampe de skate : prisme à base triangle rectangle */
      const [u, v, w] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = pk([0.1, 0.2]), h = r2c(u * k), Lh = r2c(v * k), Lr = r2c(w * k), l = pk([1.2, 1.5, 2]);
      return CXP("rampe", P("Une rampe de skate pleine a la forme d'un prisme droit couché : sa face latérale est un triangle rectangle de hauteur " + M(D(h) + " \\text{ m}") + " et de longueur au sol " + M(D(Lh) + " \\text{ m}") + ". La rampe est large de " + M(D(l) + " \\text{ m}") + ".",
        [["a) Longueur de la pente (m)", Lr], ["b) Volume de la rampe (m³, au centième)", r2c((h * Lh * l) / 2), 0.01], ["c) Aire de la surface de roulement (m², au centième)", r2c(Lr * l), 0.01]],
        ["La pente est l'hypoténuse du triangle : Pythagore.", "Volume d'un prisme : aire du triangle · largeur. La surface de roulement est un rectangle : pente · largeur."],
        "a) " + M("\\sqrt{" + D(h) + "^2 + " + D(Lh) + "^2} = " + D(Lr)) + " m. b) " + M("\\frac{" + D(h) + " \\cdot " + D(Lh) + "}{2} \\cdot " + D(l) + " \\approx " + D(r2c((h * Lh * l) / 2))) + " m³. c) " + M(D(Lr) + " \\cdot " + D(l) + " = " + D(r2c(Lr * l))) + " m²."));
    },
    () => { /* abri de jardin : pavé et toit à deux pans */
      let u, v, w, k, l; do { [u, v, w] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); k = pk([0.1, 0.2, 0.25]); l = r2c(2 * v * k); } while (l > 3.5 || l < 1.2);
      const hT = r2c(u * k), pan = r2c(w * k), L = pk([2, 2.5, 3]), H = pk([1.8, 2, 2.2]);
      const V = l * L * H + (l * hT * L) / 2;
      return CXP("abri", P("Un abri de jardin est un pavé de " + M(D(L) + " \\text{ m}") + " de long, " + M(D(l) + " \\text{ m}") + " de large et " + M(D(H) + " \\text{ m}") + " de haut, surmonté d'un toit à deux pans égaux dont le faîte est à " + M(D(hT) + " \\text{ m}") + " au-dessus des murs.",
        [["a) Largeur d'un pan du toit (m)", pan], ["b) Volume de l'abri (m³, au centième)", r2c(V), 0.01], ["c) Surface du toit (m², au centième)", r2c(2 * pan * L), 0.01]],
        ["La façade du toit est un triangle isocèle : sa hauteur le coupe en deux triangles rectangles de base " + T(l / 2) + " m.", "Volume : pavé + prisme (triangle de base " + T(l) + " m et de hauteur " + T(hT) + " m, sur " + T(L) + " m). Toit : deux rectangles."],
        "a) " + M("\\sqrt{" + D(l / 2) + "^2 + " + D(hT) + "^2} = " + D(pan)) + " m. b) " + M(D(l) + " \\cdot " + D(L) + " \\cdot " + D(H) + " + \\frac{" + D(l) + " \\cdot " + D(hT) + "}{2} \\cdot " + D(L) + " \\approx " + D(r2c(V))) + " m³. c) " + M("2 \\cdot " + D(pan) + " \\cdot " + D(L) + " = " + D(r2c(2 * pan * L))) + " m²."));
    });
  ADD("trigrel", "perimetre",
    () => { /* sinus donné, hypoténuse connue */
      const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = ri(2, 6), sw = R.rand() < 0.5, o = sw ? q : p, a = sw ? p : q;
      return CXP("sinus", P("Dans un triangle rectangle d'hypoténuse " + M(k * r) + " cm, un angle aigu " + M("\\alpha") + " vérifie " + M("\\sin\\alpha = \\frac{" + o + "}{" + r + "}") + ".",
        [["a) " + M("\\cos\\alpha") + " (fraction)", a / r], ["b) " + M("\\tan\\alpha") + " (fraction)", o / a], ["c) Aire du triangle (cm²)", (k * o * k * a) / 2]],
        ["sin²α + cos²α = 1, et α est aigu (cosinus positif).", "Côté opposé = hypoténuse · sin α ; côté adjacent = hypoténuse · cos α."],
        "a) " + M("\\cos\\alpha = \\sqrt{1 - \\frac{" + o * o + "}{" + r * r + "}} = \\frac{" + a + "}{" + r + "}") + ". b) " + M("\\tan\\alpha = \\frac{" + o + "}{" + a + "}") + ". c) Côtés " + M(k * o) + " et " + M(k * a) + " cm : " + M("\\frac{" + k * o + " \\cdot " + k * a + "}{2} = " + (k * o * k * a) / 2) + " cm²."));
    },
    () => { /* échelle : cosinus donné */
      const [p, q, r] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), L = pk([2.5, 3, 4, 5, 6]), c = Math.min(p, q), s = Math.max(p, q);
      return CXP("echelle", P("Une échelle de " + M(D(L) + " \\text{ m}") + " est appuyée contre un mur vertical. L'angle " + M("\\alpha") + " qu'elle fait avec le sol vérifie " + M("\\cos\\alpha = \\frac{" + c + "}{" + r + "}") + ".",
        [["a) " + M("\\sin\\alpha") + " (fraction)", s / r], ["b) Distance entre le pied de l'échelle et le mur (m, au centième)", r2c((L * c) / r), 0.01], ["c) Hauteur atteinte sur le mur (m, au centième)", r2c((L * s) / r), 0.01]],
        ["sin²α + cos²α = 1, et α est aigu.", "Le pied est le côté adjacent : L · cos α ; la hauteur est le côté opposé : L · sin α."],
        "a) " + M("\\sin\\alpha = \\frac{" + s + "}{" + r + "}") + ". b) " + M(D(L) + " \\cdot \\frac{" + c + "}{" + r + "} \\approx " + D(r2c((L * c) / r))) + " m. c) " + M(D(L) + " \\cdot \\frac{" + s + "}{" + r + "} \\approx " + D(r2c((L * s) / r))) + " m."));
    });
  ADD("racinv", "intersection",
    () => { /* partage d'une somme */
      let n, k, S; do { n = ri(3, 8); k = pk([1, 2]); S = 10 * ri(3, 30); } while ((S / n) % 1 || (S / (n + k)) % 1 || S / n - S / (n + k) < 2);
      const d = S / n - S / (n + k), obj = pk(["la location d'un minibus pour une sortie", "une pizza géante et des boissons", "un cadeau d'anniversaire"]);
      return CXP("partage", P("Des amis se partagent équitablement " + obj + ", qui coûte " + M(S) + " CHF. Si " + (k === 1 ? "une personne de plus participait" : "deux personnes de plus participaient") + ", chacun paierait " + M(d) + " CHF de moins. On note " + M("x") + " le nombre d'amis : " + M("\\frac{" + S + "}{x} - \\frac{" + S + "}{x + " + k + "} = " + d) + ".",
        [["a) Nombre d'amis", n], ["b) Part de chacun (CHF)", S / n], ["c) Part de chacun avec " + (k === 1 ? "une personne" : "deux personnes") + " de plus (CHF)", S / (n + k)]],
        ["Multiplie les deux membres par x(x + " + k + ") (x > 0).", "Tu obtiens une équation du 2e degré : garde la solution entière positive."],
        M(S + "(x + " + k + ") - " + S + "x = " + d + "x(x + " + k + ") \\iff " + d + "x^2 + " + d * k + "x - " + S * k + " = 0") + ". a) " + M(n) + " amis. b) " + M(S + " \\div " + n + " = " + S / n) + " CHF. c) " + M(S + " \\div " + (n + k) + " = " + S / (n + k)) + " CHF."));
    },
    () => { /* rectangle d'aire donnée */
      let w, L; do { w = ri(3, 12); L = ri(w + 2, 25); } while (false);
      const A = w * L, Pp = 2 * (w + L);
      return CXP("rectangle", P("Un rectangle a une aire de " + M(A) + " m² et un périmètre de " + M(Pp) + " m. On note " + M("x") + " sa largeur : sa longueur vaut " + M("\\frac{" + A + "}{x}") + ".",
        [["a) Largeur (m)", w], ["b) Longueur (m)", L], ["c) Longueur d'un rectangle de même aire et de largeur " + (w + 1) + " m (fraction)", A / (w + 1)]],
        ["2x + 2 · " + A + "/x = " + Pp + " : multiplie par x (x > 0).", "x² − " + Pp / 2 + "x + " + A + " = 0 : la largeur est la plus petite solution."],
        M("2x + \\frac{" + 2 * A + "}{x} = " + Pp + " \\iff x^2 - " + Pp / 2 + "x + " + A + " = 0 \\iff (x - " + w + ")(x - " + L + ") = 0") + ". a) " + M(w) + " m. b) " + M(L) + " m. c) " + M(frac(A, w + 1)) + " m."));
    });
  ADD("ratden", "conjugue",
    () => { /* triangle rectangle isocèle */
      const a = pk([4, 6, 8, 10, 12, 14]);
      return CXP("isocele", P("Un triangle rectangle isocèle a une hypoténuse de " + M(a) + " cm. Ses côtés de l'angle droit mesurent " + M("\\frac{" + a + "}{\\sqrt{2}}") + " cm.",
        [["a) Côté de l'angle droit, sans racine au dénominateur : " + M("k\\sqrt{2}") + ". Que vaut " + M("k") + " ?", a / 2], ["b) Aire du triangle (cm²)", (a * a) / 4], ["c) Périmètre (cm, au centième)", r2c(a + a * Math.SQRT2), 0.01]],
        ["Multiplie le numérateur et le dénominateur par √2.", "Aire = côté · côté ÷ 2 ; périmètre = hypoténuse + deux côtés."],
        "a) " + M("\\frac{" + a + "\\sqrt{2}}{2} = " + a / 2 + "\\sqrt{2}") + " : " + M("k = " + a / 2) + ". b) " + M("\\frac{(" + a / 2 + "\\sqrt{2})^2}{2} = " + (a * a) / 4) + " cm². c) " + M(a + " + " + a + "\\sqrt{2} \\approx " + D(r2c(a + a * Math.SQRT2))) + " cm."));
    },
    () => { /* inverse par le conjugué */
      const [p, q] = pk([[2, 3], [3, 8], [4, 15], [5, 24], [6, 35]]);
      return CXP("inverse", P("On pose " + M("x = " + p + " + \\sqrt{" + q + "}") + ".",
        [["a) " + M("(" + p + " + \\sqrt{" + q + "})(" + p + " - \\sqrt{" + q + "})"), p * p - q], ["b) " + M("x + \\frac{1}{x}"), 2 * p], ["c) " + M("x^2 + \\frac{1}{x^2}"), 4 * p * p - 2]],
        ["(a + b)(a − b) = a² − b². Donc 1/x = " + p + " − √" + q + " : multiplie le numérateur et le dénominateur de 1/x par le conjugué.", "c) Élève x + 1/x au carré : (x + 1/x)² = x² + 2 + 1/x²."],
        "a) " + M(p * p + " - " + q + " = " + (p * p - q)) + ", donc " + M("\\frac{1}{x} = " + p + " - \\sqrt{" + q + "}") + ". b) " + M(p + " + \\sqrt{" + q + "} + " + p + " - \\sqrt{" + q + "} = " + 2 * p) + ". c) " + M(2 * p + "^2 - 2 = " + (4 * p * p - 2)) + "."));
    });
  const MORC = (cx, intro, unit) => { let B, h0, p, Mx, tM, t1, Bud;
    do { B = ri(3, 8); h0 = pk([1, 2]); p = pk([1.5, 2, 2.5, 3]); Mx = ri(18, 35); tM = Math.ceil(h0 + (Mx - B) / p - 1e-9); t1 = ri(h0 + 2, tM - 1); Bud = ri(B + 4, Mx - 2); }
    while (tM - h0 < 4 || Number.isInteger((Mx - B) / p) || Number.isInteger((Bud - B) / p) || t1 <= h0 || tM > 10);
    const pr1 = B + p * (t1 - h0), hb = h0 + Math.floor((Bud - B) / p + 1e-9);
    return CXP(cx, P(intro + " coûte " + M(B) + " CHF pour " + (h0 === 1 ? "la première heure" : "les " + h0 + " premières heures") + " (ou moins), puis " + M(CHF(p)) + " CHF par heure supplémentaire commencée, avec un maximum de " + M(Mx) + " CHF par " + unit + ".",
      [["a) Prix pour " + t1 + " heures (CHF)", pr1], ["b) À partir de combien d'heures paie-t-on le maximum ?", tM], ["c) Avec " + Bud + " CHF, combien d'heures entières peut-on garder la location au plus ?", hb]],
      ["Pour t heures (t > " + h0 + ") : prix = " + B + " + " + CHFT(p) + " · (t − " + h0 + "), sans dépasser " + Mx + " CHF.", "b) Résous " + B + " + " + CHFT(p) + "(t − " + h0 + ") ≥ " + Mx + ". c) " + B + " + " + CHFT(p) + "(t − " + h0 + ") ≤ " + Bud + "."],
      "a) " + M(B + " + " + CHF(p) + " \\cdot " + (t1 - h0) + " = " + CHF(pr1)) + " CHF. b) " + M("t - " + h0 + " \\geq \\frac{" + (Mx - B) + "}{" + CHF(p) + "} \\approx " + D(r2c((Mx - B) / p))) + " : dès " + M(tM) + " h. c) " + M("t - " + h0 + " \\leq \\frac{" + (Bud - B) + "}{" + CHF(p) + "} \\approx " + D(r2c((Bud - B) / p))) + " : " + M(hb) + " h.")); };
  ADD("morceaux", "parking",
    () => MORC("kayak", "La location d'un kayak", "jour"),
    () => MORC("velo", "La location d'un vélo électrique", "jour"));
  ADD("f2", ["recette", "enclos"],
    () => { /* fusée à eau */
      const v = 5 * ri(3, 6), h0 = pk([0.5, 1, 1.5]);
      const ts = v / 10, hm = h0 + (v * v) / 20, t1 = pk([1, 2]);
      return CXP("fusee", P("Une fusée à eau est lancée verticalement depuis une rampe de " + M(D(h0) + " \\text{ m}") + ". Sa hauteur vaut " + M("h(t) = -5t^2 + " + v + "t + " + D(h0)) + " (m, " + M("t") + " en s).",
        [["a) Instant où elle est au plus haut (s)", ts], ["b) Hauteur maximale (m)", hm], ["c) Hauteur après " + t1 + " s (m)", -5 * t1 * t1 + v * t1 + h0]],
        ["Le sommet d'une parabole y = at² + bt + c est en t = −b ÷ (2a).", "b) Calcule h au sommet. c) Remplace t par " + t1 + "."],
        "a) " + M("t = \\frac{-" + v + "}{2 \\cdot (-5)} = " + D(ts)) + " s. b) " + M("h(" + D(ts) + ") = " + D(hm)) + " m. c) " + M("h(" + t1 + ") = " + D(-5 * t1 * t1 + v * t1 + h0)) + " m."));
    });
  ADD("euclide", ["hauteur", "cathete"],
    () => { /* charpente : deux segments de l'hypoténuse connus */
      let p, q, k; do { [p, q] = pk([[1, 4], [4, 9], [1, 9], [9, 16], [4, 25], [1, 16]]); k = pk([20, 30, 40, 50]); } while ((p + q) * k > 1000);
      const P1 = p * k, Q1 = q * k, H = Math.sqrt(p * q) * k, c = (p + q) * k;
      return CXP("charpente", P("Dans une charpente, la poutre " + M("[AB]") + " de " + M(nb(c)) + " cm est l'hypoténuse d'un triangle " + M("ABC") + " rectangle en " + M("C") + ". Le poteau " + M("[CH]") + " est perpendiculaire à " + M("[AB]") + ", avec " + M("AH = " + P1) + " cm et " + M("HB = " + Q1) + " cm.",
        [["a) Hauteur " + M("CH") + " (cm)", H], ["b) Longueur " + M("AC") + " (cm, au dixième)", r1(Math.sqrt(P1 * c)), 0.1], ["c) Longueur " + M("BC") + " (cm, au dixième)", r1(Math.sqrt(Q1 * c)), 0.1]],
        ["Théorème de la hauteur : CH² = AH · HB.", "Théorème d'Euclide : AC² = AH · AB et BC² = HB · AB."],
        "a) " + M("\\sqrt{" + P1 + " \\cdot " + Q1 + "} = " + H) + " cm. b) " + M("\\sqrt{" + P1 + " \\cdot " + nb(c) + "} \\approx " + D(r1(Math.sqrt(P1 * c)))) + " cm. c) " + M("\\sqrt{" + Q1 + " \\cdot " + nb(c) + "} \\approx " + D(r1(Math.sqrt(Q1 * c)))) + " cm."));
    });
  ADD("trigo", ["elevation", "rampe"],
    () => { /* cerf-volant au bout de son fil */
      let L, al, H; do { L = 10 * ri(3, 10); al = ri(25, 65); H = ri(10, Math.floor(L * 0.9)); } while (Math.abs(L * Math.sin(rad(al)) - H) < 3 || H / L > 0.9);
      const m = pk([1, 1.5]), h = m + L * Math.sin(rad(al)), dx = L * Math.cos(rad(al)), be = deg(Math.asin((H - m) / L));
      return CXP("cerfvolant", P("Lina tient le fil tendu de son cerf-volant à " + M(D(m) + " \\text{ m}") + " du sol. Le fil mesure " + M(L + " \\text{ m}") + " et fait un angle de " + M(al + "°") + " avec l'horizontale.",
        [["a) Hauteur du cerf-volant au-dessus du sol (m, au dixième)", r1(h), 0.1], ["b) Distance horizontale entre Lina et le cerf-volant (m, au dixième)", r1(dx), 0.1], ["c) Angle nécessaire pour que le cerf-volant soit à " + H + " m du sol, avec le même fil (°, au dixième)", r1(be), 0.1]],
        ["Le fil est l'hypoténuse d'un triangle rectangle : côté vertical = L · sin(angle), côté horizontal = L · cos(angle). N'oublie pas la hauteur de la main.", "c) sin(angle) = (" + H + " − " + T(m) + ") ÷ " + L + ", puis la touche sin⁻¹."],
        "a) " + M(D(m) + " + " + L + " \\cdot \\sin(" + al + "°) \\approx " + D(r1(h))) + " m. b) " + M(L + " \\cdot \\cos(" + al + "°) \\approx " + D(r1(dx))) + " m. c) " + M("\\sin\\beta = \\frac{" + D(H - m) + "}{" + L + "}") + ", " + M("\\beta \\approx " + D(r1(be)) + "°") + "."));
    });
  ADD("ineq", ["rectangle", "tarifs"],
    () => { /* moyenne de points à atteindre */
      let n, m, M0; do { n = ri(4, 9); m = ri(8, 22); M0 = m + ri(1, 3); } while ((n + 1) * M0 - n * m > 40 || ((n + 2) * M0 - n * m) / 2 > 35);
      const x1 = (n + 1) * M0 - n * m, x2 = Math.ceil(((n + 2) * M0 - n * m) / 2 - 1e-9), sp = pk(["Un basketteur", "Une basketteuse", "Une joueuse de handball", "Un joueur de handball"]);
      return CXP("moyenne", P(sp + " a marqué en moyenne " + M(m) + " points par match sur ses " + M(n) + " premiers matchs. " + (/^Une/.test(sp) ? "Elle" : "Il") + " vise une moyenne d'au moins " + M(M0) + " points.",
        [["a) Total des points marqués jusqu'ici", n * m], ["b) Nombre minimal de points au prochain match pour atteindre l'objectif", x1], ["c) S'il reste deux matchs avec le même score, nombre minimal de points par match", x2]],
        ["Moyenne = total ÷ nombre de matchs. Avec x points au prochain match : (" + n * m + " + x) ÷ " + (n + 1) + " ≥ " + M0 + ".", "c) (" + n * m + " + 2x) ÷ " + (n + 2) + " ≥ " + M0 + " : un nombre de points est entier, arrondis vers le haut."],
        "a) " + M(n + " \\cdot " + m + " = " + n * m) + ". b) " + M(n * m + " + x \\geq " + (n + 1) * M0 + " \\iff x \\geq " + x1) + ". c) " + M(n * m + " + 2x \\geq " + (n + 2) * M0 + " \\iff x \\geq " + D(((n + 2) * M0 - n * m) / 2)) + " : " + M(x2) + " points."));
    });
  ADD("f2expr", ["arche", "sommet"],
    () => { /* câble d'un pont suspendu */
      const d = 10 * ri(4, 15), h0 = ri(2, 8), H = h0 + 16 * ri(2, 5);
      const a = (H - h0) / (d * d), x1 = d / 2, y1 = r6(h0 + a * x1 * x1), x2 = 0.75 * d, y2 = r6(h0 + a * x2 * x2);
      return CXP("cable", P("Le câble d'un pont suspendu a la forme d'une parabole. Au milieu du pont, il est à " + M(h0 + " \\text{ m}") + " au-dessus de la route ; il est fixé au sommet de deux pylônes de " + M(H + " \\text{ m}") + ", à " + M(d + " \\text{ m}") + " de part et d'autre du milieu. On place l'origine sur la route, au milieu : " + M("y = ax^2 + " + h0) + ".",
        [["a) Coefficient " + M("a") + " (fraction)", a], ["b) Hauteur du câble à " + M(x1) + " m du milieu (m)", y1], ["c) À quelle distance du milieu le câble est-il à " + M(y2) + " m de haut (m) ?", x2]],
        ["Le point (" + d + " ; " + H + ") est sur la parabole : remplace x et y pour trouver a.", "c) Résous a·x² + " + h0 + " = la hauteur donnée, et garde la solution positive."],
        "a) " + M(H + " = a \\cdot " + d + "^2 + " + h0 + " \\iff a = \\frac{" + (H - h0) + "}{" + nb(d * d) + "}" + " = " + frac(H - h0, d * d)) + ". b) " + M("y = " + frac(H - h0, d * d) + " \\cdot " + x1 + "^2 + " + h0 + " = " + D(y1)) + " m. c) " + M("x = " + D(0.75 * d)) + " m."));
    });
  ADD("exactes", ["cube", "hexagone"],
    () => { /* triangle équilatéral : hauteur, aire, cercle inscrit */
      const a = pk([2, 4, 6, 8, 10, 12]);
      return CXP("equilateral", P("Un panneau de signalisation est un triangle équilatéral de " + M(a + " \\text{ dm}") + " de côté.",
        [["a) Hauteur du triangle (dm, valeur exacte)", RAD((a / 2) * Math.sqrt(3))], ["b) Aire du triangle (dm², valeur exacte)", RAD(((a * a) / 4) * Math.sqrt(3))], ["c) Rayon du cercle inscrit, au tiers de la hauteur (dm, valeur exacte)", RAD((a / 6) * Math.sqrt(3))]],
        ["La hauteur coupe le triangle en deux triangles rectangles d'hypoténuse " + a + " et de petit côté " + a / 2 + " : Pythagore.", "Aire = base · hauteur ÷ 2. Le centre du cercle inscrit est au tiers de la hauteur depuis la base."],
        "a) " + M("\\sqrt{" + a + "^2 - " + a / 2 + "^2} = \\sqrt{" + (3 * a * a) / 4 + "} = " + RSIMP(a / 2, 3)) + " dm. b) " + M("\\frac{" + a + " \\cdot " + RSIMP(a / 2, 3) + "}{2} = " + RSIMP((a * a) / 4, 3)) + " dm². c) " + M("\\frac{" + RSIMP(a / 2, 3) + "}{3}" + (a % 6 === 0 ? " = " + RSIMP(a / 6, 3) : "")) + " dm."));
    });
  ADD("f2trois", ["points", "falaise"],
    () => { /* flèche : trois mesures de hauteur */
      let a, h, k; do { a = -pk([0.005, 0.01, 0.02]); h = 10 * ri(2, 5); k = ri(4, 12); } while (k + a * h * h < 1 || [10, 20, 30].some((x) => a * (x - h) ** 2 + k <= 0.5));
      const f = (x) => r6(a * (x - h) ** 2 + k), c = f(0), xs = [10, 20, 30].map((x) => [x, f(x)]);
      return CXP("fleche", P("Une flèche tirée à l'arc suit une trajectoire parabolique " + M("y = ax^2 + bx + c") + " (" + M("x") + " : distance horizontale, " + M("y") + " : hauteur, en m). On mesure sa hauteur : " + xs.map(([x, y]) => M(D(y) + " \\text{ m}") + " à " + x + " m").join(", ") + ".",
        [["a) Coefficient " + M("a"), a], ["b) Hauteur de départ de la flèche (m)", c], ["c) Hauteur maximale (m)", k]],
        ["Trois points donnent un système de trois équations en a, b et c. Soustrais les équations deux à deux pour éliminer c.", "b) La hauteur de départ est y(0) = c. c) Sommet en x = −b ÷ (2a)."],
        M("a = " + D(a) + ", \; b = " + D(r6(-2 * a * h)) + ", \; c = " + D(c)) + ". a) " + M(D(a)) + ". b) " + M(D(c)) + " m. c) Sommet en " + M("x = " + h) + " : " + M(k) + " m."));
    });
  TAGALL("tradalg", [[/impairs consécutifs/, "impairs"], [/laisse un reste/, "reste"]]);
  ADDX("tradalg", () => { /* calendrier : carré de 2 × 2 dates */
    const n = ri(1, 23), S = 4 * n + 16, mo = pk(["mars", "mai", "octobre", "décembre"]);
    return CXP("calendrier", P("Sur la page de " + mo + " d'un calendrier (7 jours par ligne), on entoure un carré de quatre dates (2 × 2). Leur somme vaut " + M(S) + ". On note " + M("n") + " la date en haut à gauche.",
      [["a) Coefficient de n dans la somme des quatre dates", 4], ["b) Terme constant de cette somme", 16], ["c) Date en haut à gauche", n], ["d) Produit des dates de la diagonale (n + 1)(n + 7) moins produit de l'autre diagonale n(n + 8)", 7]],
      ["Les quatre dates sont n, n + 1 (à droite), n + 7 (en dessous) et n + 8.", "d) Développe les deux produits : les termes en n² et en n s'éliminent."],
      "a) et b) " + M("n + (n + 1) + (n + 7) + (n + 8) = 4n + 16") + ". c) " + M("4n + 16 = " + S + " \\iff n = " + n) + ". d) " + M("(n^2 + 8n + 7) - (n^2 + 8n) = 7") + ", quel que soit le carré.")); });
  TAGALL("contrex", [[/premier/, "premiers"], [/multiple de/, "multiples"]]);
  ADDX("contrex", () => { /* « 2n + 1 est toujours premier » */
    const N = ri(30, 60); let c = 0; for (let n = 1; n <= N; n++) { const v = 2 * n + 1; let pr = v > 1; for (let d = 2; d * d <= v; d++) if (v % d === 0) pr = false; if (!pr) c++; }
    return CXP("impairs", P("Conjecture d'Hugo : « pour tout entier n ≥ 1, 2n + 1 est un nombre premier ». Il l'a vérifiée pour n = 1, 2 et 3.",
      [["a) Plus petit contre-exemple n", 4], ["b) Combien de contre-exemples pour n de 1 à " + N + " ?", c], ["c) Valeur de 2n + 1 pour n = " + N, 2 * N + 1]],
      ["Calcule 2n + 1 pour n = 1, 2, 3, 4… et cherche un nombre qui n'est pas premier.", "b) 2n + 1 parcourt les impairs de 3 à " + (2 * N + 1) + " : compte ceux qui ne sont pas premiers."],
      "a) n = 4 : " + M("2 \\cdot 4 + 1 = 9 = 3 \\cdot 3") + " n'est pas premier. b) " + M(c) + " impairs non premiers entre 3 et " + M(2 * N + 1) + ". c) " + M(2 * N + 1) + ". Trois exemples ne prouvent rien ; un seul contre-exemple suffit à réfuter.")); });
  TAGALL("demoalg", [[/entiers consécutifs/, "consecutifs"], [/E = \(n/, "identite"]]);
  ADDX("demoalg", () => { /* nombre à deux chiffres et son renversé */
    let a, b; do { a = ri(1, 9); b = ri(1, 9); } while (a === b);
    const N = 10 * a + b, Rv = 10 * b + a;
    return CXP("renverse", P("On écrit un nombre à deux chiffres " + M("\\overline{ab} = 10a + b") + " et son renversé " + M("\\overline{ba}") + ". Exemple : " + M(N) + " et " + M(Rv) + ".",
      [["a) " + M(N + " + " + Rv), N + Rv], ["b) Plus grand entier qui divise toujours " + M("\\overline{ab} + \\overline{ba}"), 11], ["c) " + M(Math.max(N, Rv) + " - " + Math.min(N, Rv)), Math.abs(N - Rv)], ["d) Plus grand entier qui divise toujours la différence " + M("\\overline{ab} - \\overline{ba}"), 9]],
      ["Écris la somme et la différence avec a et b, puis réduis.", "(10a + b) + (10b + a) = 11a + 11b ; (10a + b) − (10b + a) = 9a − 9b."],
      "a) " + M(N + Rv) + ". b) " + M("11(a + b)") + " : 11. c) " + M(Math.abs(N - Rv)) + ". d) " + M("9(a - b)") + " : 9.")); });
  TAGALL("implication", [[/multiple de \d+, alors/, "multiples"], [/si n est pair/, "pair"]]);
  ADDX("implication", () => { /* carrés et multiples de 4 */
    const N = ri(20, 50); let c = 0, e = 0; for (let n = 1; n <= N; n++) { if (n % 2 === 0) e++; if (n % 4 === 2) c++; }
    return CXP("carres", P("Pour n entier de 1 à " + N + ", on étudie l'implication « si n² est un multiple de 4, alors n est un multiple de 4 ».",
      [["a) Combien de n de 1 à " + N + " ont un carré multiple de 4 ?", e], ["b) Plus petit contre-exemple n > 0", 2], ["c) Combien de contre-exemples de 1 à " + N + " ?", c]],
      ["(2k)² = 4k² : le carré d'un nombre pair est un multiple de 4 ; (2k + 1)² = 4k² + 4k + 1 ne l'est pas.", "Contre-exemple : n² multiple de 4 mais n pas multiple de 4, c'est-à-dire n pair et pas multiple de 4."],
      "a) Les " + M(e) + " nombres pairs. b) " + M("n = 2") + " : " + M("2^2 = 4") + ", mais 2 n'est pas un multiple de 4. c) Les nombres 2, 6, 10… : " + M(c) + ". L'implication est fausse ; sa réciproque est vraie.")); });
  /* ==== 26.11 soir (agent defisch3) : 2e–4e Collège et MP, défis à 3 contextes ====
     Gabarits existants étiquetés (ctx), deux contextes de plus par notion (un pour log et trigeq2), valeurs tirées,
     corrigé calculé, oracle par contexte dans tests/recalc_oracles.js (section « agent defisch3 »). Valeur attendue
     arrondie sur l'écriture décimale (RFIX) pour toutes les parties « au dixième », « au centième »… de ces notions, y
     compris les gabarits d'origine (avant : 4,615 au centième acceptait 4,61 et 4,62). Notions partagées avec la France
     (stats, statfreq, quartiles, cart, droites, droitesinter, 3e–4e Collège) : aucun lieu ni usage suisse. ==== */
  const r0 = (v) => Math.round(+(+v).toPrecision(12));
  const RFIX = (q) => { for (const p of q.parts || []) { const s = p.spec; if (s && s.kind === "value" && typeof s.round === "number" && s.round > 0 && isFinite(s.value)) s.value = +(Math.round(+(s.value / s.round).toPrecision(12)) * s.round).toFixed(10); } return q; };
  const shuf = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = ri(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const LST = (a) => M(a.map(D).join(" \\,;\\, "));
  const PT = (p) => "(" + p.map(D).join(" \\,;\\, ") + ")";
  const sum = (a) => a.reduce((u, v) => u + v, 0);
  const sdev = (a) => { const m = sum(a) / a.length; return Math.sqrt(sum(a.map((x) => (x - m) ** 2)) / a.length); };
  const QS = (s) => { const n = s.length, h = (n - 1) / 2; return [s[(h - 1) / 2], s[h], s[h + 1 + (h - 1) / 2]]; }; /* n = 11 ou 15 : Q1, médiane, Q3 */
  const NOM = () => pk(["Léa", "Noé", "Inès", "Hugo", "Chloé", "Nathan", "Lina", "Elias", "Maëlle", "Liam"]);

  /* ---------- MP 2e (et France 2nde–Tle) : statistiques ---------- */
  ADD("stats", "notes6",
    () => { /* notes sur 20 (profil France seulement ; la forme « notes6 » est écartée en France, HORS_FR) */
      let xs, Mg, need; do { xs = Array.from({ length: 5 }, () => ri(16, 36) / 2); Mg = pk([12, 13, 14, 15]); need = (7 * Mg - sum(xs)) / 2; } while (need < 8 || need > 20 || Math.abs(need * 10 - Math.round(need * 10)) > 1e-9 || new Set(xs).size < 4);
      const s = sum(xs), so = [...xs].sort((u, v) => u - v), nm = NOM();
      return Object.assign(CXP("notes20", P("Les notes de " + nm + " (sur 20) : " + LST(xs) + ". Le prochain contrôle compte double. Objectif : finir le trimestre avec une moyenne de " + M(Mg) + ".",
        [["a) Moyenne actuelle (au centième)", r2c(s / 5), 0.01], ["b) Médiane actuelle", so[2]], ["c) Note à obtenir au prochain contrôle", need]],
        ["Un contrôle qui compte double compte comme deux notes : il y aura 7 notes en tout.", "Somme visée = 7 · " + Mg + " ; la note x vérifie " + T(s) + " + 2x = " + 7 * Mg + "."],
        "a) " + M("\\frac{" + D(s) + "}{5} " + eqa(s / 5, r2c(s / 5)) + D(r2c(s / 5))) + ". b) Série triée : " + LST(so) + ", médiane " + M(D(so[2])) + ". c) " + M(D(s) + " + 2x = 7 \\cdot " + Mg + " = " + 7 * Mg) + ", " + M("x = " + D(need)) + ".")), { fr: [10, 11, 12] });
    },
    () => { /* production d'une semaine : moyenne, médiane, écart-type */
      const [txt, lo, hi, u] = pk([["Un atelier relève le nombre de pièces produites chaque jour pendant une semaine (7 jours)", 80, 140, "pièces"], ["Une boulangerie compte les croissants vendus chaque jour pendant une semaine (7 jours)", 60, 150, "croissants"], ["Un cinéma compte les spectateurs de la séance du soir pendant une semaine (7 jours)", 40, 120, "spectateurs"]]);
      let xs; do xs = Array.from({ length: 7 }, () => ri(lo, hi)); while (new Set(xs).size < 6);
      const m = sum(xs) / 7, so = [...xs].sort((a, b) => a - b), sd = sdev(xs);
      return CXP("production", P(txt + " : " + LST(xs) + ".",
        [["a) Moyenne journalière (" + u + ", au dixième)", r1(m), 0.1], ["b) Médiane (" + u + ")", so[3]], ["c) Écart-type (" + u + ", au dixième)", r1(sd), 0.1]],
        ["Moyenne = somme ÷ 7. Médiane : trie la série, c'est la 4e valeur.", "Écart-type : racine carrée de la moyenne des carrés des écarts à la moyenne (calculatrice, mode statistique)."],
        "a) " + M("\\frac{" + sum(xs) + "}{7} " + eqa(m, r1(m)) + D(r1(m))) + ". b) Série triée : " + LST(so) + ", médiane " + M(so[3]) + ". c) " + M("\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{7}} \\approx " + D(r1(sd))) + "."));
    },
    () => { /* sorties à vélo : distance à faire pour atteindre une moyenne */
      let xs, Mg, need; do { xs = Array.from({ length: 7 }, () => ri(25, 90)); Mg = ri(45, 75); need = 8 * Mg - sum(xs); } while (need < 30 || need > 110 || new Set(xs).size < 6 || xs.includes(need));
      const m = sum(xs) / 7, so = [...xs].sort((a, b) => a - b), nm = pk(["Une cycliste", "Un cycliste", "Une traileuse", "Un coureur à ski de fond"]);
      return CXP("velo", P(nm + " note les distances (km) parcourues lors de ses 7 sorties du mois : " + LST(xs) + ".",
        [["a) Distance moyenne d'une sortie (km, au dixième)", r1(m), 0.1], ["b) Distance médiane (km)", so[3]], ["c) Distance à parcourir lors de la 8e sortie pour une moyenne de " + M(Mg) + " km sur les 8 sorties (km)", need]],
        ["Moyenne = somme ÷ 7. Médiane : 4e valeur de la série triée.", "c) Les 8 sorties doivent totaliser 8 · " + Mg + " = " + 8 * Mg + " km."],
        "a) " + M("\\frac{" + sum(xs) + "}{7} " + eqa(m, r1(m)) + D(r1(m))) + " km. b) Série triée : " + LST(so) + ", médiane " + M(so[3]) + " km. c) " + M("8 \\cdot " + Mg + " - " + sum(xs) + " = " + need) + " km."));
    });
  ADD("statfreq", "transport",
    () => { /* dé : fréquences et fréquence cumulée */
      const n = pk([50, 60, 80, 100, 120]); let e; do { e = Array.from({ length: 5 }, () => ri(Math.round(n / 9), Math.round(n / 4.5))); } while (sum(e) >= n - n / 9 || sum(e) <= n - n / 4.5 || new Set(e).size < 4);
      e.push(n - sum(e)); const c3 = e[0] + e[1] + e[2], pair = e[1] + e[3] + e[5];
      return CXP("de", P("On lance " + M(n) + " fois un dé à six faces. Effectifs des faces 1 à 6 : " + LST(e) + ".",
        [["a) Fréquence de la face 6 (%, au dixième)", r1((100 * e[5]) / n), 0.1], ["b) Fréquence cumulée des faces 1 à 3 (%, au dixième)", r1((100 * c3) / n), 0.1], ["c) Nombre de lancers qui ont donné un nombre pair", pair]],
        ["Fréquence = effectif ÷ total, en % : multiplie par 100.", "Fréquence cumulée : additionne les effectifs des faces 1, 2 et 3. Pairs : faces 2, 4 et 6."],
        "a) " + M("\\frac{" + e[5] + "}{" + n + "} " + eqa((100 * e[5]) / n, r1((100 * e[5]) / n)) + D(r1((100 * e[5]) / n)) + "\\,\\%") + ". b) " + M("\\frac{" + e[0] + " + " + e[1] + " + " + e[2] + "}{" + n + "} = \\frac{" + c3 + "}{" + n + "} " + eqa((100 * c3) / n, r1((100 * c3) / n)) + D(r1((100 * c3) / n)) + "\\,\\%") + ". c) " + M(e[1] + " + " + e[3] + " + " + e[5] + " = " + pair) + "."));
    },
    () => { /* club de sport : effectif manquant, fréquence, angle */
      let n, a, b, c, d; do { n = pk([40, 60, 72, 80, 90, 120]); a = ri(Math.ceil(n / 8), Math.floor(n / 3)); b = ri(Math.ceil(n / 8), Math.floor(n / 4)); c = ri(Math.ceil(n / 10), Math.floor(n / 4)); d = n - a - b - c; } while (d < n / 10 || !Number.isInteger((c * 360) / n) || new Set([a, b, c, d]).size < 4);
      const DE = { football: "du football", tennis: "du tennis", natation: "de la natation", "athlétisme": "de l'athlétisme", basket: "du basket", escalade: "de l'escalade", volleyball: "du volleyball" };
      const [sa, sb, sc, sd] = shuf(Object.keys(DE)).slice(0, 4), cl = pk(["Un club omnisports", "Un centre sportif", "Une association sportive"]);
      return CXP("sport", P(cl + " compte " + M(n) + " membres, chacun inscrit dans un seul sport : " + sa + " " + M(a) + ", " + sb + " " + M(b) + ", " + sc + " " + M(c) + ", les autres font " + DE[sd] + ".",
        [["a) Nombre de membres qui font " + DE[sd], d], ["b) Fréquence " + DE[sb] + " (%, au dixième)", r1((100 * b) / n), 0.1], ["c) Angle du secteur « " + sc + " » dans un diagramme circulaire (°)", (c * 360) / n]],
        ["a) Le total des effectifs vaut " + n + ".", "Fréquence = effectif ÷ total. Angle = fréquence · 360°."],
        "a) " + M(n + " - " + a + " - " + b + " - " + c + " = " + d) + ". b) " + M("\\frac{" + b + "}{" + n + "} " + eqa((100 * b) / n, r1((100 * b) / n)) + D(r1((100 * b) / n)) + "\\,\\%") + ". c) " + M("\\frac{" + c + "}{" + n + "} \\cdot 360° = " + (c * 360) / n + "°") + "."));
    });
  ADD("quartiles", "trajet",
    () => { /* sauts en longueur, 15 valeurs : médiane, EIQ, étendue */
      let s; do s = Array.from({ length: 15 }, () => ri(250, 520)).sort((a, b) => a - b); while (new Set(s).size < 14 || s[11] - s[3] < 40);
      const [q1, m, q3] = QS(s);
      return CXP("saut", P("Longueurs (cm) du meilleur saut en longueur de 15 élèves, dans l'ordre de passage : " + shuf(s).join(" ; ") + ".",
        [["a) Médiane (cm)", m], ["b) Écart interquartile (cm)", q3 - q1], ["c) Étendue (cm)", s[14] - s[0]]],
        ["TRIE d'abord la série. 15 valeurs : la médiane est la 8e ; Q1 est la médiane des 7 premières (4e valeur), Q3 celle des 7 dernières (12e valeur).", "Écart interquartile = Q3 − Q1. Étendue = plus grande − plus petite valeur."],
        "Série triée : " + s.join(" ; ") + ". a) " + M(m) + " cm. b) " + M("Q_1 = " + q1) + ", " + M("Q_3 = " + q3) + " : " + M(q3 + " - " + q1 + " = " + (q3 - q1)) + " cm. c) " + M(s[14] + " - " + s[0] + " = " + (s[14] - s[0])) + " cm."));
    },
    () => { /* temps d'écran, 11 valeurs : quartiles et valeurs extrêmes */
      let s, q1, q3, ext; do {
        const b = Array.from({ length: 10 }, () => 5 * ri(12, 50)).sort((x, y) => x - y), o = b[8] + Math.ceil(1.5 * (b[8] - b[2]) / 5) * 5 + 5 * ri(1, 8);
        s = [...b, o].sort((x, y) => x - y); [q1, , q3] = QS(s); ext = s.filter((v) => v > q3 + 1.5 * (q3 - q1)).length;
      } while (new Set(s).size < 9 || q3 - q1 < 30 || s[10] > 420);
      return CXP("ecran", P("Temps d'écran (minutes) d'une journée, relevé par 11 adolescents : " + shuf(s).join(" ; ") + ".",
        [["a) Premier quartile " + M("Q_1") + " (min)", q1], ["b) Troisième quartile " + M("Q_3") + " (min)", q3], ["c) Combien de valeurs dépassent " + M("Q_3 + 1{,}5 \\cdot \\text{EIQ}") + " (valeurs extrêmes) ?", ext]],
        ["TRIE la série. 11 valeurs : médiane = 6e ; Q1 = médiane des 5 premières (3e valeur) ; Q3 = médiane des 5 dernières (9e valeur).", "EIQ = Q3 − Q1 ; seuil = Q3 + 1,5 · EIQ."],
        "Série triée : " + s.join(" ; ") + ". a) " + M("Q_1 = " + q1) + ". b) " + M("Q_3 = " + q3) + ". c) " + M("\\text{EIQ} = " + (q3 - q1)) + ", seuil " + M(q3 + " + 1{,}5 \\cdot " + (q3 - q1) + " = " + D(q3 + 1.5 * (q3 - q1))) + " : " + M(ext) + " valeur" + (ext > 1 ? "s" : "") + "."));
    });
  ADD("triaire", "terrain",
    () => { /* voile triangulaire : aire, troisième côté, angle */
      const a = ri(60, 140) / 10, b = ri(30, 60) / 10, g = ri(70, 95), A = 0.5 * a * b * Math.sin(rad(g)), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(g))), be = deg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
      return CXP("voile", P("La grand-voile d'un voilier est un triangle : le long du mât, elle mesure " + M(D(a) + " \\text{ m}") + ", le long de la bôme " + M(D(b) + " \\text{ m}") + ", et le mât et la bôme forment un angle de " + M(g + "°") + ".",
        [["a) Aire de la voile (m², au dixième)", r1(A), 0.1], ["b) Longueur du troisième côté, la chute (m, au centième)", r2c(c), 0.01], ["c) Angle entre la chute et la bôme (°, au dixième)", r1(be), 0.1]],
        ["Aire = ½ · a · b · sin γ, avec l'angle compris entre les deux côtés connus.", "b) Théorème du cosinus. c) Théorème du cosinus encore (ou du sinus) : l'angle cherché est en face du côté du mât."],
        "a) " + M("\\frac{1}{2} \\cdot " + D(a) + " \\cdot " + D(b) + " \\cdot \\sin " + g + "° \\approx " + D(r1(A))) + " m². b) " + M("c^2 = " + D(a) + "^2 + " + D(b) + "^2 - 2 \\cdot " + D(a) + " \\cdot " + D(b) + " \\cdot \\cos " + g + "°") + ", " + M("c \\approx " + D(r2c(c))) + " m. c) " + M("\\cos\\beta = \\frac{b^2 + c^2 - a^2}{2bc}") + ", " + M("\\beta \\approx " + D(r1(be)) + "°") + "."));
    },
    () => { /* tôle en parallélogramme : aire, diagonales */
      let a, b, g; do { a = 5 * ri(4, 16); b = 5 * ri(4, 16); g = ri(35, 80); } while (a === b);
      const A = a * b * Math.sin(rad(g)), dp = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(g))), dg = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(rad(g)));
      return CXP("plaque", P("Une tôle a la forme d'un parallélogramme de côtés " + M(a + " \\text{ cm}") + " et " + M(b + " \\text{ cm}") + " ; l'angle aigu entre ces côtés mesure " + M(g + "°") + ".",
        [["a) Aire de la tôle (cm², à l'unité)", r0(A), 1], ["b) Petite diagonale (cm, au dixième)", r1(dp), 0.1], ["c) Grande diagonale (cm, au dixième)", r1(dg), 0.1]],
        ["Une diagonale coupe le parallélogramme en deux triangles égaux : aire = 2 · ½ · a · b · sin α.", "Petite diagonale : théorème du cosinus avec l'angle aigu ; grande diagonale : avec l'angle obtus, 180° − " + g + "°."],
        "a) " + M(a + " \\cdot " + b + " \\cdot \\sin " + g + "° \\approx " + nb(r0(A))) + " cm². b) " + M("\\sqrt{" + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + g + "°} \\approx " + D(r1(dp))) + " cm. c) " + M("\\sqrt{" + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + (180 - g) + "°} \\approx " + D(r1(dg))) + " cm."));
    });
  /* ---------- 2e Collège, MP 2e : droites ---------- */
  ADD("droites", "perpendiculaire",
    () => { /* piquets alignés */
      let p, q, A, k, xc, m, h; do { [p, q] = pk([[1, 2], [3, 2], [-1, 2], [-3, 2], [2, 3], [-2, 3], [1, 3], [-1, 3], [3, 4], [-3, 4], [2, 1], [-3, 1]]); A = [ri(-6, 4), ri(-5, 5)]; k = pk([1, 2]); xc = ri(-8, 9); m = p / q; h = A[1] - m * A[0]; } while (xc === A[0] || xc === A[0] + k * q || h === 0 || Math.abs(A[0] + k * q) > 9);
      const B = [A[0] + k * q, A[1] + k * p], yc = m * xc + h;
      return CXP("alignes", P("Un géomètre plante des piquets. Dans un repère (unité : 1 m), " + M("A" + PT(A)) + " et " + M("B" + PT(B)) + ". Un troisième piquet " + M("C") + " a pour abscisse " + M(xc) + ".",
        [["a) Pente de la droite " + M("(AB)") + " (fraction acceptée)", m], ["b) Ordonnée à l'origine de " + M("(AB)") + " (fraction acceptée)", h], ["c) Ordonnée de " + M("C") + " pour que " + M("A") + ", " + M("B") + " et " + M("C") + " soient alignés (fraction acceptée)", yc]],
        ["Pente = (y_B − y_A) ÷ (x_B − x_A).", "Ordonnée à l'origine : remplace les coordonnées de A dans y = mx + h. c) C est sur (AB) : y_C = m · " + tT(xc) + " + h."],
        "a) " + M("m = \\frac{" + B[1] + " - " + pr(A[1]) + "}{" + B[0] + " - " + pr(A[0]) + "} = " + fx(m)) + ". b) " + M(A[1] + " = " + fx(m) + " \\cdot " + pr(A[0]) + " + h") + ", " + M("h = " + fx(h)) + ". c) " + M("y_C = " + fx(m) + " \\cdot " + pr(xc) + " " + (h < 0 ? "- " + fx(-h) : "+ " + fx(h)) + " = " + fx(yc)) + "."));
    },
    () => { /* plan d'un quartier : parallèle par un point */
      let m, A, B, E, he; do { m = pk([1, -1, 2, -2, 3, -3, 0.5, -0.5]); A = [ri(-6, 2), ri(-5, 5)]; const k = m === 0.5 || m === -0.5 ? 2 * ri(2, 4) : ri(2, 5); B = [A[0] + k, A[1] + m * k]; E = [ri(-6, 7), ri(-6, 7)]; he = E[1] - m * E[0]; } while (he === 0 || Math.abs(he - (A[1] - m * A[0])) < 2 || !Number.isInteger(B[1]));
      return CXP("plan", P("Sur le plan d'un quartier (unité : 10 m), une route rectiligne passe par " + M("A" + PT(A)) + " et " + M("B" + PT(B)) + ". On trace une piste cyclable parallèle à cette route, qui passe par l'école " + M("E" + PT(E)) + ".",
        [["a) Pente de la route (fraction acceptée)", m], ["b) Ordonnée à l'origine de la piste cyclable (fraction acceptée)", he], ["c) Abscisse du point où la piste coupe l'axe des abscisses (fraction acceptée)", -he / m]],
        ["Deux droites parallèles ont la même pente.", "La piste : y = " + (m === -1 ? "−" : m === 1 ? "" : fxT(m)) + "x + h, et E est dessus. c) Résous " + (m === -1 ? "−" : m === 1 ? "" : fxT(m)) + "x + h = 0."],
        "a) " + M("\\frac{" + B[1] + " - " + pr(A[1]) + "}{" + B[0] + " - " + pr(A[0]) + "} = " + fx(m)) + ". b) " + M(E[1] + " = " + fx(m) + " \\cdot " + pr(E[0]) + " + h") + " : " + M("h = " + fx(he)) + ". c) " + M(fx(m) + "x " + (he < 0 ? "- " + fx(-he) : "+ " + fx(he)) + " = 0 \\iff x = " + fx(-he / m)) + "."));
    });
  ADD("droitesinter", "location",
    () => { /* rencontre de deux cyclistes */
      let Dk, v1, v2, d; do { Dk = ri(30, 70); v1 = ri(14, 24); v2 = ri(14, 24); d = pk([0.25, 0.5, 0.75]); } while (v1 === v2 || Dk < v2 * d + 10);
      const t = (Dk + v2 * d) / (v1 + v2), xr = v1 * t, [n1, n2] = shuf(["Léa", "Noé", "Inès", "Hugo", "Lina", "Elias"]).slice(0, 2), mn = d * 60;
      return CXP("rencontre", P("Deux villages A et B sont reliés par une route de " + M(Dk) + " km. À 9 h, " + n1 + " part de A vers B à vélo, à " + M(v1) + " km/h. À 9 h " + mn + ", " + n2 + " part de B vers A à " + M(v2) + " km/h. On note " + M("t") + " le temps (h) écoulé depuis 9 h.",
        [["a) Distance de " + n2 + " à A à 10 h (km, au dixième)", r1(Dk - v2 * (1 - d)), 0.1], ["b) Instant de la rencontre : valeur de " + M("t") + " (h, au centième)", r2c(t), 0.01], ["c) Distance du point de rencontre au village A (km, au dixième)", r1(xr), 0.1]],
        ["Distance à A : " + n1 + " : d₁(t) = " + v1 + "t ; " + n2 + " : d₂(t) = " + Dk + " − " + v2 + "(t − " + T(d) + "), pour t ≥ " + T(d) + ".", "Ils se rencontrent quand d₁(t) = d₂(t) : intersection de deux droites."],
        "a) " + M("d_2(1) = " + Dk + " - " + v2 + " \\cdot " + D(1 - d) + " = " + D(r1(Dk - v2 * (1 - d)))) + " km. b) " + M(v1 + "t = " + Dk + " - " + v2 + "(t - " + D(d) + ") \\iff " + (v1 + v2) + "t = " + D(Dk + v2 * d)) + ", " + M("t " + eqa(t, r2c(t)) + D(r2c(t))) + " h. c) " + M(v1 + " \\cdot \\frac{" + D(Dk + v2 * d) + "}{" + (v1 + v2) + "} " + eqa(xr, r1(xr)) + D(r1(xr))) + " km."));
    },
    () => { /* droite par deux points et droite donnée par son équation */
      let A, B, m1, m2, h2, xi; do { A = [ri(-5, 3), ri(-5, 5)]; m1 = pk([1, -1, 2, -2, 3, 0.5, -0.5]); const k = Math.abs(m1) === 0.5 ? 2 * ri(1, 3) : ri(2, 4); B = [A[0] + k, A[1] + m1 * k]; m2 = R.nz(-3, 3); xi = ri(-6, 6); h2 = (m1 - m2) * xi + (A[1] - m1 * A[0]); } while (m2 === m1 || h2 === 0 || !Number.isInteger(h2) || !Number.isInteger(B[1]) || xi === A[0] || xi === B[0]);
      const h1 = A[1] - m1 * A[0], yi = m1 * xi + h1;
      return CXP("repere", P("La droite " + M("d") + " passe par " + M("A" + PT(A)) + " et " + M("B" + PT(B)) + " ; la droite " + M("e") + " a pour équation " + M("y = " + cfD(m2) + "x " + (h2 < 0 ? "- " + -h2 : "+ " + h2)) + ".",
        [["a) Pente de " + M("d") + " (fraction acceptée)", m1], ["b) Abscisse du point d'intersection de " + M("d") + " et " + M("e"), xi], ["c) Ordonnée de ce point (fraction acceptée)", yi]],
        ["Pente de d = (y_B − y_A) ÷ (x_B − x_A) ; puis h avec A : y = mx + h.", "Point d'intersection : égale les deux expressions de y et résous en x."],
        "a) " + M("m = " + fx(m1)) + ", " + M("d : y = " + fx(m1) + "x " + (h1 < 0 ? "- " + fx(-h1) : "+ " + fx(h1))) + ". b) " + M(fx(m1) + "x " + (h1 < 0 ? "- " + fx(-h1) : "+ " + fx(h1)) + " = " + cfD(m2) + "x " + (h2 < 0 ? "- " + -h2 : "+ " + h2)) + " : " + M("x = " + xi) + ". c) " + M("y = " + cfD(m2) + " \\cdot " + pr(xi) + " " + (h2 < 0 ? "- " + -h2 : "+ " + h2) + " = " + fx(yi)) + "."));
    });
  /* ---------- MP 2e : fonction réciproque d'une fonction affine ---------- */
  ADD("recipaff", "forfait",
    () => { /* ressort */
      let L0, k, m1, m2, Lc; do { L0 = ri(8, 25); k = pk([0.5, 1.5, 2, 2.5, 3, 4]); m1 = ri(1, 4); m2 = m1 + ri(2, 5); Lc = L0 + k * ri(1, 12) + pk([0, 0.5]) * k; } while (Lc === L0 + k * m1 || Lc === L0 + k * m2);
      const l1 = L0 + k * m1, l2 = L0 + k * m2;
      return CXP("ressort", P("Un ressort mesure " + M(D(l1)) + " cm quand on y suspend " + M(m1) + " kg et " + M(D(l2)) + " cm avec " + M(m2) + " kg (allongement proportionnel à la masse). On note " + M("f(m)") + " sa longueur (cm) pour une masse " + M("m") + " (kg).",
        [["a) Longueur à vide (cm)", L0], ["b) " + M("f^{-1}(" + D(Lc) + ")") + " : masse suspendue quand le ressort mesure " + D(Lc) + " cm (kg)", (Lc - L0) / k], ["c) Pente de la fonction réciproque " + M("f^{-1}") + " (fraction acceptée)", 1 / k]],
        ["f(m) = L₀ + k · m : k = (" + T(l2) + " − " + T(l1) + ") ÷ (" + m2 + " − " + m1 + ").", "f⁻¹ fait le chemin inverse : on soustrait L₀, puis on divise par k. Sa pente est 1 ÷ k."],
        M("k = \\frac{" + D(l2) + " - " + D(l1) + "}{" + (m2 - m1) + "} = " + D(k)) + " cm/kg. a) " + M(D(l1) + " - " + D(k) + " \\cdot " + m1 + " = " + L0) + " cm. b) " + M("f^{-1}(L) = \\frac{L - " + L0 + "}{" + D(k) + "}") + ", " + M("f^{-1}(" + D(Lc) + ") = " + D((Lc - L0) / k)) + " kg. c) " + M(fx(1 / k)) + " kg/cm."));
    },
    () => { /* four qui préchauffe */
      const k = pk([12, 15, 16, 18, 20, 25]), t1 = ri(3, 9), Tc = pk([180, 200, 220, 160]), T0 = pk([18, 20, 22]);
      return CXP("four", P("Un four préchauffe : sa température vaut " + M("f(t) = " + T0 + " + " + k + "t") + " (°C, " + M("t") + " en minutes) jusqu'à la température choisie.",
        [["a) Température du four après " + t1 + " min (°C)", T0 + k * t1], ["b) " + M("f^{-1}(" + Tc + ")") + " : durée pour que le four atteigne " + Tc + " °C (min, au dixième)", r1((Tc - T0) / k), 0.1], ["c) On écrit " + M("f^{-1}(x) = ax + b") + ". Que vaut " + M("b") + " ? (fraction acceptée)", -T0 / k]],
        ["Remplace t par " + t1 + ".", "f⁻¹(x) : résous x = " + T0 + " + " + k + "t en t, soit t = (x − " + T0 + ") ÷ " + k + " = x/" + k + " − " + T0 + "/" + k + "."],
        "a) " + M(T0 + " + " + k + " \\cdot " + t1 + " = " + (T0 + k * t1)) + " °C. b) " + M("\\frac{" + Tc + " - " + T0 + "}{" + k + "} " + eqa((Tc - T0) / k, r1((Tc - T0) / k)) + D(r1((Tc - T0) / k))) + " min. c) " + M("f^{-1}(x) = \\frac{x - " + T0 + "}{" + k + "} = " + frac(1, k) + "x - " + frac(T0, k)) + " : " + M("b = " + fx(-T0 / k)) + "."));
    });
  /* ---------- MP 2e, 2e Collège : angles associés, sinusoïdes ---------- */
  ADD("trigassoc", "sinus",
    () => { /* angle de référence, quadrant donné */
      const v = ri(15, 92) / 100, quad = pk([2, 3, 4]), f = pk(["sin", "cos"]), ref = deg(f === "sin" ? Math.asin(v) : Math.acos(v));
      const al = quad === 2 ? 180 - ref : quad === 3 ? 180 + ref : 360 - ref, sv = Math.sin(rad(al)), cv = Math.cos(rad(al)), given = f === "sin" ? sv : cv, other = f === "sin" ? cv : sv, of = f === "sin" ? "cos" : "sin";
      const zone = { 2: "]90° ; 180°[", 3: "]180° ; 270°[", 4: "]270° ; 360°[" }[quad];
      return CXP("reference", P("On sait que " + M("\\" + f + "\\alpha = " + D(+given.toFixed(2))) + " et que " + M("\\alpha \\in " + zone) + ".",
        [["a) Angle de référence (aigu, °, au dixième)", r1(ref), 0.1], ["b) " + M("\\alpha") + " (°, au dixième)", r1(al), 0.1], ["c) " + M("\\" + of + "\\alpha") + " (au centième)", r2c(other), 0.01]],
        ["L'angle de référence est l'angle aigu dont le " + f + " vaut " + T(v) + " (sans le signe) : arc" + f + " à la calculatrice.", "Place α dans le bon quadrant (" + zone + "), puis le signe de " + of + " α dépend de ce quadrant."],
        "a) " + M("\\text{arc" + f + "}(" + D(v) + ") \\approx " + D(r1(ref)) + "°") + ". b) " + M("\\alpha = " + (quad === 2 ? "180° - " : quad === 3 ? "180° + " : "360° - ") + D(r1(ref)) + "° \\approx " + D(r1(al)) + "°") + ". c) " + M("\\" + of + "\\alpha \\approx " + D(r2c(other))) + "."));
    },
    () => { /* bras de robot : coordonnées de la pince */
      const [p, q, h] = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), s = h <= 13 ? pk([4, 5, 6, 8]) : h <= 25 ? pk([2, 3]) : 1, L = h * s, quad = pk([2, 3]), sw = pk([true, false]);
      const [ps, qs] = sw ? [q, p] : [p, q], hy = (quad === 2 ? 1 : -1) * ps * s, al = quad === 2 ? 180 - deg(Math.asin(ps / h)) : 180 + deg(Math.asin(ps / h));
      return CXP("bras", P("Le bras d'un robot de soudure, long de " + M(L) + " cm, tourne autour d'un axe " + M("O") + ". La pince est repérée par l'angle " + M("\\alpha") + " compté depuis l'horizontale droite, dans le sens inverse des aiguilles d'une montre. Elle se trouve à gauche de l'axe, " + M(Math.abs(hy)) + " cm " + (hy > 0 ? "au-dessus" : "au-dessous") + " de " + M("O") + ".",
        [["a) " + M("\\sin\\alpha") + " (fraction)", hy / L], ["b) " + M("\\cos\\alpha") + " (fraction)", -qs / h], ["c) " + M("\\alpha") + " (°, au dixième)", r1(al), 0.1]],
        ["La pince est au point (L cos α ; L sin α), avec L = " + L + " cm : sin α = hauteur ÷ L.", "À gauche de l'axe : cos α < 0 (Pythagore pour sa valeur). α est dans le " + (quad === 2 ? "2e" : "3e") + " quadrant."],
        "a) " + M("\\sin\\alpha = \\frac{" + hy + "}{" + L + "} = " + (hy < 0 ? "-" : "") + frac(ps, h)) + ". b) " + M("\\cos^2\\alpha = 1 - " + frac(ps * ps, h * h)) + ", " + M("\\cos\\alpha = -" + frac(qs, h)) + ". c) " + M("\\alpha = " + (quad === 2 ? "180° - " : "180° + ") + "\\arcsin" + frac(ps, h) + " \\approx " + D(r1(al)) + "°") + "."));
    });
  ADD("trigeq2", ["roue", "maree"],
    () => { /* température d'une journée d'été */
      let Tn, Tx, hm, t1, S; do { Tn = ri(10, 20); Tx = Tn + ri(8, 16); hm = pk([14, 15, 16]); t1 = ri(6, 22); S = ri(Tn + 2, Tx - 2); } while (Math.abs(S - (Tn + Tx) / 2) < 1 || (t1 - hm) % 6 === 0);
      const d = (Tn + Tx) / 2, A = (Tx - Tn) / 2, T1 = d + A * Math.cos(rad(15 * (t1 - hm))), dur = (2 * deg(Math.acos((S - d) / A))) / 15;
      return CXP("temperature", P("Un jour d'été, la température varie entre " + M(Tn + "\\,°\\text{C}") + " et " + M(Tx + "\\,°\\text{C}") + ", avec le maximum à " + M(hm) + " h. On modélise par " + M("T(t) = " + D(d) + " + " + D(A) + "\\cos\\big(15(t - " + hm + ")\\big)") + " (" + M("t") + " en heures, angle en degrés).",
        [["a) Température à " + t1 + " h (°C, au dixième)", r1(T1), 0.1], ["b) Heure du minimum (h, entre 0 et 24)", (hm + 12) % 24], ["c) Pendant combien d'heures la température dépasse-t-elle " + M(S + "\\,°\\text{C}") + " ? (h, au dixième)", r1(dur), 0.1]],
        ["Remplace t par " + t1 + ". Période : 360 ÷ 15 = 24 h ; le minimum est une demi-période après le maximum.", "T(t) ≥ " + S + " ⇔ cos(15(t − " + hm + ")) ≥ (" + S + " − " + T(d) + ") ÷ " + T(A) + ". Avec θ = arccos(…), 15(t − " + hm + ") est entre −θ et θ."],
        "a) " + M("T(" + t1 + ") = " + D(d) + " + " + D(A) + "\\cos(" + 15 * (t1 - hm) + "°) \\approx " + D(r1(T1))) + " °C. b) " + M(hm + " + 12 = " + (hm + 12)) + (hm + 12 >= 24 ? ", soit " + M((hm + 12) % 24) + " h" : " h") + ". c) " + M("\\cos\\theta = \\frac{" + S + " - " + D(d) + "}{" + D(A) + "}") + ", " + M("\\theta \\approx " + D(r2c(deg(Math.acos((S - d) / A)))) + "°") + " : durée " + M("\\frac{2\\theta}{15} \\approx " + D(r1(dur))) + " h."));
    });
  /* ---------- MP 1re, 2e Collège : fractions rationnelles ---------- */
  ADD("fracrat", "evidence",
    () => { /* trinôme sur différence de carrés */
      let k, p, v, ks; do { k = ri(2, 7); p = R.nz(-8, 8); v = ri(-6, 8); ks = pk([1, -1]) * k; } while (Math.abs(p) === k || v === ks || v === -ks || v + ks === 0 || v === k || v === -k || v === p);
      const b = -(ks + p), c = ks * p, F = (v - p) / (v + ks);
      return CXP("trinome", P("On étudie " + M("F(x) = \\frac{" + poly([1, b, c]) + "}{x^2 - " + k * k + "}") + ".",
        [["a) Produit des deux valeurs interdites", -k * k], ["b) " + M("F(" + v + ")") + " (fraction)", F], ["c) Solution de " + M("F(x) = 0"), p]],
        ["Valeurs interdites : x² − " + k * k + " = 0. Le numérateur s'annule aussi en " + ks + " : factorise-le.", "F(x) = (" + xmT(ks) + ")(" + xmT(p) + ") ÷ ((" + xmT(k) + ")(" + xmT(-k) + ")) = (" + xmT(p) + ") ÷ (" + xmT(-ks) + ") pour x ≠ " + ks + ". c) " + ks + " est interdit : il ne compte pas."],
        "Valeurs interdites " + M("-" + k) + " et " + M(k) + " : a) " + M(-k * k) + ". " + M("F(x) = \\frac{(" + xm(ks) + ")(" + xm(p) + ")}{(" + xm(k) + ")(" + xm(-k) + ")} = \\frac{" + xm(p) + "}{" + xm(-ks) + "}") + " pour " + M("x \\neq " + ks) + ". b) " + M("F(" + v + ") = " + fx(F)) + ". c) " + M("x = " + p) + "."));
    },
    () => { /* produit de deux fractions */
      let a, b, kk, xs; do { a = R.nz(-7, 7); b = R.nz(-7, 7); kk = pk([2, 3, -1, -2, 0.5]); xs = a / (1 - kk); } while (Math.abs(a) === Math.abs(b) || a === -b || b === 0 || !Number.isInteger(xs) || xs === 0 || xs === -b || xs === -a);
      const v = pk([1, 2, 3, 4, -3].filter((t) => t !== 0 && t !== -a && t !== -b)), G = (v - a) / v;
      return CXP("produit", P("On étudie " + M("G(x) = \\frac{x^2 - " + a * a + "}{x^2 " + (b < 0 ? "- " + -b : "+ " + b) + "x} \\cdot \\frac{" + xm(-b) + "}{" + xm(-a) + "}") + ".",
        [["a) Nombre de valeurs interdites", 3], ["b) " + M("G(" + v + ")") + " (fraction)", G], ["c) Solution de " + M("G(x) = " + fx(kk)), xs]],
        ["Valeurs interdites : x² " + (b < 0 ? "− " : "+ ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x = x(" + xmT(-b) + ") et " + xmT(-a) + " s'annulent.", "x² − " + a * a + " = (" + xmT(a) + ")(" + xmT(-a) + ") : simplifie, G(x) = (" + xmT(a) + ") ÷ x. c) Produit en croix, puis vérifie que la solution n'est pas interdite."],
        "Valeurs interdites " + M("0") + ", " + M(-b) + " et " + M(-a) + " : a) 3. " + M("G(x) = \\frac{(" + xm(a) + ")(" + xm(-a) + ")}{x(" + xm(-b) + ")} \\cdot \\frac{" + xm(-b) + "}{" + xm(-a) + "} = \\frac{" + xm(a) + "}{x}") + ". b) " + M("G(" + v + ") = " + fx(G)) + ". c) " + M(xm(a) + " = " + fx(kk) + "x \\iff x = " + xs) + " (pas interdite)."));
    });
  /* ---------- MP 1re : valeur absolue, équation à paramètre ---------- */
  ADD("vabs", "droite",
    () => { /* thermostat d'un local */
      const T0 = pk([4, 6, 18, 19, 20, 21, 22]), e = pk([0.5, 1, 1.5, 2]), lieu = T0 < 10 ? pk(["Une chambre froide", "Un local frigorifique"]) : pk(["Une serre", "Un local de serveurs", "Un atelier de peinture"]);
      let ms; do ms = Array.from({ length: 6 }, () => r1(T0 + (e * R.nz(-25, 25)) / 10)); while (new Set(ms).size < 6 || ms.some((m) => m <= 0 || Math.abs(Math.abs(m - T0) - e) < 1e-9));
      const out = ms.filter((m) => Math.abs(m - T0) > e).length;
      return CXP("thermostat", P(lieu + " doit rester à " + M(T0 + "\\,°\\text{C}") + " à " + M(D(e)) + " °C près : la température " + M("t") + " doit vérifier " + M("|t - " + T0 + "| \\leq " + D(e)) + ". Relevés de la journée : " + LST(ms) + " °C.",
        [["a) Température minimale permise (°C)", r1(T0 - e)], ["b) Température maximale permise (°C)", r1(T0 + e)], ["c) Combien de relevés sont hors tolérance ?", out]],
        ["|t − " + T0 + "| est la distance entre t et " + T0 + " : elle doit valoir au plus " + T(e) + ".", "c) Pour chaque relevé, calcule l'écart à " + T0 + " °C."],
        "a) " + M(T0 + " - " + D(e) + " = " + D(r1(T0 - e))) + " °C. b) " + M(T0 + " + " + D(e) + " = " + D(r1(T0 + e))) + " °C. c) " + M(out) + " relevé" + (out > 1 ? "s" : "") + " en dehors de " + M("[" + D(r1(T0 - e)) + " ; " + D(r1(T0 + e)) + "]") + "."));
    },
    () => { /* |ax − b| = c */
      let a, b, c; do { a = pk([2, 3, 4, 5]); b = R.nz(-12, 12); c = ri(2, 15); } while (b % a === 0 && c % a === 0);
      const x1 = (b - c) / a, x2 = (b + c) / a, nI = cntInt((x) => Math.abs(a * x - b) < c, -40, 40);
      return CXP("equation", P("On étudie " + M("|" + a + "x " + (b < 0 ? "+ " + -b : "- " + b) + "| = " + c) + ".",
        [["a) Plus petite solution (fraction acceptée)", x1], ["b) Plus grande solution (fraction acceptée)", x2], ["c) Combien d'entiers " + M("x") + " vérifient " + M("|" + a + "x " + (b < 0 ? "+ " + -b : "- " + b) + "| < " + c) + " ?", nI]],
        ["|A| = " + c + " ⇔ A = " + c + " ou A = −" + c + ".", "c) |A| < " + c + " ⇔ −" + c + " < A < " + c + " : les x sont strictement entre les deux solutions."],
        M(a + "x " + (b < 0 ? "+ " + -b : "- " + b) + " = -" + c) + " ou " + M(a + "x " + (b < 0 ? "+ " + -b : "- " + b) + " = " + c) + " : a) " + M("x = " + fx(x1)) + ". b) " + M("x = " + fx(x2)) + ". c) Entiers strictement entre " + M(fx(x1)) + " et " + M(fx(x2)) + " : " + M(nI) + "."));
    });
  ADD("eqparam", "delta",
    () => { /* (m − a)x = m² − a² */
      let a, v, w; do { a = R.nz(-6, 6); v = R.nz(-8, 8); w = R.nz(-10, 10); } while (v === a || v === -a || w - a === a || w === 2 * a || w - a === 0 || v + a === 0);
      return CXP("lineaire", P("On étudie l'équation " + M("(m " + (a < 0 ? "+ " + -a : "- " + a) + ")x = m^2 - " + a * a) + ", d'inconnue " + M("x") + " (" + M("m") + " est un paramètre).",
        [["a) Valeur de " + M("m") + " pour laquelle tout nombre " + M("x") + " est solution", a], ["b) Solution pour " + M("m = " + v), v + a], ["c) Valeur de " + M("m") + " pour que la solution soit " + M("x = " + w), w - a]],
        ["m² − " + a * a + " = (m " + (a < 0 ? "+ " + -a : "− " + a) + ")(m " + (a < 0 ? "− " + -a : "+ " + a) + ") : si m " + (a < 0 ? "+ " + -a : "− " + a) + " ≠ 0, on peut diviser.", "Si m = " + a + ", l'équation devient 0 · x = 0."],
        "a) " + M("m = " + a) + " : " + M("0 \\cdot x = 0") + ", vrai pour tout x. Sinon " + M("x = m " + (a < 0 ? "- " + -a : "+ " + a)) + ". b) " + M(v + (a < 0 ? " - " + -a : " + " + a) + " = " + (v + a)) + ". c) " + M("m " + (a < 0 ? "- " + -a : "+ " + a) + " = " + w + " \\iff m = " + (w - a)) + "."));
    },
    () => { /* écart entre les solutions, solution double de l'autre */
      let s, d, s3; do { s = 2 * ri(3, 10); d = 2 * ri(1, 4); s3 = 3 * ri(2, 6); } while (d >= s);
      const m1 = (s * s - d * d) / 4, xg = (s + d) / 2, m2 = (2 * s3 * s3) / 9;
      return CXP("ecart", P("On étudie l'équation " + M("x^2 - " + s + "x + m = 0") + " (" + M("m") + " est un paramètre). On veut que ses deux solutions diffèrent de " + M(d) + ".",
        [["a) Valeur de " + M("m"), m1], ["b) La plus grande solution dans ce cas", xg], ["c) Pour l'équation " + M("x^2 - " + s3 + "x + m = 0") + " : valeur de " + M("m") + " pour qu'une solution soit le double de l'autre", m2]],
        ["Les solutions sont (" + s + " ± √Δ) ÷ 2 : leur écart vaut √Δ, avec Δ = " + s * s + " − 4m.", "c) Si les solutions sont x et 2x : x + 2x = " + s3 + " et x · 2x = m (somme et produit des solutions)."],
        "a) " + M("\\sqrt{" + s * s + " - 4m} = " + d + " \\iff " + s * s + " - 4m = " + d * d + " \\iff m = " + m1) + ". b) " + M("\\frac{" + s + " + " + d + "}{2} = " + xg) + ". c) " + M("3x = " + s3) + ", " + M("x = " + s3 / 3) + ", " + M("m = " + s3 / 3 + " \\cdot " + (2 * s3) / 3 + " = " + m2) + "."));
    });
  /* ---------- 2e Collège : géométrie analytique, exponentielles, logarithmes, vecteurs (hors de l'objet OUT) ---------- */
  const TAGS = (id, cx) => { for (const S of [PROB_EXTRA, PROBX]) if (S && S[id]) S[id] = S[id].map((f) => TAGX(f, cx)); };
  TAGS("cart", "triangle");
  ADDX("cart",
    () => { /* carte d'une région : distances et milieu */
      let Rf, L, S; do { Rf = [ri(-9, 4), ri(-8, 6)]; L = [ri(-6, 9), ri(-8, 8)]; S = [ri(-9, 9), ri(-8, 9)]; } while ((L[0] - Rf[0]) % 2 || (L[1] - Rf[1]) % 2 || Math.hypot(S[0] - Rf[0], S[1] - Rf[1]) < 5 || Math.hypot(L[0] - Rf[0], L[1] - Rf[1]) < 5 || [Rf, L, S].some((p) => p[0] === 0 || p[1] === 0));
      const Mi = [(Rf[0] + L[0]) / 2, (Rf[1] + L[1]) / 2], dRS = Math.hypot(S[0] - Rf[0], S[1] - Rf[1]), dSM = Math.hypot(S[0] - Mi[0], S[1] - Mi[1]);
      return CXP("carte", P("Sur la carte d'une région de montagne (repère orthonormé, unité : 1 km), le refuge est en " + M("R" + PT(Rf)) + ", le lac en " + M("L" + PT(L)) + " et le sommet en " + M("S" + PT(S)) + ".",
        [["a) Distance à vol d'oiseau entre le refuge et le sommet (km, au dixième)", r1(dRS), 0.1], ["b) Coordonnées du milieu " + M("M") + " de " + M("[RL]") + ", où l'on installe un abri (« x ; y »)", PAIR(Mi[0], Mi[1])], ["c) Distance de l'abri au sommet (km, au dixième)", r1(dSM), 0.1]],
        ["Distance : √((x₂ − x₁)² + (y₂ − y₁)²).", "Milieu : moyenne des abscisses, moyenne des ordonnées."],
        "a) " + M("\\sqrt{" + (S[0] - Rf[0]) ** 2 + " + " + (S[1] - Rf[1]) ** 2 + "} \\approx " + D(r1(dRS))) + " km. b) " + M("M" + PT(Mi)) + ". c) " + M("\\sqrt{" + D((S[0] - Mi[0]) ** 2) + " + " + D((S[1] - Mi[1]) ** 2) + "} \\approx " + D(r1(dSM))) + " km."));
    },
    () => { /* triangle isocèle : longueurs et aire */
      let Mi, w, t; do { Mi = [ri(-4, 4), ri(-4, 4)]; w = [R.nz(-3, 3), R.nz(-3, 3)]; t = pk([1, 2, -1, -2]); } while (Math.abs(w[0]) === Math.abs(w[1]));
      const B = [Mi[0] + w[0], Mi[1] + w[1]], C = [Mi[0] - w[0], Mi[1] - w[1]], A = [Mi[0] - t * w[1], Mi[1] + t * w[0]];
      const AB = Math.hypot(B[0] - A[0], B[1] - A[1]), BC = 2 * Math.hypot(...w), h = Math.abs(t) * Math.hypot(...w), Ai = Math.abs(t) * (w[0] ** 2 + w[1] ** 2);
      return CXP("isocele", P("On donne " + M("A" + PT(A)) + ", " + M("B" + PT(B)) + " et " + M("C" + PT(C)) + ".",
        [["a) Longueur " + M("AB") + " (au centième)", r2c(AB), 0.01], ["b) Longueur " + M("AC") + " (au centième)", r2c(AB), 0.01], ["c) Aire du triangle " + M("ABC"), Ai]],
        ["Calcule AB et AC : le triangle est isocèle en A. La hauteur issue de A tombe alors au milieu de [BC].", "Aire = BC · AH ÷ 2, avec H le milieu de [BC]."],
        "a) " + M("AB = \\sqrt{" + (B[0] - A[0]) ** 2 + " + " + (B[1] - A[1]) ** 2 + "} \\approx " + D(r2c(AB))) + ". b) " + M("AC = \\sqrt{" + (C[0] - A[0]) ** 2 + " + " + (C[1] - A[1]) ** 2 + "} \\approx " + D(r2c(AB))) + " : isocèle en A. c) " + M("H" + PT(Mi)) + ", " + M("BC = \\sqrt{" + 4 * (w[0] ** 2 + w[1] ** 2) + "}") + ", " + M("AH = \\sqrt{" + t * t * (w[0] ** 2 + w[1] ** 2) + "}") + ", aire " + M("\\frac{BC \\cdot AH}{2} = " + nb(Ai)) + "."));
    });
  TAGS("expo", "demivie");
  ADDX("expo",
    () => { /* voiture qui perd de sa valeur */
      const P0 = 1000 * ri(18, 45), r = pk([10, 12, 15, 18, 20]), n = ri(3, 8), q = 1 - r / 100, Vn = P0 * q ** n;
      let nh = 1; while (q ** nh >= 0.5) nh++;
      return CXP("depreciation", P("Une voiture neuve coûte " + M(nb(P0)) + " CHF. Chaque année, elle perd " + M(r + "\\,\\%") + " de sa valeur.",
        [["a) Valeur après " + n + " ans (CHF, à l'unité)", r0(Vn), 1], ["b) Au bout de combien d'années entières vaut-elle pour la première fois moins de la moitié de son prix neuf ?", nh], ["c) Perte totale après " + n + " ans, en % du prix neuf (au dixième)", r1(100 * (1 - q ** n)), 0.1]],
        ["Perdre " + r + " % chaque année, c'est multiplier par " + T(q) + " chaque année : V(n) = " + nbT(P0) + " · " + T(q) + "ⁿ.", "b) Calcule " + T(q) + "ⁿ pour n = 1, 2, 3… jusqu'à passer sous 0,5. c) 1 − " + T(q) + "^" + n + "."],
        "a) " + M(nb(P0) + " \\cdot " + D(q) + "^{" + n + "} \\approx " + nb(r0(Vn))) + " CHF. b) " + M(D(q) + "^{" + (nh - 1) + "} \\approx " + D(+(q ** (nh - 1)).toFixed(3))) + " et " + M(D(q) + "^{" + nh + "} \\approx " + D(+(q ** nh).toFixed(3))) + " : " + M(nh) + " ans. c) " + M("1 - " + D(q) + "^{" + n + "} \\approx " + D(r1(100 * (1 - q ** n)) / 100)) + ", soit " + M(D(r1(100 * (1 - q ** n))) + "\\,\\%") + "."));
    },
    () => { /* vidéo qui circule : vues multipliées chaque jour */
      const V0 = 50 * ri(4, 40), k = pk([2, 3]), d = ri(3, 6), Vd = V0 * k ** d;
      let j = 0; while (V0 * k ** j < 1e6) j++;
      return CXP("vues", P("Une vidéo a " + M(nb(V0)) + " vues le jour de sa mise en ligne (jour 0). Pendant les jours qui suivent, le nombre total de vues est multiplié par " + M(D(k)) + " chaque jour.",
        [["a) Nombre total de vues au jour " + d, Vd], ["b) Premier jour où la vidéo dépasse 1 million de vues", j], ["c) Par combien le nombre de vues est-il multiplié en une semaine ?", k ** 7]],
        ["V(n) = " + nbT(V0) + " · " + T(k) + "ⁿ, avec n le numéro du jour.", "b) Essaie des valeurs de n (ou résous avec les logarithmes) : V(n) > 1'000'000. c) Sept jours : " + T(k) + "⁷."],
        "a) " + M(nb(V0) + " \\cdot " + D(k) + "^{" + d + "} " + eqa(Vd, r0(Vd)) + nb(r0(Vd))) + ". b) " + M("V(" + (j - 1) + ") \\approx " + nb(r0(V0 * k ** (j - 1)))) + " et " + M("V(" + j + ") \\approx " + nb(r0(V0 * k ** j))) + " : jour " + M(j) + ". c) " + M(D(k) + "^7 " + eqa(k ** 7, r0(k ** 7)) + nb(r0(k ** 7))) + "."));
    });
  if (PROB.log) PROB.log = TAGX(PROB.log, "capital");
  TAGS("log", "doublement");
  ADDX("log",
    () => { /* magnitude d'un séisme */
      const c = pk([2, 3, 4, 5, 6, 8]), n = ri(3, 6), dm = ri(1, 3), m = ri(30, 55) / 10, k = pk([5, 20, 50, 200, 500]), Mg = Math.log10(c) + n;
      return CXP("seisme", P("La magnitude d'un séisme vaut " + M("M = \\log\\frac{A}{A_0}") + ", où " + M("A") + " est l'amplitude mesurée par le sismographe et " + M("A_0") + " une amplitude de référence.",
        [["a) Magnitude d'un séisme d'amplitude " + M("A = " + c + " \\cdot 10^{" + n + "} A_0") + " (au dixième)", r1(Mg), 0.1], ["b) Un séisme a une magnitude plus grande de " + M(dm) + " qu'un autre : son amplitude est combien de fois plus grande ?", 10 ** dm],
         ["c) Magnitude d'un séisme d'amplitude " + M(k) + " fois plus grande qu'un séisme de magnitude " + M(D(m)) + " (au dixième)", r1(m + Math.log10(k)), 0.1]],
        ["log(a · 10ⁿ) = log a + n.", "b) Une magnitude de plus = amplitude multipliée par 10. c) log(k · A) = log k + log A."],
        "a) " + M("\\log(" + c + " \\cdot 10^{" + n + "}) = \\log " + c + " + " + n + " \\approx " + D(r1(Mg))) + ". b) " + M("10^{" + dm + "} = " + nb(10 ** dm)) + " fois. c) " + M(D(m) + " + \\log " + k + " \\approx " + D(r1(m + Math.log10(k)))) + "."));
    });
  TAGS("vecteurs", "parallelogramme");
  if (PROBX.vecteurs) PROBX.vecteurs.push(
    () => { /* deux cordes tirent un anneau */
      let F1, F2, Rr; do { F1 = [10 * ri(2, 12), 10 * R.nz(-8, 8)]; F2 = [10 * R.nz(-10, 10), 10 * ri(2, 12)]; Rr = [F1[0] + F2[0], F1[1] + F2[1]]; } while (F1[0] * F2[0] + F1[1] * F2[1] === 0 || Rr[0] === 0 || Rr[1] === 0);
      const nR = Math.hypot(...Rr), ang = deg(Math.acos((F1[0] * F2[0] + F1[1] * F2[1]) / (Math.hypot(...F1) * Math.hypot(...F2))));
      return Object.assign(CXP("forces", P("Deux cordes tirent un anneau posé au sol avec les forces " + M("\\vec{F_1} = " + PT(F1)) + " et " + M("\\vec{F_2} = " + PT(F2)) + " (composantes en newtons).",
        [["a) Composante horizontale de la force résultante " + M("\\vec{F_1} + \\vec{F_2}") + " (N)", Rr[0]], ["b) Intensité (norme) de la résultante (N, au dixième)", r1(nR), 0.1], ["c) Angle entre les deux cordes (°, au dixième)", r1(ang), 0.1]],
        ["Résultante : on additionne les composantes. Norme : √(x² + y²).", "Angle : cos α = (F₁ · F₂) ÷ (‖F₁‖ · ‖F₂‖), avec le produit scalaire x₁x₂ + y₁y₂."],
        "a) " + M(F1[0] + " + " + pr(F2[0]) + " = " + Rr[0]) + " N. b) " + M("\\sqrt{" + Rr[0] + "^2 + " + pr(Rr[1]) + "^2} \\approx " + D(r1(nR))) + " N. c) " + M("\\cos\\alpha = \\frac{" + (F1[0] * F2[0] + F1[1] * F2[1]) + "}{\\sqrt{" + (F1[0] ** 2 + F1[1] ** 2) + "} \\cdot \\sqrt{" + (F2[0] ** 2 + F2[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + D(r1(ang)) + "°") + ".")), { co: [13, 14, 15] });
    },
    () => { /* drone : déplacements successifs */
      let u, v, k; do { u = [R.nz(-6, 6), R.nz(-6, 6)]; v = [R.nz(-8, 8), R.nz(-8, 8)]; k = pk([2, 3]); } while (u[0] * v[1] - u[1] * v[0] === 0 || u[0] + v[0] + k * u[0] === 0 || u[1] + v[1] + k * u[1] === 0);
      const E = [(1 + k) * u[0] + v[0], (1 + k) * u[1] + v[1]], dist = Math.hypot(...E), tot = (1 + k) * Math.hypot(...u) + Math.hypot(...v);
      return Object.assign(CXP("drone", P("Un drone part du point " + M("O(0 \\,;\\, 0)") + " (unité : 10 m). Il se déplace selon " + M("\\vec{u} = " + PT(u)) + ", puis selon " + M("\\vec{v} = " + PT(v)) + ", puis selon " + M(k + "\\vec{u}") + ".",
        [["a) Coordonnées du point d'arrivée (« x ; y »)", PAIR(E[0], E[1])], ["b) Distance entre le départ et l'arrivée (unités, au dixième)", r1(dist), 0.1], ["c) Longueur totale du trajet (unités, au dixième)", r1(tot), 0.1]],
        ["Arrivée : O + u + v + " + k + "u = " + (1 + k) + "u + v (on additionne les composantes).", "c) Additionne les normes des trois déplacements : ‖u‖ + ‖v‖ + " + k + "‖u‖."],
        "a) " + M((1 + k) + "\\vec{u} + \\vec{v} = " + PT(E)) + ". b) " + M("\\sqrt{" + E[0] ** 2 + " + " + E[1] ** 2 + "} \\approx " + D(r1(dist))) + ". c) " + M((1 + k) + "\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} + \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "} \\approx " + D(r1(tot))) + ".")), { co: [13, 14, 15] });
    });
  /* ---------- MP 3e–4e ---------- */
  ADD("eqratmp", "robinets",
    () => { /* bateau sur une rivière : aller et retour */
      const L = []; for (let x = 8; x <= 30; x++) for (let c = 2; c <= 6; c++) for (let Dk = 8; Dk <= 40; Dk++) { if (x - c < 4 || x < 3 * c) continue; const Tt = Dk / (x - c) + Dk / (x + c); if (Math.abs(Tt * 100 - Math.round(Tt * 100)) < 1e-9 && Tt >= 1.5 && Tt <= 6) L.push([x, c, Dk, Tt]); }
      const [x, c, Dk, Tt] = pk(L), bt = pk(["Un bateau de travail", "Un bac à moteur", "Une péniche de chantier", "Un canot de sauvetage"]);
      return CXP("bateau", P(bt + " remonte une rivière sur " + M(Dk) + " km, puis redescend les " + M(Dk) + " km. L'aller-retour dure " + M(D(Tt)) + " h. Le courant fait " + M(c) + " km/h.",
        [["a) Vitesse du bateau en eau calme (km/h)", x], ["b) Durée de la montée (h, au centième)", r2c(Dk / (x - c)), 0.01], ["c) Durée de la descente (h, au centième)", r2c(Dk / (x + c)), 0.01]],
        ["Avec x la vitesse en eau calme : en montant, le bateau avance à x − " + c + " km/h ; en descendant, à x + " + c + " km/h. Durée = distance ÷ vitesse.",
         Dk + " ÷ (x − " + c + ") + " + Dk + " ÷ (x + " + c + ") = " + T(Tt) + " : multiplie par (x − " + c + ")(x + " + c + "), puis résous l'équation du 2e degré (x > " + c + ")."],
        M("\\frac{" + Dk + "}{x - " + c + "} + \\frac{" + Dk + "}{x + " + c + "} = " + D(Tt) + " \\iff " + D(Tt) + "x^2 - " + 2 * Dk + "x - " + D(Tt * c * c) + " = 0") + " : a) " + M("x = " + x) + " km/h (l'autre solution est négative). b) " + M("\\frac{" + Dk + "}{" + (x - c) + "} " + eqa(Dk / (x - c), r2c(Dk / (x - c))) + D(r2c(Dk / (x - c)))) + " h. c) " + M("\\frac{" + Dk + "}{" + (x + c) + "} " + eqa(Dk / (x + c), r2c(Dk / (x + c))) + D(r2c(Dk / (x + c)))) + " h."));
    },
    () => { /* location d'un minibus partagée */
      const L = []; for (let n = 6; n <= 20; n++) for (let k = 1; k <= 4; k++) for (let Pp = 120; Pp <= 900; Pp += 10) { const d = Pp / n - Pp / (n + k); if (Pp % n === 0 && Pp % (n + k) === 0 && Number.isInteger(d) && d >= 2) L.push([n, k, Pp, d]); }
      const [n, k, Pp, d] = pk(L), obj = pk(["un minibus pour aller à un salon des métiers", "un minibus pour une sortie d'atelier", "une salle pour la fête de fin d'apprentissage", "un bus pour visiter une centrale électrique"]);
      return CXP("partage", P("Des collègues louent " + obj + " pour " + M(Pp) + " CHF, partagés à parts égales. Si " + (k === 1 ? "une personne de plus était venue" : k + " personnes de plus étaient venues") + ", chacun aurait payé " + M(d) + " CHF de moins.",
        [["a) Nombre de personnes", n], ["b) Part de chacun (CHF)", Pp / n], ["c) Part de chacun s'il y avait eu " + k + " personne" + (k > 1 ? "s" : "") + " de plus (CHF)", Pp / (n + k)]],
        ["Avec n personnes, chacun paie " + Pp + " ÷ n ; avec n + " + k + ", chacun paie " + Pp + " ÷ (n + " + k + ").", Pp + " ÷ n − " + Pp + " ÷ (n + " + k + ") = " + d + " : multiplie par n(n + " + k + "), puis résous l'équation du 2e degré (n entier positif)."],
        M("\\frac{" + Pp + "}{n} - \\frac{" + Pp + "}{n + " + k + "} = " + d + " \\iff " + d + "n^2 + " + d * k + "n - " + Pp * k + " = 0") + " : a) " + M("n = " + n) + ". b) " + M("\\frac{" + Pp + "}{" + n + "} = " + Pp / n) + " CHF. c) " + M("\\frac{" + Pp + "}{" + (n + k) + "} = " + Pp / (n + k)) + " CHF."));
    });
  ADD("logprop", "calculs",
    () => { /* avec log 2 ≈ 0,301 et log 3 ≈ 0,477 */
      const forms = []; for (let i = -3; i <= 5; i++) for (let j = -2; j <= 3; j++) for (let k = -2; k <= 1; k++) { const N = 2 ** i * 3 ** j * 10 ** k; if ((i || j) && N > 0.05 && N < 500 && Math.abs(N * 100 - Math.round(N * 100)) < 1e-9 && !(i === 0 && j === 1 && k === 0) && !(i === 1 && j === 0 && k === 0) && N !== 1) forms.push([N, i, j, k]); }
      const pick3 = shuf(forms).filter((f, ix, a) => a.findIndex((g) => g[0] === f[0]) === ix).slice(0, 3), ap = ([, i, j, k]) => +(0.301 * i + 0.477 * j + k).toFixed(3);
      const dec = (f) => { const t = []; if (f[1]) t.push(f[1] + " \\cdot 0{,}301"); if (f[2]) t.push(f[2] + " \\cdot 0{,}477"); if (f[3]) t.push(String(f[3])); return t.join(" + ").replace(/\+ -/g, "- "); };
      return CXP("approx", P("On donne " + M("\\log 2 \\approx 0{,}301") + " et " + M("\\log 3 \\approx 0{,}477") + " (logarithme décimal). Sans calculatrice, avec ces seules valeurs et les propriétés des logarithmes :",
        pick3.map((f, ix) => ["abc"[ix] + ") " + M("\\log " + D(f[0])) + " (au millième)", ap(f), 0.001]),
        ["Décompose chaque nombre en produit et quotient de 2, de 3 et de 10 (par ex. 0,6 = 2 · 3 ÷ 10).", "log(uv) = log u + log v, log(u/v) = log u − log v, log(uⁿ) = n log u, log 10 = 1."],
        pick3.map((f, ix) => "abc"[ix] + ") " + M("\\log " + D(f[0]) + " \\approx " + dec(f) + " = " + D(ap(f)))).join(". ") + "."));
    },
    () => { /* nombre de chiffres d'une grande puissance */
      const b = pk([2, 3, 7]), n = b === 2 ? ri(40, 200) : b === 3 ? ri(25, 120) : ri(15, 70), Dd = b === 2 ? 10 * ri(4, 12) : 10 * ri(3, 8);
      const L = n * Math.log10(b), nd = Math.floor(L) + 1, nmin = Math.ceil((Dd - 1) / Math.log10(b));
      return CXP("chiffres", P("On veut savoir combien de chiffres a le nombre " + M(b + "^{" + n + "}") + ", trop grand pour l'afficher en entier.",
        [["a) " + M("\\log\\left(" + b + "^{" + n + "}\\right)") + " (au centième)", r2c(L), 0.01], ["b) Nombre de chiffres de " + M(b + "^{" + n + "}"), nd], ["c) Plus petit exposant " + M("k") + " tel que " + M(b + "^k") + " ait au moins " + M(Dd) + " chiffres", nmin]],
        ["log(" + b + "ⁿ) = n · log " + b + ". Un nombre N ≥ 1 a k chiffres quand 10^(k−1) ≤ N < 10^k, c'est-à-dire k − 1 ≤ log N < k.", "c) Il faut log(" + b + "ᵏ) ≥ " + (Dd - 1) + " : k · log " + b + " ≥ " + (Dd - 1) + "."],
        "a) " + M(n + " \\cdot \\log " + b + " \\approx " + D(r2c(L))) + ". b) " + M("10^{" + Math.floor(L) + "} \\leq " + b + "^{" + n + "} < 10^{" + (Math.floor(L) + 1) + "}") + " : " + M(nd) + " chiffres. c) " + M("k \\geq \\frac{" + (Dd - 1) + "}{\\log " + b + "} \\approx " + D(r2c((Dd - 1) / Math.log10(b)))) + " : " + M("k = " + nmin) + "."));
    });
  ADD("croissexp", "capital",
    () => { /* médicament éliminé : décroissance */
      const Q0 = 50 * ri(4, 20), r = pk([8, 10, 12, 15, 18, 20, 25]), t = ri(3, 8), Q1 = Q0 / pk([4, 5, 8, 10]), H = pk([3, 4, 5, 6, 8]), q = 1 - r / 100;
      let n = 0; while (Q0 * q ** n >= Q1) n++;
      const rH = (1 - 0.5 ** (1 / H)) * 100;
      return CXP("medicament", P("Après une injection, un patient a " + M(Q0) + " mg de médicament dans le sang ; chaque heure, cette quantité diminue de " + M(r + "\\,\\%") + ".",
        [["a) Quantité après " + t + " h (mg, au dixième)", r1(Q0 * q ** t), 0.1], ["b) Après combien d'heures entières la quantité est-elle pour la première fois inférieure à " + M(D(Q1)) + " mg ?", n], ["c) Diminution horaire qui ferait diminuer la quantité de moitié en " + H + " h (%, au centième)", r2c(rH), 0.01]],
        ["Diminuer de " + r + " % = multiplier par " + T(q) + " : Q(t) = " + Q0 + " · " + T(q) + "ᵗ.", "b) " + T(q) + "ᵗ < " + T(Q1 / Q0) + " : logarithmes (attention, log " + T(q) + " < 0 : le sens change), puis l'entier supérieur. c) q^" + H + " = 0,5."],
        "a) " + M(Q0 + " \\cdot " + D(q) + "^{" + t + "} \\approx " + D(r1(Q0 * q ** t))) + " mg. b) " + M("t > \\frac{\\log " + D(Q1 / Q0) + "}{\\log " + D(q) + "} \\approx " + D(r2c(Math.log(Q1 / Q0) / Math.log(q)))) + " : " + M(n) + " h. c) " + M("q = 0{,}5^{1/" + H + "} \\approx " + D(+(0.5 ** (1 / H)).toFixed(5))) + " : " + M(D(r2c(rH)) + "\\,\\%") + "."));
    },
    () => { /* population d'une commune */
      const N0 = 100 * ri(20, 150), r = pk([0.8, 1.2, 1.5, 1.8, 2.2, 2.5]), n = ri(5, 20), Nb = Math.round((N0 * pk([1.2, 1.25, 1.3, 1.5])) / 100) * 100, m = pk([10, 15, 20]), N2 = Math.round((N0 * pk([1.1, 1.15, 1.2, 1.3])) / 100) * 100, q = 1 + r / 100;
      let y = 0; while (N0 * q ** y < Nb) y++;
      const rr = ((N2 / N0) ** (1 / m) - 1) * 100;
      return CXP("population", P("Une commune compte " + M(nb(N0)) + " habitants. Sa population augmente de " + M(D(r) + "\\,\\%") + " par an.",
        [["a) Population après " + n + " ans (à l'unité)", r0(N0 * q ** n), 1], ["b) Après combien d'années entières dépasse-t-elle " + M(nb(Nb)) + " habitants ?", y], ["c) Taux annuel qu'il faudrait pour atteindre " + M(nb(N2)) + " habitants en " + m + " ans (%, au centième)", r2c(rr), 0.01]],
        ["N(n) = " + nbT(N0) + " · " + T(q) + "ⁿ.", "b) " + T(q) + "ⁿ > " + T(+(Nb / N0).toFixed(4)) + " : logarithmes, puis l'entier supérieur. c) q^" + m + " = " + nbT(N2) + " ÷ " + nbT(N0) + "."],
        "a) " + M(nb(N0) + " \\cdot " + D(q) + "^{" + n + "} \\approx " + nb(r0(N0 * q ** n))) + ". b) " + M("n > \\frac{\\log(" + nb(Nb) + " \\div " + nb(N0) + ")}{\\log " + D(q) + "} \\approx " + D(r2c(Math.log(Nb / N0) / Math.log(q)))) + " : " + M(y) + " ans. c) " + M("q = \\left(\\frac{" + nb(N2) + "}{" + nb(N0) + "}\\right)^{1/" + m + "} \\approx " + D(+((N2 / N0) ** (1 / m)).toFixed(5))) + " : " + M(D(r2c(rr)) + "\\,\\%") + "."));
    });
  ADD("volmp", "silo",
    () => { /* citerne : cylindre et deux demi-boules */
      const d = pk([1.2, 1.5, 1.8, 2, 2.4]), Lc = pk([3, 4, 5, 6]), r = d / 2, V = Math.PI * r * r * Lc + (4 / 3) * Math.PI * r ** 3, S = 2 * Math.PI * r * Lc + 4 * Math.PI * r * r;
      return CXP("citerne", P("Une citerne à mazout est formée d'un cylindre de diamètre " + M(D(d) + " \\text{ m}") + " et de longueur " + M(Lc + " \\text{ m}") + ", fermé à chaque bout par une demi-boule de même diamètre.",
        [["a) Volume de la citerne (m³, au centième)", r2c(V), 0.01], ["b) Contenance en litres (à la centaine de litres)", Math.round(+(V * 10).toPrecision(12)) * 100, 100], ["c) Surface extérieure à peindre (m², au centième)", r2c(S), 0.01]],
        ["Les deux demi-boules forment une boule entière de rayon " + T(r) + " m : V = π r² L + 4/3 π r³.", "1 m³ = 1'000 L. Surface : surface latérale du cylindre (2π r L) + surface d'une boule (4π r²)."],
        "a) " + M("\\pi \\cdot " + D(r) + "^2 \\cdot " + Lc + " + \\frac{4}{3}\\pi \\cdot " + D(r) + "^3 \\approx " + D(r2c(V))) + " m³. b) " + M("\\approx " + nb(Math.round(+(V * 10).toPrecision(12)) * 100)) + " L. c) " + M("2\\pi \\cdot " + D(r) + " \\cdot " + Lc + " + 4\\pi \\cdot " + D(r) + "^2 \\approx " + D(r2c(S))) + " m²."));
    },
    () => { /* pièce d'acier percée */
      let Dm, dm, H; do { Dm = 2 * ri(15, 40); dm = 2 * ri(4, 15); H = 5 * ri(4, 24); } while (dm > Dm - 16);
      const V = (Math.PI * ((Dm / 2) ** 2 - (dm / 2) ** 2) * H) / 1000, m = V * 7.85, Kg = pk([20, 25, 50]), nP = Math.floor((Kg * 1000) / m);
      return CXP("piece", P("Une bague en acier est un cylindre de diamètre " + M(Dm + " \\text{ mm}") + " et de hauteur " + M(H + " \\text{ mm}") + ", percé sur toute sa hauteur d'un trou cylindrique de diamètre " + M(dm + " \\text{ mm}") + ". L'acier a une masse volumique de " + M("7{,}85 \\text{ g/cm}^3") + ".",
        [["a) Volume d'acier (cm³, au dixième)", r1(V), 0.1], ["b) Masse d'une bague (g, à l'unité)", r0(m), 1], ["c) Nombre de bagues complètes qu'on peut fabriquer avec " + Kg + " kg d'acier (sans chute)", nP]],
        ["Volume = grand cylindre − trou : π (R² − r²) h. Passe en cm (ou divise les mm³ par 1'000).", "Masse = volume · masse volumique. c) Divise " + Kg + "'000 g par la masse d'une bague (valeur non arrondie) et garde l'entier inférieur."],
        "a) " + M("\\pi(" + Dm / 2 + "^2 - " + dm / 2 + "^2) \\cdot " + H + " \\approx " + nb(r0(V * 1000))) + " mm³ " + M("\\approx " + D(r1(V))) + " cm³. b) " + M(D(r1(V)) + " \\cdot 7{,}85 \\approx " + r0(m)) + " g. c) " + M("\\frac{" + Kg + "\\text{'}000}{" + D(r2c(m)) + "} \\approx " + D(r2c((Kg * 1000) / m))) + " : " + M(nP) + " bagues."));
    });
  ADD("similmp", "verre",
    () => { /* maquette d'un bâtiment */
      const k = pk([50, 100, 200]), A = ri(40, 400), V = 10 * ri(50, 900), B = ri(80, 600);
      return CXP("maquette", P("La maquette d'un bâtiment est à l'échelle " + M("1\\,:\\," + k) + ". Sur la maquette, une façade a une aire de " + M(A + " \\text{ cm}^2") + " et le bâtiment un volume de " + M(nb(V) + " \\text{ cm}^3") + ".",
        [["a) Aire réelle de la façade (m²)", (A * k * k) / 10000], ["b) Volume réel du bâtiment (m³)", (V * k ** 3) / 1e6], ["c) Le toit réel a une aire de " + M(B + " \\text{ m}^2") + " : aire du toit sur la maquette (cm², au dixième)", r1((B * 10000) / (k * k)), 0.1]],
        ["Les longueurs sont multipliées par " + k + " : les aires par " + k + "², les volumes par " + k + "³.", "1 m² = 10'000 cm² ; 1 m³ = 1'000'000 cm³."],
        "a) " + M(A + " \\cdot " + k + "^2 = " + nb(A * k * k)) + " cm² " + M("= " + D((A * k * k) / 10000)) + " m². b) " + M(nb(V) + " \\cdot " + k + "^3 = " + nb(V * k ** 3)) + " cm³ " + M("= " + nb((V * k ** 3) / 1e6)) + " m³. c) " + M(nb(B * 10000) + " \\div " + k + "^2 " + eqa((B * 10000) / (k * k), r1((B * 10000) / (k * k))) + D(r1((B * 10000) / (k * k)))) + " cm²."));
    },
    () => { /* ombres à la même heure */
      let h, s, S, H; do { h = ri(15, 30) / 10; s = ri(10, 40) / 10; S = ri(40, 250) / 10; H = ri(12, 45); } while (Math.abs(h - s) < 0.3);
      const k = S / s, ha = h * k;
      return CXP("ombre", P("À la même heure, un poteau vertical de " + M(D(h) + " \\text{ m}") + " a une ombre de " + M(D(s) + " \\text{ m}") + " et un arbre une ombre de " + M(D(S) + " \\text{ m}") + ".",
        [["a) Hauteur de l'arbre (m, au dixième)", r1(ha), 0.1], ["b) Longueur de l'ombre d'un immeuble de " + H + " m (m, au dixième)", r1((H * s) / h), 0.1], ["c) Le triangle arbre-ombre est un agrandissement du triangle poteau-ombre : par combien son aire est-elle multipliée ? (au dixième)", r1(k * k), 0.1]],
        ["Les rayons du soleil sont parallèles : les triangles (objet, ombre, rayon) sont semblables. Rapport k = ombre de l'arbre ÷ ombre du poteau.", "Les aires sont multipliées par k²."],
        "a) " + M("k = \\frac{" + D(S) + "}{" + D(s) + "}") + ", " + M(D(h) + " \\cdot k \\approx " + D(r1(ha))) + " m. b) " + M(H + " \\cdot \\frac{" + D(s) + "}{" + D(h) + "} \\approx " + D(r1((H * s) / h))) + " m. c) " + M("k^2 \\approx " + D(r1(k * k))) + "."));
    });
  ADD("coordmp", "triangle",
    () => { /* terrain quadrilatère : périmètre, diagonale, aire */
      let A, B, C, Dp; do { A = [ri(0, 10), ri(0, 10)]; B = [A[0] + ri(20, 50), A[1] + ri(-8, 8)]; C = [B[0] + ri(-10, 6), B[1] + ri(20, 45)]; Dp = [A[0] + ri(-6, 8), C[1] + ri(-8, 8)]; } while (Dp[0] >= C[0] - 10);
      const d = (P1, P2) => Math.hypot(P2[0] - P1[0], P2[1] - P1[1]), per = d(A, B) + d(B, C) + d(C, Dp) + d(Dp, A), AC = d(A, C);
      const cr = (P1, P2, P3) => (P2[0] - P1[0]) * (P3[1] - P1[1]) - (P2[1] - P1[1]) * (P3[0] - P1[0]), Ai = (Math.abs(cr(A, B, C)) + Math.abs(cr(A, C, Dp))) / 2;
      return CXP("terrain", P("Le plan d'un terrain (repère orthonormé, unité : 1 m) donne ses quatre coins : " + M("A" + PT(A)) + ", " + M("B" + PT(B)) + ", " + M("C" + PT(C)) + " et " + M("D" + PT(Dp)) + ".",
        [["a) Longueur de clôture pour faire le tour du terrain (m, au dixième)", r1(per), 0.1], ["b) Longueur de la diagonale " + M("AC") + " (m, au dixième)", r1(AC), 0.1], ["c) Aire du terrain (m², au dixième)", r1(Ai), 0.1]],
        ["Périmètre : somme des quatre côtés, chacun par la formule de la distance.", "Aire : la diagonale [AC] coupe le terrain en deux triangles ; aire d'un triangle = ½ |x₁y₂ − x₂y₁| avec les composantes de deux de ses côtés."],
        "a) " + M("AB + BC + CD + DA \\approx " + D(r1(per))) + " m. b) " + M("AC = \\sqrt{" + (C[0] - A[0]) ** 2 + " + " + (C[1] - A[1]) ** 2 + "} \\approx " + D(r1(AC))) + " m. c) " + M("\\frac{" + Math.abs(cr(A, B, C)) + "}{2} + \\frac{" + Math.abs(cr(A, C, Dp)) + "}{2} = " + D(Ai)) + " m²."));
    },
    () => { /* perçages sur une plaque */
      let A, B, C; do { A = [ri(5, 30), ri(5, 30)]; B = [ri(40, 90), ri(5, 60)]; C = [ri(5, 90), ri(40, 80)]; } while ((A[0] + C[0]) % 2 || (A[1] + C[1]) % 2 || Math.hypot(B[0] - C[0], B[1] - C[1]) < 25 || Math.abs(C[0] - (A[0] + B[0]) / 2) < 3);
      const Mi = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], N = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], dAB = Math.hypot(B[0] - A[0], B[1] - A[1]), dCN = Math.hypot(C[0] - N[0], C[1] - N[1]);
      return CXP("percage", P("Sur une plaque d'aluminium, on doit percer trois trous de centres " + M("A" + PT(A)) + ", " + M("B" + PT(B)) + " et " + M("C" + PT(C)) + " (coordonnées en mm depuis le coin de la plaque).",
        [["a) Entraxe " + M("AB") + " (mm, au dixième)", r1(dAB), 0.1], ["b) Coordonnées du milieu de " + M("[AC]") + ", où l'on perce un quatrième trou (« x ; y »)", PAIR(Mi[0], Mi[1])], ["c) Distance de " + M("C") + " au milieu de " + M("[AB]") + " (mm, au dixième)", r1(dCN), 0.1]],
        ["Entraxe = distance entre deux centres : √((x₂ − x₁)² + (y₂ − y₁)²).", "Milieu : moyenne des coordonnées. c) Calcule d'abord le milieu de [AB]."],
        "a) " + M("\\sqrt{" + (B[0] - A[0]) ** 2 + " + " + (B[1] - A[1]) ** 2 + "} \\approx " + D(r1(dAB))) + " mm. b) " + M(PT(Mi)) + ". c) Milieu de [AB] : " + M(PT(N)) + ", distance " + M("\\approx " + D(r1(dCN))) + " mm."));
    });
  ADD("vectmp", "parallelogramme",
    () => { /* bateau et courant */
      let u, w, t; do { u = [R.nz(-12, 12), R.nz(-12, 12)]; w = [R.nz(-4, 4), R.nz(-4, 4)]; t = pk([20, 30, 40, 45, 90]); } while (Math.hypot(...u) < 8 || u[0] + w[0] === 0 || u[1] + w[1] === 0);
      const v = [u[0] + w[0], u[1] + w[1]], sp = Math.hypot(...v), dist = (sp * t) / 60;
      return CXP("courant", P("Un bateau de patrouille avance à la vitesse " + M("\\vec{u} = " + PT(u)) + " par rapport à l'eau ; le courant a la vitesse " + M("\\vec{w} = " + PT(w)) + " (composantes est et nord, en km/h).",
        [["a) Vitesse réelle " + M("\\vec{u} + \\vec{w}") + " (« x ; y »)", PAIR(v[0], v[1])], ["b) Vitesse réelle en km/h (norme, au dixième)", r1(sp), 0.1], ["c) Distance parcourue en " + t + " min (km, au dixième)", r1(dist), 0.1]],
        ["La vitesse réelle est la somme des deux vecteurs vitesse : on additionne les composantes.", "Norme : √(x² + y²). c) Distance = vitesse · durée (en heures)."],
        "a) " + M(PT(v)) + ". b) " + M("\\sqrt{" + v[0] ** 2 + " + " + v[1] ** 2 + "} \\approx " + D(r1(sp))) + " km/h. c) " + M("\\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "} \\cdot \\frac{" + t + "}{60} \\approx " + D(r1(dist))) + " km."));
    },
    () => { /* décomposer un vecteur dans une base */
      let u, v, a, b; do { u = [R.nz(-5, 5), R.nz(-5, 5)]; v = [R.nz(-5, 5), R.nz(-5, 5)]; a = R.nz(-4, 4); b = R.nz(-4, 4); } while (u[0] * v[1] - u[1] * v[0] === 0 || Math.abs(a) === 1 && Math.abs(b) === 1);
      const w = [a * u[0] + b * v[0], a * u[1] + b * v[1]], det = u[0] * v[1] - u[1] * v[0];
      return CXP("base", P("On donne " + M("\\vec{u} = " + PT(u)) + ", " + M("\\vec{v} = " + PT(v)) + " et " + M("\\vec{w} = " + PT(w)) + ". On cherche les nombres " + M("a") + " et " + M("b") + " tels que " + M("\\vec{w} = a\\vec{u} + b\\vec{v}") + ".",
        [["a) Déterminant de " + M("\\vec{u}") + " et " + M("\\vec{v}") + " (" + M("x_u y_v - y_u x_v") + ")", det], ["b) " + M("a"), a], ["c) " + M("b"), b]],
        ["Déterminant non nul : u et v ne sont pas colinéaires, la décomposition existe et elle est unique.", "Composante par composante : " + pT([u[0], 0]).replace("x", "a") + (v[0] < 0 ? " − " : " + ") + (Math.abs(v[0]) === 1 ? "" : Math.abs(v[0])) + "b = " + T(w[0]) + " et " + pT([u[1], 0]).replace("x", "a") + (v[1] < 0 ? " − " : " + ") + (Math.abs(v[1]) === 1 ? "" : Math.abs(v[1])) + "b = " + T(w[1]) + " (système)."],
        "a) " + M(pr(u[0]) + " \\cdot " + pr(v[1]) + " - " + pr(u[1]) + " \\cdot " + pr(v[0]) + " = " + det) + ". Système " + M(pr(u[0]) + "a + " + pr(v[0]) + "b = " + w[0]) + ", " + M(pr(u[1]) + "a + " + pr(v[1]) + "b = " + w[1]) + " : b) " + M("a = " + a) + ". c) " + M("b = " + b) + "."));
    });
  ADD("scalmp", "triangle",
    () => { /* travail d'une force */
      let F, d; do { F = [10 * R.nz(-8, 8), 10 * R.nz(-8, 8)]; d = [ri(2, 15), R.nz(-6, 6)]; } while (F[0] * d[0] + F[1] * d[1] <= 0 || Math.abs(F[0] * d[1] - F[1] * d[0]) < 1);
      const W = F[0] * d[0] + F[1] * d[1], nF = Math.hypot(...F), ang = deg(Math.acos(W / (nF * Math.hypot(...d))));
      return CXP("travail", P("Un treuil tire une charge avec la force " + M("\\vec{F} = " + PT(F)) + " (N) ; la charge se déplace de " + M("\\vec{d} = " + PT(d)) + " (m). Le travail de la force vaut " + M("W = \\vec{F} \\cdot \\vec{d}") + " (en joules).",
        [["a) Travail " + M("W") + " (J)", W], ["b) Angle entre la force et le déplacement (°, au dixième)", r1(ang), 0.1], ["c) Intensité de la force (N, au dixième)", r1(nF), 0.1]],
        ["Produit scalaire : x₁x₂ + y₁y₂.", "cos α = W ÷ (‖F‖ · ‖d‖)."],
        "a) " + M(F[0] + " \\cdot " + d[0] + " + " + pr(F[1]) + " \\cdot " + pr(d[1]) + " = " + W) + " J. b) " + M("\\cos\\alpha = \\frac{" + W + "}{\\sqrt{" + (F[0] ** 2 + F[1] ** 2) + "} \\cdot \\sqrt{" + (d[0] ** 2 + d[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + D(r1(ang)) + "°") + ". c) " + M("\\sqrt{" + (F[0] ** 2 + F[1] ** 2) + "} \\approx " + D(r1(nF))) + " N."));
    },
    () => { /* vecteurs orthogonaux avec un paramètre */
      let a, b, c, w, k; do { a = R.nz(-6, 6); b = R.nz(-6, 6); c = R.nz(-6, 6); w = [R.nz(-5, 5), R.nz(-5, 5)]; k = (-a * b) / c; } while (!Number.isInteger(2 * k) || k === 0 || a * w[0] + k * w[1] === 0 || Math.abs(a) === Math.abs(b));
      const u = [a, k], ps = a * w[0] + k * w[1], ang = deg(Math.acos(ps / (Math.hypot(...u) * Math.hypot(...w))));
      return CXP("orthogonal", P("On donne " + M("\\vec{u} = (" + a + " \\,;\\, k)") + ", " + M("\\vec{v} = " + PT([b, c])) + " et " + M("\\vec{w} = " + PT(w)) + ".",
        [["a) Valeur de " + M("k") + " pour que " + M("\\vec{u}") + " et " + M("\\vec{v}") + " soient orthogonaux (fraction acceptée)", k], ["b) Avec cette valeur, " + M("\\vec{u} \\cdot \\vec{w}") + " (fraction acceptée)", ps], ["c) Angle entre " + M("\\vec{u}") + " et " + M("\\vec{w}") + " (°, au dixième)", r1(ang), 0.1]],
        ["Orthogonaux ⇔ produit scalaire nul : " + a + " · " + tT(b) + " + k · " + tT(c) + " = 0.", "cos θ = (u · w) ÷ (‖u‖ · ‖w‖)."],
        "a) " + M(a + " \\cdot " + pr(b) + " + " + pr(c) + "k = 0 \\iff k = " + fx(k)) + ". b) " + M(a + " \\cdot " + pr(w[0]) + " + " + fx(k) + " \\cdot " + pr(w[1]) + " = " + fx(ps)) + ". c) " + M("\\theta \\approx " + D(r1(ang)) + "°") + "."));
    });
  ADD("projmp", "projete",
    () => { /* chemin le plus court jusqu'à une route */
      let A, B, C, u, cr; do { A = [ri(-20, 0), ri(-20, 0)]; u = [ri(3, 8), R.nz(-4, 6)]; B = [A[0] + 10 * u[0], A[1] + 10 * u[1]]; C = [ri(-10, 60), ri(10, 70)]; cr = u[0] * (C[1] - A[1]) - u[1] * (C[0] - A[0]); } while (Math.abs(cr) / Math.hypot(...u) < 10 || Math.abs(cr) / Math.hypot(...u) > 80);
      const L = Math.hypot(...u), dist = Math.abs(cr) / L, AH = (u[0] * (C[0] - A[0]) + u[1] * (C[1] - A[1])) / L, Pm = pk([45, 60, 80, 120]);
      return CXP("route", P("Une route rectiligne passe par " + M("A" + PT(A)) + " et " + M("B" + PT(B)) + " ; une ferme est en " + M("C" + PT(C)) + " (repère en m). On construit le chemin le plus court de la ferme à la route ; il la rejoint en " + M("H") + ".",
        [["a) Longueur du chemin " + M("CH") + " (m, au dixième)", r1(dist), 0.1], ["b) Distance " + M("AH") + " le long de la route (m, au dixième)", r1(Math.abs(AH)), 0.1], ["c) Coût du chemin à " + Pm + " CHF le mètre (CHF, à l'unité)", r0(dist * Pm), 1]],
        ["H est le projeté orthogonal de C sur (AB). Avec u = AB : AH = |AB · AC| ÷ ‖AB‖.", "CH : Pythagore dans le triangle ACH, ou |déterminant de AB et AC| ÷ ‖AB‖. c) Utilise la longueur non arrondie."],
        "a) " + M("CH = \\frac{|\\det(\\overrightarrow{AB}, \\overrightarrow{AC})|}{AB} \\approx " + D(r1(dist))) + " m. b) " + M("AH = \\frac{|\\overrightarrow{AB} \\cdot \\overrightarrow{AC}|}{AB} \\approx " + D(r1(Math.abs(AH)))) + " m. c) " + M(D(r2c(dist)) + " \\cdot " + Pm + " \\approx " + nb(r0(dist * Pm))) + " CHF."));
    },
    () => { /* chariot sur un rail : composante utile d'une force */
      let F, u; do { F = [10 * R.nz(-9, 9), 10 * R.nz(-9, 9)]; u = [R.nz(-4, 4), R.nz(-4, 4)]; } while (F[0] * u[0] + F[1] * u[1] <= 0 || F[0] * u[1] - F[1] * u[0] === 0);
      const nu = Math.hypot(...u), par = (F[0] * u[0] + F[1] * u[1]) / nu, perp = Math.abs(F[0] * u[1] - F[1] * u[0]) / nu, s = ri(3, 20);
      return CXP("rail", P("Un chariot ne peut rouler que le long d'un rail de direction " + M("\\vec{u} = " + PT(u)) + ". On le tire avec la force " + M("\\vec{F} = " + PT(F)) + " (N).",
        [["a) Composante utile de la force, le long du rail (N, au dixième)", r1(par), 0.1], ["b) Composante perpendiculaire au rail (N, au dixième)", r1(perp), 0.1], ["c) Travail de la force quand le chariot avance de " + s + " m sur le rail (J, à l'unité)", r0(par * s), 1]],
        ["Composante utile = projection scalaire de F sur u : (F · u) ÷ ‖u‖.", "Composante perpendiculaire : Pythagore avec ‖F‖, ou |déterminant| ÷ ‖u‖. c) Travail = composante utile · distance."],
        "a) " + M("\\frac{" + (F[0] * u[0] + F[1] * u[1]) + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "}} \\approx " + D(r1(par))) + " N. b) " + M("\\frac{" + Math.abs(F[0] * u[1] - F[1] * u[0]) + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "}} \\approx " + D(r1(perp))) + " N. c) " + M(D(r2c(par)) + " \\cdot " + s + " \\approx " + nb(r0(par * s))) + " J."));
    });
  const V3 = (p) => "(" + p.join(" \\,;\\, ") + ")", X3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], DOT3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], N3 = (a) => Math.hypot(...a), SUB3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  ADD("pvectmp", "calcul",
    () => { /* pan de toit triangulaire */
      let A, B, C, n; do { A = [0, 0, ri(3, 6)]; B = [ri(4, 12), 0, A[2]]; C = [ri(0, 12), ri(3, 8), A[2] + ri(2, 5)]; n = X3(SUB3(B, A), SUB3(C, A)); } while (n[2] === 0);
      const Ai = N3(n) / 2, tu = pk([10, 12, 14]);
      return CXP("toit", P("Un pan de toit triangulaire a pour sommets " + M("A" + V3(A)) + ", " + M("B" + V3(B)) + " et " + M("C" + V3(C)) + " (coordonnées en m, " + M("z") + " = hauteur).",
        [["a) Troisième composante de " + M("\\overrightarrow{AB} \\times \\overrightarrow{AC}"), n[2]], ["b) Aire du pan de toit (m², au centième)", r2c(Ai), 0.01], ["c) Nombre minimal de tuiles à commander, à raison de " + tu + " tuiles par m²", Math.ceil(+(Ai * tu).toPrecision(12))]],
        ["AB = B − A, AC = C − A ; produit vectoriel composante par composante.", "Aire du triangle = ½ ‖AB × AC‖. c) Arrondis vers le haut (valeur non arrondie de l'aire)."],
        M("\\overrightarrow{AB} = " + V3(SUB3(B, A)) + ", \\overrightarrow{AC} = " + V3(SUB3(C, A)) + ", \\overrightarrow{AB} \\times \\overrightarrow{AC} = " + V3(n)) + ". a) " + M(n[2]) + ". b) " + M("\\frac{1}{2}\\sqrt{" + DOT3(n, n) + "} \\approx " + D(r2c(Ai))) + " m². c) " + M(D(r2c(Ai)) + " \\cdot " + tu + " \\approx " + D(r2c(Ai * tu))) + " : " + M(Math.ceil(+(Ai * tu).toPrecision(12))) + " tuiles."));
    },
    () => { /* caisse en parallélépipède */
      let u, v, w, n, Vv; do { u = [ri(2, 6), R.nz(-2, 2), 0]; v = [R.nz(-2, 2), ri(2, 6), ri(0, 2)]; w = [ri(-2, 2), ri(-2, 2), ri(3, 7)]; n = X3(u, v); Vv = DOT3(n, w); } while (Vv === 0 || n.some((c) => c === 0));
      return CXP("caisse", P("Une caisse inclinée a la forme d'un parallélépipède construit sur les arêtes " + M("\\vec{u} = " + V3(u)) + ", " + M("\\vec{v} = " + V3(v)) + " et " + M("\\vec{w} = " + V3(w)) + " (en dm).",
        [["a) Première composante de " + M("\\vec{u} \\times \\vec{v}"), n[0]], ["b) Volume de la caisse (dm³)", Math.abs(Vv)], ["c) Aire de la face construite sur " + M("\\vec{u}") + " et " + M("\\vec{v}") + " (dm², au centième)", r2c(N3(n)), 0.01]],
        ["Produit vectoriel u × v composante par composante.", "Volume = |(u × v) · w| (produit mixte). Aire du parallélogramme = ‖u × v‖."],
        M("\\vec{u} \\times \\vec{v} = " + V3(n)) + ". a) " + M(n[0]) + ". b) " + M("|" + V3(n) + " \\cdot " + V3(w) + "| = " + Math.abs(Vv)) + " dm³. c) " + M("\\sqrt{" + DOT3(n, n) + "} \\approx " + D(r2c(N3(n)))) + " dm²."));
    });
  ADD("explogfn", "points",
    () => { /* refroidissement d'une pièce : T = 20 + a · bᵗ */
      let T0, T5, tt, Sx, a, b; do { T0 = 10 * ri(15, 60); T5 = ri(Math.round(T0 * 0.35), Math.round(T0 * 0.7)); a = T0 - 20; b = ((T5 - 20) / a) ** (1 / 5); Sx = pk([40, 50, 60, 80]); tt = Math.log((Sx - 20) / a) / Math.log(b); } while (T5 <= Sx + 10 || tt > 120);
      const pc = pk(["Une pièce sortie du four de trempe", "Une soudure", "Une pièce forgée"]);
      return CXP("refroidissement", P(pc + " refroidit dans un atelier à 20 °C. Sa température suit " + M("T(t) = 20 + a \\cdot b^t") + " (°C, " + M("t") + " en minutes). On mesure " + M(nb(T0) + "\\,°\\text{C}") + " à " + M("t = 0") + " et " + M(T5 + "\\,°\\text{C}") + " à " + M("t = 5") + ".",
        [["a) " + M("a"), a], ["b) " + M("b") + " (au millième)", +b.toFixed(3), 0.001], ["c) Après combien de minutes la pièce atteint-elle " + Sx + " °C ? (au dixième)", r1(tt), 0.1]],
        ["En t = 0 : b⁰ = 1, donc T(0) = 20 + a.", "En t = 5 : b⁵ = (" + T5 + " − 20) ÷ " + a + ". c) Résous 20 + a · bᵗ = " + Sx + " avec les logarithmes (valeur de b non arrondie)."],
        "a) " + M(nb(T0) + " - 20 = " + nb(a)) + ". b) " + M("b = \\left(\\frac{" + (T5 - 20) + "}{" + nb(a) + "}\\right)^{1/5} \\approx " + D(+b.toFixed(3))) + ". c) " + M("b^t = \\frac{" + (Sx - 20) + "}{" + nb(a) + "}") + ", " + M("t = \\frac{\\log(" + (Sx - 20) + " \\div " + nb(a) + ")}{\\log b} \\approx " + D(r1(tt))) + " min."));
    },
    () => { /* isotope : N = N₀ · bᵗ et demi-vie */
      const N0 = 100 * ri(5, 80), Th = pk([2, 3, 5, 6, 8, 12]), t1 = ri(1, 4) * Th + ri(1, Th - 1), Nx = N0 / pk([3, 5, 6, 10, 20]), b = 0.5 ** (1 / Th), tx = Math.log(Nx / N0) / Math.log(b);
      return CXP("isotope", P("Un isotope utilisé en radiographie industrielle a une demi-vie de " + M(Th) + " jours. Une source en contient " + M(nb(N0)) + " mg ; on écrit " + M("N(t) = " + nb(N0) + " \\cdot b^t") + " (" + M("t") + " en jours).",
        [["a) " + M("b") + " (au millième)", +b.toFixed(3), 0.001], ["b) Masse restante après " + t1 + " jours (mg, au dixième)", r1(N0 * b ** t1), 0.1], ["c) Après combien de jours reste-t-il " + M(D(r2c(Nx))) + " mg ? (au dixième)", r1(Math.log(r2c(Nx) / N0) / Math.log(b)), 0.1]],
        ["Demi-vie : N(" + Th + ") = " + nbT(N0) + " ÷ 2, donc b^" + Th + " = 0,5.", "c) " + nbT(N0) + " · bᵗ = " + T(r2c(Nx)) + " : isole bᵗ, puis logarithmes."],
        "a) " + M("b = 0{,}5^{1/" + Th + "} \\approx " + D(+b.toFixed(3))) + ". b) " + M(nb(N0) + " \\cdot 0{,}5^{" + t1 + "/" + Th + "} \\approx " + D(r1(N0 * b ** t1))) + " mg. c) " + M("t = \\frac{\\log(" + D(r2c(Nx)) + " \\div " + nb(N0) + ")}{\\log b} \\approx " + D(r1(Math.log(r2c(Nx) / N0) / Math.log(b)))) + " jours."));
    });
  ADD("eqirrmp", "deuxracines",
    () => { /* √(ax + b) = x − c : une solution parasite */
      let x1, x2, c, a, b; do { c = ri(-4, 6); x1 = c + ri(2, 9); x2 = c - ri(1, 6); a = x1 + x2 - 2 * c; b = c * c - x1 * x2; } while (a <= 0 || b === 0 || c === 0 || x1 === 0 || x2 === 0);
      return CXP("parasite", P("On résout " + M("\\sqrt{" + cfD(a) + "x " + (b < 0 ? "- " + -b : "+ " + b) + "} = x " + (c < 0 ? "+ " + -c : c === 0 ? "" : "- " + c)) + ".",
        [["a) Solutions de l'équation obtenue en élevant au carré (séparées par « ; »)", SET([x1, x2])], ["b) Solution(s) de l'équation de départ", SET([x1])], ["c) Valeur de la racine pour cette solution", x1 - c]],
        ["Élève les deux membres au carré : " + (a === 1 ? "" : a) + "x " + (b < 0 ? "− " + -b : "+ " + b) + " = (x " + (c < 0 ? "+ " + -c : "− " + c) + ")², puis résous l'équation du 2e degré.", "Vérifie chaque solution dans l'équation de départ : une racine carrée n'est jamais négative, il faut x " + (c < 0 ? "+ " + -c : "− " + c) + " ≥ 0."],
        "a) " + M(poly([1, -(2 * c + a), c * c - b]) + " = 0 \\iff (" + xm(x1) + ")(" + xm(x2) + ") = 0") + ". b) " + M("x = " + x2) + " donne " + M("x " + (c < 0 ? "+ " + -c : "- " + c) + " = " + (x2 - c) + " < 0") + " : rejetée ; il reste " + M("x = " + x1) + ". c) " + M("\\sqrt{" + (a * x1 + b) + "} = " + (x1 - c)) + "."));
    },
    () => { /* pendule : T = 2π√(L / 9,81) */
      const L1 = ri(20, 250) / 100, T2 = ri(12, 35) / 10, dT = 0.1;
      const P1 = 2 * Math.PI * Math.sqrt(L1 / 9.81), L2 = 9.81 * (T2 / (2 * Math.PI)) ** 2, Lr = 9.81 * ((P1 - dT) / (2 * Math.PI)) ** 2;
      return CXP("pendule", P("Pour un pendule simple de longueur " + M("L") + " (m), la durée d'une oscillation vaut " + M("T = 2\\pi\\sqrt{\\frac{L}{9{,}81}}") + " (s). Un horloger règle le balancier d'une horloge.",
        [["a) Durée d'une oscillation pour " + M("L = " + D(L1)) + " m (s, au centième)", r2c(P1), 0.01], ["b) Longueur pour une oscillation de " + M(D(T2)) + " s (m, au centième)", r2c(L2), 0.01], ["c) De combien de cm faut-il raccourcir un pendule de " + M(D(L1)) + " m pour que " + M("T") + " diminue de 0,1 s ? (cm, au dixième)", r1((L1 - Lr) * 100), 0.1]],
        ["b) Isole la racine (divise par 2π), puis élève au carré : L = 9,81 · (T ÷ 2π)².", "c) Calcule la longueur qui donne T − 0,1 s (valeur de T non arrondie), puis la différence en cm."],
        "a) " + M("2\\pi\\sqrt{\\frac{" + D(L1) + "}{9{,}81}} \\approx " + D(r2c(P1))) + " s. b) " + M("L = 9{,}81 \\cdot \\left(\\frac{" + D(T2) + "}{2\\pi}\\right)^2 \\approx " + D(r2c(L2))) + " m. c) " + M("9{,}81 \\cdot \\left(\\frac{T - 0{,}1}{2\\pi}\\right)^2 \\approx " + D(+Lr.toFixed(4))) + " m : " + M("\\approx " + D(r1((L1 - Lr) * 100))) + " cm."));
    });
  /* ---------- 3e Collège (et Tle France) : limites, continuité, dénombrement, géométrie de l'espace ---------- */
  TAGS("limitinf", "perfusion");
  ADDX("limitinf",
    () => { /* coût moyen de fabrication */
      const F = 100 * ri(20, 150), c = pk([2.5, 4, 6, 8, 12, 15, 18]), x1 = 50 * ri(2, 20), e = pk([0.5, 1, 2]), obj = pk(["casques de vélo", "gourdes isothermes", "lampes frontales", "coques de téléphone"]);
      const M1 = (F + c * x1) / x1, nmin = Math.ceil(F / e - 1e-9);
      return CXP("coutmoyen", P("Une petite entreprise fabrique des " + obj + ". Les frais fixes valent " + M(nb(F)) + " CHF et chaque objet coûte " + M(D(c)) + " CHF de matière. Le coût moyen d'un objet, pour " + M("x") + " objets, vaut " + M("C(x) = \\frac{" + nb(F) + " + " + D(c) + "x}{x}") + ".",
        [["a) " + M("C(" + x1 + ")") + " (CHF, au centime)", r2c(M1), 0.01], ["b) " + M("\\lim_{x \\to +\\infty} C(x)") + " (CHF)", c], ["c) Nombre minimal d'objets pour que le coût moyen soit au plus " + M(D(c + e)) + " CHF", nmin]],
        ["C(x) = " + nbT(F) + " ÷ x + " + T(c) + " : que devient " + nbT(F) + " ÷ x quand x devient très grand ?", "c) Résous " + nbT(F) + " ÷ x + " + T(c) + " ≤ " + T(c + e) + " (x > 0)."],
        "a) " + M("\\frac{" + nb(F) + " + " + D(c) + " \\cdot " + x1 + "}{" + x1 + "} " + eqa(M1, r2c(M1)) + D(r2c(M1))) + " CHF. b) " + M("C(x) = \\frac{" + nb(F) + "}{x} + " + D(c) + " \\to " + D(c)) + " CHF (les frais fixes se répartissent sur de plus en plus d'objets). c) " + M("\\frac{" + nb(F) + "}{x} \\leq " + D(e) + " \\iff x \\geq " + nb(F / e)) + " : " + M(nb(nmin)) + " objets."));
    },
    () => { /* fraction rationnelle : limite, équation */
      let p, q, x0, y; do { p = R.nz(-6, 9); q = R.nz(-9, 9); x0 = ri(2, 6); y = (p * x0 * x0 + q) / (x0 * x0 + 1); } while (p === q || !Number.isInteger(y) || y === p || y === q);
      return CXP("rationnelle", P("Soit " + M("f(x) = \\frac{" + poly([p, 0, q]) + "}{x^2 + 1}") + ".",
        [["a) " + M("f(0)"), q], ["b) " + M("\\lim_{x \\to +\\infty} f(x)"), p], ["c) Solution positive de " + M("f(x) = " + y), x0]],
        ["À l'infini : divise numérateur et dénominateur par x² (ou garde les termes de plus haut degré).", "c) Multiplie par x² + 1 (jamais nul), puis isole x²."],
        "a) " + M("f(0) = \\frac{" + q + "}{1} = " + q) + ". b) " + M("\\frac{" + p + "x^2}{x^2} \\to " + p)  + ". c) " + M(poly([p, 0, q]) + " = " + y + "(x^2 + 1) \\iff " + (p - y) + "x^2 = " + (y - q) + " \\iff x^2 = " + x0 * x0) + ", " + M("x = " + x0) + "."));
    });
  TAGS("continuite", "parking");
  ADDX("continuite",
    () => { /* cuve qui se remplit : deux régimes */
      let a, h, b, t2, S, t3; do { a = pk([0.5, 1.5, 2, 2.5, 3]); h = pk([4, 5, 6, 8, 10]); b = pk([5, 8, 10, 12, 15, 20]); t2 = h + ri(2, 8); t3 = h + ri(1, 10); S = a * h * h + b * (t3 - h); } while (t2 === t3 || b <= a * h * 0.5 || !Number.isInteger(a * h * h));
      const k = a * h * h - b * h;
      return CXP("cuve", P("Une cuve de récupération d'eau se remplit. Son volume vaut " + M("V(t) = " + D(a) + "t^2") + " (L) pour " + M("0 \\leq t \\leq " + h) + " (minutes), puis " + M("V(t) = " + b + "t + k") + " pour " + M("t > " + h) + ". Le volume ne fait pas de saut.",
        [["a) Valeur de " + M("k"), k], ["b) Volume à " + M("t = " + t2) + " min (L)", a * h * h + b * (t2 - h)], ["c) Instant où la cuve contient " + M(nb(S)) + " L (min)", t3]],
        ["Continuité en t = " + h + " : les deux formules donnent le même volume.", "c) " + nbT(S) + " L dépasse V(" + h + ") = " + T(a * h * h) + " L : utilise la 2e formule."],
        "a) " + M(D(a) + " \\cdot " + h + "^2 = " + b + " \\cdot " + h + " + k \\iff k = " + k) + ". b) " + M(b + " \\cdot " + t2 + " " + (k < 0 ? "- " + -k : "+ " + k) + " = " + (b * t2 + k)) + " L. c) " + M(b + "t " + (k < 0 ? "- " + -k : "+ " + k) + " = " + nb(S) + " \\iff t = " + t3) + " min."));
    },
    () => { /* paramètre de continuité d'une fonction définie par morceaux */
      let a, p, c, m, x1, xz; do { a = R.nz(-4, 4); p = ri(-3, 4); c = ri(1, 20); m = p * p - c - a * p; x1 = p + ri(1, 4); xz = -m / a; } while (m === 0 || !Number.isInteger(xz) || xz >= p || p * p === c);
      return CXP("parametre", P("Soit " + M("f(x) = " + cfD(a) + "x + m") + " pour " + M("x < " + p) + " et " + M("f(x) = x^2 - " + c) + " pour " + M("x \\geq " + p) + ".",
        [["a) Valeur de " + M("m") + " pour que " + M("f") + " soit continue en " + M(p), m], ["b) Avec cette valeur, " + M("f(" + x1 + ")"), x1 * x1 - c], ["c) Avec cette valeur, solution de " + M("f(x) = 0") + " située avant " + M(p), xz]],
        ["Continuité en " + p + " : la limite à gauche (" + (a === 1 ? "" : a === -1 ? "−" : tT(a) + " · ") + tT(p) + " + m) doit valoir f(" + p + ") = " + p * p + " − " + c + ".", "c) Pour x < " + p + ", résous " + (a === 1 ? "" : a === -1 ? "−" : T(a)) + "x + m = 0."],
        "a) " + M(pr(a) + " \\cdot " + pr(p) + " + m = " + p * p + " - " + c + " \\iff m = " + m) + ". b) " + M(x1 + "^2 - " + c + " = " + (x1 * x1 - c)) + ". c) " + M(cfD(a) + "x " + (m < 0 ? "- " + -m : "+ " + m) + " = 0 \\iff x = " + xz) + " (bien plus petit que " + M(p) + ")."));
    });
  const Cb2 = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  TAGS("combi", "comite");
  ADDX("combi",
    () => { /* codes d'un cadenas, d'un digicode */
      const k = pk([3, 4, 5]), d = pk([7, 3, 9, 5]), obj = pk(["Un cadenas à molettes", "Le digicode d'un local à vélos", "Une valise à code"]);
      return CXP("code", P(obj + " s'ouvre avec un code de " + M(k) + " chiffres (de 0 à 9, répétitions permises).",
        [["a) Nombre de codes possibles", 10 ** k], ["b) Nombre de codes dont les chiffres sont tous différents", Cb2(10, k) * [1, 1, 2, 6, 24, 120][k]], ["c) Nombre de codes qui contiennent au moins une fois le chiffre " + d, 10 ** k - 9 ** k]],
        ["a) " + k + " positions, 10 choix pour chacune. b) 10 choix pour le premier, 9 pour le deuxième…", "c) Passe par le contraire : les codes SANS le chiffre " + d + " (9 choix par position)."],
        "a) " + M("10^{" + k + "} = " + nb(10 ** k)) + ". b) " + M(Array.from({ length: k }, (_, i) => 10 - i).join(" \\cdot ") + " = " + nb(Cb2(10, k) * [1, 1, 2, 6, 24, 120][k])) + ". c) " + M("10^{" + k + "} - 9^{" + k + "} = " + nb(10 ** k) + " - " + nb(9 ** k) + " = " + nb(10 ** k - 9 ** k)) + "."));
    },
    () => { /* course : podiums et qualifiés */
      const n = ri(8, 16), nm = NOM(), sp = pk(["une course de ski de fond", "une finale de 400 m", "un cross de l'école", "une course de VTT"]);
      return CXP("podium", P(M(n) + " concurrents, dont " + nm + ", prennent part à " + sp + " (pas d'ex æquo).",
        [["a) Nombre de podiums possibles (or, argent, bronze)", n * (n - 1) * (n - 2)], ["b) Nombre de podiums où " + nm + " gagne l'or", (n - 1) * (n - 2)], ["c) Les 3 premiers sont qualifiés pour l'étape suivante : nombre de groupes de qualifiés possibles (sans ordre)", Cb2(n, 3)]],
        ["a) L'ordre compte : " + n + " choix pour l'or, puis " + (n - 1) + " pour l'argent, puis " + (n - 2) + " pour le bronze.", "c) L'ordre ne compte plus : chaque groupe de 3 correspond à 3! = 6 podiums."],
        "a) " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + nb(n * (n - 1) * (n - 2))) + ". b) " + M((n - 1) + " \\cdot " + (n - 2) + " = " + (n - 1) * (n - 2)) + ". c) " + M("\\binom{" + n + "}{3} = \\frac{" + nb(n * (n - 1) * (n - 2)) + "}{6} = " + nb(Cb2(n, 3))) + "."));
    });
  const P3 = (p) => "(" + p.map(D).join(" \\,;\\, ") + ")";
  TAGS("vect3d", "points");
  ADDX("vect3d",
    () => { /* salle : lampe et détecteur */
      let L, Dd; do { L = [ri(10, 70) / 10, ri(10, 50) / 10, ri(22, 28) / 10]; Dd = [ri(0, 80) / 10, ri(0, 60) / 10, 3]; } while (Math.hypot(L[0] - Dd[0], L[1] - Dd[1]) < 1.5);
      const d1 = Math.hypot(L[0] - Dd[0], L[1] - Dd[1], L[2] - Dd[2]), Mi = L.map((v, i) => (v + Dd[i]) / 2), dO = Math.hypot(...L);
      return CXP("salle", P("Dans une salle, on place un repère d'origine " + M("O") + " dans un coin du sol (axes le long des murs, " + M("z") + " vers le haut, en m). Une lampe pend en " + M("L" + P3(L)) + " et un détecteur de fumée est fixé au plafond en " + M("F" + P3(Dd)) + ".",
        [["a) Distance entre la lampe et le détecteur (m, au centième)", r2c(d1), 0.01], ["b) Hauteur (cote) du milieu de " + M("[LF]") + " (m)", Mi[2]], ["c) Distance du coin " + M("O") + " à la lampe (m, au centième)", r2c(dO), 0.01]],
        ["Vecteur LF = F − L, puis norme : √(x² + y² + z²).", "Milieu : moyenne des coordonnées."],
        "a) " + M("\\overrightarrow{LF} = " + P3(Dd.map((v, i) => r6(v - L[i]))) + ", LF \\approx " + D(r2c(d1))) + " m. b) " + M("\\frac{" + D(L[2]) + " + 3}{2} = " + D(Mi[2])) + " m. c) " + M("\\sqrt{" + D(L[0]) + "^2 + " + D(L[1]) + "^2 + " + D(L[2]) + "^2} \\approx " + D(r2c(dO))) + " m."));
    },
    () => { /* drone : deux déplacements */
      let A, u, v; do { A = [ri(-5, 5), ri(-5, 5), 0]; u = [R.nz(-6, 6), R.nz(-6, 6), ri(2, 8)]; v = [R.nz(-6, 6), R.nz(-6, 6), ri(-3, 4)]; } while (u[2] + v[2] <= 0 || v[2] === 0);
      const B = [A[0] + u[0] + v[0], A[1] + u[1] + v[1], u[2] + v[2]], tot = N3(u) + N3(v), dd = N3(SUB3(B, A));
      return CXP("drone", P("Un drone décolle du point " + M("A" + V3(A)) + " (en m, " + M("z") + " = altitude). Il se déplace selon " + M("\\vec{u} = " + V3(u)) + ", puis selon " + M("\\vec{v} = " + V3(v)) + ".",
        [["a) Altitude finale du drone (m)", B[2]], ["b) Longueur totale du trajet (m, au dixième)", r1(tot), 0.1], ["c) Distance entre le point de départ et le point d'arrivée (m, au dixième)", r1(dd), 0.1]],
        ["Point d'arrivée : A + u + v (on additionne les composantes).", "b) ‖u‖ + ‖v‖. c) ‖u + v‖ : c'est plus court que b) (inégalité triangulaire)."],
        "Arrivée " + M(V3(B)) + ". a) " + M(B[2]) + " m. b) " + M("\\sqrt{" + DOT3(u, u) + "} + \\sqrt{" + DOT3(v, v) + "} \\approx " + D(r1(tot))) + " m. c) " + M("\\sqrt{" + DOT3(SUB3(B, A), SUB3(B, A)) + "} \\approx " + D(r1(dd))) + " m."));
    });
  TAGS("droite3d", "parametrique");
  ADDX("droite3d",
    () => { /* avion en descente */
      let A, u, t; do { A = [ri(-20, 0), ri(-10, 10), ri(3, 9)]; u = [ri(4, 12), R.nz(-4, 4), -pk([0.5, 1])]; t = A[2] / -u[2]; } while (!Number.isInteger(t));
      const G = [A[0] + t * u[0], A[1] + t * u[1], 0], dh = t * Math.hypot(u[0], u[1]);
      return CXP("avion", P("Un avion en approche est au point " + M("A" + P3(A)) + " (en km, " + M("z") + " = altitude) et descend en ligne droite dans la direction " + M("\\vec{u} = " + P3(u)) + " : sa position est " + M("A + t\\vec{u}") + ".",
        [["a) Altitude de l'avion pour " + M("t = 2") + " (km)", A[2] + 2 * u[2]], ["b) Valeur de " + M("t") + " quand il touche la piste (" + M("z = 0") + ")", t], ["c) Distance horizontale parcourue jusqu'à la piste (km, au dixième)", r1(dh), 0.1]],
        ["Point pour t : A + t · u, composante par composante.", "b) Au sol, la cote est nulle : " + T(A[2]) + " − " + (u[2] === -1 ? "" : T(-u[2])) + "t = 0. c) Déplacement horizontal : t · √(u_x² + u_y²)."],
        "a) " + M(A[2] + " + 2 \\cdot " + pr(D(u[2])) + " = " + D(A[2] + 2 * u[2])) + " km. b) " + M(A[2] + " - " + D(-u[2]) + "t = 0 \\iff t = " + t) + ". c) Point de contact " + M(P3(G)) + ", " + M(t + " \\cdot \\sqrt{" + u[0] ** 2 + " + " + u[1] ** 2 + "} \\approx " + D(r1(dh))) + " km."));
    },
    () => { /* ombre d'un mât */
      let S, u, t; do { S = [ri(-3, 3), ri(-3, 3), ri(4, 12)]; u = [R.nz(-4, 4), R.nz(-4, 4), -pk([1, 2, 3])]; t = S[2] / -u[2]; } while (!Number.isInteger(2 * t));
      const O = [S[0] + t * u[0], S[1] + t * u[1], 0], Ls = t * Math.hypot(u[0], u[1]);
      return CXP("ombre", P("Le sommet d'un mât vertical est en " + M("S" + P3(S)) + " (en m, le sol est le plan " + M("z = 0") + "). Les rayons du soleil ont la direction " + M("\\vec{u} = " + P3(u)) + ". L'ombre du sommet est le point du sol sur la droite " + M("S + t\\vec{u}") + ".",
        [["a) Valeur de " + M("t") + " pour l'ombre du sommet (fraction acceptée)", t], ["b) Abscisse de l'ombre du sommet (fraction acceptée)", O[0]], ["c) Longueur de l'ombre du mât sur le sol (m, au dixième)", r1(Ls), 0.1]],
        ["Le point S + t · u est au sol quand sa cote vaut 0.", "c) Le pied du mât est en (" + S[0] + " ; " + S[1] + " ; 0) : distance entre ce pied et l'ombre du sommet."],
        "a) " + M(S[2] + " " + (u[2] < 0 ? "- " + -u[2] : "+ " + u[2]) + "t = 0 \\iff t = " + fx(t)) + ". b) " + M(S[0] + " + " + fx(t) + " \\cdot " + pr(u[0]) + " = " + fx(O[0])) + ". c) Ombre " + M(P3(O)) + " ; " + M(fx(t) + " \\cdot \\sqrt{" + u[0] ** 2 + " + " + u[1] ** 2 + "} \\approx " + D(r1(Ls))) + " m."));
    });
  const poly3 = (n, d) => { let o = ""; [[n[0], "x"], [n[1], "y"], [n[2], "z"], [d, ""]].forEach(([c, v]) => { if (!c) return; const a = Math.abs(c), t = (a === 1 && v ? "" : a) + v; o += o ? (c < 0 ? " - " : " + ") + t : (c < 0 ? "-" : "") + t; }); return o; };
  TAGS("plans", "normal");
  ADDX("plans",
    () => { /* plan par trois points : traces sur les axes */
      let A, B, C, n, d; do { A = [ri(-3, 3), ri(-3, 3), ri(-3, 3)]; B = [ri(-4, 4), ri(-4, 4), ri(-4, 4)]; C = [ri(-4, 4), ri(-4, 4), ri(-4, 4)]; n = X3(SUB3(B, A), SUB3(C, A)); d = -DOT3(n, A); } while (n.some((c) => c === 0) || d === 0);
      const x0 = ri(-3, 3), y0 = ri(-3, 3), z0 = -(n[0] * x0 + n[1] * y0 + d) / n[2];
      return CXP("troispoints", P("Le plan " + M("\\pi") + " passe par " + M("A" + V3(A)) + ", " + M("B" + V3(B)) + " et " + M("C" + V3(C)) + ".",
        [["a) Cote du point où " + M("\\pi") + " coupe l'axe " + M("Oz") + " (fraction acceptée)", -d / n[2]], ["b) Abscisse du point où " + M("\\pi") + " coupe l'axe " + M("Ox") + " (fraction acceptée)", -d / n[0]], ["c) Cote " + M("m") + " du point " + M("P(" + x0 + " \\,;\\, " + y0 + " \\,;\\, m)") + " de " + M("\\pi") + " (fraction acceptée)", z0]],
        ["Un vecteur normal : n = AB × AC (produit vectoriel). Puis d avec A : ax + by + cz + d = 0.", "Axe Oz : x = y = 0. Axe Ox : y = z = 0."],
        M("\\vec{n} = \\overrightarrow{AB} \\times \\overrightarrow{AC} = " + V3(n)) + ", " + M("\\pi : " + poly3(n, d) + " = 0") + ". a) " + M("z = " + fx(-d / n[2])) + ". b) " + M("x = " + fx(-d / n[0])) + ". c) " + M("m = " + fx(z0)) + "."));
    },
    () => { /* traces d'un plan et tétraèdre */
      let a, b, c, k; do { a = ri(1, 6); b = ri(1, 6); c = ri(1, 6); const l1 = (a * b) / gcd(a, b); k = ((l1 * c) / gcd(l1, c)) * ri(1, 3); } while (new Set([a, b, c]).size < 2 || k > 60 || k < 6);
      const X = k / a, Y = k / b, Z = k / c;
      return CXP("traces", P("On donne le plan " + M("\\pi : " + a + "x + " + b + "y + " + c + "z = " + k) + ".",
        [["a) Abscisse du point où " + M("\\pi") + " coupe l'axe " + M("Ox"), X], ["b) Cote du point où " + M("\\pi") + " coupe l'axe " + M("Oz"), Z], ["c) Volume du tétraèdre formé par " + M("\\pi") + " et les trois plans de coordonnées (fraction acceptée)", (X * Y * Z) / 6]],
        ["Sur l'axe Ox : y = z = 0. Sur l'axe Oz : x = y = 0.", "Le tétraèdre a pour sommets O et les trois points sur les axes : volume = (base · hauteur) ÷ 3, base = triangle rectangle d'aire X · Y ÷ 2."],
        "a) " + M(a + "x = " + k + " \\iff x = " + X) + ". b) " + M(c + "z = " + k + " \\iff z = " + Z) + ". Sur Oy : " + M("y = " + Y) + ". c) " + M("\\frac{1}{3} \\cdot \\frac{" + X + " \\cdot " + Y + "}{2} \\cdot " + Z + " = " + fx((X * Y * Z) / 6)) + "."));
    });
  TAGS("pscal3d", "triangle");
  ADDX("pscal3d",
    () => { /* pavé : angle entre deux diagonales */
      let l, w, h; do { l = ri(3, 12); w = ri(2, 9); h = ri(2, 9); } while (new Set([l, w, h]).size < 3);
      const ps = l * l + w * w, AG = Math.hypot(l, w, h), AC = Math.hypot(l, w), ang = deg(Math.acos(ps / (AG * AC))), obj = pk(["Une boîte de rangement", "Un aquarium", "Un carton de déménagement"]);
      return CXP("pave", P(obj + " a la forme d'un pavé " + M("ABCDEFGH") + " : " + M("A(0 \\,;\\, 0 \\,;\\, 0)") + ", " + M("C(" + l + " \\,;\\, " + w + " \\,;\\, 0)") + " (coin opposé du fond) et " + M("G(" + l + " \\,;\\, " + w + " \\,;\\, " + h + ")") + " (en dm).",
        [["a) " + M("\\overrightarrow{AG} \\cdot \\overrightarrow{AC}"), ps], ["b) Longueur de la grande diagonale " + M("AG") + " (dm, au centième)", r2c(AG), 0.01], ["c) Angle entre " + M("[AG]") + " et la diagonale du fond " + M("[AC]") + " (°, au dixième)", r1(ang), 0.1]],
        ["AG = (" + l + " ; " + w + " ; " + h + "), AC = (" + l + " ; " + w + " ; 0) : produit scalaire composante par composante.", "cos θ = (AG · AC) ÷ (AG · AC) (produit des longueurs)."],
        "a) " + M(l + " \\cdot " + l + " + " + w + " \\cdot " + w + " + " + h + " \\cdot 0 = " + ps) + ". b) " + M("\\sqrt{" + (l * l + w * w + h * h) + "} \\approx " + D(r2c(AG))) + " dm. c) " + M("\\cos\\theta = \\frac{" + ps + "}{\\sqrt{" + (l * l + w * w + h * h) + "} \\cdot \\sqrt{" + ps + "}}") + ", " + M("\\theta \\approx " + D(r1(ang)) + "°") + "."));
    },
    () => { /* câbles d'un mât */
      let h, Pp, Q; do { h = ri(6, 15); Pp = [R.nz(-8, 8), R.nz(-8, 8), 0]; Q = [R.nz(-8, 8), R.nz(-8, 8), 0]; } while (N3(X3(SUB3(Pp, [0, 0, h]), SUB3(Q, [0, 0, h]))) === 0 || Math.hypot(Pp[0] - Q[0], Pp[1] - Q[1]) < 4);
      const S = [0, 0, h], u = SUB3(Pp, S), v = SUB3(Q, S), ps = DOT3(u, v), ang = deg(Math.acos(ps / (N3(u) * N3(v))));
      return CXP("cables", P("Un mât vertical va du sol " + M("O(0 \\,;\\, 0 \\,;\\, 0)") + " à son sommet " + M("S(0 \\,;\\, 0 \\,;\\, " + h + ")") + " (en m). Deux câbles le tiennent, fixés au sol en " + M("P" + V3(Pp)) + " et " + M("Q" + V3(Q)) + ".",
        [["a) " + M("\\overrightarrow{SP} \\cdot \\overrightarrow{SQ}"), ps], ["b) Longueur du câble " + M("SP") + " (m, au centième)", r2c(N3(u)), 0.01], ["c) Angle " + M("\\widehat{PSQ}") + " entre les deux câbles (°, au dixième)", r1(ang), 0.1]],
        ["SP = P − S et SQ = Q − S (composantes).", "cos θ = (SP · SQ) ÷ (SP · SQ) (produit des longueurs)."],
        M("\\overrightarrow{SP} = " + V3(u) + ", \\overrightarrow{SQ} = " + V3(v)) + ". a) " + M(ps) + ". b) " + M("\\sqrt{" + DOT3(u, u) + "} \\approx " + D(r2c(N3(u)))) + " m. c) " + M("\\cos\\theta = \\frac{" + ps + "}{\\sqrt{" + DOT3(u, u) + "} \\cdot \\sqrt{" + DOT3(v, v) + "}}") + ", " + M("\\theta \\approx " + D(r1(ang)) + "°") + "."));
    });
  /* ---------- 3e Collège : dérivées, étude de fonctions ---------- */
  ADD("derivref", "benefice",
    () => { /* voiture qui accélère : d(t) = a t² */
      const a = pk([1.5, 2, 2.5, 3, 3.5, 4]), t1 = ri(3, 9), v = a * 2 * ri(3, 8), tv = v / (2 * a);
      return CXP("voiture", P("Au démarrage, une voiture parcourt " + M("d(t) = " + D(a) + "t^2") + " mètres en " + M("t") + " secondes (pendant les 10 premières secondes).",
        [["a) Vitesse instantanée à " + M("t = " + t1) + " s (m/s)", 2 * a * t1], ["b) Vitesse moyenne entre " + M("t = 0") + " et " + M("t = " + t1) + " s (m/s)", a * t1], ["c) Instant où la vitesse vaut " + M(D(v)) + " m/s (s)", tv]],
        ["La vitesse instantanée est la dérivée : d'(t) = " + T(2 * a) + "t.", "Vitesse moyenne = distance ÷ durée = d(" + t1 + ") ÷ " + t1 + "."],
        "a) " + M("d'(t) = " + D(2 * a) + "t") + ", " + M("d'(" + t1 + ") = " + D(2 * a * t1)) + " m/s. b) " + M("\\frac{" + D(a * t1 * t1) + "}{" + t1 + "} = " + D(a * t1)) + " m/s. c) " + M(D(2 * a) + "t = " + D(v) + " \\iff t = " + D(tv)) + " s."));
    },
    () => { /* tangente à l'hyperbole y = k/x */
      const k = pk([2, 3, 4, 6, 8, 12]), a = pk([1, 2, 3, 4].filter((x) => x * x !== k)), m = -k / (a * a), p = (2 * k) / a;
      return CXP("hyperbole", P("Soit " + M("f(x) = \\frac{" + k + "}{x}") + " pour " + M("x > 0") + ", et " + M("t") + " la tangente au graphe de " + M("f") + " au point d'abscisse " + M(a) + ".",
        [["a) " + M("f'(" + a + ")") + " (fraction acceptée)", m], ["b) Ordonnée à l'origine de " + M("t") + " (fraction acceptée)", p], ["c) Aire du triangle formé par " + M("t") + " et les deux axes", 2 * k]],
        ["(1/x)' = −1/x², donc f'(x) = −" + k + "/x².", "Tangente : y = f'(" + a + ")(x − " + a + ") + f(" + a + "). c) Elle coupe l'axe des abscisses en y = 0."],
        "a) " + M("f'(" + a + ") = -\\frac{" + k + "}{" + a * a + "} = " + fx(m)) + ". b) " + M("y = " + fx(m) + "(x - " + a + ") + " + fx(k / a)) + " : " + M("p = " + fx(p)) + ". c) " + M("y = 0") + " pour " + M("x = " + 2 * a) + " : aire " + M("\\frac{" + 2 * a + " \\cdot " + fx(p) + "}{2} = " + 2 * k) + "."));
    });
  TAGS("etudefct", "cubique");
  ADDX("etudefct",
    () => { /* fonction bicarrée : extremums et nombre de zéros */
      const a = ri(1, 3), c = pk([-(a ** 4) - ri(1, 6), 0, ri(1, Math.max(1, a ** 4 - 1)), a ** 4 + ri(1, 8)]), mn = c - a ** 4;
      const nz = c < 0 ? 2 : c === 0 ? 3 : mn < 0 ? 4 : mn === 0 ? 2 : 0;
      return CXP("bicarre", P("Soit " + M("f(x) = x^4 - " + 2 * a * a + "x^2" + (c === 0 ? "" : c < 0 ? " - " + -c : " + " + c)) + ".",
        [["a) Plus grande abscisse d'un minimum local", a], ["b) Valeur minimale de " + M("f"), mn], ["c) Nombre de solutions de " + M("f(x) = 0"), nz]],
        ["f'(x) = 4x³ − " + 4 * a * a + "x = 4x(x² − " + a * a + ") : trois zéros. Tableau de signes de f'.", "f est paire (graphe symétrique). c) Compare le minimum " + mn + " et le maximum local f(0) = " + c + " à 0."],
        M("f'(x) = 4x(x - " + a + ")(x + " + a + ")") + " : minimums en " + M("\\pm " + a) + ", maximum local en 0. a) " + M(a) + ". b) " + M("f(" + a + ") = " + a ** 4 + " - " + 2 * a ** 4 + (c === 0 ? "" : c < 0 ? " - " + -c : " + " + c) + " = " + mn) + ". c) " + M(nz) + " solution" + (nz > 1 ? "s" : "") + " (maximum local " + M(c) + ", minimum " + M(mn) + ")."));
    },
    () => { /* profil d'une rampe : h(x) = H(3(x/L)² − 2(x/L)³) */
      const L = pk([4, 5, 6, 8]), H = pk([1, 1.5, 2, 2.5, 3]), x1 = ri(1, L - 1), h = (x) => H * (3 * (x / L) ** 2 - 2 * (x / L) ** 3), sm = (1.5 * H) / L;
            return CXP("rampe", P("Le profil d'une rampe de skate est " + M("h(x) = " + D(H) + "\\left(\\frac{3x^2}{" + L * L + "} - \\frac{2x^3}{" + L ** 3 + "}\\right)") + " (en m) pour " + M("0 \\leq x \\leq " + L) + " : la rampe part du sol à plat et arrive à plat en haut.",
        [["a) Hauteur de la rampe en haut, " + M("h(" + L + ")") + " (m)", H], ["b) Abscisse où la pente est la plus forte (point d'inflexion, m)", L / 2], ["c) Pente la plus forte (au centième)", r2c(sm), 0.01], ["d) Hauteur à " + M("x = " + x1) + " m (m, au centième)", r2c(h(x1)), 0.01]],
        ["h'(x) = " + T(H) + " · (6x/" + L * L + " − 6x²/" + L ** 3 + ") : vérifie h'(0) = h'(" + L + ") = 0 (départ et arrivée à plat).", "La pente h' est maximale où h''(x) s'annule : " + T(H) + " · (6/" + L * L + " − 12x/" + L ** 3 + ") = 0."],
        "a) " + M("h(" + L + ") = " + D(H)) + " m. b) " + M("h''(x) = " + D(H) + "\\left(\\frac{6}{" + L * L + "} - \\frac{12x}{" + L ** 3 + "}\\right) = 0 \\iff x = " + D(L / 2)) + " m. c) " + M("h'(" + D(L / 2) + ") = " + D(r2c(sm))) + ". d) " + M("h(" + x1 + ") \\approx " + D(r2c(h(x1)))) + " m."));
    });
  /* ---------- 4e Collège : intégrales, exponentielles, probabilités ---------- */
  ADD("primitives", "chariot",
    () => { /* cuve : débit qui diminue */
      const b = pk([0.5, 1, 1.5, 2]), a = b * ri(8, 20), V0 = 10 * ri(5, 40), t1 = ri(2, Math.floor(a / b) - 1), T0 = a / b, Vt = (t) => V0 + a * t - (b * t * t) / 2;
      return CXP("debit", P("On remplit une cuve qui contient déjà " + M(V0) + " L. On ferme peu à peu le robinet : le débit vaut " + M("q(t) = " + D(a) + " - " + D(b) + "t") + " (L/min), jusqu'à ce qu'il s'annule.",
        [["a) Volume dans la cuve après " + t1 + " min (L)", Vt(t1)], ["b) Instant où le débit s'annule (min)", T0], ["c) Volume final dans la cuve (L)", Vt(T0)]],
        ["Le volume est une primitive du débit, avec V(0) = " + V0 + " : V(t) = " + V0 + " + " + T(a) + "t − " + (b === 2 ? "" : T(b / 2)) + "t².", "Ensuite, le volume ne change plus : calcule V au moment où q(t) = 0."],
        M("V(t) = " + V0 + " + " + D(a) + "t - " + (b === 2 ? "" : D(b / 2)) + "t^2") + ". a) " + M("V(" + t1 + ") = " + D(Vt(t1))) + " L. b) " + M(D(a) + " - " + D(b) + "t = 0 \\iff t = " + D(T0)) + " min. c) " + M("V(" + D(T0) + ") = " + D(Vt(T0))) + " L."));
    },
    () => { /* coût marginal */
      const a = pk([0.02, 0.04, 0.05, 0.1]), b = ri(3, 15), F = 100 * ri(5, 30), x1 = 10 * ri(5, 30), C = (x) => (a / 2) * x * x + b * x + F, obj = pk(["planches de skate", "sacs à dos", "lampes de bureau"]);
      return CXP("cout", P("Une entreprise fabrique des " + obj + ". Le coût marginal (coût de fabrication d'un objet de plus) vaut " + M("C'(x) = " + D(a) + "x + " + b) + " (CHF), et les frais fixes " + M("C(0) = " + nb(F)) + " CHF.",
        [["a) Coût total " + M("C(" + x1 + ")") + " (CHF)", C(x1)], ["b) Coût moyen d'un objet pour " + x1 + " objets (CHF, au centime)", r2c(C(x1) / x1), 0.01], ["c) Augmentation du coût total quand on passe de " + x1 + " à " + 2 * x1 + " objets (CHF)", C(2 * x1) - C(x1)]],
        ["Le coût total est la primitive de C' qui vaut " + nbT(F) + " en 0 : C(x) = " + T(a / 2) + "x² + " + b + "x + " + nbT(F) + ".", "c) C(" + 2 * x1 + ") − C(" + x1 + "), c'est aussi l'intégrale de C' entre " + x1 + " et " + 2 * x1 + "."],
        M("C(x) = " + D(a / 2) + "x^2 + " + b + "x + " + nb(F)) + ". a) " + M("C(" + x1 + ") = " + nb(C(x1))) + " CHF. b) " + M("\\frac{" + nb(C(x1)) + "}{" + x1 + "} " + eqa(C(x1) / x1, r2c(C(x1) / x1)) + D(r2c(C(x1) / x1))) + " CHF. c) " + M(nb(C(2 * x1)) + " - " + nb(C(x1)) + " = " + nb(C(2 * x1) - C(x1))) + " CHF."));
    });
  ADD("volrev", "verre",
    () => { /* bol en demi-boule */
      const R0 = pk([6, 7, 8, 9, 10, 12]), h = ri(2, R0 - 1), Vt = (2 / 3) * Math.PI * R0 ** 3, Vh = (Math.PI * h * h * (3 * R0 - h)) / 3;
      return CXP("bol", P("Un bol est une demi-boule de rayon " + M(R0) + " cm : on l'obtient en faisant tourner " + M("y = \\sqrt{" + R0 * R0 + " - x^2}") + " autour de l'axe des abscisses, pour " + M("x") + " de " + M(0) + " à " + M(R0) + " (le fond est en " + M("x = " + R0) + ").",
        [["a) Contenance du bol (cm³, à l'unité)", r0(Vt), 1], ["b) Volume de soupe quand elle atteint " + M(h) + " cm de hauteur, entre " + M("x = " + (R0 - h)) + " et " + M("x = " + R0) + " (cm³, à l'unité)", r0(Vh), 1], ["c) Quel pourcentage du bol est rempli quand la soupe atteint " + M(h) + " cm ? (%, au dixième)", r1((100 * Vh) / Vt), 0.1]],
        ["V = π ∫ y² dx avec y² = " + R0 * R0 + " − x². Une primitive : " + R0 * R0 + "x − x³/3.", "b) Intègre entre " + (R0 - h) + " et " + R0 + "."],
        "a) " + M("\\pi \\int_0^{" + R0 + "} (" + R0 * R0 + " - x^2)\\,dx = \\pi \\cdot " + fx((2 * R0 ** 3) / 3) + " \\approx " + nb(r0(Vt))) + " cm³. b) " + M("\\pi \\left[" + R0 * R0 + "x - \\frac{x^3}{3}\\right]_{" + (R0 - h) + "}^{" + R0 + "} \\approx " + nb(r0(Vh))) + " cm³. c) " + M("\\approx " + D(r1((100 * Vh) / Vt)) + "\\,\\%") + "."));
    },
    () => { /* entonnoir : y = kx */
      const k = pk([0.4, 0.5, 0.6, 0.75, 0.8]), H = ri(8, 16), V = (Math.PI * k * k * H ** 3) / 3, hm = H / Math.cbrt(2);
      return CXP("entonnoir", P("Un entonnoir est obtenu en faisant tourner la droite " + M("y = " + D(k) + "x") + " autour de l'axe des abscisses, pour " + M("x") + " de " + M(0) + " (la pointe) à " + M(H) + " cm (le bord).",
        [["a) Rayon du bord de l'entonnoir (cm)", k * H], ["b) Volume de l'entonnoir (cm³, au dixième)", r1(V), 0.1], ["c) Hauteur du liquide, depuis la pointe, quand l'entonnoir (bouché) est à moitié plein (cm, au dixième)", r1(hm), 0.1]],
        ["V = π ∫₀^" + H + " (" + T(k) + "x)² dx = π · " + T(+(k * k).toFixed(4)) + " · x³/3 entre 0 et " + H + ".", "c) Jusqu'à la hauteur h, le volume vaut π · " + T(+(k * k).toFixed(4)) + " · h³/3 : il faut h³ = " + H + "³ ÷ 2."],
        "a) " + M(D(k) + " \\cdot " + H + " = " + D(k * H)) + " cm. b) " + M("\\pi \\cdot " + D(+(k * k).toFixed(4)) + " \\cdot \\frac{" + H + "^3}{3} \\approx " + D(r1(V))) + " cm³. c) " + M("h = \\frac{" + H + "}{\\sqrt[3]{2}} \\approx " + D(r1(hm))) + " cm."));
    });
  ADD("croissance", "bacteries",
    () => { /* café qui refroidit */
      const a = ri(50, 70), k = pk([0.04, 0.05, 0.06, 0.08, 0.1]), t1 = ri(5, 20), S = pk([30, 35, 40, 45, 50]), Tt = (t) => 20 + a * Math.exp(-k * t), tS = Math.log((S - 20) / a) / -k;
      return CXP("cafe", P("Un café refroidit dans une pièce à 20 °C : sa température vaut " + M("T(t) = 20 + " + a + "e^{-" + D(k) + "t}") + " (°C, " + M("t") + " en minutes).",
        [["a) Température après " + t1 + " min (°C, au dixième)", r1(Tt(t1)), 0.1], ["b) Après combien de minutes le café est-il à " + S + " °C ? (au dixième)", r1(tS), 0.1], ["c) Vitesse de refroidissement au départ, " + M("T'(0)") + " (°C/min, au dixième)", r1(-a * k), 0.1]],
        ["b) Isole l'exponentielle : e^(−" + T(k) + "t) = (" + S + " − 20) ÷ " + a + ", puis ln.", "c) (e^(ct))' = c · e^(ct) : T'(t) = −" + T(+(a * k).toFixed(4)) + " e^(−" + T(k) + "t)."],
        "a) " + M("20 + " + a + "e^{-" + D(+(k * t1).toFixed(4)) + "} \\approx " + D(r1(Tt(t1)))) + " °C. b) " + M("t = \\frac{\\ln(" + (S - 20) + " \\div " + a + ")}{-" + D(k) + "} \\approx " + D(r1(tS))) + " min. c) " + M("T'(0) = -" + a + " \\cdot " + D(k) + " = " + D(-a * k)) + " °C/min."));
    },
    () => { /* médicament éliminé */
      const Q0 = 50 * ri(2, 12), k = pk([0.1, 0.15, 0.2, 0.25, 0.3]), t1 = ri(2, 10), S = Q0 / pk([4, 5, 10, 20]), Th = Math.log(2) / k, tS = Math.log(Q0 / S) / k;
      return CXP("medicament", P("La quantité de médicament dans le sang vaut " + M("Q(t) = " + Q0 + "e^{-" + D(k) + "t}") + " (mg, " + M("t") + " en heures après la prise).",
        [["a) Demi-vie du médicament (h, au centième)", r2c(Th), 0.01], ["b) Quantité après " + t1 + " h (mg, au dixième)", r1(Q0 * Math.exp(-k * t1)), 0.1], ["c) Après combien d'heures reste-t-il " + M(D(S)) + " mg ? (au centième)", r2c(tS), 0.01]],
        ["Demi-vie : e^(−" + T(k) + "t) = 1/2, donc t = ln 2 ÷ " + T(k) + ".", "c) e^(−" + T(k) + "t) = " + T(S) + " ÷ " + Q0 + " : applique ln."],
        "a) " + M("\\frac{\\ln 2}{" + D(k) + "} \\approx " + D(r2c(Th))) + " h. b) " + M(Q0 + "e^{-" + D(+(k * t1).toFixed(4)) + "} \\approx " + D(r1(Q0 * Math.exp(-k * t1)))) + " mg. c) " + M("t = \\frac{\\ln(" + Q0 + " \\div " + D(S) + ")}{" + D(k) + "} \\approx " + D(r2c(tS))) + " h."));
    });
  TAGS("appllin", "noyau");
  ADDX("appllin",
    () => { /* image du carré unité : aire */
      let a, b, c, d; do { a = R.nz(-4, 4); b = ri(-4, 4); c = ri(-4, 4); d = R.nz(-4, 4); } while (a * d - b * c === 0 || Math.abs(a * d - b * c) === 1 || b === 0 && c === 0);
      const det = a * d - b * c, S = pk([3, 4.5, 6, 7.5, 10]);
      return CXP("aire", P("L'application linéaire " + M("f") + " a pour matrice " + M("A = \\begin{pmatrix} " + a + " & " + b + " \\\\ " + c + " & " + d + " \\end{pmatrix}") + ". Elle transforme le carré unité " + M("OIKJ") + " (" + M("I(1 \\,;\\, 0)") + ", " + M("J(0 \\,;\\, 1)") + ") en un parallélogramme.",
        [["a) " + M("\\det A"), det], ["b) Aire de l'image du carré unité", Math.abs(det)], ["c) Aire de l'image d'un triangle d'aire " + M(D(S)), Math.abs(det) * S]],
        ["det A = a · d − b · c.", "Une application linéaire multiplie toutes les aires par |det A|."],
        "a) " + M(pr(a) + " \\cdot " + pr(d) + " - " + pr(b) + " \\cdot " + pr(c) + " = " + det) + ". b) " + M("|" + det + "| = " + Math.abs(det)) + ". c) " + M(Math.abs(det) + " \\cdot " + D(S) + " = " + D(Math.abs(det) * S)) + "."));
    },
    () => { /* antécédent d'un vecteur */
      let a, b, c, d, x, y; do { a = R.nz(-5, 5); b = R.nz(-5, 5); c = R.nz(-5, 5); d = R.nz(-5, 5); x = R.nz(-6, 6); y = R.nz(-6, 6); } while (a * d - b * c === 0 || Math.abs(a * d - b * c) > 20);
      const p = a * x + b * y, q = c * x + d * y;
      return CXP("antecedent", P("L'application linéaire " + M("f") + " a pour matrice " + M("A = \\begin{pmatrix} " + a + " & " + b + " \\\\ " + c + " & " + d + " \\end{pmatrix}") + ". On cherche le vecteur " + M("(x \\,;\\, y)") + " dont l'image est " + M("(" + p + " \\,;\\, " + q + ")") + ".",
        [["a) " + M("\\det A"), a * d - b * c], ["b) " + M("x"), x], ["c) " + M("y"), y]],
        ["det A ≠ 0 : f est bijective, l'antécédent existe et il est unique.", "Résous le système " + pT([a, 0]) + (b < 0 ? " − " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "y = " + T(p) + " et " + pT([c, 0]) + (d < 0 ? " − " : " + ") + (Math.abs(d) === 1 ? "" : Math.abs(d)) + "y = " + T(q) + " (Cramer ou A⁻¹)."],
        "a) " + M(pr(a) + " \\cdot " + pr(d) + " - " + pr(b) + " \\cdot " + pr(c) + " = " + (a * d - b * c)) + ". b) " + M("x = \\frac{" + pr(p) + " \\cdot " + pr(d) + " - " + pr(b) + " \\cdot " + pr(q) + "}{" + (a * d - b * c) + "} = " + x) + ". c) " + M("y = \\frac{" + pr(a) + " \\cdot " + pr(q) + " - " + pr(p) + " \\cdot " + pr(c) + "}{" + (a * d - b * c) + "} = " + y) + "."));
    });
  ADD("condbayes", "maladie",
    () => { /* deux machines, pièces défectueuses */
      const pa = pk([0.4, 0.55, 0.6, 0.65, 0.7]), d1 = pk([0.01, 0.02, 0.03, 0.04]), d2 = pk([0.02, 0.05, 0.06, 0.08]), pD = pa * d1 + (1 - pa) * d2, pAD = (pa * d1) / pD, pBn = ((1 - pa) * (1 - d2)) / (1 - pD);
      return CXP("machines", P("Deux machines fabriquent des pièces : la machine A en produit " + M(D(100 * pa) + "\\,\\%") + ", avec " + M(D(100 * d1) + "\\,\\%") + " de pièces défectueuses ; la machine B produit le reste, avec " + M(D(100 * d2) + "\\,\\%") + " de pièces défectueuses. On tire une pièce au hasard.",
        [["a) Probabilité que la pièce soit défectueuse, en % (au centième)", r2c(100 * pD), 0.01], ["b) Probabilité qu'elle vienne de A sachant qu'elle est défectueuse, en % (au dixième)", r1(100 * pAD), 0.1], ["c) Probabilité qu'elle vienne de B sachant qu'elle est bonne, en % (au dixième)", r1(100 * pBn), 0.1]],
        ["Arbre : machine d'abord, puis défectueuse ou non. a) Probabilités totales : additionne les deux chemins « défectueuse ».", "Bayes : P(A | défectueuse) = P(A et défectueuse) ÷ P(défectueuse)."],
        "a) " + M(D(pa) + " \\cdot " + D(d1) + " + " + D(+(1 - pa).toFixed(4)) + " \\cdot " + D(d2) + " = " + D(+pD.toFixed(6))) + ", soit " + M(D(r2c(100 * pD)) + "\\,\\%") + ". b) " + M("\\frac{" + D(+(pa * d1).toFixed(6)) + "}{" + D(+pD.toFixed(6)) + "} \\approx " + D(r1(100 * pAD)) + "\\,\\%") + ". c) " + M("\\frac{" + D(+(1 - pa).toFixed(4)) + " \\cdot " + D(+(1 - d2).toFixed(4)) + "}{" + D(+(1 - pD).toFixed(6)) + "} \\approx " + D(r1(100 * pBn)) + "\\,\\%") + "."));
    },
    () => { /* filtre anti-spam */
      const p = pk([0.3, 0.4, 0.45, 0.5, 0.6]), s = pk([0.9, 0.95, 0.98]), f = pk([0.01, 0.02, 0.03, 0.05]), pB = p * s + (1 - p) * f, pSB = (p * s) / pB, pSn = (p * (1 - s)) / (1 - pB);
      return CXP("spam", P("Dans une boîte mail, " + M(D(100 * p) + "\\,\\%") + " des messages reçus sont des spams. Le filtre bloque " + M(D(100 * s) + "\\,\\%") + " des spams, mais aussi " + M(D(100 * f) + "\\,\\%") + " des messages normaux.",
        [["a) Probabilité qu'un message soit bloqué, en % (au centième)", r2c(100 * pB), 0.01], ["b) Probabilité qu'un message bloqué soit un spam, en % (au dixième)", r1(100 * pSB), 0.1], ["c) Probabilité qu'un message NON bloqué soit un spam, en % (au centième)", r2c(100 * pSn), 0.01]],
        ["Arbre : spam ou normal, puis bloqué ou non. a) Additionne les deux chemins « bloqué ».", "b) P(spam | bloqué) = P(spam et bloqué) ÷ P(bloqué). c) Même idée avec « non bloqué » : P(non bloqué) = 1 − a)."],
        "a) " + M(D(p) + " \\cdot " + D(s) + " + " + D(+(1 - p).toFixed(4)) + " \\cdot " + D(f) + " = " + D(+pB.toFixed(6))) + ", soit " + M(D(r2c(100 * pB)) + "\\,\\%") + ". b) " + M("\\frac{" + D(+(p * s).toFixed(6)) + "}{" + D(+pB.toFixed(6)) + "} \\approx " + D(r1(100 * pSB)) + "\\,\\%") + ". c) " + M("\\frac{" + D(p) + " \\cdot " + D(+(1 - s).toFixed(4)) + "}{" + D(+(1 - pB).toFixed(6)) + "} \\approx " + D(r2c(100 * pSn)) + "\\,\\%") + "."));
    });
  ADD("varalea", "foire",
    () => { /* tombola */
      const N = pk([200, 250, 300, 400, 500]), pr0 = pk([2, 3, 5]), L1 = 10 * ri(10, 30), k2 = ri(3, 8), L2 = 5 * ri(4, 10), k3 = ri(10, 30), L3 = pk([5, 10]);
      const tot = L1 + k2 * L2 + k3 * L3, EG = tot / N - pr0, nw = 1 + k2 + k3;
      return CXP("tombola", P("Une tombola vend " + M(N) + " billets à " + M(pr0) + " CHF. Les lots : un vélo de " + M(L1) + " CHF, " + M(k2) + " bons de " + M(L2) + " CHF et " + M(k3) + " bons de " + M(L3) + " CHF. " + M("G") + " = gain net d'un billet (valeur du lot moins le prix du billet).",
        [["a) Probabilité qu'un billet gagne un lot (fraction acceptée)", nw / N], ["b) " + M("E(G)") + " (CHF, au centime)", r2c(EG), 0.01], ["c) Prix du billet qui rendrait le jeu équitable (CHF, au centime)", r2c(tot / N), 0.01]],
        ["a) " + nw + " billets gagnants sur " + N + ".", "E(G) = (somme des lots ÷ nombre de billets) − prix du billet. Équitable : E(G) = 0."],
        "a) " + M(frac(nw, N)) + ". b) Lots : " + M(L1 + " + " + k2 + " \\cdot " + L2 + " + " + k3 + " \\cdot " + L3 + " = " + tot) + " CHF ; " + M("E(G) = \\frac{" + tot + "}{" + N + "} - " + pr0 + " " + eqa(EG, r2c(EG)) + D(r2c(EG))) + " CHF. c) " + M("\\frac{" + tot + "}{" + N + "} " + eqa(tot / N, r2c(tot / N)) + D(r2c(tot / N))) + " CHF."));
    },
    () => { /* assurance d'un vélo : espérance et écart-type */
      const q1 = pk([0.02, 0.03, 0.04, 0.05]), V = 100 * ri(8, 20), q2 = pk([0.05, 0.08, 0.1, 0.12]), Cc = 10 * ri(10, 40), prime = 10 * ri(6, 15);
      const E = q1 * V + q2 * Cc, E2 = q1 * V * V + q2 * Cc * Cc, sd = Math.sqrt(E2 - E * E);
      return CXP("assurance", P("Une assurance pour vélo coûte " + M(prime) + " CHF par an. Pendant l'année, le vélo est volé avec la probabilité " + M(D(q1)) + " (l'assurance rembourse " + M(nb(V)) + " CHF) ou abîmé avec la probabilité " + M(D(q2)) + " (elle rembourse " + M(Cc) + " CHF) ; sinon rien. " + M("X") + " = montant remboursé.",
        [["a) " + M("E(X)") + " (CHF)", E], ["b) Gain moyen de l'assurance par contrat (CHF)", prime - E], ["c) Écart-type de " + M("X") + " (CHF, au centime)", r2c(sd), 0.01]],
        ["X vaut " + nbT(V) + ", " + Cc + " ou 0 avec les probabilités " + T(q1) + ", " + T(q2) + " et " + T(+(1 - q1 - q2).toFixed(4)) + ".", "V(X) = E(X²) − E(X)², puis la racine carrée."],
        "a) " + M(nb(V) + " \\cdot " + D(q1) + " + " + Cc + " \\cdot " + D(q2) + " = " + D(E)) + " CHF. b) " + M(prime + " - " + D(E) + " = " + D(prime - E)) + " CHF. c) " + M("E(X^2) = " + D(+E2.toFixed(4))) + ", " + M("\\sigma = \\sqrt{" + D(+E2.toFixed(4)) + " - " + D(E) + "^2} \\approx " + D(r2c(sd))) + " CHF."));
    });
  const Cbn = (n, k) => Cb2(n, k);
  ADD("binomiale", "avion",
    () => { /* germination de graines */
      const n = pk([6, 8, 10, 12]), p = pk([0.7, 0.75, 0.8, 0.85, 0.9]), pn = p ** n, pn1 = pn + n * p ** (n - 1) * (1 - p), sp = pk(["graines de tomate", "graines de basilic", "bulbes de tulipe"]);
      return CXP("graines", P("Chaque " + (sp === "bulbes de tulipe" ? "bulbe" : "graine") + " d'un sachet de " + sp + " germe avec la probabilité " + M(D(p)) + ", indépendamment des autres. On en plante " + M(n) + ". " + M("X") + " = nombre de " + (sp === "bulbes de tulipe" ? "bulbes" : "graines") + " qui germent.",
        [["a) " + M("E(X)"), r6(n * p)], ["b) " + M("P(X = " + n + ")") + " en % (au dixième)", r1(100 * pn), 0.1], ["c) " + M("P(X \\geq " + (n - 1) + ")") + " en % (au dixième)", r1(100 * pn1), 0.1]],
        ["X suit une loi binomiale B(" + n + " ; " + T(p) + ") : E(X) = n · p.", "P(X ≥ " + (n - 1) + ") = P(X = " + (n - 1) + ") + P(X = " + n + "), avec P(X = k) = C(n ; k) · pᵏ · (1 − p)ⁿ⁻ᵏ."],
        "a) " + M(n + " \\cdot " + D(p) + " = " + D(r6(n * p)))  + ". b) " + M(D(p) + "^{" + n + "} \\approx " + D(+pn.toFixed(4))) + ", soit " + M(D(r1(100 * pn)) + "\\,\\%") + ". c) " + M(n + " \\cdot " + D(p) + "^{" + (n - 1) + "} \\cdot " + D(+(1 - p).toFixed(2)) + " + " + D(p) + "^{" + n + "} \\approx " + D(+pn1.toFixed(4))) + ", soit " + M(D(r1(100 * pn1)) + "\\,\\%") + "."));
    },
    () => { /* lancers francs */
      const n = pk([5, 6, 8, 10]), p = pk([0.6, 0.65, 0.7, 0.75, 0.8]), k = ri(2, n - 2), pk_ = Cbn(n, k) * p ** k * (1 - p) ** (n - k), pn = p ** n, pn1 = n * p ** (n - 1) * (1 - p), nm = pk(["Une basketteuse", "Un basketteur"]);
      return CXP("lancers", P(nm + " réussit un lancer franc avec la probabilité " + M(D(p)) + ", indépendamment d'un lancer à l'autre. " + (nm === "Une basketteuse" ? "Elle" : "Il") + " tire " + M(n) + " lancers francs.",
        [["a) Probabilité d'en réussir exactement " + k + ", en % (au dixième)", r1(100 * pk_), 0.1], ["b) Probabilité que tous les lancers soient réussis, en % (au dixième)", r1(100 * pn), 0.1], ["c) Probabilité d'en rater un seul, en % (au dixième)", r1(100 * pn1), 0.1]],
        ["Nombre de réussites : loi binomiale B(" + n + " ; " + T(p) + "). P(X = k) = C(n ; k) · pᵏ · (1 − p)ⁿ⁻ᵏ.", "c) En rater un seul, c'est en réussir exactement " + (n - 1) + "."],
        "a) " + M("\\binom{" + n + "}{" + k + "} \\cdot " + D(p) + "^{" + k + "} \\cdot " + D(+(1 - p).toFixed(2)) + "^{" + (n - k) + "} \\approx " + D(+pk_.toFixed(4))) + ", soit " + M(D(r1(100 * pk_)) + "\\,\\%") + ". b) " + M(D(p) + "^{" + n + "} \\approx " + D(+pn.toFixed(4))) + ", soit " + M(D(r1(100 * pn)) + "\\,\\%") + ". c) " + M(n + " \\cdot " + D(p) + "^{" + (n - 1) + "} \\cdot " + D(+(1 - p).toFixed(2)) + " \\approx " + D(+pn1.toFixed(4))) + ", soit " + M(D(r1(100 * pn1)) + "\\,\\%") + "."));
    });
  const HH = { 1: 34, 2: 47.5, 3: 49.85 };
  ADD("normale", "paquets",
    () => { /* tailles */
      const mu = ri(165, 178), s = ri(5, 8), N = pk([400, 1000, 2000]); let k1, k2; do { k1 = pk([1, 2]); k2 = pk([1, 2, 3]); } while (k1 === k2);
      return CXP("tailles", P("La taille " + M("X") + " des jeunes de 18 ans d'une région suit une loi normale de moyenne " + M(mu + " \\text{ cm}") + " et d'écart-type " + M(s + " \\text{ cm}") + ".",
        [["a) " + M("P(" + (mu - k1 * s) + " \\leq X \\leq " + (mu + k2 * s) + ")") + " en %", HH[k1] + HH[k2]], ["b) Sur " + M(nb(N)) + " jeunes, combien mesurent plus de " + M(mu + 2 * s) + " cm ?", (N * 2.5) / 100], ["c) Taille dépassée par 16 % des jeunes (cm)", mu + s]],
        ["Exprime chaque borne en écarts-types depuis la moyenne. Règle : 68 % à ±1σ, 95 % à ±2σ, 99,7 % à ±3σ ; la courbe est symétrique.", "Au-delà de μ + 2σ : (100 − 95) ÷ 2 = 2,5 %. Au-delà de μ + σ : (100 − 68) ÷ 2 = 16 %."],
        "a) " + M(D(HH[k1]) + " + " + D(HH[k2]) + " = " + D(HH[k1] + HH[k2])) + " %. b) " + M(nb(N) + " \\cdot 0{,}025 = " + D((N * 2.5) / 100)) + " jeunes. c) " + M("\\mu + \\sigma = " + (mu + s)) + " cm."));
    },
    () => { /* durée d'un trajet */
      const mu = ri(20, 45), s = pk([2, 3, 4, 5]), k = pk([1, 2, 3]), Nj = pk([160, 180, 200]), late = { 1: 16, 2: 2.5, 3: 0.15 }[k];
      return CXP("trajet", P("La durée " + M("X") + " du trajet en bus d'un élève suit une loi normale de moyenne " + M(mu) + " min et d'écart-type " + M(s) + " min. Il part " + M(mu + k * s) + " min avant le début des cours.",
        [["a) Probabilité d'arriver à l'heure, en %", 100 - late], ["b) Sur " + Nj + " jours d'école, nombre de retards attendus (au dixième)", r1((Nj * late) / 100), 0.1], ["c) Combien de minutes avant le début des cours doit-il partir pour être à l'heure 97,5 % du temps ?", mu + 2 * s]],
        [(mu + k * s) + " min = μ + " + k + "σ. Règle : 68 % à ±1σ, 95 % à ±2σ, 99,7 % à ±3σ, et symétrie.", "Au-delà de μ + kσ : (100 − pourcentage central) ÷ 2."],
        "a) " + M("P(X \\leq \\mu + " + (k === 1 ? "" : k) + "\\sigma) = 100 - " + D(late) + " = " + D(100 - late)) + " %. b) " + M(Nj + " \\cdot " + D(late / 100) + " = " + D((Nj * late) / 100)) + " retards. c) " + M("\\mu + 2\\sigma = " + (mu + 2 * s)) + " min."));
    });
  ADD("lnexp", "lnmin",
    () => { /* concentration C(t) = a t e^(−bt) */
      const a = ri(4, 20), b = pk([0.2, 0.25, 0.4, 0.5]), tm = 1 / b, Cm = a / (b * Math.E), t1 = ri(1, 8), C = (t) => a * t * Math.exp(-b * t);
      return CXP("concentration", P("Après la prise d'un comprimé, la concentration d'un médicament dans le sang vaut " + M("C(t) = " + a + "t\\,e^{-" + D(b) + "t}") + " (mg/L, " + M("t") + " en heures).",
        [["a) Instant où la concentration est maximale (h)", tm], ["b) Concentration la plus élevée (mg/L, au centième)", r2c(Cm), 0.01], ["c) Concentration après " + t1 + " h (mg/L, au centième)", r2c(C(t1)), 0.01]],
        ["Dérivée d'un produit : C'(t) = " + a + "e^(−" + T(b) + "t) − " + (a * b === 1 ? "" : T(+(a * b).toFixed(4))) + "t e^(−" + T(b) + "t) = " + a + "e^(−" + T(b) + "t)(1 − " + T(b) + "t).", "e^(…) > 0 : C' change de signe en 1 − " + T(b) + "t = 0."],
        "a) " + M("1 - " + D(b) + "t = 0 \\iff t = " + D(tm)) + " h. b) " + M("C(" + D(tm) + ") = " + D(a * tm) + "e^{-1} \\approx " + D(r2c(Cm))) + " mg/L. c) " + M("C(" + t1 + ") = " + a * t1 + "e^{-" + D(+(b * t1).toFixed(4)) + "} \\approx " + D(r2c(C(t1)))) + " mg/L."));
    },
    () => { /* f(x) = (x − a) eˣ */
      let a, x1; do { a = R.nz(-3, 4); x1 = ri(-2, 3); } while (x1 === a - 1);
      return CXP("xexp", P("Soit " + M("f(x) = (" + xm(a) + ")e^x") + ".",
        [["a) " + M("f'(" + x1 + ")") + " (au centième)", r2c((x1 - a + 1) * Math.exp(x1)), 0.01], ["b) Abscisse du minimum de " + M("f"), a - 1], ["c) Valeur du minimum (au centième)", r2c(-Math.exp(a - 1)), 0.01]],
        ["Dérivée d'un produit : (uv)' = u'v + uv', avec (eˣ)' = eˣ.", "f'(x) = (" + xmT(a - 1) + ")eˣ : eˣ > 0, le signe de f' est celui de " + xmT(a - 1) + "."],
        M("f'(x) = e^x + (" + xm(a) + ")e^x = (" + xm(a - 1) + ")e^x") + ". a) " + M("f'(" + x1 + ") = " + (x1 - a + 1) + "e^{" + x1 + "} \\approx " + D(r2c((x1 - a + 1) * Math.exp(x1)))) + ". b) " + M("x = " + (a - 1)) + " (f' passe de − à +). c) " + M("f(" + (a - 1) + ") = -e^{" + (a - 1) + "} \\approx " + D(r2c(-Math.exp(a - 1)))) + "."));
    });
  /* RFIX sur toutes les formes (anciennes et nouvelles) des notions traitées par agent defisch3 */
  for (const id of ["stats", "statfreq", "quartiles", "triaire", "droites", "droitesinter", "recipaff", "trigassoc", "trigeq2", "fracrat", "vabs", "eqparam", "cart", "expo", "log", "vecteurs",
    "eqratmp", "logprop", "croissexp", "volmp", "similmp", "coordmp", "vectmp", "scalmp", "projmp", "pvectmp", "explogfn", "eqirrmp", "limitinf", "continuite", "combi", "vect3d", "droite3d", "plans", "pscal3d",
    "derivref", "etudefct", "primitives", "volrev", "croissance", "appllin", "condbayes", "varalea", "binomiale", "normale", "lnexp"]) {
    if (OUT[id]) OUT[id] = OUT[id].map((f) => () => RFIX(f()));
    for (const S of [PROB_EXTRA, PROBX]) if (S && S[id] && !OUT[id]) S[id] = S[id].map((f) => () => RFIX(f()));
    if (PROB[id] && !OUT[id]) { const f0 = PROB[id]; PROB[id] = () => RFIX(f0()); }
  }
  /* ==== fin agent defisch3 ==== */
  /* pct (PROB de generators.js) : vélo, puis abonnement de fitness et action en bourse */
  if (typeof PROB !== "undefined" && PROB.pct && !OUT.pct) {
    const pct0 = PROB.pct;
    const PC = (cx, quoi, fin, intro, up, dn, P0) => { const p1 = P0 * (1 + up / 100), p2 = p1 * (1 - dn / 100), glob = (p2 / P0 - 1) * 100;
      return CXP(cx, Object.assign(P(intro, [["a) " + quoi + " après la hausse (CHF)", +p1.toFixed(6)], ["b) " + quoi + " " + fin + " (CHF)", +p2.toFixed(6)], ["c) Variation globale en % (négative si baisse)", +glob.toFixed(6), 0.01]],
        ["Les pourcentages successifs se multiplient : on ne les additionne pas.", "Multiplie par " + T(1 + up / 100) + " puis par " + T(1 - dn / 100) + " ; variation globale = (prix final / prix initial − 1) · 100."],
        "a) " + M(nb(P0) + " \\cdot " + D(1 + up / 100) + " = " + CHF(p1)) + ". b) " + M(CHF(p1) + " \\cdot " + D(1 - dn / 100) + " = " + CHF(p2)) + ". c) " + M(D(+glob.toFixed(2)) + "\\,\\%") + " (et non " + (up - dn) + " %)."), { fig: FIG.percentBar(up, P0, " CHF") })); };
    OUT.pct = [() => CXP("velo", pct0()),
      () => { const P0 = 12 * ri(4, 9), up = pk([10, 20, 25]), dn = pk([15, 20, 30, 40]); return PC("fitness", "Prix mensuel", "final", "Un abonnement de fitness coûte " + M(P0) + " CHF par mois. Le prix augmente de " + M(up + "\\,\\%") + " ; puis, avec la carte d'étudiant, il baisse de " + M(dn + "\\,\\%") + ".", up, dn, P0); },
      () => { const P0 = 20 * ri(3, 40), up = pk([10, 20, 25, 30, 50]), dn = pk([10, 20, 25, 40]); return PC("action", "Valeur", "finale", "Une action vaut " + M(nb(P0)) + " CHF. En une semaine, sa valeur monte de " + M(up + "\\,\\%") + ", puis la semaine suivante elle baisse de " + M(dn + "\\,\\%") + ".", up, dn, P0); }];
  }
  return OUT;
})();
// Texte simple : milliers avec ' (indices et étiquettes).
function nbT(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "'"); }
for (const [id, fns] of Object.entries(DEFIS)) {
  if (typeof GEN === "undefined" || !GEN[id]) continue;
  if (typeof PROB !== "undefined") delete PROB[id];
  PROB_EXTRA[id] = fns;
}
