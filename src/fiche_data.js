// « Ma fiche » (22.11, décisions de l'enseignant) : données par chapitre, clé = chapitre du plan CO (ordre.js, THEME_LABEL.CO).
// Rédigé par Claude, À VALIDER par l'enseignant (trous, « L'essentiel », liens de la carte, questions « Explique »).
//  ess     : l'essentiel du chapitre en 3 lignes (TeX permis) ;
//  ids     : notions de la fiche, dans l'ordre du cours (une notion absente du profil de l'élève est ignorée) ;
//  regle   : lignes de règle ; [[…]] = trou à compléter (TeX permis dedans et autour) ;
//  why     : une question « Explique en une phrase » par notion (on en affiche une seule par fiche) ;
//  carte   : pos = [colonne 0 ou 1, ligne], txt = [titre, sous-titre, exemple ≤ 18 caractères] en Unicode (pas de TeX dans le SVG),
//            liens = [de, vers, "étiquette|2e ligne", "both" pour une double flèche].
// Pour la carte : ÷ et · en caractères ; virgule décimale.
const FICHES = {
  // ===================== 11e · 4. Proportionnalité, grandeurs quotients et unités =====================
  "11C04": {
    ess: [
      "Proportionnalité : on passe par l'unité (combien pour 1 ?), puis on multiplie.",
      "Une grandeur quotient se lit « par unité » : \\(v = d \\div t\\) (km par heure), \\(\\rho = m \\div V\\), débit \\(= V \\div t\\).",
      "Le temps se compte par 60 (1,5 h = 1 h 30 min) ; on convertit chaque unité séparément (1 m/s = 3,6 km/h).",
    ],
    ids: ["prop", "utemps", "vitesse", "ucomp", "gquot"],
    regle: {
      prop: ["Deux grandeurs sont proportionnelles si l'on passe de l'une à l'autre en [[multipliant toujours par le même nombre]].",
        "Méthode : on calcule d'abord [[pour 1]] (passage à l'unité), puis on multiplie.",
        "\\(3\\) kg → \\(7{,}50\\) CHF, donc \\(1\\) kg → [[\\(2{,}50\\) CHF]] et \\(5\\) kg → [[\\(12{,}50\\) CHF]]."],
      utemps: ["\\(1\\) h \\(=\\) [[\\(60\\)]] min et \\(1\\) min \\(=\\) [[\\(60\\)]] s.",
        "\\(1{,}5\\) h \\(=\\) [[\\(1\\) h \\(30\\) min]], et pas 1 h 50.",
        "\\(45\\) min \\(=\\) [[\\(0{,}75\\)]] h."],
      vitesse: ["\\(v =\\) [[\\(d \\div t\\)]] ; \\(d =\\) [[\\(v \\cdot t\\)]] ; \\(t =\\) [[\\(d \\div v\\)]].",
        "La durée s'écrit en [[heures décimales]] : \\(1\\) h \\(45\\) min \\(= 1{,}75\\) h."],
      ucomp: ["On convertit [[chaque unité séparément]].",
        "\\(1\\) m/s \\(=\\) [[\\(3{,}6\\)]] km/h : de km/h à m/s, on [[divise par 3,6]].",
        "\\(72\\) km/h \\(=\\) [[\\(20\\)]] m/s."],
      gquot: ["Masse volumique : \\(\\rho =\\) [[\\(m \\div V\\)]], la masse d'une unité de volume.",
        "Débit \\(=\\) [[volume ÷ durée]].",
        "On vérifie que les [[unités vont ensemble]] : g et cm³, kg et m³, L et min."],
    },
    why: {
      utemps: "Pourquoi \\(1{,}5\\) h ne fait-il pas 1 h 50 min ?",
      vitesse: "Pourquoi faut-il écrire 1 h 45 min sous la forme 1,75 h avant de calculer une vitesse ?",
      ucomp: "Pourquoi divise-t-on par 3,6 pour passer des km/h aux m/s ?",
      prop: "Pourquoi passer par l'unité (« pour 1 ») aide-t-il à résoudre une règle de trois ?",
      gquot: "Que veut dire « 2,7 g/cm³ », en une phrase ?",
    },
    carte: {
      pos: { prop: [0, 0], utemps: [1, 0], vitesse: [0, 1], ucomp: [1, 1], gquot: [0, 2] },
      txt: {
        prop: ["Règle de trois", "passer par 1", "3 kg → 7,50 CHF"],
        utemps: ["Durées", "on compte par 60", "1,5 h = 1 h 30"],
        vitesse: ["Vitesse", "distance ÷ durée", "v = d ÷ t"],
        ucomp: ["Unités composées", "km/h ↔ m/s", "72 km/h = 20 m/s"],
        gquot: ["Masse vol., débit", "quantité par unité", "ρ = m ÷ V"],
      },
      liens: [["prop", "vitesse", "pour 1 h"], ["utemps", "vitesse", "t en h|décimales"], ["vitesse", "ucomp", "changer|d'unité"],
        ["vitesse", "gquot", "même idée :|par unité"], ["ucomp", "gquot", "aussi ρ|et débit"]],
    },
  },
  // ===================== 11e · 5. Calcul littéral =====================
  "11C05": {
    ess: [
      "Une lettre remplace un nombre : on calcule avec les mêmes règles (priorités).",
      "On ne réduit que des termes semblables : \\(3x + 2x = 5x\\), mais \\(3x + 2\\) reste tel quel.",
      "Développer : produit → somme. Factoriser : somme → produit. L'un vérifie l'autre.",
    ],
    ids: ["litelab", "valnum", "parenth", "reduire", "distrib", "idrem", "factor"],
    regle: {
      litelab: ["Le début de la phrase donne l'opération faite [[en dernier]].",
        "« Le triple de la somme de \\(x\\) et 5 » : [[\\(3(x + 5)\\)]].",
        "« La somme du triple de \\(x\\) et de 5 » : [[\\(3x + 5\\)]]."],
      valnum: ["On remplace la lettre par sa valeur [[entre parenthèses]], puis on respecte les [[priorités]].",
        "\\(x^2\\) pour \\(x = -3\\) : [[\\((-3)^2 = 9\\)]] ; mais \\(-3^2 =\\) [[\\(-9\\)]]."],
      parenth: ["Précédée de « + », la parenthèse disparaît [[sans rien changer]].",
        "Précédée de « − », elle disparaît et [[chaque terme change de signe]].",
        "\\(x - (3 - 2x) =\\) [[\\(3x - 3\\)]]."],
      reduire: ["On n'additionne que les termes [[semblables]] : mêmes lettres, [[mêmes exposants]].",
        "\\(3x + 2x =\\) [[\\(5x\\)]], mais \\(x \\cdot x =\\) [[\\(x^2\\)]]."],
      distrib: ["\\(k(a + b) =\\) [[\\(ka + kb\\)]]",
        "\\((a + b)(c + d) =\\) [[\\(ac + ad + bc + bd\\)]]",
        "Chaque terme multiplie [[chaque terme]], puis on [[réduit]]."],
      idrem: ["\\((a + b)^2 = a^2\\) [[\\(+\\, 2ab\\)]] \\(+\\, b^2\\)",
        "\\((a - b)^2 = a^2\\) [[\\(-\\, 2ab\\)]] \\(+\\, b^2\\)",
        "\\((a + b)(a - b) =\\) [[\\(a^2 - b^2\\)]]"],
      factor: ["Factoriser, c'est transformer une somme en [[produit]].",
        "D'abord la [[mise en évidence]], puis les identités remarquables lues à l'envers.",
        "\\(x^2 - 49 =\\) [[\\((x - 7)(x + 7)\\)]]"],
    },
    why: {
      idrem: "Pourquoi \\((x + 3)^2\\) n'est-il pas égal à \\(x^2 + 9\\) ?",
      parenth: "Pourquoi \\(-(4x - 7)\\) vaut-il \\(-4x + 7\\), et pas \\(-4x - 7\\) ?",
      distrib: "Pourquoi \\((x + 2)(x + 3)\\) n'est-il pas égal à \\(x^2 + 6\\) ?",
      reduire: "Pourquoi \\(3x + 2\\) ne se réduit-il pas ?",
      valnum: "Pourquoi \\(-3^2\\) et \\((-3)^2\\) ne donnent-ils pas le même résultat ?",
      litelab: "Quelle différence entre « le double de la somme de x et 3 » et « la somme du double de x et de 3 » ?",
      factor: "Comment vérifier qu'une factorisation est juste ?",
    },
    carte: {
      pos: { litelab: [0, 0], valnum: [1, 0], parenth: [0, 1], reduire: [1, 1], distrib: [0, 2], factor: [1, 2], idrem: [0, 3] },
      txt: {
        litelab: ["Écrire", "une expression", "3(x + 5)"],
        valnum: ["Calculer", "la valeur", "(−3)² = 9"],
        parenth: ["Supprimer ( )", "le signe devant", "−(a − b) = −a + b"],
        reduire: ["Réduire", "termes semblables", "3x + 2x = 5x"],
        distrib: ["Développer", "produit → somme", "k(a + b) = ka + kb"],
        factor: ["Factoriser", "somme → produit", "ka + kb = k(a + b)"],
        idrem: ["Identités", "remarquables", "(a+b)² = a²+2ab+b²"],
      },
      liens: [["litelab", "valnum", "on|remplace"], ["litelab", "parenth", "simplifier"], ["parenth", "reduire", "puis"],
        ["distrib", "reduire", "on finit par|réduire"], ["distrib", "factor", "contraires", "both"], ["distrib", "idrem", "cas|particuliers"],
        ["idrem", "factor", "lues à|l'envers"]],
    },
  },
};
