// Chantier 9e, chapitres 1 à 6 (23.11) : leçons actives (devine / essaie / retiens) pour les 21 notions qui n'en
// avaient pas : decread, deccomp, decarr, ordgr, decadd, dec10, decmul, decdiv, decprob, pow9 (1. décimaux),
// ulong, uaire, uvol (2. unités), angtype, quadri (3. géométrie), perim, aire1, aire2, aire3 (5. aires),
// relrep, reladd (6. relatifs). « Retiens » = la leçon existante (gen3.js). Outils recopiés de act_ch11c.js (fichier
// autonome). Mode réponse (o.ask) partout, sauf dec10 : les chiffres glissent dans le tableau (vraie manipulation).
// Calibré sur les MER 9e (NO, GM, ES) : vocabulaire dixième / centième / millième, distance à zéro, angle rentrant.
(function () {
  // ---------- outils ----------
  // Nombre en français : virgule décimale, ' pour les milliers, vrai signe moins.
  const nb = (v) => { const s = String(+(+v).toFixed(6)); const [i, d] = s.replace("-", "").split("."); return (+v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (d ? "," + d : ""); };
  const n2 = (v) => (+v).toFixed(2).replace(".", ",");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
  const P = (pts, cls = "f-shape") => `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" class="${cls}"/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const prop = (x, u = "") => " ; tu proposes <b>" + nb(x) + (u ? " " + u : "") + "</b>";
  // Chercheur (copie de act_ch11c.js) : o.ask = l'élève calcule et tape ; sinon compteur − / + (o.fmt pour l'affichage).
  // Saisie : virgule ou point, ' des milliers et espaces ignorés.
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? actAnswerHtml(o.label || "Ta réponse") : actStepper(o.label || "x", o.fmt ? o.fmt(x) : nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = String(+x.toFixed(6)).replace(".", ",");
        const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/[\s'’]/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig, table") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");

  // Tableau de position : en-têtes, chiffres de v rangés pour que les unités tombent dans la colonne u ; trait épais = virgule.
  const digs = (v, n, u) => { const [ip, dp = ""] = String(+Math.abs(v).toFixed(6)).split(".");
    return Array.from({ length: n }, (_, j) => (j <= u ? ip[ip.length - 1 - (u - j)] ?? "" : dp[j - u - 1] ?? "")); };
  const tab = (heads, v, u, cap) => { const c = v === null ? heads.map(() => "") : digs(v, heads.length, u), bd = (j) => (j === u ? ";border-right:3px solid var(--ink)" : "");
    return `<div class="act-out"><table style="margin:auto;border-collapse:collapse;font-size:13px"><tr>${heads.map((hd, j) => `<th style="padding:2px 4px;border:1px solid var(--line);font-weight:400;font-size:11px${bd(j)}">${hd}</th>`).join("")}</tr><tr>${c.map((d, j) => `<td style="padding:3px 4px;border:1px solid var(--line);text-align:center;min-width:18px;height:20px${bd(j)}"><b>${d}</b></td>`).join("")}</tr></table>${cap ? `<div style="text-align:center;margin-top:4px">${cap}</div>` : ""}</div>`; };
  const NUM = ["D", "U", "d", "c", "m"]; // dizaines, unités, dixièmes, centièmes, millièmes
  // Droite graduée zoomée : de lo à hi, graduations tous les st, étiquettes labs, points pts = [[v, classe, étiquette]].
  const zl = (lo, hi, st, labs, pts = []) => { const X = (v) => (20 + ((v - lo) / (hi - lo)) * 280).toFixed(1); let g = L(12, 34, 308, 34);
    const n = Math.round((hi - lo) / st); for (let k = 0; k <= n; k++) g += L(X(lo + k * st), 29, X(lo + k * st), 39, "f-line", 0.8);
    for (const v of labs) g += L(X(v), 25, X(v), 43, "f-line", 1.6) + T(X(v), 58, nb(v), "middle", 11);
    for (const [v, cls, lab] of pts) if (v >= lo - 1e-9 && v <= hi + 1e-9) g += `<circle cx="${X(v)}" cy="34" r="5" class="${cls}"/>` + (lab ? T(X(v), 17, lab, "middle", 11, cls === "f-dot" ? "f-txt f-accent" : "f-txt") : "");
    return svg(320, 64, g, "droite graduée"); };
  // Droite de −12 à 12 avec un saut de from à to (relatifs).
  const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 34, 310, 34); for (let v = -12; v <= 12; v++) g += L(X(v), 30, X(v), 38, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 54, nb(v), "middle", 10));
    g += `<circle cx="${X(from)}" cy="34" r="5" class="f-fill"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},26 Q${(X(from) + X(to)) / 2},4 ${X(to)},26" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="34" r="5" class="f-dot"/>`;
    return svg(320, 62, g, "droite graduée"); };
  // Opération posée en colonnes, virgules alignées (2 décimales).
  const col = (a, op, b, r) => `<div class="act-out" style="text-align:center"><table style="margin:auto;font-family:monospace;font-size:16px;border-collapse:collapse">
    <tr><td></td><td style="text-align:right">${n2(a)}</td></tr><tr><td>${op}</td><td style="text-align:right">${n2(b)}</td></tr>
    <tr><td></td><td style="text-align:right;border-top:2px solid var(--ink)"><b>${r === null ? "?" : nb(r)}</b></td></tr></table></div>`;
  // Barre de longueur tot découpée en parts de longueur p (étiquettes facultatives).
  const bar = (tot, p, lab, showN) => { const n = Math.round(tot / p), w = 280; let g = `<rect x="20" y="20" width="${w}" height="24" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`;
    if (showN) for (let k = 0; k < n; k++) g += `<rect x="${20 + (k * w) / n}" y="20" width="${w / n}" height="24" class="${k % 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.4"/>`;
    else g += `<rect x="20" y="20" width="${(w * p) / tot}" height="24" class="f-fill"/>`;
    return svg(320, 62, g + T(160, 14, lab, "middle", 11) + T(20 + (w * p) / tot / 2, 58, nb(p), "middle", 10), "barre"); };

  Object.assign(ACTIVE, {
    // ---------- 1. Écritures décimale et fractionnaire décimale ----------
    decread: {
      predict: { q: "Dans 4,357, que vaut le chiffre 5 ?", choices: ["5 dixièmes", "5 centièmes", "5 unités"], good: 1, why: "Après la virgule : dixièmes, puis centièmes, puis millièmes. 5 est au 2e rang : 5 centièmes, soit 0,05." },
      defis: ["Écris en nombre décimal : \\(3 + \\frac{4}{10} + \\frac{7}{1000}\\).", "Combien y a-t-il de centièmes en tout dans 5,28 ?", "Écris \\(\\frac{2391}{100}\\) en nombre décimal."],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => s === 1 ? tab(NUM, 5.28, 1, "5,28 dans le tableau") : tab(NUM, null, 1, "D dizaines · U unités · d dixièmes · c centièmes · m millièmes"),
        show: (x, s) => s === 1 ? tab(NUM, 5.28, 1, "5 unités = 500 centièmes" + prop(x)) : tab(NUM, x, 1, (s ? "2'391 centièmes" : "3 unités, 4 dixièmes, 7 millièmes") + prop(x)),
        wins: [W(3.407, "3,407 : pas de centièmes, on écrit un 0 à leur place."), W(528, "5,28 = 528/100 : 528 centièmes en tout (le chiffre des centièmes, lui, est 8)."), W(23.91, "2'391 centièmes = 23 unités et 91 centièmes : 23,91.")] }),
    },
    deccomp: {
      predict: { q: "Quel est le plus grand nombre ?", choices: ["4,5", "4,12", "ils sont égaux"], good: 0, why: "4,5 = 4,50 : 50 centièmes, c'est plus que 12 centièmes. Le nombre le plus long n'est pas forcément le plus grand." },
      defis: ["Écris un nombre compris entre 2,7 et 2,8.", "Écris un nombre compris entre 0,09 et 0,1.", "Range 3,07 ; 3,7 ; 3,17 ; 3,071 du plus petit au plus grand. Lequel est 2e ?"],
      play: hunt({ ask: true, label: "Un nombre",
        blank: (s) => [zl(2.7, 2.8, 0.01, [2.7, 2.8]), zl(0.09, 0.1, 0.001, [0.09, 0.1]), zl(3, 3.8, 0.1, [3, 3.8])][s],
        show: (x, s) => [zl(2.7, 2.8, 0.01, [2.7, 2.8], [[x, "f-dot", nb(x)]]), zl(0.09, 0.1, 0.001, [0.09, 0.1], [[x, "f-dot", nb(x)]]), zl(3, 3.8, 0.1, [3, 3.8], [[x, "f-dot", nb(x)]])][s] + plain(["2,7 = 2,70 et 2,8 = 2,80 : que mettre entre 70 et 80 centièmes ?", "0,1 = 0,100 et 0,09 = 0,090 : compare en millièmes", "complète avec des zéros : 3,070 ; 3,700 ; 3,170 ; 3,071"][s] + prop(x)),
        wins: [(x) => (x > 2.7 && x < 2.8 ? nb(x) + " convient : entre 2,70 et 2,80, il y a 2,71 ; 2,75 ; 2,799… une infinité de nombres." : ""),
          (x) => (x > 0.09 && x < 0.1 ? nb(x) + " convient : 0,09 = 0,090 et 0,1 = 0,100, on intercale en millièmes." : ""),
          W(3.071, "3,070 < 3,071 < 3,170 < 3,700 : le 2e est 3,071.")] }),
    },
    decarr: {
      predict: { q: "Arrondi au dixième, 7,96 devient…", choices: ["7,9", "8,0", "7,10"], good: 1, why: "Après les dixièmes vient 6 (de 5 à 9) : 9 dixièmes + 1 = 10 dixièmes = 1 unité. La retenue donne 8,0." },
      defis: ["Arrondis 3,476 au centième.", "Encadre 12,738 entre deux dixièmes qui se suivent : tape le plus petit.", "Arrondis 59,97 au dixième."],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [zl(3.4, 3.5, 0.01, [3.4, 3.5], [[3.476, "f-fill", "3,476"]]), zl(12, 13, 0.1, [12, 13], [[12.738, "f-fill", "12,738"]]), zl(59.5, 60.5, 0.1, [59.5, 60, 60.5], [[59.97, "f-fill", "59,97"]])][s],
        show: (x, s) => [zl(3.4, 3.5, 0.01, [3.4, 3.5], [[3.476, "f-fill", ""], [x, "f-dot", nb(x)]]), zl(12, 13, 0.1, [12, 13], [[12.738, "f-fill", ""], [x, "f-dot", nb(x)]]), zl(59.5, 60.5, 0.1, [59.5, 60, 60.5], [[59.97, "f-fill", ""], [x, "f-dot", nb(x)]])][s] + plain(["chiffre après les centièmes : 6", "12,738 est entre 12,7… et 12,8…", "chiffre après les dixièmes : 7 ; 9 dixièmes + 1 ?"][s] + prop(x)),
        wins: [W(3.48, "Le chiffre suivant est 6 : on augmente les centièmes, 3,476 ≈ 3,48."), W(12.7, "12,7 < 12,738 < 12,8."), W(60, "9 dixièmes + 1 = 10 dixièmes : la retenue passe aux unités, 59,97 ≈ 60,0.")] }),
    },
    ordgr: {
      predict: { q: "Sans calculer exactement : 48,7 · 21,2 vaut environ…", choices: ["100", "1'000", "10'000"], good: 1, why: "48,7 ≈ 50 et 21,2 ≈ 20 : 50 · 20 = 1'000. (Le résultat exact est 1'032,44.)" },
      defis: ["Arrondis chaque terme à la centaine, puis calcule : 687 + 214 ≈ ?", "Arrondis chaque facteur à la dizaine, puis calcule : 39,6 · 51,3 ≈ ?", "Un camarade annonce 6,12 · 29,8 = 18,2376. Arrondis 6,12 à l'unité et 29,8 à la dizaine : ordre de grandeur ?"],
      play: hunt({ ask: true, label: "Ordre de grandeur",
        show: (x, s) => plain(["687 ≈ 700 et 214 ≈ 200", "39,6 ≈ 40 et 51,3 ≈ 50", "6,12 ≈ 6 et 29,8 ≈ 30"][s] + prop(x)),
        wins: [W(900, "700 + 200 = 900 (valeur exacte 901)."), W(2000, "40 · 50 = 2'000 (valeur exacte 2'031,48)."), W(180, "6 · 30 = 180 : 18,2376 est 10 fois trop petit, la virgule est mal placée (valeur exacte 182,376).")] }),
    },
    decadd: {
      predict: { q: "2,5 + 1,25 = ?", choices: ["3,30", "3,75", "1,50"], good: 1, why: "On additionne des chiffres de même rang : 2,50 + 1,25 = 3,75 (5 dixièmes + 2 dixièmes, 0 + 5 centièmes)." },
      defis: ["Un sandwich à 6,80 CHF et une boisson à 2,45 CHF. Total (en CHF) ?", "Une planche de 2,4 m ; on en scie 0,75 m. Longueur restante (en m) ?", "Tu paies 15,35 CHF avec un billet de 20 CHF. Monnaie rendue (en CHF) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [col(6.8, "+", 2.45, null), col(2.4, "−", 0.75, null), col(20, "−", 15.35, null)][s],
        show: (x, s) => [col(6.8, "+", 2.45, x), col(2.4, "−", 0.75, x), col(20, "−", 15.35, x)][s] + plain(["virgules alignées, on commence par les centièmes", "2,4 = 2,40 : on complète avec un zéro", "20 = 20,00"][s]),
        wins: [W(9.25, "6,80 + 2,45 = 9,25 CHF."), W(1.65, "2,40 − 0,75 = 1,65 m."), W(4.65, "20,00 − 15,35 = 4,65 CHF. Vérifie : 15,35 + 4,65 = 20.")] }),
    },
    dec10: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\cdot\\,10\\) : la virgule avance d'un rang vers la droite ; \\(: 10\\) : elle recule d'un rang. Avec 100, deux rangs ; avec 1000, trois rangs. On complète avec des zéros si besoin.", exemple: ["\\(3{,}47 \\cdot 100 = 347\\)", "\\(0{,}806 \\cdot 100 = 80{,}6\\)", "\\(52{,}6 : 1000 = 0{,}0526\\)"], piege: "\\(4{,}5 : 100 = 0{,}045\\) : on complète avec un zéro pour reculer de deux rangs." },
      predict: { q: "3,47 · 100 = ?", choices: ["34,7", "347", "3,4700"], good: 1, why: "Multiplier par 100, c'est rendre chaque chiffre 100 fois plus grand : chaque chiffre avance de deux rangs. 3 unités → 3 centaines." },
      defis: ["Transforme 0,806 en 80,6.", "Transforme 52,6 en 0,0526.", "Transforme 4,5 en 0,045."],
      play: hunt({ label: "Opération", start: 0, min: -3, max: 3, fmt: (x) => (x === 0 ? "aucune" : x > 0 ? "· " + nb(10 ** x) : "÷ " + nb(10 ** -x)),
        show: (x, s) => { const N = [0.806, 52.6, 4.5][s], v = +(N * 10 ** x).toFixed(6);
          return tab(["1'000", "100", "10", "1", "0,1", "0,01", "0,001", "0,0001"], v, 3, nb(N) + (x === 0 ? "" : x > 0 ? " · " + nb(10 ** x) : " ÷ " + nb(10 ** -x)) + " = <b>" + nb(v) + "</b>"); },
        note: "Touche − ou + : les chiffres glissent d'un rang ; la virgule reste en place.",
        wins: [W(2, "· 100 : chaque chiffre avance de deux rangs, 0,806 · 100 = 80,6."), W(-3, "÷ 1'000 : chaque chiffre recule de trois rangs, 52,6 ÷ 1'000 = 0,0526."), W(-2, "÷ 100 : 4,5 ÷ 100 = 0,045. C'est aussi 4,5 · 0,01.")] }),
    },
    decmul: {
      predict: { q: "0,5 · 0,5 = ?", choices: ["2,5", "0,25", "1"], good: 1, why: "La moitié de 0,5, c'est 0,25. Multiplier par un nombre plus petit que 1 diminue." },
      defis: ["Le grand carré a une aire de 1. Calcule 0,3 · 0,4 (l'aire colorée).", "Calcule 2,3 · 1,4.", "Un tissu coûte 12,50 CHF le mètre. Prix de 2,4 m (en CHF) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [grid(3, 4), rect4(false), bar(2.4, 1, "2,4 m de tissu · 12,50 CHF le mètre")][s],
        show: (x, s) => [grid(3, 4) + plain("12 petits carrés sur 100 sont colorés" + prop(x)), rect4(true) + plain("2 + 0,8 + 0,3 + 0,12" + prop(x)), plain("2 m → 25 CHF ; 0,4 m → 0,4 · 12,50" + prop(x, "CHF"))][s],
        wins: [W(0.12, "12 centièmes de l'aire : 0,3 · 0,4 = 0,12 (3 · 4 = 12, deux décimales)."), W(3.22, "23 · 14 = 322, une décimale + une décimale = deux : 3,22."), W(30, "12,50 · 2,4 = 30 CHF (25 + 5).")] }),
    },
    decdiv: {
      predict: { q: "6 ÷ 0,5 = ?", choices: ["3", "12", "0,3"], good: 1, why: "Combien de demis dans 6 ? 12. Diviser par 0,5, c'est doubler : le quotient est plus grand que 6." },
      defis: ["Une ficelle de 7,2 m est coupée en 3 morceaux égaux. Longueur d'un morceau (en m) ?", "Combien de verres de 0,25 L remplit-on avec une bouteille de 4,5 L ?", "Calcule 8,64 ÷ 2,4."],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [bar(7.2, 2.4, "ficelle de 7,2 m en 3 morceaux", true).replace(/>2,4</, ">?<"), bar(4.5, 0.25, "4,5 L · un verre = 0,25 L"), plain("8,64 ÷ 2,4 : rends le diviseur entier")][s],
        show: (x, s) => [plain("7,2 ÷ 3 : 72 dixièmes ÷ 3" + prop(x, "m")), bar(4.5, 0.25, "1 L = 4 verres", true) + plain("4,5 ÷ 0,25 = 450 ÷ 25" + prop(x)), plain("8,64 ÷ 2,4 = 86,4 ÷ 24 (les deux · 10)" + prop(x))][s],
        wins: [W(2.4, "7,2 ÷ 3 = 2,4 m. Vérifie : 3 · 2,4 = 7,2."), W(18, "4 verres par litre : 4,5 · 4 = 18 verres."), W(3.6, "86,4 ÷ 24 = 3,6. Vérifie : 2,4 · 3,6 = 8,64.")] }),
    },
    decprob: {
      predict: { q: "3 cahiers à 2,40 CHF, payés avec un billet de 10 CHF. Quel calcul donne la monnaie ?", choices: ["10 − 3 · 2,40", "(10 − 3) · 2,40", "10 − 2,40 + 3"], good: 0, why: "D'abord le prix des cahiers (3 · 2,40 = 7,20), puis ce qui reste sur 10 : 10 − 7,20 = 2,80 CHF." },
      defis: ["Un forfait de ski coûte 46,50 CHF par jour. Prix pour 4 jours (en CHF) ?", "4 amis partagent une pizza à 27,60 CHF. Part de chacun (en CHF) ?", "On coupe 3 morceaux de 1,35 m dans un ruban de 5 m. Longueur restante (en m) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(["4 · 46,50 ; estime : 4 · 50 = 200", "27,60 ÷ 4 ; estime : 28 ÷ 4 = 7", "d'abord 3 · 1,35, puis 5 − …"][s] + prop(x)),
        wins: [W(186, "4 · 46,50 = 186 CHF."), W(6.9, "27,60 ÷ 4 = 6,90 CHF."), W(0.95, "3 · 1,35 = 4,05 m, puis 5 − 4,05 = 0,95 m.")] }),
    },
    pow9: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(a^n\\) est le produit de \\(n\\) facteurs égaux à \\(a\\).", exemple: ["\\(0{,}3^2 = 0{,}3 \\cdot 0{,}3 = 0{,}09\\)", "\\(2^4 + 3^2 = 16 + 9 = 25\\)"] },
      predict: { q: "2³ = ?", choices: ["6", "8", "9"], good: 1, why: "2³ = 2 · 2 · 2 = 8 : trois facteurs égaux à 2. Ce n'est pas 2 · 3." },
      garde: [1, 2],
      defis: ["Calcule 5³.", "Calcule 0,3².", "Calcule 2⁴ + 3²."],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(["5 · 5 · 5", "0,3 · 0,3 : une décimale + une décimale", "2 · 2 · 2 · 2, puis 3 · 3, puis la somme"][s] + prop(x)),
        wins: [W(125, "5 · 5 · 5 = 125."), W(0.09, "0,3 · 0,3 = 0,09 (3 · 3 = 9, deux décimales)."), W(25, "2⁴ = 16 et 3² = 9 : 16 + 9 = 25. Les puissances passent avant l'addition.")] }),
    },

    // ---------- 2. Unités et mesures ----------
    ulong: {
      predict: { q: "2,4 km = … m ?", choices: ["24 m", "240 m", "2'400 m"], good: 2, why: "1 km = 1'000 m : 2,4 km = 2,4 · 1'000 = 2'400 m. Vers une unité plus petite, le nombre grandit." },
      defis: ["Un sentier mesure 3,25 km. Combien de mètres ?", "Une fourmi mesure 8 mm. Combien de centimètres ?", "Un camion porte 2,3 t de sable et 850 kg de gravier. Masse totale (en kg) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => s < 2 ? tab(LEN, null, s ? 5 : 3, s ? "réponse en cm" : "réponse en m") : tab(MAS, null, 3, "réponse en kg"),
        show: (x, s) => [tab(LEN, x, 3, "3,25 km = 3 km + 250 m" + prop(x, "m")), tab(LEN, x, 5, "1 cm = 10 mm" + prop(x, "cm")), tab(MAS, x, 3, "2,3 t = 2'300 kg, puis + 850" + prop(x, "kg"))][s],
        wins: [W(3250, "3,25 · 1'000 = 3'250 m."), W(0.8, "8 mm = 8 ÷ 10 = 0,8 cm : vers une unité plus grande, on divise."), W(3150, "2300 + 850 = 3'150 kg : on additionne dans la même unité.")] }),
    },
    uaire: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "D'une unité d'aire à la suivante : \\(\\cdot\\,100\\). \\(1\\ \\text{m}^2 = 100\\ \\text{dm}^2 = 10'000\\ \\text{cm}^2\\). \\(1\\ \\text{ha} = 10'000\\ \\text{m}^2\\)." },
      predict: { q: "1 m² = … cm² ?", choices: ["100 cm²", "1'000 cm²", "10'000 cm²"], good: 2, why: "Un carré de 1 m de côté, c'est 100 cm sur 100 cm : 100 · 100 = 10'000 carrés de 1 cm²." },
      defis: ["Une feuille A4 mesure environ 6,2 dm². Combien de cm² ?", "Un appartement mesure 85 m². Combien de dm² ?", "Un champ mesure 3,5 ha. Combien de m² ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: () => sq10(),
        show: (x, s) => sq10() + plain(["1 dm² = 10 · 10 cm²", "1 m² = 10 · 10 dm²", "1 ha = carré de 100 m sur 100 m"][s] + prop(x)),
        wins: [W(620, "6,2 · 100 = 620 cm² : d'une unité d'aire à la suivante, · 100."), W(8500, "85 · 100 = 8'500 dm²."), W(35000, "3,5 · 10'000 = 35'000 m².")] }),
    },
    uvol: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Capacités : \\(1\\ \\text{L} = 10\\ \\text{dL} = 100\\ \\text{cL} = 1000\\ \\text{mL}\\). Un cube de 1 dm de côté contient 1 L : \\(1\\ \\text{dm}^3 = 1\\ \\text{L}\\).", exemple: ["\\(75\\ \\text{cL} = 750\\ \\text{mL}\\)", "\\(4{,}5\\ \\text{L} = 450\\ \\text{cL}\\), et \\(450 : 15 = 30\\) verres"], piege: "Mets les deux mesures dans la même unité avant de diviser : \\(4{,}5\\ \\text{L} = 450\\ \\text{cL}\\)." },
      predict: { q: "Un cube de 1 dm de côté, rempli d'eau, contient…", choices: ["1 L", "1 dL", "10 L"], good: 0, why: "1 dm³ = 1 L : c'est la définition du litre. Une brique de lait de 1 L est presque un cube de 1 dm de côté." },
      defis: ["Une bouteille contient 75 cL. Combien de mL ?", "Un aquarium a un volume de 0,12 m³. Combien de litres ?", "Combien de verres de 15 cL remplit-on avec un bidon de 4,5 L ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(["1 cL = 10 mL", "1 m³ = 1'000 dm³ = 1'000 L", "4,5 L = 450 cL, puis ÷ 15"][s] + prop(x)),
        wins: [W(750, "75 · 10 = 750 mL."), W(120, "0,12 · 1'000 = 120 L."), W(30, "4,5 L = 450 cL ; 450 ÷ 15 = 30 verres.")] }),
    },

    // ---------- 3. Géométrie du plan ----------
    angtype: {
      predict: { q: "Un angle de 200°, c'est un angle…", choices: ["obtus", "rentrant", "plat"], good: 1, why: "Obtus : entre 90° et 180°. Plat : 180°. Au-delà de 180° (et avant 360°), l'angle est rentrant." },
      defis: ["Les deux angles forment un angle plat. L'un mesure 65°. Combien mesure l'autre ?", "Trois angles autour d'un point : 140°, 95° et ?", "Quel angle forment les aiguilles d'une montre à 4 h ?"],
      play: hunt({ ask: true, label: "Mesure (en degrés)",
        blank: (s) => [plat(), autour(), montre()][s],
        show: (x, s) => [plat(), autour(), montre()][s] + plain(["angle plat : 180°", "angle plein : 360°", "12 intervalles de même angle sur le cadran ; de 12 h à 4 h : 4 intervalles"][s] + prop(x, "°")),
        wins: [W(115, "65° + 115° = 180° : l'angle plat."), W(125, "140° + 95° + 125° = 360° : l'angle plein."), W(120, "360° ÷ 12 = 30° par heure ; 4 · 30° = 120°, un angle obtus.")] }),
    },
    quadri: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Parallélogramme : côtés opposés parallèles et égaux, angles consécutifs de somme \\(180°\\), diagonales qui se coupent en leur milieu. Losange : 4 côtés égaux. Rectangle : 4 angles droits, diagonales égales. Carré : losange et rectangle.", exemple: ["Losange de périmètre 36 cm : côté 9 cm", "Parallélogramme : un angle de 70°, le suivant de 110°", "Rectangle, \\(AC = 13\\) cm : \\(OB = 6{,}5\\) cm"] },
      predict: { q: "Un carré est-il un losange ?", choices: ["Oui", "Non"], good: 0, why: "Un losange a 4 côtés égaux : le carré aussi. Le carré est à la fois un losange et un rectangle." },
      defis: ["Un losange a un périmètre de 36 cm. Longueur d'un côté (en cm) ?", "Dans un parallélogramme, un angle mesure 70°. Combien mesure l'angle voisin (consécutif) ?", "Les diagonales du rectangle ABCD se coupent en O ; AC = 13 cm. Longueur OB (en cm) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [losange(), para(), rectDiag()][s],
        show: (x, s) => [losange(), para(), rectDiag()][s] + plain(["4 côtés égaux", "deux angles consécutifs : somme 180°", "diagonales du rectangle : même longueur, coupées en leur milieu"][s] + prop(x)),
        wins: [W(9, "36 ÷ 4 = 9 cm : les 4 côtés du losange sont égaux."), W(110, "70° + 110° = 180° : angles consécutifs supplémentaires."), W(6.5, "BD = AC = 13 cm et O est le milieu : OB = 6,5 cm.")] }),
    },

    // ---------- 5. Aires et périmètres ----------
    perim: {
      predict: { q: "On découpe un coin rectangulaire dans un rectangle. Le périmètre…", fig: svg(320, 110, P([[60, 10], [180, 10], [180, 45], [260, 45], [260, 100], [60, 100]]) + `<rect x="180" y="10" width="80" height="35" fill="none" stroke="var(--margin)" stroke-dasharray="4 3"/>`, "rectangle dont on a découpé un coin"),
        choices: ["diminue", "ne change pas", "augmente"], good: 1, why: "Les deux bords du découpage remplacent exactement les deux bords enlevés (même longueur horizontale, même longueur verticale) : le périmètre ne change pas. L'aire, elle, diminue." },
      defis: ["Rectangle de 7,5 cm sur 4 cm : périmètre (en cm) ?", "Un carré a un périmètre de 34 cm. Longueur de son côté (en cm) ?", "On pose une bordure autour de ce jardin en L. Longueur de la bordure (en m) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [rect("7,5 cm", "4 cm"), rect("?", "", true), jardinL()][s],
        show: (x, s) => [rect("7,5 cm", "4 cm"), rect(nb(x) + " cm", "", true), jardinL()][s] + plain(["2 longueurs + 2 largeurs", "4 côtés égaux : 4 · côté = 34", "deux côtés ne sont pas marqués : 10 − 4 = 6 et 6 − 3 = 3"][s] + prop(x)),
        wins: [W(23, "2 · (7,5 + 4) = 23 cm."), W(8.5, "34 ÷ 4 = 8,5 cm."), W(32, "6 + 3 + 4 + 3 + 10 + 6 = 32 m : autant que le rectangle de 10 m sur 6 m.")] }),
    },
    aire1: {
      predict: { q: "Un triangle et un rectangle ont la même base et la même hauteur. L'aire du triangle est…", fig: svg(320, 100, `<rect x="70" y="10" width="180" height="80" class="f-soft" stroke="var(--ink)"/>` + P([[70, 90], [250, 90], [140, 10]]), "triangle dans un rectangle"),
        choices: ["la même", "la moitié", "le double"], good: 1, why: "La hauteur coupe le rectangle en deux rectangles ; le triangle prend la moitié de chacun. Aire du triangle = base · hauteur ÷ 2." },
      defis: ["Rectangle de 8 cm sur 3,5 cm : aire (en cm²) ?", "Triangle de base 9 cm et de hauteur 6 cm : aire (en cm²) ?", "Triangle rectangle : côtés de l'angle droit 5 cm et 12 cm, grand côté 13 cm. Aire (en cm²) ?"],
      play: hunt({ ask: true, label: "Aire",
        blank: (s) => [rect("8 cm", "3,5 cm"), triH(), triR()][s],
        show: (x, s) => [rect("8 cm", "3,5 cm"), triH(), triR()][s] + plain(["longueur · largeur", "base · hauteur ÷ 2", "la hauteur sur la base 12 est le côté 5 ; 13 ne sert pas"][s] + prop(x, "cm²")),
        wins: [W(28, "8 · 3,5 = 28 cm²."), W(27, "9 · 6 ÷ 2 = 27 cm²."), W(30, "5 · 12 ÷ 2 = 30 cm² : les deux côtés de l'angle droit sont base et hauteur.")] }),
    },
    aire2: {
      predict: { q: "On découpe le triangle de gauche du parallélogramme et on le recolle à droite. On obtient…", fig: svg(320, 100, P([[50, 85], [210, 85], [270, 15], [110, 15]]) + L(110, 15, 110, 85, "f-accent", 2) + `<polygon points="210,85 270,85 270,15" fill="none" stroke="var(--margin)" stroke-dasharray="4 3"/>`, "parallélogramme découpé"),
        choices: ["un rectangle", "un losange", "un triangle"], good: 0, why: "Le morceau recollé complète un rectangle de même base et de même hauteur : aire du parallélogramme = base · hauteur." },
      defis: ["Parallélogramme : base 8 cm, côté oblique 6 cm, hauteur 5 cm. Aire (en cm²) ?", "Losange de diagonales 10 cm et 7 cm. Aire (en cm²) ?", "Un parallélogramme a une aire de 54 cm² et une base de 9 cm. Sa hauteur (en cm) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [paraH("8 cm", "5 cm", "6 cm"), losD(), paraH("9 cm", "?", "")][s],
        show: (x, s) => [paraH("8 cm", "5 cm", "6 cm"), losD(), paraH("9 cm", nb(x) + " cm", "")][s] + plain(["base · hauteur ; le côté oblique ne sert pas", "le losange est la moitié du rectangle 10 sur 7", "base · hauteur = 54"][s] + prop(x)),
        wins: [W(40, "8 · 5 = 40 cm² (et non 8 · 6)."), W(35, "10 · 7 ÷ 2 = 35 cm²."), W(6, "9 · 6 = 54 : la hauteur mesure 6 cm.")] }),
    },
    aire3: {
      predict: { q: "Façade : rectangle de 6 m sur 4 m, surmonté d'un toit triangulaire de hauteur 3 m. Aire ?", fig: maison(6, 4, 3), choices: ["24 m²", "33 m²", "42 m²"], good: 1, why: "On découpe : rectangle 6 · 4 = 24, triangle 6 · 3 ÷ 2 = 9. Total 24 + 9 = 33 m²." },
      defis: ["Façade carrée de 5 m de côté, toit triangulaire de hauteur 2 m. Aire (en m²) ?", "Cadre photo : extérieur 20 cm sur 15 cm, intérieur 16 cm sur 11 cm. Aire du cadre (en cm²) ?", "Terrain : un rectangle de 8 m sur 5 m et un triangle de base 3 m et de hauteur 5 m. Aire (en m²) ?"],
      play: hunt({ ask: true, label: "Aire",
        blank: (s) => [maison(5, 5, 2), cadre(), terrain()][s],
        show: (x, s) => [maison(5, 5, 2), cadre(), terrain()][s] + plain(["carré + triangle", "grand rectangle − petit rectangle", "rectangle + triangle"][s] + prop(x)),
        wins: [W(30, "25 + 5 · 2 ÷ 2 = 25 + 5 = 30 m²."), W(124, "20 · 15 − 16 · 11 = 300 − 176 = 124 cm²."), W(47.5, "8 · 5 + 3 · 5 ÷ 2 = 40 + 7,5 = 47,5 m².")] }),
    },

    // ---------- 6. Nombres relatifs ----------
    relrep: {
      predict: { q: "Quel est le plus petit nombre ?", choices: ["−7", "−3"], good: 0, why: "Sur la droite graduée, −7 est plus à gauche que −3 : −7 < −3, même si 7 > 3." },
      defis: ["Quel nombre est repéré par le point A ?", "Il fait −8 °C le matin et 5 °C l'après-midi. De combien de degrés la température a-t-elle monté ?", "Range −2,5 ; 1 ; −3 ; −0,5 du plus petit au plus grand. Lequel est 2e ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [zl(-10, 5, 1, [0, 5], [[-6, "f-fill", "A"]]), zl(-10, 10, 1, [-10, -5, 0, 5, 10], [[-8, "f-fill", "matin"], [5, "f-fill", "après-midi"]]), zl(-4, 2, 0.5, [-4, -2, 0, 2])][s],
        show: (x, s) => [zl(-10, 5, 1, [0, 5], [[-6, "f-fill", "A"], [x, "f-dot", nb(x)]]), zl(-10, 10, 1, [-10, -5, 0, 5, 10], [[-8, "f-fill", ""], [5, "f-fill", ""]]), zl(-4, 2, 0.5, [-4, -2, 0, 2], [[-2.5, "f-fill", ""], [1, "f-fill", ""], [-3, "f-fill", ""], [-0.5, "f-fill", ""], [x, "f-dot", nb(x)]])][s]
          + plain(["une graduation = 1 ; compte depuis 0", "de −8 à 0, puis de 0 à 5", "le plus à gauche est le plus petit"][s] + prop(x)),
        wins: [W(-6, "A est 6 graduations à gauche de 0 : −6."), W(13, "8 degrés jusqu'à 0, puis 5 : 8 + 5 = 13 °C."), W(-2.5, "−3 < −2,5 < −0,5 < 1 : le 2e est −2,5.")] }),
    },
    reladd: {
      predict: { q: "Il fait −3 °C. La température baisse de 5 °C. Il fait…", choices: ["−8 °C", "2 °C", "−2 °C"], good: 0, why: "On part de −3 et on recule encore de 5 : −3 − 5 = −8." },
      defis: ["Calcule (−6) + 9.", "Calcule (−4) + (−7).", "Calcule 4 − (−6)."],
      play: hunt({ ask: true, label: "Résultat",
        blank: (s) => line([-6, -4, 4][s], null),
        show: (x, s) => line([-6, -4, 4][s], x) + plain(["on part de −6 et on avance de 9", "on part de −4 et on recule de 7", "soustraire −6, c'est ajouter 6"][s] + prop(x)),
        wins: [W(3, "Signes contraires : 9 − 6 = 3, signe du plus éloigné de zéro (9) : +3."), W(-11, "Même signe : 4 + 7 = 11, on garde le signe − : −11."), W(10, "4 − (−6) = 4 + 6 = 10.")] }),
    },
  });

  // ---------- figures ----------
  const LEN = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
  const MAS = ["t", "", "", "kg", "", "", "g"];
  // Carré unité 10 × 10, rectangle a/10 sur b/10 colorié.
  function grid(a, b) { const u = 12; let g = ""; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g += `<rect x="${100 + i * u}" y="${8 + j * u}" width="${u}" height="${u}" class="${i < a && j < b ? "f-fill" : "f-soft"}" stroke="var(--line)" stroke-width="0.5"/>`;
    return svg(320, 140, g + T(100 + (a * u) / 2, 6 + 10 * u + 14, "0,3", "middle", 11) + T(96, 8 + (b * u) / 2 + 4, "0,4", "end", 11) + T(230, 70, "côté 1", "start", 11), "carré d'aire 1"); }
  // Rectangle 2,3 sur 1,4 découpé en 2 + 0,3 et 1 + 0,4.
  function rect4(full) { const k = 90, x0 = 40, y0 = 10, a = 2 * k, b = 0.3 * k, c = 1 * k, d = 0.4 * k; let g = `<rect x="${x0}" y="${y0}" width="${a}" height="${c}" class="f-fill2"/><rect x="${x0 + a}" y="${y0}" width="${b}" height="${c}" class="f-soft" stroke="var(--ink)"/><rect x="${x0}" y="${y0 + c}" width="${a}" height="${d}" class="f-soft" stroke="var(--ink)"/><rect x="${x0 + a}" y="${y0 + c}" width="${b}" height="${d}" class="f-fill2"/>`;
    g += T(x0 + a / 2, y0 + c + d + 14, "2", "middle", 11) + T(x0 + a + b / 2, y0 + c + d + 14, "0,3", "middle", 11) + T(x0 - 4, y0 + c / 2, "1", "end", 11) + T(x0 - 4, y0 + c + d / 2 + 4, "0,4", "end", 11);
    if (full) g += T(x0 + a / 2, y0 + c / 2 + 4, "2", "middle", 12) + T(x0 + a + b / 2, y0 + c / 2 + 4, "0,3", "middle", 10) + T(x0 + a / 2, y0 + c + d / 2 + 4, "0,8", "middle", 12) + T(x0 + a + b / 2 + 22, y0 + c + d / 2 + 4, "0,12", "start", 10);
    return svg(320, 160, g, "rectangle 2,3 sur 1,4 découpé"); }
  // Carré de 1 dm découpé en 100 cm².
  function sq10() { const u = 10; let g = ""; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g += `<rect x="${110 + i * u}" y="${6 + j * u}" width="${u}" height="${u}" class="${i || j ? "f-soft" : "f-fill"}" stroke="var(--line)" stroke-width="0.5"/>`;
    return svg(320, 128, g + `<rect x="110" y="6" width="100" height="100" fill="none" stroke="var(--ink)" stroke-width="2"/>` + T(160, 122, "1 dm = 10 cm", "middle", 11) + T(222, 14, "1 cm²", "start", 11, "f-txt f-accent"), "carré de 1 dm découpé en carrés de 1 cm"); }
  function plat() { return svg(320, 110, L(30, 95, 290, 95) + L(160, 95, 160 + 90 * Math.cos(65 * Math.PI / 180), 95 - 90 * Math.sin(65 * Math.PI / 180), "f-accent", 2.4) + T(205, 80, "65°", "middle", 12) + T(120, 80, "?", "middle", 13, "f-txt f-accent"), "angle plat partagé"); }
  function autour() { const O = [160, 65], r = 55, ray = (a) => L(O[0], O[1], O[0] + r * Math.cos(a * Math.PI / 180), O[1] - r * Math.sin(a * Math.PI / 180), "f-line", 2), lab = (a, s, c) => T(O[0] + 32 * Math.cos(a * Math.PI / 180), O[1] - 32 * Math.sin(a * Math.PI / 180) + 4, s, "middle", 11, c);
    return svg(320, 130, ray(0) + ray(140) + ray(235) + lab(70, "140°") + lab(187.5, "95°") + lab(297.5, "?", "f-txt f-accent"), "trois angles autour d'un point"); }
  function montre() { const O = [160, 66], r = 56; let g = `<circle cx="${O[0]}" cy="${O[1]}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.6"/>`;
    for (let k = 0; k < 12; k++) { const a = (k * 30 * Math.PI) / 180; g += L(O[0] + 48 * Math.sin(a), O[1] - 48 * Math.cos(a), O[0] + r * Math.sin(a), O[1] - r * Math.cos(a), "f-line", k % 3 ? 1 : 2.2); }
    return svg(320, 130, g + L(O[0], O[1], O[0], O[1] - 46, "f-line", 2.4) + L(O[0], O[1], O[0] + 34 * Math.sin(Math.PI * 2 / 3), O[1] - 34 * Math.cos(Math.PI * 2 / 3), "f-accent", 3.2) + `<circle cx="${O[0]}" cy="${O[1]}" r="3" class="f-dot"/>` + T(O[0], O[1] - 60 + 22, "12", "middle", 10) + T(O[0] + 40 * Math.sin(Math.PI * 2 / 3) - 8, O[1] - 40 * Math.cos(Math.PI * 2 / 3) + 2, "4", "middle", 10), "montre à 4 heures"); }
  function losange() { return svg(320, 130, P([[160, 8], [250, 65], [160, 122], [70, 65]]) + T(214, 30, "?", "start", 13, "f-txt f-accent") + T(160, 70, "périmètre 36 cm", "middle", 11), "losange"); }
  function para() { return svg(320, 120, P([[50, 105], [220, 105], [280, 20], [110, 20]]) + T(78, 98, "70°", "start", 12) + T(206, 98, "?", "end", 13, "f-txt f-accent"), "parallélogramme"); }
  function rectDiag() { return svg(320, 130, `<rect x="50" y="15" width="220" height="100" class="f-shape"/>` + L(50, 15, 270, 115, "f-line", 1.4) + L(270, 15, 50, 115, "f-accent", 2) + `<circle cx="160" cy="65" r="3" class="f-dot"/>` + T(42, 12, "A", "end") + T(278, 12, "B", "start") + T(278, 126, "C", "start") + T(42, 126, "D", "end") + T(160, 86, "O") + T(220, 104, "AC = 13 cm", "middle", 10), "rectangle et ses diagonales"); }
  function rect(lw, lh, sq) { const w = sq ? 100 : 200, hh = sq ? 100 : 90; return svg(320, 130, `<rect x="${160 - w / 2}" y="10" width="${w}" height="${hh}" class="f-shape"/>` + T(160, 10 + hh + 16, lw, "middle", 12, /\?/.test(lw) ? "f-txt f-accent" : "f-txt") + (lh ? T(160 + w / 2 + 6, 10 + hh / 2 + 4, lh, "start", 12) : "") + (sq ? T(160, 10 + hh / 2 + 4, "carré", "middle", 11) : ""), "rectangle"); }
  function jardinL() { const k = 20, X = (u) => 60 + u * k, Y = (v) => 10 + v * k;
    return svg(320, 145, P([[X(0), Y(0)], [X(6), Y(0)], [X(6), Y(3)], [X(10), Y(3)], [X(10), Y(6)], [X(0), Y(6)]]) + T(X(5), Y(6) + 16, "10 m") + T(X(0) - 6, Y(3) + 4, "6 m", "end") + T(X(8), Y(3) - 6, "4 m") + T(X(6) - 6, Y(1.5) + 4, "3 m", "end"), "jardin en L"); }
  function triH() { return svg(320, 120, P([[60, 100], [240, 100], [110, 15]]) + L(110, 15, 110, 100, "f-accent", 2) + `<rect x="110" y="92" width="8" height="8" fill="none" stroke="var(--margin)"/>` + T(150, 116, "9 cm") + T(104, 62, "6 cm", "end"), "triangle, base et hauteur"); }
  function triR() { return svg(320, 120, P([[80, 100], [260, 100], [80, 25]]) + `<rect x="80" y="92" width="8" height="8" fill="none" stroke="var(--ink)"/>` + T(170, 116, "12 cm") + T(74, 66, "5 cm", "end") + T(178, 56, "13 cm", "start"), "triangle rectangle"); }
  function paraH(b, h, c) { return svg(320, 120, P([[50, 100], [230, 100], [280, 20], [100, 20]]) + L(100, 20, 100, 100, "f-accent", 2) + `<rect x="100" y="92" width="8" height="8" fill="none" stroke="var(--margin)"/>` + T(140, 116, b) + T(94, 64, h, "end", 12, /\?/.test(h) ? "f-txt f-accent" : "f-txt") + (c ? T(264, 64, c, "start") : ""), "parallélogramme et sa hauteur"); }
  function losD() { return svg(320, 130, P([[160, 8], [260, 65], [160, 122], [60, 65]]) + L(60, 65, 260, 65, "f-accent", 1.6) + L(160, 8, 160, 122, "f-accent", 1.6) + `<rect x="60" y="8" width="200" height="114" fill="none" stroke="var(--line)" stroke-dasharray="4 3"/>` + T(205, 60, "10 cm", "middle", 11) + T(166, 100, "7 cm", "start", 11), "losange et ses diagonales"); }
  function maison(a, b, hh) { const k = 22, x0 = 160 - (a * k) / 2, yb = 10 + (b + hh) * k;
    return svg(320, yb + 22, P([[x0, yb], [x0 + a * k, yb], [x0 + a * k, yb - b * k], [x0, yb - b * k]], "f-fill2") + P([[x0, yb - b * k], [x0 + a * k, yb - b * k], [160, 10]]) + L(160, 10, 160, yb - b * k, "f-accent", 1.4) + T(160, yb + 16, a + " m") + T(x0 + a * k + 6, yb - (b * k) / 2, b + " m", "start") + T(166, yb - b * k - 6, hh + " m", "start", 11), "façade de maison"); }
  function cadre() { return svg(320, 140, `<rect x="60" y="10" width="200" height="110" class="f-fill2"/><rect x="80" y="25" width="160" height="80" class="f-soft" stroke="var(--ink)"/>` + T(160, 134, "20 cm (extérieur)") + T(266, 68, "15 cm", "start") + T(160, 70, "16 cm sur 11 cm", "middle", 11), "cadre photo"); }
  function terrain() { const k = 22; return svg(320, 140, `<rect x="60" y="10" width="${8 * k}" height="${5 * k}" class="f-shape"/>` + P([[60 + 8 * k, 10], [60 + 11 * k, 10 + 5 * k], [60 + 8 * k, 10 + 5 * k]], "f-fill2") + T(60 + 4 * k, 10 + 5 * k + 16, "8 m") + T(54, 10 + 2.5 * k + 4, "5 m", "end") + T(60 + 9.5 * k, 10 + 5 * k + 16, "3 m"), "terrain : rectangle et triangle"); }
})();
