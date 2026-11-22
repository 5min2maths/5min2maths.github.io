// Chantier 1re Collège · systèmes et fonctions affines (18.11) : leçons actives (devine / manipule / retiens) et rappels
// pour sys2, sysprob, sysgraph, sys3, affine, affzero, sysineq. Mode réponse : l'élève calcule et tape sa réponse, la
// figure réagit ensuite (commentaire testeur du 17.11 : pas de curseur à tâtonner). Pas de TeX dans ce qui est redessiné.
(function () {
  const R2 = {
    sys2: ["Systèmes de deux équations", "Résoudre un système, c'est trouver le couple \\((x \\,;\\, y)\\) qui vérifie les deux équations à la fois.",
      "Substitution : on isole une inconnue dans une équation et on la remplace dans l'autre. Combinaison : on multiplie les équations pour que l'addition (ou la soustraction) fasse disparaître une inconnue. On termine en calculant l'autre inconnue et en vérifiant dans les <b>deux</b> équations.",
      ["\\(\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases}\\) : en additionnant, \\(2x = 12\\), \\(x = 6\\), \\(y = 4\\).", "\\(\\begin{cases} y = 2x + 1 \\\\ 3x + y = 11 \\end{cases}\\) : \\(3x + 2x + 1 = 11\\), \\(x = 2\\), \\(y = 5\\)."],
      "La réponse est un couple : x d'abord, puis y."],
    sysprob: ["Problèmes à deux inconnues", "Deux informations, deux inconnues : un système.",
      "1. Nommer les deux inconnues (et écrire ce qu'elles représentent). 2. Écrire une équation par information. 3. Résoudre. 4. Vérifier dans l'énoncé et répondre par une phrase.",
      ["35 têtes et 94 pattes : \\(p + \\ell = 35\\), \\(2p + 4\\ell = 94\\), donc 12 lapins et 23 poules.", "Avec le courant : \\(v + c = 20\\) ; contre : \\(v - c = 14\\) ; donc \\(v = 17\\), \\(c = 3\\)."],
      "Vérifie que la solution a un sens : un nombre d'animaux est entier et positif."],
    sysgraph: ["Systèmes et droites", "Chaque équation d'un système 2 × 2 est une droite ; la solution est leur point commun.",
      "Droites sécantes (pentes différentes) : une solution. Droites parallèles distinctes (même pente, ordonnées à l'origine différentes) : aucune solution. Droites confondues (équations proportionnelles) : une infinité de solutions.",
      ["\\(y = 2x + 1\\) et \\(y = 2x - 3\\) : parallèles, aucune solution.", "\\(2x + 3y = 6\\) et \\(4x + 6y = 12\\) : confondues, une infinité.", "\\(y = x + 1\\) et \\(y = -x + 5\\) : sécantes en \\((2 \\,;\\, 3)\\)."],
      "Compare les pentes après avoir isolé y dans chaque équation."],
    sys3: ["Systèmes de trois équations", "On ramène le système à un système 2 × 2, puis à une équation.",
      "On élimine une inconnue en combinant deux paires de lignes ; on résout le système 2 × 2 obtenu ; on remonte pour trouver la troisième inconnue. Un système « en escalier » (triangulaire) se résout directement de bas en haut.",
      ["\\(\\begin{cases} x + y + z = 6 \\\\ y + z = 5 \\\\ z = 2 \\end{cases}\\) : \\(z = 2\\), \\(y = 3\\), \\(x = 1\\).", "Astuce quand chaque ligne est la somme de deux inconnues : \\(\\begin{cases} x + y = 7 \\\\ y + z = 9 \\\\ x + z = 8 \\end{cases}\\). On additionne les trois lignes : \\(2x + 2y + 2z = 24\\), donc \\(x + y + z = 12\\). On retranche chaque ligne de 12 : \\(z = 12 - 7 = 5\\), \\(x = 12 - 9 = 3\\), \\(y = 12 - 8 = 4\\)."],
      "Garde l'ordre (x ; y ; z) dans la réponse."],
    affine: ["Fonctions affines", "\\(f(x) = ax + b\\) : une droite de pente \\(a\\) et d'ordonnée à l'origine \\(b\\).",
      "La pente se calcule avec deux points : \\(a = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}\\). L'ordonnée à l'origine est \\(b = f(0)\\), ou \\(b = f(x_1) - a x_1\\). Deux droites parallèles ont la même pente.",
      ["\\(f(1) = 5\\), \\(f(3) = 9\\) : \\(a = \\frac{4}{2} = 2\\), \\(b = 3\\), \\(f(x) = 2x + 3\\).", "Taxi : 6 CHF + 3 CHF/km : \\(f(x) = 3x + 6\\)."],
      "La pente est (différence des images) ÷ (différence des x), dans le même ordre en haut et en bas."],
    affzero: ["Zéro et signe", "Une fonction affine change de signe une seule fois, en son zéro.",
      "Zéro : on résout \\(ax + b = 0\\), \\(x = -\\frac{b}{a}\\). Si \\(a > 0\\), la fonction est négative avant le zéro et positive après ; si \\(a < 0\\), c'est l'inverse. Pour \\(f(x) > g(x)\\), on étudie le signe de \\(f(x) - g(x)\\).",
      ["\\(f(x) = 2x - 6\\) : zéro 3, \\(f(x) > 0\\) pour \\(x > 3\\).", "\\(f(x) = -3x + 12\\) : zéro 4, \\(f(x) > 0\\) pour \\(x < 4\\)."],
      "En divisant par un nombre négatif, on retourne le sens de l'inégalité."],
    sysineq: ["Systèmes d'inéquations", "Toutes les conditions doivent être vraies en même temps.",
      "On résout chaque inéquation, on représente les solutions sur une même droite graduée et on garde la partie commune (l'intersection). Crochet fermé pour ≤ et ≥ (borne comprise), ouvert pour < et >. Si les parties ne se chevauchent pas : aucune solution.",
      ["\\(x > 2\\) et \\(x \\le 5\\) : \\(S = \\,]2 \\,;\\, 5]\\).", "\\(-2x > 4\\) donne \\(x < -2\\) (sens retourné).", "\\(x < 1\\) et \\(x > 4\\) : \\(S = \\varnothing\\)."],
      "On garde la partie commune, pas la réunion des deux."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1);
      box.innerHTML = (actAnswerHtml(o.label || "Ta réponse")) + o.show(x, s);
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule."); };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (x !== null && Math.abs(x - target) < 1e-9 ? msg : "");
  // Repère avec droites, verticale x = v et points d'intersection avec chaque droite
  const plot = (fs, v, opts = {}) => { const X = (x) => 160 + x * 18, Y = (y) => 110 - y * 12; let g = "";
    for (let k = -8; k <= 8; k++) g += `<line x1="${X(k)}" y1="10" x2="${X(k)}" y2="210" class="f-grid"/>`;
    for (let k = -8; k <= 8; k++) g += `<line x1="16" y1="${Y(k)}" x2="304" y2="${Y(k)}" class="f-grid"/>`;
    g += `<line x1="16" y1="${Y(0)}" x2="304" y2="${Y(0)}" class="f-line"/><line x1="${X(0)}" y1="10" x2="${X(0)}" y2="210" class="f-line"/>`;
    fs.forEach((f, i) => { g += `<line x1="${X(-8)}" y1="${Y(f(-8))}" x2="${X(8)}" y2="${Y(f(8))}" class="${i ? "f-line" : "f-accent"}" stroke-width="2.4" clip-path="inset(0)"/>`; });
    if (v !== null && v !== undefined && Math.abs(v) <= 8) { g += `<line x1="${X(v)}" y1="10" x2="${X(v)}" y2="210" class="f-line" stroke-dasharray="4 4"/>`; fs.forEach((f) => { const y = f(v); if (Math.abs(y) <= 8.5) g += `<circle cx="${X(v)}" cy="${Y(y)}" r="4.5" class="f-dot"/>`; }); }
    (opts.pts || []).forEach(([a, b]) => (g += `<circle cx="${X(a)}" cy="${Y(b)}" r="4" class="f-dot"/>`));
    return svg(320, 220, `<clipPath id="pcs"><rect x="16" y="10" width="288" height="200"/></clipPath><g clip-path="url(#pcs)">${g}</g>`, "repère"); };

  Object.assign(ACTIVE, {
    sys2: {
      predict: { q: "x + y = 10 et x − y = 2. Que vaut x ?", choices: ["6", "5", "4"], good: 0, why: "En additionnant les deux équations, les y disparaissent : 2x = 12, donc x = 6 (et y = 4). 5 et 5 font bien 10, mais 5 − 5 ne fait pas 2." },
      defis: ["y = −x + 10 et y = x − 2 : quelle valeur de x rend les deux y égaux ?", "y = 2x + 1 et y = −x + 7 : trouve x.", "y = x + 3 et y = −2x − 3 : trouve x."],
      play: hunt({ label: "x =",
        show: (x, s) => { const F = [[(t) => -t + 10, (t) => t - 2], [(t) => 2 * t + 1, (t) => -t + 7], [(t) => t + 3, (t) => -2 * t - 3]][s];
          return plot(F, x) + (x === null ? `<div class="small muted">Les deux droites représentent les deux équations. Calcule x par substitution ou par combinaison.</div>` : `<div class="act-out">En x = ${nb(x)} : 1re droite y = ${nb(F[0](x))}, 2e droite y = ${nb(F[1](x))} → ${Math.abs(F[0](x) - F[1](x)) < 1e-9 ? '<b class="act-ok">même point : c\'est la solution</b>' : "écart " + nb(Math.abs(F[0](x) - F[1](x)))}</div>`); },
        wins: [W(6, "−x + 10 = x − 2, 2x = 12, x = 6 ; y = 4. Solution (6 ; 4)."), W(2, "2x + 1 = −x + 7, 3x = 6, x = 2 ; y = 5. Solution (2 ; 5)."), W(-2, "x + 3 = −2x − 3, 3x = −6, x = −2 ; y = 1. Solution (−2 ; 1).")] }),
    },
    sysprob: {
      predict: { q: "Dans une ferme : 10 têtes et 28 pattes (poules et lapins). Combien de lapins ?", choices: ["4", "6", "5"], good: 0, why: "Si tous étaient des poules : 20 pattes. Il en manque 8, et chaque lapin ajoute 2 pattes : 4 lapins (et 6 poules)." },
      defis: ["10 têtes, 28 pattes : combien de lapins ?", "20 têtes, 56 pattes : combien de lapins ?", "35 têtes, 94 pattes : combien de lapins ?"],
      play: hunt({ label: "Lapins :",
        show: (x, s) => { const [n, p] = [[10, 28], [20, 56], [35, 94]][s]; if (x === null) return `<div class="small muted">${n} têtes, ${p} pattes. Écris le système p + ℓ = ${n}, 2p + 4ℓ = ${p}, ou raisonne « si tous étaient des poules… ».</div>`;
          const l = Math.max(0, Math.min(n, Math.round(x))), po = n - l, legs = 2 * po + 4 * l; let g = "";
          for (let k = 0; k < n; k++) g += `<circle cx="${20 + (k % 18) * 16}" cy="${20 + Math.floor(k / 18) * 22}" r="6" class="${k < l ? "f-fill" : "f-fill2"}"/>`;
          return svg(320, 20 + Math.ceil(n / 18) * 22, g, l + " lapins") + `<div class="act-out">${l} lapins et ${po} poules : ${4 * l} + ${2 * po} = <b>${legs} pattes</b> (il en faut ${p}) → ${legs === p ? '<b class="act-ok">✓</b>' : legs < p ? "pas assez" : "trop"}</div>`; },
        wins: [W(4, "4 lapins, 6 poules : 16 + 12 = 28."), W(8, "8 lapins, 12 poules : 32 + 24 = 56."), W(12, "Si tout était des poules : 70 pattes ; il en manque 24, soit 12 lapins.")] }),
    },
    sysgraph: {
      predict: { q: "Le système y = 2x + 1 et y = 2x − 3 a…", choices: ["une solution", "aucune solution", "une infinité de solutions"], good: 1, why: "Même pente 2, ordonnées à l'origine différentes : droites parallèles, jamais de point commun." },
      defis: ["Quelle pente m rend y = mx + 1 parallèle à y = 3x − 2 ?", "Quelle valeur de b rend y = −x + b confondue avec la droite x + y = 4 ?", "Quelle pente m fait couper y = mx et y = 2x + 4 en x = 2 ?"],
      play: hunt({ label: "Valeur :",
        show: (v, s) => { const base = [(t) => 3 * t - 2, (t) => 4 - t, (t) => 2 * t + 4][s], mine = v === null ? null : [(t) => v * t + 1, (t) => -t + v, (t) => v * t][s];
          const out = v === null ? `<div class="small muted">${["Deux droites parallèles ont la même pente.", "Isole y dans x + y = 4.", "Au point d'intersection, les deux droites ont le même y."][s]}</div>`
            : `<div class="act-out">${["pentes : " + nb(v) + " et 3 → " + (v === 3 ? '<b class="act-ok">parallèles : aucune solution</b>' : "sécantes : une solution"), "y = −x + " + nb(v) + " et y = −x + 4 → " + (v === 4 ? '<b class="act-ok">confondues : une infinité de solutions</b>' : "parallèles distinctes : aucune"), "en x = 2 : " + nb(2 * v) + " et 8 → " + (v === 4 ? '<b class="act-ok">elles se coupent en (2 ; 8)</b>' : "pas encore")][s]}</div>`;
          return plot(mine ? [base, mine] : [base], s === 2 ? 2 : null) + out; },
        wins: [W(3, "Même pente 3 : parallèles (ordonnées 1 et −2 différentes), aucune solution."), W(4, "x + y = 4 s'écrit y = −x + 4 : avec b = 4, les droites sont confondues."), W(4, "2m = 2 · 2 + 4 = 8, donc m = 4.")] }),
    },
    sys3: {
      predict: { q: "x + y + z = 6, y + z = 5 et z = 2. Que vaut x ?", choices: ["1", "3", "4"], good: 0, why: "On remonte : z = 2, puis y = 5 − 2 = 3, puis x = 6 − 3 − 2 = 1." },
      defis: ["Système x + y + z = 9, y + z = 7, z = 3 : que vaut y ?", "Même système : que vaut x ?", "x + y = 7, y + z = 9, x + z = 8 : additionne les trois lignes. Que vaut x + y + z ?"],
      play: hunt({ label: "Ta réponse :",
        show: (v, s) => `<div class="act-out" style="text-align:left">${["x + y + z = 9<br>y + z = 7<br>z = 3", "x + y + z = 9<br>y + z = 7 (donc y = 4)<br>z = 3", "x + y = 7<br>y + z = 9<br>x + z = 8"][s]}</div>` + (v === null ? "" : `<div class="act-out">${[v === 4 ? "✓ y = 7 − 3 = 4" : "Avec z = 3 : y + 3 = 7…", v === 2 ? "✓ x = 9 − 4 − 3 = 2" : "x + 4 + 3 = 9…", v === 12 ? "✓ 2(x + y + z) = 24, donc 12" : "La somme des trois lignes vaut 24 = 2(x + y + z)…"][s]}</div>`),
        wins: [W(4, "z = 3, donc y = 7 − 3 = 4."), W(2, "x = 9 − 4 − 3 = 2 : solution (2 ; 4 ; 3)."), W(12, "2(x + y + z) = 24, donc x + y + z = 12 ; puis z = 12 − 7 = 5, x = 3, y = 4.")] }),
    },
    affine: {
      predict: { q: "f(x) = 2x + 3. Que vaut f(0) ?", choices: ["2", "3", "5"], good: 1, why: "f(0) = 2 · 0 + 3 = 3 : c'est l'ordonnée à l'origine b, là où la droite coupe l'axe vertical." },
      defis: ["Pente de la droite qui passe par (0 ; 1) et (2 ; 5) ?", "Ordonnée à l'origine de la droite de pente 3 passant par (1 ; 1) ?", "Pente de la droite qui passe par (−2 ; 4) et (2 ; 2) ?"],
      play: hunt({ label: "Ta réponse :",
        show: (v, s) => { const P = [[[0, 1], [2, 5]], [[1, 1]], [[-2, 4], [2, 2]]][s], f = v === null ? null : [(t) => v * t + 1, (t) => 3 * t + v, (t) => v * (t + 2) + 4][s];
          const ok = v !== null && [v === 2, v === -2, v === -0.5][s];
          return plot(f ? [f] : [], null, { pts: P }) + (v === null ? `<div class="small muted">${["Pente = (différence des y) ÷ (différence des x).", "b = y − a · x avec le point donné.", "Attention : la droite descend."][s]}</div>` : `<div class="act-out">${ok ? '<b class="act-ok">La droite passe par les points.</b>' : "La droite ne passe pas par tous les points."}</div>`); },
        wins: [W(2, "a = (5 − 1) ÷ (2 − 0) = 2."), W(-2, "b = 1 − 3 · 1 = −2 : f(x) = 3x − 2."), W(-0.5, "a = (2 − 4) ÷ (2 − (−2)) = −2 ÷ 4 = −0,5 : la droite descend.")] }),
    },
    affzero: {
      predict: { q: "f(x) = 2x − 6. Son zéro est…", choices: ["−6", "3", "6"], good: 1, why: "2x − 6 = 0 donne x = 3 : la droite coupe l'axe horizontal en 3. −6 est l'ordonnée à l'origine." },
      defis: ["Zéro de f(x) = 2x − 6 ?", "Zéro de f(x) = −3x + 12 ?", "Zéro de f(x) = 0,5x + 2 ?"],
      play: hunt({ label: "x =",
        show: (v, s) => { const f = [(t) => 2 * t - 6, (t) => -3 * t + 12, (t) => 0.5 * t + 2][s];
          return plot([f], v) + (v === null ? `<div class="small muted">Le zéro est l'abscisse où la droite coupe l'axe horizontal.</div>` : `<div class="act-out">f(${nb(v)}) = <b>${nb(f(v))}</b> → ${Math.abs(f(v)) < 1e-9 ? '<b class="act-ok">zéro !</b>' : f(v) > 0 ? "positif" : "négatif"}</div>`); },
        wins: [W(3, "2x = 6, x = 3. Avant 3, f est négative ; après, positive (pente positive)."), W(4, "−3x = −12, x = 4. Pente négative : f est positive avant 4."), W(-4, "0,5x = −2, x = −4.")] }),
    },
    sysineq: {
      predict: { q: "x > 2 et x ≤ 5. Le nombre 5 est-il solution ?", choices: ["Oui", "Non"], good: 0, why: "5 > 2 et 5 ≤ 5 : les deux conditions sont vraies. S = ]2 ; 5], crochet fermé en 5." },
      defis: ["x > 2 et x ≤ 5 : le plus grand entier solution ?", "2x − 1 > 3 et x + 4 ≤ 9 : le plus petit entier solution ?", "−2x > 4 et x > −5 : le plus grand entier solution ?"],
      play: hunt({ label: "Entier :",
        show: (v, s) => { const [lo, li, hi, hc] = [[2, false, 5, true], [2, false, 5, true], [-5, false, -2, false]][s], X = (t) => 160 + t * 20;
          let g = `<line x1="10" y1="40" x2="310" y2="40" class="f-line"/>`; for (let k = -7; k <= 7; k++) g += `<line x1="${X(k)}" y1="35" x2="${X(k)}" y2="45" class="f-line"/><text x="${X(k)}" y="60" class="f-txt" text-anchor="middle" font-size="10">${k}</text>`;
          g += `<line x1="${X(lo)}" y1="40" x2="${X(hi)}" y2="40" class="f-accent" stroke-width="5"/><text x="${X(lo)}" y="30" class="f-txt" text-anchor="middle">${li ? "[" : "]"}</text><text x="${X(hi)}" y="30" class="f-txt" text-anchor="middle">${hc ? "]" : "["}</text>`;
          const inside = v !== null && (v > lo || (li && v === lo)) && (v < hi || (hc && v === hi));
          if (v !== null && Math.abs(v) <= 7) g += `<circle cx="${X(v)}" cy="40" r="6" class="${inside ? "f-dot" : "f-soft"}" stroke="var(--ink)"/>`;
          return (v === null ? `<div class="small muted">${["Lis directement les deux conditions.", "Résous chaque ligne : 2x > 4 et x ≤ 5.", "−2x > 4 : on divise par −2, le sens change."][s]}</div>` : svg(320, 70, g, "droite graduée") + `<div class="act-out">${nb(v)} ${inside ? "vérifie les deux conditions" : "ne vérifie pas les deux conditions"}</div>`); },
        wins: [W(5, "5 est compris (≤) : S = ]2 ; 5]."), W(3, "x > 2 et x ≤ 5 : le plus petit entier est 3 (2 est exclu)."), W(-3, "−2x > 4 donne x < −2 ; avec x > −5 : S = ]−5 ; −2[, le plus grand entier est −3.")] }),
    },
  });
})();
