// Chantier 9e–10e (23.11) : sujets de préparation de qualité (pas du drill) pour les chapitres de 9e du CO.
// Même format que riche.js (RICH.<chapitre> = { ids, label, ex, raison, minutes }), modelé sur le MER 9e
// (Mathématiques 9-10-11, CIIP 2024) : situations réalistes, tableaux et figures, questions liées a, b, c,
// donnée inutile, questions inverses — inspiré, jamais recopié. Chaque exercice porte en plus :
//   chk  : [[condition, message], …] vérifications par un second calcul (tests/riche910.html) ;
//   vals : réponses numériques principales (jamais 0, 1, NaN : contrôlé par le test).
// RICHU : outils partagés avec riche_10.js. Chargé après riche_sys1c.js.
const RICHU = (() => {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const grp = (i) => (i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i);
  const N = (v) => { v = r6(v); const s = v < 0 ? "-" : ""; const [i, f] = String(Math.abs(v)).split("."); return s + grp(i) + (f ? "{,}" + f : ""); };
  const Nk = (v, k) => { const s = v < 0 ? "-" : ""; const [i, f] = Math.abs(v).toFixed(k).split("."); return s + grp(i) + (f ? "{,}" + f : ""); };
  const A = (v, k) => N(+(+v).toFixed(k));
  const T = (v) => M(N(v));
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const chf = (v) => M(Nk(v, 2) + u("CHF"));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const lcm = (a, b) => (a / g2(a, b)) * b;
  // Fractions exactes [n, d].
  const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = g2(n, d) || 1; return [n / g, d / g]; };
  const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
  const fv = (a) => a[0] / a[1];
  const ft = (a) => frac(a[0], a[1]);
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)), chk: [], vals: [] }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const W = [["Lina", 0], ["Noé", 1], ["Inès", 0], ["Yanis", 1], ["Mia", 0], ["Sam", 1], ["Léo", 1], ["Zoé", 0], ["Malik", 1], ["Elsa", 0], ["Nora", 0], ["Tim", 1]];
  const who = (not) => { let w; do w = pk(W); while (not && w[0] === not); const m = w[1]; return { n: w[0], il: m ? "il" : "elle", Il: m ? "Il" : "Elle", le: m ? "le" : "la", lui: m ? "lui" : "elle", e: m ? "" : "e" }; };
  const tab = (head, rows) => "<table class=\"mtab\"><tr>" + head.map((h) => "<th>" + h + "</th>").join("") + "</tr>" + rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table>";
  // Vrai ou faux : un item = () => [affirmation, vrai ?, justification] ; on en tire k au hasard.
  const VF = (o, pool, k = 3) => { const L = sh(pool).slice(0, k).map((f) => f());
    return X({ id: o.id, lv: o.lv || 2, titre: o.titre || "Vrai ou faux ?", q: o.q || "Pour chaque affirmation, dis si elle est vraie ou fausse, puis justifie (un calcul, un exemple ou un contre-exemple).",
      parts: L.map((x) => ({ label: "« " + x[0] + " »", pts: 1 })), sol: ul(L.map((x) => "<b>" + (x[1] ? "Vrai" : "Faux") + ".</b> " + x[2])), chk: L.map((x) => [typeof x[1] === "boolean", "VF booléen"]), vals: [] }); };
  const two = (n) => (n < 10 ? "0" : "") + n;
  const hm = (m) => Math.floor(m / 60) + " h " + two(m % 60);
  const dur = (m) => (m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + two(m % 60) + " min" : "") : m + " min");
  const fmt = (v) => String(r6(v)).replace(".", ",");
  // ---------- Figures en SVG ----------
  const svg = (w, h, body, label) => "<svg class=\"fig\" viewBox=\"0 0 " + w + " " + h + "\" role=\"img\" aria-label=\"" + (label || "figure") + "\" xmlns=\"http://www.w3.org/2000/svg\">" + body + "</svg>";
  const tx = (x, y, s, cls = "f-txt", anchor = "middle", size = 13) => "<text x=\"" + r6(x) + "\" y=\"" + r6(y) + "\" class=\"" + cls + "\" text-anchor=\"" + anchor + "\" font-size=\"" + size + "\">" + s + "</text>";
  const ln = (x1, y1, x2, y2, cls = "f-line", extra = "") => "<line x1=\"" + r6(x1) + "\" y1=\"" + r6(y1) + "\" x2=\"" + r6(x2) + "\" y2=\"" + r6(y2) + "\" class=\"" + cls + "\" " + extra + "/>";
  const pg = (pts, cls = "f-shape") => "<polygon points=\"" + pts.map((p) => r6(p[0]) + "," + r6(p[1])).join(" ") + "\" class=\"" + cls + "\"/>";
  // Repère quadrillé : pts = [[x, y, étiquette]], polys = [[[x, y], …], classe].
  function grid(x0, x1, y0, y1, pts = [], polys = []) {
    const s = Math.min(26, 290 / (x1 - x0), 240 / (y1 - y0)), W2 = (x1 - x0) * s + 30, H2 = (y1 - y0) * s + 30, X0 = 15 - x0 * s, Y0 = 15 + y1 * s;
    const px = (x) => X0 + x * s, py = (y) => Y0 - y * s;
    let g = "";
    for (let x = x0; x <= x1; x++) g += ln(px(x), py(y0), px(x), py(y1), "", "stroke=\"var(--line)\" stroke-width=\"0.8\"");
    for (let y = y0; y <= y1; y++) g += ln(px(x0), py(y), px(x1), py(y), "", "stroke=\"var(--line)\" stroke-width=\"0.8\"");
    g += ln(px(x0), py(0), px(x1), py(0), "f-line") + ln(px(0), py(y0), px(0), py(y1), "f-line");
    for (let x = x0; x <= x1; x++) if (x && x % 2 === 0) g += tx(px(x), py(0) + 12, x, "f-txt", "middle", 9);
    for (let y = y0; y <= y1; y++) if (y && y % 2 === 0) g += tx(px(0) - 4, py(y) + 3, y, "f-txt", "end", 9);
    g += tx(px(0) - 4, py(0) + 12, "0", "f-txt", "end", 9);
    polys.forEach(([P, cls]) => (g += pg(P.map(([x, y]) => [px(x), py(y)]), cls || "f-shape")));
    pts.forEach(([x, y, l]) => (g += "<circle cx=\"" + px(x) + "\" cy=\"" + py(y) + "\" r=\"3.5\" class=\"f-dot\"/>" + (l ? tx(px(x) + 6, py(y) - 6, l, "f-accent f-txt", "start", 13) : "")));
    return svg(W2, H2, g, "repère");
  }
  // Diagramme en bâtons avec étiquettes.
  function bars(labels, values, ylab) {
    const max = Math.max(...values), n = values.length, w = 280 / n, top = Math.ceil(max / 5) * 5, H = 130;
    let g = ln(30, 150, 315, 150) + ln(30, 150, 30, 12);
    for (let v = 0; v <= top; v += top > 20 ? 5 : 2) { const y = 150 - (v / top) * H; g += ln(26, y, 315, y, "", "stroke=\"var(--line)\" stroke-width=\"0.6\"") + tx(23, y + 4, v, "f-txt", "end", 10); }
    values.forEach((v, i) => { const hh = (v / top) * H; g += "<rect x=\"" + r6(34 + i * w + 4) + "\" y=\"" + r6(150 - hh) + "\" width=\"" + r6(w - 10) + "\" height=\"" + r6(hh) + "\" class=\"f-fill2\"/>" + tx(34 + i * w + w / 2 - 1, 166, labels[i], "f-txt", "middle", 11); });
    return svg(320, 176, g + (ylab ? tx(34, 10, ylab, "f-txt", "start", 10) : ""), "diagramme en bâtons");
  }
  // Diagramme circulaire : parts = [[étiquette, angle en degrés]].
  function pie(parts) {
    let a0 = -90, g = "";
    const cx = 160, cy = 95, r = 75, P = (a, rr = r) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)];
    parts.forEach(([lab, ang], i) => { const a1 = a0 + ang, [x0, y0] = P(a0), [x1, y1] = P(a1), [lx, ly] = P(a0 + ang / 2, r * 0.62);
      g += "<path d=\"M" + cx + " " + cy + " L" + r6(x0) + " " + r6(y0) + " A" + r + " " + r + " 0 " + (ang > 180 ? 1 : 0) + " 1 " + r6(x1) + " " + r6(y1) + " Z\" class=\"" + (i % 2 ? "f-fill2" : "f-shape2") + "\"/>" + tx(lx, ly + 4, lab, "f-txt", "middle", 11); a0 = a1; });
    return svg(320, 190, g, "diagramme circulaire");
  }
  return { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, pd, X, ul, who, tab, VF, two, hm, dur, fmt, svg, tx, ln, pg, grid, bars, pie };
})();

(function () {
  const { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, X, ul, who, tab, VF, hm, dur, fmt, svg, tx, ln, pg, grid, bars } = RICHU;

  // ===================== 9e · 1. Écritures décimale et fractionnaire décimale =====================
  const EXD = [
    // Au marché (décimaux en situation, estimation, donnée inutile)
    () => { const L = sh([["pommes", 3.4], ["tomates", 4.8], ["carottes", 2.6], ["cerises", 9.8], ["abricots", 6.4], ["poires", 4.2], ["courgettes", 3.8]]), P = L.slice(0, 3), E = L[3], q = sh([0.5, 1.5, 2, 2.5, 3]).slice(0, 3), w = who(), h = pk(["7 h 30", "8 h 15", "6 h 45"]);
      const c = P.map((p, i) => r6(p[1] * q[i])), tot = r6(c[0] + c[1] + c[2]), bill = tot < 50 ? 50 : 100, rend = r6(bill - tot), est = c.reduce((s, x) => s + Math.round(x), 0), ex = r6(E[1] * 1.5), ok = ex <= rend;
      return X({ id: "decprob", lv: 1, titre: "Au marché",
        q: w.n + " fait les courses au marché, qui ouvre à " + h + ". Voici ses achats." + tab(["produit", "prix au kg", "quantité"], P.map((p, i) => [p[0], chf(p[1]), Q(q[i], "kg")])),
        parts: [{ label: "Calcule le prix payé pour chaque produit.", pts: 3 }, { label: "Estime d'abord le total en arrondissant chaque prix au franc, puis calcule-le exactement.", pts: 2 }, { label: "Combien lui rend-on sur un billet de " + bill + " CHF ?", pts: 1 }, { label: "Avec cette monnaie, peut-" + w.il + " encore acheter " + Q(1.5, "kg") + " de " + E[0] + " à " + chf(E[1]) + " le kilo ? Justifie.", pts: 1 }],
        sol: ul([P.map((p, i) => p[0] + " : " + M(N(p[1]) + " \\cdot " + N(q[i]) + " = " + Nk(c[i], 2)) + " CHF").join(" ; ") + ".", "Estimation : environ " + est + " CHF. Total exact : " + M(c.map((x) => Nk(x, 2)).join(" + ") + " = " + Nk(tot, 2)) + " CHF (proche de l'estimation). L'heure d'ouverture ne sert à rien.", M(bill + " - " + Nk(tot, 2) + " = " + Nk(rend, 2)) + " CHF.", M(N(E[1]) + " \\cdot 1{,}5 = " + Nk(ex, 2)) + " CHF : " + (ok ? "oui, car " + Nk(ex, 2) + " ≤ " + Nk(rend, 2) + "." : "non, car " + Nk(ex, 2) + " > " + Nk(rend, 2) + ".")]),
        chk: [[Math.abs(tot - P.reduce((s, p, i) => s + p[1] * q[i], 0)) < 1e-9, "total"], [rend > 0, "monnaie positive"], [Math.abs(est - tot) < 3, "estimation proche"]], vals: [...c, tot, rend, ex] }); },
    // Saut en longueur (comparer, ranger, arrondir, encadrer)
    () => { const a = pk([4, 5]), V = pk([[0.9, 0.86, 0.09, 0.74, 0.7], [0.8, 0.75, 0.08, 0.68, 0.6], [0.6, 0.58, 0.06, 0.5, 0.47]]), names = sh(["Aya", "Ben", "Chloé", "David", "Emma", "Félix", "Gaïa"]).slice(0, 5);
      const S = sh(V).map((d, i) => ({ n: names[i], v: r6(a + d) })), srt = S.slice().sort((x, y) => y.v - x.v), rd = (v) => Math.round(v * 10) / 10;
      const groups = {}; S.forEach((s) => (groups[rd(s.v)] = (groups[rd(s.v)] || []).concat(s.n))); const same = Object.entries(groups).filter(([, l]) => l.length > 1);
      const gap = Math.round((srt[0].v - srt[1].v) * 100), mid = Math.round(((srt[1].v + srt[2].v) / 2) * 100) / 100;
      return X({ id: "deccomp", lv: 2, titre: "Le concours de saut en longueur",
        q: "Voici les meilleurs sauts de cinq élèves (le vent soufflait à " + Q(1.2, "m/s") + ")." + tab(["élève", "saut (m)"], S.map((s) => [s.n, T(s.v)])),
        parts: [{ label: "Range les sauts du plus long au plus court.", pts: 2 }, { label: "Arrondis chaque saut au dixième de mètre. Quels élèves ont le même arrondi ?", pts: 2 }, { label: "Combien de centimètres séparent le premier du deuxième ?", pts: 1 }, { label: "Un sixième élève saute plus loin que le 3e du classement, mais moins loin que le 2e. Donne une longueur possible, au centimètre.", pts: 1 }],
        sol: ul([srt.map((s) => s.n + " (" + N(s.v) + ")").join(" > ") + ". Attention : " + N(a + V[0]) + " = " + Nk(a + V[0], 2) + " > " + Nk(a + V[1], 2) + " : on écrit le même nombre de décimales, puis on compare chiffre par chiffre.", S.map((s) => s.n + " : " + N(rd(s.v))).join(" ; ") + ". Même arrondi : " + same.map(([v, l]) => l.join(" et ") + " (" + N(+v) + " m)").join(" ; ") + ".", M(Nk(srt[0].v, 2) + " - " + Nk(srt[1].v, 2) + " = " + Nk(gap / 100, 2)) + " m, soit " + gap + " cm.", "Par exemple " + Q(mid, "m") + " (toute longueur strictement entre " + N(srt[2].v) + " m et " + N(srt[1].v) + " m convient)."]),
        chk: [[same.length >= 1, "au moins un même arrondi"], [mid > srt[2].v && mid < srt[1].v, "encadrement"], [gap >= 2, "écart"]], vals: [gap, mid] }); },
    // Grains de riz (×, ÷ par 10, 100, 1000 ; ordre de grandeur)
    () => { const m = pk([2.4, 2.8, 1.9, 3.1, 2.2, 2.6]), g1 = r6(m / 100), n1kg = 100000 / m, est = Math.round(n1kg / 1000) * 1000, sac = 25 * n1kg;
      return X({ id: "dec10", lv: 2, titre: "Combien de grains de riz ?",
        q: "Une balance de laboratoire indique que 100 grains de riz pèsent " + Q(m, "g") + ". Le paquet de riz coûte " + chf(pk([2.95, 3.4, 4.2])) + ".",
        parts: [{ label: "Combien pèse un grain de riz, en grammes ? Et en milligrammes ?", pts: 2 }, { label: "Combien pèsent 1000 grains ? 10'000 grains ?", pts: 2 }, { label: "Environ combien de grains y a-t-il dans un paquet de 1 kg ? Arrondis au millier.", pts: 2 }, { label: "Un restaurant achète un sac de 25 kg. Donne l'ordre de grandeur du nombre de grains (dizaine de milliers, centaine de milliers, million… ?).", pts: 1 }],
        sol: ul([M(N(m) + " : 100 = " + N(g1)) + " g, soit " + M(N(g1) + " \\cdot 1000 = " + N(r6(g1 * 1000))) + " mg.", M(N(m) + " \\cdot 10 = " + N(r6(m * 10))) + " g et " + M(N(m) + " \\cdot 100 = " + N(r6(m * 100))) + " g.", M("1000 : " + N(g1) + " \\approx " + N(est)) + " grains (1 kg = 1000 g). Le prix ne sert à rien.", M("25 \\cdot " + N(est) + " \\approx " + N(Math.round(sac / 1000) * 1000)) + " : environ <b>un million</b> de grains."]),
        chk: [[Math.abs(g1 * 100 - m) < 1e-9, "÷100"], [sac > 600000 && sac < 1500000, "ordre du million"], [Math.abs(est - n1kg) <= 500, "arrondi au millier"]], vals: [g1, g1 * 1000, m * 10, m * 100, est] }); },
    // Sortie au cinéma (traduire en un seul calcul, priorités, parenthèses)
    () => { const Ad = pk([16, 17, 18, 19]), E = pk([11, 12, 13]), P = pk([6.5, 7, 7.5]), n = pk([2, 3, 4]), r = pk([2, 3, 4]), w = who();
      const tot = r6(2 * Ad + n * (E + P)), noe = r6(2 * Ad + n * E + P), moy = Math.round((tot / (n + 2)) * 100) / 100, mer = r6(tot - r * (n + 2));
      return X({ id: "tradexpr", lv: 3, titre: "Sortie au cinéma",
        q: "La famille de " + w.n + " (2 adultes et " + n + " enfants) va au cinéma. Un billet adulte coûte " + chf(Ad) + ", un billet enfant " + chf(E) + ". Chaque enfant reçoit un pop-corn à " + chf(P) + " ; les adultes n'en prennent pas.",
        parts: [{ label: "Écris <b>un seul calcul</b> (avec des parenthèses si nécessaire) qui donne la dépense totale, puis effectue-le.", pts: 2 }, { label: w.n + " écrit " + M("2 \\cdot " + Ad + " + " + n + " \\cdot " + E + " + " + N(P)) + ". Que calcule ce calcul ? Pourquoi n'est-il pas correct ?", pts: 2 }, { label: "Quel est le prix moyen par personne, au centime ?", pts: 1 }, { label: "Le mercredi, chaque billet coûte " + r + " CHF de moins. Écris le nouveau calcul et effectue-le.", pts: 2 }],
        sol: ul([M("2 \\cdot " + Ad + " + " + n + " \\cdot (" + E + " + " + N(P) + ") = " + N(2 * Ad) + " + " + n + " \\cdot " + N(E + P) + " = " + N(tot)) + " CHF.", "Il ne compte qu'<b>un seul</b> pop-corn : la multiplication passe avant l'addition, donc " + M(n) + " ne multiplie que le billet enfant. Résultat " + N(noe) + " CHF, il manque " + M(n - 1 + " \\cdot " + N(P)) + " CHF.", M(N(tot) + " : " + (n + 2) + " \\approx " + Nk(moy, 2)) + " CHF.", M("2 \\cdot (" + Ad + " - " + r + ") + " + n + " \\cdot (" + E + " - " + r + " + " + N(P) + ") = " + N(mer)) + " CHF (ou " + M(N(tot) + " - " + r + " \\cdot " + (n + 2)) + ")."]),
        chk: [[Math.abs(tot - noe - (n - 1) * P) < 1e-9, "écart Noé"], [Math.abs(mer - (2 * (Ad - r) + n * (E - r + P))) < 1e-9, "mercredi"]], vals: [tot, noe, moy, mer] }); },
  ];
  const RAISOND = [
    () => { const a = R.int(30, 50), b = R.int(3, 6), c = R.int(3, 5), d = R.int(2, 9), right = a - b * c + d, wrong = (a - b) * c + d, w = who();
      return X({ id: "prio", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " calcule " + M(a + " - " + b + " \\cdot " + c + " + " + d) + " ainsi : " + M(a + " - " + b + " = " + (a - b)) + ", puis " + M((a - b) + " \\cdot " + c + " = " + (a - b) * c) + ", puis " + M((a - b) * c + " + " + d + " = " + wrong) + ".",
        parts: [{ label: "Explique l'erreur de " + w.n + ".", pts: 1 }, { label: "Calcule correctement, en écrivant les étapes.", pts: 1 }, { label: "Place des parenthèses dans le calcul de départ pour obtenir le résultat de " + w.n + ".", pts: 1 }],
        sol: ul([w.Il + " a calculé de gauche à droite : la multiplication est prioritaire sur l'addition et la soustraction.", M(a + " - " + b * c + " + " + d + " = " + right) + ".", M("(" + a + " - " + b + ") \\cdot " + c + " + " + d + " = " + wrong) + "."]),
        chk: [[right !== wrong && right > 0, "résultats distincts"]], vals: [right, wrong] }); },
    () => VF({ id: "decmul" }, [
      () => { const a = pk([0.5, 0.4, 0.8]), b = R.int(12, 40); return ["Quand on multiplie " + b + " par un nombre, on obtient toujours un résultat plus grand que " + b + ".", false, M(b + " \\cdot " + N(a) + " = " + N(r6(b * a))) + ", plus petit que " + b + " : multiplier par un nombre plus petit que 1 diminue."]; },
      () => { const x = R.int(2, 8), y = pk([12, 15, 18, 24]), z = pk([3, 4, 5, 6, 9]); return ["On a " + M(x + "{,}" + y + " > " + x + "{,}" + z) + " car " + y + " > " + z + ".", false, M(x + "{,}" + z + " = " + x + "{,}" + z + "0") + " et " + z + "0 > " + y + " : c'est " + M(x + "{,}" + y + " < " + x + "{,}" + z) + "."]; },
      () => { const b = R.int(7, 23); return ["Diviser par 0,5 revient à multiplier par 2.", true, "Dans " + b + ", il y a " + 2 * b + " demis : " + M(b + " : 0{,}5 = " + 2 * b + " = " + b + " \\cdot 2") + "."]; },
      () => { const a = pk([2, 3, 4]), b = pk([2, 3]); return [M("0{,}" + a + " \\cdot 0{,}" + b + " = 0{,}" + a * b) + ".", false, M("0{,}" + a + " \\cdot 0{,}" + b + " = \\frac{" + a + "}{10} \\cdot \\frac{" + b + "}{10} = \\frac{" + a * b + "}{100} = 0{,}0" + a * b) + "."]; },
      () => { const x = R.int(2, 9); return ["Entre " + x + ",4 et " + x + ",5, il n'y a aucun nombre décimal.", false, "Par exemple " + x + ",45 ou " + x + ",41 sont entre les deux (il y en a une infinité)."]; },
      () => { const x = R.int(3, 9); return [M(x + "{,}5 \\cdot 10 = " + x + "{,}50") + ".", false, "Multiplier par 10 décale les chiffres d'un rang : " + M(x + "{,}5 \\cdot 10 = " + (x * 10 + 5)) + " (" + x + ",50 = " + x + ",5, rien n'a changé)."]; },
    ]),
    () => { const a = pk([3, 4, 5, 6]), b = pk([3, 4]), [p, q] = pk([[2, 5], [3, 4], [2, 6]]), w = who();
      return X({ id: "pow9", lv: 2, titre: "Puissances : trouve l'erreur",
        q: w.n + " écrit : " + M(a + "^" + b + " = " + a + " \\cdot " + b + " = " + a * b) + " et " + M(p + "^" + q + " = " + p * q) + ".",
        parts: [{ label: "Explique l'erreur.", pts: 1 }, { label: "Calcule correctement " + M(a + "^" + b) + " et " + M(p + "^" + q) + ".", pts: 1 }, { label: "Compare " + M(p + "^" + q) + " et " + M(q + "^" + p) + ". Lequel est le plus grand ?", pts: 1 }],
        sol: ul([M(a + "^" + b) + " veut dire " + a + " multiplié par lui-même " + b + " fois, pas " + a + " fois " + b + ".", M(a + "^" + b + " = " + Array(b).fill(a).join(" \\cdot ") + " = " + N(a ** b)) + " et " + M(p + "^" + q + " = " + p ** q) + ".", M(q + "^" + p + " = " + q ** p) + " : " + M(p + "^" + q + (p ** q > q ** p ? " > " : " < ") + q + "^" + p) + "."]),
        chk: [[a ** b !== a * b && p ** q !== p * q, "erreur visible"]], vals: [a ** b, p ** q, q ** p] }); },
  ];
  RICH.dec9 = { ids: ["decread", "deccomp", "decarr", "ordgr", "decadd", "dec10", "decmul", "decdiv", "decprob", "pow9", "prio", "tradexpr"], label: "Nombres décimaux (9e)", ex: EXD, raison: RAISOND, minutes: 45 };

  // ===================== 9e · 2. Unités et mesures =====================
  const EXU = [
    // Horaire de train (durées, horaires)
    () => { const dep0 = 6 * 60 + R.int(0, 5) * 5 + 20, gaps = [R.int(15, 25), R.int(20, 35), R.int(15, 30)], durs = sh([36, 42, 48, 53, 67]).slice(0, 4), w = who(), city = pk([["Genève", "Lausanne"], ["Genève", "Yverdon"], ["Lausanne", "Fribourg"], ["Neuchâtel", "Berne"]]);
      const D = [dep0]; gaps.forEach((g) => D.push(D[D.length - 1] + g)); const Ar = D.map((d, i) => d + durs[i]);
      const fast = durs.indexOf(Math.min(...durs)), k = R.int(1, 3), limit = Ar[k] + R.int(2, 6);
      const okIdx = D.map((d, i) => i).filter((i) => Ar[i] <= limit), last = okIdx.reduce((b, i) => (D[i] > D[b] ? i : b), okIdx[0]), week = 5 * 2 * durs[fast];
      return X({ id: "utemps", lv: 1, titre: "L'horaire du train",
        q: w.n + " consulte l'horaire " + city[0] + " → " + city[1] + " (le billet coûte " + pk([18, 22, 25]) + " CHF)." + tab(["train", "départ", "arrivée"], D.map((d, i) => ["n° " + (i + 1), hm(d), hm(Ar[i])])),
        parts: [{ label: "Calcule la durée de chaque trajet.", pts: 2 }, { label: "Quel train est le plus rapide ?", pts: 1 }, { label: w.n + " doit arriver au plus tard à " + hm(limit) + ". Quel est le dernier train qu'" + w.il + " peut prendre ?", pts: 1 }, { label: w.Il + " fait l'aller et le retour 5 jours par semaine, avec un trajet aussi long que le train le plus rapide. Combien de temps passe-t-" + w.il + " dans le train par semaine ? Donne la réponse en h et min.", pts: 2 }],
        sol: ul([durs.map((d, i) => "n° " + (i + 1) + " : " + dur(d)).join(" ; ") + ".", "Le n° " + (fast + 1) + " (" + dur(durs[fast]) + ").", "Le n° " + (last + 1) + " (départ " + hm(D[last]) + ", arrivée " + hm(Ar[last]) + "). Le prix du billet ne sert à rien.", M("5 \\cdot 2 \\cdot " + durs[fast] + " = " + week) + " min " + M("= " + Math.floor(week / 60) + " \\cdot 60 + " + (week % 60)) + " min, soit " + dur(week) + "."]),
        chk: [[Ar[last] <= limit && D.every((d, i) => Ar[i] > limit || D[i] <= D[last]), "dernier train"], [new Set(durs).size === 4, "durées distinctes"]], vals: [...durs, week] }); },
    // Sac de randonnée (longueurs et masses)
    () => { const t = pk([1.8, 2.1, 1.65]), sc = pk([950, 1150, 870]), re = pk([340, 285, 410]), eau = pk([1.5, 2]), food = [pk([1, 2]), pk([300, 450, 750])], vide = pk([1.2, 1.35, 0.95]), lim = pk([8, 9, 10]);
      const tot = r6(t + sc / 1000 + re / 1000 + eau + food[0] + food[1] / 1000 + vide), et = [pk([4.6, 5.3, 3.8]), pk([2800, 3450, 1950]), [pk([4, 5, 6]), pk([350, 75, 620])]], km = r6(et[0] + et[1] / 1000 + et[2][0] + et[2][1] / 1000), w = who();
      return X({ id: "ulong", lv: 2, titre: "Le sac de randonnée",
        q: w.n + " prépare son sac pour deux jours de marche : une tente de " + Q(t, "kg") + ", un sac de couchage de " + Q(sc, "g") + ", un réchaud de " + Q(re, "g") + ", " + Q(eau, "L") + " d'eau (" + M("1" + u("L")) + " d'eau pèse " + M("1" + u("kg")) + "), " + food[0] + " kg " + food[1] + " g de nourriture. Le sac vide pèse " + Q(vide, "kg") + ".",
        parts: [{ label: "Exprime toutes les masses en kilogrammes.", pts: 2 }, { label: "Quelle est la masse du sac rempli ?", pts: 1 }, { label: "On conseille de ne pas porter plus de " + lim + " kg. " + w.Il + " respecte-t-" + w.il + " ce conseil ? Sinon, de combien dépasse-t-" + w.il + " ?", pts: 1 }, { label: "Les étapes mesurent " + Q(et[0], "km") + ", " + Q(et[1], "m") + " et " + et[2][0] + " km " + et[2][1] + " m. Quelle distance parcourt-" + w.il + " en tout, en km ?", pts: 2 }],
        sol: ul(["Tente " + N(t) + " ; couchage " + N(sc / 1000) + " ; réchaud " + N(re / 1000) + " ; eau " + N(eau) + " ; nourriture " + N(r6(food[0] + food[1] / 1000)) + " ; sac vide " + N(vide) + " (en kg).", "Total : " + Q(tot, "kg") + ".", tot <= lim ? "Oui : " + N(tot) + " ≤ " + lim + "." : "Non : il dépasse de " + M(N(tot) + " - " + lim + " = " + N(r6(tot - lim))) + " kg.", M(N(et[0]) + " + " + N(et[1] / 1000) + " + " + N(r6(et[2][0] + et[2][1] / 1000)) + " = " + N(km)) + " km (attention : " + et[2][1] + " m = " + N(et[2][1] / 1000) + " km)."]),
        chk: [[Math.abs(tot * 1000 - (t * 1000 + sc + re + eau * 1000 + food[0] * 1000 + food[1] + vide * 1000)) < 1e-6, "total g"], [tot !== lim, "pas égal"]], vals: [tot, km] }); },
    // Le parquet (unités d'aire)
    () => { const L = pk([4.5, 5.2, 3.8, 6]), l = pk([3.2, 3.6, 4]), lw = pk([[120, 15], [90, 12], [140, 20]]), pack = pk([8, 10, 12]), w = who();
      const Am = r6(L * l), Adm = r6(Am * 100), al = r6((lw[0] * lw[1]) / 100), n = Math.ceil(Adm / al - 1e-9), np = Math.ceil(n / pack);
      return X({ id: "uaire", lv: 2, titre: "Le nouveau parquet",
        q: "La chambre de " + w.n + " est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ", avec une fenêtre de " + Q(1.4, "m") + " de large. On la recouvre de lames de parquet de " + Q(lw[0], "cm") + " sur " + Q(lw[1], "cm") + ", vendues par paquets de " + pack + ".",
        parts: [{ label: "Calcule l'aire de la chambre en m², puis en dm².", pts: 2 }, { label: "Calcule l'aire d'une lame en cm², puis en dm².", pts: 2 }, { label: "Combien de lames faut-il au minimum (sans tenir compte des chutes) ?", pts: 1 }, { label: "Combien de paquets faut-il acheter ?", pts: 1 }],
        sol: ul([M(N(L) + " \\cdot " + N(l) + " = " + N(Am)) + " m² = " + Q(Adm, "dm^2") + " (1 m² = 100 dm²).", M(lw[0] + " \\cdot " + lw[1] + " = " + N(lw[0] * lw[1])) + " cm² = " + Q(al, "dm^2") + " (1 dm² = 100 cm²).", M(N(Adm) + " : " + N(al) + " \\approx " + N(Math.round((Adm / al) * 100) / 100)) + " : il faut " + n + " lames (on arrondit vers le haut). La largeur de la fenêtre ne sert à rien.", M(n + " : " + pack + " \\approx " + N(Math.round((n / pack) * 100) / 100)) + " : " + np + " paquets."]),
        chk: [[n * al >= Adm && (n - 1) * al < Adm, "nb lames"]], vals: [Am, Adm, al, n, np] }); },
    // L'aquarium (volumes et capacités, question inverse)
    () => { const [L, l, h] = pk([[60, 30, 40], [80, 35, 45], [100, 40, 50], [70, 30, 40]]), vide = pk([4, 5, 8]), jug = pk([1.5, 2.5, 2]), mas = pk([15, 18, 22]), lim = pk([100, 120, 150]);
      const V = L * l * h, Vl = V / 1000, We = (L * l * (h - vide)) / 1000, trips = Math.ceil(We / jug - 1e-9), tot = r6(We + mas);
      return X({ id: "uvol", lv: 3, titre: "L'aquarium",
        q: "Un aquarium a la forme d'un pavé de " + Q(L, "cm") + " de long, " + Q(l, "cm") + " de large et " + Q(h, "cm") + " de haut. On le remplit d'eau jusqu'à " + Q(vide, "cm") + " du bord. Vide, il pèse " + Q(mas, "kg") + ". (" + M("1" + u("L")) + " d'eau pèse " + M("1" + u("kg")) + ".)",
        parts: [{ label: "Calcule le volume de l'aquarium en cm³, puis sa contenance en litres.", pts: 2 }, { label: "Combien de litres d'eau contient-il ?", pts: 1 }, { label: "On le remplit avec un broc de " + Q(jug, "L") + ". Combien de fois faut-il remplir le broc ?", pts: 1 }, { label: "Le meuble supporte au plus " + lim + " kg. Peut-on y poser l'aquarium plein ? Justifie.", pts: 1 }],
        sol: ul([M(L + " \\cdot " + l + " \\cdot " + h + " = " + N(V)) + " cm³ = " + N(Vl) + " dm³ = " + Q(Vl, "L") + ".", "Hauteur d'eau : " + (h - vide) + " cm, donc " + M(L + " \\cdot " + l + " \\cdot " + (h - vide) + " = " + N(We * 1000)) + " cm³ = " + Q(We, "L") + ".", M(N(We) + " : " + N(jug) + " \\approx " + N(Math.round((We / jug) * 100) / 100)) + " : " + trips + " fois.", "Masse : " + M(N(We) + " + " + mas + " = " + N(tot)) + " kg : " + (tot <= lim ? "oui (" + N(tot) + " ≤ " + lim + ")." : "non (" + N(tot) + " > " + lim + ").")]),
        chk: [[Math.abs(Vl * 1000 - V) < 1e-9, "conversion"], [trips * jug >= We && (trips - 1) * jug < We, "broc"]], vals: [V, Vl, We, trips, tot] }); },
  ];
  const RAISONU = [
    () => { const pool = [
      () => { const a = pk([2.5, 3.2, 1.8]); return [N(a) + " m² = " + N(a * 10) + " dm²", false, N(a) + " m² = " + N(r6(a * 100)) + " dm² (1 m² = 100 dm²)"]; },
      () => { const a = pk([3.5, 4.2, 1.6]); return [N(a) + " m² = " + N(r6(a * 100)) + " dm²", true, "1 m² = 10 dm · 10 dm = 100 dm²"]; },
      () => { const h = pk([1, 2, 3]); return [h + ",5 h = " + h + " h 50 min", false, h + ",5 h = " + h + " h 30 min (0,5 h = la moitié de 60 min)"]; },
      () => { const h = pk([0.25, 0.75]); return [N(h) + " h = " + h * 60 + " min", true, M(N(h) + " \\cdot 60 = " + h * 60)]; },
      () => { const v = pk([750, 250, 330]); return [v + " cm³ = " + N(v / 100) + " L", false, v + " cm³ = " + N(v / 1000) + " L (1 L = 1 dm³ = 1000 cm³)"]; },
      () => { const v = pk([4, 6, 12]); return [v + " L = " + v + " dm³", true, "1 L = 1 dm³"]; },
      () => { const k = pk([1, 2, 3]), m = pk([20, 40, 60]); return [k + " km " + m + " m = " + k + "," + m / 10 + " km", false, k + " km " + m + " m = " + N(k + m / 1000) + " km (" + m + " m = " + N(m / 1000) + " km)"]; },
      () => { const k = pk([2, 3, 4]), g = pk([50, 75, 5]); return [k + " kg " + g + " g = " + N(k + g / 1000) + " kg", true, g + " g = " + N(g / 1000) + " kg"]; },
    ];
      const L = sh(pool).slice(0, 4).map((f) => f()), wr = L.filter((x) => !x[1]).length, w = who();
      return X({ id: "uaire", lv: 2, titre: "Trouve les erreurs",
        q: w.n + " a fait ces conversions. Contrôle-les." + tab(["", "conversion"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
        parts: [{ label: "Lesquelles sont fausses ?", pts: 2 }, { label: "Corrige-les en expliquant.", pts: 2 }],
        sol: ul([wr ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + " (" + wr + " fausse" + (wr > 1 ? "s" : "") + ")." : "Aucune n'est fausse.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste, " : "faux, ") + x[2]).join(" ; ") + "."]),
        chk: [[L.length === 4, "4 conversions"]], vals: [] }); },
    () => { const h1 = R.int(8, 10), m1 = R.int(35, 55), h2 = h1 + pk([1, 2]), m2 = R.int(5, m1 - 15), d = h2 * 60 + m2 - (h1 * 60 + m1), wr = r6(h2 + m2 / 100 - (h1 + m1 / 100)), w1 = who(), w2 = who(w1.n);
      return X({ id: "utemps", lv: 2, titre: "Deux méthodes",
        q: "Un film commence à " + h1 + " h " + m1 + " et finit à " + h2 + " h " + (m2 < 10 ? "0" : "") + m2 + ". " + w1.n + " compte : « de " + h1 + " h " + m1 + " à " + (h1 + 1) + " h, puis jusqu'à " + h2 + " h " + (m2 < 10 ? "0" : "") + m2 + " ». " + w2.n + " pose : " + M(N(h2 + m2 / 100) + " - " + N(h1 + m1 / 100) + " = " + N(wr)) + ", donc « " + Math.floor(wr) + " h " + Math.round((wr % 1) * 100) + " min ».",
        parts: [{ label: "Termine la méthode de " + w1.n + " et donne la durée du film.", pts: 2 }, { label: "Pourquoi la méthode de " + w2.n + " est-elle fausse ?", pts: 1 }],
        sol: ul([(60 - m1) + " min + " + (h2 - h1 - 1) * 60 + " min + " + m2 + " min = " + d + " min = " + dur(d) + ".", "Une heure compte 60 minutes et non 100 : on ne peut pas soustraire des heures et des minutes comme des nombres décimaux."]),
        chk: [[d > 0 && Math.round((wr % 1) * 100) !== d % 60, "méthodes différentes"]], vals: [d] }); },
  ];
  RICH.unit9 = { ids: ["ulong", "uaire", "uvol", "utemps"], label: "Unités et mesures (9e)", ex: EXU, raison: RAISONU, minutes: 45 };

  // ===================== 9e · 3. Géométrie du plan =====================
  const kind = (a) => (a < 90 ? "aigu" : a === 90 ? "droit" : a < 180 ? "obtus" : "plat");
  const EXG = [
    () => { const a = pk([96, 104, 110, 116, 124, 130]), b = (180 - a) / 2;
      const fig = svg(300, 140, pg([[30, 120], [270, 120], [150, 120 - 120 * Math.tan(((b) * Math.PI) / 180)]], "f-shape") + ln(150, 120 - 120 * Math.tan((b * Math.PI) / 180), 150, 120, "f-accent", "stroke-dasharray=\"5 4\"") + tx(150, 120 - 120 * Math.tan((b * Math.PI) / 180) - 6, a + "°", "f-accent f-txt") + tx(56, 114, "?", "f-txt", "middle", 13) + tx(244, 114, "?", "f-txt", "middle", 13), "toit");
      return X({ id: "angtri", lv: 1, titre: "Le toit du chalet",
        q: "La façade d'un chalet est surmontée d'un toit en forme de triangle isocèle. L'angle au sommet mesure " + M(a + "°") + ". Le chalet a été construit en " + pk([1932, 1956, 1978]) + ".", fig,
        parts: [{ label: "Calcule les deux angles à la base du toit. Justifie.", pts: 2 }, { label: "Ce triangle est-il acutangle, rectangle ou obtusangle ?", pts: 1 }, { label: "Une poutre verticale relie le sommet au milieu de la base. Quels angles forme-t-elle avec chaque pan du toit ? Et avec la base ?", pts: 2 }],
        sol: ul(["Les angles à la base d'un triangle isocèle sont égaux : " + M("(180° - " + a + "°) : 2 = " + N(b) + "°") + ".", "Obtusangle : l'angle de " + a + "° est obtus. L'année de construction ne sert à rien.", M(a + "° : 2 = " + N(a / 2) + "°") + " avec chaque pan (la poutre est un axe de symétrie) ; " + M("90°") + " avec la base."]),
        chk: [[Math.abs(2 * b + a - 180) < 1e-9, "somme"], [b < 45, "base aigu"]], vals: [b, a / 2] }); },
    () => { const S = ["carré", "rectangle", "losange", "parallélogramme"], props = ["4 côtés de même longueur", "4 angles droits", "diagonales de même longueur", "diagonales perpendiculaires", "côtés opposés parallèles"], Tb = { carré: [1, 1, 1, 1, 1], rectangle: [0, 1, 1, 0, 1], losange: [1, 0, 0, 1, 1], parallélogramme: [0, 0, 0, 0, 1] };
      const RID = [["losange", "Mes diagonales sont perpendiculaires, mais pas de même longueur.", [[3, 1], [2, 0]]], ["rectangle", "Mes diagonales ont la même longueur, mais ne sont pas perpendiculaires.", [[2, 1], [3, 0]]], ["carré", "Mes diagonales sont perpendiculaires et de même longueur.", [[2, 1], [3, 1]]], ["parallélogramme", "Mes côtés opposés sont parallèles, mais mes diagonales ne sont ni de même longueur, ni perpendiculaires.", [[4, 1], [2, 0], [3, 0]]]];
      const rr = sh(RID).slice(0, 2), uniq = rr.every(([s, , c]) => S.filter((x) => c.every(([p, v]) => Tb[x][p] === v)).join() === s), P2 = sh([0, 1, 2, 3]).slice(0, 3).sort();
      return X({ id: "quadri", lv: 2, titre: "Quel quadrilatère ?",
        q: "On compare quatre quadrilatères particuliers : carré, rectangle, losange, parallélogramme.",
        parts: [{ label: "Pour chacune de ces propriétés, cite tous les quadrilatères qui l'ont toujours : " + P2.map((p) => "« " + props[p] + " »").join(", ") + ".", pts: 3 }, ...rr.map(([, t]) => ({ label: "Devinette : « " + t + " » Qui suis-je ?", pts: 1 }))],
        sol: ul([P2.map((p) => props[p] + " : " + S.filter((x) => Tb[x][p]).join(", ")).join(" ; ") + ".", ...rr.map(([s]) => "Le " + s + ".")]),
        chk: [[uniq, "devinettes uniques"]], vals: [] }); },
    () => { const a = R.int(68, 95), b = R.int(100, 125), c = R.int(70, 88), d = 360 - a - b - c, p = pk([62, 68, 72, 76]);
      return X({ id: "angtri", lv: 2, titre: "Le champ et l'étagère",
        q: "Un géomètre mesure trois angles d'un champ en forme de quadrilatère " + M("ABCD") + " : " + M("\\hat{A} = " + a + "°") + ", " + M("\\hat{B} = " + b + "°") + ", " + M("\\hat{C} = " + c + "°") + ". Une étagère déformée a la forme d'un parallélogramme dont un angle mesure " + M(p + "°") + ".",
        parts: [{ label: "Calcule l'angle " + M("\\hat{D}") + " du champ.", pts: 1 }, { label: "Quel est le type de chaque angle du champ (aigu, droit, obtus) ?", pts: 1 }, { label: "Calcule les trois autres angles de l'étagère. Justifie.", pts: 2 }],
        sol: ul([M("360° - " + a + "° - " + b + "° - " + c + "° = " + d + "°") + " (somme des angles d'un quadrilatère : 360°).", ["A", "B", "C", "D"].map((L, i) => L + " " + kind([a, b, c, d][i])).join(", ") + ".", M(p + "°") + " (angle opposé), " + M(180 - p + "°") + " et " + M(180 - p + "°") + " (deux angles consécutifs d'un parallélogramme sont supplémentaires)."]),
        chk: [[d > 0 && d < 180, "angle D"], [a + b + c + d === 360, "somme"]], vals: [d, 180 - p] }); },
    () => { const ang = (h, m) => { let x = Math.abs(30 * h + m / 2 - 6 * m); return x > 180 ? 360 - x : x; };
      const t1 = pk([2, 4, 5, 7]), t2 = pk([1, 2, 4, 8]), t3 = pk([20, 40]), a1 = ang(t1, 0), a2 = ang(t2, 30), mn = 6 * t3;
      return X({ id: "angtype", lv: 3, titre: "Les aiguilles de l'horloge",
        q: "La grande aiguille fait un tour (360°) en 60 minutes ; la petite aiguille fait un tour en 12 heures.",
        parts: [{ label: "De combien de degrés tourne la grande aiguille en 1 minute ? en " + t3 + " minutes ?", pts: 2 }, { label: "De combien de degrés tourne la petite aiguille en 1 heure ? en 30 minutes ?", pts: 1 }, { label: "Calcule l'angle (le plus petit) entre les aiguilles à " + t1 + " h 00, puis à " + t2 + " h 30. Donne le type de chaque angle.", pts: 3 }, { label: "À quelles heures « pile » les aiguilles forment-elles un angle droit ?", pts: 1 }],
        sol: ul([M("360° : 60 = 6°") + " par minute ; " + M(t3 + " \\cdot 6° = " + mn + "°") + ".", M("360° : 12 = 30°") + " par heure ; " + M("15°") + " en 30 minutes.", t1 + " h : " + M(t1 + " \\cdot 30° = " + 30 * t1 + "°") + (30 * t1 > 180 ? ", soit " + M(a1 + "°") + " en tournant de l'autre côté" : "") + " (angle " + kind(a1) + "). " + t2 + " h 30 : la grande aiguille est sur le 6 (180°), la petite à mi-chemin entre " + t2 + " et " + (t2 + 1) + " (" + (30 * t2 + 15) + "°) : " + M(a2 + "°") + " (angle " + kind(a2) + ").", "À 3 h et à 9 h."]),
        chk: [[a1 > 0 && a1 < 180 && a2 > 0 && a2 <= 180, "angles"], [ang(3, 0) === 90 && ang(9, 0) === 90, "droit"]], vals: [mn, a1, a2] }); },
  ];
  const RAISONG = [
    () => VF({ id: "angtri" }, [
      () => ["Un triangle peut avoir deux angles droits.", false, "Deux angles droits font déjà 180° : il ne reste rien pour le troisième angle."],
      () => ["Dans un triangle rectangle, les deux autres angles sont aigus.", true, "Ils font ensemble " + M("180° - 90° = 90°") + ", donc chacun est plus petit que 90°."],
      () => ["Chaque angle d'un triangle équilatéral mesure 60°.", true, "Les trois angles sont égaux : " + M("180° : 3 = 60°") + "."],
      () => { const a = R.int(40, 70), b = R.int(50, 80), c = 180 - a - b + pk([10, -10, 15]); return ["Un triangle peut avoir des angles de " + a + "°, " + b + "° et " + c + "°.", false, M(a + " + " + b + " + " + c + " = " + (a + b + c)) + " ≠ 180."]; },
      () => ["Un triangle obtusangle peut aussi être isocèle.", true, "Par exemple avec des angles de 120°, 30° et 30°."],
      () => ["Un angle de 180° est un angle obtus.", false, "C'est un angle plat ; un angle obtus est entre 90° et 180°."],
    ]),
    () => { let a, b, c, d, s; do { a = R.int(80, 95); b = R.int(95, 110); c = R.int(85, 100); d = R.int(90, 100); s = a + b + c + d; } while (s === 360 || 360 - a - b - c < 50); const w = who();
      return X({ id: "angtri", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " a mesuré les quatre angles d'un quadrilatère : " + [a, b, c, d].map((x) => x + "°").join(", ") + ".",
        parts: [{ label: "Explique pourquoi ses mesures ne peuvent pas être toutes justes.", pts: 1 }, { label: "Si les trois premières sont justes, que vaut le quatrième angle ?", pts: 1 }],
        sol: ul([M(a + " + " + b + " + " + c + " + " + d + " = " + s) + " ≠ 360 : la somme des angles d'un quadrilatère vaut 360°.", M("360° - " + a + "° - " + b + "° - " + c + "° = " + (360 - a - b - c) + "°") + "."]),
        chk: [[s !== 360 && 360 - a - b - c > 0, "erreur réelle"]], vals: [s, 360 - a - b - c] }); },
  ];
  RICH.geo9 = { ids: ["angtype", "quadri", "angtri"], label: "Géométrie du plan (9e)", ex: EXG, raison: RAISONG, minutes: 45 };

  // ===================== 9e · 4. Arithmétique =====================
  const EXA = [
    () => { let n; do n = R.int(152, 988); while (n % 9 < 2 || n % 9 > 7 || n % 6 < 2 || !(n % 2 === 0 || n % 3 === 0 || n % 5 === 0)); const ds = String(n).split("").map(Number), s = ds.reduce((a, b) => a + b, 0), add9 = 9 - (n % 9);
      const yes = [2, 3, 5, 9, 10].filter((k) => n % k === 0);
      return X({ id: "divcrit", lv: 1, titre: "Les boîtes d'œufs",
        q: "Une ferme a ramassé " + n + " œufs aujourd'hui. Elle a des boîtes de 2, 3, 5, 6, 9 et 10 œufs.",
        parts: [{ label: "Sans poser de division, dis si on peut remplir exactement des boîtes de 2, de 3, de 5, de 9, de 10. Justifie avec les critères de divisibilité.", pts: 3 }, { label: "Et avec des boîtes de 6 ? Combien d'œufs reste-t-il ?", pts: 2 }, { label: "Combien d'œufs faudrait-il ajouter, au minimum, pour remplir exactement des boîtes de 9 ?", pts: 1 }],
        sol: ul(["Somme des chiffres : " + M(ds.join(" + ") + " = " + s) + ". " + [2, 3, 5, 9, 10].map((k) => k + " : " + (n % k === 0 ? "oui" : "non")).join(" ; ") + " (2 : chiffre des unités pair ; 3 et 9 : somme des chiffres divisible par 3, par 9 ; 5 : se termine par 0 ou 5 ; 10 : se termine par 0).", "Divisible par 6 = divisible par 2 <b>et</b> par 3 : non. " + M(n + " = 6 \\cdot " + Math.floor(n / 6) + " + " + (n % 6)) + " : il reste " + (n % 6) + " œuf" + (n % 6 > 1 ? "s" : "") + ".", M(n + " + " + add9 + " = " + (n + add9) + " = 9 \\cdot " + (n + add9) / 9) + " : il faut ajouter " + add9 + " œuf" + (add9 > 1 ? "s" : "") + "."]),
        chk: [[yes.length >= 1, "au moins un oui"], [(n + add9) % 9 === 0, "ajout"]], vals: [s, n % 6, add9, n + add9] }); },
    () => { let p, q, g; do { p = R.int(2, 7); q = R.int(2, 7); } while (p === q || g2(p, q) !== 1); g = pk([6, 8, 12, 14, 15, 18]); const a = g * p, b = g * q, divs = []; for (let k = 2; k <= g; k++) if (g % k === 0) divs.push(k);
      return X({ id: "arith", lv: 2, titre: "Les bouquets",
        q: "Une fleuriste a " + a + " roses et " + b + " tulipes. Elle veut faire des bouquets <b>identiques</b> en utilisant toutes les fleurs.",
        parts: [{ label: "Quel est le plus grand nombre de bouquets possible ? Justifie.", pts: 2 }, { label: "Combien de roses et de tulipes contient alors chaque bouquet ?", pts: 1 }, { label: "Donne tous les autres nombres de bouquets possibles (au moins 2 bouquets).", pts: 2 }],
        sol: ul(["C'est le PGDC de " + a + " et " + b + " : " + M("\\text{PGDC}(" + a + " ; " + b + ") = " + g) + " bouquets.", M(a + " : " + g + " = " + p) + " roses et " + M(b + " : " + g + " = " + q) + " tulipes.", "Les diviseurs communs : " + divs.join(", ") + " (ce sont les diviseurs de " + g + ")."]),
        chk: [[g2(a, b) === g, "pgdc"], [divs.every((d) => a % d === 0 && b % d === 0), "diviseurs"]], vals: [g, p, q] }); },
    () => { const C = []; for (const x of [6, 8, 9, 10, 12, 15, 18, 20, 24]) for (const y of [6, 8, 9, 10, 12, 15, 18, 20, 24]) if (x < y && y % x && lcm(x, y) <= 120 && 3600 % lcm(x, y) === 0 && lcm(x, y) !== x * y) C.push([x, y]); const [x, y] = pk(C), m = lcm(x, y), H = R.int(19, 22);
      return X({ id: "arith", lv: 2, titre: "Les deux phares",
        q: "Le phare A s'allume toutes les " + x + " secondes, le phare B toutes les " + y + " secondes. À " + H + " h 00 min 00 s, ils s'allument ensemble.",
        parts: [{ label: "Écris les premiers multiples de " + x + " et de " + y + ". Après combien de secondes s'allumeront-ils de nouveau ensemble ?", pts: 2 }, { label: "Lina dit : « il suffit de multiplier " + x + " par " + y + " ». A-t-elle raison ?", pts: 1 }, { label: "Combien de fois s'allument-ils ensemble entre " + H + " h 00 (exclu) et " + (H + 1) + " h 00 (inclus) ?", pts: 1 }],
        sol: ul(["Multiples de " + x + " : " + [1, 2, 3, 4, 5, 6].map((k) => k * x).join(", ") + "… ; de " + y + " : " + [1, 2, 3, 4].map((k) => k * y).join(", ") + "… Le premier commun : " + M("\\text{PPMC}(" + x + " ; " + y + ") = " + m) + " s.", "Non : " + M(x + " \\cdot " + y + " = " + x * y) + " est un multiple commun, mais pas le plus petit (" + m + ").", M("3600 : " + m + " = " + 3600 / m) + " fois."]),
        chk: [[m % x === 0 && m % y === 0 && m < x * y, "ppmc"]], vals: [m, 3600 / m] }); },
    () => { let p, q; do { p = R.int(5, 13); q = R.int(3, 11); } while (p <= q || g2(p, q) !== 1); const g = pk([12, 18, 20, 24, 30]), L = g * p, l = g * q;
      const fac = (n) => { const o = []; let k = 2; while (n > 1) { let e = 0; while (n % k === 0) { n /= k; e++; } if (e) o.push(e > 1 ? k + "^" + e : String(k)); k++; } return o.join(" \\cdot "); };
      return X({ id: "premiers", lv: 3, titre: "Le carrelage",
        q: "Une salle de bain rectangulaire mesure " + Q(L, "cm") + " sur " + Q(l, "cm") + ". On veut la carreler avec des carreaux carrés tous identiques, les plus grands possible, sans les couper (côté : un nombre entier de cm).",
        parts: [{ label: "Décompose " + L + " et " + l + " en produits de facteurs premiers.", pts: 2 }, { label: "Quel est le côté des carreaux ? Justifie.", pts: 1 }, { label: "Combien de carreaux faut-il ?", pts: 2 }],
        sol: ul([M(L + " = " + fac(L)) + " et " + M(l + " = " + fac(l)) + ".", "Le côté doit diviser " + L + " et " + l + ", et être le plus grand : " + M("\\text{PGDC} = " + fac(g) + " = " + g) + " cm.", M((L / g) + " \\cdot " + (l / g) + " = " + p * q) + " carreaux (" + p + " dans la longueur, " + q + " dans la largeur)."]),
        chk: [[g2(L, l) === g, "pgdc"]], vals: [g, p * q] }); },
  ];
  const RAISONA = [
    () => VF({ id: "premiers" }, [
      () => ["51 est un nombre premier.", false, M("51 = 3 \\cdot 17") + " (somme des chiffres 6, divisible par 3)."],
      () => ["91 est un nombre premier.", false, M("91 = 7 \\cdot 13") + "."],
      () => ["Un nombre divisible par 4 et par 6 est toujours divisible par 24.", false, "Contre-exemple : 12 est divisible par 4 et par 6, mais pas par 24."],
      () => { const n = 9 * R.int(13, 60); return ["Un nombre divisible par 9 est aussi divisible par 3.", true, "Car 9 = 3 · 3. Exemple : " + M(n + " = 9 \\cdot " + n / 9 + " = 3 \\cdot " + n / 3) + "."]; },
      () => ["La somme de deux nombres premiers est toujours paire.", false, "Contre-exemple : " + M("2 + 3 = 5") + "."],
      () => ["2 est le seul nombre premier pair.", true, "Tout autre nombre pair est divisible par 2, donc a au moins trois diviseurs (1, 2 et lui-même)."],
    ]),
    () => { const p = pk([5, 7, 11]), n = 12 * p, w = who();
      return X({ id: "premiers", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " décompose " + n + " : " + M(n + " = 4 \\cdot " + 3 * p + " = 2 \\cdot 2 \\cdot " + 3 * p) + ", donc " + M(n + " = 2^2 \\cdot " + 3 * p) + ".",
        parts: [{ label: "Le calcul est-il juste ? La décomposition est-elle terminée ? Explique.", pts: 1 }, { label: "Écris la bonne décomposition en facteurs premiers.", pts: 1 }],
        sol: ul(["Le calcul est juste, mais " + 3 * p + " n'est pas premier (" + M(3 * p + " = 3 \\cdot " + p) + ") : la décomposition n'est pas finie.", M(n + " = 2^2 \\cdot 3 \\cdot " + p) + "."]),
        chk: [[4 * 3 * p === n, "calcul"]], vals: [n] }); },
  ];
  RICH.arith9 = { ids: ["multdiv", "divcrit", "premiers", "arith"], label: "Arithmétique (9e)", ex: EXA, raison: RAISONA, minutes: 45 };

  // ===================== 9e · 5. Aires et périmètres =====================
  const EXP = [
    () => { const L = pk([18, 22, 25, 16.5]), l = pk([9, 12, 14.5]), por = pk([1.2, 1.5]), px = pk([8.5, 12, 14.5]), gr = pk([30, 35, 40]), w = who();
      const P = r6(2 * (L + l)), cl = r6(P - por), cost = r6(cl * px), Ar = r6(L * l), g = r6(Ar * gr);
      return X({ id: "perim", lv: 1, titre: "Le jardin",
        q: "Le jardin de " + w.n + " est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ", à " + Q(5, "m") + " de la maison. On veut le clôturer avec du grillage, en laissant un portail de " + Q(por, "m") + ", puis y semer du gazon.",
        parts: [{ label: "Calcule le périmètre du jardin.", pts: 1 }, { label: "Quelle longueur de grillage faut-il ? Combien coûte-t-il à " + chf(px) + " le mètre ?", pts: 2 }, { label: "Calcule l'aire du jardin.", pts: 1 }, { label: "Il faut " + gr + " g de graines par m². Quelle masse de graines faut-il, en kg ?", pts: 1 }],
        sol: ul([M("2 \\cdot (" + N(L) + " + " + N(l) + ") = " + N(P)) + " m.", M(N(P) + " - " + N(por) + " = " + N(cl)) + " m ; " + M(N(cl) + " \\cdot " + N(px) + " = " + Nk(cost, 2)) + " CHF. La distance à la maison ne sert à rien.", M(N(L) + " \\cdot " + N(l) + " = " + N(Ar)) + " m².", M(N(Ar) + " \\cdot " + gr + " = " + N(g)) + " g = " + Q(g / 1000, "kg") + "."]),
        chk: [[P > cl, "portail"], [Math.abs(g - L * l * gr) < 1e-6, "graines"]], vals: [P, cl, cost, Ar, g / 1000] }); },
    () => { let D, d, b, h; do { D = pk([60, 72, 80, 90]); d = pk([40, 48, 50, 54]); b = pk([45, 50, 55]); h = pk([28, 32, 36]); } while (Math.abs((D * d) / 2 - b * h) < 20); const s = Math.round(Math.sqrt((D / 2) ** 2 + (d / 2) ** 2) * 10) / 10, AL = (D * d) / 2, AP = b * h;
      return X({ id: "aire2", lv: 2, titre: "Cerf-volant et fanion",
        q: "Un cerf-volant a la forme d'un losange dont les diagonales mesurent " + Q(D, "cm") + " et " + Q(d, "cm") + " ; chaque côté mesure environ " + Q(s, "cm") + ". Un fanion a la forme d'un parallélogramme de base " + Q(b, "cm") + " et de hauteur " + Q(h, "cm") + ".",
        parts: [{ label: "Calcule l'aire du cerf-volant. Explique la formule (pense au rectangle qui l'entoure).", pts: 2 }, { label: "On coud un ruban tout autour du cerf-volant. Quelle longueur de ruban faut-il ?", pts: 1 }, { label: "Calcule l'aire du fanion.", pts: 1 }, { label: "Lequel demande le plus de tissu ? Combien de cm² de plus ?", pts: 1 }],
        sol: ul([M("A = \\frac{D \\cdot d}{2} = \\frac{" + D + " \\cdot " + d + "}{2} = " + N(AL)) + " cm² : le losange occupe la moitié du rectangle de " + D + " cm sur " + d + " cm.", M("4 \\cdot " + N(s) + " = " + N(r6(4 * s))) + " cm.", M(b + " \\cdot " + h + " = " + AP) + " cm² (base · hauteur, pas base · côté).", (AL > AP ? "Le cerf-volant" : "Le fanion") + ", de " + M(Math.abs(AL - AP)) + " cm²."]),
        chk: [[AL !== AP, "différents"]], vals: [AL, 4 * s, AP, Math.abs(AL - AP)] }); },
    () => { const Wd = pk([10, 12, 11]), H = pk([8, 9, 7]), w = pk([4, 5, 3.5]), h = pk([3, 2.5, 4]), px = pk([45, 52, 60]);
      const A = r6(Wd * H - w * h), P = r6(2 * (Wd + H)), sc = Math.min(230 / Wd, 170 / H), x0 = 45, y0 = 22, Pp = (x, y) => [x0 + x * sc, y0 + y * sc];
      const fig = svg(320, 230, pg([[0, 0], [Wd - w, 0], [Wd - w, h], [Wd, h], [Wd, H], [0, H]].map(([x, y]) => Pp(x, y))) + tx(x0 + (Wd * sc) / 2, y0 + H * sc + 18, Wd + " m") + tx(x0 - 6, y0 + (H * sc) / 2, H + " m", "f-txt", "end") + tx(x0 + ((Wd - w) * sc) / 2, y0 - 6, fmt(Wd - w) + " m") + tx(x0 + (Wd - w) * sc + 6, y0 + (h * sc) / 2 + 4, fmt(h) + " m", "f-txt", "start") + tx(x0 + (Wd - w / 2) * sc, y0 + h * sc - 6, "?", "f-accent f-txt") + tx(x0 + Wd * sc + 6, y0 + ((h + H) / 2) * sc, "?", "f-accent f-txt", "start"), "plan");
      return X({ id: "aire3", lv: 2, titre: "Le plan de l'appartement",
        q: "Voici le plan (en forme de L) d'un appartement. Toutes les cotes ne sont pas indiquées.", fig,
        parts: [{ label: "Trouve les deux longueurs qui manquent sur le plan.", pts: 2 }, { label: "Calcule le périmètre de l'appartement (longueur de plinthes, sans tenir compte des portes).", pts: 1 }, { label: "Calcule l'aire de deux façons différentes (découpage ou rectangle moins le coin manquant).", pts: 2 }, { label: "Le sol coûte " + chf(px) + " le m². Quel est le prix total ?", pts: 1 }],
        sol: ul(["Côté droit du haut vers le bas : " + M(H + " - " + N(h) + " = " + N(r6(H - h))) + " m ; marche horizontale : " + M(Wd + " - " + N(Wd - w) + " = " + N(w)) + " m.", "Comme pour le grand rectangle : " + M("2 \\cdot (" + Wd + " + " + H + ") = " + N(P)) + " m (les deux décrochements se compensent).", M(Wd + " \\cdot " + H + " - " + N(w) + " \\cdot " + N(h) + " = " + N(A)) + " m², ou " + M(N(Wd - w) + " \\cdot " + N(h) + " + " + Wd + " \\cdot " + N(r6(H - h)) + " = " + N(A)) + " m².", M(N(A) + " \\cdot " + px + " = " + Nk(A * px, 2)) + " CHF."]),
        chk: [[Math.abs((Wd - w) * h + Wd * (H - h) - A) < 1e-9, "deux découpages"]], vals: [r6(H - h), w, P, A, A * px] }); },
    () => { const P = pk([36, 40, 44, 48]), half = P / 2, Ls = [half - 2, half - 5, half - 8].map((x) => x), sq = half / 2, Ar = pk([96, 120, 84]), x = pk([8, 12, 6].filter((v) => Ar % v === 0 && v * v !== Ar)), y = Ar / x;
      return X({ id: "aire1", lv: 3, titre: "Même clôture, aires différentes",
        q: "On dispose de " + Q(P, "m") + " de clôture pour faire un enclos rectangulaire pour des moutons.",
        parts: [{ label: "Calcule l'aire de l'enclos si sa longueur mesure " + Ls.map((L) => L + " m").join(", puis ") + ".", pts: 3 }, { label: "Quelle forme donne la plus grande aire ? Calcule cette aire.", pts: 1 }, { label: "Un autre enclos rectangulaire a une aire de " + Ar + " m² et une largeur de " + x + " m. Calcule sa longueur et son périmètre.", pts: 2 }],
        sol: ul([Ls.map((L) => "longueur " + L + ", largeur " + M(half + " - " + L + " = " + (half - L)) + " : " + M(L + " \\cdot " + (half - L) + " = " + L * (half - L)) + " m²").join(" ; ") + " (longueur + largeur = " + half + " m).", "Le carré de côté " + M(P + " : 4 = " + N(sq)) + " m : " + M(N(sq) + "^2 = " + N(sq * sq)) + " m², plus que toutes les autres.", "Longueur : " + M(Ar + " : " + x + " = " + y) + " m ; périmètre : " + M("2 \\cdot (" + x + " + " + y + ") = " + 2 * (x + y)) + " m."]),
        chk: [[Ls.every((L) => L * (half - L) < sq * sq), "carré max"], [x * y === Ar, "inverse"]], vals: [...Ls.map((L) => L * (half - L)), sq * sq, y, 2 * (x + y)] }); },
  ];
  const RAISONP = [
    () => VF({ id: "aire1" }, [
      () => { const a = R.int(3, 8), b = R.int(9, 14); return ["Si on double la longueur et la largeur d'un rectangle, son aire double.", false, "Elle est multipliée par 4 : " + M(a + " \\cdot " + b + " = " + a * b) + " et " + M(2 * a + " \\cdot " + 2 * b + " = " + 4 * a * b) + "."]; },
      () => { const a = R.int(3, 8), b = R.int(9, 14); return ["Si on double la longueur et la largeur d'un rectangle, son périmètre double.", true, M("2 \\cdot (" + 2 * a + " + " + 2 * b + ") = " + 4 * (a + b) + " = 2 \\cdot " + 2 * (a + b)) + "."]; },
      () => ["Deux rectangles de même aire ont le même périmètre.", false, "4 × 9 et 6 × 6 ont une aire de 36, mais des périmètres de 26 et 24."],
      () => ["Un carré de 4 cm de côté a un périmètre égal à son aire.", false, "16 cm et 16 cm² ne se comparent pas : une longueur et une aire ne sont pas des grandeurs de même nature."],
      () => ["L'aire d'un triangle est la moitié de celle du rectangle qui a la même base et la même hauteur.", true, M("A = \\frac{b \\cdot h}{2}") + " ; on le voit en découpant le rectangle."],
    ]),
    () => { const b = pk([8, 10, 12]), s = pk([7, 9, 11]), h = s - pk([1, 2]), w = who(), wrong = (b * s) / 2, right = (b * h) / 2;
      const fig = svg(300, 150, pg([[40, 130], [260, 130], [100, 30]], "f-shape") + ln(100, 30, 100, 130, "f-accent", "stroke-dasharray=\"5 4\"") + tx(150, 146, b + " cm") + tx(62, 74, s + " cm", "f-txt", "end") + tx(106, 90, h + " cm", "f-accent f-txt", "start"), "triangle");
      return X({ id: "aire1", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " calcule l'aire de ce triangle : " + M("A = \\frac{" + b + " \\cdot " + s + "}{2} = " + N(wrong)) + " cm².", fig,
        parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule l'aire correcte.", pts: 1 }],
        sol: ul([w.Il + " a utilisé le côté oblique (" + s + " cm) au lieu de la hauteur, perpendiculaire à la base (" + h + " cm).", M("A = \\frac{" + b + " \\cdot " + h + "}{2} = " + N(right)) + " cm²."]),
        chk: [[wrong !== right, "différent"]], vals: [right] }); },
  ];
  RICH.aire9 = { ids: ["perim", "aire1", "aire2", "aire3"], label: "Aires et périmètres (9e)", ex: EXP, raison: RAISONP, minutes: 45 };

  // ===================== 9e · 6. Nombres relatifs =====================
  const sg = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const EXR = [
    () => { const C = sh(["Genève", "Oslo", "Moscou", "Montréal", "Rome", "Reykjavik"]).slice(0, 5), t = sh([-12, -7, -3, 2, 5, -9, 8, -1.5, 4.5]).slice(0, 5), up = pk([6, 7, 9]);
      while (!t.some((v) => v < 0) || !t.some((v) => v > 0)) t[0] = -t[0];
      let up2 = up; while (t.some((v) => r6(v + up2) === 0)) up2++;
      const srt = t.slice().sort((a, b) => a - b), ec = r6(srt[4] - srt[0]), nt = t.map((v) => r6(v + up2)), neg = nt.filter((v) => v < 0).length;
      return X({ id: "relrep", lv: 1, titre: "Les températures du matin",
        q: "Températures relevées à 6 h dans cinq villes :" + tab(["ville", "température (°C)"], C.map((c, i) => [c, T(t[i])])),
        parts: [{ label: "Range ces températures dans l'ordre croissant.", pts: 1 }, { label: "Quel est l'écart entre la ville la plus chaude et la plus froide ?", pts: 1 }, { label: "À 14 h, la température a augmenté de " + up2 + " °C partout. Donne les nouvelles températures.", pts: 2 }, { label: "Dans combien de villes fait-il encore moins de 0 °C ?", pts: 1 }],
        sol: ul([M(srt.map(N).join(" < ")) + ".", M(N(srt[4]) + " - " + sg(srt[0]) + " = " + N(ec)) + " °C.", C.map((c, i) => c + " : " + M(N(t[i]) + " + " + up2 + " = " + N(nt[i]))).join(" ; ") + ".", neg ? neg + " ville" + (neg > 1 ? "s" : "") + "." : "Aucune."]),
        chk: [[ec > 0, "écart"], [t.some((v) => v < 0), "négatifs"]], vals: [ec] }); },
    () => { let s, m, f; do { s = pk([2, 3, -2, 4]); m = [pk([3, 4, 5]), -pk([6, 7, 8]), pk([2, 3]), -pk([2, 4])]; f = s + m.reduce((a, b) => a + b, 0); } while (f < -4 || f > 8 || Math.abs(f) < 2); const g = pk([-3, -2]), k = pk([5, 6, 7]);
      return X({ id: "reladd", lv: 2, titre: "L'ascenseur",
        q: "Un immeuble a des étages de −4 (parking) à +8. Le rez-de-chaussée est l'étage 0. Le concierge part de l'étage " + N(s) + " et fait ces déplacements : " + m.map((x) => (x > 0 ? "monter de " + x : "descendre de " + -x)).join(", ") + " étages.",
        parts: [{ label: "Écris un calcul avec des nombres relatifs et trouve l'étage d'arrivée.", pts: 2 }, { label: "Combien d'étages y a-t-il entre l'étage " + N(g) + " et l'étage +" + k + " ?", pts: 1 }, { label: "Une habitante descend de " + k + " étages et arrive à l'étage " + N(g) + ". De quel étage est-elle partie ?", pts: 2 }],
        sol: ul([M(sg(s) + " + " + m.map(sg).join(" + ") + " = " + N(f)) + " : étage " + N(f) + ".", M(k + " - (" + N(g) + ") = " + (k - g)) + " étages.", M(N(g) + " + " + k + " = " + (g + k)) + " : étage " + N(g + k) + " (on remonte de " + k + ")."]),
        chk: [[f >= -4 && f <= 8 && f !== 0, "étage valide"], [g + k - k === g, "inverse"]], vals: [f, k - g, g + k] }); },
    () => { const s0 = pk([240, 185, 320]), ops = [["argent de poche", pk([60, 80])], ["sortie cinéma", -pk([25, 32])], ["jeu vidéo", -pk([59, 79, 69])], ["baby-sitting", pk([45, 60])], ["cadeau d'anniversaire", -pk([35, 48])]], miss = R.int(1, 4), fin = s0 + ops.reduce((a, o) => a + o[1], 0), w = who();
      const rows = ops.map((o, i) => [o[0], i === miss ? "?" : (o[1] > 0 ? "+" : "") + o[1]]);
      return X({ id: "reladd", lv: 2, titre: "Le compte de " + w.n,
        q: w.n + " note ses opérations du mois (en CHF). Au début du mois, " + w.il + " avait " + s0 + " CHF ; à la fin, " + fin + " CHF." + tab(["opération", "montant (CHF)"], rows),
        parts: [{ label: "Calcule la somme des montants connus.", pts: 1 }, { label: "Trouve le montant qui manque (avec son signe). Explique.", pts: 2 }, { label: "Si " + w.n + " avait acheté le jeu vidéo deux fois (erreur de la banque), combien aurait-" + w.il + " à la fin du mois ?", pts: 1 }],
        sol: ul([M(ops.filter((o, i) => i !== miss).map((o) => sg(o[1])).join(" + ") + " = " + (fin - s0 - ops[miss][1])) + ".", "Variation totale : " + M(fin + " - " + s0 + " = " + (fin - s0)) + ". Montant manquant : " + M((fin - s0) + " - " + sg(fin - s0 - ops[miss][1]) + " = " + (ops[miss][1] > 0 ? "+" : "") + ops[miss][1]) + " (" + ops[miss][0] + ").", M(fin + " + " + sg(ops[2][1]) + " = " + (fin + ops[2][1])) + " CHF."]),
        chk: [[s0 + ops.reduce((a, o) => a + o[1], 0) === fin, "solde"], [fin > 0, "positif"]], vals: [ops[miss][1], fin + ops[2][1]] }); },
    () => { let b, l2, l3, top; do { b = [pk([-5, -3, 4, 6]), pk([-7, -2, 3, 5]), pk([-6, 2, -4, 8]), pk([3, -8, -5, 7])]; l2 = [b[0] + b[1], b[1] + b[2], b[2] + b[3]]; l3 = [l2[0] + l2[1], l2[1] + l2[2]]; top = l3[0] + l3[1]; } while ([...l2, ...l3, top].some((v) => Math.abs(v) < 2));
      const box = (x, y, s, hi) => "<rect x=\"" + x + "\" y=\"" + y + "\" width=\"60\" height=\"30\" class=\"" + (hi ? "f-fill2" : "f-shape2") + "\"/>" + tx(x + 30, y + 20, s, hi ? "f-accent f-txt" : "f-txt", "middle", 14);
      const fig = svg(300, 140, box(30, 100, b[0]) + box(90, 100, "?", 1) + box(150, 100, b[2]) + box(210, 100, b[3]) + box(60, 68, "") + box(120, 68, l2[1]) + box(180, 68, "") + box(90, 36, "") + box(150, 36, "") + box(120, 4, ""), "pyramide");
      return X({ id: "reladd", lv: 3, titre: "La pyramide de nombres",
        q: "Dans cette pyramide, chaque brique contient la somme des deux briques sur lesquelles elle repose. Une brique du bas est cachée.", fig,
        parts: [{ label: "Trouve le nombre caché. Explique.", pts: 1 }, { label: "Complète toute la pyramide.", pts: 2 }, { label: "Si on augmente de 2 la brique en bas à gauche, de combien augmente le sommet ? Et si on augmente de 2 la brique cachée ?", pts: 2 }],
        sol: ul([M("? + " + sg(b[2]) + " = " + N(l2[1])) + ", donc " + M("? = " + N(l2[1]) + " - " + sg(b[2]) + " = " + N(b[1])) + ".", "Deuxième rangée : " + l2.map(N).join(" ; ") + ". Troisième : " + l3.map(N).join(" ; ") + ". Sommet : " + M(N(l3[0]) + " + " + sg(l3[1]) + " = " + N(top)) + ".", "La brique de gauche ne compte qu'une fois dans le sommet : +2. La brique cachée compte 3 fois (elle « monte » par trois chemins) : +6."]),
        chk: [[top === b[0] + 3 * b[1] + 3 * b[2] + b[3], "sommet"], [b[1] !== 0, "caché"]], vals: [b[1], top] }); },
  ];
  const RAISONR = [
    () => { const a = R.int(5, 9), c = R.int(2, a - 2), w = who();
      return X({ id: "reladd", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " écrit : " + M("(-" + a + ") - (-" + c + ") = -" + (a + c)) + " et " + M("(-" + c + ") - " + a + " = " + (a - c)) + ".",
        parts: [{ label: "Explique les erreurs (tu peux t'aider d'une droite graduée ou d'un thermomètre).", pts: 2 }, { label: "Écris les bons résultats.", pts: 1 }],
        sol: ul(["Soustraire un nombre, c'est additionner son opposé : " + M("(-" + a + ") - (-" + c + ") = (-" + a + ") + " + c) + ". Et " + M("(-" + c + ") - " + a) + " : on part de " + -c + " et on descend encore de " + a + ".", M("(-" + a + ") - (-" + c + ") = " + (c - a)) + " et " + M("(-" + c + ") - " + a + " = " + (-c - a)) + "."]),
        chk: [[c - a !== -(a + c), "erreur"]], vals: [c - a, -c - a] }); },
    () => VF({ id: "relrep" }, [
      () => { const a = R.int(2, 9), b = R.int(2, 9); return ["La somme de deux nombres négatifs est négative.", true, "Exemple : " + M("(-" + a + ") + (-" + b + ") = -" + (a + b)) + " : on descend deux fois."]; },
      () => { const a = R.int(2, 4), b = R.int(5, 9); return ["La différence de deux nombres négatifs est toujours négative.", false, "Contre-exemple : " + M("(-" + a + ") - (-" + b + ") = " + (b - a)) + "."]; },
      () => { const a = R.int(6, 12), b = R.int(2, 5); return [M("-" + a + " > -" + b) + " car " + a + " > " + b + ".", false, M("-" + a) + " est plus loin à gauche de 0 : " + M("-" + a + " < -" + b) + "."]; },
      () => ["L'opposé d'un nombre est toujours négatif.", false, "L'opposé de −5 est 5, qui est positif."],
      () => { const a = R.int(3, 9); return ["Entre −" + a + " et " + a + ", il y a " + (2 * a - 1) + " nombres entiers.", true, "De −" + (a - 1) + " à " + (a - 1) + " : " + (a - 1) + " négatifs, 0 et " + (a - 1) + " positifs, soit " + (2 * a - 1) + "."]; },
    ]),
  ];
  RICH.rel9 = { ids: ["relrep", "reladd"], label: "Nombres relatifs (9e)", ex: EXR, raison: RAISONR, minutes: 45 };

  // ===================== 9e · 7. 3D : espace, grandeurs et mesures =====================
  const PNAME = { 3: "triangle", 4: "quadrilatère", 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone", 10: "décagone" };
  const EXS = [
    () => { const n = pk([5, 6, 7, 8]), m = pk([5, 6, 7, 9, 10].filter((x) => x !== n)), Fp = n + 2, Ap = 3 * n, Sp = 2 * n, Fy = n + 1, Ay = 2 * n, Sy = n + 1;
      return X({ id: "solides", lv: 1, titre: "Prisme et pyramide",
        q: "On considère un prisme droit et une pyramide qui ont tous deux pour base un " + PNAME[n] + " (" + n + " côtés).",
        parts: [{ label: "Combien de faces, d'arêtes et de sommets a le prisme ? Explique ton comptage.", pts: 2 }, { label: "Même question pour la pyramide.", pts: 2 }, { label: "Vérifie pour les deux solides : faces + sommets − arêtes = 2.", pts: 1 }, { label: "Un prisme a " + 3 * m + " arêtes. Quelle est la forme de sa base ?", pts: 1 }],
        sol: ul(["Faces : 2 bases + " + n + " rectangles = " + Fp + " ; arêtes : " + n + " en haut, " + n + " en bas, " + n + " verticales = " + Ap + " ; sommets : " + Sp + ".", "Faces : 1 base + " + n + " triangles = " + Fy + " ; arêtes : " + n + " + " + n + " = " + Ay + " ; sommets : " + n + " + 1 = " + Sy + ".", M(Fp + " + " + Sp + " - " + Ap + " = 2") + " et " + M(Fy + " + " + Sy + " - " + Ay + " = 2") + " (relation d'Euler).", M(3 * m + " : 3 = " + m) + " côtés : un " + PNAME[m] + "."]),
        chk: [[Fp + Sp - Ap === 2 && Fy + Sy - Ay === 2, "Euler"]], vals: [Fp, Ap, Sp, Fy, Ay, Sy, m] }); },
    () => { const L = pk([32, 30, 34]), l = pk([18, 20, 19]), h = pk([11, 12, 13]), V = L * l * h, Ac = L * l + 2 * (L * h + l * h), w = who();
      return X({ id: "volpave", lv: 2, titre: "La boîte à chaussures",
        q: "Une boîte à chaussures (sans couvercle) est un pavé de " + Q(L, "cm") + " de long, " + Q(l, "cm") + " de large et " + Q(h, "cm") + " de haut. Les chaussures de " + w.n + " sont en pointure " + pk([38, 41, 43]) + ".",
        parts: [{ label: "Calcule le volume de la boîte en cm³, puis en dm³.", pts: 2 }, { label: "Calcule l'aire du carton nécessaire (5 faces, sans couvercle).", pts: 2 }, { label: "Le couvercle déborde de 1 cm de chaque côté (sans les bords). Quelle est son aire ?", pts: 1 }],
        sol: ul([M(L + " \\cdot " + l + " \\cdot " + h + " = " + N(V)) + " cm³ = " + Q(V / 1000, "dm^3") + ".", "Fond " + M(L + " \\cdot " + l + " = " + L * l) + ", deux grands côtés " + M("2 \\cdot " + L + " \\cdot " + h + " = " + 2 * L * h) + ", deux petits " + M("2 \\cdot " + l + " \\cdot " + h + " = " + 2 * l * h) + " : " + Q(Ac, "cm^2") + ". La pointure ne sert à rien.", M((L + 2) + " \\cdot " + (l + 2) + " = " + (L + 2) * (l + 2)) + " cm²."]),
        chk: [[Ac === L * l + 2 * L * h + 2 * l * h, "aire"]], vals: [V, V / 1000, Ac, (L + 2) * (l + 2)] }); },
    () => { let L, l, d, deb, V, Vl, min; do { L = pk([4, 5, 6]); l = pk([2.5, 3]); d = pk([0.4, 0.5, 0.6, 0.75]); deb = pk([20, 25, 40, 50]); V = r6(L * l * d); Vl = r6(V * 1000); min = Vl / deb; } while (!Number.isInteger(min) || min < 90);
      return X({ id: "volpave", lv: 2, titre: "Le bassin du jardin",
        q: "Un bassin a la forme d'un pavé : le fond est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ". Il contient " + Q(V, "m^3") + " d'eau.",
        parts: [{ label: "Quelle est la hauteur de l'eau ? Donne-la en m et en cm.", pts: 2 }, { label: "Combien de litres d'eau y a-t-il ?", pts: 1 }, { label: "On le remplit avec un tuyau qui débite " + deb + " L par minute. Combien de temps faut-il (en h et min) ?", pts: 2 }],
        sol: ul([M("V = L \\cdot l \\cdot h") + ", donc " + M("h = " + N(V) + " : (" + L + " \\cdot " + N(l) + ") = " + N(V) + " : " + N(L * l) + " = " + N(d)) + " m = " + Q(d * 100, "cm") + ".", M("1" + u("m^3") + " = 1000" + u("L")) + " : " + Q(Vl, "L") + ".", M(N(Vl) + " : " + deb + " = " + N(min)) + " min = " + dur(min) + "."]),
        chk: [[Math.abs(L * l * d - V) < 1e-9, "hauteur"], [Number.isInteger(min), "minutes entières"]], vals: [d, d * 100, Vl, min] }); },
    () => { const [a, b, c] = sh([3, 4, 5, 6, 7]).slice(0, 3), n = a * b * c, in0 = (a - 2) * (b - 2) * (c - 2), Ap = 2 * (a * b + b * c + a * c), two = 4 * ((a - 2) + (b - 2) + (c - 2));
      return X({ id: "volpave", lv: 3, titre: "Les petits cubes peints",
        q: "On assemble des petits cubes de 1 cm d'arête pour former un pavé de " + a + " cm × " + b + " cm × " + c + " cm. Puis on peint tout l'extérieur du pavé en rouge.",
        parts: [{ label: "Combien de petits cubes faut-il ? Quel est le volume du pavé ?", pts: 1 }, { label: "Quelle est l'aire de la surface peinte ?", pts: 1 }, { label: "Combien de petits cubes ont 3 faces peintes ? (Pense aux coins.)", pts: 1 }, { label: "Combien de petits cubes n'ont <b>aucune</b> face peinte ? Explique.", pts: 2 }],
        sol: ul([M(a + " \\cdot " + b + " \\cdot " + c + " = " + n) + " cubes ; volume " + Q(n, "cm^3") + ".", M("2 \\cdot (" + a + " \\cdot " + b + " + " + b + " \\cdot " + c + " + " + a + " \\cdot " + c + ") = " + Ap) + " cm².", "Les 8 cubes des sommets.", "Ce sont ceux de l'intérieur : un pavé de " + M((a - 2) + " \\cdot " + (b - 2) + " \\cdot " + (c - 2) + " = " + in0) + " cubes (on enlève une couche de chaque côté). Les cubes à 2 faces peintes, sur les arêtes, sont " + two + "."]),
        chk: [[n === in0 + 8 + two + 2 * ((a - 2) * (b - 2) + (b - 2) * (c - 2) + (a - 2) * (c - 2)), "dénombrement"]], vals: [n, Ap, in0] }); },
  ];
  const RAISONS = [
    () => VF({ id: "volpave" }, [
      () => { const a = pk([2, 3]); return ["Si on double l'arête d'un cube, son volume double.", false, "Il est multiplié par 8 : " + M(a + "^3 = " + a ** 3) + " et " + M(2 * a + "^3 = " + 8 * a ** 3) + "."]; },
      () => ["Deux pavés de même volume ont la même aire.", false, "1 × 1 × 8 et 2 × 2 × 2 ont un volume de 8 cm³, mais des aires de 34 cm² et 24 cm²."],
      () => ["Un cube est un pavé particulier.", true, "C'est un pavé dont les trois dimensions sont égales."],
      () => ["Un pavé a 6 faces, 12 arêtes et 8 sommets.", true, "6 + 8 − 12 = 2 (relation d'Euler)."],
      () => { const n = pk([5, 6, 8]); return ["Une pyramide à base " + PNAME[n] + " a " + 2 * n + " faces.", false, "Elle a " + n + " faces triangulaires + 1 base = " + (n + 1) + " faces (" + 2 * n + ", ce sont ses arêtes)."]; },
    ]),
    () => { const a = pk([4, 5, 6, 7]), w = who();
      return X({ id: "volpave", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " calcule le volume d'un cube de " + Q(a, "cm") + " d'arête : " + M(a + " \\cdot 3 = " + 3 * a) + " cm³. Puis son aire : " + M(a + " \\cdot " + a + " = " + a * a) + " cm².",
        parts: [{ label: "Quelles sont ses deux erreurs ?", pts: 2 }, { label: "Calcule le volume et l'aire du cube.", pts: 1 }],
        sol: ul(["Le volume est " + M(a + "^3 = " + a + " \\cdot " + a + " \\cdot " + a) + " (pas " + a + " · 3) ; l'aire du cube compte ses 6 faces (" + a * a + " cm², c'est l'aire d'une seule face).", "Volume " + M(a + "^3 = " + a ** 3) + " cm³ ; aire " + M("6 \\cdot " + a * a + " = " + 6 * a * a) + " cm²."]),
        chk: [[a ** 3 !== 3 * a, "erreur"]], vals: [a ** 3, 6 * a * a] }); },
  ];
  RICH.sol9 = { ids: ["solides", "volpave"], label: "Solides et volumes (9e)", ex: EXS, raison: RAISONS, minutes: 45 };

  // ===================== 9e · 8. Écriture fractionnaire (dans Q+) =====================
  // Écriture décimale avec période : 7/24 = 0,291\overline{6}.
  const perDec = (n, d) => { const ip = Math.floor(n / d); let r = n % d, s = "", seen = {}; while (r && seen[r] === undefined) { seen[r] = s.length; r *= 10; s += Math.floor(r / d); r %= d; } return r ? ip + "{,}" + s.slice(0, seen[r]) + "\\overline{" + s.slice(seen[r]) + "}" : ip + (s ? "{,}" + s : ""); };
  const EXF = [
    () => { const [n, f1, f2] = pk([[24, [1, 3], [3, 8]], [20, [2, 5], [1, 4]], [30, [2, 5], [1, 3]], [28, [3, 7], [1, 4]], [18, [4, 9], [1, 3]]] /* 26.11 : classe de 18 (et non 36) */), b = (n * f1[0]) / f1[1], p = (n * f2[0]) / f2[1], v = n - b - p, fv2 = fr(v, n);
      return X({ id: "fractout", lv: 1, titre: "Comment viens-tu à l'école ?",
        q: "Dans une classe de " + n + " élèves, " + M(ft(f1)) + " des élèves viennent en bus, " + M(ft(f2)) + " à pied et les autres à vélo.",
        parts: [{ label: "Combien d'élèves viennent en bus ? à pied ?", pts: 2 }, { label: "Combien viennent à vélo ?", pts: 1 }, { label: "Quelle fraction de la classe vient à vélo ? Simplifie-la.", pts: 1 }, { label: "Est-ce plus ou moins que le quart de la classe ? Justifie.", pts: 1 }],
        sol: ul([M(ft(f1) + " \\text{ de } " + n + " = " + n + " : " + f1[1] + " \\cdot " + f1[0] + " = " + b) + " ; " + M(ft(f2) + " \\text{ de } " + n + " = " + p) + ".", M(n + " - " + b + " - " + p + " = " + v) + " élèves.", M("\\frac{" + v + "}{" + n + "}" + (fv2[1] !== n ? " = " + ft(fv2) : "")) + ".", "Le quart, c'est " + M(n + " : 4 = " + N(n / 4)) + " élèves : " + (v > n / 4 ? "plus" : v < n / 4 ? "moins" : "autant") + " (" + v + " élèves)."]),
        chk: [[Number.isInteger(b) && Number.isInteger(p) && v > 1 && v * 4 !== n, "entiers"]], vals: [b, p, v] }); },
    () => { let F3; do F3 = sh([[1, 2], [2, 3], [3, 4], [5, 6], [3, 8], [5, 8], [5, 12], [7, 12], [1, 3], [1, 4], [1, 6], [7, 8]]).slice(0, 3); while (new Set(F3.map((f) => f[1])).size < 3 || Math.abs(F3.reduce((t, f) => t + f[0] / f[1], 0) - 1) < 1e-9);
      const names = sh(["Aya", "Ben", "Chloé", "Dario", "Eva", "Fanny"]).slice(0, 3), k = pk([2, 3]), shown = [[F3[0][0] * k, F3[0][1] * k], F3[1], F3[2]], D = F3.reduce((m, f) => lcm(m, f[1]), 1), srt = F3.map((f, i) => [f, names[i]]).sort((x, y) => fv(y[0]) - fv(x[0])), S = F3.reduce((s, f) => fadd(s, f), [0, 1]);
      return X({ id: "fracrep", lv: 2, titre: "Les tartes",
        q: "Trois amis ont chacun une tarte de même taille. " + names.map((n, i) => n + " en a mangé " + M("\\frac{" + shown[i][0] + "}{" + shown[i][1] + "}")).join(", ") + ".",
        parts: [{ label: "Simplifie la fraction de " + names[0] + ".", pts: 1 }, { label: "Écris les trois fractions avec le même dénominateur, puis range-les de la plus grande à la plus petite.", pts: 2 }, { label: "Qui a mangé le plus ?", pts: 1 }, { label: "Ensemble, ont-ils mangé plus d'une tarte entière ? Justifie par un calcul.", pts: 2 }],
        sol: ul([M("\\frac{" + shown[0][0] + "}{" + shown[0][1] + "} = " + ft(F3[0])) + " (on divise par " + k + ").", "Dénominateur commun " + D + " : " + F3.map((f, i) => names[i] + " " + M("\\frac{" + f[0] * (D / f[1]) + "}{" + D + "}")).join(", ") + ". Ordre : " + srt.map((x) => x[1]).join(" > ") + ".", srt[0][1] + ".", "Somme : " + M("\\frac{" + F3.map((f) => f[0] * (D / f[1])).join(" + ") + "}{" + D + "} = " + ft(S)) + " : " + (fv(S) > 1 ? "oui, plus d'une tarte." : "non, moins d'une tarte.")]),
        chk: [[new Set(F3.map(fv)).size === 3, "distinctes"], [Math.abs(fv(S) - 1) > 1e-9, "pas égal à 1"]], vals: [fv(S)] }); },
    () => { let c; do { c = [R.int(9, 18), R.int(7, 14)]; c.push(40 - c[0] - c[1]); } while (c[2] < 5 || new Set(c).size < 3); const sp = ["football", "natation", "basket"], k = pk([5, 7, 11]), n2 = 24;
      return X({ id: "fracconv", lv: 2, titre: "Le sondage",
        q: "On a demandé à 40 élèves leur sport préféré : " + sp.map((s, i) => c[i] + " ont choisi " + (s === "natation" ? "la " : "le ") + s).join(", ") + ". Dans une autre classe de " + n2 + " élèves, " + k + " ont choisi le football.",
        parts: [{ label: "Pour chaque sport, écris la fraction des 40 élèves (simplifiée), puis son écriture décimale et le pourcentage.", pts: 3 }, { label: "Écris " + M("\\frac{" + k + "}{" + n2 + "}") + " sous forme décimale (indique la période).", pts: 1 }, { label: "Dans quel groupe la part d'élèves qui préfèrent le football est-elle la plus grande ?", pts: 1 }],
        sol: ul([sp.map((s, i) => s + " : " + M("\\frac{" + c[i] + "}{40} = " + ft(fr(c[i], 40)) + " = " + N(c[i] / 40) + " = " + N(r6(c[i] * 2.5)) + "\\,\\%")).join(" ; ") + ".", M("\\frac{" + k + "}{" + n2 + "} = " + perDec(k, n2)) + "… (les chiffres sous la barre se répètent), soit environ " + N(Math.round((k / n2) * 1000) / 10) + " %.", (c[0] / 40 > k / n2 ? "Dans le premier groupe" : "Dans la deuxième classe") + " : " + N(c[0] / 40) + " " + (c[0] / 40 > k / n2 ? ">" : "<") + " " + N(Math.round((k / n2) * 1000) / 1000) + "…"]),
        chk: [[c[0] + c[1] + c[2] === 40, "total"], [Math.abs(c[0] / 40 - k / n2) > 1e-9, "comparaison"], [/overline/.test(perDec(k, n2)), "période"]], vals: c.map((x) => x / 40) }); },
    () => { let f0, us, ad, T0, a1, fin; do { f0 = pk([[3, 4], [2, 3], [5, 6], [4, 5]]); us = pk([[2, 5], [1, 3], [1, 4], [3, 10], [5, 12]]); ad = pk([[1, 6], [1, 5], [1, 4], [1, 12]]); T0 = pk([60, 120]); a1 = fsub(f0, us); fin = fadd(a1, ad); } while (a1[0] <= 0 || fv(fin) >= 1 || !Number.isInteger((T0 * fin[0]) / fin[1]));
      const Lf = (T0 * fin[0]) / fin[1], w = who();
      return X({ id: "fracadd", lv: 3, titre: "Le réservoir",
        q: "Le réservoir de la voiture de la famille de " + w.n + " contient " + T0 + " L quand il est plein. Au départ, il est rempli aux " + M(ft(f0)) + ". Le trajet consomme " + M(ft(us)) + " du réservoir plein. À l'arrivée, on ajoute " + M(ft(ad)) + " d'un réservoir plein.",
        parts: [{ label: "Quelle fraction du réservoir reste-t-il après le trajet ?", pts: 2 }, { label: "Quelle fraction après le complément ?", pts: 1 }, { label: "Combien de litres cela représente-t-il ?", pts: 1 }, { label: "Combien de litres faudrait-il encore pour faire le plein ?", pts: 1 }],
        sol: ul([M(ft(f0) + " - " + ft(us) + " = " + ft(a1)) + " (même dénominateur d'abord).", M(ft(a1) + " + " + ft(ad) + " = " + ft(fin)) + ".", M(ft(fin) + " \\text{ de } " + T0 + " = " + Lf) + " L.", M(T0 + " - " + Lf + " = " + (T0 - Lf)) + " L."]),
        chk: [[Math.abs(fv(fin) - (fv(f0) - fv(us) + fv(ad))) < 1e-9, "fractions"]], vals: [fv(a1), fv(fin), Lf, T0 - Lf] }); },
  ];
  const RAISONF = [
    () => { let a, b, c, d; do { [a, b] = pk([[1, 3], [2, 5], [1, 4], [3, 7]]); [c, d] = pk([[1, 2], [1, 6], [2, 3]]); } while (Math.abs(a / b + c / d - 1) < 1e-9); const w = who(), S = fadd([a, b], [c, d]);
      return X({ id: "fracadd", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " écrit : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + ".",
        parts: [{ label: "Explique son erreur. Montre avec " + M("\\frac{1}{2} + \\frac{1}{2}") + " que sa méthode ne peut pas marcher.", pts: 2 }, { label: "Calcule correctement.", pts: 1 }],
        sol: ul(["On n'additionne pas les dénominateurs : on met d'abord les fractions au même dénominateur. Avec sa méthode, " + M("\\frac{1}{2} + \\frac{1}{2} = \\frac{2}{4} = \\frac{1}{2}") + ", alors que deux demis font 1.", M("\\frac{" + a * (lcm(b, d) / b) + "}{" + lcm(b, d) + "} + \\frac{" + c * (lcm(b, d) / d) + "}{" + lcm(b, d) + "} = " + ft(S)) + "."]),
        chk: [[Math.abs(fv(S) - (a + c) / (b + d)) > 1e-9, "erreur"]], vals: [fv(S)] }); },
    () => VF({ id: "fracper" }, [
      () => ["On a " + M("\\frac{2}{3} = 0{,}66") + ".", false, M("\\frac{2}{3} = 0{,}666\\ldots = 0{,}\\overline{6}") + " : 0,66 n'en est qu'un arrondi."],
      () => { const p = pk([[3, 4, 75], [2, 5, 40], [7, 20, 35]]); return [M("\\frac{" + p[0] + "}{" + p[1] + "} = " + p[2] + "\\,\\%") + ".", true, M("\\frac{" + p[0] + "}{" + p[1] + "} = \\frac{" + p[2] + "}{100}") + "."]; },
      () => ["Si on ajoute 1 au numérateur et au dénominateur, la fraction ne change pas.", false, M("\\frac{1}{2} \\ne \\frac{2}{3}") + " (0,5 et 0,666…)."],
      () => [M("\\frac{1}{7} > \\frac{1}{6}") + " car 7 > 6.", false, "Partager en 7 donne des parts plus petites qu'en 6 : " + M("\\frac{1}{7} < \\frac{1}{6}") + "."],
      () => [M("\\frac{5}{8} > \\frac{3}{5}") + ".", true, M("\\frac{25}{40} > \\frac{24}{40}") + "."],
      () => [M("\\frac{1}{3} = 0{,}\\overline{3}") + ", donc " + M("3 \\cdot 0{,}\\overline{3} = 1") + ".", true, M("3 \\cdot \\frac{1}{3} = 1") + " (et " + M("0{,}\\overline{9} = 1") + ")."],
    ]),
  ];
  RICH.frac9 = { ids: ["fracrep", "fracsimp", "fracconv", "fracper", "fractout", "fracadd"], label: "Écriture fractionnaire (9e)", ex: EXF, raison: RAISONF, minutes: 45 };

  // ===================== 9e · 9. Proportionnalité =====================
  const EXPR = [
    () => { const p = pk([1.8, 2.4, 3.2, 2.6]), V = [2, 5, pk([7, 8]), 12], bud = pk([30, 40]), maxL = Math.floor(bud / p + 1e-9), bot = pk([[1.5, 3.3], [1.5, 4.2], [1.5, 3.6], [1.5, 4.5]].filter((x) => Math.abs(x[1] / x[0] - p) > 0.01)), pb = r6(bot[1] / bot[0]);
      const show = V.map((v, i) => (i === 1 || i === 3 ? "?" : chf(r6(v * p))));
      return X({ id: "proptab", lv: 1, titre: "Le jus de pommes",
        q: "À la ferme, le jus de pommes se vend au litre. Le prix est proportionnel à la quantité." + tab(["volume (L)", ...V.map(String)], [["prix (CHF)", ...show]]),
        parts: [{ label: "Quel est le prix d'un litre ? Explique comment tu le trouves.", pts: 1 }, { label: "Complète le tableau.", pts: 2 }, { label: "Avec " + bud + " CHF, combien de litres entiers peut-on acheter au maximum ?", pts: 1 }, { label: "Au magasin, la bouteille de " + N(bot[0]) + " L coûte " + chf(bot[1]) + ". Où le jus est-il le moins cher ?", pts: 1 }],
        sol: ul([M(Nk(2 * p, 2) + " : 2 = " + Nk(p, 2)) + " CHF.", M("5 \\cdot " + N(p) + " = " + Nk(5 * p, 2)) + " ; " + M("12 \\cdot " + N(p) + " = " + Nk(12 * p, 2)) + " CHF.", M(bud + " : " + N(p) + " \\approx " + N(Math.round((bud / p) * 100) / 100)) + " : " + maxL + " litres.", "Au magasin : " + M(N(bot[1]) + " : " + N(bot[0]) + " = " + Nk(pb, 2)) + " CHF/L ; " + (pb < p ? "le magasin est moins cher." : pb > p ? "la ferme est moins chère." : "même prix.")]),
        chk: [[maxL * p <= bud && (maxL + 1) * p > bud, "max"], [Math.abs(pb - p) > 1e-9, "comparaison"]], vals: [p, 5 * p, 12 * p, maxL, pb] }); },
    () => { const r = pk([0.93, 0.94, 0.96, 0.97]), ch = pk([200, 250, 300]), gl = pk([3.5, 4, 4.5]), ve = pk([89, 79, 99]), vg = pk([85, 79, 92]), eur = Math.round((ch / r) * 100) / 100, glc = Math.round(gl * r * 100) / 100, vec = Math.round(ve * r * 100) / 100;
      return X({ id: "change", lv: 2, titre: "Vacances en Italie",
        q: "Avant de partir en Italie, une famille change de l'argent au taux de " + M("1" + u("EUR") + " = " + N(r) + u("CHF")) + ".",
        parts: [{ label: "Combien d'euros reçoit-elle pour " + ch + " CHF ? (au centime)", pts: 1 }, { label: "Une glace coûte " + M(N(gl) + u("EUR")) + ". Combien est-ce en francs ?", pts: 1 }, { label: "Une veste coûte " + ve + " EUR en Italie et " + vg + " CHF à Genève. Où est-elle la moins chère ?", pts: 2 }, { label: "La banque prend en plus 5 CHF de frais à chaque change. Le montant reçu est-il encore proportionnel au montant changé ? Explique.", pts: 1 }],
        sol: ul([M(ch + " : " + N(r) + " \\approx " + Nk(eur, 2)) + " EUR.", M(N(gl) + " \\cdot " + N(r) + " \\approx " + Nk(glc, 2)) + " CHF.", M(ve + " \\cdot " + N(r) + " \\approx " + Nk(vec, 2)) + " CHF : " + (vec < vg ? "moins chère en Italie." : vec > vg ? "moins chère à Genève." : "même prix."), "Non : pour 0 CHF on ne reçoit rien, mais pour 10 CHF on ne reçoit que l'équivalent de 5 CHF ; doubler la somme ne double pas le montant reçu."]),
        chk: [[Math.abs(vec - vg) > 0.005, "pas d'égalité"]], vals: [eur, glc, vec] }); },
    () => { const base = 4, Fa = pk([250, 300, 200]), Oe = pk([2, 3]), La = pk([5, 4, 6]), Su = pk([60, 80, 90]), p = pk([6, 10, 3]), k = p / base, oe = Oe * k, maxP = Math.floor((1000 / Fa) * base + 1e-9);
      return X({ id: "prop", lv: 2, titre: "La recette du gâteau",
        q: "Recette pour 4 personnes : " + Fa + " g de farine, " + Oe + " œufs, " + La + " dL de lait, " + Su + " g de sucre. Cuire " + pk([35, 40]) + " min au four à 180 °C.",
        parts: [{ label: "Calcule les quantités pour " + p + " personnes.", pts: 2 }, { label: "Combien d'œufs faut-il en pratique ? Explique.", pts: 1 }, { label: "Quelles données ne changent pas ? Pourquoi ?", pts: 1 }, { label: "Avec un paquet de 1 kg de farine, pour combien de personnes au maximum peut-on faire ce gâteau ?", pts: 1 }],
        sol: ul(["Coefficient " + M(p + " : 4 = " + N(k)) + " : farine " + N(Fa * k) + " g, œufs " + N(oe) + ", lait " + N(La * k) + " dL, sucre " + N(Su * k) + " g.", Number.isInteger(oe) ? oe + " œufs, tout juste." : N(oe) + " œufs : on prend " + Math.round(oe) + " (ou " + Math.ceil(oe) + " petits) ; on ne coupe pas un œuf.", "La température et la durée de cuisson ne sont pas proportionnelles au nombre de personnes (elles dépendent du four et de l'épaisseur du gâteau).", M("1000 : " + Fa + " \\cdot 4 = " + N((1000 / Fa) * 4)) + " : " + maxP + " personnes."]),
        chk: [[k !== 1, "coef"], [maxP * Fa / base <= 1000, "farine"]], vals: [Fa * k, oe, La * k, Su * k, maxP] }); },
    () => { const [w, h, W] = pk([[10, 15, 24], [10, 15, 30], [9, 13, 22.5], [13, 18, 32.5], [12, 18, 30]]), k = W / w, H = r6(h * k), fr2 = pk([[30, 40], [24, 36], [40, 50]]), fits = W <= fr2[0] && H <= fr2[1];
      return X({ id: "agrand", lv: 3, titre: "Agrandir une photo",
        q: "Une photo mesure " + Q(w, "cm") + " de large et " + Q(h, "cm") + " de haut. On l'agrandit pour qu'elle mesure " + Q(W, "cm") + " de large, sans la déformer.",
        parts: [{ label: "Par quel nombre a-t-on multiplié les longueurs ?", pts: 1 }, { label: "Calcule la nouvelle hauteur.", pts: 1 }, { label: "Peut-on la mettre dans un cadre de " + fr2[0] + " cm × " + fr2[1] + " cm ? Justifie.", pts: 1 }, { label: "Combien de fois plus de papier faut-il pour l'agrandissement ? (Compare les aires.)", pts: 2 }],
        sol: ul([M(N(W) + " : " + w + " = " + N(k)) + ".", M(h + " \\cdot " + N(k) + " = " + N(H)) + " cm.", fits ? "Oui : " + N(W) + " ≤ " + fr2[0] + " et " + N(H) + " ≤ " + fr2[1] + "." : "Non : " + (W > fr2[0] ? N(W) + " > " + fr2[0] : N(H) + " > " + fr2[1]) + ".", "Aires : " + M(w + " \\cdot " + h + " = " + w * h) + " cm² et " + M(N(W) + " \\cdot " + N(H) + " = " + N(r6(W * H))) + " cm² : " + M(N(r6(W * H)) + " : " + w * h + " = " + N(r6(k * k))) + " fois (c'est " + M(N(k) + "^2") + ", pas " + N(k) + " !)."]),
        chk: [[Math.abs((W * H) / (w * h) - k * k) < 1e-9, "aire k²"]], vals: [k, H, k * k] }); },
  ];
  const RAISONPR = [
    () => VF({ id: "prop", titre: "Proportionnel ou pas ?", q: "Pour chaque situation, dis si les deux grandeurs sont proportionnelles (vrai) ou non (faux), et justifie." }, [
      () => { const pc = pk([6, 7]), km = pk([3, 3.5]); return ["Taxi : " + pc + " CHF de prise en charge, puis " + N(km) + " CHF par km. Le prix est proportionnel à la distance.", false, "Pour 2 km : " + N(pc + 2 * km) + " CHF ; pour 4 km : " + N(pc + 4 * km) + " CHF, ce n'est pas le double."]; },
      () => ["La taille d'un enfant est proportionnelle à son âge.", false, "À 1 an : environ 75 cm ; à 10 ans, pas 750 cm !"],
      () => ["Le périmètre d'un carré est proportionnel à la longueur de son côté.", true, "P = 4 · c : on multiplie toujours par 4."],
      () => ["L'aire d'un carré est proportionnelle à la longueur de son côté.", false, "Côté 2 : aire 4 ; côté 4 : aire 16, quatre fois plus et non deux fois plus."],
      () => { const p = pk([1.89, 1.95, 2.04]); return ["À la station, le prix payé est proportionnel au nombre de litres d'essence.", true, "On paie " + N(p) + " CHF par litre : prix = " + N(p) + " · litres."]; },
    ]),
    () => { const Fa = pk([250, 300]), La = pk([4, 5]), w = who();
      return X({ id: "prop", lv: 2, titre: "Trouve l'erreur",
        q: "Une recette pour 4 personnes demande " + Fa + " g de farine et " + La + " dL de lait. Pour 6 personnes, " + w.n + " ajoute 2 à chaque quantité : " + (Fa + 2) + " g de farine et " + (La + 2) + " dL de lait.",
        parts: [{ label: "Explique pourquoi son raisonnement est faux.", pts: 1 }, { label: "Donne les bonnes quantités.", pts: 1 }],
        sol: ul(["Il y a 2 personnes de plus, mais chaque quantité doit être multipliée par " + M("6 : 4 = 1{,}5") + ", pas augmentée de 2 (2 g de farine pour 2 personnes, c'est presque rien !).", M(Fa + " \\cdot 1{,}5 = " + N(Fa * 1.5)) + " g ; " + M(La + " \\cdot 1{,}5 = " + N(La * 1.5)) + " dL."]),
        chk: [[Fa * 1.5 !== Fa + 2, "différent"]], vals: [Fa * 1.5, La * 1.5] }); },
  ];
  RICH.prop9 = { ids: ["proptab", "prop", "change", "agrand"], label: "Proportionnalité (9e)", ex: EXPR, raison: RAISONPR, minutes: 45 };

  // ===================== 9e · 11. Transformations du plan (symétries et translations dans un repère) =====================
  const pt = (L, x, y) => M(L + "(" + N(x) + " \\,;\\, " + N(y) + ")");
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0 || v === 1 || v === -1); return v; };
  const EXT = [
    () => { let a, b, c, d, e, f; do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); e = nz(-5, 5); f = nz(-5, 5); } while (Math.abs(a) === Math.abs(b) || Math.abs(c) === Math.abs(d) || Math.abs(e) === Math.abs(f));
      return X({ id: "symetries", lv: 1, titre: "Symétries dans le repère",
        q: "On donne les points " + pt("A", a, b) + ", " + pt("B", c, d) + " et " + pt("C", e, f) + ".", fig: grid(-6, 6, -6, 6, [[a, b, "A"], [c, d, "B"], [e, f, "C"]]),
        parts: [{ label: "Donne les coordonnées de " + M("A'") + ", symétrique de " + M("A") + " par rapport à l'axe des ordonnées (vertical).", pts: 1 }, { label: "Donne les coordonnées de " + M("B'") + ", symétrique de " + M("B") + " par rapport à l'axe des abscisses (horizontal).", pts: 1 }, { label: "Donne les coordonnées de " + M("C'") + ", symétrique de " + M("C") + " par rapport à l'axe des abscisses, puis de " + M("C''") + ", symétrique de " + M("C'") + " par rapport à l'axe des ordonnées.", pts: 2 }, { label: "Énonce la règle : que deviennent les coordonnées par chacune de ces deux symétries ?", pts: 1 }],
        sol: ul([pt("A'", -a, b) + " : l'abscisse change de signe.", pt("B'", c, -d) + " : l'ordonnée change de signe.", pt("C'", e, -f) + " puis " + pt("C''", -e, -f) + " (les deux coordonnées ont changé de signe : c'est la symétrie de centre O).", "Axe des ordonnées : " + M("(x \\,;\\, y) \\to (-x \\,;\\, y)") + ". Axe des abscisses : " + M("(x \\,;\\, y) \\to (x \\,;\\, -y)") + "."]),
        chk: [[a !== 0 && d !== 0, "non nul"]], vals: [-a, -d, -e, -f] }); },
    () => { let dx, dy, P, I; do { dx = nz(-5, 5); dy = nz(-4, 4); P = [[-3, -2], [0, -2], [-2, 1]].map(([x, y]) => [x + R.int(-1, 1), y + R.int(-1, 1)]); I = P.map(([x, y]) => [x + dx, y + dy]); } while (Math.abs(dx) + Math.abs(dy) < 4 || I.some(([x, y]) => Math.abs(x) > 6 || Math.abs(y) > 5)); const Q2 = [nz(-5, 5), nz(-5, 5)];
      const dir = (v, p, n) => (v > 0 ? v + " " + p : -v + " " + n);
      return X({ id: "symetries", lv: 2, titre: "La translation",
        q: "Le triangle " + M("ABC") + " a pour sommets " + pt("A", ...P[0]) + ", " + pt("B", ...P[1]) + ", " + pt("C", ...P[2]) + ". Une translation envoie " + M("A") + " sur " + pt("A'", ...I[0]) + ".", fig: grid(-7, 7, -6, 6, [[...P[0], "A"], [...P[1], "B"], [...P[2], "C"], [...I[0], "A'"]], [[P]]),
        parts: [{ label: "Décris cette translation (de combien d'unités vers la droite ou la gauche, vers le haut ou le bas ?).", pts: 1 }, { label: "Donne les coordonnées de " + M("B'") + " et " + M("C'") + ".", pts: 2 }, { label: "Par la même translation, un point " + M("D") + " a pour image " + pt("D'", ...Q2) + ". Trouve " + M("D") + ".", pts: 1 }],
        sol: ul([dir(dx, "vers la droite", "vers la gauche") + " et " + dir(dy, "vers le haut", "vers le bas") + " : on ajoute " + N(dx) + " aux abscisses et " + N(dy) + " aux ordonnées.", pt("B'", ...I[1]) + " et " + pt("C'", ...I[2]) + ".", "On fait le chemin inverse : " + pt("D", Q2[0] - dx, Q2[1] - dy) + "."]),
        chk: [[I[0][0] - P[0][0] === dx, "translation"]], vals: [dx, dy] }); },
    () => { let A2; do A2 = [[nz(1, 4), nz(1, 4)], [nz(1, 5), nz(-3, 3)], [nz(2, 5), nz(1, 5)]]; while (A2[0][1] === A2[1][1] || A2[0][0] === A2[2][0]);
      const t = [nz(-4, -2), nz(-5, -2)], Tr = { y: (p) => [-p[0], p[1]], x: (p) => [p[0], -p[1]], t: (p) => [p[0] + t[0], p[1] + t[1]] }, ord = sh(["y", "x", "t"]), nm = { y: "symétrie d'axe des ordonnées", x: "symétrie d'axe des abscisses", t: "translation" };
      const Fs = ord.map((k) => A2.map(Tr[k]));
      return X({ id: "symetries", lv: 2, titre: "Quelle transformation ?",
        q: "Le triangle " + M("T") + " a pour sommets " + A2.map((p) => M("(" + p.join(" \\,;\\, ") + ")")).join(", ") + ". On a construit trois images de " + M("T") + " :<br>" + Fs.map((F, i) => M("T_" + (i + 1)) + " : " + F.map((p) => M("(" + p.join(" \\,;\\, ") + ")")).join(", ")).join("<br>"),
        parts: [{ label: "Pour chaque image, dis par quelle transformation on l'a obtenue (symétrie d'axe des abscisses, symétrie d'axe des ordonnées ou translation). Justifie avec les coordonnées.", pts: 3 }, { label: "Pour la translation, décris le déplacement.", pts: 1 }],
        sol: ul([ord.map((k, i) => M("T_" + (i + 1)) + " : " + nm[k] + (k === "y" ? " (abscisses opposées)" : k === "x" ? " (ordonnées opposées)" : " (on ajoute la même chose à chaque point)")).join(" ; ") + ".", (t[0] < 0 ? -t[0] + " vers la gauche" : t[0] + " vers la droite") + " et " + (-t[1]) + " vers le bas."]),
        chk: [[Fs.every((F) => F.some((p, i) => p[0] !== A2[i][0] || p[1] !== A2[i][1])), "images distinctes"]], vals: [] }); },
    () => { const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5), d = nz(-5, 5), dx = nz(-4, 4), dy = nz(-4, 4);
      return X({ id: "symetries", lv: 3, titre: "Enchaîner les transformations",
        q: "On part du point " + pt("P", a, b) + ".",
        parts: [{ label: "On applique la symétrie d'axe des abscisses, puis la symétrie d'axe des ordonnées. Où arrive " + M("P") + " ?", pts: 1 }, { label: "Et si on fait les deux symétries dans l'autre ordre ?", pts: 1 }, { label: "On applique à " + M("P") + " la translation « " + (dx > 0 ? dx + " à droite" : -dx + " à gauche") + ", " + (dy > 0 ? dy + " en haut" : -dy + " en bas") + " », puis la translation inverse. Où arrive-t-on ?", pts: 1 }, { label: "Trouve le point " + M("Q") + " dont le symétrique par rapport à l'axe des ordonnées est " + pt("Q'", c, d) + ".", pts: 1 }],
        sol: ul([pt("", a, -b) + " puis " + pt("", -a, -b) + ".", "Même point " + pt("", -a, -b) + " : l'ordre ne change rien ici. Ces deux symétries font une symétrie de centre O (demi-tour).", "On revient au point de départ " + pt("P", a, b) + ".", pt("Q", -c, d) + " : on refait la même symétrie (elle se « défait » elle-même)."]),
        chk: [[true, "ok"]], vals: [a, b, c, d] }); },
  ];
  const RAISONT = [
    () => { const a = nz(2, 6), b = -nz(2, 6), w = who();
      return X({ id: "symetries", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " affirme : « Le symétrique de " + pt("M", a, b) + " par rapport à l'axe des abscisses est " + pt("M'", -a, b) + ". »",
        parts: [{ label: "A-t-" + w.il + " raison ? Explique (un dessin peut aider).", pts: 1 }, { label: "À quelle symétrie correspond le point de " + w.n + " ?", pts: 1 }],
        sol: ul(["Non : l'axe des abscisses est horizontal ; le point se retourne de haut en bas, l'abscisse reste " + a + " et l'ordonnée devient " + -b + " : " + pt("M'", a, -b) + ".", "À la symétrie d'axe des ordonnées."]),
        chk: [[a !== -a, "ok"]], vals: [a, -b] }); },
    () => VF({ id: "symetries" }, [
      () => ["Une symétrie axiale conserve les longueurs et les angles.", true, "La figure image est superposable à la figure de départ (on la retourne)."],
      () => ["Une translation peut changer la taille d'une figure.", false, "Une translation fait glisser la figure sans la tourner ni la déformer."],
      () => ["Un point situé sur l'axe de symétrie est sa propre image.", true, "Sa distance à l'axe est nulle."],
      () => { const a = nz(2, 6), b = nz(2, 6); return ["Par la symétrie d'axe des ordonnées, " + pt("", a, b) + " devient " + pt("", a, -b) + ".", false, "C'est " + pt("", -a, b) + " : c'est l'abscisse qui change de signe."]; },
      () => ["Après une translation, une figure et son image sont orientées de la même façon.", true, "La translation ne retourne pas la figure (contrairement à la symétrie axiale)."],
    ]),
  ];
  RICH.transf9 = { ids: ["symetries"], label: "Transformations du plan (9e)", ex: EXT, raison: RAISONT, minutes: 45 };

  // ===================== 9e · 12 et 10e · 14. Diagrammes =====================
  const EXDI = [
    () => { const mo = ["sept.", "oct.", "nov.", "déc.", "janv.", "févr."], v = mo.map(() => R.int(3, 16)); while (new Set(v).size < 5) v[R.int(0, 5)] = R.int(3, 16); const tot = v.reduce((a, b) => a + b, 0), m = tot / 6, mx = Math.max(...v), mn = Math.min(...v);
      return X({ id: "diagr", lv: 1, titre: "Les livres empruntés",
        q: "Ce diagramme indique le nombre de livres empruntés chaque mois à la bibliothèque par une classe.", fig: bars(mo, v, "livres"),
        parts: [{ label: "Lis le diagramme et recopie les valeurs dans un tableau.", pts: 1 }, { label: "Combien de livres ont été empruntés en tout ?", pts: 1 }, { label: "Calcule la moyenne par mois (au dixième).", pts: 1 }, { label: "Quelle est l'étendue de la série ? Pendant combien de mois a-t-on dépassé la moyenne ?", pts: 2 }],
        sol: ul([mo.map((x, i) => x + " " + v[i]).join(" ; ") + ".", M(v.join(" + ") + " = " + tot) + ".", M(tot + " : 6 \\approx " + A(m, 1)) + " livres par mois.", "Étendue : " + M(mx + " - " + mn + " = " + (mx - mn)) + " ; au-dessus de la moyenne : " + v.filter((x) => x > m).length + " mois."]),
        chk: [[mx > mn, "étendue"]], vals: [tot, m, mx - mn] }); },
    () => { const notes = [3, 3.5, 4, 4.5, 5, 5.5, 6]; let e; do e = notes.map(() => R.int(0, 6)); while (e.reduce((a, b) => a + b, 0) < 16 || e.reduce((a, b) => a + b, 0) > 26 || e[0] + e[1] === 0 || e[2] + e[3] + e[4] + e[5] + e[6] === 0);
      const n = e.reduce((a, b) => a + b, 0), S = notes.reduce((s, x, i) => s + x * e[i], 0), m = S / n, ok = e.reduce((s, x, i) => s + (notes[i] >= 4 ? x : 0), 0), list = []; notes.forEach((x, i) => { for (let k = 0; k < e[i]; k++) list.push(x); }); const med = n % 2 ? list[(n - 1) / 2] : (list[n / 2 - 1] + list[n / 2]) / 2;
      return X({ id: "diagr", lv: 2, titre: "Les notes du test",
        q: "Voici les résultats d'une classe à un test." + tab(["note", ...notes.map((x) => N(x))], [["effectif", ...e.map(String)]]),
        parts: [{ label: "Combien d'élèves ont passé le test ?", pts: 1 }, { label: "Calcule la moyenne de la classe (au centième).", pts: 2 }, { label: "Quel pourcentage des élèves a obtenu au moins 4 ? (au dixième)", pts: 1 }, { label: "Quelle est la médiane ? Explique comment tu la trouves.", pts: 2 }],
        sol: ul([M(e.join(" + ") + " = " + n) + " élèves.", M("\\frac{" + notes.map((x, i) => (e[i] ? e[i] + " \\cdot " + N(x) : "")).filter(Boolean).join(" + ") + "}{" + n + "} = \\frac{" + N(S) + "}{" + n + "} \\approx " + A(m, 2)) + ".", M(ok + " : " + n + " \\approx " + A((ok / n) * 100, 1) + "\\,\\%") + ".", "On range les " + n + " notes : " + (n % 2 ? "la " + (n + 1) / 2 + "e" : "la moyenne de la " + n / 2 + "e et de la " + (n / 2 + 1) + "e") + " est " + M(N(med)) + " (autant d'élèves au-dessus qu'en dessous)."]),
        chk: [[Math.abs(S - list.reduce((a, b) => a + b, 0)) < 1e-9, "somme"], [ok > 0 && ok < n, "pourcentage"]], vals: [n, m, (ok / n) * 100, med] }); },
    () => { const [n, eff] = pk([[24, [9, 6, 5, 4]], [36, [15, 9, 8, 4]], [40, [14, 12, 10, 4]], [30, [12, 10, 5, 3]], [20, [8, 6, 4, 2]]]), labs = sh(["bus", "à pied", "vélo", "voiture", "trottinette"]).slice(0, 4), ang = eff.map((x) => (x / n) * 360), a2 = pk([45, 90, 60]), x2 = (a2 / 360) * 120;
      return X({ id: "diagr", lv: 3, titre: "Le diagramme circulaire",
        q: "On a demandé à " + n + " élèves comment ils viennent à l'école." + tab(["moyen", "effectif"], labs.map((l, i) => [l, eff[i]])),
        parts: [{ label: "Calcule le pourcentage de chaque réponse (au dixième).", pts: 2 }, { label: "Calcule l'angle de chaque secteur pour un diagramme circulaire.", pts: 2 }, { label: "Dans une autre école, de 120 élèves, le secteur « vélo » mesure " + a2 + "°. Combien d'élèves viennent à vélo ?", pts: 1 }],
        sol: ul([labs.map((l, i) => l + " " + M(eff[i] + " : " + n + " \\approx " + A((eff[i] / n) * 100, 1) + "\\,\\%")).join(" ; ") + ".", labs.map((l, i) => l + " " + M("\\frac{" + eff[i] + "}{" + n + "} \\cdot 360° = " + N(ang[i]) + "°")).join(" ; ") + " (total 360°).", M("\\frac{" + a2 + "}{360} \\cdot 120 = " + N(x2)) + " élèves."]),
        chk: [[Math.abs(ang.reduce((a, b) => a + b, 0) - 360) < 1e-9 && eff.reduce((a, b) => a + b, 0) === n, "360"], [Number.isInteger(x2), "entier"]], vals: [...ang, x2] }); },
    () => { let t, goal; do { t = [R.int(7, 11) / 2, R.int(7, 12) / 2, R.int(7, 12) / 2, R.int(6, 11) / 2]; goal = pk([4.5, 5]); } while (new Set(t).size < 3 || 5 * goal - t.reduce((a, b) => a + b, 0) < 2 || 5 * goal - t.reduce((a, b) => a + b, 0) > 6.5); const need = 5 * goal - t.reduce((a, b) => a + b, 0), m6 = (t.reduce((a, b) => a + b, 0) + 6) / 5, m4 = t.reduce((a, b) => a + b, 0) / 4, w = who();
      return X({ id: "diagr", lv: 2, titre: "La moyenne à atteindre",
        q: w.n + " a obtenu ces notes aux quatre premiers tests du semestre : " + t.map((x) => N(x)).join(" ; ") + ". Il y aura un cinquième test, et la moyenne se calcule sur les cinq notes.",
        parts: [{ label: "Calcule sa moyenne actuelle (au centième).", pts: 1 }, { label: "Quelle note doit-" + w.il + " obtenir au 5e test pour avoir exactement " + N(goal) + " de moyenne ?" + " Est-ce possible (notes de 1 à 6) ?", pts: 2 }, { label: "Quelle moyenne aurait-" + w.il + " avec un 6 au 5e test ?", pts: 1 }],
        sol: ul([M("(" + t.map(N).join(" + ") + ") : 4 = " + N(t.reduce((a, b) => a + b, 0)) + " : 4 \\approx " + A(m4, 2)) + ".", "Il faut une somme de " + M("5 \\cdot " + N(goal) + " = " + N(5 * goal)) + " : " + M(N(5 * goal) + " - " + N(t.reduce((a, b) => a + b, 0)) + " = " + N(need)) + ". " + (need <= 6 && need >= 1 ? "C'est possible." : need > 6 ? "Impossible : il faudrait plus de 6." : "Facile : même 1 suffit."), M("(" + N(t.reduce((a, b) => a + b, 0)) + " + 6) : 5 = " + A(m6, 2)) + "."]),
        chk: [[Math.abs((t.reduce((a, b) => a + b, 0) + need) / 5 - goal) < 1e-9, "inverse"]], vals: [m4, need, m6] }); },
  ];
  const RAISONDI = [
    () => VF({ id: "diagr" }, [
      () => ["La moyenne d'une série est toujours l'une des valeurs de la série.", false, "La moyenne de 4 et 5 est 4,5, qui n'est pas dans la série."],
      () => ["Si on ajoute 1 point à chaque note, la moyenne augmente de 1.", true, "La somme augmente de « 1 × effectif », qu'on divise par l'effectif."],
      () => { const a = pk([3, 4]); return ["Si une note de " + a + " est remplacée par un 6, la moyenne peut baisser.", false, "La somme augmente, donc la moyenne augmente."]; },
      () => ["La médiane et la moyenne sont toujours égales.", false, "Série 2 ; 3 ; 10 : médiane 3, moyenne 5."],
      () => ["Une seule valeur très grande peut beaucoup changer la moyenne, mais peu la médiane.", true, "Série 4 ; 5 ; 6 : moyenne 5, médiane 5. Avec 4 ; 5 ; 60 : moyenne 23, médiane toujours 5."],
    ]),
    () => { const v = [4, 4.5, 5, 5.5]; let e; do e = [pk([2, 3]), pk([5, 6]), pk([7, 8]), pk([2, 4])]; while (Math.abs(v.reduce((s, x, i) => s + x * e[i], 0) / e.reduce((a, b) => a + b, 0) - 4.75) < 0.005); const n = e.reduce((a, b) => a + b, 0), S = v.reduce((s, x, i) => s + x * e[i], 0), w = who();
      return X({ id: "diagr", lv: 2, titre: "Trouve l'erreur",
        q: "Notes d'un groupe :" + tab(["note", ...v.map(N)], [["effectif", ...e.map(String)]]) + w.n + " calcule la moyenne : " + M("(4 + 4{,}5 + 5 + 5{,}5) : 4 = 4{,}75") + ".",
        parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule la vraie moyenne (au centième).", pts: 1 }],
        sol: ul([w.Il + " n'a pas tenu compte des effectifs : chaque note compte autant de fois qu'elle a été obtenue.", M("\\frac{" + v.map((x, i) => e[i] + " \\cdot " + N(x)).join(" + ") + "}{" + n + "} = \\frac{" + N(S) + "}{" + n + "} \\approx " + A(S / n, 2)) + "."]),
        chk: [[Math.abs(S / n - 4.75) > 0.004, "différent"]], vals: [S / n] }); },
  ];
  RICH.diagr = { ids: ["diagr"], label: "Diagrammes (9e–10e)", ex: EXDI, raison: RAISONDI, minutes: 45 };
})();
