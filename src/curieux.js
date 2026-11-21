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
      const p = pk([10, 20, 25, 50]), P = pk([40, 80, 120, 200, 250]), f = (1 + p / 100) * (1 - p / 100), what = pk([["Une action", "gagne", "perd", "elle"], ["Un jeu vidéo", "augmente de", "baisse de", "il"], ["Un vélo électrique", "augmente de", "baisse de", "il"]]);
      const unit = " CHF";
      return { titre: "Montagnes russes", q: what[0] + (what[3] === "elle" ? " vaut " : " coûte ") + T(P) + unit + ". Lundi, son prix " + what[1] + " " + pc(p) + ". Mardi, il " + what[2] + " " + pc(p) + ".",
        bet: { q: "Mardi soir, on est revenu…", choices: ["au-dessus de " + T(P) + unit, "exactement à " + T(P) + unit, "en dessous de " + T(P) + unit], good: 2 },
        calc: { label: "Que vaut-" + what[3] + " mardi soir ? (en CHF)", value: r6(P * f), round: 0.01 },
        reveal: "Lundi : " + M(N(P) + " \\cdot " + N(1 + p / 100) + " = " + N(P * (1 + p / 100))) + ". Mardi, la baisse de " + p + " % porte sur ce <b>nouveau</b> nombre, plus grand : " + M(N(P * (1 + p / 100)) + " \\cdot " + N(1 - p / 100) + " = " + N(P * f)) + ". Au total ×" + N(f).replace("{,}", ",") + " : on a perdu " + pc(100 - 100 * f) + "." };
    } });
  add({ key: "format", fam: "arnaque", uses: ["prop"], outil: "la proportionnalité : comparer des prix, c'est comparer le prix d'une même quantité (prix au litre).",
    make() {
      const A = pk([1.8, 1.95, 2.1, 2.4]), pl = A / 1.5, k = pk([0.9, 0.94, 1.06, 1.1]), B = Math.round((pl * 1.98 * k) / 0.05) * 0.05, pl2 = B / 1.98, cheap = pl2 < pl ? 1 : 0;
      const drink = pk(["l'eau gazeuse", "le thé froid", "le jus de pomme"]);
      return { titre: "Le grand format", q: "Au magasin, " + drink + " existe en bouteille de " + M("1{,}5\\ \\ell") + " à " + chf(A) + ", ou en pack de " + M("6") + " canettes de " + M("33\\ \\text{cl}") + " à " + chf(B) + ".",
        bet: { q: "Lequel est le moins cher, à quantité égale ?", choices: ["La bouteille de 1,5 l", "Le pack de 6 canettes"], good: cheap },
        calc: { label: "Prix d'un litre avec le pack (en CHF, au centime)", value: r6(pl2), round: 0.01 },
        reveal: "Pack : " + M("6 \\cdot 0{,}33 = 1{,}98\\ \\ell") + ", donc " + M(N(B) + " \\div 1{,}98 \\approx " + N(pl2, 2)) + " CHF le litre. Bouteille : " + M(N(A) + " \\div 1{,}5 = " + N(pl, 2)) + " CHF le litre. " + (cheap ? "Le pack est moins cher." : "La bouteille est moins chère : le « grand » pack n'est pas toujours la bonne affaire.") };
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
        calc: { label: "Aire de la grande pizza (en cm², à l'unité)", value: Math.round(A1), round: 1 },
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
      return { titre: "Plus de produit ou moins cher ?", q: "Deux offres pour le même " + it + " : « +" + pc(b) + " de produit gratuit » (même prix, plus de contenu), ou « " + pc(D) + " sur le prix ».",
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
  add({ key: "leman", fam: "fermi", uses: ["decdiv"], outil: "la division et les conversions de longueurs (km → m).",
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
      return { titre: "L'eau de la douche", q: "Une douche coule environ " + M(deb + "\\ \\ell") + " par minute. Tu prends chaque jour une douche de " + M(m + "\\ \\text{min}") + ".",
        bet: { q: "En une année, cela fait combien de baignoires pleines (" + bain + " l) ?", choices: ["moins de 10", "entre 10 et 50", "entre 50 et 500", "plus de 500"], good: v / bain < 10 ? 0 : v / bain < 50 ? 1 : v / bain < 500 ? 2 : 3 },
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
      const ab = 190, t = pk([18.4, 22, 26.8, 31.6, 41.2]), save = t / 2, v = Math.ceil(ab / save), trip = pk(["un aller-retour chez ta grand-mère", "un aller-retour pour ton entraînement", "un aller-retour pour voir des amis"]);
      return { titre: "L'abonnement demi-tarif", q: "Un abonnement demi-tarif coûte " + chf(ab) + " par an : avec lui, chaque billet coûte la moitié. Plein tarif, " + trip + " coûte " + chf(t) + ".",
        bet: { q: "Combien d'allers-retours faut-il pour qu'il soit rentable ?", choices: ["moins de 10", "entre 10 et 20", "plus de 20"], good: v < 10 ? 0 : v <= 20 ? 1 : 2 },
        calc: { label: "Nombre minimum d'allers-retours pour rentabiliser l'abonnement", value: v },
        reveal: "Chaque aller-retour fait économiser " + M(N(t) + " \\div 2 = " + N(save)) + " CHF. " + M("190 \\div " + N(save) + " \\approx " + N(ab / save, 2)) + " : il faut " + M(v) + " allers-retours (on arrondit vers le haut)." };
    } });
  add({ key: "essence", fam: "quotidien", uses: ["prop"], outil: "la proportionnalité : la consommation est donnée pour 100 km.",
    make() {
      const c = pk([5.5, 6.5, 7]), d = pk([160, 240, 280, 320]), pr = pk([1.8, 1.85, 1.9]), v = (c * d / 100) * pr, tr = pk([25, 35, 45]);
      return { titre: "Voiture ou train ?", q: "Une voiture consomme " + M(N(c) + "\\ \\ell") + " d'essence aux 100 km. Le trajet aller fait " + M(d + "\\ \\text{km}") + ", l'essence coûte " + chf(pr) + " le litre. En train, le billet aller coûte " + chf(tr) + " par personne.",
        bet: { q: "À quatre, l'essence de la voiture revient-elle moins cher que quatre billets de train ?", choices: ["Oui", "Non"], good: v < 4 * tr ? 0 : 1 },
        calc: { label: "Prix de l'essence pour ce trajet aller (en CHF, au centime)", value: r6(v), round: 0.01 },
        reveal: "Litres : " + M(N(c) + " \\cdot " + d + " \\div 100 = " + N(c * d / 100)) + ". Prix : " + M(N(c * d / 100) + " \\cdot " + N(pr) + " \\approx " + N(v, 2)) + " CHF, contre " + M("4 \\cdot " + tr + " = " + 4 * tr) + " CHF en train. (Sans compter l'usure, le parking… ni le climat.)" };
    } });
  add({ key: "ecran", fam: "quotidien", uses: ["pyth"], outil: "le théorème de Pythagore : la taille d'un écran est sa diagonale.",
    make() {
      const inch = pk([43, 50, 55, 65]), dcm = inch * 2.54, w = dcm * 16 / Math.sqrt(337), meuble = Math.round(w / 10) * 10 + pk([-5, 5]);
      return { titre: "L'écran dans le meuble", q: "Un écran de " + M(inch) + " pouces, au format 16:9 (un pouce vaut " + M("2{,}54\\ \\text{cm}") + ") : la largeur et la hauteur sont dans le rapport 16 pour 9. La « taille » d'un écran, c'est sa <b>diagonale</b>. Ton meuble mesure " + M(meuble + "\\ \\text{cm}") + " de large.",
        bet: { q: "L'écran rentre-t-il dans le meuble ?", choices: ["Oui", "Non"], good: w <= meuble ? 0 : 1 },
        calc: { label: "Largeur de l'écran (en cm, au dixième)", value: Math.round(w * 10) / 10, round: 0.1 },
        reveal: "Diagonale : " + M(inch + " \\cdot 2{,}54 = " + N(dcm, 2)) + " cm. Avec une largeur de " + M("16k") + " et une hauteur de " + M("9k") + " : " + M("(16k)^2 + (9k)^2 = " + N(dcm, 2) + "^2") + ", donc " + M("k = " + N(dcm, 2) + " \\div \\sqrt{337} \\approx " + N(dcm / Math.sqrt(337), 3)) + " et la largeur vaut " + M("16k \\approx " + N(w, 1)) + " cm." };
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
