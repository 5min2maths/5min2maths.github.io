// Notions reprises au standard (formes variées, pas à pas, erreurs typiques) : réservoir du mode libre « au point » (18.11).
const FREE_READY = ["utemps", "ucomp", "vitesse", "gquot", "litelab", "valnum", "reduire", "monomes", "parenth", "distrib", "idrem", "factor",
  "eq1", "eqfrac", "eqspec", "formule", "probeq", "eq2fact", "eq2", "eq2disc", "probeq2", "eq3", "bicarre", "eqirr", "sys2", "sysprob", "sysgraph", "sys3", "affine", "affzero", "sysineq",
  "prio", "fracadd", "fracmul", "fracconv", "puiss", "sci", "scicalc", "pyth", "pythfig", "pythrec", "vol", "volcone", "airepyr", "volcomp", "volmanq", "angles", "cercthales", "thales", "thalesrec", "simil", "repere", "tabval"];
// Moteur adaptatif : profil, état de chaque notion, positionnement, choix des questions, mise à jour.
// Tout reste sur l'appareil (localStorage) ; aucune donnée ne part ailleurs.

const HINTS = {
  prio: "D'abord les parenthèses, puis les puissances, puis × et :, enfin + et −.",
  rel: "Moins par moins donne plus. Et attention : −3² = −9, alors que (−3)² = 9.",
  fracadd: "Mets les fractions au même dénominateur avant d'additionner les numérateurs.",
  fracmul: "Multiplie les numérateurs entre eux et les dénominateurs entre eux. Diviser, c'est multiplier par l'inverse.",
  pct: "p % de N, c'est p/100 × N. Une hausse de p % multiplie par (1 + p/100).",
  puiss: "aᵐ · aⁿ = aᵐ⁺ⁿ et (aᵐ)ⁿ = aᵐⁿ. Une puissance négative est un inverse.",
  sci: "Notation scientifique : a · 10ⁿ avec 1 ≤ a < 10. Compte de combien de rangs la virgule se déplace.",
  rac: "Cherche le plus grand carré qui divise le nombre : √72 = √(36 · 2) = 6√2.",
  valnum: "Remplace la lettre par le nombre entre parenthèses, puis respecte les priorités.",
  reduire: "Regroupe les termes de même nature : les x², les x, les nombres.",
  distrib: "Chaque terme de la première parenthèse multiplie chaque terme de la seconde.",
  idrem: "(a + b)² = a² + 2ab + b² : n'oublie pas le double produit 2ab.",
  factor: "Cherche d'abord un facteur commun, puis une identité remarquable.",
  eq1: "Fais la même opération des deux côtés pour isoler x.",
  eq2: "Un produit est nul si l'un de ses facteurs est nul : résous chaque facteur = 0.",
  prop: "Calcule d'abord pour 1 (passage à l'unité), puis multiplie.",
  vitesse: "v = d / t. Attention aux unités : 1 h = 60 min, et 1 m/s = 3,6 km/h.",
  echelle: "Longueurs × k, aires × k², volumes × k³.",
  aires: "Triangle : b·h/2 ; trapèze : (B + b)·h/2 ; disque : π·r².",
  pyth: "Hypoténuse² = somme des carrés des deux autres côtés.",
  vol: "Prisme : base × hauteur ; pyramide et cône : base × hauteur / 3.",
  thales: "Écris les trois rapports égaux AD/AB = AE/AC = DE/BC, puis utilise les deux utiles.",
  affine: "f(x) = ax + b : a est la pente, b l'ordonnée à l'origine.",
  eq3: "Mets x en évidence, puis factorise ce qui reste.",
  eq2disc: "Δ = b² − 4ac ; si Δ > 0, x = (−b ± √Δ) / 2a ; si Δ < 0, aucune solution.",
  sys2: "Additionne ou soustrais les équations pour éliminer une inconnue, ou isole-la et remplace.",
  fimg: "Image : remplace x par le nombre. Préimage : résous f(x) = valeur.",
  f2: "Sommet : x = −b / 2a, puis calcule f en ce point. Zéros : f(x) = 0.",
  inter: "Les graphes se coupent là où f(x) = g(x) : mets tout d'un côté et résous.",
  angles: "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc.",
  euclide: "Hauteur : h² = p · q. Euclide : cathète² = projection · hypoténuse.",
  trigo: "SOH CAH TOA : sin = opposé/hypoténuse, cos = adjacent/hypoténuse, tan = opposé/adjacent.",
  cart: "Distance : √((xB − xA)² + (yB − yA)²). Milieu : moyenne des coordonnées. Pente : Δy / Δx.",
  recip: "(f ∘ g)(x) = f(g(x)) : calcule d'abord g. Réciproque : résous y = f(x) pour x.",
  sinlaw: "Sinus : a / sin α = b / sin β. Cosinus : c² = a² + b² − 2ab·cos γ.",
  expo: "Écris les deux membres comme puissances de la même base, puis égale les exposants.",
  log: "log_b(x) = y signifie b^y = x. Pour résoudre b^x = c : x = ln c / ln b.",
  absval: "|A| = b (b ≥ 0) donne A = b ou A = −b. Une valeur absolue n'est jamais négative.",
  ineq: "Comme une équation, mais on retourne le signe en multipliant ou divisant par un négatif.",
  trigcercle: "180° = π rad. Sur le cercle trigonométrique, le point a pour coordonnées (cos α ; sin α).",
  trigeq: "Sur [0° ; 360°[ : sin x = s donne x et 180° − x ; cos x = c donne x et 360° − x.",
  stats: "Moyenne : somme / effectif. Médiane : valeur du milieu de la série triée. Écart-type : √(moyenne des carrés des écarts).",
};
if (typeof HINTS_EXTRA !== "undefined") Object.assign(HINTS, HINTS_EXTRA);

const Store = {
  key: "5m2m.v1",
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || null; } catch (e) { return null; } },
  save(s) { try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {} },
  clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

const day = (d = new Date()) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return day(d); };
const INTERVALS = [0, 1, 3, 7, 14, 30];
const TARGET = { drill: -300, app: -100, defi: 80, defi4: 80, rev: -150 }; // écart visé au Mathélo (≈ 85 %, 65 %, 40 % de réussite)
const KIND_LABEL = { drill: "⚡ Automatisme", app: "🧩 Application", defi: "🏔 Défi", rev: "🧠 Révision", rem: "🧱 Une base à consolider" };
// Remédiation (13.11) : notions de base à reprendre quand une notion échoue deux fois de suite.
const PREREQ = { eq1: ["rel", "valnum"], eq2: ["factor", "eq1"], eq2disc: ["eq2fact", "rel"], eq2fact: ["factor"], fracadd: ["fracsimp", "arith"], fracmul: ["fracsimp"],
  fracops: ["fracadd", "fracmul", "rel"], pyth: ["carres", "rac"], pythfig: ["pyth"], pythrec: ["pyth"], thales: ["prop"], affine: ["valnum", "rel"], factor: ["distrib"],
  idrem: ["distrib"], sys2: ["eq1"], trigo: ["prop"], pct: ["prop"], pctvar: ["pct"], ineq: ["eq1"], domaine: ["eq1"], f2: ["eq2"], probeq: ["eq1"], eqfrac: ["fracadd", "eq1"],
  reduire: ["rel"], distrib: ["rel"], sci: ["puiss"], scicalc: ["sci"], monomes: ["puiss"], racenc: ["rac"], valnum: ["prio", "rel"], rel: ["prio"], fracsimp: ["arith"],
  sysineq: ["ineq"], ineqfrac: ["ineq"], eqirr: ["eq2disc"], absval: ["eq1"], trinfact: ["eq2disc"], vol: ["aire2"], echelle: ["prop"],
  // 23.11 : dérivation (3e Collège, src/ch3c_ana.js)
  tauxvar: ["fimg"], nbderive: ["tauxvar"], derivref: ["puiss"], derivregles: ["derivref"], derivprodquot: ["derivregles"], derivcomp: ["derivregles", "compo"],
  tangente: ["nbderive", "droites"], variations: ["derivregles", "ineq2"], optimderiv: ["variations"],
  // 24.11 (agent niv2c) : inéquations polynomiales, 2e Collège (src/ch2c.js)
  ineqpoly: ["polyfact", "ineqfrac"],
  // 24.11 (agent c3geo) : géométrie vectorielle de l'espace, 3e Collège (src/ch3c_geo.js)
  vect3d: ["vecteurs"], colin: ["vect3d"], droite3d: ["vect3d"], plans: ["droite3d"], posrel: ["plans"], pscal3d: ["vect3d"], distances: ["pscal3d", "plans"], sphere: ["plans", "pscal3d"],
  // 24.11 soir : limites, asymptotes, continuité, dérivée seconde, étude, combinatoire, probabilités (3e Collège, src/ch3c_ana.js)
  limites: ["fracrat", "factor"], limitinf: ["limites"], asymptotes: ["limitinf", "fracrat"], continuite: ["limites", "morceaux"],
  derivseconde: ["derivregles"], etudefct: ["variations", "asymptotes"], combi: ["denombr"], probaxiomes: ["proba"], probarbre: ["probaxiomes"],
  // 24.11 : 4e Collège (src/ch4c_ana.js) : intégration, ln et exp, probabilités 2
  primitives: ["derivregles"], integrale: ["primitives"], aireint: ["integrale"], volrev: ["integrale"], lnexp: ["log", "derivcomp"], croissance: ["expo", "log"],
  condbayes: ["proba"], varalea: ["proba"], binomiale: ["varalea"],
  intparties: ["integrale", "derivprodquot"], intsubst: ["integrale", "derivcomp"], etudelnexp: ["lnexp", "variations"], eqdiff: ["croissance", "primitives"],
  // 24.11 (agent niv1c) : 1re Collège, chapitre Argumenter (src/ch1c_arg.js) ; divcrit et tradexpr deviennent des prérequis
  tradalg: ["tradexpr", "valnum"], contrex: ["divcrit", "premiers"], demoalg: ["tradalg", "distrib"], implication: ["contrex", "divcrit"], ratden: ["rac", "idrem"], racprop: ["rac"], fracper: ["fracops"],
  // 24.11 : MP 3e (src/ch_mp3.js) et MP 4e (src/ch_mp4.js)
  eqabs: ["eq1"], eqbic: ["eq2disc"], eqirrmp: ["eq2disc"], eqratmp: ["fracrat", "eq2disc"], puisrat: ["puiss", "rac"], logdef: ["puiss"], logprop: ["logdef"],
  eqexp: ["logdef"], eqlog: ["logprop"], croissexp: ["eqexp"], volmp: ["pyth"], similmp: ["volmp"],
  coordmp: ["pyth"], vectmp: ["coordmp"], scalmp: ["vectmp"], droiteparam: ["vectmp"], ineqmp: ["eq1", "eq2disc"], fctmp: ["fimg"], polymp: ["factor", "eq2disc"],
  sinusmp: ["trigfn"], explogfn: ["eqexp", "logdef"],
  // 24.11 (chantier G, agent greste) : MP 4e (projection, position de droites, fonctions rationnelles) ; 4e Collège (algèbre linéaire, loi normale)
  projmp: ["scalmp"], pvectmp: ["scalmp"], posdroites: ["droiteparam"], fratmp: ["fracrat", "ineqmp"], matrices: ["sys2"], translin: ["matrices"], appllin: ["translin"], normale: ["varalea", "statdesc"], statdesc: ["varalea"], stats: ["diagr"], quartiles: ["diagr"] };
// 24.11 (audit de niveau 1re Collège, tools/niveau_1c.md) : notions du CO dont le niveau 1 est trop facile au Collège (voir make).
const UPC = ["arith", "rel", "fracops", "puiss", "sci", "racprop", "tabval", "eq1", "eqfrac", "formule", "probeq", "affine", "ineq", "sysprob",
  "reduire", "monomes", "parenth", "distrib", "idrem", "factor", "eq2", "simil", "thales", "pyth", "pythfig", "pythrec", "geocomb", "angles", "angtri", "cercthales"];
const UPC_MIN = { fracper: 3 };
/* 25.11 (audit de niveau 9e–10e, tools/niveau_910.md ; plans de cheminement CO 2026-27) : formes d'une année supérieure
   qui se glissaient dans les notions de 9e et de 10e. Au tirage (Engine.make, sujets, QCM), une question dont le contexte
   (q.ctx), l'énoncé (RegExp) ou la réponse (fonction) est listé ici pour la classe est refaite ; les autres classes
   (11e, Collège, MP) ne changent pas. */
const HORS_CO = {
  /* 9e : relatifs sans multiplication ni division, fractions dans Q+ (addition, soustraction), périodes d'un chiffre
     (tiers, neuvièmes) ; réduction d'expressions et polygones réguliers en 10e. */
  9: {
    prio: ["rel", "puiss", "carre", "frac"],
    valnum: ["frac", /=\s*-/],
    fracadd: ["negatif", "parmoins", "rel3", (q) => !!(q.spec && q.spec.kind === "value" && q.spec.value < 0)],
    angtri: ["polygone", "nb-cotes", /polygone régulier/],
    litelab: ["perim", "magie", "age", "taxi"],
    fracconv: ["per2", "permixte"],
    fracper: [/seul le \d se répète|\{,\}(\d)(?!\1)(\d)\1\2/],
    quadri: [/axes? de symétrie/], /* primaire (trop facile), remplacé par diagonales et triangles isocèles */
  },
  /* 10e : simple distributivité seulement (double distributivité, identités : 11e), pas de fractions algébriques ni de
     formules à transformer, pas d'inéquations, pas de cône (11e), aires × k² et volumes × k³ en 11e, vitesse moyenne sur deux trajets en 11e. */
  10: {
    distrib: ["double", "double2", "degre3", "difference", /on retire un carré/],
    reduire: ["fractions-binomes"],
    eq1: ["identites", "carres-elimines", "lit-a", "lit-b", "lit-c", "lit-d", "lit-e"],
    affine: ["f-sup-g-droites"],
    pythfig: ["conehaut", "conegen"],
    echelle: [/\baires?\b|volume|cube|m³|dm³/],
    vitesse: [/aller de|aller-retour|, puis [^.]*km\/h/], /* vitesse moyenne sur deux trajets : 11e (10e = sensibilisation) */
  },
};
function horsCO(state, id, q) {
  const p = state && state.profile;
  if (q && q.co && p && !(p.system === "CH" && p.track !== "mp" && q.co.includes(p.grade))) return true; /* forme réservée à certaines classes du CO (VARX) */
  if (!q || !p || p.system !== "CH" || p.track === "mp") return false;
  const L = HORS_CO[p.grade] && HORS_CO[p.grade][id];
  if (!L) return false;
  const txt = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
  return L.some((r) => (typeof r === "string" ? q.ctx === r : r instanceof RegExp ? r.test(txt) : r(q)));
}
/* 25.11 : en 9e–10e, une racine exacte s'écrit √n (la simplification a√b est au programme de 11e) : la forme a√b
   n'est plus exigée et la consigne propose √13. */
function racineCO(q) {
  const un = (sp) => { if (sp && sp.radical) delete sp.radical; };
  un(q.spec); (q.guide || []).forEach((g) => { un(g.spec); if (g.ask) g.ask = g.ask.replace(" : simplifie", ""); }); (q.parts || []).forEach((x) => un(x.spec));
  if (q.q) q.q = q.q.replace(/écris par exemple \\\(3\\sqrt\{5\}\\\)/g, "écris par exemple \\(\\sqrt{13}\\)");
  return q;
}
// Programme du jour : le format change d'un jour à l'autre ; l'équilibre se fait sur 7 jours.
// 22.11 : textes courts (une ligne sur téléphone : pas de saut quand on change de format).
const FORMATS = {
  defi: { label: "🏔 Défi du jour", slots: ["defi4"], text: "Un seul problème, prends ton temps." },
  auto: { label: "⚡ Série d'automatismes", slots: ["drill", "drill", "drill", "drill", "drill", "drill", "drill", "drill"], text: "8 calculs rapides, enchaînés." },
  app: { label: "🧩 Applications", slots: ["app", "app", "app"], text: "Trois questions de fond." },
  mixte: { label: "⚖️ Mixte", slots: ["drill", "app", "defi"], text: "Automatisme, application, défi." },
  revision: { label: "🧠 Révision", slots: ["rev", "rev", "rev", "rev"], text: "Tes notions à revoir aujourd'hui." },
};
const WEEK = { defi: 2, auto: 2, app: 1, mixte: 1, revision: 1 };

// ---------- Mathélo : score de type Elo ----------
// Année HarmoS équivalente : CH 9e–11e = 9–11 ; FR 6e = 8 … 3e = 11.
const harmos = (system, grade) => (system === "FR" ? grade + 2 : grade);
// Score d'une question : niveau scolaire de la notion + difficulté.
function itemRating(profile, id, d) {
  const n = NOTIONS.find((x) => x.id === id);
  // Niveau propre à la notion : l'année où elle apparaît au CO / Collège. Reprise plus tard en MP : demi-écart en plus.
  /* 24.11 : Math.min, pour une notion ouverte au Collège après la MP (stats, quartiles : 4e Collège, MP 2e) */
  const pl = placeOf(n, profile) || n.CH || n.MP || n.FR, base = profile.system === "CH" && n.CH ? Math.min(n.CH[0], pl[0]) : pl[0];
  const g = base + Math.max(0, pl[0] - base) / 2;
  return 700 + (harmos(profile.system, g) - 8) * 150 + 40 + (d - 1) * 130;
}
// Échelle de référence (sans données partagées) : Mathélo typique en fin d'année par niveau HarmoS.
const ELO_REF = [[8, 850], [9, 1000], [10, 1150], [11, 1300], [12, 1450], [13, 1600], [14, 1750], [15, 1900]]; // 22.11 : 3e et 4e du Collège
function eloLabel(profile, r) {
  const sys = SYSTEMS[profile.system] || (typeof SYSTEMS_HIDDEN !== "undefined" && SYSTEMS_HIDDEN[profile.system]) || { grades: [] }; // 22.11 : France masquée dans l'interface
  const name = (h) => { const g = sys.grades.find(([gg]) => harmos(profile.system, gg) === h); return g ? g[1] : h === 12 ? (profile.system === "FR" ? "2nde" : "1re du Collège") : h === 13 ? (profile.system === "FR" ? "1re" : "2e du Collège") : h === 14 || h === 15 ? (h - 11) + "e du Collège" : h + "e"; };
  let lvl = ELO_REF[0];
  for (const ref of ELO_REF) if (r >= ref[1] - 75) lvl = ref;
  const h = lvl[0], gap = r - lvl[1];
  const adj = gap >= 60 ? "solide" : gap <= -40 ? "en route vers la fin" : "typique de fin";
  return r < ELO_REF[0][1] - 75 ? "En route vers la fin de " + name(8) : "Niveau " + adj + (adj === "solide" ? " de " : " de ") + name(h);
}

// Correction en étapes (étape 0 de l'aide pas à pas, 14.11) : pour les questions sans guide interactif,
// le corrigé est découpé en étapes que l'élève dévoile une à une. Coupure après « . » ou « ; » (hors formules
// \( … \) et hors balises), sinon devant « , donc » / « , soit » ; moins de 2 étapes → pas de découpage.
function splitSol(html) {
  const t = String(html || ""), cut = (re) => {
    const parts = []; let depth = 0, tag = false, last = 0;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (t.startsWith("\\(", i)) depth++; else if (t.startsWith("\\)", i)) depth = Math.max(0, depth - 1);
      else if (c === "<") tag = true; else if (c === ">") tag = false;
      if (depth || tag) continue;
      const m = re.exec(t.slice(i, i + 8));
      if (m && m.index === 0) { const end = i + m[1].length; parts.push(t.slice(last, end).trim()); last = end; i = end - 1; }
    }
    parts.push(t.slice(last).trim());
    return parts.filter((p) => p.replace(/<[^>]+>/g, "").trim().length > 1);
  };
  let p = cut(/^([.;] )(?=[A-ZÀ-Ý(\\<]|[a-zà-ÿ])/);
  if (p.length < 2) p = cut(/^(,)(?= (donc|soit|puis|d'où) )/);
  if (p.length >= 2 && p.length <= 6) return p;
  // Sinon : la plus longue chaîne de calcul \( a = b = c \) ou \( … \iff … \) est dévoilée relation par relation.
  let best = null;
  for (const m of t.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    const cuts = []; let dep = 0;
    for (let i = 0; i < m[1].length; i++) {
      const c = m[1][i]; if (c === "{") dep++; else if (c === "}") dep--;
      if (dep) continue;
      if (c === "=" && m[1][i - 1] !== "\\" && m[1][i + 1] !== "=") cuts.push(i);
      else if (m[1].startsWith("\\iff", i)) cuts.push(i);
    }
    if (cuts.length >= 2 && (!best || cuts.length > best.cuts.length)) best = { m, cuts };
  }
  if (!best) return null;
  const { m, cuts } = best, before = t.slice(0, m.index), after = t.slice(m.index + m[0].length);
  const steps = cuts.slice(1).map((c) => before + "\\(" + m[1].slice(0, c).trim() + "\\)");
  steps.push(t);
  return steps.length <= 6 ? steps : [...steps.slice(0, 4), t];
}

// Question triviale ? (règle du 14.11, contrôlée aussi par tests/trivial.html)
// - écriture neutre visible : « + 0 », « - 0 », « · 1 », « × 1 », exposant 1 ;
// - réponse lisible dans l'énoncé alors que deux données sont égales (ex. « 5 cahiers coûtent 30 CHF ; combien coûtent 5 cahiers ? ») ;
// - réponse 0 ou ±1 : écartée aux deux premiers essais seulement (fréquence divisée, mais encore possible quand c'est le sujet).
function trivialQ(q, k) {
  const raw = String(q.q || "").replace(/<[^>]+>/g, " ");
  if (/(^|[^\d.,{}])[+-]\s*0(?![\d.,{])/.test(raw)) return "terme nul";
  if (/\\cdot\s*1(?![\d.,{])|×\s*1(?![\d.,{])|\^\s*\{?\s*1\s*\}?(?![\d.,{])/.test(raw)) return "facteur ou exposant 1";
  const sp = q.spec || {};
  if (sp.kind !== "value" || typeof sp.value !== "number") return "";
  const nums = (raw.replace(/\{,\}/g, ".").replace(/[\^_]\s*(\{[^}]*\}|-?\d)/g, " ").replace(/\\[a-zA-Z]+/g, " ").match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
  if (!q.shownOk && nums.includes(sp.value) && new Set(nums).size < nums.length) return "réponse dans l'énoncé, données égales";
  if (k < 2 && (sp.value === 0 || Math.abs(sp.value) === 1)) return "réponse 0 ou ±1";
  return "";
}

// Réponse visible par coïncidence (audit 14.11) : la valeur attendue (entier, |v| > 1) figure parmi les nombres de l'énoncé,
// hors questions à choix dans une liste. Le tirage l'évite quand il peut (préférence, pas interdiction).
function answerShown(q) {
  const sp = q.spec || {}, raw = String(q.q || "").replace(/<[^>]+>/g, " ");
  // q.shownOk (20.11) : la réponse est par nature une des données (mode, médiane, quartile d'une série).
  if (q.shownOk || sp.kind !== "value" || !Number.isInteger(sp.value) || Math.abs(sp.value) < 2 || /ces nombres|parmi|lequel|laquelle/i.test(raw)) return false;
  const nums = (raw.replace(/\{,\}/g, ".").replace(/\\[a-zA-Z]+/g, " ").match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
  return nums.includes(sp.value) || nums.includes(-sp.value);
}

// Forme d'une question : l'énoncé sans les nombres (deux questions de même forme ne diffèrent que par les valeurs).
const qForm = (q) => String(q.q || "").replace(/\d+(?:[.,]\d+|\{,\}\d+)?/g, "#").replace(/\s+/g, " ");

const Engine = {
  newState(profile) {
    const h = harmos(profile.system, profile.grade);
    const start = 700 + (h - 8) * 150 + 100;
    return { v: 1, profile, notions: {}, streak: { count: 0, last: null }, history: [], created: day(), elo: { r: Math.round(start), n: 0, log: [] } };
  },

  // Notions du programme jusqu'à l'année de l'élève. Années précédentes : vues. Année en cours : « à venir » ;
  // elles s'ouvrent dans l'ordre du référentiel (unlock), sans rien demander à l'élève.
  catalog(profile) {
    return NOTIONS.filter((n) => { const pl = placeOf(n, profile); return pl && pl[0] <= profile.grade; }).map((n) => {
      const [g] = placeOf(n, profile);
      // Matu : une notion est « de l'année » si son chapitre Sésamath est celui de l'année (Ma1 = 1re, Ma2 = 2e).
      const yr = "M" + (profile.grade - 11), sesa = profile.track !== "mp" && profile.grade >= 12 && typeof ORDRE_THEME !== "undefined" &&
        [(ORDRE_THEME.MATU || {})[n.id], (ORDRE_THEME.MATU_ALT || {})[n.id]].some((k) => (k || "").startsWith(yr));
      const coYear = this.coChap(profile, n.id, true);
      // 22.11 (seconde FR) : « again » liste des années suisses ; pour la France, on lit againFR (sinon une notion reprise en 10e
      // suisse devenait « de l'année » en 2nde, grade 10 aussi).
      const again = sesa || coYear || (profile.track !== "mp" && ((profile.system === "FR" ? n.againFR : n.again) || []).includes(profile.grade));
      return { ...n, theme: this.themeKey(profile, n.id), defaultStatus: g < profile.grade ? "vu" : "avenir", current: g === profile.grade || again, again };
    });
  },
  // 22.11 : référentiel « FR » pour un profil français (ordre et chapitres dans ORDRE.FR / ORDRE_THEME.FR, src/fr_2nde.js).
  refOf(profile) { return profile.system === "FR" ? "FR" : profile.track === "mp" ? "MP" : profile.grade >= 12 ? "MATU" : "CO"; },
  // Thème d'une notion selon le référentiel de l'élève (13.11) : matu = thèmes (Algèbre, Fonctions…), MP = chapitres ;
  // CO, ou notion absente du référentiel : les 4 thèmes du CO.
  // CO (élèves suisses, 9e–11e) : chapitre du plan de l'année ; pour une notion d'une année précédente, son dernier chapitre.
  coChap(profile, id, onlyThisYear = false) {
    if (profile.system !== "CH" || profile.grade > 11 || typeof ORDRE_THEME === "undefined") return null;
    const by = (ORDRE_THEME.CO_BY || {})[id];
    if (!by) return null;
    if (by[profile.grade]) return by[profile.grade];
    if (onlyThisYear) return null;
    const ys = Object.keys(by).map(Number).sort((a, b) => a - b), y = ys.filter((v) => v <= profile.grade).pop() ?? ys[0];
    return by[y];
  },
  themeKey(profile, id) {
    const co = this.coChap(profile, id);
    if (co) return "CO." + co;
    const ref = this.refOf(profile), alt = ref === "MATU" && typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME.MATU_ALT || {})[id];
    // Notion sur deux années : le chapitre de l'année de l'élève.
    const k = alt && alt.startsWith("M" + (profile.grade - 11)) ? alt : ref !== "CO" && typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME[ref] || {})[id];
    return k ? ref + "." + k : NOTIONS.find((n) => n.id === id).theme;
  },
  // Libellé d'un thème ou chapitre ; chapitre CO d'une autre année : précédé de l'année (« 9e · 10. Calcul littéral »).
  themeLabel(key, profile) {
    const [ref, k] = key.split(".");
    if (!k) return THEMES[key];
    const y = ref === "CO" && k.split("C")[0];
    return (y && profile && +y !== profile.grade ? y + "e · " : "") + THEME_LABEL[ref][k];
  },
  // Thèmes présents dans une liste du catalogue, dans l'ordre du référentiel puis ceux du CO.
  // Chapitres CO d'une autre année (révisions) : après ceux de l'année.
  themeOrder(list, profile) {
    const keys = [...new Set(list.map((c) => c.theme))], pos = (k) => {
      const [ref, t] = k.split(".");
      if (!t) return 1000 + Object.keys(THEMES).indexOf(k);
      return Object.keys(THEME_LABEL[ref]).indexOf(t) + (ref === "CO" && profile && +t.split("C")[0] !== profile.grade ? 500 : 0);
    };
    return keys.sort((a, b) => pos(a) - pos(b));
  },
  // Rang dans l'ordre du référentiel (CO, matu ou MP selon l'élève).
  rank(profile, id) {
    // 22.11 : collège français (6e–3e) : progression propre (ORDRE.FR_COL, défini dans fr_college.js), sinon l'ordre du CO.
    if (profile.system === "FR" && profile.grade <= 9 && ORDRE.FR_COL && ORDRE.FR_COL[id] !== undefined) return ORDRE.FR_COL[id];
    const ref = this.refOf(profile);
    const r = (ORDRE[ref] || {})[id] ?? ORDRE.CO[id];
    return r ?? 1000 + NOTIONS.findIndex((n) => n.id === id);
  },
  newNotion(status) {
    return { status, m: status === "vu" ? 0.55 : status === "encours" ? 0.4 : 0, box: status === "vu" ? 1 : 0, due: day(), seen: 0, ok: 0 };
  },
  autoInit(state) {
    this.initNotions(state, Object.fromEntries(this.catalog(state.profile).map((c) => [c.id, c.defaultStatus])));
    this.unlock(state);
  },
  // Ouvre les notions de l'année dans l'ordre du référentiel : toujours au moins 3 notions ouvertes et pas encore
  // maîtrisées, et au moins la part de l'année écoulée (novembre ≈ 20 %, juin ≈ 90 %). Une notion « pas encore vue
  // en classe » revient au bout de 3 semaines.
  unlock(state, date = new Date()) {
    const today = day(date), p = state.profile;
    const cur = Object.keys(state.notions).filter((id) => { const pl = placeOf(NOTIONS.find((n) => n.id === id), p); return pl && pl[0] === p.grade; })
      .sort((a, b) => this.rank(p, a) - this.rank(p, b));
    for (const id of cur) { const s = state.notions[id]; if (s.status === "nonvu" && (!s.retry || s.retry <= today)) s.status = "avenir"; }
    const open = () => cur.filter((id) => ["encours", "vu"].includes(state.notions[id].status));
    const active = () => open().filter((id) => { const s = state.notions[id]; return !(s.ok >= 2 && s.m >= 0.6); }).length;
    const minOpen = Math.ceil((cur.length * schoolMonth(date)) / 10);
    let changed = false;
    while (active() < 3 || open().length < minOpen) {
      const next = cur.find((id) => state.notions[id].status === "avenir");
      if (!next) break;
      Object.assign(state.notions[next], { status: "encours", m: Math.max(0.4, state.notions[next].m), due: today });
      changed = true;
    }
    return changed;
  },
  // « Pas encore vu en classe » : la notion sort des séances pendant 3 semaines, sans pénalité.
  notYet(state, id) {
    const s = state.notions[id];
    if (!s) return;
    s.status = "nonvu"; s.retry = addDays(day(), 21); s.due = s.retry;
    this.unlock(state);
  },
  // Progression visible (24.11, chantier S) : instantané léger pris au début de chaque jour d'activité, AVANT la
  // première modification (appelé par record, tooEasy, updateElo, recordComp et au chargement). Contenu : notes des
  // compétences (en demi-points, entiers) et notions maîtrisées (vues, m ≥ 0,7, même critère que la carte des thèmes).
  // Comme l'état ne change que les jours d'activité, et que chacun commence par un instantané, l'état « il y a 7 jours »
  // est le premier instantané de la fenêtre : on ne garde que ceux des 7 derniers jours (7 au plus).
  // Ancien state sans instantané : rien à migrer, le premier est pris au chargement (la semaine part de ce jour-là).
  snap(state, today = day()) {
    if (!state || !state.notions) return;
    const S = Array.isArray(state.snaps) ? state.snaps : [];
    if (S.length && S[S.length - 1] && S[S.length - 1].d === today) return;
    const c = {};
    for (const [cid, rec] of Object.entries(state.comps || {})) { const n = compNote(rec); if (n !== null) c[cid] = Math.round(n * 2); }
    const k = Object.keys(state.notions).filter((id) => { const s = state.notions[id]; return s && s.seen > 0 && s.m >= 0.7; });
    const lim = addDays(today, -6);
    state.snaps = [...S.filter((x) => x && x.d >= lim && x.d < today), { d: today, c, k }];
  },
  // Bilan des 7 derniers jours (aujourd'hui compris), comparé à soi-même seulement.
  // ups : compétences dont la note a monté [{ cid, label, b, a }], de la plus forte hausse à la plus faible ;
  // first : compétences notées pour la première fois ; cons : notions devenues maîtrisées ; fixed : erreurs effacées du
  // carnet ; days / n : jours actifs et questions ; since : date de départ si la fenêtre est partielle (sinon null).
  week(state, today = day()) {
    const lim = addDays(today, -6), S = (Array.isArray(state.snaps) ? state.snaps : []).filter((x) => x && x.d >= lim && x.d <= today);
    const ref = S[0] || null, H = (state.history || []).filter((x) => x && x.date >= lim && x.date <= today && x.n > 0);
    const out = { ups: [], first: [], cons: [], fixed: 0, days: H.length, n: H.reduce((a, x) => a + (x.n || 0), 0), since: null };
    out.fixed = (Array.isArray(state.carnetOut) ? state.carnetOut : []).filter((d) => d >= lim && d <= today).length;
    if (!ref) return out;
    // Activité dans la fenêtre avant le premier instantané (state d'avant le 24.11) : on dit « depuis le … ».
    if (H.some((x) => x.date < ref.d)) out.since = ref.d;
    const lab = (cid) => { const [id, i] = cid.split(":"), L = COMPS[id]; return (L && L[+i]) || (NOTIONS.find((x) => x.id === id) || {}).label || id; };
    for (const [cid, rec] of Object.entries(state.comps || {})) {
      const a = compNote(rec);
      if (a === null) continue;
      const b = ref.c && ref.c[cid] != null ? ref.c[cid] / 2 : null;
      if (b === null) out.first.push({ cid, label: lab(cid), a });
      else if (a > b) out.ups.push({ cid, label: lab(cid), b, a });
    }
    out.ups.sort((x, y) => y.a - y.b - (x.a - x.b) || y.a - x.a);
    const had = new Set(ref.k || []);
    out.cons = Object.keys(state.notions || {}).filter((id) => { const s = state.notions[id]; return s && s.seen > 0 && s.m >= 0.7 && !had.has(id); });
    return out;
  },
  // Compétence : les 8 dernières réponses (1, 0,5 ou 0).
  recordComp(state, id, d, score) {
    this.snap(state);
    state.comps = state.comps || {};
    const cid = compOf(id, d), rec = (state.comps[cid] = state.comps[cid] || { r: [], n: 0 }), before = compNote(rec);
    rec.r.push(score); rec.r = rec.r.slice(-8); rec.n++; rec.last = day();
    if (typeof Badges !== "undefined") Badges.onComp(state, cid, before, compNote(rec));
  },

  // Catalogue modifié depuis la création du profil : ajoute les notions manquantes (anciennes = vues, année en cours = à cocher).
  migrate(state) {
    let changed = false;
    for (const c of this.catalog(state.profile)) if (!state.notions[c.id]) { state.notions[c.id] = this.newNotion(c.defaultStatus); changed = true; }
    // Ancien questionnaire : « pas encore » coché par l'élève → à venir (la notion s'ouvrira dans l'ordre).
    for (const s of Object.values(state.notions)) if (s.status === "nonvu" && !s.retry) { s.status = "avenir"; changed = true; }
    for (const id of Object.keys(state.notions)) { const n = NOTIONS.find((x) => x.id === id); if (!n || !placeOf(n, state.profile)) { delete state.notions[id]; changed = true; } }
    if (this.unlock(state)) changed = true;
    return changed;
  },

  initNotions(state, statuses) {
    state.notions = {};
    for (const [id, status] of Object.entries(statuses)) {
      state.notions[id] = this.newNotion(status);
    }
  },

  // Mode « progression libre » (18.11), programme adaptatif (19.11, demande de l'auteur : pas de bouton, c'est l'app
  // qui construit le parcours). Niveau L = maîtrise moyenne des notions travaillées :
  //  - élève à l'aise (L ≥ 0,75) : surtout des notions neuves, prises un peu plus loin dans le référentiel, et un cran
  //    de difficulté en plus sur ce qu'il maîtrise déjà ;
  //  - élève moyen : tiers forts / à travailler / neuves (cross-training) ;
  //  - élève en difficulté (L < 0,55) : surtout ses points faibles, précédés de leurs bases (PREREQ) non maîtrisées ;
  //    les notions neuves sont les premières du référentiel, et seulement si leurs bases sont acquises.
  // Thèmes alternés. Le second argument (ancien choix de périmètre) est ignoré.
  freePlan(state, scope, n = 6) {
    const theme = (id) => (NOTIONS.find((x) => x.id === id) || {}).theme || "";
    const pool = Object.keys(state.notions).filter((id) => GEN[id]);
    const s = (id) => state.notions[id], ok = (id) => !state.notions[id] || (s(id).seen > 0 && s(id).m >= 0.7);
    const seen = pool.filter((id) => s(id).seen > 0), L = seen.length ? seen.reduce((t, id) => t + s(id).m, 0) / seen.length : 0.6;
    const tier = seen.length < 3 ? "mid" : L >= 0.75 ? "fort" : L < 0.55 ? "fragile" : "mid";
    const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const rk = (id) => this.rank(state.profile, id);
    // Anti-répétition entre séances (commentaire testeur du 20.11 : « beaucoup trop de questions de temps ») : une notion
    // posée lors des deux dernières séances libres passe après les autres ; les points faibles reviennent, mais en alternance.
    const recent = (state.freeRecent || []).flat(), rec = (id) => recent.filter((x) => x === id).length;
    const byRecent = (a) => a.map((id, i) => [id, i]).sort((x, y) => rec(x[0]) - rec(y[0]) || x[1] - y[1]).map((x) => x[0]);
    const strong = byRecent(sh(pool.filter((id) => s(id).seen > 0 && s(id).m >= 0.7)));
    // Points faibles du plus fragile au moins fragile ; pour un élève fragile, chaque point faible est précédé de ses bases.
    let weak = pool.filter((id) => s(id).seen > 0 && s(id).m < 0.7).sort((a, b) => s(a).m + 0.3 * rec(a) - s(b).m - 0.3 * rec(b) + (Math.random() - 0.5) * 0.1);
    if (tier === "fragile") weak = [...new Set(weak.flatMap((id) => [...(PREREQ[id] || []).filter((p) => pool.includes(p) && !ok(p)), id]))];
    // Notions neuves dans l'ordre du référentiel : l'élève fragile prend les premières (bases d'abord, prérequis acquis) ;
    // l'élève à l'aise pioche plus loin (fenêtre décalée).
    let fresh = pool.filter((id) => !s(id).seen).sort((a, b) => rk(a) - rk(b));
    if (tier === "fragile") fresh = fresh.filter((id) => (PREREQ[id] || []).every(ok));
    const win = tier === "fort" ? fresh.slice(Math.min(4, Math.max(0, fresh.length - 8)), Math.min(4, Math.max(0, fresh.length - 8)) + 20) : fresh.slice(0, tier === "fragile" ? 10 : 20); // fenêtre élargie (20.11) : plusieurs chapitres, pour la limite de 2 par chapitre
    fresh = byRecent(sh(win.length ? win : fresh));
    const want = tier === "fort" ? [1, 1, n - 2] : tier === "fragile" ? [1, n - 2, 1] : [Math.round(n / 3), Math.round(n / 3), n - 2 * Math.round(n / 3)];
    const groups = [strong, weak, fresh], out = [], used = new Set();
    // Au plus 2 notions du même chapitre par séance (20.11) : un élève qui rate tout un chapitre (ex. proportionnalité,
    // durées et vitesses) ne reçoit plus que ça ; les places libérées vont aux autres chapitres, sinon on lève la limite.
    const fam = (id) => { try { return this.themeKey(state.profile, id) || theme(id); } catch (e) { return theme(id); } };
    const famN = (id) => out.filter((x) => fam(x) === fam(id)).length;
    const take = (g, cap = true) => { const last = out.length ? theme(out[out.length - 1]) : "", free = (id) => !used.has(id) && (!cap || famN(id) < 2); let k = g.findIndex((id) => free(id) && theme(id) !== last); if (k < 0) k = g.findIndex(free); if (k < 0) return false; used.add(g[k]); out.push(g[k]); return true; };
    for (let round = 0; out.length < n && round < 3 * n; round++) { const gi = [1, 2, 0][round % 3]; if (want[gi] > 0 && take(groups[gi])) want[gi]--; else if (want.every((w, i) => w <= 0 || !groups[i].some((id) => !used.has(id) && famN(id) < 2))) { if (!groups.some((g) => take(g))) break; } }
    while (out.length < n && (groups.some((g) => take(g)) || groups.some((g) => take(g, false)))) {}
    const cap = difficultyCap(state.profile);
    state.freeRecent = [...(state.freeRecent || []), out.slice()].slice(-2);
    return out.map((id) => { let d = this.difficulty(state, id); if (tier === "fort" && s(id).seen > 0 && s(id).m >= 0.85) d = Math.min(cap, d + 1); return id + "|" + d; });
  },

  eligible(state) {
    return Object.entries(state.notions).filter(([, s]) => s.status === "vu" || s.status === "encours").map(([id]) => id);
  },

  // Difficulté : visée ≈ 70 % de réussite (question ≈ 150 points sous le Mathélo), corrigée par la maîtrise de la notion.
  difficulty(state, id) {
    const cap = difficultyCap(state.profile), m = state.notions[id].m;
    let best = 1, bestGap = Infinity;
    for (let d = 1; d <= cap; d++) {
      const gap = Math.abs(itemRating(state.profile, id, d) - (state.elo.r - 150));
      if (gap < bestGap) { bestGap = gap; best = d; }
    }
    if (m < 0.3) best = Math.max(1, best - 1);
    if (m > 0.8) best = Math.min(cap, best + 1);
    // Niveau 4 (problème) : notion solide, Mathélo suffisant, environ une fois sur trois.
    if (hasProb(id) && m >= 0.7 && state.elo.r >= itemRating(state.profile, id, 4) - 250 && Math.random() < 0.35) return 4;
    return best;
  },

  // Mise à jour du Mathélo. score : 1, 0,5 ou 0. K plus grand au début (positionnement rapide).
  updateElo(state, id, d, score, weight = 1) {
    this.snap(state);
    const e = state.elo, q = itemRating(state.profile, id, d);
    const expected = 1 / (1 + Math.pow(10, (q - e.r) / 400));
    const K = (e.n < 20 ? 48 : e.n < 60 ? 32 : 20) * weight; // calibrage progressif : provisoire tant que n < 20
    const delta = Math.round(K * (score - expected));
    e.r = Math.max(400, e.r + delta);
    e.n++;
    const today = day(), last = e.log[e.log.length - 1];
    if (last && last[0] === today) last[1] = e.r; else e.log.push([today, e.r]);
    e.log = e.log.slice(-90);
    return delta;
  },

  // Anti-répétition (audit 13.11) : une question déjà posée parmi les 15 dernières de la notion est retirée.
  // Au CO (9e–11e), une réponse numérique est un résultat : pas d'opération ni de calculatrice (14.11).
  // Sauf les notions où l'écriture attendue contient elle-même une puissance.
  finalize(state, id, q) {
    const p = state && state.profile;
    if (q && p && p.system === "CH" && p.track !== "mp" && p.grade <= 10) racineCO(q);
    const mark = (sp) => { if (sp && sp.kind === "value" && !sp.sci) sp.final = true; };
    // 22.11 (retour de l'auteur, sec. II) : « sans calculatrice » = le résultat est exigé à tous les niveaux.
    if (q && !["sci", "scicalc", "puiss"].includes(id) && /sans calculatrice/i.test(q.q || "")) { mark(q.spec); return q; }
    if (!q || !p || p.system !== "CH" || p.grade > 11 || ["sci", "scicalc", "puiss"].includes(id)) return q;
    mark(q.spec); (q.parts || []).forEach((x) => mark(x.spec));
    return q;
  },
  make(state, id, d, seed) {
    let level = d || this.difficulty(state, id);
    const asked = level; /* 25.11 : niveau demandé (carnet, baisse après erreur) ; le contenu peut être remonté ci-dessous */
    const keep = (q) => { if (q && typeof q === "object" && q.d && q.d !== 4 && asked !== 4) q.d = asked; return q; };
    /* 25.11 (audit de niveau 11e, tools/niveau_11.md ; règle de l'enseignant du 24.11 : le niveau 1 = automatismes de
       l'année, jamais ceux d'une année inférieure) : notions de 9e-10e reprises en 11e (CO). Leur niveau 1 est un
       automatisme de 9e-10e (« 3x + 9 = 33 », « calcule 4 - 5x pour x = -4 », « 3/4 de 200 CHF ») : en 11e, le niveau 1
       tire les formes du niveau 2 (le code de la question reste reproductible : …-2-…). La 9e et la 10e ne changent pas.
       rel n'y est pas : son niveau 2 tire déjà le niveau 3 en 11e (UP2 ci-dessous). */
    const UP11 = ["prio", "fracadd", "fracconv", "fracmul", "fracops", "puiss", "sci", "scicalc", "rac", "carres", "pyth", "pythfig", "vol",
      "vitesse", "valnum", "litelab", "reduire", "monomes", "distrib", "eq1", "eqfrac", "probeq", "affine", "repere", "tabval", "pctvar"];
    if (level === 1 && UP11.includes(id) && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 11) level = 2;
    /* 25.11 (audit de niveau 9e–10e, tools/niveau_910.md) : en 9e, le niveau 1 de ces notions était un automatisme du
       primaire (« chiffre des unités de 98,245 », « le plus grand de 5,9 et 5,96 », périmètre d'un triangle 3-7-9, aire d'un
       carré de côté 9, faces d'un pavé, périmètre d'un losange) : il tire les formes du niveau 2. La 10e et la 11e ne changent pas. */
    const UP9 = ["decread", "deccomp", "perim", "aire1", "solides", "quadri"];
    if (level === 1 && UP9.includes(id) && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 9) level = 2;
    // Notions de révision trop faciles au niveau 2 pour les grandes classes (21.11, « relève le niveau 2 pour la 11e ») :
    // dès la classe indiquée, le niveau 2 tire les formes du niveau 3 (le code de la question reste reproductible : …-3-…).
    const UP2 = { rel: 11 };
    if (level === 2 && UP2[id] && state && state.profile && state.profile.grade >= UP2[id]) level = 3;
    /* 24.11 (audit de niveau 1re Collège, tools/niveau_1c.md ; alerte de l'enseignant : « on demande à un élève de 1re ce qu'on
       demanderait à un élève de 9e ») : notions du CO reprises au Collège (1re–4e, filière gymnasiale). Leur niveau 1 est un
       automatisme de 9e–10e : au Collège, le niveau 1 tire le niveau 2 et le niveau 2 le niveau 3 ; UPC_MIN impose un niveau minimal. */
    if (level < 3 && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade >= 12) {
      if (UPC_MIN[id]) level = Math.max(level, UPC_MIN[id]); else if (UPC.includes(id)) level += 1;
    }
    if (seed) return keep(this.finalize(state, id, this.build(id, level, seed)));
    const rec = ((state.recentQ = state.recentQ || {})[id] = (state.recentQ[id] || []));
    const key = (q) => { let h = 0; for (const c of String(q.q) + JSON.stringify(q.spec)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; };
    let q;
    // Contextes variés (règle du 14.11) : un contexte (q.ctx) vu dans les 2 dernières questions de la notion est évité.
    const ctxs = ((state.recentCtx = state.recentCtx || {})[id] = (state.recentCtx[id] || []));
    // Formes variées (14.11, « les questions doivent absolument être variées ») : la forme d'une question
    // (son énoncé aux nombres près) vue dans les 2 dernières questions de la notion est évitée quand c'est possible.
    const forms = ((state.recentForm = state.recentForm || {})[id] = (state.recentForm[id] || []));
    let found = false, fresh1 = null, lastOk = null, lv = level;
    /* 25.11 : une forme hors programme de la classe (HORS_CO, 9e–10e) est refaite ; si le niveau n'a plus aucune forme
       du programme (défi d'une autre année), on descend d'un niveau. */
    for (let k = 0, t = 0; k < 16 && !found && t < 60; t++) {
      if (t === 30 && !lastOk && lv > 1) lv -= 1;
      q = this.build(id, lv);
      if (horsCO(state, id, q)) continue;
      k++; lastOk = q;
      const fresh = !rec.includes(key(q)) && !(q.ctx && ctxs.includes(q.ctx));
      if (fresh && !forms.includes(qForm(q))) found = true;
      else if (fresh && !fresh1) fresh1 = q;
    }
    if (!found && fresh1) q = fresh1; // une seule forme possible : au moins une question jamais vue
    else if (!found && lastOk) q = lastOk;
    rec.push(key(q)); state.recentQ[id] = rec.slice(-15);
    if (q.ctx) state.recentCtx[id] = [...ctxs, q.ctx].slice(-2);
    state.recentForm[id] = [...forms, qForm(q)].slice(-2);
    return keep(this.finalize(state, id, q));
  },
  // Question reproductible : même notion, niveau et graine → même question.
  build(id, level, seed) {
    seed = seed || Math.floor(Math.random() * 46655) + 1;
    R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0));
    const code = id + "-" + level + "-" + seed.toString(36);
    /* 25.11 : PROBX (variantes.js, audit 9e–10e) = défis ajoutés, réservés à certaines classes (p.co). */
    if (level === 4 && hasProb(id)) { const p = R.pick(probList(id).concat((typeof PROBX !== "undefined" && PROBX[id]) || []))(); return { ...p, id, d: 4, seed, code, spec: { kind: "multi" }, hint: p.hints[0] }; }
    // Écritures maladroites des générateurs (audit 13.11) : « 1x » → « x », « + -2 » → « - 2 », « - -3 » → « + 3 ».
    const tidy = (t) => typeof t !== "string" ? t : t.replace(/([(=+\-\s{]|\\\()(-?)1([a-z])(?![a-z{])/g, "$1$2$3").replace(/\+\s*-\s*(?=[\da-z(\\])/g, "- ").replace(/-\s*-\s*(?=[\da-z(\\])/g, "+ ");
    // Pas de question triviale (règle du 14.11 : la trivialité fait décrocher) : tirage refait, de façon
    // déterministe (même code → même question), jusqu'à 6 essais ; le dernier est gardé quoi qu'il arrive.
    let q, keep = null;
    for (let k = 0; k < 6; k++) {
      if (k) R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0) + k * 15485863);
      // Variantes (variantes.js) : la forme d'origine ou une forme ajoutée, au hasard.
      /* 25.11 : VARX (variantes.js, audit 9e–10e) = formes ajoutées qui survivent aux modules de chapitre (ils vident VAR[id]). */
      const vs = [].concat((typeof VAR !== "undefined" && VAR[id] && VAR[id][level]) || [], (typeof VARX !== "undefined" && VARX[id] && VARX[id][level]) || []), vk = vs.length ? Math.floor(R.rand() * (vs.length + 1)) : 0;
      q = vk ? vs[vk - 1]() : GEN[id](level);
      q.q = tidy(q.q); q.sol = tidy(q.sol);
      if (trivialQ(q, k)) continue;
      if (!answerShown(q)) { keep = null; break; }
      if (!keep) keep = q; // non triviale mais réponse visible : gardée en réserve
    }
    if (keep) q = keep;
    if (q.guide) q.guide = q.guide.map((g) => ({ ...g, ask: colonBreak(tidy(g.ask)), sol: colonBreak(tidy(g.sol)) }));
    q.q = colonBreak(q.q); q.sol = colonBreak(q.sol);
    if (q.traps) q.traps = q.traps.map((t) => ({ ...t, m: colonBreak(t.m) }));
    if (q.hints) q.hints = q.hints.map(colonBreak);
    if (q.traps && q.spec && q.spec.kind === "value") q.traps = q.traps.filter((t) => isFinite(t.v) && Math.abs(t.v - q.spec.value) > Math.max(q.spec.round || 0, 1e-6 * (Math.abs(q.spec.value) >= 1 ? Math.abs(q.spec.value) : Math.max(Math.abs(q.spec.value), 1e-300))));
    if (q.parts) q.parts = q.parts.map((p) => ({ ...p, label: colonBreak(tidy(p.label)) }));
    // Consigne de forme : « notation scientifique » contrôlée par le correcteur.
    if (q.spec && q.spec.kind === "value" && /notation scientifique/.test(q.q) && !/^Calcule : /.test(q.q)) {
      q.spec = { ...q.spec, sci: true };
      if (!q.canon) { const e = Math.floor(Math.log10(Math.abs(q.spec.value)) + 1e-9), a = +(q.spec.value / 10 ** e).toFixed(8); q.canon = String(a).replace(".", ",") + "*10^" + e; }
    }
    return { ...q, id, d: level, seed, code, hint: q.hint || HINTS[id] };
  },
  // 25.11 : forme hors programme pour la classe de l'élève (HORS_CO, 9e–10e) ; utilisé aussi par les sujets et les QCM.
  horsCO(state, id, q) { return horsCO(state, id, q); },
  // Lecture d'un code « eq2disc-2-k3f » → question exacte (ou null).
  fromCode(code) {
    const m = /^([a-z0-9]+)-([1-4])-([a-z0-9]+)$/.exec(String(code).trim().toLowerCase());
    if (!m || !GEN[m[1]] || (m[2] === "4" && !hasProb(m[1]))) return null;
    return this.build(m[1], +m[2], parseInt(m[3], 36));
  },

  // Positionnement : premier repère rapide (5 notions vues ou en cours) ; le niveau se précise ensuite au fil des séances, en variant les thèmes, notions récentes d'abord.
  placementPlan(state) {
    const all = this.eligible(state), recent = all.filter((id) => this.isRecent(state, id));
    const ids = recent.length >= 3 ? recent : all;
    const byTheme = {};
    for (const id of ids) {
      const n = NOTIONS.find((x) => x.id === id);
      (byTheme[n.theme] = byTheme[n.theme] || []).push(n);
    }
    const pl = (n) => placeOf(n, state.profile);
    Object.values(byTheme).forEach((arr) => arr.sort((a, b) => pl(b)[0] - pl(a)[0] || pl(b)[1] - pl(a)[1]));
    const plan = [];
    while (plan.length < 5 && Object.values(byTheme).some((a) => a.length)) {
      for (const arr of Object.values(byTheme)) if (arr.length && plan.length < 5) plan.push(arr.shift().id);
    }
    return plan;
  },

  // Résultat d'une question de positionnement : true, false ou null (« je ne sais pas »).
  placementResult(state, id, ok, d = 2) {
    this.updateElo(state, id, d, ok === true ? 1 : 0);
    this.recordComp(state, id, d, ok === true ? 1 : 0);
    const s = state.notions[id];
    if (ok === true) Object.assign(s, { m: 0.75, box: 2, due: addDays(day(), 3) });
    else if (ok === false) Object.assign(s, { m: 0.3, box: 0, due: day() });
    else Object.assign(s, { m: 0.2, box: 0, due: day() });
    s.placed = true;
  },

  // Séance du jour : notions dues et fragiles d'abord, puis « en cours », puis rappels espacés.
  // Notions anciennes (avant l'année précédente) que le parcours de l'élève demande de remobiliser (24.11) :
  // 1) une notion ancienne travaillée dans l'app et ratée ; 2) les prérequis anciens d'une notion de l'année qui coince ;
  // 3) un Mathélo en forte baisse (au moins 120 points sous son meilleur des 30 derniers jours) : toutes les anciennes.
  oldNeed(state) {
    const el = this.eligible(state), old = el.filter((id) => !this.isRecent(state, id)), need = new Set();
    const coince = (s) => s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
    for (const id of old) if (coince(state.notions[id])) need.add(id);
    for (const id of el) if (!old.includes(id) && state.notions[id].seen >= 2 && coince(state.notions[id])) for (const p of PREREQ[id] || []) if (old.includes(p)) need.add(p);
    if (this.eloDrop(state)) old.forEach((id) => need.add(id));
    return need;
  },
  eloDrop(state) { const lim = addDays(day(), -30), peak = Math.max(state.elo.r, ...((state.elo.log || []).filter((x) => x[0] >= lim).map((x) => x[1]))); return peak - state.elo.r >= 120; },
  // Notion « actuelle » : année en cours ou précédente. Les plus anciennes ne reviennent qu'en remédiation.
  isRecent(state, id) {
    const pl = placeOf(NOTIONS.find((n) => n.id === id), state.profile);
    const n = NOTIONS.find((x) => x.id === id);
    return pl && (pl[0] >= state.profile.grade - 1 || (state.profile.track !== "mp" && (n.again || []).includes(state.profile.grade)));
  },
  // Toutes les notions vues sont candidates ; les anciennes sont filtrées par niveau dans oldLevels.
  pool(state, kind) {
    return this.eligible(state);
  },
  // Notion ancienne : jamais triviale. Niveau 3 ou problème, assez proche de la cible ;
  // ou niveau ≥ 2 si l'élève l'a ratée (fragile), car alors elle n'est pas triviale pour lui.
  oldLevels(state, id, levels, target) {
    const s = state.notions[id], weak = s.m < 0.45 || this.eloDrop(state); /* 24.11 : baisse du Mathélo = remédiation, niveau 2 permis */
    return levels.filter((d) => weak ? d >= 2 : d >= 3 && itemRating(state.profile, id, d) >= target - 150);
  },

  // Format du jour : le plus en retard sur l'équilibre des 7 derniers jours, jamais celui de la veille.
  chooseFormat(state, exclude = [], today = day()) {
    const since = addDays(today, -7), log = (state.formats || []).filter((f) => f.date >= since && f.date < today);
    const recentRev = log.some((x) => x.f === "revision" && x.date >= addDays(today, -3));
    const yesterday = (state.formats || []).filter((f) => f.date < today).slice(-1)[0];
    const due = this.eligible(state).filter((id) => state.notions[id].due <= today).length;
    let best = null;
    for (const f of Object.keys(FORMATS)) {
      if (exclude.includes(f)) continue;
      let sc = WEEK[f] - log.filter((x) => x.f === f).length;
      if (yesterday && yesterday.f === f) sc -= 3;
      if (f === "revision") sc += due >= 4 && !recentRev ? 1 : due >= 4 ? 0 : -1;
      if (f === "defi" && !this.eligible(state).some((id) => hasProb(id) && this.isRecent(state, id))) sc -= 0.5;
      sc += Math.random() * 0.4;
      if (!best || sc > best.sc) best = { f, sc };
    }
    return best ? best.f : "mixte";
  },

  planSession(state, format) {
    const f = format || this.todayFormat(state);
    return this.planSlots(state, FORMATS[f].slots);
  },
  // Format retenu pour aujourd'hui (stable dans la journée, sauf « Autre format »).
  todayFormat(state) {
    const today = day();
    // Format annoncé la veille au bilan (21.11) : promesse tenue.
    if (!state.today || state.today.date !== today) state.today = { date: today, f: state.tomorrow && state.tomorrow.date === today && FORMATS[state.tomorrow.f] ? state.tomorrow.f : this.chooseFormat(state) };
    return state.today.f;
  },
  // Format de demain, choisi dès aujourd'hui et annoncé au bilan (21.11).
  tomorrowFormat(state) {
    const tm = addDays(day(), 1);
    if (!state.tomorrow || state.tomorrow.date !== tm) state.tomorrow = { date: tm, f: this.chooseFormat(state, [], tm) };
    return state.tomorrow.f;
  },
  // « Changer de format » : toujours le même ordre (défi → automatismes → applications → mixte → révision → défi…), demande du 19.11.
  otherFormat(state) {
    const cur = this.todayFormat(state), order = Object.keys(FORMATS);
    state.today = { date: day(), f: order[(order.indexOf(cur) + 1) % order.length] };
    return state.today.f;
  },
  // Trace du format fait (pour l'équilibre sur 7 jours).
  logFormat(state, f) {
    const today = day();
    state.formats = (state.formats || []).filter((x) => x.date >= addDays(today, -30));
    if (!state.formats.some((x) => x.date === today && x.f === f)) state.formats.push({ date: today, f });
  },

  // Remplit des créneaux : pour chacun, la notion ET le niveau les plus proches de la cible fixée par le Mathélo.
  planSlots(state, slots) {
    const today = day(), elo = state.elo.r, cap = difficultyCap(state.profile), used = new Set(), plan = [];
    const maxOld = slots.includes("rev") ? 2 : 1;
    let old = 0;
    // Créneau « Rappel » : une notion ancienne, jamais triviale. Une séance sur trois environ ;
    // en révision, chaque fois qu'une notion ancienne est fragile. Sans candidate valable : créneau normal.
    // 24.11 (règle de l'auteur : « c'est le parcours de l'élève qui dicte s'il y a besoin de remobiliser des compétences
    // antérieures ») : plus de rappel tiré au hasard ; une notion ancienne ne revient que si le parcours le justifie.
    const need = [...this.oldNeed(state)];
    const wantRappel = slots.length > 1 && need.length > 0;
    const rappelAt = wantRappel ? slots.length - 1 - Math.floor(Math.random() * Math.min(2, slots.length)) : -1;
    // « En ce moment en classe » : environ 2 créneaux sur 3 portent sur le chapitre choisi par l'élève.
    const nowIds = this.nowActive(state) ? state.now.ids.filter((id) => state.notions[id] && ["vu", "encours"].includes(state.notions[id].status)) : [];
    const nowK = nowIds.length ? (slots.length === 1 ? 1 : Math.round((slots.length * 2) / 3)) : 0;
    const usedPair = new Set();
    const choose = (kind, base, rappel, only) => {
      let best = null, pool = only || this.pool(state, base);
      if (kind === "rev" && !only) { const due = pool.filter((id) => state.notions[id].due <= today || state.notions[id].m < 0.5); if (due.length) pool = due; }
      for (const id of pool) {
        const s = state.notions[id], recent = this.isRecent(state, id), target = elo + TARGET[kind] + (s.easy || 0) * 120;
        if (rappel ? recent : !recent) continue; // les anciennes notions ne passent que par le créneau Rappel
        let levels = [1, 2, 3].filter((d) => d <= cap && (base !== "defi" || d >= 2) && (kind !== "drill" || d <= 2 || !recent));
        if ((kind === "defi4" || kind === "defi") && hasProb(id)) levels.push(4);
        if (!recent) levels = this.oldLevels(state, id, levels, target);
        for (const d of levels) {
          let sc = Math.abs(itemRating(state.profile, id, d) - target) / 100;
          if (rappel) sc = (s.m < 0.45 ? -1 : 0) + Math.max(0, itemRating(state.profile, id, d) - target) / 200;
          if (s.due <= today && base !== "defi") sc -= 0.6;
          if (kind === "app" || kind === "rev") sc -= (1 - s.m) * 0.8;
          if (s.status === "encours") sc -= 0.4;
          if (this.prepActive(state) && state.prep.ids.includes(id)) sc -= 1.2;
          if (used.has(id)) sc += only ? 0.5 : 2;
          if (usedPair.has(id + "|" + d)) sc += 1;
          if (d === 4) sc -= kind === "defi4" ? 3 : 0.3;
          sc += Math.random() * 0.5;
          if (!best || sc < best.sc) best = { id, d, sc };
        }
      }
      return best;
    };
    const nowPart = [];
    for (const [si, kind] of slots.entries()) {
      const base = kind === "defi4" ? "defi" : kind;
      if (si < nowK && si !== rappelAt) {
        const b = choose(kind, base, false, nowIds);
        if (b) { used.add(b.id); usedPair.add(b.id + "|" + b.d); nowPart.push(b.id + "|" + b.d + "|" + base); continue; }
      }
      let best = si === rappelAt && old < maxOld ? choose(kind, base, true, need) : null;
      if (best) old++; else best = choose(kind, base, false);
      if (!best) best = choose(kind, base, true); // aucune notion de l'année disponible
      if (!best) continue;
      used.add(best.id);
      plan.push(best.id + "|" + best.d + "|" + base);
    }
    // Le chapitre du moment d'abord, du plus simple au plus difficile.
    return [...nowPart.sort((x, y) => +x.split("|")[1] - +y.split("|")[1]), ...plan];
  },

  // « Trop facile » : l'élève passe la question. Demi-victoire au Mathélo (sans répondre, on ne compte pas plein),
  // la notion monte, et son niveau visé est relevé (décalage par notion, qui retombe si l'élève échoue ensuite).
  tooEasy(state, id, d, kind) {
    this.snap(state);
    const s = state.notions[id];
    s.easy = Math.min(3, (s.easy || 0) + 1);
    s.m = Math.min(1, s.m + (1 - s.m) * 0.25);
    s.box = Math.min(5, s.box + 1);
    s.due = addDays(day(), INTERVALS[s.box]);
    if (s.status === "encours" && s.m > 0.7) s.status = "vu";
    const delta = this.updateElo(state, id, d, 1, 0.5);
    this.recordComp(state, id, d, 1);
    // Remplaçante : même notion, un cran au-dessus (si possible), sinon la question suivante du programme.
    const cap = difficultyCap(state.profile), top = hasProb(id) && kind !== "drill" ? 4 : Math.min(3, cap);
    return { delta, next: d < top && d < 4 ? id + "|" + (d + 1) + "|" + (kind === "drill" ? "app" : kind || "app") : null };
  },

  // Score Moodle : 1 au premier essai, 0,5 au deuxième, 0 ensuite.
  record(state, id, d, tries, solved, partial) {
    this.snap(state);
    const s = state.notions[id];
    s.fails = (partial !== undefined ? partial < 0.5 : !solved) ? (s.fails || 0) + 1 : solved && tries === 1 ? 0 : s.fails || 0;
    if (typeof Badges !== "undefined") Badges.onAnswer(state, id, d, tries, solved, partial);
    if (partial !== undefined) { // problème : score partiel 0..1
      this.recordComp(state, id, d, partial);
      s.seen++;
      s.m = Math.min(1, Math.max(0, s.m + (partial - 0.5) * 0.2));
      if (partial >= 0.99) { s.box = Math.min(5, s.box + 1); s.ok++; } else if (partial < 0.5) s.box = 0;
      s.due = addDays(day(), partial >= 0.99 ? INTERVALS[s.box] : 1);
      return partial;
    }
    const today = day();
    s.seen++;
    if (solved && tries === 1) {
      s.m = Math.min(1, s.m + (1 - s.m) * (0.18 + 0.06 * d));
      s.box = Math.min(5, s.box + 1);
      s.ok++;
    } else if (solved) {
      s.m = Math.min(1, s.m + (1 - s.m) * 0.06);
    } else {
      s.m = s.m * 0.6;
      s.box = 0;
      if (s.easy) s.easy--;
    }
    s.due = addDays(today, solved && tries === 1 ? INTERVALS[s.box] : 1);
    if (s.status === "encours" && s.m > 0.7) s.status = "vu";
    const sc = solved ? (tries === 1 ? 1 : 0.5) : 0;
    this.recordComp(state, id, d, sc);
    this.unlock(state);
    return sc;
  },

  finishDay(state, answered, score) {
    const today = day();
    if (answered > 0) {
      if (typeof Badges !== "undefined") Badges.onDay(state, today);
      // Joker de série (21.11) : un jour manqué par semaine (du lundi au dimanche) ne casse pas la série.
      let joker = false;
      if (state.streak.last !== today) {
        const wk = this.weekOf(today);
        if (state.streak.last === addDays(today, -1)) state.streak.count++;
        else if (state.streak.count && state.streak.last === addDays(today, -2) && state.streak.jokerWk !== wk) { state.streak.count++; state.streak.jokerWk = wk; joker = true; }
        else state.streak.count = 1;
      }
      state.streak.last = today;
      state.streak.best = Math.max(state.streak.best || 0, state.streak.count);
      const h = state.history.find((x) => x.date === today);
      if (h) { h.n += answered; h.score += score; } else state.history.push({ date: today, n: answered, score });
      state.history = state.history.slice(-120);
      return joker ? "joker" : "";
    }
    return "";
  },
  // Semaine (lundi) d'une date : clé du joker de série.
  weekOf(d) { const x = new Date(d + "T12:00:00"); return addDays(d, -((x.getDay() + 6) % 7)); },
  // Joker encore disponible cette semaine ?
  jokerFree(state, today = day()) { return state.streak.jokerWk !== this.weekOf(today); },

  // Notion de base à reprendre après deux échecs de suite (la moins maîtrisée de ses prérequis connus).
  remediation(state, id) {
    const s = state.notions[id];
    if (!s || (s.fails || 0) < 2) return null;
    const cands = (PREREQ[id] || []).filter((p) => state.notions[p] && GEN[p]);
    if (!cands.length) return null;
    s.fails = 0;
    return cands.sort((a, b) => state.notions[a].m - state.notions[b].m)[0];
  },

  // « Je prépare mon test » : notions choisies, actif jusqu'au jour du test inclus.
  // « En ce moment en classe » (13.11) : 1 à 5 notions choisies par l'élève (3 jusqu'au 20.11) ; question de relance chaque semaine (22.11).
  nowActive(state) { return !!(state.now && state.now.ids && state.now.ids.length); },
  // 22.11 (demande de l'auteur) : relance chaque semaine (7 jours) au lieu de 3 semaines, pour inciter à changer de chapitre.
  nowStale(state, today = day()) { return this.nowActive(state) && addDays(state.now.since, 7) <= today; },
  setNow(state, ids) {
    state.now = ids.length ? { ids, since: day() } : null;
    for (const id of ids) { const n = state.notions[id]; if (n && n.status !== "vu" && n.status !== "encours") { Object.assign(n, { status: "encours", m: Math.max(0.4, n.m), due: day() }); delete n.retry; } }
  },
  // Notions probables du moment : ouvertes et pas encore maîtrisées, puis les suivantes dans l'ordre du référentiel.
  nowSuggest(state, n = 6) {
    const p = state.profile, cur = this.catalog(p).filter((c) => c.current && state.notions[c.id]).sort((a, b) => this.rank(p, a.id) - this.rank(p, b.id));
    const open = cur.filter((c) => ["vu", "encours"].includes(state.notions[c.id].status) && !(state.notions[c.id].m >= 0.75 && state.notions[c.id].ok >= 3));
    const next = cur.filter((c) => ["avenir", "nonvu"].includes(state.notions[c.id].status));
    return [...open.slice(-4), ...next.slice(0, n)].slice(0, n).map((c) => c.id);
  },
  prepActive(state) { return !!(state.prep && state.prep.ids.length && state.prep.date >= day()); },
  planPrep(state) {
    const ids = state.prep.ids.filter((id) => state.notions[id]);
    const n = 7;
    const order = [...ids].sort((a, b) => state.notions[a].m - state.notions[b].m);
    const plan = [];
    for (let i = 0; plan.length < n - 1; i++) plan.push(order[i % order.length]);
    const withProb = order.filter((id) => hasProb(id));
    plan.push(withProb.length ? "PROB:" + withProb[0] : order[0]);
    return plan;
  },

  // Problème de la semaine : une notion « à problème » parmi celles vues, fixée pour la semaine.
  // Calé sur le Mathélo (22.11 : un seul problème par semaine, il doit être à la bonne hauteur) :
  // les 3 notions dont le défi (niveau 4) est le plus proche du Mathélo, une notion pas encore travaillée (m < 0,3) en dernier recours.
  weeklyProblem(state) {
    const d = new Date(), week = d.getFullYear() + "-" + Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5);
    const ids = this.eligible(state).filter((id) => hasProb(id));
    if (!ids.length) return null;
    if (state.weeklyPick && state.weeklyPick.week === week && state.weeklyPick.v === 2 && ids.includes(state.weeklyPick.id)) return state.weeklyPick.id; /* v2 (24.11) : nouveau choix */
    const r = state.elo.r, m = (id) => (state.notions[id] || {}).m || 0;
    // 24.11 (auteur en 4e : « une factorisation vraiment simple ») : un vrai défi. Notions de l'année ou de l'année
    // précédente d'abord (les plus anciennes pénalisées) ; difficulté visée au-dessus du Mathélo (+150), plus faciles pénalisées.
    const g = state.profile.grade, yr = (id) => { try { const p = placeOf(NOTIONS.find((n) => n.id === id), state.profile); return p ? p[0] : g; } catch (e) { return g; } };
    const score = (id) => { const it = itemRating(state.profile, id, 4), gap = g - yr(id);
      return Math.abs(it - (r + 150)) + (it < r ? 150 : 0) + (gap >= 2 ? 250 * (gap - 1) : 0) + (m(id) < 0.3 ? 400 : 0); };
    const best = ids.slice().sort((a, b) => score(a) - score(b)).slice(0, 3);
    const n = +week.split("-")[1], id = best[n % best.length];
    state.weeklyPick = { week, id, v: 2 };
    return id;
  },

  isProvisional(state) { return state.elo.n < 20; },

  themeLevels(state) {
    const out = {};
    for (const [id, s] of Object.entries(state.notions)) {
      if (s.status !== "vu" && s.status !== "encours") continue;
      const th = NOTIONS.find((n) => n.id === id).theme;
      (out[th] = out[th] || []).push(s.m);
    }
    return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length]));
  },
};

// Deux-points lisibles (16.11) : rappels de cours et « Devine » des leçons actives, une fois tout chargé.
if (typeof LESSONS !== "undefined") for (const L of Object.values(LESSONS)) if (L && typeof L === "object") { for (const k of ["intro", "regle", "piege"]) if (typeof L[k] === "string") L[k] = colonBreak(L[k]); if (Array.isArray(L.exemple)) L.exemple = L.exemple.map(colonBreak); }
if (typeof ACTIVE !== "undefined") for (const A of Object.values(ACTIVE)) if (A && A.predict) A.predict.why = colonBreak(A.predict.why);
