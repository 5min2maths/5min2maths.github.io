// Chantier MP 2e (20.11, « interactive mp2, fais tout ») : leçons actives (devine / calcule / retiens) pour droites,
// droitesinter, recipaff, trigcercle, trigfn, sinlaw, trigeq, trigassoc, trigeq2, triaire, statfreq, stats, quartiles.
// Même moteur que act_1c.js (outils recopiés) ; réponses tapées (mode ask), nombres décimaux ou fractions.
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

  const tu = (x) => " ; tu proposes <b>" + nb(x) + "</b>";
  // Deux droites dans un repère quadrillé ; x proposé : verticale et les deux y lus (droitesinter, 22.11).
  const DI2 = [
    { f: (x) => 2 * x - 1, g: (x) => x + 3, fl: "y = 2x − 1", gl: "y = x + 3", xr: [-1, 8], yr: [-3, 16], gx: 1, gy: 2 },
    { f: (x) => 3 * x - 2, g: (x) => -x + 6, fl: "y = 3x − 2", gl: "y = −x + 6", xr: [-1, 5], yr: [-4, 12], gx: 1, gy: 2 },
    { f: (x) => 20 + 2 * x, g: (x) => 50 + x, fl: "A : 20 + 2x", gl: "B : 50 + x", xr: [0, 50], yr: [0, 130], gx: 5, gy: 10, unit: " CHF" },
  ];
  const twoLines = (s, x) => {
    const D = DI2[s], W0 = 300, H0 = 190, ml = 30, mb = 20, X = (v) => ml + ((v - D.xr[0]) / (D.xr[1] - D.xr[0])) * (W0 - ml - 10), Y = (v) => H0 - mb - ((v - D.yr[0]) / (D.yr[1] - D.yr[0])) * (H0 - mb - 10);
    let g = "";
    for (let v = Math.ceil(D.xr[0] / D.gx) * D.gx; v <= D.xr[1]; v += D.gx) g += L(X(v), Y(D.yr[0]), X(v), Y(D.yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(D.yr[0] / D.gy) * D.gy; v <= D.yr[1]; v += D.gy) g += L(X(D.xr[0]), Y(v), X(D.xr[1]), Y(v), "f-grid", 0.7);
    if (D.yr[0] <= 0) g += L(X(D.xr[0]), Y(0), X(D.xr[1]), Y(0), "f-line", 1.2);
    if (D.xr[0] <= 0) g += L(X(0), Y(D.yr[0]), X(0), Y(D.yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(D.xr[0] / D.gx) * D.gx; v <= D.xr[1]; v += D.gx * (D.gx === 1 ? 1 : 2)) if (v) g += T(X(v), Y(Math.max(D.yr[0], 0)) + 13, nb(v), "middle", 9);
    for (let v = Math.ceil(D.yr[0] / D.gy) * D.gy; v <= D.yr[1]; v += D.gy * 2) if (v) g += T(X(Math.max(D.xr[0], 0)) - 4, Y(v) + 3, nb(v), "end", 9);
    const seg = (f, cls) => L(X(D.xr[0]), Y(f(D.xr[0])), X(D.xr[1]), Y(f(D.xr[1])), cls, 2.2);
    g = `<defs><clipPath id="di-clip"><rect x="${ml}" y="10" width="${W0 - ml - 10}" height="${H0 - mb - 10}"/></clipPath></defs>` + g + `<g clip-path="url(#di-clip)">${seg(D.f, "f-accent")}${seg(D.g, "f-blue")}</g>`;
    g += T(W0 - 12, 22, D.fl, "end", 11, "f-txt f-accent") + T(W0 - 12, 36, D.gl, "end", 11, "f-txt f-blue");
    let out = "";
    if (x !== null && x >= D.xr[0] && x <= D.xr[1]) {
      const y1 = D.f(x), y2 = D.g(x), same = Math.abs(y1 - y2) < 1e-9;
      g += L(X(x), Y(D.yr[0]), X(x), Y(D.yr[1]), "f-line", 1) + `<circle cx="${X(x)}" cy="${Y(y1)}" r="4" class="f-dot"/><circle cx="${X(x)}" cy="${Y(y2)}" r="4" class="f-dot"/>`;
      out = `<div class="act-out">x = ${nb(x)} : ${D.fl.split(":")[0].replace("y = ", "")} donne <b>${nb(y1)}${D.unit || ""}</b>, ${D.gl.split(":")[0].replace("y = ", "")} donne <b>${nb(y2)}${D.unit || ""}</b> → ${same ? '<b class="act-ok">même valeur : c\'est le point commun</b>' : "pas encore le même"}</div>`;
    } else if (x !== null) out = `<div class="act-out">x = ${nb(x)} est hors du graphique : essaie entre ${nb(D.xr[0])} et ${nb(D.xr[1])}.</div>`;
    return svg(W0, H0, g, "deux droites dans un repère") + out;
  };
  Object.assign(ACTIVE, {
    droites: {
      predict: { q: "Une droite passe par (0 ; 1) et (2 ; 5). Sa pente vaut…", choices: ["2", "4", "1/2"], good: 0, why: "Pente = variation verticale ÷ variation horizontale = (5 − 1) ÷ (2 − 0) = 4 ÷ 2 = 2 : quand x augmente de 1, y augmente de 2." },
      defis: ["Pente de la droite qui passe par (1 ; 3) et (4 ; 9) ?", "La droite y = 2x + h passe par (3 ; 4). Que vaut h ?", "Pente d'une droite perpendiculaire à y = 3x − 1 ? (fraction)"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(9 − 3) ÷ (4 − 1)", "4 = 2 · 3 + h", "pente · 3 = −1"][s] + tu(x)),
        wins: [W(2, "6 ÷ 3 = 2."), W(-2, "4 = 6 + h, donc h = −2."), W(-1 / 3, "Perpendiculaires : produit des pentes = −1, donc −1/3.")] }),
    },
    droitesinter: {
      predict: { q: "Les droites y = x + 1 et y = −x + 5 se coupent pour x = …", choices: ["2", "3", "1"], good: 0, why: "Au point d'intersection, les deux y sont égaux : x + 1 = −x + 5, donc 2x = 4 et x = 2 (puis y = 3)." },
      // Défis repris le 22.11 (« les défis, c'est confusing ») : toujours la même tâche (l'abscisse du point commun),
      // avec le graphique des deux droites ; la réponse tapée place une verticale qui montre les deux y.
      defis: ["y = 2x − 1 et y = x + 3 : pour quel x les deux droites donnent-elles le même y ?", "y = 3x − 2 et y = −x + 6 : pour quel x ont-elles le même y ?", "Location d'une voiture. Offre A : 20 CHF + 2 CHF par km ; offre B : 50 CHF + 1 CHF par km. Pour combien de km les deux offres coûtent-elles le même prix ?"],
      play: hunt({ ask: true, label: "x =", blank: (s) => twoLines(s, null), show: (x, s) => twoLines(s, x),
        wins: [W(4, "2 · 4 − 1 = 7 et 4 + 3 = 7 : les droites se coupent en (4 ; 7)."), W(2, "3 · 2 − 2 = 4 et −2 + 6 = 4 : point commun (2 ; 4)."), W(30, "20 + 2 · 30 = 80 CHF et 50 + 30 = 80 CHF : pour 30 km, même prix ; au-delà, B est moins chère.")] }),
    },
    recipaff: {
      predict: { q: "f(x) = 2x + 3. Que vaut f⁻¹(11) ?", choices: ["4", "25", "1/11"], good: 0, why: "f⁻¹(11) est le nombre dont l'image vaut 11 : 2x + 3 = 11, donc x = 4. (25, c'est f(11) ; 1/11 n'a rien à voir.)" },
      defis: ["f(x) = 3x − 6. Que vaut f⁻¹(0) ?", "f(x) = 5x + 2. Que vaut f⁻¹(27) ?", "Le point (2 ; 9) est sur le graphique de f. Le point de f⁻¹ d'ordonnée 2 a quelle abscisse ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["3x − 6 = 0", "5x + 2 = 27", "on échange x et y"][s] + tu(x)),
        wins: [W(2, "3x = 6, donc x = 2."), W(5, "5x = 25, donc x = 5."), W(9, "La réciproque échange les coordonnées : (9 ; 2).")] }),
    },
    trigcercle: {
      predict: { q: "Un demi-tour (180°) vaut combien de radians ?", choices: ["π", "2π", "180"], good: 0, why: "Un tour complet mesure 2π radians (le périmètre du cercle de rayon 1), donc un demi-tour vaut π." },
      defis: ["Combien de degrés vaut π/6 rad ?", "135° = k · π/4. Que vaut k ?", "cos 120° (en décimal) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["π = 180°, donc π/6 = 180° ÷ 6", "π/4 = 45°", "120° : quadrant 2, angle de référence 60°"][s] + tu(x)),
        wins: [W(30, "180 ÷ 6 = 30°."), W(3, "135 ÷ 45 = 3, soit 3π/4."), W(-0.5, "cos 60° = 0,5 et le cosinus est négatif dans le quadrant 2 : −0,5.")] }),
    },
    trigfn: {
      predict: { q: "La période de sin(2x) (x en degrés) est…", choices: ["180°", "720°", "360°"], good: 0, why: "Avec 2x, l'angle va deux fois plus vite : la courbe se répète deux fois plus souvent, période 360° ÷ 2 = 180°." },
      defis: ["Valeur maximale de 3 sin x + 2 ?", "Période (en degrés) de cos(4x) ?", "Plus petit x > 0 (en degrés) où sin(3x) = 1 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["sin x vaut au plus 1", "360° ÷ 4", "sin vaut 1 pour un angle de 90°"][s] + tu(x)),
        wins: [W(5, "3 · 1 + 2 = 5."), W(90, "360 ÷ 4 = 90°."), W(30, "3x = 90°, donc x = 30°.")] }),
    },
    sinlaw: {
      predict: { q: "Dans un triangle, le plus grand côté est toujours en face…", choices: ["du plus grand angle", "du plus petit angle", "d'un angle droit"], good: 0, why: "Théorème du sinus : a ÷ sin α = b ÷ sin β. Plus l'angle est grand, plus le côté opposé est long." },
      defis: ["α = 30°, β = 90° et a = 5. Calcule b.", "a = 3, b = 4 et γ = 90°. Que vaut c² ?", "Triangle équilatéral : que vaut cos γ ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["b = a · sin β ÷ sin α = 5 · 1 ÷ 0,5", "c² = a² + b² − 2ab cos 90°", "côtés égaux : cos γ = (a² + a² − a²) ÷ (2a²)"][s] + tu(x)),
        wins: [W(10, "5 ÷ 0,5 = 10 : le côté en face de l'angle droit est le plus long."), W(25, "cos 90° = 0 : on retrouve Pythagore, c² = 25."), W(0.5, "cos γ = a² ÷ (2a²) = 0,5, donc γ = 60°.")] }),
    },
    trigeq: {
      predict: { q: "Combien de solutions a sin x = 0,5 pour 0° ≤ x < 360° ?", choices: ["2", "1", "4"], good: 0, why: "Deux points du cercle ont l'ordonnée 0,5 : 30° et 180° − 30° = 150°." },
      defis: ["Plus grande solution de sin x = 0,5 (entre 0° et 360°) ?", "Plus petite solution de cos x = −0,5 ?", "Solution de tan x = 1 entre 180° et 360° ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["sin(180° − x) = sin x", "cos 60° = 0,5 ; cosinus négatif dans le quadrant 2", "tan 45° = 1 ; la tangente se répète tous les 180°"][s] + tu(x)),
        wins: [W(150, "180° − 30° = 150°."), W(120, "180° − 60° = 120° (l'autre est 240°)."), W(225, "45° + 180° = 225°.")] }),
    },
    trigassoc: {
      predict: { q: "Si sin α = 0,6, alors sin(180° − α) vaut…", choices: ["0,6", "−0,6", "0,8"], good: 0, why: "α et 180° − α sont symétriques par rapport à l'axe vertical : même ordonnée, donc même sinus." },
      defis: ["cos α = 0,8. Que vaut cos(−α) ?", "sin α = 0,6. Que vaut sin(180° + α) ?", "sin α = 0,6 et α aigu. Que vaut cos α ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["−α : symétrie par rapport à l'axe horizontal", "180° + α : symétrie par rapport au centre", "cos² α = 1 − sin² α"][s] + tu(x)),
        wins: [W(0.8, "Même abscisse, donc cos(−α) = cos α = 0,8."), W(-0.6, "Point opposé : ordonnée opposée, −0,6."), W(0.8, "cos² α = 1 − 0,36 = 0,64, donc cos α = 0,8 (positif, angle aigu).")] }),
    },
    trigeq2: {
      predict: { q: "La marée d'un port : h(t) = 4 + 2 sin(30t) (en m). La hauteur maximale est…", choices: ["6 m", "4 m", "2 m"], good: 0, why: "sin vaut au plus 1 : 4 + 2 · 1 = 6 m. (4 m, c'est la hauteur moyenne ; 2 m, l'amplitude.)" },
      defis: ["Période de h, en heures (le sinus fait un tour pour 30t = 360) ?", "Hauteur minimale (en m) ?", "À quelle heure la marée est-elle haute pour la première fois ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["30t = 360", "sin vaut au moins −1", "30t = 90"][s] + tu(x)),
        wins: [W(12, "t = 12 h : deux marées hautes par jour."), W(2, "4 − 2 = 2 m."), W(3, "t = 3 h.")] }),
    },
    triaire: {
      predict: { q: "Un triangle a deux côtés de 6 cm et 8 cm qui forment un angle de 30°. Son aire vaut…", choices: ["12 cm²", "24 cm²", "48 cm²"], good: 0, why: "Aire = ½ · 6 · 8 · sin 30° = ½ · 48 · 0,5 = 12 cm². La hauteur sur le côté 8 vaut 6 · sin 30° = 3." },
      defis: ["Côtés 10 et 4, angle de 90° entre eux : aire ?", "Côtés 6 et 6, angle de 150° : aire ? (sin 150° = 0,5)", "Parallélogramme de côtés 5 et 8, angle de 30° : aire ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["½ · 10 · 4 · sin 90°", "½ · 6 · 6 · 0,5", "5 · 8 · sin 30° (deux triangles)"][s] + tu(x)),
        wins: [W(20, "sin 90° = 1 : on retrouve base × hauteur ÷ 2 = 20."), W(9, "½ · 36 · 0,5 = 9."), W(20, "40 · 0,5 = 20.")] }),
    },
    statfreq: {
      predict: { q: "Sur 40 personnes, 10 répondent « oui ». La fréquence de « oui » est…", choices: ["25 %", "10 %", "40 %"], good: 0, why: "Fréquence = effectif ÷ total = 10 ÷ 40 = 0,25 = 25 %." },
      defis: ["Angle du secteur « oui » (10 sur 40) dans un diagramme circulaire ?", "30 % de 60 personnes, c'est combien de personnes ?", "Un secteur mesure 72° : quel pourcentage ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["0,25 · 360°", "0,3 · 60", "72 ÷ 360"][s] + tu(x)),
        wins: [W(90, "Un quart du tour : 90°."), W(18, "0,3 · 60 = 18."), W(20, "72 ÷ 360 = 0,2 = 20 %.")] }),
    },
    stats: {
      predict: { q: "Série 2 ; 3 ; 100. Quel nombre représente le mieux une valeur « typique » ?", choices: ["la médiane, 3", "la moyenne, 35", "l'étendue, 98"], good: 0, why: "La valeur extrême 100 tire la moyenne vers le haut (35) ; la médiane (3) n'est pas influencée." },
      defis: ["Moyenne de 4 ; 5 ; 9 ?", "Médiane de 7 ; 1 ; 4 ; 10 ; 3 ?", "Notes 4 et 5 : quelle 3e note pour une moyenne de 5 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(4 + 5 + 9) ÷ 3", "on trie : 1 ; 3 ; 4 ; 7 ; 10", "il faut une somme de 3 · 5 = 15"][s] + tu(x)),
        wins: [W(6, "18 ÷ 3 = 6."), W(4, "Valeur du milieu : 4."), W(6, "15 − 4 − 5 = 6.")] }),
    },
    quartiles: {
      predict: { q: "Dans une boîte à moustaches, la « boîte » (de Q1 à Q3) contient…", choices: ["environ la moitié des valeurs", "environ un quart des valeurs", "toutes les valeurs"], good: 0, why: "Q1, la médiane et Q3 partagent la série en quatre parts d'environ 25 % : la boîte en contient deux, soit la moitié." },
      defis: ["Étendue de 3 ; 9 ; 15 ; 4 ?", "Série triée 2 ; 4 ; 5 ; 7 ; 9 ; 12 ; 15 : Q1 ?", "Et Q3 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["max − min", "moitié inférieure : 2 ; 4 ; 5 (sans la médiane 7)", "moitié supérieure : 9 ; 12 ; 15"][s] + tu(x)),
        wins: [W(12, "15 − 3 = 12."), W(4, "Médiane de 2 ; 4 ; 5 : 4."), W(12, "Médiane de 9 ; 12 ; 15 : 12 (écart interquartile 8).")] }),
    },
  });
})();
