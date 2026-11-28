



(() => {
if (typeof PROBX === "undefined") return;
const ri = R.int, pk = R.pick;
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
const X = (v) => M(N(v));
const PX = (id, cl, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), cl)); };
const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: Object.assign({ kind: "value", value: r6(v) }, rd ? { round: rd } : {}) })) });
const gcd = (a, b) => (b ? gcd(b, a % b) : a);


const OPT = { co: [12, 13], mp: [13, 14] };
PX("optim", OPT, () => {
let p0, n0, k, x; do { p0 = pk([20, 24, 30]); n0 = pk([300, 360, 420, 480, 540]); k = pk([5, 6, 8, 10, 12]); x = (n0 - k * p0) / (2 * k); } while (!(x >= 2 && Number.isInteger(x * 2)));
const P = p0 + x, n = n0 - k * x, Rm = r6(P * n);
return PB("Un théâtre vend " + X(n0) + " billets par soir au prix de " + p0 + " CHF. Une étude montre que chaque franc d'augmentation du prix fait perdre " + k + " spectateurs (et chaque franc de baisse en fait gagner autant). On note " + M("x") + " l'augmentation du prix en CHF.",
[["a) Augmentation " + M("x") + " qui rend la recette maximale, en CHF", x], ["b) Prix du billet correspondant, en CHF", P], ["c) Recette maximale, en CHF", Rm]],
["Recette : " + M("R(x) = (" + p0 + " + x)(" + n0 + " - " + k + "x)") + ", une fonction du 2e degré.", "Le maximum est au sommet de la parabole, au milieu de ses deux zéros."],
M("R(x) = (" + p0 + " + x)(" + n0 + " - " + k + "x)") + " s'annule en " + M("x = -" + p0) + " et " + M("x = " + N(n0 / k)) + ". Sommet au milieu : " + M("x = \\frac{-" + p0 + " + " + N(n0 / k) + "}{2} = " + N(x)) + ". b) " + M(p0 + " + " + N(x) + " = " + N(P)) + " CHF. c) " + M(N(P) + " \\cdot " + N(n) + " = " + N(Rm)) + " CHF (" + N(n) + " spectateurs).");
});
PX("optim", OPT, () => {
const v = pk([12, 14, 16, 18, 22, 24]), h0 = pk([2, 3, 5]), tm = v / 10, hm = r6(h0 + (v * v) / 20), tg = (v + Math.sqrt(v * v + 20 * h0)) / 10;
return PB("Un ballon est lancé vers le haut. Sa hauteur (en m) après " + M("t") + " secondes est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + ".",
[["a) Après combien de secondes atteint-il sa hauteur maximale ?", tm], ["b) Hauteur maximale, en m", hm], ["c) Après combien de secondes touche-t-il le sol ? (au centième)", tg, 0.01]],
["Sommet d'une parabole " + M("at^2 + bt + c") + " : " + M("t = -\\frac{b}{2a}") + ".", "c) Résous " + M("h(t) = 0") + " et garde la solution positive."],
"a) " + M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(tm)) + " s. b) " + M("h(" + N(tm) + ") = " + N(hm)) + " m. c) " + M("\\Delta = " + v * v + " + 20 \\cdot " + h0 + " = " + (v * v + 20 * h0)) + " ; " + M("t = \\frac{" + v + " + \\sqrt{" + (v * v + 20 * h0) + "}}{10} \\approx " + N(Math.round(tg * 100) / 100)) + " s.");
});
PX("optim", OPT, () => {
const a = pk([8, 10, 12, 14]), b = pk([6, 9, 12, 15]);
return PB("Un rectangle a un sommet en " + M("O(0\\,;\\,0)") + ", deux côtés sur les axes, et le sommet opposé " + M("P(x\\,;\\,y)") + " sur la droite qui passe par " + M("(" + a + "\\,;\\,0)") + " et " + M("(0\\,;\\," + b + ")") + ".",
[["a) Abscisse de " + M("P") + " pour que l'aire du rectangle soit maximale", a / 2], ["b) Ordonnée de " + M("P") + " correspondante", b / 2], ["c) Aire maximale", (a * b) / 4]],
["Équation de la droite : " + M("y = " + b + " - \\frac{" + b + "}{" + a + "}x") + ". L'aire vaut " + M("A(x) = x \\cdot y") + ".", "A(x) est une fonction du 2e degré : son maximum est au sommet, au milieu de ses zéros."],
M("A(x) = x\\left(" + b + " - \\frac{" + b + "}{" + a + "}x\\right)") + " s'annule en 0 et en " + a + " : sommet en " + M("x = " + N(a / 2)) + ". b) " + M("y = " + b + " - \\frac{" + b + "}{" + a + "} \\cdot " + N(a / 2) + " = " + N(b / 2)) + ". c) " + M(N(a / 2) + " \\cdot " + N(b / 2) + " = " + N((a * b) / 4)) + " (le quart du triangle formé avec les axes, doublé).");
});


PX("arith", { co: [12], mp: [12] }, () => {
let g, m, n; do { g = ri(12, 48); m = ri(5, 17); n = ri(5, 17); } while (gcd(m, n) !== 1 || m === n);
const a = g * Math.max(m, n), b = g * Math.min(m, n), L = (a * b) / g;

return PB("On veut carreler sans découpe une salle rectangulaire de " + X(a) + " cm sur " + X(b) + " cm avec des carreaux carrés identiques, les plus grands possible. Les carreaux sont vendus par boîtes de 10.",
[["a) Côté des carreaux, en cm (algorithme d'Euclide conseillé)", g], ["b) Nombre de carreaux", m * n], ["c) Nombre de boîtes à acheter, au minimum", Math.ceil((m * n) / 10)]],
["Euclide : PGDC(a ; b) = PGDC(b ; reste de a ÷ b), jusqu'au reste nul.", "c) Il faut au moins le nombre de carreaux : on arrondit à la boîte supérieure."],
"a) PGDC(" + a + " ; " + b + ") = " + g + " cm. b) " + M((a / g) + " \\cdot " + (b / g) + " = " + m * n) + " carreaux. c) " + M(m * n + " \\div 10") + " arrondi à l'unité supérieure : " + Math.ceil((m * n) / 10) + " boîtes.");
});

PX("fracper", { co: [12] }, () => {
let a, per; do { a = ri(1, 9); per = ri(101, 998); } while (per % 111 === 0);
const num0 = a * 999 + per, den0 = 9990, g = gcd(num0, den0), P = String(per).padStart(3, "0");
return PB("On considère " + M("x = 0{,}" + a + "\\overline{" + P + "}") + " (le groupe " + P + " se répète indéfiniment).",
[["a) Que vaut " + M("10\\,000x - 10x") + " ?", num0], ["b) Numérateur de " + M("x") + " sous forme irréductible", num0 / g], ["c) Dénominateur", den0 / g]],
["Multiplie par 10 pour placer la période juste après la virgule, puis par 10'000 pour la décaler d'une période entière.", "Simplifie par le PGDC du numérateur et de 9'990."],
M("10\\,000x = " + a + P + "{,}\\overline{" + P + "}") + ", " + M("10x = " + a + "{,}\\overline{" + P + "}") + " ; " + M("9\\,990x = " + N(num0)) + " ; " + M("x = \\frac{" + N(num0) + "}{9\\,990} = \\frac{" + N(num0 / g) + "}{" + N(den0 / g) + "}") + " (PGDC " + g + ").");
});

PX("premiers", { mp: [12] }, () => {
const a = ri(2, 5), b = ri(1, 4), c = ri(1, 2), n = 2 ** a * 3 ** b * 5 ** c, cube = 2 ** ((3 - (a % 3)) % 3) * 3 ** ((3 - (b % 3)) % 3) * 5 ** ((3 - (c % 3)) % 3);
const m = 2 ** pk([1, 2]) * 3 ** pk([2, 3]) * 7, g = gcd(n, m);
return PB("On considère " + M("n = " + N(n)) + " et " + M("m = " + N(m)) + ".",
[["a) Nombre de diviseurs de " + M("n"), (a + 1) * (b + 1) * (c + 1)], ["b) Plus petit entier " + M("k") + " tel que " + M("n \\cdot k") + " soit un cube parfait", cube], ["c) PGDC(" + M("n") + " ; " + M("m") + ")", g]],
["Décompose n en facteurs premiers. Un diviseur choisit un exposant pour chaque facteur premier, de 0 au maximum.", "Un cube : chaque exposant est un multiple de 3. PGDC : facteurs communs, avec le plus petit exposant."],
M("n = 2^{" + a + "} \\cdot 3^{" + b + "} \\cdot 5^{" + c + "}") + ". a) " + M("(" + (a + 1) + ")(" + (b + 1) + ")(" + (c + 1) + ") = " + (a + 1) * (b + 1) * (c + 1)) + ". b) Exposants à compléter jusqu'au multiple de 3 suivant : " + M("k = " + N(cube)) + ". c) " + M("m = " + m.toString()) + " ; PGDC " + M("= " + g) + ".");
});

PX("rac", { mp: [12] }, () => {
let p, m, q, nn; do { p = pk([2, 3, 4, 5, 6]); m = pk([2, 3, 5, 6, 7]); q = pk([3, 5, 7, 11]); nn = pk([2, 3, 5]); } while (q === m || nn === m || q * q === m);
const A = p * p * m, prod = 4 * m - nn, bb = pk([[7, 5], [11, 7], [13, 11], [10, 6], [8, 6]]);
return PB("Calcul avec des racines carrées (sans calculatrice).",
[["a) " + M("\\sqrt{" + A + "}") + " s'écrit " + M("a\\sqrt{" + m + "}") + " : que vaut " + M("a") + " ?", p], ["b) " + M("(2\\sqrt{" + m + "} + \\sqrt{" + nn + "})(2\\sqrt{" + m + "} - \\sqrt{" + nn + "})") + " = ?", prod], ["c) " + M("\\frac{1}{\\sqrt{" + bb[0] + "} - \\sqrt{" + bb[1] + "}} = \\frac{\\sqrt{" + bb[0] + "} + \\sqrt{" + bb[1] + "}}{d}") + " : que vaut " + M("d") + " ?", bb[0] - bb[1]]],
["a) Cherche le plus grand carré qui divise " + A + ".", "b) Identité (u + v)(u − v) = u² − v². c) Multiplie haut et bas par la quantité conjuguée."],
"a) " + M("\\sqrt{" + A + "} = \\sqrt{" + p * p + " \\cdot " + m + "} = " + p + "\\sqrt{" + m + "}") + ". b) " + M("(2\\sqrt{" + m + "})^2 - (\\sqrt{" + nn + "})^2 = " + 4 * m + " - " + nn + " = " + prod) + ". c) " + M("(\\sqrt{" + bb[0] + "} - \\sqrt{" + bb[1] + "})(\\sqrt{" + bb[0] + "} + \\sqrt{" + bb[1] + "}) = " + bb[0] + " - " + bb[1] + " = " + (bb[0] - bb[1])) + ".");
});
})();






(() => {
if (typeof PROBX === "undefined") return;
const ri = R.int, pk = R.pick, r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
const T = (v) => { const s = String(r6(v)), [i, f] = s.split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : i) + (f ? "," + f : ""); };
const CH = (v) => Number.isInteger(r6(v)) ? N(v) : N(Math.trunc(r6(v))) + "{,}" + Math.abs(r6(v)).toFixed(2).split(".")[1], CHT = (v) => CH(v).replace("{,}", ",").replace(/\\text\{'\}/g, "'");
const X = (v) => M(N(v)), r1 = (v) => Math.round(+(v * 10).toPrecision(12)) / 10;
const C11 = { co: [11] };
const PX = (id, ctx, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), C11, { ctx })); };
const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: Object.assign({ kind: "value", value: Math.abs(v - r6(v)) < 1e-9 ? r6(v) : v  }, rd ? { round: rd } : {}) })) });
const gcd = (a, b) => (b ? gcd(b, a % b) : a), fr = (a, b) => { const g = gcd(a, b); return "\\frac{" + a / g + "}{" + b / g + "}"; };


PX("volcone", "silo", () => {
const r = pk([2, 2.5, 3, 3.5]), H = pk([6, 7, 8, 10]), h = pk([1.5, 2, 2.5]), rho = pk([0.75, 0.8]), grain = rho === 0.75 ? "blé" : "maïs";
const Vcy = Math.PI * r * r * H, Vco = (Math.PI * r * r * h) / 3, Vt = Vcy + Vco, m = rho * Vt;
return PB("Un silo à grains est formé d'un cylindre de " + X(r) + " m de rayon et " + X(H) + " m de hauteur, surmonté d'un toit en forme de cône de même rayon et de " + X(h) + " m de hauteur. On le remplit entièrement de " + grain + " ; " + M("1 \\text{ m}^3") + " de " + grain + " pèse " + X(rho) + " tonne.",
[["a) Volume de la partie cylindrique (m³, au dixième)", Vcy, 0.1], ["b) Volume du cône (m³, au dixième)", Vco, 0.1], ["c) Volume total du silo (m³, au dixième)", Vt, 0.1], ["d) Masse de " + grain + " stockée (t, au dixième)", m, 0.1]],
["a) Cylindre : aire du disque de base × hauteur, π · r² · H.", "b) Cône : le tiers du cylindre de même base et même hauteur, π · r² · h ÷ 3.", "c) Additionne les deux volumes non arrondis.", "d) Chaque m³ pèse " + T(rho) + " t : multiplie le volume total par " + T(rho) + "."],
"a) " + M("\\pi \\cdot " + N(r) + "^2 \\cdot " + N(H) + " \\approx " + N(r1(Vcy))) + " m³. b) " + M("\\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + "}{3} \\approx " + N(r1(Vco))) + " m³. c) " + M("V \\approx " + N(r1(Vt))) + " m³. d) " + M(N(rho) + " \\cdot " + N(r1(Vt)) + " \\approx " + N(r1(m))) + " t.");
});


PX("gquot", "piscine", () => {
const L = pk([8, 10, 12]), l = pk([4, 5, 6]), p = pk([1.2, 1.5]), D = pk([40, 50, 60]), Th = pk([4, 5, 6]);
const V = L * l * p, t = (V * 1000) / D / 60, Q = V / Th, Qm = (Q * 1000) / 60;
return PB("Une piscine en forme de pavé mesure " + X(L) + " m de long, " + X(l) + " m de large et " + X(p) + " m de profondeur. On la remplit au robinet, qui débite " + X(D) + " litres par minute. Ensuite, la pompe de filtration doit faire passer toute l'eau de la piscine en " + Th + " heures.",
[["a) Volume d'eau de la piscine pleine (m³)", V], ["b) Durée du remplissage (h, au dixième)", t, 0.1], ["c) Débit de la pompe de filtration (m³/h, au dixième)", Q, 0.1], ["d) Ce même débit en litres par minute (L/min, à l'unité)", Qm, 1]],
["a) Volume d'un pavé : longueur · largeur · profondeur.", "b) 1 m³ = 1'000 L : convertis, divise par le débit pour obtenir des minutes, puis passe en heures (÷ 60).", "c) Débit = volume ÷ durée.", "d) 1 m³ = 1'000 L et 1 h = 60 min : multiplie par 1'000, puis divise par 60."],
"a) " + M(N(L) + " \\cdot " + N(l) + " \\cdot " + N(p) + " = " + N(V)) + " m³. b) " + M(N(V * 1000) + " \\text{ L} \\div " + D + " = " + N(r6(V * 1000 / D)) + " \\text{ min}" + (r6(t) === r1(t) ? " = " : " \\approx ") + N(r1(t)) + " \\text{ h}") + ". c) " + M(N(V) + " \\div " + Th + " = " + N(r6(Q)) + (r6(Q) === r1(Q) ? "" : " \\approx " + N(r1(Q)))) + " m³/h. d) " + M(N(r6(Q)) + " \\cdot 1\\text{'}000 \\div 60" + (r6(Qm) === Math.round(Qm) ? " = " : " \\approx ") + Math.round(Qm)) + " L/min.");
});


PX("proba", "bonbons", () => {
let f, c, m; do { f = ri(3, 7); c = ri(2, 6); m = ri(2, 5); } while (f === c || c === m || f === m);
const n = f + c + m, d = n * (n - 1), pff = (f * (f - 1)) / d, same = (f * (f - 1) + c * (c - 1) + m * (m - 1)) / d, noM = ((n - m) * (n - m - 1)) / d;
const who = pk(["Léa", "Noé", "Inès", "Yanis"]);
return PB("Une boîte contient " + M(f) + " bonbons à la fraise, " + M(c) + " au citron et " + M(m) + " à la menthe, tous emballés de la même façon. " + who + " en prend un au hasard, le mange, puis en prend un deuxième au hasard. (fractions acceptées)",
[["a) Probabilité que le premier bonbon soit à la fraise", f / n], ["b) Probabilité que les deux bonbons soient à la fraise", pff], ["c) Probabilité que les deux bonbons aient le même parfum", same], ["d) Probabilité d'avoir au moins un bonbon à la menthe", 1 - noM]],
["a) Cas favorables sur cas possibles : il y a " + n + " bonbons en tout.", "b) Arbre à deux étages : après le premier bonbon, il en reste " + (n - 1) + ", et un de moins du parfum mangé ; multiplie les probabilités le long d'une branche.", "c) Même parfum : deux fraises OU deux citrons OU deux menthes, additionne les trois branches.", "d) Le contraire de « au moins une menthe » est « aucune menthe » : calcule-le, puis fais 1 moins ce résultat."],
"a) " + M("\\frac{" + f + "}{" + n + "}" + (gcd(f, n) > 1 ? " = " + fr(f, n) : "")) + ". b) " + M("\\frac{" + f + "}{" + n + "} \\cdot \\frac{" + (f - 1) + "}{" + (n - 1) + "} = " + fr(f * (f - 1), d)) + ". c) " + M("\\frac{" + f * (f - 1) + " + " + c * (c - 1) + " + " + m * (m - 1) + "}{" + d + "} = " + fr(f * (f - 1) + c * (c - 1) + m * (m - 1), d)) + ". d) Aucune menthe : " + M("\\frac{" + (n - m) + "}{" + n + "} \\cdot \\frac{" + (n - m - 1) + "}{" + (n - 1) + "} = " + fr((n - m) * (n - m - 1), d)) + ", donc " + M("1 - " + fr((n - m) * (n - m - 1), d) + " = " + fr(d - (n - m) * (n - m - 1), d)) + ".");
});


PX("formule", "taxi", () => {
let a, b, a2, b2, d1, P2, de; do { a = pk([5, 6, 6.5, 7]); b = pk([2.5, 3, 3.2, 3.5]); a2 = a + pk([4, 5, 6, 8]); b2 = b - pk([0.5, 0.8, 1]); d1 = ri(6, 15); de = (a2 - a) / (b - b2); P2 = a + b * ri(9, 25); }
while (!Number.isInteger(de * 2) || de < 3 || de > 30 || r6(b2) <= 0);
const dP = (P2 - a) / b;
return PB("Le taxi A calcule son prix avec la formule " + M("P = " + N(a) + " + " + N(b) + "d") + " (" + M("P") + " en CHF, " + M("d") + " en km). Le taxi B, plus cher au départ, applique " + M("P = " + N(a2) + " + " + N(r6(b2)) + "d") + ". Maëlle doit choisir son taxi pour rentrer chez elle.",
[["a) Prix d'une course de " + d1 + " km avec le taxi A (CHF)", a + b * d1, 0.01], ["b) Distance parcourue avec le taxi A pour " + CHT(P2) + " CHF (km)", dP, 0.01], ["c) Distance pour laquelle les deux taxis coûtent le même prix (km)", de, 0.01], ["d) Prix de cette course, le même avec les deux taxis (CHF)", a + b * de, 0.01]],
["a) Remplace d par " + d1 + " dans la formule du taxi A.", "b) Transforme la formule pour isoler d : d = (P − " + T(a) + ") ÷ " + T(b) + ".", "c) Écris que les deux prix sont égaux : " + T(a) + " + " + T(b) + "d = " + T(a2) + " + " + T(r6(b2)) + "d, puis résous en d.", "d) Remplace d par la distance trouvée juste avant, dans l'une des deux formules."],
"a) " + M("P = " + N(a) + " + " + N(b) + " \\cdot " + d1 + " = " + CH(a + b * d1)) + " CHF. b) " + M("d = \\frac{P - " + N(a) + "}{" + N(b) + "} = \\frac{" + CH(P2) + " - " + N(a) + "}{" + N(b) + "} = " + N(r6(dP))) + " km. c) " + M(N(a) + " + " + N(b) + "d = " + N(a2) + " + " + N(r6(b2)) + "d" + (r6(b - b2) === 1 ? "" : " \\iff " + N(r6(b - b2)) + "d = " + N(r6(a2 - a))) + " \\iff d = " + N(de)) + " km. d) " + M("P = " + N(a) + " + " + N(b) + " \\cdot " + N(de) + " = " + CH(a + b * de)) + " CHF.");
});
})();








(() => {
if (typeof PROBX === "undefined") return;
const ri = R.int, pk = R.pick, r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
const T = (v) => { const s = String(r6(v)), [i, f] = s.split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : i) + (f ? "," + f : ""); };
const X = (v) => M(N(v));
const rd = (v, d) => r6(Math.round(v / d + 1e-9) * d), AP = (v, d) => (Math.abs(rd(v, d) - v) < 1e-9 ? " = " : " \\approx ") + N(rd(v, d));
const CH = (v) => { const c = rd(v, 0.01); return Number.isInteger(c) ? N(c) : N(Math.trunc(c)) + "{,}" + c.toFixed(2).split(".")[1]; };
const C11 = { co: [11] }, C12 = { co: [12] };
const PX = (id, cl, ctx, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), cl, { ctx })); };
const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, d]) => ({ label, spec: Object.assign({ kind: "value", value: Math.abs(v - r6(v)) < 1e-9 ? r6(v) : v }, d ? { round: d } : {}) })) });
const gcd = (a, b) => (b ? gcd(b, a % b) : a), fr = (a, b) => { const g = gcd(a, b); return b / g === 1 ? String(a / g) : "\\frac{" + a / g + "}{" + b / g + "}"; };
const DEG = Math.PI / 180, frac = (v) => v - Math.floor(v), mid = (v) => Math.abs(frac(v) - 0.5) < 0.15;





PX("gquot", C11, "aquarium", () => {
let L, l, h, q, vide, S, V, hw;
do { L = pk([60, 80, 100, 120]); l = pk([30, 35, 40, 50]); h = pk([40, 45, 50, 60]); q = pk([5, 6, 8, 10]); vide = pk([18, 23, 27, 35]); S = pk([120, 150, 180, 200, 250]);
V = (L * l * h) / 1000; hw = ((S - vide) * 1000) / (L * l); } while (!(V + vide > S + 10 && hw > 0.5 * h && hw < h - 3 && frac(hw) > 0.05 && frac(hw) < 0.95) || mid((V / q) * 10));
const hf = Math.floor(hw);
return PB("Un aquarium en forme de pavé droit mesure " + X(L) + " cm de long, " + X(l) + " cm de large et " + X(h) + " cm de haut ; vide, il pèse " + X(vide) + " kg. On le remplit avec un tuyau qui débite " + X(q) + " litres par minute. Un litre d'eau pèse 1 kg.",
[["a) Volume de l'aquarium plein (L)", V], ["b) Durée du remplissage (min, au dixième)", V / q, 0.1], ["c) Masse de l'aquarium plein d'eau (kg)", V + vide], ["d) Le meuble qui le porte supporte au plus " + S + " kg. Hauteur d'eau maximale (cm, arrondie au centimètre inférieur)", hf]],
["a) Volume d'un pavé : longueur · largeur · hauteur, en cm³ ; 1 L = 1 dm³ = 1'000 cm³.", "b) Durée = volume ÷ débit.", "c) Ajoute la masse de l'eau (1 L pèse 1 kg) à celle de l'aquarium vide.", "d) Masse d'eau permise : " + S + " kg moins la masse de l'aquarium vide, soit autant de litres ; hauteur d'eau = volume (en cm³) ÷ aire du fond (en cm²)."],
"a) " + M(L + " \\cdot " + l + " \\cdot " + h + " = " + N(L * l * h)) + " cm³ = " + X(V) + " L. b) " + M(N(V) + " \\div " + q + AP(V / q, 0.1)) + " min. c) " + M(N(V) + " + " + vide + " = " + N(V + vide)) + " kg : c'est plus que les " + S + " kg permis. d) Eau permise : " + M(S + " - " + vide + " = " + (S - vide)) + " kg, soit " + M(N((S - vide) * 1000)) + " cm³ ; " + M("h = " + N((S - vide) * 1000) + " \\div (" + L + " \\cdot " + l + ")" + AP(hw, 0.01)) + " cm : au plus " + hf + " cm d'eau.");
});


PX("gquot", C11, "pirate", () => {
let d, e, met, V, m, rho;
do { d = pk([22, 24, 26, 30]); e = pk([1.5, 1.8, 2, 2.2]); met = pk([["du laiton", 8.5], ["de l'argent", 10.5], ["du plomb", 11.3]]);
V = Math.PI * (d / 20) ** 2 * (e / 10); m = rd(met[1] * V, 0.1); rho = m / V; }
while (rd(rho, 0.1) !== rd(m / rd(V, 0.01), 0.1) || rd(19.3 * V, 0.1) !== rd(19.3 * rd(V, 0.01), 0.1) || mid(rho * 10) || mid(V * 100) || Math.abs(rd(rho, 0.1) - met[1]) > 0.15);
return PB("Bob le pirate a trouvé des pièces qui ont l'air d'être en or. Une pièce est un cylindre de " + X(d) + " mm de diamètre et de " + X(e) + " mm d'épaisseur. L'or a une masse volumique de " + M("19{,}3") + " g/cm³.",
[["a) Rayon de la pièce (cm)", d / 20], ["b) Volume de la pièce (cm³, au centième)", V, 0.01], ["c) Masse qu'elle aurait si elle était en or massif (g, au dixième)", 19.3 * V, 0.1], ["d) Sur la balance, la pièce pèse " + T(m) + " g. Masse volumique de son métal (g/cm³, au dixième)", rho, 0.1]],
["a) 10 mm = 1 cm ; le rayon est la moitié du diamètre.", "b) Cylindre très plat : V = π · r² · h, avec l'épaisseur h en cm.", "c) Masse = masse volumique · volume.", "d) Masse volumique = masse ÷ volume ; compare avec celle de l'or."],
"a) " + M(d + " \\text{ mm} = " + N(d / 10) + " \\text{ cm}") + ", rayon " + X(d / 20) + " cm. b) " + M("\\pi \\cdot " + N(d / 20) + "^2 \\cdot " + N(e / 10) + AP(V, 0.01)) + " cm³. c) " + M("19{,}3 \\cdot " + N(rd(V, 0.01)) + AP(19.3 * V, 0.1)) + " g. d) " + M(N(m) + " \\div " + N(rd(V, 0.01)) + AP(rho, 0.1)) + " g/cm³, bien moins que 19,3 : ce n'est pas de l'or (c'est proche de la masse volumique " + met[0] + ", " + T(met[1]) + " g/cm³).");
});


PX("ucomp", C11, "guepard", () => {
let g, a, D, va, t;
do { g = pk([28, 29, 30, 31]); a = pk([72, 75, 80, 85, 90]); D = pk([30, 40, 50, 60]); va = a / 3.6; t = D / (g - va); }
while (!(t >= 4 && t <= 20) || rd(t, 0.1) !== rd(D / (g - rd(va, 0.1)), 0.1) || rd(5 * (g - va), 0.1) !== rd(5 * (g - rd(va, 0.1)), 0.1) || mid(va * 10) || mid(t * 10));
return PB("Un guépard court à " + X(g) + " m/s. Il poursuit une antilope qui court à " + X(a) + " km/h et qui a " + X(D) + " m d'avance. Les deux gardent leur vitesse.",
[["a) Vitesse de l'antilope (m/s, au dixième)", va, 0.1], ["b) Vitesse du guépard (km/h)", g * 3.6], ["c) Mètres gagnés par le guépard en 5 s (m, au dixième)", 5 * (g - va), 0.1], ["d) Après combien de secondes le guépard rattrape-t-il l'antilope ? (s, au dixième)", t, 0.1]],
["a) km/h → m/s : divise par 3,6.", "b) m/s → km/h : multiplie par 3,6.", "c) Chaque seconde, le guépard gagne la différence des deux vitesses (en m/s).", "d) Durée = avance à combler ÷ mètres gagnés en une seconde."],
"a) " + M(a + " \\div 3{,}6" + AP(va, 0.1)) + " m/s. b) " + M(g + " \\cdot 3{,}6 = " + N(g * 3.6)) + " km/h. c) " + M("(" + g + " - " + N(rd(va, 0.1)) + ") \\cdot 5" + AP(5 * (g - va), 0.1)) + " m. d) Il gagne " + M(N(rd(g - va, 0.01))) + " m par seconde : " + M(D + " \\div " + N(rd(g - va, 0.01)) + AP(t, 0.1)) + " s.");
});


PX("gquot", C11, "voiture", () => {
let c, B, p, d, P; do { c = pk([15, 16, 17, 18]); B = pk([50, 60, 75]); p = pk([0.25, 0.3, 0.35]); d = pk([240, 280, 320, 360]); P = pk([11, 22]); } while (mid((B * 100) / c) || mid((6 * B) / P));
const E = (d * c) / 100, cost = E * p, aut = (B * 100) / c, tr = (0.6 * B) / P;
return PB("Une voiture électrique consomme " + X(c) + " kWh pour 100 km. Sa batterie pleine contient " + X(B) + " kWh. À la maison, le kWh d'électricité coûte " + X(p) + " CHF.",
[["a) Énergie consommée pour un trajet de " + d + " km (kWh)", E], ["b) Prix de cette énergie, rechargée à la maison (CHF, au centime)", cost, 0.01], ["c) Distance qu'elle peut parcourir avec la batterie pleine (km, à l'unité)", aut, 1], ["d) Une borne de " + P + " kW fournit " + P + " kWh par heure. Durée pour recharger la batterie de 20 % à 80 % (h, au dixième)", tr, 0.1]],
["a) " + c + " kWh pour 100 km : divise par 100 pour 1 km, puis multiplie par la distance.", "b) Prix = énergie · prix d'un kWh.", "c) Distance = énergie de la batterie ÷ consommation d'un kilomètre.", "d) De 20 % à 80 %, il faut 60 % de la batterie ; durée = énergie ÷ énergie fournie en une heure."],
"a) " + M(N(d) + " \\cdot \\frac{" + c + "}{100} = " + N(E)) + " kWh. b) " + M(N(E) + " \\cdot " + N(p) + AP(cost, 0.01)) + " CHF. c) " + M(B + " \\div \\frac{" + c + "}{100} = " + B + " \\cdot 100 \\div " + c + AP(aut, 1)) + " km. d) " + M("0{,}6 \\cdot " + B + " = " + N(0.6 * B)) + " kWh ; " + M(N(0.6 * B) + " \\div " + P + AP(tr, 0.1)) + " h.");
});



PX("parenth", C11, "decoupe", () => {
let w1, w2, a, b, x0, x1; do { w1 = pk([6, 7, 8, 9]); w2 = pk([2, 3]); a = ri(2, 6); b = ri(1, 3); x0 = ri(8, 14); x1 = ri(15, 30); } while (w1 - w2 < 3);
const k = w1 - w2, c = w1 * a + w2 * b, E0 = k * x0 + c, T1 = k * x1 + c;
return PB("Dans une plaque rectangulaire de " + X(w1) + " cm sur " + M("(x + " + a + ")") + " cm, on découpe une fente rectangulaire de " + X(w2) + " cm sur " + M("(x - " + b + ")") + " cm. L'aire qui reste vaut " + M("E = " + w1 + "(x + " + a + ") - " + w2 + "(x - " + b + ")") + " (en cm², " + M("x") + " en cm).",
[["a) Coefficient de " + M("x") + " dans " + M("E") + " réduite", k], ["b) Terme constant de " + M("E") + " réduite", c], ["c) Aire qui reste pour " + M("x = " + x0) + " (cm²)", E0], ["d) Valeur de " + M("x") + " pour laquelle il reste " + T1 + " cm²", x1]],
["a) Distribue " + w1 + " et −" + w2 + " : le signe − devant la deuxième parenthèse change le signe de chacun de ses termes.", "b) Regroupe les nombres sans x ; attention, −" + w2 + " · (−" + b + ") est positif.", "c) Remplace x par " + x0 + " dans E réduite.", "d) Écris « E réduite = " + T1 + " » et résous cette équation du 1er degré."],
M("E = " + w1 + "x + " + w1 * a + " - " + w2 + "x + " + w2 * b + " = " + k + "x + " + c) + ". a) " + k + ". b) " + c + ". c) " + M(k + " \\cdot " + x0 + " + " + c + " = " + E0) + " cm². d) " + M(k + "x + " + c + " = " + T1 + " \\iff " + k + "x = " + (T1 - c) + " \\iff x = " + x1) + " cm.");
});


PX("idrem", C11, "carre", () => {
let c, k; do { c = ri(12, 30); k = ri(2, 5); } while (4 * k >= c);
const A = c * c - k * k, A2 = c * c - 4 * k * k;
return PB("On transforme un carré en rectangle : un côté est allongé de " + X(k) + " cm, l'autre est raccourci de " + X(k) + " cm. Le rectangle obtenu a une aire de " + X(A) + " cm².",
[["a) De combien l'aire a-t-elle diminué ? (cm²)", k * k], ["b) Côté du carré (cm)", c], ["c) Périmètre du rectangle (cm)", 4 * c], ["d) Si l'on allonge un côté du carré de " + 2 * k + " cm et qu'on raccourcit l'autre de " + 2 * k + " cm, aire du rectangle obtenu (cm²)", A2]],
["a) Si le côté vaut c, le rectangle mesure (c + " + k + ")(c − " + k + ") : identité (u + v)(u − v) = u² − v².", "b) Aire du carré = aire du rectangle + la diminution ; le côté est la racine carrée de cette aire.", "c) Le rectangle mesure (c + " + k + ") sur (c − " + k + ") : additionne longueur et largeur, puis double.", "d) Même identité, avec " + 2 * k + " à la place de " + k + "."],
"a) " + M("(c + " + k + ")(c - " + k + ") = c^2 - " + k * k) + " : l'aire a diminué de " + k * k + " cm². b) " + M("c^2 = " + A + " + " + k * k + " = " + c * c) + ", " + M("c = " + c) + " cm. c) " + M("2 \\cdot (" + (c + k) + " + " + (c - k) + ") = " + 4 * c) + " cm (le même que le carré). d) " + M((c + 2 * k) + " \\cdot " + (c - 2 * k) + " = " + c * c + " - " + 4 * k * k + " = " + A2) + " cm².");
});


PX("formule", C11, "energie", () => {
let m, vk, M2, f, v, E, v2; do { m = pk([70, 75, 80, 85, 90]); vk = pk([18, 27, 36]); M2 = pk([50, 55, 60]); f = pk([1.5, 2]); v = vk / 3.6; E = (m * v * v) / 2; v2 = Math.sqrt((2 * E) / M2); }
while (vk * f > 54 || v2 > 9 || rd(v2, 0.1) !== rd(Math.sqrt((2 * rd(E, 1)) / M2), 0.1) || mid(v2 * 10) || mid(E));
return PB("L'énergie cinétique d'un objet vaut " + M("E = \\frac{m v^2}{2}") + " (" + M("E") + " en J, " + M("m") + " en kg, " + M("v") + " en m/s). Un cycliste et son vélo ont une masse de " + X(m) + " kg et roulent à " + X(vk) + " km/h.",
[["a) Vitesse du cycliste (m/s)", v], ["b) Énergie cinétique du cycliste (J, à l'unité)", E, 1], ["c) Vitesse d'une coureuse de " + M2 + " kg qui aurait la même énergie cinétique (m/s, au dixième)", v2, 0.1], ["d) Par combien l'énergie du cycliste est-elle multipliée s'il roule à " + T(vk * f) + " km/h ?", f * f]],
["a) km/h → m/s : divise par 3,6.", "b) Remplace m et v (en m/s) dans la formule ; calcule d'abord v².", "c) Isole v : v² = 2E ÷ m, puis v = √(2E ÷ m), avec la masse de la coureuse.", "d) Calcule le rapport des deux vitesses ; quel effet a-t-il sur v² ?"],
"a) " + M(vk + " \\div 3{,}6 = " + N(v)) + " m/s. b) " + M("E = \\frac{" + m + " \\cdot " + N(v) + "^2}{2}" + AP(E, 1)) + " J. c) " + M("v = \\sqrt{\\frac{2 \\cdot " + N(rd(E, 1)) + "}{" + N(M2) + "}}" + AP(v2, 0.1)) + " m/s. d) La vitesse est multipliée par " + X(f) + ", donc " + M("v^2") + " et l'énergie par " + M(N(f) + "^2 = " + N(f * f)) + ".");
});


PX("factor", C11, "allee", () => {
let a, x0, x1; do { a = pk([1, 1.5, 2, 2.5]); x0 = ri(4, 10); x1 = ri(5, 14); } while (x1 === x0);
const k = 4 * a, A0 = k * (x0 + a), T1 = k * (x1 + a), nd = A0 / 0.25;
return PB("Un bassin carré de " + M("x") + " m de côté est entouré d'une allée de " + X(a) + " m de large. L'aire de l'allée vaut " + M("A = (x + " + N(2 * a) + ")^2 - x^2") + " (en m²).",
[["a) En factorisant, " + M("A") + " s'écrit " + M("k(x + " + N(a) + ")") + " : que vaut " + M("k") + " ?", k], ["b) Aire de l'allée pour " + M("x = " + x0) + " (m²)", A0], ["c) Côté du bassin si l'allée a une aire de " + T(T1) + " m² (m)", x1], ["d) On pave l'allée avec des dalles carrées de 50 cm de côté. Nombre de dalles pour " + M("x = " + x0), nd]],
["a) Différence de deux carrés : u² − v² = (u − v)(u + v), avec u = x + " + T(2 * a) + " et v = x ; réduis chaque facteur, puis mets en évidence.", "b) Remplace x par " + x0 + " dans la forme factorisée (c'est plus rapide).", "c) Écris « k(x + " + T(a) + ") = " + T(T1) + " » : divise par k, puis soustrais " + T(a) + ".", "d) Une dalle couvre 0,5 · 0,5 m² ; divise l'aire de l'allée par l'aire d'une dalle."],
"a) " + M("(x + " + N(2 * a) + " - x)(x + " + N(2 * a) + " + x) = " + N(2 * a) + "(2x + " + N(2 * a) + ") = " + N(k) + "(x + " + N(a) + ")") + ", donc " + M("k = " + N(k)) + ". b) " + M(N(k) + " \\cdot " + N(x0 + a) + " = " + N(A0)) + " m². c) " + M(N(k) + "(x + " + N(a) + ") = " + N(T1) + " \\iff x + " + N(a) + " = " + N(x1 + a) + " \\iff x = " + x1) + " m. d) " + M(N(A0) + " \\div 0{,}25 = " + N(nd)) + " dalles.");
});



PX("eq2fact", C11, "fusee", () => {
const [t1, t2] = pk([[2, 3], [2, 4], [2, 5], [3, 4], [3, 5]]), v = 5 * (t1 + t2), H = 5 * t1 * t2, Tv = v / 5, hm = (v * v) / 20, dT = pk([1, 2]), v3 = 5 * (Tv + dT);
return PB("Une fusée à eau est lancée verticalement depuis le sol. Sa hauteur vaut " + M("h(t) = " + v + "t - 5t^2") + " (" + M("h") + " en m, " + M("t") + " en s).",
[["a) Durée du vol, jusqu'au retour au sol (s)", Tv], ["b) Premier instant où la fusée est à " + H + " m de hauteur (s)", t1], ["c) Hauteur maximale atteinte (m)", hm], ["d) Une autre fusée suit " + M("h(t) = vt - 5t^2") + " et reste en l'air " + dT + " s de plus. Que vaut " + M("v") + " ? (m/s)", v3]],
["a) Au sol, h(t) = 0 : mets t en évidence, puis utilise le produit nul.", "b) Écris " + v + "t − 5t² = " + H + ", ramène tout du même côté, divise par −5 et factorise le trinôme (somme et produit) ; garde la plus petite solution.", "c) Par symétrie, la fusée est au plus haut au milieu du vol : remplace t par cet instant.", "d) Comme au a), la durée du vol vaut v ÷ 5 : écris que cette durée vaut celle de la première fusée plus " + dT + " s."],
"a) " + M("t(" + v + " - 5t) = 0") + " : " + M("t = 0") + " ou " + M("t = " + N(Tv)) + " s. b) " + M("5t^2 - " + v + "t + " + H + " = 0 \\iff t^2 - " + (t1 + t2) + "t + " + t1 * t2 + " = 0 \\iff (t - " + t1 + ")(t - " + t2 + ") = 0") + " : " + M("t = " + t1) + " s (puis " + t2 + " s en redescendant). c) " + M("h(" + N(Tv / 2) + ") = " + v + " \\cdot " + N(Tv / 2) + " - 5 \\cdot " + N(Tv / 2) + "^2 = " + N(hm)) + " m. d) " + M("\\frac{v}{5} = " + N(Tv) + " + " + dT + " = " + N(Tv + dT)) + ", donc " + M("v = " + N(v3)) + " m/s.");
});


PX("probeq2", C11, "carre", () => {
const c = pk([10, 12, 14, 15, 16, 18, 20]), x = ri(2, 6), D = 2 * c * x + x * x, y = c * (Math.SQRT2 - 1);
return PB("On agrandit un carré de " + X(c) + " cm de côté en allongeant chaque côté de " + M("x") + " cm. Son aire augmente alors de " + X(D) + " cm².",
[["a) Aire du nouveau carré (cm²)", c * c + D], ["b) Allongement " + M("x") + " (cm)", x], ["c) Périmètre du nouveau carré (cm)", 4 * (c + x)], ["d) De combien faudrait-il allonger chaque côté du carré de départ pour que son aire double ? (cm, au dixième)", y, 0.1]],
["a) Aire du carré de départ (côté · côté), plus l'augmentation.", "b) (" + c + " + x)² vaut l'aire du nouveau carré : développe et résous, ou prends la racine carrée (x > 0).", "c) Nouveau côté = " + c + " + x ; un carré a quatre côtés égaux.", "d) Aire doublée : (" + c + " + y)² = 2 · " + c + "² ; prends la racine carrée des deux membres."],
"a) " + M(c + "^2 + " + D + " = " + (c * c + D)) + " cm². b) " + M("(" + c + " + x)^2 = " + (c * c + D) + " \\iff " + c + " + x = " + (c + x)) + ", " + M("x = " + x) + " cm. c) " + M("4 \\cdot " + (c + x) + " = " + 4 * (c + x)) + " cm. d) " + M("(" + c + " + y)^2 = " + 2 * c * c + " \\iff " + c + " + y = \\sqrt{" + 2 * c * c + "} = " + c + "\\sqrt{2}") + ", " + M("y = " + c + "(\\sqrt{2} - 1)" + AP(y, 0.1)) + " cm.");
});


PX("probeq2", C11, "cadre", () => {
const [w, h] = pk([[20, 15], [24, 18], [30, 20], [30, 24], [40, 30]]), x = pk([2, 2.5, 3, 4, 5]), A = (w + 2 * x) * (h + 2 * x), P = 2 * (w + h + 4 * x), A2 = (w + 4 * x) * (h + 4 * x) - w * h;
return PB("Une photo de " + X(w) + " cm sur " + X(h) + " cm est entourée d'un cadre de largeur constante " + M("x") + " cm. L'ensemble (photo et cadre) a une aire de " + X(A) + " cm².",
[["a) Aire du cadre seul (cm²)", A - w * h], ["b) Largeur " + M("x") + " du cadre (cm)", x], ["c) Longueur de baguette dorée pour border l'extérieur du cadre (cm)", P], ["d) Aire d'un cadre deux fois plus large autour de la même photo (cm²)", A2]],
["a) Aire de l'ensemble moins aire de la photo.", "b) L'ensemble mesure (" + w + " + 2x) sur (" + h + " + 2x) : écris que le produit vaut " + T(A) + ", développe, puis résous (garde la solution positive).", "c) Les côtés extérieurs mesurent la photo plus deux fois la largeur du cadre ; périmètre = 2 · (longueur + largeur).", "d) Avec une largeur 2x : (" + w + " + 4x)(" + h + " + 4x), moins l'aire de la photo."],
"a) " + M(N(A) + " - " + w * h + " = " + N(A - w * h)) + " cm². b) " + M("(" + w + " + 2x)(" + h + " + 2x) = " + N(A) + " \\iff 4x^2 + " + 2 * (w + h) + "x - " + N(A - w * h) + " = 0") + " ; solution positive " + M("x = " + N(x)) + " cm. c) " + M("2 \\cdot (" + N(w + 2 * x) + " + " + N(h + 2 * x) + ") = " + N(P)) + " cm. d) " + M(N(w + 4 * x) + " \\cdot " + N(h + 4 * x) + " - " + w * h + " = " + N(A2)) + " cm² (plus du double du cadre de départ).");
});



PX("thales", C11, "clocher", () => {
let p, op, k, ta; do { [p, op] = pk([[2, 1.5], [1.5, 2.4], [2.5, 2], [2, 2.5], [1.5, 1.2]]); k = pk([12, 15, 16, 18, 20]); ta = pk([6, 8, 9, 12]); } while (p * k < 20 || p * k > 50);
const oc = k * op, Hc = p * k, oa = (ta * op) / p, on = (1.6 * op) / p, dn = oc - on;
return PB("Au même moment, un panneau de " + X(p) + " m de haut a une ombre de " + X(op) + " m, et l'ombre du clocher du village mesure " + X(oc) + " m (sol horizontal).",
[["a) Combien de fois l'ombre du clocher est-elle plus longue que celle du panneau ?", k], ["b) Hauteur du clocher (m)", Hc], ["c) Longueur de l'ombre d'un arbre de " + ta + " m au même moment (m, au centième)", oa, 0.01], ["d) Noé (1,60 m) se place dans l'ombre du clocher, de façon que le bout de son ombre arrive juste au bout de l'ombre du clocher. Distance entre Noé et le pied du clocher (m, au dixième)", dn, 0.1]],
["a) Ombre du clocher ÷ ombre du panneau.", "b) Au même moment, hauteurs et ombres sont proportionnelles (Thalès) : la hauteur est multipliée par le même nombre.", "c) Ombre = hauteur · (ombre du panneau ÷ hauteur du panneau).", "d) Calcule d'abord l'ombre de Noé (comme au c), puis retire-la de l'ombre du clocher."],
"a) " + M(N(oc) + " \\div " + N(op) + " = " + k) + ". b) " + M(N(p) + " \\cdot " + k + " = " + N(Hc)) + " m. c) " + M(ta + " \\cdot \\frac{" + N(op) + "}{" + N(p) + "}" + AP(oa, 0.01)) + " m. d) Ombre de Noé : " + M("1{,}6 \\cdot \\frac{" + N(op) + "}{" + N(p) + "}" + AP(on, 0.01)) + " m ; " + M(N(oc) + " - " + N(rd(on, 0.01)) + AP(dn, 0.1)) + " m.");
});



PX("proba", C11, "urne", () => {
let r, v; do { r = ri(3, 7); v = ri(2, 6); } while (r === v);
const n = r + v, d = n * (n - 1), RR = r * (r - 1), G = RR + v * (v - 1);
return PB("Une urne contient " + M(r) + " boules rouges et " + M(v) + " boules vertes, indiscernables au toucher. On tire une boule, on la garde, puis on en tire une deuxième. On gagne si les deux boules ont la même couleur. (fractions acceptées)",
[["a) Probabilité de tirer deux boules rouges", RR / d], ["b) Probabilité de gagner", G / d], ["c) Probabilité d'avoir au moins une boule verte", 1 - RR / d], ["d) On rejoue, mais en remettant la première boule dans l'urne avant le deuxième tirage. Probabilité de gagner", (r * r + v * v) / (n * n)]],
["a) Arbre à deux étages : après une rouge, il reste " + (n - 1) + " boules, dont une rouge de moins ; multiplie le long de la branche.", "b) Même couleur : deux rouges OU deux vertes ; additionne les deux branches.", "c) Le contraire de « au moins une verte » est « deux rouges ».", "d) Avec remise, le deuxième tirage se fait dans l'urne complète : le deuxième étage de l'arbre a les mêmes probabilités que le premier."],
"a) " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fr(RR, d)) + ". b) " + M("\\frac{" + RR + " + " + v * (v - 1) + "}{" + d + "} = " + fr(G, d)) + ". c) " + M("1 - " + fr(RR, d) + " = " + fr(d - RR, d)) + ". d) " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + r + "}{" + n + "} + \\frac{" + v + "}{" + n + "} \\cdot \\frac{" + v + "}{" + n + "} = " + fr(r * r + v * v, n * n)) + " : un peu plus qu'au b).");
});


PX("proba", C11, "des", () => {
const s = pk([4, 5, 6, 8, 9, 10]), ns = 6 - Math.abs(s - 7), ov = s % 2 === 0 ? 1 : 0, ng = ns + 6 - ov, L = 36 - ng;
return PB("On lance deux dés équilibrés à six faces. On gagne si la somme des deux dés vaut " + s + " OU si l'on fait un double (deux fois le même nombre). (fractions acceptées)",
[["a) Probabilité que la somme vaille " + s, ns / 36], ["b) Probabilité de faire un double", 1 / 6], ["c) Probabilité de gagner", ng / 36], ["d) On joue deux parties. Probabilité de gagner au moins une fois", 1 - (L * L) / 1296]],
["a) 36 issues équiprobables (tableau 6 × 6) : compte les couples dont la somme vaut " + s + ".", "b) Les doubles : (1 ; 1), (2 ; 2)… ; compte-les.", "c) Compte les issues gagnantes sans compter deux fois une issue qui serait à la fois un double et de somme " + s + ".", "d) Le contraire : perdre les deux parties ; les parties sont indépendantes, on multiplie."],
"a) " + ns + " couples sur 36 : " + M(fr(ns, 36)) + ". b) " + M(fr(6, 36)) + ". c) " + (ov ? M(ns + " + 6 - 1 = " + ng) + " issues (le double " + M("(" + s / 2 + "\\,;\\," + s / 2 + ")") + " compté une fois)" : M(ns + " + 6 = " + ng) + " issues (aucun double de somme " + s + ")") + " : " + M(fr(ng, 36)) + ". d) Perdre deux fois : " + M(fr(L, 36) + " \\cdot " + fr(L, 36) + " = " + fr(L * L, 1296)) + " ; " + M("1 - " + fr(L * L, 1296) + " = " + fr(1296 - L * L, 1296)) + ".");
});



PX("volcone", C11, "cornet", () => {
let r, h, B, Vc, Vb, Vt, n;
do { r = pk([2.5, 3, 3.5]); h = pk([10, 11, 12]); B = pk([2, 2.5, 3, 5]); Vc = (Math.PI * r * r * h) / 3; Vb = (2 * Math.PI * r ** 3) / 3; Vt = Vc + Vb; n = (B * 1000) / Vt; }
while (frac(n) < 0.05 || frac(n) > 0.95 || rd(Vt, 0.1) !== rd(rd(Vc, 0.1) + rd(Vb, 0.1), 0.1) || mid(Vc * 10) || mid(Vb * 10));
return PB("Un cornet de glace est un cône de " + X(r) + " cm de rayon et de " + X(h) + " cm de profondeur, rempli de glace et surmonté d'une demi-boule de glace de même rayon.",
[["a) Volume de glace dans le cône (cm³, au dixième)", Vc, 0.1], ["b) Volume de la demi-boule (cm³, au dixième)", Vb, 0.1], ["c) Volume total de glace d'un cornet (cm³, au dixième)", Vt, 0.1], ["d) Un bac contient " + T(B) + " L de glace. Nombre de cornets complets qu'on peut servir", Math.floor(n)]],
["a) Cône : π · r² · h ÷ 3.", "b) Boule : 4 ÷ 3 · π · r³ ; la demi-boule en est la moitié.", "c) Additionne les deux volumes.", "d) 1 L = 1 dm³ = 1'000 cm³ ; divise, puis ne garde que les cornets complets."],
"a) " + M("\\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + h + "}{3}" + AP(Vc, 0.1)) + " cm³. b) " + M("\\frac{2}{3} \\pi \\cdot " + N(r) + "^3" + AP(Vb, 0.1)) + " cm³. c) " + M(N(rd(Vc, 0.1)) + " + " + N(rd(Vb, 0.1)) + AP(Vt, 0.1)) + " cm³. d) " + M(N(B * 1000) + " \\div " + N(rd(Vt, 0.1)) + AP(n, 0.01)) + " : " + Math.floor(n) + " cornets complets.");
});


PX("airepyr", C11, "toit", () => {
let c, h, ap, t, Np, AL; do { [c, h, ap] = pk([[6, 4, 5], [8, 3, 5], [10, 12, 13], [12, 8, 10], [12, 4.5, 7.5], [16, 6, 10]]); t = pk([10, 12, 14]); Np = pk([200, 240, 300]); AL = 2 * c * ap; } while (Number.isInteger((AL * t) / Np));
const V = (c * c * h) / 3, nt = AL * t, np = Math.ceil(nt / Np);
return PB("Le toit d'une tour est une pyramide régulière à base carrée de " + X(c) + " m de côté et de " + X(h) + " m de haut. On le couvre de tuiles : il en faut " + t + " par m², et elles sont livrées par palettes de " + Np + ".",
[["a) Apothème, hauteur d'une face triangulaire (m)", ap], ["b) Aire des quatre faces du toit (m²)", AL], ["c) Volume sous le toit (m³)", V], ["d) Nombre minimal de palettes à commander", np]],
["a) Triangle rectangle formé par la hauteur de la pyramide, la moitié du côté de la base et l'apothème : Pythagore.", "b) Quatre triangles de base " + T(c) + " m et de hauteur l'apothème.", "c) Pyramide : aire de la base · hauteur ÷ 3.", "d) Nombre de tuiles = aire · " + t + " ; une palette entamée s'achète entière : arrondis vers le haut."],
"a) " + M("\\sqrt{" + N(h) + "^2 + " + N(c / 2) + "^2} = \\sqrt{" + N(ap * ap) + "} = " + N(ap)) + " m. b) " + M("4 \\cdot \\frac{" + c + " \\cdot " + N(ap) + "}{2} = " + N(AL)) + " m². c) " + M("\\frac{" + c + "^2 \\cdot " + N(h) + "}{3} = " + N(V)) + " m³. d) " + M(N(AL) + " \\cdot " + t + " = " + N(nt)) + " tuiles ; " + M(N(nt) + " \\div " + Np + AP(nt / Np, 0.01)) + " : " + np + " palettes.");
});


PX("denombr", C11, "cadenas", () => {
const k = pk([3, 4]), s = pk([2, 3, 4]), tot = 10 ** k, diff = k === 3 ? 720 : 5040, hh = (tot * s) / 3600;
return PB("Un cadenas à code a " + k + " molettes, chacune portant les chiffres de 0 à 9. Son propriétaire a oublié le code.",
[["a) Nombre de codes possibles", tot], ["b) Nombre de codes dont tous les chiffres sont différents", diff], ["c) Nombre de codes où au moins un chiffre se répète", tot - diff], ["d) Il essaie un code toutes les " + s + " secondes. Durée maximale pour essayer tous les codes (h, au dixième)", hh, 0.1]],
["a) Chaque molette offre 10 choix, indépendamment des autres : multiplie.", "b) Premier chiffre : 10 choix ; le suivant doit être différent : un choix de moins, et ainsi de suite.", "c) Tous les codes, moins ceux dont les chiffres sont tous différents.", "d) Durée = nombre de codes · durée d'un essai ; 1 h = 3'600 s."],
"a) " + M("10^" + k + " = " + N(tot)) + ". b) " + M(k === 3 ? "10 \\cdot 9 \\cdot 8 = 720" : "10 \\cdot 9 \\cdot 8 \\cdot 7 = 5\\text{'}040") + ". c) " + M(N(tot) + " - " + N(diff) + " = " + N(tot - diff)) + ". d) " + M(N(tot) + " \\cdot " + s + " = " + N(tot * s)) + " s ; " + M(N(tot * s) + " \\div 3\\text{'}600" + AP(hh, 0.1)) + " h.");
});



PX("simil", C11, "pizza", () => {
const d1 = pk([24, 26, 28, 30, 32]), k = pk([1.25, 1.5]), d2 = d1 * k, Pp = pk([12, 14, 16, 18]), g = pk([80, 100, 120]), dG = d1 * Math.SQRT2;
return PB("Une pizzeria fixe des prix proportionnels à l'aire des pizzas. La petite pizza a un diamètre de " + X(d1) + " cm et coûte " + X(Pp) + " CHF ; la grande a un diamètre de " + X(d2) + " cm.",
[["a) Rapport de similitude (grande ÷ petite)", k], ["b) Prix de la grande pizza (CHF, au centime)", Pp * k * k, 0.01], ["c) La petite est garnie de " + g + " g de fromage. Masse de fromage sur la grande, à la même épaisseur (g, au dixième)", g * k * k, 0.1], ["d) Diamètre d'une pizza géante qui coûterait le double de la petite (cm, au dixième)", dG, 0.1]],
["a) Rapport = diamètre de la grande ÷ diamètre de la petite.", "b) Les aires, donc les prix, sont multipliées par le carré du rapport.", "c) À la même épaisseur, la masse de fromage est proportionnelle à l'aire.", "d) Prix double = aire double : le carré du rapport des diamètres vaut 2."],
"a) " + M(N(d2) + " \\div " + d1 + " = " + N(k)) + ". b) " + M(Pp + " \\cdot " + N(k) + "^2 = " + Pp + " \\cdot " + N(k * k) + AP(Pp * k * k, 0.01)) + " CHF. c) " + M(g + " \\cdot " + N(k * k) + AP(g * k * k, 0.1)) + " g. d) Rapport " + M("\\sqrt{2}") + " : " + M(d1 + " \\cdot \\sqrt{2}" + AP(dG, 0.1)) + " cm.");
});





PX("f2", C12, "tshirts", () => {
let Bk, Z, c; do { Bk = pk([4, 5, 6, 8, 10]); Z = pk([30, 36, 40, 44, 50]); c = pk([8, 10, 12, 14]); } while (c >= Z / 2);
const A = Bk * Z, pR = Z / 2, Rm = pR * (A - Bk * pR), pB = (c + Z) / 2, Bm = (pB - c) * (A - Bk * pB);
return PB("Un club vend des t-shirts. Une étude montre qu'au prix de " + M("p") + " CHF, il en vend " + M("n = " + A + " - " + Bk + "p") + ".",
[["a) Prix qui donne la plus grande recette (CHF)", pR], ["b) Recette maximale (CHF)", Rm], ["c) Chaque t-shirt coûte " + c + " CHF au club. Prix qui donne le plus grand bénéfice (CHF)", pB], ["d) Bénéfice maximal (CHF)", Bm]],
["a) Recette = prix · nombre vendu : écris R(p), cherche ses deux zéros ; le sommet de la parabole est au milieu.", "b) Remplace p par ce prix dans R(p).", "c) Bénéfice par t-shirt : p − " + c + " ; écris B(p) = (p − " + c + ")(" + A + " − " + Bk + "p), cherche ses zéros, puis leur milieu.", "d) Remplace p par ce prix dans B(p)."],
"a) " + M("R(p) = p(" + A + " - " + Bk + "p)") + " s'annule en 0 et en " + Z + " : sommet en " + M("p = " + N(pR)) + " CHF. b) " + M("R(" + N(pR) + ") = " + N(pR) + " \\cdot " + N(A - Bk * pR) + " = " + N(Rm)) + " CHF. c) " + M("B(p) = (p - " + c + ")(" + A + " - " + Bk + "p)") + " s'annule en " + c + " et en " + Z + " : " + M("p = \\frac{" + c + " + " + Z + "}{2} = " + N(pB)) + " CHF. d) " + M("(" + N(pB) + " - " + c + ") \\cdot " + N(A - Bk * pB) + " = " + N(Bm)) + " CHF (le prix qui maximise la recette ne maximise pas le bénéfice).");
});


PX("f2", C12, "fusee", () => {
let v, h0, ts; do { v = pk([14, 16, 18, 20, 24]); h0 = pk([1, 1.5, 2, 2.5]); ts = (v + Math.sqrt(v * v + 20 * h0)) / 10; } while (mid(ts * 100));
const tm = v / 10, hm = h0 + (v * v) / 20, h2 = -20 + 2 * v + h0;
return PB("Une fusée à eau est lancée verticalement depuis une rampe de " + X(h0) + " m de haut. Sa hauteur vaut " + M("h(t) = -5t^2 + " + v + "t + " + N(h0)) + " (" + M("h") + " en m, " + M("t") + " en s).",
[["a) Instant où elle est au plus haut (s)", tm], ["b) Hauteur maximale (m)", hm], ["c) Hauteur après 2 s (m)", h2], ["d) Instant où elle retombe au sol (s, au centième)", ts, 0.01]],
["a) Sommet d'une parabole at² + bt + c : t = −b ÷ (2a).", "b) Remplace t par cet instant dans h(t).", "c) Remplace t par 2.", "d) Résous h(t) = 0 avec la formule du 2e degré et garde la solution positive."],
"a) " + M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(tm)) + " s. b) " + M("h(" + N(tm) + ") = " + N(hm)) + " m. c) " + M("h(2) = -20 + " + 2 * v + " + " + N(h0) + " = " + N(h2)) + " m. d) " + M("\\Delta = " + v * v + " + 20 \\cdot " + N(h0) + " = " + N(v * v + 20 * h0)) + " ; " + M("t = \\frac{" + v + " + \\sqrt{" + N(v * v + 20 * h0) + "}}{10}" + AP(ts, 0.01)) + " s.");
});


PX("f2expr", C12, "arche", () => {
let L, hh, w, H3; do { L = pk([8, 10, 12, 16, 20]); hh = pk([4, 5, 6, 8]); w = pk([2.4, 2.5]); H3 = pk([2, 3]); } while (hh / L > 0.8 || hh / L < 0.3 || hh - H3 < 2 || frac((hh - (4 * hh * (w / 2) ** 2) / (L * L)) * 100) < 0.05);
const a = (-4 * hh) / (L * L), y1 = hh + a * (L / 2 - 1) ** 2, wid = 2 * Math.sqrt((hh - H3) / -a), ht = hh + a * (w / 2) ** 2, htf = Math.floor(ht * 100 + 1e-9) / 100;
return PB("Une arche a la forme d'une parabole. Ses deux pieds sont au sol, à " + X(L) + " m l'un de l'autre, et son sommet est à " + X(hh) + " m de haut. Dans un repère d'origine au sol, au milieu des deux pieds, elle a pour équation " + M("y = ax^2 + " + hh) + " (en m).",
[["a) Coefficient " + M("a") + " (fraction acceptée)", a], ["b) Hauteur de l'arche à 1 m d'un pied (m, au centième)", y1, 0.01], ["c) Largeur de l'arche à " + H3 + " m de hauteur (m, au centième)", wid, 0.01], ["d) Hauteur maximale d'un camion de " + T(w) + " m de large qui passe en roulant au milieu (m, au centième inférieur)", htf]],
["a) Un pied est au point (" + T(L / 2) + " ; 0) : remplace x et y dans l'équation et isole a.", "b) Ce point est à " + T(L / 2 - 1) + " m du milieu : remplace x.", "c) Résous a x² + " + hh + " = " + H3 + " : deux solutions opposées, la largeur est leur écart.", "d) Les coins du toit du camion sont à " + T(w / 2) + " m du milieu : hauteur de l'arche à cet endroit."],
"a) " + M("0 = a \\cdot " + N(L / 2) + "^2 + " + hh + " \\iff a = -" + fr(4 * hh, L * L)) + ". b) " + M("y(" + N(L / 2 - 1) + ") = -" + fr(4 * hh, L * L) + " \\cdot " + N(L / 2 - 1) + "^2 + " + hh + AP(y1, 0.01)) + " m. c) " + M("x^2 = \\frac{" + (hh - H3) + "}{" + fr(4 * hh, L * L) + "} = " + N(r6((hh - H3) / -a))) + ", " + M("x = \\pm" + N(rd(wid / 2, 0.0001))) + " : largeur " + M("2 \\cdot " + N(rd(wid / 2, 0.0001)) + AP(wid, 0.01)) + " m. d) " + M("y(" + N(w / 2) + ") = -" + fr(4 * hh, L * L) + " \\cdot " + N(w / 2) + "^2 + " + hh + AP(ht, 0.0001)) + " m : au plus " + M(N(htf)) + " m (arrondi vers le bas, sinon le camion touche).");
});


PX("trinfact", C12, "usine", () => {
let x1, x2, k; do { x1 = ri(2, 5); x2 = ri(x1 + 4, x1 + 10); k = pk([1, 2, 3]); } while (false);
const s = x1 + x2, p = x1 * x2, xm = s / 2, Bm = k * ((x2 - x1) / 2) ** 2, lead = k === 1 ? "-" : "-" + k;
return PB("Une usine fabrique " + M("x") + " centaines d'objets par mois. Son bénéfice vaut " + M("B(x) = " + lead + "x^2 + " + k * s + "x - " + k * p) + " (en milliers de CHF ; un bénéfice négatif est une perte).",
[["a) Plus petite production pour laquelle le bénéfice est nul (centaines)", x1], ["b) Plus grande production pour laquelle le bénéfice est nul (centaines)", x2], ["c) Production qui donne le plus grand bénéfice (centaines)", xm], ["d) Bénéfice maximal (milliers de CHF)", Bm]],
["a) " + (k === 1 ? "Mets −1 en évidence" : "Mets −" + k + " en évidence") + ", puis factorise le trinôme (somme et produit) et utilise le produit nul.", "b) C'est l'autre zéro de B.", "c) Le sommet de la parabole est au milieu de ses deux zéros.", "d) Remplace x par cette production dans B(x)."],
M("B(x) = " + lead + "(x^2 - " + s + "x + " + p + ") = " + lead + "(x - " + x1 + ")(x - " + x2 + ")") + ". a) " + x1 + " centaines. b) " + x2 + " centaines. c) " + M("\\frac{" + x1 + " + " + x2 + "}{2} = " + N(xm)) + " centaines. d) " + M("B(" + N(xm) + ") = " + N(Bm)) + " milliers de CHF.");
});


PX("racinv", C12, "partage", () => {
let n, d, P, Xm, need; do { n = ri(4, 9); d = pk([2, 2.5, 3, 4, 5]); P = n * (n + 1) * d; Xm = pk([8, 10, 12, 15]); need = Math.ceil(P / Xm); } while (P < 60 || P > 400 || need <= n + 1 || Number.isInteger(P / Xm));
return PB("Des amis se partagent équitablement le prix d'un cadeau de " + X(P) + " CHF. Si une personne de plus participait, chacun paierait " + X(d) + " CHF de moins.",
[["a) Nombre d'amis", n], ["b) Part de chacun (CHF)", P / n], ["c) Part de chacun avec une personne de plus (CHF)", P / (n + 1)], ["d) Nombre minimal de participants pour que chacun paie au plus " + Xm + " CHF", need]],
["a) Avec n amis, chacun paie " + T(P) + " ÷ n ; avec une personne de plus, " + T(P) + " ÷ (n + 1). Écris que la différence vaut " + T(d) + ", multiplie par n(n + 1) et résous (n > 0).", "b) Prix du cadeau ÷ nombre d'amis.", "c) Prix du cadeau ÷ (nombre d'amis + 1).", "d) Résous " + T(P) + " ÷ m ≤ " + Xm + ", puis arrondis le nombre de participants vers le haut."],
"a) " + M("\\frac{" + N(P) + "}{n} - \\frac{" + N(P) + "}{n + 1} = " + N(d) + " \\iff n(n + 1) = " + n * (n + 1) + " \\iff n^2 + n - " + n * (n + 1) + " = 0") + ", " + M("n = " + n) + ". b) " + M(N(P) + " \\div " + n + " = " + N(P / n)) + " CHF. c) " + M(N(P) + " \\div " + (n + 1) + " = " + N(P / (n + 1))) + " CHF. d) " + M("m \\ge " + N(P) + " \\div " + Xm + AP(P / Xm, 0.01)) + " : " + need + " participants.");
});



PX("sysgraph", C12, "sport", () => {
let F, a, b, n1, Bu, nA, nB; do { F = pk([60, 80, 90, 100, 120]); a = pk([4, 5, 6]); b = pk([8, 9, 10, 12]); n1 = ri(6, 12); Bu = pk([300, 350, 400, 450]); nA = Math.floor((Bu - F) / a); nB = Math.floor(Bu / b); }
while (F % (b - a) !== 0 || nA === nB || F / (b - a) < 8 || F / (b - a) > 40 || n1 === F / (b - a));
const ne = F / (b - a), best = Math.max(nA, nB);
return PB("Salle de sport : la formule A coûte " + X(F) + " CHF par an, plus " + X(a) + " CHF par séance ; la formule B coûte " + X(b) + " CHF par séance, sans abonnement.",
[["a) Coût annuel avec la formule A pour " + n1 + " séances (CHF)", F + a * n1], ["b) Coût annuel avec la formule B pour " + n1 + " séances (CHF)", b * n1], ["c) Nombre de séances pour lequel les deux formules coûtent autant", ne], ["d) Avec un budget de " + Bu + " CHF pour l'année, nombre maximal de séances, en choisissant la meilleure formule", best]],
["a) Coût A = " + F + " + " + a + " · (nombre de séances).", "b) Coût B = " + b + " · (nombre de séances).", "c) Écris que les deux coûts sont égaux et résous en n.", "d) Pour chaque formule, cherche le plus grand nombre entier de séances dont le coût ne dépasse pas " + Bu + " CHF, puis garde le meilleur."],
"a) " + M(F + " + " + a + " \\cdot " + n1 + " = " + (F + a * n1)) + " CHF. b) " + M(b + " \\cdot " + n1 + " = " + b * n1) + " CHF. c) " + M(F + " + " + a + "n = " + b + "n \\iff " + (b - a) + "n = " + F + " \\iff n = " + ne) + ". d) A : " + M(F + " + " + a + "n \\le " + Bu + " \\iff n \\le " + N(rd((Bu - F) / a, 0.01))) + ", soit " + nA + " ; B : " + M(b + "n \\le " + Bu + " \\iff n \\le " + N(rd(Bu / b, 0.01))) + ", soit " + nB + " : au plus " + best + " séances (formule " + (nA > nB ? "A" : "B") + ").");
});


PX("modaff", C12, "patinoire", () => {
let pA, pB, n1, FB, FC, w, nn, costs, nC;
do { pA = ri(8, 12); pB = ri(3, pA - 3); n1 = ri(8, 16); FB = (pA - pB) * n1; FC = 10 * ri(15, 40); w = pk([20, 25, 30]); nn = 2 * w; costs = [pA * nn, FB + pB * nn, FC]; nC = Math.floor((FC - FB) / pB) + 1; }
while (Number.isInteger((FC - FB) / pB) || FC <= FB + pB * (n1 + 3) || Math.min(...costs) === pA * nn || costs[1] === costs[2] || nC > nn + 20);
const best = Math.min(...costs);
return PB("Patinoire. Offre A : " + X(pA) + " CHF l'entrée. Offre B : carte de saison à " + X(FB) + " CHF, puis " + X(pB) + " CHF l'entrée. Offre C : abonnement illimité à " + X(FC) + " CHF pour la saison. Lou prévoit d'y aller 2 fois par semaine pendant " + w + " semaines.",
[["a) Nombre d'entrées pour lequel les offres A et B coûtent autant", n1], ["b) À partir de combien d'entrées l'offre C est-elle moins chère que l'offre B ?", nC], ["c) Coût de l'offre la plus avantageuse pour la saison de Lou (CHF)", best], ["d) Économie de Lou par rapport à l'offre A (CHF)", pA * nn - best]],
["a) Coût A = " + pA + "n et coût B = " + FB + " + " + pB + "n : écris qu'ils sont égaux.", "b) Résous " + FB + " + " + pB + "n > " + FC + " et prends le plus petit entier.", "c) Lou fait 2 · " + w + " entrées : calcule le coût des trois offres et garde le plus petit.", "d) Coût avec l'offre A moins le coût trouvé au c)."],
"a) " + M(pA + "n = " + FB + " + " + pB + "n \\iff " + (pA - pB) + "n = " + FB + " \\iff n = " + n1) + ". b) " + M(FB + " + " + pB + "n > " + FC + " \\iff n > " + N(rd((FC - FB) / pB, 0.01))) + " : dès " + nC + " entrées. c) " + nn + " entrées : A " + M(pA + " \\cdot " + nn + " = " + costs[0]) + ", B " + M(FB + " + " + pB + " \\cdot " + nn + " = " + costs[1]) + ", C " + FC + " : " + best + " CHF. d) " + M(costs[0] + " - " + best + " = " + (pA * nn - best)) + " CHF.");
});


PX("sys3", C12, "cinema", () => {
const G = [[2, 1, 2], [1, 2, 3], [3, 0, 1], [2, 3, 0], [1, 1, 4], [0, 2, 3], [3, 1, 0], [1, 0, 2]];
const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
let pa, pe, pc, g, eco; do { pa = ri(16, 20); pe = ri(12, 15); pc = ri(9, 12); g = [pk(G), pk(G), pk(G)]; eco = pk([4, 5, 6, 8]); } while (!(pa > pe && pe > pc) || det(g) === 0);
const tot = g.map(([x, y, z]) => x * pa + y * pe + z * pc), F = 2 * pa + 2 * pc - eco;
const grp = ([x, y, z]) => { const L = [[x, "adulte"], [y, "étudiant"], [z, "enfant"]].filter(([n]) => n).map(([n, w]) => n + " " + w + (n > 1 ? "s" : "")); return L.length > 1 ? L.slice(0, -1).join(", ") + " et " + L[L.length - 1] : L[0]; };
return PB("Au cinéma, trois groupes ont payé : " + grp(g[0]) + " pour " + tot[0] + " CHF ; " + grp(g[1]) + " pour " + tot[1] + " CHF ; " + grp(g[2]) + " pour " + tot[2] + " CHF.",
[["a) Prix d'une place adulte (CHF)", pa], ["b) Prix d'une place étudiant (CHF)", pe], ["c) Prix d'une place enfant (CHF)", pc], ["d) Le tarif famille (2 adultes et 2 enfants) coûte " + F + " CHF. Économie par rapport au prix normal (CHF)", eco]],
["a) Note a, e et c les trois prix ; écris un système de trois équations, puis élimine une inconnue en combinant deux équations.", "b) Remplace le prix trouvé dans une équation à deux inconnues.", "c) Remplace les deux prix connus dans une des trois équations.", "d) Prix normal de 2 adultes et 2 enfants, moins le tarif famille."],
M("\\begin{cases} " + g.map(([x, y, z], i) => [[x, "a"], [y, "e"], [z, "c"]].filter(([n]) => n).map(([n, v]) => (n === 1 ? "" : n) + v).join(" + ") + " = " + tot[i]).join(" \\\\ ") + " \\end{cases}") + " ; a) " + M("a = " + pa) + " CHF. b) " + M("e = " + pe) + " CHF. c) " + M("c = " + pc) + " CHF. d) " + M("2 \\cdot " + pa + " + 2 \\cdot " + pc + " - " + F + " = " + eco) + " CHF.");
});


PX("affzero", C12, "bougies", () => {
let H1, v1, H2, v2, te, t1, t2x;
do { H1 = pk([24, 25, 28, 30]); v1 = pk([1.5, 2, 2.5]); H2 = pk([15, 16, 18, 20]); v2 = pk([0.5, 0.8, 1.2]); te = (H1 - H2) / (v1 - v2); t1 = H1 / v1; t2x = (2 * H1 - H2) / (2 * v1 - v2); }
while (!(te > 1 && te < t1 - 1) || v1 - v2 === 1 || !Number.isInteger(r6(te * 4)) || mid(t1 * 100) || mid(t2x * 100));
const hc = H1 - v1 * te;
return PB("Deux bougies sont allumées en même temps. La première mesure " + X(H1) + " cm et raccourcit de " + X(v1) + " cm par heure ; la seconde mesure " + X(H2) + " cm et raccourcit de " + X(v2) + " cm par heure.",
[["a) Après combien d'heures ont-elles la même hauteur ? (h)", te], ["b) Hauteur commune (cm)", hc], ["c) Après combien d'heures la première est-elle entièrement consumée ? (h, au centième)", t1, 0.01], ["d) Après combien d'heures la seconde est-elle deux fois plus haute que la première ? (h, au centième)", t2x, 0.01]],
["a) Hauteur après t heures : " + T(H1) + " − " + T(v1) + "t pour la première, " + T(H2) + " − " + T(v2) + "t pour la seconde ; écris qu'elles sont égales.", "b) Remplace t par la durée trouvée dans une des deux expressions.", "c) La première est consumée quand sa hauteur vaut 0 : zéro d'une fonction affine.", "d) Écris : hauteur de la seconde = 2 · hauteur de la première, puis résous."],
"a) " + M(H1 + " - " + N(v1) + "t = " + H2 + " - " + N(v2) + "t \\iff " + N(v1 - v2) + "t = " + (H1 - H2) + " \\iff t = " + N(te)) + " h. b) " + M(H1 + " - " + N(v1) + " \\cdot " + N(te) + " = " + N(hc)) + " cm. c) " + M(H1 + " - " + N(v1) + "t = 0 \\iff t = " + H1 + " \\div " + N(v1) + AP(t1, 0.01)) + " h. d) " + M(H2 + " - " + N(v2) + "t = 2(" + H1 + " - " + N(v1) + "t) \\iff " + N(2 * v1 - v2) + "t = " + (2 * H1 - H2) + " \\iff t" + AP(t2x, 0.01)) + " h.");
});


PX("morceaux", C12, "parking", () => {
let P1, P2, J, Mab, n, jour; do { P1 = pk([2, 2.5, 3]); P2 = pk([1.5, 2]); J = pk([12, 15, 18]); Mab = pk([60, 70, 80, 90]); n = Math.ceil((J - P1) / P2 - 1e-9) + 1; jour = P1 + 2 * P2; } while (20 * jour - Mab < 10 || P1 + 3 * P2 >= J);
return PB("Un parking coûte " + X(P1) + " CHF pour la première heure (ou moins), puis " + X(P2) + " CHF par heure supplémentaire commencée, avec un plafond de " + X(J) + " CHF par jour.",
[["a) Prix pour 4 heures (CHF)", P1 + 3 * P2], ["b) Prix pour 1 h 20 min (CHF)", P1 + P2], ["c) À partir de combien d'heures entières paie-t-on le plafond ?", n], ["d) Lia s'y gare 3 heures par jour, 20 jours par mois. Économie par mois avec un abonnement mensuel à " + Mab + " CHF (CHF)", 20 * jour - Mab]],
["a) Première heure, puis 3 heures supplémentaires.", "b) Une heure commencée est due entière : 1 h 20 min = première heure + une heure commencée.", "c) Cherche le plus petit nombre entier d'heures n tel que " + T(P1) + " + (n − 1) · " + T(P2) + " ≥ " + J + ".", "d) Prix d'une journée de 3 heures, fois 20 jours, moins le prix de l'abonnement."],
"a) " + M(N(P1) + " + 3 \\cdot " + N(P2) + " = " + N(P1 + 3 * P2)) + " CHF. b) " + M(N(P1) + " + " + N(P2) + " = " + N(P1 + P2)) + " CHF. c) " + M(N(P1) + " + (n - 1) \\cdot " + N(P2) + " \\ge " + J + " \\iff n - 1 \\ge " + N(rd((J - P1) / P2, 0.01))) + " : dès " + n + " heures. d) " + M("20 \\cdot " + N(jour) + " = " + N(20 * jour)) + " CHF sans abonnement ; " + M(N(20 * jour) + " - " + Mab + " = " + N(20 * jour - Mab)) + " CHF d'économie.");
});



PX("euclide", C12, "terrain", () => {
let p, q, h, H, ca, cb, per; do { [p, q, h] = pk([[9, 16, 12], [16, 9, 12], [4, 9, 6], [8, 18, 12], [4, 25, 10], [18, 32, 24], [12, 27, 18], [9, 4, 6]]); const k = pk([1, 2]); p *= k; q *= k; h *= k; H = p + q; ca = Math.sqrt(p * H); cb = Math.sqrt(q * H); per = H + ca + cb; }
while (rd(per, 0.1) !== rd(H + rd(ca, 0.1) + rd(cb, 0.1), 0.1) || mid(ca * 10) || mid(per * 10));
const A = (H * h) / 2;
return PB("Un terrain a la forme d'un triangle " + M("ABC") + " rectangle en " + M("C") + ". La hauteur issue de " + M("C") + " mesure " + X(h) + " m ; elle coupe l'hypoténuse " + M("[AB]") + " en " + M("H") + ", avec " + M("AH = " + p) + " m.",
[["a) Longueur " + M("HB") + " (m)", q], ["b) Aire du terrain (m²)", A], ["c) Longueur du côté " + M("AC") + " (m, au dixième)", ca, 0.1], ["d) Longueur de clôture pour entourer le terrain (m, au dixième)", per, 0.1]],
["a) Théorème de la hauteur : CH² = AH · HB.", "b) Aire = hypoténuse · hauteur ÷ 2.", "c) Théorème d'Euclide : AC² = AH · AB.", "d) Calcule aussi BC (même théorème, avec HB), puis additionne les trois côtés."],
"a) " + M("HB = \\frac{" + h + "^2}{" + p + "} = " + q) + " m. b) " + M("AB = " + H) + " m ; " + M("\\frac{" + H + " \\cdot " + h + "}{2} = " + N(A)) + " m². c) " + M("AC = \\sqrt{" + p + " \\cdot " + H + "} = \\sqrt{" + p * H + "}" + AP(ca, 0.1)) + " m. d) " + M("BC = \\sqrt{" + q + " \\cdot " + H + "}" + AP(cb, 0.1)) + " m ; " + M(H + " + " + N(rd(ca, 0.1)) + " + " + N(rd(cb, 0.1)) + AP(per, 0.1)) + " m.");
});



PX("trigo", C12, "tour", () => {
let al, be, d, x, h, BS, gm; const tn = (g) => Math.tan(g * DEG);
do { al = ri(48, 62); be = ri(28, 40); d = pk([30, 40, 50, 60, 80]); x = (d * tn(be)) / (tn(al) - tn(be)); h = x * tn(al); BS = h / Math.sin(be * DEG); gm = Math.atan(h / (x / 2)) / DEG; }
while (!(h >= 30 && h <= 150) || [x, h, BS, gm].some((u) => Math.abs(u - Math.round(u)) > 0.35));
return PB("Pour mesurer la hauteur d'une tour, Inès vise son sommet depuis un point " + M("A") + " : l'angle d'élévation vaut " + M(al + "°") + ". Elle s'éloigne de la tour de " + X(d) + " m en ligne droite, jusqu'en " + M("B") + " : l'angle vaut alors " + M(be + "°") + ". (Sol horizontal ; on néglige la hauteur de ses yeux.)",
[["a) Distance de " + M("A") + " au pied de la tour (m, à l'unité)", x, 1], ["b) Hauteur de la tour (m, à l'unité)", h, 1], ["c) Distance de " + M("B") + " au sommet de la tour (m, à l'unité)", BS, 1], ["d) Angle d'élévation du sommet depuis le point situé à mi-chemin entre " + M("A") + " et le pied de la tour (°, à l'unité)", gm, 1]],
["a) Appelle x la distance de A au pied : h = x · tan " + al + "° et h = (x + " + d + ") · tan " + be + "° ; égale les deux expressions et isole x.", "b) h = x · tan " + al + "°.", "c) Dans le triangle rectangle vu depuis B : sin " + be + "° = hauteur ÷ distance cherchée.", "d) Ce point est à x ÷ 2 du pied : tan(angle) = hauteur ÷ (x ÷ 2)."],
"a) " + M("x \\tan " + al + "° = (x + " + d + ") \\tan " + be + "° \\iff x = \\frac{" + d + " \\tan " + be + "°}{\\tan " + al + "° - \\tan " + be + "°}" + AP(x, 0.1)) + " m. b) " + M("h = " + N(rd(x, 0.1)) + " \\cdot \\tan " + al + "°" + AP(h, 0.1)) + " m. c) " + M("\\frac{" + N(rd(h, 0.1)) + "}{\\sin " + be + "°}" + AP(BS, 0.1)) + " m. d) " + M("\\tan \\gamma = \\frac{" + N(rd(h, 0.1)) + "}{" + N(rd(x / 2, 0.1)) + "}") + ", " + M("\\gamma" + AP(gm, 0.1) + "°") + ".");
});


PX("trigo", C12, "rampe", () => {
const H = pk([24, 30, 36, 40, 45, 48, 60]), p = pk([8, 10, 12]), L = H / p, Rl = Math.sqrt(L * L + (H / 100) ** 2), ang = Math.atan(p / 100) / DEG, dL = H / 6 - L;
return PB("Une rampe d'accès doit monter de " + X(H) + " cm. Sa pente vaut " + p + " % : elle monte de " + p + " cm pour 100 cm parcourus à l'horizontale.",
[["a) Longueur horizontale nécessaire (m, au centième)", L, 0.01], ["b) Longueur de la rampe elle-même (m, au centième)", Rl, 0.01], ["c) Angle de la rampe avec le sol (°, au dixième)", ang, 0.1], ["d) Pour un fauteuil roulant sans aide, la pente ne doit pas dépasser 6 %. De combien de mètres faut-il allonger la longueur horizontale ? (m, au centième)", dL, 0.01]],
["a) Pente = montée ÷ longueur horizontale ; convertis en mètres.", "b) La rampe est l'hypoténuse : Pythagore (tout en mètres).", "c) tan(angle) = montée ÷ longueur horizontale = " + p + " ÷ 100.", "d) Calcule la longueur horizontale avec une pente de 6 %, puis la différence avec le a)."],
"a) " + M("\\frac{" + N(H / 100) + "}{" + N(p / 100) + "}" + AP(L, 0.01)) + " m. b) " + M("\\sqrt{" + N(rd(L, 0.01)) + "^2 + " + N(H / 100) + "^2}" + AP(Rl, 0.01)) + " m. c) " + M("\\tan \\alpha = " + N(p / 100)) + ", " + M("\\alpha" + AP(ang, 0.1) + "°") + ". d) " + M("\\frac{" + N(H / 100) + "}{0{,}06}" + AP(H / 6, 0.01)) + " m ; " + M(N(rd(H / 6, 0.01)) + " - " + N(rd(L, 0.01)) + AP(dL, 0.01)) + " m de plus.");
});


PX("trigrel", C12, "echelle", () => {
const [p, s, q] = pk([[5, 12, 13], [7, 24, 25], [8, 15, 17], [3, 4, 5]]), L = pk([4, 5, 6, 7.5, 8]), dp = (L * p) / q, hm = (L * s) / q, ang = Math.acos(p / q) / DEG;
return PB("Une échelle de " + X(L) + " m est appuyée contre un mur vertical. L'angle " + M("\\alpha") + " qu'elle fait avec le sol vérifie " + M("\\cos \\alpha = \\frac{" + p + "}{" + q + "}") + ". (fractions acceptées)",
[["a) " + M("\\sin \\alpha") + " (valeur exacte)", s / q], ["b) Distance entre le pied de l'échelle et le mur (m, au centième)", dp, 0.01], ["c) Hauteur atteinte sur le mur (m, au centième)", hm, 0.01], ["d) Par sécurité, une échelle doit faire avec le sol un angle de 65° à 75°. Angle " + M("\\alpha") + " (°, au dixième)", ang, 0.1]],
["a) sin² α + cos² α = 1, et sin α est positif pour un angle aigu.", "b) Dans le triangle rectangle, cos α = côté adjacent ÷ hypoténuse ; l'hypoténuse est l'échelle.", "c) sin α = côté opposé ÷ hypoténuse.", "d) Utilise la touche cos⁻¹ (arccos) de la calculatrice, puis compare avec la règle."],
"a) " + M("\\sin^2 \\alpha = 1 - \\frac{" + p * p + "}{" + q * q + "} = \\frac{" + s * s + "}{" + q * q + "}") + ", " + M("\\sin \\alpha = \\frac{" + s + "}{" + q + "}") + ". b) " + M(N(L) + " \\cdot \\frac{" + p + "}{" + q + "}" + AP(dp, 0.01)) + " m. c) " + M(N(L) + " \\cdot \\frac{" + s + "}{" + q + "}" + AP(hm, 0.01)) + " m. d) " + M("\\alpha" + AP(ang, 0.1) + "°") + (ang >= 65 && ang <= 75 ? " : l'échelle est bien placée." : ang < 65 ? " : trop faible, l'échelle risque de glisser." : " : trop raide."));
});


PX("geocomb", C12, "tente", () => {
const [hb, h, c] = pk([[0.5, 1.2, 1.3], [0.8, 1.5, 1.7], [1.2, 1.6, 2], [1.2, 0.9, 1.5], [2, 1.5, 2.5]]), b = 2 * hb, L = pk([2, 2.2, 2.4, 2.5, 3]);
const V = ((b * h) / 2) * L, S = b * h + 2 * c * L, ang = Math.atan(h / hb) / DEG;
return PB("Une tente a la forme d'un prisme droit couché. Sa façade est un triangle isocèle de " + X(b) + " m de base, dont les deux côtés obliques mesurent " + X(c) + " m ; la tente est longue de " + X(L) + " m.",
[["a) Hauteur de la façade (m)", h], ["b) Volume de la tente (m³, au centième)", V, 0.01], ["c) Surface de toile, deux façades et deux pans, sans le sol (m², au centième)", S, 0.01], ["d) Angle entre un pan de la tente et le sol (°, au dixième)", ang, 0.1]],
["a) La hauteur coupe la base en son milieu : Pythagore dans un demi-triangle.", "b) Prisme : aire de la façade · longueur.", "c) Deux triangles (les façades) et deux rectangles de " + T(c) + " m sur " + T(L) + " m.", "d) Dans le demi-triangle : tan(angle) = hauteur ÷ demi-base."],
"a) " + M("\\sqrt{" + N(c) + "^2 - " + N(hb) + "^2} = " + N(h)) + " m. b) " + M("\\frac{" + N(b) + " \\cdot " + N(h) + "}{2} \\cdot " + N(L) + AP(V, 0.01)) + " m³. c) " + M(N(b) + " \\cdot " + N(h) + " + 2 \\cdot " + N(c) + " \\cdot " + N(L) + AP(S, 0.01)) + " m². d) " + M("\\tan \\alpha = \\frac{" + N(h) + "}{" + N(hb) + "}") + ", " + M("\\alpha" + AP(ang, 0.1) + "°") + ".");
});
})();






const COMPS = {

prio: ["Calculer avec les priorités (· avant +)", "Calculer avec des parenthèses", "Calculer avec puissances et parenthèses"],
arith: ["Trouver le PGDC de deux nombres", "Trouver le PPMC de deux nombres", "Résoudre un problème de PGDC ou de PPMC"],
fracadd: ["Additionner des fractions de même dénominateur", "Additionner des fractions de dénominateurs différents", "Additionner et soustraire plusieurs fractions"],
diagr: ["Calculer une moyenne", "Calculer l'angle d'un diagramme circulaire", "Calculer une moyenne à partir des effectifs"],
prop: ["Calculer une quatrième proportionnelle", "Calculer une quatrième proportionnelle", "Utiliser la proportionnalité dans un problème"],
valnum: ["Remplacer une lettre par un nombre", "Calculer une expression du 2e degré pour une valeur", "Calculer une expression à deux lettres"],
angtri: ["Utiliser la somme des angles d'un triangle", "Calculer les angles d'un triangle isocèle", "Utiliser la somme des angles d'un quadrilatère"],
decread: ["Lire le rang d'un chiffre", "Écrire un nombre à partir de sa décomposition", "Passer de l'écriture fractionnaire à l'écriture décimale"],
deccomp: ["Comparer deux nombres décimaux", "Ranger des nombres décimaux", "Intercaler un nombre entre deux décimaux"],
decarr: ["Arrondir au dixième ou au centième", "Encadrer un nombre décimal", "Arrondir avec retenue ou à la dizaine"],
ordgr: ["Estimer une somme", "Estimer un produit", "Estimer un quotient"],
decadd: ["Additionner des nombres décimaux", "Soustraire des nombres décimaux", "Enchaîner additions et soustractions"],
dec10: ["Multiplier par 10, 100, 1000", "Diviser par 10, 100, 1000", "Multiplier ou diviser par 0,1 ; 0,01…"],
decmul: ["Multiplier un décimal par un entier", "Multiplier deux nombres décimaux", "Multiplier des décimaux plus petits que 1"],
decdiv: ["Diviser un décimal par un entier", "Diviser par un nombre décimal", "Diviser par un nombre décimal"],
decprob: ["Résoudre un problème avec des décimaux", "Résoudre un problème avec des décimaux", "Résoudre un problème de partage"],
pow9: ["Calculer un carré ou un cube", "Calculer une puissance d'un décimal ou de 10", "Enchaîner des puissances"],
tradexpr: ["Traduire une phrase en calcul", "Traduire une phrase en calcul", "Traduire une phrase en calcul (puissances)"],
multdiv: ["Trouver des multiples", "Trouver les diviseurs d'un nombre", "Compter des multiples dans un intervalle"],
divcrit: ["Utiliser les critères de divisibilité par 3 et 9", "Utiliser les critères de divisibilité par 3 et 9", "Combiner des critères de divisibilité"],
premiers: ["Reconnaître un nombre premier", "Décomposer en produit de facteurs premiers", "Décomposer en produit de facteurs premiers"],
relrep: ["Comparer des nombres relatifs", "Calculer une distance sur la droite graduée", "Trouver le milieu de deux relatifs"],
reladd: ["Additionner des nombres relatifs", "Soustraire un nombre relatif", "Calculer une somme de plusieurs relatifs"],
fracrep: ["Comparer des fractions de même dénominateur", "Comparer des fractions de dénominateurs différents", "Encadrer une fraction entre deux entiers"],
fracsimp: ["Amplifier une fraction", "Simplifier une fraction", "Rendre une fraction irréductible"],
fracconv: ["Écrire une fraction en nombre décimal", "Écrire une fraction en pourcentage", "Écrire un pourcentage en fraction"],
fracper: ["Reconnaître un nombre périodique", "Reconnaître un nombre périodique", "Écrire un nombre périodique en fraction"],
fractout: ["Calculer une fraction d'une quantité", "Calculer une fraction d'une quantité", "Retrouver le tout à partir d'une fraction"],
ulong: ["Convertir longueurs et masses", "Convertir longueurs et masses", "Résoudre un problème avec des unités"],
uaire: ["Convertir des unités d'aire", "Convertir des unités d'aire", "Convertir ares, hectares et km²"],
uvol: ["Convertir des capacités (L, dL, cL, mL)", "Convertir des unités de volume", "Passer des volumes aux litres"],
utemps: ["Convertir des durées", "Additionner des durées", "Calculer une durée entre deux horaires"],
perim: ["Calculer un périmètre", "Retrouver un côté à partir du périmètre", "Calculer le périmètre d'une figure découpée"],
aire1: ["Calculer l'aire d'un carré ou d'un rectangle", "Calculer l'aire d'un triangle", "Combiner aire, périmètre et unités"],
aire2: ["Calculer l'aire d'un parallélogramme", "Calculer l'aire d'un losange", "Choisir la bonne hauteur"],
aire3: ["Calculer une aire par décomposition", "Calculer une aire par décomposition", "Calculer une aire par différence"],
volpave: ["Calculer le volume d'un pavé", "Calculer l'aire totale d'un cube ou d'un pavé", "Passer d'un volume à une contenance"],
solides: ["Décrire un cube ou un pavé", "Décrire un prisme droit ou une pyramide", "Décrire un prisme droit ou une pyramide"] ,
proptab: ["Trouver un coefficient de proportionnalité", "Trouver un coefficient de proportionnalité", "Compléter un tableau de proportionnalité"],
change: ["Convertir des euros en francs", "Convertir des francs en euros", "Comparer des prix en deux monnaies"],
agrand: ["Trouver le facteur d'agrandissement", "Agrandir ou réduire une longueur", "Agrandir ou réduire avec une fraction"],
litelab: ["Écrire une expression littérale", "Écrire un périmètre avec une lettre", "Écrire et réduire une expression littérale"],
angtype: ["Utiliser l'angle plat", "Utiliser l'angle plein", "Reconnaître angles aigus et obtus"],
quadri: ["Utiliser les propriétés du losange et du carré", "Utiliser les angles du parallélogramme", "Connaître symétries et diagonales des quadrilatères"],

rel: ["Additionner des nombres relatifs", "Multiplier des relatifs avec les priorités", "Calculer avec des puissances de relatifs"],
vol: ["Calculer le volume d'un pavé", "Calculer le volume d'un prisme droit", "Retrouver une dimension d'un cylindre"],
fracmul: ["Multiplier des fractions", "Diviser des fractions", "Calculer avec des fractions et des parenthèses"],
pct: ["Calculer un pourcentage d'une quantité", "Calculer un prix après une baisse", "Retrouver une valeur de départ"],
puiss: ["Multiplier des puissances de même base", "Calculer avec des exposants négatifs", "Utiliser les règles des puissances"],
sci: ["Écrire en notation scientifique", "Calculer en notation scientifique", "Calculer en notation scientifique"],
rac: ["Calculer une racine carrée", "Encadrer une racine carrée", "Résoudre un problème avec une racine carrée"],
racprop: ["Utiliser une propriété des racines", "Simplifier ou extraire une racine", "Calculer avec des racines carrées et cubiques"],
disque: ["Calculer le périmètre d'un cercle", "Calculer l'aire d'un disque", "Calculer un arc ou un secteur"],
vitesse: ["Calculer une vitesse", "Calculer une durée", "Calculer une vitesse moyenne sur un trajet"],
pyth: ["Calculer l'hypoténuse", "Calculer une cathète", "Utiliser Pythagore dans une figure"],
reduire: ["Réduire une expression du 1er degré", "Réduire une expression du 2e degré", "Réduire après avoir supprimé des parenthèses"],
distrib: ["Développer avec la simple distributivité", "Développer avec la double distributivité", "Développer avec la double distributivité"],
eq1: ["Résoudre une équation du type ax + b = c", "Résoudre une équation avec parenthèses", "Résoudre une équation avec fractions"],
probeq: ["Mettre un problème en équation", "Mettre un problème en équation", "Mettre un problème en équation (2e degré)"],
echelle: ["Utiliser une échelle", "Passer de la carte à la réalité (et inversement)", "Trouver et utiliser une échelle (plans, cartes, maquettes)"],
affine: ["Calculer l'image par une fonction affine", "Calculer la pente d'une droite", "Calculer une préimage par une fonction affine"],
polyreg: ["Calculer l'angle au centre d'un polygone régulier", "Calculer l'angle intérieur d'un polygone régulier", "Retrouver le nombre de côtés"],
grandmanq: ["Retrouver une longueur à partir de l'aire", "Retrouver une hauteur à partir de l'aire", "Retrouver une dimension à partir de l'aire"],
fracops: ["Soustraire des fractions (résultat négatif)", "Multiplier et diviser des fractions relatives", "Calculer avec des fractions et les priorités"],
airelat: ["Calculer l'aire latérale d'un prisme", "Calculer l'aire latérale d'un cylindre", "Calculer l'aire totale d'un cylindre"],
voldecomp: ["Calculer le volume d'un solide composé", "Calculer le volume d'un solide composé", "Calculer une contenance en litres"],
carres: ["Calculer une racine carrée exacte", "Calculer une racine décimale ou cubique simple", "Encadrer une racine, racine d'une somme"],
racenc: ["Encadrer une racine carrée", "Comparer une racine et un entier", "Encadrer une racine carrée"],
scicalc: ["Multiplier en notation scientifique", "Diviser en notation scientifique", "Écrire le résultat en notation scientifique"],
monomes: ["Multiplier des monômes", "Multiplier des monômes", "Calculer la puissance d'un monôme"],
pythfig: ["Calculer la diagonale d'un rectangle", "Calculer la hauteur d'un triangle isocèle", "Calculer la diagonale d'un pavé"],
eqverif: ["Vérifier une solution", "Vérifier une solution", "Vérifier les solutions d'une équation du 2e degré"],
pctvar: ["Calculer une augmentation", "Calculer une réduction", "Retrouver un prix ou un pourcentage de variation"],
pente: ["Calculer une pente", "Calculer un dénivelé", "Calculer une distance horizontale"],
repere: ["Lire des coordonnées", "Distance d'un point aux axes", "Trouver un sommet d'un rectangle"],
tabval: ["Calculer une image (fonction affine)", "Calculer une image (fonction du 2e degré)", "Calculer une image (fonctions diverses)"],
rotation: ["Trouver l'angle d'une rotation", "Trouver l'angle d'une rotation", "Trouver l'image d'un point par une rotation"],

proba: ["Calculer une probabilité simple", "Calculer une probabilité avec deux dés", "Calculer une probabilité sans remise"],
volcone: ["Calculer le volume d'une pyramide", "Calculer le volume d'une boule", "Calculer le volume d'un cône"],
gquot: ["Convertir une vitesse", "Utiliser la masse volumique", "Utiliser un débit"],
thales: ["Calculer une longueur avec Thalès", "Calculer une longueur avec Thalès", "Résoudre un problème avec Thalès"],
idrem: ["Développer (a + b)²", "Développer (a + b)(a − b)", "Développer (a − b)²"],
factor: ["Factoriser par mise en évidence", "Factoriser une différence de deux carrés", "Factoriser un carré parfait"],
formule: ["Transformer une formule", "Transformer une formule", "Transformer une formule (racine)"],
eq2: ["Résoudre une équation produit nul", "Résoudre en mettant x en évidence", "Résoudre avec une différence de carrés"],
eq2disc: ["Résoudre une équation du 2e degré", "Résoudre une équation du 2e degré", "Résoudre une équation du 2e degré (racines)"],
sys2: ["Résoudre un système de deux équations", "Résoudre un système de deux équations", "Mettre un problème en système"],
angles: ["Angle au centre et angle inscrit", "Angle au centre et angle inscrit", "Utiliser le cercle de Thalès"],
simil: ["Utiliser des triangles semblables", "Agrandir une aire (rapport k²)", "Agrandir un volume (rapport k³)"],
pythrec: ["Repérer l'hypoténuse", "Reconnaître un triangle rectangle", "Montrer qu'un triangle n'est pas rectangle"],
airepyr: ["Calculer l'aire latérale d'une pyramide", "Calculer l'aire totale d'une pyramide", "Calculer l'apothème puis l'aire"],
volcomp: ["Calculer le volume d'un solide composé", "Calculer le volume d'un solide composé", "Calculer le volume d'un solide composé"],
volmanq: ["Retrouver la hauteur d'un pavé", "Retrouver la hauteur d'un cylindre", "Retrouver le rayon d'un cône"],
ucomp: ["Convertir des km/h en m/s", "Convertir des m/s en km/h", "Convertir une masse volumique ou un débit"],
parenth: ["Supprimer des parenthèses", "Supprimer des parenthèses", "Supprimer des parenthèses (2e degré)"],
eqfrac: ["Résoudre une équation avec parenthèses", "Résoudre une équation avec une fraction", "Résoudre une équation avec plusieurs fractions"],
eq2fact: ["Résoudre x² = a", "Résoudre en mettant x en évidence", "Résoudre en factorisant"],
probeq2: ["Résoudre un problème du 2e degré", "Résoudre un problème du 2e degré", "Résoudre un problème du 2e degré"],
cercthales: ["Utiliser le cercle de Thalès", "Utiliser une tangente au cercle", "Utiliser le cercle de Thalès"],
thalesrec: ["Utiliser la réciproque de Thalès", "Utiliser la réciproque de Thalès", "Reconnaître des droites parallèles"],
sysprob: ["Résoudre un problème avec somme et différence", "Mettre un problème en système", "Mettre un problème en système"],
denombr: ["Dénombrer avec un arbre", "Dénombrer sans répétition", "Dénombrer des paires"],

polyop: ["Développer un produit de polynômes", "Développer avec des identités", "Développer un cube"],
factor2: ["Factoriser par mise en évidence", "Factoriser un trinôme", "Factoriser par groupements"],
eq3: ["Résoudre une équation de degré 3", "Résoudre une équation de degré 3", "Résoudre une équation de degré 3"],
sys3: ["Résoudre un système triangulaire", "Résoudre un système de trois équations", "Mettre un problème en système de trois équations"],
domaine: ["Trouver un domaine de définition", "Trouver un domaine de définition", "Trouver un domaine (2e degré sous la racine)"],
fimg: ["Calculer une image", "Calculer une image", "Trouver des préimages"],
f2: ["Trouver les zéros d'une parabole", "Trouver le sommet d'une parabole", "Trouver le sommet d'une parabole"],
f2expr: ["Retrouver une parabole par ses zéros", "Retrouver une parabole par son sommet", "Retrouver une parabole par trois points"],
inter: ["Intersection d'une parabole et d'une droite", "Intersection d'une parabole et d'une droite", "Intersection d'une parabole et d'une droite"],
ineq2: ["Résoudre une inéquation produit", "Résoudre une inéquation du 2e degré", "Comparer deux fonctions"],
racinv: ["Calculer une préimage par la fonction inverse", "Résoudre une équation avec une racine", "Intersection d'une hyperbole et d'une droite"],
euclide: ["Utiliser le théorème de la hauteur", "Utiliser le théorème d'Euclide", "Calculer la hauteur relative à l'hypoténuse"],
droitesrem: ["Utiliser le centre de gravité", "Utiliser les bissectrices", "Utiliser le cercle circonscrit"],
trigo: ["Calculer un côté avec sin, cos, tan", "Calculer un angle avec sin, cos, tan", "Résoudre un problème de trigonométrie"],
trinfact: ["Factoriser un trinôme par ses zéros", "Factoriser un trinôme par ses zéros", "Factoriser un trinôme par ses zéros"],
exactes: ["Diagonale d'un carré en valeur exacte", "Hauteur d'un triangle équilatéral en valeur exacte", "Aire en valeur exacte"],
sysgraph: ["Système sans solution (droites parallèles)", "Système sans solution", "Système avec une infinité de solutions"],
optim: ["Trouver où une fonction atteint son maximum", "Calculer une hauteur maximale", "Résoudre un problème d'optimisation"],
eqspec: ["Reconnaître une équation impossible", "Reconnaître une équation impossible", "Reconnaître une équation indéterminée"],
bicarre: ["Résoudre une équation bicarrée", "Résoudre une équation bicarrée", "Résoudre une équation bicarrée"],
lectgraph: ["Lire les zéros sur un graphique", "Lire les variations sur un graphique", "Résoudre graphiquement f(x) = k"],
affzero: ["Calculer le zéro d'une fonction affine", "Étudier le signe d'une fonction affine", "Étudier le signe d'une fonction affine"],
f2formes: ["Passer de la forme canonique à la forme développée", "Écrire la forme canonique", "Passer de la forme factorisée à la forme canonique"],
f2trois: ["Retrouver une parabole par trois points", "Retrouver une parabole par trois points", "Retrouver une parabole par trois points"],
interpar: ["Intersection de deux paraboles", "Intersection de deux paraboles", "Nombre de points d'intersection"],
modaff: ["Modéliser un tarif", "Comparer deux offres", "Comparer deux offres"],
trigexact: ["Utiliser les valeurs exactes de 30° et 60°", "Utiliser les valeurs exactes de 30°, 45° et 60°", "Relier pente et angle"],
geocomb: ["Enchaîner Pythagore et l'aire", "Calculer une hauteur par les aires", "Combiner Pythagore et trigonométrie"],

polydiv: ["Calculer le reste d'une division", "Diviser un polynôme par x − a", "Trouver un paramètre pour que la division tombe juste"],
polyfact: ["Résoudre avec une racine connue", "Trouver une racine évidente", "Résoudre une équation de degré 4"],
fracrat: ["Simplifier une fraction rationnelle", "Additionner des fractions rationnelles", "Simplifier une fraction rationnelle"],
eqrat: ["Résoudre une équation rationnelle simple", "Résoudre une proportion", "Résoudre une équation rationnelle"],
symetries: ["Trouver l'image d'un point par une symétrie d'axe Ox ou Oy", "Trouver l'image par une symétrie centrale ou une translation", "Symétrie d'axe x = c ou de centre quelconque"],
sysineq: ["Résoudre un système d'inéquations simple", "Résoudre un système d'inéquations (coefficient négatif)", "Reconnaître un système sans solution ou à une borne"],
ineqfrac: ["Résoudre une inéquation fractionnaire simple", "Résoudre une inéquation fractionnaire avec coefficients", "Ramener une inéquation fractionnaire à 0"],
eqirr: ["Résoudre une équation avec une racine", "Résoudre une équation irrationnelle et rejeter les solutions parasites", "Résoudre une équation irrationnelle plus complexe"],
morceaux: ["Calculer une image d'une fonction par morceaux", "Résoudre une équation avec une fonction par morceaux", "Rendre une fonction par morceaux continue"],
transf: ["Lire le sommet après une translation", "Transformer un point par une translation", "Transformer un point par translation et étirement"],
trigrel: ["Calculer cos à partir de sin", "Calculer tan à partir de cos", "Calculer une valeur exacte avec sin² + cos² = 1"],
expfrac: ["Calculer une puissance à exposant fractionnaire", "Calculer une puissance à exposant fractionnaire négatif", "Écrire un produit de racines comme une puissance"],
vecteurs: ["Calculer les composantes d'un vecteur", "Calculer une norme ou une combinaison de vecteurs", "Utiliser le produit scalaire"],
ineq: ["Résoudre une inéquation du 1er degré", "Résoudre avec x des deux côtés, des parenthèses ou des fractions", "Résoudre une double inégalité, comparer des offres"],
recip: ["Calculer avec une réciproque", "Calculer avec une composée", "Trouver l'expression d'une réciproque"],
absval: ["Résoudre une équation avec valeur absolue", "Résoudre une équation avec valeur absolue", "Reconnaître une équation sans solution"],
homog: ["Trouver l'asymptote verticale", "Trouver l'asymptote horizontale", "Trouver la réciproque d'une homographique"],
trigfn: ["Lire l'amplitude d'une sinusoïde", "Calculer la période d'une sinusoïde", "Trouver le maximum d'une sinusoïde"],
expo: ["Résoudre une équation exponentielle", "Résoudre une équation exponentielle", "Calculer des intérêts composés"],
log: ["Calculer un logarithme", "Résoudre avec un logarithme", "Utiliser les propriétés du logarithme"],
trigcercle: ["Convertir des degrés en radians", "Valeurs exactes sur le cercle trigonométrique", "Coordonnées d'un point du cercle trigonométrique"],
trigeq: ["Résoudre sin x = c", "Résoudre cos x = c", "Résoudre tan x = c"],
sinlaw: ["Utiliser le théorème du sinus", "Utiliser le théorème du cosinus", "Calculer un angle avec le cosinus"],
cart: ["Calculer une distance entre deux points", "Calculer un milieu", "Trouver l'équation d'une droite"],
droites: ["Trouver l'équation d'une droite", "Trouver une droite perpendiculaire", "Trouver l'intersection de deux droites"],
cercle: ["Lire centre et rayon d'un cercle", "Trouver le rayon (compléter les carrés)", "Intersection d'un cercle et d'une droite"],
valint: ["Trouver une valeur interdite", "Trouver les valeurs interdites", "Trouver les valeurs interdites (factoriser)"],
modexp: ["Calculer des intérêts composés", "Calculer une croissance par doublements", "Trouver un temps de doublement"],
compo: ["Calculer avec une composée", "Trouver l'expression d'une composée", "Comparer f ∘ g et g ∘ f"],
fracetage: ["Simplifier une fraction à étages", "Simplifier une fraction à étages", "Simplifier une fraction à étages"],
probrat: ["Résoudre un problème de travail en commun", "Résoudre un problème de travail en commun", "Résoudre un problème de vitesse"],
bijection: ["Restreindre une fonction pour une bijection", "Restreindre une fonction pour une bijection", "Reconnaître une fonction injective"],
decomp: ["Décomposer une fonction", "Décomposer une fonction", "Décomposer une fonction"],
polyexpr: ["Retrouver un polynôme par ses zéros", "Retrouver un polynôme (zéro double)", "Modéliser avec un polynôme"],
homogrec: ["Trouver la réciproque d'une homographique", "Trouver la réciproque d'une homographique", "Calculer une préimage par une homographique"],
trigassoc: ["Utiliser les angles associés", "Utiliser les angles complémentaires", "Utiliser sin² + cos² = 1"],
trigeq2: ["Résoudre sin(kx) = c", "Trouver amplitude et valeur moyenne", "Modéliser un phénomène périodique"],
logbase: ["Changer de base (valeur exacte)", "Changer de base (calculatrice)", "Enchaîner des changements de base"],
triaire: ["Calculer l'aire d'un triangle avec le sinus", "Calculer l'aire d'un triangle avec le sinus", "Calculer une distance avec le cosinus"],
droitesinter: ["Trouver l'intersection de deux droites", "Trouver une médiatrice", "Trouver une hauteur d'un triangle"],
cercletan: ["Trouver un cercle par son diamètre", "Rayon d'un cercle tangent à une droite", "Pente d'une tangente à un cercle"],

ensembles: ["Compter les entiers d'un intervalle", "Lire des bornes ouvertes ou fermées", "Intersection de deux intervalles"],
vabs: ["Calculer une valeur absolue", "Calculer avec des valeurs absolues", "Calculer avec des valeurs absolues"],
ratden: ["Rendre un dénominateur rationnel", "Rendre un dénominateur rationnel", "Utiliser l'expression conjuguée"],
eqparam: ["Équation sans solution selon un paramètre", "Équation sans solution selon un paramètre", "Solution double selon un paramètre"],
statfreq: ["Calculer une fréquence", "Calculer un effectif cumulé", "Calculer l'angle d'un secteur"],
quartiles: ["Calculer une étendue", "Calculer une médiane", "Calculer l'écart interquartile"],
stats: ["Calculer une moyenne", "Calculer une médiane", "Calculer un écart-type"],
};


function compOf(id, d) {
const L = COMPS[id];
if (!L) return id + ":0";
const k = Math.min(d, 3) - 1, i = L.indexOf(L[k]);
return id + ":" + i;
}

function compsOf(id) {
const L = COMPS[id] || [NOTIONS.find((n) => n.id === id).label];
return L.map((label, i) => ({ cid: id + ":" + i, label, i })).filter((c) => L.indexOf(c.label) === c.i);
}




function compNote(rec) {
if (!rec || rec.r.length < 3) return null;
const avg = rec.r.reduce((a, b) => a + b, 0) / rec.r.length, n = Math.round((1 + 5 * avg) * 2) / 2;
return n > 5 && !rec.hi && Math.max(rec.r.length, rec.n || 0) < 5 ? 5 : n;
}













const Referentiel = (() => {
const FR_Y = { 6: "6e", 7: "5e", 8: "4e", 9: "3e", 10: "2nde", 11: "1re", 12: "Terminale" };
const SYS = {


CO: {
data: () => (typeof REF_CO !== "undefined" ? REF_CO : null),
applies: (p) => p.system === "CH" && p.track !== "mp" && p.grade >= 9 && p.grade <= 11,
year: (p) => p.grade,
years: (p) => Array.from({ length: p.grade - 8 }, (_, i) => i + 9),
yearLabel: (y) => y + "e",
allowed: () => true,
track: () => "",
title: "Plan d'études romand",
intro: "Les apprentissages du Plan d'études romand (PER) pour ton année, par axe. Chacun reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
},


MP: {
data: () => (typeof REF_MP !== "undefined" ? REF_MP : null),
applies: (p) => p.system === "CH" && p.track === "mp" && p.grade >= 12 && p.grade <= 15,
year: (p) => p.grade - 11,
yearLabel: (y) => "MP " + (y === 1 ? "1re" : y + "e"),
allowed: () => true,
track: () => "",
catalogOnly: () => [12, 13, 14, 15].map((grade) => ({ system: "CH", grade, track: "mp", minutes: 5 })),
title: "maturité professionnelle",
intro: "Les objectifs du plan d'études de mathématiques de la maturité professionnelle, semestre par semestre. Chacun reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
},
MATU: {
data: () => (typeof REF_MATU !== "undefined" ? REF_MATU : null),
applies: (p) => p.system === "CH" && p.track === "college" && p.grade >= 12 && p.grade <= 15,
year: (p) => p.grade - 11,
yearLabel: (y) => (y === 1 ? "1re" : y + "e"),

allowed: (p, niv) => niv === 0 || (niv === 1 ? p.niv === "R" : p.niv !== "R"),
track: (p) => (p.grade >= 14 ? (p.niv === "R" ? "MA2" : "MA1") : ""),
title: "Collège",
intro: "Les compétences officielles du programme du Collège. Chacune reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
},



FR: {
data: () => (typeof REF_FR !== "undefined" ? REF_FR : null),
applies: (p) => p.system === "FR" && p.grade >= 6 && p.grade <= 12,
year: (p) => p.grade,
years: (p) => Array.from({ length: p.grade - 5 }, (_, i) => i + 6),
yearLabel: (y) => FR_Y[y],
allowed: () => true,
track: (p) => (p.grade === 11 || p.grade === 12 ? "spécialité" : ""),

olds: (p) => (p.grade <= 9 ? [["Années précédentes", Array.from({ length: p.grade - 6 }, (_, i) => p.grade - 1 - i)]]
: [...Array.from({ length: p.grade - 10 }, (_, i) => [FR_Y[p.grade - 1 - i], [p.grade - 1 - i]]), ["Collège (6e–3e)", [9, 8, 7, 6]]]),
catalogOnly: () => [6, 7, 8, 9, 10, 11, 12].map((grade) => ({ system: "FR", grade, track: "college", minutes: 5 })),
fr: true,
title: "programme de mathématiques",
intro: (p) => (p.grade <= 9 ? "Les attendus de fin d'année du programme officiel de mathématiques de ta classe." : "Les capacités attendues et les automatismes du programme officiel de mathématiques de ta classe.")
+ " Chacun reçoit un niveau de maîtrise (insuffisante, fragile, satisfaisante, très bonne) dès que tu as répondu 3 fois à ses questions. Il suit tes 8 dernières réponses : il monte quand tu progresses.",
},
};
const cache = {};
const sysOf = (p) => { if (!p) return null; for (const k in SYS) if (SYS[k].applies(p) && SYS[k].data()) return k; return null; };


const rows = (k) => {
if (cache[k]) return cache[k];
const D = SYS[k].data();

return (cache[k] = D.c.map(([code, niv, th, no, label, y, y2]) => { const year = y === undefined ? +code[0] : y; return { code, year, y2: y2 === undefined ? year : y2, niv, theme: D.th[th], notion: D.no[no], label, links: D.q[code] || [], forms: (D.f && D.f[code]) || null }; }));
};



const catSet = {};
const catOk = (k, id) => {
if (!catSet[k]) { catSet[k] = new Set(); SYS[k].catalogOnly().forEach((p) => Engine.catalog(p).forEach((c) => catSet[k].add(c.id))); }
return catSet[k].has(id);
};
const rowsOf = (k) => {
const rs = rows(k);
if (!SYS[k].catalogOnly || rs.filtered) return rs;
rs.forEach((r) => { r.links = r.links.filter((s) => catOk(k, s.split("@")[0])); });
rs.filtered = true;
return rs;
};

const pairs = (r) => r.links.flatMap((s) => { const [id, lv] = s.split("@"); return (lv ? lv.split("") : ["1", "2", "3"]).map((d) => [id, +d]); });

const cids = (r) => [...new Set(pairs(r).map(([id, d]) => compOf(id, d)))];

const formsC = {};
const formsAt = (p, id, d) => {
const k = [p.system, p.grade, p.track, p.niv, id, d].join("|");
if (!formsC[k]) { const st = { profile: p }, cs = new Set(); for (let s = 1; s <= 30; s++) { try { const q = Engine.make(st, id, d, s); if (q && q.ctx) cs.add(q.ctx); } catch (e) { break; } } formsC[k] = [...cs]; }
return formsC[k];
};
return {
of: sysOf,
title: (p) => { const k = sysOf(p); return k ? SYS[k].title : ""; },
intro: (p) => { const S = SYS[sysOf(p)], t = S.intro; return typeof t === "function" ? t(p) : t; },
isFR: (p) => !!SYS[sysOf(p)].fr,

olds(p) {
const S = SYS[sysOf(p)];
if (S.olds) return S.olds(p).filter(([, ys]) => ys.length);
const ys = this.years(p).filter((y) => y < S.year(p)).reverse();
return ys.length ? [["Années précédentes", ys]] : [];
},
yearLabel: (p, y) => SYS[sysOf(p)].yearLabel(y),
track: (p) => SYS[sysOf(p)].track(p),
year: (p) => SYS[sysOf(p)].year(p),



list(p, y) {
const k = sysOf(p), S = SYS[k], y0 = S.year(p), yy = y || y0;
return rowsOf(k).filter((r) => (yy === y0 ? r.year <= yy && r.y2 >= yy : r.y2 === yy) && S.allowed(p, r.niv));
},
years(p) { const S = SYS[sysOf(p)]; if (S.years) return S.years(p); const y = this.year(p); return Array.from({ length: y }, (_, i) => i + 1); },
find(p, code) { const k = sysOf(p); return k ? rowsOf(k).find((r) => r.code === code) || null : null; },
cids,


note(st, r) {
const recs = cids(r).map((c) => (st.comps || {})[c]).filter((x) => x && x.r && x.r.length);
if (!recs.length) return null;
recs.sort((a, b) => String(a.last || "").localeCompare(String(b.last || "")));
return compNote({ r: recs.flatMap((x) => x.r).slice(-8), n: recs.reduce((a, x) => a + (x.n || x.r.length), 0), hi: recs.some((x) => x.hi) });
},
hasQuestions: (r) => r.links.length > 0,



plan(p, r) {
const ok = new Set(Engine.catalog(p).map((c) => c.id)), gen = (id) => typeof GEN === "undefined" || GEN[id];


const fit = ([id, d]) => !r.forms || !r.forms[id] || formsAt(p, id, d).some((c) => r.forms[id].includes(c));
let ps = pairs(r).filter(([id]) => ok.has(id) && gen(id)).filter(fit);
if (!ps.length) { const k = sysOf(p); ps = pairs(r).filter(([id]) => gen(id) && (SYS[k].catalogOnly ? catOk(k, id) : NOTIONS.some((n) => n.id === id))).filter(fit); }
return ps;
},

forms: (r, id) => (r && r.forms && r.forms[id]) || null,
stats(st, list) {
const notes = list.map((r) => this.note(st, r)).filter((x) => x !== null);
return { total: list.length, tested: notes.length, avg: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null };
},
};
})();






const TRX = (function () {
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => R.nz(a, b);
const r6 = (v) => +(+v).toFixed(9);
const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };

const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };

const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d || d > 400) return String(v); return Math.round(v * d) + "/" + d; };
const dT = (v, k = 4) => nb(+(+v).toFixed(k));
const rd = (v, r) => +(Math.round(v / r) * r).toFixed(6);
const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.e) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
if (tr.spec) {
if (tr.spec.kind !== spec.kind) return false;
if (tr.spec.kind === "pair" && (tr.spec.values.length !== spec.values.length || !tr.spec.values.every(isFinite))) return false;
const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false);
if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
if (spec.kind !== "value") return false;
const tol = Math.max(spec.round || 0, 1e-9), k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; for (const k of ["fig", "canon", "calcul"]) if (o[k] !== undefined) x[k] = o[k]; return x; };
const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value: r6(value) }, o.radical ? { radical: true } : {}), sol, Object.assign({ canon: fS(value) }, o));
const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, Object.assign({ canon: String(rd(value, round)).replace(".", ",") }, o));
const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
const QSet = (q, vals, sol, o) => { const v = [...new Set(vals.map(r6))].sort((a, b) => a - b); return mk(q, { kind: "set", values: v }, sol, Object.assign({ canon: v.map(fS).join(" ; ") }, o)); };
const QP = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o)) : null);
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const GR = (ask, value, sol, round) => ({ ask, spec: Object.assign({ kind: "value", value: round ? value : r6(value) }, round ? { round } : {}), sol });
const GRad = (ask, value, sol) => ({ ask, spec: { kind: "value", value: r6(value), radical: true }, sol });
const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
const TR = TRAP, TX = (e, m) => ({ e, m }), TSt = (s, m) => ({ s, m }), TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m }), TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });

const P = (q, parts, hints, sol, fig) => ({ fig, q, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: round ? value : r6(value) }, round ? { round } : {}) })), hints });

const reg = (defs) => {
for (const d of defs) {
if (!NOTIONS.some((n) => n.id === d.id)) NOTIONS.push(Object.assign({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: d.CH || null, MP: null, FR: d.FR || null }, d.againFR ? { againFR: d.againFR } : {}, d.niv ? { niv: d.niv } : {}));
GEN[d.id] = (lv) => pickForm(d.lv[Math.min(Math.max(lv, 1), 3)]);
if (typeof VAR !== "undefined") VAR[d.id] = {};
HINTS_EXTRA[d.id] = d.hint;
LESSONS_EXTRA[d.id] = d.lesson;
if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
if (d.probs && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[d.id] = d.probs;
if (d.act) actReg({ [d.id]: d.act });
}
};



const actReg = (defs) => { try { Object.assign(ACTIVE, defs); } catch (e) { Object.assign((window.ACT_LATER = window.ACT_LATER || {}), defs); } };

const anb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");


const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? '<div class="small muted">' + o.note + "</div>" : "");
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = anb(x).replace("−", "-");
const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || "Pas encore : regarde le coup de pouce, puis recalcule."); } };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
draw();
};
const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });

const toi = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => '<div class="act-out">' + cp[s] + "<br>tu proposes <b>" + anb(x) + "</b></div>", wins });

const sv = (w, h, g, lab) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + lab + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
const tx = (x, y, s, a = "middle", sz = 13, cls = "f-txt") => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + cls + '" text-anchor="' + a + '" font-size="' + sz + '">' + s + "</text>";
const ln = (x1, y1, x2, y2, cls = "f-line", ex = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '"' + ex + "/>";
const pg = (pts, cls = "f-shape", ex = "") => '<polygon points="' + pts.map((p) => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ") + '" class="' + cls + '"' + ex + "/>";
const DASH = ' stroke-dasharray="5 4"';




const solid = (o) => {
const k = 0.5 * Math.SQRT1_2, raw = (p) => [p[0] + k * p[1], -(p[2] + k * p[1])], P0 = o.pts;
const all = Object.values(P0).map(raw).concat(o.extra ? o.extra.map(raw) : []);
const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
const Wm = o.W || 300, mg = 26, s = Math.min((Wm - 2 * mg) / Math.max(x1 - x0, 1e-9), ((o.H || 210) - 2 * mg) / Math.max(y1 - y0, 1e-9));
const H = Math.round((y1 - y0) * s + 2 * mg), X = (p) => { const r = raw(p); return [mg + (r[0] - x0) * s, mg + (r[1] - y0) * s]; }, Q = (n) => X(P0[n]);
let g = "";
for (const F of o.faces || []) g += pg(F.map(Q), "f-shape2", ' style="stroke:none;fill-opacity:.55"');
for (const F of o.polys || []) g += pg(F.map(Q), "f-fill2", ' style="fill-opacity:.75"');
for (const [a, b, hid] of o.edges || []) { const A = Q(a), B = Q(b); g += ln(A[0], A[1], B[0], B[1], "f-line", ' stroke-width="1.8"' + (hid ? DASH : "")); }
for (const [a, b, hid] of o.accent || []) { const A = Q(a), B = Q(b); g += ln(A[0], A[1], B[0], B[1], "f-accent", ' stroke-width="2.6"' + (hid ? DASH : "")); }
for (const [a, b, t, dx = 0, dy = 0] of o.marks || []) { const A = Q(a), B = Q(b); g += tx((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, "middle", 12, "f-accent f-txt"); }
const cx = mg + ((x0 + x1) / 2 - x0) * s, cy = mg + ((y0 + y1) / 2 - y0) * s;
for (const n of o.labels || Object.keys(P0)) { const A = Q(n), dx = A[0] - cx, dy = A[1] - cy, d = Math.hypot(dx, dy) || 1; g += tx(A[0] + (11 * dx) / d, A[1] + (11 * dy) / d + 4, n, "middle", 13); }
for (const n of o.dots || []) { const A = Q(n); g += '<circle cx="' + A[0].toFixed(1) + '" cy="' + A[1].toFixed(1) + '" r="3.5" class="f-dot"/>'; }
return sv(Wm, H, g, o.lab || "solide en perspective");
};
return { pk, nz, r6, den, fT, fS, dT, rd, mk, QN, QR, QX, QSet, QP, QS, GR, GRad, GX, GSet, GP, GSS, TR, TX, TSt, TP, TS, P, reg, actReg, W, toi, sv, tx, ln, pg, DASH, solid };
})();

