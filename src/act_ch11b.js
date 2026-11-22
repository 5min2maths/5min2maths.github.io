// Chantier 11e · 1. Nombres et opérations, 2. Pythagore, 3. 3D (17.11) : leçons actives (devine / manipule / retiens)
// et rappels de cours pour fracadd, fracmul, fracconv, puiss, sci, scicalc, pyth, pythfig, pythrec, vol, volcone,
// airepyr, volcomp, volmanq (prio a déjà la sienne). Chargé après active.js et lessons2.js. Pas de TeX dans ce qui est
// redessiné (exposants en caractères ⁰¹²³…).
(function () {
  const R2 = {
    fracadd: ["Additionner des fractions", "On n'additionne que des parts de même taille : il faut un dénominateur commun.",
      "On cherche le plus petit multiple commun des dénominateurs. On écrit chaque fraction avec ce dénominateur (en multipliant numérateur <b>et</b> dénominateur par le même nombre), on additionne les numérateurs, puis on simplifie. Un nombre entier s'écrit aussi comme une fraction : \\(2 = \\frac{6}{3}\\).",
      ["\\(\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}\\).", "\\(\\frac{5}{6} - \\frac{3}{4} = \\frac{10}{12} - \\frac{9}{12} = \\frac{1}{12}\\).", "\\(2 - \\frac{3}{5} = \\frac{10}{5} - \\frac{3}{5} = \\frac{7}{5}\\)."],
      "On n'additionne jamais les dénominateurs : \\(\\frac{1}{4} + \\frac{1}{6}\\) n'est pas \\(\\frac{2}{10}\\)."],
    fracmul: ["Multiplier et diviser des fractions", "Prendre une fraction d'une fraction, c'est multiplier.",
      "On multiplie les numérateurs entre eux et les dénominateurs entre eux ; on simplifie avant si possible. Diviser par une fraction, c'est multiplier par son inverse : \\(\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}\\). Les fractions d’un nombre se calculent : \\(\\frac{3}{4}\\) de 28, c'est \\(28 : 4 \\cdot 3 = 21\\).",
      ["\\(\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}\\).", "\\(\\frac{4}{9} \\cdot \\frac{15}{8} = \\frac{1 \\cdot 5}{3 \\cdot 2} = \\frac{5}{6}\\) (simplifié avant).", "\\(\\frac{3}{4} : \\frac{3}{8} = \\frac{3}{4} \\cdot \\frac{8}{3} = 2\\) : il y a deux fois \\(\\frac{3}{8}\\) dans \\(\\frac{3}{4}\\)."],
      "Pour multiplier, pas de dénominateur commun ; pour diviser, on inverse la <b>deuxième</b> fraction."],
    fracconv: ["Fraction, décimal, pourcentage", "Un même nombre a plusieurs écritures.",
      "Fraction → décimal : on divise le numérateur par le dénominateur. Décimal → fraction : sur 10, 100, 1000…, puis on simplifie. Pourcentage : « pour cent », donc sur 100. Un nombre périodique s'écrit aussi en fraction : avec \\(x = 0{,}\\overline{3}\\), \\(10x - x = 3\\), donc \\(x = \\frac{3}{9} = \\frac{1}{3}\\).",
      ["\\(\\frac{3}{8} = 3 : 8 = 0{,}375 = 37{,}5\\,\\%\\).", "\\(0{,}35 = \\frac{35}{100} = \\frac{7}{20}\\).", "\\(0{,}\\overline{27} = \\frac{27}{99} = \\frac{3}{11}\\) (période de 2 chiffres : sur 99)."],
      "Deux baisses successives de 20 % ne font pas 40 % : la deuxième porte sur le prix déjà baissé (\\(0{,}8 \\cdot 0{,}8 = 0{,}64\\), soit 36 %)."],
    puiss: ["Puissances", "\\(a^n\\) est un raccourci pour \\(n\\) facteurs \\(a\\).",
      "Même base : \\(a^m \\cdot a^n = a^{m+n}\\), \\(\\frac{a^m}{a^n} = a^{m-n}\\), \\((a^m)^n = a^{m \\cdot n}\\). Exposant nul ou négatif : \\(a^0 = 1\\) et \\(a^{-n} = \\frac{1}{a^n}\\) (chaque marche vers le bas divise par \\(a\\)). Sans parenthèses, la puissance ne porte que sur le nombre : \\(-3^2 = -9\\), mais \\((-3)^2 = 9\\).",
      ["\\(2^3 \\cdot 2^4 = 2^7 = 128\\).", "\\(\\frac{5^2}{5^5} = 5^{-3} = \\frac{1}{125}\\).", "\\(2^5 \\cdot 5^5 = 10^5\\) : même exposant, on regroupe les bases."],
      "Un exposant négatif ne rend pas le nombre négatif : \\(2^{-3} = \\frac{1}{8}\\), pas \\(-8\\)."],
    sci: ["Notation scientifique", "Un nombre très grand ou très petit s'écrit \\(a \\cdot 10^n\\), avec \\(1 \\le a < 10\\).",
      "On place la virgule après le premier chiffre non nul : c'est \\(a\\). L'exposant \\(n\\) compte de combien de rangs on a déplacé la virgule : positif pour un nombre plus grand que 10, négatif pour un nombre plus petit que 1. Pour comparer, on regarde d'abord l'exposant.",
      ["\\(4\\text{'}500\\text{'}000 = 4{,}5 \\cdot 10^6\\).", "\\(0{,}00045 = 4{,}5 \\cdot 10^{-4}\\).", "\\(34 \\cdot 10^5 = 3{,}4 \\cdot 10^1 \\cdot 10^5 = 3{,}4 \\cdot 10^6\\)."],
      "\\(52 \\cdot 10^{-5}\\) n'est pas en notation scientifique : 52 n'est pas entre 1 et 10."],
    scicalc: ["Calculer en notation scientifique", "On traite séparément les nombres devant et les puissances de 10.",
      "Produit : on multiplie les nombres devant et on additionne les exposants. Quotient : on divise les nombres et on soustrait les exposants. À la fin, on remet le nombre devant entre 1 et 10, en corrigeant l'exposant.",
      ["\\((3 \\cdot 10^4) \\cdot (2 \\cdot 10^5) = 6 \\cdot 10^9\\).", "\\((5 \\cdot 10^6) \\cdot (4 \\cdot 10^2) = 20 \\cdot 10^8 = 2 \\cdot 10^9\\).", "\\(\\frac{4 \\cdot 10^3}{8 \\cdot 10^{-2}} = 0{,}5 \\cdot 10^5 = 5 \\cdot 10^4\\)."],
      "Si le nombre devant grandit (20 au lieu de 2), l'exposant diminue d'autant, et inversement."],
    pyth: ["Théorème de Pythagore", "Dans un triangle rectangle, le carré de l'hypoténuse vaut la somme des carrés des deux autres côtés.",
      "L'hypoténuse est le plus grand côté, en face de l'angle droit. Pour la trouver : on additionne les carrés des cathètes, puis on prend la racine. Pour trouver une cathète : on soustrait les carrés. La réponse exacte s'écrit souvent \\(a\\sqrt{b}\\).",
      ["Cathètes 6 et 8 : \\(c^2 = 36 + 64 = 100\\), \\(c = 10\\).", "Hypoténuse 13, cathète 5 : \\(b^2 = 169 - 25 = 144\\), \\(b = 12\\).", "Cathètes 2 et 4 : \\(c = \\sqrt{20} = 2\\sqrt{5}\\)."],
      "On additionne les carrés, pas les côtés : \\(6 + 8 = 14\\) n'est pas l'hypoténuse."],
    pythfig: ["Pythagore dans les figures", "Le triangle rectangle est souvent caché.",
      "Diagonale d'un rectangle : les deux côtés et la diagonale. Hauteur d'un triangle isocèle : elle coupe la base en son milieu. Grande diagonale d'un pavé : \\(d^2 = a^2 + b^2 + c^2\\). Pyramide : la hauteur, le demi-côté et l'apothème (ou la demi-diagonale et l'arête) forment un triangle rectangle.",
      ["Rectangle 9 × 12 : \\(d = \\sqrt{81 + 144} = 15\\).", "Isocèle 10, 10, base 12 : \\(h = \\sqrt{100 - 36} = 8\\).", "Pavé 2 × 3 × 6 : \\(d = \\sqrt{4 + 9 + 36} = 7\\)."],
      "Dans le triangle isocèle, on prend la <b>demi</b>-base."],
    pythrec: ["La réciproque de Pythagore", "Pythagore sert aussi à savoir si un triangle est rectangle.",
      "On calcule le carré du plus grand côté et la somme des carrés des deux autres. S'ils sont égaux, le triangle est rectangle (réciproque) ; sinon, il ne l'est pas. C'est le principe de l'équerre des maçons : 3, 4, 5 (ou 60, 80, 100 cm).",
      ["5, 12, 13 : \\(25 + 144 = 169 = 13^2\\), rectangle.", "5, 7, 9 : \\(25 + 49 = 74 \\neq 81\\), pas rectangle.", "1,5 ; 2 ; 2,5 : \\(2{,}25 + 4 = 6{,}25\\), rectangle."],
      "Une égalité « presque » vraie ne suffit pas : 74 et 81, ce n'est pas égal."],
    vol: ["Volumes des prismes et cylindres", "Volume = aire de la base × hauteur.",
      "On empile des couches identiques à la base. Pavé : \\(a \\cdot b \\cdot c\\). Prisme : aire du triangle (ou du trapèze) de base × longueur. Cylindre : \\(\\pi r^2 h\\). Contenances : \\(1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3\\), \\(1\\ \\text{cL} = 10\\ \\text{cm}^3\\).",
      ["Pavé 4 × 3 × 3 : 12 cubes par couche, 3 couches, \\(36\\ \\text{cm}^3\\).", "Prisme de base triangulaire (base 6, hauteur 4), long de 10 : \\(12 \\cdot 10 = 120\\).", "Cylindre \\(r = 3\\), \\(h = 5\\) : \\(45\\pi \\approx 141{,}4\\)."],
      "\\(2\\pi r h\\) est l'aire latérale du cylindre, pas son volume."],
    volcone: ["Pyramide, cône, boule", "Une pyramide vaut le tiers du prisme de même base et même hauteur.",
      "Pyramide et cône : \\(V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h\\). Boule : \\(V = \\frac{4}{3}\\pi r^3\\). Sphère (la surface) : \\(A = 4\\pi r^2\\). Si toutes les longueurs sont multipliées par \\(k\\), le volume est multiplié par \\(k^3\\).",
      ["Pyramide base 6 × 6, hauteur 5 : \\(\\frac{36 \\cdot 5}{3} = 60\\).", "Cône \\(r = 3\\), \\(h = 4\\) : \\(12\\pi\\).", "Boule \\(r = 3\\) : \\(36\\pi\\)."],
      "Avec un diamètre, on prend d'abord la moitié pour avoir le rayon."],
    airepyr: ["Aire d'une pyramide", "Les faces latérales sont des triangles ; leur hauteur est l'apothème.",
      "Pyramide régulière à base carrée de côté \\(c\\) et d'apothème \\(a\\) : aire latérale \\(4 \\cdot \\frac{c \\cdot a}{2} = 2ca\\) ; aire totale \\(c^2 + 2ca\\). L'apothème se calcule avec Pythagore : \\(a^2 = h^2 + \\left(\\frac{c}{2}\\right)^2\\).",
      ["\\(c = 6\\), \\(h = 4\\) : \\(a = 5\\), aire latérale \\(60\\).", "\\(c = 10\\), \\(h = 12\\) : \\(a = 13\\), aire totale \\(100 + 260 = 360\\)."],
      "La hauteur des faces est l'apothème, pas la hauteur de la pyramide."],
    volcomp: ["Solides composés", "On découpe en solides simples.",
      "On repère les solides (cube, pyramide, cylindre, cône, demi-boule), on calcule chaque volume avec ses propres dimensions, puis on additionne (ou on soustrait un trou). On garde \\(\\pi\\) en facteur jusqu'au bout.",
      ["Cube de 3 cm d'arête + pyramide de hauteur 3 : \\(27 + 9 = 36\\).", "Silo : cylindre \\(r = 3\\), \\(h = 10\\) et demi-boule : \\(90\\pi + 18\\pi = 108\\pi\\).", "Cube de 10 cm d'arête percé d'un trou \\(r = 2\\) : \\(1000 - 40\\pi\\)."],
      "Dans une gélule, la partie cylindrique est plus courte que la gélule : on retire deux rayons."],
    volmanq: ["Retrouver une dimension", "Une formule de volume est une équation.",
      "On écrit la formule, on remplace ce qu'on connaît, puis on isole la dimension cherchée. Pour un cône ou une pyramide, n'oublie pas le facteur 3 ; pour un rayon, on termine par une racine (carrée ou cubique).",
      ["Cylindre \\(r = 3\\), \\(V = 36\\pi\\) : \\(9h = 36\\), \\(h = 4\\).", "Cône \\(r = 3\\), \\(V = 18\\pi\\) : \\(\\frac{9h}{3} = 18\\), \\(h = 6\\).", "Boule \\(V = 36\\pi\\) : \\(r^3 = 27\\), \\(r = 3\\)."],
      "Convertis d'abord : 1 L = 1000 cm³."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // Chercheur : un curseur, l'affichage calculé en direct ; chaque défi vérifie la valeur.
  // Commentaire testeur du 17.11 : « les manipulations où on ne fait que toucher des curseurs n'apportent pas grand-chose ».
  // Mode réponse (o.ask) : l'élève calcule et tape sa réponse ; la figure se met à jour seulement après « Vérifier ».
  // Le curseur reste pour les vraies manipulations (colorier, descendre l'escalier) : o.ask absent.
  const hunt = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  // Pyramide à base carrée (commentaire 👎 du 21.11 : la leçon n'avait aucune figure) : hauteur, demi-côté et apothème en triangle rectangle.
  const pyrFig = (c, h, a) => {
    const A = [40, 190], B = [210, 190], C = [270, 140], D = [100, 140], O = [155, 165], S = [155, 40], Mx = [125, 190];
    const L = (p, q, cls, ex = "") => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" class="${cls}" ${ex}/>`;
    const T = (x, y, t, ex = "") => `<text x="${x}" y="${y}" class="f-txt" font-size="13" ${ex}>${t}</text>`;
    let g = `<path d="M${A} L${B} L${C} L${D} Z" class="f-soft"/>`;
    g += L(A, D, "f-line", 'stroke-dasharray="4 3"') + L(D, C, "f-line", 'stroke-dasharray="4 3"') + L(S, D, "f-line", 'stroke-dasharray="4 3"');
    g += L(A, B, "f-line") + L(B, C, "f-line") + L(S, A, "f-line") + L(S, B, "f-line") + L(S, C, "f-line");
    g += L(S, O, "f-line", 'stroke-dasharray="5 3" style="stroke:var(--margin)" stroke-width="2"') + L(O, Mx, "f-line", 'style="stroke:var(--margin)" stroke-width="2"') + L(S, Mx, "f-line", 'style="stroke:var(--blue)" stroke-width="3"');
    g += `<path d="M${O[0]},${O[1] - 9} L${O[0] - 5},${O[1] - 6} L${O[0] - 5},${O[1] + 3}" fill="none" class="f-line" stroke-width="1"/>`;
    g += T(161, 128, "h = " + h, 'style="fill:var(--margin)"') + T(146, 186, c / 2, 'text-anchor="middle" font-size="12" style="fill:var(--margin)"') + T(133, 120, "a = " + (a == null ? "?" : a), 'text-anchor="end" style="fill:var(--blue)" font-weight="700"') + T(125, 210, "côté " + c + " cm", 'text-anchor="middle"');
    return svg(300, 220, g, "pyramide à base carrée : hauteur " + h + ", demi-côté " + c / 2 + ", apothème " + (a == null ? "inconnu" : a));
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Barre de fraction : a/b de la longueur, avec graduations en 1/n
  const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
    if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
    return g; };

  Object.assign(ACTIVE, {
    fracadd: {
      predict: { q: "Combien font 1/4 + 1/6 ?", choices: ["2/10", "5/12", "2/24"], good: 1, why: "Un quart et un sixième ne sont pas des parts de même taille : on les découpe en douzièmes, 3/12 + 2/12 = 5/12. Additionner les dénominateurs donnerait 2/10 = 1/5, moins qu'un quart seul !" },
      defis: ["Trouve le plus petit dénominateur commun de 1/4 et 1/6.", "Même chose pour 2/3 et 3/5.", "Et pour 3/8 et 5/12."],
      play: hunt({ ask: true, label: "Dénominateur commun", start: 2, min: 2, max: 60,
        show: (x, s) => { const [a, b, c, d] = [[1, 4, 1, 6], [2, 3, 3, 5], [3, 8, 5, 12]][s], okb = x % b === 0, okd = x % d === 0;
          return svg(320, 70, bar(a, b, okb ? x : 0, 8, "f-fill") + bar(c, d, okd ? x : 0, 40, "f-fill2"), "deux barres de fraction") +
            `<div class="act-out">${a}/${b} ${okb ? "= <b>" + (a * x) / b + "/" + x + "</b>" : ": " + x + " n'est pas un multiple de " + b}<br>${c}/${d} ${okd ? "= <b>" + (c * x) / d + "/" + x + "</b>" : ": " + x + " n'est pas un multiple de " + d}${okb && okd ? "<br>Somme : " + ((a * x) / b + (c * x) / d) + "/" + x + " = <b>" + fr((a * x) / b + (c * x) / d, x) + "</b>" : ""}</div>`; },
        wins: [W(12, "12 : 3/12 + 2/12 = 5/12. 24 marcherait aussi, mais 12 est le plus petit."), W(15, "15 : 10/15 + 9/15 = 19/15."), W(24, "24 : 9/24 + 10/24 = 19/24. Inutile d'aller jusqu'à 8 · 12 = 96.")] }),
    },
    fracmul: {
      predict: { q: "Les 2/3 de 3/4 d'une tablette de chocolat, c'est…", choices: ["5/7 de la tablette", "1/2 de la tablette", "6/7 de la tablette"], good: 1, why: "On prend 2 tiers d'une part de 3 quarts : 2/3 · 3/4 = 6/12 = 1/2. « De » veut dire « fois »." },
      defis: ["Colorie les 2/3 de 3/4 du carré (règle les lignes).", "Colorie la moitié de 4/5.", "Colorie les 3/4 de 2/5."],
      play: hunt({ label: "Lignes coloriées", start: 0, min: 0, max: 4,
        show: (x, s) => { const [a, b, c, e] = [[3, 4, 2, 3], [4, 5, 1, 2], [2, 5, 3, 4]][s], r = Math.min(x, e), cw = 240 / b, rh = 120 / e; let g = "";
          for (let i = 0; i < b; i++) for (let j = 0; j < e; j++) g += `<rect x="${40 + i * cw}" y="${10 + j * rh}" width="${cw}" height="${rh}" class="${i < a && j < r ? "f-fill" : i < a ? "f-fill2" : "f-soft"}" stroke="var(--ink)" stroke-width="0.8"/>`;
          return svg(320, 140, g, "carré découpé") + `<div class="act-out">${r}/${e} de ${a}/${b} = ${r * a}/${e * b}${r ? " = <b>" + fr(r * a, e * b) + "</b>" : ""} du carré<br><span class="small muted">colonnes coloriées : ${a}/${b} ; cases doublement coloriées : ${r * a} sur ${e * b}</span></div>`; },
        wins: [W(2, "2/3 · 3/4 = 6/12 = 1/2 : numérateurs entre eux, dénominateurs entre eux."), W(1, "1/2 · 4/5 = 4/10 = 2/5."), W(3, "3/4 · 2/5 = 6/20 = 3/10.")] }),
    },
    fracconv: {
      predict: { q: "3/4 s'écrit en nombre décimal…", choices: ["0,34", "0,75", "3,4"], good: 1, why: "3/4, c'est 3 ÷ 4 = 0,75, soit 75 %. La barre de fraction n'est pas une virgule." },
      defis: ["Trouve le pourcentage égal à 3/4.", "Trouve le pourcentage égal à 1/5.", "Trouve le pourcentage qui s'écrit 7/20."],
      play: hunt({ ask: true, label: "Pourcentage", start: 50, min: 0, max: 100, step: 5,
        show: (x) => { let g = ""; for (let k = 0; k < 100; k++) g += `<rect x="${60 + (k % 10) * 20}" y="${4 + Math.floor(k / 10) * 13}" width="19" height="12" class="${k < x ? "f-fill" : "f-soft"}"/>`;
          return svg(320, 136, g, x + " cases sur 100") + `<div class="act-out">${x} % = ${x}/100 = <b>${fr(x, 100)}</b> = ${nb(x / 100)}</div>`; },
        wins: [W(75, "75 % = 75/100 = 3/4 = 0,75."), W(20, "20 % = 20/100 = 1/5 = 0,2."), W(35, "35 % = 35/100 = 7/20 = 0,35 (on simplifie par 5).")] }),
    },
    puiss: {
      predict: { q: "Que vaut 2⁻³ ?", choices: ["−8", "1/8", "−6"], good: 1, why: "Chaque fois que l'exposant baisse de 1, on divise par 2 : 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4, 2⁻³ = 1/8." },
      defis: ["Descends l'escalier jusqu'à 2⁰. Que vaut-il ?", "Trouve l'exposant qui donne 1/2.", "Trouve l'exposant qui donne 1/8."],
      play: hunt({ label: "Exposant", start: 4, min: -4, max: 6,
        show: (x) => { let rows = ""; for (let n = 6; n >= -4; n--) { const v = n >= 0 ? String(2 ** n) : "1/" + 2 ** -n; rows += `<div style="padding-left:${(6 - n) * 10}px;${n === x ? "font-weight:700;color:var(--blue)" : "opacity:.55"}">2${sup(n)} = ${v}${n > -4 ? ' <span class="small muted">÷ 2 ↓</span>' : ""}</div>`; }
          return `<div class="act-out" style="text-align:left">${rows}</div>`; },
        wins: [W(0, "2⁰ = 1 : c'est 2¹ ÷ 2. Toute puissance d'exposant 0 vaut 1."), W(-1, "2⁻¹ = 1 ÷ 2 = 1/2 : un exposant négatif donne l'inverse."), W(-3, "2⁻³ = 1/2³ = 1/8 : positif, mais plus petit que 1.")] }),
    },
    sci: {
      predict: { q: "0,00052 en notation scientifique, c'est…", choices: ["5,2 · 10⁴", "5,2 · 10⁻⁴", "52 · 10⁻⁵"], good: 1, why: "La virgule recule de 4 rangs pour arriver à 5,2 : le nombre est plus petit que 1, l'exposant est négatif, −4. 52 · 10⁻⁵ est juste en valeur, mais 52 n'est pas entre 1 et 10." },
      defis: ["Écris 4'500'000 sous la forme 4,5 · 10ⁿ.", "Écris 0,00045 sous la forme 4,5 · 10ⁿ.", "Écris 450 sous la forme 4,5 · 10ⁿ."],
      play: hunt({ ask: true, label: "Exposant n", start: 0, min: -8, max: 9,
        show: (x, s) => { const t = [4500000, 0.00045, 450][s], v = 4.5 * 10 ** x, txt = (y) => (y >= 1 ? String(Math.round(y)).replace(/\B(?=(\d{3})+(?!\d))/g, "'") : y.toFixed(12).replace(/0+$/, "")).replace(".", ",");
          return `<div class="act-out">4,5 · 10${sup(x)} = <b>${txt(v)}</b><br>cible : ${txt(t)} → ${ok(Math.abs(v - t) < 1e-12 * t, v < t)}</div>`; },
        note: "Compte de combien de rangs la virgule se déplace.",
        wins: [W(6, "4'500'000 = 4,5 · 10⁶ : la virgule avance de 6 rangs."), W(-4, "0,00045 = 4,5 · 10⁻⁴ : plus petit que 1, exposant négatif."), W(2, "450 = 4,5 · 10² : deux rangs.")] }),
    },
    scicalc: {
      predict: { q: "(2 · 10³) · (4 · 10⁵) = ?", choices: ["8 · 10⁸", "8 · 10¹⁵", "6 · 10⁸"], good: 0, why: "On multiplie les nombres (2 · 4 = 8) et on additionne les exposants (3 + 5 = 8) : 10³ · 10⁵, c'est 3 + 5 facteurs 10." },
      defis: ["(3 · 10⁴) · (2 · 10⁵) = 6 · 10ⁿ : trouve n.", "(4 · 10³) ÷ (8 · 10⁻²) = 5 · 10ⁿ : trouve n.", "(5 · 10⁶) · (4 · 10²) = 2 · 10ⁿ : trouve n."],
      play: hunt({ ask: true, label: "n", start: 5, min: -4, max: 14,
        show: (x, s) => { const [lab, m, t] = [["(3 · 10⁴) · (2 · 10⁵)", 6, 6e9], ["(4 · 10³) ÷ (8 · 10⁻²)", 5, 5e4], ["(5 · 10⁶) · (4 · 10²)", 2, 2e9]][s], v = m * 10 ** x;
          return `<div class="act-out">${lab} = ${m} · 10${sup(x)} ? → ${ok(Math.abs(v - t) < 1e-6 * t, v < t)}</div>`; },
        note: "Calcule d'abord avec les nombres, puis avec les exposants ; remets le nombre devant entre 1 et 10.",
        wins: [W(9, "6 · 10⁹ : 3 · 2 = 6 et 4 + 5 = 9."), W(4, "4 ÷ 8 = 0,5 et 3 − (−2) = 5 : 0,5 · 10⁵ = 5 · 10⁴."), W(9, "5 · 4 = 20 et 6 + 2 = 8 : 20 · 10⁸ = 2 · 10⁹.")] }),
    },
    pyth: {
      predict: { q: "Un triangle rectangle a des cathètes de 6 cm et 8 cm. Son hypoténuse mesure…", choices: ["14 cm", "10 cm", "48 cm"], good: 1, why: "6² + 8² = 36 + 64 = 100, et √100 = 10. On additionne les carrés, pas les côtés." },
      defis: ["Cathètes 6 et 8 : calcule l'hypoténuse.", "Cathètes 5 et 12 : calcule l'hypoténuse.", "Hypoténuse 15 et cathète 9 : calcule l'autre cathète."],
      play: hunt({ ask: true, label: "Longueur", start: 7, min: 1, max: 20,
        show: (x, s) => { const [a, b, unk] = [[8, 6, "c"], [12, 5, "c"], [9, x, "b"]][s], k = 11, A = [40, 185], B = [40 + a * k, 185];
          const C = [40, 185 - Math.min(unk === "b" ? x : b, 16) * k], hyp = unk === "c" ? x : 15, real = Math.hypot(B[0] - C[0], B[1] - C[1]) / k, ang = Math.atan2(B[1] - C[1], B[0] - C[0]), tip = [C[0] + Math.cos(ang) * hyp * k, C[1] + Math.sin(ang) * hyp * k];
          const g = `<polyline points="${B.join(",")} ${A.join(",")} ${C.join(",")}" class="f-line" fill="none" stroke-width="2"/><rect x="40" y="173" width="12" height="12" class="f-line" fill="none"/><line x1="${C[0]}" y1="${C[1]}" x2="${tip[0].toFixed(1)}" y2="${tip[1].toFixed(1)}" class="f-accent" stroke-width="3"/>`;
          const lhs = unk === "c" ? a * a + b * b : 81 + x * x, rhs = hyp * hyp;
          return svg(320, 195, g, "triangle rectangle") + `<div class="act-out">${unk === "c" ? a + "² + " + b + "² = " + lhs + " ; " + x + "² = " + rhs : "9² + " + x + "² = " + lhs + " ; 15² = 225"} → ${ok(lhs === rhs, unk === "c" ? rhs < lhs : lhs < rhs)}</div>`; },
        note: "Le trait coloré doit fermer exactement le triangle.",
        wins: [W(10, "6² + 8² = 100 = 10² : l'hypoténuse mesure 10."), W(13, "5² + 12² = 169 = 13²."), W(12, "15² − 9² = 225 − 81 = 144 = 12² : pour une cathète, on soustrait.")] }),
    },
    pythfig: {
      predict: { q: "Un rectangle mesure 9 cm sur 12 cm. Sa diagonale mesure…", choices: ["21 cm", "15 cm", "108 cm"], good: 1, why: "La diagonale coupe le rectangle en deux triangles rectangles : √(81 + 144) = √225 = 15." },
      defis: ["Rectangle 9 × 12 : trouve la diagonale.", "Triangle isocèle de côtés 10, 10 et de base 12 : trouve la hauteur.", "Pavé 2 × 3 × 6 : trouve la grande diagonale."],
      play: hunt({ ask: true, label: "Longueur", start: 5, min: 1, max: 20,
        show: (x, s) => { const L = [["Triangle (9 ; 12 ; diagonale) : 9² + 12² = 225", 225, x * x, "diagonale² = " + x * x], ["Triangle (demi-base 6 ; hauteur ; côté 10) : 6² + h² = " + (36 + x * x), 100, 36 + x * x, "côté² = 100"], ["Pavé : 2² + 3² + 6² = 49", 49, x * x, "diagonale² = " + x * x]][s];
          return `<div class="act-out">${L[0]}<br>${L[3]} → ${ok(L[1] === L[2], L[2] < L[1])}</div>`; },
        wins: [W(15, "√225 = 15."), W(8, "La hauteur coupe la base en deux : 10² − 6² = 64, h = 8."), W(7, "4 + 9 + 36 = 49 = 7² : d = 7.")] }),
    },
    pythrec: {
      predict: { q: "Un triangle de côtés 5, 7 et 9 est-il rectangle ?", choices: ["Oui", "Non", "On ne peut pas savoir"], good: 1, why: "5² + 7² = 25 + 49 = 74, mais 9² = 81. Pas d'égalité : il n'est pas rectangle." },
      defis: ["Côtés 6, 8 et x (le plus grand) : trouve x pour que le triangle soit rectangle.", "Côtés 7, x et 25 (25 le plus grand) : trouve x.", "Côtés 20, 21 et x (le plus grand) : trouve x."],
      play: hunt({ ask: true, label: "x", start: 10, min: 1, max: 40,
        show: (x, s) => { const [l, r, txt] = [[100, x * x, "6² + 8² = 100 ; x² = " + x * x], [49 + x * x, 625, "7² + x² = " + (49 + x * x) + " ; 25² = 625"], [841, x * x, "20² + 21² = 841 ; x² = " + x * x]][s];
          return `<div class="act-out">${txt} → ${l === r ? '<b class="act-ok">égalité : rectangle</b>' : "pas d'égalité : pas rectangle"}</div>`; },
        wins: [W(10, "6, 8, 10 : rectangle (le double de 3, 4, 5)."), W(24, "7² + 24² = 625 = 25²."), W(29, "20² + 21² = 841 = 29².")] }),
    },
    vol: {
      predict: { q: "Combien de cubes de 1 cm³ faut-il pour remplir un pavé de 4 cm × 3 cm × 2 cm ?", choices: ["9", "24", "14"], good: 1, why: "Une couche de 4 · 3 = 12 cubes, et 2 couches : 24 cm³. Volume = aire de la base × hauteur." },
      defis: ["Base 4 × 3 : combien de couches pour 36 cm³ ?", "Base 5 × 2 : combien de couches pour 70 cm³ ?", "Prisme de base triangulaire d'aire 6 cm² : quelle longueur pour 48 cm³ ?"],
      play: hunt({ ask: true, label: "Couches (hauteur en cm)", start: 1, min: 1, max: 12,
        show: (x, s) => { const [base, lab, t] = [[12, "4 × 3", 36], [10, "5 × 2", 70], [6, "triangle de 6 cm²", 48]][s]; let g = "";
          for (let k = 0; k < x; k++) g += `<rect x="${60 + k * 3}" y="${118 - k * 9}" width="160" height="9" class="${k % 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.6"/>`;
          return svg(320, 132, g, x + " couches") + `<div class="act-out">base ${lab} = ${base} cm² ; ${base} · ${x} = <b>${base * x} cm³</b> (cible ${t}) → ${ok(base * x === t, base * x < t)}</div>`; },
        wins: [W(3, "12 · 3 = 36 cm³."), W(7, "10 · 7 = 70 cm³."), W(8, "6 · 8 = 48 cm³ : même règle pour un prisme, aire de la base × longueur.")] }),
    },
    volcone: {
      predict: { q: "Combien de pyramides (même base, même hauteur) faut-il pour remplir un prisme ?", choices: ["2", "3", "4"], good: 1, why: "Une pyramide vaut exactement le tiers du prisme de même base et même hauteur : V = ⅓ · base · hauteur." },
      defis: ["Combien de cônes (même base, même hauteur) pour remplir le cylindre ?", "Combien de pyramides (même base, même hauteur) pour remplir le pavé ?", "Des cônes de même base, mais deux fois moins hauts : combien pour le cylindre ?"],
      play: hunt({ ask: true, label: "Nombre de solides versés", start: 1, min: 1, max: 8,
        show: (x, s) => { const d = s === 2 ? 6 : 3, pyr = s === 1, H = 100, hc = s === 2 ? H / 2 : H, lvl = Math.min(x / d, 1) * H, over = x > d, y0 = 125;
          let g = `<text x="70" y="14" class="f-txt" text-anchor="middle" font-size="12">1 ${pyr ? "pyramide" : "cône"}</text>`;
          g += pyr ? `<polygon points="30,${y0} 110,${y0} 70,${y0 - hc}" class="f-fill"/><polygon points="30,${y0} 110,${y0} 125,${y0 - 12} 70,${y0 - hc}" class="f-shape2" fill-opacity=".35"/>` : `<ellipse cx="70" cy="${y0}" rx="40" ry="9" class="f-fill"/><polygon points="30,${y0} 110,${y0} 70,${y0 - hc}" class="f-fill"/>`;
          g += `<text x="225" y="14" class="f-txt" text-anchor="middle" font-size="12">${pyr ? "pavé" : "cylindre"} (même base, hauteur ${s === 2 ? "double" : "égale"})</text>`;
          g += pyr ? `<rect x="185" y="${y0 - H}" width="80" height="${H}" class="f-soft" stroke="var(--ink)"/><rect x="185" y="${(y0 - lvl).toFixed(1)}" width="80" height="${lvl.toFixed(1)}" class="f-fill" fill-opacity=".8"/>`
            : `<rect x="185" y="${y0 - H}" width="80" height="${H}" class="f-soft"/><rect x="185" y="${(y0 - lvl).toFixed(1)}" width="80" height="${lvl.toFixed(1)}" class="f-fill" fill-opacity=".8"/><ellipse cx="225" cy="${y0 - H}" rx="40" ry="8" class="f-shape2"/><path d="M185 ${y0 - H} V${y0} A40 8 0 0 0 265 ${y0} V${y0 - H}" class="f-line" fill="none"/>`;
          for (let k = 1; k < d; k++) g += `<line x1="180" y1="${y0 - (k * H) / d}" x2="270" y2="${y0 - (k * H) / d}" class="f-line" stroke-dasharray="3 3" stroke-width=".6"/>`;
          return svg(320, 140, g, "solide versé dans le récipient") + `<div class="act-out">${x} ${pyr ? "pyramide" : "cône"}${x > 1 ? "s" : ""} versé${x > 1 ? "s" : ""} : ${fr(Math.min(x, 99), d)} du ${pyr ? "pavé" : "cylindre"} → ${x === d ? '<b class="act-ok">plein exactement</b>' : over ? "ça déborde" : "pas encore plein"}</div>`; },
        blank: (s) => `<div class="small muted">${["Imagine qu'on remplit un cône d'eau et qu'on le verse dans le cylindre.", "Même expérience avec une pyramide et un pavé.", "Cette fois, les cônes sont deux fois moins hauts que le cylindre."][s]}</div>`,
        wins: [W(3, "3 cônes : un cône vaut le tiers du cylindre, V = ⅓ π r² h."), W(3, "3 pyramides : V = ⅓ · base · hauteur."), W(6, "Deux fois moins haut, deux fois moins de volume : chaque cône vaut 1/6 du cylindre.")] }),
    },
    airepyr: {
      predict: { q: "Une pyramide à base carrée de 6 cm a une hauteur de 4 cm. Son apothème a (la hauteur d'une face triangulaire, en bleu) mesure…", fig: pyrFig(6, 4), choices: ["4 cm", "5 cm", "7 cm"], good: 1, why: "Hauteur, demi-côté et apothème forment un triangle rectangle : √(4² + 3²) = √25 = 5. L'apothème est plus long que la hauteur." },
      // Défis (22.11) : même tâche à chaque fois (trouver l'apothème), sans reprendre la pyramide du « Devine » ; l'aire latérale n'apparaît qu'une fois l'apothème juste.
      defis: ["Nouvelle pyramide : base 10 cm, hauteur 12 cm. Tape l'apothème.", "Base 16 cm, hauteur 6 cm. Tape l'apothème.", "Base 8 cm, hauteur 3 cm. Tape l'apothème."],
      play: hunt({ ask: true, label: "Apothème", start: 3, min: 1, max: 20,
        blank: (s) => { const [c, h] = [[10, 12], [16, 6], [8, 3]][s]; return pyrFig(c, h); },
        show: (x, s) => { const [c, h] = [[10, 12], [16, 6], [8, 3]][s], t = h * h + (c / 2) ** 2;
          return pyrFig(c, h, x) + `<div class="act-out">hauteur² + demi-côté² = ${h}² + ${c / 2}² = ${t} ; apothème² = ${x}² = ${x * x} → ${ok(t === x * x, x * x < t)}${t === x * x ? `<br>aire latérale : 4 · (${c} · ${x}) ÷ 2 = <b>${2 * c * x} cm²</b>` : ""}</div>`; },
        note: "Sous l'apothème, il y a le demi-côté de la base.",
        wins: [W(13, "√(144 + 25) = 13 ; aire latérale 2 · 10 · 13 = 260 cm²."), W(10, "√(36 + 64) = 10 ; aire latérale 2 · 16 · 10 = 320 cm²."), W(5, "√(9 + 16) = 5 ; aire latérale 2 · 8 · 5 = 80 cm².")] }),
    },
    volcomp: {
      predict: { q: "Un cube de 3 cm d'arête est surmonté d'une pyramide de même base, haute de 3 cm. Volume total du solide ?", choices: ["36 cm³", "54 cm³", "30 cm³"], good: 0, why: "Cube : 3 · 3 · 3 = 27. Pyramide : ⅓ · 9 · 3 = 9. Total : 36 cm³. On additionne les volumes des parties." },
      defis: ["On change la hauteur de la pyramide (même cube de 3 cm d'arête). Quelle hauteur donne 39 cm³ en tout ?", "Même cube : quelle hauteur de pyramide donne 45 cm³ en tout ?", "Cylindre (r = 1, h = 4) et cône de même base : quelle hauteur de cône pour 6π en tout ?"],
      play: hunt({ ask: true, label: "Hauteur du toit", start: 1, min: 1, max: 12,
        show: (x, s) => { if (s < 2) { const v = 27 + 3 * x, t = s ? 45 : 39; return `<div class="act-out">cube 27 + pyramide ⅓ · 9 · ${x} = 27 + ${3 * x} = <b>${v} cm³</b> (cible ${t}) → ${ok(v === t, v < t)}</div>`; }
          const v = 4 + x / 3; return `<div class="act-out">cylindre 4π + cône ⅓ · π · 1² · ${x} = <b>${nb(v)}π</b> (cible 6π) → ${ok(Math.abs(v - 6) < 1e-9, v < 6)}</div>`; },
        wins: [W(4, "27 + ⅓ · 9 · 4 = 27 + 12 = 39."), W(6, "27 + 18 = 45 : chaque cm de pyramide ajoute 3 cm³."), W(6, "4π + 2π = 6π : le cône de hauteur 6 vaut un cylindre de hauteur 2.")] }),
    },
    volmanq: {
      predict: { q: "Un cylindre de rayon 3 cm a un volume de 36π cm³. Sa hauteur mesure…", choices: ["4 cm", "12 cm", "6 cm"], good: 0, why: "π · 3² · h = 36π, donc 9h = 36 et h = 4. On remplace ce qu'on connaît, puis on isole h." },
      defis: ["Cylindre de rayon 3 et de volume 36π : calcule la hauteur.", "Cône de rayon 3 et de volume 18π : calcule la hauteur.", "Pavé de base 5 × 4 et de volume 140 cm³ : calcule la hauteur."],
      play: hunt({ ask: true, label: "Hauteur", start: 1, min: 1, max: 12,
        show: (x, s) => { const [lab, v, t] = [["π · 3² · " + x, 9 * x, 36], ["⅓ · π · 3² · " + x, 3 * x, 18], ["5 · 4 · " + x, 20 * x, 140]][s];
          return `<div class="act-out">${lab} = <b>${v}${s < 2 ? "π" : ""}</b> (cible ${t}${s < 2 ? "π" : ""}) → ${ok(v === t, v < t)}</div>`; },
        wins: [W(4, "9h = 36, h = 4."), W(6, "3h = 18, h = 6 : le facteur ⅓ du cône compte."), W(7, "20h = 140, h = 7.")] }),
    },
  });
})();
