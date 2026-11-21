// Questions curieuses (21.11, demande de l'auteur : « des questions où le savoir mathématique est plus dissimulé »).
// Une situation de la vie ou un paradoxe : l'élève PARIE d'abord (intuition), puis VÉRIFIE par un calcul, puis on lui
// dit quel outil il a utilisé. Facultatif, sans effet sur le Mathélo. Familles : « Vrai ou arnaque ? » (pourcentages,
// prix, graphiques) et « Ton intuition te trompe ? » (paradoxes). Les suivantes (Fermi, énigmes, quotidien) viendront ici.
// Un élément = { key, fam, uses: [notions nécessaires, déjà vues], outil, make() } ;
// make() rend { titre, q, fig?, bet: { q, choices, good }, calc: { label, value, round?, unit? }, reveal }.
// Valeurs tirées au hasard (graine dans le code « cur-<key>-<graine> »), jamais triviales ; contextes variés.
const CURIEUX = [];
const CUR_FAM = { arnaque: { label: "Vrai ou arnaque ?", ic: "🕵️" }, paradoxe: { label: "Ton intuition te trompe ?", ic: "🤯" } };
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
      const p = pk([10, 20, 25, 50]), P = pk([40, 80, 120, 200, 250]), f = (1 + p / 100) * (1 - p / 100), what = pk([["Une action", "gagne", "perd"], ["Le prix d'un jeu vidéo", "augmente de", "baisse de"], ["Le nombre d'abonnés d'une chaîne", "augmente de", "baisse de"]]);
      const unit = what[0].startsWith("Le nombre") ? "" : " CHF";
      return { titre: "Montagnes russes", q: what[0] + " vaut " + T(P) + unit + ". Lundi, " + (what[0].startsWith("Une") ? "elle" : "il") + " " + what[1] + " " + pc(p) + ". Mardi, " + (what[0].startsWith("Une") ? "elle" : "il") + " " + what[2] + " " + pc(p) + ".",
        bet: { q: "Mardi soir, on est revenu…", choices: ["au-dessus de " + T(P) + unit, "exactement à " + T(P) + unit, "en dessous de " + T(P) + unit], good: 2 },
        calc: { label: "Que vaut-" + (what[0].startsWith("Une") ? "elle" : "il") + " mardi soir ?" + (unit ? " (en CHF)" : ""), value: r6(P * f), round: 0.01 },
        reveal: "Lundi : " + M(N(P) + " \\cdot " + N(1 + p / 100) + " = " + N(P * (1 + p / 100))) + ". Mardi, la baisse de " + p + " % porte sur ce <b>nouveau</b> nombre, plus grand : " + M(N(P * (1 + p / 100)) + " \\cdot " + N(1 - p / 100) + " = " + N(P * f)) + ". Au total ×" + N(f).replace("{,}", ",") + " : on a perdu " + pc(100 - 100 * f) + "." };
    } });
  add({ key: "format", fam: "arnaque", uses: ["prop"], outil: "la proportionnalité : comparer des prix, c'est comparer le prix d'une même quantité (prix au litre).",
    make() {
      const A = pk([1.8, 1.95, 2.1, 2.4]), pl = A / 1.5, k = pk([0.9, 0.94, 1.06, 1.1]), B = Math.round((pl * 1.98 * k) / 0.05) * 0.05, pl2 = B / 1.98, cheap = pl2 < pl ? 1 : 0;
      const drink = pk(["eau gazeuse", "thé froid", "jus de pomme"]);
      return { titre: "Le grand format", q: "Au magasin, le " + drink + " existe en bouteille de " + M("1{,}5\\ \\ell") + " à " + chf(A) + ", ou en pack de " + M("6") + " canettes de " + M("33\\ \\text{cl}") + " à " + chf(B) + ".",
        bet: { q: "Lequel est le moins cher, à quantité égale ?", choices: ["La bouteille de 1,5 l", "Le pack de 6 canettes"], good: cheap },
        calc: { label: "Prix d'un litre avec le pack (en CHF, au centime)", value: r6(pl2), round: 0.01 },
        reveal: "Pack : " + M("6 \\cdot 0{,}33 = 1{,}98\\ \\ell") + ", donc " + M(N(B) + " \\div 1{,}98 \\approx " + N(pl2, 2)) + " CHF le litre. Bouteille : " + M(N(A) + " \\div 1{,}5 = " + N(pl, 2)) + " CHF le litre. " + (cheap ? "Le pack est moins cher." : "La bouteille est moins chère : le « grand » pack n'est pas toujours la bonne affaire.") };
    } });
  add({ key: "promo", fam: "arnaque", uses: ["pct"], outil: "les pourcentages : traduire une offre (« 3 pour 2 ») en réduction, puis comparer.",
    make() {
      const o = pk([["« 3 pour le prix de 2 »", 3, 2], ["« le 2e à moitié prix »", 2, 1.5], ["« 4 pour le prix de 3 »", 4, 3]]), D = pk([20, 25, 30]), eff = r6(100 - (100 * o[2]) / o[1]);
      const good = Math.abs(eff - D) < 1e-9 ? 2 : eff > D ? 0 : 1, it = pk(["pots de confiture", "paquets de pâtes", "cahiers", "tubes de dentifrice"]);
      return { titre: "Quelle offre choisir ?", q: "Tu veux acheter " + M(o[1]) + " " + it + " identiques. Deux magasins : l'un fait " + o[0] + ", l'autre " + pc(D) + " sur chaque article (même prix de départ).",
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
        calc: { label: "Aire de la grande pizza (en cm², à l'unité)", value: Math.round(A1), round: 1 },
        reveal: "Grande : " + M("\\pi \\cdot " + D / 2 + "^2 \\approx " + N(A1, 0)) + " cm². Deux petites : " + M("2 \\cdot \\pi \\cdot " + d / 2 + "^2 \\approx " + N(A2, 0)) + " cm². " + (A1 > A2 ? "La grande gagne, alors que " + M("2 \\cdot " + d + " = " + 2 * d) + " cm semble bien plus que " + D + " cm : l'aire dépend du <b>carré</b> du rayon." : "Les deux petites gagnent, de peu : l'aire dépend du <b>carré</b> du rayon, il faut calculer.") };
    } });
  add({ key: "credit", fam: "arnaque", uses: ["pct"], outil: "le calcul du coût total et le pourcentage d'augmentation : « seulement … par mois » cache souvent un supplément.",
    make() {
      const P = pk([799, 899, 999, 1199]), n = pk([24, 36]), f = pk([1.12, 1.18, 1.25]), m = Math.ceil((P * f) / n), tot = m * n, plus = ((tot - P) / P) * 100;
      const obj = pk(["Un téléphone", "Un ordinateur portable", "Une console et deux jeux"]);
      return { titre: "« Seulement … par mois »", q: obj + " coûte " + chf(P) + " comptant. La pub propose : « Seulement " + chf(m) + " par mois pendant " + n + " mois ! »",
        bet: { q: "Au total, avec les mensualités, tu paies…", choices: ["à peu près le même prix", "un peu plus (moins de 5 % de plus)", "nettement plus (plus de 10 % de plus)"], good: 2 },
        calc: { label: "Combien paies-tu en tout ? (en CHF)", value: tot },
        reveal: M(m + " \\cdot " + n + " = " + N(tot)) + " CHF, soit " + M(N(tot - P)) + " CHF de plus que le prix comptant : " + pc(plus, 1) + " de plus." };
    } });
  add({ key: "tva", fam: "arnaque", uses: ["pct"], outil: "les pourcentages : retrouver le prix avant une hausse, c'est diviser par 1,081, pas enlever 8,1 %.",
    make() {
      const HT = pk([200, 250, 400, 600, 1200]), TTC = r6(HT * 1.081), wrong = r6(TTC * 0.919);
      return { titre: "Le prix hors taxe", q: "En Suisse, la TVA est de " + pc(8.1) + " : le prix TTC est le prix hors taxe augmenté de 8,1 %. Un vendeur affiche " + chf(TTC) + " TTC et dit : « Pour le prix hors taxe, j'enlève 8,1 % : " + chf(wrong) + ". »",
        bet: { q: "A-t-il raison ?", choices: ["Oui, c'est le bon prix hors taxe", "Non, le vrai prix hors taxe est un peu plus élevé", "Non, le vrai prix hors taxe est un peu plus bas"], good: 1 },
        calc: { label: "Quel est le vrai prix hors taxe ? (en CHF)", value: HT, round: 0.01 },
        reveal: "TTC = HT · 1,081, donc HT = " + M(N(TTC) + " \\div 1{,}081 = " + N(HT)) + " CHF. Les 8,1 % se calculent sur le prix hors taxe, plus petit : enlever 8,1 % du prix TTC enlève trop (" + chf(r6(TTC - wrong)) + " au lieu de " + chf(r6(TTC - HT)) + ")." };
    } });
  add({ key: "points", fam: "arnaque", uses: ["pct"], outil: "la différence entre « points de pourcentage » et pourcentage d'augmentation.",
    make() {
      const t1 = pk([2, 4, 5]), d = pk([1, 2]), t2 = t1 + d, rel = (d / t1) * 100, what = pk(["Le taux d'intérêt de ton compte épargne", "Le taux de chômage d'une région", "La part d'élèves qui viennent à vélo"]);
      return { titre: "Le titre du journal", q: what + " passe de " + pc(t1) + " à " + pc(t2) + ". Le journal titre : « Hausse de " + d + " % ! »",
        bet: { q: "Ce titre décrit-il bien la hausse ?", choices: ["Oui, c'est une hausse de " + d + " %", "Non : en proportion, la hausse est bien plus forte", "Non : la hausse est plus faible"], good: 1 },
        calc: { label: "De combien de % a-t-il augmenté, par rapport à sa valeur de départ ?", value: rel },
        reveal: "Il a gagné " + d + " <b>point" + (d > 1 ? "s" : "") + "</b> de pourcentage. Mais par rapport au départ : " + M("\\frac{" + d + "}{" + t1 + "} = " + N(d / t1)) + ", soit une hausse de " + pc(rel) + ". Les deux phrases sont différentes ; les journaux les confondent souvent." };
    } });
  add({ key: "gratuit", fam: "arnaque", uses: ["pct"], outil: "la proportionnalité et les pourcentages : « +50 % gratuit » baisse le prix unitaire de 33,3 %, pas de 50 %.",
    make() {
      const [b, red] = pk([[25, 20], [50, 100 / 3], [100, 50]]), D = pk(b === 50 ? [30, 35, 40] : b === 25 ? [20, 25, 30] : [40, 45, 50]), good = Math.abs(red - D) < 1e-9 ? 2 : red > D ? 0 : 1;
      const it = pk(["paquet de céréales", "flacon de gel douche", "sachet de bonbons"]);
      return { titre: "Plus de produit ou moins cher ?", q: "Deux offres pour le même " + it + " : « " + pc(b) + " de produit gratuit » (même prix, plus de contenu), ou « " + pc(D) + " sur le prix ».",
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
      const t = pk([1.5, 1.6, 1.7, 1.8]), d = 2 * Math.PI * t;
      return { titre: "La tête ou les pieds ?", q: "Imagine que tu fasses le tour de la Terre à pied, le long de l'équateur. Tu mesures " + M(N(t) + "\\ \\text{m}") + ".",
        bet: { q: "Qui parcourt la plus grande distance ?", choices: ["Tes pieds", "Ta tête, de quelques millimètres", "Ta tête, de plusieurs mètres", "Les deux, exactement autant"], good: 2 },
        calc: { label: "De combien de mètres la tête parcourt-elle plus que les pieds ? (au dixième)", value: Math.round(d * 10) / 10, round: 0.1 },
        reveal: "Les pieds décrivent un cercle de rayon " + M("r") + ", la tête un cercle de rayon " + M("r + " + N(t)) + ". Différence : " + M("2\\pi (r + " + N(t) + ") - 2\\pi r = 2\\pi \\cdot " + N(t) + " \\approx " + N(d, 1)) + " m. Encore une fois, le rayon de la Terre a disparu du calcul." };
    } });
  add({ key: "vmoy", fam: "paradoxe", uses: ["vitesse"], outil: "la vitesse moyenne : distance totale ÷ durée totale (et non la moyenne des deux vitesses).",
    make() {
      const [v1, v2, d] = pk([[60, 40, 120], [30, 60, 60], [60, 90, 180], [40, 120, 120], [50, 75, 150], [80, 120, 240]]), t1 = d / v1, t2 = d / v2, vm = (2 * d) / (t1 + t2), veh = pk(["en voiture", "en scooter", "en bus"]);
      return { titre: "L'aller et le retour", q: "Tu fais " + M(d + "\\ \\text{km}") + " " + veh + " à " + M(v1 + "\\ \\text{km/h}") + " de moyenne, puis le même trajet au retour à " + M(v2 + "\\ \\text{km/h}") + ".",
        bet: { q: "Ta vitesse moyenne sur l'aller-retour est…", choices: ["exactement " + (v1 + v2) / 2 + " km/h", "moins de " + (v1 + v2) / 2 + " km/h", "plus de " + (v1 + v2) / 2 + " km/h"], good: 1 },
        calc: { label: "Calcule ta vitesse moyenne (en km/h)", value: vm },
        reveal: "Aller : " + M(d + " \\div " + v1 + " = " + N(t1)) + " h ; retour : " + M(d + " \\div " + v2 + " = " + N(t2)) + " h. Vitesse moyenne : " + M(2 * d + " \\div " + N(t1 + t2) + " = " + N(vm)) + " km/h. Tu passes plus de temps à la vitesse lente : elle pèse plus dans la moyenne." };
    } });
  add({ key: "patates", fam: "paradoxe", uses: ["pct"], outil: "les pourcentages : ce qui ne change pas (la matière sèche) sert de point d'appui.",
    make() {
      const m = pk([50, 100, 200]), [w1, w2] = pk([[99, 98], [99, 97], [98, 96], [99, 96]]), dry = (m * (100 - w1)) / 100, F = dry / ((100 - w2) / 100), food = pk(["pommes de terre", "concombres", "pastèques"]);
      return { titre: "Les " + food + " qui sèchent", q: "Tu as " + M(m + "\\ \\text{kg}") + " de " + food + ", faites à " + pc(w1) + " d'eau. Tu les laisses sécher au soleil, et maintenant elles sont faites à " + pc(w2) + " d'eau.",
        bet: { q: "Combien pèsent-elles maintenant ?", choices: ["Presque pareil (un peu moins de " + m + " kg)", "Environ les trois quarts", "Beaucoup moins : la moitié ou moins"], good: 2 },
        calc: { label: "Leur masse maintenant (en kg)", value: r6(F) },
        reveal: "La matière sèche ne s'évapore pas : " + pc(100 - w1) + " de " + m + " kg = " + M(N(dry)) + " kg. Maintenant, elle représente " + pc(100 - w2) + " de la masse : " + M(N(dry) + " \\div " + N((100 - w2) / 100) + " = " + N(F)) + " kg. La part sèche a été multipliée par " + N((100 - w2) / (100 - w1)) + " : la masse est divisée d'autant." };
    } });
  add({ key: "monty", fam: "paradoxe", uses: ["proba"], outil: "les probabilités : ton premier choix a 1 chance sur 3 d'être bon ; l'animateur, qui sait, ne change pas cela.",
    make() {
      const c = pk([["portes", "une voiture", "des chèvres", "ouvre", "une chèvre"], ["gobelets", "une bille", "rien", "soulève", "rien du tout"], ["boîtes", "un billet de concert", "des chaussettes", "ouvre", "des chaussettes"]]);
      return { titre: "Garder ou changer ?", q: "Il y a 3 " + c[0] + " : derrière l'une se trouve " + c[1] + ", derrière les deux autres " + c[2] + ". Tu en choisis une. L'animateur, qui sait où est le lot, " + c[3] + " une des deux autres, qui cache " + c[4] + ". Il te propose de changer pour la dernière.",
        bet: { q: "Que fais-tu ?", choices: ["Je garde mon choix", "Je change", "C'est pareil : une chance sur deux"], good: 1 },
        calc: { label: "Probabilité de gagner si tu changes (fraction)", value: 2 / 3 },
        reveal: "Ton premier choix est bon dans 1 cas sur 3 : alors changer fait perdre. Dans les 2 autres cas, tu as choisi un mauvais " + c[0].replace(/s$/, "") + ", l'animateur est <b>obligé</b> de montrer l'autre mauvais, et changer fait gagner. Donc " + M("P(\\text{gagner en changeant}) = \\frac{2}{3}") + ". Fais l'essai avec 3 cartes et un ami : sur 30 parties, tu verras." };
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
      const k = pk([2, 3]), a = pk([2, 3, 4, 5]), obj = pk(["un cube de chocolat", "un aquarium cubique", "un dé géant"]);
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
    return CURIEUX.filter((c) => c.uses.every((id) => {
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
