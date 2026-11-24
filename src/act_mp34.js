// Chantier MP 3e et MP 4e (24.11) : leçons actives des 21 notions de src/ch_mp3.js et src/ch_mp4.js.
// Trois modes pour l'étape 2 (actPrep, active.js) :
//   - Manipule (vrai geste, manipLesson de manip.js) : eqabs (le point qu'on promène sur la droite graduée),
//     similmp (le niveau du liquide dans un verre conique), vectmp (la flèche qu'on tire sur le quadrillage) ;
//   - Essaie sur la figure (réponse tapée qui fait réagir un graphique) : droiteparam, sinusmp ;
//   - À toi : 2 questions (réponse tapée, coup de pouce après une erreur) : les 16 autres.
// Le rappel de cours (« Retiens ») est la leçon de la notion (LESSONS, dans ch_mp3.js / ch_mp4.js).
// Pas de TeX dans ce qui est redessiné à chaque geste ni dans les messages de réussite.
(function () {
  if (typeof ACTIVE === "undefined") return;
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const n0 = (v) => String(v).replace("-", "−");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const Tx = (x, y, s, a, sz, ex) => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="f-txt" text-anchor="${a}" font-size="${sz}"${(ex || "").replace(/ fill="([^"]+)"/, ' style="fill:$1"')}>${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" class="${cls}" stroke-width="${w}"/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const tu = (x) => " ; tu proposes <b>" + nb(x) + "</b>";
  const dot = (col, lab) => `<circle r="9" fill="${col}" stroke="var(--paper)" stroke-width="2.5"/>` + (lab ? `<text y="-14" text-anchor="middle" class="f-txt" font-size="13" font-weight="700">${lab}</text>` : "");

  // Chercheur (même moteur que act_mp2.js) : réponse tapée ; o.blank → figure (« Essaie sur la figure »),
  // sinon « À toi » (actPrep garde 2 questions et affiche show() comme coup de pouce après une erreur).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
        x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis le coup de pouce, puis recalcule.")); };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Leçon « À toi » : deux questions, coups de pouce (texte simple) et messages de réussite.
  const guide = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(cp[s] + tu(x)), wins });

  Object.assign(ACTIVE, {
    // =============================== MP 3e · A. Équations avancées ===============================
    eqbic: {
      predict: { q: "Dans \\(x^4 - 13x^2 + 36 = 0\\), on pose \\(X = x^2\\). On obtient…", choices: ["\\(X^2 - 13X + 36 = 0\\)", "\\(X - 13X + 36 = 0\\)", "\\(X^4 - 13X + 36 = 0\\)"], good: 0,
        why: "x⁴ = (x²)² = X² : l'équation de degré 4 devient une équation du 2e degré en X, qu'on sait résoudre." },
      defis: ["\\(x^4 - 10x^2 + 9 = 0\\) : avec \\(X = x^2\\), on trouve \\(X = 1\\) ou \\(X = 9\\). Quelle est la plus grande solution \\(x\\) ?", "\\(x^4 + 3x^2 - 4 = 0\\) : combien de solutions réelles \\(x\\) ?"],
      play: guide(["On revient à x : x² = 1 ou x² = 9, donc x = ±1 ou x = ±3", "X² + 3X − 4 = (X − 1)(X + 4) : X = 1 ou X = −4 ; puis x² = X"],
        [W(3, "x² = 9 donne x = 3 ou x = −3, et x² = 1 donne x = 1 ou x = −1 : S = {−3 ; −1 ; 1 ; 3}. La plus grande : 3."),
          W(2, "X = 1 donne x = 1 ou x = −1 ; X = −4 est rejetée, car un carré x² n'est jamais négatif. Deux solutions.")]),
    },
    eqirrmp: {
      predict: { q: "\\(\\sqrt{x + 3} = x - 3\\). En élevant au carré, on trouve \\(x = 1\\) ou \\(x = 6\\). Les solutions de l'équation sont…", choices: ["6 seulement", "1 et 6", "1 seulement"], good: 0,
        why: "On vérifie dans l'équation de départ : x = 6 donne √9 = 3 et 6 − 3 = 3 ✓ ; x = 1 donne √4 = 2, mais 1 − 3 = −2 ✗. Élever au carré a ajouté une solution parasite, 1." },
      defis: ["Résous \\(\\sqrt{2x + 1} = 5\\).", "Résous \\(\\sqrt{x + 7} = x + 1\\) : élève au carré, résous, puis vérifie. Quelle est la solution ?"],
      play: guide(["On élève au carré : 2x + 1 = 25", "x + 7 = (x + 1)² = x² + 2x + 1, donc x² + x − 6 = 0 : x = 2 ou x = −3. Vérifie les deux"],
        [W(12, "2x + 1 = 25, donc x = 12. Vérification : √25 = 5 ✓."),
          W(2, "x = 2 : √9 = 3 et 2 + 1 = 3 ✓. x = −3 : √4 = 2, mais −3 + 1 = −2 ✗ (solution parasite). S = {2}.")]),
    },
    eqratmp: {
      predict: { q: "\\(\\dfrac{x}{x - 2} = \\dfrac{2}{x - 2}\\). Le nombre \\(x = 2\\) est-il solution ?", choices: ["Non : 2 est une valeur interdite", "Oui", "Oui, c'est la seule solution"], good: 0,
        why: "Pour x = 2, le dénominateur x − 2 vaut 0 : les fractions n'existent pas. En multipliant, on trouve x = 2, mais il faut la rejeter : l'équation n'a pas de solution." },
      defis: ["Résous \\(\\dfrac{6}{x - 1} = 3\\).", "Le robinet A remplit un bassin en 6 h. Avec le robinet B, les deux ensemble le remplissent en 4 h. Combien d'heures faut-il au robinet B seul ?"],
      play: guide(["Valeur interdite : 1. On multiplie par (x − 1) : 6 = 3(x − 1)", "En 1 h, A remplit 1/6 du bassin, B en remplit 1/t, ensemble 1/4 : 1/6 + 1/t = 1/4"],
        [W(3, "6 = 3x − 3, donc x = 3 (ce n'est pas la valeur interdite 1). Vérification : 6 ÷ 2 = 3 ✓."),
          W(12, "1/t = 1/4 − 1/6 = 3/12 − 2/12 = 1/12, donc t = 12 h.")]),
    },
    // =============================== MP 3e · B. Puissances et logarithmes ===============================
    puisrat: {
      predict: { q: "\\(8^{\\frac{1}{3}}\\) vaut…", choices: ["2", "8/3", "24"], good: 0,
        why: "L'exposant 1/3 est la racine cubique : 8 puissance 1/3 = ∛8 = 2, car 2³ = 8. Ce n'est ni 8 ÷ 3, ni 8 · 3." },
      defis: ["Calcule \\(16^{\\frac{3}{4}}\\).", "Calcule \\(9^{-\\frac{1}{2}}\\) (fraction acceptée)."],
      play: guide(["16 puissance 3/4 = (racine 4e de 16)³", "L'exposant négatif donne l'inverse : 9 puissance −1/2 = 1 ÷ 9 puissance 1/2 = 1 ÷ √9"],
        [W(8, "La racine 4e de 16 vaut 2 (2⁴ = 16), puis 2³ = 8."),
          W(1 / 3, "√9 = 3, puis l'inverse : 1/3. Un exposant négatif donne un inverse, pas un nombre négatif.")]),
    },
    logdef: {
      predict: { q: "\\(\\log_2 8\\) vaut…", choices: ["3", "4", "16"], good: 0,
        why: "log₂ 8 répond à la question « 2 à quelle puissance donne 8 ? » : 2³ = 8, donc log₂ 8 = 3. (4, c'est 8 ÷ 2 : le logarithme est un exposant.)" },
      defis: ["Calcule \\(\\log_3 81\\).", "Calcule \\(\\log 0{,}001\\) (logarithme en base 10)."],
      play: guide(["3 à quelle puissance donne 81 ?", "0,001 = 1/1000 = 10 à quelle puissance ?"],
        [W(4, "3⁴ = 81, donc log₃ 81 = 4."),
          W(-3, "0,001 = 10⁻³, donc log 0,001 = −3. Un logarithme peut être négatif (mais pas son argument).")]),
    },
    logprop: {
      predict: { q: "\\(\\log 50 + \\log 2\\) vaut…", choices: ["2", "\\(\\log 52\\)", "100"], good: 0,
        why: "log a + log b = log(ab) : log 50 + log 2 = log(50 · 2) = log 100 = 2. La somme des logarithmes est le logarithme du produit, pas de la somme." },
      defis: ["Calcule \\(\\log 8 + 3\\log 5\\) (indice : \\(3\\log 5 = \\log 5^3\\)).", "On sait que \\(\\log 2 \\approx 0{,}301\\). Calcule \\(\\log 16\\) avec cette valeur."],
      play: guide(["3 log 5 = log 125, puis log 8 + log 125 = log(8 · 125)", "16 = 2⁴, donc log 16 = 4 log 2"],
        [W(3, "log 8 + log 125 = log 1000 = 3."),
          W(1.204, "log 16 = 4 · log 2 ≈ 4 · 0,301 = 1,204.")]),
    },
    // =============================== MP 3e · C. Exponentielles et logarithmes ===============================
    eqexp: {
      predict: { q: "\\(2^{x + 1} = 16\\). Que vaut \\(x\\) ?", choices: ["3", "7", "8"], good: 0,
        why: "16 = 2⁴ : les deux membres ont la même base 2, donc les exposants sont égaux : x + 1 = 4 et x = 3." },
      defis: ["Résous \\(3^{2x - 1} = 27\\).", "Résous \\(2^x = 5\\) : \\(x = \\dfrac{\\log 5}{\\log 2}\\). Donne \\(x\\) au centième."],
      play: guide(["27 = 3³ : même base, donc 2x − 1 = 3", "Calculatrice : log 5 ÷ log 2, puis arrondis au centième"],
        [W(2, "2x − 1 = 3, donc x = 2. Vérification : 3³ = 27 ✓."),
          W(2.32, "log 5 ÷ log 2 ≈ 0,699 ÷ 0,301 ≈ 2,32. Vérification : 2 puissance 2,32 ≈ 5 ✓.")]),
    },
    eqlog: {
      predict: { q: "\\(\\log_2(x - 1) = 3\\). Que vaut \\(x\\) ?", choices: ["9", "7", "4"], good: 0,
        why: "log₂ A = 3 signifie A = 2³ = 8 : x − 1 = 8, donc x = 9. Et 9 − 1 = 8 > 0 : x = 9 est dans le domaine." },
      defis: ["Résous \\(\\log(2x + 4) = 2\\).", "Résous \\(\\log x + \\log(x - 3) = 1\\) (domaine : \\(x > 3\\))."],
      play: guide(["log A = 2 signifie A = 10² = 100 : 2x + 4 = 100", "log x + log(x − 3) = log(x(x − 3)) = 1, donc x(x − 3) = 10 : x² − 3x − 10 = 0"],
        [W(48, "2x + 4 = 100, donc x = 48 ; 2 · 48 + 4 = 100 > 0 ✓."),
          W(5, "x² − 3x − 10 = (x − 5)(x + 2) : x = 5 ou x = −2. Le domaine impose x > 3 : seule 5 convient.")]),
    },
    croissexp: {
      predict: { q: "Un prix augmente de 10 % par an pendant 2 ans. Au total, il a augmenté de…", choices: ["21 %", "20 %", "12 %"], good: 0,
        why: "Chaque année, on multiplie par 1,1 : 1,1 · 1,1 = 1,21, soit +21 %. Les pourcentages successifs ne s'additionnent pas." },
      defis: ["Une population de 100 bactéries double toutes les 3 heures. Combien y en a-t-il après 12 heures ?", "Après combien d'heures y en a-t-il 6'400 ?"],
      play: guide(["En 12 heures, la population double 12 ÷ 3 = 4 fois : 100 · 2⁴", "100 · 2 puissance (t ÷ 3) = 6'400, donc 2 puissance (t ÷ 3) = 64 = 2⁶"],
        [W(1600, "12 ÷ 3 = 4 doublements : 100 · 2⁴ = 100 · 16 = 1'600 bactéries."),
          W(18, "t ÷ 3 = 6, donc t = 18 heures.")]),
    },
    // =============================== MP 3e · D. Volumes et similitude ===============================
    volmp: {
      predict: { q: "Un cône et un cylindre ont la même base et la même hauteur. Le volume du cône est…", choices: ["le tiers de celui du cylindre", "la moitié de celui du cylindre", "le même"], good: 0,
        why: "Cylindre : A_base · h ; cône : A_base · h ÷ 3. Il faut trois cônes pleins pour remplir le cylindre." },
      defis: ["Cylindre de rayon 2 cm et de hauteur 5 cm. Son volume vaut k · π cm³ : que vaut k ?", "Un cône a un volume de 12π cm³ et un rayon de 3 cm. Quelle est sa hauteur (en cm) ?"],
      play: guide(["V = π · r² · h = π · 2² · 5", "V = π · r² · h ÷ 3 = π · 9 · h ÷ 3 = 3π · h"],
        [W(20, "π · 4 · 5 = 20π ≈ 62,83 cm³."),
          W(4, "3π · h = 12π, donc h = 4 cm.")]),
    },
    // =============================== MP 4e · E–G. Coordonnées, vecteurs, droites ===============================
    coordmp: {
      predict: { q: "Distance entre \\(A(1 \\,;\\, 2)\\) et \\(B(4 \\,;\\, 6)\\) ?", choices: ["5", "7", "25"], good: 0,
        why: "On applique Pythagore aux écarts : Δx = 3, Δy = 4, AB = √(3² + 4²) = √25 = 5. (7 = 3 + 4 et 25 = AB².)" },
      defis: ["Milieu de \\(A(-2 \\,;\\, 5)\\) et \\(B(6 \\,;\\, 1)\\) : quelle est son abscisse ?", "Le point de coordonnées polaires \\((6 \\,;\\, 60°)\\) : que vaut son abscisse \\(x = r\\cos\\theta\\) ?"],
      play: guide(["Abscisse du milieu = moyenne des abscisses : (−2 + 6) ÷ 2", "x = 6 · cos 60° et cos 60° = 0,5"],
        [W(2, "(−2 + 6) ÷ 2 = 2 ; ordonnée (5 + 1) ÷ 2 = 3 : milieu (2 ; 3)."),
          W(3, "x = 6 · 0,5 = 3 ; et y = 6 · sin 60° ≈ 5,2.")]),
    },
    scalmp: {
      predict: { q: "\\(\\vec{u} = (2 \\,;\\, 1)\\) et \\(\\vec{v} = (-1 \\,;\\, 2)\\). Le produit scalaire \\(\\vec{u} \\cdot \\vec{v}\\) vaut…", choices: ["0", "4", "(−2 ; 2)"], good: 0,
        why: "x avec x, y avec y, puis on additionne : 2 · (−1) + 1 · 2 = 0. Les vecteurs sont orthogonaux. Le produit scalaire est un nombre, pas un vecteur." },
      defis: ["\\(\\vec{u} = (6 \\,;\\, k)\\) et \\(\\vec{v} = (2 \\,;\\, -3)\\) sont orthogonaux. Que vaut \\(k\\) ?", "\\(\\vec{u} = (2 \\,;\\, 1)\\), \\(\\vec{v} = (1 \\,;\\, 3)\\). Angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\), en degrés ?"],
      play: guide(["Orthogonaux : produit scalaire nul, 6 · 2 + k · (−3) = 0", "u · v = 5, ‖u‖ = √5, ‖v‖ = √10 : cos α = 5 ÷ (√5 · √10) = 5 ÷ √50"],
        [W(4, "12 − 3k = 0, donc k = 4."),
          W(45, "cos α = 5 ÷ √50 ≈ 0,707, donc α = 45°.")]),
    },
    // =============================== MP 4e · H–J. Inéquations, fonctions ===============================
    ineqmp: {
      predict: { q: "\\(-2x > 6\\). Laquelle est juste ?", choices: ["\\(x < -3\\)", "\\(x > -3\\)", "\\(x > 3\\)"], good: 0,
        why: "On divise par −2, un nombre négatif : le sens de l'inégalité se retourne, x < −3. Vérifie avec x = −4 : −2 · (−4) = 8 > 6 ✓." },
      defis: ["Quel est le plus grand nombre entier \\(x\\) tel que \\(5 - 3x \\ge 17\\) ?", "\\((x - 1)(x + 4) < 0\\) : combien de nombres entiers sont solutions ?"],
      play: guide(["5 − 3x ≥ 17 ⟺ −3x ≥ 12 : on divise par −3, le sens se retourne", "Zéros des facteurs : 1 et −4. Tableau des signes : le produit est négatif entre les deux zéros"],
        [W(-4, "−3x ≥ 12 ⟺ x ≤ −4 : le plus grand entier est −4 (5 + 12 = 17 ✓)."),
          W(4, "S = ]−4 ; 1[ (crochets ouverts, car l'inégalité est stricte) : les entiers −3, −2, −1 et 0, soit 4 nombres.")]),
    },
    fctmp: {
      predict: { q: "Le graphe de \\(f(x - 2)\\) est celui de \\(f\\), décalé…", choices: ["de 2 vers la droite", "de 2 vers la gauche", "de 2 vers le haut"], good: 0,
        why: "f(x − 2) prend en x la valeur que f prenait en x − 2 : tout arrive 2 unités plus tard, donc plus à droite. (Vers le haut, ce serait f(x) + 2.)" },
      defis: ["\\(f(x) = 2x + 6\\). Que vaut \\(f^{-1}(10)\\) ?", "\\(f(x) = x^2\\) et \\(g(x) = x + 3\\). Que vaut \\((f \\circ g)(1)\\) ?"],
      play: guide(["f⁻¹(10) est le nombre dont l'image par f vaut 10 : 2x + 6 = 10", "(f ∘ g)(1) = f(g(1)) : on applique d'abord g, puis f"],
        [W(2, "2x + 6 = 10, donc x = 2. En effet, f(2) = 10, donc f⁻¹(10) = 2."),
          W(16, "g(1) = 4, puis f(4) = 16. (Dans l'autre ordre, (g ∘ f)(1) = 4 : l'ordre compte.)")]),
    },
    polymp: {
      predict: { q: "\\(P(x) = x^3 - 2x^2 - 5x + 6\\). Que vaut \\(P(1)\\) ?", choices: ["0", "6", "−2"], good: 0,
        why: "P(1) = 1 − 2 − 5 + 6 = 0 : 1 est un zéro de P, donc P est divisible par (x − 1)." },
      defis: ["Quel est le reste de la division de \\(P(x) = x^3 + 2x^2 - 5\\) par \\((x - 2)\\) ?", "\\(x^3 - 7x + 6 = (x - 1)(x^2 + x - 6)\\). Quel est le plus petit zéro ?"],
      play: guide(["Théorème du reste : le reste de la division par (x − 2) vaut P(2)", "Factorise x² + x − 6 : deux nombres de produit −6 et de somme 1"],
        [W(11, "P(2) = 8 + 8 − 5 = 11 : c'est le reste (2 n'est donc pas un zéro)."),
          W(-3, "x² + x − 6 = (x + 3)(x − 2) : les zéros sont 1, 2 et −3. Le plus petit : −3.")]),
    },
    explogfn: {
      predict: { q: "\\(f(x) = 3 \\cdot 2^x\\). Quand \\(x\\) augmente de 1, \\(f(x)\\) est…", choices: ["multiplié par 2", "augmenté de 2", "multiplié par 3"], good: 0,
        why: "f(x + 1) = 3 · 2 puissance (x + 1) = 2 · f(x) : la base b = 2 est le facteur multiplicatif. Le 3 est la valeur de départ, f(0)." },
      defis: ["\\(f(x) = a \\cdot b^x\\) passe par \\((0 \\,;\\, 5)\\) et \\((1 \\,;\\, 15)\\). Que vaut \\(b\\) ?", "\\(g(x) = \\log_2(x - 3)\\). Quel est son zéro ?"],
      play: guide(["f(0) = a = 5, puis f(1) = 5 · b = 15", "g(x) = 0 ⟺ log₂(x − 3) = 0 ⟺ x − 3 = 2⁰ = 1"],
        [W(3, "a = 5 et 5b = 15, donc b = 3, et f(x) = 5 · 3 puissance x."),
          W(4, "x − 3 = 1, donc x = 4. (Domaine de g : x > 3.)")]),
    },
  });

  // =============================== Essaie sur la figure ===============================
  // Droite paramétrique x = −3 + 2t, y = 4 − t dans un repère ; le t proposé place le point M(t).
  {
    const XR = [-4, 7], YR = [-2, 5], U = 25, ml = 20, mt = 12, X = (v) => ml + (v - XR[0]) * U, Y = (v) => mt + (YR[1] - v) * U, Wd = 2 * ml + (XR[1] - XR[0]) * U, Hd = mt + 14 + (YR[1] - YR[0]) * U;
    const P = (t) => [-3 + 2 * t, 4 - t];
    const fig = (s, t) => {
      let g = "";
      for (let v = XR[0]; v <= XR[1]; v++) g += L(X(v), Y(YR[0]), X(v), Y(YR[1]), v ? "f-grid" : "f-line", v ? 0.7 : 1.2);
      for (let v = YR[0]; v <= YR[1]; v++) g += L(X(XR[0]), Y(v), X(XR[1]), Y(v), v ? "f-grid" : "f-line", v ? 0.7 : 1.2);
      g += T(X(1), Y(0) + 12, "1", "middle", 9) + T(X(0) - 4, Y(1) + 3, "1", "end", 9);
      g += `<defs><clipPath id="dp-clip"><rect x="${X(XR[0])}" y="${Y(YR[1])}" width="${X(XR[1]) - X(XR[0])}" height="${Y(YR[0]) - Y(YR[1])}"/></clipPath></defs>`;
      const a = P(-1), b = P(7); g += `<g clip-path="url(#dp-clip)">${L(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), "f-accent", 2.2)}</g>` + T(X(-3) + 6, Y(4) - 6, "A (t = 0)", "start", 10);
      g += `<circle cx="${X(-3)}" cy="${Y(4)}" r="3.5" class="f-dot"/>` + L(X(-3), Y(4), X(-1), Y(3), "f-blue", 2.4) + T(X(-1) + 2, Y(3) - 6, "d = (2 ; −1)", "start", 10, "f-txt f-blue");
      if (s === 0) g += `<circle cx="${X(3)}" cy="${Y(1)}" r="4" fill="none" stroke="var(--ink)" stroke-width="1.6"/>` + T(X(3) + 6, Y(1) - 6, "P(3 ; 1)", "start", 11);
      let out = "";
      if (t !== null) {
        const [mx, my] = P(t), inside = mx >= XR[0] && mx <= XR[1] && my >= YR[0] && my <= YR[1];
        if (inside) g += `<circle cx="${X(mx)}" cy="${Y(my)}" r="5" class="f-accent"/>` + T(X(mx), Y(my) + 16, "M", "middle", 11, "f-txt f-accent");
        out = plain(`t = ${nb(t)} : M(−3 + 2 · ${nb(t)} ; 4 − ${nb(t)}) = <b>M(${nb(mx)} ; ${nb(my)})</b>` + (inside ? "" : " (hors du dessin)"));
      }
      return svg(Wd, Hd, g, "droite paramétrique dans un repère") + out;
    };
    ACTIVE.droiteparam = {
      predict: { q: "La droite \\(x = 1 + 2t\\), \\(y = 3 - t\\). Pour \\(t = 2\\), on obtient le point…", choices: ["(5 ; 1)", "(3 ; 2)", "(2 ; 2)"], good: 0,
        why: "On remplace t par 2 dans les deux coordonnées : x = 1 + 2 · 2 = 5 et y = 3 − 2 = 1. (Le point (3 ; 2), c'est t = 1.)" },
      defis: ["La droite d : x = −3 + 2t, y = 4 − t. Quelle valeur de t donne le point P(3 ; 1) ?", "Pour quel t la droite d coupe-t-elle l'axe des x (y = 0) ?", "Pour quel t coupe-t-elle l'axe des y (x = 0) ?"],
      play: hunt({ ask: true, label: "t =", blank: (s) => fig(s, null), show: (t, s) => fig(s, t),
        wins: [W(3, "x : −3 + 2t = 3 donne t = 3 ; y : 4 − 3 = 1 ✓. Le même t convient pour les deux coordonnées : P est sur d."),
          W(4, "y = 0 ⟺ 4 − t = 0 ⟺ t = 4 ; alors x = −3 + 8 = 5 : d coupe l'axe des x en (5 ; 0)."),
          W(1.5, "x = 0 ⟺ −3 + 2t = 0 ⟺ t = 1,5 ; alors y = 4 − 1,5 = 2,5 : d coupe l'axe des y en (0 ; 2,5).")] }),
    };
  }
  // Marée h(t) = 2,5 sin(π/6 · (t − 2)) + 3,5 sur 24 heures ; la réponse tapée se dessine sur le graphique.
  {
    const ml = 30, mb = 22, W0 = 320, H0 = 200, X = (t) => ml + (t / 24) * (W0 - ml - 10), Y = (v) => H0 - mb - (v / 7) * (H0 - mb - 10);
    const h = (t) => 2.5 * Math.sin((Math.PI / 6) * (t - 2)) + 3.5;
    const fig = (s, x) => {
      let g = "";
      for (let t = 0; t <= 24; t += 2) g += L(X(t), Y(0), X(t), Y(7), "f-grid", 0.7) + (t % 4 ? "" : T(X(t), Y(0) + 14, String(t), "middle", 9));
      for (let v = 0; v <= 7; v++) g += L(X(0), Y(v), X(24), Y(v), "f-grid", 0.7) + T(X(0) - 4, Y(v) + 3, String(v), "end", 9);
      g += L(X(0), Y(0), X(24), Y(0), "f-line", 1.2) + L(X(0), Y(0), X(0), Y(7), "f-line", 1.2) + T(X(24), Y(0) - 4, "t (h)", "end", 9) + T(X(0) + 4, Y(7) + 9, "h (m)", "start", 9);
      let p = ""; for (let i = 0; i <= 96; i++) { const t = i / 4; p += (i ? " L" : "M") + X(t).toFixed(1) + "," + Y(h(t)).toFixed(1); }
      g += `<path d="${p}" class="f-accent" fill="none" stroke-width="2.2"/>`;
      let out = "";
      if (x !== null) {
        if (s === 0) { if (x >= 0 && x <= 7) g += L(X(0), Y(x), X(24), Y(x), "f-blue", 1.6) + T(X(24) - 2, Y(x) - 4, "h = " + nb(x), "end", 10, "f-txt f-blue");
          out = plain(`Hauteur ${nb(x)} m : ` + (Math.abs(x - 6) < 1e-9 ? '<b class="act-ok">la ligne touche juste les sommets</b>' : x > 6 ? "la courbe ne monte jamais si haut" : "la courbe passe au-dessus de cette ligne")); }
        else if (s === 1) { const e = 2 + x; if (x > 0 && e <= 24) g += L(X(2), Y(3.5), X(e), Y(3.5), "f-blue", 2.4) + `<circle cx="${X(2)}" cy="${Y(3.5)}" r="4" class="f-dot"/><circle cx="${X(e)}" cy="${Y(3.5)}" r="4" class="f-dot"/>`;
          out = plain(`De t = 2 à t = ${nb(e)} : h(2) = 3,5 m, h(${nb(e)}) ≈ ${nb(Math.round(h(e) * 100) / 100)} m` + (Math.abs(x - 12) < 1e-9 ? ' <b class="act-ok">la courbe recommence exactement</b>' : "")); }
        else { if (x >= 0 && x <= 24) g += L(X(x), Y(0), X(x), Y(7), "f-blue", 1.6) + `<circle cx="${X(x)}" cy="${Y(h(x))}" r="4.5" class="f-dot"/>`;
          out = plain(`t = ${nb(x)} h : h ≈ ${nb(Math.round(h(x) * 100) / 100)} m`); }
      }
      return svg(W0, H0, g, "courbe de la marée sur 24 heures") + out;
    };
    ACTIVE.sinusmp = {
      predict: { q: "\\(f(x) = 3\\sin x + 2\\). La plus grande valeur de \\(f\\) est…", choices: ["5", "3", "6"], good: 0,
        why: "sin x est entre −1 et 1, donc 3 sin x est entre −3 et 3 : f est entre 2 − 3 = −1 et 2 + 3 = 5. Amplitude 3, axe y = 2." },
      defis: ["Marée : h(t) = 2,5 sin(π/6 · (t − 2)) + 3,5 (h en m, t en heures). Hauteur maximale de l'eau ?", "Période de la marée, en heures (période = 2π ÷ b) ?", "À quel instant (t > 0) a lieu la première marée haute ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => fig(s, null), show: (x, s) => fig(s, x),
        wins: [W(6, "Axe y = 3,5, amplitude 2,5 : maximum 3,5 + 2,5 = 6 m (et minimum 3,5 − 2,5 = 1 m)."),
          W(12, "b = π/6 : période 2π ÷ (π/6) = 12 heures. Deux marées hautes par jour."),
          W(5, "En t = 2 (le déphasage), la courbe coupe l'axe en montant ; le sommet arrive un quart de période plus tard : 2 + 12 ÷ 4 = 5 h.")] }),
    };
  }

  // =============================== Manipule (manipLesson) ===============================
  if (typeof manipLesson === "undefined") return;

  // ---- Valeur absolue : le point qu'on promène sur la droite graduée (distance au centre) ----
  {
    const X = (v) => 160 + v * 14, LY = 108;
    const E = [{ c: 3, d: 5, txt: "|x − 3| = 5" }, { c: 3, d: 5, txt: "|x − 3| = 5" }, { c: -2, d: 4, txt: "|x + 2| = 4" }];
    const ex = (x, c) => "|" + n0(x) + (c < 0 ? " + " + -c : " − " + c) + "| = |" + n0(x - c) + "| = " + Math.abs(x - c);
    ACTIVE.eqabs = {
      predict: { q: "Combien de solutions a l'équation \\(|x - 1| = 4\\) ?", choices: ["2", "1", "aucune"], good: 0,
        why: "|x − 1| est la distance entre x et 1. Deux nombres sont à distance 4 de 1 : 5 (à droite) et −3 (à gauche)." },
      defis: ["|x − 3| est la distance entre x et 3. Glisse le point x pour que cette distance vaille 5.", "Trouve l'autre solution de |x − 3| = 5.", "|x + 2| = |x − (−2)| est la distance entre x et −2. Place x sur une solution de |x + 2| = 4."],
      play: manipLesson({ W: 320, H: 150, aria: "droite graduée avec un point à placer",
        note: "Glisse le point rouge le long de la droite (ou flèches du clavier). On vérifie quand tu le lâches.",
        init: (s, prev) => ({ x: s === 1 && prev ? prev.x : 0, first: s === 1 && prev ? prev.x : null }),
        handles: (st) => [{ x: X(st.x), y: LY, label: "point x = " + n0(st.x), role: "slider", svg: dot("var(--margin)", "x"), R: 24 }],
        move: (st, k, p) => { st.x = clamp(Math.round((p.x - 160) / 14), -10, 10); },
        nudge: (st, k, dx, dy) => { st.x = clamp(st.x + dx + dy, -10, 10); },
        draw: (st, s) => { const c = E[s].c; let g = Tx(8, 18, E[s].txt, "start", 15, ' font-weight="700"') + `<line x1="8" y1="${LY}" x2="312" y2="${LY}" stroke="var(--ink)" stroke-width="1.5"/>`;
          for (let v = -10; v <= 10; v++) g += `<line x1="${X(v)}" y1="${LY - (v % 5 ? 4 : 7)}" x2="${X(v)}" y2="${LY + (v % 5 ? 4 : 7)}" stroke="var(--ink)"/>` + (v % 2 === 0 && v !== c ? T(X(v), LY + 22, n0(v), "middle", 10) : "");
          g += `<circle cx="${X(c)}" cy="${LY}" r="5" fill="var(--ink)"/>` + Tx(X(c), LY + 22, n0(c), "middle", 11, ' font-weight="800"');
          if (st.first !== null && st.first !== undefined) g += `<circle cx="${X(st.first)}" cy="${LY}" r="6" fill="var(--ok)" opacity=".7"/>` + Tx(X(st.first), LY + 36, "trouvé", "middle", 9, ' fill="var(--ok)"');
          const d = Math.abs(st.x - c);
          if (d) g += `<line x1="${X(c)}" y1="${LY - 30}" x2="${X(st.x)}" y2="${LY - 30}" stroke="var(--blue)" stroke-width="3"/><line x1="${X(c)}" y1="${LY - 36}" x2="${X(c)}" y2="${LY - 24}" stroke="var(--blue)" stroke-width="2"/><line x1="${X(st.x)}" y1="${LY - 36}" x2="${X(st.x)}" y2="${LY - 24}" stroke="var(--blue)" stroke-width="2"/>` + Tx((X(c) + X(st.x)) / 2, LY - 38, "distance " + d, "middle", 12, ' font-weight="700" fill="var(--blue)"');
          return g; },
        out: (st, s) => `x = ${n0(st.x)} : <b>${ex(st.x, E[s].c)}</b>`,
        hint: (st, s) => { const { c, d } = E[s];
          if (s === 1 && st.x === st.first) return "C'est la solution déjà trouvée : cherche de l'autre côté de 3.";
          if (s === 2 && Math.abs(st.x - 2) === d && Math.abs(st.x - c) !== d) return "Attention : |x + 2| mesure la distance à −2, pas à 2.";
          const e = Math.abs(st.x - c); return e === d ? "" : "La distance vaut " + e + " : il faut " + d + "."; },
        goal: [(st) => (Math.abs(st.x - 3) === 5 ? "x = " + n0(st.x) + " est à distance 5 de 3 : " + ex(st.x, 3) + ". Il y a une autre solution, de l'autre côté de 3." : ""),
          (st) => (Math.abs(st.x - 3) === 5 && st.x !== st.first ? "Les deux solutions : x = −2 et x = 8, de part et d'autre de 3. Par le calcul : x − 3 = 5 ou x − 3 = −5." : ""),
          (st) => (Math.abs(st.x + 2) === 4 ? "|x + 2| = 4 : x = 2 ou x = −6, à distance 4 de −2. Par le calcul : x + 2 = 4 ou x + 2 = −4." : "")],
        ask: [null, { q: "Sans la droite : combien de solutions a |x + 4| = −2 ?", ans: 0, ok: "Aucune : une valeur absolue est une distance, elle n'est jamais négative.", no: "Une distance peut-elle valoir −2 ?" },
          { q: "Sans la droite : quelle est la plus petite solution de |2x − 1| = 7 ?", ans: -3, ok: "2x − 1 = 7 ou 2x − 1 = −7 : x = 4 ou x = −3. La plus petite : −3.", no: "Écris les deux cas : 2x − 1 = 7 ou 2x − 1 = −7." }] }),
    };
  }

  // ---- Similitude : le niveau du liquide dans un verre conique (volume × k³) ----
  {
    const AX = 120, AY = 232, HP = 200, RP = 92, HC = 12, VF = 640, px = HP / HC;
    const vol = (h) => VF * Math.pow(h / HC, 3);
    const r1 = (v) => nb(Math.round(v * 10) / 10);
    const TG = [80, 270, 10];
    ACTIVE.similmp = {
      predict: { q: "Un verre conique est rempli jusqu'à la moitié de sa hauteur. Il contient…", choices: ["la moitié de son volume", "le quart de son volume", "le huitième de son volume"], good: 2,
        why: "Le liquide forme un petit cône semblable au verre, de rapport k = 1/2 : les longueurs sont divisées par 2, le volume par 2³ = 8." },
      defis: ["Le verre plein (12 cm de haut) contient 640 mL. Tire la surface du liquide pour qu'il contienne 80 mL.", "Remplis-le pour qu'il contienne 270 mL.", "Et pour qu'il ne contienne que 10 mL."],
      play: manipLesson({ W: 320, H: 250, aria: "verre conique avec un niveau de liquide à régler",
        note: "Glisse la poignée rouge le long de la règle : le niveau du liquide suit. On vérifie quand tu la lâches.",
        init: (s, prev) => ({ h: prev ? prev.h : 12 }),
        handles: (st) => [{ x: 262, y: AY - st.h * px, label: "niveau du liquide, " + nb(st.h) + " cm", role: "slider", svg: dot("var(--margin)", ""), R: 24 }],
        move: (st, k, p) => { st.h = clamp(Math.round(((AY - p.y) / px) * 2) / 2, 0.5, 12); },
        nudge: (st, k, dx, dy) => { st.h = clamp(st.h + 0.5 * (dx + dy), 0.5, 12); },
        draw: (st) => { const yl = AY - st.h * px, w = (RP * st.h) / HC;
          let g = `<polygon points="${AX},${AY} ${AX - w},${yl} ${AX + w},${yl}" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.5"/>`;
          g += `<polyline points="${AX - RP},${AY - HP} ${AX},${AY} ${AX + RP},${AY - HP}" fill="none" stroke="var(--ink)" stroke-width="2"/>` + L(AX - RP, AY - HP, AX + RP, AY - HP, "f-line", 1);
          g += `<line x1="${AX + w}" y1="${yl}" x2="262" y2="${yl}" stroke="var(--margin)" stroke-dasharray="4 3"/>` + `<line x1="248" y1="${AY}" x2="248" y2="${AY - HP}" stroke="var(--ink)" stroke-width="1.5"/>`;
          for (let c = 0; c <= HC; c++) g += `<line x1="${c % 2 ? 244 : 240}" y1="${AY - c * px}" x2="248" y2="${AY - c * px}" stroke="var(--ink)"/>` + (c % 2 ? "" : T(236, AY - c * px + 4, String(c), "end", 9));
          g += T(248, AY + 14, "cm", "middle", 9) + Tx(AX, AY - HP - 6, "plein : 640 mL", "middle", 11, ' fill="var(--ink-soft)"');
          return g; },
        out: (st) => { const k = st.h / HC; return `h = ${nb(st.h)} cm : k = ${nb(st.h)} ÷ 12 ≈ ${nb(Math.round(k * 1000) / 1000)} ; volume = k³ · 640 ≈ <b>${r1(vol(st.h))} mL</b>`; },
        hint: (st, s) => { const v = vol(st.h), t = TG[s];
          if (s === 0 && st.h === 1.5) return "Hauteur divisée par 8 : le volume est divisé par bien plus. Le volume suit k³, pas k.";
          return Math.abs(v - t) < 1e-9 ? "" : v < t ? "Pas assez : monte le niveau." : "Trop : baisse le niveau."; },
        goal: [(st) => (st.h === 6 ? "h = 6 cm : k = 0,5 et 0,5³ = 0,125, soit 640 ÷ 8 = 80 mL. À mi-hauteur, le verre n'est rempli qu'au huitième !" : ""),
          (st) => (st.h === 9 ? "h = 9 cm : k = 0,75 et 0,75³ = 0,421875 : 0,421875 · 640 = 270 mL. Aux trois quarts de la hauteur, moins de la moitié du volume." : ""),
          (st) => (st.h === 3 ? "h = 3 cm : k = 0,25 et 0,25³ = 1/64 : 640 ÷ 64 = 10 mL." : "")],
        ask: [{ q: "Sans la figure : un verre conique de 10 cm, rempli jusqu'à 5 cm, contient 30 mL. Combien contient-il plein (en mL) ?", ans: 240, ok: "k = 0,5, le volume est divisé par 8 : plein, il contient 8 · 30 = 240 mL.", no: "Le liquide est un cône de rapport 1/2 : son volume est 2³ = 8 fois plus petit que le verre plein." }, null,
          { q: "Sans la figure : jusqu'à quelle hauteur (au dixième de cm) faut-il remplir ce verre de 12 cm pour qu'il soit à moitié plein ?", ans: 9.5, ok: "k³ = 0,5, donc k = ∛0,5 ≈ 0,794 et h ≈ 0,794 · 12 ≈ 9,5 cm.", no: "Le volume est multiplié par k³ = 0,5 : calcule k = ∛0,5, puis h = 12k." }] }),
    };
  }

  // ---- Vecteurs : la flèche qu'on tire sur le quadrillage ----
  {
    const U = 26, XR = [-1, 9], YR = [-3, 6], OX = 22 + U, OY = 18 + 6 * U, X = (x) => OX + x * U, Y = (y) => OY - y * U;
    const Wd = X(XR[1]) + 18, Hd = Y(YR[0]) + 14;
    const P3 = { A: [0, 0], B: [5, 1], C: [7, 4] };
    const arrow = (P, Q, col) => { const x1 = X(P[0]), y1 = Y(P[1]), x2 = X(Q[0]), y2 = Y(Q[1]), l = Math.hypot(x2 - x1, y2 - y1); if (l < 1) return ""; const ux = (x2 - x1) / l, uy = (y2 - y1) / l;
      return `<line x1="${x1}" y1="${y1}" x2="${(x2 - ux * 9).toFixed(1)}" y2="${(y2 - uy * 9).toFixed(1)}" stroke="${col}" stroke-width="3"/><path d="M${x2},${y2} L${(x2 - ux * 12 - uy * 6).toFixed(1)},${(y2 - uy * 12 + ux * 6).toFixed(1)} L${(x2 - ux * 12 + uy * 6).toFixed(1)},${(y2 - uy * 12 - ux * 6).toFixed(1)} Z" fill="${col}"/>`; };
    const pt = (P, lab, col = "var(--ink)") => `<circle cx="${X(P[0])}" cy="${Y(P[1])}" r="4.5" fill="${col}"/>` + Tx(X(P[0]) - 7, Y(P[1]) - 7, lab, "end", 13, ' font-weight="700"');
    const cp = (v) => "(" + n0(v[0]) + " ; " + n0(v[1]) + ")";
    const norm = (v) => { const q = v[0] * v[0] + v[1] * v[1], r = Math.sqrt(q); return Number.isInteger(r) ? String(r) : "√" + q + " ≈ " + nb(Math.round(r * 100) / 100); };
    ACTIVE.vectmp = {
      predict: { q: "\\(A(1 \\,;\\, 2)\\) et \\(B(4 \\,;\\, 6)\\). Les composantes du vecteur \\(\\overrightarrow{AB}\\) sont…", choices: ["(3 ; 4)", "(−3 ; −4)", "(5 ; 8)"], good: 0,
        why: "AB = B − A, arrivée moins départ : (4 − 1 ; 6 − 2) = (3 ; 4). Pour aller de A à B : 3 vers la droite, 4 vers le haut." },
      defis: ["A(1 ; 1) est fixe. Glisse la pointe B pour que le vecteur AB ait les composantes (3 ; −2).", "Place B pour que la norme de AB vaille 5, sans aller tout droit (deux composantes non nulles).", "Voici A(0 ; 0), B(5 ; 1) et C(7 ; 4). Place D pour que ABCD soit un parallélogramme."],
      play: manipLesson({ W: Wd, H: Hd, aria: "quadrillage avec un vecteur à régler",
        note: (st, s) => (s === 2 ? "Glisse le point D (ou flèches du clavier)." : "Glisse la pointe B de la flèche (ou flèches du clavier). On vérifie quand tu la lâches."),
        init: (s) => (s === 2 ? { D: [1, 5] } : { B: s === 0 ? [5, 3] : [3, 2] }),
        handles: (st, s) => { const P = s === 2 ? st.D : st.B; return [{ x: X(P[0]), y: Y(P[1]), label: (s === 2 ? "point D " : "pointe B ") + cp(P), svg: dot("var(--margin)", s === 2 ? "D" : "B") }]; },
        move: (st, k, p, s) => { const q = [clamp(Math.round((p.x - OX) / U), XR[0], XR[1]), clamp(Math.round((OY - p.y) / U), YR[0], YR[1])]; if (s === 2) st.D = q; else st.B = q; },
        nudge: (st, k, dx, dy, s) => { const P = s === 2 ? st.D : st.B, q = [clamp(P[0] + dx, XR[0], XR[1]), clamp(P[1] + dy, YR[0], YR[1])]; if (s === 2) st.D = q; else st.B = q; },
        draw: (st, s) => { let g = "";
          for (let x = XR[0]; x <= XR[1]; x++) g += L(X(x), Y(YR[0]), X(x), Y(YR[1]), x ? "f-grid" : "f-line", x ? 0.7 : 1.3);
          for (let y = YR[0]; y <= YR[1]; y++) g += L(X(XR[0]), Y(y), X(XR[1]), Y(y), y ? "f-grid" : "f-line", y ? 0.7 : 1.3);
          g += T(X(1), Y(0) + 12, "1", "middle", 9) + T(X(0) - 4, Y(1) + 3, "1", "end", 9);
          if (s < 2) return g + arrow([1, 1], st.B, "var(--blue)") + pt([1, 1], "A");
          const { A, B, C } = P3, D = st.D;
          g += `<polygon points="${[A, B, C, D].map((P) => X(P[0]) + "," + Y(P[1])).join(" ")}" fill="var(--blue-soft)" stroke="var(--ink-soft)" stroke-dasharray="4 3"/>`;
          return g + arrow(B, C, "var(--blue)") + arrow(A, D, "var(--margin)") + pt(A, "A") + pt(B, "B") + pt(C, "C"); },
        out: (st, s) => { if (s < 2) { const v = [st.B[0] - 1, st.B[1] - 1]; return `AB = B − A = (${n0(st.B[0])} − 1 ; ${n0(st.B[1])} − 1) = <b>${cp(v)}</b> · norme ‖AB‖ = ${norm(v)}`; }
          const { A, B, C } = P3, bc = [C[0] - B[0], C[1] - B[1]], ad = [st.D[0] - A[0], st.D[1] - A[1]];
          return `<span style="color:var(--blue)">BC = C − B = <b>${cp(bc)}</b></span><br><span style="color:var(--margin)">AD = D − A = <b>${cp(ad)}</b></span>` + (ad[0] === bc[0] && ad[1] === bc[1] ? ' <b class="act-ok">✓ mêmes composantes</b>' : ""); },
        hint: (st, s) => { if (s === 0) { const v = [st.B[0] - 1, st.B[1] - 1]; return v[0] === -3 && v[1] === 2 ? "C'est A − B : le vecteur AB va de A vers B, arrivée moins départ." : ""; }
          if (s === 1) { const v = [st.B[0] - 1, st.B[1] - 1]; return v[0] * v[0] + v[1] * v[1] === 25 && !(v[0] && v[1]) ? "Bien, mais tout droit : cherche avec deux composantes non nulles (pense au triangle 3, 4, 5)." : ""; }
          return "AD doit avoir les mêmes composantes que BC."; },
        goal: [(st) => (st.B[0] === 4 && st.B[1] === -1 ? "AB = (3 ; −2) : depuis A, 3 vers la droite et 2 vers le bas. B = A + (3 ; −2) = (4 ; −1)." : ""),
          (st) => { const v = [st.B[0] - 1, st.B[1] - 1]; return v[0] && v[1] && v[0] * v[0] + v[1] * v[1] === 25 ? "‖AB‖ = √(" + v[0] * v[0] + " + " + v[1] * v[1] + ") = √25 = 5 : c'est Pythagore sur les composantes " + cp(v) + "." : ""; },
          (st) => (st.D[0] === 2 && st.D[1] === 3 ? "AD = BC = (2 ; 3) : [AD] et [BC] sont parallèles et de même longueur, ABCD est un parallélogramme. D = A + BC = (2 ; 3)." : "")],
        ask: [null, { q: "Sans la figure : quelle est la norme du vecteur (6 ; −8) ?", ans: 10, ok: "√(36 + 64) = √100 = 10.", no: "Norme = √(x² + y²)." },
          { q: "Sans la figure : A(2 ; 1), B(5 ; 3) et C(6 ; 7). Quelle est l'ordonnée de D pour que ABCD soit un parallélogramme ?", ans: 5, ok: "BC = (1 ; 4), donc D = A + BC = (3 ; 5) : ordonnée 5.", no: "Il faut AD = BC = C − B, puis D = A + BC." }] }),
    };
  }
})();
