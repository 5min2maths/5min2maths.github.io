// Chantier 11e · 12. Probabilités (lot 1 du plan pas à pas, 19.11) : une seule source pour denombr et proba.
// Même standard que ch11_thales.js : au moins 3 formes par niveau, pas à pas (GS), erreurs typiques (traps), ctx, figures ; défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  // Fraction simplifiée en LaTeX ; « \frac{6}{36} = \frac{1}{6} » si simplifiable.
  const F = (a, b) => { const g = gcd(a, b), p = a / g, q = b / g; return q === 1 ? String(p) : "\\frac{" + p + "}{" + q + "}"; };
  const FS = (a, b) => (gcd(a, b) > 1 ? "\\frac{" + a + "}{" + b + "} = " + F(a, b) : F(a, b));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value }, sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const FA = " (fraction acceptée)";

  // Arbre de choix (a branches puis b branches) : montre la structure, jamais le total.
  const tree = (a, b, la, lb) => {
    const W = 300, H = 30 + Math.min(a * b, 12) * 13, sa = Math.min(a, 4), sb = Math.min(b, 3);
    let g = '<circle cx="20" cy="' + H / 2 + '" r="4" class="f-dot"/>', y = 0;
    const tot = sa * sb, step = (H - 20) / tot;
    for (let i = 0; i < sa; i++) {
      const yi = 10 + step * (i * sb + (sb - 1) / 2) + step / 2;
      g += '<line x1="20" y1="' + H / 2 + '" x2="120" y2="' + yi + '" class="f-line"/><circle cx="120" cy="' + yi + '" r="3" class="f-dot"/>';
      for (let j = 0; j < sb; j++) { y = 10 + step * (i * sb + j) + step / 2; g += '<line x1="120" y1="' + yi + '" x2="220" y2="' + y + '" class="f-line"/><circle cx="220" cy="' + y + '" r="3" class="f-dot"/>'; }
    }
    const txt = (x, yy, s) => '<text x="' + x + '" y="' + yy + '" class="f-txt" text-anchor="middle" font-size="11">' + s + "</text>";
    g += txt(120, H - 2, la + (a > sa ? " (…)" : "")) + txt(222, H - 2, lb + (b > sb ? " (…)" : ""));
    return '<svg viewBox="0 0 ' + W + " " + (H + 6) + '" role="img" aria-label="arbre de choix" class="fig">' + g + "</svg>";
  };

  // ===================== denombr =====================
  const DN = {
    1: [ // principe multiplicatif
      () => { const x = pk([["Un restaurant propose", "entrées", "plats", "desserts", "menus différents (entrée, plat, dessert)", "menu"], ["Pour t'habiller, tu as", "pantalons", "t-shirts", "paires de baskets", "tenues différentes (un de chaque)", "tenue"], ["Une pizzeria propose", "pâtes", "sauces", "garnitures", "pizzas différentes (une pâte, une sauce, une garniture)", "pizza"]]),
          a = R.int(2, 5), b = R.int(3, 6), c = R.int(2, 4), n = a * b * c;
        return Qv(x[0] + " " + M(a) + " " + x[1] + ", " + M(b) + " " + x[2] + " et " + M(c) + " " + x[3] + ". Combien de " + x[4] + " peut-on composer ?", n,
          "Arbre : " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + n) + ".",
          { ctx: x[5], fig: tree(a, b, x[1], x[2]), guide: [GS("Nombre de choix pour les deux premiers éléments (" + x[1] + " et " + x[2] + ") ?", a * b, M(a + " \\cdot " + b + " = " + a * b) + "."), GS("Avec les " + x[3] + " ?", n, M(a * b + " \\cdot " + c + " = " + n) + ".")],
            traps: [TR(a + b + c, "On ne les additionne pas : chaque choix se combine avec tous les autres (arbre), on multiplie."), TR(a * b, "N'oublie pas le 3e choix (" + x[3] + ").")] }); },
      () => { const n = pk([4, 5, 6, 10]), k = pk([3, 4]), v = n ** k, x = pk([["Un cadenas a " + M(k) + " molettes portant chacune les chiffres de " + M(1) + " à " + M(n), "cadenas"], ["Un code secret est formé de " + M(k) + " symboles, chacun choisi parmi " + M(n) + " (on peut répéter)", "code"]]);
        if (n === 10 && k === 4) return null;
        return Qv(x[0] + ". Combien de codes différents existe-t-il ?", v, M(Array(k).fill(n).join(" \\cdot ") + " = " + n + "^" + k + " = " + v) + " codes.",
          { ctx: x[1], guide: [GS("Nombre de choix pour chaque position ?", n, M(n) + " (on peut répéter)."), GS("Nombre de codes : " + M(n + "^" + k) + " = ?", v, M(v) + ".")],
            traps: [TR(n * k, "On ne multiplie pas par le nombre de molettes : chaque molette multiplie les possibilités par " + n + "."), TR(k ** n, "C'est " + n + "^" + k + " : " + k + " positions, " + n + " choix chacune.")] }); },
      () => { const a = R.int(2, 4), b = R.int(3, 5), x = pk([["Pour aller de A à B, il y a " + M(a) + " chemins ; de B à C, il y a " + M(b) + " chemins. Combien de trajets différents de A à C passant par B ?", "chemins", "A → B", "B → C", "trajet"], ["Une glace : on choisit un cornet parmi " + M(a) + " et un parfum parmi " + M(b) + ". Combien de glaces différentes ?", "glaces", "cornet", "parfum", "glace"]]);
        return Qv(x[0], a * b, M(a + " \\cdot " + b + " = " + a * b) + " " + x[1] + ".",
          { ctx: x[4], fig: tree(a, b, x[2], x[3]), guide: [GS("Compte les branches au bout de l'arbre : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + ".")], traps: [TR(a + b, "Chaque choix de la 1re étape se combine avec chaque choix de la 2e : on multiplie.")] }); },
    ],
    2: [ // sans répétition
      () => { const n = R.int(6, 12), v = n * (n - 1) * (n - 2);
        return Qv(M(n) + " coureurs participent à une course. Combien de podiums différents (or, argent, bronze) sont possibles ?", v, M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + v) + " (un coureur ne peut pas avoir deux médailles).",
          { ctx: "podium", guide: [GS("Choix pour l'or ?", n, M(n) + "."), GS("Pour l'argent (l'or est déjà pris) ?", n - 1, M(n - 1) + "."), GS("Podiums : " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2)) + " = ?", v, M(v) + ".")],
            traps: [TR(n ** 3, "Sans répétition : un coureur déjà médaillé ne peut plus l'être, le nombre de choix diminue."), TR(3 * n, "On multiplie les choix à chaque étape.")] }); },
      () => { const n = R.int(18, 26), v = n * (n - 1);
        return Qv("Une classe de " + M(n) + " élèves élit un délégué et un suppléant (deux personnes différentes). Combien de choix sont possibles ?", v, M(n + " \\cdot " + (n - 1) + " = " + v) + ".",
          { ctx: "election", guide: [GS("Choix du délégué ?", n, M(n) + "."), GS("Choix du suppléant ?", n - 1, M(n - 1) + "."), GS("Total ?", v, M(v) + ".")],
            traps: [TR(n * n, "Le suppléant est une autre personne : il reste " + (n - 1) + " choix."), TR(v / 2, "Délégué et suppléant sont des rôles différents : l'ordre compte, on ne divise pas par 2.")] }); },
      () => { const k = R.int(4, 6), f = [1, 1, 2, 6, 24, 120, 720][k], x = pk([["livres différents sur une étagère", "livres"], ["amis dans une file d'attente", "file"], ["coureurs d'un relais (ordre de passage)", "relais"]]);
        return Qv("De combien de façons peut-on ranger " + M(k) + " " + x[0] + " ?", f, M(Array.from({ length: k }, (_, i) => k - i).join(" \\cdot ") + " = " + f) + ".",
          { ctx: x[1], guide: [GS("Choix pour la 1re place ?", k, M(k) + "."), GS("Pour la 2e place ?", k - 1, M(k - 1) + "."), GS("Total " + M(Array.from({ length: k }, (_, i) => k - i).join(" \\cdot ")) + " = ?", f, M(f) + ".")],
            traps: [TR(k * k, "À chaque place, il reste une possibilité de moins."), TR(k ** k, "Un même objet ne peut pas occuper deux places.")] }); },
      () => { const n = pk([5, 6, 7, 8, 9]), v = n * (n - 1) * (n - 2);
        return Qv("Un code de " + M(3) + " chiffres utilise les chiffres de " + M(1) + " à " + M(n) + ", tous différents. Combien de codes sont possibles ?", v, M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + v) + ".",
          { ctx: "code-diff", guide: [GS("Choix du 1er chiffre ?", n, M(n) + "."), GS("Du 2e (différent du 1er) ?", n - 1, M(n - 1) + "."), GS("Total ?", v, M(v) + ".")],
            traps: [TR(n ** 3, "Les chiffres sont tous différents : le nombre de choix diminue."), TR(v / 6, "Ici, l'ordre compte (123 et 321 sont deux codes différents).")] }); },
    ],
    3: [ // paires, diagonales, complément
      () => { const n = R.int(6, 15), v = (n * (n - 1)) / 2;
        return Qv(M(n) + " personnes se serrent toutes la main une fois. Combien de poignées de main y a-t-il ?", v, "Chacun serre " + M(n - 1) + " mains ; chaque poignée est comptée deux fois : " + M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + v) + ".",
          { ctx: "poignees", guide: [GS("Combien de mains serre chaque personne ?", n - 1, M(n - 1) + "."), GS(M(n + " \\cdot " + (n - 1)) + " compte chaque poignée deux fois. Total ?", v, M(v) + ".")],
            traps: [TR(n * (n - 1), "Une poignée entre A et B est la même que entre B et A : divise par 2."), TR(n * n, "On ne se serre pas la main à soi-même.")] }); },
      () => { const n = R.int(6, 12), v = (n * (n - 3)) / 2;
        return Qv("Combien de diagonales a un polygone convexe à " + M(n) + " côtés ?", v, "De chaque sommet partent " + M(n - 3) + " diagonales ; chacune est comptée deux fois : " + M("\\frac{" + n + " \\cdot " + (n - 3) + "}{2} = " + v) + ".",
          { ctx: "diagonales", guide: [GS("Depuis un sommet, combien de diagonales (pas vers lui-même ni ses 2 voisins) ?", n - 3, M(n - 3) + "."), GS("Total (chaque diagonale comptée deux fois) ?", v, M(v) + ".")],
            traps: [TR(n * (n - 3), "Chaque diagonale a deux extrémités : elle est comptée deux fois."), TR((n * (n - 1)) / 2, "Les côtés ne sont pas des diagonales.")] }); },
      () => { const n = R.int(5, 12), ar = R.rand() < 0.5, v = ar ? n * (n - 1) : (n * (n - 1)) / 2;
        return Qv("Un tournoi réunit " + M(n) + " équipes. Chaque équipe rencontre chacune des autres " + (ar ? "deux fois (match aller et match retour)" : "une seule fois") + ". Combien de matchs faut-il organiser ?", v,
          M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + (n * (n - 1)) / 2) + " paires d'équipes" + (ar ? ", deux matchs chacune : " + M(v) : "") + ".",
          { ctx: ar ? "tournoi-ar" : "tournoi", guide: [GS("Nombre de paires d'équipes ?", (n * (n - 1)) / 2, M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + (n * (n - 1)) / 2) + "."), GS("Nombre de matchs ?", v, M(v) + ".")],
            traps: [TR(ar ? (n * (n - 1)) / 2 : n * (n - 1), ar ? "Chaque paire joue deux fois." : "Le match A contre B est le même que B contre A."), TR(n * n, "Une équipe ne joue pas contre elle-même.")] }); },
      () => { const n = pk([5, 6, 8, 10]), all = n ** 3, diff = n * (n - 1) * (n - 2), v = all - diff;
        return Qv("Codes de " + M(3) + " chiffres choisis parmi " + M(n) + " (répétition permise). Combien de codes contiennent au moins deux chiffres identiques ?", v,
          "Tous : " + M(n + "^3 = " + all) + " ; tous différents : " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + diff) + " ; au moins une répétition : " + M(all + " - " + diff + " = " + v) + ".",
          { ctx: "complement", guide: [GS("Nombre total de codes ?", all, M(n + "^3 = " + all) + "."), GS("Codes aux chiffres tous différents ?", diff, M(diff) + "."), GS("Au moins une répétition (le reste) ?", v, M(v) + ".")],
            traps: [TR(diff, "Ça, ce sont les codes sans répétition ; on demande le reste."), TR(all, "Il faut retirer les codes aux chiffres tous différents.")] }); },
    ],
  };

  // ===================== proba =====================
  const PB = {
    1: [
      () => { const c = { rouges: R.int(2, 6), bleues: R.int(2, 6), vertes: R.int(1, 4) }, n = c.rouges + c.bleues + c.vertes, col = pk(["rouges", "bleues", "vertes"]), f = c[col];
        return Qv("Une urne contient " + M(c.rouges) + " boules rouges, " + M(c.bleues) + " bleues et " + M(c.vertes) + " vertes. On tire une boule au hasard. Quelle est la probabilité qu'elle soit " + col.slice(0, -1) + " ?" + FA, f / n,
          "Cas favorables sur cas possibles : " + M(FS(f, n)) + ".",
          { ctx: "urne", fig: FIG.urn(c), guide: [GS("Nombre de boules en tout (cas possibles) ?", n, M(n) + "."), GS("Probabilité" + FA + " ?", f / n, M(FS(f, n)) + ".")],
            traps: [TR(f / (n - f), "On divise par le nombre TOTAL de boules, pas par les autres."), TR(1 / 3, "Les couleurs n'ont pas la même chance : il y a plus de boules de certaines couleurs.")] }); },
      () => { const fc = pk([6, 8, 12, 20]), ev = pk([["un nombre pair", (k) => k % 2 === 0, "pair"], ["un multiple de 3", (k) => k % 3 === 0, "mult3"], ["un nombre premier", (k) => [2, 3, 5, 7, 11, 13, 17, 19].includes(k), "premier"], ["un nombre supérieur à 4", (k) => k > 4, "sup4"]]);
        const fav = Array.from({ length: fc }, (_, i) => i + 1).filter(ev[1]), f = fav.length;
        if (f * 2 === fc && ev[2] === "pair" && fc === 6) return null;
        return Qv("On lance un dé équilibré à " + M(fc) + " faces numérotées de " + M(1) + " à " + M(fc) + ". Quelle est la probabilité d'obtenir " + ev[0] + " ?" + FA, f / fc,
          "Cas favorables : " + fav.join(", ") + " (" + f + ") sur " + fc + " : " + M(FS(f, fc)) + ".",
          { ctx: "de-" + ev[2], guide: [GS("Combien de faces conviennent ?", f, fav.join(", ") + " : " + M(f) + "."), GS("Probabilité" + FA + " ?", f / fc, M(FS(f, fc)) + ".")],
            traps: [TR(f / 6, "Ce dé a " + fc + " faces, pas 6."), TR(1 / fc, "Plusieurs faces conviennent : compte-les toutes.")] }); },
      () => { const w = pk(["MATHEMATIQUES", "PROBABILITE", "GENEVE", "STATISTIQUE", "ALGEBRE", "GEOMETRIE"]), voy = [...w].filter((c) => "AEIOUY".includes(c)).length, n = w.length;
        return Qv("On écrit chaque lettre du mot " + w + " sur un carton, et on tire un carton au hasard. Quelle est la probabilité de tirer une voyelle ?" + FA, voy / n,
          M(voy) + " voyelles sur " + M(n) + " lettres : " + M(FS(voy, n)) + ".",
          { ctx: "mot", guide: [GS("Nombre de cartons ?", n, M(n) + "."), GS("Nombre de voyelles (avec les répétitions) ?", voy, M(voy) + "."), GS("Probabilité" + FA + " ?", voy / n, M(FS(voy, n)) + ".")],
            traps: [TR(6 / 26, "On tire parmi les lettres du mot, pas parmi l'alphabet."), TR(voy / (n - voy), "Favorables sur TOUS les cas possibles.")] }); },
      () => { const n = pk([20, 25, 40, 50, 100, 200]), g = R.int(2, Math.floor(n / 4)), x = pk([["Une tombola compte " + M(n) + " billets, dont " + M(g) + " gagnants. Tu achètes un billet. Quelle est la probabilité de ne PAS gagner ?", "tombola"], ["Dans un lot de " + M(n) + " ampoules, " + M(g) + " sont défectueuses. On en prend une au hasard. Quelle est la probabilité qu'elle fonctionne ?", "ampoules"]]);
        return Qv(x[0] + FA, (n - g) / n, "Événement contraire : " + M("1 - " + F(g, n) + " = " + F(n - g, n)) + ".",
          { ctx: x[1], guide: [GS("Probabilité de l'événement contraire" + FA + " ?", g / n, M(FS(g, n)) + "."), GS("Donc la probabilité cherchée " + M("1 - p") + " ?", (n - g) / n, M(F(n - g, n)) + ".")],
            traps: [TR(g / n, "Ça, c'est la probabilité de l'événement contraire ; on demande l'autre."), TR(1 - 1 / g, "Utilise 1 − (cas contraires ÷ total).")] }); },
    ],
    2: [
      () => { const s = pk([3, 4, 5, 6, 8, 9, 10, 11]), c = 6 - Math.abs(7 - s);
        return Qv("On lance deux dés équilibrés et on additionne les points. Quelle est la probabilité d'obtenir " + M(s) + " ?" + FA, c / 36,
          "Tableau 6 × 6 : " + M(c) + " cases donnent " + M(s) + " sur 36 : " + M(FS(c, 36)) + ".",
          { ctx: "somme", guide: [GS("Nombre d'issues (tableau 6 × 6) ?", 36, M(36) + "."), GS("Nombre de couples de somme " + s + " ?", c, M(c) + "."), GS("Probabilité" + FA + " ?", c / 36, M(FS(c, 36)) + ".")],
            traps: [TR(1 / 11, "Les sommes 2 à 12 n'ont pas toutes la même chance (7 se fait de 6 façons, 2 d'une seule)."), TR(Math.ceil(c / 2) / 36, "(1 ; 2) et (2 ; 1) sont deux issues différentes.")] }); },
      () => { const [p, c] = pk([[6, 4], [12, 4], [4, 3], [8, 2], [24, 2], [18, 2], [10, 2]]);
        return Qv("On lance deux dés équilibrés et on multiplie les points. Quelle est la probabilité que le produit vaille " + M(p) + " ?" + FA, c / 36,
          M(c) + " cases sur 36 donnent " + M(p) + " : " + M(FS(c, 36)) + ".",
          { ctx: "produit", guide: [GS("Nombre de couples (dé 1 ; dé 2) de produit " + p + " ?", c, M(c) + "."), GS("Probabilité" + FA + " ?", c / 36, M(FS(c, 36)) + ".")],
            traps: [TR(Math.ceil(c / 2) / 36, "Compte (a ; b) et (b ; a) séparément."), TR(c / 12, "Il y a 36 issues, pas 12.")] }); },
      () => { const k = pk([3, 4]), m = R.int(1, k - 1), C = [1, k, (k * (k - 1)) / 2, k === 3 ? 1 : 4, 1][m], tot = 2 ** k;
        return Qv("On lance " + M(k) + " pièces équilibrées. Quelle est la probabilité d'obtenir exactement " + M(m) + " fois pile ?" + FA, C / tot,
          M(tot) + " issues (arbre) ; " + M(C) + " contiennent exactement " + m + " pile : " + M(FS(C, tot)) + ".",
          { ctx: "pieces", guide: [GS("Nombre d'issues (" + M("2^" + k) + ") ?", tot, M(tot) + "."), GS("Combien d'issues ont exactement " + m + " pile ?", C, M(C) + "."), GS("Probabilité" + FA + " ?", C / tot, M(FS(C, tot)) + ".")],
            traps: [TR(1 / (k + 1), "Les nombres de piles (0 à " + k + ") ne sont pas équiprobables."), TR(1 / tot, "Plusieurs issues conviennent (la position des piles varie).")] }); },
      () => { const r = R.int(2, 5), b = R.int(2, 6), n = r + b;
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " bleues. On tire une boule, on la remet, puis on en tire une deuxième. Quelle est la probabilité d'obtenir deux rouges ?" + FA, (r * r) / (n * n),
          "Avec remise : " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + r + "}{" + n + "} = " + FS(r * r, n * n)) + ".",
          { ctx: "remise", fig: FIG.urn({ rouges: r, bleues: b }), guide: [GS("Probabilité d'une rouge au 1er tirage" + FA + " ?", r / n, M(FS(r, n)) + "."), GS("Deux rouges (on multiplie sur l'arbre)" + FA + " ?", (r * r) / (n * n), M(FS(r * r, n * n)) + ".")],
            traps: [TR((2 * r) / n, "Sur un arbre, on multiplie les probabilités le long d'un chemin."), TR((r * (r - 1)) / (n * (n - 1)), "La boule est remise : le 2e tirage se fait avec la même urne.")] }); },
    ],
    3: [
      () => { const r = R.int(3, 6), b = R.int(2, 5), n = r + b;
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " vertes. On tire deux boules sans remise. Quelle est la probabilité d'obtenir deux boules rouges ?" + FA, (r * (r - 1)) / (n * (n - 1)),
          M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + FS(r * (r - 1), n * (n - 1))) + ".",
          { ctx: "sans-remise-rr", fig: FIG.urn({ rouges: r, vertes: b }), guide: [GS("1re rouge" + FA + " ?", r / n, M(FS(r, n)) + "."), GS("2e rouge sachant la 1re rouge (il reste " + (n - 1) + " boules)" + FA + " ?", (r - 1) / (n - 1), M(FS(r - 1, n - 1)) + "."), GS("Deux rouges" + FA + " ?", (r * (r - 1)) / (n * (n - 1)), M(FS(r * (r - 1), n * (n - 1))) + ".")],
            traps: [TR((r * r) / (n * n), "Sans remise : au 2e tirage, il reste une rouge et une boule de moins."), TR((r / n) + ((r - 1) / (n - 1)), "Le long d'un chemin de l'arbre, on multiplie.")] }); },
      () => { const r = R.int(2, 6), b = R.int(2, 5), n = r + b, v = (2 * r * b) / (n * (n - 1));
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " vertes. On tire deux boules sans remise. Quelle est la probabilité d'obtenir une boule de chaque couleur ?" + FA, v,
          "Rouge puis verte ou verte puis rouge : " + M("2 \\cdot \\frac{" + r + " \\cdot " + b + "}{" + n + " \\cdot " + (n - 1) + "} = " + FS(2 * r * b, n * (n - 1))) + ".",
          { ctx: "sans-remise-rv", fig: FIG.urn({ rouges: r, vertes: b }), guide: [GS("Rouge puis verte" + FA + " ?", (r * b) / (n * (n - 1)), M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} = " + FS(r * b, n * (n - 1))) + "."), GS("Verte puis rouge : même valeur. Total" + FA + " ?", v, M(FS(2 * r * b, n * (n - 1))) + ".")],
            traps: [TR((r * b) / (n * (n - 1)), "Il y a deux chemins : rouge-verte ET verte-rouge."), TR((2 * r * b) / (n * n), "Sans remise : le 2e tirage se fait parmi " + (n - 1) + " boules.")] }); },
      () => { const r = R.int(3, 6), b = R.int(2, 5), n = r + b, num = r * (r - 1) + b * (b - 1), den = n * (n - 1);
        if (r === b) return null;
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " bleues. On tire deux boules sans remise. Quelle est la probabilité d'obtenir deux boules de la même couleur ?" + FA, num / den,
          "Deux rouges ou deux bleues : " + M("\\frac{" + r * (r - 1) + " + " + b * (b - 1) + "}{" + den + "} = " + FS(num, den)) + ".",
          { ctx: "meme-couleur", fig: FIG.urn({ rouges: r, bleues: b }), guide: [GS("Deux rouges" + FA + " ?", (r * (r - 1)) / den, M(FS(r * (r - 1), den)) + "."), GS("Deux bleues" + FA + " ?", (b * (b - 1)) / den, M(FS(b * (b - 1), den)) + "."), GS("Total" + FA + " ?", num / den, M(FS(num, den)) + ".")],
            traps: [TR((r * (r - 1)) / den, "N'oublie pas le cas « deux bleues »."), TR((r * r + b * b) / (n * n), "Sans remise : le dénominateur est " + n + " · " + (n - 1) + ".")] }); },
      () => { const x = pk([["On lance deux dés équilibrés. Quelle est la probabilité d'obtenir au moins un 6 ?", 25, 36, "aucun 6 : " + M("\\frac{5}{6} \\cdot \\frac{5}{6} = \\frac{25}{36}"), "de2"], ["On lance trois pièces équilibrées. Quelle est la probabilité d'obtenir au moins une fois pile ?", 1, 8, "aucun pile : " + M("\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}"), "pieces3"], ["On lance trois dés équilibrés. Quelle est la probabilité d'obtenir au moins un 6 ?", 125, 216, "aucun 6 : " + M("\\left(\\frac{5}{6}\\right)^3 = \\frac{125}{216}"), "de3"]]);
        const v = 1 - x[1] / x[2];
        return Qv(x[0] + FA, v, "Contraire de « au moins un » = « aucun » ; " + x[3] + ", donc " + M("1 - " + F(x[1], x[2]) + " = " + F(x[2] - x[1], x[2])) + ".",
          { ctx: "au-moins-" + x[4], guide: [GS("Probabilité de l'événement contraire (« aucun »)" + FA + " ?", x[1] / x[2], x[3] + "."), GS("Au moins un : " + M("1 - p") + FA + " ?", v, M(F(x[2] - x[1], x[2])) + ".")],
            traps: [TR(x[1] / x[2], "Ça, c'est « aucun » ; on demande le contraire."), TR(x[4] === "de2" ? 2 / 6 : x[4] === "de3" ? 3 / 6 : 1 / 2, "On n'additionne pas les probabilités de chaque lancer : passe par le contraire.")] }); },
    ],
  };

  const PROBS = {
    denombr: [
      () => P("Un digicode a 4 touches (A, B, C, D) ; le code a 3 lettres.", [["a) Nombre de codes (répétition permise)", 64], ["b) Nombre de codes aux lettres toutes différentes", 24], ["c) Nombre de codes avec au moins une lettre répétée", 40]], ["Chaque position : 4 choix.", "Sans répétition : 4 · 3 · 2 ; puis le reste."], "a) " + M("4^3 = 64") + " ; b) " + M("4 \\cdot 3 \\cdot 2 = 24") + " ; c) " + M("64 - 24 = 40") + "."),
      () => P("Un club de 10 membres organise son assemblée.", [["a) Nombre de façons d'élire un président et un secrétaire", 90], ["b) Nombre de poignées de main si chacun salue tout le monde", 45], ["c) Nombre de matchs d'un tournoi aller-retour entre les membres", 90]], ["Rôles différents : l'ordre compte.", "Poignées : chaque paire une fois, on divise par 2."], "a) " + M("10 \\cdot 9 = 90") + " ; b) " + M("\\frac{10 \\cdot 9}{2} = 45") + " ; c) " + M("45 \\cdot 2 = 90") + "."),
    ],
    proba: [
      () => P("Une urne contient 5 boules rouges et 3 vertes. On tire deux boules sans remise." + FA, [["a) P(deux rouges)", 20 / 56], ["b) P(deux vertes)", 6 / 56], ["c) P(une de chaque couleur)", 30 / 56]], ["Arbre : 5/8 puis 4/7 pour deux rouges.", "c) = 1 − a) − b)."], "a) " + M("\\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{5}{14}") + " ; b) " + M("\\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{3}{28}") + " ; c) " + M("1 - \\frac{5}{14} - \\frac{3}{28} = \\frac{15}{28}") + "."),
      () => P("On lance deux dés équilibrés et on additionne les points." + FA, [["a) P(somme = 7)", 6 / 36], ["b) P(somme ≥ 10)", 6 / 36], ["c) P(somme ≠ 7)", 30 / 36]], ["Tableau 6 × 6 : 36 issues.", "c) contraire de a)."], "a) " + M("\\frac{6}{36} = \\frac{1}{6}") + " ; b) 10 : 3, 11 : 2, 12 : 1, soit " + M("\\frac{6}{36} = \\frac{1}{6}") + " ; c) " + M("1 - \\frac{1}{6} = \\frac{5}{6}") + "."),
    ],
  };

  // « Trouve l'erreur » (24.11, chantier I) : issue comptée deux fois dans « A ou B ».
  PB[2].push(() => { const s = R.pick([4, 5]), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]), A = [2, 4, 6], Bv = [1, 2, 3, 4, 5, 6].filter((x) => x >= s), U = [...new Set([...A, ...Bv])].sort((x, y) => x - y);
    return Qv("On lance un dé équilibré à 6 faces. " + w + " calcule la probabilité d'obtenir un nombre pair <b>ou</b> au moins " + s + " : « " + M("\\frac{3}{6} + \\frac{" + Bv.length + "}{6} = \\frac{" + (3 + Bv.length) + "}{6}") + " ». Trouve l'erreur, puis donne la bonne probabilité (fraction).", U.length / 6,
      "Erreur : " + A.filter((x) => x >= s).join(" et ") + (A.filter((x) => x >= s).length > 1 ? " sont" : " est") + " à la fois pair" + (A.filter((x) => x >= s).length > 1 ? "s" : "") + " et au moins " + s + " : " + w + " les a comptés deux fois. Issues favorables : " + U.join(", ") + ", soit " + M("\\frac{" + U.length + "}{6} = " + frac(U.length, 6)) + ".",
      { ctx: "erreur", guide: [GS("Liste les issues paires ou au moins " + s + ", sans répéter : combien y en a-t-il ?", U.length, U.join(", ") + "."), GS("Probabilité ?", U.length / 6, M(frac(U.length, 6)) + ".")],
        traps: [TRAP((3 + Bv.length) / 6, "C'est le calcul de " + w + " : les issues communes aux deux événements sont comptées deux fois.")] }); });
  const ALL = { denombr: DN, proba: PB };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    denombr: "Fais un arbre : on multiplie le nombre de choix à chaque étape. Sans répétition, le nombre de choix diminue ; pour des paires (poignées de main), on divise par 2.",
    proba: "P = cas favorables ÷ cas possibles. Sur un arbre, on multiplie le long d'un chemin et on additionne les chemins. « Au moins un » : passe par le contraire.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    denombr: ["Dénombrer avec un arbre, codes", "Dénombrer sans répétition", "Paires, diagonales, complément"],
    proba: ["Probabilité simple, contraire", "Deux dés, pièces, avec remise", "Sans remise, au moins un"],
  });
})();
