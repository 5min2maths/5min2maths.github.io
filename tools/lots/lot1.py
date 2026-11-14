# Lot 1 de l'aide pas à pas (14.11) : arith, rel, fracops, pct, rac — appliqué une fois (archive ; ne pas relancer).
def edit(p, pairs):
    s = open(p).read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:80], s.count(a)); s = s.replace(a, b)
    open(p, 'w').write(s)

edit('src/generators.js', [
(r'''const TRAP = (v, m) => ({ v, m });''',
 r'''const TRAP = (v, m) => ({ v, m });
// Étape guidée dont la réponse s'écrit avec une racine (a√b exigé).
const GSR = (ask, value, sol) => ({ ask, spec: { kind: "value", value, radical: true }, sol });
// Pas à pas du PGDC (lot 1, 14.11) : un diviseur commun divise aussi la différence.
const pgdcGuide = (x, y, g) => { const a = Math.min(x, y), b = Math.max(x, y); return [
  GS("Tout diviseur commun de " + M(a) + " et " + M(b) + " divise aussi leur différence. Calcule " + M(b + " - " + a) + ".", b - a, M(b + " - " + a + " = " + (b - a)) + "."),
  GS("Cherche le plus grand diviseur de " + M(b - a) + " qui divise aussi " + M(a) + " : PGDC = ?", g, M(a + " = " + g + " \\cdot " + a / g) + " et " + M(b + " = " + g + " \\cdot " + b / g) + " : PGDC " + M("= " + g) + ".")]; };'''),
(r'''return { fig: FIG.numberLine(a, []), q: "Calcule : " + M(par(a) + " + " + par(b)), spec: { kind: "value", value: a + b }, sol: M(par(a) + " + " + par(b) + " = " + (a + b)) };''',
 r'''const same = a * b > 0, big = Math.abs(a) >= Math.abs(b) ? a : b, A = Math.abs(a), B = Math.abs(b);
      return { fig: FIG.numberLine(a, []), q: "Calcule : " + M(par(a) + " + " + par(b)), spec: { kind: "value", value: a + b }, sol: M(par(a) + " + " + par(b) + " = " + (a + b)),
        guide: [same ? GS("Même signe : on additionne les distances à zéro. " + M(A + " + " + B) + " = ?", A + B, M(A + " + " + B + " = " + (A + B)) + ".")
          : GS("Signes contraires : on soustrait les distances à zéro (la grande moins la petite). " + M(Math.max(A, B) + " - " + Math.min(A, B)) + " = ?", Math.abs(A - B), M(Math.max(A, B) + " - " + Math.min(A, B) + " = " + Math.abs(A - B)) + "."),
          GS(same ? "Le résultat garde le signe commun : résultat ?" : "Le résultat prend le signe du nombre le plus loin de zéro (" + M(par(big)) + ") : résultat ?", a + b, M(par(a) + " + " + par(b) + " = " + (a + b)) + ".")] };'''),
(r'''return { q: "Calcule : " + M("-" + a + "^2 - (-" + b + ")^2 + " + c + " \\cdot (-2)^3"), spec: { kind: "value", value: v }, sol:''',
 r'''return { guide: [GS(M("-" + a + "^2") + " = ? (le carré ne porte que sur " + M(a) + ")", -(a * a), M("-" + a + "^2 = -" + a * a) + "."), GS(M("(-" + b + ")^2") + " = ?", b * b, M("(-" + b + ")^2 = " + b * b) + " (exposant pair : positif)."), GS(M(c + " \\cdot (-2)^3") + " = ?", -8 * c, M("(-2)^3 = -8") + ", donc " + M(c + " \\cdot (-8) = " + -8 * c) + "."), GS("Assemble : " + M("-" + a * a + " - " + b * b + " - " + 8 * c) + " = ?", v, M("-" + a * a + " - " + b * b + " - " + 8 * c + " = " + v) + ".")],
        q: "Calcule : " + M("-" + a + "^2 - (-" + b + ")^2 + " + c + " \\cdot (-2)^3"), spec: { kind: "value", value: v }, sol:'''),
(r'''return { q: "Calcule : " + M("(-" + a + ")^3 \\cdot (-" + b + ")^2"), spec: { kind: "value", value: v }, sol:''',
 r'''return { guide: [GS(M("(-" + a + ")^3") + " = ?", -(a ** 3), M("(-" + a + ")^3 = " + -(a ** 3)) + " (exposant impair : négatif)."), GS(M("(-" + b + ")^2") + " = ?", b * b, M("(-" + b + ")^2 = " + b * b) + "."), GS("Le produit : " + M(par(-(a ** 3)) + " \\cdot " + b * b) + " = ?", v, M(par(-(a ** 3)) + " \\cdot " + b * b + " = " + v) + ".")],
        q: "Calcule : " + M("(-" + a + ")^3 \\cdot (-" + b + ")^2"), spec: { kind: "value", value: v }, sol:'''),
(r'''return { q: "Calcule : " + M("-" + b + "^2 \\cdot " + k + " : (-" + b + ") + (-" + c + ")^2"), spec: { kind: "value", value: v }, sol:''',
 r'''return { guide: [GS("D'abord les puissances : " + M("-" + b + "^2") + " = ?", -(b * b), M("-" + b + "^2 = -" + b * b) + "."), GS("De gauche à droite : " + M("-" + b * b + " \\cdot " + k + " : (-" + b + ")") + " = ?", b * k, M("-" + b * b * k + " : (-" + b + ") = " + b * k) + "."), GS("Il reste " + M(b * k + " + (-" + c + ")^2") + " = ?", v, M("(-" + c + ")^2 = " + c * c) + ", donc " + M(b * k + " + " + c * c + " = " + v) + ".")],
        q: "Calcule : " + M("-" + b + "^2 \\cdot " + k + " : (-" + b + ") + (-" + c + ")^2"), spec: { kind: "value", value: v }, sol:'''),
(r'''return { q: "Après une hausse de " + M(p + "\\,\\%") + ", un prix vaut " + M(dec(f)) + " CHF. Quel était le prix de départ ?", spec: { kind: "value", value: n }, sol:''',
 r'''return { traps: [TRAP(f * (1 - p / 100), "On ne retire pas " + p + " % du nouveau prix : la hausse était calculée sur le prix de départ.")],
      guide: [GS("Une hausse de " + M(p + "\\,\\%") + " : le prix de départ a été multiplié par quel nombre ?", 1 + p / 100, M("1 + \\frac{" + p + "}{100} = " + dec(1 + p / 100)) + "."), GS("Pour revenir en arrière, on divise : " + M(dec(f) + " : " + dec(1 + p / 100)) + " = ?", n, M(dec(f) + " : " + dec(1 + p / 100) + " = " + n) + " CHF.")],
      q: "Après une hausse de " + M(p + "\\,\\%") + ", un prix vaut " + M(dec(f)) + " CHF. Quel était le prix de départ ?", spec: { kind: "value", value: n }, sol:'''),
(r'''spec: { kind: "value", value: k }, sol: M("\\sqrt{" + k * k + "} = " + k) + " car " + M(k + "^2 = " + k * k) + "." };''',
 r'''spec: { kind: "value", value: k }, sol: M("\\sqrt{" + k * k + "} = " + k) + " car " + M(k + "^2 = " + k * k) + ".",
        guide: [GS("On cherche le nombre qui, multiplié par lui-même, donne " + M(k * k) + ". Essaie " + M(k - 1) + " : " + M((k - 1) + "^2") + " = ?", (k - 1) ** 2, M((k - 1) + "^2 = " + (k - 1) ** 2) + " : c'est moins que " + M(k * k) + ", essaie un peu plus."), GS("Alors " + M("\\sqrt{" + k * k + "}") + " = ?", k, M(k + "^2 = " + k * k) + ", donc " + M("\\sqrt{" + k * k + "} = " + k) + ".")] };'''),
(r'''canon: k + "√" + m, sol: M("\\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}") };''',
 r'''canon: k + "√" + m, sol: M("\\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}"),
        guide: [GS("Quel est le plus grand carré parfait qui divise " + M(k * k * m) + " ? (4, 9, 16, 25, 36, 49…)", k * k, M(k * k * m + " = " + k * k + " \\cdot " + m) + "."), GS("La racine de ce carré : " + M("\\sqrt{" + k * k + "}") + " = ?", k, M("\\sqrt{" + k * k + "} = " + k) + "."), GSR("Donc " + M("\\sqrt{" + k * k * m + "} = \\sqrt{" + k * k + "} \\cdot \\sqrt{" + m + "}") + " = ? (forme " + M("a\\sqrt{b}") + ")", k * Math.sqrt(m), M("\\sqrt{" + k * k * m + "} = " + k + "\\sqrt{" + m + "}") + ".")] };'''),
(r'''canon: (a + b) + "√" + m, sol: M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}") };''',
 r'''canon: (a + b) + "√" + m, sol: M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}"),
      guide: [GSR("Simplifie la première racine : " + M("\\sqrt{" + a * a * m + "} = \\sqrt{" + a * a + " \\cdot " + m + "}") + " = ?", a * Math.sqrt(m), M("\\sqrt{" + a * a * m + "} = " + a + "\\sqrt{" + m + "}") + "."), GSR("Puis la seconde : " + M("\\sqrt{" + b * b * m + "}") + " = ?", b * Math.sqrt(m), M("\\sqrt{" + b * b * m + "} = " + b + "\\sqrt{" + m + "}") + "."), GSR("Les deux termes contiennent " + M("\\sqrt{" + m + "}") + " : on les additionne comme " + M(a + "x + " + b + "x") + ". Résultat ?", (a + b) * Math.sqrt(m), M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}") + ".")] };'''),
])

edit('src/gen2.js', [
(r'''sol: M(g * p + " = " + g + " \\cdot " + p) + " et " + M(g * q + " = " + g + " \\cdot " + q) + " : PGDC " + M("= " + g) + "." };''',
 r'''sol: M(g * p + " = " + g + " \\cdot " + p) + " et " + M(g * q + " = " + g + " \\cdot " + q) + " : PGDC " + M("= " + g) + ".", guide: pgdcGuide(g * p, g * q, g) };'''),
(r'''+ g * p * q) + "." };''',
 r'''+ g * p * q) + ".",
      guide: [GS("D'abord le PGDC de " + M(g * p) + " et " + M(g * q) + " : ?", g, M(g * p + " = " + g + " \\cdot " + p) + ", " + M(g * q + " = " + g + " \\cdot " + q) + " : PGDC " + M("= " + g) + "."), GS("Le produit des deux nombres : " + M(g * p + " \\cdot " + g * q) + " = ?", g * p * g * q, M(g * p + " \\cdot " + g * q + " = " + g * p * g * q) + "."), GS("PPMC = produit : PGDC. Combien ?", g * p * q, M(g * p * g * q + " : " + g + " = " + g * p * q) + ".")] };'''),
(r'''sol: "C'est le PPMC de " + M(a) + " et " + M(b) + " : " + M(l) + " minutes." };''',
 r'''sol: "C'est le PPMC de " + M(a) + " et " + M(b) + " : " + M(l) + " minutes.",
        guide: [GS("Ils repartent ensemble après un nombre de minutes multiple de " + M(a) + " et de " + M(b) + " : le plus petit, c'est le PPMC. D'abord le PGDC de " + M(a) + " et " + M(b) + " : ?", gcd(a, b), "PGDC " + M("= " + gcd(a, b)) + "."), GS("PPMC " + M("= \\frac{" + a + " \\cdot " + b + "}{" + gcd(a, b) + "}") + " = ?", l, M("\\frac{" + a * b + "}{" + gcd(a, b) + "} = " + l) + " minutes.")] };'''),
(r'''sol: "Le côté divise les deux longueurs et doit être le plus grand : PGDC " + M("= " + g) + " cm." };''',
 r'''sol: "Le côté divise les deux longueurs et doit être le plus grand : PGDC " + M("= " + g) + " cm.", guide: pgdcGuide(g * p, g * q, g) };'''),
])

edit('src/gen3.js', [
(r'''return QV("Calcule et simplifie : " + M(fr(a, b) + " - " + fr(c, e)), n / d, M("\\frac{" + a * e + "}{" + d + "} - \\frac{" + c * b + "}{" + d + "} = " + frac(n, d))); },''',
 r'''return Object.assign(QV("Calcule et simplifie : " + M(fr(a, b) + " - " + fr(c, e)), n / d, M("\\frac{" + a * e + "}{" + d + "} - \\frac{" + c * b + "}{" + d + "} = " + frac(n, d))), { guide: [
        GS("Dénominateur commun : " + M(b + " \\cdot " + e) + " = ?", d, M(b + " \\cdot " + e + " = " + d) + "."),
        GS("Avec ce dénominateur : " + M(fr(a, b) + " = \\frac{" + a * e + "}{" + d + "}") + " et " + M(fr(c, e) + " = \\frac{" + c * b + "}{" + d + "}") + ". Différence des numérateurs " + M(a * e + " - " + c * b) + " = ?", n, M(a * e + " - " + c * b + " = " + n) + "."),
        GS("Écris " + M("\\frac{" + n + "}{" + d + "}") + " simplifié :", n / d, M("\\frac{" + n + "}{" + d + "} = " + frac(n, d)) + ".")] }); },'''),
(r'''if (R.rand() < 0.5) return QV("Calcule et simplifie : " + M("\\left(" + fr(-a, b) + "\\right) \\cdot " + fr(c, e)), -a * c / (b * e), "Signe − ; " + M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "}") + " : " + M(frac(-a * c, b * e)) + "."); return QV("Calcule et simplifie : " + M("\\left(" + fr(-a, b) + "\\right) : \\left(" + fr(-c, e) + "\\right)"), a * e / (b * c), "Signe + ; on multiplie par l'inverse : " + M(fr(a, b) + " \\cdot " + fr(e, c) + " = " + frac(a * e, b * c)) + "."); },''',
 r'''if (R.rand() < 0.5) return Object.assign(QV("Calcule et simplifie : " + M("\\left(" + fr(-a, b) + "\\right) \\cdot " + fr(c, e)), -a * c / (b * e), "Signe − ; " + M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "}") + " : " + M(frac(-a * c, b * e)) + "."), { guide: [
        GS("Négatif fois positif : le résultat est négatif. Produit des numérateurs (sans le signe) : " + M(a + " \\cdot " + c) + " = ?", a * c, M(a + " \\cdot " + c + " = " + a * c) + "."),
        GS("Produit des dénominateurs : " + M(b + " \\cdot " + e) + " = ?", b * e, M(b + " \\cdot " + e + " = " + b * e) + "."),
        GS("Avec le signe −, simplifié : résultat ?", -a * c / (b * e), M("-\\frac{" + a * c + "}{" + b * e + "} = " + frac(-a * c, b * e)) + ".")] });
      return Object.assign(QV("Calcule et simplifie : " + M("\\left(" + fr(-a, b) + "\\right) : \\left(" + fr(-c, e) + "\\right)"), a * e / (b * c), "Signe + ; on multiplie par l'inverse : " + M(fr(a, b) + " \\cdot " + fr(e, c) + " = " + frac(a * e, b * c)) + "."), { guide: [
        GS("Négatif divisé par négatif : le résultat est positif. Diviser, c'est multiplier par l'inverse : l'inverse de " + M(fr(c, e)) + " a pour numérateur ?", e, "L'inverse de " + M(fr(c, e)) + " est " + M(fr(e, c)) + "."),
        GS("Numérateurs : " + M(a + " \\cdot " + e) + " = ?", a * e, M(a + " \\cdot " + e + " = " + a * e) + "."),
        GS("Dénominateurs : " + M(b + " \\cdot " + c) + " = ?", b * c, M(b + " \\cdot " + c + " = " + b * c) + "."),
        GS("Résultat simplifié ?", a * e / (b * c), M("\\frac{" + a * e + "}{" + b * c + "} = " + frac(a * e, b * c)) + ".")] }); },'''),
(r'''return QV("Calcule et simplifie : " + M(fr(a, b) + " - " + fr(c, e) + " \\cdot " + fr(f, g2)), n / d, "D'abord le produit : " + M(fr(c, e) + " \\cdot " + fr(f, g2) + " = " + frac(c * f, e * g2)) + ". Puis " + M(fr(a, b) + " - " + frac(c * f, e * g2) + " = " + frac(n, d)) + "."); },''',
 r'''return Object.assign(QV("Calcule et simplifie : " + M(fr(a, b) + " - " + fr(c, e) + " \\cdot " + fr(f, g2)), n / d, "D'abord le produit : " + M(fr(c, e) + " \\cdot " + fr(f, g2) + " = " + frac(c * f, e * g2)) + ". Puis " + M(fr(a, b) + " - " + frac(c * f, e * g2) + " = " + frac(n, d)) + "."), { guide: [
        GS("La multiplication passe avant la soustraction : " + M(fr(c, e) + " \\cdot " + fr(f, g2)) + " = ? (simplifie)", c * f / (e * g2), M(fr(c, e) + " \\cdot " + fr(f, g2) + " = \\frac{" + c * f + "}{" + e * g2 + "} = " + frac(c * f, e * g2)) + "."),
        GS("Il reste " + M(fr(a, b) + " - " + frac(c * f, e * g2)) + " : même dénominateur, puis soustraction. Résultat simplifié ?", n / d, M(fr(a, b) + " - " + frac(c * f, e * g2) + " = " + frac(n, d)) + ".")] }); },'''),
])
print("lot 1 appliqué")
