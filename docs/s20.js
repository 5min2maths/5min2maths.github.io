




const RX = (() => {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
const A = (v, k) => N(+(+v).toFixed(k));
const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
const Q = (v, s) => M(N(v) + u(s));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));

const FR = (v) => {
if (Math.abs(v - Math.round(v)) < 1e-9) return N(Math.round(v));
for (let d = 2; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) { const g = g2(n, d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) / g + "}{" + d / g + "}"; } }
return N(v);
};

const lin = (a, b, x = "x") => {
const c = Math.abs(a - 1) < 1e-9 ? x : Math.abs(a + 1) < 1e-9 ? "-" + x : FR(a) + x;
if (Math.abs(a) < 1e-9) return FR(b);
return c + (Math.abs(b) < 1e-9 ? "" : b < 0 ? " - " + FR(-b) : " + " + FR(b));
};
const cx = (a, x = "x") => (Math.abs(a - 1) < 1e-9 ? x : Math.abs(a + 1) < 1e-9 ? "-" + x : FR(a) + x);
const sg = (v) => (v < 0 ? " - " + FR(-v) : " + " + FR(v));
const par = (v) => (v < 0 ? "(" + FR(v) + ")" : FR(v));
const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)), chk: [] }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam", "Elsa", "Luca"]);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tab = (head, rows) => "<table class=\"mtab\"><tr>" + head.map((h) => "<th>" + h + "</th>").join("") + "</tr>" + rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table>";

const VF = (id, lv, L, n = 4) => { const S = shuffle(L).slice(0, n);
return X({ id, lv, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie (calcul, exemple ou contre-exemple).",
parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); };
const D = Math.PI / 180;
return { r6, N, A, u, Q, pk, g2, FR, lin, cx, sg, par, pd, X, ul, who, shuffle, tab, VF, D };
})();

(function () {
const { r6, N, A, Q, pk, FR, lin, cx, sg, par, X, ul, who, tab, VF, D } = RX;
const T = (v) => M(N(v));


const EXA = [

() => { const C = pk([50, 55, 60, 65]), c = pk([5, 6, 8]), d1 = pk([150, 200, 250]), d2 = d1 + pk([200, 250, 300]);
const L1 = r6(C - (c * d1) / 100), L2 = r6(C - (c * d2) / 100), a = r6((L2 - L1) / (d2 - d1)), b = r6(L1 - a * d1), dmax = (100 * C) / c, quart = (75 * C) / c;
return X({ id: "modaff", lv: 1, titre: "Le réservoir",
q: "Une voiture part avec le réservoir plein et roule à " + Q(pk([80, 90, 100]), "km/h") + " de moyenne. Après " + Q(d1, "km") + ", il reste " + Q(L1, "L") + " d'essence ; après " + Q(d2, "km") + ", il reste " + Q(L2, "L") + ". La consommation est régulière.",
parts: [{ label: "Détermine la fonction " + M("L(x)") + " qui donne le nombre de litres restants après " + M("x") + " km.", pts: 2 }, { label: "Quelle est la capacité du réservoir ?", pts: 1 }, { label: "Quelle est la consommation aux 100 km ?", pts: 1 }, { label: "Quelle distance peut-on parcourir avec un plein (au km près) ?", pts: 1 }, { label: "Après combien de kilomètres ne reste-t-il qu'un quart du plein (au km près) ?", pts: 1 }],
sol: ul(["Pente " + M("a = \\frac{" + N(L2) + " - " + N(L1) + "}{" + d2 + " - " + d1 + "} = " + N(a)) + " ; " + M(N(L1) + " = " + N(a) + " \\cdot " + d1 + " + b") + ", " + M("b = " + N(b)) + ". " + M("L(x) = " + N(a) + "x + " + N(b)) + ".", M("L(0) = " + N(b)) + " litres (ordonnée à l'origine).", "La pente vaut " + M(N(a)) + " L par km : " + M(N(-a * 100)) + " L aux 100 km.", "Zéro de " + M("L") + " : " + M(N(a) + "x + " + N(b) + " = 0") + ", " + M("x = " + N(b) + " : " + N(-a) + " \\approx " + A(dmax, 0)) + " km.", "Un quart du plein : " + M(N(b / 4)) + " L. " + M(N(a) + "x + " + N(b) + " = " + N(b / 4)) + ", " + M("x \\approx " + A(quart, 0)) + " km. La vitesse moyenne ne sert à rien."]),
chk: [[a, N(a)], [b, N(b)], [c, N(-a * 100)], [dmax, A(dmax, 0), 1], [quart, A(quart, 0), 1]] }); },

() => { const K = pk([
{ t: "Deux compagnies de taxi", A: "Taxi Lac", B: "Taxi Salève", un: "km", pA: pk([6, 7, 8]), tB: pk([2.5, 3]), dt: pk([0.5, 1]), x0: pk([8, 10, 12, 16]), fixe: "de prise en charge", inut: "Les deux compagnies acceptent 4 passagers." },
{ t: "Location d'un utilitaire", A: "Garage Rhône", B: "Loc'Arve", un: "km", pA: pk([40, 50]), tB: pk([0.6, 0.8]), dt: pk([0.4, 0.5]), x0: pk([100, 120, 150, 200]), fixe: "de forfait journalier", inut: "Le réservoir est rendu plein dans les deux cas." },
{ t: "Deux salles de fitness", A: "Fit Plainpalais", B: "Gym Carouge", un: "séances", pA: 0, tB: pk([8, 10]), dt: pk([4, 5]), x0: pk([20, 24, 30]), fixe: "d'abonnement annuel", inut: "Les deux salles sont ouvertes 7 jours sur 7." }]);
const tA = r6(K.tB + K.dt), pB = r6(K.pA + K.dt * K.x0), x1 = K.x0 - pk([3, 4]) * (K.un === "km" && K.x0 >= 100 ? 10 : 1), xb = K.x0 + pk([6, 8, 10]) * (K.x0 >= 100 ? 10 : 1), bud = r6(pB + K.tB * xb), yA = r6(K.pA + tA * x1), yB = r6(pB + K.tB * x1), y0 = r6(K.pA + tA * K.x0);
const lab = K.un === "km" ? "par km" : "par séance";
return X({ id: "affine", lv: 1, titre: K.t,
q: K.A + " : " + (K.pA ? Q(K.pA, "CHF") + " " + K.fixe + " puis " : "") + Q(tA, "CHF") + " " + lab + ". " + K.B + " : " + Q(pB, "CHF") + " " + K.fixe + " puis " + Q(K.tB, "CHF") + " " + lab + ". " + K.inut + " On note " + M("x") + " le nombre de " + K.un + ".",
parts: [{ label: "Écris les prix " + M("P_A(x)") + " et " + M("P_B(x)") + ".", pts: 1 }, { label: "Calcule les deux prix pour " + T(x1) + " " + K.un + ". Lequel est le moins cher ?", pts: 1 }, { label: "Pour combien de " + K.un + " les deux prix sont-ils égaux ? Quel est alors ce prix ?", pts: 2 }, { label: "Avec un budget de " + Q(bud, "CHF") + ", combien de " + K.un + " peut-on payer chez " + K.B + " ?", pts: 1 }],
sol: ul([M("P_A(x) = " + lin(tA, K.pA)) + " ; " + M("P_B(x) = " + lin(K.tB, pB)) + ".", M("P_A(" + x1 + ") = " + N(yA)) + " CHF et " + M("P_B(" + x1 + ") = " + N(yB)) + " CHF : " + K.A + " est moins cher.", M(lin(tA, K.pA) + " = " + lin(K.tB, pB)) + " ⟺ " + M(cx(K.dt) + " = " + N(pB - K.pA)) + " ⟺ " + M("x = " + K.x0) + " ; prix " + Q(y0, "CHF") + ". Au-delà, " + K.B + " devient moins cher.", M(lin(K.tB, pB) + " = " + N(bud)) + " ⟺ " + M("x = (" + N(bud) + " - " + N(pB) + ") : " + N(K.tB) + " = " + xb) + " " + K.un + ". La phrase « " + K.inut.replace(".", "") + " » ne sert à rien."]),
chk: [[yA, N(yA)], [yB, N(yB)], [(pB - K.pA) / (tA - K.tB), String(K.x0)], [(bud - pB) / K.tB, String(xb)]] }); },

() => { let a1, a2, x0, y0, b1, b2;
do { a1 = pk([0.5, 1, 2, -0.5, -1, 1.5]); a2 = pk([-2, -1, -0.5, 0.5, 2, -1.5]); x0 = pk([-2, 2, 4]); y0 = pk([-2, -1, 1, 2, 3]); b1 = y0 - a1 * x0; b2 = y0 - a2 * x0; }
while (a1 === a2 || a1 * a2 === -1 || Math.abs(b1) > 5 || Math.abs(b2) > 5 || b1 === b2 || b1 === 0 || b2 === 0);
const z = -b1 / a1;
return X({ id: "droitesinter", lv: 1, titre: "Deux droites sur un graphique",
q: "Les droites " + M("f") + " (en couleur) et " + M("g") + " (en noir) sont représentées ci-dessous.", fig: FIG.plot([{ f: (x) => a1 * x + b1 }, { f: (x) => a2 * x + b2 }], [], { numbers: true, xr: [-6, 6], yr: [-6, 6] }),
parts: [{ label: "Lis l'ordonnée à l'origine et la pente de chaque droite. Écris " + M("f(x)") + " et " + M("g(x)") + ".", pts: 2 }, { label: "Calcule le point d'intersection de " + M("f") + " et " + M("g") + ". Vérifie sur le graphique.", pts: 2 }, { label: "Calcule le zéro de " + M("f") + ".", pts: 1 }, { label: "Les droites " + M("f") + " et " + M("g") + " sont-elles perpendiculaires ? Justifie par un calcul.", pts: 1 }],
sol: ul([M("f(x) = " + lin(a1, b1)) + " (ordonnée " + M(FR(b1)) + ", pente " + M(FR(a1)) + ") ; " + M("g(x) = " + lin(a2, b2)) + ".", M(lin(a1, b1) + " = " + lin(a2, b2)) + " ⟺ " + M(cx(a1 - a2) + " = " + FR(b2 - b1)) + " ⟺ " + M("x = " + x0) + " ; " + M("y = f(" + x0 + ") = " + y0) + ". Intersection " + M("(" + x0 + " \\,;\\, " + y0 + ")") + ".", M(lin(a1, b1) + " = 0") + " ⟺ " + M("x = " + FR(z)) + ".", "Non : " + M(FR(a1) + " \\cdot " + par(a2) + " = " + FR(a1 * a2)) + " ≠ " + M("-1") + "."]),
chk: [[(b2 - b1) / (a1 - a2), String(x0)], [a1 * x0 + b1, String(y0)], [z, FR(z).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")]] }); },

() => { const m = pk([2, -2, 3, -3, 0.5, -0.5, 1.5, -1.5]), xa = pk([-4, -3, -2, -1, 2]), ya = pk([-3, -2, -1, 2, 3, 4]), dx = 2 * pk([1, 2]), xb = xa + dx, yb = ya + m * dx, b = ya - m * xa;
let xc; do { xc = xa + pk([-2, 4, 6]); } while (xc === xb || xc === 0); const yc = m * xc + b;
const px = pk([-3, -2, -1, 2, 3]), py = pk([-4, -3, -2, -1, 2, 3, 4]), bp = py - m * px, mp = -1 / m, bq = ya - mp * xa;
return X({ id: "droites", lv: 2, titre: "Droites et points alignés",
q: "On donne les points " + M("A(" + xa + " \\,;\\, " + ya + ")") + ", " + M("B(" + xb + " \\,;\\, " + N(yb) + ")") + " et " + M("P(" + px + " \\,;\\, " + py + ")") + ".",
parts: [{ label: "Calcule la pente de la droite " + M("(AB)") + " et son équation réduite.", pts: 2 }, { label: "Le point " + M("C(x \\,;\\, " + N(yc) + ")") + " est aligné avec " + M("A") + " et " + M("B") + ". Calcule son abscisse.", pts: 1 }, { label: "Donne l'équation de la droite parallèle à " + M("(AB)") + " qui passe par " + M("P") + ".", pts: 1 }, { label: "Donne l'équation de la perpendiculaire à " + M("(AB)") + " qui passe par " + M("A") + ".", pts: 2 }],
sol: ul([M("a = \\frac{" + N(yb) + " - " + par(ya) + "}{" + xb + " - " + par(xa) + "} = " + FR(m)) + " ; " + M(ya + " = " + FR(m) + " \\cdot " + par(xa) + " + b") + ", " + M("b = " + FR(b)) + " : " + M("y = " + lin(m, b)) + ".", M(N(yc) + " = " + lin(m, b)) + " ⟺ " + M("x = " + xc) + ".", "Même pente : " + M(py + " = " + FR(m) + " \\cdot " + par(px) + " + b") + ", " + M("b = " + FR(bp)) + " : " + M("y = " + lin(m, bp)) + ".", "Pente " + M("-1 : " + par(m) + " = " + FR(mp)) + " (produit des pentes " + M("-1") + ") ; " + M("b = " + FR(bq)) + " : " + M("y = " + lin(mp, bq)) + "."]),
chk: [[(yb - ya) / (xb - xa), FR(m).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")], [(yc - b) / m, String(xc)], [m * (-1 / m), "-1"]] }); },

() => { if (R.rand() < 0.5) { const P = pk([20, 25, 30, 40, 45]), p1 = Math.round(P * pk([0.55, 0.65, 0.85])), n1 = 1 + (5 * p1) / P, n4 = 4, x4 = (P * 3) / 5, n2 = pk([4.5, 5.5]), x2 = (P * (n2 - 1)) / 5;
return X({ id: "recipaff", lv: 2, titre: "La note du test",
q: "Un test est noté sur " + Q(P, "points") + ". La note se calcule avec une fonction du premier degré : 0 point donne la note 1, " + P + " points la note 6.",
parts: [{ label: "Montre que la note est " + M("N(x) = \\frac{5}{" + P + "}x + 1") + ", où " + M("x") + " est le nombre de points.", pts: 1 }, { label: "Quelle note obtient-on avec " + Q(p1, "points") + " (au centième) ?", pts: 1 }, { label: "Détermine la fonction réciproque " + M("N^{-1}") + " : elle donne les points nécessaires pour une note.", pts: 2 }, { label: "Combien de points faut-il pour la note 4 ? Pour la note " + N(n2) + " ?", pts: 1 }],
sol: ul(["Pente " + M("\\frac{6 - 1}{" + P + "} = \\frac{5}{" + P + "}") + ", ordonnée à l'origine 1 (note pour 0 point).", M("N(" + p1 + ") = \\frac{5 \\cdot " + p1 + "}{" + P + "} + 1 \\approx " + A(n1, 2)) + ".", M("y = \\frac{5}{" + P + "}x + 1") + " ⟺ " + M("x = \\frac{" + P + "}{5}(y - 1)") + " : " + M("N^{-1}(x) = " + N(P / 5) + "(x - 1)") + ".", M("N^{-1}(4) = " + N(P / 5) + " \\cdot 3 = " + N(x4)) + " points ; " + M("N^{-1}(" + N(n2) + ") = " + N(x2)) + " points."]),
chk: [[n1, A(n1, 2), 0.01], [x4, N(x4)], [x2, N(x2)]] }); }
const t1 = pk([15, 25, 35, -10]), f1 = 1.8 * t1 + 32, Fq = pk([50, 59, 68, 77, 86, 104]), cq = ((Fq - 32) * 5) / 9;
return X({ id: "recipaff", lv: 2, titre: "Degrés Celsius et Fahrenheit",
q: "Aux États-Unis, la température est donnée en degrés Fahrenheit (°F). La conversion est " + M("F(x) = 1{,}8x + 32") + ", où " + M("x") + " est la température en °C.",
parts: [{ label: "Quelle température en °F correspond à " + T(t1) + " °C ?", pts: 1 }, { label: "Détermine la fonction réciproque " + M("F^{-1}") + ".", pts: 2 }, { label: "Un bulletin météo annonce " + T(Fq) + " °F. Combien de °C cela fait-il ?", pts: 1 }, { label: "Pour quelle température les deux échelles indiquent-elles le même nombre ?", pts: 1 }],
sol: ul([M("F(" + t1 + ") = 1{,}8 \\cdot " + par(t1) + " + 32 = " + N(f1)) + " °F.", M("y = 1{,}8x + 32") + " ⟺ " + M("x = \\frac{y - 32}{1{,}8}") + " : " + M("F^{-1}(x) = \\frac{x - 32}{1{,}8}") + ".", M("F^{-1}(" + Fq + ") = \\frac{" + (Fq - 32) + "}{1{,}8} = " + N(cq)) + " °C.", M("x = 1{,}8x + 32") + " ⟺ " + M("-0{,}8x = 32") + " ⟺ " + M("x = -40") + " : −40 °C = −40 °F (intersection avec la droite " + M("y = x") + ")."]),
chk: [[f1, N(f1)], [cq, N(cq)], [-40, "-40"]] }); },

() => { const K = pk([["bougies", "bougie"], ["savons artisanaux", "savon"], ["t-shirts imprimés", "t-shirt"], ["pots de confiture", "pot"]]), mg = pk([6, 8, 12, 15]), s = pk([40, 50, 75, 120]), F = mg * s, cv = pk([4, 5, 7]), p = cv + mg, G = mg * pk([20, 30, 50]), xg = s + G / mg, xq = s - pk([10, 15, 20]);
return X({ id: "affzero", lv: 2, titre: "Le seuil de rentabilité",
q: "Un petit atelier fabrique des " + K[0] + ". Chaque " + K[1] + " coûte " + Q(cv, "CHF") + " de matériel et se vend " + Q(p, "CHF") + ". Les frais fixes (loyer, électricité) sont de " + Q(F, "CHF") + " par mois. L'atelier est ouvert 5 jours par semaine. On note " + M("x") + " le nombre de pièces vendues en un mois.",
parts: [{ label: "Écris le bénéfice mensuel " + M("B(x)") + ".", pts: 1 }, { label: "Calcule le zéro de " + M("B") + ". Que signifie-t-il pour l'atelier ?", pts: 2 }, { label: "Dresse le tableau de signes de " + M("B") + ". Que se passe-t-il si l'atelier vend " + xq + " pièces ?", pts: 1 }, { label: "Combien de pièces faut-il vendre pour gagner " + Q(G, "CHF") + " par mois ?", pts: 1 }],
sol: ul(["Gain par pièce " + M(p + " - " + cv + " = " + mg) + " CHF : " + M("B(x) = " + mg + "x - " + N(F)) + ".", M(mg + "x - " + N(F) + " = 0") + " ⟺ " + M("x = " + s) + " : c'est le seuil de rentabilité ; à partir de " + s + " pièces, l'atelier ne perd plus d'argent.", "Pente positive : " + M("B(x) \\lt 0") + " pour " + M("x \\lt " + s) + ", " + M("B(x) > 0") + " pour " + M("x > " + s) + ". Avec " + xq + " pièces : perte de " + Q(mg * (s - xq), "CHF") + ".", M(mg + "x - " + N(F) + " = " + N(G)) + " ⟺ " + M("x = " + xg) + " pièces. Le nombre de jours d'ouverture ne sert à rien."]),
chk: [[F / mg, String(s)], [mg * (s - xq), String(mg * (s - xq))], [(G + F) / mg, String(xg)]] }); },

() => { const dA = pk([12, 15, 20]), dB = pk([5, 8, 10]), t0 = pk([10, 12, 15, 20]), VB = pk([100, 150, 200]), VA = VB + (dA + dB) * t0, ve = r6(VA / dA), T2 = t0 + 5, VA2 = VB + (dA + dB) * T2;
return X({ id: "modaff", lv: 3, titre: "Deux citernes",
q: "La citerne A contient " + Q(VA, "L") + " et se vide à raison de " + Q(dA, "L/min") + ". Au même moment, la citerne B, qui contient " + Q(VB, "L") + ", se remplit à raison de " + Q(dB, "L/min") + ".",
parts: [{ label: "Écris les volumes " + M("A(t)") + " et " + M("B(t)") + " après " + M("t") + " minutes.", pts: 1 }, { label: "Après combien de temps les deux citernes contiennent-elles le même volume ? Lequel ?", pts: 2 }, { label: "Quand la citerne A sera-t-elle vide (au dixième de minute) ? Que contient alors B (au litre) ?", pts: 2 }, { label: "Quel volume initial faudrait-il dans A pour que les volumes soient égaux après " + T2 + " minutes ?", pts: 1 }],
sol: ul([M("A(t) = " + N(VA) + " - " + dA + "t") + " ; " + M("B(t) = " + VB + " + " + dB + "t") + ".", M(N(VA) + " - " + dA + "t = " + VB + " + " + dB + "t") + " ⟺ " + M((dA + dB) + "t = " + N(VA - VB)) + " ⟺ " + M("t = " + t0) + " min ; volume " + Q(VB + dB * t0, "L") + ".", M(N(VA) + " - " + dA + "t = 0") + " ⟺ " + M("t \\approx " + A(ve, 1)) + " min ; " + M("B(" + A(ve, 1) + ") \\approx " + A(VB + dB * ve, 0)) + " L.", M("V - " + dA + " \\cdot " + T2 + " = " + VB + " + " + dB + " \\cdot " + T2) + " ⟺ " + M("V = " + N(VA2)) + " L."]),
chk: [[(VA - VB) / (dA + dB), String(t0)], [VA / dA, A(ve, 1), 0.1], [VB + dB * ve, A(VB + dB * ve, 0), 1], [VA2, N(VA2)]] }); },
];
const RAISONA = [
() => { let xa, ya, xb, yb; do { xa = pk([-3, -2, -1, 2, 3]); ya = pk([-3, -2, -1, 2, 3, 4]); xb = xa + R.int(2, 5); yb = ya + pk([-1, 1]) * R.int(2, 7); } while (Math.abs(yb - ya) === xb - xa || [0, 1].includes(xb) || yb === 0 || ya * (xb - xa) === xa * (yb - ya)); const w = who(), m = (yb - ya) / (xb - xa), b = ya - m * xa;
return X({ id: "droites", lv: 1, titre: "Trouve l'erreur",
q: w + " calcule la pente de la droite passant par " + M("A(" + xa + " \\,;\\, " + ya + ")") + " et " + M("B(" + xb + " \\,;\\, " + yb + ")") + " : « " + M("a = \\frac{" + xb + " - " + par(xa) + "}{" + yb + " - " + par(ya) + "} = " + FR((xb - xa) / (yb - ya))) + " ».",
parts: [{ label: "Quelle est l'erreur ? Calcule la bonne pente.", pts: 1 }, { label: "Donne l'équation réduite de la droite " + M("(AB)") + " et vérifie-la avec le point " + M("B") + ".", pts: 2 }],
sol: ul(["Les différences sont inversées : la pente est " + M("\\frac{\\Delta y}{\\Delta x} = \\frac{" + yb + " - " + par(ya) + "}{" + xb + " - " + par(xa) + "} = " + FR(m)) + ".", M("y = " + lin(m, b)) + " ; " + M(FR(m) + " \\cdot " + par(xb) + sg(b) + " = " + yb) + " ✓."]),
chk: [[m * xb + b, String(yb)]] }); },
() => VF("affine", 1, [["« La droite " + M("y = 3") + " a une pente nulle. »", true, "Elle est horizontale : " + M("y = 0x + 3") + "."],
["« Les droites " + M("y = 2x + 1") + " et " + M("y = -2x + 1") + " sont perpendiculaires. »", false, "Le produit des pentes vaut " + M("2 \\cdot (-2) = -4") + ", pas " + M("-1") + "."],
["« La réciproque de " + M("f(x) = 3x") + " est " + M("g(x) = \\frac{x}{3}") + ". »", true, M("g(f(x)) = \\frac{3x}{3} = x") + "."],
["« Une fonction de pente négative a toujours un zéro positif. »", false, "Contre-exemple : " + M("f(x) = -x - 2") + " a pour zéro " + M("-2") + "."],
["« Deux droites qui ont la même ordonnée à l'origine sont confondues. »", false, M("y = x + 1") + " et " + M("y = 2x + 1") + " se coupent seulement en " + M("(0 \\,;\\, 1)") + "."],
["« La droite " + M("x = 4") + " représente une fonction. »", false, "Elle est verticale : la valeur 4 aurait une infinité d'images."],
["« Si " + M("f(2) = 7") + " et " + M("f(5) = 13") + ", la pente de " + M("f") + " vaut 2. »", true, M("\\frac{13 - 7}{5 - 2} = 2") + "."]]),
() => { const a = pk([2, 3, 4, 5]), b = pk([-7, -5, -3, 3, 5, 6]), w = who(), x1 = pk([2, 3]), y1 = a * x1 + b;
return X({ id: "recipaff", lv: 2, titre: "Trouve l'erreur",
q: "Pour " + M("f(x) = " + lin(a, b)) + ", " + w + " affirme que la réciproque est " + M("g(x) = \\frac{x}{" + a + "}" + sg(b)) + ".",
parts: [{ label: "Calcule " + M("f(" + x1 + ")") + ", puis " + M("g(f(" + x1 + "))") + ". Que constates-tu ?", pts: 1 }, { label: "Détermine la bonne réciproque et vérifie-la.", pts: 2 }],
sol: ul([M("f(" + x1 + ") = " + y1) + " ; " + M("g(" + y1 + ") = " + FR(y1 / a + b)) + " ≠ " + x1 + " : " + M("g") + " n'est pas la réciproque.", M("y = " + lin(a, b)) + " ⟺ " + M("x = \\frac{y" + sg(-b) + "}{" + a + "}") + " : " + M("f^{-1}(x) = \\frac{x" + sg(-b) + "}{" + a + "}") + ". Vérification : " + M("f^{-1}(" + y1 + ") = " + x1) + " ✓. " + w + " a divisé seulement " + M("x") + " par " + a + " et n'a pas changé le signe de " + M(FR(b)) + "."]),
chk: [[(y1 - b) / a, String(x1)]] }); },
];


const sinX = { 30: "\\frac{1}{2}", 45: "\\frac{\\sqrt{2}}{2}", 60: "\\frac{\\sqrt{3}}{2}", 90: "1", 0: "0" };
const exS = (deg) => { const r = ((deg % 360) + 360) % 360, ref = r <= 90 ? r : r <= 180 ? 180 - r : r <= 270 ? r - 180 : 360 - r, s = r > 180 ? "-" : ""; return s + sinX[ref]; };
const exC = (deg) => exS(90 - deg);
const radX = (deg) => { const g = RX.g2(deg, 180), n = deg / g, d = 180 / g; return d === 1 ? (n === 1 ? "\\pi" : n + "\\pi") : "\\frac{" + (n === 1 ? "" : n) + "\\pi}{" + d + "}"; };
const quad = (deg) => (deg < 90 ? "1er" : deg < 180 ? "2e" : deg < 270 ? "3e" : "4e");

const sinFig = (c) => {
const X = (x) => 34 + (x / 360) * 270, Y = (y) => 90 - y * 62, ln = (a, b, e, f, k, x = "") => '<line x1="' + a + '" y1="' + b + '" x2="' + e + '" y2="' + f + '" class="' + k + '" ' + x + "/>", tx = (x, y, s, an = "middle") => '<text x="' + x + '" y="' + y + '" class="f-txt f-tick" text-anchor="' + an + '" font-size="11">' + s + "</text>";
let g = ln(X(0), Y(0), X(360) + 8, Y(0), "f-line") + ln(X(0), Y(-1.3), X(0), Y(1.3), "f-line");
[90, 180, 270, 360].forEach((x) => (g += ln(X(x), Y(0) - 4, X(x), Y(0) + 4, "f-line") + tx(X(x), Y(0) + 17, x + "°")));
[1, -1].forEach((y) => (g += ln(X(0) - 4, Y(y), X(0) + 4, Y(y), "f-line") + tx(X(0) - 8, Y(y) + 4, y === 1 ? "1" : "−1", "end")));
let d = ""; for (let x = 0; x <= 360; x += 3) d += (x ? " L" : "M") + X(x).toFixed(1) + "," + Y(Math.sin(x * RX.D)).toFixed(1);
g += '<path d="' + d + '" class="f-accent" fill="none" stroke-width="2.4"/>' + ln(X(0), Y(c), X(360), Y(c), "f-line", 'stroke-width="2" stroke-dasharray="6 4"') + tx(X(360) + 4, Y(c) - 6, "y = " + String(c).replace(".", ","), "end");
return '<svg class="fig" viewBox="0 0 320 180" role="img" aria-label="graphe de sinus" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
};
const EXT = [

() => { const a = R.int(40, 72), b = R.int(45, 78), d = pk([800, 1200, 1500, 2000]), g = 180 - a - b, AC = (d * Math.sin(b * D)) / Math.sin(g * D), BC = (d * Math.sin(a * D)) / Math.sin(g * D), h = AC * Math.sin(a * D);
return X({ id: "sinlaw", lv: 2, titre: "Le bateau en vue",
q: "Deux postes d'observation " + M("A") + " et " + M("B") + ", sur une côte rectiligne, sont distants de " + Q(d, "m") + ". Ils visent un bateau " + M("C") + " : " + M("\\widehat{CAB} = " + a + "°") + " et " + M("\\widehat{ABC} = " + b + "°") + ".", fig: FIG.anyTriangle(["", "", Q(d, "m"), a + "°", "A"]),
parts: [{ label: "Calcule l'angle " + M("\\widehat{ACB}") + ".", pts: 1 }, { label: "Calcule les distances " + M("AC") + " et " + M("BC") + " (au mètre).", pts: 2 }, { label: "À quelle distance de la côte se trouve le bateau (au mètre) ?", pts: 2 }],
sol: ul([M("180° - " + a + "° - " + b + "° = " + g + "°") + ".", "Théorème du sinus : " + M("AC = \\frac{" + d + " \\cdot \\sin(" + b + "°)}{\\sin(" + g + "°)} \\approx " + A(AC, 0)) + " m ; " + M("BC = \\frac{" + d + " \\cdot \\sin(" + a + "°)}{\\sin(" + g + "°)} \\approx " + A(BC, 0)) + " m.", "Distance = hauteur issue de " + M("C") + " : " + M("h = AC \\cdot \\sin(" + a + "°) \\approx " + A(h, 0)) + " m."]),
chk: [[AC, A(AC, 0), 1], [BC, A(BC, 0), 1], [h, A(h, 0), 1]] }); },

() => { const v1 = pk([4, 4.5, 5]), v2 = pk([3, 3.5, 6]), t = pk([2, 3]), th = R.int(40, 115), d1 = v1 * t, d2 = v2 * t, d = Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(th * D));
let th2; do { th2 = R.int(35, 120); } while (Math.abs(th2 - th) < 10); const D2 = +Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(th2 * D)).toFixed(2), back = Math.acos((d1 * d1 + d2 * d2 - D2 * D2) / (2 * d1 * d2)) / D;
return X({ id: "sinlaw", lv: 1, titre: "Deux randonneurs",
q: "Deux randonneurs partent du même refuge. L'un marche à " + Q(v1, "km/h") + ", l'autre à " + Q(v2, "km/h") + " ; leurs directions forment un angle de " + M(th + "°") + ". Ils emportent chacun 1,5 L d'eau.",
parts: [{ label: "Quelle distance chacun a-t-il parcourue après " + t + " h ?", pts: 1 }, { label: "Quelle distance les sépare alors (au centième de km) ?", pts: 2 }, { label: "Un autre jour, après " + t + " h aux mêmes vitesses, ils sont à " + Q(D2, "km") + " l'un de l'autre. Quel angle formaient leurs directions (au dixième de degré) ?", pts: 2 }],
sol: ul([M(N(v1) + " \\cdot " + t + " = " + N(d1)) + " km et " + M(N(v2) + " \\cdot " + t + " = " + N(d2)) + " km.", "Théorème du cosinus : " + M("d^2 = " + N(d1) + "^2 + " + N(d2) + "^2 - 2 \\cdot " + N(d1) + " \\cdot " + N(d2) + " \\cdot \\cos(" + th + "°)") + ", " + M("d \\approx " + A(d, 2)) + " km.", M("\\cos(\\alpha) = \\frac{" + N(d1) + "^2 + " + N(d2) + "^2 - " + N(D2) + "^2}{2 \\cdot " + N(d1) + " \\cdot " + N(d2) + "}") + ", " + M("\\alpha \\approx " + A(back, 1) + "°") + ". La quantité d'eau ne sert à rien."]),
chk: [[d, A(d, 2), 0.01], [back, A(back, 1), 0.1]] }); },

() => { const a = pk([24, 30, 36, 42]), b = pk([28, 35, 40, 45]), g = R.int(50, 80), S = 0.5 * a * b * Math.sin(g * D), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(g * D)), p = pk([450, 600, 850]);
let g2; do { g2 = R.int(30, 75); } while (Math.abs(g2 - g) < 5); const S2 = Math.round(0.5 * a * b * Math.sin(g2 * D)), al = Math.asin((2 * S2) / (a * b)) / D;
return X({ id: "triaire", lv: 2, titre: "Le terrain à bâtir",
q: "Un terrain triangulaire a deux côtés de " + Q(a, "m") + " et " + Q(b, "m") + " qui forment un angle de " + M(g + "°") + ". Il est vendu " + Q(p, "CHF") + " le m².",
parts: [{ label: "Calcule l'aire du terrain (au m²).", pts: 1 }, { label: "Calcule son prix.", pts: 1 }, { label: "Calcule la longueur du troisième côté (au dm), puis la longueur de clôture nécessaire.", pts: 2 }, { label: "Un terrain voisin a aussi deux côtés de " + Q(a, "m") + " et " + Q(b, "m") + ", mais une aire de " + Q(S2, "m^2") + ". Quel angle forment ces côtés ? (deux réponses possibles)", pts: 2 }],
sol: ul([M("\\mathcal{A} = \\frac{1}{2} \\cdot " + a + " \\cdot " + b + " \\cdot \\sin(" + g + "°) \\approx " + A(S, 0)) + " m².", M(A(S, 0) + " \\cdot " + p + " = " + N(Math.round(S) * p)) + " CHF (avec l'aire arrondie).", M("c^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cdot \\cos(" + g + "°)") + ", " + M("c \\approx " + A(c, 1)) + " m ; clôture " + M("\\approx " + A(a + b + c, 1)) + " m.", M("\\sin(\\gamma) = \\frac{2 \\cdot " + S2 + "}{" + a + " \\cdot " + b + "} \\approx " + A((2 * S2) / (a * b), 4)) + " : " + M("\\gamma \\approx " + A(al, 1) + "°") + " ou " + M("\\gamma \\approx " + A(180 - al, 1) + "°") + " (même sinus)."]),
chk: [[S, A(S, 0), 1], [c, A(c, 1), 0.1], [al, A(al, 1), 0.1], [180 - al, A(180 - al, 1), 0.1]] }); },

() => { const th = pk([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), H = pk([30, 35, 40]), Rr = pk([20, 24, 28]), y = H + Rr * Math.sin(th * D), th2 = (540 - th) % 360;
return X({ id: "trigcercle", lv: 1, titre: "La grande roue",
q: "Le centre d'une grande roue est à " + Q(H, "m") + " du sol et son rayon est de " + Q(Rr, "m") + ". On repère une cabine par l'angle " + M("\\theta") + " entre l'horizontale (vers la droite) et le rayon qui la porte, compté dans le sens inverse des aiguilles d'une montre. Une cabine est à " + M("\\theta = " + th + "°") + ".", fig: FIG.unitCircle(th, th + "°"),
parts: [{ label: "Convertis " + M(th + "°") + " en radians (valeur exacte). Dans quel quadrant est la cabine ?", pts: 1 }, { label: "Donne les valeurs exactes de " + M("\\sin(" + th + "°)") + " et " + M("\\cos(" + th + "°)") + ".", pts: 2 }, { label: "À quelle hauteur se trouve la cabine (au centimètre) ?", pts: 1 }, { label: "Quelle autre cabine (angle entre 0° et 360°) est exactement à la même hauteur ? Donne l'angle en degrés et en radians.", pts: 1 }],
sol: ul([M(th + "° = " + th + " \\cdot \\frac{\\pi}{180} = " + radX(th)) + " ; " + quad(th) + " quadrant.", M("\\sin(" + th + "°) = " + exS(th)) + " ; " + M("\\cos(" + th + "°) = " + exC(th)) + ".", M("h = " + H + " + " + Rr + " \\cdot \\sin(" + th + "°) " + (Math.abs(y - Math.round(y)) < 1e-9 ? "= " : "\\approx ") + A(y, 2)) + " m.", "Même sinus : " + (th > 180 ? M("180° - " + th + "° = " + (180 - th) + "°") + ", soit " + M(th2 + "°") + " (on ajoute 360°)" : M("180° - " + th + "° = " + th2 + "°")) + ", c'est-à-dire " + M(radX(th2)) + "."]),
chk: [[y, A(y, 2), 0.01], [Math.sin(th2 * D), N(Math.sin(th * D)), 1e-5]] }); },

() => { const cv = pk([[0.5, "\\frac{1}{2}", 60], [-0.5, "-\\frac{1}{2}", 120], [Math.SQRT1_2, "\\frac{\\sqrt{2}}{2}", 45], [Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}", 30]]), c = pk([0.3, 0.4, 0.6, 0.7, -0.3, -0.6]), s1 = Math.asin(c) / D, sols = c > 0 ? [s1, 180 - s1] : [180 - s1, 360 + s1];
const kk = pk([1, 2, 3]), rr = kk + 1;
return X({ id: "trigeq", lv: 2, titre: "Résoudre des équations",
q: "Résous les équations suivantes ; " + M("k \\in \\mathbb{Z}") + ".",
parts: [{ label: "Sans calculatrice, en degrés : " + M("\\cos(x) = " + cv[1]) + ".", pts: 1 }, { label: "Avec la calculatrice, les solutions dans " + M("[0° \\,;\\, 360°[") + " de " + M("\\sin(x) = " + N(c)) + " (au centième de degré).", pts: 2 }, { label: "Sans calculatrice, en radians : " + M("2\\sin(x) + " + kk + " = " + rr) + ".", pts: 2 }],
sol: ul([M("x = \\pm " + cv[2] + "° + k \\cdot 360°") + ".", M("\\sin^{-1}(" + N(c) + ") \\approx " + A(s1, 2) + "°") + (c > 0 ? " ; l'autre solution est " + M("180° - " + A(s1, 2) + "° = " + A(sols[1], 2) + "°") : " (hors de l'intervalle) ; solutions " + M("180° + " + A(-s1, 2) + "° = " + A(sols[0], 2) + "°") + " et " + M("360° - " + A(-s1, 2) + "° = " + A(sols[1], 2) + "°")) + ".", M("\\sin(x) = \\frac{1}{2}") + " : " + M("x = \\frac{\\pi}{6} + 2k\\pi") + " ou " + M("x = \\frac{5\\pi}{6} + 2k\\pi") + "."]),
chk: [[sols[0], A(sols[0], 2), 0.01], [sols[1], A(sols[1], 2), 0.01], [Math.cos(cv[2] * D), N(cv[0]), 1e-5]] }); },

() => { const c = pk([0.3, 0.6, 0.8, -0.3, -0.6]), s1 = Math.asin(c) / D, x1 = c > 0 ? s1 : 180 - s1, x2 = c > 0 ? 180 - s1 : 360 + s1;
const fig = sinFig(c);
return X({ id: "trigfn", lv: 2, titre: "Le graphe de la fonction sinus",
q: "On a tracé " + M("f(x) = \\sin(x)") + " pour " + M("x") + " entre 0° et 360° (en couleur) et la droite " + M("y = " + N(c)) + ".", fig,
parts: [{ label: "Combien l'équation " + M("\\sin(x) = " + N(c)) + " a-t-elle de solutions dans " + M("[0° \\,;\\, 360°]") + " ? Lis-le sur le graphique.", pts: 1 }, { label: "Calcule ces solutions (au dixième de degré).", pts: 2 }, { label: "Pour quels " + M("x") + " de " + M("[0° \\,;\\, 360°]") + " a-t-on " + M("\\sin(x) > " + N(c)) + " ?", pts: 1 }, { label: "Quelle est la valeur maximale de " + M("f") + " ? Pour quel " + M("x") + " est-elle atteinte ? Quelle est la période de " + M("f") + " ?", pts: 1 }],
sol: ul(["Deux points d'intersection : deux solutions.", M("\\sin^{-1}(" + N(c) + ") \\approx " + A(s1, 1) + "°") + " ; " + (c > 0 ? "solutions " + M(A(x1, 1) + "°") + " et " + M("180° - " + A(s1, 1) + "° = " + A(x2, 1) + "°") : "solutions " + M("180° + " + A(-s1, 1) + "° = " + A(x1, 1) + "°") + " et " + M("360° - " + A(-s1, 1) + "° = " + A(x2, 1) + "°")) + ".", c > 0 ? "Entre les deux solutions : " + M("x \\in \\,]" + A(x1, 1) + "° \\,;\\, " + A(x2, 1) + "°[") + "." : "En dehors des deux solutions : " + M("x \\in [0° \\,;\\, " + A(x1, 1) + "°[ \\cup \\,]" + A(x2, 1) + "° \\,;\\, 360°]") + ".", "Maximum 1, atteint en " + M("x = 90°") + " ; période " + M("360°") + " (ou " + M("2\\pi") + ")."]),
chk: [[x1, A(x1, 1), 0.1], [x2, A(x2, 1), 0.1]] }); },
];
EXT.push(

() => { const m = pk([12, 14, 16, 18]), a = pk([4, 6, 8]), t0 = pk([8, 9, 10]), tq = pk([11, 13, 15]).valueOf(), Tq = m + a * Math.sin(15 * (tq - t0) * D), Th = m + a / 2;
return X({ id: "trigeq2", lv: 3, titre: "La température de la journée",
q: "Un jour de printemps, la température (en °C) à l'heure " + M("t") + " (de 0 à 24 h) est modélisée par " + M("T(t) = " + m + " + " + a + "\\sin\\big(15 \\cdot (t - " + t0 + ")\\big)") + ", l'angle étant en degrés.",
parts: [{ label: "Quelle température fait-il à " + tq + " h (au dixième) ?", pts: 1 }, { label: "Quelle est la température maximale ? À quelle heure est-elle atteinte ?", pts: 2 }, { label: "À quelles heures fait-il " + N(Th) + " °C ?", pts: 2 }, { label: "Pendant combien d'heures la température dépasse-t-elle " + N(Th) + " °C ?", pts: 1 }],
sol: ul([M("T(" + tq + ") = " + m + " + " + a + "\\sin(" + 15 * (tq - t0) + "°) \\approx " + A(Tq, 1)) + " °C.", "Le sinus vaut au plus 1 : " + M("T_{max} = " + (m + a)) + " °C, quand " + M("15(t - " + t0 + ") = 90") + ", soit " + M("t = " + (t0 + 6)) + " h.", M(m + " + " + a + "\\sin(\\ldots) = " + N(Th)) + " ⟺ " + M("\\sin(15(t - " + t0 + ")) = \\frac{1}{2}") + " ⟺ " + M("15(t - " + t0 + ") = 30") + " ou " + M("150") + " : " + M("t = " + (t0 + 2)) + " h ou " + M("t = " + (t0 + 10)) + " h.", "Entre " + (t0 + 2) + " h et " + (t0 + 10) + " h : pendant 8 heures."]),
chk: [[Tq, A(Tq, 1), 0.1], [t0 + 30 / 15, String(t0 + 2)], [t0 + 150 / 15, String(t0 + 10)]] }); });
const RAISONT = [
() => { const a = pk([30, 50, 60]), w = who(), wrong = Math.sin(a);
return X({ id: "trigcercle", lv: 1, titre: "Trouve l'erreur",
q: w + " calcule " + M("\\sin(" + a + "°)") + " et trouve " + M(A(wrong, 4)) + ".",
parts: [{ label: "Pourquoi ce résultat est-il impossible pour un angle de " + a + "° ? (pense au cercle trigonométrique)", pts: 1 }, { label: "Quelle erreur a été faite ? Donne la bonne valeur (au millième).", pts: 1 }],
sol: ul(["Entre 0° et 90°, le point est dans le 1er quadrant : son ordonnée (le sinus) est positive, pas négative.", "La calculatrice était en mode radians : elle a calculé le sinus de " + a + " rad. En degrés : " + M("\\sin(" + a + "°) \\approx " + A(Math.sin(a * D), 3)) + "."]),
chk: [[Math.sin(a * D), A(Math.sin(a * D), 3), 0.001]] }); },
() => VF("trigassoc", 1, [["« " + M("\\sin(180° - x) = \\sin(x)") + " pour tout angle " + M("x") + ". »", true, "Les deux angles sont symétriques par rapport à l'axe vertical : même ordonnée sur le cercle."],
["« " + M("\\cos(-x) = -\\cos(x)") + ". »", false, M("x") + " et " + M("-x") + " sont symétriques par rapport à l'axe horizontal : même abscisse, " + M("\\cos(-x) = \\cos(x)") + "."],
["« La fonction tangente a une période de 180°. »", true, M("\\tan(x + 180°) = \\tan(x)") + " : le point diamétralement opposé donne le même rapport."],
["« L'équation " + M("\\sin(x) = 1{,}2") + " a une solution. »", false, "Le sinus est toujours compris entre −1 et 1."],
["« 1 radian vaut environ 57,3°. »", true, M("\\frac{180°}{\\pi} \\approx 57{,}3°") + "."],
["« Si on connaît les trois angles d'un triangle, on peut calculer ses côtés. »", false, "Il faut au moins une longueur : deux triangles semblables ont les mêmes angles."],
["« Pour " + M("\\gamma = 90°") + ", le théorème du cosinus redonne le théorème de Pythagore. »", true, M("\\cos(90°) = 0") + " : " + M("c^2 = a^2 + b^2") + "."]]),
() => { const v = pk([["\\frac{1}{2}", 30, 150, "sin"], ["\\frac{\\sqrt{2}}{2}", 45, 135, "sin"], ["\\frac{1}{2}", 60, 300, "cos"], ["\\frac{\\sqrt{3}}{2}", 30, 330, "cos"]]), w = who();
return X({ id: "trigeq", lv: 2, titre: "Trouve l'erreur",
q: w + " résout " + M("\\" + v[3] + "(x) = " + v[0]) + " dans " + M("[0° \\,;\\, 360°[") + " : « avec la calculatrice, " + M("x = " + v[1] + "°") + ". C'est la seule solution. »",
parts: [{ label: "Vérifie que " + M(v[2] + "°") + " est aussi solution.", pts: 1 }, { label: "Explique à l'aide du cercle trigonométrique pourquoi il y a deux solutions.", pts: 1 }],
sol: ul([M("\\" + v[3] + "(" + v[2] + "°) = " + v[0]) + " : c'est aussi une solution.", v[3] === "sin" ? "La droite horizontale d'ordonnée " + M(v[0]) + " coupe le cercle en deux points, symétriques par rapport à l'axe vertical : les angles " + M(v[1] + "°") + " et " + M("180° - " + v[1] + "° = " + v[2] + "°") + "." : "La droite verticale d'abscisse " + M(v[0]) + " coupe le cercle en deux points, symétriques par rapport à l'axe horizontal : les angles " + M(v[1] + "°") + " et " + M("360° - " + v[1] + "° = " + v[2] + "°") + "."]),
chk: [[v[3] === "sin" ? Math.sin(v[2] * D) : Math.cos(v[2] * D), v[3] === "sin" ? N(Math.sin(v[1] * D)) : N(Math.cos(v[1] * D)), 1e-5]] }); },
];


const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length, sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };
const med = (s) => { const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const lst = (a) => a.map((x) => N(x)).join(" ; ");
const EXS = [

() => { const Nt = pk([36, 40, 45, 60, 72]), cats = ["Bus ou tram", "Vélo", "À pied", "Voiture", "Train"], e = [];
do { e.length = 0; [0.35, 0.2, 0.15, 0.1].forEach((p) => e.push(Math.max(2, Math.round(Nt * p * (0.7 + 0.6 * R.rand()))))); e.push(Nt - e.reduce((s, x) => s + x, 0)); } while (e[4] < 3);
const deg = 360 / Nt, N2 = pk([24, 30, 120]), ang = pk([60, 90, 108, 120]), e2 = (ang / 360) * N2;
return X({ id: "statfreq", lv: 1, titre: "Comment viens-tu au CFPT ?",
q: "On a demandé à " + Nt + " apprentis leur moyen de transport principal (enquête faite un mardi de pluie)." + RX.tab(["Moyen", "Effectif"], cats.map((c, i) => [c, e[i]])),
parts: [{ label: "Quelle est la variable étudiée ? De quel type est-elle ?", pts: 1 }, { label: "Calcule la fréquence de chaque moyen (en %, au dixième).", pts: 2 }, { label: "Calcule l'angle de chaque secteur d'un diagramme circulaire.", pts: 2 }, { label: "Dans une autre classe de " + N2 + " apprentis, le secteur « Vélo » mesure " + ang + "°. Combien d'apprentis viennent à vélo ?", pts: 1 }],
sol: ul(["Le moyen de transport : variable qualitative nominale.", cats.map((c, i) => c + " " + M(A((e[i] / Nt) * 100, 1) + "\\,\\%")).join(" ; ") + ".", "Chaque apprenti vaut " + M("360° : " + Nt + " = " + deg + "°") + " : " + cats.map((c, i) => c + " " + M(e[i] * deg + "°")).join(" ; ") + " (total 360°).", M("\\frac{" + ang + "}{360} \\cdot " + N2 + " = " + N(e2)) + " apprentis. La pluie du mardi peut fausser l'enquête, mais ne change pas le calcul."]),
chk: [[e.reduce((s, x) => s + x, 0), String(Nt)], ...e.map((x) => [(x / Nt) * 100, A((x / Nt) * 100, 1), 0.1]), [e2, N(e2)]] }); },

() => { let n, s, need, tg; do { n = pk([5, 6, 7]); s = Array.from({ length: n }, () => pk([3, 3.5, 4, 4, 4.5, 4.5, 5, 5.5])); tg = pk([4.5, 5]); need = tg * (n + 1) - s.reduce((a, b) => a + b, 0); } while (need < 3.5 || need > 6 || new Set(s).size < 3);
const m = mean(s), sr = s.slice().sort((a, b) => a - b), me = med(sr), sig = sd(s), cnt = {}; s.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const mx = Math.max(...Object.values(cnt)), modes = Object.keys(cnt).filter((k) => cnt[k] === mx).map(Number).sort((a, b) => a - b), w = who(), nh = Math.ceil(need * 2 - 1e-9) / 2;
return X({ id: "stats", lv: 1, titre: "Les notes de " + w,
q: "Voici les notes de " + w + " ce semestre, dans l'ordre : " + M(lst(s)) + ".",
parts: [{ label: "Calcule la moyenne (au centième) et la médiane.", pts: 2 }, { label: "Quel est le mode ?", pts: 1 }, { label: "Calcule l'écart-type (au centième).", pts: 1 }, { label: "Il reste un test. Quelle note minimale (au demi-point) faut-il pour finir avec une moyenne d'au moins " + N(tg) + " ?", pts: 2 }],
sol: ul(["Moyenne " + M("\\frac{" + N(s.reduce((a, b) => a + b, 0)) + "}{" + n + "} \\approx " + A(m, 2)) + " ; série triée " + M(lst(sr)) + ", médiane " + M(N(me)) + ".", "Mode : " + modes.map((x) => M(N(x))).join(" et ") + " (" + mx + " fois).", M("\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{" + n + "}} \\approx " + A(sig, 2)) + ".", "Il faut une somme de " + M(N(tg) + " \\cdot " + (n + 1) + " = " + N(tg * (n + 1))) + " : " + M(N(tg * (n + 1)) + " - " + N(s.reduce((a, b) => a + b, 0)) + " = " + N(need)) + ", donc au moins " + M(N(nh)) + "."]),
chk: [[m, A(m, 2), 0.01], [me, N(me)], [sig, A(sig, 2), 0.01], [need, N(need)]] }); },

() => { const s = Array.from({ length: 11 }, () => R.int(18, 40)).sort((a, b) => a - b), q1 = s[2], me = s[5], q3 = s[8]; let bq1, bq3, bme;
do { bme = me + R.int(-3, 3); bq1 = bme - pk([2, 3]); bq3 = bme + pk([2, 3, 4]); } while (bq3 - bq1 === q3 - q1);
const sh = RX.shuffle(s), reg = bq3 - bq1 < q3 - q1 ? "B" : "A";
return X({ id: "quartiles", lv: 2, titre: "La course d'orientation",
q: "Groupe A (11 apprentis), temps en minutes : " + M(lst(sh)) + ". Pour le groupe B, on connaît seulement : minimum " + (bq1 - 5) + ", " + M("Q_1 = " + bq1) + ", médiane " + bme + ", " + M("Q_3 = " + bq3) + ", maximum " + (bq3 + 9) + ".",
parts: [{ label: "Range les temps du groupe A et donne l'étendue.", pts: 1 }, { label: "Détermine la médiane, " + M("Q_1") + " et " + M("Q_3") + " du groupe A.", pts: 2 }, { label: "Calcule l'écart interquartile de chaque groupe. Quel groupe a les temps les plus réguliers ?", pts: 2 }, { label: "Environ quel pourcentage du groupe B a mis moins de " + bq3 + " minutes ?", pts: 1 }],
sol: ul([M(lst(s)) + " ; étendue " + M(s[10] + " - " + s[0] + " = " + (s[10] - s[0])) + " min.", "Médiane : 6e valeur, " + M(me) + " ; " + M("Q_1") + " : médiane des 5 premières (3e valeur), " + M(q1) + " ; " + M("Q_3") + " : 9e valeur, " + M(q3) + ".", "A : " + M(q3 + " - " + q1 + " = " + (q3 - q1)) + " ; B : " + M(bq3 + " - " + bq1 + " = " + (bq3 - bq1)) + ". Le groupe " + reg + " est le plus régulier (moitié centrale plus resserrée).", "75 % (sous " + M("Q_3") + ")."]),
chk: [[s[10] - s[0], String(s[10] - s[0])], [q3 - q1, String(q3 - q1)]] }); },

() => { const cls = [[60, 70], [70, 80], [80, 90], [90, 100], [100, 110]], lim = 80; let e;
do { e = [R.int(10, 40), R.int(60, 110), R.int(30, 70), R.int(8, 25), R.int(2, 8)]; } while (e.reduce((s, x) => s + x, 0) % 10 !== 0);
const n = e.reduce((s, x) => s + x, 0), cen = cls.map((c) => (c[0] + c[1]) / 2), m = cen.reduce((s, c, i) => s + c * e[i], 0) / n, ex = e[2] + e[3] + e[4], pc = (ex / n) * 100; let cum = 0, km = 0; for (let i = 0; i < 5; i++) { cum += e[i]; if (cum >= n / 2) { km = i; break; } }
const mod = e.indexOf(Math.max(...e));
return X({ id: "stats", lv: 2, titre: "Le contrôle radar",
q: "Sur une route limitée à " + Q(lim, "km/h") + ", un radar a mesuré la vitesse de " + n + " véhicules un vendredi après-midi." + RX.tab(["Vitesse (km/h)", "Effectif"], cls.map((c, i) => [M("[" + c[0] + " \\,;\\, " + c[1] + "[") , e[i]])),
parts: [{ label: "Quelle est la classe modale ?", pts: 1 }, { label: "Quel pourcentage des véhicules roulait à 80 km/h ou plus (au dixième) ?", pts: 1 }, { label: "Estime la vitesse moyenne à l'aide des centres de classes (au dixième).", pts: 2 }, { label: "Dans quelle classe se trouve la médiane ? Justifie avec les effectifs cumulés.", pts: 2 }],
sol: ul([M("[" + cls[mod][0] + " \\,;\\, " + cls[mod][1] + "[") + " (effectif " + e[mod] + ").", M("\\frac{" + e[2] + " + " + e[3] + " + " + e[4] + "}{" + n + "} = \\frac{" + ex + "}{" + n + "} \\approx " + A(pc, 1) + "\\,\\%") + ".", M("\\bar{x} \\approx \\frac{" + cen.map((c, i) => c + " \\cdot " + e[i]).join(" + ") + "}{" + n + "} \\approx " + A(m, 1)) + " km/h.", "Effectifs cumulés : " + e.map((x, i) => e.slice(0, i + 1).reduce((s, y) => s + y, 0)).join(", ") + ". La " + n / 2 + "e valeur est dans " + M("[" + cls[km][0] + " \\,;\\, " + cls[km][1] + "[") + "."]),
chk: [[pc, A(pc, 1), 0.1], [m, A(m, 1), 0.1]] }); },

() => { const s = Array.from({ length: 7 }, () => R.int(12, 26)), m = mean(s), sig = sd(s), mF = 1.8 * m + 32, sF = 1.8 * sig, k = pk([2, 3]);
return X({ id: "stats", lv: 3, titre: "Une semaine de températures",
q: "Températures maximales d'une semaine à Genève (en °C) : " + M(lst(s)) + ".",
parts: [{ label: "Calcule la moyenne et l'écart-type (au centième).", pts: 2 }, { label: "Un touriste américain convertit chaque valeur en °F (" + M("F = 1{,}8C + 32") + "). Sans refaire tout le calcul, donne la moyenne et l'écart-type en °F.", pts: 2 }, { label: "Si chaque jour avait été " + k + " °C plus chaud, que deviendraient la moyenne et l'écart-type ?", pts: 1 }],
sol: ul([M("\\bar{x} = \\frac{" + s.reduce((a, b) => a + b, 0) + "}{7} \\approx " + A(m, 2)) + " °C ; " + M("\\sigma \\approx " + A(sig, 2)) + " °C.", "Moyenne : " + M("1{,}8 \\cdot " + A(m, 2) + " + 32 \\approx " + A(mF, 2)) + " °F. Écart-type : seul le facteur 1,8 agit sur les écarts, " + M("1{,}8 \\cdot " + A(sig, 2) + " \\approx " + A(sF, 2)) + " °F.", "Moyenne " + M("\\approx " + A(m + k, 2)) + " °C ; écart-type inchangé (" + M(A(sig, 2)) + ") : tous les écarts restent les mêmes."]),
chk: [[m, A(m, 2), 0.01], [sig, A(sig, 2), 0.01], [1.8 * s.map((x) => x).reduce((a, b) => a + b, 0) / 7 + 32, A(mF, 2), 0.01], [sd(s.map((x) => 1.8 * x + 32)), A(sF, 2), 0.02]] }); },
];
const RAISONS = [
() => { let s; do { s = Array.from({ length: 7 }, () => R.int(10, 60)); } while (new Set(s).size < 7 || s[3] === s.slice().sort((a, b) => a - b)[3]); const w = who(), sr = s.slice().sort((a, b) => a - b);
return X({ id: "quartiles", lv: 1, titre: "Trouve l'erreur",
q: "Pour la série " + M(lst(s)) + ", " + w + " affirme : « La médiane est " + s[3] + ", c'est la valeur du milieu ».",
parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne la bonne médiane.", pts: 1 }],
sol: ul(["Il faut d'abord ranger la série dans l'ordre croissant.", M(lst(sr)) + " : la médiane est la 4e valeur, " + M(sr[3]) + "."]),
chk: [[med(sr), String(sr[3])]] }); },
() => VF("stats", 1, [["« La moyenne d'une série est toujours une des valeurs de la série. »", false, "Contre-exemple : la moyenne de 4 et 5 est 4,5."],
["« Ajouter 10 points à toutes les valeurs ne change pas l'écart-type. »", true, "Tous les écarts à la moyenne restent les mêmes."],
["« Une valeur extrême modifie beaucoup la médiane. »", false, "La médiane dépend du rang, pas de la taille des valeurs extrêmes : c'est la moyenne qui bouge."],
["« Environ 50 % des valeurs sont entre " + M("Q_1") + " et " + M("Q_3") + ". »", true, "25 % sont sous " + M("Q_1") + " et 25 % au-dessus de " + M("Q_3") + "."],
["« La pointure des chaussures est une variable qualitative. »", false, "C'est un nombre que l'on mesure : quantitative discrète."],
["« Dans un diagramme circulaire, un secteur de 90° représente 25 % de l'effectif. »", true, M("\\frac{90}{360} = \\frac{1}{4}") + "."]]),
() => { const n1 = pk([10, 12, 14]), n2 = pk([24, 26, 30]), m1 = pk([4.2, 4.4, 4.8]), m2 = pk([3.9, 4.5, 5.1]), w = who(), mg = (n1 * m1 + n2 * m2) / (n1 + n2);
return X({ id: "stats", lv: 2, titre: "Trouve l'erreur",
q: "La classe A (" + n1 + " élèves) a une moyenne de " + N(m1).replace("{,}", ",") + " ; la classe B (" + n2 + " élèves) une moyenne de " + N(m2).replace("{,}", ",") + ". " + w + " dit : « La moyenne des deux classes ensemble est " + M("\\frac{" + N(m1) + " + " + N(m2) + "}{2} = " + N((m1 + m2) / 2)) + " ».",
parts: [{ label: "Pourquoi ce calcul est-il faux ?", pts: 1 }, { label: "Calcule la bonne moyenne (au centième).", pts: 2 }],
sol: ul(["Les classes n'ont pas le même effectif : chaque moyenne doit être pondérée par le nombre d'élèves.", M("\\frac{" + n1 + " \\cdot " + N(m1) + " + " + n2 + " \\cdot " + N(m2) + "}{" + (n1 + n2) + "} \\approx " + A(mg, 2)) + "."]),
chk: [[mg, A(mg, 2), 0.01]] }); },
];
RICH.affmp2 = { ids: ["affine", "droites", "recipaff", "affzero", "modaff", "droitesinter"], track: "mp", label: "Fonctions du premier degré (MP)", ex: EXA, raison: RAISONA, minutes: 45 };
RICH.trigmp2 = { ids: ["trigcercle", "trigfn", "sinlaw", "trigeq", "trigassoc", "trigeq2", "triaire"], track: "mp", label: "Trigonométrie (MP)", ex: EXT, raison: RAISONT, minutes: 45 };
RICH.statmp2 = { ids: ["statfreq", "stats", "quartiles"], track: "mp", label: "Analyse de données (MP)", ex: EXS, raison: RAISONS, minutes: 45 };
})();

