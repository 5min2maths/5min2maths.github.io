// 25.11 · Couverture du programme français (tools/france_couverture.md, branche agent/frcouv). Chargé en dernier du paquet
// « fr » (après fr_college.js et les notions françaises créées le 25.11 : fr_1re.js, fr_3e.js, fr_tle.js).
//  1. rattache aux classes françaises les notions suisses récentes dont l'attendu est le même (dérivation de la 3e du
//     Collège → 1re ; limites, continuité, convexité, ln, primitives, intégrales, équations différentielles, espace,
//     dénombrement → Tle), après contrôle des formes : les formes hors programme d'une classe française sont écartées du
//     tirage par HORS_FR (src/engine.js, horsCO), sans toucher aux profils suisses ;
//  2. retire de la 1re (et de la Tle) les notions hors programme ou écrites à la suisse (loi des sinus, réciproque, a^x,
//     degrés, log₂, « composantes ») — remplacées par des notions françaises (trigrad, trigfr, lnfr…) ;
//  3. reprend en 1re les automatismes de l'épreuve anticipée (againFR 11) et relève le niveau 1 des notions reprises
//     d'une année inférieure (UPFR) : « le niveau 1 = automatismes de l'année » (règle du 24.11, étendue à la France) ;
//  4. donne l'ordre et les chapitres de 1re et de Tle (ORDRE.FR, ORDRE_THEME.FR, THEME_LABEL.FR).
// Rien ne change pour un profil suisse : seuls les champs FR / againFR et des tables lues pour un profil FR sont touchés.

/* Formes d'une notion partagée hors programme d'une classe française : [ctx (« préfixe* » permis) | RegExp | fonction,
   première classe FR où la forme est permise (99 = jamais en France)]. Lu par horsCO (src/engine.js). */
const HORS_FR = {
  /* 27.11 (décision de l'enseignant, n° 17) : nombre dérivé de x³ et de √x « par la définition » : hors programme 2026 (le calcul
     algébrique du taux de variation se limite au second degré et à la fonction inverse) */
  nbderive: [["definition-cube", 99], ["definition-racine", 99]],
  derivref: [["exposant-*", 99] /* x^(3/2), racine cubique : exposants rationnels, hors programme FR */, ["trigo-*", 12] /* dérivées de sin, cos : Tle */],
  tangente: [["newton", 12]],
  asymptotes: [["oblique", 99] /* programme FR : asymptotes parallèles aux axes seulement */],
  etudefct: [["rationnelle-oblique-*", 99]],
  combi: [["groupe-jass", 99] /* jeu de cartes suisse */],
  primitives: [["puissance-rac", 99], ["puissance-xrac", 99] /* x^(3/2) */],
  intparties: [["exp-cos", 99] /* double intégration par parties avec cosinus : hors programme */],
  eqdiff: [["separable-*", 99] /* variables séparables : hors programme (y' = ay + b seulement) */],
  /* 25.11 soir : progcalc dès la 5e ; nombre de départ négatif multiplié (produit de relatifs), (x + a)², (x + a)(x − a) : 4e */
  progcalc: [["negatif", 8], ["prouver-carre", 8], ["produit", 8]],
  /* 26.11 (revue p4, remarque : 5e FR, « Écris 0,3̄ sous forme de fraction », corrigé « 10x − x = 3 ») : écriture fractionnaire
     d'un décimal périodique par une équation, pas avant la 4e (équations du 1er degré : 4e.AL) */
  fracconv: [["per1", 8], ["per2", 8], ["permixte", 8]],
  /* 26.11 (revue élèves : « Étendue, médiane, quartiles » proposé en 4e) : au collège, médiane et étendue seulement
     (4e.DP.02, 3e.DP.02) ; quartiles et écart interquartile en 2nde. Libellé du collège : labelFR (Engine.catalog). */
  quartiles: [[/quartile|Q_1|Q_3|moustache/i, 10]],
  /* 26.11 (audit lycée, tools/audit_fr_lycee_26-11.md) : 2nde 2026 = produit nul, x² = a, forme factorisée donnée ; la
     factorisation d'un trinôme (racines par somme et produit, discriminant) et la forme canonique sont de 1re (1re.AL). */
  eq2fact: [["ramener-zero", 11], ["trinome", 11], ["erreur", 11], ["facteur-num", 11]],
  fimg: [["zeros-calcul", 11], ["preimage-tri", 11], ["axes-triangle", 11]],
  /* équations avec radical (√x = x − 12, solutions parasites) : hors programme français ; 12/x = x − 1 : trinôme (1re) */
  racinv: [["sqrt-lin", 99], ["sqrt-param", 99], ["inv-aff", 11]],
  /* systèmes linéaires retirés du programme de 2nde 2026 : intersection de droites données par leur équation réduite (droitesinter) */
  droites: [["systeme", 11]],
  /* triangle rectangle par le produit scalaire : 1re */
  cart: [["angle-droit", 11]],
  /* 26.11 soir (agent defisch3) : notes sur 6 (barème suisse) écartées en France ; la France a la forme « notes20 » (q.fr) */
  stats: [["notes6", 99]],
  /* 26.11 (revue p6, n° 6) : défi pct à pourcentages successifs (coefficient multiplicateur, 3e.NC) : pas avant la 3e */
  pct: [["succ-*", 9]],
  /* 1re 2026 : « le calcul effectif de la forme canonique dans le cas général n'est pas un attendu » (complétion du carré, a = 1) */
  f2formes: [["canon-couple", 99], ["dev-k-a", 99]],
  /* 26.11 (revue p5, n° 1, grave : 4e FR, « Factorise x² − 100 ») : repères annuels du cycle 4 — 5e : factoriser ka + kb
     (facteur commun numérique) ; 4e : facteur commun littéral, relatifs ; 3e : facteur commun entre parenthèses,
     a² − b² = (a − b)(a + b) ; 2nde : carré parfait lu à l'envers ; 1re : trinôme (somme et produit, racines).
     Défi (niveau 4 : calcul mental par a² − b², (100 − 2)(100 + 2)) : 3e. */
  factor: [["lettre", 8], ["parenthese", 9], ["diffcarres", 9], ["diffcarres2", 9], ["maximal", 9], ["cube", 9], ["carre", 10],
    ["trinome", 11], ["trinome-complete", 11], ["erreur", 11], [(q) => q.d === 4, 9]],
  /* même revue : développer — 5e : k(a + b), k positif ; 4e : produit de relatifs, x · x = x², double distributivité ;
     3e : différence de deux produits ; 2nde : binôme × trinôme (degré 3). */
  idrem: [["racines", 10] /* (a + √b)² : calcul avec radicaux, 2nde */],
  distrib: [["negatif", 8], ["lettre", 8], ["double", 8], ["double2", 8], ["trinome", 8], ["difference", 9], ["deuxdev", 9], ["degre3", 10]],
};

/* 26.11 (revue p5, n° 7) : indice de la notion pour une classe française où l'indice suisse parle d'un contenu hors programme
   (horsFRTexte : quartiles avant la 2nde). Lu par Engine.finalize. */
const HINTS_FR_COL = {
  quartiles: "Trie la série. Étendue = plus grande valeur − plus petite. Médiane : la valeur du milieu (effectif pair : la moyenne des deux valeurs du milieu).",
};

/* 26.11 (décision de l'enseignant, n° 5 : quartiles retirés de la 4e FR, gardés en 2nde) : au collège français, la notion
   « quartiles » (libellé « Étendue, médiane ») n'avait plus que l'étendue, au niveau 1 (les formes à quartiles sont écartées
   par HORS_FR). Formes de médiane réservées à la 4e et à la 3e françaises (q.fr = [8, 9]) : 4e.DP.02 (médiane d'une série
   de petit effectif), 3e.DP.02 (étendue, médiane, données d'un tableau). Une entrée VARX par niveau, qui tire une forme :
   un autre profil la refuse (horsCO) et retire sa graine ; le paquet « fr » n'est chargé que pour un profil français. */
if (typeof VARX !== "undefined") (function () {
  const nb = (v) => String(+(+v).toFixed(6)).replace(".", "{,}");
  const lst = (a) => M(a.map(nb).join(" \\,;\\, "));
  const srt = (a) => a.slice().sort((x, y) => x - y);
  const med = (s) => (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2);
  const mix = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const fr = (q, shown) => (q ? Object.assign(q, { fr: [8, 9] }, shown ? { shownOk: true } : {}) : q);
  const pick = (fs) => () => { for (let k = 0; k < 40; k++) { const q = fs[Math.floor(R.rand() * fs.length)](); if (q) return q; } return fs[0](); }; /* fs[0] ne renvoie jamais null */
  const L = {
    1: [
      () => { const s = srt(Array.from({ length: 7 }, () => R.int(4, 20))), m = s[3];
        return fr(QV("Notes (sur 20) de 7 élèves, rangées dans l'ordre croissant : " + lst(s) + ". Quelle est la médiane de cette série ?", m, "7 valeurs : la médiane est la 4e, " + M(nb(m)) + " (3 valeurs avant, 3 après).",
          { ctx: "mediane-triee", guide: [GS("Combien de valeurs ?", 7, "7."), GS("Rang de la valeur du milieu ?", 4, "4e (3 avant, 3 après)."), GS("Médiane ?", m, M(nb(m)) + ".")], traps: [TRAP(s[6] - s[0], "C'est l'étendue ; la médiane est la valeur du milieu."), TRAP(+(s.reduce((a, b) => a + b, 0) / 7).toFixed(6), "C'est la moyenne ; la médiane est la valeur du milieu.")] }), true); },
      () => { const s = srt(Array.from({ length: 5 }, () => R.int(5, 40))), sh = mix(s), m = s[2]; if (sh[2] === m) return null;
        return fr(QV("Quelle est la médiane de la série " + lst(sh) + " ?", m, "On range d'abord : " + lst(s) + ". 5 valeurs : la médiane est la 3e, " + M(nb(m)) + ".",
          { ctx: "mediane-5", guide: [GS("On range la série dans l'ordre croissant. Quelle est la 1re valeur ?", s[0], lst(s) + "."), GS("Médiane (3e valeur de la série rangée) ?", m, M(nb(m)) + ".")], traps: [TRAP(sh[2], "C'est la valeur du milieu de la série non rangée : range-la d'abord.")] }), true); },
    ],
    2: [
      () => { const n = 2 * R.int(10, 15), t = R.int(150, 165);
        return fr(QV("Dans une classe de " + M(n) + " élèves, la médiane des tailles est " + M(t + "\\text{ cm}") + ". Au moins combien d'élèves mesurent " + M(t + "\\text{ cm}") + " ou plus ?", n / 2, "La médiane partage l'effectif en deux : au moins la moitié des élèves, " + M(n + " \\div 2 = " + n / 2) + ", mesure " + t + " cm ou plus.",
          { ctx: "mediane-sens", guide: [GS("Quelle part de l'effectif est au-dessus de la médiane (en %) ?", 50, "Au moins la moitié : 50 %."), GS("Nombre d'élèves ?", n / 2, M(n / 2) + ".")], traps: [TRAP(t, "On demande un nombre d'élèves."), TRAP(n, "Pas tous : la moitié au moins.")] })); },
      () => { const s = srt(Array.from({ length: 6 }, () => R.int(2, 30))), sh = mix(s), m = med(s); if (s[2] === s[3]) return null;
        return fr(QV("Quelle est la médiane de la série " + lst(sh) + " ?", m, "Série rangée : " + lst(s) + ". 6 valeurs : la médiane est entre la 3e et la 4e, " + M("\\frac{" + s[2] + " + " + s[3] + "}{2} = " + nb(m)) + ".",
          { ctx: "mediane-paire", guide: [GS("Série rangée : 3e valeur ?", s[2], lst(s) + "."), GS("4e valeur ?", s[3], M(s[3]) + "."), GS("Médiane (moyenne de ces deux valeurs) ?", m, M(nb(m)) + ".")], traps: [TRAP(s[2], "Effectif pair : la médiane est la moyenne des deux valeurs du milieu."), TRAP(s[3], "Effectif pair : la médiane est la moyenne des deux valeurs du milieu."), TRAP(med(sh), "Range d'abord la série.")] })); },
      () => { const s = srt(Array.from({ length: 9 }, () => R.int(8, 45))), sh = mix(s), m = s[4]; if (sh[4] === m) return null;
        return fr(QV("Temps (en minutes) mis par 9 élèves pour venir au collège : " + lst(sh) + ". Quelle est la médiane de ces temps ?", m, "Série rangée : " + lst(s) + ". 9 valeurs : la médiane est la 5e, " + M(nb(m)) + " min : la moitié des élèves met au plus " + nb(m) + " min.",
          { ctx: "mediane-trajet", guide: [GS("Rang de la médiane pour 9 valeurs ?", 5, "5e (4 avant, 4 après)."), GS("Médiane (série rangée) ?", m, M(nb(m)) + " min.")], traps: [TRAP(sh[4], "Range d'abord la série."), TRAP(s[8] - s[0], "C'est l'étendue.")] }), true); },
    ],
    3: [
      () => { const v = [8, 10, 12, 14, 16], e = v.map(() => R.int(1, 6)), N = e.reduce((a, b) => a + b, 0), s = v.flatMap((x, k) => Array(e[k]).fill(x)), m = med(s);
        return fr(QV("Notes d'un contrôle : " + v.map((x, k) => "note " + M(x) + " : " + M(e[k]) + " élève" + (e[k] > 1 ? "s" : "")).join(" ; ") + ". Quelle est la note médiane ?", m,
          "Effectif total " + M(N) + ". " + (N % 2 ? "La médiane est la " + (N + 1) / 2 + "e note" : "La médiane est la moyenne des " + N / 2 + "e et " + (N / 2 + 1) + "e notes") + " dans l'ordre croissant (effectifs cumulés : " + e.map((x, k) => e.slice(0, k + 1).reduce((a, b) => a + b, 0)).join(" ; ") + ") : " + M(nb(m)) + ".",
          { ctx: "mediane-effectifs", guide: [GS("Effectif total ?", N, M(N) + "."), GS("Médiane ?", m, M(nb(m)) + ".")], traps: [TRAP(12, "La note du milieu du tableau n'est pas forcément la médiane : compte les élèves."), TRAP(+(s.reduce((a, b) => a + b, 0) / N).toFixed(6), "C'est la moyenne.")] })); },
      () => { const s = srt(Array.from({ length: 5 }, () => R.int(3, 30))), m0 = s[2], x = s[4] + R.int(3, 15), s2 = srt([...s, x]), m = med(s2); if (m === m0 || new Set(s).size < 5) return null;
        return fr(QV("La série " + lst(s) + " a pour médiane " + M(m0) + ". On ajoute la valeur " + M(x) + ". Quelle est la nouvelle médiane ?", m, "Nouvelle série rangée : " + lst(s2) + ". 6 valeurs : médiane " + M("\\frac{" + s2[2] + " + " + s2[3] + "}{2} = " + nb(m)) + ".",
          { ctx: "mediane-ajout", guide: [GS("Combien de valeurs maintenant ?", 6, "6."), GS("Nouvelle médiane (moyenne des 3e et 4e valeurs) ?", m, M(nb(m)) + ".")], traps: [TRAP(m0, "La médiane change : il y a maintenant 6 valeurs."), TRAP(x, "La nouvelle valeur est la plus grande, pas la médiane.")] })); },
      () => { const s = srt(Array.from({ length: 8 }, () => R.int(-6, 9))), sh = mix(s), m = med(s), e = s[7] - s[0]; if (s[3] === s[4] || s[0] >= 0) return null;
        return fr(QV("Températures (en °C) relevées à 8 h pendant 8 jours : " + lst(sh) + ". Quelle est la température médiane ?", m, "Série rangée : " + lst(s) + ". 8 valeurs : " + M("\\frac{" + s[3] + (s[4] < 0 ? " + (" + s[4] + ")" : " + " + s[4]) + "}{2} = " + nb(m)) + " °C (étendue : " + M(s[7] + " - (" + s[0] + ") = " + e) + " °C).",
          { ctx: "mediane-temp", guide: [GS("Série rangée : 4e valeur ?", s[3], lst(s) + "."), GS("5e valeur ?", s[4], M(s[4]) + "."), GS("Médiane ?", m, M(nb(m)) + " °C.")], traps: [TRAP(e, "C'est l'étendue."), TRAP(med(sh), "Range d'abord la série (attention aux négatifs).")] })); },
    ],
  };
  const X = (VARX.quartiles = VARX.quartiles || {});
  for (const lv of [1, 2, 3]) (X[lv] = X[lv] || []).push(pick(L[lv]));
})();

/* Niveau minimal d'une notion reprise d'une année inférieure, pour un profil FR de la classe indiquée (Engine.make).
   Calibré sur la sonde tests/_niv_fr.html (25.11) et les attendus du DNB (partie 1 : automatismes de 3e) et de
   l'épreuve anticipée de 1re (QCM d'automatismes). Le code de la question suit le niveau tiré (…-2-…). */
const UPFR = {
  /* 4e : reprises de 6e–5e dont le niveau 1 est un automatisme de 6e (« 3² », « 5 − 7 », « 50 % de 260 », « 4(2x + 2) ») */
  8: { progcalc: 2, fracadd: 2, prop: 2, valnum: 2, ordgr: 2, dec10: 2, pow9: 3, tradexpr: 2, relrep: 2, reladd: 3, fracrep: 2, fracsimp: 2, fracconv: 2, fractout: 2,
    aire1: 2, litelab: 2, quadri: 2, pct: 2, reduire: 2, distrib: 2, eqverif: 2, statfreq: 2, structexpr: 2, automat: 2, vol: 2 },
  /* 3e : DNB partie 1 (automatismes) — fractions et puissances combinées, pourcentages d'évolution, a² − b² */
  9: { fracadd: 2, diagr: 2, prop: 2, valnum: 2, pow9: 3, divcrit: 2, relrep: 2, fracsimp: 2, solides: 2, agrand: 2, litelab: 2, pct: 2, puiss: 2, sci: 2,
    reduire: 2, distrib: 2, repere: 2, parenth: 2, statfreq: 2, structexpr: 2, automat: 2, milieux: 2 },
  /* 2nde : automatismes AU.01–18 ; les reprises du collège partent du niveau 2 (tools/france.md § 3) */
  10: { fracadd: 2, diagr: 2, valnum: 2, decarr: 2, ordgr: 2, multdiv: 2, premiers: 2, relrep: 3, fracsimp: 2, fracconv: 2, fractout: 2, uvol: 2, fracmul: 2,
    pct: 2, puiss: 2, rac: 3, distrib: 2, eq1: 2, affine: 2, racenc: 2, pctvar: 2, proba: 2, idrem: 2, parenth: 2, fimg: 2, statfreq: 2, quartiles: 2, proba2: 2 },
  /* 1re : QCM d'automatismes de l'épreuve anticipée (développer (2x − 3)², taux réciproque, signe d'un produit…) */
  11: { pct: 2, puiss: 2, distrib: 2, pctvar: 2, idrem: 2, factor: 2, eq2fact: 2, fimg: 2, affzero: 2, stats: 2, quartiles: 2, ineq1: 2 },
};

(function () {
  const N = (id) => NOTIONS.find((x) => x.id === id);
  { const q = N("quartiles"); if (q) q.labelFR = [10, "Étendue, médiane"]; }
  { const q = N("droitesinter"); if (q) q.labelFR = [11, "Intersection de droites"]; }
  /* 26.11 (audit lycée) : vocabulaire français dans les libellés (13 = toutes les classes françaises) : racines, antécédents,
     fonction affine ; « zéro » et « préimage » sont des usages suisses. */
  for (const [id, lab] of [["lectgraph", "Lire un graphique : images, antécédents, variations"], ["f2", "Parabole : racines et sommet"],
    ["trinfact", "Factoriser un trinôme à l'aide de ses racines"], ["affzero", "Signe d'une fonction affine"], ["fimg", "Images et antécédents"]]) { const q = N(id); if (q && !q.labelFR) q.labelFR = [13, lab]; } /* 26.11 (revue p3, n° 1) : médiatrice et hauteur en repère = 1re (orthogonalité) */ /* 26.11 : avant la 2nde, sans « quartiles » */
  const place = (id, fr, again) => { const n = N(id); if (!n) return; n.FR = fr; if (again) n.againFR = [...new Set([...(n.againFR || []), ...again])]; };

  // ---------- 1. Rattachements (attendu contrôlé ; formes écartées : HORS_FR ci-dessus) ----------
  const RATT = {
    // 1re spécialité 2026 : dérivation (AN.01–10) — src/ch3c_ana.js
    tauxvar: [11, 3], nbderive: [11, 3], derivref: [11, 3], derivregles: [11, 3], derivprodquot: [11, 3], tangente: [11, 3], variations: [11, 4], optimderiv: [11, 4],
    // 1re : probabilités conditionnelles, variables aléatoires (SP.01–09) — src/ch3c_ana.js, src/ch4c_ana.js
    probarbre: [11, 6], condbayes: [11, 6], varalea: [11, 7],
    // Tle spécialité (2019) — src/ch3c_ana.js, src/ch4c_ana.js, src/ch3c_geo.js
    derivcomp: [12, 1], derivseconde: [12, 2], limites: [12, 1], limitinf: [12, 1], asymptotes: [12, 1], continuite: [12, 2], etudefct: [12, 2],
    lnexp: [12, 3], etudelnexp: [12, 3], croissance: [12, 3], primitives: [12, 5], eqdiff: [12, 5], integrale: [12, 6], aireint: [12, 6], intparties: [12, 6],
    combi: [12, 0], binomiale: [12, 7], vect3d: [12, 4], colin: [12, 4], droite3d: [12, 4], plans: [12, 4], posrel: [12, 4], pscal3d: [12, 4], distances: [12, 4],
    // 2nde : réunion, contraire (SP) — src/ch3c_ana.js
    probaxiomes: [10, 14],
    /* 26.11 soir (revue des élèves joués, n° 8) : sommet d'un trinôme développé (−b ÷ 2a) = 1re spécialité (1re.AL.10, 1re.AN.10),
       pas la 2nde (fonction carré seulement) ; il était rangé en 2nde sous « Collège · Nombres et calculs ». */
    f2: [11, 0],
    /* 26.11 (audit lycée) : sommet d'un trinôme et intersection parabole–droite (discriminant) = 1re, pas la 2nde */
    optim: [11, 0], inter: [11, 1],
  };
  for (const [id, fr] of Object.entries(RATT)) place(id, fr);
  // Créées en 2nde (fr_2nde.js) avec une place au collège, effacée ensuite par applyFrCollege (fr_college.js chargé après) :
  // inéquations (3e, programme 2026 : 3e.NC.28, en fin d'année) et probabilités à deux épreuves (3e-2019 DP.04).
  place("ineq1", [9, 9], [10, 11]);
  place("proba2", [9, 8], [10]);

  // ---------- 2. Retraits (hors programme français, ou écrits à la suisse et remplacés) ----------
  // sinlaw : loi des sinus hors programme (Al-Kashi : pscal) ; recip : f⁻¹ hors programme ; expo, modexp : a^x et racine n-ième
  // (la 1re ne connaît que e^x ; modèles discrets : suitegeo) ; trigcercle, trigassoc, trigfn, trigeq : en degrés (la France
  // travaille en radians dès la 1re : trigrad, trigfr) ; log : log₂ (la Tle ne connaît que ln : lnexp, lnfr) ; vecteurs :
  // « composantes » (vect3e en 2nde, pscal en 1re).
  for (const id of ["sinlaw", "recip", "expo", "modexp", "trigcercle", "trigassoc", "trigfn", "trigeq", "log", "vecteurs"]) { const n = N(id); if (n) { n.FR = null; delete n.againFR; } }

  // ---------- 3. Automatismes de 1re (épreuve anticipée, partie 1 : 1re.AU.01–17) ----------
  // Notions de collège et de 2nde reprises « de l'année » en 1re ; leur niveau 1 est relevé (UPFR[11]).
  const AU1 = ["fracops", "puiss", "pct", "pctvar", "tauxevol", "eq2", "eq2fact", "ineq1", "affzero", "distrib", "factor", "idrem", "lectgraph", "fimg", "droites", "stats", "quartiles", "probcond", "tabvar", "droiteeq"];
  for (const id of AU1) { const n = N(id); if (n && n.FR && n.FR[0] < 11) n.againFR = [...new Set([...(n.againFR || []), 11])]; }

  // ---------- 4. Ordre et chapitres de 1re et de Tle (référentiel « FR ») ----------
  const CHAP = {
    "1SU": ["suitedef", "suitearith", "suitegeo", "suitesomme"],
    "1SD": ["eq2disc", "f2", "f2formes", "trinfact", "ineq2", "inter", "optim"],
    "1DE": ["tauxvar", "nbderive", "tangente", "derivref", "derivregles", "derivprodquot", "variations", "posrelc", "optimderiv"],
    "1EX": ["expfn", "expderiv"],
    "1TR": ["trigrad"],
    "1PS": ["pscal", "droitenorm", "cercle"],
    "1PR": ["probtot", "probarbre", "condbayes", "vaesp", "varalea"],
    "TSU": ["suitelim", "recurrence"],
    "TLI": ["limites", "limitinf", "asymptotes", "continuite", "tvi"],
    "TDE": ["derivcomp", "derivseconde", "etudefct"],
    "TLN": ["lnexp", "lnfr", "etudelnexp", "croissance"],
    "TTR": ["trigfr"],
    "TPR": ["primitives", "eqdiff"],
    "TIN": ["integrale", "aireint", "intmaj", "intparties", "suiteint"],
    "TDN": ["denombr", "combi", "binom", "binomiale", "sommeva"],
    "TES": ["vect3d", "colin", "droite3d", "plans", "posrel", "pscal3d", "distances"],
    "TAU": ["compo"] /* 27.11, n° 15 : eq3 retiré du catalogue français */,
  };
  ORDRE.FR = ORDRE.FR || {}; ORDRE_THEME.FR = ORDRE_THEME.FR || {}; THEME_LABEL.FR = THEME_LABEL.FR || {}; /* pages de test sans fr_2nde.js */
  // Progression du collège (ORDRE.FR_COL, fr_college.js) et de 2nde (ORDRE.FR, fr_2nde.js) pour les notions créées le 25.11.
  if (typeof FR_PROGRESSION !== "undefined") {
    const ins = (g, id, ref) => { const L = FR_PROGRESSION[g]; if (!N(id) || L.includes(id)) return; const i = L.indexOf(ref); L.splice(i < 0 ? L.length : i + 1, 0, id); };
    ins(8, "cos4e", "pythfig"); ins(8, "thales4e", "milieux"); ins(9, "autodnb", "pctvar"); ins(9, "linfn", "affine"); ins(9, "proba2", "volcomp");
    ins(9, "ineq1", "simil"); ins(9, "vecgeo", "ineq1"); /* programme 2026 de 3e : en fin d'année */
    ORDRE.FR_COL = {}; [6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR_COL[id] = i; });
  }
  for (const [id, ref, ch] of [["tabvar", "fref", "2AN"], ["linfn", "affine", "2AU"], ["vecgeo", "vect3e", "2GE"], ["compdiff", "fracsimp", "2NC"], ["probaxiomes", "probcond", "2SP"], ["eq2", "eq2fact", "2AU"] /* 26.11 soir (n° 8) : chapitres du lycée, plus « Collège · » (eq2 : automatisme de 1re, 1re.AU.05) */]) if (N(id) && ORDRE.FR[ref] !== undefined) { ORDRE.FR[id] = ORDRE.FR[ref] + (id === "vecgeo" ? -0.5 : 0.5); ORDRE_THEME.FR[id] = ch; }
  let rk = 1000;
  for (const [ch, ids] of Object.entries(CHAP)) for (const id of ids) { if (!N(id)) continue; ORDRE.FR[id] = rk++; ORDRE_THEME.FR[id] = ch; }
  Object.assign(THEME_LABEL.FR, { "1SU": "Suites numériques", "1SD": "Second degré", "1DE": "Dérivation", "1EX": "Fonction exponentielle", "1TR": "Trigonométrie",
    "1PS": "Produit scalaire, géométrie repérée", "1PR": "Probabilités conditionnelles, variables aléatoires",
    "TSU": "Suites, récurrence", "TLI": "Limites, continuité", "TDE": "Dérivation, convexité", "TLN": "Logarithme népérien", "TTR": "Fonctions sinus et cosinus",
    "TPR": "Primitives, équations différentielles", "TIN": "Calcul intégral", "TDN": "Dénombrement, loi binomiale, sommes de variables aléatoires",
    "TES": "Géométrie dans l'espace", "TAU": "Compléments" });
})();
