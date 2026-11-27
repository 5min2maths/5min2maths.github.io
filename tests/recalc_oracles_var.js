/* Recalcul indépendant des formes ajoutées le 27.11 (agent variete, src/variantes.js § « 27.11 : variété ») : une règle
   par forme (ctx « v27-… »). Chargé après tests/recalc_oracles.js (RECALC) par les pages recalcul*.html et par
   tests/variete_niveaux.html (qui exige que chaque forme v27 soit reconnue). Chaque règle relit les nombres du texte que
   l'élève voit (et du TeX pour les vecteurs), refait le calcul par une autre voie (comptage, recherche sur la grille,
   coordonnées, intersection de droites) et rend la valeur ou le couple attendu. Règles placées EN TÊTE de RECALC.RULES,
   réservées aux notions nommées. Les équations (« Résous … ») sont recalculées par l'oracle générique. */
const RECALC_VAR = (() => {
  const nn = (s) => +String(s).replace(/[\s'’]/g, "").replace(",", ".").replace(/[−–]/g, "-");
  const Z = "(-?\\d+)", PT = (n) => n + "\\(" + Z + " ; " + Z + "\\)";
  const rules = [];
  /* ids, regex sur le texte lisible, f(groupes (chaînes), texte, item) → nombre, { pair } ou null */
  const R = (ids, re, f) => rules.push({ ids: new Set(ids.split(" ")), re, f: (txt, x) => { const m = re.exec(txt); return m ? f(m.slice(1), txt, x) : null; }, o: { text: true } });
  const grid = (ok) => { for (let x = -60; x <= 60; x++) for (let y = -60; y <= 60; y++) if (ok(x, y)) return { pair: [x, y] }; return null; };
  const vecTeX = (raw) => { const m = /\\begin\{pmatrix\} (-?\d+) \\\\ (-?\d+) \\end\{pmatrix\}/.exec(raw); return m ? [+m[1], +m[2]] : null; };
  const ptTeX = (raw, n) => { const m = new RegExp(n + "\\((-?\\d+) ; (-?\\d+)\\)").exec(raw); return m ? [+m[1], +m[2]] : null; };

  /* relrep 1 */
  R("relrep", /Quel est le plus (petit|grand) nombre entier strictement (supérieur|inférieur) à (-?\d+) \?/, (g) => { const n = nn(g[2]);
    if ((g[0] === "petit") !== (g[1] === "supérieur")) return NaN; /* « plus petit … inférieur » n'a pas de sens */
    let best = null; for (let k = n - 20; k <= n + 20; k++) if (g[1] === "supérieur" ? k > n : k < n) { if (best === null || (g[0] === "petit" ? k < best : k > best)) best = k; } return best; });
  R("relrep", /Combien y a-t-il de nombres entiers strictement compris entre (-?\d+) et (-?\d+) \?/, (g) => { const [a, b] = g.map(nn); let c = 0; for (let k = Math.min(a, b) + 1; k < Math.max(a, b); k++) c++; return c; });
  R("relrep", /relevés de température, [^:]*: ((?:-?\d+ °C ; )+-?\d+ °C)\. Quelle est la température la plus (haute|basse)/, (g) => { const v = g[0].split(" ; ").map((t) => nn(t.replace(/[^\d,−-]/g, ""))); return g[1] === "haute" ? v.reduce((a, b) => (b > a ? b : a)) : v.reduce((a, b) => (b < a ? b : a)); });

  /* symetries 1 */
  R("symetries", new RegExp("Le point " + PT("A'") + " est l'image d'un point A par la symétrie d'axe O([xy])"), (g) => { const [x, y] = [nn(g[0]), nn(g[1])];
    return grid((u, v) => (g[2] === "y" ? u + x === 0 && v === y : u === x && v + y === 0)); });
  R("symetries", new RegExp("B est l'image de " + PT("A") + " par la symétrie d'axe O([xy])[^.]*\\. Quelle est la longueur du segment \\[AB\\]"), (g) => { const [x, y] = [nn(g[0]), nn(g[1])], B = g[2] === "y" ? [-x, y] : [x, -y]; return Math.hypot(B[0] - x, B[1] - y); });

  /* cart 1 */
  R("cart", new RegExp("Le point " + PT("M") + " est le milieu du segment \\[AB\\], avec " + PT("A")), (g) => { const [mx, my, ax, ay] = g.map(nn); return grid((x, y) => (x + ax) / 2 === mx && (y + ay) / 2 === my); });
  R("cart", new RegExp("un phare est en " + PT("P") + " et un bateau en " + PT("B")), (g) => { const [a, b, c, d] = g.map(nn); return Math.sqrt((c - a) * (c - a) + (d - b) * (d - b)); });

  /* vecteurs 1 (composantes lues dans le TeX) */
  R("vecteurs", /^On donne A\(-?\d+ ; -?\d+\) et AB = .*Quelles sont les coordonnées de B \?/, (g, t, x) => { const A = ptTeX(x.raw, "A"), u = vecTeX(x.raw); return A && u ? grid((p, q) => p - A[0] === u[0] && q - A[1] === u[1]) : null; });
  R("vecteurs", /^On donne B\(-?\d+ ; -?\d+\) et AB = .*Quelles sont les coordonnées du point de départ A \?/, (g, t, x) => { const B = ptTeX(x.raw, "B"), u = vecTeX(x.raw); return B && u ? grid((p, q) => B[0] - p === u[0] && B[1] - q === u[1]) : null; });
  R("vecteurs", /personnage de jeu vidéo est en P\(-?\d+ ; -?\d+\)\. Il subit la translation de vecteur/, (g, t, x) => { const P = ptTeX(x.raw, "P"), u = vecTeX(x.raw); return P && u ? grid((p, q) => p - P[0] === u[0] && q - P[1] === u[1]) : null; });

  /* sinlaw 1 : A(0 ; 0), B(c ; 0), C à l'intersection des deux demi-droites */
  R("sinlaw", /distants de (\d+) m, voient une montgolfière C\W{0,4}l'angle \S*BAC mesure (\d+)° et l'angle \S*ABC mesure (\d+)°\. Calcule la distance AC/i, (g) => { const [c, a, b] = g.map(nn), ta = Math.tan((a * Math.PI) / 180), tb = Math.tan((b * Math.PI) / 180);
    const X = (c * tb) / (ta + tb), Y = ta * X; return Math.hypot(X, Y); });

  /* cercletan 1 */
  R("cercletan", new RegExp("Le cercle de centre " + PT("C") + " passe par le point " + PT("P")), (g) => { const [a, b, x, y] = g.map(nn); return (x - a) ** 2 + (y - b) ** 2; });
  R("cercletan", new RegExp("Les points " + PT("A") + " et " + PT("B") + " sont diamétralement opposés sur un cercle\\. Quel est le rayon"), (g) => { const [a, b, c, d] = g.map(nn), Mx = (a + c) / 2, My = (b + d) / 2; return Math.hypot(a - Mx, b - My); });


  /* ---------- lot 2 ---------- */
  const L = (s) => s.split(/\s*;\s*/).map((t) => nn(t.replace(/[^\d,'−-]/g, "")));
  const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
  R("diagr", /^La moyenne de (\d+) nombres est (\d+(?:,\d+)?)\. Quelle est leur somme/, (g) => { const n = nn(g[0]), m = nn(g[1]); let s = 0; for (let i = 0; i < n; i++) s += m; return s; });
  R("diagr", /: ((?:\d+ (?:km|min|cm) ; )+\d+ (?:km|min|cm))\. (?:Quelle|Combien)[^?]*moyen/, (g) => mean(L(g[0])));
  R("idrem", /Complète l'identité : \(x ([+-]) (\d+)\)\^2 = x\^2 [+-]\s+x \+ (\d+)\./, (g) => { const a = nn(g[1]) * (g[0] === "-" ? -1 : 1); if (nn(g[2]) !== a * a) return NaN; const f = (x) => (x + a) ** 2; return Math.abs((f(1) - f(-1)) / 2); });
  R("polyexpr", /a pour zéros ((?:-?\d+\s*;\s*)+-?\d+), et son graphe passe par le point P\((-?\d+)\s*;\s*(-?\d+)\)/, (g) => { const z = L(g[0]), p = nn(g[1]), v = nn(g[2]); const P = z.reduce((a, r) => a * (p - r), 1); return v / P; });
  R("polyexpr", /coupe l'axe des abscisses en (-?\d+) et en (-?\d+), et l'axe des ordonnées au point \(0\s*;\s*(-?\d+)\)/, (g) => { const [r1, r2, c] = g.map(nn); for (let a = -20; a <= 20; a++) if (a && a * (0 - r1) * (0 - r2) === c) return a; return NaN; });
  R("compo", /g\(t\) = t - 273 convertit .*? f\(c\) = 1,8c \+ 32 convertit .*? Calcule \(f ° g\)\((\d+)\)/, (g) => { const T = nn(g[0]), C = T - 273; return (C * 9) / 5 + 32; });
  R("compo", /^On connaît quelques valeurs de deux fonctions : (.*) ; (.*)\. Calcule \(f ° g\)\((\d+)\)/, (g) => { const tab = (t) => { const o = {}; for (const m of t.matchAll(/[fg]\((\d+)\) = (-?\d+)/g)) o[m[1]] = nn(m[2]); return o; }; const F = tab(g[0]), G2 = tab(g[1]), k = g[2]; return G2[k] in F ? F[G2[k]] : NaN; });
  R("compo", /^Soit f\(x\) = x\^2 - (\d+)\. Calcule \(f ° f\)\((-?\d+)\)/, (g) => { const c = nn(g[0]), f = (x) => x * x - c; return f(f(nn(g[1]))); });
  R("homogrec", /^Soit f\(x\) = \((\d+)\)\/\(x ([+-]) (\d+)\)\. Calcule f\^-1\((-?\d+)\)/, (g) => { const a = nn(g[0]), b = (g[1] === "-" ? 1 : -1) * nn(g[2]), c = nn(g[3]); for (let x = -200; x <= 200; x += 0.25) if (x !== b && Math.abs(a / (x - b) - c) < 1e-9) return x; return NaN; });
  R("relrep", /le point A a pour abscisse (-?\d+)\. Le point B est à (\d+) unités à gauche de A/, (g) => { let x = nn(g[0]); for (let i = 0; i < nn(g[1]); i++) x--; return x; });
  R("relrep", /fond d'un lac est à l'altitude (-?\d+) m .*? sommet de la montagne voisine à ([\d']+) m/, (g) => nn(g[1]) - nn(g[0]));
  const tanSlope = (a, b, r2, x0, y0) => { const y = (x) => b + Math.sign(y0 - b) * Math.sqrt(r2 - (x - a) ** 2), h = 1e-6; return (y(x0 + h) - y(x0 - h)) / (2 * h); };
  R("cercletan", /La tangente au cercle x\^2 \+ y\^2 = (\d+) au point \((-?\d+)\s*;\s*(-?\d+)\) a pour équation y = mx \+ h\. Que vaut h/, (g) => { const [r2, p, q] = g.map(nn); if (p * p + q * q !== r2) return NaN; const m = tanSlope(0, 0, r2, p, q); return q - m * p; });
  R("cercletan", /pente de la tangente au cercle \(x ([+-]) (\d+)\)\^2 \+ \(y ([+-]) (\d+)\)\^2 = (\d+) au point \((-?\d+)\s*;\s*(-?\d+)\)/, (g) => { const a = (g[0] === "-" ? 1 : -1) * nn(g[1]), b = (g[2] === "-" ? 1 : -1) * nn(g[3]), r2 = nn(g[4]), x0 = nn(g[5]), y0 = nn(g[6]); if ((x0 - a) ** 2 + (y0 - b) ** 2 !== r2) return NaN; return tanSlope(a, b, r2, x0, y0); });
  R("symetries", new RegExp("image de " + PT("A") + " par la symétrie d'axe horizontal y = " + Z), (g) => { const [x, y, c] = g.map(nn); return grid((u, v) => u === x && (v + y) / 2 === c && v !== y); });
  R("eqverif", /Un seul de ces nombres est solution de l'équation x\^2 \+ (\d+) = (\d+)x\W*((?:\d+ ; )+\d+)\. Lequel/, (g) => { const P = nn(g[0]), S = nn(g[1]), ok = L(g[2]).filter((x) => x * x + P === S * x); return ok.length === 1 ? ok[0] : NaN; });
  R("eqverif", /Pour quelle valeur de p le nombre (-?\d+) est-il solution de l'équation x\^2 \+ px = (\d+)/, (g) => { const k = nn(g[0]), c = nn(g[1]); for (let p = -200; p <= 200; p++) if (k * k + p * k === c) return p; return NaN; });


  /* ---------- lot 3 ---------- */
  const D = "(-?\\d+(?:[,']\\d+)*)";
  const RR = (ids, re, f) => rules.push({ ids: new Set(ids.split(" ")), re: /[^]/, f: (txt, x) => { const m = re.exec(x.raw); return m ? f(m.slice(1), txt, x) : null; }, o: { text: true } });
  R("p8droite", /on lit (\d+) sous un trait et (\d+) sous un autre trait\. Entre les deux, il y a (\d+) intervalles égaux\. Combien vaut une graduation/, (g) => { const [A, B, n] = g.map(nn); return (B - A) / n; });
  R("p8droite", new RegExp("les graduations vont de " + D + " en " + D + "\\. Le point [AB] est (\\d+) graduations (après|avant) (?:le nombre )?" + D + "\\."), (g) => { const st = nn(g[0]), k = nn(g[2]), A = nn(g[4]); let v = A; for (let i = 0; i < k; i++) v += g[3] === "après" ? st : -st; return Math.round(v * 1e9) / 1e9; });
  R("p8droite", /l'intervalle de (\d+) à (\d+) est partagé en (\d+) parts égales\. Quel nombre se trouve (\d+) graduations? après (\d+)/, (g) => { const [U, V, n, k] = g.map(nn); return U + (k * (V - U)) / n; });
  R("p8calcadd", /Dans un bus, il y a (\d+) passagers\. À l'arrêt, (\d+) personnes montent et personne ne descend/, (g) => nn(g[0]) + nn(g[1]));
  R("p8calcadd", /Un livre compte (\d+) pages\. Léa en a déjà lu (\d+)\./, (g) => nn(g[0]) - nn(g[1]));
  R("f2trois", /passe par les points ((?:\(-?\d+\s*;\s*-?\d+\),? ?){3})\. Calcule f\((-?\d+)\)/, (g) => { const P = [...g[0].matchAll(/\((-?\d+)\s*;\s*(-?\d+)\)/g)].map((m) => [nn(m[1]), nn(m[2])]); if (P.length !== 3) return null; const t = nn(g[1]);
    return P.reduce((s, [xi, yi], i) => s + yi * P.reduce((p, [xj], j) => (j === i ? p : (p * (t - xj)) / (xi - xj)), 1), 0); });
  R("polyexpr", /a un zéro double en (-?\d+) et un zéro simple en (-?\d+)\. Son graphe passe par le point \((-?\d+)\s*;\s*(-?\d+)\)/, (g) => { const [p, q, m, v] = g.map(nn); return v / ((m - p) ** 2 * (m - q)); });
  R("polyexpr", /a un zéro double en (-?\d+), un zéro simple en (-?\d+), et son coefficient a vaut (-?\d+)\. Calcule f\((-?\d+)\)/, (g) => { const [p, q, a, m] = g.map(nn); return a * (m - p) * (m - p) * (m - q); });
  const Ft = (x) => { const F = FX(x.raw, "f"); return F ? (t) => at(F, t) : null; };
  R("homogrec", /Pour quelle valeur de x l'expression de f\^-1\(x\) n'est-elle pas définie/, (g, t, x) => { const f = Ft(x); if (!f) return null; return Math.round(f(1e7) * 1e4) / 1e4; });
  R("homogrec", /Imprimer n affiches coûte (\d+) francs de mise en route, plus (\d+) francs par affiche\. .* Pour combien d'affiches le coût moyen vaut-il (\d+(?:,\d+)?) francs/, (g) => { const [b, a, k] = g.map(nn); for (let n = 1; n <= 1000; n++) if (Math.abs((a * n + b) / n - k) < 1e-9) return n; return NaN; });
  R("homogrec", /Le point \((-?\d+)\s*;\s*m\) est sur le graphe de f\^-1\. Que vaut m/, (g, t, x) => { const f = Ft(x), k = nn(g[0]); if (!f) return null; for (let u = -100; u <= 100; u += 0.5) if (Math.abs(f(u) - k) < 1e-9) return u; return NaN; });
  R("bijection", /est une bijection de \]-\s*;\s*a\] vers \[b\s*;\s*\+\s*\[, avec a le plus grand possible\. Que vaut ([ab])/, (g, t, x) => { const f = Ft(x); if (!f) return null; let bx = -100; for (let u = -100; u <= 100; u += 0.5) if (f(u) < f(bx)) bx = u; return g[0] === "a" ? bx : f(bx); });
  R("bijection", /est une bijection de \[(-?\d+)\s*;\s*\+\s*\[ vers \[(-?\d+)\s*;\s*\+\s*\[\. Quel nombre x de \[-?\d+\s*;\s*\+\s*\[ a pour image (-?\d+)/, (g, t, x) => { const f = Ft(x), lo = nn(g[0]), v = nn(g[2]); if (!f) return null; const S = []; for (let u = lo; u <= lo + 100; u++) if (Math.abs(f(u) - v) < 1e-9) S.push(u); return S.length === 1 ? S[0] : NaN; });
  const rot = (P, C, deg) => { const t = (deg * Math.PI) / 180, dx = P[0] - C[0], dy = P[1] - C[1]; return { pair: [Math.round(C[0] + dx * Math.cos(t) - dy * Math.sin(t)), Math.round(C[1] + dx * Math.sin(t) + dy * Math.cos(t))] }; };
  R("rotation", new RegExp("rotation de centre O\\(0 ; 0\\) et d'angle 90° dans le sens des aiguilles d'une montre, quelle est l'image du point " + PT("A")), (g) => rot([nn(g[0]), nn(g[1])], [0, 0], -90));
  R("rotation", new RegExp("rotation de centre " + PT("C") + " et d'angle 180°, quelle est l'image du point " + PT("A")), (g) => rot([nn(g[2]), nn(g[3])], [nn(g[0]), nn(g[1])], 180));
  R("relrep", /plongeurs sont aux altitudes (-?\d+) m et (-?\d+) m .*? à mi-chemin/, (g) => (nn(g[0]) + nn(g[1])) / 2);
  R("relrep", /segment allant de (-?\d+) à (-?\d+) sur la droite graduée en trois parts égales\. Quelle est l'abscisse du point de partage le plus proche de (-?\d+)/, (g) => { const [a, b, c] = g.map(nn), p1 = a + (b - a) / 3, p2 = a + (2 * (b - a)) / 3; return Math.abs(p1 - c) < Math.abs(p2 - c) ? p1 : p2; });
  RR("log", /\\log_\{(\d+)\} (\d+)\\\)\. \(Fraction/, (g) => Math.log(nn(g[1])) / Math.log(nn(g[0])));
  RR("log", /Calcule sans calculatrice : \\\(2\\log (\d+) \+ \\log (\d+)\\\)/, (g) => 2 * Math.log10(nn(g[0])) + Math.log10(nn(g[1])));
  R("cercletan", new RegExp("Le cercle de centre " + PT("C") + " est tangent à l'axe des (ordonnées|abscisses)\\. Quel est son rayon"), (g) => { const [a, b] = [nn(g[0]), nn(g[1])]; return g[2] === "ordonnées" ? Math.hypot(a, 0) : Math.hypot(0, b); });
  R("cercletan", new RegExp("Le premier a pour centre " + PT("A") + " et pour rayon (\\d+), le second a pour centre " + PT("B")), (g) => { const [a, b, r1, c, d] = g.map(nn); return Math.hypot(c - a, d - b) - r1; });
  RR("trigrel", /\\cos\\alpha = \\frac\{(\d+)\}\{(\d+)\}\\\)\. Calcule \\\(\\tan\\alpha/, (g) => Math.tan(Math.acos(nn(g[0]) / nn(g[1]))));
  RR("trigrel", /est obtus .*\\sin\\alpha = \\frac\{(\d+)\}\{(\d+)\}\\\)\. Calcule \\\(\\cos\\alpha/, (g) => Math.cos(Math.PI - Math.asin(nn(g[0]) / nn(g[1]))));

  /* oracles génériques (réponse en expression) : en tête de RECALC.G, réservés aux formes v27 */
  const E = (t) => Expr.parse(RECALC.tex2e(t));
  const FX = (raw, n) => { const m = new RegExp(n + "\\(x\\) = (.+?)\\\\\\)").exec(raw); return m ? E(m[1]) : null; };
  const at = (T, x) => Expr.evaluate(T, { x });
  const GV = [
    { name: "v27 aire", f(x) { let m; if (!/^v27-/.test(x.ctx || "") && !/^(Un rectangle|Un carré)/.test(x.txt)) return null;
      if ((m = /^Un rectangle mesure (\d+) cm de large et \((\d+)x \+ (\d+)\) cm de long/.exec(x.txt))) return { expr: Expr.parse(m[1] + "*(" + m[2] + "*x+" + m[3] + ")") };
      if ((m = /^Un carré a pour côté \(x \+ (\d+)\) cm/.exec(x.txt))) return { expr: Expr.parse("(x+" + m[1] + ")*(x+" + m[1] + ")") }; return null; } },
    { name: "v27 composée", f(x) { if (!/Donne l'expression réduite de \(f ° g\)\(x\)/.test(x.txt)) return null; const F = /f\(x\) = (.+?)\\\)/.exec(x.raw), G = /g\(x\) = (.+?)\\\)/.exec(x.raw); if (!F || !G) return null;
      return { expr: Expr.parse("(" + RECALC.tex2e(F[1]).replace(/x/g, "(" + RECALC.tex2e(G[1]) + ")") + ")") }; } },
    { name: "v27 réciproque", f(x) { if (!/^Soit f\(x\) = .* Donne l'expression de f\^-1\(x\)/.test(x.txt) || x.id !== "homogrec") return null; const F = FX(x.raw, "f"); if (!F || !x.spec || !x.spec.expr) return null; const Fi = Expr.parse(x.spec.expr);
      for (const t of [-7.3, -2.1, 0.6, 3.7, 11.9]) { const u = at(Fi, t); if (!isFinite(u)) continue; const w = at(F, u); if (Math.abs(w - t) > 1e-7 * (1 + Math.abs(t))) return { err: "f(f⁻¹(" + t + ")) = " + w }; } return { err: null }; } },
    { name: "v27 décomposition", f(x) { if (x.id !== "decomp" || !/avec [fg]\(x\) = .* Donne [fg]\(x\)/.test(x.txt) || !x.spec || !x.spec.expr) return null; const H = FX(x.raw, "h"), askF = /Donne f\(x\)/.test(x.txt), K = FX(x.raw, askF ? "g" : "f"); if (!H || !K) return null; const S = Expr.parse(x.spec.expr), F = askF ? S : K, G = askF ? K : S;
      for (const t of [0.3, 1.7, 2.9, 4.1, 6.6]) { const g = at(G, t), h = at(H, t); if (!isFinite(h) || !isFinite(g)) continue; const w = at(F, g); if (Math.abs(w - h) > 1e-7 * (1 + Math.abs(h))) return { err: "f(g(" + t + ")) = " + w + " ≠ h(" + t + ") = " + h }; } return { err: null }; } },
  ];
  RECALC.G.unshift(...GV);
  RECALC.RULES.unshift(...rules);
  return { rules };
})();
