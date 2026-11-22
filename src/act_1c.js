// Chantier 1re Collège (19.11) : leçons actives pour pct, racenc, tradexpr, fimg, modaff, f2, optim, euclide, angtri,
// trigexact, ensembles, domaine, racinv, transf, absval, ineq, trinfact, f2formes, f2trois, inter, geocomb, droitesrem (devine / manipule / retiens). Même moteur que act_ch11c.js (outils recopiés).
(function () {
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
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
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
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Barre de fraction : a/b de la longueur, avec graduations en 1/n
  const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
    if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
    return g; };
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
  // Droite graduée de −12 à 12, avec un départ et une arrivée.
  const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 30, 310, 30); for (let v = -12; v <= 12; v++) g += L(X(v), 26, X(v), 34, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 50, String(v).replace("-", "−"), "middle", 10));
    if (from !== null) g += `<circle cx="${X(from)}" cy="30" r="5" class="f-dot"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},22 Q${(X(from) + X(to)) / 2},2 ${X(to)},22" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="30" r="5" class="f-accent"/>`;
    return svg(320, 58, g, "droite graduée"); };
  // Configuration de Thalès schématique (étiquettes de longueurs).
  const thal = (k, labs) => { const A = [30, 120], B = [290, 140], C = [230, 20], D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
    let g = `<polygon points="${A} ${B} ${C}" class="f-shape"/>` + L(D[0], D[1], E[0], E[1], "f-accent", 2.4) + T(A[0] - 10, A[1] + 4, "A") + T(B[0] + 8, B[1] + 4, "B") + T(C[0] + 8, C[1], "C") + T(D[0], D[1] + 16, "D") + T(E[0] - 8, E[1] - 6, "E");
    const mid = (P, Q, dy) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2 + dy];
    for (const [k2, P, Q, dy] of [["AD", A, D, 16], ["DB", D, B, 16], ["AE", A, E, -8], ["EC", E, C, -8], ["DE", D, E, 0], ["BC", B, C, 0]]) if (labs[k2]) { const [x, y] = mid(P, Q, dy); g += T(x + (k2 === "DE" || k2 === "BC" ? 14 : 0), y, labs[k2], "middle", 12, /\?/.test(labs[k2]) ? "f-txt f-accent" : "f-txt"); }
    return svg(320, 160, g, "configuration de Thalès"); };
  const plain = (html) => `<div class="act-out">${html}</div>`;

  Object.assign(ACTIVE, {
    pct: {
      predict: { q: "Un prix augmente de 20 %, puis baisse de 20 %. Il est finalement…", choices: ["égal au prix de départ", "plus bas", "plus haut"], good: 1, why: "× 1,2 puis × 0,8 = × 0,96 : la baisse porte sur un prix déjà augmenté. Il baisse de 4 %." },
      defis: ["Prix de départ 100 CHF : prix après +20 % puis −20 % ?", "Un prix passe de 50 à 60 CHF : hausse en % ?", "Après une hausse de 25 %, un objet coûte 100 CHF. Prix de départ ?"],  garde: [1, 2], // la 1re reprend le « Devine »
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["100 · 1,2 · 0,8", "(60 − 50) ÷ 50", "100 ÷ 1,25"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(96, "100 · 1,2 = 120, puis 120 · 0,8 = 96 CHF."), W(20, "10 ÷ 50 = 0,2 = 20 % : on divise par le prix de DÉPART."), W(80, "On divise par le coefficient 1,25 : 80 CHF (et non 100 − 25 % = 75).")] }),
    },
    racenc: {
      predict: { q: "Entre quels entiers se trouve √50 ?", choices: ["7 et 8", "24 et 26", "5 et 6"], good: 0, why: "49 < 50 < 64, donc 7 < √50 < 8. La racine n'est pas la moitié !" },
      defis: ["Plus petit entier au-dessus de √50 ?", "Combien d'entiers n vérifient 6 < √n < 7 ?", "Plus grand entier n tel que √n < 10 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["vérifie : " + nb(x) + "² = " + nb(x * x) + " (comparer à 50)", "il faut 36 < n < 49 ; tu proposes " + nb(x), "vérifie : √" + nb(x) + " < 10 ⇔ " + nb(x) + " < 100"][s]),
        wins: [W(8, "8² = 64 > 50 et 7² = 49 < 50."), W(12, "De 37 à 48 : 12 entiers."), W(99, "n < 100 : le plus grand est 99.")] }),
    },
    tradexpr: {
      predict: { q: "« Le double de la somme de 3 et 4 » vaut…", choices: ["10", "14", "11"], good: 1, why: "Le premier mot dit la dernière opération : on double la SOMME, 2 · (3 + 4) = 14. 2 · 3 + 4 = 10 serait « la somme du double de 3 et de 4 »." },
      defis: ["La somme de 5 et du triple de 4 ?", "Le triple de la somme de 5 et 4 ?", "Le carré de la différence entre 9 et 4 ?"],
      play: hunt({ ask: true, label: "Résultat", show: (x, s) => plain(["5 + 3 · 4", "3 · (5 + 4)", "(9 − 4)²"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(17, "5 + 12 = 17 : la somme est la dernière opération."), W(27, "3 · 9 = 27 : le triple est la dernière opération."), W(25, "5² = 25 : on calcule la différence d'abord.")] }),
    },
    fimg: {
      predict: { q: "f(x) = x² − 3. Combien de nombres ont pour image 6 ?", choices: ["un seul", "deux", "aucun"], good: 1, why: "x² − 3 = 6 ⇔ x² = 9 ⇔ x = 3 ou x = −3 : deux antécédents. Une image est unique, un antécédent pas forcément." },
      defis: ["f(x) = x² − 3 : calcule f(−4).", "Antécédent POSITIF de 6 ?", "Antécédent NÉGATIF de 6 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s === 0 ? "f(−4) = (−4)² − 3 ; tu proposes <b>" + nb(x) + "</b>" : "f(" + nb(x) + ") = " + nb(x * x - 3)),
        wins: [W(13, "(−4)² = 16, 16 − 3 = 13."), W(3, "f(3) = 9 − 3 = 6."), W(-3, "f(−3) = 9 − 3 = 6 aussi : deux antécédents.")] }),
    },
    modaff: {
      predict: { q: "Taxi A : 6 CHF + 2 CHF/km. Taxi B : 3 CHF/km. Pour 10 km, le moins cher est…", choices: ["A", "B", "ils coûtent pareil"], good: 0, why: "A : 6 + 20 = 26 CHF ; B : 30 CHF. Au-delà de 6 km, la part fixe de A est « remboursée »." },
      defis: ["Prix de A pour 10 km ?", "Pour combien de km les deux taxis coûtent-ils le même prix ?", "Prix commun à cette distance ?"], garde: [1, 2],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s === 1 ? "A(" + nb(x) + ") = " + nb(6 + 2 * x) + " ; B(" + nb(x) + ") = " + nb(3 * x) : "tu proposes <b>" + nb(x) + "</b> CHF"),
        wins: [W(26, "6 + 2 · 10 = 26 CHF."), W(6, "6 + 2x = 3x ⇔ x = 6 km."), W(18, "6 + 12 = 18 = 3 · 6 CHF.")] }),
    },
    f2: {
      predict: { q: "La parabole f(x) = x² − 6x + 5 a son sommet en x = …", choices: ["3", "−3", "5"], good: 0, why: "x_S = −b ÷ (2a) = 6 ÷ 2 = 3 : c'est aussi le milieu des zéros 1 et 5." },
      defis: ["Abscisse du sommet de x² − 6x + 5 ?", "Ordonnée du sommet ?", "Plus grand zéro ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => t * t - 6 * t + 5 }], [], { numbers: true, xr: [-2, 8], yr: [-5, 8] }), show: (x) => FIG.plot([{ f: (t) => t * t - 6 * t + 5 }], [[x, 0, ""]], { numbers: true, xr: [-2, 8], yr: [-5, 8] }) + plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "x_S = 6 ÷ 2 = 3."), W(-4, "f(3) = 9 − 18 + 5 = −4."), W(5, "(x − 1)(x − 5) = 0 : zéros 1 et 5.")] }),
    },
    optim: {
      predict: { q: "Avec 20 m de clôture, quel rectangle a la plus grande aire ?", choices: ["2 m × 8 m", "5 m × 5 m", "1 m × 9 m"], good: 1, why: "Aire x(10 − x), maximale au sommet x = 5 : un carré de 25 m²." },
      defis: ["Règle la largeur pour une aire de 21 m².", "Puis pour 24 m².", "Trouve l'aire maximale (largeur 5)."],
      play: hunt({ label: "Largeur (m)", start: 1, min: 1, max: 9,
        show: (x) => { let g = `<rect x="40" y="10" width="${x * 24}" height="${(10 - x) * 12}" class="f-fill" stroke="var(--ink)"/>`; return svg(320, 130, g, "rectangle") + plain("largeur " + x + " m, longueur " + (10 - x) + " m → aire <b>" + x * (10 - x) + " m²</b>"); },
        wins: [(x) => (x * (10 - x) === 21 ? "3 × 7 = 21 (ou 7 × 3)." : ""), (x) => (x * (10 - x) === 24 ? "4 × 6 = 24." : ""), W(5, "5 × 5 = 25 m² : le sommet de la parabole x(10 − x).")] }),
    },
    euclide: {
      predict: { q: "Triangle rectangle : la hauteur coupe l'hypoténuse en 4 cm et 9 cm. La hauteur mesure…", choices: ["6,5 cm", "6 cm", "13 cm"], good: 1, why: "Théorème de la hauteur : h² = 4 · 9 = 36, h = 6 (et non la moyenne 6,5)." },
      defis: ["h pour des segments de 4 et 9 ?", "Cathète a (projection 4, hypoténuse 13) au carré : a² = ?", "h pour des segments de 2 et 8 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["h² = 4 · 9", "a² = p · c = 4 · 13", "h² = 2 · 8"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(6, "√36 = 6."), W(52, "a² = 52, a = 2√13."), W(4, "√16 = 4.")] }),
    },
    angtri: {
      predict: { q: "La somme des angles d'un pentagone vaut…", choices: ["360°", "540°", "900°"], good: 1, why: "On le découpe en 3 triangles depuis un sommet : 3 · 180° = 540°. En général (n − 2) · 180°." },
      defis: ["Chaque angle d'un hexagone régulier (en degrés) ?", "Nombre de côtés d'un polygone régulier dont chaque angle vaut 108° ?", "Un octogone se découpe en combien de triangles depuis un sommet ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(6 − 2) · 180 = 720, divisé par 6", "angle extérieur 180 − 108 = 72° ; 360 ÷ 72", "n − 2 triangles"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(120, "720 ÷ 6 = 120°."), W(5, "360 ÷ 72 = 5 : le pentagone régulier."), W(6, "8 − 2 = 6 triangles : 6 · 180° = 1080°.")] }),
    },
    trigexact: {
      predict: { q: "Une route de pente 100 % fait avec l'horizontale un angle de…", choices: ["90°", "45°", "100°"], good: 1, why: "Pente = tan(angle) ; 100 % ⇔ tan = 1 ⇔ 45° : on monte de 1 m pour 1 m d'avance." },
      defis: ["Hypoténuse 12, angle 30° : côté opposé ?", "Pente d'une route inclinée à 45° (en %) ?", "Hypoténuse 20, angle 60° : côté adjacent ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["12 · sin 30° = 12 · 1/2", "tan 45° = 1", "20 · cos 60° = 20 · 1/2"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(6, "sin 30° = 1/2 : 6."), W(100, "tan 45° = 1 : 100 %."), W(10, "cos 60° = 1/2 : 10.")] }),
    },
    ensembles: {
      predict: { q: "Combien de nombres entiers l'intervalle ]2 ; 5] contient-il ?", choices: ["4", "3", "2"], good: 1, why: "Crochet tourné vers l'extérieur en 2 : 2 est exclu ; 5 est compris. Il reste 3, 4, 5." },
      defis: ["Nombre d'entiers de [−3 ; 4] ?", "Nombre d'entiers de [−3 ; 4] ∩ ]0 ; 9[ ?", "Plus petit entier de ]−2 ; 7] ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["de −3 à 4, bornes comprises", "partie commune : ]0 ; 4]", "−2 est exclu"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(8, "−3, −2, −1, 0, 1, 2, 3, 4 : 8 entiers."), W(4, "]0 ; 4] : 1, 2, 3, 4."), W(-1, "−2 exclu : le plus petit est −1.")] }),
    },
    domaine: {
      predict: { q: "Pour f(x) = √(x − 3), quel nombre est interdit ?", choices: ["3", "0", "2"], good: 2, why: "Sous la racine, il faut x − 3 ≥ 0, donc x ≥ 3 : 2 est interdit, 3 est permis (√0 = 0)." },
      defis: ["f(x) = 1/(x − 7) : valeur interdite ?", "f(x) = √(x + 5) : plus petite valeur permise ?", "f(x) = 1/(x² − 16) : valeur interdite positive ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["dénominateur " + nb(x) + " − 7 = " + nb(x - 7), "sous la racine : " + nb(x) + " + 5 = " + nb(x + 5), "x² − 16 = " + nb(x * x - 16)][s]),
        wins: [W(7, "x − 7 = 0 pour x = 7."), W(-5, "x + 5 ≥ 0 ⇔ x ≥ −5."), W(4, "x² = 16 : ±4 interdits.")] }),
    },
    racinv: {
      predict: { q: "Quand x double, que devient f(x) = 12/x ?", choices: ["il double", "il est divisé par 2", "il ne change pas"], good: 1, why: "12/(2x) = (12/x) ÷ 2 : la fonction inverse « fait l'inverse »." },
      defis: ["f(x) = 12/x : f(3) ?", "Préimage de 4 par f ?", "√x = 9 : x ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s < 2 ? "12 ÷ " + nb(x) + " = " + nb(12 / x) : "√" + nb(x) + " ≈ " + nb(Math.sqrt(Math.max(0, x)))),
        wins: [W(4, "12 ÷ 3 = 4."), W(3, "12/x = 4 ⇔ x = 3."), W(81, "On élève au carré : x = 81.")] }),
    },
    transf: {
      predict: { q: "Le graphe de (x − 3)² est celui de x² déplacé de…", choices: ["3 vers la gauche", "3 vers la droite", "3 vers le haut"], good: 1, why: "(x − 3)² vaut 0 en x = 3 : le sommet passe de 0 à 3, vers la DROITE (signe inversé dans la parenthèse)." },
      defis: ["g(x) = (x − 3)² + 2 : abscisse du sommet ?", "Son ordonnée ?", "g(x) = (x + 4)² − 1 : abscisse du sommet ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => FIG.plot([{ f: (t) => t * t, dash: true }, { f: s < 2 ? (t) => (t - 3) ** 2 + 2 : (t) => (t + 4) ** 2 - 1 }], [], { numbers: true, xr: [-7, 7], yr: [-3, 8] }), show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "(x − 3)² : 3 vers la droite."), W(2, "+ 2 : 2 vers le haut."), W(-4, "(x + 4)² = (x − (−4))² : 4 vers la gauche.")] }),
    },
    absval: {
      predict: { q: "Combien de solutions a |x − 2| = 5 ?", choices: ["une", "deux", "aucune"], good: 1, why: "x est à distance 5 de 2 : x = 7 ou x = −3." },
      defis: ["|x − 2| = 5 : plus grande solution ?", "Plus petite solution ?", "Distance entre −4 et 6 (|−4 − 6|) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s < 2 ? "|" + nb(x) + " − 2| = " + nb(Math.abs(x - 2)) : "tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(7, "2 + 5 = 7."), W(-3, "2 − 5 = −3."), W(10, "|−10| = 10.")] }),
    },
    ineq: {
      predict: { q: "−2x > 6 donne…", choices: ["x > −3", "x < −3", "x > 3"], good: 1, why: "En divisant par −2 (négatif), on RETOURNE le sens : x < −3." },
      defis: ["−2x > 6 : x < … ?", "3x − 4 ≤ 11 : x ≤ … ?", "Plus petit entier solution de 5 − x < 2 ?"],
      play: hunt({ ask: true, label: "Borne", show: (x, s) => plain(["6 ÷ (−2)", "3x ≤ 15", "−x < −3 ⇔ x > 3"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-3, "x < −3 (sens retourné)."), W(5, "x ≤ 5."), W(4, "x > 3 : le plus petit entier est 4.")] }),
    },
    trinfact: {
      predict: { q: "x² − 5x + 6 se factorise en…", choices: ["(x − 2)(x − 3)", "(x + 2)(x + 3)", "(x − 1)(x − 6)"], good: 0, why: "Deux nombres de somme 5 et de produit 6 : 2 et 3. Zéros 2 et 3, donc (x − 2)(x − 3)." },
      defis: ["x² − 7x + 10 : plus petit zéro ?", "Plus grand zéro ?", "x² + x − 12 : zéro positif ?"],
      play: hunt({ ask: true, label: "Zéro", show: (x, s) => plain(s < 2 ? nb(x) + "² − 7·" + nb(x) + " + 10 = " + nb(x * x - 7 * x + 10) : nb(x) + "² + " + nb(x) + " − 12 = " + nb(x * x + x - 12)),
        wins: [W(2, "4 − 14 + 10 = 0."), W(5, "(x − 2)(x − 5)."), W(3, "(x − 3)(x + 4) : zéros 3 et −4.")] }),
    },
    f2formes: {
      predict: { q: "(x − 2)² + 3 a pour sommet…", choices: ["(2 ; 3)", "(−2 ; 3)", "(3 ; 2)"], good: 0, why: "Forme canonique a(x − h)² + k : sommet (h ; k) = (2 ; 3)." },
      defis: ["x² − 8x + 20 = (x − h)² + k : h ?", "k ?", "Constante de (x + 3)² − 4 développé ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["h = 8 ÷ 2", "(x − 4)² = x² − 8x + 16 ; 20 − 16", "9 − 4"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(4, "h = 4."), W(4, "k = 20 − 16 = 4."), W(5, "(x + 3)² = x² + 6x + 9 ; 9 − 4 = 5.")] }),
    },
    f2trois: {
      predict: { q: "Une parabole passe par (0 ; 7). Que vaut c dans ax² + bx + c ?", choices: ["7", "0", "on ne peut pas savoir"], good: 0, why: "f(0) = c : le point d'abscisse 0 donne directement c." },
      defis: ["Points (0 ; 1), (1 ; 4), (−1 ; 0) : c ?", "a + b = ? (f(1) − c)", "a ?"], garde: [0, 1, 2], // calcul enchaîné : les trois étapes
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["f(0)", "4 − 1", "(a + b) + (a − b) = 3 + (−1)"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(1, "c = f(0) = 1."), W(3, "a + b = 3 (et a − b = −1)."), W(1, "2a = 2 : a = 1, b = 2 ; f(x) = x² + 2x + 1.")] }),
    },
    inter: {
      predict: { q: "Combien de points communs ont y = x² et y = −1 ?", choices: ["deux", "un", "aucun"], good: 2, why: "x² = −1 n'a pas de solution : un carré n'est jamais négatif. La droite passe sous la parabole." },
      defis: ["y = x² et y = x + 6 : abscisse positive d'intersection ?", "Abscisse négative ?", "Ordonnée du point d'abscisse positive ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => t * t }, { f: (t) => t + 6 }], [], { numbers: true, xr: [-4, 4], yr: [-1, 10], squash: 0.6 }), show: (x, s) => plain(s < 2 ? nb(x) + "² = " + nb(x * x) + " ; " + nb(x) + " + 6 = " + nb(x + 6) : "tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "x² − x − 6 = (x − 3)(x + 2)."), W(-2, "x = −2."), W(9, "3² = 9 = 3 + 6.")] }),
    },
    geocomb: {
      predict: { q: "Un losange a des diagonales de 6 et 8 cm. Son côté mesure…", choices: ["7 cm", "5 cm", "10 cm"], good: 1, why: "Les diagonales se coupent en leur milieu à angle droit : √(3² + 4²) = 5." },
      defis: ["Côté du losange de diagonales 6 et 8 ?", "Hauteur d'un triangle isocèle de côtés 10, 10 et base 12 ?", "Diagonale d'un pavé 2 × 3 × 6 ?"],
      play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["√(3² + 4²)", "√(10² − 6²)", "√(4 + 9 + 36)"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "Demi-diagonales 3 et 4 : 5."), W(8, "Demi-base 6 : √64 = 8."), W(7, "√49 = 7.")] }),
    },
    droitesrem: {
      predict: { q: "Le centre de gravité G partage la médiane [AM] en…", choices: ["deux moitiés", "AG = 2/3 de AM", "AG = 1/3 de AM"], good: 1, why: "G est aux deux tiers de chaque médiane en partant du sommet." },
      defis: ["Médiane de 12 cm : AG ?", "GM ?", "Triangle rectangle d'hypoténuse 10 : rayon du cercle circonscrit ?"],
      play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["2/3 de 12", "1/3 de 12", "milieu de l'hypoténuse"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(8, "AG = 8."), W(4, "GM = 4."), W(5, "Rayon = 10 ÷ 2 = 5.")] }),
    },
    lectgraph: {
      predict: { q: "Pour lire les solutions de f(x) = 2 sur un graphique, on regarde…", choices: ["où la courbe coupe l'axe des y", "où la courbe croise la droite horizontale y = 2", "la valeur f(2)"], good: 1, why: "f(x) = 2 : on cherche les x dont l'image vaut 2, donc les points de la courbe à la hauteur 2." },
      defis: ["f(x) = (x − 1)² − 4 : plus petit zéro ?", "Plus grand zéro ?", "Nombre de solutions de f(x) = −4 ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => (t - 1) ** 2 - 4 }], [], { numbers: true, xr: [-4, 6], yr: [-5, 6], hlines: [-4] }), show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-1, "La courbe coupe l'axe en −1."), W(3, "… et en 3."), W(1, "y = −4 touche la courbe au sommet seulement.")] }),
    },
    morceaux: {
      predict: { q: "f(x) = 2x si x < 3, et f(x) = 10 − x si x ≥ 3. Que vaut f(3) ?", choices: ["6", "7", "les deux"], good: 1, why: "x = 3 relève du 2e morceau (x ≥ 3) : f(3) = 10 − 3 = 7." },
      defis: ["f(1) ?", "f(5) ?", "f(3) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["1 < 3 : 2 · 1", "5 ≥ 3 : 10 − 5", "3 ≥ 3 : 10 − 3"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(2, "1er morceau : 2."), W(5, "2e morceau : 5."), W(7, "x = 3 est dans le 2e morceau : 7.")] }),
    },
    polyop: {
      predict: { q: "(x + 3)² = …", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(a + b)² = a² + 2ab + b² : le double produit 2 · x · 3 = 6x ne disparaît pas." },
      defis: ["Coefficient de x dans (x + 3)² ?", "Terme constant de (x − 3)(x + 3) ?", "Coefficient de x dans (2x + 1)(x − 4) ?"],
      play: hunt({ ask: true, label: "Coefficient", show: (x, s) => plain(["2 · x · 3", "−3 · 3", "2x · (−4) + 1 · x"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(6, "x² + 6x + 9."), W(-9, "x² − 9."), W(-7, "2x² − 7x − 4.")] }),
    },
    factor2: {
      predict: { q: "2x² − 18 factorisé au maximum, c'est…", choices: ["2(x² − 9)", "2(x − 3)(x + 3)", "(2x − 6)(x + 3)"], good: 1, why: "On met 2 en évidence, puis x² − 9 est une différence de carrés : 2(x − 3)(x + 3)." },
      defis: ["Facteur mis en évidence dans 2x² − 18 ?", "Racine du carré parfait 9 ?", "x² + 10x + 25 = (x + ?)²"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(2, "2(x² − 9)."), W(3, "(x − 3)(x + 3)."), W(5, "(x + 5)² = x² + 10x + 25.")] }),
    },
    f2expr: {
      predict: { q: "Une parabole a pour zéros 1 et 5 et passe par (0 ; 10). Son coefficient a vaut…", choices: ["1", "2", "10"], good: 1, why: "f(x) = a(x − 1)(x − 5) ; f(0) = 5a = 10, donc a = 2." },
      defis: ["Produit (0 − 1)(0 − 5) ?", "Valeur de a ?", "f(3) = a(3 − 1)(3 − 5) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "(−1)(−5) = 5."), W(2, "5a = 10."), W(-8, "2 · 2 · (−2) = −8 (sommet).")] }),
    },
    interpar: {
      predict: { q: "Deux paraboles y = x² + 1 et y = x² + 2x − 5 se coupent en…", choices: ["deux points", "un point", "aucun"], good: 1, why: "Les x² s'annulent : 1 = 2x − 5, une équation du 1er degré, x = 3." },
      defis: ["Abscisse du point commun ?", "Son ordonnée ?", "y = x² et y = −x² + 8 : abscisse positive ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "2x = 6."), W(10, "3² + 1 = 10."), W(2, "2x² = 8, x = ±2.")] }),
    },
    ineq2: {
      predict: { q: "(x − 1)(x − 5) < 0 est vrai…", choices: ["entre 1 et 5", "en dehors de [1 ; 5]", "jamais"], good: 0, why: "Parabole tournée vers le haut : négative entre ses zéros." },
      defis: ["Nombre d'entiers avec (x − 1)(x − 5) < 0 ?", "Et avec ≤ 0 ?", "x² ≤ 16 : plus grand entier ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["entre 1 et 5 exclus", "bornes comprises", "−4 ≤ x ≤ 4"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "2, 3, 4."), W(5, "1 à 5."), W(4, "x ∈ [−4 ; 4].")] }),
    },
    ineqfrac: {
      predict: { q: "Pour résoudre \\(\\dfrac{x - 2}{x + 3} \\ge 0\\), \\(x = -3\\) est…", choices: ["solution", "interdit", "la seule solution"], good: 1, why: "−3 annule le dénominateur : valeur interdite, jamais dans la solution." },
      defis: ["Valeur interdite ?", "Zéro du numérateur ?", "Combien d'entiers de [−5 ; 5] vérifient \\(\\dfrac{x - 2}{x + 3} \\ge 0\\) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-3, "x + 3 = 0."), W(2, "x − 2 = 0."), W(6, "x < −3 : −5, −4 ; x ≥ 2 : 2, 3, 4, 5.")] }),
    },
    exactes: {
      predict: { q: "La diagonale d'un carré de côté 5 mesure exactement…", choices: ["5√2", "10", "7,07"], good: 0, why: "√(25 + 25) = √50 = 5√2. 7,07 n'est qu'une valeur approchée." },
      defis: ["(5√2)² = ?", "Hauteur² d'un équilatéral de côté 6 ?", "(3√3)² = ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(50, "25 · 2 = 50."), W(27, "36 − 9 = 27 : h = 3√3."), W(27, "9 · 3 = 27.")] }),
    },
    trigo: {
      predict: { q: "Hypoténuse connue, on cherche le côté opposé à l'angle : on utilise…", choices: ["le sinus", "le cosinus", "la tangente"], good: 0, why: "SOH : sin = opposé / hypoténuse." },
      defis: ["Hypoténuse 10, angle 30° : opposé ?", "Adjacent 8, angle 45° : opposé ?", "Hypoténuse 50, cos α = 0,6 : adjacent ?"],
      play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["10 · sin 30°", "8 · tan 45°", "50 · 0,6"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "sin 30° = 0,5."), W(8, "tan 45° = 1."), W(30, "50 · 0,6 = 30.")] }),
    },
    trigrel: {
      predict: { q: "Si sin α = 0,6 (α aigu), cos α vaut…", choices: ["0,4", "0,8", "0,6"], good: 1, why: "sin² + cos² = 1 : cos² = 1 − 0,36 = 0,64, cos = 0,8 (et non 1 − 0,6)." },
      defis: ["sin α = 3/5 : cos α = 4/? (dénominateur)", "tan α = sin/cos = 3/?", "100 · (sin² + cos²) = ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "cos = 4/5."), W(4, "tan = (3/5)/(4/5) = 3/4."), W(100, "sin² + cos² = 1.")] }),
    },
    vabs: {
      predict: { q: "|3 − 8| vaut…", choices: ["−5", "5", "11"], good: 1, why: "On calcule l'intérieur, 3 − 8 = −5, puis la distance à zéro : 5. Une valeur absolue n'est jamais négative." },
      defis: ["|3 − 8| ?", "Distance entre −4 et 7 ?", "|x − 2| = 6 : plus petite solution ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(5, "|−5| = 5."), W(11, "|−4 − 7| = 11."), W(-4, "2 − 6 = −4 (et 8).")] }),
    },
    ratden: {
      predict: { q: "6/√3 s'écrit aussi…", choices: ["2√3", "6√3", "√2"], good: 0, why: "On multiplie haut et bas par √3 : 6√3/3 = 2√3." },
      defis: ["(6/√3)² = ?", "(2 + √3)(2 − √3) = ?", "(10/√5)² = ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(12, "36/3 = 12."), W(1, "4 − 3 = 1 : le conjugué fait disparaître la racine."), W(20, "100/5 = 20.")] }),
    },
    fracrat: {
      predict: { q: "(x² − 9)/(x − 3), pour x ≠ 3, se simplifie en…", choices: ["x − 3", "x + 3", "x² − 3"], good: 1, why: "x² − 9 = (x − 3)(x + 3) : on simplifie le FACTEUR x − 3, jamais terme à terme." },
      defis: ["Valeur de (x² − 9)/(x − 3) pour x = 5 ?", "Pour x = 10 ?", "(3 − x)/(x − 3) pour x = 7 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(8, "x + 3 = 8."), W(13, "x + 3 = 13."), W(-1, "Toujours −1 (opposés).")] }),
    },
    valint: {
      predict: { q: "Combien de valeurs interdites a 1/(x² − 4) ?", choices: ["une", "deux", "aucune"], good: 1, why: "x² = 4 ⇔ x = 2 ou x = −2." },
      defis: ["1/(x² − 4) : valeur interdite positive ?", "Négative ?", "1/(x² + 4) : nombre de valeurs interdites ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(2, "2² − 4 = 0."), W(-2, "(−2)² − 4 = 0."), W(0, "x² + 4 ≥ 4 : jamais nul.")] }),
    },
    eqparam: {
      predict: { q: "(m − 3)x = 5 n'a aucune solution quand…", choices: ["m = 3", "m = 5", "m = −3"], good: 0, why: "Pour m = 3 : 0 · x = 5, impossible." },
      defis: ["m pour aucune solution ?", "Pour m = 8, la solution x ?", "x² + mx + 9 = 0 : m > 0 pour une seule solution ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "0 · x = 5 : impossible."), W(1, "5x = 5."), W(6, "Δ = m² − 36 = 0.")] }),
    },
  });
})();
