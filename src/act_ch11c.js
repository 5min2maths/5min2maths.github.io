// Chantier 11e (19.11, « on se concentre sur la 11e ») : leçons actives (devine / manipule / retiens) pour les 14
// notions de 11e qui n'en avaient pas : rel, fracops, rac, angles, cercthales, thales, thalesrec, repere, tabval, simil,
// denombr, proba, et les révisions de 10e carres, pctvar. Même moteur que act_ch11b.js (outils recopiés : chaque fichier reste autonome). Réponses entières ;
// mode « réponse » (l'élève calcule et tape) sauf vraies manipulations (agrandir un carré, un rapport k).
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
    rel: {
      predict: { q: "Combien font (−5) − (−8) ?", choices: ["−13", "3", "−3"], good: 1, why: "Soustraire −8, c'est ajouter 8 : −5 + 8 = 3. Sur la droite, on part de −5 et on avance de 8." },
      defis: ["Calcule (−5) − (−8).", "Calcule −7 + 4.", "Calcule (−3) · (−4)."],
      play: hunt({ ask: true, label: "Résultat",
        blank: (s) => line([-5, -7, -3][s], null),
        show: (x, s) => line([-5, -7, -3][s], x) + plain(["−5 − (−8) = −5 + 8", "−7 + 4 : signes contraires, 7 − 4 = 3, signe de −7", "(−3) · (−4) : même signe → positif, 3 · 4"][s] + " → tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "Soustraire un négatif, c'est ajouter son opposé : −5 + 8 = 3."), W(-3, "On recule de 7 puis on avance de 4 : on arrive à −3."), W(12, "Moins fois moins donne plus : (−3) · (−4) = 12.")] }),
    },
    fracops: {
      predict: { q: "Quel est le signe de (−2/3) · (−3/4) · (−1/2) ?", choices: ["positif", "négatif"], good: 1, why: "Trois facteurs négatifs : un nombre impair de signes − donne un résultat négatif (ici −1/4)." },
      defis: ["Calcule (−3/4) · 8.", "Calcule 1/2 − 3/4 · 2/3.", "Calcule (−6/5) : (−3/10)."],
      play: hunt({ ask: true, label: "Résultat (entier)",
        show: (x, s) => plain(["(−3/4) · 8 = −(3 · 8)/4 = −24/4", "3/4 · 2/3 d'abord (priorité) = 6/12 = 1/2, puis 1/2 − 1/2", "(−6/5) · (−10/3) (on multiplie par l'inverse) = 60/15"][s] + "<br>tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-6, "−24/4 = −6 : négatif fois positif donne négatif."), W(0, "La multiplication passe avant : 1/2 − 1/2 = 0."), W(4, "Diviser, c'est multiplier par l'inverse : (−6/5) · (−10/3) = 60/15 = 4, positif.")] }),
    },
    rac: {
      predict: { q: "Combien vaut √(9 + 16) ?", choices: ["7", "5", "25"], good: 1, why: "On calcule d'abord sous la racine : √25 = 5. Ce n'est pas √9 + √16 = 3 + 4 = 7 !" },
      defis: ["Agrandis le carré jusqu'à une aire de 49.", "Puis jusqu'à une aire de 81.", "Trouve le plus grand côté entier dont l'aire reste sous 50 (√50 est entre … et …)."],
      play: hunt({ label: "Côté", start: 1, min: 1, max: 10,
        show: (x, s) => { const u = 13; let g = ""; for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${30 + i * u}" y="${5 + j * u}" width="${u}" height="${u}" class="${x * x > 50 && s === 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.4"/>`;
          return svg(320, 140, g, "carré de côté " + x) + plain("côté " + x + " → aire " + x + "² = <b>" + x * x + "</b>" + (s === 2 ? (x * x < 50 ? " (sous 50)" : " (dépasse 50)") : "")); },
        wins: [W(7, "Côté 7 : 7² = 49, donc √49 = 7."), W(9, "√81 = 9."), (x) => (x === 7 ? "7² = 49 < 50 < 64 = 8² : donc 7 < √50 < 8." : "")] }),
    },
    angles: {
      predict: { q: "Deux droites parallèles sont coupées par une sécante ; un angle mesure 70°. L'angle alterne-interne mesure…", choices: ["70°", "110°", "20°"], good: 0, why: "Avec des parallèles, les angles alternes-internes sont égaux : 70°. Les angles du même côté (co-intérieurs) sont supplémentaires : 70° + 110° = 180°." },
      defis: ["Angle alterne-interne de 70° : sa mesure ?", "Angle co-intérieur (même côté, entre les parallèles) de 70° : sa mesure ?", "Un triangle a des angles de 48° et 75° : le troisième ?"],
      play: hunt({ ask: true, label: "Mesure (en degrés)",
        blank: (s) => s < 2 ? svg(320, 120, L(20, 30, 300, 30) + L(20, 90, 300, 90) + L(110, 120, 210, 0, "f-accent", 2) + T(200, 26, "70°", "start"), "parallèles et sécante") : svg(320, 120, `<polygon points="40,100 280,100 150,15" class="f-shape"/>` + T(60, 95, "48°", "start") + T(262, 95, "75°", "end") + T(150, 40, "?", "middle", 13, "f-txt f-accent"), "triangle"),
        show: (x, s) => plain("tu proposes <b>" + nb(x) + "°</b>" + (s === 2 ? " ; somme : 48 + 75 + " + nb(x) + " = " + nb(123 + x) + "°" : "")),
        wins: [W(70, "Alternes-internes et parallèles : angles égaux."), W(110, "Co-intérieurs : 70° + 110° = 180°."), W(57, "La somme des angles d'un triangle vaut 180° : 180 − 48 − 75 = 57.")] }),
    },
    cercthales: {
      predict: { q: "Le triangle ABC est inscrit dans un cercle de diamètre [AB]. L'angle en C mesure…", choices: ["90°", "60°", "ça dépend de C"], good: 0, why: "C'est le cercle de Thalès : où que soit C sur le cercle, l'angle ACB est droit." },
      defis: ["L'angle en A mesure 35° : combien mesure l'angle en B ?", "Diamètre AB = 10, AC = 6 : calcule BC.", "Un angle au centre mesure 100° : l'angle inscrit qui intercepte le même arc ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: () => svg(320, 150, `<circle cx="160" cy="80" r="62" class="f-soft" stroke="var(--ink)"/><polygon points="98,80 222,80 130,25" class="f-shape"/>` + T(90, 84, "A", "end") + T(230, 84, "B", "start") + T(126, 18, "C"), "cercle de Thalès"),
        show: (x, s) => plain(["90 + 35 + " + nb(x) + " = " + nb(125 + x) + "°", "6² + " + nb(x) + "² = " + nb(36 + x * x) + " (il faut 10² = 100)", "angle inscrit = moitié de l'angle au centre ; tu proposes " + nb(x) + "°"][s]),
        wins: [W(55, "Angle droit en C : 180 − 90 − 35 = 55°."), W(8, "Pythagore dans le triangle rectangle en C : 36 + 64 = 100."), W(50, "L'angle inscrit vaut la moitié de l'angle au centre : 50°.")] }),
    },
    thales: {
      predict: { q: "(DE) ∥ (BC), AD = 2, AB = 6, BC = 9. Combien mesure DE ?", choices: ["3", "5", "4,5"], good: 0, why: "Le grand triangle est 3 fois plus grand (6 ÷ 2 = 3) : DE = 9 ÷ 3 = 3. On compare des rapports, pas des différences." },
      defis: ["AD = 2, AB = 6, BC = 9 : calcule DE.", "Même figure, AC = 12 : calcule AE.", "Un bâton de 2 m a une ombre de 3 m ; l'ombre d'un arbre mesure 15 m. Hauteur de l'arbre ?"],
      play: hunt({ ask: true, label: "Longueur",
        blank: (s) => s < 2 ? thal(1 / 3, s === 0 ? { AD: "2", DB: "4", BC: "9", DE: "?" } : { AD: "2", DB: "4", AE: "?", EC: "AC = 12" }) : plain("bâton 2 m ↔ ombre 3 m ; arbre ? ↔ ombre 15 m"),
        show: (x, s) => (s < 2 ? thal(1 / 3, s === 0 ? { AD: "2", DB: "4", BC: "9", DE: nb(x) } : { AD: "2", DB: "4", AE: nb(x), EC: "AC = 12" }) : "") + plain(["DE/BC = " + nb(x) + "/9 ; AD/AB = 2/6", "AE/AC = " + nb(x) + "/12 ; AD/AB = 2/6", "hauteur/ombre : " + nb(x) + "/15 ; bâton : 2/3"][s]),
        wins: [W(3, "2/6 = 3/9 : DE = 3."), W(4, "AE = 12 ÷ 3 = 4."), W(10, "Ombre 5 fois plus longue (15 ÷ 3) : arbre 5 fois plus haut, 10 m.")] }),
    },
    thalesrec: {
      predict: { q: "AD = 3, AB = 9, AE = 4, AC = 12. Les droites (DE) et (BC) sont-elles parallèles ?", choices: ["Oui", "Non"], good: 0, why: "AD/AB = 3/9 = 1/3 et AE/AC = 4/12 = 1/3 : les rapports sont égaux, donc (DE) ∥ (BC) (réciproque de Thalès)." },
      defis: ["AD = 4, AB = 10, AE = 6 : quelle longueur AC rend (DE) ∥ (BC) ?", "AD = 5, AB = 15, AC = 21 : quelle longueur AE ?", "AD = 6, AC = 20, AE = 8 : quelle longueur AB ?"],
      play: hunt({ ask: true, label: "Longueur",
        blank: (s) => thal(0.4, [{ AD: "4", AE: "6", EC: "AC = ?" }, { AD: "5", DB: "AB = 15", AE: "?" }, { AD: "6", DB: "AB = ?", AE: "8" }][s]),
        show: (x, s) => plain(["AD/AB = 4/10 ; AE/AC = 6/" + nb(x), "AD/AB = 5/15 ; AE/AC = " + nb(x) + "/21", "produits en croix : AD · AC = 120 ; AE · AB = 8 · " + nb(x) + " = " + nb(8 * x)][s]),
        wins: [W(15, "4/10 = 6/15 = 0,4 : parallèles."), W(7, "5/15 = 7/21 = 1/3."), W(15, "6 · 20 = 8 · 15 = 120 : produits en croix égaux.")] }),
    },
    repere: {
      predict: { q: "Où se trouve le point (−3 ; 2) ?", choices: ["en haut à gauche", "en bas à droite", "en haut à droite"], good: 0, why: "La 1re coordonnée (abscisse) se lit horizontalement : −3, à gauche. La 2e (ordonnée) verticalement : 2, en haut." },
      defis: ["A(−4 ; 2) et B(6 ; 2) : abscisse du milieu de [AB] ?", "Distance entre C(1 ; 1) et D(1 ; −6) ?", "Symétrique de P(3 ; −5) par rapport à l'axe des abscisses : son ordonnée ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => { const X = (v) => 160 + v * 20, Y = (v) => 80 - v * 10; let g = L(20, 80, 300, 80) + L(160, 5, 160, 155); const pts = [[[-4, 2, "A"], [6, 2, "B"]], [[1, 1, "C"], [1, -6, "D"]], [[3, -5, "P"]]][s]; for (const [a, b, n] of pts) g += `<circle cx="${X(a)}" cy="${Y(b)}" r="4" class="f-dot"/>` + T(X(a) + 8, Y(b) - 6, (n + "(" + a + " ; " + b + ")").replace(/-/g, "−"), "start", 11); return svg(320, 160, g, "repère"); },
        show: (x, s) => plain(["milieu : (−4 + 6) ÷ 2", "même abscisse : on compte de 1 à −6", "symétrie par rapport à l'axe horizontal : l'abscisse reste, l'ordonnée change de signe"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(1, "(−4 + 6) ÷ 2 = 1."), W(7, "1 − (−6) = 7."), W(5, "Le symétrique est (3 ; 5).")] }),
    },
    tabval: {
      predict: { q: "f(x) = 2x − 3. Combien vaut f(−1) ?", choices: ["−5", "−1", "5"], good: 0, why: "On remplace x par −1 : 2 · (−1) − 3 = −2 − 3 = −5." },
      defis: ["Complète : f(4) = ?", "Complète : f(0) = ?", "Pour quel x a-t-on f(x) = 7 ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => tab([-1, 0, 1, 4], s),
        show: (x, s) => tab([-1, 0, 1, 4], s, x),
        wins: [W(5, "2 · 4 − 3 = 5."), W(-3, "2 · 0 − 3 = −3 : c'est l'ordonnée à l'origine."), W(5, "2x − 3 = 7 ⇔ 2x = 10 ⇔ x = 5 (on remonte le calcul).")] }),
    },
    simil: {
      predict: { q: "On double tous les côtés d'un carré. Son aire est multipliée par…", choices: ["2", "4", "8"], good: 1, why: "Longueurs × 2, donc aire × 2 · 2 = 4 : on voit 4 copies du petit carré dans le grand." },
      defis: ["Trouve le rapport k qui multiplie l'aire par 9.", "Puis l'aire par 16.", "Pour un cube, quel rapport multiplie le volume par 8 ?"],
      play: hunt({ label: "Rapport k", start: 1, min: 1, max: 5,
        show: (x, s) => { const u = 22; let g = ""; for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${40 + i * u}" y="${8 + j * u}" width="${u}" height="${u}" class="${i || j ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.6"/>`;
          return svg(320, 124, g, "agrandissement de rapport " + x) + plain("k = " + x + " → longueurs × " + x + ", aire × " + x + "² = <b>" + x * x + "</b>, volume × " + x + "³ = <b>" + x ** 3 + "</b>"); },
        wins: [W(3, "k = 3 : aire × 9 (k²)."), W(4, "k = 4 : aire × 16."), (x) => (x === 2 ? "k = 2 : volume × 2³ = 8 (k³)." : "")] }),
    },
    denombr: {
      predict: { q: "3 t-shirts et 4 pantalons : combien de tenues différentes ?", choices: ["7", "12", "34"], good: 1, why: "Chaque t-shirt se combine avec chacun des 4 pantalons : 3 · 4 = 12 (arbre). On multiplie, on n'additionne pas." },
      defis: ["3 t-shirts, 4 pantalons : nombre de tenues ?", "5 coureurs : nombre de podiums (or, argent, bronze) ?", "6 personnes se serrent toutes la main : nombre de poignées ?"],
      play: hunt({ ask: true, label: "Nombre",
        show: (x, s) => plain(["arbre : 3 branches, puis 4 sur chacune", "or : 5 choix, argent : 4, bronze : 3", "chacun serre 5 mains ; chaque poignée est comptée deux fois"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(12, "3 · 4 = 12."), W(60, "5 · 4 · 3 = 60 : sans répétition."), W(15, "6 · 5 ÷ 2 = 15.")] }),
    },
    proba: {
      predict: { q: "On lance deux dés et on additionne. Quelle somme sort le plus souvent ?", choices: ["12", "7", "elles ont toutes la même chance"], good: 1, why: "7 s'obtient de 6 façons (1+6, 2+5, …, 6+1) sur 36, 12 d'une seule (6+6) : les sommes ne sont pas équiprobables." },
      defis: ["Combien d'issues pour deux dés ?", "De combien de façons obtient-on 7 ?", "Et 10 ?"],
      play: hunt({ ask: true, label: "Nombre",
        blank: (s) => grid(s === 1 ? 7 : s === 2 ? 10 : 0),
        show: (x, s) => grid(s === 1 ? 7 : s === 2 ? 10 : 0) + plain(s ? "cases coloriées : la somme vaut " + (s === 1 ? 7 : 10) + " ; tu proposes <b>" + nb(x) + "</b>" : "tableau 6 × 6 ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(36, "6 · 6 = 36 issues."), W(6, "6 façons sur 36 : P(7) = 6/36 = 1/6."), W(3, "4+6, 5+5, 6+4 : 3 façons, P(10) = 3/36 = 1/12.")] }),
    },
    carres: {
      predict: { q: "Combien vaut 0,3² ?", choices: ["0,9", "0,09", "0,6"], good: 1, why: "0,3 · 0,3 = 0,09 : deux chiffres après la virgule. Élever au carré, c'est multiplier par lui-même, pas par 2 ni par 3." },
      defis: ["Quel nombre positif a pour carré 144 ?", "Quel nombre positif a pour carré 121 ?", "Quel est le plus grand entier dont le carré est inférieur à 200 ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(nb(x) + "² = <b>" + nb(x * x) + "</b>" + (s === 2 ? (x * x < 200 ? " (sous 200)" : " (dépasse 200)") : "")),
        wins: [W(12, "12² = 144 : √144 = 12."), W(11, "11² = 121 : √121 = 11."), W(14, "14² = 196 < 200 < 225 = 15².")] }),
    },
    pctvar: {
      predict: { q: "Un prix augmente de 10 %, puis baisse de 10 %. À la fin, il est…", choices: ["revenu au prix de départ", "plus bas qu'au départ", "plus haut qu'au départ"], good: 1, why: "100 → 110 (× 1,1) → 99 (× 0,9) : la baisse de 10 % porte sur 110, un montant plus grand. × 1,1 × 0,9 = × 0,99." },
      defis: ["Un article à 80 CHF augmente de 25 %. Nouveau prix ?", "Un article à 50 CHF baisse de 20 %. Nouveau prix ?", "Un prix passe de 40 à 50 CHF. Augmentation en % ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(["80 · 1,25 (coefficient d'une hausse de 25 %)", "50 · 0,8 (coefficient d'une baisse de 20 %)", "hausse 10 CHF sur 40 CHF : 10/40"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(100, "80 · 1,25 = 100 CHF."), W(40, "50 · 0,8 = 40 CHF."), W(25, "10/40 = 0,25 = 25 % : on divise par le prix de DÉPART.")] }),
    },
  });
  // Tableau de valeurs de f(x) = 2x − 3 ; la case du défi s est vide (« ? ») tant que la réponse n'est pas trouvée.
  function tab(xs, s, x) { const f = (t) => 2 * t - 3; const cells = s === 2 ? [[x ?? "?", 7]] : xs.map((t) => [t, (s === 0 && t === 4) || (s === 1 && t === 0) ? (x ?? "?") : f(t)]);
    return `<div class="act-out"><table style="margin:auto;border-collapse:collapse"><tr><th style="padding:4px 10px;border:1px solid var(--line)">x</th>${cells.map((c) => `<td style="padding:4px 10px;border:1px solid var(--line)">${nb(c[0]) === "NaN" ? c[0] : String(c[0]).replace("-", "−")}</td>`).join("")}</tr><tr><th style="padding:4px 10px;border:1px solid var(--line)">f(x) = 2x − 3</th>${cells.map((c) => `<td style="padding:4px 10px;border:1px solid var(--line)">${String(c[1]).replace("-", "−")}</td>`).join("")}</tr></table></div>`; }
  // Tableau 6 × 6 des sommes de deux dés ; cases de somme t coloriées.
  function grid(t) { const u = 22; let g = ""; for (let i = 1; i <= 6; i++) { g += T(70 + i * u, 14, i) + T(56, 28 + i * u - 6, i); for (let j = 1; j <= 6; j++) g += `<rect x="${59 + i * u}" y="${10 + j * u - 6}" width="${u}" height="${u}" class="${i + j === t ? "f-fill" : "f-soft"}" stroke="var(--ink)" stroke-width="0.4"/>` + T(70 + i * u, 26 + j * u - 6 + 1, i + j, "middle", 9); }
    return svg(320, 160, g, "tableau des sommes de deux dés"); }
})();
