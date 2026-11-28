// Questions curieuses (21.11, demande de l'auteur : « des questions où le savoir mathématique est plus dissimulé »).
// Une situation de la vie ou un paradoxe : l'élève PARIE d'abord (intuition), puis VÉRIFIE par un calcul, puis on lui
// dit quel outil il a utilisé. Facultatif, sans effet sur le Mathélo. Familles : « Vrai ou arnaque ? » (pourcentages,
// prix, graphiques), « Ton intuition te trompe ? » (paradoxes), « Estime ! » (Fermi : réponse dans une fourchette, calc.range),
// « Énigme » (logique, dénombrement, accessibles dès la 9e) et « Maths de tous les jours » (recette, abonnements, pente…).
// Un élément = { key, fam, uses: [notions nécessaires, déjà vues], outil, make() } ;
// make() rend { titre, q, fig?, bet: { q, choices, good }, calc: { label, value, round?, unit? }, reveal }.
// Valeurs tirées au hasard (graine dans le code « cur-<key>-<graine> »), jamais triviales ; contextes variés.
const CURIEUX = [];
const CUR_FAM = { arnaque: { label: "Vrai ou arnaque ?", ic: "🕵️" }, paradoxe: { label: "Ton intuition te trompe ?", ic: "🤯" }, fermi: { label: "Estime !", ic: "🔭" }, enigme: { label: "Énigme", ic: "🧩" }, quotidien: { label: "Maths de tous les jours", ic: "🧭" } };
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  // Nombre en TeX : virgule décimale, ' des milliers.
  const N = (v, k) => { if (k !== undefined) v = +(+v).toFixed(k); let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const T = (v, k) => M(N(v, k));
  const chf = (v) => M(N(v, Number.isInteger(r6(v)) ? 0 : 2).replace(/\{,\}(\d)$/, "{,}$10") + "\\ \\text{CHF}");
  const pc = (v, k) => M(N(v, k) + "\\,\\%");
  const pk = R.pick, add = (o) => CURIEUX.push(o);

  // ===================== Vrai ou arnaque ? =====================
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
      // Prix et variations réalistes par objet (commentaire testeur du 21.11 : « prix pas très cohérent »).
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
      return { titre: "Plus de produit ou moins cher ?", q: "Deux offres pour le même " + it + " : « +" + pc(b) + " de produit gratuit » (même prix, plus de contenu), ou « −" + pc(D) + " sur le prix »." /* 26.11 (revue élèves, A12) : « −35 % », comme dans les choix */,
        bet: { q: "Quelle offre baisse le plus le prix de chaque gramme ?", choices: ["+" + b + " % gratuit", "−" + D + " % sur le prix", "C'est pareil"], good },
        calc: { label: "« +" + b + " % gratuit » : de combien de % baisse le prix d'un gramme ? (au dixième)", value: Math.round(red * 10) / 10, round: 0.1 },
        reveal: "Pour le même prix, tu as " + M(N(1 + b / 100)) + " fois plus : chaque gramme coûte " + M("\\frac{1}{" + N(1 + b / 100) + "} \\approx " + N(1 / (1 + b / 100), 3)) + " du prix, soit " + pc(red, 1) + " de moins. " + (good === 2 ? "Exactement comme −" + D + " %." : good === 0 ? "Mieux que −" + D + " %." : "Moins bien que −" + D + " % : « +" + b + " % » impressionne plus qu'il ne rapporte.") };
    } });

  // ===================== Ton intuition te trompe ? =====================
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
        calc: { label: "Leur masse maintenant (en kg, au dixième ou en fraction)", value: F, round: Number.isInteger(r6(F * 10)) ? undefined : 0.1 }, /* 28.11 (testeur : 200/3 refusé, valeur stockée arrondie) */
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

  // ===================== Estime ! (Fermi) =====================
  // Réponse acceptée dans une fourchette (calc.range) : on juge l'ordre de grandeur et la démarche, pas la décimale.
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
      return { titre: "L'eau de la douche", q: "Une douche débite environ " + M(deb) + " litres d'eau par minute. Tu prends chaque jour une douche de " + M(m + "\\ \\text{min}") + ".",
        bet: { q: "En une année, cela fait combien de baignoires pleines (" + bain + " L) ?", choices: ["moins de 10", "entre 10 et 50", "entre 50 et 500", "plus de 500"], good: v / bain < 10 ? 0 : v / bain < 50 ? 1 : v / bain < 500 ? 2 : 3 },
        calc: { label: "Litres d'eau en une année", value: v, range: [v * 0.97, v * 1.03] },
        reveal: M(deb + " \\cdot " + m + " \\cdot 365 = " + N(v)) + " litres, soit environ " + P(v / bain) + " baignoires (" + M(N(v) + " \\div " + bain) + ")." };
    } });

  // ===================== Énigmes =====================
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
      /* 28.11 (commentaire de l'auteur : « prix pas réalistes ») : prix vraisemblables, le piège reste (réponse naïve = total − différence). */
      const [T, d, it] = pk([[110, 100, ["une batte de baseball", "une balle"]], [43, 40, ["une raquette de badminton", "un volant"]], [83, 80, ["une raquette de tennis", "une balle"]], [13, 12, ["un stylo-plume", "une cartouche d'encre"]], [128, 120, ["une trottinette", "une sonnette"]]]), v = r6((T - d) / 2);
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

  // ===================== Maths de tous les jours =====================
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

  // ===================== Lot 2 (21.11) =====================
  const dc = (v, k = 1) => (+v.toFixed(k)).toString().replace(".", ","); // nombre en texte simple, virgule décimale
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
        calc: { label: "Nombre de jours de 24 h (au dixième)" /* 26.11 soir : « jours entiers » au dixième était contradictoire */, value: Math.round(v * 10) / 10, range: [v * 0.95, v * 1.05] },
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

  // ===================== 3e série (26.11, « d'autres entrées ») =====================
  // sys : question réservée à un système (« CH » : contexte romand, CHF ; « FR » : contexte français, €, ×) ; sans sys,
  // contexte neutre (CHF devient € par frLocal en France). eur / NF : montants et nombres écrits à la française.
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

  /* 27.11 (logo de l'app, demande de l'enseignant) : la pépite du logo tient dans un rectangle d'or (160·φ × 160) et son
     reflet est une spirale d'or (tools/logo/gen_logos.py). Le rectangle est mesuré au dixième de mm sur un autocollant. */
  add({ key: "logo", fam: "enigme", uses: ["decdiv", "rac"], outil: "le rapport de deux longueurs (une division) et le nombre d'or φ = (1 + √5) ÷ 2 ≈ 1,618, la solution positive de φ² = φ + 1.",
    make() {
      const PHI = (1 + Math.sqrt(5)) / 2, h = pk([30, 35, 40, 45, 50, 55, 60]), w = Math.round(h * PHI * 10) / 10;
      const obj = pk(["un autocollant", "la couverture d'un cahier", "un badge", "une affiche de classe"]);
      const inner = typeof LOGO_NUGGET === "string" ? LOGO_NUGGET.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") : "";
      const F = typeof LOGO_PHI === "object" && LOGO_PHI.w ? LOGO_PHI : { x: 142, y: 190, w: 258.885, h: 160, ou: "pepite" }, refl = F.ou === "reflet";
      const lw = N(w).replace("{,}", ",");
      const fig = `<svg viewBox="110 140 380 260" width="300" style="max-width:100%;height:auto" role="img" aria-label="La pépite du logo et un rectangle en pointillés de ${lw} mm sur ${h} mm">${inner}`
        + `<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="9 7"/>`
        + `<text x="${F.x + F.w / 2}" y="${F.y - 10}" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor" stroke="var(--card, #fff)" stroke-width="5" paint-order="stroke">${lw} mm</text>`
        + `<text x="${refl ? F.x - 8 : F.x + F.w + 10}" y="${F.y + F.h / 2 + 6}" text-anchor="${refl ? "end" : "start"}" font-size="17" font-weight="700" fill="currentColor" stroke="var(--card, #fff)" stroke-width="5" paint-order="stroke">${h} mm</text></svg>`;
      return { titre: "Le secret du logo", q: "Le logo de " + APP_NAME + " cache un nombre célèbre. Sur " + obj + (refl ? ", le reflet brillant de la pépite (sa spirale) est tracé exactement dans le rectangle en pointillés : " : ", la pépite tient exactement dans le rectangle en pointillés : ") + T(w, 1) + " mm de large et " + T(h) + " mm de haut.",
        fig,
        bet: { q: "Quel nombre célèbre se cache dans ce rectangle ?", choices: ["π ≈ 3,14", "le nombre d'or ≈ 1,618", "√2 ≈ 1,414 (comme une feuille A4)"], good: 1 },
        calc: { label: "Calcule le rapport largeur ÷ hauteur du rectangle (au centième)", value: Math.round((w / h) * 100) / 100, round: 0.01 },
        reveal: M(N(w, 1) + " \\div " + h + " \\approx " + N(w / h, 3)) + " : c'est le <b>nombre d'or</b> " + M("\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1{,}618") + ". Un rectangle dont la largeur vaut " + M("\\varphi") + " fois la hauteur est un <b>rectangle d'or</b> : si on en retire un carré, il reste un rectangle d'or plus petit. En recommençant, et en traçant un quart de cercle dans chaque carré, on obtient la <b>spirale d'or</b>… regarde bien le reflet de la pépite !" };
    } });
  CURIEUX.forEach((c) => { const n = (id) => NOTIONS.find((x) => x.id === id); c.uses = c.uses.filter(n); });
})();

const Curieux = {
  // Graine → question reproductible (code « cur-<key>-<graine base 36> »).
  build(key, seed) {
    const c = CURIEUX.find((x) => x.key === key); if (!c) return null;
    seed = seed || Math.floor(Math.random() * 46655) + 1;
    R.seed(seed * 7919 + [...key].reduce((a, ch) => a + ch.charCodeAt(0), 0));
    return { ...c.make(), key, fam: c.fam, outil: c.outil, code: "cur-" + key + "-" + seed.toString(36) };
  },
  fromCode(code) { const m = /^cur-([a-z0-9]+)-([a-z0-9]+)$/.exec(code); return m ? this.build(m[1], parseInt(m[2], 36)) : null; },
  // Questions accessibles : toutes les notions utilisées sont déjà vues (ou en cours) ; sans profil, celles de 9e.
  available(state) {
    const sys = (state && state.profile && state.profile.system) || "CH"; /* 26.11 : questions réservées à un système (c.sys) */
    return CURIEUX.filter((c) => (!c.sys || c.sys === sys) && c.uses.every((id) => {
      if (state && state.notions && state.notions[id]) return ["vu", "encours"].includes(state.notions[id].status);
      const n = NOTIONS.find((x) => x.id === id), g = state && state.profile ? state.profile.grade : 9;
      return n && n.CH && n.CH[0] < g;
    }));
  },
  // Choix : jamais une des 8 dernières vues ; familles en alternance.
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
