/* Contrôles de vraisemblance (26.11) : appliqués à chaque élément de VRAI.items (tests/vrai_collecte.js).
   VRAI_CHECK(x) rend une liste de [clé, détail]. Les clés « graves » font échouer tests/vraisemblance.html. */
const VRAI_CHECK = (() => {
  const NUM = "[−-]?\\d+(?:'\\d{3})*(?:,\\d+)?";
  const num = (s) => +String(s).replace(/'/g, "").replace(",", ".").replace("−", "-");
  const dec = (v) => { const s = String(+(+v).toFixed(10)); return s.includes(".") ? s.split(".")[1].length : 0; };
  const BAD = /NaN|Infinity|undefined|\[object|\bnull\b/;
  const U_POS = "cm|mm|dm|km|m|kg|g|CHF|€|min|ans|élèves|personnes|L|dl|cl|ml|m²|cm²|m³|cm³|dm³|km/h|m/s|h";
  const RE_NEG = new RegExp("(?<!solde (?:de |)|altitude (?:de |)|profondeur (?:de |))(?:^|[=:(]|\\b(?:de|à|est|vaut|mesure|mesurent|coûte|coûtent|pèse|pèsent|dure|longueur|largeur|hauteur|rayon|côté|prix))\\s*[−-]\\s?(\\d[\\d',]*)\\s?(" + U_POS + ")(?![\\w²³/])", "g");
  const RE_ZERO = new RegExp("(?:^|[\\s(])0 (cm|mm|km|kg|CHF|€|élèves|personnes|m²|cm²|m³|cm³|L)(?![\\w²³/])");
  const RE_SEG = new RegExp("\\b([A-Z])([A-Z]) = (" + NUM + ")(?! ?°)(?!\\s*[·x+])", "g");
  const RE_COTES = new RegExp("côtés?(?: qui)?(?: de| mesurant| mesurent| :| valent| longs de)? (" + NUM + ")(?: ?[a-z]{1,2})?, (" + NUM + ")(?: ?[a-z]{1,2})? et (" + NUM + ")", "i");
  const UNIT_ROUND = [[/au dixième/i, 0.1], [/au centième/i, 0.01], [/au millième/i, 0.001], [/(arrondie? |)à l'unité|à l'entier|au (franc|centime|euro) près|arrondi(e|s)? au (franc|degré|mètre|centimètre|kilomètre|kilo|gramme|litre|cm|mm|m)\b/i, 1]];
  const COUNT = /combien (?:de|d')\s*(personnes|élèves|bus|cars|voitures|boîtes|bouteilles|billets|pots|sacs|cartons|tables|chaises|joueurs|équipes|enfants|participants|places|pièces|tickets|objets|livres|carreaux|dalles|rouleaux|planches|paquets|camions|voyages|trajets|caisses|bidons|seaux|arbres|piquets|poteaux|plants|tuiles|briques|œufs|bonbons|cartes|photos|sachets|plaques|lots|groupes|rangées|marches|tours|allers|vélos|parts|invités|spectateurs|bancs|flacons|verres|canettes|pommes|gâteaux|crêpes)\b/i;
  const POSQ = /\b(longueur|aire|volume|périmètre|distance|prix|coût|masse|durée|hauteur|rayon|côté|diamètre|surface|contenance|capacité|largeur)\b/i;
  /* question (phrase) et spec à contrôler ensemble */
  const pairs = (x) => {
    const L = [];
    if (x.spec && x.spec.kind === "value") L.push([x.txt, x.txt, x.spec]);
    for (const p of x.parts) if (p.spec && (p.spec.kind === "value" || p.spec.kind === undefined)) L.push([p.label || x.txt, x.txt + " " + p.label, p.spec]);
    return L;
  };
  return function (x) {
    const F = [], add = (k, m) => F.push([k, m]);
    let m;
    const all = x.txt + " " + x.parts.map((p) => p.label).join(" ");
    /* 1. valeurs cassées */
    if (BAD.test(x.raw) || BAD.test(x.txt) || BAD.test(x.sol) || x.parts.some((p) => BAD.test(p.label)) || x.guide.some((g) => BAD.test(g.label)) || BAD.test(x.fig.replace(/aria-[a-z]+="[^"]*"/g, ""))) add("cassé", (all + " SOL " + x.sol).match(/.{0,60}(NaN|Infinity|undefined|\[object|\bnull\b).{0,30}/) ? RegExp.lastMatch : "fig");
    for (const [, , sp] of pairs(x)) if (typeof sp.value !== "number" || !isFinite(sp.value)) add("cassé", "réponse " + sp.value);
    if (/(width|height|\br)="-/.test(x.fig)) add("figure", "dimension négative dans la figure");
    if ((m = /<svg[^>]*viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(x.fig)) && (+m[2] < 40 || +m[1] < 40)) add("figure", "figure écrasée (" + m[1] + " × " + m[2] + ")");
    /* 2. grandeurs négatives ou nulles dans l'énoncé */
    RE_NEG.lastIndex = 0;
    while ((m = RE_NEG.exec(all))) add("grandeur négative", all.slice(Math.max(0, m.index - 40), m.index + 30));
    if ((m = RE_ZERO.exec(all))) add("grandeur nulle", all.slice(Math.max(0, m.index - 40), m.index + 30));
    /* 3. triangles : inégalité triangulaire stricte, hypoténuse la plus longue */
    if (/triangle/i.test(all)) {
      const seg = {}; RE_SEG.lastIndex = 0;
      while ((m = RE_SEG.exec(all))) { const k = [m[1], m[2]].sort().join(""); if (!(k in seg)) seg[k] = num(m[3]); }
      const tris = new Set((all.match(/triangles? ([A-Z]{3})\b/g) || []).map((t) => t.slice(-3)));
      for (const t of tris) {
        const [a, b, c] = [[t[0], t[1]], [t[1], t[2]], [t[0], t[2]]].map((p) => seg[p.sort().join("")]);
        if ([a, b, c].every((v) => v !== undefined)) {
          if (!(a + b > c && a + c > b && b + c > a)) add("triangle impossible", t + " : " + a + ", " + b + ", " + c);
          if ([a, b, c].some((v) => v <= 0)) add("triangle impossible", t + " : côté ≤ 0");
        }
        const rm = new RegExp("\\b" + t + " (?:est )?rectangle en ([A-Z])").exec(all);
        if (rm && t.includes(rm[1])) {
          const o = t.replace(rm[1], ""), hyp = seg[o.split("").sort().join("")];
          for (const L of [rm[1] + o[0], rm[1] + o[1]]) { const v = seg[L.split("").sort().join("")]; if (hyp !== undefined && v !== undefined && v >= hyp) add("triangle impossible", t + " rectangle en " + rm[1] + " : cathète " + v + " ≥ hypoténuse " + hyp); }
        }
      }
      if ((m = RE_COTES.exec(all))) { const [a, b, c] = [m[1], m[2], m[3]].map(num); if (!(a + b > c && a + c > b && b + c > a)) add("triangle impossible", m[0]); }
      const ang = (all.match(new RegExp(NUM + " ?°(?!C)", "g")) || []).map((s) => num(s.replace("°", "")));
      if (ang.some((v) => v <= 0) && !/repère|cercle trigo|rotation|orient|sens/i.test(all)) add("angle de triangle", all.slice(0, 120));
    }
    /* 4. réponses : probabilités, arrondis, effectifs, grandeurs positives */
    for (const [ask, ctx, sp] of pairs(x)) {
      const v = sp.value; if (typeof v !== "number" || !isFinite(v)) continue;
      if (/probabilit/i.test(ask) && !/%|pour ?cent|pourcentage|nombre|combien|espérance|gain|moyenne|cote|issues|effectif|variance|écart/i.test(ask) && (v < 0 || v > 1)) add("probabilité hors [0 ; 1]", ask.slice(0, 120) + " → " + v);
      /* arrondi dans un sens imposé (« au mm supérieur », « minimal », « au maximum ») : la réponse doit déjà être arrondie
         dans ce sens, sans tolérance qui accepterait l'arrondi dans l'autre sens */
      if ((/(arrondi|unité|mm|cm|dixième|centième|franc|entier|centaine|dizaine)[^.]{0,15}(supérieur|inférieur)|par excès|par défaut/i.test(ask) || (COUNT.test(ask) && /au minimum|au moins|faut-il|minimal|au maximum|maximal/i.test(ask))) && !/s'arrondit|est-il|est-elle|vrai|faux|ou /i.test(ask) && sp.round && sp.round >= 0.1 && dec(v) > -Math.log10(sp.round) + 1e-9) add("arrondi dans un sens imposé", ask.slice(0, 120) + " → " + v + " ±" + sp.round);
      for (const [re, st] of UNIT_ROUND) if (re.test(ask) && !/s'arrondit|arrondi (de|d')|nombres? qui|lesquels|lequel/i.test(ask)) {
        if (sp.round && sp.round > st * 1.5 + 1e-12) add("arrondi trop lâche", ask.slice(0, 100) + " → ±" + sp.round);
        if (!sp.round && dec(v) > Math.max(0, -Math.log10(st) + 1e-9)) add("arrondi sans tolérance", ask.slice(0, 100) + " → " + v);
        break;
      }
      if (COUNT.test(ask) && !/en moyenne|par personne|par élève|environ/i.test(ask) && (!Number.isInteger(+(+v).toFixed(9)) || v < 0)) add("effectif non entier", ask.slice(0, 120) + " → " + v);
      if (POSQ.test(ask) && !/combien de ces|altitude|image|nombre|terme|déterminant|paramètre|variation|écart|différence|baisse|diminu|gagn|perd|économ|bénéfice|évolution|perte|change|algébrique|coordonn|abscisse|ordonnée|pente|taux|dérivée|vitesse|signe/i.test(ask) && v <= 0 && !/[a-z] ?=|f\(|équation|valeur de x/i.test(ask)) add("grandeur ≤ 0 attendue", ask.slice(0, 120) + " → " + v);
    }
    /* 5. montants, pourcentages, contextes */
    if ((m = new RegExp("(\\d+,\\d{3,}) ?(CHF|€|francs|euros)").exec(all))) add("montant à 3 décimales", m[0]);
    if ((m = new RegExp("(?:^|[^\\d,'])(\\d+,\\d) ?(CHF|€)(?![\\w/])").exec(all))) add("montant à 1 décimale (mineur)", m[0]);
    for (const s of all.split(/(?<=[.?!;])\s/)) {
      const pc = (s.match(new RegExp(NUM + " ?%", "g")) || []).map((t) => num(t.replace("%", "")));
      if (/réduction|rabais|soldes?|remise|baisse/i.test(s) && !/gratuit/i.test(s) && pc.some((v) => v >= 100)) add("pourcentage invraisemblable", s.slice(0, 120));
      if (pc.some((v) => Math.abs(v) > 1000)) add("pourcentage invraisemblable", s.slice(0, 120));
      const kmh = (s.match(new RegExp(NUM + " ?km/h", "g")) || []).map((t) => num(t.replace("km/h", "")));
      if (kmh.length) {
        const mx = Math.max(...kmh), mn = Math.min(...kmh);
        if (/vélo|cycliste|trottinette/i.test(s) && !/pied|voiture|auto|moto|train|bus|scooter/i.test(s) && (mx > 60 || mn < 5)) add("vitesse invraisemblable", s.slice(0, 120));
        if (/à pied|marche|piéton|randonn|promen/i.test(s) && !/voiture|vélo|train|bus|course|court/i.test(s) && (mx > 9 || mn < 1.5)) add("vitesse invraisemblable", s.slice(0, 120));
        if (/voiture|automobil/i.test(s) && !/train|avion|TGV|vélo|camion/i.test(s) && mx > 250) add("vitesse invraisemblable", s.slice(0, 120));
        if (mx > 1300 && !/avion|son|lumière|fusée|satellite|Terre|ISS|station|planète|météor|comète|sonde|orbite|capsule/i.test(s)) add("vitesse invraisemblable", s.slice(0, 120));
        if (mn <= 0) add("vitesse invraisemblable", s.slice(0, 120));
      }
      if ((m = new RegExp("(?:\\ba|âgée? de|aura|avait) (" + NUM + ") ans\\b").exec(s)) && (num(m[1]) > 110 || num(m[1]) < 0)) add("âge invraisemblable", s.slice(0, 120));
      const tc = (s.match(new RegExp(NUM + " ?°C", "g")) || []).map((t) => num(t.replace("°C", "")));
      if (tc.length && !/thé|café|°F|refroid/i.test(all) && !/four|soleil|lave|fusion|ébullition|métal|fer|acier|cuisson|bouill|eau chaude|pizza|réacteur/i.test(s) && (Math.max(...tc) > 60 && !/thé|café|tasse|boisson|refroid|°F|chocolat|soupe|bain|douche/i.test(s) || Math.min(...tc) < -90)) add("température invraisemblable", s.slice(0, 120));
      /* 26.11 (lot, décisions de l'enseignant sur les cas douteux) : contextes chiffrés vérifiables */
      if ((m = new RegExp("(" + NUM + ") (?:réservations|inscriptions|billets) pour (?:un vol de |un avion de |)(" + NUM + ") (?:chambres|places)").exec(s)) && num(m[1]) - num(m[2]) > Math.max(3, 0.15 * num(m[2])) && !/gratuit|un inscrit sur deux/.test(s)) add("surréservation invraisemblable", s.slice(0, 120));
      if (/cheval|péniche/i.test(s)) { const fN = (s.match(new RegExp(NUM + " ?N\\b", "g")) || []).map((t) => num(t.replace(/ ?N$/, ""))); if (fN.some((v) => v < 200 || v > 2000)) add("force invraisemblable", s.slice(0, 120)); }
      if (/luge/i.test(s)) { const fN = (s.match(new RegExp(NUM + " ?N\\b", "g")) || []).map((t) => num(t.replace(/ ?N$/, ""))); if (fN.some((v) => v > 150)) add("force invraisemblable", s.slice(0, 120)); }
      if (/chariot/i.test(s) && /rail/i.test(all)) { const ms = (s.match(new RegExp(NUM + " ?m/s(?!²)", "g")) || []).map((t) => num(t.replace(/ ?m\/s$/, ""))); if (ms.some((v) => v > 15)) add("vitesse invraisemblable", s.slice(0, 120)); }
      if ((m = new RegExp("baisse (?:d'environ |de |)(" + NUM + ") ?°C chaque fois qu'on monte de (" + NUM + ") ?m").exec(s))) { const r = (num(m[1]) / num(m[2])) * 100; if (r < 0.45 || r > 0.8) add("gradient d'altitude invraisemblable", s.slice(0, 120)); }
      if (/cinéma/i.test(s)) { const RE = new RegExp("(?:billets?|places?|séances?)(?: adultes?|)(?: de cinéma|)(?: à| coûte| :) (" + NUM + ") ?CHF", "g"); let c; while ((c = RE.exec(s))) if (num(c[1]) < 8 && !/enfant|réduit|abonn/.test(s.slice(Math.max(0, c.index - 30), c.index + 40))) add("prix de cinéma invraisemblable", s.slice(0, 120)); }
      if (/bouteilles?/i.test(s) && (m = new RegExp("(" + NUM + ") ?cm[^.;]{0,80}?(" + NUM + ") ?L\\b").exec(s))) { const r = num(m[2]) / num(m[1]) ** 3; if (r < 2.5e-5 || r > 1.3e-4) add("bouteille invraisemblable", s.slice(0, 120)); }
      if ((m = new RegExp("classe (?:de|compte|a) (" + NUM + ") élèves").exec(s)) && (num(m[1]) > 30 || num(m[1]) < 8)) add("effectif de classe invraisemblable", s.slice(0, 120));
    }
    /* point décimal (le texte doit avoir la virgule) */
    for (const t of [x.txt, x.sol, ...x.parts.map((p) => p.label)]) if ((m = /(?<![\w.,'\/])\d+\.\d+(?![\w.])/.exec(t))) { add("point décimal", t.slice(Math.max(0, m.index - 40), m.index + 20)); break; }
    /* notes suisses : de 1 à 6 */
    for (const s of all.split(/(?<=[.?!;])\s/)) if (/\bnotes?\b/i.test(s) && !/sur 20|\/ ?20|points?|musique|do|ré|mi\b|fa\b|sol\b|la\b|si\b/i.test(s)) {
      const v = (s.match(new RegExp("(?<![\\d,'])" + NUM, "g")) || []).map(num).filter((v) => !Number.isInteger(v) || v <= 10);
      if (v.some((n) => n > 6 && !Number.isInteger(n))) add("note hors échelle 1–6", s.slice(0, 120));
    }
    /* langue : élision devant un prénom, « Un(e) … il ou elle », mot doublé, « 1 billes » */
    for (const t of [x.txt, ...x.parts.map((p) => p.label)]) {
      if ((m = /(^|[^\p{L}])(de|que) (?:[AEIOUÉÈ]|Y(?=[^aeiouyéèêëîïôûù]))[a-zàâçéèêëîïôûù]+/u.exec(t) /* 26.11 (revue p6, n° 14) : « de Yanis » sans élision */)) add("élision manquante", t.slice(Math.max(0, m.index - 20), m.index + 30));
      /* 26.11 soir : élision devant un nom commun ou un pronom (« combien de heures », « que il ») ; h aspiré non listé (« de hauteur ») */
      if ((m = /(?<![\p{L}'’])(de|que|ne|se|je|me|te|jusque|lorsque|puisque|le|la) (?=(?:heures?|habitants?|années?|élèves?|enfants?|euros?|œufs?|arbres?|amis?|entrées?|ordinateurs?|abonnés?|images?|unités?|objets?|exercices?|issues?|angles?|arêtes?|étages?|essais?|oranges?|ampoules?|abricots?|avions?|ans|eau|il|ils|elle|elles|on|abord|autres?|essence|argent|huile|herbe|hiver|hôtel|été|automne|aire|axe|intervalle|ensemble|équation|expression|inconnue|entier)(?![\p{L}]))/iu.exec(t))) add("élision manquante", t.slice(Math.max(0, m.index - 20), m.index + 30));
      if ((m = /\bun\(e\)|\bil ou elle\b|\bde le\b|\bà le\b|\bde les\b|\bà les\b/i.exec(t)) || (m = /\((?:elle|il|e|es|elles)\)/.exec(t))) /* 26.11 : « économise-t-il (elle) », « Un(e) » (minuscules : P_N(E) n'est pas visé) */ add("formulation", t.slice(Math.max(0, m.index - 30), m.index + 30));
      if ((m = /(?<![\p{L}])(\p{L}{2,}) \1(?![\p{L}])/iu.exec(t)) && !/^(nous|vous|très|bien|plus|tout|fois|pmatrix|cases|array)$/i.test(m[1])) add("mot doublé", t.slice(Math.max(0, m.index - 20), m.index + 30));
      if ((m = /(?<![\d,'.]|[-−] )1 (?!vers|dans|sous|sans|cases|succès|fois|mois|pas|bras|prix|poids|choix|cours|jus|repas|bus|os|puits|corps|temps|nez|croix|voix|noix|riz|pays|souris|tapis|parcours|colis|dés\b)([a-zéèêàç]{3,}s)\b/.exec(t)) && !/sur 1 |1 sur /.test(t.slice(Math.max(0, m.index - 4), m.index + 6))) add("accord après 1", t.slice(Math.max(0, m.index - 20), m.index + 30));
    }
    if (/(ces|les|deux|trois|quatre|cinq) (nombres )?décimaux/i.test(x.txt) && !/\d,\d/.test(all)) add("décimal annoncé sans décimal", x.txt.slice(0, 120));
    return F;
  };
})();
