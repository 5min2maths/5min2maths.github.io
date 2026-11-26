// ===================== 25.11 : défis (niveau 4) propres à la 9e =====================
// Audit de niveau 9e–10e (tools/niveau_910.md, point 7) : pour 21 notions de 9e, le niveau 4 reprenait les formes du
// niveau 3 (« = N3 »). Ici, un vrai problème par notion, en 2 ou 3 étapes qui s'enchaînent, valeurs tirées au hasard,
// au programme de 9e (plan de cheminement genevois : pas de produit de relatifs, pas d'aires agrandies, pas de littéral).
// Proposés en 9e et en 10e (co: [9, 10] ; 25.11 : savoir refaire ce qui est d'avant tant que ce n'est pas trivial) ;
// ailleurs, Engine.make les écarte (horsCO). Chargé après variantes.js (PROBX).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick;
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const [i, f] = String(r6(v)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const X = (v) => M(N(v));
  const PX = (id, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), { co: [9, 10] })); };
  /* parts : [libellé, valeur, arrondi facultatif (0.1, 0.01…)] */
  const PB = (q, parts, hints, sol) => ({ q, hints, sol,
    parts: parts.map(([label, value, rd]) => ({ label, spec: Object.assign({ kind: "value", value: r6(value) }, rd ? { round: rd } : {}) })) });
  const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => (a * b) / gcd(a, b);
  /* 26.11 soir (agent defisch) : contexte du défi (tag ctx, anti-répétition) ; prénoms sans voyelle initiale (pas d'élision à gérer) */
  const CX = (cx, q) => Object.assign(q, { ctx: cx });
  const who = () => pk(["Lina", "Mia", "Zoé", "Nora", "Léa"]);

  // ---------- Nombres ----------
  PX("decread", () => {
    /* 26.11 soir (agent defisch) : 3 contextes (énigme, décomposition avec retenue, chronomètre) */
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
    /* 26.11 soir (agent defisch) : sprint, colis (le plus lourd), épaisseurs au micromètre */
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
  /* 26.11 soir (agent defis3) : dec10, pow9, aire1 : 3 contextes chacun (avant : un seul contexte). */
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

  // ---------- Grandeurs et mesures ----------
  PX("ulong", () => {
    /* 26.11 soir (agent defisch) : ficelle (masse), planche (chutes), ruban (rouleaux pour des cadeaux) */
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
    /* 26.11 soir (agent defisch) : carrelage, terrasse (dalles de 40 cm, prix), planche de timbres (mm et cm²) */
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
    /* 26.11 soir (agent defisch) : aquarium, récupérateur d'eau de pluie (arrosoirs), piscine hors-sol (m³, débit du tuyau) */
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

  // ---------- Géométrie ----------
  PX("angtype", () => {
    /* 26.11 soir (agent defisch) : horloge, gâteau partagé (angle obtus), rose des vents */
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
    /* 26.11 soir (agent defisch) : rectangle, enclos le long d'un mur (prix de la clôture), fil de fer (carré, triangle, hexagone) */
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
    /* 26.11 soir (agent defisch) : parallélogramme, voile triangulaire (tissu), cerf-volant en losange */
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
    /* 26.11 soir (agent defisch) : jardin et allée (gravier), piscine et bordure de dalles, photo et passe-partout */
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
    /* 26.11 soir (agent defisch) : boîte sans couvercle, carton de déménagement (fermé), jardinière (sacs de terreau) */
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

  // ---------- Fractions ----------
  PX("fracrep", () => {
    /* 26.11 soir (agent defisch) : tartes, sentier de randonnée, gourdes */
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
    /* 26.11 soir (agent defisch) : fraction nue, matchs gagnés (à ce rythme), sondage (même proportion dans l'école) */
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
    /* 26.11 soir (agent defisch) : classe (sport, musique), argent de poche, sachet de bonbons */
    const cx = pk(["classe", "argent", "bonbons"]);
    let n, a, b, c, d, f, r, mu; do { [a, b] = pk([[2, 3], [3, 4], [2, 5], [3, 5], [1, 3], [1, 4]]); [c, d] = pk([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]); n = pk(cx === "argent" ? [60, 72, 90, 120, 150] : cx === "bonbons" ? [24, 30, 36, 40, 48, 60] : [18, 20, 24, 28, 30]); /* 26.11 (vraisemblance) : pas de classe de 36 élèves */ f = (n * a) / b; r = n - f; mu = (r * c) / d; } while (!Number.isInteger(f) || !Number.isInteger(mu) || mu === 0 || r - mu === 0);
    const F1 = M("\\frac{" + a + "}{" + b + "}"), F2 = M("\\frac{" + c + "}{" + d + "}");
    const [q, la, lb, lc, u] = cx === "argent" ? [who() + " a " + X(n) + " CHF d'argent de poche. Elle dépense " + F1 + " de cette somme pour un billet de concert, puis " + F2 + " de ce qui lui reste pour un livre.", "a) Prix du billet de concert, en CHF", "b) Prix du livre, en CHF", "c) Somme qui lui reste à la fin, en CHF", " CHF"]
      : cx === "bonbons" ? ["Un sachet contient " + X(n) + " bonbons. " + F1 + " sont à la fraise. Parmi les autres, " + F2 + " sont au citron, et le reste à la menthe.", "a) Combien de bonbons à la fraise ?", "b) Combien de bonbons au citron ?", "c) Combien de bonbons à la menthe ?", ""]
      : ["Dans une classe de " + X(n) + " élèves, " + F1 + " font du football. Parmi les autres, " + F2 + " font de la musique.", "a) Combien d'élèves font du football ?", "b) Combien d'élèves font de la musique ?", "c) Combien d'élèves ne font ni l'un ni l'autre ?", ""];
    return CX(cx, PB(q, [[la, f], [lb, mu], [lc, r - mu]],
      ["Fraction d'une quantité : divise par le dénominateur, multiplie par le numérateur.", "b) Attention : la deuxième fraction porte sur ce qui reste, pas sur le total."],
      "a) " + M(n + " \\div " + b + " \\cdot " + a + " = " + f) + u + ". Reste : " + M(n + " - " + f + " = " + r) + u + ". b) " + M(r + " \\div " + d + " \\cdot " + c + " = " + mu) + u + ". c) " + M(r + " - " + mu + " = " + (r - mu)) + u + "."));
  });

  // ---------- Proportionnalité ----------
  PX("proptab", () => {
    /* 26.11 soir (agent defisch) : cerises au marché, essence à la pompe, fromage à la coupe (g et kg) */
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
    /* 26.11 soir (agent defisch) : recette, sirop (litres de boisson), mur de briques */
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
    /* 26.11 soir (agent defisch) : euros, livres sterling (Londres), dollars (New York) */
    const cx = pk(["euro", "livre", "dollar"]);
    const [r, nom, pl, lieu] = cx === "livre" ? [pk([1.08, 1.12, 1.15]), "1 livre sterling", "livres", "Londres"] : cx === "dollar" ? [pk([0.84, 0.88, 0.91]), "1 dollar", "dollars", "New York"] : [pk([0.94, 0.95, 0.96]), "1 euro", "euros", "Barcelone"];
    const e1 = pk([150, 240, 320, 450]), c2 = pk([200, 300, 500]), z = pk([35, 45, 60]), r2 = r6(r - pk([0.02, 0.03])), b2 = Math.round((c2 / r) * 100) / 100;
    return CX(cx, PB("Avant un voyage à " + lieu + ", " + nom + " vaut " + X(r) + " CHF à la banque.",
      [["a) Combien coûtent " + X(e1) + " " + pl + ", en CHF ?", r6(e1 * r), 0.01], ["b) Somme obtenue en " + pl + " pour " + X(c2) + " CHF (arrondie au centime)", b2, 0.01], ["c) Au retour, il reste " + X(z) + " " + pl + ", que la banque rachète à " + X(r2) + " CHF l'unité. Combien de CHF reçoit-on ?", r6(z * r2), 0.01]],
      ["Des " + pl + " vers le franc : multiplie par le taux.", "Du franc vers les " + pl + " : divise par le taux."],
      "a) " + M(e1 + " \\cdot " + N(r) + " = " + N(r6(e1 * r))) + " CHF. b) " + M(c2 + " \\div " + N(r) + " \\approx " + N(b2)) + " " + pl + ". c) " + M(z + " \\cdot " + N(r2) + " = " + N(r6(z * r2))) + " CHF."));
  });
  PX("agrand", () => {
    /* 26.11 soir (agent defisch) : photo, photocopie (pourcentage), logo imprimé sur un t-shirt (mm) */
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
