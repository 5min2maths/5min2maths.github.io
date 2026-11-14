// Variantes de questions (14.11, « les questions doivent absolument être variées ») : formes supplémentaires
// par notion et par niveau, tirées au hasard avec la forme d'origine (Engine.build). VAR[id][niveau] = [() => question, …].
// Mêmes conventions que les générateurs : QV (valeur), QX (expression), M(…) pour les formules, sol = corrigé.
// Une forme = un énoncé différent (inverse, contexte, autre structure), pas seulement d'autres nombres.
const VAR = {};
const V = (id, lv, ...fns) => { (VAR[id] = VAR[id] || {})[lv] = fns; };
const V34 = (id, ...fns) => { V(id, 3, ...fns); V(id, 4, ...fns); };
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const chf = (v) => (+v).toFixed(2).replace(".", "{,}"); // montant en TeX : 3{,}50
const dT = (v) => decTxt(r6(v)); // décimal en texte simple : 2,5
const d1 = (a, b) => R.int(Math.round(a * 10), Math.round(b * 10)) / 10;
const d2 = (a, b) => R.int(Math.round(a * 100), Math.round(b * 100)) / 100;
const nonInt = (f) => { let v; do v = f(); while (Number.isInteger(v)); return v; };
const mille = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const NTH = ["", "", "demi", "tiers", "quart", "cinquième", "sixième", "septième", "huitième"];
const MULT = ["", "", "le double", "le triple", "le quadruple", "le quintuple"];

// ======================= 9e =======================
// --- Écritures décimales ---
V("decread", 2,
  () => { const u = R.int(2, 9), di = R.int(1, 9), mi = R.int(1, 9), v = r6(u + di / 10 + mi / 1000);
    return QV("Écris en nombre décimal : " + M(u + " + \\frac{" + di + "}{10} + \\frac{" + mi + "}{1000}") + ".", v, M(u + " + \\frac{" + di + "}{10} + \\frac{" + mi + "}{1000} = " + dec(v)) + " (pas de centième : on écrit 0).", { plain: true }); },
  () => { const dz = R.int(1, 9), u = R.int(1, 9), ce = R.int(1, 9), v = r6(dz * 10 + u + ce / 100);
    return QV("Écris en nombre décimal : " + dz + " dizaines, " + u + " unité" + (u > 1 ? "s" : "") + " et " + ce + " centième" + (ce > 1 ? "s" : "") + ".", v, M(dz * 10 + " + " + u + " + \\frac{" + ce + "}{100} = " + dec(v)) + " (pas de dixième : on écrit 0).", { plain: true }); },
  () => { const x = r6(R.int(1, 9) + R.int(11, 89) / 100), k = R.int(2, 9), v = r6(x + k / 100);
    return QV("Quel nombre obtient-on en ajoutant " + k + " centièmes à " + M(dec(x)) + " ?", v, M(dec(x) + " + 0{,}0" + k + " = " + dec(v)) + ".", { plain: true }); },
);
V34("deccomp",
  () => { const a = R.int(11, 89) / 10, k = 1; return QV("Combien y a-t-il de nombres à deux chiffres après la virgule strictement compris entre " + M(dec(a)) + " et " + M(dec(r6(a + k / 10))) + " ?", 10 * k - 1, "De " + M(dec(r6(a + 0.01))) + " à " + M(dec(r6(a + k / 10 - 0.01))) + " : il y en a " + (10 * k - 1) + "."); },
  () => { const a = r6(R.int(101, 989) / 100); return QV("Quel est le plus petit nombre à deux chiffres après la virgule strictement plus grand que " + M(dec(a)) + " ?", r6(a + 0.01), "On ajoute un centième : " + M(dec(r6(a + 0.01))) + ".", { plain: true }); },
);
// --- Ordres de grandeur ---
V("ordgr", 1,
  () => { const a = R.int(4, 9) * 1000 + R.int(110, 390), b = R.int(1, 3) * 1000 + R.int(110, 390), A = Math.round(a / 1000) * 1000, B = Math.round(b / 1000) * 1000;
    return QV("Estime " + M(a + " - " + b) + " en arrondissant chaque nombre au millier.", A - B, M(a + " \\approx " + A) + " et " + M(b + " \\approx " + B) + " : " + M(A + " - " + B + " = " + (A - B)) + "."); },
  () => { const a = R.int(21, 59) * 10 - R.int(1, 4), b = R.int(4, 9) * 10 + R.int(1, 4), A = Math.round(a / 10) * 10, B = Math.round(b / 10) * 10;
    return QV("Un vélo coûte " + M(a) + " CHF et un casque " + M(b) + " CHF. Estime le prix total en arrondissant chaque prix à la dizaine.", A + B, M(a + " \\approx " + A) + " et " + M(b + " \\approx " + B) + " : environ " + M(A + B) + " CHF."); },
);
V("ordgr", 2,
  () => { const p = d2(1.81, 1.98), L = R.int(3, 7) * 10 + R.int(1, 3), Lr = Math.round(L / 10) * 10;
    return QV("L'essence coûte " + M(dec(p)) + " CHF le litre. Estime le prix de " + M(L) + " litres en arrondissant le prix à l'unité et la quantité à la dizaine.", 2 * Lr, M(dec(p) + " \\approx 2") + " et " + M(L + " \\approx " + Lr) + " : environ " + M(2 * Lr) + " CHF."); },
  () => { const a = R.int(3, 9), b = R.int(3, 9) * 100, x = r6(a + R.pick([-0.2, -0.1, 0.1, 0.2, 0.3])), y = b + R.pick([-30, -20, 20, 30, 40]);
    return QV("Estime " + M(dec(x) + " \\cdot " + y) + " en arrondissant le premier nombre à l'unité et le second à la centaine.", a * b, M(dec(x) + " \\approx " + a) + " et " + M(y + " \\approx " + b) + " : " + M(a + " \\cdot " + b + " = " + a * b) + "."); },
);
V34("ordgr",
  () => { const d = R.pick([30, 40, 50, 60, 70, 80]), q = R.pick([20, 30, 40, 60, 70, 90]), A = d * q, a = A + R.pick([-30, -20, 20, 30]) + R.pick([-1, 1]) * R.int(1, 9), b = d + R.pick([-3, -2, 2, 3]);
    return QV("Estime " + M(a + " : " + b) + " en arrondissant le premier nombre à la centaine et le second à la dizaine.", q, M(a + " \\approx " + A) + " et " + M(b + " \\approx " + d) + " : " + M(A + " : " + d + " = " + q) + "."); },
  () => { const d = R.pick([20, 30, 40, 50]), q = R.pick([30, 40, 60, 70, 80]), A = d * q, a = A + R.pick([-40, -20, 20, 30]) + R.int(1, 9), b = d + R.pick([-2, -1, 1, 2]);
    return QV("Une association récolte " + M(a) + " CHF, à partager entre " + M(b) + " projets. Estime la part de chacun en arrondissant la somme à la centaine et le nombre de projets à la dizaine.", q, M(a + " \\approx " + A) + " et " + M(b + " \\approx " + d) + " : environ " + M(A + " : " + d + " = " + q) + " CHF."); },
);
// --- Additions et soustractions de décimaux ---
V("decadd", 1,
  () => { const a = d1(2, 9), c = r6(a + nonInt(() => d1(2, 9))); return QV("Complète : " + M(dec(a) + " + \\ ? = " + dec(c)), r6(c - a), M(dec(c) + " - " + dec(a) + " = " + dec(r6(c - a))) + "."); },
  () => { const a = d2(3, 15), b = d2(1, 9); return QV("Lina a " + M(chf(a)) + " CHF dans sa tirelire. Sa grand-mère lui donne " + M(chf(b)) + " CHF. Combien a-t-elle maintenant (en CHF) ?", r6(a + b), M(chf(a) + " + " + chf(b) + " = " + chf(r6(a + b))) + " CHF."); },
);
V("decadd", 2,
  () => { const L = R.int(3, 9), c = nonInt(() => d2(0.5, L - 1)); return QV("On coupe " + M(dec(c)) + " m d'un ruban de " + M(L) + " m. Quelle longueur reste-t-il (en m) ?", r6(L - c), M(L + " - " + dec(c) + " = " + dec(r6(L - c))) + " m."); },
  () => { const a = d2(2, 9), b = r6(a + nonInt(() => d2(1, 9))); return QV("De combien faut-il augmenter " + M(dec(a)) + " pour obtenir " + M(dec(b)) + " ?", r6(b - a), M(dec(b) + " - " + dec(a) + " = " + dec(r6(b - a))) + "."); },
);
V34("decadd",
  () => { const t = nonInt(() => d1(-5, 8)), u = nonInt(() => d1(2, 9)), v = nonInt(() => d1(3, 12)), f = r6(t + u - v); return QV("Le matin, il fait " + M(dec(t)) + " °C. La température monte de " + M(dec(u)) + " °C, puis baisse de " + M(dec(v)) + " °C. Quelle température fait-il alors (en °C) ?", f, M(dec(t) + " + " + dec(u) + " - " + dec(v) + " = " + dec(f)) + " °C."); },
  () => { const a = R.int(20, 50), b = d2(2, 9), c = d2(1, 9); return QV("Calcule : " + M(a + " - (" + dec(b) + " + " + dec(c) + ")"), r6(a - b - c), "Parenthèse d'abord : " + M(dec(b) + " + " + dec(c) + " = " + dec(r6(b + c))) + ", puis " + M(a + " - " + dec(r6(b + c)) + " = " + dec(r6(a - b - c))) + "."); },
);
// --- Multiplier et diviser par 10, 100… ---
V("dec10", 1,
  () => { const p = R.pick([10, 100, 1000]), x = r6(R.int(101, 9899) / 1000); return QV("Par quel nombre faut-il multiplier " + M(dec(x)) + " pour obtenir " + M(dec(r6(x * p))) + " ?", p, "La virgule a avancé de " + (String(p).length - 1) + " rang" + (p > 10 ? "s" : "") + " : on a multiplié par " + M(p) + ".", { plain: true }); },
  () => { const p = R.pick([10, 100, 1000]), y = R.int(12, 9800); return QV("Complète : " + M("? \\cdot " + p + " = " + y), r6(y / p), M(y + " : " + p + " = " + dec(r6(y / p))) + ".", { plain: true }); },
);
V("dec10", 2,
  () => { const p = R.pick([10, 100, 1000]), x = R.int(13, 987); return QV("Complète : " + M("? : " + p + " = " + dec(r6(x / p))), x, M(dec(r6(x / p)) + " \\cdot " + p + " = " + x) + ".", { plain: true }); },
  () => { const p = R.pick([100, 1000]), x = R.int(21, 980); return QV("Un paquet de " + M(mille(p)) + " feuilles pèse " + M(x) + " g. Combien pèse une feuille (en g) ?", r6(x / p), M(x + " : " + p + " = " + dec(r6(x / p))) + " g.", { plain: true }); },
);
// --- Multiplier des décimaux ---
V("decmul", 1,
  () => { const p = nonInt(() => d2(1.1, 4.9)), n = R.int(3, 9); return QV("Un stylo coûte " + M(chf(p)) + " CHF. Combien coûtent " + M(n) + " stylos (en CHF) ?", r6(p * n), M(n + " \\cdot " + chf(p) + " = " + chf(r6(p * n))) + " CHF."); },
  () => { const x = nonInt(() => d1(1.1, 9.9)), k = R.int(2, 4); return QV("Calcule " + MULT[k] + " de " + M(dec(x)) + ".", r6(k * x), M(k + " \\cdot " + dec(x) + " = " + dec(r6(k * x))) + "."); },
);
V("decmul", 2,
  () => { const p = R.pick([2.5, 4.5, 6.5, 12.5, 3.2, 1.8]), L = nonInt(() => d1(1.2, 3.8)); return QV("Un tissu coûte " + M(chf(p)) + " CHF le mètre. Combien coûtent " + M(dec(L)) + " m de ce tissu (en CHF) ?", r6(p * L), M(dec(L) + " \\cdot " + chf(p) + " = " + chf(r6(p * L))) + " CHF."); },
  () => { const a = nonInt(() => d1(1.2, 6.8)), b = nonInt(() => d1(1.2, 4.8)); return QV("Calcule l'aire d'un rectangle de " + M(dec(a)) + " m sur " + M(dec(b)) + " m (en m²).", r6(a * b), M(dec(a) + " \\cdot " + dec(b) + " = " + dec(r6(a * b))) + " m²."); },
);
V34("decmul",
  () => { const a = R.int(2, 9) / 10; return QV("Calcule l'aire d'un carré de côté " + M(dec(a)) + " m (en m²).", r6(a * a), M(dec(a) + " \\cdot " + dec(a) + " = " + dec(r6(a * a))) + " m² : le résultat est plus petit que le côté !"); },
  () => { const a = R.int(2, 9) / 10, b = R.int(2, 9) / 10; return QV("Un champ rectangulaire mesure " + M(dec(a)) + " km sur " + M(dec(b)) + " km. Quelle est son aire (en km²) ?", r6(a * b), M(dec(a) + " \\cdot " + dec(b) + " = " + dec(r6(a * b))) + " km² (deux décimales en tout)."); },
);
// --- Diviser des décimaux ---
V("decdiv", 1,
  () => { const n = R.int(3, 6), q = nonInt(() => d2(2.1, 9.9)), t = r6(n * q); return QV(M(n) + " amis partagent équitablement une dépense de " + M(chf(t)) + " CHF. Combien chacun paie-t-il (en CHF) ?", q, M(chf(t) + " : " + n + " = " + chf(q)) + " CHF."); },
  () => { const n = R.int(3, 9), q = nonInt(() => d1(1.1, 9.9)); return QV("Complète : " + M(n + " \\cdot \\ ? = " + dec(r6(n * q))), q, M(dec(r6(n * q)) + " : " + n + " = " + dec(q)) + "."); },
);
V("decdiv", 2,
  () => { const p = R.pick([0.2, 0.25, 0.4, 0.5, 0.75]), k = R.int(3, 12), L = r6(p * k); return QV("Combien de verres de " + M(dec(p)) + " L peut-on remplir avec " + M(dec(L)) + " L de jus ?", k, M(dec(L) + " : " + dec(p) + " = " + k) + " verres."); },
  () => { const p = R.pick([0.4, 0.5, 0.6, 0.8, 1.2, 1.5]), k = R.int(3, 15), L = r6(p * k); return QV("Une barre de " + M(dec(L)) + " m est coupée en morceaux de " + M(dec(p)) + " m. Combien de morceaux obtient-on ?", k, "On multiplie les deux nombres par 10 : " + M(dec(r6(L * 10)) + " : " + dec(r6(p * 10)) + " = " + k) + "."); },
);
V34("decdiv",
  () => { const m = nonInt(() => d1(1.2, 3.8)), p = nonInt(() => d1(2.1, 6.9)), t = r6(m * p); return QV(M(dec(m)) + " kg de fromage coûtent " + M(chf(t)) + " CHF. Quel est le prix d'un kilo (en CHF) ?", p, M(chf(t) + " : " + dec(m) + " = " + dec(p)) + " CHF le kilo."); },
  () => { const a = nonInt(() => d1(1.2, 4.8)), b = nonInt(() => d1(1.2, 6.8)); return QV("Complète : " + M(dec(a) + " \\cdot \\ ? = " + dec(r6(a * b))), b, M(dec(r6(a * b)) + " : " + dec(a) + " = " + dec(b)) + "."); },
);
// --- Problèmes avec des décimaux ---
V("decprob", 1,
  () => { const m = nonInt(() => d1(1.2, 4.8)), n = R.int(3, 9); return QV("Un sac de farine pèse " + M(dec(m)) + " kg. Combien pèsent " + M(n) + " sacs (en kg) ?", r6(m * n), M(n + " \\cdot " + dec(m) + " = " + dec(r6(m * n))) + " kg."); },
  () => { const v = R.pick([0.25, 0.2, 0.33, 0.15]), n = R.int(6, 15); return QV("Un verre contient " + M(dec(v)) + " L. Quelle quantité faut-il pour remplir " + M(n) + " verres (en L) ?", r6(v * n), M(n + " \\cdot " + dec(v) + " = " + dec(r6(v * n))) + " L."); },
);
V("decprob", 2,
  () => { const pc = R.pick([5.5, 6, 6.5, 7]), pk = R.pick([2.8, 3.2, 3.5, 3.8]), k = R.int(4, 12), t = r6(pc + pk * k); return QV("Un taxi coûte " + M(chf(pc)) + " CHF de prise en charge, puis " + M(chf(pk)) + " CHF par kilomètre. Combien coûte une course de " + M(k) + " km (en CHF) ?", t, M(chf(pc) + " + " + k + " \\cdot " + chf(pk) + " = " + chf(t)) + " CHF."); },
  () => { const s = R.pick([50, 100]), a = d2(9.5, 16), b = d2(4.5, 8.9), n = R.int(2, 4), t = r6(n * a + b); return QV("Tu as " + M(s) + " CHF. Tu achètes " + M(n) + " places de cinéma à " + M(chf(a)) + " CHF et un pop-corn à " + M(chf(b)) + " CHF. Combien te reste-t-il (en CHF) ?", r6(s - t), "Dépense : " + M(n + " \\cdot " + chf(a) + " + " + chf(b) + " = " + chf(t)) + ". Reste : " + M(s + " - " + chf(t) + " = " + chf(r6(s - t))) + " CHF."); },
);
V34("decprob",
  () => { const n = R.int(3, 6), p = nonInt(() => d1(1.2, 4.5)), cut = nonInt(() => d1(0.5, 2.5)), L = r6(n * p + cut); return QV("D'une corde de " + M(dec(L)) + " m, on retire d'abord " + M(dec(cut)) + " m abîmés, puis on coupe le reste en " + M(n) + " morceaux égaux. Combien mesure chaque morceau (en m) ?", p, "Reste : " + M(dec(L) + " - " + dec(cut) + " = " + dec(r6(n * p))) + ". Morceau : " + M(dec(r6(n * p)) + " : " + n + " = " + dec(p)) + " m."); },
  () => { const n = R.int(3, 5), part = d2(8, 25), carte = R.int(2, 6), cadeau = r6(part * n - carte); return QV(M(n) + " amis offrent un cadeau à " + M(chf(cadeau)) + " CHF et une carte à " + M(chf(carte)) + " CHF. Ils partagent la dépense en parts égales. Combien chacun paie-t-il (en CHF) ?", part, "Total : " + M(chf(cadeau) + " + " + chf(carte) + " = " + chf(r6(n * part))) + ". Part : " + M(chf(r6(n * part)) + " : " + n + " = " + chf(part)) + " CHF."); },
);
// --- Puissances ---
V("pow9", 1,
  () => { const cube = R.rand() < 0.5, e = cube ? R.int(2, 5) : R.int(3, 9), p = cube ? 3 : 2; return QV("Calcule le " + (cube ? "cube" : "carré") + " de " + M(e) + ".", e ** p, M(e + "^" + p + " = " + e ** p) + "."); },
  () => { const a = R.int(4, 12); return QV("Quel nombre positif, élevé au carré, donne " + M(a * a) + " ?", a, M(a + "^2 = " + a * a) + "."); },
);
V("pow9", 2,
  () => { const n = R.int(4, 8), big = mille(10 ** n); return QV("Écris " + M(big) + " comme une puissance de 10. Quel est l'exposant ?", n, M(big + " = 10^{" + n + "}") + " : il y a " + n + " zéros."); },
  () => { const a = R.pick([0.2, 0.3, 0.4, 0.5]), e = R.pick([2, 3]); return QV("Calcule : " + M(dec(a) + "^" + e), r6(a ** e), M(dec(a) + "^" + e + " = " + Array(e).fill(dec(a)).join(" \\cdot ") + " = " + dec(r6(a ** e))) + "."); },
);
V34("pow9",
  () => { const a = R.int(2, 4), b = R.int(2, 3), x = R.int(2, 5), v = (a + x) ** 2 - b ** 3; return QV("Calcule : " + M("(" + a + " + " + x + ")^2 - " + b + "^3"), v, M((a + x) + "^2 - " + b + "^3 = " + (a + x) ** 2 + " - " + b ** 3 + " = " + v) + "."); },
  () => { let k, a, e, b, v; do { k = R.int(2, 5); a = R.int(2, 3); e = R.int(3, 4); b = R.int(2, 6); v = k * a ** e - b * b; } while (Math.abs(v) < 2); return QV("Calcule : " + M(k + " \\cdot " + a + "^" + e + " - " + b + "^2"), v, "Puissances d'abord : " + M(k + " \\cdot " + a ** e + " - " + b * b + " = " + v) + "."); },
);
// --- Priorités ---
V("prio", 1,
  () => { const a = R.int(3, 9), b = R.int(2, 9), c = R.int(a * b + 2, 80); return QV("Calcule : " + M(c + " - " + a + " \\cdot " + b), c - a * b, M(c + " - " + a * b + " = " + (c - a * b)) + " : la multiplication d'abord."); },
  () => { const b = R.int(2, 9), q = R.int(2, 9), a = R.int(3, 20); return QV("Calcule : " + M(a + " + " + b * q + " : " + b), a + q, M(a + " + " + q + " = " + (a + q)) + " : la division d'abord."); },
);
V("prio", 2,
  () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 6), d = R.int(2, Math.min(20, (a + b) * c - 2)); return QV("Calcule : " + M("(" + a + " + " + b + ") \\cdot " + c + " - " + d), (a + b) * c - d, M((a + b) + " \\cdot " + c + " - " + d + " = " + (a + b) * c + " - " + d + " = " + ((a + b) * c - d)) + "."); },
  () => { const b = R.int(1, 5), c = R.int(1, 5), s = b + c, q = R.int(2, 9), e = R.int(2, 15); return QV("Calcule : " + M(s * q + " : (" + b + " + " + c + ") + " + e), q + e, M(s * q + " : " + s + " + " + e + " = " + q + " + " + e + " = " + (q + e)) + "."); },
);
V34("prio",
  () => { const a = R.int(30, 90), b = R.int(5, 9), c = R.int(2, 4), v = a - (b - c) ** 2; return QV("Calcule : " + M(a + " - (" + b + " - " + c + ")^2"), v, M(a + " - " + (b - c) + "^2 = " + a + " - " + (b - c) ** 2 + " = " + v) + "."); },
  () => { let a, b, s, j, k, m; do { a = R.int(1, 4); b = R.int(1, 4); s = (a + b) ** 2; j = R.int(3, 9); k = R.int(1, j - 2); m = j * s; } while (a === b || [a, b, k].includes(j - k)); return QV("Calcule : " + M(m + " : (" + a + " + " + b + ")^2 - " + k), j - k, M(m + " : " + (a + b) + "^2 - " + k + " = " + m + " : " + s + " - " + k + " = " + j + " - " + k + " = " + (j - k)) + "."); },
);
// --- Traduire une phrase en calcul ---
V("tradexpr", 2,
  () => { const a = R.int(3, 9), b = R.int(2, 8), c = R.int(2, 6); return QV("Calcule le produit de la somme de " + a + " et " + b + " par " + c + ".", (a + b) * c, M("(" + a + " + " + b + ") \\cdot " + c + " = " + (a + b) * c) + "."); },
  () => { const c = R.int(2, 6), q = R.int(3, 9), b = R.int(2, 9), a = c * q + b; return QV("Calcule le quotient de la différence de " + a + " et " + b + " par " + c + ".", q, M("(" + a + " - " + b + ") : " + c + " = " + (a - b) + " : " + c + " = " + q) + "."); },
  () => { const a = R.int(3, 9), b = R.int(3, 9); return QV("Calcule la somme du triple de " + a + " et du double de " + b + ".", 3 * a + 2 * b, M("3 \\cdot " + a + " + 2 \\cdot " + b + " = " + (3 * a + 2 * b)) + "."); },
);
V34("tradexpr",
  () => { const a = R.int(3, 5), b = R.int(2, Math.min(6, Math.floor(Math.sqrt(a ** 3 - 2)))); return QV("Calcule le cube de " + a + ", diminué du carré de " + b + ".", a ** 3 - b * b, M(a + "^3 - " + b + "^2 = " + a ** 3 + " - " + b * b + " = " + (a ** 3 - b * b)) + "."); },
  () => { const a = R.pick([4, 6, 8, 10, 12]), b = R.int(2, 9); return QV("Calcule la moitié du carré de " + a + ", augmentée de " + b + ".", (a * a) / 2 + b, M("\\frac{" + a + "^2}{2} + " + b + " = " + (a * a) / 2 + " + " + b + " = " + ((a * a) / 2 + b)) + "."); },
);
// --- Durées ---
V("utemps", 2,
  () => { const h1 = R.int(1, 3), m1 = R.int(15, 55), h2 = R.int(1, 2), m2 = R.int(20, 55), t = h1 * 60 + m1 + h2 * 60 + m2; return QV("Une randonnée : la montée dure " + h1 + " h " + m1 + " min, la descente " + h2 + " h " + m2 + " min. Quelle est la durée totale, en minutes ?", t, M(h1 * 60 + m1 + " + " + (h2 * 60 + m2) + " = " + t) + " min."); },
  () => { const n = R.int(3, 5), e = R.int(38, 52); return QV("Tu regardes " + M(n) + " épisodes de " + M(e) + " minutes à la suite. Combien de temps cela fait-il, en minutes ?", n * e, M(n + " \\cdot " + e + " = " + n * e) + " min, soit " + Math.floor((n * e) / 60) + " h " + ((n * e) % 60) + " min."); },
);
V34("utemps",
  () => { const hc = R.int(22, 23), mc = R.int(5, 55), hl = R.int(6, 7), ml = R.int(0, 50), avant = (24 - hc) * 60 - mc, t = avant + hl * 60 + ml; return QV("Tu te couches à " + hc + " h " + String(mc).padStart(2, "0") + " et tu te lèves à " + hl + " h " + String(ml).padStart(2, "0") + ". Combien de minutes as-tu dormi ?", t, "Jusqu'à minuit : " + avant + " min ; puis " + (hl * 60 + ml) + " min. Total : " + t + " min."); },
  () => { const mo = R.pick([15, 30, 45]), hf = R.int(17, 19), mf = R.pick([0, 10, 20, 40, 50]), t = hf * 60 + mf - (8 * 60 + mo); return QV("Un magasin ouvre à 8 h " + mo + " et ferme à " + hf + " h " + String(mf).padStart(2, "0") + ", sans pause. Pendant combien de minutes est-il ouvert ?", t, "De 8 h " + mo + " à " + hf + " h " + String(mf).padStart(2, "0") + " : " + Math.floor(t / 60) + " h " + (t % 60) + " min = " + t + " min."); },
);
// --- Angles ---
V("angtype", 1,
  () => { const a = R.int(14, 76); return QV("Un angle droit est partagé en deux angles. L'un mesure " + a + "°. Combien mesure l'autre (en degrés) ?", 90 - a, M("90° - " + a + "° = " + (90 - a) + "°") + "."); },
  () => { const k = R.int(2, 5), s = 180 / (k + 1); return QV("Un angle plat est partagé en deux angles : l'un est " + MULT[k] + " de l'autre. Combien mesure le plus grand (en degrés) ?", k * s, "Le petit compte pour 1 part, le grand pour " + k + " : " + M("180° : " + (k + 1) + " = " + s + "°") + ", le grand mesure " + M(k * s + "°") + "."); },
);
V("angtype", 2,
  () => { const n = R.pick([5, 6, 8, 9, 10, 12]); return QV("Une pizza ronde est coupée en " + n + " parts égales depuis le centre. Quel angle mesure chaque part (en degrés) ?", 360 / n, M("360° : " + n + " = " + 360 / n + "°") + "."); },
  () => { const a = R.int(70, 110), b = R.int(50, 90), c = R.int(60, 100); return QV("Quatre angles se partagent le tour complet autour d'un point. Trois d'entre eux mesurent " + a + "°, " + b + "° et " + c + "°. Combien mesure le quatrième (en degrés) ?", 360 - a - b - c, M("360° - " + a + "° - " + b + "° - " + c + "° = " + (360 - a - b - c) + "°") + "."); },
);
V("quadri", 2,
  () => { const k = R.int(2, 5), s = 180 / (k + 1); return QV("Dans un parallélogramme, un angle est " + MULT[k] + " de son voisin. Combien mesure le plus grand angle (en degrés) ?", k * s, "Deux angles voisins font 180° : " + M("180° : " + (k + 1) + " = " + s + "°") + ", le plus grand mesure " + M(k * s + "°") + "."); },
  () => { const e = R.pick([20, 30, 40, 50, 60]); return QV("Dans un parallélogramme, un angle mesure " + e + "° de plus que son voisin. Combien mesure le plus grand (en degrés) ?", (180 + e) / 2, "Les deux font 180° : " + M("(180° + " + e + "°) : 2 = " + (180 + e) / 2 + "°") + "."); },
);
V("angtri", 1,
  () => { const a = R.int(17, 73); return QV("Un triangle est rectangle. Un de ses angles aigus mesure " + a + "°. Combien mesure l'autre angle aigu (en degrés) ?", 90 - a, M("180° - 90° - " + a + "° = " + (90 - a) + "°") + "."); },
  () => { const x = R.int(20, 45), c = 180 - 3 * x; return QV("Dans un triangle, un angle mesure " + c + "°. Des deux autres, l'un est le double de l'autre. Combien mesure le plus petit (en degrés) ?", x, "Les deux autres font " + M("180° - " + c + "° = " + 3 * x + "°") + ", soit 3 parts : " + M(3 * x + "° : 3 = " + x + "°") + "."); },
);
V34("angtri",
  () => { let a; do a = R.int(55, 125); while (a === 90); return QV("Un trapèze rectangle a deux angles droits. Un autre de ses angles mesure " + a + "°. Combien mesure le quatrième (en degrés) ?", 180 - a, M("360° - 90° - 90° - " + a + "° = " + (180 - a) + "°") + "."); },
  () => { let a; do a = R.int(72, 98); while (a === 90); return QV("Un quadrilatère a trois angles égaux de " + a + "° chacun. Combien mesure le quatrième (en degrés) ?", 360 - 3 * a, M("360° - 3 \\cdot " + a + "° = " + (360 - 3 * a) + "°") + "."); },
);
// --- Multiples et diviseurs ---
V("multdiv", 1,
  () => { const n = R.int(6, 13), L = R.pick([100, 150, 200]), v = Math.floor((L - 1) / n) * n; return QV("Quel est le plus grand multiple de " + n + " strictement inférieur à " + L + " ?", v, M(n + " \\cdot " + v / n + " = " + v) + " ; le suivant, " + M(v + n) + ", atteint ou dépasse " + L + "."); },
  () => { const n = R.int(6, 12), k = R.int(9, 15); return QV("Quel est le " + k + "e multiple de " + n + " (en comptant " + n + " comme le 1er) ?", n * k, M(n + " \\cdot " + k + " = " + n * k) + "."); },
);
V("multdiv", 2,
  () => { const n = R.pick([36, 40, 48, 60, 72, 84, 90, 96]); return QV("Quel est le plus grand diviseur de " + M(n) + ", autre que " + M(n) + " lui-même ?", n / 2, "Le plus petit diviseur autre que 1 est 2 : " + M(n + " = 2 \\cdot " + n / 2) + "."); },
  () => { const [n, p] = R.pick([[91, 7], [119, 7], [143, 11], [187, 11], [221, 13], [133, 7], [209, 11], [247, 13]]); return QV("Quel est le plus petit diviseur de " + M(n) + " autre que 1 ?", p, M(n + " = " + p + " \\cdot " + n / p) + " ; " + n + " n'est divisible ni par 2, ni par 3, ni par 5."); },
);
V34("multdiv",
  () => { const n = R.int(6, 13), L = R.pick([100, 150, 200]), c = Math.floor(L / n); return QV("Combien y a-t-il de multiples de " + n + " entre 1 et " + L + " ?", c, "Le dernier est " + M(n + " \\cdot " + c + " = " + n * c) + " : il y en a " + c + "."); },
  () => { const [a, b, m] = R.pick([[4, 6, 12], [6, 8, 24], [6, 9, 18], [4, 10, 20], [10, 15, 30], [6, 10, 30]]), L = R.pick([100, 120, 150, 200]); return QV("Combien de nombres entre 1 et " + L + " sont multiples à la fois de " + a + " et de " + b + " ?", Math.floor(L / m), "Ce sont les multiples de " + m + " (le PPMC) : il y en a " + Math.floor(L / m) + "."); },
);
V("divcrit", 1,
  () => { let n; do n = R.int(1201, 9899); while (n % 9 < 2); const s = String(n).split("").reduce((a, c) => a + +c, 0); return QV("Quel est le reste de la division de " + M(mille(n)) + " par 9 ? (Pense à la somme des chiffres.)", n % 9, "Somme des chiffres : " + s + " ; le reste de " + s + " par 9 est " + (n % 9) + "."); },
  () => { let L, v; do { L = R.int(201, 989); v = L + 1; while (v % 3) v++; } while (v - L < 2); return QV("Quel est le plus petit nombre strictement supérieur à " + M(L) + " qui soit divisible par 3 ?", v, "La somme des chiffres de " + v + " est un multiple de 3 ; pas celle de " + (L + 1) + (v - L > 2 ? " ni celle de " + (L + 2) : "") + "."); },
);
V("divcrit", 2,
  () => { let b, c, x; do { b = R.int(1, 9); c = R.int(0, 9); x = (9 - ((b + c) % 9)) % 9; } while (x < 2); return QV("Quel chiffre faut-il écrire à la place de ■ pour que le nombre ■" + b + c + " (à trois chiffres) soit divisible par 9 ?", x, "La somme " + M("■ + " + b + " + " + c) + " doit être un multiple de 9 : " + M(x + " + " + b + " + " + c + " = " + (x + b + c)) + "."); },
  () => { let a, b, x; do { a = R.int(1, 9); b = R.pick([0, 5]); x = 9; while ((a + x + b) % 3) x--; } while (x < 2 || x === a || x === b); return QV("Quel est le plus grand chiffre à écrire à la place de ■ pour que " + a + "■" + b + " soit divisible à la fois par 3 et par 5 ?", x, "Il finit par " + b + " : divisible par 5. Pour 3, la somme " + M(a + " + ■ + " + b) + " doit être un multiple de 3 : le plus grand chiffre possible est " + x + " (" + (a + x + b) + ")."); },
);
V("premiers", 1,
  () => { const [lo, hi, n] = R.pick([[20, 40, 4], [40, 60, 5], [60, 80, 5], [80, 100, 3], [10, 30, 6], [30, 50, 5]]); return QV("Combien y a-t-il de nombres premiers entre " + lo + " et " + hi + " ?", n, "Premiers jusqu'à 100 : 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97."); },
  () => { const [L, p] = R.pick([[50, 47], [60, 59], [70, 67], [80, 79], [90, 89], [100, 97], [40, 37], [30, 29]]); return QV("Quel est le plus grand nombre premier strictement inférieur à " + L + " ?", p, M(p) + " n'est divisible ni par 2, ni par 3, ni par 5, ni par 7."); },
);
V("premiers", 2,
  () => { const [n, p] = R.pick([[91, 7], [119, 7], [143, 11], [161, 7], [187, 11], [203, 7], [221, 13], [209, 11]]); return QV("Quel est le plus petit facteur premier de " + M(n) + " ?", p, M(n + " = " + p + " \\cdot " + n / p) + "."); },
  () => { const e = R.int(3, 6), m = R.pick([3, 5, 7]), n = 2 ** e * m; return QV("On décompose " + M(n) + " en facteurs premiers. Quel est l'exposant de 2 ?", e, M(n + " = 2^{" + e + "} \\cdot " + m) + "."); },
);
V34("premiers",
  () => { const [a, b, c] = R.pick([[2, 1, 1], [1, 2, 1], [2, 2, 1], [3, 1, 1], [1, 1, 2], [2, 1, 2]]), n = 2 ** a * 3 ** b * 5 ** c, pw = (p, e) => (e > 1 ? p + "^{" + e + "}" : String(p)); return QV("Quel nombre a pour décomposition en facteurs premiers " + M(pw(2, a) + " \\cdot " + pw(3, b) + " \\cdot " + pw(5, c)) + " ?", n, M(2 ** a + " \\cdot " + 3 ** b + " \\cdot " + 5 ** c + " = " + n) + "."); },
  () => { const [n, k, s] = R.pick([[60, 3, "2^2 \\cdot 3 \\cdot 5"], [84, 3, "2^2 \\cdot 3 \\cdot 7"], [90, 3, "2 \\cdot 3^2 \\cdot 5"], [210, 4, "2 \\cdot 3 \\cdot 5 \\cdot 7"], [72, 2, "2^3 \\cdot 3^2"], [150, 3, "2 \\cdot 3 \\cdot 5^2"], [330, 4, "2 \\cdot 3 \\cdot 5 \\cdot 11"]]); return QV("Combien de nombres premiers différents apparaissent dans la décomposition de " + M(n) + " ?", k, M(n + " = " + s) + " : " + k + " premiers différents."); },
);
V("arith", 1,
  () => { const g = R.pick([4, 6, 8, 9, 12, 14, 15]); let p, q; do { p = R.int(2, 7); q = R.int(2, 7); } while (p === q || gcd(p, q) !== 1); return QV("Quel est le plus grand nombre qui divise à la fois " + M(g * p) + " et " + M(g * q) + " ?", g, "C'est le PGDC : " + M(g * p + " = " + g + " \\cdot " + p) + " et " + M(g * q + " = " + g + " \\cdot " + q) + "."); },
  () => { const g = R.pick([4, 6, 7, 8, 9, 12]); let p, q; do { p = R.int(2, 9); q = R.int(2, 9); } while (p >= q || gcd(p, q) !== 1); return QV("Par quel nombre faut-il simplifier " + M("\\frac{" + g * p + "}{" + g * q + "}") + " pour obtenir directement une fraction irréductible ?", g, "Par le PGDC de " + g * p + " et " + g * q + ", qui vaut " + g + " : " + M("\\frac{" + g * p + "}{" + g * q + "} = \\frac{" + p + "}{" + q + "}") + "."); },
);
V("arith", 2,
  () => { const [a, b, l] = R.pick([[6, 8, 24], [4, 10, 20], [6, 15, 30], [8, 12, 24], [9, 12, 36], [10, 15, 30], [12, 18, 36], [14, 21, 42]]); return QV("Quel est le plus petit nombre non nul qui soit à la fois multiple de " + a + " et de " + b + " ?", l, "C'est le PPMC : " + M(l + " = " + a + " \\cdot " + l / a + " = " + b + " \\cdot " + l / b) + "."); },
  () => { const [a, b, l] = R.pick([[6, 8, 24], [4, 6, 12], [9, 12, 36], [10, 15, 30], [8, 12, 24], [12, 18, 36]]); return QV("Quel est le plus petit dénominateur commun de " + M("\\frac{1}{" + a + "}") + " et " + M("\\frac{1}{" + b + "}") + " ?", l, "C'est le PPMC de " + a + " et " + b + " : " + M(l) + "."); },
);
// --- Périmètres et aires ---
V("perim", 1,
  () => { const a = nonInt(() => d1(2.1, 9.9)); return QV("Calcule le périmètre d'un triangle équilatéral de côté " + M(dec(a)) + " cm (en cm).", r6(3 * a), M("3 \\cdot " + dec(a) + " = " + dec(r6(3 * a))) + " cm."); },
  () => { let a, b, c; do { a = R.int(3, 9); b = R.int(4, 9); c = R.int(5, 12); } while (c >= a + b || a >= b + c || b >= a + c); return QV("Un triangle a des côtés de " + a + " cm, " + b + " cm et " + c + " cm. Quel est son périmètre (en cm) ?", a + b + c, M(a + " + " + b + " + " + c + " = " + (a + b + c)) + " cm."); },
);
V("perim", 2,
  () => { const b = R.int(4, 10), c = R.int(Math.floor(b / 2) + 1, 12); return QV("Un triangle isocèle a un périmètre de " + (2 * c + b) + " cm et une base de " + b + " cm. Combien mesure chacun des deux côtés égaux (en cm) ?", c, M("(" + (2 * c + b) + " - " + b + ") : 2 = " + c) + " cm."); },
  () => { const L = R.int(8, 20), l = R.int(2, L - 2); return QV("Un rectangle a un périmètre de " + 2 * (L + l) + " cm et une largeur de " + l + " cm. Quelle est sa longueur (en cm) ?", L, "Demi-périmètre : " + (L + l) + " cm. Longueur : " + M((L + l) + " - " + l + " = " + L) + " cm."); },
);
V34("perim",
  () => { const a = R.int(10, 20), b = R.int(6, 12), c = R.int(2, Math.min(5, b - 1)); return QV("Au milieu d'un côté de " + a + " cm d'un rectangle de " + a + " cm sur " + b + " cm, on découpe une encoche carrée de " + c + " cm de côté. Quel est le périmètre de la figure obtenue (en cm) ?", 2 * (a + b) + 2 * c, "Le fond de l'encoche remplace le morceau enlevé, mais ses deux côtés s'ajoutent : " + M(2 * (a + b) + " + 2 \\cdot " + c + " = " + (2 * (a + b) + 2 * c)) + " cm."); },
  () => { const c = R.int(3, 12), n = R.int(2, 4); return QV("On colle " + n + " carrés de " + c + " cm de côté, côte à côte, en ligne. Quel est le périmètre du rectangle obtenu (en cm) ?", 2 * (n * c + c), "Rectangle de " + n * c + " cm sur " + c + " cm : " + M("2 \\cdot (" + n * c + " + " + c + ") = " + 2 * (n * c + c)) + " cm."); },
);
V("aire1", 2,
  () => { const a = R.int(3, 12), b = R.int(2, 10) * 2; return QV("Un triangle est rectangle. Les côtés de l'angle droit mesurent " + a + " cm et " + b + " cm. Quelle est son aire (en cm²) ?", (a * b) / 2, M("\\frac{" + a + " \\cdot " + b + "}{2} = " + (a * b) / 2) + " cm²."); },
  () => { const b = R.int(2, 6) * 2, h = R.int(3, 10); return QV("Un triangle a une aire de " + (b * h) / 2 + " cm² et une base de " + b + " cm. Quelle est la hauteur relative à cette base (en cm) ?", h, M("h = \\frac{2 \\cdot " + (b * h) / 2 + "}{" + b + "} = " + h) + " cm."); },
);
V("aire2", 1,
  () => { const b = R.int(4, 12), h = R.int(3, 9); return QV("Un parallélogramme a une aire de " + b * h + " cm² et une base de " + b + " cm. Quelle est sa hauteur (en cm) ?", h, M(b * h + " : " + b + " = " + h) + " cm."); },
  () => { const b = nonInt(() => d1(3.2, 8.8)), h = R.int(3, 9); return QV("Calcule l'aire d'un parallélogramme de base " + M(dec(b)) + " m et de hauteur " + h + " m (en m²).", r6(b * h), M(dec(b) + " \\cdot " + h + " = " + dec(r6(b * h))) + " m²."); },
);
V("aire2", 2,
  () => { const d = R.int(4, 12), e = R.int(3, 10) * 2; return QV("Un losange a une aire de " + (d * e) / 2 + " cm² et une diagonale de " + d + " cm. Combien mesure l'autre diagonale (en cm) ?", e, M("\\frac{2 \\cdot " + (d * e) / 2 + "}{" + d + "} = " + e) + " cm."); },
  () => { const d = R.int(20, 60), e = R.int(15, 40) * 2; return QV("Un cerf-volant a des diagonales perpendiculaires de " + d + " cm et " + e + " cm. Quelle est son aire (en cm²) ?", (d * e) / 2, "Comme pour un losange : " + M("\\frac{" + d + " \\cdot " + e + "}{2} = " + (d * e) / 2) + " cm²."); },
);
V34("aire2",
  () => { const b = R.int(4, 10) * 2, h = R.int(3, 9), c = h + R.int(1, 4); return QV("Un triangle a une base de " + b + " cm et un autre côté de " + c + " cm ; la hauteur relative à la base mesure " + h + " cm. Quelle est son aire (en cm²) ?", (b * h) / 2, "Le côté de " + c + " cm ne sert pas : " + M("\\frac{" + b + " \\cdot " + h + "}{2} = " + (b * h) / 2) + " cm²."); },
  () => { const [a, ha, b] = R.pick([[12, 4, 8], [10, 6, 12], [15, 4, 10], [9, 8, 12], [16, 3, 12], [14, 6, 12], [18, 4, 9]]), A = a * ha;
    return QV("Un parallélogramme a des côtés de " + a + " cm et " + b + " cm. La hauteur relative au côté de " + a + " cm mesure " + ha + " cm. Combien mesure la hauteur relative au côté de " + b + " cm (en cm) ?", A / b, "Aire : " + M(a + " \\cdot " + ha + " = " + A) + " cm². Autre hauteur : " + M(A + " : " + b + " = " + A / b) + " cm."); },
);
V("aire3", 1,
  () => { const a = R.int(4, 10), h = R.int(2, 6) * 2; return QV("Une figure est formée d'un carré de " + a + " cm de côté, surmonté d'un triangle de même base et de " + h + " cm de hauteur. Quelle est son aire (en cm²) ?", a * a + (a * h) / 2, M(a + "^2 + \\frac{" + a + " \\cdot " + h + "}{2} = " + a * a + " + " + (a * h) / 2 + " = " + (a * a + (a * h) / 2)) + " cm²."); },
  () => { const a = R.int(6, 12), b = R.int(2, 4), c = R.int(3, 8); return QV("Une lettre T est formée d'une barre de " + a + " cm sur " + b + " cm, posée sur un pied de " + b + " cm sur " + c + " cm. Quelle est son aire (en cm²) ?", a * b + b * c, M(a + " \\cdot " + b + " + " + b + " \\cdot " + c + " = " + (a * b + b * c)) + " cm²."); },
);
V("aire3", 2,
  () => { const B = R.int(8, 14), b = R.int(3, B - 3), h = R.int(3, 8) * 2, A = b * h + ((B - b) * h) / 2; return QV("Un trapèze rectangle a des bases de " + B + " cm et " + b + " cm et une hauteur de " + h + " cm. On le découpe en un rectangle et un triangle. Quelle est son aire (en cm²) ?", A, "Rectangle " + M(b + " \\cdot " + h + " = " + b * h) + ", triangle " + M("\\frac{" + (B - b) + " \\cdot " + h + "}{2} = " + ((B - b) * h) / 2) + " : " + A + " cm²."); },
  () => { const a = R.int(8, 14), h = R.int(2, 6) * 2, n = R.int(2, 3); return QV("Une guirlande est formée de " + n + " fanions triangulaires de " + a + " cm de base et " + h + " cm de hauteur. Quelle est l'aire totale de tissu (en cm²) ?", (n * a * h) / 2, M(n + " \\cdot \\frac{" + a + " \\cdot " + h + "}{2} = " + (n * a * h) / 2) + " cm²."); },
);
V34("aire3",
  () => { const a = R.int(10, 20), b = R.int(8, 15), c = R.int(2, 5); return QV("Une pelouse rectangulaire de " + a + " m sur " + b + " m entoure un bassin carré de " + c + " m de côté. Quelle est l'aire de la pelouse (en m²) ?", a * b - c * c, M(a + " \\cdot " + b + " - " + c + "^2 = " + a * b + " - " + c * c + " = " + (a * b - c * c)) + " m²."); },
  () => { const a = R.int(6, 15), b = R.int(4, 10); return QV("Un chemin de 1 m de large fait le tour, à l'extérieur, d'un jardin rectangulaire de " + a + " m sur " + b + " m. Quelle est l'aire du chemin (en m²) ?", (a + 2) * (b + 2) - a * b, "Grand rectangle " + M((a + 2) + " \\cdot " + (b + 2) + " = " + (a + 2) * (b + 2)) + ", moins le jardin " + M(a * b) + " : " + ((a + 2) * (b + 2) - a * b) + " m²."); },
);
// --- Nombres relatifs ---
V("relrep", 2,
  () => { const a = R.int(3, 12), b = R.int(2, 9); return QV("Le matin, il fait " + M("-" + a) + " °C ; l'après-midi, " + M(b) + " °C. De combien de degrés la température a-t-elle monté ?", a + b, "De " + M("-" + a) + " à 0 : " + a + " ; de 0 à " + b + " : " + b + ". Écart : " + (a + b) + " °C."); },
  () => { const a = R.int(8, 15), b = R.int(2, a - 2); return QV("Sur une droite graduée, quelle est la distance entre les points d'abscisses " + M("-" + a) + " et " + M("-" + b) + " ?", a - b, "Les deux sont négatifs : " + M(a + " - " + b + " = " + (a - b)) + "."); },
);
V34("relrep",
  () => { const a = R.int(5, 14), h = R.int(1, Math.floor((a - 1) / 2)), b = a - 2 * h; return QV("Quel nombre est à égale distance de " + M("-" + a) + " et de " + M("-" + b) + " sur la droite graduée ?", -(a - h), "Distance " + 2 * h + ", la moitié est " + h + " : " + M("-" + a + " + " + h + " = -" + (a - h)) + "."); },
  () => { let a, m; do { a = R.int(2, 9); m = R.int(-4, 6); } while (m === 0 || m === -a || Math.abs(2 * m + a) < 2); return QV("Le point A a pour abscisse " + M("-" + a) + ". Le milieu de [AB] a pour abscisse " + M(m) + ". Quelle est l'abscisse de B ?", 2 * m + a, "De A au milieu, on avance de " + (m + a) + ". On recommence depuis le milieu : " + M(m + " + " + (m + a) + " = " + (2 * m + a)) + "."); },
);
// --- Pavé ---
V("volpave", 1,
  () => { const a = R.int(3, 9); return QV("Calcule le volume d'un cube d'arête " + a + " cm (en cm³).", a ** 3, M(a + "^3 = " + a ** 3) + " cm³."); },
  () => { const a = R.int(3, 8), b = R.int(2, 6), h = R.int(2, 9); return QV("Un pavé droit a un volume de " + a * b * h + " cm³ et une base de " + a + " cm sur " + b + " cm. Quelle est sa hauteur (en cm) ?", h, M(a * b * h + " : (" + a + " \\cdot " + b + ") = " + h) + " cm."); },
);
V34("volpave",
  () => { const [a, b] = R.pick([[20, 25], [20, 30], [25, 40], [30, 50], [20, 50]]), h = R.int(4, 15), cm3 = a * b * h, L = cm3 / 1000; return QV("Un récipient en forme de pavé a une base de " + a + " cm sur " + b + " cm. On y verse " + M(dec(L)) + " L d'eau. Quelle hauteur l'eau atteint-elle (en cm) ?", h, M(dec(L) + " \\text{ L} = " + mille(cm3) + " \\text{ cm}^3") + " ; " + M(mille(cm3) + " : " + a * b + " = " + h) + " cm."); },
  () => { const a = R.int(2, 6), b = R.int(2, 5), h = R.pick([10, 20, 30, 40, 50]); return QV("Un carton mesure " + a + " dm sur " + b + " dm sur " + h + " cm. Quel est son volume, en litres ?", (a * b * h) / 10, h + " cm = " + h / 10 + " dm ; " + M(a + " \\cdot " + b + " \\cdot " + h / 10 + " = " + (a * b * h) / 10) + " dm³, soit " + (a * b * h) / 10 + " L."); },
);
// --- Fractions ---
V34("fracrep",
  () => { let a, b, c, d, x, y; do { b = R.int(2, 5); x = R.int(1, 4); a = x * b + R.int(1, b - 1); d = R.int(2, 5); y = x + R.int(2, 4); c = y * d + R.int(1, d - 1); } while (a === c || b === d || [a, b, c, d].includes(y - x)); return QV("Combien de nombres entiers sont strictement compris entre " + M("\\frac{" + a + "}{" + b + "}") + " et " + M("\\frac{" + c + "}{" + d + "}") + " ?", y - x, M(x + " < \\frac{" + a + "}{" + b + "} < " + (x + 1)) + " et " + M(y + " < \\frac{" + c + "}{" + d + "} < " + (y + 1)) + " : les entiers de " + (x + 1) + " à " + y + ", soit " + (y - x) + "."); },
  () => { let a, b; do { b = R.int(3, 9); a = R.int(2 * b + 1, 9 * b); } while (a % b === 0); return QV("La fraction " + M("\\frac{" + a + "}{" + b + "}") + " est comprise entre deux entiers consécutifs. Quel est le plus grand des deux ?", Math.ceil(a / b), M(a + " = " + Math.floor(a / b) + " \\cdot " + b + " + " + (a % b)) + ", donc " + M(Math.floor(a / b) + " < \\frac{" + a + "}{" + b + "} < " + Math.ceil(a / b)) + "."); },
);
const irr = (lo, hi) => { let a, b; do { b = R.int(lo, hi); a = R.int(2, b - 1); } while (gcd(a, b) !== 1); return [a, b]; };
V("fracsimp", 1,
  () => { const [a, b] = irr(3, 9), k = R.int(3, 8); return QV("Complète : " + M("\\frac{" + a + "}{" + b + "} = \\frac{" + a * k + "}{?}"), b * k, "On a multiplié le numérateur par " + k + " : " + M(b + " \\cdot " + k + " = " + b * k) + "."); },
  () => { const [a, b] = irr(3, 9), k = R.int(3, 12); return QV("Par quel nombre a-t-on amplifié " + M("\\frac{" + a + "}{" + b + "}") + " pour obtenir " + M("\\frac{" + a * k + "}{" + b * k + "}") + " ?", k, M(b * k + " : " + b + " = " + k) + "."); },
);
V("fracsimp", 2,
  () => { const [a, b] = irr(3, 11), k = R.int(2, 6); return QV("Rends la fraction " + M("\\frac{" + a * k + "}{" + b * k + "}") + " irréductible. Quel est le numérateur de la fraction obtenue ?", a, "On simplifie par " + k + " : " + M("\\frac{" + a + "}{" + b + "}") + "."); },
  () => { const [a, b] = irr(3, 11), k = R.pick([4, 6, 8, 9, 10, 12]); return QV("Par quel nombre faut-il simplifier " + M("\\frac{" + a * k + "}{" + b * k + "}") + " pour la rendre irréductible en une seule étape ?", k, "Par le PGDC de " + a * k + " et " + b * k + ", qui vaut " + k + " : " + M("\\frac{" + a + "}{" + b + "}") + "."); },
);
V34("fracsimp",
  () => { const [a, b] = irr(5, 13), k = R.pick([12, 14, 15, 18, 21, 24]); return QV("Rends la fraction " + M("\\frac{" + a * k + "}{" + b * k + "}") + " irréductible. Quel est le dénominateur de la fraction obtenue ?", b, "Le PGDC est " + k + " : " + M("\\frac{" + a * k + "}{" + b * k + "} = \\frac{" + a + "}{" + b + "}") + "."); },
  () => { const [num, den] = R.pick([[3, 4], [2, 5], [4, 5], [3, 8], [5, 8], [7, 20], [9, 25], [3, 25], [7, 8]]), v = r6(num / den); return QV("Écris " + M(dec(v)) + " sous forme de fraction irréductible. Quel est son dénominateur ?", den, M(dec(v) + " = \\frac{" + Math.round(v * 1000) + "}{1000} = \\frac{" + num + "}{" + den + "}") + "."); },
);
V("fracconv", 1,
  () => { const [n, d] = R.pick([[3, 4], [1, 4], [2, 5], [3, 5], [4, 5], [7, 20], [9, 20], [3, 25], [11, 25], [1, 8]]); return QV("Écris " + M("\\frac{" + n + "}{" + d + "}") + " en nombre décimal.", r6(n / d), M(n + " : " + d + " = " + dec(r6(n / d))) + ".", { plain: true }); },
  () => { const n = R.int(11, 99), p = R.pick([100, 1000]); return QV("Écris " + M("\\frac{" + n + "}{" + mille(p) + "}") + " en nombre décimal.", r6(n / p), "Diviser par " + mille(p) + " : " + M(dec(r6(n / p))) + ".", { plain: true }); },
);
V("fracconv", 2,
  () => { const v = R.pick([0.45, 0.07, 0.6, 1.2, 0.125, 0.85, 0.035]); return QV("Écris " + M(dec(v)) + " en pourcentage (donne seulement le nombre).", r6(v * 100), M(dec(v) + " = " + dec(r6(v * 100)) + " \\%") + ".", { plain: true }); },
  () => { const t = R.pick([20, 25, 40, 50]); let n; do n = R.int(2, t - 2); while ((n * 100) % t); return QV("Dans une classe de " + t + " élèves, " + n + " viennent à pied. Quel pourcentage des élèves cela représente-t-il (donne seulement le nombre) ?", (n * 100) / t, M("\\frac{" + n + "}{" + t + "} = \\frac{" + (n * 100) / t + "}{100} = " + (n * 100) / t + " \\%") + ".", { plain: true }); },
);
V34("fracconv",
  () => { const p = R.pick([8, 12, 15, 35, 45, 55, 65, 85, 95]), g = gcd(p, 100); return QV("Écris " + M(p + " \\%") + " sous forme de fraction irréductible. Quel est son numérateur ?", p / g, M(p + " \\% = \\frac{" + p + "}{100} = \\frac{" + p / g + "}{" + 100 / g + "}") + "."); },
  () => { const p = R.pick([125, 150, 175, 120, 140, 250]), g = gcd(p, 100); return QV("Écris " + M(p + " \\%") + " sous forme de fraction irréductible. Quel est son numérateur ?", p / g, M(p + " \\% = \\frac{" + p + "}{100} = \\frac{" + p / g + "}{" + 100 / g + "}") + " (plus de 100 % : plus grand que 1)."); },
);
V("fracper", 1,
  () => { let a, s; do { a = R.int(1, 10); s = String(Math.floor((a * 100) / 11)).padStart(2, "0"); } while (+s[1] < 2); const k = R.pick([6, 8, 10, 12]); return QV("Dans l'écriture décimale de " + M("\\frac{" + a + "}{11}") + ", quel est le " + k + "e chiffre après la virgule ?", +s[1], M("\\frac{" + a + "}{11} = 0{,}" + s + s + s + "\\ldots") + " : période de 2 chiffres ; les rangs pairs donnent " + s[1] + "."); },
  () => { let a; do a = R.int(10, 80); while (a % 3 === 0); const ent = Math.floor(a / 3), d = (a % 3) * 3; return QV("Dans l'écriture décimale de " + M("\\frac{" + a + "}{3}") + ", quel chiffre se répète indéfiniment ?", d, M("\\frac{" + a + "}{3} = " + ent + "{,}" + String(d).repeat(4) + "\\ldots") + "."); },
);
V("fracper", 2,
  () => { const [a, b, p] = R.pick([[5, 33, 15], [7, 33, 21], [2, 33, 6], [4, 11, 36], [9, 11, 81], [10, 33, 30], [8, 33, 24], [13, 33, 39]]); return QV("L'écriture décimale de " + M("\\frac{" + a + "}{" + b + "}") + " répète indéfiniment un groupe de deux chiffres. Lequel (écris-le comme un nombre) ?", p, M("\\frac{" + a + "}{" + b + "} = 0{,}" + String(p).padStart(2, "0").repeat(3) + "\\ldots") + "."); },
  () => { const [a, b, n] = R.pick([[1, 7, 6], [1, 11, 2], [1, 37, 3], [1, 13, 6], [2, 7, 6], [5, 37, 3]]); return QV("Combien de chiffres contient la période de l'écriture décimale de " + M("\\frac{" + a + "}{" + b + "}") + " ?", n, "On pose la division : le groupe qui se répète a " + n + " chiffres."); },
);
V34("fracper",
  () => { const d = R.int(2, 8), e = R.int(1, 3); return QV("Écris le nombre " + M(e + "{,}" + String(d).repeat(4) + "\\ldots") + " sous forme de fraction.", (9 * e + d) / 9, M("0{,}" + String(d).repeat(3) + "\\ldots = \\frac{" + d + "}{9}") + ", donc " + M(e + " + \\frac{" + d + "}{9} = \\frac{" + (9 * e + d) + "}{9}") + "."); },
  () => { const p = R.pick([12, 18, 27, 36, 45, 54, 63, 72, 81]), g = gcd(p, 99); return QV("Écris le nombre " + M("0{,}" + String(p).repeat(3) + "\\ldots") + " sous forme de fraction irréductible.", p / 99, M("0{,}" + p + p + "\\ldots = \\frac{" + p + "}{99} = \\frac{" + p / g + "}{" + 99 / g + "}") + "."); },
);
V("fractout", 1,
  () => { const [a, b] = R.pick([[3, 4], [2, 3], [5, 6], [3, 5], [7, 10], [5, 12], [2, 5]]); return QV("Combien de minutes y a-t-il dans les " + M("\\frac{" + a + "}{" + b + "}") + " d'une heure ?", (60 / b) * a, M("60 \\div " + b + " = " + 60 / b) + ", puis " + M(60 / b + " \\cdot " + a + " = " + (60 / b) * a) + " min."); },
  () => { let a, b; do { b = R.pick([3, 4, 5, 6, 8]); a = R.int(2, b - 1); } while (gcd(a, b) !== 1); const k = R.int(3, 12); return QV("Un trajet mesure " + b * k + " km. On a déjà parcouru les " + M("\\frac{" + a + "}{" + b + "}") + ". Combien de kilomètres a-t-on parcourus ?", a * k, M(b * k + " \\div " + b + " = " + k) + ", puis " + M(k + " \\cdot " + a + " = " + a * k) + " km."); },
);
V("fractout", 2,
  () => { let a, b; do { b = R.pick([4, 6, 8, 12]); a = R.int(1, b - 1); } while (gcd(a, b) !== 1); const n = b * R.int(2, 4), m = (n / b) * a; return QV("Un gâteau est coupé en " + n + " parts. On en mange les " + M("\\frac{" + a + "}{" + b + "}") + ". Combien de parts reste-t-il ?", n - m, "Mangées : " + M(n + " \\div " + b + " \\cdot " + a + " = " + m) + ". Reste : " + (n - m) + " parts."); },
  () => { let a, b; do { b = R.pick([3, 4, 5]); a = R.int(1, b - 1); } while (gcd(a, b) !== 1); const L = b * R.pick([4, 5, 6, 8, 10]), u = (L / b) * a; return QV("Un réservoir de " + L + " L est plein. On utilise les " + M("\\frac{" + a + "}{" + b + "}") + " de l'eau. Combien de litres reste-t-il ?", L - u, "Utilisé : " + M(L + " \\div " + b + " \\cdot " + a + " = " + u) + " L. Reste : " + (L - u) + " L."); },
);
V34("fractout",
  () => { let a, b; do { b = R.pick([3, 4, 5, 6]); a = R.int(1, b - 1); } while (gcd(a, b) !== 1); const k = R.int(3, 12); return QV("Un réservoir rempli aux " + M("\\frac{" + a + "}{" + b + "}") + " contient " + a * k + " L. Quelle est sa capacité (en L) ?", b * k, "Un " + NTH[b] + " vaut " + M(a * k + " \\div " + a + " = " + k) + " L ; capacité " + M(k + " \\cdot " + b + " = " + b * k) + " L."); },
  () => { let a, b; do { b = R.pick([3, 4, 5]); a = R.int(1, b - 1); } while (gcd(a, b) !== 1); const k = R.int(3, 10); return QV("Après avoir dépensé les " + M("\\frac{" + a + "}{" + b + "}") + " de son argent, Noé a encore " + (b - a) * k + " CHF. Combien avait-il au départ (en CHF) ?", b * k, "Il lui reste les " + M("\\frac{" + (b - a) + "}{" + b + "}") + " : un " + NTH[b] + " vaut " + M((b - a) * k + " \\div " + (b - a) + " = " + k) + " ; départ " + M(b * k) + " CHF."); },
);
V("fracadd", 1,
  () => { let n, a, b; do { n = R.pick([5, 7, 8, 9, 11, 12]); a = R.int(Math.floor(n / 2) + 2, n + 4); b = R.int(1, a - 2); } while (a - b === n || a === n || b === n); return QV("Calcule et simplifie : " + M("\\frac{" + a + "}{" + n + "} - \\frac{" + b + "}{" + n + "}"), (a - b) / n, M("\\frac{" + (a - b) + "}{" + n + "}" + (gcd(a - b, n) > 1 ? " = " + frac(a - b, n) : "")) + "."); },
  () => { let n, a, c; do { n = R.pick([7, 9, 11, 13]); a = R.int(1, n - 3); c = R.int(a + 2, n + 5); } while ([a, c, n].includes(c - a) || c === n); return QV("Complète : " + M("\\frac{" + a + "}{" + n + "} + \\frac{?}{" + n + "} = \\frac{" + c + "}{" + n + "}"), c - a, "Même dénominateur : " + M(c + " - " + a + " = " + (c - a)) + "."); },
);
V("fracadd", 2,
  () => { let a, b, c, d; do { [b, d] = R.pick([[3, 4], [2, 5], [4, 6], [3, 5], [6, 8], [4, 10]]); a = R.int(2, b + 2); c = R.int(1, d - 1); } while (a * d <= c * b); return QV("Calcule et simplifie : " + M("\\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + d + "}"), a / b - c / d, "Dénominateur commun : " + M("\\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + d + "} = " + frac(a * d - c * b, b * d)) + "."); },
  () => { const [b, d] = R.pick([[3, 5], [4, 6], [3, 4], [5, 10], [6, 9]]), c = R.int(1, d - 2); return QV("Un réservoir vide est rempli au " + M("\\frac{1}{" + b + "}") + " le matin, puis on ajoute " + M("\\frac{" + c + "}{" + d + "}") + " de sa capacité l'après-midi. Quelle fraction du réservoir est remplie ?", 1 / b + c / d, M("\\frac{1}{" + b + "} + \\frac{" + c + "}{" + d + "} = " + frac(d + c * b, b * d)) + "."); },
);
V34("fracadd",
  () => { const e = R.int(2, 4), [b, d] = R.pick([[4, 6], [3, 4], [6, 8], [4, 10], [3, 5]]), a = R.int(1, b - 1), c = R.int(1, d - 1), v = e - a / b - c / d; return QV("Calcule et simplifie : " + M(e + " - \\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + d + "}"), v, "Tout au même dénominateur : " + M(frac(e * b * d - a * d - c * b, b * d)) + "."); },
  () => { let b, d, f, c, g, v; do { [b, d, f] = R.pick([[2, 3, 6], [3, 4, 12], [2, 5, 10], [4, 6, 12], [3, 6, 9]]); c = R.int(1, d - 1); g = R.int(1, f - 1); v = 1 / b + c / d - g / f; } while (Math.abs(v) < 1e-9); return QV("Calcule et simplifie : " + M("\\frac{1}{" + b + "} + \\frac{" + c + "}{" + d + "} - \\frac{" + g + "}{" + f + "}"), v, "Dénominateur commun : " + M(frac(d * f + c * b * f - g * b * d, b * d * f)) + "."); },
);
// --- Proportionnalité ---
V("proptab", 1,
  () => { const k = R.int(3, 12), a = R.int(2, 9); return QV("Dans un tableau de proportionnalité, " + a + " correspond à " + a * k + ". Par quel nombre multiplie-t-on la première ligne pour obtenir la seconde ?", k, M(a * k + " : " + a + " = " + k) + "."); },
  () => { const p = nonInt(() => d1(1.2, 4.8)), m = R.int(3, 9); return QV(M(m) + " kg de pommes coûtent " + M(chf(r6(p * m))) + " CHF. Quel est le coefficient de proportionnalité de la masse au prix (le prix d'un kilo, en CHF) ?", p, M(chf(r6(p * m)) + " : " + m + " = " + dec(p)) + " CHF par kilo."); },
);
V("proptab", 2,
  () => { const per = R.pick([4, 5, 8]), g = R.pick([200, 250, 300, 500]); return QV("Une recette demande " + g + " g de farine pour " + per + " personnes. Quelle quantité de farine faut-il par personne (en g) ?", r6(g / per), M(g + " : " + per + " = " + dec(r6(g / per))) + " g : c'est le coefficient."); },
  () => { const k = R.pick([0.5, 0.25, 0.75, 1.5, 2.5, 0.4]), a = R.int(2, 9) * 4; return QV("Dans un tableau de proportionnalité, " + a + " correspond à " + dT(a * k) + ". Quel est le coefficient de proportionnalité ?", k, M(dec(r6(a * k)) + " : " + a + " = " + dec(k)) + "."); },
);
V34("proptab",
  () => { let k, a, c; do { k = R.pick([1.5, 2.5, 0.5, 1.25]); a = R.int(2, 8) * 2; c = R.int(3, 9) * 4; } while (c === a || r6(a * k) === c || r6(c * k) === a); return QV("Tableau de proportionnalité : " + M(a + " \\to " + dec(r6(a * k))) + " et " + M("?\\ \\to " + dec(r6(c * k))) + ". Quel nombre manque ?", c, "Coefficient : " + M(dec(r6(a * k)) + " : " + a + " = " + dec(k)) + ". Donc " + M(dec(r6(c * k)) + " : " + dec(k) + " = " + c) + "."); },
  () => { const a = R.int(2, 6), b = R.int(2, 6), u = R.int(3, 9); return QV("Tableau de proportionnalité : " + M(a + " \\to " + a * u) + " et " + M(b + " \\to " + b * u) + ". Quel nombre correspond à " + (a + b) + " ?", (a + b) * u, "On additionne les colonnes : " + M(a * u + " + " + b * u + " = " + (a + b) * u) + "."); },
);
V("prop", 1,
  () => { const p = nonInt(() => d1(1.2, 3.8)), a = R.int(2, 4), b = R.int(5, 9); return QV(M(a) + " kg de pommes coûtent " + M(chf(r6(p * a))) + " CHF. Combien coûtent " + M(b) + " kg (en CHF) ?", r6(p * b), "Un kilo : " + M(chf(p)) + " CHF ; " + M(b + " \\cdot " + chf(p) + " = " + chf(r6(p * b))) + " CHF."); },
  () => { const c = R.int(5, 8), a = R.int(2, 4) * 10, b = R.int(5, 9) * 10; return QV("Une voiture consomme " + (c * a) / 10 + " L pour " + a * 10 + " km. Combien consomme-t-elle pour " + b * 10 + " km (en L) ?", (c * b) / 10, "Pour 10 km : " + dT(c / 10) + " L ; pour " + b * 10 + " km : " + M(dec((c * b) / 10)) + " L."); },
);
V("prop", 2,
  () => { const r = R.int(4, 12) * 10, h1 = R.int(2, 4), h2 = R.int(5, 8); return QV("En " + h1 + " h, une machine fabrique " + r * h1 + " pièces. Combien en fabrique-t-elle en " + h2 + " h ?", r * h2, "En 1 h : " + r + " pièces ; " + M(h2 + " \\cdot " + r + " = " + r * h2) + "."); },
  () => { const d = R.int(3, 8), t1 = R.int(2, 5), V2 = d * R.int(6, 15); return QV("Un robinet remplit " + d * t1 + " L en " + t1 + " minutes. En combien de minutes remplit-il " + V2 + " L ?", V2 / d, "Débit : " + d + " L par minute ; " + M(V2 + " : " + d + " = " + V2 / d) + " min."); },
);
V34("prop",
  () => { const p = R.pick([12, 16, 18, 20, 24]), t = R.pick([1.5, 2.5, 0.5]), n = R.int(3, 8); return QV("Une imprimante imprime " + dT(p * t) + " pages en " + dT(t) + " minute" + (t > 1 ? "s" : "") + ". Combien de pages imprime-t-elle en " + n + " minutes ?", p * n, "En 1 minute : " + M(dec(r6(p * t)) + " : " + dec(t) + " = " + p) + " pages ; " + M(n + " \\cdot " + p + " = " + p * n) + "."); },
  () => { const k = R.int(3, 9), b = R.int(6, 12), m = R.pick([2.5, 1.5, 3.5]); return QV(M(dec(m)) + " m de tissu coûtent " + M(chf(r6(m * k))) + " CHF. Combien coûtent " + b + " m (en CHF) ?", k * b, "Un mètre : " + M(chf(r6(m * k)) + " : " + dec(m) + " = " + k) + " CHF ; " + M(b + " \\cdot " + k + " = " + k * b) + " CHF."); },
);
V("change", 1,
  () => { const t = R.pick([0.95, 0.9, 0.94, 1.05, 1.1]), e = R.int(4, 15) * 2; return QV("Un repas coûte " + e + " EUR en Italie. Le taux est 1 EUR = " + dT(t) + " CHF. Combien cela fait-il en francs ?", r6(e * t), M(e + " \\cdot " + dec(t) + " = " + dec(r6(e * t))) + " CHF."); },
  () => { const t = R.pick([1.05, 1.1, 1.08]), c = R.int(2, 9) * 10; return QV("Pour 1 CHF, on obtient " + dT(t) + " EUR. Combien d'euros obtient-on pour " + c + " CHF ?", r6(c * t), M(c + " \\cdot " + dec(t) + " = " + dec(r6(c * t))) + " EUR."); },
);
V("change", 2,
  () => { const t = R.pick([0.95, 0.9, 1.1, 1.05]), e = R.int(3, 15) * 10; return QV("Tu as " + M(dec(r6(e * t))) + " CHF. Combien d'euros reçois-tu au taux 1 EUR = " + dT(t) + " CHF ?", e, M(dec(r6(e * t)) + " : " + dec(t) + " = " + e) + " EUR."); },
  () => { const t = R.pick([0.9, 1.1, 0.95]), e = R.int(2, 9) * 20; return QV("Au taux 1 EUR = " + dT(t) + " CHF, un billet de train coûte " + M(dec(r6(e * t))) + " CHF. Quel est son prix en euros ?", e, "On divise par le taux : " + M(dec(r6(e * t)) + " : " + dec(t) + " = " + e) + " EUR."); },
);
V34("change",
  () => { const t = R.pick([0.95, 0.9, 1.05]), n = R.int(2, 4), e = R.int(6, 12) * 10, fr = r6(e * t * n), c = Math.round(fr) + R.pick([-12, -8, 6, 10]), d = Math.abs(r6(fr - c)); return QV("Un hôtel coûte " + e + " EUR la nuit en France. En Suisse, " + n + " nuits coûtent " + c + " CHF. Le taux est 1 EUR = " + dT(t) + " CHF. Quelle est la différence de prix pour " + n + " nuits, en francs ?", d, "France : " + M(n + " \\cdot " + e + " \\cdot " + dec(t) + " = " + dec(fr)) + " CHF. Différence : " + M(dec(d)) + " CHF."); },
  () => { const t = R.pick([0.9, 0.95]), e = R.int(4, 15) * 10, fr = r6(e * t), c = r6(fr + R.pick([-6, -4, 3, 5])), d = Math.abs(r6(fr - c)); return QV("Des baskets coûtent " + e + " EUR en ligne et " + dT(c) + " CHF en magasin. Le taux est 1 EUR = " + dT(t) + " CHF. De combien de francs les prix diffèrent-ils ?", d, "En ligne : " + M(e + " \\cdot " + dec(t) + " = " + dec(fr)) + " CHF. Écart : " + M(dec(d)) + " CHF."); },
);
V("agrand", 1,
  () => { const [k, a, b] = R.pick([[2.5, 4, 6], [1.5, 4, 8], [3, 5, 7], [2, 7, 9], [1.5, 6, 10]]); return QV("Un rectangle de " + a + " cm sur " + b + " cm est agrandi en un rectangle de " + dT(a * k) + " cm sur " + dT(b * k) + " cm. Par quel nombre a-t-on multiplié les longueurs ?", k, M(dec(r6(a * k)) + " : " + a + " = " + dec(k)) + "."); },
  () => { const k = R.pick([3, 4, 5]), a = R.int(2, 6) * k; return QV("Une photo de " + a + " cm de large est réduite à " + a / k + " cm de large. Par quelle fraction a-t-on multiplié les longueurs ?", 1 / k, M(a / k + " : " + a + " = \\frac{1}{" + k + "}") + "."); },
);
V("agrand", 2,
  () => { const k = R.pick([1.5, 2, 2.5, 3]), [a, b, c] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 6, 8]]); return QV("Un triangle de côtés " + a + " cm, " + b + " cm et " + c + " cm est agrandi d'un facteur " + dT(k) + ". Combien mesure son plus long côté (en cm) ?", r6(c * k), M(c + " \\cdot " + dec(k) + " = " + dec(r6(c * k))) + " cm."); },
  () => { const a = R.int(4, 12) * 2, b = R.int(3, 9) * 2; return QV("On réduit de moitié les longueurs d'un rectangle de " + a + " cm sur " + b + " cm. Quel est le périmètre du rectangle réduit (en cm) ?", a + b, "Côtés " + a / 2 + " cm et " + b / 2 + " cm : " + M("2 \\cdot (" + a / 2 + " + " + b / 2 + ") = " + (a + b)) + " cm."); },
);
V34("agrand",
  () => { const [n, d] = R.pick([[3, 4], [2, 3], [3, 5], [4, 5]]), a = d * R.int(3, 10); return QV("Une figure est réduite : chaque longueur est multipliée par " + M("\\frac{" + n + "}{" + d + "}") + ". Que devient un segment de " + a + " cm (en cm) ?", (a / d) * n, M(a + " \\cdot \\frac{" + n + "}{" + d + "} = " + (a / d) * n) + " cm."); },
  () => { let n, d, a, c; do { [n, d] = R.pick([[2, 3], [3, 4], [2, 5], [3, 5]]); a = d * R.int(3, 8); c = d * R.int(3, 9); } while (c === a || (c / d) * n === a || (c / d) * n === (a / d) * n); return QV("Sur une figure réduite, un côté de " + a + " cm est devenu " + (a / d) * n + " cm. Que devient un autre côté de " + c + " cm (en cm) ?", (c / d) * n, "Facteur " + M("\\frac{" + (a / d) * n + "}{" + a + "} = \\frac{" + n + "}{" + d + "}") + " ; " + M(c + " \\cdot \\frac{" + n + "}{" + d + "} = " + (c / d) * n) + " cm."); },
);
// --- Calcul littéral ---
V("litelab", 1,
  () => { const a = R.int(2, 9), b = R.int(2, 6); return QX("Je choisis un nombre x. Je lui retire " + a + ", puis je multiplie le résultat par " + b + ". Écris le résultat en fonction de x.", b + "(x-" + a + ")", M(b + "(x - " + a + ") = " + b + "x - " + a * b)); },
  () => { const a = R.int(2, 9), k = R.int(2, 4); return QX(MULT[k].replace("le", "Le") + " d'un nombre x, diminué de " + a + " : écris cette expression en fonction de x.", k + "x-" + a, M(k + "x - " + a)); },
  () => { const a = R.int(2, 9); return QX("La moitié d'un nombre x, augmentée de " + a + " : écris cette expression en fonction de x.", "x/2+" + a, M("\\frac{x}{2} + " + a)); },
);
// --- Diagrammes ---
V("diagr", 2,
  () => { let n, ang; do { n = R.pick([20, 24, 30, 36, 40]); ang = R.pick([30, 60, 72, 90, 120, 45]); } while ((ang * n) % 360 || (ang * n) / 360 < 2); return QV("Dans un diagramme circulaire qui représente " + n + " élèves, un secteur mesure " + ang + "°. Combien d'élèves représente-t-il ?", (ang * n) / 360, M("\\frac{" + ang + "}{360} \\cdot " + n + " = " + (ang * n) / 360) + " élèves."); },
  () => { const p = R.pick([10, 15, 20, 30, 35, 40, 45]); return QV("Dans un diagramme circulaire, une catégorie représente " + p + " % du total. Quel angle a son secteur (en degrés) ?", (p * 360) / 100, M("\\frac{" + p + "}{100} \\cdot 360° = " + (p * 360) / 100 + "°") + "."); },
);
