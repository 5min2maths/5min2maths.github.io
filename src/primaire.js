/* 27.11 (agent primaire ; décision de l'enseignant du 27.11 : « retravailler primaire si nécessaire ») · Automatismes de fin
   de primaire (PER cycle 2, fin de 8P : MSN 22 à 25, progression des apprentissages 7e–8e, extrait officiel de l'ECR
   vaudoise 8P 2023, p. 4) pour les élèves de 9e (CO) en GRANDE DIFFICULTÉ seulement. Rapport : tools/primaire_9e.md.
   - 8 notions « niveau primaire » (CH: [8], prim: true) : hors du catalogue (Engine.catalog les écarte), jamais dans
     « Mes notions », le positionnement ni les créneaux ordinaires ; statut « prim » (Engine.eligible les ignore).
   - Branchement (PRIM.inject, appelé par le petit relais de la fin de src/engine.js) : profil CH, 9e, hors MP,
     Engine.struggling vrai, réussite récente ≤ 40 % et Mathélo ≤ 875 ; seulement le prérequis (PRIM_PRE) d'une notion de
     9e ratée ; au plus 1 question par séance (2 si Engine.underFloor et 4 questions ou plus), à la place des dernières.
   - Libellé à l'écran : « 🔙 Rappel », comme les autres notions anciennes (Engine.isRecent rend false) ; jamais
     « primaire » ni « 8P » (libellés, leçons et énoncés n'en parlent pas).
   - Sortie : une notion est reprise (plus servie) après 2 réussites du premier coup sans échec entre deux (box ≥ 2 du
     moteur) ; tout s'arrête dès que l'élève n'est plus en grande difficulté (réussite récente ≥ 55 %).
   Contextes d'élèves de 12–13 ans (sport, concerts, abonnements, transports, jeux), profil romand (·, CHF, 10'000).
   Contrôles : tests/primaire.html (service, oracle), tests/vraisemblance.html. Paquet 9 (build.py). */
const PRIM_IDS = ["p8tables", "p8calcadd", "p8dizaines", "p8diveucl", "p8droite", "p8fracpart", "p8conv", "p8probop"];
/* Notion de 9e → automatismes de fin de primaire qui en sont le prérequis (ordre de préférence). Pas dans PREREQ (src/engine.js) :
   la remédiation et le mode libre (élève « fragile ») y puisent sans tester la grande difficulté. */
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
  const T = (v) => nb(v); /* nombre en TeX : virgule, 10'000 */
  const C = (v) => M(chf(v)) + " CHF"; /* montant : 7,35 CHF */
  const cd = (a, b) => a + " \\cdot " + b;
  const u = (s) => "\\ \\text{" + s + "}";
  /* nombre en texte simple (figures) : 3,5 ; 12'000 */
  const S = (v) => { const [i, f] = String(+(+v).toFixed(6)).split("."); return (Math.abs(+i) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : i) + (f ? "," + f : ""); };
  const P12 = (v) => +(+v).toPrecision(12); /* réponse exacte (1/3 reste 1/3 à 1e-12 près ; le moteur compare à 1e-9) */
  const Q = (q, v, sol, guide, traps, o) => QV(q, P12(v), sol, Object.assign({ guide, traps: traps || [] }, o || {}));
  const G = (ask, v, sol) => GS(ask, P12(v), sol);
  const X = (v, m) => TRAP(P12(v), m);

  /* ---------- droite graduée (figure) : n intervalles de x0 = 38 à x1 = 282 ; étiquettes [rang, texte] ; point A au rang k (ou à une
     position fractionnaire pos ∈ [0 ; n]). ---------- */
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

/* ---------- Branchement (appelé par le relais de la fin de src/engine.js ; Engine existe au moment de l'appel) ----------
   Seuils (simulation tests/_faibles.html, 20 graines, tools/primaire_9e.md) : Engine.struggling seul servait aussi l'élève
   moyen en mauvaise passe (45 % de ses séances) ; d'où deux conditions de plus, qui écartent moyens, forts et irréguliers :
   réussite du premier coup ≤ 40 % sur les 8 à 16 dernières réponses ET Mathélo ≤ 875 (75 points sous le départ d'un élève
   moyen de 9e). Niveau 1 seulement (le niveau 2 après une réussite faisait moins de réussites, sans gain). */
const PRIM = {
  off: false, /* simulation avant / après (tests/_faibles.html, variante sansprim) */
  RATE: 0.4, ELO: 875, ELO2: 925, ACQ: 2, /* ELO2 (27.11, revue n° 3) : plafond quand la condition de Mathélo est levée */ /* notion reprise : 2 réussites du premier coup sans échec entre deux (box du moteur) */
  isPrim(id) { return PRIM_IDS.includes(String(id).split("|")[0]); },
  /* 27.11 (revue des élèves joués, n° 3 : Kevin, 9e très faible, « primaire : applique false » à chaque séance en 3 et en
     6 jours ; Mathélo 880 à 899, au-dessus du seuil 875 ; réussite récente « null » tant qu'il n'y a pas 8 réponses, donc
     jusqu'au jour 3) : (a) réussite lue dès 5 réponses ; avant, l'élève dont le positionnement s'est arrêté sur 3 ratés
     (placeMiss) et qui ne réussit pas plus d'une fois sur deux depuis ; (b) seuil de Mathélo porté de 875 à 925 (ELO2) dans ce
     cas (positionnement arrêté sur 3 ratés), sous le plancher (Engine.underFloor) ou en grande difficulté au départ de 2
     jours de séance (PRIM.note, state.strugDays). L'élève moyen
     en mauvaise passe reste écarté par la réussite ≤ 40 % ET (Mathélo ≤ 875 ou 2 jours en grande difficulté) :
     tests/_faibles.html, colonne « séances avec prim. » des moyens, inchangée. */
  applies(state) {
    const p = state && state.profile;
    if (PRIM.off || !p || p.system !== "CH" || p.grade !== 9 || p.track === "mp" || !Engine.struggling(state)) return false;
    const L = state.last1 || [], r = L.length ? L.reduce((a, b) => a + b, 0) / L.length : null;
    const early = L.length < 5 && (state.placeMiss || 0) >= 3, rateOk = early ? r === null || r <= 0.5 : L.length >= 5 && r <= PRIM.RATE;
    return rateOk && (state.elo.r <= PRIM.ELO || (state.elo.r <= PRIM.ELO2 && (early || Engine.underFloor(state) || PRIM.strugLong(state))));
  },
  /* jours (7 derniers) où l'élève était en grande difficulté au départ d'une séance ; 2 au moins = « depuis 2 séances » */
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
  /* candidats : prérequis des notions de 9e ratées (maîtrise < 0,45 ou deux échecs ; la plus ratée d'abord) ; jamais une notion reprise ;
     pas deux séances de suite la même notion si une autre convient */
  candidates(state) {
    const coince = (s) => !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2), out = [];
    const failing = Object.keys(PRIM_PRE).filter((id) => coince(state.notions[id])).sort((a, b) => state.notions[a].m - state.notions[b].m);
    for (const id of failing) for (const p of PRIM_PRE[id]) if (!out.includes(p) && !PRIM.acquired(state, p)) out.push(p);
    const last = state.primLast || [];
    return [...out.filter((p) => !last.includes(p)), ...out.filter((p) => last.includes(p))];
  },
  strip(plan) { if (!Array.isArray(plan)) return plan; const out = plan.filter((e) => !PRIM.isPrim(e)); for (const k of Object.keys(plan)) if (isNaN(+k)) out[k] = plan[k]; return out; },
  /* remplace la ou les dernières questions prévues (la séance garde sa durée ; elle finit plus souvent sur une réussite) ; 2 seulement
     sous le plancher (Engine.underFloor) et pour une séance de 4 questions ou plus ; garde le type du créneau (automatisme : notion
     qui en fournit, Engine.drillable ; défi → application) ; toujours au niveau 1 */
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
  /* 27.11 (revue des élèves joués, n° 2, grave : Kevin, 9e très faible sans chapitre « en classe », 18 questions sur 27 sur
     la même notion, série de 4 automatismes 4 fois decread : la limite de 2 par séance se levait faute d'autre notion, les
     autres notions ouvertes de 9e attendant leur leçon). Avant de lever la limite : 3e occurrence et suivantes d'une même
     notion remplacées par un automatisme de fin de primaire qui en est le prérequis (ou celui d'une notion ratée), au
     niveau 1, même créneau. Élève visé par les rappels de primaire seulement (PRIM.applies) ; sinon plan inchangé. */
  vary(state, plan) {
    const p = state && state.profile;
    if (!Array.isArray(plan) || plan.length < 3 || !PRIM.applies(state)) return plan;
    const idOf = (e) => String(e).split("|")[0], cnt = {};
    for (let i = 0; i < plan.length; i++) {
      const e = String(plan[i]), id = idOf(e), kind = e.split("|")[2];
      if (e.startsWith("PROB:") || PRIM.isPrim(id)) continue;
      cnt[id] = (cnt[id] || 0) + 1;
      if (cnt[id] <= 2) continue;
      /* prérequis de la notion répétée, puis ceux des notions ratées, puis tout automatisme de fin de primaire pas encore repris ;
         sans aucun : la question est retirée (séance plus courte plutôt qu'une 3e fois la même notion) */
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
