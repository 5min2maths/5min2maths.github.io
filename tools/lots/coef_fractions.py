# 14.11 (retour de l'utilisateur : « la valeur de a tombe souvent facile, ne pas hésiter à avoir des fractions ») — archive.
def edit(p, pairs):
    s = open(p).read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:70], s.count(a)); s = s.replace(a, b)
    open(p, 'w').write(s)
edit('src/generators.js', [
(r'''    const coef = p === 0 ? String(abs) : abs === 1 ? "" : String(abs);''',
 r'''    // Coefficient non entier : fraction en TeX (\frac{1}{2}x^2), jamais 0.5x^2 (14.11).
    const fq = (v) => { if (Number.isInteger(v)) return String(v); for (let q = 2; q <= 60; q++) if (Math.abs(v * q - Math.round(v * q)) < 1e-9) return "\\frac{" + Math.round(v * q) + "}{" + q + "}"; return String(+v.toFixed(6)).replace(".", "{,}"); };
    const coef = p === 0 ? fq(abs) : abs === 1 ? "" : fq(abs);'''),
])
edit('src/gen2.js', [
# f2 niveau 1 : zéros, a varié (les zéros ne changent pas)
(r'''      const p = R.nz(-6, 6), q = R.nz(-6, 6);
      return { fig: FIG.parabola((x) => (x - p) * (x - q) / 3, [], null, false), q: "Détermine les zéros de " + M("f(x) = " + poly([1, -(p + q), p * q])) + ".",''',
 r'''      const p = R.nz(-6, 6), q = R.nz(-6, 6), a0 = R.pick([1, 1, -1, 2, -2, 3, 0.5, -0.5]);
      return { fig: FIG.parabola((x) => a0 * (x - p) * (x - q) / 3, [], null, false), q: "Détermine les zéros de " + M("f(x) = " + poly([a0, -a0 * (p + q), a0 * p * q])) + ".",'''),
(r'''sol: "Produit-somme ou discriminant : " + M("f(x) = (" + xm(p) + ")(" + xm(q) + ")") + ", zéros "''',
 r'''sol: "Produit-somme ou discriminant : " + M("f(x) = " + (a0 === 1 ? "" : a0 === -1 ? "-" : ratT(a0)) + "(" + xm(p) + ")(" + xm(q) + ")") + ", zéros "'''),
# f2 niveau 2 : sommet, a fractionnaire possible
(r'''const h = R.nz(-4, 4), k = R.int(-6, 6), a = R.pick([1, -1, 2, -2]);
      return { fig: FIG.parabola((x) => (a * (x - h) ** 2 + k) / 3''',
 r'''const h = R.nz(-4, 4), k = R.int(-6, 6), a = R.pick([1, -1, 2, -2, 3, 0.5, -0.5, 1.5]);
      return { fig: FIG.parabola((x) => (a * (x - h) ** 2 + k) / 3'''),
# f2 niveau 3
(r'''const a = R.pick([-2, -1, 2, 3, -3]), b = R.nz(-7, 7), c = R.int(-5, 5);''',
 r'''const a = R.pick([-2, 2, 3, -3, 0.5, -0.5, 1.5, -1]), b = R.nz(-7, 7), c = R.int(-5, 5);'''),
])
edit('src/gen3.js', [
# f2formes
(r'''() => { const a = R.pick([1, 1, 2, -1]), h = R.nz(-4, 4), k = R.nz(-6, 6); return QX("Développe et réduis : " + M((a === 1 ? "" : a === -1 ? "-" : a) + "(x"''',
 r'''() => { const a = R.pick([1, 2, -1, -2, 3, 0.5, -0.5]), h = R.nz(-4, 4), k = R.nz(-6, 6); return QX("Développe et réduis : " + M((a === 1 ? "" : a === -1 ? "-" : ratT(a)) + "(x"'''),
(r'''() => { const a = R.pick([1, 2, -1, -2]), p = R.int(-5, 3), q = p + 2 * R.int(1, 3), h = (p + q) / 2, k = -a * ((q - p) / 2) ** 2; if (p === 0 || q === 0) return GEN.f2formes(3); return QV("Soit " + M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "(x"''',
 r'''() => { const a = R.pick([1, 2, -1, -2, 0.5, -0.5, 3]), p = R.int(-5, 3), q = p + 2 * R.int(1, 3), h = (p + q) / 2, k = -a * ((q - p) / 2) ** 2; if (p === 0 || q === 0) return GEN.f2formes(3); return QV("Soit " + M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : ratT(a)) + "(x"'''),
# f2trois
(r'''const a = R.pick([1, 2, 3, -1, -2]), b = R.nz(-4, 4), c = R.nz(-5, 5), xs = [[0, 1, -1], [0, 1, 2], [-1, 1, 2]][t], f = (x) => a * x * x + b * x + c; return QX("Une parabole passe par les points " + xs.map((x, i) => M("ABC"[i] + "(" + x + " \\, ; " + f(x) + ")")).join(", ")''',
 r'''const a = R.pick([1, 2, 3, -1, -2, 0.5, -0.5]), b = R.nz(-4, 4), c = R.nz(-5, 5), xs = [[0, 1, -1], [0, 1, 2], [-1, 1, 2]][t], f = (x) => a * x * x + b * x + c; return QX("Une parabole passe par les points " + xs.map((x, i) => M("ABC"[i] + "(" + x + " \\, ; " + ratT(f(x)) + ")")).join(", ")'''),
(r'''"Avec " + M("f(x) = ax^2 + bx + c") + ", les trois points donnent un système dont la solution est " + M("a = " + a + ",\\ b = "''',
 r'''"Avec " + M("f(x) = ax^2 + bx + c") + ", les trois points donnent un système dont la solution est " + M("a = " + ratT(a) + ",\\ b = "'''),
# optim niveau 1 et fontaine
(r'''() => { const v = R.int(0, 2), a = R.pick([1, 2]), h = R.nz(-5, 6), k = R.int(1, 9);''',
 r'''() => { const v = R.int(0, 2), a = R.pick([1, 2, 0.5, 3]), h = R.nz(-5, 6), k = R.int(1, 9);'''),
(r'''if (v === 1) { const a = R.pick([1, 2]), h = R.int(2, 6), H = a * h * h;''',
 r'''if (v === 1) { const a = R.pick([1, 0.5, 0.5]), h = 2 * R.int(1, 4), H = a * h * h;'''),
])
print("fractions appliquées")
