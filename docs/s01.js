





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

