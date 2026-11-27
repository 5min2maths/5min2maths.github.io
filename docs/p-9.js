





(() => {
if (typeof PROBX === "undefined") return;
const ri = R.int, pk = R.pick;
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const [i, f] = String(r6(v)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
const X = (v) => M(N(v));
const PX = (id, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), { co: [9, 10] })); };

const PB = (q, parts, hints, sol) => ({ q, hints, sol,
parts: parts.map(([label, value, rd]) => ({ label, spec: Object.assign({ kind: "value", value: r6(value) }, rd ? { round: rd } : {}) })) });
const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => (a * b) / gcd(a, b);

const CX = (cx, q) => Object.assign(q, { ctx: cx });
const who = () => pk(["Lina", "Mia", "Zoé", "Nora", "Léa"]);


PX("decread", () => {

const cx = pk(["enigme", "decomp", "chrono"]);
if (cx === "decomp") {
let d, u, t, m; do { d = ri(2, 9); u = ri(2, 9); t = ri(2, 9); m = ri(11, 98); } while (m % 10 === 0 || m < 20 || u === d || Math.floor(m / 10) === t);
const n = r6(10 * d + u + t / 10 + m / 1000), ce = Math.floor(m / 10), r = Math.round(10 * d * 100 + u * 100 + t * 10 + m / 10) / 100;
return CX(cx, PB("Un nombre est formé de " + X(d) + " dizaines, " + X(u) + " unités, " + X(t) + " dixièmes et " + X(m) + " millièmes.",
[["a) Écris ce nombre.", n], ["b) Quel est son chiffre des centièmes ?", ce], ["c) Arrondis-le au centième.", r]],
["Place chaque morceau dans un tableau de numération : " + m + " millièmes, c'est " + ce + " centièmes et " + (m % 10) + " millièmes.", "c) Regarde le chiffre des millièmes : 5 ou plus, on arrondit vers le haut."],
"a) " + M(10 * d + " + " + u + " + " + N(t / 10) + " + " + N(m / 1000) + " = " + N(n)) + ". b) " + ce + ". c) " + X(r) + " (chiffre des millièmes : " + (m % 10) + ")."));
}
if (cx === "chrono") {
const [sp, lo, hi] = pk([["Au slalom", 48, 75], ["Au 100 m nage libre", 56, 85], ["Au 400 m", 55, 72]]), nm = who();
let T; do { T = ri(lo, hi) * 1000 + ri(101, 999); } while (T % 10 < 2 || Math.floor(T / 10) % 10 < 2);
const t = T / 1000, ce = Math.floor(T / 10) % 10, dx = Math.floor(T / 100), r = Math.round(T / 10) / 100;
return CX(cx, PB(sp + ", le chronomètre électronique affiche pour " + nm + " : " + X(t) + " s.",
[["a) Chiffre des centièmes de ce temps", ce], ["b) Combien de dixièmes de seconde entiers ce temps contient-il ?", dx], ["c) Temps arrondi au centième de seconde, en s", r]],
["Écris le temps dans un tableau : unités, dixièmes, centièmes, millièmes.", "b) « Combien de dixièmes en tout » : tout ce qui est à gauche du chiffre des dixièmes, ce chiffre compris (comme 4,7 = 47 dixièmes)."],
"a) " + X(t) + " : le chiffre des centièmes est " + ce + ". b) " + X(t) + " s = " + X(dx) + " dixièmes et " + X(T % 100) + " millièmes. c) " + X(r) + " s (chiffre des millièmes : " + (T % 10) + ")."));
}
let t, a, b, c; do { t = ri(3, 9); a = ri(1, 4); b = ri(1, 9); c = ri(1, 9); } while (t - a < 1 || b === c || t - a === b);
const u = 2 * a, cen = t - a, n = 10 * t + u + a / 10 + cen / 100 + c / 1000;
return CX(cx, PB("Je suis un nombre décimal. Mon chiffre des dizaines est " + X(t) + ". Mon chiffre des unités est le double de mon chiffre des dixièmes, qui vaut " + X(a) + ". Mon chiffre des centièmes est la différence entre mon chiffre des dizaines et mon chiffre des dixièmes. Mon chiffre des millièmes est " + X(c) + ", et je n'ai pas d'autre chiffre.",
[["a) Qui suis-je ?", n], ["b) Combien de centièmes entiers y a-t-il en tout dans ce nombre ?", Math.floor(n * 100 + 1e-9)], ["c) Arrondis ce nombre au dixième.", Math.round(n * 10) / 10]],
["Place les chiffres un à un dans un tableau : dizaines, unités, virgule, dixièmes, centièmes, millièmes.", "« Combien de centièmes en tout » : tout ce qui est à gauche du chiffre des centièmes, ce chiffre compris (comme 3,47 = 347 centièmes)."],
"a) Unités : " + M("2 \\cdot " + a + " = " + u) + " ; centièmes : " + M(t + " - " + a + " = " + cen) + ". Le nombre est " + X(n) + ". b) " + X(n) + " = " + X(Math.floor(n * 100 + 1e-9)) + " centièmes et " + X(c) + " millièmes. c) " + X(Math.round(n * 10) / 10) + " (le chiffre des centièmes est " + cen + ")."));
});
PX("deccomp", () => {

const cx = pk(["sprint", "colis", "labo"]);
const b = cx === "sprint" ? pk([8, 9, 10, 11, 12]) : cx === "colis" ? pk([2, 3, 4, 5]) : pk([0, 1]);
const off = [0.8, 0.08, 0.79, 0.801, 1.1, 0.708].sort(() => R.rand() - 0.5).slice(0, 5), v = off.map((o) => r6(b + o)), s = v.slice().sort((x, y) => x - y);
const lo = r6(b + 0.75), hi = b + 1, cnt = v.filter((x) => x > lo && x < hi).length;
const [intro, u, lA, lB, A, B] = cx === "sprint" ? ["Cinq élèves ont couru le 60 m. Leurs temps (en secondes) : ", "s", "a) Le meilleur temps (le plus petit), en s", "b) Le temps de l'élève arrivé 3e, en s", s[0], s[2]]
: cx === "colis" ? ["À la poste, on pèse cinq colis. Leurs masses (en kg) : ", "kg", "a) Masse du colis le plus lourd, en kg", "b) Masse du 3e colis le plus lourd, en kg", s[4], s[2]]
: ["Au labo de sciences, on mesure au micromètre l'épaisseur de cinq feuilles de métal. Leurs épaisseurs (en mm) : ", "mm", "a) La plus petite épaisseur, en mm", "b) La 3e épaisseur, dans l'ordre croissant, en mm", s[0], s[2]];
return CX(cx, PB(intro + v.map(X).join(" ; ") + ".",
[[lA, A], [lB, B], ["c) Combien de ces valeurs sont comprises entre " + X(lo) + " " + u + " et " + X(hi) + " " + u + " ?", cnt]],
["Écris toutes les valeurs avec le même nombre de décimales (complète par des zéros), puis compare chiffre par chiffre.", "Range-les du plus petit au plus grand avant de répondre."],
"Avec trois décimales : " + v.map((x) => M(x.toFixed(3).replace(".", "{,}"))).join(", ") + ". Rangées : " + s.map(X).join(" < ") + ". a) " + X(A) + " " + u + ". b) " + X(B) + " " + u + ". c) " + cnt + "."));
});

PX("dec10", () => {
const [cx, obj, u1, us, es, txtA, txtB, txtC] = pk([["feuilles", "Un paquet de " + X(1000) + " feuilles de papier a une épaisseur de # cm.", "mm", "feuilles", [8.4, 9.6, 10.2, 11.5, 12.8], "Épaisseur d'une feuille, en mm", "Épaisseur d'une pile de 100 paquets, en m", "Une pile de ces feuilles mesure # m. Combien de feuilles contient-elle ?"],
["pieces", "Une pile de " + X(1000) + " pièces de monnaie identiques mesure # cm de haut.", "mm", "pièces", [150, 170, 190, 210], "Épaisseur d'une pièce, en mm", "Hauteur de 100 piles de " + X(1000) + " pièces, en m", "Une pile de ces pièces mesure # m. Combien de pièces contient-elle ?"],
["riz", "Un lot de " + X(1000) + " grains de riz pèse # g.", "mg", "grains", [18.5, 21.4, 24.6, 27.2], "Masse d'un grain, en mg", "Masse de 100 lots de " + X(1000) + " grains, en kg", "Un sac de ces grains de riz pèse # kg. Combien de grains contient-il ?"]]);
const e = pk(es), k = pk(cx === "pieces" ? [2, 3, 5] : [20, 30, 50, 200]), H = r6((k * e) / 100), U = cx === "riz" ? ["g", "mg", "kg", "1 g = 1'000 mg", "1 kg = 1'000 g"] : ["cm", "mm", "m", "1 cm = 10 mm", "1 m = 100 cm"];
const a = cx === "riz" ? e : r6((e * 10) / 1000), b = cx === "riz" ? r6((100 * e) / 1000) : r6(e), Hd = cx === "riz" ? r6((k * e) / 1000) : H;
return Object.assign(PB(obj.replace("#", N(e)),
[["a) " + txtA, a], ["b) " + txtB, b], ["c) " + txtC.replace("#", N(Hd)), k * 1000]],
["Convertis d'abord (" + U[3] + "), puis divise par 1'000.", "c) Convertis en " + U[0] + ", puis cherche combien de lots de 1'000 cela fait."],
cx === "riz" ? "a) " + M(N(e) + " \\text{ g} = " + N(e * 1000) + " \\text{ mg}") + " et " + M(N(e * 1000) + " \\div 1\\text{'}000 = " + N(e)) + " mg. b) " + M("100 \\cdot " + N(e) + " = " + N(r6(100 * e))) + " g = " + X(b) + " kg. c) " + M(N(Hd) + " \\text{ kg} = " + N(r6(Hd * 1000)) + " \\text{ g}") + ", soit " + M(N(r6(Hd * 1000)) + " \\div " + N(e) + " = " + k) + " lots, donc " + X(k * 1000) + " grains."
: "a) " + M(N(e) + " \\text{ cm} = " + N(e * 10) + " \\text{ mm}") + " et " + M(N(e * 10) + " \\div 1\\text{'}000 = " + N(a)) + " mm. b) " + M("100 \\cdot " + N(e) + " = " + N(r6(100 * e))) + " cm = " + X(b) + " m. c) " + M(N(H) + " \\text{ m} = " + N(r6(H * 100)) + " \\text{ cm}") + ", soit " + M(N(r6(H * 100)) + " \\div " + N(e) + " = " + k) + " piles de 1'000, donc " + X(k * 1000) + " " + us + "."), { ctx: cx });
});
PX("pow9", () => {
const cx = pk(["bacteries", "messages", "pliage"]);
if (cx === "messages") { const d1 = pk([3, 4]), d2 = pk([5, 6]), k = pk([7, 8, 9]);
return Object.assign(PB("Une rumeur circule : le premier jour, une personne la raconte à 3 nouvelles personnes ; chaque jour, chaque personne qui vient de l'apprendre la raconte à 3 nouvelles personnes.",
[["a) Combien de personnes l'apprennent le jour " + d1 + " ?", 3 ** d1], ["b) Le jour " + d2 + ", ce nombre s'écrit " + M("3^n") + ". Que vaut " + M("n") + " ?", d2], ["c) Quel jour " + X(3 ** k) + " nouvelles personnes l'apprennent-elles ?", k]],
["Chaque jour, le nombre de nouvelles personnes est multiplié par 3.", "c) Écris " + N(3 ** k) + " comme une puissance de 3."],
"a) " + M("3^{" + d1 + "} = " + N(3 ** d1)) + ". b) " + M("n = " + d2) + ". c) " + M(N(3 ** k) + " = 3^{" + k + "}") + " : le jour " + k + "."), { ctx: cx }); }
if (cx === "pliage") { const p1 = pk([3, 4, 5]), p2 = pk([6, 7, 8]), k = pk([9, 10, 11]);
return Object.assign(PB("On plie une feuille en deux, puis encore en deux, et ainsi de suite. À chaque pliage, le nombre de couches double.",
[["a) Combien de couches après " + p1 + " pliages ?", 2 ** p1], ["b) Après " + p2 + " pliages, le nombre de couches s'écrit " + M("2^n") + ". Que vaut " + M("n") + " ?", p2], ["c) Combien de pliages faut-il pour obtenir " + X(2 ** k) + " couches ?", k]],
["Un pliage double le nombre de couches : 2, 4, 8…", "c) Écris " + N(2 ** k) + " comme une puissance de 2."],
"a) " + M("2^{" + p1 + "} = " + 2 ** p1) + ". b) " + M("n = " + p2) + ". c) " + M(N(2 ** k) + " = 2^{" + k + "}") + " : " + k + " pliages."), { ctx: cx }); }
const h1 = pk([2, 3]), h2 = pk([4, 5]), k = pk([7, 10, 11]);
return Object.assign(PB("Une bactérie se divise en deux toutes les 20 minutes. Au départ, il y a une seule bactérie.",
[["a) Combien y a-t-il de bactéries après " + h1 + " heures ?", 2 ** (3 * h1)], ["b) Après " + h2 + " heures, le nombre de bactéries s'écrit " + M("2^n") + ". Que vaut " + M("n") + " ?", 3 * h2], ["c) Au bout de combien de minutes y a-t-il " + X(2 ** k) + " bactéries ?", 20 * k]],
["En une heure, il y a 3 périodes de 20 minutes : le nombre est multiplié par 2 trois fois.", "c) Écris " + N(2 ** k) + " comme une puissance de 2 : combien de divisions a-t-il fallu ?"],
"a) " + M("2^{" + 3 * h1 + "} = " + N(2 ** (3 * h1))) + ". b) " + M(h2 + " \\cdot 3 = " + 3 * h2) + " divisions : " + M("n = " + 3 * h2) + ". c) " + M(N(2 ** k) + " = 2^{" + k + "}") + " : " + k + " divisions de 20 minutes, soit " + 20 * k + " minutes."), { ctx: cx });
});


PX("ulong", () => {

const cx = pk(["ficelle", "planche", "ruban"]);
let L, c, n, r; do { L = pk(cx === "planche" ? [2, 2.5, 3, 4] : cx === "ruban" ? [5, 8, 10] : [5, 8, 12, 15]); c = pk(cx === "planche" ? [35, 45, 55, 65, 70] : cx === "ruban" ? [45, 65, 70, 85, 95] : [35, 45, 65, 70, 85]); n = Math.floor((L * 100) / c); r = L * 100 - n * c; } while (r < 5 || n < 3);
const ab = ["Convertis la longueur en cm avant de diviser.", ""], a1 = M(N(L) + " \\text{ m} = " + N(L * 100) + " \\text{ cm}") + " ; " + M(N(L * 100) + " \\div " + c) + " : " + n + " morceaux. b) " + M(N(L * 100) + " - " + n + " \\cdot " + c + " = " + r) + " cm.";
if (cx === "planche") { const k = pk([3, 4, 5, 6]), ch = r6((k * r) / 100);
return CX(cx, PB("Une planche de " + X(L) + " m est sciée en tablettes de " + X(c) + " cm, autant que possible.",
[["a) Combien de tablettes obtient-on ?", n], ["b) Longueur de la chute, en cm", r], ["c) On scie " + k + " planches identiques de la même façon. Longueur totale des chutes, en m", ch]],
[ab[0], "c) Une chute par planche ; convertis en m à la fin (1 m = 100 cm)."],
"a) " + a1 + " c) " + M(k + " \\cdot " + r + " = " + k * r) + " cm = " + X(ch) + " m.")); }
if (cx === "ruban") { const k = ri(2, 5), Nc = n * k + ri(1, n - 1);
return CX(cx, PB("Pour emballer des cadeaux, on coupe un ruban de " + X(L) + " m en morceaux de " + X(c) + " cm, autant que possible.",
[["a) Combien de morceaux obtient-on avec un ruban ?", n], ["b) Longueur du reste, en cm", r], ["c) Il faut un morceau par cadeau. Combien de rubans faut-il au minimum pour emballer " + Nc + " cadeaux ?", k + 1]],
[ab[0], "c) Combien de rubans complets pour " + Nc + " morceaux ? S'il en manque encore, il faut un ruban de plus."],
"a) " + a1 + " c) " + M(Nc + " \\div " + n) + " : " + k + " rubans donnent " + n * k + " morceaux, il en manque " + (Nc - n * k) + " : " + (k + 1) + " rubans.")); }
const m = pk([12, 15, 24, 40]), mk = r6((n * c * m) / 100 / 1000);
return CX(cx, PB("Un rouleau de ficelle de " + X(L) + " m est coupé en morceaux de " + X(c) + " cm, autant que possible. La ficelle pèse " + X(m) + " g par mètre.",
[["a) Combien de morceaux obtient-on ?", n], ["b) Longueur du reste, en cm", r], ["c) Masse de tous les morceaux réunis, en kg", mk]],
["Convertis la longueur du rouleau en cm avant de diviser.", "c) Longueur totale des morceaux en m, puis masse en g, puis en kg (1 kg = 1'000 g)."],
"a) " + a1 + " c) " + M(n + " \\cdot " + c + " = " + N(n * c) + " \\text{ cm} = " + N(r6((n * c) / 100)) + " \\text{ m}") + " ; " + M(N(r6((n * c) / 100)) + " \\cdot " + m + " = " + N(r6((n * c * m) / 100)) + " \\text{ g} = " + N(mk) + " \\text{ kg}") + "."));
});
PX("uaire", () => {

const cx = pk(["carrelage", "terrasse", "timbres"]);
if (cx === "terrasse") { const a = pk([2.4, 3.2, 4, 4.8, 5.6]), b = pk([1.6, 2, 2.4, 3.2].filter((x) => x !== a)), p = pk([4.5, 6, 7.5, 8.5]), A = r6(a * b), na = Math.round(a / 0.4), nb = Math.round(b / 0.4), nd = na * nb;
return CX(cx, PB("Une terrasse rectangulaire de " + X(a) + " m sur " + X(b) + " m est couverte de dalles carrées de 40 cm de côté. Une dalle coûte " + X(p) + " CHF.",
[["a) Aire de la terrasse, en m²", A], ["b) Combien faut-il de dalles ?", nd], ["c) Prix de toutes les dalles, en CHF", r6(nd * p)]],
["40 cm = 0,4 m : combien de dalles sur la longueur ? sur la largeur ?", "Vérifie : une dalle couvre 0,4 · 0,4 = 0,16 m²."],
"a) " + M(N(a) + " \\cdot " + N(b) + " = " + N(A)) + " m². b) " + M(N(a) + " \\div 0{,}4 = " + na) + " et " + M(N(b) + " \\div 0{,}4 = " + nb) + " : " + M(na + " \\cdot " + nb + " = " + nd) + " dalles (" + M(N(A) + " \\div 0{,}16 = " + nd) + "). c) " + M(nd + " \\cdot " + N(p) + " = " + N(r6(nd * p))) + " CHF.")); }
if (cx === "timbres") { let a, b, s; do { a = pk([15, 18, 20, 24, 30]); b = pk([10, 12, 15, 18]); s = pk([20, 25, 30]); } while ((a * 10) % s || (b * 10) % s || a === b);
const nt = ((a * 10) / s) * ((b * 10) / s), at = r6((s / 10) ** 2);
return CX(cx, PB("Une planche de timbres rectangulaire mesure " + X(a) + " cm sur " + X(b) + " cm. Elle est entièrement découpée en timbres carrés de " + X(s) + " mm de côté.",
[["a) Aire de la planche, en cm²", a * b], ["b) Aire d'un timbre, en cm²", at], ["c) Combien de timbres la planche contient-elle ?", nt]],
[s + " mm = " + N(s / 10) + " cm.", "c) Combien de timbres sur la longueur ? sur la largeur ?"],
"a) " + M(a + " \\cdot " + b + " = " + a * b) + " cm². b) " + M(N(s / 10) + " \\cdot " + N(s / 10) + " = " + N(at)) + " cm². c) " + M((a * 10) / s + " \\cdot " + (b * 10) / s + " = " + nt) + " timbres (" + M(a * b + " \\div " + N(at) + " = " + nt) + ").")); }
const c = pk([25, 50]), a = pk([3, 3.5, 4, 4.5, 5]), b = pk([2.5, 3, 3.5]), A = r6(a * b), nC = ((a * 100) / c) * ((b * 100) / c);
return CX(cx, PB("Le sol d'une pièce rectangulaire de " + X(a) + " m sur " + X(b) + " m est recouvert de carreaux carrés de " + X(c) + " cm de côté.",
[["a) Aire du sol, en m²", A], ["b) Aire d'un carreau, en m²", r6((c / 100) ** 2)], ["c) Combien faut-il de carreaux ?", nC]],
["Un carreau de " + c + " cm de côté : " + c + " cm = " + N(c / 100) + " m.", "c) Combien de carreaux tiennent sur la longueur ? sur la largeur ?"],
"a) " + M(N(a) + " \\cdot " + N(b) + " = " + N(A)) + " m². b) " + M(N(c / 100) + " \\cdot " + N(c / 100) + " = " + N(r6((c / 100) ** 2))) + " m². c) " + M(N(a * 100) + " \\div " + c + " = " + (a * 100) / c) + " carreaux sur la longueur, " + M(N(b * 100) + " \\div " + c + " = " + (b * 100) / c) + " sur la largeur : " + M((a * 100) / c + " \\cdot " + (b * 100) / c + " = " + nC) + " carreaux."));
});
PX("uvol", () => {

const cx = pk(["aquarium", "citerne", "piscine"]);
if (cx === "citerne") { const a = pk([100, 120, 150]), b = pk([50, 60, 80]), c = pk([60, 80, 100]), h = ri(3, c / 10 - 2) * 10 + pk([0, 5]), V = (a * b * c) / 1000, x = r6((a * b * h) / 1000), k = pk([8, 10, 12]), na = Math.floor(x / k + 1e-9);
return CX(cx, PB("Un récupérateur d'eau de pluie a la forme d'un pavé de " + X(a) + " cm de long, " + X(b) + " cm de large et " + X(c) + " cm de haut. Après un orage, il contient " + X(x) + " litres d'eau.",
[["a) Contenance du récupérateur, en litres", V], ["b) Hauteur de l'eau, en cm", h], ["c) Combien d'arrosoirs de " + k + " L peut-on remplir entièrement avec cette eau ?", na]],
["1 litre = 1 dm³ = 1'000 cm³.", "b) Volume d'eau en cm³, divisé par l'aire du fond."],
"a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + X(V) + " L. b) " + M(N(x) + " \\text{ L} = " + N(a * b * h) + " \\text{ cm}^3") + " ; " + M(N(a * b * h) + " \\div (" + a + " \\cdot " + b + ") = " + h) + " cm. c) " + M(N(x) + " \\div " + k + (Number.isInteger(r6((x / k) * 100)) ? " = " : " \\approx ") + N(r6(Math.floor((x / k) * 100) / 100))) + " : " + na + " arrosoirs pleins.")); }
if (cx === "piscine") { const a = pk([4, 5, 6]), b = pk([2, 3]), H = 5 * ri(16, 22), x = r6((a * b * H) / 100), d = pk([25, 50]), t = (x * 1000) / d;
return CX(cx, PB("Une piscine hors-sol a la forme d'un pavé de " + X(a) + " m sur " + X(b) + " m, avec des parois de 1,2 m de haut. On la remplit avec " + X(x) + " m³ d'eau, à l'aide d'un tuyau qui débite " + d + " litres par minute.",
[["a) Contenance de la piscine, en m³", r6(a * b * 1.2)], ["b) Hauteur de l'eau, en cm", H], ["c) Durée du remplissage, en minutes", t]],
["1 m³ = 1'000 L.", "b) Volume d'eau divisé par l'aire du fond (en m), puis convertis en cm."],
"a) " + M(a + " \\cdot " + b + " \\cdot 1{,}2 = " + N(r6(a * b * 1.2))) + " m³. b) " + M(N(x) + " \\div (" + a + " \\cdot " + b + ") = " + N(H / 100)) + " m = " + H + " cm. c) " + M(N(x) + " \\text{ m}^3 = " + N(x * 1000) + " \\text{ L}") + " ; " + M(N(x * 1000) + " \\div " + d + " = " + N(t)) + " minutes.")); }
const a = pk([50, 60, 80]), b = pk([25, 30, 40]), c = pk([30, 40, 50]), h = ri(2, Math.floor(c / 10) - 1) * 10 - pk([0, 5]), V = (a * b * c) / 1000, x = r6((a * b * h) / 1000), md = (a * b * (c - h)) / 100;
return CX(cx, PB("Un aquarium a la forme d'un pavé de " + X(a) + " cm de long, " + X(b) + " cm de large et " + X(c) + " cm de haut. On y verse " + X(x) + " litres d'eau.",
[["a) Contenance de l'aquarium, en litres", V], ["b) Hauteur de l'eau, en cm", h], ["c) Combien de décilitres manque-t-il pour le remplir ?", md]],
["1 litre = 1 dm³ = 1'000 cm³.", "b) Volume d'eau en cm³, divisé par l'aire du fond."],
"a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + X(V) + " L. b) " + M(N(x) + " \\text{ L} = " + N(a * b * h) + " \\text{ cm}^3") + " ; " + M(N(a * b * h) + " \\div (" + a + " \\cdot " + b + ") = " + h) + " cm. c) " + M(N(V) + " - " + N(x) + " = " + N(r6(V - x))) + " L = " + X(md) + " dl."));
});


PX("angtype", () => {

const cx = pk(["horloge", "gateau", "rose"]);
if (cx === "gateau") { const n = pk([5, 6, 8, 9, 10, 12]), p = 360 / n, k = ri(2, n - 2), o = Math.floor(90 / p + 1e-9) + 1;
return CX(cx, PB("Un gâteau rond est coupé en " + n + " parts égales, toutes depuis le centre.",
[["a) Angle d'une part au centre, en degrés", p], ["b) Angle formé par " + k + " parts côte à côte, en degrés", k * p], ["c) Nombre minimal de parts côte à côte pour former un angle obtus", o]],
["Le tour complet fait 360°.", "c) Un angle obtus est plus grand que 90° (un angle de 90° est droit, pas obtus)."],
"a) " + M("360° \\div " + n + " = " + p + "°") + ". b) " + M(k + " \\cdot " + p + "° = " + k * p + "°") + ". c) " + M((o - 1) + " \\cdot " + p + "° = " + (o - 1) * p + "°") + " n'est pas obtus ; " + M(o + " \\cdot " + p + "° = " + o * p + "°") + " l'est : " + o + " parts.")); }
if (cx === "rose") { const DIR = [["nord", 0], ["nord-est", 45], ["est", 90], ["sud-est", 135], ["sud", 180], ["sud-ouest", 225], ["ouest", 270], ["nord-ouest", 315]], sm = (x, y) => { const d = Math.abs(x - y); return Math.min(d, 360 - d); };
let A, B, C, D, E, F; do { [A, B, C, D, E, F] = [0, 0, 0, 0, 0, 0].map(() => pk(DIR)); } while (sm(A[1], B[1]) === 0 || sm(C[1], D[1]) === 0 || sm(C[1], D[1]) === sm(A[1], B[1]) || (F[1] - E[1] + 360) % 360 < 90 || (F[1] - E[1] + 360) % 360 === 180);
const g = (F[1] - E[1] + 360) % 360;
return CX(cx, PB("Sur une rose des vents, les huit directions (nord, nord-est, est, sud-est, sud, sud-ouest, ouest, nord-ouest) sont régulièrement espacées.",
[["a) Plus petit angle entre les directions " + A[0] + " et " + B[0] + ", en degrés", sm(A[1], B[1])], ["b) Plus petit angle entre les directions " + C[0] + " et " + D[0] + ", en degrés", sm(C[1], D[1])], ["c) Une girouette passe de la direction " + E[0] + " à la direction " + F[0] + " en tournant dans le sens des aiguilles d'une montre. De combien de degrés tourne-t-elle ?", g]],
["Deux directions voisines forment un angle de 360° ÷ 8 = 45°.", "c) Compte les huitièmes de tour en partant de " + E[0] + " et en tournant vers l'est (sens des aiguilles d'une montre)."],
"a) " + M(sm(A[1], B[1]) / 45 + " \\cdot 45° = " + sm(A[1], B[1]) + "°") + ". b) " + M(sm(C[1], D[1]) / 45 + " \\cdot 45° = " + sm(C[1], D[1]) + "°") + ". c) " + M(g / 45 + " \\cdot 45° = " + g + "°") + (g > 180 ? " (plus qu'un demi-tour)." : "."))); }
const h1 = pk([2, 4, 5, 7, 8]), m = pk([12, 25, 35, 40]), h2 = pk([2, 3, 4, 8, 9]);
const a1 = Math.min(30 * h1, 360 - 30 * h1), raw = Math.abs(30 * h2 + 15 - 180), a3 = Math.min(raw, 360 - raw);
return CX(cx, PB("Sur une horloge, on mesure le plus petit angle formé par les deux aiguilles.",
[["a) Angle à " + h1 + " h pile (en degrés)", a1], ["b) De combien de degrés tourne la grande aiguille en " + m + " minutes ?", 6 * m], ["c) Angle à " + h2 + " h 30 (en degrés)", a3]],
["Le cadran fait 360° et compte 12 heures : 30° d'une heure à la suivante. La grande aiguille fait un tour (360°) en 60 minutes.", "c) À " + h2 + " h 30, la petite aiguille n'est pas sur le " + h2 + " : elle est à mi-chemin entre " + h2 + " et " + (h2 + 1) + "."],
"a) " + M(h1 + " \\cdot 30° = " + 30 * h1 + "°") + (a1 !== 30 * h1 ? ", donc le plus petit angle vaut " + M("360° - " + 30 * h1 + "° = " + a1 + "°") : "") + ". b) " + M("360° \\div 60 = 6°") + " par minute : " + M(m + " \\cdot 6° = " + 6 * m + "°") + ". c) Petite aiguille à " + M(h2 + " \\cdot 30° + 15° = " + (30 * h2 + 15) + "°") + ", grande aiguille à 180° : écart " + M(raw + "°") + (a3 !== raw ? ", plus petit angle " + M(a3 + "°") : "") + "."));
});
PX("perim", () => {

const cx = pk(["rectangle", "enclos", "fil"]);
if (cx === "enclos") { const L = ri(8, 20), w = ri(3, 12), C = L + 2 * w, p = pk([12, 15, 18.5, 24]);
return CX(cx, PB("Un enclos rectangulaire pour des chèvres longe le mur d'une grange : de ce côté, pas de clôture. Il faut " + X(C) + " m de clôture pour les trois autres côtés, et le côté le long du mur mesure " + X(L) + " m. La clôture coûte " + X(p) + " CHF le mètre.",
[["a) Largeur de l'enclos (côtés perpendiculaires au mur), en m", w], ["b) Périmètre de l'enclos, mur compris, en m", 2 * (L + w)], ["c) Prix de la clôture, en CHF", r6(C * p)]],
["La clôture compte une longueur (" + L + " m) et deux largeurs.", "b) Le périmètre compte aussi le côté du mur."],
"a) " + M("(" + C + " - " + L + ") \\div 2 = " + w) + " m. b) " + M("2 \\cdot (" + L + " + " + w + ") = " + 2 * (L + w)) + " m. c) " + M(C + " \\cdot " + N(p) + " = " + N(r6(C * p))) + " CHF.")); }
if (cx === "fil") { const F = 12 * ri(3, 12);
return CX(cx, PB("Avec un fil de fer de " + X(F) + " cm, on peut former, au choix, un carré, un triangle équilatéral ou un hexagone régulier (on utilise tout le fil).",
[["a) Côté du carré, en cm", F / 4], ["b) Côté du triangle équilatéral, en cm", F / 3], ["c) Côté de l'hexagone régulier, en cm", F / 6]],
["Le périmètre est toujours la longueur du fil.", "Tous les côtés sont égaux : divise par le nombre de côtés."],
"a) " + M(F + " \\div 4 = " + F / 4) + " cm. b) " + M(F + " \\div 3 = " + F / 3) + " cm. c) " + M(F + " \\div 6 = " + F / 6) + " cm.")); }
const l = ri(4, 15), d = ri(2, 9), L = l + d, P = 2 * (l + L);
return CX(cx, PB("Un rectangle a un périmètre de " + X(P) + " cm, et sa longueur dépasse sa largeur de " + X(d) + " cm.",
[["a) Longueur + largeur, en cm", L + l], ["b) Largeur, en cm", l], ["c) Longueur, en cm", L]],
["Le périmètre contient deux longueurs et deux largeurs : la moitié contient une longueur et une largeur.", "Si on enlève les " + d + " cm de trop à la longueur, il reste deux largeurs."],
"a) " + M(P + " \\div 2 = " + (L + l)) + " cm. b) " + M("(" + (L + l) + " - " + d + ") \\div 2 = " + l) + " cm. c) " + M(l + " + " + d + " = " + L) + " cm. Vérification : " + M("2 \\cdot (" + L + " + " + l + ") = " + P) + "."));
});
PX("aire1", () => {
const s = pk([6, 8, 9, 10, 12]), A = s * s, ws = []; for (let w = 2; w < s; w++) if (A % w === 0 && A / w !== s) ws.push(w);
const w = pk(ws), L = A / w, dP = 2 * (L + w) - 4 * s;
const [cx, txt, u] = pk([["figure", "Un rectangle a la même aire qu'un carré de # cm de côté. Sa largeur mesure @ cm.", "cm"], ["potager", "Un potager rectangulaire a la même aire qu'une pelouse carrée de # m de côté. Sa largeur mesure @ m.", "m"],
["affiche", "Une affiche rectangulaire a la même aire qu'une affiche carrée de # dm de côté. Sa largeur mesure @ dm.", "dm"]]);
return Object.assign(PB(txt.replace("#", N(s)).replace("@", N(w)),
[["a) Aire du carré, en " + u + "²", A], ["b) Longueur du rectangle, en " + u, L], ["c) De combien de " + u + " le périmètre du rectangle dépasse-t-il celui du carré ?", dP]],
["Même aire : longueur · largeur = aire du carré.", "c) Calcule les deux périmètres, puis la différence."],
"a) " + M(s + " \\cdot " + s + " = " + A) + " " + u + "². b) " + M(A + " \\div " + w + " = " + L) + " " + u + ". c) Rectangle : " + M("2 \\cdot (" + L + " + " + w + ") = " + 2 * (L + w)) + " " + u + " ; carré : " + M("4 \\cdot " + s + " = " + 4 * s) + " " + u + " ; différence " + X(dP) + " " + u + " (même aire, périmètres différents)."), { ctx: cx });
});
PX("aire2", () => {

const cx = pk(["parallelogramme", "voile", "cerfvolant"]);
if (cx === "voile") { let b, h, c, A, hc; do { b = pk([2.4, 3, 3.6, 4]); h = pk([5, 6, 7.5, 8]); c = r6(h + pk([0.5, 1, 1.5, 2])); A = r6((b * h) / 2); hc = r6((2 * A) / c); } while (Math.abs(hc * 100 - Math.round(hc * 100)) > 1e-6);
const p = pk([18, 24, 32, 45]);
return CX(cx, PB("La voile d'un petit bateau est un triangle. Sa base mesure " + X(b) + " m et la hauteur relative à cette base " + X(h) + " m. Le côté le plus long de la voile mesure " + X(c) + " m.",
[["a) Aire de la voile, en m²", A], ["b) Hauteur relative au côté le plus long, en m", hc], ["c) Le tissu coûte " + p + " CHF le m². Prix du tissu de la voile, en CHF", r6(A * p)]],
["Aire d'un triangle : base · hauteur ÷ 2, quelle que soit la base choisie.", "b) Même aire avec l'autre base : hauteur = 2 · aire ÷ côté."],
"a) " + M(N(b) + " \\cdot " + N(h) + " \\div 2 = " + N(A)) + " m². b) " + M("2 \\cdot " + N(A) + " \\div " + N(c) + " = " + N(hc)) + " m. c) " + M(N(A) + " \\cdot " + p + " = " + N(r6(A * p))) + " CHF.")); }
if (cx === "cerfvolant") { const d1 = 2 * ri(25, 45), d2 = 2 * ri(15, 30), A = (d1 * d2) / 2, k = pk([6, 8, 12, 15]);
return CX(cx, PB("Un cerf-volant a la forme d'un losange dont les diagonales mesurent " + X(d1) + " cm et " + X(d2) + " cm.",
[["a) Aire du cerf-volant, en cm²", A], ["b) Aire du cerf-volant, en dm²", r6(A / 100)], ["c) Pour une fête, on en fabrique " + k + ". Aire totale de tissu, en m²", r6((k * A) / 10000)]],
["Aire d'un losange : diagonale · diagonale ÷ 2.", "1 dm² = 100 cm² et 1 m² = 10'000 cm²."],
"a) " + M(d1 + " \\cdot " + d2 + " \\div 2 = " + N(A)) + " cm². b) " + M(N(A) + " \\div 100 = " + N(r6(A / 100))) + " dm². c) " + M(k + " \\cdot " + N(A) + " = " + N(k * A)) + " cm² = " + X(r6((k * A) / 10000)) + " m².")); }
let b, h, c, A, h2; do { b = ri(6, 14); h = ri(4, 9); c = ri(h + 1, 13); A = b * h; h2 = A / c; } while (c === b || Math.abs(h2 * 10 - Math.round(h2 * 10)) > 1e-9);
const d1 = pk([4, 6, 8, 10, 12].filter((x) => (2 * A) % x === 0 && 2 * A / x !== x)) || 2, d2 = (2 * A) / d1;
return CX(cx, PB("Un parallélogramme " + M("ABCD") + " a une base " + M("[AB]") + " de " + X(b) + " cm et une hauteur relative à cette base de " + X(h) + " cm. Son côté " + M("[BC]") + " mesure " + X(c) + " cm.",
[["a) Aire du parallélogramme, en cm²", A], ["b) Hauteur relative au côté " + M("[BC]") + ", en cm", h2, Number.isInteger(h2) ? 0 : 0.1], ["c) Un losange a la même aire, et une diagonale de " + X(d1) + " cm. Longueur de l'autre diagonale, en cm", d2]],
["L'aire ne dépend pas du côté choisi comme base : base · hauteur correspondante.", "Losange : aire = (diagonale · diagonale) ÷ 2."],
"a) " + M(b + " \\cdot " + h + " = " + A) + " cm². b) " + M(A + " \\div " + c + " = " + N(h2)) + " cm. c) " + M("d \\cdot " + d1 + " \\div 2 = " + A) + ", donc " + M("d = " + 2 * A + " \\div " + d1 + " = " + N(d2)) + " cm."));
});
PX("aire3", () => {

const cx = pk(["jardin", "piscine", "photo"]);
if (cx === "piscine") { const a = ri(6, 12), b = ri(3, 6), G = r6((a + 1) * (b + 1)), al = r6(G - a * b), nd = Math.round(al / 0.25);
return CX(cx, PB("Un bassin rectangulaire de " + X(a) + " m sur " + X(b) + " m est entouré d'une bordure de dalles de 50 cm de large.",
[["a) Aire du grand rectangle (bassin + bordure), en m²", G], ["b) Aire de la bordure, en m²", al], ["c) Combien de dalles carrées de 50 cm de côté faut-il pour la bordure ?", nd]],
["La bordure dépasse de 0,5 m de chaque côté : 1 m de plus en longueur et en largeur.", "c) Une dalle couvre 0,5 · 0,5 = 0,25 m²."],
"a) " + M("(" + a + " + 1) \\cdot (" + b + " + 1) = " + (a + 1) + " \\cdot " + (b + 1) + " = " + G) + " m². b) " + M(G + " - " + a + " \\cdot " + b + " = " + al) + " m². c) " + M(al + " \\div 0{,}25 = " + nd) + " dalles.")); }
if (cx === "photo") { const a = pk([10, 13, 15, 18]), b = pk([13, 15, 18, 20, 24].filter((x) => x > a)), l = pk([3, 4, 5]), G = (a + 2 * l) * (b + 2 * l), al = G - a * b;
return CX(cx, PB("Une photo de " + X(a) + " cm sur " + X(b) + " cm est collée sur un passe-partout en carton qui dépasse de " + X(l) + " cm tout autour.",
[["a) Aire totale (photo + passe-partout), en cm²", G], ["b) Aire visible du passe-partout, en cm²", al], ["c) Aire visible du passe-partout, en dm²", r6(al / 100)]],
["Le passe-partout ajoute " + l + " cm de chaque côté : " + 2 * l + " cm de plus en largeur et en hauteur.", "Aire visible = aire totale − aire de la photo ; 1 dm² = 100 cm²."],
"a) " + M("(" + a + " + " + 2 * l + ") \\cdot (" + b + " + " + 2 * l + ") = " + (a + 2 * l) + " \\cdot " + (b + 2 * l) + " = " + G) + " cm². b) " + M(G + " - " + a + " \\cdot " + b + " = " + al) + " cm². c) " + X(r6(al / 100)) + " dm².")); }
const a = ri(8, 20), b = ri(5, 12), l = pk([1, 2]), p = pk([12, 15, 18, 24]), G = (a + 2 * l) * (b + 2 * l), al = G - a * b;
return CX(cx, PB("Un jardin rectangulaire de " + X(a) + " m sur " + X(b) + " m est entouré d'une allée de " + X(l) + " m de large. On couvre l'allée de gravier à " + X(p) + " CHF le m².",
[["a) Aire du grand rectangle (jardin + allée), en m²", G], ["b) Aire de l'allée, en m²", al], ["c) Prix du gravier, en CHF", al * p]],
["Le grand rectangle dépasse le jardin de " + l + " m de chaque côté : " + 2 * l + " m de plus en longueur et en largeur.", "Aire de l'allée = grand rectangle − jardin."],
"a) " + M("(" + a + " + " + 2 * l + ") \\cdot (" + b + " + " + 2 * l + ") = " + (a + 2 * l) + " \\cdot " + (b + 2 * l) + " = " + G) + " m². b) " + M(G + " - " + a + " \\cdot " + b + " = " + al) + " m². c) " + M(al + " \\cdot " + p + " = " + N(al * p)) + " CHF."));
});
PX("solides", () => {
const n = pk([5, 6, 7, 8, 9]), pyr = R.rand() < 0.5, nm = { 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone" }[n];
const F = pyr ? n + 1 : n + 2, Ar = pyr ? 2 * n : 3 * n, S = pyr ? n + 1 : 2 * n;
return PB("Un" + (pyr ? "e pyramide" : " prisme droit") + " a pour base un " + nm + " (" + n + " côtés).",
[["a) Nombre de faces", F], ["b) Nombre d'arêtes", Ar], ["c) Nombre de sommets", S]],
[pyr ? "Une pyramide : une base, et un triangle sur chaque côté de la base, qui se rejoignent au sommet." : "Un prisme : deux bases identiques, reliées par un rectangle sur chaque côté.", "Vérifie avec la relation d'Euler : faces + sommets − arêtes = 2."],
pyr ? "a) " + M("1 + " + n + " = " + F) + " faces. b) " + n + " arêtes autour de la base et " + n + " vers le sommet : " + Ar + ". c) " + n + " sommets de la base et le sommet : " + S + ". Euler : " + M(F + " + " + S + " - " + Ar + " = 2") + "."
: "a) " + M("2 + " + n + " = " + F) + " faces. b) " + n + " arêtes par base et " + n + " arêtes latérales : " + M("3 \\cdot " + n + " = " + Ar) + ". c) " + M("2 \\cdot " + n + " = " + S) + " sommets. Euler : " + M(F + " + " + S + " - " + Ar + " = 2") + ".");
});
PX("volpave", () => {

const cx = pk(["boite", "carton", "jardiniere"]);
if (cx === "carton") { const a = pk([40, 50, 60]), b = pk([30, 40]), c = pk([30, 40, 50]), k = pk([5, 10]), V = a * b * c, S = 2 * (a * b + a * c + b * c);
return CX(cx, PB("Un carton de déménagement fermé a la forme d'un pavé de " + X(a) + " cm sur " + X(b) + " cm, et " + X(c) + " cm de haut.",
[["a) Volume du carton, en litres", V / 1000], ["b) Aire de carton nécessaire (six faces), en cm²", S], ["c) Combien de boîtes cubiques de " + k + " cm d'arête peut-on y ranger ?", (a / k) * (b / k) * (c / k)]],
["1 L = 1 dm³ = 1'000 cm³. Un pavé fermé a trois paires de faces identiques.", "c) Combien de boîtes sur la longueur, sur la largeur, sur la hauteur ?"],
"a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(V)) + " cm³ = " + X(V / 1000) + " L. b) " + M("2 \\cdot (" + a + " \\cdot " + b + " + " + a + " \\cdot " + c + " + " + b + " \\cdot " + c + ") = " + N(S)) + " cm². c) " + M(a / k + " \\cdot " + b / k + " \\cdot " + c / k + " = " + (a / k) * (b / k) * (c / k)) + " boîtes.")); }
if (cx === "jardiniere") { let a, b, c, V, s, ns; do { a = pk([60, 80, 100, 120]); b = pk([20, 25, 30]); c = pk([20, 25, 30]); V = (a * b * c) / 1000; s = pk([10, 20, 40]); ns = Math.ceil(V / s - 1e-9); } while (Math.abs(V / s - Math.round(V / s)) < 1e-9 || V < 2 * s);
return CX(cx, PB("Une jardinière a la forme d'un pavé de " + X(a) + " cm de long, " + X(b) + " cm de large et " + X(c) + " cm de haut (dimensions intérieures). On veut la remplir de terreau, vendu en sacs de " + s + " L.",
[["a) Volume de la jardinière, en litres", V], ["b) Aire des quatre faces latérales, en cm²", 2 * (a + b) * c], ["c) Combien de sacs faut-il au minimum ?", ns]],
["1 L = 1 dm³ = 1'000 cm³.", "c) Un sac entamé compte : arrondis vers le haut."],
"a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + X(V) + " L. b) " + M("2 \\cdot " + a + " \\cdot " + c + " + 2 \\cdot " + b + " \\cdot " + c + " = " + N(2 * (a + b) * c)) + " cm². c) " + M(N(V) + " \\div " + s + (Number.isInteger((V / s) * 100) ? " = " : " \\approx ") + N(Math.floor((V / s) * 100) / 100)) + " : " + ns + " sacs.")); }
const k = pk([2, 3, 4, 5]), a = k * ri(3, 6), b = k * ri(2, 4), c = k * ri(2, 3), V = a * b * c, S = a * b + 2 * a * c + 2 * b * c;
return CX(cx, PB("Une boîte sans couvercle a la forme d'un pavé de " + X(a) + " cm sur " + X(b) + " cm, et " + X(c) + " cm de haut.",
[["a) Volume de la boîte, en cm³", V], ["b) Aire de carton nécessaire (sans couvercle), en cm²", S], ["c) Combien de cubes de " + k + " cm d'arête peut-on y ranger ?", (a / k) * (b / k) * (c / k)]],
["Sans couvercle : le fond, et quatre faces latérales (deux paires identiques).", "c) Combien de cubes sur la longueur, sur la largeur, sur la hauteur ?"],
"a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(V)) + " cm³. b) " + M(a + " \\cdot " + b + " + 2 \\cdot " + a + " \\cdot " + c + " + 2 \\cdot " + b + " \\cdot " + c + " = " + N(S)) + " cm². c) " + M(a / k + " \\cdot " + b / k + " \\cdot " + c / k + " = " + (a / k) * (b / k) * (c / k)) + " cubes."));
});


PX("fracrep", () => {

const cx = pk(["tartes", "sentier", "gourdes"]);
const POOL = [[3, 4], [5, 6], [2, 3], [5, 8], [7, 12], [3, 8], [5, 12], [1, 3], [7, 8], [1, 4]];
let F; do { F = POOL.slice().sort(() => R.rand() - 0.5).slice(0, 3); } while (new Set(F.map(([p, q]) => p / q)).size < 3 || F.filter(([p, q]) => p / q > 0.5).length !== 2);
const D = F.reduce((m, [, q]) => lcm(m, q), 1), big = F.slice().sort((x, y) => y[0] / y[1] - x[0] / x[1])[0], half = F.filter(([p, q]) => p / q > 0.5).length;
const nm = pk([["Lina", "Noé", "Sara"], ["Tom", "Mia", "Luca"], ["Zoé", "Malik", "Nora"]]);
const [intro, verbe, qa, qc] = cx === "sentier" ? ["Trois amis partent sur le même sentier de randonnée, chacun à son rythme. À midi, ", " a parcouru ", "a) Combien d'entre eux ont fait plus de la moitié du sentier ?", "c) Écrite avec ce dénominateur, la fraction de celui qui est allé le plus loin a pour numérateur…"]
: cx === "gourdes" ? ["Trois amis ont des gourdes identiques, pleines au départ. Après l'entraînement de football, ", " a bu ", "a) Combien d'entre eux ont bu plus de la moitié de leur gourde ?", "c) Écrite avec ce dénominateur, la fraction de celui qui a bu le plus a pour numérateur…"]
: ["Trois amis partagent des tartes de même taille. ", " a mangé ", "a) Combien d'entre eux ont mangé plus d'une demi-tarte ?", "c) Écrite avec ce dénominateur, la plus grande part a pour numérateur…"];
const what = cx === "sentier" ? " du sentier" : cx === "gourdes" ? " de sa gourde" : " de tarte";
return CX(cx, PB(intro + F.map(([p, q], i) => nm[i] + verbe + M("\\frac{" + p + "}{" + q + "}") + what).join(", ") + ".",
[[qa, half], ["b) Plus petit dénominateur commun des trois fractions", D], [qc, (big[0] * D) / big[1]]],
["Plus d'une demie : le numérateur dépasse la moitié du dénominateur.", "Dénominateur commun : le plus petit nombre qui est un multiple des trois dénominateurs ; puis amplifie chaque fraction."],
"a) " + half + ". b) " + D + ". Avec ce dénominateur : " + F.map(([p, q]) => M("\\frac{" + p + "}{" + q + "} = \\frac{" + (p * D) / q + "}{" + D + "}")).join(" ; ") + ". c) La plus grande fraction : " + M("\\frac{" + (big[0] * D) / big[1] + "}{" + D + "}") + "."));
});
PX("fracsimp", () => {

const cx = pk(["fraction", "matchs", "sondage"]);
const PQ = [[2, 3], [3, 4], [2, 5], [4, 7], [3, 8], [5, 9], [5, 6], [4, 9]];
if (cx === "matchs") { let p, q, k, m; do { [p, q] = pk(PQ); k = ri(3, 8); m = ri(4, 12); } while (k * q < 18 || k * q > 60 || m === k || m * q > 80);
const sp = pk([["Une équipe de hockey", "matchs"], ["Une joueuse de tennis", "matchs"], ["Une équipe de basket", "matchs"]]);
return CX(cx, PB(sp[0] + " a gagné " + X(k * p) + " de ses " + X(k * q) + " " + sp[1] + " cette saison.",
[["a) Numérateur de la fraction irréductible des matchs gagnés", p], ["b) Dénominateur de cette fraction irréductible", q], ["c) À ce rythme, combien de victoires sur " + m * q + " matchs ?", m * p]],
["Fraction des matchs gagnés : " + k * p + "/" + k * q + ", puis simplifie au maximum.", "c) Amplifie la fraction irréductible pour obtenir le dénominateur " + m * q + "."],
"a) et b) " + M("\\frac{" + k * p + "}{" + k * q + "} = \\frac{" + p + "}{" + q + "}") + " (on divise par " + k + "). c) " + M("\\frac{" + p + "}{" + q + "} = \\frac{" + m * p + "}{" + m * q + "}") + " : " + m * p + " victoires.")); }
if (cx === "sondage") { let p, q, k, m; do { [p, q] = pk(PQ); k = pk([12, 14, 15, 16, 18, 20, 21, 24]); m = ri(40, 90); } while (k * q > 200 || m === k);
const [qui, quoi] = pk([["élèves", "viennent à l'école à vélo"], ["élèves", "font partie d'un club de sport"], ["élèves", "ont un animal de compagnie"]]);
return CX(cx, PB("Dans un sondage, " + X(k * p) + " des " + X(k * q) + " " + qui + " interrogés " + quoi + ".",
[["a) Numérateur de la fraction irréductible", p], ["b) Dénominateur de la fraction irréductible", q], ["c) Avec la même proportion, combien d'élèves sur " + X(m * q) + " " + quoi + " ?", m * p]],
["Simplifie en plusieurs fois si tu veux : par 2, par 3…", "c) Combien de fois " + q + " dans " + m * q + " ? Multiplie le numérateur par ce nombre."],
"a) et b) " + M("\\frac{" + k * p + "}{" + k * q + "} = \\frac{" + p + "}{" + q + "}") + " (on divise par " + k + "). c) " + M(N(m * q) + " \\div " + q + " = " + m) + ", et " + M(m + " \\cdot " + p + " = " + N(m * p)) + ".")); }
const [p, q] = pk(PQ), k = pk([12, 14, 18, 21, 24]), cnt = Math.floor(50 / q) - Math.ceil(20 / q) + 1;
return CX(cx, PB("On veut simplifier la fraction " + M("\\frac{" + k * p + "}{" + k * q + "}") + " au maximum.",
[["a) Numérateur de la fraction irréductible", p], ["b) Dénominateur de la fraction irréductible", q], ["c) Combien de fractions égales à celle-ci ont un dénominateur compris entre 20 et 50 (bornes comprises) ?", cnt]],
["Simplifie en plusieurs fois si tu veux : par 2, par 3, par 7…", "c) Les fractions égales s'obtiennent en amplifiant : leurs dénominateurs sont les multiples de " + q + "."],
"a) et b) " + M("\\frac{" + k * p + "}{" + k * q + "} = \\frac{" + p + "}{" + q + "}") + " (on divise par " + k + "). c) Multiples de " + q + " entre 20 et 50 : " + Array.from({ length: cnt }, (_, i) => (Math.ceil(20 / q) + i) * q).join(", ") + " : " + cnt + " fractions."));
});
PX("fractout", () => {

const cx = pk(["classe", "argent", "bonbons"]);
let n, a, b, c, d, f, r, mu; do { [a, b] = pk([[2, 3], [3, 4], [2, 5], [3, 5], [1, 3], [1, 4]]); [c, d] = pk([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]); n = pk(cx === "argent" ? [60, 72, 90, 120, 150] : cx === "bonbons" ? [24, 30, 36, 40, 48, 60] : [18, 20, 24, 28, 30]);  f = (n * a) / b; r = n - f; mu = (r * c) / d; } while (!Number.isInteger(f) || !Number.isInteger(mu) || mu === 0 || r - mu === 0);
const F1 = M("\\frac{" + a + "}{" + b + "}"), F2 = M("\\frac{" + c + "}{" + d + "}");
const [q, la, lb, lc, u] = cx === "argent" ? [who() + " a " + X(n) + " CHF d'argent de poche. Elle dépense " + F1 + " de cette somme pour un billet de concert, puis " + F2 + " de ce qui lui reste pour un livre.", "a) Prix du billet de concert, en CHF", "b) Prix du livre, en CHF", "c) Somme qui lui reste à la fin, en CHF", " CHF"]
: cx === "bonbons" ? ["Un sachet contient " + X(n) + " bonbons. " + F1 + " sont à la fraise. Parmi les autres, " + F2 + " sont au citron, et le reste à la menthe.", "a) Combien de bonbons à la fraise ?", "b) Combien de bonbons au citron ?", "c) Combien de bonbons à la menthe ?", ""]
: ["Dans une classe de " + X(n) + " élèves, " + F1 + " font du football. Parmi les autres, " + F2 + " font de la musique.", "a) Combien d'élèves font du football ?", "b) Combien d'élèves font de la musique ?", "c) Combien d'élèves ne font ni l'un ni l'autre ?", ""];
return CX(cx, PB(q, [[la, f], [lb, mu], [lc, r - mu]],
["Fraction d'une quantité : divise par le dénominateur, multiplie par le numérateur.", "b) Attention : la deuxième fraction porte sur ce qui reste, pas sur le total."],
"a) " + M(n + " \\div " + b + " \\cdot " + a + " = " + f) + u + ". Reste : " + M(n + " - " + f + " = " + r) + u + ". b) " + M(r + " \\div " + d + " \\cdot " + c + " = " + mu) + u + ". c) " + M(r + " - " + mu + " = " + (r - mu)) + u + "."));
});


PX("proptab", () => {

const cx = pk(["cerises", "essence", "fromage"]);
if (cx === "essence") { const u = pk([1.79, 1.85, 1.92, 1.98]), m1 = pk([10, 20]), m2 = pk([35, 42, 48]), m3 = pk([25, 30, 50]);
return CX(cx, PB("À la pompe, le prix de l'essence est proportionnel au volume : " + X(m1) + " litres coûtent " + X(r6(u * m1)) + " CHF.",
[["a) Prix d'un litre, en CHF", u, 0.01], ["b) Prix de " + X(m2) + " litres, en CHF", r6(u * m2), 0.01], ["c) Combien de litres obtient-on pour " + X(r6(u * m3)) + " CHF ?", m3]],
["Le coefficient de proportionnalité est le prix d'un litre.", "c) Volume = prix ÷ prix d'un litre."],
"a) " + M(N(r6(u * m1)) + " \\div " + m1 + " = " + N(u)) + " CHF. b) " + M(m2 + " \\cdot " + N(u) + " = " + N(r6(u * m2))) + " CHF. c) " + M(N(r6(u * m3)) + " \\div " + N(u) + " = " + m3) + " litres.")); }
if (cx === "fromage") { const u = pk([18, 22, 24, 26, 32]), m1 = pk([200, 250, 400]), m2 = pk([150, 350, 450, 600].filter((x) => x !== m1)), m3 = pk([500, 750, 800]), [fr] = [pk(["gruyère", "vacherin", "tomme", "emmental"])];
return CX(cx, PB("Au rayon fromage, le prix est proportionnel à la masse : " + X(m1) + " g de " + fr + " coûtent " + X(r6((u * m1) / 1000)) + " CHF.",
[["a) Prix d'un kilo, en CHF", u], ["b) Prix de " + X(m2) + " g, en CHF", r6((u * m2) / 1000), 0.01], ["c) Quelle masse (en g) obtient-on pour " + X(r6((u * m3) / 1000)) + " CHF ?", m3]],
["1 kg = 1'000 g : combien de fois " + m1 + " g dans 1 kg ?", "c) Masse en kg = prix ÷ prix d'un kilo ; convertis ensuite en g."],
"a) " + M(N(r6((u * m1) / 1000)) + " \\cdot " + N(1000 / m1) + " = " + u) + " CHF. b) " + M(N(m2 / 1000) + " \\cdot " + u + " = " + N(r6((u * m2) / 1000))) + " CHF. c) " + M(N(r6((u * m3) / 1000)) + " \\div " + u + " = " + N(m3 / 1000)) + " kg = " + m3 + " g.")); }
const u = pk([2.4, 3.5, 4.2, 5.6, 6.5]), m1 = pk([3, 4, 5]), m2 = pk([1.5, 2.5, 7]), m3 = pk([8, 12, 15]);
return CX(cx, PB("Au marché, le prix des cerises est proportionnel à leur masse : " + X(m1) + " kg coûtent " + X(r6(u * m1)) + " CHF.",
[["a) Prix d'un kilo, en CHF", u, 0.01], ["b) Prix de " + X(m2) + " kg, en CHF", r6(u * m2), 0.01], ["c) Combien de kg achète-t-on avec " + X(r6(u * m3)) + " CHF ?", m3]],
["Le coefficient de proportionnalité est le prix d'un kilo.", "c) Masse = prix ÷ prix d'un kilo."],
"a) " + M(N(r6(u * m1)) + " \\div " + m1 + " = " + N(u)) + " CHF. b) " + M(N(m2) + " \\cdot " + N(u) + " = " + N(r6(u * m2))) + " CHF. c) " + M(N(r6(u * m3)) + " \\div " + N(u) + " = " + m3) + " kg."));
});
PX("prop", () => {

const cx = pk(["recette", "sirop", "mur"]);
const T = { recette: { g: [4, 6], fa: [180, 240, 300, 360], oe: [2, 3, 4] }, sirop: { g: [4, 6], fa: { 4: [480, 500, 600], 6: [720, 750, 900] }, oe: [2, 3, 4] }, mur: { g: [4, 6], fa: { 4: [200, 240], 6: [300, 360] }, oe: [2, 3] } }[cx];
let g, fa, oe, n2, n3; do { g = pk(T.g); fa = pk(Array.isArray(T.fa) ? T.fa : T.fa[g]); oe = pk(T.oe); n2 = pk(g === 4 ? [6, 10, 14] : [9, 15, 4]); n3 = pk(g === 4 ? [12, 18, 22, 10] : [8, 10, 16, 9]); } while (!Number.isInteger((oe * n3) / g) || n2 === n3 || !Number.isInteger((fa * n2) / g) || oe === g);
const W = { recette: [g + " personnes", "g de farine", "œufs", "personnes", "a) Farine pour " + n2 + " personnes, en g", "b) Avec " + X((fa * n3) / g) + " g de farine, pour combien de personnes cuisine-t-on ?", "c) Œufs nécessaires pour " + n3 + " personnes", "Une recette pour " + g + " personnes demande " + X(fa) + " g de farine et " + X(oe) + " œufs."],
sirop: [g + " litres", "ml de sirop", "citrons", "litres", "a) Sirop pour " + n2 + " litres de boisson, en ml", "b) Avec " + X((fa * n3) / g) + " ml de sirop, combien de litres de boisson prépare-t-on ?", "c) Citrons nécessaires pour " + n3 + " litres de boisson", "Pour " + g + " litres de boisson à la fête de l'école, on mélange " + X(fa) + " ml de sirop et le jus de " + X(oe) + " citrons, puis on complète avec de l'eau."],
mur: [g + " m²", "briques", "sacs de mortier", "m²", "a) Briques pour " + n2 + " m² de mur", "b) Avec " + X((fa * n3) / g) + " briques, quelle surface de mur (en m²) peut-on monter ?", "c) Sacs de mortier nécessaires pour " + n3 + " m²", "Pour monter " + g + " m² de mur, un maçon utilise " + X(fa) + " briques et " + X(oe) + " sacs de mortier."] }[cx];
return CX(cx, PB(W[7], [[W[4], (fa * n2) / g], [W[5], n3], [W[6], (oe * n3) / g]],
["Passe par l'unité (1 " + (cx === "recette" ? "personne" : cx === "sirop" ? "litre" : "m²") + ") : divise par " + g + ", puis multiplie.", "b) Combien de fois " + N(fa / g) + " dans " + N((fa * n3) / g) + " ?"],
"Pour 1 " + (cx === "recette" ? "personne" : cx === "sirop" ? "litre" : "m²") + " : " + M(N(fa) + " \\div " + g + " = " + N(fa / g)) + " " + W[1] + " et " + M(oe + " \\div " + g + " = " + N(oe / g)) + " " + W[2] + ". a) " + M(n2 + " \\cdot " + N(fa / g) + " = " + N((fa * n2) / g)) + ". b) " + M(N((fa * n3) / g) + " \\div " + N(fa / g) + " = " + n3) + " " + W[3] + ". c) " + M(n3 + " \\cdot " + N(oe / g) + " = " + N(r6((oe * n3) / g))) + " " + W[2] + "."));
});
PX("change", () => {

const cx = pk(["euro", "livre", "dollar"]);
const [r, nom, pl, lieu] = cx === "livre" ? [pk([1.08, 1.12, 1.15]), "1 livre sterling", "livres", "Londres"] : cx === "dollar" ? [pk([0.84, 0.88, 0.91]), "1 dollar", "dollars", "New York"] : [pk([0.94, 0.95, 0.96]), "1 euro", "euros", "Barcelone"];
const e1 = pk([150, 240, 320, 450]), c2 = pk([200, 300, 500]), z = pk([35, 45, 60]), r2 = r6(r - pk([0.02, 0.03])), b2 = Math.round((c2 / r) * 100) / 100;
return CX(cx, PB("Avant un voyage à " + lieu + ", " + nom + " vaut " + X(r) + " CHF à la banque.",
[["a) Combien coûtent " + X(e1) + " " + pl + ", en CHF ?", r6(e1 * r), 0.01], ["b) Somme obtenue en " + pl + " pour " + X(c2) + " CHF (arrondie au centime)", b2, 0.01], ["c) Au retour, il reste " + X(z) + " " + pl + ", que la banque rachète à " + X(r2) + " CHF l'unité. Combien de CHF reçoit-on ?", r6(z * r2), 0.01]],
["Des " + pl + " vers le franc : multiplie par le taux.", "Du franc vers les " + pl + " : divise par le taux."],
"a) " + M(e1 + " \\cdot " + N(r) + " = " + N(r6(e1 * r))) + " CHF. b) " + M(c2 + " \\div " + N(r) + " \\approx " + N(b2)) + " " + pl + ". c) " + M(z + " \\cdot " + N(r2) + " = " + N(r6(z * r2))) + " CHF."));
});
PX("agrand", () => {

const cx = pk(["photo", "photocopie", "logo"]);
if (cx === "logo") { const a = pk([24, 30, 36, 40]), b = pk([18, 20, 25, 32].filter((x) => x < a)), k = pk([2.5, 3, 4, 5]), k2 = pk([0.4, 0.5, 0.8]), A = r6(a * k);
return CX(cx, PB("Un logo de " + X(a) + " mm de large et " + X(b) + " mm de haut est agrandi pour être imprimé sur un t-shirt : sa largeur passe à " + X(A) + " mm.",
[["a) Coefficient d'agrandissement", k], ["b) Nouvelle hauteur, en mm", r6(b * k)], ["c) Pour une casquette, on réduit le logo du t-shirt avec un coefficient de " + X(k2) + ". Largeur sur la casquette, en mm", r6(A * k2)]],
["Coefficient = nouvelle longueur ÷ ancienne longueur.", "Toutes les longueurs sont multipliées par le même coefficient."],
"a) " + M(N(A) + " \\div " + a + " = " + N(k)) + ". b) " + M(b + " \\cdot " + N(k) + " = " + N(r6(b * k))) + " mm. c) " + M(N(A) + " \\cdot " + N(k2) + " = " + N(r6(A * k2))) + " mm.")); }
if (cx === "photocopie") { const a = pk([12, 16, 20]), b = pk([8, 10, 14]), p = pk([125, 150, 175, 200]), k = p / 100, A = r6(a * k), q = pk([50, 75, 80]);
return CX(cx, PB("À la photocopieuse, on agrandit un plan de " + X(a) + " cm sur " + X(b) + " cm : sur la copie, la longueur mesure " + X(A) + " cm.",
[["a) Pourcentage d'agrandissement réglé sur la photocopieuse (en %)", p], ["b) Largeur sur la copie, en cm", r6(b * k)], ["c) On photocopie ensuite la copie à " + q + " %. Longueur sur cette nouvelle copie, en cm", r6((A * q) / 100)]],
["Coefficient = nouvelle longueur ÷ ancienne longueur ; un coefficient de 1,5 correspond à 150 %.", "c) " + q + " % : coefficient " + N(q / 100) + "."],
"a) " + M(N(A) + " \\div " + a + " = " + N(k)) + ", soit " + p + " %. b) " + M(b + " \\cdot " + N(k) + " = " + N(r6(b * k))) + " cm. c) " + M(N(A) + " \\cdot " + N(q / 100) + " = " + N(r6((A * q) / 100))) + " cm.")); }
const [a, b] = pk([[10, 15], [9, 13], [12, 18], [10, 14]]), k = pk([1.5, 2.5, 3, 1.2]), k2 = pk([0.5, 0.4, 0.8]), A = r6(a * k);
return CX(cx, PB("Une photo de " + X(a) + " cm sur " + X(b) + " cm est agrandie : sa largeur passe à " + X(A) + " cm.",
[["a) Coefficient d'agrandissement", k], ["b) Nouvelle hauteur, en cm", r6(b * k)], ["c) On réduit ensuite cette nouvelle photo avec un coefficient de " + X(k2) + ". Largeur finale, en cm", r6(A * k2)]],
["Coefficient = nouvelle longueur ÷ ancienne longueur.", "Toutes les longueurs sont multipliées par le même coefficient."],
"a) " + M(N(A) + " \\div " + a + " = " + N(k)) + ". b) " + M(b + " \\cdot " + N(k) + " = " + N(r6(b * k))) + " cm. c) " + M(N(A) + " \\cdot " + N(k2) + " = " + N(r6(A * k2))) + " cm."));
});
})();





(() => {
if (typeof PROBX === "undefined") return;
const ri = R.int, pk = R.pick;
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
const X = (v) => M(N(v));
const PX = (id, co, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), { co })); };
const sp = (v, rd) => (Array.isArray(v) ? { kind: "pair", values: v } : Object.assign({ kind: "value", value: rd ? v : +(+v).toPrecision(15) }, rd ? { round: rd } : {}));
const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: sp(v, rd) })) });
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const pt = (x, y) => M("(" + N(x) + "\\,;\\," + N(y) + ")");
const PAIRL = " (réponds « x ; y »)";

const CX = (cx, q) => Object.assign(q, { ctx: cx });




PX("arith", [9, 10, 11], () => {
let a, b, m; do { a = pk([6, 8, 9, 10, 12, 15]); b = pk([8, 10, 12, 15, 18, 20]); m = (a * b) / gcd(a, b); } while (a >= b || gcd(a, b) === 1 || m > 120 || m === b);
return PB("Deux bus partent ensemble du terminus à 7 h. Le premier repasse au terminus toutes les " + a + " minutes, le second toutes les " + b + " minutes.",
[["a) Après combien de minutes les deux bus repartent-ils de nouveau ensemble ?", m], ["b) Combien de tours le premier bus a-t-il faits pendant ce temps ?", m / a], ["c) Et le second ?", m / b]],
["« Ensemble de nouveau » : un multiple commun aux deux durées, le plus petit (PPMC).", "Nombre de tours : la durée divisée par la durée d'un tour."],
"a) PPMC(" + a + " ; " + b + ") = " + m + " minutes. b) " + M(m + " \\div " + a + " = " + m / a) + " tours. c) " + M(m + " \\div " + b + " = " + m / b) + " tours.");
});
PX("arith", [9, 10, 11], () => {
let a, b, g; do { g = pk([4, 6, 8, 12]); a = g * ri(3, 9); b = g * ri(3, 9); } while (gcd(a / g, b / g) !== 1 || a === b || a > 80 || b > 80);
return PB("Pour une fête, on veut répartir " + a + " croissants et " + b + " pains au chocolat dans des corbeilles identiques (même contenu dans chaque corbeille), avec le plus grand nombre de corbeilles possible.",
[["a) Combien de corbeilles peut-on faire ?", g], ["b) Combien de croissants dans chaque corbeille ?", a / g], ["c) Combien de pains au chocolat dans chaque corbeille ?", b / g]],
["« Le plus grand nombre de corbeilles identiques » : un diviseur commun, le plus grand (PGDC).", "Chaque corbeille reçoit la même part : divise par le nombre de corbeilles."],
"a) PGDC(" + a + " ; " + b + ") = " + g + " corbeilles. b) " + M(a + " \\div " + g + " = " + a / g) + " croissants. c) " + M(b + " \\div " + g + " = " + b / g) + " pains au chocolat.");
});
PX("diagr", [9, 10, 11], () => {

const cx = pk(["notes", "basket", "temperatures"]);
if (cx !== "notes") {
const B = cx === "basket" ? { v: [6, 24], lo: 4, hi: 32, t: [12, 14, 15, 16, 18] } : { v: [-4, 9], lo: -6, hi: 12, t: [1, 2, 3, 4, 5] };
let n, xs, k, tgt; do { n = pk([5, 6]); xs = Array.from({ length: n - 1 }, () => ri(B.v[0], B.v[1])); tgt = pk(B.t); k = tgt * n - xs.reduce((s, x) => s + x, 0); } while (k < B.lo || k > B.hi || k === 0 || k === 1 || Number.isInteger(xs.reduce((s, x) => s + x, 0) / (n - 1)) || new Set(xs).size < n - 2);
const S = xs.reduce((s, x) => s + x, 0), m0 = S / (n - 1), mr = Math.round(+(m0 * 100).toPrecision(12)) / 100;
const q = cx === "basket" ? "Lors de ses " + (n - 1) + " premiers matchs de basket, Yanis a marqué " + xs.map(X).join(" ; ") + " points. Il reste un match dans la saison."
: "En montagne, on a relevé la température à midi pendant " + (n - 1) + " jours de janvier : " + xs.map((x) => X(x) + " °C").join(" ; ") + ". On attend le relevé du jour suivant.";
const [la, lb, lc, u] = cx === "basket" ? ["a) Moyenne actuelle de points par match (au centième)", "b) Total de ses points", "c) Combien de points doit-il marquer au dernier match pour finir avec exactement " + tgt + " points de moyenne ?", " points"]
: ["a) Température moyenne actuelle, en °C (au centième)", "b) Somme des températures relevées", "c) Quelle température faudrait-il le jour suivant pour que la moyenne des " + n + " jours soit exactement " + tgt + " °C ?", " °C"];
return CX(cx, PB(q, [[la, m0, 0.01], [lb, S], [lc, k]],
["Moyenne = somme des valeurs ÷ nombre de valeurs" + (cx === "basket" ? "." : " ; attention aux nombres négatifs."), "c) Avec " + n + " valeurs et une moyenne de " + tgt + ", quelle doit être la somme des " + n + " valeurs ?"],
"a) " + M(N(S) + " \\div " + (n - 1) + (Number.isInteger(r6(m0 * 100)) ? " = " : " \\approx ") + N(mr)) + ". b) " + X(S) + ". c) Somme nécessaire : " + M(n + " \\cdot " + tgt + " = " + n * tgt) + " ; dernière valeur : " + M(n * tgt + " - " + (S < 0 ? "(" + N(S) + ")" : N(S)) + " = " + N(k)) + u + "."));
}
let n, notes, k, tgt; do { n = pk([5, 6]); notes = Array.from({ length: n - 1 }, () => pk([3.5, 4, 4.5, 5, 5.5, 6])); tgt = pk([4.5, 5, 5.5]); k = r6(tgt * n - notes.reduce((s, x) => s + x, 0)); } while (k < 3 || k > 6 || Math.abs(k * 2 - Math.round(k * 2)) > 1e-9);
const S = r6(notes.reduce((s, x) => s + x, 0)), m0 = r6(S / (n - 1));
return CX(cx, PB("Léa a obtenu ces notes en maths : " + notes.map(X).join(" ; ") + ". Il reste un test avant la fin du semestre.",
[["a) Moyenne actuelle (au centième)", Math.round(+(m0 * 100).toPrecision(12)) / 100, 0.01] , ["b) Somme de ses notes actuelles", S], ["c) Quelle note doit-elle obtenir au dernier test pour avoir exactement " + N(tgt).replace("{,}", ",") + " de moyenne ?", k]],
["Moyenne = somme des notes ÷ nombre de notes.", "c) Avec " + n + " notes et une moyenne de " + N(tgt).replace("{,}", ",") + ", quelle doit être la somme des " + n + " notes ?"],
"a) " + M(N(S) + " \\div " + (n - 1) + (Number.isInteger(r6(m0 * 100)) ? " = " : " \\approx ") + N(Math.round(m0 * 100) / 100)) + ". b) " + X(S) + ". c) Somme nécessaire : " + M(n + " \\cdot " + N(tgt) + " = " + N(r6(n * tgt))) + " ; note : " + M(N(r6(n * tgt)) + " - " + N(S) + " = " + N(k)) + "."));
});
PX("premiers", [9, 10, 11], () => {

const cx = pk(["nombre", "fanfare", "dalles"]);
const P = [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]];
let p, q, a, b, n; do { [p, q] = pk(P); a = pk([2, 3, 4]); b = a % 2 ? ri(1, 2) : 1; n = p ** a * q ** b; } while (cx !== "nombre" && (n < 24 || n > 200));
const nd = (a + 1) * (b + 1), sq = (a % 2 ? p : 1) * (b % 2 ? q : 1), dec = M(N(n) + " = " + p + "^{" + a + "} \\cdot " + q + (b > 1 ? "^{" + b + "}" : ""));
if (cx === "fanfare") { const s = Math.ceil(Math.sqrt(n) - 1e-9), add = s * s - n;
return CX(cx, PB("Une fanfare de " + X(n) + " musiciens veut défiler en rangs complets, tous de la même longueur.",
[["a) Combien de diviseurs le nombre " + n + " a-t-il en tout ?", nd], ["b) Combien de façons de défiler y a-t-il, avec au moins 2 rangs et au moins 2 musiciens par rang ?", nd - 2], ["c) Combien de musiciens faudrait-il ajouter au minimum pour pouvoir défiler en carré (autant de rangs que de musiciens par rang) ?", add]],
["Décompose " + n + " en facteurs premiers : chaque diviseur est un nombre de musiciens par rang possible.", "b) Enlève les deux cas exclus : un seul rang, ou un seul musicien par rang."],
dec + ". a) " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + " diviseurs. b) Sans 1 et " + n + " : " + (nd - 2) + " façons. c) Le plus petit carré qui n'est pas plus petit que " + n + " : " + M(s + "^2 = " + s * s) + ", donc " + add + " musiciens de plus" + (add === 0 ? " (c'est déjà un carré)" : "") + ".")); }
if (cx === "dalles") { const nr = Math.ceil(nd / 2);
return CX(cx, PB("On dispose de " + X(n) + " dalles carrées identiques et on veut les poser toutes, sans les couper, pour former un rectangle plein.",
[["a) Combien de diviseurs le nombre " + n + " a-t-il ?", nd], ["b) Combien de rectangles différents peut-on former (un rectangle de 2 sur 3 et un de 3 sur 2 comptent pour un seul ; une seule rangée compte) ?", nr], ["c) Par quel plus petit entier faut-il multiplier le nombre de dalles pour pouvoir former un carré ?", sq]],
["Chaque rectangle correspond à une paire de diviseurs dont le produit vaut " + n + ".", "c) Un carré parfait : chaque facteur premier y apparaît un nombre pair de fois."],
dec + ". a) " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + ". b) Les diviseurs vont par paires (produit " + n + ") : " + nr + " rectangles" + (nd % 2 ? " (dont un carré)" : "") + ". c) Exposants à rendre pairs : multiplier par " + sq + ".")); }
return CX(cx, PB("On considère le nombre " + X(n) + ".",
[["a) Combien de facteurs premiers (comptés avec répétition) dans sa décomposition ?", a + b], ["b) Combien de diviseurs a-t-il en tout ?", nd], ["c) Par quel plus petit entier faut-il le multiplier pour obtenir un carré parfait ?", sq]],
["Décompose en divisant par 2, puis 3, puis 5, puis 7… tant que c'est possible.", "Un carré parfait : chaque facteur premier y apparaît un nombre pair de fois."],
dec + ". a) " + (a + b) + " facteurs. b) Un diviseur prend " + p + " de 0 à " + a + " fois et " + q + " de 0 à " + b + " fois : " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + ". c) Il faut rendre les exposants pairs : multiplier par " + sq + "."));
});
PX("fracper", [9, 10, 11], () => {

const cx = pk(["mixte2", "pure2", "mixte1"]);
if (cx === "pure2") { let bc; do { bc = ri(12, 98); } while (bc % 11 === 0 || gcd(bc, 99) === 1);
const g = gcd(bc, 99), s = "0{,}" + bc + bc + bc + "\\ldots", B = String(bc);
return CX(cx, PB("La calculatrice affiche " + M(s) + " (le groupe « " + B + " » se répète sans fin). On veut écrire ce nombre sous forme de fraction irréductible.",
[["a) Combien vaut " + M("100 \\cdot x - x") + " si " + M("x = " + s) + " ?", bc], ["b) Numérateur de la fraction irréductible", bc / g], ["c) Dénominateur de la fraction irréductible", 99 / g]],
["Multiplie x par 100 pour décaler d'une période : les parties décimales sont les mêmes.", "Soustrais, puis simplifie la fraction obtenue."],
M("100x = " + B + "{,}" + B + B + "\\ldots") + " ; " + M("99x = " + bc) + ", donc " + M("x = \\frac{" + bc + "}{99} = \\frac{" + bc / g + "}{" + 99 / g + "}") + ".")); }
if (cx === "mixte1") { let a, c; do { a = ri(1, 9); c = ri(1, 9); } while (a === c || gcd(a * 9 + c, 90) === 1);
const nu = a * 9 + c, g = gcd(nu, 90), s = "0{,}" + a + c + c + c + "\\ldots";
return CX(cx, PB("On veut écrire " + M(s) + " (seul le chiffre « " + c + " » se répète) sous forme de fraction irréductible.",
[["a) Combien vaut " + M("100 \\cdot x - 10 \\cdot x") + " si " + M("x = " + s) + " ?", nu], ["b) Numérateur de la fraction irréductible", nu / g], ["c) Dénominateur de la fraction irréductible", 90 / g]],
["Multiplie x par 10 pour amener la période juste après la virgule, puis par 100 pour la décaler d'un chiffre.", "Soustrais, puis simplifie la fraction obtenue."],
M("100x = " + a + c + "{,}" + c + c + "\\ldots") + " et " + M("10x = " + a + "{,}" + c + c + "\\ldots") + " ; " + M("90x = " + (10 * a + c) + " - " + a + " = " + nu) + ", donc " + M("x = \\frac{" + nu + "}{90} = \\frac{" + nu / g + "}{" + 90 / g + "}") + ".")); }
const a = ri(1, 9), bc = pk([12, 27, 36, 45, 63, 81]), v = a / 10 + bc / 990;
let num = a * 99 + bc, den = 990; const g = gcd(num, den); num /= g; den /= g;
const s = "0{,}" + a + String(bc).padStart(2, "0") + String(bc).padStart(2, "0") + "\\ldots";
return CX(cx, PB("On veut écrire " + M(s) + " (le groupe « " + String(bc).padStart(2, "0") + " » se répète) sous forme de fraction irréductible.",
[["a) Combien vaut " + M("1000 \\cdot x - 10 \\cdot x") + " si " + M("x = " + s) + " ?", r6(990 * v)], ["b) Numérateur de la fraction irréductible", num], ["c) Dénominateur de la fraction irréductible", den]],
["Multiplie x par 10 pour amener la période juste après la virgule, puis par 1000 pour décaler d'une période : les parties décimales sont les mêmes.", "Soustrais, puis simplifie la fraction obtenue."],
M("1000x = " + a + String(bc).padStart(2, "0") + "{,}" + String(bc).padStart(2, "0") + "\\ldots") + " et " + M("10x = " + a + "{,}" + String(bc).padStart(2, "0") + "\\ldots") + " ; " + M("990x = " + (a * 99 + bc)) + ", donc " + M("x = \\frac{" + (a * 99 + bc) + "}{990} = \\frac{" + num + "}{" + den + "}") + "."));
});


PX("decarr", [9, 10], () => {
let p; do { p = r6(ri(4, 24) + ri(1, 9) / 10 + pk([0, 5]) / 100); }  while (Math.abs(p - Math.round(p)) < 0.15 || Math.round((p % 1) * 10) === 5);
const n = pk([3, 4, 6, 7, 8].filter((k) => ![0, 1].includes(r6(Math.abs(k * Math.round(p) - k * p))))) || 3, t = r6(p * n), [cx, txt] = pk([["supermarche", "Au supermarché, Tom achète # articles à @ CHF pièce."], ["librairie", "À la librairie, Inès achète # livres de poche à @ CHF pièce."], ["papeterie", "Pour la rentrée, Noé achète # classeurs à @ CHF pièce."]]);
return Object.assign(PB(txt.replace("#", n).replace("@", N(p)) + " Pour calculer de tête, on arrondit le prix à l'unité.",
[["a) Prix total exact, en CHF", t, 0.01], ["b) Total estimé avec le prix arrondi à l'unité", n * Math.round(p)], ["c) Différence entre l'estimation et le prix exact (en CHF, valeur positive)", r6(Math.abs(n * Math.round(p) - t)), 0.01]],
["Arrondir à l'unité : regarde le chiffre des dixièmes.", "c) L'arrondi fait une petite erreur sur chaque article ; elle est multipliée par " + n + "."],
"a) " + M(n + " \\cdot " + N(p) + " = " + N(t)) + " CHF. b) " + N(p) + " ≈ " + Math.round(p) + " ; " + M(n + " \\cdot " + Math.round(p) + " = " + n * Math.round(p)) + " CHF. c) " + M("|" + n * Math.round(p) + " - " + N(t) + "| = " + N(r6(Math.abs(n * Math.round(p) - t)))) + " CHF."), { ctx: cx });
});
PX("decprob", [9, 10], () => {

const cx = pk(["piquenique", "peinture", "gazon"]);
let L, pl, pu, bott, cost, bil, q, la, lb, a1;
for (let essai = 0; essai < 50; essai++) {
if (cx === "peinture") { const S = pk([24, 28, 32, 36]), c = 2, d = pk([0.1, 0.125, 0.15]); pl = 2.5; pu = pk([29.9, 34.5, 39.9]);
L = r6(S * c * d); bott = Math.ceil(r6(L / pl) - 1e-9); cost = r6(bott * pu); bil = [50, 100, 200].find((b) => b > cost);
q = "On repeint les murs d'une chambre : " + X(S) + " m² à couvrir, en deux couches. Il faut " + X(d) + " L de peinture par m² et par couche. La peinture est vendue en pots de " + X(pl) + " L à " + X(pu) + " CHF le pot. On paie avec un billet de " + bil + " CHF.";
la = "a) Quantité de peinture nécessaire, en L"; lb = "b) Nombre de pots à acheter"; a1 = M(N(S) + " \\cdot 2 \\cdot " + N(d) + " = " + N(L)) + " L"; }
else if (cx === "gazon") { const S = pk([60, 75, 90, 120, 150]), d = pk([25, 30, 40]); pl = pk([1, 2.5]); pu = pl === 1 ? pk([12.9, 15.5, 18.9]) : pk([29.9, 34.5, 39.9]);
L = r6((S * d) / 1000); bott = Math.ceil(r6(L / pl) - 1e-9); cost = r6(bott * pu); bil = [20, 50, 100, 200].find((b) => b > cost);
q = "Pour semer une pelouse de " + X(S) + " m², il faut " + d + " g de graines par m². Les graines sont vendues en sacs de " + X(pl) + " kg à " + X(pu) + " CHF le sac. On paie avec un billet de " + bil + " CHF.";
la = "a) Masse de graines nécessaire, en kg"; lb = "b) Nombre de sacs à acheter"; a1 = M(N(S) + " \\cdot " + d + " = " + N(S * d)) + " g = " + X(L) + " kg"; }
else { const l = pk([0.75, 0.5, 0.4]) , n = pk([12, 18, 24]); pl = pk([1.8, 2.4, 3.6]); pu = pk([2.9, 3.45, 4.2]);
L = r6(l * n); bott = Math.ceil(r6(L / pl) - 1e-9); cost = r6(bott * pu); bil = [20, 50, 100].find((b) => b > cost);
q = "Pour un pique-nique de " + n + " personnes, on prévoit " + X(l) + " L de jus par personne. Le jus est vendu en bouteilles de " + X(pl) + " L à " + X(pu) + " CHF la bouteille. On paie avec un billet de " + bil + " CHF.";
la = "a) Quantité de jus nécessaire, en L"; lb = "b) Nombre de bouteilles à acheter"; a1 = M(n + " \\cdot " + N(l) + " = " + N(L)) + " L"; }
if (!Number.isInteger(r6(L / pl)) && bott >= 2) break;
}
return CX(cx, PB(q, [[la, L], [lb, bott], ["c) Monnaie rendue, en CHF", r6(bil - cost), 0.01]],
["b) On ne peut acheter qu'un nombre entier de " + (cx === "piquenique" ? "bouteilles" : cx === "peinture" ? "pots" : "sacs") + " : arrondis vers le haut.", "c) Prix total, puis soustrais du billet."],
"a) " + a1 + ". b) " + M(N(L) + " \\div " + N(pl) + " \\approx " + N(Math.round((L / pl) * 100) / 100)) + " : il en faut " + bott + ". c) " + M(bott + " \\cdot " + N(pu) + " = " + N(cost)) + " CHF ; " + M(bil + " - " + N(cost) + " = " + N(r6(bil - cost))) + " CHF."));
});
PX("multdiv", [9, 10], () => {

const cx = pk(["liste", "bus", "phares"]);
let a, b; do { a = pk([4, 6, 8, 9, 12]); b = pk([6, 10, 15, 14, 21]); } while (a === b || gcd(a, b) === 1 || gcd(a, b) === Math.min(a, b));
const L = (a * b) / gcd(a, b);
if (cx === "bus") { const H = pk([2, 3]), T = 60 * H, cA = Math.floor(T / a) + 1, cL = Math.floor(T / L) + 1, h0 = pk([6, 7]);
return CX(cx, PB("À " + h0 + " h 00, deux bus partent ensemble de la gare : la ligne A repart ensuite toutes les " + a + " minutes, la ligne B toutes les " + b + " minutes. On observe les départs de " + h0 + " h 00 à " + (h0 + H) + " h 00 (bornes comprises).",
[["a) Combien de départs de la ligne A pendant cette période ?", cA], ["b) Après combien de minutes les deux lignes repartent-elles ensemble pour la première fois ?", L], ["c) Combien de fois partent-elles ensemble pendant cette période (le départ de " + h0 + " h 00 compris) ?", cL]],
["Les départs de la ligne A ont lieu aux multiples de " + a + " minutes (0 compris).", "Départs communs : multiples communs de " + a + " et de " + b + " (pas forcément " + a * b + ")."],
"a) " + T + " min : multiples de " + a + " de 0 à " + T + " : " + M(Math.floor(T / a) + " + 1 = " + cA) + ". b) Plus petit multiple commun : " + L + " min (et non " + a * b + "). c) Multiples de " + L + " de 0 à " + T + " : " + M(Math.floor(T / L) + " + 1 = " + cL) + ".")); }
if (cx === "phares") { const T = pk([300, 360, 600]), cA = Math.floor(T / a), cL = Math.floor(T / L);
return CX(cx, PB("Deux phares viennent de s'allumer en même temps. Le premier envoie un éclair toutes les " + a + " secondes, le second toutes les " + b + " secondes. On compte les éclairs pendant les " + T + " secondes qui suivent (sans compter l'éclair du départ).",
[["a) Combien d'éclairs du premier phare ?", cA], ["b) Après combien de secondes les deux phares brillent-ils de nouveau ensemble ?", L], ["c) Combien de fois brillent-ils ensemble pendant ces " + T + " secondes ?", cL]],
["Les éclairs du premier phare ont lieu aux multiples de " + a + " secondes.", "Ensemble : aux multiples communs de " + a + " et de " + b + "."],
"a) " + M(T + " \\div " + a + (T % a ? " \\approx " : " = ") + N(Math.floor((T / a) * 100) / 100)) + " : " + cA + " éclairs. b) " + L + " s (et non " + a * b + "). c) Multiples de " + L + " jusqu'à " + T + " : " + cL + ".")); }
const lo = ri(1, 3) * 50, hi = lo + pk([200, 300]), cA = Math.floor(hi / a) - Math.floor((lo - 1) / a), cL = Math.floor(hi / L) - Math.floor((lo - 1) / L);
return CX(cx, PB("On considère les nombres entiers de " + lo + " à " + hi + " (bornes comprises).",
[["a) Combien sont des multiples de " + a + " ?", cA], ["b) Quel est le plus petit nombre non nul multiple à la fois de " + a + " et de " + b + " ?", L], ["c) Combien de nombres de la liste sont multiples à la fois de " + a + " et de " + b + " ?", cL]],
["Compte les multiples de " + a + " jusqu'à " + hi + ", puis enlève ceux qui sont avant " + lo + ".", "Multiple de " + a + " et de " + b + " : multiple de leur plus petit multiple commun (pas forcément " + a * b + ")."],
"a) Jusqu'à " + hi + " : " + Math.floor(hi / a) + " multiples ; avant " + lo + " : " + Math.floor((lo - 1) / a) + " ; donc " + cA + ". b) " + L + " (et non " + a * b + "). c) Multiples de " + L + " : " + Math.floor(hi / L) + " − " + Math.floor((lo - 1) / L) + " = " + cL + "."));
});
PX("relrep", [9, 10], () => {

const cx = pk(["droite", "ascenseur", "plongee"]);
if (cx === "ascenseur") { let a, b, c; do { a = -ri(1, 4); b = ri(3, 12); c = -ri(1, 4); } while (a === c || (a + b) % 2 !== 0 || [0, 1].includes((a + b) / 2));
return CX(cx, PB("Dans un immeuble, les sous-sols portent des numéros négatifs (−1, −2…) et le rez-de-chaussée le numéro 0. Léa prend l'ascenseur du niveau " + X(a) + " (parking) au niveau " + X(b) + ", puis redescend au niveau " + X(c) + " (cave).",
[["a) De combien d'étages monte-t-elle d'abord ?", b - a], ["b) Quel niveau est exactement à mi-chemin entre le parking et le niveau " + b + " ?", (a + b) / 2], ["c) De combien d'étages descend-elle ensuite ?", b - c]],
["Nombre d'étages entre deux niveaux : le plus haut moins le plus bas.", "b) Milieu : moyenne des deux niveaux."],
"a) " + M(b + " - (" + a + ") = " + (b - a)) + ". b) " + M("(" + a + " + " + b + ") \\div 2 = " + (a + b) / 2) + ". c) " + M(b + " - (" + c + ") = " + (b - c)) + ".")); }
if (cx === "plongee") { let a, b, c; do { a = -ri(6, 30); b = ri(4, 25); c = -ri(2, 18); } while (a === c || c - a < 2 || (a + b) % 2 !== 0 || [0, 1].includes((a + b) / 2));
return CX(cx, PB("Au bord d'un lac, une plongeuse est à l'altitude " + X(a) + " m par rapport à la surface, une truite nage à " + X(c) + " m et un goéland vole à " + X(b) + " m au-dessus de l'eau.",
[["a) Distance verticale entre la plongeuse et le goéland, en m", b - a], ["b) Altitude du point situé à mi-hauteur entre la plongeuse et le goéland, en m", (a + b) / 2], ["c) De combien de mètres la plongeuse doit-elle remonter pour être à la hauteur de la truite ?", c - a]],
["Distance : la plus grande altitude moins la plus petite.", "b) Milieu : moyenne des deux altitudes."],
"a) " + M(b + " - (" + a + ") = " + (b - a)) + " m. b) " + M("(" + a + " + " + b + ") \\div 2 = " + (a + b) / 2) + " m. c) " + M(c + " - (" + a + ") = " + (c - a)) + " m.")); }
let a, b, c; do { a = -ri(4, 12); b = ri(3, 11); c = -ri(2, 9); } while (a === c || Math.abs(a + b) < 3);
const m = r6((a + b) / 2), d = b - a;
return CX(cx, PB("Sur une droite graduée, le point " + M("A") + " a pour abscisse " + X(a) + ", le point " + M("B") + " a pour abscisse " + X(b) + " et le point " + M("C") + " a pour abscisse " + X(c) + ".",
[["a) Distance entre " + M("A") + " et " + M("B"), d], ["b) Abscisse du milieu de " + M("[AB]"), m], ["c) De combien d'unités faut-il déplacer " + M("C") + " vers la droite pour qu'il soit à la même distance de " + M("B") + " que " + M("A") + " l'est de " + M("B") + ", de l'autre côté de " + M("B") + " ?", b + d - c]],
["Distance entre deux points : la plus grande abscisse moins la plus petite.", "c) Le point cherché est à " + d + " unités à droite de B."],
"a) " + M(b + " - (" + a + ") = " + d) + ". b) " + M("(" + a + " + " + b + ") \\div 2 = " + N(m)) + ". c) Point cherché : " + M(b + " + " + d + " = " + (b + d)) + " ; déplacement : " + M((b + d) + " - (" + c + ") = " + (b + d - c)) + " unités."));
});

PX("quadri", [9, 10], () => {
const al = pk([32, 38, 44, 52, 58, 64]), b = (180 - 2 * al) / 2, kind = pk(["losange", "rectangle", "parallelogramme"]);
if (kind === "parallelogramme") { const A = pk([62, 68, 74, 108, 116, 124]), be = pk([20, 24, 28, 32, 36].filter((z) => z < A - 15));
return Object.assign(PB("Dans un parallélogramme " + M("ABCD") + ", l'angle " + M("\\widehat{BAD}") + " mesure " + A + "° et la diagonale [AC] fait avec le côté [AB] un angle " + M("\\widehat{BAC}") + " de " + be + "°.",
[["a) Angle " + M("\\widehat{ABC}") + " (en degrés)", 180 - A], ["b) Angle " + M("\\widehat{CAD}") + " (en degrés)", A - be], ["c) Angle " + M("\\widehat{ACD}") + " (en degrés)", be]],
["Deux angles consécutifs d'un parallélogramme sont supplémentaires (somme 180°).", "(AB) et (CD) sont parallèles : les angles BAC et ACD sont alternes-internes."],
"a) " + M("180° - " + A + "° = " + (180 - A) + "°") + ". b) " + M(A + "° - " + be + "° = " + (A - be) + "°") + ". c) Alternes-internes avec " + M("\\widehat{BAC}") + " : " + be + "°."), { ctx: kind }); }
return Object.assign(kind === "losange" ? PB("Dans un losange " + M("ABCD") + ", l'angle " + M("\\widehat{BAC}") + " (entre le côté et la diagonale) mesure " + al + "°. Les diagonales se coupent en " + M("O") + ".",
[["a) Angle " + M("\\widehat{BAD}") + " (en degrés)", 2 * al], ["b) Angle " + M("\\widehat{AOB}") + " (en degrés)", 90], ["c) Angle " + M("\\widehat{ABC}") + " (en degrés)", 180 - 2 * al]],
["Dans un losange, les diagonales sont les bissectrices des angles et elles sont perpendiculaires.", "Deux angles consécutifs d'un losange sont supplémentaires (somme 180°)."],
"a) La diagonale [AC] est bissectrice : " + M("2 \\cdot " + al + "° = " + 2 * al + "°") + ". b) Diagonales perpendiculaires : 90°. c) " + M("180° - " + 2 * al + "° = " + (180 - 2 * al) + "°") + ".")
: PB("Dans un rectangle " + M("ABCD") + ", les diagonales se coupent en " + M("O") + " et l'angle " + M("\\widehat{OAB}") + " mesure " + al + "°.",
[["a) Angle " + M("\\widehat{OBA}") + " (en degrés)", al], ["b) Angle " + M("\\widehat{AOB}") + " (en degrés)", 180 - 2 * al], ["c) Angle " + M("\\widehat{BOC}") + " (en degrés)", 2 * al]],
["Dans un rectangle, les diagonales ont la même longueur et se coupent en leur milieu : OA = OB.", "Les angles AOB et BOC sont adjacents et forment un angle plat."],
"a) OA = OB : le triangle AOB est isocèle, donc " + al + "°. b) " + M("180° - 2 \\cdot " + al + "° = " + (180 - 2 * al) + "°") + ". c) " + M("180° - " + (180 - 2 * al) + "° = " + 2 * al + "°") + "."), { ctx: kind });
});
PX("symetries", [9, 10], () => {

const cx = pk(["repere", "jeu", "parc"]);
let ax, ay, cx0, cy, tx, ty; do { ax = ri(-5, 5); ay = ri(-5, 5); cx0 = ri(-3, 3); cy = ri(-3, 3); tx = ri(-4, 4); ty = ri(-4, 4); } while ((ax === cx0 && ay === cy) || !tx || !ty || !ax || !ay);
const k = cx === "parc" ? pk([10, 20]) : 1, S = (v) => v * k, bx = 2 * cx0 - ax, by = 2 * cy - ay;
const P2 = (x, y) => pt(S(x), S(y));
const q = cx === "jeu" ? "Sur la carte d'un jeu vidéo (repère, une unité = une case), le héros est en " + M("A") + P2(ax, ay) + " et un portail en " + M("C") + P2(cx0, cy) + ". Le portail envoie le héros en " + M("B") + ", symétrique de " + M("A") + " par rapport à " + M("C") + ". Puis un tapis roulant le déplace comme la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + P2(tx, ty) + " : il arrive en " + M("D") + "."
: cx === "parc" ? "Sur le plan d'un parc (repère, unités en mètres), une statue est en " + M("A") + P2(ax, ay) + " et la fontaine en " + M("C") + P2(cx0, cy) + ". On place une deuxième statue en " + M("B") + ", symétrique de " + M("A") + " par rapport à " + M("C") + ", puis un banc en " + M("D") + ", image de " + M("B") + " par la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + P2(tx, ty) + "."
: "Dans un repère, " + M("A") + P2(ax, ay) + " et " + M("C") + P2(cx0, cy) + ". " + M("B") + " est l'image de " + M("A") + " par la symétrie de centre " + M("C") + ", puis " + M("D") + " est l'image de " + M("B") + " par la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + P2(tx, ty) + ".";
return CX(cx, PB(q,
[["a) Coordonnées de " + M("B") + PAIRL, [S(bx), S(by)]], ["b) Coordonnées de " + M("D") + PAIRL, [S(bx + tx), S(by + ty)]], ["c) Coordonnées de l'image de " + M("A") + " par la symétrie d'axe des ordonnées" + PAIRL, [-S(ax), S(ay)]]],
["C est le milieu de [AB] : pour passer de A à C, et de C à B, on fait le même déplacement.", "Translation : on ajoute " + S(tx) + " à l'abscisse et " + S(ty) + " à l'ordonnée."],
"a) De A à C : " + M("(" + S(cx0 - ax) + "\\,;\\," + S(cy - ay) + ")") + " ; on recommence depuis C : " + M("B") + P2(bx, by) + ". b) " + M("D") + P2(bx + tx, by + ty) + ". c) L'abscisse change de signe : " + pt(-S(ax), S(ay)) + "."));
});


PX("rac", [10, 11], () => {

const cx = pk(["cube", "terrain", "aquarium"]);
if (cx === "terrain") { const s = pk([18, 24, 25, 32, 35, 45]), k = pk([4, 9]), p = pk([12, 15, 25]);
return CX(cx, PB("Un terrain carré a une aire de " + X(s * s) + " m². On veut l'entourer d'une clôture à " + p + " CHF le mètre.",
[["a) Côté du terrain, en m", s], ["b) Prix de la clôture, en CHF", 4 * s * p], ["c) Côté d'un terrain carré " + k + " fois plus grand en aire, en m", Math.sqrt(k) * s]],
["Le côté est la racine carrée de l'aire : quel nombre multiplié par lui-même donne " + N(s * s) + " ?", "c) Aire " + k + " fois plus grande : le côté n'est pas multiplié par " + k + "."],
"a) " + M("\\sqrt{" + N(s * s) + "} = " + s) + " m. b) " + M("4 \\cdot " + s + " \\cdot " + p + " = " + N(4 * s * p)) + " CHF. c) " + M("\\sqrt{" + k + " \\cdot " + N(s * s) + "} = \\sqrt{" + N(k * s * s) + "} = " + Math.sqrt(k) * s) + " m.")); }
if (cx === "aquarium") { const s = pk([30, 40, 50, 60]), V = s ** 3;
return CX(cx, PB("Un aquarium cubique (sans couvercle) contient exactement " + X(V / 1000) + " litres quand il est plein.",
[["a) Arête de l'aquarium, en cm", s], ["b) Aire de verre utilisée (fond et quatre côtés), en cm²", 5 * s * s], ["c) Arête d'un aquarium cubique qui contient 8 fois plus d'eau, en cm", 2 * s]],
["1 L = 1'000 cm³ : convertis d'abord le volume en cm³, puis cherche le nombre qui, multiplié trois fois par lui-même, donne ce volume.", "c) Volume 8 fois plus grand : l'arête est multipliée par la racine cubique de 8."],
"a) " + M(N(V / 1000) + " \\text{ L} = " + N(V) + " \\text{ cm}^3 = " + s + "^3") + ", donc " + s + " cm. b) " + M("5 \\cdot " + s + "^2 = " + N(5 * s * s)) + " cm². c) " + M("\\sqrt[3]{8} = 2") + " : " + M("2 \\cdot " + s + " = " + 2 * s) + " cm.")); }
const s = pk([7, 9, 11, 12, 13, 15]), V = s ** 3, k = pk([4, 9, 16, 25]);
return CX(cx, PB("Un cube a un volume de " + X(V) + " cm³. Un carré a une aire égale à l'aire totale du cube.",
[["a) Arête du cube, en cm", s], ["b) Aire totale du cube, en cm²", 6 * s * s], ["c) Côté d'un carré dont l'aire est " + k + " fois celle d'une face du cube, en cm", Math.sqrt(k) * s]],
["L'arête est la racine cubique du volume : quel nombre multiplié trois fois par lui-même donne " + N(V) + " ?", "c) Aire du carré = " + k + " · " + s * s + " ; son côté est la racine carrée de cette aire."],
"a) " + M(s + "^3 = " + N(V)) + ", donc " + s + " cm. b) " + M("6 \\cdot " + s + "^2 = " + N(6 * s * s)) + " cm². c) " + M("\\sqrt{" + k + " \\cdot " + s * s + "} = \\sqrt{" + N(k * s * s) + "} = " + Math.sqrt(k) * s) + " cm."));
});
PX("disque", [10, 11], () => {

const cx = pk(["pizza", "arroseur", "horloge"]);
const R2 = (v) => Math.round(v * 100) / 100;
let r, a, u, q, la, lb, lc;
if (cx === "arroseur") { r = pk([4, 5, 6, 7.5, 8]); a = pk([90, 120, 150, 210, 270]); u = "m";
q = "Un arroseur de jardin tourne sur place et arrose un secteur de disque de rayon " + X(r) + " m et d'angle " + a + "°.";
la = "a) Longueur du bord courbe de la zone arrosée, en m (au centième)"; lb = "b) Périmètre de la zone arrosée, en m (au centième)"; lc = "c) Aire arrosée, en m² (au centième)"; }
else if (cx === "horloge") { r = pk([6, 8, 10, 12, 15]); const m = pk([10, 15, 20, 25, 40, 45]); a = 6 * m; u = "cm";
q = "L'aiguille des minutes d'une horloge mesure " + r + " cm. On observe son mouvement pendant " + m + " minutes.";
la = "a) Distance parcourue par la pointe de l'aiguille, en cm (au centième)"; lb = "b) Périmètre du secteur balayé (arc et deux rayons), en cm (au centième)"; lc = "c) Aire balayée par l'aiguille, en cm² (au centième)"; }
else { r = pk([3, 4, 5, 6, 8]); a = pk([60, 72, 120, 135, 150, 240]); u = "cm";
q = "Une part de pizza est un secteur de disque de rayon " + r + " cm et d'angle " + a + "°.";
la = "a) Longueur de l'arc de croûte, en cm (au centième)"; lb = "b) Périmètre total de la part, en cm (au centième)"; lc = "c) Aire de la part, en cm² (au centième)"; }
const L = (a / 360) * 2 * Math.PI * r, A = (a / 360) * Math.PI * r * r;
return CX(cx, PB(q, [[la, L, 0.01], [lb, L + 2 * r, 0.01], [lc, A, 0.01]],
[(cx === "horloge" ? "En 60 minutes, l'aiguille fait un tour complet (360°) : en " + a / 6 + " minutes, elle tourne de " + a + "°. " : "") + "Le secteur représente " + a + "/360 du disque entier.", "Le périmètre du secteur : l'arc et deux rayons."],
"Fraction du disque : " + M("\\frac{" + a + "}{360}") + ". a) " + M("\\frac{" + a + "}{360} \\cdot 2\\pi \\cdot " + N(r) + " \\approx " + N(R2(L))) + " " + u + ". b) " + M(N(R2(L)) + " + 2 \\cdot " + N(r) + " \\approx " + N(R2(L + 2 * r))) + " " + u + ". c) " + M("\\frac{" + a + "}{360} \\cdot \\pi \\cdot " + N(r) + "^2 \\approx " + N(R2(A))) + " " + u + "²."));
});

PX("polyreg", [10, 11], () => {
const n = pk([5, 6, 8, 9, 10, 12, 15]), S = (n - 2) * 180, ai = S / n, ae = 360 / n, cx = pk(["somme", "kiosque", "bassin"]);
if (cx === "kiosque") { const m = pk([5, 6, 8, 9, 10, 12]), S2 = (m - 2) * 180, ai2 = S2 / m, ae2 = 360 / m;
return Object.assign(PB("Le toit d'un kiosque à musique repose sur un plancher en forme de polygone régulier. Chaque angle intérieur du plancher mesure " + X(ai2) + "°.",
[["a) Mesure de l'angle au centre (en degrés)", ae2], ["b) Nombre de côtés du plancher", m], ["c) Somme des angles intérieurs (en degrés)", S2]],
["Angle intérieur et angle au centre sont supplémentaires : leur somme vaut 180°.", "Le tour complet (360°) est partagé en n angles au centre égaux."],
"a) " + M("180° - " + N(ai2) + "° = " + N(ae2) + "°") + ". b) " + M("360 \\div " + N(ae2) + " = " + m) + " côtés. c) " + M("(" + m + " - 2) \\cdot 180° = " + N(S2) + "°") + "."), { ctx: cx }); }
if (cx === "bassin") { const m = pk([5, 6, 8, 10, 12, 18, 20]), S2 = (m - 2) * 180;
return Object.assign(PB("Le bassin d'une fontaine a la forme d'un polygone régulier à " + m + " côtés. Depuis le jet d'eau, au centre, on tend une corde vers chaque sommet.",
[["a) Angle entre deux cordes voisines (angle au centre, en degrés)", 360 / m], ["b) Mesure d'un angle intérieur du bassin (en degrés)", S2 / m], ["c) Somme des angles intérieurs (en degrés)", S2]],
["Les cordes partagent le tour complet (360°) en " + m + " angles égaux.", "Chaque triangle formé est isocèle : angle intérieur = 180° − angle au centre."],
"a) " + M("360° \\div " + m + " = " + N(360 / m) + "°") + ". b) " + M("180° - " + N(360 / m) + "° = " + N(S2 / m) + "°") + ". c) " + M(m + " \\cdot " + N(S2 / m) + "° = " + N(S2) + "°") + " (ou " + M("(" + m + " - 2) \\cdot 180°") + ")."), { ctx: cx }); }
return Object.assign(PB("Un polygone régulier a des angles intérieurs dont la somme vaut " + X(S) + "°.",
[["a) Nombre de côtés", n], ["b) Mesure d'un angle intérieur (en degrés)", ai], ["c) Mesure de l'angle au centre (en degrés)", ae]],
["Somme des angles intérieurs d'un polygone à n côtés : (n − 2) · 180°.", "L'angle au centre partage le tour complet (360°) en n parts égales."],
"a) " + M("(n - 2) \\cdot 180 = " + N(S)) + ", donc " + M("n - 2 = " + (n - 2)) + " et " + M("n = " + n) + ". b) " + M(N(S) + " \\div " + n + " = " + N(ai) + "°") + ". c) " + M("360° \\div " + n + " = " + N(ae) + "°") + " (et " + M(N(ai) + "° + " + N(ae) + "° = 180°") + ")."), { ctx: cx });
});
PX("grandmanq", [10, 11], () => {

const cx = pk(["trapeze", "champ", "canal"]);
if (cx === "champ") { const b1 = 2 * ri(15, 30), b2 = b1 + 2 * ri(5, 20), h = ri(20, 45), A = ((b1 + b2) * h) / 2, w = pk([20, 25, 30, 40].filter((x) => A % x === 0)) || 10, p = pk([8, 12, 15]);
return CX(cx, PB("Un champ a la forme d'un trapèze dont les côtés parallèles mesurent " + b1 + " m et " + b2 + " m. Son aire vaut " + X(A) + " m².",
[["a) Distance entre les deux côtés parallèles (hauteur), en m", h], ["b) Longueur d'un champ rectangulaire de " + w + " m de large et de même aire, en m", A / w], ["c) Le semis coûte " + p + " CHF par are (1 are = 100 m²). Prix du semis, en CHF", (A / 100) * p]],
["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : isole la hauteur.", "c) Convertis l'aire en ares."],
"a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + b1 + " + " + b2 + ") = " + h) + " m. b) " + M(N(A) + " \\div " + w + " = " + N(A / w)) + " m. c) " + M(N(A) + " \\text{ m}^2 = " + N(A / 100) + " \\text{ a}") + " ; " + M(N(A / 100) + " \\cdot " + p + " = " + N((A / 100) * p)) + " CHF.")); }
if (cx === "canal") { const b1 = pk([1, 1.2, 1.5, 2]), b2 = r6(b1 + pk([0.8, 1, 1.2, 1.6])), h = pk([0.5, 0.6, 0.8, 0.9]), A = r6(((b1 + b2) * h) / 2), Lc = pk([50, 120, 250]);
return CX(cx, PB("La section d'un canal d'irrigation est un trapèze : largeur " + X(b1) + " m au fond, " + X(b2) + " m en haut. L'aire de cette section vaut " + X(A) + " m² quand le canal est plein.",
[["a) Profondeur du canal, en m", h], ["b) Volume d'eau dans " + Lc + " m de canal plein, en m³", r6(A * Lc)], ["c) Volume d'eau dans " + Lc + " m de canal plein, en litres", r6(A * Lc * 1000)]],
["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : ici, la hauteur est la profondeur.", "b) Le canal est un prisme : volume = aire de la section · longueur."],
"a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + N(b1) + " + " + N(b2) + ") = " + N(h)) + " m. b) " + M(N(A) + " \\cdot " + Lc + " = " + N(r6(A * Lc))) + " m³. c) " + X(r6(A * Lc * 1000)) + " L.")); }
const b1 = pk([6, 8, 10]), b2 = pk([12, 14, 16]), h = pk([5, 6, 7, 9]), A = ((b1 + b2) * h) / 2, w = pk([3, 4, 5, 6, 8].filter((x) => A % x === 0 && A / x !== x)) || 2;
return CX(cx, PB("Un trapèze a des bases de " + b1 + " cm et " + b2 + " cm. Son aire vaut " + X(A) + " cm². Un rectangle de largeur " + w + " cm a la même aire.",
[["a) Hauteur du trapèze, en cm", h], ["b) Longueur du rectangle, en cm", A / w], ["c) Côté d'un triangle rectangle isocèle de même aire (côtés de l'angle droit), en cm (au centième)", Math.sqrt(2 * A), 0.01]],
["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : isole la hauteur.", "c) Triangle rectangle isocèle de côté c : aire = c · c ÷ 2."],
"a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + b1 + " + " + b2 + ") = " + h) + " cm. b) " + M(N(A) + " \\div " + w + " = " + N(A / w)) + " cm. c) " + M("c^2 = 2 \\cdot " + N(A) + " = " + N(2 * A)) + ", " + M("c = \\sqrt{" + N(2 * A) + "} \\approx " + N(Math.round(Math.sqrt(2 * A) * 100) / 100)) + " cm."));
});
PX("airelat", [10, 11], () => {
const [cx, txt, ds, hs] = pk([["conserve", "Une boîte de conserve cylindrique a un diamètre de # cm et une hauteur de @ cm. L'étiquette recouvre toute la surface latérale.", [6, 8, 10, 12], [9, 11, 14, 15]],
["tube", "Un tube d'affiche en carton (un cylindre) a un diamètre de # cm et une longueur de @ cm. On le recouvre entièrement de papier cadeau sur sa surface latérale.", [6, 8, 10], [60, 70, 80, 100]],
["bidon", "Un bidon cylindrique a un diamètre de # cm et une hauteur de @ cm. On peint toute sa surface latérale.", [20, 24, 30], [30, 35, 40, 45]]]);
const d = pk(ds), h = pk(hs), r = d / 2, AL = 2 * Math.PI * r * h, AT = AL + 2 * Math.PI * r * r, lab = cx === "conserve" ? "de l'étiquette" : cx === "tube" ? "du papier" : "peinte";
return Object.assign(PB(txt.replace("#", d).replace("@", h),
[["a) Aire " + lab + ", en cm² (au centième)", AL, 0.01], ["b) Aire totale (surface latérale et les deux disques), en cm² (au centième)", AT, 0.01], ["c) Déroulée, la surface latérale est un rectangle : sa longueur, en cm (au centième)", Math.PI * d, 0.01]],
["Déroulée, la surface latérale est un rectangle : sa longueur est le périmètre du disque, sa largeur la hauteur.", "Aire d'un disque : π · r² ; attention, r = " + r + " cm."],
"c) Longueur : " + M("\\pi \\cdot " + d + " \\approx " + N(Math.round(Math.PI * d * 100) / 100)) + " cm. a) " + M("\\pi \\cdot " + d + " \\cdot " + h + " \\approx " + N(Math.round(AL * 100) / 100)) + " cm². b) " + M(N(Math.round(AL * 100) / 100) + " + 2 \\cdot \\pi \\cdot " + r + "^2 \\approx " + N(Math.round(AT * 100) / 100)) + " cm²."), { ctx: cx });
});
PX("voldecomp", [10, 11], () => {

const cx = pk(["piscine", "escalier", "platebande"]);
if (cx === "escalier") { const n = pk([3, 4, 5]), w = pk([1, 1.2, 1.5]), h = pk([0.15, 0.18, 0.2]), V = r6(w * 0.3 * h * ((n * (n + 1)) / 2)), m = r6(V * 2400), s = Math.ceil(m / 40 - 1e-9);
return CX(cx, PB("Un escalier extérieur en béton plein a " + n + " marches. Vu de côté, il est formé de colonnes de blocs : 1 bloc devant, puis 2, puis 3, … jusqu'à " + n + " au fond. Chaque bloc est un pavé de " + X(w) + " m de large, 30 cm de profondeur et " + X(h * 100) + " cm de haut.",
[["a) Volume de béton, en m³", V], ["b) Masse de l'escalier, en kg (1 m³ de béton pèse 2'400 kg)", m], ["c) Combien de sacs de béton de 40 kg faut-il au minimum ?", s]],
["Compte d'abord les blocs : 1 + 2 + … + " + n + ".", "Chaque bloc mesure " + N(w) + " m · 0,3 m · " + N(h) + " m."],
"a) Blocs : " + M(Array.from({ length: n }, (_, i) => i + 1).join(" + ") + " = " + (n * (n + 1)) / 2) + " ; " + M((n * (n + 1)) / 2 + " \\cdot " + N(w) + " \\cdot 0{,}3 \\cdot " + N(h) + " = " + N(V)) + " m³. b) " + M(N(V) + " \\cdot 2\\text{'}400 = " + N(m)) + " kg. c) " + M(N(m) + " \\div 40 \\approx " + N(Math.floor((m / 40) * 100) / 100)) + " : " + s + " sacs.")); }
if (cx === "platebande") { const a = pk([3, 4, 5]), b = pk([0.8, 1, 1.2]), c = pk([2, 2.5, 3]), h = pk([0.3, 0.4, 0.5]), V = r6((a * b + (c - b) * b) * h), sac = pk([40, 50]), ns = Math.ceil((V * 1000) / sac - 1e-9);
return CX(cx, PB("Une plate-bande surélevée en forme de L est formée de deux bacs pavés accolés, de " + X(h) + " m de haut : l'un de " + X(a) + " m sur " + X(b) + " m, l'autre de " + X(r6(c - b)) + " m sur " + X(b) + " m. On la remplit de terre, vendue en sacs de " + sac + " L.",
[["a) Volume de terre, en m³", V], ["b) Ce volume, en litres", r6(V * 1000)], ["c) Combien de sacs faut-il au minimum ?", ns]],
["Calcule le volume de chaque bac, puis additionne.", "1 m³ = 1'000 L ; un sac entamé compte."],
"a) " + M(N(a) + " \\cdot " + N(b) + " \\cdot " + N(h) + " + " + N(r6(c - b)) + " \\cdot " + N(b) + " \\cdot " + N(h) + " = " + N(V)) + " m³. b) " + X(r6(V * 1000)) + " L. c) " + M(N(r6(V * 1000)) + " \\div " + sac + " \\approx " + N(Math.floor(((V * 1000) / sac) * 100) / 100)) + " : " + ns + " sacs.")); }
const L = pk([8, 10, 12]), l = pk([4, 5, 6]), h1 = pk([1.2, 1.5, 1.8]), h2 = pk([2.2, 2.5, 3]), V = r6(L * l * h1 + (L / 2) * l * (h2 - h1)), t = pk([20, 25, 40]);
return CX(cx, PB("Une piscine a la forme d'un pavé de " + L + " m sur " + l + " m. Sur la moitié de sa longueur, la profondeur est de " + X(h1) + " m ; sur l'autre moitié, elle est de " + X(h2) + " m (deux pavés accolés).",
[["a) Volume d'eau quand elle est pleine, en m³", V], ["b) Ce volume en litres", V * 1000], ["c) On la remplit avec un débit de " + t + " m³ par heure : durée en heures (au dixième)", Math.round(+((V / t) * 10).toPrecision(12)) / 10, 0.1] ],
["Découpe en deux pavés : chacun mesure " + L / 2 + " m sur " + l + " m.", "1 m³ = 1'000 L."],
"a) " + M(N(L / 2) + " \\cdot " + l + " \\cdot " + N(h1) + " + " + N(L / 2) + " \\cdot " + l + " \\cdot " + N(h2) + " = " + N(r6((L / 2) * l * h1)) + " + " + N(r6((L / 2) * l * h2)) + " = " + N(r6((L / 2) * l * (h1 + h2)))) + " m³. b) " + X(r6((L / 2) * l * (h1 + h2) * 1000)) + " L. c) " + M(N(r6((L / 2) * l * (h1 + h2))) + " \\div " + t + " \\approx " + N(Math.round(((L / 2) * l * (h1 + h2) / t) * 10) / 10)) + " h."));
});
PX("eqverif", [10, 11], () => {

const cx = pk(["equation", "rectangle", "pense"]);
const shuf = (L) => L.map((v) => [R.rand(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
if (cx === "rectangle") { let r, d, c; do { r = ri(3, 9); d = ri(2, 7); c = shuf([r, -(r + d), r + 1, d, r + d]); } while (new Set(c).size < 5);
const A = r * (r + d), ok = c.filter((x) => x * (x + d) === A);
return CX(cx, PB("Un rectangle a une largeur de " + M("x") + " cm et une longueur de " + M("x + " + d) + " cm. Son aire vaut " + X(A) + " cm². On propose pour " + M("x") + " les nombres " + c.map(X).join(" ; ") + ".",
[["a) Combien de ces nombres sont solutions de l'équation " + M("x(x + " + d + ") = " + A) + " ?", ok.length], ["b) Lequel de ces nombres est la largeur du rectangle, en cm ?", r], ["c) Périmètre du rectangle, en cm", 2 * (2 * r + d)]],
["Remplace x par chaque nombre dans x(x + " + d + ") et compare à " + A + ".", "b) Une largeur est positive : parmi les solutions, garde celle qui a un sens."],
c.map((x) => M("x = " + x) + " : " + M(N(x * (x + d)) + (x * (x + d) === A ? " = " : " \\neq ") + A)).join(" ; ") + ". a) " + ok.length + ". b) " + r + " cm (l'autre solution est négative). c) " + M("2 \\cdot (" + r + " + " + (r + d) + ") = " + 2 * (2 * r + d)) + " cm.")); }
if (cx === "pense") { let a, b, c; do { a = ri(4, 9); b = ri(2, a - 1); c = shuf([a, b, -a, a - b, -b]); } while (new Set(c).size < 5 || a - b < 2);
const s = a - b, p = a * b, ok = c.filter((x) => x * x - p === s * x), z = pk([s + 1, s + 2, s + 3, s + 4, s + 5].filter((t) => t !== a)), k = z * z - s * z, nm = pk(["Lina", "Mia", "Zoé", "Nora"]);
return CX(cx, PB(nm + " pense à un nombre entier. Le carré de ce nombre, diminué de " + p + ", est égal à " + s + " fois ce nombre. Elle propose à son frère les nombres " + c.map(X).join(" ; ") + ".",
[["a) Combien de ces nombres vérifient " + M("x^2 - " + p + " = " + s + "x") + " ?", ok.length], ["b) " + nm + " précise que son nombre est positif. Lequel est-ce ?", a], ["c) Pour quelle valeur de " + M("k") + " le nombre " + z + " vérifie-t-il " + M("x^2 - k = " + s + "x") + " ?", k]],
["Remplace x par chaque nombre : calcule le membre de gauche, puis celui de droite, et compare.", "c) Remplace x par " + z + " : il reste une équation en k."],
c.map((x) => M("x = " + x) + " : " + M(N(x * x - p) + (x * x - p === s * x ? " = " : " \\neq ") + N(s * x))).join(" ; ") + ". a) " + ok.length + ". b) " + a + ". c) " + M(z + "^2 - k = " + s + " \\cdot " + z) + ", donc " + M("k = " + z * z + " - " + s * z + " = " + k) + ".")); }
let a, b; do { a = ri(2, 9); b = ri(2, 9); } while (a === b);
const s = a + b, p = a * b, cands = [a, b, s, -a, p > 30 ? b + 1 : p].sort(() => R.rand() - 0.5), ok = cands.filter((x) => x * x + p === s * x);
const c = ri(2, 5);
return CX(cx, PB("On considère l'équation " + M("x^2 + " + p + " = " + s + "x") + " et les nombres " + cands.map(X).join(" ; ") + ".",
[["a) Combien de ces nombres sont solutions ?", ok.length], ["b) La somme des solutions trouvées", ok.reduce((t, x) => t + x, 0)], ["c) Pour quelle valeur de " + M("k") + " le nombre " + c + " est-il solution de " + M("x^2 + k = " + s + "x") + " ?", s * c - c * c]],
["Remplace x par chaque nombre, calcule les deux membres séparément, et compare.", "c) Remplace x par " + c + " : il reste une équation en k."],
cands.map((x) => M("x = " + x) + " : " + M(N(x * x + p) + (x * x + p === s * x ? " = " : " \\neq ") + N(s * x))).join(" ; ") + ". a) " + ok.length + ". b) " + ok.reduce((t, x) => t + x, 0) + ". c) " + M(c + "^2 + k = " + s + " \\cdot " + c) + ", donc " + M("k = " + s * c + " - " + c * c + " = " + (s * c - c * c)) + "."));
});
PX("pente", [10, 11], () => {

const cx = pk(["route", "rampe", "funiculaire"]);
if (cx === "rampe") { const h = pk([12, 15, 18, 24, 30]), Lr = pk([1.5, 2, 2.5, 4].filter((x) => h / x !== 6)), L2 = pk([3, 4.5, 6]);
return CX(cx, PB("Pour qu'une personne en fauteuil roulant puisse l'utiliser seule, une rampe d'accès doit avoir une pente de 6 % au plus. Il faut franchir une marche de " + h + " cm.",
[["a) Longueur horizontale minimale de la rampe, en m", h / 6], ["b) Avec une rampe de " + X(Lr) + " m de longueur horizontale, quelle serait la pente, en % ?", h / Lr], ["c) Avec une pente de 6 %, quel dénivelé (en cm) franchit-on sur " + X(L2) + " m de longueur horizontale ?", r6(6 * L2)]],
["Pente en % = dénivelé ÷ longueur horizontale · 100 (mêmes unités).", "a) Isole la longueur horizontale : " + h + " cm ÷ 0,06."],
"a) " + M(h + " \\div 0{,}06 = " + N(r6(h / 0.06))) + " cm = " + X(h / 6) + " m. b) " + M(h + " \\div " + N(Lr * 100) + " \\cdot 100 = " + N(h / Lr)) + " %. c) " + M("0{,}06 \\cdot " + N(L2 * 100) + " = " + N(r6(6 * L2))) + " cm.")); }
if (cx === "funiculaire") { const p = pk([30, 40, 45, 50, 60]), d = pk([400, 500, 800, 1200]), q = pk([35, 55, 62, 70].filter((x) => x !== p)), d2 = pk([200, 300, 500]), D = (q * d2) / 100;
return CX(cx, PB("Un funiculaire monte avec une pente moyenne de " + p + " % sur une distance horizontale de " + X(d) + " m. Plus haut, un deuxième tronçon s'élève de " + X(D) + " m sur " + X(d2) + " m de distance horizontale.",
[["a) Dénivelé du premier tronçon, en m", (p * d) / 100], ["b) Distance horizontale nécessaire pour monter de 100 m avec la pente du premier tronçon, en m (au dixième)", 10000 / p, 0.1], ["c) Pente du deuxième tronçon, en %", q]],
["Pente en % = dénivelé ÷ distance horizontale · 100.", "b) Distance horizontale = dénivelé ÷ pente · 100."],
"a) " + M(N(p / 100) + " \\cdot " + N(d) + " = " + N((p * d) / 100)) + " m. b) " + M("100 \\div " + N(p / 100) + " \\approx " + N(Math.round((10000 / p) * 10) / 10)) + " m. c) " + M(N(D) + " \\div " + N(d2) + " \\cdot 100 = " + q) + " %.")); }
const p = pk([8, 12, 15, 18, 24]), d = pk([250, 400, 600, 750]), dh = r6((p / 100) * d), t = pk([10, 12, 15]);
return CX(cx, PB("Une route de montagne a une pente constante de " + p + " %. Elle franchit une distance horizontale de " + X(d) + " m. Un panneau prévient : « dénivelé de " + t + " % sur la descente suivante ».",
[["a) Dénivelé de cette route, en m", dh], ["b) Distance horizontale pour monter de 100 m avec cette pente, en m (au dixième)", 10000 / p, 0.1], ["c) Sur la descente à " + t + " %, quelle distance horizontale pour descendre de " + X(dh) + " m ?", r6((dh * 100) / t), 0.1]],
["Pente en % = dénivelé ÷ distance horizontale · 100.", "b) et c) Isole la distance horizontale : dénivelé ÷ pente · 100."],
"a) " + M(N(p / 100) + " \\cdot " + N(d) + " = " + N(dh)) + " m. b) " + M("100 \\div " + N(p / 100) + " \\approx " + N(Math.round((10000 / p) * 10) / 10)) + " m. c) " + M(N(dh) + " \\div " + N(t / 100) + " = " + N(r6((dh * 100) / t))) + " m."));
});
PX("rotation", [10, 11], () => {

const cx = pk(["repere", "robot", "dessin"]);
let x, y, cx0, cy; do { x = ri(-5, 5); y = ri(-5, 5); cx0 = ri(-2, 2); cy = ri(-2, 2); } while (!x || !y || (x === cx0 && y === cy) || Math.abs(x) === Math.abs(y));
const k = cx === "dessin" ? pk([10, 20, 50]) : 1, S = (v) => v * k, P2 = (a, b) => pt(S(a), S(b));
const r90 = [-y, x], r180 = [-x, -y], u = x - cx0, v = y - cy, rc = [cx0 - v, cy + u];
const q = cx === "robot" ? "Un robot aspirateur est posé sur un sol quadrillé, repéré par un repère (unité : une dalle). Il se trouve en " + M("A") + P2(x, y) + ". Le bras de la station de charge le fait tourner dans le sens inverse des aiguilles d'une montre."
: cx === "dessin" ? "Dans un logiciel de dessin, l'écran est repéré en pixels, l'origine " + M("O") + " au centre. Un sommet d'une figure est en " + M("A") + P2(x, y) + ". L'outil « rotation » tourne dans le sens inverse des aiguilles d'une montre."
: "Dans un repère, on considère le point " + M("A") + P2(x, y) + ". Les rotations tournent dans le sens inverse des aiguilles d'une montre.";
return CX(cx, PB(q,
[["a) Image de " + M("A") + " par la rotation de centre " + M("O(0\\,;\\,0)") + " et d'angle 90°" + PAIRL, [S(r90[0]), S(r90[1])]], ["b) Image de " + M("A") + " par la rotation de centre " + M("O") + " et d'angle 180°" + PAIRL, [S(r180[0]), S(r180[1])]], ["c) Image de " + M("A") + " par la rotation de centre " + M("C") + P2(cx0, cy) + " et d'angle 90°" + PAIRL, [S(rc[0]), S(rc[1])]]],
["Rotation de 90° autour de l'origine : (x ; y) devient (−y ; x). Fais un dessin pour vérifier.", "c) Travaille avec le déplacement de C vers A, fais-le tourner de 90°, puis repars de C."],
"a) " + P2(r90[0], r90[1]) + ". b) " + P2(r180[0], r180[1]) + " (symétrie de centre O). c) De C à A : " + M("(" + S(u) + "\\,;\\," + S(v) + ")") + " ; tourné de 90° : " + M("(" + S(-v) + "\\,;\\," + S(u) + ")") + " ; image : " + P2(rc[0], rc[1]) + "."));
});
})();















const PRIM_IDS = ["p8tables", "p8calcadd", "p8dizaines", "p8diveucl", "p8droite", "p8fracpart", "p8conv", "p8probop"];


const PRIM_PRE = {
multdiv: ["p8tables", "p8diveucl"], divcrit: ["p8diveucl", "p8tables"], premiers: ["p8tables"], arith: ["p8tables", "p8diveucl"],
fracsimp: ["p8tables"], fracrep: ["p8droite", "p8fracpart"], fracconv: ["p8fracpart", "p8dizaines"], fractout: ["p8fracpart", "p8tables"],
fracadd: ["p8fracpart", "p8tables"], fracper: ["p8diveucl"], decread: ["p8dizaines", "p8droite"], deccomp: ["p8droite"], decarr: ["p8droite"],
ordgr: ["p8dizaines", "p8calcadd"], decadd: ["p8calcadd"], dec10: ["p8dizaines"], decmul: ["p8tables", "p8dizaines"], decdiv: ["p8diveucl", "p8dizaines"],
decprob: ["p8probop", "p8calcadd"], tradexpr: ["p8probop"], prio: ["p8tables", "p8calcadd"], pow9: ["p8tables"], relrep: ["p8droite"], reladd: ["p8calcadd"],
ulong: ["p8conv", "p8dizaines"], uaire: ["p8dizaines", "p8conv"], uvol: ["p8conv"], utemps: ["p8conv", "p8diveucl"], perim: ["p8calcadd", "p8conv"],
aire1: ["p8tables"], aire2: ["p8tables"], aire3: ["p8tables", "p8calcadd"], volpave: ["p8tables"], proptab: ["p8tables", "p8probop"], prop: ["p8probop", "p8tables"],
change: ["p8probop"], agrand: ["p8tables"], litelab: ["p8probop"], valnum: ["p8tables"], diagr: ["p8calcadd", "p8diveucl"], angtri: ["p8calcadd"], angtype: ["p8calcadd"],
};

(function () {
if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
const ri = R.int, rp = R.pick;
const T = (v) => nb(v);
const C = (v) => M(chf(v)) + " CHF";
const cd = (a, b) => a + " \\cdot " + b;
const u = (s) => "\\ \\text{" + s + "}";

const S = (v) => { const [i, f] = String(+(+v).toFixed(6)).split("."); return (Math.abs(+i) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : i) + (f ? "," + f : ""); };
const P12 = (v) => +(+v).toPrecision(12);
const Q = (q, v, sol, guide, traps, o) => QV(q, P12(v), sol, Object.assign({ guide, traps: traps || [] }, o || {}));
const G = (ask, v, sol) => GS(ask, P12(v), sol);
const X = (v, m) => TRAP(P12(v), m);



const droite = (n, labs, k) => {
const X0 = 38, X1 = 282, x = (i) => X0 + ((X1 - X0) * i) / n;
let g = TRX.ln(X0 - 10, 40, X1 + 12, 40, "f-line", ' stroke-width="1.6"');
for (let i = 0; i <= n; i++) g += TRX.ln(x(i), 33, x(i), 47, "f-line", ' stroke-width="' + (labs.some((l) => l[0] === i) ? 2 : 1.1) + '"');
for (const [i, t] of labs) g += TRX.ln(x(i), 29, x(i), 51, "f-line", ' stroke-width="2"') + TRX.tx(x(i), 70, t, "middle", 13);
g += '<circle cx="' + x(k).toFixed(1) + '" cy="40" r="5" class="f-dot"/>' + TRX.tx(x(k), 22, "A", "middle", 14, "f-txt f-accent");
return TRX.sv(320, 78, g, "droite graduée avec un point A");
};
const droiteQ = (ctx, n, labs, k, value, step, frac) => {
const [i1, t1] = labs[0], v1 = value - (k - i1) * step, num = Math.round(value * (frac || 1)), g0 = frac ? gcd(num, frac) : 1;
const st = frac ? "\\frac{1}{" + frac + "}" : T(step), fv = frac ? "\\frac{" + num + "}{" + frac + "}" + (g0 > 1 ? " = " + (frac / g0 === 1 ? num / g0 : "\\frac{" + num / g0 + "}{" + frac / g0 + "}") : "") : "";
return Q("Quel nombre correspond au point A sur cette droite graduée ?" + (frac ? " Réponds par une fraction." : ""), value,
"Une graduation vaut " + M(st) + " ; A est à " + Math.abs(k - i1) + " graduation" + (Math.abs(k - i1) > 1 ? "s" : "") + (k > i1 ? " à droite" : " à gauche") + " de " + M(T(v1)) + ", donc " + M("A = " + (frac ? fv : T(value))) + ".",
[G("Combien vaut l'écart entre deux graduations voisines ?" + (frac ? " (fraction)" : ""), step, M(st) + "."),
G("À combien de graduations de " + t1 + " se trouve le point A ?", Math.abs(k - i1), Math.abs(k - i1) + "."),
G("Quel nombre correspond au point A ?", value, M(frac ? fv : T(value)) + ".")],
[X(v1 + (k - i1), "Une graduation ne vaut pas 1 ici : calcule l'écart entre deux graduations voisines."), X(value + step, "Compte les intervalles (les espaces entre les traits), pas les traits."), X(value - step, "Compte les intervalles (les espaces entre les traits), pas les traits.")],
{ fig: droite(n, labs, k), ctx: "p8dr-" + ctx });
};

const DEFS = [
{ id: "p8tables", theme: "no", label: "Tables de multiplication et produits à trous", ex: "7 \\cdot 8 = 56",
hint: "Si un produit ne revient pas, pars d'un produit connu : 7 · 8 = 7 · 10 − 7 · 2 = 70 − 14 = 56.",
lesson: ["Tables de multiplication", "Les produits des tables de 2 à 9 servent partout : fractions, aires, divisions.", "Un produit oublié se reconstruit à partir d'un produit connu : \\(7 \\cdot 8 = 7 \\cdot 10 - 7 \\cdot 2 = 70 - 14 = 56\\). Pour un produit à trou \\(6 \\cdot ? = 54\\), on divise : \\(54 : 6 = 9\\). Pour \\(14 \\cdot 6\\), on décompose : \\(10 \\cdot 6 + 4 \\cdot 6 = 60 + 24 = 84\\).",
["\\(6 \\cdot 9 = 54\\)", "\\(8 \\cdot ? = 56\\) : \\(56 : 8 = 7\\)", "\\(14 \\cdot 6 = 60 + 24 = 84\\)"], "\\(7 \\cdot 8\\) et \\(8 \\cdot 7\\) donnent le même résultat : un seul des deux à retenir."],
lv: {
1: [
() => { const a = ri(6, 9), b = ri(6, 9); return Q("Calcule : " + M(cd(a, b)), a * b, M(cd(a, 10) + " - " + cd(a, 10 - b) + " = " + a * 10 + " - " + a * (10 - b) + " = " + a * b) + ".",
[G("Un produit voisin facile : " + M(cd(a, 10)) + " = ?", a * 10, M(a * 10) + "."), G("On a pris " + (10 - b) + " fois " + a + " de trop : " + M(a * 10 + " - " + a * (10 - b)) + " = ?", a * b, M(a * b) + ".")],
[X(a * b + a, "Une fois " + a + " de trop : " + M(cd(a, b + 1)) + "."), X(a * b - a, "Une fois " + a + " de moins : " + M(cd(a, b - 1)) + "."), X(a + b, "C'est un produit, pas une somme.")]); },
() => { const a = ri(6, 9), b = ri(3, 9); if (a === b) return null; const p = a * b; return Q("Complète : " + M(cd(a, "?") + " = " + p), b, M(p + " : " + a + " = " + b) + ", car " + M(cd(a, b) + " = " + p) + ".",
[G("Dans la table de " + a + ", quel nombre donne " + p + " ? Calcule " + M(p + " : " + a) + ".", b, M(b) + ".")],
[X(p - a, "On cherche un facteur : " + M(p + " : " + a) + ", pas " + M(p + " - " + a) + "."), X(b + 1, "Vérifie : " + M(cd(a, b + 1) + " = " + a * (b + 1)) + "."), X(b - 1, "Vérifie : " + M(cd(a, b - 1) + " = " + a * (b - 1)) + ".")]); },
() => { const a = ri(4, 9), b = ri(6, 9); if (a === b) return null; const p = a * b; return Q("Calcule : " + M(p + " : " + a), b, M(p + " : " + a + " = " + b) + ", car " + M(cd(a, b) + " = " + p) + ".",
[G("Quel nombre multiplié par " + a + " donne " + p + " ?", b, M(cd(a, b) + " = " + p) + ".")],
[X(p - a, "Diviser n'est pas soustraire."), X(b + 1, "Vérifie : " + M(cd(a, b + 1) + " = " + a * (b + 1)) + ".")]); },
],
2: [
() => { const a = ri(12, 19), b = ri(3, 9); return Q("Calcule : " + M(cd(a, b)), a * b, M(cd(a, b) + " = " + cd(10, b) + " + " + cd(a - 10, b) + " = " + 10 * b + " + " + (a - 10) * b + " = " + a * b) + ".",
[G(M(cd(10, b)) + " = ?", 10 * b, M(10 * b) + "."), G(M(cd(a - 10, b)) + " = ?", (a - 10) * b, M((a - 10) * b) + "."), G("Additionne les deux résultats.", a * b, M(10 * b + " + " + (a - 10) * b + " = " + a * b) + ".")],
[X(10 * b + (a - 10), "Les unités aussi se multiplient : " + M(cd(a - 10, b)) + "."), X(a * b - b, "Compte " + a + " fois " + b + ", pas " + (a - 1) + " fois.")]); },
() => { const n = 2 * ri(6, 49), k = rp([5, 50]); if (n % 10 === 0) return null; return Q("Calcule de tête : " + M(cd(n, k)), n * k, "Multiplier par " + k + ", c'est multiplier par " + 2 * k + ", puis diviser par 2 : " + M(cd(n, 2 * k) + " = " + T(n * 2 * k)) + " et " + M(T(n * 2 * k) + " : 2 = " + T(n * k)) + ".",
[G(M(cd(n, 2 * k)) + " = ?", n * 2 * k, M(T(n * 2 * k)) + "."), G("La moitié de " + S(n * 2 * k) + " ?", n * k, M(T(n * k)) + ".")],
[X(n * k * 10, "Un zéro de trop : " + M(cd(n, k)) + " est la moitié de " + M(cd(n, 2 * k)) + "."), X(n * k / 10, "Il manque un zéro : " + M(cd(n, k)) + " est la moitié de " + M(cd(n, 2 * k)) + ".")]); },
() => { const c = rp([["foot", "Pour un tournoi de foot, ", " joueurs forment des équipes de ", ". Combien d'équipes y a-t-il ?", [5, 6, 7, 8]], ["album", "Un photographe colle ", " photos dans un album, ", " par page. Combien de pages remplit-il ?", [4, 6, 8, 9]], ["playlist", "Une playlist de ", " minutes contient des morceaux de ", " minutes chacun. Combien de morceaux contient-elle ?", [3, 4]]]);
const b = rp(c[4]), t = ri(11, 19), N = b * t; return Q(c[1] + N + c[2] + b + c[3], t, M(N + " : " + b + " = " + t) + ".",
[G("Calcule " + M(N + " : " + b) + " (tu peux essayer " + M(cd(b, 10)) + ", puis compléter).", t, M(cd(b, t) + " = " + N) + ".")],
[X(N - b, "On partage en groupes de " + b + " : c'est une division."), X(N * b, "On partage : le résultat est plus petit que " + N + ".")], { ctx: "p8tab-" + c[0] }); },
],
3: [
() => { const a = ri(12, 29), b = ri(11, 19); if (a % 10 === 0 || a === b) return null; return Q("Calcule : " + M(cd(a, b)), a * b, M(cd(a, b) + " = " + cd(a, 10) + " + " + cd(a, b - 10) + " = " + a * 10 + " + " + a * (b - 10) + " = " + a * b) + ".",
[G(M(cd(a, 10)) + " = ?", a * 10, M(a * 10) + "."), G(M(cd(a, b - 10)) + " = ?", a * (b - 10), M(a * (b - 10)) + "."), G("Additionne les deux résultats.", a * b, M(a * b) + ".")],
[X(a * 10 + (b - 10), "Multiplie " + a + " par " + (b - 10) + ", ne l'ajoute pas."), X(a * 10 + a * (b - 10) - a, "Recompte : " + M(cd(a, b - 10)) + ".")]); },
() => { const a = ri(7, 39); if (a % 10 === 0) return null; const [p, q] = rp([[25, 4], [5, 2], [50, 2], [4, 25], [2, 50]]), pq = p * q;
return Q("Calcule astucieusement : " + M(cd(cd(p, a), q)), pq * a, "On regroupe " + M(cd(p, q) + " = " + pq) + ", puis " + M(cd(pq, a) + " = " + T(pq * a)) + ".",
[G("Regroupe d'abord : " + M(cd(p, q)) + " = ?", pq, M(pq) + "."), G("Puis " + M(cd(pq, a)) + " = ?", pq * a, M(T(pq * a)) + ".")],
[X(p * a + q, "Ce sont trois facteurs : on multiplie aussi par " + q + "."), X(pq * a * 10, "Un zéro de trop : " + M(cd(pq, a)) + ".")]); },
() => { const b = ri(3, 9), q = ri(21, 99); if (q % 10 === 0) return null; const p = b * q, q1 = 10 * Math.floor(q / 10), q2 = q % 10; if (p < 100 || p > 999) return null;
return Q("Calcule : " + M(p + " : " + b), q, M(p + " = " + b * q1 + " + " + b * q2) + ", donc " + M(p + " : " + b + " = " + q1 + " + " + q2 + " = " + q) + ".",
[G(M(b * q1 + " : " + b) + " = ?", q1, M(q1) + "."), G("Il reste " + M(p + " - " + b * q1 + " = " + b * q2) + " ; " + M(b * q2 + " : " + b) + " = ?", q2, M(q2) + "."), G("Résultat : " + M(q1 + " + " + q2) + " = ?", q, M(q) + ".")],
[X(q1, "Il reste encore " + b * q2 + " à partager."), X(q + 10, "Vérifie : " + M(cd(b, q + 10) + " = " + b * (q + 10)) + ".")]); },
],
} },

{ id: "p8calcadd", theme: "no", label: "Calcul réfléchi : additions et soustractions", ex: "347 + 99 = 446",
hint: "Pour ajouter 9, ajoute 10 puis retire 1. Pour aller jusqu'à 100, passe par la dizaine suivante.",
lesson: ["Calcul réfléchi", "On calcule plus vite et plus sûrement en arrondissant, puis en corrigeant.", "\\(+\\,9\\) : on ajoute \\(10\\), puis on retire \\(1\\). \\(-\\,99\\) : on retire \\(100\\), puis on rajoute \\(1\\). Pour compléter jusqu'à \\(100\\), on va d'abord à la dizaine suivante.",
["\\(347 + 99 = 447 - 1 = 446\\)", "De \\(37\\) à \\(100\\) : \\(3\\) jusqu'à \\(40\\), puis \\(60\\) : en tout \\(63\\)", "\\(20 - 7{,}35\\) : \\(0{,}65\\) jusqu'à \\(8\\), puis \\(12\\) : \\(12{,}65\\)"], "Pour \\(-\\,99\\), on a retiré \\(1\\) de trop en retirant \\(100\\) : on le rajoute."],
lv: {
1: [
() => { const n = ri(23, 480), k = rp([9, 19]), plus = R.rand() < 0.6; if (n % 10 === 0 || (!plus && n < 40)) return null; const r = plus ? n + k : n - k, k1 = k + 1;
return Q("Calcule : " + M(n + (plus ? " + " : " - ") + k), r, (plus ? M(n + " + " + k1 + " = " + (n + k1)) + ", puis on retire 1" : M(n + " - " + k1 + " = " + (n - k1)) + ", puis on rajoute 1") + " : " + M(r) + ".",
[G((plus ? "Ajoute " : "Retire ") + k1 + " : " + M(n + (plus ? " + " : " - ") + k1) + " = ?", plus ? n + k1 : n - k1, M(plus ? n + k1 : n - k1) + "."), G((plus ? "Tu as ajouté 1 de trop : retire-le." : "Tu as retiré 1 de trop : rajoute-le."), r, M(r) + ".")],
[X(plus ? n + k1 : n - k1, "On a " + (plus ? "ajouté" : "retiré") + " " + k1 + " au lieu de " + k + " : il faut corriger de 1."), X(plus ? n + k1 + 1 : n - k1 - 1, "La correction va dans l'autre sens.")]); },
() => { const a = ri(11, 89); if (a % 10 === 0) return null; const t = 10 * Math.ceil(a / 10);
return Q("Combien faut-il ajouter à " + M(a) + " pour obtenir " + M(100) + " ?", 100 - a, "De " + M(a) + " à " + M(t) + " : " + M(t - a) + " ; de " + M(t) + " à " + M(100) + " : " + M(100 - t) + ". En tout " + M(100 - a) + ".",
[G("De " + a + " à la dizaine suivante " + t + " : combien ?", t - a, M(t - a) + "."), G("De " + t + " à 100 : combien ?", 100 - t, M(100 - t) + "."), G("En tout ?", 100 - a, M(t - a + " + " + (100 - t) + " = " + (100 - a)) + ".")],
[X(110 - a, "Vérifie : " + M(a + " + " + (110 - a) + " = 110") + ". Passe par la dizaine suivante.")]); },
() => { const a = ri(15, 89), b = ri(15, 89); if ((a % 10) + (b % 10) < 10 || a % 10 === 0 || b % 10 === 0) return null; const da = a - (a % 10), db = b - (b % 10);
return Q("Calcule : " + M(a + " + " + b), a + b, M(da + " + " + db + " = " + (da + db)) + " et " + M((a % 10) + " + " + (b % 10) + " = " + ((a % 10) + (b % 10))) + " : " + M(da + db + " + " + ((a % 10) + (b % 10)) + " = " + (a + b)) + ".",
[G("Les dizaines : " + M(da + " + " + db) + " = ?", da + db, M(da + db) + "."), G("Les unités : " + M((a % 10) + " + " + (b % 10)) + " = ?", (a % 10) + (b % 10), M((a % 10) + (b % 10)) + "."), G("En tout ?", a + b, M(a + b) + ".")],
[X(a + b - 10, "La retenue : " + M((a % 10) + " + " + (b % 10) + " = " + ((a % 10) + (b % 10))) + " fait une dizaine de plus.")]); },
],
2: [
() => { const n = ri(231, 890), k = rp([99, 101]), plus = R.rand() < 0.5; if (n % 10 === 0) return null; const r = plus ? n + k : n - k;
return Q("Calcule : " + M(n + (plus ? " + " : " - ") + k), r, (plus ? M(n + " + 100 = " + (n + 100)) : M(n + " - 100 = " + (n - 100))) + ", puis on corrige de 1 : " + M(r) + ".",
[G((plus ? "Ajoute" : "Retire") + " d'abord 100 : ?", plus ? n + 100 : n - 100, M(plus ? n + 100 : n - 100) + "."), G("Corrige de 1 (" + k + " = 100 " + (k === 99 ? "− 1" : "+ 1") + ") : ?", r, M(r) + ".")],
[X(plus ? n + 100 : n - 100, k + " n'est pas 100 : il faut corriger de 1."), X(plus ? n + 200 - k : n - 200 + k, "La correction va dans l'autre sens.")]); },
() => { const a = ri(101, 899); if (a % 10 === 0) return null; const h = 100 * Math.ceil(a / 100), c = rp(["calc", "jeu"]);
const q = c === "calc" ? "Calcule : " + M("1000 - " + a) : "Dans un jeu vidéo, il faut 1000 points pour passer au niveau suivant. Yanis en a " + M(a) + ". Combien lui en manque-t-il ?";
return Q(q, 1000 - a, "De " + M(a) + " à " + M(h) + " : " + M(h - a) + " ; de " + M(h) + " à " + M(1000) + " : " + M(1000 - h) + ". En tout " + M(1000 - a) + ".",
[G("De " + a + " à la centaine suivante " + h + " : combien ?", h - a, M(h - a) + "."), G("De " + h + " à 1000 : combien ?", 1000 - h, M(1000 - h) + "."), G("En tout ?", 1000 - a, M(1000 - a) + ".")],
[X(1010 - a, "Vérifie en additionnant : " + M(a + " + " + (1010 - a) + " = 1010") + "."), X(1100 - a, "Vérifie en additionnant : " + M(a + " + " + (1100 - a) + " = 1100") + ".")], { ctx: "p8add-" + c }); },
() => { const a = ri(213, 985), b = ri(13, 89); if (a % 10 >= b % 10 || b % 10 === 0) return null; const bt = b - (b % 10);
return Q("Calcule : " + M(a + " - " + b), a - b, M(a + " - " + bt + " = " + (a - bt)) + ", puis " + M((a - bt) + " - " + (b % 10) + " = " + (a - b)) + ".",
[G("Retire d'abord les dizaines : " + M(a + " - " + bt) + " = ?", a - bt, M(a - bt) + "."), G("Puis les unités : " + M((a - bt) + " - " + (b % 10)) + " = ?", a - b, M(a - b) + ".")],
[X(Math.floor(a / 10) * 10 - bt + (b % 10) - (a % 10), "Aux unités, on ne retire pas le petit chiffre du grand : on emprunte une dizaine."), X(a - b + 10, "N'oublie pas la dizaine empruntée.")]); },
],
3: [
() => { const x = ri(21, 79), y = ri(23, 89); if (x % 10 === 0 || y % 10 === 0) return null; const z = 10 * ri(Math.ceil(x / 10) + 1, Math.ceil(x / 10) + 5) - x; if (z < 12 || z > 98 || z === y) return null;
return Q("Calcule astucieusement : " + M(x + " + " + y + " + " + z), x + y + z, "On regroupe " + M(x + " + " + z + " = " + (x + z)) + ", puis " + M((x + z) + " + " + y + " = " + (x + y + z)) + ".",
[G("Quels deux nombres font un compte rond ? Calcule " + M(x + " + " + z) + ".", x + z, M(x + z) + "."), G("Ajoute " + y + " : ?", x + y + z, M(x + y + z) + ".")],
[X(x + y + z - 10, "N'oublie pas la retenue en ajoutant " + y + ".")]); },
() => { const it = rp([["cine", "une place de cinéma", 13, 19, [20, 50]], ["menu", "un menu au snack", 9, 16, [20, 50]], ["boisson", "une boisson et un sandwich", 6, 9, [10, 20]], ["piscine", "une entrée à la piscine et une glace", 7, 9, [10, 20]]]);
const B = rp(it[4]), p = ri(it[2] * 20, it[3] * 20) / 20; if (Math.abs(p - Math.round(p)) < 1e-9) return null; const c = Math.ceil(p);
return Q("Tu paies " + it[1] + " à " + C(p) + " avec un billet de " + M(B) + " CHF. Combien te rend-on ?", B - p, "De " + C(p) + " à " + M(c) + " CHF : " + C(c - p) + " ; de " + M(c) + " à " + M(B) + " CHF : " + M(B - c) + " CHF. En tout " + C(B - p) + ".",
[G("Jusqu'au franc suivant (" + c + " CHF) : combien ?", c - p, C(c - p) + "."), G("De " + c + " CHF à " + B + " CHF : combien ?", B - c, M(B - c) + " CHF."), G("Monnaie rendue ?", B - p, C(B - p) + ".")],
[X(B - p + 1, "Vérifie en additionnant : la monnaie plus le prix doit faire " + B + " CHF."), X(B - c, "Il manque les centimes jusqu'au franc suivant.")], { ctx: "p8add-" + it[0] }); },
() => { const a = ri(1490, 2990) / 100 * 1, b = ri(690, 1990) / 100; const A = Math.round(a * 20) / 20, Bv = Math.round(b * 20) / 20, H = rp([50, 100]); if (A + Bv >= H - 5 || Number.isInteger(A) || Number.isInteger(Bv)) return null;
const [o1, o2] = rp([["un t-shirt", "une casquette"], ["un livre", "une BD"], ["un ballon", "une gourde"]]);
return Q("Tu as " + M(H) + " CHF. Tu achètes " + o1 + " à " + C(A) + " et " + o2 + " à " + C(Bv) + ". Combien te reste-t-il ?", H - A - Bv, "Dépense : " + M(chf(A) + " + " + chf(Bv) + " = " + chf(A + Bv)) + " CHF ; reste : " + M(H + " - " + chf(A + Bv) + " = " + chf(H - A - Bv)) + " CHF.",
[G("Combien dépenses-tu en tout ?", A + Bv, C(A + Bv) + "."), G("Combien te reste-t-il ?", H - A - Bv, C(H - A - Bv) + ".")],
[X(A + Bv, "C'est ce que tu dépenses ; on demande ce qui reste."), X(H - A, "Il faut aussi payer " + o2 + ".")], { ctx: "p8add-achats" }); },
],
} },

{ id: "p8dizaines", theme: "no", label: "Calculer avec 10, 100, 1000 et les dizaines", ex: "30 \\cdot 40 = 1200",
hint: "× 10 : chaque chiffre prend un rang de plus. 30 · 40, c'est 3 · 4 = 12, puis les deux zéros : 1200.",
lesson: ["Calculer avec les dizaines", "Multiplier par 10, c'est donner un rang de plus à chaque chiffre : les unités deviennent des dizaines.", "\\(47 \\cdot 100 = 4700\\) et \\(4700 : 100 = 47\\). Pour \\(30 \\cdot 40\\), on calcule \\(3 \\cdot 4 = 12\\), puis on écrit les deux zéros : \\(1200\\). Dans \\(4572\\), il y a \\(457\\) dizaines en tout.",
["\\(56 \\cdot 1000 = 56\\text{'}000\\)", "\\(30 \\cdot 40 = 1200\\)", "\\(2400 : 60 = 240 : 6 = 40\\)"], "\\(60 \\cdot 50 = 3000\\) : \\(6 \\cdot 5 = 30\\) a déjà un zéro, on en écrit encore deux."],
lv: {
1: [
() => { const n = ri(13, 999), k = rp([10, 100, 1000]); if (n % 10 === 0) return null; const z = String(k).length - 1;
return Q("Calcule : " + M(cd(n, k)), n * k, "Chaque chiffre prend " + z + " rang" + (z > 1 ? "s" : "") + " de plus : " + M(cd(n, k) + " = " + T(n * k)) + ".",
[G("Combien de zéros dans " + k + " ?", z, M(z) + "."), G("Résultat ?", n * k, M(T(n * k)) + ".")],
[X(n * k / 10, k + " a " + z + " zéro" + (z > 1 ? "s" : "") + " : il en manque un."), X(n * k * 10, k + " a " + z + " zéro" + (z > 1 ? "s" : "") + " : un de trop.")]); },
() => { const q = ri(13, 99), k = rp([10, 100]); if (q % 10 === 0) return null; const N = q * k;
return Q("Calcule : " + M(T(N) + " : " + k), q, "Chaque chiffre perd " + (k === 10 ? "un rang" : "deux rangs") + " : " + M(T(N) + " : " + k + " = " + q) + ".",
[G("Combien de zéros enlève-t-on à " + S(N) + " ?", String(k).length - 1, M(String(k).length - 1) + "."), G("Résultat ?", q, M(q) + ".")],
[X(q * 10, "Diviser par " + k + " enlève " + (String(k).length - 1) + " zéro" + (k > 10 ? "s" : "") + "."), X(q / 10, "Un rang de trop.")]); },
() => { const N = ri(1012, 9989); if (N % 10 === 0) return null; const dz = Math.floor(N / 10) % 10;
return Q("Combien y a-t-il de dizaines en tout dans le nombre " + M(N) + " ?", Math.floor(N / 10), "On lit le nombre jusqu'au chiffre des dizaines : " + M(N) + " contient " + M(Math.floor(N / 10)) + " dizaines (et " + (N % 10) + " unité" + (N % 10 > 1 ? "s" : "") + ").",
[G("Quel est le chiffre des dizaines de " + N + " ?", dz, M(dz) + "."), G("Cache le chiffre des unités : quel nombre lis-tu ?", Math.floor(N / 10), M(Math.floor(N / 10)) + " dizaines.")],
[X(dz, "C'est le chiffre des dizaines ; on demande le nombre de dizaines en tout."), X(Math.floor(N / 100), "Ça, ce sont les centaines.")]); },
],
2: [
() => { const a = ri(2, 9), b = ri(2, 9); return Q("Calcule : " + M(cd(a * 10, b * 10)), a * b * 100, M(cd(a, b) + " = " + a * b) + ", puis on écrit les deux zéros : " + M(T(a * b * 100)) + ".",
[G(M(cd(a, b)) + " = ?", a * b, M(a * b) + "."), G("Écris les deux zéros : ?", a * b * 100, M(T(a * b * 100)) + ".")],
[X(a * b * 10, "Il y a deux zéros (un dans " + a * 10 + ", un dans " + b * 10 + ")."), X(a * b * 1000, "Un zéro de trop.")]); },
() => { const a = ri(2, 9), q = ri(2, 9), N = a * q * 100;
return Q("Calcule : " + M(T(N) + " : " + a * 10), q * 10, "On divise d'abord par 10 : " + M(T(N / 10) + " : " + a + " = " + q * 10) + ".",
[G("Divise les deux nombres par 10 : " + M(T(N / 10) + " : " + a) + ". Quel est le résultat ?", q * 10, M(q * 10) + ".")],
[X(q, "Il manque un zéro : " + M(cd(a * 10, q)) + " = " + a * q * 10 + "."), X(q * 100, "Un zéro de trop : " + M(cd(a * 10, q * 100)) + " = " + T(a * q * 1000) + ".")]); },
() => { const N = ri(10120, 99890); if (N % 100 === 0) return null; const ce = Math.floor(N / 100) % 10;
return Q("Combien y a-t-il de centaines en tout dans le nombre " + M(T(N)) + " ?", Math.floor(N / 100), "On lit le nombre jusqu'au chiffre des centaines : " + M(Math.floor(N / 100)) + " centaines.",
[G("Quel est le chiffre des centaines de " + S(N) + " ?", ce, M(ce) + "."), G("Cache les dizaines et les unités : quel nombre lis-tu ?", Math.floor(N / 100), M(Math.floor(N / 100)) + " centaines.")],
[X(ce, "C'est le chiffre des centaines ; on demande le nombre de centaines en tout."), X(Math.floor(N / 10), "Ça, ce sont les dizaines.")]); },
],
3: [
() => { const a = ri(2, 9), b = ri(2, 9); return Q("Calcule : " + M(cd(a * 10, b * 100)), a * b * 1000, M(cd(a, b) + " = " + a * b) + ", puis on écrit les trois zéros : " + M(T(a * b * 1000)) + ".",
[G(M(cd(a, b)) + " = ?", a * b, M(a * b) + "."), G("Combien de zéros écrire en tout ?", 3, "Un dans " + a * 10 + ", deux dans " + b * 100 + " : 3."), G("Résultat ?", a * b * 1000, M(T(a * b * 1000)) + ".")],
[X(a * b * 100, "Trois zéros en tout, pas deux."), X(a * b * 10000, "Trois zéros en tout, pas quatre.")]); },
() => { const a = ri(2, 9), q = ri(12, 49); if (q % 10 === 0) return null; const N = a * 10 * q;
return Q("Calcule : " + M(T(N) + " : " + a * 10), q, "On divise d'abord par 10, puis par " + a + " : " + M(T(N / 10) + " : " + a + " = " + q) + ".",
[G("Divise d'abord par 10 : " + M(T(N) + " : 10") + " = ?", N / 10, M(T(N / 10)) + "."), G("Puis " + M(T(N / 10) + " : " + a) + " = ?", q, M(q) + ".")],
[X(q * 10, "On divise par " + a * 10 + " : il faut aussi diviser par 10."), X(N / a, "On divise par " + a * 10 + ", pas seulement par " + a + ".")]); },
() => { const c = rp([["festival", (n, p) => "Un festival vend " + M(n) + " billets à " + M(p) + " CHF. Quelle est la recette, en CHF ?", [200, 300, 400, 500, 600, 800], [20, 30, 40, 50, 60]],
["maillots", (n, p) => "Un club commande " + M(n) + " maillots à " + M(p) + " CHF pièce. Combien paie-t-il, en CHF ?", [30, 40, 60, 80], [30, 40, 50, 70, 90]],
["piscine", (n, p) => "À l'entraînement, une nageuse fait " + M(n) + " longueurs d'un bassin de " + M(p) + " m. Combien de mètres nage-t-elle ?", [40, 60, 80], [25, 50]]]);
const n = rp(c[2]), p = rp(c[3]), t = n * p, z0 = (x) => { let k = 0; while (x % 10 === 0) { x /= 10; k++; } return [x, k]; }, [n0, zn] = z0(n), [p0, zp] = z0(p);
return Q(c[1](n, p), t, M(cd(n, p) + " = " + T(t)) + ".",
[G("Sans les zéros : " + M(cd(n0, p0)) + " = ?", n0 * p0, M(n0 * p0) + "."), G("Combien de zéros écrire ensuite ?", zn + zp, M(zn + zp) + "."), G("Résultat ?", t, M(T(t)) + ".")],
[X(t / 10, "Compte tous les zéros des deux nombres."), X(t * 10, "Un zéro de trop."), X(n + p, "C'est une multiplication : " + n + " fois " + p + ".")], { ctx: "p8diz-" + c[0] }); },
],
} },

{ id: "p8diveucl", theme: "no", label: "Division euclidienne : quotient et reste", ex: "47 = 6 \\cdot 7 + 5",
hint: "Cherche le plus grand produit de la table du diviseur qui ne dépasse pas le nombre : il donne le quotient ; ce qui manque est le reste.",
lesson: ["Division euclidienne", "Partager 47 cartes en paquets de 6 : on fait 7 paquets, et il en reste 5.", "On cherche le plus grand produit de la table du diviseur qui ne dépasse pas le nombre : \\(6 \\cdot 7 = 42 \\le 47\\). Le quotient est \\(7\\), le reste \\(47 - 42 = 5\\). On écrit \\(47 = 6 \\cdot 7 + 5\\) ; le reste est toujours plus petit que le diviseur.",
["\\(47 = 6 \\cdot 7 + 5\\) : quotient 7, reste 5", "58 élèves, minibus de 9 places : \\(9 \\cdot 6 = 54\\), il reste 4 élèves : il faut \\(7\\) minibus", "\\(135\\) min \\(= 2\\) h \\(15\\) min, car \\(135 = 60 \\cdot 2 + 15\\)"], "Quand on demande combien de véhicules il faut, on compte aussi le dernier, même s'il n'est pas plein."],
lv: {
1: [
() => { const b = ri(3, 9), q = ri(3, 9), r = ri(1, b - 1), N = b * q + r;
return Q("Quel est le quotient de la division euclidienne de " + M(N) + " par " + M(b) + " ?", q, M(N + " = " + cd(b, q) + " + " + r) + " (et " + M(r + " < " + b) + ") : le quotient est " + M(q) + ".",
[G("Plus grand produit de la table de " + b + " qui ne dépasse pas " + N + " ?", b * q, M(cd(b, q) + " = " + b * q) + "."), G("Quotient ?", q, M(q) + ".")],
[X(q + 1, M(cd(b, q + 1) + " = " + b * (q + 1)) + " dépasse " + N + "."), X(r, "Ça, c'est le reste ; on demande le quotient.")]); },
() => { const b = ri(4, 9), q = ri(3, 9), r = ri(2, b - 1), N = b * q + r;
return Q("Quel est le reste de la division euclidienne de " + M(N) + " par " + M(b) + " ?", r, M(cd(b, q) + " = " + b * q) + " et " + M(N + " - " + b * q + " = " + r) + " : le reste est " + M(r) + ".",
[G("Plus grand produit de la table de " + b + " qui ne dépasse pas " + N + " ?", b * q, M(cd(b, q) + " = " + b * q) + "."), G("Reste : " + M(N + " - " + b * q) + " = ?", r, M(r) + ".")],
[X(q, "Ça, c'est le quotient ; on demande le reste."), X(b - r, "Le reste, c'est ce qui dépasse " + b * q + " : " + M(N + " - " + b * q) + ".")]); },
() => { const c = rp([["cartes", "Tu ranges ", " cartes à collectionner en paquets de ", ". Combien de paquets complets fais-tu ?", [5, 6, 8]], ["tennis", "Le club range ", " balles de tennis dans des tubes de ", ". Combien de tubes complets remplit-il ?", [3, 4]], ["photos", "Tu imprimes ", " photos ; une planche en contient ", ". Combien de planches complètes obtiens-tu ?", [4, 6, 9]]]);
const b = rp(c[4]), q = ri(5, 9), r = ri(1, b - 1), N = b * q + r;
return Q(c[1] + M(N) + c[2] + M(b) + c[3], q, M(N + " = " + cd(b, q) + " + " + r) + " : " + M(q) + " complets (il en reste " + r + ").",
[G("Plus grand produit de la table de " + b + " qui ne dépasse pas " + N + " ?", b * q, M(cd(b, q) + " = " + b * q) + "."), G("Combien de complets ?", q, M(q) + ".")],
[X(q + 1, "Le dernier n'est pas complet : il n'en contient que " + r + "."), X(r, "C'est ce qui reste ; on demande les complets.")], { ctx: "p8div-" + c[0] }); },
],
2: [
() => { const b = ri(4, 9), q = ri(14, 99), r = ri(2, b - 1), N = b * q + r; if (N < 100) return null;
return Q("Quel est le reste de la division euclidienne de " + M(N) + " par " + M(b) + " ?", r, M(N + " = " + cd(b, q) + " + " + r) + " : le reste est " + M(r) + ".",
[G("Quotient ? (le plus grand nombre q tel que " + M(cd(b, "q")) + " ne dépasse pas " + N + ")", q, M(q) + "."), G(M(cd(b, q)) + " = ?", b * q, M(b * q) + "."), G("Reste : " + M(N + " - " + b * q) + " = ?", r, M(r) + ".")],
[X(q, "Ça, c'est le quotient ; on demande le reste."), X(r + b, "Le reste doit être plus petit que " + b + ".")]); },
() => { const c = rp([["minibus", (N, b) => M(N) + " élèves partent en course d'école dans des minibus de " + M(b) + " places. Combien de minibus faut-il au minimum ?", [8, 9], "minibus"],
["telecabine", (N, b) => "Au camp de ski, " + M(N) + " élèves prennent des télécabines de " + M(b) + " places. Combien de télécabines faut-il au minimum ?", [4, 6, 8], "télécabines"],
["voitures", (N, b) => "Pour un match à l'extérieur, " + M(N) + " joueurs et joueuses partent en voiture, " + M(b) + " par voiture. Combien de voitures faut-il au minimum ?", [4, 5], "voitures"]]);
const b = rp(c[2]), q = ri(4, 9), r = ri(1, b - 1), N = b * q + r;
return Q(c[1](N, b), q + 1, M(N + " = " + cd(b, q) + " + " + r) + " : " + q + " " + c[3] + " pleins, et il reste " + r + " personne" + (r > 1 ? "s" : "") + " : il en faut " + M(q + 1) + ".",
[G("Combien de " + c[3] + " pleins ? (" + M(N + " : " + b) + ", quotient)", q, M(q) + ", reste " + r + "."), G("Il reste " + r + " personne" + (r > 1 ? "s" : "") + " sans place : combien de " + c[3] + " en tout ?", q + 1, M(q + 1) + ".")],
[X(q, "Il reste " + r + " personne" + (r > 1 ? "s" : "") + " : il faut un véhicule de plus.")], { ctx: "p8div-" + c[0] }); },
() => { const h = ri(1, 4), m = ri(5, 55); if (m % 5 !== 0 && R.rand() < 0.5) return null; const N = 60 * h + m; const c = rp([["film", "Un film dure " + M(N) + " minutes."], ["trajet", "Un trajet en train dure " + M(N) + " minutes."], ["match", "Une rencontre de tennis a duré " + M(N) + " minutes."]]);
return Q(c[1] + " Cela fait combien d'heures complètes, et combien de minutes en plus ? Donne les minutes en plus.", m, M(N + " = " + cd(60, h) + " + " + m) + " : " + h + " h " + m + " min.",
[G("Combien d'heures complètes ? (" + M(cd(60, "?")) + " sans dépasser " + N + ")", h, M(h) + " h = " + 60 * h + " min."), G("Minutes en plus : " + M(N + " - " + 60 * h) + " = ?", m, M(m) + " min.")],
[N - 100 * h > 0 ? X(N - 100 * h, "Une heure vaut 60 minutes, pas 100.") : null, X(h, "Ça, ce sont les heures ; on demande les minutes en plus.")], { ctx: "p8div-" + c[0] }); },
],
3: [
() => { const b = rp([48, 50, 52, 55]), q = ri(3, 8), r = ri(4, b - 4), N = b * q + r;
return Q("Pour une sortie de l'école, " + M(N) + " personnes voyagent dans des cars de " + M(b) + " places. Combien de cars faut-il au minimum ?", q + 1, M(cd(b, q) + " = " + b * q) + " : il reste " + M(N - b * q) + " personnes, donc il faut " + M(q + 1) + " cars.",
[G("Combien de cars pleins ? (" + M(cd(b, "?")) + " sans dépasser " + N + ")", q, M(cd(b, q) + " = " + b * q) + "."), G("Il reste " + r + " personnes : combien de cars en tout ?", q + 1, M(q + 1) + ".")],
[X(q, "Il reste " + r + " personnes sans place : il faut un car de plus.")], { ctx: "p8div-cars" }); },
() => { const b = ri(11, 25), q = ri(9, 39), r = ri(2, b - 1), N = b * q + r; if (N < 150 || N > 999) return null;
return Q("Quel est le reste de la division euclidienne de " + M(N) + " par " + M(b) + " ?", r, M(N + " = " + cd(b, q) + " + " + r) + " : le reste est " + M(r) + ".",
[G("Quotient ? (le plus grand q tel que " + M(cd(b, "q")) + " ne dépasse pas " + N + ")", q, M(cd(b, q) + " = " + b * q) + "."), G("Reste : " + M(N + " - " + b * q) + " = ?", r, M(r) + ".")],
[X(q, "Ça, c'est le quotient ; on demande le reste."), X(r + b, "Le reste doit être plus petit que " + b + ".")]); },
() => { const c0 = rp([["vacances", 7, 9, "Les vacances d'été durent "], ["appli", 6, 28, "Tu utilises une appli de langues depuis "], ["prepa", 6, 16, "La préparation d'un semi-marathon dure "]]), w = ri(c0[1], c0[2]), d = ri(2, 6), N = 7 * w + d;
const c = [c0[0], c0[3] + M(N) + " jours."];
return Q(c[1] + " Combien de semaines complètes cela fait-il, et combien de jours en plus ? Donne les jours en plus.", d, M(N + " = " + cd(7, w) + " + " + d) + " : " + w + " semaines et " + d + " jours.",
[G("Combien de semaines complètes ? (" + M(cd(7, "?")) + " sans dépasser " + N + ")", w, M(cd(7, w) + " = " + 7 * w) + "."), G("Jours en plus : " + M(N + " - " + 7 * w) + " = ?", d, M(d) + ".")],
[X(w, "Ça, ce sont les semaines ; on demande les jours en plus."), X(7 - d, "Les jours en plus : " + M(N + " - " + 7 * w) + ".")], { ctx: "p8div-" + c[0] }); },
],
} },

{ id: "p8droite", theme: "no", label: "Droite graduée : lire un nombre", ex: "\\text{graduations de } 0{,}1",
hint: "Calcule d'abord ce que vaut l'écart entre deux graduations voisines : écart entre deux nombres écrits, divisé par le nombre d'intervalles.",
lesson: ["Lire une droite graduée", "Sur une droite graduée, deux graduations voisines sont toujours séparées par le même écart.", "On prend deux nombres écrits, on calcule leur écart, et on le divise par le nombre d'intervalles qui les séparent : c'est la valeur d'une graduation. Puis on compte les graduations jusqu'au point.",
["De 40 à 50 en 5 intervalles : une graduation vaut \\(2\\)", "De 3 à 4 en 10 intervalles : une graduation vaut \\(0{,}1\\)", "De 0 à 1 en 4 intervalles : une graduation vaut \\(\\frac{1}{4}\\)"], "On compte les intervalles (les espaces entre les traits), pas les traits."],
lv: {
1: [
() => { const [s, n] = rp([[2, 5], [2, 10], [5, 4], [5, 10]]), A = s === 2 ? 10 * ri(2, 9) : 50 * ri(1, 9), k = ri(1, n - 1);
return droiteQ("ent", n, [[0, S(A)], [n, S(A + n * s)]], k, A + k * s, s); },
() => { const [st, n] = rp([[25, 4], [20, 5], [10, 10], [50, 10]]), A = 100 * ri(1, 8), k = ri(1, n - 1); if (st * k % 100 === 0) return null;
return droiteQ("cent", n, [[0, S(A)], [n, S(A + n * st)]], k, A + k * st, st); },
() => { const [st, n] = rp([[100, 10], [250, 4], [200, 5]]), A = 1000 * ri(1, 8), k = ri(1, n - 1); if (k * st % 1000 === 0) return null;
return droiteQ("mille", n, [[0, S(A)], [n, S(A + n * st)]], k, A + k * st, st); },
],
2: [
() => { const U = ri(1, 9), k = ri(1, 9); return droiteQ("dix", 10, [[0, S(U)], [10, S(U + 1)]], k, U + k / 10, 0.1); },
() => { const [st, n, A] = rp([[0.5, 10, 0], [0.2, 10, 0], [0.25, 4, ri(1, 6)], [0.5, 6, ri(1, 6)]]), k = ri(1, n - 1); if (Number.isInteger(A + k * st)) return null;
return droiteQ("pas", n, [[0, S(A)], [n, S(A + n * st)]], k, fx(A + k * st), st); },
() => { const den = rp([3, 4, 5, 6]), k = ri(1, 2 * den - 1); if (k % den === 0) return null;
return droiteQ("frac", 2 * den, [[0, "0"], [den, "1"], [2 * den, "2"]], k, k / den, 1 / den, den); },
],
3: [
() => { const U = ri(1, 9), t = ri(0, 8), k = ri(1, 9), A = fx(U + t / 10); return droiteQ("cent2", 10, [[0, S(A)], [10, S(fx(A + 0.1))]], k, fx(A + k / 100), 0.01); },
() => { const st = rp([2, 5, 25, 0.5, 0.2]), i = ri(1, 3), j = i + rp([4, 5]), A = st >= 2 ? st * ri(2, 20) : ri(1, 5), k = ri(0, 10); if (k === i || k === j) return null;
const v0 = fx(A - i * st), val = fx(v0 + k * st); if (v0 < 0 || Number.isInteger(val) && st < 1 && R.rand() < 0.5) return null;
return droiteQ("milieu", 10, [[i, S(A)], [j, S(fx(A + (j - i) * st))]], k, val, st); },
() => { const [st, n] = rp([[1000, 10], [2000, 10], [5000, 10], [25000, 4]]), A = 10000 * ri(1, 9) * (st === 25000 ? 10 : 1), k = ri(1, n - 1);
return droiteQ("grands", n, [[0, S(A)], [n, S(A + n * st)]], k, A + k * st, st); },
],
} },

{ id: "p8fracpart", theme: "no", label: "Moitié, tiers, quart d'une quantité", ex: "\\frac{3}{4} \\text{ de } 60 = 45",
hint: "Le quart de 36, c'est 36 : 4 = 9. Les trois quarts, c'est trois fois le quart : 27.",
lesson: ["Moitié, tiers, quart", "Prendre le quart d'une quantité, c'est la partager en 4 parts égales et en garder une.", "La moitié : \\(: 2\\) ; le tiers : \\(: 3\\) ; le quart : \\(: 4\\) ; le dixième : \\(: 10\\). Les trois quarts, c'est trois fois le quart. Une heure vaut 60 minutes : un quart d'heure, c'est 15 min ; trois quarts d'heure, 45 min.",
["Le quart de \\(36\\) : \\(36 : 4 = 9\\)", "Les trois quarts de \\(36\\) : \\(9 \\cdot 3 = 27\\)", "\\(\\frac{1}{2} = 0{,}5 = \\frac{5}{10}\\)"], "Le tiers et le quart ne sont pas la même part : le tiers de 60 vaut 20, le quart de 60 vaut 15."],
lv: {
1: [
() => { const [w, b] = rp([["la moitié", 2], ["le tiers", 3], ["le quart", 4], ["le dixième", 10]]), k = b === 10 ? ri(12, 95) : ri(7, 25), N = b * k; if (b === 10 && k % 10 === 0) return null;
return Q("Combien vaut " + w + " de " + M(N) + " ?", k, w[0].toUpperCase() + w.slice(1) + " : on divise par " + b + " : " + M(N + " : " + b + " = " + k) + ".",
[G("Par quel nombre divise-t-on pour prendre " + w + " ?", b, M(b) + "."), G(M(N + " : " + b) + " = ?", k, M(k) + ".")],
[X(N - k, "C'est ce qui reste ; on demande " + w + "."), X(N * b, "On partage : le résultat est plus petit que " + N + ".")]); },
() => { const [w, v] = rp([["trois quarts d'heure", 45], ["une heure et quart", 75], ["une heure et demie", 90], ["deux heures et quart", 135], ["deux heures et demie", 150], ["trois heures moins le quart", 165], ["une heure moins le quart", 45]]);
const c = rp([["film", "Un film dure " + w + "."], ["entrainement", "Un entraînement dure " + w + "."], ["trajet", "Un trajet en bus dure " + w + "."]]);
return Q(c[1] + " Combien de minutes cela fait-il ?", v, "Une heure = 60 min, un quart d'heure = 15 min, une demi-heure = 30 min : " + M(v) + " min.",
[G("Combien de minutes dans un quart d'heure ?", 15, "60 : 4 = 15."), G("Combien de minutes en tout ?", v, M(v) + " min.")],
[X(Math.round(v / 60 * 100), "Une heure vaut 60 minutes, pas 100 : un quart d'heure, c'est 15 min (60 : 4).")], { ctx: "p8frac-" + c[0] }); },
() => { const [w, a, b] = rp([["les trois quarts", 3, 4], ["les deux tiers", 2, 3]]), k = ri(6, 25), N = b * k;
return Q("Combien valent " + w + " de " + M(N) + " ?", a * k, "Une part : " + M(N + " : " + b + " = " + k) + " ; " + w + " : " + M(cd(k, a) + " = " + a * k) + ".",
[G("Une part (" + (b === 4 ? "le quart" : "le tiers") + ") : " + M(N + " : " + b) + " = ?", k, M(k) + "."), G((b === 4 ? "Trois" : "Deux") + " parts : ?", a * k, M(a * k) + ".")],
[X(k, "C'est une seule part ; on en veut " + a + "."), X(N - a * k, "C'est ce qui reste.")]); },
],
2: [
() => { const c = rp([["concert", (N, f) => "Une salle de concert compte " + M(T(N)) + " places ; les " + f + " sont déjà vendues. Combien de places sont vendues ?", [240, 360, 600, 1200, 1800]],
["sondage", (N, f) => "Sur " + M(N) + " élèves interrogés, les " + f + " ont un téléphone portable. Combien d'élèves ont un portable ?", [120, 180, 240, 300]],
["trajet", (N, f) => "Un trajet à vélo fait " + M(N) + " km. Tu en as déjà parcouru les " + f + ". Combien de kilomètres as-tu parcourus ?", [20, 30, 40, 60]]]);
const [a, b] = rp([[3, 4], [2, 3], [3, 5], [7, 10], [2, 5]]), N = rp(c[2]); if (N % b !== 0) return null; const f = M("\\frac{" + a + "}{" + b + "}");
return Q(c[1](N, f), N / b * a, "Une part : " + M(T(N) + " : " + b + " = " + T(N / b)) + " ; " + a + " parts : " + M(cd(T(N / b), a) + " = " + T(N / b * a)) + ".",
[G("Une part : " + M(T(N) + " : " + b) + " = ?", N / b, M(T(N / b)) + "."), G(a + " parts : ?", N / b * a, M(T(N / b * a)) + ".")],
[X(N / b, "C'est une seule part ; on en veut " + a + "."), X(N - N / b * a, "C'est ce qui reste.")], { ctx: "p8frac-" + c[0] }); },
() => { const [un, uu, U, ...fs] = rp([["d'un kilogramme", "grammes", 1000, [3, 4], [3, 5], [2, 5], [3, 10]], ["d'un kilomètre", "mètres", 1000, [3, 4], [2, 5], [7, 10], [4, 5]], ["d'une heure", "minutes", 60, [2, 3], [3, 4], [5, 6], [3, 10]], ["d'un mètre", "centimètres", 100, [3, 4], [2, 5], [3, 5], [7, 10]]]);
const [a, b] = rp(fs), v = U / b * a; return Q("Combien de " + uu + " y a-t-il dans les " + M("\\frac{" + a + "}{" + b + "}") + " " + un + " ?", v, "Un " + (NTH[b] || "dixième") + " : " + M(U + " : " + b + " = " + T(U / b)) + " ; " + M(cd(T(U / b), a) + " = " + T(v)) + " " + uu + ".",
[G("Combien de " + uu + " dans l'unité entière ?", U, M(U) + "."), G("Un " + (b === 10 ? "dixième" : NTH[b]) + " : " + M(U + " : " + b) + " = ?", U / b, M(T(U / b)) + "."), G("Les " + a + " parts : ?", v, M(T(v)) + " " + uu + ".")],
[X(U / b, "C'est une seule part ; on en veut " + a + "."), X(a * 100 / b, "L'unité vaut " + U + " " + uu + ".")]); },
() => { const c = rp([["argent", (N, w) => "Lina a " + M(N) + " CHF. Elle dépense " + w + " pour un jeu vidéo. Combien lui reste-t-il, en CHF ?", [36, 48, 60, 72, 84, 96]],
["batterie", (N, w) => "La batterie d'une trottinette électrique permet de rouler " + M(N) + " km. Tu as déjà utilisé " + w + " de la batterie. Combien de kilomètres peux-tu encore faire ?", [24, 30, 36, 40]],
["classe", (N, w) => "Une classe compte " + M(N) + " élèves ; " + w + " sont au camp de ski. Combien d'élèves restent en classe ?", [20, 24]]]);
const [w, b] = rp([["le quart", 4], ["le tiers", 3], ["la moitié", 2], ["le cinquième", 5]]), N = rp(c[2]); if (N % b !== 0) return null;
return Q(c[1](N, w), N - N / b, w[0].toUpperCase() + w.slice(1) + " : " + M(N + " : " + b + " = " + N / b) + " ; il reste " + M(N + " - " + N / b + " = " + (N - N / b)) + ".",
[G(w[0].toUpperCase() + w.slice(1) + " de " + N + " : ?", N / b, M(N / b) + "."), G("Ce qui reste : " + M(N + " - " + N / b) + " = ?", N - N / b, M(N - N / b) + ".")],
[X(N / b, "C'est la part utilisée ; on demande ce qui reste.")], { ctx: "p8frac-" + c[0] }); },
],
3: [
() => { const [w, b] = rp([["Le quart", 4], ["Le tiers", 3], ["Le cinquième", 5], ["Le dixième", 10]]), k = ri(6, 24), N = b * k; const c = rp([["nombre", w + " d'un nombre vaut " + M(k) + ". Quel est ce nombre ?"], ["club", w + " des membres d'un club de basket, soit " + M(k) + " personnes, a moins de 14 ans. Combien le club a-t-il de membres ?"]]);
return Q(c[1], N, "Il y a " + b + " parts de " + M(k) + " : " + M(cd(k, b) + " = " + N) + ".",
[G("Combien de parts égales en tout ?", b, M(b) + "."), G("Le tout : " + M(cd(k, b)) + " = ?", N, M(N) + ".")],
[X(k / b, "Ici on connaît une part ; le tout est plus grand."), X(k + b, "Il y a " + b + " parts de " + k + " : c'est une multiplication.")], { ctx: "p8frac-" + c[0] }); },
() => { const [a, b, D] = rp([[3, 4, 100], [1, 4, 100], [1, 2, 10], [2, 5, 10], [3, 5, 100], [4, 5, 10], [7, 20, 100], [3, 25, 100], [1, 2, 100]]);
return Q("Complète : " + M("\\frac{" + a + "}{" + b + "} = \\frac{?}{" + D + "}"), a * D / b, "On multiplie le numérateur et le dénominateur par " + D / b + " : " + M("\\frac{" + a + "}{" + b + "} = \\frac{" + a * D / b + "}{" + D + "}") + ".",
[G("Par combien multiplie-t-on " + b + " pour obtenir " + D + " ?", D / b, M(cd(b, D / b) + " = " + D) + "."), G("On multiplie aussi " + a + " : ?", a * D / b, M(a * D / b) + ".")],
[X(a * (D / 10), "On multiplie " + a + " par " + D / b + " (le même nombre que pour " + b + ")."), X(D - b + a, "On ne fait pas d'addition : on multiplie le haut et le bas par le même nombre.")]); },
() => { const P = [["trois quarts d'heure", 45], ["une demi-heure", 30], ["un quart d'heure", 15], ["une heure et quart", 75], ["une heure et demie", 90]], [w1, v1] = rp(P), [w2, v2] = rp(P); if (w1 === w2) return null;
return Q("Tu t'entraînes " + w1 + " le lundi et " + w2 + " le jeudi. Combien de minutes en tout ?", v1 + v2, M(v1 + " + " + v2 + " = " + (v1 + v2)) + " min.",
[G("Lundi : combien de minutes ?", v1, M(v1) + " min."), G("Jeudi : combien de minutes ?", v2, M(v2) + " min."), G("En tout ?", v1 + v2, M(v1 + v2) + " min.")],
[X(v1 + v2 + 10, "Un quart d'heure, c'est 15 minutes.")], { ctx: "p8frac-sport" }); },
],
} },

{ id: "p8conv", theme: "gm", label: "Conversions usuelles : longueurs, masses, durées", ex: "3\\ \\text{km}\\ 250\\ \\text{m} = 3250\\ \\text{m}",
hint: "1 km = 1000 m ; 1 m = 100 cm ; 1 kg = 1000 g ; 1 t = 1000 kg ; 1 L = 10 dL ; 1 h = 60 min ; 1 min = 60 s.",
lesson: ["Changer d'unité", "Vers une unité plus petite, le nombre devient plus grand.", "\\(1\\ \\text{km} = 1000\\ \\text{m}\\), \\(1\\ \\text{m} = 100\\ \\text{cm}\\), \\(1\\ \\text{kg} = 1000\\ \\text{g}\\), \\(1\\ \\text{L} = 10\\ \\text{dL}\\), \\(1\\ \\text{h} = 60\\ \\text{min}\\). Une mesure en deux unités : on convertit la plus grande, puis on ajoute : \\(3\\ \\text{km}\\ 250\\ \\text{m} = 3000 + 250 = 3250\\ \\text{m}\\).",
["\\(2\\ \\text{h}\\ 15\\ \\text{min} = 120 + 15 = 135\\ \\text{min}\\)", "\\(4500\\ \\text{g} = 4{,}5\\ \\text{kg}\\)"], "Les heures ne se comptent pas par 100 : \\(1{,}5\\ \\text{h} = 90\\ \\text{min}\\), pas \\(150\\ \\text{min}\\)."],
lv: {
1: [
() => { const [a, b, f, lo, hi] = rp([["km", "m", 1000, 2, 9], ["m", "cm", 100, 2, 15], ["kg", "g", 1000, 2, 9], ["t", "kg", 1000, 2, 9], ["h", "min", 60, 2, 6], ["min", "s", 60, 2, 9], ["L", "dL", 10, 2, 15], ["cm", "mm", 10, 3, 40]]), v = ri(lo, hi);
return Q("Convertis " + M(v + u(a)) + " en " + b + ".", v * f, M("1" + u(a) + " = " + f + u(b)) + " : " + M(cd(v, f) + " = " + T(v * f)) + " " + b + ".",
[G("1 " + a + " = combien de " + b + " ?", f, M(f) + " " + b + "."), G("Unité plus petite : on multiplie. " + M(cd(v, f)) + " = ?", v * f, M(T(v * f)) + " " + b + ".")],
f === 60 ? [X(v * 100, "1 " + a + " = 60 " + b + ", pas 100."), X(v + 60, "On multiplie par 60 : " + v + " fois 60.")] : [X(v * f / 10, "1 " + a + " = " + f + " " + b + " : il manque un zéro."), X(v * f * 10, "1 " + a + " = " + f + " " + b + " : un zéro de trop.")], { plain: true }); },
() => { const [a, b, f, bl, bh] = rp([["km", "m", 1000, 50, 950], ["h", "min", 60, 5, 55], ["kg", "g", 1000, 50, 950], ["m", "cm", 100, 5, 95], ["min", "s", 60, 5, 55]]), v = ri(1, f === 60 ? 3 : 9), w = ri(bl, bh); if (w % 5 && f === 60 && R.rand() < 0.5) return null;
return Q("Écris " + M(v + u(a) + "\\ " + w + u(b)) + " en " + b + ".", v * f + w, M(v + u(a) + " = " + T(v * f) + u(b)) + ", puis " + M(T(v * f) + " + " + w + " = " + T(v * f + w)) + " " + b + ".",
[G(v + " " + a + " = combien de " + b + " ?", v * f, M(T(v * f)) + " " + b + "."), G("Ajoute les " + w + " " + b + " : ?", v * f + w, M(T(v * f + w)) + " " + b + ".")],
[X(v * 100 + w, f === 60 ? "1 " + a + " = 60 " + b + ", pas 100." : "1 " + a + " = " + f + " " + b + "."), X(v + w, "Convertis d'abord les " + a + " en " + b + ".")]); },
() => { const [a, b, f, lo, hi] = rp([["m", "km", 1000, 2, 9], ["min", "h", 60, 2, 5], ["g", "kg", 1000, 2, 9], ["dL", "L", 10, 2, 9], ["s", "min", 60, 2, 9], ["cm", "m", 100, 2, 9]]), v = ri(lo, hi);
return Q("Convertis " + M(T(v * f) + u(a)) + " en " + b + ".", v, M("1" + u(b) + " = " + f + u(a)) + " : " + M(T(v * f) + " : " + f + " = " + v) + " " + b + ".",
[G("1 " + b + " = combien de " + a + " ?", f, M(f) + " " + a + "."), G("Unité plus grande : on divise. " + M(T(v * f) + " : " + f) + " = ?", v, M(v) + " " + b + ".")],
[X(v * f * f, "Vers une unité plus grande, on divise."), X(f === 60 ? v * 60 / 100 : v * 10, f === 60 ? "1 " + b + " = 60 " + a + ", pas 100." : "Compte bien les zéros.")]); },
],
2: [
() => { const [a, b, f, vs] = rp([["km", "m", 1000, [1.5, 2.5, 3.2, 0.8, 4.25, 1.75]], ["h", "min", 60, [1.5, 2.5, 0.5, 0.25, 0.75, 1.25]], ["kg", "g", 1000, [1.5, 2.4, 0.75, 0.25, 3.6]], ["L", "dL", 10, [1.5, 2.5, 0.5, 3.5]], ["m", "cm", 100, [1.35, 1.8, 2.5, 0.75, 1.62]]]), v = rp(vs);
return Q("Convertis " + M(dec(v) + u(a)) + " en " + b + ".", fx(v * f), M("1" + u(a) + " = " + f + u(b)) + " : " + M(cd(dec(v), f) + " = " + T(fx(v * f))) + " " + b + ".",
[G("1 " + a + " = combien de " + b + " ?", f, M(f) + " " + b + "."), G(M(cd(dec(v), f)) + " = ?", fx(v * f), M(T(fx(v * f))) + " " + b + ".")],
f === 60 ? [X(fx(v * 100), "1 h = 60 min : " + dec(v) + " h n'est pas " + T(fx(v * 100)) + " min."), X(Math.floor(v) * 60 + Math.round((v % 1) * 100), "Ce qui suit la virgule est une fraction d'heure : 0,5 h = 30 min, pas 50 min.")] : [X(fx(v * f / 10), "Il manque un rang."), X(fx(v * f * 10), "Un rang de trop.")], { plain: true }); },
() => { const [a, b, f, vs] = rp([["m", "km", 1000, [2500, 750, 1200, 3400, 250]], ["g", "kg", 1000, [1500, 750, 2250, 400]], ["cm", "m", 100, [135, 250, 75, 180]], ["dL", "L", 10, [15, 25, 5, 35]], ["min", "h", 60, [90, 150, 45, 30, 210]]]), v = rp(vs);
return Q("Convertis " + M(T(v) + u(a)) + " en " + b + ".", fx(v / f), M(T(v) + " : " + f + " = " + dec(fx(v / f))) + " " + b + ".",
[G("1 " + b + " = combien de " + a + " ?", f, M(f) + " " + a + "."), G("Unité plus grande : on divise. " + M(T(v) + " : " + f) + " = ?", fx(v / f), M(dec(fx(v / f))) + " " + b + ".")],
f === 60 ? [X(fx(v / 100), "1 h = 60 min, pas 100."), X(Math.floor(v / 60) + (v % 60) / 100, "Les minutes ne sont pas des centièmes d'heure : " + (v % 60) + " min = " + dec(fx((v % 60) / 60)) + " h.")] : [X(fx(v / f * 10), "Compte bien les rangs."), X(fx(v * f), "Vers une unité plus grande, on divise.")]); },
() => { const c = rp([["piste", (n) => "Une piste d'athlétisme mesure 400 m. Tu en fais " + M(n) + " tours. Combien de kilomètres parcours-tu ?", 400, [3, 5, 6, 7, 8, 9, 12], 1000, "km", "m"],
["bassin", (n) => "À la piscine, tu nages " + M(n) + " longueurs d'un bassin de 50 m. Combien de kilomètres nages-tu ?", 50, [10, 16, 24, 30, 36], 1000, "km", "m"],
["gourde", (n) => "Pendant un tournoi, tu remplis " + M(n) + " fois ta gourde de 7 dL. Combien de litres bois-tu ?", 7, [2, 3, 4, 5, 6], 10, "L", "dL"]]);
const n = rp(c[3]), t = n * c[2];
return Q(c[1](n), fx(t / c[4]), M(cd(n, c[2]) + " = " + T(t)) + " " + c[6] + " = " + M(dec(fx(t / c[4]))) + " " + c[5] + ".",
[G("Combien de " + c[6] + " en tout ?", t, M(T(t)) + " " + c[6] + "."), G("En " + c[5] + " ? (1 " + c[5] + " = " + c[4] + " " + c[6] + ")", fx(t / c[4]), M(dec(fx(t / c[4]))) + " " + c[5] + ".")],
[X(t, "C'est en " + c[6] + " ; on demande des " + c[5] + "."), X(fx(t / c[4] / 10), "1 " + c[5] + " = " + c[4] + " " + c[6] + " : compte bien les rangs.")], { ctx: "p8conv-" + c[0] }); },
],
3: [
() => { const [a, b, f, vs] = rp([["t", "kg", 1000, [2.4, 1.25, 0.8, 3.05]], ["km", "m", 1000, [0.35, 2.05, 1.08, 4.6]], ["kg", "g", 1000, [1.25, 0.08, 2.05, 0.65]], ["m", "cm", 100, [2.05, 0.08, 3.4, 1.07]]]), v = rp(vs);
return Q("Convertis " + M(dec(v) + u(a)) + " en " + b + ".", fx(v * f), M(cd(dec(v), f) + " = " + T(fx(v * f))) + " " + b + ".",
[G("1 " + a + " = combien de " + b + " ?", f, M(f) + " " + b + "."), G(M(cd(dec(v), f)) + " = ?", fx(v * f), M(T(fx(v * f))) + " " + b + ".")],
[X(fx(v * f / 10), "Il manque un rang : complète avec des zéros si besoin."), X(fx(v * f * 10), "Un rang de trop.")], { plain: true }); },
() => { const [a, b, f, A, B] = rp([["km", "m", 1000, [1.2, 2.5, 0.8, 3.4], [350, 450, 650, 280]], ["kg", "g", 1000, [1.5, 2.25, 0.75], [750, 250, 400]], ["L", "dL", 10, [1.5, 2, 0.5], [7, 3, 4]]]), x = rp(A), y = rp(B), R2 = fx(x * f + y);
return Q("Calcule en " + b + " : " + M(dec(x) + u(a) + " + " + y + u(b)), R2, M(dec(x) + u(a) + " = " + T(fx(x * f)) + u(b)) + " ; " + M(T(fx(x * f)) + " + " + y + " = " + T(R2)) + " " + b + ".",
[G(dec(x).replace("{,}", ",") + " " + a + " en " + b + " ?", fx(x * f), M(T(fx(x * f))) + " " + b + "."), G("Total en " + b + " ?", R2, M(T(R2)) + " " + b + ".")],
[X(fx(x + y), "Mets d'abord les deux mesures dans la même unité."), X(fx(x * f / 10 + y), "1 " + a + " = " + f + " " + b + ".")]); },
() => { const h1 = ri(7, 18), m1 = ri(5, 55), d = ri(35, 140), t2 = h1 * 60 + m1 + d, h2 = Math.floor(t2 / 60), m2 = t2 % 60; if (h2 > 22 || h2 === h1 || m2 === 0 || (m1 % 5 && R.rand() < 0.5)) return null;
const p2 = (x) => (x < 10 ? "0" + x : "" + x); const c = rp([["train", "Un train part à " + h1 + " h " + p2(m1) + " et arrive à " + h2 + " h " + p2(m2) + "."], ["match", "Un match commence à " + h1 + " h " + p2(m1) + " et se termine à " + h2 + " h " + p2(m2) + "."]]);
return Q(c[1] + " Combien de minutes dure-t-il ?", d, "De " + h1 + " h " + p2(m1) + " à " + (h1 + 1) + " h 00 : " + (60 - m1) + " min ; puis jusqu'à " + h2 + " h " + p2(m2) + " : " + (d - 60 + m1) + " min ; en tout " + M(d) + " min.",
[G("De " + h1 + " h " + p2(m1) + " à " + (h1 + 1) + " h 00 : combien de minutes ?", 60 - m1, M(60 - m1) + " min."), G("De " + (h1 + 1) + " h 00 à " + h2 + " h " + p2(m2) + " : combien de minutes ?", d - 60 + m1, M(d - 60 + m1) + " min."), G("En tout ?", d, M(d) + " min.")],
[X((h2 * 100 + m2) - (h1 * 100 + m1), "Une heure vaut 60 minutes : on ne soustrait pas les heures comme des centaines."), X(d - 60, "Compte toutes les heures entières.")], { ctx: "p8conv-" + c[0] }); },
],
} },

{ id: "p8probop", theme: "no", label: "Problèmes : choisir la bonne opération", ex: "6 \\text{ mois à } 35 \\text{ CHF} : \\; 6 \\cdot 35",
hint: "Demande-toi ce que tu cherches : un total (+ ou ·), une différence (−), une part égale ou « combien de fois » (:).",
lesson: ["Choisir l'opération", "Avant de calculer, on se demande ce que l'on cherche.", "On réunit ou on ajoute : addition. On compare (« de plus », « de moins ») ou on enlève : soustraction. On répète la même quantité : multiplication. On partage en parts égales : division.",
["6 mois à 35 CHF : \\(6 \\cdot 35 = 210\\) CHF", "84 CHF pour 4 amis : \\(84 : 4 = 21\\) CHF chacun", "Léa a 210 abonnés, Tom 37 de moins : \\(210 - 37 = 173\\)"], "« 3 fois plus » se calcule avec une multiplication ; « 37 de plus », avec une addition."],
lv: {
1: [
() => { const c = rp([["streaming", (p, m) => "Un abonnement de musique coûte " + M(p) + " CHF par mois. Combien coûte-t-il pour " + M(m) + " mois ?", [11, 13, 15, 17], [3, 4, 6, 7, 8]],
["ballons", (p, m) => "Un entraîneur achète " + M(m) + " ballons à " + M(p) + " CHF pièce. Combien paie-t-il ?", [18, 24, 29, 35], [4, 6, 8, 9]],
["bus", (p, m) => "Pour aller au collège, Noah prend le bus " + M(m) + " fois par semaine ; chaque trajet dure " + M(p) + " minutes. Combien de minutes passe-t-il dans le bus par semaine ?", [12, 14, 18, 23], [6, 8, 10]]]);
const p = rp(c[2]), m = rp(c[3]); return Q(c[1](p, m), p * m, "On répète " + m + " fois la même quantité : " + M(cd(m, p) + " = " + p * m) + ".",
[G("Quelle opération ? Calcule " + M(cd(m, p)) + ".", p * m, M(p * m) + ".")], [X(p + m, "On répète " + m + " fois " + p + " : c'est une multiplication."), X(p * m - p, "Compte " + m + " fois " + p + ".")], { ctx: "p8pb-" + c[0] }); },
() => { const c = rp([["addition", (N, k) => M(k) + " amis partagent l'addition de " + M(N) + " CHF à parts égales. Combien paie chacun ?", [3, 4, 5, 6]],
["terrain", (N, k) => "La location d'un terrain de foot coûte " + M(N) + " CHF ; " + M(k) + " joueurs se partagent le prix. Combien paie chacun ?", [8, 10, 12]],
["cadeau", (N, k) => "Un cadeau commun coûte " + M(N) + " CHF. On est " + M(k) + " à payer la même part. Combien paie chacun ?", [4, 5, 6]]]);
const k = rp(c[2]), q = ri(9, 24), N = k * q; return Q(c[1](N, k), q, "On partage en " + k + " parts égales : " + M(N + " : " + k + " = " + q) + " CHF.",
[G("Quelle opération ? Calcule " + M(N + " : " + k) + ".", q, M(q) + " CHF.")], [X(N - k, "On partage en parts égales : c'est une division."), X(N * k, "Chacun paie moins que le total.")], { ctx: "p8pb-" + c[0] }); },
() => { const plus = R.rand() < 0.5, a = ri(1200, 4800), b = ri(120, 690); const c = rp([["stade", (x, y) => "Samedi, " + M(T(x)) + " spectateurs ont assisté au match. Dimanche, il y en a " + M(y) + (plus ? " de plus" : " de moins") + ". Combien de spectateurs dimanche ?"],
["course", (x, y) => "L'an passé, " + M(T(x)) + " personnes ont couru la course de l'Escalade dans ta catégorie. Cette année, il y en a " + M(y) + (plus ? " de plus" : " de moins") + ". Combien de coureurs cette année ?"]]);
return Q(c[1](a, b), plus ? a + b : a - b, (plus ? "« De plus » : addition, " + M(T(a) + " + " + b + " = " + T(a + b)) : "« De moins » : soustraction, " + M(T(a) + " - " + b + " = " + T(a - b))) + ".",
[G("Quelle opération ? Calcule " + M(T(a) + (plus ? " + " : " - ") + b) + ".", plus ? a + b : a - b, M(T(plus ? a + b : a - b)) + ".")], [X(plus ? a - b : a + b, plus ? "« De plus » : il y en a davantage." : "« De moins » : il y en a moins.")], { ctx: "p8pb-" + c[0] }); },
],
2: [
() => { const k = ri(3, 6), a = 10 * ri(25, 180); const c = rp([["abonnes", "Léa a " + M(k) + " fois plus d'abonnés que Tom, qui en a " + M(T(a)) + ". Combien d'abonnés a Léa ?"], ["recette", "Cette année, la fête de l'école a rapporté " + M(k) + " fois plus que l'an passé, où elle avait rapporté " + M(T(a)) + " CHF. Combien a-t-elle rapporté cette année, en CHF ?"]]);
return Q(c[1], k * a, "« " + k + " fois plus » : multiplication, " + M(cd(T(a), k) + " = " + T(k * a)) + ".",
[G("Quelle opération ? Calcule " + M(cd(T(a), k)) + ".", k * a, M(T(k * a)) + ".")], [X(a + k, "« " + k + " fois plus » : on multiplie par " + k + "."), X(a / k, "Il y en a plus, pas moins.")], { ctx: "p8pb-" + c[0] }); },
() => { const S0 = [["le Salève", 1379], ["la Dôle", 1677], ["le Moléson", 2002], ["le Chasseral", 1607], ["le Pilatus", 2128]], S1 = [["le Mont-Blanc", 4806], ["le Cervin", 4478], ["la Dent Blanche", 4357], ["l'Eiger", 3967]];
const [n0, h0] = rp(S0), [n1, h1] = rp(S1); return Q(n1[0].toUpperCase() + n1.slice(1) + " culmine à " + M(T(h1)) + " m et " + n0 + " à " + M(T(h0)) + " m. De combien de mètres " + n1 + " est-" + (/^la /.test(n1) ? "elle" : "il") + " plus haut" + (/^la /.test(n1) ? "e" : "") + " ?", h1 - h0, "On compare : soustraction, " + M(T(h1) + " - " + T(h0) + " = " + T(h1 - h0)) + " m.",
[G("Quelle opération ? Calcule " + M(T(h1) + " - " + T(h0)) + ".", h1 - h0, M(T(h1 - h0)) + " m.")], [X(h1 + h0, "On compare deux hauteurs : c'est une soustraction.")], { ctx: "p8pb-sommets" }); },
() => { const c = rp([["snack", (a, b) => "Au snack, tu choisis un sandwich parmi " + M(a) + " et une boisson parmi " + M(b) + ". Combien de menus différents peux-tu composer ?"],
["tenue", (a, b) => "Pour un match, l'équipe a " + M(a) + " maillots différents et " + M(b) + " shorts différents. Combien de tenues différentes peut-elle composer ?"],
["avatar", (a, b) => "Dans un jeu, tu crées ton avatar : une coiffure parmi " + M(a) + " et une tenue parmi " + M(b) + ". Combien d'avatars différents peux-tu créer ?"]]);
const a = ri(3, 7), b = ri(3, 6); if (a === b) return null; return Q(c[1](a, b), a * b, "Pour chacun des " + a + " premiers choix, il y a " + b + " seconds choix : " + M(cd(a, b) + " = " + a * b) + ".",
[G("Pour un seul premier choix, combien de possibilités ?", b, M(b) + "."), G("Pour les " + a + " premiers choix : ?", a * b, M(cd(a, b) + " = " + a * b) + ".")], [X(a + b, "Chaque premier choix se combine avec chaque second : c'est une multiplication.")], { ctx: "p8pb-" + c[0] }); },
],
3: [
() => { const dep = ri(1505, 3490) / 100, rest = ri(1205, 6890) / 100; const D = Math.round(dep * 20) / 20, Rr = Math.round(rest * 20) / 20; if (Number.isInteger(D) || Number.isInteger(Rr)) return null;
const c = rp([["achat", "Après avoir dépensé " + C(D) + " pour un jeu, il reste " + C(Rr) + " à Sami. Combien avait-il avant, en CHF ?"], ["sortie", "Après une sortie au bowling à " + C(D) + ", il reste " + C(Rr) + " à Inès. Combien avait-elle avant, en CHF ?"]]);
return Q(c[1], D + Rr, "Avant = dépense + reste : " + M(chf(D) + " + " + chf(Rr) + " = " + chf(D + Rr)) + " CHF.",
[G("Avant la dépense, il y avait plus d'argent : calcule " + M(chf(Rr) + " + " + chf(D)) + ".", D + Rr, C(D + Rr) + ".")], [X(Math.abs(Rr - D), "Avant la dépense, il avait plus : on additionne.")], { ctx: "p8pb-" + c[0] }); },
() => { const k = rp([6, 8, 10, 12, 20]), p = ri(42, 98) / 20; if (Number.isInteger(p)) return null; const N = fx(k * p); const c = rp([["trajets", "Une carte de " + M(k) + " trajets en bus coûte " + C(N) + ". Combien coûte un trajet ?"], ["cours", "Un abonnement de " + M(k) + " entrées à la patinoire coûte " + C(N) + ". Combien coûte une entrée ?"]]);
return Q(c[1], p, "On partage le prix en " + k + " : " + M(chf(N) + " : " + k + " = " + chf(p)) + " CHF.",
[G("Quelle opération ? Calcule " + M(chf(N) + " : " + k) + ".", p, C(p) + ".")], [X(N * k, "Un trajet coûte moins que la carte entière."), X(N - k, "On partage en " + k + " parts égales : c'est une division.")], { ctx: "p8pb-" + c[0] }); },
() => { const n = ri(2, 4), p = rp([35, 45, 49, 55, 65]), B = n * p < 100 ? 100 : 200; const c = rp([["concert", "Tu achètes " + M(n) + " places de concert à " + M(p) + " CHF et tu paies avec " + M(B) + " CHF. Combien te rend-on ?"], ["patins", "Tu loues " + M(n) + " paires de skis à " + M(p) + " CHF et tu paies avec " + M(B) + " CHF. Combien te rend-on ?"]]);
if (n * p >= B) return null;
return Q(c[1], B - n * p, "Prix : " + M(cd(n, p) + " = " + n * p) + " CHF ; monnaie : " + M(B + " - " + n * p + " = " + (B - n * p)) + " CHF.",
[G("Combien coûtent les " + n + " ?", n * p, M(n * p) + " CHF."), G("Combien te rend-on ?", B - n * p, M(B - n * p) + " CHF.")], [X(B - p, "Il y a " + n + " places à payer, pas une."), X(n * p, "C'est le prix ; on demande la monnaie.")], { ctx: "p8pb-" + c[0] }); },
],
} },
];

for (const d of DEFS) {
if (!NOTIONS.some((x) => x.id === d.id)) NOTIONS.push({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: [8], MP: null, FR: null, prim: true });
GEN[d.id] = (lv) => pickForm(d.lv[Math.min(Math.max(lv || 1, 1), 3)]);
if (typeof VAR !== "undefined") VAR[d.id] = {};
HINTS_EXTRA[d.id] = d.hint;
LESSONS_EXTRA[d.id] = d.lesson;
}
})();






const PRIM = {
off: false,
RATE: 0.4, ELO: 875, ELO2: 925, ACQ: 2,
isPrim(id) { return PRIM_IDS.includes(String(id).split("|")[0]); },








applies(state) {
const p = state && state.profile;
if (PRIM.off || !p || p.system !== "CH" || p.grade !== 9 || p.track === "mp" || !Engine.struggling(state)) return false;
const L = state.last1 || [], r = L.length ? L.reduce((a, b) => a + b, 0) / L.length : null;
const early = L.length < 5 && (state.placeMiss || 0) >= 3, rateOk = early ? r === null || r <= 0.5 : L.length >= 5 && r <= PRIM.RATE;
return rateOk && (state.elo.r <= PRIM.ELO || (state.elo.r <= PRIM.ELO2 && (early || Engine.underFloor(state) || PRIM.strugLong(state))));
},

note(state) {
if (!state || !state.profile || state.profile.grade !== 9) return;
const t = day(), D = (Array.isArray(state.strugDays) ? state.strugDays : []).filter((x) => x !== t && x >= addDays(t, -7));
state.strugDays = Engine.struggling(state) ? [...D, t].slice(-3) : [];
},
strugLong(state) { return Array.isArray(state.strugDays) && state.strugDays.length >= 2; },
acquired(state, id) { const s = state.notions[id]; return !!s && (s.box || 0) >= PRIM.ACQ; },
ensure(state, id) {
if (!state.notions[id]) state.notions[id] = Object.assign(Engine.newNotion("prim"), { m: 0.5, lessonSeen: true });
return state.notions[id];
},


candidates(state) {
const coince = (s) => !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2), out = [];
const failing = Object.keys(PRIM_PRE).filter((id) => coince(state.notions[id])).sort((a, b) => state.notions[a].m - state.notions[b].m);
for (const id of failing) for (const p of PRIM_PRE[id]) if (!out.includes(p) && !PRIM.acquired(state, p)) out.push(p);
const last = state.primLast || [];
return [...out.filter((p) => !last.includes(p)), ...out.filter((p) => last.includes(p))];
},
strip(plan) { if (!Array.isArray(plan)) return plan; const out = plan.filter((e) => !PRIM.isPrim(e)); for (const k of Object.keys(plan)) if (isNaN(+k)) out[k] = plan[k]; return out; },



inject(state, plan) {
if (!Array.isArray(plan) || plan.length < 2 || !PRIM.applies(state)) return plan;
const want = Engine.underFloor(state) && plan.length >= 4 ? 2 : 1, cands = PRIM.candidates(state), used = [];
for (let i = 0; i < want && cands.length; i++) {
const pos = plan.length - 1 - i, old = String(plan[pos]).split("|"), kind = old[2];
if (pos < 1 || PRIM.isPrim(old[0])) continue;
const c = cands.find((p) => !used.includes(p) && !plan.some((e) => String(e).split("|")[0] === p) && (kind !== "drill" || Engine.drillable(state, p)));
if (!c) continue;
PRIM.ensure(state, c);
plan[pos] = c + "|1" + (kind ? "|" + (kind === "defi" || kind === "defi4" ? "app" : kind) : "");
used.push(c);
}
if (used.length) { state.primLast = used; state.primN = (state.primN || 0) + used.length; }
return plan;
},





vary(state, plan) {
const p = state && state.profile;
if (!Array.isArray(plan) || plan.length < 3 || !PRIM.applies(state)) return plan;
const idOf = (e) => String(e).split("|")[0], cnt = {};
for (let i = 0; i < plan.length; i++) {
const e = String(plan[i]), id = idOf(e), kind = e.split("|")[2];
if (e.startsWith("PROB:") || PRIM.isPrim(id)) continue;
cnt[id] = (cnt[id] || 0) + 1;
if (cnt[id] <= 2) continue;


const pool = [...(PRIM_PRE[id] || []), ...PRIM.candidates(state), ...PRIM_IDS].filter((x) => !PRIM.acquired(state, x));
const c = pool.find((x) => !plan.some((y) => idOf(y) === x) && (kind !== "drill" || Engine.drillable(state, x)));
if (!c) { plan.splice(i, 1); i--; continue; }
PRIM.ensure(state, c);
plan[i] = c + "|1" + (kind ? "|" + (kind === "defi" || kind === "defi4" ? "app" : kind) : "");
state.primN = (state.primN || 0) + 1;
}
return plan;
},
};


































































































const REF_CO = {
niv: ["tous"],
th: ["Espace", "Nombres", "Opérations", "Grandeurs et mesures"],
no: ["Éléments pour la résolution de problèmes", "Figures géométriques planes", "Solides", "Transformations géométriques", "Repérage dans le plan et dans l'espace", "Nombres", "Calculs", "Fonctions", "Diagrammes", "Algèbre – Calcul littéral", "Algèbre – Équations", "Mesure de grandeurs et conversion d'unités", "Calcul de grandeurs"],
c: [
["31-RP", 0, 0, 0, "Résoudre des problèmes géométriques (figures, transformations)", 9, 11],
["31-FG1", 0, 0, 1, "Reconnaître, décrire et construire triangles, quadrilatères et cercles (côtés, angles, diagonales, symétries)", 9, 10],
["31-FG2", 0, 0, 1, "Reconnaître, décrire et construire des polygones réguliers", 10, 11],
["31-FG3", 0, 0, 1, "Reconnaître et nommer les angles (aigu, obtus, droit, plat)", 9, 9],
["31-FG4", 0, 0, 1, "Parallèles, perpendiculaires, hauteur, médiatrice, bissectrice, médiane : propriétés et construction", 9, 10],
["31-FG5", 0, 0, 1, "Tangente, angle au centre, angle inscrit, angles isométriques, cercle de Thalès", 11, 11],
["31-FG6", 0, 0, 1, "Représenter une figure par un croquis ou un dessin à l'échelle", 9, 11],
["31-SO1", 0, 0, 2, "Reconnaître et décrire cube, pavé, prisme droit, cylindre, pyramide (faces, arêtes, sommets)", 9, 10],
["31-SO2", 0, 0, 2, "Reconnaître et décrire le cône et la sphère", 11, 11],
["31-SO3", 0, 0, 2, "Réaliser le développement d'un cube, d'un pavé, d'un prisme droit", 9, 10],
["31-SO4", 0, 0, 2, "Réaliser le développement d'un cylindre, d'une pyramide régulière", 11, 11],
["31-SO5", 0, 0, 2, "Représenter un solide en perspective", 9, 11],
["31-TR1", 0, 0, 3, "Reconnaître et nommer les isométries : translation, symétries axiale et centrale, rotation", 9, 10],
["31-TR2", 0, 0, 3, "Identifier les caractéristiques d'une isométrie (vecteur, axe, centre, angle)", 9, 10],
["31-TR3", 0, 0, 3, "Identifier les caractéristiques d'une homothétie (centre, rapport)", 11, 11],
["31-TR4", 0, 0, 3, "Anticiper la position d'une figure après une ou plusieurs isométries", 9, 11],
["31-TR5", 0, 0, 3, "Réaliser des frises et des pavages", 9, 11],
["31-TR6", 0, 0, 3, "Construire l'image d'une figure par une isométrie", 9, 10],
["31-TR7", 0, 0, 3, "Agrandir et réduire une figure (proportionnalité)", 10, 10],
["31-TR8", 0, 0, 3, "Construire l'image d'une figure par une homothétie", 11, 11],
["31-RE", 0, 0, 4, "Se repérer dans le plan et dans l'espace (placer des points, coordonnées)", 9, 11],
["32-RP", 0, 1, 0, "Résoudre des problèmes numériques (traduire l'énoncé en calcul)", 9, 11],
["32-CALC", 0, 1, 0, "Utiliser la calculatrice (parenthèses, mémoire, puissance, racine)", 9, 11],
["32-AL1", 0, 1, 0, "Explorer des situations aléatoires (dénombrer les possibilités)", 10, 11],
["32-AL2", 0, 1, 0, "Calculer des probabilités", 11, 11],
["32-NB1", 0, 1, 5, "Critères de divisibilité, multiples et diviseurs", 9, 9],
["32-NB2", 0, 1, 5, "PPMC, PGDC, nombres premiers, décomposition en facteurs premiers", 9, 10],
["32-NB3", 0, 1, 5, "Passer d'une écriture d'un nombre à une autre (décimale, fraction, pourcentage)", 9, 11],
["32-NB4", 0, 1, 5, "Comparer, encadrer, arrondir des entiers relatifs et des décimaux ; les placer sur une droite", 9, 9],
["32-NB5", 0, 1, 5, "Comparer et encadrer des fractions, des pourcentages ; simplifier, amplifier", 9, 10],
["32-NB6", 0, 1, 5, "Comparer et estimer des puissances", 9, 10],
["32-NB7", 0, 1, 5, "Notation scientifique : écrire, comparer, ordre de grandeur", 10, 11],
["32-NB8", 0, 1, 5, "Encadrer et comparer des racines carrées et cubiques", 10, 11],
["32-NB9", 0, 1, 5, "Distinguer les ensembles de nombres ; découvrir des irrationnels", 9, 11],
["32-NB10", 0, 1, 5, "Explorer des systèmes de numération (romain, égyptien, binaire…)", 9, 11],
["32-CA1", 0, 1, 6, "Priorités des opérations (parenthèses comprises)", 9, 10],
["32-CA2", 0, 1, 6, "Utiliser les propriétés des opérations pour calculer efficacement et estimer", 9, 10],
["32-CA3", 0, 1, 6, "Règles de calcul des puissances", 10, 10],
["32-CA4", 0, 1, 6, "Propriétés des racines carrées (et cubiques), extraction d'entiers", 11, 11],
["32-CA5", 0, 1, 6, "Calculer avec des nombres décimaux positifs (+, −, ×, :)", 9, 11],
["32-CA6", 0, 1, 6, "Calculer avec des nombres relatifs (+, −, ×, :)", 9, 11],
["32-CA7", 0, 1, 6, "Additionner et soustraire des fractions", 9, 10],
["32-CA8", 0, 1, 6, "Multiplier et diviser des fractions, fractions relatives", 10, 11],
["32-CA9", 0, 1, 6, "Extraire la racine d'un carré parfait", 10, 11],
["33-RP", 0, 2, 0, "Résoudre des problèmes (fonctions, diagrammes, expressions, équations)", 9, 11],
["33-PR1", 0, 2, 0, "Proportionnalité : prix, poids, devises, agrandissements", 9, 10],
["33-PR2", 0, 2, 0, "Proportionnalité : échelle, pourcentage, pente", 10, 11],
["33-PR3", 0, 2, 0, "Proportionnalité : vitesse moyenne, masse volumique, débit", 11, 11],
["33-FO1", 0, 2, 7, "Reconnaître une situation qui se modélise par une fonction", 9, 11],
["33-FO2", 0, 2, 7, "Lire et interpréter un tableau de valeurs, un graphique", 9, 11],
["33-FO3", 0, 2, 7, "Représenter une relation par un tableau, un graphique, un opérateur ; passer de l'un à l'autre", 9, 11],
["33-FO4", 0, 2, 7, "De l'expression fonctionnelle au tableau de valeurs et au graphique", 10, 11],
["33-FO5", 0, 2, 7, "Du graphique à l'expression fonctionnelle (x → ax + b)", 11, 11],
["33-DI1", 0, 2, 8, "Lire et interpréter des données et des diagrammes", 9, 11],
["33-DI2", 0, 2, 8, "Réaliser un diagramme cartésien, en colonnes", 9, 9],
["33-DI3", 0, 2, 8, "Réaliser un diagramme circulaire, en barre", 10, 11],
["33-DI4", 0, 2, 8, "Utiliser un tableur, un grapheur", 9, 11],
["33-LI1", 0, 2, 9, "Règles et conventions d'écriture algébrique", 10, 11],
["33-LI2", 0, 2, 9, "Calculer la valeur d'une expression littérale", 9, 11],
["33-LI3", 0, 2, 9, "Écrire une expression littérale (énoncé, figure, phrase)", 10, 11],
["33-LI4", 0, 2, 9, "Interpréter des expressions et reconnaître des expressions équivalentes", 10, 11],
["33-LI5", 0, 2, 9, "Réduire et ordonner monômes et polynômes", 10, 11],
["33-LI6", 0, 2, 9, "Additionner, soustraire, multiplier des monômes", 10, 10],
["33-LI7", 0, 2, 9, "Additionner, soustraire, multiplier des polynômes (développer)", 10, 11],
["33-LI8", 0, 2, 9, "Identités remarquables de degré 2", 11, 11],
["33-LI9", 0, 2, 9, "Factoriser un polynôme", 11, 11],
["33-LI10", 0, 2, 9, "Prouver avec le calcul littéral", 11, 11],
["33-EQ1", 0, 2, 10, "Traduire un problème par une équation du premier degré", 10, 11],
["33-EQ2", 0, 2, 10, "Traduire un problème par un système de deux équations", 11, 11],
["33-EQ3", 0, 2, 10, "Traduire un problème par une équation du deuxième degré", 11, 11],
["33-EQ4", 0, 2, 10, "Résoudre une équation du premier degré", 10, 11],
["33-EQ5", 0, 2, 10, "Résoudre un système de deux équations (combinaison, substitution)", 11, 11],
["33-EQ6", 0, 2, 10, "Résoudre une équation du deuxième degré (factorisation, formule)", 11, 11],
["33-EQ7", 0, 2, 10, "Exprimer une variable d'une formule en fonction des autres", 11, 11],
["34-RP", 0, 3, 0, "Résoudre des problèmes de mesurage", 9, 11],
["34-ME1", 0, 3, 11, "Comparer, classer et mesurer des grandeurs (longueur, aire, volume, angle, masse)", 9, 11],
["34-ME2", 0, 3, 11, "Estimer et convertir longueurs, masses, aires", 9, 9],
["34-ME3", 0, 3, 11, "Estimer et convertir volumes, capacités, durées", 10, 11],
["34-ME4", 0, 3, 11, "Vitesse, débit, masse volumique : unités", 11, 11],
["34-ME5", 0, 3, 11, "Unités d'autres cultures et d'autrefois (mile, pouce, coudée…)", 9, 11],
["34-CG1", 0, 3, 12, "Périmètre d'un polygone", 9, 9],
["34-CG2", 0, 3, 12, "Aire du carré, du rectangle, du triangle, du parallélogramme, du losange", 9, 9],
["34-CG3", 0, 3, 12, "Aire et périmètre par décomposition en figures simples", 9, 11],
["34-CG4", 0, 3, 12, "Périmètre et aire du disque", 10, 10],
["34-CG5", 0, 3, 12, "Longueur d'un arc, aire d'un secteur", 10, 11],
["34-CG6", 0, 3, 12, "Volume et aire du cube et du pavé", 9, 9],
["34-CG7", 0, 3, 12, "Volume et aire d'un prisme droit", 9, 11],
["34-CG8", 0, 3, 12, "Volume et aire du cylindre", 10, 11],
["34-CG9", 0, 3, 12, "Volume et aire d'une pyramide, volume d'un cône et d'une sphère", 11, 11],
["34-CG10", 0, 3, 12, "Volume d'un solide décomposé en solides simples", 10, 11],
["34-CG11", 0, 3, 12, "Calculer une grandeur manquante (hauteur à partir de l'aire…)", 10, 11],
["34-CG12", 0, 3, 12, "Utiliser le théorème de Pythagore", 10, 11],
["34-CG13", 0, 3, 12, "Figures semblables et théorème de Thalès", 11, 11]
],

q: {"31-FG1":["quadri","angtri"],"31-FG2":["polyreg"],"31-FG3":["angtype"],"31-FG5":["angles","cercthales"],"31-SO1":["solides"],"31-SO2":["volcone"],"31-TR1":["isom@12"],"31-TR2":["rotation@12"],"31-TR3":["simil"],"31-TR4":["isom@13"],"31-TR6":["symetries","rotation@3"],"31-TR7":["agrand"],"31-TR8":["simil"],"31-RE":["repere","repere3d"],"32-RP":["decprob","tradexpr"],"32-AL1":["denombr"],"32-AL2":["proba"],"32-NB1":["divcrit","multdiv"],"32-NB2":["premiers","arith"],"32-NB3":["decread","fracconv","fracper"],"32-NB4":["relrep","deccomp","decarr"],"32-NB5":["fracrep","fracsimp"],"32-NB6":["pow9"],"32-NB7":["sci"],"32-NB8":["racenc","rac@2"],"32-NB9":["ensco"],"32-NB10":["numer"],"32-CA1":["prio"],"32-CA2":["ordgr","dec10"],"32-CA3":["puiss","scicalc"],"32-CA4":["racprop"],"32-CA5":["decadd","decmul","decdiv"],"32-CA6":["reladd","rel"],"32-CA7":["fracadd"],"32-CA8":["fracmul","fracops","fractout"],"32-CA9":["carres","rac@1"],"33-PR1":["proptab","prop","change"],"33-PR2":["echelle","pct","pctvar","pente"],"33-PR3":["vitesse","gquot"],"33-FO1":["fctlec@23"],"33-FO2":["fctlec@13"],"33-FO4":["tabval","affine@13"],"33-FO5":["affine@2"],"33-DI1":["diagr@13"],"33-DI3":["diagr@2"],"33-LI1":["litconv@1"],"33-LI2":["valnum"],"33-LI3":["litelab"],"33-LI4":["litconv@23"],"33-LI5":["reduire"],"33-LI6":["monomes"],"33-LI7":["distrib","parenth"],"33-LI8":["idrem"],"33-LI9":["factor"],"33-EQ1":["probeq@12"],"33-EQ2":["sysprob"],"33-EQ3":["probeq2","probeq@3"],"33-EQ4":["eq1","eqfrac","eqverif@12"],"33-EQ5":["sys2"],"33-EQ6":["eq2","eq2fact","eq2disc","eqverif@3"],"33-EQ7":["formule"],"34-RP":["ulong@3"],"34-ME2":["ulong","uaire"],"34-ME3":["uvol","utemps"],"34-ME4":["ucomp"],"34-CG1":["perim"],"34-CG2":["aire1","aire2"],"34-CG3":["aire3","perim@3"],"34-CG4":["disque@12"],"34-CG5":["disque@3"],"34-CG6":["volpave","vol@1"],"34-CG7":["vol@2","airelat@1"],"34-CG8":["vol@3","airelat@23"],"34-CG9":["volcone","airepyr"],"34-CG10":["voldecomp","volcomp"],"34-CG11":["grandmanq","volmanq"],"34-CG12":["pyth","pythfig","pythrec"],"34-CG13":["simil","thales","thalesrec"]},



f: {"31-FG1":{"angtri":["quadrilatere","isocele","triangle","sommet","parallelogramme","exterieur","proportion","trois-egaux","trapeze","ecarts"]}},
};








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

const VF = (o, pool, k = 3) => { const L = sh(pool).slice(0, k).map((f) => f());
return X({ id: o.id, lv: o.lv || 2, titre: o.titre || "Vrai ou faux ?", q: o.q || "Pour chaque affirmation, dis si elle est vraie ou fausse, puis justifie (un calcul, un exemple ou un contre-exemple).",
parts: L.map((x) => ({ label: "« " + x[0] + " »", pts: 1 })), sol: ul(L.map((x) => "<b>" + (x[1] ? "Vrai" : "Faux") + ".</b> " + x[2])), chk: L.map((x) => [typeof x[1] === "boolean", "VF booléen"]), vals: [] }); };
const two = (n) => (n < 10 ? "0" : "") + n;
const hm = (m) => Math.floor(m / 60) + " h " + two(m % 60);
const dur = (m) => (m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + two(m % 60) + " min" : "") : m + " min");
const fmt = (v) => String(r6(v)).replace(".", ",");

const svg = (w, h, body, label) => "<svg class=\"fig\" viewBox=\"0 0 " + w + " " + h + "\" role=\"img\" aria-label=\"" + (label || "figure") + "\" xmlns=\"http://www.w3.org/2000/svg\">" + body + "</svg>";
const tx = (x, y, s, cls = "f-txt", anchor = "middle", size = 13) => "<text x=\"" + r6(x) + "\" y=\"" + r6(y) + "\" class=\"" + cls + "\" text-anchor=\"" + anchor + "\" font-size=\"" + size + "\">" + s + "</text>";
const ln = (x1, y1, x2, y2, cls = "f-line", extra = "") => "<line x1=\"" + r6(x1) + "\" y1=\"" + r6(y1) + "\" x2=\"" + r6(x2) + "\" y2=\"" + r6(y2) + "\" class=\"" + cls + "\" " + extra + "/>";
const pg = (pts, cls = "f-shape") => "<polygon points=\"" + pts.map((p) => r6(p[0]) + "," + r6(p[1])).join(" ") + "\" class=\"" + cls + "\"/>";

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

function bars(labels, values, ylab) {
const max = Math.max(...values), n = values.length, w = 280 / n, top = Math.ceil(max / 5) * 5, H = 130;
let g = ln(30, 150, 315, 150) + ln(30, 150, 30, 12);
for (let v = 0; v <= top; v += top > 20 ? 5 : 2) { const y = 150 - (v / top) * H; g += ln(26, y, 315, y, "", "stroke=\"var(--line)\" stroke-width=\"0.6\"") + tx(23, y + 4, v, "f-txt", "end", 10); }
values.forEach((v, i) => { const hh = (v / top) * H; g += "<rect x=\"" + r6(34 + i * w + 4) + "\" y=\"" + r6(150 - hh) + "\" width=\"" + r6(w - 10) + "\" height=\"" + r6(hh) + "\" class=\"f-fill2\"/>" + tx(34 + i * w + w / 2 - 1, 166, labels[i], "f-txt", "middle", 11); });
return svg(320, 176, g + (ylab ? tx(34, 10, ylab, "f-txt", "start", 10) : ""), "diagramme en bâtons");
}

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


const EXD = [

() => { const L = sh([["pommes", 3.4], ["tomates", 4.8], ["carottes", 2.6], ["cerises", 9.8], ["abricots", 6.4], ["poires", 4.2], ["courgettes", 3.8]]), P = L.slice(0, 3), E = L[3], q = sh([0.5, 1.5, 2, 2.5, 3]).slice(0, 3), w = who(), h = pk(["7 h 30", "8 h 15", "6 h 45"]);
const c = P.map((p, i) => r6(p[1] * q[i])), tot = r6(c[0] + c[1] + c[2]), bill = tot < 50 ? 50 : 100, rend = r6(bill - tot), est = c.reduce((s, x) => s + Math.round(x), 0), ex = r6(E[1] * 1.5), ok = ex <= rend;
return X({ id: "decprob", lv: 1, titre: "Au marché",
q: w.n + " fait les courses au marché, qui ouvre à " + h + ". Voici ses achats." + tab(["produit", "prix au kg", "quantité"], P.map((p, i) => [p[0], chf(p[1]), Q(q[i], "kg")])),
parts: [{ label: "Calcule le prix payé pour chaque produit.", pts: 3 }, { label: "Estime d'abord le total en arrondissant chaque prix au franc, puis calcule-le exactement.", pts: 2 }, { label: "Combien lui rend-on sur un billet de " + bill + " CHF ?", pts: 1 }, { label: "Avec cette monnaie, peut-" + w.il + " encore acheter " + Q(1.5, "kg") + " de " + E[0] + " à " + chf(E[1]) + " le kilo ? Justifie.", pts: 1 }],
sol: ul([P.map((p, i) => p[0] + " : " + M(N(p[1]) + " \\cdot " + N(q[i]) + " = " + Nk(c[i], 2)) + " CHF").join(" ; ") + ".", "Estimation : environ " + est + " CHF. Total exact : " + M(c.map((x) => Nk(x, 2)).join(" + ") + " = " + Nk(tot, 2)) + " CHF (proche de l'estimation). L'heure d'ouverture ne sert à rien.", M(bill + " - " + Nk(tot, 2) + " = " + Nk(rend, 2)) + " CHF.", M(N(E[1]) + " \\cdot 1{,}5 = " + Nk(ex, 2)) + " CHF : " + (ok ? "oui, car " + Nk(ex, 2) + " ≤ " + Nk(rend, 2) + "." : "non, car " + Nk(ex, 2) + " > " + Nk(rend, 2) + ".")]),
chk: [[Math.abs(tot - P.reduce((s, p, i) => s + p[1] * q[i], 0)) < 1e-9, "total"], [rend > 0, "monnaie positive"], [Math.abs(est - tot) < 3, "estimation proche"]], vals: [...c, tot, rend, ex] }); },

() => { const a = pk([4, 5]), V = pk([[0.9, 0.86, 0.09, 0.74, 0.7], [0.8, 0.75, 0.08, 0.68, 0.6], [0.6, 0.58, 0.06, 0.5, 0.47]]), names = sh(["Aya", "Ben", "Chloé", "David", "Emma", "Félix", "Gaïa"]).slice(0, 5);
const S = sh(V).map((d, i) => ({ n: names[i], v: r6(a + d) })), srt = S.slice().sort((x, y) => y.v - x.v), rd = (v) => Math.round(v * 10) / 10;
const groups = {}; S.forEach((s) => (groups[rd(s.v)] = (groups[rd(s.v)] || []).concat(s.n))); const same = Object.entries(groups).filter(([, l]) => l.length > 1);
const gap = Math.round((srt[0].v - srt[1].v) * 100), mid = Math.round(((srt[1].v + srt[2].v) / 2) * 100) / 100;
return X({ id: "deccomp", lv: 2, titre: "Le concours de saut en longueur",
q: "Voici les meilleurs sauts de cinq élèves (le vent soufflait à " + Q(1.2, "m/s") + ")." + tab(["élève", "saut (m)"], S.map((s) => [s.n, T(s.v)])),
parts: [{ label: "Range les sauts du plus long au plus court.", pts: 2 }, { label: "Arrondis chaque saut au dixième de mètre. Quels élèves ont le même arrondi ?", pts: 2 }, { label: "Combien de centimètres séparent le premier du deuxième ?", pts: 1 }, { label: "Un sixième élève saute plus loin que le 3e du classement, mais moins loin que le 2e. Donne une longueur possible, au centimètre.", pts: 1 }],
sol: ul([srt.map((s) => s.n + " (" + N(s.v) + ")").join(" > ") + ". Attention : " + N(a + V[0]) + " = " + Nk(a + V[0], 2) + " > " + Nk(a + V[1], 2) + " : on écrit le même nombre de décimales, puis on compare chiffre par chiffre.", S.map((s) => s.n + " : " + N(rd(s.v))).join(" ; ") + ". Même arrondi : " + same.map(([v, l]) => l.join(" et ") + " (" + N(+v) + " m)").join(" ; ") + ".", M(Nk(srt[0].v, 2) + " - " + Nk(srt[1].v, 2) + " = " + Nk(gap / 100, 2)) + " m, soit " + gap + " cm.", "Par exemple " + Q(mid, "m") + " (toute longueur strictement entre " + N(srt[2].v) + " m et " + N(srt[1].v) + " m convient)."]),
chk: [[same.length >= 1, "au moins un même arrondi"], [mid > srt[2].v && mid < srt[1].v, "encadrement"], [gap >= 2, "écart"]], vals: [gap, mid] }); },

() => { const m = pk([2.4, 2.8, 1.9, 3.1, 2.2, 2.6]), g1 = r6(m / 100), n1kg = 100000 / m, est = Math.round(n1kg / 1000) * 1000, sac = 25 * n1kg;
return X({ id: "dec10", lv: 2, titre: "Combien de grains de riz ?",
q: "Une balance de laboratoire indique que 100 grains de riz pèsent " + Q(m, "g") + ". Le paquet de riz coûte " + chf(pk([2.95, 3.4, 4.2])) + ".",
parts: [{ label: "Combien pèse un grain de riz, en grammes ? Et en milligrammes ?", pts: 2 }, { label: "Combien pèsent 1000 grains ? 10'000 grains ?", pts: 2 }, { label: "Environ combien de grains y a-t-il dans un paquet de 1 kg ? Arrondis au millier.", pts: 2 }, { label: "Un restaurant achète un sac de 25 kg. Donne l'ordre de grandeur du nombre de grains (dizaine de milliers, centaine de milliers, million… ?).", pts: 1 }],
sol: ul([M(N(m) + " : 100 = " + N(g1)) + " g, soit " + M(N(g1) + " \\cdot 1000 = " + N(r6(g1 * 1000))) + " mg.", M(N(m) + " \\cdot 10 = " + N(r6(m * 10))) + " g et " + M(N(m) + " \\cdot 100 = " + N(r6(m * 100))) + " g.", M("1000 : " + N(g1) + " \\approx " + N(est)) + " grains (1 kg = 1000 g). Le prix ne sert à rien.", M("25 \\cdot " + N(est) + " \\approx " + N(Math.round(sac / 1000) * 1000)) + " : environ <b>un million</b> de grains."]),
chk: [[Math.abs(g1 * 100 - m) < 1e-9, "÷100"], [sac > 600000 && sac < 1500000, "ordre du million"], [Math.abs(est - n1kg) <= 500, "arrondi au millier"]], vals: [g1, g1 * 1000, m * 10, m * 100, est] }); },

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


const EXU = [

() => { const dep0 = 6 * 60 + R.int(0, 5) * 5 + 20, gaps = [R.int(15, 25), R.int(20, 35), R.int(15, 30)], durs = sh([36, 42, 48, 53, 67]).slice(0, 4), w = who(), city = pk([["Genève", "Lausanne"], ["Genève", "Yverdon"], ["Lausanne", "Fribourg"], ["Neuchâtel", "Berne"]]);
const D = [dep0]; gaps.forEach((g) => D.push(D[D.length - 1] + g)); const Ar = D.map((d, i) => d + durs[i]);
const fast = durs.indexOf(Math.min(...durs)), k = R.int(1, 3), limit = Ar[k] + R.int(2, 6);
const okIdx = D.map((d, i) => i).filter((i) => Ar[i] <= limit), last = okIdx.reduce((b, i) => (D[i] > D[b] ? i : b), okIdx[0]), week = 5 * 2 * durs[fast];
return X({ id: "utemps", lv: 1, titre: "L'horaire du train",
q: w.n + " consulte l'horaire " + city[0] + " → " + city[1] + " (le billet coûte " + pk([18, 22, 25]) + " CHF)." + tab(["train", "départ", "arrivée"], D.map((d, i) => ["n° " + (i + 1), hm(d), hm(Ar[i])])),
parts: [{ label: "Calcule la durée de chaque trajet.", pts: 2 }, { label: "Quel train est le plus rapide ?", pts: 1 }, { label: w.n + " doit arriver au plus tard à " + hm(limit) + ". Quel est le dernier train qu'" + w.il + " peut prendre ?", pts: 1 }, { label: w.Il + " fait l'aller et le retour 5 jours par semaine, avec un trajet aussi long que le train le plus rapide. Combien de temps passe-t-" + w.il + " dans le train par semaine ? Donne la réponse en h et min.", pts: 2 }],
sol: ul([durs.map((d, i) => "n° " + (i + 1) + " : " + dur(d)).join(" ; ") + ".", "Le n° " + (fast + 1) + " (" + dur(durs[fast]) + ").", "Le n° " + (last + 1) + " (départ " + hm(D[last]) + ", arrivée " + hm(Ar[last]) + "). Le prix du billet ne sert à rien.", M("5 \\cdot 2 \\cdot " + durs[fast] + " = " + week) + " min " + M("= " + Math.floor(week / 60) + " \\cdot 60 + " + (week % 60)) + " min, soit " + dur(week) + "."]),
chk: [[Ar[last] <= limit && D.every((d, i) => Ar[i] > limit || D[i] <= D[last]), "dernier train"], [new Set(durs).size === 4, "durées distinctes"]], vals: [...durs, week] }); },

() => { const t = pk([1.8, 2.1, 1.65]), sc = pk([950, 1150, 870]), re = pk([340, 285, 410]), eau = pk([1.5, 2]), food = [pk([1, 2]), pk([300, 450, 750])], vide = pk([1.2, 1.35, 0.95]), lim = pk([8, 9, 10]);
const tot = r6(t + sc / 1000 + re / 1000 + eau + food[0] + food[1] / 1000 + vide), et = [pk([4.6, 5.3, 3.8]), pk([2800, 3450, 1950]), [pk([4, 5, 6]), pk([350, 75, 620])]], km = r6(et[0] + et[1] / 1000 + et[2][0] + et[2][1] / 1000), w = who();
return X({ id: "ulong", lv: 2, titre: "Le sac de randonnée",
q: w.n + " prépare son sac pour deux jours de marche : une tente de " + Q(t, "kg") + ", un sac de couchage de " + Q(sc, "g") + ", un réchaud de " + Q(re, "g") + ", " + Q(eau, "L") + " d'eau (" + M("1" + u("L")) + " d'eau pèse " + M("1" + u("kg")) + "), " + food[0] + " kg " + food[1] + " g de nourriture. Le sac vide pèse " + Q(vide, "kg") + ".",
parts: [{ label: "Exprime toutes les masses en kilogrammes.", pts: 2 }, { label: "Quelle est la masse du sac rempli ?", pts: 1 }, { label: "On conseille de ne pas porter plus de " + lim + " kg. " + w.Il + " respecte-t-" + w.il + " ce conseil ? Sinon, de combien dépasse-t-" + w.il + " ?", pts: 1 }, { label: "Les étapes mesurent " + Q(et[0], "km") + ", " + Q(et[1], "m") + " et " + et[2][0] + " km " + et[2][1] + " m. Quelle distance parcourt-" + w.il + " en tout, en km ?", pts: 2 }],
sol: ul(["Tente " + N(t) + " ; couchage " + N(sc / 1000) + " ; réchaud " + N(re / 1000) + " ; eau " + N(eau) + " ; nourriture " + N(r6(food[0] + food[1] / 1000)) + " ; sac vide " + N(vide) + " (en kg).", "Total : " + Q(tot, "kg") + ".", tot <= lim ? "Oui : " + N(tot) + " ≤ " + lim + "." : "Non : il dépasse de " + M(N(tot) + " - " + lim + " = " + N(r6(tot - lim))) + " kg.", M(N(et[0]) + " + " + N(et[1] / 1000) + " + " + N(r6(et[2][0] + et[2][1] / 1000)) + " = " + N(km)) + " km (attention : " + et[2][1] + " m = " + N(et[2][1] / 1000) + " km)."]),
chk: [[Math.abs(tot * 1000 - (t * 1000 + sc + re + eau * 1000 + food[0] * 1000 + food[1] + vide * 1000)) < 1e-6, "total g"], [tot !== lim, "pas égal"]], vals: [tot, km] }); },

() => { const L = pk([4.5, 5.2, 3.8, 6]), l = pk([3.2, 3.6, 4]), lw = pk([[120, 15], [90, 12], [140, 20]]), pack = pk([8, 10, 12]), w = who();
const Am = r6(L * l), Adm = r6(Am * 100), al = r6((lw[0] * lw[1]) / 100), n = Math.ceil(Adm / al - 1e-9), np = Math.ceil(n / pack);
return X({ id: "uaire", lv: 2, titre: "Le nouveau parquet",
q: "La chambre de " + w.n + " est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ", avec une fenêtre de " + Q(1.4, "m") + " de large. On la recouvre de lames de parquet de " + Q(lw[0], "cm") + " sur " + Q(lw[1], "cm") + ", vendues par paquets de " + pack + ".",
parts: [{ label: "Calcule l'aire de la chambre en m², puis en dm².", pts: 2 }, { label: "Calcule l'aire d'une lame en cm², puis en dm².", pts: 2 }, { label: "Combien de lames faut-il au minimum (sans tenir compte des chutes) ?", pts: 1 }, { label: "Combien de paquets faut-il acheter ?", pts: 1 }],
sol: ul([M(N(L) + " \\cdot " + N(l) + " = " + N(Am)) + " m² = " + Q(Adm, "dm^2") + " (1 m² = 100 dm²).", M(lw[0] + " \\cdot " + lw[1] + " = " + N(lw[0] * lw[1])) + " cm² = " + Q(al, "dm^2") + " (1 dm² = 100 cm²).", M(N(Adm) + " : " + N(al) + " \\approx " + N(Math.round((Adm / al) * 100) / 100)) + " : il faut " + n + " lames (on arrondit vers le haut). La largeur de la fenêtre ne sert à rien.", M(n + " : " + pack + " \\approx " + N(Math.round((n / pack) * 100) / 100)) + " : " + np + " paquets."]),
chk: [[n * al >= Adm && (n - 1) * al < Adm, "nb lames"]], vals: [Am, Adm, al, n, np] }); },

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



const perDec = (n, d) => { const ip = Math.floor(n / d); let r = n % d, s = "", seen = {}; while (r && seen[r] === undefined) { seen[r] = s.length; r *= 10; s += Math.floor(r / d); r %= d; } return r ? ip + "{,}" + s.slice(0, seen[r]) + "\\overline{" + s.slice(seen[r]) + "}" : ip + (s ? "{,}" + s : ""); };
const EXF = [
() => { const [n, f1, f2] = pk([[24, [1, 3], [3, 8]], [20, [2, 5], [1, 4]], [30, [2, 5], [1, 3]], [28, [3, 7], [1, 4]], [18, [4, 9], [1, 3]]] ), b = (n * f1[0]) / f1[1], p = (n * f2[0]) / f2[1], v = n - b - p, fv2 = fr(v, n);
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







(function () {


const nb = (v) => { const s = String(+(+v).toFixed(6)); const [i, d] = s.replace("-", "").split("."); return (+v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (d ? "," + d : ""); };
const n2 = (v) => (+v).toFixed(2).replace(".", ",");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
const P = (pts, cls = "f-shape") => `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" class="${cls}"/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const prop = (x, u = "") => " ; tu proposes <b>" + nb(x) + (u ? " " + u : "") + "</b>";


const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = o.ask ? null : o.start, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
const ctl = o.ask ? actAnswerHtml(o.label || "Ta réponse") : actStepper(o.label || "x", o.fmt ? o.fmt(x) : nb(x), "x");
box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
if (o.ask) {
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = String(+x.toFixed(6)).replace(".", ",");
const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/[\s'’]/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig, table") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
actAnswerBind(box, go);
} else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");


const digs = (v, n, u) => { const [ip, dp = ""] = String(+Math.abs(v).toFixed(6)).split(".");
return Array.from({ length: n }, (_, j) => (j <= u ? ip[ip.length - 1 - (u - j)] ?? "" : dp[j - u - 1] ?? "")); };
const tab = (heads, v, u, cap) => { const c = v === null ? heads.map(() => "") : digs(v, heads.length, u), bd = (j) => (j === u ? ";border-right:3px solid var(--ink)" : "");
return `<div class="act-out"><table style="margin:auto;border-collapse:collapse;font-size:13px"><tr>${heads.map((hd, j) => `<th style="padding:2px 4px;border:1px solid var(--line);font-weight:400;font-size:11px${bd(j)}">${hd}</th>`).join("")}</tr><tr>${c.map((d, j) => `<td style="padding:3px 4px;border:1px solid var(--line);text-align:center;min-width:18px;height:20px${bd(j)}"><b>${d}</b></td>`).join("")}</tr></table>${cap ? `<div style="text-align:center;margin-top:4px">${cap}</div>` : ""}</div>`; };
const NUM = ["D", "U", "d", "c", "m"];

const zl = (lo, hi, st, labs, pts = []) => { const X = (v) => (20 + ((v - lo) / (hi - lo)) * 280).toFixed(1); let g = L(12, 34, 308, 34);
const n = Math.round((hi - lo) / st); for (let k = 0; k <= n; k++) g += L(X(lo + k * st), 29, X(lo + k * st), 39, "f-line", 0.8);
for (const v of labs) g += L(X(v), 25, X(v), 43, "f-line", 1.6) + T(X(v), 58, nb(v), "middle", 11);
for (const [v, cls, lab] of pts) if (v >= lo - 1e-9 && v <= hi + 1e-9) g += `<circle cx="${X(v)}" cy="34" r="5" class="${cls}"/>` + (lab ? T(X(v), 17, lab, "middle", 11, cls === "f-dot" ? "f-txt f-accent" : "f-txt") : "");
return svg(320, 64, g, "droite graduée"); };

const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 34, 310, 34); for (let v = -12; v <= 12; v++) g += L(X(v), 30, X(v), 38, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 54, nb(v), "middle", 10));
g += `<circle cx="${X(from)}" cy="34" r="5" class="f-fill"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},26 Q${(X(from) + X(to)) / 2},4 ${X(to)},26" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="34" r="5" class="f-dot"/>`;
return svg(320, 62, g, "droite graduée"); };

const col = (a, op, b, r) => `<div class="act-out" style="text-align:center"><table style="margin:auto;font-family:monospace;font-size:16px;border-collapse:collapse">
    <tr><td></td><td style="text-align:right">${n2(a)}</td></tr><tr><td>${op}</td><td style="text-align:right">${n2(b)}</td></tr>
    <tr><td></td><td style="text-align:right;border-top:2px solid var(--ink)"><b>${r === null ? "?" : nb(r)}</b></td></tr></table></div>`;

const bar = (tot, p, lab, showN) => { const n = Math.round(tot / p), w = 280; let g = `<rect x="20" y="20" width="${w}" height="24" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`;
if (showN) for (let k = 0; k < n; k++) g += `<rect x="${20 + (k * w) / n}" y="20" width="${w / n}" height="24" class="${k % 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.4"/>`;
else g += `<rect x="20" y="20" width="${(w * p) / tot}" height="24" class="f-fill"/>`;
return svg(320, 62, g + T(160, 14, lab, "middle", 11) + T(20 + (w * p) / tot / 2, 58, nb(p), "middle", 10), "barre"); };

Object.assign(ACTIVE, {

decread: {
predict: { q: "Dans 4,357, que vaut le chiffre 5 ?", choices: ["5 dixièmes", "5 centièmes", "5 unités"], good: 1, why: "Après la virgule : dixièmes, puis centièmes, puis millièmes. 5 est au 2e rang : 5 centièmes, soit 0,05." },
defis: ["Écris en nombre décimal : \\(3 + \\frac{4}{10} + \\frac{7}{1000}\\).", "Combien y a-t-il de centièmes en tout dans 5,28 ?", "Écris \\(\\frac{2391}{100}\\) en nombre décimal."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => s === 1 ? tab(NUM, 5.28, 1, "5,28 dans le tableau") : tab(NUM, null, 1, "D dizaines · U unités · d dixièmes · c centièmes · m millièmes"),
show: (x, s) => s === 1 ? tab(NUM, 5.28, 1, "5 unités = 500 centièmes" + prop(x)) : tab(NUM, x, 1, (s ? "2'391 centièmes" : "3 unités, 4 dixièmes, 7 millièmes") + prop(x)),
wins: [W(3.407, "3,407 : pas de centièmes, on écrit un 0 à leur place."), W(528, "5,28 = 528/100 : 528 centièmes en tout (le chiffre des centièmes, lui, est 8)."), W(23.91, "2'391 centièmes = 23 unités et 91 centièmes : 23,91.")] }),
},
deccomp: {
predict: { q: "Quel est le plus grand nombre ?", choices: ["4,5", "4,12", "ils sont égaux"], good: 0, why: "4,5 = 4,50 : 50 centièmes, c'est plus que 12 centièmes. Le nombre le plus long n'est pas forcément le plus grand." },
defis: ["Écris un nombre compris entre 2,7 et 2,8.", "Écris un nombre compris entre 0,09 et 0,1.", "Range 3,07 ; 3,7 ; 3,17 ; 3,071 du plus petit au plus grand. Lequel est 2e ?"],
play: hunt({ ask: true, label: "Un nombre",
blank: (s) => [zl(2.7, 2.8, 0.01, [2.7, 2.8]), zl(0.09, 0.1, 0.001, [0.09, 0.1]), zl(3, 3.8, 0.1, [3, 3.8])][s],
show: (x, s) => [zl(2.7, 2.8, 0.01, [2.7, 2.8], [[x, "f-dot", nb(x)]]), zl(0.09, 0.1, 0.001, [0.09, 0.1], [[x, "f-dot", nb(x)]]), zl(3, 3.8, 0.1, [3, 3.8], [[x, "f-dot", nb(x)]])][s] + plain(["2,7 = 2,70 et 2,8 = 2,80 : que mettre entre 70 et 80 centièmes ?", "0,1 = 0,100 et 0,09 = 0,090 : compare en millièmes", "complète avec des zéros : 3,070 ; 3,700 ; 3,170 ; 3,071"][s] + prop(x)),
wins: [(x) => (x > 2.7 && x < 2.8 ? nb(x) + " convient : entre 2,70 et 2,80, il y a 2,71 ; 2,75 ; 2,799… une infinité de nombres." : ""),
(x) => (x > 0.09 && x < 0.1 ? nb(x) + " convient : 0,09 = 0,090 et 0,1 = 0,100, on intercale en millièmes." : ""),
W(3.071, "3,070 < 3,071 < 3,170 < 3,700 : le 2e est 3,071.")] }),
},
decarr: {
predict: { q: "Arrondi au dixième, 7,96 devient…", choices: ["7,9", "8,0", "7,10"], good: 1, why: "Après les dixièmes vient 6 (de 5 à 9) : 9 dixièmes + 1 = 10 dixièmes = 1 unité. La retenue donne 8,0." },
defis: ["Arrondis 3,476 au centième.", "Encadre 12,738 entre deux dixièmes qui se suivent : tape le plus petit.", "Arrondis 59,97 au dixième."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [zl(3.4, 3.5, 0.01, [3.4, 3.5], [[3.476, "f-fill", "3,476"]]), zl(12, 13, 0.1, [12, 13], [[12.738, "f-fill", "12,738"]]), zl(59.5, 60.5, 0.1, [59.5, 60, 60.5], [[59.97, "f-fill", "59,97"]])][s],
show: (x, s) => [zl(3.4, 3.5, 0.01, [3.4, 3.5], [[3.476, "f-fill", ""], [x, "f-dot", nb(x)]]), zl(12, 13, 0.1, [12, 13], [[12.738, "f-fill", ""], [x, "f-dot", nb(x)]]), zl(59.5, 60.5, 0.1, [59.5, 60, 60.5], [[59.97, "f-fill", ""], [x, "f-dot", nb(x)]])][s] + plain(["chiffre après les centièmes : 6", "12,738 est entre 12,7… et 12,8…", "chiffre après les dixièmes : 7 ; 9 dixièmes + 1 ?"][s] + prop(x)),
wins: [W(3.48, "Le chiffre suivant est 6 : on augmente les centièmes, 3,476 ≈ 3,48."), W(12.7, "12,7 < 12,738 < 12,8."), W(60, "9 dixièmes + 1 = 10 dixièmes : la retenue passe aux unités, 59,97 ≈ 60,0.")] }),
},
ordgr: {
predict: { q: "Sans calculer exactement : 48,7 · 21,2 vaut environ…", choices: ["100", "1'000", "10'000"], good: 1, why: "48,7 ≈ 50 et 21,2 ≈ 20 : 50 · 20 = 1'000. (Le résultat exact est 1'032,44.)" },
defis: ["Arrondis chaque terme à la centaine, puis calcule : 687 + 214 ≈ ?", "Arrondis chaque facteur à la dizaine, puis calcule : 39,6 · 51,3 ≈ ?", "Un camarade annonce 6,12 · 29,8 = 18,2376. Arrondis 6,12 à l'unité et 29,8 à la dizaine : ordre de grandeur ?"],
play: hunt({ ask: true, label: "Ordre de grandeur",
show: (x, s) => plain(["687 ≈ 700 et 214 ≈ 200", "39,6 ≈ 40 et 51,3 ≈ 50", "6,12 ≈ 6 et 29,8 ≈ 30"][s] + prop(x)),
wins: [W(900, "700 + 200 = 900 (valeur exacte 901)."), W(2000, "40 · 50 = 2'000 (valeur exacte 2'031,48)."), W(180, "6 · 30 = 180 : 18,2376 est 10 fois trop petit, la virgule est mal placée (valeur exacte 182,376).")] }),
},
decadd: {
predict: { q: "2,5 + 1,25 = ?", choices: ["3,30", "3,75", "1,50"], good: 1, why: "On additionne des chiffres de même rang : 2,50 + 1,25 = 3,75 (5 dixièmes + 2 dixièmes, 0 + 5 centièmes)." },
defis: ["Un sandwich à 6,80 CHF et une boisson à 2,45 CHF. Total (en CHF) ?", "Une planche de 2,4 m ; on en scie 0,75 m. Longueur restante (en m) ?", "Tu paies 15,35 CHF avec un billet de 20 CHF. Monnaie rendue (en CHF) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [col(6.8, "+", 2.45, null), col(2.4, "−", 0.75, null), col(20, "−", 15.35, null)][s],
show: (x, s) => [col(6.8, "+", 2.45, x), col(2.4, "−", 0.75, x), col(20, "−", 15.35, x)][s] + plain(["virgules alignées, on commence par les centièmes", "2,4 = 2,40 : on complète avec un zéro", "20 = 20,00"][s]),
wins: [W(9.25, "6,80 + 2,45 = 9,25 CHF."), W(1.65, "2,40 − 0,75 = 1,65 m."), W(4.65, "20,00 − 15,35 = 4,65 CHF. Vérifie : 15,35 + 4,65 = 20.")] }),
},
dec10: {

retiens: { regle: "\\(\\cdot\\,10\\) : la virgule avance d'un rang vers la droite ; \\(: 10\\) : elle recule d'un rang. Avec 100, deux rangs ; avec 1000, trois rangs. On complète avec des zéros si besoin.", exemple: ["\\(3{,}47 \\cdot 100 = 347\\)", "\\(0{,}806 \\cdot 100 = 80{,}6\\)", "\\(52{,}6 : 1000 = 0{,}0526\\)"], piege: "\\(4{,}5 : 100 = 0{,}045\\) : on complète avec un zéro pour reculer de deux rangs." },
predict: { q: "3,47 · 100 = ?", choices: ["34,7", "347", "3,4700"], good: 1, why: "Multiplier par 100, c'est rendre chaque chiffre 100 fois plus grand : chaque chiffre avance de deux rangs. 3 unités → 3 centaines." },
defis: ["Transforme 0,806 en 80,6.", "Transforme 52,6 en 0,0526.", "Transforme 4,5 en 0,045."],
play: hunt({ label: "Opération", start: 0, min: -3, max: 3, fmt: (x) => (x === 0 ? "aucune" : x > 0 ? "· " + nb(10 ** x) : "÷ " + nb(10 ** -x)),
show: (x, s) => { const N = [0.806, 52.6, 4.5][s], v = +(N * 10 ** x).toFixed(6);
return tab(["1'000", "100", "10", "1", "0,1", "0,01", "0,001", "0,0001"], v, 3, nb(N) + (x === 0 ? "" : x > 0 ? " · " + nb(10 ** x) : " ÷ " + nb(10 ** -x)) + " = <b>" + nb(v) + "</b>"); },
note: "Touche − ou + : les chiffres glissent d'un rang ; la virgule reste en place.",
wins: [W(2, "· 100 : chaque chiffre avance de deux rangs, 0,806 · 100 = 80,6."), W(-3, "÷ 1'000 : chaque chiffre recule de trois rangs, 52,6 ÷ 1'000 = 0,0526."), W(-2, "÷ 100 : 4,5 ÷ 100 = 0,045. C'est aussi 4,5 · 0,01.")] }),
},
decmul: {
predict: { q: "0,5 · 0,5 = ?", choices: ["2,5", "0,25", "1"], good: 1, why: "La moitié de 0,5, c'est 0,25. Multiplier par un nombre plus petit que 1 diminue." },
defis: ["Le grand carré a une aire de 1. Calcule 0,3 · 0,4 (l'aire colorée).", "Calcule 2,3 · 1,4.", "Un tissu coûte 12,50 CHF le mètre. Prix de 2,4 m (en CHF) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [grid(3, 4), rect4(false), bar(2.4, 1, "2,4 m de tissu · 12,50 CHF le mètre")][s],
show: (x, s) => [grid(3, 4) + plain("12 petits carrés sur 100 sont colorés" + prop(x)), rect4(true) + plain("2 + 0,8 + 0,3 + 0,12" + prop(x)), plain("2 m → 25 CHF ; 0,4 m → 0,4 · 12,50" + prop(x, "CHF"))][s],
wins: [W(0.12, "12 centièmes de l'aire : 0,3 · 0,4 = 0,12 (3 · 4 = 12, deux décimales)."), W(3.22, "23 · 14 = 322, une décimale + une décimale = deux : 3,22."), W(30, "12,50 · 2,4 = 30 CHF (25 + 5).")] }),
},
decdiv: {
predict: { q: "6 ÷ 0,5 = ?", choices: ["3", "12", "0,3"], good: 1, why: "Combien de demis dans 6 ? 12. Diviser par 0,5, c'est doubler : le quotient est plus grand que 6." },
defis: ["Une ficelle de 7,2 m est coupée en 3 morceaux égaux. Longueur d'un morceau (en m) ?", "Combien de verres de 0,25 L remplit-on avec une bouteille de 4,5 L ?", "Calcule 8,64 ÷ 2,4."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [bar(7.2, 2.4, "ficelle de 7,2 m en 3 morceaux", true).replace(/>2,4</, ">?<"), bar(4.5, 0.25, "4,5 L · un verre = 0,25 L"), plain("8,64 ÷ 2,4 : rends le diviseur entier")][s],
show: (x, s) => [plain("7,2 ÷ 3 : 72 dixièmes ÷ 3" + prop(x, "m")), bar(4.5, 0.25, "1 L = 4 verres", true) + plain("4,5 ÷ 0,25 = 450 ÷ 25" + prop(x)), plain("8,64 ÷ 2,4 = 86,4 ÷ 24 (les deux · 10)" + prop(x))][s],
wins: [W(2.4, "7,2 ÷ 3 = 2,4 m. Vérifie : 3 · 2,4 = 7,2."), W(18, "4 verres par litre : 4,5 · 4 = 18 verres."), W(3.6, "86,4 ÷ 24 = 3,6. Vérifie : 2,4 · 3,6 = 8,64.")] }),
},
decprob: {
predict: { q: "3 cahiers à 2,40 CHF, payés avec un billet de 10 CHF. Quel calcul donne la monnaie ?", choices: ["10 − 3 · 2,40", "(10 − 3) · 2,40", "10 − 2,40 + 3"], good: 0, why: "D'abord le prix des cahiers (3 · 2,40 = 7,20), puis ce qui reste sur 10 : 10 − 7,20 = 2,80 CHF." },
defis: ["Un forfait de ski coûte 46,50 CHF par jour. Prix pour 4 jours (en CHF) ?", "4 amis partagent une pizza à 27,60 CHF. Part de chacun (en CHF) ?", "On coupe 3 morceaux de 1,35 m dans un ruban de 5 m. Longueur restante (en m) ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["4 · 46,50 ; estime : 4 · 50 = 200", "27,60 ÷ 4 ; estime : 28 ÷ 4 = 7", "d'abord 3 · 1,35, puis 5 − …"][s] + prop(x)),
wins: [W(186, "4 · 46,50 = 186 CHF."), W(6.9, "27,60 ÷ 4 = 6,90 CHF."), W(0.95, "3 · 1,35 = 4,05 m, puis 5 − 4,05 = 0,95 m.")] }),
},
pow9: {

retiens: { regle: "\\(a^n\\) est le produit de \\(n\\) facteurs égaux à \\(a\\).", exemple: ["\\(0{,}3^2 = 0{,}3 \\cdot 0{,}3 = 0{,}09\\)", "\\(2^4 + 3^2 = 16 + 9 = 25\\)"] },
predict: { q: "2³ = ?", choices: ["6", "8", "9"], good: 1, why: "2³ = 2 · 2 · 2 = 8 : trois facteurs égaux à 2. Ce n'est pas 2 · 3." },
garde: [1, 2],
defis: ["Calcule 5³.", "Calcule 0,3².", "Calcule 2⁴ + 3²."],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["5 · 5 · 5", "0,3 · 0,3 : une décimale + une décimale", "2 · 2 · 2 · 2, puis 3 · 3, puis la somme"][s] + prop(x)),
wins: [W(125, "5 · 5 · 5 = 125."), W(0.09, "0,3 · 0,3 = 0,09 (3 · 3 = 9, deux décimales)."), W(25, "2⁴ = 16 et 3² = 9 : 16 + 9 = 25. Les puissances passent avant l'addition.")] }),
},


ulong: {
predict: { q: "2,4 km = … m ?", choices: ["24 m", "240 m", "2'400 m"], good: 2, why: "1 km = 1'000 m : 2,4 km = 2,4 · 1'000 = 2'400 m. Vers une unité plus petite, le nombre grandit." },
defis: ["Un sentier mesure 3,25 km. Combien de mètres ?", "Une fourmi mesure 8 mm. Combien de centimètres ?", "Un camion porte 2,3 t de sable et 850 kg de gravier. Masse totale (en kg) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => s < 2 ? tab(LEN, null, s ? 5 : 3, s ? "réponse en cm" : "réponse en m") : tab(MAS, null, 3, "réponse en kg"),
show: (x, s) => [tab(LEN, x, 3, "3,25 km = 3 km + 250 m" + prop(x, "m")), tab(LEN, x, 5, "1 cm = 10 mm" + prop(x, "cm")), tab(MAS, x, 3, "2,3 t = 2'300 kg, puis + 850" + prop(x, "kg"))][s],
wins: [W(3250, "3,25 · 1'000 = 3'250 m."), W(0.8, "8 mm = 8 ÷ 10 = 0,8 cm : vers une unité plus grande, on divise."), W(3150, "2300 + 850 = 3'150 kg : on additionne dans la même unité.")] }),
},
uaire: {

retiens: { regle: "D'une unité d'aire à la suivante : \\(\\cdot\\,100\\). \\(1\\ \\text{m}^2 = 100\\ \\text{dm}^2 = 10'000\\ \\text{cm}^2\\). \\(1\\ \\text{ha} = 10'000\\ \\text{m}^2\\)." },
predict: { q: "1 m² = … cm² ?", choices: ["100 cm²", "1'000 cm²", "10'000 cm²"], good: 2, why: "Un carré de 1 m de côté, c'est 100 cm sur 100 cm : 100 · 100 = 10'000 carrés de 1 cm²." },
defis: ["Une feuille A4 mesure environ 6,2 dm². Combien de cm² ?", "Un appartement mesure 85 m². Combien de dm² ?", "Un champ mesure 3,5 ha. Combien de m² ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: () => sq10(),
show: (x, s) => sq10() + plain(["1 dm² = 10 · 10 cm²", "1 m² = 10 · 10 dm²", "1 ha = carré de 100 m sur 100 m"][s] + prop(x)),
wins: [W(620, "6,2 · 100 = 620 cm² : d'une unité d'aire à la suivante, · 100."), W(8500, "85 · 100 = 8'500 dm²."), W(35000, "3,5 · 10'000 = 35'000 m².")] }),
},
uvol: {

retiens: { regle: "Capacités : \\(1\\ \\text{L} = 10\\ \\text{dL} = 100\\ \\text{cL} = 1000\\ \\text{mL}\\). Un cube de 1 dm de côté contient 1 L : \\(1\\ \\text{dm}^3 = 1\\ \\text{L}\\).", exemple: ["\\(75\\ \\text{cL} = 750\\ \\text{mL}\\)", "\\(4{,}5\\ \\text{L} = 450\\ \\text{cL}\\), et \\(450 : 15 = 30\\) verres"], piege: "Mets les deux mesures dans la même unité avant de diviser : \\(4{,}5\\ \\text{L} = 450\\ \\text{cL}\\)." },
predict: { q: "Un cube de 1 dm de côté, rempli d'eau, contient…", choices: ["1 L", "1 dL", "10 L"], good: 0, why: "1 dm³ = 1 L : c'est la définition du litre. Une brique de lait de 1 L est presque un cube de 1 dm de côté." },
defis: ["Une bouteille contient 75 cL. Combien de mL ?", "Un aquarium a un volume de 0,12 m³. Combien de litres ?", "Combien de verres de 15 cL remplit-on avec un bidon de 4,5 L ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["1 cL = 10 mL", "1 m³ = 1'000 dm³ = 1'000 L", "4,5 L = 450 cL, puis ÷ 15"][s] + prop(x)),
wins: [W(750, "75 · 10 = 750 mL."), W(120, "0,12 · 1'000 = 120 L."), W(30, "4,5 L = 450 cL ; 450 ÷ 15 = 30 verres.")] }),
},


angtype: {
predict: { q: "Un angle de 200°, c'est un angle…", choices: ["obtus", "rentrant", "plat"], good: 1, why: "Obtus : entre 90° et 180°. Plat : 180°. Au-delà de 180° (et avant 360°), l'angle est rentrant." },
defis: ["Les deux angles forment un angle plat. L'un mesure 65°. Combien mesure l'autre ?", "Trois angles autour d'un point : 140°, 95° et ?", "Quel angle forment les aiguilles d'une montre à 4 h ?"],
play: hunt({ ask: true, label: "Mesure (en degrés)",
blank: (s) => [plat(), autour(), montre()][s],
show: (x, s) => [plat(), autour(), montre()][s] + plain(["angle plat : 180°", "angle plein : 360°", "12 intervalles de même angle sur le cadran ; de 12 h à 4 h : 4 intervalles"][s] + prop(x, "°")),
wins: [W(115, "65° + 115° = 180° : l'angle plat."), W(125, "140° + 95° + 125° = 360° : l'angle plein."), W(120, "360° ÷ 12 = 30° par heure ; 4 · 30° = 120°, un angle obtus.")] }),
},
quadri: {

retiens: { regle: "Parallélogramme : côtés opposés parallèles et égaux, angles consécutifs de somme \\(180°\\), diagonales qui se coupent en leur milieu. Losange : 4 côtés égaux. Rectangle : 4 angles droits, diagonales égales. Carré : losange et rectangle.", exemple: ["Losange de périmètre 36 cm : côté 9 cm", "Parallélogramme : un angle de 70°, le suivant de 110°", "Rectangle, \\(AC = 13\\) cm : \\(OB = 6{,}5\\) cm"] },
predict: { q: "Un carré est-il un losange ?", choices: ["Oui", "Non"], good: 0, why: "Un losange a 4 côtés égaux : le carré aussi. Le carré est à la fois un losange et un rectangle." },
defis: ["Un losange a un périmètre de 36 cm. Longueur d'un côté (en cm) ?", "Dans un parallélogramme, un angle mesure 70°. Combien mesure l'angle voisin (consécutif) ?", "Les diagonales du rectangle ABCD se coupent en O ; AC = 13 cm. Longueur OB (en cm) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [losange(), para(), rectDiag()][s],
show: (x, s) => [losange(), para(), rectDiag()][s] + plain(["4 côtés égaux", "deux angles consécutifs : somme 180°", "diagonales du rectangle : même longueur, coupées en leur milieu"][s] + prop(x)),
wins: [W(9, "36 ÷ 4 = 9 cm : les 4 côtés du losange sont égaux."), W(110, "70° + 110° = 180° : angles consécutifs supplémentaires."), W(6.5, "BD = AC = 13 cm et O est le milieu : OB = 6,5 cm.")] }),
},


perim: {
predict: { q: "On découpe un coin rectangulaire dans un rectangle. Le périmètre…", fig: svg(320, 110, P([[60, 10], [180, 10], [180, 45], [260, 45], [260, 100], [60, 100]]) + `<rect x="180" y="10" width="80" height="35" fill="none" stroke="var(--margin)" stroke-dasharray="4 3"/>`, "rectangle dont on a découpé un coin"),
choices: ["diminue", "ne change pas", "augmente"], good: 1, why: "Les deux bords du découpage remplacent exactement les deux bords enlevés (même longueur horizontale, même longueur verticale) : le périmètre ne change pas. L'aire, elle, diminue." },
defis: ["Rectangle de 7,5 cm sur 4 cm : périmètre (en cm) ?", "Un carré a un périmètre de 34 cm. Longueur de son côté (en cm) ?", "On pose une bordure autour de ce jardin en L. Longueur de la bordure (en m) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [rect("7,5 cm", "4 cm"), rect("?", "", true), jardinL()][s],
show: (x, s) => [rect("7,5 cm", "4 cm"), rect(nb(x) + " cm", "", true), jardinL()][s] + plain(["2 longueurs + 2 largeurs", "4 côtés égaux : 4 · côté = 34", "deux côtés ne sont pas marqués : 10 − 4 = 6 et 6 − 3 = 3"][s] + prop(x)),
wins: [W(23, "2 · (7,5 + 4) = 23 cm."), W(8.5, "34 ÷ 4 = 8,5 cm."), W(32, "6 + 3 + 4 + 3 + 10 + 6 = 32 m : autant que le rectangle de 10 m sur 6 m.")] }),
},
aire1: {
predict: { q: "Un triangle et un rectangle ont la même base et la même hauteur. L'aire du triangle est…", fig: svg(320, 100, `<rect x="70" y="10" width="180" height="80" class="f-soft" stroke="var(--ink)"/>` + P([[70, 90], [250, 90], [140, 10]]), "triangle dans un rectangle"),
choices: ["la même", "la moitié", "le double"], good: 1, why: "La hauteur coupe le rectangle en deux rectangles ; le triangle prend la moitié de chacun. Aire du triangle = base · hauteur ÷ 2." },
defis: ["Rectangle de 8 cm sur 3,5 cm : aire (en cm²) ?", "Triangle de base 9 cm et de hauteur 6 cm : aire (en cm²) ?", "Triangle rectangle : côtés de l'angle droit 5 cm et 12 cm, grand côté 13 cm. Aire (en cm²) ?"],
play: hunt({ ask: true, label: "Aire",
blank: (s) => [rect("8 cm", "3,5 cm"), triH(), triR()][s],
show: (x, s) => [rect("8 cm", "3,5 cm"), triH(), triR()][s] + plain(["longueur · largeur", "base · hauteur ÷ 2", "la hauteur sur la base 12 est le côté 5 ; 13 ne sert pas"][s] + prop(x, "cm²")),
wins: [W(28, "8 · 3,5 = 28 cm²."), W(27, "9 · 6 ÷ 2 = 27 cm²."), W(30, "5 · 12 ÷ 2 = 30 cm² : les deux côtés de l'angle droit sont base et hauteur.")] }),
},
aire2: {
predict: { q: "On découpe le triangle de gauche du parallélogramme et on le recolle à droite. On obtient…", fig: svg(320, 100, P([[50, 85], [210, 85], [270, 15], [110, 15]]) + L(110, 15, 110, 85, "f-accent", 2) + `<polygon points="210,85 270,85 270,15" fill="none" stroke="var(--margin)" stroke-dasharray="4 3"/>`, "parallélogramme découpé"),
choices: ["un rectangle", "un losange", "un triangle"], good: 0, why: "Le morceau recollé complète un rectangle de même base et de même hauteur : aire du parallélogramme = base · hauteur." },
defis: ["Parallélogramme : base 8 cm, côté oblique 6 cm, hauteur 5 cm. Aire (en cm²) ?", "Losange de diagonales 10 cm et 7 cm. Aire (en cm²) ?", "Un parallélogramme a une aire de 54 cm² et une base de 9 cm. Sa hauteur (en cm) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [paraH("8 cm", "5 cm", "6 cm"), losD(), paraH("9 cm", "?", "")][s],
show: (x, s) => [paraH("8 cm", "5 cm", "6 cm"), losD(), paraH("9 cm", nb(x) + " cm", "")][s] + plain(["base · hauteur ; le côté oblique ne sert pas", "le losange est la moitié du rectangle 10 sur 7", "base · hauteur = 54"][s] + prop(x)),
wins: [W(40, "8 · 5 = 40 cm² (et non 8 · 6)."), W(35, "10 · 7 ÷ 2 = 35 cm²."), W(6, "9 · 6 = 54 : la hauteur mesure 6 cm.")] }),
},
aire3: {
predict: { q: "Façade : rectangle de 6 m sur 4 m, surmonté d'un toit triangulaire de hauteur 3 m. Aire ?", fig: maison(6, 4, 3), choices: ["24 m²", "33 m²", "42 m²"], good: 1, why: "On découpe : rectangle 6 · 4 = 24, triangle 6 · 3 ÷ 2 = 9. Total 24 + 9 = 33 m²." },
defis: ["Façade carrée de 5 m de côté, toit triangulaire de hauteur 2 m. Aire (en m²) ?", "Cadre photo : extérieur 20 cm sur 15 cm, intérieur 16 cm sur 11 cm. Aire du cadre (en cm²) ?", "Terrain : un rectangle de 8 m sur 5 m et un triangle de base 3 m et de hauteur 5 m. Aire (en m²) ?"],
play: hunt({ ask: true, label: "Aire",
blank: (s) => [maison(5, 5, 2), cadre(), terrain()][s],
show: (x, s) => [maison(5, 5, 2), cadre(), terrain()][s] + plain(["carré + triangle", "grand rectangle − petit rectangle", "rectangle + triangle"][s] + prop(x)),
wins: [W(30, "25 + 5 · 2 ÷ 2 = 25 + 5 = 30 m²."), W(124, "20 · 15 − 16 · 11 = 300 − 176 = 124 cm²."), W(47.5, "8 · 5 + 3 · 5 ÷ 2 = 40 + 7,5 = 47,5 m².")] }),
},


relrep: {
predict: { q: "Quel est le plus petit nombre ?", choices: ["−7", "−3"], good: 0, why: "Sur la droite graduée, −7 est plus à gauche que −3 : −7 < −3, même si 7 > 3." },
defis: ["Quel nombre est repéré par le point A ?", "Il fait −8 °C le matin et 5 °C l'après-midi. De combien de degrés la température a-t-elle monté ?", "Range −2,5 ; 1 ; −3 ; −0,5 du plus petit au plus grand. Lequel est 2e ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [zl(-10, 5, 1, [0, 5], [[-6, "f-fill", "A"]]), zl(-10, 10, 1, [-10, -5, 0, 5, 10], [[-8, "f-fill", "matin"], [5, "f-fill", "après-midi"]]), zl(-4, 2, 0.5, [-4, -2, 0, 2])][s],
show: (x, s) => [zl(-10, 5, 1, [0, 5], [[-6, "f-fill", "A"], [x, "f-dot", nb(x)]]), zl(-10, 10, 1, [-10, -5, 0, 5, 10], [[-8, "f-fill", ""], [5, "f-fill", ""]]), zl(-4, 2, 0.5, [-4, -2, 0, 2], [[-2.5, "f-fill", ""], [1, "f-fill", ""], [-3, "f-fill", ""], [-0.5, "f-fill", ""], [x, "f-dot", nb(x)]])][s]
+ plain(["une graduation = 1 ; compte depuis 0", "de −8 à 0, puis de 0 à 5", "le plus à gauche est le plus petit"][s] + prop(x)),
wins: [W(-6, "A est 6 graduations à gauche de 0 : −6."), W(13, "8 degrés jusqu'à 0, puis 5 : 8 + 5 = 13 °C."), W(-2.5, "−3 < −2,5 < −0,5 < 1 : le 2e est −2,5.")] }),
},
reladd: {
predict: { q: "Il fait −3 °C. La température baisse de 5 °C. Il fait…", choices: ["−8 °C", "2 °C", "−2 °C"], good: 0, why: "On part de −3 et on recule encore de 5 : −3 − 5 = −8." },
defis: ["Calcule (−6) + 9.", "Calcule (−4) + (−7).", "Calcule 4 − (−6)."],
play: hunt({ ask: true, label: "Résultat",
blank: (s) => line([-6, -4, 4][s], null),
show: (x, s) => line([-6, -4, 4][s], x) + plain(["on part de −6 et on avance de 9", "on part de −4 et on recule de 7", "soustraire −6, c'est ajouter 6"][s] + prop(x)),
wins: [W(3, "Signes contraires : 9 − 6 = 3, signe du plus éloigné de zéro (9) : +3."), W(-11, "Même signe : 4 + 7 = 11, on garde le signe − : −11."), W(10, "4 − (−6) = 4 + 6 = 10.")] }),
},
});


const LEN = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
const MAS = ["t", "", "", "kg", "", "", "g"];

function grid(a, b) { const u = 12; let g = ""; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g += `<rect x="${100 + i * u}" y="${8 + j * u}" width="${u}" height="${u}" class="${i < a && j < b ? "f-fill" : "f-soft"}" stroke="var(--line)" stroke-width="0.5"/>`;
return svg(320, 140, g + T(100 + (a * u) / 2, 6 + 10 * u + 14, "0,3", "middle", 11) + T(96, 8 + (b * u) / 2 + 4, "0,4", "end", 11) + T(230, 70, "côté 1", "start", 11), "carré d'aire 1"); }

function rect4(full) { const k = 90, x0 = 40, y0 = 10, a = 2 * k, b = 0.3 * k, c = 1 * k, d = 0.4 * k; let g = `<rect x="${x0}" y="${y0}" width="${a}" height="${c}" class="f-fill2"/><rect x="${x0 + a}" y="${y0}" width="${b}" height="${c}" class="f-soft" stroke="var(--ink)"/><rect x="${x0}" y="${y0 + c}" width="${a}" height="${d}" class="f-soft" stroke="var(--ink)"/><rect x="${x0 + a}" y="${y0 + c}" width="${b}" height="${d}" class="f-fill2"/>`;
g += T(x0 + a / 2, y0 + c + d + 14, "2", "middle", 11) + T(x0 + a + b / 2, y0 + c + d + 14, "0,3", "middle", 11) + T(x0 - 4, y0 + c / 2, "1", "end", 11) + T(x0 - 4, y0 + c + d / 2 + 4, "0,4", "end", 11);
if (full) g += T(x0 + a / 2, y0 + c / 2 + 4, "2", "middle", 12) + T(x0 + a + b / 2, y0 + c / 2 + 4, "0,3", "middle", 10) + T(x0 + a / 2, y0 + c + d / 2 + 4, "0,8", "middle", 12) + T(x0 + a + b / 2 + 22, y0 + c + d / 2 + 4, "0,12", "start", 10);
return svg(320, 160, g, "rectangle 2,3 sur 1,4 découpé"); }

function sq10() { const u = 10; let g = ""; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g += `<rect x="${110 + i * u}" y="${6 + j * u}" width="${u}" height="${u}" class="${i || j ? "f-soft" : "f-fill"}" stroke="var(--line)" stroke-width="0.5"/>`;
return svg(320, 128, g + `<rect x="110" y="6" width="100" height="100" fill="none" stroke="var(--ink)" stroke-width="2"/>` + T(160, 122, "1 dm = 10 cm", "middle", 11) + T(222, 14, "1 cm²", "start", 11, "f-txt f-accent"), "carré de 1 dm découpé en carrés de 1 cm"); }
function plat() { return svg(320, 110, L(30, 95, 290, 95) + L(160, 95, 160 + 90 * Math.cos(65 * Math.PI / 180), 95 - 90 * Math.sin(65 * Math.PI / 180), "f-accent", 2.4) + T(205, 80, "65°", "middle", 12) + T(120, 80, "?", "middle", 13, "f-txt f-accent"), "angle plat partagé"); }
function autour() { const O = [160, 65], r = 55, ray = (a) => L(O[0], O[1], O[0] + r * Math.cos(a * Math.PI / 180), O[1] - r * Math.sin(a * Math.PI / 180), "f-line", 2), lab = (a, s, c) => T(O[0] + 32 * Math.cos(a * Math.PI / 180), O[1] - 32 * Math.sin(a * Math.PI / 180) + 4, s, "middle", 11, c);
return svg(320, 130, ray(0) + ray(140) + ray(235) + lab(70, "140°") + lab(187.5, "95°") + lab(297.5, "?", "f-txt f-accent"), "trois angles autour d'un point"); }
function montre() { const O = [160, 66], r = 56; let g = `<circle cx="${O[0]}" cy="${O[1]}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.6"/>`;
for (let k = 0; k < 12; k++) { const a = (k * 30 * Math.PI) / 180; g += L(O[0] + 48 * Math.sin(a), O[1] - 48 * Math.cos(a), O[0] + r * Math.sin(a), O[1] - r * Math.cos(a), "f-line", k % 3 ? 1 : 2.2); }
return svg(320, 130, g + L(O[0], O[1], O[0], O[1] - 46, "f-line", 2.4) + L(O[0], O[1], O[0] + 34 * Math.sin(Math.PI * 2 / 3), O[1] - 34 * Math.cos(Math.PI * 2 / 3), "f-accent", 3.2) + `<circle cx="${O[0]}" cy="${O[1]}" r="3" class="f-dot"/>` + T(O[0], O[1] - 60 + 22, "12", "middle", 10) + T(O[0] + 40 * Math.sin(Math.PI * 2 / 3) - 8, O[1] - 40 * Math.cos(Math.PI * 2 / 3) + 2, "4", "middle", 10), "montre à 4 heures"); }
function losange() { return svg(320, 130, P([[160, 8], [250, 65], [160, 122], [70, 65]]) + T(214, 30, "?", "start", 13, "f-txt f-accent") + T(160, 70, "périmètre 36 cm", "middle", 11), "losange"); }
function para() { return svg(320, 120, P([[50, 105], [220, 105], [280, 20], [110, 20]]) + T(78, 98, "70°", "start", 12) + T(206, 98, "?", "end", 13, "f-txt f-accent"), "parallélogramme"); }
function rectDiag() { return svg(320, 130, `<rect x="50" y="15" width="220" height="100" class="f-shape"/>` + L(50, 15, 270, 115, "f-line", 1.4) + L(270, 15, 50, 115, "f-accent", 2) + `<circle cx="160" cy="65" r="3" class="f-dot"/>` + T(42, 12, "A", "end") + T(278, 12, "B", "start") + T(278, 126, "C", "start") + T(42, 126, "D", "end") + T(160, 86, "O") + T(220, 104, "AC = 13 cm", "middle", 10), "rectangle et ses diagonales"); }
function rect(lw, lh, sq) { const w = sq ? 100 : 200, hh = sq ? 100 : 90; return svg(320, 130, `<rect x="${160 - w / 2}" y="10" width="${w}" height="${hh}" class="f-shape"/>` + T(160, 10 + hh + 16, lw, "middle", 12, /\?/.test(lw) ? "f-txt f-accent" : "f-txt") + (lh ? T(160 + w / 2 + 6, 10 + hh / 2 + 4, lh, "start", 12) : "") + (sq ? T(160, 10 + hh / 2 + 4, "carré", "middle", 11) : ""), "rectangle"); }
function jardinL() { const k = 20, X = (u) => 60 + u * k, Y = (v) => 10 + v * k;
return svg(320, 145, P([[X(0), Y(0)], [X(6), Y(0)], [X(6), Y(3)], [X(10), Y(3)], [X(10), Y(6)], [X(0), Y(6)]]) + T(X(5), Y(6) + 16, "10 m") + T(X(0) - 6, Y(3) + 4, "6 m", "end") + T(X(8), Y(3) - 6, "4 m") + T(X(6) - 6, Y(1.5) + 4, "3 m", "end"), "jardin en L"); }
function triH() { return svg(320, 120, P([[60, 100], [240, 100], [110, 15]]) + L(110, 15, 110, 100, "f-accent", 2) + `<rect x="110" y="92" width="8" height="8" fill="none" stroke="var(--margin)"/>` + T(150, 116, "9 cm") + T(104, 62, "6 cm", "end"), "triangle, base et hauteur"); }
function triR() { return svg(320, 120, P([[80, 100], [260, 100], [80, 25]]) + `<rect x="80" y="92" width="8" height="8" fill="none" stroke="var(--ink)"/>` + T(170, 116, "12 cm") + T(74, 66, "5 cm", "end") + T(178, 56, "13 cm", "start"), "triangle rectangle"); }
function paraH(b, h, c) { return svg(320, 120, P([[50, 100], [230, 100], [280, 20], [100, 20]]) + L(100, 20, 100, 100, "f-accent", 2) + `<rect x="100" y="92" width="8" height="8" fill="none" stroke="var(--margin)"/>` + T(140, 116, b) + T(94, 64, h, "end", 12, /\?/.test(h) ? "f-txt f-accent" : "f-txt") + (c ? T(264, 64, c, "start") : ""), "parallélogramme et sa hauteur"); }
function losD() { return svg(320, 130, P([[160, 8], [260, 65], [160, 122], [60, 65]]) + L(60, 65, 260, 65, "f-accent", 1.6) + L(160, 8, 160, 122, "f-accent", 1.6) + `<rect x="60" y="8" width="200" height="114" fill="none" stroke="var(--line)" stroke-dasharray="4 3"/>` + T(205, 60, "10 cm", "middle", 11) + T(166, 100, "7 cm", "start", 11), "losange et ses diagonales"); }
function maison(a, b, hh) { const k = 22, x0 = 160 - (a * k) / 2, yb = 10 + (b + hh) * k;
return svg(320, yb + 22, P([[x0, yb], [x0 + a * k, yb], [x0 + a * k, yb - b * k], [x0, yb - b * k]], "f-fill2") + P([[x0, yb - b * k], [x0 + a * k, yb - b * k], [160, 10]]) + L(160, 10, 160, yb - b * k, "f-accent", 1.4) + T(160, yb + 16, a + " m") + T(x0 + a * k + 6, yb - (b * k) / 2, b + " m", "start") + T(166, yb - b * k - 6, hh + " m", "start", 11), "façade de maison"); }
function cadre() { return svg(320, 140, `<rect x="60" y="10" width="200" height="110" class="f-fill2"/><rect x="80" y="25" width="160" height="80" class="f-soft" stroke="var(--ink)"/>` + T(160, 134, "20 cm (extérieur)") + T(266, 68, "15 cm", "start") + T(160, 70, "16 cm sur 11 cm", "middle", 11), "cadre photo"); }
function terrain() { const k = 22; return svg(320, 140, `<rect x="60" y="10" width="${8 * k}" height="${5 * k}" class="f-shape"/>` + P([[60 + 8 * k, 10], [60 + 11 * k, 10 + 5 * k], [60 + 8 * k, 10 + 5 * k]], "f-fill2") + T(60 + 4 * k, 10 + 5 * k + 16, "8 m") + T(54, 10 + 2.5 * k + 4, "5 m", "end") + T(60 + 9.5 * k, 10 + 5 * k + 16, "3 m"), "terrain : rectangle et triangle"); }
})();








(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;

const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls === "grid" ? "f-line" : cls}" style="stroke-width:${w}${cls === "grid" ? ";stroke:var(--line)" : ""}"${dash ? ' stroke-dasharray="4 3"' : ""}/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;



const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/[\s']/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
x = v; const s0 = step; draw();
if (!check()) { const m = typeof o.miss === "function" ? o.miss(x, s0) : o.miss; $hint(box, m || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis le coup de pouce, puis recalcule.")); } };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-6 ? msg : "");
const tdS = "padding:4px 10px;border:1px solid var(--line);text-align:center";

const table = (h1, h2, r1, r2) => `<div class="act-out" style="overflow-x:auto"><table style="margin:auto;border-collapse:collapse"><tr><th style="${tdS}">${h1}</th>${r1.map((c) => `<td style="${tdS}">${c}</td>`).join("")}</tr><tr><th style="${tdS}">${h2}</th>${r2.map((c) => `<td style="${tdS}">${c}</td>`).join("")}</tr></table></div>`;
const q = (x) => (x === null || x === undefined ? '<b style="color:var(--margin)">?</b>' : `<b style="color:var(--margin)">${nb(x)}</b>`);



const prism = (n, lab) => {
const cx = 160, rx = 78, ry = 22, yb = 140, yt = 52, off = n % 2 ? 0 : Math.PI / n;
const P = [...Array(n).keys()].map((k) => { const a = Math.PI / 2 + (2 * Math.PI * k) / n + off; return [cx + rx * Math.cos(a), ry * Math.sin(a)]; });
const xs = P.map((p) => p[0]), xmin = Math.min(...xs), xmax = Math.max(...xs);
const back = (p) => p[1] < -0.5 && p[0] > xmin + 0.5 && p[0] < xmax - 0.5;
let g = `<polygon points="${P.map((p) => p[0] + "," + (yt + p[1])).join(" ")}" class="f-fill2"/>`;
for (let k = 0; k < n; k++) {
const p = P[k], r = P[(k + 1) % n], hid = (p[1] + r[1]) / 2 < -0.5;
g += L(p[0], yb + p[1], r[0], yb + r[1], "f-line", 1.6, hid);
g += L(p[0], yt + p[1], p[0], yb + p[1], "f-line", 1.6, back(p));
}
for (const p of P) g += `<circle cx="${p[0]}" cy="${yt + p[1]}" r="2.6" class="f-dot"/><circle cx="${p[0]}" cy="${yb + p[1]}" r="2.6" class="f-dot"/>`;
return svg(320, 172, g + (lab ? T(160, 18, lab, "middle", 12) : ""), "prisme droit à base de " + n + " côtés");
};

const cuboid = (a, b, c, grid, labs) => {
const u = Math.min(26, 230 / (a + b * 0.5), 120 / (c + b * 0.5)), dx = u * 0.5, dy = u * 0.5, x0 = 44, y0 = 20 + c * u + b * dy;
const pt = (i, j, k) => [x0 + i * u + j * dx, y0 - k * u - j * dy];
const poly = (ps, cls) => `<polygon points="${ps.map((p) => p.join(",")).join(" ")}" class="${cls}" stroke="var(--ink)" stroke-width="1.4"/>`;
let g = poly([pt(0, 0, 0), pt(a, 0, 0), pt(a, 0, c), pt(0, 0, c)], "f-fill2") + poly([pt(0, 0, c), pt(a, 0, c), pt(a, b, c), pt(0, b, c)], "f-soft") + poly([pt(a, 0, 0), pt(a, b, 0), pt(a, b, c), pt(a, 0, c)], "f-shape");
const seg = (p, r) => L(p[0], p[1], r[0], r[1], "f-line", 0.7);
if (grid) {
for (let i = 1; i < a; i++) g += seg(pt(i, 0, 0), pt(i, 0, c)) + seg(pt(i, 0, c), pt(i, b, c));
for (let k = 1; k < c; k++) g += seg(pt(0, 0, k), pt(a, 0, k)) + seg(pt(a, 0, k), pt(a, b, k));
for (let j = 1; j < b; j++) g += seg(pt(0, j, c), pt(a, j, c)) + seg(pt(a, j, 0), pt(a, j, c));
}
if (labs) { const [la, lb, lc] = labs, A = pt(a / 2, 0, 0), B = pt(a, b / 2, 0), C = pt(0, 0, c / 2);
g += T(A[0], A[1] + 16, la) + T(B[0] + 8, B[1] + 8, lb, "start") + T(C[0] - 6, C[1] + 4, lc, "end"); }
return svg(320, y0 + 26, g, "pavé droit " + a + " sur " + b + " sur " + c);
};

const cubeNet = (lab) => { const s = 42, x0 = 76, y0 = 6; let g = "";
for (const [i, j] of [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]]) g += `<rect x="${x0 + j * s}" y="${y0 + i * s}" width="${s}" height="${s}" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>`;
g += T(x0 + 1.5 * s, y0 + s * 3 + 16, lab) ;
return svg(320, y0 + 3 * s + 24, g, "patron d'un cube"); };

const flow = (rows, opsL, opsR, hi = -1) => { let g = ""; const Y = [26, 76, 126];
rows.forEach(([l, r], i) => { if (!l) return; g += `<rect x="52" y="${Y[i] - 16}" width="92" height="26" rx="5" class="f-soft"/><rect x="176" y="${Y[i] - 16}" width="92" height="26" rx="5" class="f-soft"/>` + T(98, Y[i] + 2, l, "middle", 13) + T(222, Y[i] + 2, r, "middle", 13, i === hi || r.includes("?") ? "f-txt f-accent" : "f-txt") + T(160, Y[i] + 2, "→", "middle", 13); });
for (let i = 0; i < 2; i++) { if (opsL[i]) g += `<path d="M50,${Y[i] + 2} Q28,${(Y[i] + Y[i + 1]) / 2} 50,${Y[i + 1] - 6}" class="f-blue" fill="none" stroke-width="1.6"/>` + T(22, (Y[i] + Y[i + 1]) / 2 + 4, opsL[i], "middle", 12, "f-txt f-blue");
if (opsR[i]) g += `<path d="M270,${Y[i] + 2} Q292,${(Y[i] + Y[i + 1]) / 2} 270,${Y[i + 1] - 6}" class="f-blue" fill="none" stroke-width="1.6"/>` + T(300, (Y[i] + Y[i + 1]) / 2 + 4, opsR[i], "middle", 12, "f-txt f-blue"); }
return svg(320, rows[2][0] ? 146 : 96, g, "passage par l'unité"); };

const change2 = (eur, chf, hi) => { const M = Math.max(eur || 0, chf || 0, 100) * 1.1, X = (v) => 46 + (v * 256) / M;
let g = L(42, 44, 308, 44) + L(42, 104, 308, 104) + T(4, 48, "EUR", "start", 11, "f-txt f-blue") + T(4, 108, "CHF", "start", 11, "f-txt f-blue");
g += L(X(0), 38, X(0), 50) + L(X(0), 98, X(0), 110) + T(X(0), 32, "0", "middle", 11) + T(X(0), 124, "0", "middle", 11);
g += L(X(100), 44, X(95), 104, "f-line", 1, true) + `<circle cx="${X(100)}" cy="44" r="3.5" class="f-line"/><circle cx="${X(95)}" cy="104" r="3.5" class="f-line"/>` + T(X(100), 32, "100", "middle", 11) + T(X(95), 124, "95", "middle", 11);
if (eur !== null && chf !== null) g += L(X(eur), 44, X(chf), 104, "f-accent", 1.6, true);
if (eur !== null) g += `<circle cx="${X(eur)}" cy="44" r="5" class="f-dot"/>` + T(X(eur), 22, nb(eur), "middle", 13, hi === "e" ? "f-txt f-accent" : "f-txt");
if (chf !== null) g += `<circle cx="${X(chf)}" cy="104" r="5" class="f-dot"/>` + T(X(chf), 140, nb(chf), "middle", 13, hi === "c" ? "f-txt f-accent" : "f-txt");
else if (eur !== null) g += T(X(eur * 0.95), 140, "?", "middle", 14, "f-txt f-accent");
if (eur === null && chf !== null) g += T(X(chf / 0.95), 22, "?", "middle", 14, "f-txt f-accent");
return svg(320, 146, g, "double droite graduée euros et francs"); };
const chg = (e, c, hi) => { const ok = (v) => v !== null && isFinite(v) && v > 0 && v < 2000; return change2(ok(e) ? e : null, ok(c) ? c : null, hi); };

const rects = (w1, h1, w2, h2, labs, u) => { const x1 = 52, x2 = x1 + w1 * u + 56;
let g = `<rect x="${x1}" y="${150 - h1 * u}" width="${w1 * u}" height="${h1 * u}" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>` + T(x1 + (w1 * u) / 2, 166, labs[0]) + T(x1 - 4, 154 - (h1 * u) / 2, labs[1], "end");
if (h2 > 0 && w2 * u < 200 && h2 * u < 146) g += `<rect x="${x2}" y="${150 - h2 * u}" width="${w2 * u}" height="${h2 * u}" class="f-shape"/>` + T(x2 - 4, 154 - (h2 * u) / 2, labs[3], "end", 12, "f-txt f-accent");
else g += L(x2, 150, x2 + Math.min(w2 * u, 312 - x2), 150, "f-accent", 3) + (labs[3] ? T(x2 + 6, 120, labs[3], "start", 14, "f-txt f-accent") : "");
g += T(x2 + Math.min(w2 * u, 312 - x2) / 2, 166, labs[2]);
return svg(320, 172, g, "rectangle et son agrandissement"); };

const tri = (k, labs) => { const pts = (s, x0) => { const a = 12 * s, b = 10 * s, c = 8 * s, xa = (a * a + c * c - b * b) / (2 * a), ya = Math.sqrt(Math.max(0, c * c - xa * xa)); return [[x0, 100], [x0 + a, 100], [x0 + xa, 100 - ya]]; };
const draw = (P, cls, lb) => `<polygon points="${P.map((p) => p.join(",")).join(" ")}" class="${cls}"/>` + T((P[0][0] + P[1][0]) / 2, 116, lb[0]) + T((P[0][0] + P[2][0]) / 2 - 6, (P[0][1] + P[2][1]) / 2, lb[1], "end", 12, /\?/.test(lb[1]) ? "f-txt f-accent" : "f-txt") + T((P[1][0] + P[2][0]) / 2 + 6, (P[1][1] + P[2][1]) / 2, lb[2], "start");
let g = draw(pts(8.5, 20), "f-fill2", ["12 cm", "8 cm", "10 cm"]);
if (k > 0 && k < 1.15) g += draw(pts(8.5 * k, 190), "f-shape", labs);
else g += L(190, 100, 190 + 9 * 8.5, 100, "f-accent", 3) + T(190 + 4.5 * 8.5, 116, "9 cm") + T(190 + 3 * 8.5, 76, "?", "middle", 14, "f-txt f-accent");
return svg(320, 124, g, "triangle et sa réduction"); };

const bars = (xs, ys, yl, xl, hi) => { const M = Math.max(...ys), H = 110, bw = Math.min(46, 220 / xs.length), x0 = 60; let g = L(x0, 130, 310, 130) + L(x0, 130, x0, 10);
for (let v = 0; v <= M; v += M > 12 ? 5 : 1) g += L(x0 - 4, 130 - (v * H) / M, x0, 130 - (v * H) / M, "f-line", 1) + T(x0 - 7, 134 - (v * H) / M, v, "end", 10);
xs.forEach((x, i) => { const xc = x0 + 20 + i * (bw + 14); g += `<rect x="${xc}" y="${130 - (ys[i] * H) / M}" width="${bw}" height="${(ys[i] * H) / M}" class="${hi === i ? "f-fill" : "f-fill2"}"/>` + T(xc + bw / 2, 146, x, "middle", 11); });
return svg(320, 176, g + T(x0, 6 + 2, yl, "start", 10, "f-txt f-blue") + T(310, 166, xl, "end", 10, "f-txt f-blue"), "diagramme en colonnes"); };

const pie = (a, lab) => { const r = 62, cx = 160, cy = 76; let g = `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.4"/>`;
if (a > 0 && a < 360) { const t = ((a - 90) * Math.PI) / 180, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t); g += `<path d="M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${a > 180 ? 1 : 0} 1 ${x.toFixed(1)},${y.toFixed(1)} Z" class="f-fill"/>`; }
return svg(320, 156, g + T(cx, 152, lab, "middle", 12), "diagramme circulaire"); };

Object.assign(ACTIVE, {

solides: {

retiens: { regle: "Prisme droit de base à \\(n\\) côtés : \\(n + 2\\) faces (dont les 2 bases), \\(2n\\) sommets, \\(3n\\) arêtes.", exemple: ["Prisme à base triangulaire : 5 faces, 6 sommets, 9 arêtes", "Base à 5 côtés : 10 sommets ; 30 arêtes : base à 10 côtés"] },
predict: { q: "Une tente a la forme d'un prisme couché, à base triangulaire. Combien de faces a ce solide ?", choices: ["3", "5", "6"], good: 1,
why: "3 faces rectangulaires (les deux pans du toit et le sol), plus les 2 bases triangulaires (l'avant et l'arrière) : 5 faces. On oublie souvent les bases." },
defis: ["Ce prisme droit a une base à 5 côtés (un pentagone). Combien a-t-il de sommets ?", "Ce prisme droit a une base à 6 côtés (un hexagone). Combien a-t-il d'arêtes ?", "Un prisme droit a 30 arêtes. Combien de côtés a sa base ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => (s < 2 ? prism(s ? 6 : 5) : plain("Un prisme droit, des arêtes de trois sortes : celles de la base du bas, celles de la base du haut, et les arêtes verticales.")),
show: (x, s) => (s < 2 ? prism(s ? 6 : 5) + plain("tu proposes <b>" + nb(x) + "</b>") : (Number.isInteger(x) && x >= 3 && x <= 12 ? prism(x, "base à " + x + " côtés : " + 3 * x + " arêtes") : "") + plain("base à " + nb(x) + " côtés → " + nb(x) + " + " + nb(x) + " + " + nb(x) + " = <b>" + nb(3 * x) + "</b> arêtes (il en faut 30)")),
miss: (x, s) => (s === 0 && x === 5 ? "5, c'est la base du haut : compte aussi les sommets du bas." : s === 1 && x === 12 ? "Tu as compté les deux bases : il manque les arêtes verticales." : s === 2 && x === 15 ? "Avec 15 côtés, la base du haut aurait déjà 15 arêtes, celle du bas 15 aussi…" : ""),
wins: [W(10, "5 sommets en haut, 5 en bas : 10 sommets (2 · 5)."), W(18, "6 arêtes en haut, 6 en bas, 6 verticales : 18 arêtes (3 · 6)."), W(10, "30 = 3 · 10 : la base a 10 côtés (10 en haut, 10 en bas, 10 verticales).")] }),
},
volpave: {

retiens: { regle: "Pavé : \\(V = a \\cdot b \\cdot c\\) (le nombre de cubes-unités). Cube : \\(V = a^3\\), aire totale \\(6a^2\\) (6 faces carrées).", exemple: ["Pavé 8 × 5 × 3 cm : \\(V = 120\\ \\text{cm}^3\\)", "Cube d'arête 5 cm : aire \\(6 \\cdot 25 = 150\\ \\text{cm}^2\\)"] },
predict: { q: "Combien de petits cubes de 1 cm d'arête faut-il pour construire un cube de 2 cm d'arête ?", choices: ["4", "6", "8"], good: 2,
why: "Deux étages de 2 · 2 = 4 cubes : 2 · 2 · 2 = 8. Le cube a 6 faces, mais il est fait de 8 petits cubes." },
defis: ["Combien de cubes-unités forment ce pavé ?", "Un pavé mesure 8 cm × 5 cm × 3 cm. Quel est son volume (en cm³) ?", "Un cube a des arêtes de 5 cm. Quelle est l'aire totale de ses 6 faces (en cm²) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [cuboid(4, 3, 2, true), cuboid(8, 5, 3, false, ["8 cm", "5 cm", "3 cm"]), cubeNet("chaque arête : 5 cm")][s],
show: (x, s) => [cuboid(4, 3, 2, true) + plain("un étage : 4 · 3 cubes ; il y a 2 étages · tu proposes <b>" + nb(x) + "</b>"), cuboid(8, 5, 3, true, ["8 cm", "5 cm", "3 cm"]) + plain("tu proposes <b>" + nb(x) + " cm³</b>"), cubeNet("chaque arête : 5 cm") + plain("6 faces carrées · tu proposes <b>" + nb(x) + " cm²</b>")][s],
miss: (x, s) => (s === 1 && x === 16 ? "8 + 5 + 3 : on n'additionne pas, on compte des cubes : longueur · largeur · hauteur." : s === 2 && x === 125 ? "125 cm³, c'est le volume. Ici on veut l'aire : la surface des 6 faces." : s === 2 && x === 25 ? "25 cm², c'est une seule face. Combien de faces ?" : ""),
wins: [W(24, "4 · 3 = 12 cubes par étage, 2 étages : 24 cubes, donc 24 cm³ si les cubes ont 1 cm d'arête."), W(120, "8 · 5 · 3 = 120 cm³ : 40 cubes par étage, 3 étages."), W(150, "Une face : 5 · 5 = 25 cm² ; 6 faces : 150 cm². Une aire se mesure en cm², un volume en cm³.")] }),
},


fracrep: {

retiens: { regle: "Même dénominateur : la plus grande a le plus grand numérateur. Dénominateurs différents : on amplifie pour avoir le même dénominateur.", exemple: ["\\(\\frac{2}{3} = \\frac{4}{6}\\)", "\\(\\frac{3}{4} = \\frac{9}{12} < \\frac{10}{12} = \\frac{5}{6}\\)"] },
predict: { q: "Quelle fraction est la plus grande : 1/3 ou 1/4 ?", choices: ["1/3", "1/4", "elles sont égales"], good: 0,
why: "Partager en 3 donne de plus grosses parts que partager en 4 : 1/3 > 1/4, même si 4 est plus grand que 3." },
defis: ["Place \\(\\frac{7}{4}\\) sur la droite graduée.", "La droite est maintenant graduée en sixièmes. Place \\(\\frac{2}{3}\\).", "En douzièmes, place la plus grande des deux fractions \\(\\frac{3}{4}\\) et \\(\\frac{5}{6}\\)."],
play(box, onWin) {
const D = [4, 6, 12];
let step = 0, k = 1;
const draw = () => {
const d = D[Math.min(step, 2)], X = (v) => 20 + (v * 280) / 2;
let g = L(14, 50, 306, 50);
for (let i = 0; i <= 2 * d; i++) { const big = i % d === 0; g += L(X(i / d), big ? 40 : 45, X(i / d), big ? 60 : 55, "f-line", big ? 1.8 : 1); if (big) g += T(X(i / d), 78, i / d, "middle", 13); }
g += `<circle cx="${X(k / d)}" cy="50" r="7" class="f-dot"/>` + T(X(k / d), 26, k + "/" + d, "middle", 13, "f-txt f-accent");
const ent = k % d === 0 ? " = " + k / d : "", enc = k % d ? " · entre " + Math.floor(k / d) + " et " + (Math.floor(k / d) + 1) : "";
box.innerHTML = svg(320, 88, g, "droite graduée de 0 à 2 en " + d + "es") + `<label class="dyn-ctl"><input type="range" min="0" max="${2 * d}" step="1" value="${k}" aria-label="déplacer le point"><span class="small muted">Fais glisser le point sur la droite.</span></label>
            <div class="act-out">Le point est sur <b>${k}/${d}</b>${ent}${enc}</div>`;
const inp = box.querySelector("input");
inp.oninput = () => { k = +inp.value; draw(); box.querySelector("input").focus(); check(); };
};
const check = () => {
if (step === 0 && k === 7) { onWin(0, "7/4 = 4/4 + 3/4 = 1 + 3/4 : entre 1 et 2."); step = 1; k = 1; draw(); }
else if (step === 1 && k === 4) { onWin(1, "2/3 = 4/6 : on a coupé chaque tiers en 2. Même point, autre écriture."); step = 2; k = 1; draw(); }
else if (step === 2 && k === 10) { onWin(2, "5/6 = 10/12 et 3/4 = 9/12 : avec le même dénominateur, on compare les numérateurs. 5/6 > 3/4."); step = 3; }
else if (step === 2 && k === 9) $hint(box, "9/12 = 3/4. Et 5/6, c'est combien de douzièmes ?");
else if (step === 0 && k === 4) $hint(box, "4/4, c'est 1. Il faut 7 quarts.");
};
draw();
},
},
fracsimp: {

retiens: { exemple: ["\\(\\frac{3}{4} = \\frac{9}{12}\\) (amplifiée par 3)", "\\(\\frac{12}{18} = \\frac{2}{3}\\) (simplifiée par 6)"], piege: "\\(\\frac{12}{18} = \\frac{6}{9}\\) est simplifiée, mais pas encore irréductible." },
predict: { q: "Compare 2/3 et 4/6.", choices: ["2/3 est plus grand", "elles sont égales", "4/6 est plus grand"], good: 1,
fig: svg(320, 64, (() => { let g = ""; for (const [a, b, y] of [[2, 3, 6], [4, 6, 36]]) for (let i = 0; i < b; i++) g += `<rect x="${20 + (i * 280) / b}" y="${y}" width="${280 / b}" height="22" class="${i < a ? "f-fill" : "f-soft"}" style="stroke:var(--ink);stroke-width:1.2"/>`; return g; })(), "barres 2 sur 3 et 4 sur 6"),
why: "Si on coupe chaque tiers en 2, on obtient des sixièmes : 2 tiers = 4 sixièmes. Même quantité, autre écriture." },
defis: ["Découpe les parts pour écrire \\(\\frac{3}{4}\\) avec le dénominateur 12.", "Regroupe les parts pour rendre \\(\\frac{12}{18}\\) irréductible.", "Passe de \\(\\frac{6}{8}\\) à \\(\\frac{9}{12}\\)."],
play(box, onWin) {
const S = [[3, 4], [12, 18], [6, 8]];
let step = 0, a = 3, b = 4, hist = ["3/4"];
const reset = () => { [a, b] = S[Math.min(step, 2)]; hist = [a + "/" + b]; };
const draw = (msg) => {
let g = "";
for (let i = 0; i < b; i++) g += `<rect x="${20 + (i * 280) / b}" y="8" width="${280 / b}" height="34" class="${i < a ? "f-fill" : "f-soft"}" style="stroke:var(--ink);stroke-width:${b > 24 ? 0.6 : 1.2}"/>`;
box.innerHTML = svg(320, 50, g, a + " parts coloriées sur " + b) + `<div class="act-out" style="text-align:center"><b>${hist.join(" = ")}</b></div>
            <div class="small muted">Découpe chaque part en</div><div class="seg">${[2, 3, 4, 5].map((k) => `<button type="button" data-cut="${k}"${b * k > 48 ? " disabled" : ""}>${k}</button>`).join("")}</div>
            <div class="small muted">Regroupe les parts par</div><div class="seg">${[2, 3, 5].map((k) => `<button type="button" data-grp="${k}">${k}</button>`).join("")}</div>
            <button type="button" class="btn-ghost small" data-reset>Recommencer</button>`;
box.querySelectorAll("[data-cut]").forEach((el) => (el.onclick = () => { const k = +el.dataset.cut; a *= k; b *= k; hist.push(a + "/" + b); draw(); check(); }));
box.querySelectorAll("[data-grp]").forEach((el) => (el.onclick = () => { const k = +el.dataset.grp;
if (a % k || b % k) { draw(); $hint(box, "Impossible : il faut pouvoir regrouper les " + a + " parts coloriées ET les " + b + " parts en paquets de " + k + "."); return; }
a /= k; b /= k; hist.push(a + "/" + b); draw(); check(); }));
box.querySelector("[data-reset]").onclick = () => { reset(); draw(); };
if (msg) $hint(box, msg);
};
const check = () => {
if (step === 0) { if (a === 9 && b === 12) { onWin(0, "3/4 = 9/12 : on a multiplié le numérateur ET le dénominateur par 3 (amplifier)."); step = 1; reset(); draw(); } else if (12 % b) draw(b + " ne divise pas 12 : en découpant encore, tu n'arriveras jamais à 12 parts. Recommence."); }
else if (step === 1) { if (gcd(a, b) === 1) { onWin(1, "12/18 = 2/3 : on a divisé par 2 puis par 3, donc par 6 (le PGDC de 12 et 18). On ne peut plus simplifier."); step = 2; reset(); draw(); } else if (b < 18) draw(a + "/" + b + " est simplifiée, mais on peut encore regrouper."); }
else if (step === 2 && a === 9 && b === 12) { onWin(2, "6/8 = 3/4 = 9/12 : on simplifie par 2, puis on amplifie par 3. Les trois fractions sont égales."); step = 3; }
};
draw();
},
},
fracper: {

retiens: { exemple: ["\\(\\frac{8}{3} = 2{,}666\\ldots\\)", "\\(1{,}222\\ldots = 1 + \\frac{2}{9} = \\frac{11}{9}\\)"] },
garde: [0, 2],
predict: { q: "Combien vaut 1 ÷ 3 ?", choices: ["0,3", "0,33", "0,333… (des 3 sans fin)"], good: 2,
why: "En posant 1 ÷ 3, le reste 1 revient à chaque étape : le chiffre 3 se répète sans fin. 0,33 = 33/100 est un peu plus petit que 1/3." },
defis: ["Calcule 8 ÷ 3. Quel chiffre se répète sans fin après la virgule ?", "Calcule 5 ÷ 11. Quel groupe de deux chiffres se répète ? (écris-le comme un nombre)", "On sait que \\(0{,}111\\ldots = \\frac{1}{9}\\). Écris \\(1{,}222\\ldots\\) comme une fraction de dénominateur 9 : quel est son numérateur ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["8 ÷ 3 = 2, reste 2. On ajoute un 0 : 20 ÷ 3 = ? reste ? Le même reste revient-il ?", "5 ÷ 11 = 0, reste 5. 50 ÷ 11 = 4, reste 6. Puis 60 ÷ 11 = ? reste ? … jusqu'à retrouver le reste 5.", "1,222… = 1 + 0,222… ; et 0,222… = 2 · 0,111… = 2/9. Combien de neuvièmes dans 1 ?"][s]),

miss: (x, s) => ([0, 2][s] === 2 && x === 12 ? "1,222… n'est pas 12/9 : 12/9 = 1,333…" : [0, 2][s] === 2 && x === 2 ? "2/9 = 0,222… : il manque l'unité, 1 = 9/9." : ""),
wins: [W(6, "8 ÷ 3 = 2,666… : le reste 2 revient sans cesse, le 6 se répète."), W(45, "5 ÷ 11 = 0,454545… : les restes 5 et 6 alternent, la période est 45."), W(11, "1,222… = 9/9 + 2/9 = 11/9.")] }),
},


proptab: {
predict: { q: "Un taxi coûte 6 CHF au départ, puis 2 CHF par km. Le prix est-il proportionnel au nombre de km ?", choices: ["Oui", "Non"], good: 1,
why: "1 km coûte 6 + 2 = 8 CHF ; 2 km coûtent 6 + 4 = 10 CHF, pas le double (16 CHF). Il n'y a pas un nombre fixe par lequel multiplier : ce n'est pas proportionnel." },
defis: ["Le tableau est proportionnel. Par quel nombre multiplie-t-on la 1re ligne pour obtenir la 2e ?", "Une piste mesure 0,4 km : complète le tableau.", "Sans chercher le coefficient : 6 cahiers coûtent 15 CHF et 4 cahiers 10 CHF. Combien coûtent 10 cahiers ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [table("Masse (kg)", "Prix (CHF)", [4, 6, 10], [14, 21, 35]) + plain("4 · " + q() + " = 14"), table("Tours", "Distance (km)", [1, 5, 8], ["0,4", 2, q()]), table("Cahiers", "Prix (CHF)", [6, 4, 10], [15, 10, q()])][s],
show: (x, s) => [table("Masse (kg)", "Prix (CHF)", [4, 6, 10], [14, 21, 35]) + plain("4 · " + q(x) + " = " + nb(4 * x) + " ; 6 · " + q(x) + " = " + nb(6 * x)), table("Tours", "Distance (km)", [1, 5, 8], ["0,4", 2, q(x)]) + plain("1 tour → 0,4 km"), table("Cahiers", "Prix (CHF)", [6, 4, 10], [15, 10, q(x)]) + plain("Regarde la 1re ligne : 6 + 4 = 10.")][s],
miss: (x, s) => (s === 0 && x === 10 ? "14 − 4 = 10 est une différence. On cherche un facteur : 14 ÷ 4." : s === 1 && x === 5 ? "On n'ajoute pas 3 : on multiplie par 0,4." : ""),
wins: [W(3.5, "14 ÷ 4 = 3,5 ; vérifie : 6 · 3,5 = 21 et 10 · 3,5 = 35. Le coefficient est 3,5."), W(3.2, "8 · 0,4 = 3,2 km (et 5 · 0,4 = 2 km)."), W(25, "6 + 4 = 10 cahiers, donc 15 + 10 = 25 CHF : dans un tableau proportionnel, on peut additionner des colonnes.")] }),
},
prop: {

retiens: { piege: "Deux croissants de plus ne coûtent pas 2 CHF de plus : passe par le prix d'un croissant." },
predict: { q: "4 croissants coûtent 6 CHF. Combien coûtent 6 croissants ?", choices: ["8 CHF", "9 CHF", "12 CHF"], good: 1,
why: "1 croissant coûte 6 ÷ 4 = 1,50 CHF, donc 6 croissants : 6 · 1,50 = 9 CHF. Deux croissants de plus ne coûtent pas 2 CHF de plus." },
defis: ["5 m de tissu coûtent 42 CHF. Combien coûte 1 m ?", "Combien coûtent 8 m de ce tissu ?", "Une voiture consomme 6,3 L d'essence pour 90 km. Combien pour 250 km ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [flow([["5 m", "42 CHF"], ["1 m", "? CHF"], ["", ""]], ["÷ 5", ""], ["÷ 5", ""]), flow([["5 m", "42 CHF"], ["1 m", "8,4 CHF"], ["8 m", "? CHF"]], ["÷ 5", "· 8"], ["÷ 5", "· 8"]), flow([["90 km", "6,3 L"], ["10 km", "…"], ["250 km", "? L"]], ["÷ 9", "· 25"], ["÷ 9", "· 25"])][s],
show: (x, s) => [flow([["5 m", "42 CHF"], ["1 m", nb(x) + " CHF"], ["", ""]], ["÷ 5", ""], ["÷ 5", ""], 1) + plain("vérifie : 5 · " + nb(x) + " = " + nb(5 * x) + " (il faut 42)"), flow([["5 m", "42 CHF"], ["1 m", "8,4 CHF"], ["8 m", nb(x) + " CHF"]], ["÷ 5", "· 8"], ["÷ 5", "· 8"], 2), flow([["90 km", "6,3 L"], ["10 km", "…"], ["250 km", nb(x) + " L"]], ["÷ 9", "· 25"], ["÷ 9", "· 25"], 2) + plain("pour 10 km : 6,3 ÷ 9 = ?")][s],
miss: (x, s) => (s === 1 && x === 45 ? "On n'ajoute pas 3 m → 3 CHF : 8 m, c'est 8 fois 1 m." : s === 2 && Math.abs(x - 166.3) < 1e-6 ? "On n'ajoute pas 160 : on passe par 10 km, puis on multiplie." : ""),
wins: [W(8.4, "42 ÷ 5 = 8,40 CHF le mètre : on passe par l'unité."), W(67.2, "8 · 8,40 = 67,20 CHF."), W(17.5, "6,3 ÷ 9 = 0,7 L pour 10 km, puis 0,7 · 25 = 17,5 L. On peut passer par 10 km au lieu de 1 km.")] }),
},
change: {
predict: { q: "Ce jour-là, 1 EUR vaut 0,95 CHF. Tu changes 100 EUR. Tu reçois…", choices: ["plus de 100 CHF", "moins de 100 CHF", "exactement 100 CHF"], good: 1,
why: "Chaque euro vaut 0,95 CHF, un peu moins qu'un franc : 100 EUR = 100 · 0,95 = 95 CHF." },
defis: ["Avec 1 EUR = 0,95 CHF : combien de francs reçois-tu pour 60 EUR ?", "Combien d'euros reçois-tu pour 76 CHF ?", "Un vélo coûte 420 EUR en France et 410 CHF en Suisse. Combien coûte le vélo français en francs ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [chg(60, null), chg(null, 76), chg(420, null)][s],
show: (x, s) => [chg(60, x, "c") + plain("60 EUR → " + nb(x) + " CHF"), chg(x, 76, "e") + plain(nb(x) + " EUR → 76 CHF ; vérifie : " + nb(x) + " · 0,95 = " + nb(x * 0.95)), chg(420, x, "c") + plain("420 EUR → " + nb(x) + " CHF")][s],
miss: (x, s) => (s === 0 && Math.abs(x - 60 / 0.95) < 0.01 ? "Tu as divisé : des euros vers les francs, on multiplie par 0,95." : s === 1 && Math.abs(x - 72.2) < 1e-6 ? "Tu as multiplié : des francs vers les euros, on divise par 0,95." : s === 2 && Math.abs(x - 420 / 0.95) < 0.01 ? "Des euros vers les francs : on multiplie par 0,95." : ""),
wins: [W(57, "60 · 0,95 = 57 CHF : moins de francs que d'euros, car l'euro vaut moins d'un franc."), W(80, "76 ÷ 0,95 = 80 EUR ; vérifie : 80 · 0,95 = 76."), W(399, "420 · 0,95 = 399 CHF : 11 CHF de moins qu'en Suisse (410 CHF).")] }),
},
agrand: {
predict: { q: "On agrandit un rectangle de 4 cm sur 2 cm. Sa longueur passe de 4 cm à 6 cm. Sa largeur devient…", choices: ["4 cm", "3 cm", "2,5 cm"], good: 1,
why: "La longueur est multipliée par 6 ÷ 4 = 1,5 ; la largeur aussi : 2 · 1,5 = 3 cm. Ajouter 2 cm partout (largeur 4 cm) déformerait le rectangle." },
defis: ["Une photo de 10 cm sur 15 cm est agrandie : le côté de 10 cm devient 25 cm. Quel est le facteur d'agrandissement ?", "Avec ce facteur, que devient le côté de 15 cm ?", "Un triangle de côtés 12 cm, 10 cm et 8 cm est réduit : le côté de 12 cm devient 9 cm. Que devient le côté de 8 cm ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [rects(10, 15, 25, 0, ["10 cm", "15 cm", "25 cm", ""], 3.8), rects(10, 15, 25, 0, ["10 cm", "15 cm", "25 cm", "?"], 3.8), tri(0, [])][s],
show: (x, s) => [rects(10, 15, 10 * x, 15 * x, ["10 cm", "15 cm", nb(10 * x) + " cm", ""], 3.8) + plain("10 · " + nb(x) + " = " + nb(10 * x) + " cm (il faut 25 cm)"), rects(10, 15, 25, x, ["10 cm", "15 cm", "25 cm", nb(x) + " cm"], 3.8) + plain("la photo est-elle déformée ?"), tri(x / 8, ["9 cm", nb(x) + " cm", ""]) + plain("12 cm → 9 cm : facteur 9 ÷ 12 = ?")][s],
miss: (x, s) => (s === 0 && x === 15 ? "25 − 10 = 15 est une différence : un agrandissement multiplie." : s === 1 && x === 30 ? "On n'ajoute pas 15 cm : on multiplie par le facteur." : s === 2 && x === 5 ? "On n'enlève pas 3 cm : on multiplie par le facteur 9 ÷ 12." : ""),
wins: [W(2.5, "25 ÷ 10 = 2,5 : plus grand que 1, c'est un agrandissement."), W(37.5, "15 · 2,5 = 37,5 cm : la photo garde sa forme."), W(6, "Facteur 9 ÷ 12 = 0,75 (plus petit que 1 : réduction) ; 8 · 0,75 = 6 cm.")] }),
},


symetries: {
predict: { q: "Par la symétrie d'axe Oy (l'axe vertical), le point A(4 ; 1) a pour image…", choices: ["(−4 ; 1)", "(4 ; −1)", "(−4 ; −1)"], good: 0,
why: "L'axe vertical joue le rôle d'un miroir : le point passe de l'autre côté, à la même distance (4 carreaux) et à la même hauteur (1). Seule l'abscisse change de signe." },
defis: ["Touche l'image de B(−2 ; 3) par la symétrie d'axe Ox (l'axe horizontal).", "Touche l'image de C(3 ; 2) par la symétrie de centre O.", "Touche l'image de D(−1 ; −2) par la translation « 4 à droite, 3 en haut »."],
play(box, onWin) {
const Pts = [[-2, 3, "B"], [3, 2, "C"], [-1, -2, "D"]], Img = [[-2, -3], [-3, -2], [3, 1]];
const Hint = ["Le miroir est l'axe horizontal : même abscisse, et la même distance à l'axe, de l'autre côté.", "O est le milieu du segment entre le point et son image : même distance à O, à l'opposé.", "Compte 4 carreaux vers la droite, puis 3 vers le haut."];
let step = 0, tap = null; const done = [];
const draw = () => {
const s = Math.min(step, 2), u = 25, X = (v) => 160 + v * u, Y = (v) => 150 - v * u;
let g = "";
for (let v = -5; v <= 5; v++) g += L(X(v), Y(-5), X(v), Y(5), "grid", 1) + L(X(-5), Y(v), X(5), Y(v), "grid", 1);
g += L(X(-5.6), Y(0), X(5.6), Y(0), s === 0 && step < 3 ? "f-accent" : "f-line", s === 0 && step < 3 ? 2.6 : 1.4) + L(X(0), Y(5.6), X(0), Y(-5.6), "f-line", 1.4) + T(X(5.6), Y(0) - 6, "x", "end", 11) + T(X(0) + 6, Y(5.6) + 4, "y", "start", 11) + T(X(0) - 5, Y(0) + 14, "O", "end", 11);
if (s === 1 && step < 3) g += `<circle cx="${X(0)}" cy="${Y(0)}" r="5" class="f-dot"/>`;
if (s === 2 && step < 3) { const [a, b] = Pts[2]; g += `<path d="M${X(a)},${Y(b)} L${X(a + 4)},${Y(b)} L${X(a + 4)},${Y(b + 3)}" class="f-blue" fill="none" stroke-width="1.4" stroke-dasharray="4 3"/>`; }
for (const [P, Q] of done) g += L(X(P[0]), Y(P[1]), X(Q[0]), Y(Q[1]), "f-line", 1, true) + `<circle cx="${X(P[0])}" cy="${Y(P[1])}" r="4" class="f-fill2"/><circle cx="${X(Q[0])}" cy="${Y(Q[1])}" r="4" class="f-fill2"/>` + T(X(Q[0]) + 6, Y(Q[1]) - 6, P[2] + "'", "start", 11);
if (step < 3) { const [a, b, n] = Pts[s]; g += `<circle cx="${X(a)}" cy="${Y(b)}" r="6" class="f-fill"/>` + T(X(a) + 8, Y(b) - 8, n + "(" + String(a).replace("-", "−") + " ; " + String(b).replace("-", "−") + ")", "start", 12, "f-txt f-blue"); }
if (tap) g += `<circle cx="${X(tap[0])}" cy="${Y(tap[1])}" r="6" class="f-dot"/>`;
for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) g += `<circle class="act-pt" data-x="${a}" data-y="${b}" cx="${X(a)}" cy="${Y(b)}" r="11" fill="transparent" style="cursor:pointer"/>`;
box.innerHTML = svg(320, 300, g, "quadrillage, repère de −5 à 5") + `<div class="act-out">${tap ? "Tu as touché (" + String(tap[0]).replace("-", "−") + " ; " + String(tap[1]).replace("-", "−") + ")" : "Touche un nœud du quadrillage."}</div>`;
box.querySelectorAll(".act-pt").forEach((el) => (el.onclick = () => { tap = [+el.dataset.x, +el.dataset.y]; check(); }));
};
const check = () => {
if (step > 2) return;
const [a, b] = Img[step];
if (tap[0] === a && tap[1] === b) {
const P = Pts[step]; done.push([P, Img[step]]); tap = null;
const m = ["B(−2 ; 3) → B'(−2 ; −3) : l'abscisse reste, l'ordonnée change de signe.", "C(3 ; 2) → C'(−3 ; −2) : les deux coordonnées changent de signe.", "D(−1 ; −2) → D'(3 ; 1) : on ajoute 4 à l'abscisse et 3 à l'ordonnée."][step];
step++; draw(); onWin(step - 1, m);
} else { draw(); $hint(box, Hint[step]); }
};
draw();
},
},


diagr: {
predict: { q: "Trois notes : 6 ; 6 ; 3. Quelle est la moyenne ?", choices: ["4,5", "5", "6"], good: 1,
why: "(6 + 6 + 3) ÷ 3 = 15 ÷ 3 = 5. Le 6 compte deux fois : ce n'est pas (6 + 3) ÷ 2 = 4,5." },
defis: ["Points marqués par une joueuse de basket en 4 matchs : calcule sa moyenne par match.", "Notes d'un test : 3 élèves ont 4, 5 élèves ont 5 et 2 élèves ont 6. Quelle est la moyenne de la classe ?", "Sur 24 élèves, 9 viennent à vélo. Quel angle (en degrés) mesure le secteur « vélo » du diagramme circulaire ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [bars(["match 1", "match 2", "match 3", "match 4"], [12, 18, 9, 21], "points", ""), bars(["4", "5", "6"], [3, 5, 2], "élèves", "note"), pie(0, "24 élèves : secteur « vélo » ?")][s],
show: (x, s) => [bars(["match 1", "match 2", "match 3", "match 4"], [12, 18, 9, 21], "points", "") + plain("tu proposes <b>" + nb(x) + "</b> · total des points ÷ nombre de matchs"), bars(["4", "5", "6"], [3, 5, 2], "élèves", "note") + plain("tu proposes <b>" + nb(x) + "</b> · somme de toutes les notes ÷ nombre d'élèves"), pie(x, "secteur de " + nb(x) + "° · le cercle entier : 360°")][s],
miss: (x, s) => (s === 1 && x === 5 ? "(4 + 5 + 6) ÷ 3 = 5 oublie les effectifs : 3 notes de 4, 5 notes de 5, 2 notes de 6." : s === 1 && Math.abs(x - 49 / 3) < 0.01 ? "On divise par le nombre d'élèves (10), pas par le nombre de notes différentes (3)." : s === 2 && x === 9 ? "9 élèves sur 24 : quelle part des 360° ?" : ""),
wins: [W(15, "12 + 18 + 9 + 21 = 60 points ; 60 ÷ 4 = 15 points par match."), W(4.9, "3 · 4 + 5 · 5 + 2 · 6 = 49 ; 49 ÷ 10 élèves = 4,9."), W(135, "9/24 de 360° : 360 ÷ 24 = 15° par élève, 9 · 15 = 135°.")] }),
},
});
})();

