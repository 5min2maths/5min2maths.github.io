// Chantier 1re Collège · équations (16.11) : leçons actives (devine / manipule / retiens) et rappels de cours pour
// eq1, eqfrac, eqspec, formule, probeq, eq2fact, eq2, eq2disc, probeq2, eq3, bicarre, eqirr. Chargé après active.js et
// lessons2.js. Pas de TeX dans ce qui est redessiné (exposants en caractères ², ³, ⁴).
(function () {
  const R2 = {
    eq1: ["Équations du 1er degré", "Résoudre, c'est trouver tous les nombres qui rendent l'égalité vraie.",
      "Une équation est une balance : on peut faire la même opération des deux côtés (ajouter, soustraire, multiplier ou diviser par un nombre non nul) sans changer ses solutions. On regroupe les \\(x\\) d'un côté et les nombres de l'autre, puis on divise par le coefficient de \\(x\\), avec son signe. On contrôle en remplaçant \\(x\\) dans l'équation de départ.",
      ["\\(6x - 7 = 2x + 5\\), \\(4x = 12\\), \\(x = 3\\). Contrôle : \\(11 = 11\\).", "\\(7 - 2x = 15\\), \\(-2x = 8\\), \\(x = -4\\).", "\\(4x + 1 = 2x + 8\\), \\(2x = 7\\), \\(x = \\frac{7}{2}\\) : la solution peut être une fraction."],
      "Un terme qui « change de côté » change de signe : c'est parce qu'on l'a soustrait (ou ajouté) des deux côtés."],
    eqfrac: ["Parenthèses et fractions", "On se ramène à une équation sans parenthèses ni fractions.",
      "Parenthèses : on développe (ou on divise d'abord les deux membres, si c'est plus simple). Un « − » devant une parenthèse change le signe de chaque terme. Fractions : on multiplie <b>chaque terme</b> des deux membres par le plus petit dénominateur commun ; un « − » devant une fraction porte sur tout son numérateur. Deux fractions égales : produit en croix.",
      ["\\(\\frac{x}{2} + \\frac{x}{3} = 5\\) ; fois 6 : \\(3x + 2x = 30\\), \\(x = 6\\).", "\\(\\frac{x + 1}{2} - \\frac{x - 3}{3} = 2\\) ; fois 6 : \\(3(x + 1) - 2(x - 3) = 12\\), \\(x = 3\\).", "\\(\\frac{2x - 1}{3} = \\frac{x + 4}{2}\\) ; en croix : \\(2(2x - 1) = 3(x + 4)\\), \\(x = 14\\)."],
      "Quand on multiplie par 6, le nombre seul du membre de droite est aussi multiplié par 6."],
    eqspec: ["Aucune solution, tous les nombres", "Une équation du 1er degré n'a pas toujours une seule solution.",
      "Si, en regroupant, les \\(x\\) disparaissent, il reste une égalité entre deux nombres. Fausse (\\(3 = 5\\)) : aucun nombre ne convient, \\(S = \\varnothing\\). Vraie (\\(0 = 0\\)) : tous les nombres conviennent, \\(S = \\mathbb{R}\\). Si les \\(x\\) ne disparaissent pas, il y a une seule solution, qui peut être \\(0\\).",
      ["\\(2x + 3 = 2x + 5\\) donne \\(3 = 5\\) : faux, aucune solution.", "\\(3(x + 2) = 3x + 6\\) donne \\(0 = 0\\) : vrai, tous les nombres.", "\\(5x + 2 = 3x + 2\\) donne \\(2x = 0\\), \\(x = 0\\) : une solution."],
      "« \\(x = 0\\) » est une solution ; « aucune solution » est tout autre chose."],
    formule: ["Transformer une formule", "Isoler une lettre, c'est résoudre une équation dont cette lettre est l'inconnue.",
      "Les autres lettres se traitent comme des nombres. On défait les opérations qui entourent la lettre cherchée, de l'extérieur vers l'intérieur, en faisant la même opération des deux côtés. Si la lettre est au carré et représente une grandeur positive, on termine par une racine carrée.",
      ["\\(v = \\frac{d}{t}\\), \\(vt = d\\), \\(t = \\frac{d}{v}\\).", "\\(A = \\frac{(B + b)h}{2}\\), \\(B + b = \\frac{2A}{h}\\), \\(B = \\frac{2A}{h} - b\\).", "\\(A = \\pi r^2\\), \\(r^2 = \\frac{A}{\\pi}\\), \\(r = \\sqrt{\\frac{A}{\\pi}}\\)."],
      "Dans \\(v = u + at\\), on soustrait \\(u\\) <b>avant</b> de diviser par \\(a\\) : \\(t = \\frac{v - u}{a}\\)."],
    probeq: ["Mettre un problème en équation", "L'algèbre traduit un énoncé en une équation qu'on sait résoudre.",
      "1. Lire et repérer ce qu'on cherche. 2. Choisir l'inconnue et écrire ce qu'elle représente. 3. Traduire l'énoncé en équation (un dessin ou un tableau aide). 4. Résoudre. 5. Vérifier dans l'énoncé, pas seulement dans l'équation. 6. Répondre par une phrase.",
      ["Trois entiers consécutifs de somme 48 : \\(n + (n + 1) + (n + 2) = 48\\), \\(n = 15\\).", "Prix après 20 % de réduction : 300 CHF, donc \\(0{,}8x = 300\\), \\(x = 375\\) CHF.", "Notes 4 ; 4,5 ; 5 : pour 5 de moyenne avec une 4e note, \\(\\frac{13{,}5 + x}{4} = 5\\), \\(x = 6{,}5\\) : impossible !"],
      "Une solution de l'équation peut ne pas convenir au problème (note supérieure à 6, nombre d'objets non entier, âge négatif)."],
    eq2fact: ["Résoudre en factorisant", "Beaucoup d'équations du 2e degré se résolvent sans formule.",
      "Méthode directe : \\(x^2 = a\\) a deux solutions \\(\\pm\\sqrt{a}\\) si \\(a > 0\\), une (0) si \\(a = 0\\), aucune si \\(a < 0\\). Sinon : on ramène tout à gauche (\\(\\ldots = 0\\)), on factorise (mise en évidence, identité remarquable, trinôme) et on annule chaque facteur.",
      ["\\(4x^2 = 9\\), \\(x = \\pm\\frac{3}{2}\\).", "\\(x^2 = 5x\\), \\(x(x - 5) = 0\\) : \\(x = 0\\) ou \\(x = 5\\).", "\\(x^2 + 4x = 21\\), \\((x + 7)(x - 3) = 0\\) : \\(x = -7\\) ou \\(x = 3\\)."],
      "Ne divise jamais par \\(x\\) : tu perdrais la solution \\(x = 0\\)."],
    eq2: ["Le produit nul", "Un produit vaut zéro si et seulement si l'un de ses facteurs vaut zéro.",
      "\\(A \\cdot B = 0 \\iff A = 0\\) ou \\(B = 0\\). On écrit l'équation sous forme « produit \\(= 0\\) », puis on résout chaque facteur \\(= 0\\). Un facteur qui ne s'annule jamais (\\(3\\), \\(x^2 + 1\\)) ne donne pas de solution.",
      ["\\((x - 2)(x + 5) = 0\\) : \\(x = 2\\) ou \\(x = -5\\).", "\\((3x - 1)(x + 4)x = 0\\) : trois solutions, \\(\\frac{1}{3}\\), \\(-4\\) et \\(0\\).", "\\((x - 2)(x + 3) = 6\\) : on développe d'abord, \\(x^2 + x - 12 = 0\\), puis \\((x + 4)(x - 3) = 0\\)."],
      "Seul 0 a cette propriété : \\((x - 2)(x + 3) = 6\\) ne dit pas que \\(x - 2 = 6\\)."],
    eq2disc: ["La formule du 2e degré", "Une méthode qui marche pour toute équation \\(ax^2 + bx + c = 0\\).",
      "On calcule le discriminant \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : deux solutions \\(x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}\\). Si \\(\\Delta = 0\\) : une solution \\(x = \\frac{-b}{2a}\\). Si \\(\\Delta < 0\\) : aucune solution réelle. La somme des solutions vaut \\(-\\frac{b}{a}\\), leur produit \\(\\frac{c}{a}\\).",
      ["\\(5x^2 - 4x - 1 = 0\\) : \\(\\Delta = 36\\), \\(x = \\frac{4 \\pm 6}{10}\\), soit \\(1\\) ou \\(-\\frac{1}{5}\\).", "\\(x^2 - 2x + 1 = 0\\) : \\(\\Delta = 0\\), \\(x = 1\\).", "\\(x^2 - 2x - 1 = 0\\) : \\(\\Delta = 8\\), \\(x = 1 \\pm \\sqrt{2}\\)."],
      "On divise par \\(2a\\), et le numérateur commence par \\(-b\\) : si \\(b = -4\\), \\(-b = 4\\)."],
    probeq2: ["Problèmes du 2e degré", "Certains problèmes mènent à une équation qui contient \\(x^2\\).",
      "On pose l'inconnue, on écrit l'équation (aire, Pythagore, produit…), on la ramène à \\(ax^2 + bx + c = 0\\) et on la résout. Puis on garde seulement les solutions qui ont un sens : une longueur ou une durée est positive, une largeur d'allée ne dépasse pas le jardin.",
      ["Rectangle de largeur \\(x\\), longueur \\(x + 3\\), aire 40 : \\(x^2 + 3x - 40 = 0\\), \\(x = 5\\) (on écarte \\(-8\\)).", "Deux entiers consécutifs de produit 72 : \\(n(n + 1) = 72\\), \\(n = 8\\)."],
      "L'équation a souvent deux solutions ; le problème n'en garde parfois qu'une."],
    eq3: ["Équations de degré 3", "On se ramène à un produit nul.",
      "On ramène tout à gauche, on met en évidence \\(x\\) (ou \\(x^2\\), ou un groupe), on factorise ce qui reste, puis on annule chaque facteur. Une équation de degré 3 a au plus trois solutions.",
      ["\\(x^3 - 9x = 0\\), \\(x(x - 3)(x + 3) = 0\\) : \\(-3\\), \\(0\\), \\(3\\).", "\\(x^3 - 7x^2 + 12x = 0\\), \\(x(x - 3)(x - 4) = 0\\).", "\\(x^3 + 2x^2 - 9x - 18 = (x + 2)(x^2 - 9)\\) : \\(-3\\), \\(-2\\), \\(3\\)."],
      "Diviser par \\(x\\) fait perdre la solution \\(x = 0\\)."],
    bicarre: ["Équations bicarrées", "Une équation en \\(x^4\\) et \\(x^2\\) est du 2e degré « déguisée ».",
      "On pose \\(X = x^2\\), on résout \\(aX^2 + bX + c = 0\\), puis on revient à \\(x\\) : chaque \\(X > 0\\) donne deux solutions \\(\\pm\\sqrt{X}\\), \\(X = 0\\) donne \\(0\\), et \\(X < 0\\) n'en donne aucune.",
      ["\\(x^4 - 5x^2 + 4 = 0\\) : \\(X = 1\\) ou \\(X = 4\\), donc \\(x = \\pm 1\\) ou \\(x = \\pm 2\\).", "\\(x^4 + 3x^2 - 4 = 0\\) : \\(X = 1\\) ou \\(X = -4\\), donc \\(x = \\pm 1\\)."],
      "Les solutions sont les valeurs de \\(x\\), pas celles de \\(X\\) : il faut revenir à \\(x\\)."],
    eqirr: ["Équations irrationnelles", "L'inconnue est sous une racine carrée.",
      "On isole la racine, on élève les deux membres au carré, on résout, puis on <b>vérifie</b> chaque valeur dans l'équation de départ. Élever au carré peut ajouter des solutions « parasites » : si \\(A^2 = B^2\\), on a \\(A = B\\) ou \\(A = -B\\). Une racine carrée n'est jamais négative.",
      ["\\(\\sqrt{x + 3} = 4\\), \\(x + 3 = 16\\), \\(x = 13\\).", "\\(\\sqrt{x + 7} = x + 1\\), au carré \\(x^2 + x - 6 = 0\\) : \\(2\\) convient, \\(-3\\) est parasite (\\(x + 1 = -2 < 0\\))."],
      "\\(\\sqrt{x + 1} = -2\\) n'a aucune solution : une racine n'est jamais négative."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  // ---------- outils ----------
  const fr = (v) => { if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v)).replace("-", "−"); for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return (v < 0 ? "−" : "") + Math.abs(Math.round(v * d)) + "/" + d; return String(+v.toFixed(3)).replace(".", ",").replace("-", "−"); };
  const nb = (v) => String(+(+v).toFixed(3)).replace(".", ",").replace("-", "−");
  const cx = (a) => { const s = fr(Math.abs(a)); return (a < 0 ? "−" : "") + (s === "1" ? "x" : s.includes("/") ? s.replace("/", "x/") : s + "x"); };
  const side = (a, b) => { if (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) return "0"; let t = Math.abs(a) > 1e-9 ? cx(a) : ""; if (Math.abs(b) > 1e-9) t += t ? (b < 0 ? " − " : " + ") + fr(Math.abs(b)) : fr(b); return t; };
  const near = (u, v) => Math.abs(u - v) < 1e-9;

  // Balance : ax + b = cx + d ; on applique la même opération aux deux membres (k réglable).
  const balance = (E, opts = {}) => (box, onWin) => {
    let step = 0, k = 1, st, hist;
    const load = () => { if (step >= E.length) return; st = E[step].slice(0, 4); hist = [E[step][4] || side(st[0], st[1]) + " = " + side(st[2], st[3])]; k = 1; };
    load();
    const ops = [["+", "+ k"], ["-", "− k"], ["+x", "+ kx"], ["-x", "− kx"], ["*", "× k"], ["/", "÷ k"]];
    const draw = () => {
      if (step >= E.length) return;
      const [a, b, c, d] = st, gone = near(a, 0) && near(c, 0);
      box.innerHTML = `<div class="act-out">${hist.map((h, i) => (i ? "⇔ " : "") + h).join("<br>")}</div>
        ${gone ? `<div class="small muted">Plus de x : l'égalité ${fr(b)} = ${fr(d)} est ${near(b, d) ? "vraie" : "fausse"}. Que conclus-tu ?</div><div class="seg"><button type="button" data-c="none">Aucune solution</button><button type="button" data-c="all">Tous les nombres</button></div>`
          : `${actStepper("k", fr(k), "k")}<div class="seg act-ops">${ops.map(([o, l]) => `<button type="button" data-o="${o}">${l.replace("kx", Math.abs(k) === 1 ? (k < 0 ? "(−x)" : "x") : (k < 0 ? "(" + fr(k) + "x)" : fr(k) + "x")).replace("k", k < 0 ? "(" + fr(k) + ")" : fr(k))}</button>`).join("")}</div><div class="small muted">La même opération s'applique aux deux membres.</div>`}`;
      if (!gone) {
        actBindStepper(box, "k", () => k, (v) => { k = v === 0 ? (k > 0 ? -1 : 1) : v; draw(); }, -12, 12);
        box.querySelectorAll("[data-o]").forEach((el) => (el.onclick = () => {
          const o = el.dataset.o;
          if (o === "+") { st[1] += k; st[3] += k; } else if (o === "-") { st[1] -= k; st[3] -= k; }
          else if (o === "+x") { st[0] += k; st[2] += k; } else if (o === "-x") { st[0] -= k; st[2] -= k; }
          else if (o === "*") st = st.map((v) => v * k); else st = st.map((v) => v / k);
          st = st.map((v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v));
          hist.push(side(st[0], st[1]) + " = " + side(st[2], st[3])); if (hist.length > 6) hist.splice(1, 1); check();
        }));
      } else box.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => {
        const ok = (el.dataset.c === "all") === near(st[1], st[3]);
        if (!ok) { $hint(box, "Relis l'égalité qui reste : est-elle vraie ou fausse ?"); return; }
        onWin(step, E[step][5] || (near(st[1], st[3]) ? "0 = 0 est toujours vrai : tous les nombres sont solutions." : "L'égalité est fausse quel que soit x : aucune solution.")); step++; load(); draw();
      }));
    };
    const check = () => {
      const [a, b, c, d] = st;
      const sol = (near(a, 1) && near(b, 0) && near(c, 0)) ? d : (near(c, 1) && near(d, 0) && near(a, 0)) ? b : null;
      if (sol !== null) { onWin(step, E[step][5] || "Solution : x = " + fr(sol) + ".<br>Contrôle-la dans l'équation de départ."); step++; load(); }
      draw();
    };
    draw();
  };

  // Chercheur de solutions : un curseur sur x, l'expression calculée en direct ; chaque défi vérifie (x, vus).
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.start, step = 0; const seen = new Set();
    const draw = () => {
      box.innerHTML = actStepper(o.label || "x", nb(x), "x") + o.show(x, step) + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return; const m = o.wins[step](x, seen); if (m) { onWin(step, m); step++; check(); } };
    draw();
  };

  // Choix des étapes : à chaque état, choisir la bonne opération à faire des deux côtés.
  const chooser = (D) => (box, onWin) => {
    let step = 0, j = 0;
    const draw = () => {
      if (step >= D.length) return;
      const S = D[step], cur = S[j];
      box.innerHTML = `<div class="act-out">${S.slice(0, j + 1).map((s) => s.f).join("<br>⇔ ")}</div><div class="small muted">${cur.ask}</div>
        <div class="seg">${cur.ch.map((c, i) => `<button type="button" data-ch="${i}">${c}</button>`).join("")}</div>`;
      box.querySelectorAll("[data-ch]").forEach((el) => (el.onclick = () => {
        if (+el.dataset.ch !== cur.good) { $hint(box, cur.no); return; }
        j++;
        if (j >= S.length - 1) { onWin(step, S[S.length - 1].f + ". " + S[S.length - 1].why); step++; j = 0; }
        draw();
      }));
    };
    draw();
  };

  const sq = (v) => nb(v * v);
  Object.assign(ACTIVE, {
    eq1: {
      predict: { q: "Dans 3x + 5 = 20, on « fait passer » le 5 de l'autre côté. Que fait-on vraiment ?", choices: ["On soustrait 5 des deux côtés", "On efface le 5", "On divise par 5"], good: 0, why: "Une équation est une balance : on retire 5 des deux plateaux, 3x = 15. Le 5 ne « saute » pas : il est soustrait des deux côtés." },
      defis: ["Résous 3x + 5 = 20 en choisissant k et l'opération.", "Résous 5x − 3 = 2x + 9 : commence par les x.", "Résous 7 − 2x = 15 (attention au signe de −2x)."],
      play: balance([[3, 5, 0, 20], [5, -3, 2, 9], [-2, 7, 0, 15]]),
    },
    eqfrac: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Fractions : on multiplie chaque terme des deux membres par le plus petit dénominateur commun (un multiple de tous les dénominateurs). Un nombre seul est lui aussi multiplié. Il reste une équation sans fraction, qu'on résout.", exemple: ["\\(\\frac{x}{2} + \\frac{x}{3} = 5\\) ; fois 6 : \\(3x + 2x = 30\\), \\(x = 6\\).", "\\(\\frac{x}{4} - 1 = \\frac{x}{6}\\) ; fois 12 : \\(3x - 12 = 2x\\), \\(x = 12\\).", "\\(\\frac{x + 1}{2} = \\frac{x - 3}{3} + 2\\) ; fois 6 : \\(3(x + 1) = 2(x - 3) + 12\\), \\(x = 3\\)."] },
      predict: { q: "Pour faire disparaître les fractions de x/2 + x/3 = 5, on multiplie les deux membres par…", choices: ["5", "6", "2 + 3"], good: 1, why: "6 est un multiple de 2 et de 3 : 6 · x/2 = 3x et 6 · x/3 = 2x. Et le 5 devient 30." },
      defis: ["Résous x/2 + x/3 = 5 : multiplie d'abord par 6.", "Résous x/4 − 1 = x/6.", "Résous (x + 1)/2 = (x − 3)/3 + 2."],
      play: balance([[1 / 2 + 1 / 3, 0, 0, 5, "x/2 + x/3 = 5"], [1 / 4, -1, 1 / 6, 0, "x/4 − 1 = x/6"], [1 / 2, 1 / 2, 1 / 3, 1, "(x + 1)/2 = (x − 3)/3 + 2"]]),
    },
    eqspec: {
      predict: { q: "2x + 3 = 2x + 5 : combien de solutions ?", choices: ["Une : x = 0", "Aucune", "Une infinité"], good: 1, why: "Quel que soit x, le membre de droite vaut 2 de plus que celui de gauche : jamais égaux. Aucune solution." },
      defis: ["Résous 2x + 3 = 2x + 5.", "Résous 3(x + 1) = 3x + 3.", "Résous 4x + 1 = x + 1 (attention : les x ne disparaissent pas)."],
      play: balance([[2, 3, 2, 5], [3, 3, 3, 3, "3(x + 1) = 3x + 3"], [4, 1, 1, 1, "4x + 1 = x + 1", "x = 0 : c'est une vraie solution, pas « aucune solution »."]]),
    },
    formule: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Les autres lettres se traitent comme des nombres. On défait les opérations qui entourent la lettre cherchée, de l'extérieur vers l'intérieur, en faisant la même opération des deux côtés.", exemple: ["\\(P = 4c\\), \\(c = \\frac{P}{4}\\).", "\\(v = \\frac{d}{t}\\), \\(vt = d\\), \\(t = \\frac{d}{v}\\).", "\\(A = \\frac{(B + b)h}{2}\\), \\(B + b = \\frac{2A}{h}\\), \\(B = \\frac{2A}{h} - b\\)."], piege: "Dans \\(A = \\frac{(B + b)h}{2}\\), on défait d'abord \\(: 2\\) et \\(\\cdot h\\), puis on soustrait \\(b\\) en dernier." },
      predict: { q: "Dans v = d/t, pour isoler t, la première opération est…", choices: ["× t des deux côtés", "÷ v des deux côtés", "− d des deux côtés"], good: 0, why: "t est au dénominateur : on le fait remonter en multipliant par t, v · t = d ; puis on divise par v." },
      defis: ["Isole c dans P = 4c.", "Isole t dans v = d/t.", "Isole B dans A = (B + b) · h / 2."],
      play: chooser([
        [{ f: "P = 4c", ask: "Que fais-tu des deux côtés ?", ch: ["÷ 4", "− 4", "× 4"], good: 0, no: "c est multiplié par 4 : on défait une multiplication par une division." }, { f: "c = P/4", why: "On a défait « × 4 »." }],
        [{ f: "v = d/t", ask: "Première opération ?", ch: ["÷ t", "× t", "− d"], good: 1, no: "t est au dénominateur : on multiplie par t pour le faire remonter." }, { f: "v · t = d", ask: "Et maintenant ?", ch: ["÷ v", "× v", "− v"], good: 0, no: "t est multiplié par v : on divise par v." }, { f: "t = d/v", why: "On défait de l'extérieur vers l'intérieur." }],
        [{ f: "A = (B + b) · h / 2", ask: "Première opération ?", ch: ["− b", "× 2", "÷ h"], good: 1, no: "Commence par l'extérieur : la division par 2." }, { f: "2A = (B + b) · h", ask: "Ensuite ?", ch: ["÷ h", "− b", "÷ 2"], good: 0, no: "La parenthèse est multipliée par h : divise par h." }, { f: "2A/h = B + b", ask: "Enfin ?", ch: ["+ b", "− b", "÷ b"], good: 1, no: "On a B + b : on retire b." }, { f: "B = 2A/h − b", why: "Trois opérations défaites, dans l'ordre inverse." }],
      ]),
    },
    probeq: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Trois entiers consécutifs de somme 48 : \\(n + (n + 1) + (n + 2) = 48\\), \\(n = 15\\).", "Somme 75 : \\(3n + 3 = 75\\), \\(n = 24\\) (24, 25, 26).", "Quatre consécutifs de somme 98 : \\(4n + 6 = 98\\), \\(n = 23\\)."], piege: "Écris ce que représente l'inconnue : ici \\(n\\) est le plus petit, celui du milieu est \\(n + 1\\)." },
      predict: { q: "Trois entiers consécutifs ont pour somme 48. Le plus petit est…", choices: ["16", "15", "14"], good: 1, why: "n + (n + 1) + (n + 2) = 3n + 3 = 48, donc n = 15 : 15 + 16 + 17 = 48. 16 est celui du milieu." },
      defis: ["Trouve trois entiers consécutifs de somme 48.", "Trouve trois entiers consécutifs de somme 75.", "Avec 4 nombres : trouve quatre entiers consécutifs de somme 98."],
      play(box, onWin) {
        let n = 10, k = 3, step = 0;
        const draw = () => {
          const L = Array.from({ length: k }, (_, i) => n + i), S = L.reduce((a, b) => a + b, 0);
          box.innerHTML = `<div class="seg">${[3, 4].map((v) => `<button type="button" data-k="${v}" aria-pressed="${v === k}">${v} nombres</button>`).join("")}</div>${actStepper("n (le plus petit)", n, "n")}
            <div class="act-out">${L.join(" + ")} = <b>${S}</b><br><span class="small muted">en écriture littérale : ${k}n + ${k === 3 ? 3 : 6} = ${k} · ${n} + ${k === 3 ? 3 : 6}</span></div>`;
          actBindStepper(box, "n", () => n, (v) => { n = v; draw(); check(); }, 1, 60);
          box.querySelectorAll("[data-k]").forEach((el) => (el.onclick = () => { k = +el.dataset.k; draw(); check(); }));
        };
        const T = [[3, 48, "3n + 3 = 48 ⇔ 3n = 45 ⇔ n = 15."], [3, 75, "3n + 3 = 75 ⇔ n = 24 : l'équation évite de tâtonner."], [4, 98, "4n + 6 = 98 ⇔ 4n = 92 ⇔ n = 23."]];
        const check = () => { if (step < 3) { const [kk, S, m] = T[step]; if (k === kk && kk * n + (kk === 3 ? 3 : 6) === S) { onWin(step, m); step++; } } };
        draw();
      },
    },
    eq2fact: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Méthode directe : \\(x^2 = a\\) a deux solutions \\(\\pm\\sqrt{a}\\) si \\(a > 0\\). Sinon : on ramène tout à gauche (\\(\\ldots = 0\\)), on met en évidence et on annule chaque facteur.", exemple: ["\\(x^2 = 16\\), \\(x = 4\\) ou \\(x = -4\\).", "\\(x^2 = 3x\\), \\(x(x - 3) = 0\\) : \\(x = 0\\) ou \\(x = 3\\)."] },
      predict: { q: "x² = 3x : combien de solutions ?", choices: ["Une : x = 3", "Deux : 0 et 3", "Aucune"], good: 1, why: "0² = 3 · 0 = 0 et 3² = 3 · 3 = 9 : deux solutions. Diviser par x aurait fait perdre x = 0." },
      defis: ["Trouve un nombre x tel que x² = 3x.", "Trouves-en un autre !", "Mode x² = 16 : trouve la solution négative."],
      play: hunt({ start: 1, min: -6, max: 6, show: (x, st) => st < 2
        ? `<div class="act-out">Équation : x² = 3x<br>Membre de gauche : x² = (${nb(x)})² = <b>${sq(x)}</b><br>Membre de droite : 3x = 3 · (${nb(x)}) = <b>${nb(3 * x)}</b><br>${x * x === 3 * x ? "<b>Égaux ✓</b>" : "Pas égaux"}</div>`
        : `<div class="act-out">Nouvelle équation : x² = 16<br>x² = (${nb(x)})² = <b>${sq(x)}</b><br>${x * x === 16 ? "<b>Égal à 16 ✓</b>" : "Pas égal à 16"}</div>`, note: "Change x avec − et + ; compare les deux membres.",
        wins: [(x, s) => (x * x === 3 * x ? (s.add(x), "x = " + nb(x) + " : " + sq(x) + " = " + nb(3 * x) + ".") : null), (x, s) => (x * x === 3 * x && !s.has(x) ? "Deux solutions : 0 et 3. x(x − 3) = 0." : null), (x) => (x === -4 ? "x = −4 : (−4)² = 16. x² = 16 a deux solutions, ±4." : null)] }),
    },
    eq2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(A \\cdot B = 0 \\iff A = 0\\) ou \\(B = 0\\). On écrit l'équation sous forme « produit \\(= 0\\) », puis on résout chaque facteur \\(= 0\\).", exemple: ["\\((x - 2)(x + 5) = 0\\) : \\(x = 2\\) ou \\(x = -5\\).", "\\((x - 2)(x + 5) = -6\\) : on développe d'abord, \\(x^2 + 3x - 4 = 0\\), puis \\((x + 4)(x - 1) = 0\\)."] },
      predict: { q: "(x − 2)(x + 5) = 0. Une solution est…", choices: ["x = −2", "x = 2", "x = 5"], good: 1, why: "Si x = 2, le premier facteur vaut 0, donc le produit vaut 0. L'autre solution est x = −5." },
      defis: ["Trouve un x qui rend (x − 2)(x + 5) nul.", "Trouve l'autre.", "Trouve un x tel que (x − 2)(x + 5) = −6."],
      play: hunt({ start: 0, min: -8, max: 6, show: (x) => `<div class="act-out">(${nb(x)} − 2) · (${nb(x)} + 5) = ${nb(x - 2)} · ${nb(x + 5)} = <b>${nb((x - 2) * (x + 5))}</b></div>`,
        wins: [(x, s) => ((x - 2) * (x + 5) === 0 ? (s.add(x), "x = " + nb(x) + " : un facteur vaut 0, donc le produit aussi.") : null), (x, s) => ((x - 2) * (x + 5) === 0 && !s.has(x) ? "Les deux solutions : 2 et −5, une par facteur." : null), (x) => ((x - 2) * (x + 5) === -6 ? "x = " + nb(x) + " convient, mais ni x − 2 ni x + 5 ne vaut −6 : le produit nul ne marche qu'avec 0. Il faut développer : x² + 3x − 4 = 0, soit x = 1 ou x = −4." : null)] }),
    },
    eq2disc: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pour \\(ax^2 + bx + c = 0\\), on calcule le discriminant \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : deux solutions. Si \\(\\Delta = 0\\) : une solution. Si \\(\\Delta < 0\\) : aucune solution réelle (la parabole ne touche pas l'axe des x).", exemple: ["\\(x^2 - 4x + c = 0\\) : \\(\\Delta = 16 - 4c\\).", "\\(c = 4\\) : \\(\\Delta = 0\\), une solution ; \\(c > 4\\) : aucune ; \\(c < 0\\) : deux."], piege: "Dans \\(\\Delta = b^2 - 4ac\\), \\(b^2\\) est toujours positif : avec \\(b = -4\\), \\(b^2 = 16\\)." },
      predict: { q: "x² − 4x + c = 0. Si c devient très grand, le nombre de solutions…", choices: ["augmente", "devient 0", "reste 2"], good: 1, why: "La parabole monte : elle ne touche plus l'axe des x. Δ = 16 − 4c devient négatif dès que c > 4." },
      defis: ["Choisis c pour que l'équation ait exactement une solution.", "Choisis c pour qu'elle n'en ait aucune.", "Choisis c négatif : combien de solutions ?"],
      play(box, onWin) {
        let c = 1, step = 0;
        const draw = () => {
          const D = 16 - 4 * c, n = D > 0 ? 2 : D === 0 ? 1 : 0, W = 300, H = 150, gx = (x) => 150 + (x - 2) * 34, gy = (y) => 110 - y * 9;
          let p = ""; for (let x = -2; x <= 6.01; x += 0.1) p += (p ? " L" : "M") + gx(x).toFixed(1) + "," + Math.max(-20, gy(x * x - 4 * x + c)).toFixed(1);
          const sols = D > 0 ? [2 - Math.sqrt(D) / 2, 2 + Math.sqrt(D) / 2] : D === 0 ? [2] : [];
          box.innerHTML = actStepper("c", c, "c") + `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="parabole"><line x1="0" y1="${gy(0)}" x2="${W}" y2="${gy(0)}" class="f-line"/><path d="${p}" class="f-line" fill="none" stroke-width="2"/>${sols.map((s) => `<circle cx="${gx(s)}" cy="${gy(0)}" r="5" class="f-dot"/>`).join("")}</svg>
            <div class="act-out">Δ = 16 − 4 · ${nb(c)} = <b>${nb(D)}</b><br>Nombre de solutions : <b>${n}</b>${sols.length ? "<br>x ≈ " + sols.map((s) => nb(+s.toFixed(2))).join(" ; x ≈ ") : ""}</div>`;
          actBindStepper(box, "c", () => c, (v) => { c = v; draw(); check(); }, -8, 10);
        };
        const check = () => {
          const D = 16 - 4 * c;
          if (step === 0 && D === 0) { onWin(0, "c = 4 : Δ = 0, la parabole touche l'axe en x = 2 ; x² − 4x + 4 = (x − 2)²."); step = 1; }
          else if (step === 1 && D < 0) { onWin(1, "c = " + c + " : Δ < 0, la parabole ne coupe pas l'axe : aucune solution réelle."); step = 2; }
          else if (step === 2 && c < 0) { onWin(2, "Si c < 0, −4c > 0 donc Δ > 0 : toujours deux solutions."); step = 3; }
        };
        draw();
      },
    },
    probeq2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Rectangle de largeur \\(x\\), longueur \\(x + 3\\), aire 40 : \\(x^2 + 3x - 40 = 0\\), \\(x = 5\\) (on écarte \\(-8\\)).", "Aire 70 : \\(x^2 + 3x - 70 = 0\\), \\(x = 7\\) (on écarte \\(-10\\))."] },
      predict: { q: "Un rectangle a une longueur égale à sa largeur + 3 et une aire de 40. Sa largeur est…", choices: ["5", "8", "10"], good: 0, why: "5 · 8 = 40. L'équation x(x + 3) = 40 a aussi la solution −8, qu'on écarte : une largeur est positive." },
      defis: ["Trouve la largeur pour une aire de 40.", "Trouve la largeur pour une aire de 70.", "Et pour une aire de 28 ?"],
      play: hunt({ start: 2, min: 1, max: 12, label: "largeur x", show: (x) => `<svg class="fig" viewBox="0 0 320 ${Math.round(20 + x * 9)}" role="img" aria-label="rectangle"><rect x="10" y="10" width="${(x + 3) * 18}" height="${x * 9}" class="f-shape"/></svg><div class="act-out">Largeur ${nb(x)}, longueur ${nb(x + 3)}<br>Aire : ${nb(x)} · ${nb(x + 3)} = <b>${nb(x * (x + 3))}</b></div>`,
        wins: [(x) => (x * (x + 3) === 40 ? "x = 5 : x² + 3x − 40 = (x − 5)(x + 8) = 0 ; −8 est écarté." : null), (x) => (x * (x + 3) === 70 ? "x = 7 : 7 · 10 = 70." : null), (x) => (x * (x + 3) === 28 ? "x = 4 : (x − 4)(x + 7) = 0." : null)] }),
    },
    eq3: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On ramène tout à gauche, on met en évidence \\(x\\), on factorise ce qui reste, puis on annule chaque facteur. Une équation de degré 3 a au plus trois solutions.", exemple: ["\\(x^3 - 4x = 0\\), \\(x(x - 2)(x + 2) = 0\\) : \\(-2\\), \\(0\\), \\(2\\).", "\\(x^3 - 9x = 0\\), \\(x(x - 3)(x + 3) = 0\\) : \\(-3\\), \\(0\\), \\(3\\)."] },
      predict: { q: "x³ − 4x = 0 : combien de solutions au plus ?", choices: ["1", "2", "3"], good: 2, why: "x(x − 2)(x + 2) = 0 : trois facteurs, trois solutions : −2, 0 et 2." },
      defis: ["Trouve une solution positive de x³ − 4x = 0.", "Trouve une solution négative.", "Trouve la troisième."],
      play: hunt({ start: 1, min: -4, max: 4, show: (x) => `<div class="act-out">${nb(x)}³ − 4 · ${nb(x)} = ${nb(x ** 3)} − ${nb(4 * x).replace("−", "(−") + (x < 0 ? ")" : "")} = <b>${nb(x ** 3 - 4 * x)}</b></div>`,
        wins: [(x) => (x > 0 && x ** 3 === 4 * x ? "x = 2 : 8 − 8 = 0." : null), (x) => (x < 0 && x ** 3 === 4 * x ? "x = −2 : −8 + 8 = 0." : null), (x) => (x === 0 ? "x = 0 : x(x − 2)(x + 2) = 0 a trois solutions." : null)] }),
    },
    bicarre: {
      predict: { q: "x⁴ − 5x² + 4 = 0. Si l'on pose X = x², l'équation devient…", choices: ["X² − 5X + 4 = 0", "X⁴ − 5X + 4 = 0", "X − 5X + 4 = 0"], good: 0, why: "x⁴ = (x²)² = X². C'est une équation du 2e degré en X : X = 1 ou X = 4." },
      defis: ["Trouve une solution x de x⁴ − 5x² + 4 = 0.", "Trouve une solution x de valeur absolue différente.", "Trouve les quatre solutions."],
      play: hunt({ start: 0, min: -3, max: 3, show: (x) => `<div class="act-out">X = x² = <b>${sq(x)}</b><br>X² − 5X + 4 = ${sq(x * x)} − ${nb(5 * x * x)} + 4 = <b>${nb(x ** 4 - 5 * x * x + 4)}</b><br>${x ** 4 - 5 * x * x + 4 === 0 ? "<b>Solution ✓</b>" : "Pas une solution"}</div>`, note: "Chaque valeur de X positive donne deux x opposés.",
        wins: [(x, s) => (x ** 4 - 5 * x * x + 4 === 0 ? (s.add(x), "x = " + nb(x) + " : X = " + sq(x) + ".") : null), (x, s) => { if (x ** 4 - 5 * x * x + 4 === 0) s.add(x); return [...s].some((u) => Math.abs(u) !== Math.abs(x)) && x ** 4 - 5 * x * x + 4 === 0 ? "Deux valeurs de X : 1 et 4." : null; }, (x, s) => { if (x ** 4 - 5 * x * x + 4 === 0) s.add(x); return s.size === 4 ? "Quatre solutions : −2, −1, 1, 2 (X = 1 et X = 4 en donnent deux chacune)." : null; }] }),
    },
    eqirr: {
      predict: { q: "√(x + 7) = x + 1. En élevant au carré, on trouve x = 2 ou x = −3. Les deux conviennent-elles ?", choices: ["Oui", "Non, seulement 2", "Non, seulement −3"], good: 1, why: "Pour −3 : √4 = 2, mais x + 1 = −2. Une racine n'est jamais négative : −3 est une solution « parasite »." },
      defis: ["Trouve x tel que √(x + 7) = x + 1.", "Trouve un x tel que les carrés soient égaux mais pas les deux membres.", "Trouve x tel que √(x + 7) = 4."],
      play: hunt({ start: 0, min: -7, max: 12, show: (x) => `<div class="act-out">Membre de gauche : √(x + 7) = <b>${nb(+Math.sqrt(x + 7).toFixed(3))}</b><br>Membre de droite : x + 1 = <b>${nb(x + 1)}</b><br><span class="small muted">Au carré, à gauche : x + 7 = ${nb(x + 7)}<br>Au carré, à droite : (x + 1)² = ${sq(x + 1)}</span></div>`,
        wins: [(x) => (Math.sqrt(x + 7) === x + 1 ? "x = 2 : √9 = 3 = 2 + 1." : null), (x) => (x + 7 === (x + 1) ** 2 && Math.sqrt(x + 7) !== x + 1 ? "x = −3 : 4 = 4 au carré, mais √4 = 2 ≠ −2. Le carré a « oublié » le signe : on vérifie toujours." : null), (x) => (Math.sqrt(x + 7) === 4 ? "x = 9 : x + 7 = 16." : null)] }),
    },
  });
})();
