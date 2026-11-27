

(function () {
const { N, pk, g2, X, ul, who, tab, VF, par } = RX;
const T = (v) => M(N(v));
const Q0 = (v, s) => RX.Q(v, s || "CHF");
const fem = (w) => ["Lina", "Inès", "Mia", "Elsa"].includes(w);
const fr = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const sl = (n, d) => { const g = g2(n, d) || 1; return d / g === 1 ? String(n / g) : n / g + "/" + d / g; };
const fact = (n) => { const f = {}; let k = 2; while (n > 1) { while (n % k === 0) { f[k] = (f[k] || 0) + 1; n /= k; } k++; } return f; };
const factX = (n) => Object.entries(fact(n)).map(([p, e]) => p + (e > 1 ? "^{" + e + "}" : "")).join(" \\cdot ");
const lcm = (a, b) => (a * b) / g2(a, b);
const hh = (x) => Math.floor(x / 60) + " h " + String(x % 60).padStart(2, "0");

const EX = [

() => { let a, f, S; do { a = pk([3, 4, 5]); f = pk([[1, 2], [2, 3], [1, 3], [3, 5], [3, 4]]); S = pk([60, 80, 90, 120, 150, 180, 240]); } while ((S * (a - 1)) % a || ((S * (a - 1)) / a) % f[1]);
const r1 = [a - 1, a], c = [f[0] * (a - 1), f[1] * a], rest = [(f[1] - f[0]) * (a - 1), f[1] * a], Rv = (S * rest[0]) / rest[1], w = who(), K = pk([["un livre", "une place de concert"], ["un jeu vidéo", "un abonnement de bus"], ["un pull", "une sortie au cinéma"]]);
return X({ id: "fracmul", lv: 1, titre: "L'argent de poche",
q: w + " dépense " + M(fr(1, a)) + " de son argent de poche pour " + K[0] + ". " + (fem(w) ? "Elle" : "Il") + " utilise ensuite " + M(fr(f[0], f[1])) + " de ce qui reste pour " + K[1] + ". Il lui reste alors " + Q0(Rv) + ".",
parts: [{ label: "Quelle fraction de l'argent de poche reste-t-il après le premier achat ?", pts: 1 }, { label: "Quelle fraction de l'argent de poche total coûte le second achat ?", pts: 1 }, { label: "Quelle fraction du total reste-t-il à la fin ?", pts: 1 }, { label: "Combien d'argent de poche " + w + " avait-" + (fem(w) ? "elle" : "il") + " au départ ? Réponds par une phrase.", pts: 1 }],
sol: ul([M("1 - " + fr(1, a) + " = " + fr(r1[0], r1[1])) + ".", M(fr(f[0], f[1]) + " \\cdot " + fr(r1[0], r1[1]) + " = " + fr(c[0], c[1])) + " du total.", M(fr(r1[0], r1[1]) + " - " + fr(c[0], c[1]) + " = " + fr(rest[0], rest[1])) + ".", M(fr(rest[0], rest[1])) + " du total valent " + Rv + " CHF, donc le total vaut " + M(Rv + " : " + fr(rest[0], rest[1]) + " = " + S) + ". « " + w + " avait " + S + " CHF au départ. »"]),
chk: [[c[0] / c[1], sl(c[0], c[1])], [rest[0] / rest[1], sl(rest[0], rest[1])], [(Rv * rest[1]) / rest[0], String(S)]] }); },

() => { let L, l, s; do { s = pk([12, 15, 18, 20, 24, 25, 30]); L = s * pk([7, 8, 9, 11, 13]); l = s * pk([4, 5, 6]); } while (g2(L, l) !== s);
const n = (L / s) * (l / s), prix = pk([4, 5, 6]);
return X({ id: "arith", lv: 2, titre: "Le carrelage",
q: "Une salle de bain rectangulaire mesure " + Q0(L, "cm") + " sur " + Q0(l, "cm") + ". On veut la couvrir de carreaux carrés identiques, sans découpe, les plus grands possible. Un carreau coûte " + Q0(prix) + ".",
parts: [{ label: "Décompose " + L + " et " + l + " en produit de facteurs premiers (notation avec puissances).", pts: 2 }, { label: "Quel est le côté des carreaux ? Justifie.", pts: 1 }, { label: "Combien de carreaux faut-il ? Combien coûtent-ils ?", pts: 2 }],
sol: ul([M(L + " = " + factX(L)) + " ; " + M(l + " = " + factX(l)) + ".", "Le côté doit diviser " + L + " et " + l + " : c'est le PGDC, produit des facteurs communs avec le plus petit exposant, " + M("\\text{PGDC} = " + factX(s) + " = " + s) + " cm.", M((L / s) + " \\cdot " + (l / s) + " = " + n) + " carreaux ; " + M(n + " \\cdot " + prix + " = " + n * prix) + " CHF."]),
chk: [[g2(L, l), String(s)], [(L * l) / (s * s), String(n)]] }); },

() => { let a, b; do { a = pk([6, 8, 9, 10, 12, 15]); b = pk([8, 10, 12, 14, 15, 18, 20]); } while (a === b || lcm(a, b) === a * b || lcm(a, b) === Math.max(a, b) || lcm(a, b) > 90);
const p = lcm(a, b), h0 = pk([6, 7]), m0 = pk([0, 15, 30]), t = h0 * 60 + m0 + p;
return X({ id: "premiers", lv: 1, titre: "Les deux lignes de bus",
q: "Au terminus, un bus de la ligne 12 part toutes les " + a + " minutes et un bus de la ligne 15 toutes les " + b + " minutes. À " + hh(h0 * 60 + m0) + ", deux bus partent en même temps. Le trajet de la ligne 12 dure 35 minutes.",
parts: [{ label: "Décompose " + a + " et " + b + " en facteurs premiers.", pts: 1 }, { label: "Après combien de minutes les deux bus repartiront-ils ensemble ? Justifie.", pts: 2 }, { label: "À quelle heure ? Combien de bus de chaque ligne seront partis entre-temps (en comptant le départ de " + hh(h0 * 60 + m0) + ") ?", pts: 2 }],
sol: ul([M(a + " = " + factX(a)) + " ; " + M(b + " = " + factX(b)) + ".", "C'est le PPMC : tous les facteurs, avec le plus grand exposant, " + M("\\text{PPMC} = " + factX(p) + " = " + p) + " minutes.", "À " + hh(t) + ". Ligne 12 : " + M(p + " : " + a + " = " + p / a) + " bus ; ligne 15 : " + M(p + " : " + b + " = " + p / b) + " bus. La durée du trajet ne sert à rien."]),
chk: [[lcm(a, b), String(p)], [p / a, String(p / a)]] }); },

() => { const K = pk([
{ t: "La lumière du Soleil", q: "La distance Terre–Soleil vaut environ " + M("1{,}5 \\cdot 10^{8}") + " km et la lumière parcourt " + M("3 \\cdot 10^{5}") + " km par seconde.", ask: "Combien de secondes la lumière met-elle pour aller du Soleil à la Terre ? Donne le résultat en notation scientifique, puis en notation décimale.", d: [1.5, 8], v: [3, 5] },
{ t: "Le disque dur", q: null, ask: "Combien de photos peut-on stocker ? Donne le résultat en notation scientifique, puis en notation décimale.", d: [pk([2, 4, 6, 8]), 12], v: [pk([2, 4]), 6] },
{ t: "Les globules rouges", q: "Un litre de sang contient environ " + M("5 \\cdot 10^{12}") + " globules rouges. Un adulte a environ 5 litres de sang.", ask: "Combien de globules rouges a-t-il ? Donne le résultat en notation scientifique.", d: [5, 12], v: [5, 0], mul: true }]);
const d = K.d, v = K.v, q = K.q || "Un disque dur contient " + M(d[0] + " \\cdot 10^{" + d[1] + "}") + " octets. Une photo occupe " + M(v[0] + " \\cdot 10^{" + v[1] + "}") + " octets.";
const mant = K.mul ? d[0] * v[0] : d[0] / v[0], ex = K.mul ? d[1] + v[1] : d[1] - v[1], sh = mant >= 10 ? 1 : mant < 1 ? -1 : 0, m2 = mant / 10 ** sh, e2 = ex + sh, val = m2 * 10 ** e2;
let a, p1, p2, p3, p4, res; do { a = pk([2, 3, 5]); p1 = pk([4, 6]); p2 = pk([-2, 5]); p3 = pk([2, 3]); p4 = pk([3, 5, 7]); res = (p1 + p2) * p3 - p4; } while (res === 0 || res === 1);
return X({ id: "puiss", lv: 2, titre: K.t,
q: q + " Calculatrice non autorisée.",
parts: [{ label: K.ask, pts: 2 }, { label: "Écris " + M("\\frac{(" + a + "^{" + p1 + "} \\cdot " + a + "^{" + p2 + "})^{" + p3 + "}}{" + a + "^{" + p4 + "}}") + " sous la forme d'une seule puissance de " + a + ".", pts: 2 }],
sol: ul([M(K.mul ? N(d[0]) + " \\cdot " + N(v[0]) + " \\cdot 10^{" + d[1] + "}" : "\\frac{" + N(d[0]) + "}{" + N(v[0]) + "} \\cdot 10^{" + d[1] + " - " + v[1] + "}") + " = " + M(N(mant) + " \\cdot 10^{" + ex + "}") + (sh ? " = " + M(N(m2) + " \\cdot 10^{" + e2 + "}") : "") + (e2 <= 7 ? " = " + T(val) : "") + ".", "On additionne les exposants dans le produit, on les multiplie pour la puissance d'une puissance, on les soustrait dans le quotient : " + M(a + "^{(" + p1 + " + " + par(p2) + ") \\cdot " + p3 + " - " + p4 + "} = " + a + "^{" + res + "}") + "."]),
chk: [[K.mul ? d[0] * v[0] * 10 ** (d[1] + v[1]) : (d[0] * 10 ** d[1]) / (v[0] * 10 ** v[1]), N(m2) + "*10^(" + e2 + ")"], [(p1 + p2) * p3 - p4, String(res)]] }); },

() => { const k = pk([3, 4, 5, 6, 7]), A = 2 * k * k, m = pk([2, 3, 5]); let q, co, tot;
do { q = [pk([2, 3]), pk([4, 5]), pk([3, 6])]; co = [1, pk([2, 3]), pk([2, 4])]; tot = q[0] - co[1] * q[1] + co[2] * q[2]; } while (Math.abs(tot) <= 1);
const num = m * 6;
return X({ id: "rac", lv: 2, titre: "Le jardin carré",
q: "Un jardin carré a une aire de " + Q0(A, "m^2") + ". On le borde d'une haie et on trace une allée en diagonale. Calculatrice non autorisée.",
parts: [{ label: "Calcule la valeur exacte du côté, sous la forme " + M("a\\sqrt{b}") + " la plus simple.", pts: 1 }, { label: "Calcule la longueur de la diagonale (valeur exacte) et la longueur de la haie.", pts: 2 }, { label: "Regroupe et réduis : " + M("\\sqrt{" + 2 * q[0] ** 2 + "} - " + co[1] + "\\sqrt{" + 2 * q[1] ** 2 + "} + " + co[2] + "\\sqrt{" + 2 * q[2] ** 2 + "}") + ".", pts: 2 }, { label: "Rends rationnel le dénominateur et simplifie : " + M("\\frac{" + num + "}{2\\sqrt{3}}") + ".", pts: 1 }],
sol: ul([M("\\sqrt{" + A + "} = \\sqrt{" + k * k + " \\cdot 2} = " + k + "\\sqrt{2}") + " m.", "Diagonale " + M(k + "\\sqrt{2} \\cdot \\sqrt{2} = " + 2 * k) + " m ; haie " + M("4 \\cdot " + k + "\\sqrt{2} = " + 4 * k + "\\sqrt{2}") + " m.", M(q[0] + "\\sqrt{2} - " + co[1] * q[1] + "\\sqrt{2} + " + co[2] * q[2] + "\\sqrt{2} = " + tot + "\\sqrt{2}") + ".", M("\\frac{" + num + " \\cdot \\sqrt{3}}{2\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{" + num + "\\sqrt{3}}{6} = " + m + "\\sqrt{3}") + "."]),
chk: [[Math.sqrt(A), k + "√2"], [2 * k, String(2 * k)], [tot * Math.SQRT2, tot + "√2"], [num / (2 * Math.sqrt(3)), m + "√3"]] }); },

() => { let P, h, r; do { P = pk([80, 120, 200, 250]); h = pk([10, 20, 25]); r = pk([20, 25, 40, 50]); } while (Math.abs((1 + h / 100) * (1 - r / 100) - 1) < 1e-9);
const P1 = P * (1 + h / 100), P2 = P1 * (1 - r / 100), g = ((P2 - P) / P) * 100, F = pk([36, 48, 60, 72]), rr = pk([20, 25, 40]), F0 = F / (1 - rr / 100);
return X({ id: "pctvar", lv: 2, titre: "Avant et pendant les soldes",
q: "Un magasin de sport augmente de " + h + " % le prix d'une veste à " + Q0(P) + " en octobre, puis le baisse de " + r + " % pendant les soldes de janvier. Le magasin est ouvert le dimanche.",
parts: [{ label: "Calcule le prix en octobre, puis pendant les soldes.", pts: 2 }, { label: "Calcule la variation totale en pourcentage. Est-ce " + (r > h ? "une baisse de " + (r - h) : "une hausse de " + (h - r)) + " % ? Explique.", pts: 1 }, { label: "Pendant les soldes, une paire de chaussures soldée à −" + rr + " % coûte " + Q0(F) + ". Quel était son prix avant les soldes ?", pts: 2 }],
sol: ul([M(P + " \\cdot " + N(1 + h / 100) + " = " + N(P1)) + " CHF ; " + M(N(P1) + " \\cdot " + N(1 - r / 100) + " = " + N(P2)) + " CHF.", "Coefficient global " + M(N(1 + h / 100) + " \\cdot " + N(1 - r / 100) + " = " + N((1 + h / 100) * (1 - r / 100))) + " : " + (g < 0 ? "baisse" : "hausse") + " de " + M(N(Math.abs(g)) + "\\,\\%") + ". Les pourcentages ne s'additionnent pas : le second s'applique à un prix déjà augmenté.", "Le prix soldé vaut " + M(N(1 - rr / 100)) + " fois l'ancien : " + M(F + " : " + N(1 - rr / 100) + " = " + N(F0)) + " CHF. Le dimanche ne sert à rien."]),
chk: [[P * (1 + h / 100), N(P1)], [P1 * (1 - r / 100), N(P2)], [Math.abs(g), N(Math.abs(g))], [F / (1 - rr / 100), N(F0)]] }); },

() => { let t; do { t = Array.from({ length: 5 }, () => R.int(-9, 8)); } while (Math.min(...t) >= 0 || Math.max(...t) <= 0 || new Set(t).size < 5 || t.includes(0) || t.reduce((s, x) => s + x, 0) % 5 !== 0 || t.reduce((s, x) => s + x, 0) === 0);
const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"], mx = Math.max(...t), mn = Math.min(...t), sum = t.reduce((s, x) => s + x, 0), moy = sum / 5, lo = pk([-6, -5, -4]), hi = pk([2, 3]), rr = pk([2, 3, 5]);
const inI = t.map((x, i) => [days[i], x]).filter(([, x]) => x >= lo && x < hi).map(([d]) => d);
return X({ id: "rel", lv: 1, titre: "La station météo",
q: "Températures relevées à 7 h au col des Mosses (en °C) :" + tab(days, [t.map((x) => T(x))]),
parts: [{ label: "Quel est l'écart entre la température la plus haute et la plus basse ? Écris le calcul avec une valeur absolue.", pts: 1 }, { label: "Calcule la température moyenne de la semaine.", pts: 1 }, { label: "Le sel de déneigement agit quand la température est dans l'intervalle " + M("[" + lo + " \\,;\\, " + hi + "[") + ". Quels jours sont dans cet intervalle ? La valeur " + T(hi) + " en fait-elle partie ?", pts: 2 }, { label: "À quel plus petit ensemble (" + M("\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}") + " ou " + M("\\mathbb{R}") + ") appartient la moyenne ? Et " + M("\\sqrt{" + rr + "}") + " ?", pts: 1 }],
sol: ul([M("|" + mx + " - " + par(mn) + "| = " + (mx - mn)) + " °C.", M("\\frac{" + t.map(par).join(" + ") + "}{5} = \\frac{" + sum + "}{5} = " + moy) + " °C.", (inI.length ? inI.join(", ") : "Aucun jour") + ". Non : le crochet est ouvert du côté de " + hi + ", qui est exclu.", M(moy) + " " + (moy < 0 ? "est un entier négatif : " + M("\\mathbb{Z}") : "est un entier naturel : " + M("\\mathbb{N}")) + " ; " + M("\\sqrt{" + rr + "}") + " n'est pas un quotient d'entiers (" + rr + " n'est pas un carré) : " + M("\\mathbb{R}") + "."]),
chk: [[Math.abs(mx - mn), String(mx - mn)], [moy, String(moy)]] }); },

() => { let n, m; do { n = pk([2, 3, 4, 5, 6, 9]) * R.int(40, 160); m = R.int(2, 9) * 30; } while (n < 300 || n > 999 || g2(n, m) < 6 || n % 10 === 0 || n % m === 0);
const divs = [2, 3, 4, 5, 9].filter((d) => n % d === 0), no = [2, 3, 4, 5, 9].filter((d) => n % d !== 0), sum = String(n).split("").reduce((s, c) => s + +c, 0), g = g2(n, m);
return X({ id: "divcrit", lv: 1, titre: "Les sachets de bonbons",
q: "Une confiserie a fabriqué " + T(n) + " bonbons à la fraise et " + T(m) + " bonbons à la menthe.",
parts: [{ label: "Sans poser de division, dis si on peut répartir les bonbons à la fraise en sachets de 2, de 3, de 4, de 5 ou de 9, sans reste. Justifie avec les critères.", pts: 2 }, { label: "Simplifie la fraction " + M("\\frac{" + n + "}{" + m + "}") + " jusqu'à obtenir une fraction irréductible.", pts: 2 }],
sol: ul([(divs.length ? "Oui pour " + divs.join(", ") : "Aucun") + (no.length ? " ; non pour " + no.join(", ") : "") + ". Somme des chiffres : " + sum + (n % 3 ? " (pas multiple de 3)" : n % 9 ? " (multiple de 3, pas de 9)" : " (multiple de 9)") + " ; nombre formé par les deux derniers chiffres : " + String(n).slice(-2) + (n % 4 ? " (pas multiple de 4)" : " (multiple de 4)") + " ; dernier chiffre " + (n % 10) + ".", M("\\frac{" + n + "}{" + m + "} = " + fr(n, m)) + " (on divise par le PGDC " + g + ", par exemple par étapes)."]),
chk: [[n / m, sl(n, m)], [sum, String(sum)]] }); },
];
const RAISON = [
() => { let a, b, c, d; do { a = R.int(1, 5); b = R.int(2, 9); c = R.int(1, 5); d = R.int(2, 9); } while (b === d || a >= b || c >= d || g2(a, b) > 1 || g2(c, d) > 1); const w = who();
return X({ id: "fracadd", lv: 1, titre: "Trouve l'erreur",
q: w + " calcule : « " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + " ».",
parts: [{ label: "Montre avec un exemple simple que cette méthode est fausse.", pts: 1 }, { label: "Calcule correctement (fraction irréductible).", pts: 1 }],
sol: ul(["Avec cette méthode, " + M("\\frac{1}{2} + \\frac{1}{2} = \\frac{2}{4} = \\frac{1}{2}") + ", alors que deux moitiés font 1.", M("\\frac{" + a * d + "}{" + b * d + "} + \\frac{" + c * b + "}{" + b * d + "} = " + fr(a * d + c * b, b * d)) + " : il faut un dénominateur commun."]),
chk: [[a / b + c / d, sl(a * d + c * b, b * d)]] }); },
() => { const [p, q] = pk([[9, 16], [36, 64], [16, 9], [25, 144]]), w = who();
return X({ id: "rac", lv: 1, titre: "Trouve l'erreur",
q: w + " écrit : « " + M("\\sqrt{" + p + " + " + q + "} = \\sqrt{" + p + "} + \\sqrt{" + q + "} = " + (Math.sqrt(p) + Math.sqrt(q))) + " ».",
parts: [{ label: "Calcule " + M("\\sqrt{" + p + " + " + q + "}") + " correctement.", pts: 1 }, { label: "Quelle règle " + w + " a-t-" + (fem(w) ? "elle" : "il") + " inventée ? Quelle est la règle juste ?", pts: 1 }],
sol: ul([M("\\sqrt{" + (p + q) + "} = " + Math.sqrt(p + q)) + ", pas " + (Math.sqrt(p) + Math.sqrt(q)) + ".", M("\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}") + " ; la règle juste concerne le produit : " + M("\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}") + "."]),
chk: [[Math.sqrt(p + q), String(Math.sqrt(p + q))]] }); },
() => VF("puiss", 1, [["« " + M("-3^2 = 9") + ". »", false, "Le carré porte sur 3 seulement : " + M("-3^2 = -9") + " ; c'est " + M("(-3)^2") + " qui vaut 9."],
["« " + M("(-2)^5") + " est négatif. »", true, "Exposant impair : le signe moins reste, " + M("(-2)^5 = -32") + "."],
["« " + M("0{,}333\\ldots") + " est un nombre rationnel. »", true, "C'est " + M("\\frac{1}{3}") + " : développement périodique."],
["« " + M("\\sqrt{2}") + " appartient à " + M("\\mathbb{Q}") + ". »", false, "Ce n'est pas un quotient d'entiers : son développement est illimité non périodique."],
["« Augmenter de 10 % puis baisser de 10 % redonne le prix de départ. »", false, M("1{,}1 \\cdot 0{,}9 = 0{,}99") + " : on perd 1 %."],
["« Tous les nombres premiers sont impairs. »", false, "2 est premier et pair."],
["« " + M("2^3 \\cdot 2^4 = 2^{12}") + ". »", false, "On additionne les exposants : " + M("2^7") + "."],
["« " + M("|-7| = 7") + " et " + M("|3 - 10| = 7") + ". »", true, "La valeur absolue est la distance à 0 : " + M("|3 - 10| = |-7| = 7") + "."]]),
() => { const a = pk([3, 5, 7]), m = pk([2, 4]), n = pk([2, 5]), w = who();
return X({ id: "fracops", lv: 2, titre: "Trouve l'erreur",
q: w + " calcule " + M("\\frac{2}{" + a + "} + \\frac{" + m + "}{" + a + "} \\cdot " + n) + " ainsi : « " + M("\\frac{2 + " + m + "}{" + a + "} \\cdot " + n + " = " + fr((2 + m) * n, a)) + " ».",
parts: [{ label: "Quelle règle de priorité n'a pas été respectée ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
sol: ul(["La multiplication passe avant l'addition : il faut d'abord calculer " + M("\\frac{" + m + "}{" + a + "} \\cdot " + n) + ".", M("\\frac{2}{" + a + "} + \\frac{" + m * n + "}{" + a + "} = " + fr(2 + m * n, a)) + "."]),
chk: [[2 / a + (m / a) * n, sl(2 + m * n, a)]] }); },
];
RICH.cnmp1 = { ids: ["ensembles", "vabs", "fracadd", "rel", "arith", "fracmul", "puiss", "rac", "ratden", "divcrit", "premiers", "fracsimp", "fracops", "pctvar"], track: "mp", label: "Calcul numérique (MP)", ex: EX, raison: RAISON, minutes: 45 };
})();

