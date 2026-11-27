







const CURIEUX = [];
const CUR_FAM = { arnaque: { label: "Vrai ou arnaque ?", ic: "🕵️" }, paradoxe: { label: "Ton intuition te trompe ?", ic: "🤯" }, fermi: { label: "Estime !", ic: "🔭" }, enigme: { label: "Énigme", ic: "🧩" }, quotidien: { label: "Maths de tous les jours", ic: "🧭" } };
(function () {
const r6 = (v) => Math.round(v * 1e6) / 1e6;

const N = (v, k) => { if (k !== undefined) v = +(+v).toFixed(k); let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
const T = (v, k) => M(N(v, k));
const chf = (v) => M(N(v, Number.isInteger(r6(v)) ? 0 : 2).replace(/\{,\}(\d)$/, "{,}$10") + "\\ \\text{CHF}");
const pc = (v, k) => M(N(v, k) + "\\,\\%");
const pk = R.pick, add = (o) => CURIEUX.push(o);


add({ key: "soldes", fam: "arnaque", uses: ["pct"], outil: "les pourcentages successifs : on multiplie les coefficients (×0,7 puis ×0,8), on n'additionne pas les %.",
make() {
const a = pk([20, 30, 40]), b = pk([10, 20, 25]), P = pk([80, 120, 150, 160, 200, 240]), f = (1 - a / 100) * (1 - b / 100), red = r6(100 - 100 * f);
const obj = pk(["une veste", "des baskets", "un sac à dos", "une trottinette"]);
return { titre: "Double réduction", q: "En vitrine : « " + pc(a) + " sur tout le magasin, et encore " + pc(b) + " à la caisse : " + pc(a + b) + " de réduction ! »",
bet: { q: "Cette publicité dit-elle vrai ?", choices: ["Oui : c'est bien " + pc(a + b), "Arnaque : la réduction est plus petite", "Arnaque : la réduction est plus grande"], good: 1 },
calc: { label: "Combien paies-tu " + obj + " affiché" + (obj.startsWith("des") ? "s" : obj === "une veste" || obj === "une trottinette" ? "e" : "") + " " + chf(P) + " ? (en CHF)", value: r6(P * f), round: 0.01 },
reveal: "−" + a + " % : on paie " + pc(100 - a) + ", donc " + M(N(P) + " \\cdot " + N(1 - a / 100) + " = " + N(P * (1 - a / 100))) + ". Puis −" + b + " % <b>sur ce nouveau prix</b> : " + M(N(P * (1 - a / 100)) + " \\cdot " + N(1 - b / 100) + " = " + N(P * f)) + " CHF. Au total, on paie " + pc(100 * f) + " du prix : la réduction est de " + pc(red) + ", pas de " + pc(a + b) + "." };
} });
add({ key: "yoyo", fam: "arnaque", uses: ["pct"], outil: "les pourcentages : une hausse puis une baisse du même pourcentage ne s'annulent pas (×1,2 puis ×0,8 = ×0,96).",
make() {

const w = pk([
{ s: "Une action", v: "vaut", P: [40, 80, 120, 250], p: [10, 20, 25], t: ["Lundi", "Mardi", "mardi soir"], up: "gagne", dn: "perd", pr: "elle" },
{ s: "Un jeu vidéo", v: "coûte", P: [40, 60, 80], p: [10, 20, 25], t: ["Pour sa sortie", "Un mois plus tard", "après ces deux changements"], up: "augmente de", dn: "baisse de", pr: "il" },
{ s: "Un vélo électrique", v: "coûte", P: [2000, 2500, 3200], p: [10, 20], t: ["Au printemps", "En automne", "en automne"], up: "augmente de", dn: "baisse de", pr: "il" },
{ s: "Un abonnement de streaming", v: "coûte", P: [15, 20, 25], p: [20, 25], t: ["En janvier", "En juin", "en juin"], up: "augmente de", dn: "baisse de", pr: "il" }]);
const p = pk(w.p), P = pk(w.P), f = (1 + p / 100) * (1 - p / 100), u = w.s.includes("abonnement") ? " CHF par mois" : " CHF";
return { titre: "Montagnes russes", q: w.s + " " + w.v + " " + T(P) + u + ". " + w.t[0] + ", son prix " + w.up + " " + pc(p) + ". " + w.t[1] + ", il " + w.dn + " " + pc(p) + ".",
bet: { q: "Finalement, on est revenu…", choices: ["au-dessus de " + T(P) + " CHF", "exactement à " + T(P) + " CHF", "en dessous de " + T(P) + " CHF"], good: 2 },
calc: { label: (w.v === "vaut" ? "Que vaut-" + w.pr : "Combien coûte-t-" + w.pr) + " " + w.t[2] + " ? (en CHF)", value: r6(P * f), round: 0.01 },
reveal: "D'abord : " + M(N(P) + " \\cdot " + N(1 + p / 100) + " = " + N(P * (1 + p / 100))) + ". Ensuite, la baisse de " + p + " % porte sur ce <b>nouveau</b> prix, plus grand : " + M(N(P * (1 + p / 100)) + " \\cdot " + N(1 - p / 100) + " = " + N(P * f)) + ". Au total ×" + N(f).replace("{,}", ",") + " : on a perdu " + pc(100 - 100 * f) + "." };
} });
add({ key: "format", fam: "arnaque", uses: ["prop"], outil: "la proportionnalité : comparer des prix, c'est comparer le prix d'une même quantité (prix au litre).",
make() {
const A = pk([1.8, 1.95, 2.1, 2.4]), pl = A / 1.5, k = pk([0.9, 0.94, 1.06, 1.1]), B = Math.round((pl * 1.98 * k) / 0.05) * 0.05, pl2 = B / 1.98, cheap = pl2 < pl ? 1 : 0;
const drink = pk(["l'eau gazeuse", "le thé froid", "le jus de pomme"]);
return { titre: "Le grand format", q: "Au magasin, " + drink + " existe en bouteille de " + M("1{,}5\\ \\text{L}") + " à " + chf(A) + ", ou en pack de " + M("6") + " canettes de " + M("33\\ \\text{cl}") + " à " + chf(B) + ".",
bet: { q: "Lequel est le moins cher, à quantité égale ?", choices: ["La bouteille de 1,5 l", "Le pack de 6 canettes"], good: cheap },
calc: { label: "Prix d'un litre avec le pack (en CHF, au centime)", value: r6(pl2), round: 0.01 },
reveal: "Pack : " + M("6 \\cdot 0{,}33 = 1{,}98\\ \\text{L}") + ", donc " + M(N(B) + " \\div 1{,}98 \\approx " + N(pl2, 2)) + " CHF le litre. Bouteille : " + M(N(A) + " \\div 1{,}5 = " + N(pl, 2)) + " CHF le litre. " + (cheap ? "Le pack est moins cher." : "La bouteille est moins chère : le « grand » pack n'est pas toujours la bonne affaire.") };
} });
add({ key: "promo", fam: "arnaque", uses: ["pct"], outil: "les pourcentages : traduire une offre (« 3 pour 2 ») en réduction, puis comparer.",
make() {
const o = pk([["« 3 pour le prix de 2 »", 3, 2], ["« le 2e à moitié prix »", 2, 1.5], ["« 4 pour le prix de 3 »", 4, 3]]), D = pk([20, 25, 30]), eff = r6(100 - (100 * o[2]) / o[1]);
const good = Math.abs(eff - D) < 1e-9 ? 2 : eff > D ? 0 : 1, it = pk(["pots de confiture", "paquets de pâtes", "cahiers", "tubes de dentifrice"]);
return { titre: "Quelle offre choisir ?", q: "Tu veux acheter " + M(o[1]) + " " + it + " identiques. Deux magasins : l'un fait " + o[0] + ", l'autre fait −" + pc(D) + " sur chaque article (même prix de départ).",
bet: { q: "Où paies-tu le moins ?", choices: [o[0].replace(/« |»/g, "").trim(), "−" + D + " % sur chaque article", "C'est pareil"], good },
calc: { label: "Quelle réduction en % représente " + o[0] + " ? (au dixième)", value: Math.round(eff * 10) / 10, round: 0.1 },
reveal: "Tu paies " + N(o[2]).replace("{,}", ",") + " article" + (o[2] > 1 ? "s" : "") + " sur " + o[1] + " : " + M("\\frac{" + N(o[2]) + "}{" + o[1] + "} \\approx " + N(o[2] / o[1], 3)) + ", soit une réduction de " + pc(eff, 1) + ". " + (good === 2 ? "Exactement autant que −" + D + " %." : good === 0 ? "C'est mieux que −" + D + " %." : "C'est moins bien que −" + D + " %.") };
} });
add({ key: "graphe", fam: "arnaque", uses: ["pct", "diagr"], outil: "la lecture critique d'un graphique : l'axe vertical ne commence pas à 0, les barres exagèrent l'écart. On calcule l'augmentation en %.",
make() {
const v1 = R.int(92, 97), d = R.int(2, 4), v2 = v1 + d, base = v1 - 1, k = d + 1, who = pk(["clients satisfaits (sur 100)", "élèves inscrits", "ventes (en milliers)"]);
const Y = (v) => 150 - ((v - base) / (v2 - base)) * 115;
let g = '<line x1="60" y1="150" x2="280" y2="150" class="f-line"/><line x1="60" y1="20" x2="60" y2="150" class="f-line"/>';
for (let v = base; v <= v2; v++) g += '<line x1="55" y1="' + Y(v) + '" x2="60" y2="' + Y(v) + '" class="f-line"/><text x="50" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="11" class="f-txt">' + v + "</text>";
g += '<rect x="95" y="' + Y(v1) + '" width="60" height="' + (150 - Y(v1)) + '" class="f-fill2"/><rect x="185" y="' + Y(v2) + '" width="60" height="' + (150 - Y(v2)) + '" fill="var(--margin)" fill-opacity="0.75"/>';
g += '<text x="125" y="168" text-anchor="middle" font-size="12" class="f-txt">Avant</text><text x="215" y="168" text-anchor="middle" font-size="12" class="f-txt">Après</text>';
const fig = '<svg class="fig" viewBox="0 0 300 176" role="img" aria-label="diagramme en barres dont l\'axe commence à ' + base + '">' + g + "</svg>";
return { titre: "Le graphique de la pub", q: "Une publicité montre ce graphique des " + who + " : « Grâce à notre nouvelle méthode, regardez la différence ! »", fig,
bet: { q: "La barre « Après » est " + k + " fois plus haute. Le nombre a-t-il été multiplié par " + k + " ?", choices: ["Oui, à peu près ×" + k, "Non : il a augmenté de quelques %", "On ne peut pas le savoir"], good: 1 },
calc: { label: "De combien de % a-t-il augmenté ? (au dixième)", value: Math.round(((v2 - v1) / v1) * 1000) / 10, round: 0.1 },
reveal: "L'axe commence à " + base + ", pas à 0 : les barres ne montrent que ce qui dépasse " + base + ". En réalité, de " + v1 + " à " + v2 + " : " + M("\\frac{" + d + "}{" + v1 + "} \\approx " + N(d / v1, 3)) + ", soit " + pc(((v2 - v1) / v1) * 100, 1) + " d'augmentation." };
} });
add({ key: "pizza", fam: "arnaque", uses: ["disque"], outil: "l'aire du disque : π · r². Doubler le nombre de pizzas ne double pas le diamètre !",
make() {
const [D, d] = pk([[40, 28], [30, 20], [32, 22], [36, 26], [34, 24]]), A1 = Math.PI * (D / 2) ** 2, A2 = 2 * Math.PI * (d / 2) ** 2;
return { titre: "La grande ou les deux petites ?", q: "Même prix : une pizza de " + M(D + "\\ \\text{cm}") + " de diamètre, ou deux pizzas de " + M(d + "\\ \\text{cm}") + ".",
bet: { q: "Où y a-t-il le plus à manger ?", choices: ["La grande", "Les deux petites", "C'est pareil"], good: A1 > A2 ? 0 : 1 },
calc: { label: "Aire totale des deux petites pizzas (en cm², à l'unité)", value: Math.round(A2), round: 1 },
reveal: "Grande : " + M("\\pi \\cdot " + D / 2 + "^2 \\approx " + N(A1, 0)) + " cm². Deux petites : " + M("2 \\cdot \\pi \\cdot " + d / 2 + "^2 \\approx " + N(A2, 0)) + " cm². " + (A1 > A2 ? "La grande gagne, alors que " + M("2 \\cdot " + d + " = " + 2 * d) + " cm semble bien plus que " + D + " cm : l'aire dépend du <b>carré</b> du rayon." : "Les deux petites gagnent, de peu : l'aire dépend du <b>carré</b> du rayon, il faut calculer.") };
} });
add({ key: "credit", fam: "arnaque", uses: ["pct"], outil: "le calcul du coût total et le pourcentage d'augmentation : « seulement … par mois » cache souvent un supplément.",
make() {
const P = pk([799, 899, 999, 1199]), n = pk([24, 36]), f = pk([1.12, 1.18, 1.25]), m = Math.ceil((P * f) / n), tot = m * n, plus = ((tot - P) / P) * 100;
const obj = pk([["Un téléphone", "coûte"], ["Un ordinateur portable", "coûte"], ["Une console et deux jeux", "coûtent"]]);
return { titre: "« Seulement … par mois »", q: obj[0] + " " + obj[1] + " " + chf(P) + " comptant. La pub propose : « Seulement " + chf(m) + " par mois pendant " + n + " mois ! »",
bet: { q: "Au total, avec les mensualités, tu paies…", choices: ["à peu près le même prix", "un peu plus (moins de 5 % de plus)", "nettement plus (plus de 10 % de plus)"], good: 2 },
calc: { label: "Combien paies-tu en tout ? (en CHF)", value: tot },
reveal: M(m + " \\cdot " + n + " = " + N(tot)) + " CHF, soit " + M(N(tot - P)) + " CHF de plus que le prix comptant : " + pc(plus, 1) + " de plus." };
} });
add({ key: "tva", fam: "arnaque", sys: "CH", uses: ["pct"], outil: "les pourcentages : retrouver le prix avant une hausse, c'est diviser par 1,081, pas enlever 8,1 %.",
make() {
const HT = pk([200, 250, 400, 600, 1200]), TTC = r6(HT * 1.081), wrong = r6(TTC * 0.919);
return { titre: "Le prix hors taxe", q: "En Suisse, la TVA est de " + pc(8.1) + " : le prix TTC est le prix hors taxe augmenté de 8,1 %. Un vendeur affiche " + chf(TTC) + " TTC et dit : « Pour le prix hors taxe, j'enlève 8,1 % : " + chf(wrong) + ". »",
bet: { q: "A-t-il raison ?", choices: ["Oui, c'est le bon prix hors taxe", "Non, le vrai prix hors taxe est un peu plus élevé", "Non, le vrai prix hors taxe est un peu plus bas"], good: 1 },
calc: { label: "Quel est le vrai prix hors taxe ? (en CHF)", value: HT, round: 0.01 },
reveal: "TTC = HT · 1,081, donc HT = " + M(N(TTC) + " \\div 1{,}081 = " + N(HT)) + " CHF. Les 8,1 % se calculent sur le prix hors taxe, plus petit : enlever 8,1 % du prix TTC enlève trop (" + chf(r6(TTC - wrong)) + " au lieu de " + chf(r6(TTC - HT)) + ")." };
} });
add({ key: "points", fam: "arnaque", uses: ["pct"], outil: "la différence entre « points de pourcentage » et pourcentage d'augmentation.",
make() {
const t1 = pk([2, 4, 5]), d = pk([1, 2]), t2 = t1 + d, rel = (d / t1) * 100, what = pk([["Le taux d'intérêt de ton compte épargne", "ce taux"], ["Le taux de chômage d'une région", "ce taux"], ["La part d'élèves qui viennent à vélo", "cette part"]]);
return { titre: "Le titre du journal", q: what[0] + " passe de " + pc(t1) + " à " + pc(t2) + ". Le journal titre : « Hausse de " + d + " % ! »",
bet: { q: "Ce titre décrit-il bien la hausse ?", choices: ["Oui, c'est une hausse de " + d + " %", "Non : en proportion, la hausse est bien plus forte", "Non : la hausse est plus faible"], good: 1 },
calc: { label: "De combien de % " + what[1] + " a-t-" + (what[1] === "cette part" ? "elle" : "il") + " augmenté, par rapport à sa valeur de départ ?", value: rel },
reveal: "Il a gagné " + d + " <b>point" + (d > 1 ? "s" : "") + "</b> de pourcentage. Mais par rapport au départ : " + M("\\frac{" + d + "}{" + t1 + "} = " + N(d / t1)) + ", soit une hausse de " + pc(rel) + ". Les deux phrases sont différentes ; les journaux les confondent souvent." };
} });
add({ key: "gratuit", fam: "arnaque", uses: ["pct"], outil: "la proportionnalité et les pourcentages : « +50 % gratuit » baisse le prix unitaire de 33,3 %, pas de 50 %.",
make() {
const [b, red] = pk([[25, 20], [50, 100 / 3], [100, 50]]), D = pk(b === 50 ? [30, 35, 40] : b === 25 ? [20, 25, 30] : [40, 45, 50]), good = Math.abs(red - D) < 1e-9 ? 2 : red > D ? 0 : 1;
const it = pk(["paquet de céréales", "flacon de gel douche", "sachet de bonbons"]);
return { titre: "Plus de produit ou moins cher ?", q: "Deux offres pour le même " + it + " : « +" + pc(b) + " de produit gratuit » (même prix, plus de contenu), ou « −" + pc(D) + " sur le prix »." ,
bet: { q: "Quelle offre baisse le plus le prix de chaque gramme ?", choices: ["+" + b + " % gratuit", "−" + D + " % sur le prix", "C'est pareil"], good },
calc: { label: "« +" + b + " % gratuit » : de combien de % baisse le prix d'un gramme ? (au dixième)", value: Math.round(red * 10) / 10, round: 0.1 },
reveal: "Pour le même prix, tu as " + M(N(1 + b / 100)) + " fois plus : chaque gramme coûte " + M("\\frac{1}{" + N(1 + b / 100) + "} \\approx " + N(1 / (1 + b / 100), 3)) + " du prix, soit " + pc(red, 1) + " de moins. " + (good === 2 ? "Exactement comme −" + D + " %." : good === 0 ? "Mieux que −" + D + " %." : "Moins bien que −" + D + " % : « +" + b + " % » impressionne plus qu'il ne rapporte.") };
} });


add({ key: "corde", fam: "paradoxe", uses: ["disque"], outil: "le périmètre du cercle : P = 2πr. Rallonger le périmètre de L augmente le rayon de L ÷ 2π, quelle que soit la taille du cercle.",
make() {
const L = pk([1, 2, 3]), h = (100 * L) / (2 * Math.PI);
return { titre: "La corde autour de la Terre", q: "On tend une corde tout autour de la Terre, le long de l'équateur (environ " + M("40\\text{'}000\\ \\text{km}") + "). Puis on la rallonge de " + M(L + "\\ \\text{m}") + " et on la soulève partout à la même hauteur.",
bet: { q: "À quelle hauteur au-dessus du sol se trouve-t-elle ?", choices: ["Moins d'un millimètre", "Environ un centimètre", "Assez haut pour qu'un chat " + (L === 1 ? "maigre " : "") + "passe dessous"], good: 2 },
calc: { label: "Calcule cette hauteur (en cm, au dixième)", value: Math.round(h * 10) / 10, round: 0.1 },
reveal: "Périmètre " + M("P = 2\\pi r") + ". Si " + M("P") + " grandit de " + M(L + "\\ \\text{m}") + ", " + M("r") + " grandit de " + M("\\frac{" + L + "}{2\\pi} \\approx " + N(h / 100, 3)) + " m, soit " + M(N(h, 1) + "\\ \\text{cm}") + ". Surprise : ce résultat ne dépend pas du rayon de la Terre. Ce serait pareil autour d'un ballon de foot !" };
} });
add({ key: "tete", fam: "paradoxe", uses: ["disque"], outil: "le périmètre du cercle : la tête décrit un cercle de rayon plus grand (r + ta taille).",
make() {
const t = pk([1.55, 1.6, 1.65, 1.7]), d = 2 * Math.PI * t;
return { titre: "La tête ou les pieds ?", q: "Imagine que tu fasses le tour de la Terre à pied, le long de l'équateur. Tu mesures " + M(t.toFixed(2).replace(".", "{,}") + "\\ \\text{m}") + ".",
bet: { q: "Qui parcourt la plus grande distance ?", choices: ["Tes pieds", "Ta tête, de quelques millimètres", "Ta tête, de plusieurs mètres", "Les deux, exactement autant"], good: 2 },
calc: { label: "De combien de mètres la tête parcourt-elle plus que les pieds ? (au dixième)", value: Math.round(d * 10) / 10, round: 0.1 },
reveal: "Les pieds décrivent un cercle de rayon " + M("r") + ", la tête un cercle de rayon " + M("r + " + N(t)) + ". Différence : " + M("2\\pi (r + " + N(t) + ") - 2\\pi r = 2\\pi \\cdot " + N(t) + " \\approx " + N(d, 1)) + " m. Encore une fois, le rayon de la Terre a disparu du calcul." };
} });
add({ key: "vmoy", fam: "paradoxe", uses: ["vitesse"], outil: "la vitesse moyenne : distance totale ÷ durée totale (et non la moyenne des deux vitesses).",
make() {
const [v1, v2, d] = pk([[60, 40, 120], [30, 60, 60], [60, 90, 180], [40, 120, 120], [50, 75, 150], [80, 120, 240]]), t1 = d / v1, t2 = d / v2, vm = (2 * d) / (t1 + t2), veh = pk(["en voiture", "en scooter", "en bus"]);
return { titre: "L'aller et le retour", q: "Tu fais " + M(d + "\\ \\text{km}") + " " + veh + " à " + M(v1 + "\\ \\text{km/h}") + " de moyenne, puis le même trajet au retour à " + M(v2 + "\\ \\text{km/h}") + ".",
bet: { q: "Ta vitesse moyenne sur l'aller-retour est…", choices: ["exactement " + String((v1 + v2) / 2).replace(".", ",") + " km/h", "moins de " + String((v1 + v2) / 2).replace(".", ",") + " km/h", "plus de " + String((v1 + v2) / 2).replace(".", ",") + " km/h"], good: 1 },
calc: { label: "Calcule ta vitesse moyenne (en km/h)", value: vm },
reveal: "Aller : " + M(d + " \\div " + v1 + " = " + N(t1)) + " h ; retour : " + M(d + " \\div " + v2 + " = " + N(t2)) + " h. Vitesse moyenne : " + M(2 * d + " \\div " + N(t1 + t2) + " = " + N(vm)) + " km/h. Tu passes plus de temps à la vitesse lente : elle pèse plus dans la moyenne." };
} });
add({ key: "patates", fam: "paradoxe", uses: ["pct"], outil: "les pourcentages : ce qui ne change pas (la matière sèche) sert de point d'appui.",
make() {
const m = pk([50, 100, 200]), [w1, w2] = pk([[99, 98], [99, 97], [98, 96], [99, 96]]), dry = (m * (100 - w1)) / 100, F = dry / ((100 - w2) / 100), [food, fem] = pk([["pommes de terre", 1], ["concombres", 0], ["pastèques", 1]]), E = fem ? "elles" : "ils", fa = fem ? "faites" : "faits";
return { titre: "Les " + food + " qui sèchent", q: "Tu as " + M(m + "\\ \\text{kg}") + " de " + food + ", " + fa + " à " + pc(w1) + " d'eau. Tu les laisses sécher au soleil, et maintenant " + E + " sont " + fa + " à " + pc(w2) + " d'eau.",
bet: { q: "Combien pèsent-" + E + " maintenant ?", choices: ["Presque pareil (un peu moins de " + m + " kg)", "Environ les trois quarts", "Beaucoup moins : la moitié ou moins"], good: 2 },
calc: { label: "Leur masse maintenant (en kg)", value: r6(F) },
reveal: "La matière sèche ne s'évapore pas : " + pc(100 - w1) + " de " + m + " kg = " + M(N(dry)) + " kg. Maintenant, elle représente " + pc(100 - w2) + " de la masse : " + M(N(dry) + " \\div " + N((100 - w2) / 100) + " = " + N(F)) + " kg. La part sèche a été multipliée par " + N((100 - w2) / (100 - w1)) + " : la masse est divisée d'autant." };
} });
add({ key: "monty", fam: "paradoxe", uses: ["proba"], outil: "les probabilités : ton premier choix a 1 chance sur 3 d'être bon ; l'animateur, qui sait, ne change pas cela.",
make() {
const c = pk([
{ n: "portes", un: "une porte", lot: "une voiture", vides: "des chèvres", d: "derrière l'une", d2: "derrière les deux autres", v: "ouvre une des deux autres, derrière laquelle il y a une chèvre", ch: "une" },
{ n: "gobelets", un: "un gobelet", lot: "une bille", vides: "rien", d: "sous l'un", d2: "sous les deux autres", v: "soulève un des deux autres : il est vide", ch: "un" },
{ n: "boîtes", un: "une boîte", lot: "un billet de concert", vides: "des chaussettes", d: "dans l'une", d2: "dans les deux autres", v: "ouvre une des deux autres : des chaussettes", ch: "une" }]);
return { titre: "Garder ou changer ?", q: "Il y a 3 " + c.n + " : " + c.d + " se trouve " + c.lot + ", " + c.d2 + ", " + c.vides + ". Tu en choisis " + c.ch + ". L'animateur, qui sait où est le lot, " + c.v + ". Il te propose de changer pour " + (c.ch === "un" ? "le dernier" : "la dernière") + ".",
bet: { q: "Que fais-tu ?", choices: ["Je garde mon choix", "Je change", "C'est pareil : une chance sur deux"], good: 1 },
calc: { label: "Probabilité de gagner si tu changes (fraction)", value: 2 / 3 },
reveal: "Ton premier choix est bon dans 1 cas sur 3 : alors changer fait perdre. Dans les 2 autres cas, tu as choisi " + c.un + " perdant" + (c.ch === "une" ? "e" : "") + ", l'animateur est <b>obligé</b> de montrer l'autre mauvais, et changer fait gagner. Donc " + M("P(\\text{gagner en changeant}) = \\frac{2}{3}") + ". Fais l'essai avec 3 cartes et un ami : sur 30 parties, tu verras." };
} });
add({ key: "anniv", fam: "paradoxe", uses: ["proba"], outil: "le dénombrement : avec n personnes, il y a n(n − 1) ÷ 2 paires possibles, bien plus qu'on ne croit.",
make() {
const n = pk([23, 25, 28, 30]), pairs = (n * (n - 1)) / 2; let q = 1; for (let k = 0; k < n; k++) q *= (365 - k) / 365; const p = (1 - q) * 100;
return { titre: "Le même anniversaire", q: "Dans une classe de " + M(n) + " élèves, on cherche deux élèves nés le même jour de l'année (pas forcément la même année).",
bet: { q: "La probabilité d'en trouver au moins deux est…", choices: ["très petite (moins de 10 %)", "environ 1 chance sur 2, ou plus", "presque certaine (plus de 99 %)"], good: 1 },
calc: { label: "Combien de paires d'élèves différentes peut-on former dans cette classe ?", value: pairs },
reveal: "Chaque élève forme une paire avec les " + (n - 1) + " autres : " + M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + pairs) + " paires (on divise par 2, car la paire A-B est la même que B-A). Chacune a une petite chance d'être « gagnante », mais il y en a beaucoup : la probabilité vaut environ " + pc(p, 0) + ". Teste avec ta classe !" };
} });
add({ key: "pliage", fam: "paradoxe", uses: ["puiss"], outil: "les puissances : chaque pliage multiplie l'épaisseur par 2, donc k pliages par 2^k.",
make() {
const k = pk([8, 10, 12]), e = 0.01 * 2 ** k, lune = (0.1 * 2 ** 42) / 1e6;
return { titre: "Plier une feuille", q: "Une feuille de papier a une épaisseur de " + M("0{,}1\\ \\text{mm}") + ". À chaque pliage en deux, son épaisseur double. (En vrai, on ne réussit pas plus de 7 ou 8 pliages.)",
bet: { q: "Si on pouvait la plier 42 fois, son épaisseur serait…", choices: ["celle d'un immeuble", "la hauteur du Cervin", "plus que la distance Terre–Lune"], good: 2 },
calc: { label: "Épaisseur après " + k + " pliages (en cm, au dixième)", value: Math.round(e * 10) / 10, round: 0.1 },
reveal: "Après " + k + " pliages : " + M("0{,}1 \\cdot 2^{" + k + "} = " + N(0.1 * 2 ** k)) + " mm, soit " + M(N(e, 1)) + " cm. Après 42 : " + M("0{,}1 \\cdot 2^{42}") + " mm ≈ " + M(N(Math.round(lune / 1000) * 1000)) + " km. La Lune est à environ 384'000 km : on la dépasse !" };
} });
add({ key: "centimes", fam: "paradoxe", uses: ["puiss"], outil: "les puissances de 2 : une croissance qui double chaque jour finit par exploser (croissance exponentielle).",
make() {
const big = pk([10000, 100000, 1000000]), j = pk([15, 18, 20]), vj = 2 ** (j - 1) / 100, v30 = 2 ** 29 / 100;
return { titre: "Le cadeau qui double", q: "On te propose deux cadeaux. A : " + chf(big) + " tout de suite. B : 1 centime le 1er jour, 2 centimes le 2e, 4 le 3e… le montant double chaque jour, pendant 30 jours (tu reçois le montant du 30e jour).",
bet: { q: "Que choisis-tu ?", choices: ["Le cadeau A", "Le cadeau B", "C'est à peu près pareil"], good: 1 },
calc: { label: "Combien reçois-tu le " + j + "e jour avec B ? (en CHF)", value: vj, round: 0.01 },
reveal: "Le jour " + M("n") + ", on reçoit " + M("2^{n-1}") + " centimes. Jour " + j + " : " + M("2^{" + (j - 1) + "} = " + N(2 ** (j - 1))) + " centimes = " + chf(vj) + ". Jour 30 : " + M("2^{29}") + " centimes ≈ " + chf(Math.round(v30)) + " !" };
} });
add({ key: "cube", fam: "paradoxe", uses: ["vol", "puiss"], outil: "l'agrandissement : longueurs ×k, aires ×k², volumes ×k³.",
make() {
const k = pk([2, 3]), a = pk([2, 3, 4, 5]), obj = pk(["un cube de chocolat", "une boîte cubique", "un dé en bois"]);
return { titre: "Deux fois plus grand ?", q: "On fabrique " + obj + " d'arête " + M(a + "\\ \\text{cm}") + ". Puis un modèle " + (k === 2 ? "deux" : "trois") + " fois plus grand : toutes les longueurs sont multipliées par " + M(k) + ".",
bet: { q: "Le volume est multiplié par…", choices: [String(k), String(k * k), String(k ** 3)], good: 2 },
calc: { label: "Volume du grand modèle (en cm³)", value: (k * a) ** 3 },
reveal: "Petit : " + M(a + "^3 = " + a ** 3) + " cm³. Grand : arête " + M(k * a) + " cm, " + M((k * a) + "^3 = " + (k * a) ** 3) + " cm³, soit " + M(k ** 3) + " fois plus (" + M(k + " \\cdot " + k + " \\cdot " + k) + " : une fois par dimension). C'est pour ça qu'un éléphant a des pattes si épaisses." };
} });
add({ key: "des", fam: "paradoxe", uses: ["proba"], outil: "les probabilités : on compte les cas favorables parmi les 36 cas également probables.",
make() {
const s = pk([5, 6, 8, 9, 10]), fav = 6 - Math.abs(7 - s), g = gcd(fav, 36);
return { titre: "La somme des deux dés", q: "On lance deux dés et on additionne les points. Ton ami parie sur " + M(s) + ", toi sur " + M(12) + ".",
bet: { q: "Qui a le plus de chances de gagner ?", choices: ["Toi (12)", "Ton ami (" + s + ")", "C'est pareil : toutes les sommes se valent"], good: 1 },
calc: { label: "Probabilité d'obtenir une somme de " + s + " (fraction)", value: fav / 36 },
reveal: "Il y a " + M("6 \\cdot 6 = 36") + " résultats également probables (dé 1, dé 2). Pour 12, un seul : (6 ; 6). Pour " + s + " : " + fav + " cas, donc " + M("\\frac{" + fav + "}{36}" + (g > 1 ? " = \\frac{" + fav / g + "}{" + 36 / g + "}" : "")) + ". La somme 7 est la plus fréquente (6 cas)." };
} });
add({ key: "moyenne", fam: "paradoxe", uses: ["diagr"], outil: "la moyenne est sensible aux valeurs extrêmes ; la médiane l'est beaucoup moins.",
make() {
const n = pk([9, 19]), s = pk([4500, 5000, 5500]), boss = pk([40000, 60000, 80000]), mean = (n * s + boss) / (n + 1);
return { titre: "Le salaire moyen", q: "Une petite entreprise : " + M(n) + " employés gagnent " + chf(s) + " par mois, la patronne " + chf(boss) + ". L'annonce d'emploi dit : « Salaire moyen chez nous : " + chf(Math.round(mean)) + " ! »",
bet: { q: "Ce salaire moyen donne-t-il une bonne idée de ce que tu gagnerais ?", choices: ["Oui, c'est ce que gagnent la plupart", "Non : il est gonflé par un seul salaire", "Non : il est trop bas"], good: 1 },
calc: { label: "Calcule ce salaire moyen (en CHF, à l'unité)", value: Math.round(mean), round: 1 },
reveal: "Moyenne : " + M("\\frac{" + n + " \\cdot " + N(s) + " + " + N(boss) + "}{" + (n + 1) + "} \\approx " + N(mean, 0)) + " CHF. Pourtant, " + n + " personnes sur " + (n + 1) + " gagnent " + chf(s) + " : c'est la <b>médiane</b>. Une seule valeur extrême tire la moyenne vers le haut." };
} });



const P = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const mag = (v, opts) => { const good = opts.findIndex((o, i) => i === opts.length - 1 || v < Math.sqrt(o * opts[i + 1])); return good; };
add({ key: "coeur", fam: "fermi", uses: ["decmul"], outil: "la multiplication et les conversions de durées (minutes → heures → jours → année).",
make() {
const b = pk([60, 70, 80]), v = b * 60 * 24 * 365, opts = [40000, 4e6, 4e7, 4e9];
return { titre: "Boum-boum", q: "Au repos, ton cœur bat environ " + M(b) + " fois par minute.",
bet: { q: "Combien de fois bat-il en une année ?", choices: ["environ 40'000 fois", "environ 4 millions de fois", "environ 40 millions de fois", "environ 4 milliards de fois"], good: mag(v, opts) },
calc: { label: "Calcule le nombre de battements en une année (365 jours)", value: v, range: [v * 0.95, v * 1.05] },
reveal: M(b + " \\cdot 60 \\cdot 24 \\cdot 365 = " + N(v)) + " : plus de " + P(Math.floor(v / 1e6)) + " millions de battements par an, sans jamais s'arrêter." };
} });
add({ key: "cheveux", fam: "fermi", uses: ["decmul"], outil: "la multiplication par un grand nombre et les conversions (mm → m).",
make() {
const n = pk([100000, 120000, 150000]), g = pk([0.3, 0.35, 0.4]), v = (n * g) / 1000;
return { titre: "Tes cheveux poussent", q: "Tu as environ " + M(N(n)) + " cheveux sur la tête. Chacun pousse d'environ " + M(N(g) + "\\ \\text{mm}") + " par jour.",
bet: { q: "Mis bout à bout, de combien tes cheveux poussent-ils en tout chaque jour ?", choices: ["quelques millimètres", "quelques centimètres", "quelques mètres", "plusieurs dizaines de mètres"], good: 3 },
calc: { label: "Longueur totale poussée en un jour (en m)", value: r6(v), range: [v * 0.95, v * 1.05] },
reveal: M(N(n) + " \\cdot " + N(g) + " = " + N(n * g)) + " mm, soit " + M(N(v)) + " m par jour, à peu près la longueur d'une piscine !" };
} });
add({ key: "leman", fam: "fermi", sys: "CH", uses: ["decdiv"], outil: "la division et les conversions de longueurs (km → m).",
make() {
const f = pk([200, 250]), L = pk([12.5, 11]), rl = (f * L) / 100, v = 200000 / rl;
return { titre: "Le tour du Léman en papier toilette", q: "La rive du Léman mesure environ " + M("200\\ \\text{km}") + ". Un rouleau de papier toilette a " + M(f) + " feuilles de " + M(N(L) + "\\ \\text{cm}") + ".",
bet: { q: "Combien de rouleaux pour faire le tour du lac ?", choices: ["environ 80", "environ 800", "environ 8'000", "environ 80'000"], good: mag(v, [80, 800, 8000, 80000]) },
calc: { label: "Nombre de rouleaux nécessaires (arrondi)", value: Math.round(v), range: [v * 0.95, v * 1.05] },
reveal: "Un rouleau : " + M(f + " \\cdot " + N(L) + " = " + N(f * L)) + " cm = " + M(N(rl)) + " m. " + M("200\\text{'}000 \\div " + N(rl) + " \\approx " + N(Math.round(v))) + " rouleaux." };
} });
add({ key: "milliard", fam: "fermi", uses: ["decdiv"], outil: "la division et les conversions de durées (secondes → années).",
make() {
const what = pk([["un milliard de secondes", 1e9, "ans"], ["un million de secondes", 1e6, "jours"]]), v = what[2] === "ans" ? what[1] / (3600 * 24 * 365) : what[1] / (3600 * 24);
const ch = what[2] === "ans" ? ["environ 3 ans", "environ 32 ans", "plus de 300 ans"] : ["environ 1 jour", "environ 12 jours", "environ 1 an"];
return { titre: "Un " + what[0].split(" ")[1] + " de secondes", q: "On fête souvent les anniversaires en années. Et si on fêtait " + what[0] + " ?",
bet: { q: what[0].charAt(0).toUpperCase() + what[0].slice(1) + ", ça dure…", choices: ch, good: 1 },
calc: { label: "Combien " + (what[2] === "ans" ? "d'années" : "de jours") + " ? (au dixième)", value: Math.round(v * 10) / 10, range: [v * 0.92, v * 1.08] },
reveal: what[2] === "ans" ? "Une année : " + M("3600 \\cdot 24 \\cdot 365 = 31\\text{'}536\\text{'}000") + " s. " + M("10^9 \\div 31\\text{'}536\\text{'}000 \\approx " + N(v, 1)) + " ans. Un milliard, c'est mille fois un million !" : "Un jour : " + M("3600 \\cdot 24 = 86\\text{'}400") + " s. " + M("1\\text{'}000\\text{'}000 \\div 86\\text{'}400 \\approx " + N(v, 1)) + " jours. Et un milliard de secondes ? Environ 32 ans !" };
} });
add({ key: "pas", fam: "fermi", uses: ["decdiv"], outil: "la division et les conversions (km → m).",
make() {
const [trip, d] = pk([["de Genève à Lausanne", 60], ["de Genève à Nyon", 25], ["de Lausanne à Montreux", 28]]), p = pk([0.6, 0.7, 0.75]), v = (d * 1000) / p;
return { titre: "À pied !", q: "Tu marches " + trip + " (environ " + M(d + "\\ \\text{km}") + "). Un de tes pas mesure environ " + M(N(p) + "\\ \\text{m}") + ".",
bet: { q: "Combien de pas fais-tu ?", choices: ["moins de 10'000", "entre 10'000 et 200'000", "plus d'un million"], good: v < 1e4 ? 0 : v < 2e5 ? 1 : 2 },
calc: { label: "Calcule le nombre de pas (arrondi)", value: Math.round(v), range: [v * 0.97, v * 1.03] },
reveal: M(d + "\\ \\text{km} = " + N(d * 1000) + "\\ \\text{m}") + " ; " + M(N(d * 1000) + " \\div " + N(p) + " \\approx " + N(Math.round(v))) + " pas. Une montre connectée en compte environ 10'000 par jour chez quelqu'un d'actif." };
} });
add({ key: "compter", fam: "fermi", uses: ["decdiv"], outil: "la division et les conversions de durées.",
make() {
const n = pk([1e6, 1e5]), v = n / 86400;
return { titre: "Compter jusqu'à " + P(n), q: "Tu comptes à voix haute : un nombre par seconde, sans jamais t'arrêter (ni pour dormir, ni pour manger).",
bet: { q: "Combien de temps pour arriver à " + P(n) + " ?", choices: n === 1e6 ? ["environ 3 heures", "environ 12 jours", "environ 1 an"] : ["environ 1 heure", "environ un jour", "environ un mois"], good: 1 },
calc: { label: "Combien de jours ? (au dixième)", value: Math.round(v * 10) / 10, range: [v * 0.92, v * 1.08] },
reveal: "Un jour = " + M("24 \\cdot 3600 = 86\\text{'}400") + " s. " + M(N(n) + " \\div 86\\text{'}400 \\approx " + N(v, 1)) + " jour" + (v >= 2 ? "s" : "") + ". En vrai, les grands nombres se disent lentement : « sept cent quatre-vingt-dix-neuf mille… » prend plus d'une seconde !" };
} });
add({ key: "douche", fam: "fermi", uses: ["decmul"], outil: "la multiplication et la comparaison de volumes (litres).",
make() {
const deb = pk([8, 10, 12]), m = pk([5, 8, 10]), v = deb * m * 365, bain = 150;
return { titre: "L'eau de la douche", q: "Une douche coule environ " + M(deb + "\\ \\text{L}") + " par minute. Tu prends chaque jour une douche de " + M(m + "\\ \\text{min}") + ".",
bet: { q: "En une année, cela fait combien de baignoires pleines (" + bain + " L) ?", choices: ["moins de 10", "entre 10 et 50", "entre 50 et 500", "plus de 500"], good: v / bain < 10 ? 0 : v / bain < 50 ? 1 : v / bain < 500 ? 2 : 3 },
calc: { label: "Litres d'eau en une année", value: v, range: [v * 0.97, v * 1.03] },
reveal: M(deb + " \\cdot " + m + " \\cdot 365 = " + N(v)) + " litres, soit environ " + P(v / bain) + " baignoires (" + M(N(v) + " \\div " + bain) + ")." };
} });


add({ key: "poignees", fam: "enigme", uses: [], outil: "le dénombrement : chacun serre n − 1 mains, et chaque poignée est comptée deux fois.",
make() {
const n = R.int(6, 14), v = (n * (n - 1)) / 2, ctx = pk(["À une fête", "Au début d'un match de basket", "Pour le dernier jour de l'année"]);
return { titre: "Les poignées de main", q: ctx + ", " + M(n) + " personnes se serrent toutes la main, une seule fois par paire.",
bet: { q: "Combien de poignées de main en tout ?", choices: ["moins de " + 2 * n, "entre " + 2 * n + " et " + n * n, "plus de " + n * n], good: v < 2 * n ? 0 : v <= n * n ? 1 : 2 },
calc: { label: "Nombre de poignées de main", value: v },
reveal: "Chacun serre " + M(n - 1) + " mains : " + M(n + " \\cdot " + (n - 1) + " = " + n * (n - 1)) + ". Mais chaque poignée relie deux personnes : on l'a comptée deux fois. " + M(n * (n - 1) + " \\div 2 = " + v) + "." };
} });
add({ key: "chaussettes", fam: "enigme", uses: [], outil: "le raisonnement du « pire cas » (principe des tiroirs).",
make() {
const r = R.int(5, 12), b = R.int(5, 12), two = R.rand() < 0.5, v = two ? b + 2 : 3;
return { titre: "Dans le noir", q: "Ton tiroir contient " + M(r) + " chaussettes rouges et " + M(b) + " bleues, toutes mélangées. Il fait noir : tu ne vois pas les couleurs.",
bet: { q: two ? "Combien dois-tu en prendre, au minimum, pour être <b>sûr</b> d'avoir deux rouges ?" : "Combien dois-tu en prendre, au minimum, pour être <b>sûr</b> d'avoir deux chaussettes de la même couleur ?", choices: two ? ["2", String(b + 2), String(r + b)] : ["3", String(Math.max(r, b) + 1), String(r + b)], good: two ? 1 : 0 },
calc: { label: "Nombre minimum de chaussettes", value: v },
reveal: two ? "Pire cas : tu tires d'abord les " + b + " bleues. Il en faut encore 2, forcément rouges : " + M(b + " + 2 = " + (b + 2)) + "." : "Avec 2 chaussettes, tu peux avoir une rouge et une bleue. La 3e est forcément de la même couleur que l'une des deux : 3 suffisent, quel que soit le nombre de chaussettes !" };
} });
add({ key: "gauss", fam: "enigme", uses: [], outil: "l'astuce de Gauss : on additionne la somme avec elle-même à l'envers, chaque paire vaut n + 1.",
make() {
const n = pk([40, 50, 60, 80, 100, 200]), v = (n * (n + 1)) / 2;
return { titre: "L'astuce du petit Gauss", q: "Vers 1785, un maître d'école demande à ses élèves d'additionner tous les nombres de 1 à " + M(n) + ". Le petit Carl Friedrich Gauss répond au bout d'une minute.",
bet: { q: "Le résultat est environ…", choices: [P(n * 10), P(n * n / 2), P(n * n * 5)], good: 1 },
calc: { label: "Calcule " + M("1 + 2 + 3 + \\dots + " + n), value: v },
reveal: "Écris la somme deux fois, à l'endroit et à l'envers : " + M("(1 + " + n + ") + (2 + " + (n - 1) + ") + \\dots") + ". Chaque paire vaut " + M(n + 1) + ", et il y a " + M(n) + " paires : " + M(n + " \\cdot " + (n + 1) + " = " + N(n * (n + 1))) + ". C'est le double de la somme : " + M(N(n * (n + 1)) + " \\div 2 = " + N(v)) + "." };
} });
add({ key: "carres", fam: "enigme", uses: [], outil: "le dénombrement méthodique : on compte les carrés taille par taille (1 × 1, 2 × 2, …).",
make() {
const k = pk([3, 4, 5]), v = (k * (k + 1) * (2 * k + 1)) / 6, s = 150 / k;
let g = ""; for (let i = 0; i <= k; i++) g += '<line x1="' + (75 + i * s) + '" y1="10" x2="' + (75 + i * s) + '" y2="160" class="f-line"/><line x1="75" y1="' + (10 + i * s) + '" x2="225" y2="' + (10 + i * s) + '" class="f-line"/>';
const fig = '<svg class="fig" viewBox="0 0 300 170" role="img" aria-label="grille de ' + k + ' sur ' + k + '">' + g + "</svg>";
return { titre: "Combien de carrés ?", q: "Voici une grille de " + M(k + " \\times " + k) + " cases.", fig,
bet: { q: "Combien de carrés en tout (de toutes les tailles) ?", choices: [String(k * k), String(k * k + 1), "plus de " + (k * k + 1)], good: 2 },
calc: { label: "Nombre total de carrés", value: v },
reveal: Array.from({ length: k }, (_, i) => M((i + 1) + " \\times " + (i + 1)) + " : " + (k - i) ** 2).join(" ; ") + ". Total : " + M(Array.from({ length: k }, (_, i) => (k - i) ** 2).join(" + ") + " = " + v) + "." };
} });
add({ key: "escargot", fam: "enigme", uses: [], outil: "le raisonnement pas à pas : le dernier jour, l'escargot sort avant de glisser.",
make() {
const [D, a, b] = pk([[10, 3, 2], [12, 4, 2], [15, 5, 3], [20, 4, 3], [9, 3, 1]]), v = Math.ceil((D - a) / (a - b)) + 1, naive = D / (a - b);
return { titre: "L'escargot dans le puits", q: "Un escargot est au fond d'un puits de " + M(D + "\\ \\text{m}") + ". Chaque jour, il monte de " + M(a + "\\ \\text{m}") + " ; chaque nuit, il glisse de " + M(b + "\\ \\text{m}") + ".",
bet: { q: "Il gagne " + (a - b) + " m par jour… Il sort donc au bout de " + N(naive).replace("{,}", ",") + " jours ?", choices: ["Oui", "Non, il sort avant", "Non, il lui faut plus de temps"], good: 1 },
calc: { label: "Au bout de combien de jours sort-il ?", value: v },
reveal: "Le jour où il part d'au moins " + M(D - a) + " m, il atteint le haut <b>avant</b> la nuit. Pour arriver à " + M(D - a) + " m à raison de " + (a - b) + " m par jour, il faut " + (v - 1) + " jour" + (v > 2 ? "s" : "") + " ; le jour suivant, il sort : " + M(v) + " jours." };
} });
add({ key: "batte", fam: "enigme", uses: [], outil: "la mise en équation : si l'objet le moins cher coûte x, l'autre coûte x + la différence.",
make() {
const [T, d] = pk([[1.1, 1], [2.2, 2], [1.3, 1], [3.4, 3], [5.5, 5]]), v = r6((T - d) / 2), it = pk([["une batte", "une balle"], ["une raquette", "un volant"], ["un stylo", "une gomme"]]);
return { titre: "Le piège du prix", q: it[0].charAt(0).toUpperCase() + it[0].slice(1) + " et " + it[1] + " coûtent ensemble " + chf(T) + ". " + it[0].charAt(0).toUpperCase() + it[0].slice(1) + " coûte " + chf(d) + " de plus " + (/^une? /.test(it[1]) ? "qu'" : "que ") + it[1] + ".",
bet: { q: "Combien coûte " + it[1] + " ?", choices: [(T - d).toFixed(2).replace(".", ",") + " CHF", v.toFixed(2).replace(".", ",") + " CHF", "Impossible à savoir"], good: 1 },
calc: { label: "Prix " + (/^une? /.test(it[1]) ? "d'" : "de ") + it[1] + " (en CHF)", value: v, round: 0.01 },
reveal: "Si " + it[1] + " coûtait " + (T - d).toFixed(2).replace(".", ",") + " CHF, " + it[0] + " coûterait " + T.toFixed(2).replace(".", ",") + " CHF : total " + (2 * T - d).toFixed(2).replace(".", ",") + " CHF, trop ! Avec " + M("x") + " le prix " + (/^une? /.test(it[1]) ? "d'" : "de ") + it[1] + " : " + M("x + (x + " + N(d) + ") = " + N(T)) + ", donc " + M("2x = " + N(r6(T - d))) + " et " + M("x = " + N(v)) + " CHF." };
} });
add({ key: "nenuphar", fam: "enigme", uses: [], outil: "le raisonnement à rebours : si la surface double chaque jour, la veille, elle en couvrait la moitié.",
make() {
const n = pk([20, 30, 40, 48, 60]);
return { titre: "Les nénuphars", q: "Sur un étang, la surface couverte par les nénuphars double chaque jour. Au bout de " + M(n) + " jours, l'étang est entièrement couvert.",
bet: { q: "Au bout de combien de jours était-il à moitié couvert ?", choices: [String(n / 2), String(n - 1), String(n - 2)], good: 1 },
calc: { label: "Jour où l'étang était à moitié couvert", value: n - 1 },
reveal: "La surface double chaque jour : la veille du jour " + n + ", elle était deux fois plus petite, donc la moitié. Jour " + M(n - 1) + ". (Et le jour " + (n - 5) + ", seulement " + M("\\frac{1}{32}") + " de l'étang : on ne voit presque rien venir.)" };
} });
add({ key: "machines", fam: "enigme", uses: [], outil: "la proportionnalité bien lue : chaque machine fabrique un objet en n minutes, en même temps que les autres.",
make() {
const n = pk([3, 5, 6, 8]), m = pk([60, 100, 120]), w = pk([["machines", "font", "gaufres"], ["imprimantes 3D", "impriment", "porte-clés"], ["robots", "emballent", "colis"]]);
return { titre: "Les " + w[0], q: M(n) + " " + w[0] + " " + w[1] + " " + M(n) + " " + w[2] + " en " + M(n) + " minutes.",
bet: { q: "Combien de temps faut-il à " + m + " " + w[0] + " pour " + m + " " + w[2] + " ?", choices: [m + " minutes", n + " minutes", "1 minute"], good: 1 },
calc: { label: "Durée (en minutes)", value: n },
reveal: "Chaque " + w[0].replace(/s( 3D)?$/, "$1") + " met " + n + " minutes pour un objet. " + m + " " + w[0] + " qui travaillent en même temps font " + m + " objets… en " + M(n) + " minutes." };
} });


add({ key: "recette", fam: "quotidien", uses: ["prop"], outil: "la proportionnalité (règle de trois) : on passe par une personne.",
make() {
const base = pk([4, 6]), p = pk([3, 5, 7, 9].filter((x) => x !== base)), [ing, q0, u] = pk([["farine", 250, "g"], ["lait", 500, "ml"], ["chocolat", 200, "g"], ["sucre", 150, "g"]]), v = (q0 * p) / base, dish = pk(["gâteau", "crêpes", "cake"]);
return { titre: "La recette", q: "La recette de " + dish + " pour " + M(base) + " personnes demande " + M(q0 + "\\ \\text{" + u + "}") + " de " + ing + ". Vous serez " + M(p) + ".",
bet: { q: "Faut-il plus ou moins que " + (q0 + (p - base) * 50) + " " + u + " ?", choices: ["plus", "moins", "exactement"], good: v > q0 + (p - base) * 50 + 1e-9 ? 0 : v < q0 + (p - base) * 50 - 1e-9 ? 1 : 2 },
calc: { label: "Quantité de " + ing + " pour " + p + " personnes (en " + u + ")", value: r6(v), round: 0.1 },
reveal: "On passe par une personne : " + M(q0 + " \\div " + base + (Number.isInteger(q0 / base) ? " = " + q0 / base : " \\approx " + N(q0 / base, 2))) + " " + u + " chacune. Pour " + p + " : " + M(q0 + " \\div " + base + " \\cdot " + p + " = " + N(v, 1)) + " " + u + ". Le seuil du pari ajoutait 50 " + u + " par personne de plus : ce n'est pas proportionnel !" };
} });
add({ key: "pente", fam: "quotidien", uses: ["echelle"], outil: "la pente en % : dénivelé ÷ distance horizontale × 100.",
make() {
const p = pk([8, 10, 12, 15]), d = pk([1.5, 2, 2.5, 3]), v = (p / 100) * d * 1000;
return { titre: "Le panneau de montagne", q: "Un panneau annonce une pente de " + pc(p) + " sur " + M(N(d) + "\\ \\text{km}") + " (distance horizontale).",
bet: { q: "Une pente de 100 %, ce serait…", choices: ["un mur vertical", "une pente à 45°", "impossible"], good: 1 },
calc: { label: "De combien de mètres montes-tu sur ces " + N(d).replace("{,}", ",") + " km ?", value: r6(v) },
reveal: p + " % : on monte de " + p + " m pour 100 m à l'horizontale. Sur " + M(N(d * 1000) + "\\ \\text{m}") + " : " + M(N(d * 1000) + " \\cdot " + N(p / 100) + " = " + N(v)) + " m. À 100 %, on monte autant qu'on avance : c'est une pente à 45°, pas un mur." };
} });
add({ key: "forfait", fam: "quotidien", uses: ["decmul"], outil: "la comparaison de deux tarifs : prix fixe contre prix proportionnel à la consommation.",
make() {
const A = pk([25, 30, 35]), b0 = pk([5, 10]), c = pk([2, 2.5, 5]), g = pk([4, 6, 8, 10, 12]), B = b0 + c * g;
if (Math.abs(B - A) < 1e-9) return this.make();
return { titre: "Quel abonnement ?", q: "Abonnement A : " + chf(A) + " par mois, données illimitées. Abonnement B : " + chf(b0) + " par mois, plus " + chf(c) + " par Go de données. Tu utilises environ " + M(g + "\\ \\text{Go}") + " par mois.",
bet: { q: "Lequel est le moins cher pour toi ?", choices: ["A, l'illimité", "B, au Go"], good: B < A ? 1 : 0 },
calc: { label: "Combien coûterait B pour " + g + " Go ? (en CHF)", value: r6(B), round: 0.01 },
reveal: "B : " + M(N(b0) + " + " + N(c) + " \\cdot " + g + " = " + N(B)) + " CHF, contre " + N(A) + " CHF pour A. " + (B < A ? "B est moins cher" : "A est moins cher") + ". Les deux coûtent pareil à " + M(N(r6((A - b0) / c))) + " Go : au-delà, l'illimité gagne." };
} });
add({ key: "demitarif", fam: "quotidien", uses: ["decdiv"], outil: "la division et l'arrondi vers le haut (il faut un nombre entier de trajets).",
make() {
const ab = pk([120, 150, 190]), t = pk([18.4, 22, 26.8, 31.6, 41.2]), save = t / 2, v = Math.ceil(ab / save), trip = pk(["un aller-retour chez ta grand-mère", "un aller-retour pour ton entraînement", "un aller-retour pour voir des amis"]);
return { titre: "L'abonnement demi-tarif", q: "Un abonnement de train, du genre « demi-tarif », coûte " + chf(ab) + " par an (prix inventé pour l'exercice : renseigne-toi pour le vrai). Avec lui, chaque billet coûte la moitié du prix normal. Plein tarif, " + trip + " coûte " + chf(t) + ".",
bet: { q: "Combien d'allers-retours faut-il pour qu'il soit rentable ?", choices: ["moins de 10", "entre 10 et 20", "plus de 20"], good: v < 10 ? 0 : v <= 20 ? 1 : 2 },
calc: { label: "Nombre minimum d'allers-retours pour rentabiliser l'abonnement", value: v },
reveal: "Chaque aller-retour fait économiser " + M(N(t) + " \\div 2 = " + N(save)) + " CHF. " + M(ab + " \\div " + N(save) + " \\approx " + N(ab / save, 2)) + " : il faut " + M(v) + " allers-retours (on arrondit vers le haut)." };
} });
add({ key: "essence", fam: "quotidien", uses: ["prop"], outil: "la proportionnalité : la consommation est donnée pour 100 km.",
make() {
const c = pk([5.5, 6.5, 7]), d = pk([160, 240, 280, 320]), pr = pk([1.8, 1.85, 1.9]), v = (c * d / 100) * pr, tr = pk([25, 35, 45]);
return { titre: "Voiture ou train ?", q: "Une voiture consomme " + M(N(c) + "\\ \\text{L}") + " d'essence aux 100 km. Le trajet aller fait " + M(d + "\\ \\text{km}") + ", l'essence coûte " + chf(pr) + " le litre. En train, le billet aller coûte " + chf(tr) + " par personne.",
bet: { q: "À quatre, l'essence de la voiture revient-elle moins cher que quatre billets de train ?", choices: ["Oui", "Non"], good: v < 4 * tr ? 0 : 1 },
calc: { label: "Prix de l'essence pour ce trajet aller (en CHF, au centime)", value: r6(v), round: 0.01 },
reveal: "Litres : " + M(N(c) + " \\cdot " + d + " \\div 100 = " + N(c * d / 100)) + ". Prix : " + M(N(c * d / 100) + " \\cdot " + N(pr) + " \\approx " + N(v, 2)) + " CHF, contre " + M("4 \\cdot " + tr + " = " + 4 * tr) + " CHF en train. (Sans compter l'usure, le parking… ni le climat.)" };
} });
add({ key: "ecran", fam: "quotidien", uses: ["pyth"], outil: "le théorème de Pythagore : la taille d'un écran est sa diagonale.",
make() {
const inch = pk([43, 50, 55, 65]), dcm = inch * 2.54, w = dcm * 16 / Math.sqrt(337), meuble = Math.round(w / 10) * 10 + pk([-5, 5]);
return { titre: "L'écran dans le meuble", q: "Ta famille veut acheter un écran de " + M(inch) + " pouces et le poser dans un meuble de " + M(meuble + "\\ \\text{cm}") + " de large. Dans les magasins, la « taille » d'un écran est la longueur de sa <b>diagonale</b>, et un pouce vaut " + M("2{,}54\\ \\text{cm}") + ". L'écran est au format 16:9 : sa largeur et sa hauteur sont dans le rapport 16 pour 9.",
bet: { q: "L'écran rentre-t-il dans le meuble ?", choices: ["Oui", "Non"], good: w <= meuble ? 0 : 1 },
calc: { label: "Largeur de l'écran (en cm, au dixième)", value: Math.round(w * 10) / 10, round: 0.1 },
reveal: "Diagonale : " + M(inch + " \\cdot 2{,}54 = " + N(dcm, 2)) + " cm. Avec une largeur de " + M("16k") + " et une hauteur de " + M("9k") + " : " + M("(16k)^2 + (9k)^2 = " + N(dcm, 2) + "^2") + ", donc " + M("k = " + N(dcm, 2) + " \\div \\sqrt{337} \\approx " + N(dcm / Math.sqrt(337), 3)) + " et la largeur vaut " + M("16k \\approx " + N(w, 1)) + " cm." };
} });


const dc = (v, k = 1) => (+v.toFixed(k)).toString().replace(".", ",");
add({ key: "petits", fam: "arnaque", uses: ["pct"], outil: "les pourcentages sur de petits nombres : +100 % peut ne représenter que quelques cas.",
make() {
const [a, b] = pk([[2, 3], [2, 4], [3, 4], [3, 6], [4, 5], [4, 6]]), rel = ((b - a) / a) * 100, n = pk([450, 600, 800]);
const what = pk(["élèves se sont cassé le bras en gym", "vélos ont été volés devant l'école", "élèves se sont perdus en course d'école"]);
return { titre: "Le titre qui fait peur", q: "Dans un établissement de " + M(N(n)) + " élèves, " + M(a) + " " + what + " l'an dernier, " + M(b) + " cette année. Le journal local titre : « Hausse de " + dc(rel) + " % ! »",
bet: { q: "Faut-il s'inquiéter ?", choices: ["Oui : c'est une hausse énorme", "Pas forcément : sur de si petits nombres, le % exagère", "Non : c'est en fait une baisse"], good: 1 },
calc: { label: "Vérifie : de combien de % le nombre a-t-il augmenté ? (au dixième)", value: Math.round(rel * 10) / 10, round: 0.1 },
reveal: M("\\frac{" + (b - a) + "}{" + a + "} " + (Number.isInteger(rel) ? "= " : "\\approx ") + N((b - a) / a, 3)) + " : le titre a raison, " + pc(rel, 1) + ". Mais cela ne fait que " + (b - a) + " cas de plus sur " + N(n).replace("\\text{'}", "'") + " élèves : le hasard suffit à l'expliquer. Sur de petits nombres, regarde les nombres, pas seulement le %." };
} });
add({ key: "salaire", fam: "arnaque", uses: ["pct"], outil: "les pourcentages successifs : ce qui compte, c'est le rapport entre la hausse du salaire et celle des prix.",
make() {
const s = pk([1, 2, 3]), i = s + pk([0.5, 1, 1.5]), W = pk([4000, 5000, 6000]), pa = ((1 + s / 100) / (1 + i / 100) - 1) * 100;
return { titre: "Plus riche ?", q: "Le salaire de Sam augmente de " + pc(s) + ". La même année, les prix augmentent en moyenne de " + pc(i) + ". Sam dit : « Je gagne plus, je suis plus riche ! »",
bet: { q: "Avec son salaire, Sam peut-il acheter plus de choses qu'avant ?", choices: ["Oui, plus qu'avant", "Non, un peu moins qu'avant", "Exactement autant"], good: 1 },
calc: { label: "Sam gagnait " + chf(W) + " par mois. Combien gagne-t-il maintenant ? (en CHF)", value: r6(W * (1 + s / 100)), round: 0.01 },
reveal: "Salaire : " + M(N(W) + " \\cdot " + N(1 + s / 100) + " = " + N(W * (1 + s / 100))) + " CHF. Mais ce qui coûtait 100 CHF en coûte maintenant " + dc(100 + i, 2) + ". Ce que Sam peut acheter est multiplié par " + M("\\frac{" + N(1 + s / 100) + "}{" + N(1 + i / 100) + "} \\approx " + N((1 + s / 100) / (1 + i / 100), 4)) + " : il perd environ " + pc(-pa, 1) + " de pouvoir d'achat." };
} });
add({ key: "debit", fam: "arnaque", uses: ["decdiv"], outil: "les conversions d'unités : 1 octet = 8 bits ; les débits sont annoncés en bits, les fichiers en octets.",
make() {
const G = pk([3, 4.5, 6, 9]), D = pk([50, 80, 100]), real = (G * 8000) / D / 60, naive = real / 8;
return { titre: "Le téléchargement", q: "Ton abonnement internet annonce « " + M(D + "\\ \\text{Mbit/s}") + " » (mégabits par seconde). Le jeu que tu veux pèse " + M(N(G) + "\\ \\text{Go}") + " (gigaoctets). Rappel : " + M("1\\ \\text{Go} = 1000\\ \\text{Mo}") + " et 1 octet = 8 bits.",
bet: { q: "Le téléchargement durera, au mieux…", choices: ["environ " + dc(naive) + " min", "environ " + dc(real) + " min", "plus d'une heure"], good: 1 },
calc: { label: "Durée minimale du téléchargement (en minutes, au dixième)", value: Math.round(real * 10) / 10, round: 0.1 },
reveal: M(N(G) + "\\ \\text{Go} = " + N(G * 1000) + "\\ \\text{Mo} = " + N(G * 8000) + "\\ \\text{Mbit}") + ". " + M(N(G * 8000) + " \\div " + D + " = " + N((G * 8000) / D)) + " s, soit " + M(N(real, 1)) + " min. Le piège : oublier le ×8 donne " + dc(naive) + " min, huit fois trop peu. (Et en vrai, le débit réel est souvent plus bas que l'annonce.)" };
} });
add({ key: "montee", fam: "paradoxe", uses: ["vitesse"], outil: "la vitesse moyenne : durée totale = distance totale ÷ vitesse moyenne.",
make() {
const [d, v] = pk([[1, 10], [1, 12], [2, 12], [2, 15], [3, 15], [3, 20]]), t = (d / v) * 60;
return { titre: "Rattraper le temps perdu", q: "Tu montes une côte de " + M(d + "\\ \\text{km}") + " à vélo, à " + M(v + "\\ \\text{km/h}") + ". Puis tu redescends par le même chemin. Tu voudrais une vitesse moyenne de " + M(2 * v + "\\ \\text{km/h}") + " sur l'aller-retour.",
bet: { q: "À quelle vitesse faut-il descendre ?", choices: [3 * v + " km/h", 4 * v + " km/h", "C'est impossible"], good: 2 },
calc: { label: "Combien de minutes as-tu mis pour monter ?", value: t },
reveal: "Monter : " + M(d + " \\div " + v + " \\cdot 60 = " + N(t)) + " min. Pour une moyenne de " + 2 * v + " km/h sur " + 2 * d + " km, il faut au total " + M(2 * d + " \\div " + 2 * v + " \\cdot 60 = " + N(t)) + " min : tout ce temps est déjà utilisé ! Il faudrait descendre en 0 minute, même la lumière n'y arrive pas." };
} });
add({ key: "depistage", fam: "paradoxe", uses: ["proba"], outil: "les probabilités avec des effectifs : on compte les vrais et les faux positifs sur une grande population.",
make() {
const [pr, fp] = pk([[1, 10], [1, 5], [2, 10]]), N0 = 10000, sick = (N0 * pr) / 100, tp = sick * 0.9, fpos = ((N0 - sick) * fp) / 100, pos = tp + fpos, p = (tp / pos) * 100;
return { titre: "Test positif", q: "Une maladie touche " + pc(pr) + " de la population. Un test la détecte chez 90 % des malades, mais il est aussi positif, par erreur, chez " + pc(fp) + " des personnes en bonne santé. On teste " + M(N(N0)) + " personnes.",
bet: { q: "Ton test est positif. La probabilité que tu sois vraiment malade est…", choices: ["environ 90 %", "environ 50 %", "moins de 20 %"], good: 2 },
calc: { label: "Sur ces " + "10'000 personnes, combien ont un test positif ?", value: pos },
reveal: "Malades : " + M(N(sick)) + ", dont " + M(N(tp)) + " positifs. En bonne santé : " + M(N(N0 - sick)) + ", dont " + M(N(fpos)) + " positifs par erreur. En tout " + M(N(pos)) + " positifs, et seulement " + M(N(tp)) + " vraiment malades : " + M("\\frac{" + N(tp) + "}{" + N(pos) + "} \\approx") + " " + pc(p, 0) + ". Quand une maladie est rare, la plupart des positifs sont des erreurs : on refait un 2e test." };
} });
add({ key: "pile", fam: "paradoxe", uses: ["proba"], outil: "les probabilités : les lancers sont indépendants, la pièce n'a pas de mémoire.",
make() {
const k = pk([4, 5, 6]), what = pk([["une pièce", "pile", "face"], ["un dé", "un nombre pair", "un nombre impair"]]);
return { titre: "La série", q: "Tu lances " + what[0] + " équilibré" + (what[0] === "une pièce" ? "e" : "") + ". Tu obtiens " + k + " fois de suite " + what[1] + ".",
bet: { q: "Au lancer suivant…", choices: [what[2] + " est plus probable, il « doit » arriver", what[1] + " est plus probable, c'est une série", "une chance sur deux, comme toujours"], good: 2 },
calc: { label: "Probabilité d'obtenir " + k + " fois de suite " + what[1] + " (fraction)", value: 1 / 2 ** k },
reveal: "Chaque lancer a une chance sur deux : " + M("\\left(\\frac{1}{2}\\right)^{" + k + "} = \\frac{1}{" + 2 ** k + "}") + ". Une telle série est rare… mais une fois qu'elle a eu lieu, le lancer suivant reste à " + M("\\frac{1}{2}") + " : " + what[0] + " ne se souvient de rien. Croire le contraire, c'est « l'erreur du joueur »." };
} });
add({ key: "photo", fam: "paradoxe", uses: [], outil: "l'agrandissement : si chaque côté est multiplié par k, l'aire est multipliée par k × k.",
make() {
const [a, b] = pk([[10, 15], [9, 13], [13, 18]]), k = pk([2, 3]);
return { titre: "Le poster", q: "Tu fais agrandir une photo de " + M(a) + " cm sur " + M(b) + " cm pour en faire un poster : chaque côté est multiplié par " + M(k) + ".",
bet: { q: "Il faudra combien de fois plus d'encre ?", choices: [k + " fois plus", k * k + " fois plus", k ** 3 + " fois plus"], good: 1 },
calc: { label: "Aire du poster (en cm²)", value: k * a * k * b },
reveal: "Photo : " + M(a + " \\cdot " + b + " = " + a * b) + " cm². Poster : " + M(k * a + " \\cdot " + k * b + " = " + N(k * a * k * b)) + " cm², soit " + M(k * k) + " fois plus : on agrandit dans les deux directions, " + M(k + " \\cdot " + k) + "." };
} });
add({ key: "ecrantemps", fam: "fermi", uses: ["decdiv"], outil: "la multiplication et les conversions de durées (heures → jours).",
make() {
const h = pk([2.5, 3, 3.5, 4, 5]), v = (h * 365) / 24;
return { titre: "Le temps d'écran", q: "Tu passes environ " + M(N(h) + "\\ \\text{h}") + " par jour sur ton téléphone.",
bet: { q: "En une année, cela fait combien de jours complets, 24 heures sur 24 ?", choices: ["environ 5 jours", "environ 15 jours", "plus d'un mois"], good: 2 },
calc: { label: "Nombre de jours de 24 h (au dixième)" , value: Math.round(v * 10) / 10, range: [v * 0.95, v * 1.05] },
reveal: M(N(h) + " \\cdot 365 = " + N(h * 365)) + " h, et " + M(N(h * 365) + " \\div 24 \\approx " + N(v, 1)) + " jours : plus d'un mois sans dormir, ni manger, ni aller à l'école." };
} });
add({ key: "respire", fam: "fermi", uses: ["decmul"], outil: "la multiplication et les conversions de durées (minutes → jour).",
make() {
const r = pk([12, 14, 15, 16]), v = r * 0.5 * 1440;
return { titre: "L'air que tu respires", q: "Au repos, tu respires environ " + M(r) + " fois par minute, et chaque inspiration fait entrer environ " + M("0{,}5\\ \\text{L}") + " d'air.",
bet: { q: "En une journée, tu respires environ…", choices: ["100 litres d'air", "1'000 litres d'air", "10'000 litres d'air"], good: 2 },
calc: { label: "Litres d'air respirés en un jour", value: v, range: [v * 0.95, v * 1.05] },
reveal: M(r + " \\cdot 0{,}5 = " + N(r * 0.5)) + " litre" + (r * 0.5 > 1 ? "s" : "") + " par minute ; une journée a " + M("24 \\cdot 60 = 1\\text{'}440") + " minutes : " + M(N(r * 0.5) + " \\cdot 1\\text{'}440 = " + N(v)) + " litres, de quoi remplir une petite piscine gonflable chaque jour." };
} });
add({ key: "file", fam: "fermi", uses: ["decmul"], outil: "la multiplication et la comparaison de longueurs.",
make() {
const n = pk([200, 300, 500, 800]), t = pk([1.5, 1.6]), L = n * t;
return { titre: "La file des élèves", q: "Tous les élèves de ton école (" + M(n) + ") s'allongent par terre, l'un derrière l'autre. Chacun mesure environ " + M(N(t) + "\\ \\text{m}") + ".",
bet: { q: "La file fait-elle le tour d'une piste d'athlétisme (400 m) ?", choices: ["Non, pas en entier", "Oui, entre 1 et 2 tours", "Oui, plus de 2 tours"], good: L < 400 ? 0 : L <= 800 ? 1 : 2 },
calc: { label: "Longueur de la file (en m)", value: L, range: [L * 0.97, L * 1.03] },
reveal: M(n + " \\cdot " + N(t) + " = " + N(L)) + " m, soit " + dc(L / 400, 2) + " tour" + (L >= 800 ? "s" : "") + " de piste." };
} });
add({ key: "veloterre", fam: "fermi", uses: ["decdiv"], outil: "la division (distance ÷ vitesse) et les conversions de durées.",
make() {
const v = pk([15, 16, 20, 25]), j = 40000 / v;
return { titre: "Le tour du monde à vélo", q: "Tu pédales une heure par jour, à " + M(v + "\\ \\text{km/h}") + ". Tu veux parcourir la longueur de l'équateur : environ " + M("40\\text{'}000\\ \\text{km}") + ".",
bet: { q: "Il te faudra…", choices: ["quelques mois", "quelques années", "plus de 50 ans"], good: 1 },
calc: { label: "Combien de jours ?", value: Math.round(j), range: [j * 0.97, j * 1.03] },
reveal: "Chaque jour : " + v + " km. " + M("40\\text{'}000 \\div " + v + " \\approx " + N(Math.round(j))) + " jours, soit environ " + dc(j / 365) + " ans." };
} });
add({ key: "chiffres", fam: "enigme", uses: [], outil: "le dénombrement par paquets : les pages à 1, à 2 et à 3 chiffres.",
make() {
const n = pk([104, 105, 150, 200, 250]), v = 9 + 180 + 3 * (n - 99);
return { titre: "Numéroter un livre", q: "Pour numéroter les pages d'un livre, de 1 à " + M(n) + ", l'imprimeur doit imprimer des chiffres (« 12 », c'est deux chiffres).",
bet: { q: "Faut-il plus ou moins de " + 2 * n + " chiffres ?", choices: ["moins de " + 2 * n, "plus de " + 2 * n], good: v > 2 * n ? 1 : 0 },
calc: { label: "Nombre total de chiffres imprimés", value: v },
reveal: "Pages 1 à 9 : 9 chiffres. Pages 10 à 99 : " + M("90 \\cdot 2 = 180") + ". Pages 100 à " + n + " : " + M((n - 99) + " \\cdot 3 = " + 3 * (n - 99)) + ". Total : " + M("9 + 180 + " + 3 * (n - 99) + " = " + v) + "." };
} });
add({ key: "pesees", fam: "enigme", uses: [], outil: "le raisonnement par élimination : chaque pesée partage les suspectes en trois groupes.",
make() {
const n = pk([9, 27, 81]), k = Math.round(Math.log(n) / Math.log(3)), obj = pk(["billes", "pièces", "boules de pétanque"]);
return { titre: "La balance", q: "Parmi " + M(n) + " " + obj + " identiques, une seule est un peu plus lourde. Tu as une balance à deux plateaux (sans poids). Astuce : fais trois groupes de " + M(n / 3) + ", et mets-en deux sur la balance.",
bet: { q: "Combien de pesées faut-il, au minimum, pour être sûr de la trouver ?", choices: [String(k - 1), String(k), String(k + 2)], good: 1 },
calc: { label: "Après la 1re pesée, combien de " + obj + " sont encore suspectes ?", value: n / 3 },
reveal: "Si la balance penche, la lourde est dans le plateau du bas ; si elle est à l'équilibre, elle est dans le groupe resté de côté. Il reste " + M(n / 3) + " suspectes, puis " + (n / 9 > 1 ? M(n / 9) + ", " : "") + "… jusqu'à une seule : " + M(k) + " pesées suffisent (" + M("3^{" + k + "} = " + n) + ")." };
} });
add({ key: "tournoi", fam: "enigme", uses: [], outil: "le raisonnement malin : chaque match élimine exactement une équipe.",
make() {
const n = pk([16, 24, 32, 48, 64]), sp = pk(["de foot", "de ping-pong", "d'échecs", "de jeux vidéo"]);
return { titre: "Le tournoi", q: "Un tournoi " + sp + " à élimination directe réunit " + M(n) + " équipes : chaque match a un perdant, qui est éliminé, et il n'y a pas de match nul. Quand le nombre d'équipes est impair, une équipe est qualifiée d'office pour le tour suivant.",
bet: { q: "Combien de matchs faut-il pour désigner le vainqueur ?", choices: ["moins de " + n, "exactement " + n, "plus de " + n], good: 0 },
calc: { label: "Nombre de matchs joués en tout", value: n - 1 },
reveal: "Pas besoin de compter tour par tour : chaque match élimine une équipe, et il faut éliminer toutes les équipes sauf le vainqueur. " + M(n + " - 1 = " + (n - 1)) + " matchs." };
} });
add({ key: "franchise", fam: "quotidien", sys: "CH", uses: ["prop"], outil: "la comparaison de deux tarifs : coût fixe (primes) + coût variable (franchise).",
make() {
const [pa, fa, pb, fb] = pk([[420, 300, 330, 2500], [380, 300, 300, 2500], [450, 500, 360, 2000]]), F = pk([200, 1500, 4000]);
const A = 12 * pa + Math.min(F, fa), B = 12 * pb + Math.min(F, fb);
return { titre: "L'assurance maladie", q: "Deux formules d'assurance. A : " + chf(pa) + " par mois, franchise de " + chf(fa) + ". B : " + chf(pb) + " par mois, franchise de " + chf(fb) + ". (La franchise : tu paies toi-même tes frais médicaux jusqu'à ce montant chaque année ; on oublie le reste pour simplifier.) Cette année, tu as " + chf(F) + " de frais médicaux.",
bet: { q: "Quelle formule te coûte le moins cette année ?", choices: ["A", "B", "C'est pareil"], good: A < B ? 0 : A > B ? 1 : 2 },
calc: { label: "Coût total de B sur l'année (en CHF)", value: B },
reveal: "A : " + M("12 \\cdot " + pa + " + " + Math.min(F, fa) + " = " + N(A)) + " CHF. B : " + M("12 \\cdot " + pb + " + " + Math.min(F, fb) + " = " + N(B)) + " CHF. " + (A < B ? "A est moins chère : avec beaucoup de frais, la petite franchise protège." : "B est moins chère : peu de frais, les primes basses gagnent.") };
} });
add({ key: "rando", fam: "quotidien", uses: ["echelle"], outil: "l'échelle d'une carte (1:50'000 : 1 cm sur la carte = 50'000 cm = 500 m) puis la vitesse.",
make() {
const d = pk([7, 9, 11, 15, 21]), km = d * 0.5, h = km / 4;
return { titre: "La randonnée", q: "Sur ta carte au 1:50'000, le sentier mesure " + M(d + "\\ \\text{cm}") + ". Tu marches à environ " + M("4\\ \\text{km/h}") + ".",
bet: { q: "Combien de temps dure la marche ?", choices: ["moins d'1 h 30", "entre 1 h 30 et 2 h 30", "plus de 2 h 30"], good: h < 1.5 ? 0 : h <= 2.5 ? 1 : 2 },
calc: { label: "Longueur réelle du sentier (en km)", value: km },
reveal: M(d + " \\cdot 50\\text{'}000 = " + N(d * 50000)) + " cm = " + M(N(km)) + " km. À 4 km/h : " + M(N(km) + " \\div 4 = " + N(h, 3)) + " h, soit environ " + Math.floor(h) + " h " + String(Math.round((h % 1) * 60)).padStart(2, "0") + " (sans les pauses ni la montée !)." };
} });
add({ key: "addition", fam: "quotidien", uses: ["pct"], outil: "les pourcentages et la distributivité : (T × 1,1) ÷ k = (T ÷ k) × 1,1.",
make() {
const T = pk([63.2, 87.6, 124.8, 146.4]), k = pk([3, 4, 5]), v = (T * 1.1) / k;
return { titre: "Partager l'addition", q: "Au restaurant, l'addition est de " + chf(T) + " pour " + M(k) + " amis. Vous voulez ajouter " + pc(10) + " de pourboire et partager équitablement.",
bet: { q: "Vaut-il mieux ajouter le pourboire avant ou après le partage ?", choices: ["Avant : ça coûte moins", "Après : ça coûte moins", "C'est pareil"], good: 2 },
calc: { label: "Combien paie chacun ? (en CHF, au centime)", value: r6(v), round: 0.01 },
reveal: "Avant : " + M(N(T) + " \\cdot 1{,}1 = " + N(T * 1.1)) + ", puis " + M("\\div " + k) + " : " + M(N(v, 2)) + " CHF. Après : " + M(N(T) + " \\div " + k + " = " + N(T / k, 2)) + ", puis " + M("\\cdot 1{,}1") + " : le même résultat. Multiplier et diviser, l'ordre n'y change rien." };
} });
add({ key: "notes", fam: "quotidien", uses: ["diagr"], outil: "la moyenne : la somme des notes doit valoir 3 × la moyenne visée.",
make() {
const c = pk([[4, 4.5, 4.5], [3.5, 4, 4.5], [5, 4.5, 5], [4.5, 5.5, 5], [3.5, 5, 4.5], [5.5, 5, 5.5]]), [n1, n2, t] = c, x = r6(3 * t - n1 - n2);
return { titre: "La note qu'il te faut", q: "Tu as eu " + M(N(n1)) + " et " + M(N(n2)) + " aux deux premiers tests (même poids). Tu vises une moyenne de " + M(N(t)) + " avec le 3e test.",
bet: { q: "Au 3e test, il te faut…", choices: ["exactement " + dc(t) + ", la note visée", "plus que " + dc(t), "moins que " + dc(t)], good: x > t ? 1 : x < t ? 2 : 0 },
calc: { label: "Note nécessaire au 3e test", value: x },
reveal: "Pour une moyenne de " + N(t).replace("{,}", ",") + " sur 3 tests, il faut " + M("3 \\cdot " + N(t) + " = " + N(3 * t)) + " points en tout. Tu en as " + M(N(n1) + " + " + N(n2) + " = " + N(n1 + n2)) + ". Il manque " + M(N(3 * t) + " - " + N(n1 + n2) + " = " + N(x)) + "." };
} });
add({ key: "peinture", fam: "quotidien", uses: ["prop"], outil: "l'aire des murs (périmètre × hauteur) puis la proportionnalité (litres par m²).",
make() {
const [L, l] = pk([[4, 3], [5, 4], [3, 3], [4.5, 3.5]]), h = 2.5, S = 2 * (L + l) * h, lit = (2 * S) / 10, pots = Math.ceil(lit / 2.5);
return { titre: "Repeindre ta chambre", q: "Ta chambre mesure " + M(N(L) + "\\ \\text{m} \\times " + N(l) + "\\ \\text{m}") + ", avec " + M("2{,}5\\ \\text{m}") + " de hauteur. Tu repeins les quatre murs (on oublie la fenêtre et la porte), en deux couches. Un litre de peinture couvre " + M("10\\ \\text{m}^2") + " ; la peinture se vend en pots de " + M("2{,}5\\ \\text{L}") + ".",
bet: { q: "Combien de pots faut-il acheter ?", choices: ["2", "3", "4", "5"], good: pots - 2 },
calc: { label: "Aire des quatre murs (en m²)", value: S },
reveal: "Les quatre murs, déroulés, forment un rectangle : périmètre × hauteur = " + M(N(2 * (L + l)) + " \\cdot 2{,}5 = " + N(S)) + " m². Deux couches : " + M(N(2 * S)) + " m², donc " + M(N(lit)) + " litres, soit " + M(N(lit) + " \\div 2{,}5 = " + N(lit / 2.5)) + " → " + pots + " pots (on arrondit vers le haut)." };
} });




const NF = (v, k) => N(v, k).replace(/\\text\{'\}/g, "\\,");
const eur = (v) => M(NF(v, Number.isInteger(r6(v)) ? 0 : 2).replace(/\{,\}(\d)$/, "{,}$10") + "\\ \\text{€}");
const m2 = (v) => v.toFixed(2).replace(".", "{,}");
const PF = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
add({ key: "pieces", fam: "arnaque", uses: ["prop"], outil: "la proportionnalité : comparer deux packs, c'est comparer le prix d'une même quantité (ici 1'000 pièces).",
make() {
const [n1, p1, n2, p2] = pk([[1000, 9.9, 2800, 24.9], [500, 4.9, 2000, 21.9], [1000, 8.9, 5000, 49.9], [600, 5.9, 2500, 22.9]]);
const u1 = (p1 / n1) * 1000, u2 = (p2 / n2) * 1000, cheap = u2 < u1 ? 1 : 0;
return { titre: "La « meilleure offre » du jeu", q: "Dans un jeu en ligne, on achète des pièces virtuelles. Petit pack : " + T(n1) + " pièces pour " + chf(p1) + ". Grand pack, marqué « Meilleure offre ! » : " + T(n2) + " pièces pour " + chf(p2) + ".",
bet: { q: "Lequel est le moins cher, pour la même quantité de pièces ?", choices: ["Le petit pack", "Le grand pack"], good: cheap },
calc: { label: "Prix de " + T(1000) + " pièces avec le grand pack (en CHF, au centime)", value: r6(u2), round: 0.01 },
reveal: "Grand pack : " + M(m2(p2) + " \\div " + N(n2) + " \\cdot 1\\text{'}000 \\approx " + m2(u2)) + " CHF les 1'000 pièces. Petit pack : " + M(m2(p1) + " \\div " + N(n1) + " \\cdot 1\\text{'}000 \\approx " + m2(u1)) + " CHF. " + (cheap ? "Le grand pack est bien moins cher." : "Le petit pack est moins cher : l'étiquette « Meilleure offre » ne prouve rien, il faut calculer.") };
} });
add({ key: "sucre", fam: "quotidien", uses: ["pct"], outil: "les pourcentages (enlever 30 %, c'est garder 70 % : on multiplie par 0,7) et la proportionnalité (grammes pour 100 mL).",
make() {
const s = pk([10, 10.6, 11]), r = pk([20, 25, 30]), [V, Vt] = pk([[330, "une canette de 33 cL"], [500, "une bouteille de 50 cL"]]), g = r6((s * (1 - r / 100) * V) / 100), cubes = g / 5;
return { titre: "« −" + r + " % de sucre »", q: "Une boisson gazeuse contenait " + M(N(s) + "\\ \\text{g}") + " de sucre pour " + M("100\\ \\text{mL}") + ". Sa nouvelle recette annonce « " + pc(r) + " de sucre en moins ». Tu bois " + Vt + ". Un morceau de sucre pèse environ " + M("5\\ \\text{g}") + ".",
bet: { q: "Avec la nouvelle recette, combien de morceaux de sucre y a-t-il dans " + Vt + " ?", choices: ["moins de 5", "entre 5 et 10", "plus de 10"], good: cubes < 5 ? 0 : cubes <= 10 ? 1 : 2 },
calc: { label: "Masse de sucre dans " + Vt + " avec la nouvelle recette (en g, au dixième)", value: g, round: 0.1 },
reveal: "Nouvelle recette : " + M(N(s) + " \\cdot " + N(1 - r / 100) + " = " + N(s * (1 - r / 100))) + " g pour 100 mL. Pour " + V + " mL : " + M(N(s * (1 - r / 100)) + " \\cdot " + N(V / 100) + " = " + N(g)) + " g, soit environ " + M(N(cubes, 1)) + " morceaux de sucre. « Moins sucré » ne veut pas dire « peu sucré »." };
} });
add({ key: "simpson", fam: "paradoxe", uses: ["pct"], outil: "les pourcentages : un pourcentage global dépend aussi de la répartition des essais (c'est le paradoxe de Simpson).",
make() {
let A, B;
for (let t = 0; t < 400; t++) {
const a2 = pk([20, 30, 40]), a3 = pk([60, 80, 100]), b2 = pk([80, 100, 120]), b3 = pk([10, 20]);
const pa2 = pk([56, 58, 60, 62]), pb2 = pa2 - pk([2, 4]), pa3 = pk([36, 38, 40]), pb3 = pa3 - pk([3, 5]);
A = { n2: a2, m2: Math.round((a2 * pa2) / 100), n3: a3, m3: Math.round((a3 * pa3) / 100) };
B = { n2: b2, m2: Math.round((b2 * pb2) / 100), n3: b3, m3: Math.round((b3 * pb3) / 100) };
if (A.m2 / A.n2 > B.m2 / B.n2 && A.m3 / A.n3 > B.m3 / B.n3 && (B.m2 + B.m3) / (B.n2 + B.n3) > (A.m2 + A.m3) / (A.n2 + A.n3) + 0.02) break;
A = { n2: 30, m2: 18, n3: 100, m3: 38 }; B = { n2: 100, m2: 56, n3: 20, m3: 7 };
}
const tA = (100 * (A.m2 + A.m3)) / (A.n2 + A.n3), tB = (100 * (B.m2 + B.m3)) / (B.n2 + B.n3), w = (P, x) => x + " réussit " + M(P.m2) + " tirs à 2 points sur " + M(P.n2) + " (" + pc((100 * P.m2) / P.n2, 1) + ") et " + M(P.m3) + " tirs à 3 points sur " + M(P.n3) + " (" + pc((100 * P.m3) / P.n3, 1) + ")";
return { titre: "Le meilleur tireur", q: "Bilan de la saison de basket. " + w(A, "Alex") + ". " + w(B, "Sam") + ". Alex est meilleur que Sam aux deux sortes de tirs.",
bet: { q: "Qui a le meilleur pourcentage de réussite sur l'ensemble de ses tirs ?", choices: ["Alex, forcément", "Sam", "Ils sont à égalité"], good: 1 },
calc: { label: "Pourcentage de réussite de Sam sur tous ses tirs (au dixième)", value: r6(tB), round: 0.1 },
reveal: "Sam : " + M("\\frac{" + (B.m2 + B.m3) + "}{" + (B.n2 + B.n3) + "} \\approx " + N(tB, 1) + "\\,\\%") + ". Alex : " + M("\\frac{" + (A.m2 + A.m3) + "}{" + (A.n2 + A.n3) + "} \\approx " + N(tA, 1) + "\\,\\%") + ". Alex tente surtout des tirs à 3 points, les plus difficiles ; Sam surtout des tirs à 2 points. Être meilleur dans chaque catégorie ne suffit pas : la répartition compte." };
} });
add({ key: "orange", fam: "paradoxe", uses: ["volcone"], outil: "le volume de la boule, V = 4/3 · π · r³ : quand le rayon est multiplié par k, le volume est multiplié par k³.",
make() {
const [f, D, e] = pk([["une orange", 7, 0.5], ["une orange", 8, 0.7], ["un pamplemousse", 12, 1], ["une mandarine", 6, 0.4]]), R0 = D / 2, ri = R0 - e, v = r6(100 * (1 - (ri / R0) ** 3));
return { titre: "L'orange épluchée", q: "Tu épluches " + f + " bien " + (f.startsWith("une") ? "ronde" : "rond") + " de " + M(N(D) + "\\ \\text{cm}") + " de diamètre. Sa peau a une épaisseur de " + M(N(e) + "\\ \\text{cm}") + ".",
bet: { q: "Quelle part du volume du fruit part avec la peau ?", choices: ["environ 10 %", "environ 20 %", "plus de 30 %"], good: v < 15 ? 0 : v < 30 ? 1 : 2 },
calc: { label: "Pourcentage du volume occupé par la peau (au dixième)", value: v, round: 0.1 },
reveal: "Fruit entier : rayon " + M(N(R0)) + " cm ; sans la peau : rayon " + M(N(ri)) + " cm. Les volumes sont dans le rapport " + M("\\left(\\frac{" + N(ri) + "}{" + N(R0) + "}\\right)^3 \\approx " + N((ri / R0) ** 3, 3)) + " : il reste environ " + pc(100 - v, 1) + " du volume, la peau en prend " + pc(v, 1) + ". Une couche fine, mais tout autour, sur la partie la plus large de la boule." };
} });
add({ key: "lumiere", fam: "fermi", uses: ["vitesse", "sci"], outil: "la vitesse : durée = distance ÷ vitesse, avec de très grands nombres (notation scientifique).",
make() {
const o = pk([{ n: "Le Soleil", d: 1.5e8, dt: "150 millions de km", ch: ["environ 8 secondes", "environ 8 minutes", "environ 8 heures"], g: 1, fin: "Tu vois le Soleil tel qu'il était il y a plus de 8 minutes." },
{ n: "La Lune", d: 3.84e5, dt: "384'000 km", ch: ["environ 1 seconde", "environ 1 minute", "environ 1 heure"], g: 0, fin: "La lumière renvoyée par la Lune arrive en un peu plus d'une seconde." },
{ n: "Mars, au plus près,", d: 5.6e7, dt: "56 millions de km", ch: ["environ 3 secondes", "environ 3 minutes", "environ 3 heures"], g: 1, fin: "Un robot sur Mars ne peut pas être piloté en direct : chaque ordre met plusieurs minutes à arriver." }]);
const v = o.d / 3e5;
return { titre: "La lumière en route", q: "La lumière va à environ " + M("300\\text{'}000\\ \\text{km/s}") + ". " + o.n + " est à environ " + o.dt + " de la Terre.",
bet: { q: "Combien de temps sa lumière met-elle pour arriver jusqu'à nous ?", choices: o.ch, good: o.g },
calc: { label: "Durée du trajet de la lumière (en secondes)", value: r6(v), range: [v * 0.95, v * 1.05] },
reveal: M("t = \\frac{d}{v} = \\frac{" + N(o.d / 10 ** Math.floor(Math.log10(o.d))) + " \\cdot 10^{" + Math.floor(Math.log10(o.d)) + "}}{3 \\cdot 10^5} \\approx " + N(v, v < 10 ? 2 : 0)) + " s. " + o.fin };
} });
add({ key: "photos", fam: "fermi", uses: ["decdiv"], outil: "la division et les conversions d'unités (1 Go = 1'000 Mo).",
make() {
const G = pk([64, 128, 256]), p = pk([2.5, 3, 4]), v = (G * 1000) / p;
return { titre: "Combien de photos ?", q: "Ton téléphone a encore " + M(G + "\\ \\text{Go}") + " de libres (" + M("1\\ \\text{Go} = 1\\text{'}000\\ \\text{Mo}") + "). Une photo pèse environ " + M(N(p) + "\\ \\text{Mo}") + ".",
bet: { q: "Combien de photos peux-tu encore prendre ?", choices: ["environ 400", "environ 4'000", "environ 40'000", "environ 400'000"], good: mag(v, [400, 4000, 40000, 400000]) },
calc: { label: "Nombre de photos (arrondi)", value: Math.round(v), range: [v * 0.95, v * 1.05] },
reveal: M(G + " \\cdot 1\\text{'}000 = " + N(G * 1000)) + " Mo, puis " + M(N(G * 1000) + " \\div " + N(p) + " \\approx " + N(Math.round(v))) + " photos. Une vidéo, elle, remplit la mémoire bien plus vite." };
} });
add({ key: "hirondelle", fam: "enigme", uses: ["vitesse"], outil: "la vitesse : inutile de suivre les allers-retours, il suffit de connaître la durée du vol (distance = vitesse · durée).",
make() {
const v = pk([12, 20]), D = pk([12, 18, 24, 30, 36]), [w, a] = pk([[50, "Une hirondelle"], [30, "Un petit drone"]]), t = D / (2 * v), d = r6(w * t);
return { titre: "L'hirondelle et les deux cyclistes", q: "Deux cyclistes sont à " + M(D + "\\ \\text{km}") + " l'un de l'autre et roulent l'un vers l'autre, chacun à " + M(v + "\\ \\text{km/h}") + ". " + a + " part du premier, vole à " + M(w + "\\ \\text{km/h}") + " jusqu'au second, fait demi-tour, et ainsi de suite jusqu'à ce que les cyclistes se croisent.",
bet: { q: "Quelle distance parcourt-" + (a.includes("drone") ? "il" : "elle") + " en tout ?", choices: ["moins de " + D + " km", "exactement " + D + " km", "plus de " + D + " km"], good: d < D ? 0 : d === D ? 1 : 2 },
calc: { label: "Distance parcourue en vol (en km)", value: d, round: 0.1 },
reveal: "Les cyclistes se rapprochent de " + M(2 * v + "\\ \\text{km/h}") + " : ils se croisent après " + M(D + " \\div " + 2 * v + " = " + N(t)) + " h. Pendant tout ce temps, on vole à " + w + " km/h : " + M(w + " \\cdot " + N(t) + " = " + N(d)) + " km. Pas besoin d'additionner une infinité d'allers-retours !" };
} });
add({ key: "traversee", fam: "enigme", uses: [], outil: "le raisonnement par étapes : repérer les paires interdites, et oser ramener un passager en arrière.",
make() {
const [L, C, X, xm] = pk([["un loup", "une chèvre", "un chou", "le chou"], ["un renard", "une poule", "un sac de grain", "le grain"]]), c = C.replace(/^une? /, "la "), l = L.replace(/^un /, "le "), x = X.replace(/^un /, "le ");
return { titre: "La traversée", q: "Un passeur doit faire traverser une rivière à " + L + ", " + C + " et " + X + ". Sa barque ne peut porter que lui et un seul passager. Sans lui, " + l + " mange " + c + ", et " + c + " mange " + xm + ".",
bet: { q: "Combien de traversées (aller ou retour) faut-il au minimum ?", choices: ["3", "5", "7", "C'est impossible"], good: 2 },
calc: { label: "Nombre minimal de traversées", value: 7 },
reveal: "1. " + c + " passe ; 2. retour à vide ; 3. " + l + " passe ; 4. on <b>ramène</b> " + c + " ; 5. " + x + " passe ; 6. retour à vide ; 7. " + c + " passe. Total : 7 traversées. Cette énigme figure déjà dans un recueil d'Alcuin, un savant de l'époque de Charlemagne, vers l'an 800." };
} });
add({ key: "cadenas", fam: "enigme", uses: ["puiss"], outil: "le dénombrement : 10 chiffres possibles sur chaque roue, donc 10 · 10 · 10 = 10³ codes pour 3 roues.",
make() {
const n = pk([3, 4]), s = pk([2, 3, 5]), codes = 10 ** n, m = r6((codes * s) / 60);
return { titre: "Le cadenas à code", q: "Tu as oublié le code de ton cadenas : " + M(n) + " roues, chacune avec les chiffres de 0 à 9. Tu essaies les codes un par un, un toutes les " + M(s) + " secondes.",
bet: { q: "Combien de temps te faut-il, au pire, pour tout essayer ?", choices: ["moins de 10 minutes", "entre 10 minutes et 1 heure", "plus d'une heure"], good: m < 10 ? 0 : m <= 60 ? 1 : 2 },
calc: { label: "Temps maximal pour essayer tous les codes (en minutes, à l'unité)", value: m, round: 1 },
reveal: M(n) + " roues : " + M("10^{" + n + "} = " + N(codes)) + " codes. " + M(N(codes) + " \\cdot " + s + " = " + N(codes * s)) + " s, soit " + M(N(codes * s) + " \\div 60 \\approx " + N(Math.round(m))) + " min. Une roue de plus, et c'est 10 fois plus long." };
} });
add({ key: "recharge", fam: "quotidien", sys: "CH", uses: ["decmul"], outil: "la multiplication et les conversions d'énergie (1 kWh = 1'000 Wh).",
make() {
const E = pk([15, 18, 20]), kwh = r6((E * 365) / 1000), c = r6(kwh * 0.28);
return { titre: "Recharger son téléphone", q: "Une recharge complète de ton téléphone consomme environ " + M(E + "\\ \\text{Wh}") + " (pertes du chargeur comprises). Tu le recharges une fois par jour. En Suisse, le kilowattheure (" + M("1\\ \\text{kWh} = 1\\text{'}000\\ \\text{Wh}") + ") coûte environ " + chf(0.28) + " à un ménage.",
bet: { q: "Combien coûte l'électricité pour une année de recharges ?", choices: ["moins de 5 CHF", "entre 5 et 50 CHF", "plus de 50 CHF"], good: c < 5 ? 0 : c <= 50 ? 1 : 2 },
calc: { label: "Coût sur une année (en CHF, au centime)", value: c, round: 0.01 },
reveal: M(E + " \\cdot 365 = " + N(E * 365)) + " Wh, soit " + M(N(kwh)) + " kWh. " + M(N(kwh) + " \\cdot 0{,}28 \\approx " + N(c, 2)) + " CHF par an : bien moins qu'un seul câble de rechange !" };
} });
add({ key: "rechargefr", fam: "quotidien", sys: "FR", uses: ["decmul"], outil: "la multiplication et les conversions d'énergie (1 kWh = 1 000 Wh).",
make() {
const E = pk([15, 18, 20]), kwh = r6((E * 365) / 1000), c = r6(kwh * 0.2);
return { titre: "Recharger son téléphone", q: "Une recharge complète de ton téléphone consomme environ " + M(E + "\\ \\text{Wh}") + " (pertes du chargeur comprises). Tu le recharges une fois par jour. En France, le kilowattheure (" + M("1\\ \\text{kWh} = 1\\,000\\ \\text{Wh}") + ") coûte environ " + eur(0.2) + " au tarif réglementé.",
bet: { q: "Combien coûte l'électricité pour une année de recharges ?", choices: ["moins de 5 €", "entre 5 et 50 €", "plus de 50 €"], good: c < 5 ? 0 : c <= 50 ? 1 : 2 },
calc: { label: "Coût sur une année (en €, au centime)", value: c, round: 0.01 },
reveal: M(E + " \\times 365 = " + NF(E * 365)) + " Wh, soit " + M(NF(kwh)) + " kWh. " + M(NF(kwh) + " \\times 0{,}20 \\approx " + NF(c, 2)) + " € par an : bien moins qu'un seul câble de rechange !" };
} });
add({ key: "tvafr", fam: "arnaque", sys: "FR", uses: ["pct"], outil: "les pourcentages : retrouver le prix avant une hausse, c'est diviser par 1,2, pas enlever 20 %.",
make() {
const HT = pk([150, 250, 400, 600, 1200]), TTC = r6(HT * 1.2), wrong = r6(TTC * 0.8);
return { titre: "Le prix hors taxe", q: "En France, le taux normal de TVA est de " + pc(20) + " : le prix TTC est le prix hors taxe augmenté de 20 %. Un vendeur affiche " + eur(TTC) + " TTC et dit : « Pour le prix hors taxe, j'enlève 20 % : " + eur(wrong) + ". »",
bet: { q: "A-t-il raison ?", choices: ["Oui, c'est le bon prix hors taxe", "Non, le vrai prix hors taxe est plus élevé", "Non, le vrai prix hors taxe est plus bas"], good: 1 },
calc: { label: "Quel est le vrai prix hors taxe ? (en €)", value: HT, round: 0.01 },
reveal: "TTC = HT × 1,2, donc HT = " + M(NF(TTC) + " \\div 1{,}2 = " + NF(HT)) + " €. Les 20 % se calculent sur le prix hors taxe, plus petit : enlever 20 % du prix TTC enlève trop (" + eur(r6(TTC - wrong)) + " au lieu de " + eur(r6(TTC - HT)) + ")." };
} });
add({ key: "fuseau", fam: "quotidien", uses: ["rel"], outil: "les nombres relatifs : le décalage horaire est la différence de deux écarts à l'heure universelle (UTC).",
make() {
const o = pk([{ c: "New York", z: -5, e: "un match de basket", H: [20, 21] }, { c: "Los Angeles", z: -8, e: "une cérémonie de remise de prix", H: [17, 18] },
{ c: "Tokyo", z: 9, e: "un concert", H: [18, 19, 20] }, { c: "Rio de Janeiro", z: -3, e: "un match de football", H: [16, 18, 19] }]);
const H = pk(o.H), dz = 1 - o.z, raw = H + dz, v = ((raw % 24) + 24) % 24, j = raw >= 24 ? " le lendemain" : raw < 0 ? " la veille" : "";
const zt = (z) => "UTC " + (z < 0 ? "− " + -z : "+ " + z);
return { titre: "En direct de " + o.c, q: "En janvier, " + o.e + " commence à " + H + " h, heure de " + o.c + " (" + zt(o.z) + "). Chez toi, on est à l'heure " + zt(1) + ".",
bet: { q: "Peux-tu le regarder en direct sans te lever en pleine nuit ?", choices: ["Oui", "Non"], good: v >= 7 ? 0 : 1 },
calc: { label: "À quelle heure commence-t-il chez toi ? (heure de 0 à 23)", value: v },
reveal: "Décalage : " + M("(+1) - (" + (o.z < 0 ? "-" : "+") + Math.abs(o.z) + ") = " + (dz > 0 ? "+" : "") + dz) + " h. " + M(H + " " + (dz < 0 ? "-" : "+") + " " + Math.abs(dz) + " = " + raw) + (raw >= 24 ? ", et " + M(raw + " - 24 = " + v) : "") + " : il commence à " + v + " h" + j + ", chez toi." };
} });
add({ key: "jetdeau", fam: "fermi", sys: "CH", uses: ["decdiv"], outil: "la division et les conversions de longueurs (m → mm).",
make() {
const [nom, ep, val] = pk([["5 francs", 2.35, 5], ["2 francs", 2.15, 2], ["1 franc", 1.55, 1]]), v = 140000 / ep;
return { titre: "Le Jet d'eau en pièces de monnaie", q: "Le Jet d'eau de Genève monte à environ " + M("140\\ \\text{m}") + ". Une pièce de " + nom + " a une épaisseur de " + M(m2(ep) + "\\ \\text{mm}") + ". On imagine une pile de pièces aussi haute que le jet.",
bet: { q: "Combien de pièces faut-il empiler ?", choices: ["environ 600", "environ 6'000", "environ 60'000", "environ 600'000"], good: mag(v, [600, 6000, 60000, 600000]) },
calc: { label: "Nombre de pièces (arrondi)", value: Math.round(v), range: [v * 0.95, v * 1.05] },
reveal: M("140\\ \\text{m} = 140\\text{'}000\\ \\text{mm}") + ", puis " + M("140\\text{'}000 \\div " + m2(ep) + " \\approx " + N(Math.round(v))) + " pièces, soit environ " + P(v * val) + " francs." };
} });
add({ key: "eiffel", fam: "fermi", sys: "FR", uses: ["decdiv"], outil: "la division et les conversions de longueurs (m → mm).",
make() {
const [nom, ep, val] = pk([["2 €", 2.2, 2], ["1 €", 2.33, 1], ["50 centimes", 2.38, 0.5]]), v = 330000 / ep;
return { titre: "La tour Eiffel en pièces de monnaie", q: "La tour Eiffel mesure environ " + M("330\\ \\text{m}") + ". Une pièce de " + nom + " a une épaisseur de " + M(m2(ep) + "\\ \\text{mm}") + ". On imagine une pile de pièces aussi haute que la tour.",
bet: { q: "Combien de pièces faut-il empiler ?", choices: ["environ 1\u202f500", "environ 15\u202f000", "environ 150\u202f000", "environ 1\u202f500\u202f000"], good: mag(v, [1500, 15000, 150000, 1500000]) },
calc: { label: "Nombre de pièces (arrondi)", value: Math.round(v), range: [v * 0.95, v * 1.05] },
reveal: M("330\\ \\text{m} = 330\\,000\\ \\text{mm}") + ", puis " + M("330\\,000 \\div " + m2(ep) + " \\approx " + NF(Math.round(v))) + " pièces, soit environ " + PF(v * val) + " €." };
} });
add({ key: "doubler", fam: "quotidien", uses: ["log"], outil: "les logarithmes : (1 + t/100)ⁿ ≥ 2 donne n ≥ ln 2 ÷ ln(1 + t/100) ; la « règle de 72 » en donne une bonne estimation : environ 72 ÷ t années.",
make() {
const t = pk([2, 3, 4, 6]), f = 1 + t / 100, x = Math.log(2) / Math.log(f), n = Math.ceil(x), C = pk([1000, 2000, 5000]);
return { titre: "Doubler son argent", q: "Tu places " + chf(C) + " sur un placement qui rapporte " + pc(t) + " par an, intérêts composés (chaque année, les intérêts s'ajoutent au capital et rapportent à leur tour).",
bet: { q: "Au bout de combien d'années ton capital aura-t-il doublé ?", choices: ["environ " + Math.round(100 / t) + " ans (100 % ÷ " + t + " %)", "environ " + Math.round(72 / t) + " ans", "environ " + 2 * Math.round(100 / t) + " ans"], good: 1 },
calc: { label: "Nombre entier d'années pour atteindre au moins le double", value: n },
reveal: "Après " + M("n") + " années : " + M(N(C) + " \\cdot " + N(f) + "^n") + ". On veut " + M(N(f) + "^n \\geq 2") + ", donc " + M("n \\geq \\frac{\\ln 2}{\\ln " + N(f) + "} \\approx " + N(x, 2)) + " : il faut " + n + " ans, moins que les " + Math.round(100 / t) + " ans qu'on imagine. Les banquiers utilisent la « règle de 72 » : " + M("72 \\div " + t + " = " + N(72 / t)) + " ans environ." };
} });

CURIEUX.forEach((c) => { const n = (id) => NOTIONS.find((x) => x.id === id); c.uses = c.uses.filter(n); });
})();

const Curieux = {

build(key, seed) {
const c = CURIEUX.find((x) => x.key === key); if (!c) return null;
seed = seed || Math.floor(Math.random() * 46655) + 1;
R.seed(seed * 7919 + [...key].reduce((a, ch) => a + ch.charCodeAt(0), 0));
return { ...c.make(), key, fam: c.fam, outil: c.outil, code: "cur-" + key + "-" + seed.toString(36) };
},
fromCode(code) { const m = /^cur-([a-z0-9]+)-([a-z0-9]+)$/.exec(code); return m ? this.build(m[1], parseInt(m[2], 36)) : null; },

available(state) {
const sys = (state && state.profile && state.profile.system) || "CH";
return CURIEUX.filter((c) => (!c.sys || c.sys === sys) && c.uses.every((id) => {
if (state && state.notions && state.notions[id]) return ["vu", "encours"].includes(state.notions[id].status);
const n = NOTIONS.find((x) => x.id === id), g = state && state.profile ? state.profile.grade : 9;
return n && n.CH && n.CH[0] < g;
}));
},

pick(state) {
const av = this.available(state); if (!av.length) return null;
const seen = (state && state.curSeen) || [], lastFam = seen.length ? (CURIEUX.find((c) => c.key === seen[seen.length - 1]) || {}).fam : null;
let pool = av.filter((c) => !seen.slice(-8).includes(c.key));
if (!pool.length) pool = av.filter((c) => c.key !== seen[seen.length - 1]);
if (!pool.length) pool = av;
const other = pool.filter((c) => c.fam !== lastFam);
if (other.length) pool = other;
return this.build(pool[Math.floor(Math.random() * pool.length)].key);
},
};






(function () {
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pk = (a) => a[Math.floor(Math.random() * a.length)];
const mil = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const tm = (n) => mil(n).replace(/'/g, "\\text{'}");
const svg = (w, h, g, lab) => `<svg class="fig hist-fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, t, o = "") => `<text x="${x}" y="${y}" class="f-txt" text-anchor="middle" font-size="13" ${o}>${t}</text>`;
const f1 = (v) => v.toFixed(1);
const dec = (v, k = 2) => String(+v.toFixed(k)).replace(".", "{,}");
const r2 = (v, k) => +v.toFixed(k);
const dm = (v, k = 2) => dec(v, k).replace(/^\d+/, (i) => tm(+i));

const mayaG = (n, y) => {
const b = Math.floor(n / 5), d = n % 5, H = 58; let yy = y + (H - ((d ? 13 : 0) + b * 11)) / 2, g = `<rect x="100" y="${y}" width="100" height="${H}" rx="6" class="f-soft"/>`;
if (d) { for (let i = 0; i < d; i++) g += `<circle cx="${150 - (d - 1) * 8 + i * 16}" cy="${yy + 5}" r="5" class="f-head"/>`; yy += 13; }
for (let i = 0; i < b; i++) { g += `<rect x="118" y="${yy + 1}" width="64" height="8" rx="3" class="f-head"/>`; yy += 11; }
return g;
};
const mayaW = (n) => { const b = Math.floor(n / 5), d = n % 5; return [b ? b + " barre" + (b > 1 ? "s" : "") : "", d ? d + " point" + (d > 1 ? "s" : "") : ""].filter(Boolean).join(" et "); };

const HISTOIRE = [
{ t: "Événement", titre: "Le signe « = » a été inventé en 1557", lien: "Équations", need: ["eq1"],
txt: "Le Gallois Robert Recorde en avait assez d'écrire « est égal à » dans ses calculs. Dans son livre <i>The Whetstone of Witte</i> (1557), il propose deux traits parallèles de même longueur, « parce que deux choses ne peuvent être plus égales ». Son signe était beaucoup plus long que le nôtre. Sa toute première équation écrite avec ce signe : 14x + 15 = 71.",
fig: () => svg(300, 120, `<rect x="40" y="38" width="220" height="10" rx="3" class="f-fill"/><rect x="40" y="70" width="220" height="10" rx="3" class="f-fill"/>${T(150, 108, "« is equalle to » → =", 'font-style="italic"')}${T(150, 24, "1557")}`, "le long signe égal de Recorde"),
ex: () => ({ q: "Résous la toute première équation écrite avec le signe « = » : \\(14x + 15 = 71\\). Que vaut \\(x\\) ?", value: 4, sol: "\\(14x = 71 - 15 = 56\\), donc \\(x = 56 \\div 14 = 4\\)." }) },
{ t: "Portrait", titre: "Al-Khwârizmî, qui a donné son nom à l'algorithme", lien: "Équations", need: ["eq2fact", "eq2disc"],
txt: "Savant de Bagdad au IX<sup>e</sup> siècle, al-Khwârizmî écrit un traité sur la résolution des équations, sans aucune lettre : tout est en phrases et en figures. Le mot « algèbre » vient du titre de ce livre (<i>al-jabr</i>) et le mot « algorithme » de son nom, déformé en latin. Pour résoudre « un carré et dix racines valent 39 », il complète un carré avec des rectangles.",
fig: () => svg(300, 150, `<rect x="105" y="45" width="60" height="60" class="f-shape"/>${T(135, 80, "x²")}<rect x="105" y="20" width="60" height="25" class="f-fill2"/><rect x="105" y="105" width="60" height="25" class="f-fill2"/><rect x="80" y="45" width="25" height="60" class="f-fill2"/><rect x="165" y="45" width="25" height="60" class="f-fill2"/>${T(135, 37, "2,5x", 'font-size="11"')}${T(135, 122, "2,5x", 'font-size="11"')}${[[80, 20], [165, 20], [80, 105], [165, 105]].map(([x, y]) => `<rect x="${x}" y="${y}" width="25" height="25" class="f-soft" stroke-dasharray="3 2"/>`).join("")}${T(245, 70, "39 + 4 · 6,25", 'font-size="12"')}${T(245, 88, "= 64 = 8²", 'font-size="12"')}`, "carré complété d'al-Khwârizmî"),
ex: () => ({ q: "Le problème d'al-Khwârizmî : \\(x^2 + 10x = 39\\), avec \\(x\\) positif. Que vaut \\(x\\) ? (Aide : le grand carré complété a une aire de 64.)", value: 3, sol: "Le grand carré a pour côté \\(\\sqrt{64} = 8 = x + 2{,}5 + 2{,}5\\), donc \\(x = 3\\). Vérification : \\(9 + 30 = 39\\)." }) },
{ t: "Anecdote", titre: "Les fractions des scribes égyptiens", lien: "Fractions",
txt: "Il y a plus de 3500 ans, les scribes égyptiens écrivaient presque toutes leurs fractions comme des sommes de fractions de numérateur 1, toutes différentes. Au lieu de 3/4, ils notaient 1/2 + 1/4. Le papyrus Rhind contient des tables entières de ces décompositions.",
fig: () => svg(300, 110, `<rect x="30" y="20" width="240" height="26" class="f-soft"/><rect x="30" y="20" width="180" height="26" class="f-fill2"/>${T(120, 38, "3/4")}<rect x="30" y="62" width="120" height="26" class="f-fill2"/><rect x="150" y="62" width="60" height="26" class="f-shape"/><rect x="210" y="62" width="60" height="26" class="f-soft"/>${T(90, 80, "1/2")}${T(180, 80, "1/4")}`, "trois quarts égale un demi plus un quart"),
ex: () => { const [a, b, n] = pk([[2, 3, 6], [5, 6, 3], [7, 12, 12], [3, 5, 10], [5, 8, 8], [7, 10, 5]]);
return { q: `Écris comme un scribe : \\(\\dfrac{${a}}{${b}} = \\dfrac{1}{2} + \\dfrac{1}{n}\\). Que vaut \\(n\\) ?`, value: n, sol: `\\(\\dfrac{${a}}{${b}} - \\dfrac{1}{2} = \\dfrac{1}{${n}}\\), donc \\(n = ${n}\\).` }; } },
{ t: "Événement", titre: "Le zéro devient un nombre", lien: "Nombres relatifs",
txt: "En 628, le mathématicien indien Brahmagupta donne des règles de calcul avec zéro et avec les nombres négatifs, qu'il appelle des « dettes » (les positifs sont des « fortunes ») : une dette moins zéro est une dette, zéro moins une dette est une fortune… Le zéro n'est plus seulement une place vide : c'est un nombre.",
fig: () => svg(300, 90, `<line x1="20" y1="45" x2="280" y2="45" class="f-line"/>${[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => `<line x1="${150 + k * 30}" y1="39" x2="${150 + k * 30}" y2="51" class="f-line"/>${T(150 + k * 30, 70, k < 0 ? "−" + -k : k)}`).join("")}<circle cx="150" cy="45" r="7" class="f-dot"/>${T(75, 24, "dettes", 'font-size="12"')}${T(225, 24, "fortunes", 'font-size="12"')}`, "droite des nombres avec zéro au centre"),
ex: () => { const a = ri(3, 9), b = ri(a + 2, 15);
return { q: `Une dette de ${a} moins une dette de ${b} : calcule \\(-${a} - (-${b})\\).`, value: b - a, sol: `\\(-${a} - (-${b}) = -${a} + ${b} = ${b - a}\\) : enlever une dette, c'est gagner.` }; } },
{ t: "Portrait", titre: "Fibonacci et les chiffres « arabes »", lien: "Suites et calcul",
txt: "En 1202, Léonard de Pise, dit Fibonacci, publie le <i>Liber Abaci</i>. Il y montre aux marchands européens comment calculer avec les chiffres indo-arabes (0 à 9) au lieu des chiffres romains. Il a appris ces méthodes en Afrique du Nord, où travaillait son père. Dans ce livre, un problème de lapins donne la célèbre suite 1, 1, 2, 3, 5, 8…",
fig: () => svg(300, 110, `${[1, 1, 2, 3, 5, 8].map((v, i) => `<rect x="${18 + i * 46}" y="30" width="38" height="38" rx="8" class="${i > 1 ? "f-fill2" : "f-soft"}"/>${T(37 + i * 46, 55, v, 'font-size="15"')}`).join("")}${T(150, 96, "chaque nombre = somme des deux précédents", 'font-size="12"')}`, "suite de Fibonacci"),
ex: () => { const n = ri(9, 13), f = [1, 1]; while (f.length < n) f.push(f.at(-1) + f.at(-2));
return { q: `Dans la suite 1, 1, 2, 3, 5, 8, …, chaque nombre est la somme des deux précédents. Quel est le ${n}<sup>e</sup> nombre ?`, value: f[n - 1], sol: `La suite : ${f.join(", ")}. Le ${n}<sup>e</sup> nombre est ${f[n - 1]}.` }; } },
{ t: "Anecdote", titre: "Archimède encadre π", lien: "Cercle et disque",
txt: "Vers 250 av. J.-C., Archimède dessine des polygones réguliers à l'intérieur et à l'extérieur d'un cercle, jusqu'à 96 côtés. Il en déduit que π est compris entre 3 + 10/71 et 3 + 1/7, soit environ entre 3,1408 et 3,1429. Sans calculatrice ! Son point de départ : l'hexagone inscrit, dont le périmètre vaut exactement 3 diamètres.",
fig: () => { const p = [...Array(6)].map((_, k) => f1(150 + 55 * Math.cos((k * Math.PI) / 3)) + "," + f1(70 + 55 * Math.sin((k * Math.PI) / 3))).join(" ");
return svg(300, 140, `<circle cx="150" cy="70" r="55" class="f-line"/><polygon points="${p}" class="f-fill2"/><line x1="150" y1="70" x2="205" y2="70" class="f-accent" stroke-width="2"/>${T(178, 64, "r", 'class="f-accent f-txt"')}`, "hexagone inscrit dans un cercle"); },
ex: () => { const r = ri(3, 12);
return { q: `Un hexagone régulier est inscrit dans un cercle de rayon ${r} cm (ses côtés mesurent aussi ${r} cm). Quel est son périmètre, en cm ?`, value: 6 * r, sol: `\\(6 \\cdot ${r} = ${6 * r}\\) cm, soit 3 diamètres. Le cercle, un peu plus long, mesure \\(2\\pi \\cdot ${r}\\) cm : donc \\(\\pi > 3\\).` }; } },
{ t: "Événement", titre: "Ératosthène mesure la Terre", lien: "Proportionnalité et angles",
txt: "Vers 240 av. J.-C., Ératosthène apprend qu'à midi, le jour du solstice d'été, le Soleil éclaire le fond des puits à Syène. Au même moment, à Alexandrie, les ombres font un angle d'environ 7,2°, soit 1/50 du tour complet. La distance entre les deux villes vaut donc 1/50 du tour de la Terre : une estimation étonnamment précise pour l'époque.",
fig: () => svg(300, 150, `<circle cx="150" cy="150" r="110" class="f-shape2"/><line x1="150" y1="150" x2="150" y2="40" class="f-line" stroke-dasharray="4 3"/><line x1="150" y1="150" x2="${f1(150 + 110 * Math.sin(0.35))}" y2="${f1(150 - 110 * Math.cos(0.35))}" class="f-line" stroke-dasharray="4 3"/><path d="M150 120 A30 30 0 0 1 ${f1(150 + 30 * Math.sin(0.35))} ${f1(150 - 30 * Math.cos(0.35))}" class="f-accent" stroke-width="2"/>${T(150, 32, "Syène")}${T(215, 40, "Alexandrie")}<line x1="40" y1="8" x2="40" y2="34" class="f-blue" stroke-width="2"/><line x1="60" y1="8" x2="60" y2="34" class="f-blue" stroke-width="2"/>${T(50, 48, "Soleil", 'font-size="11"')}`, "deux villes et l'angle au centre de la Terre"),
ex: () => { const a = pk([6, 7.2, 9, 10, 12]), d = pk([700, 750, 800, 850, 900]), k = Math.round(360 / a), C = k * d, A = String(a).replace(".", ",");
return { q: `Si l'angle valait ${A}° et la distance entre les deux villes ${d} km, combien mesurerait le tour de la Terre, en km ?`, value: C, sol: `\\(360 \\div ${A.replace(",", "{,}")} = ${k}\\) : la distance vaut \\(\\tfrac{1}{${k}}\\) du tour. Tour : \\(${k} \\cdot ${d} = ${tm(C)}\\) km.` }; } },
{ t: "Anecdote", titre: "Thalès et la hauteur de la pyramide", lien: "Théorème de Thalès",
txt: "Selon un récit rapporté par des auteurs grecs, Thalès aurait mesuré la hauteur d'une pyramide d'Égypte grâce à son ombre, en la comparant à l'ombre d'un bâton planté verticalement. C'est sans doute une légende, mais l'idée est exactement celle des triangles semblables : les rayons du Soleil sont parallèles.",
fig: () => svg(300, 130, `<line x1="10" y1="110" x2="290" y2="110" class="f-line"/><polygon points="40,110 110,30 180,110" class="f-shape"/><line x1="110" y1="30" x2="218" y2="110" class="f-accent" stroke-dasharray="4 3"/><line x1="232" y1="110" x2="232" y2="80" class="f-line" stroke-width="3"/><line x1="232" y1="80" x2="277" y2="110" class="f-accent" stroke-dasharray="4 3"/><line x1="110" y1="110" x2="218" y2="110" class="f-blue" stroke-width="3"/><line x1="232" y1="110" x2="277" y2="110" class="f-blue" stroke-width="3"/>${T(165, 126, "ombre", 'font-size="11"')}${T(232, 72, "bâton", 'font-size="11"')}`, "pyramide, bâton et leurs ombres"),
ex: () => { const [h, s] = pk([[2, 3], [1, 2], [2, 5], [3, 4]]), S = ri(20, 40) * s, H = (S * h) / s;
return { q: `Un bâton de ${h} m a une ombre de ${s} m. Au même moment, l'ombre de la pyramide (mesurée depuis son centre) fait ${S} m. Quelle est la hauteur de la pyramide, en m ?`, value: H, sol: `Mêmes proportions : \\(\\dfrac{H}{${S}} = \\dfrac{${h}}{${s}}\\), donc \\(H = ${S} \\cdot ${h} \\div ${s} = ${H}\\) m.` }; } },
{ t: "Anecdote", titre: "Le petit Gauss et la somme de 1 à 100", lien: "Calcul littéral",
txt: "Selon une anecdote célèbre, l'instituteur du jeune Carl Friedrich Gauss aurait demandé à sa classe d'additionner les nombres de 1 à 100. Gauss aurait répondu presque aussitôt 5050 : 1 + 100, 2 + 99, 3 + 98… font 50 paires qui valent chacune 101.",
fig: () => svg(300, 110, `${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => T(25 + i * 28, 80, v, 'font-size="15"')).join("")}${[0, 1, 2, 3, 4].map((i) => `<path d="M${25 + i * 28} 64 Q 151 ${16 + i * 8} ${277 - i * 28} 64" class="f-accent" stroke-width="1.6"/>`).join("")}${T(150, 104, "5 paires de 11", 'font-size="12"')}`, "nombres de 1 à 10 reliés par paires"),
ex: () => { const n = pk([20, 30, 40, 50, 60, 80]), v = (n * (n + 1)) / 2;
return { q: `Fais comme Gauss : calcule \\(1 + 2 + 3 + \\ldots + ${n}\\).`, value: v, sol: `${n / 2} paires qui valent chacune \\(${n + 1}\\) : \\(${n / 2} \\cdot ${n + 1} = ${tm(v)}\\).` }; } },
{ t: "Événement", titre: "Une tablette babylonienne et les triangles rectangles", lien: "Théorème de Pythagore",
txt: "La tablette d'argile Plimpton 322, écrite en Mésopotamie vers 1800 av. J.-C., contient des listes de nombres liés aux triangles rectangles, plus de mille ans avant Pythagore. Sa première ligne contient 119 et 169 : avec 120, ils forment un triangle rectangle. Les spécialistes discutent encore de l'usage exact de la tablette.",
fig: () => svg(300, 120, `<rect x="30" y="15" width="240" height="90" rx="12" class="f-shape2"/>${[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => `<path d="M${55 + c * 30} ${35 + r * 25} l9 4 l-9 4 z" class="f-head"/>`).join("")).join("")}`, "tablette d'argile couverte de signes cunéiformes"),
ex: () => { const [a, b, c] = pk([[119, 120, 169], [45, 60, 75]]);
return { q: `Un triangle rectangle a des côtés de l'angle droit de ${a} et ${b}. Quelle est la longueur de l'hypoténuse ?`, value: c, sol: `\\(${a}^2 + ${b}^2 = ${tm(a * a)} + ${tm(b * b)} = ${tm(c * c)} = ${c}^2\\), donc l'hypoténuse mesure ${c}.` }; } },
{ t: "Portrait", titre: "Sophie Germain, alias « Monsieur Le Blanc »", lien: "Nombres premiers",
txt: "Au début du XIX<sup>e</sup> siècle, les femmes ne pouvaient pas étudier à l'École polytechnique. Sophie Germain se procure les cours et envoie ses travaux sous le nom d'un ancien élève, « M. Le Blanc ». Elle correspond même ainsi avec Gauss, qui découvre plus tard qui elle est et la félicite. On appelle aujourd'hui « nombre de Sophie Germain » un nombre premier p tel que 2p + 1 est aussi premier.",
fig: () => svg(300, 110, `<rect x="70" y="20" width="160" height="80" rx="6" class="f-shape2"/><path d="M70 20 L150 65 L230 20" class="f-line"/>${T(150, 92, "M. Le Blanc", 'font-style="italic"')}`, "lettre signée M. Le Blanc"),
ex: () => { const [m, p] = pk([[20, 23], [30, 41], [50, 53]]);
return { q: `Quel est le plus petit nombre premier \\(p\\) plus grand que ${m} tel que \\(2p + 1\\) soit aussi premier ?`, value: p, sol: m === 20 ? "\\(23\\) : \\(2 \\cdot 23 + 1 = 47\\), premier." : m === 30 ? "\\(31\\) donne 63 et \\(37\\) donne 75 (non premiers) ; \\(41\\) donne \\(83\\), premier." : "\\(53\\) : \\(2 \\cdot 53 + 1 = 107\\), premier." }; } },
{ t: "Portrait", titre: "Maryam Mirzakhani, médaille Fields 2014", lien: "Géométrie dans l'espace",
txt: "Née à Téhéran, Maryam Mirzakhani est en 2014 la première femme à recevoir la médaille Fields, la plus haute récompense pour les jeunes mathématiciens. Elle étudiait la géométrie des surfaces courbes (sphères, bouées à un ou plusieurs trous…) et aimait réfléchir en dessinant sur de grandes feuilles.",
fig: () => svg(300, 120, `<ellipse cx="150" cy="60" rx="110" ry="42" class="f-shape"/><path d="M105 58 Q150 80 195 58" class="f-line"/><path d="M115 64 Q150 46 185 64" class="f-line"/>`, "surface en forme de bouée"),
ex: () => { const n = ri(5, 9);
return { q: `Un prisme a pour base un polygone à ${n} côtés. Combien a-t-il d'arêtes ?`, value: 3 * n, sol: `${n} arêtes en bas, ${n} en haut et ${n} verticales : \\(3 \\cdot ${n} = ${3 * n}\\).` }; } },
{ t: "Événement", titre: "Descartes met la géométrie en équations", lien: "Repère et fonctions",
txt: "En 1637, René Descartes publie <i>La Géométrie</i>. Il y décrit les points par des nombres et les courbes par des équations. C'est aussi lui qui popularise l'habitude de noter les inconnues x, y, z et les nombres connus a, b, c.",
fig: () => svg(300, 140, `<line x1="30" y1="120" x2="280" y2="120" class="f-line"/><line x1="50" y1="135" x2="50" y2="10" class="f-line"/><line x1="50" y1="60" x2="170" y2="60" class="f-grid" stroke-dasharray="3 3"/><line x1="170" y1="60" x2="170" y2="120" class="f-grid" stroke-dasharray="3 3"/><circle cx="170" cy="60" r="5" class="f-dot"/>${T(200, 52, "P(x ; y)")}${T(275, 135, "x")}${T(40, 18, "y")}`, "repère avec un point"),
ex: () => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]), x = ri(-3, 3), y = ri(-3, 3);
return { q: `Dans un repère, A(${x} ; ${y}) et B(${x + a} ; ${y + b}). Quelle est la distance AB ?`, value: c, sol: `Écarts : \\(${a}\\) et \\(${b}\\). \\(AB = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${c * c}} = ${c}\\).` }; } },
{ t: "Portrait", titre: "Leonhard Euler, le Bâlois prolifique", lien: "Fonctions",
txt: "Né à Bâle en 1707, Leonhard Euler est l'un des mathématiciens les plus productifs de l'histoire. Devenu presque aveugle, il continue à publier en dictant ses calculs. On lui doit beaucoup de notations encore utilisées, comme f(x) pour une fonction.",
fig: () => svg(300, 110, `<rect x="40" y="35" width="70" height="40" rx="8" class="f-soft"/>${T(75, 60, "x")}<line x1="110" y1="55" x2="140" y2="55" class="f-line"/><path d="M140 49 l10 6 l-10 6 z" class="f-head"/><rect x="150" y="30" width="50" height="50" rx="10" class="f-fill"/><text x="175" y="61" class="f-on" text-anchor="middle" font-size="16">f</text><line x1="200" y1="55" x2="222" y2="55" class="f-line"/><path d="M222 49 l10 6 l-10 6 z" class="f-head"/>${T(262, 60, "f(x)")}`, "machine fonction"),
ex: () => { const a = ri(2, 5), k = ri(2, 6), b = ri(1, Math.min(9, a * k * k - 2));
return { q: `Avec la notation d'Euler : \\(f(x) = ${a}x^2 - ${b}\\). Calcule \\(f(${k})\\).`, value: a * k * k - b, sol: `\\(f(${k}) = ${a} \\cdot ${k}^2 - ${b} = ${a * k * k} - ${b} = ${a * k * k - b}\\).` }; } },
{ t: "Événement", titre: "Les sept ponts de Königsberg", lien: "Raisonnement",
txt: "En 1736, Euler résout une énigme de la ville de Königsberg : peut-on se promener en traversant chacun des sept ponts une seule fois ? Il remplace la carte par des points (les quartiers) et des traits (les ponts), et montre que c'est impossible : trop de quartiers sont reliés par un nombre impair de ponts. C'est la naissance de la théorie des graphes.",
fig: () => svg(300, 140, `<path d="M20 52 Q150 40 280 52 L280 88 Q150 100 20 88 Z" class="f-soft"/><path d="M110 70 Q88 44 110 18 M110 70 Q132 44 110 18 M110 70 Q88 96 110 122 M110 70 Q132 96 110 122 M110 70 L230 70 M110 18 L230 70 M110 122 L230 70" class="f-blue" stroke-width="2"/><circle cx="110" cy="70" r="7" class="f-dot"/><circle cx="110" cy="18" r="7" class="f-dot"/><circle cx="110" cy="122" r="7" class="f-dot"/><circle cx="230" cy="70" r="7" class="f-dot"/>`, "graphe des sept ponts de Königsberg"),
ex: () => ({ q: "Sur le graphe, compte les ponts (traits bleus) de chaque quartier (points rouges) : le quartier du milieu en a 5. Combien de quartiers ont un nombre <b>impair</b> de ponts ?", value: 4, sol: "Les 4 quartiers ont 5, 3, 3 et 3 ponts. Euler a montré qu'une telle promenade demande au plus 2 quartiers impairs : ici, c'est impossible." }) },
{ t: "Anecdote", titre: "La Pascaline, une calculatrice de 1642", lien: "Calcul",
txt: "À 19 ans, Blaise Pascal invente une machine à calculer pour aider son père, chargé de collecter les impôts en Normandie, qui passait ses nuits à additionner. Des roues dentées font les additions, et un mécanisme ingénieux reporte automatiquement les retenues d'une roue à la suivante.",
fig: () => svg(300, 110, `<rect x="30" y="20" width="240" height="70" rx="10" class="f-shape2"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${70 + i * 40}" cy="55" r="16" class="f-shape"/><circle cx="${70 + i * 40}" cy="55" r="3" class="f-head"/>`).join("")}`, "machine à roues de Pascal"),
ex: () => {
const da = [ri(1, 6), ri(2, 9), ri(2, 9), ri(2, 9)], db = [ri(1, 2), 0, 0, 0];
for (let i = 1; i < 4; i++) db[i] = ri(Math.max(1, 10 - da[i]), 9);
const a = +da.join(""), b = +db.join("");
return { q: `Comme la Pascaline, additionne avec les retenues : \\(${tm(a)} + ${tm(b)}\\).`, value: a + b, sol: `\\(${tm(a)} + ${tm(b)} = ${tm(a + b)}\\).` }; } },
{ t: "Anecdote", titre: "Les Mayas comptaient en base 20", lien: "Numération",
txt: "Les Mayas d'Amérique centrale écrivaient les nombres avec des points (1) et des barres (5), et un coquillage pour zéro : l'une des plus anciennes notations du zéro. Ils comptaient par vingtaines : un chiffre placé un étage plus haut vaut 20 fois plus.",



fig: (E) => { const [up, low] = (E && E.maya) || [2, 12];
return svg(300, 140, mayaG(up, 8) + T(240, 42, "× 20", 'font-size="12"') + mayaG(low, 74) + T(240, 108, "× 1", 'font-size="12"'), "nombre maya sur deux étages : en haut " + up + ", en bas " + low); },
ex: () => { const up = ri(3, 19), low = ri(1, 19), bu = Math.floor(up / 5), bl = Math.floor(low / 5);
return { maya: [up, low], q: `Le nombre maya de la figure : en haut (les vingtaines), ${mayaW(up)} ; en bas (les unités), ${mayaW(low)}. Que vaut-il ?`, value: 20 * up + low,
sol: `En haut : \\(${bu ? bu + " \\cdot 5" + (up % 5 ? " + " + (up % 5) : "") + " = " : ""}${up}\\) vingtaines, soit \\(${up} \\cdot 20 = ${20 * up}\\). En bas : \\(${bl ? bl + " \\cdot 5" + (low % 5 ? " + " + (low % 5) : "") + " = " : ""}${low}\\). Total : \\(${20 * up + low}\\).` }; } },
{ t: "Événement", titre: "Pourquoi 60 minutes dans une heure ?", lien: "Numération et durées",
txt: "Les Babyloniens comptaient en base 60, il y a plus de 4000 ans. Nous en avons hérité les 60 minutes d'une heure, les 60 secondes d'une minute et les 360 degrés du cercle. Un nombre s'écrivait avec des « chiffres » de 0 à 59 mis côte à côte : nous les séparons ici par une barre, « 1 | 20 », pour une soixantaine et vingt, c'est-à-dire 80 (pas de virgule : ce n'est pas un nombre décimal).",
fig: () => svg(300, 130, `<circle cx="150" cy="65" r="52" class="f-shape2"/>${[...Array(12)].map((_, k) => { const s = Math.sin((k * Math.PI) / 6), c = Math.cos((k * Math.PI) / 6); return `<line x1="${f1(150 + 44 * s)}" y1="${f1(65 - 44 * c)}" x2="${f1(150 + 52 * s)}" y2="${f1(65 - 52 * c)}" class="f-line"/>`; }).join("")}<line x1="150" y1="65" x2="150" y2="25" class="f-line" stroke-width="3"/><line x1="150" y1="65" x2="180" y2="65" class="f-accent" stroke-width="3"/>`, "cadran d'horloge"),
ex: () => { const a = ri(2, 4), b = ri(11, 49);
return { q: `Un nombre babylonien s'écrit « ${a} | ${b} » (${a} soixantaines et ${b} unités ; la barre sépare les deux « chiffres »). Que vaut-il ?` , value: 60 * a + b, sol: `\\(${a} \\cdot 60 + ${b} = ${60 * a + b}\\). Comme ${a} h ${b} min = ${60 * a + b} min.` }; } },
{ t: "Anecdote", titre: "Euclide : les nombres premiers ne s'arrêtent jamais", lien: "Nombres premiers",
txt: "Vers 300 av. J.-C., dans ses <i>Éléments</i>, Euclide démontre qu'il existe une infinité de nombres premiers. L'idée : multiplie des nombres premiers et ajoute 1. Le résultat n'est divisible par aucun d'eux, donc il existe forcément un autre nombre premier.",
fig: () => svg(300, 100, `${[2, 3, 5, 7, 11, 13, 17, 19, 23].map((p, i) => `<circle cx="${25 + i * 31}" cy="45" r="13" class="${i % 2 ? "f-fill2" : "f-shape"}"/>${T(25 + i * 31, 50, p, 'font-size="12"')}`).join("")}${T(150, 88, "… et ainsi de suite, sans fin", 'font-size="12"')}`, "liste de nombres premiers"),
ex: () => { const L = pk([[2, 3, 5], [2, 3, 5, 7], [2, 3, 5, 7, 11]]), v = L.reduce((x, y) => x * y, 1) + 1;
return { q: `Calcule comme Euclide : \\(${L.join(" \\cdot ")} + 1\\).`, value: v, sol: `\\(${L.join(" \\cdot ")} = ${tm(v - 1)}\\), plus 1 : \\(${tm(v)}\\). Divisé par ${L.join(", ")}, il reste toujours 1 (et ici, c'est même un nombre premier).` }; } },
{ t: "Anecdote", titre: "Ramanujan et le taxi 1729", lien: "Puissances",
txt: "Le mathématicien anglais G. H. Hardy rend visite à l'Indien Srinivasa Ramanujan, malade, et lui dit que le numéro de son taxi, 1729, est bien banal. Ramanujan répond aussitôt que non : c'est le plus petit nombre qui s'écrit de deux façons différentes comme somme de deux cubes.",
fig: () => svg(300, 110, `<path d="M95 40 L115 20 L185 20 L205 40" class="f-shape2"/><rect x="60" y="40" width="180" height="40" rx="10" class="f-fill2"/><circle cx="100" cy="82" r="12" class="f-head"/><circle cx="200" cy="82" r="12" class="f-head"/><rect x="118" y="48" width="64" height="22" rx="4" class="f-soft"/>${T(150, 64, "1729", 'font-size="15"')}`, "taxi numéro 1729"),
ex: () => ({ q: pk(["Calcule \\(9^3 + 10^3\\).", "Calcule \\(1^3 + 12^3\\)."]), value: 1729, sol: "\\(9^3 + 10^3 = 729 + 1000 = 1729\\) et \\(1^3 + 12^3 = 1 + 1728 = 1729\\) : les deux façons de Ramanujan." }) },
{ t: "Portrait", titre: "Ada Lovelace, première programmeuse", lien: "Algorithmes",
txt: "En 1843, Ada Lovelace traduit et commente un article sur la « machine analytique » imaginée par Charles Babbage. Dans ses notes, elle décrit pas à pas comment la machine pourrait calculer une suite de nombres compliqués : on considère souvent que c'est le premier programme informatique publié.",
fig: () => svg(300, 110, `${["départ", "× 2", "+ 1", "répète"].map((s, i) => `<rect x="${12 + i * 72}" y="35" width="60" height="34" rx="8" class="${i === 3 ? "f-fill2" : "f-soft"}"/>${T(42 + i * 72, 57, s, 'font-size="12"')}${i < 3 ? `<path d="M${72 + i * 72} 52 l12 0" class="f-line"/>` : ""}`).join("")}<path d="M258 69 Q 186 100 114 69" class="f-accent" stroke-width="1.6"/>`, "programme en étapes"),
ex: () => { const s = ri(1, 3), n = ri(4, 6), t = [s]; for (let i = 0; i < n; i++) t.push(2 * t.at(-1) + 1);
return { q: `Un programme : pars de ${s}, puis répète ${n} fois « multiplie par 2, puis ajoute 1 ». Quel nombre obtiens-tu ?`, value: t.at(-1), sol: "Les étapes : " + t.join(" → ") + "." }; } },


{ t: "Anecdote", titre: "L'âge de Diophante", lien: "Équations",
txt: "Diophante d'Alexandrie (III<sup>e</sup> siècle) a écrit l'<i>Arithmétique</i>, un des premiers livres où l'on résout des équations avec des abréviations. On ne sait presque rien de sa vie, mais une énigme grecque, présentée comme son épitaphe, prétend donner son âge : son enfance dura 1/6 de sa vie, sa jeunesse 1/12, puis il se maria et passa encore 1/7 de sa vie avant d'avoir un fils 5 ans plus tard ; ce fils vécut la moitié de l'âge de son père, et Diophante mourut 4 ans après lui.",
fig: () => svg(300, 130, `<path d="M100 120 L100 45 Q100 15 150 15 Q200 15 200 45 L200 120 Z" class="f-shape2"/>${T(150, 52, "x/6 + x/12", 'font-size="12"')}${T(150, 72, "+ x/7 + 5", 'font-size="12"')}${T(150, 92, "+ x/2 + 4 = x", 'font-size="12"')}<line x1="70" y1="120" x2="230" y2="120" class="f-line"/>`, "épitaphe de Diophante"),
ex: () => ({ q: "Résous l'énigme : \\(\\dfrac{x}{6} + \\dfrac{x}{12} + \\dfrac{x}{7} + 5 + \\dfrac{x}{2} + 4 = x\\). Quel âge avait Diophante ?", value: 84, sol: "Au dénominateur commun 84 : \\(14x + 7x + 12x + 42x = 75x\\), donc \\(75x + 9 \\cdot 84 = 84x\\), \\(9x = 756\\), \\(x = 84\\) ans." }) },
{ t: "Événement", titre: "Napier transforme les multiplications en additions", lien: "Puissances",
txt: "En 1614, l'Écossais John Napier publie ses tables de logarithmes. L'idée : grâce à une table, une multiplication difficile devient une addition facile. Pendant plus de trois siècles, astronomes, navigateurs et ingénieurs calculent ainsi, puis avec la règle à calcul, jusqu'à l'arrivée des calculatrices.",
fig: () => svg(300, 120, `${[[1, 2], [2, 4], [3, 8], [4, 16], [5, 32], [6, 64]].map(([e, v], i) => `<rect x="${20 + i * 44}" y="20" width="40" height="30" class="f-soft"/>${T(40 + i * 44, 40, e, 'font-size="12"')}<rect x="${20 + i * 44}" y="50" width="40" height="30" class="f-fill2"/>${T(40 + i * 44, 70, v, 'font-size="12"')}`).join("")}${T(150, 105, "4 · 16 = 64 ⟷ 2 + 4 = 6", 'font-size="12"')}`, "table des puissances de 2"),
ex: () => { const a = ri(3, 9), b = ri(3, 9);
return { q: `Même idée : \\(2^{${a}} \\cdot 2^{${b}} = 2^{n}\\). Que vaut \\(n\\) ?`, value: a + b, sol: `On additionne les exposants : \\(n = ${a} + ${b} = ${a + b}\\).` }; } },
{ t: "Événement", titre: "Pascal et Fermat inventent les probabilités", lien: "Probabilités",
txt: "En 1654, Blaise Pascal et Pierre de Fermat s'écrivent des lettres à propos de jeux de hasard : comment partager équitablement la mise d'une partie interrompue ? Les questions d'un joueur, le chevalier de Méré, sur les dés, sont aussi au cœur de leurs échanges. Ces lettres sont considérées comme le début du calcul des probabilités.",
fig: () => svg(300, 110, `<rect x="80" y="25" width="60" height="60" rx="10" class="f-shape"/><rect x="160" y="25" width="60" height="60" rx="10" class="f-shape"/>${[[95, 40], [125, 70], [110, 55]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" class="f-head"/>`).join("")}${[[175, 40], [205, 40], [175, 70], [205, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" class="f-head"/>`).join("")}`, "deux dés"),
ex: () => { const t = ri(4, 10), n = 6 - Math.abs(7 - t);
return { q: `On lance deux dés (36 résultats possibles, en distinguant les dés). De combien de façons peut-on obtenir une somme de ${t} ?`, value: n, sol: `Les couples : ${[...Array(6)].map((_, i) => i + 1).filter((a) => t - a >= 1 && t - a <= 6).map((a) => "(" + a + " ; " + (t - a) + ")").join(", ")} : ${n} façons sur 36.` }; } },
{ t: "Portrait", titre: "Emmy Noether, la symétrie au cœur de la physique", lien: "Symétries",
txt: "Emmy Noether (1882–1935) est une mathématicienne allemande. À Göttingen, elle donne d'abord ses cours sous le nom d'un collègue, car une femme ne peut pas y enseigner officiellement. Son théorème relie chaque symétrie d'un phénomène physique à une grandeur qui se conserve. À sa mort, Einstein la décrit comme un génie mathématique créatif de premier plan.",
fig: () => { const p = [...Array(6)].map((_, k) => f1(150 + 50 * Math.cos((k * Math.PI) / 3)) + "," + f1(62 + 50 * Math.sin((k * Math.PI) / 3))).join(" ");
return svg(300, 125, `<polygon points="${p}" class="f-fill2"/>${[0, 1, 2, 3, 4, 5].map((k) => `<line x1="${f1(150 - 60 * Math.cos((k * Math.PI) / 6))}" y1="${f1(62 - 60 * Math.sin((k * Math.PI) / 6))}" x2="${f1(150 + 60 * Math.cos((k * Math.PI) / 6))}" y2="${f1(62 + 60 * Math.sin((k * Math.PI) / 6))}" class="f-accent" stroke-dasharray="4 3"/>`).join("")}`, "hexagone régulier et ses axes de symétrie"); },
ex: () => { const P = [[3, "triangle équilatéral"], [4, "carré"], [5, "pentagone régulier"], [6, "hexagone régulier"], [8, "octogone régulier"]], c = [...P].sort(() => Math.random() - 0.5).slice(0, 3), s = c.reduce((a, x) => a + x[0], 0);
return { q: `Combien d'axes de symétrie en tout pour un ${c[0][1]}, un ${c[1][1]} et un ${c[2][1]} ?`, value: s, sol: `Un polygone régulier a autant d'axes que de côtés : \\(${c.map((x) => x[0]).join(" + ")} = ${s}\\).` }; } },
{ t: "Portrait", titre: "Alan Turing, la machine et le code secret", lien: "Algorithmes",
txt: "En 1936, le Britannique Alan Turing imagine une machine abstraite qui lit et écrit des symboles sur un ruban : c'est le modèle théorique de tous nos ordinateurs. Pendant la Seconde Guerre mondiale, à Bletchley Park, il joue un rôle majeur pour déchiffrer les messages codés par la machine allemande Enigma.",
fig: () => svg(300, 110, `${["1", "0", "1", "1", "0", "1"].map((b, i) => `<rect x="${45 + i * 35}" y="45" width="35" height="35" class="${i === 2 ? "f-fill2" : "f-soft"}"/>${T(62 + i * 35, 68, b, 'font-size="15"')}`).join("")}<path d="M132 20 l14 18 l14 -18 z" class="f-headacc"/>${T(152, 100, "ruban de la machine", 'font-size="11"')}`, "ruban d'une machine de Turing"),
ex: () => { const v = ri(17, 31), b = v.toString(2);
return { q: `Les ordinateurs comptent en binaire (base 2). Que vaut le nombre binaire ${b} en base 10 ?`, value: v, sol: `${b.split("").map((d, i) => d + " · " + 2 ** (b.length - 1 - i)).join(" + ")} = ${v}.` }; } },
{ t: "Portrait", titre: "Katherine Johnson, la calculatrice de la NASA", lien: "Vitesse et proportionnalité",
txt: "Mathématicienne afro-américaine, Katherine Johnson calcule des trajectoires pour la NASA. En 1962, avant de devenir le premier Américain à faire le tour de la Terre en orbite, l'astronaute John Glenn demande qu'elle vérifie à la main les calculs de l'ordinateur. Son histoire est racontée dans le film <i>Les Figures de l'ombre</i>.",
fig: () => svg(300, 130, `<circle cx="150" cy="65" r="38" class="f-shape"/><ellipse cx="150" cy="65" rx="110" ry="50" class="f-accent" stroke-dasharray="5 4"/><circle cx="260" cy="65" r="6" class="f-dot"/>${T(150, 70, "Terre", 'font-size="12"')}`, "orbite autour de la Terre"),
ex: () => { const t = pk([0.5, 1.5, 2, 2.5]), d = 28000 * t, ts = String(t).replace(".", ",");
return { q: `Une capsule en orbite file à environ 28'000 km/h. Quelle distance parcourt-elle en ${ts} h, en km ?`, value: d, sol: `\\(28\\,000 \\cdot ${ts.replace(",", "{,}")} = ${tm(d)}\\) km.` }; } },
{ t: "Événement", titre: "Zu Chongzhi et l'approximation 355/113", lien: "Fractions et π",
txt: "Au V<sup>e</sup> siècle, en Chine, l'astronome Zu Chongzhi montre que π est compris entre 3,1415926 et 3,1415927. Il propose la fraction 355/113, qui donne π avec 6 décimales justes. Il faudra presque mille ans pour faire mieux ailleurs dans le monde.",
fig: () => svg(300, 110, `<rect x="90" y="18" width="120" height="74" rx="10" class="f-shape2"/>${T(150, 48, "355", 'font-size="20"')}<line x1="115" y1="56" x2="185" y2="56" class="f-line" stroke-width="2"/>${T(150, 80, "113", 'font-size="20"')}${T(255, 60, "≈ π", 'font-size="16"')}`, "fraction 355 sur 113"),
ex: () => ({ q: "Division euclidienne : \\(355 = 113 \\cdot 3 + r\\). Que vaut le reste \\(r\\) ?", value: 16, sol: "\\(113 \\cdot 3 = 339\\) et \\(355 - 339 = 16\\) : \\(\\dfrac{355}{113} = 3 + \\dfrac{16}{113} \\approx 3{,}14159\\)." }) },
{ t: "Anecdote", titre: "Les pythagoriciens et la musique", lien: "Fractions",
txt: "Les pythagoriciens, en Grèce antique, remarquent que les sons agréables à l'oreille correspondent à des rapports simples de longueurs de cordes : une corde deux fois plus courte sonne à l'octave, une corde aux 2/3 de la longueur sonne à la quinte, aux 3/4 à la quarte. Pour eux, « tout est nombre ».",
fig: () => svg(300, 100, `<rect x="20" y="55" width="260" height="20" rx="4" class="f-shape2"/><line x1="35" y1="50" x2="265" y2="50" class="f-line" stroke-width="2"/><path d="M188 50 l-8 12 l16 0 z" class="f-headacc"/>${T(110, 40, "2/3", 'font-size="13"')}`, "corde et chevalet aux deux tiers"),
ex: () => { const L = pk([48, 60, 72, 84, 96]), [f, nom] = pk([[[2, 3], "la quinte"], [[3, 4], "la quarte"]]), r = (L * f[0]) / f[1];
return { q: `Une corde mesure ${L} cm. Pour jouer ${nom}, on la raccourcit aux ${f[0]}/${f[1]} de sa longueur. Quelle longueur, en cm ?`, value: r, sol: `\\(${L} \\cdot \\dfrac{${f[0]}}{${f[1]}} = ${r}\\) cm.` }; } },
{ t: "Portrait", titre: "Florence Nightingale, infirmière et statisticienne", lien: "Statistiques et pourcentages",
txt: "Pendant la guerre de Crimée (1853–1856), Florence Nightingale constate que bien plus de soldats meurent de maladies évitables, faute d'hygiène, que de leurs blessures. Pour convaincre les autorités, elle invente des diagrammes en forme de rose. En 1858, elle devient la première femme membre de la Société royale de statistique.",
fig: () => svg(300, 130, `${[[0, 50], [1, 34], [2, 56], [3, 26], [4, 44], [5, 30], [6, 52], [7, 22]].map(([k, r]) => { const a1 = (k * Math.PI) / 4, a2 = ((k + 1) * Math.PI) / 4; return `<path d="M150 65 L${f1(150 + r * Math.cos(a1))} ${f1(65 + r * Math.sin(a1))} A${r} ${r} 0 0 1 ${f1(150 + r * Math.cos(a2))} ${f1(65 + r * Math.sin(a2))} Z" class="${k % 2 ? "f-fill2" : "f-shape"}"/>`; }).join("")}`, "diagramme en rose"),
ex: () => { const N = pk([800, 1200, 1500, 2000]), p = pk([60, 70, 75, 80]), m = (N * p) / 100;
return { q: `Sur ${tm(N).replace(/\\,/g, "'")} décès, ${tm(m).replace(/\\,/g, "'")} sont dus à des maladies évitables. Quel pourcentage cela représente-t-il ?`, value: p, sol: `\\(${tm(m)} \\div ${tm(N)} = ${p / 100}\\)`.replace(".", "{,}") + `, soit ${p} %.` }; } },
{ t: "Événement", titre: "Le mètre, mesuré sur la Terre", lien: "Conversions",
txt: "En 1791, la France révolutionnaire définit le mètre comme la dix-millionième partie du quart de méridien terrestre (du pôle Nord à l'équateur). Pour le mesurer, Delambre et Méchain arpentent de 1792 à 1798 le méridien de Dunkerque à Barcelone, par triangulation. Le système métrique, avec ses unités qui vont de 10 en 10, est aujourd'hui utilisé presque partout.",
fig: () => svg(300, 140, `<path d="M60 125 A110 110 0 0 1 170 15" class="f-accent" stroke-width="3"/><line x1="60" y1="125" x2="170" y2="125" class="f-line" stroke-dasharray="4 3"/><line x1="170" y1="125" x2="170" y2="15" class="f-line" stroke-dasharray="4 3"/>${T(178, 12, "pôle", 'font-size="11"')}${T(45, 138, "équateur", 'font-size="11"')}${T(220, 70, "10'000 km", 'font-size="13"')}`, "quart de méridien"),
ex: () => { const a = ri(1, 9), b = ri(1, 9), v = a * 1000 + b * 100;
return { q: `Une étape de triangulation mesure ${a},${b} km. Combien cela fait-il de mètres ?`, value: v, sol: `\\(1\\) km \\(= 1\\,000\\) m : \\(${a}{,}${b} \\cdot 1\\,000 = ${tm(v)}\\) m.` }; } },
{ t: "Portrait", titre: "Omar Khayyam, poète et calendrier", lien: "Calcul",
txt: "Le Persan Omar Khayyam (XI<sup>e</sup>–XII<sup>e</sup> siècle) est célèbre pour ses poèmes, mais il était aussi mathématicien et astronome. Il résout des équations du troisième degré à l'aide de figures et participe, vers 1079, à la réforme du calendrier persan, plus précis que le calendrier julien utilisé alors en Europe.",
fig: () => svg(300, 120, `<rect x="80" y="15" width="140" height="95" rx="8" class="f-shape2"/><rect x="80" y="15" width="140" height="22" rx="8" class="f-fill"/>${[...Array(4)].map((_, r) => [...Array(7)].map((_, c) => `<rect x="${88 + c * 18}" y="${44 + r * 16}" width="12" height="10" class="${(r * 7 + c) % 9 === 0 ? "f-fill2" : "f-soft"}"/>`).join("")).join("")}`, "calendrier"),
ex: () => { const n = ri(2, 5);
return { q: `Dans notre calendrier, sur 4 ans, 3 années ont 365 jours et une en a 366. Combien de jours en ${4 * n} ans ?`, value: 1461 * n, sol: `4 ans : \\(3 \\cdot 365 + 366 = 1\\,461\\) jours. Donc \\(${n} \\cdot 1\\,461 = ${tm(1461 * n)}\\) jours.` }; } },
{ t: "Anecdote", titre: "Le dernier théorème de Fermat", lien: "Puissances",
txt: "Vers 1637, Pierre de Fermat écrit dans la marge de son exemplaire de l'<i>Arithmétique</i> de Diophante qu'aucune puissance supérieure à 2 ne peut s'écrire comme somme de deux puissances semblables (par exemple, jamais a³ + b³ = c³ avec des entiers), et qu'il en a une démonstration merveilleuse que la marge est trop étroite pour contenir. Il a fallu attendre Andrew Wiles, en 1994, pour une démonstration complète.",
fig: () => svg(300, 120, `<rect x="70" y="15" width="160" height="95" rx="4" class="f-shape2"/><line x1="185" y1="15" x2="185" y2="110" class="f-line"/>${[0, 1, 2, 3, 4].map((i) => `<line x1="80" y1="${32 + i * 15}" x2="175" y2="${32 + i * 15}" class="f-grid"/>`).join("")}${T(207, 45, "xⁿ+yⁿ", 'font-size="10" class="f-accent f-txt"')}${T(207, 62, "≠ zⁿ", 'font-size="10" class="f-accent f-txt"')}`, "livre annoté dans la marge"),
ex: () => ({ q: "Presque ! Calcule \\(6^3 + 8^3\\) (à comparer avec \\(9^3 = 729\\)).", value: 728, sol: "\\(216 + 512 = 728\\) : il manque 1 pour faire \\(9^3\\). Fermat avait raison, ça ne tombe jamais juste." }) },
{ t: "Anecdote", titre: "Les grains de blé de l'échiquier", lien: "Puissances",
txt: "Selon une légende indienne, l'inventeur des échecs demanda comme récompense un grain de blé sur la première case de l'échiquier, 2 sur la deuxième, 4 sur la troisième, et ainsi de suite en doublant jusqu'à la 64<sup>e</sup> case. Le roi accepta en souriant… avant de découvrir que tout le blé du monde n'y suffirait pas.",
fig: () => svg(300, 130, `${[...Array(4)].map((_, r) => [...Array(4)].map((_, c) => `<rect x="${90 + c * 30}" y="${5 + r * 30}" width="30" height="30" class="${(r + c) % 2 ? "f-shape2" : "f-soft"}"/>`).join("")).join("")}${[1, 2, 4, 8].map((v, c) => T(105 + c * 30, 115, v, 'font-size="12"')).join("")}`, "échiquier et grains qui doublent"),
ex: () => { const n = ri(8, 16);
return { calc: true , q: `Combien de grains sur la ${n}<sup>e</sup> case ?`, value: 2 ** (n - 1), sol: `Case \\(n\\) : \\(2^{n-1}\\) grains. \\(2^{${n - 1}} = ${tm(2 ** (n - 1))}\\).` }; } },
{ t: "Anecdote", titre: "Les quipus des Incas", lien: "Numération",
txt: "L'Empire inca n'utilisait pas d'écriture, mais ses fonctionnaires tenaient des comptes très précis avec des quipus : des cordelettes à nœuds. Sur chaque cordelette, les nœuds sont groupés par position, comme nos chiffres : un groupe pour les centaines, un pour les dizaines, un pour les unités. C'est une numération en base 10.",
fig: () => svg(300, 130, `<line x1="30" y1="15" x2="270" y2="15" class="f-line" stroke-width="3"/>${[60, 120, 180, 240].map((x, i) => `<line x1="${x}" y1="15" x2="${x}" y2="120" class="f-blue" stroke-width="2"/>${[...Array([3, 2, 4, 1][i])].map((_, k) => `<circle cx="${x}" cy="${35 + k * 9}" r="4" class="f-head"/>`).join("")}${[...Array([1, 5, 0, 3][i])].map((_, k) => `<circle cx="${x}" cy="${80 + k * 8}" r="4" class="f-dot"/>`).join("")}`).join("")}`, "quipu à cordelettes et nœuds"),
ex: () => {
const nb = (k) => (k ? k + " nœud" + (k > 1 ? "s" : "") : "aucun nœud"), A = [ri(1, 6), ri(0, 9), ri(5, 9)], Bc = [ri(1, 3), ri(3, 9), ri(10 - A[2], 9)];
const va = 100 * A[0] + 10 * A[1] + A[2], vb = 100 * Bc[0] + 10 * Bc[1] + Bc[2];
return { q: `Un fonctionnaire inca note les lamas de deux villages. Cordelette du village A : ${nb(A[0])} aux centaines, ${nb(A[1])} aux dizaines, ${nb(A[2])} aux unités. Cordelette du village B : ${nb(Bc[0])} aux centaines, ${nb(Bc[1])} aux dizaines, ${nb(Bc[2])} aux unités. Combien de lamas en tout ?`, value: va + vb, sol: `Village A : \\(${va}\\) ; village B : \\(${vb}\\). Total : \\(${va} + ${vb} = ${va + vb}\\). Une cordelette de résumé porterait ce total.` }; } },

{ t: "Anecdote", titre: "Zénon : Achille ne rattrape jamais la tortue ?", lien: "Fractions et vitesses",
txt: "Vers 450 av. J.-C., le Grec Zénon d'Élée raconte : Achille court dix fois plus vite qu'une tortue partie avant lui. Quand il arrive là où était la tortue, elle a un peu avancé ; quand il y arrive, elle a encore avancé… Il ne la rattraperait donc jamais ? Le paradoxe a intrigué les penseurs pendant des siècles. La réponse : une somme d'une infinité de morceaux de plus en plus petits peut rester finie.",
fig: () => svg(300, 110, `<line x1="20" y1="70" x2="280" y2="70" class="f-line"/>${[0, 1, 2, 3].map((k) => { const x = 30 + 240 * (1 - Math.pow(0.5, k)); return `<line x1="${x}" y1="62" x2="${x}" y2="78" class="f-line"/>`; }).join("")}<rect x="30" y="40" width="120" height="14" class="f-fill2"/><rect x="150" y="40" width="60" height="14" class="f-shape"/><rect x="210" y="40" width="30" height="14" class="f-fill2"/><rect x="240" y="40" width="15" height="14" class="f-shape"/>${T(90, 96, "1/2")}${T(180, 96, "1/4")}${T(225, 96, "1/8")}${T(262, 30, "…")}`, "une longueur découpée en moitiés successives"),
ex: () => { const n = pk([3, 4, 5]), v = 1 - Math.pow(0.5, n);
return { q: `On parcourt la moitié d'un chemin de 1 km, puis la moitié de ce qui reste, et ainsi de suite. Distance parcourue (en km) après ${n} étapes ?`, value: v, sol: `\\(${[...Array(n)].map((_, k) => "\\frac{1}{" + 2 ** (k + 1) + "}").join(" + ")} = ${dec(v, 4)}\\) km : il reste \\(\\frac{1}{${2 ** n}}\\) km.` }; } },
{ t: "Anecdote", titre: "Le carré magique de Dürer (1514)", lien: "Calcul et équations",
txt: "Dans sa gravure <i>Melencolia I</i>, l'artiste allemand Albrecht Dürer a placé un carré magique de 4 cases sur 4 : chaque ligne, chaque colonne et chaque diagonale a la même somme, 34. Les deux cases du milieu de la dernière ligne indiquent l'année de la gravure : 15 et 14.",
fig: () => { const M = [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]];
return svg(300, 160, M.map((row, i) => row.map((v, j) => `<rect x="${86 + j * 32}" y="${12 + i * 34}" width="32" height="34" class="${i === 3 && (j === 1 || j === 2) ? "f-fill2" : "f-soft"}"/>${T(102 + j * 32, 34 + i * 34, v)}`).join("")).join(""), "le carré magique de Dürer"); },
ex: () => { const [r, c] = pk([[0, 1], [1, 2], [2, 0], [3, 0], [1, 0], [2, 3]]), M = [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]];
return { q: `Dans le carré de Dürer, chaque ligne a pour somme 34. La ligne ${r + 1} contient ${M[r].map((v, j) => (j === c ? "?" : v)).join(", ")}. Que vaut la case manquante ?`, value: M[r][c], sol: `\\(34 - (${M[r].filter((_, j) => j !== c).join(" + ")}) = ${M[r][c]}\\).` }; } },
{ t: "Événement", titre: "Galilée et la chute des corps", lien: "Fonctions du second degré",
txt: "Vers 1600, Galilée montre qu'un objet qui tombe (sans frottement de l'air) parcourt une distance proportionnelle au carré du temps de chute : deux fois plus de temps, quatre fois plus de distance. Il l'a mesuré avec des billes sur des plans inclinés. L'expérience du haut de la tour de Pise est sans doute une légende. Aujourd'hui on écrit \\(d = 4{,}9\\,t^2\\) (d en m, t en s).",
fig: () => svg(300, 140, `<line x1="60" y1="10" x2="60" y2="130" class="f-line"/>${[0, 1, 2, 3].map((t) => `<circle cx="60" cy="${14 + 12 * t * t}" r="6" class="f-dot"/><line x1="70" y1="${14 + 12 * t * t}" x2="90" y2="${14 + 12 * t * t + [-4, 6, 0, 0][t]}" class="f-line"/><text x="96" y="${18 + 12 * t * t + [-4, 6, 0, 0][t]}" class="f-txt" font-size="12">t = ${t} s : ${String(+(4.9 * t * t).toFixed(1)).replace(".", ",")} m</text>`).join("")}`, "une bille qui tombe, positions à 0, 1, 2 et 3 secondes"),
ex: () => { const t = pk([2, 3, 4, 5]);
return { q: `Avec \\(d = 4{,}9\\,t^2\\), quelle distance (en m) un objet parcourt-il en ${t} secondes de chute ?`, value: r2(4.9 * t * t, 1), sol: `\\(4{,}9 \\cdot ${t}^2 = 4{,}9 \\cdot ${t * t} = ${dec(4.9 * t * t, 1)}\\) m.` }; } },
{ t: "Événement", titre: "Kepler et la musique des planètes", lien: "Puissances et racines",
txt: "En 1619, Johannes Kepler publie sa troisième loi : pour toutes les planètes, le carré de la durée de révolution autour du Soleil, divisé par le cube de la distance moyenne au Soleil, donne le même nombre. Avec les années et l'unité astronomique (UA, distance Terre–Soleil), on obtient simplement \\(T^2 = a^3\\).",
fig: () => svg(300, 150, `<circle cx="150" cy="75" r="12" class="f-fill"/>${[30, 50, 72].map((r) => `<ellipse cx="150" cy="75" rx="${r * 1.6}" ry="${r}" class="f-line" fill="none"/>`).join("")}<circle cx="198" cy="75" r="5" class="f-dot"/><circle cx="150" cy="25" r="4" class="f-dot"/><circle cx="35" cy="75" r="6" class="f-dot"/>`, "orbites de planètes autour du Soleil"),
ex: () => { const a = pk([4, 9, 16]);
return { q: `Une planète (imaginaire) tourne à \\(a = ${a}\\) UA du Soleil. Avec \\(T^2 = a^3\\), quelle est sa durée de révolution \\(T\\) (en années) ?`, value: Math.pow(a, 1.5), sol: `\\(T^2 = ${a}^3 = ${a ** 3}\\), donc \\(T = \\sqrt{${a ** 3}} = ${Math.pow(a, 1.5)}\\) ans.` }; } },
{ t: "Portrait", titre: "Marie Curie et la radioactivité", lien: "Pourcentages et puissances",
txt: "Marie Skłodowska-Curie découvre avec Pierre Curie le polonium et le radium. Elle est la seule personne à avoir reçu deux prix Nobel dans deux sciences différentes : physique (1903) et chimie (1911). La quantité d'un élément radioactif diminue de moitié pendant une durée fixe, sa « demi-vie » : environ 1\\,600 ans pour le radium, 5\\,730 ans pour le carbone 14.",
fig: () => svg(300, 130, `<line x1="30" y1="110" x2="280" y2="110" class="f-line"/><line x1="30" y1="110" x2="30" y2="10" class="f-line"/><polyline points="${[...Array(26)].map((_, k) => (30 + k * 10) + "," + (110 - 90 * Math.pow(0.5, k / 6))).join(" ")}" class="f-blue" fill="none" stroke-width="2"/>${[0, 1, 2, 3].map((k) => `<circle cx="${30 + 60 * k}" cy="${110 - 90 * Math.pow(0.5, k)}" r="4" class="f-dot"/>`).join("")}${T(90, 125, "1 demi-vie", 'font-size="11"')}${T(150, 125, "2", 'font-size="11"')}${T(210, 125, "3", 'font-size="11"')}`, "décroissance radioactive : la quantité est divisée par deux à chaque demi-vie"),
ex: () => { const n = pk([2, 3, 4]), m = pk([32, 48, 64, 80]);
return { q: `Un échantillon contient ${m} mg de radium. Combien en reste-t-il (en mg) après ${n} demi-vies ?`, value: m / 2 ** n, sol: `On divise ${n} fois par 2 : \\(${m} \\div ${2 ** n} = ${dec(m / 2 ** n, 1)}\\) mg.` }; } },
{ t: "Événement", titre: "John Snow et la pompe de Broad Street", lien: "Statistiques et proportions",
txt: "Londres, 1854 : une épidémie de choléra tue plus de 500 personnes en dix jours. Le médecin John Snow note sur un plan les maisons des victimes : elles se regroupent autour d'une pompe à eau de Broad Street. On démonte la poignée de la pompe. Snow compare ensuite les décès selon la compagnie qui fournissait l'eau : c'est l'un des débuts de l'épidémiologie.",
fig: () => svg(300, 140, `<rect x="20" y="10" width="260" height="120" class="f-soft"/><line x1="20" y1="70" x2="280" y2="70" class="f-line" stroke-width="6"/><line x1="150" y1="10" x2="150" y2="130" class="f-line" stroke-width="6"/>${[[130, 55], [140, 85], [165, 50], [170, 90], [125, 80], [160, 60], [175, 78], [135, 45], [185, 62], [115, 62], [145, 100], [190, 95]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" class="f-dot"/>`).join("")}<rect x="146" y="66" width="8" height="8" class="f-fill"/><line x1="157" y1="77" x2="196" y2="110" class="f-line" stroke-width="1"/>${T(212, 122, "pompe", 'font-size="12"')}`, "plan : décès regroupés autour d'une pompe"),
ex: () => { const N = pk([520, 560, 600]), p = pk([60, 70, 75, 80, 85]);
return { q: `Sur ${N} victimes de cette épidémie, ${p} % habitaient à moins de 250 m de la pompe. Combien de victimes cela représente-t-il ?`, value: N * p / 100, sol: `\\(${N} \\cdot ${dec(p / 100)} = ${N * p / 100}\\) victimes.` }; } },


{ t: "Portrait", titre: "Évariste Galois, une vie de 20 ans", lien: "Équations du 2e degré", ids: ["eq2disc", "eq2"], need: ["eq2disc"],
txt: "Évariste Galois naît en 1811 à Bourg-la-Reine, près de Paris. Passionné de mathématiques, il échoue deux fois au concours de l'École polytechnique, en 1828 et en 1829. Il envoie ses travaux à l'Académie des sciences : un premier mémoire n'aboutit pas, un deuxième est perdu à la mort de Joseph Fourier, qui devait le lire, et un troisième est refusé en 1831 parce qu'on le juge trop peu clair. Le 30 mai 1832, il se bat en duel ; il meurt le lendemain, à 20 ans. La nuit d'avant, il écrit une longue lettre à son ami Auguste Chevalier pour résumer ses découvertes. En marge d'un manuscrit relu cette nuit-là, on lit : « je n'ai pas le temps ». La légende en a rajouté : ses idées dataient de plusieurs années. Sa question : une équation se résout-elle « avec une formule », comme celle du 2e degré avec la racine du discriminant ? Il existe des formules pour les degrés 3 et 4, mais aucune formule générale à partir du degré 5 (le Norvégien Niels Abel l'avait montré peu avant). Galois explique pourquoi, et comment savoir, équation par équation, si une telle formule existe. Ses travaux ne sont publiés qu'en 1846, par Joseph Liouville.",
fig: () => svg(300, 140, [["degré 2", "x = (−b ± √Δ) / 2a", "f-fill2"], ["degrés 3 et 4", "formules (XVIᵉ siècle)", "f-fill2"], ["degré 5", "pas de formule générale", "f-soft"]].map(([a, b, c], i) => `<rect x="10" y="${10 + i * 42}" width="280" height="34" rx="8" class="${c}"/>${T(60, 32 + i * 42, a, 'font-size="12"')}${T(190, 32 + i * 42, b, 'font-size="12"')}`).join(""), "formules de résolution selon le degré"),
ex: () => { let r1, r2; do { r1 = ri(-9, -2); r2 = ri(2, 9); } while (r1 + r2 === 0);
const b = -(r1 + r2), c = r1 * r2, D = b * b - 4 * c, s = r2 - r1, p = (v) => (v < 0 ? "(" + v + ")" : v);
const bx = (b > 0 ? " + " : " - ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x", cc = (c > 0 ? " + " : " - ") + Math.abs(c);
return { q: `Résous avec le discriminant : \\(x^2${bx}${cc} = 0\\). Quelle est la plus grande solution ?`, value: r2,
sol: `\\(\\Delta = ${p(b)}^2 - 4 \\cdot 1 \\cdot ${p(c)} = ${D} = ${s}^2\\), donc \\(x = \\dfrac{${-b} \\pm ${s}}{2}\\) : \\(x_1 = ${r1}\\) et \\(x_2 = ${r2}\\). La plus grande est \\(${r2}\\).` }; } },
{ t: "Portrait", titre: "Hypatie d'Alexandrie", lien: "Mettre un problème en équation", ids: ["eq1", "probeq", "sys2"], need: ["eq1", "probeq"],
txt: "Hypatie vit à Alexandrie, en Égypte, vers l'an 400. Fille du mathématicien Théon, elle enseigne les mathématiques, l'astronomie et la philosophie ; des élèves viennent de loin pour l'écouter. Aucun de ses écrits ne nous est parvenu. Selon une encyclopédie byzantine, la Souda, elle a commenté l'<i>Arithmétique</i> de Diophante et les <i>Coniques</i> d'Apollonius. En 415, elle est tuée par une foule, pendant de violents conflits politiques et religieux dans la ville. C'est la plus ancienne mathématicienne dont la vie nous soit assez bien connue.",
fig: () => svg(300, 110, `<rect x="30" y="30" width="168" height="30" class="f-fill2"/><rect x="198" y="30" width="72" height="30" class="f-shape"/>${T(114, 50, "grande partie")}${T(234, 50, "petite", 'font-size="12"')}<path d="M30 72 L270 72" class="f-line"/>${T(150, 92, "somme connue, différence connue", 'font-size="12"')}`, "un nombre partagé en deux parties"),
ex: () => { const b = ri(12, 40), d = ri(6, 30), a = b + d, S = a + b;
return { q: `Le premier problème de l'<i>Arithmétique</i> de Diophante, qu'Hypatie a commentée : partager un nombre en deux parties dont on connaît la différence. Partage ${S} en deux parties dont la différence vaut ${d}. Quelle est la plus grande partie ?`, value: a,
sol: `Si la petite partie vaut \\(x\\), la grande vaut \\(x + ${d}\\) : \\(2x + ${d} = ${S}\\), donc \\(x = ${b}\\) et la grande partie vaut \\(${a}\\). Diophante, lui, partageait 100 avec une différence de 40 : 70 et 30.` }; } },
{ t: "Événement", titre: "Les Neuf Chapitres et les baguettes à calculer", lien: "Systèmes d'équations", ids: ["sys2"], need: ["sys2"],
txt: "En Chine, <i>Les Neuf Chapitres sur l'art du calcul</i> rassemblent, il y a environ 2000 ans, 246 problèmes : partages, surfaces, impôts, systèmes d'équations… En 263, le savant Liu Hui en écrit un commentaire célèbre. Pour résoudre un système, on dispose des baguettes à calculer en tableau sur une planche, puis on combine les colonnes : une méthode très proche de celle qu'on enseigne aujourd'hui. Des baguettes rouges et noires distinguent les nombres positifs et les nombres négatifs.",
fig: () => svg(300, 120, `<rect x="40" y="10" width="220" height="100" rx="8" class="f-shape2"/>${[[70, 5], [110, 2], [190, 2], [230, 5]].map(([x, n]) => [...Array(n)].map((_, j) => `<rect x="${x - 12 + j * 6}" y="22" width="3" height="26" class="f-head"/>`).join("")).join("")}${[90, 210].map((x) => `<line x1="${x - 18}" y1="70" x2="${x + 18}" y2="70" class="f-accent" stroke-width="3"/><line x1="${x - 18}" y1="80" x2="${x + 18}" y2="80" class="f-accent" stroke-width="3"/>`).join("")}`, "baguettes à calculer disposées en colonnes"),
ex: () => { const c = ri(4, 9), m = ri(2, c - 1), A = 5 * c + 2 * m, B = 2 * c + 5 * m;
return { q: `À la manière des <i>Neuf Chapitres</i> : 5 buffles et 2 moutons valent ${A} pièces ; 2 buffles et 5 moutons valent ${B} pièces. Combien vaut un buffle, en pièces ?`, value: c,
sol: `En additionnant : 7 buffles et 7 moutons valent \\(${A + B}\\), donc un buffle et un mouton valent \\(${A + B} \\div 7 = ${c + m}\\). En soustrayant : 3 buffles valent 3 moutons plus \\(${A - B}\\), donc un buffle vaut un mouton plus \\(${A - B} \\div 3 = ${c - m}\\). Un buffle : \\((${c + m} + ${c - m}) \\div 2 = ${c}\\) pièces.` }; } },
{ t: "Portrait", titre: "Émilie du Châtelet, traductrice de Newton", lien: "Puissances (le carré)", ids: ["puiss"],
txt: "Émilie du Châtelet (1706–1749) est une savante française. Elle traduit en français et commente le grand livre d'Isaac Newton, les <i>Principia</i> ; sa traduction, publiée après sa mort, est encore aujourd'hui la traduction française de référence. Elle défend aussi une idée alors très discutée : l'énergie d'un objet en mouvement est proportionnelle au carré de sa vitesse. Elle s'appuie sur une expérience du Néerlandais Willem 's Gravesande : des billes lâchées dans de l'argile molle s'enfoncent 4 fois plus profond quand leur vitesse double.",
fig: () => svg(300, 120, `<rect x="20" y="80" width="260" height="30" class="f-soft"/><circle cx="90" cy="70" r="10" class="f-head"/><path d="M78 80 Q90 92 102 80" class="f-line"/><circle cx="210" cy="82" r="10" class="f-head"/><path d="M198 80 L198 96 Q210 108 222 96 L222 80" class="f-line"/>${T(90, 30, "vitesse v")}${T(210, 30, "vitesse 2v")}${T(210, 50, "4 fois plus profond", 'font-size="11"')}`, "deux billes enfoncées dans l'argile"),
ex: () => { const d = ri(2, 6), k = ri(3, 5);
return { q: `Une bille s'enfonce de ${d} mm dans l'argile. Lâchée avec une vitesse ${k} fois plus grande, de combien de millimètres s'enfonce-t-elle ?`, value: d * k * k,
sol: `La profondeur est proportionnelle au carré de la vitesse : \\(${k}^2 = ${k * k}\\) fois plus, soit \\(${d} \\cdot ${k * k} = ${d * k * k}\\) mm.` }; } },
{ t: "Événement", titre: "L'os d'Ishango, il y a 20'000 ans", lien: "Nombres premiers", ids: ["arith"],
txt: "En 1950, le géologue belge Jean de Heinzelin découvre à Ishango, au bord du lac Édouard (aujourd'hui en République démocratique du Congo), un os de babouin couvert d'entailles. Il a environ 20'000 ans. Les entailles sont groupées en trois rangées. Sur l'une d'elles, les groupes comptent 11, 13, 17 et 19 entailles : exactement les nombres premiers entre 10 et 20 ! Hasard ou calcul ? Les spécialistes ne sont pas d'accord, mais c'est l'un des plus anciens objets de comptage connus.",
fig: () => svg(300, 110, `<path d="M20 50 Q30 30 50 40 L250 40 Q270 30 280 50 Q270 70 250 60 L50 60 Q30 70 20 50 Z" class="f-shape2"/>${[11, 13, 17, 19].map((n, g) => [...Array(n)].map((_, j) => `<line x1="${58 + g * 50 + j * 2.4}" y1="42" x2="${58 + g * 50 + j * 2.4}" y2="58" class="f-line" stroke-width="1"/>`).join("")).join("")}${T(150, 92, "11 · 13 · 17 · 19", 'font-size="13"')}`, "os gravé de groupes d'entailles"),
ex: () => { const [a, b, L] = pk([[10, 20, [11, 13, 17, 19]], [20, 40, [23, 29, 31, 37]], [30, 50, [31, 37, 41, 43, 47]], [40, 60, [41, 43, 47, 53, 59]]]), v = L.reduce((x, y) => x + y, 0);
return { q: `Et si l'os portait tous les nombres premiers compris entre ${a} et ${b} ? Combien d'entailles cela ferait-il en tout ?`, value: v,
sol: `Les nombres premiers entre ${a} et ${b} : ${L.join(", ")}. Total : \\(${L.join(" + ")} = ${v}\\).` }; } },
{ t: "Anecdote", titre: "Al-Kashi et les 16 décimales de π", lien: "Puissances et cercle", ids: ["puiss", "disque"],
txt: "En 1424, à Samarcande (dans l'actuel Ouzbékistan), l'astronome persan Jamshid al-Kashi calcule π avec 16 décimales justes. Ce record tiendra environ 170 ans. Sa méthode prolonge celle d'Archimède : il utilise un polygone régulier de 3 · 2<sup>28</sup> côtés, soit plus de 800 millions de côtés, si proche du cercle qu'on ne pourrait pas les distinguer.",
fig: () => { const pg = (n, r) => [...Array(n)].map((_, k) => f1(150 + r * Math.cos((2 * k * Math.PI) / n)) + "," + f1(62 + r * Math.sin((2 * k * Math.PI) / n))).join(" ");
return svg(300, 125, `<circle cx="150" cy="62" r="52" class="f-line"/><polygon points="${pg(6, 52)}" class="f-soft"/><polygon points="${pg(12, 52)}" class="f-fill2"/>${T(150, 122, "6 → 12 → 24 → … côtés", 'font-size="12"')}`, "polygones à 6 et 12 côtés inscrits dans un cercle"); },
ex: () => { const n = ri(5, 10);
return { calc: true , q: `On part d'un triangle (3 côtés) et on double ${n} fois le nombre de côtés. Combien de côtés a le polygone obtenu ?`, value: 3 * 2 ** n,
sol: `Doubler ${n} fois, c'est multiplier par \\(2^{${n}} = ${tm(2 ** n)}\\) : \\(3 \\cdot 2^{${n}} = ${tm(3 * 2 ** n)}\\) côtés. Al-Kashi est allé jusqu'à \\(3 \\cdot 2^{28}\\).` }; } },
{ t: "Événement", titre: "La carte Dufour, la Suisse en relief", lien: "Échelles", ids: ["echelle"], sys: "CH",
txt: "Le Genevois Guillaume-Henri Dufour, ingénieur et général, dirige la réalisation de la première carte précise de toute la Suisse. Elle paraît de 1845 à 1864, en 25 feuilles, à l'échelle 1:100'000. Les géomètres mesurent le pays par triangulation : un réseau de triangles dont on mesure les angles. Pour le relief, la carte utilise des hachures et un ombrage qui donnent l'impression de voir les montagnes en trois dimensions. Le plus haut sommet de Suisse, la pointe Dufour (4'634 m), porte son nom.",
fig: () => svg(300, 120, `<rect x="20" y="10" width="260" height="100" rx="6" class="f-shape2"/><path d="M40 95 L95 35 L130 70 L175 25 L240 95 Z" class="f-soft"/><polyline points="60,90 120,60 200,80 250,40" class="f-blue" stroke-width="1.6" fill="none"/>${[[60, 90], [120, 60], [200, 80], [250, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" class="f-dot"/>`).join("")}${T(225, 104, "1:100'000", 'font-size="11"')}`, "carte avec relief et points de triangulation"),
ex: () => { const d = ri(12, 80);
return { q: `Sur la carte Dufour (1:100'000), deux villages sont à ${d} mm l'un de l'autre. Quelle est la distance réelle, à vol d'oiseau, en mètres ?`, value: 100 * d,
sol: `1 mm sur la carte = \\(100\\text{'}000\\) mm = 100 m en réalité. \\(${d} \\cdot 100 = ${tm(100 * d)}\\) m.` }; } },
{ t: "Événement", titre: "La carte de Cassini, la France mesurée", lien: "Échelles", ids: ["echelle"], sys: "FR",
txt: "Au XVIII<sup>e</sup> siècle, quatre générations de la famille Cassini travaillent à la carte de France. En 1747, César-François Cassini de Thury lance la première carte détaillée de tout le royaume, à l'échelle 1:86 400. Elle repose sur une triangulation : un immense réseau de triangles dont on mesure les angles depuis les clochers et les collines. Son fils, Jean-Dominique Cassini, poursuit le travail ; les dernières feuilles paraissent en 1815.",
fig: () => svg(300, 120, `<rect x="20" y="10" width="260" height="100" rx="6" class="f-shape2"/><path d="M60 90 L110 30 L170 80 L230 25 L250 95 Z M110 30 L250 95 M60 90 L170 80 L230 25" class="f-blue" stroke-width="1.4" fill="none"/>${[[60, 90], [110, 30], [170, 80], [230, 25], [250, 95]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" class="f-dot"/>`).join("")}${T(80, 104, "1:86 400", 'font-size="11"')}`, "réseau de triangles sur une carte"),
ex: () => { const d = ri(3, 12), v = 864 * d;
return { q: `Sur la carte de Cassini (1:86 400), deux clochers sont à ${d} cm l'un de l'autre. Quelle est la distance réelle, en mètres ?`, value: v,
sol: `1 cm sur la carte = \\(86\\,400\\) cm = 864 m en réalité. \\(${d} \\times 864 = ${mil(v).replace(/'/g, "\\,")}\\) m.` }; } },
{ t: "Anecdote", titre: "Le lotus de Bhāskara", lien: "Théorème de Pythagore", ids: ["pyth", "eq1"], need: ["pyth"],
txt: "En 1150, le mathématicien indien Bhāskara II écrit la <i>Līlāvatī</i>, un livre de problèmes en vers. Selon la tradition, il porterait le nom de sa fille. L'un de ses problèmes : une fleur de lotus dépasse d'une demi-coudée la surface d'un lac. Poussée par le vent, la tige se couche et la fleur touche l'eau à deux coudées de là. Quelle est la profondeur du lac ? La tige, le fond et la surface forment un triangle rectangle.",
fig: () => svg(300, 140, `<rect x="20" y="40" width="260" height="90" class="f-soft"/><line x1="100" y1="130" x2="100" y2="22" class="f-line" stroke-width="2"/><circle cx="100" cy="18" r="6" class="f-dot"/><line x1="100" y1="130" x2="220" y2="40" class="f-accent" stroke-width="2" stroke-dasharray="4 3"/><circle cx="220" cy="40" r="6" class="f-dot"/><line x1="100" y1="40" x2="220" y2="40" class="f-blue" stroke-width="2"/>${T(160, 34, "s", 'font-size="12"')}${T(86, 32, "h", 'font-size="12"')}${T(86, 90, "d", 'font-size="12"')}`, "lotus, tige couchée et profondeur du lac"),
ex: () => { const [h, s] = pk([[1, 3], [1, 5], [2, 4], [2, 6], [1, 7], [3, 9]]), d = (s * s - h * h) / (2 * h);
return { q: `Une fleur de lotus dépasse de ${h} dm la surface de l'eau. Couchée par le vent, elle touche l'eau à ${s} dm de l'endroit où sa tige sortait. Quelle est la profondeur du lac, en dm ?`, value: d,
sol: `La tige mesure \\(d + ${h}\\). Pythagore : \\((d + ${h})^2 = d^2 + ${s}^2\\), donc \\(${2 * h}d + ${h * h} = ${s * s}\\) et \\(d = ${s * s - h * h} \\div ${2 * h} = ${d}\\) dm.` }; } },
{ t: "Anecdote", titre: "Héron et la racine de 720", lien: "Racines carrées", ids: ["rac"], need: ["rac"],
txt: "Héron d'Alexandrie (I<sup>er</sup> siècle) explique dans ses <i>Métriques</i> comment calculer une racine carrée à la main. Pour la racine de 720, il part de 27, car 27² = 729 est proche de 720. Il divise 720 par 27, puis il fait la moyenne de 27 et du quotient. Il trouve 26 + 5/6, soit environ 26,83 ; la vraie valeur est 26,8328… Et l'on peut recommencer avec ce nouveau nombre pour être encore plus précis.",
fig: () => svg(300, 110, `<rect x="40" y="20" width="80" height="70" class="f-fill2"/><rect x="170" y="27" width="70" height="63" class="f-shape"/>${T(80, 60, "27 × 26,7")}${T(205, 63, "carré ?", 'font-size="12"')}<path d="M126 55 l36 0" class="f-line"/><path d="M158 49 l8 6 l-8 6 z" class="f-head"/>${T(150, 106, "même aire : 720", 'font-size="12"')}`, "rectangle transformé en carré de même aire"),
ex: () => { const [n, a] = pk([[20, 5], [30, 6], [42, 7], [56, 8], [72, 9], [90, 10]]), v = (a + n / a) / 2;
return { q: `Fais comme Héron pour \\(\\sqrt{${n}}\\) : pars de ${a}, divise ${n} par ${a}, puis fais la moyenne de ${a} et du quotient. Quel nombre trouves-tu ?`, value: v,
sol: `\\(${n} \\div ${a} = ${n / a}\\), puis \\((${a} + ${n / a}) \\div 2 = ${dec(v)}\\). Vérification : \\(${dec(v)}^2 = ${dec(v * v)}\\), tout près de ${n}.` }; } },
{ t: "Anecdote", titre: "Jacques Bernoulli et le nombre e", lien: "Exponentielles", ids: ["expo", "pct"], need: ["expo", "croissance", "modexp", "expfn", "lnexp", "croissexp", "explogfn"],
txt: "En 1683, Jacques Bernoulli se pose une question d'argent. Un capital placé à 100 % d'intérêt par an double en un an. Et si l'on versait les intérêts deux fois par an (50 % chaque fois), ou chaque mois, ou chaque jour ? Le capital grandit un peu plus à chaque fois, mais il ne dépasse jamais 2,718… fois le capital de départ. Euler appellera plus tard ce nombre e : c'est la base de la fonction exponentielle.",
fig: () => svg(300, 120, `${[[1, 2], [2, 2.25], [4, 2.441], [12, 2.613], [365, 2.715]].map(([n, v], i) => `<rect x="${25 + i * 52}" y="${100 - (v - 1.6) * 70}" width="40" height="${(v - 1.6) * 70}" class="f-fill2"/>${T(45 + i * 52, 114, n, 'font-size="11"')}${T(45 + i * 52, 92 - (v - 1.6) * 70, String(v).replace(".", ","), 'font-size="10"')}`).join("")}<line x1="20" y1="${100 - (Math.E - 1.6) * 70}" x2="285" y2="${100 - (Math.E - 1.6) * 70}" class="f-accent" stroke-dasharray="4 3"/>`, "capital après un an selon le nombre de versements"),
ex: () => { const [n, C] = pk([[2, 1000], [2, 4000], [4, 2560], [5, 1000], [5, 5000]]), v = r2(C * (1 + 1 / n) ** n, 6);
return { q: `On place ${mil(C)} CHF à 100 % par an, avec ${n} versements d'intérêts de ${100 / n} % chacun (chaque versement compte dans le suivant). Quel est le capital au bout d'un an, en CHF ?`, value: v,
sol: `\\(${tm(C)} \\cdot ${dec(1 + 1 / n)}^{${n}} = ${tm(C)} \\cdot ${dec((1 + 1 / n) ** n, 5)} = ${dm(v)}\\) CHF : plus que le double, mais moins de \\(${tm(C)} \\cdot e \\approx ${dm(C * Math.E, 0)}\\) CHF.` }; } },
{ t: "Événement", titre: "Al-Bīrūnī mesure la Terre depuis une montagne", lien: "Pythagore et trigonométrie", ids: ["pyth", "trigo"], need: ["pyth"],
txt: "Vers 1020, le savant persan al-Bīrūnī mesure la Terre depuis une montagne, au nord-ouest de l'Inde (dans l'actuel Pakistan). Il mesure d'abord la hauteur de la montagne. Puis, depuis le sommet, il mesure le très petit angle entre l'horizontale et la ligne de l'horizon. Avec la trigonométrie, il en déduit le rayon de la Terre, à moins de 1 % de la valeur actuelle (6'371 km).",
fig: () => svg(300, 140, `<path d="M20 140 A170 170 0 0 1 280 140" class="f-shape2"/><polygon points="120,58 135,30 150,58" class="f-shape"/><line x1="135" y1="30" x2="240" y2="70" class="f-accent" stroke-dasharray="4 3"/><line x1="135" y1="30" x2="260" y2="30" class="f-line" stroke-dasharray="2 3"/><circle cx="240" cy="70" r="4" class="f-dot"/>${T(250, 90, "horizon", 'font-size="11"')}`, "ligne de visée de la montagne vers l'horizon"),
ex: () => { const h = pk([0.5, 1, 2, 3]), d = Math.sqrt((6371 + h) ** 2 - 6371 ** 2), v = Math.round(d);
return { q: `Depuis un sommet à ${String(h).replace(".", ",")} km d'altitude, à quelle distance se trouve l'horizon ? Le rayon de la Terre vaut 6'371 km et la ligne de visée touche la Terre à angle droit. Arrondis au km.`, value: v,
sol: `Triangle rectangle : hypoténuse \\(6\\text{'}371 + ${dec(h, 1)}\\), côté \\(6\\text{'}371\\). \\(d = \\sqrt{${dec(6371 + h, 1).replace(/^(\d)(\d{3})/, "$1\\text{'}$2")}^2 - 6\\text{'}371^2} \\approx ${v}\\) km.` }; } },
{ t: "Événement", titre: "Newton, Leibniz et la querelle de la dérivée", lien: "Dérivées", ids: ["derivregles", "nbderive", "derivref"], need: ["derivregles", "nbderive", "derivref"],
txt: "Vers 1665, le jeune Isaac Newton invente en Angleterre une méthode pour calculer des vitesses qui changent sans cesse : ce que nous appelons la dérivée. Il ne la publie pas. En Allemagne, Gottfried Wilhelm Leibniz trouve la même idée de son côté et la publie le premier, en 1684, avec la notation dx que l'on utilise encore. Une longue querelle éclate. En 1712, un rapport de la Royal Society de Londres donne raison à Newton… mais Newton, président de cette société, l'avait en grande partie rédigé lui-même. On admet aujourd'hui que les deux ont fait la découverte indépendamment.",
fig: () => svg(300, 130, `<line x1="30" y1="115" x2="280" y2="115" class="f-line"/><line x1="40" y1="125" x2="40" y2="10" class="f-line"/><path d="M40 112 Q140 110 260 20" class="f-blue" stroke-width="2" fill="none"/><line x1="110" y1="128" x2="250" y2="40" class="f-accent" stroke-width="1.6"/><circle cx="180" cy="84" r="4" class="f-dot"/>${T(205, 110, "pente = f'(x)", 'font-size="11"')}`, "courbe et sa tangente"),
ex: () => { let a, b, k, v; do { a = ri(2, 5); b = R.nz(-6, 6); k = ri(1, 4); v = 2 * a * k + b; } while (v === 0 || v === 1);
return { q: `Avec \\(f(x) = ${a}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x\\), calcule le nombre dérivé \\(f'(${k})\\).`, value: v,
sol: `\\(f'(x) = ${2 * a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\), donc \\(f'(${k}) = ${2 * a} \\cdot ${k} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${v}\\).` }; } },
{ t: "Portrait", titre: "Maria Gaetana Agnesi et la « sorcière »", lien: "Fonctions", ids: ["fimg"], need: ["fimg"],
txt: "En 1748, l'Italienne Maria Gaetana Agnesi publie à Milan les <i>Instituzioni analitiche</i>, un grand manuel d'algèbre et d'analyse écrit pour les étudiants. C'est l'un des premiers livres de mathématiques importants écrits par une femme. Elle y étudie une courbe en forme de cloche, qu'on appelle aujourd'hui la « courbe d'Agnesi ». En anglais, on la surnomme « witch of Agnesi » (la sorcière d'Agnesi), à cause d'une erreur de traduction : le mot italien <i>versiera</i> (« qui tourne ») a été confondu avec <i>avversiera</i> (« diablesse »).",
fig: () => svg(300, 120, `<line x1="20" y1="100" x2="280" y2="100" class="f-line"/><line x1="150" y1="110" x2="150" y2="10" class="f-line"/><polyline points="${[...Array(41)].map((_, i) => { const x = -4 + i * 0.2; return f1(150 + x * 30) + "," + f1(100 - 70 / (1 + x * x)); }).join(" ")}" class="f-blue" stroke-width="2" fill="none"/>${T(225, 60, "y = a³ / (x² + a²)", 'font-size="12"')}`, "courbe d'Agnesi en forme de cloche"),
ex: () => { const a = pk([4, 6, 8, 10]);
return { q: `La courbe d'Agnesi : \\(f(x) = \\dfrac{${a ** 3}}{x^2 + ${a * a}}\\) (ici \\(a = ${a}\\)). Calcule \\(f(${a})\\).`, value: a / 2,
sol: `\\(f(${a}) = \\dfrac{${a ** 3}}{${a * a} + ${a * a}} = \\dfrac{${a ** 3}}{${2 * a * a}} = ${a / 2}\\).` }; } },
];



const IDS = [["eq1", "probeq"], ["eq1", "eq2", "eq2disc"], ["fracadd", "fracmul"], ["rel"], ["prio", "valnum"], ["disque"],
["prop", "angles", "disque"], ["thales", "simil", "echelle"], ["valnum", "reduire", "distrib"], ["pyth"], ["arith"], ["vol", "volcone"],
["cart", "affine", "droites"], ["fimg", "affine"], [], ["prio"], ["puiss", "sci"], ["vitesse", "gquot"], ["arith"], ["puiss"],
["valnum", "prio"], ["eq1", "fracadd", "probeq"], ["puiss", "sci", "log", "expo"], ["proba"], ["polyreg", "simil"], ["puiss"],
["vitesse", "gquot"], ["disque", "fracadd"], ["fracmul", "prop"], ["pct", "diagr", "stats"], ["echelle", "sci"], ["prio", "eq3"],
["puiss"], ["puiss", "sci"], ["puiss"],
["fracadd", "vitesse"], ["eq1", "valnum"], ["valnum", "eq2"], ["puiss", "sci"], ["pct", "expo"], ["pct", "stats"]];
HISTOIRE.forEach((H, i) => (H.ids = H.ids || IDS[i] || []));




const PLUS = {
"Le signe « = » a été inventé en 1557": {
plus: () => { const x = ri(8, 20), P = 14 * x + 15, k = ri(3, 8), N = P + k * x;
return { intro: `Un étudiant lit <i>The Whetstone of Witte</i>. Le premier jour, il lit 15 pages de plus que d'habitude, puis chaque jour le même nombre \\(x\\) de pages. Au bout de 14 jours, il a lu ${P} pages (on compte le premier jour : \\(14x + 15 = ${P}\\)).`,
steps: [{ q: "Combien de pages lit-il un jour ordinaire ?", value: x, sol: `\\(14x = ${P} - 15 = ${P - 15}\\), donc \\(x = ${P - 15} \\div 14 = ${x}\\).` },
{ q: `Le livre a ${N} pages. Combien de jours ordinaires lui faut-il encore pour le finir ?`, value: k, sol: `Il reste \\(${N} - ${P} = ${N - P}\\) pages, soit \\(${N - P} \\div ${x} = ${k}\\) jours.` }] }; } },
"Al-Khwârizmî, qui a donné son nom à l'algorithme": {
plus: () => { const b = pk([4, 6, 8, 12, 14]), x = ri(2, 9), c = x * x + b * x, h = b / 2;
return { intro: `À la manière d'al-Khwârizmî, résous \\(x^2 + ${b}x = ${c}\\) (avec \\(x\\) positif) en complétant le carré : on colle quatre rectangles de largeur \\(${h} \\div 2\\)… ou, plus simplement, on ajoute le carré de \\(${b} \\div 2 = ${h}\\).`,
steps: [{ q: `Aire du grand carré complété : \\(${c} + ${h}^2\\) = ?`, value: c + h * h, sol: `\\(${c} + ${h * h} = ${c + h * h}\\).` },
{ q: "Côté du grand carré ?", value: x + h, sol: `\\(\\sqrt{${c + h * h}} = ${x + h}\\) ; c'est \\(x + ${h}\\).` },
{ q: "Que vaut \\(x\\) ?", value: x, sol: `\\(x = ${x + h} - ${h} = ${x}\\). Vérification : \\(${x * x} + ${b * x} = ${c}\\).` }] }; },
expert: () => { const b = pk([3, 5, 7, 9]), c = pk([11, 13, 17, 19, 23]), x = -b / 2 + Math.sqrt(b * b / 4 + c);
return { intro: `Al-Khwârizmî ne traitait que des cas « qui tombent juste ». Résous \\(x^2 + ${b}x = ${c}\\) (\\(x > 0\\)) avec sa méthode, puis vérifie par la formule du second degré.`,
steps: [{ q: `On complète le carré : \\((x + ${dec(b / 2, 1)})^2 = ${c} + ${dec(b / 2, 1)}^2\\). Que vaut le membre de droite ?`, value: c + b * b / 4, sol: `\\(${c} + ${dec(b * b / 4)} = ${dec(c + b * b / 4)}\\).` },
{ q: "Solution positive \\(x\\), au centième ?", value: x, round: 0.01, sol: `\\(x = -${dec(b / 2, 1)} + \\sqrt{${dec(c + b * b / 4)}} \\approx ${dec(x)}\\). (Formule : \\(\\Delta = ${b * b + 4 * c}\\), \\(x = \\frac{-${b} + \\sqrt{${b * b + 4 * c}}}{2}\\).)` }] }; } },
"Les fractions des scribes égyptiens": {
plus: () => { const [a, b, m, p] = pk([[4, 5, 4, 20], [7, 8, 3, 24], [9, 10, 3, 15], [11, 12, 3, 12], [13, 15, 3, 30]]);
return { intro: `Méthode des scribes (dite « gloutonne ») pour \\(\\dfrac{${a}}{${b}}\\) : on enlève la plus grande fraction de numérateur 1 possible, ici \\(\\dfrac{1}{2}\\), puis on recommence avec le reste.`,
steps: [{ q: `Reste : \\(\\dfrac{${a}}{${b}} - \\dfrac{1}{2}\\) = ? (fraction ou décimal)`, value: a / b - 1 / 2, sol: (() => { const g = (x, y) => (y ? g(y, x % y) : x), n = 2 * a - b, d = 2 * b, k = g(n, d); return `\\(\\dfrac{${a}}{${b}} - \\dfrac{1}{2} = \\dfrac{${n}}{${d}}${k > 1 ? " = \\dfrac{" + n / k + "}{" + d / k + "}" : ""}\\).`; })() },
{ q: "Plus grande fraction \\(\\dfrac{1}{m}\\) qui ne dépasse pas ce reste : \\(m\\) = ?", value: m, sol: `\\(\\dfrac{1}{${m}} \\approx ${dec(1 / m, 3)}\\) ne dépasse pas le reste \\(\\approx ${dec(a / b - 0.5, 3)}\\), mais \\(\\dfrac{1}{${m - 1}}\\) le dépasse.` },
{ q: "Ce qui reste encore est une fraction \\(\\dfrac{1}{p}\\). Que vaut \\(p\\) ?", value: p, sol: `\\(\\dfrac{${a}}{${b}} = \\dfrac{1}{2} + \\dfrac{1}{${m}} + \\dfrac{1}{${p}}\\).` }] }; } },
"Le zéro devient un nombre": {
plus: () => { const a = ri(25, 60), b = ri(6, a - 8), c = ri(4, 12);
return { intro: `Un marchand de Brahmagupta a une dette de ${a} pièces. Il gagne une fortune de ${b} pièces, puis contracte trois nouvelles dettes de ${c} pièces chacune.`,
steps: [{ q: "Sa situation après le gain (nombre relatif) ?", value: b - a, sol: `\\(-${a} + ${b} = ${b - a}\\) : encore une dette.` },
{ q: "Sa situation à la fin ?", value: b - a - 3 * c, sol: `\\(${b - a} + 3 \\cdot (-${c}) = ${b - a - 3 * c}\\).` },
{ q: "Combien doit-il gagner pour revenir exactement à zéro ?", value: a - b + 3 * c, sol: `\\(${b - a - 3 * c} + ${a - b + 3 * c} = 0\\).` }] }; } },
"Fibonacci et les chiffres « arabes »": {
plus: () => { const a = ri(2, 7), b = ri(3, 9), x = ri(3, 9), T = 3 * 2 + 5 * x;
return { intro: `Dans une suite « de Fibonacci », chaque terme est la somme des deux précédents. Celle-ci commence par ${a} et ${b}.`,
steps: [{ q: "Que vaut le 6<sup>e</sup> terme ?", value: 3 * a + 5 * b, sol: `${a}, ${b}, ${a + b}, ${a + 2 * b}, ${2 * a + 3 * b}, ${3 * a + 5 * b}.` },
{ q: `Une autre suite commence par 2 et \\(x\\), et son 6<sup>e</sup> terme vaut ${T}. Que vaut \\(x\\) ?`, value: x, sol: `Termes : \\(2,\\ x,\\ 2 + x,\\ 2 + 2x,\\ 4 + 3x,\\ 6 + 5x\\). \\(6 + 5x = ${T}\\), donc \\(x = ${x}\\).` }] }; },
expert: () => ({ intro: "Le quotient de deux termes consécutifs de la suite de Fibonacci (1, 1, 2, 3, 5, 8…) se rapproche du nombre d'or \\(\\varphi = \\frac{1 + \\sqrt{5}}{2}\\).",
steps: [{ q: "\\(F_{12} \\div F_{11} = 144 \\div 89\\), au millième ?", value: 144 / 89, round: 0.001, sol: "\\(144 \\div 89 \\approx 1{,}618\\), comme \\(\\varphi \\approx 1{,}618\\)." },
{ q: "Formule de Binet : \\(F_n\\) est l'entier le plus proche de \\(\\frac{\\varphi^n}{\\sqrt 5}\\). Calcule \\(\\frac{\\varphi^{20}}{\\sqrt 5}\\) à l'unité.", value: Math.pow((1 + Math.sqrt(5)) / 2, 20) / Math.sqrt(5), round: 1, sol: "\\(\\approx 6\\,765\\) : c'est \\(F_{20}\\)." }] }) },
"Archimède encadre π": {
plus: () => { const k = pk([2, 3, 5, 7, 10]), r = 7 * k;
return { intro: "Archimède a montré que \\(3 + \\frac{10}{71} < \\pi < 3 + \\frac{1}{7}\\). La borne \\(\\frac{22}{7}\\) a servi pendant des siècles.",
steps: [{ q: "\\(3 + \\frac{1}{7}\\) au millième ?", value: 22 / 7, round: 0.001, sol: "\\(\\frac{22}{7} \\approx 3{,}143\\)." },
{ q: "\\(3 + \\frac{10}{71}\\) au millième ?", value: 3 + 10 / 71, round: 0.001, sol: "\\(\\frac{223}{71} \\approx 3{,}141\\) : π est coincé entre les deux." },
{ q: `Avec \\(\\pi \\approx \\frac{22}{7}\\), longueur d'une piste circulaire de rayon ${r} m (en m) ?`, value: 2 * r * 22 / 7, sol: `\\(2 \\cdot ${r} \\cdot \\frac{22}{7} = ${2 * r * 22 / 7}\\) m.` }] }; },
expert: () => ({ intro: "Le périmètre d'un polygone régulier à \\(n\\) côtés inscrit dans un cercle de diamètre 1 vaut \\(n \\sin\\left(\\frac{180°}{n}\\right)\\) : il approche π par en dessous. Archimède est allé jusqu'à 96 côtés.",
steps: [{ q: "Pour \\(n = 12\\), au millième ?", value: 12 * Math.sin(Math.PI / 12), round: 0.001, sol: "\\(12 \\sin 15° \\approx 3{,}106\\)." },
{ q: "Pour \\(n = 96\\), au millième ?", value: 96 * Math.sin(Math.PI / 96), round: 0.001, sol: "\\(96 \\sin 1{,}875° \\approx 3{,}141\\) : la borne inférieure d'Archimède." }] }) },
"Ératosthène mesure la Terre": {
plus: () => { const [a, d] = pk([[7.2, 800], [9, 1000], [4.5, 500], [6, 650], [12, 1300]]), C = d * 360 / a;
return { intro: `Refais le calcul d'Ératosthène avec d'autres mesures : entre deux villes sur le même méridien, distantes de ${mil(d)} km, les rayons du Soleil font un écart de \\(${dec(a, 1)}°\\).`,
steps: [{ q: `Combien de fois \\(${dec(a, 1)}°\\) dans 360° ?`, value: 360 / a, sol: `\\(360 \\div ${dec(a, 1)} = ${360 / a}\\).` },
{ q: "Circonférence de la Terre (en km) ?", value: C, sol: `\\(${360 / a} \\cdot ${tm(d)} = ${tm(C)}\\) km.` },
{ q: "Rayon de la Terre (en km, à l'unité) ?", value: C / (2 * Math.PI), round: 1, sol: `\\(r = \\frac{${tm(C)}}{2\\pi} \\approx ${tm(Math.round(C / (2 * Math.PI)))}\\) km.` }] }; },
expert: () => { const h = pk([2, 50, 300, 828]), R = 6371, dH = Math.sqrt(2 * R * h / 1000 + (h / 1000) ** 2);
return { intro: `Rayon de la Terre : 6\\,371 km. Une personne dont les yeux sont à ${h} m d'altitude regarde l'horizon : la ligne de visée est tangente à la Terre.`,
steps: [{ q: "L'angle de 7,2° d'Ératosthène, en radians, au millième ?", value: 7.2 * Math.PI / 180, round: 0.001, sol: "\\(7{,}2 \\cdot \\frac{\\pi}{180} \\approx 0{,}126\\) rad." },
{ q: `Distance jusqu'à l'horizon (en km, au dixième) ? Le triangle centre – œil – point de l'horizon est rectangle.`, value: dH, round: 0.1, sol: `\\(d = \\sqrt{(R + h)^2 - R^2} \\approx \\sqrt{2Rh} \\approx ${dec(dH, 1)}\\) km (avec \\(h = ${dec(h / 1000, 3)}\\) km).` }] }; } },
"Thalès et la hauteur de la pyramide": {
plus: () => { const [b, s] = pk([[2, 3], [3, 4], [1, 2]]); let o; do o = ri(10, 60); while ((115 + o) % s); const L = 115 + o, H = b * L / s;
return { intro: `La pyramide de Khéops a une base carrée de 230 m de côté. Un bâton vertical de ${b} m a une ombre de ${s} m ; au même moment, l'ombre de la pyramide dépasse de la base de ${o} m.`,
steps: [{ q: "Longueur de l'ombre mesurée depuis le centre de la pyramide (en m) ?", value: L, sol: `Demi-côté + ombre visible : \\(115 + ${o} = ${L}\\) m.` },
{ q: "Hauteur de la pyramide (en m) ?", value: H, sol: `Même rapport hauteur / ombre : \\(H = ${L} \\cdot \\frac{${b}}{${s}} = ${dec(H, 1)}\\) m.` }] }; } },
"Le petit Gauss et la somme de 1 à 100": {
plus: () => { const a = ri(11, 30), b = ri(80, 150), n = b - a + 1, R = ri(12, 25);
return { intro: `L'astuce de Gauss marche pour toute suite de nombres qui augmentent toujours de la même quantité : on additionne le premier et le dernier, on multiplie par le nombre de termes et on divise par 2.`,
steps: [{ q: `Combien y a-t-il de nombres entiers de ${a} à ${b} (compris) ?`, value: n, sol: `\\(${b} - ${a} + 1 = ${n}\\).` },
{ q: `Somme \\(${a} + ${a + 1} + \\ldots + ${b}\\) ?`, value: n * (a + b) / 2, sol: `\\(\\frac{(${a} + ${b}) \\cdot ${n}}{2} = ${tm(n * (a + b) / 2)}\\).` },
{ q: `Une pile de bûches : 1 en haut, une de plus à chaque rangée, ${R} rangées. Combien de bûches ?`, value: R * (R + 1) / 2, sol: `\\(1 + 2 + \\ldots + ${R} = \\frac{${R} \\cdot ${R + 1}}{2} = ${R * (R + 1) / 2}\\).` }] }; },
expert: () => { const k = pk([7, 9, 11, 13]), f = Math.ceil(100 / k) * k, l = Math.floor(1000 / k) * k, n = (l - f) / k + 1;
return { intro: `Somme de tous les multiples de ${k} compris entre 100 et 1\\,000 (suite arithmétique de raison ${k}).`,
steps: [{ q: `Premier multiple de ${k} supérieur à 100 ?`, value: f, sol: `\\(${f} = ${k} \\cdot ${f / k}\\).` },
{ q: "Nombre de termes ?", value: n, sol: `Dernier : \\(${l}\\) ; \\(\\frac{${l} - ${f}}{${k}} + 1 = ${n}\\).` },
{ q: "Somme ?", value: n * (f + l) / 2, sol: `\\(\\frac{${n} \\cdot (${f} + ${l})}{2} = ${tm(n * (f + l) / 2)}\\).` }] }; } },
"Une tablette babylonienne et les triangles rectangles": {
plus: () => { const p = ri(3, 8), q = ri(2, p - 1), a = p * p - q * q, b = 2 * p * q, c = p * p + q * q;
return { intro: `Une recette pour fabriquer des triangles rectangles à côtés entiers (connue des Babyloniens sous une autre forme) : avec deux entiers \\(p > q\\), on prend \\(a = p^2 - q^2\\), \\(b = 2pq\\), \\(c = p^2 + q^2\\). Ici \\(p = ${p}\\) et \\(q = ${q}\\).`,
steps: [{ q: "\\(a\\) = ?", value: a, sol: `\\(${p * p} - ${q * q} = ${a}\\).` }, { q: "\\(b\\) = ?", value: b, sol: `\\(2 \\cdot ${p} \\cdot ${q} = ${b}\\).` },
{ q: "\\(c\\) (l'hypoténuse) = ?", value: c, sol: `\\(${c}\\). Vérification : \\(${a}^2 + ${b}^2 = ${a * a + b * b} = ${c}^2\\).` }] }; },
expert: () => { const N = pk([10, 11, 13, 14, 17, 19, 23, 29, 31]), x0 = Math.floor(Math.sqrt(N)) + 0.5, x1 = (x0 + N / x0) / 2, x2 = (x1 + N / x1) / 2;
return { intro: `Les Babyloniens calculaient les racines carrées par une méthode (dite de Héron) : si \\(x\\) approche \\(\\sqrt{${N}}\\), alors \\(\\frac{1}{2}\\left(x + \\frac{${N}}{x}\\right)\\) l'approche encore mieux. Départ : \\(x_0 = ${dec(x0, 1)}\\).`,
steps: [{ q: "\\(x_1\\) au millième ?", value: x1, round: 0.001, sol: `\\(\\frac{1}{2}\\left(${dec(x0, 1)} + \\frac{${N}}{${dec(x0, 1)}}\\right) \\approx ${dec(x1, 3)}\\).` },
{ q: "\\(x_2\\) au millième ?", value: x2, round: 0.001, sol: `\\(\\approx ${dec(x2, 3)}\\), alors que \\(\\sqrt{${N}} \\approx ${dec(Math.sqrt(N), 4)}\\) : deux étapes suffisent.` }] }; } },
"Sophie Germain, alias « Monsieur Le Blanc »": {
plus: () => ({ intro: "Un nombre premier \\(p\\) est « de Sophie Germain » si \\(2p + 1\\) est aussi premier.",
steps: [{ q: "Parmi 2, 3, 5, 7, 11 et 13, combien sont des nombres de Sophie Germain ?", value: 4, sol: "2 (→ 5), 3 (→ 7), 5 (→ 11), 11 (→ 23) ; mais 7 → 15 et 13 → 27 ne sont pas premiers." },
{ q: "Plus petit nombre de Sophie Germain plus grand que 11 ?", value: 23, sol: "13 → 27, 17 → 35, 19 → 39 : non ; 23 → 47 : oui." },
{ q: "Chaîne : 2 → 5 → 11 → 23 → 47 → … (on fait chaque fois \\(2p + 1\\)). Combien de nombres premiers d'affilée avant le premier nombre non premier ?", value: 5, sol: "2, 5, 11, 23, 47 sont premiers ; \\(2 \\cdot 47 + 1 = 95 = 5 \\cdot 19\\) ne l'est pas." }] }) },
"Descartes met la géométrie en équations": {
plus: () => { let m, h; do { m = pk([-3, -2, 2, 3, 4]); h = ri(-6, 6); } while (!h); const x1 = ri(-3, 0), x2 = ri(2, 5);
return { intro: `Une droite passe par \\(A(${x1}\\,;\\,${m * x1 + h})\\) et \\(B(${x2}\\,;\\,${m * x2 + h})\\).`,
steps: [{ q: "Sa pente ?", value: m, sol: `\\(\\frac{${m * x2 + h} - (${m * x1 + h})}{${x2} - (${x1})} = \\frac{${m * (x2 - x1)}}{${x2 - x1}} = ${m}\\).` },
{ q: "Son ordonnée à l'origine ?", value: h, sol: `\\(${m * x2 + h} = ${m} \\cdot ${x2} + h\\), donc \\(h = ${h}\\) : \\(y = ${m}x ${h < 0 ? "-" : "+"} ${Math.abs(h)}\\).` },
{ q: "Abscisse du point où elle coupe l'axe des \\(x\\) (fraction ou décimal) ?", value: -h / m, sol: `\\(${m}x ${h < 0 ? "-" : "+"} ${Math.abs(h)} = 0 \\iff x = ${(-h / m) % 1 ? "\\frac{" + -h + "}{" + m + "}" : -h / m}\\).` }] }; },
expert: () => { const [lab, pts] = pk([["y = x + 1", [[3, 4], [-4, -3]]], ["y = x - 1", [[4, 3], [-3, -4]]], ["y = 7 - x", [[3, 4], [4, 3]]], ["y = -x - 1", [[3, -4], [-4, 3]]]]), P = pts[0][0] > pts[1][0] ? pts[0] : pts[1], D = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
return { intro: `Grâce à Descartes, couper un cercle par une droite devient un calcul. Cercle \\(x^2 + y^2 = 25\\), droite \\(${lab}\\).`,
steps: [{ q: "On remplace \\(y\\) dans l'équation du cercle. Plus grande abscisse d'un point d'intersection ?", value: P[0], sol: `On obtient une équation du second degré dont les solutions sont \\(${pts[0][0]}\\) et \\(${pts[1][0]}\\).` },
{ q: "Son ordonnée ?", value: P[1], sol: `\\(y = ${P[1]}\\) ; vérification : \\(${P[0] * P[0]} + ${P[1] * P[1]} = 25\\).` },
{ q: "Longueur de la corde entre les deux points d'intersection (au centième) ?", value: D, round: 0.01, sol: `\\(\\sqrt{${(pts[0][0] - pts[1][0]) ** 2} + ${(pts[0][1] - pts[1][1]) ** 2}} \\approx ${dec(D)}\\).` }] }; } },
"Leonhard Euler, le Bâlois prolifique": {
plus: () => { const n = ri(5, 12), py = pk([true, false]), S = py ? n + 1 : 2 * n, A = py ? 2 * n : 3 * n, F = py ? n + 1 : n + 2, nom = py ? "une pyramide" : "un prisme";
return { intro: `Relation d'Euler pour un polyèdre : \\(S - A + F = 2\\) (sommets, arêtes, faces). On étudie ${nom} dont la base a ${n} côtés.`,
steps: [{ q: "Nombre de sommets \\(S\\) ?", value: S, sol: py ? `${n} à la base + 1 sommet : ${S}.` : `${n} en bas + ${n} en haut : ${S}.` },
{ q: "Nombre d'arêtes \\(A\\) ?", value: A, sol: py ? `${n} à la base + ${n} vers le sommet : ${A}.` : `${n} en bas, ${n} en haut, ${n} verticales : ${A}.` },
{ q: "Nombre de faces \\(F\\) (déduis-le de la relation d'Euler) ?", value: F, sol: `\\(F = 2 - S + A = 2 - ${S} + ${A} = ${F}\\).` }] }; },
expert: () => ({ intro: "Euler a nommé le nombre \\(e\\). On place 1 franc à 100 % d'intérêt par an, avec des intérêts composés \\(n\\) fois par an : on obtient \\(\\left(1 + \\frac{1}{n}\\right)^n\\) francs après un an.",
steps: [{ q: "Avec des intérêts mensuels (\\(n = 12\\)), au millième ?", value: Math.pow(1 + 1 / 12, 12), round: 0.001, sol: "\\((1 + \\frac{1}{12})^{12} \\approx 2{,}613\\)." },
{ q: "Avec des intérêts quotidiens (\\(n = 365\\)), au millième ?", value: Math.pow(1 + 1 / 365, 365), round: 0.001, sol: "\\(\\approx 2{,}715\\) : on se rapproche de \\(e \\approx 2{,}718\\)." }] }) },
"Les sept ponts de Königsberg": {
plus: () => ({ intro: "Euler compte, pour chaque morceau de terre, le nombre de ponts qui en partent (son « degré »). À Königsberg : 5, 3, 3 et 3.",
steps: [{ q: "Somme des degrés ?", value: 14, sol: "\\(5 + 3 + 3 + 3 = 14\\) : le double du nombre de ponts (chaque pont est compté deux fois)." },
{ q: "Une promenade qui revient à son point de départ en passant une fois par chaque pont exige que tous les degrés soient pairs. Combien de ponts faut-il ajouter au minimum ?", value: 2, sol: "Quatre degrés impairs ; chaque nouveau pont rend pairs deux degrés : il en faut 2." }] }) },
"La Pascaline, une calculatrice de 1642": {
plus: () => { const N = ri(40000, 99999), M = ri(10000, N - 5000), c = 99999 - M;
return { intro: `La Pascaline ne savait qu'additionner. Pour calculer \\(${tm(N)} - ${tm(M)}\\), on utilise le « complément à 9 » : on remplace chaque chiffre de \\(${tm(M)}\\) par 9 moins ce chiffre.`,
steps: [{ q: `Complément à 9 de \\(${tm(M)}\\) ?`, value: c, sol: `\\(99\\,999 - ${tm(M)} = ${tm(c)}\\).` },
{ q: `\\(${tm(N)} + ${tm(c)}\\) = ?`, value: N + c, sol: `\\(${tm(N + c)}\\).` },
{ q: "On enlève le 1 de tête (100'000) et on ajoute 1. Résultat ?", value: N - M, sol: `\\(${tm(N + c)} - 100\\,000 + 1 = ${tm(N - M)} = ${tm(N)} - ${tm(M)}\\).` }] }; } },
"Les Mayas comptaient en base 20": {
plus: () => { const a = ri(2, 9), b = ri(2, 19), c = ri(2, 19), N = ri(900, 7900);
return { intro: "En base 20, les positions valent 1, 20, 400 (= 20 · 20)…",
steps: [{ q: `Nombre écrit avec ${a} au niveau des 400, ${b} au niveau des 20 et ${c} au niveau des unités ?`, value: 400 * a + 20 * b + c, sol: `\\(${a} \\cdot 400 + ${b} \\cdot 20 + ${c} = ${tm(400 * a + 20 * b + c)}\\).` },
{ q: `On écrit \\(${tm(N)}\\) en base 20. Combien au niveau des 400 ?`, value: Math.floor(N / 400), sol: `\\(${tm(N)} = ${Math.floor(N / 400)} \\cdot 400 + ${N % 400}\\).` },
{ q: "Et au niveau des 20 ?", value: Math.floor((N % 400) / 20), sol: `\\(${N % 400} = ${Math.floor((N % 400) / 20)} \\cdot 20 + ${N % 20}\\).` }] }; } },
"Pourquoi 60 minutes dans une heure ?": {
plus: () => { const h = ri(1, 4), k = ri(2, 19), m = 3 * k, d = ri(15, 60), q = ri(2, 6), am = 9 * q;
return { intro: "Heures, minutes, secondes : un héritage babylonien de la base 60. On convertit des durées « décimales ».",
steps: [{ q: `Un trajet dure \\(${dec(h + m / 60)}\\) h. Combien de minutes en plus des ${h} heures ?`, value: m, sol: `\\(${dec(m / 60)} \\cdot 60 = ${m}\\) min.` },
{ q: `Un angle de \\(${dec(d + am / 60)}°\\) : combien de minutes d'angle en plus des ${d}° ?`, value: am, sol: `\\(${dec(am / 60)} \\cdot 60 = ${am}'\\).` },
{ q: `Durée de ${h} h ${m} min en secondes ?`, value: h * 3600 + m * 60, sol: `\\(${h} \\cdot 3\\,600 + ${m} \\cdot 60 = ${tm(h * 3600 + m * 60)}\\) s.` }] }; } },
"Euclide : les nombres premiers ne s'arrêtent jamais": {
plus: () => ({ intro: "L'idée d'Euclide : multiplier des nombres premiers et ajouter 1 donne un nombre qui n'est divisible par aucun d'eux.",
steps: [{ q: "\\(2 \\cdot 3 \\cdot 5 \\cdot 7 + 1\\) = ?", value: 211, sol: "\\(210 + 1 = 211\\), qui est premier." },
{ q: "\\(2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 \\cdot 13 + 1\\) = ?", value: 30031, sol: "\\(30\\,030 + 1 = 30\\,031\\)." },
{ q: "Attention : \\(30\\,031\\) n'est pas premier, il est divisible par 59. Quel est l'autre facteur ?", value: 509, sol: "\\(30\\,031 = 59 \\cdot 509\\) : deux nombres premiers absents de la liste de départ. L'argument tient toujours !" }] }) },
"Ramanujan et le taxi 1729": {
plus: () => ({ intro: "1729 est le plus petit nombre qui s'écrit de deux façons comme somme de deux cubes : \\(1^3 + 12^3 = 9^3 + 10^3\\). Le suivant est 4104.",
steps: [{ q: "\\(12^3\\) = ?", value: 1728, sol: "\\(12 \\cdot 12 \\cdot 12 = 1\\,728\\), et \\(1 + 1\\,728 = 1\\,729\\)." },
{ q: "\\(4\\,104 = 2^3 + a^3\\) : que vaut \\(a\\) ?", value: 16, sol: "\\(4\\,104 - 8 = 4\\,096 = 16^3\\)." },
{ q: "\\(4\\,104 = 9^3 + b^3\\) : que vaut \\(b\\) ?", value: 15, sol: "\\(4\\,104 - 729 = 3\\,375 = 15^3\\)." }] }) },
"Ada Lovelace, première programmeuse": {
plus: () => { const n = ri(6, 12); let T; do T = ri(150, 600); while (Number.isInteger(Math.sqrt(T))); const nT = Math.floor(Math.sqrt(T)) + 1;
return { intro: "Un programme dans l'esprit de ceux d'Ada Lovelace : <code>s = 0 ; pour i de 1 à n : s = s + (2i − 1)</code>. Il additionne les \\(n\\) premiers nombres impairs.",
steps: [{ q: `Valeur de <code>s</code> pour \\(n = ${n}\\) ?`, value: n * n, sol: `\\(1 + 3 + \\ldots + ${2 * n - 1} = ${n * n} = ${n}^2\\) : la somme des \\(n\\) premiers impairs vaut \\(n^2\\).` },
{ q: `Plus petit \\(n\\) pour lequel <code>s</code> dépasse ${T} ?`, value: nT, sol: `\\(${nT - 1}^2 = ${(nT - 1) ** 2}\\) et \\(${nT}^2 = ${nT * nT}\\) : \\(n = ${nT}\\).` }] }; } },
"L'âge de Diophante": {
plus: () => { const [a, b, c, Y, x] = pk([[4, 5, 3, 13, 60], [6, 4, 3, 18, 72], [5, 4, 2, 4, 80], [8, 6, 2, 15, 72]]);
return { intro: `Une énigme à la manière de Diophante : « Il passa \\(\\frac{1}{${a}}\\) de sa vie dans l'enfance, \\(\\frac{1}{${b}}\\) dans la jeunesse, \\(\\frac{1}{${c}}\\) comme adulte, puis ${Y} ans de vieillesse. »`,
steps: [{ q: `Quelle fraction de sa vie représentent les ${Y} ans de vieillesse ? (fraction)`, value: 1 - 1 / a - 1 / b - 1 / c, sol: `\\(1 - \\frac{1}{${a}} - \\frac{1}{${b}} - \\frac{1}{${c}} = \\frac{${Y}}{${x}}\\) (après simplification si possible).` },
{ q: "Âge à sa mort ?", value: x, sol: `\\(\\frac{${Y}}{${x}}\\,x = ${Y}\\) ⇒ \\(x = ${x}\\) ans.` }] }; } },
"Napier transforme les multiplications en additions": {
plus: () => { const a = ri(6, 11), b = ri(5, 9);
return { intro: `L'idée de Napier avec les puissances de 2 : \\(2^{${a}} = ${tm(2 ** a)}\\) et \\(2^{${b}} = ${2 ** b}\\). Multiplier, c'est additionner les exposants.`,
steps: [{ q: `\\(${tm(2 ** a)} \\cdot ${2 ** b} = 2^{?}\\)`, value: a + b, sol: `\\(${a} + ${b} = ${a + b}\\).` },
{ q: `Donc \\(${tm(2 ** a)} \\cdot ${2 ** b}\\) = ?`, value: 2 ** (a + b), sol: `\\(2^{${a + b}} = ${tm(2 ** (a + b))}\\).` },
{ q: `Et \\(${tm(2 ** a)} \\div ${2 ** b} = 2^{?}\\)`, value: a - b, sol: `Diviser, c'est soustraire les exposants : \\(${a} - ${b} = ${a - b}\\).` }] }; },
expert: () => ({ intro: "Les logarithmes donnent le nombre de chiffres d'un très grand nombre : \\(N\\) a \\(\\lfloor \\log N \\rfloor + 1\\) chiffres.",
steps: [{ q: "\\(\\log(2^{64}) = 64 \\log 2\\), au centième ?", value: 64 * Math.log10(2), round: 0.01, sol: "\\(64 \\cdot 0{,}30103 \\approx 19{,}27\\)." },
{ q: "Combien de chiffres a \\(2^{64}\\) ?", value: 20, sol: "\\(\\lfloor 19{,}27 \\rfloor + 1 = 20\\) chiffres (\\(2^{64} \\approx 1{,}8 \\cdot 10^{19}\\))." },
{ q: "Plus petit \\(n\\) tel que \\(2^n\\) dépasse un milliard (\\(10^9\\)) ?", value: 30, sol: "\\(n > \\frac{9}{\\log 2} \\approx 29{,}9\\), donc \\(n = 30\\)." }] }) },
"Pascal et Fermat inventent les probabilités": {
plus: () => { const [nb, pB] = pk([[2, 1 / 4], [3, 1 / 8]]), S = (nb === 2 ? 4 : 8) * ri(5, 15);
return { intro: `Le « problème des partis » : une partie de pile ou face en plusieurs manches est interrompue. Au joueur A, il manque 1 manche gagnée ; au joueur B, il en manque ${nb}. La mise totale est de ${S} pistoles.`,
steps: [{ q: "Probabilité que B gagne la partie si on l'avait continuée ?", value: pB, sol: `B doit gagner ${nb} manches d'affilée : \\(\\left(\\frac{1}{2}\\right)^${nb} = \\frac{1}{${1 / pB}}\\).` },
{ q: "Part équitable de A (en pistoles) ?", value: S * (1 - pB), sol: `\\(${S} \\cdot \\frac{${1 / pB - 1}}{${1 / pB}} = ${S * (1 - pB)}\\) pistoles (et ${S * pB} pour B).` }] }; },
expert: () => ({ intro: "Le chevalier de Méré pariait sur « au moins un 6 en 4 lancers d'un dé » et sur « au moins un double 6 en 24 lancers de deux dés ». Pascal a expliqué pourquoi il gagnait au premier jeu et perdait au second.",
steps: [{ q: "\\(P(\\text{au moins un 6 en 4 lancers})\\), au millième ?", value: 1 - (5 / 6) ** 4, round: 0.001, sol: "\\(1 - \\left(\\frac{5}{6}\\right)^4 \\approx 0{,}518\\) : un peu plus d'une chance sur deux." },
{ q: "\\(P(\\text{au moins un double 6 en 24 lancers})\\), au millième ?", value: 1 - (35 / 36) ** 24, round: 0.001, sol: "\\(1 - \\left(\\frac{35}{36}\\right)^{24} \\approx 0{,}491\\) : moins d'une chance sur deux." },
{ q: "Nombre minimal de lancers pour que « au moins un double 6 » ait plus d'une chance sur deux ?", value: 25, sol: "\\(n > \\frac{\\ln 0{,}5}{\\ln(35/36)} \\approx 24{,}6\\), donc 25 lancers." }] }) },
"Emmy Noether, la symétrie au cœur de la physique": {
plus: () => { const n = pk([5, 6, 8, 9, 10, 12]);
return { intro: `Un polygone régulier à ${n} côtés est superposable à lui-même par des rotations et des symétries axiales.`,
steps: [{ q: "Nombre d'axes de symétrie ?", value: n, sol: `Un polygone régulier à \\(n\\) côtés a \\(n\\) axes : ici ${n}.` },
{ q: "Plus petit angle de rotation (en degrés) qui le laisse inchangé ?", value: 360 / n, sol: `\\(360 \\div ${n} = ${dec(360 / n, 1)}°\\).` },
{ q: "Nombre total de transformations qui le laissent inchangé (rotations, y compris celle de 0°, et symétries) ?", value: 2 * n, sol: `${n} rotations + ${n} symétries = ${2 * n}.` }] }; } },
"Alan Turing, la machine et le code secret": {
plus: () => { const r = pk([3, 4]), N = 26 ** r;
return { intro: `Une machine Enigma simplifiée a ${r} rotors, chacun réglable sur 26 positions. Pour casser le code, on essaie les réglages un par un.`,
steps: [{ q: "Nombre de réglages possibles ?", value: N, sol: `\\(26^${r} = ${tm(N)}\\).` },
{ q: "À un essai par seconde, combien d'heures au maximum (au dixième) ?", value: N / 3600, round: 0.1, sol: `\\(${tm(N)} \\div 3\\,600 \\approx ${dec(N / 3600, 1)}\\) h. La machine de Turing testait de nombreux réglages en parallèle.` }] }; } },
"Katherine Johnson, la calculatrice de la NASA": {
plus: () => { const h = pk([300, 350, 400, 420]), T = pk([90, 92, 95]), L = 2 * Math.PI * (6371 + h);
return { intro: `Un satellite tourne à ${h} km au-dessus de la Terre (rayon 6\\,371 km) et fait un tour en ${T} minutes.`,
steps: [{ q: "Longueur d'un tour (en km, à l'unité) ?", value: L, round: 1, sol: `\\(2\\pi \\cdot ${tm(6371 + h)} \\approx ${tm(Math.round(L))}\\) km.` },
{ q: "Vitesse (en km/h, à la centaine près) ?", value: L / (T / 60), round: 100, sol: `\\(${tm(Math.round(L))} \\div \\frac{${T}}{60} \\approx ${tm(Math.round(L / (T / 60) / 100) * 100)}\\) km/h.` }] }; } },
"Zu Chongzhi et l'approximation 355/113": {
plus: () => { const k = pk([2, 3, 4, 5]), N = pk([50, 100, 200]);
return { intro: "Avec \\(\\pi \\approx \\frac{355}{113}\\), la circonférence d'un cercle de diamètre 113 vaut exactement 355.",
steps: [{ q: `Circonférence d'une roue de diamètre ${113 * k} cm (en cm) ?`, value: 355 * k, sol: `\\(${113 * k} \\cdot \\frac{355}{113} = ${355 * k}\\) cm.` },
{ q: `Distance parcourue en ${N} tours (en m) ?`, value: 3.55 * k * N, sol: `\\(${N} \\cdot ${355 * k} = ${tm(355 * k * N)}\\) cm = ${dec(3.55 * k * N, 1)} m.` }] }; } },
"Les pythagoriciens et la musique": {
plus: () => { const L = pk([48, 60, 72, 84, 96]);
return { intro: `Une corde de ${L} cm donne une note. Les pythagoriciens raccourcissent la corde : \\(\\frac{2}{3}\\) de la longueur donne la quinte, \\(\\frac{3}{4}\\) la quarte, \\(\\frac{1}{2}\\) l'octave.`,
steps: [{ q: "Longueur pour la quinte (en cm) ?", value: 2 * L / 3, sol: `\\(\\frac{2}{3} \\cdot ${L} = ${2 * L / 3}\\) cm.` },
{ q: "Longueur pour la quarte (en cm) ?", value: 3 * L / 4, sol: `\\(\\frac{3}{4} \\cdot ${L} = ${3 * L / 4}\\) cm.` },
{ q: "Une quinte, puis une quarte au-dessus : on prend \\(\\frac{3}{4}\\) de la longueur de la quinte. Longueur obtenue (en cm) ?", value: L / 2, sol: `\\(\\frac{3}{4} \\cdot \\frac{2}{3} \\cdot ${L} = \\frac{1}{2} \\cdot ${L} = ${L / 2}\\) cm : l'octave !` }] }; },
expert: () => ({ intro: "Le piano utilise la gamme tempérée : 12 demi-tons égaux dans une octave, chacun multipliant la fréquence par \\(2^{1/12}\\).",
steps: [{ q: "\\(2^{1/12}\\) au dix-millième ?", value: 2 ** (1 / 12), round: 0.0001, sol: "\\(\\approx 1{,}0595\\)." },
{ q: "Quinte tempérée (7 demi-tons) : \\(2^{7/12}\\) au millième ?", value: 2 ** (7 / 12), round: 0.001, sol: "\\(\\approx 1{,}498\\), presque la quinte pure \\(\\frac{3}{2}\\)." },
{ q: "Le la vaut 440 Hz. Fréquence du mi une quinte tempérée au-dessus (en Hz, à l'unité) ?", value: 440 * 2 ** (7 / 12), round: 1, sol: "\\(440 \\cdot 2^{7/12} \\approx 659\\) Hz." }] }) },
"Florence Nightingale, infirmière et statisticienne": {
plus: () => { const N = 50 * ri(8, 30), p = pk([60, 64, 68, 72, 76, 80]), D = N * p / 100;
return { intro: `Un mois de la guerre de Crimée (données inventées, ordres de grandeur réalistes) : ${N} soldats sont morts à l'hôpital, dont ${D} de maladies évitables.`,
steps: [{ q: "Pourcentage de décès dus aux maladies évitables ?", value: p, sol: `\\(\\frac{${D}}{${N}} \\cdot 100 = ${p}\\,\\%\\).` },
{ q: "Grâce à l'hygiène, le taux de mortalité à l'hôpital de Scutari est passé d'environ 42 % à 2 %. Baisse relative (en %, au dixième) ?", value: 40 / 42 * 100, round: 0.1, sol: "\\(\\frac{42 - 2}{42} \\cdot 100 \\approx 95{,}2\\,\\%\\)." }] }; } },
"Le mètre, mesuré sur la Terre": {
plus: () => ({ intro: "En 1791, le mètre est défini comme la dix-millionième partie du quart de méridien terrestre (du pôle Nord à l'équateur).",
steps: [{ q: "Longueur du quart de méridien (en km) ?", value: 10000, sol: "\\(10\\,000\\,000\\) m = \\(10\\,000\\) km." },
{ q: "Longueur d'un degré de latitude (en km, au dixième) ?", value: 40000 / 360, round: 0.1, sol: "\\(40\\,000 \\div 360 \\approx 111{,}1\\) km." },
{ q: "Genève est à 46,2° de latitude nord. Distance jusqu'au pôle Nord le long du méridien (en km, à la dizaine) ?", value: 43.8 * 40000 / 360, round: 10, sol: "\\((90 - 46{,}2) \\cdot 111{,}1 \\approx 4\\,870\\) km." }] }),
expert: () => ({ intro: "La Terre fait un tour sur elle-même en 24 h. À l'équateur, un point parcourt 40'000 km par jour.",
steps: [{ q: "Vitesse d'un point de l'équateur (km/h, à l'unité) ?", value: 40000 / 24, round: 1, sol: "\\(40\\,000 \\div 24 \\approx 1\\,667\\) km/h." },
{ q: "À Genève (latitude 46,2°), le cercle parcouru a un rayon multiplié par \\(\\cos 46{,}2°\\). Vitesse (km/h, à l'unité) ?", value: 40000 / 24 * Math.cos(46.2 * Math.PI / 180), round: 1, sol: "\\(1\\,666{,}7 \\cdot \\cos 46{,}2° \\approx 1\\,154\\) km/h." }] }) },
"Omar Khayyam, poète et calendrier": {
plus: () => ({ intro: "L'année solaire dure environ 365,2422 jours. Le calendrier julien compte 365,25 jours en moyenne ; le calendrier grégorien (1582) supprime 3 années bissextiles tous les 400 ans.",
steps: [{ q: "Décalage du calendrier julien par an (en jours) ?", value: 0.0078, sol: "\\(365{,}25 - 365{,}2422 = 0{,}0078\\) jour." },
{ q: "Au bout de combien d'années (à l'unité) le décalage atteint-il un jour ?", value: 1 / 0.0078, round: 1, sol: "\\(1 \\div 0{,}0078 \\approx 128\\) ans." },
{ q: "Combien d'années bissextiles en 400 ans dans le calendrier grégorien ?", value: 97, sol: "\\(100 - 3 = 97\\) : la moyenne vaut \\(365 + \\frac{97}{400} = 365{,}2425\\) jours." }] }) },
"Le dernier théorème de Fermat": {
plus: () => ({ intro: "Fermat : \\(a^3 + b^3 = c^3\\) n'a pas de solution en entiers positifs. Mais avec trois cubes, c'est possible, et certains « ratés » sont tout près.",
steps: [{ q: "\\(3^3 + 4^3 + 5^3\\) = ?", value: 216, sol: "\\(27 + 64 + 125 = 216\\)." },
{ q: "C'est le cube de quel nombre ?", value: 6, sol: "\\(6^3 = 216\\)." },
{ q: "\\(6^3 + 8^3\\) = ?", value: 728, sol: "\\(216 + 512 = 728 = 9^3 - 1\\) : il ne manque que 1 !" }] }) },
"Les grains de blé de l'échiquier": {
plus: () => { const k = ri(8, 16);
return { intro: "1 grain sur la première case, 2 sur la deuxième, 4 sur la troisième… on double à chaque case.",
steps: [{ q: `Nombre de grains sur la case ${k} ?`, value: 2 ** (k - 1), sol: `\\(2^{${k - 1}} = ${tm(2 ** (k - 1))}\\).` },
{ q: `Total sur les ${k} premières cases ?`, value: 2 ** k - 1, sol: `\\(1 + 2 + \\ldots + 2^{${k - 1}} = 2^{${k}} - 1 = ${tm(2 ** k - 1)}\\).` },
{ q: "Première case qui porte plus d'un million de grains ?", value: 21, sol: "\\(2^{19} = 524\\,288\\) (case 20) et \\(2^{20} = 1\\,048\\,576\\) (case 21)." }] }; },
expert: () => ({ intro: "Sur les 64 cases : \\(2^{64} - 1\\) grains. Un grain de blé pèse environ 0,05 g ; le monde récolte environ 800 millions de tonnes de blé par an.",
steps: [{ q: "Masse totale (en milliards de tonnes, à l'unité) ?", value: 2 ** 64 * 0.05 / 1e6 / 1e9, round: 1, sol: "\\(1{,}845 \\cdot 10^{19} \\cdot 0{,}05\\) g \\(\\approx 9{,}22 \\cdot 10^{17}\\) g \\(= 922\\) milliards de tonnes." },
{ q: "Combien d'années de récolte mondiale (à la dizaine) ?", value: 2 ** 64 * 0.05 / 1e6 / 8e8, round: 10, sol: "\\(9{,}22 \\cdot 10^{11} \\div 8 \\cdot 10^{8} \\approx 1\\,150\\) ans." }] }) },
"Zénon : Achille ne rattrape jamais la tortue ?": {
plus: () => { const [d, vT] = pk([[90, 1], [120, 2], [150, 5], [80, 2]]), vA = 10, t = d / (vA - vT);
return { intro: `Achille court à 10 m/s ; la tortue (très rapide !) avance à ${vT} m/s et part avec ${d} m d'avance.`,
steps: [{ q: "Temps qu'il faut à Achille pour arriver au point de départ de la tortue (en s) ?", value: d / vA, sol: `\\(${d} \\div 10 = ${dec(d / vA, 1)}\\) s ; pendant ce temps, la tortue a encore avancé de \\(${dec(vT * d / vA, 1)}\\) m.` },
{ q: "Chaque seconde, Achille gagne combien de mètres sur la tortue ?", value: vA - vT, sol: `\\(10 - ${vT} = ${vA - vT}\\) m.` },
{ q: "Au bout de combien de secondes la rattrape-t-il ?", value: t, sol: `\\(${d} \\div ${vA - vT} = ${t}\\) s : une infinité d'étapes, mais une durée finie.` }] }; },
expert: () => { const q = pk([0.5, 0.4, 0.2, 0.25]), a = pk([3, 4, 6, 8]);
return { intro: `Une suite géométrique de premier terme \\(${a}\\) et de raison \\(${dec(q)}\\) : \\(${a} + ${dec(a * q)} + ${dec(a * q * q, 3)} + \\ldots\\)`,
steps: [{ q: "Somme des 6 premiers termes, au millième ?", value: a * (1 - q ** 6) / (1 - q), round: 0.001, sol: `\\(S_6 = ${a} \\cdot \\frac{1 - ${dec(q)}^6}{1 - ${dec(q)}} \\approx ${dec(a * (1 - q ** 6) / (1 - q), 3)}\\).` },
{ q: "Somme de tous les termes (limite) ?", value: a / (1 - q), sol: `\\(S = \\frac{${a}}{1 - ${dec(q)}} = ${dec(a / (1 - q), 3)}\\) : la somme infinie est finie, ce qui répond à Zénon.` }] }; } },
"Le carré magique de Dürer (1514)": {
plus: () => ({ intro: "Dans un carré magique \\(n \\times n\\) qui utilise une fois chaque nombre de 1 à \\(n^2\\), la somme de toutes les cases vaut \\(1 + 2 + \\ldots + n^2\\), répartie sur \\(n\\) lignes.",
steps: [{ q: "Somme de 1 à 16 ?", value: 136, sol: "\\(\\frac{16 \\cdot 17}{2} = 136\\)." },
{ q: "Somme magique d'un carré 4 × 4 (vérifie celle de Dürer) ?", value: 34, sol: "\\(136 \\div 4 = 34\\)." },
{ q: "Somme magique d'un carré 5 × 5 ?", value: 65, sol: "\\(1 + \\ldots + 25 = 325\\) et \\(325 \\div 5 = 65\\)." }] }),
expert: () => ({ intro: "Somme magique d'un carré \\(n \\times n\\) : \\(S(n) = \\frac{n(n^2 + 1)}{2}\\).",
steps: [{ q: "\\(S(8)\\) = ?", value: 260, sol: "\\(\\frac{8 \\cdot 65}{2} = 260\\)." },
{ q: "Pour quel \\(n\\) la somme magique vaut-elle 671 ?", value: 11, sol: "\\(n(n^2 + 1) = 1\\,342\\) ; \\(11 \\cdot 122 = 1\\,342\\), donc \\(n = 11\\)." }] }) },
"Galilée et la chute des corps": {
plus: () => { const h = pk([20, 45, 80]);
return { intro: `Avec \\(d = 4{,}9\\,t^2\\), on lâche une pierre d'une hauteur de ${h} m.`,
steps: [{ q: "Distance parcourue pendant la 2<sup>e</sup> seconde seulement (entre t = 1 et t = 2), en m ?", value: 14.7, sol: "\\(4{,}9 \\cdot 4 - 4{,}9 \\cdot 1 = 14{,}7\\) m : plus la pierre tombe longtemps, plus elle va vite." },
{ q: "Durée de la chute (en s, au dixième) ?", value: Math.sqrt(h / 4.9), round: 0.1, sol: `\\(t^2 = \\frac{${h}}{4{,}9}\\), \\(t \\approx ${dec(Math.sqrt(h / 4.9), 1)}\\) s.` }] }; },
expert: () => ({ intro: "La tour de Pise mesure environ 56 m. Une bille lâchée du sommet : \\(d = 4{,}9\\,t^2\\) et \\(v = 9{,}8\\,t\\) (en m/s).",
steps: [{ q: "Durée de la chute (en s, au centième) ?", value: Math.sqrt(56 / 4.9), round: 0.01, sol: "\\(t = \\sqrt{\\frac{56}{4{,}9}} \\approx 3{,}38\\) s." },
{ q: "Vitesse à l'arrivée en km/h (à l'unité, sans frottement) ?", value: 9.8 * Math.sqrt(56 / 4.9) * 3.6, round: 1, sol: "\\(v \\approx 9{,}8 \\cdot 3{,}381 \\approx 33{,}1\\) m/s, soit \\(\\approx 119\\) km/h." }] }) },
"Kepler et la musique des planètes": {
plus: () => ({ intro: "Vérifions la loi de Kepler sur Jupiter : distance moyenne au Soleil 5,2 UA, révolution en 11,86 ans.",
steps: [{ q: "\\(5{,}2^3\\) au dixième ?", value: 140.608, round: 0.1, sol: "\\(5{,}2^3 \\approx 140{,}6\\)." },
{ q: "\\(11{,}86^2\\) au dixième ?", value: 11.86 ** 2, round: 0.1, sol: "\\(11{,}86^2 \\approx 140{,}7\\) : presque égal, comme l'annonce Kepler." }] }),
expert: () => ({ intro: "Avec \\(T^2 = a^3\\) (T en années, a en UA) : \\(T = a^{3/2}\\) et \\(a = T^{2/3}\\).",
steps: [{ q: "Mars est à 1,52 UA du Soleil. Durée de révolution (années, au centième) ?", value: 1.52 ** 1.5, round: 0.01, sol: "\\(1{,}52^{3/2} \\approx 1{,}87\\) an (valeur mesurée : 1,88)." },
{ q: "La planète naine Cérès fait un tour en 4,6 ans. Distance au Soleil (UA, au centième) ?", value: 4.6 ** (2 / 3), round: 0.01, sol: "\\(4{,}6^{2/3} \\approx 2{,}77\\) UA, entre Mars et Jupiter." }] }) },
"Marie Curie et la radioactivité": {
plus: () => { const m = pk([200, 400, 800]);
return { intro: `Le radium a une demi-vie d'environ 1\\,600 ans. On part de ${m} g.`,
steps: [{ q: "Masse restante (en g) après 4\\,800 ans ?", value: m / 8, sol: `\\(4\\,800 = 3 \\cdot 1\\,600\\) : trois demi-vies, \\(${m} \\div 8 = ${m / 8}\\) g.` },
{ q: "Pourcentage restant après 4\\,800 ans ?", value: 12.5, sol: "\\(\\left(\\frac{1}{2}\\right)^3 = 0{,}125 = 12{,}5\\,\\%\\)." },
{ q: "Au bout de combien de demi-vies reste-t-il pour la première fois moins de 1 % ?", value: 7, sol: "\\(\\left(\\frac{1}{2}\\right)^6 \\approx 1{,}6\\,\\%\\) et \\(\\left(\\frac{1}{2}\\right)^7 \\approx 0{,}78\\,\\%\\) : 7 demi-vies." }] }; },
expert: () => { const p = pk([20, 30, 40, 60, 70]), t = 5730 * Math.log(p / 100) / Math.log(0.5);
return { intro: `Datation au carbone 14 (demi-vie 5\\,730 ans) : \\(m(t) = m_0 \\cdot \\left(\\frac{1}{2}\\right)^{t / 5\\,730}\\). Un os ancien ne contient plus que ${p} % de son carbone 14 de départ.`,
steps: [{ q: `Équation : \\(\\left(\\frac{1}{2}\\right)^{x} = ${dec(p / 100, 1)}\\) avec \\(x = \\frac{t}{5\\,730}\\). Que vaut \\(x\\) (au centième) ?`, value: Math.log(p / 100) / Math.log(0.5), round: 0.01, sol: `\\(x = \\frac{\\ln ${dec(p / 100, 1)}}{\\ln 0{,}5} \\approx ${dec(Math.log(p / 100) / Math.log(0.5))}\\).` },
{ q: "Âge de l'os (en années, à la dizaine) ?", value: t, round: 10, sol: `\\(t \\approx 5\\,730 \\cdot ${dec(Math.log(p / 100) / Math.log(0.5), 3)} \\approx ${tm(Math.round(t / 10) * 10)}\\) ans.` }] }; } },
"John Snow et la pompe de Broad Street": {
plus: () => ({ intro: "En 1854, Snow compare deux compagnies d'eau de Londres. Southwark & Vauxhall (eau puisée en aval, polluée) : 1\\,263 décès pour 40\\,046 maisons. Lambeth (eau puisée en amont) : 98 décès pour 26\\,107 maisons.",
steps: [{ q: "Décès pour 10\\,000 maisons chez Southwark & Vauxhall (à l'unité) ?", value: 1263 / 40046 * 10000, round: 1, sol: "\\(\\frac{1\\,263}{40\\,046} \\cdot 10\\,000 \\approx 315\\)." },
{ q: "Décès pour 10\\,000 maisons chez Lambeth (à l'unité) ?", value: 98 / 26107 * 10000, round: 1, sol: "\\(\\frac{98}{26\\,107} \\cdot 10\\,000 \\approx 38\\)." },
{ q: "Combien de fois plus de décès (au dixième) ?", value: (1263 / 40046) / (98 / 26107), round: 0.1, sol: "\\(\\approx 8{,}4\\) fois plus : l'eau polluée est en cause." }] }),
expert: () => ({ intro: "Mêmes données : Southwark & Vauxhall 1\\,263 décès pour 40\\,046 maisons ; Lambeth 98 décès pour 26\\,107 maisons.",
steps: [{ q: "Si les maisons de Southwark & Vauxhall avaient eu le taux de Lambeth, combien de décès y aurait-il eu (à l'unité) ?", value: 40046 * 98 / 26107, round: 1, sol: "\\(40\\,046 \\cdot \\frac{98}{26\\,107} \\approx 150\\)." },
{ q: "Nombre de décès attribuables à l'eau polluée (à la dizaine) ?", value: 1263 - 40046 * 98 / 26107, round: 10, sol: "\\(1\\,263 - 150 \\approx 1\\,110\\) décès." }] }) },
};
HISTOIRE.forEach((H) => { const P = PLUS[H.titre]; if (P) { H.plus = P.plus; H.expert = P.expert; } });

window.HISTOIRE = HISTOIRE;
window.Histoire = {

week() { return Math.floor(Date.now() / (7 * 864e5)) % HISTOIRE.length; },


pick(state) {
const seen = new Set((state && state.histSeen) || []), now = (state && state.now && state.now.ids) || [];
const liés = HISTOIRE.map((H, k) => k).filter((k) => this.ok(HISTOIRE[k], state) && HISTOIRE[k].ids.some((id) => now.includes(id) || now.some((n) => n.startsWith(id))));
const neuf = liés.filter((k) => !seen.has(HISTOIRE[k].titre));
if (neuf.length) return { k: neuf[Math.floor(Date.now() / 864e5) % neuf.length], classe: true };
let k = this.week();
for (let i = 0; i < HISTOIRE.length && !this.ok(HISTOIRE[k], state); i++) k = (k + 1) % HISTOIRE.length;
for (let i = 0, k0 = k; i < HISTOIRE.length; i++) { const j = (k0 + i) % HISTOIRE.length; if (this.ok(HISTOIRE[j], state) && !seen.has(HISTOIRE[j].titre)) { k = j; break; } }
return { k, classe: false };
},

seen(state, k) { if (!state) return; state.histSeen = [...new Set([...(state.histSeen || []), HISTOIRE[k].titre])]; },
other(k, st = typeof state !== "undefined" ? state : null) {
const L = HISTOIRE.map((H, j) => j).filter((j) => j !== k && this.ok(HISTOIRE[j], st));
return L.length ? L[Math.floor(Math.random() * L.length)] : k;
},



ok(H, st) {
const p = (st && st.profile) || { system: "CH", grade: 9, track: "college" };
if (H.sys && H.sys !== p.system) return false;
if (!H.need) return true;
return H.need.some((id) => { const n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, p); return !!pl && pl[0] <= p.grade; });
},

card(k, classe) {
const H = HISTOIRE[k], debut = H.txt.replace(/<[^>]+>/g, "").split(/(?<=[.!?])\s/)[0];
return `<div class="card stack hist-card" id="hist"><div class="eyebrow">📜 Histoire des maths · ${classe ? "en lien avec ton chapitre en classe" : H.t}</div>${H.fig()}<h3>${H.titre}</h3>
        <p class="small muted">${debut}</p><div class="row"><button type="button" class="btn-primary" id="histgo" data-k="${k}">Lire et essayer</button><button type="button" class="btn-sec" id="histnext" data-k="${k}">Une autre</button></div></div>`;
},
bind(root, open) {
const g = root.querySelector("#histgo"), b = root.querySelector("#histnext"); if (!b) return;
g.onclick = () => open(+g.dataset.k);
b.onclick = () => { root.querySelector("#hist").outerHTML = Histoire.card(Histoire.other(+b.dataset.k)); Histoire.bind(root, open); };
},
};
})();











const PZ = {
url() { return location.origin + location.pathname; },
qr(u) { try { return typeof QR !== "undefined" ? QR.svg(u) : ""; } catch (e) { return ""; } },
grade: null,
on: false,

fr() { return !!(typeof state !== "undefined" && state && state.profile && state.profile.system === "FR"); },
};

function presentRoute() {
if (location.hash === "#decouvrir") { screenDecouvrir(); return true; }
if (location.hash === "#parents") { screenParents(); return true; }
if (location.hash === "#enseignants") { screenEnseignants(); return true; }
return false;
}

const pzExit = () => { pzStop(); history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };

function pzStop() { PZ.on = false; document.body.classList.remove("pz-on"); }
window.addEventListener("hashchange", () => { if (!/^#(decouvrir|parents|enseignants)$/.test(location.hash)) pzStop(); });


function pzBind(root) {
const secs = () => Array.from(root.querySelectorAll(".pz-s"));
const cur = () => { const y = window.scrollY + window.innerHeight * 0.35; let k = 0; secs().forEach((s, i) => { if (s.offsetTop <= y) k = i; }); return k; };
const goto = (k) => { const S = secs(); k = Math.max(0, Math.min(S.length - 1, k)); S[k].scrollIntoView({ behavior: "smooth", block: "start" }); };
root.querySelectorAll(".pz-play").forEach((b) => (b.onclick = () => {
PZ.on = !PZ.on; document.body.classList.toggle("pz-on", PZ.on);
root.querySelectorAll(".pz-play").forEach((x) => (x.textContent = PZ.on ? "■ Quitter la présentation" : "▶ Présenter"));
if (PZ.on) { goto(0); if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); }
else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}));
root.querySelectorAll(".pz-next").forEach((b) => (b.onclick = () => goto(cur() + 1)));
document.onkeydown = (e) => {
if (!PZ.on || !/^#(decouvrir|parents|enseignants)$/.test(location.hash)) return;
if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); goto(cur() + 1); }
else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goto(cur() - 1); }
else if (e.key === "Escape") { PZ.on = false; document.body.classList.remove("pz-on"); root.querySelectorAll(".pz-play").forEach((x) => (x.textContent = "▶ Présenter")); }
};
root.querySelectorAll(".pz-exit").forEach((b) => (b.onclick = pzExit));
root.querySelectorAll(".pz-anim").forEach((el) => el.classList.add("pz-wait"));
if ("IntersectionObserver" in window) {
const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pz-wait"); io.unobserve(en.target); } }), { threshold: 0.25 });
root.querySelectorAll(".pz-anim").forEach((el) => io.observe(el));
} else root.querySelectorAll(".pz-anim").forEach((el) => el.classList.remove("pz-wait"));
}


const pzGrades = (id) => `<div class="seg pz-grades" id="${id}">${(PZ.fr() ? [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"], [12, "Tle"]] : [[9, "9e"], [10, "10e"], [11, "11e"], [12, "Sec. II<small class=\"seg-sub\">Collège, MP</small>"]]).map(([g, l]) => `<button type="button" aria-pressed="${g === PZ.grade}" data-v="${g}">${l}</button>`).join("")}</div>`;

function pzQuestion() {
if (PZ.fr()) return pzQuestionFR();
const keep = demoGrade; demoGrade = PZ.grade || null;
let q; try { q = demoQuestion(); } finally { demoGrade = keep; }
return q;
}


function pzTry(box) {
const q = pzQuestion(), n = NOTIONS.find((x) => x.id === q.id), fine = window.matchMedia("(pointer: fine)").matches;
const spec = q.spec.kind === "value" && !q.spec.sci && (Math.abs(q.spec.value) >= 1e-3 || q.spec.value === 0) && Math.abs(q.spec.value) < 1e7 ? { ...q.spec, final: true } : q.spec;
box.innerHTML = `<div class="card tilt pz-q"><div class="qmeta"><span class="chip">${n ? esc(n.label) : "Question"}</span><button type="button" class="btn-ghost small" id="pzother">Une autre ↻</button></div>
    <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    <div class="answer"><input class="ans" id="pzans" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
    <div class="preview" id="pzprev"></div>${keypadHtml(spec)}<div class="actions"><button class="btn-primary" id="pzok">Vérifier</button></div></div>
    <div id="pzfb"></div></div>`;
typeset(box);
const inp = document.getElementById("pzans"), prev = document.getElementById("pzprev"), fb = document.getElementById("pzfb");
const show = () => previewOf(inp, prev, q.spec);
inp.oninput = show; bindKeypad(() => inp, show);
const close = () => { inp.disabled = true; const kp = box.querySelector("#kp"); if (kp) kp.remove(); const ok = document.getElementById("pzok"); if (ok) ok.remove(); prev.remove(); };
const go = () => {
const v = inp.value.trim(); if (!v) return;
const r = checkAnswer(q.spec, v);
if (r.status === "correct") { close(); fb.innerHTML = `<div class="fb ok pop">✓ Juste ! Demain, une question un peu plus loin.</div><details class="par-fold"><summary>Voir la correction</summary><div class="sol">${q.sol}</div></details>`; typeset(fb); return; }
if (r.status === "invalid" || r.status === "form") { fb.innerHTML = `<div class="fb hint pop">${escT(r.message || "Écris un nombre.")}</div>`; typeset(fb); return; }
const d = diagnose(q, v);
fb.innerHTML = `<div class="fb hint pop">${d ? escT(d) : r.status === "close" ? escT(r.message || "Presque !") : "Pas tout à fait."}</div>
      <div class="actions"><button class="btn-primary" id="pzg">On le fait ensemble</button><button class="btn-ghost" id="pzs">Voir la solution</button></div><div id="pzgb"></div>`;
typeset(fb);
document.getElementById("pzs").onclick = () => { close(); fb.innerHTML = `<div class="sol">${q.sol}</div>`; typeset(fb); };
document.getElementById("pzg").onclick = () => { close(); fb.querySelector(".actions").remove(); runGuide(q, document.getElementById("pzgb"), () => {}); };
};
document.getElementById("pzok").onclick = go;
inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
document.getElementById("pzother").onclick = () => pzTry(box);
}


function pzQuestionFR() {
const g = PZ.grade || state.profile.grade, st = Engine.newState({ system: "FR", grade: g, track: "college", minutes: 5 });
Engine.autoInit(st);
const pool = Object.keys(st.notions).filter((id) => ["vu", "encours"].includes(st.notions[id].status) && GEN[id]);
for (let k = 0; k < 40 && pool.length; k++) {
const id = pool[Math.floor(Math.random() * pool.length)];
let q; try { q = Engine.build(id, 1, 1 + Math.floor(Math.random() * 46655)); } catch (e) { continue; }
if (q && q.spec && q.spec.kind === "value" && !q.parts && q.guide && q.guide.length) return Engine.finalize(st, id, q);
}
return Engine.finalize(st, "prio", Engine.build("prio", 1, 7));
}

const pzInstall = (who) => {
const u = PZ.url(), qr = PZ.qr(u);
return `<div class="pz-install">${qr ? `<div class="pz-qr" aria-label="QR code de l'application">${qr}</div>` : ""}
    <div class="stack"><p class="pz-url"><b>${esc(u.replace(/^https?:\/\//, ""))}</b></p>
    <ol class="small pz-steps"><li>Ouvrir le lien ${who === "parent" ? "sur le téléphone de votre enfant" : who === "prof" ? "sur votre téléphone" : "sur ton téléphone"} (ou scanner le QR code).</li>
    <li><b>Android</b> : menu ⋮ → « Ajouter à l'écran d'accueil ». <b>iPhone</b> : bouton Partager → « Sur l'écran d'accueil ».</li>
    <li>${who === "parent" ? "Choisir ensemble sa classe et le chapitre en cours : c'est prêt." : who === "prof" ? "Choisir une classe : vous voyez exactement ce que voient vos élèves." : "Choisis ta classe et le chapitre en cours : c'est parti."}</li></ol></div></div>`;
};

function screenDecouvrir() {
h(`<div class="pz" id="pz" data-noloc>
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">${PZ.fr() ? "Pour les élèves · de la 6e à la terminale" : "Pour les élèves · 9e à 4e, Collège et MP"}</div>
    <h1 class="pz-big">Chaque jour, <span class="mark">5 minutes</span> de maths.<br>Juste à ton niveau.</h1>
    <p class="muted">Une question choisie pour toi, une correction tout de suite, et l'app t'aide étape par étape quand tu bloques.</p>
    <div class="pz-chips pz-anim"><span>📱 sur ton téléphone</span><span>🙈 sans compte, sans nom</span><span>🆓 gratuit, sans pub</span><span>📚 ${PZ.fr() ? "programmes officiels" : "plan d'études genevois"}</span></div>
    <button type="button" class="btn-primary pz-next">Essayer tout de suite ↓</button>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🎯 À toi</div><h2>Une vraie question, maintenant</h2>
    <p class="small muted">Choisis ta classe. Réponds, ou demande « On le fait ensemble ».</p>
    ${pzGrades("pzg1")}
    <div id="pztry"></div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">⚙️ Comment ça marche</div><h2>L'app s'adapte à toi</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🎯 Question du jour</b><p class="small">Ni trop facile, ni impossible : ton <b>Mathélo</b> monte quand tu progresses, et les questions suivent.</p></div>
      <div class="card flat"><b>🪜 Pas à pas</b><p class="small">Une erreur ? L'app repère le piège (« tu as pris l'angle extérieur ? ») et te guide, une étape à la fois.</p></div>
      <div class="card flat"><b>📕 Carnet d'erreurs</b><p class="small">Chaque question ratée y attend sa revanche : réussis-la deux fois de suite, elle s'efface.</p></div>
      <div class="card flat"><b>📝 Ton évaluation</b><p class="small">Donne la date et les notions : chaque jour, juste ce qu'il faut réviser, plus un sujet de préparation corrigé.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔥 Et pour aller plus loin</div><h2>Pas seulement des exercices</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🔍 Problème de la semaine</b><p class="small">Un vrai défi en plusieurs étapes, avec des indices si tu bloques.</p></div>
      <div class="card flat"><b>🎲 Questions curieuses</b><p class="small">Parie d'abord, calcule ensuite : les maths cachées dans la vie de tous les jours.</p></div>
      <div class="card flat"><b>📜 Histoires des maths</b><p class="small">Zénon, Kepler, Marie Curie, John Snow… et un défi expert pour les plus motivés.</p></div>
      <div class="card flat"><b>🔥 Ta série</b><p class="small">Un jour, deux jours, dix jours d'affilée : une courte séance suffit pour la garder.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔒 Ta vie privée</div><h2>Ta progression reste chez toi</h2>
    <ul class="plain pz-list pz-anim"><li>✅ Pas de compte, pas de nom, pas d'adresse mail.</li><li>✅ Tout est enregistré sur ton téléphone ; un code de sauvegarde pour changer d'appareil.</li>
    <li>✅ Des statistiques anonymes seulement si tu es d'accord.</li><li>✅ Tes parents ne voient ta semaine que si <b>toi</b> tu leur envoies (et tu vois exactement ce qu'ils verront).</li></ul>
  </section>

  <section class="pz-s pz-end">
    <div class="eyebrow">📲 Installe-la</div><h2>30 secondes, et c'est parti</h2>
    ${pzInstall("eleve")}
    <button type="button" class="btn-primary btn-big pz-exit">Commencer</button>
  </section>
  </div>`);
const root = document.getElementById("pz"), box = document.getElementById("pztry");
pzBind(root);
root.querySelectorAll("#pzg1 button").forEach((b) => (b.onclick = () => { PZ.grade = +b.dataset.v; root.querySelectorAll("#pzg1 button").forEach((x) => x.setAttribute("aria-pressed", x === b)); pzTry(box); }));
pzTry(box);
}


function pzSolve(box) {
const q = pzQuestion(), n = NOTIONS.find((x) => x.id === q.id), G = (q.guide || []).filter((g) => g && g.ask);
const trap = q.traps && q.traps[0] && q.traps[0].m ? q.traps[0].m : "";
box.innerHTML = `<div class="card stack par-pb pz-q"><div class="qmeta"><span class="chip">${n ? esc(n.label) : "Problème"}</span><button type="button" class="btn-ghost small" id="pzother2">Un autre ↻</button></div>
    <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    <div class="par-step"><b>1. Commencez par lui demander</b><ul class="plain par-list small"><li>« Qu'est-ce qu'on cherche ? »</li><li>« Qu'est-ce que tu sais déjà, dans l'énoncé ? »</li><li>« Tu peux m'expliquer ce que tu as essayé ? »</li></ul></div>
    ${G.length ? `<div class="par-step"><b>2. Des indices, un à la fois</b><span class="small muted">Dévoilez une étape seulement si votre enfant bloque.</span><div id="pzhints" class="stack"></div><button type="button" class="btn-sec small" id="pzhint">Dévoiler l'indice 1 / ${G.length}</button></div>` : ""}
    ${trap ? `<div class="par-diag"><b>🔎 Un piège fréquent</b><div class="small">${escT(trap)}</div></div>` : ""}
    <details class="par-fold par-sol"><summary>🔑 La solution complète (pour vous)</summary><div class="sol">${q.sol}</div></details></div>`;
typeset(box);
let k = 0;
const bt = document.getElementById("pzhint");
if (bt) bt.onclick = () => {
const g = G[k++], d = document.createElement("div");
d.className = "pz-hint pop small";
d.innerHTML = `<div>${g.ask}</div>${g.sol ? `<details class="par-fold"><summary class="small">Réponse de cette étape</summary><div class="small">${g.sol}</div></details>` : ""}`;
document.getElementById("pzhints").appendChild(d); typeset(d);
if (k >= G.length) bt.remove(); else bt.textContent = `Dévoiler l'indice ${k + 1} / ${G.length}`;
};
document.getElementById("pzother2").onclick = () => pzSolve(box);
}

function screenParents() {
const JR = ["L", "M", "M", "J", "V", "S", "D"], ON = [1, 1, 0, 1, 0, 1, 0];
h(`<div class="pz" id="pz" data-noloc>
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">👪 Je suis parent</div>
    <h1 class="pz-big">Accompagner son enfant en maths,<br><span class="mark">2 minutes</span> par semaine.</h1>
    <p class="muted">Votre enfant s'entraîne environ 5 minutes par jour, à son niveau, sur le programme de sa classe. Vous, vous l'encouragez, et vous pouvez résoudre un problème avec lui, même sans être fort en maths.</p>
    <div class="pz-chips pz-anim"><span>🤝 accompagner, pas surveiller</span><span>🆓 gratuit, sans compte</span><span>📚 ${PZ.fr() ? "programmes officiels, de la 6e à la terminale" : "plan d'études genevois, 9e → 4e, Collège et MP"}</span></div>
    <button type="button" class="btn-primary pz-next">Voir comment ↓</button>
  </section>

  <section class="pz-s">
    <div class="eyebrow">📱 Côté enfant</div><h2>Environ 5 minutes par jour, juste à son niveau</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🎯 Adapté</b><p class="small">Chaque question est choisie selon ses réussites : ni trop facile, ni décourageante.</p></div>
      <div class="card flat"><b>🏫 Relié à la classe</b><p class="small">Il indique le chapitre en cours et la date de sa prochaine évaluation : l'app le prépare jour après jour.</p></div>
      <div class="card flat"><b>🪜 Jamais seul face à l'erreur</b><p class="small">L'app repère l'erreur et le guide étape par étape, sans donner la réponse d'emblée.</p></div>
      <div class="card flat"><b>📕 Il revient sur ses erreurs</b><p class="small">Un carnet garde ses questions ratées ; il les retente avec d'autres nombres jusqu'à les réussir.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">📅 Côté parent</div><h2>Sa semaine, en un coup d'œil</h2>
    <p class="small muted">Quand votre enfant vous envoie son lien (WhatsApp, SMS), vous voyez :</p>
    <div class="card stack par-week pz-anim"><div class="eyebrow">📅 Exemple</div>
      <div class="par-days">${JR.map((d, i) => `<span class="${ON[i] ? "on" : ""}">${d}</span>`).join("")}</div>
      <p><b>4 jours de pratique sur 7.</b> Belle régularité !</p>
      <div><b>Ce qui a été travaillé</b><ul class="plain par-list small"><li>• Équations du 1er degré</li><li>• Théorème de Pythagore</li></ul></div>
      <div class="par-fete"><span>🏅</span><div><b>À fêter</b><div class="small">Une erreur du carnet réussie deux fois de suite : effacée !</div></div></div></div>
    <p class="small"><b>Ce que vous ne verrez pas</b> : ni notes, ni score, ni heures de connexion, ni liste de fautes. L'effort et les progrès, c'est tout.</p>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🤝 Résoudre ensemble</div><h2>Un problème qui lui a résisté ? Faites-le à deux.</h2>
    <p class="small muted">Pas besoin de vous souvenir du cours : l'app vous donne les questions à poser, les indices un par un, le piège fréquent, et la solution pour vous seul. Essayez :</p>
    ${pzGrades("pzg2")}
    <div id="pzsolve"></div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">💡 Pour l'accompagner</div><h2>Trois gestes qui comptent</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>👏 Valoriser l'effort</b><p class="small">« Tu t'es entraîné 4 jours cette semaine, bravo » plutôt que « combien tu as eu ? ».</p></div>
      <div class="card flat"><b>🗣️ Le laisser expliquer</b><p class="small">C'est en expliquant qu'on comprend. Faites l'élève, il fait le prof.</p></div>
      <div class="card flat"><b>🤐 Ne pas donner la réponse</b><p class="small">Un indice, une question, puis on attend. La réponse trouvée seul vaut dix réponses données.</p></div>
      <div class="card flat"><b>🎲 Un moment partagé</b><p class="small">Chaque semaine, une question curieuse à parier en famille et une histoire des maths à raconter.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🚀 Mise en route</div><h2>Trois étapes, une seule fois</h2>
    <ol class="pz-list pz-anim"><li><b>Installez l'app sur son téléphone</b> (QR code ci-dessous).</li>
    <li><b>Choisissez ensemble</b> sa classe, le chapitre en cours et la date de la prochaine évaluation.</li>
    <li><b>Chaque semaine</b>, il vous envoie son lien : dans l'app, Progrès → « 👪 Envoyer à mes parents ». Il voit exactement ce que vous verrez.</li></ol>
    <p class="small muted">Plusieurs enfants ? Leurs liens se rangent côte à côte, sur votre téléphone seulement.</p>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔒 Confidentialité</div><h2>Rien ne quitte son téléphone sans lui</h2>
    <ul class="plain pz-list pz-anim"><li>✅ Pas de compte, pas de nom, pas d'adresse mail, pas de publicité.</li><li>✅ La progression est enregistrée sur l'appareil ; le lien qu'il vous envoie est une « photo » de sa semaine, lue sur votre téléphone sans passer par un serveur.</li>
    <li>✅ Des statistiques anonymes d'utilisation seulement avec son accord.</li></ul>
  </section>

  <section class="pz-s pz-end">
    <div class="eyebrow">📲 Pour commencer</div><h2>L'app, sur le téléphone de votre enfant</h2>
    ${pzInstall("parent")}
    <div class="actions"><button type="button" class="btn-sec" id="pzgot">J'ai reçu un lien de mon enfant</button><button type="button" class="btn-ghost pz-exit">Retour à l'app</button></div>
  </section>
  </div>`);
const root = document.getElementById("pz"), box = document.getElementById("pzsolve");
pzBind(root);
root.querySelectorAll("#pzg2 button").forEach((b) => (b.onclick = () => { PZ.grade = +b.dataset.v; root.querySelectorAll("#pzg2 button").forEach((x) => x.setAttribute("aria-pressed", x === b)); pzSolve(box); }));
document.getElementById("pzgot").onclick = () => { pzStop(); location.hash = "#parent"; };
pzSolve(box);
}



function pzCoverage() {


const CH = (g, t, niv) => ({ system: "CH", grade: g, track: t, ...(niv ? { niv } : {}) });
const P = PZ.fr() ? [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"], [12, "Terminale"]].map(([g, l]) => [l, { system: "FR", grade: g, track: "college" }])
: [["9e", CH(9, "college")], ["10e", CH(10, "college")], ["11e", CH(11, "college")], ["1re Collège", CH(12, "college")], ["2e Collège", CH(13, "college")],
["3e Coll. MA1", CH(14, "college", "N")], ["3e Coll. MA2", CH(14, "college", "R")], ["4e Coll. MA1", CH(15, "college", "N")], ["4e Coll. MA2", CH(15, "college", "R")],
["MP 1re", CH(12, "mp")], ["MP 2e", CH(13, "mp")], ["MP 3e", CH(14, "mp")], ["MP 4e", CH(15, "mp")]];

const total = (p) => {
const ref = Engine.refOf(p), L = (typeof THEME_LABEL !== "undefined" && THEME_LABEL[ref]) || {};
const pre = ref === "CO" ? p.grade + "C" : ref === "MATU" ? "M" + (p.grade - 11) + "C" : ref === "FR" && p.grade >= 10 ? { 10: "2", 11: "1", 12: "T" }[p.grade] : null;

const ma1 = ref === "MATU" && p.grade >= 14 && p.niv !== "R", OT = typeof ORDRE_THEME !== "undefined" ? ORDRE_THEME : {};
const inPlan = (k) => !ma1 || NOTIONS.some((n) => n.niv !== "R" && ["MATU", "MATU_ALT", "MATU_REP"].some((m) => (OT[m] || {})[n.id] === k));
return pre ? Object.keys(L).filter((k) => k.startsWith(pre) && (pre !== "2" || k !== "2AU") && inPlan(k)).length : 0;
};
return P.map(([l, p]) => {
let nw = 0, rep = 0, ch = 0, tot = 0;
try {
const c = Engine.catalog(p).filter((x) => x.current), isNew = (x) => (placeOf(x, p) || [0])[0] === p.grade;
nw = c.filter(isNew).length; rep = c.length - nw; tot = total(p);
const ref = Engine.refOf(p), pre = ref === "CO" ? "CO." + p.grade + "C" : ref === "MATU" ? "MATU.M" + (p.grade - 11) + "C" : null;
ch = new Set(c.map((x) => x.theme).filter((k) => (pre ? k.startsWith(pre) : true))).size;
} catch (e) {}
return [l, nw, rep, ch, tot];
}).filter(([, n, r]) => n + r > 0);
}
function pzLoop() {
const N = [["🎯", "Question", "à son niveau"], ["✍️", "Réponse", "résultat, pas le calcul"], ["🔎", "Diagnostic", "le piège repéré"], ["🪜", "Pas à pas", "une étape à la fois"], ["📕", "Carnet", "revient plus tard"]];
const R = 112, cx = 170, cy = 150;
const pos = N.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N.length; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
const arcs = pos.map(([x, y], i) => { const [x2, y2] = pos[(i + 1) % N.length], mx = (x + x2) / 2, my = (y + y2) / 2, k = 1.18; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} Q${(cx + (mx - cx) * k).toFixed(0)} ${(cy + (my - cy) * k).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}" class="pz-loop-arc"/>`; }).join("");
const nodes = pos.map(([x, y], i) => `<g class="pz-loop-n" style="--d:${i * 0.15}s"><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="33"/><text x="${x.toFixed(0)}" y="${(y - 6).toFixed(0)}" text-anchor="middle" font-size="18">${N[i][0]}</text><text x="${x.toFixed(0)}" y="${(y + 14).toFixed(0)}" text-anchor="middle" font-size="11" font-weight="700">${N[i][1]}</text></g>`).join("");
const legend = N.map((n) => `<li><b>${n[0]} ${n[1]}</b> : ${n[2]}</li>`).join("");
return `<div class="pz-loop pz-anim"><svg viewBox="0 0 340 300" role="img" aria-label="Boucle d'une séance : question, réponse, diagnostic, pas à pas, carnet d'erreurs">${arcs}${nodes}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" font-weight="800" class="pz-loop-c">5 minutes</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="11" class="pz-loop-c">chaque jour</text></svg><ul class="plain small pz-loop-l">${legend}</ul></div>`;
}

function pzCount(root) {
const run = (el) => { const to = +el.dataset.to, t0 = performance.now(), D = 900; const f = (t) => { const k = Math.min(1, (t - t0) / D); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString("fr-CH"); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
const els = root.querySelectorAll(".pz-num[data-to]");
if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => (e.textContent = (+e.dataset.to).toLocaleString("fr-CH"))); return; }
const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: 0.4 });
els.forEach((e) => io.observe(e));
}
const PZ_COV_PROFILES_FR = [6, 7, 8, 9, 10, 11, 12].map((g) => ({ system: "FR", grade: g, track: "college" }));
const PZ_COV_PROFILES = [9, 10, 11, 12, 13, 14, 15].map((g) => ({ system: "CH", grade: g, track: "college", niv: "R" })).concat([12, 13, 14, 15].map((g) => ({ system: "CH", grade: g, track: "mp" })));
const pzCovHtml = (cov) => { const maxN = Math.max(1, ...cov.map(([, n, r]) => n + r)); return cov.map(([l, n, r, ch, tot]) => `<div class="pz-cov-r"><span>${esc(l)}</span><span class="pz-cov-b"><i style="width:${Math.round((n / maxN) * 100)}%"></i><i class="rep" style="width:${Math.round((r / maxN) * 100)}%"></i></span><span class="small">${n}${r ? " + " + r : ""} · ${ch}${tot ? " / " + tot : ""} chap.</span></div>`).join("") +
`<p class="small muted pz-cov-leg"><span class="pz-sw"></span> nouvelles notions de l'année · <span class="pz-sw rep"></span> reprises des années précédentes · chapitres du plan couverts${PZ.fr() ? "" : " (MA1 : niveau normal, MA2 : renforcé)"}</p>`; };
const pzNotionCount = () => {
if (!PZ.fr()) return NOTIONS.filter((n) => n.CH || n.MP).length;
const ids = new Set(); PZ_COV_PROFILES_FR.forEach((p) => { try { Engine.catalog(p).filter((c) => c.current).forEach((c) => ids.add(c.id)); } catch (e) {} }); return ids.size;
};
function screenEnseignants() {
const cov = pzCoverage(), nNotions = pzNotionCount(), nClasses = PZ.fr() ? 7 : 11;
h(`<div class="pz" id="pz" data-noloc>
  <div class="spread pz-bar">${brand}<span class="row" style="gap:6px"><button type="button" class="btn-sec small pz-play">▶ Présenter</button><button type="button" class="btn-ghost small pz-exit" aria-label="Quitter">✕</button></span></div>

  <section class="pz-s pz-hero">
    <div class="eyebrow">👩‍🏫 ${PZ.fr() ? "Pour les enseignant·es · collège et lycée" : "Pour les enseignant·es · secondaire I et II"}</div>
    <h1 class="pz-big">Un entraînement quotidien,<br><span class="mark">aligné sur votre programme</span>,<br>que vos élèves font vraiment.</h1>
    <p class="muted">Environ 5 minutes par jour sur le téléphone : des questions au niveau de chaque élève, une correction immédiate et une aide pas à pas. Pour vous, aucune préparation ni correction, et aucune donnée d'élève à gérer.</p>
    <div class="pz-nums pz-anim"><div><span class="pz-num" id="pznn" data-to="${nNotions}">${nNotions}</span><small>notions</small></div><div><span class="pz-num" data-to="${nClasses}">${nClasses}</span><small>${PZ.fr() ? "classes, de la 6e à la terminale" : "classes, de la 9e à la 4e (CO, Collège, MP)"}</small></div><div><span class="pz-num" data-to="0">0</span><small>compte à créer</small></div></div>
    <button type="button" class="btn-primary pz-next">Découvrir ↓</button>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🧠 Les principes</div><h2>Ce que la recherche recommande, en 5 minutes</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🔁 Récupérer en mémoire</b><p class="small">Répondre à une question fixe mieux que relire. Chaque séance est faite de questions, pas de lecture.</p></div>
      <div class="card flat"><b>📆 Espacer</b><p class="small">Une notion revient plusieurs jours plus tard, au moment où elle risque de s'oublier. Les notions des années précédentes reviennent quand c'est utile.</p></div>
      <div class="card flat"><b>🔀 Alterner</b><p class="small">Les notions sont mélangées dans une séance : l'élève doit reconnaître la méthode, pas seulement l'appliquer.</p></div>
      <div class="card flat"><b>⚡ Corriger tout de suite</b><p class="small">La correction est immédiate et ciblée : l'app repère l'erreur typique et la nomme.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔄 Une séance</div><h2>La boucle d'une séance</h2>
    ${pzLoop()}
  </section>

  <section class="pz-s">
    <div class="eyebrow">🎯 Démonstration</div><h2>Essayez comme un élève</h2>
    <p class="small muted">Choisissez une classe et répondez. Faites exprès une erreur classique pour voir le diagnostic, puis « On le fait ensemble ».</p>
    ${pzGrades("pzg3")}
    <div id="pztry"></div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">📚 Votre programme</div><h2>${PZ.fr() ? "Les programmes, classe par classe" : "Le plan d'études, classe par classe"}</h2>
    <p class="small muted">${PZ.fr() ? "Programmes officiels : cycle 3 (2025), cycle 4 (2026 en 5e ; 2019 en 4e et 3e), lycée (2026). Notions travaillées dans l'année :" : "Plan d'études romand (CO), plans du Collège de Genève et de la maturité professionnelle. Notions travaillées dans l'année :"}</p>
    <div class="pz-cov pz-anim" id="pzcov">${pzCovHtml(cov)}</div>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>🏫 « En ce moment en classe »</b><p class="small">L'élève reconnaît son chapitre à un exercice typique : environ 2 questions sur 3 portent alors dessus.</p></div>
      <div class="card flat"><b>📝 « Mon évaluation »</b><p class="small">Il donne la date et les notions de votre évaluation : révision jour après jour, puis un sujet de préparation corrigé.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🪜 Différenciation</div><h2>Chaque élève à son niveau, sans rien régler</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>📈 Quatre niveaux par notion</b><p class="small">De l'automatisme au défi. Le Mathélo de l'élève monte ou descend selon ses réponses, et les questions suivent.</p></div>
      <div class="card flat"><b>🧩 Élève en difficulté</b><p class="small">Le diagnostic, puis le pas à pas, le rappel de cours et une leçon active à manipuler. Il retente avec d'autres nombres.</p></div>
      <div class="card flat"><b>🚀 Élève rapide</b><p class="small">Des défis de niveau 4, le problème de la semaine, des questions curieuses et des histoires des maths.</p></div>
      <div class="card flat"><b>🧮 Le résultat, pas le calcul</b><p class="small">Quand c'est le calcul qu'on évalue, l'élève tape le résultat sur un clavier sans opérations : la calculatrice ne fait pas le travail à sa place.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">✅ Qualité</div><h2>Des questions vérifiées, jamais deux fois les mêmes</h2>
    <ul class="plain pz-list pz-anim"><li>🎲 <b>Valeurs tirées au hasard</b> dans des plages choisies : jamais de cas trivial (0, 1, réponse déjà dans l'énoncé).</li>
    <li>📏 <b>Niveau calé sur les vraies évaluations</b> de chaque classe, notion par notion.</li>
    <li>🤖 <b>Des tests automatiques</b> avant chaque mise à jour, et un élève-robot qui parcourt toutes les classes : textes, figures, réponses acceptées, affichage sur téléphone.</li>
    <li>👍 <b>Les élèves jugent</b> : un pouce et un commentaire sur chaque question, lus et traités.</li></ul>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🔒 Données</div><h2>Rien à déclarer, rien à gérer</h2>
    <ul class="plain pz-list pz-anim"><li>✅ Ni compte, ni nom, ni adresse mail. La progression reste sur le téléphone de l'élève.</li>
    <li>✅ Des statistiques anonymes d'usage, seulement avec l'accord de l'élève, qu'il peut couper.</li>
    <li>✅ Pas de publicité, pas de service tiers. Les polices et les formules sont servies par le site de l'app.</li>
    <li>✅ Les parents ne voient la semaine de l'enfant que s'il la leur envoie.</li></ul>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🧭 Honnêtement</div><h2>Ce que l'app ne fait pas</h2>
    <div class="pz-grid pz-anim">
      <div class="card flat"><b>Remplacer le cours</b><p class="small">Elle entraîne ce qui a été vu en classe ; elle n'introduit pas une notion à votre place.</p></div>
      <div class="card flat"><b>Noter vos élèves</b><p class="small">Pas de note ni de classement. Le Mathélo est un repère pour l'élève, pas une évaluation.</p></div>
      <div class="card flat"><b>Suivre une classe</b><p class="small">Il n'y a pas de tableau de bord enseignant : sans compte, aucune donnée nominative ne remonte.</p></div>
      <div class="card flat"><b>Tout évaluer</b><p class="small">Constructions, raisonnements rédigés et démonstrations restent l'affaire de la classe.</p></div>
    </div>
  </section>

  <section class="pz-s">
    <div class="eyebrow">🚀 En classe</div><h2>Lancer l'app avec une classe</h2>
    <ol class="pz-list pz-anim"><li><b>Présentez-la</b> avec la page élèves, projetable avec son QR code : <a href="#decouvrir">…/#decouvrir</a>.</li>
    <li><b>Installez-la ensemble</b> en 5 minutes : classe, chapitre en cours, date de la prochaine évaluation.</li>
    <li><b>Rappelez-la</b> au début d'un chapitre et une semaine avant chaque évaluation.</li>
    <li><b>Informez les familles</b> avec la page parents : <a href="#parents">…/#parents</a>.</li></ol>
  </section>

  <section class="pz-s pz-end">
    <div class="eyebrow">📲 Pour l'essayer</div><h2>Ouvrez-la sur votre téléphone</h2>
    ${pzInstall("prof")}
    <div class="actions"><button type="button" class="btn-primary pz-exit">Essayer l'app</button></div>
  </section>
  </div>`);
const root = document.getElementById("pz"), box = document.getElementById("pztry");
pzBind(root); pzCount(root);

if (typeof window.ensurePacks === "function") (PZ.fr() ? PZ_COV_PROFILES_FR : PZ_COV_PROFILES).reduce((pr, p) => pr.then(() => window.ensurePacks(p)).catch(() => {}), Promise.resolve()).then(() => {
if (location.hash !== "#enseignants") return;
const el = document.getElementById("pzcov"); if (el) el.innerHTML = pzCovHtml(pzCoverage());
const nn = document.getElementById("pznn"); if (nn) { nn.dataset.to = pzNotionCount(); nn.textContent = (+nn.dataset.to).toLocaleString("fr-CH"); }
});
root.querySelectorAll("#pzg3 button").forEach((b) => (b.onclick = () => { PZ.grade = +b.dataset.v; root.querySelectorAll("#pzg3 button").forEach((x) => x.setAttribute("aria-pressed", x === b)); pzTry(box); }));
pzTry(box);
}

