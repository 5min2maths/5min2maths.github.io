// Chantier 1re Collège (19.11) : leçons actives pour pct, racenc, tradexpr, fimg, modaff, f2, optim, euclide, angtri,
// trigexact (devine / manipule / retiens). Même moteur que act_ch11c.js (outils recopiés).
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
  const hunt = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = ctl + fig + (o.note ? `<div class="small muted">${o.note}</div>` : "");
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
      defis: ["Prix de départ 100 CHF : prix après +20 % puis −20 % ?", "Un prix passe de 50 à 60 CHF : hausse en % ?", "Après une hausse de 25 %, un objet coûte 100 CHF. Prix de départ ?"],
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
      defis: ["Prix de A pour 10 km ?", "Pour combien de km les deux taxis coûtent-ils le même prix ?", "Prix commun à cette distance ?"],
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
  });
})();
