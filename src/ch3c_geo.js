// 3e du Collège de Genève (grade 14) · Géométrie vectorielle et analytique de l'espace (24.11, agent c3geo ; programme
// dans tools/programme_3e_4e_college.md, § 3 et § 5, priorité 3). Chapitre Sésamath Ma3 Ch6 (M3C06), compétences
// 3.GV.01 à 3.GV.05 du référentiel matu.
// Huit notions : vect3d (composantes, milieu, norme, Chasles), colin (colinéarité, coplanarité ; MA2), droite3d (droites
// paramétriques de l'espace : notion Collège, car droiteparam de la MP vit dans le paquet « mp », non chargé en 3e),
// plans (équations paramétriques et cartésienne, traces), posrel (positions relatives, intersections), pscal3d (produit
// scalaire : angle, orthogonalité, projection), distances (point-droite, point-plan, aire), sphere (vecteur normal,
// plan médiateur, sphère, plan tangent). Le produit vectoriel (pvect, MA2) reste à faire.
// Réponses : nombre, triplet « x ; y ; z » (format pair à 3 valeurs), couple, ensemble, expression (z en fonction de t).
// Standard : 3 niveaux, au moins 3 formes par niveau, pas à pas, erreurs typiques, étiquette ctx, leçon, indice,
// 3 compétences, problème en plusieurs étapes à valeurs tirées (niveau 4). Paquet de chargement « 14 » (build.py).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => { const x = +(+v).toFixed(9); return x === 0 ? 0 : x; };
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };
  /* nombre en TeX : entier, fraction, sinon décimal à virgule */
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  /* nombre tapé : entier ou a/b */
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  const par = (v) => (r6(v) < 0 ? "(" + fT(v) + ")" : fT(v));
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));
  const DEG = 180 / Math.PI;
  /* fraction m/n, suivie de sa forme simplifiée si elle diffère */
  const frT = (m, n) => { const f = "\\frac{" + m + "}{" + n + "}", g = fT(m / n); return g === f ? f : f + " = " + g; };
  /* coefficient devant une lettre, précédé de son signe (« - 2m », « + m ») */
  const sgc = (c, v) => (c < 0 ? " - " : " + ") + (Math.abs(c) === 1 ? "" : fT(Math.abs(c))) + v;
  const sgn = () => (R.rand() < 0.5 ? -1 : 1);
  const perm = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  /* vecteurs de l'espace (tableaux de 3 nombres) */
  const add = (u, v) => u.map((x, i) => r6(x + v[i]));
  const sub = (u, v) => u.map((x, i) => r6(x - v[i]));
  const mul = (k, u) => u.map((x) => r6(k * x));
  const dot = (u, v) => r6(u.reduce((s, x, i) => s + x * v[i], 0));
  const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]].map(r6);
  const nn2 = (u) => dot(u, u);
  const nrm = (u) => Math.sqrt(nn2(u));
  const isZ = (u) => u.every((x) => Math.abs(x) < 1e-9);
  const red = (u) => { const g = u.reduce((a, x) => gcd(a, Math.abs(x)), 0) || 1; return u.map((x) => r6(x / g)); };
  const det3 = (a, b, c) => dot(a, cross(b, c));
  const angle = (u, v) => DEG * Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nrm(u) * nrm(v)))));
  const rp = (k = 5) => [R.int(-k, k), R.int(-k, k), R.int(-k, k)];
  const rv = (k = 3) => [nz(-k, k), nz(-k, k), nz(-k, k)];
  const D = (v, s) => nb(r6(Math.round(v / s) * s));
  /* quadruplets de Pythagore a² + b² + c² = d² : vecteur à norme entière */
  const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15]];
  const qv = (lim) => { const [a, b, c, d] = pk(lim ? QUAD.slice(0, lim) : QUAD); return [perm([a, b, c]).map((x) => x * sgn()), d]; };
  /* matrices orthogonales entières (lignes deux à deux orthogonales, de même norme n) */
  const ORTH = [[[[1, 2, 2], [2, 1, -2], [2, -2, 1]], 3], [[[2, 3, 6], [3, -6, 2], [6, 2, -3]], 7], [[[1, 4, 8], [4, 7, -4], [8, -4, 1]], 9]];
  const orth = (lim) => { const [Mx, n] = pk(lim ? ORTH.slice(0, lim) : ORTH), p = perm([0, 1, 2]), s = [sgn(), sgn(), sgn()], rows = perm([0, 1, 2]).map((i) => p.map((j, k) => Mx[i][j] * s[k])); return { u: rows[0], w: rows[1], z: rows[2], n }; };
  /* écriture */
  const vec = (s) => (s.length > 1 ? "\\overrightarrow{" + s + "}" : "\\vec{" + s + "}");
  const v3 = (u) => "\\begin{pmatrix} " + u.map(fT).join(" \\\\ ") + " \\end{pmatrix}";
  const vN = (s, u) => M(vec(s) + " = " + v3(u));
  const ptT = (u) => "(" + u.map(fT).join(" \\,;\\, ") + ")";
  const pt = (u) => M(ptT(u));
  const ptN = (n, u) => M(n + ptT(u));
  const TRIP = " Réponds « x ; y ; z ».";
  /* somme de termes c·v (v = "" pour la constante), en TeX ; termes nuls omis */
  const lt = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), t = (vs[i] && a === 1 ? "" : fT(a)) + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };
  /* même chose, tapé au clavier (coefficients fractionnaires entre parenthèses) */
  const ltS = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), cf = !vs[i] ? fS(a) : a === 1 ? "" : Number.isInteger(a) ? fS(a) : "(" + fS(a) + ")", t = cf + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };
  const XYZ = ["x", "y", "z", ""];
  const plT = (n, d) => lt(n.concat([d]), XYZ) + " = 0";
  /* composante d'une représentation paramétrique : constante d'abord (« 2 - 3t ») */
  const cmp = (a, cs, ps) => { const tail = lt(cs, ps); if (!r6(a)) return tail; if (tail === "0") return fT(a); return fT(a) + (tail[0] === "-" ? " - " + tail.slice(1) : " + " + tail); };
  const cmpS = (a, c, p) => { const tail = ltS([c], [p]); if (!r6(a)) return tail; if (tail === "0") return fS(a); return fS(a) + (tail[0] === "-" ? " - " + tail.slice(1) : " + " + tail); };
  const eqD = (A, u, s = "t") => M("\\begin{cases} x = " + cmp(A[0], [u[0]], [s]) + " \\\\ y = " + cmp(A[1], [u[1]], [s]) + " \\\\ z = " + cmp(A[2], [u[2]], [s]) + " \\end{cases}");
  const eqPl = (A, u, v) => M("\\begin{cases} x = " + cmp(A[0], [u[0], v[0]], ["s", "t"]) + " \\\\ y = " + cmp(A[1], [u[1], v[1]], ["s", "t"]) + " \\\\ z = " + cmp(A[2], [u[2], v[2]], ["s", "t"]) + " \\end{cases}");
  /* (x - a)² en TeX */
  const sq = (v, c) => (r6(c) ? "(" + v + (c < 0 ? " + " + fT(-c) : " - " + fT(c)) + ")^2" : v + "^2");
  const sphT = (C, r2) => sq("x", C[0]) + " + " + sq("y", C[1]) + " + " + sq("z", C[2]) + " = " + fT(r2);
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => { const seen = new Set(), tol = Math.max(spec.round || 0, 1e-9); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e !== undefined) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.length || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (tr.spec) { if (spec.kind !== "pair" || tr.spec.values.length !== spec.values.length || !tr.spec.values.every(isFinite)) return false; const c = tr.spec.values.map(fS).join(" ; "); if (seen.has(c) || checkAnswer(spec, c).status === "correct") return false; seen.add(c); return true; }
    if (spec.kind !== "value" || !isFinite(tr.v)) return false;
    const k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
    if (Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
  /* Téléphone 360 px : une formule longue est découpée aux « = » de premier niveau (comme src/ch4c_ana.js). */
  const vis = (t) => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b)).replace(/\\[a-zA-Z]+/g, "x").replace(/\\[,;!]|[{}\s]/g, "");
  const cut = (t) => { const out = []; let d = 0, last = 0;
    for (let i = 0; i < t.length; i++) { const c = t[i];
      if (c === "{") d++; else if (c === "}") d--; else if (t.startsWith("\\left", i)) d++; else if (t.startsWith("\\right", i)) d--;
      else if (d === 0 && i > last + 1) { const m = /^ (=|\\iff|\\approx) /.exec(t.slice(i)); if (m) { out.push(t.slice(last, i)); last = i + 1; i += m[0].length - 2; } } }
    out.push(t.slice(last)); return out; };
  const wrapM = (h) => (typeof h !== "string" ? h : h.replace(/\\\((.*?)\\\)/g, (m, t) => { if (/\\begin/.test(t) || vis(t).length <= 22) return m; const ps = cut(t); if (ps.length < 2) return m;
    const ch = []; let cur = ""; for (const p of ps) { if (cur && vis(cur + p).length > 22) { ch.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; } ch.push(cur);
    return ch.map((c) => "\\(" + c + "\\)").join(" "); }));
  const mk = (q, spec, sol, o) => { const x = { q: wrapM(q), spec, sol: wrapM(sol), guide: (o.guide || []).map((g) => Object.assign({}, g, { ask: wrapM(g.ask), sol: wrapM(g.sol) })), ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
  const QN = (q, value, sol, o) => (isFinite(value) ? mk(q, { kind: "value", value: r6(value) }, sol, o) : null);
  const QR = (q, value, round, sol, o) => (isFinite(value) ? mk(q, { kind: "value", value, round }, sol, o) : null);
  const QP = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o)) : null);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
  const G = (ask, value, sol, round) => GS(ask, r6(value), sol, round);
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
  const TR = TRAP;
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m });
  const TX = (e, m) => ({ e, m });
  const TSt = (s, m) => ({ s: s.map(r6), m });
  const P = (q, parts, hints, sol) => ({ q, sol: wrapM(sol), parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: r6(value) }, round ? { round } : {}) })), hints });
  /* coordonnées d'un point en texte simple (problèmes) */
  const ptS = (u) => "(" + u.map((x) => String(r6(x)).replace(".", ",").replace("-", "−")).join(" ; ") + ")";
  const plS = (n, d) => ltS(n.concat([d]), XYZ).replace(/-/g, "−") + " = 0";

  // ======================= vect3d : vecteurs de l'espace (3.GV.01a–d) =======================
  const VE = {
    1: [
      () => { const A = rp(5), B = rp(5), u = sub(B, A); if (u.some((x) => !x)) return null;
        return QP("Donne les composantes du vecteur " + M(vec("AB")) + " avec " + ptN("A", A) + " et " + ptN("B", B) + "." + TRIP, u, "Extrémité moins origine : " + M(vec("AB") + " = " + v3(u)) + ".",
          { ctx: "composantes", guide: [G("Première composante " + M("x_B - x_A") + " ?", u[0], M(fT(B[0]) + " - " + par(A[0]) + " = " + fT(u[0])) + "."), G("Deuxième " + M("y_B - y_A") + " ?", u[1], M(fT(B[1]) + " - " + par(A[1]) + " = " + fT(u[1])) + "."), G("Troisième " + M("z_B - z_A") + " ?", u[2], M(fT(B[2]) + " - " + par(A[2]) + " = " + fT(u[2])) + "."), GP("Composantes de " + M(vec("AB")) + " ?", u, M(v3(u)) + ".")],
            traps: [TP(sub(A, B), "Extrémité moins origine : B − A, pas A − B."), TP(add(A, B), "On soustrait les coordonnées (B − A), on ne les additionne pas.")] }); },
      () => { const A = rp(6), h = rv(3), B = add(A, mul(2, h)), Mi = add(A, h);
        return QP("Donne les coordonnées du milieu " + M("M") + " de " + M("[AB]") + " avec " + ptN("A", A) + " et " + ptN("B", B) + "." + TRIP, Mi, "Moyenne des coordonnées : " + M("M = \\left(\\frac{x_A + x_B}{2} \\,;\\, \\frac{y_A + y_B}{2} \\,;\\, \\frac{z_A + z_B}{2}\\right)") + " = " + pt(Mi) + ".",
          { ctx: "milieu", guide: [G(M("x_M") + " ?", Mi[0], M("\\frac{" + fT(A[0]) + " + " + par(B[0]) + "}{2} = " + fT(Mi[0])) + "."), G(M("y_M") + " ?", Mi[1], M(fT(Mi[1])) + "."), G(M("z_M") + " ?", Mi[2], M(fT(Mi[2])) + "."), GP("Milieu ?", Mi, pt(Mi) + ".")],
            traps: [TP(h, "Le milieu est la moyenne (x_A + x_B) ÷ 2, pas la demi-différence."), TP(add(A, B), "N'oublie pas de diviser par 2.")] }); },
      () => { const a = pk([2, 3, -2, -3, 4]), b = pk([2, 3, -2, -3]), u = rp(4), v = rp(4); if (isZ(u) || isZ(v)) return null; const w = add(mul(a, u), mul(b, v)); if (isZ(w)) return null;
        const ex = co(a) + "\\vec{u}" + (b < 0 ? " - " : " + ") + Math.abs(b) + "\\vec{v}";
        return QP("Avec " + vN("u", u) + " et " + vN("v", v) + ", calcule les composantes de " + M(ex) + "." + TRIP, w, M(fT(a) + "\\vec{u} = " + v3(mul(a, u))) + ", " + M(fT(b) + "\\vec{v} = " + v3(mul(b, v))) + " ; on additionne : " + M(v3(w)) + ".",
          { ctx: "combinaison", guide: [GP("Composantes de " + M(fT(a) + "\\vec{u}") + " ?", mul(a, u), M(v3(mul(a, u))) + "."), GP("Composantes de " + M(fT(b) + "\\vec{v}") + " ?", mul(b, v), M(v3(mul(b, v))) + "."), GP("Somme ?", w, M(v3(w)) + ".")],
            traps: [TP(add(mul(a, u), v), "Multiplie aussi chaque composante de v par " + b + "."), TP(add(mul(a, u), mul(-b, v)), "Attention au signe devant v."), TP(add(u, v), "Les coefficients " + a + " et " + b + " multiplient les vecteurs.")] }); },
    ],
    2: [
      () => { const [p, d] = qv(), A = rp(5), B = add(A, p);
        return QN("Calcule la distance " + M("AB") + " avec " + ptN("A", A) + " et " + ptN("B", B) + ", c'est-à-dire la norme de " + M(vec("AB")) + ".", d, M(vec("AB") + " = " + v3(p)) + ", " + M("\\|" + vec("AB") + "\\| = \\sqrt{" + p.map((x) => par(x) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "norme", guide: [GP("Composantes de " + M(vec("AB")) + " ?", p, M(v3(p)) + "."), G("Somme des carrés des composantes ?", d * d, M(p.map((x) => x * x).join(" + ") + " = " + d * d) + "."), G("Norme ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")],
            traps: [TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Pythagore dans l'espace : √(a² + b² + c²), on n'additionne pas les composantes."), TR(d * d, "N'oublie pas la racine carrée."), TR(Math.hypot(p[0], p[1]), "Il y a trois composantes : n'oublie pas z.")] }); },
      () => { const A = rp(5), B = rp(5), C = rp(5); if (isZ(cross(sub(B, A), sub(C, B)))) return null; const Dp = add(A, sub(C, B));
        return QP(M("ABCD") + " est un parallélogramme (sommets dans cet ordre) avec " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + ". Donne les coordonnées de " + M("D") + "." + TRIP, Dp, "Dans " + M("ABCD") + ", " + M(vec("AD") + " = " + vec("BC")) + " : " + M("D = A + " + vec("BC") + " = " + ptT(Dp)) + ".",
          { ctx: "parallelogramme", guide: [GP("Composantes de " + M(vec("BC")) + " ?", sub(C, B), M(v3(sub(C, B))) + "."), GP(M("D = A + " + vec("BC")) + " ?", Dp, pt(Dp) + ".")],
            traps: [TP(add(B, sub(C, A)), "C'est le parallélogramme ABDC : dans ABCD, on a AD = BC."), TP(add(A, sub(B, C)), "Dans ABCD, AD = BC : D = A + (C − B)."), TP(add(C, sub(B, A)), "Ce point complète ABEC ; dans ABCD, AD = BC.")] }); },
      () => { const u = rv(4), v = rv(4), w = sub(v, u); if (w.some((x) => !x)) return null;
        return QP("On connaît " + vN("AB", u) + " et " + vN("AC", v) + ". Donne les composantes de " + M(vec("BC")) + "." + TRIP, w, "Chasles : " + M(vec("BC") + " = " + vec("BA") + " + " + vec("AC") + " = " + vec("AC") + " - " + vec("AB") + " = " + v3(w)) + ".",
          { ctx: "chasles", guide: [GP("Composantes de " + M(vec("BA") + " = -" + vec("AB")) + " ?", mul(-1, u), M(v3(mul(-1, u))) + "."), GP(M(vec("BC") + " = " + vec("BA") + " + " + vec("AC")) + " ?", w, M(v3(w)) + ".")],
            traps: [TP(sub(u, v), "BC = BA + AC = AC − AB, pas AB − AC."), TP(add(u, v), "BA = −AB : on soustrait AB.")] }); },
    ],
    3: [
      () => { const A = rp(6), Mi = rp(4); if (A.some((x, i) => x === Mi[i])) return null; const B = sub(mul(2, Mi), A);
        return QP("Le point " + M("B") + " est le symétrique de " + ptN("A", A) + " par rapport à " + ptN("M", Mi) + ". Donne les coordonnées de " + M("B") + "." + TRIP, B, M("M") + " est le milieu de " + M("[AB]") + " : " + M("B = A + 2\\," + vec("AM") + " = 2M - A = " + ptT(B)) + ".",
          { ctx: "symetrique", guide: [GP("Composantes de " + M(vec("AM")) + " ?", sub(Mi, A), M(v3(sub(Mi, A))) + "."), GP(M("B = M + " + vec("AM")) + " ?", B, pt(B) + ".")],
            traps: [TP(mul(0.5, add(A, Mi)), "M est le milieu de [AB] : on cherche B, pas le milieu de [AM]."), TP(sub(Mi, A), "C'est le vecteur AM ; le point B vaut M + AM."), TP(add(Mi, A), "B = 2M − A.")] }); },
      () => { const [a0, b0, c, d] = pk(QUAD), a = a0 * sgn(), b = b0 * sgn(); if (c < 2) return null;
        return QN("Pour quelle valeur de " + M("m > 0") + " le vecteur " + M("\\vec{u} = \\begin{pmatrix} " + fT(a) + " \\\\ " + fT(b) + " \\\\ m \\end{pmatrix}") + " a-t-il pour norme " + M(d) + " ?", c, M(par(a) + "^2 + " + par(b) + "^2 + m^2 = " + d + "^2") + ", donc " + M("m^2 = " + (d * d) + " - " + (a * a + b * b) + " = " + c * c) + " et " + M("m = " + c) + ".",
          { ctx: "norme-inconnue", guide: [G(M("m^2 = " + d + "^2 - " + par(a) + "^2 - " + par(b) + "^2") + " ?", c * c, M(c * c) + "."), G(M("m") + " (positif) ?", c, M(c) + ".")],
            traps: [TR(c * c, "C'est m² : prends la racine carrée."), TR(d - Math.abs(a) - Math.abs(b), "Pythagore : m² = d² − a² − b², pas m = d − a − b."), TR(Math.sqrt(d * d + a * a + b * b), "On soustrait a² et b² de d².")] }); },
      () => { const Gc = rp(4), p = rv(3), q = rv(3); if (isZ(cross(p, q))) return null; const A = add(Gc, p), B = add(Gc, q), C = sub(sub(Gc, p), q);
        return QP("Donne le centre de gravité " + M("G") + " du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + "." + TRIP, Gc, M("G = \\frac{A + B + C}{3}") + " (moyenne des trois sommets) : " + pt(Gc) + ".",
          { ctx: "centre-gravite", guide: [G(M("x_G = \\frac{x_A + x_B + x_C}{3}") + " ?", Gc[0], M("\\frac{" + (A[0] + B[0] + C[0]) + "}{3} = " + Gc[0]) + "."), G(M("y_G") + " ?", Gc[1], M(Gc[1]) + "."), G(M("z_G") + " ?", Gc[2], M(Gc[2]) + "."), GP("Centre de gravité ?", Gc, pt(Gc) + ".")],
            traps: [TP(add(add(A, B), C), "Divise la somme par 3."), TP(mul(0.5, add(A, B)), "C'est le milieu de [AB] ; G est la moyenne des trois sommets.")] }); },
    ],
  };

  // ======================= colin : colinéarité, coplanarité (3.GV.02a, 02b ; MA2) =======================
  const CL = {
    1: [
      () => { const u = rv(5), k = pk([2, 3, -2, -3, 4]), m = k * u[1], v = [k * u[0], "m", k * u[2]];
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + vN("u", u) + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(v[0]) + " \\\\ m \\\\ " + fT(v[2]) + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, M("\\frac{" + fT(v[0]) + "}{" + fT(u[0]) + "} = " + k) + " et " + M("\\frac{" + fT(v[2]) + "}{" + fT(u[2]) + "} = " + k) + " : " + M("\\vec{v} = " + k + "\\vec{u}") + ", donc " + M("m = " + k + " \\cdot " + par(u[1]) + " = " + m) + ".",
          { ctx: "colin-m", guide: [G("Facteur " + M("k") + " tel que " + M("\\vec{v} = k\\vec{u}") + " (avec les premières composantes) ?", k, M(k) + "."), G(M("m = k \\cdot u_y") + " ?", m, M(m) + ".")],
            traps: [TR(u[1] / k, "v = k·u : on multiplie u_y par k, on ne divise pas."), TR(-m, "Attention au signe de k."), TR(u[1], "Les composantes de v valent k fois celles de u.")] }); },
      () => { const k = pk([2, 3, -2, -3, 0.5, -0.5, 1.5]), u = den(k) > 1 ? mul(2, rv(3)) : rv(4), v = mul(k, u);
        return QN("Les vecteurs " + vN("u", u) + " et " + vN("v", v) + " sont colinéaires : " + M("\\vec{v} = k\\,\\vec{u}") + ". Que vaut " + M("k") + " ?", k, M("k = \\frac{" + fT(v[0]) + "}{" + fT(u[0]) + "} = " + fT(k)) + " (même rapport pour les trois composantes).",
          { ctx: "facteur", guide: [G(M("\\frac{v_x}{u_x}") + " ?", k, M(fT(k)) + "."), G("Même rapport avec " + M("z") + " ? Donc " + M("k") + " = ?", k, M(fT(k)) + ".")],
            traps: [TR(1 / k, "C'est le facteur de u = k·v ; ici v = k·u : k = v_x ÷ u_x."), TR(-k, "Attention au signe.")] }); },
      () => { const A = rp(4), d = rv(3), t = pk([2, 3, -1, -2]), B = add(A, d), C = add(A, mul(t, d)); if (Math.abs(C[2]) < 2) return null;
        return QN("Les points " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, z)") + " sont alignés. Que vaut " + M("z") + " ?", C[2], M(vec("AB") + " = " + v3(d)) + " ; avec " + M("x") + " : " + M(vec("AC") + " = " + t + "\\," + vec("AB")) + ", donc " + M("z = " + fT(A[2]) + " + " + par(t) + " \\cdot " + par(d[2]) + " = " + fT(C[2])) + ".",
          { ctx: "alignes", guide: [GP(M(vec("AB")) + " ?", d, M(v3(d)) + "."), G("Nombre " + M("t") + " tel que " + M(vec("AC") + " = t\\," + vec("AB")) + " (avec " + M("x") + ") ?", t, M(t) + "."), G(M("z = z_A + t \\cdot (z_B - z_A)") + " ?", C[2], M(fT(C[2])) + ".")],
            traps: [TR(B[2], "C'est la cote de B ; C correspond à t = " + t + "."), TR(t * d[2], "On part de A : z = z_A + t·(z_B − z_A)."), TR(-C[2], "Attention au signe.")] }); },
    ],
    2: [
      () => { const A = rp(4), d = mul(2, rv(2)), t = pk([0.5, 1.5, -0.5, 2.5]), B = add(A, d), C = add(A, mul(t, d));
        return QP("Les points " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, m \\,;\\, n)") + " sont alignés. Donne " + M("m") + " et " + M("n") + ". Réponds « m ; n ».", [C[1], C[2]], M(vec("AC") + " = t\\," + vec("AB")) + " : avec " + M("x") + ", " + M("t = " + fT(t)) + " ; " + M("m = " + fT(A[1]) + " + " + fT(t) + " \\cdot " + par(d[1]) + " = " + fT(C[1])) + ", " + M("n = " + fT(A[2]) + " + " + fT(t) + " \\cdot " + par(d[2]) + " = " + fT(C[2])) + ".",
          { ctx: "alignes-deux", guide: [G(M("t") + " (avec les abscisses) ?", t, M(fT(t)) + "."), G(M("m") + " ?", C[1], M(fT(C[1])) + "."), G(M("n") + " ?", C[2], M(fT(C[2])) + "."), GP("Réponse « m ; n » ?", [C[1], C[2]], M(fT(C[1]) + " \\,;\\, " + fT(C[2])) + ".")],
            traps: [TP([C[2], C[1]], "Dans l'ordre : m (ordonnée) puis n (cote)."), TP([B[1], B[2]], "C n'est pas B : AC = t·AB avec t = " + fS(t) + ".")] }); },
      () => { const u = rv(3), v = rv(3); if (isZ(cross(u, v))) return null; const a = nz(-3, 3), b = nz(-3, 3); if (Math.abs(a) === 1 && Math.abs(b) === 1) return null; const w = add(mul(a, u), mul(b, v)); if (w.some((x) => !x)) return null;
        return QP("Les vecteurs " + vN("u", u) + ", " + vN("v", v) + " et " + vN("w", w) + " sont coplanaires. Trouve " + M("\\alpha") + " et " + M("\\beta") + " tels que " + M("\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}") + ". Réponds « α ; β ».", [a, b], "On résout le système des trois composantes (deux suffisent, la troisième vérifie) : " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + ".",
          { ctx: "decomposition", guide: [G(M("\\alpha") + " ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), GP("Réponse « α ; β » ?", [a, b], M(a + " \\,;\\, " + b) + ".")],
            traps: [TP([b, a], "α multiplie u et β multiplie v : vérifie l'ordre."), TP([-a, -b], "Attention aux signes : vérifie avec une composante.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const a = nz(-2, 2), b = nz(-2, 2), Dp = add(A, add(mul(a, u), mul(b, v))); if (Math.abs(Dp[2]) < 2) return null; const B = add(A, u), C = add(A, v);
        return QN("Les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(" + fT(Dp[0]) + " \\,;\\, " + fT(Dp[1]) + " \\,;\\, z)") + " sont coplanaires. Que vaut " + M("z") + " ?", Dp[2], M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + " ; avec " + M("x") + " et " + M("y") + " : " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + " ; puis " + M("z = " + fT(A[2]) + " + " + par(a) + " \\cdot " + par(u[2]) + " + " + par(b) + " \\cdot " + par(v[2]) + " = " + fT(Dp[2])) + ".",
          { ctx: "coplanaires", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), GP(M(vec("AC")) + " ?", v, M(v3(v)) + "."), G(M("\\alpha") + " (avec les composantes x et y de " + M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + ") ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), G(M("z") + " ?", Dp[2], M(fT(Dp[2])) + ".")],
            traps: [TR(A[2] + b * u[2] + a * v[2], "α multiplie AB et β multiplie AC."), TR(a * u[2] + b * v[2], "On part de A : z = z_A + α·(AB)_z + β·(AC)_z.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, -2, -3]), p = pk([1, 2, -1, -2, 3]), c = nz(-4, 4), m = p * k, q = p * k * k;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u} = \\begin{pmatrix} m \\\\ " + fT(p) + " \\\\ " + fT(c) + " \\end{pmatrix}") + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(q) + " \\\\ m \\\\ " + fT(k * c) + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, "Les troisièmes composantes donnent " + M("\\vec{v} = " + k + "\\vec{u}") + ". Deuxième composante : " + M("m = " + k + " \\cdot " + par(p) + " = " + m) + " ; vérification : " + M(k + " \\cdot " + par(m) + " = " + q) + ".",
          { ctx: "colin-parametre", guide: [G("Facteur " + M("k") + " (avec les troisièmes composantes) ?", k, M(k) + "."), G(M("m = k \\cdot " + par(p)) + " ?", m, M(m) + " (et " + M(k + " \\cdot " + par(m) + " = " + q) + " : ça vérifie).")],
            traps: [TR(-m, "Les deux conditions m² = " + p * q + " donnent ±" + Math.abs(m) + " : seule la valeur compatible avec le facteur " + k + " convient."), TR(q / k, "v = k·u : m = k · " + p + ".")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[1] * v[2] - u[2] * v[1] === 0) return null; const a = nz(-2, 2), b = nz(-2, 2), Dp = add(A, add(mul(a, u), mul(b, v))); if (Math.abs(Dp[0]) < 2) return null; const B = add(A, u), C = add(A, v);
        return QN("Pour quelle valeur de " + M("m") + " les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(m \\,;\\, " + fT(Dp[1]) + " \\,;\\, " + fT(Dp[2]) + ")") + " sont-ils coplanaires ?", Dp[0], M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + " ; les composantes " + M("y") + " et " + M("z") + " donnent " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + " ; puis " + M("m = " + fT(A[0]) + " + " + par(a) + " \\cdot " + par(u[0]) + " + " + par(b) + " \\cdot " + par(v[0]) + " = " + fT(Dp[0])) + ".",
          { ctx: "coplanaires-x", guide: [G(M("\\alpha") + " (système avec les composantes y et z) ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), G(M("m") + " ?", Dp[0], M(fT(Dp[0])) + ".")],
            traps: [TR(A[0] + b * u[0] + a * v[0], "α multiplie AB et β multiplie AC."), TR(a * u[0] + b * v[0], "On part de A : m = x_A + α·(AB)_x + β·(AC)_x.")] }); },
      () => { const A = [R.int(-3, 3), R.int(-3, 3), R.int(1, 4)], u = [nz(-3, 3), nz(-3, 3), nz(1, 3)], t = pk([2, 3, 4]), B = add(A, u), C = add(A, mul(t, u)); if (C[2] < 2) return null;
        return QN("Un rayon laser part de " + ptN("A", A) + " et passe par " + ptN("B", B) + " (en m). À quelle hauteur " + M("z") + " passe-t-il à la verticale du point " + M("(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, 0)") + " ?", C[2], "Le point du rayon s'écrit " + M("A + t\\," + vec("AB")) + " ; avec " + M("x") + " : " + M("t = " + t) + " (même valeur avec " + M("y") + ") ; " + M("z = " + fT(A[2]) + " + " + t + " \\cdot " + par(u[2]) + " = " + fT(C[2])) + " m.",
          { ctx: "laser", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), G(M("t") + " (avec l'abscisse) ?", t, M(t) + "."), G("Hauteur " + M("z") + " ?", C[2], M(fT(C[2])) + " m.")],
            traps: [TR(B[2], "C'est la hauteur en B (t = 1) ; ici t = " + t + "."), TR(t * u[2], "On part de A : z = z_A + t·(AB)_z."), TR(t * B[2], "z = z_A + t·(z_B − z_A).")] }); },
    ],
  };

  // ======================= droite3d : droites de l'espace (3.GV.03a, 03b) =======================
  const DT = {
    1: [
      () => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, -3]), Q = add(A, mul(t, u));
        return QP("La droite " + M("d") + " a pour équations paramétriques " + eqD(A, u) + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + TRIP, Q, "On remplace " + M("t") + " par " + M(t) + " : " + pt(Q) + ".",
          { ctx: "point-t", guide: [G(M("x") + " ?", Q[0], M(fT(A[0]) + " + " + par(u[0]) + " \\cdot " + par(t) + " = " + fT(Q[0])) + "."), G(M("y") + " ?", Q[1], M(fT(Q[1])) + "."), G(M("z") + " ?", Q[2], M(fT(Q[2])) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(mul(t, u), "N'oublie pas le point de départ (le terme sans t)."), TP(add(A, u), "Remplace t par " + t + ".")] }); },
      () => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, 4, -3]), Q = add(A, mul(t, u));
        return QN("Le point " + ptN("P", Q) + " est sur la droite " + eqD(A, u) + ". Pour quelle valeur du paramètre " + M("t") + " ?", t, M(fT(Q[0]) + " = " + cmp(A[0], [u[0]], ["t"])) + " donne " + M("t = " + t) + " ; les deux autres équations donnent la même valeur.",
          { ctx: "parametre", shownOk: true, guide: [G("Avec la première équation : " + M(fT(u[0]) + "t") + " = ?", Q[0] - A[0], M(fT(Q[0]) + " - " + par(A[0]) + " = " + fT(Q[0] - A[0])) + "."), G(M("t") + " ?", t, M(t) + ".")],
            traps: [TR(Q[0] - A[0], "Divise encore par " + u[0] + "."), TR(-t, "Attention au signe."), TR(Q[0], "On résout x_P = x_A + t·u_x.")] }); },
      () => { const A = rp(5), B = rp(5), u = sub(B, A); if (u.some((x) => !x) || !A[2]) return null; const ex = cmpS(A[2], u[2], "t");
        return QX("On paramètre la droite " + M("(AB)") + " par " + M("(x \\,;\\, y \\,;\\, z) = A + t\\," + vec("AB")) + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ". Donne l'expression de " + M("z") + " en fonction de " + M("t") + ".", ex, M(vec("AB") + " = " + v3(u)) + ", donc " + M("z = " + cmp(A[2], [u[2]], ["t"])) + ".",
          { ctx: "equation-AB", guide: [G("Troisième composante de " + M(vec("AB")) + " ?", u[2], M(fT(B[2]) + " - " + par(A[2]) + " = " + fT(u[2])) + "."), GX(M("z") + " en fonction de " + M("t") + " ?", ex, M("z = " + cmp(A[2], [u[2]], ["t"])) + ".")],
            traps: [TX(cmpS(B[2], u[2], "t"), "On part de A (t = 0 donne A), pas de B."), TX(cmpS(A[2], B[2], "t"), "Le coefficient de t est z_B − z_A."), TX(cmpS(A[2], -u[2], "t"), "AB = B − A : attention au signe.")] }); },
    ],
    2: [
      () => { const A = rv(6), u = rv(3), k = R.int(0, 2), name = ["yOz", "xOz", "xOy"][k], vr = ["x", "y", "z"][k], t = r6(-A[k] / u[k]); if (!Number.isInteger(t) || Math.abs(t) < 2) return null; const Q = A.map((x, i) => (i === k ? 0 : r6(x + t * u[i])));
        return QP("Donne le point d'intersection de la droite " + eqD(A, u) + " avec le plan " + M(name) + " (d'équation " + M(vr + " = 0") + ")." + TRIP, Q, M(vr + " = 0") + " donne " + M("t = " + t) + " : " + pt(Q) + ".",
          { ctx: "plan-coord", guide: [G("On pose " + M(vr + " = 0") + " : " + M("t") + " = ?", t, M(t) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(A.map((x, i) => (i === k ? 0 : x)), "Calcule t, puis les deux autres coordonnées."), TP(A.map((x, i) => (i === k ? 0 : r6(x - t * u[i]))), "Attention au signe de t.")] }); },
      () => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, -3]), Q = add(A, mul(t, u)); if (Math.abs(Q[2]) < 2) return null;
        return QN("Le point " + M("P(" + fT(Q[0]) + " \\,;\\, " + fT(Q[1]) + " \\,;\\, m)") + " appartient à la droite " + eqD(A, u) + ". Que vaut " + M("m") + " ?", Q[2], "Avec " + M("x") + " : " + M("t = " + t) + " (même valeur avec " + M("y") + ") ; " + M("m = " + fT(A[2]) + " + " + par(u[2]) + " \\cdot " + par(t) + " = " + fT(Q[2])) + ".",
          { ctx: "coordonnee-manquante", guide: [G(M("t") + " (avec l'équation de x) ?", t, M(t) + "."), G(M("m") + " ?", Q[2], M(fT(Q[2])) + ".")],
            traps: [TR(A[2] + u[2] * Q[0], "Remplace t (et non x) dans l'équation de z."), TR(A[2] + u[2], "Calcule d'abord t avec x."), TR(u[2] * t, "N'oublie pas le terme constant " + A[2] + ".")] }); },
      () => { const A = rp(4), B = rp(4), u = rv(3), t = pk([2, 3, -2]); if (A.every((x, i) => x === B[i])) return null; const Q = add(B, mul(t, u));
        return QP("La droite " + M("d") + " passe par " + ptN("B", B) + " et est parallèle à la droite " + M("d'") + " : " + eqD(A, u) + ". On paramètre " + M("d") + " avec le même vecteur directeur que " + M("d'") + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + TRIP, Q, "Vecteur directeur de " + M("d'") + " : " + M(v3(u)) + ". " + M("d") + " : " + M("B + t\\," + v3(u)) + " ; pour " + M("t = " + t) + " : " + pt(Q) + ".",
          { ctx: "parallele", guide: [GP("Vecteur directeur de " + M("d'") + " ?", u, M(v3(u)) + "."), GP("Point " + M("B + " + t + "\\vec{u}") + " ?", Q, pt(Q) + ".")],
            traps: [TP(add(A, mul(t, u)), "C'est le point de d' ; d passe par B."), TP(add(B, u), "Remplace t par " + t + "."), TP(add(B, mul(t, A)), "Le vecteur directeur est formé des coefficients de t, pas du point de départ.")] }); },
    ],
    3: [
      () => { const Pp = rp(4), u = rv(3), v = rv(3); if (isZ(cross(u, v))) return null; const t0 = pk([1, -1, 2, -2]), s0 = pk([1, 2, -1, -2, 3]), A = sub(Pp, mul(t0, u)), B = sub(Pp, mul(s0, v));
        return QP("Les droites " + M("d_1") + " : " + eqD(A, u) + " et " + M("d_2") + " : " + eqD(B, v, "s") + " sont sécantes. Donne leur point d'intersection." + TRIP, Pp, "On égalise les coordonnées (système en " + M("t") + " et " + M("s") + ") : " + M("t = " + t0) + ", " + M("s = " + s0) + " (la troisième équation vérifie). Point " + pt(Pp) + ".",
          { ctx: "intersection", guide: [G(M("t") + " ?", t0, M(t0) + "."), G(M("s") + " ?", s0, M(s0) + "."), GP("Point (avec " + M("t") + " dans " + M("d_1") + ") ?", Pp, pt(Pp) + ".")],
            traps: [TP(add(A, mul(s0, u)), "Dans d₁, remplace t (pas s)."), TP(add(B, mul(t0, v)), "Dans d₂, remplace s (pas t)."), TP(A, "C'est le point de d₁ pour t = 0.")] }); },
      () => { const z0 = pk([0.2, 0.3, 0.5]), w = pk([0.2, 0.25, 0.4, 0.5]), t = R.int(4, 15), h = r6(z0 + w * t), vx = pk([3, 4, 5, 6]), vy = pk([2, 3, 4, -3, -2]), x0 = R.int(-5, 5), y0 = R.int(-5, 5);
        return QN("Un avion décolle ; " + M("t") + " minutes après le décollage, sa position (en km) est " + eqD([x0, y0, z0], [vx, vy, w]).replace(/\\frac\{(\d+)\}\{(\d+)\}/g, (m, a, b) => nb(r6(a / b))) + ". Au bout de combien de minutes atteint-il l'altitude de " + M(nb(h) + tu("km")) + " ?", t, M(nb(z0) + " + " + nb(w) + "t = " + nb(h)) + ", donc " + M("t = \\frac{" + nb(r6(h - z0)) + "}{" + nb(w) + "} = " + t) + " min.",
          { ctx: "avion", guide: [G("Altitude à gagner depuis le décollage (en km) ?", h - z0, M(nb(h) + " - " + nb(z0) + " = " + nb(r6(h - z0))) + "."), G(M("t") + " (en min) ?", t, M(t) + ".")],
            traps: [TR(r6(h / w), "L'avion part de l'altitude " + String(z0).replace(".", ",") + " km : retire-la d'abord."), TR(r6(h - z0), "Divise encore par " + String(w).replace(".", ",") + " (km par minute).")] }); },
      () => { const A = rp(4), u0 = nz(-3, 3), u1 = nz(-3, 3), m = nz(-4, 4), t0 = pk([2, 3, -2]), Q = add(A, mul(t0, [u0, u1, m])); if (Math.abs(m) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " la droite " + M("d") + " : " + M("\\begin{cases} x = " + cmp(A[0], [u0], ["t"]) + " \\\\ y = " + cmp(A[1], [u1], ["t"]) + " \\\\ z = " + cmp(A[2], [1], ["mt"]) + " \\end{cases}") + " passe-t-elle par " + ptN("P", Q) + " ?", m, "Avec " + M("x") + " : " + M("t = " + t0) + " (même valeur avec " + M("y") + ") ; puis " + M(fT(Q[2]) + " = " + fT(A[2]) + " + " + t0 + "m") + ", donc " + M("m = " + m) + ".",
          { ctx: "parametre-direction", guide: [G(M("t") + " (avec x) ?", t0, M(t0) + "."), G(M("m") + " ?", m, M("\\frac{" + fT(Q[2]) + " - " + par(A[2]) + "}{" + t0 + "} = " + m) + ".")],
            traps: [TR(Q[2] - A[2], "Divise encore par t = " + t0 + "."), TR(r6((Q[2] + A[2]) / t0), "On soustrait " + A[2] + " avant de diviser."), TR(-m, "Attention au signe.")] }); },
    ],
  };

  // ======================= plans : équations d'un plan (3.GV.03c, 03e) =======================
  const PL = {
    1: [
      () => { const A = rp(4), u = rv(2), v = rv(2); if (isZ(cross(u, v))) return null; const s = pk([2, -1, 3, -2]), t = pk([2, 3, -2, -1]); if (s === t) return null; const Q = add(A, add(mul(s, u), mul(t, v)));
        return QP("Le plan " + M("\\pi") + " a pour équations paramétriques " + eqPl(A, u, v) + ". Donne le point de " + M("\\pi") + " obtenu pour " + M("s = " + s) + " et " + M("t = " + t) + "." + TRIP, Q, "On remplace " + M("s") + " et " + M("t") + " : " + pt(Q) + ".",
          { ctx: "point-st", guide: [G(M("x") + " ?", Q[0], M(fT(Q[0])) + "."), G(M("y") + " ?", Q[1], M(fT(Q[1])) + "."), G(M("z") + " ?", Q[2], M(fT(Q[2])) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(add(A, add(mul(t, u), mul(s, v))), "s multiplie le premier vecteur directeur et t le second."), TP(add(mul(s, u), mul(t, v)), "N'oublie pas le point de départ.")] }); },
      () => { const n = rv(4), x0 = R.int(-4, 4), y0 = R.int(-4, 4), m = nz(-5, 5); if (Math.abs(m) < 2) return null; const d = -(n[0] * x0 + n[1] * y0 + n[2] * m), K = n[0] * x0 + n[1] * y0 + d;
        return QN("Le point " + M("P(" + fT(x0) + " \\,;\\, " + fT(y0) + " \\,;\\, m)") + " appartient au plan " + M("\\pi : " + plT(n, d)) + ". Que vaut " + M("m") + " ?", m, "On remplace : " + M(lt([n[0] * x0, n[1] * y0, d], ["", "", ""]) + " + " + co(n[2]) + "m = 0").replace("+ -", "- ") + ", soit " + M(lt([n[2], K], ["m", ""]) + " = 0") + ", donc " + M("m = " + m) + ".",
          { ctx: "point-plan-m", guide: [G("Somme des termes connus " + M(fT(n[0]) + " \\cdot " + par(x0) + " + " + fT(n[1]) + " \\cdot " + par(y0) + " + " + par(d)) + " ?", K, M(K) + "."), G(M("m") + " ?", m, M(lt([n[2]], ["m"]) + " = " + fT(-K)) + ", " + M("m = " + m) + ".")],
            traps: [TR(-m, "Attention au signe : " + n[2] + "m = " + (-K) + "."), TR(-K, "Divise encore par " + n[2] + "."), TR(r6(K / n[2]), "On isole m : " + n[2] + "m = −(" + K + ").")] }); },
      () => { const n = rv(4), k = R.int(0, 2), w = nz(-6, 6); if (Math.abs(w) < 2) return null; const d = -n[k] * w, Q = [0, 0, 0]; Q[k] = w; const ax = ["Ox", "Oy", "Oz"][k];
        return QP("En quel point le plan " + M("\\pi : " + plT(n, d)) + " coupe-t-il l'axe " + M(ax) + " ?" + TRIP, Q, "Sur l'axe " + M(ax) + ", les deux autres coordonnées sont nulles : " + M(lt([n[k], d], [["x", "y", "z"][k], ""]) + " = 0") + ", d'où " + pt(Q) + ".",
          { ctx: "trace-axe", guide: [G("Coordonnée non nulle (" + M(["x", "y", "z"][k]) + ") ?", w, M(fT(w)) + "."), GP("Point ?", Q, pt(Q) + ".")],
            traps: [TP(Q.map((x) => -x), "Attention au signe : " + n[k] + "·" + ["x", "y", "z"][k] + " = " + (-d) + "."), TP([0, 1, 2].map((i) => (i === (k + 1) % 3 ? w : 0)), "Sur l'axe " + ax + ", c'est la coordonnée " + ["x", "y", "z"][k] + " qui n'est pas nulle.")] }); },
    ],
    2: [
      () => { const n = rv(4), A = rp(4), d0 = nz(-6, 6), d = -dot(n, A); if (Math.abs(d) < 2 || d === d0) return null;
        return QN("Le plan " + M("\\pi'") + " passe par " + ptN("A", A) + " et est parallèle au plan " + M("\\pi : " + plT(n, d0)) + ". Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, "Plans parallèles : même vecteur normal " + M(v3(n)) + ". " + M("A \\in \\pi'") + " : " + M("d = -(" + fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + ") = " + d) + ".",
          { ctx: "parallele", guide: [G(M("ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("d") + " ?", d, M(d) + ".")],
            traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(d0, "C'est le d de π ; π' passe par A.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const s0 = nz(-2, 2), t0 = nz(-2, 2), Q = add(A, add(mul(s0, u), mul(t0, v))); if (Math.abs(Q[2]) < 2) return null;
        return QN("Le point " + M("P(" + fT(Q[0]) + " \\,;\\, " + fT(Q[1]) + " \\,;\\, m)") + " appartient au plan " + eqPl(A, u, v) + ". Que vaut " + M("m") + " ?", Q[2], "Les équations de " + M("x") + " et " + M("y") + " donnent " + M("s = " + s0) + " et " + M("t = " + t0) + " ; puis " + M("m = " + fT(Q[2])) + ".",
          { ctx: "param-appartenance", guide: [G(M("s") + " (système avec x et y) ?", s0, M(s0) + "."), G(M("t") + " ?", t0, M(t0) + "."), G(M("m") + " ?", Q[2], M(fT(Q[2])) + ".")],
            traps: [TR(A[2] + t0 * u[2] + s0 * v[2], "s multiplie le premier vecteur directeur, t le second."), TR(s0 * u[2] + t0 * v[2], "N'oublie pas le terme constant " + A[2] + ".")] }); },
      () => { const b = pk([1, -1, 2, -2]), p = nz(-3, 3), q = nz(-5, 5), c = nz(-4, 4), n = [b * p, b, c], d = b * q, ex = ltS([-p, -q], ["x", ""]);
        return QX("La trace du plan " + M("\\pi : " + plT(n, d)) + " dans le plan " + M("xOy") + " (où " + M("z = 0") + ") est une droite. Donne son équation sous la forme " + M("y = mx + h") + " (tape l'expression de " + M("y") + ").", ex, "Avec " + M("z = 0") + " : " + M(plT([n[0], n[1], 0], d)) + ", donc " + M("y = " + lt([-p, -q], ["x", ""])) + ".",
          { ctx: "trace-plan", guide: [GX("Équation avec " + M("z = 0") + " : isole " + M(fT(b) + "y") + ". " + M(fT(b) + "y") + " = ?", ltS([-b * p, -b * q], ["x", ""]), M(fT(b) + "y = " + lt([-b * p, -b * q], ["x", ""])) + "."), GX(M("y") + " = ?", ex, M("y = " + lt([-p, -q], ["x", ""])) + ".")],
            traps: [TX(ltS([p, q], ["x", ""]), "On fait passer les autres termes de l'autre côté : les signes changent."), TX(ltS([-b * p, -b * q], ["x", ""]), "Divise encore par " + b + "."), TX(ltS([-p, -q - c], ["x", ""]), "Dans le plan xOy, z = 0 : le terme en z disparaît.")] }); },
    ],
    3: [
      () => { const b = nz(-3, 3), c = pk([1, -1, 2, -2]), d = nz(-6, 6), n = [1, b, c], pts = [];
        for (let i = 0; i < 40 && pts.length < 3; i++) { const x = R.int(-4, 4), y = R.int(-3, 3), z = r6(-(x + b * y + d) / c); if (Number.isInteger(z) && Math.abs(z) <= 9 && !pts.some((q) => q[0] === x && q[1] === y)) pts.push([x, y, z]); }
        if (pts.length < 3 || isZ(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))) return null; const [A, B, C] = pts;
        return QP("Le plan passant par " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " a une équation de la forme " + M("x + by + cz + d = 0") + ". Trouve " + M("b") + ", " + M("c") + " et " + M("d") + ". Réponds « b ; c ; d ».", [b, c, d], "Chaque point vérifie l'équation : trois équations en " + M("b, c, d") + ". Solution : " + M("\\pi : " + plT(n, d)) + ".",
          { ctx: "trois-points", guide: [G(M("b") + " ?", b, M(b) + "."), G(M("c") + " ?", c, M(c) + "."), G(M("d") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [b, c, d], M(b + " \\,;\\, " + c + " \\,;\\, " + d) + ".")],
            traps: [TP([-b, -c, -d], "Le coefficient de x vaut 1 : vérifie les signes avec le point A."), TP([c, b, d], "b est le coefficient de y, c celui de z.")] }); },
      () => { const u = rv(3), v = rv(3); let n = red(cross(u, v)); if (isZ(n) || !n[0] || n.some((x) => Math.abs(x) > 12)) return null; if (n[0] < 0) n = mul(-1, n); const A = rp(3), d = -dot(n, A);
        return QP("Écris une équation cartésienne du plan " + M("\\pi") + " : " + eqPl(A, u, v) + " sous la forme " + M(lt([n[0]], ["x"]) + " + by + cz + d = 0") + ". Réponds « b ; c ; d ».", [n[1], n[2], d], "Un vecteur normal " + M("\\vec{n}") + " est orthogonal aux deux vecteurs directeurs " + M(v3(u)) + " et " + M(v3(v)) + " : " + M("\\vec{n} = " + v3(n)) + ". Avec " + ptN("A", A) + " : " + M("d = " + d) + ". " + M("\\pi : " + plT(n, d)) + ".",
          { ctx: "param-cartesienne", guide: [G("Vecteur normal " + M("\\begin{pmatrix} " + fT(n[0]) + " \\\\ b \\\\ c \\end{pmatrix}") + " orthogonal aux deux vecteurs directeurs (produits scalaires nuls). " + M("b") + " ?", n[1], M(n[1]) + "."), G(M("c") + " ?", n[2], M(n[2]) + "."), G(M("d = -(a x_A + b y_A + c z_A)") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [n[1], n[2], d], M(n[1] + " \\,;\\, " + n[2] + " \\,;\\, " + d) + ".")],
            traps: [TP([n[1], n[2], -d], "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TP([-n[1], -n[2], d], "Vérifie : n · u = 0 et n · v = 0.")] }); },
      () => { const p = pk([0.5, -0.5, 0.25, -0.25, 0.75]), q = pk([0.5, -0.5, 0.25, 0.75, -0.75]), r = R.int(6, 10), x1 = R.int(1, 4), y1 = R.int(1, 4), zf = (x, y) => r6(p * x + q * y + r), A = [x1, y1, zf(x1, y1)], B = [x1 + 4, y1, zf(x1 + 4, y1)], C = [x1, y1 + 4, zf(x1, y1 + 4)], X = R.int(5, 12), Y = R.int(5, 12), h = zf(X, Y);
        const pD = (u) => M("(" + u.map(nb).join(" \\,;\\, ") + ")");
        return QN("Un toit plat incliné passe par les points " + M("A") + pD(A) + ", " + M("B") + pD(B) + " et " + M("C") + pD(C) + " (coordonnées en m, " + M("z") + " = hauteur). Son équation s'écrit " + M("z = px + qy + r") + ". À quelle hauteur est le toit au-dessus du point " + M("(" + X + " \\,;\\, " + Y + " \\,;\\, 0)") + " ?", h, "De A à B, " + M("x") + " augmente de 4 : " + M("p = \\frac{" + nb(r6(B[2] - A[2])) + "}{4} = " + nb(p)) + " ; de A à C : " + M("q = " + nb(q)) + " ; avec A : " + M("r = " + r) + ". " + M("z = " + nb(p) + " \\cdot " + X + " + " + par(q).replace(/\\frac\{(\d+)\}\{(\d+)\}/, (m, a, b) => nb(r6(a / b))) + " \\cdot " + Y + " + " + r + " = " + nb(h)) + " m.",
          { ctx: "toit", guide: [G(M("p") + " (variation de " + M("z") + " de A à B, divisée par 4) ?", p, M(nb(p)) + "."), G(M("q") + " ?", q, M(nb(q)) + "."), G(M("r") + " ?", r, M(r) + "."), G("Hauteur au-dessus de " + M("(" + X + " \\,;\\, " + Y + ")") + " ?", h, M(nb(h)) + " m.")],
            traps: [TR(r6(p * X + q * Y), "N'oublie pas la constante r = " + r + "."), TR(r6(q * X + p * Y + r), "p multiplie x et q multiplie y."), TR(r6(4 * p * X + 4 * q * Y + r), "p = variation de z ÷ 4 (pour 1 m en x).")] }); },
    ],
  };

  // ======================= posrel : positions relatives, intersections (3.GV.03d) =======================
  const PO = {
    1: [
      () => { const n = rv(4), Pp = rp(4), d = -dot(n, Pp), u = rv(3); if (!dot(n, u)) return null; const t0 = pk([2, -2, 3, -1]), A = sub(Pp, mul(t0, u));
        return QP("Donne le point d'intersection de la droite " + M("d") + " : " + eqD(A, u) + " et du plan " + M("\\pi : " + plT(n, d)) + "." + TRIP, Pp, "On remplace " + M("x, y, z") + " dans l'équation du plan : équation du premier degré en " + M("t") + ", " + M("t = " + t0) + ". Point " + pt(Pp) + ".",
          { ctx: "droite-plan", guide: [G("Équation en " + M("t") + " obtenue en remplaçant dans " + M("\\pi") + ". " + M("t") + " = ?", t0, M(t0) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
            traps: [TP(A, "C'est le point de d pour t = 0 ; calcule t."), TP(sub(A, mul(t0, u)), "Attention au signe de t.")] }); },
      () => { const b = pk([1, -1, 2, -2]), a = nz(-4, 4), c = nz(-4, 4), u0 = nz(-3, 3), u2 = nz(-3, 3), m = r6(-(a * u0 + c * u2) / b); if (!Number.isInteger(m) || Math.abs(m) < 2) return null; const n = [a, b, c], d = nz(-6, 6);
        return QN("Pour quelle valeur de " + M("m") + " une droite de vecteur directeur " + M("\\vec{u} = \\begin{pmatrix} " + fT(u0) + " \\\\ m \\\\ " + fT(u2) + " \\end{pmatrix}") + " est-elle parallèle au plan " + M("\\pi : " + plT(n, d)) + " ?", m, "Parallèle au plan ⟺ " + M("\\vec{u}") + " orthogonal au vecteur normal " + M(v3(n)) + " : " + M(fT(a) + " \\cdot " + par(u0) + sgc(b, "m") + " + " + par(c) + " \\cdot " + par(u2) + " = 0") + ", donc " + M("m = " + m) + ".",
          { ctx: "parallele-m", guide: [G(M("a u_x + c u_z") + " ?", a * u0 + c * u2, M(a * u0 + c * u2) + "."), G(M("m") + " (avec " + M("\\vec{n} \\cdot \\vec{u} = 0") + ") ?", m, M(m) + ".")],
            traps: [TR(-m, "Attention au signe : " + b + "m = " + (-(a * u0 + c * u2)) + "."), TR(a * u0 + c * u2, "Divise par le coefficient de y."), TR(r6(b * u0 / a), "Droite parallèle au plan : u orthogonal à n (pas colinéaire).")] }); },
      () => { const n = rv(4), k = pk([2, 3, -2, -3]), d1 = nz(-6, 6), d2 = nz(-9, 9), m = k * n[1];
        return QN("Pour quelle valeur de " + M("m") + " les plans " + M("\\pi_1 : " + plT(n, d1)) + " et " + M("\\pi_2 : " + lt([k * n[0]], ["x"]) + " + my" + (k * n[2] < 0 ? " - " : " + ") + fT(Math.abs(k * n[2])) + "z" + (d2 < 0 ? " - " : " + ") + fT(Math.abs(d2)) + " = 0") + " sont-ils parallèles ?", m, "Plans parallèles : vecteurs normaux colinéaires. " + M("\\frac{" + fT(k * n[0]) + "}{" + fT(n[0]) + "} = " + k) + ", donc " + M("m = " + k + " \\cdot " + par(n[1]) + " = " + m) + ".",
          { ctx: "plans-paralleles", guide: [G("Facteur entre les vecteurs normaux ?", k, M(k) + "."), G(M("m") + " ?", m, M(m) + ".")],
            traps: [TR(n[1], "Les coefficients sont proportionnels : multiplie par " + k + "."), TR(r6(n[1] / k), "π₂ a les coefficients de π₁ multipliés par " + k + " : on multiplie."), TR(-m, "Attention au signe.")] }); },
    ],
    2: [
      () => { const Pp = rp(4), n1 = rv(3), n2 = rv(3); if (n1[0] * n2[1] - n1[1] * n2[0] === 0 || isZ(cross(n1, n2)) || Pp[0] === Pp[1] || !Pp[2]) return null; const d1 = -dot(n1, Pp), d2 = -dot(n2, Pp);
        return QP("Les plans " + M("\\pi_1 : " + plT(n1, d1)) + " et " + M("\\pi_2 : " + plT(n2, d2)) + " se coupent selon une droite. Donne le point de cette droite dont la cote vaut " + M("z = " + Pp[2]) + "." + TRIP, Pp, "Avec " + M("z = " + Pp[2]) + ", on résout le système en " + M("x") + " et " + M("y") + " : " + M("x = " + Pp[0]) + ", " + M("y = " + Pp[1]) + ". Point " + pt(Pp) + ".",
          { ctx: "deux-plans", guide: [G(M("x") + " ?", Pp[0], M(Pp[0]) + "."), G(M("y") + " ?", Pp[1], M(Pp[1]) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
            traps: [TP([Pp[1], Pp[0], Pp[2]], "Dans l'ordre : x, puis y, puis z.")] }); },
      () => { const n = rv(4), r = rv(2), u = red(cross(n, r)); if (isZ(u) || u.some((x) => Math.abs(x) > 9)) return null; const A = rp(4), d = -dot(n, A); if (Math.abs(d) < 2) return null;
        return QN("La droite " + M("d") + " : " + eqD(A, u) + " est parallèle au plan " + M("\\pi : " + lt(n, ["x", "y", "z"]) + " + k = 0") + " (vérifie-le : " + M("\\vec{n} \\cdot \\vec{u} = 0") + "). Pour quelle valeur de " + M("k") + " la droite est-elle contenue dans le plan ?", d, "Il suffit qu'un point de " + M("d") + " soit dans " + M("\\pi") + " : avec " + ptN("A", A) + ", " + M("k = -(" + fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + ") = " + d) + ".",
          { ctx: "droite-contenue", guide: [GP("Point de " + M("d") + " pour " + M("t = 0") + " ?", A, pt(A) + "."), G(M("ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("k") + " ?", d, M(d) + ".")],
            traps: [TR(-d, "k = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-dot(n, add(A, u)), "Le point de départ est celui obtenu pour t = 0.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const t0 = nz(-2, 2), s0 = nz(-2, 2), Pp = add(A, mul(t0, u)), B = sub(Pp, mul(s0, v)); if (Math.abs(B[2]) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " les droites " + M("d_1") + " : " + eqD(A, u) + " et " + M("d_2") + " : " + M("\\begin{cases} x = " + cmp(B[0], [v[0]], ["s"]) + " \\\\ y = " + cmp(B[1], [v[1]], ["s"]) + " \\\\ z = m" + (v[2] < 0 ? " - " : " + ") + (Math.abs(v[2]) === 1 ? "" : fT(Math.abs(v[2]))) + "s \\end{cases}") + " sont-elles sécantes ?", B[2], "Les équations de " + M("x") + " et " + M("y") + " donnent " + M("t = " + t0) + " et " + M("s = " + s0) + ". Les cotes doivent être égales : " + M(fT(Pp[2]) + " = m " + (v[2] * s0 < 0 ? "- " + fT(-v[2] * s0) : "+ " + fT(v[2] * s0))) + ", donc " + M("m = " + fT(B[2])) + ".",
          { ctx: "secantes-m", guide: [G(M("t") + " (système avec x et y) ?", t0, M(t0) + "."), G(M("s") + " ?", s0, M(s0) + "."), G(M("m") + " ?", B[2], M(fT(B[2])) + ".")],
            traps: [TR(Pp[2], "C'est la cote du point d'intersection ; m = cette cote − (" + v[2] + ")·s."), TR(Pp[2] + v[2] * s0, "On retire " + v[2] + "·s (avec s = " + s0 + ").")] }); },
    ],
    3: [
      () => { const Pp = rp(3), ns = [rv(3), rv(3), rv(3)]; if (Math.abs(det3(...ns)) < 1e-9 || new Set(Pp).size < 3) return null; const ds = ns.map((n) => -dot(n, Pp));
        return QP("Donne le point d'intersection des trois plans " + M("\\pi_1 : " + plT(ns[0], ds[0])) + ", " + M("\\pi_2 : " + plT(ns[1], ds[1])) + " et " + M("\\pi_3 : " + plT(ns[2], ds[2])) + "." + TRIP, Pp, "Système de trois équations à trois inconnues (substitution ou combinaisons) : " + pt(Pp) + ".",
          { ctx: "trois-plans", guide: [G(M("x") + " ?", Pp[0], M(Pp[0]) + "."), G(M("y") + " ?", Pp[1], M(Pp[1]) + "."), G(M("z") + " ?", Pp[2], M(Pp[2]) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
            traps: [TP(mul(-1, Pp), "Vérifie dans π₁ : attention aux signes."), TP([Pp[2], Pp[1], Pp[0]], "Dans l'ordre : x, y, z.")] }); },
      () => { const n = rv(3), Pp = rp(3), d = -dot(n, Pp), u = rv(3); if (!dot(n, u)) return null; const t0 = pk([2, 3, -1, -2]), A = sub(Pp, mul(t0, u)), B = add(A, u);
        return QP("La droite " + M("(AB)") + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ", perce le plan " + M("\\pi : " + plT(n, d)) + " en un point " + M("I") + ". Donne ses coordonnées." + TRIP, Pp, M("(AB) : A + t\\," + vec("AB")) + " avec " + M(vec("AB") + " = " + v3(u)) + " ; dans " + M("\\pi") + " : " + M("t = " + t0) + " ; " + M("I") + pt(Pp) + ".",
          { ctx: "droite-AB-plan", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), G(M("t") + " (on remplace " + M("A + t\\," + vec("AB")) + " dans " + M("\\pi") + ") ?", t0, M(t0) + "."), GP("Point " + M("I") + " ?", Pp, pt(Pp) + ".")],
            traps: [TP(add(B, mul(t0, u)), "Avec A + t·AB, on part de A, pas de B."), TP(sub(A, mul(t0, u)), "Attention au signe de t.")] }); },
      () => { const [h, t] = pk([[6, 2], [6, 3], [8, 2], [12, 2], [12, 3], [9, 3], [10, 2]]), pz = r6(h * (t - 1) / t), S = [R.int(-3, 3), R.int(-3, 3), h], Pz = [S[0] + nz(-4, 4), S[1] + nz(-4, 4), pz], O = add(S, mul(t, sub(Pz, S)));
        return QP("Une lampe ponctuelle est en " + ptN("S", S) + " ; le sommet d'un poteau vertical est en " + ptN("P", Pz) + " (en m). Où se trouve l'ombre de " + M("P") + " sur le sol (plan " + M("z = 0") + ") ?" + TRIP, O, "L'ombre est sur la droite " + M("(SP)") + " : " + M("S + t\\," + vec("SP")) + " avec " + M(vec("SP") + " = " + v3(sub(Pz, S))) + ". " + M("z = 0") + " donne " + M("t = " + t) + " : ombre en " + pt(O) + ".",
          { ctx: "ombre", guide: [GP(M(vec("SP")) + " ?", sub(Pz, S), M(v3(sub(Pz, S))) + "."), G(M("t") + " tel que " + M("z = 0") + " ?", t, M(fT(h) + " " + (pz - h < 0 ? "- " + fT(h - pz) : "+ " + fT(pz - h)) + "t = 0") + ", " + M("t = " + t) + "."), GP("Ombre ?", O, pt(O) + ".")],
            traps: [TP([Pz[0], Pz[1], 0], "L'ombre n'est pas au pied du poteau : prolonge la droite SP jusqu'au sol."), TP([S[0], S[1], 0], "C'est le point du sol sous la lampe."), TP(add(S, mul(2 * t, sub(Pz, S))).map((x, i) => (i === 2 ? 0 : x)), "Calcule t avec la cote : z = 0.")] }); },
    ],
  };

  // ======================= pscal3d : produit scalaire dans l'espace (3.GV.04a–c) =======================
  const PS = {
    1: [
      () => { const u = rv(5), v = rv(5), p = dot(u, v); if (Math.abs(p) < 2) return null;
        return QN("Calcule le produit scalaire " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + vN("u", u) + " et " + vN("v", v) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + u.map((x, i) => par(x) + " \\cdot " + par(v[i])).join(" + ") + " = " + p) + ".",
          { ctx: "calcul", guide: [G("Somme des deux premiers produits " + M("u_x v_x + u_y v_y") + " ?", u[0] * v[0] + u[1] * v[1], M(u[0] * v[0] + u[1] * v[1]) + "."), G("Avec " + M("u_z v_z") + " ?", p, M(p) + ".")],
            traps: [TR(u[0] * v[0] + u[1] * v[1], "Il y a trois produits dans l'espace : n'oublie pas z."), TR(u[0] * v[0] + u[1] * v[1] - u[2] * v[2], "On additionne les trois produits."), TR(u[0] + u[1] + u[2] + v[0] + v[1] + v[2], "On multiplie composante par composante, puis on additionne.")] }); },
      () => { const u = [nz(-4, 4), pk([1, -1, 2, -2]), nz(-4, 4)], v0 = nz(-4, 4), v2 = nz(-4, 4), m = r6(-(u[0] * v0 + u[2] * v2) / u[1]); if (!Number.isInteger(m) || Math.abs(m) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + vN("u", u) + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(v0) + " \\\\ m \\\\ " + fT(v2) + " \\end{pmatrix}") + " sont-ils orthogonaux ?", m, "Orthogonaux ⟺ " + M("\\vec{u} \\cdot \\vec{v} = 0") + " : " + M(par(u[0]) + " \\cdot " + par(v0) + sgc(u[1], "m") + " + " + par(u[2]) + " \\cdot " + par(v2) + " = 0") + ", donc " + M("m = " + m) + ".",
          { ctx: "orthogonal-m", guide: [G(M("u_x v_x + u_z v_z") + " ?", u[0] * v0 + u[2] * v2, M(u[0] * v0 + u[2] * v2) + "."), G(M("m") + " ?", m, M(m) + ".")],
            traps: [TR(-m, "Attention au signe : " + u[1] + "m = " + (-(u[0] * v0 + u[2] * v2)) + "."), TR(u[0] * v0 + u[2] * v2, "Divise par " + u[1] + " (et change de côté).")] }); },
      () => { const u = rv(3), v = rv(3), c = dot(u, v) / (nrm(u) * nrm(v)); if (Math.abs(c) > 0.999 || Math.abs(c) < 1e-9) return null; const a = angle(u, v);
        return QR("Calcule l'angle entre les vecteurs " + vN("u", u) + " et " + vN("v", v) + " (en degrés, arrondi au dixième).", a, 0.1, M("\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|} = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + ".",
          { ctx: "angle", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\cos\\alpha") + " (au millième) ?", c, M(D(c, 0.001)) + ".", 0.001), G(M("\\alpha") + " (au dixième de degré) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - a, "L'angle de deux vecteurs est entre 0° et 180° : garde le signe du produit scalaire."), TR(Math.acos(c), "Donne l'angle en degrés, pas en radians."), TR(DEG * Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nn2(u) * nn2(v))))), "On divise par le produit des normes (avec les racines).")] }); },
    ],
    2: [
      () => { const A = rp(4), B = rp(4), C = rp(4), u = sub(B, A), v = sub(C, A); if (isZ(cross(u, v))) return null; const a = angle(u, v);
        return QR("Calcule l'angle " + M("\\widehat{BAC}") + " du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " (en degrés, au dixième).", a, 0.1, M(vec("AB") + " = " + v3(u)) + ", " + M(vec("AC") + " = " + v3(v)) + " ; " + M("\\cos\\widehat{BAC} = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\widehat{BAC} \\approx " + D(a, 0.1) + "°") + ".",
          { ctx: "angle-triangle", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), GP(M(vec("AC")) + " ?", v, M(v3(v)) + "."), G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", dot(u, v), M(dot(u, v)) + "."), G("Angle (au dixième) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
            traps: [TR(180 - a, "Les deux vecteurs partent de A : AB et AC (pas BA)."), TR(angle(sub(A, B), sub(C, B)), "C'est l'angle en B ; on demande l'angle en A.")] }); },
      () => { const [u, d] = qv(4), v = rv(5), p = dot(u, v); if (!p || den(Math.abs(p) / d) === 1 && Math.abs(p) / d < 2) return null; const L = Math.abs(p) / d;
        return QN("Calcule la longueur de la projection orthogonale du vecteur " + vN("v", v) + " sur la direction de " + vN("u", u) + " (fractions acceptées).", L, "Longueur " + M("\\frac{|\\vec{u} \\cdot \\vec{v}|}{\\|\\vec{u}\\|} = " + frT(Math.abs(p), d)) + ".",
          { ctx: "projection-longueur", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{u}\\|") + " ?", d, M("\\sqrt{" + d * d + "} = " + d) + "."), G("Longueur de la projection ?", L, M(fT(L)) + ".")],
            traps: [TR(Math.abs(p) / (d * d), "On divise par ‖u‖, pas par ‖u‖² (‖u‖² sert pour le vecteur projeté)."), TR(Math.abs(p), "Divise par la norme de u.")] }); },
      () => { const A = rp(3), p = [nz(-3, 3), nz(-3, 3), pk([1, -1, 2, -2])], c0 = nz(-3, 3), c1 = nz(-3, 3), w2 = r6(-(p[0] * c0 + p[1] * c1) / p[2]); if (!Number.isInteger(w2)) return null; const B = add(A, p), C = [A[0] + c0, A[1] + c1, A[2] + w2]; if (Math.abs(C[2]) < 2) return null;
        return QN("Pour quelle valeur de " + M("m") + " le triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, m)") + " est-il rectangle en " + M("A") + " ?", C[2], "Rectangle en A ⟺ " + M(vec("AB") + " \\cdot " + vec("AC") + " = 0") + " : " + M(par(p[0]) + " \\cdot " + par(c0) + " + " + par(p[1]) + " \\cdot " + par(c1) + " + " + par(p[2]) + "(m - " + par(A[2]) + ") = 0") + ", donc " + M("m = " + fT(C[2])) + ".",
          { ctx: "rectangle-m", guide: [GP(M(vec("AB")) + " ?", p, M(v3(p)) + "."), G("Somme des deux premiers produits de " + M(vec("AB") + " \\cdot " + vec("AC")) + " ?", p[0] * c0 + p[1] * c1, M(p[0] * c0 + p[1] * c1) + "."), G(M("m") + " ?", C[2], M(fT(C[2])) + ".")],
            traps: [TR(w2, "C'est la troisième composante de AC ; m = z_A + (AC)_z."), TR(A[2] - w2, "Attention au signe."), TR(r6(-(p[0] * C[0] + p[1] * C[1]) / p[2]), "Utilise les composantes du vecteur AC, pas les coordonnées de C.")] }); },
    ],
    3: [
      () => { const base = pk([[1, 2, 2], [1, 1, 1], [2, 1, 2], [1, 1, 2], [1, 2, 3]]), u = perm(base).map((x) => x * sgn()), v = rv(4), k = dot(u, v) / nn2(u); if (!k || den(k) > 3) return null; const w = mul(k, u);
        return QP("Donne le projeté orthogonal du vecteur " + vN("v", v) + " sur la droite dirigée par " + vN("u", u) + " (le vecteur projeté)." + TRIP + " (fractions acceptées)", w, "Vecteur projeté " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}\\,\\vec{u} = \\frac{" + dot(u, v) + "}{" + nn2(u) + "}\\,\\vec{u} = " + v3(w)) + ".",
          { ctx: "projection-vecteur", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\|\\vec{u}\\|^2") + " ?", nn2(u), M(nn2(u)) + "."), G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}") + " ?", k, M(fT(k)) + "."), GP("Vecteur projeté ?", w, M(v3(w)) + ".")],
            traps: [TP(mul(dot(u, v), u), "Divise par ‖u‖² = " + nn2(u) + "."), TP(mul(-k, u), "Attention au signe du produit scalaire."), TP(mul(k, v), "Le vecteur projeté est colinéaire à u (on multiplie u, pas v).")] }); },
      () => { const { u, w, n } = orth(2), A = rp(3), t0 = pk([1, -1, 2]), H = add(A, mul(t0, u)), Pp = add(H, w), AP = sub(Pp, A);
        return QP("Donne le projeté orthogonal " + M("H") + " du point " + ptN("P", Pp) + " sur la droite " + M("d") + " : " + eqD(A, u) + "." + TRIP, H, M("H = A + t\\,\\vec{u}") + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2} = \\frac{" + dot(AP, u) + "}{" + n * n + "} = " + t0) + " : " + M("H") + pt(H) + ".",
          { ctx: "pied-droite", guide: [GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M(vec("AP") + " \\cdot \\vec{u}") + " ?", dot(AP, u), M(dot(AP, u)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}") + " ?", t0, M(t0) + "."), GP("Point " + M("H") + " ?", H, pt(H) + ".")],
            traps: [TP(add(A, mul(t0 * n, u)), "Divise par ‖u‖² = " + n * n + " (pas par ‖u‖)."), TP(A, "C'est le point de d pour t = 0."), TP(add(A, mul(dot(AP, u), u)), "t = (AP · u) ÷ ‖u‖².")] }); },
      () => { const L = R.int(2, 9), l = R.int(2, 9), h = R.int(2, 9); if (L === l || l === h || L === h) return null; const kind = pk(["arete", "base", "face"]), g = [L, l, h], o = kind === "arete" ? [L, 0, 0] : kind === "base" ? [L, l, 0] : [0, l, h], a = angle(g, o);
        const nom = kind === "arete" ? "l'arête " + M("[AB]") : kind === "base" ? "la diagonale " + M("[AC]") + " de la base" : "la diagonale " + M("[AH]") + " de la face " + M("ADHE");
        const oT = kind === "arete" ? vec("AB") : kind === "base" ? vec("AC") : vec("AH");
        return QR("Un pavé droit " + M("ABCDEFGH") + " a pour dimensions " + M("AB = " + L) + ", " + M("AD = " + l) + " et " + M("AE = " + h) + ". Dans le repère d'origine " + M("A") + " (axes selon " + M("[AB]") + ", " + M("[AD]") + ", " + M("[AE]") + "), " + M("G") + pt(g) + ". Calcule l'angle entre la diagonale " + M("[AG]") + " et " + nom + " (en degrés, au dixième).", a, 0.1,
          M(vec("AG") + " = " + v3(g)) + ", " + M(oT + " = " + v3(o)) + " ; " + M("\\cos\\alpha = \\frac{" + dot(g, o) + "}{\\sqrt{" + nn2(g) + "} \\cdot \\sqrt{" + nn2(o) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + ".",
          { ctx: "pave-" + kind, guide: [GP("Composantes de " + M(oT) + " ?", o, M(v3(o)) + "."), G(M(vec("AG") + " \\cdot " + oT) + " ?", dot(g, o), M(dot(g, o)) + "."), G("Angle (au dixième) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
            traps: [TR(90 - a, "C'est le complémentaire : vérifie avec cos α = (AG · v) ÷ (‖AG‖ ‖v‖)."), TR(DEG * Math.acos(dot(g, o) / nn2(g)), "Divise par le produit des deux normes.")] }); },
    ],
  };

  // ======================= distances : point-droite, point-plan, aire (3.GV.04d, 04e) =======================
  const DI = {
    1: [
      () => { const [n, nn] = qv(5), Pp = rp(4), m = R.int(2, 3 * nn); if (m % nn === 0 && m / nn < 2) return null; const s = sgn(), d = s * m - dot(n, Pp), L = m / nn;
        return QN("Calcule la distance du point " + ptN("P", Pp) + " au plan " + M("\\pi : " + plT(n, d)) + " (fractions acceptées).", L, M("\\delta = \\frac{|" + fT(n[0]) + " \\cdot " + par(Pp[0]) + " + " + fT(n[1]) + " \\cdot " + par(Pp[1]) + " + " + fT(n[2]) + " \\cdot " + par(Pp[2]) + " + " + par(d) + "|}{\\sqrt{" + nn * nn + "}} = " + frT(m, nn)) + ".",
          { ctx: "point-plan", guide: [G("On remplace " + M("P") + " dans le membre de gauche : " + M("ax_P + by_P + cz_P + d") + " = ?", s * m, M(s * m) + "."), G("Norme du vecteur normal ?", nn, M("\\sqrt{" + nn * nn + "} = " + nn) + "."), G("Distance ?", L, M(fT(L)) + ".")],
            traps: [TR(m, "Divise par la norme du vecteur normal."), TR(m / (nn * nn), "On divise par ‖n‖, pas par ‖n‖²."), TR(-L, "Une distance est positive : valeur absolue.")] }); },
      () => { const [n, nn] = qv(5), d1 = nz(-9, 9), m = R.int(2, 2 * nn), d2 = d1 + m * sgn(), L = m / nn; if (m % nn === 0 && L < 2) return null;
        return QN("Calcule la distance entre les plans parallèles " + M("\\pi_1 : " + plT(n, d1)) + " et " + M("\\pi_2 : " + plT(n, d2)) + " (fractions acceptées).", L, "Même vecteur normal " + M(v3(n)) + " de norme " + M(nn) + " : " + M("\\delta = \\frac{|" + fT(d1) + " - " + par(d2) + "|}{" + nn + "} = " + fT(L)) + ".",
          { ctx: "plans-paralleles", guide: [G(M("|d_1 - d_2|") + " ?", m, M(m) + "."), G(M("\\|\\vec{n}\\|") + " ?", nn, M(nn) + "."), G("Distance ?", L, M(fT(L)) + ".")],
            traps: [TR(Math.abs(d1 + d2) / nn, "On soustrait d₁ − d₂ (même vecteur normal)."), TR(m, "Divise par la norme du vecteur normal.")] }); },
      () => { const { u, w, n } = orth(), k1 = n > 3 ? 1 : pk([1, 2]), k2 = n > 3 ? 1 : pk([1, 2]), A = rp(3), B = add(A, mul(k1, u)), C = add(A, mul(k2, w)), S = (k1 * k2 * n * n) / 2;
        return QN("Le triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " est rectangle en " + M("A") + " (vérifie-le : " + M(vec("AB") + " \\cdot " + vec("AC") + " = 0") + "). Calcule son aire.", S, M("AB = \\sqrt{" + k1 * k1 * n * n + "} = " + k1 * n) + ", " + M("AC = " + k2 * n) + " ; aire " + M("\\frac{" + k1 * n + " \\cdot " + k2 * n + "}{2} = " + fT(S)) + ".",
          { ctx: "aire-rectangle", guide: [G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", 0, M("0") + " : rectangle en A."), G(M("AB") + " ?", k1 * n, M(k1 * n) + "."), G(M("AC") + " ?", k2 * n, M(k2 * n) + "."), G("Aire ?", S, M(fT(S)) + ".")],
            traps: [TR(2 * S, "Aire d'un triangle rectangle : produit des côtés de l'angle droit ÷ 2."), TR((k1 + k2) * n, "L'aire est un produit (÷ 2), pas une somme.")] }); },
    ],
    2: [
      () => { const { u, w, n } = orth(2), k = pk([1, 2]), A = rp(3), t0 = pk([1, -1, 2, -2]), H = add(A, mul(t0, u)), Pp = add(H, mul(k, w)), AP = sub(Pp, A);
        return QN("Calcule la distance du point " + ptN("P", Pp) + " à la droite " + M("d") + " : " + eqD(A, u) + ".", k * n, "Pied de la perpendiculaire : " + M("H = A + t\\,\\vec{u}") + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2} = " + t0) + ", " + M("H") + pt(H) + " ; " + M("PH = \\sqrt{" + k * k * n * n + "} = " + k * n) + ".",
          { ctx: "point-droite", guide: [GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}") + " ?", t0, M(t0) + "."), GP("Pied " + M("H") + " ?", H, pt(H) + "."), G("Distance " + M("PH") + " ?", k * n, M(k * n) + ".")],
            traps: [TR(nrm(AP), "C'est la distance AP ; la distance à la droite se mesure perpendiculairement (pied H)."), TR(k * k * n * n, "N'oublie pas la racine carrée.")] }); },
      () => { const A = rp(3), u = rv(3), v = rv(3); if (isZ(cross(u, v)) || !dot(u, v)) return null; const S = 0.5 * Math.sqrt(nn2(u) * nn2(v) - dot(u, v) ** 2), B = add(A, u), C = add(A, v);
        return QR("Calcule l'aire du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " (arrondie au centième). Utilise " + M("\\mathcal{A} = \\frac{1}{2}\\sqrt{AB^2 \\cdot AC^2 - (" + vec("AB") + " \\cdot " + vec("AC") + ")^2}") + ".", S, 0.01, M("AB^2 = " + nn2(u)) + ", " + M("AC^2 = " + nn2(v)) + ", " + M(vec("AB") + " \\cdot " + vec("AC") + " = " + dot(u, v)) + " ; " + M("\\mathcal{A} = \\frac{1}{2}\\sqrt{" + nn2(u) * nn2(v) + " - " + dot(u, v) ** 2 + "} \\approx " + D(S, 0.01)) + ".",
          { ctx: "aire-formule", guide: [G(M("AB^2") + " ?", nn2(u), M(nn2(u)) + "."), G(M("AC^2") + " ?", nn2(v), M(nn2(v)) + "."), G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", dot(u, v), M(dot(u, v)) + "."), G("Aire (au centième) ?", S, M(D(S, 0.01)) + ".", 0.01)],
            traps: [TR(0.5 * nrm(u) * nrm(v), "½·AB·AC n'est l'aire que si le triangle est rectangle en A."), TR(2 * S, "N'oublie pas le facteur ½."), TR(0.5 * Math.sqrt(nn2(u) * nn2(v) + dot(u, v) ** 2), "On soustrait le carré du produit scalaire.")] }); },
      () => { const [n, nn] = qv(5), r = rv(2), u = red(cross(n, r)); if (isZ(u) || u.some((x) => Math.abs(x) > 9)) return null; const A = rp(3), m = R.int(2, 3 * nn); if (m % nn === 0 && m / nn < 2) return null; const s = sgn(), d = s * m - dot(n, A), L = m / nn;
        return QN("La droite " + M("d") + " : " + eqD(A, u) + " est parallèle au plan " + M("\\pi : " + plT(n, d)) + ". Calcule la distance entre " + M("d") + " et " + M("\\pi") + " (fractions acceptées).", L, M("\\vec{n} \\cdot \\vec{u} = 0") + " : tous les points de " + M("d") + " sont à la même distance de " + M("\\pi") + ". Avec " + ptN("A", A) + " : " + M("\\delta = " + frT(m, nn)) + ".",
          { ctx: "droite-plan", guide: [G(M("\\vec{n} \\cdot \\vec{u}") + " ?", 0, M("0") + " : la droite est parallèle au plan."), G("On remplace " + M("A") + " (point de " + M("d") + ") dans le membre de gauche de " + M("\\pi") + " : valeur ?", s * m, M(s * m) + "."), G("Distance ?", L, M(fT(L)) + ".")],
            traps: [TR(m, "Divise par la norme du vecteur normal (" + nn + ")."), TR(Math.abs(dot(n, A)) / nn, "Remplace les coordonnées de A dans tout le membre de gauche, d compris.")] }); },
    ],
    3: [
      () => { const [n, nn] = qv(5), T = rp(3), m = R.int(2, 3 * nn), s = sgn(), d = s * m - dot(n, T), S = 3 * R.int(2, 9), h = m / nn, V = (S * h) / 3;
        return QN("La base d'une pyramide est un triangle du plan " + M("\\pi : " + plT(n, d)) + ", d'aire " + M(S) + ". Son sommet est " + ptN("T", T) + ". Calcule le volume de la pyramide (fractions acceptées).", V, "Hauteur = distance de " + M("T") + " à " + M("\\pi") + " : " + M("h = " + frT(m, nn)) + " ; " + M("V = \\frac{1}{3} \\cdot " + S + " \\cdot " + fT(h) + " = " + fT(V)) + ".",
          { ctx: "pyramide", guide: [G("Hauteur " + M("h") + " (distance de " + M("T") + " au plan) ?", h, M(fT(h)) + "."), G("Volume ?", V, M(fT(V)) + ".")],
            traps: [TR(S * h, "Volume d'une pyramide : base × hauteur ÷ 3."), TR((S * h) / 2, "Pyramide : on divise par 3."), TR((S * m) / 3, "La hauteur est m ÷ ‖n‖ = " + m + " ÷ " + nn + ".")] }); },
      () => { const [q0, nn] = qv(4); const iz = q0.findIndex((x) => Math.abs(x) <= 2); if (iz < 0) return null; const n = q0.slice(); [n[iz], n[2]] = [n[2], n[iz]]; const Dd = R.int(1, 3), m1 = R.int(-4, 4), m2 = r6(m1 - (2 * Dd * nn) / n[2]); if (!Number.isInteger(m2)) return null; const K = Dd * nn - n[2] * m1, p0 = R.int(-3, 3), p1 = R.int(-3, 3), d = K - n[0] * p0 - n[1] * p1;
        return QSet("Pour quelles valeurs de " + M("m") + " le point " + M("P(" + fT(p0) + " \\,;\\, " + fT(p1) + " \\,;\\, m)") + " est-il à la distance " + M(Dd) + " du plan " + M("\\pi : " + plT(n, d)) + " ? Sépare les valeurs par « ; ».", [m1, m2], M("\\frac{|" + lt([n[2], K], ["m", ""]) + "|}{" + nn + "} = " + Dd) + ", donc " + M(lt([n[2], K], ["m", ""]) + " = \\pm " + Dd * nn) + " : " + M("m = " + m1) + " ou " + M("m = " + m2) + ".",
          { ctx: "distance-donnee", guide: [G(M("\\|\\vec{n}\\|") + " ?", nn, M(nn) + "."), G("Valeur absolue du numérateur : " + M("|" + lt([n[2], K], ["m", ""]) + "|") + " = ?", Dd * nn, M(Dd + " \\cdot " + nn + " = " + Dd * nn) + "."), GSet("Valeurs de " + M("m") + " ?", [m1, m2], M("m = " + m1) + " ou " + M("m = " + m2) + ".")],
            traps: [TSt([m1], "Valeur absolue : deux cas, + et −."), TSt([r6((Dd - K) / n[2]), r6((-Dd - K) / n[2])], "Multiplie d'abord la distance par ‖n‖ = " + nn + ".")] }); },
      () => { const { u, w, n } = orth(2), s = pk([2, 3]), t0 = R.int(1, s - 1), k = pk([1, 2]), A = [R.int(-3, 3), R.int(-3, 3), R.int(5, 9)], B = add(A, mul(s, u)), Pp = add(add(A, mul(t0, u)), mul(k, w)), AB = sub(B, A), AP = sub(Pp, A), t = t0 / s;
        return QN("Un câble tendu relie " + ptN("A", A) + " et " + ptN("B", B) + " (en m). Un drone est en " + ptN("P", Pp) + ". À quelle distance minimale du câble se trouve-t-il ?", k * n, "Pied " + M("H = A + t\\," + vec("AB")) + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot " + vec("AB") + "}{AB^2} = \\frac{" + dot(AP, AB) + "}{" + nn2(AB) + "} = " + fT(t)) + " (entre A et B) ; " + M("PH = " + k * n) + " m.",
          { ctx: "cable", guide: [GP(M(vec("AB")) + " ?", AB, M(v3(AB)) + "."), GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot " + vec("AB") + "}{AB^2}") + " ?", t, M(fT(t)) + "."), G("Distance " + M("PH") + " ?", k * n, M(k * n) + " m.")],
            traps: [TR(nrm(AP), "C'est la distance PA ; la plus courte se mesure perpendiculairement au câble."), TR(Math.min(nrm(AP), nrm(sub(Pp, B))), "La distance au câble n'est pas la distance à une extrémité."), TR(k * k * n * n, "N'oublie pas la racine carrée.")] }); },
    ],
  };

  // ======================= sphere : vecteur normal, plan médiateur, sphère, plan tangent (3.GV.05a–d) =======================
  const SP = {
    1: [
      () => { const n = rv(4), A = rp(4), d = -dot(n, A); if (Math.abs(d) < 2) return null;
        return QN("Le plan " + M("\\pi") + " passe par " + ptN("A", A) + " et admet " + vN("n", n) + " comme vecteur normal. Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, M("A \\in \\pi") + " : " + M(fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + " + d = 0") + ", donc " + M("d = " + d) + ".",
          { ctx: "plan-normal", guide: [G(M("\\vec{n} \\cdot \\overrightarrow{OA} = ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("d") + " ?", d, M(d) + ".")],
            traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-(A[0] + A[1] + A[2]), "Multiplie chaque coordonnée de A par le coefficient correspondant.")] }); },
      () => { const C = rv(5), r2 = pk([4, 9, 16, 25, 7, 10, 12, 20]);
        return QP("Donne le centre de la sphère " + M(sphT(C, r2)) + "." + TRIP, C, "La sphère de centre " + M("(a \\,;\\, b \\,;\\, c)") + " et de rayon " + M("r") + " a pour équation " + M("(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2") + " : centre " + pt(C) + ".",
          { ctx: "sphere-centre", guide: [G(M("a") + " (dans " + M(sq("x", C[0])) + ") ?", C[0], M(C[0]) + "."), G(M("b") + " ?", C[1], M(C[1]) + "."), G(M("c") + " ?", C[2], M(C[2]) + "."), GP("Centre ?", C, pt(C) + ".")],
            traps: [TP(mul(-1, C), "(x − a)² : le centre a pour abscisse a ; « x + 2 » donne a = −2.")] }); },
      () => { const C = rp(4), [p, d] = qv(), A = add(C, p);
        return QN("Calcule le rayon de la sphère de centre " + ptN("C", C) + " qui passe par " + ptN("A", A) + ".", d, M("r = CA = \\sqrt{" + p.map((x) => par(x) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
          { ctx: "rayon-point", guide: [GP(M(vec("CA")) + " ?", p, M(v3(p)) + "."), G(M("CA^2") + " ?", d * d, M(d * d) + "."), G("Rayon ?", d, M(d) + ".")],
            traps: [TR(d * d, "C'est r² : prends la racine."), TR(2 * d, "C'est le diamètre ; le rayon est CA."), TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Distance : √(Δx² + Δy² + Δz²).")] }); },
    ],
    2: [
      () => { const A = rp(5), h = rv(3), B = add(A, mul(2, h)), Mi = add(A, h), d = -dot(h, Mi); if (Math.abs(d) < 2) return null;
        return QN("Le plan médiateur de " + M("[AB]") + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ", a une équation de la forme " + M(lt(h, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, "Plan médiateur : perpendiculaire à " + M("[AB]") + " (vecteur normal " + M(vec("AB") + " = " + v3(mul(2, h))) + ", colinéaire à " + M(v3(h)) + ") et passant par le milieu " + M("M") + pt(Mi) + " : " + M("d = " + d) + ".",
          { ctx: "plan-mediateur", guide: [GP("Milieu " + M("M") + " de " + M("[AB]") + " ?", Mi, pt(Mi) + "."), G(M("d = -(ax_M + by_M + cz_M)") + " ?", d, M(d) + ".")],
            traps: [TR(-dot(h, A), "Le plan médiateur passe par le milieu de [AB], pas par A."), TR(dot(h, Mi), "d = −(a·x_M + b·y_M + c·z_M) : attention au signe."), TR(-dot(h, B), "Il passe par le milieu M, pas par B.")] }); },
      () => { const C = rv(4), r = R.int(2, 7), K = nn2(C) - r * r; if (!K) return null;
        return QN("La sphère " + M("x^2 + y^2 + z^2 " + (lt([-2 * C[0], -2 * C[1], -2 * C[2], K], XYZ).replace(/^-/, "- ").replace(/^(?=\d)/, "+ ")) + " = 0") + " a quel rayon ?", r, "On complète les carrés : " + M(sphT(C, r * r)) + ". Centre " + pt(C) + ", rayon " + M("\\sqrt{" + r * r + "} = " + r) + ".",
          { ctx: "sphere-developpee", guide: [GP("Centre (moitié des coefficients de " + M("x, y, z") + ", signe changé) ?", C, pt(C) + "."), G(M("r^2 = a^2 + b^2 + c^2 - " + par(K)) + " ?", r * r, M(nn2(C) + " - " + par(K) + " = " + r * r) + "."), G("Rayon ?", r, M(r) + ".")],
            traps: [TR(r * r, "C'est r² : prends la racine carrée."), TR(K > 0 ? NaN : Math.sqrt(-K), "Le terme constant ne donne pas r² directement : complète d'abord les carrés.")] }); },
      () => { const C = rp(4), [p] = qv(), T = add(C, p), d = -dot(p, T);
        return QP("Le point " + ptN("T", T) + " est sur la sphère de centre " + ptN("C", C) + ". Le plan tangent à la sphère en " + M("T") + " a une équation de la forme " + M(lt([p[0]], ["x"]) + " + by + cz + d = 0") + ". Réponds « b ; c ; d ».", [p[1], p[2], d], "Le plan tangent en " + M("T") + " est perpendiculaire au rayon : vecteur normal " + M(vec("CT") + " = " + v3(p)) + ". Il passe par " + M("T") + " : " + M("d = " + d) + ". " + M(plT(p, d)) + ".",
          { ctx: "plan-tangent", guide: [GP(M(vec("CT")) + " ?", p, M(v3(p)) + "."), G(M("d = -(ax_T + by_T + cz_T)") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [p[1], p[2], d], M(p[1] + " \\,;\\, " + p[2] + " \\,;\\, " + d) + ".")],
            traps: [TP([p[1], p[2], -dot(p, C)], "Le plan tangent passe par T, pas par le centre C."), TP([p[1], p[2], -d], "d = −(a·x_T + b·y_T + c·z_T) : attention au signe.")] }); },
    ],
    3: [
      () => { const [del, rho, Rr] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15]]), [n, nn] = qv(4), C = rp(3), d = sgn() * del * nn - dot(n, C);
        return QN("La sphère " + M(sphT(C, Rr * Rr)) + " coupe le plan " + M("\\pi : " + plT(n, d)) + " selon un cercle. Calcule le rayon de ce cercle.", rho, "Distance du centre " + pt(C) + " au plan : " + M("\\delta = \\frac{" + del * nn + "}{" + nn + "} = " + del) + " ; Pythagore : " + M("\\rho = \\sqrt{" + Rr + "^2 - " + del + "^2} = " + rho) + ".",
          { ctx: "cercle-section", guide: [G("Distance " + M("\\delta") + " du centre au plan ?", del, M(del) + "."), G("Rayon du cercle " + M("\\sqrt{R^2 - \\delta^2}") + " ?", rho, M(rho) + ".")],
            traps: [TR(Rr - del, "Pythagore : ρ² = R² − δ², pas ρ = R − δ."), TR(rho * rho, "N'oublie pas la racine carrée."), TR(del, "C'est la distance du centre au plan ; le rayon du cercle vaut √(R² − δ²).")] }); },
      () => { const [n, nn] = qv(4), C = rp(3), m = R.int(2, 3 * nn), s = sgn(), d = s * m - dot(n, C), r2 = (m * m) / (nn * nn); if (m % nn === 0 && m / nn < 2) return null;
        return QN("La sphère de centre " + ptN("C", C) + " est tangente au plan " + M("\\pi : " + plT(n, d)) + ". Son équation s'écrit " + M(sq("x", C[0]) + " + " + sq("y", C[1]) + " + " + sq("z", C[2]) + " = r^2") + ". Que vaut " + M("r^2") + " ? (fractions acceptées)", r2, "Sphère tangente : rayon = distance du centre au plan, " + M("r = " + frT(m, nn)) + ", donc " + M("r^2 = " + fT(r2)) + ".",
          { ctx: "sphere-tangente", guide: [G("Rayon " + M("r") + " (distance de " + M("C") + " au plan) ?", m / nn, M(fT(m / nn)) + "."), G(M("r^2") + " ?", r2, M(fT(r2)) + ".")],
            traps: [TR(m / nn, "C'est r ; on demande r²."), TR(m * m / nn, "r = " + m + " ÷ " + nn + " : élève aussi le dénominateur au carré."), TR(m, "Divise par la norme du vecteur normal.")] }); },
      () => { const { u, w } = orth(1), mm = pk([1, 2]), k = pk([1, 2, 3]), C = rp(3), s0 = pk([2, -2, 3, -3, 4]), Mc = add(C, mul(mm, w)), A = sub(Mc, mul(s0, u)), R2 = 9 * (k * k + mm * mm), t1 = s0 - k, t2 = s0 + k; if (!t1 || !t2) return null;
        return QSet("Pour quelles valeurs de " + M("t") + " la droite " + M("d") + " : " + eqD(A, u) + " coupe-t-elle la sphère " + M(sphT(C, R2)) + " ? Sépare les valeurs par « ; ».", [t1, t2], "On remplace " + M("x, y, z") + " dans l'équation de la sphère : " + M("9t^2 " + (-18 * s0 < 0 ? "- " + 18 * s0 : "+ " + -18 * s0) + "t " + (9 * (s0 * s0 - k * k) < 0 ? "- " + -9 * (s0 * s0 - k * k) : "+ " + 9 * (s0 * s0 - k * k)) + " = 0") + ", soit " + M(lt([1, -2 * s0, s0 * s0 - k * k], ["t^2", "t", ""]) + " = 0") + " : " + M("t = " + t1) + " ou " + M("t = " + t2) + ".",
          { ctx: "droite-sphere", guide: [G("Après remplacement, on divise par " + M("\\|\\vec{u}\\|^2 = 9") + " : " + M("t^2 + pt + q = 0") + ". " + M("p") + " ?", -2 * s0, M(-2 * s0) + "."), G(M("q") + " ?", s0 * s0 - k * k, M(s0 * s0 - k * k) + "."), GSet("Valeurs de " + M("t") + " ?", [t1, t2], M("t = " + t1) + " ou " + M("t = " + t2) + ".")],
            traps: [TSt([t2], "La droite coupe la sphère en deux points : deux valeurs de t."), TSt([-t1, -t2], "Attention au signe : vérifie avec t² + pt + q = 0.")] }); },
    ],
  };

  // ---------- problèmes en plusieurs étapes (niveau 4, valeurs tirées) ----------
  const PROBS = {
    vect3d: [() => { const A = rp(4), [p, d] = qv(4), B = add(A, p), Mi = add(A, mul(0.5, p)), E = add(A, mul(3, p));
      return P("On donne A" + ptS(A) + " et B" + ptS(B) + ".", [["a) Longueur AB", d], ["b) Cote (z) du milieu de [AB]", Mi[2]], ["c) Cote du point E tel que AE = 3 · AB (vecteurs)", E[2]]], ["AB = B − A, puis Pythagore dans l'espace.", "E = A + 3·AB."], "a) " + M(vec("AB") + " = " + v3(p)) + ", " + M("AB = \\sqrt{" + d * d + "} = " + d) + " ; b) " + M("z_M = \\frac{" + fT(A[2]) + " + " + par(B[2]) + "}{2} = " + fT(Mi[2])) + " ; c) " + M("z_E = " + fT(A[2]) + " + 3 \\cdot " + par(p[2]) + " = " + fT(E[2])) + "."); }],
    colin: [() => { const A = rp(3), u = mul(2, rv(2)), t = pk([1.5, 2.5, -0.5]), B = add(A, u), C = add(A, mul(t, u));
      return P("Les points A" + ptS(A) + ", B" + ptS(B) + " et C(" + String(C[0]).replace("-", "−") + " ; m ; n) sont alignés.", [["a) Nombre t tel que AC = t · AB (vecteurs)", t], ["b) m", C[1]], ["c) n", C[2]]], ["Avec les abscisses : t = (x_C − x_A) ÷ (x_B − x_A).", "m = y_A + t·(y_B − y_A)."], "a) " + M("t = " + fT(t)) + " ; b) " + M("m = " + fT(C[1])) + " ; c) " + M("n = " + fT(C[2])) + "."); }],
    droite3d: [() => { const A = rv(4), u = rv(3), k = 2; const t = r6(-A[2] / u[2]), Z = add(A, mul(t, u)), Q = add(A, mul(k, u));
      return P("La droite d passe par A" + ptS(A) + " et a pour vecteur directeur u" + ptS(u) + " (on écrit A + t·u).", [["a) Cote du point de d pour t = 2", Q[2]], ["b) Valeur de t où d coupe le plan z = 0", t], ["c) Abscisse de ce point d'intersection", Z[0]]], ["Point pour t : A + t·u.", "z = 0 donne t = −z_A ÷ u_z."], "a) " + M(fT(A[2]) + " + 2 \\cdot " + par(u[2]) + " = " + fT(Q[2])) + " ; b) " + M("t = " + fT(t)) + " ; c) " + M("x = " + fT(A[0]) + " + " + par(t) + " \\cdot " + par(u[0]) + " = " + fT(Z[0])) + "."); }],
    plans: [() => { const n = rv(3), A = rp(3), d = -dot(n, A), x0 = R.int(-3, 3), y0 = R.int(-3, 3), m = r6(-(n[0] * x0 + n[1] * y0 + d) / n[2]);
      return P("Le plan π passe par A" + ptS(A) + " et a pour vecteur normal n" + ptS(n) + " ; son équation s'écrit ax + by + cz + d = 0 avec (a ; b ; c) = n.", [["a) d", d], ["b) Abscisse du point où π coupe l'axe Ox", -d / n[0]], ["c) m tel que P(" + String(x0).replace("-", "−") + " ; " + String(y0).replace("-", "−") + " ; m) soit dans π", m]], ["d = −(a·x_A + b·y_A + c·z_A).", "Sur l'axe Ox : y = z = 0."], "a) " + M("d = " + d) + ", " + M("\\pi : " + plT(n, d)) + " ; b) " + M(lt([n[0], d], ["x", ""]) + " = 0") + ", " + M("x = " + fT(-d / n[0])) + " ; c) " + M("m = " + fT(m)) + "."); }],
    posrel: [() => { const n = rv(3), Pp = rp(3), d = -dot(n, Pp), u = rv(2); if (!dot(n, u)) return PROBS.posrel[0](); const t0 = pk([2, -1, 3]), A = sub(Pp, mul(t0, u));
      return P("La droite d passe par A" + ptS(A) + ", de vecteur directeur u" + ptS(u) + " ; le plan π a pour équation " + plS(n, d) + ".", [["a) Valeur de t du point d'intersection (A + t·u)", t0], ["b) Cote (z) du point d'intersection", Pp[2]], ["c) Produit scalaire n · u (n = vecteur normal de π)", dot(n, u)]], ["Remplace x, y, z de A + t·u dans l'équation de π.", "Si n · u ≠ 0, la droite n'est pas parallèle au plan."], "a) " + M("t = " + t0) + " ; b) point " + pt(Pp) + ", " + M("z = " + Pp[2]) + " ; c) " + M("\\vec{n} \\cdot \\vec{u} = " + dot(n, u) + " \\neq 0") + " : la droite coupe le plan."); }],
    pscal3d: [() => { const A = rp(3), u = rv(3), v = rv(3); if (isZ(cross(u, v)) || !dot(u, v)) return PROBS.pscal3d[0](); const B = add(A, u), C = add(A, v), a = angle(u, v);
      return P("Triangle de sommets A" + ptS(A) + ", B" + ptS(B) + " et C" + ptS(C) + ".", [["a) Produit scalaire AB · AC", dot(u, v)], ["b) AB² (carré de la longueur)", nn2(u)], ["c) Angle BAC en degrés (au dixième)", a, 0.1]], ["AB = B − A et AC = C − A.", "cos(BAC) = (AB · AC) ÷ (AB · AC)."], "a) " + M(dot(u, v)) + " ; b) " + M(nn2(u)) + " ; c) " + M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + "."); }],
    distances: [() => { const [n, nn] = qv(4), Pp = rp(3), m = R.int(2, 3 * nn), d = m - dot(n, Pp), Q = rp(3), d2 = -dot(n, Q); if (d2 === d) return PROBS.distances[0]();
      return P("Le plan π a pour équation " + plS(n, d) + " ; on donne P" + ptS(Pp) + " et Q" + ptS(Q) + ".", [["a) Norme du vecteur normal de π", nn], ["b) Distance de P à π", m / nn], ["c) Distance entre π et le plan parallèle à π passant par Q", Math.abs(d - d2) / nn]], ["δ = |ax + by + cz + d| ÷ ‖n‖.", "Le plan parallèle par Q : même n, d' = −n · Q."], "a) " + M(nn) + " ; b) " + M("\\frac{" + m + "}{" + nn + "}") + " ; c) " + M("d' = " + d2) + ", " + M("\\frac{|" + fT(d) + " - " + par(d2) + "|}{" + nn + "} = " + fT(Math.abs(d - d2) / nn)) + "."); }],
    sphere: [() => { const C = rp(3), [p, r] = qv(4), T = add(C, p), dT = -dot(p, T), O = sub(mul(2, C), T);
      return P("La sphère de centre C" + ptS(C) + " passe par T" + ptS(T) + ".", [["a) Rayon de la sphère", r], ["b) d dans l'équation du plan tangent en T : " + ltS(p, ["x", "y", "z"]).replace(/-/g, "−") + " + d = 0", dT], ["c) Cote (z) du point diamétralement opposé à T", O[2]]], ["Rayon = CT.", "Le plan tangent en T a pour vecteur normal CT ; le point opposé vaut 2C − T."], "a) " + M("CT = " + r) + " ; b) " + M("d = " + dT) + " ; c) " + M("2 \\cdot " + par(C[2]) + " - " + par(T[2]) + " = " + fT(O[2])) + "."); }],
  };

  // ---------- catalogue ----------
  const NEW = [
    { id: "vect3d", theme: "es", label: "Vecteurs de l'espace", ex: "\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\\\ z_B - z_A \\end{pmatrix}", CH: [14], codesMATU: "3\\.GV\\.01[a-d]", lv: VE,
      hint: "Composantes de AB : B − A (trois coordonnées). Milieu : moyenne des coordonnées. Norme : √(a² + b² + c²). Chasles : AB + BC = AC.",
      lesson: ["Vecteurs de l'espace", "Comme dans le plan, avec une troisième coordonnée.", "Dans un repère de l'espace, \\(\\overrightarrow{AB}\\) a pour composantes \\(B - A\\). Les opérations se font composante par composante. Le milieu de \\([AB]\\) est la moyenne des coordonnées. La norme de \\(\\vec{u} = (a \\,;\\, b \\,;\\, c)\\) vaut \\(\\sqrt{a^2 + b^2 + c^2}\\) (Pythagore deux fois). Relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\).",
        ["\\(A(1 \\,;\\, 2 \\,;\\, -1)\\), \\(B(3 \\,;\\, 0 \\,;\\, 4)\\) : \\(\\overrightarrow{AB} = (2 \\,;\\, -2 \\,;\\, 5)\\), \\(AB = \\sqrt{33}\\).", "\\(\\|(2 \\,;\\, 3 \\,;\\, 6)\\| = \\sqrt{4 + 9 + 36} = 7\\)."], "Dans \\(ABCD\\) (parallélogramme), \\(\\overrightarrow{AD} = \\overrightarrow{BC}\\) : l'ordre des sommets compte."],
      comps: ["Calculer composantes, milieu et combinaisons de vecteurs", "Calculer une norme ; parallélogramme ; relation de Chasles", "Symétrique, centre de gravité, norme avec une inconnue"] },
    { id: "colin", theme: "es", label: "Colinéarité et coplanarité", ex: "\\vec{v} = k\\,\\vec{u}", CH: [14], codesMATU: "3\\.GV\\.02[ab]", lv: CL,
      hint: "Colinéaires : v = k·u (même rapport pour les trois composantes). Coplanaires : w = α·u + β·v. Points alignés : AC = t·AB.",
      lesson: ["Colinéarité et coplanarité", "Deux vecteurs parallèles, trois vecteurs dans un même plan (niveau avancé MA2).", "\\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires s'il existe \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\) : les trois rapports de composantes sont égaux. Trois points \\(A, B, C\\) sont alignés si \\(\\overrightarrow{AC} = t\\,\\overrightarrow{AB}\\). Trois vecteurs sont coplanaires si l'un est combinaison des deux autres : \\(\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}\\) ; quatre points \\(A, B, C, D\\) sont coplanaires si \\(\\overrightarrow{AD} = \\alpha\\overrightarrow{AB} + \\beta\\overrightarrow{AC}\\).",
        ["\\((2 \\,;\\, -1 \\,;\\, 3)\\) et \\((6 \\,;\\, -3 \\,;\\, 9)\\) : \\(k = 3\\), colinéaires.", "\\(\\vec{w} = 2\\vec{u} - \\vec{v}\\) : on trouve \\(\\alpha\\) et \\(\\beta\\) avec deux composantes, la troisième vérifie."], "Deux équations donnent \\(\\alpha\\) et \\(\\beta\\) ; il faut toujours vérifier la troisième."],
      comps: ["Reconnaître des vecteurs colinéaires (facteur k, alignement)", "Décomposer un vecteur ; points coplanaires", "Colinéarité ou coplanarité avec un paramètre"] },
    { id: "droite3d", theme: "es", label: "Droites de l'espace", ex: "\\begin{cases} x = 1 + 2t \\\\ y = -3t \\\\ z = 4 + t \\end{cases}", CH: [14], codesMATU: "3\\.GV\\.03[ab]", lv: DT,
      hint: "Droite par A, de vecteur directeur u : (x ; y ; z) = A + t·u. Un point est sur la droite si les trois équations donnent la même valeur de t.",
      lesson: ["Droites de l'espace", "Un point de départ et une direction.", "La droite passant par \\(A\\) et de vecteur directeur \\(\\vec{u}\\) a pour équations paramétriques \\(x = x_A + t\\,u_x\\), \\(y = y_A + t\\,u_y\\), \\(z = z_A + t\\,u_z\\). Chaque valeur de \\(t\\) donne un point. Un point appartient à la droite si les trois équations donnent le même \\(t\\). Deux droites de l'espace peuvent être sécantes, parallèles ou gauches (ni l'un ni l'autre).",
        ["\\((AB)\\) avec \\(A(1 \\,;\\, 0 \\,;\\, 2)\\), \\(B(3 \\,;\\, -1 \\,;\\, 5)\\) : \\(x = 1 + 2t\\), \\(y = -t\\), \\(z = 2 + 3t\\).", "Intersection avec le plan \\(z = 0\\) : \\(2 + 3t = 0\\), \\(t = -\\frac{2}{3}\\)."], "Les coefficients de \\(t\\) forment le vecteur directeur ; les termes constants, le point de départ."],
      comps: ["Lire et utiliser des équations paramétriques de droite", "Intersection avec un plan de coordonnées ; droite parallèle", "Intersection de deux droites ; problèmes de trajectoire"] },
    { id: "plans", theme: "es", label: "Équations d'un plan", ex: "ax + by + cz + d = 0", CH: [14], codesMATU: "3\\.GV\\.03[ce]", lv: PL,
      hint: "Paramétriques : A + s·u + t·v. Cartésienne : ax + by + cz + d = 0, où (a ; b ; c) est un vecteur normal. Traces : on annule une ou deux coordonnées.",
      lesson: ["Équations d'un plan", "Deux directions, ou un vecteur normal.", "Le plan passant par \\(A\\) et dirigé par \\(\\vec{u}\\) et \\(\\vec{v}\\) (non colinéaires) a pour équations paramétriques \\(A + s\\,\\vec{u} + t\\,\\vec{v}\\). En éliminant \\(s\\) et \\(t\\), on obtient une équation cartésienne \\(ax + by + cz + d = 0\\) ; le vecteur \\((a \\,;\\, b \\,;\\, c)\\) est orthogonal au plan. Traces : avec \\(z = 0\\), on obtient la droite du plan \\(xOy\\) ; avec deux coordonnées nulles, le point sur un axe.",
        ["\\(2x - y + 3z - 6 = 0\\) coupe l'axe \\(Oz\\) en \\((0 \\,;\\, 0 \\,;\\, 2)\\).", "Plan parallèle passant par \\(A(1 \\,;\\, 1 \\,;\\, 1)\\) : \\(2x - y + 3z - 4 = 0\\)."], "Deux plans parallèles ont des coefficients \\(a, b, c\\) proportionnels ; seul \\(d\\) change."],
      comps: ["Utiliser une équation paramétrique ou cartésienne de plan", "Plan parallèle ; appartenance ; trace dans un plan de coordonnées", "Équation cartésienne par trois points ou depuis les équations paramétriques"] },
    { id: "posrel", theme: "es", label: "Positions relatives, intersections", ex: "d \\cap \\pi", CH: [14], codesMATU: "3\\.GV\\.03d", lv: PO,
      hint: "Droite et plan : remplace x, y, z de la droite dans l'équation du plan (équation en t). Parallèles si n · u = 0. Deux plans : système de deux équations.",
      lesson: ["Positions relatives", "Se couper, être parallèles, être contenu.", "Droite \\(A + t\\vec{u}\\) et plan \\(\\vec{n} \\cdot (x \\,;\\, y \\,;\\, z) + d = 0\\) : si \\(\\vec{n} \\cdot \\vec{u} \\neq 0\\), ils se coupent en un point (une valeur de \\(t\\)) ; si \\(\\vec{n} \\cdot \\vec{u} = 0\\), la droite est parallèle au plan, et contenue dedans si \\(A\\) y est. Deux plans non parallèles se coupent selon une droite ; trois plans se coupent en général en un point (système 3 × 3).",
        ["\\(x = 1 + t\\), \\(y = 2t\\), \\(z = 3 - t\\) et \\(x + y + z - 7 = 0\\) : \\(4 + 2t = 7\\), \\(t = \\frac{3}{2}\\)."], "Parallèle au plan : \\(\\vec{u}\\) orthogonal à \\(\\vec{n}\\) (pas colinéaire)."],
      comps: ["Intersection d'une droite et d'un plan ; parallélisme", "Intersection de deux plans ; droite contenue ; droites sécantes", "Trois plans ; droite qui perce un plan ; ombre portée"] },
    { id: "pscal3d", theme: "es", label: "Produit scalaire dans l'espace", ex: "\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z", CH: [14], codesMATU: "3\\.GV\\.04[a-c]", lv: PS,
      hint: "u · v = uₓvₓ + u_yv_y + u_zv_z = ‖u‖ ‖v‖ cos α. Orthogonaux ⟺ u · v = 0. Projeté de v sur u : (u · v ÷ ‖u‖²)·u.",
      lesson: ["Produit scalaire dans l'espace", "Un nombre qui mesure l'angle entre deux directions.", "\\(\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Donc \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\), et \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\). Projection orthogonale de \\(\\vec{v}\\) sur la direction de \\(\\vec{u}\\) : longueur \\(\\frac{|\\vec{u} \\cdot \\vec{v}|}{\\|\\vec{u}\\|}\\), vecteur \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}\\,\\vec{u}\\).",
        ["\\((1 \\,;\\, 2 \\,;\\, 2) \\cdot (2 \\,;\\, 0 \\,;\\, -1) = 2 + 0 - 2 = 0\\) : orthogonaux.", "\\(\\cos\\alpha = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}\\) : \\(\\alpha = 60°\\)."], "L'angle de deux vecteurs est entre 0° et 180° : un produit scalaire négatif donne un angle obtus."],
      comps: ["Calculer un produit scalaire ; orthogonalité ; angle", "Angle d'un triangle ; projection ; triangle rectangle", "Vecteur projeté ; projeté d'un point sur une droite ; angles dans un pavé"] },
    { id: "distances", theme: "es", label: "Distances et aires dans l'espace", ex: "\\delta(P, \\pi) = \\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}", CH: [14], codesMATU: "3\\.GV\\.04[de]", lv: DI,
      hint: "Point-plan : |ax + by + cz + d| ÷ √(a² + b² + c²). Point-droite : distance au pied H de la perpendiculaire. Aire : ½·√(AB²·AC² − (AB · AC)²).",
      lesson: ["Distances et aires", "La plus courte distance se mesure perpendiculairement.", "Distance de \\(P\\) au plan \\(ax + by + cz + d = 0\\) : \\(\\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}\\). Distance de \\(P\\) à la droite \\(A + t\\vec{u}\\) : on cherche le pied \\(H\\) (\\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}\\)), puis \\(PH\\). Aire du triangle \\(ABC\\) : \\(\\frac{1}{2}\\sqrt{AB^2 \\cdot AC^2 - (\\overrightarrow{AB} \\cdot \\overrightarrow{AC})^2}\\).",
        ["\\(P(1 \\,;\\, 1 \\,;\\, 1)\\) et \\(2x + y + 2z - 2 = 0\\) : \\(\\frac{|2 + 1 + 2 - 2|}{3} = 1\\).", "Plans parallèles \\(\\vec{n} \\cdot X + d_1 = 0\\) et \\(\\vec{n} \\cdot X + d_2 = 0\\) : \\(\\frac{|d_1 - d_2|}{\\|\\vec{n}\\|}\\)."], "N'oublie ni la valeur absolue ni la racine de \\(a^2 + b^2 + c^2\\)."],
      comps: ["Distance point-plan, plans parallèles ; aire d'un triangle rectangle", "Distance point-droite ; aire d'un triangle quelconque", "Volume d'une pyramide ; distance imposée ; problème de distance minimale"] },
    { id: "sphere", theme: "es", label: "Vecteur normal, plan médiateur, sphère", ex: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2", CH: [14], codesMATU: "3\\.GV\\.05[a-d]", lv: SP,
      hint: "Plan de vecteur normal n par A : n · AX = 0. Plan médiateur de [AB] : normal AB, par le milieu. Sphère : (x − a)² + (y − b)² + (z − c)² = r². Plan tangent en T : normal CT, par T.",
      lesson: ["Sphère et plans", "Un vecteur normal suffit pour écrire un plan.", "Le plan passant par \\(A\\) et de vecteur normal \\(\\vec{n} = (a \\,;\\, b \\,;\\, c)\\) a pour équation \\(ax + by + cz + d = 0\\) avec \\(d = -(ax_A + by_A + cz_A)\\). Le plan médiateur de \\([AB]\\) a pour vecteur normal \\(\\overrightarrow{AB}\\) et passe par le milieu de \\([AB]\\). La sphère de centre \\(C\\) et de rayon \\(r\\) : \\((x - a)^2 + (y - b)^2 + (z - c)^2 = r^2\\). Le plan tangent en \\(T\\) a pour vecteur normal \\(\\overrightarrow{CT}\\). Un plan à distance \\(\\delta < r\\) du centre coupe la sphère selon un cercle de rayon \\(\\sqrt{r^2 - \\delta^2}\\).",
        ["\\(x^2 + y^2 + z^2 - 2x + 4z - 4 = 0\\) : \\((x - 1)^2 + y^2 + (z + 2)^2 = 9\\), centre \\((1 \\,;\\, 0 \\,;\\, -2)\\), rayon 3."], "Dans \\((x + 2)^2\\), la coordonnée du centre est \\(-2\\)."],
      comps: ["Plan par un point et un vecteur normal ; centre et rayon d'une sphère", "Plan médiateur ; équation développée ; plan tangent", "Section d'une sphère ; sphère tangente à un plan ; droite et sphère"] },
  ];

  // ---------- enregistrement (additif : aucune notion existante n'est modifiée) ----------
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
  }
})();
